// ==UserScript==
// @name        Click to set default description
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Just a simple util to to make submitting bug easier
// @author       You
// @match        *://*.atlassian.net/*
// @match        *://47.92.50.148:8080/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371666/Click%20to%20set%20default%20description.user.js
// @updateURL https://update.greasyfork.org/scripts/371666/Click%20to%20set%20default%20description.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Your code here...
    $("body").click(function() {
        // switch_mode();
        write_template();
    });
    $("#create_link").click(function(){
        setTimeout(function(){
            switch_mode();
            write_template();
        }, 200)
        setTimeout(function(){
            switch_mode();
        }, 1000)
        setTimeout(function(){
            switch_mode();
            write_template();
        }, 200)
    });
 })();

function write_template(){
    if (window.location.href.indexOf("atlassian.net")!=-1 && $("#description") && $("#description").html().trim() == "") {
        $("#description").html("Environment: http://gy-pms5-qa.innosnap.local \n" + "Account: guyong@patsnap.com / patsnap2015 \n" + "\n" + "Steps: \n" + "1. \n" + "2. \n" + "3. \n" + "\n" + "Expect:\n" + "\n" + "\n" + "Actual:\n" + "\n" + "\n");
    }else if(window.location.href.indexOf("47.92.50.148:8080")!=-1) {
        var template="Environment: https://xxxx.ipms-qa.innosnap.com \n" + "Account: xxxx@patsnap.com / xxxxxxxxx \n" + "\n" + "Steps: \n" + "1. \n" + "2. \n" + "3. \n" + "\n" + "Expect:\n" + "\n" + "\n" + "Actual:\n" + "\n" + "\n";
        if($("#description") && $("#description").html().trim() == ""){
            $("#description").html(template);
        }else if(!$("#description")){
            $("#aui-uid-1").click();
        }
    }
}

function switch_mode(){
    if($("[role=tab]:contains('Text')")) {
        $("[role=tab]:contains('Text')").click();
    }
}