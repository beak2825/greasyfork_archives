// ==UserScript==
// @name         n210-dl
// @namespace    https://gist.github.com/hiroshil
// @version      0.1.1
// @description  Script used to download manga R18 on some domain of nhentai
// @license      MIT
// @author       hiroshil
// @source       https://gist.github.com/hiroshil/86723bc557efa88931cf6b135e42a2b2
// @match        http*://nhentai.to/g/*
// @match        http*://nhentai.xxx/g/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhentai.to
// @downloadURL https://update.greasyfork.org/scripts/492433/n210-dl.user.js
// @updateURL https://update.greasyfork.org/scripts/492433/n210-dl.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

//https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
//https://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
//https://stackoverflow.com/questions/5582574/how-to-check-if-a-string-contains-text-from-an-array-of-substrings-in-javascript
//https://stackoverflow.com/questions/39993676/code-inside-domcontentloaded-event-not-working

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelectorAll(selector).length) {
            return resolve(document.querySelectorAll(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelectorAll(selector).length) {
                resolve(document.querySelectorAll(selector));
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
        	res.timeout = 12000; // slow internet catch
		res.responseType = responseType;
		res.open(method, url, true);
		res.send();
		res.onload = () => {
			if (res.status >= 200 && res.status < 400) {
				resolve(res.response);
			} else {
				resolve(false);
			}
		}
		res.onerror = () => {
		    resolve(false);
		}
		res.ontimeout = () => {
		    resolve(false);
		}
	});

}
function sleeper(ms) {
  return function(x) {
    return new Promise(resolve => setTimeout(() => resolve(x), ms));
  };
}
function parseStr(text) {
  /*
  Checks if the string matches the format "number-number" with the second number larger.

  Args:
      text: The string to check.

  Returns:
      Two numbers if the string matches the format and the second number is larger, False otherwise.
  */
  const pattern = /^\d+-\d+$/; // Matches "number-number" format
  const match = pattern.exec(text);

  if (match) {
    const [num1, num2] = match[0].split("-"); // Split into two numbers
    if (parseInt(num1) < parseInt(num2)){ // Check if second number is larger
        return [parseInt(num1), parseInt(num2)]
    }
  }

  return false;
}
function getType(idx) {
    if (xxx210) return gallery_.images.pages[idx].split(",").at(0);
    return gallery_.images.pages[idx].t;
}
async function downloadChapter(id=null,filename=null, callback=(e)=>{}, ret = 10){
    const dlBtn = document.querySelector("#dlz");
    if (!(dlBtn.classList.contains(btnDblTag))) {
        dlBtn.classList.add(btnDblTag);
        var s_p = 1;
        var e_p = gallery_.num_pages;
        let pt = prompt("Please enter the number of pages you want to download (Pattern: first page-last page. Example: 15-30)", "Click Continue to download all");
        const pg = parseStr(pt)
        if (pg) {
            s_p = pg[0];
            e_p = pg[1];
        }
        if (pt != null) {
            const zipFileWriter = new zip.BlobWriter();
            const zipWriter = new zip.ZipWriter(zipFileWriter);
            for (let i = s_p; i <= e_p; i++) {
                var ext;
                switch (getType(i-1)) {
                    case "j":
                        ext = "jpg";
                        break;
                    case "p":
                        ext = "png";
                        break;
                }
                const fname = i.toString() + "." + ext;
                const src = media_url_ + id + "/"+ fname;
                console.log(((e_p-s_p)-(e_p-i)+1).toString() + "/" + (e_p-s_p+1).toString() + ": downloading "+src); //debug
                var blob;
                do {
                    blob = await waitForXHRRequest(src,'GET','blob');
                    ret -= 1;
                    if (!blob && !ret) {
                        alert("Error while downloading file: " + src);
                        callback(dlBtn);
                        return;
                    }
                    else
                    {
                        await delay(1000);
                    }
                }
                while (!blob && ret);
                if (blob.type.includes("image")){
                    const blobReader = new zip.BlobReader(blob);
                    await zipWriter.add(fname, blobReader);
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
    }
    callback(dlBtn);
}
function setupButton(jNode) {
    const btnDiv = jNode.parentElement;
        const clonedElement = jNode.cloneNode(true); // Clone the element with all its content
        clonedElement.id = "dlz";
        if (xxx210) {
            clonedElement.style.marginLeft = "10px";
        }
        else{
            clonedElement.classList.remove(btnDblTag);
            clonedElement.querySelector(".top").textContent = "Click to download as zip";
        }

        btnDiv.appendChild(clonedElement); // Append the cloned element to the last child

        clonedElement.addEventListener("click", (e)=>{
            downloadChapter(gallery_.media_id, gallery_.title.japanese + ".zip", (el)=>{ el.classList.remove(btnDblTag); });
        });
}
const regex = /^https?:\/\/nhentai\.([^/]+)\/g\/(\d{6})\/?$/;
if (regex.test(location.href)) {
    var xxx210 = (location.host.split(".").at(-1) == "xxx") ? true : false;
    var gallery_, media_url_, btnDblTag;
    document.onreadystatechange = async () => {
        if (document.readyState === 'interactive') {
            const srcUrl = document.querySelector("img[src*='cover'").src;
            media_url_ = "https://" + new URL(srcUrl).host;
            if (xxx210){
                gallery_ = {
                    "media_id": document.querySelector("#load_id").value,
                    "media_server": document.querySelector("#load_server").value,
                    "media_dir": document.querySelector("#load_dir").value,
                    "images": {
                        "pages" : g_th["fl"]
                    },
                    "title": {
                        "japanese": document.querySelector("div.info > h2").innerText,
                    },
                    "num_pages": parseInt(document.querySelector("#load_pages").value)
                };
                media_url_ += "/" + gallery_.media_dir + "/";
                btnDblTag = "disabled";
            }
            else{
                gallery_ = gallery;
                media_url_ += "/galleries/";
                btnDblTag = "btn-disabled";
            }
            var xhr = await waitForXHRRequest("https://raw.githubusercontent.com/gildas-lormeau/zip.js/v2.7.17/dist/zip.js","GET",undefined);
            eval(xhr);
            const btn = await waitForElm("i[class*='fa-download']");
            setupButton(btn[0].parentElement);
        }
    }
}
