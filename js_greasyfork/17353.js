// ==UserScript==
// @name         OAGx
// @version      2.0.0
// @namespace    OAGx
// @description  Agarplus Enhanced
// @author       2COOLIFE
// @match        http://agar.io/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/17353/OAGx.user.js
// @updateURL https://update.greasyfork.org/scripts/17353/OAGx.meta.js
// ==/UserScript==

function loadScript(t,e){var o=document.getElementsByTagName("head")[0],a=document.createElement("script");a.type="text/javascript",a.src=t,a.onload=e,o.appendChild(a)}function receiveMessage(t){if("http://agar.io"==t.origin&&t.data.action){var e=unsafeWindow.Action;t.data.action==e.COPY&&GM_setClipboard(t.data.data),t.data.action==e.IMAGE&&downloadResource(t.data.data,unsafeWindow.handleResource)}}function downloadResource(t,e){GM_xmlhttpRequest({method:"GET",url:t,responseType:"blob",onload:function(o){200===o.status?e(t,window.URL.createObjectURL(o.response)):console.log("res.status="+o.status)},onerror:function(t){console.log("GM_xmlhttpRequest error! "),e(null)}})}var VERSION="2.0.0",$,URL_JQUERY="http://code.jquery.com/jquery-1.11.3.min.js",URL_BOOTSTRAP="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js",URL_SOCKET_IO="https://cdn.socket.io/socket.io-1.3.5.js",URL_FACEBOOK="http://connect.facebook.net/en_US/sdk.js",URL_MAIN_OUT="https://googledrive.com/host/0Bwa4aeE7lFftSTdzVjZnV3I0NjQ/oagx.js",URL_CSS_FILE="https://googledrive.com/host/0Bwa4aeE7lFftSTdzVjZnV3I0NjQ/v2.css";window.stop(),document.documentElement.innerHTML=null,"agar.io"==location.host&&"/"==location.pathname&&(location.href="http://agar.io/agarplus.io"+location.hash),loadScript(URL_JQUERY,function(){$=unsafeWindow.jQuery,$("head").append('<link href="https://fonts.googleapis.com/css?family=Ubuntu:400,300,300italic,400italic,500,500italic,700,700italic" rel="stylesheet" type="text/css">'),$("head").append('<link rel="stylesheet" href="http://agar.io/css/glyphicons-social.css">'),$("head").append('<link rel="stylesheet" href="http://agar.io/css/animate.css">'),$("head").append('<link rel="stylesheet" href="http://agar.io/css/bootstrap.min.css">'),$("head").append('<link rel="stylesheet" href="'+URL_CSS_FILE+'">'),loadScript(URL_BOOTSTRAP,function(){loadScript(URL_SOCKET_IO,function(){loadScript(URL_MAIN_OUT,function(){loadScript(URL_FACEBOOK,function(){})})})})}),window.addEventListener("message",receiveMessage,!1);