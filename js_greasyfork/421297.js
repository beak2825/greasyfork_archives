// ==UserScript==
// @name         hipda-GIFs
// @namespace    https://github.com/maltoze/tampermonkey-scripts/
// @version      0.1.3
// @description  GIFs support for HiPDA
// @author       maltoze
// @match        https://www.hi-pda.com/forum/*
// @match        https://www.4d4y.com/forum/*
// @require      https://cdn.jsdelivr.net/npm/@popperjs/core@2/dist/umd/popper.min.js
// @require      https://cdn.jsdelivr.net/npm/tippy.js@6/dist/tippy-bundle.umd.min.js
// @require      https://cdn.jsdelivr.net/gh/maltoze/tampermonkey-scripts@dbaa6eef6a1231c7bf30118d62daa38e052042c1/hipda/dist/hipda-giphy.umd.min.js
// @resource     lightBorderCss https://cdn.jsdelivr.net/npm/tippy.js@6/themes/light-border.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/421297/hipda-GIFs.user.js
// @updateURL https://update.greasyfork.org/scripts/421297/hipda-GIFs.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const lastActionElem = document.querySelector(
    '#fastpostform > table > tbody > tr > td.postcontent > div > div > a:last-of-type',
  );
  const cmdSmiliesElem = document.querySelector('#e_cmd_smilies');
  if (!lastActionElem && !cmdSmiliesElem) {
    return;
  }
  const gifBtnOfPostBoxElem = document.createElement('a');
  gifBtnOfPostBoxElem.style.padding = '2px 0 26px 0';
  gifBtnOfPostBoxElem.style.cursor = 'pointer';
  gifBtnOfPostBoxElem.style.background = 'none';
  gifBtnOfPostBoxElem.innerHTML = `
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="17.7939" y="8.52844" width="2.877" height="14.0941" fill="#9933FF"></rect>
      <rect x="0.531494" y="22.6226" width="20.139" height="2.81882" fill="#00CCFF"></rect>
      <rect x="0.531494" y="2.89081" width="2.877" height="19.7317" fill="#00FF99"></rect>
      <rect x="0.531494" y="0.0720215" width="11.508" height="2.81882" fill="#FFF35C"></rect>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M17.7936 5.70966V2.89084H14.9166V0.0720215H12.0396V2.90493V2.91903V5.72375V5.72375V8.52848H14.9166H17.7936V8.52848H20.6706V5.70966H17.7936Z" fill="#FF6666"></path>
      <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M12.0394 0.0720215V2.89084H9.16235L12.0394 0.0720215Z" fill="#0F0F0F"></path>
      <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M17.7939 11.3754V8.52844H20.6709L17.7939 11.3754Z" fill="#0F0F0F"></path>
    </svg>GIF
  `;
  cmdSmiliesElem &&
    cmdSmiliesElem.insertAdjacentElement('afterend', gifBtnOfPostBoxElem);

  const gifBtnElem = document.createElement('a');
  gifBtnElem.style.textIndent = 0;
  gifBtnElem.style.textDecoration = 'none';
  gifBtnElem.style.cursor = 'pointer';
  gifBtnElem.style.width = '28px';
  gifBtnElem.style.background = 'none';
  gifBtnElem.style.display = 'flex';
  gifBtnElem.style.alignItems = 'center';
  gifBtnElem.innerHTML = `
    <svg width="25" height="11" viewBox="0 0 33 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.502 2.147L10.317 4.313C9.348 3.401 8.17 3.154 7.277 3.154C5.111 3.154 3.705 4.446 3.705 7.049C3.705 8.759 4.598 10.868 7.277 10.868C7.98 10.868 9.082 10.735 9.842 10.184V8.474H6.479V5.529H12.977V11.438C12.141 13.129 9.823 14.041 7.258 14.041C1.995 14.041 0 10.526 0 7.049C0 3.572 2.28 0 7.277 0C9.12 0 10.754 0.38 12.502 2.147ZM19.348 13.68H15.605V0.38H19.348V13.68ZM26.27 13.68H22.546V0.38H32.749V3.534H26.27V6.023H32.35V9.101H26.27V13.68Z" fill="url(#paint0_linear)"/>
      <defs>
      <linearGradient id="paint0_linear" x1="16.5382" y1="-7.16091" x2="6.33537" y2="16.8717" gradientUnits="userSpaceOnUse">
      <stop stop-color="#00E6CC"/>
      <stop offset="1" stop-color="#9933FF"/>
      </linearGradient>
      </defs>
    </svg>
  `;
  lastActionElem &&
    lastActionElem.insertAdjacentElement('afterend', gifBtnElem);

  const gifsContainerId = 'hipda-GIFs__container';
  const gifsContainer = document.createElement('div');
  gifsContainer.id = gifsContainerId;
  gifsContainer.innerHTML = `
    <div style="margin: 0.5em">
      <input
        id="hipda-GIFs__search"
        style="padding: 0.5em; width: 100%; box-sizing: border-box; outline: 0; border: 1px solid #d9d9d9; border-radius: 4px;"
        placeholder="搜索GIFs..."
      />
    <div>
  `;

  const gifsContentId = 'hipda-GIFs__content';
  const gifsContentElem = document.createElement('div');
  gifsContentElem.id = gifsContentId;
  gifsContentElem.style.display = 'flex';
  gifsContentElem.style.justifyContent = 'center';
  gifsContentElem.style.overflowY = 'auto';
  gifsContentElem.style.height = '350px';
  gifsContentElem.style.width = '450px';
  gifsContentElem.style.paddingTop = '0.5em';
  gifsContainer.appendChild(gifsContentElem);

  gifsContainer.insertAdjacentHTML(
    'beforeend',
    `<div style="width: 100px; padding: 14px 0 10px 0">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 581.5 67.1"
        xml:space="preserve"
      >
        <path
          fill="#898989"
          d="M327.2,26.7h29.7v8c0,5.7,0,11.4,0,17.1c0,1.4-0.4,2.5-1.2,3.6c-2.3,3.2-5.3,5.4-8.8,6.9 c-10.6,4.2-21.3,4.5-31.9,0.2c-7.5-3-12.6-8.6-15.3-16.2c-3.3-9.3-3.1-18.6,1.1-27.7c3.9-8.3,10.5-13.5,19.2-16 c6.1-1.7,12.4-1.8,18.7-0.7c5.6,1,11.6,4.5,15.9,9.1c-1.6,1.6-3.2,3.2-4.8,4.9c-1.6,1.7-3.2,3.4-4.8,5.1c-0.7-0.5-1.2-0.9-1.6-1.2 c-5.2-3.9-11-5-17.3-3.7c-5,1.1-8.6,4.2-10.3,9c-1.9,5.4-2,10.9,0.2,16.3c2.3,5.6,6.6,8.6,12.6,9.2c3.6,0.3,7.1,0,10.5-1.3 c1.1-0.4,2.2-1,3.3-1.5v-7.9h-15.2C327.1,35.6,327.2,31.2,327.2,26.7 M453.6,63.9h17.1V41.3h21.9v22.6h16.9c0-20.3,0-40.4,0-60.6 h-17c-0.1,7.7,0.1,15.3-0.1,22.8h-21.8V3.3h-17.1V63.9z M411,63.8V47.5c4,0,8,0.1,12,0c2.7-0.1,5.3-0.4,7.9-1 c5.1-1.2,9.4-3.7,12.5-8c3-4.2,4.1-8.9,3.9-13.9c-0.2-6.5-2.5-12-7.6-16.1c-4.4-3.6-9.6-5.1-15.1-5.2h-31.1v60.6H411 M410.7,17.9 c0.6,0,8.3,0,12.1,0c5.5,0,7.9,4.7,7.2,9c-0.6,3.6-2.8,5.9-6.3,6.1c-4.2,0.2-8.5,0-13,0V17.9z M546.8,23.9 c-4.3-7.2-8.4-13.9-12.5-20.7h-19.8c7.9,12.4,15.7,24.4,23.5,36.6v23.9h17.1V39.7c8-11.8,24.4-36.2,24.6-36.5h-0.6h-19.2 C555.6,10,551.3,16.8,546.8,23.9 M382.4,63.9c0-20.4,0-40.5,0-60.8h-17.1v60.8H382.4"
        ></path>
        <path
          fill="#C1C1C1"
          d="M1.7,19.3H15c6.3,0,9.9,4.1,9.9,8.9c0,4.8-3.6,8.9-9.9,8.9H7v10.6H1.7V19.3z M14.2,23.7H7v9.1h7.2 c3,0,5.2-1.8,5.2-4.5S17.2,23.7,14.2,23.7z M43.3,18.8c9.1,0,15.4,6.2,15.4,14.7c0,8.5-6.4,14.7-15.4,14.7 c-9.1,0-15.4-6.2-15.4-14.7C27.9,25,34.2,18.8,43.3,18.8z M43.3,23.2c-6.1,0-10,4.4-10,10.3c0,5.8,3.9,10.3,10,10.3 c6.1,0,10-4.4,10-10.3C53.3,27.6,49.4,23.2,43.3,23.2z M80.1,26.7l-5.8,21h-5.7L60,19.3h5.9l5.9,21.9L78,19.3h4.2l6.2,21.9l5.8-21.9 h5.9l-8.6,28.5H86L80.1,26.7z M103.8,19.3h20.7v4.4h-15.4v7.4h15.1v4.4h-15.1v7.9h15.4v4.4h-20.7V19.3z M140.4,37.1h-5.2v10.6h-5.3 V19.3h13.3c6,0,9.9,3.7,9.9,8.9c0,5.1-3.5,7.8-7.2,8.4l7.4,11.2h-6.1L140.4,37.1z M142.4,23.7h-7.2v9.1h7.2c3,0,5.2-1.8,5.2-4.5 S145.4,23.7,142.4,23.7z M158.3,19.3H179v4.4h-15.4v7.4h15.1v4.4h-15.1v7.9H179v4.4h-20.7V19.3z M184.4,19.3h11.2 c9.4,0,15.8,5.9,15.8,14.3c0,8.4-6.4,14.2-15.8,14.2h-11.2V19.3z M195.6,43.4c6.6,0,10.4-4.4,10.4-9.8c0-5.5-3.6-9.9-10.4-9.9h-5.9 v19.7H195.6z M228.2,19.3H243c5.5,0,8.6,3.2,8.6,7.3c0,3.6-2.4,6-5.2,6.5c3.2,0.5,5.8,3.5,5.8,7c0,4.4-3.1,7.7-8.8,7.7h-15.3V19.3z M241.9,31.1c2.7,0,4.3-1.5,4.3-3.7s-1.5-3.7-4.3-3.7h-8.5v7.4H241.9z M242.2,43.4c2.9,0,4.6-1.5,4.6-4c0-2.1-1.6-3.9-4.6-3.9h-8.7 v7.9H242.2z M264.7,35.9L253,19.3h6.1l8.3,12.2l8.2-12.2h6.1L270,35.9v11.8h-5.3V35.9z"
        ></path>
      </svg>
    </div>`,
  );

  const gf = new hipdaGiphy.GiphyFetch('askdHCgTjMe0SVXAnUe15PICPgF1zlWh');
  const searchGifs = (term) => (offset) =>
    gf.search(term, { offset, limit: 10, lang: 'zh-CN' });
  const fetchTrendingGifs = (offset) => {
    return gf.trending({ offset, limit: 10 });
  };

  const handleOnGifClick = (gif, e) => {
    e.preventDefault();
    const fastPostElem = document.querySelector('#fastpostmessage');
    const gifUrl = gif.images.original.url;
    if (fastPostElem) {
      const fastPostValue = fastPostElem.value;
      fastPostElem.value = ''.concat(
        fastPostValue.slice(0, fastPostElem.selectionStart),
        `[img]${gifUrl}[/img]`,
        fastPostValue.slice(fastPostElem.selectionEnd),
      );
    }
    const postBoxIframe = document.querySelector('#postbox #e_iframe');
    const postBoxBodyElem =
      postBoxIframe &&
      postBoxIframe.contentWindow.document.querySelector('body');
    if (postBoxBodyElem) {
      postBoxBodyElem.innerHTML += `<img src="${gifUrl}" alt="${gif.title}" />`;
    }
    tippyInstance.hide();
  };

  const makeGrid = (fetchFunc, key = 'trending') => {
    const remove = hipdaGiphy.renderGrid(
      {
        width: 450,
        fetchGifs: fetchFunc,
        columns: 3,
        gutter: 6,
        user: {},
        key,
        hideAttribution: true,
        noResultsMessage: '无结果',
        onGifClick: handleOnGifClick,
      },
      gifsContentElem,
    );
    return { remove };
  };

  const debounce = (callback, wait) => {
    let timeout;
    return (...args) => {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => callback.apply(context, args), wait);
    };
  };

  const handleOnInput = (event) => {
    const inputVal = event.target.value;
    makeGrid(searchGifs(inputVal), inputVal);
  };

  const handleOnMount = () => {
    const searchInputElem = document.querySelector('#hipda-GIFs__search');
    searchInputElem &&
      searchInputElem.addEventListener('input', debounce(handleOnInput, 500));
    makeGrid(fetchTrendingGifs);
  };

  const tippyTheme = GM_getResourceText('lightBorderCss');
  GM_addStyle(tippyTheme);
  const tippyTargetElem = lastActionElem ? gifBtnElem : gifBtnOfPostBoxElem;
  const tippyInstance = tippy(tippyTargetElem, {
    content: gifsContainer,
    trigger: 'click',
    interactive: true,
    appendTo: document.body,
    placement: 'auto',
    arrow: false,
    theme: 'light-border',
    maxWidth: 500,
    onMount: handleOnMount,
  });
})();
