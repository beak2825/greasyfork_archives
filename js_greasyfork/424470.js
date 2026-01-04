// ==UserScript==
// @name        SSS-Class Suicide Hunter Wife/Husband Switch
// @namespace   Violentmonkey Scripts
// @match       https://woopread.com/series/sss-class-suicide-hunter/chapter-*/
// @grant       none
// @version     1.0
// @author      Pipman3000
// @run-at      document-idle
// @description Switches the husband/wife terms used in the novel.
// @downloadURL https://update.greasyfork.org/scripts/424470/SSS-Class%20Suicide%20Hunter%20WifeHusband%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/424470/SSS-Class%20Suicide%20Hunter%20WifeHusband%20Switch.meta.js
// ==/UserScript==
var divs = document.getElementsByClassName("reading-content");
if(divs.length === 1)
{
  var div = divs[0];
  if(div)
  {
    var chap = div.outerHTML.match(/Chapter ([0-9]+)\./i);
    if(chap && chap[1] < 111)
      return;
    div.outerHTML = div.outerHTML.replace(/husband|wife/gi, function(match)
    {
      if (match === "husband")
        return "wife";
      else if (match === "wife")
        return "husband";
      else if (match === "Husband")
        return "Wife";
      else if (match === "Wife")
        return "Husband";
      return match;
    });
  }
}