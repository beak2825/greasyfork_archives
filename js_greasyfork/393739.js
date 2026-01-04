// ==UserScript==
// @name           Steam Downloader
// @version        0.2
// @description    Downloads anything from the steam workshop
// @author         cpilton
// @include        *steamcommunity.com/sharedfiles/filedetails/?id=*
// @include        *steamcommunity.com/workshop/filedetails/?id=*
// @grant          GM_xmlhttpRequest
// @namespace      https://greasyfork.org/users/420396
// @downloadURL https://update.greasyfork.org/scripts/393739/Steam%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/393739/Steam%20Downloader.meta.js
// ==/UserScript==

var appID;

(function() {
    'use strict';

    addButton();
    getAppID();
})();

function addButton() {
    var div = document.createElement("div");
    div.classList.add("workshopItemControlCtn");
    div.innerHTML = '<span id="downloadButton" style="margin-top:6px" class="general_btn share tooltip"><span>Download</span></span>';
    div.onclick = function() {
        download();
    }

    var element = document.getElementById("action_wait");
    element.parentNode.insertBefore(div, element);
}

function getAppID() {
    var element = document.getElementById("ig_bottom").getElementsByClassName("btnv6_blue_hoverfade btn_medium")[0];
    appID = element.getAttribute("data-appid");
}

function download() {
    getDownloadLink(getID());
}

function getID() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    return id;
}

function getDownloadLink(id) {
    var request="item="+id+"&app="+appID;
    GM_xmlhttpRequest({
        method: "POST",
        url: "http://steamworkshop.download/online/steamonline.php",
        data: request,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function (response) {
            var href = response.responseText.split("'");
            downloadFile(href[1]);
        },
        onerror: function (reponse) {
            //alert('error');
            console.log(reponse);
        }
    });
}

function downloadFile(url) {
    window.location.assign(url);
}
