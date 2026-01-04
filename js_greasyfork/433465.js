// ==UserScript==
// @name         Quick CYOA calculator
// @namespace    http://tampermonkey.net/
// @version      0.9.7
// @description  Overlay for quick CYOA playing
// @author       agreg
// @license      MIT
// @match        https://cubari.moe/*
// @match        https://imgur.com/*
// @match        https://imgchest.com/*
// @match        https://www.imgchest.com/*
// @match        https://ibb.co/*
// @match        https://funnyjunk.com/*/*
// @match        https://www.reddit.com/r/*/comments/*
// @match        https://old.reddit.com/r/*/comments/*
// @match        https://www.reddit.com/media?*
// @match        https://agregen.gitlab.io/cyoa-viewer/v1.html?*
// @match        https://agregen.gitlab.io/cyoa-viewer/v2.html?*
// @match        https://*/*.jpg
// @match        https://*/*.jpeg
// @match        https://*/*.png
// @match        https://*/*.webp
// @match        http://*/*.jpg
// @match        http://*/*.jpeg
// @match        http://*/*.png
// @match        http://*/*.webp
// @match        file://*/*.jpg
// @match        file://*/*.jpeg
// @match        file://*/*.png
// @match        file://*/*.webp
// @require      https://unpkg.com/mreframe@0.1.1/dist/mreframe.js
// @require      https://unpkg.com/lz-string/libs/lz-string.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/433465/Quick%20CYOA%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/433465/Quick%20CYOA%20calculator.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (window != window.top) return; // embedded frame
  const [HOST, URI] = [location.hostname, location.pathname];
  const [CUBARI, IMGUR, IMAGECHEST, IMGBB, FUNNYJUNK, GITLAB] = ["cubari.moe", "imgur.com", "imgchest.com", "ibb.co", "funnyjunk.com", "agregen.gitlab.io"];
  const REDDIT = /(www|old)\.reddit\.com/;
  if (HOST == "www.imgchest.com") location.hostname = IMAGECHEST;  // who links like this?

  let $wrap = (before, after, thunk) => {try {before();  thunk()} finally {after()}};

  GM_registerMenuCommand("Toggle overlay", async function $toggle () {
    const {reFrame: rf, reagent: r, util: {getIn, assoc, assocIn, dissoc, merge, keys, entries, dict, isDict, isArray}} = require('mreframe');
    const $ = '-cyoaoverlay';
    const [HEIGHT, WIDTH] = ["50vh", "max(300px, 33vw)"];
    const COLORS = {white: "", red: 'red', green: 'lime', blue: 'royalblue'/*'cornflowerblue'*/, orange: 'orange', yellow: 'yellow', violet: 'blueviolet', purple: 'magenta', grey: 'grey'};
    const GROUPING = {list: "", groups: 'groups', inline: 'inline'};
    let _trim = s => `${s}`.replace(/\s+/g, ' ').trim();
    let _cap = s => `${s}`.replace(/^./, c => c.toUpperCase());
    let _mapVals = (o, f) => dict( entries(o).map(([k, v]) => [k, f(v)]) );
    let _dissocIn = (o, path, k) => assocIn(o, path, dissoc(getIn(o, path), k));
    let _sort = xs => xs.slice().sort(new Intl.Collator('en', {sensitivity: 'base'}).compare);
    let _isEmpty = o => {for (let k in o) return false;  return true};
    let _isInt = Number.isInteger;
    let _delta = (n, plus='+') => `${n < 0 ? '−' : plus}${Math.abs(n)}`;
    let _partBy = (xs, f) => xs.reduce(([xss, last], x) => {
      let cur = f(x);   cur === last || xss.push([]);   xss[xss.length-1].push(x);   return [xss, cur];
    }, [[]])[0];

    let $setHash = Object.assign(hash => {
      $wrap(() => {if (HOST == IMAGECHEST) unsafeWindow.scrollTo = () => {}},
            () => {if (HOST == IMAGECHEST) unsafeWindow.scrollTo = $setHash._scrollTo},
            () => {location.hash = hash});
    }, {_scrollTo: unsafeWindow.scrollTo});

    if (!$toggle.inited) {
      $toggle.inited = true;
      let _flex = (dir='column') => `display:flex; flex-direction:${dir}`;
      let _scroll = (s, bg='lightgrey', thumb='grey', wk='::-webkit-scrollbar') =>
        `.${s} {scrollbar-width:thin; scrollbar-color:${thumb} ${bg}}  .${s}${wk} {width:6px; height:6px; background:${bg}}  .${s}${wk}-thumb {background:${thumb}}`;
      GM_addStyle(`.${$} {z-index:10000; position:fixed; top:0; right:0; max-height:${HEIGHT}; max-width:${WIDTH}; background:rgba(0,0,0,.85); color:white}
                   .${$}:not(.${$}-pin):not(:hover) {opacity:.1}  .${$} {${_flex()}}  .${$}-header {${_flex('row')}; width:${WIDTH}; flex:0 0; align-items:center}
                   .${$} input, .${$} textarea {max-width:100%; appearance:auto}  .-cyoaoverlay input::-webkit-inner-spin-button {-webkit-appearance:auto}
                   .${$}-wide {flex: 1}  .${$}-noshrink {flex-shrink: 0}  .${$} textarea {resize: none}  .${$} .${$}-comment {white-space:pre-wrap; text-indent:0}
                   .${$} p {padding:0 1em; margin:16px 0; text-indent:-1ex; font-size:initial}  .${$} ul {margin:1ex 0; list-style-type:initial}  .${$} li {margin-left:2em}
                   .${$} button {color:black; background:lightgrey; padding:0 .5ex; border-radius:5px}  .${$}-header input {margin:1ex}  .${$} i {display:initial}
                   .${$}-row {${_flex('row')}; flex:1 0; align-items:center; gap:.5ex; overflow-x:auto; padding:0 1ex} ${_scroll($+'-cols')}
                   .${$}-rows {overflow-y:auto} ${_scroll($+'-rows')}  .${$}-clickable {cursor:pointer}  .${$}-clickable:hover {opacity:.8}`);

      let _selected = rf.onChanges(o => keys(o).filter(k => o[k].amount > 0).map(name => merge({name, cost: {}}, o[name])),
                                   ['_selected'], ['choices']);
      rf.regEventDb('init-db', [_selected], () => ({
        hidden:  false,
        pin:     false,
        view:    'points',
        build:   "",
        builds:  [],
        syncUrl: false,
        focus:   null,
        extras:  false,
        filter:  false,
        edit:    true,
        group:   null,
        search:  "",
        roll:    [1, 6, 0],
        comment: "",
        points:  {"points": 0},
        choices: {},
      }));
      let _clearCosts = choices => _mapVals(choices, x => (!_isEmpty(x.cost||{}) ? x : dissoc(x, 'cost')));
      let _state = ({comment, points, choices}) => ({comment: comment||void 0, points, choices: _clearCosts(choices)});
      let _hash = db => LZString.compressToBase64(JSON.stringify( _state(db) ));
      let _store = rf.after(db => {db.build && GM_setValue(db.build, _state(db));  db.syncUrl && $setHash( _hash(db) )});
      rf.regCofx('builds', cofx => assoc(cofx, 'builds', GM_listValues()));
      rf.regEventDb('set', [_selected], (db, [_, o]) => merge(db, o));
      rf.regEventFx('error', ({db}, [_, error]) => ({error}));
      rf.regEventFx('set-focus', ({db}, [_, focus=null]) => merge({db: merge(db, {focus})}, focus && {scroll: focus}));
      let _pts = (initial, color) => (isArray(initial) ? _pts(initial[0], color) : !COLORS[color] ? initial : [initial, color]);
      rf.regEventDb('set-roll', (db, [_, n, m, k, r]) => (![n, m, k].every(_isInt) ? db : merge(db, {roll: !_isInt(r) ? [n, m, k] : [n, m, k, r]})));
      rf.regEventFx('roll!', ({db}) => ({roll: db.roll}));
      rf.regEventDb('set-comment', [_store], (db, [_, comment]) => merge(db, {comment}));
      rf.regEventDb('set-initial', [_store], (db, [_, k, v]) => (!v && (v !== 0) ? db : assocIn(db, ['points', k], _pts(v, db.points[k][1]))));
      rf.regEventDb('set-point-color', [_store], (db, [_, k, v]) => assocIn(db, ['points', k], _pts(db.points[k], v)));
      rf.regEventDb('set-choice-color', [_selected, _store], (db, [_, k, v]) => (COLORS[v] ? assocIn(db, ['choices', k, 'color'], v) : _dissocIn(db, ['choices', k], 'color')));
      rf.regEventDb('set-amount', [_selected, _store], (db, [_, name, v]) => (!v && (v !== 0) ? db : assocIn(db, ['choices', name, 'amount'], v)));
      rf.regEventDb('unset-amount', [_selected, _store], (db, [_, name]) => _dissocIn(db, ['choices', name], 'amount'));
      rf.regEventDb('set-cost', [_selected, _store], (db, [_, name, k, v]) => (!v && (v !== 0) ? db : assocIn(db, ['choices', name, 'cost', k], v)));
      rf.regEventDb('unset-cost', [_selected, _store], (db, [_, name, k]) => _dissocIn(db, ['choices', name, 'cost'], k));
      let _renameKey = (o, k0, k1) => o && (k0 in o ? assoc(dissoc(o, k0), k1, o[k0]) : o);
      let _renamePoint = (db, k1, k0) => ({points: _renameKey(db.points, k0, k1),  choices: _mapVals(db.choices, x => merge(x, x.cost && {cost: _renameKey(x.cost, k0, k1)}))});
      let _nameCheck = (db, kind, newName, oldName, upd) =>
        (!newName || (newName == oldName)              ? {} :
         newName in db[kind+'s']                       ? {error: `${_cap(kind)} name “${newName}” already exists!`} :
         oldName && !(oldName in db[kind+'s'])         ? {error: `${_cap(kind)} name “${oldName}” not found!`} :
         db.focus && oldName && (db.focus !== oldName) ? {db: merge(db, upd(db, newName, oldName)), scroll: db.focus} :
         {db: merge(db, {focus: newName}, upd(db, newName, oldName)), scroll: newName});
      rf.regEventFx('rename-point', [_selected, _store], ({db}, [_, k0, k1]) => _nameCheck(db, 'point', _trim(k1), k0, _renamePoint));
      rf.regEventFx('rename-choice', [_selected, _store], ({db}, [_, k0, k1]) => _nameCheck(db, 'choice', _trim(k1), k0, () => ({choices: _renameKey(db.choices, k0, _trim(k1))})));
      rf.regEventFx('delete-point', ({db}, [_, k]) => ({confirm: {message: `Delete point “${k}”?`, onSuccess: ['_delete-point', k]}}));
      rf.regEventDb('_delete-point', [_selected, _store], (db, [_, k]) =>
        merge(db, {points: dissoc(db.points, k), choices: _mapVals(db.choices, x => _dissocIn(x, ['cost'], k))}));
      rf.regEventFx('delete-choice', ({db}, [_, k]) => ({confirm: {message: `Delete choice “${k}”?`, onSuccess: ['_delete-choice', k]}}));
      rf.regEventDb('_delete-choice', [_selected, _store], (db, [_, k]) => merge(db, {choices: dissoc(db.choices, k)}));
      entries({point: ['points', 0], choice: ['Choice', {amount: 1}]}).forEach(([kind, [name, value]]) => {
        rf.regEventFx(`new-${kind}`, ({db}) =>
          ({prompt: {message: `Enter new ${name.toLowerCase()} name`, default: `${name} #${keys(db[kind+'s']).length+1}`, onSuccess: [`_new-${kind}`]}}));
        rf.regEventFx(`_new-${kind}`, [_selected, _store], ({db}, [_, _name]) =>
          _nameCheck(db, kind, _trim(_name), null, (db, name) => ({[kind+'s']: assoc(db[kind+'s'], name, value)})));
      });
      let _buildCheck = (db, build) => (!build || (build == db.build)      ? {} :
                                        GM_getValue(build)                 ? {error: `Build name “${build}” already exists!`} :
                                        db.build && !GM_getValue(db.build) ? {error: `Build name “${db.build}” not found!`} :
                                        merge({db: merge(db, {build})}, db.build && {delete: db.build}, {dispatch: ['sync-builds']}));
      rf.regEventFx('save', ({db}) => ({prompt: {message: "Name your build", default: db.build||document.title, onSuccess: ['_save']}}));
      rf.regEventFx('_save', [_selected, _store], ({db}, [_, build]) => _buildCheck(db, _trim(build)));
      rf.regEventFx('load', ({db}, [_, build]) => ({confirm: {message: `Load build “${build}”?`, onSuccess: ['_load', build]}}));
      rf.regEventFx('_load', ({db}, [_, build=db.build]) => build && {db: merge(db, {build}), load: build});
      rf.regEventFx('sync-builds', [rf.injectCofx('builds')], ({db, builds}) => ({db: merge(db, {builds})}));
      rf.regEventFx('delete', ({db}, [_, build=db.build]) => ({confirm: {message: `Delete build “${build}” from storage?`, onSuccess: ['_delete', build]}}));
      rf.regEventFx('_delete', [_selected, _store], ({db}, [_, build]) => build && {delete: build, dispatch: ['sync-builds']});
      rf.regEventFx('export', ({db}, [_, build=db.build]) => build && {export: build});
      rf.regEventFx('import', () => ({import: {onSuccess: ['_import'], onFailure: ['error']}}));
      let _validPoint = ([k, v]) => k && (k == _trim(k)) && (_isInt(v) || (isArray(v) && (v.length == 2) && _isInt(v[0]) && (v[1] in COLORS)));
      let _validChoice = points => ([s, x]) => (s && (s == _trim(s)) && isDict(x) && keys(x).every(k => ['amount', 'color', 'cost'].includes(k))
                                                && (!('amount' in x) || (_isInt(x.amount) && (x.amount >= 0))) && (!('color' in x) || (x.color in COLORS))
                                                && (!('cost' in x) || (isDict(x.cost) && entries(x.cost).every(([k, v]) => (k in points) && Number.isFinite(v)))));
      let _valid = o => (o && keys(o).every(k => ['comment', 'points', 'choices'].includes(k)) && ['string', 'undefined'].includes(typeof o.comment)
                         && isDict(o.points) && entries(o.points).every(_validPoint)
                         && isDict(o.choices) && entries(o.choices).every(_validChoice(o.points)));
      rf.regEventFx('_import', [_selected, _store], ({db}, [_, data, extra={}]) =>
        (!_valid(data) ? {error: "Invalid import data!"} : {db: merge(db, {comment: "", points: {}, choices: {}}, data, extra), dispatch: ['sync-builds']}));
      rf.regEventFx('import-hash', ({db}, [_, data]) =>
        _valid(data) && {confirm: {message: "Import data from URL hash?", onSuccess: ['_import', data, {syncUrl: true}]}});
      rf.regEventFx('sync-url', ({db}, [_, syncUrl=!db.syncUrl]) =>
        (!syncUrl || db.syncUrl ? {dispatchLater: {dispatch: ['_sync-url', syncUrl]}} :
         {confirm: {message: "Sync URL hash? This overrides existing hash value.", onSuccess: ['_sync-url', syncUrl]}}));
      rf.regEventDb('_sync-url', [_store], (db, [_, syncUrl]) => merge(db, {syncUrl}));

      rf.regFx('error', alert);
      rf.regFx('confirm', ({message, onSuccess}) => confirm(message) && rf.disp(onSuccess));
      rf.regFx('prompt', ({message, onSuccess, ...arg}) => setTimeout(() => {
        let res = prompt(message, arg.default||"");
        (res != null) && rf.disp(onSuccess, res);
      }, 250));
      rf.regFx('load', (build, data=GM_getValue(build)) => {
        if (data) {
          let {comment="", points={"points": 0}, choices={}} = data;
          rf.disp(['set', {comment, points, choices}]);
          rf.dsub(['build-view']) && rf.disp(['sync-builds']);
          rf.dsub(['syncUrl']) && rf.disp(['_sync-url', true]);
        }
      });
      rf.regFx('delete', build => {GM_deleteValue(build);  (build == rf.dsub(['build']) ? $toggle() : rf.disp(['set', {now: Date.now()}]))});
      rf.regFx('scroll', name => setTimeout(() => $toggle.overlay.querySelector(`[name="${name.replace(/"/g, '\\"')}"]`).scrollIntoView({block: 'nearest'}), 100));
      let _sortKeys = o => (k, v) => (v === o || !isDict(v) ? v : dict( _sort(keys(v)).map(k => [k, v[k]]) )),  _toJson = o => JSON.stringify(o, _sortKeys(o), 2);
      rf.regFx('export', build => Object.assign(document.createElement('a'), {
        download: `${build}.json`,   href: "data:application/json," + encodeURIComponent(_toJson(GM_getValue(build, {})) + '\n'),
      }).click());
      rf.regFx('import', ({onSuccess, onFailure}, input=document.createElement('input')) => Object.assign(input, {
        type: 'file',   accept: 'application/json',
        onchange () {Promise.resolve(this.files[0]).then(x => x.text()).then(s => rf.disp(onSuccess, JSON.parse(s))).catch(e => rf.disp(onFailure, `${e}`))},
      }).click());
      rf.regFx('roll', ([n, m, k]) => rf.disp(['set-roll', n, m, k, Array.from({length: n}, _ => Math.floor(1 + m * Math.random())).reduce((a, b) => a+b, k)]));

      rf.regSub('hidden', getIn);
      rf.regSub('pin', getIn);
      rf.regSub('view', getIn);
      rf.regSub('build', getIn);
      rf.regSub('syncUrl', getIn);
      rf.regSub('focus', getIn);
      rf.regSub('extras', getIn);
      rf.regSub('filter', getIn);
      rf.regSub('edit', getIn);
      rf.regSub('group', getIn);
      rf.regSub('search', getIn);
      rf.regSub('roll', getIn);
      rf.regSub('comment', getIn);
      rf.regSub('points', getIn);
      rf.regSub('choices', getIn);
      rf.regSub('_selected', getIn);
      rf.regSub('builds', getIn);
      rf.regSub('builds*', '<-', ['builds'], _sort);
      rf.regSub('build-exists?', '<-', ['build'], '<-', ['builds'], ([k, ks]) => k && ks.includes(k));
      rf.regSub('point-names', '<-', ['points'], keys);
      rf.regSub('point-names*', '<-', ['point-names'], _sort);
      rf.regSub('points*', '<-', ['points'], '<-', ['point-names*'], ([o, ks]) => ks.map(k => [k].concat(o[k])));
      rf.regSub('choice-names', '<-', ['choices'], keys);
      rf.regSub('choice-names-filtered', '<-', ['_selected'], xs => _sort( xs.map(x => x.name) ));
      rf.regSub('selected', '<-', ['choice-names-filtered'], '<-', ['choices'], ([ks, o]) => ks.map(name => merge({name, cost: {}}, o[name])));
      rf.regSub('choice-names-filtered*', '<-', ['choice-names'], '<-', ['choice-names-filtered'], '<-', ['filter'], ([ks0, ks1, cond]) => cond ? ks1 : ks0);
      rf.regSub('choice-names-searched', '<-', ['choice-names-filtered*'], '<-', ['search'], '<-', ['edit'],
                ([xs, s, edit]) => (!edit || !s ? xs : (s = s.toLowerCase(), xs.filter(x => x.toLowerCase().indexOf(s) >= 0)))); // apparently .includes() can be much slower smh
      rf.regSub('choice-names*', '<-', ['choice-names-searched'], _sort);
      rf.regSub('choice*', ([_, name]) => rf.subscribe(['choices', name]), (x, [_, name]) => merge({name}, x));
      let _group = s => (s.match(/^([^:]+): /) || [s, ""])[1];
      rf.regSub('choice-groups', '<-', ['choice-names*'], ks => _partBy(ks, _group).map(ss => [_group(ss[0]), ss]));
      rf.regSub('choice-groups*', '<-', ['choice-groups'], grs => grs.reduce((o, [k, xs]) => ((k ? o[k] = xs : [].push.apply(o[k], xs)), o), {"": []}));
      rf.regSub('choice-group', '<-', ['choices'], '<-', ['choice-groups*'], ([o, groups], [_, s]) => dict( (groups[s]||[]).map(k => [k, o[k]])));
      rf.regSub('choice-group-names', '<-', ['choice-groups*'], keys);
      rf.regSub('#choices', '<-', ['choice-names'], xs => xs.length);
      rf.regSub('#selected', '<-', ['_selected'], xs => xs.length);
      rf.regSub('build-view', '<-', ['view'], s => s === 'build');
      rf.regSub('roll-tooltip', '<-', ['roll'], ([n, m, k]) => `Roll ${m}-sided die` + (n == 1 ? "" : ` ${n} times`) + (!k ? "" : ` and add ${_delta(k, '')} to the result`));
      rf.regSub('choice-tooltip', ([_, name]) => [['choices', name], ['point-names*']].map(rf.subscribe), ([{amount=0, cost={}}={}, pts], [_, name]) => [
        `  ${name} [×${amount}]`,
        ...pts.map(k => [k, cost[k]]).map(([k, v]) => v && (_delta(v) + (amount < 2 ? '' : ` × ${amount} = ${_delta(v*amount)}`) + ` ${k}`)).filter(s => s),
      ].join('\n'));
      rf.regSub('total', '<-', ['_selected'], (xs, [_, k]) => xs.map(x => x.amount * (x.cost[k]||0)).reduce((a, b) => a+b, 0));

      $toggle.onpress = evt => {(evt.key == 'Escape') && rf.disp(['set', (rf.dsub(['focus']) ? {focus: null} : rf.dsub(['pin']) ? {} : {hidden: true})])};
      $toggle.loadBuild = () => rf.dsub(['build']) && rf.disp(['_load']);
      $toggle.syncBuilds = () => rf.disp(['sync-builds']);
    }

    if ($toggle.overlay) {
      r.render(null, $toggle.overlay),   rf.dispatchSync(['init-db']),   rf.purgeEventQueue(),   rf.clearSubscriptionCache();
      $toggle.overlay.remove();
      clearInterval($toggle.syncBuilds);
      window.removeEventListener('focus', $toggle.loadBuild);
      window.removeEventListener('focus', $toggle.syncBuilds);
      document.removeEventListener('keydown', $toggle.onpress);
      $toggle.overlay = null;
    } else {
      window.addEventListener('focus', $toggle.loadBuild);
      window.addEventListener('focus', $toggle.syncBuilds);
      document.addEventListener('keydown', $toggle.onpress);
      document.body.append($toggle.overlay = document.createElement('div'));
      let _len = s => `${s}`.length+1,  _lenEm = s => `${2 + _len(s)*2/3}em`;
      let _num = s => s && Number(s);
      let _unprefix = (s, p) => (!p || !s.startsWith(p+": ") ? s : s.slice(p.length+2));
      let _style = (color, background="rgba(0,0,0,.5)") => ({background, color: COLORS[color]||'white'});
      let $setHidden = (x=true) => () => {rf.disp(['set', {hidden: x}])};
      let $setView = x => () => {rf.disp(['set', {view: x, focus: null}]);  (x === 'build') && $toggle.syncBuilds()};
      let setFocus = (focus=null) => {rf.dispatchSync(['set-focus', focus])};
      let setAmount = (name, value) => rf.dispatchSync([(value == '0' ? 'unset-amount' : 'set-amount'), name, _num(value)]);
      let $setCost = (name, key) => function () {rf.dispatchSync([(this.value == '0' ? 'unset-cost' : 'set-cost'), name, key, _num(this.value)])};
      let setGroup = name => rf.dispatchSync(['set', {group: name||null}]);
      let toggleExtras = () => {rf.disp(['set', {extras: !rf.dsub(['extras'])}])};
      let setRoll = (n, m, k) => {rf.dispatchSync(['set-roll', ...[n, m, k].map(_num)])}
      let overrideKeyboard = ({dom}) => {dom.onkeyup = dom.onkeydown = dom.onkeypress = function (e) {$toggle.onpress(e);  e.stopPropagation()}};

      let [TextInput, NumberInput, Checkbox] = ["", "[type=number]", "[type=checkbox]"].map(s =>
        (color, attrs, redraw=false) => [`input${s}`, merge(attrs, {oncreate: overrideKeyboard}, color && {style: merge(_style(color), attrs.style)})]);
      let TextArea = (attrs, redraw=false) => ['textarea', merge(attrs, {oncreate: overrideKeyboard}), attrs.value];

      let Header = () => [`.${$}-header`, [Checkbox, '', {title: "Pin", checked: rf.dsub(['pin']), onchange () {rf.disp(['set', {pin: this.checked}])}}], ...({
        points:  [['button', {onclick: $setView('choices')}, "Choices"],
                  [`.${$}-row`, ['b', "Points"], ['button', {title: "Build", onclick: $setView('build')}, rf.dsub(['build']) || ['i', "<unnamed>"]]]],
        choices: [['button', {onclick: $setView('points')}, "Points"],
                  rf.dsub(['edit']) && ['button', {title: "Extra controls", onclick: toggleExtras}, (rf.dsub(['extras']) ? "˄" : "˅")],
                  [`.${$}-row`, ...rf.dsub(['points*']).map(([key, initial, color]) =>
                                  ['b', {key, title: key, style: _style(color, '')}, _delta(initial+rf.dsub(['total', key]), '')])]],
        build:   [['button', {onclick: $setView('points')}, "Points"],
                  [`.${$}-row`, ['b', `Build [${rf.dsub(['#selected'])}/${rf.dsub(['#choices'])} choices]`]],
                  ['button', {title: `${rf.dsub(['syncUrl']) ? "Unsync" : "Sync"} URL hash with state`, onclick: () => rf.disp(['sync-url'])},
                    (rf.dsub(['syncUrl']) ? "Unhash" : "Hash")]],
      }[ rf.dsub(['view']) ] || []), ['button', {title: "Collapse", onclick: $setHidden()}, "˃"]];

      let ColorSelector = (kind, name, value='white') =>
        ['select', {value, style: _style(value, 'black'), onchange () {rf.dispatchSync([`set-${kind}-color`, name, this.value])}},
          ...keys(COLORS).map(s => ['option', {style: _style(s, 'black')}, s])];  // in Firefox: enable dom.forms.select.customstyling (in about:config)
      let PointDetails = (name, value, color='white') => [`.${$}-row`, {name}, ['button', {onclick: () => setFocus()}, '×'],
        [TextInput, color, {title: "Name", value: name, size: _len(name), onchange () {setTimeout(() => rf.dispatch(['rename-point', name, _trim(this.value)]), 10)}}],
        [NumberInput, color, {title: "Initial", value, style: {width: _lenEm(value)}, onchange () {rf.dispatch(['set-initial', name, _num(this.value)])}}, true],
        [ColorSelector, 'point', name, color],
        ['button', {onclick: () => rf.disp(['delete-point', name])}, "delete"]];

      let ChoiceView = (name, amount, color='white', elt=`.${$}-row`, prefix="") =>
        [elt, {name, title: rf.dsub(['choice-tooltip', name]), style: {..._style(color, ''), opacity: (amount > 0 ? 1 : .5)}},
           (amount > 0 ? ['b', _unprefix(name, prefix)] : ['del', ['i', _unprefix(name, prefix)]]), (amount > 1) && ` [×${amount}]`];
      let ChoiceDetails = (name, amount, color='white', cost={}) => [`.${$}-rows`, {name},
        [`.${$}-row`, ['button', {onclick: () => rf.disp(['delete-choice', name])}, "delete"],
                      [TextInput, color, {class: `${$}-wide`, value: name, onchange () {setTimeout(() => rf.dispatch(['rename-choice', name, this.value]), 10)}}],
                      [ColorSelector, 'choice', name, color],
                      ['button', {onclick: () => setFocus()}, '×']],
        ...rf.dsub(['points*']).map(([key, _, color='white']) =>
          [`.${$}-row`, {style: _style(color, '')}, key,
                        [NumberInput, color, {value: cost[key]||0, style: {width: _lenEm(cost[key]||0)}, onchange: $setCost(name, key)}, true]])];
      let ChoicesList = () => ['<>', ...rf.dsub(['choice-names*']).map(k => rf.dsub(['choice*', k])).map(({name, amount, color='white', cost}) => r.with({key: name},
        (!rf.dsub(['edit'])         ? [ChoiceView, name, amount, color] :
         rf.dsub(['focus']) == name ? [ChoiceDetails, name, amount, color, cost||{}] :
         [`.${$}-row`, (amount > 1 ? [NumberInput, color, {name, min: 0, value: amount, style: {width: _lenEm(amount)}, onchange () {setAmount(name, this.value)}}, true] :
                        ['<>', [Checkbox, color, {checked: amount > 0, onchange () {setAmount(name, (this.checked ? 1 : 0))}}],
                               (amount > 0) && ['button', {onclick: () => setAmount(name, 2)}, "˄"]]),
                       [`.${$}-row.${$}-clickable`, {name, title: rf.dsub(['choice-tooltip', name]), style: _style(color, ''),
                                                     onclick: () => setAmount(name, (amount > 0 ? 0 : 1))}, name],
                       ['button', {onclick: () => setFocus(name)}, "edit"]])))];
      let _ChoiceView = (prefix="", elt, key=true) => ({name, amount, color}) => r.with(key && {key: name}, [ChoiceView, name, amount, color, elt, prefix]);
      let _choiceGroup = ks => ks.map(k => rf.dsub(['choice*', k]));
      let ChoiceGroups = ({lists}) => ['<>', ...rf.dsub(['choice-groups']).map(([group, ks], i) => r.with({key: group||i},
        (!group ? [`.${$}-rows`, ..._choiceGroup(ks).map(_ChoiceView())] :
         !lists ? ['p', group, ": ", ['<>', ..._choiceGroup(ks).map((x, i) => r.with({key: x.name}, ['<>', (i>0) && ", ", _ChoiceView(group, 'span', false)(x)]))], "."] :
         [`.${$}-rows`, ['p', group, ":"], ['ul', ..._choiceGroup(ks).map(_ChoiceView(group, 'li'))]])))];

      let Body = () => ['<>', ...({
        points:  [[`.${$}-rows`, ...rf.dsub(['points*']).map(([name, value, color]) => r.with({key: name},
                    (rf.dsub(['focus']) == name ? ['<>', [PointDetails, name, value, color]] :
                     [`.${$}-row.${$}-clickable`, {name, style: _style(color, ''), onclick: () => setFocus(name)},
                        name, ": ", _delta(value+rf.dsub(['total', name]), ''), "/", _delta(value, '')])))],
                  [`.${$}-row`, [`button.${$}-wide`, {title: "Add", onclick: () => rf.disp(['new-point'])}, "+"]]],
        choices: [[`.${$}-rows.${$}-noshrink`, {style: (!rf.dsub(['extras']) || !rf.dsub(['edit'])) && {display: 'none'}},
                    (([n, m, k, r] = rf.dsub(['roll'])) =>
                       [`.${$}-row`, [NumberInput, '', {value: n, style: {width: _lenEm(n)}, min: 1, onchange () {setRoll(this.value, m, k)}}, true], 'd',
                                     [NumberInput, '', {value: m, style: {width: _lenEm(m)}, min: 2, onchange () {setRoll(n, this.value, k)}}, true], '+',
                                     [NumberInput, '', {value: k, style: {width: _lenEm(k)}, onchange () {setRoll(n, m, this.value)}}, true],
                                     ['button', {title: rf.dsub(['roll-tooltip']), onclick: () => rf.disp(['roll!'])}, "roll ", ['b', `${n}d${m}${!k ? '' : _delta(k)}`]],
                                     (r != null) && ['<>', ['b', ` = ${_delta(r, '')}`], ['button', {onclick: () => setRoll(n, m, k)}, '×']]])(),
                    [`.${$}-row`, [TextArea, {class: `${$}-wide`, title: "Comment", placeholder: "Comment", rows: 6,
                                              value: rf.dsub(['comment']), onchange () {rf.dispatch(['set-comment', this.value])}}]]],
                  rf.dsub(['edit']) &&
                    [TextInput, 'white', {class: `${$}-wide`, title: "Search", placeholder: "Search", value: rf.dsub(['search']), oninput () {rf.disp(['set', {search: this.value}])}}],
                  [`.${$}-rows`, ((s = !rf.dsub(['edit']) && rf.dsub(['group'])) => (!s ? [ChoicesList] : [ChoiceGroups, {lists: s == 'groups'}]))(),
                                 !rf.dsub(['edit']) && [`p.${$}-comment`, ['em', rf.dsub(['comment'])]]],
                  [`.${$}-row`, [Checkbox, '', {title: "Show selected", checked: rf.dsub(['filter']), onchange () {rf.disp(['set', {filter: this.checked}])}}],
                                (rf.dsub(['edit']) ? [`button.${$}-wide`, {title: "Add", onclick: () => rf.disp(['new-choice'])}, "+"] :
                                 [`select.${$}-wide`, {title: "Grouping", style: _style(), value: rf.dsub(['group'])||"", onchange () {setGroup(this.value)}},
                                   ...entries(GROUPING).map(([k, s]) => ['option', {value: s}, k])]),
                                [Checkbox, '', {title: "Read only", checked: !rf.dsub(['edit']), onchange () {rf.disp(['set', {edit: !this.checked}])}}]]],
        build:   [((k=rf.dsub(['build']), x=rf.dsub(['build-exists?'])) => [`.${$}-row`, {style: {background: 'grey'}},
                     (!x ? ['<>', ['button', {onclick: () => rf.dispatchSync(['import'])}, "Import"],
                                  [`button.${$}-row`, {onclick: () => rf.disp(['save'])}, "Save (in storage)"]]
                         : ['<>', ['button', {onclick: () => rf.dispatchSync(['export', k])}, "Export"],
                                  [`.${$}-row.${$}-clickable`, {title: "Rename", onclick: () => rf.disp(['save'])}, k],
                                  ['button', {onclick: () => rf.disp(['delete', k])}, "Delete"]])])(),
                  [`.${$}-rows`, ...rf.dsub(['builds*']).map(k => (k != rf.dsub(['build'])) && [`.${$}-row`,
                    ['button', {onclick: () => rf.dispatchSync(['export', k])}, "Export"],
                    (rf.dsub(['build-exists?']) ? [`.${$}-row`, {title: ""}, k] : [`.${$}-row.${$}-clickable`, {title: "Load", onclick: () => rf.disp(['load', k])}, k]),
                    ['button', {onclick: () => rf.disp(['delete', k])}, "Delete"]])]],
      }[ rf.dsub(['view']) ] || [])];

      let Overlay = () =>
        [`.${$}`, {class: [rf.dsub(['pin']) && `${$}-pin`]},
                  (!rf.dsub(['hidden']) ? ['<>', [Header], [Body]] : ['button', {title: "Expand", onclick: $setHidden(false)}, "˂"])];

      rf.dispatchSync(['init-db']);
      try {rf.disp(['import-hash', JSON.parse(LZString.decompressFromBase64( location.hash.slice(1) ))])} catch (e) {}
      r.render([Overlay], $toggle.overlay);
    }
  });

  if (HOST == GITLAB) {
    let VREGEX = RegExp("(?<=^/cyoa-viewer/v).(?=\.html$)");
    let v = location.pathname.match(VREGEX)?.[0],  _v = (v == '1' ? '2' : '1');
    GM_registerMenuCommand("Switch to v"+_v, () => {location.pathname = location.pathname.replace(VREGEX, _v)});
    (location.search.length > 1) && GM_registerMenuCommand("Open in URL Builder", () => {
      let title = encodeURIComponent(document.title.replace(/( \| )?CYOA Viewer$/, ""));
      GM_openInTab(`https://${GITLAB}/cyoa-viewer/${location.search}&title=${title}`, {active: true, insert: true, setParent: true});
    });
  }

  if (HOST == IMGUR)
    (([_, id] = URI.match("^/(?:a|gallery)/([0-9A-Za-z]+)")||[]) => id && GM_registerMenuCommand("Open in Cubari", () => GM_openInTab(`https://${CUBARI}/read/imgur/${id}/1`)))();
  else if (HOST == IMAGECHEST)
    (([_, id] = URI.match("^/p/([0-9a-z]+)")||[]) => id && GM_registerMenuCommand("Open in Cubari", () => GM_openInTab(`https://${CUBARI}/read/imgchest/${id}/1`)))();
  else if (HOST == CUBARI)
    (([_, site, id] = URI.match("^/read/(imgur|imgchest)/([0-9A-Za-z]+)")||[]) => id &&
       GM_registerMenuCommand("Open in "+(site == 'imgur' ? "Imgur" : "ImageChest"), () => GM_openInTab(`https://${site}.com/${site == 'imgur' ? 'a' : 'p'}/${id}`)))();

  if ((HOST == FUNNYJUNK) && (document.querySelectorAll(".cImg").length != 1)) return; // not a gallery

  let slider, ticks, html = document.documentElement, pages = [], showPage = e => e?.scrollIntoView(), setPages = xs => {
    pages = Array.from(xs);
    (HOST == IMGUR)      && _imgurShowPage();
    (HOST == IMAGECHEST) && pages.forEach((e, i) => Object.assign(e, {idx: i+1, _container: e.parentNode.offsetParent}));
    (HOST == FUNNYJUNK)  && pages.forEach((e, i) => {Object.assign(e, {idx: i+1, url: e.parentNode.parentNode.href, _container: e.parentNode.offsetParent});
                                                     e.parentNode.style=""});
    slider.max = pages.length;
    ticks.innerHTML = "";
    pages.forEach((x, i) => ticks.append(Object.assign(document.createElement('option'), {value: i+1, label: i+1, title: x.name||`Page ${i+1}`, onclick: () => slider.selectPage(i+1)})));
    slider.style.height = ticks.style.height = `calc(${slider.max} * 1.2rem - 0.2rem)`;
    slider._top = 0;
    setTimeout(() => ticks.setMore(document.querySelector("button.loadMore, .container > .grid > :nth-child(2) > :last-child button[type=submit]")));
    return xs;
  }, _imgurShowPage = () => {
    try {
      document.querySelector(".btn-wall--yes")?.click();
      let pad = document.querySelector(".Gallery-Content--mediaContainer").parentNode.firstChild, height = o => o.height * Math.min(pad.offsetWidth, o.width) / o.width;
      showPage = (page, e = document.querySelector(`img[src="${page.url}"]`)) =>
        (e ? e.scrollIntoView() : html.scroll({top: pages.slice(0, pages.indexOf(page)).reduce((n, o) => n + height(o) + 24, pad.offsetTop)}));
      setTimeout(() => ticks.setMore(document.querySelector("button:is(.loadMore)")));
    } catch (e) {setTimeout(_imgurShowPage, 100)}
  };

  if ([IMGUR, IMAGECHEST, FUNNYJUNK].includes(HOST)) { // CYOA mode toggler
    const INITIAL = {[IMGUR]: 15}[HOST];
    let $ = '-cyoamode', $$ = '-cyoapager';
    console.warn($);
    GM_addStyle(`button.${$} {position:fixed; top:5em; left:1ex; z-index:1000; writing-mode:sideways-lr; padding:1px}  button.${$} span {writing-mode:vertical-lr; transform:rotate(180deg)}`);
    GM_addStyle({
      [IMGUR]:      `.${$} .NewCover, .${$} .Gallery-Sidebar, .${$} .Gallery-EngagementBar, .${$} .BottomRecirc, .${$} .Footer, .${$} .Navigation-next,
                     .${$} .Gallery-Content--ad {display: none !important}   .${$} .Gallery {max-width: 100% !important;  width: initial !important}`,
      [IMAGECHEST]: `.${$} :is(header, .container + .sticky) {position: static}   .${$} .container > .grid > :not(:nth-child(2)) {display: none}
                     .${$} .container {max-width: calc(100vw - 5rem);  margin-right: 3rem}   .${$} .container > .grid {display: block}`,
      [FUNNYJUNK]:  `#contentRight:not(.collapsed) button.${$} {left: calc(310px + 1em)}   button.${$} {top: calc(78px + 6em);  left: 1em}
                     .${$} header, .${$} .channels_bar, .${$} #columnLeftSeparator, .${$} #comms, .${$} #bottt,
                       .${$} #vvl, .${$} #vvr, .${$} #bottomNav, .${$} #tapContent, .${$} #blockD {display: none}
                     .${$} .mediaContainer, .${$} .contentContainer {max-width: none !important}   .${$} img {width: auto !important;  max-width: 100%}`,
    }[HOST]);
    let _toggle = {
      [FUNNYJUNK]: on => {/* blocking shortcuts   */ setTimeout(() => {document.locationAlreadyChanged = on}, 1000);
                          /* toggling left panel  */ (!on == mz.classList.contains('collapsed')) && doLeftCol();
                          /* loading large images */ on && setTimeout(() => pages.forEach(e => Object.assign(e, {src: e.url, loaded: true})))},
      [IMGUR]:     on => (!on ? _toggle.observer?.disconnect() : setTimeout((gallery = document.querySelector(`.Gallery-ContentWrapper`)) => {
                            let fixSrc = e => e.querySelectorAll(`img:not(.image-placeholder)`).forEach(e => {e.src = e.src?.replace(/_d(\.[a-z]{3,4}(\?.*)?)$/i, "$1")});
                            (_toggle.observer = new MutationObserver(xs => xs.forEach(x => x.addedNodes.forEach(fixSrc)))).observe(gallery, {childList: true, subtree: true});
                            fixSrc(gallery); // fixing image URLs; smh this in necessary in Chrome on some galleries?
                          }, 1000)),
    }[HOST] || (() => {});
    let toggle = (on = !localStorage.getItem($)) => {_toggle(on);
                                                     document.body.classList[on ? 'add' : 'remove']($);
                                                     window.dispatchEvent(new Event('resize'));
                                                     localStorage[on ? 'setItem' : 'removeItem']($, "on");
                                                     slider._top = 0};
    console.warn($$);
    GM_addStyle(`.${$} .${$$} {position: fixed;  top: 5em;  right: 3.25ex;  transform: translate(50%);  text-align: center;  z-index: 1000;  display: block}
                 .${$$} {display: none;  max-height: calc(100% - 6em);  overflow-y: auto;  overflow-x: hidden;  scrollbar-width:none}   .${$$}::-webkit-scrollbar {display: none}
                 .${$$} .selector {display: flex}   .${$$} button {margin-top: 1ex;  padding: 0 .25ex}   .${$$}:not(.more) button {display: none}
                 .${$$} input {writing-mode: bt-lr;  appearance: slider-vertical;  rotate: 180deg;  width: 1.5em;  margin-top: 0}   .${$$} input:out-of-range {display: none}
                 .${$$} datalist {display: flex;  flex-direction: column;  justify-content: space-between;  width: 1.5em}
                 .${$$} option {padding: 0;  font-weight: bold}   .${$$} option:not(.active) {opacity: 0.5}   .${$$} option:hover {opacity: 0.8;  cursor: pointer}`);
    GM_addStyle({
      [IMGUR]:      `.${$$} datalist {margin-top: 0.1rem}`,
      [IMAGECHEST]: `button.${$}, .${$} .${$$} button {background: var(--f-button-bg);  color: var(--f-button-color);  border-radius: .375rem}
                     button.${$} {padding: .375rem 0}   .${$} .${$$} button {padding: 0 .375rem}   .${$$} input {margin-top: 0.1rem}`,
      [FUNNYJUNK]: `${$} .${$$} {font-size: larger;  top: 10em;  right: 6.5ex;  max-height: calc(100% - 11em)}`,
    }[HOST]);
    unsafeWindow.chrome && GM_addStyle({[IMGUR]: `.${$} .${$$} {font-size: 15px}`,
                                        [IMAGECHEST]: `.${$} .container {margin-right: 2.25rem}   .${$} .${$$} {right: 2.5ex}   .${$$} input {width: 1em}`}[HOST]);
    let [more, selector, pager] = ['button', 'div', 'div'].map(s => document.createElement(s));
    let _redraw = () => Array.from(ticks.children).forEach(e => e.classList[e.value == slider.value ? 'add' : 'remove']('active'));
    let visible = img => ((pos = html.scrollTop, top = (img._container||img.offsetParent).offsetTop) => (top < pos + html.clientHeight) && (top + img.offsetHeight > pos))();
    slider = Object.assign(document.createElement('input'), {type: 'range', min: 1, max: 0, _top: 0}, {
      oninput: () => {_redraw();  showPage(pages[slider.value-1])},
      selectPage: n => {slider.value = n;  slider.oninput()},
      title: (HOST != IMGUR ? "" : "On Imgur: before using, SCROLL THROUGH ALL PAGES (i.e. drag the slider from first to last tick one-by-one, or just hold down PgDown)\n" +
                                   "For any page that Imgur HASN'T LOADED YET, Imgur WILL mess up positioning of ALL THE SUBSEQUENT PAGES"),
    });
    setInterval(() => {
      if ((pages.length < 2) || (Math.abs(html.scrollTop - slider._top) < 10)) return;
      let images = Array.from(document.querySelectorAll(".file-container a, .Gallery-Content img:not(.image-placeholder), .contentContainer img")).filter(visible);
      let img = images[slider._top > html.scrollTop ? 0 : images.length-1], value = img?.idx || pages.findIndex(o => img?.src.startsWith(o.url?.replace(/\.[a-z]{3,4}$/i, "")))+1;
      value && (Object.assign(slider, {value, _top: html.scrollTop}), _redraw());
    }, 500);
    slider.setAttribute('orient', 'vertical');  // Firefox
    ticks = Object.assign(document.createElement('datalist'), {}, {
      setMore: btn => {
        pager.classList[btn ? 'add' : 'remove']('more');
        btn && btn.addEventListener('click', () => {
          more.innerText = "…";
          setTimeout(() => setPages(HOST == IMGUR ? pages : document.querySelectorAll(".file-container a")), 2500);
        });
        btn && Object.assign(more, {onclick: () => btn.click(), title: btn.innerText, innerText: "+" + (btn.innerText.match(/^Load ([0-9]+)/i)?.[1] || "")});
        INITIAL && (slider.max = (!btn ? pages.length : Math.min(slider.max, INITIAL)), ticks.children.forEach((e, i) => (i >= INITIAL) && (e.style.display = (!btn ? '' : 'none'))));
        INITIAL && (slider.style.height = ticks.style.height = `calc(${slider.max} * 1.2rem - 0.2rem)`);
      },
    });
    slider.style.height = ticks.style.height = 0;
    [ticks, slider].forEach(e => selector.append(e));   Object.assign(selector, {className: "selector"});
    [selector, more].forEach(e => pager.append(e));     Object.assign(pager, {className: $$});
    let container = (HOST == FUNNYJUNK ? contentRight : document.body);
    container.append(Object.assign(document.createElement('button'), {innerHTML: (navigator.vendor ? "<span>CYOA</span>" : "CYOA"), className: $, onclick () {toggle()}}));
    container.append(pager);
    addEventListener('keydown', e => ['ArrowLeft', 'ArrowRight'].includes(e.key) && localStorage.getItem($) && e.stopImmediatePropagation());
    toggle(localStorage.getItem($));
  }

  if ([IMGUR, IMAGECHEST, CUBARI, IMGBB, FUNNYJUNK].includes(HOST) || HOST.match(REDDIT) || ['jpg', 'jpeg', 'png', 'webp'].some(s => URI.endsWith(`.${s}`))) { // "Open in Viewer"
    let {dict, keys} = require('mreframe/util'), array = Array.from, find = sel => document.querySelector(sel), findAll = sel => array(document.querySelectorAll(sel));
    let titlePrompt = () => prompt("CYOA name:", document.title)||"",   title = () => document.title || titlePrompt();
    let commonPrefix = (s="", z="", ...ss) => {
      if (ss.length > 0)
        return commonPrefix(commonPrefix(s, z), ...ss);
      s = `${s}`, z = `${z}`;
      let l = 0, r = 1 + Math.min(s.length, z.length);
      while (l+1 < r) {let m = Math.floor((l+r) / 2);
                       if (s.startsWith( z.slice(0, m) )) l = m; else r = m}
      return s.slice(0, l);
    }
    let urlsToViewerUri = (urls, hash) => {let p = commonPrefix(...urls), o = new URLSearchParams();
                                           p && o.set('prefix', p);
                                           urls.map(s => s.slice(p.length)).forEach(s => o.append('url', s));
                                           return `${Object.assign(new URL("https://"+GITLAB+"/cyoa-viewer/v1.html?"+o), {hash})}`};

    const LOAD_FAILED = "Failed to collect URLs, try reloading the page.";
    let urls = null, _load = () => {}, load = () => Promise.resolve(urls || _load()).then(xs => (urls = xs)?.length > 0 ? Promise.resolve(urls) : Promise.reject(LOAD_FAILED));

    if (HOST == IMGUR) {
      try {urls = setPages(JSON.parse(postDataJSON).media).map(x => x.url)} catch (e) {}
      let _fetch = unsafeWindow.fetch;
      let spy = (x, getUrls) => {let _json = x.json;
                                 return Object.assign(x, {json: () => _json.call(x).then(o => {try {urls = urls || getUrls(o)} catch (e) {console.error(e)};   return o})})}
      title = () => (find(".Gallery-Title h1")||{}).innerText;
      unsafeWindow.fetch = (url, ...args) => _fetch(url, ...args).then(x => (!url.match("^https://api.imgur.com/post/v1/(albums|media)/") ? x : spy(x, o => setPages(o.media).map(y => y.url))));
    } else if (HOST == IMAGECHEST) {
      title = () => (find(".container > .grid > :nth-child(2) > :last-child h2")||{}).innerText;
      let _ready = new Promise(resolve => new MutationObserver((xs, o) => xs.forEach(x => x.addedNodes.forEach(e => e.tagName == 'MAIN' && (resolve(), o.disconnect()))))
            .observe(app, {childList: true}));
      _ready.then(() => setPages(findAll(".file-container a[data-fancybox]")));
      _load = () => new Promise(resolve => {
        let btn = find(".container > .grid > :nth-child(2) > :last-child button[type=submit]");
        (!btn ? resolve(setPages(findAll(".file-container a[data-fancybox]")).map(e => e.href)) :
         (btn.click(), new MutationObserver(xs => xs.forEach(x => x.removedNodes.forEach(e => (e == btn) && resolve(_load())))).observe(btn.parentNode, {childList: true})));
      });
    } else if (HOST == CUBARI) {
      title = () => document.title.replace(/ \| Chapter [0-9]+ \| Cubari$/, "");
      _load = () => fetch(`https://${HOST}${BASE_API_PATH}${URI.match(`^/read/.*?/(.*?)/.*`)[1]}`).then(x => x.json())
                      .then(o => o.chapters[1].groups[1].map(x => Object.assign(x.src||x, {name: x.description})));
    } else if (`${location}`.match(`^https://${IMGBB}/album/`)) {
      title = () => (find("a[data-text=album-name]")||{}).innerText;
      _load = () => {let o = dict(findAll("#content-listing-tabs .list-item").map(e => JSON.parse(decodeURIComponent(e.getAttribute('data-object')))).map(o => [o.name, o.url]));
                     return keys(o).sort().map(k => o[k])};
    } else if (HOST == IMGBB) {
      title = () => (find("h1.viewer-title")||{}).innerText;
      _load = () => findAll("#image-viewer img").map(e => e.src);
    } else if (HOST == FUNNYJUNK) {
      setPages(findAll(".contentContainer img"));
      _load = () => pages.map(e => e.url);
    } else if (HOST.match(REDDIT)) {
      title = () => (find("[data-test-id=post-content] h1, [view-context=CommentsPage] [slot=title], .top-matter a.title") ||
                     find('post-bottom-bar')?.shadowRoot?.querySelector("[data-testid=post-title]") || {}).innerText;
      _load = () => findAll("[data-test-id=post-content] figure a, [view-context=CommentsPage] img[role=presentation], .gallery-tile img.preview, " +
                            "[data-test-id=post-content] .ImageBox-image, .media-preview > .media-preview-content img.preview, zoomable-img > img")
                      .map(e => `https://i.redd.it${new URL(e.src||e.href).pathname.replace(/(?<=^\/).*-/, "")}`);
    } else [urls, title] = [[`${location}`], () => ""]
    GM_registerMenuCommand("Open in Viewer", () => load().then(urls => GM_openInTab(urlsToViewerUri(urls, title()||titlePrompt()), {active: true, insert: true, setParent: true}))
                                                         .catch(e => alert(e)));
  }
})();
