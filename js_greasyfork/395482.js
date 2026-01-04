// ==UserScript==
// @name         NU Scroll To Chapter List
// @namespace    ultrabenosaurus.novelupdates
// @version      0.8
// @description  Make NovelUpdates scroll to the chapter list automatically when you click on pagination
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://www.novelupdates.com/series/*
// @icon         https://www.google.com/s2/favicons?domain=novelupdates.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395482/NU%20Scroll%20To%20Chapter%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/395482/NU%20Scroll%20To%20Chapter%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    UBaddHash();
    UBaddPageOne();
    UBaddChapterHomeButton();

    setTimeout(function(){
        if(UBgetCookie('UBpaginationUpdated')!=""){
            UBaddHash();
            UBaddPageOne();
            UBaddChapterHomeButton();
            UBsetCookie('UBpaginationUpdated','',-30);
        }
    }, 2000);
})();

function UBaddHash(){
    var pages=document.querySelectorAll('.digg_pagination>a');
    var pLength=pages.length;
    for(var i=0;i<pLength;i++){
        if(pages[i].hash.split("#myTable").length!=2){
            pages[i].hash+="#myTable";
        }
    }
    pages=null;
    pLength=null;
    i=null;
}
function UBaddPageOne(){
    if(document.querySelectorAll('.digg_pagination>a.previous_page').length>0){
        document.querySelectorAll('.digg_pagination>a:nth-child(2)')[0].search="pg=1";
    }
}
function UBaddChapterHomeButton(){
    var hbCSS = "<style>#chBtn::before {content:'';position:relative;top:1px;float:left;width:12px;height:12px;margin-top:0.5em;background:url(/wp-content/themes/ndupdates-child/js/gh-icons.png) 0 99px no-repeat;background-position:0 -168px;}</style>";
    document.querySelectorAll('div.digg_pagination')[0].insertAdjacentHTML("afterbegin", hbCSS);
    var hbElem = "<a href='"+location.pathname+"' id='chBtn'>&nbsp;</a>";
    document.querySelectorAll('div.digg_pagination')[0].insertAdjacentHTML("afterbegin", hbElem);
}

function UBsetCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function UBgetCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}