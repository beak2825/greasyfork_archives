// ==UserScript==
// @name        Camwhores.tv Evolution
// @description This script adds useful configurable features to the camwhores.tv site.
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAMUExURQAAAP8ANwwA/////7gbQJkAAAABdFJOUwBA5thmAAAAAWJLR0QDEQxM8gAAAAd0SU1FB+gDHhIuCjXV/h8AAAA4SURBVAjXY2ANDQ1gEA0NDWEIYWBgZAhgAAIUghEiC1YHBhpMDRpIhBbXghUMXKtWLWBgWqHVAACjlwz/pN0YPwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNC0wMy0zMFQxODo0NjowOSswMDowME+iXNIAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjQtMDMtMzBUMTg6NDY6MDkrMDA6MDA+/+RuAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI0LTAzLTMwVDE4OjQ2OjEwKzAwOjAwMNiA/AAAAABJRU5ErkJggg==
// @version     1.2.1
// @license     MIT
// @namespace   cw-evolution
// @match       https://www.camwhores.tv/*
// @match       https://camwhores.tv/*
// @exclude     *.camwhores.tv/*mode=async*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/498458/Camwhorestv%20Evolution.user.js
// @updateURL https://update.greasyfork.org/scripts/498458/Camwhorestv%20Evolution.meta.js
// ==/UserScript==

if (!location.href.startsWith('https://www.')) {
  location.href = location.href.replace('https://', 'https://www.');
  return;
}

var config = Object.assign(
  {
    extendItemInformation: false,
    removeLocked: false,
    infiniteScroll: false,
    muteVideoOnLoad: false,
    customStyles: false,
  },
  JSON.parse(localStorage.getItem('cw-evolution-config'))
);

var icons = {
  circleNotch: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/></svg>',
  lightbulb: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M297.2 248.9C311.6 228.3 320 203.2 320 176c0-70.7-57.3-128-128-128S64 105.3 64 176c0 27.2 8.4 52.3 22.8 72.9c3.7 5.3 8.1 11.3 12.8 17.7l0 0c12.9 17.7 28.3 38.9 39.8 59.8c10.4 19 15.7 38.8 18.3 57.5H109c-2.2-12-5.9-23.7-11.8-34.5c-9.9-18-22.2-34.9-34.5-51.8l0 0 0 0c-5.2-7.1-10.4-14.2-15.4-21.4C27.6 247.9 16 213.3 16 176C16 78.8 94.8 0 192 0s176 78.8 176 176c0 37.3-11.6 71.9-31.4 100.3c-5 7.2-10.2 14.3-15.4 21.4l0 0 0 0c-12.3 16.8-24.6 33.7-34.5 51.8c-5.9 10.8-9.6 22.5-11.8 34.5H226.4c2.6-18.7 7.9-38.6 18.3-57.5c11.5-20.9 26.9-42.1 39.8-59.8l0 0 0 0 0 0c4.7-6.4 9-12.4 12.7-17.7zM192 128c-26.5 0-48 21.5-48 48c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-44.2 35.8-80 80-80c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 384c-44.2 0-80-35.8-80-80V416H272v16c0 44.2-35.8 80-80 80z"/></svg>',
  eraser: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M290.7 57.4L57.4 290.7c-25 25-25 65.5 0 90.5l80 80c12 12 28.3 18.7 45.3 18.7H288h9.4H512c17.7 0 32-14.3 32-32s-14.3-32-32-32H387.9L518.6 285.3c25-25 25-65.5 0-90.5L381.3 57.4c-25-25-65.5-25-90.5 0zM297.4 416H288l-105.4 0-80-80L227.3 211.3 364.7 348.7 297.4 416z"/></svg>',
  infinite: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 241.1C0 161 65 96 145.1 96c38.5 0 75.4 15.3 102.6 42.5L320 210.7l72.2-72.2C419.5 111.3 456.4 96 494.9 96C575 96 640 161 640 241.1v29.7C640 351 575 416 494.9 416c-38.5 0-75.4-15.3-102.6-42.5L320 301.3l-72.2 72.2C220.5 400.7 183.6 416 145.1 416C65 416 0 351 0 270.9V241.1zM274.7 256l-72.2-72.2c-15.2-15.2-35.9-23.8-57.4-23.8C100.3 160 64 196.3 64 241.1v29.7c0 44.8 36.3 81.1 81.1 81.1c21.5 0 42.2-8.5 57.4-23.8L274.7 256zm90.5 0l72.2 72.2c15.2 15.2 35.9 23.8 57.4 23.8c44.8 0 81.1-36.3 81.1-81.1V241.1c0-44.8-36.3-81.1-81.1-81.1c-21.5 0-42.2 8.5-57.4 23.8L365.3 256z"/></svg>',
  mute: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg>',
  brush: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M339.3 367.1c27.3-3.9 51.9-19.4 67.2-42.9L568.2 74.1c12.6-19.5 9.4-45.3-7.6-61.2S517.7-4.4 499.1 9.6L262.4 187.2c-24 18-38.2 46.1-38.4 76.1L339.3 367.1zm-19.6 25.4l-116-104.4C143.9 290.3 96 339.6 96 400c0 3.9 .2 7.8 .6 11.6C98.4 429.1 86.4 448 68.8 448H64c-17.7 0-32 14.3-32 32s14.3 32 32 32H208c61.9 0 112-50.1 112-112c0-2.5-.1-5-.2-7.5z"/></svg>',
  download: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>',
  thumbsUp: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z"/></svg>',
};

function injectedScript(config, icons) {
  var processItems = () => {
    var friendRequestAEl = document.querySelector(
      '#list_messages_my_conversation_messages h2 a:last-child:not(.processed)'
    );
    if (friendRequestAEl) {
      friendRequestAEl.classList.add('processed');
      var profileReq = new XMLHttpRequest();
      profileReq.responseType = 'document';
      profileReq.addEventListener('load', function () {
        var videoCountEl;
        this.response.querySelectorAll('.item').forEach((it) => {
          if (it.innerText.includes('Posted:')) {
            videoCountEl = it;
          }
        });
        if (videoCountEl) {
          var userVideoCount = +videoCountEl.innerText.replace('Posted:', '').split(',')[0].replace('videos', '').trim();
          userVideoCount = isNaN(userVideoCount) ? 0 : userVideoCount;
          var videosRefEl = document.createElement('a');
          videosRefEl.classList.add('processed');
          videosRefEl.href = friendRequestAEl.href + 'videos/';
          videosRefEl.innerText += `(Videos: ${userVideoCount})`;
          videosRefEl.style.marginLeft = '4px';
          friendRequestAEl.parentNode.insertBefore(videosRefEl, friendRequestAEl.nextSibling);
        }
      });
      profileReq.open('GET', friendRequestAEl.href);
      profileReq.send();
      return;
    }

    var videoEl = document.querySelector('video:not(.processed)');
    if (videoEl) {
      videoEl.classList.add('processed');
      var liEl = document.createElement('li');
      liEl.innerHTML = `<a href="${videoEl.src}" class="toggle-button download-button" target="_blank">${icons.download}</a>`;
      document.querySelector('.tabs-menu > ul').appendChild(liEl);
    }

    if (!config.extendItemInformation && !config.removeLocked) {
      return;
    }

    document.querySelectorAll('.item:not(.processed)').forEach((it) => {
      if (it.classList.contains('processed')) {
        return;
      }

      it.classList.add('processed');

      var privateEl = it.querySelector('.line-private');
      var isNonPrivate = privateEl === null;

      if (!privateEl) {
        var imgWrapperEl = it.querySelector('.img');
        if (imgWrapperEl) {
          privateEl = document.createElement('a');
        	privateEl.target = config.infiniteScroll ? '_blank' : '_self';
          privateEl.classList.add('line-private');
          imgWrapperEl.appendChild(privateEl);
        }
      } else {
        var aEl = document.createElement('a');
        aEl.target = config.infiniteScroll ? '_blank' : '_self';
        aEl.classList.add('line-private');
        privateEl.parentElement.replaceChild(aEl, privateEl);
        privateEl = aEl;
      }

      if (!privateEl) {
        return;
      }

      var lockedContainerIds = [
        'list_members_my_conversations_items',
        'list_members_my_friends_items',
        'list_members_friends_items',
      ];
      if (
        lockedContainerIds.includes(it.parentElement.id) ||
        lockedContainerIds.includes(it.parentElement.parentElement.id)
      ) {
        return;
      }

      var loaderEl = document.createElement('div');
      if (config.extendItemInformation) {
        loaderEl.classList.add('loader');
        loaderEl.innerHTML = icons.circleNotch;
        privateEl.parentElement.appendChild(loaderEl);
      }

      privateEl.style.opacity = 0;

      var req = new XMLHttpRequest();
      req.responseType = 'document';
      req.addEventListener('load', function () {
        var usernameLinkEl = this.response.querySelector('.username > a');
        privateEl.href = usernameLinkEl.href;

        if (!this.response.querySelector('.message') || !config.removeLocked) {
          it.querySelector('img').style.opacity = '1';
          privateEl.innerText = this.response.querySelector('.username').innerText.trim();
          privateEl.style.color = 'black';
          privateEl.classList.add('with-transition');
          privateEl.style.opacity = 0.7;
          loaderEl.style.opacity = 0;
          loaderEl.style['pointer-events'] = 'none';
        }

        if (config.extendItemInformation) {
          privateEl.style.background = isNonPrivate
            ? '#FFFFFF'
            : !this.response.querySelector('.message')
            ? '#7dc78a'
            : '#fc5729';
        }

        if (this.response.querySelector('.message') && config.removeLocked) {
          it.remove();
        }
      });
      req.open('GET', it.querySelector('a:last-child').href);
      req.send();
    });
  };

  var onDomUpdate = () => {
    processItems();

    if (
      (document.querySelector('.filter') || document.querySelector('.sort')) &&
      !document.querySelector('.profile-list')
    ) {
      document.querySelectorAll('.box:not(.processed)').forEach((boxEl) => {
        boxEl.classList.add('processed');
        if (boxEl.parentElement.id === 'list_messages_my_conversation_messages') {
          return;
        }
        var h2El = boxEl.parentElement.querySelector(':scope > .headline h1, :scope > .headline h2');
        var paginationEl = boxEl.parentElement.querySelector(':scope > .pagination > .pagination-holder');

        if (paginationEl) {
          var isLoading = false;
          var dataset = paginationEl.querySelector('.last > a')?.dataset;
          var isLastPage = dataset === undefined;
          if (isLastPage) {
            const pages = paginationEl.querySelectorAll('.page');
            dataset = pages[pages.length - 1].querySelector(':scope > a').dataset;
          }
          var o = Object.assign(
            Object.fromEntries(dataset.parameters.split(';').map((x) => [x.split(':')[0], x.split(':')[1]])),
            { block_id: dataset.blockId }
          );
          o.q = o.q ?? '';
          o.category_ids = o.category_ids ?? '';
          var maxPage = +(o['from_videos+from_albums'] ?? o['from_videos'] ?? o['from_my_videos']);
          if (isLastPage) {
            maxPage++;
          }

          var firstPageReq = new XMLHttpRequest();
          firstPageReq.responseType = 'document';
          firstPageReq.addEventListener('load', function () {
            var firstPageItems = this.response.querySelectorAll('.item');
            var lastPageReq = new XMLHttpRequest();
            lastPageReq.responseType = 'document';
            lastPageReq.addEventListener('load', function () {
              var lastPageItems = this.response.querySelectorAll('.item');
              if (h2El) {
                if (h2El.innerText.includes('(')) {
                  h2El.innerText = h2El.innerText.substr(0, h2El.innerText.indexOf('('));
                }
                h2El.innerText += ` (Results: ${
                  firstPageItems.length * (maxPage - 1) + lastPageItems.length
                } - Pages: ${maxPage})`;
              }
            });
            lastPageReq.open(
              'GET',
              `${location.href}?mode=async&function=get_block&block_id=${o.block_id}&q=${o.q}&category_ids=${o.category_ids}&sort_by=${o.sort_by}&from_videos=${maxPage}&from_albums=${maxPage}&from=${maxPage}&from_my_videos=${maxPage}`
            );
            lastPageReq.send();
          });
          firstPageReq.open(
            'GET',
            `${location.href}?mode=async&function=get_block&block_id=${o.block_id}&q=${o.q}&category_ids=${o.category_ids}&sort_by=${o.sort_by}&from_videos=1&from_albums=1&from=1&from_my_videos=1`
          );
          firstPageReq.send();

          if (config.infiniteScroll) {
            o['page'] = 2;
            paginationEl.innerHTML = '';
            var videosWrapperEl = paginationEl.parentNode.parentNode.querySelector('.list-videos').children[0];
            videosWrapperEl.querySelectorAll('a').forEach((aEl) => {
              aEl.target = '_blank';
            });
            var createIntermediateHeader = (page) => {              
              var intermediateHeader = document.createElement('div');
              intermediateHeader.classList.add('intermediate-header');
              var intermediateHeaderSpan = document.createElement('span');
              intermediateHeaderSpan.innerText = `${page}/${maxPage}`;
              intermediateHeader.append(intermediateHeaderSpan);
              return intermediateHeader;
            }
            videosWrapperEl.prepend(createIntermediateHeader(1));
            new IntersectionObserver(function () {
              if (isLoading || o['page'] > maxPage) {
                return;
              }
              isLoading = true;
              var pageReq = new XMLHttpRequest();
              pageReq.responseType = 'document';
              pageReq.addEventListener('load', function () {
                var newItems = this.response.querySelectorAll('.item');
                newItems.forEach((el) => {
                  el.querySelector('a').target = '_blank';
                });
                videosWrapperEl.append(createIntermediateHeader(o['page'] - 1));
                videosWrapperEl.append(...this.response.querySelectorAll('.item'));
                $('.lazy-load[data-original]', videosWrapperEl).Lazy({ attribute: 'data-original' }).thumbs();
                if (config.extendItemInformation || config.removeLocked) {
                  processItems();
                }
                isLoading = false;
              });
              pageReq.open(
                'GET',
                `${location.href}?mode=async&function=get_block&block_id=${o.block_id}&q=${o.q}&category_ids=${o.category_ids}&sort_by=${o.sort_by}&from_videos=${o['page']}&from_albums=${o['page']}&from=${o['page']}&from_my_videos=${maxPage}`
              );
              pageReq.send();
              o['page']++;
            }).observe(paginationEl);
          }
        } else if (h2El) {
          if (h2El.innerText.includes('(')) {
            h2El.innerText = h2El.innerText.substr(0, h2El.innerText.indexOf('('));
          }
          h2El.innerText += ` (Results: ${boxEl.querySelectorAll('.item').length} - Pages: 1)`;
        }
      });
    }

    if (config.muteVideoOnLoad && typeof flowplayer !== 'undefined') {
      var wait = setInterval(() => {
        if (flowplayer() && !flowplayer().muted) {
          flowplayer().mute();
          clearInterval(wait);
        }
      }, 100);
    }
  };

  var domUpdateDelay;
  new MutationObserver(() => {
    clearTimeout(domUpdateDelay);
    domUpdateDelay = setTimeout(() => {
      onDomUpdate();
    }, 10);
  }).observe(document, { attributes: false, childList: true, subtree: true });
}

var scriptEl = document.createElement('script');
scriptEl.appendChild(
  document.createTextNode('(' + injectedScript + ')(' + JSON.stringify(config) + ', ' + JSON.stringify(icons) + ');')
);
(document.body || document.head || document.documentElement).appendChild(scriptEl);

if (config.customStyles) {
  var customStylesEl = document.createElement('style');
  customStylesEl.textContent = `
    body {
      --cols: 2;
    }

    @media only screen and (min-width: 600px) {
      body {
        --cols: 3;
      }
    }

    @media only screen and (min-width: 900px) {
      body {
        --cols: 4;
      }
    }
    
    html {
      background: #202020;
    }
    
    .logo a {
      filter: brightness(0) invert(1);
    }

    .list-videos > div:not(#list_videos_my_uploaded_videos_items),
    .list-albums > div,
    .list-members > div:not(#list_members_my_friends_items),
    .list-members > div > form,
    .list-videos > div > form {
      display: grid;
      grid-template-columns: repeat(var(--cols), 1fr);
      gap: 5px;
      margin: 0;
    }

    .list-videos .item,
    .list-albums .item,
    .list-members .item,
    .list-members .item,
    .list-videos .item {
      width: auto !important;
      padding: 5px !important;
      margin: 0 !important;
      background: rgba(0,0,0,0.3);
      border-radius: 5px;
    }

    .list-videos .item:hover,
    .list-albums .item:hover,
    .list-members .item:hover,
    .list-members .item:hover,
    .list-videos .item:hover {
      background: rgba(0,0,0,0.7);
    }

    #list_videos_my_uploaded_videos_items,
    #list_members_my_friends_items{
    	margin: 0;
    }

    .list-videos > div > *:not(div):not(form) {
      display: none;
    }

    .item .img {
      width: auto;
      height: auto;
      margin: -5px -5px 0;
      border-radius: 5px;
      aspect-ratio: 1.33;
    }

    .item .title,
    .item .wrap {
      margin-left: 0;
      margin-right: 0;
      height: auto;
    }
  
    .item .line-private {
      width: auto;
      max-width: calc(100% - 24px);
      padding: 4px 8px;
      border-radius: 8px;
      bottom: 4px;
      right: 4px;
      left: auto;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    
    .item .loader {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, .4);
      color: white;
      transition: opacity .3s;      
    }
    
    .item .loader svg {
      fill: currentcolor;
      width: 26px;
      height: 26px;
      animation: spin 1s linear infinite;
    }
    
    .box {
      background: transparent;
      padding: 0;
    }
    
    .intermediate-header {
      display: flex;
      color: rgba(255,255,255,.1);
      font-size: 4rem;
      line-height: 4rem;
      font-weight: 800;
      text-transform: uppercase;
      grid-column-start: 1;
      grid-column-end: 5;
      perspective: 50px;
      perspective-origin: left;
    }
    
    .intermediate-header:not(:first-child) {
      margin-top: 12px;
    }
    
    .intermediate-header span {
      transform: rotateY(10deg);
      transform-origin: left;
    }
  `;
  (document.body || document.head || document.documentElement).appendChild(customStylesEl);
}

var pluginStylesEl = document.createElement('style');
pluginStylesEl.textContent = `
  .item img {
    transition: opacity .3s cubic-bezier(0.79, 0.33, 0.14, 0.53);
  }
  
  .item .line-private:hover {
  	opacity: 1 !important;
  }

  .item .line-private.with-transition {
    transition: opacity .3s;
  }
  
  .pagination .prev,
  .pagination .next {
    display: inline;
  }
  
  .download-button svg {
    fill: currentcolor;
    height: 14px;
    vertical-align: top;
  }

  .cw-evolution-options {
    position: fixed;
    bottom: 16px;
    right: 16px;
    height: 64px;
    width: 64px;
    border-radius: 64px;
    background: #171717;
    transition: height .3s cubic-bezier(0.79, 0.33, 0.14, 0.53);
    overflow: hidden;
    opacity: 0.8;
  }

  .cw-evolution-options.opened:not(.locked) {
    height: 448px;
  }

  .cw-evolution-options.locked .icon-wrapper > button:last-child {
    animation: spin 1s linear infinite;
  }

  .cw-evolution-options.opened .icon-wrapper > button:last-child {
    transform: rotate(0);
  }

  .cw-evolution-options .icon-wrapper {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    width: 64px;
  }

  .cw-evolution-options .icon-wrapper button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 64px;
    height: 64px;
    background: transparent;
    border: none;
    padding: 0;
    border-radius: 64px;
    color: white;
    cursor: pointer;
    transition: transform .3s cubic-bezier(.51,.92,.24,1.15), color .3s cubic-bezier(0.79, 0.33, 0.14, 0.53);
  }

  .cw-evolution-options .icon-wrapper button:last-child {
    transform: rotate(90deg);
  }

  .cw-evolution-options .icon-wrapper button:not(:last-child).active {
    color: #51b523;
  }

  .cw-evolution-options .icon-wrapper button:not(:last-child):not(.active) {
    color: #e0115f;
  }

  .cw-evolution-options .icon-wrapper button svg {
    width: 26px;
    height: 26px;
    fill: currentColor;
  }

  @keyframes spin {
    100% {
      transform:rotate(360deg);
    }
  }
`;
(document.body || document.head || document.documentElement).appendChild(pluginStylesEl);

var optionsDialog = document.createElement('div');
optionsDialog.classList.add('cw-evolution-options');
var wrapper = document.createElement('div');
wrapper.classList.add('icon-wrapper');

var addButton = (icon, title, isActive, callback) => {
  var b = document.createElement('button');
  b.title = title;
  b.innerHTML = icon;
  if (isActive) {
    b.classList.add('active');
  }
  b.addEventListener('click', callback);
  wrapper.append(b);
};

var applyConfig = () => {
  localStorage.setItem('cw-evolution-config', JSON.stringify(config));
  optionsDialog.classList.add('locked');
  location.reload();
};

addButton(
  icons.lightbulb,
  'Extend videos in list views with additional Information, like the uploader name and if its a friend',
  config.extendItemInformation,
  function () {
    config.extendItemInformation = !this.classList.contains('active');
    applyConfig();
  }
);

addButton(
  icons.eraser,
  'Removes all private videos of non-friends from the liew views',
  config.removeLocked,
  function () {
    config.removeLocked = !this.classList.contains('active');
    applyConfig();
  }
);

addButton(icons.infinite, 'Converts the pagination to infinite scroll', config.infiniteScroll, function () {
  config.infiniteScroll = !this.classList.contains('active');
  applyConfig();
});

addButton(icons.mute, 'Mutes a video initially', config.muteVideoOnLoad, function () {
  config.muteVideoOnLoad = !this.classList.contains('active');
  applyConfig();
});

addButton(icons.brush, 'Adds some UI style changes', config.customStyles, function () {
  config.customStyles = !this.classList.contains('active');
  applyConfig();
});

addButton(icons.thumbsUp, 'Rate', true, function () {
  Object.assign(document.createElement('a'), {
    target: '_blank',
    rel: 'noopener noreferrer',
    href: 'https://sleazyfork.org/de/scripts/498458-camwhores-tv-evolution/feedback#post-discussion',
  }).click();
});

addButton(icons.circleNotch, '', false, () => {
  if (!optionsDialog.classList.contains('locked')) {
    optionsDialog.classList.toggle('opened');
  }
});

optionsDialog.append(wrapper);
document.body.appendChild(optionsDialog);
