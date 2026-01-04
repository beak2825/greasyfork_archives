// ==UserScript==
// @name     Hypixel Thread Wikitext Parser
// @namespace https://hypixel-skyblock.fandom.com
// @description QOL Script for Uploading Changelog
// @license  MIT
// @version  0.2
// @grant    none
// @author   monkeysHK
// @include  https://hypixel.net/*
// @require  https://cdn.jsdelivr.net/gh/eligrey/FileSaver.js@cea522bc41bfadc364837293d0c4dc585a65ac46/dist/FileSaver.min.js
// @require  https://cdn.jsdelivr.net/gh/Stuk/jszip@2ceb998e29d4171b4f3f2ecab1a2195c696543c0/dist/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/469181/Hypixel%20Thread%20Wikitext%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/469181/Hypixel%20Thread%20Wikitext%20Parser.meta.js
// ==/UserScript==
/* jshint
    esversion: 9
*/

var imageCount = 0;

var images = [];

var postnum, postdate, finaltext;

function parsetext(elm) {
    var temp;
    var lines = [];
    var currEl = [];
    var lineflush = () => {
        lines.push(currEl.join(" "));
        currEl = [];
    };
    var pushtext = (text, template) => {
        // push only if not empty
        if (text !== "")
            currEl.push((template || "{}").replaceAll("{}", text));
    };
    var newparagraph = () => {
        lineflush();
        lineflush();
    };
    elm.childNodes.forEach((value, index, nodelist) => {
        if (value.nodeName === "BR" || value.nodeName === "BUTTON") {
            newparagraph();
        }
        else if (value.nodeName === "#text") {
            temp = value.wholeText.trim();
            if (temp !== "" && temp !== "►")
                currEl.push(temp);
        }
        else if (value.nodeName === "B") {
            pushtext(parsetext(value), "'''{}'''");
        }
        else if (value.nodeName === "I") {
            pushtext(parsetext(value), "''{}''");
        }
        else if (value.nodeName === "UL") {
            lineflush();
            value.childNodes.forEach(v => {
                if (v.nodeName === "LI") {
                    pushtext(parsetext(v).split("\n").map(v => v === "" ? v : `*${v}`).join("\n"));
                    lineflush();
                }
            });
            lineflush();
        }
        else if (value.nodeName === "OL") {
            lineflush();
            value.childNodes.forEach(v => {
                if (v.nodeName === "LI")
                    pushtext(parsetext(v).split("\n").map(v => v === "" ? v : `#${v}`).join("\n"));
                    lineflush();
            });
        }
        else if (value.nodeName === "SPAN") {
            if (value.style["font-size"] === "22px") {
                pushtext(value.innerText.trim(), "== {} ==");
            }
            else {
                pushtext(parsetext(value));
            }
        }
        else if (value.nodeName === "DIV") {
            if (value.classList.contains("bbCodeBlock-content")) {
                pushtext(parsetext(value), "{{TextSection|text=\n{}\n}}");
                newparagraph();
            }
            else {
                pushtext(parsetext(value));
            }
        }
        else if (value.nodeName === "IMG") {
          	if (!value.className.includes("smilie")) {
                pushtext(parsetext(value));
                var big = (value.getAttribute("width") || 0) > 800; // big image
                images.push(value.getAttribute("src"));
                pushtext(`[[File:Changelog-${postdate}-${imageCount}.{{{MIME_${imageCount}}}}${big ? "|class=img-banner" : ""}]]`);
                imageCount++;
            }
        }
        else {
            pushtext(parsetext(value));
        }
    });
    lineflush();
    console.log(lines.join("\n").trim());
    return lines.join("\n").trim();
}

async function blobify(url) {
    console.log("Blobifying: " + url);
    const response = await fetch(url);
    const blob = await response.blob();
    console.log("Blob done", blob);
    return blob;
}

function blobToBase64(blob) {
return new Promise((resolve, _) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(reader.result);
  reader.readAsDataURL(blob);
});
}

async function zipall() {
    const zip = new JSZip();
    for (var i in images) {
        var blob = await blobify(images[i]);
        var mime = blob.type.split("/")[1];
        var b64 = await blobToBase64(blob);
        finaltext = finaltext.replaceAll(`{{{MIME_${i}}}}`, mime);
        zip.file(`Changelog-${postdate}-${i}.${mime}`, b64.split("base64,")[1], {base64:true});
    }
  	finaltext = finaltext.replaceAll("“", "\"").replaceAll("”", "\"");
    zip.file("text.txt", `{{Update Link|post=${postnum}|title=${document.querySelector("h1.p-title-value").innerText}}}\n\n${finaltext}`);
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        saveAs(content, `Changelog-${postdate}.zip`);
    });
}

function execute(postnode) {
    console.log("[HypixelTWP] Start parsing");
    postdate = postnode.querySelector(".message-attribution-main time").getAttribute("datetime").split("T")[0];
    imageCount = 0;
    images = [];
    finaltext = parsetext(postnode.querySelector(".message-body .bbWrapper"))
        .replaceAll(/%PAR%/g, "\n\n") // force paragraph
        .replaceAll(/\n{3,}/g, "\n\n") // max consec newlines: 2
        .replaceAll(/^([*#]+)(?=\S)/gm, "$1 "); // add space before list item text;
    console.log("[HypixelTWP] Done parsing");
    console.log("[HypixelTWP] Start zipping");
    zipall();
    console.log("[HypixelTWP] Done zipping");
}

function main() {
    var postnode = document.querySelector(".message-main"); // select first one only
    postnum = window.location.toString().match(/(\d+)\/?$/)[1];
    var btn = document.createElement("button");
    btn.addEventListener("click", () => execute(postnode));
    btn.innerHTML = "Gen doc";
    postnode.querySelector(".message-body .bbWrapper").before(btn);
}

window.addEventListener("load", main);