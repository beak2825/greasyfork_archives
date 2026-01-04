// ==UserScript==
// @name         AntiUseless
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Let machine to learn garbage for you!
// @author       You
// @match        http://texy.yunxuetang.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382986/AntiUseless.user.js
// @updateURL https://update.greasyfork.org/scripts/382986/AntiUseless.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Disable the system alert window
    var alert=function(){return 1}
    var confirm=function(){return 1}
    var prompt=function(){return 1}
    setInterval(function(){
        if($("#dvWarningView")) $("#dvWarningView").find("Input").click()
        if($("#dvSingleTrack")) $("#dvSingleTrack").find("Input").click()
    },2000)


    var dlist = $(".el-plancourselist",$("#divcourselist"))
    if(dlist){
        var timer = 5000;
        dlist[1].childNodes.forEach(function (child) {
            var value = child.childNodes[9]
            if(value) var compl = child.childNodes[3].getAttribute("class") //picnostart piccomplected  picnostart last
            //console.log(compl);
            if(value && (compl == "picnostart " || compl == "picnostart  last") ){
                value=parseInt(value.innerHTML.slice(0,6))
                //console.log(value);
                setTimeout(function( ){
                    console.log(value);
                    child.childNodes[5].childNodes[2].click()
                    }, timer);
                timer += (value +2)*1000*60
            }
        });
    }else{
        console.log(0);
    }

})();