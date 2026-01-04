// ==UserScript==
// @name        vidlQ Thumbnail Downloader
// @namespace   MegaPiggy
// @match       https://www.youtube.com/watch?v=*
// @match       https://youtu.be/*
// @version     1.1
// @author      MegaPiggy
// @description Changes the "View full thumbnail" button to a download button instead
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459457/vidlQ%20Thumbnail%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/459457/vidlQ%20Thumbnail%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';


    var svgDownloadBtn = `<div class="vidiq-video-companion-thumbnail-overlay-svg"><svg id="WaveOvalInterfaceDownloadIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 3C12.5523 3 13 3.44772 13 4V12.5858L15.2929 10.2929C15.6834 9.90237 16.3166 9.90237 16.7071 10.2929C17.0976 10.6834 17.0976 11.3166 16.7071 11.7071L12.7071 15.7071C12.5196 15.8946 12.2652 16 12 16C11.7348 16 11.4804 15.8946 11.2929 15.7071L7.2929 11.7071C6.90238 11.3166 6.90238 10.6834 7.2929 10.2929C7.68342 9.90237 8.31659 9.90237 8.70711 10.2929L11 12.5858V4C11 3.44772 11.4477 3 12 3ZM4.00001 14C4.55229 14 5.00001 14.4477 5.00001 15C5.00001 15.9772 5.00485 16.3198 5.05765 16.5853C5.29437 17.7753 6.22466 18.7056 7.41474 18.9424C7.68018 18.9952 8.02276 19 9.00001 19H15C15.9772 19 16.3198 18.9952 16.5853 18.9424C17.7753 18.7056 18.7056 17.7753 18.9424 16.5853C18.9952 16.3198 19 15.9772 19 15C19 14.4477 19.4477 14 20 14C20.5523 14 21 14.4477 21 15C21 15.0392 21 15.0777 21 15.1157C21.0002 15.9334 21.0004 16.4906 20.9039 16.9755C20.5094 18.9589 18.9589 20.5094 16.9755 20.9039C16.4907 21.0004 15.9334 21.0002 15.1158 21C15.0778 21 15.0392 21 15 21H9.00001C8.96084 21 8.92225 21 8.88423 21C8.06664 21.0002 7.50935 21.0004 7.02456 20.9039C5.0411 20.5094 3.49061 18.9589 3.09608 16.9755C2.99965 16.4906 2.99978 15.9334 2.99999 15.1158C3 15.0777 3.00001 15.0392 3.00001 15C3.00001 14.4477 3.44772 14 4.00001 14Z" clip-rule="evenodd"></path></svg></div>`;

    function forceDownload(url, fileName){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = function(){
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(this.response);
            var tag = document.createElement('a');
            tag.href = imageUrl;
            tag.download = fileName;
            document.body.appendChild(tag);
            tag.click();
            document.body.removeChild(tag);
        }
        xhr.send();
    }

    function onClickHandlerMax(e) {
      forceDownload(document.body.getElementsByClassName("vidiq-video-companion-thumbnail-img")[0].src.replace("hqdefault", "maxresdefault"), "maxresdefault.jpg");
    }

    function onClickHandlerSD(e) {
      forceDownload(document.body.getElementsByClassName("vidiq-video-companion-thumbnail-img")[0].src.replace("maxresdefault", "sddefault").replace("hqdefault", "sddefault"), "sddefault.jpg");
    }

    function onClickHandlerHQ(e) {
      forceDownload(document.body.getElementsByClassName("vidiq-video-companion-thumbnail-img")[0].src.replace("maxresdefault", "hqdefault"), "hqdefault.jpg");
    }

    function runScript() {
        var thumbnail = document.body.getElementsByClassName("vidiq-video-companion-thumbnail")[0];
        var svgold = document.body.getElementsByClassName("vidiq-video-companion-thumbnail-overlay-svg")[0];
        if (thumbnail && !svgold)
        {
            var thumbnail_img = thumbnail.getElementsByClassName("vidiq-video-companion-thumbnail-img")[0];
            var thumbnail_overlay = thumbnail.getElementsByClassName("vidiq-video-companion-thumbnail-overlay")[0];
            thumbnail_overlay.innerHTML = svgDownloadBtn + '<div class="vidiq-video-companion-thumbnail-overlay-text">Download max thumbnail</div>';
            var clone = thumbnail_overlay.cloneNode(true);
            thumbnail_overlay.replaceWith(clone);
            thumbnail_overlay = clone;
            thumbnail_overlay.onclick = onClickHandlerMax;
            var thumbnail_sd = thumbnail.cloneNode(true);
            var thumbnail_hq = thumbnail.cloneNode(true);
            thumbnail.setAttribute('class', thumbnail.getAttribute('class') + " maxresdefault");
            thumbnail_sd.setAttribute('class', thumbnail_sd.getAttribute('class') + " sddefault");
            thumbnail_hq.setAttribute('class', thumbnail_hq.getAttribute('class') + " hqdefault");
            thumbnail.parentElement.appendChild(thumbnail_sd);
            thumbnail.parentElement.appendChild(thumbnail_hq);
            var thumbnail_sd_img = thumbnail_sd.getElementsByClassName("vidiq-video-companion-thumbnail-img")[0];
            var thumbnail_hq_img = thumbnail_hq.getElementsByClassName("vidiq-video-companion-thumbnail-img")[0];
            thumbnail_img.src = thumbnail_img.src.replace("hqdefault", "maxresdefault");
            thumbnail_sd_img.src = thumbnail_sd_img.src.replace("maxresdefault", "sddefault").replace("hqdefault", "sddefault");
            thumbnail_hq_img.src = thumbnail_hq_img.src.replace("maxresdefault", "hqdefault").replace("sddefault", "hqdefault");
            var thumbnail_sd_overlay = thumbnail_sd.getElementsByClassName("vidiq-video-companion-thumbnail-overlay")[0];
            var thumbnail_hq_overlay = thumbnail_hq.getElementsByClassName("vidiq-video-companion-thumbnail-overlay")[0];
            thumbnail_sd_overlay.onclick = onClickHandlerSD;
            thumbnail_hq_overlay.onclick = onClickHandlerHQ;
            thumbnail_sd_overlay.getElementsByClassName("vidiq-video-companion-thumbnail-overlay-text")[0].textContent = "Download sd thumbnail";
            thumbnail_hq_overlay.getElementsByClassName("vidiq-video-companion-thumbnail-overlay-text")[0].textContent = "Download hq thumbnail";
        }
    }

    runScript();
    setInterval(runScript, 1000);
})();