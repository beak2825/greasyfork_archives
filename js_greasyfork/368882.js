// ==UserScript==
// @name 	Theme&Sticker Downloader
// @description スタンプとテーマを取得
// @author 	@Hozuki_Aoi
// @namespace 	https://twitter.com/Hozuki_Aoi
// @version 	1.0
// @match 	https://store.line.me/*

// @icon 	https://pbs.twimg.com/profile_images/789285418722217985/aMIeJGk-_400x400.jpg
// @grant 	none
// @downloadURL https://update.greasyfork.org/scripts/368882/ThemeSticker%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/368882/ThemeSticker%20Downloader.meta.js
// ==/UserScript==

  if (location.href.indexOf("https://store.line.me/themeshop/product/") >= 0) {
(function() {
    var head = document.head;
    var pattern = 'https://shop.line-scdn.net/themeshop/v1/products/';
    var begin = head.innerHTML.indexOf(pattern);
    var baseUrl;
    if(begin !== -1){
        baseUrl = head.innerHTML.substr(begin, 97);
    }
    var ul = document.evaluate('/html/body/div[1]/div/div[2]/section/div[1]/div[1]/div[2]/ul', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    var mdCMN08Ul;
    var li = document.createElement('li');
    if(ul.snapshotLength) {
        mdCMN08Ul = document.getElementsByClassName('mdCMN08Ul');
        li.innerHTML = '<li class="mdCMN08Li"><a class="MdBtn01 mdBtn02" href="' + baseUrl + '/ANDROID/theme.zip"><span class="mdBtn01Inner"><span class="mdBtn01Txt">ダウンロードする</span></span></a></li>';
        mdCMN08Ul[0].insertBefore(li, mdCMN08Ul[0].firstChild);
    }
})();
  }

  if (location.href.indexOf("https://store.line.me/stickershop/product/") >= 0) {
(function() {
    var href = window.location.href;
    var ul = document.evaluate('/html/body/div[1]/div/div[2]/section/div[1]/div[1]/div[2]/ul', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    var span = document.evaluate('/html/body/div[1]/div/div[2]/section/div[1]/div[1]/div[1]/span', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    var mdCMN08Ul;
    var li = document.createElement('li');
    if(ul.snapshotLength) {
        mdCMN08Ul = document.getElementsByClassName('mdCMN08Ul');
        if (span.snapshotLength) {
            li.innerHTML = '<li class="mdCMN08Li"><a class="MdBtn01 mdBtn02" href="http://dl.stickershop.line.naver.jp/products/0/0/1/' + eventValue + '/iphone/stickerpack@2x.zip"><span class="mdBtn01Inner"><span class="mdBtn01Txt">ダウンロードする</span></span></a></li>';
        } else {
            li.innerHTML = '<li class="mdCMN08Li"><a class="MdBtn01 mdBtn02" href="http://dl.stickershop.line.naver.jp/products/0/0/1/' + eventValue + '/iphone/stickers@2x.zip"><span class="mdBtn01Inner"><span class="mdBtn01Txt">ダウンロードする</span></span></a></li>';
        }
        mdCMN08Ul[0].insertBefore(li, mdCMN08Ul[0].firstChild);
    }
})();
  }