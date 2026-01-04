// ==UserScript==
// @name         Thing Remix Attribution Maker
// @namespace    http://poikilos.org/
// @version      4.0.0
// @description  Format the license information from a thing page
// @author       Poikilos (Jake Gustafson)
// @match      https://www.thingiverse.com/thing:*
// @grant        none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/394594/Thing%20Remix%20Attribution%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/394594/Thing%20Remix%20Attribution%20Maker.meta.js
// ==/UserScript==

(function() {
  // now its @match again :eyeroll: -- eslint says it may be obsolete in Manifest v3 in early 2023
  // formerly @include      https://www.thingiverse.com/thing:*
  // formerly @match        https://www.thingiverse.com/thing:*
  var verbose = true;
  var checkTimer = null;
  var licenseClauseImgPrefix = "License__img";
  var licenseAnchorPrefix = "License__link"; // INFO: License__link* could be author OR license link; author also has License__creator* class.
  var titlePrefix = "ThingTitle__modelName";
  var headingCreatedPrefix = "ThingTitle__createdBy";
  var madeDivClassName = "ThingTitle__madeBy"; // doneDivPrefixes' container[0]'s class (a.k.a. .className)
  var doneDivPrefixes = [titlePrefix, headingCreatedPrefix];
  var clausesContainerPrefix = "License__ccLicense";
  var doneDivPrefixesMain = [clausesContainerPrefix];
  var urlSmallNames = {
    "/by/1.0": "CC BY 1.0",
    "/by/2.0": "CC BY 2.0",
    "/by/2.5": "CC BY 2.5",
    "/by/3.0": "CC BY 3.0",
    "/by/4.0": "CC BY 4.0",
    "/by-sa/1.0": "CC BY-SA 1.0",
    "/by-sa/2.0": "CC BY-SA 2.0",
    "/by-sa/2.5": "CC BY-SA 2.5",
    "/by-sa/3.0": "CC BY-SA 3.0",
    "/by-sa/4.0": "CC BY-SA 4.0",
    "/by-nc/1.0": "CC BY-NC 1.0",
    "/by-nc/2.0": "CC BY-NC 2.0",
    "/by-nc/2.5": "CC BY-NC 2.5",
    "/by-nc/3.0": "CC BY-NC 3.0",
    "/by-nc/4.0": "CC BY-NC 4.0",
    "/by-nc-sa/1.0": "CC BY-NC-SA 1.0",
    "/by-nc-sa/2.0": "CC BY-NC-SA 2.0",
    "/by-nc-sa/2.5": "CC BY-NC-SA 2.5",
    "/by-nc-sa/3.0": "CC BY-NC-SA 3.0",
    "/by-nc-sa/4.0": "CC BY-NC-SA 4.0",
    "/by-nd/1.0": "CC BY-ND 1.0",
    "/by-nd/2.0": "CC BY-ND 2.0",
    "/by-nd/2.5": "CC BY-ND 2.5",
    "/by-nd/3.0": "CC BY-ND 3.0",
    "/by-nd/4.0": "CC BY-ND 4.0",
    "/by-nd-nc/1.0": "CC BY-ND-NC 1.0",
    "/by-nc-nd/2.0": "CC BY-NC-ND 2.0",
    "/by-nc-nd/2.5": "CC BY-NC-ND 2.5",
    "/by-nc-nd/3.0": "CC BY-NC-ND 3.0",
    "/by-nc-nd/4.0": "CC BY-NC-ND 4.0",
    "creativecommons.org/share-your-work/public-domain/cc0": "CC0",
    "creativecommons.org/publicdomain/zero/1.0": "CC0 1.0",
  };
  var bigNames = {
    "CC BY 1.0": "Creative Commons Attribution 1.0 Generic",
    "CC BY 2.0": "Creative Commons Attribution 2.0 Generic",
    "CC BY 2.5": "Creative Commons Attribution 2.5 Generic",
    "CC BY 3.0": "Creative Commons Attribution 3.0 Unported",
    "CC BY 4.0": "Creative Commons Attribution 4.0 International",
    "CC BY-SA 1.0": "Creative Commons Attribution-ShareAlike 1.0 Generic",
    "CC BY-SA 2.0": "Creative Commons Attribution-ShareAlike 2.0 Generic",
    "CC BY-SA 2.5": "Creative Commons Attribution-ShareAlike 2.5 Generic",
    "CC BY-SA 3.0": "Creative Commons Attribution-ShareAlike 3.0 Unported",
    "CC BY-SA 4.0": "Creative Commons Attribution-ShareAlike 4.0 International",
    "CC BY-NC 1.0": "Creative Commons Attribution-NonCommercial 1.0 Generic",
    "CC BY-NC 2.0": "Creative Commons Attribution-NonCommercial 2.0 Generic",
    "CC BY-NC 2.5": "Creative Commons Attribution-NonCommercial 2.5 Generic",
    "CC BY-NC 3.0": "Creative Commons Attribution-NonCommercial 3.0 Unported",
    "CC BY-NC 4.0": "Creative Commons Attribution-NonCommercial 4.0 International",
    "CC BY-NC-SA 1.0": "Creative Commons Attribution-NonCommercial-ShareAlike 1.0 Generic",
    "CC BY-NC-SA 2.0": "Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Generic",
    "CC BY-NC-SA 2.5": "Creative Commons Attribution-NonCommercial-ShareAlike 2.5 Generic",
    "CC BY-NC-SA 3.0": "Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported",
    "CC BY-NC-SA 4.0": "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International",
    "CC BY-ND 1.0": "Creative Commons Attribution-NoDerivs 1.0 Generic",
    "CC BY-ND 2.0": "Creative Commons Attribution-NoDerivs 2.0 Generic",
    "CC BY-ND 2.5": "Creative Commons Attribution-NoDerivs 2.5 Generic",
    "CC BY-ND 3.0": "Creative Commons Attribution-NoDerivs 3.0 Unported",
    "CC BY-ND 4.0": "Creative Commons Attribution-NoDerivatives 4.0 International",
    "CC BY-ND-NC 1.0": "Creative Commons Attribution-NoDerivs-NonCommercial 1.0 Generic",
    "CC BY-NC-ND 2.0": "Creative Commons Attribution-NonCommercial-NoDerivs 2.0 Generic",
    "CC BY-NC-ND 2.5": "Creative Commons Attribution-NonCommercial-NoDerivs 2.5 Generic",
    "CC BY-NC-ND 3.0": "Creative Commons Attribution-NonCommercial-NoDerivs 3.0 Unported",
    "CC BY-NC-ND 4.0": "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International",
    "CC0": "No Rights Reserved",
    "CC0 1.0": "Creative Commons CC0 1.0 Universal",
  };
  function getElementsWhereClassStartsWith(str) {
    if (verbose) {
      console.log("");
      console.log("getElementsWhereClassStartsWith(\""+str+"\")...");
    }
    var els = [];
    var all = document.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) {
      var el = all[i];
      if (el.className && !el.className.startsWith) {
        // Why This started happening (className.startsWith not existing) when className is true is unclear.
        if (el.class) {
            console.log("Warning: no el.className.startsWith for class="+el.class+" + el.className="+el.className);
        }
        else {
            console.log("Warning: no el.className.startsWith for el.className="+el.className);
        }
      }

      if (el.class && el.class.startsWith(str)) {
        els.push(el);
      }
      else if (el.className && el.className.startsWith && el.className.startsWith(str)) {
        els.push(el);
      }

    }
    if (verbose) {
      console.log("- FOUND " + els.length);
    }
    return els;
  }

  function getElementsWhere(tagName, attributeName, value) {
    if (verbose) {
      console.log("");
      console.log("getSubElementsWhere(\""+tagName+"\", \""+attributeName+"\", \""+value+"\")...");
    }
    var els = [];
    var all = document.getElementsByTagName(tagName);
    for (var i=0, max=all.length; i < max; i++) {
      var el = all[i];
      if (el.getAttribute(attributeName) == value) {
        els.push(el);
      }
    }
    if (verbose) {
      console.log("- FOUND " + els.length);
    }
    return els;
  }
  function getDivsWhereClassStartsWith(str) {
    if (verbose) {
      console.log("");
      console.log("FIND getDivsWhereClassStartsWith(\"" + str + "\")...");
    }
    var els = [];
    var all = document.getElementsByTagName("div");
    for (var i=0, max=all.length; i < max; i++) {
      var el = all[i];
      if (el.className.startsWith(str)) {
        els.push(el);
        // console.log("- FOUND (" + els.length + ")");
      }
      else {
        // console.log("- " + el.className + " does not start with it.");
      }
    }
    if (verbose) {
      // console.log("Div count: " + all.length);
      console.log("- FOUND " + els.length);
    }
    return els;
  }
  function getWhereClassStartsWithIn(el, str) {
    if (el === undefined) {
      console.log("[getWhereClassStartsWithIn] Error: el is undefined.");
      return [];
    }
    if (verbose) {
      console.log("");
      console.log("DETECT getWhereClassStartsWithIn(el, \""+str+"\")...");
      // console.log("  el: " + JSON.stringify(el)); // DON'T do (could be circular)
      console.log("  el.className: "+el.className);
      console.log("  el.childNodes.length:"+el.childNodes.length+"...");
    }
    var els = [];
    var all = el.childNodes;
    for (var i=0, max=all.length; i < max; i++) {
      var thisEl = all[i];
      if ((thisEl.className != undefined) && thisEl.className.startsWith(str)) {
        els.push(thisEl);
      }
      else {
        // console.log("- "+el.className+" does not start with "+str+".");
      }
    }
    if (verbose) {
      console.log("- FOUND " + els.length + " " + str);
      // console.log("- done (div count: " + all.length + ")");
    }
    return els;
  }
  function hasAllDivPrefixes(prefixes) {
    var found = 0;
    for (var i=0, max=prefixes.length; i < max; i++) {
      if (getDivsWhereClassStartsWith(prefixes[i]).length > 0) {
        found++;
      }
    }
    return found >= prefixes.length;
  }
  function hasAllClasses(classNames) {
    var found = 0;
    for (var i=0, max=classNames.length; i < max; i++) {
      if (document.getElementsByClassName(classNames[i]).length > 0) {
        found++;
      }
      else {
        if (verbose) {
          console.error("The className " + classNames[i] + " was not found.")
        }
      }
    }
    return found >= classNames.length;
  }
  function elementHasAllPrefixes(el, prefixes) {
    var found = 0;
    for (var i=0, max=prefixes.length; i < max; i++) {
      if (getWhereClassStartsWithIn(el, prefixes[i]).length > 0) {
        found++;
      }
    }
    return found >= prefixes.length;
  }
  function getImgsWhereClassStartsWith(str) {
    var els = [];
    var all = document.images; // document.getElementsByTagName("img");
    for (var i=0, max=all.length; i < max; i++) {
      var el = all[i];
      if (el.className.startsWith(str)) {
        els.push(el);
      }
    }
    return els;
  }
  function getAnchorsWhereClassStartsWith(str) {
    if (verbose) {
        console.log("getAnchorsWhereClassStartsWith(\""+str+"\")...")
    }
    var els = [];
    var all = document.getElementsByTagName("a");
    for (var i=0, max=all.length; i < max; i++) {
      var el = all[i];
      if (el.className.startsWith(str)) {
        els.push(el);
      }
    }
    if (verbose) {
      console.log("- FOUND " + els.length);
      // console.log("- done (div count: " + all.length + ")");
    }
    return els;
  }
  function getAnchorsWhereHrefContains(str) {
      // Example: str=field_art_tags_tid= finds <a href="/art-search-advanced?field_art_tags_tid=grass">...
    if (verbose) {
        console.log("getAnchorsWhereHrefContains(\""+str+"\")...")
    }
    var els = [];
    var all = document.getElementsByTagName("a");
    for (var i=0, max=all.length; i < max; i++) {
      var el = all[i];
      if (el.href.includes(str)) {
        els.push(el);
      }
    }
    if (verbose) {
      console.log("- FOUND " + els.length);
      // console.log("- done (div count: " + all.length + ")");
    }
    return els;
  }

  function elementAToMarkdown(element) {
    var ret = null;
    if (element.href) {
      ret = "[" + element.textContent + "](" + element.href + ")";
    }
    else {
      if (verbose) {
        console.warn("- elementAToMarkdown " + element.textContent + " href is blank in elementAToMarkdown: \"" + element.href + "\"")
      }
      ret = element.textContent;
    }
    return ret;
  }

  function getMarkdown(info) {
    if (verbose) {
      console.log("");
      console.log("getMarkdown...");
    }
    var outputStr = "";
    outputStr = "## License";
    if (info.license) {
      outputStr += "\n- ";
      if (info.licenseHref) {
        outputStr += "[" + info.license + "](" + info.licenseHref + ")";
      }
      else {
        // console.log("* skipping long name detection since a license was detected: \""+info.license+"\"");
        outputStr += info.license;
      }
      if (info.shortLicense) {
        outputStr += "\n  (" + info.shortLicense + ")";
      }
    }
    else {
      outputStr += "\n- LICENSE: [insert license name (&URL unless in each content ZIP) of original thing here]";
    }

    if (info.author) {
      outputStr += "\n- by " + info.author + " and <insert remixer's name here>";
    }
    if (info.title) {
      outputStr += "\n- based on";
      if (info.titleHref) {
        outputStr += " [" + info.title + "](" + info.titleHref + ")";
      }
      else {
        outputStr += " " + info.title;
      }
      if (info.author) {
        if (info.authorHref) {
          outputStr += " by [" + info.author + "](" + info.authorHref + ")";
        }
        else {
          outputStr += " by " + info.author;
        }
      }
      if (info.year) {
        outputStr += " ";
        if (info.month) {
          outputStr += info.month + " ";
          if (info.day) {
            outputStr += info.day + ", "
          }
        }
        outputStr += info.year;
      }
    }

    return outputStr;
  }

  function populateCorrespondingLicenseFields(info) {
    var licenseShortStr = "";
    if (info.license) {
      var versionIsFound = false;
      var licenseLower = info.license.toLowerCase();
      if (info.license.startsWith("Creative Commons") || info.license.startsWith("CC")) {
        if (info.license.startsWith("CC0 1.0") || info.license.startsWith("Creative Commons 0 1.0") || info.license.startsWith("Creative Commons Zero 1.0")) {
          if (!info.licenseHref) {
            info.licenseHref = "https://creativecommons.org/publicdomain/zero/1.0/";
          }
          licenseShortStr = "CCO 1.0";
        }
        else if ((info.license == "Creative Commons 0") || (info.license == "Creative Commons Zero")) {
          licenseShortStr = "CCO";
        }
        else {
          console.log("Looking for license clauses in license name \""+licenseLower+"\"...");
          licenseShortStr = "CC ";
          if (licenseLower.includes("attribution")) {
            licenseShortStr += "BY";
          }
          if (licenseLower.includes("non-commercial") || licenseLower.includes("noncommercial") || licenseLower.includes("non commercial")) {
            licenseShortStr += "-NC";
          }
          if (licenseLower.includes("no derivatives") || licenseLower.includes("noderivs") || licenseLower.includes("no-derivatives") || licenseLower.includes("noderivatives")) {
            licenseShortStr += "-ND";
          }
          if (licenseLower.includes("sharealike") || licenseLower.includes("share-alike") || licenseLower.includes("share alike") ) {
            licenseShortStr += "-SA";
          }

          if (info.license.includes("1.0")) {
            licenseShortStr += " 1.0";
            versionIsFound = true;
          }
          else if (info.license.includes("2.0")) {
            licenseShortStr += " 2.0";
            versionIsFound = true;
          }
          else if (info.license.includes("3.0")) {
            licenseShortStr += " 3.0";
            versionIsFound = true;
          }
          else if (info.license.includes("4.0")) {
            licenseShortStr += " 4.0";
            versionIsFound = true;
          }
          else if (exactLicenseVersion !== null) {
            licenseShortStr += " " + exactLicenseVersion;
            versionIsFound = true;
          }
        }
      }
      console.log("licenseShortStr: " + licenseShortStr);
      if (!info.licenseHref) {
        var parts = licenseShortStr.split(" ");
        if (parts.length == 3) {
          var partialHref = null;
          // such as ["CC", "BY-SA", "3.0"]
          if (parts[1] == "BY") {
            partialHref = "http://creativecommons.org/licenses/by/";
          }
          else if (parts[1] == "BY-SA") {
            partialHref = "http://creativecommons.org/licenses/by-sa/";
          }
          else if (parts[1] == "BY-NC-SA") {
            partialHref = "http://creativecommons.org/licenses/by-nc-sa/";
          }
          else if (parts[1] == "BY-NC-ND") {
            partialHref = "http://creativecommons.org/licenses/by-nc-nd/";
          }
          // NOTE: by-nc-nd-sa is NOT a valid license
          if (partialHref != null) {
            info.licenseHref = partialHref + parts[2] + "/";
          }
        }
      }
    }
    else if (info.licenseHref) {
      if (!licenseShortStr) {
        if (verbose) {
          console.log("Generating short license name from URL instead of from clauses...");
        }
        for (var key in urlSmallNames) {
          // Check if the property/key is defined in the object itself, not in parent
          if (urlSmallNames.hasOwnProperty(key)) {
            if (info.licenseHref.includes(key)) {
              licenseShortStr = urlSmallNames[key];
              if (verbose) {
                console.log("- got \""+licenseShortStr+"\" from \""+key+"\"")
              }
              break;
            }
          }
        }
      }
      else {
        console.log("* using existing licenseShortStr \""+licenseShortStr+"\"");
      }

      if (!licenseShortStr) {
        console.warn("Warning: The URL \""+info.licenseHref+"\" is not recognized (No key in Thing Remix Attribution Maker's urlSmallNames is a partial of the URL), so the long license name could not be generated.");
      }
      else {
        info.shortLicense = licenseShortStr;
        if (!info.license) {
          if (verbose) {
            console.log("Generating long license name from URL instead of from clauses...");
          }
          if (bigNames.hasOwnProperty(licenseShortStr)) {
            // ^ The clauses are only in this order for versions above 1.0!
            info.license = bigNames[licenseShortStr];
            if (verbose) {
              console.log("- got \""+info.license+"\"");
            }
          }
          else {
            console.warn("Warning: The short license name \""+licenseShortStr+"\" is not recognized (It is not a key in Thing Remix Attribution Maker's bigNames), so the long license name could not be generated.");
          }
        }
      }
    }
    if (!info.license) {
      console.warn("The license abbreviation cannot be generated because no license text was generated (no license elements were detected).");
    }
    else if (!info.shortLicense) {
      console.warn("The license abbreviation cannot be generated for an unknown license: " + info.license);
    }
  }

  function setClipboardText(text, callbackBtn) {
    var msg = "(ERROR: Your browser API is unknown.)";
    if (callbackBtn == null) {
        msg = "Error: no callbackBtn";
        console.log(msg);
        return msg;
    }
    var okMsg = " &#10003;";
    // See https://stackoverflow.com/questions/52177405/clipboard-writetext-doesnt-work-on-mozilla-ie
    if (navigator.clipboard != undefined) { // Chrome
      navigator.clipboard.writeText(text).then(
        function () {
          console.log('Async: Copying to clipboard was successful!');
          callbackBtn.innerHTML += okMsg;
        }, function (err) {
          console.error('Async: Could not copy text: ', err);
          callbackBtn.innerHTML += '<br/> (ERROR: Accessing the clipboard failed.)';
        }
      );
      msg = null;
    }
    else if (window.clipboardData) { // Internet Explorer
      window.clipboardData.setData("Text", text);
      msg = okMsg;
    }
    if (msg != null) {
      callbackBtn.innerHTML += msg;
    }
  }

  function getButtonContainer() {
    // var pageInfoEs = document.getElementsByClassName("item-page-info");
    var pageInfoEs = getElementsWhereClassStartsWith(madeDivClassName);
    if (pageInfoEs.length < 1) {
      return null;
    }
    // There should only be one.
    return pageInfoEs[0];
  }

  function getInfo() {
    'use strict';
    var info = {};
    // There should only be one.
    // pageInfoE.innerHTML += "<button onclick=\"getRemixLicense()\">Copy Markdown</button>";
    // var licenseTextE = document.getElementsByClassName("license-text");
    // var licenseTextE = getDivsWhereClassStartsWith(clausesContainerPrefix);
    // var pageInfoEs = document.getElementsByClassName("item-page-info");
    // var pageInfoEs = getDivsWhereClassStartsWith(madeDivClassName);
    // console.log("Checking "+madeDivClassName+"* elements: " + JSON.stringify(pageInfoEs));
    var headingParts = getDivsWhereClassStartsWith(titlePrefix);
    var headingCreatedParts = getDivsWhereClassStartsWith(headingCreatedPrefix);
    if (headingParts.length > 0) {
      info.title = headingParts[0].textContent;
    }
    else {
      console.warn("The title is missing. There are no divs with a class starting with " + titlePrefix);
    }
    var createdStr = null;
    if (headingCreatedParts.length > 0) {
      createdStr = headingCreatedParts[0].textContent;
    }
    else {
      console.warn("The date is missing. There are no divs with a class starting with " + headingCreatedParts);
    }
    info.titleHref = window.location.href;
    // console.log("info.title: " + info.title);
    // console.log("info.titleHref: " + info.titleHref);
    console.log("createdStr: " + createdStr);
    if (createdStr !== null) {
      var createdParts = createdStr.split(" ");
      if (createdParts.length >= 3) {
        var yI = createdParts.length - 1;
        var dI = createdParts.length - 2;
        var mI = createdParts.length - 3;
        var yStr = createdParts[yI];
        var dStr = createdParts[dI];
        var mStr = createdParts[mI];
        if (dStr.endsWith(",")) {
          info.month = mStr;
          info.day = dStr.slice(0, -1);
          info.year = yStr;
        }
        else {
          console.warn("A date such as MON, D, YYYY was expected at the end of: \""+createdStr+"\"");
        }
      }
    }
    var aspects = [];
    aspects = getImgsWhereClassStartsWith(licenseClauseImgPrefix);
    var ai;
    if (aspects.length > 0) {
      info.license = "";
    }
    else {
      console.error("The license had zero clauses (img tags with "+licenseClauseImgPrefix+"* class)!")
    }
    var sep = " - ";
    for (ai = 0; ai < aspects.length; ai++) {
      var aspectImg = aspects[ai];
      if (aspectImg.src == undefined) {
        console.error("The license symbol src was undefined.");
      }
      else if (aspectImg.src == "") {
        console.error("The license symbol src was blank.");
      }
      else if (aspectImg.src.endsWith("cc.svg")) {
        info.license += "Creative Commons";
      }
      else if (aspectImg.src.endsWith("nc.svg")) {
        info.license += sep + "Non-Commercial";
      }
      else if (aspectImg.src.endsWith("nd.svg")) {
        info.license += sep + "No Derivatives";
      }
      else if (aspectImg.src.endsWith("by.svg")) {
        info.license += sep + "Attribution";
      }
      else if (aspectImg.src.endsWith("sa.svg")) {
        info.license += sep + "ShareAlike"; // It has a space on ThingiVerse, but that is not correct.
      }
      else if (aspectImg.src.endsWith("zero.svg")) {
         // It is preceded by by.svg on ThingiVerse, but that is not correct.
        info.license = "Creative Commons Zero";
      }
      else {
        console.error("The license symbol list has an unknown clause symbol: \"" + aspectImg.src + "\"");
      }
    }
    if (info.license != undefined) {
      if (info.license == "") {
        console.log("The symbols do not indicate a license (The site layout appears to be broken or changed so the license must be detected from the license URL if possible instead).");
      }
      else {
        console.log("The symbols indicate the following license: " + info.license);
      }
    }


    var licenseAnchors = getAnchorsWhereClassStartsWith(licenseAnchorPrefix);
    var exactLicenseVersion = null;
    if (licenseAnchors.length > 0) {
      console.log("Checking " + licenseAnchors.length + " license anchors...");
      for (var lai=0, max=licenseAnchors.length; lai < max; lai++) {
        var licenseA = licenseAnchors[lai];
        if (verbose) {
          console.log("  checking " + licenseA.className + "...");
        // NOTE: .getAttribute("href") gets the raw value, but .href gets the resulting full URL.
          console.log("  licenseA.href is a " + typeof licenseA.href);
          console.log("  licenseA.href.toString is a " + typeof licenseA.href.toString);
          console.log("  licenseA.href.toString().includes is a " + typeof licenseA.href.toString().includes);
        }
        if (licenseA.href === undefined) {
          console.warn("A license a.href is undefined.");
        }
        // else if (typeof licenseA.href.toString !== 'function') {
        //   console.warn("A license a.href.toString is not a function.");
        // }
        else if (typeof licenseA.href.includes !== 'function') {
          // NOTE: Firefox 48 removes the "contains" prototype--you must use includes!
          // console.warn("A license a.getAttribute(\"href\").includes is not a function.");
          console.warn("A license a.href.toString.includes is not a function.");
        }
        else if (!licenseA.href.includes("thingiverse.com")) {
          if (verbose) {
            console.log("licenseA.href: ");
            console.log("'",licenseA.href, "'");
          }
          info.licenseHref = licenseA.href;
          if (info.licenseHref.slice(-3, -2) == ".") {
            exactLicenseVersion = licenseA.href.slice(-4, -1);
          }
          else {
            console.warn("slice at -3 is not .: " + info.licenseHref.slice(-3, -2));
          }
        }
        else {
          info.author = licenseA.textContent;
          info.authorHref = licenseA.href;
          if (verbose) {
            console.log("unused[]: " + licenseA.href);
            console.log("author: " + info.author);
            console.log("authorHref: " + info.authorHref);
          }
        }
      }
    }
    else {
      console.warn("There is no anchor with a class like "+licenseAnchorPrefix+"*");
    }
    return info;
  }

  function addButton() {
    'use strict';
    // This should run when ThingPage_galleryHeader* gets filled in, but only once to prevent an infinite loop.
    // var pageInfoEs = document.getElementsByClassName("item-page-info");
    // NOTE: now ThingiVerse is a React app, so you must use inspect to see the HTML.
    // "ThingPage__madeBy*" includes parts such as:
    // - `ThingPage__modelName*`
    // - `<div class="ThingPage__createdBy*">by <a ...>UserName</a>MON D, YYYY`
    var pageInfoE = getButtonContainer();
    if (pageInfoE == null) {
      console.log('The '+madeSpanClassName+' class was not found so the button wasn\'t added!');
      return;
    }
    // pageInfoE.innerHTML += "<button onclick=\"getRemixLicense()\">Copy License for Remix</button>";
    //or:
    // See https://www.w3schools.com/jsref/met_document_createelement.asp
    var btn = document.createElement("BUTTON"); // Create a <button> element
    btn.setAttribute("class", "button button-secondary"); // as of 2023 button class names are obfuscated :(
    // btn.setAttribute("style", "background-color: rgb(50%, 50%, 50%)");
    var btnText = "Copy License for Remix";
    btn.innerHTML = btnText; // Insert text
    // Any URL starting with a slash comes after: "https://creativecommons.org/licenses"
    // otherwise it comes after "https://"
    // - A list of CC licenses is at <https://creativecommons.org/about/cclicenses/>.

    btn.addEventListener("click", function(){
      btn.innerHTML = btnText;
      var info = getInfo();
      populateCorrespondingLicenseFields(info);
      var markdownStr = getMarkdown(info);
      setClipboardText(markdownStr, btn);
    }); // end addEventListener click
    pageInfoE.appendChild(btn); // Append <button> for Markdown to whatever element was selected.
  }//end addButton
  function checkIfComplete() {
    // console.log("Monitoring page loading...");
    var missing_errors = "";
    var containers = getDivsWhereClassStartsWith(madeDivClassName);
    // console.log("Checking for completed page content...");
    if (containers.length == 1) {
      if (!elementHasAllPrefixes(containers[0], doneDivPrefixes)) {
        missing_errors += "containers[0].className " + containers[0].className + " with all of " + JSON.stringify(doneDivPrefixes) + ". ";
        if (verbose) {
          // console.log("The "+containers[0].className+" container is not complete:");
          // console.log("The document is not ready yet ("+containers[0].className+" does not contain the classes with the prefixes \""+JSON.stringify(doneDivPrefixes)+"\").");
        }
      }
    }
    else {
      missing_errors += "any container (required). ";
      // console.log("The page is not formatted as expected:");
      // console.log(containers.length + " is an unexpected count for divs with a class named like " + madeDivClassName + "*.");
    }
    if (!hasAllDivPrefixes(doneDivPrefixesMain)) {
      missing_errors += "hasAllDivPrefixes("+JSON.stringify(doneDivPrefixesMain)+"). ";
      // console.log("The document is not complete:");
      // console.log("The document is not ready yet (the document does not contain the class(es) with the prefix(es) \""+JSON.stringify(doneDivPrefixesMain)+"\").");
    }
    if (missing_errors.length == 0) {
      if (verbose) {
        console.log("The page has loaded.");
      }
      clearInterval(checkTimer);
      addButton();
      console.log("The license detection will resume after a user clicks the copy license button.");
    }
    else {
      console.log("The document is not ready (or is a new format). It is missing: "+missing_errors);
    }
  }
  checkTimer = setInterval(checkIfComplete, 2000);
})();
