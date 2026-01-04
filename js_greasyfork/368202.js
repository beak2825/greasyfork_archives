// ==UserScript==
// @name         Fuck5u
// @version      0.1
// @description  开启进度条并去除防挂机验证
// @author       Hadwin
// @include      http://hz.5u5u5u5u.com/studyOnLine.action*
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/186511
// @downloadURL https://update.greasyfork.org/scripts/368202/Fuck5u.user.js
// @updateURL https://update.greasyfork.org/scripts/368202/Fuck5u.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var list_a = document.getElementsByName("flashvars");
    for(var i=0; i<list_a.length; i++) {
        //console.log(list_a[i].value);
        list_a[i].value = list_a[i].value.replace("uiMode=3", "uiMode=1");
        //console.log(list_a[i].value);
    }
    unsafeWindow.randomTime = 999999999;
    unsafeWindow.$(document).off("hide");
    unsafeWindow.courseware.ruleDto.mouseKeyboard = 0;
    console.log("已开启进度条！");
    console.log("已去除防挂机验证！");
})();