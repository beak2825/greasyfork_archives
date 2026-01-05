// ==UserScript==
// @name        CaseMon Gallery
// @namespace   dodintso@cisco.com
// @include     https://*/apex/XRightPane*
// @version     1.4.1
// @author      Denis Odintsov - dodintso@cisco.com
// @grant       none
// @description CaseMon Gallery to show all the case pictures in one ribbon
// @downloadURL https://update.greasyfork.org/scripts/4925/CaseMon%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/4925/CaseMon%20Gallery.meta.js
// ==/UserScript==

var script_version = '1.4.1';

console.log('OverSun Casemon Gallery ' + script_version + ' started');

var script = document.createElement('script');
script.innerHTML = ' \
function galleryJunkImage(fileId) { \
  for (var i = 0 ; i < window.top.frames.length ; i++) { \
   try { \
    var href = window.top.frames[i].location.href; \
   } catch(e) { if (e.toString().toLowerCase().indexOf("denied") !== -1 || e.toString().toLowerCase().indexOf("blocked") !== -1) { continue; } else { throw e; } } \
   var frame = window.top.frames[i]; \
   if (frame.location.href.match(/\\/apex\\/xmainpane/gi) != null) { \
    var tags = frame.document.getElementsByClassName("tag_checkbox"); \
    for (var j = 0; j < tags.length; j++) { \
     if (tags[j].getAttribute("fileid") == fileId && tags[j].getAttribute("value") == "j") { \
      tags[j].click(); \
      document.getElementById("galleryImage_"+fileId).style.display = "none"; \
     } \
    } \
   } \
  } \
} \
function galleryOpen() { \
  var galleryFrame = document.getElementById(\'galleryInnerFrame\'); \
  galleryFrame.innerHTML = ""; \
  var images = document.getElementsByClassName(\'download\'); \
  for (var i = 0; i < images.length; i++) { \
   if (images[i].parentNode.parentNode.style.display != "none" && images[i].href.match(/^.*\\.(jpg|png|gif)$/gi) != null) { \
    var fileId = images[i].parentNode.parentNode.className.match(/\\d+/); \
    var fileName = images[i].href.match(/^.+&fileName=(.+)&*$/i); \
    var imageNameRegex = fileName[1].match(/(\\d{4})(\\d{2})(\\d{2})-(\\d{2})(\\d{2})(\\d{2})_(.+)/); \
    var imageName = fileName[1]; \
    if (imageNameRegex != null) { imageName = imageNameRegex[1]+"-"+imageNameRegex[2]+"-"+imageNameRegex[3]+" "+imageNameRegex[4]+":"+imageNameRegex[5]+" "+imageNameRegex[7]; } \
    var image = document.createElement("div"); \
    image.className = "casemonGalleryImage"; \
    image.id = "galleryImage_"+fileId; \
    image.onclick = function(event) { event.stopPropagation(); };\
    image.innerHTML = "<a href=\\""+images[i].href+"&forceText=1\\" target=\\"_blank\\"><img src=\\""+images[i].href+"&forceText=1\\" class=\\"galleryImage\\" /></a><br /><a href=\\"\\" onclick=\\"galleryJunkImage("+fileId+"); return false;\\">junk</a> "+imageName; \
    galleryFrame.appendChild(image); \
   } \
  } \
  window.location=\'#galleryOverlay\'; \
}';
var style = document.createElement('style');
style.innerHTML = "#galleryOverlay { \
  width: 100%; \
  height: 100%; \
  position: fixed; \
  background: rgba(0,0,0,.7); \
  top: 0; \
  left: 0; \
  z-index: 9998; \
  visibility: hidden; \
} \
#galleryOverlay:target { \
  visibility: visible; \
} \
.galleryWindow { \
  width: 86%; \
  height: 90%; \
  background: #fff; \
  border-radius: 10px; \
  position: relative; \
  padding: 10px; \
  box-shadow: 0 0 5px rgba(0,0,0,.4); \
  text-align: center; \
  margin: 5% auto; \
  z-index: 9999; \
} \
.galleryInnerFrame { \
  overflow-y: scroll; \
  width: 100%; \
  height: 97%; \
} \
.casemonGalleryImage {\
  border-radius: 5px; \
  background: #eee; \
  padding: 5px; \
  margin: 0px 0px 5px 0px; \
} \
img.galleryImage { \
  max-width: 100% \
}";
document.body.insertBefore(script, document.body.childNodes[0]);
document.body.insertBefore(style, document.body.childNodes[0]);

var element = document.getElementById('XRelatedData');
var child = document.createElement('div');
child.innerHTML = '<a href="javascript: galleryOpen();">Gallery</a> \
<div id="galleryOverlay" onclick="window.location=\'#\'"> \
  <div id="galleryFrame" class="galleryWindow"> \
   <div id="galleryInnerFrame" class="galleryInnerFrame"></div> \
   </br><div align="right" style="color: #BBBBBB; font-size: 70%;">dodintso@cisco.com</div> \
  </div> \
</div>';
element.parentNode.insertBefore(child, element);
