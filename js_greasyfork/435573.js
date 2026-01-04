// ==UserScript==
// @name         新しい放置ゲームで注意した方がいい情報を表示する
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  新しい放置ゲームで注意した方がいい情報を表示します
// @author       toomer
// @match        https://dem08656775.github.io/newincrementalgame*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435573/%E6%96%B0%E3%81%97%E3%81%84%E6%94%BE%E7%BD%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%81%A7%E6%B3%A8%E6%84%8F%E3%81%97%E3%81%9F%E6%96%B9%E3%81%8C%E3%81%84%E3%81%84%E6%83%85%E5%A0%B1%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/435573/%E6%96%B0%E3%81%97%E3%81%84%E6%94%BE%E7%BD%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%81%A7%E6%B3%A8%E6%84%8F%E3%81%97%E3%81%9F%E6%96%B9%E3%81%8C%E3%81%84%E3%81%84%E6%83%85%E5%A0%B1%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

// jshint esversion: 6
(() => {
  'use strict';
  const D = (value) => new Decimal(value);
  const ctx = document.getElementById('app').__vue_app__._instance.ctx;

  function isChallengeActive(index) {
    return ctx.player.onchallenge && ctx.player.challenges.includes(index);
  }
  function isChallengeBonusActive(index) {
    return ctx.player.challengebonuses.includes(4) || !ctx.player.onchallenge ? ctx.player.challengebonuses.includes(index) : false;
  }
  function isRankChallengeBonusActive(index) {
    return ctx.player.rankchallengebonuses.includes(index);
  }

  function isGeneratorBuyable(index) {
    if (isChallengeActive(6)) if (index == 3 || index == 7) return false;
    return ctx.player.money.gte(ctx.player.generatorsCost[index]);
  }
  function isAcceleratorOpened(index) {
    if (index >= 1 && ctx.player.levelresettime.lte(0)) return false;
    if (index >= 2 && ctx.player.levelitems[3] + 1 < index) return false;
    return true;
  }
  function isAcceleratorBuyable(index) {
    if (isChallengeActive(5)) return false;
    if (!isAcceleratorOpened(index)) return false;
    return ctx.player.money.gte(ctx.player.acceleratorsCost[index]);
  }
  function isDarkGeneratorBuyable(index) {
    return ctx.player.money.gte(ctx.player.darkgeneratorsCost[index]);
  }

  const base_style = `
.nigi-tooltip {
  position: relative;
  padding: 1px 3px;

  font-size: 20px;
}

.nigi-tooltip:hover:after {
  content: attr(tooltip-msg);
  position: absolute;
  z-index: 1;

  background-color: black;
  color: white;
  text-align: center;
  white-space: nowrap;
  padding: 5px 5px;
  border-radius: 6px;
}`;
  document.getElementsByTagName('head')[0].insertAdjacentHTML('afterbegin', `<style type="text/css" id="nigi-style">${base_style}</style>`);
  document.getElementsByTagName('body')[0].insertAdjacentHTML('afterbegin', '<div id="nigi-header"></div>');

  const header = document.getElementById('nigi-header');
  const style = document.getElementById('nigi-style');
  let prev_exported_time = Date.now();
  let prev_exported = '';

  const checkMarkStyle = (id, content) => {
    return `
#${id} button {
  position: relative;
}
#${id} button::before {
  content: '';
  display: block;
  position: absolute;
  top: .5em;
  left: 1.5em;
  width: 15px;
  height: 5px;
  border-left: 2px solid #25AF01;
  border-bottom: 2px solid #25AF01;
  transform: rotate(-45deg);
}
#${id} button:hover:after {
  content: '${content}';
  position: absolute;
  z-index: 1;

  font-size: 16px;
  background-color: black;
  color: white;
  text-align: center;
  white-space: nowrap;
  padding: 5px 5px;
  border-radius: 6px;
}`;
  };

  const update = () => {
    let contents = '';
    let stylestr = base_style;

    const buyableGenerators = [...Array(8)].map((_, i) => i).filter(i => isGeneratorBuyable(i));
    if (buyableGenerators.length > 0) {
      contents += `<span class="nigi-tooltip" tooltip-msg="発生器を購入可能">発${buyableGenerators.reduce((s, i) => s + (i + 1), '')}</span>`;
    }

    const buyableAccelerators = [...Array(8)].map((_, i) => i).filter(i => isAcceleratorBuyable(i));
    if (buyableAccelerators.length > 0) {
      contents += `<span class="nigi-tooltip" tooltip-msg="時間加速器を購入可能">時${buyableAccelerators.reduce((s, i) => s + (i + 1), '')}</span>`;
    }

    const buyableDarkGenerators = [...Array(8)].map((_, i) => i).filter(i => isDarkGeneratorBuyable(i));
    if (buyableDarkGenerators.length > 0) {
      contents += `<span class="nigi-tooltip" tooltip-msg="裏発生器を購入可能">裏${buyableDarkGenerators.reduce((s, i) => s + (i + 1), '')}</span>`;
    }

    if (ctx.player.generatorsMode.some((m, i) => m != i)) {
      if (!isChallengeActive(3) && !isChallengeBonusActive(13))
        contents += `<span class="nigi-tooltip" tooltip-msg="発生器のモードが最大でない">モ</span>`;
    }

    const challengeid = ctx.calcchallengeid();
    if (ctx.player.onchallenge) {
      if (ctx.player.challengecleared.includes(challengeid)) {
        stylestr += checkMarkStyle('levelreset', '挑戦達成済です');
      } else {
        contents += `<span class="nigi-tooltip" tooltip-msg="挑戦未達成">段</span>`;
      }
      if (ctx.player.challengecleared.length >= 128)
        if (ctx.player.rankchallengecleared.includes(challengeid)) {
          stylestr += checkMarkStyle('rankreset', '階位挑戦達成済です');
        } else {
          contents += `<span class="nigi-tooltip" tooltip-msg="階位挑戦未達成">階</span>`;
        }
      if (ctx.player.challengecleared.length >= 9 && !ctx.player.challengebonuses.includes(4))
        contents += `<span class="nigi-tooltip" tooltip-msg="挑戦中にもかかわらず効力5が有効でない">効5</span>`;
    } else if (challengeid > 0) {
      let message = '';
      if (!ctx.player.challengecleared.includes(challengeid))
        message += `挑戦`;
      if (ctx.player.challengecleared.length >= 128 && !ctx.player.rankchallengecleared.includes(challengeid))
        message += (message === '' ? '' : '・') + `階位挑戦`;
      if (message !== '')
        contents += `<span class="nigi-tooltip" tooltip-msg="選択中の${message}未達成">挑</span>`;
    }

    if (ctx.player.shine > 0 && ctx.player.shine >= ctx.shinedata.getmaxshine(ctx.player.challengecleared.length))
      contents += `<span class="nigi-tooltip" tooltip-msg="輝きが満タンです">輝</span>`;

    if (ctx.player.brightness > 0 && ctx.player.brightness >= ctx.shinedata.getmaxbr(ctx.player.rankchallengecleared.length))
      contents += `<span class="nigi-tooltip" tooltip-msg="煌きが満タンです">煌</span>`;

    if (ctx.exported != prev_exported) {
      prev_exported = JSON.parse(JSON.stringify(ctx.exported));
      prev_exported_time = Date.now();
    }
    if (Date.now() - prev_exported_time >= 3600 * 1000 * 6 || ctx.exported == '' && Date.now() - prev_exported_time >= 3600 * 1000)
      contents += `<span class="nigi-tooltip" tooltip-msg="長時間データ吐き出しされていない">バ</span>`;

    if (style.innerHTML != stylestr) style.innerHTML = stylestr;
    if (header.innerHTML != contents) header.innerHTML = contents;
    setTimeout(update, 300);
  };

  update();
})();