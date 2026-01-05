// ==UserScript==
// @name           ModelPress high resolution image extract
// @description    for mdpr.jp
// @match *://mdpr.jp/*
// @version 0.0.1.20200316110038
// @namespace https://greasyfork.org/users/3920
// @downloadURL https://update.greasyfork.org/scripts/23851/ModelPress%20high%20resolution%20image%20extract.user.js
// @updateURL https://update.greasyfork.org/scripts/23851/ModelPress%20high%20resolution%20image%20extract.meta.js
// ==/UserScript==

(function()
{
var imgList = new Array();

parsePhotoWeb = function(src) {
//  var pattern = /class="topic-photo-w100"(.|\s)+?data-src="(.+?)"(.|\s)+?data-photo-url="(.+?)"/g;
//  var reg = /class="topic-photo-w100"(.|\s)+?data-src="(.+?)"(.|\s)+?data-photo-url="(.+?)"/;
// 20161207 : change
  var pattern = /background-image:url\((.+?)\)|data-bg="(.+?)"/gm;
  var reg = /background-image:url\((.+?)\)|data-bg="(.+?)"/;
  var matchArray;
  var addRequest = "";

  while ((matchArray = pattern.exec(src)) !== null) {
//    var matchResult = matchArray[0];
//    var result = matchResult.match(reg);
    var index = (matchArray[1] === undefined ? matchArray[2] === undefined ? 0 : 2 : 1 );
    if(index > 0)
        imgList.push(/*"http://mdpr.jp" + */matchArray[index]);
//    if (addRequest === "")
//      addRequest = result[4];
  }
  return addRequest;
};

addResultFrame = function(addList) {
  var frameDom = document.createElement('div');
  frameDom.style.cssText = [
    'background:rgba(0, 0, 0, 0.5);',
    'padding:10px;',
    'position:absolute;',
    'z-index:1001;',
    'width:100%;',
    'height:100%;',
    'overflow-y:auto;',
    'top:0px;',
    'left:0px;',
  ].join(' ');
  frameDom.innerHTML = "";
  for (var i = 0; i < addList.length; ++i) {
    frameDom.innerHTML += '<a href="' + addList[i] + '" target="_blank"><img src="' + addList[i] + '" style="height:300px; margin:10px;"></a>';
  }
  document.body.appendChild(frameDom);
};

requestScrap = function(url) {
  $.ajax({
    type: "GET",
    url: url,
    contentType: 'text/html',
    dataType: "html",
    success: function(response) {
      parsePhotoWeb(response);
      var unique = imgList.filter(function(itm, i, a) {
        return i == a.indexOf(itm);
      });
      addResultFrame(unique);
    },
    error: function(xhr, status, error) {
      alert("error");
    }
  });
};

var add = parsePhotoWeb(document.body.innerHTML);
//requestScrap("http://mdpr.jp/" + add);
addResultFrame(imgList);
})();