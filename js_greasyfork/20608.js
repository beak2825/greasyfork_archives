// ==UserScript==
// @name         Write Solutions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://severinpreisig.ch/moodle/mod/quiz/attempt.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20608/Write%20Solutions.user.js
// @updateURL https://update.greasyfork.org/scripts/20608/Write%20Solutions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var var1 = JSON.parse(prompt("Put here soulution array:"));//list here
    // islist = false;//change if "select"
    // isTwin = false;//change if it comes in pairs "text&select"
    var isMultiple = false;//change if multiple questions(dont work for now)
    if(isMultiple)
    {
        var allofit = document.documentElement.innerHTML;
        var allstart = allofit.search(/q[0-9][0-9][0-9][0-9]:[0-9]_answer/i);
        var id=allofit.substring(allstart,allstart+6);
    }
    else
    {
        var allofit = document.documentElement.innerHTML;
        var allstart = allofit.search(/q[0-9][0-9][0-9][0-9]:[0-9]_sub1_answer/i);
        var id=allofit.substring(allstart,allstart+7);
    }
    var listList = [];
    var tmplist = [];

    var1.forEach(function(val,i){
        if(isMultiple)
        {
            if(getdocument.getElementById(id+(i+1)+"_sub1_answer").tagName == "SELECT")
            {
                [].slice.call(document.getElementById(id+(i+1)+"_sub1_answer").getElementsByTagName("option")).forEach(function(div,i2){
                    if((div.innerHTML==val) && (div.innerHTML!=="")) var1[i] = i2-1;
                });
            }
        }
        else
        {
            if(document.getElementById(id+"_sub"+(i+1)+"_answer").tagName == "SELECT")
            {
                [].slice.call(document.getElementById(id+"_sub"+(i+1)+"_answer").getElementsByTagName("option")).forEach(function(div,i2){
                    if((div.innerHTML==val) && (div.innerHTML!=="")) var1[i] = i2-1;
                });
            }
        }
    });

    var1.forEach(function(currentValue,index){
        if(isMultiple) document.getElementById(id+(index+1)+"_answer").value=currentValue;
        else document.getElementById(id+"_sub"+(index+1)+"_answer").value=currentValue;
    });
})();