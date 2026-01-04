// ==UserScript==
//
// @name           Imgur Direct
// @version        1.3
// @namespace      https://greasyfork.org/en/users/667743-catspinner
// @description    See Imgur images & videos directly.
// @icon           https://imgur.com/favicon.ico
// @license        MIT
//
//
// @include        /^https://imgur\.com/[a-zA-Z0-9]{5,8}$/
// @exclude        https://imgur.com/gallery
// @exclude        https://imgur.com/upload
//
// @run-at         document-start
//
// @downloadURL https://update.greasyfork.org/scripts/413400/Imgur%20Direct.user.js
// @updateURL https://update.greasyfork.org/scripts/413400/Imgur%20Direct.meta.js
// ==/UserScript==
//
/*=========================  Version History  ==================================

1.00    -    First public release.

1.1     -    Fixed Imgur's jpg/jpeg shenanigans.
             Shows images faster.
             Strict @include rule to define where script can run.

1.2     -    Fixed a typo in @include regex.

1.3     -    Just some meta changes.

==============================================================================*/


function runImgurDirect() {
  const imgname = location.href.replace('https://imgur.com/', 'https://i.imgur.com/'),
        imgname_jpeg = imgname + '.jpeg',
        imgname_jpg  = imgname + '.jpg',
        imgname_png  = imgname + '.png',
        imgname_gif  = imgname + '.gif',
        imgname_mp4  = imgname + '.mp4',
        imgname_gifv = imgname + '.gifv';

  const url = location.href;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'text';
  xhr.send();
  xhr.onload = function() {
    const page = xhr.response;
    var video = true;
    var trueimage = location.href;

    if (page.indexOf("og:video") == -1) {
      video = false;
    } if (page.indexOf(imgname_png) > -1) {
      trueimage = imgname_png;
    } else if (page.indexOf(imgname_jpeg) > -1) {
      trueimage = imgname_jpeg;
    } else if (page.indexOf(imgname_jpg) > -1) {
      trueimage = imgname_jpg;
    }

    if (video) {
      if (countOccurrence(page, imgname_gif) > 2) {
        trueimage = imgname_gif;
      } else if (countOccurrence(page, imgname_mp4) > 2) {
        trueimage = imgname_mp4;
      } else if (countOccurrence(page, imgname_gifv) > 2) {
        trueimage = imgname_gifv;
      }
    }

    if (url !== trueimage) {
      window.location.replace(trueimage);
    } else {
      return;
    }
  }
}

function countOccurrence(string, subString) {
  var n    = 0,
      pos  = 0,
      step = subString.length;

  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
        ++n;
        pos += step;
    } else break;
  }
  return n;
}

runImgurDirect();
