// ==UserScript==
// @name         黄冈网校Vip
// @namespace    https://greasyfork.org/zh-CN/users/28675-%E9%9B%A8%E9%9B%BE%E6%98%9F%E5%A4%A9
// @version      0.1
// @description  黄冈网校视频免登陆免费看
// @author       雨雾星天
// @match        http://www.huanggao.com/web/html/*
// @exclude      */index-content.jsp
// @require      https://code.jquery.com/jquery-latest.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/30685/%E9%BB%84%E5%86%88%E7%BD%91%E6%A0%A1Vip.user.js
// @updateURL https://update.greasyfork.org/scripts/30685/%E9%BB%84%E5%86%88%E7%BD%91%E6%A0%A1Vip.meta.js
// ==/UserScript==

/// <reference path="typings/globals/jquery/index.d.ts"/>

$(document).ready(function(e) {
    //去验证
    index.datas.allRight = true;
    //去提示弹窗
    noRight = function() {};
    var lessonType = 0;
    var lesson;
    if ((lesson = getCustomLessons(location.href)) !== null) {
        lessonType = 0;
    } else if ((lesson = getSpecialLessons(location.href)) !== null) {
        lessonType = 1;
    } else if ((lesson = getSpecialLessons1(location.href)) !== null) {
        lessonType = 2;
    } else {
        return;
    }
    loadData(lessonType);
    console.log(lesson);
    $(document).on("click", lesson.selector, function(e) {
        //去验证
        index.datas.allRight = true;
        //去提示弹窗
        noRight = function() {};
        var objs = $(lesson.selector);
        var index0 = objs.index($(this));
        console.log(index0);
        console.log(this);
        console.log(lessonType);
        if (index0 < 0) return;
        switch (lessonType) {
            case 0:
                lesson.func(index0);
                break;
            case 1:
                lesson.func(index.datas.data.lessonList[index0].scl_title, index.datas.data.lessonList[index0].scl_url_zip);
                break;
            case 2:
                lesson.func(index.datas.data.lessonList[index0].sn_id);
                break;
        }
    });

});

function getCustomLessons(url) {
    var selector0 = "";
    var func0 = null;
    //视频课程
    if (url.indexOf("knowledgeStrengthen/index.jsp") > 0) {
        selector0 = ".col-xs-6.col-sm-4.col-md-3";
        func0 = index.study;
    } //同步作业
    else if (url.indexOf("homework/index.jsp") > 0) {
        selector0 = ".col-xs-4.col-sm-3.col-md-2";
        func0 = index.openBook;
    } //同步作业详情
    else if (url.indexOf("homework/section.jsp") > 0) {
        selector0 = ".cursor-pointer";
        func0 = index.openSection;
    } //动感课堂
    else if (url.indexOf("flash/index.jsp") > 0) {
        selector0 = ".col-xs-6.col-sm-4.col-md-3";
        func0 = index.study;
    } //快读快记
    else if (url.indexOf("fastRead/index.jsp") > 0) {
        selector0 = ".col-xs-6.col-sm-4.col-md-3";
        func0 = index.study;
    } //听力教室
    else if (url.indexOf("engListen/index.jsp") > 0) {
        selector0 = ".cursor-pointer";
        func0 = index.study;
    } //单词快记
    else if (url.indexOf("engWords/index.jsp") > 0) {
        selector0 = ".cursor-pointer";
        func0 = index.study;
    } else {
        return null;
    }
    return {
        selector: selector0,
        func: func0
    };
}

function getSpecialLessons(url) {
    var selector0 = "";
    var func0 = null;
    var loadData = null;
    //黄冈密卷
    if (url.indexOf("hgPapers/index.jsp") > 0) {
        selector0 = ".cursor-pointer";
        func0 = index.study;
        loadData = index.loadData;
    } //奥赛题选
    else if (url.indexOf("olympic/index.jsp") > 0) {
        selector0 = ".cursor-pointer";
        func0 = index.study;
        loadData = index.loadData;
    } //朗诵赏析
    else if (url.indexOf("declaim/index.jsp") > 0) {
        selector0 = ".cursor-pointer";
        func0 = index.study;
        loadData = index.loadData;
    } //动感课堂详情
    else if (url.indexOf("flash/showFlash.jsp") > 0) {
        selector0 = ".cst-ellipsis-1";
        func0 = m.study1;
        loadData = m.loadData;
    } else {
        return null;
    }
    return {
        selector: selector0,
        func: func0
    };
}

function getSpecialLessons1(url) {
    var selector0 = "";
    var func0 = null;
    //写作天地
    if (url.indexOf("writing/index.jsp") > 0) {
        selector0 = ".cursor-pointer";
        func0 = index.study;
    } //赤壁文学
    else if (url.indexOf("secondClassroom/index.jsp") > 0) {
        selector0 = ".cursor-pointer";
        func0 = index.study;
    } else {
        return null;
    }
    return {
        selector: selector0,
        func: func0
    };
}

function loadData(lessonType) {
    if (lessonType === 0) return;
    var ld = index.loadData;
    index.loadData = function() {
        ld();
        $.ajax({
            type: "POST",
            url: index.URL.LESSON_LIST,
            dataType: "json",
            data: {
                'start': index.page.start,
                'limit': index.page.limit,
                'gradeId': index.datas.gradeId,
                'subjectId': index.datas.subjectId,
                'typeId': index.datas.typeId,
                'columnId': index.datas.columnId,
                'type': index.datas.type
            },
            complete: function(data) {
                data = tools.toJSON(data);
                index.datas.data = data;
            }
        });
    };
    index.loadData();
}