// ==UserScript==
// @name         Etherscan Contract Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  batch download etherscan verified contract
// @author       jason@trillion.fi
// @require https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js
// @match        https://*.etherscan.io/address/*
// @match        https://ftmscan.com/address/*
// @match        https://bscscan.com/address/*
// @match        https://snowtrace.io/address/*
// @match        https://polygonscan.com/address/*
// @match        https://hecoinfo.com/address/*
// @match        https://optimistic.etherscan.io/address/*
// @match        https://arbiscan.io/address/*
// @match        https://aurorascan.dev/address/*
// @match        https://cronoscan.com/address/*
// @icon         https://etherscan.io/images/brandassets/etherscan-logo-circle.png
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439379/Etherscan%20Contract%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/439379/Etherscan%20Contract%20Downloader.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let editorIds = $("[id^=editor]")
    let spans = $('#dividcode span.text-muted:not(:first):not(:last)').toArray()
    console.log(`found ${editorIds.length>1?editorIds.length-1:1} editors`);


    function getAddr() {
        const regex = /0x[0-9A-Fa-f]{40}/g;
        const found = window.location.href.match(regex);
        return found[0]
    }

    function getDethUrl() {
        let host = window.location.host;
        let newHost = host.split(".")[0] + ".deth.net"
        let url = window.location.href;
        return url.replace(host, newHost);
    }

    function getByteGraphUrl() {
        var url = window.location.href;
        var modifiedUrl = url.replace(/^https:\/\/etherscan\.io\/address\/(.+?)(?:#.*)?$/, 'https://bytegraph.xyz/address/$1');
        return modifiedUrl;
    }

    function downloadAllEditorsAsZip() {
        let zip = new JSZip();
        let addr = getAddr();
        let end = editorIds.length > 1 ? editorIds.length - 1 : 1;
        for (let index = 0; index < end; index++) {
            let editor = ace.edit(editorIds[index]);
            let filename;
            try {
                filename = `${spans[index].innerText.split(":")[1].trim()}`;
            } catch {
                filename = `${addr}.sol`;
            }
            zip.file(filename, editor.getValue());
        }

        // Generate the zip file and create a blob URL for it
        zip.generateAsync({type:"blob"}).then(function(content) {
            let url = URL.createObjectURL(content);

            // Create a hidden link and click it to start the download
            let link = document.createElement("a");
            link.href = url;
            link.download = `${addr}.zip`;
            link.click();
        });
    }

    if (!unsafeWindow.downloadAllEditorsAsZip) {
        unsafeWindow.downloadAllEditorsAsZip = downloadAllEditorsAsZip;
    }
    $("#nav_subtabs").append('<li class="nav-item"><a class="nav-link show" href="#downloadZip" data-toggle="tab" onclick="javascript:downloadAllEditorsAsZip();"><span>Download All as Zip</span></a></li>');
    $("#nav_subtabs").append(`<li class="nav-item"><a class="nav-link show" href="#vscode" onclick="window.open('${getDethUrl()}','_blank')" data-toggle="tab""><span>Deth.net</span></a></li>`);
    $("#nav_subtabs").append(`<li class="nav-item"><a class="nav-link show" href="#bytegraph" onclick="window.open('${getByteGraphUrl()}','_blank')" data-toggle="tab""><span>Bytegraph.xyz</span></a></li>`);

    $('.table th:contains("Age")').css("width", "14%");

    $('.table span:contains(" ago")').each(function() {
        var relTime = $(this).text();
        var absTime = $(this).attr('title');
        if (!absTime) absTime = $(this).attr('data-original-title');
        //    absTime = moment(absTime, "MMM-DD-YYYY hh:mm:ss A", "en").add(1, 'h').format("YYYY-MM-DD HH:mm:ss");
        absTime = moment(absTime).add(8, 'h').format("YYYY-MM-DD HH:mm:ss");
        $(this).attr('title', relTime);
        $(this).attr('data-original-title', relTime);
        $(this).text(absTime);
    });

    //
})();