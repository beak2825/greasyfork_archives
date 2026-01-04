// ==UserScript==
// @name        JSON formatter
// @icon        http://cn.gravatar.com/avatar/970cf1cfdd1c5bdca24e561425c57f4e?s=80
// @description Format JSON data in a beautiful way.
// @description:zh-CN 更加漂亮地显示JSON数据。
// @version     2.0.7
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @match       *://*/*
// @match       file:///*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/5185
// @downloadURL https://update.greasyfork.org/scripts/404246/JSON%20formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/404246/JSON%20formatter.meta.js
// ==/UserScript==

(function () {
'use strict';

const css = "*{margin:0;padding:0}body,html{font-family:Menlo,Microsoft YaHei,Tahoma}#json-formatter{position:relative;margin:0;padding:2em 1em 1em 2em;font-size:14px;line-height:1.5}#json-formatter>pre{white-space:pre-wrap}#json-formatter>pre:not(.show-commas) .comma,#json-formatter>pre:not(.show-quotes) .quote{display:none}.subtle{color:#999}.number{color:#ff8c00}.null{color:grey}.key{color:brown}.string{color:green}.boolean{color:#1e90ff}.bracket{color:#00f}.color{display:inline-block;width:.8em;height:.8em;margin:0 .2em;border:1px solid #666;vertical-align:-.1em}.item{cursor:pointer}.content{padding-left:2em}.collapse>span>.content{display:inline;padding-left:0}.collapse>span>.content>*{display:none}.collapse>span>.content:before{content:\"...\"}.complex{position:relative}.complex:before{content:\"\";position:absolute;top:1.5em;left:-.5em;bottom:.7em;margin-left:-1px;border-left:1px dashed #999}.complex.collapse:before{display:none}.folder{color:#999;position:absolute;top:0;left:-1em;width:1em;text-align:center;transform:rotate(90deg);transition:transform .3s;cursor:pointer}.collapse>.folder{transform:rotate(0)}.summary{color:#999;margin-left:1em}:not(.collapse)>.summary{display:none}.tips{position:absolute;padding:.5em;border-radius:.5em;box-shadow:0 0 1em grey;background:#fff;z-index:1;white-space:nowrap;color:#000}.tips-key{font-weight:700}.tips-val{color:#1e90ff}.tips-link{color:#6a5acd}.menu{position:fixed;top:0;right:0;background:#fff;padding:5px;user-select:none;z-index:10}.menu>span{display:inline-block;padding:4px 8px;margin-right:5px;border-radius:4px;background:#ddd;border:1px solid #ddd;cursor:pointer}.menu>span.toggle:not(.active){background:none}";

const React = VM;
const gap = 5;
const formatter = {
  options: [{
    key: 'show-quotes',
    title: '"',
    def: true
  }, {
    key: 'show-commas',
    title: ',',
    def: true
  }]
};
const config = { ...formatter.options.reduce((res, item) => {
    res[item.key] = item.def;
    return res;
  }, {}),
  ...GM_getValue('config')
};
if (['application/json', 'text/plain', 'application/javascript', 'text/javascript' // file:///foo/bar.js
].includes(document.contentType)) formatJSON();
GM_registerMenuCommand('Toggle JSON format', formatJSON);

function createQuote() {
  return /*#__PURE__*/React.createElement("span", {
    className: "subtle quote"
  }, "\"");
}

function createComma() {
  return /*#__PURE__*/React.createElement("span", {
    className: "subtle comma"
  }, ",");
}

function isColor(str) {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(str);
}

function tokenize(raw) {
  const skipWhitespace = index => {
    while (index < raw.length && ' \t\r\n'.includes(raw[index])) index += 1;

    return index;
  };

  const expectIndex = index => {
    if (index < raw.length) return index;
    throw new Error('Unexpected end of input');
  };

  const expectChar = (index, white, black) => {
    const ch = raw[index];

    if (white && !white.includes(ch) || black && black.includes(ch)) {
      throw new Error(`Unexpected token "${ch}" at ${index}`);
    }

    return ch;
  };

  const findWord = (index, words) => {
    for (const word of words) {
      if (raw.slice(index, index + word.length) === word) {
        return word;
      }
    }
  };

  const expectSpaceAndCharIndex = (index, white, black) => {
    const i = expectIndex(skipWhitespace(index));
    expectChar(i, white, black);
    return i;
  };

  const parseString = start => {
    let j;

    for (j = start + 1; true; j = expectIndex(j + 1)) {
      const ch = raw[j];
      if (ch === '"') break;

      if (ch === '\\') {
        j = expectIndex(j + 1);
        const ch2 = raw[j];

        if (ch2 === 'x') {
          j = expectIndex(j + 2);
        } else if (ch2 === 'u') {
          j = expectIndex(j + 4);
        }
      }
    }

    const source = raw.slice(start + 1, j);
    return {
      type: 'string',
      source,
      data: source,
      color: isColor(source),
      start,
      end: j + 1
    };
  };

  const parseKeyword = start => {
    const nullWord = findWord(start, ['null']);

    if (nullWord) {
      return {
        type: 'null',
        source: 'null',
        data: null,
        start,
        end: start + 4
      };
    }

    const bool = findWord(start, ['true', 'false']);

    if (bool) {
      return {
        type: 'boolean',
        source: bool,
        data: bool === 'true',
        start,
        end: start + bool.length
      };
    }

    expectChar(start, '0');
  };

  const DIGITS = '0123456789';

  const findDecimal = (start, fractional) => {
    let i = start;
    if ('+-'.includes(raw[i])) i += 1;
    let j;
    let dot = -1;

    for (j = i; true; j = expectIndex(j + 1)) {
      const ch = expectChar(j, // there must be at least one digit
      // dot must not be the last character of a number, expecting a digit
      j === i || dot >= 0 && dot === j - 1 ? DIGITS : null, // there can be at most one dot
      !fractional || dot >= 0 ? '.' : null);
      if (ch === '.') dot = j;else if (!DIGITS.includes(ch)) break;
    }

    return j;
  };

  const parseNumber = start => {
    let i = findDecimal(start, true);
    const ch = raw[i];

    if (ch && ch.toLowerCase() === 'e') {
      i = findDecimal(i + 1);
    }

    const source = raw.slice(start, i);
    return {
      type: 'number',
      source,
      data: +source,
      start,
      end: i
    };
  };

  let parseItem;

  const parseArray = start => {
    const result = {
      type: 'array',
      data: [],
      start
    };
    let i = start + 1;

    while (true) {
      i = expectIndex(skipWhitespace(i));
      if (raw[i] === ']') break;
      if (result.data.length) i = expectSpaceAndCharIndex(i, ',') + 1;
      const item = parseItem(i);
      result.data.push(item);
      i = item.end;
    }

    result.end = i + 1;
    return result;
  };

  const parseObject = start => {
    const result = {
      type: 'object',
      data: [],
      start
    };
    let i = start + 1;

    while (true) {
      i = expectIndex(skipWhitespace(i));
      if (raw[i] === '}') break;
      if (result.data.length) i = expectSpaceAndCharIndex(i, ',') + 1;
      i = expectSpaceAndCharIndex(i, '"');
      const key = parseString(i);
      i = expectSpaceAndCharIndex(key.end, ':') + 1;
      const value = parseItem(i);
      result.data.push({
        key,
        value
      });
      i = value.end;
    }

    result.end = i + 1;
    return result;
  };

  parseItem = start => {
    const i = expectIndex(skipWhitespace(start));
    const ch = raw[i];
    if (ch === '"') return parseString(i);
    if (ch === '[') return parseArray(i);
    if (ch === '{') return parseObject(i);
    if ('-0123456789'.includes(ch)) return parseNumber(i);
    return parseKeyword(i);
  };

  const result = parseItem(0);
  const end = skipWhitespace(result.end);
  if (end < raw.length) expectChar(end, []);
  return result;
}

function loadJSON() {
  const raw = document.body.innerText;

  try {
    // JSON
    const content = tokenize(raw);
    return {
      raw,
      content
    };
  } catch (e) {
    // not JSON
    console.error('Not JSON', e);
  }

  try {
    // JSONP
    const parts = raw.match(/^(.*?\w\s*\()(.+)(\)[;\s]*)$/);
    const content = tokenize(parts[2]);
    return {
      raw,
      content,
      prefix: /*#__PURE__*/React.createElement("span", {
        className: "subtle"
      }, parts[1].trim()),
      suffix: /*#__PURE__*/React.createElement("span", {
        className: "subtle"
      }, parts[3].trim())
    };
  } catch (e) {
    // not JSONP
    console.error('Not JSONP', e);
  }
}

function formatJSON() {
  if (formatter.formatted) return;
  formatter.formatted = true;
  formatter.data = loadJSON();
  if (!formatter.data) return;
  formatter.style = GM_addStyle(css);
  formatter.root = /*#__PURE__*/React.createElement("div", {
    id: "json-formatter"
  });
  document.body.innerHTML = '';
  document.body.append(formatter.root);
  initTips();
  initMenu();
  bindEvents();
  generateNodes(formatter.data, formatter.root);
}

function generateNodes(data, container) {
  const rootSpan = /*#__PURE__*/React.createElement("span", null);
  const root = /*#__PURE__*/React.createElement("div", null, rootSpan);
  const pre = /*#__PURE__*/React.createElement("pre", null, root);
  formatter.pre = pre;
  const queue = [{
    el: rootSpan,
    elBlock: root,
    ...data
  }];

  while (queue.length) {
    const item = queue.shift();
    const {
      el,
      content,
      prefix,
      suffix
    } = item;
    if (prefix) el.append(prefix);

    if (content.type === 'array') {
      queue.push(...generateArray(item));
    } else if (content.type === 'object') {
      queue.push(...generateObject(item));
    } else {
      const {
        type,
        color
      } = content;
      if (type === 'string') el.append(createQuote());
      if (color) el.append( /*#__PURE__*/React.createElement("span", {
        className: "color",
        style: `background-color: ${content.data}`
      }));
      el.append( /*#__PURE__*/React.createElement("span", {
        className: `${type} item`,
        "data-type": type,
        "data-value": toString(content)
      }, toString(content)));
      if (type === 'string') el.append(createQuote());
    }

    if (suffix) el.append(suffix);
  }

  container.append(pre);
  updateView();
}

function toString(content) {
  return `${content.source}`;
}

function setFolder(el, length) {
  if (length) {
    el.classList.add('complex');
    el.append( /*#__PURE__*/React.createElement("div", {
      className: "folder"
    }, '\u25b8'), /*#__PURE__*/React.createElement("span", {
      className: "summary"
    }, `// ${length} items`));
  }
}

function generateArray({
  el,
  elBlock,
  content
}) {
  const elContent = content.data.length && /*#__PURE__*/React.createElement("div", {
    className: "content"
  });
  setFolder(elBlock, content.data.length);
  el.append( /*#__PURE__*/React.createElement("span", {
    className: "bracket"
  }, "["), elContent || ' ', /*#__PURE__*/React.createElement("span", {
    className: "bracket"
  }, "]"));
  return content.data.map((item, i) => {
    const elValue = /*#__PURE__*/React.createElement("span", null);
    const elChild = /*#__PURE__*/React.createElement("div", null, elValue);
    elContent.append(elChild);
    if (i < content.data.length - 1) elChild.append(createComma());
    return {
      el: elValue,
      elBlock: elChild,
      content: item
    };
  });
}

function generateObject({
  el,
  elBlock,
  content
}) {
  const elContent = content.data.length && /*#__PURE__*/React.createElement("div", {
    className: "content"
  });
  setFolder(elBlock, content.data.length);
  el.append( /*#__PURE__*/React.createElement("span", {
    className: "bracket"
  }, '{'), elContent || ' ', /*#__PURE__*/React.createElement("span", {
    className: "bracket"
  }, '}'));
  return content.data.map(({
    key,
    value
  }, i) => {
    const elValue = /*#__PURE__*/React.createElement("span", null);
    const elChild = /*#__PURE__*/React.createElement("div", null, createQuote(), /*#__PURE__*/React.createElement("span", {
      className: "key item",
      "data-type": key.type
    }, key.data), createQuote(), ': ', elValue);
    if (i < content.data.length - 1) elChild.append(createComma());
    elContent.append(elChild);
    return {
      el: elValue,
      content: value,
      elBlock: elChild
    };
  });
}

function updateView() {
  formatter.options.forEach(({
    key
  }) => {
    formatter.pre.classList[config[key] ? 'add' : 'remove'](key);
  });
}

function removeEl(el) {
  el.remove();
}

function initMenu() {
  const handleCopy = () => {
    GM_setClipboard(formatter.data.raw);
  };

  const handleCollapse = () => {
    var list = React.getElementsByXPath("//div[@class='complex']");
    for (var i in list) {
      list[i].classList.toggle('collapse');
    }
  };

  const handleExpand = () => {
    var list = React.getElementsByXPath("//div[@class='complex collapse']");
    for (var i in list) {
      list[i].classList.toggle('collapse');
    }
  };

  const handleMenuClick = e => {
    const el = e.target;
    const {
      key
    } = el.dataset;

    if (key) {
      config[key] = !config[key];
      GM_setValue('config', config);
      el.classList.toggle('active');
      updateView();
    }
  };

  formatter.root.append( /*#__PURE__*/React.createElement("div", {
    className: "menu",
    onClick: handleMenuClick
  }, /*#__PURE__*/React.createElement("span", {
    onClick: handleCopy
  }, "Copy"), React.createElement("span", {
    onClick: handleExpand
  }, "Expand All"), React.createElement("span", {
    onClick: handleCollapse
  }, "Collapse All"), formatter.options.map(item => /*#__PURE__*/React.createElement("span", {
    className: `toggle${config[item.key] ? ' active' : ''}`,
    dangerouslySetInnerHTML: {
      __html: item.title
    },
    "data-key": item.key
  }))));
}

function initTips() {
  const tips = /*#__PURE__*/React.createElement("div", {
    className: "tips",
    onClick: e => {
      e.stopPropagation();
    }
  });

  const hide = () => removeEl(tips);

  document.addEventListener('click', hide, false);
  formatter.tips = {
    node: tips,
    hide,

    show(range) {
      const {
        scrollTop
      } = document.body;
      const rects = range.getClientRects();
      let rect;

      if (rects[0].top < 100) {
        rect = rects[rects.length - 1];
        tips.style.top = `${rect.bottom + scrollTop + gap}px`;
        tips.style.bottom = '';
      } else {
        [rect] = rects;
        tips.style.top = '';
        tips.style.bottom = `${formatter.root.offsetHeight - rect.top - scrollTop + gap}px`;
      }

      tips.style.left = `${rect.left}px`;
      const {
        type,
        value
      } = range.startContainer.dataset;
      tips.innerHTML = '';
      tips.append( /*#__PURE__*/React.createElement("span", {
        className: "tips-key"
      }, "type"), ': ', /*#__PURE__*/React.createElement("span", {
        className: "tips-val",
        dangerouslySetInnerHTML: {
          __html: type
        }
      }));

      if (type === 'string' && /^(https?|ftps?):\/\/\S+/.test(value)) {
        tips.append( /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
          className: "tips-link",
          href: value,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "Open link"));
      }

      formatter.root.append(tips);
    }

  };
}

function selectNode(node) {
  const selection = window.getSelection();
  selection.removeAllRanges();
  const range = document.createRange();
  range.setStartBefore(node.firstChild);
  range.setEndAfter(node.firstChild);
  selection.addRange(range);
  return range;
}

function bindEvents() {
  formatter.root.addEventListener('click', e => {
    e.stopPropagation();
    const {
      target
    } = e;

    if (target.classList.contains('item')) {
      formatter.tips.show(selectNode(target));
    } else {
      formatter.tips.hide();
    }

    if (target.classList.contains('folder')) {
      target.parentNode.classList.toggle('collapse');
    }
  }, false);
}

}());
