// ==UserScript==
// @name         Plurk shadow block
// @name:zh-TW   噗浪隱形黑名單
// @description  Shadow blocks user (only blocks on responses and timeline of yourself)
// @description:zh-TW 隱形封鎖使用者（只是會在回應和在河道上看不到被封鎖者的發文、轉噗，其他正常）
// @version      0.4.0
// @license      MIT
// @namespace    https://github.com/stdai1016
// @match        https://www.plurk.com/*
// @exclude      https://www.plurk.com/_*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasyfork.org/scripts/432792-plurk-lib/code/plurk_lib.js?version=972862
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/422595/Plurk%20shadow%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/422595/Plurk%20shadow%20block.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* global $, plurklib */

(function () {
  'use strict';
  const LANG = {
    DEFAULT: {
      resp_btn_hide: 'Hide blocked responses',
      resp_btn_show: 'Show blocked responses',
      set_alert: 'Incorrect format of nick name!',
      set_append: 'Append',
      set_empty: 'There is no one in your blocklist.',
      set_note:
        'A blocked user will not be shown on responses and your timeline,' +
        ' but is still able to see your profile, follow you,' +
        ' respond to your plurks or befriend you.',
      set_remove: 'Remove',
      set_replurk: 'Block replurks',
      set_response: 'Block responses',
      set_tab: 'Shadow Block'
    },
    'zh-hant': {
      resp_btn_hide: '隱藏被封鎖的回應',
      resp_btn_show: '顯示被封鎖的回應',
      set_alert: '帳號格式不正確',
      set_append: '新增',
      set_empty: '沒有任何人在黑名單中',
      set_note: '在回應區和自己的河道上看不到被封鎖者的發文、轉噗；' +
        '但對方仍可瀏覽您的個人檔案，關注、回應您的訊息，或加您為朋友。',
      set_remove: '移除',
      set_replurk: '封鎖轉噗',
      set_response: '封鎖回應',
      set_tab: '隱形黑名單'
    }
  };
  let lang = LANG.DEFAULT;
  const curLang = document.documentElement.getAttribute('lang') || '';
  if (curLang.toLowerCase() in LANG) lang = LANG[curLang.toLowerCase()];

  if (typeof plurklib === 'undefined') {
    console.error('plurklib load failed!');
    return;
  }
  const pageUserId = plurklib.getPageUserData()?.id;
  const currUserId = plurklib.getUserData()?.id;

  /* ======= storage ======= */
  /** Struct in GM storage:
   *  {
   *    `u${currUserId}`: {
   *      `b${blockedUserId}`: {
   *        id: blockedUserId,
   *        nick_name: <string>, // for readability
   *        replurk: <bool>,  // block his replurks
   *        response: <bool>, // block his responses
   *        date: <UTC_datetime_string>
   *      }
   *    }
   *  }
   */
  function valueGetSet (val = null) {
    if (val != null) GM_setValue(`u${currUserId}`, val);
    return GM_getValue(`u${currUserId}`);
  }

  let _blockedUsers = valueGetSet();
  if (typeof _blockedUsers !== 'object') _blockedUsers = valueGetSet({});
  const blockedList = {
    get: id => _blockedUsers[`b${id}`],
    add: user => {
      _blockedUsers[`b${user.id}`] = {
        id: user.id,
        nick_name: user.nick_name,
        replurk: user.replurk ?? true,
        response: user.response ?? true,
        date: user.date ?? (new Date()).toUTCString()
      };
      valueGetSet(_blockedUsers);
    },
    remove: id => {
      delete _blockedUsers[`b${id}`];
      valueGetSet(_blockedUsers);
    },
    contains: user => {
      switch (typeof user) {
        case 'string':
          for (const u in _blockedUsers) {
            if (_blockedUsers[u].nick_name === user) return true;
          }
          break;
        case 'number':
          return !!_blockedUsers[`b${user}`];
        case 'object':
          return !!_blockedUsers[`b${user?.id}`];
      }
      return false;
    },
    forEach: callbackfn => {
      for (const i in _blockedUsers) {
        callbackfn(_blockedUsers[i], i, _blockedUsers);
      }
    },
    get length () { return Object.keys(_blockedUsers).length; }
  };

  /* ============== */
  GM_addStyle(
    '.hide {display:none}' +
    '.item_holder .user_item.user_shadow_blocked_users_item .user_info {' +
    '  width: calc(100% - 190px);}' +
    '.friend_man.not_block {background-color:#999;}' +
    '.friend_man.not_block:hover {background-color:#207298}' +
    '.resp-hidden-show {background:#f5f5f9;color:#afb8cc;' +
    '  font-weight:normal;vertical-align:top;transform:scale(0.9);opacity:0;}' +
    '.resp-hidden-show.show {opacity:1}' +
    '.resp-hidden-show:not(.show) .onshow {display:none}' +
    '.resp-hidden-show.show .onhide {display:none}' +
    '.response-status:hover .resp-hidden-show {opacity:1}' +
    '.resp-hidden-show:hover {background:#afb8cc;color:#fff}'
  );

  if (window.location.pathname === '/Friends/') {
    $('<li><a void="">' + lang.set_tab + '</a></li>').on('click', function () {
      window.history.pushState('', document.title, '/Friends/');
      $('#pop-window-tabs>ul>li').removeClass('current');
      this.classList.add('current');
      const $content = $('#pop-window-inner-content .content_inner').empty();
      $content.append(
        '<div class="note">' + lang.set_note + '</div>',
        '<div class="dashboard">' +
        ' <div class="search_box"><input>' +
        '  <button>' + lang.set_append + '</button></div>' +
        ' <div class="empty">' + lang.set_empty + '</div>' +
        '</div>');
      const $holder = $('<div class="item_holder"></div>').appendTo($content);
      if (blockedList.length) {
        $content.find('.dashboard .empty').addClass('hide');
      }
      blockedList.forEach(u => {
        plurklib.fetchUserInfo(u.id).then(info => {
          makeBlockedUserItem(info, $holder);
        }).catch(e => {
          console.info(`Cannot get info of "${u.nick_name}" (${e.message})`);
          makeBlockedUserItem(u, $holder);
        });
      });
      $content.find('.search_box>button').on('click', function () {
        const m = this.parentElement.children[0].value.match(/^[A-Za-z]\w+$/);
        if (m) {
          this.parentElement.children[0].value = '';
          $content.find('.dashboard .empty').addClass('hide');
          plurklib.fetchUserInfo(m[0]).then(info => {
            blockedList.add(info);
            makeBlockedUserItem(info, $holder);
          }).catch(e => {
            window.alert(`Unknown user "${m[0]}"`);
          });
        } else { window.alert(lang.set_alert); }
      });
    }).appendTo('#pop-window-tabs>ul');
  } else if (pageUserId === currUserId ||
    window.location.pathname.match(/^\/p\/[0-9a-z]+$/)) {
    makeButton($('#plurk_responses>.response_box'));
    makeButton($('#form_holder>.response_box'));
    makeButton($('#cbox_response>.response_box'));
    const po = new plurklib.PlurkObserver(prs => prs.forEach(pr => {
      pr.plurks.forEach(plurk => {
        if (blockedList.contains(plurk.owner_id)) {
          if (plurk.isResponse) {
            plurk.target.classList.add('shadow-block');
            const btn =
              pr.target.parentElement.querySelector('.resp-hidden-show');
            btn?.classList.remove('hide');
            if (blockedList.get(plurk.owner_id).response) {
              plurk.target.classList.add('hide');
              console.debug(`block #m${plurk.id}`);
            } else { btn?.classList.add('show'); }
          } else {
            plurk.target.classList.add('shadow-block', 'hide');
            console.debug(`block #p${plurk.id}`);
          }
        } else if (blockedList.get(plurk.replurker_id)?.replurk) {
          plurk.target.classList.add('shadow-block', 'hide');
          console.debug(`block #p${plurk.id}`);
        }
      });
    }));
    po.observe({ plurk: true });
  }

  function makeButton ($responseBox) {
    if (!$responseBox.length) return;
    const $formBtn = $(
      '<div><span class="onshow">' + lang.resp_btn_hide + '</span>' +
      '<span class="onhide">' + lang.resp_btn_show + '</span></div>'
    );
    $formBtn.on('click', function () {
      $formBtn.toggleClass('show');
      const $blocks = $responseBox.children('.list').children('.shadow-block');
      if ($formBtn.hasClass('show')) $blocks.removeClass('hide');
      else $blocks.addClass('hide');
    }).addClass(['resp-hidden-show', 'button', 'small-button', 'hide'])
      .insertAfter($responseBox.find('.response-only-owner'));
    (new MutationObserver(mrs => mrs.forEach(mr => {
      if (!mr.target.querySelector('.handle-remove')) {
        $('<div class="handle-remove hide"></div>').prependTo(mr.target);
      }
      mr.removedNodes.forEach(node => {
        if (node.classList.contains('handle-remove')) {
          $formBtn.removeClass('show').addClass('hide').text(lang.resp_btn_show);
        }
      });
    }))).observe($responseBox.find('.list').first()[0], { childList: true });
  }

  function makeBlockedUserItem (info, holder) {
    const user = blockedList.get(info.id);
    if (info.nick_name && info.nick_name !== user.nick_name) {
      user.nick_name = info.nick_name;
      blockedList.add(user);
    }
    blockedList.add(user);
    const $u = $('<div class="user_item user_shadow_blocked_users_item"></div>');
    const img = info.has_profile_image
      ? `https://avatars.plurk.com/${info.id}-medium${info.avatar ?? ''}.gif`
      : 'https://www.plurk.com/static/default_medium.jpg';
    $u.append([
      '<a class="user_avatar" target="_blank">',
      `  <img class="profile_pic" src="${img}"></img>`,
      '</a>',
      '<div class="user_info">',
      '  <a class="user_link" target="_blank"',
      `     style="color:#000">${info.display_name}</a>`,
      `  <span class="nick_name">@${info.nick_name}</span>`,
      '  <div class="more_info"><br></div>',
      '</div>',
      '<div class="user_action">',
      `  <a void="" data-switch="replurk" title="${lang.set_replurk}"`,
      '     class="friend_man icon_only pif-replurk',
      `            ${user.replurk ? 'has_block' : 'not_block'}"></a>`,
      `  <a void="" data-switch="response" title="${lang.set_response}"`,
      '     class="friend_man icon_only pif-message',
      `            ${user.response ? 'has_block' : 'not_block'}"></a>`,
      `  <a void="" data-remove="1" title="${lang.set_remove}"`,
      '     class="friend_man icon_only pif-user-blocked has_block"></a>',
      '</div>'
    ].join(''));
    $u.find('a:not(.icon_only)').attr('href', '/' + info.nick_name);
    $u.find('a.icon_only').on('click', function () {
      if (this.dataset.switch) {
        user[this.dataset.switch] = !user[this.dataset.switch];
        if (user[this.dataset.switch]) {
          this.classList.add('has_block');
          this.classList.remove('not_block');
        } else {
          this.classList.remove('has_block');
          this.classList.add('not_block');
        }
        blockedList.add(user);
      }
      if (this.dataset.remove) {
        blockedList.remove(user.id);
        $u.remove();
      }
    });
    $u.appendTo(holder);
  }
})();
