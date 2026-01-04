// ==UserScript==
// @name         Dump shit
// @version      1.1
// @description  I'm sick of right clicking download or resorting to the shitty 1 click downloader (which doesn't use the timestamp filename) for my cartoons
// @author       Ayoholup
// @match        *://*/*
// @grant        GM_download
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @namespace https://greasyfork.org/users/476679
// @downloadURL https://update.greasyfork.org/scripts/399838/Dump%20shit.user.js
// @updateURL https://update.greasyfork.org/scripts/399838/Dump%20shit.meta.js
// ==/UserScript==

(function() {
    const HOTKEY = "NumpadMultiply";

    let previews4Chan = (src) => {
        let spl = src.split(".");
        let filename = spl[spl.length - 2];
        let hasS = filename.substr(filename.length - 1).toLowerCase() == "s";
        if (hasS) { spl[spl.length-2] = spl[spl.length-2].slice(0, -1); }
        return spl.join(".");
    };
    //forceExt is to bruce force all extensions in the array below.
    //not needed for tiktok as videos only have 1 extension and is provided before calling the download function.
    let download = (url, filename, forceExt = false) => {
        if (!forceExt) {
            //runs if you know the specific file extension needed.
            GM_download({
                url: url,
                name: filename,
                onload: () => console.log(`${filename} worked out fine`)
            });
        } else {
            //brute forces all the following file extensions. Only 1 will work so no duplicates i hope
            let ext = ["jpg", "jpeg", "png", "gif", "webm", "mp4"].forEach((ext) => {
                let newURL = url.substring(0, url.lastIndexOf(".") + 1) + ext;
                let newFilename = filename.substring(0, filename.lastIndexOf(".") + 1) + ext;
                GM_download({
                    url: newURL,
                    name: newFilename,
                    onload: () => console.log(`${newFilename} worked out fine`),
                    onerror: (error, details) => console.log(error, details)
                });
            });
        }
    }
    let parseImg = (e) => {
        if (e.code == HOTKEY) {
            let hover = Array.from(document.querySelectorAll(":hover"));
            hover.forEach((el) => {
                //images and stuff (4chan etc...)
                if (el.tagName.toLowerCase() == "img") {
                    let src = el.currentSrc;
                    //Downloads full image if hovering over preview
                    if (window.location.hostname.includes("4chan")) {
                        src = previews4Chan(src);
                    }
                    //filename without extension, will be brute forced later.
                    let filename = src.split("/").pop();
                    console.log(`Downloading URL: ${src} into Filename: ${filename}`);
                    download(src, filename, forceURLExt = true);
                }
            });
        }
    };
    document.addEventListener("keydown", parseImg);
})();