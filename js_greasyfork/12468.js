// ==UserScript==
// @name        25 Channel Video Demultiplexer
// @namespace   https://github.com/segabito/
// @description ランキングにあるチャンネル動画を右に分離するやつ
// @include     *://www.nicovideo.jp/ranking/*
// @version     1.1.3
// @grant       none
// @run-at      document-start
// @noframes
// @license     public domain
// @downloadURL https://update.greasyfork.org/scripts/12468/25%20Channel%20Video%20Demultiplexer.user.js
// @updateURL https://update.greasyfork.org/scripts/12468/25%20Channel%20Video%20Demultiplexer.meta.js
// ==/UserScript==

(() => {
  const monkey = () => {

    const addStyle = function(styles, id) {
      const elm = document.createElement('style');
      elm.type = 'text/css';
      if (id) { elm.id = id; }

      elm.append(document.createTextNode(styles.toString()));
      (document.head || document.documentElement).append(elm)
      return elm;
    };

    const css = `
      .BaseRankingContentContainer-channel {
        font-size: 13px;
        position: relative;
      }
      .BaseRankingContentContainer-channel .MediaObject.RankingMainVideo {
        box-shadow: none !important;
        border-radius: none !important;
        margin-bottom: 16px;
        pointer-events: none;
      }

      .BaseRankingContentContainer-channel .RankingRowRank {
        right: 0;
        pointer-events: none;
        user-select: none;
        left: auto;
        transform: none;
        opacity: 0.8;
      }
      .BaseRankingContentContainer-channel .MediaObject-image {
        pointer-events: auto;
      }
      .BaseRankingContentContainer-channel .MediaObject.RankingMainVideo .Thumbnail {
        width: 96px;
        border-radius: 4px;
      }
      .BaseRankingContentContainer-channel [data-nicoad-grade] .Thumbnail.VideoThumbnail .Thumbnail-image {
        margin: 2px;
        background-size: calc(100% + 4px);
      }

      .BaseRankingContentContainer-channel [data-nicoad-grade] .Thumbnail.VideoThumbnail:after {
        background-size: 48px 48px;
        width: 24px;
        height: 24px;
        border-radius: none;
      }
      .BaseRankingContentContainer-channel .VideoThumbnailComment {
        display: none;
      }
      .BaseRankingContentContainer-channel .Thumbnail.VideoThumbnail .VideoLength {
        position: absolute;
        bottom: 0px;
        right: 2px;
        padding: 0;
      }

      .BaseRankingContentContainer-channel .MediaObject.RankingMainVideo .MediaObject-body {
        top: 0;
        left: 96px;
        bottom: 0;
      }
      .BaseRankingContentContainer-channel .MediaObject.RankingMainVideo .RankingMainVideo-title {
        font-size: 13px;
        pointer-events: none;
      }
      .BaseRankingContentContainer-channel .MediaObject.RankingMainVideo .RankingMainVideo-meta .RankingMainVideo-metaItem:first-child {
        display: none;
      }
      .BaseRankingContentContainer-channel .MediaObject.RankingMainVideo .RankingMainVideo-meta .RankingMainVideo-metaItem {
        width: 100%;
        text-align: right;
        font-size: 12px;
      }
      .BaseRankingContentContainer-channel .MediaObject.RankingMainVideo .RankingMainVideo-description {
        display: none;
      }

      .BaseRankingContentContainer.BaseRankingContentContainer-channel.is-sticky {
        position: sticky;
        top: 36px;
        z-index: 1000;
        box-shadow: 2px 2px #888;
        border: 1px solid #ccc;
      }
      body.nofix .BaseRankingContentContainer.BaseRankingContentContainer-channel.is-sticky {
        top: 0;
      }
      .BaseRankingContentContainer-channel.is-sticky .BaseRankingContentContainer-main {
        background: #fafafa;
        max-height: 60vh;
        overflow-y: scroll;
        overflow-x: hidden;
        overscroll-behavior: contain;
      }

      .BaseRankingContentContainer [data-title]:not([disabled]):hover:after {
        display: none;
      }
      .BaseRankingContentContainer-channel .BaseRankingContentContainer-main::-webkit-scrollbar {
        background: #e5e5e5;
      }

      .BaseRankingContentContainer-channel .BaseRankingContentContainer-main::-webkit-scrollbar-thumb {
        border-radius: 0;
        background: #999;
      }

      .BaseRankingContentContainer-channel .BaseRankingContentContainer-main::-webkit-scrollbar-button {
        background: #999;
        display: none;
      }

      .BaseRankingContentContainer-channel .toggle-sticky-button {
        position: absolute;
        background: transparent;
        right: 0;
        top: 0;
        border: none;
        outline: none;
        cursor: pointer;
        font-size: 22px;
        filter: grayscale(50%);
      }
      .is-sticky .toggle-sticky-button {
        filter: none;
      }
    `;
    const container = `
      <section class="BaseRankingContentContainer BaseRankingContentContainer-channel is-sticky demultiplexer">
        <header>
        <button type="button" class="toggle-sticky-button" data-command="toggle-sticky">
          &#128204;
        </button>
        <h1>チャンネル動画</h1>
        </header>
        <div class="BaseRankingContentContainer-main">
        </div>
      </section>
    `;

    const initElement = () => {
      let element = document.querySelector('.BaseRankingContentContainer.BaseRankingContentContainer-channel.demultiplexer');
      if (element) {
        return element;
      }
      console.log('run %c"25 Channel Video Demultiplexer"', `
        font-size: 150%;
        font-family: "Apple SD Gothic Neo";
        color: black;
        text-shadow: 2px 2px 0 #ccc;
      `);

      addStyle(css);
      document.querySelector('.SpecifiedRanking-sub').insertAdjacentHTML('afterbegin', container);
      element = document.querySelector('.BaseRankingContentContainer.BaseRankingContentContainer-channel');
      element.addEventListener('click', e => {
        const target = e.target.closest('[data-command]');
        if (!target) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        const {command, param} = target.dataset;
        switch (command) {
          case 'toggle-sticky':
            localStorage['sticky-channel'] =
              element.classList.contains('is-sticky') ? '0' : '1';
            element.classList.toggle('is-sticky', localStorage['sticky-channel'] === '1');
          break;
          default:
            return;
        }
      });
      element.classList.toggle('is-sticky', localStorage['sticky-channel'] !== '0');
      return element;
    };

    const update = (e) => {
      const items = document.querySelectorAll('.SpecifiedRanking-main .MediaObject.RankingMainVideo[data-video-id^="so"]');
      if (!items.length) {
        return false;
      }

      initElement().querySelector('.BaseRankingContentContainer-main').append(...items);
      return true;
    };

    window.ChannelVideoDemultiplexer = { update };
    update();
    window.addEventListener('MatrixResorted', update, {once: true});
  };

  window.addEventListener('DOMContentLoaded', monkey);
})();
