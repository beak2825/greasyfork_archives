// ==UserScript==
// @name                免登陆看知乎、专栏
// @description         Read without Login

// @author              GallenHu
// @namespace           https://hgl2.com
// @license             MIT
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggEBCQHM3fXsAAAAVdJREFUOMudkz2qwkAUhc/goBaGJBgUtBCZyj0ILkpwAW7Bws4yO3AHLiCtEFD8KVREkoiFxZzX5A2KGfN4F04zMN+ce+5c4LMUgDmANYBnrnV+plBSi+FwyHq9TgA2LQpvCiEiABwMBtzv95RSfoNEHy8DYBzHrNVqVEr9BWKcqNFoxF6vx3a7zc1mYyC73a4MogBg7vs+z+czO50OW60Wt9stK5UKp9Mpj8cjq9WqDTBHnjAdxzGQZrPJw+HA31oulzbAWgLoA0CWZVBKIY5jzGYzdLtdE9DlcrFNrY98zobqOA6TJKHW2jg4nU5sNBpFDp6mhVe5rsvVasUwDHm9Xqm15u12o+/7Hy0gD8KatOd5vN/v1FozTVN6nkchxFuI6hsAAIMg4OPxMJCXdtTbR7JJCMEgCJhlGUlyPB4XfumozInrupxMJpRSRtZlKoNYl+m/6/wDuWAjtPfsQuwAAAAASUVORK5CYII=

// @grant               none
// @run-at              document-end
// @include             *://*.zhihu.com/*

// @version             0.1.0
// @downloadURL https://update.greasyfork.org/scripts/427784/%E5%85%8D%E7%99%BB%E9%99%86%E7%9C%8B%E7%9F%A5%E4%B9%8E%E3%80%81%E4%B8%93%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/427784/%E5%85%8D%E7%99%BB%E9%99%86%E7%9C%8B%E7%9F%A5%E4%B9%8E%E3%80%81%E4%B8%93%E6%A0%8F.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const timeout = 5 * 1000; // 5s
    const interval = 500;
    let count = 0;
    let timer = null;

    timer = setInterval(() => {
        if (count >= timeout / interval) {
            clearInterval(timer);
            return;
        }

        const $modal = document.querySelector('.Modal-closeButton');
        if ($modal) {
            $modal.click();
            clearInterval(timer);
        }
        count ++;
        console.log(count);
    }, interval);
})();
