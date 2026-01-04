// ==UserScript==
// @name        MindGeekExposeBuriedVisuals
// @description Add trailer & loop URLs and screenshot linked thumbnails to mofos.com or other MindGeek-owned look-alike video pages
// @namespace   https://www.mofos.com/tired
// @match       *://www.mofos.com/scene/*
// @match       *://www.babes.com/scene/*
// @match       *://www.digitalplayground.com/scene/*
// @match       *://www.realitykings.com/scene/*
// @match       *://www.twistys.com/scene/*
// @match       *://www.dontbreakme.com/scene/*
// @match       *://www.iknowthatgirl.com/scene/*
// @match       *://www.letstryanal.com/scene/*
// @match       *://www.publicpickups.com/scene/*
// @exclude     /^https?://www\.bustedbabysitters\.com/.*$/
// @exclude     /^https?://www\.dronehunter\.com/.*$/
// @exclude     /^https?://www\.ebonysextapes\.com/.*$/
// @exclude     /^https?://www\.ingangwebang\.com/.*$/
// @exclude     /^https?://www\.girlsgonepink\.com/.*$/
// @exclude     /^https?://www\.latinasextapes\.com/.*$/
// @exclude     /^https?://www\.mofosbsides\.com/.*$/
// @exclude     /^https?://www\.mofoslab\.com/.*$/
// @exclude     /^https?://www\.mofosoldschool\.com/.*$/
// @exclude     /^https?://www\.mofosworldwide\.com/.*$/
// @exclude     /^https?://www\.pervsonpatrol\.com/.*$/
// @exclude     /^https?://www\.pornstarvote\.com/.*$/
// @exclude     /^https?://www\.projectrv\.com/.*$/
// @exclude     /^https?://www\.realslutparty\.com/.*$/
// @exclude     /^https?://www\.sharemybf\.com/.*$/
// @exclude     /^https?://www\.shesafreak\.com/.*$/
// @exclude     /^https?://www\.strandedteens\.com/.*$/
// @exclude     /^https?://www\.teensatwork\.com/.*$/
// @exclude     /^https?://www\.thesexscout\.com/.*$/
// @exclude     /^https?://www\.brazzers\.com/.*$/
// @grant       none
// @version     0.9.3
// @locale      English (en)
// @downloadURL https://update.greasyfork.org/scripts/388287/MindGeekExposeBuriedVisuals.user.js
// @updateURL https://update.greasyfork.org/scripts/388287/MindGeekExposeBuriedVisuals.meta.js
// ==/UserScript==
(function(){
  "use strict";

  let cleanedUrl = window.location.href.replace(/(#.*)$/, "");

  function injectFunc(fn) {
    let scriptElm = document.createElement("script");
    scriptElm.setAttribute("type", "application/javascript");
    scriptElm.textContent = "(" + fn + ")();";
    document.body.appendChild(scriptElm); // run the script
    document.body.removeChild(scriptElm); // clean up
  }

  function logWithName(msg) { console.log("MindGeekExposeBuriedVisuals: " + msg); }

  /// Have to use injected function in order to access the window.__JUAN.initialState variable.
  function injectedFunc() {
    function logWithName(msg) { console.log("MindGeekExposeBuriedVisuals (injected): " + msg); }

    let releaseID;
    try {
      releaseID = window.__JUAN.initialState["location"]["payload"]["releaseId"];
    }
    catch (e) {
      window.alert(
`Ooops. Couldn't determine releaseId?

Either refresh page until this alert doesn't appear or this userscript doesn't support this site.`);
    }

    let section = document.querySelector("section");


    function addStyle() {
      let head = document.head || document.querySelector("head");
      let style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.appendChild(document.createTextNode(
`.addedTrailersAndScreenshots { background: black; color: #66CC66; } /* bright green */
a.trailerURL, a.screenshotURL {text-decoration: none; color: rgb(204,204,255); }        
a:visited.trailerURL, a:visited.screenshotURL {text-decoration: none; color: red; }        
.addedScreenshots img {margin: 2px;}`));
      head.appendChild(style);
    }

    function addVideos (containerDiv, className, label, files) {
      let videoDiv = document.createElement("div");
      videoDiv.innerText = label;
      videoDiv.className = className;
      containerDiv.appendChild(videoDiv);
      if (files == null )
        return videoDiv;

      let resolutions = Object.keys(files);
      resolutions.sort((a,b) => {return files[a]["sizeBytes"] - files[b]["sizeBytes"]});

      function addTrailerLink(resolution, i, arr) {
        let trailerURL = files[resolution]["urls"]["view"];
        let link = document.createElement("a");
        link.innerHTML = resolution;
        link.href = trailerURL;
        link.className = "trailerURL";
        videoDiv.appendChild(link);
        if (i !== arr.length-1) { link.insertAdjacentText("afterend", ", "); }

        //logWithName(res,trailerURL);
      }

      resolutions.forEach (addTrailerLink);
      return videoDiv;
    }

    function addTrailers() {
      function findFiles() {
        try {
          let children = window.__JUAN.initialState["entities"]["releases"][releaseID]["children"];
          let child = children.find( (c) => { return c["type"] === "trailer"});
          return child["videos"]["full"]["files"]
          }
        catch(e) {
          logWithName ('window.__JUAN.initialState["entities"]["releases"][releaseID]["children"];' + ' or\n' +
            'child["videos"]["full"]["files"]' + ' failed.');
          return null; }
      }

      let files = findFiles();
      return addVideos(section, "addedTrailersAndScreenshots", "Trailer: ", files);
    }

    function addLoops(containerDiv) {
      let files;
      try {files = window.__JUAN.initialState["entities"]["releases"][releaseID]["videos"]["mediabook"]["files"] }
      catch(e) {
        logWithName ('window.__JUAN.initialState["entities"]["releases"][releaseID]["videos"]["mediabook"]["files"]' + ' failed.');
        files = null; }
      return addVideos (containerDiv, "addedLoops", "Loops: ", files);
    }

    function addScreenShotLinks() {
      let screenshotsDiv = document.createElement("div");
      screenshotsDiv.innerHTML = "Screens:<br>";
      screenshotsDiv.className = "addedScreenshots";
      let posterDicts;
      try {posterDicts = window.__JUAN.initialState["entities"]["releases"][releaseID]["images"]["poster"]; }
      catch(e) {
        logWithName('window.__JUAN.initialState["entities"]["releases"][releaseID]["images"]["poster"]' + ' failed.');
        posterDicts = null; }

      function addScreenshotLink(posterDict, i, arr) {
        let screenshotURL = posterDict["sm"]["url"];
        let link = document.createElement("a");
        link.innerText = i;
        link.href = screenshotURL;
        link.className = "screenshotURL";
        screenshotsDiv.appendChild(link);
        if (i !== arr.length-1) link.insertAdjacentText("afterend", ", ");
      }

      if (posterDicts != null) {
        posterDicts.forEach (addScreenshotLink);
      }
      section.appendChild(screenshotsDiv);
    }

    function addScreenShots(trailerDiv) {
      let screenshotsDiv = document.createElement("div");
      screenshotsDiv.innerHTML = "Screens:<br>";
      screenshotsDiv.className = "addedScreenshots";
      let posterDicts;
      try { posterDicts = window.__JUAN.initialState["entities"]["releases"][releaseID]["images"]["poster"];}
      catch (e) {
        logWithName('window.__JUAN.initialState["entities"]["releases"][releaseID]["images"]["poster"]' + ' failed.');
        posterDicts = null;}

      function appendScreenShot(thumbURL, screenShotURL) {
        let imageLink = document.createElement("a");
        imageLink.href = screenShotURL;

        let image = document.createElement("img");
        //image.alt = i;
        image.src = thumbURL;
        image.className = "screenshotIMG";
        imageLink.appendChild(image);
        screenshotsDiv.appendChild(imageLink);
      }

      function addScreenShot(posterDict) {
        if (posterDict == null)
          return;

        let thumbURL = posterDict["xs"]["url"];
        let screenShotURL = posterDict["xx"]["url"];
        appendScreenShot(thumbURL, screenShotURL);
      }

      function bumpURL(lastURL) {
        let trailingNumberRE = /(\d+)\.jpg$/;
        let matches = lastURL.match(trailingNumberRE);
        let lastMatch = matches[matches.length-1];
        let width = lastMatch.length;
        let n = parseInt(lastMatch) + 1;
        let nStr = n.toString();
        let nextNumber = (nStr.length >= width) ? nStr : "0".repeat(width-nStr.length) + nStr + ".jpg";
        return lastURL.replace(trailingNumberRE, nextNumber);
      }

      if (posterDicts != null) {
        posterDicts.forEach(addScreenShot);
        // Add 1 more screenshot that happens to also exist
        let lastDict = posterDicts[posterDicts.length-1];
        let nextThumbURL      = bumpURL(lastDict["xs"]["url"]);
        let nextScreenShotURL = bumpURL(lastDict["xx"]["url"]);
        appendScreenShot(nextThumbURL, nextScreenShotURL);
      }

      trailerDiv.appendChild(screenshotsDiv);
    }

    logWithName("Injected function running");
    addStyle();
    let containerDiv = addTrailers();
    addLoops(containerDiv);
    addScreenShots(containerDiv);
  }

/*
  function doIt() {
    let releaseID = unsafeWindow.__JUAN.initialState['location']['payload']['releaseId'];
    let files = unsafeWindow.__JUAN.initialState['entities']['releases'][releaseID]['children'][1]['videos']['full']['files'];
    for (let res in files) {
      logWithName(res,files[res]['urls']['view']);
    }
  }
*/

  function onLoadHandler() {
    logWithName("Load event occurred:", cleanedUrl);
    // doIt();   Didn"t work, need to inject function instead.
    //let section = document.querySelector("section");
    //logWithName("section: "+section);
    //function delayedInjection() {injectFunc(injectedFunc);}
    //setTimeout (delayedInjection, 6000);
    //injectFunc(injectedFunc);

    let counter = 0;
    (function init(){
      let testElm = document.querySelector('section');
      if (testElm)
        { injectFunc(injectedFunc); }
      else
        {
          counter += 1;
          if (counter < 10)
            setTimeout(init, 1000);
          else
          {
            logWithName("Couldn't find <section>, aborting.")
          }
        }
      })();
  }

  logWithName("UserScript running");
  window.addEventListener("load", onLoadHandler, false);
})();