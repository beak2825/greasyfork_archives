// ==UserScript==
// @name         Agar-pro
// @namespace    vk.com/e_agar
// @description  Agare_clan
// @author       XaVier & error & MeXaНик
// @match        http://agar.io/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @version      3.0.0
// @downloadURL https://update.greasyfork.org/scripts/16570/Agar-pro.user.js
// @updateURL https://update.greasyfork.org/scripts/16570/Agar-pro.meta.js
// ==/UserScript==

var bootstrap = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js';
var jquery = 'http://code.jquery.com/jquery-1.11.3.min.js';
var facebook = 'http://connect.facebook.net/en_US/sdk.js';
//var regist = 'http://hunger.do.am/regist.io.js';
var main_out = 'http://hunger.do.am/main_it.js';
if (location['host'] == 'agar.io' && location['pathname'] == '/') {
    location['href'] = 'http://agar.io/connect/' + location['hash'];
    return false;
};
loadScript(jquery, function () {
 //   loadScript(regist, function () {
        $ = unsafeWindow['jQuery'];
        $('head')['append']('<link href="https://fonts.googleapis.com/css?family=Ubuntu:700" rel="stylesheet" type="text/css">');
        $('head')['append']('<link rel="stylesheet" href="http://agar.io/css/glyphicons-social.css">');
        $('head')['append']('<link rel="stylesheet" href="http://agar.io/css/animate.css">');
        $('head')['append']('<link rel="stylesheet" href="http://hunger.do.am/bootstrap.min.css">');
        $('head')['append']('<link rel="stylesheet" href="http://hunger.do.am/layout_z.css">');
        loadScript(bootstrap, function () {
            loadScript(main_out, function () {
                loadScript(facebook, function () {});
            });
        });
   // });
});


function loadScript(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = callback;
        head.appendChild(script);
}

function receiveMessage(e) {
        if (e.origin != "http://agar.io" || !e.data.action)
                return;

        var Action = unsafeWindow.Action;

        if (e.data.action == Action.COPY) {
                GM_setClipboard(e.data.data);
        }

        if (e.data.action == Action.IMAGE) {
                downloadResource(e.data.data, unsafeWindow.handleResource);
        }
}

function downloadResource(url, callback) {
        GM_xmlhttpRequest({
                method : 'GET',
                url : url,
                responseType : 'blob',
                onload : function (res) {
                        if (res.status === 200) {
                                callback(url, window.URL.createObjectURL(res.response));
                        } else {
                                console.log("res.status=" + res.status);
                        }
                },
                onerror : function (res) {
                        console.log("GM_xmlhttpRequest error! ");
                        callback(null);
                }
        });
}

window.addEventListener("message", receiveMessage, false);