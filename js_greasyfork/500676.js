// ==UserScript==
// @name         クイズバースアール店舗切り替えショートカット (Quizbar Suahl Switcher)
// @name:ja      クイズバースアール店舗切り替えショートカット
// @name:en      Quizbar Suahl Switcher: クイズバースアール店舗切り替えショートカット
// @namespace    https://greasyfork.org/ja/users/570127
// @version      2025.12.25.1
// @description  クイズバースアールの予約カレンダー等の切り替えキーボードショートカット a:秋葉原, i:池袋, k:蒲田, o:大阪, n:名古屋, d:日, w:週
// @description:ja クイズバースアールの予約カレンダー等の切り替えキーボードショートカット a:秋葉原, i:池袋, k:蒲田, o:大阪, n:名古屋, d:日, w:週
// @description:en Switch Area of Quizbar Suahl (@Japan) by key shortcut
// @author       universato
// @match        https://airrsv.net/quizbar-suahl-*/*
// @match        https://suahl.com/shoplist/*
// @match        https://suahl.com/recruit/*
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/x3nhc57m9iw500zq0ztgo6ovm1lu
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500676/%E3%82%AF%E3%82%A4%E3%82%BA%E3%83%90%E3%83%BC%E3%82%B9%E3%82%A2%E3%83%BC%E3%83%AB%E5%BA%97%E8%88%97%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%20%28Quizbar%20Suahl%20Switcher%29.user.js
// @updateURL https://update.greasyfork.org/scripts/500676/%E3%82%AF%E3%82%A4%E3%82%BA%E3%83%90%E3%83%BC%E3%82%B9%E3%82%A2%E3%83%BC%E3%83%AB%E5%BA%97%E8%88%97%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%20%28Quizbar%20Suahl%20Switcher%29.meta.js
// ==/UserScript==

console.log(`【UserScript】Quizbar Suahl Switcher (hostname: ${location.hostname})`);

// Shortcuts to switch by shortcut key
(function() {
  'use strict';

  const locationMap = {
    a: 'akihabara',
    i: 'ikebukuro',
    k: 'kamata',
    o: 'osaka',
    n: 'nagoya',
  };

  document.addEventListener('keydown', function (event) {

    // console.log(`[Quizbar Suahl Switcher]: ${event.key}`);

    const paths = location.pathname.split('/');

    // airrsv.netの個別ページは、キーショートカットが動作しないように除外する。
    // true  ← 一覧:airrsv.net/quizbar-suahl-akihabara/calendar
    // false ← 個別:airrsv.net/quizbar-suahl-akihabara/calendar/menuDetail/?schdlId=T003D81DDC
    if(location.hostname === 'airrsv.net' && !paths[2].match(/calendar|policy|contact/) && paths[3] === 'menuDetail'){
      return;
    }

    // テキストエリア内の入力であれば、終了。
    const activeElement = document.activeElement;
    if (activeElement.isContentEditable) return;
    if (activeElement.tagName === 'INPUT') return;
    if (activeElement.tagName === 'TEXTAREA') return;

    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.isComposing) return;
    if (event.repeat) return;

    // a:秋葉原, i:池袋, k:蒲田, o:大阪, n:名古屋, d:日, w:週
    const allowedKeys = ['a','i','k','o','n','d','w','ArrowLeft','ArrowRight'];
    if (!allowedKeys.includes(event.key)) return;

    const actionMap = {
        ArrowLeft: 'li.ctlListItem.listPrev',
        ArrowRight: 'li.ctlListItem.listNext',
        d: '#btnDay',
        w: '#btnWeek',
    };

    const selector = actionMap[event.key];
    if(selector){
        document.querySelector(selector)?.click();
        return;
    }

    let currentLocation;
    if(location.hostname === 'suahl.com' && activeTagName !== 'IFRAME'){
      currentLocation = paths[2];
    }else{
      currentLocation = paths[1].split('-')[2];
    }

    const nextLocation = locationMap[event.key];
    if(!currentLocation || !nextLocation){ return; }
    if(currentLocation === nextLocation){ return; }

    location.href = location.href.replace(currentLocation, nextLocation);

  }, false);
})();
