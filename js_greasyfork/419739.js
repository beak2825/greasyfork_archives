// ==UserScript==
// @name         Google Drive | wget copy&paste command creator - EN Version
// @namespace    http://tampermonkey.net/
// @version      Final-2021
// @description  A easy tool to use to use your terminal to download your files from Google Drive!
// @author       xAlcahest
// @match        https://drive.google.com/file/d/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/419739/Google%20Drive%20%7C%20wget%20copypaste%20command%20creator%20-%20EN%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/419739/Google%20Drive%20%7C%20wget%20copypaste%20command%20creator%20-%20EN%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url_parttens = window.location.href.split('/');
    var file_id = url_parttens[url_parttens.length - 2]
    var file_name = jQuery("meta[property='og:title']").attr("content");
    var command = `wget --load-cookies cookies.txt "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies cookies.txt --keep-session-cookies --no-check-certificate 'https://docs.google.com/uc?export=download&id=${file_id}' ` + "-O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\\1\\n/p')&id=" + `${file_id}" -O ${file_name} && rm -rf cookies.txt`;
    GM_setClipboard(command);
    alert('The [wget] command is ready, the command has been automatically copied to the clipboard.')
   })();