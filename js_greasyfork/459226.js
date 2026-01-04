// ==UserScript==
// @name         BTA Text
// @namespace    *://lanhuapp.com/*
// @version      0.9
// @description  根据蓝湖剪切板生成Bta-Text 组件
// @author       Bajn
// @match        *://lanhuapp.com/*
// @match        *://*.iconfont.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459226/BTA%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/459226/BTA%20Text.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const colorMap = {
    '#fcfefe': 'zlv-1',
    '#f2fcfd': 'zlv-2',
    '#ddf7fa': 'zlv-3',
    '#bbeff4': 'zlv-4',
    '#98e6ef': 'zlv-5',
    '#76dee9': 'zlv-6',
    '#54d6e4': 'zlv-7',
    '#4bc0cd': 'zlv-8',
    '#494242': 'zlv-9',
    '#22565b': 'zlv-10',
    '#112b2e': 'zlv-11',
    '#fafbfd': 'zb-1',
    '#ebf1f7': 'zb-2',
    '#ccdbea': 'zb-3',
    '#99b7d5': 'zb-4',
    '#6692c0': 'zb-5',
    '#336eab': 'zb-6',
    '#004287': 'zb-7',
    '#004287': 'zb-8',
    '#002c5a': 'zb-9',
    '#001e3c': 'zb-10',
    '#000f1e': 'zb-11',
    '#ffffff': 'grey-1',
    '#fafafa': 'grey-2',
    '#f5f5f5': 'grey-3',
    '#f2f2f2': 'grey-4',
    '#e0e0e0': 'grey-5',
    '#c4c4c4': 'grey-6',
    '#9e9e9e': 'grey-7',
    '#757575': 'grey-8',
    '#212121': 'grey-9',
    '#000000': 'grey-10',
    '#ffffff': 'blue-grey-1',
    '#fafcff': 'blue-grey-2',
    '#f5f7fa': 'blue-grey-3',
    '#eef0f5': 'blue-grey-4',
    '#e1e3e8': 'blue-grey-5',
    '#b2b7bf': 'blue-grey-6',
    '#888f99': 'blue-grey-7',
    '#3b3e45': 'blue-grey-8',
    '#1f2126': 'blue-grey-9',
    '#0d0e12': 'blue-grey-10',
    '#f7f9fc': 'primary-1',
    '#e6eeff': 'primary-2',
    '#ccdeff': 'primary-3',
    '#99bdff': 'primary-4',
    '#669cff': 'primary-5',
    '#337aff': 'primary-6',
    '#0055ff': 'primary-7',
    '#0048d9': 'primary-8',
    '#003399': 'primary-9',
    '#002266': 'primary-10',
    '#000c24': 'primary-11',
    '#fffbfb': 'error-1',
    '#ffecee': 'error-2',
    '#ffd9dc': 'error-3',
    '#ffb3b9': 'error-4',
    '#ff8d97': 'error-5',
    '#ff6774': 'error-6',
    '#ff4252': 'error-7',
    '#e53b49': 'error-8',
    '#992731': 'error-9',
    '#661a20': 'error-10',
    '#330d10': 'error-11',
    '#fafefc': 'success-1',
    '#e6faf0': 'success-2',
    '#ccf5e2': 'success-3',
    '#99ecc5': 'success-4',
    '#66e3a8': 'success-5',
    '#33da8b': 'success-6',
    '#00d16e': 'success-7',
    '#00bb62': 'success-8',
    '#007d42': 'success-9',
    '#00532c': 'success-10',
    '#002916': 'success-11',
    '#fffdfa': 'warn-1',
    '#fff5e6': 'warn-2',
    '#ffeccc': 'warn-3',
    '#ffda99': 'warn-4',
    '#ffc766': 'warn-5',
    '#ffb533': 'warn-6',
    '#ffa300': 'warn-7',
    '#e59200': 'warn-8',
    '#996100': 'warn-9',
    '#664100': 'warn-10',
    '#332000': 'warn-11',
    '#fefafe': 'purple-1',
    '#fee9fb': 'purple-2',
    '#fed3f7': 'purple-3',
    '#fda7ef': 'purple-4',
    '#fd7ce7': 'purple-5',
    '#fc50df': 'purple-6',
    '#fc25d8': 'purple-7',
    '#e221c1': 'purple-8',
    '#971681': 'purple-9',
    '#640e56': 'purple-10',
    '#32072b': 'purple-11',
  };

  const toHex = (n) => `${n > 15 ? '' : 0}${n.toString(16)}`;
  const toHexString = (colorObj) => {
    const { r, g, b, a = 1 } = colorObj;
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${a === 1 ? '' : toHex(Math.floor(a * 255))}`;
  };

  function isRGBColor(color) {
    const rgbColorRegex = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/i;
    const match = color.match(rgbColorRegex);

    if (match) {
      const [, r, g, b, a] = match;
      const alpha = a !== undefined ? parseFloat(a) : 1.0;

      return {
        r: parseInt(r, 10),
        g: parseInt(g, 10),
        b: parseInt(b, 10),
        a: alpha,
      };
    }

    return null;
  }

  const fontFamily = {
    // 粗体
    'PingFangSC-Medium, PingFang SC': '--v-font-family-bold',
    // 数字字体
    'WEMONum-Bold, WEMONum': '--v-font-family-number',
    // 普通字体
    'PingFangSC-Regular, PingFang SC': '--v-font-family',
  };

  let style = '';

  document.addEventListener('keydown', async function (e) {
    if (e.keyCode === 187) {
      style = await navigator.clipboard.readText();
      const styleObj = format(style);
      createProps(styleObj);
    }
    if (e.keyCode === 48) {
      style = await navigator.clipboard.readText();
      const styleObj = format(style);
      createProps(styleObj, 'vue');
    }
    if (e.keyCode === 189) {
      createIcon();
    }
  });

  /** 复制 BTA text start */
  function format(str) {
    const rows = str.replace(/;|px|rpx/gi, '').split('\n');
    const styleObj = {};
    rows.forEach((row) => {
      const sp = row.split(':');
      styleObj[sp[0].trim()] = sp[1].trim();
    });
    return styleObj;
  }

  function createProps(styleObj, type) {
    const props = {};
    Object.keys(styleObj).forEach((attr) => {
      const value = styleObj[attr];
      if (attr === 'font-size') {
        props.size = Number(value);
      }
      if (attr === 'font-weight') {
        if (Number(value) >= 500 || value === 'bold') {
          props.bold = '';
        }
      }
      if (attr === 'color') {
        let newVal = value;
        const rgbVal = isRGBColor(newVal);
        if (rgbVal) {
          newVal = toHexString({
            r: rgbVal.r,
            g: rgbVal.b,
            b: rgbVal.b,
            a: 1,
          });
          if (rgbVal.a) {
            props.colorOpacity = rgbVal.a;
          }
        }

        if (!colorMap[newVal.toLocaleLowerCase()]) {
          alert(newVal + ': 不在色卡中');
        }

        props.color = colorMap[newVal.toLocaleLowerCase()] || newVal;
      }

      if (attr === 'line-height') {
        const size = styleObj['font-size'];
        const isSingleLine = Number(value) / size <= 1.25;
        if (!isSingleLine) {
          props.multipleLines = '';
        }
      }
    });

    const contentEles = document.querySelectorAll('.item_one.item_content');
    let content = 'XXXXXXXXX';
    Array.from(contentEles).forEach((el) => {
      const title = el?.previousElementSibling?.innerText;
      if (title === '内容') {
        content = el.innerText;
      }
    });
    let btaTextRes = '';

    if (type === 'vue') {
      const propsStr = Object.keys(props).map((key) => {
        const value = props[key];
        if (value === '') {
          return key;
        } else if (typeof value === 'string') {
          return `${key}="${value}"`;
        } else {
          return `:${key}="${value}"`;
        }
      });

      btaTextRes = `<m-text ${propsStr.join(' ')}>${content}</m-text>`;
    } else {
      const propsStr = Object.keys(props).map((key) => {
        const value = props[key];
        if (value === '') {
          return `${key}`;
        } else if (typeof value === 'string') {
          return `${key}="${props[key]}"`;
        } else {
          return `${key}={${props[key]}}`;
        }
      });

      btaTextRes = `<BtaText ${propsStr.join(' ')}>${content}</BtaText>`;
    }

    navigator.clipboard.writeText(btaTextRes).then((res) => {
      displayMessage('success', 'BTA TEXT 复制成功。', 1500);
    });
  }

  /** 复制 BTA text end */

  async function createIcon() {
    const type = await navigator.clipboard.readText();
    await navigator.clipboard.writeText(
      `<BtaIcon type={"${type.replace('icon-', '')}"} color={'primary'} size={24}/>`,
    );
    displayMessage('success', 'BTA ICON 复制成功。', 1500);
  }

  /** message  弹窗 **/
  function displayMessage(type, data, time) {
    const lunbo = document.createElement('div');

    if (type == 'success') {
      lunbo.style.backgroundColor = 'rgba(0, 209, 110, 0.9)';
    } else if (type == 'error') {
      lunbo.style.backgroundColor = '#990000';
    } else if (type == 'info') {
      lunbo.style.backgroundColor = ' #e6b800';
    } else {
      console.log('入参type错误');
      return;
    }

    lunbo.id = 'lunbo';
    lunbo.style.position = 'fixed';
    lunbo.style.width = '200px';
    lunbo.style.height = '60px';
    lunbo.style.transform = 'translate(-50%, -50%)';
    lunbo.style.zIndex = '999999';
    lunbo.style.left = '50%';
    lunbo.style.top = '25%';
    lunbo.style.color = 'white';
    lunbo.style.fontSize = '16px';
    lunbo.style.borderRadius = '20px';
    lunbo.style.textAlign = 'center';
    lunbo.style.lineHeight = '60px';

    if (document.getElementById('lunbo') == null) {
      document.body.appendChild(lunbo);
      lunbo.innerHTML = data;
      setTimeout(function () {
        document.body.removeChild(lunbo);
      }, time);
    }
  }
})();
