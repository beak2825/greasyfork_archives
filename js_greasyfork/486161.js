// ==UserScript==
// @name         210vn-dl
// @namespace    https://gist.github.com/hiroshil
// @version      0.0.6
// @description  Script dùng để download manga R18 trên 1 domain của hentaivn
// @license      MIT
// @author       hiroshil
// @source       https://gist.github.com/hiroshil/b85af14867493a72bd1cb24831bf0668
// @include      http*://*.*/*doc-truyen*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentaivn.icu
// @downloadURL https://update.greasyfork.org/scripts/486161/210vn-dl.user.js
// @updateURL https://update.greasyfork.org/scripts/486161/210vn-dl.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

//https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
//https://stackoverflow.com/questions/3754092/how-to-get-a-html-element-from-a-string-with-jquery
//https://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
//https://stackoverflow.com/questions/5582574/how-to-check-if-a-string-contains-text-from-an-array-of-substrings-in-javascript

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
function waitForXHRRequest(url,method,responseType) {
	return new Promise( (resolve, reject) => {
		var res = new XMLHttpRequest();
		res.responseType = responseType;
		res.open(method, url, true);
		res.send();
		res.onload = () => {
			if (res.status >= 200 && res.status < 400) {
				resolve(res.response);
			} else {
				reject(false);
			}
		}
	});

}
function sleeper(ms) {
  return function(x) {
    return new Promise(resolve => setTimeout(() => resolve(x), ms));
  };
}
function downloadChapter(id,filename, callback, ret = 3, skipCr = true){
    $.post("../ajax_load_server.php", {
        server_id: id,
        server_type: 2
    },async (res) => {
        if (res){
            const imgs = $(res).filter("img");
            const zipFileWriter = new zip.BlobWriter();
            const zipWriter = new zip.ZipWriter(zipFileWriter);
            for (let i = 0; i < imgs.length; i++) {
                const src = imgs[i].src;
		if (skipCr) {
                    if ( src.split("?")[0].endsWith(".gif") ) continue;
                }
                var blob;
                do {
                    blob = await waitForXHRRequest(src,'GET','blob');
                    ret -= 1;
                    if (!blob && !ret) {
                        alert("Lỗi khi download file: " + src)
                    }
                    else
                    {
                        await sleeper(200);
                    }
                }
                while (!blob && ret);
                if (blob.type.includes("image")){
                    const blobReader = new zip.BlobReader(blob);
                    await zipWriter.add(String(i) + "_" + src.split("?").shift().split("/").pop(), blobReader);
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
            alert("Download không thành công!! Vui lòng thử lại!");
        }
        callback();
        });
}
function setupButton(jNode) {
      jNode.each(function() {
          const td = $("<td></td>");
          const button = $("<button></button>").addClass("dl-btn");
          button.text("Download");
          button.bind('click',function() {
              const chapURL = $(this).parent().parent()[0].firstElementChild.firstElementChild;
              $(this).attr('disabled','disabled');
              let hname = $("h1[itemprop='name']")[0].innerText;
              const cfilter = ["chap", "oneshot", "one shot"];
              if ( cfilter.find(s => hname.toLowerCase().includes(s)) ) hname = hname.split("-")[0].trim();
              const output = hname + " - " + chapURL.innerText + ".zip";
              downloadChapter(chapURL.href.split("-").at(1), output, () => { $(".dl-btn[disabled]").removeAttr('disabled'); });
          });
          td.append(button);
          $(this).append(td);
      });
}
async function main(){
    var xhr = await waitForXHRRequest("https://raw.githubusercontent.com/gildas-lormeau/zip.js/v2.7.17/dist/zip.js","GET",undefined);
    eval(xhr);
    const jNode = await waitForElm('#inner-listshowchapter > table > tbody > tr');
    setupButton(jNode);
}
const regex = /^https:\/\/[^/]+\.[^/]+\/\d+-doc-truyen-[^/]+\.html$/;
if (regex.test(window.location.href)) main();
