// ==UserScript==
// @name         Slideshare Downloader
// @namespace    Slideshare Slide Downloader
// @version      0.4
// @description  Slideshare Slide Downloader (images)
// @author       Hosamn Based on DownloadBoxy By QQBoxy
// @match        https://www.slideshare.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458693/Slideshare%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/458693/Slideshare%20Downloader.meta.js
// ==/UserScript==

function getHighestResImg(element) {
  if (element.getAttribute("srcset")) {
    return element
      .getAttribute("srcset")
      .split(",")
      .reduce(
        (acc, item) => {
          let [url, width] = item.trim().split(" ");
          width = parseInt(width);
          if (width > acc.width) return { width, url };
          return acc;
        },
        { width: 0, url: "" }
      ).url;
  }

  return element.getAttribute("src");
}


function slideshareboxy() {
    var e = document.getElementById('slide-container').getElementsByTagName('source');
    var o = "";
    var a ;
    for(var key=0; key<e.length; key+=1) {
        if(e[key].attributes.srcset) {
            var url = getHighestResImg(e[key])
            a = document.createElement("a");
            a.target = url;
            a.href = url;
            a.download = key;
            a.click();
            // let picBlob = new Blob(url, {type: 'text/html'});
            // tar??.gz
            // https://stackoverflow.com/questions/49736214/force-a-download-to-download-image-instead-of-opening-url-link-to-image
        }
    }
}

function downloadboxy() {
    var btn = document.createElement("button");
    btn.onclick = function() {
        slideshareboxy();
    };

    btn.innerHTML = ">> Download Images <<";
    btn.style.textDecoration = "underline"
    document.getElementsByClassName('player-toolbar-item')[0].appendChild(btn);
}



function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback();
      return;
    }
    else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
          return;
        loopSearch();
        }
      }, checkFrequencyInMs);
    }
  })();
}


waitForElementToDisplay("#player-toolbar", downloadboxy, 100,10000);

