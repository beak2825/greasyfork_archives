// ==UserScript==
// @name         Twitter/X - clickable links to images and show uncropped thumbnails
// @namespace    twitter_linkify
// @version      4.3
// @license      GNU AGPLv3
// @description  All image posts in Twitter/X Home, other blog streams and single post views link to the high-res "orig" version. Thumbnail images in the stream are modified to display uncropped.
// @author       marp
// @homepageURL  https://greasyfork.org/en/users/204542-marp
// @match        https://twitter.com/
// @match        https://twitter.com/*
// @match        https://pbs.twimg.com/media/*
// @exclude      https://twitter.com/settings
// @exclude      https://twitter.com/settings/*
// @match        https://x.com/
// @match        https://x.com/*
// @exclude      https://x.com/settings
// @exclude      https://x.com/settings/*
// @grant        GM_xmlhttpRequest
// @connect      pbs.twimg.com
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/376120/TwitterX%20-%20clickable%20links%20to%20images%20and%20show%20uncropped%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/376120/TwitterX%20-%20clickable%20links%20to%20images%20and%20show%20uncropped%20thumbnails.meta.js
// ==/UserScript==

// jshint esversion:8


function adjustSingleMargin(myNode) {
  // I SHOULD remove only margin-... values - but there never seems to be anything else - so go easy way and remove ALL style values
  var myStyle = myNode.getAttribute("style");
  if ( (myStyle !== null) && ( myStyle.includes("margin") || !(myStyle.includes("absolute")) ) ) {
    myNode.setAttribute("style", "position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px");
  }
}

function adjustSingleBackgroundSize(myNode) {
  var myStyle = myNode.getAttribute("style");
  if ( (myStyle !== null) && ( !(myStyle.includes("contain")) ) ) {
    myNode.style.backgroundSize = "contain";
  }
}


function createSingleImageLink(myDoc, myContext) {

	if (myContext.nodeType === Node.ELEMENT_NODE) {

    var singlematch;
    var singlelink;
    var observer;
    var config;
    singlematch=myDoc.evaluate("./ancestor-or-self::a[contains(@href,'/photo/') and ancestor::article]",
                         myContext, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    singlelink = singlematch.singleNodeValue;
    if (singlelink !== null) {

      // persistently remove "margin-..." styles (they "de-center" the images)
      singlematch=myDoc.evaluate(".//div[@aria-label='Image' or @data-testid='tweetPhoto']",
                           singlelink, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      var singlenode = singlematch.singleNodeValue;
      if (singlenode !== null) {
        adjustSingleMargin(singlenode);
        observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            adjustSingleMargin(mutation.target);
          });
        });
        config = { attributes: true, attributeFilter: [ "style" ], attributeOldValue: false, childList: false, characterData: false, subtree: false };
        observer.observe(singlenode, config);
      }

      // persistently change image zoom from "cover" to "contain" - this ensures that the full thumbnail is visible
      singlematch=myDoc.evaluate(".//div[contains(@style,'background-image')]",
                           singlelink, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      singlenode = singlematch.singleNodeValue;
      if (singlenode !== null) {
        adjustSingleBackgroundSize(singlenode)
        observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            adjustSingleBackgroundSize(mutation.target);
          });
        });
        config = { attributes: true, attributeFilter: [ "style" ], attributeOldValue: false, childList: false, characterData: false, subtree: false };
        observer.observe(singlenode, config);
      }

      // change the link to point to the "orig" version of the image directly 
      singlematch=myDoc.evaluate(".//img[contains(@src,'https://pbs.twimg.com/media/') and contains(@src,'name=')]",
                           singlelink, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      var imagenode = singlematch.singleNodeValue;
      if (imagenode !== null) {
        var imgurl = new URL(imagenode.getAttribute("src"));
        var params = new URLSearchParams(imgurl.search.substring(1));
        if (!(params.has("format", "webp"))) {
          // WebP links require special treatment as the original image file might be of different format (Twitter/X network traffic optimization, it seems).
          // WebP image url are left unchanged and are then "post-processed" by another part of this script, which triggers on the image file itself (see code towards end of script)
          // The idea is to open a working webp image link which the scedonf scfipt part can then post-process.
          // A "name=orig" url can lead to a 404 error, which cannot be post-processed in Chromium browsers.
          params.set("name", "orig");
        }
        imgurl.search = "?" + params.toString();
        singlematch=myDoc.evaluate("./ancestor-or-self::a[contains(@href,'/photo/')]",
                           imagenode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        singlenode = singlematch.singleNodeValue;
        if (singlenode !== null) {
          singlenode.href = imgurl.href;
        }
      }

    }
  }
}


function processImages(myDoc, myContext) {

//console.info("processImages-0 ", myContext);

  if (myContext.nodeType === Node.ELEMENT_NODE) {

    var singlematch=myDoc.evaluate("./ancestor-or-self::a[contains(@href,'/photo/')]",
                         myContext, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    var singlenode=singlematch.singleNodeValue;
    if (singlenode !== null) {

      createSingleImageLink(myDoc, singlenode); // applies if the added node is descendant or equal to a single image link 

    } else {

      // this assumes that the added node CONTAINS image link(s), i.e. is an ancestor of image(s)
      var matches=myDoc.evaluate("./descendant-or-self::a[contains(@href,'/photo/')]",
                           myContext, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      for(var i=0, el; (i<matches.snapshotLength); i++) {
        el=matches.snapshotItem(i);
				createSingleImageLink(myDoc, el);
      }

    }
  }
}


var blurStyles = null; // some styles are added on-demand, but once we get the style for the image blurring, we stop updating the list and use this cache for performance reasons
var blurStylesStop = false;
function processBlurring(myDoc, myContext) {

  if (myContext.nodeType === Node.ELEMENT_NODE) {

    if (!blurStylesStop) {
      // Find all CSS that implement blurring - example match: ".r-yfv4eo { filter: blur(30px); }"
      // Keep the style names of these matches in an array
      // NOTE: This code assumes that all these CSS have selectors without element types, i.e. ".r-yfv4eo" instead of "div.r-yfv4eo"
      blurStyles = Array.from(myDoc.styleSheets).filter(ss => { try { return ss.cssRules.length > 0; } catch (e) { return false; } } ).flatMap(ss => Array.from(ss.cssRules).filter(css => css instanceof CSSStyleRule && css.cssText.indexOf('blur(')>=0)).map(css => css.selectorText.substring(1));
    }

    var matches;
    var pos;
    for (const bs of blurStyles) {
      matches = myDoc.evaluate("./descendant-or-self::div[contains(@class, '"+bs+"')]", myContext, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      for(var i=0, el; (i<matches.snapshotLength); i++) {
        el=matches.snapshotItem(i);
        el.className = el.className.replace(bs, ''); //remove the blurring
        // remove the overlay with the info text and button to show/ide (assumption: it is always the next sibling element)
        if (el.nextSibling !== null) {
          el.nextSibling.remove(); 
          blurStylesStop = true; // found and used the correct blurring style - stop searching and rebuilding the style list (performance)
        }
      }

    }
  }
}



function observeArticles(myDoc, myContext) {

  if (myContext.nodeType === Node.ELEMENT_NODE) {

    var singlematch;
    var matches;
    matches=myDoc.evaluate("./descendant-or-self::article[./ancestor::section/ancestor::div[@data-testid='primaryColumn']/ancestor::main]",
                               myContext, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for(var i=0, el; (i<matches.snapshotLength); i++) {
      el=matches.snapshotItem(i);

      processImages(myDoc, el);
      processBlurring(myDoc, el);

      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(addedNode) {
            processImages(mutation.target.ownerDocument, addedNode);
            processBlurring(mutation.target.ownerDocument, addedNode);
          });
        });
      });
      var config = { attributes: false, childList: true, characterData: false, subtree: true };
      observer.observe(el, config);
    }
  }
}


function insertLinkElement(myDoc, wrapElement, linkTarget, downloadName) {
	var newnode;
  var parentnode;

  newnode = myDoc.createElement("a");
  newnode.setAttribute("href", linkTarget);
  newnode.setAttribute("target", "_blank");
  newnode.setAttribute("download", downloadName);
  parentnode = wrapElement.parentNode;
  parentnode.replaceChild(newnode, wrapElement);
  newnode.appendChild(wrapElement);
}


function getCleanImageURL(imageurl) {
  var pos = imageurl.toLowerCase().lastIndexOf(":");
  var pos2 = imageurl.toLowerCase().indexOf("/");
  if (pos >= 0 && pos > pos2) {
    return imageurl.substring(0, pos);
  } else {
    return imageurl;
  }
}


function getFilename(imageurl) {
  return getCleanImageURL(imageurl).substring(imageurl.toLowerCase().lastIndexOf("/")+1);
}


// This ASYNC method returns a promise to retrieve the HTTP response header data for the supplied URL.
// It uses an "HTTP HEAD" request which does NOT download the response payload (to minimize network traffic)
async function checkUrlHeaderOnlyPromise(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'HEAD',
      url: url,
      onload: function(response) {
        if ((response.readyState >= 2) && (response.status == 200)) {
          resolve( { url: response.finalUrl, origurl: url} );
        } else {
          reject( { url: url, origurl: url } );
        }
      },
      ontimeout: function(response) {
        reject( { url: url, origurl: url } );
      },
      onerror: function(response) {
        reject( { url: url, origurl: url } );
      }
    });
  });
}



// Helper function for part ofd script that executed on direct image links
function findOrigUrl(mycheckurl, ischeckwebp, mydocument) {
  var checkURL = new URL(mycheckurl);
  var checkPromises1 = new Array( (ischeckwebp ? 3 : 2) );

  checkURL.searchParams.set("format", "jpg");
  checkPromises1[0] = checkUrlHeaderOnlyPromise(checkURL.href);
  checkURL.searchParams.set("format", "png");
  checkPromises1[1] = checkUrlHeaderOnlyPromise(checkURL.href);
  if (ischeckwebp) {
    checkURL.searchParams.set("format", "webp");
    checkPromises1[2] = checkUrlHeaderOnlyPromise(checkURL.href);
  }
  // wait until at least one URL has successfully resolved (i.e. HTTP headers loaded without error)
  Promise.any(checkPromises1).then(
    // SUCCESS -> DONE, navigate to the working url
    (result1) => { mydocument.location.href = result1.url; },
    // FAILURE -> try the remaining, more exotic image formats (list of all formats determined by file types supported in "Open File" dialog when uploading an image to Twitter/X
    () => {
      var checkPromises2 = new Array(4);
      checkURL.searchParams.set("format", "jpeg");
      checkPromises2[0] = checkUrlHeaderOnlyPromise(checkURL.href);
      checkURL.searchParams.set("format", "jfif");
      checkPromises2[1] = checkUrlHeaderOnlyPromise(checkURL.href);
      checkURL.searchParams.set("format", "pjpeg");
      checkPromises2[2] = checkUrlHeaderOnlyPromise(checkURL.href);
      checkURL.searchParams.set("format", "pjp");
      checkPromises2[3] = checkUrlHeaderOnlyPromise(checkURL.href);
      // wait until at least one URL has successfully resolved (i.e. HTTP headers loaded without error)
      Promise.any(checkPromises2).then(
        // SUCCESS -> DONE, navigate to the working url
        (result2) => { mydocument.location.href = result2.url; },
        // FAILURE -> found no working alternative image url -> do nothing, stay on current url.
        () => { /* do nothing */ }
      );
    }
  );
}


// TWO very different actions depending on if this is on twitter.com/x.com or twimg.com
// == 1: twing.com -> deal with direct image URLs
if (window.location.href.includes('pbs.twimg.com/media')){

 var params = new URLSearchParams(document.location.search.substring(1));

  if (params.has("name")) {

    if ( !(params.has("name", "orig")) ) {

      if (params.has("format", "webp")) {
        // IMAGE URL being loaded is WebP -> orig image might be of different format -> test various formats and navigate if match found (asynch)
        var checkURL = new URL(document.location.href);
        checkURL.searchParams.set("name", "orig");
        findOrigUrl(checkURL.href, true, document);
      } else {
        // IMAGE URL being loaded is not WebP -> modify image URL to go to "orig" destination
        params.set("name", "orig");
        document.location.search = "?" + params.toString();
      }
    }
  }

}
else
{

  // == 2: twitter.com/x.com -> modify Twitter/X pages
  var reactrootmatch = document.evaluate("//div[@id='react-root']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  var reactrootnode = reactrootmatch.singleNodeValue;

  if (reactrootnode !== null) {
      // create an observer instance and iterate through each individual new node
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(addedNode) {
            observeArticles(mutation.target.ownerDocument, addedNode);
          });
        });
      });

      // configuration of the observer
      var config = { attributes: false, childList: true, characterData: false, subtree: true };

      //process already loaded nodes (the initial posts before scrolling down for the first time)
      observeArticles(document, reactrootnode);

      //start the observer for new nodes
      observer.observe(reactrootnode, config);
  }
}
