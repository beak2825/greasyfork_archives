// ==UserScript==
// @name         Tumblr Dashboard - clickable links to images and display time-stamps
// @namespace    tumblr_dashboard_linkify
// @version      4.1.1
// @license      GNU AGPLv3
// @description  All Tumblr images receive direct link to their high-res variant. A colored box around each image indicates the vertical resolution of the high-res image.
// @author       marp
// @homepageURL  https://greasyfork.org/en/users/204542-marp
// @match        https://www.tumblr.com/
// @match        https://www.tumblr.com/*
// @match        https://*.media.tumblr.com/*
// @grant        GM_xmlhttpRequest
// @connect      tumblr.com
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/371109/Tumblr%20Dashboard%20-%20clickable%20links%20to%20images%20and%20display%20time-stamps.user.js
// @updateURL https://update.greasyfork.org/scripts/371109/Tumblr%20Dashboard%20-%20clickable%20links%20to%20images%20and%20display%20time-stamps.meta.js
// ==/UserScript==

// jshint esversion:8


/* function nsResolver(prefix) {
  if (prefix === 'svg') {
    return 'http://www.w3.org/2000/svg';
  } else {
    return null;
  }
} */

function doNothing_tumblr_dashboard_linkify(event) {
  event.preventDefault();
  return false;
}

function insertOrChangeLinkElement(myDoc, wrapElement, linkTarget) {
  var parentnode;
  parentnode = wrapElement.parentNode;
  if (parentnode.nodeName.toLowerCase() == "a") {
    parentnode.setAttribute("href", linkTarget);
    parentnode.setAttribute("target", "_blank");
    parentnode.addEventListener("click", doNothing_tumblr_dashboard_linkify, true);
  } else {
    var newnode;
    newnode = myDoc.createElement("a");
    newnode.setAttribute("href", linkTarget);
    newnode.setAttribute("target", "_blank");
    newnode.addEventListener("click", doNothing_tumblr_dashboard_linkify, true);
    parentnode.replaceChild(newnode, wrapElement);
    newnode.appendChild(wrapElement);
  }
}

function getHighResImageURL(imageElement) {
  var srcarray;
  var tmpstr;
  srcarray = imageElement.getAttribute("srcset").split(",");
  // QUICK AND DIRTY - assume largest image is the last in array... seems to be true for Tumblr... but might change...
  tmpstr = srcarray[srcarray.length-1].trim();
  return tmpstr.substring(0, tmpstr.indexOf(" "));
}



function createImageLinks(myDoc, myContext) {

  if (myDoc===null) myDoc= myContext;
  if (myDoc===null) return;
  if (myContext===null) myContext= myDoc;

  var matches;
  var imageurl;

  // the img might be added as part of a whole post (first expr) - or just the img or the div/img, in which case we need to check if the image is part of the correct hierarchy (second expr)
  matches=myDoc.evaluate(".//article//button[@aria-label]//figure//div/img[@srcset and @sizes]"
                         + " | " +
                         "self::img[@srcset and @sizes and parent::div/ancestor::figure/ancestor::button[@aria-label]/ancestor::article]"
                         + " | " +
                         "self::div/img[@srcset and @sizes  and parent::div/ancestor::figure/ancestor::button[@aria-label]/ancestor::article]"
                         + " | " +
                         "./ancestor-or-self::article/descendant::button[@aria-label]//figure//div/img[@srcset and @sizes]",
                         myContext, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for(var i=0, el; (i<matches.snapshotLength); i++) {
    el=matches.snapshotItem(i);
    if (el && el.previousSibling === null) {
      try {
        imageurl=getHighResImageURL(el);
        if (imageurl && imageurl.length > 5) {
          checkUrlHeaderOnlyPromise(imageurl, el).then( (result) => {
            if ( (result !== null) && (result.size !== null) && (result.url !== null) && (result.element !== null)) {
              insertOrChangeLinkElement(result.element.ownerDocument, result.element.parentNode, result.url);
              result.element.style = "box-sizing: border-box; border: 5px solid Grey;";
              result.element.setAttribute("title", getSizeText(result.size));
              getImageDimensionsPromise(result.url, result.element, result.size).then( (result2) => {
                        result2.element.style = "box-sizing: border-box; border: 5px solid " + result2.color + ";";
                        result2.element.setAttribute("title", getSizeText(result2.size) + " - " + result2.width + " x " + result2.height);
              });
            }
          });
        }
      } catch (e) { console.warn("error: ", e); }
    }
  }
}


var fixedHeightStyle = null;
function processFixedHeightNonsense(myDoc, myContext) {

  if (myContext.nodeType === Node.ELEMENT_NODE) {
    var matches, i, el;
    if (fixedHeightStyle === null) {
      matches = myDoc.evaluate("./descendant-or-self::div[ @class and parent::div/parent::article and descendant::button[@aria-label]//figure//img[@srcset and @sizes] ]",
                               myContext, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      var compstyles;
      for(i=0; (i<matches.snapshotLength); i++) {
        el=matches.snapshotItem(i);
        compstyles = myDoc.defaultView.getComputedStyle(el);
        if (compstyles.getPropertyValue("height") == "300px" && compstyles.getPropertyValue("overflow-y") == "hidden") {
          fixedHeightStyle = el.className;
          break;
        }
      }
    }

    if (fixedHeightStyle !== null) {
      matches = myDoc.evaluate("./descendant-or-self::div[ @class='" + fixedHeightStyle + "' and parent::div/parent::article and descendant::button[@aria-label]//figure//img[@srcset and @sizes] ]",
                               myContext, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      for(i=0; (i<matches.snapshotLength); i++) {
        el=matches.snapshotItem(i);
        el.className = "";
      }
    }
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
async function checkUrlHeaderOnlyPromise(url, element) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'HEAD',
      url: url,
      onload: function(response) {
        if (response.readyState >= 2) {
          var contentLength = -1;
          var conlenstr = response.responseHeaders.split("\r\n").find(str => str.toLowerCase().startsWith("content-length: "));
          if (conlenstr !== undefined) {
            contentLength = parseInt(conlenstr.slice(16), 10);
            if (isNaN(contentLength)) {
                contentLength = -1;
            }
          }
          resolve( { url: response.finalUrl, size: contentLength, origurl: url, element: element} );
        } else {
          reject( { url: url, size: -1, origurl: url, element: element } );
        }
      },
      ontimeout: function(response) {
        reject( { url: url, size: -1, origurl: url, element: element } );
      },
      onerror: function(response) {
        reject( { url: url, size: -1, origurl: url, element: element } );
      }
    });
  });
}

// This ASYNC method gets the natural dimensions of the supplied image
// This means the image needs to be downloaded fully, unfortunately!
// Thus, a delay is to be expected, except if the image is already cached
// Depending on the image height, the method suggests a "markup color" and then discards the downloaded image again (but does not invalidate cache).
// "divelement" is only passed-through - it is a helper to supply the DOM context to the surrounding asynchronous promise then function of the caller
async function getImageDimensionsPromise(imageurl, element, imagesize) {
  var image;
  var imageH;
  var imageW;
  var color;

  // sanity check - skip full download of image if it is larger than 20MB
  if ( (imagesize !== null) && (imagesize > 20971520) ) {
    return {url: imageurl, element: element, width: "unknown", height: "unknown", color: "Grey", size:imagesize};
  }

  image = new Image();
  image.src = imageurl;

  await image.decode().then(function() {
    imageH = image.naturalHeight;
    imageW = image.naturalWidth;
  });

  image.src = "data:,"; // clear the image, now that we no longer need it

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

  return {url: imageurl, element: element, width: imageW, height: imageH, color: color, size:imagesize};
}







var myDateTimeFormat = Intl.DateTimeFormat(undefined, {weekday: "short", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" /*, timeZoneName: "shortOffset" */ });

function displayDateTime(myDoc, myContext) {
  if (myDoc===null) myDoc= myContext;
  if (myDoc===null) return;
  if (myContext===null) myContext= myDoc;

  var matches;
  var datetime;

  matches=myDoc.evaluate(".//article//header//time[@datetime and not(@displaytimestampscript='1')]"
                         + " | " +
                         "./ancestor-or-self::article/descendant::header//time[@datetime and not(@displaytimestampscript='1')]",
                         myContext, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for(var i=0, el; (i<matches.snapshotLength); i++) {
    el=matches.snapshotItem(i);
    if (el) {
      try {
        datetime = el.getAttribute("datetime");
        el.setAttribute("displaytimestampscript", "1"); // flag that this node was added or edited by this script
        el.textContent = myDateTimeFormat.format(Date.parse(datetime));
      } catch (e) { console.warn("error: ", e); }
    }
  }
}



function removeImageHtmlCrap(myDoc, myContext) {
  if (myDoc===null) myDoc= myContext;
  if (myDoc===null) return;
  if (myContext===null) myContext= myDoc;

  var matches;
  var imgurl_full;
  var imgurl_match;
  var partialurl;
  var singlematch;
  var singlenode;
  var sib;
  var vsize;

  imgurl_full = window.location.href;
  // this part of the URL isd the same for all available sizes of the image
  partialurl = imgurl_full.match(/https?:\/\/[^/]+\.tumblr\.com\/[^/]+\//i); 
  if (partialurl) {
    imgurl_match = partialurl[0];

    singlematch = myDoc.evaluate("./descendant-or-self::img[contains(@srcset,'" + imgurl_match + "') or contains(@src,'" + imgurl_match + "')]",
                                 myContext, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    singlenode = singlematch.singleNodeValue; 
    if (singlenode) {
      // modify the image to use the largest available size varient (which is equal to the page URL!)
      // change several styles so that the image fits into the available viewport space
      singlenode.parentNode.setAttribute("style", "padding: 0px;");
      sib = singlenode.previousElementSibling; //this is the blog title (if available)
      if (sib===null) {
        singlenode.parentNode.parentNode.setAttribute("style", "padding: 0px;");
        sib = singlenode.parentNode.previousElementSibling; //this is the blog title (if available)
      }
      if (sib) {
        vsize = sib.clientHeight;
      } else {
        vsize = 0;
      }
      if (singlenode.hasAttribute("srcset")) {
        singlenode.removeAttribute("srcset");
        singlenode.removeAttribute("sizes");
      }
		singlenode.setAttribute("src", imgurl_full);
		singlenode.setAttribute("style", "max-width: 99vw; max-height: calc(99vh - " + vsize +"px); object-fit: contain;");
        singlenode.removeAttribute("class");
    }

    //remove all DIVs that are unrelated to the image as well as to the blog title (which appears right above the image)
    matches = myDoc.evaluate("./descendant-or-self::div[not( ./descendant-or-self::img["+
                                                               "(contains(@srcset,'" + imgurl_match + "') or contains(@src,'" + imgurl_match + "'))] )"
                                                       + "and " +
                                                       "not( ./descendant-or-self::img[@role='img'] ) ]",
                             myContext, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for(var i=0, el; (i<matches.snapshotLength); i++) {
      el=matches.snapshotItem(i);
      if (el) {
        try {
          el.remove();
        } catch (e) { console.warn("error: ", e); }
      }
    }

  }
}


var observer;
var config;
var singlematch;
var rootnode;

if ( window.location.href.includes('.media.tumblr.com/') ) {
	// special part of script - acting only on direct image URLs to remove the HTML-crap injected by Tumblr

  // create an observer instance and iterate through each individual new node
  observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(addedNode) {
        removeImageHtmlCrap(mutation.target.ownerDocument, addedNode.parentNode);
      });
    });
  });
  // configuration of the observer
  config = { attributes: false, childList: true, characterData: false, subtree: true };
  // new twitter UI has few stable IDs - need to start very high with "root" node
  singlematch = document.evaluate("//body[@id='tumblr']/div[@id='root']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  //console.info("singlematch: ", singlematch);
  rootnode = singlematch.singleNodeValue;
  if (rootnode) {
    //start the observer for new nodes
    observer.observe(rootnode, config);
    //process already loaded nodes (the initial posts before scrolling down for the first time)
    removeImageHtmlCrap(document, rootnode);
  }


} else { // this is "normal" part of script - acting on anything except direct image URLs


  // create an observer instance and iterate through each individual new node
  observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(addedNode) {
        createImageLinks(mutation.target.ownerDocument, addedNode);
        displayDateTime(mutation.target.ownerDocument, addedNode);
        processFixedHeightNonsense(mutation.target.ownerDocument, addedNode);
      });
    });
  });
  // configuration of the observer
  config = { attributes: false, childList: true, characterData: false, subtree: true };
  // Tumblr UI has few stable IDs - need to start very high with "root" node
  singlematch = document.evaluate("//body[@id='tumblr']/div[@id='root']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  //console.info("singlematch: ", singlematch);
  rootnode = singlematch.singleNodeValue;
  //start the observer for new nodes
  observer.observe(rootnode, config);
  //process already loaded nodes (the initial posts before scrolling down for the first time)
  createImageLinks(document, rootnode);
  displayDateTime(document, rootnode);
  processFixedHeightNonsense(document, rootnode);
}
