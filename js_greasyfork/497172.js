// ==UserScript==
// @name         公众号文章优化
// @namespace    haydn
// @version      1.0.0
// @description  优化公众号文章阅读体验【摸鱼】
// @author       Haydn
// @run-at       document-start
// @license      MIT
// @match        https://mp.weixin.qq.com/s*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weixin.qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497172/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/497172/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

/**
 * Add a stylesheet rule to the document (it may be better practice
 * to dynamically change classes, so style information can be kept in
 * genuine stylesheets and avoid adding extra elements to the DOM).
 * Note that an array is needed for declarations and rules since ECMAScript does
 * not guarantee a predictable object iteration order, and since CSS is
 * order-dependent.
 * @param {Array} rules Accepts an array of JSON-encoded declarations
 * @example
addStylesheetRules([
  ['h2', // Also accepts a second argument as an array of arrays instead
    ['color', 'red'],
    ['background-color', 'green', true] // 'true' for !important rules
  ],
  ['.myClass',
    ['background-color', 'yellow']
  ]
]);
*/
function addStylesheetRules(rules) {
  const styleEl = document.createElement("style");

  // Append <style> element to <head>
  document.head.appendChild(styleEl);

  // Grab style element's sheet
  const styleSheet = styleEl.sheet;

  for (let i = 0; i < rules.length; i++) {
    let j = 1,
      rule = rules[i],
      selector = rule[0],
      propStr = "";
    // If the second argument of a rule is an array of arrays, correct our variables.
    if (Array.isArray(rule[1][0])) {
      rule = rule[1];
      j = 0;
    }

    for (let pl = rule.length; j < pl; j++) {
      const prop = rule[j];
      propStr += `${prop[0]}: ${prop[1]}${prop[2] ? " !important" : ""};\n`;
    }

    // Insert CSS Rule
    styleSheet.insertRule(
      `${selector}{${propStr}}`,
      styleSheet.cssRules.length,
    );
  }
}

function prefCss() {
    addStylesheetRules([
        ['strong', ['font-size', '0.8em']]
    ]);
}

function removeElement(queryStr) {
    let ele = document.querySelector(queryStr);
    if (ele) {
        ele.parentNode.removeChild(ele);
    };
}

function zoomImg() {
    const thumbWidth = '60px';
    const bigWidth = '650px';
    const imgs = document.querySelectorAll('.rich_media_content img');
    for (let img of imgs) {
        const parentNode = img.parentNode;
        parentNode.style['text-align'] = 'left';
        const src = img.getAttribute('data-src');
        const thumbImg = document.createElement('img');
        parentNode.appendChild(thumbImg);
        thumbImg.style.cursor = 'pointer';
        thumbImg.style.width = thumbWidth;
        thumbImg.style.height = 'auto';
        thumbImg.setAttribute('src', src);
        thumbImg.addEventListener('click', () => {
            if (thumbImg.style.width === thumbWidth) {
                thumbImg.style.width = bigWidth;
            } else {
                thumbImg.style.width = thumbWidth;
            }
        });
        parentNode.removeChild(img);
    }
}

function changeIcon() {
    const link= document.querySelector("link[rel='shortcut icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/static/favicons/favicon-32x32.png'; //掘金图标
    document.getElementsByTagName('head')[0].appendChild(link);
}

function changeTitle() {
    document.title = "深入浅出react（fiber原理解析）";
    setTimeout(function(){
        document.title = "深入浅出react（fiber原理解析）";
    }, 3000)
    setTimeout(function(){
        document.title = "深入浅出react（fiber原理解析）";
    }, 10000)
}

function main() {
    removeElement('.qr_code_pc_outer');
    removeElement('.rich_media_area_extra');
    // removeElement('#content_bottom_area');
    removeElement('mp-common-profile');
    removeElement('.rich_media_meta_list');
    // prefCss();
    zoomImg();
    changeIcon();
    changeTitle();
}
document.addEventListener('DOMContentLoaded', main);