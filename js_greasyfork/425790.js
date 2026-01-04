// ==UserScript==
// @name          multiOpenCloseTabs
// @namespace     https://greasyfork.org
// @version       0.1
// @description   Multi open tabs by GM_openInTab then close them to do something.
// @match         *://*/*
// @grant         GM_openInTab
// ==/UserScript==

/**
 * Multi open tabs by GM_openInTab then close them to do something.
 * @param {*} iterative
 * @param {Function} getUrlFunc
 * @param {Boolean} openInBackground
 * @param {Number} closeTimeout
 * @param {Function} parentTabFunc
 * @param {Number} maxTimes
 * @returns
 */
const multiOpenCloseTabs = (
  iterative,
  getUrlFunc,
  openInBackground,
  closeTimeout,
  parentTabFunc,
  maxTimes = 0
) => {
  let x = 0;
  let y = 0;
  for (let i of iterative) {
    const Url = getUrlFunc(i);
    if (!Url) continue;
    const autoOpenUrl = GM_openInTab(Url, openInBackground);
    x++;
    setTimeout(autoOpenUrl.close, closeTimeout);
    autoOpenUrl.onclose = () => {
      y++;
      if (x === y) {
        parentTabFunc();
      }
    };
    if (maxTimes === 0) {
      continue;
    } else if (x >= maxTimes) {
      return;
    }
  }
};
