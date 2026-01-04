// ==UserScript==
// @name          apk.tw Auto Check-in BETA
// @description	  Android台灣中文網自動簽到 BETA
// @author        no
// @icon          https://img2.apk.tw/pureing/alterimages/logo.png
// @version       20171212
// @include       https://apk.tw/forum.php
// @grant unsafeWindow
// @grant randomizator
// @namespace https://greasyfork.org/users/161910
// @downloadURL https://update.greasyfork.org/scripts/36287/apktw%20Auto%20Check-in%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/36287/apktw%20Auto%20Check-in%20BETA.meta.js
// ==/UserScript==

//Hidden Alert
unsafeWindow.alert = function alert(message) {
    console.log('Hidden Alert ' + message);
};

(function() {
ajaxget('plugin.php?id=dsu_amupper:pper&ajax=1&formhash=8f57ff22&zjtesttimes=1513011147', 'my_amupper', 'my_amupper', '簽到中', '', function() {
    toneplayer(0);
  });
console.log('Clicked');
})();