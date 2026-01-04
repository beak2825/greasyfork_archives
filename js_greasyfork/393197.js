// ==UserScript==
// @name         vClass Video Frame
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://vclass.neusoft.edu.cn/course/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393197/vClass%20Video%20Frame.user.js
// @updateURL https://update.greasyfork.org/scripts/393197/vClass%20Video%20Frame.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        $("#startExamId").css({"backgroundColor":"blue"});
        $("#startExamId").attr({"data-toggle":"modal","data-target":".practice-exampaper-modal"});
    }, 300)
})();
