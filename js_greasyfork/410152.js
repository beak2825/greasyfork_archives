// ==UserScript==
// @name          fakeNavigators
// @namespace     https://greasyfork.org
// @version       0.1.1
// @description   judge and fake navigators
// @match         *://*/*
// @grant         none
// ==/UserScript==

const isMobile = navigator.userAgent.includes('Mobile');

const isPC = !navigator.userAgent.includes('Mobile');

const fakeUA = (ua) =>
  Object.defineProperty(navigator, 'userAgent', {
    value: ua,
  });

const fakePlatform = (platform) =>
  Object.defineProperty(navigator, 'platform', {
    value: platform,
  });

/* another way:
```
fakeUA = ua =>
  navigator.__defineGetter__('userAgent', () => {
    return ua;
  });
```
*/
