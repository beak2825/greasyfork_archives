// ==UserScript==
// @name         mt OKR paste
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  用于在OKR页面上，把从任意地方复制的携带超链接的富文本，转换成带链接的文本，从而实现粘贴时保留超链接
// @author       wuqiqi05
// @match        https://okr.sankuai.com/*
// @icon         data:image/vnd.microsoft.icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABMdJREFUWAm1V11sFUUU/mZ29/5S2oLYYsFC8CeNooaISDRqE5vWSAiSqA8+mPgTn5Bo1MTEaxpr1PhAxDeJD8ZHTYzloaFKUowSSlpQENNAaaCh1IsISOv93Z/xnC132bv3p12Kk+zdmTPnnO+bM3POzhW41p7qHV9qoukl4Vhvkmg1lCpN1XkLmlP/0s8ZoWn7aPRDAfZvB3pv+7uOUdkUe0B3avIeJWNfC2lsUHaRsJ0ypfoDASHo0QwoxyJbNU3j/UI5Xw1+sHKovi0gtr5zsSEXLf6sGcn7bTM7n/6880JqkFoEtlWgEKoBWkxqf1/br7UMZTZmviL1eFVw3gTeCfep5SEgV44N28yxkZB69Gkp9J+63k/vDKh5Q9GVmj4HIVdR/DwhdxwClrRBiai7S8jkFZgQy8I0jggxIffm55f+nHrryJ4HTb+9ThtYFbwpKfH29kbcsTLi6h8/W8Bn/VeRochyRGxiyCS5MSmNfjQ5N/b/ckSU40Az4q83t7YJMt5JmNcsAaLm9T0701LYeGcUm+6KebLO9XEMjGQxfLKA22/V0b5Cx7KGOcTLsw4mL1pIX6HwE6uIHgyTojORg6ZFdnSlpiZ+BHaXHOuljv/NnKJG0AmwkQhteSiBDeuiaIiXL3c25+D42SL6hzMYPV2ApIiUbRc55SyhTPuwO3XhwGBfyzHGLPfiY1ElMHju0SQevzdeAc5mTOiRjhg+eXE5dmxphKHxNvkcUpe3Q+qRJQ7sj9CrXOyaBMpNFz6S5PGZzUm893wzbcXcYfZb22aBaobe3YP0Yyy/6QRKYByN13qWwimd1NIE5ZKUhmbb6mUWVT0Dnm6NztWMg6Hf8xibKroaHasi6FwfQyNljr9t3ZTEwbECRsfzMHwH06FqSyfsySd6p28JTeDkeRMff/sPJtKmd8gGRrP4ftjAu8824e42w+PAh3D75gSOTuQ9GXf4LFB9aNUt64FyymVqlQNeOYOfuWAiHhFupnC2cJ9lPMc6/nbfmiham3XaCr+UvgFUnKQmu0MRGDqRc1deLUVZxlFhHX9LxgTaqW5YgbOgbBPKVj2hCIydux52P0ipzyFnnWBbRmcjgE/1j4qNwJpQBIKOFzd2K/CSUAQ6VhsVK/GT4FWyTrBdpnNRVhV9CqEIdFIVXNdqoGC67H1u4Mp4jnX8jb+ik39Z0GswCEWA85xTbW2LgVxRuaBMhvss47lgLeCvaPqKRcXHT+t6P3Qd4Dzf/eryBRUi3pLvDmXdFKz2qWYaoQmwEa9y28MJbEOChzXb3sMZHDldXgWDyjUCE1QLPz44lscX+2bcz3I96xuKQD2HXPH6aeV7BmdQtPimVE+7zhbQTbuiffNLBi1NcsEXkvnAGaBqBBi8WqqNnMrf4JWsYi2egC+lc/duTwT30zkyXsBhAvRfSk9Nm4jSh4fvfucvWV5R4hQvXUr5vfBGf2j+72t5TTKCDodypqQS2MX/ZIKNF8L1jisZP3yDCLW4oMPAmDEp+LtkIm986Vi5Y5pRmdMcTN4h9wk4WMyQsRgzRthy76crZiWsFxy7cFTqMQKbJ28Wgcy+GcPFIsw5bHI42Nf+hyZmOm1lv0G3d/qrxmu/yY18sm/GYCzGZIT/AP3n+eRkpgllAAAAAElFTkSuQmCC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469646/mt%20OKR%20paste.user.js
// @updateURL https://update.greasyfork.org/scripts/469646/mt%20OKR%20paste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', async (e) => {
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const clipboardItem of clipboardItems) {
                if (clipboardItem.types.includes('text/html')){
                    const blob = await clipboardItem.getType('text/html');
                    const html = await new Response(blob).text();
                    const regex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi;
                    const newHtml = html.replace(regex, '<a href="$1">$1</a>').replace(/<[^<>]+>/g, '');
                    const newBlob = new Blob([newHtml], { type: 'text/plain' });
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            "text/plain": newBlob,
                        })
                    ]);
                }
            }
          } catch (err) {
            console.error(err.name, err.message);
          }
    });
})();
