// ==UserScript==
// @name         mobizen web app
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *www.mobizen.com/*
// @icon         https://www.google.com/s2/favicons?domain=www.mobizen.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396213/mobizen%20web%20app.user.js
// @updateURL https://update.greasyfork.org/scripts/396213/mobizen%20web%20app.meta.js
// ==/UserScript==

if (window.location.href.search("/home") == -1) {

    function main() {
        var a = $("div.display-email");
        if (a.length == 0) {
            return;
        }
        clearInterval(loop);
        setTimeout(function() {
            a = a.text();
            if (a == "") {
                loop = setInterval(login, 100);
            } else {
                loop = setInterval(select_host, 100);
            }
        }, 100);
    }

    function login() {
        var e = $("#signin-button");
        if (e.length == 1) {
            clearInterval(loop);
            setTimeout(function() {
                e.click();
                loop = setInterval(select_host, 100);
            }, 1000);
        }
    }

    function select_host() {
        //$("#mobizen-main > div.block-connect > div > label").click();
        var e = $("#mobizen-main > div.device-list > div.devicelist-button.hostlist");
        if (e.length == 1) {
            clearInterval(loop);
            setTimeout(function() {
                e.click();
                //loop = setInterval(select_host, 100);
            }, 100);
        }
    }

    var css = `
#select-device {
z-index: 100;
top: 0;
bottom: 0;
left: 0;
right: 0;
margin: 0;
margin-left: -60px;
}
`.replace(/;/g, " !important;");
    var style = document.createElement('style');
    style.innerHTML = css;
    document.getElementsByTagName('body')[0].appendChild(style);

    var loop = setInterval(main, 100);

} else {

    var css = `
#contents {
top: 0;
}
#dialog {
left: 200px;
}
#apps,#widget,#header,#footer {
display: none;
}
.device-button {
border: 1px solid white;
}
#device [data-role="DEVICE_BODY"] {
left: 0%;
}
`.replace(/;/g, " !important;");
    var style = document.createElement('style');
    style.innerHTML = css;
    document.getElementsByTagName('body')[0].appendChild(style);

    function set_canvas() {
        var e = $(".d-default_screen");
        if (e.length == 0 || e.width() == 0 || e.height() == 0) {
            return;
        }
        clearInterval(loop);
        var width = e.width(), height = e.height();
        var css = `
#contents .remote {
margin: unset;
width: ${width}px;
height: ${height}px;
}
#device {
transform: unset;
width: ${width}px;
height: ${height}px;
left: 47%;
}
#rswp {
width: ${width}px;
height: ${height}px;
margin-left: 0;
margin-top: 0;
transform: unset;
}
#rswp > canvas {
width: ${width}px;
height: ${height}px;
}
.d-default_screen {
width: ${width}px;
height: ${height}px;
}
`.replace(/;/g, " !important;");
        var style = document.createElement('style');
        style.innerHTML = css;
        document.getElementsByTagName('body')[0].appendChild(style);
    }

    var loop = setInterval(set_canvas, 100);

}