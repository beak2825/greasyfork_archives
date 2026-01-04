// ==UserScript==
// @name         TSS Zipper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate TSS download zip
// @author       RMC
// @match        https://stor.tsssaver.1conan.com/tsssaver/shsh/2569997010894894/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435153/TSS%20Zipper.user.js
// @updateURL https://update.greasyfork.org/scripts/435153/TSS%20Zipper.meta.js
// ==/UserScript==

$("#dlZIP").attr("href", "javascript:main()");
$("body").append($("<script>" + main + "</script>"))

async function main() {
    const getBinContent = (url, version, name) => {
        return new Promise((resolve, reject) => {
            JSZipUtils.getBinaryContent(url, (err, data) => {
                if (err) return reject(err)
                zip.folder(version).file(name, data, {binary: true});
                resolve("Added folder: ", version, " to zip file")
            })
        })
    }

    // Get href property from selected elements.
    function getAbsoluteHrefs(selected) {
        return selected.map(function () {
            return $(this).prop("href")
        }).get()
    }

    // Get href attribute from selected elements.
    function getHrefs(selected) {
        return selected.map(function () {
            return $(this).attr("href")
        }).get()
    }

    // Get blob version and .shsh URL
    let getBlob = function (url, version) {
        return function (data) {
            let blob = $("tr:not(:first-child) td:first-child a", data);
            let blobHref = blob.attr("href");
            zipings.push(getBinContent(url + blobHref, version, blobHref))
        };
    };

    let zip = new JSZip();
    let requests = []
    let zipings = []

    // Main page table <a> elements
    let mainTable = $("#list tbody tr:not(:first-child) td:first-child a");

    // URLs for each iOS blob version
    let urls = getAbsoluteHrefs(mainTable)

    // Each iOS blob version
    let iosVersions = getHrefs(mainTable)

    // console.log("Versions: ", iosVersions)

    // HTTP GET on each blob URL
    for (let i = 0; i < urls.length; i++) {
        requests.push($.get(urls[i], getBlob(urls[i], iosVersions[i])))
    }

    // Wait each HTTP GET on each blob URL
    for (let i = 0; i < urls.length; i++) {
        await requests[i]
        await zipings[i]
    }

    zip.generateAsync({type: "blob", compression: "DEFLATE",}).then(function (content) {
        saveAs(content, "blobs.zip")
    });
}
