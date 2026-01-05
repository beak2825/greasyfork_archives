// ==UserScript==
// @name        Apollo & Redacted PTPImg It
// @namespace   https://greasyfork.org/users/90188
// @description PTPImg It script for PTP
// @include     https://ptpimg.me/
// @include     https://passtheheadphones.me/upload.php*
// @include     https://passtheheadphones.me/torrents.php?action=editgroup*
// @include     https://passtheheadphones.me/torrents.php?id=*
// @include     https://passtheheadphones.me/user.php?action=edit&userid=*
// @include     https://passtheheadphones.me/artist.php?action=edit&artistid=*
// @include     https://passtheheadphones.me/requests.php?action=new
// @include     https://redacted.ch/upload.php*
// @include     https://redacted.ch/torrents.php?action=editgroup*
// @include     https://redacted.ch/torrents.php?id=*
// @include     https://redacted.ch/user.php?action=edit&userid=*
// @include     https://redacted.ch/artist.php?action=edit&artistid=*
// @include     https://redacted.ch/requests.php?action=new
// @include     https://*apollo.rip/upload.php*
// @include     https://*apollo.rip/torrents.php?action=editgroup*
// @include     https://*apollo.rip/torrents.php?id=*
// @include     https://*apollo.rip/user.php?action=edit&userid=*
// @include     https://*apollo.rip/artist.php?action=edit&artistid=*
// @include     https://*apollo.rip/requests.php?action=new
// @version     0.09
// @grant		GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/26384/Apollo%20%20Redacted%20PTPImg%20It.user.js
// @updateURL https://update.greasyfork.org/scripts/26384/Apollo%20%20Redacted%20PTPImg%20It.meta.js
// ==/UserScript==

var css = `
input[type="button"]:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
`;

var default_settings = {
    alert_when_done: true,
    api_key: ""
};

function get_api_key() {
    if (!window.localStorage.ptpimg_it) window.localStorage.ptpimg_it = JSON.stringify(default_settings);
    var settings = JSON.parse(window.localStorage.ptpimg_it);
    if (settings.api_key) return new Promise(function (resolve, reject) {
        resolve(settings.api_key);
    });
    return new Promise( function (resolve, reject) {
        var request = new GM_xmlhttpRequest({method: "GET",
                                           url: "https://ptpimg.me/",
                                           onload: function(response) {
                                               if (response.status != 200) reject("Response error " + response.status);
                                               if (response.finalUrl !== "https://ptpimg.me/") reject("Couldn't retrieve api key");
                                               settings.api_key = $(response.response).find("#api_key").first().val();
                                               window.localStorage.ptpimg_it = JSON.stringify(settings);
                                               resolve(settings.api_key);
                                           }
        });
    });
}

function send_images(urls, api_key) {
    return new Promise(function(resolve, reject) {
        urls = urls.map(function (url) {
            if (url.indexOf("reho.st") == -1 && url.indexOf("discogs.com") != -1) return "http://reho.st/" + url;
            return url;
        });
        var boundary = "--NN-GGn-PTPIMG";
        var data = "";
        data += boundary + "\n";
        data += "Content-Disposition: form-data; name=\"link-upload\"\n\n";
        data += urls.join("\n") + "\n";
        data += boundary + "\n";
        data += "Content-Disposition: form-data; name=\"api_key\"\n\n";
        data += api_key + "\n";
        data += boundary + "--";
        var request = new GM_xmlhttpRequest({"method": "POST",
                                           "url": "https://ptpimg.me/upload.php",
                                           "responseType": "json",
                                           "headers": {
                                               "Content-type": "multipart/form-data; boundary=NN-GGn-PTPIMG"
                                           },
                                           "data": data,
                                           "onload": function(response) {
                                               if (response.status != 200) reject("Response error " + response.status);
                                               resolve(response.response.map(function (item) {
                                                   return "https://ptpimg.me/" + item.code + "." + item.ext;
                                               }));
                                               
                                           }
        });
    });
}

function add_cover_button() {
    if (!window.localStorage.ptpimg_it) window.localStorage.ptpimg_it = JSON.stringify(default_settings);
    var settings = JSON.parse(window.localStorage.ptpimg_it);
    $("input[name='image']").after("<input type='button' value='PTPIMG It!' id='ptpimg_it_cover'>");
    $("#ptpimg_it_cover").click(function () {
        var button = $(this);
        button.prop("disabled", true);
        var input = $("input[name='image']");
        var url = input.val();
        get_api_key().then(function (key) {
            return send_images([url], key);
        }).then(function (new_urls) {
            input.val(new_urls[0]);
            if (settings.alert_when_done) alert("Image successfully uploaded to PTPIMG!");
            button.prop("disabled", false);
        }).catch(function (message) {
            button.prop("disabled", false);
            alert(message);
        });
    });
}

function add_cover_button_alt() {
    if (!window.localStorage.ptpimg_it) window.localStorage.ptpimg_it = JSON.stringify(default_settings);
    var settings = JSON.parse(window.localStorage.ptpimg_it);
    $("#add_cover").after("<input type='button' value='PTPIMG It!' id='ptpimg_it_cover'>");
    $("#ptpimg_it_cover").click(function () {
        var button = $(this);
        button.prop("disabled", true);
        var inputs = $("input[name='image[]']");
        var urls = inputs.map(function () {
            return this.value;
        }).get();
        get_api_key().then(function (key) {
            return send_images(urls, key);
        }).then(function (new_urls) {
            inputs.map(function (index) {
                $(this).val(new_urls[index]);
            });
            if (settings.alert_when_done) alert("Image successfully uploaded to PTPIMG!");
            button.prop("disabled", false);
        }).catch(function (message) {
            button.prop("disabled", false);
            alert(message);
        });
    });
}

function add_config() {
    if (!window.localStorage.ptpimg_it) window.localStorage.ptpimg_it = JSON.stringify(default_settings);
    var settings = JSON.parse(window.localStorage.ptpimg_it);
    $(".main_column").append("<table id='pth_ptpimg_it'><tbody></tbody</table>");
    $("#pth_ptpimg_it>tbody").append("<tr class='colhead_dark'><td colspan='2'><strong>PTPIMG It Settings</strong></td></tr>");
    $("#pth_ptpimg_it>tbody").append("<tr><td class='label'>PTPIMG API Key</td><td><input type='text' id='api_key' placeholder='Enter your API Key here' value='" + (settings.api_key ? settings.api_key : "") + "'></td></tr>");
    $("#pth_ptpimg_it>tbody").append("<tr><td class='label'>Alert when done ?</td><td><input type='checkbox' id='alert_when_done' value='Alert when done ?'" + (settings.alert_when_done ? "checked" : "") + "></td></tr>");
    $("#pth_ptpimg_it>tbody").append("<tr><td colspan='2'><input type='button' id='save' value='Save settings'></td></tr>");
    $("#pth_ptpimg_it #save").click(function () {
        var settings_form = $("#pth_ptpimg_it");
        settings = {
            alert_when_done: settings_form.find("#alert_when_done").prop("checked"),
            api_key: $("#api_key").val() === "" ? undefined : $("#api_key").val()
        };
        window.localStorage.ptpimg_it = JSON.stringify(settings);
        alert("Settings saved !");
    });
}

(function() {
    'use strict';
    GM_addStyle(css);
    if (/user\.php\?action=edit/.test(window.location.href)) {
        add_config();
    } else if (/torrents\.php\?id=/.test(window.location.href)) {
        add_cover_button_alt();
    } else {
        add_cover_button();
    }
})();