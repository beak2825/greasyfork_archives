// ==UserScript==
// @name         Dytt NoAd
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to delete the advertisement of Dytt8!
// @author       Hwang
// @match        *://www.dytt8.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40307/Dytt%20NoAd.user.js
// @updateURL https://update.greasyfork.org/scripts/40307/Dytt%20NoAd.meta.js
// ==/UserScript==

function deleteElementById(id) {
    var timeout = 0;
    var interval = setInterval(function() {
        timeout ++;
        var obj_ad = document.getElementById(id);
        if(obj_ad) {
            deleteElement(obj_ad);
            clearInterval(interval);
        }
        if(timeout>50) {
            clearInterval(interval);
        }
    }, 100);
}

function deleteElement(element) {
     element.innerHTML="";
     var element_parent = element.parentNode;
     element_parent.removeChild(element);
}

if (document.URL == "http://www.dytt8.net/") {
    var timeout_0 = 0;
    var interval_0 = setTimeout(function() {
        timeout_0 ++;
        var obj_ad_0 = document.body.childNodes[0];
        if(obj_ad_0) {
            obj_ad_0.innerHTML="";
            var obj_ad_0_parent = obj_ad_0.parentNode;
            obj_ad_0_parent.removeChild(obj_ad_0);
            clearInterval(interval_0);
            //alert("Interval_0 Finish!");
        }
        if(timeout_0>50) {
            clearInterval(interval_0);
            //alert("Interval_0 Timeout!");
        }
    }, 1000);
}
deleteElementById("cs_DIV_cscpvrich5041B");
deleteElementById("cs_CFdivdlST_B_0");
deleteElementById("cs_CFdivdlST_B_1");
deleteElement(document.getElementsByTagName("iframe")[0]);
deleteElement(document.getElementsByTagName("iframe")[0]);
deleteElement(document.getElementsByTagName("iframe")[0]);
