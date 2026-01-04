// ==UserScript==
// @name         常州继续教育学习全自动选择未学课程
// @namespace    http://www.52love1.cn/
// @version      1.1
// @description  常州继续教育学习全自动选择未学课程，配合自动学习插件使用
// @author       G魂帅X
// @include      http://www.czjxjy.cn/*
// @exclude      http://www.czjxjy.cn
// @exclude      http://www.czjxjy.cn/
// @exclude      http://www.czjxjy.cn/coursePlaySfpServlet.do?*
// @exclude      http://www.czjxjy.cn/coursePlayServlet.do?*
// @run-at       document-end
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/422688/%E5%B8%B8%E5%B7%9E%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%85%A8%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%AA%E5%AD%A6%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/422688/%E5%B8%B8%E5%B7%9E%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%85%A8%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%AA%E5%AD%A6%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var domain = window.location.host;
    var origin = window.location.origin;
    var curUrl = window.location.href;
    console.log(window.location);
    function doOpenStart(courseId,turn,tmpTurn,curChapterTurn,curPos,isPass,courseType){
		if(turn==0){
			turn=1;
		}
		if(curChapterTurn==0){
		   curChapterTurn=1;
		}
		if(isPass==0){
			if(turn<tmpTurn){
				alert("抱歉，您必须学完之前的所有章节！");
				return ;
			}
	    }

		var jKey = getJXKey(courseId,turn,curChapterTurn);
		var url = "/coursePlayServlet.do?course_id="+courseId +"&chapter_id="+turn +"&turn="+curChapterTurn+"&position="+curPos+"&jkey="+jKey;
		if(courseType == 4){		//COURSE_TYPE_SFP
			url = "/coursePlaySfpServlet.do?course_id="+courseId +"&chapter_id="+turn +"&turn="+curChapterTurn+"&position="+curPos+"&jkey="+jKey;
		}else if(courseType == 1){  //COURSE_TYPE_FLV
			url = "/coursePlayServlet.do?course_id="+courseId +"&chapter_id="+turn +"&turn="+curChapterTurn+"&position="+curPos+"&jkey="+jKey;
		}
        // window.location.href = url;
        GM_openInTab(origin + url, { active: true, insert: true, setParent :true });
	}

    if (curUrl.indexOf('learnCourseChapterServlet') > -1) {
        //学习章节列表
        var $a = $('#ul1 a');
        var len = $a.length;
        var isFinished = true;
        var aStr = '', keyStr = '', keyArr = [];
        if ($a.eq(0).find('img').attr('src').indexOf('xx_kx2') > -1) {
            //从未学习过
            isFinished = false;
            aStr = $a.eq(0).attr('href');
            keyStr = aStr.split('(')[1].split(')')[0];
            keyArr = keyStr.split(',');
            doOpenStart(parseInt(keyArr[0]), parseInt(keyArr[1]), parseInt(keyArr[2]), parseInt(keyArr[3]), parseInt(keyArr[4]), parseInt(keyArr[5]), parseInt(keyArr[6]));
        } else {
            for (var i = 0; i < len; i++) {
                if ($a.eq(i).find('img').attr('src').indexOf('xx_ks') > -1) {
                    //开始按钮
                    isFinished = false;
                    aStr = $a.eq(i).attr('href');
                    keyStr = aStr.split('(')[1].split(')')[0];
                    keyArr = keyStr.split(',');
                    doOpenStart(parseInt(keyArr[0]), parseInt(keyArr[1]), parseInt(keyArr[2]), parseInt(keyArr[3]), parseInt(keyArr[4]), parseInt(keyArr[5]), parseInt(keyArr[6]));
                    break;
                }
            }
        }
        if (isFinished) {
            //当前课程全部学完，回到未学习课程列表
            window.location.href = '/learnCourseUnOverServlet.do';
        }
    } else if (curUrl.indexOf('learnCourseUnOverServlet') > -1) {
        //未完成课程选择页
        if ($('#ul ul').length > 1) {
            //默认选择第一个课程进入章节列表
            var nextUrl = $('#ul ul').eq(1).find('a').eq(1).attr('href');
            window.location.href = nextUrl;
        } else {
            //进入考试列表页
            window.location.href = '/learnExamListServlet.do';
        }
    } else if (curUrl.indexOf('learnCenterServlet') > -1) {
        if (confirm('确定开始自动学习？')) {
            window.location.href = '/learnCourseUnOverServlet.do';
        }
    }
})();