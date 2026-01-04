// ==UserScript==
// @name         Autodbdxdaka
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Caijibai
// @match         *://stuinfo.neu.edu.cn/cloud-xxbl/studentinfo?tag=*
// @downloadURL https://update.greasyfork.org/scripts/397621/Autodbdxdaka.user.js
// @updateURL https://update.greasyfork.org/scripts/397621/Autodbdxdaka.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var box = document.getElementsByClassName('listMian')[0];
    if (box) {
        box.addEventListener('dblclick', function(){
            document.getElementById('studentinfo').children[17].children[1].value="A"
            document.getElementById('studentinfo').children[29].children[1].value="否"
            document.getElementById('studentinfo').children[32].children[1].value="家"
            document.getElementById('studentinfo').children[33].children[1].value="无"
            document.getElementById('studentinfo').children[34].children[1].value="否"
            document.getElementById('studentinfo').children[36].children[1].value="否"
            document.getElementById('studentinfo').children[38].children[1].value="否"
            document.getElementById('studentinfo').children[40].children[1].value="否"
            document.getElementById('studentinfo').children[42].children[1].value="否"
            document.getElementById('studentinfo').children[44].children[1].value="否"
            document.getElementById('studentinfo').children[47].children[1].value="无"
            document.getElementById('studentinfo').children[50].children[1].value="无"
            document.getElementById('studentinfo').children[52].children[1].value="无"
        });
    }
})();