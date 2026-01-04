// ==UserScript==
// @name         Twitter引用RTを見る裏技
// @namespace    https://twitter.com/yosshi9990
// @version      0.32
// @description  引用リツイートやいいねした人が見れる
// @author       元祖のヨッシー
// @match        http*://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @compatible firefox
// @compatible chrome
// @compatible edge
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/475108/Twitter%E5%BC%95%E7%94%A8RT%E3%82%92%E8%A6%8B%E3%82%8B%E8%A3%8F%E6%8A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/475108/Twitter%E5%BC%95%E7%94%A8RT%E3%82%92%E8%A6%8B%E3%82%8B%E8%A3%8F%E6%8A%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.setInterval(function(){
    let iiii = document.createElement('xaatwitternokotone');iiii.innerHTML = '<div role="group" class="css-1dbjc4n r-18u37iz r-1w6e6rj"><div role="separator" class="css-1dbjc4n r-1dgieki r-1efd50x r-5kkj8d r-109y4c4 r-13qz1uu"></div><div class="css-1dbjc4n r-1mf7evn r-1yzf0co"><a href="" dir="ltr" role="link" class="css-4rbku5 css-18t94o4 css-901oao r-18jsvk2 r-1loqt21 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"><div class="css-1dbjc4n r-xoduu5 r-1udh08x"><span data-testid="app-text-transition-container" style="transition-property:transform;transition-duration:0.3s;transform:translate3d(0, 0, 0)"><span class="css-901oao css-16my406 r-poiln3 r-1b43r93 r-b88u0q r-1cwl3u0 r-bcqeeo r-qvutc0"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"></span></span></span></div> <span class="css-901oao css-16my406 r-poiln3 r-1b43r93 r-1cwl3u0 r-bcqeeo r-qvutc0" style="color:rgba(83,100,113,1.00)"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">リツイート</span></span></a></div><div class="css-1dbjc4n r-1mf7evn r-1yzf0co"><a href="" dir="ltr" role="link" class="css-4rbku5 css-18t94o4 css-901oao r-18jsvk2 r-1loqt21 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"><div class="css-1dbjc4n r-xoduu5 r-1udh08x"><span data-testid="app-text-transition-container" style="transition-property:transform;transition-duration:0.3s;transform:translate3d(0, 0, 0)"><span class="css-901oao css-16my406 r-poiln3 r-1b43r93 r-b88u0q r-1cwl3u0 r-bcqeeo r-qvutc0"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"></span></span></span></div> <span class="css-901oao css-16my406 r-poiln3 r-1b43r93 r-1cwl3u0 r-bcqeeo r-qvutc0" style="color:rgba(83,100,113,1.00)"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">引用リツイート</span></span></a></div><div class="css-1dbjc4n r-1mf7evn r-1yzf0co"><a href="" dir="ltr" role="link" class="css-4rbku5 css-18t94o4 css-901oao r-18jsvk2 r-1loqt21 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"><div class="css-1dbjc4n r-xoduu5 r-1udh08x"><span data-testid="app-text-transition-container" style="transition-property:transform;transition-duration:0.3s;transform:translate3d(0, 0, 0)"><span class="css-901oao css-16my406 r-poiln3 r-1b43r93 r-b88u0q r-1cwl3u0 r-bcqeeo r-qvutc0"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"></span></span></span></div> <span class="css-901oao css-16my406 r-poiln3 r-1b43r93 r-1cwl3u0 r-bcqeeo r-qvutc0" style="color:rgba(83,100,113,1.00)"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">いいね</span></span></a></div><div class="css-1dbjc4n r-1mf7evn r-1yzf0co"><div dir="ltr" class="css-901oao r-18jsvk2 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"><div class="css-1dbjc4n r-xoduu5 r-1udh08x"><span data-testid="app-text-transition-container" style="transition-property:transform;transition-duration:0.3s;transform:translate3d(0, 0, 0)"><span class="css-901oao css-16my406 r-poiln3 r-1b43r93 r-b88u0q r-1cwl3u0 r-bcqeeo r-qvutc0"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"></span></span></span></div> <span class="css-901oao css-16my406 r-poiln3 r-1b43r93 r-1cwl3u0 r-bcqeeo r-qvutc0" style="color:rgba(83,100,113,1.00)"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">ブックマーク</span></span></div></div></div>';
    if(!document.querySelector('xaatwitternokotone')){
        document.getElementsByClassName('css-1dbjc4n r-1oszu61 r-18u37iz r-h3s6tt r-1wtj0ep r-3qxfft r-s1qlax')[0].before(iiii);
        document.getElementsByClassName("css-4rbku5 css-18t94o4 css-901oao r-18jsvk2 r-1loqt21 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0")[2].href=location.href+"/likes";
        document.getElementsByClassName("css-4rbku5 css-18t94o4 css-901oao r-18jsvk2 r-1loqt21 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0")[1].href=location.href+"/quotes";
        document.getElementsByClassName("css-4rbku5 css-18t94o4 css-901oao r-18jsvk2 r-1loqt21 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0")[0].href=location.href+"/retweets";

    }
}, 100);
})();