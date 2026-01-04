// ==UserScript==
// @name         akuma.Moe Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1a
// @description  Helps download mangas from akuma.moe with ComicInfo.xml
// @author       Nuark & temp.user
// @connect      s1.akuma.moe
// @connect      s2.akuma.moe
// @match        https://*akuma.moe/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523940/akumaMoe%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/523940/akumaMoe%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let w = unsafeWindow;
    let jq = w.$;

    let blobholder = {
        init: function(filename, details, maxcount, caller) {
            if (!filename.endsWith('.zip')) {
                filename += '.zip';
            }
            this.filename = filename;
            this.details = details;
            this.maxcount = maxcount;
            this.caller = caller;
        },
        blobarray: [],
        currcount: 0,
        addBlob: function(blob) {
            this.blobarray.push(blob);
            this.currcount++;
            console.log("blob insertion dispatched", blob, this.currcount, this.maxcount);
            if (this.currcount === this.maxcount) {
                this.callback();
                this.caller.text("Serializing...");
                console.log("calling serialization", blob, this.currcount, this.maxcount);
            }
        },
        callback: function() {
            let zip = new JSZip();
            let comicInfoContent = createComicInfo();
            zip.file("Comicinfo.xml", comicInfoContent);
            let img = zip.folder("images");
            this.blobarray.forEach(file => {
                img.file(file[0], file[1]);
            });
            zip.generateAsync({type:"blob"}, function updateCallback(metadata) {
                blobholder.caller.text(metadata.percent.toFixed(2) + '%');
            })

                .then(function(content) {
                saveAs(content, blobholder.filename);
                blobholder.caller.toggleClass("btn-info").toggleClass("btn-success");
                blobholder.caller.text("Done");
            });
        }
    }

    w.zxc = async function (caller) {
        caller = jq(caller);
        let todo = w.pag.cnt;
        let tpl = "{origin}{pathname}/{page}".replace(/(\{origin\})/, location.origin).replace(/(\{pathname\})/, location.pathname);
        blobholder.init(jq(".entry-title").text(), "", todo, caller);

        caller.text(`Pages: ${todo}`);

        for (let i = 1; i <= todo; i++) {
            caller.text(`Fetching ${i} of ${todo}...`);
            let page_response = await fetch(tpl.replace(/(\{page\})/, i));
            let html = await page_response.text();
            let div = jq("<div>").html(html.replace(/(script)/g, "scr").replace(/(link)/g, "lnk"))[0];
            let link = div.querySelector("#image-container > img").src;
            GM_xmlhttpRequest({
                method: "GET",
                url: link,
                synchronous: true,
                responseType: "blob",
                onload: function (response) {
                    let title = response.finalUrl .split("/").pop();;
                    let blob = response.response;
                    blobholder.addBlob([title, blob]);
                }
            });
        }
    }

    function init() { //TODO: location.pathname detection
        let new_btn = jq("#start").clone();
        new_btn.id = "download";
        new_btn.text("Download");
        new_btn.attr("href", "#download");
        new_btn.attr("title", "Download");
        new_btn.toggleClass("btn-primary").toggleClass("btn-info");
        new_btn.attr("onclick", "window.zxc(this)");
        jq("#start").parent().append(new_btn);
    }

    function createComicInfo() {
        const title = document.querySelector('h1.entry-title')?.textContent.trim();
        const categories = Array.from(document.querySelectorAll('li.meta-data .value a[href*="category"]')).map(el => el.textContent.trim());
        const languages = Array.from(document.querySelectorAll('li.meta-data .value a[href*="language"]')).map(el => el.textContent.trim());
        const artists = Array.from(document.querySelectorAll('li.meta-data .value a[href*="artist"], li.meta-data .value a[href*="group"]')).map(el => el.textContent.trim());
        const maleTags = Array.from(document.querySelectorAll('li.meta-data .value a[href*="male"]')).map(el => `male:${el.textContent.trim()}`);
        const femaleTags = Array.from(document.querySelectorAll('li.meta-data .value a[href*="female"]')).map(el => `female:${el.textContent.trim()}`);
        const mixedTags = Array.from(document.querySelectorAll('li.meta-data .value a[href*="mixed"]')).map(el => `mixed:${el.textContent.trim()}`);
        const otherTags = Array.from(document.querySelectorAll('li.meta-data .value a[href*="other"]')).map(el => `other:${el.textContent.trim()}`);
        const tags = [...maleTags, ...femaleTags, ...mixedTags, ...otherTags];
        const date = document.querySelector('li.meta-data.date .value time')?.getAttribute('datetime').split(' ')[0]; // YYYY-MM-DD
        const pages = document.querySelector('li.meta-data.pages .value')?.textContent.trim();
        const url = window.location.href;

        const comicInfo = `<?xml version="1.0"?>
<ComicInfo xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <Title>${title}</Title>
    <Format>${categories.join(', ')}</Format>
    <Language>${languages.join(', ')}</Language>
    <Writer>${artists.join(', ')}</Writer>
    <Tags>${tags.join(', ')}</Tags>
    <Date>${date}</Date>
    <Pages>${pages}</Pages>
    <Web>${url}</Web>
</Comicinfo>`;

        return comicInfo;
    }

    init();
})();