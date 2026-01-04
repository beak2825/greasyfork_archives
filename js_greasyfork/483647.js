// ==UserScript==
// @name         tmo-dl
// @namespace    https://gist.github.com/hiroshil
// @version      1.0
// @description  Script to download manga from TuMangaOnline
// @license      MIT
// @author       hiroshil
// @match        https://visortmo.com/library/manga/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=visortmo.com
// @downloadURL https://update.greasyfork.org/scripts/483647/tmo-dl.user.js
// @updateURL https://update.greasyfork.org/scripts/483647/tmo-dl.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

//https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep

function waitForElm(selector) {
    return new Promise(resolve => {
        if ($(selector).length) {
            return resolve($(selector));
        }
        const observer = new MutationObserver(mutations => {
            if ($(selector).length) {
                resolve($(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
function waitForXHRRequest(url,method,responseType = undefined, getUrl = false) {
	return new Promise( (resolve, reject) => {
		var res = new XMLHttpRequest();
		res.responseType = responseType;
		res.open(method, url, true);
		res.send();
		res.onload = () => {
			if (res.status >= 200 && res.status < 400) { // If response is all good...
                if (getUrl) {
                    resolve(res.responseURL);
                }
				resolve(res.response);
			} else {
				reject(false);
			}
		}
	});

}
var sleepSetTimeout_ctrl;
function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}
async function downloadChapter(url,filename, callback){
    const finalURL = await waitForXHRRequest(url, "GET", undefined, true);
    const regex = /viewer\/(.*?)(?:\/|$)/;
    const match = finalURL.match(regex);

    if (match) {
        const chapId = match[1];
        const res = await waitForXHRRequest(finalURL.split(chapId)[0] + chapId + "/cascade", "GET");
        if (res){
            const imgs = $(res).find("#main-container .viewer-img");
            const zipFileWriter = new zip.BlobWriter();
            const zipWriter = new zip.ZipWriter(zipFileWriter);
            for (let i = 0; i < imgs.length; i++) {
                const src = $(imgs[i]).attr("data-src");
                var blob;
                do {
                    blob = await waitForXHRRequest(src,'GET','blob');
                    await sleep(200);
                }
                while (!blob);
                if (blob.type.includes("image")){
                    const blobReader = new zip.BlobReader(blob);
                    await zipWriter.add(String(i) + "_" + src.split("/").pop(), blobReader);
                }
            }
            await zipWriter.close();
            const zipFileBlob = await zipFileWriter.getData();
            const anchor = document.createElement("a");
            const clickEvent = new MouseEvent("click");
            anchor.href = window.URL.createObjectURL(zipFileBlob);
            anchor.download = filename;
            anchor.dispatchEvent(clickEvent);
        }
        else {
            alert("Error!! Please try again!");
        }
    } else {
        alert("Error!! Please try again!");
    }
    callback();
}
function setupButton(jNode) {
      jNode.each(function() {
          const chapName = $(this).prev().find("div > div.col-10.text-truncate > a").text().trim();
          var viewBtn = $( "#" + $(this).attr("id") + " > div > ul > li > div > div.col-2.col-sm-1.text-right").first();
          var chapURL = viewBtn.find("a").attr('href');
          viewBtn.prev().remove();
          var dwnlBtn = viewBtn.clone();
          dwnlBtn.find("a").removeAttr("href").removeClass("btn-sm").addClass("btn-lg").find("span").removeAttr('class').addClass("fas fa-arrow-alt-circle-down dl-btn");
          dwnlBtn.click(function() {
              $(this).attr('disabled','disabled');
              $(this).find(".dl-btn").removeClass("fas").addClass("far");
              const output = $(".element-title.my-2").contents().first().text().trim() + " - " + chapName + ".zip";
              console.log(output);
              downloadChapter(chapURL, output, () => { $(".dl-btn").closest("[disabled]").removeAttr('disabled').find("span").removeClass("far").addClass("fas"); });
          });
          viewBtn.after(dwnlBtn);
      });
}
async function main(){
    var xhr = await waitForXHRRequest("https://raw.githubusercontent.com/gildas-lormeau/zip.js/v2.7.17/dist/zip.js","GET");
    eval(xhr);
    const jNode = await waitForElm('.upload-link > div');
    setupButton(jNode);
}
main();