// ==UserScript==
// @name         UC
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  哈哈哈哈 Try to take over the world!
// @author       sulen
// @match        https://*/*
// @icon         https://www.gxela.gov.cn/favicon.ico
// @grant        none
// @require      https://code.jquery.com/jquery-3.0.0.min.js
// @license      End-User License Agreement
// @downloadURL https://update.greasyfork.org/scripts/519060/UC.user.js
// @updateURL https://update.greasyfork.org/scripts/519060/UC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function move(){
        //首页
        document.getElementById("popup").style.display='none';
        document.getElementById("showModalAnn").style.display='none';
        document.getElementsByClassName("modal-backdrop")[0].style.display='none';
        document.getElementsByClassName("my-nav-box")[2].style.display='none';
        document.getElementsByClassName("x_card_box")[0].style.display='none';
        document.getElementsByClassName("x_card_box")[0].style.display='none';
        document.getElementsByClassName("wqavvjqa")[0].style.display='none';


        //播放页
        document.getElementsByClassName("tips-remind")[0].style.display='none';
        document.getElementById("space_default_03").style.display='none';
        document.getElementsByClassName("video-b-btn-box")[0].style.display='none';
        document.getElementsByClassName("ovirldlq")[0].style.display='none';
        document.getElementsByClassName("item-box")[1].style.display='none';
        document.getElementsByClassName("item-box")[2].style.display='none';
        document.getElementsByClassName("my-nav-box")[2].style.display='none';
    }

    $(function(){move()});
    move()
    window.onload = function() {move()}

})();