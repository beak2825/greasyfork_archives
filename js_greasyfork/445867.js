// ==UserScript==
// @name          Replace youtube redirect links
// @description   Replace youtube redirect links with direct links and extend links text to its full length
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://*.youtube.com/*
// @match         *://*.youtu.be/*
// @icon          https://cdn.icon-icons.com/icons2/1488/PNG/512/5295-youtube-i_102568.png
// @version       1.4.1
// @license       MIT
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/445867/Replace%20youtube%20redirect%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/445867/Replace%20youtube%20redirect%20links.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //Workaround: This document requires 'TrustedHTML' assignment
  if (window.trustedTypes && trustedTypes.createPolicy) {
    if (!trustedTypes.defaultPolicy) {
      const passThroughFn = (x) => x;
      trustedTypes.createPolicy('default', {
        createHTML: passThroughFn,
        createScriptURL: passThroughFn,
        createScript: passThroughFn,
      });
    }
  }

  const rootCallback = function (mutationsList, observer) {

    //Remove all event listeners from redirected links and replace redirect links by direct links
    var link = document.querySelectorAll("a[href*='/redirect?']");
    if (link != null && link.length > 0) {
      for (var i = 0; i < link.length; i++) {
        var newLink = link[i].href;
        newLink = decodeURIComponent(newLink.replace (/^.*\?(.*&)q=([^&]+)(&.*)?$/, '$2'));
        var newClone = link[i].cloneNode(true);
        newClone.setAttribute("href", newLink);
        newClone.setAttribute("redirect-removed", "0");
        link[i].parentNode.replaceChild(newClone, link[i]);
      }
    }
    //Repeat for links which YT tried to protect
    link = document.querySelectorAll("a[redirect-removed='0'][href='undefined']");
    if (link != null && link.length > 0) {
      for (i = 0; i < link.length; i++) {
        newLink = link[i].innerText;
        newClone = link[i].cloneNode(true);
        newClone.setAttribute("href", newLink);
        newClone.setAttribute("redirect-removed", "1");
        link[i].parentNode.replaceChild(newClone, link[i]);
      }
    }

    document.querySelectorAll("a:not([expanded-by-script])").forEach(showFullLink);
    document.querySelectorAll("div#below span.yt-core-attributed-string > span > span.yt-core-attributed-string--highlight-text-decorator:not([expanded-by-script]) > a[href*='/watch?']").forEach(showFullVideoName);
    document.querySelectorAll("div#below span.yt-core-attributed-string > span > span.yt-core-attributed-string--highlight-text-decorator:not([expanded-by-script]) > a[href*='/shorts/']").forEach(showFullVideoName);
    document.querySelectorAll("div#below span.yt-core-attributed-string > span > span.yt-core-attributed-string--highlight-text-decorator:not([expanded-by-script]) > a[href*='/playlist?']").forEach(showFullVideoName);
  }

  const rootNode = document.querySelector("body");
  if (rootNode != null) {
    const rootObserver = new MutationObserver(rootCallback);
    rootObserver.observe(rootNode, {childList: true, subtree: true, attributes: false, characterData: true});
  }

  function replaceRedirect(link) { //Remove redirection
    console.log('1 ' + link.href);
    var newLink = decodeURIComponent(link.href.replace (/^.*\?(.*&)q=([^&]+)(&.*)?$/, '$2'));
    /*const wrpLink = link.wrappedJSObject || link;
    if (wrpLink.data && wrpLink.data.urlEndpoint) {
      wrpLink.data.urlEndpoint.url = link.href;
    }*/
    link.setAttribute("href", newLink);
    showFullLink(link);
  }

  function showFullLink(link) { //Expand link to full length
    if (link.innerText.substring(0, 20) == link.href.substring(0, 20) && link.innerText.substring(link.innerText.length-3, link.innerText.length) === "...") {
      link.innerText = link.href;
      link.setAttribute("expanded-by-script", "true");
    } else link.setAttribute("expanded-by-script", "false");
  }

  function showFullVideoName(link) { //Expand short video name to full one, taken from previous text
    link.parentElement.setAttribute("expanded-by-script", "false");

    const rangeBefore = document.createRange(); //Create a range
    if (link.parentElement.parentElement.previousElementSibling == null) {
      rangeBefore.setStart(link.parentElement.parentElement.parentElement, 0); //from the start of the parent
    } else {
      rangeBefore.setStartAfter(link.parentElement.parentElement.previousElementSibling); //from the end of previous element
    }
    rangeBefore.setEndBefore(link.parentElement.parentElement); // till the target element
    var strFullName = rangeBefore.toString();
    strFullName = strFullName.replace(/.*[\n](?!$)/g, ""); //Remove all text except the last line
    strFullName = strFullName.replace(/\&/g, "&amp;"); //Replace & with its html-code

    if (strFullName.length > 0) {
      var strHTML = link.parentElement.parentElement.parentElement.outerHTML;
      strHTML = strHTML.replace(strFullName, ""); //Remove full video name from text
      strHTML = strHTML.replace(/yt-core-image--content-mode-scale-to-fill"><\/span>/gi, "yt-core-image--content-mode-scale-to-fill yt-core-image--loaded\" src=\"https://www.gstatic.com/youtube/img/watch/yt_favicon.png\"></span>"); //Add YT icon if missed
      link.parentElement.parentElement.parentElement.outerHTML = strHTML;

      strFullName = strFullName.replace(/[\n]/g, ""); //Remove \n
      strFullName = strFullName.replace(/\s+$/g, ""); //Remove trailing spaces
      strFullName = strFullName.replace(/:+$/g, ""); //Remove trailing semicolon
      strFullName = strFullName.replace(/-+$/g, ""); //Remove trailing dash
      strFullName = strFullName.replace(/:+$/g, ""); //Remove trailing semicolon
      strFullName = strFullName.replace(/\(+$/g, ""); //Remove trailing (
      strFullName = strFullName.replace(/\s+$/g, ""); //Remove trailing spaces
      strFullName = strFullName.replace(/^\s*/g, ""); //Remove leading spaces
      strFullName = strFullName.replace(/^\)/g, ""); //Remove leading )
      strFullName = strFullName.replace(/^\./g, ""); //Remove leading .
      strFullName = strFullName.replace(/^,/g, ""); //Remove leading ,
      strFullName = strFullName.replace(/^\s*/g, ""); //Remove leading spaces

      var newLink = document.querySelector("div#below span.yt-core-attributed-string > span > span.yt-core-attributed-string--highlight-text-decorator[expanded-by-script='false'] > a"); //New query, because previous setting of outerHTML rebuilded this node in DOM
      if (newLink != null) {
        newLink.parentElement.setAttribute("expanded-by-script", "true");
        var bgStyle = newLink.parentElement.getAttribute("style");
        newLink.parentElement.style = ""; //Remove background
        newLink.parentElement.firstElementChild.style = "margin: 1px 0px; " + bgStyle; //Add background

        var strHTML2 = newLink.parentElement.outerHTML;
        strHTML2 = strHTML2.replace(/<\/span>&nbsp;•&nbsp;.*&nbsp;&nbsp;<\/a><\/span>/gi, "<div class='yt-core-attributed-string__link yt-core-attributed-string__link--display-type yt-core-attributed-string__link--call-to-action-color'>&nbsp;•&nbsp;</div></span>" + strFullName + "&nbsp;&nbsp;</a></span>"); //Add full video name to link
        newLink.parentElement.outerHTML = strHTML2;
      }
    }
  }
})();
