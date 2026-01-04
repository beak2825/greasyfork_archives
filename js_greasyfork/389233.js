// ==UserScript==
// @name        TeamSkeetShowScreenshots
// @description Add trailer & loop URLs and screenshot linked thumbnails to mofos.com or other MindGeek-owned look-alike video pages
// @namespace   https://www.teamskeet.com/tired
// @match       *://www.teamskeet.com/t1/trailer/view/*
// @grant       none
// @version     0.9.1
// @locale      English (en)
// @downloadURL https://update.greasyfork.org/scripts/389233/TeamSkeetShowScreenshots.user.js
// @updateURL https://update.greasyfork.org/scripts/389233/TeamSkeetShowScreenshots.meta.js
// ==/UserScript==
(function(){
  "use strict";

  let cleanedUrl = window.location.href.replace(/([#?].*)$/, "");

  function injectFunc(fn) {
    let scriptElm = document.createElement("script");
    scriptElm.setAttribute("type", "application/javascript");
    scriptElm.textContent = "(" + fn + ")();";
    document.body.appendChild(scriptElm); // run the script
    document.body.removeChild(scriptElm); // clean up
  }

  function logWithName(msg) { console.log("TeamSkeetShowScreenshots: " + msg); }

  /// Have to use injected function in order to access the window.__JUAN.initialState variable.
  function injectedFunc() {
    function logWithName(msg) { console.log("TeamSkeetShowScreenshots (injected): " + msg); }

    let section = document.querySelector("div#story-and-tags");

    function addStyle() {
      let body = document.body || document.querySelector("body");
      let style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.appendChild(document.createTextNode(
`.addedScreenshots 
{ background: black; 
 color: #66CC66; /* bright green */
 clear:left;
 text-align:left;
}
a.trailerURL, a.screenshotURL {text-decoration: none; color: rgb(204,204,255); }        
a:visited.trailerURL, a:visited.screenshotURL {text-decoration: none; color: red; }        
.addedScreenshots img {margin: 2px;}`));
      body.appendChild(style);
    }

    function addScreenShots(sectionDiv) {
      let screenshotsDiv = document.createElement("div");
      screenshotsDiv.innerHTML = "Screens:<br>";
      screenshotsDiv.className = "addedScreenshots";

      function appendScreenShot(thumbURL) {
        let image = document.createElement("img");
        //image.alt = i;
        image.src = thumbURL;
        image.className = "screenshotIMG";
        screenshotsDiv.appendChild(image);
      }

      // https://www.teamskeet.com/t1/trailer/view/lesbian_love_lessons/evelin_stone_and_zoey_taylor?type=low_res&trailer=a
      // https://www.teamskeet.com/t1/profile/view/141952/evelin_stone_and_zoey_taylor/
      // https://images.psmcdn.net/teamskeet/dyk/evelin_stone_and_zoey_taylor/shared/new/main_girls.jpg
      // https://images.psmcdn.net/teamskeet/dyk/evelin_stone_and_zoey_taylor/shared/main_girls.jpg smaller
      let starElem = document.querySelector("ul#star-list li");
      if (starElem != null) {
        // alreadyVoted(1,56032,'dyk')"
        let onClickStr = starElem.attributes["onclick"].value;
        let matches = /'([^']+)'\)$/.exec(onClickStr);
        let siteAbbrev = matches.pop();

        let cleanedUrl = window.location.href.replace(/([#?].*)$/, "");
        let parts = cleanedUrl.split("/");
        let model = parts.pop();

        let profileImageUrl = `https://images.psmcdn.net/teamskeet/${siteAbbrev}/${model}/shared/main_girls.jpg`;
        appendScreenShot(profileImageUrl)
      }

      let videoElm = document.querySelector("video#main-movie-player");
      // https://images.psmcdn.net/teamskeet/sss/allie_nicole_and_athena_faris/shared/low.jpg
      let videoPosterUrl = videoElm.attributes["poster"].value;
      // https://images.psmcdn.net/teamskeet/sss/allie_nicole_and_athena_faris/shared/scenes/new/01.jpg
      // https://images.psmcdn.net/teamskeet/sss/allie_nicole_and_athena_faris/shared/scenes/new/05.jpg
      // https://images.psmcdn.net/teamskeet/sss/allie_nicole_and_athena_faris/shared/scenes/01.jpg smaller
      // https://images.psmcdn.net/teamskeet/sss/allie_nicole_and_athena_faris/shared/scenes/05.jpg

      if (videoPosterUrl != null) {
        logWithName("videoPosterUrl: " + videoPosterUrl);
        let parts = videoPosterUrl.split("/");
        parts.pop();
        let baseUrl = parts.join("/");
        for (let i = 1; i <= 5; i++) {
          let iStr = i.toFixed().padStart(2, "0");
          let screenShotUrl = `${baseUrl}/scenes/${iStr}.jpg`;
          appendScreenShot(screenShotUrl);
        }
      }

      sectionDiv.appendChild(screenshotsDiv);
    }

    logWithName("Injected function running");
    addStyle();
    addScreenShots(section);
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
    injectFunc(injectedFunc);
  }

  logWithName("UserScript running");
  window.addEventListener("load", onLoadHandler, false);
})();