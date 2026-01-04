// ==UserScript==
// @name         青骄第二课堂跳过视频
// @namespace    https://www.qqzhi.cc/
// @version      0.1
// @description  青骄第二课堂跳过课程视频环节直接考试
// @author       旅禾Tristan
// @match        https://2-class.com/courses/*
// @icon         http://img.alicdn.com/tfs/TB13RHdl8r0gK0jSZFnXXbRRXXa-32-32.png
// @grant        none
// @license      MIT
//
// @downloadURL https://update.greasyfork.org/scripts/453587/%E9%9D%92%E9%AA%84%E7%AC%AC%E4%BA%8C%E8%AF%BE%E5%A0%82%E8%B7%B3%E8%BF%87%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/453587/%E9%9D%92%E9%AA%84%E7%AC%AC%E4%BA%8C%E8%AF%BE%E5%A0%82%E8%B7%B3%E8%BF%87%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href.search("/courses/exams/")==-1){
        window.location.href=window.location.href.replace("/courses/","/courses/exams/");
    }
})();