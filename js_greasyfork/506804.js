// ==UserScript==
// @name         DeviantArt - media download helper
// @namespace    deviantart_mediadownloadhelper
// @version      2.1
// @license      GNU AGPLv3
// @description  DeviantArt - Download multi-image deviations. Download largest resampled media file (useful if no original download is available). Fix timeout of original image download. Download filenames are prefixed with artist's name.
// @author       marp
// @homepageURL  https://greasyfork.org/en/users/204542-marp
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      www.deviantart.com
// @connect      wixmp.com
// @match        https://www.deviantart.com/*/art/*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/506804/DeviantArt%20-%20media%20download%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/506804/DeviantArt%20-%20media%20download%20helper.meta.js
// ==/UserScript==

// jshint esversion:11


(function() {
  'use strict';

  // Download symbol, downwards arrow with one horizontal lines below arrow
  // the horizontal line is slightly wider and much thicker than original DA download symbol
  const extraDownload1Svg = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
                              '<path d="m 19.913,18 c 1.333333,0 1.333333,5 0,5 h -16 c -1.3333328,0 -1.3333328,-5 0,-5 z ' +
                                       'm -4,-17 c 0.507356,-4.4041e-4 0.934639,0.379128 0.994,0.883 L 16.913,2 v 6 h 3.414 ' +
                                                'c 0.853894,-5.62e-5 1.315031,1.0010965 0.76,1.65 l -0.088,0.09 -8.413,7.648 ' +
                                                'c -0.345621,0.314527 -0.862993,0.347745 -1.246,0.08 L 11.24,17.388 2.828,9.74 ' +
                                                'C 2.1934191,9.1629397 2.5321441,8.1071654 3.384,8.007 L 3.5,8 H 6.913 V 2 ' +
                                                'C 6.9131264,1.4926858 7.2931105,1.0658484 7.797,1.007 L 7.913,1 Z ' +
                                       'm -1,2 h -6 v 7 H 6.086 L 11.913,15.297 17.74,10 H 14.914 V 3 Z" ' +
                                     'fill-rule="evenodd"></path></svg>';

  // Download symbol, downwards arrow with two horizontal lines below arrow
  // the two horizontal lines are slightly wider than original DA download symbol
  const extraDownload2Svg = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
                              '<path d="m 19.913,21 c 1.333333,0 1.333333,2 0,2 h -16 c -1.3333328,0 -1.3333328,-2 0,-2 z ' +
                                       'm 0,-3 c 1.333333,0 1.333333,2 0,2 h -16 c -1.3333328,0 -1.3333328,-2 0,-2 z ' +
                                       'm -4,-17 c 0.507356,-4.4041e-4 0.934639,0.379128 0.994,0.883 L 16.913,2 v 6 h 3.414 ' +
                                                'c 0.853894,-5.62e-5 1.315031,1.0010965 0.76,1.65 l -0.088,0.09 -8.413,7.648 ' +
                                                'c -0.345621,0.314527 -0.862993,0.347745 -1.246,0.08 L 11.24,17.388 2.828,9.74 ' +
                                                'C 2.1934191,9.1629397 2.5321441,8.1071654 3.384,8.007 L 3.5,8 H 6.913 V 2 ' +
                                                'C 6.9131264,1.4926858 7.2931105,1.0658484 7.797,1.007 L 7.913,1 Z ' +
                                       'm -1,2 h -6 v 7 H 6.086 L 11.913,15.297 17.74,10 H 14.914 V 3 Z" ' +
                                    'fill-rule="evenodd"></path></svg>';

  const logPrefix = "TamperMonkey userscript " + GM_info.script.name + ": ";

  // This recreates "__INITIAL_STATE__", "__INITIAL_I18N__" and few other JSON objects that normally exist on the global window object.
  // The "initials" variable acts as container, replacing the default global window object.
  // The global window object is not accessed nor changed in any way.
  var initials = getInitials(document);

  const i18nKeyFreeDownload = "actionbar.freeDownload";
  const i18nKeyPrivateColl = "actionbar.collectPrivately.label";
  const i18nKeyMoreActions = "deviationview.overlay.moreActions";
  const ariaFreeDownload = initials.__INITIAL_I18N__.resources[i18nKeyFreeDownload]; // for "en": "Free download"
  const ariaPrivateColl = initials.__INITIAL_I18N__.resources[i18nKeyPrivateColl]; // for "en": "Add to Private Collection"
  const ariaMoreActions = initials.__INITIAL_I18N__.resources[i18nKeyMoreActions]; // for "en": "More Actions"

  const idExtraOriginalDownload = GM_info.script.namespace + "_extraOriginalDownload";
  const ariaExtraOriginalDownload = "download original media";

  const idExtraResampledDownload = GM_info.script.namespace + "_extraResampledDownload";
  const ariaExtraResampledDownload = "download resampled media";

  var deviationId;
  var deviationJson;
  var deviationExtendedJson;
  var deviationAuthorJson;

  var deviationOriginalInfos; // array of structs created by parseInitials and sub-functions
  var deviationResampledInfos; // array of structs created by parseInitials and sub-functions
  var numDeviations; // size of array

  var deviationsShown; // array of indices of deviations shown (length = 1 except for MultiImage deviations in "Scroll view" mode)

  var linkOriginalDownload; // anchor ("a") element with the sub-hierarchy created by insertExtraDownloadButton
  var linkResampledDownload; // anchor ("a") element with the sub-hierarchy created by insertExtraDownloadButton

  var observerMain;
  var observerMultiImage;
  var multinode;

  // Mamespace resolver for use with document.evaluate to search for "svg" tags
  // Must use "svg:svg" in XPath to locate "svg" tags in document
  function nsResolver(prefix) {
    if (prefix === 'svg') {
      return 'http://www.w3.org/2000/svg';
    } else {
      return null;
    }
  }


  // Creates a new html element using an HTML source code snippet.
  // This approach via a "template" element requires a new-ish browser.
  function createElementFromHtml(aDocument, html) {
    const template = aDocument.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild;
  }


  // This ASYNC method returns a promise to retrieve the supplied URL via HTTP GET.
  //
  async function urlGetPromise(aUrl, aResponseType) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: aUrl,
        responseType: (aResponseType) ? aResponseType : undefined,
        onload: function(response) {
          if ((response.readyState >= 2) && (response.status == 200)) {
            resolve(response);
          } else {
            reject(response);
          }
        },
        ontimeout: function(response) {
          reject(response);
        },
        onerror: function(response) {
          reject(response);
        }
      });
    });
  }


  // Downloads a file from aUrl and triggers browser download save with filename aFilename
  // Performs the worse the larger the file (downloads entire file before triggering browser download/SaveAs dialog)
  function blobDownload(aDocument, aUrl, aFilename) {
    // internally download the media file as a blob (worse/slower the larger the file is -> !DELAY!)
    urlGetPromise(aUrl, "blob").then(
      // SUCCESS -> DONE, trigger browser download
      (result) => {
        const tmpAnchor = aDocument.createElement('a');
        const blob = new Blob([result.response], { type : 'application/octet-stream' });
        const blobUrl = URL.createObjectURL(blob);
        tmpAnchor.href = blobUrl;
        tmpAnchor.download = (aFilename?.length > 0) ? aFilename : "";
        tmpAnchor.click();
        URL.revokeObjectURL(blobUrl);
      },
      // FAILURE -> log error
      (errorresult) => {
        console.error(logPrefix + "blobDownload - blob download of media file failed.", { cause: errorresult });
      }
    );
  }


  //
  //
  function eventHandlerClickDownload(aEvent) {
    const el = aEvent.currentTarget;
    const doc = (el.ownerDocument) ? el.ownerDocument : document;

    // simple sanity-check if this is triggered on the correct element
    if (el?.tagName == "A" && el?.href == "javascript:;" && el?.getAttribute("num") >= 1) {
      aEvent.preventDefault(); // never let the link click be handled by the browser itself
      const num = el.getAttribute("num");

      for (var i=0; (i<num); i++) {
        const download = el.getAttribute("download"+i);
        const href = el.getAttribute("href"+i);
        const timeout = el.getAttribute("timeout"+i);

        // if time-out (plus 30sec buffer time) has elapsed -> refresh href url
        // Such a timeout href URL is currently only offered by DA for the original download of the first/main deviation
        // -> refresh mechanism is hard-coded here to extract exactly only this one URL from reloaded deviation page
        // -> If there's ever more than one line to be refreshed like this -> then this most be re-designed ENTIRELY (use of multiple promises/async)
        if (timeout && ( (Number.parseInt(timeout) - 30) < (Date.now() / 1000)) ) {
          const refreshinddex = i; // use const for async, using i directly is unsafe
          urlGetPromise(doc.URL).then(
            // SUCCESS -> DONE, now extract new url with new timeout from document HTML source
            (result) => {
              const rt = result.responseText;
              // the whole deviation page contains only one direct download link -> find it
              var start = rt.indexOf('href="https://www.deviantart.com/download/');
              if (start > 0) {
                start = start + 6; // skip href="
                const end = rt.indexOf('"', start); // find closing "
                // rt is HTML-stringified - here, this only means "&" -> "&amp;"
                const newhref = rt.substring(start, end).replaceAll("&amp;", "&");
                el.setAttribute("href"+refreshinddex, newhref);
                el.setAttribute("timeout"+refreshinddex, Number.parseInt(newhref.substring(newhref.indexOf("&ts=")+4)));
                el.click(); // click and trigger this event handler again (NOTE: this is within an async method from urlGetPromise)
                            // -> This is one part that needs to be REDESIGNED if ever more than one link to refresh
              } else {
                console.error(logPrefix + "triggerDownload - old URL has timed out, could not find new download url in document HTML");
              }
            },
            // FAILURE -> log error
            (errorresult) => {
              console.error(logPrefix + "triggerDownload - old URL has timed out, download of document with new URL failed.", { cause: errorresult });
            }
          );
          return; // finish event, do nothing else, ABORT FOR LOOP. After refresh promise is done, a new link click will be executed (see el.click() above)
        }

        //  -> if not same-origin, the suggested filename is ignored
        if (GM_info?.downloadMode == "native") {
          // TamperMonkey with download mode "native", or ViolentMonkey (which has only native mode)
          console.info(logPrefix + "eventHandlerClickDownload - using (hopefully) more efficient GM_download method");
          GM_download(href, (download?.length > 0) ? download : undefined);
        }
        else {
          // TamperMonkey with download mode "Browser API" or "disabled"
          // GM_download doesn't help in this case -> ugly workaround via Blob download (can cause delays)
          console.info(logPrefix + "eventHandlerClickDownload - using inefficient blob download method");
          // internally download the media file as a blob (worse the larger the file is -> !DELAY!)
          blobDownload(doc, href, download);
        }

      } // for
    } // if (sanity check)
  }


  // Creates a new sub-hierarchy with a download link ("a" element) and an inline SVG as download symbol.
  // It creates this new hierarchy based on an existing template structure.
  // The existing hierarchy must start with a "span" and must contain a "button" element with a unique "aria-label" and an SVG symbol
  // The "button" element is replaced by an anchor "a" element (but keeping all children of the "button", including the SVG.
  // RETURNS the "a" element, i.e. *NOT* the root of the newly created hierarchy.
  function insertExtraDownloadButton(aDocument, aAriaLabelLocator, aId, aAria, aSvg, aInfos) {
    var template = aDocument.evaluate("./main//section//span[./div//button[@aria-label='" + aAriaLabelLocator + "']//svg:svg]",
                                                aDocument.body, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (template === null) {
      // given aria label for existing hierarchy not found - fall back to secondary aria label
      template = aDocument.evaluate("./main//section//span[./div//button[@aria-label='" + ariaMoreActions + "']//svg:svg]",
                                                aDocument.body, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (template === null) {
        // secondary aria label also not found -> error
        throw new Error(logPrefix + "insertExtraDownloadButton - template structure not found by aria-label: " + aAriaLabelLocator);
      }
    }
    // use existing sub-hierarchy containing button with specified aria-label as template for our own, i.e.: clone entire structure
    const clone = template.cloneNode(true);
    clone.id = aId + "_top";
    // check if this already exists -> delete old structure, if yes
    const old = aDocument.getElementById(clone.id);
    if (old) old.remove();
    // old link should be deleted as child of overall old - but better safe than sorry...
    const oldlink = aDocument.getElementById(aId);
    if (oldlink) oldlink.remove();
    // the "button" from the template needs to be replaced with an "a" anchor
    const buttons = clone.getElementsByTagName("button");
    // there must be only one single button in sub-hierarchy identified by aAriaLabelLocator
    if (buttons.length !== 1) {
      throw new Error(logPrefix + "insertExtraDownloadButton - template structure does not contain single button element", { cause: template });
    }
    const button = buttons[0];
    // prepare to replace "button" element with "a" element (but keeping/bringing along its children)

    const newLink = aDocument.createElement("a");
    newLink.className = button.className;
    newLink.ariaLabel = aAria;
    newLink.title = (aInfos.length > 1) ? "Download multiple media files" : (aInfos[0].description) ? aInfos[0].description : aAria;
    newLink.id = aId;
    newLink.target = "_blank";
    newLink.href = "javascript:;";
    for (var i=0, j=0; (i<aInfos.length); i++) {
      if (!(aInfos[i].url?.length > 0)) continue;
      newLink.setAttribute("href"+j, aInfos[i].url);
      newLink.setAttribute("download"+j, (aInfos[i].filename) ? aInfos[i].filename : "");
      if (aInfos[i].timeout > 0) {
        newLink.setAttribute("timeout"+j, aInfos[i].timeout);
      }
      j++;
    }
    newLink.setAttribute("num", j);

    // event handler for downloading -> the anchor link itself ignores suggested download name (it's not same-origin)
    newLink.addEventListener("click", eventHandlerClickDownload);
    // there is always at least one child (the svg element)
    while (button.hasChildNodes()) {
      newLink.appendChild(button.firstChild);
    }
    // replace the "button" with new "a" element
    button.parentNode.replaceChild(newLink, button);
    // replace the "svg" element with our own
    const svgs = clone.getElementsByTagName("svg");
    if (svgs.length !== 1) {
      throw new Error(logPrefix + "insertExtraDownloadButton - template structure does not contain single button element", { cause: template });
    }
    const newSvg = createElementFromHtml(aDocument, aSvg);
    svgs[0].parentNode.replaceChild(newSvg, svgs[0]);
    // insert the newly created sub-hierarchy into the DOM
    template.before(clone);
    return newLink;
  }


  // Returns the "span" element that forms the beginning of the DA original "Free Download" link button.
  // Returns "null" if the button is not found (e.g.: if the deviation has download of original image file disabled).
  function getFreeDownloadSpan(aDocument) {
    return aDocument.evaluate("./main//section//span[./div//a[@aria-label='" + ariaFreeDownload +
                              "' and contains(@href,'&ts=') and contains(@href,'www.deviantart.com/download')]//svg:svg]",
                              aDocument.body, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }


  // DA UI uses react, and common way to initialize React with data is to use a JSON "window.__INITIAL_STATE__" global object.
  // It contains info this script needs - however, this object is deleted right after it is initially used by React.
  // To get at the contained data, we thus need to recreate it, i.e. rerun the inline script that originally creates it.
  // However, we don't want to contaminate the page's global scope, so we must rerun the script with a changed scope.
  // Here, we use a local target "window" var, and we enable strict mode to prevent any other vars from leaking into global scope.
  // This also return "window.__INITIAL_I18N__" - which does exist in the page's global scope window element.
  // However, accessing the page's window from a userscript is unsafe, so better via this method, in same manner like "window.__INITIAL_STATE__".
  function getInitials(aDocument) {
    const scriptnode = aDocument.evaluate("//script[contains(.,'window.__INITIAL_STATE__ = JSON.parse(') and contains(.,'window.__URL_CONFIG__ = JSON.parse(')]",
                                       aDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (scriptnode === null) return null;
    // create and run the script code as a function body.
    // pass in a fake "window" object as a parameter to redirect from the originally intended global scope window object to our own Object.
    const windowHolder = {};
    Function("window", "'use strict'; " + scriptnode.textContent)(windowHolder);
    if (Object.hasOwn(windowHolder, "__INITIAL_STATE__") && Object.hasOwn(windowHolder, "__INITIAL_I18N__")) {
      return windowHolder;
    } else {
      throw new Error (logPrefix + "getInitials - Unable to extract __INITIAL_STATE__ or __INITIAL_I18N__ JSON objects", { cause: scriptnode });
    }
  }


  function getSizeText(sizeInBytes) {
    if (sizeInBytes == null) {
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



  // Determines the best resampled image (mediatype with "c" field).
  // Non-resampled media (original, video, etc.) are ignored (items without "c" field")
  // IMPORTANT: The WIX image resampling converts animated images (GIF, etc) into static JPEGs :-(
  // NOTE: this function "pre-selects" the media type "preview" over other types with equal height/resolution
  //       The reason is to derive a nicer proposed filename: "...-preview.jpg" instead of "...-300w-2x.jpg"
  //   aMediaTokens can be undefined (e.g.: video deviations use no tokens at all, not even for WIX transformations)
  // returns an object struct with members:
  //   keyString   - a string that is unique to this media, allowing to identify it when analyzing HTML snippet (used for MultiImage deviations)
  //   url         - the download url
  //   filename    - proposed filename (or empty string) - to be used with "download" attrib of anchor ("a" ) element
  //   description - proposed description for display as hover pop with "title" attrib
  //   original    - always FALSE for this function - boolean indicating if this is the original (non-resampled) media file
  function findBestResampledImageInfo(aMediaTypes, aMediaBaseUri, aPrettyName, aMediaTokens) {
    if (!aMediaBaseUri || !aPrettyName || !aMediaTypes) {
      throw new Error(logPrefix + "findBestResampledImageInfo - some required parameters are not set");
    }
    if (!(aMediaTypes.length > 0)) {
      throw new Error(logPrefix + "findBestResampledImageInfo - aMediaTypes is empty or wrong type");
    }
    var bestHeight = -1;
    var bestWidth = -1;
    var bestC = null; // WIX image transformation/resampling URI path (like "/v1/fill/w_1063,h_752,q_70,strp/<prettyName>-pre.jpg")
    var bestT = null; // name/type of media ("fullview", "preview", etc.)
    var bestR = -1; // URL protection token

    // Media type with "c" field uses a WIX image transformation URL -> and the proposed filename pattern is part of the URL.
    // This pattern is extracted - as browser-based download won't honor non-same-origin "download" attribute
    // Instead, we need to process the pattern (replace "<prettyName>" placeholder with actual name).
    // File size information in "f" attrib is *INCORRECT* (it's the size of the original file, not the transformed one).
    // ADDITIONALLY:
    //   There can be a larger transformation image nested inside this type (typically "-2x", within "ss" array).
    //   However, this is not always the case: (a) nested "ss" array might not be there, or (b) nested inside might be exact same size.
    //   these "sub-types" use the same access token as the "outer" media type (token index in attrib "r")
    for (var i = 0; (i < aMediaTypes.length); i++) {
      const mediatype = aMediaTypes[i];
      var r = mediatype.r; // URL protection token
      if (!(r >=0)) continue; // skip if not protected by a token (like static placeholder or error image)
      const t = mediatype.t; // name/type of media ("fullview", "preview", etc.)
      var c = mediatype.c; // WIX image transformation/resampling URI path (like "/v1/fill/w_1063,h_752,q_70,strp/<prettyName>-pre.jpg")
      if (c === undefined) continue; // skip if this is not a resampled media
      if (c.includes("/v1/crop/") || c.includes("/v1/fit/")) continue; // skip types that crop image or reduce in size
      var h = mediatype.h; // height
      if ((h > bestHeight) || ((h === bestHeight) && ((t == "preview") || (t == "fullview")))) {
        bestHeight = h;
        bestWidth = mediatype.w;
        bestC = c;
        bestT = t;
        bestR = r;
      }
      var ss = mediatype.ss; //check for additional media variants (like "/v1/fill/w_1063,h_752,q_70,strp/<prettyName>-pre-2x.jpg")
      for (var j = 0; (j < ss?.length); j++) {
        const mediatypess = ss[j];
        h = mediatypess.h;
        if (h > bestHeight) {
          bestHeight = h;
          bestWidth = mediatypess.w;
          bestC = mediatypess.c;
          bestT = t;
          bestR = r;
        }
      }
    }

    // Note: image size info for resampled media is either wrong (it's the size of the original file) or missing entirely
    if (bestHeight > 0) {
      return {
        keyString: aMediaBaseUri,
        filename: bestC.substring(bestC.indexOf("<prettyName>")).replaceAll("<prettyName>", aPrettyName),
        description: "" + bestWidth + "x" + bestHeight + // width and height
        " - " + bestC.substring(bestC.lastIndexOf(".")+1).toUpperCase() + // file type extension
        " - " + bestT + // sample t: "fullview"
        " - download resampled media",
        url: aMediaBaseUri + bestC.replaceAll("<prettyName>", aPrettyName) + ((bestR >= 0) ? "?token=" + aMediaTokens[bestR] : ""),
        original: false
      };
    } else {
      return { keyString: null, filename: "", description: "no resampled media found", url: "", original: false };
    }
  }



  // Determines the best media file that is NOT a resampled image (no WIX image transformation)
  // This should only be one of the following: Either an original image, or a video/document.
  //   aMediaTokens can be undefined (e.g.: video deviations use no tokens at all, not even for WIX transformations)
  //   aOrigHeight can be undefined if it is not known
  // returns an object struct with members:
  //   keyString   - a string that is unique to this media, allowing to identify it when analyzing HTML snippet (used for MultiImage deviations)
  //   url         - the download url
  //   filename    - proposed filename (or empty string) - to be used with "download" attrib of anchor ("a" ) element
  //   description - proposed description for display as hover pop with "title" attrib
  //   original    - boolean indicating if this is the original (non-resampled) media file (videos need aOrigHeight to determine)
  function findBestOtherInfo(aMediaTypes, aMediaBaseUri, aPrettyName, aIsVideo, aIsDoc, aFileType, aMediaTokens, aOrigHeight) {
    if (!aMediaBaseUri || !aPrettyName || !aMediaTypes) {
      throw new Error(logPrefix + "findBestOtherInfo - some required parameters are not set");
    }
    if (!(aMediaTypes.length > 0)) {
      throw new Error(logPrefix + "findBestOtherInfo - aMediaTypes is empty or wrong type");
    }
    var bestHeight = -1;
    var bestWidth = -1;
    var bestB = null; // video URL (if exist)
    var bestS = null; // document URL (if exist)
    var bestT = null; // name/type of media ("fullview", "preview", etc.)
    var bestR = -1; // URL protection token
    var bestF = -1; // file size

    for (var i = 0; (i < aMediaTypes.length); i++) {
      const mediatype = aMediaTypes[i];
      if (mediatype.c) continue; // ignore WIX image transformations
      if (!aIsDoc && mediatype.s) continue; // ignore static images (like error images)
      if (aIsVideo && (mediatype.t != "video")) continue; // only use "video" types
      if (aIsDoc && (mediatype.t != aFileType)) continue; // only use document types
      const h = mediatype.h; // height
      if (h > bestHeight) {
        bestHeight = h;
        bestWidth = mediatype.w;
        bestB = mediatype.b;
        bestS = mediatype.s;
        bestT = mediatype.t;
        bestR = mediatype.r;
        bestF = mediatype.f;
      }
    }

    if (bestHeight >= 0) {
      if (bestB) {
        // this media type uses a URL independent of the baseUri but specific to the deviation - this is used for videos
        const filetype = bestB.substring(bestB.lastIndexOf(".")+1);
        // !! ASSUMPTION !!
        //     => If height here is same a height of orig file, then we have original video here, as well.
        // !! ASSUMPTION !!
        const orig = (aOrigHeight > 0) ? ((bestHeight == aOrigHeight) ? "original " : "resampled ") : "";
        return {
          keyString: aMediaBaseUri, // not using bestB - there will always be a video thumbnail using aMediaBaseUri - but likely NOT always the URI of the largest video variant
          filename: aPrettyName + "_" + bestHeight + "p." + filetype,
          description: "" + bestWidth + "x" + bestHeight +
          ((bestF > 0) ? " (" + getSizeText(Number.parseInt(bestF)) + ") - " : " - ") +
          filetype.toUpperCase() + " - " +
          bestT + " - download " + orig + "media file",
          url: bestB + ((bestR >= 0) ? "?token=" + aMediaTokens[bestR] : ""),
          original: (bestHeight == aOrigHeight)
        };
      }
      else if (aIsDoc && bestS) {
        // this media type uses a static URL independent of the baseUri - this is used for documents
        return {
          keyString: aMediaBaseUri, // not using bestS - there will always be a document thumbnail using aMediaBaseUri
          filename: aPrettyName + "." + aFileType,
          description: "" + ((bestF > 0) ? " (" + getSizeText(Number.parseInt(bestF)) + ") - " : " - ") +
          aFileType.toUpperCase() + " - " +
          bestT + " - download original file",
          url: bestS,
          original: true
        };
      }
      else
      {
        // this media type does not use WIX image transformations, and it is not a static URL (like used for "social_preview" media type)
        // this means it is the original full size media, without any transformation - and with a URL that does NOT time-out quickly :-)
        // but the URL will be with a cryptic GUID-like filename - so we must suggest better filename
        const filetype = aMediaBaseUri.substring(aMediaBaseUri.lastIndexOf(".")+1);
        return {
          keyString: aMediaBaseUri,
          filename: aPrettyName + "." + filetype,
          description: "" + bestWidth + "x" + bestHeight +
          ((bestF > 0) ? " (" + getSizeText(Number.parseInt(bestF)) + ") - " : " - ") +
          filetype.toUpperCase() + " - " +
          bestT + " - download original media file",
          url: aMediaBaseUri + ((bestR >= 0) ? "?token=" + aMediaTokens[bestR] : ""),
          original: true
        };
      }
    }
    else
    {
      return { keyString: null, filename: "", description: "no non-resampled media found", url: "", original: false };
    }
  }



  // Parses the JSON object "initials.__INITIAL_STATE__" from the "initials" parameter as created by "getInitials()".
  // Nearly all page information that this script needs, comes from __INITIAL_STATE__ -> thus this function is rather large...
  function parseInitials(initials) {
    'use strict'; // make double sure that this function uses strict mode (strict mode on should be inherited, anyway).

    try {

      const entities = initials.__INITIAL_STATE__["@@entities"];
console.info("TEST-entities: ", entities);

      var tmpVal;

      // extra info about deviation author
      tmpVal = Object.keys(entities.user).at(0); // has only one child, with node name being the authors ID
      deviationAuthorJson = entities.user[tmpVal];
      const authorId = deviationAuthorJson.userId;
      console.assert(authorId == tmpVal, logPrefix + "entities.user JSON key ("+tmpVal+") and userId ("+authorId+") should be identical", entities);
      const authorName = deviationAuthorJson.username;

      // extract info about deviation basics
      tmpVal = Object.keys(entities.deviation).at(0); // has only one child, with node name being the authors ID
      deviationJson = entities.deviation[tmpVal];
      deviationId = deviationJson.deviationId;
      console.assert(deviationId == tmpVal, logPrefix + "entities.deviation JSON key ("+tmpVal+") and deviationId ("+deviationId+") should be identical", entities);
      tmpVal = deviationJson.author;
      console.assert(authorId == tmpVal, logPrefix + "user.userId ("+authorId+") and deviation.author ("+tmpVal+") should be identical", entities);

      // extract extended info (info about original file)
      tmpVal = Object.keys(entities.deviationExtended).at(0); // has only one child, with node name being the authors ID
      deviationExtendedJson = entities.deviationExtended[tmpVal];
      console.assert(deviationId == tmpVal, logPrefix + "entities.deviationExtended JSON key ("+tmpVal+") and deviationId ("+deviationId+") should be identical", entities);

      const isDownloadable = deviationJson.isDownloadable;
      const isAiGenerated = deviationJson.isAiGenerated;
      // isLocked indicates that the deviation is inaccessible - all available images will be blurred
      const isLocked = (deviationJson.tierAccess == "locked") ||
                       (deviationJson.premiumFolderData?.hasAccess == false);
      const isVideo = deviationJson.isVideo;
      const fileType = deviationJson.type;
      const isDoc = !isVideo && ((fileType == "pdf") || (deviationJson.canBeMultiImage == false));

      const isMultiImage = deviationJson.isMultiImage;
      const deviationAdditionalMedia = (isMultiImage) ? deviationExtendedJson.additionalMedia : null;
      console.assert((!isMultiImage) || (deviationAdditionalMedia?.length > 0), logPrefix + "MultiImage deviations should have additionalMedia array within deviationExtended JSON", entities);

      // prep global variables
      numDeviations = (deviationAdditionalMedia?.length > 0) ? deviationAdditionalMedia.length + 1 : 1;
      deviationOriginalInfos = new Array(numDeviations);
      deviationResampledInfos = new Array(numDeviations);

      // *****
      // ***** parse the FIRST/MAIN deviation media - if this is multi-image, additional media must be parsed, as well
      // *****
      // extract info about file name and media types
      const media = deviationJson.media;
      const mediaPrettyName = media.prettyName; // deviation basic filename without extension
      // modify filename to my preference:
      //  -> prefix author name and additional "AI" prefix if "AI generated" flag is set
      const myPrettyName = authorName.toLowerCase() + ((isAiGenerated) ? "_AI_" : "_") + mediaPrettyName;
      // extract info about full size and/or preview media file
      const mediaBaseUri = media.baseUri; // sample: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/<guid>/<otherguid>.jpg"
      const mediaTokens = media.token; // optional tokens to access media types - if present, baseUri alone will result in access denied error

      // extract info about original file
      // results in deviationOriginalInfos[0] either set or null, never undefined
      const download = deviationExtendedJson.download;
      if (download) {
        console.assert(isDownloadable, logPrefix + "download info is available but isDownloadable is false. Ignoring.", entities);
        const downloadType = download.url.match(/\.([^.?]+)\?token/i)[1]; // extract file extension from url (not the same as download.type)
        deviationOriginalInfos[0] = {
          keyString: mediaBaseUri,
          filename: myPrettyName + "." + downloadType,
          description: "" + download.width + "x" + download.height + " (" + getSizeText(Number.parseInt(download.filesize)) + ") - " +
                       downloadType.toUpperCase() + " - download original media file",
          url: download.url,
          original: true,
          timeout: Number.parseInt(download.url.substring(download.url.indexOf("&ts=")+4))
        };
      } else {
        console.assert(!isDownloadable, logPrefix + "isDownloadable is true but no download info is available. Ignoring.", entities);
        deviationOriginalInfos[0] = null;
      }
      const origFile = deviationExtendedJson.originalFile;
      const origFileSize = origFile?.filesize;
      const origWidth = origFile?.width;
      const origHeight = origFile?.height;

      // decide which of the available downloads / media types to use for Original (if any) and for Resampled
      if (!isLocked) {
        if (!isVideo && !isDoc) {

          deviationResampledInfos[0] = findBestResampledImageInfo(media.types, mediaBaseUri, myPrettyName, mediaTokens);
          if (!deviationOriginalInfos[0]) { // no download url (the one that times out) -> try to find original in mediaTypes
            const bestOther = findBestOtherInfo(media.types, mediaBaseUri, myPrettyName, isVideo, isDoc, fileType, mediaTokens, origHeight);
            deviationOriginalInfos[0] = (bestOther?.original) ? bestOther : null;
          }
        }
        else // isVideo == true
        {
          const bestOther = findBestOtherInfo(media.types, mediaBaseUri, myPrettyName, isVideo, isDoc, fileType, mediaTokens, origHeight);
          if (bestOther?.original) {
            deviationOriginalInfos[0] = bestOther;
            deviationResampledInfos[0] = null;
          } else {
            deviationOriginalInfos[0] = null;
            deviationResampledInfos[0] = bestOther;
          }
        }
      }
      else {
        // nothing we can do if the deviation is locked
        deviationResampledInfos[0] = null;
      }

      // *****
      // ***** If MultiImage -> parse additional media
      // *****
      for (var mediaindex = 0; (mediaindex < (numDeviations-1)); mediaindex++) {
        const additionalMedia = deviationAdditionalMedia[mediaindex];
        const origFileSize = additionalMedia.filesize;
        const origWidth = additionalMedia.width;
        const origHeight = additionalMedia.height;
        const media = additionalMedia.media;
        const mediaPrettyName = media.prettyName; // deviation basic filename without extension
        // modify filename of MultiImage items to my preference:
        //  -> MultiImage deviations often seem to include the file extension as part of the pretty name - try to detect and remove
        //  -> prefix the ENTIRE pretty name of the first/main deviation (this will also "inherit" the author and potential AI prefixes)
        const myMultiPrettyName = myPrettyName + "_" + mediaPrettyName.replace(/\.[a-zA-Z0-9]+$/, "");
        // extract info about full size and/or preview media file
        const mediaBaseUri = media.baseUri; // sample: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/<guid>/<otherguid>.jpg"
        const mediaTokens = media.token; // optional tokens to access media types - if present, baseUri alone will result in access denied error
        if (!isLocked) {
          if (!isVideo && !isDoc) {
            deviationResampledInfos[mediaindex+1] = findBestResampledImageInfo(media.types, mediaBaseUri, myMultiPrettyName, mediaTokens);
            const bestOther = findBestOtherInfo(media.types, mediaBaseUri, myMultiPrettyName, isVideo, isDoc, fileType, mediaTokens, origHeight);
            deviationOriginalInfos[mediaindex+1] = (bestOther?.original) ? bestOther : null;
          }
          else // there should be no videos in MuiltiImage deviations - but who knows... better safe than sorry...
          {
            const bestOther = findBestOtherInfo(media.types, mediaBaseUri, myMultiPrettyName, isVideo, isDoc, fileType, mediaTokens, origHeight);
            if (bestOther?.original) {
              deviationOriginalInfos[mediaindex+1] = bestOther;
              deviationResampledInfos[mediaindex+1] = null;
            } else {
              deviationOriginalInfos[mediaindex+1] = null;
              deviationResampledInfos[mediaindex+1] = bestOther;
            }
          }
        }
        else {
          // nothing we can do if the deviation is locked
          deviationResampledInfos[mediaindex+1] = null;
        }

      }

    }
    catch (e) {
      throw new Error(logPrefix + "parseInitials - Failure parsing __INITIAL_STATE__", { cause: e });
    }
  }


  function determineDeviationIndex(aDocument) {
    var newDeviationsShown = [];
    if (!multinode || !(numDeviations > 0)) {
      return newDeviationsShown;
    }
    if (numDeviations == 1) {
      newDeviationsShown = [0];
      return newDeviationsShown;
    }

    for (var i=0; (i < numDeviations); i++) {
      // if the below "keys" occur in the target DOM, then this identifies which deviation is currently being shown
      const keyResampled = deviationResampledInfos[i]?.keyString;
      const keyOriginal = deviationOriginalInfos[i]?.keyString;
      var matchR = null;
      if (keyResampled?.length > 0) {
        matchR = aDocument.evaluate(".//figure//img[not(ancestor::button) and (contains(@src,'" + keyResampled + "') or contains(@srcset,'" + keyResampled + "'))]" +
                                    " | " +
                                    ".//div[contains(@style, '" + keyResampled + "')]", // for video thumbnail overlay: style='... background-image: url("https:/ ...'
                                    multinode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }
      var matchO = null;
      if (keyOriginal?.length > 0) {
        matchO = aDocument.evaluate(".//figure//img[not(ancestor::button) and (contains(@src,'" + keyOriginal + "') or contains(@srcset,'" + keyOriginal + "'))]" +
                                    " | " +
                                    ".//div[contains(@style, '" + keyOriginal + "')]", // for video thumbnail overlay: style='... background-image: url("https:/ ...'
                                    multinode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }
      if (matchR || matchO) newDeviationsShown.push(i);
    }
    return newDeviationsShown;
  }


  // Inserts up to two extra download buttons, requires that __INITIAL_STATE__ has been parsed and processed
  //  - button "original" will be present if media download in original, non-resampled quality is available
  //  - button "resampled" will be present if a resampled media download is available
  // Also checks if previously inserted buttons need to be updated (needed for MultiImage deviations)
  function insertUpdateExtraButtons(aDocument) {

    var newDeviationsShown = determineDeviationIndex(aDocument);

    // only continue if no buttons inserted or if devinationsShown has changed
    // CAREFUL: likely endless loop otherwise, as observer includes this DOM area
    if (linkResampledDownload || linkOriginalDownload) {
      if (deviationsShown &&
          newDeviationsShown.length === deviationsShown?.length &&
          newDeviationsShown.every((e, i) => e === deviationsShown[i])) {
        return;
      }
    }
    deviationsShown = newDeviationsShown;

    const resampledInfos = [];
    const originalInfos = [];
    for (var i=0; (i<deviationsShown?.length); i++) {
      const oi = deviationOriginalInfos[deviationsShown[i]];
      const ri = deviationResampledInfos[deviationsShown[i]];
      if (oi?.url?.length > 0) {
        originalInfos.push(oi);
      }
      if (ri?.url?.length > 0) {
        resampledInfos.push(ri);
      }
    }

    if (linkResampledDownload) {
      linkResampledDownload.remove();
      linkResampledDownload = null;
    }
    if (resampledInfos.length > 0) {
      linkResampledDownload = insertExtraDownloadButton(
        aDocument, ariaPrivateColl, idExtraResampledDownload,
        ariaExtraResampledDownload, extraDownload2Svg,
        resampledInfos);
    }

    if (linkOriginalDownload) {
      linkOriginalDownload.remove();
      linkOriginalDownload = null;
    }
    if (originalInfos.length > 0) {
      linkOriginalDownload = insertExtraDownloadButton(
        aDocument, ariaPrivateColl, idExtraOriginalDownload,
        ariaExtraOriginalDownload, extraDownload1Svg,
        originalInfos);
    }
  }



  function installMultiObserver(aDocument) {
    // this observer is to deal multi image deviations -  it must be re-initialized after full-screen zoom (observer node gets removed on full-screen zoom)
    observerMultiImage = new MutationObserver(function(mutations) {
      // don't need to iterate over added or removed nodes!
      // instead, the below function checks globally by ID (fast! simple!) if extra buttons already exist or not
      insertUpdateExtraButtons(aDocument);
    });
    // Configuration of the observer
    // look at everything below a certain div that encapsulates both the deviation and the button panel below (where the extra buttons are)
    // It is removed from DOM when switching to full-screen.
    // It's descendants structure is different for image deviations and video deviations
    // It's descendants structure and/or descendant attributes change for MultiImage deviation when navigating images and/or when switching between single image and all image display modes
    const multiconfig = { attributes: true, childList: true, characterData: false, subtree: true };
    multinode = aDocument.evaluate("(./main/div[1])[preceding-sibling::header]/div[child::section]",
                                         aDocument.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (multinode) {
      observerMultiImage.observe(multinode, multiconfig);
    } else {
      observerMultiImage = null;
    }
  }


  function installObservers(aDocument) {
    // create an observer instances to check if extra buttons need to be re-added or modified (override React-based re-rendering of DOM)
    // this observer is to deal with zoom/full-screen display modes - it only looks at direct children of <main>
    observerMain = new MutationObserver(function(mutations) {
      if (!(multinode?.connected == true)) {
        if (observerMultiImage) {
          observerMultiImage.disconnect();
        }
        installMultiObserver(aDocument);
      }
      // don't need to iterate over added or removed nodes!
      // instead, the below function checks globally by ID (fast! simple!) if extra buttons already exist or not
      insertUpdateExtraButtons(aDocument);
    });
    // Configuration of the observer
    // "main" node is the start of React managed hierarchy.
    // It changes in major way when switching to full-screen.
    // Fortunately, it is sufficient to just observe direct children - all sub-hierarchy elements get added/removed right along with them
    const mainconfig = { attributes: false, childList: true, characterData: false, subtree: false };
    const mainnode = aDocument.evaluate("./main", aDocument.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    observerMain.observe(mainnode, mainconfig);
  }



  //
  // ***** START OF USER SCRIPT *****
  //

  // extract all info needed for extra download button fROM __INITIAL_STATE__ object ("initials" itself is already initialized)
  parseInitials(initials);

  // process already loaded nodes (the initial posts before scrolling down for the first time)
  insertUpdateExtraButtons(document);

  // mutation observer to re-create extra download buttons if React re-renders DOM (e.g. expanding to and exiting from full-screen view).
  installMultiObserver(document);
  installObservers(document);

})();
