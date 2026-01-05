// ==UserScript==
// @name         hls.user.js
// @name:zh-CN   hls.user.js
// @namespace    hls.js
// @version      0.2.4
// @description  m3u8 playback using HTML5 video and MediaSource Extensions (CORS Required!)
// @description:zh-cn 基于HTML5和MediaSource Extensions的hls/m3u8播放
// @include      https://*
// @include      http://*
// @exclude      http://218.94.1.182:8080/*
// @exclude      http://www.itslaw.com/*
// @exclude      https://www.itslaw.com/*
// @exclude      http://www.epox.cn/*
// @exclude      https://cn.nytimes.com/*
// @grant        none
// @license      MIT
// @require      https://cdn.jsdelivr.net/hls.js/latest/hls.min.js
// @downloadURL https://update.greasyfork.org/scripts/26981/hlsuserjs.user.js
// @updateURL https://update.greasyfork.org/scripts/26981/hlsuserjs.meta.js
// ==/UserScript==
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var makehls = function makehls(element) {
    'use strict';

    if (!(element && element.tagName.toLowerCase() === 'video')) return false;
    var src = element.currentSrc || element.src;
    if (!(src && src.match('m3u8'))) return false;
    //if(!(element.error&&element.error.code==4)) return;
    var hls = new Hls();
    hls.attachMedia(element);
    hls.on(Hls.Events.MEDIA_ATTACHED, function (e) {
        return hls.loadSource(src);
    });
    return hls;
};
(function () {
    'use strict';
    //console.log([...document.getElementsByTagName('video')].map(makehls));

    [].concat(_toConsumableArray(document.getElementsByTagName('video'))).map(makehls);
    var observerFn = function observerFn(mutationRecord) {
        if (mutationRecord.type === 'childList' && mutationRecord.target && typeof getElementsByTagName === 'function') return [].concat(_toConsumableArray(mutationRecord.target.getElementsByTagName('video'))).map(makehls);
        return makehls(mutationRecord.target);
    };
    var mutationObserver = new MutationObserver(function (mutations) {
        return mutations.map(observerFn);
    });
    mutationObserver.observe(document, {
        childList: true,
        attributes: true,
        subtree: true,
        attributeFilter: ['src']
    });
})();