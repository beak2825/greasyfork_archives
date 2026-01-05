// ==UserScript==
// @name       Youtube MP3 Direct Download Button
// @author      Eddie
// @namespace  com.eddie.luke.atmey
// @version    1.9.1
// @description  Adds a MP3 Download button next to the subscribe button, thanks to youtubeinmp3 for their simple download service (http://youtubeinmp3.com/api/). Based off ninjasuite code. Just convert to direct download link.
// @match         http*://www.youtube.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @copyright  2015+, Eddie Luke Atmey
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/18463/Youtube%20MP3%20Direct%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/18463/Youtube%20MP3%20Direct%20Download%20Button.meta.js
// ==/UserScript==
(function () {
start();

function start() {

  // preparation
  var pagecontainer=document.getElementById('page-container');
  if (!pagecontainer) return;
  if (/^https?:\/\/www\.youtube.com\/watch\?/.test(window.location.href)) run();
  var isAjax=/class[\w\s"'-=]+spf\-link/.test(pagecontainer.innerHTML);
  var logocontainer=document.getElementById('logo-container');
  if (logocontainer && !isAjax) { // fix for blocked videos
    isAjax=(' '+logocontainer.className+' ').indexOf(' spf-link ')>=0;
  }
  var content=document.getElementById('content');
  if (isAjax && content) { // Ajax UI
      var mo=window.MutationObserver||window.WebKitMutationObserver;
      if(typeof mo!=='undefined') {
        var observer=new mo(function(mutations) {
          mutations.forEach(function(mutation) {
              if(mutation.addedNodes!==null) {
                for (var i=0; i<mutation.addedNodes.length; i++) {
                    if (mutation.addedNodes[i].id=='watch7-container' ||
                        mutation.addedNodes[i].id=='watch7-main-container') { // old value: movie_player
                      run();
                      break;
                    }
                }
              }
          });
        });
        observer.observe(content, {childList: true, subtree: true}); // old value: pagecontainer
      } else { // MutationObserver fallback for old browsers
        pagecontainer.addEventListener('DOMNodeInserted', onNodeInserted, false);
      }
  }
}

function onNodeInserted(e) {
    if (e && e.target && (e.target.id=='watch7-container' ||
        e.target.id=='watch7-main-container')) { // old value: movie_player
      // run
      run();
  }
}

function run () {

  // Create link + id
  var documentURL = document.URL.split("&")[0];
  var videoId = documentURL.split("=")[1];

  // AJAX Load link
  var url = '//youtubeinmp3.com/fetch/?format=json&video='+documentURL+"&hq=1";
  var method = 'GET';
  var xmlhttp = new XMLHttpRequest();
  if (!("withCredentials" in xmlhttp) && typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xmlhttp = new XDomainRequest();
    xmlhttp.open(method, url);
  } else {
    // xmlhttp for Chrome/Firefox/Opera/Safari.
    xmlhttp.open(method, url, true);
  }

  // Old style
  if (!xmlhttp) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open(method, url, true);
  }

  xmlhttp.onload = function () {
  // alert('readyState ' + xmlhttp.readyState + '\nStatus ' + xmlhttp.status + '\nresponse ' + xmlhttp.responseText);
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      var response = xmlhttp.responseText;
      var JSONObj = JSON.parse(response);

      // Create button with link
      var linkPath = JSONObj.link;

      // test response link object
      // alert(linkPath);
      generateDownloadButton(linkPath, false);
    };
  }

  xmlhttp.onerror = function () {
    // alert('failed readyState ' + xmlhttp.readyState + '\nStatus ' + xmlhttp.status + '\nresponse ' + xmlhttp.responseText);
    var linkPath = '//youtubeinmp3.com/fetch/?video='+encodeURIComponent(documentURL)+"&hq=1";
    generateDownloadButton(linkPath, true);
  };

  xmlhttp.send();
  // end run
  // alert('sync readyState ' + xmlhttp.readyState + '\nStatus ' + xmlhttp.status + '\nresponse ' + xmlhttp.responseText);
}

function generateDownloadButton(linkPath, isFailed) {
  var downloadButton = '<a id="youtube2mp3" class="yt-uix-button yt-uix-button-default" href="'+linkPath+'" style="margin-left: 8px; height: 26px; padding: 0 22px;" ' + (isFailed ? 'target="_blank"' : '') + '><img src="//youtubeinmp3.com/icon/download.png" style="vertical-align:middle;color: white;"> <span class="yt-uix-button-content" style="line-height: 25px; font-size: 12px;">MP3 Download</span></a>';
  var downloadButtonDOM = document.getElementById('youtube2mp3');

  var node = document.createElement('span');
  node.innerHTML = downloadButton;

  // Add to page
  var parentElement=document.getElementById('watch7-subscription-container');
  if (parentElement==null) {
    debug('DYVAM Error - No container for adding the download button. YouTube must have changed the code.');
    return;
  }

  if (downloadButtonDOM) {
    downloadButtonDOM.parentElement.removeChild(downloadButtonDOM);
  }

  parentElement.appendChild(node);
}

})();