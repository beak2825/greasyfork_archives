// ==UserScript==
// @name         小説家になろう 検索フィルター
// @namespace    https://mypage.syosetu.com/348820/
// @version      1.0
// @description  様々な評価基準によって「小説家になろう」に投稿されている作品の検索ページをフィルタリングします。手動ブロック機能も搭載。
// @author       hikoyuki(ChatGPT)
// @match        https://yomou.syosetu.com/search.php*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536449/%E5%B0%8F%E8%AA%AC%E5%AE%B6%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%20%E6%A4%9C%E7%B4%A2%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/536449/%E5%B0%8F%E8%AA%AC%E5%AE%B6%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%20%E6%A4%9C%E7%B4%A2%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%83%BC.meta.js
// ==/UserScript==

(function(){
  'use strict';

  /* 0. モード判定 */
  var isMobile = document.querySelector('.smpnovel_list') !== null;
  var CARD_SEL = isMobile ? '.smpnovel_list' : '.searchkekka_box';

  /* 1. 設定読み込み／初期値 */
  var CFG_KEY = 'yomouFilterConfig';
  var defaultCfg = {
    charPerEpMin:    1500,
    ratingAvgMin:      8.5,
    weeklyUsersMin:  105,
    titleMaxLen:       80,
    charPerPointMax: 10000, 
    useChar:     true,
    useRating:   true,
    useWeekly:   true,
    useTitle:    true,
    useManual:   true,
    useCharPerPoint: false
  };
  var storedCfg = {};
  try {
    storedCfg = JSON.parse(localStorage.getItem(CFG_KEY) || '{}');
  } catch(e) {
    console.warn('[yomou] config parse error', e);
  }
  var cfg = Object.assign({}, defaultCfg, storedCfg);

  /* 2. 手動ブロックリスト */
  var BLK_KEY = 'yomouBlockedUrls';
  var blocked = [];
  try {
    blocked = JSON.parse(localStorage.getItem(BLK_KEY) || '[]')
      .map(function(e){
        return (typeof e === 'string')
          ? {url: e, title: '(タイトル不明)'}
          : e;
      });
  } catch(e) {
    console.error('[yomou] blocked list parse error', e);
  }

  /* 3. DOM 前処理 */
  var cards = Array.prototype.slice.call(document.querySelectorAll(CARD_SEL));
  if (!cards.length) return;
  if (isMobile) openAllAccordions();
  addBlockButtons();

  var bar          = createBar();
  var panel        = createPanel();
  var blockedPanel = createBlockedPanel();

  filterCards();
  toggleBlockButtons();

  /* 4. フィルタ本体 */
  function filterCards(){
    var validCards = cards.filter(function(card){
      return !!card.querySelector('a[href*="://ncode.syosetu.com"]');
    });
    var total      = validCards.length,
        cutChar    = 0,
        cutRating  = 0,
        cutWeekly  = 0,
        cutTitle   = 0,
        cutManual  = 0,
        cutCharPt  = 0;

    validCards.forEach(function(card){
      var text     = card.innerText;
      var titleEl  = card.querySelector('.novel_h');
      var titleRaw = titleEl
                     ? titleEl.textContent.trim().replace(/×$/, '')
                     : '';
      var linkEl   = card.querySelector('a[href*="://ncode.syosetu.com"]');
      var url      = linkEl ? linkEl.href.split('?')[0] : '';

      /* タイトル長フィルタ */
      var badTitle = cfg.useTitle &&
                     (titleRaw.length >= cfg.titleMaxLen);

      /* エピソード数フィルタ */
      var epiMatch   = /全\s*([\d,]+)\s*エピソード/.exec(text);
      var episodes   = epiMatch
                       ? parseInt(epiMatch[1].replace(/,/g,''),10)
                       : (/短編/.test(text) ? 1 : 1);
      var badEpisode = cfg.useEpisode &&
                       (episodes < cfg.episodeMin);

      /* 文字数/話数フィルタ */
      var charMatch = /（\s*([\d,]+)\s*文字）/.exec(text);
      var chars     = charMatch
                      ? parseInt(charMatch[1].replace(/,/g,''),10)
                      : NaN;
      var badChar   = cfg.useChar &&
                      !isNaN(chars) &&
                      (chars / episodes) < cfg.charPerEpMin;

      /* 評価平均フィルタ */
      var ptMatch   = /評価ポイント：\s*([\d,]+)\s*pt/.exec(text);
      var cntMatch  = /評価人数：\s*([\d,]+)\s*人/.exec(text);
      var points    = ptMatch  ? parseInt(ptMatch[1].replace(/,/g,''),10) : 0;
      var persons   = cntMatch ? parseInt(cntMatch[1].replace(/,/g,''),10) : 0;
      var avg       = persons > 0 ? points / persons : 0;
      var badRating = cfg.useRating &&
                       (avg < cfg.ratingAvgMin);

      /* 総合ポイント取得 */
      var overallMatch = /総合ポイント：\s*([\d.]+)/.exec(text);
      var overall = overallMatch
                    ? parseFloat(overallMatch[1])
                    : 0;

      /* 文字数÷総合ポイントフィルタ  */
      var ratio     = (overall > 0 && !isNaN(chars))
                      ? (chars / overall)
                      : Infinity;
      var badCharPt = cfg.useCharPerPoint &&
                      (ratio >= cfg.charPerPointMax);

      /* 週別UUフィルタ */
      var weeklyUsers = Infinity;
      var uuMatch     = /週別ユニークユーザ：\s*([\d,]+)\s*人/.exec(text);
      if (uuMatch) weeklyUsers = parseInt(uuMatch[1].replace(/,/g,''),10);
      else if (/週別ユニークユーザ： ?100未満/.test(text))
        weeklyUsers = 100;
      var badWeekly   = cfg.useWeekly &&
                        (weeklyUsers < cfg.weeklyUsersMin);

      /* 手動ブロック */
      var badManual   = cfg.useManual &&
                        blocked.some(function(o){
                          return o.url === url;
                        });

      /* カウント増分 */
      if (badChar)    cutChar++;
      if (badRating)  cutRating++;
      if (badWeekly)  cutWeekly++;
      if (badTitle)   cutTitle++;
      if (badManual)  cutManual++;
      if (badCharPt)  cutCharPt++;

      /* 表示/非表示切替 */
      card.style.display =
        (badChar
      ||  badRating
      ||  badWeekly
      ||  badTitle
      ||  badManual
      ||  badCharPt)
      ? 'none'
      : '';
    });

    /* 統計バー更新 */
    bar.textContent =
      '｜文/EP ' + cutChar    +
      '｜文/PT ' + cutCharPt  +
      '｜評 ' + cutRating      +
      '｜UU ' + cutWeekly      +
      '｜題 ' + cutTitle       +
      '｜手 ' + cutManual      + ' ▼';
  }

  /* 5. タイトル横に ×ボタン */
  function addBlockButtons(){
    cards.forEach(function(card){
      var titleEl = card.querySelector('.novel_h');
      if (!titleEl || titleEl.querySelector('.yomou-block-btn'))
        return;
      var rawTitle = titleEl.textContent.trim();
      var btn = document.createElement('span');
      btn.textContent = '×';
      btn.className   = 'yomou-block-btn';
      btn.style.cssText =
        'display:inline-block;padding:0 4px;border:1px solid red;'+
        'border-radius:3px;color:#fff;background:red;font-size:12px;'+
        'line-height:1;margin-left:6px;cursor:pointer;';
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        var linkEl = card.querySelector('a[href*="://ncode.syosetu.com"]');
        var url    = linkEl ? linkEl.href.split('?')[0] : '';
        if (url && !blocked.some(function(o){ return o.url === url; })) {
          blocked.push({url:url,title:rawTitle});
          localStorage.setItem(BLK_KEY, JSON.stringify(blocked));
          refreshBlockedPanel();
          card.style.display = 'none';
          filterCards();
        }
      });
      titleEl.appendChild(btn);
    });
    toggleBlockButtons();
  }
  function toggleBlockButtons(){
    Array.prototype.forEach.call(
      document.getElementsByClassName('yomou-block-btn'),
      function(btn){
        btn.style.display = cfg.useManual ? 'inline-block' : 'none';
      }
    );
  }

  /* 6. モバイル折り畳み解除＆再トグル対応 */
  function openAllAccordions(){
    // 初回だけ JS で全展開
    cards.forEach(function(card){
      var body = card.querySelector('.hide');
      if (body) body.style.display = 'block';
    });
    // ×ボタンは前面でクリック可能に
    var css = document.createElement('style');
    css.textContent = `
      .yomou-block-btn {
        pointer-events: auto !important;
        position: relative;
        z-index: 1001;
      }
    `;
    document.head.appendChild(css);
  }

  /* 7. UI生成：統計バー・設定パネル・ブロック一覧 */
  function createBar(){
    var b = document.createElement('div');
    if (isMobile) {
      b.style.cssText =
        'position:fixed;bottom:0;left:0;right:0;background:rgba(0,0,0,0.85);'+
        'color:#fff;font-size:11px;line-height:22px;padding:0 6px;text-align:center;'+
        'z-index:9999;cursor:pointer;';
    } else {
      b.style.cssText =
        'position:fixed;top:0;left:0;right:0;background:#444;'+
        'color:#fff;font-size:12px;line-height:26px;padding:0 12px;text-align:left;'+
        'z-index:9999;box-shadow:0 2px 4px rgba(0,0,0,0.5);cursor:pointer;';
    }
    b.addEventListener('click', function(){
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });
    document.body.appendChild(b);
    return b;
  }

  function createPanel(){
    var p = document.createElement('div');
    if (isMobile) {
      p.style.cssText =
        'position:fixed;left:0;right:0;bottom:22px;background:#222;color:#fff;'+
        'padding:8px;z-index:9999;font-size:12px;display:none;';
    } else {
      p.style.cssText =
        'position:fixed;top:40px;left:50%;transform:translateX(-50%);'+
        'width:480px;background:#222;color:#fff;padding:16px;'+
        'z-index:10000;font-size:14px;box-shadow:0 4px 8px rgba(0,0,0,0.7);display:none;';
    }
    p.innerHTML =
      '<label><input type="checkbox" id="chkChar"  '+(cfg.useChar?'checked':'')+'> 文字数÷エピソード数 ≥</label>'  +
      '<input type="number" id="inpChar" value="'+cfg.charPerEpMin+'" style="width:60px;color:#000"><br>'  +
      '<label><input type="checkbox" id="chkCP"    '+(cfg.useCharPerPoint?'checked':'')+'> 文字数÷総合ポイント ≤</label>'+
      '<input type="number" id="inpCP"   value="'+cfg.charPerPointMax+'" style="width:60px;color:#000"><br>'+
      '<label><input type="checkbox" id="chkRate"  '+(cfg.useRating?'checked':'')+'> 評価ポイント÷評価人数 ≥</label>'+
      '<input type="number" id="inpRate" value="'+cfg.ratingAvgMin+'" step="0.1" style="width:60px;color:#000"><br>'+
      '<label><input type="checkbox" id="chkUU"    '+(cfg.useWeekly?'checked':'')+'> 週別ユニークユーザ ≥</label>'+
      '<input type="number" id="inpUU"  value="'+cfg.weeklyUsersMin+'" style="width:60px;color:#000"><br>' +
      '<label><input type="checkbox" id="chkTitle" '+(cfg.useTitle?'checked':'')+'> タイトル長 ≤</label>'+
      '<input type="number" id="inpTitle" value="'+cfg.titleMaxLen+'" style="width:60px;color:#000"><br>' +
      '<label><input type="checkbox" id="chkManual"'+(cfg.useManual?'checked':'')+'> 手動ブロック</label><br>'      +
      '<button id="applyBtn" style="margin-top:8px;color:#000">再適用</button>'                                         +
      '<button id="closePanel" style="margin-top:8px;margin-left:8px;color:#000">閉じる</button>'                       +
      '<button id="showBlk"     style="margin-top:8px;margin-left:8px;color:#000">ブロック一覧</button>';
    p.querySelector('#applyBtn').addEventListener('click', function(){
      cfg.useChar               = document.getElementById('chkChar').checked;
      cfg.useRating             = document.getElementById('chkRate').checked;
      cfg.useWeekly             = document.getElementById('chkUU').checked;
      cfg.useTitle              = document.getElementById('chkTitle').checked;
      cfg.useCharPerPoint       = document.getElementById('chkCP').checked;
      cfg.useManual             = document.getElementById('chkManual').checked;
      cfg.charPerEpMin          = parseFloat(document.getElementById('inpChar').value)   || 0;
      cfg.charPerPointMax       = parseFloat(document.getElementById('inpCP').value)     || 0;
      cfg.ratingAvgMin          = parseFloat(document.getElementById('inpRate').value)   || 0;
      cfg.weeklyUsersMin        = parseInt(document.getElementById('inpUU').value,10)    || 0;
      cfg.titleMaxLen           = parseInt(document.getElementById('inpTitle').value,10) || 0;
      localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
      filterCards();
      toggleBlockButtons();
    });
    p.querySelector('#closePanel').addEventListener('click', function(){
      panel.style.display = 'none';
    });
    p.querySelector('#showBlk').addEventListener('click', function(){
      blockedPanel.style.display = 'block';
      refreshBlockedPanel();
    });
    document.body.appendChild(p);
    return p;
  }

  function createBlockedPanel(){
    var bp = document.createElement('div');
    bp.style.cssText =
      'position:fixed;left:10%;right:10%;top:20%;max-height:60%;background:#000;'+
      'color:#fff;border:1px solid #999;padding:8px;overflow:auto;'+
      'z-index:10000;display:none;font-size:12px;';
    bp.innerHTML =
      '<b>ブロックした作品</b>' +
      '<ul id="blkList" style="margin:6px 0;padding-left:16px;"></ul>' +
      '<button id="resetBlk" style="color:#000">全リセット</button>' +
      '<button id="closeBlk" style="margin-left:8px;color:#000">閉じる</button>';
    bp.querySelector('#closeBlk').addEventListener('click', function(){
      bp.style.display = 'none';
    });
    bp.querySelector('#resetBlk').addEventListener('click', function(){
      if (confirm('全解除しますか？')) {
        blocked.length = 0;
        localStorage.removeItem(BLK_KEY);
        refreshBlockedPanel();
        filterCards();
      }
    });
    document.body.appendChild(bp);
    return bp;
  }

  /* 8. ブロック一覧再描画 */
  function refreshBlockedPanel(){
    var ul = blockedPanel.querySelector('#blkList');
    ul.innerHTML = '';
    blocked.forEach(function(obj){
      var li   = document.createElement('li');
      li.style.marginBottom = '4px';
      var span = document.createElement('span');
      span.textContent = obj.title;
      span.style.fontWeight = 'bold';
      var a = document.createElement('a');
      a.href = obj.url;
      a.textContent = obj.url;
      a.target = '_blank';
      a.style.color = '#9cf';
      a.style.marginLeft = '4px';
      var btn = document.createElement('button');
      btn.textContent = '解除';
      btn.style.marginLeft = '8px';
      btn.style.color = '#000';
      btn.addEventListener('click', function(){
        var idx = blocked.findIndex(function(o){ return o.url === obj.url; });
        if (idx > -1) {
          blocked.splice(idx, 1);
          localStorage.setItem(BLK_KEY, JSON.stringify(blocked));
          refreshBlockedPanel();
          filterCards();
        }
      });
      li.appendChild(span);
      li.appendChild(a);
      li.appendChild(btn);
      ul.appendChild(li);
    });
    if (!blocked.length) {
      ul.textContent = '（なし）';
    }
  }

})();