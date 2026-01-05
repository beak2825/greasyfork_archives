// ==UserScript==
// @name        GGn PTPImg It
// @namespace   https://orbitalzero.ovh/scripts
// @description PTPImg It script for GGn
// @include     https://ptpimg.me/
// @include     https://gazellegames.net/upload.php*
// @include     https://gazellegames.net/torrents.php?action=editgroup*
// @include     https://gazellegames.net/user.php?action=edit&userid=*
// @include     https://gazellegames.net/requests.php?action=new
// @version     0.08
// @grant		    GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/25551/GGn%20PTPImg%20It.user.js
// @updateURL https://update.greasyfork.org/scripts/25551/GGn%20PTPImg%20It.meta.js
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

function add_screenshots_button() {
    if (!window.localStorage.ptpimg_it) window.localStorage.ptpimg_it = JSON.stringify(default_settings);
    var settings = JSON.parse(window.localStorage.ptpimg_it);
    $("#image_block").prepend("<input type='button' value='PTPIMG It!' id='ptpimg_it_screenshots'><br>");
    $("#ptpimg_it_screenshots").click(function () {
        var button = $(this);
        button.prop("disabled", true);
        var inputs = $("input[name='screens[]']");
        var urls = inputs.map(function () {
            return this.value;
        }).get();
        get_api_key().then(function (key) {
            return send_images(urls, key);
        }).then(function (new_urls) {
            inputs.map(function (index) {
                $(this).val(new_urls[index]);
            });
            if (settings.alert_when_done) alert("Screenshots successfully uploaded to PTPIMG!");
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
    $("#userform tbody").prepend("<tr class='colhead_dark' id='ptpimg_it'><td colspan='2'><strong>PTPIMG It Settings</strong></td></tr>");
    var html = "<tr><td class='label'>PTPIMG API Key</td><td><input type='text' size='40' id='ptpimg_api_key' placeholder='Enter your API Key here' value='" + (settings.api_key ? settings.api_key : "") + "'></td></tr>";
    html +=    "<tr><td class='label'>Alert when done ?</td><td><input type='checkbox' id='ptpimg_alert_when_done' value='Alert when done ?'" + (settings.alert_when_done ? "checked" : "") + "></td></tr>";
    html +=    "<tr><td colspan='2'><input type='button' id='ptpimg_save' value='Save settings'></td></tr>";
    $("#ptpimg_it").after(html);
    $("#ptpimg_save").click(function () {
        var settings_form = $("#ptpimg_it");
        settings = {
            alert_when_done: $("#ptpimg_alert_when_done").prop("checked"),
            api_key: $("#ptpimg_api_key").val() === "" ? undefined : $("#ptpimg_api_key").val()
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
        add_screenshots_button();
    }
})();