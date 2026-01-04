
// ==UserScript==
// @name         csdn clear AD
// @namespace    http://tampermonkey.net/
// @include      https://blog.csdn.net/*
// @version      0.1
// @description  try to take over the world!
// @author       huanghanhui
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378262/csdn%20clear%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/378262/csdn%20clear%20AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    !document.getElementsByClassName('pulllog-box').length>0?'':document.getElementsByClassName('pulllog-box')[0].style="display:none";
    !document.getElementsByTagName("aside").length>0?'':document.getElementsByTagName("aside")[0].remove();
    !document.getElementsByClassName('recommend-box').length>0?'':document.getElementsByClassName('recommend-box')[0].style="display:none";
    !document.getElementsByClassName('meau-gotop-box').length>0?'':document.getElementsByClassName('meau-gotop-box')[0].style="display:none";
    !document.getElementsByClassName('p4course_target').length>0?'':document.getElementsByClassName('p4course_target')[0].style="display:none";
    !document.getElementsByClassName('comment-box').length>0?'':document.getElementsByClassName('comment-box')[0].style="display:none";
    !document.getElementById('mainBox')?'':document.getElementById('mainBox').style="float: none;margin: auto;"
    !document.getElementById('btn-readmore')?'':document.getElementById('btn-readmore').click();
    !document.getElementsByTagName('main').length>0?'':document.getElementsByTagName('main')[0].style="float: none;margin: auto;";
    !document.getElementsByClassName('tool-box').length>0?'':document.getElementsByClassName('tool-box')[0].style="display:none";
    !document.getElementsByClassName('recommend-right').length>0?'':document.getElementsByClassName('recommend-right')[0].style="display:none";
})();
