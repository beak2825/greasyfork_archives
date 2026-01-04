// ==UserScript==
// @name         查找图片
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  查找图片哦
// @author       Chengguan
// @match        https://*.huaban.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huaban.com
// @grant        GM_registerMenuCommand
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444024/%E6%9F%A5%E6%89%BE%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/444024/%E6%9F%A5%E6%89%BE%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const styleEle = document.createElement('style');
  styleEle.innerText = `
      .hb-img {outline: #F007 dashed 5px; outline-offset: -5px;}

      .hb-imgTip { font-size: 11px; position: absolute; z-index: 999999; opacity: 0.8; color: #F00; background-color: #FFF; word-break: break-all; padding: 4px;}
      .hb-imgTip:hover { z-index: 9999999999; opacity: 1;}

      .hb-container { position: fixed; top: 50px; left: 50px; width: 320px; box-shadow: 0px 0px 20px 4px #686868; background-color: #FFF; z-index: 99999999999; padding: 10px; resize: both; overflow: auto; text-align: center; border: 1px solid #CCC; border-radius: 5px; user-select: none; }

      .hb-container h1 { font-size: 22px; cursor: move; background-color: #efefef }
      .hb-container h1:hover { background-color: #d9d9d9 }

      .hb-container h2 { font-size: 18px;  }

      .hb-container label { padding: 8px; display: block; text-align: left;}
      .hb-container label:hover { background-color: #efefef}

      .hb-container label select { margin-left: 5px; padding: 3px; }
  `;
  document.head.appendChild(styleEle);

  let allTips = [];
  let allImages = [];
  let allFileSizePromises = [];

  function mark(
    reg = /./,
    {
      reverseSelect = false,
      showImageSrc = false,
      showImageSize = false,
      domainReplace = '',
      urlReplaceInput = false,
      urlReplaceFrom = '',
      urlReplaceTo = '',
    } = {},
  ) {
    allTips.forEach((tip) => tip.remove());
    allImages.forEach((img) => img.classList.remove('hb-img'));

    allTips = [];
    allImages = [];
    allFileSizePromises = [];

    [...document.querySelectorAll('img')].forEach((img) => {
      console.count('Image');
      const src =
        (img.dataset.bakSrc || '') + (img.dataset.bakSrcset || '') ||
        img.currentSrc;

      let testValue = reg.test(src);
      testValue = reverseSelect ? !testValue : testValue;

      if (testValue) {
        img.classList.add('hb-img');

        // 替换域名 或 替换文件地址
        if (domainReplace || urlReplaceInput) {
          const urlObj = new URL(src);
          const oldHost = urlObj.host;

          // 备份
          if (!img.getAttribute('data-bak-src')) {
            img.src && img.setAttribute('data-bak-src', img.src);
            img.srcset && img.setAttribute('data-bak-srcset', img.srcset);
          }

          let newSrc = img.getAttribute('data-bak-src') || img.src;
          let newSrcset = img.getAttribute('data-bak-srcset') || img.srcset;

          // 替换
          if (domainReplace) {
            newSrc = newSrc.replace(oldHost, domainReplace);
            newSrcset = newSrcset.replace(oldHost, domainReplace);
          }

          if (urlReplaceInput) {
            newSrc = newSrc.replace(urlReplaceFrom, urlReplaceTo);
            newSrcset = newSrcset.replace(urlReplaceFrom, urlReplaceTo);
          }

          const srcAddRandom = (src) => {
            const random = Math.random()
              .toString(36)
              .substring(2, 15)
              .replace('.', '');
            const srcParts = src.split(' ');
            srcParts[0] =
              srcParts[0] + (srcParts[0].includes('?') ? '&' : '?') + random;

            return srcParts.join(' ');
          };

          newSrc && img.setAttribute('src', srcAddRandom(newSrc));
          newSrcset && img.setAttribute('srcset', srcAddRandom(newSrcset));
        } else if (img.getAttribute('data-bak-src')) {
          // 恢复
          img.dataset.bakSrc && (img.src = img.getAttribute('data-bak-src'));
          img.dataset.bakSrcset &&
            (img.srcset = img.getAttribute('data-bak-srcset'));

          // // 清除
          // img.removeAttribute('data-bak-src');
          // img.removeAttribute('data-bak-srcset');
        }

        function imageCompleted() {
          if (showImageSrc || showImageSize) {
            const { tip, fileSize } = createImgTip(img, {
              showImageSrc,
              showImageSize,
            });
            document.scrollingElement.appendChild(tip);
            allTips.push(tip);
            allFileSizePromises.push(fileSize);
          }

          img.removeEventListener('onload', imageCompleted);
        }

        imageCompleted();

        allImages.push(img);
      }
    });

    return allImages;
  }

  function createImgTip(img, { showImageSrc, showImageSize }) {
    let tip = document.createElement('p');
    tip.className = 'hb-imgTip';
    tip.style.top =
      img.getBoundingClientRect().top +
      document.scrollingElement.scrollTop +
      'px';
    tip.style.left =
      img.getBoundingClientRect().left +
      document.scrollingElement.scrollLeft +
      'px';
    tip.style.maxWidth =
      Math.max(img.getBoundingClientRect().width, 200) + 'px';

    let fileSize;

    if (showImageSrc) {
      tip.innerText = img.currentSrc.startsWith('data:image')
        ? 'data:image/ xxxx'
        : img.currentSrc + '\n';
    }

    if (showImageSize) {
      let currentSrc = img.currentSrc.startsWith('data:image')
        ? ''
        : img.currentSrc;

      if (currentSrc) {
        fileSize = getImageSize(currentSrc).then((result) => {
          let size = (result / 1024).toFixed(2);
          tip.innerText += ' 尺寸：' + size + 'KB';
          return size;
        });
      }
    }
    return { tip, fileSize };
  }

  // 拖拽元素
  function dragableElement({ element, trigger }) {
    trigger = trigger || element;

    let sx = 0;
    let sy = 0;

    trigger.addEventListener('mousedown', (e) => {
      let x = parseInt(window.getComputedStyle(element).left, 10);
      let y = parseInt(window.getComputedStyle(element).top, 10);

      sx = e.clientX;
      sy = e.clientY;

      const moveHandler = (e) => {
        console.info(e.clientX, e.clientY);
        console.info(e.clientX - sx, e.clientY - sy);

        element.style.left = x + (e.clientX - sx) + 'px';
        element.style.top = y + (e.clientY - sy) + 'px';
      };

      const upHandler = () => {
        document.body.removeEventListener('mousemove', moveHandler);
        document.body.removeEventListener('mouseup', upHandler);
      };

      document.body.addEventListener('mousemove', moveHandler);
      document.body.addEventListener('mouseup', upHandler);
    });
  }

  // 获取文件大小
  function getImageSize(url) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.headers.get('content-length');
      })
      .then((contentLength) => {
        // console.log('远程图片大小为: ' + contentLength + ' 字节');
        return contentLength;
      })
      .catch((error) => {
        console.error(
          'There has been a problem with your fetch operation:',
          error,
        );
      });
  }

  GM_registerMenuCommand(
    '查找图片',
    () => {
      // 容器
      const container = document.createElement('div');
      container.className = 'hb-container';
      document.body.appendChild(container);

      // 标题
      const titleEle = document.createElement('h1');
      titleEle.innerText = '查找图片';
      container.appendChild(titleEle);

      dragableElement({ element: container, trigger: titleEle });

      // 匹配图片数量
      const matchCount = document.createElement('h2');
      container.appendChild(matchCount);

      // 匹配正则
      const matchRegLabel = document.createElement('label');
      matchRegLabel.innerText = '匹配图片：';
      container.appendChild(matchRegLabel);

      const input = document.createElement('input');
      matchRegLabel.appendChild(input);

      // 显示图片地址
      const showSrcLabel = document.createElement('label');
      showSrcLabel.innerText = ' 显示图片地址   ';
      container.appendChild(showSrcLabel);

      const showSrcInput = document.createElement('input');
      showSrcInput.setAttribute('type', 'checkbox');
      showSrcLabel.prepend(showSrcInput);

      // 显示图片文件大小
      const showFileSizeLabel = document.createElement('label');
      showFileSizeLabel.innerText = ' 显示图片大小';
      container.appendChild(showFileSizeLabel);

      const showFileSizeInput = document.createElement('input');
      showFileSizeInput.setAttribute('type', 'checkbox');
      // showFileSizeInput.setAttribute('checked', true);
      showFileSizeLabel.prepend(showFileSizeInput);

      // 反选图片
      const reverseLabel = document.createElement('label');
      reverseLabel.innerText = ' 反选';
      container.appendChild(reverseLabel);

      const reverseSelect = document.createElement('input');
      reverseSelect.setAttribute('type', 'checkbox');
      reverseLabel.prepend(reverseSelect);

      // 域名替换
      const domainReplaceLabel = document.createElement('label');
      domainReplaceLabel.innerText = ' 域名替换';
      container.appendChild(domainReplaceLabel);

      const domainReplaceInput = document.createElement('input');
      domainReplaceInput.setAttribute('type', 'checkbox');
      domainReplaceLabel.prepend(domainReplaceInput);

      const domainReplaceSelect = document.createElement('select');
      domainReplaceSelect.innerHTML = `
          <option value=''>默认</option>
          <option value='gd-hbimg.huaban.com'>gd-hbimg.huaban.com</option>
          <option value='gd-hbimg.huabanimg.com'>gd-hbimg.huabanimg.com</option>
      `;
      domainReplaceLabel.appendChild(domainReplaceSelect);

      // 图片URL替换
      const urlReplaceLabel = document.createElement('label');
      urlReplaceLabel.innerText = ' 图片URL替换 ';
      container.appendChild(urlReplaceLabel);

      const urlReplaceInput = document.createElement('input');
      urlReplaceInput.setAttribute('type', 'checkbox');
      urlReplaceLabel.prepend(urlReplaceInput);

      const urlReplaceFromInput = document.createElement('input');
      urlReplaceLabel.appendChild(urlReplaceFromInput);
      const urlReplaceToInput = document.createElement('input');
      urlReplaceToInput.style.width = '100%';
      urlReplaceLabel.appendChild(urlReplaceToInput);

      function render() {
        try {
          const reg = new RegExp(input.value);
          mark(reg, {
            reverseSelect: reverseSelect.checked,
            showImageSrc: showSrcInput.checked,
            showImageSize: showFileSizeInput.checked,
            domainReplace: domainReplaceInput.checked
              ? domainReplaceSelect.value
              : '',
            urlReplaceInput: urlReplaceInput.checked,
            urlReplaceFrom: urlReplaceFromInput.value,
            urlReplaceTo: urlReplaceToInput.value,
          });
          matchCount.innerText = `匹配文件数：${allImages.length}`;

          Promise.all(allFileSizePromises).then((allSizes) => {
            const result = allSizes.reduce((total, size) => {
              return total + Number(size);
            }, 0);
            matchCount.innerText += `，总大小：${result.toFixed(2)}KB`;
          });
        } catch (e) {
          // nothing;
        }
      }

      input.addEventListener('input', render);
      container.addEventListener('click', (e) => {
        if (e.target === container) {
          render();
        }
      });
      showSrcInput.addEventListener('change', render);
      showFileSizeInput.addEventListener('change', render);
      reverseSelect.addEventListener('change', render);

      domainReplaceInput.addEventListener('change', render);
      domainReplaceSelect.addEventListener('change', render);

      urlReplaceInput.addEventListener('change', render);

      render();
    },
    's',
  );
})();
