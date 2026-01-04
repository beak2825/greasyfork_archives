// ==UserScript==
// @name         华医网视频加速
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://*.91huayi.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416684/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/416684/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //http://cme2.91huayi.com/course_ware/course_ware_polyv.aspx?cwid=aadaad9b-f610-4936-85d3-ab9200c40553
    //   var last_url='http://sd.91huayi.com/cme/course_ware_feedback.aspx?cwid='+relation_id+'&Organ_id='+organ_id;
    //  console.log(last_url);

    //  window.open(last_url);
    setTimeout(function() {
        var oVideo = document.getElementsByTagName('video')[0];

        if(oVideo){
            oVideo.currentTime=oVideo.duration-1

        }
    }, 3 * 1000);
    setTimeout(function() {
        oVideo = document.getElementsByTagName('video')[0];

        if(oVideo){
            oVideo.currentTime=oVideo.duration-1

        }
    }, 3 * 1000);
})();