// ==UserScript==
// @name          CCB Jurong e-answer script, written by Xiang
// @namespace     https://blog.csdn.net/weixin_43437893?type=blog
// @version       0.0.3
// @description  答题
// @author       项
// @match      http://www.geron-e.com/static/course/coursedetails/exercise/*


// @downloadURL https://update.greasyfork.org/scripts/448862/CCB%20Jurong%20e-answer%20script%2C%20written%20by%20Xiang.user.js
// @updateURL https://update.greasyfork.org/scripts/448862/CCB%20Jurong%20e-answer%20script%2C%20written%20by%20Xiang.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var myVar;
    function myFunction() {
        myVar = setInterval(alertFunc, 4000);
    }

    function alertFunc() {
        document.getElementById("nextTestQuestions").onclick = function() {
            var buttons= document.getElementsByTagName("input");
            var i = 0;
            for(i =0;i<buttons.length;i++){
                if(buttons[i].attributes['data-answer'].value == 'true'){
                    buttons[i].id = 'xiangjiawei'
                    document.getElementById("xiangjiawei").click()}}}
        document.getElementById("nextTestQuestions").click()
        document.getElementById("nextTestQuestions").click()
        location.reload();
    }
    myFunction()

    // Your code here...
})();