// ==UserScript==
// @name         ESC-vrInshore-hance
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  dksfjkasldf
// @author       You
// @match        https://www.virtualregatta.com/en/inshore-game/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=virtualregatta.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445785/ESC-vrInshore-hance.user.js
// @updateURL https://update.greasyfork.org/scripts/445785/ESC-vrInshore-hance.meta.js
// ==/UserScript==

// @license MIT 

(function() {
    'use strict';

    // 头部
    document.querySelector("#top-header").remove();
    document.querySelector("#main-header").remove();
    document.querySelector("#page-container").setAttribute("style", "padding:0;");
    // 脚步
    document.querySelector("#main-footer").remove();
    document.querySelector(".et_pb_with_background").remove();
    document.querySelector("#sfsi_floater").remove();

    // 页面变大
    document.querySelector('.webgl-content > .footer').innerHTML = '<span style="padding-left:24px">帆船家-VRI线上帆船赛!</span>';
    document.querySelector(".et_pb_row").setAttribute("style", "padding:0;width:100%;max-width:none");
    document.querySelector(".et_pb_section_0").setAttribute("style", "padding:0;");

    // 背景颜色
    document.querySelector("#gameContainer").setAttribute("style", "background-color:black");
    document.querySelector("body").setAttribute("style", "background-color:black");

})();