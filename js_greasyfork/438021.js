// ==UserScript==
// @name         可以选中DLsite站标题
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enable DLsite title to be selected
// @author       Steve
// @match        https://www.dlsite.com/maniax/work/=/*
// @icon         https://www.dlsite.com/images/web/common/logo/pc/logo-dlsite-r18.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438021/%E5%8F%AF%E4%BB%A5%E9%80%89%E4%B8%ADDLsite%E7%AB%99%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/438021/%E5%8F%AF%E4%BB%A5%E9%80%89%E4%B8%ADDLsite%E7%AB%99%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var h = $('h1#work_name');
    $(h).attr("id","work_nam");
    //alert($(h).attr("id"));

})();