// ==UserScript==
// @name         江西教师全员培训
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  挂机
// @author       GuanHuang
// @match        http://*.stu.teacher.com.cn/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/382388/%E6%B1%9F%E8%A5%BF%E6%95%99%E5%B8%88%E5%85%A8%E5%91%98%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/382388/%E6%B1%9F%E8%A5%BF%E6%95%99%E5%B8%88%E5%85%A8%E5%91%98%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ti = 1000;
	var c_name = ['circleId', 'projectPhaseId', 'userId'];

    if (getCookie(c_name[0]) != "" && getCookie(c_name[1]) != "" && window.location.href.indexOf('intoSelectCourse') != -1) {
    	setInterval(function () {
    		if ($(".noteRrror").length > 0) {
    			gotourl();
    		} else {
    			fireKeyEvent(document.body, 'keydown', 40);
    		}
    		console.log("启动中...............");
    	}, ti * 10);
    } else if (window.location.href.indexOf('intoStudentStudy') != -1){
    	setCookie(c_name[0], circleId);
    	setCookie(c_name[1], projectPhaseId);
    }

    function gotourl() {
    	GM_xmlhttpRequest({
	        method: "POST",
	        data: 'circleId=' + getCookie(c_name[0]) + '&projectPhaseId=' + getCookie(c_name[1]) + '&userId' + getCookie(c_name[2]),
		    url: "http://pn201936003.stu.teacher.com.cn:80/studyPlan/findStudyPlanByProjectPhaseAndCircleId",
		    headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
		    onload: function(response) {
		    	if (response.status == 200) {
		    		var queryrate = $.parseJSON(response.responseText);
		    		var stulist = queryrate.data.studyPlanLinkList;
		    		bloop:
		    		for (let a in stulist) {
		    			if (stulist[a].type == '选课模块') {
		    				var cuserlist = stulist[a].selectCourseModule.courseUserList;
		    				var comcuserlist = stulist[a].selectCourseModule.compulsoryCourseList;
		    				for (let b in cuserlist) {
		    					if (cuserlist[b].isComplete != '2') {
		    						for (let c in comcuserlist) {
		    							if (cuserlist[b].courseId == comcuserlist[c].courseId) {
		    								if (comcuserlist[c].courseStyle == 1) {
				    							var link1 = 'http://pn201936003.stu.teacher.com.cn:80/course/intoSelectCourseVideo?studyPlanId='+queryrate.data.studyPlan.id+'&studyPlanLinkId='+stulist[a].id+'&courseCode='+comcuserlist[c].courseCode+'&courseId='+comcuserlist[c].courseId+'&courseName='+encodeURI(comcuserlist[c].courseName);
				    							window.location.href = link1;
				    						} else if (comcuserlist[c].courseStyle == 2) {
				    							var link2 = 'http://pn201936003.stu.teacher.com.cn:80/course/intoSelectCourseUrlVideo?studyPlanId='+queryrate.data.studyPlan.id+'&studyPlanLinkId='+stulist[a].id+'&courseCode='+comcuserlist[c].courseCode+'&courseId='+comcuserlist[c].courseId+'&courseName='+encodeURI(comcuserlist[c].courseName);
				    							window.location.href = link2;
				    						}
				    						break bloop;
		    							}
		    						}
		    					}
		    				}
		    			}
		    		}
		    		
		        }
		    }
	    });
    }
    
    function fireKeyEvent(el, evtType, keyCode){
		var doc = el.ownerDocument,
			win = doc.defaultView || doc.parentWindow,
			evtObj;
		if(doc.createEvent){
			if(win.KeyEvent) {
				evtObj = doc.createEvent('KeyEvents');
				evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );
			} else {
				evtObj = doc.createEvent('UIEvents');
				Object.defineProperty(evtObj, 'keyCode', {
			        get : function() { return this.keyCodeVal; }
			    });     
			    Object.defineProperty(evtObj, 'which', {
			        get : function() { return this.keyCodeVal; }
			    });
				evtObj.initUIEvent( evtType, true, true, win, 1 );
				evtObj.keyCodeVal = keyCode;
				if (evtObj.keyCode !== keyCode) {
			        console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
			    }
			}
			el.dispatchEvent(evtObj);
		} else if(doc.createEventObject){
			evtObj = doc.createEventObject();
			evtObj.keyCode = keyCode;
			el.fireEvent('on' + evtType, evtObj);
		}
	}


	function setCookie(cname, cvalue, exdays = 1) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	    var expires = "path=/;expires=" + d.toGMTString();
	    document.cookie = cname + "=" + escape(cvalue) + "; " + expires;
	}

	function getCookie(objName) {
	    var arrStr = document.cookie.split("; ");
	    for (var i = 0; i < arrStr.length; i++) {
	        var temp = arrStr[i].split("=");
	        if (temp[0] == objName) return unescape(temp[1]);
	    }
	    return "";
	}

})();