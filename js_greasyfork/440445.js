// ==UserScript==
// @name         MyEd Keeper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  refresh MyEd!!!! to make it keep logging in
// @author       ljtd8
// @match        https://www.myed.ed.ac.uk/myed-progressive/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ed.ac.uk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440445/MyEd%20Keeper.user.js
// @updateURL https://update.greasyfork.org/scripts/440445/MyEd%20Keeper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    let $btnTest = document.createElement('div')
    let $btnSetTime = document.createElement('div')
    var inter_time = localStorage.getItem('inter_time')?localStorage.getItem('inter_time'):10000
    var inter = window.setInterval(internal_refresh, inter_time);

    function internal_refresh(){
        if('https://www.myed.ed.ac.uk/myed-progressive/#/'==location.href || "https://www.myed.ed.ac.uk/myed-progressive/#/student-home"==location.href){
            console.log("is here");
            _refresh();
        }
    }

    function _refresh(){
        location.reload();
    }

    function set_internal()
    {
        inter_time=prompt("set Internal time(ms)",inter_time); // 弹出input框
        if (!isNaN(inter_time) && inter_time>=5000) {
            window.clearInterval(inter);
            localStorage.setItem('inter_time', inter_time);
            inter = setInterval(internal_refresh, inter_time);
        }
        else{
            window.alert("inter_time must be more than 5000!!");
            inter_time = 5000;
        }
    }

	    // 添加操作的 dom
    function _appendDom() {
        const baseStyle = `
      position: fixed;
      top: 50px;
      right: 50px;
      height: 40px;
      padding: 0 20px;
      z-index: 9999;
      color: white;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      line-height: 40px;
      text-align: center;
      border-radius: 4px;
      background-color: #3498db;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.3);
    `
    $btnTest.innerHTML = 'test'
    $btnSetTime.innerHTML = 'set'
    $btnTest.style = baseStyle
    $btnSetTime.style = baseStyle + `top: 100px;`
    $btnTest.addEventListener('click', _refresh)
    $btnSetTime.addEventListener('click', set_internal)
    document.getElementsByTagName('html')[0].insertBefore($btnTest, document.getElementsByTagName('head')[0]);
    document.getElementsByTagName('html')[0].insertBefore($btnSetTime, document.getElementsByTagName('head')[0]);
  }

    _appendDom();


})();