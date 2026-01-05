// ==UserScript==
// @name        NotWhat-PTPImgIt
// @namespace   https://orbitalzero.ovh/scripts
// @description PTPImg It script for NotWhat
// @include     https://ptpimg.me/
// @include     https://notwhat.cd/upload.php*
// @include     https://notwhat.cd/torrents.php?action=editgroup*
// @include     https://notwhat.cd/torrents.php?id=*
// @include     https://notwhat.cd/user.php?action=edit&userid=*
// @include     https://notwhat.cd/artist.php?action=edit&artistid=*
// @include     https://notwhat.cd/requests.php?action=new
// @version     0.10
// @grant		GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/27398/NotWhat-PTPImgIt.user.js
// @updateURL https://update.greasyfork.org/scripts/27398/NotWhat-PTPImgIt.meta.js
// ==/UserScript==

var css = `
input[type="button"]:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
`;

var default_settings = {
    alert_when_done: true,
    api_key: "",
    host: "lutim"
};

function get_api_key() {
    if (!window.localStorage.ptpimg_it) window.localStorage.ptpimg_it = JSON.stringify(default_settings);
    var settings = JSON.parse(window.localStorage.ptpimg_it);
    switch (settings.host) {
        default:
            window.localStorage.ptpimg_it = JSON.stringify(default_settings);
        case "lutim":
            return Promise.resolve("");
        case "ptpimg":
            return ptpimg_get_api_key();
    }
}

function ptpimg_get_api_key() {
    if (!window.localStorage.ptpimg_it) window.localStorage.ptpimg_it = JSON.stringify(default_settings);
    var settings = JSON.parse(window.localStorage.ptpimg_it);
    if (settings.api_key) return new Promise(function (resolve, reject) {
        resolve(settings.api_key);
    });
    
    return new Promise( function (resolve, reject) {
        var request = GM_xmlhttpRequest({method: "GET",
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

function prep_urls(urls) {
    return urls.map(function (url) {
        if (url.indexOf("reho.st") == -1 && url.indexOf("discogs.com") != -1) return "http://reho.st/" + url;
        return url;
    });
}

function send_images(urls, api_key) {
    if (!window.localStorage.ptpimg_it) window.localStorage.ptpimg_it = JSON.stringify(default_settings);
    var settings = JSON.parse(window.localStorage.ptpimg_it);
    switch (settings.host) {
        default:
            window.localStorage.ptpimg_it = JSON.stringify(default_settings);
        case "lutim":
            return lutim_send_images(urls);
        case "ptpimg":
            return ptpimg_send_images(urls, api_key);
    } 
}

function ptpimg_send_images(urls, api_key) {
    return new Promise(function(resolve, reject) {
        urls = prep_urls(urls);
        var boundary = "--NN-GGn-PTPIMG";
        var data = "";
        data += boundary + "\n";
        data += "Content-Disposition: form-data; name=\"link-upload\"\n\n";
        data += urls.join("\n") + "\n";
        data += boundary + "\n";
        data += "Content-Disposition: form-data; name=\"api_key\"\n\n";
        data += api_key + "\n";
        data += boundary + "--";
        var request = GM_xmlhttpRequest({"method": "POST",
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

function lutim_send_images(urls) {
    urls = prep_urls(urls);
    
    var promises = urls.map(function (url) {
        return new Promise(function (resolve, reject) {
            var data = "lutim-file-url="+url+"&"+
                       "format=json&"+
                       "first-view=0&"+
                       "crypt=0&"+
                       "delete-day=0&";
          var request = GM_xmlhttpRequest({"method": "POST",
                                                 "url": "https://lut.im/",
                                                 "responseType": "json",
                                                 "headers": {
                                                    "Content-Type": "application/x-www-form-urlencoded"
                                                 },
                                                 "data": data,
                                                 "onload": function (response) {
                                                    if (response.status != 200) reject("Response error " + response.status);
                                                    if (response.response.success !== true) reject("Failed rehosting image to lut.im");
                                                    else {
                                                        var msg = response.response.msg;
                                                        resolve("https://lut.im/" + msg.short + "." + msg.ext);
                                                    }
                                                 }
           });
        });
    });
    return Promise.all(promises);
}

function get_settings() {
    if (!window.localStorage.ptpimg_it) window.localStorage.ptpimg_it = JSON.stringify(default_settings);
    return JSON.parse(window.localStorage.ptpimg_it);
}

function rehost_button() {
    
    var settings = get_settings();
    
    var button = $(this);
    button.prop("disabled", true);
    var input = $("input[name='image']");
    var url = input.val(); 
    get_api_key().then(function (key) {
        return send_images([url], key);
    }).then(function (new_urls) {
        input.val(new_urls[0]);
        if (settings.alert_when_done) alert("Image successfully uploaded to " + settings.host + "!");
        button.prop("disabled", false);
    }).catch(function (message) {
        button.prop("disabled", false);
        alert(message);
    });
}

function rehost_button_alt() {
    
    var settings = get_settings();
    
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
        if (settings.alert_when_done) alert("Image successfully uploaded to " + settings.host + "!");
        button.prop("disabled", false);
    }).catch(function (message) {
        button.prop("disabled", false);
        alert(message);
    });
}

function add_cover_button() {
    
    var settings = get_settings();
    
    $("input[name='image']").after("<input type='button' value='Rehost It!' class='rehost_it_cover'>");
    $(".rehost_it_cover").click(rehost_button);
}

function add_cover_button_alt() {
    
    var settings = get_settings();
    
    $(".box.box_image a.brackets[href='#']").click(function () {
        if ($("#rehost_it_cover").length === 0) {
            $("#add_cover").after("<input type='button' value='Rehost It!' id='rehost_it_cover'>");
            $("#rehost_it_cover").click(rehost_button_alt);
        }
    });
}

function add_config() {
    
    var settings = get_settings();
    
    $(".main_column").append("<table id='nw_ptpimg_it'><tbody></tbody</table>");
    $("#nw_ptpimg_it>tbody").append("<tr class='colhead_dark'><td colspan='2'><strong>PTPIMG It Settings</strong></td></tr>");
    $("#nw_ptpimg_it>tbody").append("<tr><td class='label'>PTPIMG API Key</td><td><input type='text' id='api_key' placeholder='Enter your API Key here' value='" + (settings.api_key ? settings.api_key : "") + "'></td></tr>");
    $("#nw_ptpimg_it>tbody").append("<tr><td class='label'>Alert when done ?</td><td><input type='checkbox' id='alert_when_done' value='Alert when done ?'" + (settings.alert_when_done ? "checked" : "") + "></td></tr>");
    $("#nw_ptpimg_it>tbody").append("<tr><td class='label'>Image host provider:</td><td><select id='image_host_provider'><option value='lutimg' " + (settings.host === "lutimg" ? "selected": "") + ">lut.img</option><option value='ptpimg' " + (settings.host === "ptpimg" ? "selected": "") + ">ptpimg.me</option></select></td></tr>");   
    $("#nw_ptpimg_it>tbody").append("<tr><td colspan='2'><input type='button' id='save' value='Save settings'></td></tr>");
    
    $("#nw_ptpimg_it #save").click(function () {
        var settings_form = $("#nw_ptpimg_it");
        settings = {
            alert_when_done: settings_form.find("#alert_when_done").prop("checked"),
            api_key: $("#api_key").val() === "" ? undefined : $("#api_key").val(),
            host: $("#image_host_provider").val()
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
        $("#categories").on("change", function () {
            setTimeout(add_cover_button, 250);
        });
        add_cover_button();
    }
})();