// ==UserScript==
// @name         F95zone marker
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  Marks F95Zone threads for future reference
// @author       agreg
// @license      MIT
// @match        https://f95zone.to/*
// @icon         https://www.google.com/s2/favicons?domain=f95zone.to
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/432585/F95zone%20marker.user.js
// @updateURL https://update.greasyfork.org/scripts/432585/F95zone%20marker.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* eslint no-multi-spaces:off */
(function() {
  'use strict';

  const THREADS = /^(https:\/\/f95zone.to)?\/threads\//;
  const OP = '.message-threadStarterPost';
  const OP_ICONS = `${OP} header .message-attribution-opposite`;
  var bookmarks = GM_getValue('bookmarks', {});
  var tags = GM_getValue('tags', {});

  let urlId = s => (!THREADS.test(s) ? null : s.replace(THREADS, '').match(/^([^\/]+\.)?([0-9]+)/)[2]);
  let $find = (s, e=document) => e.querySelector(s);
  let $find_ = (s, e=document) => Array.from( e.querySelectorAll(s) );
  let $parent = (e, check=()=>true) => (check(e.parentNode) ? e.parentNode : $parent(e.parentNode, check));
  let $e = (tag, options={}, ...children) => {var e = Object.assign(document.createElement(tag), options);
                                              children.forEach(x => e.append(x));
                                              return e}
  let $assign = (o, vals) => Object.assign(o, ...Object.entries(vals).map(([k, v]) => ({[k]: v||undefined})));
  let $bookmark = e => {
    e.prepend( $e('i', {className: "bookmarkLink bookmarkLink--highlightable is-bookmarked"}) );
    e.classList.add('-marker-bookmark');
  };
  let $updData = (id, e, data=GM_getValue(id), upd={}) => {if (data) {
    GM_setValue(id, $assign(data, upd));
    e.classList[data.fade ? 'add' : 'remove']('-marker-fade');
    e.classList[data.mark ? 'add' : 'remove']('-marker-mark');
    e.title = data.info || "";
  } else {
    GM_deleteValue(id);
    e.classList.remove('-marker-fade', '-marker-mark');
    e.title = "";
  }};

  let _$getData = () => Object.fromEntries(GM_listValues().map(k => [k, GM_getValue(k)]));
  let $exportData = () => $e('a', {
    download: `F95zoneMarker_${new Date().toJSON().match(/(.*)T/)[1]}.json`,
    href: "data:application/json;base64," + btoa(JSON.stringify(_$getData(), null, 2) + "\n"),
  }).click();
  let $importData = () => $e('input', {type: 'file', accept: 'application/json', onchange() {
    this.files[0] && Object.assign(new FileReader(), {onload () {
      let data = JSON.parse(this.result);
      GM_listValues().forEach(GM_deleteValue);
      Object.entries(data).forEach(([k, v]) => GM_setValue(k, v));
      location.reload();
    }}).readAsText(this.files[0]);
  }}).click();

  let $editIcon = (id, e) => {
    var icon = $e('i', {className: "fas fa-star", title: "Edit mark"});
    var data = GM_getValue(id), edit = null;
    let _$updData = (upd={}) => {$updData(id, e, data, upd);
                                 icon.classList.add(`-marker-${data ? "" : "un"}marked`);
                                 icon.classList.remove(`-marker-${data ? "un" : ""}marked`)}
    let $deleteMark = () => {if (confirm("Delete mark?")) {
      $toggleEdit();
      data = null;
      _$updData();
    }};
    let $toggleEdit = () => {if (edit) {
      edit.remove();
      edit = null;
    } else {
      data = data || {};
      document.body.append(edit = $e('div', {className: '-marker-dialog'},
                                     $e('textarea', {placeholder: "Tooltip", value: data.info||"", oninput () {_$updData({info: this.value})}}),
                                     $e('div', {className: '-marker-row'},
                                        $e('label', {},
                                           $e('input', {type: 'checkbox', checked: data.fade, onchange () {_$updData({fade: this.checked})}}),
                                           $e('span', {innerText: "Fade"})),
                                        $e('label', {},
                                           $e('input', {type: 'checkbox', checked: data.mark, onchange () {_$updData({mark: this.checked})}}),
                                           $e('span', {innerText: "Mark"}))),
                                     $e('div', {className: '-marker-row'},
                                        $e('button', {innerText: "OK", onclick: $toggleEdit}),
                                        $e('button', {innerText: "Delete", onclick: $deleteMark}),
                                        $e('button', {style: "float:right", innerText: "Export Data", onclick() {$toggleEdit(); $exportData()}}),
                                        $e('button', {style: "float:right", innerText: "Import Data", onclick() {$toggleEdit(); $importData()}}))));
    }};
    _$updData();
    return $e('a', {className: '-marker-edit', href: location.href, onclick () {$toggleEdit();  return false}}, icon);
  };

  GM_addStyle(`.-marker-unmarked {opacity: 0.5;  color: rgb(147, 152, 160)}   .-marker-marked {color: rgb(193, 88, 88)}
               .-marker-fade:not(:hover) {opacity: 0.25}   .-marker-fade:hover {outline: 2px solid black}   .-marker-mark {outline: 2px solid grey}
               .-marker-bookmark {font-weight: bold;  text-shadow: 0 0, 0 0 7px !important}   .-marker-bookmark .bookmarkLink {padding-right: 1ex}
               .-marker-dialog {position: fixed;  top: 30%;  left: 30%;  width: 40%;  background: rgb(29, 31, 33);  border-radius: 5px;  z-index:1000}
               .-marker-dialog > * {margin: 1em}   .-marker-dialog textarea {width: calc(100% - 2em)}
               .-marker-dialog .-marker-row > * {margin-left: .5em;  margin-right: .5em}   .-marker-tag {box-shadow: 0 0 1px 2px !important}`);

  $find_(".structItem-title").forEach(e => {                     // forum, similar threads
    let _id = urlId(e.getAttribute('uix-data-href')||"");
    _id && $updData(_id, $parent(e, x => x.classList.contains('structItem--thread')));
    bookmarks[_id] && $bookmark(e);
  });

  if (['/search/', '/tags/'].some(s => location.pathname.startsWith(s))) {  // search results
    $find_(".contentRow-title a").forEach(e => {
      let _id = urlId(e.href||"");
      console.log(e.href, _id)
      _id && $updData(_id, $parent(e, x => /^li$/i.test(x.tagName)));
      bookmarks[_id] && $bookmark(e);
    });
  }

  if (['/latest', '/sam/latest_alpha'].some(s => location.pathname.startsWith(s))) {  // latest updates
    GM_addStyle(`.-marker-mark {display: block;/* Chrome bug */}   .-marker-hide :is(.-marker-edit, .-marker-tag) {display: none}
                 .-marker-dialog {top: 45%;  left: calc(30% - 125px - 10px)}
                 @media only screen and (max-width: 1240px) {.-marker-dialog {left: 30%}}
                 .-marker-edit {position: absolute;  top: 2%;  right: 1%;  z-index: 10;  opacity: 0.7;  background: black;  border-radius: 5px}
                 .-marker-edit > * {padding: 5px 3px;  opacity: 1}   .resource-tile:hover .-marker-tags {display: none}
                 .-marker-tags {position: absolute;  top: 2%;  left: 1%;  z-index: 10;  font-size: smaller;  width: calc(97% - 24px)}
                 .-marker-tags > * {display: inline-block;  background: #A44C;  border-radius: 3px;  padding: 0 5px;  margin: 1px}}`);
    let _allTagIds = (() => {try {return latestUpdates.tags} catch (e) {}})();  // eslint-disable-line no-undef
    let _markedTagIds = Object.fromEntries( Object.entries(_allTagIds||{}).filter(([_, k]) => tags[k]) );
    new MutationObserver(mutations => mutations.forEach(m => Array.from(m.addedNodes).filter(e => e.tagName).forEach(node => {
      console.debug(node, node.children);
      $find_(".resource-tile_tags > span", node).forEach(e => tags[e.innerText] && e.classList.add('-marker-tag'));
      $find_("a.resource-tile_link", node).forEach(e => {
        let _id = urlId(e.href||"");
        let _tags = (e.parentNode.getAttribute('data-tags')||"").split(',').map(id => _markedTagIds[id]).filter(Boolean);
        console.log(e.href, _id, _tags);
        e.append($editIcon(_id, e));
        e.append($e('div', {className: "-marker-tags"}, ..._tags.map(s => $e('span', {className: "-marker-tag", innerText: s}))));
        _id && $updData(_id, e);
        bookmarks[_id] && $bookmark($find('.resource-tile_info-header_title', e));
      });
    }))).observe(document.body, {subtree: true, childList: true});
    [['keydown', 'add'], ['keyup', 'remove']].forEach(([name, toggle]) =>  // hide extra elements when holding down Shift
      document.addEventListener(name, evt => (evt.key == 'Shift') && document.body.classList[toggle]('-marker-hide')));
    document.addEventListener('visibilitychange', () => document.body.classList.remove('-marker-hide'));  // unhide when switching tabs
  }

  if (location.pathname === '/account/bookmarks') {
    $find_("li.block-row").forEach(e => {
      let _id = urlId($find(".contentRow-title a", e).href||"");
      if (_id) {
        let toolbar = $find(".contentRow-extra", e);
        toolbar.insertBefore($editIcon(_id, e), toolbar.firstChild);
        bookmarks[_id] = true;
      }
    });
    GM_setValue('bookmarks', bookmarks);
  }

  if (location.pathname.startsWith('/threads/') && $find(OP)) {  // first page of a thread
    let _icons = $find(OP_ICONS), _id = urlId(location.href), _bookmarked = Boolean($find("a.is-bookmarked", _icons));
    if ( $find_('a', _icons).some(e => e.innerText == "#1") ) {
      _icons.insertBefore($e('li', {}, $editIcon(_id, $find(OP))),
                          _icons.firstChild);
    }
    (_bookmarked || bookmarks[_id]) && GM_setValue('bookmarks', $assign(bookmarks, {[_id]: _bookmarked}));
  }

  if (location.pathname.startsWith('/threads/')) {  // thread tags
    let _tagList = $find(".js-tagList"), _tags = $find_(".tagItem", _tagList);
    let _markTag = (e, id) => e.classList[tags[id] ? 'add' : 'remove']('-marker-tag');
    _tags.forEach(e => {
      let id = e.innerText;
      _markTag(e, id);
      e.title = "Middle Click to mark/unmark the tag as important";
      e.addEventListener('auxclick', evt => {evt.preventDefault();
                                             GM_setValue('tags', $assign(tags, {[id]: !tags[id]||void 0}));
                                             _markTag(e, id)});
    });
  }
})();
