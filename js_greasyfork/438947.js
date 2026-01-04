// ==UserScript==
// @name         IntCyoaEnhancer
// @namespace    https://agregen.gitlab.io/
// @version      0.7
// @description  QoL improvements for CYOAs made in IntCyoaCreator
// @author       agreg
// @license      MIT
// @match        https://*.neocities.org/*
// @match        https://intcyoacreator.onrender.com/*
// @icon         https://intcyoacreator.onrender.com/favicon.ico?
// @run-at       document-start
// @require      https://unpkg.com/mreframe@0.1.5/dist/mreframe.js
// @require      https://unpkg.com/lz-string/libs/lz-string.js
// @require      https://greasyfork.org/scripts/441035-json-edit/code/Json%20edit.js?version=1025094
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.27.0/prism.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.27.0/components/prism-json.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.27.0/plugins/match-braces/prism-match-braces.min.js
// @resource     material-design-icons   https://cdn.jsdelivr.net/npm/@mdi/font@latest/fonts/materialdesignicons-webfont.woff2?v=7.4.47
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/438947/IntCyoaEnhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/438947/IntCyoaEnhancer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // overriding AJAX sender (before the page starts loading) to detect project.json download done at init time
  let init, enhance, ready, _XHR = unsafeWindow.XMLHttpRequest;
  unsafeWindow.XMLHttpRequest = class XHR extends _XHR {
    constructor () {
      super();
      let _open = this.open;
      this.open = (...args) => {
        if ((`${args[0]}`.toUpperCase() === "GET") && (`${args[1]}`.match(/^project.json$|^js\/app\.\w*\.js$/))) {
          init(() => this.addEventListener('loadend', () => ready.then(() => setTimeout(enhance))));
          // displaying loading indicator if not present already (as a mod)
          if (!document.getElementById('indicator')) {
            let _indicator = document.createElement('div'),  NBSP = '\xA0';
            _indicator.style = `position: fixed;  top: 0;  left: 0;  z-index: 1000`;
            _indicator.title = args[1];
            document.body.prepend(_indicator);
            this.addEventListener('progress', e => {
              _indicator.innerText = NBSP + "Loading data: " + (!e.total ? `${(e.loaded/1024**2).toFixed(1)} MB` :
                                                                `${(100 * e.loaded / e.total).toFixed(2)}%`);
            });
            this.addEventListener('loadend', () => Object.assign(_indicator, {innerText: ""}));
          }
        }
        return _open.apply(this, args);
      };
    }
  };

  let $state = () => (typeof debugApp == 'object' ? debugApp : app.__vue__.$store.state.app);
  init = (thunk=enhance) => {!init.done && (console.log("IntCyoaEnhancer!"),  init.done = true,  thunk())};
  (ready = new Promise(resolve => document.addEventListener('readystatechange', () => (document.readyState == 'complete') && resolve())))
    .then(() => ['activated', 'rows', 'pointTypes'].every(k => k in $state()) && init());

  enhance = async () => {
    await new Promise(resolve => (function _wait () {!document.getElementById('indicator')?.innerHTML ? resolve() : setTimeout(_wait, 100)})());
    const ICCP = Boolean( document.querySelector(`script[src$='/html-to-image.min.js']`) );
    const ICCP2 = (typeof debugApp == 'object'),  ICC = !ICCP && !ICCP2;
    const CREATOR = (location.hostname == 'intcyoacreator.onrender.com' || (location.href+'/').startsWith("https://hikawasisters.neocities.org/ICCPlus/"));
    console.debug({ICC, ICCP, ICCP2, CREATOR});
    if (CREATOR && ICCP2) throw Error("Creator not supported for ICCP2");
    let {isArray} = Array,   isJson = x => (typeof x === 'string') && x.trim().match(/^{.*}$/); // minimal check
    let {assign, keys, values, entries, fromEntries} = Object;
    const COLOR = fromEntries("cyan gray grayDark light purple red danger secondary".split(" ").map(k =>
      [k, ["var(--", (!ICCP2 ? "" : "bs-"), k.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`), ")"].join("")]));
    let range = n => Array.from({length: n}, (_, i) => i);
    let times = (n, f) => range(n).forEach(f);
    let deepMerge = ((_assign = (o, path, v, [k1]=path.slice(-1)) => {path.slice(0, -1).forEach(k => {o[k] = o[k]||{}; o = o[k]}); o[k1] = v}) =>
      (o, ...os) => os.filter(Boolean).flatMap(entries).reduce((o, [k, v]) => (_assign(o, k.split("."), v), o), $clone(o)))();
    let _lazy = assign(thunk => {let _ = () => (_lazy._cache.has(_) || _lazy._cache.set(_, thunk()),  _lazy._cache.get(_));
                                 return _}, {_cache: new Map()});
    let _try = (thunk, fallback, quiet=false) => {try {return thunk()} catch (e) {quiet||console.error(e);  return fallback}};
    let _prompt = (message, value) => {let s = prompt(message, (typeof value == 'string' ? value : JSON.stringify(value)));
                                       return new Promise(resolve => (s != null) && resolve(s))};
    let _node = (tag, attr, ...children) => {
      let node = assign(document.createElement(tag), attr);
      children.forEach(child => {node.append(isArray(child) ? _node(...child) : document.createTextNode(`${child||""}`))});
      return node;
    };
    let _debounce = (thunk, msec) => function $debounce () {
      clearTimeout($debounce.delay);
      $debounce.delay = setTimeout(() => {
        $debounce.delay = null;
        thunk();
      }, msec);
    };
    let _toggleCls = (cls, e=document.body, on=!e?.classList?.contains(cls)) => {e?.classList?.[on ? 'add' : 'remove'](cls)};
    let $editor = $jsonEdit.createEditorModal('PROMPT');
    document.body.append($editor);
    GM_addStyle(`#PROMPT button {width:auto; background:darkgray; padding:0 1ex; border-radius:1ex}
                 #PROMPT .editor pre {padding:0 !important}`);
    ICCP2 && GM_addStyle(`@font-face {src: url(${JSON.stringify(GM_getResourceURL('material-design-icons'))}) format("woff2");
                                      font-family: "Material Design Icons*";  font-weight:normal;  font-style:normal}
                          .v-icon::before {font: normal normal normal 24px/1 "Material Design Icons*" !important}
                          .mdi-eye-lock::before {content: "\\F1C06"}  .mdi-table-of-contents::before {content: "\\F0836"}`);
    let validator = s => !s || _decode(s);
    let _edit = (message, value, {json=false}={}) => $editor[json ? 'editAsJson' : 'editText'](value, {title: message, validator});

    // title & savestate are stored in URL hash
    let _hash = _try(() => `["${decodeURIComponent( location.hash.slice(1) )}"]`);  // it's a JSON array of 2 strings, without '["' & '"]' parts
    let $save = [],   [$title="", $saved="", $snapshot=""] = _try(() => JSON.parse(CREATOR ? "[]" : _hash), []);
    let _encode = o => LZString.compressToBase64(isJson(o) ? o : JSON.stringify(o)),
        _decode = s => (isJson(s) ? JSON.parse(s) : JSON.parse(LZString.decompressFromBase64(s) || (_ => {throw Error("Invalid input")})()));
    let $updateUrl = ({title=$title, save=$save, snapshot=$snapshot}={}, url=new URL(location)) => CREATOR ||
      location.replace(assign(url, {hash: JSON.stringify([title, ...(!snapshot ? [$saved=save.join(",")] : ["", snapshot])]).slice(2, -2)}));
    // app state accessors
    let $store = () => app.__vue__.$store,   $pointTypes = () => $state().pointTypes,   $rows = () => $state().rows;
    let $items = _lazy(() => $rows().flatMap(row => row.objects));
    let $hiddenActive = _lazy(() => $items().filter(item => item.isSelectableMultiple || item.isImageUpload));
    let $itemsMap = _lazy((m = new Map()) => ($items().forEach(item => m.set(item.id, item)), m)),   $getItem = id => $itemsMap().get(id);
    let $cards = () => [...document.querySelectorAll(`.objectRow > .col > *`)].filter(e => e.__vue__?._props?.object?.id)
        .reverse().reduce((o, e) => Object.assign(o, {[e.__vue__._props.object.id]: e}), {});
    let _fatKeys = x => ['backgroundImage', 'rowBackgroundImage', 'objectBackgroundImage'].concat(x.isImageUpload ? [] : ['image']);
    let _slim = x => x && (typeof x !== 'object' ? x : isArray(x) ? x.map(_slim) :
                           assign({}, x, ..._fatKeys(x).map(k => ({[k]: void 0})),
                                  ...keys(x).filter(k => typeof x[k] === 'object').map(k => x[k] && ({[k]: _slim(x[k])}))));
    let $slimStateCopy = (state=$state()) => $clone( _slim(state) );
    try {$state()} catch (e) {console.error(e);  throw Error("[IntCyoaEnhancer] Can't access app state!", {cause: e})}

    let buttons = ICCP2 && fromEntries($rows().map(row => (row.buttonTypeRadio == 'choiceselect') && [row.buttonId, row]).filter(Boolean));
    let btnDeps = ICCP2 && fromEntries($rows().map(row => [row.requireds?.[0]?.reqId, `.row-${row.id}-bg:not(.hidden)`]).filter(([k]) => buttons[k]));

    let _bugfix = () => {
      $rows().forEach(row => {delete row.allowedChoicesChange});  // This is a runtime variable, why is it exported?! It breaks reset!
      [...document.querySelectorAll('*')].map(x => x.__vue__).filter(x => x && ('posOrNeg' in x))
        .forEach(x => {x.posOrNeg = (x.score.value < 0)});  // Score captions only calculate this when created
    };

    // logic taken from IntCyoaCreator as it appears to be hardwired into a UI component
    let _selectedMulti = (item, num, card, e=card?.querySelector(`.row:not([style]) > .col`)) => {  // selecting a multi-value
      let counter = 0, sign = Math.sign(num);
      let _timesCmp = n => (sign < 0 ? item.numMultipleTimesMinus < n : item.numMultipleTimesPluss > n);
      let _useMulti = () => _timesCmp(counter) && (item.multipleUseVariable = counter += sign,  true);
      let _addPoints = () => $pointTypes().filter(points => points.id == item.multipleScoreId).every(points =>
        _timesCmp(points.startingSum) && (item.multipleUseVariable = points.startingSum += sign,  true));
      ICCP2 && (num -= item.multipleUseVariable);
      times(Math.abs(num), _ => {
        if (ICCP2)
          document.querySelector(`.choice-${item.id} .mdi-${num > 0 ? 'plus' : 'minus'}`)?.click();  // yes, this is the only way :-(
        else if (item.isMultipleUseVariable ? _useMulti() : _addPoints())
          item.scores.forEach(score => {score.isActiveMul?.push(true);  // some weird ICCP thing
                                        $pointTypes().filter(points => points.id == score.id)
                                                     .forEach(points => {points.startingSum -= sign * parseInt(score.value)})});
      });
      ICCP && ([item.isActive, item.selectedThisManyTimesProp] = [true, item.multipleUseVariable]);
      ICC && e?.innerHTML.match("^[0-9]+$") && (e.innerText = item.multipleUseVariable);  // redrawing UI counter manually
    };
    let _loadSave = save => {  // applying a savestate
      let _cards = ICC && $cards(),  _matchHidden = s => s.match("^(.*)/(ON|IMG)#(.*)$");
      let tokens = save.split(','),  activated = tokens.filter(s => s && !_matchHidden(s));
      let hidden = tokens.map(_matchHidden).filter(Boolean).reduce((o, [_, id, k, v]) => (o[k][id] = v, o), {ON: {}, IMG: {}});
      let _activated = new Set(activated),  _isActivated = id => _activated.has(id);
      try {$store().commit({type: 'cleanActivated'})} catch (e) {}  // hopefully not broken…
      ICCP2 && keys(btnDeps).forEach(id => (!_isActivated(id) == !document.querySelector(btnDeps[id]))
                                     || document.querySelector(`div.row-${buttons[id].id} button`)?.click());
      $items().forEach(item => {
        if (item.isSelectableMultiple)
          _selectedMulti(item, parseInt(hidden.ON[item.id] || 0), _cards[item.id]);
        else if (item.isImageUpload)
          item.image = hidden.IMG[item.id]?.replaceAll("/CHAR#", ",");
      });
      //$store().commit({type: 'addNewActivatedArray', newActivated: activated});  // not all versions have this :-(
      $rows().forEach(row => {  // yes, four-level nested loop is how the app does everything
        row.isEditModeOn = false;
        delete row.allowedChoicesChange;  // bugfix: cleanActivated is supposed to do this… but it doesn't
        ICCP2 || row.objects.filter(item => _isActivated(item.id)).forEach(item => {
          item.isActive = true;
          row.currentChoices += 1;
        });
      });
      ICCP2 && (function recur (todo, todo_=[]) {
        todo.filter(item => (!item.isActive != !_isActivated(item.id))).forEach(item =>
          ((card=document.querySelector(`.choice-${item.id}`)) => (card ? card.click() : todo_.push(item)))());
        if (todo_.length < todo.length)
          (todo_.length > 0) && setTimeout(() => recur(todo_));
        else
          console.error("Infinite loop detected!");
      })($items());
      ICCP2 || setTimeout(() => {
        $rows().forEach(row => row.objects.filter(item => _isActivated(item.id)).forEach(item => {
          item.scores.forEach(score => $pointTypes().filter(points => points.id == score.id).forEach(points => {
            if (!score.requireds || (score.requireds.length <= 0) || $store().getters.checkRequireds(score)) {
              score.isActive = true;
              points.startingSum -= parseInt(score.value);
            }
          }));
        }));
      });
      ICCP2 || ($state().activated = tokens);
    };
    // these are used for generating savestate
    let _isActive = item => item && (item.isActive || (item.isImageUpload && item.image) || (item.isSelectableMultiple && (item.multipleUseVariable !== 0)));
    let _activeId = item => (!_isActive(item) ? null : item.id + (item.isImageUpload        ? `/IMG#${item.image.replaceAll(",", "/CHAR#")}` :
                                                                  item.isSelectableMultiple ? `/ON#${item.multipleUseVariable}`              : ""));
    //let _activated = () => $items().map(_activeId).filter(Boolean);  // this is how the app calculates it (selection order seems to be ignored)

    let $lock = (on => _toggleCls('-LOCK')),  _locked = (() => document.body.classList.contains('-LOCK'));
    function _mark () {  // $lock() relies on CSS classes which were not implemented in original ICC
      (_mark.FIX == null) && ((xs=values($cards())) => xs.length > 9 && assign(_mark,
         {FIX: ICC || !xs.some(e => Array.from(e.firstElementChild.classList).find(s => s.startsWith('choice-')))}))();
      _mark.FIX && values($cards()).forEach(e => {let x = e.__vue__.object, row = e.__vue__.row, selected = x.isActive || `${x.multipleUseVariable||0}` != '0';
                                                  _toggleCls('choice-selected', e.firstElementChild, selected);
                                                  _toggleCls('choice-unselected', e.firstElementChild, !row.isInfoRow && !x.isNotSelectable && !selected)})
    }

    _mark();
    let $hiddenActivated = () => $hiddenActive().filter(_isActive).map(item => item.id);  // images and multi-vals are excluded from state
    if (!ICCP2)
      $store().watch(state => state.app.activated.filter(Boolean).concat( $hiddenActivated() ),  // activated is formed incorrectly and may contain ""
                     ids => {$save = ids.map($getItem).map(_activeId).filter(Boolean);  $updateUrl();  _mark()});  // compared to the app """optimization""" this is blazing fast
    else {
      let $buttonsActive = () => keys(btnDeps).filter(k => document.querySelector(btnDeps[k]));
      let activated = [...$buttonsActive(), ...$items().filter(_isActive).map(_activeId)],  isActivated = new Set(activated);
      addEventListener('click', () => setTimeout(() => {
        let _activated = [...$buttonsActive(), ...$items().filter(_isActive).map(_activeId)];
        if ((_activated.length !== activated.length) || _activated.some(id => !isActivated.has(id))) {
          [activated, isActivated] = [_activated, new Set(_activated)];
          $save = activated;  $updateUrl();  _mark();
        }
      }));
    }

    let diff = initial => (current=$slimStateCopy(), cheat=$cheat.data) => {
      let _cheat = (function $slim (o) {
        if (!o || isArray(o) || (typeof o != 'object')) return o;
        let kvs = entries(o).filter(([k, v]) => $slim(v));
        return (kvs.length == 0 ? void 0 : fromEntries(kvs));
      })(cheat);
      return (function $diff (a, b/*, ...path*/) {
        if ((typeof a !== typeof b) || (isArray(a) !== isArray(b)) || (isArray(a) && (a.length !== b.length)))
          return b;
        else if (a && b && (typeof a === 'object')) {
          let res = entries(b).map(([k, v]) => [k, $diff(a[k], v/*, ...path, k*/)]).filter(([k, v]) => v !== void 0);
          if (res.length > 0) return fromEntries(res);
        } else if (a === a ? a !== b : b === b)
          return b;
      })(initial, {_cheat, ...current}) || {};
    };
    let restoreSnapshot = initial => (snapshot=$snapshot) => _try(() => {
      let {reFrame: rf, util: {getIn, assoc, isArray, isDict, keys}} = require('mreframe');
      let {_cheat, ..._state} = (typeof snapshot !== 'string' ? snapshot : _decode(snapshot||"{}"));
      let newState = (function $deepMerge (a, b) {
        return (!isDict(b) ? a : keys(b).reduce((o, k) => ((o[k] = (!isDict(b[k]) ? b[k] : $deepMerge(a[k], b[k]))), o), a));
      })($clone(initial), _state);
      (function $updState (a, x/*, ...path*/) {
        a && (typeof a == 'object') && keys(a).forEach(k => {
          isArray(a[k]) && (x[k] = (!isArray(x[k]) ? a[k] : x[k].slice(0, a[k].length).concat( a[k].slice(x[k].length) )));
          (!(k in x) || (typeof a[k] != 'object') ? x[k] = a[k] : $updState(a[k], x[k]/*, ...path, k*/));
        });
        isDict(x) && keys(x).filter(k => !(k in a) && !_fatKeys(x).includes(k)).forEach(k => {delete x[k]});
      })(newState, $state());
      (_cheat || $cheat.toggle) && ($cheat.toggle || $cheat(), rf.disp(['init-db', $cheat.data = _cheat]));
      _bugfix();
      $snapshot = _encode({_cheat, ..._state});
      $updateUrl();
      return true;
    }) || alert("State load failed. (Possible reason: invalid state snapshot.)");

    // debug functions for console
    let $activated = () => $state().activated,   $clone = x => JSON.parse(JSON.stringify(x));
    let $rowsActive = () => $rows().map(row => [row, row.objects.filter(_isActive)]).filter(([_, items]) => items.length > 0);
    let $dbg = {$store, $state, $pointTypes, $rows, $items, $getItem, $activated, $hiddenActivated, $rowsActive, $clone, $slimStateCopy};
    assign(unsafeWindow, {$dbg}, $dbg);

    // init && menu
    _bugfix();
    CREATOR || ["project.json", document.querySelector(`link[href^="js/app."][href$=".js"]`)?.href, `${location}`]
      .reduce((p, s) => p.catch(_ => fetch(s, {method: 'HEAD'})), Promise.reject()).then(x => x.headers.get('last-modified'))
      .then(s => {document.querySelector(`.v-bottom-navigation, .pointBar`).title = `Version: ${new Date(s || document.lastModified).toJSON()}`});
    let _title = document.title,  _initial = $slimStateCopy(),  _restore = restoreSnapshot(_initial),  _diff = diff(_initial);
    assign(unsafeWindow, {$initial: () => JSON.stringify(_initial).length, $diff: _diff, $encode: _encode, $decode: _decode, $bugfix: _bugfix});
    $title && (document.title = $title);
    ($saved||$snapshot) && confirm("Load state from URL?") && setTimeout(() => !$snapshot ? _loadSave($saved) : _restore($snapshot));
    let _syncSnapshot = _debounce(() => {$snapshot = (CREATOR ? JSON.stringify : _encode)(_diff()), $updateUrl()}, 1000);
    let $watch = (snapshot=($snapshot ? "" : _encode( _diff() ))) => {
      document.body.classList[snapshot ? 'add' : 'remove']('-FULL-SCAN');
      $snapshot = snapshot;
      $watch.stop = $watch.stop && ($watch.stop(), null);
      snapshot && ($watch.stop = $store().watch(x => x, _syncSnapshot, {deep: true}));
      $updateUrl();
    };
    CREATOR && ($snapshot = "{}");
    $snapshot && $watch($snapshot);
    CREATOR || GM_registerMenuCommand("Change webpage title", () =>
      _prompt("Change webpage title (empty to default)", $title||document.title).then(s => {document.title = ($title = s) || _title;  $updateUrl()}));
    GM_registerMenuCommand("Edit state", () => _edit("Edit state (empty to reset)", (!$snapshot ? $saved : _decode($snapshot)), {json: $snapshot})
                                                 .then(!$snapshot ? _loadSave : _restore));
    if (CREATOR) {
      let reset$ = () => {console.warn("Enhancer cache reset!");  _lazy._cache.clear();  $snapshot = "{}"};
      $store().subscribe(console.debug);
      $store().subscribe(x => (x.type == 'loadApp') && reset$());  // when loading state from file
      new MutationObserver(function _ () {  // when opening the View mode
        [_._old, _._screen] = [_._screen, app.__vue__.$children[0]?.$vnode.tag.replace(/.*-/, "")];
        document.getElementById('LIST-TOGGLE').style.display = (_._screen === 'appImageCyoaViewer' ? '' : 'none');
        (_._screen != _._old) && (_._screen === 'appImageCyoaViewer') && reset$();
      }).observe(app, {childList: true});
    } else {
      ICCP2 || GM_registerMenuCommand("Toggle full scan mode", () => $watch());
      GM_registerMenuCommand("Download project data", () => assign(document.createElement('a'), {
        download: "project.json", href: `data:application/json,${encodeURIComponent(JSON.stringify($state()) + "\n")}`,
      }).click());
      let _backpackSize = $state().backpack.length;
      let _backpackCmd = (_backpackSize == 1 ? GM_registerMenuCommand("Modify backpack", () => $addBackpack("", {edit: 0})) :
                          (_backpackSize == 0) && GM_registerMenuCommand("Enable backpack", () => $addBackpack().then(() => {
        GM_registerMenuCommand("Modify backpack", () => $addBackpack("", {edit: 0}), {id: _backpackCmd});
      })));
    }
    function _promptBackpack(prefix, opts={}) {
      return _prompt([prefix, "How many choices should be displayed in a row? (1-4)"].filter(Boolean).join("\n"), opts.initial||3).then(cols =>
        (["1", "2", "3", "4"].includes(cols) ? cols : new Promise(resolve => {
          (cols != null) && setTimeout(() => resolve(_promptBackpack(`Sorry, ${JSON.stringify(cols)} is not a valid column number.`, opts)));
        })));
    }
    function $addBackpack(prefix, opts={}) {
      let initial = (opts.edit != null) && {12: 1, 6: 2, 4: 3, 3: 4}[ $state().backpack[opts.edit]?.objectWidth?.match(/^col-md-([0-9]+)$/)?.[1] ];
      return _promptBackpack(prefix, {...opts, initial: opts.initial||initial}).then(cols => `col-md-${{1: 12, 2: 6, 3: 4, 4: 3}[cols]}`).then(objectWidth => {
         (opts.edit != null ? ($state().backpack[opts.edit].objectWidth = objectWidth) :
          $state().backpack = [{title: "Selected choices", titleText: "", template: "1", isInfoRow: true, isResultRow: true, objectWidth}]);
      });
    }

    const ROW_CARDS_SELECTORS = ["* > .row", "*"].map(s => `.v-application--wrap > ${s} > :not(.v-bottom-navigation) > div:not(.col)`);
    let _rowCards = () => [...document.querySelectorAll(ROW_CARDS_SELECTORS.join(", "))].filter(e => !e.style.display && e.__vue__).map(e => [e, e.__vue__._props?.row]);
    let $rowCards = (!ICCP2 ? _rowCards : (ids = new Map($rows().map(row => [`row-${row.id}`, row]))) =>
      [...document.querySelectorAll(`.container-fluid div.row`)].map(e => [e, [...e.classList].map(s => ids.get(s)).find(Boolean)]).filter(([e, row]) => row));
    let $overview = () => {
      if ($overview.toggle)
        $overview.toggle();
      else {
        const _ID = 'LIST', ID = '#'+_ID, _scroll = (s, bg='#2B2F35', thumb='grey', wk='::-webkit-scrollbar') =>
          `${s} {scrollbar-width:thin; scrollbar-color:${thumb} ${bg}}  ${s}${wk} {width:6px; height:6px; background:${bg}}  ${s}${wk}-thumb {background:${thumb}}`;
        GM_addStyle(`${ID} {position:fixed; top:0; left:0; height:100%; width:100%; background:#0008; z-index:1001}
                     ${ID} img {position:fixed; top:0; max-height:40%; object-fit:contain; background:#000B}
                     ${ID} .-nav .-row-name {cursor:pointer; padding:2px 1ex}  ${ID} .-nav .-row-name:hover {background:${COLOR.gray}}
                     ${ID} .-item-name {font-weight:bold}  ${ID} .-dialog :is(.-row-name, .-item):hover {cursor:help; text-shadow:0 0 10px}
                     ${ID} .-roll :is(input, button) {width:2.5em; color:black; background:${COLOR.light}}
                     ${ID} .-roll button {border-radius:2ex}  ${ID} input[type=number] {text-align:right}  ${ID} input:invalid {background:${COLOR.red}}` +
                     [[" .-roll", "0", "20%", "#0008"], [" .-dialog", "20%", "60%", COLOR.grayDark], [" .-nav", "80%", "20%", "#0008"]].map(([k, left, width, bg]) =>
                       `${ID}${k} {position:fixed; top:40%; left:${left}; height:calc(60% - 56px); width:${width}; color:${COLOR.light}; background:${bg};
                                   padding:1em; overflow-y:auto}  ${_scroll(ID+k)}`).join("\n"));
        document.body.append($overview.overlay = _node('div', {id: _ID, onclick: $overview}));
        $overview.overlay.append($overview.image = _node('img'));
        $overview.overlay.append($overview.activated = _node('div', {className: '-dialog', title: "Activated items", onclick: e => e.stopPropagation()}));
        $overview.overlay.append($overview.nav = _node('div', {className: '-nav', title: "Navigation (visible rows)", onclick: e => e.stopPropagation()}));
        $overview.overlay.append($overview.roll = _node('div', {className: '-roll', title: "Dice roll", onclick: e => e.stopPropagation()}));
        document.addEventListener('keydown', e => (e.key == 'Escape') && $overview.toggle(true));
        let _points = fromEntries( $pointTypes().map(points => [points.id, `[${points.id}] `+ (points.beforeText || `(${points.name})`)]) );
        let _ptReqOp = {1: ">", 2: "≥", 3: "=", 4: "≤", 5: "<"},  _ptReqCmpOp = {1: ">", 2: "=", 3: "≥"};
        let _req = score => x => (x.required ? "" : "NOT!") + ({id: x.reqId||"?", points: `${x.reqId||"?"} ${_ptReqOp[x.operator]} ${x.reqPoints}`,
                                                                   pointCompare: `${x.reqId||"?"} ${_ptReqCmpOp[x.operator]} ${x.reqId1||"?"}`})[x.type] || "???";
        let _cost = score => "  " + (_points[score.id] || `"${score.beforeText}"`) + (score.value > 0 ? " " : " +") + (-parseInt(score.value||0)) +
          ((score.requireds||[]).length == 0 ? "" : "\t{" + score.requireds.map(_req(score)).join("  &  ") + "}");
        let _showImg = ({image}) => () => ($overview.image.src = image) && ($overview.image.style.display = '');
        let _hideImg = () => {[$overview.image.src, $overview.image.style.display] = ["", 'none']};
        let _rowAttrs = row => ({className: '-row-name', title: `[${row.id}]\n\n${row.titleText}`.trim(), onmouseenter: _showImg(row), onmouseleave: _hideImg});
        let _nav = e => () => {$overview.toggle(true);  e.scrollIntoView({block: 'start', behavior: (!ICCP2 ? 'auto' : 'instant')})};
        let _dice = [1, 6, 0],  _roll = (n, m, k) => (_dice = [n, m, k, range(n).reduce(res => res + Math.floor(1 + m*Math.random()), k)], _dice[3]);
        let _setDice = idx => function () {this.value = parseInt(this.value)||_dice[idx];  _dice.splice(idx, 1, this.valueAsNumber)};
        $overview.toggle = (visible = !$overview.overlay.style.display) => {
          if (!visible) {
            $overview.roll.innerHTML = "<h3>Roll</h3>";
            $overview.roll.append( _node('div', {},
              ['p', {}, ['input', {type: 'number', title: "N", min: 1, value: _dice[0], onchange: _setDice(0)}], " d ",
                        ['input', {type: 'number', title: "M", min: 2, value: _dice[1], onchange: _setDice(1)}], " + ",
                        ['input', {type: 'number', title: "K",         value: _dice[2], onchange: _setDice(2)}], " = ",
                        ['button', {title: "ROLL", onclick () {this.innerText = _roll(..._dice)}}, `${_dice.length < 4 ? "(roll)" : _dice[3]}`]],
              "(NdM+K means rolling an M-sided die N times and adding K to the total)") );
            $overview.nav.innerHTML = "<h3>Navigation</h3>";
            $rowCards().forEach(([e, row]) => $overview.nav.append( _node('div', {..._rowAttrs(row), onclick: _nav(e)},
                                                                          (row.buttonId ? row.buttonText : row.title).trim() || ['i', {}, row.id]) ));
            $overview.activated.innerHTML = "<h3>Activated</h3>";
            $rowsActive().forEach(([row, items]) => {
              $overview.activated.append( _node('p', {className: '-row'},
                ['span', _rowAttrs(row), row.title.trim() || ['i', {}, row.id]],
                ": ",
                ...items.flatMap(item => [
                  ", ",
                  ['span', {className: '-item', title: [`[${item.id}]`, item.text, item.scores.map(_cost).join("\n")].filter(Boolean).join("\n\n").trim(),
                            onmouseenter: _showImg(item), onmouseleave: _hideImg},
                    ['span', {className: '-item-name'}, item.title.trim() || ['i', {}, item.id]],
                    !item.isActive && (item.isSelectableMultiple ? ` {×${item.multipleUseVariable}}` : " {Image}")],
                ]).slice(1)));
            });
          }
          $overview.overlay.style.display = (visible ? 'none' : '');
        }
        $overview.toggle(false);
      }
    };
    GM_registerMenuCommand("Overview", $overview);
    GM_addStyle(`#LIST-TOGGLE {position:fixed; right:3px; bottom:3px; z-index:1001; color:${COLOR.light}; background:${COLOR.gray};
                               padding:1ex; width:auto; border-radius:1em; outline-offset:-1px; outline:1px solid ${COLOR.grayDark}}
                 .-FULL-SCAN #LIST-TOGGLE {color:${COLOR.gray}; background:${COLOR.light}}`);
    document.body.append( _node('button', {id: 'LIST-TOGGLE', title: "Overview/dice roll", onclick: $overview,
                                           className: "v-icon mdc-icon-button mdi mdi-table-of-contents"}) );

    GM_registerMenuCommand("Lock choices (toggle)", () => $lock());
    GM_addStyle(`#LOCK {position:fixed; left:3px; bottom:3px; z-index:1001; color:${COLOR.light}; background:${COLOR.gray};
                        padding:1ex; width:auto; border-radius:1em; outline-offset:-1px; outline:1px solid ${COLOR.grayDark}}
                 .-LOCK #LOCK {color:${COLOR.gray}; background:${COLOR.light}}
                 body.-LOCK .row > *:has(> * > .choice-unselected) {display: none}  body.-LOCK .choice-selected {pointer-events: none}`);
    document.body.append( _node('button', {id: 'LOCK', className: "v-icon mdc-icon-button mdi mdi-eye-lock", title: "Lock & filter choices",
                                           onclick () {$lock();  this.title = `${_locked() ? "Unlock" : "Lock & filter"} choices`}}) );

    function $cheat() {
      if (!$cheat.toggle) {
        const {reFrame: rf, reagent: r, util: {getIn, update, assocIn, merge, entries}} = require('mreframe');
        let updateIn = (o, path, f, ...args) => assocIn(o, path, f(getIn(o, path), ...args));
        const _ID = 'CHEAT', ID = '#'+_ID, _scroll = (s, bg='#2B2F35', thumb='grey', wk='::-webkit-scrollbar') =>
          `${s} {scrollbar-width:thin; scrollbar-color:${thumb} ${bg}}  ${s}${wk} {width:6px; height:6px; background:${bg}}  ${s}${wk}-thumb {background:${thumb}}`;
        GM_addStyle(`${ID} {position:fixed; top:0; left:0; z-index:1000; color:${COLOR.light}; background:${COLOR.grayDark}; opacity:.75}  ${ID}:hover {opacity:1}
                     ${ID} .-frame {max-height:calc(100vh - 56px); display:flex; flex-direction:column}  ${ID} .-scrollbox {overflow-y:auto}  ${_scroll(ID+" .-scrollbox")}
                     ${ID} h3 {text-align:center}  ${ID} table.-points td, ${ID} .-cheats {padding:.5ex}  ${ID} .-row {display:flex; flex-direction:row}
                     ${ID} button {background-color:${COLOR.secondary}; border-style:outset; border-radius:1em; width:100%}
                     ${ID} td.-minus button, ${ID} tr.-minus :is(.-point-name, .-point-value) {background-color:${COLOR.danger}}
                     ${ID} td.-plus  button, ${ID} tr.-plus  :is(.-point-name, .-point-value) {background-color:${COLOR.purple}}
                     ${ID} button.-cheats {background: ${COLOR.cyan}}`);
        document.body.append($cheat.UI = _node('div', {id: _ID}));
        $cheat.toggle = () => rf.disp(['toggle-ui']);

        let _points = pointTypes => pointTypes.map(points => [points.id, points.name, points.beforeText, points.startingSum]);
        (ICCP2 ? addEventListener('click', () => setTimeout(() => rf.disp(['cache-points', _points($pointTypes())])))
               : $store().watch(state => _points(state.app.pointTypes), points => rf.disp(['cache-points', points])));
        let _upd = rf.after(({show, cache, ...data}) => {$cheat.data = data});

        rf.regEventDb('init-db', [_upd], (db, [_, {points={}}={}]) => merge(db, {
          show: false,
          points,
          cache: db.cache || {points: []},
        }));
        rf.regEventDb('toggle-ui', [_upd], db => update(db, 'show', x => !x));
        rf.regEventFx('point-add!', [_upd], ({db}, [_, id, n]) => ({db:     updateIn(db, ['points', id], x => (x||0)+n),
                                                                    points: [{id, add: n}]}));
        rf.regEventFx('reset-cheats!', [_upd], ({db}) => ({db:     merge(db, {points: {}}),
                                                           points: entries(db.points).map(([id, n]) => ({id, add: -n}))}));
        rf.regEventDb('cache-points', [_upd], (db, [_, points]) => assocIn(db, ['cache', 'points'], points));

        rf.regFx('points', changes => changes.forEach(({id, add}) => {$pointTypes().find(x => x.id == id).startingSum += add}));

        rf.regSub('show',       getIn);
        rf.regSub('points',     getIn);
        rf.regSub('cache',      getIn);
        rf.regSub('cheating?',  db => true);
        rf.regSub('points*',    ([_, id]) => rf.subscribe(['points', id]), n => n||0);
        let _change = n => (!n ? "" : `${n < 0 ? n : '+'+n}`);
        rf.regSub('point-show', ([_, id]) => rf.subscribe(['points', id]), _change);
        rf.regSub('point-changes', '<-', ['cache', 'points'], '<-', ['points'], ([points, o]) =>
          points.filter(([id]) => o[id]).map(([id, name, show]) => [`[${id}] ` + (show||`(${name})`), o[id]]));
        rf.regSub('tooltip', '<-', ['point-changes'], changes =>
          changes.map(([points, change]) => `${points} ${_change(change)}`).join("\n"));
        rf.regSub('cheating?', '<-', ['point-changes'], changes => changes.length > 0);

        let PointAdd = id => n => ['button', {onclick: () => rf.disp(['point-add!', id, n])}, (n > 0) && '+', n];
        let Points = () => ['table.-points', ...rf.dsub(['cache', 'points']).map(([id, name, show, amount]) =>
          ['tr', {class: [{1: '-plus', '-1': '-minus'}[Math.sign(rf.dsub(['points*', id]))]],
                  title: rf.dsub(['point-show', id])},
            ['td.-minus', ...[-100, -10, -1].map( PointAdd(id) )],
            ['td.-point-name', "[", ['tt', id], "]", ['br'], show||['em', "<untitled>"], ['br'], `(${name})`],
            ['td.-point-value', amount],
            ['td.-plus', ...[+100, +10, +1].map( PointAdd(id) )]])];
        let Frame = (...body) => ['.-frame',
          ['div.-row', {title: rf.dsub(['tooltip'])},
             ['button', {onclick: $cheat}, (rf.dsub(['cheating?']) ? "< HIDE" : "× CLOSE")],
             rf.dsub(['cheating?']) && ['button', {onclick: () => rf.disp(['reset-cheats!'])}, "RESET"]],
          ['h3', {title: rf.dsub(['tooltip'])}, "Points"],
          ['.-scrollbox', ...body]];
        let UI = () => (rf.dsub(['show']) ? [Frame, [Points]] :
                        rf.dsub(['cheating?']) && ['button.-cheats', {onclick: $cheat, title: rf.dsub(['tooltip'])}, " Cheats: on "]);

        rf.dispatchSync(['init-db']);
        rf.disp(['cache-points', _points( $pointTypes() )]);
        r.render([UI], $cheat.UI);
      }
      $cheat.toggle();
    }
    GM_registerMenuCommand("Cheat engine", $cheat);
  };
})();
