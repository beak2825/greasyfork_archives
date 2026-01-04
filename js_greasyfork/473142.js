// ==UserScript==
// @name         kemono.party - fix username
// @description  Get pixiv username automatically, and renameable by manually.
// @version      2.02.1
// @match        *://kemono.party/*
// @match        *://kemono.su/*
// @namespace    kemono.party
// @connect      www.pixiv.net
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/473142/kemonoparty%20-%20fix%20username.user.js
// @updateURL https://update.greasyfork.org/scripts/473142/kemonoparty%20-%20fix%20username.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

(async function() {
  GM_registerMenuCommand('Settings', () => settings());
  let options = await GM_getValue('options', {});
  if (options.disable_arrow) disable_arrow();
  update_css(options, true);
  let name = document.querySelector('.user-header__profile span[itemprop="name"], .post__user .post__user-name');
  if (name) fix_header(name);
  let cards = document.querySelectorAll('.card-list__items .user-card');
  for (let card of cards) await fix_card(card);
  let lists = document.querySelector('.card-list__items');
  if (lists) new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(node => queue.add(node)))).observe(lists, {childList: true, subtree: false});
})();

const queue = (function() {
  let active, tasks = [];
  return {
    add: function (task) {
      tasks.push(task);
      if (!active) {
        active = true;
        this.next();
      }
    },
    next: async function () {
      let task = tasks.shift();
      await fix_card(task);
      if (tasks.length > 0) this.next();
      else active = false;
    }
  };
})();

async function fix_card(card) {
  if (card && card.href) {
    let site = card.href.split('/user/').shift().split('/').pop();
    let id = card.href.split('/user/').pop();
    let name = card.querySelector('.user-card__name');
    name.insertAdjacentHTML('beforebegin', name.outerHTML.replace(/(?<=^<)div|div(?=>$)/g, 'a'));
    name.remove();
    name = card.querySelector('.user-card__name');
    name.href = card.getAttribute('href');
    name.target ='_blank';
    card.removeAttribute('href');
    await fix_name(name, id, site);
    fix_info(card, id);
  }
}

function fix_header(name) {
  let site = location.href.split('/user/').shift().split('/').pop();
  let id = location.href.split('/user/').pop().split(/[/?]/).shift();
  fix_name(name, id, site);
}

async function fix_name(name, id, site) {
  let name_org = name.innerText;
  let name_fix = (await GM_getValue(site, {}))[id];
  if (site == 'fanbox') {
    if (!name_fix) name_fix = await GM_getValue(id);
    if (!name_fix) {
      (async function() {
        name_fix = await get_pixiv_name(id) || name_org + ' (!)';
        save_name(id, name_fix, site);
        update_name(name, name_fix, name_org);
      })();
    }
  }
  if (name_fix && name_fix !== name_org) {
    update_name(name, name_fix, name_org);
  }
  let name_edit = document.createElement('label');
  name_edit.innerHTML = 'Edit';
  name_edit.classList.add('name_edit');
  name.parentNode.insertBefore(name_edit, name);
  name_edit.onclick = function(e) {
    e.preventDefault();
    let name_edit_input = document.createElement('textarea');
    name_edit_input.style.height = name.offsetHeight + 'px';
    name_edit_input.value = name_fix || name.innerText;
    let profile = name.closest('.user-header__name');
    if (profile) profile.insertBefore(name_edit_input, profile.firstChild);
    else name.parentNode.insertBefore(name_edit_input, name_edit);
    const update_size = () => {
      name_edit_input.style.height = '5px';
      name_edit_input.style.height = name_edit_input.scrollHeight + 'px';
    };
    name_edit_input.focus();
    name_edit_input.oninput = () => update_size();
    name_edit_input.onkeypress = function(e) {
      if (e.keyCode == 13) name_edit_input.blur();
      else update_size();
    };
    name_edit_input.onblur = async function() {
      if (!this.value) this.value = site == 'fanbox' ? await get_pixiv_name(id) || name_org + ' (!)' : name_org;
      if (this.value !== name_fix) {
        name_fix = this.value.trim();
        save_name(id, name_fix, site, site !== 'fanbox');
        update_name(name, name_fix, name_org);
      }
      this.remove();
    };
    update_size();
  };
}

function fix_info(card, id) {
  let sites = {
    Pixiv: 'https://www.pixiv.net/users/{id}/artworks',
    Fanbox: 'https://www.pixiv.net/fanbox/creator/{id}',
    Fantia: 'https://fantia.jp/fanclubs/{id}/posts',
    Patreon: 'https://www.patreon.com/user?u={id}'
  };
  let service = card.querySelector('.user-card__service');
  service.innerHTML = service.innerText.trim().replace(/Pixiv|Fanbox|Fantia|Patreon/gi, match => '<a href="' + sites[match].replace('{id}', id) + '" target="_blank">' + match + '</a>');
  let timestamp = card.querySelector('.user-card__updated .timestamp');
  if (timestamp) {
    let updated = new Date(timestamp.dateTime);
    let current = new Date();
    let datetime = timestamp.dateTime.replace(/:\d\d\.(\d{6}|\d{3}Z)/, '').replace('T', ' ');
    current = new Date(current.getTime() + (location.href.indexOf('/favorites') >= 0 ? current.getTimezoneOffset() * 60000 : 0));
    let mm = Math.floor((current - updated) / 1000 / 60);
    let hh = Math.floor(mm / 60);
    let dd = Math.floor(hh / 24);
    if (dd <= 6) {
      timestamp.innerText = mm <= 59 ? mm + ' minutes ago' : hh <= 23 ? hh + ' hours ago' : dd + ' days ago';
      timestamp.title = datetime;
    } else {
      timestamp.innerText = datetime;
      timestamp.title = dd + ' days ago';
    }
  }
}

function update_name(name, fix, org) {
  if (fix.indexOf('* ') == 0) name.classList.add('highlight');
  else name.classList.remove('highlight');
  name.innerHTML = fix.replace(/^\*\s/, '').replace(/\(\*?[a-z]+_\d+\)/gi, '').trim();
  name.parentNode.querySelectorAll('.refer_link, .name_org').forEach(a => a.remove());
  if (fix.replace(/^\*|\((\*?[a-z]+_\d+|!)\)/gi, '').replace(/\s/g, '').toLowerCase() !== org.replace(/\s/g, '').toLowerCase()) {
    name.insertAdjacentHTML('afterend', '<span class="name_org">(' + org + ')</span>');
  }
  (fix.match(/\(\*?[a-z]+_\d+\)/gi) || []).forEach(m => m.replace(/([a-z]+)_(\d+)/i, (p0, p1, p2) => {
    (Array.from(name.parentNode.querySelectorAll('.user-card__service')).pop() || name).insertAdjacentHTML('afterend', ' <span class="user-card__service refer_link"><a' + (m[1] == '*' ? ' class="highlight"' : '') + ' href="/' + p1.toLowerCase() + '/user/' + p2 + '" target="_blank">' + p1 + '</a></span>');
  }));
}

async function save_name(id, name_fix, site, in_tag, is_remove) {
  if (in_tag) {
    let sites = await GM_getValue(site, {});
    if (is_remove) delete sites[id]; else sites[id] = name_fix;
    GM_setValue(site, sites);
  } else {
    if (is_remove) GM_deleteValue(id); else GM_setValue(id, name_fix);
  }
}

async function get_pixiv_name(id) {
  let user_ajax = await GM_fetch('https://www.pixiv.net/ajax/user/' + id + '?full=1&lang=ja', {referer: "https://www.pixiv.net/"});
  if (user_ajax.status == 200) {
    let user_json = JSON.parse(user_ajax.responseText);
    let user_name = user_json.body.name;
    user_name = user_name.replace(/(c\d+)?([日月火水木金土]曜日?|[123１２３一二三]日目?)[東南西北]..?\d+\w?/i, '');
    user_name = user_name.replace(/[@＠]?(fanbox|fantia|skeb|ファンボ|リクエスト|お?仕事|新刊|単行本|同人誌)+(.*(更新|募集|公開|開設|開始|発売|販売|委託|休止|停止)+中?[!！]?$|$)/gi, '');
    user_name = user_name.replace(/\(\)|（）|「」|【】|[@＠_＿]+$/g, '').trim();
    return user_name;
  }
}

function GM_fetch(url, headers) {
  return new Promise(resolve => {
    GM_xmlhttpRequest({
      method: 'GET', url: url, headers: headers,
      onload: result => resolve(result),
      onerror: result => resolve(result),
      ontimeout: result => resolve(result)
    });
  });
}

const settings = async function() {
  const $element = (parent, tag, style, content, css) => {
    let el = document.createElement(tag);
    if (style) el.style.cssText = style;
    if (typeof content !== 'undefined') {
      if (tag == 'input') {
        if (typeof content == "boolean") {
          el.type = 'checkbox';
          el.checked = content
        } else el.value = content;
      } else el.innerHTML = content;
    }
    if (css) css.split(' ').forEach(c => el.classList.add(c));
    parent.appendChild(el);
    return el;
  };
  let wapper, wapper_close;
  (wapper = document.querySelector('.settings-wapper')) === null || wapper.remove();
  wapper = $element(document.body, 'div', 'position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; background-color: #0009; z-index: 10;', null, 'settings-wapper');
  wapper.onmousedown = e => {
    wapper_close = e.target == wapper;
  };
  wapper.onmouseup = e => {
    if (wapper_close && e.target == wapper) wapper.remove();
  };
  let dialog = $element(wapper, 'div', 'position: absolute; left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%); width: fit-content; width: -moz-fit-content; background: #333; border: 1px solid #999; border-radius: 10px; box-shadow: 0 0 6px #999;');
  let options = await GM_getValue('options', {});
  const save_and_update = (key, val, da) => {
    if (options[key] !== val) {
      options[key] = val;
      GM_setValue('options', options);
      if (da) disable_arrow();
      else update_css(options);
    }
  };
  let disable_arrow_label = $element(dialog, 'label', 'display: block; margin: 20px;', 'Disable page switching with arrow keys');
  let disable_arrow_input = $element(disable_arrow_label, 'input', 'float: left; margin-right: 8px;', options.disable_arrow || false);
  disable_arrow_input.onchange = () => save_and_update('disable_arrow', disable_arrow_input.checked, true);
  let untrim_square_label = $element(dialog, 'label', 'display: block; margin: 20px;', 'Untrim square thumbnails');
  let untrim_square_input = $element(untrim_square_label, 'input', 'float: left; margin-right: 8px;', options.untrim_square || false);
  untrim_square_input.onchange = () => save_and_update('untrim_square', untrim_square_input.checked);
  let user_card_size = $element(dialog, 'div', 'display: block; margin: 20px;');
  let user_card_size_label = $element(user_card_size, 'label', 'display: block; margin-bottom: 10px;', 'User card size');
  let user_card_width_label = $element(user_card_size, 'label', 'margin-left: 20px;', 'Width');
  let user_card_width_input = $element(user_card_width_label, 'input', 'margin-left: 10px; width: 60px;', options.user_width || 480);
  user_card_width_input.onblur = () => save_and_update('user_width', user_card_width_input.value);
  let post_card_size = $element(dialog, 'div', 'display: block; margin: 20px;');
  let post_card_size_label = $element(post_card_size, 'label', 'display: block; margin-bottom: 10px;', 'Post thumbnail size');
  let post_card_width_label = $element(post_card_size, 'label', 'margin-left: 20px;', 'Width');
  let post_card_width_input = $element(post_card_width_label, 'input', 'margin-left: 10px; width: 60px;', options.card_width || 240);
  post_card_width_input.onblur = () => save_and_update('card_width', post_card_width_input.value);
  let post_card_height_label = $element(post_card_size, 'label', 'margin-left: 20px;', 'Height');
  let post_card_height_input = $element(post_card_height_label, 'input', 'margin-left: 10px; width: 60px;', options.card_height || 240);
  post_card_height_input.onblur = () => save_and_update('card_height', post_card_height_input.value);
};

const update_css = function(options, is_init) {
  const css = `
.user-card {margin: .25em;}
.user-card__icon img {width: 100%; height: 100%;}
.user-card__info {flex-grow: 1;}
.user-card__info .user-card__service {display: inline-block; text-transform: capitalize;}
.user-card__info .user-card__name {display: block; color: #fff; border: unset; word-break: break-all;}
.user-card__info .user-card__name.highlight {color: #cf3; font-weight: bold;}
.user-card__info .name_edit {display: none; float: right;}
.user-card:hover .name_edit {display: block;}
.user-card__info textarea {display: block; color: #fff; font-size: 28px; min-height: unset; padding: 5px 2px;}
.user-card__info textarea ~ .user-card__name {display: none;}

.user-header__profile span[itemprop="name"] {flex-grow: 1;}
.user-header__profile span[itemprop="name"].highlight {color: #cf3; font-weight: bold;}
.user-header__profile .name_edit {display: none; order: 1; margin-right: .5em;}
.user-header__profile:hover .name_edit {display: block;}
.user-header__profile .refer_link {order: 2; margin-right: .5em;}
.user-header__profile .name_org {flex-grow: 99; font-size: 11pt;}
.user-header__name textarea {display: block; color: #fff; font-size: 28px; min-height: unset; padding: 5px 2px; margin: 3px;}
.user-header__name textarea ~ .user-header__profile {display: none;}

.post__user .post__user-name {display: block;}
.post__user .post__user-name.highlight {color: #cf3; font-weight: bold;}
.post__user .name_edit {display: none; position: absolute; right: .5em;}
.post__user:hover .name_edit {display: block;}
.post__user .refer_link {display: none;}
.post__user textarea {display: block; color: #fff; font-size: 1.25em; min-height: unset; width: 100%; resize: none; overflow: hidden; text-align: center;}
.post__user textarea ~ .post__user-name {display: none;}

.name_org {color: #b3b3b3;}
.name_edit {font-size: 14px; color: #fff; background: #666; border-radius: 6px; padding: 4px 8px;}
textarea ~ .name_edit {display: none !important;}
.refer_link {background-color: #000;}
.refer_link .highlight {color: #cf3; font-weight: bold;}
`;
  const css_fix = `
/* fix sidebar menu */
.global-sidebar-entry-item:not(:first-child) {margin-left: 1em;}

/* fix post card style */
.card-list--phone  {--card-size: {{user_width:480}};}
.card-list--legacy {--card-size: {{card_width:240}};}
.post-card {margin: .5em; width: {{card_width:240}}; height: {{card_height:240}};}
.post-card > a {border: 1px solid #fff6; border-radius: 6px; overflow: hidden; margin: -1px; background: #000 !important;}
.post-card__header {font-size: 1.25em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
.post-card:hover .post-card__header {white-space: unset; word-break: break-all;}
.post-card__footer div {float: right; width: 5em; height: 1em; text-align: right; overflow: hidden;}
.post-card__footer div:before {content: '📌';}
`;
  const css_untrim = `
/* untrim square */
.post-card__image {object-fit: contain;}
`;
  if (is_init) document.head.insertAdjacentHTML('beforeend', '<style class="css_main">' + css + '</style>');
  else document.querySelector('.css_fix').remove();
  document.head.insertAdjacentHTML('beforeend', '<style class="css_fix">' + css_fix.replace(/{{(user_width|card_width|card_height):(\d+)}}/g, (all, p1, p2) => (options[p1] || p2) + 'px') + (options.untrim_square ? css_untrim : '') + '</style>');
};

function disable_arrow() {
  const remove_css = doc => doc.querySelectorAll(".paginator .prev, .paginator .next").forEach(a => a.classList.remove("prev", "next"));
  remove_css(document);
  let page = document.querySelector('#page');
  if (page) {
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(node => {
      if (node.tagName == 'MENU') remove_css(node);
    }))).observe(page, {childList: true, subtree: true});
  }
}
