// ==UserScript==
// @name         里屋Style
// @namespace    https://github.com/Particaly/
// @version      1.0.3
// @description  新增字体设置 调节分栏比例和图片展示大小
// @author       J.S.Patrick
// @match        *://253874.net/*
// @match        *://www.253874.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482002/%E9%87%8C%E5%B1%8BStyle.user.js
// @updateURL https://update.greasyfork.org/scripts/482002/%E9%87%8C%E5%B1%8BStyle.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // ------------------ 公用
  const cn_fonts = [
    { name: 'Noto Sans SC', url: 'https://fonts.googleapis.com/css?family=Noto+Sans+SC', fontFamily: 'Noto Sans SC', type: 'link' },
    { name: 'Ma Shan Zheng', url: 'https://fonts.googleapis.com/css?family=Ma+Shan+Zheng', fontFamily: 'Ma Shan Zheng', type: 'link' }
  ]
  const en_fonts = [
    { name: 'UbuntuMono', url: 'https://font.onmicrosoft.cn/volantis-static@0.0.1660614606622/media/fonts/UbuntuMono/UbuntuMono-Regular.ttf', fontFamily: 'UbuntuMono', type: 'ttf'},
    { name: 'VarelaRound', url: 'https://font.onmicrosoft.cn/volantis-static@0.0.1660614606622/media/fonts/VarelaRound/VarelaRound-Regular.ttf', fontFamily: 'VarelaRound', type: 'ttf' },
    { name: 'Monaco', url: 'https://font.onmicrosoft.cn/volantis-static@0.0.1660614606622/media/fonts/Monaco/Monaco.ttf', fontFamily: 'Monaco', type: 'ttf'}
  ]
  const extra_style = `
    html[data-darkreader-scheme=dark] body{
      background: #fff;
    }
  `
  const frame_ids = ['gb_top', 'gb_left', 'gb_right', 'gb_search']
  function sleep(time) {
    return new Promise(resolve => {
      setTimeout(resolve, time)
    })
  }
  // ------------------
  // ------------------ 记录 frame 的尺寸
  function getFrameSize() {
    return window.localStorage.getItem('frameset-size');
  }
  function updateFrameSize() {
    const outerFrameSet = document.getElementById('gb_bodys');
    const children = Array.from(outerFrameSet.children);
    const size = children.map(t => t.clientWidth).join(',');
    window.localStorage.setItem('frameset-size', size);
    return size;
  }
  function setFrameSize() {
    const outerFrameSet = document.getElementById('gb_bodys');
    const size = getFrameSize() || updateFrameSize();
    outerFrameSet.cols = size;
  }
  // ---------------------------------------

  // ------------------ 注入字体选项
  function registerFontInjectionListener() {
    const handler = () => {
      if (window.location.href === 'https://www.253874.net/panel###') {
        const cnInput = document.querySelector('[name=font_cn]')
        const enInput = document.querySelector('[name=font_en]')

        cn_fonts.forEach(f => {
          if (!cnInput) return;
          const option = document.createElement('option');
          option.value = f.fontFamily;
          option.innerText = f.name;
          cnInput.appendChild(option)
        })
        en_fonts.forEach(f => {
          const option = document.createElement('option');
          option.value = f.fontFamily;
          option.innerText = f.name;
          enInput.appendChild(option)
        })
        const container = document.querySelector('[id=font_panel]');
        container.addEventListener('change', () => {
          updateFont();
          setFont();
        });
      }
    }
    window.addEventListener('hashchange', handler)
  }
  function getFont() {
    const str = window.localStorage.getItem('font');
    try {
      return JSON.parse(str)
    } catch(e) {
      return null
    }
  }
  function setFont() {
    const css = getFont();
    console.log('set font style', css)
    if (!css) return;
    const sheetContent = extra_style + `
      body {
        font-family: ${css['font-family']};
        font-size: ${css['font-size']};
        line-height: ${css['line-height']};
      }
    `
    const sheet = document.createElement('style');
    sheet.type = 'text/css';
    sheet.innerText = sheetContent;
    document.head.appendChild(sheet);
    cn_fonts.concat(en_fonts).forEach(font => {
      if (css['font-family']?.includes(font.fontFamily)) {
        switch (font.type) {
          case "link": {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = font.url;
            document.head.appendChild(link);
            break;
          }
          case "ttf": {
            const sheet = document.createElement('style');
            sheet.type = 'text/css';
            sheet.innerText = `@font-face { font-family: '${font.fontFamily}'; src: url('${font.url}'); }`;
            document.head.appendChild(sheet);
          }
        }

      }
    })
  }
  function updateFont(overwrite) {
    const $ = document.querySelector.bind(document);
    const font = [];
    const font_en = $('select[name=font_en]').value;
    const font_cn = $('select[name=font_cn]').value;
    const font_size = $('select[name="font_size"]').value;
    let css = {};
    if (font_en.length > 0) {
      font.push(font_en);
    }

    if (font_cn.length > 0) {
      font.push(font_cn);
    }
    if (font.length > 0) {
      css['font-family'] = "'" + font.join("', '") + "', sans-serif";
    }

    if (font_size > 0) {
      css['font-size'] = font_size + 'px';
      css['line-height'] = '22px';
    }
    window.localStorage.setItem('font', JSON.stringify(css));
  }

  setFont()

  function darkMode() {
     const root = document.documentElement;
    const loop = dom => {
      // const style = dom.getComputed;
      // console.log()
      if (dom.children) {
        Array.from(dom.children).forEach(t => loop(t));
      }
    }
  }

  window.addEventListener('load', function () {
    // 调整 frameset 宽度
    const outerFrameSet = document.getElementById('gb_bodys');
    if (outerFrameSet) {
      outerFrameSet.addEventListener('mousemove', e => {
        const children = Array.from(outerFrameSet.children);
        const size = children.map(t => t.clientWidth).join(',');
        if (size === getFrameSize()) return;
        updateFrameSize();
      });
      setFrameSize();
    }
    registerFontInjectionListener();



    const posts = document.querySelectorAll('.post_list');
    posts.forEach(post => {
      const images = post.querySelectorAll('img');
      images.forEach(img => {
        // 跳过gif表情包
        if (img.src.toLowerCase().endsWith('.gif')) {
          return;
        }

        // 设置图片的初始高度，保持宽高比
        img.style.height = '300px';
        img.style.width = 'auto';

        let originalHeight = img.naturalHeight;
        let originalWidth = img.naturalWidth;

        // 点击时切换图片大小
        img.addEventListener('click', () => {
          if (img.style.height === '300px') {
            img.style.height = originalHeight + 'px';
            img.style.width = originalWidth + 'px';
          } else {
            img.style.height = '300px';
            img.style.width = 'auto';
          }
        });
      });
    });
  });
})();
