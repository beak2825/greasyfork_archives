// ==UserScript==
// @name         智慧树挂机刷课
// @namespace    https://www.null119.cn
// @version      0.3
// @description  挂机刷课
// @author       微信公众号：治廷君
// @match        https://hike.zhihuishu.com/aidedteaching/sourceLearning/sourceLearning?courseId=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/447766/%E6%99%BA%E6%85%A7%E6%A0%91%E6%8C%82%E6%9C%BA%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/447766/%E6%99%BA%E6%85%A7%E6%A0%91%E6%8C%82%E6%9C%BA%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

window.volchk=false;
window._lnum=-1;
var course_list;
function getListDiv() {
    var $ = window.jQuery;
	if ($(".right").length != 1) {
		printError();
		return null;
	}
	return $(".right")[0];
}

function printError() {
	console.log("错误: 无法获取到所需信息.")
}

function getClassName() {
	return getListDiv().firstElementChild.innerText;
}

function isCourseFinished(course) {
    var r=false
    if(course.childNodes.length==3){
        if (course.childNodes[0].className != undefined) {
            if(course.childNodes[0].className == "icon-video" || course.childNodes[0].className == "icon-doc") {
                if (course.childNodes[2].className != undefined && course.childNodes[2].className == "status-box") {
                    if (course.childNodes[2].childNodes.length == 1 && course.childNodes[2].childNodes[0].className == 'icon-finish') {
                        r= true;
                    }
                }
            }
        }
    }
	return r;
}

function enumChildNodes(obj, class_list) {
    var $ = window.jQuery;
	for (var i = 0; i < obj.childNodes.length; i++) {
		console.log(obj.childNodes[i].className)
		if (obj.childNodes[i].className != undefined && obj.childNodes[i].className.indexOf("file-item") != -1 && (obj.childNodes[i].childNodes[0].className == "icon-video" || obj.childNodes[i].childNodes[0].className == "icon-doc")) { 
			if (!isCourseFinished(obj.childNodes[i])) {
				class_list.push(obj.childNodes[i])
			}
		}
		else {
			enumChildNodes(obj.childNodes[i], class_list);
		}
	}
}

function checkFinish() {
    var $ = window.jQuery;
    course_list = getNeedStudyCourseList();
    if (window._lnum>course_list.length){
        return true
    } else {
        if($('.volumeIcon').length>0){
            if(!window.volchk){
                window.volchk=true
                $('.volumeIcon').click()
            }
        }
        if($(".video-box").length>0){
            return ($(".playButton").length > 0)
        }
        if($(".doc-box").length>0){
            return true
        }
    }
}

function getNeedStudyCourseList() {
    var $ = window.jQuery;
	var i;
    var list_div;
    var class_list;

    for (i = 0; i < getListDiv().childNodes.length; i++) {
		if (getListDiv().childNodes[i].className != undefined && getListDiv().childNodes[i].className.indexOf("source-list") != -1) {
			list_div = getListDiv().childNodes[i];
		}
	}

	for (i = 0; i < list_div.childNodes; i++) {
		if (getListDiv().childNodes[i].className != undefined && list_div.childNodes[i].className.indexOf("nano-content") != -1) {
			list_div = list_div.childNodes[i];
		}
	}

	class_list = new Array()
	enumChildNodes(list_div, class_list)
	return class_list
}

function getCourseName(obj) {
    if(obj.childNodes.length==3){
		if (obj.childNodes[1].className != undefined && obj.childNodes[1].className == "file-name") {
			return obj.childNodes[1].innerText;
		}
    }
	return null;
}

function init() {
    var $ = window.jQuery;
	h_timer = setInterval(function() {
        window.volchk=false;
        if (checkFinish()) {
            $(".playButton").click();
            clearInterval(h_timer);
			course_list = getNeedStudyCourseList();
            window._lnum=course_list.length;
			for (var i = 0; i < course_list.length; i++) {
				if (getCourseName(course_list[i]) == null) {
					console.log(course_list[i])
					printError();
					return;
				}
			}
			if (course_list.length < 1) {
				return;
			}
			h_timer = setInterval(function() {
				if (checkFinish()) {
					course_list[0].onclick();
				}
			}, 5000)
        }
    }, 5000)
}

var h_timer;
init();