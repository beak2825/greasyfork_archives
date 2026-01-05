
// ==UserScript==
// @name              URL Sniffer
// @name:zh-CN        URL 嗅探器
// @namespace         https://gera2ld.space/
// @description       Sniff URLs in HTML
// @description:zh-CN 从 HTML 中嗅探 URL
// @match             *://*/*
// @version           0.2.0
// @author            Gerald <gera2ld@live.com>
// @require           https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @supportURL        https://github.com/intellilab/url-sniffer.user.js
// @grant             GM_addStyle
// @grant             GM_registerMenuCommand
// @grant             GM_setClipboard
// @grant             GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/16369/URL%20Sniffer.user.js
// @updateURL https://update.greasyfork.org/scripts/16369/URL%20Sniffer.meta.js
// ==/UserScript==

(function () {
'use strict';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var styles = {"root":"style-module_root__1vyw2","toast":"style-module_toast__OcS5G","image":"style-module_image__1P0bD"};
var stylesheet=".style-module_root__1vyw2{background:#0008;inset:0;position:fixed;z-index:10000}.style-module_root__1vyw2:before{background:#0008;color:#bbb;content:\"Double click anywhere on the mask to exit\";font-size:12px;left:50%;padding:8px 16px;position:absolute;top:0;transform:translateX(-50%)}.style-module_root__1vyw2>*{border:2px solid;left:0;position:absolute;top:0}.style-module_toast__OcS5G{z-index:10001!important}.style-module_image__1P0bD{background:#0008;inset:80px;overflow:auto;position:absolute}.style-module_image__1P0bD>img{position:absolute;transform-origin:top left}";

const _excluded = ["elements", "getItem"];
const STYLE_CURRENT = {
  stroke: '#0f08',
  fill: '#0f02'
};
const STYLE_SELECTION = {
  stroke: '#bbf8',
  fill: '#bbf2'
};
const STYLE_SELECTED = {
  stroke: '#ff08',
  fill: '#ff02'
};
const STYLE_TO_DESELECT = {
  stroke: '#88d8',
  fill: '#88d2'
};
const STYLE_TO_SELECT = {
  stroke: '#bb08',
  fill: '#bb02'
};
const MODE_SINGLE = 0;
const MODE_MULTIPLE = 1;
let rendering = false;
const mask = VM.getHostElement(false);
mask.addStyle(stylesheet);
mask.root.className = styles.root;
mask.root.addEventListener('mousedown', handleMouseDown);
mask.root.addEventListener('mouseup', handleMouseUp);
mask.root.addEventListener('mousemove', handleMouseMove);
mask.root.addEventListener('click', handleClick);
mask.root.addEventListener('dblclick', handleCallback);
GM_registerMenuCommand('Sniff links', sniffLinks);
GM_registerMenuCommand('Sniff images', sniffImages);
let context;

function sniffLinks() {
  if (context) close();
  start({
    elements: document.querySelectorAll('a[href]'),

    getItem(el) {
      const href = el.tagName.toLowerCase() === 'a' && el.getAttribute('href');
      if (href && !/^(?:#|javascript:)/.test(href)) return {
        el
      };
    },

    mode: MODE_MULTIPLE,

    callback(selectedItems) {
      copy(selectedItems);
      close();
    }

  });
}

function sniffImages() {
  if (context) close();
  const imageViewer = VM.hm("div", {
    className: styles.image,
    onClick: e => e.stopPropagation()
  });

  const showImage = img => {
    mask.root.append(imageViewer);
    const {
      naturalWidth,
      naturalHeight
    } = img;
    const containerWidth = imageViewer.clientWidth;
    const containerHeight = imageViewer.clientHeight;
    const scale = Math.min(1, containerWidth / naturalWidth);
    const width = naturalWidth * scale;
    const height = naturalHeight * scale;
    const x = Math.max(0, (containerWidth - width) / 2);
    const y = Math.max(0, (containerHeight - height) / 2);
    imageViewer.innerHTML = '';
    imageViewer.append(img);
    img.style.transform = `scale(${scale}) translate(${x}px,${y}px)`;
    context.paused = true;
    mask.root.addEventListener('click', closeViewer);
  };

  const closeViewer = () => {
    imageViewer.innerHTML = '';
    imageViewer.remove();
    context.paused = false;
    mask.root.removeEventListener('click', closeViewer);
  };

  start({
    getItem(el) {
      let url;

      if (el.tagName.toLowerCase() === 'img') {
        url = el.src;
      } else {
        const bgImg = el.style.backgroundImage.match(/^url\((['"]?)(.*?)\1\)/);
        url = bgImg == null ? void 0 : bgImg[2];
      }

      return url && {
        el,
        url
      };
    },

    mode: MODE_SINGLE,

    callback([item]) {
      if (!item) return close();
      const img = new Image();
      img.src = item.url;

      img.onload = () => {
        showImage(img);
      };
    }

  });
}

function start(opts) {
  if (context) throw new Error('Context already exists');

  const {
    elements,
    getItem
  } = opts,
        rest = _objectWithoutPropertiesLoose(opts, _excluded);

  const items = Array.from(elements || document.querySelectorAll('*')).map(getItem).filter(Boolean);
  context = _extends({}, rest, {
    items,
    index: -1,
    active: null,
    disconnect: VM.observe(document.body, mutations => {
      mutations.forEach(mut => {
        if (mut.type === 'childList') {
          const newItems = Array.from(mut.addedNodes).filter(el => !mask.root.contains(el)).map(getItem).filter(Boolean);
          context.items.push(...newItems);
        }
      });
    })
  });
  update();
  mask.show();
  document.addEventListener('scroll', update);
  document.addEventListener('resize', update);
}

function close() {
  if (!context) return;
  context.disconnect == null ? void 0 : context.disconnect();
  mask.root.innerHTML = '';
  mask.hide();
  context = null;
  document.removeEventListener('scroll', update);
  document.removeEventListener('resize', update);
  GM_unregisterMenuCommand('Copy URLs');
}

function update() {
  if (rendering) return;
  rendering = true;
  requestAnimationFrame(() => {
    context.items.forEach(item => {
      const rect = item.el.getBoundingClientRect();
      item.pos = {
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: rect.height
      };
    });
    render();
    rendering = false;
  });
}

function render() {
  renderActive();
  renderSelected();
}

function updateStyle(el, style) {
  el.style.borderColor = style.stroke;
  el.style.background = style.fill;
}

function updatePosition(el, pos, padding = 2) {
  Object.assign(el.style, {
    width: `${pos.w + padding * 2}px`,
    height: `${pos.h + padding * 2}px`,
    transform: `translate(${pos.x - padding}px,${pos.y - padding}px)`
  });
}

function renderActive() {
  const activeItem = !context.dragging && context.items[context.index];

  if (!activeItem) {
    if (context.active) {
      context.active.remove();
      context.active = null;
    }
  } else {
    if (!context.active) {
      context.active = VM.hm(mask.id, null);
      updateStyle(context.active, STYLE_CURRENT);
      mask.root.append(context.active);
    }

    updatePosition(context.active, activeItem.pos);
  }
}

function renderSelected() {
  context.items.forEach(item => {
    if (item.rect) updatePosition(item.rect, item.pos);
  });
}

function setItemRect(item, style) {
  if (style) {
    if (!item.rect) {
      item.rect = VM.hm(mask.id, null);
      mask.root.append(item.rect);
    }

    updateStyle(item.rect, style);
    updatePosition(item.rect, item.pos);
  } else if (item.rect) {
    item.rect.remove();
    item.rect = null;
  }
}

function handleClick() {
  if (context.paused) return;
  const activeItem = context.items[context.index];

  if (activeItem) {
    if (context.mode === MODE_SINGLE) {
      context.callback([activeItem]);
    } else {
      activeItem.selected = !activeItem.selected;
      setItemRect(activeItem, activeItem.selected && STYLE_SELECTED);
    }
  }
}

function handleMouseDown(e) {
  if (context.dragging || context.mode === MODE_SINGLE || context.paused) return;
  const x = e.clientX;
  const y = e.clientY;
  context.dragging = {
    x,
    y
  };
}

function handleMouseMove(e) {
  if (context.paused) return;
  const x = e.clientX;
  const y = e.clientY;

  if (context.dragging) {
    if (!context.dragging.rect) {
      const rect = VM.hm(mask.id, null);
      updateStyle(rect, STYLE_SELECTION);
      mask.root.append(rect);
      context.dragging.rect = rect;
    }

    context.index = -1;
    let x0 = context.dragging.x;
    let y0 = context.dragging.y;
    const w = Math.abs(x - x0);
    const h = Math.abs(y - y0);
    x0 = Math.min(x0, x);
    y0 = Math.min(y0, y);
    updatePosition(context.dragging.rect, {
      x: x0,
      y: y0,
      w,
      h
    }, 0);
    context.items.forEach(item => {
      item.inSelection = item.pos.x >= x0 && item.pos.x + item.pos.w <= x0 + w && item.pos.y >= y0 && item.pos.y + item.pos.h <= y0 + h;
      const state = (item.inSelection ? 2 : 0) + (item.selected ? 1 : 0);
      setItemRect(item, {
        1: STYLE_SELECTED,
        2: STYLE_TO_SELECT,
        3: STYLE_TO_DESELECT
      }[state]);
    });
  } else {
    context.index = context.items.findIndex(({
      pos
    }) => x >= pos.x && x <= pos.x + pos.w && y >= pos.y && y <= pos.y + pos.h);
  }

  render();
}

function handleMouseUp() {
  if (!context.dragging) return;

  if (context.dragging.rect) {
    context.dragging.rect.remove();
    context.items.forEach(item => {
      if (item.inSelection) {
        item.inSelection = false;
        item.selected = !item.selected;
        setItemRect(item, item.selected && STYLE_SELECTED);
      }
    });
  }

  context.dragging = null;
}

function handleCallback() {
  const selectedItems = context.items.filter(item => item.selected);
  context.callback(selectedItems);
}

function copy(selectedItems) {
  const urls = selectedItems.map(item => item.el.href);
  if (!urls.length) return;
  GM_setClipboard(urls.join('\r\n'));
  VM.showToast('URLs copied', {
    shadow: false,
    className: styles.toast
  });
}

})();
