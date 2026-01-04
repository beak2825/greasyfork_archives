// ==UserScript==
// @description 研思院专用
// @name        Modify Request
// @namespace   YourNamespace
// @include     https://channels.weixin.qq.com/*
// @version     1
// @grant       unsafeWindow
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/475777/Modify%20Request.user.js
// @updateURL https://update.greasyfork.org/scripts/475777/Modify%20Request.meta.js
// ==/UserScript==

let open = unsafeWindow.XMLHttpRequest.prototype.open;
let send = unsafeWindow.XMLHttpRequest.prototype.send;

unsafeWindow.XMLHttpRequest.prototype.open = function() {
    this._url = arguments[1];
    open.apply(this, arguments);
};

unsafeWindow.XMLHttpRequest.prototype.send = function() {
    if (this._url === '/cgi-bin/mmfinderassistant-bin/post/post_draft') {
        let data = JSON.parse(arguments[0]);
        if (data.postReq && data.postReq.objectDesc && data.postReq.objectDesc.media && data.postReq.objectDesc.media[0]) {
            data.postReq.objectDesc.media[0].url = 'https://finder.video.qq.com/251/20302/stodownload?encfilekey=Cvvj5Ix3eewK0tHtibORqcsqchXNh0Gf3sJcaYqC2rQAdalW8LSbBSMkp84IZiconZ0TY1uryUViaD2U3uMaYQdeiaeZvIr05URf0f8kOYZTIBe5e7AwsNEzIEbg5asiaia1RG&token=Cvvj5Ix3eezqxdzOWuG5s1DTlnEm0jCh7ZDicIlrZobYqj5aWGib8PlCO4T3AOVQvCibIWQKhZicudyqvo3pHpS4x1JdJW8TM3Me1licP0ySWg2V5URVRyL5G0XEjFbbkupq2r3T148K0TdYIZzkjD6xVasvH77Ih6bZ5UGmxkC4AOh5TY7uvyNkh6A&idx=1&X-snsvideoflag=V1&adaptivelytrans=0&bizid=1023&dotrans=3071&hy=SH&m=&web=1';
            arguments[0] = JSON.stringify(data);
        }
    }
    send.apply(this, arguments);
};