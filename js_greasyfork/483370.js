// ==UserScript==
// @name         Simple YouTube Downloader
// @namespace    http://tampermonkey.net/
// @version      2023-12-28
// @description  Download YouTube videos easily
// @author       ethry
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/483370/Simple%20YouTube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/483370/Simple%20YouTube%20Downloader.meta.js
// ==/UserScript==

(function() {
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    waitForElm('ytd-offline-promo-renderer').then((elm) => {
        elm.innerHTML = `
  <style>#noytpremiumupgradedllink{text-decoration:none}.loading-spinner{border:4px solid rgba(255,255,255,1);border-radius:50%;border-top:4px solid rgba(255,255,255,0);width:24px;height:24px;animation:1s linear infinite spin}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}</style>

  <div class="style-scope ytd-offline-promo-renderer">
    <h1 style="filter: invert(); margin-left: 20px;">YouTube Downloader</h1>
  </div>

  <div class="style-scope ytd-offline-promo-renderer">
    <p style="filter: invert(); margin-left: 20px;">This video will be downloaded as an MP4 file:</p>
    <p id="dlVideoTitle" style="background: rgba(0,0,0,0.1); padding: 3px; max-width: calc(100% - 40px); max-height: 19px; overflow: hidden; filter: invert(); margin-left: 20px;">0</p>
    <p style="filter: invert(); margin-left: 20px; opacity: 0.65;">If you don't want this video to be downloaded, wait about 1 minute and try again.</p>
  </div>

  <div class="style-scope ytd-offline-promo-renderer">
    <p style="background-color: #19d1d1; filter: invert(); display: none; margin-left: 20px; margin-right: 20px; padding: 5px; border-radius: 5px;" id="downloaderr">Error while downloading: <span id="downloaderrreason"></span></p>
  </div>

  <div class="buttons style-scope ytd-offline-promo-renderer">
    <a href="#" id="noytpremiumupgradedllink" target="_blank">
      <button class="yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--call-to-action yt-spec-button-shape-next--size-m" aria-label="Log Out" title="" style="">
        <div class="yt-spec-button-shape-next__button-text-content">
          <span class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap" role="text" id="ytpremiumdlbtn"><div class="loading-spinner"></div></span>
        </div>
      </button>
    </a>
  </div>`;

        sendHttpReq((document.getElementById("above-the-fold").querySelector("#title").innerText == null ? window.location.toString() : document.getElementById("above-the-fold").querySelector("#title").innerText));

    });

    function sendHttpReq(videoTitle, oldVideoTitle = "") {
        if (videoTitle == oldVideoTitle) {
            setTimeout(function() {
                sendHttpReq(document.getElementById("above-the-fold").querySelector("#title").innerText, videoTitle)
            }, 10000);
            console.log("request cancelled due to same video");

            return;
        }

        document.getElementById("dlVideoTitle").innerText = (videoTitle == null) ? window.location.toString() : videoTitle;

        const apiUrl = 'https://co.wuk.sh/api/json';
        const requestData = {
            url: window.location.href
        };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', apiUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');

        console.log("sending request");

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const responseData = JSON.parse(xhr.responseText);
                    // debug: alert('Response data: ' + JSON.stringify(responseData.url));

                    document.getElementById("ytpremiumdlbtn").innerText = "Download";
                    document.getElementById("noytpremiumupgradedllink").href = responseData.url;

                    document.getElementById("downloaderr").style.display = "none";

                    console.log("request success");

                } else {
                    console.error('HTTP error! Status: ' + xhr.status);

                    document.getElementById("downloaderr").style.display = "block";
                    document.getElementById("downloaderrreason").innerText = xhr.status;
                }
            }
        };

        xhr.onerror = function() {
            console.error('Network error');

            document.getElementById("downloaderrreason").innerText = xhr.status + " | " + "Network error";
        };

        xhr.send(JSON.stringify(requestData));


        setTimeout(function() {
            sendHttpReq(document.getElementById("above-the-fold").querySelector("#title").innerText, videoTitle)
        }, 5000);
    }
})();