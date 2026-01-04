// ==UserScript==
// @name         Json edit
// @namespace    https://agregen.gitlab.io/
// @version      0.0.1
// @description  JSON editor dialog (intended as a library for userscripts)
// @author       agreg
// @license      MIT
// @match        http://localhost:*
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.27.0/prism.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.27.0/components/prism-json.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.27.0/plugins/match-braces/prism-match-braces.min.js
// ==/UserScript==

var Prism, $jsonEdit = (() => {
  const [TAB, NEWLINE, AMPERSAND, LESS_THAN, NONBREAKING_SPACE] = ['\t', '\n', "&amp;", "&lt;", "&nbsp;"];
  let {isArray} = Array,  isColl = x => x && (typeof x === 'object'); // ignoring non-JSON types
  let spaces = n => Array.from({length: n}, _ => " ").join("");
  let compactItems = (items, {width, indent}) => items.slice(1).reduce((ss, s) => {
    (ss[0].length + 2 + s.length > width ? ss.unshift(s) : (ss[0] += ", " + s));
    return ss;
  }, [items[0]]).reverse().join(`,\n${indent}`);

  let pformat = (x, {indent="", width=80, sparse=false, compact=false}={}) => {
    if (!isColl(x))
      return JSON.stringify(x);
    let [bLeft, bRight] = (isArray(x) ? ["[", "]"] : ["{", "}"]);
    let _indent = isArray(x) ? (k => spaces(sparse ? 0 : 1)) : (k => spaces(sparse ? 2 : 3+k.length));
    let kvs = Object.entries(x).map(([k, v]) => [JSON.stringify(!isArray(x) ? k : Number(k)), v]);
    let items = kvs.map(([k, v]) => [k, pformat(v, {width, sparse, compact, indent: indent+_indent(k)})])
                   .map(([k, v]) => (isArray(x) ? v : `${k}: ${v}`));
    let len = indent.length + items.map(s => 2+s.length).reduce((a, b) => a+b, 0);
    let flat = !items.some(s => s.includes(NEWLINE));
    let _wrap = (s, wrap=s.includes(NEWLINE) && !(isArray(x) && !flat)) => !wrap ? s : `\n${indent}  ${s}\n${indent}`;
    let _compact = (sep, {_sparse=sparse, _indent=indent+" ", _width=width-_indent.length+1}={}) =>
      (_sparse   ? _wrap(_compact(sep, {_sparse: false, _width: _width-2, _indent: (flat ? _indent+" " : indent)})) :
       !compact || !flat ? items.join((sparse && !flat) || (flat && (len <= width)) ? ", " : sep) :
       compactItems(items, {width: _width, indent: _indent}));
    return bLeft + (flat && (items.length < 2) ? items[0] || "" :
                    !sparse                    ? _compact(`,\n ${indent}`) :
                    isArray(x)                 ? _compact(`,\n  ${indent}`) :
                    _wrap(items.join(`,\n  ${indent}`), true)) + bRight;
  };

  class ParseError extends Error {
    constructor(msg, {position, ...options}) {super(msg, options);  this.position = Number(position)}
  }

  let _humanize = s => JSON.stringify( `${s||""}`.replace(/^[a-z]/, c => c.toUpperCase()) ).slice(1, -1);
  let parseJson = s => {
    try {
      return JSON.parse(s);
    } catch (e) {
      let match, _msg = s => _humanize( `${s||""}`.replaceAll(TAB, "\tab").replaceAll(NEWLINE, "\newline") ); // [sic]
      if (match = e.message.match(/^([^]*) in JSON at position ([0-9]+)$|^(Unexpected end of JSON input)$/)) {
        let [_, msg, pos, altMsg] = match;
        return new ParseError(_msg(msg||altMsg), {cause: e, position: pos||s.length});
      } else if (match = e.message.match(/^JSON\.parse: ([^]*) at line ([0-9]+) column ([0-9]+) of the JSON data$/)) {
        let [_, msg, row, col] = match;
        return new ParseError(_msg(msg), {cause: e, position: Number(col) + (row == 1 ? -1 : s.split('\n').slice(0, row-1).join('\n').length)});
      } else {
        console.warn(e);
        return new ParseError(_msg(e.message), {cause: e, position: 0});
      }
    }
  };

  let captureTab = editor => event => {
    if (event.key == "Tab") {
      event.preventDefault();
      let before = editor.value.slice(0, editor.selectionStart);
      let after = editor.value.slice(editor.selectionEnd, editor.value.length);
      let pos = editor.selectionEnd + 1;
      editor.value = before + TAB + after;
      editor.selectionStart = editor.selectionEnd = pos;
      update(editor.value);
    }
  }

  let $e = (tag, attrs, ...children) => {
    let e = Object.assign(document.createElement(tag), attrs);
    children.forEach(child => e.append(typeof child != 'string' ? child : document.createTextNode(child)));
    return e;
  };

  let theme = selector => `${selector} pre {color:white; background:black}
                           ${selector} .token.string {color:slateblue}
                           ${selector} .token.property {color:orange}
                           ${selector} .token.number {color:green}
                           ${selector} .token:is(.boolean, .null) {color:deeppink}
                           ${selector} .token.operator {color:yellowgreen}
                           ${selector} .token.punctuation {color:grey}
                           ${selector} .token:is(.brace-level-2, .brace-level-6, .brace-level-10) {color:#388}
                           ${selector} .token:is(.brace-level-3, .brace-level-7, .brace-level-11) {color:#838}
                           ${selector} .token:is(.brace-level-4, .brace-level-8, .brace-level-12) {color:#883}`;

  let createEditorModal = (id, {maxWidth='90%'}={}) => {
    const ID = '#'+id;
    let style = $e('style', {},
      `${ID} {position:fixed; height:calc(90vh - 2em); top:5vh; width:calc(90vw - 2em);
              max-width:${maxWidth}; left:0; right:0; margin:0 auto; z-index:1000}
       ${ID}, ${ID} .window {display:flex; flex-direction:column}
       ${ID} .title {padding:0 1em; background:lightgrey; font-weight:bold; font-size:larger}
       ${ID} .window {position: relative; padding:1em; padding-top:0; background:grey}
       ${ID} :is(.title, .window > *) {flex:0}   ${ID} :is(.window, .editor) {flex-grow:1}
       ${ID} .editor {position:relative; height:calc(100% - 6em)}
       ${ID} .editor > * {position:absolute; top:0; left:0; width:calc(100% - 6px); height:100%; overflow:auto; margin:0}
       ${ID} .editor :is(textarea, pre) {font-family:monospace; font-size:15pt; line-height:20pt;
                                         border-radius:5px; white-space:pre; hyphens:none}
       ${ID}.text .editor :is(textarea, pre) {white-space:pre-wrap; word-wrap:break-word}
       ${ID} .editor textarea {resize:none; z-index:2; background:transparent; color:transparent; caret-color:white}
       ${ID} .editor pre {z-index:1; margin:0; overflow:auto; padding:3px}
       @-moz-document url-prefix() {${ID} .editor pre {padding:4px}}

       ${theme(ID)}

       ${ID} :is(.toolbar, .buttons) {margin-top:1em; display:flex; justify-content:space-evenly}
       ${ID} .toolbar input[type=number] {width:4em; background:white}
       ${ID} .error {color:yellow; font-weight:bold; font-family:monospace}`);
    setTimeout(() => document.head.append(style));

    let modal, title, error, editor, overlay, content, toolbar, sparse, compact, width, redraw, cancel, ok;
    modal = $e('div', {id, className: 'modal', style: "display:none", mode: 'json'},
               title = $e('div', {className: 'title'}, ""),
               $e('div', {className: 'window'},
                  $e('div', {className: 'error', innerHTML: "&ZeroWidthSpace;"}, error = $e('span')),
                  $e('div', {className: 'editor'},
                     editor = $e('textarea'),
                     overlay = $e('pre', {}, content = $e('code', {className: "highlighting language-json match-braces"}))),
                  toolbar = $e('div', {className: 'toolbar'},
                               $e('label', {title: "Don't inline dicts"},
                                  sparse = $e('input', {type: 'checkbox', className: 'sparse'}),
                                  " Sparse"),
                               $e('label', {title: "Compact long lists"},
                                  compact = $e('input', {type: 'checkbox', className: 'compact'}),
                                  " Compact"),
                               $e('label', {title: "Width limit (0 = unlimited)"},
                                  "Width ",
                                  width = $e('input', {type: 'number', className: 'width', value: 100, min: 0})),
                               redraw = $e('button', {className: 'redraw'}, "Check / Reformat")),
                  $e('div', {className: 'buttons'},
                     cancel = $e('button', {className: 'cancel'}, "Cancel"),
                     ok     = $e('button', {className: 'ok'},     "OK"))));

    let _isValid, _width = Number(width.value)||Infinity;

    let render = (e, text, mode=modal.mode) => {
      e.innerHTML = text.replace(/&/g, AMPERSAND).replace(/</g, LESS_THAN); // can't use innerText here
      (mode === 'json') && Prism && Prism.highlightElement(e);
    };

    let update = text => render(content, text + (text.slice(-1) != NEWLINE ? "" : " "));
    let syncScroll = () => {[overlay.scrollTop, overlay.scrollLeft] = [editor.scrollTop, editor.scrollLeft]};

    let detectWidth = () => {
      let style = "font-family:monospace; font-size:15pt; line-height:20pt; position:fixed; top:0; left:0";
      let e = $e('span', {style, innerHTML: NONBREAKING_SPACE});
      modal.append(e);
      width.value = _width = Math.floor(editor.clientWidth / e.clientWidth);
      e.remove();
    };

    let reformat = (s = editor.value,  o = parseJson(s)) => {
      if (o instanceof Error) {
        error.innerText = o.message || "Syntax error";
        console.warn(o, {position: o.position});
        editor.focus();
        editor.selectionStart = editor.selectionEnd = o.position||0;
      } else {
        error.innerText = "";
        editor.value = pformat(o, {sparse: sparse.checked, compact: compact.checked, width: _width});
        editor.selectionStart = editor.selectionEnd = 0;
        update(editor.value);
        syncScroll();
      }
    };

    let _visible = () => modal.style.display !== 'none';
    let toggle = (visible=!_visible()) => {modal.style.display = (visible ? '' : 'none')};
    let _resolve, [editJson, editText] = ['json', 'text'].map(mode => (value=editor.value, options={}) => new Promise(resolve => {
      [modal.mode, _resolve, _isValid] = [mode, resolve, options.validator];
      toolbar.style.display = (mode == 'json' ? '' : 'none');
      modal.classList[mode == 'json' ? 'remove' : 'add']('text');
      [error.innerText, editor.value, title.innerText] = ["", value, options.title||`Enter ${mode}`];
      render(content, value);
      toggle(true);
      detectWidth();
      editor.focus();
    }));
    let editAsJson = (value, options={}) => (setTimeout(reformat), editJson(JSON.stringify(value), options));
    let resolve = (value=editor.value) => (toggle(false), _resolve && _resolve(value));

    document.addEventListener('keydown', ({key}) => (key == 'Escape') && toggle(false));
    cancel.onclick = () => toggle();
    ok.onclick = () => {
      if (modal.mode != 'json') resolve(); else {
        let s = editor.value,  o = parseJson(s);
        if (!(o instanceof Error))
          resolve(o)
        else {
          try {if (_isValid(s)) return resolve()} catch (e) {}
          reformat(s, o)
        }
      }
    };

    editor.oninput = () => {update(editor.value);  syncScroll()};
    editor.onscroll = syncScroll;
    editor.onkeydown = captureTab(editor);
    redraw.onclick = sparse.onchange = compact.onchange = () => reformat();
    width.onchange = () => {
      if (!width.value || !Number.isInteger( Number(width.value) ))
        alert(`Invalid width value: ${width.value}`);
      else {
        _width = Number(width.value)||Infinity;
        reformat();
      }
    };

    return Object.assign(modal, {toggle, editText, editJson, editAsJson, render});
  };

  return {pformat, ParseError, parseJson, theme, createEditorModal};
})();
