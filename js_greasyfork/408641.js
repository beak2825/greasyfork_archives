// ==UserScript==
// @name         manhuaDB Show All Imgs
// @version      0.2
// @description  This script will load full chapter in one page. Default speed is 4s per page. Only for manhuaDB.
// @author       Eroko
// @match        https://www.manhuadb.com/manhua/*
// @grant        none
// @namespace https://greasyfork.org/users/170904
// @downloadURL https://update.greasyfork.org/scripts/408641/manhuaDB%20Show%20All%20Imgs.user.js
// @updateURL https://update.greasyfork.org/scripts/408641/manhuaDB%20Show%20All%20Imgs.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log(img_data_arr)
    $(".ad_1_wrap").remove();
    $(".ad_2_wrap").remove();
    for (let i = page; i < img_data_arr.length; i++) {
        setTimeout(function () {
            let url3 = img_host + "/static/" + p_ccid + "/" + p_id + "/" + img_data_arr[i]["img"]
            let k = i + 1
            var html = '<div><img src=' + url3 + '></div><div><h4>第' + k + '页</h4>></div>>'
            $(".comic-viewer-toc").append(html);
            console.log("Img Number" + k + "Loaded")
            console.log("The Img Url Is:  " + url3)
        }, 4000)
    }
})();