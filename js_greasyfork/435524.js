// ==UserScript==
// @name         alauda-color-helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  处理蓝湖页面与AUI适配问题
// @author       yzli@alauda.io
// @match        *://lanhuapp.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435524/alauda-color-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/435524/alauda-color-helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * 监测节点是否存在然后执行函数
   * @param selector
   * @param func
   * @returns {Promise<unknown>}
   */
  function obsHasFunc(selector, func) {
    return new Promise(resolve => {
      setInterval(() => {
        const target = document.querySelectorAll(selector);
        if (target && target.length > 0) {
          if (func) {
            func();
          }
          resolve(selector);
        } else {
          return null;
        }
      }, 1500);
    });
  }

  /**
   * 处理颜色值
   * @param color
   * @returns colorName
   */
  function presetColor(color) {
    const colorList = [
      { name: 'primary,blue', value: '#007af5', rgb: 'rgb(0, 122, 245)' },
      { name: 'b-0,p-0', value: '#0067d0', rgb: 'rgb(0, 103, 208)' },
      { name: 'b-1,p-1', value: '#268df6', rgb: 'rgb(38, 141, 246)' },
      { name: 'b-2,p-2', value: '#4da2f8', rgb: 'rgb(77, 162, 248)' },
      { name: 'b-3,p-3', value: '#66aff9', rgb: 'rgb(102, 175, 249)' },
      { name: 'b-4,p-4', value: '#b3d7fc', rgb: 'rgb(179, 215, 252)' },
      { name: 'b-5,p-5', value: '#cce4fd', rgb: 'rgb(204, 228, 253)' },
      { name: 'b-6,p-6', value: '#e5f1fe', rgb: 'rgb(229, 241, 254)' },
      { name: 'b-7,p-7', value: '#f2f8fe', rgb: 'rgb(242, 248, 254)' },
      { name: 'green', value: '#00c261', rgb: 'rgb(0, 194, 97)' },
      { name: 'g-0', value: '#00a552', rgb: 'rgb(0, 165, 82)' },
      { name: 'g-1', value: '#26cb78', rgb: 'rgb(38, 203, 120)' },
      { name: 'g-2', value: '#4cd490', rgb: 'rgb(76, 212, 144)' },
      { name: 'g-4', value: '#b3eccf', rgb: 'rgb(179, 236, 207)' },
      { name: 'g-6', value: '#e6f9ef', rgb: 'rgb(230, 249, 239)' },
      { name: 'g-7', value: '#f2fbf6', rgb: 'rgb(242, 251, 246)' },
      { name: 'yellow', value: '#f5a300', rgb: 'rgb(245, 163, 0)' },
      { name: 'y-0', value: '#dc9200', rgb: 'rgb(220, 146, 0)' },
      { name: 'y-1', value: '#f6b026', rgb: 'rgb(246, 176, 38)' },
      { name: 'y-2', value: '#f8be4d', rgb: 'rgb(248, 190, 77)' },
      { name: 'y-4', value: '#fce3b3', rgb: 'rgb(252, 227, 179)' },
      { name: 'y-6', value: '#fef5e6', rgb: 'rgb(254, 245, 230)' },
      { name: 'y-7', value: '#fefaf3', rgb: 'rgb(254, 250, 243)' },
      { name: 'red', value: '#eb0027', rgb: 'rgb(235, 0, 39)' },
      { name: 'r-0', value: '#c70021', rgb: 'rgb(199, 0, 33)' },
      { name: 'r-1', value: '#ed2647', rgb: 'rgb(237, 38, 71)' },
      { name: 'r-2', value: '#f14c67', rgb: 'rgb(241, 76, 103)' },
      { name: 'r-4', value: '#f9b3be', rgb: 'rgb(249, 179, 190)' },
      { name: 'r-6', value: '#fde6e9', rgb: 'rgb(253, 230, 233)' },
      { name: 'r-7', value: '#fef3f4', rgb: 'rgb(254, 243, 244)' },
      { name: 'n-0', value: '#000', rgb: 'rgb(0, 0, 0)' },
      { name: 'n-1', value: '#323437', rgb: 'rgb(50, 52, 55)' },
      { name: 'n-2', value: '#646669', rgb: 'rgb(100, 102, 105)' },
      { name: 'n-3', value: '#7c7e81', rgb: 'rgb(124, 126, 129)' },
      { name: 'n-4', value: '#96989b', rgb: 'rgb(150, 152, 155)' },
      { name: 'n-5', value: '#aeb0b3', rgb: 'rgb(174, 176, 179)' },
      { name: 'n-6', value: '#c8cacd', rgb: 'rgb(200, 202, 205)' },
      { name: 'n-7', value: '#d4d6d9', rgb: 'rgb(212, 214, 217)' },
      { name: 'n-8', value: '#edeff2', rgb: 'rgb(237, 239, 242)' },
      { name: 'n-9', value: '#f7f9fc', rgb: 'rgb(247, 249, 252)' },
      { name: 'n-10', value: '#fff', rgb: 'rgb(255, 255, 255)' },
    ];
    const last = color.slice(-1);
    const inputColor = color
      .slice(1)
      .split('')
      .reduce((prev, current) => prev && current === last, true)
      ? color.slice(0, 4)
      : color;
    return colorList.find(item => item.value === inputColor);
  }

  /**
   * 处理字号
   * @param size
   * @returns fontSizeName
   */
  function presetFontSize(size) {
    const fontSizeList = [
      { name: 'font-size-xxl', value: '20px' },
      { name: 'font-size-xl', value: '18px' },
      { name: 'font-size-l', value: '16px' },
      { name: 'font-size-m', value: '14px' },
      { name: 'font-size-s', value: '12px' },
    ];
    const targetSize = fontSizeList.find(item => item.value === size);
    return targetSize ? targetSize.name : 'notFound';
  }

  // 处理颜色名称
  const selector = '.color_hex .copy_text';
  obsHasFunc(selector, () => {
    const targets = document.querySelectorAll(selector);
    for (const [index, target] of targets.entries()) {
      const targetValue = target.textContent;
      const targetColor = presetColor(targetValue.toLocaleLowerCase());
      const colorName = targetColor ? targetColor.name : 'notFound';
      const colorNameDoc = document.querySelector(
        `.color_hex .color_name_${index}`,
      );
      if (colorNameDoc) {
        colorNameDoc.innerHTML = colorName;
      } else {
        const coloNameSpan = document.createElement('span');
        coloNameSpan.className = `color_name_${index}`;
        coloNameSpan.style = 'margin-left: 9px';
        coloNameSpan.innerHTML = colorName;
        coloNameSpan.title = targetColor?.rgb;
        document.querySelectorAll(selector)[index].after(coloNameSpan);
      }
    }
  });

  // 处理字号
  const fontSizeSelector = '.item_one .two';
  obsHasFunc(fontSizeSelector, () => {
    const targets = document.querySelectorAll(fontSizeSelector);
    for (const [index, target] of targets.entries()) {
      const targetValue = target.childNodes[0].data;
      const fontSizeName = presetFontSize(targetValue);
      const fontSizeNameDoc = document.querySelector(
        `.item_one .font_size_name_${index}`,
      );
      if (fontSizeNameDoc) {
        fontSizeNameDoc.innerHTML = fontSizeName;
      } else {
        const fontSizeNameSpan = document.createElement('span');
        fontSizeNameSpan.className = `font_size_name_${index}`;
        fontSizeNameSpan.innerHTML = fontSizeName;
        document
          .querySelectorAll(fontSizeSelector)
          [index].append(fontSizeNameSpan);
      }
    }
  });
})();
