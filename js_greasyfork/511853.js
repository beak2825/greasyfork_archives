// ==UserScript==
// @name        Download from www.redgifs.com
// @namespace   Violentmonkey Scripts
// @match       https://www.redgifs.com/*
// @grant       none
// @version     1.02
// @author      ape-that-presses-keys
// @license     MIT
// @description Adds a download button to each video. (video selection fixed)
// @downloadURL https://update.greasyfork.org/scripts/511853/Download%20from%20wwwredgifscom.user.js
// @updateURL https://update.greasyfork.org/scripts/511853/Download%20from%20wwwredgifscom.meta.js
// ==/UserScript==

(()=>{
    console.log("UserScript: Download from redgifs");

    let add_volume_slider = false;
    
    let dl = `(()=>{
    {
        let vid_div = this.parentElement.parentElement.parentElement.parentElement;
        let img_url = vid_div.firstChild.firstChild.src.split('-mobile.jpg')[0];
        if (vid_div.childNodes[1].firstChild.childNodes[1].firstChild.src.substring(0, 4) == 'blob') {
            window.open(img_url + '.m4s', '_blank');
        } else {
            window.open(img_url + '.mp4', '_blank');
        }
    }
    })()`;
    
    let set_volume = `(()=>{
    {
        document.querySelectorAll('video').forEach((e) => {
            e.volume = this.value;
        });
    }
    })()`;
    
    let volume_slider_html = `<li class="SideBar-Item"><input type="range" min="0" max="1" value="1" step="0.01" style="width: 50px" onchange="${set_volume}"/></li>`;
    let dl_button_html = `<li class="SideBar-Item"><button class="redgifs_dl_button" onclick="${dl}">DL</button></li>`;
    
    // should use a mutationobserver instead of an interval
    let append_dl_button_interval = setInterval(() => {
        document.querySelectorAll(".SideBar:not(:has(* > .redgifs_dl_button))").forEach((e) => {
            e.insertAdjacentHTML("beforeEnd", dl_button_html);
            if (add_volume_slider)
                e.children[2].insertAdjacentHTML("afterEnd", volume_slider_html);
        });
    }, 500);
})();

// Find & replace regex for vscode:
// Find:    ^(.*).m4s$
// Replace: ffmpeg -i "$1.m4s" -c copy "$1.mp4"
