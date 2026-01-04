// ==UserScript==
// @name         原神Wiki辅助工具
// @namespace    https://dev.songe.li
// @version      1.1.1
// @author       lisonge
// @description  原神 Wiki 辅助工具, 1.显示/隐藏已完成成就
// @license      MIT
// @icon         https://dev.songe.li/favicon.svg
// @homepage     https://github.com/lisonge/op-wiki-plus#readme
// @homepageURL  https://github.com/lisonge/op-wiki-plus#readme
// @source       https://github.com/lisonge/op-wiki-plus.git
// @supportURL   https://github.com/lisonge/op-wiki-plus/issues
// @include      https://wiki.biligame.com/ys/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.31/dist/vue.global.prod.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/441073/%E5%8E%9F%E7%A5%9EWiki%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/441073/%E5%8E%9F%E7%A5%9EWiki%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(({ cssTextList = [] }) => {
  cssTextList.forEach((s) => {
    const style = document.createElement("style");
    style.innerText = s;
    style.dataset.source = "vite-plugin-monkey";
    document.head.appendChild(style);
  });
})({
  "cssTextList": [
    ".root-1fdb449b[data-v-1278fd00] {\n  color: black;\n  background-color: white;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 9999;\n  display: flex;\n  flex-direction: column;\n  padding: 10px;\n  align-items: flex-start;\n}\n.root-1fdb449b > *[data-v-1278fd00] {\n  margin-bottom: 10px;\n}\n.root-1fdb449b > *[data-v-1278fd00]:last-child {\n  margin-bottom: 0;\n}"
  ]
});

(function(vue, lodash) {
  var _a;
  "use strict";
  function depx(value) {
    if (typeof value === "string") {
      if (value.endsWith("px")) {
        return Number(value.slice(0, value.length - 2));
      }
      return Number(value);
    }
    return value;
  }
  function pxfy(value) {
    if (value === void 0 || value === null)
      return void 0;
    if (typeof value === "number")
      return `${value}px`;
    if (value.endsWith("px"))
      return value;
    return `${value}px`;
  }
  var colors = {
    black: "#000",
    silver: "#C0C0C0",
    gray: "#808080",
    white: "#FFF",
    maroon: "#800000",
    red: "#F00",
    purple: "#800080",
    fuchsia: "#F0F",
    green: "#008000",
    lime: "#0F0",
    olive: "#808000",
    yellow: "#FF0",
    navy: "#000080",
    blue: "#00F",
    teal: "#008080",
    aqua: "#0FF",
    transparent: "#0000"
  };
  const prefix$1 = "^\\s*";
  const suffix = "\\s*$";
  const float = "\\s*((\\.\\d+)|(\\d+(\\.\\d*)?))\\s*";
  const hex = "([0-9A-Fa-f])";
  const dhex = "([0-9A-Fa-f]{2})";
  const rgbRegex = new RegExp(`${prefix$1}rgb\\s*\\(${float},${float},${float}\\)${suffix}`);
  const rgbaRegex = new RegExp(`${prefix$1}rgba\\s*\\(${float},${float},${float},${float}\\)${suffix}`);
  const sHexRegex = new RegExp(`${prefix$1}#${hex}${hex}${hex}${suffix}`);
  const hexRegex = new RegExp(`${prefix$1}#${dhex}${dhex}${dhex}${suffix}`);
  const sHexaRegex = new RegExp(`${prefix$1}#${hex}${hex}${hex}${hex}${suffix}`);
  const hexaRegex = new RegExp(`${prefix$1}#${dhex}${dhex}${dhex}${dhex}${suffix}`);
  function parseHex(value) {
    return parseInt(value, 16);
  }
  function rgba(color) {
    try {
      let i;
      if (i = hexRegex.exec(color)) {
        return [parseHex(i[1]), parseHex(i[2]), parseHex(i[3]), 1];
      } else if (i = rgbRegex.exec(color)) {
        return [roundChannel(i[1]), roundChannel(i[5]), roundChannel(i[9]), 1];
      } else if (i = rgbaRegex.exec(color)) {
        return [
          roundChannel(i[1]),
          roundChannel(i[5]),
          roundChannel(i[9]),
          roundAlpha(i[13])
        ];
      } else if (i = sHexRegex.exec(color)) {
        return [
          parseHex(i[1] + i[1]),
          parseHex(i[2] + i[2]),
          parseHex(i[3] + i[3]),
          1
        ];
      } else if (i = hexaRegex.exec(color)) {
        return [
          parseHex(i[1]),
          parseHex(i[2]),
          parseHex(i[3]),
          roundAlpha(parseHex(i[4]) / 255)
        ];
      } else if (i = sHexaRegex.exec(color)) {
        return [
          parseHex(i[1] + i[1]),
          parseHex(i[2] + i[2]),
          parseHex(i[3] + i[3]),
          roundAlpha(parseHex(i[4] + i[4]) / 255)
        ];
      } else if (color in colors) {
        return rgba(colors[color]);
      }
      throw new Error(`[seemly/rgba]: Invalid color value ${color}.`);
    } catch (e) {
      throw e;
    }
  }
  function normalizeAlpha(alphaValue) {
    return alphaValue > 1 ? 1 : alphaValue < 0 ? 0 : alphaValue;
  }
  function stringifyRgba(r, g, b, a) {
    return `rgba(${roundChannel(r)}, ${roundChannel(g)}, ${roundChannel(b)}, ${normalizeAlpha(a)})`;
  }
  function compositeChannel(v1, a1, v2, a2, a) {
    return roundChannel((v1 * a1 * (1 - a2) + v2 * a2) / a);
  }
  function composite(background, overlay2) {
    if (!Array.isArray(background))
      background = rgba(background);
    if (!Array.isArray(overlay2))
      overlay2 = rgba(overlay2);
    const a1 = background[3];
    const a2 = overlay2[3];
    const alpha = roundAlpha(a1 + a2 - a1 * a2);
    return stringifyRgba(compositeChannel(background[0], a1, overlay2[0], a2, alpha), compositeChannel(background[1], a1, overlay2[1], a2, alpha), compositeChannel(background[2], a1, overlay2[2], a2, alpha), alpha);
  }
  function changeColor(base2, options) {
    const [r, g, b, a = 1] = Array.isArray(base2) ? base2 : rgba(base2);
    if (options.alpha) {
      return stringifyRgba(r, g, b, options.alpha);
    }
    return stringifyRgba(r, g, b, a);
  }
  function scaleColor(base2, options) {
    const [r, g, b, a = 1] = Array.isArray(base2) ? base2 : rgba(base2);
    const { lightness = 1, alpha = 1 } = options;
    return toRgbaString([r * lightness, g * lightness, b * lightness, a * alpha]);
  }
  function roundAlpha(value) {
    const v = Math.round(Number(value) * 100) / 100;
    if (v > 1)
      return 1;
    if (v < 0)
      return 0;
    return v;
  }
  function roundChannel(value) {
    const v = Math.round(Number(value));
    if (v > 255)
      return 255;
    if (v < 0)
      return 0;
    return v;
  }
  function toRgbaString(base2) {
    const [r, g, b] = base2;
    if (3 in base2) {
      return `rgba(${roundChannel(r)}, ${roundChannel(g)}, ${roundChannel(b)}, ${roundAlpha(base2[3])})`;
    }
    return `rgba(${roundChannel(r)}, ${roundChannel(g)}, ${roundChannel(b)}, 1)`;
  }
  function call(funcs, ...args) {
    if (Array.isArray(funcs)) {
      funcs.forEach((func) => call(func, ...args));
    } else
      return funcs(...args);
  }
  function throwError(location, message) {
    throw new Error(`[naive/${location}]: ${message}`);
  }
  function createInjectionKey(key2) {
    return key2;
  }
  function ensureValidVNode(vnodes) {
    return vnodes.some((child) => {
      if (!vue.isVNode(child)) {
        return true;
      }
      if (child.type === vue.Comment) {
        return false;
      }
      if (child.type === vue.Fragment && !ensureValidVNode(child.children)) {
        return false;
      }
      return true;
    }) ? vnodes : null;
  }
  function resolveWrappedSlot(slot, wrapper) {
    const children = slot && ensureValidVNode(slot());
    return wrapper(children || null);
  }
  function isSlotEmpty(slot) {
    return !(slot && ensureValidVNode(slot()));
  }
  function ampCount(selector) {
    let cnt = 0;
    for (let i = 0; i < selector.length; ++i) {
      if (selector[i] === "&")
        ++cnt;
    }
    return cnt;
  }
  const separatorRegex = /\s*,(?![^(]*\))\s*/g;
  const extraSpaceRegex = /\s+/g;
  function resolveSelectorWithAmp(amp, selector) {
    const nextAmp = [];
    selector.split(separatorRegex).forEach((partialSelector) => {
      let round = ampCount(partialSelector);
      if (!round) {
        amp.forEach((partialAmp) => {
          nextAmp.push((partialAmp && partialAmp + " ") + partialSelector);
        });
        return;
      } else if (round === 1) {
        amp.forEach((partialAmp) => {
          nextAmp.push(partialSelector.replace("&", partialAmp));
        });
        return;
      }
      let partialNextAmp = [
        partialSelector
      ];
      while (round--) {
        const nextPartialNextAmp = [];
        partialNextAmp.forEach((selectorItr) => {
          amp.forEach((partialAmp) => {
            nextPartialNextAmp.push(selectorItr.replace("&", partialAmp));
          });
        });
        partialNextAmp = nextPartialNextAmp;
      }
      partialNextAmp.forEach((part) => nextAmp.push(part));
    });
    return nextAmp;
  }
  function resolveSelector(amp, selector) {
    const nextAmp = [];
    selector.split(separatorRegex).forEach((partialSelector) => {
      amp.forEach((partialAmp) => {
        nextAmp.push((partialAmp && partialAmp + " ") + partialSelector);
      });
    });
    return nextAmp;
  }
  function parseSelectorPath(selectorPaths) {
    let amp = [""];
    selectorPaths.forEach((selector) => {
      selector = selector && selector.trim();
      if (!selector) {
        return;
      }
      if (selector.includes("&")) {
        amp = resolveSelectorWithAmp(amp, selector);
      } else {
        amp = resolveSelector(amp, selector);
      }
    });
    return amp.join(", ").replace(extraSpaceRegex, " ");
  }
  function removeElement(el) {
    if (!el)
      return;
    const parentElement = el.parentElement;
    if (parentElement)
      parentElement.removeChild(el);
  }
  function queryElement(id) {
    return document.querySelector(`style[cssr-id="${id}"]`);
  }
  function createElement(id) {
    const el = document.createElement("style");
    el.setAttribute("cssr-id", id);
    return el;
  }
  function isMediaOrSupports(selector) {
    if (!selector)
      return false;
    return /^\s*@(s|m)/.test(selector);
  }
  const kebabRegex = /[A-Z]/g;
  function kebabCase(pattern) {
    return pattern.replace(kebabRegex, (match) => "-" + match.toLowerCase());
  }
  function unwrapProperty(prop, indent = "  ") {
    if (typeof prop === "object" && prop !== null) {
      return " {\n" + Object.entries(prop).map((v) => {
        return indent + `  ${kebabCase(v[0])}: ${v[1]};`;
      }).join("\n") + "\n" + indent + "}";
    }
    return `: ${prop};`;
  }
  function unwrapProperties(props, instance, params) {
    if (typeof props === "function") {
      return props({
        context: instance.context,
        props: params
      });
    }
    return props;
  }
  function createStyle(selector, props, instance, params) {
    if (!props)
      return "";
    const unwrappedProps = unwrapProperties(props, instance, params);
    if (!unwrappedProps)
      return "";
    if (typeof unwrappedProps === "string") {
      return `${selector} {
${unwrappedProps}
}`;
    }
    const propertyNames = Object.keys(unwrappedProps);
    if (propertyNames.length === 0) {
      if (instance.config.keepEmptyBlock)
        return selector + " {\n}";
      return "";
    }
    const statements = selector ? [
      selector + " {"
    ] : [];
    propertyNames.forEach((propertyName) => {
      const property = unwrappedProps[propertyName];
      if (propertyName === "raw") {
        statements.push("\n" + property + "\n");
        return;
      }
      propertyName = kebabCase(propertyName);
      if (property !== null && property !== void 0) {
        statements.push(`  ${propertyName}${unwrapProperty(property)}`);
      }
    });
    if (selector) {
      statements.push("}");
    }
    return statements.join("\n");
  }
  function loopCNodeListWithCallback(children, options, callback) {
    if (!children)
      return;
    children.forEach((child) => {
      if (Array.isArray(child)) {
        loopCNodeListWithCallback(child, options, callback);
      } else if (typeof child === "function") {
        const grandChildren = child(options);
        if (Array.isArray(grandChildren)) {
          loopCNodeListWithCallback(grandChildren, options, callback);
        } else if (grandChildren) {
          callback(grandChildren);
        }
      } else if (child) {
        callback(child);
      }
    });
  }
  function traverseCNode(node, selectorPaths, styles, instance, params, styleSheet) {
    const $ = node.$;
    let blockSelector = "";
    if (!$ || typeof $ === "string") {
      if (isMediaOrSupports($)) {
        blockSelector = $;
      } else {
        selectorPaths.push($);
      }
    } else if (typeof $ === "function") {
      const selector2 = $({
        context: instance.context,
        props: params
      });
      if (isMediaOrSupports(selector2)) {
        blockSelector = selector2;
      } else {
        selectorPaths.push(selector2);
      }
    } else {
      if ($.before)
        $.before(instance.context);
      if (!$.$ || typeof $.$ === "string") {
        if (isMediaOrSupports($.$)) {
          blockSelector = $.$;
        } else {
          selectorPaths.push($.$);
        }
      } else if ($.$) {
        const selector2 = $.$({
          context: instance.context,
          props: params
        });
        if (isMediaOrSupports(selector2)) {
          blockSelector = selector2;
        } else {
          selectorPaths.push(selector2);
        }
      }
    }
    const selector = parseSelectorPath(selectorPaths);
    const style2 = createStyle(selector, node.props, instance, params);
    if (blockSelector) {
      styles.push(`${blockSelector} {`);
      if (styleSheet && style2) {
        styleSheet.insertRule(`${blockSelector} {
${style2}
}
`);
      }
    } else {
      if (styleSheet && style2) {
        styleSheet.insertRule(style2);
      }
      if (!styleSheet && style2.length)
        styles.push(style2);
    }
    if (node.children) {
      loopCNodeListWithCallback(node.children, {
        context: instance.context,
        props: params
      }, (childNode) => {
        if (typeof childNode === "string") {
          const style3 = createStyle(selector, { raw: childNode }, instance, params);
          if (styleSheet) {
            styleSheet.insertRule(style3);
          } else {
            styles.push(style3);
          }
        } else {
          traverseCNode(childNode, selectorPaths, styles, instance, params, styleSheet);
        }
      });
    }
    selectorPaths.pop();
    if (blockSelector) {
      styles.push("}");
    }
    if ($ && $.after)
      $.after(instance.context);
  }
  function render(node, instance, props, insertRule = false) {
    const styles = [];
    traverseCNode(node, [], styles, instance, props, insertRule ? node.instance.__styleSheet : void 0);
    if (insertRule)
      return "";
    return styles.join("\n\n");
  }
  function murmur2(str) {
    var h = 0;
    var k, i = 0, len = str.length;
    for (; len >= 4; ++i, len -= 4) {
      k = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
      k = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16);
      k ^= k >>> 24;
      h = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
    }
    switch (len) {
      case 3:
        h ^= (str.charCodeAt(i + 2) & 255) << 16;
      case 2:
        h ^= (str.charCodeAt(i + 1) & 255) << 8;
      case 1:
        h ^= str.charCodeAt(i) & 255;
        h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
    }
    h ^= h >>> 13;
    h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
    return ((h ^ h >>> 15) >>> 0).toString(36);
  }
  if (typeof window !== "undefined") {
    window.__cssrContext = {};
  }
  function unmount(intance, node, id) {
    const { els } = node;
    if (id === void 0) {
      els.forEach(removeElement);
      node.els = [];
    } else {
      const target = queryElement(id);
      if (target && els.includes(target)) {
        removeElement(target);
        node.els = els.filter((el) => el !== target);
      }
    }
  }
  function addElementToList(els, target) {
    els.push(target);
  }
  function mount(instance, node, id, props, head, silent, force, anchorMetaName, ssrAdapter2) {
    if (silent && !ssrAdapter2) {
      if (id === void 0) {
        console.error("[css-render/mount]: `id` is required in `silent` mode.");
        return;
      }
      const cssrContext = window.__cssrContext;
      if (!cssrContext[id]) {
        cssrContext[id] = true;
        render(node, instance, props, silent);
      }
      return;
    }
    let style2;
    if (id === void 0) {
      style2 = node.render(props);
      id = murmur2(style2);
    }
    if (ssrAdapter2) {
      ssrAdapter2.adapter(id, style2 !== null && style2 !== void 0 ? style2 : node.render(props));
      return;
    }
    const queriedTarget = queryElement(id);
    if (queriedTarget !== null && !force) {
      return queriedTarget;
    }
    const target = queriedTarget !== null && queriedTarget !== void 0 ? queriedTarget : createElement(id);
    if (style2 === void 0)
      style2 = node.render(props);
    target.textContent = style2;
    if (queriedTarget !== null)
      return queriedTarget;
    if (anchorMetaName) {
      const anchorMetaEl = document.head.querySelector(`meta[name="${anchorMetaName}"]`);
      if (anchorMetaEl) {
        document.head.insertBefore(target, anchorMetaEl);
        addElementToList(node.els, target);
        return target;
      }
    }
    if (head) {
      document.head.insertBefore(target, document.head.querySelector("style, link"));
    } else {
      document.head.appendChild(target);
    }
    addElementToList(node.els, target);
    return target;
  }
  function wrappedRender(props) {
    return render(this, this.instance, props);
  }
  function wrappedMount(options = {}) {
    const { id, ssr, props, head = false, silent = false, force = false, anchorMetaName } = options;
    const targetElement = mount(this.instance, this, id, props, head, silent, force, anchorMetaName, ssr);
    return targetElement;
  }
  function wrappedUnmount(options = {}) {
    const { id } = options;
    unmount(this.instance, this, id);
  }
  const createCNode = function(instance, $, props, children) {
    return {
      instance,
      $,
      props,
      children,
      els: [],
      render: wrappedRender,
      mount: wrappedMount,
      unmount: wrappedUnmount
    };
  };
  const c$1 = function(instance, $, props, children) {
    if (Array.isArray($)) {
      return createCNode(instance, { $: null }, null, $);
    } else if (Array.isArray(props)) {
      return createCNode(instance, $, null, props);
    } else if (Array.isArray(children)) {
      return createCNode(instance, $, props, children);
    } else {
      return createCNode(instance, $, props, null);
    }
  };
  function CssRender(config = {}) {
    let styleSheet = null;
    const cssr2 = {
      c: (...args) => c$1(cssr2, ...args),
      use: (plugin2, ...args) => plugin2.install(cssr2, ...args),
      find: queryElement,
      context: {},
      config,
      get __styleSheet() {
        if (!styleSheet) {
          const style2 = document.createElement("style");
          document.head.appendChild(style2);
          styleSheet = document.styleSheets[document.styleSheets.length - 1];
          return styleSheet;
        }
        return styleSheet;
      }
    };
    return cssr2;
  }
  function plugin$1(options) {
    let _bPrefix = ".";
    let _ePrefix = "__";
    let _mPrefix = "--";
    let c2;
    if (options) {
      let t = options.blockPrefix;
      if (t) {
        _bPrefix = t;
      }
      t = options.elementPrefix;
      if (t) {
        _ePrefix = t;
      }
      t = options.modifierPrefix;
      if (t) {
        _mPrefix = t;
      }
    }
    const _plugin = {
      install(instance) {
        c2 = instance.c;
        const ctx = instance.context;
        ctx.bem = {};
        ctx.bem.b = null;
        ctx.bem.els = null;
      }
    };
    function b(arg) {
      let memorizedB;
      let memorizedE;
      return {
        before(ctx) {
          memorizedB = ctx.bem.b;
          memorizedE = ctx.bem.els;
          ctx.bem.els = null;
        },
        after(ctx) {
          ctx.bem.b = memorizedB;
          ctx.bem.els = memorizedE;
        },
        $({ context, props }) {
          arg = typeof arg === "string" ? arg : arg({ context, props });
          context.bem.b = arg;
          return `${(props === null || props === void 0 ? void 0 : props.bPrefix) || _bPrefix}${context.bem.b}`;
        }
      };
    }
    function e(arg) {
      let memorizedE;
      return {
        before(ctx) {
          memorizedE = ctx.bem.els;
        },
        after(ctx) {
          ctx.bem.els = memorizedE;
        },
        $({ context, props }) {
          arg = typeof arg === "string" ? arg : arg({ context, props });
          context.bem.els = arg.split(",").map((v) => v.trim());
          return context.bem.els.map((el) => `${(props === null || props === void 0 ? void 0 : props.bPrefix) || _bPrefix}${context.bem.b}${_ePrefix}${el}`).join(", ");
        }
      };
    }
    function m(arg) {
      return {
        $({ context, props }) {
          arg = typeof arg === "string" ? arg : arg({ context, props });
          const modifiers = arg.split(",").map((v) => v.trim());
          function elementToSelector(el) {
            return modifiers.map((modifier) => `&${(props === null || props === void 0 ? void 0 : props.bPrefix) || _bPrefix}${context.bem.b}${el !== void 0 ? `${_ePrefix}${el}` : ""}${_mPrefix}${modifier}`).join(", ");
          }
          const els = context.bem.els;
          if (els !== null) {
            return elementToSelector(els[0]);
          } else {
            return elementToSelector();
          }
        }
      };
    }
    function notM(arg) {
      return {
        $({ context, props }) {
          arg = typeof arg === "string" ? arg : arg({ context, props });
          const els = context.bem.els;
          return `&:not(${(props === null || props === void 0 ? void 0 : props.bPrefix) || _bPrefix}${context.bem.b}${els !== null && els.length > 0 ? `${_ePrefix}${els[0]}` : ""}${_mPrefix}${arg})`;
        }
      };
    }
    const cB2 = (...args) => c2(b(args[0]), args[1], args[2]);
    const cE2 = (...args) => c2(e(args[0]), args[1], args[2]);
    const cM2 = (...args) => c2(m(args[0]), args[1], args[2]);
    const cNotM2 = (...args) => c2(notM(args[0]), args[1], args[2]);
    Object.assign(_plugin, {
      cB: cB2,
      cE: cE2,
      cM: cM2,
      cNotM: cNotM2
    });
    return _plugin;
  }
  function createKey(prefix2, suffix2) {
    return prefix2 + (suffix2 === "default" ? "" : suffix2.replace(/^[a-z]/, (startChar) => startChar.toUpperCase()));
  }
  createKey("abc", "def");
  const namespace = "n";
  const prefix = `.${namespace}-`;
  const elementPrefix = "__";
  const modifierPrefix = "--";
  const cssr = CssRender();
  const plugin = plugin$1({
    blockPrefix: prefix,
    elementPrefix,
    modifierPrefix
  });
  cssr.use(plugin);
  const { c, find } = cssr;
  const { cB, cE, cM, cNotM } = plugin;
  function useMergedState(controlledStateRef, uncontrolledStateRef) {
    vue.watch(controlledStateRef, (value) => {
      if (value !== void 0) {
        uncontrolledStateRef.value = value;
      }
    });
    return vue.computed(() => {
      if (controlledStateRef.value === void 0) {
        return uncontrolledStateRef.value;
      }
      return controlledStateRef.value;
    });
  }
  function isMounted() {
    const isMounted2 = vue.ref(false);
    vue.onMounted(() => {
      isMounted2.value = true;
    });
    return vue.readonly(isMounted2);
  }
  const formItemInjectionKey = createInjectionKey("n-form-item");
  function useFormItem(props, { defaultSize = "medium", mergedSize, mergedDisabled } = {}) {
    const NFormItem = vue.inject(formItemInjectionKey, null);
    vue.provide(formItemInjectionKey, null);
    const mergedSizeRef = vue.computed(mergedSize ? () => mergedSize(NFormItem) : () => {
      const { size } = props;
      if (size)
        return size;
      if (NFormItem) {
        const { mergedSize: mergedSize2 } = NFormItem;
        if (mergedSize2.value !== void 0) {
          return mergedSize2.value;
        }
      }
      return defaultSize;
    });
    const mergedDisabledRef = vue.computed(mergedDisabled ? () => mergedDisabled(NFormItem) : () => {
      const { disabled } = props;
      if (disabled !== void 0) {
        return disabled;
      }
      if (NFormItem) {
        return NFormItem.disabled.value;
      }
      return false;
    });
    const mergedStatusRef = vue.computed(() => {
      const { status } = props;
      if (status)
        return status;
      return NFormItem === null || NFormItem === void 0 ? void 0 : NFormItem.mergedValidationStatus.value;
    });
    vue.onBeforeUnmount(() => {
      if (NFormItem) {
        NFormItem.restoreValidation();
      }
    });
    return {
      mergedSizeRef,
      mergedDisabledRef,
      mergedStatusRef,
      nTriggerFormBlur() {
        if (NFormItem) {
          NFormItem.handleContentBlur();
        }
      },
      nTriggerFormChange() {
        if (NFormItem) {
          NFormItem.handleContentChange();
        }
      },
      nTriggerFormFocus() {
        if (NFormItem) {
          NFormItem.handleContentFocus();
        }
      },
      nTriggerFormInput() {
        if (NFormItem) {
          NFormItem.handleContentInput();
        }
      }
    };
  }
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeGlobal$1 = freeGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal$1 || freeSelf || Function("return this")();
  var root$1 = root;
  var Symbol$1 = root$1.Symbol;
  var Symbol$2 = Symbol$1;
  var objectProto$a = Object.prototype;
  var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$a.toString;
  var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty$8.call(value, symToStringTag$1), tag = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }
  var objectProto$9 = Object.prototype;
  var nativeObjectToString = objectProto$9.toString;
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  var isArray = Array.isArray;
  var isArray$1 = isArray;
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  function identity(value) {
    return value;
  }
  var asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  var coreJsData = root$1["__core-js_shared__"];
  var coreJsData$1 = coreJsData;
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  var funcProto$2 = Function.prototype;
  var funcToString$2 = funcProto$2.toString;
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString$2.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto$1 = Function.prototype, objectProto$8 = Object.prototype;
  var funcToString$1 = funcProto$1.toString;
  var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
  var reIsNative = RegExp("^" + funcToString$1.call(hasOwnProperty$7).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function getValue(object, key2) {
    return object == null ? void 0 : object[key2];
  }
  function getNative(object, key2) {
    var value = getValue(object, key2);
    return baseIsNative(value) ? value : void 0;
  }
  var objectCreate = Object.create;
  var baseCreate = function() {
    function object() {
    }
    return function(proto) {
      if (!isObject(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object();
      object.prototype = void 0;
      return result;
    };
  }();
  var baseCreate$1 = baseCreate;
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);
      case 1:
        return func.call(thisArg, args[0]);
      case 2:
        return func.call(thisArg, args[0], args[1]);
      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }
  function copyArray(source, array) {
    var index = -1, length = source.length;
    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }
  var HOT_COUNT = 800, HOT_SPAN = 16;
  var nativeNow = Date.now;
  function shortOut(func) {
    var count = 0, lastCalled = 0;
    return function() {
      var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(void 0, arguments);
    };
  }
  function constant(value) {
    return function() {
      return value;
    };
  }
  var defineProperty = function() {
    try {
      var func = getNative(Object, "defineProperty");
      func({}, "", {});
      return func;
    } catch (e) {
    }
  }();
  var defineProperty$1 = defineProperty;
  var baseSetToString = !defineProperty$1 ? identity : function(func, string) {
    return defineProperty$1(func, "toString", {
      "configurable": true,
      "enumerable": false,
      "value": constant(string),
      "writable": true
    });
  };
  var baseSetToString$1 = baseSetToString;
  var setToString = shortOut(baseSetToString$1);
  var setToString$1 = setToString;
  var MAX_SAFE_INTEGER$1 = 9007199254740991;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER$1 : length;
    return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function baseAssignValue(object, key2, value) {
    if (key2 == "__proto__" && defineProperty$1) {
      defineProperty$1(object, key2, {
        "configurable": true,
        "enumerable": true,
        "value": value,
        "writable": true
      });
    } else {
      object[key2] = value;
    }
  }
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  var objectProto$7 = Object.prototype;
  var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
  function assignValue(object, key2, value) {
    var objValue = object[key2];
    if (!(hasOwnProperty$6.call(object, key2) && eq(objValue, value)) || value === void 0 && !(key2 in object)) {
      baseAssignValue(object, key2, value);
    }
  }
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
    var index = -1, length = props.length;
    while (++index < length) {
      var key2 = props[index];
      var newValue = customizer ? customizer(object[key2], source[key2], key2, object, source) : void 0;
      if (newValue === void 0) {
        newValue = source[key2];
      }
      if (isNew) {
        baseAssignValue(object, key2, newValue);
      } else {
        assignValue(object, key2, newValue);
      }
    }
    return object;
  }
  var nativeMax = Math.max;
  function overRest(func, start, transform) {
    start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
    return function() {
      var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }
  function baseRest(func, start) {
    return setToString$1(overRest(func, start, identity), func + "");
  }
  var MAX_SAFE_INTEGER = 9007199254740991;
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
      return eq(object[index], value);
    }
    return false;
  }
  function createAssigner(assigner) {
    return baseRest(function(object, sources) {
      var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
      customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? void 0 : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }
  var objectProto$6 = Object.prototype;
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$6;
    return value === proto;
  }
  function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }
  var argsTag$1 = "[object Arguments]";
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag$1;
  }
  var objectProto$5 = Object.prototype;
  var hasOwnProperty$5 = objectProto$5.hasOwnProperty;
  var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;
  var isArguments = baseIsArguments(function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty$5.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
  };
  var isArguments$1 = isArguments;
  function stubFalse() {
    return false;
  }
  var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
  var Buffer$1 = moduleExports$2 ? root$1.Buffer : void 0;
  var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0;
  var isBuffer = nativeIsBuffer || stubFalse;
  var isBuffer$1 = isBuffer;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag$1 = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
  var freeProcess = moduleExports$1 && freeGlobal$1.process;
  var nodeUtil = function() {
    try {
      var types = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
      if (types) {
        return types;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  var nodeUtil$1 = nodeUtil;
  var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray;
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  var isTypedArray$1 = isTypedArray;
  var objectProto$4 = Object.prototype;
  var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray$1(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$1(value), isType = !isArr && !isArg && !isBuff && isTypedArray$1(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for (var key2 in value) {
      if ((inherited || hasOwnProperty$4.call(value, key2)) && !(skipIndexes && (key2 == "length" || isBuff && (key2 == "offset" || key2 == "parent") || isType && (key2 == "buffer" || key2 == "byteLength" || key2 == "byteOffset") || isIndex(key2, length)))) {
        result.push(key2);
      }
    }
    return result;
  }
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key2 in Object(object)) {
        result.push(key2);
      }
    }
    return result;
  }
  var objectProto$3 = Object.prototype;
  var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
  function baseKeysIn(object) {
    if (!isObject(object)) {
      return nativeKeysIn(object);
    }
    var isProto = isPrototype(object), result = [];
    for (var key2 in object) {
      if (!(key2 == "constructor" && (isProto || !hasOwnProperty$3.call(object, key2)))) {
        result.push(key2);
      }
    }
    return result;
  }
  function keysIn(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  }
  var nativeCreate = getNative(Object, "create");
  var nativeCreate$1 = nativeCreate;
  function hashClear() {
    this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
    this.size = 0;
  }
  function hashDelete(key2) {
    var result = this.has(key2) && delete this.__data__[key2];
    this.size -= result ? 1 : 0;
    return result;
  }
  var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
  var objectProto$2 = Object.prototype;
  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
  function hashGet(key2) {
    var data = this.__data__;
    if (nativeCreate$1) {
      var result = data[key2];
      return result === HASH_UNDEFINED$1 ? void 0 : result;
    }
    return hasOwnProperty$2.call(data, key2) ? data[key2] : void 0;
  }
  var objectProto$1 = Object.prototype;
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
  function hashHas(key2) {
    var data = this.__data__;
    return nativeCreate$1 ? data[key2] !== void 0 : hasOwnProperty$1.call(data, key2);
  }
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function hashSet(key2, value) {
    var data = this.__data__;
    this.size += this.has(key2) ? 0 : 1;
    data[key2] = nativeCreate$1 && value === void 0 ? HASH_UNDEFINED : value;
    return this;
  }
  function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  function assocIndexOf(array, key2) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key2)) {
        return length;
      }
    }
    return -1;
  }
  var arrayProto = Array.prototype;
  var splice = arrayProto.splice;
  function listCacheDelete(key2) {
    var data = this.__data__, index = assocIndexOf(data, key2);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  function listCacheGet(key2) {
    var data = this.__data__, index = assocIndexOf(data, key2);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key2) {
    return assocIndexOf(this.__data__, key2) > -1;
  }
  function listCacheSet(key2, value) {
    var data = this.__data__, index = assocIndexOf(data, key2);
    if (index < 0) {
      ++this.size;
      data.push([key2, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  var Map = getNative(root$1, "Map");
  var Map$1 = Map;
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map$1 || ListCache)(),
      "string": new Hash()
    };
  }
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function getMapData(map, key2) {
    var data = map.__data__;
    return isKeyable(key2) ? data[typeof key2 == "string" ? "string" : "hash"] : data.map;
  }
  function mapCacheDelete(key2) {
    var result = getMapData(this, key2)["delete"](key2);
    this.size -= result ? 1 : 0;
    return result;
  }
  function mapCacheGet(key2) {
    return getMapData(this, key2).get(key2);
  }
  function mapCacheHas(key2) {
    return getMapData(this, key2).has(key2);
  }
  function mapCacheSet(key2, value) {
    var data = getMapData(this, key2), size = data.size;
    data.set(key2, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
  function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  var getPrototype = overArg(Object.getPrototypeOf, Object);
  var getPrototype$1 = getPrototype;
  var objectTag = "[object Object]";
  var funcProto = Function.prototype, objectProto = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var objectCtorString = funcToString.call(Object);
  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
      return false;
    }
    var proto = getPrototype$1(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
    return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
  }
  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }
  function stackDelete(key2) {
    var data = this.__data__, result = data["delete"](key2);
    this.size = data.size;
    return result;
  }
  function stackGet(key2) {
    return this.__data__.get(key2);
  }
  function stackHas(key2) {
    return this.__data__.has(key2);
  }
  var LARGE_ARRAY_SIZE = 200;
  function stackSet(key2, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key2, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key2, value);
    this.size = data.size;
    return this;
  }
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer = moduleExports ? root$1.Buffer : void 0, allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }
  var Uint8Array = root$1.Uint8Array;
  var Uint8Array$1 = Uint8Array;
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
    return result;
  }
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }
  function initCloneObject(object) {
    return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate$1(getPrototype$1(object)) : {};
  }
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
      while (length--) {
        var key2 = props[fromRight ? length : ++index];
        if (iteratee(iterable[key2], key2, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }
  var baseFor = createBaseFor();
  var baseFor$1 = baseFor;
  function assignMergeValue(object, key2, value) {
    if (value !== void 0 && !eq(object[key2], value) || value === void 0 && !(key2 in object)) {
      baseAssignValue(object, key2, value);
    }
  }
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }
  function safeGet(object, key2) {
    if (key2 === "constructor" && typeof object[key2] === "function") {
      return;
    }
    if (key2 == "__proto__") {
      return;
    }
    return object[key2];
  }
  function toPlainObject(value) {
    return copyObject(value, keysIn(value));
  }
  function baseMergeDeep(object, source, key2, srcIndex, mergeFunc, customizer, stack) {
    var objValue = safeGet(object, key2), srcValue = safeGet(source, key2), stacked = stack.get(srcValue);
    if (stacked) {
      assignMergeValue(object, key2, stacked);
      return;
    }
    var newValue = customizer ? customizer(objValue, srcValue, key2 + "", object, source, stack) : void 0;
    var isCommon = newValue === void 0;
    if (isCommon) {
      var isArr = isArray$1(srcValue), isBuff = !isArr && isBuffer$1(srcValue), isTyped = !isArr && !isBuff && isTypedArray$1(srcValue);
      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray$1(objValue)) {
          newValue = objValue;
        } else if (isArrayLikeObject(objValue)) {
          newValue = copyArray(objValue);
        } else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer(srcValue, true);
        } else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray(srcValue, true);
        } else {
          newValue = [];
        }
      } else if (isPlainObject(srcValue) || isArguments$1(srcValue)) {
        newValue = objValue;
        if (isArguments$1(objValue)) {
          newValue = toPlainObject(objValue);
        } else if (!isObject(objValue) || isFunction(objValue)) {
          newValue = initCloneObject(srcValue);
        }
      } else {
        isCommon = false;
      }
    }
    if (isCommon) {
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack["delete"](srcValue);
    }
    assignMergeValue(object, key2, newValue);
  }
  function baseMerge(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }
    baseFor$1(source, function(srcValue, key2) {
      stack || (stack = new Stack());
      if (isObject(srcValue)) {
        baseMergeDeep(object, source, key2, srcIndex, baseMerge, customizer, stack);
      } else {
        var newValue = customizer ? customizer(safeGet(object, key2), srcValue, key2 + "", object, source, stack) : void 0;
        if (newValue === void 0) {
          newValue = srcValue;
        }
        assignMergeValue(object, key2, newValue);
      }
    }, keysIn);
  }
  var merge = createAssigner(function(object, source, srcIndex) {
    baseMerge(object, source, srcIndex);
  });
  var merge$1 = merge;
  const ssrContextKey = Symbol("@css-render/vue3-ssr");
  function createStyleString(id, style2) {
    return `<style cssr-id="${id}">
${style2}
</style>`;
  }
  function ssrAdapter(id, style2) {
    const ssrContext = vue.inject(ssrContextKey, null);
    if (ssrContext === null) {
      console.error("[css-render/vue3-ssr]: no ssr context found.");
      return;
    }
    const { styles, ids } = ssrContext;
    if (ids.has(id))
      return;
    if (styles !== null) {
      ids.add(id);
      styles.push(createStyleString(id, style2));
    }
  }
  function useSsrAdapter() {
    const context = vue.inject(ssrContextKey, null);
    if (context === null)
      return void 0;
    return {
      adapter: ssrAdapter,
      context
    };
  }
  var commonVariables = {
    fontFamily: 'v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    fontFamilyMono: "v-mono, SFMono-Regular, Menlo, Consolas, Courier, monospace",
    fontWeight: "400",
    fontWeightStrong: "500",
    cubicBezierEaseInOut: "cubic-bezier(.4, 0, .2, 1)",
    cubicBezierEaseOut: "cubic-bezier(0, 0, .2, 1)",
    cubicBezierEaseIn: "cubic-bezier(.4, 0, 1, 1)",
    borderRadius: "3px",
    borderRadiusSmall: "2px",
    fontSize: "14px",
    fontSizeTiny: "12px",
    fontSizeSmall: "14px",
    fontSizeMedium: "14px",
    fontSizeLarge: "15px",
    fontSizeHuge: "16px",
    lineHeight: "1.6",
    heightTiny: "22px",
    heightSmall: "28px",
    heightMedium: "34px",
    heightLarge: "40px",
    heightHuge: "46px",
    transformDebounceScale: "scale(1)"
  };
  const {
    fontSize,
    fontFamily,
    lineHeight
  } = commonVariables;
  var globalStyle = c("body", `
 margin: 0;
 font-size: ${fontSize};
 font-family: ${fontFamily};
 line-height: ${lineHeight};
 -webkit-text-size-adjust: 100%;
 -webkit-tap-highlight-color: transparent;
`, [c("input", `
 font-family: inherit;
 font-size: inherit;
 `)]);
  const configProviderInjectionKey = createInjectionKey("n-config-provider");
  const cssrAnchorMetaName = "naive-ui-style";
  function useTheme(resolveId, mountId, style2, defaultTheme, props, clsPrefixRef) {
    const ssrAdapter2 = useSsrAdapter();
    if (style2) {
      const mountStyle = () => {
        const clsPrefix = clsPrefixRef === null || clsPrefixRef === void 0 ? void 0 : clsPrefixRef.value;
        style2.mount({
          id: clsPrefix === void 0 ? mountId : clsPrefix + mountId,
          head: true,
          props: {
            bPrefix: clsPrefix ? `.${clsPrefix}-` : void 0
          },
          anchorMetaName: cssrAnchorMetaName,
          ssr: ssrAdapter2
        });
        globalStyle.mount({
          id: "n-global",
          head: true,
          anchorMetaName: cssrAnchorMetaName,
          ssr: ssrAdapter2
        });
      };
      if (ssrAdapter2) {
        mountStyle();
      } else {
        vue.onBeforeMount(mountStyle);
      }
    }
    const NConfigProvider = vue.inject(configProviderInjectionKey, null);
    const mergedThemeRef = vue.computed(() => {
      var _a2;
      const { theme: { common: selfCommon, self: self2, peers = {} } = {}, themeOverrides: selfOverrides = {}, builtinThemeOverrides: builtinOverrides = {} } = props;
      const { common: selfCommonOverrides, peers: peersOverrides } = selfOverrides;
      const { common: globalCommon = void 0, [resolveId]: { common: globalSelfCommon = void 0, self: globalSelf = void 0, peers: globalPeers = {} } = {} } = (NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedThemeRef.value) || {};
      const { common: globalCommonOverrides = void 0, [resolveId]: globalSelfOverrides = {} } = (NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedThemeOverridesRef.value) || {};
      const { common: globalSelfCommonOverrides, peers: globalPeersOverrides = {} } = globalSelfOverrides;
      const mergedCommon = merge$1({}, selfCommon || globalSelfCommon || globalCommon || defaultTheme.common, globalCommonOverrides, globalSelfCommonOverrides, selfCommonOverrides);
      const mergedSelf = merge$1((_a2 = self2 || globalSelf || defaultTheme.self) === null || _a2 === void 0 ? void 0 : _a2(mergedCommon), builtinOverrides, globalSelfOverrides, selfOverrides);
      return {
        common: mergedCommon,
        self: mergedSelf,
        peers: merge$1({}, defaultTheme.peers, globalPeers, peers),
        peerOverrides: merge$1({}, globalPeersOverrides, peersOverrides)
      };
    });
    return mergedThemeRef;
  }
  useTheme.props = {
    theme: Object,
    themeOverrides: Object,
    builtinThemeOverrides: Object
  };
  const defaultClsPrefix = "n";
  function useConfig(props = {}, options = {
    defaultBordered: true
  }) {
    const NConfigProvider = vue.inject(configProviderInjectionKey, null);
    return {
      inlineThemeDisabled: NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.inlineThemeDisabled,
      mergedRtlRef: NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedRtlRef,
      mergedComponentPropsRef: NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedComponentPropsRef,
      mergedBreakpointsRef: NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedBreakpointsRef,
      mergedBorderedRef: vue.computed(() => {
        var _a2, _b;
        const { bordered } = props;
        if (bordered !== void 0)
          return bordered;
        return (_b = (_a2 = NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedBorderedRef.value) !== null && _a2 !== void 0 ? _a2 : options.defaultBordered) !== null && _b !== void 0 ? _b : true;
      }),
      mergedClsPrefixRef: vue.computed(() => {
        const clsPrefix = NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedClsPrefixRef.value;
        return clsPrefix || defaultClsPrefix;
      }),
      namespaceRef: vue.computed(() => NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedNamespaceRef.value)
    };
  }
  function useStyle(mountId, style2, clsPrefixRef) {
    if (!style2) {
      return;
    }
    const ssrAdapter2 = useSsrAdapter();
    const mountStyle = () => {
      const clsPrefix = clsPrefixRef === null || clsPrefixRef === void 0 ? void 0 : clsPrefixRef.value;
      style2.mount({
        id: clsPrefix === void 0 ? mountId : clsPrefix + mountId,
        head: true,
        anchorMetaName: cssrAnchorMetaName,
        props: {
          bPrefix: clsPrefix ? `.${clsPrefix}-` : void 0
        },
        ssr: ssrAdapter2
      });
      globalStyle.mount({
        id: "n-global",
        head: true,
        anchorMetaName: cssrAnchorMetaName,
        ssr: ssrAdapter2
      });
    };
    if (ssrAdapter2) {
      mountStyle();
    } else {
      vue.onBeforeMount(mountStyle);
    }
  }
  function useThemeClass(componentName, hashRef, cssVarsRef, props) {
    var _a2;
    if (!cssVarsRef)
      throwError("useThemeClass", "cssVarsRef is not passed");
    const mergedThemeHashRef = (_a2 = vue.inject(configProviderInjectionKey, null)) === null || _a2 === void 0 ? void 0 : _a2.mergedThemeHashRef;
    const themeClassRef = vue.ref("");
    const ssrAdapter2 = useSsrAdapter();
    let renderCallback;
    const hashClassPrefix = `__${componentName}`;
    const mountStyle = () => {
      let finalThemeHash = hashClassPrefix;
      const hashValue = hashRef ? hashRef.value : void 0;
      const themeHash = mergedThemeHashRef === null || mergedThemeHashRef === void 0 ? void 0 : mergedThemeHashRef.value;
      if (themeHash)
        finalThemeHash += "-" + themeHash;
      if (hashValue)
        finalThemeHash += "-" + hashValue;
      const { themeOverrides, builtinThemeOverrides } = props;
      if (themeOverrides) {
        finalThemeHash += "-" + murmur2(JSON.stringify(themeOverrides));
      }
      if (builtinThemeOverrides) {
        finalThemeHash += "-" + murmur2(JSON.stringify(builtinThemeOverrides));
      }
      themeClassRef.value = finalThemeHash;
      renderCallback = () => {
        const cssVars = cssVarsRef.value;
        let style2 = "";
        for (const key2 in cssVars) {
          style2 += `${key2}: ${cssVars[key2]};`;
        }
        c(`.${finalThemeHash}`, style2).mount({
          id: finalThemeHash,
          ssr: ssrAdapter2
        });
        renderCallback = void 0;
      };
    };
    vue.watchEffect(() => {
      mountStyle();
    });
    return {
      themeClass: themeClassRef,
      onRender: () => {
        renderCallback === null || renderCallback === void 0 ? void 0 : renderCallback();
      }
    };
  }
  var NIconSwitchTransition = vue.defineComponent({
    name: "BaseIconSwitchTransition",
    setup(_2, { slots }) {
      const isMountedRef = isMounted();
      return () => vue.h(vue.Transition, { name: "icon-switch-transition", appear: isMountedRef.value }, slots);
    }
  });
  const {
    cubicBezierEaseInOut,
    transformDebounceScale
  } = commonVariables;
  function createIconSwitchTransition({
    originalTransform = "",
    left = 0,
    top = 0,
    transition = `all .3s ${cubicBezierEaseInOut} !important`
  } = {}) {
    return [c("&.icon-switch-transition-enter-from, &.icon-switch-transition-leave-to", {
      transform: originalTransform + " scale(0.75)",
      left,
      top,
      opacity: 0
    }), c("&.icon-switch-transition-enter-to, &.icon-switch-transition-leave-from", {
      transform: `${transformDebounceScale} ${originalTransform}`,
      left,
      top,
      opacity: 1
    }), c("&.icon-switch-transition-enter-active, &.icon-switch-transition-leave-active", {
      transformOrigin: "center",
      position: "absolute",
      left,
      top,
      transition
    })];
  }
  var style$1 = c([c("@keyframes loading-container-rotate", `
 to {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
 }
 `), c("@keyframes loading-layer-rotate", `
 12.5% {
 -webkit-transform: rotate(135deg);
 transform: rotate(135deg);
 }
 25% {
 -webkit-transform: rotate(270deg);
 transform: rotate(270deg);
 }
 37.5% {
 -webkit-transform: rotate(405deg);
 transform: rotate(405deg);
 }
 50% {
 -webkit-transform: rotate(540deg);
 transform: rotate(540deg);
 }
 62.5% {
 -webkit-transform: rotate(675deg);
 transform: rotate(675deg);
 }
 75% {
 -webkit-transform: rotate(810deg);
 transform: rotate(810deg);
 }
 87.5% {
 -webkit-transform: rotate(945deg);
 transform: rotate(945deg);
 }
 100% {
 -webkit-transform: rotate(1080deg);
 transform: rotate(1080deg);
 } 
 `), c("@keyframes loading-left-spin", `
 from {
 -webkit-transform: rotate(265deg);
 transform: rotate(265deg);
 }
 50% {
 -webkit-transform: rotate(130deg);
 transform: rotate(130deg);
 }
 to {
 -webkit-transform: rotate(265deg);
 transform: rotate(265deg);
 }
 `), c("@keyframes loading-right-spin", `
 from {
 -webkit-transform: rotate(-265deg);
 transform: rotate(-265deg);
 }
 50% {
 -webkit-transform: rotate(-130deg);
 transform: rotate(-130deg);
 }
 to {
 -webkit-transform: rotate(-265deg);
 transform: rotate(-265deg);
 }
 `), cB("base-loading", `
 position: relative;
 line-height: 0;
 width: 1em;
 height: 1em;
 `, [cE("transition-wrapper", `
 position: absolute;
 width: 100%;
 height: 100%;
 `, [createIconSwitchTransition()]), cE("container", `
 display: inline-flex;
 position: relative;
 direction: ltr;
 line-height: 0;
 animation: loading-container-rotate 1568.2352941176ms linear infinite;
 font-size: 0;
 letter-spacing: 0;
 white-space: nowrap;
 opacity: 1;
 width: 100%;
 height: 100%;
 `, [cE("svg", `
 stroke: var(--n-text-color);
 fill: transparent;
 position: absolute;
 height: 100%;
 overflow: hidden;
 `), cE("container-layer", `
 position: absolute;
 width: 100%;
 height: 100%;
 animation: loading-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 `, [cE("container-layer-left", `
 display: inline-flex;
 position: relative;
 width: 50%;
 height: 100%;
 overflow: hidden;
 `, [cE("svg", `
 animation: loading-left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 width: 200%;
 `)]), cE("container-layer-patch", `
 position: absolute;
 top: 0;
 left: 47.5%;
 box-sizing: border-box;
 width: 5%;
 height: 100%;
 overflow: hidden;
 `, [cE("svg", `
 left: -900%;
 width: 2000%;
 transform: rotate(180deg);
 `)]), cE("container-layer-right", `
 display: inline-flex;
 position: relative;
 width: 50%;
 height: 100%;
 overflow: hidden;
 `, [cE("svg", `
 animation: loading-right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 left: -100%;
 width: 200%;
 `)])])]), cE("placeholder", `
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `, [createIconSwitchTransition({
    left: "50%",
    top: "50%",
    originalTransform: "translateX(-50%) translateY(-50%)"
  })])])]);
  var NBaseLoading = vue.defineComponent({
    name: "BaseLoading",
    props: {
      clsPrefix: {
        type: String,
        required: true
      },
      scale: {
        type: Number,
        default: 1
      },
      radius: {
        type: Number,
        default: 100
      },
      strokeWidth: {
        type: Number,
        default: 28
      },
      stroke: {
        type: String,
        default: void 0
      },
      show: {
        type: Boolean,
        default: true
      }
    },
    setup(props) {
      useStyle("-base-loading", style$1, vue.toRef(props, "clsPrefix"));
    },
    render() {
      const { clsPrefix, radius, strokeWidth, stroke, scale } = this;
      const scaledRadius = radius / scale;
      return vue.h("div", { class: `${clsPrefix}-base-loading`, role: "img", "aria-label": "loading" }, vue.h(NIconSwitchTransition, null, {
        default: () => this.show ? vue.h("div", { key: "icon", class: `${clsPrefix}-base-loading__transition-wrapper` }, vue.h("div", { class: `${clsPrefix}-base-loading__container` }, vue.h("div", { class: `${clsPrefix}-base-loading__container-layer` }, vue.h("div", { class: `${clsPrefix}-base-loading__container-layer-left` }, vue.h("svg", { class: `${clsPrefix}-base-loading__svg`, viewBox: `0 0 ${2 * scaledRadius} ${2 * scaledRadius}`, xmlns: "http://www.w3.org/2000/svg", style: { color: stroke } }, vue.h("circle", { fill: "none", stroke: "currentColor", "stroke-width": strokeWidth, "stroke-linecap": "round", cx: scaledRadius, cy: scaledRadius, r: radius - strokeWidth / 2, "stroke-dasharray": 4.91 * radius, "stroke-dashoffset": 2.46 * radius }))), vue.h("div", { class: `${clsPrefix}-base-loading__container-layer-patch` }, vue.h("svg", { class: `${clsPrefix}-base-loading__svg`, viewBox: `0 0 ${2 * scaledRadius} ${2 * scaledRadius}`, xmlns: "http://www.w3.org/2000/svg", style: { color: stroke } }, vue.h("circle", { fill: "none", stroke: "currentColor", "stroke-width": strokeWidth, "stroke-linecap": "round", cx: scaledRadius, cy: scaledRadius, r: radius - strokeWidth / 2, "stroke-dasharray": 4.91 * radius, "stroke-dashoffset": 2.46 * radius }))), vue.h("div", { class: `${clsPrefix}-base-loading__container-layer-right` }, vue.h("svg", { class: `${clsPrefix}-base-loading__svg`, viewBox: `0 0 ${2 * scaledRadius} ${2 * scaledRadius}`, xmlns: "http://www.w3.org/2000/svg", style: { color: stroke } }, vue.h("circle", { fill: "none", stroke: "currentColor", "stroke-width": strokeWidth, "stroke-linecap": "round", cx: scaledRadius, cy: scaledRadius, r: radius - strokeWidth / 2, "stroke-dasharray": 4.91 * radius, "stroke-dashoffset": 2.46 * radius })))))) : vue.h("div", { key: "placeholder", class: `${clsPrefix}-base-loading__placeholder` }, this.$slots)
      }));
    }
  });
  const base = {
    neutralBase: "#FFF",
    neutralInvertBase: "#000",
    neutralTextBase: "#000",
    neutralPopover: "#fff",
    neutralCard: "#fff",
    neutralModal: "#fff",
    neutralBody: "#fff",
    alpha1: "0.82",
    alpha2: "0.72",
    alpha3: "0.38",
    alpha4: "0.24",
    alpha5: "0.18",
    alphaClose: "0.52",
    alphaDisabled: "0.5",
    alphaDisabledInput: "0.02",
    alphaPending: "0.05",
    alphaTablePending: "0.02",
    alphaPressed: "0.07",
    alphaAvatar: "0.2",
    alphaRail: "0.14",
    alphaProgressRail: ".08",
    alphaBorder: "0.12",
    alphaDivider: "0.06",
    alphaInput: "0",
    alphaAction: "0.02",
    alphaTab: "0.04",
    alphaScrollbar: "0.25",
    alphaScrollbarHover: "0.4",
    alphaCode: "0.05",
    alphaTag: "0.02",
    primaryHover: "#36ad6a",
    primaryDefault: "#18a058",
    primaryActive: "#0c7a43",
    primarySuppl: "#36ad6a",
    infoHover: "#4098fc",
    infoDefault: "#2080f0",
    infoActive: "#1060c9",
    infoSuppl: "#4098fc",
    errorHover: "#de576d",
    errorDefault: "#d03050",
    errorActive: "#ab1f3f",
    errorSuppl: "#de576d",
    warningHover: "#fcb040",
    warningDefault: "#f0a020",
    warningActive: "#c97c10",
    warningSuppl: "#fcb040",
    successHover: "#36ad6a",
    successDefault: "#18a058",
    successActive: "#0c7a43",
    successSuppl: "#36ad6a"
  };
  const baseBackgroundRgb = rgba(base.neutralBase);
  const baseInvertBackgroundRgb = rgba(base.neutralInvertBase);
  const overlayPrefix = "rgba(" + baseInvertBackgroundRgb.slice(0, 3).join(", ") + ", ";
  function overlay(alpha) {
    return overlayPrefix + String(alpha) + ")";
  }
  function neutral(alpha) {
    const overlayRgba = Array.from(baseInvertBackgroundRgb);
    overlayRgba[3] = Number(alpha);
    return composite(baseBackgroundRgb, overlayRgba);
  }
  const derived = Object.assign(Object.assign({ name: "common" }, commonVariables), {
    baseColor: base.neutralBase,
    primaryColor: base.primaryDefault,
    primaryColorHover: base.primaryHover,
    primaryColorPressed: base.primaryActive,
    primaryColorSuppl: base.primarySuppl,
    infoColor: base.infoDefault,
    infoColorHover: base.infoHover,
    infoColorPressed: base.infoActive,
    infoColorSuppl: base.infoSuppl,
    successColor: base.successDefault,
    successColorHover: base.successHover,
    successColorPressed: base.successActive,
    successColorSuppl: base.successSuppl,
    warningColor: base.warningDefault,
    warningColorHover: base.warningHover,
    warningColorPressed: base.warningActive,
    warningColorSuppl: base.warningSuppl,
    errorColor: base.errorDefault,
    errorColorHover: base.errorHover,
    errorColorPressed: base.errorActive,
    errorColorSuppl: base.errorSuppl,
    textColorBase: base.neutralTextBase,
    textColor1: "rgb(31, 34, 37)",
    textColor2: "rgb(51, 54, 57)",
    textColor3: "rgb(118, 124, 130)",
    textColorDisabled: neutral(base.alpha4),
    placeholderColor: neutral(base.alpha4),
    placeholderColorDisabled: neutral(base.alpha5),
    iconColor: neutral(base.alpha4),
    iconColorHover: scaleColor(neutral(base.alpha4), { lightness: 0.75 }),
    iconColorPressed: scaleColor(neutral(base.alpha4), { lightness: 0.9 }),
    iconColorDisabled: neutral(base.alpha5),
    opacity1: base.alpha1,
    opacity2: base.alpha2,
    opacity3: base.alpha3,
    opacity4: base.alpha4,
    opacity5: base.alpha5,
    dividerColor: "rgb(239, 239, 245)",
    borderColor: "rgb(224, 224, 230)",
    closeColor: neutral(Number(base.alphaClose)),
    closeColorHover: neutral(Number(base.alphaClose) * 1.25),
    closeColorPressed: neutral(Number(base.alphaClose) * 0.8),
    closeColorDisabled: neutral(base.alpha4),
    clearColor: neutral(base.alpha4),
    clearColorHover: scaleColor(neutral(base.alpha4), { lightness: 0.75 }),
    clearColorPressed: scaleColor(neutral(base.alpha4), { lightness: 0.9 }),
    scrollbarColor: overlay(base.alphaScrollbar),
    scrollbarColorHover: overlay(base.alphaScrollbarHover),
    scrollbarWidth: "5px",
    scrollbarHeight: "5px",
    scrollbarBorderRadius: "5px",
    progressRailColor: neutral(base.alphaProgressRail),
    railColor: "rgb(219, 219, 223)",
    popoverColor: base.neutralPopover,
    tableColor: base.neutralCard,
    cardColor: base.neutralCard,
    modalColor: base.neutralModal,
    bodyColor: base.neutralBody,
    tagColor: "rgb(250, 250, 252)",
    avatarColor: neutral(base.alphaAvatar),
    invertedColor: "rgb(0, 20, 40)",
    inputColor: neutral(base.alphaInput),
    codeColor: "rgb(244, 244, 248)",
    tabColor: "rgb(247, 247, 250)",
    actionColor: "rgb(250, 250, 252)",
    tableHeaderColor: "rgb(250, 250, 252)",
    hoverColor: "rgb(243, 243, 245)",
    tableColorHover: "rgba(0, 0, 100, 0.03)",
    tableColorStriped: "rgba(0, 0, 100, 0.02)",
    pressedColor: "rgb(237, 237, 239)",
    opacityDisabled: base.alphaDisabled,
    inputColorDisabled: "rgb(250, 250, 252)",
    buttonColor2: "rgba(46, 51, 56, .05)",
    buttonColor2Hover: "rgba(46, 51, 56, .09)",
    buttonColor2Pressed: "rgba(46, 51, 56, .13)",
    boxShadow1: "0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04)",
    boxShadow2: "0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05)",
    boxShadow3: "0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)"
  });
  var commonLight = derived;
  var commonVars = {
    buttonHeightSmall: "14px",
    buttonHeightMedium: "18px",
    buttonHeightLarge: "22px",
    buttonWidthSmall: "14px",
    buttonWidthMedium: "18px",
    buttonWidthLarge: "22px",
    buttonWidthPressedSmall: "20px",
    buttonWidthPressedMedium: "24px",
    buttonWidthPressedLarge: "28px",
    railHeightSmall: "18px",
    railHeightMedium: "22px",
    railHeightLarge: "26px",
    railWidthSmall: "32px",
    railWidthMedium: "40px",
    railWidthLarge: "48px"
  };
  const self$1 = (vars) => {
    const { primaryColor, opacityDisabled, borderRadius, textColor3 } = vars;
    const railOverlayColor = "rgba(0, 0, 0, .14)";
    return Object.assign(Object.assign({}, commonVars), { iconColor: textColor3, textColor: "white", loadingColor: primaryColor, opacityDisabled, railColor: railOverlayColor, railColorActive: primaryColor, buttonBoxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.3), inset 0 0 1px 0 rgba(0, 0, 0, 0.05)", buttonColor: "#FFF", railBorderRadiusSmall: borderRadius, railBorderRadiusMedium: borderRadius, railBorderRadiusLarge: borderRadius, buttonBorderRadiusSmall: borderRadius, buttonBorderRadiusMedium: borderRadius, buttonBorderRadiusLarge: borderRadius, boxShadowFocus: `0 0 0 2px ${changeColor(primaryColor, { alpha: 0.2 })}` });
  };
  const switchLight = {
    name: "Switch",
    common: commonLight,
    self: self$1
  };
  var switchLight$1 = switchLight;
  var style = cB("switch", `
 height: var(--n-height);
 min-width: var(--n-width);
 vertical-align: middle;
 user-select: none;
 display: inline-flex;
 outline: none;
 justify-content: center;
 align-items: center;
`, [cE("children-placeholder", `
 height: var(--n-rail-height);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: none;
 visibility: hidden;
 `), cE("rail-placeholder", `
 display: flex;
 flex-wrap: none;
 `), cE("button-placeholder", `
 width: calc(1.75 * var(--n-rail-height));
 height: var(--n-rail-height);
 `), cB("base-loading", `
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 font-size: calc(var(--n-button-width) - 4px);
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 `, [createIconSwitchTransition({
    originalTransform: "translateX(-50%) translateY(-50%)"
  })]), cE("checked, unchecked", `
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 box-sizing: border-box;
 position: absolute;
 white-space: nowrap;
 top: 0;
 bottom: 0;
 display: flex;
 align-items: center;
 line-height: 1;
 `), cE("checked", `
 right: 0;
 padding-right: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `), cE("unchecked", `
 left: 0;
 justify-content: flex-end;
 padding-left: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `), c("&:focus", [cE("rail", `
 box-shadow: var(--n-box-shadow-focus);
 `)]), cM("round", [cE("rail", {
    borderRadius: "calc(var(--n-rail-height) / 2)"
  }, [cE("button", {
    borderRadius: "calc(var(--n-button-height) / 2)"
  })])]), cNotM("disabled", [cNotM("icon", [cM("pressed", [cE("rail", [cE("button", {
    maxWidth: "var(--n-button-width-pressed)"
  })])]), cE("rail", [c("&:active", [cE("button", {
    maxWidth: "var(--n-button-width-pressed)"
  })])]), cM("active", [cM("pressed", [cE("rail", [cE("button", {
    left: "calc(100% - var(--n-offset) - var(--n-button-width-pressed))"
  })])]), cE("rail", [c("&:active", [cE("button", {
    left: "calc(100% - var(--n-offset) - var(--n-button-width-pressed))"
  })])])])])]), cM("active", [cE("rail", [cE("button", {
    left: "calc(100% - (var(--n-rail-height) + var(--n-button-width)) / 2)"
  })])]), cE("rail", `
 overflow: hidden;
 height: var(--n-rail-height);
 min-width: var(--n-rail-width);
 border-radius: var(--n-rail-border-radius);
 cursor: pointer;
 position: relative;
 transition:
 background .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-rail-color);
 `, [cE("button-icon", `
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 font-size: calc(var(--n-button-height) - 4px);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 justify-content: center;
 align-items: center;
 line-height: 1;
 `, [createIconSwitchTransition()]), cE("button", `
 align-items: center; 
 top: var(--n-offset);
 left: var(--n-offset);
 height: var(--n-button-width);
 width: var(--n-button-width-pressed);
 max-width: var(--n-button-width);
 border-radius: var(--n-button-border-radius);
 background-color: var(--n-button-color);
 box-shadow: var(--n-button-box-shadow);
 box-sizing: border-box;
 cursor: inherit;
 content: "";
 position: absolute;
 transition:
 background-color .3s var(--n-bezier),
 left .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `)]), cM("active", [cE("rail", "background-color: var(--n-rail-color-active);")]), cM("disabled", [cE("rail", `
 cursor: not-allowed;
 opacity: .5;
 `)]), cM("loading", [cE("rail", `
 pointer-events: none;
 `)])]);
  const switchProps = Object.assign(Object.assign({}, useTheme.props), {
    size: {
      type: String,
      default: "medium"
    },
    value: {
      type: [String, Number, Boolean],
      default: void 0
    },
    loading: Boolean,
    defaultValue: {
      type: [String, Number, Boolean],
      default: false
    },
    disabled: {
      type: Boolean,
      default: void 0
    },
    round: {
      type: Boolean,
      default: true
    },
    "onUpdate:value": [Function, Array],
    onUpdateValue: [Function, Array],
    checkedValue: {
      type: [String, Number, Boolean],
      default: true
    },
    uncheckedValue: {
      type: [String, Number, Boolean],
      default: false
    },
    railStyle: Function,
    onChange: [Function, Array]
  });
  var NSwitch = vue.defineComponent({
    name: "Switch",
    props: switchProps,
    setup(props) {
      const { mergedClsPrefixRef, inlineThemeDisabled } = useConfig(props);
      const themeRef = useTheme("Switch", "-switch", style, switchLight$1, props, mergedClsPrefixRef);
      const formItem = useFormItem(props);
      const { mergedSizeRef, mergedDisabledRef } = formItem;
      const uncontrolledValueRef = vue.ref(props.defaultValue);
      const controlledValueRef = vue.toRef(props, "value");
      const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
      const checkedRef = vue.computed(() => {
        return mergedValueRef.value === props.checkedValue;
      });
      const pressedRef = vue.ref(false);
      const focusedRef = vue.ref(false);
      const mergedRailStyleRef = vue.computed(() => {
        const { railStyle } = props;
        if (!railStyle)
          return void 0;
        return railStyle({ focused: focusedRef.value, checked: checkedRef.value });
      });
      function doUpdateValue(value) {
        const { "onUpdate:value": _onUpdateValue, onChange, onUpdateValue } = props;
        const { nTriggerFormInput, nTriggerFormChange } = formItem;
        if (_onUpdateValue)
          call(_onUpdateValue, value);
        if (onUpdateValue)
          call(onUpdateValue, value);
        if (onChange)
          call(onChange, value);
        uncontrolledValueRef.value = value;
        nTriggerFormInput();
        nTriggerFormChange();
      }
      function doFocus() {
        const { nTriggerFormFocus } = formItem;
        nTriggerFormFocus();
      }
      function doBlur() {
        const { nTriggerFormBlur } = formItem;
        nTriggerFormBlur();
      }
      function handleClick() {
        if (props.loading || mergedDisabledRef.value)
          return;
        if (mergedValueRef.value !== props.checkedValue) {
          doUpdateValue(props.checkedValue);
        } else {
          doUpdateValue(props.uncheckedValue);
        }
      }
      function handleFocus() {
        focusedRef.value = true;
        doFocus();
      }
      function handleBlur() {
        focusedRef.value = false;
        doBlur();
        pressedRef.value = false;
      }
      function handleKeyup(e) {
        if (props.loading || mergedDisabledRef.value)
          return;
        if (e.code === "Space") {
          if (mergedValueRef.value !== props.checkedValue) {
            doUpdateValue(props.checkedValue);
          } else {
            doUpdateValue(props.uncheckedValue);
          }
          pressedRef.value = false;
        }
      }
      function handleKeydown(e) {
        if (props.loading || mergedDisabledRef.value)
          return;
        if (e.code === "Space") {
          e.preventDefault();
          pressedRef.value = true;
        }
      }
      const cssVarsRef = vue.computed(() => {
        const { value: size } = mergedSizeRef;
        const { self: { opacityDisabled, railColor, railColorActive, buttonBoxShadow, buttonColor, boxShadowFocus, loadingColor, textColor, iconColor, [createKey("buttonHeight", size)]: buttonHeight, [createKey("buttonWidth", size)]: buttonWidth, [createKey("buttonWidthPressed", size)]: buttonWidthPressed, [createKey("railHeight", size)]: railHeight, [createKey("railWidth", size)]: railWidth, [createKey("railBorderRadius", size)]: railBorderRadius, [createKey("buttonBorderRadius", size)]: buttonBorderRadius }, common: { cubicBezierEaseInOut: cubicBezierEaseInOut2 } } = themeRef.value;
        const offset = pxfy((depx(railHeight) - depx(buttonHeight)) / 2);
        const height = pxfy(Math.max(depx(railHeight), depx(buttonHeight)));
        const width = depx(railHeight) > depx(buttonHeight) ? railWidth : pxfy(depx(railWidth) + depx(buttonHeight) - depx(railHeight));
        return {
          "--n-bezier": cubicBezierEaseInOut2,
          "--n-button-border-radius": buttonBorderRadius,
          "--n-button-box-shadow": buttonBoxShadow,
          "--n-button-color": buttonColor,
          "--n-button-width": buttonWidth,
          "--n-button-width-pressed": buttonWidthPressed,
          "--n-button-height": buttonHeight,
          "--n-height": height,
          "--n-offset": offset,
          "--n-opacity-disabled": opacityDisabled,
          "--n-rail-border-radius": railBorderRadius,
          "--n-rail-color": railColor,
          "--n-rail-color-active": railColorActive,
          "--n-rail-height": railHeight,
          "--n-rail-width": railWidth,
          "--n-width": width,
          "--n-box-shadow-focus": boxShadowFocus,
          "--n-loading-color": loadingColor,
          "--n-text-color": textColor,
          "--n-icon-color": iconColor
        };
      });
      const themeClassHandle = inlineThemeDisabled ? useThemeClass("switch", vue.computed(() => {
        return mergedSizeRef.value[0];
      }), cssVarsRef, props) : void 0;
      return {
        handleClick,
        handleBlur,
        handleFocus,
        handleKeyup,
        handleKeydown,
        mergedRailStyle: mergedRailStyleRef,
        pressed: pressedRef,
        mergedClsPrefix: mergedClsPrefixRef,
        mergedValue: mergedValueRef,
        checked: checkedRef,
        mergedDisabled: mergedDisabledRef,
        cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
        themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
        onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender
      };
    },
    render() {
      const { mergedClsPrefix, mergedDisabled, checked, mergedRailStyle, onRender, $slots } = this;
      onRender === null || onRender === void 0 ? void 0 : onRender();
      const { checked: checkedSlot, unchecked: uncheckedSlot, icon: iconSlot, "checked-icon": checkedIconSlot, "unchecked-icon": uncheckedIconSlot } = $slots;
      const hasIcon = !(isSlotEmpty(iconSlot) && isSlotEmpty(checkedIconSlot) && isSlotEmpty(uncheckedIconSlot));
      return vue.h("div", { role: "switch", "aria-checked": checked, class: [
        `${mergedClsPrefix}-switch`,
        this.themeClass,
        hasIcon && `${mergedClsPrefix}-switch--icon`,
        checked && `${mergedClsPrefix}-switch--active`,
        mergedDisabled && `${mergedClsPrefix}-switch--disabled`,
        this.round && `${mergedClsPrefix}-switch--round`,
        this.loading && `${mergedClsPrefix}-switch--loading`,
        this.pressed && `${mergedClsPrefix}-switch--pressed`
      ], tabindex: !this.mergedDisabled ? 0 : void 0, style: this.cssVars, onClick: this.handleClick, onFocus: this.handleFocus, onBlur: this.handleBlur, onKeyup: this.handleKeyup, onKeydown: this.handleKeydown }, vue.h("div", { class: `${mergedClsPrefix}-switch__rail`, "aria-hidden": "true", style: mergedRailStyle }, resolveWrappedSlot(checkedSlot, (checkedSlotChildren) => resolveWrappedSlot(uncheckedSlot, (uncheckedSlotChildren) => {
        if (checkedSlotChildren || uncheckedSlotChildren) {
          return vue.h("div", { "aria-hidden": true, class: `${mergedClsPrefix}-switch__children-placeholder` }, vue.h("div", { class: `${mergedClsPrefix}-switch__rail-placeholder` }, vue.h("div", { class: `${mergedClsPrefix}-switch__button-placeholder` }), checkedSlotChildren), vue.h("div", { class: `${mergedClsPrefix}-switch__rail-placeholder` }, vue.h("div", { class: `${mergedClsPrefix}-switch__button-placeholder` }), uncheckedSlotChildren));
        }
        return null;
      })), vue.h("div", { class: `${mergedClsPrefix}-switch__button` }, resolveWrappedSlot(iconSlot, (icon) => resolveWrappedSlot(checkedIconSlot, (checkedIcon) => resolveWrappedSlot(uncheckedIconSlot, (uncheckedIcon) => {
        return vue.h(NIconSwitchTransition, null, {
          default: () => this.loading ? vue.h(NBaseLoading, { key: "loading", clsPrefix: mergedClsPrefix, strokeWidth: 20 }) : this.checked && (checkedIcon || icon) ? vue.h("div", { class: `${mergedClsPrefix}-switch__button-icon`, key: checkedIcon ? "checked-icon" : "icon" }, checkedIcon || icon) : !this.checked && (uncheckedIcon || icon) ? vue.h("div", { class: `${mergedClsPrefix}-switch__button-icon`, key: uncheckedIcon ? "unchecked-icon" : "icon" }, uncheckedIcon || icon) : null
        });
      }))), resolveWrappedSlot(checkedSlot, (children) => children && vue.h("div", { key: "checked", class: `${mergedClsPrefix}-switch__checked` }, children)), resolveWrappedSlot(uncheckedSlot, (children) => children && vue.h("div", { key: "unchecked", class: `${mergedClsPrefix}-switch__unchecked` }, children)))));
    }
  });
  const key = "op-wiki-plus:config";
  const defaultConfig = {
    achievementVisibility: true
  };
  const globalConfig = vue.reactive(lodash.merge(defaultConfig, JSON.parse((_a = localStorage.getItem(key)) != null ? _a : "{}")));
  vue.watch(() => globalConfig, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true });
  const setAchievementVisibility = (show = true) => {
    var _a2, _b;
    const display = show ? "block" : "none";
    const catelogList = document.querySelectorAll("#toc > ul  a > span.toctext.checked");
    catelogList.forEach((el) => {
      var _a3;
      const target = (_a3 = el.parentElement) == null ? void 0 : _a3.parentElement;
      if (target) {
        target.style.display = display;
      }
    });
    const mainbodyList = document.querySelectorAll(`#mw-content-text div.bwiki-collection.checked`);
    if (mainbodyList.length > 0) {
      const realList = Array.from((_b = (_a2 = mainbodyList[0].parentElement) == null ? void 0 : _a2.children) != null ? _b : []);
      mainbodyList.forEach((el) => {
        const index = realList.indexOf(el);
        el.style.display = display;
        if (index >= 0) {
          for (let i = index + 1; i < realList.length; i++) {
            const child = realList[i];
            if (!child.classList.contains("bwiki-collection")) {
              child.style.display = display;
            } else {
              break;
            }
          }
        }
      });
    }
  };
  var App_vue_vue_type_style_index_0_scoped_true_lang = "";
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key2, val] of props) {
      target[key2] = val;
    }
    return target;
  };
  const _withScopeId = (n) => (vue.pushScopeId("data-v-1278fd00"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = { class: "root-1fdb449b" };
  const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "title" }, "\u539F\u795EWiki\u8F85\u52A9\u5DE5\u5177", -1));
  const _hoisted_3 = /* @__PURE__ */ vue.createTextVNode(" \u5DF2\u5B8C\u6210\u6210\u5C31-\u9690\u85CF\u4E2D ");
  const _hoisted_4 = /* @__PURE__ */ vue.createTextVNode(" \u5DF2\u5B8C\u6210\u6210\u5C31-\u663E\u793A\u4E2D ");
  const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", null, [
    /* @__PURE__ */ vue.createTextVNode(" \u66F4\u591A\u529F\u80FD\u8BF7\u5728 "),
    /* @__PURE__ */ vue.createElementVNode("a", {
      href: "https://github.com/lisonge/op-wiki-plus/issues",
      target: "_blank"
    }, " issues "),
    /* @__PURE__ */ vue.createTextVNode(" \u63D0\u51FA ")
  ], -1));
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    setup(__props) {
      let task = window.setInterval(() => {
        setAchievementVisibility(!globalConfig.achievementVisibility);
      }, 1e3);
      vue.onUnmounted(() => {
        window.clearInterval(task);
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          _hoisted_2,
          vue.createVNode(vue.unref(NSwitch), {
            value: vue.unref(globalConfig).achievementVisibility,
            "onUpdate:value": _cache[0] || (_cache[0] = ($event) => vue.unref(globalConfig).achievementVisibility = $event)
          }, {
            checked: vue.withCtx(() => [
              _hoisted_3
            ]),
            unchecked: vue.withCtx(() => [
              _hoisted_4
            ]),
            _: 1
          }, 8, ["value"]),
          _hoisted_5
        ]);
      };
    }
  });
  var App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1278fd00"]]);
  const app = document.createElement("div");
  document.body.appendChild(app);
  setTimeout(() => {
    vue.createApp(App).mount(app);
  });
})(Vue, _);
 
