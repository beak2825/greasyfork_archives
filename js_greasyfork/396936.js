// ==UserScript==
// @name           YT: not interested in one click
// @description    Hover a thumbnail on youtube.com and click an icon at the right: "Not interested" and "Don't recommend channel"
// @version        1.3.15
//
// @match          https://www.youtube.com/*
//
// @noframes
// @grant          none
//
// @author         wOxxOm
// @namespace      wOxxOm.scripts
// @license        MIT License
// @downloadURL https://update.greasyfork.org/scripts/396936/YT%3A%20not%20interested%20in%20one%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/396936/YT%3A%20not%20interested%20in%20one%20click.meta.js
// ==/UserScript==
'use strict';

const RECS = '#related yt-lockup-view-model';
const PLAYLIST = 'ytd-playlist-video-renderer';
const {
  THUMB = [
    'yt-thumbnail-view-model',
    'ytd-thumbnail',
    'ytd-playlist-thumbnail',
    'ytm-shorts-lockup-view-model-v2',
    '.shortsLockupViewModelHostThumbnailContainer',
  ].join(','),
  PREVIEW_TAG = 'ytd-video-preview',
  PREVIEW_PARENT = '#media-container', // parent for the added buttons; must be visible
  ENTRY = [
    PLAYLIST, // watch later, likes
    RECS, // watch (recommendations)
    'ytd-rich-item-renderer', // home
    'ytd-compact-video-renderer', // watch (recommendations)
    'ytd-playlist-panel-video-renderer', // playlist
    'ytd-video-renderer', // history
    '[page-subtype="history"] yt-lockup-view-model', // history
    'ytm-shorts-lockup-view-model', // history
  ].join(','),
  MENU_BTN = [
    '.dropdown-trigger',
    '.yt-lockup-metadata-view-model-wiz__menu-button button',
    '.yt-lockup-metadata-view-model__menu-button button',
    '.shortsLockupViewModelHostOutsideMetadataMenu button',
  ].join(','),
} = getStorage() || {};
const ME = 'yt-one-click-dismiss';
const COMMANDS = {
  NOT_INTERESTED: 'video',
  REMOVE: 'channel',
  DELETE: 'unwatch',
};
const ITEMS_META = '.metadata.lockupMetadataViewModel.menuButton.buttonViewModel.';
const ITEMS_END = '.innertubeCommand.showSheetCommand.panelLoadingStrategy.inlineContent.' +
  'sheetViewModel.content.listViewModel.listItems';
const UPD = new WeakMap();
let STYLE;
let inlinable;

addEventListener('click', onClick, true);
addEventListener('mousedown', onClick, true);
addEventListener('mouseover', onHover, true);
addEventListener('yt-action', ({detail: d}) => {
  if (d.actionName === 'yt-set-cookie-command') {
    inlinable = !d.args[0].setCookieCommand.value;
  }
});

function onHover(evt, delayed) {
  const inline = evt.target.closest(PREVIEW_TAG);
  const el = inline || evt.target.closest(THUMB);
  const thumb = el && inline === el ? $(THUMB, inline) : el;
  if (thumb && !thumb.getElementsByClassName(ME)[0] && (
    inline ||
    delayed || (
      inlinable != null || (inlinable = getProp($(PREVIEW_TAG), 'inlinePreviewIsEnabled')) != null
        ? thumb.closest(RECS + ',' + PLAYLIST) || !inlinable
        : setTimeout(getInlineState, 250, evt) && false
    )
  )) {
    if (inline) {
      addButtons($(PREVIEW_PARENT, el),
        getProp(el, 'mediaRenderer') ||
        getProp(el, 'opts.mediaRenderer'));
    } else {
      addButtons(thumb, thumb);
    }
  }
}

async function onClick(e) {
  if (e.button) return;
  const me = e.target;
  const thumb = me[ME]; if (!thumb) return;
  const a = me.closest('a');
  const {title} = me;
  const upd = UPD.has(thumb);
  const POPUPICON = upd
    ? 'props.data.leadingImage.sources.0.clientResource.imageName'
    : 'data.icon.iconType';
  e.stopPropagation();
  e.stopImmediatePropagation();
  e.preventDefault();
  if (e.type === 'click') return;
  if (a) setPointerEvents(a, 'none');
  await new Promise(r => me.addEventListener('mouseup', r, {once: true}));
  let index, menu, entry, el;
  if ((entry = thumb.closest(ENTRY)) && (el = $(MENU_BTN, entry))) {
    await 0;
    index = STYLE.sheet.insertRule('ytd-popup-container:not(#\\0) { opacity: 0 !important }');
    el.dispatchEvent(new Event('click'));
    await new Promise(requestAnimationFrame);
    if ((el = await waitFor('ytd-popup-container')) &&
        (el = getProp(el, 'popups_', true)) &&
        (el = Object.values(el).find(p => entry.contains(p.target))))
      menu = el.popup;
  }
  if (a) setTimeout(setPointerEvents, 0, a);
  if (!menu) {
    STYLE.sheet.deleteRule(index);
    el = me.nextSibling;
    me.remove();
    me.title = 'No menu button?\nWait a few seconds for the site to load.';
    await new Promise(setTimeout);
    el.before(me);
    await timedPromise(null, 5000);
    me.title = title;
    return;
  }
  if (title)
    me.title = '';
  if (!isMenuReady(menu)) {
    let mo;
    if (!await timedPromise(resolve => {
      mo = new MutationObserver(() => isMenuReady(menu) && resolve(true));
      mo.observe(menu, {attributes: true, attributeFilter: ['style']});
    })) console.warn('Timeout waiting for px in `style` of', menu);
    mo.disconnect();
  }
  await new Promise(setTimeout);
  if (a) a.style.removeProperty('pointer-events');
  try {
    for (el of ($('#items', menu) || $('[role=menu], [role=listbox]', menu)).children) {
      if (title && title === el.innerText ||
          me.dataset.block === (COMMANDS[getProp(el, POPUPICON)] || {}).block) {
        el.click();
        break;
      }
    }
  } catch (e) {}
  await new Promise(setTimeout);
  document.body.click();
  await new Promise(setTimeout);
  STYLE.sheet.deleteRule(index);
  me.title = title;
}

function addButtons(parent, thumb) {
  let items, upd;
  for (let entry = thumb, i = 0; entry; entry = ++i < 2 && entry.closest(ENTRY)) {
    upd = 0; items = getProp(entry, 'data.menu.menuRenderer.items'); if (items) break;
    upd = 1; items = entry.localName.includes('lockup-view') ? '' : '.content.*ockupViewModel';
    items = entry.localName.includes('shorts')
      ? getProp(entry, `data${items.replace('*', 'shortsL')}.menuOnTap${ITEMS_END}`)
      : getProp(entry, `data${ITEMS_META}onTap${ITEMS_END}`) ||
        getProp(entry, `data${items.replace('*', 'l')}${ITEMS_META}onTap${ITEMS_END}`);
  }
  UPD.set(thumb, upd);
  const ITEM = upd ? 'listItemViewModel' : 'menuServiceItemRenderer';
  const ICON = upd ? 'leadingImage.sources.0.clientResource.imageName' : 'icon.iconType';
  const TEXT = upd ? 'title.content' : 'text.runs';
  const elems = [];
  const shown = {};
  for (const item of items || []) {
    const menu = item[ITEM];
    const type = getProp(menu, ICON);
    let data = COMMANDS[type]; if (!data) continue;
    let {el} = data;
    if (!el) {
      data = COMMANDS[type] = {block: data};
      el = data.el = document.createElement('div');
      el.className = ME;
      el.dataset.block = data.block;
    }
    let text = getProp(menu, TEXT);
    if (Array.isArray(text))
      text = text.map(t => t.text).join('');
    el.title = text || data.text;
    el[ME] = thumb;
    shown[type] = 1;
    if (el.parentElement !== parent)
      elems.push(el);
  }
  for (let v in COMMANDS) {
    if (!shown[v] && (v = COMMANDS[v].el))
      v.remove();
  }
  requestAnimationFrame(() => parent.append(...elems));
  if (!STYLE) initStyle();
}

function getInlineState(e) {
  if (e.target.matches(':hover') && !$(PREVIEW_TAG).getBoundingClientRect().width) {
    onHover(e, true);
  }
}

function getProp(obj, path, isRaw) {
  if (!obj) return;
  path = path.split('.');
  try {
    if (obj instanceof Node) {
      obj = obj.wrappedJSObject || obj;
      obj = obj.polymerController || obj.__instance || obj.inst || obj;
      if (!isRaw) {
        obj = obj.__data
          || (isRaw = obj.rawProps) && typeof (isRaw = isRaw.data) === 'function' &&
             (path.shift(), isRaw())
          || obj;
      }
    }
    for (const p of path)
      if (obj) obj = obj[p]; else return;
    return obj;
  } catch (e) {}
}

function getStorage() {
  try {
    return JSON.parse(localStorage[GM_info.script.name]);
  } catch (e) {}
}

function isMenuReady(menu) {
  return menu.style.cssText.includes('px;');
}

function $(sel, base = document) {
  return base.querySelector(sel);
}

function setPointerEvents(el, value) {
  if (value != null) el.style.setProperty('pointer-events', value, 'important');
  else el.style.removeProperty('pointer-events');
}

function timedPromise(promiseInit, ms = 1000) {
  ms = new Promise(resolve => setTimeout(resolve, ms));
  return promiseInit
    ? Promise.race([ms, new Promise(promiseInit)])
    : ms;
}

async function waitFor(sel, base = document) {
  return $(sel, base) || timedPromise(resolve => {
    new MutationObserver((_, o) => {
      const el = $(sel, base); if (!el) return;
      o.disconnect();
      resolve(el);
    }).observe(base, {childList: true, subtree: true});
  });
}

function initStyle() {
  STYLE = document.createElement('style');
  STYLE.textContent = /*language=CSS*/ `
${PREVIEW_PARENT} .${ME} {
  opacity: .5;
}
${PREVIEW_PARENT} .${ME},
:is(${THUMB}):hover .${ME},
:is(${THUMB}):hover ~ .${ME} {
  display: block;
}
.${ME} {
  display: none;
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 100%;
  border: 2px solid #fff;
  right: 8px;
  margin: 0;
  padding: 0;
  background: #0006;
  box-shadow: .5px .5px 7px #000;
  pointer-events: auto;
  cursor: pointer;
  opacity: .75;
  z-index: 11000;
}
${PREVIEW_PARENT} .${ME}:hover,
.${ME}:hover {
  opacity: 1;
}
.${ME}:active {
  color: yellow;
}
.${ME}[data-block] { top: 75px; }
.${ME}[data-block="channel"] { top: 105px; }
yt-thumbnail-view-model .${ME} { margin-top: 10px; }
${PREVIEW_TAG} .${ME}[data-block] { right: 18px; margin-top: 24px; }
.ytd-playlist-panel-video-renderer .${ME}[data-block="unwatch"],
.ytd-playlist-video-renderer .${ME}[data-block="unwatch"] {
  top: 15px;
}
ytd-compact-video-renderer .${ME}[data-block] {
  top: 57px;
  right: 7px;
  box-shadow: .5px .5px 4px 6px #000;
  background: #000;
}
ytd-compact-video-renderer .${ME}[data-block="channel"] {
  top: 81px;
}
ytd-compact-video-renderer ytd-thumbnail-overlay-toggle-button-renderer:nth-child(1) {
  top: -4px;
}
ytd-compact-video-renderer ytd-thumbnail-overlay-toggle-button-renderer:nth-child(2) {
  top: 24px;
}
${RECS} .${ME}[data-block] {
  top: 44px;
  right: 10px;
}
${RECS} .${ME}[data-block="channel"] {
  top: 65px;
}
${RECS} .ytThumbnailHoverOverlayToggleActionsViewModelButton:nth-child(1) {
  margin-top: -7px;
}
${RECS} .ytThumbnailHoverOverlayToggleActionsViewModelButton:nth-child(2) {
  margin-top: -10px;
}
.${ME}::before {
  position: absolute;
  content: '';
  top: -8px;
  left: -6px;
  width: 32px;
  height: 30px;
}
.${ME}::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 0;
  margin: auto;
  border: none;
  border-bottom: 2px solid #fff;
}
.${ME}[data-block="video"]::after {
  transform: rotate(45deg);
}
.${ME}[data-block="channel"]::after {
  margin: auto 3px;
}
`.replace(/;/g, '!important;');
  document.head.appendChild(STYLE);
}
