// ==UserScript==
// @name          addStyle
// @namespace     https://greasyfork.org
// @version       0.3.4
// @description   add Style without GM_addStyle
// @match         *://*/*
// @grant         none
// ==/UserScript==

/**
 * Replace GM_addStyle;
 * Support external stylesheet path.
 * @param {String} inputCSS
 */
const addStyle = (inputCSS) => {
  let node;
  let css = inputCSS.trim();
  if (css.length === 0) return;
  if (css.includes('{') && css.includes('}')) {
    // Internal stylesheet
    node = document.createElement('style');
    node.appendChild(document.createTextNode(css));
  } else if (css.includes('.css')) {
    // External stylesheet
    node = document.createElement('link');
    node.rel = 'stylesheet';
    node.href = css;
  } else {
    console.error(`Function addStyle does't support input parameter: ${css}`);
  }
  const heads = document.getElementsByTagName('head');
  if (heads.length > 0) {
    heads[0].appendChild(node);
  } else {
    // No head yet, stick it whereever.
    document.documentElement.appendChild(node);
  }
};
