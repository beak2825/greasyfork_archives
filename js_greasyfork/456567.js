// ==UserScript==
// @name         江西财经大学自动评分--完全，亲自，同意！！
// @version      0.1
// @description  NONE
// @author       BreakingBody
// @match        http://172.29.5.184/*
// @license NONE

// @namespace https://greasyfork.org/users/997459
// @downloadURL https://update.greasyfork.org/scripts/456567/%E6%B1%9F%E8%A5%BF%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E5%88%86--%E5%AE%8C%E5%85%A8%EF%BC%8C%E4%BA%B2%E8%87%AA%EF%BC%8C%E5%90%8C%E6%84%8F%EF%BC%81%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/456567/%E6%B1%9F%E8%A5%BF%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E5%88%86--%E5%AE%8C%E5%85%A8%EF%BC%8C%E4%BA%B2%E8%87%AA%EF%BC%8C%E5%90%8C%E6%84%8F%EF%BC%81%EF%BC%81.meta.js
// ==/UserScript==


$(document).ready(function() { //When document has loaded

setTimeout(function() {

    var labels = document.getElementsByTagName('label'); //get the labels
for (var i = 0; i < labels.length; ++i) { //loop through the labels
    if (labels[i].textContent == "完全同意") { //check label text
        labels[i].click(); //if correct text, click the label
    }
}

//Code to run After timeout elapses

}, 2000); //Two seconds will elapse and Code will execute.

});