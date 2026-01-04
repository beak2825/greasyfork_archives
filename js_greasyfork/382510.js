// ==UserScript==
// @name        PTP Replace Torrent Icons (Firefox)
// @namespace   https://passthepopcorn.me/user.php?id=121003
// @description Replaces unicode check mark chars with images.
// @include     https://passthepopcorn.me/torrents.php*
// @include     https://passthepopcorn.me/artist.php*
// @include     https://passthepopcorn.me/collages.php*
// @include     https://passthepopcorn.me/bookmarks.php*
// @exclude     /^https://passthepopcorn.me/torrents.php?.*\bid=.*$/
// @version     1.2
// @run-at      document-start
// @grant       none
// @icon        https://ptpimg.me/732co1.png
// @downloadURL https://update.greasyfork.org/scripts/382510/PTP%20Replace%20Torrent%20Icons%20%28Firefox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/382510/PTP%20Replace%20Torrent%20Icons%20%28Firefox%29.meta.js
// ==/UserScript==


window.addEventListener('beforescriptexecute', scriptHook);

var stringsMap = {
  '&#9744;': '<img src=\'/static/common/x.png\'>',
  '&#9745;': '<img src=\'/static/common/check.png\'>',
  '&#10047;': '<img src=\'/static/common/quality.gif\'>'
},
regex = new RegExp(Object.keys(stringsMap).join('|'), 'gi'),
scriptMarkers = [
  'PtpGlobalData',
  'coverViewJsonData',
  'ungroupedCoverViewJsonData'
];

function replaceUnicodeWithImages(text)
{
  return text.replace(regex, function (match) {
    return stringsMap[match];
  });
}

function scriptHook(event)
{
  var originalScript = event.target;
  if (originalScript.src !== '')
  {
    return;
  } 
  else
  {
    if (new RegExp(scriptMarkers.join('|')).test(originalScript.innerHTML))
    {
      //prevent execution of the original script
      event.preventDefault();
      //remove hook
      window.removeEventListener('beforescriptexecute', scriptHook);
      
      var replacementScript = document.createElement('script');
      replacementScript.innerHTML = replaceUnicodeWithImages(originalScript.innerHTML);
      originalScript.parentNode.replaceChild(replacementScript, originalScript);
    }
  }
}
