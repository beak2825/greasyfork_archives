// ==UserScript==
// @name         拓疆123
// @version      0.1.123
// @description  监控面板，自动播放、防挂机、课后练习...
// @author       Xiguayaodade
// @license      MIT
// @match        *://www.tuojiangpt.com/*
// @grant        GM_info
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @namespace    http://tampermonkey.net/
// @homepage     http://8.130.116.135/?article/
// @source       http://8.130.116.135/?article/
// @icon         https://picx.zhimg.com/v2-ce62b58ab2c7dc67d6cabc3508db5795_l.jpg?source=32738c0c
// @connect      icodef.com
// @connect      localhost
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/479318/%E6%8B%93%E7%96%86123.user.js
// @updateURL https://update.greasyfork.org/scripts/479318/%E6%8B%93%E7%96%86123.meta.js
// ==/UserScript==

(function() {
    'use strict';

    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest
    let aa = new Date().getTime();
    GM_xmlhttpRequest({
        method: "GET",
        headers: {
            "X-Access-Token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTkzNzI0NTYsInVzZXJuYW1lIjoiZWR1X3BhcnRpY2lwYW50c18yXzEzMzA5OTMyMjkxIn0.5-rf2WkQ908FVl5XSx1Eb4JpUrC0rExt0LpPPavEsTk"
        },
        url: 'https://www.tuojiangpt.com/tjep-edu/exam/examinationTitle/getCourseExamList?studyRecordId=1721816205955747841&participantsId=1721763235876622342&courseId=1673955805793189889&sessiontimeout='+aa,
        onload: function(response) {
            var reText = response.responseText;
            var obj = JSON.parse(reText).result;
            console.log('请求成功：response->',obj.length);
            console.log('请求成功：response->',obj);
            for(let i=0;i<obj.length;i++){
                console.log('请求成功：response->',obj[i].rightKeySnList[0]);
            }
        }
    })

    // Get the token from local storage
    const token = localStorage.getItem('token');

    if (token) {
        console.log('Local token:', token);
        // Do something with the token
    } else {
        console.error('Token not found in local storage');
    }
})();