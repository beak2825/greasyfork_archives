// ==UserScript==
// @name         MATRIX RESORTED
// @namespace    https://github.com/segabito/
// @version      0.0.6
// @description  ランキングの動画を「投稿が新しい順」に並び変える
// @author       segabito macmoto
// @match        *://www.nicovideo.jp/ranking*
// @grant        none
// @run-at       document-start
// @noframes
// @license      public domain
// @downloadURL https://update.greasyfork.org/scripts/386884/MATRIX%20RESORTED.user.js
// @updateURL https://update.greasyfork.org/scripts/386884/MATRIX%20RESORTED.meta.js
// ==/UserScript==

(function() {
  'use strict';
    const sortMatrix = app => {
      const data = JSON.parse(app.dataset.app);
      const lanes = data.lanes;
      const column = 'registeredAt';
      const ad = -1;
      const callback = (a, b) => (a[column] < b[column] ? -1 : 1) * ad;

      lanes.forEach(lane => {
        lane.videoList.filter(v => !v._originalIndex).forEach((v, i) => {
          v._originalIndex = i + 1;
          v.title = `${(i + 1).toString().padStart(3, '0')}. ${v.title}`;
        });
        lane.videoList.sort(callback);
      });
      app.setAttribute('data-app', JSON.stringify(data, null, 2));
    }

    const sortSingle = () => {
      const videos = Array.from(document.querySelectorAll('.MediaObject.RankingMainVideo'));
      videos.forEach(v => { v.date = v.querySelector('.RankingMainVideo-metaItem:last-child').textContent.trim()});
      videos.sort((a, b) => a.date < b.date ? 1 : -1);
      videos.forEach((v, i) => {
        const rank = i + 1;
        const originalRank = v.querySelector('.RankingRowRank').textContent * 1;
        const t = v.querySelector('.RankingMainVideo-title');
        const title = t.textContent;
        v.querySelector('.RankingRowRank').textContent = `${rank}`;
        t.textContent = `${originalRank.toString().padStart(3, '0')}. ${title}`;
      });
      const frag = document.createDocumentFragment();
      frag.append(...videos);
      document.querySelector('.RankingVideoListContainer').prepend(frag);
    };

    const _ruler_ = `
      <style>
        .jump-ruler {
          position: fixed;
          top: 30vh;
          right: 24px;
          border: 1px solid #888;
          border-width: 0px 1px 0px 0;
          height: 40vh;
          min-width: 48px;
          white-space: nowrap;
          user-select: none;
          cursor: pointer;
        }
        .jump-ruler-label {
          position: absolute;
          width: 100%;
          text-align: right;
          font-size: 16px;
          font-weight: bold;
          font-style: italic;
          color: #888;
          cursor: pointer;
          transform: translateY(-50%);
        }
        .jump-ruler-label:hover {
          background: #888;
          color: #fff;
        }

        .jump-ruler-label[data-param="1"] {
        }
        .jump-ruler-label[data-param="25"] {
          top: 25%;
        }
        .jump-ruler-label[data-param="50"] {
          top: 50%;
        }
        .jump-ruler-label[data-param="75"] {
          top: 75%;
        }
        .jump-ruler-label[data-param="100"] {
          top: 100%;
        }
      </style>
      <div class="jump-ruler" data-command="relative-scroll">
        <div class="jump-ruler-label"
            data-command="scrollTo"
            data-param="1">1 -</div>
        <div class="jump-ruler-label"
            data-command="scrollTo"
            data-param="25">25 -</div>
        <div class="jump-ruler-label"
            data-command="scrollTo"
            data-param="50">50 -</div>
        <div class="jump-ruler-label"
            data-command="scrollTo"
            data-param="75">75 -</div>
        <div class="jump-ruler-label"
            data-command="scrollTo"
            data-param="100">100 -</div>
      </div>
    `;

    const scrollTo = rank => {
      const target = Array.from(document.querySelectorAll('.RankingRowRank'));
      if (!target.length || !target[rank - 1]) {
        return;
      }

      target[rank - 1].scrollIntoView({behavior: 'instant', block: 'start', inline: 'center'});
      document.documentElement.scrollTop -= 120;
    };

    const initRuler = () => {
      document.body.insertAdjacentHTML('beforeend', _ruler_);
      const ruler = document.querySelector('.jump-ruler');

      ruler.addEventListener('click', e => {
        const target = e.target.closest('[data-command]');
        if (!target) {
          return;
        }
        const {command, param} = target.dataset;
        if (!command) {
          return;
        }
        switch (command) {
          case 'scrollTo':
            scrollTo(param * 1);
            break;
          case 'relative-scroll':
            const rank = Math.round(e.offsetY / target.getBoundingClientRect().height * 100);
            scrollTo(rank);
            break;
        }
        e.preventDefault();
        e.stopPropagation();
      });
    };

    if (document.body.classList.contains('MatrixRanking-body') && !document.gi) {
      document.gi = document.getElementById;
      document.getElementById = function(id) {
        if (id === 'MatrixRanking-app') {
          console.info('%cMATRIX RESORTED',`
            font-size: 150%;
            letter-spacing: 120%;
            background: black;
            color: lightgreen;
            font-family: "Baskerville","Arial Black";
            padding: 4px 8px;
            text-shadow:
              2px 0 4px rgba(0, 255, 0, 0.5),
              -2px 0 4px rgba(0, 255, 0, 0.5),
              4px 0 4px rgba(0, 255, 0, 0.5),
              -4px 0 4px rgba(0, 255, 0, 0.5)
          `);
          const elm = document.gi(id);
          sortMatrix(elm);
          document.getElementById = document.gi;
          delete document.gi;
          return elm;c
        }
        return document.gi(id);
      };
    }

    window.addEventListener('DOMContentLoaded', () => {
      if (document.querySelector('.RankingVideoListContainer')) {
        sortSingle();
        initRuler();
        window.dispatchEvent(new CustomEvent('MatrixResorted'));
      } else
      if (document.body.classList.contains('MatrixRanking-body')) {
        initRuler();
      }
    });
})();


