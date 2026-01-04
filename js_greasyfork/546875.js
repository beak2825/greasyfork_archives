// ==UserScript==
// @name         Mortal Bad Move Analyzer v2.0 (≤5 only)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  bad move rate analyzer (≤5 only) with detailed rate display
// @author       You
// @match        https://mjai.ekyu.moe/*
// @icon         https://mjai.ekyu.moe/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546875/Mortal%20Bad%20Move%20Analyzer%20v20%20%28%E2%89%A45%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546875/Mortal%20Bad%20Move%20Analyzer%20v20%20%28%E2%89%A45%20only%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const waitForElement = (selector, timeout = 10000) => {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        observer.disconnect();
        reject(`Timeout: ${selector} not found`);
      }, timeout);
    });
  };

  const analyzeBadMoves = () => {
    const getDahaiStr = (el) =>
      el.innerHTML
        .replaceAll('<span class="role">プレイヤー: </span>', '')
        .replaceAll('<span class="role">Player: </span>', '')
        .replaceAll('<span class="role">작사: </span>', '')
        .replaceAll('<span class="role">玩家: </span>', '')
        .replaceAll('<svg class="tile">', '')
        .replaceAll('<use class="face" href="', '')
        .replaceAll('"></use>', '')
        .replaceAll('</svg>', '')
        .replaceAll(' ', '');

    const getMortalSelects = (rows) => {
      const list = [];
      rows.forEach((r) => {
        const recommendInt = r.querySelectorAll('td')[2].querySelectorAll('span')[0].innerHTML;
        const recommendFrac = r.querySelectorAll('td')[2].querySelectorAll('span')[1].innerHTML;
        list.push({
          dahai: getDahaiStr(r.querySelectorAll('td')[0]),
          recommendation: parseFloat(recommendInt + recommendFrac)
        });
      });
      return list;
    };

    const getTehaiState = (tiles) => {
      let tehai = [];
      let draw = { kind: 'after-fu-ro', from: null, pai: null };

      tiles.forEach((p) => {
        const from = p.getAttribute('before');
        const paiHref = p.querySelector('svg > use').getAttribute('href');
        if (from?.includes('自摸') || from?.includes('Draw') || from?.includes('쯔모')) {
          draw = { kind: 'tsumo', from: 'jicha', pai: paiHref };
        } else if (from?.includes('上家打') || from?.includes('Kamicha') || from?.includes('상가')) {
          draw = { kind: 'fu-ro', from: 'kamicha', pai: paiHref };
        } else if (from?.includes('対面打') || from?.includes('Toimen') || from?.includes('대면') || from?.includes('对家打')) {
          draw = { kind: 'fu-ro', from: 'toimen', pai: paiHref };
        } else if (from?.includes('下家打') || from?.includes('Shimocha') || from?.includes('하가')) {
          draw = { kind: 'fu-ro', from: 'shimocha', pai: paiHref };
        } else {
          tehai.push(paiHref);
        }
      });
      return { tehai, draw };
    };

    const pageBody = document.body;
    const hanchan = { url: location.href, rounds: [] };
    const rounds = pageBody.querySelectorAll('section');

    rounds.forEach((round) => {
      const turns = [];
      const turnDetails = Object.values(round.querySelectorAll('div > details')).slice(3);

      turnDetails.forEach((detail) => {
        const paiEls = detail.querySelectorAll('ul > li');
        const dahaiEl = Object.values(detail.querySelectorAll('span')).find((e) => e.className === 'role')?.parentElement;
        const mortalRows = detail.querySelectorAll('details > table > tbody > tr');

        const textFragment = detail
          .querySelector('summary')
          .innerHTML.replace(/<span.*?>/g, '').replace(/<\/span>/g, '').trim();

        const turnId = `turn-${Math.random().toString(36).substr(2, 9)}`;
        detail.setAttribute('id', turnId);

        turns.push({
          summary: detail.querySelector('summary').innerHTML.replace(/<span.*/, ''),
          url: `#${turnId}`,
          linkName: textFragment,
          tehaiState: getTehaiState(paiEls),
          dahai: getDahaiStr(dahaiEl),
          mortalSelects: getMortalSelects(mortalRows)
        });
      });

      hanchan.rounds.push({
        id: round.querySelector('h1 > div > a').getAttribute('href'),
        name: round.querySelector('h1 > div > a').innerHTML,
        turns
      });
    });

    let dahaiCount = 0;
    let missCount5 = 0;
    let furoCount = 0;

    const missList = pageBody.querySelectorAll('fieldset > label')[4];
    const isEng = document.querySelector('body > h1').innerHTML === 'Replay Examination';

    missList.insertAdjacentHTML(
      'beforeend',
      `<br><span style="font-weight:700">${isEng ? 'Bad move (≤5):' : '悪手リスト (≤5):'}</span><div id="bad5"></div>`
    );

    const bad5Div = document.getElementById('bad5');

    hanchan.rounds.forEach((round) => {
      round.turns.forEach((turn) => {
        let recommendation = 0;
        turn.mortalSelects.forEach((ms) => {
          if (turn.dahai === ms.dahai) recommendation = ms.recommendation;
        });

        dahaiCount++;
        if (turn.tehaiState.draw.kind !== 'fu-ro') {
          if (recommendation <= 5) {
            missCount5++;
            bad5Div.insertAdjacentHTML(
              'beforeend',
              `<br><a href="${turn.url}" class="jumpLink" data-target="${turn.url.slice(1)}">
                ${round.name}${turn.linkName} &nbsp;&nbsp;(rec:${recommendation})
               </a>`
            );
          }
        } else {
          furoCount++;
        }
      });
    });

    // --- 통계 및 화면 표시 로직 ---
    const denom = (dahaiCount - furoCount) || 1;
    const ratePercentage = ((missCount5 / denom) * 100).toFixed(2);
    // [요청사항] 악수수/전체수 = 악수율% 형식으로 생성
    const detailedRate = `${ratePercentage}%`;

         // `${missCount5}/${denom} = ${ratePercentage}%`;

    pageBody.querySelectorAll('details > dl > dt').forEach((meta) => {
      if (meta.innerHTML.includes('mjai-reviewer')) {
        meta.insertAdjacentHTML(
          'beforebegin',
          `<dt>Bad move rate </dt><dd>${detailedRate}</dd>`
        );
      }
    });

    // --- 클릭 이벤트 (보라색 강조 적용 및 중복 제거) ---
    document.querySelectorAll('.jumpLink').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();

        // [추가] 클릭한 리스트의 글자 색상을 보라색으로 변경
        link.style.color = '#8A2BE2';
        link.style.fontWeight = 'bold';

        const targetId = link.getAttribute('data-target');
        const target = document.getElementById(targetId);

        if (target) {
          target.open = true;
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // 패보 화면(타겟)의 배경색 하이라이트 (기존 노란색 유지)
          target.style.transition = 'background-color 0.5s';
          target.style.backgroundColor = 'rgba(255, 230, 150, 0.6)';
          setTimeout(() => {
              target.style.transition = 'background-color 2.4s';
              target.style.backgroundColor = '';
          }, 1000);
        }
      });
    });

    console.debug(`총:${dahaiCount}, 부로:${furoCount}, ≤5:${missCount5}, 악수율:${detailedRate}`);
  };

  waitForElement('details > dl > dt')
    .then(() => setTimeout(analyzeBadMoves, 500))
    .catch(console.error);

})();