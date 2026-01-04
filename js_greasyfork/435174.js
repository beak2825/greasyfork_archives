// ==UserScript==
// @name         AdzapprSmart by zhuhang
// @namespace    https://greasyfork.org/en/users/200777
// @version      0.1
// @description  Power up adzappr campgin listing
// @author       zhuhang.jasper
// @match        https://www.adzappr.com/user/campaignlist
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435174/AdzapprSmart%20by%20zhuhang.user.js
// @updateURL https://update.greasyfork.org/scripts/435174/AdzapprSmart%20by%20zhuhang.meta.js
// ==/UserScript==

var campaigns = {};
var campaignList = [];

// FN001 : Update Campaign Listing to Local Storage
$.fn.loadCampignList = function() {
    if($(".campaignlist-area").length) {
        console.log("[AdzapprSmart] Reading Campaign Listing...");

        // Load listing from local storage
        /*if (localStorage.getItem("campaignList")) {
            campaignList = JSON.parse(localStorage.getItem("campaignList"));
        }*/

        $(".campaignlist-area > .col-main").each(function(i){
            let campaignWrapper = $(this);
            let name = campaignWrapper.find(".brand_title > a > b")[0].innerText;
            let url = campaignWrapper.find(".brand_title > a")[0].href;
            let viewCount = parseInt(campaignWrapper.find(".brand_title > a > h3")[0].innerText.trim());
            let imgUrl = campaignWrapper.find(".brand_thumbnail > a > img")[0].src;
            let isSlotFull = ((campaignWrapper.find(".slot-full").length) > 0);
            let slug = url.split("slug=")[1];

            let obj = { slug, name, isSlotFull, viewCount, imgUrl, url, ele: this };
            campaignList.push(obj);
            campaigns[slug] = obj;
            campaignWrapper.detach();
        });
        // filter and sorting
        campaignList = campaignList.filter(ele => !ele.isSlotFull).sort((a,b) => {
            if (a.isSlotFull && !b.isSlotFull) return 1;
            if (b.isSlotFull && !a.isSlotFull) return -1;
            if (a.viewCount == b.viewCount) return 0;
            if (a.viewCount < b.viewCount) return -1;
            return 1;
        });
        // update UI
        campaignList.forEach((campaign) => {
            $(".campaignlist-area")[0].append(campaign.ele);
        });
        // make array list
        campaignList = campaignList.map(ele => ele.slug);

        // save to LS
        localStorage.setItem("campaigns", JSON.stringify(campaigns));
        localStorage.setItem("campaignList", JSON.stringify(campaignList));

        console.log(campaigns);
        console.log(campaignList);
    }
}

/*** Startup Events ***/
$.fn.startUpTrigger = function() {

    // Add functions on startup here:
    if (window.location.pathname == "/user/campaignlist") {
        $.fn.loadCampignList(); // FN001
    }

}
/*** Main Body ***/
function main() {
    $.fn.startUpTrigger();
}

// A function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//code.jquery.com/jquery-1.12.4.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// Script jQuery Wrapper
(function() {
    'use strict';
    addJQuery(main);
})();