// ==UserScript==
// @name         Sankaku Channel Access Rights
// @namespace    http://tampermonkey.net/
// @version      20210312
// @description  Access blocked images on Sankaku Channel (does not support thumbnails)
// @author       Couchy (original author) & WujekTadek (modified an existing script)
// @updated by   WujekTadek
// @match        https://chan.sankakucomplex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453644/Sankaku%20Channel%20Access%20Rights.user.js
// @updateURL https://update.greasyfork.org/scripts/453644/Sankaku%20Channel%20Access%20Rights.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function unblockThumbs(target) {
        const thumbs = target.querySelectorAll("span.thumb");
        for (const thumb of thumbs) {
            var thumbnailReadyLink //DAS IST MEIN

            const link = thumb.firstElementChild;
            if (!link || link.href != "https://get.sankaku.plus/") {
                continue;
            }
            const id = thumb.id.substring(1); //READS ALL IMG ID'S CURRENTLY ON WEBPAGE
            link.href = `/post/show/${id}`;
            link.removeAttribute("target");
            const oReq = new XMLHttpRequest(); 
            oReq.addEventListener("load", function(){
                //console.log(oReq.responseText);
                const data = JSON.parse(oReq.responseText)[0];
                //alert(data); 
                //console.log(data);
                let scale = 1;
                if (data.preview_width > 150 || data.preview_height > 150) {
                    scale = 1 / Math.max(data.preview_width, data.preview_height);
                }

                const previewElem = thumb.children[0].children[0];
                //console.log(previewElem);
                previewElem.width = 150;
                previewElem.height = 150;
                previewElem.src = "https://chan.sankakucomplex.com/post/show/"+id+"";
                //previewElem.src = data.preview_url;

                let title = "";
                for (let tag of data.tags) {
                    title += `${tag.name_en} `;
                }
                //TODO: other info in title
                previewElem.title = title;

            });
            oReq.open("GET", `https://capi-v2.sankakucomplex.com/posts?lang=en&page=1&limit=1&tags=id_range:${id}`);
            oReq.send();
        }
    }

    function unblockLarge(content) {
        content.innerHTML = ""; //this
        const id = document.querySelector('meta[property~="og:image"][content]').content.slice(5);
        var properLink = "//s.s";
        properLink += id;
        window.open(properLink,"_self");
    }

    if (document.querySelector("span.thumb")) {
        unblockThumbs(document);
    }

    const content = document.getElementById("post-content");
    if (content && content.querySelector(".post-content-notification")) {
        unblockLarge(content);
    }
    //idk what that stuff below does --WujekTadek
    //and now it makes everything work again, while before it had to be commented...
    const list = document.getElementById("post-list");
    if (list) {
        const callback = function (mutations){
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].className == "content-page") {
                    console.log(mutation.addedNodes[0]);
                    unblockThumbs(mutation.addedNodes[0]);
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(list, {childList: true, subtree: true});
    }

    // Fix Sankaku's shit
    /*
var parts = /(.*) Rating:(\w)\w+ Score:(\S+) Size:(\d+)x(\d+) User:(.*)/.exec(title);
				o.tags = parts[1];
				o.rating = parts[2].toLowerCase();
				o.score = parseFloat(parts[3]);
				o.width = parseInt(parts[4]);
				o.height = parseInt(parts[5]);
				o.author = parts[6];
*/
    /*
const realExec = RegExp.prototype.exec;
RegExp.prototype.exec = function(str){
    let result = realExec.apply(this, [str]);
    if (!result && this.source.indexOf("Rating") > -1) {
        result = ["","","e","0","0","0",""];
    }
    return result;
};*/

})();