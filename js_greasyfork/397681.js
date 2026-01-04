// ==UserScript==
// @name         WaniKani Pitch Accent
// @namespace    https://greasyfork.org/users/649
// @version      1.0.1
// @description  Show pitch accent data on WaniKani
// @author       Adrien Pyke
// @match        *://www.wanikani.com/vocabulary/*
// @match        *://www.wanikani.com/level/*/vocabulary/*
// @match        *://www.wanikani.com/review/session
// @match        *://www.wanikani.com/lesson/session
// @require      https://cdn.jsdelivr.net/gh/IllDepence/SVG_pitch@295af214b1e3c8add03a31cf022e28033495da08/accdb.js
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397681/WaniKani%20Pitch%20Accent.user.js
// @updateURL https://update.greasyfork.org/scripts/397681/WaniKani%20Pitch%20Accent.meta.js
// ==/UserScript==
/* global acc_dict */

(() => {
  'use strict';

  const Util = {
    q: (query, context = document) => context.querySelector(query),
    qq: (query, context = document) =>
      Array.from(context.querySelectorAll(query)),
    toMoraArray: kana => kana.match(/.[ゃゅょぁぃぅぇぉャュョァィゥェォ]?/gu),
    getAccentData: (kanji, reading) => {
      const [kana, pitch] =
        (acc_dict[kanji] && acc_dict[kanji].find(([r]) => r === reading)) || [];
      if (!kana) return [];
      return [Util.toMoraArray(kana), [...pitch.replace(/[lh]/gu, '')]];
    }
  };

  const Draw = {
    textGeneric: (x, text, color = '#666') =>
      `<text x="${x}" y="67.5" style="font-size: 20px; fill: ${color};">${text}</text>`,
    text: (x, mora) =>
      mora.length === 1
        ? Draw.textGeneric(x, mora)
        : Draw.textGeneric(x - 5, mora[0]) + Draw.textGeneric(x + 12, mora[1]),
    circle: (x, y, empty, color = '#000', emptyColor = '#eee') =>
      `
        <circle r="5" cx="${x}" cy="${y}" style="opacity: 1; fill: ${color};" />
      ` +
      (empty
        ? `<circle r="3.25" cx="${x}" cy="${y}" style="opacity: 1; fill: ${emptyColor};" />`
        : ''),
    path: (x, y, type, stepWidth, color = '#000') =>
      `
      <path d="m ${x},${y} ${stepWidth},${
        { s: 0, u: -25, d: 25 }[type]
      }" style="fill: none; stroke: ${color}; stroke-width: 1.5;" />
    `,
    svg: (kanji, reading) => {
      const [mora, pitch] = Util.getAccentData(kanji, reading);
      if (!mora) return;

      const stepWidth = 35;
      const marginLr = 16;
      const positions = Math.max(mora.length, pitch.length);
      const svgWidth = Math.max(0, (positions - 1) * stepWidth + marginLr * 2);
      const getXCenter = step => marginLr + step * stepWidth;
      const getYCenter = type => (type === 'H' ? 5 : 30);

      const chars = mora
        .map((kana, i) => Draw.text(getXCenter(i) - 11, kana))
        .join('');
      const paths = pitch
        .slice(1)
        .map((type, i) => ({
          prevXCenter: getXCenter(i),
          prevYCenter: getYCenter(pitch[i]),
          yCenter: getYCenter(type)
        }))
        .map(({ prevXCenter, prevYCenter, yCenter }) =>
          Draw.path(
            prevXCenter,
            prevYCenter,
            prevYCenter < yCenter ? 'd' : prevYCenter > yCenter ? 'u' : 's',
            stepWidth
          )
        )
        .join('');
      const circles = pitch
        .map((type, i) =>
          Draw.circle(getXCenter(i), getYCenter(type), i >= mora.length)
        )
        .join('');

      return `
        <svg width="${svgWidth}px" height="75px" viewBox="0 0 ${svgWidth} 74">
          ${chars + paths + circles}
        </svg>
      `.trim();
    }
  };

  const addSvgToGroup = (group, kanji, marginTop) => {
    const svg = Draw.svg(
      kanji,
      Util.q('.pronunciation-variant', group).textContent
    );
    if (!svg) return;
    const div = document.createElement('div');
    div.style.marginTop = marginTop;
    div.innerHTML = svg;
    group.appendChild(div);
  };

  const isLesson = window.location.pathname.includes('/lesson/');
  const isReview = window.location.pathname.includes('/review/');
  const isVocab = !isLesson && !isReview;

  waitForElems({
    sel: '.pronunciation-group',
    onmatch: group =>
      addSvgToGroup(
        group,
        Util.q(
          isVocab
            ? '.vocabulary-icon'
            : isLesson
            ? '#character'
            : '#character > span'
        ).textContent,
        isVocab ? 0 : '10px'
      )
  });
})();
