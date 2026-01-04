// ==UserScript==
// @name      Youtube Custom Emoji Downloader
// @namespace    https://greasyfork.org/en/scripts/463860-youtube-custom-emoji-downloader
// @homepage     https://greasyfork.org/en/scripts/463860-youtube-custom-emoji-downloader
// @version      1.0.0
// @description  Add Download All Emoji Button on The Membership page.
// @author       Tanuki
// @author       You
// @run-at       document-end
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463860/Youtube%20Custom%20Emoji%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/463860/Youtube%20Custom%20Emoji%20Downloader.meta.js
// ==/UserScript==

//Download badges
function dlBadges(fname,data) {
    JSZipDownload(getImages(data,false), fname)
}

//Download emojis
function dlEmojis(fname, data) {
    JSZipDownload(getImages(data,false), fname)
}


setInterval(function(){
    try {
        //Check if membership join button clicked
        var PerksPopupHidden = document.querySelectorAll('ytd-popup-container > tp-yt-paper-dialog')[0].getAttribute('aria-hidden')
        if (PerksPopupHidden) return;
    } catch(err) { return; }

    //Create a download Button if not exists
    if (!document.getElementById('badges-dl') && !document.getElementById('emoji-dl')) {
        //get channel handle name but without @ (at) and add .zip extension
        var Channel = document.querySelectorAll('#channel-handle')[0].innerText.match(/(?<![\w@])@([\w@]+(?:[.!][\w@]+)*)/g)[0].replace("@","")+".zip";
        var PerksContainer = document.querySelectorAll('#perks_section > #perks > div > ytd-sponsorships-perk-renderer > #container > #images-line')
        var Badges = PerksContainer[0] //Badges element selector
        var Emojis = PerksContainer[1] //Emojis element selector

        //download button style
        var btnStyle = "margin-bottom:5px; border-radius: 15px; background-color: #3ea6ff; color: #000000; font-size: 19px; border: none; height: 32px; cursor: pointer;"

        //Insert Download Button
        Badges.insertAdjacentHTML("beforebegin","<button id=\"badges-dl\" style=\""+ btnStyle +"\">Download</button>")
        Emojis.insertAdjacentHTML("beforebegin","<button id=\"emojis-dl\" style=\""+ btnStyle +"\">Download</button>")

        //Handle Button Click
        document.getElementById('badges-dl').addEventListener('click', dlBadges.bind(null, Channel, Badges));
        document.getElementById('emojis-dl').addEventListener('click', dlEmojis.bind(null, Channel, Emojis));

    }

}, 500);

//get all emojis/badges image url
const getImages = (el, includeDuplicates = false) => {
  const images = [...el.getElementsByTagName('img')].map(img =>
    img.getAttribute('src').slice(0,img.currentSrc.indexOf("="))
  );
  return includeDuplicates ? images : [...new Set(images)];
};

function JSZipDownload(Urls,fname){
    var zip = new JSZip();

    Urls.forEach(function(url,i){
        var filename = "Emoji_"+i+".png";
        // loading a file and add it in a zip file
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                throw err; // or handle the error
            }
            zip.file(filename, data, {binary:true});
            if (i == Urls.length-1) {
                zip.generateAsync({type:'blob'}).then(function(content) {
                    saveAs(content, fname);
                });
            }
        });
    });
}