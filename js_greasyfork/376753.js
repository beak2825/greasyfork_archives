// ==UserScript==
// @name         BDSMLR - clickable links to original high-res images and display timestamps
// @namespace    bdsmlr_linkify
// @version      4.3.0
// @license      GNU AGPLv3
// @description  This script modifies image posts to link directly to their high-resolution version. The link is available as soon as a box appears around an image. The color of the box indicates the image height. Secondly, the script displays the post timestamp in the upper-right corner.
// @author       marp
// @homepageURL  https://greasyfork.org/en/users/204542-marp
// @match        https://bdsmlr.com/
// @match        https://bdsmlr.com/dashboard*
// @match        https://*.bdsmlr.com/
// @match        https://*.bdsmlr.com/post/*
// @match        https://bdsmlr.com/search/*
// @match        https://*.bdsmlr.com/search/*
// @match        https://bdsmlr.com/blog/*
// @match        https://bdsmlr.com/originalblogposts/*
// @match        https://bdsmlr.com/likes*
// @grant        GM_xmlhttpRequest
// @connect      bdsmlr.com
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/376753/BDSMLR%20-%20clickable%20links%20to%20original%20high-res%20images%20and%20display%20timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/376753/BDSMLR%20-%20clickable%20links%20to%20original%20high-res%20images%20and%20display%20timestamps.meta.js
// ==/UserScript==

// jshint esversion:8


//console.info("START href: ", window.location.href);



//------------------------------------------------------------
// FIRST PART OF SCRIPT #2 - function that gets called by event oberver that is registered as part of 1st part #1 (see very end of this script)
//------------------------------------------------------------

function createImageLinks(myDoc, myContext) {

// console.info("createImageLinks: ", myContext);

  if (myDoc===null) myDoc = myContext;
  if (myDoc===null) return;
  if (myContext===null) myContext = myDoc;

  var tmpstr;
  var singlematch;
  var matches, matches2;
  var imageurl;
  var imagesrc;
  var imagesrcfixed;
  var cdnmatches;
  var cdnnumber;

  // iterate over all posts within the supplied context
  matches = myDoc.evaluate("./descendant-or-self::div[contains(@class,'postholder')]"
                           + " | " +
                           "./descendant-or-self::div[contains(@class,'post_content')]"
                           + " | " +
                           "./descendant-or-self::div[contains(@class,'commenttext')]"
                           , myContext, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for(var i=0, el; (i<matches.snapshotLength); i++) {
    el = matches.snapshotItem(i);
    if (el) {
      try {
		// iterate over all images
        // skip over items that already have a link to a "non-cdn" bdsmlr url or that are not bdsmlr links at all
        matches2 = myDoc.evaluate(".//div[contains(@class,'image_container') or contains(@class,'image_content')]" +
                                    "//*[(self::a or self::div) and (@href='') or ((contains(@class,'magnify') or contains(@class,'image-link')) and (contains(@href,'https://cdn') or contains(@href,'https://ocdn')) and contains(@href,'.bdsmlr.com'))]/img" +
                                  " | " +
                                  ".//div[contains(@class,'image_container') or contains(@class,'image_content')]//div[contains(@class,'textcontent')]" +
                                    "//img[(contains(@src,'https://cdn') or contains(@src,'https://ocdn')) and contains(@src,'.bdsmlr.com')]" +
                                  " | " +
                                  "./descendant-or-self::div[contains(@class,'singlecomment') or contains(@class,'commenttext')]" +
                                    "//img[(contains(@src,'https://cdn') or contains(@src,'https://ocdn')) and contains(@src,'.bdsmlr.com') and (contains(@class,'fr-dib') or contains(@class,'fr-fic'))]"
                                  ,
                                  el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for(var j=0, image, imageparent; (j<matches2.snapshotLength); j++) {
          image=matches2.snapshotItem(j);
          if (image) {
            imagesrc = image.src;
            imageparent = image.parentNode;
            imageurl = imageparent.getAttribute("href");
            if (imageurl === null || imageurl.length < 5) {
              imageurl = image.getAttribute("src");
              // No idea why this is needed... DevTools inspector always shows a valid image src attribute... but at script execution time... apparently not... seems to be some bdsmlr JavaScript post-processing...
              if (imageurl === null || imageurl.length < 5) {
                imageurl = image.getAttribute("data-echo");
              }
            }
            // CDNO08 seem to have been broken during the botched infrastructure upgrade in early 2021
            // (after which the ownership of bdsmlr seems to have changed - and the new team doesn't know all the history and thus issues)
            // CDNO08 now redirects to CDN12 - but the image is to be found on CDN08, instead?!
            // Also, some URLs are HTTP - which do not seem to work (error as if image does not exist) - but HTTPS does work
            // 2021-11-01: Same goes from cdno12 -> cdn12 (instead of only cdno08 -> cdn08)
            // CAREFUL: This observation is just based on a few purly-by-chance discoveries - no idea if there are other locations besides CDN012/CDN08
            // 2022-10-23: All old cdn server seem to have been decommissioned and now redirect to cdn012|cdn013|cdn101 - and there's sopme weird code that points towards ocdn012|ocdn013|ocdn101 - but that seems to do nothing
            //             With the decommissioning, mayn old images seems to have been lost for good, now :-(
            //             Thus, for now, I'm turning off the redirections below - except the http->https one
            // 2023-06-15: CDN012 seems to be partially broken - but ocdn012 works as an alternative for the broken urls. But not for all urls in general -> need to test if src url is broken instead of generic replace.
            imagesrcfixed = null;
            if (imagesrc.toLowerCase().startsWith("http://")) {
              imagesrcfixed = "https://" + imagesrc.substring(7);
            } else {
              imagesrcfixed = imagesrc;
            }
            if (imagesrcfixed.toLowerCase().startsWith("https://cdno08.bdsmlr.com/")) {
              imagesrcfixed = "https://cdn08.bdsmlr.com/" + imagesrcfixed.substring(26);
            }
            if (imagesrcfixed.toLowerCase().startsWith("https://cdno12.bdsmlr.com/")) {
              imagesrcfixed = "https://cdn12.bdsmlr.com/" + imagesrcfixed.substring(26);
            }
/*            if (imagesrcfixed.toLowerCase().startsWith("https://cdno012.bdsmlr.com/")) {
              imagesrcfixed = "https://cdn012.bdsmlr.com/" + imagesrcfixed.substring(27);
            } */
            if (imagesrcfixed.toLowerCase().startsWith("https://cdno06.bdsmlr.com/")) {
              imagesrcfixed = "https://cdn101.bdsmlr.com/" + imagesrcfixed.substring(26);
            }
            if (imagesrcfixed.toLowerCase().startsWith("https://cdno010.bdsmlr.com/")) {
              imagesrcfixed = "https://cdn101.bdsmlr.com/" + imagesrcfixed.substring(27);
            }
            if (imagesrcfixed.toLowerCase().startsWith("https://cdno05.bdsmlr.com/")) {
              imagesrcfixed = "https://cdn101.bdsmlr.com/" + imagesrcfixed.substring(26);
            } 
            if (imagesrcfixed !== imagesrc) {
              image.setAttribute("src", imagesrcfixed);
              imagesrc = image.src;
            }

            if (imageurl && imageurl.length > 5) {
              getBestImageUrlPromise(imagesrc, imageurl, image)
                .then( (result) => {
                	if ( (result !== null) && (result.image !== null) && (result.url !== null) ) {
                    var linkelem;
                    var divelem;
                    // 2023-06-15: deal with the partially broken SRC urls - if broken -> use the determine full link as image src url, as well
                    checkUrlHeaderOnlyPromise(result.image.src).then( {/* image src url is working - nothing to do */} ,
                                                                      // but if it fails, use the just determined image url, instead
                                                                      (srcresult) => { result.image.setAttribute("src", result.url); });
                    // Sometimes, images in comments are weirdly structured in hierarchies with paragraph elements -> it's better to create the link as direct parent of the image itself
                    // same goes for the element that the colored border box can be added to - there is no appropriate div element - so we use the image itself
                    if ( (result.image.parentNode.nodeName.toLowerCase() == "p") ||
                         ((result.image.previousSibling !== null) && (result.image.previousSibling.nodeName.toLowerCase() == "p")) ||
                         ((result.image.nextSibling !== null) && (result.image.nextSibling.nodeName.toLowerCase() == "p")) ) {
                      linkelem = insertOrChangeLinkElement(result.image.ownerDocument, result.image, result.url);
                      divelem = result.image;
                    } else {
                      linkelem = insertOrChangeLinkElement(result.image.ownerDocument, result.image.parentNode, result.url);
                      var divmatch = result.image.ownerDocument.evaluate("./ancestor::div[(contains(@class,'hide') or contains(@class,'earlycomments')) and ancestor::div[contains(@class,'post')]]",
                                                                         linkelem, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                      divelem = divmatch.singleNodeValue;
                    }

                    divelem.style = "border: 5px solid grey;";
                    divelem.setAttribute("title", getSizeText(result.size));

                    getImageDimensionsPromise(result.url, divelem, result.size)
                      .then( (result2) => {
                        result2.element.style = "border: 5px solid " + result2.color + ";";
                        result2.element.setAttribute("title", getSizeText(result2.size) + " - " + result2.width + " x " + result2.height); 
                    });
                  }
              });
            }
          }
        }


        // multi-image posts - unhide all images (instead of having to manually click on "show x more images"
        matches2 = myDoc.evaluate(".//div[contains(@class,'image_container') or contains(@class,'image_content')]" + 
                                    "/div[contains(@style,'display:none')]",
                                 el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for(var j=0, node; (j<matches2.snapshotLength); j++) {
          node=matches2.snapshotItem(j);
          if (node) {
            node.style.display = "initial";
          }
        }
        // multi-image posts - hide the "show x more images" element
        matches2 = myDoc.evaluate(".//div[contains(@class,'image_container') or contains(@class,'image_content')]" + 
                                    "/following-sibling::div[contains(@class,'viewAll')]",
                                 el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for(var j=0, node; (j<matches2.snapshotLength); j++) {
          node=matches2.snapshotItem(j);
          if (node) {
            node.style.display = "none";
          }
        }


      } catch (e) { console.warn("error: ", e); }
    }
	}

}



// try to find the timestamp info and display in upper right corner
function displayTimestamps(myDoc, myContext) {

//console.info("displayTimestamps: ", myContext);

  if (myDoc===null) myDoc = myContext;
  if (myDoc===null) return;
  if (myContext===null) myContext = myDoc;

  var matches;
  var tmpstr;
  var singlematch;
  var postinfo;
  var timestamp;
  var newnode;

  matches = myDoc.evaluate("./descendant-or-self::div[contains(@class,'feed') and @title]",
                           myContext, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for(var i=0, el; (i<matches.snapshotLength); i++) {
    el = matches.snapshotItem(i);
    if (el) {
      try {

        timestamp = el.getAttribute("title");
				if (timestamp && timestamp.length>5 && timestamp.length<70) {

          singlematch = myDoc.evaluate(".//div[contains(@class,'post_info') and not(descendant::div[@addedbyuserscript])]",
                                       el, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          postinfo = singlematch.singleNodeValue; 
          if (postinfo) {

            newnode = myDoc.createElement("div");
            newnode.setAttribute("style", "float:right; margin-right: 10px; padding-right: 10px;");
            newnode.setAttribute("addedbyuserscript", "1");
            newnode.innerHTML = timestamp;
            postinfo.appendChild(newnode);
          }
        }

      } catch (e) { console.warn("error: ", e); }
    }
  }
}



function isOriginalImageURL(imageurl) {
  if (imageurl === undefined || imageurl === null) {
    return false;
  }
  var tmpstr = imageurl.toLowerCase();
  if (tmpstr.includes("bdsmlr.com/")) {
    var pos = tmpstr.lastIndexOf(".");
    var pos2 = tmpstr.lastIndexOf("-og.");
    if (pos > 0 && (pos2+3)==pos) {
      return true;
    }
  }
  return false;
}


function getOriginalImageURL(imageurl) {
  if (imageurl === null) {
    return imageurl;
  }
  var pos = imageurl.lastIndexOf(".");
  var pos2 = imageurl.lastIndexOf("-og.");
  if (pos > 0 && (pos2+3)!=pos) {
    return imageurl.substring(0, pos) + "-og" + imageurl.substring(pos);
  } else {
    return imageurl;
  }
}


function insertOrChangeLinkElement(myDoc, wrapElement, linkTarget) {
  if (wrapElement.nodeName.toLowerCase() == "a") {
    wrapElement.setAttribute("href", linkTarget);
    wrapElement.setAttribute("target", "_blank");
    return wrapElement;
  } else {
    var parentNode = wrapElement.parentNode;
    var newNode = myDoc.createElement("a");
    newNode.setAttribute("href", linkTarget);
    newNode.setAttribute("target", "_blank");
    parentNode.replaceChild(newNode, wrapElement);
    newNode.appendChild(wrapElement);
    return newNode;
  }
}


function getSizeText(sizeInBytes) {
  if (sizeInBytes === null) {
    return "";
  }
  if (sizeInBytes >= 1048576) {
    return (sizeInBytes / 1048576).toFixed(1) + " MB";
  }
  else if (sizeInBytes >= 1024) {
    return (sizeInBytes / 1024).toFixed(0) + " KB";
  }
  else {
    return sizeInBytes.toFixed(0) + " B";
  }
}


// This ASYNC method returns a promise to retrieve the HTTP response header data for the supplied URL.
// It uses an "HTTP HEAD" request which does NOT download the response payload (to minimize network traffic)
async function checkUrlHeaderOnlyPromise(url) {
// console.info("checkUrlHeaderOnlyPromise-Enter: ", url);
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'HEAD',
      url: url,
      headers: {
        "Referer": "https://bdsmlr.com/"
      },
      cookiePartition: {
        topLevelSite: 'https://bdsmlr.com'
      },
      onload: function(response) {
//console.info("checkUrlHeaderOnlyPromise-load-response: ", response);
        if ((response.readyState >= 2) && (response.status == 200)) {
          var contentLength = -1;
          var conlenstr = response.responseHeaders.split("\r\n").find(str => str.toLowerCase().startsWith("content-length:"));
          if (conlenstr !== undefined) {
            contentLength = parseInt(conlenstr.slice(15).trim(), 10);
            if (isNaN(contentLength)) {
                contentLength = -1;
            }
          }
          resolve( { url: response.finalUrl, size: contentLength, origurl: url} );
        } else {
          reject( { url: url, size: -1, origurl: url} );
        }
      },
      ontimeout: function(response) {
// console.info("checkUrlHeaderOnlyPromise-timeout: ", url);
        reject( { url: url, size: -1, origurl: url} );
      },
      onerror: function(response) {
// console.info("checkUrlHeaderOnlyPromise-error: ", url);
        reject( { url: url, size: -1, origurl: url} );
      }
    });
  });
}


// This ASYNC method returns a promise to determine the url of the originally uploaded image (the one with a suffix of "-og" in the name)
// This requires "testing" a lot of URLs, i.e. it causes server traffic (especially if it is an image on the "old" CDN servers from BDSMLR's early times).
// To minimize network traffic, this method only requests the HTTP headers for all these URLs - the image itself nor error webpages (404) are not fully downloaded.
// If multiple "-og" variants are found, the one with the largest size (in bytes, not image dimensions!) is chosen.
// If the og version is smaller than the non-og version it still sticks with the og, if it is larger than 5kb (5kb to exclude error pages, the non-og is typically upscaled and worse quality than the og)
// "imageelement" is only passed-through - it is a helper to supply the DOM context to the surrounding asynchronous promise "then" function of the caller
// IMPORTANT DISCOVERY: For some(!) image servers, the path part (the part after hostname) is CASE-SENSITIVE! Urgh!!
async function getBestImageUrlPromise(imageurl, linkurl, imageelement) {
  var urlsToCheckPromises = [];
  var uniqueset = new Set(); // Use a Set to collect all URLs that are to be tested - this automatically eliminates dups that the URL selection logic below might create
  var matches;
  var imageurl_cdnnum;
  var linkurl_cdnnum;
  var imageurl_cdnnumstr;
  var linkurl_cdnnumstr;
  var imageurl_path;
  var linkurl_path;
  var bestImageUrl;
  var bestImageSize;
  var bestImageIsOG;

//console.info("getBestImageUrlPromise-Enter: ", "imageurl:" + imageurl + "   linkurl:" + linkurl);

  // get CDN image server number as int and as string
  matches = imageurl.toLowerCase().match(/https?:\/\/o?cdno?(0?[1-9][0-9]*)\.bdsmlr\.com\//i);
  if (matches !== null && matches.length > 0) {
    imageurl_cdnnumstr = matches[1];
    imageurl_cdnnum = parseInt(matches[1], 10);
  } else {
    imageurl_cdnnum = NaN;
  }
  // get CDNO image server number as int and as string
  matches = linkurl.toLowerCase().match(/https?:\/\/o?cdno?(0?[1-9][0-9]*)\.bdsmlr\.com\//i);
  if (matches !== null && matches.length > 0) {
    linkurl_cdnnumstr = matches[1];
    linkurl_cdnnum = parseInt(matches[1], 10);
  } else {
    linkurl_cdnnum = NaN;
  }

  // get non-hostname part of the url, including leading "/" (NOTE: this regex fixes buggy urls with multiple "//" after the hostname)
  matches = imageurl.match(/https?:\/\/[^.]*\.?bdsmlr\.com\/*(\/.+$)/i);
  if (matches !== null && matches.length > 0) {
    imageurl_path = matches[1];
  } else {
    imageurl_path = null;
  }
  // get non-hostname part of the url, including leading "/" (NOTE: this regex fixes buggy urls with multiple "//" after the hostname)
  matches = linkurl.match(/https?:\/\/[^.]*\.?bdsmlr\.com\/*(\/.+$)/i);
  if (matches !== null && matches.length > 0) {
    linkurl_path = matches[1];
  } else {
    linkurl_path = null;
  }

  // fetch promise for the image that is currently shown in the webpage (ALLOW redirection on this URL)
  uniqueset.add(imageurl);

  // image to which the current unmodified link in the webpage is pointing to (ALLOW redirection on this URL)
  uniqueset.add(linkurl);

    // append "-og" suffix to the original image and link urls (without modifying the hostname)
  if (!isNaN(imageurl_cdnnum) && (imageurl_cdnnum != 12)) {
    uniqueset.add(getOriginalImageURL(imageurl));
  }
  if (!isNaN(linkurl_cdnnum) && (linkurl_cdnnum != 12)) {
    uniqueset.add(getOriginalImageURL(linkurl));
  }

  if (!isNaN(imageurl_cdnnum) && (imageurl_cdnnum <= 13 || imageurl_cdnnum == 101) && (imageurl_cdnnum != 12)) {
    uniqueset.add(getOriginalImageURL("https://cdn" + imageurl_cdnnumstr + ".bdsmlr.com" + imageurl_path));
    uniqueset.add(getOriginalImageURL("https://cdno" + imageurl_cdnnumstr + ".bdsmlr.com" + imageurl_path));
    uniqueset.add(getOriginalImageURL("https://ocdn" + imageurl_cdnnumstr + ".bdsmlr.com" + imageurl_path));
    uniqueset.add("https://cdno" + imageurl_cdnnumstr + ".bdsmlr.com" + imageurl_path);
    uniqueset.add("https://cdn" + imageurl_cdnnumstr + ".bdsmlr.com" + imageurl_path);
    uniqueset.add("https://ocdn" + imageurl_cdnnumstr + ".bdsmlr.com" + imageurl_path);
    if (!imageurl_cdnnumstr.startsWith("0")) {
      uniqueset.add(getOriginalImageURL("https://cdn0" + imageurl_cdnnumstr + ".bdsmlr.com" + imageurl_path));
      uniqueset.add(getOriginalImageURL("https://cdno0" + imageurl_cdnnumstr + ".bdsmlr.com" + imageurl_path));
      uniqueset.add(getOriginalImageURL("https://ocdn0" + imageurl_cdnnumstr + ".bdsmlr.com" + imageurl_path));
      uniqueset.add("https://cdn0" + imageurl_cdnnumstr + ".bdsmlr.com" + imageurl_path);
      uniqueset.add("https://cdno0" + imageurl_cdnnumstr + ".bdsmlr.com" + imageurl_path);
      uniqueset.add("https://ocdn0" + imageurl_cdnnumstr + ".bdsmlr.com" + imageurl_path);
    }
    uniqueset.add(getOriginalImageURL("https://cdn012.bdsmlr.com" + imageurl_path));
    uniqueset.add(getOriginalImageURL("https://cdno012.bdsmlr.com" + imageurl_path));
    uniqueset.add(getOriginalImageURL("https://ocdn012.bdsmlr.com" + imageurl_path));
    uniqueset.add(getOriginalImageURL("https://cdn013.bdsmlr.com" + imageurl_path));
    uniqueset.add(getOriginalImageURL("https://cdno013.bdsmlr.com" + imageurl_path));
    uniqueset.add(getOriginalImageURL("https://cdn101.bdsmlr.com" + imageurl_path));
    uniqueset.add(getOriginalImageURL("https://cdno101.bdsmlr.com" + imageurl_path));
  }

  if (!isNaN(linkurl_cdnnum) && (linkurl_cdnnum <= 13 || linkurl_cdnnum == 101) && (linkurl_cdnnum != 12)) {
    uniqueset.add(getOriginalImageURL("https://cdn" + linkurl_cdnnumstr + ".bdsmlr.com" + linkurl_path));
    uniqueset.add(getOriginalImageURL("https://cdno" + linkurl_cdnnumstr + ".bdsmlr.com" + linkurl_path));
    uniqueset.add(getOriginalImageURL("https://ocdn" + linkurl_cdnnumstr + ".bdsmlr.com" + linkurl_path));
    uniqueset.add("https://cdn" + linkurl_cdnnumstr + ".bdsmlr.com" + linkurl_path);
    uniqueset.add("https://cdno" + linkurl_cdnnumstr + ".bdsmlr.com" + linkurl_path);
    uniqueset.add("https://ocdn" + linkurl_cdnnumstr + ".bdsmlr.com" + linkurl_path);
    if (!linkurl_cdnnumstr.startsWith("0")) {
    uniqueset.add(getOriginalImageURL("https://cdn0" + linkurl_cdnnumstr + ".bdsmlr.com" + linkurl_path));
    uniqueset.add(getOriginalImageURL("https://cdno0" + linkurl_cdnnumstr + ".bdsmlr.com" + linkurl_path));
    uniqueset.add(getOriginalImageURL("https://ocdn0" + linkurl_cdnnumstr + ".bdsmlr.com" + linkurl_path));
    uniqueset.add("https://cdn0" + linkurl_cdnnumstr + ".bdsmlr.com" + linkurl_path);
    uniqueset.add("https://cdno0" + linkurl_cdnnumstr + ".bdsmlr.com" + linkurl_path);
    uniqueset.add("https://ocdn0" + linkurl_cdnnumstr + ".bdsmlr.com" + linkurl_path);
    }
    uniqueset.add(getOriginalImageURL("https://cdn012.bdsmlr.com" + linkurl_path));
    uniqueset.add(getOriginalImageURL("https://cdno012.bdsmlr.com" + linkurl_path));
    uniqueset.add(getOriginalImageURL("https://ocdn012.bdsmlr.com" + imageurl_path));
    uniqueset.add(getOriginalImageURL("https://cdn013.bdsmlr.com" + linkurl_path));
    uniqueset.add(getOriginalImageURL("https://cdno013.bdsmlr.com" + linkurl_path));
    uniqueset.add(getOriginalImageURL("https://cdn101.bdsmlr.com" + linkurl_path));
    uniqueset.add(getOriginalImageURL("https://cdno101.bdsmlr.com" + linkurl_path));
  }

  for (var str of uniqueset) {
    urlsToCheckPromises.push(checkUrlHeaderOnlyPromise(str));
  }

  bestImageUrl = null;
  bestImageSize = -1;
  bestImageIsOG = false;

  await Promise.allSettled(urlsToCheckPromises).
    then( (results) => results.forEach((result) => {
      // If this result is a better image than currently known - replace and use this one as next best known image
      if (result.status == "fulfilled") {
        if ( (isOriginalImageURL(result.value.url) && !bestImageIsOG && (result.value.size > 5120)) ||
             ( (result.value.size > bestImageSize) && (result.value.size > 5120) && (isOriginalImageURL(result.value.url) == bestImageIsOG) ) ) {
          bestImageSize = result.value.size;
          bestImageUrl = result.value.url;
          bestImageIsOG = isOriginalImageURL(bestImageUrl);
        }
      }
    }));

  return {url: bestImageUrl, size: bestImageSize, isOG: bestImageIsOG, image: imageelement};
}


// This ASYNC method gets the natural dimensions of the supplied image
// This means the image needs to be downloaded fully, unfortunately!
// Thus, a delay is to be expected, except if the image is already cached
// Depending on the image height, the method suggests a "markup color" and then discards the downloaded image again (but does not invalidate cache).
// "imageelement" is only passed-through - it is a helper to supply the DOM context to the surrounding asynchronous promise then function of the caller
async function getImageDimensionsPromise(imageurl, divelement, imagesize) {
  var image;
  var imageH;
  var imageW;
  var color;

  // sanity check - skip full download of image if it is larger than 20MB
  if ( (imagesize !== null) && (imagesize > 20971520) ) {
    return {url: imageurl, element: divelement, width: "unknown", height: "unknown", color: "Grey", size:imagesize}; 
  }

  image = new Image();
  image.src = imageurl;

  await image.decode().then(function() {
    imageH = image.naturalHeight;
    imageW = image.naturalWidth;
  });

  image.src = "data:,"; // clear the image now that we no longer need it

  if (imageH >= 2160) {
    color = "hsl(160, 100%, 70%)";
  } else if (imageH >= 1080) {
    color = "hsl(" + (120.0 + 40.0 * ((imageH - 1080.0) / 1080.0)) + ", 100%, " + (50.0 + 20.0 * ((imageH - 1080.0) / 1080.0)) + "%)";
//    color = "Lime"; // #00FF00, HSL(120°, 100%, 50%)
  } else if (imageH >=270 ) {
    color = "hsl(" + (120.0 * ((imageH - 270.0) / 810.0)) + ", 100%, 50%)";
//    color = "Red"; // #FF0000, HSL(0°, 100%, 50%)
  } else if (imageH < 270 && imageH > 0 ) {
    color = "hsl(0, 100%, " + (50.0 * (imageH / 270.0)) + "%)";
//    color = "Red"; // #FF0000, HSL(0°, 100%, 50%)
  } else {
    color = "Grey";
  }

  return {url: imageurl, element: divelement, width: imageW, height: imageH, color: color, size:imagesize}; 
}



//------------------------------------------------------------
// FIRST PART OF SCRIPT #1 - initial statement and registration of event observer
//------------------------------------------------------------
// script runs NOT in the context of an image - i.e. dashboard, blog stream, individual post
// -> register event observer for future to-be-loaded posts (endless scrolling) and execute first part of script (createImageLinks & displayTimestamps) on already loaded posts

  // undo badly coded attempts from bdsmlr to hide unwanted posts mentioning reblog.me
  //   -> their code breaks infinite scrolling and incorrectly hides legitimate posts
  // this requires that this script is set to: @run-at document-start
  var scriptnode = document.createElement("script");
  scriptnode.setAttribute("type", "text/javascript");
  scriptnode.textContent = "let byespam = function () {} ";
  document.head.insertBefore(scriptnode, document.head.firstChild);

//console.info("scriptNodes INIT");

  // with @run-at document-start, only the HEAD section will have been loaded
  // -> register an observer to act as latter body nodes are being loaded
  // -> namely, we wait for the embedded <script> node that handles endless scrolling...
  // -> ...to modify it as to trigger much sooner so that the scrolling experience is smoother (trigger and complete loading BEFORE reaching the end of page)
  var scriptobserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(addedNode) {
        if (addedNode.nodeName == "SCRIPT" && addedNode.textContent.includes("$(document).height() - $(window).height())")) {
          addedNode.textContent = addedNode.textContent.replaceAll("$(document).height() - $(window).height())", "$(document).height() - (5 * $(window).height()))");
          scriptobserver.disconnect();
        }
      });
    });
  });
  var scriptconfig = { attributes: false, childList: true, characterData: false, subtree: true };
  scriptobserver.observe(document, scriptconfig);

// remainder of script requires @run-at document-end
  document.addEventListener ("DOMContentLoaded", runAtDocumentEnd);


function runAtDocumentEnd() {

  // create an observer instance and iterate through each individual new node
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(addedNode) {
        createImageLinks(mutation.target.ownerDocument, addedNode);
        displayTimestamps(mutation.target.ownerDocument, addedNode);
      });
    });
  });

  // configuration of the observer
  // "theme1" is the class used by the feed root node for individual user's blog (xxxx.bdsmlr.com) -> seems unstable/temporary name -> might be changed by bdsmlr
  var config = { attributes: false, childList: true, characterData: false, subtree: true };
  // pass in the target node (<div> element contains all stream posts), as well as the observer options
  var postsmatch = document.evaluate(".//div[contains(@class,'newsfeed')] | .//div[contains(@class,'theme1')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  var postsnode = postsmatch.singleNodeValue;

  //process already loaded nodes (the initial posts before scrolling down for the first time)
  createImageLinks(document, postsnode);
  displayTimestamps(document, postsnode);

  //start the observer for new nodes
  observer.observe(postsnode, config);


  // also observe the right sidebar blog stream on the dashboard
  // pass in the target node, as well as the observer options (subtree has to be true here - target nodes are further down the hierarchy)
  var config2 = { attributes: false, childList: true, characterData: false, subtree: true };
  var sidepostsmatch = document.evaluate(".//div[@id='rightposts']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  var sidepostsnode = sidepostsmatch.singleNodeValue;
  // sidebar does only exist on dashboard
  if (sidepostsnode) {
    //start the observer for overlays
    observer.observe(sidepostsnode, config2);
  }

}
