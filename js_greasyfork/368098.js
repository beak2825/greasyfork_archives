// ==UserScript==
// @name         faxuan_course
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto complete faxuan course
// @author       You
// @match        http://xf.faxuan.net/sps/courseware/t/courseware_1_t.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368098/faxuan_course.user.js
// @updateURL https://update.greasyfork.org/scripts/368098/faxuan_course.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load',function(){
        //添加按钮
        var a = document.getElementById('exitCourse');
        a.href = 'javascript:;';

        a.onclick = function(){
            clearTimeout(sps.onlineTimeTask);

            let m = parseInt(Math.random() * 10) + 10;
            let s = parseInt(Math.random() * 10) + 10;
            let t = '00:' + m + ':' + s;
            let u = document.getElementById('ware_time_num');
            u.innerHTML = t;
            this.onclick = function(){
                sps.exitSt('ware_time_num');
            };
        };
        var yy = setTimeout(function(){sps.prompthide('prompt2');clearTimeout(yy);},300);
    });
})();