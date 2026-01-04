// ==UserScript==
// @name            honkoku-toolbox
// @name:en         Honkoku Tools
// @name:ja         翻刻ツールボックス
// @name:zh         翻刻工具箱
// @name:ko         翻刻道具箱子
// @namespace       https://mkpo.li/
// @version         0.9.3
// @author          monkey
// @description:en  Convenient tools for transcribing Japanese classical texts
// @description:ja  日本の古典籍をデジタル翻刻する際の便利ツール
// @description:zh  日本古籍數字化翻印用的便利工具集成
// @description:ko  日本古典文獻을 디지털化할 때 便利한 道具
// @license         MIT
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAaLSURBVHgB7VtdUttWFD6SScxMH0pXgOhbSNqYHcAKCiuoO9MXYDKYFeCsAGcI8NIZkxWQrAC6AkibwltxV1BemmKCrX5HSFi+Plc6km0QU38zHpGrqyvde8/Pd865IZpgggn+z3Ckxv1z8nBp+j4t0sPg1HFoZfUZtWjMcKVGTPzwASfPqOD9R+FGjBVTlvYKPTw8LMIGrpuazs0Tmvn8lGqQ6Q2I9QyaGmvz6c+KEoABjqkAwAJUNf12P1H1c5kuoDZb4eQZtb1z+jHtWXEBrtr0Ey6n9MDAhGZ2frerIlRkEb8jx6VmbOK95yldjUUV2FwIjM8C3TP2z+jINz66VKIfyJBI7HjFLdF2mp3yFZLsUoHQ7dI7sy2uBqznmHwDO36imHxt7dngeCYcKhC2McGnrMuGOHddWnY6kMiegbOCd/0aKhxKcSpSF2CMnED09XtndIjLMmUETxyTqcPy/5rluanUgf3gg8bhFitdn5q4LsUbsdNv/FKmBWjRDW2uf0/vKQc0NmBsnECy0lc3dIrdvEx7lvtgc+rtNi2s5Zw8I3UBxskJfMHVQncvXSd5Qjxx6Pnc+nN6zf1pCKQuwLg4QWisVsSbN7L15mfaI5p4hJF5ARgv32yDQco1vs0bdDq09Oq7nkSygY7ZqFwBlIoH8IuYcfEkd8/zBSnsw6Mx8LvY+81u6GxqMDXVT205YKKejeIA6mLnD6pTBmiJ0J0bdHDlF/MuUQZcTfcxNw+Wvpk4hqAGIErLxjOe2aeEeIAXWLtJqgUQOIAHET0kJThYMQMb5vlPn9g/chWibnoDfgZScOeVEgw0q8YFFmI7baNUCyC9iF1YUqDS19elLaG5df0lWV/xjgOzLa4GoYFuJQxRK5fpJOk7VQvAL5J8c2mKZkkHb6DFoXqaJQcp+mC2xdWA6S4M7RzUsp4wjIeA6ujtJ+QKBKgWgF/kdvpdFi9I+0pHO00JgngeaAIVmxqUp4MIsdcPbpHdIyVIg+sGyZXBdlJi9db9rISTeX/dpSVtwBFIkB+I82lAYq51WR6GpAZSoiQuDZK02thlIXlAHPvQX3iMo3gbFuASizhnUyGoiDddhueKU22HqpLUFS4alLB7Rn8PhMGWCfU9B++DxMksvv3YFiUWLhqUEKpBzfiuKi6JC7D+YlB9TBQuGhT7Cd4AClfJSsYkFC4alKD1BnlQzGhQgOQNtBKUMm42cCoaunuYlptLQAM+WwxnR2xwVUY2U1Z4F5EWB0JDTJ5hpac89gi9TWRkE6FaAA5l357RAVdepPuaFJaBAXoKHsHhsUcjhEZFdLEAQll0tJWZWtBlsYiShZ763eEtugmNkdWGw1XLCzhFtWCjxFnoKSLD3IlN27dpjGwqEQrBK2nygcb6vI7Tc7ACn/3OpKdQqUb0NxtFlMaOzdIYV3jwnjc0JugkoNsLh4NrFzTUmPxAxGeIH0vD6jwt8ViYeB1NiwNU1hE5hzV1ZoJrhs2M5EjtBpl1fVWml/+06aPkwjgAKd9miSpZy1MR8gQ+wXPnQZqOLb7H/+749PrVc11ucGTR4KggBT5mNjhCEm+AbfpGkzpPtQH3HQ1yNtg0umaJPDoNgn5btsEhjS9xSU3YpNqAMZ4XEokK3vVBaKtGf4OP1KLTIGRHS1sk1XiBe40GIbrH2L3+fgh8mDSxJGgORVzfxi8qaN3gvcHmDkGauK6QhBZ+1fWM5fFCnRCJ0HX1pKivSpxx8oxcEpA31yflDSW4sAPo2Ejr53Nytk2bWd1t37uogAg9Q8t2Pzz8tAhxXxlm8oyhbIDSRaoOLApgNejPA96y0bpJjfk78h6rHUoClC6yhoryFmWEJQ9I8clzToGJU1gHvNAcjDQxrAqoXKSbI8635QHjiRS4xfgBSQ8LdMALsXOu5y1DLYA2YernTKyWhOdCVhipnyc85pVuD1o3NSXyoRYgLWEa7mBDUweU0OkKahBGh6HO29/tByX51AMTQxnBcR+p5SQJWKFJl71f/qTZn7+lv+D7VwZKYAb4wATU5lgKphiFdIMRmBVKaoaq9HJ4/y7HQAlu03lCX9vu5ZIALaEZCThJMuhpeAHuvEFYAjvgWmB4GMOL7rEafvmXPtqGL7QEBLgR6K2lLMYLwTnIUCJOw+Ozy0lkKZXSjnu3NbQ6S5IkKx5FbVAqi2U4npOIR1EbNFlhluM5qWPTIwFXjvCxG8Hku6gtvnj4/9IzwQQTPH78B7gKG4oYvtjQAAAAAElFTkSuQmCC
// @match           https://honkoku.org/app/*
// @match           https://ja.wikisource.org/w/index.php?title=*&action=*
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM_addStyle
// @description 日本の古典籍を翻刻する際の便利ツール
// @downloadURL https://update.greasyfork.org/scripts/512368/honkoku-toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/512368/honkoku-toolbox.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(' .CodeMirror.display-variant-highlight .highlight-variant,.editor-wrapper.display-variant-highlight .token .char.highlight-variant{color:#ff9800;font-weight:700}button.svelte-1ewjpur{width:2em;height:2em;border:1px solid #bbb;background-color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;white-space:nowrap;background-color:#ffffff85;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}button.svelte-1ewjpur:hover{background-color:#eee;border-color:#000}button.active.svelte-1ewjpur{background-color:#eee}.variants.svelte-1ewjpur{display:flex;flex-direction:column;gap:0}.variants.svelte-1ewjpur button:where(.svelte-1ewjpur){font-family:"Noto Serif Hentaigana",UniHentaiKana,serif;border-radius:2em;box-shadow:0 0 5px 1px #bbb}.variants.svelte-1ewjpur button:where(.svelte-1ewjpur):hover{background-color:#eee}.float-menu.svelte-1rgb4pt{writing-mode:vertical-rl;position:fixed;bottom:0;left:50%;transform:translate(-50%);background-color:#fbfbfb;z-index:100;padding:.5em;font-size:.85rem;border-radius:.5em;box-shadow:4px 4px 1em #0003;display:grid;grid-template-columns:auto 1fr;-webkit-user-select:none;user-select:none;cursor:move}button.svelte-18a6ijc{padding:.5em .1em;border:1px solid #bbb;background-color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;white-space:nowrap;font-family:inherit}button.svelte-18a6ijc:hover{background-color:#eee}[data-color=black].svelte-18a6ijc{color:#000}[data-color=green].svelte-18a6ijc{color:#00a800}[data-color=blue].svelte-18a6ijc{color:#009dff}[data-color=red].svelte-18a6ijc{color:#ff3e00}[data-color=pink].svelte-18a6ijc{color:#f0d}[data-color=gray].svelte-18a6ijc{color:#888}[data-color=orange].svelte-18a6ijc{color:#ff9500}.kana-table.svelte-1c61vln{padding:.25em;display:grid;grid-template-columns:repeat(5,1fr);gap:.25em}button.svelte-1c61vln{font-family:"Noto Serif Hentaigana",UniHentaiKana,serif}h2.svelte-1c61vln{margin:0;border:none;font-size:1.25em;font-family:inherit;width:100%;text-align:center;font-weight:700}.menu-content-container.svelte-1c61vln{display:flex;flex-direction:column;font-family:"Noto Serif Hentaigana",UniHentaiKana,serif}.show-button.svelte-1c61vln{position:fixed;right:0;top:40%;height:3rem;transform:translateY(-50%);background-color:#fff;padding:.5em;border-radius:.5em 0 0 .5em;display:flex;align-items:center;justify-content:center;box-shadow:0 0 1em #0003;transition:transform .1s ease-in-out;border:1px solid #ccc;color:#ff36a4}.show-button.svelte-1c61vln:hover{transform:translateY(-50%) scale(1.1)}.kana.svelte-1c61vln{font-size:2em}.panel.svelte-1c61vln{display:flex;flex-direction:row;gap:.25em;padding:.25em}button.svelte-1m4k62d{padding:.5em .1em;border:1px solid #bbb;background-color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;white-space:nowrap;background-color:#ffffff85;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);font-family:Jigmo,Jigmo2,Jigmo3,HanaMinA,HanaMinB,serif}button.svelte-1m4k62d:hover{background-color:#eee;border-color:#000}button.active.svelte-1m4k62d{background-color:#eee}button.selected.svelte-1m4k62d{background-color:#fff0cc}.type.selected.svelte-1m4k62d{border-color:#765300}.variants.svelte-1m4k62d{display:flex;flex-direction:column;gap:0;box-shadow:0 0 5px 1px #bbb}.variants.svelte-1m4k62d button:where(.svelte-1m4k62d){width:2em}.variants.svelte-1m4k62d button:where(.svelte-1m4k62d):hover{background-color:#eee}h2.svelte-9lvbl8{margin:0;border:none;font-size:1.25em;font-family:inherit;width:100%;text-align:center;font-weight:700}.menu-content-container.svelte-9lvbl8{display:flex;flex-direction:column;gap:.25em;align-items:stretch;justify-content:center;font-family:"Noto Serif Hentaigana",UniHentaiKana,serif}.show-button.svelte-9lvbl8{position:fixed;right:0;top:60%;height:3rem;transform:translateY(-50%);background-color:#fff;padding:.5em;border-radius:.5em 0 0 .5em;display:flex;align-items:center;justify-content:center;box-shadow:0 0 1em #0003;transition:transform .1s ease-in-out;border:1px solid #ccc;font-family:serif;color:#0f03f8}.show-button.svelte-9lvbl8:hover{transform:translateY(-50%) scale(1.1)}.icon.svelte-9lvbl8{font-size:2em}.panel.svelte-9lvbl8{display:grid;grid-template-columns:repeat(5,1fr);gap:.25em;max-width:20em}label.svelte-9lvbl8{display:flex;align-items:center;justify-content:center;gap:.5em}hr.svelte-9lvbl8{border:1px solid #ccc;margin:0 .5em;height:100%}select.svelte-9lvbl8{width:100%;padding:.5em;border:1px solid #ccc;border-radius:.5em}input[type=text].svelte-h6zyeb,select.svelte-h6zyeb{height:3em}.panel.svelte-1l9kdai{border:1px solid #ccc;padding:.25em;border-radius:5px;display:flex;gap:0;flex-wrap:wrap;border:none}.panel.svelte-1l9kdai>h3:where(.svelte-1l9kdai){background-color:#f5f5f5;padding:.25em 0;border:1px solid #ccc;margin:.25em 0}.show-button.svelte-1l9kdai{position:fixed;right:0;top:50%;height:3rem;transform:translateY(-50%);background-color:#fff;padding:.5em;border-radius:.5em 0 0 .5em;display:flex;align-items:center;justify-content:center;box-shadow:0 0 1em #0003;transition:transform .1s ease-in-out;border:1px solid #ccc}.show-button.svelte-1l9kdai:hover{transform:translateY(-50%) scale(1.1)}.show-button.svelte-1l9kdai img:where(.svelte-1l9kdai){width:2em;height:2em}.panel.svelte-1l9kdai button:where(.svelte-1l9kdai){margin:.25em 0} ');

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var _text, _segments, _selectedText;
  const DEV = false;
  var is_array = Array.isArray;
  var array_from = Array.from;
  var define_property = Object.defineProperty;
  var get_descriptor = Object.getOwnPropertyDescriptor;
  var get_descriptors = Object.getOwnPropertyDescriptors;
  var object_prototype = Object.prototype;
  var array_prototype = Array.prototype;
  var get_prototype_of = Object.getPrototypeOf;
  const noop = () => {
  };
  function run_all(arr) {
    for (var i2 = 0; i2 < arr.length; i2++) {
      arr[i2]();
    }
  }
  const DERIVED = 1 << 1;
  const EFFECT = 1 << 2;
  const RENDER_EFFECT = 1 << 3;
  const BLOCK_EFFECT = 1 << 4;
  const BRANCH_EFFECT = 1 << 5;
  const ROOT_EFFECT = 1 << 6;
  const UNOWNED = 1 << 7;
  const DISCONNECTED = 1 << 8;
  const CLEAN = 1 << 9;
  const DIRTY = 1 << 10;
  const MAYBE_DIRTY = 1 << 11;
  const INERT = 1 << 12;
  const DESTROYED = 1 << 13;
  const EFFECT_RAN = 1 << 14;
  const EFFECT_TRANSPARENT = 1 << 15;
  const LEGACY_DERIVED_PROP = 1 << 16;
  const HEAD_EFFECT = 1 << 18;
  const EFFECT_HAS_DERIVED = 1 << 19;
  const STATE_SYMBOL = Symbol("$state");
  const LOADING_ATTR_SYMBOL = Symbol("");
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a2, b) {
    return a2 != a2 ? b == b : a2 !== b || a2 !== null && typeof a2 === "object" || typeof a2 === "function";
  }
  function safe_equals(value) {
    return !safe_not_equal(value, this.v);
  }
  function effect_in_teardown(rune) {
    {
      throw new Error("effect_in_teardown");
    }
  }
  function effect_in_unowned_derived() {
    {
      throw new Error("effect_in_unowned_derived");
    }
  }
  function effect_orphan(rune) {
    {
      throw new Error("effect_orphan");
    }
  }
  function effect_update_depth_exceeded() {
    {
      throw new Error("effect_update_depth_exceeded");
    }
  }
  function props_invalid_value(key) {
    {
      throw new Error("props_invalid_value");
    }
  }
  function state_descriptors_fixed() {
    {
      throw new Error("state_descriptors_fixed");
    }
  }
  function state_prototype_fixed() {
    {
      throw new Error("state_prototype_fixed");
    }
  }
  function state_unsafe_local_read() {
    {
      throw new Error("state_unsafe_local_read");
    }
  }
  function state_unsafe_mutation() {
    {
      throw new Error("state_unsafe_mutation");
    }
  }
  function source(v) {
    return {
      f: 0,
      // TODO ideally we could skip this altogether, but it causes type errors
      v,
      reactions: null,
      equals,
      version: 0
    };
  }
  function state(v) {
    return /* @__PURE__ */ push_derived_source(source(v));
  }
  // @__NO_SIDE_EFFECTS__
  function mutable_source(initial_value, immutable = false) {
    var _a;
    const s2 = source(initial_value);
    if (!immutable) {
      s2.equals = safe_equals;
    }
    if (component_context !== null && component_context.l !== null) {
      ((_a = component_context.l).s ?? (_a.s = [])).push(s2);
    }
    return s2;
  }
  // @__NO_SIDE_EFFECTS__
  function push_derived_source(source2) {
    if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0) {
      if (derived_sources === null) {
        set_derived_sources([source2]);
      } else {
        derived_sources.push(source2);
      }
    }
    return source2;
  }
  function set(source2, value) {
    if (active_reaction !== null && is_runes() && (active_reaction.f & DERIVED) !== 0 && // If the source was created locally within the current derived, then
    // we allow the mutation.
    (derived_sources === null || !derived_sources.includes(source2))) {
      state_unsafe_mutation();
    }
    if (!source2.equals(value)) {
      source2.v = value;
      source2.version = increment_version();
      mark_reactions(source2, DIRTY);
      if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & BRANCH_EFFECT) === 0) {
        if (new_deps !== null && new_deps.includes(source2)) {
          set_signal_status(active_effect, DIRTY);
          schedule_effect(active_effect);
        } else {
          if (untracked_writes === null) {
            set_untracked_writes([source2]);
          } else {
            untracked_writes.push(source2);
          }
        }
      }
    }
    return value;
  }
  function mark_reactions(signal, status) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var runes = is_runes();
    var length = reactions.length;
    for (var i2 = 0; i2 < length; i2++) {
      var reaction = reactions[i2];
      var flags = reaction.f;
      if ((flags & DIRTY) !== 0) continue;
      if (!runes && reaction === active_effect) continue;
      set_signal_status(reaction, status);
      if ((flags & (CLEAN | UNOWNED)) !== 0) {
        if ((flags & DERIVED) !== 0) {
          mark_reactions(
            /** @type {Derived} */
            reaction,
            MAYBE_DIRTY
          );
        } else {
          schedule_effect(
            /** @type {Effect} */
            reaction
          );
        }
      }
    }
  }
  const EACH_ITEM_REACTIVE = 1;
  const EACH_INDEX_REACTIVE = 1 << 1;
  const EACH_IS_CONTROLLED = 1 << 2;
  const EACH_IS_ANIMATED = 1 << 3;
  const EACH_ITEM_IMMUTABLE = 1 << 4;
  const PROPS_IS_IMMUTABLE = 1;
  const PROPS_IS_RUNES = 1 << 1;
  const PROPS_IS_UPDATED = 1 << 2;
  const PROPS_IS_BINDABLE = 1 << 3;
  const PROPS_IS_LAZY_INITIAL = 1 << 4;
  const TEMPLATE_FRAGMENT = 1;
  const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
  const UNINITIALIZED = Symbol();
  let hydrating = false;
  function proxy(value, parent = null, prev) {
    if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
      return value;
    }
    const prototype = get_prototype_of(value);
    if (prototype !== object_prototype && prototype !== array_prototype) {
      return value;
    }
    var sources = /* @__PURE__ */ new Map();
    var is_proxied_array = is_array(value);
    var version = source(0);
    if (is_proxied_array) {
      sources.set("length", source(
        /** @type {any[]} */
        value.length
      ));
    }
    var metadata;
    return new Proxy(
      /** @type {any} */
      value,
      {
        defineProperty(_, prop2, descriptor) {
          if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
            state_descriptors_fixed();
          }
          var s2 = sources.get(prop2);
          if (s2 === void 0) {
            s2 = source(descriptor.value);
            sources.set(prop2, s2);
          } else {
            set(s2, proxy(descriptor.value, metadata));
          }
          return true;
        },
        deleteProperty(target, prop2) {
          var s2 = sources.get(prop2);
          if (s2 === void 0) {
            if (prop2 in target) {
              sources.set(prop2, source(UNINITIALIZED));
            }
          } else {
            set(s2, UNINITIALIZED);
            update_version(version);
          }
          return true;
        },
        get(target, prop2, receiver) {
          var _a;
          if (prop2 === STATE_SYMBOL) {
            return value;
          }
          var s2 = sources.get(prop2);
          var exists = prop2 in target;
          if (s2 === void 0 && (!exists || ((_a = get_descriptor(target, prop2)) == null ? void 0 : _a.writable))) {
            s2 = source(proxy(exists ? target[prop2] : UNINITIALIZED, metadata));
            sources.set(prop2, s2);
          }
          if (s2 !== void 0) {
            var v = get(s2);
            return v === UNINITIALIZED ? void 0 : v;
          }
          return Reflect.get(target, prop2, receiver);
        },
        getOwnPropertyDescriptor(target, prop2) {
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
          if (descriptor && "value" in descriptor) {
            var s2 = sources.get(prop2);
            if (s2) descriptor.value = get(s2);
          } else if (descriptor === void 0) {
            var source2 = sources.get(prop2);
            var value2 = source2 == null ? void 0 : source2.v;
            if (source2 !== void 0 && value2 !== UNINITIALIZED) {
              return {
                enumerable: true,
                configurable: true,
                value: value2,
                writable: true
              };
            }
          }
          return descriptor;
        },
        has(target, prop2) {
          var _a;
          if (prop2 === STATE_SYMBOL) {
            return true;
          }
          var s2 = sources.get(prop2);
          var has = s2 !== void 0 && s2.v !== UNINITIALIZED || Reflect.has(target, prop2);
          if (s2 !== void 0 || active_effect !== null && (!has || ((_a = get_descriptor(target, prop2)) == null ? void 0 : _a.writable))) {
            if (s2 === void 0) {
              s2 = source(has ? proxy(target[prop2], metadata) : UNINITIALIZED);
              sources.set(prop2, s2);
            }
            var value2 = get(s2);
            if (value2 === UNINITIALIZED) {
              return false;
            }
          }
          return has;
        },
        set(target, prop2, value2, receiver) {
          var _a;
          var s2 = sources.get(prop2);
          var has = prop2 in target;
          if (is_proxied_array && prop2 === "length") {
            for (var i2 = value2; i2 < /** @type {Source<number>} */
            s2.v; i2 += 1) {
              var other_s = sources.get(i2 + "");
              if (other_s !== void 0) {
                set(other_s, UNINITIALIZED);
              } else if (i2 in target) {
                other_s = source(UNINITIALIZED);
                sources.set(i2 + "", other_s);
              }
            }
          }
          if (s2 === void 0) {
            if (!has || ((_a = get_descriptor(target, prop2)) == null ? void 0 : _a.writable)) {
              s2 = source(void 0);
              set(s2, proxy(value2, metadata));
              sources.set(prop2, s2);
            }
          } else {
            has = s2.v !== UNINITIALIZED;
            set(s2, proxy(value2, metadata));
          }
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
          if (descriptor == null ? void 0 : descriptor.set) {
            descriptor.set.call(receiver, value2);
          }
          if (!has) {
            if (is_proxied_array && typeof prop2 === "string") {
              var ls = (
                /** @type {Source<number>} */
                sources.get("length")
              );
              var n2 = Number(prop2);
              if (Number.isInteger(n2) && n2 >= ls.v) {
                set(ls, n2 + 1);
              }
            }
            update_version(version);
          }
          return true;
        },
        ownKeys(target) {
          get(version);
          var own_keys = Reflect.ownKeys(target).filter((key2) => {
            var source3 = sources.get(key2);
            return source3 === void 0 || source3.v !== UNINITIALIZED;
          });
          for (var [key, source2] of sources) {
            if (source2.v !== UNINITIALIZED && !(key in target)) {
              own_keys.push(key);
            }
          }
          return own_keys;
        },
        setPrototypeOf() {
          state_prototype_fixed();
        }
      }
    );
  }
  function update_version(signal, d2 = 1) {
    set(signal, signal.v + d2);
  }
  function get_proxied_value(value) {
    if (value !== null && typeof value === "object" && STATE_SYMBOL in value) {
      return value[STATE_SYMBOL];
    }
    return value;
  }
  function is(a2, b) {
    return Object.is(get_proxied_value(a2), get_proxied_value(b));
  }
  var $window;
  var first_child_getter;
  var next_sibling_getter;
  function init_operations() {
    if ($window !== void 0) {
      return;
    }
    $window = window;
    var element_prototype = Element.prototype;
    var node_prototype = Node.prototype;
    first_child_getter = get_descriptor(node_prototype, "firstChild").get;
    next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
    element_prototype.__click = void 0;
    element_prototype.__className = "";
    element_prototype.__attributes = null;
    element_prototype.__e = void 0;
    Text.prototype.__t = void 0;
  }
  function create_text(value = "") {
    return document.createTextNode(value);
  }
  // @__NO_SIDE_EFFECTS__
  function get_first_child(node) {
    return first_child_getter.call(node);
  }
  // @__NO_SIDE_EFFECTS__
  function get_next_sibling(node) {
    return next_sibling_getter.call(node);
  }
  function child(node) {
    {
      return /* @__PURE__ */ get_first_child(node);
    }
  }
  function first_child(fragment, is_text) {
    {
      var first = (
        /** @type {DocumentFragment} */
        /* @__PURE__ */ get_first_child(
          /** @type {Node} */
          fragment
        )
      );
      if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
      return first;
    }
  }
  function sibling(node, count = 1, is_text = false) {
    let next_sibling = node;
    while (count--) {
      next_sibling = /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(next_sibling);
    }
    {
      return next_sibling;
    }
  }
  function clear_text_content(node) {
    node.textContent = "";
  }
  function validate_effect(rune) {
    if (active_effect === null && active_reaction === null) {
      effect_orphan();
    }
    if (active_reaction !== null && (active_reaction.f & UNOWNED) !== 0) {
      effect_in_unowned_derived();
    }
    if (is_destroying_effect) {
      effect_in_teardown();
    }
  }
  function push_effect(effect3, parent_effect) {
    var parent_last = parent_effect.last;
    if (parent_last === null) {
      parent_effect.last = parent_effect.first = effect3;
    } else {
      parent_last.next = effect3;
      effect3.prev = parent_last;
      parent_effect.last = effect3;
    }
  }
  function create_effect(type, fn2, sync, push2 = true) {
    var is_root = (type & ROOT_EFFECT) !== 0;
    var parent_effect = active_effect;
    var effect3 = {
      ctx: component_context,
      deps: null,
      nodes_start: null,
      nodes_end: null,
      f: type | DIRTY,
      first: null,
      fn: fn2,
      last: null,
      next: null,
      parent: is_root ? null : parent_effect,
      prev: null,
      teardown: null,
      transitions: null,
      version: 0
    };
    if (sync) {
      var previously_flushing_effect = is_flushing_effect;
      try {
        set_is_flushing_effect(true);
        update_effect(effect3);
        effect3.f |= EFFECT_RAN;
      } catch (e2) {
        destroy_effect(effect3);
        throw e2;
      } finally {
        set_is_flushing_effect(previously_flushing_effect);
      }
    } else if (fn2 !== null) {
      schedule_effect(effect3);
    }
    var inert = sync && effect3.deps === null && effect3.first === null && effect3.nodes_start === null && effect3.teardown === null && (effect3.f & EFFECT_HAS_DERIVED) === 0;
    if (!inert && !is_root && push2) {
      if (parent_effect !== null) {
        push_effect(effect3, parent_effect);
      }
      if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0) {
        var derived2 = (
          /** @type {Derived} */
          active_reaction
        );
        (derived2.children ?? (derived2.children = [])).push(effect3);
      }
    }
    return effect3;
  }
  function user_effect(fn2) {
    validate_effect();
    var defer = active_effect !== null && (active_effect.f & RENDER_EFFECT) !== 0 && // TODO do we actually need this? removing them changes nothing
    component_context !== null && !component_context.m;
    if (defer) {
      var context = (
        /** @type {ComponentContext} */
        component_context
      );
      (context.e ?? (context.e = [])).push({
        fn: fn2,
        effect: active_effect,
        reaction: active_reaction
      });
    } else {
      var signal = effect$3(fn2);
      return signal;
    }
  }
  function effect_root(fn2) {
    const effect3 = create_effect(ROOT_EFFECT, fn2, true);
    return () => {
      destroy_effect(effect3);
    };
  }
  function effect$3(fn2) {
    return create_effect(EFFECT, fn2, false);
  }
  function render_effect(fn2) {
    return create_effect(RENDER_EFFECT, fn2, true);
  }
  function template_effect(fn2) {
    return render_effect(fn2);
  }
  function block(fn2, flags = 0) {
    return create_effect(RENDER_EFFECT | BLOCK_EFFECT | flags, fn2, true);
  }
  function branch(fn2, push2 = true) {
    return create_effect(RENDER_EFFECT | BRANCH_EFFECT, fn2, true, push2);
  }
  function execute_effect_teardown(effect3) {
    var teardown = effect3.teardown;
    if (teardown !== null) {
      const previously_destroying_effect = is_destroying_effect;
      const previous_reaction = active_reaction;
      set_is_destroying_effect(true);
      set_active_reaction(null);
      try {
        teardown.call(null);
      } finally {
        set_is_destroying_effect(previously_destroying_effect);
        set_active_reaction(previous_reaction);
      }
    }
  }
  function destroy_effect(effect3, remove_dom = true) {
    var removed = false;
    if ((remove_dom || (effect3.f & HEAD_EFFECT) !== 0) && effect3.nodes_start !== null) {
      var node = effect3.nodes_start;
      var end2 = effect3.nodes_end;
      while (node !== null) {
        var next = node === end2 ? null : (
          /** @type {TemplateNode} */
          /* @__PURE__ */ get_next_sibling(node)
        );
        node.remove();
        node = next;
      }
      removed = true;
    }
    destroy_effect_children(effect3, remove_dom && !removed);
    remove_reactions(effect3, 0);
    set_signal_status(effect3, DESTROYED);
    var transitions = effect3.transitions;
    if (transitions !== null) {
      for (const transition of transitions) {
        transition.stop();
      }
    }
    execute_effect_teardown(effect3);
    var parent = effect3.parent;
    if (parent !== null && parent.first !== null) {
      unlink_effect(effect3);
    }
    effect3.next = effect3.prev = effect3.teardown = effect3.ctx = effect3.deps = effect3.parent = effect3.fn = effect3.nodes_start = effect3.nodes_end = null;
  }
  function unlink_effect(effect3) {
    var parent = effect3.parent;
    var prev = effect3.prev;
    var next = effect3.next;
    if (prev !== null) prev.next = next;
    if (next !== null) next.prev = prev;
    if (parent !== null) {
      if (parent.first === effect3) parent.first = next;
      if (parent.last === effect3) parent.last = prev;
    }
  }
  function pause_effect(effect3, callback) {
    var transitions = [];
    pause_children(effect3, transitions, true);
    run_out_transitions(transitions, () => {
      destroy_effect(effect3);
      if (callback) callback();
    });
  }
  function run_out_transitions(transitions, fn2) {
    var remaining = transitions.length;
    if (remaining > 0) {
      var check = () => --remaining || fn2();
      for (var transition of transitions) {
        transition.out(check);
      }
    } else {
      fn2();
    }
  }
  function pause_children(effect3, transitions, local) {
    if ((effect3.f & INERT) !== 0) return;
    effect3.f ^= INERT;
    if (effect3.transitions !== null) {
      for (const transition of effect3.transitions) {
        if (transition.is_global || local) {
          transitions.push(transition);
        }
      }
    }
    var child2 = effect3.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      pause_children(child2, transitions, transparent ? local : false);
      child2 = sibling2;
    }
  }
  function resume_effect(effect3) {
    resume_children(effect3, true);
  }
  function resume_children(effect3, local) {
    if ((effect3.f & INERT) === 0) return;
    effect3.f ^= INERT;
    if (check_dirtiness(effect3)) {
      update_effect(effect3);
    }
    var child2 = effect3.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      resume_children(child2, transparent ? local : false);
      child2 = sibling2;
    }
    if (effect3.transitions !== null) {
      for (const transition of effect3.transitions) {
        if (transition.is_global || local) {
          transition.in();
        }
      }
    }
  }
  let is_micro_task_queued$1 = false;
  let current_queued_micro_tasks = [];
  function process_micro_tasks() {
    is_micro_task_queued$1 = false;
    const tasks = current_queued_micro_tasks.slice();
    current_queued_micro_tasks = [];
    run_all(tasks);
  }
  function queue_micro_task(fn2) {
    if (!is_micro_task_queued$1) {
      is_micro_task_queued$1 = true;
      queueMicrotask(process_micro_tasks);
    }
    current_queued_micro_tasks.push(fn2);
  }
  // @__NO_SIDE_EFFECTS__
  function derived(fn2) {
    let flags = DERIVED | DIRTY;
    if (active_effect === null) {
      flags |= UNOWNED;
    } else {
      active_effect.f |= EFFECT_HAS_DERIVED;
    }
    const signal = {
      children: null,
      deps: null,
      equals,
      f: flags,
      fn: fn2,
      reactions: null,
      v: (
        /** @type {V} */
        null
      ),
      version: 0,
      parent: active_effect
    };
    if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0) {
      var derived2 = (
        /** @type {Derived} */
        active_reaction
      );
      (derived2.children ?? (derived2.children = [])).push(signal);
    }
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function derived_safe_equal(fn2) {
    const signal = /* @__PURE__ */ derived(fn2);
    signal.equals = safe_equals;
    return signal;
  }
  function destroy_derived_children(derived2) {
    var children = derived2.children;
    if (children !== null) {
      derived2.children = null;
      for (var i2 = 0; i2 < children.length; i2 += 1) {
        var child2 = children[i2];
        if ((child2.f & DERIVED) !== 0) {
          destroy_derived(
            /** @type {Derived} */
            child2
          );
        } else {
          destroy_effect(
            /** @type {Effect} */
            child2
          );
        }
      }
    }
  }
  function update_derived(derived2) {
    var value;
    var prev_active_effect = active_effect;
    set_active_effect(derived2.parent);
    {
      try {
        destroy_derived_children(derived2);
        value = update_reaction(derived2);
      } finally {
        set_active_effect(prev_active_effect);
      }
    }
    var status = (skip_reaction || (derived2.f & UNOWNED) !== 0) && derived2.deps !== null ? MAYBE_DIRTY : CLEAN;
    set_signal_status(derived2, status);
    if (!derived2.equals(value)) {
      derived2.v = value;
      derived2.version = increment_version();
    }
  }
  function destroy_derived(signal) {
    destroy_derived_children(signal);
    remove_reactions(signal, 0);
    set_signal_status(signal, DESTROYED);
    signal.children = signal.deps = signal.reactions = // @ts-expect-error `signal.fn` cannot be `null` while the signal is alive
    signal.fn = null;
  }
  function lifecycle_outside_component(name) {
    {
      throw new Error("lifecycle_outside_component");
    }
  }
  let is_micro_task_queued = false;
  let is_flushing_effect = false;
  let is_destroying_effect = false;
  function set_is_flushing_effect(value) {
    is_flushing_effect = value;
  }
  function set_is_destroying_effect(value) {
    is_destroying_effect = value;
  }
  let queued_root_effects = [];
  let flush_count = 0;
  let active_reaction = null;
  function set_active_reaction(reaction) {
    active_reaction = reaction;
  }
  let active_effect = null;
  function set_active_effect(effect3) {
    active_effect = effect3;
  }
  let derived_sources = null;
  function set_derived_sources(sources) {
    derived_sources = sources;
  }
  let new_deps = null;
  let skipped_deps = 0;
  let untracked_writes = null;
  function set_untracked_writes(value) {
    untracked_writes = value;
  }
  let current_version = 0;
  let skip_reaction = false;
  let component_context = null;
  function increment_version() {
    return ++current_version;
  }
  function is_runes() {
    return component_context !== null && component_context.l === null;
  }
  function check_dirtiness(reaction) {
    var _a, _b;
    var flags = reaction.f;
    if ((flags & DIRTY) !== 0) {
      return true;
    }
    if ((flags & MAYBE_DIRTY) !== 0) {
      var dependencies = reaction.deps;
      var is_unowned = (flags & UNOWNED) !== 0;
      if (dependencies !== null) {
        var i2;
        if ((flags & DISCONNECTED) !== 0) {
          for (i2 = 0; i2 < dependencies.length; i2++) {
            ((_a = dependencies[i2]).reactions ?? (_a.reactions = [])).push(reaction);
          }
          reaction.f ^= DISCONNECTED;
        }
        for (i2 = 0; i2 < dependencies.length; i2++) {
          var dependency = dependencies[i2];
          if (check_dirtiness(
            /** @type {Derived} */
            dependency
          )) {
            update_derived(
              /** @type {Derived} */
              dependency
            );
          }
          if (is_unowned && active_effect !== null && !skip_reaction && !((_b = dependency == null ? void 0 : dependency.reactions) == null ? void 0 : _b.includes(reaction))) {
            (dependency.reactions ?? (dependency.reactions = [])).push(reaction);
          }
          if (dependency.version > reaction.version) {
            return true;
          }
        }
      }
      if (!is_unowned) {
        set_signal_status(reaction, CLEAN);
      }
    }
    return false;
  }
  function handle_error(error, effect3, component_context2) {
    {
      throw error;
    }
  }
  function update_reaction(reaction) {
    var _a;
    var previous_deps = new_deps;
    var previous_skipped_deps = skipped_deps;
    var previous_untracked_writes = untracked_writes;
    var previous_reaction = active_reaction;
    var previous_skip_reaction = skip_reaction;
    var prev_derived_sources = derived_sources;
    new_deps = /** @type {null | Value[]} */
    null;
    skipped_deps = 0;
    untracked_writes = null;
    active_reaction = (reaction.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    skip_reaction = !is_flushing_effect && (reaction.f & UNOWNED) !== 0;
    derived_sources = null;
    try {
      var result = (
        /** @type {Function} */
        (0, reaction.fn)()
      );
      var deps = reaction.deps;
      if (new_deps !== null) {
        var i2;
        remove_reactions(reaction, skipped_deps);
        if (deps !== null && skipped_deps > 0) {
          deps.length = skipped_deps + new_deps.length;
          for (i2 = 0; i2 < new_deps.length; i2++) {
            deps[skipped_deps + i2] = new_deps[i2];
          }
        } else {
          reaction.deps = deps = new_deps;
        }
        if (!skip_reaction) {
          for (i2 = skipped_deps; i2 < deps.length; i2++) {
            ((_a = deps[i2]).reactions ?? (_a.reactions = [])).push(reaction);
          }
        }
      } else if (deps !== null && skipped_deps < deps.length) {
        remove_reactions(reaction, skipped_deps);
        deps.length = skipped_deps;
      }
      return result;
    } finally {
      new_deps = previous_deps;
      skipped_deps = previous_skipped_deps;
      untracked_writes = previous_untracked_writes;
      active_reaction = previous_reaction;
      skip_reaction = previous_skip_reaction;
      derived_sources = prev_derived_sources;
    }
  }
  function remove_reaction(signal, dependency) {
    let reactions = dependency.reactions;
    if (reactions !== null) {
      var index2 = reactions.indexOf(signal);
      if (index2 !== -1) {
        var new_length = reactions.length - 1;
        if (new_length === 0) {
          reactions = dependency.reactions = null;
        } else {
          reactions[index2] = reactions[new_length];
          reactions.pop();
        }
      }
    }
    if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
    // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
    // allows us to skip the expensive work of disconnecting and immediately reconnecting it
    (new_deps === null || !new_deps.includes(dependency))) {
      set_signal_status(dependency, MAYBE_DIRTY);
      if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
        dependency.f ^= DISCONNECTED;
      }
      remove_reactions(
        /** @type {Derived} **/
        dependency,
        0
      );
    }
  }
  function remove_reactions(signal, start_index) {
    var dependencies = signal.deps;
    if (dependencies === null) return;
    for (var i2 = start_index; i2 < dependencies.length; i2++) {
      remove_reaction(signal, dependencies[i2]);
    }
  }
  function destroy_effect_children(signal, remove_dom = false) {
    var effect3 = signal.first;
    signal.first = signal.last = null;
    while (effect3 !== null) {
      var next = effect3.next;
      destroy_effect(effect3, remove_dom);
      effect3 = next;
    }
  }
  function update_effect(effect3) {
    var flags = effect3.f;
    if ((flags & DESTROYED) !== 0) {
      return;
    }
    set_signal_status(effect3, CLEAN);
    var previous_effect = active_effect;
    var previous_component_context = component_context;
    active_effect = effect3;
    component_context = effect3.ctx;
    try {
      if ((flags & BLOCK_EFFECT) === 0) {
        destroy_effect_children(effect3);
      }
      execute_effect_teardown(effect3);
      var teardown = update_reaction(effect3);
      effect3.teardown = typeof teardown === "function" ? teardown : null;
      effect3.version = current_version;
      if (DEV) ;
    } catch (error) {
      handle_error(
        /** @type {Error} */
        error
      );
    } finally {
      active_effect = previous_effect;
      component_context = previous_component_context;
    }
  }
  function infinite_loop_guard() {
    if (flush_count > 1e3) {
      flush_count = 0;
      {
        effect_update_depth_exceeded();
      }
    }
    flush_count++;
  }
  function flush_queued_root_effects(root_effects) {
    var length = root_effects.length;
    if (length === 0) {
      return;
    }
    infinite_loop_guard();
    var previously_flushing_effect = is_flushing_effect;
    is_flushing_effect = true;
    try {
      for (var i2 = 0; i2 < length; i2++) {
        var effect3 = root_effects[i2];
        if ((effect3.f & CLEAN) === 0) {
          effect3.f ^= CLEAN;
        }
        var collected_effects = [];
        process_effects(effect3, collected_effects);
        flush_queued_effects(collected_effects);
      }
    } finally {
      is_flushing_effect = previously_flushing_effect;
    }
  }
  function flush_queued_effects(effects) {
    var length = effects.length;
    if (length === 0) return;
    for (var i2 = 0; i2 < length; i2++) {
      var effect3 = effects[i2];
      if ((effect3.f & (DESTROYED | INERT)) === 0 && check_dirtiness(effect3)) {
        update_effect(effect3);
        if (effect3.deps === null && effect3.first === null && effect3.nodes_start === null) {
          if (effect3.teardown === null) {
            unlink_effect(effect3);
          } else {
            effect3.fn = null;
          }
        }
      }
    }
  }
  function process_deferred() {
    is_micro_task_queued = false;
    if (flush_count > 1001) {
      return;
    }
    const previous_queued_root_effects = queued_root_effects;
    queued_root_effects = [];
    flush_queued_root_effects(previous_queued_root_effects);
    if (!is_micro_task_queued) {
      flush_count = 0;
    }
  }
  function schedule_effect(signal) {
    {
      if (!is_micro_task_queued) {
        is_micro_task_queued = true;
        queueMicrotask(process_deferred);
      }
    }
    var effect3 = signal;
    while (effect3.parent !== null) {
      effect3 = effect3.parent;
      var flags = effect3.f;
      if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
        if ((flags & CLEAN) === 0) return;
        effect3.f ^= CLEAN;
      }
    }
    queued_root_effects.push(effect3);
  }
  function process_effects(effect3, collected_effects) {
    var current_effect = effect3.first;
    var effects = [];
    main_loop: while (current_effect !== null) {
      var flags = current_effect.f;
      var is_branch = (flags & BRANCH_EFFECT) !== 0;
      var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
      if (!is_skippable_branch && (flags & INERT) === 0) {
        if ((flags & RENDER_EFFECT) !== 0) {
          if (is_branch) {
            current_effect.f ^= CLEAN;
          } else if (check_dirtiness(current_effect)) {
            update_effect(current_effect);
          }
          var child2 = current_effect.first;
          if (child2 !== null) {
            current_effect = child2;
            continue;
          }
        } else if ((flags & EFFECT) !== 0) {
          effects.push(current_effect);
        }
      }
      var sibling2 = current_effect.next;
      if (sibling2 === null) {
        let parent = current_effect.parent;
        while (parent !== null) {
          if (effect3 === parent) {
            break main_loop;
          }
          var parent_sibling = parent.next;
          if (parent_sibling !== null) {
            current_effect = parent_sibling;
            continue main_loop;
          }
          parent = parent.parent;
        }
      }
      current_effect = sibling2;
    }
    for (var i2 = 0; i2 < effects.length; i2++) {
      child2 = effects[i2];
      collected_effects.push(child2);
      process_effects(child2, collected_effects);
    }
  }
  function get(signal) {
    var flags = signal.f;
    if ((flags & DESTROYED) !== 0) {
      return signal.v;
    }
    if (active_reaction !== null) {
      if (derived_sources !== null && derived_sources.includes(signal)) {
        state_unsafe_local_read();
      }
      var deps = active_reaction.deps;
      if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
        skipped_deps++;
      } else if (new_deps === null) {
        new_deps = [signal];
      } else {
        new_deps.push(signal);
      }
      if (untracked_writes !== null && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & BRANCH_EFFECT) === 0 && untracked_writes.includes(signal)) {
        set_signal_status(active_effect, DIRTY);
        schedule_effect(active_effect);
      }
    }
    if ((flags & DERIVED) !== 0) {
      var derived2 = (
        /** @type {Derived} */
        signal
      );
      if (check_dirtiness(derived2)) {
        update_derived(derived2);
      }
    }
    return signal.v;
  }
  function untrack(fn2) {
    const previous_reaction = active_reaction;
    try {
      active_reaction = null;
      return fn2();
    } finally {
      active_reaction = previous_reaction;
    }
  }
  const STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
  function set_signal_status(signal, status) {
    signal.f = signal.f & STATUS_MASK | status;
  }
  function getContext(key) {
    const context_map = get_or_init_context_map();
    const result = (
      /** @type {T} */
      context_map.get(key)
    );
    return result;
  }
  function setContext(key, context) {
    const context_map = get_or_init_context_map();
    context_map.set(key, context);
    return context;
  }
  function get_or_init_context_map(name) {
    if (component_context === null) {
      lifecycle_outside_component();
    }
    return component_context.c ?? (component_context.c = new Map(get_parent_context(component_context) || void 0));
  }
  function get_parent_context(component_context2) {
    let parent = component_context2.p;
    while (parent !== null) {
      const context_map = parent.c;
      if (context_map !== null) {
        return context_map;
      }
      parent = parent.p;
    }
    return null;
  }
  function push(props, runes = false, fn2) {
    component_context = {
      p: component_context,
      c: null,
      e: null,
      m: false,
      s: props,
      x: null,
      l: null
    };
    if (!runes) {
      component_context.l = {
        s: null,
        u: null,
        r1: [],
        r2: source(false)
      };
    }
  }
  function pop(component) {
    const context_stack_item = component_context;
    if (context_stack_item !== null) {
      const component_effects = context_stack_item.e;
      if (component_effects !== null) {
        var previous_effect = active_effect;
        var previous_reaction = active_reaction;
        context_stack_item.e = null;
        try {
          for (var i2 = 0; i2 < component_effects.length; i2++) {
            var component_effect = component_effects[i2];
            set_active_effect(component_effect.effect);
            set_active_reaction(component_effect.reaction);
            effect$3(component_effect.fn);
          }
        } finally {
          set_active_effect(previous_effect);
          set_active_reaction(previous_reaction);
        }
      }
      component_context = context_stack_item.p;
      context_stack_item.m = true;
    }
    return (
      /** @type {T} */
      {}
    );
  }
  const all_registered_events = /* @__PURE__ */ new Set();
  const root_event_handles = /* @__PURE__ */ new Set();
  function delegate(events) {
    for (var i2 = 0; i2 < events.length; i2++) {
      all_registered_events.add(events[i2]);
    }
    for (var fn2 of root_event_handles) {
      fn2(events);
    }
  }
  function handle_event_propagation(event) {
    var _a;
    var handler_element = this;
    var owner_document = (
      /** @type {Node} */
      handler_element.ownerDocument
    );
    var event_name = event.type;
    var path = ((_a = event.composedPath) == null ? void 0 : _a.call(event)) || [];
    var current_target = (
      /** @type {null | Element} */
      path[0] || event.target
    );
    var path_idx = 0;
    var handled_at = event.__root;
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
      window)) {
        event.__root = handler_element;
        return;
      }
      var handler_idx = path.indexOf(handler_element);
      if (handler_idx === -1) {
        return;
      }
      if (at_idx <= handler_idx) {
        path_idx = at_idx;
      }
    }
    current_target = /** @type {Element} */
    path[path_idx] || event.target;
    if (current_target === handler_element) return;
    define_property(event, "currentTarget", {
      configurable: true,
      get() {
        return current_target || owner_document;
      }
    });
    try {
      var throw_error;
      var other_errors = [];
      while (current_target !== null) {
        var parent_element = current_target.assignedSlot || current_target.parentNode || /** @type {any} */
        current_target.host || null;
        try {
          var delegated = current_target["__" + event_name];
          if (delegated !== void 0 && !/** @type {any} */
          current_target.disabled) {
            if (is_array(delegated)) {
              var [fn2, ...data] = delegated;
              fn2.apply(current_target, [event, ...data]);
            } else {
              delegated.call(current_target, event);
            }
          }
        } catch (error) {
          if (throw_error) {
            other_errors.push(error);
          } else {
            throw_error = error;
          }
        }
        if (event.cancelBubble || parent_element === handler_element || parent_element === null) {
          break;
        }
        current_target = parent_element;
      }
      if (throw_error) {
        for (let error of other_errors) {
          queueMicrotask(() => {
            throw error;
          });
        }
        throw throw_error;
      }
    } finally {
      event.__root = handler_element;
      delete event.currentTarget;
    }
  }
  function create_fragment_from_html(html) {
    var elem = document.createElement("template");
    elem.innerHTML = html;
    return elem.content;
  }
  function assign_nodes(start2, end2) {
    var effect3 = (
      /** @type {Effect} */
      active_effect
    );
    if (effect3.nodes_start === null) {
      effect3.nodes_start = start2;
      effect3.nodes_end = end2;
    }
  }
  // @__NO_SIDE_EFFECTS__
  function template(content, flags) {
    var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
    var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;
    var node;
    var has_start = !content.startsWith("<!>");
    return () => {
      if (node === void 0) {
        node = create_fragment_from_html(has_start ? content : "<!>" + content);
        if (!is_fragment) node = /** @type {Node} */
        /* @__PURE__ */ get_first_child(node);
      }
      var clone = (
        /** @type {TemplateNode} */
        use_import_node ? document.importNode(node, true) : node.cloneNode(true)
      );
      if (is_fragment) {
        var start2 = (
          /** @type {TemplateNode} */
          /* @__PURE__ */ get_first_child(clone)
        );
        var end2 = (
          /** @type {TemplateNode} */
          clone.lastChild
        );
        assign_nodes(start2, end2);
      } else {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  function comment() {
    var frag = document.createDocumentFragment();
    var start2 = document.createComment("");
    var anchor = create_text();
    frag.append(start2, anchor);
    assign_nodes(start2, anchor);
    return frag;
  }
  function append(anchor, dom) {
    if (anchor === null) {
      return;
    }
    anchor.before(
      /** @type {Node} */
      dom
    );
  }
  const PASSIVE_EVENTS = ["touchstart", "touchmove"];
  function is_passive_event(name) {
    return PASSIVE_EVENTS.includes(name);
  }
  function set_text(text, value) {
    var str = value == null ? "" : typeof value === "object" ? value + "" : value;
    if (str !== (text.__t ?? (text.__t = text.nodeValue))) {
      text.__t = str;
      text.nodeValue = str == null ? "" : str + "";
    }
  }
  function mount(component, options) {
    return _mount(component, options);
  }
  const document_listeners = /* @__PURE__ */ new Map();
  function _mount(Component, { target, anchor, props = {}, events, context, intro = true }) {
    init_operations();
    var registered_events = /* @__PURE__ */ new Set();
    var event_handle = (events2) => {
      for (var i2 = 0; i2 < events2.length; i2++) {
        var event_name = events2[i2];
        if (registered_events.has(event_name)) continue;
        registered_events.add(event_name);
        var passive2 = is_passive_event(event_name);
        target.addEventListener(event_name, handle_event_propagation, { passive: passive2 });
        var n2 = document_listeners.get(event_name);
        if (n2 === void 0) {
          document.addEventListener(event_name, handle_event_propagation, { passive: passive2 });
          document_listeners.set(event_name, 1);
        } else {
          document_listeners.set(event_name, n2 + 1);
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    var component = void 0;
    var unmount = effect_root(() => {
      var anchor_node = anchor ?? target.appendChild(create_text());
      branch(() => {
        if (context) {
          push({});
          var ctx = (
            /** @type {ComponentContext} */
            component_context
          );
          ctx.c = context;
        }
        if (events) {
          props.$$events = events;
        }
        component = Component(anchor_node, props) || {};
        if (context) {
          pop();
        }
      });
      return () => {
        var _a;
        for (var event_name of registered_events) {
          target.removeEventListener(event_name, handle_event_propagation);
          var n2 = (
            /** @type {number} */
            document_listeners.get(event_name)
          );
          if (--n2 === 0) {
            document.removeEventListener(event_name, handle_event_propagation);
            document_listeners.delete(event_name);
          } else {
            document_listeners.set(event_name, n2);
          }
        }
        root_event_handles.delete(event_handle);
        mounted_components.delete(component);
        if (anchor_node !== anchor) {
          (_a = anchor_node.parentNode) == null ? void 0 : _a.removeChild(anchor_node);
        }
      };
    });
    mounted_components.set(component, unmount);
    return component;
  }
  let mounted_components = /* @__PURE__ */ new WeakMap();
  function if_block(node, get_condition, consequent_fn, alternate_fn = null, elseif = false) {
    var anchor = node;
    var consequent_effect = null;
    var alternate_effect = null;
    var condition = null;
    var flags = elseif ? EFFECT_TRANSPARENT : 0;
    block(() => {
      if (condition === (condition = !!get_condition())) return;
      if (condition) {
        if (consequent_effect) {
          resume_effect(consequent_effect);
        } else {
          consequent_effect = branch(() => consequent_fn(anchor));
        }
        if (alternate_effect) {
          pause_effect(alternate_effect, () => {
            alternate_effect = null;
          });
        }
      } else {
        if (alternate_effect) {
          resume_effect(alternate_effect);
        } else if (alternate_fn) {
          alternate_effect = branch(() => alternate_fn(anchor));
        }
        if (consequent_effect) {
          pause_effect(consequent_effect, () => {
            consequent_effect = null;
          });
        }
      }
    }, flags);
  }
  let current_each_item = null;
  function index(_, i2) {
    return i2;
  }
  function pause_effects(state2, items, controlled_anchor, items_map) {
    var transitions = [];
    var length = items.length;
    for (var i2 = 0; i2 < length; i2++) {
      pause_children(items[i2].e, transitions, true);
    }
    var is_controlled = length > 0 && transitions.length === 0 && controlled_anchor !== null;
    if (is_controlled) {
      var parent_node = (
        /** @type {Element} */
        /** @type {Element} */
        controlled_anchor.parentNode
      );
      clear_text_content(parent_node);
      parent_node.append(
        /** @type {Element} */
        controlled_anchor
      );
      items_map.clear();
      link(state2, items[0].prev, items[length - 1].next);
    }
    run_out_transitions(transitions, () => {
      for (var i3 = 0; i3 < length; i3++) {
        var item = items[i3];
        if (!is_controlled) {
          items_map.delete(item.k);
          link(state2, item.prev, item.next);
        }
        destroy_effect(item.e, !is_controlled);
      }
    });
  }
  function each(node, flags, get_collection, get_key, render_fn, fallback_fn = null) {
    var anchor = node;
    var state2 = { flags, items: /* @__PURE__ */ new Map(), first: null };
    var is_controlled = (flags & EACH_IS_CONTROLLED) !== 0;
    if (is_controlled) {
      var parent_node = (
        /** @type {Element} */
        node
      );
      anchor = parent_node.appendChild(create_text());
    }
    var fallback = null;
    block(() => {
      var collection = get_collection();
      var array = is_array(collection) ? collection : collection == null ? [] : array_from(collection);
      var length = array.length;
      {
        reconcile(array, state2, anchor, render_fn, flags, get_key);
      }
      if (fallback_fn !== null) {
        if (length === 0) {
          if (fallback) {
            resume_effect(fallback);
          } else {
            fallback = branch(() => fallback_fn(anchor));
          }
        } else if (fallback !== null) {
          pause_effect(fallback, () => {
            fallback = null;
          });
        }
      }
    });
  }
  function reconcile(array, state2, anchor, render_fn, flags, get_key) {
    var _a, _b, _c, _d;
    var is_animated = (flags & EACH_IS_ANIMATED) !== 0;
    var should_update = (flags & (EACH_ITEM_REACTIVE | EACH_INDEX_REACTIVE)) !== 0;
    var length = array.length;
    var items = state2.items;
    var first = state2.first;
    var current = first;
    var seen;
    var prev = null;
    var to_animate;
    var matched = [];
    var stashed = [];
    var value;
    var key;
    var item;
    var i2;
    if (is_animated) {
      for (i2 = 0; i2 < length; i2 += 1) {
        value = array[i2];
        key = get_key(value, i2);
        item = items.get(key);
        if (item !== void 0) {
          (_a = item.a) == null ? void 0 : _a.measure();
          (to_animate ?? (to_animate = /* @__PURE__ */ new Set())).add(item);
        }
      }
    }
    for (i2 = 0; i2 < length; i2 += 1) {
      value = array[i2];
      key = get_key(value, i2);
      item = items.get(key);
      if (item === void 0) {
        var child_anchor = current ? (
          /** @type {TemplateNode} */
          current.e.nodes_start
        ) : anchor;
        prev = create_item(
          child_anchor,
          state2,
          prev,
          prev === null ? state2.first : prev.next,
          value,
          key,
          i2,
          render_fn,
          flags
        );
        items.set(key, prev);
        matched = [];
        stashed = [];
        current = prev.next;
        continue;
      }
      if (should_update) {
        update_item(item, value, i2, flags);
      }
      if ((item.e.f & INERT) !== 0) {
        resume_effect(item.e);
        if (is_animated) {
          (_b = item.a) == null ? void 0 : _b.unfix();
          (to_animate ?? (to_animate = /* @__PURE__ */ new Set())).delete(item);
        }
      }
      if (item !== current) {
        if (seen !== void 0 && seen.has(item)) {
          if (matched.length < stashed.length) {
            var start2 = stashed[0];
            var j;
            prev = start2.prev;
            var a2 = matched[0];
            var b = matched[matched.length - 1];
            for (j = 0; j < matched.length; j += 1) {
              move(matched[j], start2, anchor);
            }
            for (j = 0; j < stashed.length; j += 1) {
              seen.delete(stashed[j]);
            }
            link(state2, a2.prev, b.next);
            link(state2, prev, a2);
            link(state2, b, start2);
            current = start2;
            prev = b;
            i2 -= 1;
            matched = [];
            stashed = [];
          } else {
            seen.delete(item);
            move(item, current, anchor);
            link(state2, item.prev, item.next);
            link(state2, item, prev === null ? state2.first : prev.next);
            link(state2, prev, item);
            prev = item;
          }
          continue;
        }
        matched = [];
        stashed = [];
        while (current !== null && current.k !== key) {
          if ((current.e.f & INERT) === 0) {
            (seen ?? (seen = /* @__PURE__ */ new Set())).add(current);
          }
          stashed.push(current);
          current = current.next;
        }
        if (current === null) {
          continue;
        }
        item = current;
      }
      matched.push(item);
      prev = item;
      current = item.next;
    }
    if (current !== null || seen !== void 0) {
      var to_destroy = seen === void 0 ? [] : array_from(seen);
      while (current !== null) {
        if ((current.e.f & INERT) === 0) {
          to_destroy.push(current);
        }
        current = current.next;
      }
      var destroy_length = to_destroy.length;
      if (destroy_length > 0) {
        var controlled_anchor = (flags & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
        if (is_animated) {
          for (i2 = 0; i2 < destroy_length; i2 += 1) {
            (_c = to_destroy[i2].a) == null ? void 0 : _c.measure();
          }
          for (i2 = 0; i2 < destroy_length; i2 += 1) {
            (_d = to_destroy[i2].a) == null ? void 0 : _d.fix();
          }
        }
        pause_effects(state2, to_destroy, controlled_anchor, items);
      }
    }
    if (is_animated) {
      queue_micro_task(() => {
        var _a2;
        if (to_animate === void 0) return;
        for (item of to_animate) {
          (_a2 = item.a) == null ? void 0 : _a2.apply();
        }
      });
    }
    active_effect.first = state2.first && state2.first.e;
    active_effect.last = prev && prev.e;
  }
  function update_item(item, value, index2, type) {
    if ((type & EACH_ITEM_REACTIVE) !== 0) {
      set(item.v, value);
    }
    if ((type & EACH_INDEX_REACTIVE) !== 0) {
      set(
        /** @type {Value<number>} */
        item.i,
        index2
      );
    } else {
      item.i = index2;
    }
  }
  function create_item(anchor, state2, prev, next, value, key, index2, render_fn, flags) {
    var previous_each_item = current_each_item;
    try {
      var reactive = (flags & EACH_ITEM_REACTIVE) !== 0;
      var mutable = (flags & EACH_ITEM_IMMUTABLE) === 0;
      var v = reactive ? mutable ? /* @__PURE__ */ mutable_source(value) : source(value) : value;
      var i2 = (flags & EACH_INDEX_REACTIVE) === 0 ? index2 : source(index2);
      var item = {
        i: i2,
        v,
        k: key,
        a: null,
        // @ts-expect-error
        e: null,
        prev,
        next
      };
      current_each_item = item;
      item.e = branch(() => render_fn(anchor, v, i2), hydrating);
      item.e.prev = prev && prev.e;
      item.e.next = next && next.e;
      if (prev === null) {
        state2.first = item;
      } else {
        prev.next = item;
        prev.e.next = item.e;
      }
      if (next !== null) {
        next.prev = item;
        next.e.prev = item.e;
      }
      return item;
    } finally {
      current_each_item = previous_each_item;
    }
  }
  function move(item, next, anchor) {
    var end2 = item.next ? (
      /** @type {TemplateNode} */
      item.next.e.nodes_start
    ) : anchor;
    var dest = next ? (
      /** @type {TemplateNode} */
      next.e.nodes_start
    ) : anchor;
    var node = (
      /** @type {TemplateNode} */
      item.e.nodes_start
    );
    while (node !== end2) {
      var next_node = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node)
      );
      dest.before(node);
      node = next_node;
    }
  }
  function link(state2, prev, next) {
    if (prev === null) {
      state2.first = next;
    } else {
      prev.next = next;
      prev.e.next = next && next.e;
    }
    if (next !== null) {
      next.prev = prev;
      next.e.prev = prev && prev.e;
    }
  }
  function snippet(node, get_snippet, ...args) {
    var anchor = node;
    var snippet2 = noop;
    var snippet_effect;
    block(() => {
      if (snippet2 === (snippet2 = get_snippet())) return;
      if (snippet_effect) {
        destroy_effect(snippet_effect);
        snippet_effect = null;
      }
      snippet_effect = branch(() => (
        /** @type {SnippetFn} */
        snippet2(anchor, ...args)
      ));
    }, EFFECT_TRANSPARENT);
  }
  function action(dom, action2, get_value) {
    effect$3(() => {
      var payload = untrack(() => action2(dom, get_value == null ? void 0 : get_value()) || {});
      if (payload == null ? void 0 : payload.destroy) {
        return () => (
          /** @type {Function} */
          payload.destroy()
        );
      }
    });
  }
  let listening_to_form_reset = false;
  function add_form_reset_listener() {
    if (!listening_to_form_reset) {
      listening_to_form_reset = true;
      document.addEventListener(
        "reset",
        (evt) => {
          Promise.resolve().then(() => {
            var _a;
            if (!evt.defaultPrevented) {
              for (
                const e2 of
                /**@type {HTMLFormElement} */
                evt.target.elements
              ) {
                (_a = e2.__on_r) == null ? void 0 : _a.call(e2);
              }
            }
          });
        },
        // In the capture phase to guarantee we get noticed of it (no possiblity of stopPropagation)
        { capture: true }
      );
    }
  }
  function set_attribute(element, attribute, value, skip_warning) {
    var attributes = element.__attributes ?? (element.__attributes = {});
    if (attributes[attribute] === (attributes[attribute] = value)) return;
    if (attribute === "loading") {
      element[LOADING_ATTR_SYMBOL] = value;
    }
    if (value == null) {
      element.removeAttribute(attribute);
    } else if (typeof value !== "string" && get_setters(element).includes(attribute)) {
      element[attribute] = value;
    } else {
      element.setAttribute(attribute, value);
    }
  }
  var setters_cache = /* @__PURE__ */ new Map();
  function get_setters(element) {
    var setters = setters_cache.get(element.nodeName);
    if (setters) return setters;
    setters_cache.set(element.nodeName, setters = []);
    var descriptors;
    var proto = get_prototype_of(element);
    while (proto.constructor.name !== "Element") {
      descriptors = get_descriptors(proto);
      for (var key in descriptors) {
        if (descriptors[key].set) {
          setters.push(key);
        }
      }
      proto = get_prototype_of(proto);
    }
    return setters;
  }
  function toggle_class(dom, class_name, value) {
    if (value) {
      if (dom.classList.contains(class_name)) return;
      dom.classList.add(class_name);
    } else {
      if (!dom.classList.contains(class_name)) return;
      dom.classList.remove(class_name);
    }
  }
  function listen_to_event_and_reset_event(element, event, handler, on_reset = handler) {
    element.addEventListener(event, handler);
    const prev = element.__on_r;
    if (prev) {
      element.__on_r = () => {
        prev();
        on_reset();
      };
    } else {
      element.__on_r = on_reset;
    }
    add_form_reset_listener();
  }
  function bind_value(input, get2, set2 = get2) {
    var runes = is_runes();
    listen_to_event_and_reset_event(input, "input", () => {
      var value = is_numberlike_input(input) ? to_number(input.value) : input.value;
      set2(value);
      if (runes && value !== (value = get2())) {
        input.value = value ?? "";
      }
    });
    render_effect(() => {
      var value = get2();
      if (is_numberlike_input(input) && value === to_number(input.value)) {
        return;
      }
      if (input.type === "date" && !value && !input.value) {
        return;
      }
      input.value = value ?? "";
    });
  }
  function bind_checked(input, get2, set2 = get2) {
    listen_to_event_and_reset_event(input, "change", () => {
      var value = input.checked;
      set2(value);
    });
    if (get2() == void 0) {
      set2(false);
    }
    render_effect(() => {
      var value = get2();
      input.checked = Boolean(value);
    });
  }
  function is_numberlike_input(input) {
    var type = input.type;
    return type === "number" || type === "range";
  }
  function to_number(value) {
    return value === "" ? null : +value;
  }
  function select_option(select, value, mounting) {
    if (select.multiple) {
      return select_options(select, value);
    }
    for (var option of select.options) {
      var option_value = get_option_value(option);
      if (is(option_value, value)) {
        option.selected = true;
        return;
      }
    }
    if (!mounting || value !== void 0) {
      select.selectedIndex = -1;
    }
  }
  function init_select(select, get_value) {
    effect$3(() => {
      var observer = new MutationObserver(() => {
        var value = select.__value;
        select_option(select, value);
      });
      observer.observe(select, {
        // Listen to option element changes
        childList: true,
        subtree: true,
        // because of <optgroup>
        // Listen to option element value attribute changes
        // (doesn't get notified of select value changes,
        // because that property is not reflected as an attribute)
        attributes: true,
        attributeFilter: ["value"]
      });
      return () => {
        observer.disconnect();
      };
    });
  }
  function bind_select_value(select, get2, set2 = get2) {
    var mounting = true;
    listen_to_event_and_reset_event(select, "change", () => {
      var value;
      if (select.multiple) {
        value = [].map.call(select.querySelectorAll(":checked"), get_option_value);
      } else {
        var selected_option = select.querySelector(":checked");
        value = selected_option && get_option_value(selected_option);
      }
      set2(value);
    });
    effect$3(() => {
      var value = get2();
      select_option(select, value, mounting);
      if (mounting && value === void 0) {
        var selected_option = select.querySelector(":checked");
        if (selected_option !== null) {
          value = get_option_value(selected_option);
          set2(value);
        }
      }
      select.__value = value;
      mounting = false;
    });
    init_select(select);
  }
  function select_options(select, value) {
    for (var option of select.options) {
      option.selected = ~value.indexOf(get_option_value(option));
    }
  }
  function get_option_value(option) {
    if ("__value" in option) {
      return option.__value;
    } else {
      return option.value;
    }
  }
  function is_bound_this(bound_value, element_or_component) {
    return bound_value === element_or_component || (bound_value == null ? void 0 : bound_value[STATE_SYMBOL]) === element_or_component;
  }
  function bind_this(element_or_component = {}, update, get_value, get_parts) {
    effect$3(() => {
      var old_parts;
      var parts;
      render_effect(() => {
        old_parts = parts;
        parts = [];
        untrack(() => {
          if (element_or_component !== get_value(...parts)) {
            update(element_or_component, ...parts);
            if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) {
              update(null, ...old_parts);
            }
          }
        });
      });
      return () => {
        queue_micro_task(() => {
          if (parts && is_bound_this(get_value(...parts), element_or_component)) {
            update(null, ...parts);
          }
        });
      };
    });
    return element_or_component;
  }
  function prop(props, key, flags, fallback) {
    var _a;
    var immutable = (flags & PROPS_IS_IMMUTABLE) !== 0;
    var runes = (flags & PROPS_IS_RUNES) !== 0;
    var bindable = (flags & PROPS_IS_BINDABLE) !== 0;
    var lazy = (flags & PROPS_IS_LAZY_INITIAL) !== 0;
    var prop_value = (
      /** @type {V} */
      props[key]
    );
    var setter = (_a = get_descriptor(props, key)) == null ? void 0 : _a.set;
    var fallback_value = (
      /** @type {V} */
      fallback
    );
    var fallback_dirty = true;
    var fallback_used = false;
    var get_fallback = () => {
      fallback_used = true;
      if (fallback_dirty) {
        fallback_dirty = false;
        if (lazy) {
          fallback_value = untrack(
            /** @type {() => V} */
            fallback
          );
        } else {
          fallback_value = /** @type {V} */
          fallback;
        }
      }
      return fallback_value;
    };
    if (prop_value === void 0 && fallback !== void 0) {
      if (setter && runes) {
        props_invalid_value();
      }
      prop_value = get_fallback();
      if (setter) setter(prop_value);
    }
    var getter;
    if (runes) {
      getter = () => {
        var value = (
          /** @type {V} */
          props[key]
        );
        if (value === void 0) return get_fallback();
        fallback_dirty = true;
        fallback_used = false;
        return value;
      };
    } else {
      var derived_getter = (immutable ? derived : derived_safe_equal)(
        () => (
          /** @type {V} */
          props[key]
        )
      );
      derived_getter.f |= LEGACY_DERIVED_PROP;
      getter = () => {
        var value = get(derived_getter);
        if (value !== void 0) fallback_value = /** @type {V} */
        void 0;
        return value === void 0 ? fallback_value : value;
      };
    }
    if ((flags & PROPS_IS_UPDATED) === 0) {
      return getter;
    }
    if (setter) {
      var legacy_parent = props.$$legacy;
      return function(value, mutation) {
        if (arguments.length > 0) {
          if (!runes || !mutation || legacy_parent) {
            setter(mutation ? getter() : value);
          }
          return value;
        } else {
          return getter();
        }
      };
    }
    var from_child = false;
    var inner_current_value = /* @__PURE__ */ mutable_source(prop_value);
    var current_value = /* @__PURE__ */ derived(() => {
      var parent_value = getter();
      var child_value = get(inner_current_value);
      if (from_child) {
        from_child = false;
        return child_value;
      }
      return inner_current_value.v = parent_value;
    });
    if (!immutable) current_value.equals = safe_equals;
    return function(value, mutation) {
      var current = get(current_value);
      if (arguments.length > 0) {
        const new_value = mutation ? get(current_value) : runes && bindable ? proxy(value) : value;
        if (!current_value.equals(new_value)) {
          from_child = true;
          set(inner_current_value, new_value);
          if (fallback_used && fallback_value !== void 0) {
            fallback_value = new_value;
          }
          get(current_value);
        }
        return value;
      }
      return current;
    };
  }
  function onMount(fn2) {
    if (component_context === null) {
      lifecycle_outside_component();
    }
    if (component_context.l !== null) {
      init_update_callbacks(component_context).m.push(fn2);
    } else {
      user_effect(() => {
        const cleanup = untrack(fn2);
        if (typeof cleanup === "function") return (
          /** @type {() => void} */
          cleanup
        );
      });
    }
  }
  function init_update_callbacks(context) {
    var l = (
      /** @type {ComponentContextLegacy} */
      context.l
    );
    return l.u ?? (l.u = { a: [], b: [], m: [] });
  }
  const PUBLIC_VERSION = "5";
  if (typeof window !== "undefined")
    (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
  const segmenter = new Intl.Segmenter();
  function segment(text) {
    return [...segmenter.segment(text)].map(({ segment: segment2 }) => segment2);
  }
  class Editor {
    constructor() {
      __privateAdd(this, _text, state(""));
      __privateAdd(this, _segments, /* @__PURE__ */ derived(() => segment(get(__privateGet(this, _text)))));
      __privateAdd(this, _selectedText, state(""));
    }
    /**
     * The text of the editor.
     *
     * This value is a reactive `$state()` and read-only.
     */
    get text() {
      return get(__privateGet(this, _text));
    }
    /**
     * @internal must be set by the editor implementation during text change
     */
    set text(text) {
      set(__privateGet(this, _text), proxy(text));
    }
    get segments() {
      return get(__privateGet(this, _segments));
    }
    /**
     * The text that is currently selected in the editor.
     *
     * This value is a reactive `$state()` and read-only.
     *
     * If there is no selection, this will be an empty string (`""`).
     *
     * For CodeMirror, if there are multiple selections, it will be
     * separated by `editor.codeMirror.doc.lineSeparator()`
     * (by default `editor.codeMirror.doc.lineSep || "\n"`).
     */
    get selectedText() {
      return get(__privateGet(this, _selectedText));
    }
    /**
     * @internal must be set by the editor implementation during selection change
     */
    set selectedText(selectedText) {
      set(__privateGet(this, _selectedText), proxy(selectedText));
    }
  }
  _text = new WeakMap();
  _segments = new WeakMap();
  _selectedText = new WeakMap();
  class KojiEditor extends Editor {
    constructor(wrapper) {
      super();
      __publicField(this, "wrapper");
      __publicField(this, "editor");
      this.wrapper = wrapper;
      if (!this.wrapper.__vue__) {
        throw new Error("KojiEditor: wrapper is not a Vue component");
      }
      this.editor = this.wrapper.__vue__.editor;
      this.editor.watch("selection", () => {
        this.selectedText = this.editor.selectedText;
      });
      this.editor.watch("requestedSrc", () => {
        this.text = this.editor.value;
      });
    }
    insertAtCursor(textToInsert) {
      this.editor.insertOrReplace(textToInsert);
    }
    replaceSelection(replacer) {
      this.editor.insertOrReplace(replacer(this.selectedText ?? ""));
    }
    markText(text) {
      const allChars = this.wrapper.querySelectorAll(".token .char");
      for (const char of allChars) {
        if (char.textContent === text) {
          char.classList.add("highlight-variant");
        }
      }
    }
    toggleClass(className, enabled) {
      if (enabled === void 0) {
        this.wrapper.classList.toggle(className);
      } else if (enabled) {
        this.wrapper.classList.add(className);
      } else {
        this.wrapper.classList.remove(className);
      }
    }
  }
  class CodeMirrorEditor extends Editor {
    constructor(codeMirror) {
      super();
      this.codeMirror = codeMirror;
      if (!codeMirror) {
        throw new Error("[honkoku-toolbox] CodeMirrorEditor is not valid");
      }
      this.codeMirror = codeMirror;
      this.codeMirror.on("cursorActivity", () => {
        this.selectedText = this.codeMirror.getSelection();
      });
      this.codeMirror.on("change", () => {
        this.text = this.codeMirror.getValue();
      });
    }
    insertAtCursor(textToInsert) {
      if (this.codeMirror.somethingSelected()) {
        this.replaceSelection((_) => textToInsert);
      } else {
        const cursor = this.codeMirror.getCursor();
        this.codeMirror.replaceRange(textToInsert, cursor);
      }
    }
    replaceSelection(replacer) {
      const replacedText = replacer(this.selectedText ?? "");
      this.codeMirror.replaceSelection(replacedText);
    }
    markText(substr) {
      if (!substr || !this.text.includes(substr)) return;
      const textClusters = segment(this.text);
      const substrClusters = segment(substr);
      const clusterCodeUnitIndices = [0];
      for (let i2 = 0; i2 < textClusters.length; (i2 += 1) - 1) {
        clusterCodeUnitIndices.push(clusterCodeUnitIndices[i2] + textClusters[i2].length);
      }
      const occurrences = [];
      for (let i2 = 0; i2 <= textClusters.length - substrClusters.length; (i2 += 1) - 1) {
        let match = true;
        for (let j = 0; j < substrClusters.length; (j += 1) - 1) {
          if (textClusters[i2 + j] !== substrClusters[j]) {
            match = false;
            break;
          }
        }
        if (match) {
          const startIndex = clusterCodeUnitIndices[i2];
          const endIndex = clusterCodeUnitIndices[i2 + substrClusters.length];
          occurrences.push({ startIndex, endIndex });
        }
      }
      for (const occurrence of occurrences) {
        const textPosStart = this.codeMirror.posFromIndex(occurrence.startIndex);
        const textPosEnd = this.codeMirror.posFromIndex(occurrence.endIndex);
        this.codeMirror.markText(textPosStart, textPosEnd, { className: "highlight-variant" });
      }
    }
    toggleClass(className, enabled) {
      if (enabled === void 0) {
        this.codeMirror.getWrapperElement().classList.toggle(className);
      } else if (enabled) {
        this.codeMirror.getWrapperElement().classList.add(className);
      } else {
        this.codeMirror.getWrapperElement().classList.remove(className);
      }
    }
  }
  var top = "top";
  var bottom = "bottom";
  var right = "right";
  var left = "left";
  var auto = "auto";
  var basePlacements = [top, bottom, right, left];
  var start = "start";
  var end = "end";
  var clippingParents = "clippingParents";
  var viewport = "viewport";
  var popper = "popper";
  var reference = "reference";
  var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
    return acc.concat([placement + "-" + start, placement + "-" + end]);
  }, []);
  var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
    return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
  }, []);
  var beforeRead = "beforeRead";
  var read = "read";
  var afterRead = "afterRead";
  var beforeMain = "beforeMain";
  var main = "main";
  var afterMain = "afterMain";
  var beforeWrite = "beforeWrite";
  var write = "write";
  var afterWrite = "afterWrite";
  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
  function getNodeName(element) {
    return element ? (element.nodeName || "").toLowerCase() : null;
  }
  function getWindow(node) {
    if (node == null) {
      return window;
    }
    if (node.toString() !== "[object Window]") {
      var ownerDocument = node.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView || window : window;
    }
    return node;
  }
  function isElement$1(node) {
    var OwnElement = getWindow(node).Element;
    return node instanceof OwnElement || node instanceof Element;
  }
  function isHTMLElement(node) {
    var OwnElement = getWindow(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
  }
  function isShadowRoot(node) {
    if (typeof ShadowRoot === "undefined") {
      return false;
    }
    var OwnElement = getWindow(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
  }
  function applyStyles(_ref) {
    var state2 = _ref.state;
    Object.keys(state2.elements).forEach(function(name) {
      var style = state2.styles[name] || {};
      var attributes = state2.attributes[name] || {};
      var element = state2.elements[name];
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(name2) {
        var value = attributes[name2];
        if (value === false) {
          element.removeAttribute(name2);
        } else {
          element.setAttribute(name2, value === true ? "" : value);
        }
      });
    });
  }
  function effect$2(_ref2) {
    var state2 = _ref2.state;
    var initialStyles = {
      popper: {
        position: state2.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    Object.assign(state2.elements.popper.style, initialStyles.popper);
    state2.styles = initialStyles;
    if (state2.elements.arrow) {
      Object.assign(state2.elements.arrow.style, initialStyles.arrow);
    }
    return function() {
      Object.keys(state2.elements).forEach(function(name) {
        var element = state2.elements[name];
        var attributes = state2.attributes[name] || {};
        var styleProperties = Object.keys(state2.styles.hasOwnProperty(name) ? state2.styles[name] : initialStyles[name]);
        var style = styleProperties.reduce(function(style2, property) {
          style2[property] = "";
          return style2;
        }, {});
        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        }
        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function(attribute) {
          element.removeAttribute(attribute);
        });
      });
    };
  }
  const applyStyles$1 = {
    name: "applyStyles",
    enabled: true,
    phase: "write",
    fn: applyStyles,
    effect: effect$2,
    requires: ["computeStyles"]
  };
  function getBasePlacement$1(placement) {
    return placement.split("-")[0];
  }
  var max = Math.max;
  var min = Math.min;
  var round = Math.round;
  function getUAString() {
    var uaData = navigator.userAgentData;
    if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
      return uaData.brands.map(function(item) {
        return item.brand + "/" + item.version;
      }).join(" ");
    }
    return navigator.userAgent;
  }
  function isLayoutViewport() {
    return !/^((?!chrome|android).)*safari/i.test(getUAString());
  }
  function getBoundingClientRect(element, includeScale, isFixedStrategy) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    var clientRect = element.getBoundingClientRect();
    var scaleX = 1;
    var scaleY = 1;
    if (includeScale && isHTMLElement(element)) {
      scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
      scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
    }
    var _ref = isElement$1(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
    var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
    var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
    var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
    var width = clientRect.width / scaleX;
    var height = clientRect.height / scaleY;
    return {
      width,
      height,
      top: y,
      right: x + width,
      bottom: y + height,
      left: x,
      x,
      y
    };
  }
  function getLayoutRect(element) {
    var clientRect = getBoundingClientRect(element);
    var width = element.offsetWidth;
    var height = element.offsetHeight;
    if (Math.abs(clientRect.width - width) <= 1) {
      width = clientRect.width;
    }
    if (Math.abs(clientRect.height - height) <= 1) {
      height = clientRect.height;
    }
    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width,
      height
    };
  }
  function contains(parent, child2) {
    var rootNode = child2.getRootNode && child2.getRootNode();
    if (parent.contains(child2)) {
      return true;
    } else if (rootNode && isShadowRoot(rootNode)) {
      var next = child2;
      do {
        if (next && parent.isSameNode(next)) {
          return true;
        }
        next = next.parentNode || next.host;
      } while (next);
    }
    return false;
  }
  function getComputedStyle(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function isTableElement(element) {
    return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
  }
  function getDocumentElement(element) {
    return ((isElement$1(element) ? element.ownerDocument : (
      // $FlowFixMe[prop-missing]
      element.document
    )) || window.document).documentElement;
  }
  function getParentNode(element) {
    if (getNodeName(element) === "html") {
      return element;
    }
    return (
      // this is a quicker (but less type safe) way to save quite some bytes from the bundle
      // $FlowFixMe[incompatible-return]
      // $FlowFixMe[prop-missing]
      element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
      element.parentNode || // DOM Element detected
      (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
      getDocumentElement(element)
    );
  }
  function getTrueOffsetParent(element) {
    if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
    getComputedStyle(element).position === "fixed") {
      return null;
    }
    return element.offsetParent;
  }
  function getContainingBlock(element) {
    var isFirefox = /firefox/i.test(getUAString());
    var isIE = /Trident/i.test(getUAString());
    if (isIE && isHTMLElement(element)) {
      var elementCss = getComputedStyle(element);
      if (elementCss.position === "fixed") {
        return null;
      }
    }
    var currentNode = getParentNode(element);
    if (isShadowRoot(currentNode)) {
      currentNode = currentNode.host;
    }
    while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
      var css = getComputedStyle(currentNode);
      if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
        return currentNode;
      } else {
        currentNode = currentNode.parentNode;
      }
    }
    return null;
  }
  function getOffsetParent(element) {
    var window2 = getWindow(element);
    var offsetParent = getTrueOffsetParent(element);
    while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
      offsetParent = getTrueOffsetParent(offsetParent);
    }
    if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
      return window2;
    }
    return offsetParent || getContainingBlock(element) || window2;
  }
  function getMainAxisFromPlacement(placement) {
    return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
  }
  function within(min$1, value, max$1) {
    return max(min$1, min(value, max$1));
  }
  function withinMaxClamp(min2, value, max2) {
    var v = within(min2, value, max2);
    return v > max2 ? max2 : v;
  }
  function getFreshSideObject() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }
  function mergePaddingObject(paddingObject) {
    return Object.assign({}, getFreshSideObject(), paddingObject);
  }
  function expandToHashMap(value, keys) {
    return keys.reduce(function(hashMap, key) {
      hashMap[key] = value;
      return hashMap;
    }, {});
  }
  var toPaddingObject = function toPaddingObject2(padding, state2) {
    padding = typeof padding === "function" ? padding(Object.assign({}, state2.rects, {
      placement: state2.placement
    })) : padding;
    return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  };
  function arrow(_ref) {
    var _state$modifiersData$;
    var state2 = _ref.state, name = _ref.name, options = _ref.options;
    var arrowElement = state2.elements.arrow;
    var popperOffsets2 = state2.modifiersData.popperOffsets;
    var basePlacement = getBasePlacement$1(state2.placement);
    var axis = getMainAxisFromPlacement(basePlacement);
    var isVertical = [left, right].indexOf(basePlacement) >= 0;
    var len = isVertical ? "height" : "width";
    if (!arrowElement || !popperOffsets2) {
      return;
    }
    var paddingObject = toPaddingObject(options.padding, state2);
    var arrowRect = getLayoutRect(arrowElement);
    var minProp = axis === "y" ? top : left;
    var maxProp = axis === "y" ? bottom : right;
    var endDiff = state2.rects.reference[len] + state2.rects.reference[axis] - popperOffsets2[axis] - state2.rects.popper[len];
    var startDiff = popperOffsets2[axis] - state2.rects.reference[axis];
    var arrowOffsetParent = getOffsetParent(arrowElement);
    var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
    var centerToReference = endDiff / 2 - startDiff / 2;
    var min2 = paddingObject[minProp];
    var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    var offset2 = within(min2, center, max2);
    var axisProp = axis;
    state2.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
  }
  function effect$1(_ref2) {
    var state2 = _ref2.state, options = _ref2.options;
    var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
    if (arrowElement == null) {
      return;
    }
    if (typeof arrowElement === "string") {
      arrowElement = state2.elements.popper.querySelector(arrowElement);
      if (!arrowElement) {
        return;
      }
    }
    if (!contains(state2.elements.popper, arrowElement)) {
      return;
    }
    state2.elements.arrow = arrowElement;
  }
  const arrow$1 = {
    name: "arrow",
    enabled: true,
    phase: "main",
    fn: arrow,
    effect: effect$1,
    requires: ["popperOffsets"],
    requiresIfExists: ["preventOverflow"]
  };
  function getVariation(placement) {
    return placement.split("-")[1];
  }
  var unsetSides = {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto"
  };
  function roundOffsetsByDPR(_ref, win) {
    var x = _ref.x, y = _ref.y;
    var dpr = win.devicePixelRatio || 1;
    return {
      x: round(x * dpr) / dpr || 0,
      y: round(y * dpr) / dpr || 0
    };
  }
  function mapToStyles(_ref2) {
    var _Object$assign2;
    var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
    var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
    var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
      x,
      y
    }) : {
      x,
      y
    };
    x = _ref3.x;
    y = _ref3.y;
    var hasX = offsets.hasOwnProperty("x");
    var hasY = offsets.hasOwnProperty("y");
    var sideX = left;
    var sideY = top;
    var win = window;
    if (adaptive) {
      var offsetParent = getOffsetParent(popper2);
      var heightProp = "clientHeight";
      var widthProp = "clientWidth";
      if (offsetParent === getWindow(popper2)) {
        offsetParent = getDocumentElement(popper2);
        if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
          heightProp = "scrollHeight";
          widthProp = "scrollWidth";
        }
      }
      offsetParent = offsetParent;
      if (placement === top || (placement === left || placement === right) && variation === end) {
        sideY = bottom;
        var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
          // $FlowFixMe[prop-missing]
          offsetParent[heightProp]
        );
        y -= offsetY - popperRect.height;
        y *= gpuAcceleration ? 1 : -1;
      }
      if (placement === left || (placement === top || placement === bottom) && variation === end) {
        sideX = right;
        var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
          // $FlowFixMe[prop-missing]
          offsetParent[widthProp]
        );
        x -= offsetX - popperRect.width;
        x *= gpuAcceleration ? 1 : -1;
      }
    }
    var commonStyles = Object.assign({
      position
    }, adaptive && unsetSides);
    var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
      x,
      y
    }, getWindow(popper2)) : {
      x,
      y
    };
    x = _ref4.x;
    y = _ref4.y;
    if (gpuAcceleration) {
      var _Object$assign;
      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
    }
    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
  }
  function computeStyles(_ref5) {
    var state2 = _ref5.state, options = _ref5.options;
    var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
    var commonStyles = {
      placement: getBasePlacement$1(state2.placement),
      variation: getVariation(state2.placement),
      popper: state2.elements.popper,
      popperRect: state2.rects.popper,
      gpuAcceleration,
      isFixed: state2.options.strategy === "fixed"
    };
    if (state2.modifiersData.popperOffsets != null) {
      state2.styles.popper = Object.assign({}, state2.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state2.modifiersData.popperOffsets,
        position: state2.options.strategy,
        adaptive,
        roundOffsets
      })));
    }
    if (state2.modifiersData.arrow != null) {
      state2.styles.arrow = Object.assign({}, state2.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state2.modifiersData.arrow,
        position: "absolute",
        adaptive: false,
        roundOffsets
      })));
    }
    state2.attributes.popper = Object.assign({}, state2.attributes.popper, {
      "data-popper-placement": state2.placement
    });
  }
  const computeStyles$1 = {
    name: "computeStyles",
    enabled: true,
    phase: "beforeWrite",
    fn: computeStyles,
    data: {}
  };
  var passive = {
    passive: true
  };
  function effect(_ref) {
    var state2 = _ref.state, instance = _ref.instance, options = _ref.options;
    var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
    var window2 = getWindow(state2.elements.popper);
    var scrollParents = [].concat(state2.scrollParents.reference, state2.scrollParents.popper);
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.addEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.addEventListener("resize", instance.update, passive);
    }
    return function() {
      if (scroll) {
        scrollParents.forEach(function(scrollParent) {
          scrollParent.removeEventListener("scroll", instance.update, passive);
        });
      }
      if (resize) {
        window2.removeEventListener("resize", instance.update, passive);
      }
    };
  }
  const eventListeners = {
    name: "eventListeners",
    enabled: true,
    phase: "write",
    fn: function fn() {
    },
    effect,
    data: {}
  };
  var hash$1 = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, function(matched) {
      return hash$1[matched];
    });
  }
  var hash = {
    start: "end",
    end: "start"
  };
  function getOppositeVariationPlacement(placement) {
    return placement.replace(/start|end/g, function(matched) {
      return hash[matched];
    });
  }
  function getWindowScroll(node) {
    var win = getWindow(node);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
      scrollLeft,
      scrollTop
    };
  }
  function getWindowScrollBarX(element) {
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
  }
  function getViewportRect(element, strategy) {
    var win = getWindow(element);
    var html = getDocumentElement(element);
    var visualViewport = win.visualViewport;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var x = 0;
    var y = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      var layoutViewport = isLayoutViewport();
      if (layoutViewport || !layoutViewport && strategy === "fixed") {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
    return {
      width,
      height,
      x: x + getWindowScrollBarX(element),
      y
    };
  }
  function getDocumentRect(element) {
    var _element$ownerDocumen;
    var html = getDocumentElement(element);
    var winScroll = getWindowScroll(element);
    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
    var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
    var y = -winScroll.scrollTop;
    if (getComputedStyle(body || html).direction === "rtl") {
      x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
    }
    return {
      width,
      height,
      x,
      y
    };
  }
  function isScrollParent(element) {
    var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }
  function getScrollParent(node) {
    if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
      return node.ownerDocument.body;
    }
    if (isHTMLElement(node) && isScrollParent(node)) {
      return node;
    }
    return getScrollParent(getParentNode(node));
  }
  function listScrollParents(element, list) {
    var _element$ownerDocumen;
    if (list === void 0) {
      list = [];
    }
    var scrollParent = getScrollParent(element);
    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
    var win = getWindow(scrollParent);
    var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : (
      // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents(getParentNode(target)))
    );
  }
  function rectToClientRect(rect) {
    return Object.assign({}, rect, {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    });
  }
  function getInnerBoundingClientRect(element, strategy) {
    var rect = getBoundingClientRect(element, false, strategy === "fixed");
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
  }
  function getClientRectFromMixedType(element, clippingParent, strategy) {
    return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement$1(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
  }
  function getClippingParents(element) {
    var clippingParents2 = listScrollParents(getParentNode(element));
    var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
    var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
    if (!isElement$1(clipperElement)) {
      return [];
    }
    return clippingParents2.filter(function(clippingParent) {
      return isElement$1(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
    });
  }
  function getClippingRect(element, boundary, rootBoundary, strategy) {
    var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
    var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
    var firstClippingParent = clippingParents2[0];
    var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
      var rect = getClientRectFromMixedType(element, clippingParent, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromMixedType(element, firstClippingParent, strategy));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
  }
  function computeOffsets(_ref) {
    var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
    var basePlacement = placement ? getBasePlacement$1(placement) : null;
    var variation = placement ? getVariation(placement) : null;
    var commonX = reference2.x + reference2.width / 2 - element.width / 2;
    var commonY = reference2.y + reference2.height / 2 - element.height / 2;
    var offsets;
    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference2.y - element.height
        };
        break;
      case bottom:
        offsets = {
          x: commonX,
          y: reference2.y + reference2.height
        };
        break;
      case right:
        offsets = {
          x: reference2.x + reference2.width,
          y: commonY
        };
        break;
      case left:
        offsets = {
          x: reference2.x - element.width,
          y: commonY
        };
        break;
      default:
        offsets = {
          x: reference2.x,
          y: reference2.y
        };
    }
    var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
    if (mainAxis != null) {
      var len = mainAxis === "y" ? "height" : "width";
      switch (variation) {
        case start:
          offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
          break;
        case end:
          offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
          break;
      }
    }
    return offsets;
  }
  function detectOverflow(state2, options) {
    if (options === void 0) {
      options = {};
    }
    var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state2.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state2.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
    var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
    var altContext = elementContext === popper ? reference : popper;
    var popperRect = state2.rects.popper;
    var element = state2.elements[altBoundary ? altContext : elementContext];
    var clippingClientRect = getClippingRect(isElement$1(element) ? element : element.contextElement || getDocumentElement(state2.elements.popper), boundary, rootBoundary, strategy);
    var referenceClientRect = getBoundingClientRect(state2.elements.reference);
    var popperOffsets2 = computeOffsets({
      reference: referenceClientRect,
      element: popperRect,
      strategy: "absolute",
      placement
    });
    var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
    var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
    var overflowOffsets = {
      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
      bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
      left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
      right: elementClientRect.right - clippingClientRect.right + paddingObject.right
    };
    var offsetData = state2.modifiersData.offset;
    if (elementContext === popper && offsetData) {
      var offset2 = offsetData[placement];
      Object.keys(overflowOffsets).forEach(function(key) {
        var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
        var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
        overflowOffsets[key] += offset2[axis] * multiply;
      });
    }
    return overflowOffsets;
  }
  function computeAutoPlacement(state2, options) {
    if (options === void 0) {
      options = {};
    }
    var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
    var variation = getVariation(placement);
    var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
      return getVariation(placement2) === variation;
    }) : basePlacements;
    var allowedPlacements = placements$1.filter(function(placement2) {
      return allowedAutoPlacements.indexOf(placement2) >= 0;
    });
    if (allowedPlacements.length === 0) {
      allowedPlacements = placements$1;
    }
    var overflows = allowedPlacements.reduce(function(acc, placement2) {
      acc[placement2] = detectOverflow(state2, {
        placement: placement2,
        boundary,
        rootBoundary,
        padding
      })[getBasePlacement$1(placement2)];
      return acc;
    }, {});
    return Object.keys(overflows).sort(function(a2, b) {
      return overflows[a2] - overflows[b];
    });
  }
  function getExpandedFallbackPlacements(placement) {
    if (getBasePlacement$1(placement) === auto) {
      return [];
    }
    var oppositePlacement = getOppositePlacement(placement);
    return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
  }
  function flip(_ref) {
    var state2 = _ref.state, options = _ref.options, name = _ref.name;
    if (state2.modifiersData[name]._skip) {
      return;
    }
    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state2.options.placement;
    var basePlacement = getBasePlacement$1(preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
    var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
      return acc.concat(getBasePlacement$1(placement2) === auto ? computeAutoPlacement(state2, {
        placement: placement2,
        boundary,
        rootBoundary,
        padding,
        flipVariations,
        allowedAutoPlacements
      }) : placement2);
    }, []);
    var referenceRect = state2.rects.reference;
    var popperRect = state2.rects.popper;
    var checksMap = /* @__PURE__ */ new Map();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements2[0];
    for (var i2 = 0; i2 < placements2.length; i2++) {
      var placement = placements2[i2];
      var _basePlacement = getBasePlacement$1(placement);
      var isStartVariation = getVariation(placement) === start;
      var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
      var len = isVertical ? "width" : "height";
      var overflow = detectOverflow(state2, {
        placement,
        boundary,
        rootBoundary,
        altBoundary,
        padding
      });
      var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
      if (referenceRect[len] > popperRect[len]) {
        mainVariationSide = getOppositePlacement(mainVariationSide);
      }
      var altVariationSide = getOppositePlacement(mainVariationSide);
      var checks = [];
      if (checkMainAxis) {
        checks.push(overflow[_basePlacement] <= 0);
      }
      if (checkAltAxis) {
        checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
      }
      if (checks.every(function(check) {
        return check;
      })) {
        firstFittingPlacement = placement;
        makeFallbackChecks = false;
        break;
      }
      checksMap.set(placement, checks);
    }
    if (makeFallbackChecks) {
      var numberOfChecks = flipVariations ? 3 : 1;
      var _loop = function _loop2(_i2) {
        var fittingPlacement = placements2.find(function(placement2) {
          var checks2 = checksMap.get(placement2);
          if (checks2) {
            return checks2.slice(0, _i2).every(function(check) {
              return check;
            });
          }
        });
        if (fittingPlacement) {
          firstFittingPlacement = fittingPlacement;
          return "break";
        }
      };
      for (var _i = numberOfChecks; _i > 0; _i--) {
        var _ret = _loop(_i);
        if (_ret === "break") break;
      }
    }
    if (state2.placement !== firstFittingPlacement) {
      state2.modifiersData[name]._skip = true;
      state2.placement = firstFittingPlacement;
      state2.reset = true;
    }
  }
  const flip$1 = {
    name: "flip",
    enabled: true,
    phase: "main",
    fn: flip,
    requiresIfExists: ["offset"],
    data: {
      _skip: false
    }
  };
  function getSideOffsets(overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) {
      preventedOffsets = {
        x: 0,
        y: 0
      };
    }
    return {
      top: overflow.top - rect.height - preventedOffsets.y,
      right: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      left: overflow.left - rect.width - preventedOffsets.x
    };
  }
  function isAnySideFullyClipped(overflow) {
    return [top, right, bottom, left].some(function(side) {
      return overflow[side] >= 0;
    });
  }
  function hide(_ref) {
    var state2 = _ref.state, name = _ref.name;
    var referenceRect = state2.rects.reference;
    var popperRect = state2.rects.popper;
    var preventedOffsets = state2.modifiersData.preventOverflow;
    var referenceOverflow = detectOverflow(state2, {
      elementContext: "reference"
    });
    var popperAltOverflow = detectOverflow(state2, {
      altBoundary: true
    });
    var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
    var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
    var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
    var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
    state2.modifiersData[name] = {
      referenceClippingOffsets,
      popperEscapeOffsets,
      isReferenceHidden,
      hasPopperEscaped
    };
    state2.attributes.popper = Object.assign({}, state2.attributes.popper, {
      "data-popper-reference-hidden": isReferenceHidden,
      "data-popper-escaped": hasPopperEscaped
    });
  }
  const hide$1 = {
    name: "hide",
    enabled: true,
    phase: "main",
    requiresIfExists: ["preventOverflow"],
    fn: hide
  };
  function distanceAndSkiddingToXY(placement, rects, offset2) {
    var basePlacement = getBasePlacement$1(placement);
    var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
    var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
      placement
    })) : offset2, skidding = _ref[0], distance = _ref[1];
    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [left, right].indexOf(basePlacement) >= 0 ? {
      x: distance,
      y: skidding
    } : {
      x: skidding,
      y: distance
    };
  }
  function offset(_ref2) {
    var state2 = _ref2.state, options = _ref2.options, name = _ref2.name;
    var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
    var data = placements.reduce(function(acc, placement) {
      acc[placement] = distanceAndSkiddingToXY(placement, state2.rects, offset2);
      return acc;
    }, {});
    var _data$state$placement = data[state2.placement], x = _data$state$placement.x, y = _data$state$placement.y;
    if (state2.modifiersData.popperOffsets != null) {
      state2.modifiersData.popperOffsets.x += x;
      state2.modifiersData.popperOffsets.y += y;
    }
    state2.modifiersData[name] = data;
  }
  const offset$1 = {
    name: "offset",
    enabled: true,
    phase: "main",
    requires: ["popperOffsets"],
    fn: offset
  };
  function popperOffsets(_ref) {
    var state2 = _ref.state, name = _ref.name;
    state2.modifiersData[name] = computeOffsets({
      reference: state2.rects.reference,
      element: state2.rects.popper,
      strategy: "absolute",
      placement: state2.placement
    });
  }
  const popperOffsets$1 = {
    name: "popperOffsets",
    enabled: true,
    phase: "read",
    fn: popperOffsets,
    data: {}
  };
  function getAltAxis(axis) {
    return axis === "x" ? "y" : "x";
  }
  function preventOverflow(_ref) {
    var state2 = _ref.state, options = _ref.options, name = _ref.name;
    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
    var overflow = detectOverflow(state2, {
      boundary,
      rootBoundary,
      padding,
      altBoundary
    });
    var basePlacement = getBasePlacement$1(state2.placement);
    var variation = getVariation(state2.placement);
    var isBasePlacement = !variation;
    var mainAxis = getMainAxisFromPlacement(basePlacement);
    var altAxis = getAltAxis(mainAxis);
    var popperOffsets2 = state2.modifiersData.popperOffsets;
    var referenceRect = state2.rects.reference;
    var popperRect = state2.rects.popper;
    var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state2.rects, {
      placement: state2.placement
    })) : tetherOffset;
    var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
      mainAxis: tetherOffsetValue,
      altAxis: tetherOffsetValue
    } : Object.assign({
      mainAxis: 0,
      altAxis: 0
    }, tetherOffsetValue);
    var offsetModifierState = state2.modifiersData.offset ? state2.modifiersData.offset[state2.placement] : null;
    var data = {
      x: 0,
      y: 0
    };
    if (!popperOffsets2) {
      return;
    }
    if (checkMainAxis) {
      var _offsetModifierState$;
      var mainSide = mainAxis === "y" ? top : left;
      var altSide = mainAxis === "y" ? bottom : right;
      var len = mainAxis === "y" ? "height" : "width";
      var offset2 = popperOffsets2[mainAxis];
      var min$1 = offset2 + overflow[mainSide];
      var max$1 = offset2 - overflow[altSide];
      var additive = tether ? -popperRect[len] / 2 : 0;
      var minLen = variation === start ? referenceRect[len] : popperRect[len];
      var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
      var arrowElement = state2.elements.arrow;
      var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
        width: 0,
        height: 0
      };
      var arrowPaddingObject = state2.modifiersData["arrow#persistent"] ? state2.modifiersData["arrow#persistent"].padding : getFreshSideObject();
      var arrowPaddingMin = arrowPaddingObject[mainSide];
      var arrowPaddingMax = arrowPaddingObject[altSide];
      var arrowLen = within(0, referenceRect[len], arrowRect[len]);
      var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
      var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
      var arrowOffsetParent = state2.elements.arrow && getOffsetParent(state2.elements.arrow);
      var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
      var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
      var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
      var tetherMax = offset2 + maxOffset - offsetModifierValue;
      var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1);
      popperOffsets2[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset2;
    }
    if (checkAltAxis) {
      var _offsetModifierState$2;
      var _mainSide = mainAxis === "x" ? top : left;
      var _altSide = mainAxis === "x" ? bottom : right;
      var _offset = popperOffsets2[altAxis];
      var _len = altAxis === "y" ? "height" : "width";
      var _min = _offset + overflow[_mainSide];
      var _max = _offset - overflow[_altSide];
      var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
      var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
      var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
      var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
      var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
      popperOffsets2[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }
    state2.modifiersData[name] = data;
  }
  const preventOverflow$1 = {
    name: "preventOverflow",
    enabled: true,
    phase: "main",
    fn: preventOverflow,
    requiresIfExists: ["offset"]
  };
  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  function getNodeScroll(node) {
    if (node === getWindow(node) || !isHTMLElement(node)) {
      return getWindowScroll(node);
    } else {
      return getHTMLElementScroll(node);
    }
  }
  function isElementScaled(element) {
    var rect = element.getBoundingClientRect();
    var scaleX = round(rect.width) / element.offsetWidth || 1;
    var scaleY = round(rect.height) / element.offsetHeight || 1;
    return scaleX !== 1 || scaleY !== 1;
  }
  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    var isOffsetParentAnElement = isHTMLElement(offsetParent);
    var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
    var documentElement = getDocumentElement(offsetParent);
    var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    var offsets = {
      x: 0,
      y: 0
    };
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
      isScrollParent(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent, true);
        offsets.x += offsetParent.clientLeft;
        offsets.y += offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }
    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }
  function order(modifiers) {
    var map = /* @__PURE__ */ new Map();
    var visited = /* @__PURE__ */ new Set();
    var result = [];
    modifiers.forEach(function(modifier) {
      map.set(modifier.name, modifier);
    });
    function sort(modifier) {
      visited.add(modifier.name);
      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
      requires.forEach(function(dep) {
        if (!visited.has(dep)) {
          var depModifier = map.get(dep);
          if (depModifier) {
            sort(depModifier);
          }
        }
      });
      result.push(modifier);
    }
    modifiers.forEach(function(modifier) {
      if (!visited.has(modifier.name)) {
        sort(modifier);
      }
    });
    return result;
  }
  function orderModifiers(modifiers) {
    var orderedModifiers = order(modifiers);
    return modifierPhases.reduce(function(acc, phase) {
      return acc.concat(orderedModifiers.filter(function(modifier) {
        return modifier.phase === phase;
      }));
    }, []);
  }
  function debounce$1(fn2) {
    var pending;
    return function() {
      if (!pending) {
        pending = new Promise(function(resolve) {
          Promise.resolve().then(function() {
            pending = void 0;
            resolve(fn2());
          });
        });
      }
      return pending;
    };
  }
  function mergeByName(modifiers) {
    var merged = modifiers.reduce(function(merged2, current) {
      var existing = merged2[current.name];
      merged2[current.name] = existing ? Object.assign({}, existing, current, {
        options: Object.assign({}, existing.options, current.options),
        data: Object.assign({}, existing.data, current.data)
      }) : current;
      return merged2;
    }, {});
    return Object.keys(merged).map(function(key) {
      return merged[key];
    });
  }
  var DEFAULT_OPTIONS = {
    placement: "bottom",
    modifiers: [],
    strategy: "absolute"
  };
  function areValidElements() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return !args.some(function(element) {
      return !(element && typeof element.getBoundingClientRect === "function");
    });
  }
  function popperGenerator(generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }
    var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper2(reference2, popper2, options) {
      if (options === void 0) {
        options = defaultOptions;
      }
      var state2 = {
        placement: "bottom",
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
        modifiersData: {},
        elements: {
          reference: reference2,
          popper: popper2
        },
        attributes: {},
        styles: {}
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance = {
        state: state2,
        setOptions: function setOptions(setOptionsAction) {
          var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state2.options) : setOptionsAction;
          cleanupModifierEffects();
          state2.options = Object.assign({}, defaultOptions, state2.options, options2);
          state2.scrollParents = {
            reference: isElement$1(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
            popper: listScrollParents(popper2)
          };
          var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state2.options.modifiers)));
          state2.orderedModifiers = orderedModifiers.filter(function(m) {
            return m.enabled;
          });
          runModifierEffects();
          return instance.update();
        },
        // Sync update – it will always be executed, even if not necessary. This
        // is useful for low frequency updates where sync behavior simplifies the
        // logic.
        // For high frequency updates (e.g. `resize` and `scroll` events), always
        // prefer the async Popper#update method
        forceUpdate: function forceUpdate() {
          if (isDestroyed) {
            return;
          }
          var _state$elements = state2.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
          if (!areValidElements(reference3, popper3)) {
            return;
          }
          state2.rects = {
            reference: getCompositeRect(reference3, getOffsetParent(popper3), state2.options.strategy === "fixed"),
            popper: getLayoutRect(popper3)
          };
          state2.reset = false;
          state2.placement = state2.options.placement;
          state2.orderedModifiers.forEach(function(modifier) {
            return state2.modifiersData[modifier.name] = Object.assign({}, modifier.data);
          });
          for (var index2 = 0; index2 < state2.orderedModifiers.length; index2++) {
            if (state2.reset === true) {
              state2.reset = false;
              index2 = -1;
              continue;
            }
            var _state$orderedModifie = state2.orderedModifiers[index2], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
            if (typeof fn2 === "function") {
              state2 = fn2({
                state: state2,
                options: _options,
                name,
                instance
              }) || state2;
            }
          }
        },
        // Async and optimistically optimized update – it will not be executed if
        // not necessary (debounced to run at most once-per-tick)
        update: debounce$1(function() {
          return new Promise(function(resolve) {
            instance.forceUpdate();
            resolve(state2);
          });
        }),
        destroy: function destroy() {
          cleanupModifierEffects();
          isDestroyed = true;
        }
      };
      if (!areValidElements(reference2, popper2)) {
        return instance;
      }
      instance.setOptions(options).then(function(state3) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state3);
        }
      });
      function runModifierEffects() {
        state2.orderedModifiers.forEach(function(_ref) {
          var name = _ref.name, _ref$options = _ref.options, options2 = _ref$options === void 0 ? {} : _ref$options, effect3 = _ref.effect;
          if (typeof effect3 === "function") {
            var cleanupFn = effect3({
              state: state2,
              name,
              instance,
              options: options2
            });
            var noopFn = function noopFn2() {
            };
            effectCleanupFns.push(cleanupFn || noopFn);
          }
        });
      }
      function cleanupModifierEffects() {
        effectCleanupFns.forEach(function(fn2) {
          return fn2();
        });
        effectCleanupFns = [];
      }
      return instance;
    };
  }
  var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
  var createPopper = /* @__PURE__ */ popperGenerator({
    defaultModifiers
  });
  var BOX_CLASS = "tippy-box";
  var CONTENT_CLASS = "tippy-content";
  var BACKDROP_CLASS = "tippy-backdrop";
  var ARROW_CLASS = "tippy-arrow";
  var SVG_ARROW_CLASS = "tippy-svg-arrow";
  var TOUCH_OPTIONS = {
    passive: true,
    capture: true
  };
  var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO2() {
    return document.body;
  };
  function getValueAtIndexOrReturn(value, index2, defaultValue) {
    if (Array.isArray(value)) {
      var v = value[index2];
      return v == null ? Array.isArray(defaultValue) ? defaultValue[index2] : defaultValue : v;
    }
    return value;
  }
  function isType(value, type) {
    var str = {}.toString.call(value);
    return str.indexOf("[object") === 0 && str.indexOf(type + "]") > -1;
  }
  function invokeWithArgsOrReturn(value, args) {
    return typeof value === "function" ? value.apply(void 0, args) : value;
  }
  function debounce(fn5, ms) {
    if (ms === 0) {
      return fn5;
    }
    var timeout;
    return function(arg) {
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        fn5(arg);
      }, ms);
    };
  }
  function splitBySpaces(value) {
    return value.split(/\s+/).filter(Boolean);
  }
  function normalizeToArray(value) {
    return [].concat(value);
  }
  function pushIfUnique(arr, value) {
    if (arr.indexOf(value) === -1) {
      arr.push(value);
    }
  }
  function unique(arr) {
    return arr.filter(function(item, index2) {
      return arr.indexOf(item) === index2;
    });
  }
  function getBasePlacement(placement) {
    return placement.split("-")[0];
  }
  function arrayFrom(value) {
    return [].slice.call(value);
  }
  function removeUndefinedProps(obj) {
    return Object.keys(obj).reduce(function(acc, key) {
      if (obj[key] !== void 0) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  }
  function div() {
    return document.createElement("div");
  }
  function isElement(value) {
    return ["Element", "Fragment"].some(function(type) {
      return isType(value, type);
    });
  }
  function isNodeList(value) {
    return isType(value, "NodeList");
  }
  function isMouseEvent(value) {
    return isType(value, "MouseEvent");
  }
  function isReferenceElement(value) {
    return !!(value && value._tippy && value._tippy.reference === value);
  }
  function getArrayOfElements(value) {
    if (isElement(value)) {
      return [value];
    }
    if (isNodeList(value)) {
      return arrayFrom(value);
    }
    if (Array.isArray(value)) {
      return value;
    }
    return arrayFrom(document.querySelectorAll(value));
  }
  function setTransitionDuration(els, value) {
    els.forEach(function(el) {
      if (el) {
        el.style.transitionDuration = value + "ms";
      }
    });
  }
  function setVisibilityState(els, state2) {
    els.forEach(function(el) {
      if (el) {
        el.setAttribute("data-state", state2);
      }
    });
  }
  function getOwnerDocument(elementOrElements) {
    var _element$ownerDocumen;
    var _normalizeToArray = normalizeToArray(elementOrElements), element = _normalizeToArray[0];
    return element != null && (_element$ownerDocumen = element.ownerDocument) != null && _element$ownerDocumen.body ? element.ownerDocument : document;
  }
  function isCursorOutsideInteractiveBorder(popperTreeData, event) {
    var clientX = event.clientX, clientY = event.clientY;
    return popperTreeData.every(function(_ref) {
      var popperRect = _ref.popperRect, popperState = _ref.popperState, props = _ref.props;
      var interactiveBorder = props.interactiveBorder;
      var basePlacement = getBasePlacement(popperState.placement);
      var offsetData = popperState.modifiersData.offset;
      if (!offsetData) {
        return true;
      }
      var topDistance = basePlacement === "bottom" ? offsetData.top.y : 0;
      var bottomDistance = basePlacement === "top" ? offsetData.bottom.y : 0;
      var leftDistance = basePlacement === "right" ? offsetData.left.x : 0;
      var rightDistance = basePlacement === "left" ? offsetData.right.x : 0;
      var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
      var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
      var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
      var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
      return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
    });
  }
  function updateTransitionEndListener(box, action2, listener) {
    var method = action2 + "EventListener";
    ["transitionend", "webkitTransitionEnd"].forEach(function(event) {
      box[method](event, listener);
    });
  }
  function actualContains(parent, child2) {
    var target = child2;
    while (target) {
      var _target$getRootNode;
      if (parent.contains(target)) {
        return true;
      }
      target = target.getRootNode == null ? void 0 : (_target$getRootNode = target.getRootNode()) == null ? void 0 : _target$getRootNode.host;
    }
    return false;
  }
  var currentInput = {
    isTouch: false
  };
  var lastMouseMoveTime = 0;
  function onDocumentTouchStart() {
    if (currentInput.isTouch) {
      return;
    }
    currentInput.isTouch = true;
    if (window.performance) {
      document.addEventListener("mousemove", onDocumentMouseMove);
    }
  }
  function onDocumentMouseMove() {
    var now = performance.now();
    if (now - lastMouseMoveTime < 20) {
      currentInput.isTouch = false;
      document.removeEventListener("mousemove", onDocumentMouseMove);
    }
    lastMouseMoveTime = now;
  }
  function onWindowBlur() {
    var activeElement = document.activeElement;
    if (isReferenceElement(activeElement)) {
      var instance = activeElement._tippy;
      if (activeElement.blur && !instance.state.isVisible) {
        activeElement.blur();
      }
    }
  }
  function bindGlobalEventListeners() {
    document.addEventListener("touchstart", onDocumentTouchStart, TOUCH_OPTIONS);
    window.addEventListener("blur", onWindowBlur);
  }
  var isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
  var isIE11 = isBrowser ? (
    // @ts-ignore
    !!window.msCrypto
  ) : false;
  var pluginProps = {
    animateFill: false,
    followCursor: false,
    inlinePositioning: false,
    sticky: false
  };
  var renderProps = {
    allowHTML: false,
    animation: "fade",
    arrow: true,
    content: "",
    inertia: false,
    maxWidth: 350,
    role: "tooltip",
    theme: "",
    zIndex: 9999
  };
  var defaultProps = Object.assign({
    appendTo: TIPPY_DEFAULT_APPEND_TO,
    aria: {
      content: "auto",
      expanded: "auto"
    },
    delay: 0,
    duration: [300, 250],
    getReferenceClientRect: null,
    hideOnClick: true,
    ignoreAttributes: false,
    interactive: false,
    interactiveBorder: 2,
    interactiveDebounce: 0,
    moveTransition: "",
    offset: [0, 10],
    onAfterUpdate: function onAfterUpdate() {
    },
    onBeforeUpdate: function onBeforeUpdate() {
    },
    onCreate: function onCreate() {
    },
    onDestroy: function onDestroy() {
    },
    onHidden: function onHidden() {
    },
    onHide: function onHide() {
    },
    onMount: function onMount2() {
    },
    onShow: function onShow() {
    },
    onShown: function onShown() {
    },
    onTrigger: function onTrigger() {
    },
    onUntrigger: function onUntrigger() {
    },
    onClickOutside: function onClickOutside() {
    },
    placement: "top",
    plugins: [],
    popperOptions: {},
    render: null,
    showOnCreate: false,
    touch: true,
    trigger: "mouseenter focus",
    triggerTarget: null
  }, pluginProps, renderProps);
  var defaultKeys = Object.keys(defaultProps);
  var setDefaultProps = function setDefaultProps2(partialProps) {
    var keys = Object.keys(partialProps);
    keys.forEach(function(key) {
      defaultProps[key] = partialProps[key];
    });
  };
  function getExtendedPassedProps(passedProps) {
    var plugins = passedProps.plugins || [];
    var pluginProps2 = plugins.reduce(function(acc, plugin) {
      var name = plugin.name, defaultValue = plugin.defaultValue;
      if (name) {
        var _name;
        acc[name] = passedProps[name] !== void 0 ? passedProps[name] : (_name = defaultProps[name]) != null ? _name : defaultValue;
      }
      return acc;
    }, {});
    return Object.assign({}, passedProps, pluginProps2);
  }
  function getDataAttributeProps(reference2, plugins) {
    var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
      plugins
    }))) : defaultKeys;
    var props = propKeys.reduce(function(acc, key) {
      var valueAsString = (reference2.getAttribute("data-tippy-" + key) || "").trim();
      if (!valueAsString) {
        return acc;
      }
      if (key === "content") {
        acc[key] = valueAsString;
      } else {
        try {
          acc[key] = JSON.parse(valueAsString);
        } catch (e2) {
          acc[key] = valueAsString;
        }
      }
      return acc;
    }, {});
    return props;
  }
  function evaluateProps(reference2, props) {
    var out = Object.assign({}, props, {
      content: invokeWithArgsOrReturn(props.content, [reference2])
    }, props.ignoreAttributes ? {} : getDataAttributeProps(reference2, props.plugins));
    out.aria = Object.assign({}, defaultProps.aria, out.aria);
    out.aria = {
      expanded: out.aria.expanded === "auto" ? props.interactive : out.aria.expanded,
      content: out.aria.content === "auto" ? props.interactive ? null : "describedby" : out.aria.content
    };
    return out;
  }
  var innerHTML = function innerHTML2() {
    return "innerHTML";
  };
  function dangerouslySetInnerHTML(element, html) {
    element[innerHTML()] = html;
  }
  function createArrowElement(value) {
    var arrow2 = div();
    if (value === true) {
      arrow2.className = ARROW_CLASS;
    } else {
      arrow2.className = SVG_ARROW_CLASS;
      if (isElement(value)) {
        arrow2.appendChild(value);
      } else {
        dangerouslySetInnerHTML(arrow2, value);
      }
    }
    return arrow2;
  }
  function setContent(content, props) {
    if (isElement(props.content)) {
      dangerouslySetInnerHTML(content, "");
      content.appendChild(props.content);
    } else if (typeof props.content !== "function") {
      if (props.allowHTML) {
        dangerouslySetInnerHTML(content, props.content);
      } else {
        content.textContent = props.content;
      }
    }
  }
  function getChildren(popper2) {
    var box = popper2.firstElementChild;
    var boxChildren = arrayFrom(box.children);
    return {
      box,
      content: boxChildren.find(function(node) {
        return node.classList.contains(CONTENT_CLASS);
      }),
      arrow: boxChildren.find(function(node) {
        return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
      }),
      backdrop: boxChildren.find(function(node) {
        return node.classList.contains(BACKDROP_CLASS);
      })
    };
  }
  function render(instance) {
    var popper2 = div();
    var box = div();
    box.className = BOX_CLASS;
    box.setAttribute("data-state", "hidden");
    box.setAttribute("tabindex", "-1");
    var content = div();
    content.className = CONTENT_CLASS;
    content.setAttribute("data-state", "hidden");
    setContent(content, instance.props);
    popper2.appendChild(box);
    box.appendChild(content);
    onUpdate(instance.props, instance.props);
    function onUpdate(prevProps, nextProps) {
      var _getChildren = getChildren(popper2), box2 = _getChildren.box, content2 = _getChildren.content, arrow2 = _getChildren.arrow;
      if (nextProps.theme) {
        box2.setAttribute("data-theme", nextProps.theme);
      } else {
        box2.removeAttribute("data-theme");
      }
      if (typeof nextProps.animation === "string") {
        box2.setAttribute("data-animation", nextProps.animation);
      } else {
        box2.removeAttribute("data-animation");
      }
      if (nextProps.inertia) {
        box2.setAttribute("data-inertia", "");
      } else {
        box2.removeAttribute("data-inertia");
      }
      box2.style.maxWidth = typeof nextProps.maxWidth === "number" ? nextProps.maxWidth + "px" : nextProps.maxWidth;
      if (nextProps.role) {
        box2.setAttribute("role", nextProps.role);
      } else {
        box2.removeAttribute("role");
      }
      if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) {
        setContent(content2, instance.props);
      }
      if (nextProps.arrow) {
        if (!arrow2) {
          box2.appendChild(createArrowElement(nextProps.arrow));
        } else if (prevProps.arrow !== nextProps.arrow) {
          box2.removeChild(arrow2);
          box2.appendChild(createArrowElement(nextProps.arrow));
        }
      } else if (arrow2) {
        box2.removeChild(arrow2);
      }
    }
    return {
      popper: popper2,
      onUpdate
    };
  }
  render.$$tippy = true;
  var idCounter = 1;
  var mouseMoveListeners = [];
  var mountedInstances = [];
  function createTippy(reference2, passedProps) {
    var props = evaluateProps(reference2, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps))));
    var showTimeout;
    var hideTimeout;
    var scheduleHideAnimationFrame;
    var isVisibleFromClick = false;
    var didHideDueToDocumentMouseDown = false;
    var didTouchMove = false;
    var ignoreOnFirstUpdate = false;
    var lastTriggerEvent;
    var currentTransitionEndListener;
    var onFirstUpdate;
    var listeners = [];
    var debouncedOnMouseMove = debounce(onMouseMove, props.interactiveDebounce);
    var currentTarget;
    var id = idCounter++;
    var popperInstance = null;
    var plugins = unique(props.plugins);
    var state2 = {
      // Is the instance currently enabled?
      isEnabled: true,
      // Is the tippy currently showing and not transitioning out?
      isVisible: false,
      // Has the instance been destroyed?
      isDestroyed: false,
      // Is the tippy currently mounted to the DOM?
      isMounted: false,
      // Has the tippy finished transitioning in?
      isShown: false
    };
    var instance = {
      // properties
      id,
      reference: reference2,
      popper: div(),
      popperInstance,
      props,
      state: state2,
      plugins,
      // methods
      clearDelayTimeouts,
      setProps,
      setContent: setContent2,
      show,
      hide: hide2,
      hideWithInteractivity,
      enable,
      disable,
      unmount,
      destroy
    };
    if (!props.render) {
      return instance;
    }
    var _props$render = props.render(instance), popper2 = _props$render.popper, onUpdate = _props$render.onUpdate;
    popper2.setAttribute("data-tippy-root", "");
    popper2.id = "tippy-" + instance.id;
    instance.popper = popper2;
    reference2._tippy = instance;
    popper2._tippy = instance;
    var pluginsHooks = plugins.map(function(plugin) {
      return plugin.fn(instance);
    });
    var hasAriaExpanded = reference2.hasAttribute("aria-expanded");
    addListeners();
    handleAriaExpandedAttribute();
    handleStyles();
    invokeHook("onCreate", [instance]);
    if (props.showOnCreate) {
      scheduleShow();
    }
    popper2.addEventListener("mouseenter", function() {
      if (instance.props.interactive && instance.state.isVisible) {
        instance.clearDelayTimeouts();
      }
    });
    popper2.addEventListener("mouseleave", function() {
      if (instance.props.interactive && instance.props.trigger.indexOf("mouseenter") >= 0) {
        getDocument().addEventListener("mousemove", debouncedOnMouseMove);
      }
    });
    return instance;
    function getNormalizedTouchSettings() {
      var touch = instance.props.touch;
      return Array.isArray(touch) ? touch : [touch, 0];
    }
    function getIsCustomTouchBehavior() {
      return getNormalizedTouchSettings()[0] === "hold";
    }
    function getIsDefaultRenderFn() {
      var _instance$props$rende;
      return !!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy);
    }
    function getCurrentTarget() {
      return currentTarget || reference2;
    }
    function getDocument() {
      var parent = getCurrentTarget().parentNode;
      return parent ? getOwnerDocument(parent) : document;
    }
    function getDefaultTemplateChildren() {
      return getChildren(popper2);
    }
    function getDelay(isShow) {
      if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === "focus") {
        return 0;
      }
      return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
    }
    function handleStyles(fromHide) {
      if (fromHide === void 0) {
        fromHide = false;
      }
      popper2.style.pointerEvents = instance.props.interactive && !fromHide ? "" : "none";
      popper2.style.zIndex = "" + instance.props.zIndex;
    }
    function invokeHook(hook, args, shouldInvokePropsHook) {
      if (shouldInvokePropsHook === void 0) {
        shouldInvokePropsHook = true;
      }
      pluginsHooks.forEach(function(pluginHooks) {
        if (pluginHooks[hook]) {
          pluginHooks[hook].apply(pluginHooks, args);
        }
      });
      if (shouldInvokePropsHook) {
        var _instance$props;
        (_instance$props = instance.props)[hook].apply(_instance$props, args);
      }
    }
    function handleAriaContentAttribute() {
      var aria = instance.props.aria;
      if (!aria.content) {
        return;
      }
      var attr = "aria-" + aria.content;
      var id2 = popper2.id;
      var nodes = normalizeToArray(instance.props.triggerTarget || reference2);
      nodes.forEach(function(node) {
        var currentValue = node.getAttribute(attr);
        if (instance.state.isVisible) {
          node.setAttribute(attr, currentValue ? currentValue + " " + id2 : id2);
        } else {
          var nextValue = currentValue && currentValue.replace(id2, "").trim();
          if (nextValue) {
            node.setAttribute(attr, nextValue);
          } else {
            node.removeAttribute(attr);
          }
        }
      });
    }
    function handleAriaExpandedAttribute() {
      if (hasAriaExpanded || !instance.props.aria.expanded) {
        return;
      }
      var nodes = normalizeToArray(instance.props.triggerTarget || reference2);
      nodes.forEach(function(node) {
        if (instance.props.interactive) {
          node.setAttribute("aria-expanded", instance.state.isVisible && node === getCurrentTarget() ? "true" : "false");
        } else {
          node.removeAttribute("aria-expanded");
        }
      });
    }
    function cleanupInteractiveMouseListeners() {
      getDocument().removeEventListener("mousemove", debouncedOnMouseMove);
      mouseMoveListeners = mouseMoveListeners.filter(function(listener) {
        return listener !== debouncedOnMouseMove;
      });
    }
    function onDocumentPress(event) {
      if (currentInput.isTouch) {
        if (didTouchMove || event.type === "mousedown") {
          return;
        }
      }
      var actualTarget = event.composedPath && event.composedPath()[0] || event.target;
      if (instance.props.interactive && actualContains(popper2, actualTarget)) {
        return;
      }
      if (normalizeToArray(instance.props.triggerTarget || reference2).some(function(el) {
        return actualContains(el, actualTarget);
      })) {
        if (currentInput.isTouch) {
          return;
        }
        if (instance.state.isVisible && instance.props.trigger.indexOf("click") >= 0) {
          return;
        }
      } else {
        invokeHook("onClickOutside", [instance, event]);
      }
      if (instance.props.hideOnClick === true) {
        instance.clearDelayTimeouts();
        instance.hide();
        didHideDueToDocumentMouseDown = true;
        setTimeout(function() {
          didHideDueToDocumentMouseDown = false;
        });
        if (!instance.state.isMounted) {
          removeDocumentPress();
        }
      }
    }
    function onTouchMove() {
      didTouchMove = true;
    }
    function onTouchStart() {
      didTouchMove = false;
    }
    function addDocumentPress() {
      var doc = getDocument();
      doc.addEventListener("mousedown", onDocumentPress, true);
      doc.addEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
      doc.addEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
      doc.addEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
    }
    function removeDocumentPress() {
      var doc = getDocument();
      doc.removeEventListener("mousedown", onDocumentPress, true);
      doc.removeEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
      doc.removeEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
      doc.removeEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
    }
    function onTransitionedOut(duration, callback) {
      onTransitionEnd(duration, function() {
        if (!instance.state.isVisible && popper2.parentNode && popper2.parentNode.contains(popper2)) {
          callback();
        }
      });
    }
    function onTransitionedIn(duration, callback) {
      onTransitionEnd(duration, callback);
    }
    function onTransitionEnd(duration, callback) {
      var box = getDefaultTemplateChildren().box;
      function listener(event) {
        if (event.target === box) {
          updateTransitionEndListener(box, "remove", listener);
          callback();
        }
      }
      if (duration === 0) {
        return callback();
      }
      updateTransitionEndListener(box, "remove", currentTransitionEndListener);
      updateTransitionEndListener(box, "add", listener);
      currentTransitionEndListener = listener;
    }
    function on(eventType, handler, options) {
      if (options === void 0) {
        options = false;
      }
      var nodes = normalizeToArray(instance.props.triggerTarget || reference2);
      nodes.forEach(function(node) {
        node.addEventListener(eventType, handler, options);
        listeners.push({
          node,
          eventType,
          handler,
          options
        });
      });
    }
    function addListeners() {
      if (getIsCustomTouchBehavior()) {
        on("touchstart", onTrigger2, {
          passive: true
        });
        on("touchend", onMouseLeave, {
          passive: true
        });
      }
      splitBySpaces(instance.props.trigger).forEach(function(eventType) {
        if (eventType === "manual") {
          return;
        }
        on(eventType, onTrigger2);
        switch (eventType) {
          case "mouseenter":
            on("mouseleave", onMouseLeave);
            break;
          case "focus":
            on(isIE11 ? "focusout" : "blur", onBlurOrFocusOut);
            break;
          case "focusin":
            on("focusout", onBlurOrFocusOut);
            break;
        }
      });
    }
    function removeListeners() {
      listeners.forEach(function(_ref) {
        var node = _ref.node, eventType = _ref.eventType, handler = _ref.handler, options = _ref.options;
        node.removeEventListener(eventType, handler, options);
      });
      listeners = [];
    }
    function onTrigger2(event) {
      var _lastTriggerEvent;
      var shouldScheduleClickHide = false;
      if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) {
        return;
      }
      var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === "focus";
      lastTriggerEvent = event;
      currentTarget = event.currentTarget;
      handleAriaExpandedAttribute();
      if (!instance.state.isVisible && isMouseEvent(event)) {
        mouseMoveListeners.forEach(function(listener) {
          return listener(event);
        });
      }
      if (event.type === "click" && (instance.props.trigger.indexOf("mouseenter") < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) {
        shouldScheduleClickHide = true;
      } else {
        scheduleShow(event);
      }
      if (event.type === "click") {
        isVisibleFromClick = !shouldScheduleClickHide;
      }
      if (shouldScheduleClickHide && !wasFocused) {
        scheduleHide(event);
      }
    }
    function onMouseMove(event) {
      var target = event.target;
      var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper2.contains(target);
      if (event.type === "mousemove" && isCursorOverReferenceOrPopper) {
        return;
      }
      var popperTreeData = getNestedPopperTree().concat(popper2).map(function(popper22) {
        var _instance$popperInsta;
        var instance2 = popper22._tippy;
        var state22 = (_instance$popperInsta = instance2.popperInstance) == null ? void 0 : _instance$popperInsta.state;
        if (state22) {
          return {
            popperRect: popper22.getBoundingClientRect(),
            popperState: state22,
            props
          };
        }
        return null;
      }).filter(Boolean);
      if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
        cleanupInteractiveMouseListeners();
        scheduleHide(event);
      }
    }
    function onMouseLeave(event) {
      var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf("click") >= 0 && isVisibleFromClick;
      if (shouldBail) {
        return;
      }
      if (instance.props.interactive) {
        instance.hideWithInteractivity(event);
        return;
      }
      scheduleHide(event);
    }
    function onBlurOrFocusOut(event) {
      if (instance.props.trigger.indexOf("focusin") < 0 && event.target !== getCurrentTarget()) {
        return;
      }
      if (instance.props.interactive && event.relatedTarget && popper2.contains(event.relatedTarget)) {
        return;
      }
      scheduleHide(event);
    }
    function isEventListenerStopped(event) {
      return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf("touch") >= 0 : false;
    }
    function createPopperInstance() {
      destroyPopperInstance();
      var _instance$props2 = instance.props, popperOptions = _instance$props2.popperOptions, placement = _instance$props2.placement, offset2 = _instance$props2.offset, getReferenceClientRect = _instance$props2.getReferenceClientRect, moveTransition = _instance$props2.moveTransition;
      var arrow2 = getIsDefaultRenderFn() ? getChildren(popper2).arrow : null;
      var computedReference = getReferenceClientRect ? {
        getBoundingClientRect: getReferenceClientRect,
        contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
      } : reference2;
      var tippyModifier = {
        name: "$$tippy",
        enabled: true,
        phase: "beforeWrite",
        requires: ["computeStyles"],
        fn: function fn5(_ref2) {
          var state22 = _ref2.state;
          if (getIsDefaultRenderFn()) {
            var _getDefaultTemplateCh = getDefaultTemplateChildren(), box = _getDefaultTemplateCh.box;
            ["placement", "reference-hidden", "escaped"].forEach(function(attr) {
              if (attr === "placement") {
                box.setAttribute("data-placement", state22.placement);
              } else {
                if (state22.attributes.popper["data-popper-" + attr]) {
                  box.setAttribute("data-" + attr, "");
                } else {
                  box.removeAttribute("data-" + attr);
                }
              }
            });
            state22.attributes.popper = {};
          }
        }
      };
      var modifiers = [{
        name: "offset",
        options: {
          offset: offset2
        }
      }, {
        name: "preventOverflow",
        options: {
          padding: {
            top: 2,
            bottom: 2,
            left: 5,
            right: 5
          }
        }
      }, {
        name: "flip",
        options: {
          padding: 5
        }
      }, {
        name: "computeStyles",
        options: {
          adaptive: !moveTransition
        }
      }, tippyModifier];
      if (getIsDefaultRenderFn() && arrow2) {
        modifiers.push({
          name: "arrow",
          options: {
            element: arrow2,
            padding: 3
          }
        });
      }
      modifiers.push.apply(modifiers, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
      instance.popperInstance = createPopper(computedReference, popper2, Object.assign({}, popperOptions, {
        placement,
        onFirstUpdate,
        modifiers
      }));
    }
    function destroyPopperInstance() {
      if (instance.popperInstance) {
        instance.popperInstance.destroy();
        instance.popperInstance = null;
      }
    }
    function mount2() {
      var appendTo = instance.props.appendTo;
      var parentNode;
      var node = getCurrentTarget();
      if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || appendTo === "parent") {
        parentNode = node.parentNode;
      } else {
        parentNode = invokeWithArgsOrReturn(appendTo, [node]);
      }
      if (!parentNode.contains(popper2)) {
        parentNode.appendChild(popper2);
      }
      instance.state.isMounted = true;
      createPopperInstance();
    }
    function getNestedPopperTree() {
      return arrayFrom(popper2.querySelectorAll("[data-tippy-root]"));
    }
    function scheduleShow(event) {
      instance.clearDelayTimeouts();
      if (event) {
        invokeHook("onTrigger", [instance, event]);
      }
      addDocumentPress();
      var delay = getDelay(true);
      var _getNormalizedTouchSe = getNormalizedTouchSettings(), touchValue = _getNormalizedTouchSe[0], touchDelay = _getNormalizedTouchSe[1];
      if (currentInput.isTouch && touchValue === "hold" && touchDelay) {
        delay = touchDelay;
      }
      if (delay) {
        showTimeout = setTimeout(function() {
          instance.show();
        }, delay);
      } else {
        instance.show();
      }
    }
    function scheduleHide(event) {
      instance.clearDelayTimeouts();
      invokeHook("onUntrigger", [instance, event]);
      if (!instance.state.isVisible) {
        removeDocumentPress();
        return;
      }
      if (instance.props.trigger.indexOf("mouseenter") >= 0 && instance.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(event.type) >= 0 && isVisibleFromClick) {
        return;
      }
      var delay = getDelay(false);
      if (delay) {
        hideTimeout = setTimeout(function() {
          if (instance.state.isVisible) {
            instance.hide();
          }
        }, delay);
      } else {
        scheduleHideAnimationFrame = requestAnimationFrame(function() {
          instance.hide();
        });
      }
    }
    function enable() {
      instance.state.isEnabled = true;
    }
    function disable() {
      instance.hide();
      instance.state.isEnabled = false;
    }
    function clearDelayTimeouts() {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
      cancelAnimationFrame(scheduleHideAnimationFrame);
    }
    function setProps(partialProps) {
      if (instance.state.isDestroyed) {
        return;
      }
      invokeHook("onBeforeUpdate", [instance, partialProps]);
      removeListeners();
      var prevProps = instance.props;
      var nextProps = evaluateProps(reference2, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
        ignoreAttributes: true
      }));
      instance.props = nextProps;
      addListeners();
      if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
        cleanupInteractiveMouseListeners();
        debouncedOnMouseMove = debounce(onMouseMove, nextProps.interactiveDebounce);
      }
      if (prevProps.triggerTarget && !nextProps.triggerTarget) {
        normalizeToArray(prevProps.triggerTarget).forEach(function(node) {
          node.removeAttribute("aria-expanded");
        });
      } else if (nextProps.triggerTarget) {
        reference2.removeAttribute("aria-expanded");
      }
      handleAriaExpandedAttribute();
      handleStyles();
      if (onUpdate) {
        onUpdate(prevProps, nextProps);
      }
      if (instance.popperInstance) {
        createPopperInstance();
        getNestedPopperTree().forEach(function(nestedPopper) {
          requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
        });
      }
      invokeHook("onAfterUpdate", [instance, partialProps]);
    }
    function setContent2(content) {
      instance.setProps({
        content
      });
    }
    function show() {
      var isAlreadyVisible = instance.state.isVisible;
      var isDestroyed = instance.state.isDestroyed;
      var isDisabled = !instance.state.isEnabled;
      var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
      var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);
      if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) {
        return;
      }
      if (getCurrentTarget().hasAttribute("disabled")) {
        return;
      }
      invokeHook("onShow", [instance], false);
      if (instance.props.onShow(instance) === false) {
        return;
      }
      instance.state.isVisible = true;
      if (getIsDefaultRenderFn()) {
        popper2.style.visibility = "visible";
      }
      handleStyles();
      addDocumentPress();
      if (!instance.state.isMounted) {
        popper2.style.transition = "none";
      }
      if (getIsDefaultRenderFn()) {
        var _getDefaultTemplateCh2 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh2.box, content = _getDefaultTemplateCh2.content;
        setTransitionDuration([box, content], 0);
      }
      onFirstUpdate = function onFirstUpdate2() {
        var _instance$popperInsta2;
        if (!instance.state.isVisible || ignoreOnFirstUpdate) {
          return;
        }
        ignoreOnFirstUpdate = true;
        void popper2.offsetHeight;
        popper2.style.transition = instance.props.moveTransition;
        if (getIsDefaultRenderFn() && instance.props.animation) {
          var _getDefaultTemplateCh3 = getDefaultTemplateChildren(), _box = _getDefaultTemplateCh3.box, _content = _getDefaultTemplateCh3.content;
          setTransitionDuration([_box, _content], duration);
          setVisibilityState([_box, _content], "visible");
        }
        handleAriaContentAttribute();
        handleAriaExpandedAttribute();
        pushIfUnique(mountedInstances, instance);
        (_instance$popperInsta2 = instance.popperInstance) == null ? void 0 : _instance$popperInsta2.forceUpdate();
        invokeHook("onMount", [instance]);
        if (instance.props.animation && getIsDefaultRenderFn()) {
          onTransitionedIn(duration, function() {
            instance.state.isShown = true;
            invokeHook("onShown", [instance]);
          });
        }
      };
      mount2();
    }
    function hide2() {
      var isAlreadyHidden = !instance.state.isVisible;
      var isDestroyed = instance.state.isDestroyed;
      var isDisabled = !instance.state.isEnabled;
      var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);
      if (isAlreadyHidden || isDestroyed || isDisabled) {
        return;
      }
      invokeHook("onHide", [instance], false);
      if (instance.props.onHide(instance) === false) {
        return;
      }
      instance.state.isVisible = false;
      instance.state.isShown = false;
      ignoreOnFirstUpdate = false;
      isVisibleFromClick = false;
      if (getIsDefaultRenderFn()) {
        popper2.style.visibility = "hidden";
      }
      cleanupInteractiveMouseListeners();
      removeDocumentPress();
      handleStyles(true);
      if (getIsDefaultRenderFn()) {
        var _getDefaultTemplateCh4 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh4.box, content = _getDefaultTemplateCh4.content;
        if (instance.props.animation) {
          setTransitionDuration([box, content], duration);
          setVisibilityState([box, content], "hidden");
        }
      }
      handleAriaContentAttribute();
      handleAriaExpandedAttribute();
      if (instance.props.animation) {
        if (getIsDefaultRenderFn()) {
          onTransitionedOut(duration, instance.unmount);
        }
      } else {
        instance.unmount();
      }
    }
    function hideWithInteractivity(event) {
      getDocument().addEventListener("mousemove", debouncedOnMouseMove);
      pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
      debouncedOnMouseMove(event);
    }
    function unmount() {
      if (instance.state.isVisible) {
        instance.hide();
      }
      if (!instance.state.isMounted) {
        return;
      }
      destroyPopperInstance();
      getNestedPopperTree().forEach(function(nestedPopper) {
        nestedPopper._tippy.unmount();
      });
      if (popper2.parentNode) {
        popper2.parentNode.removeChild(popper2);
      }
      mountedInstances = mountedInstances.filter(function(i2) {
        return i2 !== instance;
      });
      instance.state.isMounted = false;
      invokeHook("onHidden", [instance]);
    }
    function destroy() {
      if (instance.state.isDestroyed) {
        return;
      }
      instance.clearDelayTimeouts();
      instance.unmount();
      removeListeners();
      delete reference2._tippy;
      instance.state.isDestroyed = true;
      invokeHook("onDestroy", [instance]);
    }
  }
  function tippy(targets, optionalProps) {
    if (optionalProps === void 0) {
      optionalProps = {};
    }
    var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
    bindGlobalEventListeners();
    var passedProps = Object.assign({}, optionalProps, {
      plugins
    });
    var elements = getArrayOfElements(targets);
    var instances = elements.reduce(function(acc, reference2) {
      var instance = reference2 && createTippy(reference2, passedProps);
      if (instance) {
        acc.push(instance);
      }
      return acc;
    }, []);
    return isElement(targets) ? instances[0] : instances;
  }
  tippy.defaultProps = defaultProps;
  tippy.setDefaultProps = setDefaultProps;
  tippy.currentInput = currentInput;
  Object.assign({}, applyStyles$1, {
    effect: function effect2(_ref) {
      var state2 = _ref.state;
      var initialStyles = {
        popper: {
          position: state2.options.strategy,
          left: "0",
          top: "0",
          margin: "0"
        },
        arrow: {
          position: "absolute"
        },
        reference: {}
      };
      Object.assign(state2.elements.popper.style, initialStyles.popper);
      state2.styles = initialStyles;
      if (state2.elements.arrow) {
        Object.assign(state2.elements.arrow.style, initialStyles.arrow);
      }
    }
  });
  tippy.setDefaultProps({
    render
  });
  var on_click$5 = (_, editor, $$props) => {
    editor == null ? void 0 : editor.insertAtCursor($$props.display);
  };
  var root_1$1 = /* @__PURE__ */ template(`<button class="svelte-1ewjpur"> </button>`);
  var root$4 = /* @__PURE__ */ template(`<button class="svelte-1ewjpur"> </button> <div class="variants svelte-1ewjpur"></div>`, 1);
  function KanaButton($$anchor, $$props) {
    push($$props, true);
    let instance;
    let button;
    let variantsContainer;
    let active = state(false);
    onMount(() => {
      instance = tippy(button, {
        content: variantsContainer,
        theme: "kana",
        interactive: true,
        offset: [0, 0],
        placement: "right",
        onShow: () => {
          set(active, true);
        },
        onHide: () => {
          set(active, false);
        }
      });
    });
    const editor = getContext("editor");
    var fragment = root$4();
    var button_1 = first_child(fragment);
    bind_this(button_1, ($$value) => button = $$value, () => button);
    button_1.__click = [on_click$5, editor, $$props];
    var text = child(button_1);
    var div2 = sibling(button_1, 2);
    bind_this(div2, ($$value) => variantsContainer = $$value, () => variantsContainer);
    each(div2, 21, () => $$props.variants, index, ($$anchor2, variant) => {
      var button_2 = root_1$1();
      button_2.__click = () => {
        if (editor) {
          editor.insertAtCursor(get(variant));
        }
        instance.hide();
      };
      var text_1 = child(button_2);
      template_effect(() => set_text(text_1, get(variant)));
      append($$anchor2, button_2);
    });
    template_effect(() => {
      toggle_class(button_1, "active", get(active));
      set_text(text, $$props.display);
    });
    append($$anchor, fragment);
    pop();
  }
  delegate(["click"]);
  var e = { dragStart: true }, t = (e2, t2, n2) => Math.min(Math.max(e2, t2), n2), n = (e2) => "string" == typeof e2, r = ([e2, t2], n2, r2) => {
    const o2 = (e3, t3) => 0 === t3 ? 0 : Math.ceil(e3 / t3) * t3;
    return [o2(n2, e2), o2(r2, t2)];
  };
  var o = (e2, t2) => e2.some((e3) => t2.some((t3) => e3.contains(t3)));
  function i(e2, t2) {
    if (void 0 === e2) return;
    if (s(e2)) return e2.getBoundingClientRect();
    if ("object" == typeof e2) {
      const { top: t3 = 0, left: n3 = 0, right: r2 = 0, bottom: o2 = 0 } = e2;
      return { top: t3, right: window.innerWidth - r2, bottom: window.innerHeight - o2, left: n3 };
    }
    if ("parent" === e2) return t2.parentNode.getBoundingClientRect();
    const n2 = document.querySelector(e2);
    if (null === n2) throw new Error("The selector provided for bound doesn't exists in the document.");
    return n2.getBoundingClientRect();
  }
  var a = (e2, t2, n2) => e2.style.setProperty(t2, n2), s = (e2) => e2 instanceof HTMLElement, d = (d2, l = {}) => {
    let c, u, { bounds: f, axis: g = "both", gpuAcceleration: h = true, legacyTranslate: p = true, transform: m, applyUserSelectHack: w = true, disabled: y = false, ignoreMultitouch: b = false, recomputeBounds: v = e, grid: x, position: E, cancel: S, handle: A, defaultClass: C = "neodrag", defaultClassDragging: N = "neodrag-dragging", defaultClassDragged: D = "neodrag-dragged", defaultPosition: M = { x: 0, y: 0 }, onDragStart: B, onDrag: $, onDragEnd: R } = l, H = false, L = 0, T = 0, X = 0, Y = 0, q = 0, P = 0, { x: k, y: z } = E ? { x: (E == null ? void 0 : E.x) ?? 0, y: (E == null ? void 0 : E.y) ?? 0 } : M;
    V(k, z);
    let I, U, W, j, F, G = "", J = !!E;
    v = { ...e, ...v };
    let K = /* @__PURE__ */ new Set();
    const O = document.body.style, Q = d2.classList;
    function V(e2 = L, t2 = T) {
      if (!m) {
        if (p) {
          let n2 = `${+e2}px, ${+t2}px`;
          return a(d2, "transform", h ? `translate3d(${n2}, 0)` : `translate(${n2})`);
        }
        return a(d2, "translate", `${+e2}px ${+t2}px ${h ? "1px" : ""}`);
      }
      const r2 = m({ offsetX: e2, offsetY: t2, rootNode: d2 });
      n(r2) && a(d2, "transform", r2);
    }
    const Z = (e2, t2) => {
      const n2 = { offsetX: L, offsetY: T, rootNode: d2, currentNode: F };
      d2.dispatchEvent(new CustomEvent(e2, { detail: n2 })), t2 == null ? void 0 : t2(n2);
    };
    const _ = addEventListener;
    _("pointerdown", te, false), _("pointerup", ne, false), _("pointermove", re, false), a(d2, "touch-action", "none");
    const ee = () => {
      let e2 = d2.offsetWidth / U.width;
      return isNaN(e2) && (e2 = 1), e2;
    };
    function te(e2) {
      if (y) return;
      if (2 === e2.button) return;
      if (K.add(e2.pointerId), b && K.size > 1) return e2.preventDefault();
      if (v.dragStart && (I = i(f, d2)), n(A) && n(S) && A === S) throw new Error("`handle` selector can't be same as `cancel` selector");
      if (Q.add(C), W = function(e3, t3) {
        if (!e3) return [t3];
        if (s(e3)) return [e3];
        if (Array.isArray(e3)) return e3;
        const n2 = t3.querySelectorAll(e3);
        if (null === n2) throw new Error("Selector passed for `handle` option should be child of the element on which the action is applied");
        return Array.from(n2.values());
      }(A, d2), j = function(e3, t3) {
        if (!e3) return [];
        if (s(e3)) return [e3];
        if (Array.isArray(e3)) return e3;
        const n2 = t3.querySelectorAll(e3);
        if (null === n2) throw new Error("Selector passed for `cancel` option should be child of the element on which the action is applied");
        return Array.from(n2.values());
      }(S, d2), c = /(both|x)/.test(g), u = /(both|y)/.test(g), o(j, W)) throw new Error("Element being dragged can't be a child of the element on which `cancel` is applied");
      const t2 = e2.composedPath()[0];
      if (!W.some((e3) => {
        var _a;
        return e3.contains(t2) || ((_a = e3.shadowRoot) == null ? void 0 : _a.contains(t2));
      }) || o(j, [t2])) return;
      F = 1 === W.length ? d2 : W.find((e3) => e3.contains(t2)), H = true, U = d2.getBoundingClientRect(), w && (G = O.userSelect, O.userSelect = "none"), Z("neodrag:start", B);
      const { clientX: r2, clientY: a2 } = e2, l2 = ee();
      c && (X = r2 - k / l2), u && (Y = a2 - z / l2), I && (q = r2 - U.left, P = a2 - U.top);
    }
    function ne(e2) {
      K.delete(e2.pointerId), H && (v.dragEnd && (I = i(f, d2)), Q.remove(N), Q.add(D), w && (O.userSelect = G), Z("neodrag:end", R), c && (X = L), u && (Y = T), H = false);
    }
    function re(e2) {
      if (!H || b && K.size > 1) return;
      v.drag && (I = i(f, d2)), Q.add(N), e2.preventDefault(), U = d2.getBoundingClientRect();
      let n2 = e2.clientX, o2 = e2.clientY;
      const a2 = ee();
      if (I) {
        const e3 = { left: I.left + q, top: I.top + P, right: I.right + q - U.width, bottom: I.bottom + P - U.height };
        n2 = t(n2, e3.left, e3.right), o2 = t(o2, e3.top, e3.bottom);
      }
      if (Array.isArray(x)) {
        let [e3, t2] = x;
        if (isNaN(+e3) || e3 < 0) throw new Error("1st argument of `grid` must be a valid positive number");
        if (isNaN(+t2) || t2 < 0) throw new Error("2nd argument of `grid` must be a valid positive number");
        let i2 = n2 - X, s2 = o2 - Y;
        [i2, s2] = r([e3 / a2, t2 / a2], i2, s2), n2 = X + i2, o2 = Y + s2;
      }
      c && (L = Math.round((n2 - X) * a2)), u && (T = Math.round((o2 - Y) * a2)), k = L, z = T, Z("neodrag", $), V();
    }
    return { destroy: () => {
      const e2 = removeEventListener;
      e2("pointerdown", te, false), e2("pointerup", ne, false), e2("pointermove", re, false);
    }, update: (t2) => {
      var _a, _b;
      g = t2.axis || "both", y = t2.disabled ?? false, b = t2.ignoreMultitouch ?? false, A = t2.handle, f = t2.bounds, v = t2.recomputeBounds ?? e, S = t2.cancel, w = t2.applyUserSelectHack ?? true, x = t2.grid, h = t2.gpuAcceleration ?? true, p = t2.legacyTranslate ?? true, m = t2.transform;
      const n2 = Q.contains(D);
      Q.remove(C, D), C = t2.defaultClass ?? "neodrag", N = t2.defaultClassDragging ?? "neodrag-dragging", D = t2.defaultClassDragged ?? "neodrag-dragged", Q.add(C), n2 && Q.add(D), J && (k = L = ((_a = t2.position) == null ? void 0 : _a.x) ?? L, z = T = ((_b = t2.position) == null ? void 0 : _b.y) ?? T, V());
    } };
  };
  var on_dblclick = (_, shown) => shown(false);
  var root$3 = /* @__PURE__ */ template(`<div class="float-menu svelte-1rgb4pt" role="dialog" title="ドラッグして移動、ダブルクリックして隠す"><!></div>`);
  function FloatDialog($$anchor, $$props) {
    push($$props, true);
    let shown = prop($$props, "shown", 15, false);
    var div2 = root$3();
    div2.__dblclick = [on_dblclick, shown];
    var node = child(div2);
    snippet(node, () => $$props.children);
    action(div2, ($$node) => d($$node));
    append($$anchor, div2);
    pop();
  }
  delegate(["dblclick"]);
  var on_click$4 = (e2, editor, $$props) => {
    e2.stopPropagation();
    if (editor) {
      if ($$props.text instanceof Function) {
        editor.replaceSelection($$props.text);
      } else {
        editor.insertAtCursor($$props.text);
      }
    }
  };
  var root$2 = /* @__PURE__ */ template(`<button class="svelte-18a6ijc"> </button>`);
  function InsertButton($$anchor, $$props) {
    push($$props, true);
    let color = prop($$props, "color", 3, "black"), display = prop($$props, "display", 19, () => $$props.text instanceof Function ? $$props.text("…") : $$props.text);
    const editor = getContext("editor");
    var button = root$2();
    button.__click = [on_click$4, editor, $$props];
    button.__contextmenu = function(...$$args) {
      var _a;
      (_a = $$props.oncontextmenu) == null ? void 0 : _a.apply(this, $$args);
    };
    var text_1 = child(button);
    template_effect(() => {
      set_attribute(button, "data-color", color());
      set_attribute(button, "title", $$props.title);
      set_text(text_1, display());
    });
    append($$anchor, button);
    pop();
  }
  delegate(["click", "contextmenu"]);
  var root_4$2 = /* @__PURE__ */ template(`<div class="row"><!></div>`);
  var root_5 = /* @__PURE__ */ template(`<div class="row"></div>`);
  var root_2$3 = /* @__PURE__ */ template(`<div class="menu-content-container svelte-1c61vln"><h2 class="svelte-1c61vln">變體假名</h2> <div class="kana-table svelte-1c61vln"></div> <div class="panel svelte-1c61vln"><!> <!> <div style="flex-grow: 1"></div> <!> <!></div></div>`);
  var on_click$3 = (_, shown) => set(shown, true);
  var root_6$1 = /* @__PURE__ */ template(`<button class="show-button svelte-1c61vln" title="變體假名パネルを開く"><div class="kana svelte-1c61vln">𛀂</div></button>`);
  function VariantKana($$anchor, $$props) {
    push($$props, true);
    setContext("editor", $$props.editor);
    let shown = state(false);
    const KANA_TABLE = [
      ["あ", ["𛀂", "𛀅", "𛀃", "𛀄"]],
      ["い", ["𛀆", "𛀇", "𛀈", "𛀉"]],
      ["う", ["𛀊", "𛀋", "𛀌", "𛀍", "𛀎"]],
      [
        "え",
        ["𛀁", "𛀏", "𛀐", "𛀑", "𛀒", "𛀓"]
      ],
      ["お", ["𛀔", "𛀕", "𛀖"]],
      [
        "か",
        [
          "𛀗",
          "𛀘",
          "𛀙",
          "𛀚",
          "𛀛",
          "𛀢",
          "𛀜",
          "𛀝",
          "𛀞",
          "𛀟",
          "𛀠",
          "𛀡"
        ]
      ],
      [
        "き",
        [
          "𛀣",
          "𛀤",
          "𛀥",
          "𛀦",
          "𛀻",
          "𛀧",
          "𛀨",
          "𛀩",
          "𛀪"
        ]
      ],
      [
        "く",
        ["𛀫", "𛀬", "𛀭", "𛀮", "𛀯", "𛀰", "𛀱"]
      ],
      [
        "け",
        ["𛀳", "𛀲", "𛀢", "𛀴", "𛀵", "𛀶", "𛀷"]
      ],
      ["こ", ["𛀸", "𛂘", "𛀹", "𛀻", "𛀺"]],
      [
        "さ",
        [
          "𛀼",
          "𛀽",
          "𛀾",
          "𛀿",
          "𛁀",
          "𛁁",
          "𛁂",
          "𛁃"
        ]
      ],
      [
        "し",
        ["𛁄", "𛁅", "𛁆", "𛁇", "𛁈", "𛁉"]
      ],
      [
        "す",
        [
          "𛁊",
          "𛁋",
          "𛁌",
          "𛁍",
          "𛁎",
          "𛁏",
          "𛁐",
          "𛁑"
        ]
      ],
      ["せ", ["𛁒", "𛁓", "𛁔", "𛁕", "𛁖"]],
      [
        "そ",
        ["𛁗", "𛁘", "𛁙", "𛁚", "𛁛", "𛁜", "𛁝"]
      ],
      ["た", ["𛁞", "𛁟", "𛁠", "𛁡"]],
      [
        "ち",
        ["𛁢", "𛁣", "𛁤", "𛁥", "𛁦", "𛁧", "𛁨"]
      ],
      ["つ", ["𛁩", "𛁪", "𛁫", "𛁬", "𛁭"]],
      [
        "て",
        [
          "𛁮",
          "𛁯",
          "𛁰",
          "𛁱",
          "𛁲",
          "𛁳",
          "𛁴",
          "𛁵",
          "𛁶",
          "𛂎"
        ]
      ],
      [
        "と",
        [
          "𛁷",
          "𛁸",
          "𛁹",
          "𛁺",
          "𛁻",
          "𛁼",
          "𛁽",
          "𛁭"
        ]
      ],
      [
        "な",
        [
          "𛁾",
          "𛁿",
          "𛂀",
          "𛂁",
          "𛂂",
          "𛂃",
          "𛂄",
          "𛂅",
          "𛂆"
        ]
      ],
      [
        "に",
        [
          "𛂇",
          "𛂈",
          "𛂉",
          "𛂊",
          "𛂋",
          "𛂌",
          "𛂍",
          "𛂎"
        ]
      ],
      ["ぬ", ["𛂏", "𛂐", "𛂑"]],
      [
        "ね",
        ["𛂒", "𛂓", "𛂔", "𛂕", "𛂖", "𛂗", "𛂘"]
      ],
      ["の", ["𛂙", "𛂚", "𛂛", "𛂜", "𛂝"]],
      [
        "は",
        [
          "𛂞",
          "𛂟",
          "𛂠",
          "𛂡",
          "𛂢",
          "𛂣",
          "𛂤",
          "𛂥",
          "𛂦",
          "𛂧",
          "𛂨"
        ]
      ],
      [
        "ひ",
        ["𛂩", "𛂪", "𛂫", "𛂬", "𛂭", "𛂮", "𛂯"]
      ],
      ["ふ", ["𛂰", "𛂱", "𛂲"]],
      [
        "へ",
        ["𛂳", "𛂴", "𛂵", "𛂶", "𛂷", "𛂸", "𛂹"]
      ],
      [
        "ほ",
        [
          "𛂺",
          "𛂻",
          "𛂼",
          "𛂽",
          "𛂾",
          "𛂿",
          "𛃀",
          "𛃁"
        ]
      ],
      [
        "ま",
        [
          "𛃂",
          "𛃃",
          "𛃄",
          "𛃅",
          "𛃆",
          "𛃇",
          "𛃈",
          "𛃖"
        ]
      ],
      [
        "み",
        ["𛃉", "𛃊", "𛃋", "𛃌", "𛃍", "𛃎", "𛃏"]
      ],
      [
        "む",
        ["𛃐", "𛃑", "𛃒", "𛃓", "𛄝", "𛄞"]
      ],
      ["め", ["𛃔", "𛃕", "𛃖"]],
      [
        "も",
        [
          "𛃗",
          "𛃘",
          "𛃙",
          "𛃚",
          "𛃛",
          "𛃜",
          "𛄝",
          "𛄞"
        ]
      ],
      [
        "や",
        ["𛃝", "𛃞", "𛃟", "𛃠", "𛃡", "𛃢"]
      ],
      null,
      ["ゆ", ["𛃣", "𛃤", "𛃥", "𛃦"]],
      null,
      [
        "よ",
        ["𛃧", "𛃨", "𛃩", "𛃪", "𛃫", "𛃬"]
      ],
      ["ら", ["𛃭", "𛃮", "𛃯", "𛃰"]],
      [
        "り",
        ["𛃱", "𛃲", "𛃳", "𛃴", "𛃵", "𛃶", "𛃷"]
      ],
      [
        "る",
        ["𛃸", "𛃹", "𛃺", "𛃻", "𛃼", "𛃽"]
      ],
      ["れ", ["𛃾", "𛃿", "𛄀", "𛄁"]],
      [
        "ろ",
        ["𛄂", "𛄃", "𛄄", "𛄅", "𛄆", "𛄇"]
      ],
      ["わ", ["𛄈", "𛄉", "𛄊", "𛄋", "𛄌"]],
      ["ゐ", ["𛄍", "𛄎", "𛄏", "𛄐", "𛄑"]],
      null,
      ["ゑ", ["𛄒", "𛄓", "𛄔", "𛄕"]],
      [
        "を",
        [
          "𛄖",
          "𛄗",
          "𛄘",
          "𛄙",
          "𛄚",
          "𛄛",
          "𛄜",
          "𛀅"
        ]
      ],
      ["ん", ["𛄝", "𛄞"]],
      null,
      null,
      null,
      null
    ];
    var fragment = comment();
    var node = first_child(fragment);
    if_block(
      node,
      () => get(shown),
      ($$anchor2) => {
        FloatDialog($$anchor2, {
          get shown() {
            return get(shown);
          },
          set shown($$value) {
            set(shown, proxy($$value));
          },
          children: ($$anchor3, $$slotProps) => {
            var div2 = root_2$3();
            var div_1 = sibling(child(div2), 2);
            each(div_1, 21, () => KANA_TABLE, index, ($$anchor4, k) => {
              var fragment_2 = comment();
              var node_1 = first_child(fragment_2);
              if_block(
                node_1,
                () => get(k),
                ($$anchor5) => {
                  var div_2 = root_4$2();
                  const computed_const = /* @__PURE__ */ derived(() => {
                    const [kana, variants] = get(k);
                    return { kana, variants };
                  });
                  var node_2 = child(div_2);
                  KanaButton(node_2, {
                    get display() {
                      return get(computed_const).kana;
                    },
                    get variants() {
                      return get(computed_const).variants;
                    }
                  });
                  append($$anchor5, div_2);
                },
                ($$anchor5) => {
                  var div_3 = root_5();
                  append($$anchor5, div_3);
                }
              );
              append($$anchor4, fragment_2);
            });
            var div_4 = sibling(div_1, 2);
            var node_3 = child(div_4);
            InsertButton(node_3, {
              color: "green",
              display: "◌゙",
              text: "゙",
              title: "濁点"
            });
            var node_4 = sibling(node_3, 2);
            InsertButton(node_4, {
              color: "green",
              display: "◌゚",
              text: "゚",
              title: "半濁点"
            });
            var node_5 = sibling(node_4, 4);
            InsertButton(node_5, {
              color: "green",
              display: "子",
              text: "子",
              title: "「ネ」の異体字（漢字で代用）"
            });
            var node_6 = sibling(node_5, 2);
            InsertButton(node_6, {
              color: "green",
              display: "井",
              text: "井",
              title: "「井」の異体字（漢字で代用）"
            });
            append($$anchor3, div2);
          },
          $$slots: { default: true }
        });
      },
      ($$anchor2) => {
        var button = root_6$1();
        button.__click = [on_click$3, shown];
        append($$anchor2, button);
      }
    );
    append($$anchor, fragment);
    pop();
  }
  delegate(["click"]);
  const GROUPED_VARIANTS = {
    "者→者": [
      ["者", ["者", "者︀"]],
      ["諸", ["諸", "諸︀"]],
      ["著", ["著", "著︀"]],
      ["箸", [null, "箸󠄁"]],
      ["緒", ["緖", "緖"]],
      ["暑", ["暑", "暑︀"]],
      ["渚", ["渚", "渚︀"]],
      ["煮", ["煮", "煮︀"]],
      ["署", ["署", "署︀"]],
      ["猪", ["猪", "猪︀"]],
      ["都", ["都", "都︀"]],
      ["賭", [null, "賭󠄁"]],
      ["儲", [null, "儲󠄁"]],
      ["曙", [null, "曙󠄁"]],
      ["偖", [null, "偖󠄀"]],
      ["堵", [null, "堵󠄁"]],
      ["奢", ["奢", "奢︀"]],
      ["屠", ["屠", "屠︀"]],
      ["楮", [null, "楮󠄀"]],
      ["躇", [null, "躇󠄀"]],
      ["闍", [null, "闍󠄀"]]
    ],
    "毎→每": [
      ["毎", ["每", null]],
      ["侮", ["侮", "侮︀"]],
      ["悔", ["悔", "悔︀"]],
      ["敏", ["敏", "敏︀"]],
      ["梅", ["梅", "梅︀"]],
      ["海", ["海", "海︀"]],
      ["繁", ["繁", "繁︀"]]
    ],
    "礻→示": [
      ["神", ["神", "神︀"]],
      ["祥", ["祥", "祥︀"]],
      ["福", ["福", "福︀"]],
      ["視", ["視", "視︀"]],
      ["社", ["社", "社︀"]],
      ["祉", ["祉", "祉︀"]],
      ["祈", ["祈", "祈︀"]],
      ["祐", ["祐", "祐︀"]],
      ["祖", ["祖", "祖︀"]],
      ["祝", ["祝", "祝︀"]],
      ["禍", ["禍", "禍︀"]],
      ["禎", ["禎", "禎︀"]]
    ],
    "真→眞": [
      ["直", ["直", "直︁"]],
      ["真", ["眞", "眞"]],
      ["顛", ["顚", "顚"]]
    ],
    "开→幵": [
      ["研", ["硏", "硏"]],
      ["妍", ["姸", "姸"]],
      ["笄", ["筓", "筓"]]
    ],
    "并→幷": [
      ["并", ["幷", "幷"]],
      ["併", ["倂", "倂"]],
      ["胼", ["腁", "腁"]],
      ["駢", ["騈", "騈"]],
      ["迸", ["逬", "逬"]],
      ["瓶", ["甁", "甁"]],
      ["屏", ["屛", "屛"]],
      ["塀", ["塀", "塀︀"]]
    ],
    "𢀳→皀": [
      ["即", ["卽", "卽"]],
      ["節", ["節", "節︀"]],
      ["既", ["旣", "旣"]],
      ["郷", ["鄕", "鄕"]],
      ["慨", ["慨", "慨︀"]],
      ["概", ["槪", "槪"]],
      ["㮣", ["槩", "槩"]]
    ],
    "曽→曾": [
      ["曽", ["曾", "曾"]],
      ["僧", ["僧", "僧︀"]],
      ["層", ["層", "層︀"]],
      ["憎", ["憎", "憎︀"]],
      ["贈", ["贈", "贈︀"]],
      ["増", ["增", "增"]]
    ],
    "黒→黑": [
      ["黒", ["黑", "黑"]],
      ["墨", ["墨", "墨︀"]],
      ["薫", ["薰", "薰"]]
    ],
    "東→柬": [
      ["練", ["練", "練︁"]],
      ["錬", ["鍊", "鍊"]],
      ["欄", ["欄", "欄︀"]]
    ],
    "⺈→刀": [
      ["免", ["免", "免︀"]],
      // ["逸", ["逸", null]],
      // ["晩", ["晚", null]],
      // ["勉", ["勉", null]],
      ["絶", ["絕", "絕"]]
    ],
    "廿→艹": [
      ["漢", ["漢", "漢︀"]],
      ["難", ["難", "難︀"]],
      ["勤", ["勤", "勤︀"]],
      ["嘆", ["嘆", "嘆︀"]]
    ],
    "兑→兌": [
      ["兑", ["兌", "兌"]],
      ["悦", ["悅", "悅"]],
      ["説", ["說", "說"]],
      ["脱", ["脫", "脫"]],
      ["鋭", ["銳", "銳"]],
      ["閲", ["閱", "閱"]]
    ],
    "戸→戶": [
      ["戸", ["戶", "戶"]],
      ["戻", ["戾", "戾"]],
      ["涙", ["淚", "淚"]]
    ],
    "豕→豖": [["琢", ["琢", "琢︀"]]],
    "卑→卑": [
      ["卑", ["卑", "卑︀"]],
      ["碑", ["碑", "碑︀"]]
    ],
    "匂→匃": [
      ["喝", ["喝", "喝︀"]],
      ["褐", ["褐", "褐︀"]],
      ["謁", ["謁", "謁︀"]],
      ["掲", ["揭", "揭"]],
      ["渇", ["渴", "渴"]]
    ],
    "大→犬": [
      ["器", ["器", "器︀"]],
      ["突", ["突", "突︀"]],
      ["臭", ["臭", "臭︀"]],
      ["戻", ["戾", "戾"]],
      ["涙", ["淚", "淚"]],
      ["類", ["類", "類︀"]]
    ],
    "㇏→乀󠄀": [
      ["又", ["又󠄂", "又󠄂"]],
      ["交", ["交󠄁", "交󠄁"]],
      ["文", [null, "文󠄁"]],
      ["史", [null, "史󠄁"]]
    ],
    "冫⇆𰀪": [
      ["羽", ["羽", "羽󠄀"]],
      ["習", [null, "習󠄁"]],
      ["冬", ["冬", "冬󠄀"]]
    ],
    "亡→亡󠄁": [["亡", [null, "亡󠄁"]]],
    "丷→八": [
      ["遂", [null, "遂󠄂"]],
      ["半", [null, "半󠄁"]],
      ["肖", [null, "肖󠄁"]],
      ["酋", [null, "酋󠄁"]],
      ["益", ["益", "益︀"]]
    ],
    "己→巳": [
      ["記", [null, "記󠄂"]],
      ["起", [null, "起󠄁"]]
    ],
    "丶→丩": [["並", ["並", "並︀"]]],
    "辶→辶󠄀": [["近", [null, "近󠄁"]]],
    "爫→爪": [["採", [null, "採󠄁"]]],
    "月→丹": [
      ["丹", [null, "丹󠄁"]],
      ["青", ["靑", "靑"]],
      ["精", [null, "精󠄀"]],
      ["晴", [null, "晴󠄀"]],
      ["睛", [null, "睛󠄀"]]
    ],
    "𫩏→中": [
      ["告", ["吿", "吿"]],
      ["舎", ["舍", "舍"]],
      ["周", ["周", "周︀"]]
    ],
    "人→入": [
      ["全", [null, "全󠄁"]],
      ["内", ["內", "內"]]
    ]
  };
  var root_2$2 = /* @__PURE__ */ template(`<button class="svelte-1m4k62d"> </button>`);
  var root$1 = /* @__PURE__ */ template(`<button class="type svelte-1m4k62d"> </button> <div class="variants svelte-1m4k62d"></div>`, 1);
  function InsertButtonVariantKanji($$anchor, $$props) {
    push($$props, true);
    let instance;
    let button;
    let variantsContainer;
    let active = state(false);
    onMount(() => {
      instance = tippy(button, {
        content: variantsContainer,
        theme: "kana",
        interactive: true,
        offset: [0, 0],
        placement: "auto",
        onShow: () => {
          set(active, true);
        },
        onHide: () => {
          set(active, false);
        }
      });
    });
    const editor = getContext("editor");
    var fragment = root$1();
    var button_1 = first_child(fragment);
    bind_this(button_1, ($$value) => button = $$value, () => button);
    const class_directive = /* @__PURE__ */ derived(() => $$props.variants.some(([display, _v]) => $$props.selection.includes(display)));
    template_effect(() => toggle_class(button_1, "selected", get(class_directive)));
    var text = child(button_1);
    var div2 = sibling(button_1, 2);
    bind_this(div2, ($$value) => variantsContainer = $$value, () => variantsContainer);
    const $$array = () => $$props.variants;
    each(div2, 21, $$array, index, ($$anchor2, $$item) => {
      let display = () => get($$item)[0];
      let variant = () => get($$item)[1];
      var fragment_1 = comment();
      var node = first_child(fragment_1);
      if_block(node, variant, ($$anchor3) => {
        var button_2 = root_2$2();
        button_2.__click = () => {
          if (editor) {
            editor.insertAtCursor(variant());
          }
          instance == null ? void 0 : instance.hide();
        };
        const class_directive_1 = /* @__PURE__ */ derived(() => $$props.selection.includes(display()));
        template_effect(() => toggle_class(button_2, "selected", get(class_directive_1)));
        var text_1 = child(button_2);
        template_effect(() => set_text(text_1, `${display() ?? ""}→${variant() ?? ""}`));
        append($$anchor3, button_2);
      });
      append($$anchor2, fragment_1);
    });
    template_effect(() => {
      toggle_class(button_1, "active", get(active));
      set_text(text, $$props.display);
    });
    append($$anchor, fragment);
    pop();
  }
  delegate(["click"]);
  const preferences = (() => {
    let highlight = state(localStorage.getItem("highlight-variant-kanji") === "true");
    return {
      get highlight() {
        return get(highlight);
      },
      set highlight(value) {
        set(highlight, proxy(value));
        localStorage.setItem("highlight-variant-kanji", value.toString());
      }
    };
  })();
  var root_4$1 = /* @__PURE__ */ template(`<hr class="svelte-9lvbl8"> <div class="panel svelte-9lvbl8"></div>`, 1);
  var root_2$1 = /* @__PURE__ */ template(`<div class="menu-content-container svelte-9lvbl8"><h2 class="svelte-9lvbl8">異體漢字</h2> <label class="svelte-9lvbl8"><input type="checkbox" name="highlight"> <span>異體字をハイライト</span></label> <select class="svelte-9lvbl8"><option>異体字セレクタのみ</option><option>CJK互換漢字のみ</option><option>CJK互換漢字優先</option></select> <div class="panel svelte-9lvbl8"><!> <!></div> <!></div>`);
  var on_click$2 = (_, shown) => set(shown, true);
  var root_6 = /* @__PURE__ */ template(`<button class="show-button svelte-9lvbl8" title="變體假名パネルを開く"><div class="icon svelte-9lvbl8">異</div></button>`);
  function VariantKanji($$anchor, $$props) {
    push($$props, true);
    setContext("editor", $$props.editor);
    let shown = state(false);
    const VARIANTS = [
      {
        traditional: "敎",
        simplified: "教",
        color: "blue"
      }
    ];
    let inputMode = state(proxy($$props.editor instanceof KojiEditor ? "compatibility-first" : "variant-selector-only"));
    function selectVariant(compatibility, variantSelector) {
      switch (get(inputMode)) {
        case "compatibility-only":
          return compatibility || null;
        case "variant-selector-only":
          return variantSelector || null;
        case "compatibility-first":
          return compatibility || variantSelector;
      }
    }
    user_effect(() => {
      for (const { simplified } of VARIANTS) {
        if ($$props.editor.segments.includes(simplified)) {
          $$props.editor.markText(simplified);
        }
      }
      for (const [_key, variants] of Object.entries(GROUPED_VARIANTS)) {
        for (const [display, _variant] of variants) {
          if ($$props.editor.segments.includes(display)) {
            $$props.editor.markText(display);
          }
        }
      }
    });
    user_effect(() => {
      $$props.editor.toggleClass("display-variant-highlight", preferences.highlight);
    });
    let selectedVariants = /* @__PURE__ */ derived(() => [
      ...[...Object.values(GROUPED_VARIANTS)].flat(),
      ...VARIANTS.map(({ traditional, simplified }) => [simplified, traditional])
    ].filter(([key, variants]) => segment($$props.editor.selectedText).includes(key)).map(([key, variants]) => [
      key,
      selectVariant(variants[0], variants[1])
    ]).filter(([_, variant]) => variant));
    var fragment = comment();
    var node = first_child(fragment);
    if_block(
      node,
      () => get(shown),
      ($$anchor2) => {
        FloatDialog($$anchor2, {
          get shown() {
            return get(shown);
          },
          set shown($$value) {
            set(shown, proxy($$value));
          },
          children: ($$anchor3, $$slotProps) => {
            var div2 = root_2$1();
            var label = sibling(child(div2), 2);
            var input = child(label);
            var select = sibling(label, 2);
            var option = child(select);
            option.value = null == (option.__value = "variant-selector-only") ? "" : "variant-selector-only";
            var option_1 = sibling(option);
            option_1.value = null == (option_1.__value = "compatibility-only") ? "" : "compatibility-only";
            var option_2 = sibling(option_1);
            option_2.value = null == (option_2.__value = "compatibility-first") ? "" : "compatibility-first";
            var div_1 = sibling(select, 2);
            var node_1 = child(div_1);
            each(node_1, 17, () => Object.entries(GROUPED_VARIANTS), index, ($$anchor4, $$item) => {
              let key = () => get($$item)[0];
              let variants = () => get($$item)[1];
              var variants_1 = /* @__PURE__ */ derived(() => variants().map(([
                display,
                [compatibility, variantSelector]
              ]) => [
                display,
                selectVariant(compatibility, variantSelector)
              ]));
              InsertButtonVariantKanji($$anchor4, {
                get display() {
                  return key();
                },
                get variants() {
                  return get(variants_1);
                },
                get selection() {
                  return $$props.editor.selectedText;
                }
              });
            });
            var node_2 = sibling(node_1, 2);
            var variants_2 = /* @__PURE__ */ derived(() => VARIANTS.map(({ traditional, simplified }) => [simplified, traditional]));
            InsertButtonVariantKanji(node_2, {
              display: "其ノ他",
              get variants() {
                return get(variants_2);
              },
              get selection() {
                return $$props.editor.selectedText;
              }
            });
            var node_3 = sibling(div_1, 2);
            if_block(node_3, () => get(selectedVariants).length > 0, ($$anchor4) => {
              var fragment_3 = root_4$1();
              var div_2 = sibling(first_child(fragment_3), 2);
              each(div_2, 21, () => get(selectedVariants), index, ($$anchor5, $$item) => {
                let key = () => get($$item)[0];
                let variant = () => get($$item)[1];
                var display_1 = /* @__PURE__ */ derived(() => `${key()}→${variant()}`);
                var title = /* @__PURE__ */ derived(() => `「${key()}」の異體字`);
                InsertButton($$anchor5, {
                  color: "orange",
                  get display() {
                    return get(display_1);
                  },
                  text: (selectedText) => segment(selectedText).map((segment2) => segment2 === key() ? variant() : segment2).join(""),
                  get title() {
                    return get(title);
                  }
                });
              });
              append($$anchor4, fragment_3);
            });
            bind_checked(input, () => preferences.highlight, ($$value) => preferences.highlight = $$value);
            bind_select_value(select, () => get(inputMode), ($$value) => set(inputMode, $$value));
            append($$anchor3, div2);
          },
          $$slots: { default: true }
        });
      },
      ($$anchor2) => {
        var button = root_6();
        button.__click = [on_click$2, shown];
        append($$anchor2, button);
      }
    );
    append($$anchor, fragment);
    pop();
  }
  delegate(["click"]);
  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  var on_click$1 = (_, textValue, $$props, colorValue, displayValue, editing) => {
    var _a, _b;
    if (get(textValue)) {
      (_a = $$props.onedit) == null ? void 0 : _a.call($$props, get(colorValue), get(textValue), get(displayValue));
      set(editing, false);
    } else {
      (_b = $$props.ondelete) == null ? void 0 : _b.call($$props);
    }
  };
  var root = /* @__PURE__ */ template(`<input type="text" title="入力文字（必須、空欄で削除）" class="svelte-h6zyeb"> <input type="text" title="表示文字" class="svelte-h6zyeb"> <select title="文字色" class="svelte-h6zyeb"><option>black</option><option>green</option><option>blue</option><option>red</option><option>pink</option><option>gray</option></select> <button>OK</button>`, 1);
  function InsertButtonEdit($$anchor, $$props) {
    push($$props, true);
    let color = prop($$props, "color", 3, "black"), display = prop($$props, "display", 19, () => $$props.text);
    let editing = state(false);
    let textValue = state(proxy($$props.text));
    let displayValue = state(proxy(display()));
    let colorValue = state(proxy(color()));
    var fragment = root();
    var input = first_child(fragment);
    var input_1 = sibling(input, 2);
    var select = sibling(input_1, 2);
    var option = child(select);
    option.value = null == (option.__value = "black") ? "" : "black";
    var option_1 = sibling(option);
    option_1.value = null == (option_1.__value = "green") ? "" : "green";
    var option_2 = sibling(option_1);
    option_2.value = null == (option_2.__value = "blue") ? "" : "blue";
    var option_3 = sibling(option_2);
    option_3.value = null == (option_3.__value = "red") ? "" : "red";
    var option_4 = sibling(option_3);
    option_4.value = null == (option_4.__value = "pink") ? "" : "pink";
    var option_5 = sibling(option_4);
    option_5.value = null == (option_5.__value = "gray") ? "" : "gray";
    var button = sibling(select, 2);
    button.__click = [
      on_click$1,
      textValue,
      $$props,
      colorValue,
      displayValue,
      editing
    ];
    bind_value(input, () => get(textValue), ($$value) => set(textValue, $$value));
    bind_value(input_1, () => get(displayValue), ($$value) => set(displayValue, $$value));
    bind_select_value(select, () => get(colorValue), ($$value) => set(colorValue, $$value));
    append($$anchor, fragment);
    pop();
  }
  delegate(["click"]);
  function CustomInsertButton($$anchor, $$props) {
    push($$props, true);
    let color = prop($$props, "color", 3, "black"), display = prop($$props, "display", 19, () => $$props.text);
    let editing = state(false);
    proxy($$props.text);
    var fragment = comment();
    var node = first_child(fragment);
    if_block(
      node,
      () => get(editing),
      ($$anchor2) => {
        InsertButtonEdit($$anchor2, {
          get color() {
            return color();
          },
          get text() {
            return $$props.text;
          },
          get display() {
            return display();
          },
          onedit: (color2, text, display2) => {
            var _a;
            (_a = $$props.onedit) == null ? void 0 : _a.call($$props, color2, text, display2);
            set(editing, false);
          },
          ondelete: () => {
            var _a;
            (_a = $$props.ondelete) == null ? void 0 : _a.call($$props);
            set(editing, false);
          }
        });
      },
      ($$anchor2) => {
        InsertButton($$anchor2, {
          get color() {
            return color();
          },
          get text() {
            return $$props.text;
          },
          get display() {
            return display();
          },
          oncontextmenu: (e2) => {
            e2.preventDefault();
            set(editing, true);
          }
        });
      }
    );
    append($$anchor, fragment);
    pop();
  }
  var root_3 = /* @__PURE__ */ template(`<div class="panel svelte-1l9kdai"><h3 class="svelte-1l9kdai">頁注</h3> <!> <!> <!> <!> <!> <!> <!></div> <div class="panel svelte-1l9kdai"><h3 class="svelte-1l9kdai">音注</h3> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!></div> <div class="panel svelte-1l9kdai"><h3 class="svelte-1l9kdai">返点</h3> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!></div> <div class="panel svelte-1l9kdai"><h3 class="svelte-1l9kdai">註釋</h3> <!> <!> <!></div>`, 1);
  var root_4 = /* @__PURE__ */ template(`<div class="panel svelte-1l9kdai"><h3 class="svelte-1l9kdai">傍点</h3> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <h3 class="svelte-1l9kdai">ルビー</h3> <!> <h3 class="svelte-1l9kdai">註釋</h3> <!> <!></div>`);
  var on_click = (_, editingCustom) => {
    set(editingCustom, !get(editingCustom));
  };
  var root_2 = /* @__PURE__ */ template(`<div class="panels"><!> <!> <div class="panel svelte-1l9kdai"><h3 class="svelte-1l9kdai">記号</h3> <!> <!> <!> <!> <!> <!> <!> <!> <!></div> <div class="panel svelte-1l9kdai"><h3 class="svelte-1l9kdai">踊字</h3> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!></div> <div class="panel svelte-1l9kdai"><h3 class="svelte-1l9kdai">合字</h3> <!> <!> <!> <!> <!> <!> <!> <!> <h3 class="svelte-1l9kdai">其他</h3> <button class="svelte-1l9kdai">カスタム</button> <!></div></div>`);
  var on_click_1 = (_, shown) => set(shown, true);
  var root_8 = /* @__PURE__ */ template(`<button class="show-button svelte-1l9kdai" title="翻刻ツールボックスを開く"><img alt="Honkoku" class="svelte-1l9kdai"></button>`);
  function MainMenu($$anchor, $$props) {
    push($$props, true);
    setContext("editor", $$props.editor);
    let shown = state(false);
    let editingCustom = state(false);
    let customButtons = state(proxy([]));
    let customText = state("");
    let customColor = "black";
    let customDisplay = state("");
    user_effect(() => {
      set(customDisplay, proxy(get(customText)));
    });
    (async () => {
      set(customButtons, proxy(JSON.parse(await _GM.getValue("customButtons", "[]"))));
    })();
    user_effect(() => {
      _GM.setValue("customButtons", JSON.stringify(get(customButtons))).then();
    });
    user_effect(() => {
      if (get(editingCustom)) {
        set(customText, proxy($$props.editor.selectedText));
      }
    });
    var fragment = comment();
    var node = first_child(fragment);
    if_block(
      node,
      () => get(shown),
      ($$anchor2) => {
        FloatDialog($$anchor2, {
          get shown() {
            return get(shown);
          },
          set shown($$value) {
            set(shown, proxy($$value));
          },
          children: ($$anchor3, $$slotProps) => {
            var div2 = root_2();
            var node_1 = child(div2);
            if_block(node_1, () => $$props.platform === "honkoku", ($$anchor4) => {
              var fragment_2 = root_3();
              var div_1 = first_child(fragment_2);
              var node_2 = sibling(child(div_1), 2);
              InsertButton(node_2, { color: "green", text: "【左頁】" });
              var node_3 = sibling(node_2, 2);
              InsertButton(node_3, { color: "green", text: "【左丁】" });
              var node_4 = sibling(node_3, 2);
              InsertButton(node_4, { color: "green", text: "【右頁】" });
              var node_5 = sibling(node_4, 2);
              InsertButton(node_5, { color: "green", text: "【右丁】" });
              var node_6 = sibling(node_5, 2);
              InsertButton(node_6, { color: "red", text: "【上段】" });
              var node_7 = sibling(node_6, 2);
              InsertButton(node_7, { color: "red", text: "【中段】" });
              var node_8 = sibling(node_7, 2);
              InsertButton(node_8, { color: "red", text: "【下段】" });
              var div_2 = sibling(div_1, 2);
              var node_9 = sibling(child(div_2), 2);
              InsertButton(node_9, { color: "gray", text: (t2) => `￣${t2}` });
              var node_10 = sibling(node_9, 2);
              InsertButton(node_10, { color: "green", text: "￣ハ", display: "ハ" });
              var node_11 = sibling(node_10, 2);
              InsertButton(node_11, { color: "green", text: "￣モ", display: "モ" });
              var node_12 = sibling(node_11, 2);
              InsertButton(node_12, { color: "green", text: "￣ヲ", display: "ヲ" });
              var node_13 = sibling(node_12, 2);
              InsertButton(node_13, { color: "green", text: "￣ヲバ", display: "ヲバ" });
              var node_14 = sibling(node_13, 2);
              InsertButton(node_14, { color: "green", text: "￣カ", display: "カ" });
              var node_15 = sibling(node_14, 2);
              InsertButton(node_15, { color: "green", text: "￣ガ", display: "ガ" });
              var node_16 = sibling(node_15, 2);
              InsertButton(node_16, { color: "green", text: "￣ノ", display: "ノ" });
              var node_17 = sibling(node_16, 2);
              InsertButton(node_17, { color: "green", text: "￣ニ", display: "ニ" });
              var node_18 = sibling(node_17, 2);
              InsertButton(node_18, { color: "green", text: "￣ヘ", display: "ヘ" });
              var node_19 = sibling(node_18, 2);
              InsertButton(node_19, { color: "green", text: "￣ノミ", display: "ノミ" });
              var node_20 = sibling(node_19, 2);
              InsertButton(node_20, { color: "green", text: "￣ト", display: "ト" });
              var node_21 = sibling(node_20, 2);
              InsertButton(node_21, { color: "blue", text: "￣ス", display: "ス" });
              var node_22 = sibling(node_21, 2);
              InsertButton(node_22, { color: "blue", text: "￣スル", display: "ス" });
              var node_23 = sibling(node_22, 2);
              InsertButton(node_23, { color: "blue", text: "￣タル", display: "タル" });
              var node_24 = sibling(node_23, 2);
              InsertButton(node_24, { color: "blue", text: "￣タリ", display: "タリ" });
              var node_25 = sibling(node_24, 2);
              InsertButton(node_25, { color: "blue", text: "￣ナリ", display: "ナリ" });
              var node_26 = sibling(node_25, 2);
              InsertButton(node_26, { color: "blue", text: "￣ナル", display: "ナル" });
              var node_27 = sibling(node_26, 2);
              InsertButton(node_27, { color: "red", text: "￣レバ", display: "レバ" });
              var div_3 = sibling(div_2, 2);
              var node_28 = sibling(child(div_3), 2);
              InsertButton(node_28, { color: "red", text: "＿レ", display: "レ" });
              var node_29 = sibling(node_28, 2);
              InsertButton(node_29, { color: "blue", text: "＿一", display: "一" });
              var node_30 = sibling(node_29, 2);
              InsertButton(node_30, { color: "blue", text: "＿二", display: "二" });
              var node_31 = sibling(node_30, 2);
              InsertButton(node_31, { color: "blue", text: "＿三", display: "三" });
              var node_32 = sibling(node_31, 2);
              InsertButton(node_32, { color: "blue", text: "＿四", display: "四" });
              var node_33 = sibling(node_32, 2);
              InsertButton(node_33, { color: "green", text: "＿上", display: "上" });
              var node_34 = sibling(node_33, 2);
              InsertButton(node_34, { color: "green", text: "＿中", display: "中" });
              var node_35 = sibling(node_34, 2);
              InsertButton(node_35, { color: "green", text: "＿下", display: "下" });
              var node_36 = sibling(node_35, 2);
              InsertButton(node_36, { color: "pink", text: "＿甲", display: "甲" });
              var node_37 = sibling(node_36, 2);
              InsertButton(node_37, { color: "pink", text: "＿乙", display: "乙" });
              var node_38 = sibling(node_37, 2);
              InsertButton(node_38, { color: "pink", text: "＿丙", display: "丙" });
              var node_39 = sibling(node_38, 2);
              InsertButton(node_39, { color: "pink", text: "＿丁", display: "丁" });
              var node_40 = sibling(node_39, 2);
              InsertButton(node_40, { color: "pink", text: "＿天", display: "天" });
              var node_41 = sibling(node_40, 2);
              InsertButton(node_41, { color: "pink", text: "＿地", display: "地" });
              var node_42 = sibling(node_41, 2);
              InsertButton(node_42, { color: "pink", text: "＿人", display: "人" });
              var node_43 = sibling(node_42, 2);
              InsertButton(node_43, { color: "red", text: "＿一レ", display: "一レ" });
              var node_44 = sibling(node_43, 2);
              InsertButton(node_44, { color: "red", text: "＿二レ", display: "二レ" });
              var node_45 = sibling(node_44, 2);
              InsertButton(node_45, { color: "red", text: "＿三レ", display: "三レ" });
              var node_46 = sibling(node_45, 2);
              InsertButton(node_46, { color: "red", text: "＿四レ", display: "四レ" });
              var node_47 = sibling(node_46, 2);
              InsertButton(node_47, { color: "red", text: "＿上レ", display: "上レ" });
              var div_4 = sibling(div_3, 2);
              var node_48 = sibling(child(div_4), 2);
              InsertButton(node_48, {
                color: "pink",
                text: (t2) => `／${t2}（）`,
                display: "ルビー"
              });
              var node_49 = sibling(node_48, 2);
              InsertButton(node_49, {
                color: "blue",
                text: (t2) => `《割書：${t2}｜》`,
                display: "割注"
              });
              var node_50 = sibling(node_49, 2);
              InsertButton(node_50, {
                color: "red",
                text: (t2) => `【${t2}】`,
                display: "注釈"
              });
              append($$anchor4, fragment_2);
            });
            var node_51 = sibling(node_1, 2);
            if_block(node_51, () => $$props.platform === "wikisource", ($$anchor4) => {
              var div_5 = root_4();
              var node_52 = sibling(child(div_5), 2);
              InsertButton(node_52, {
                color: "green",
                text: (t2) => `{{傍点|style=filled sesame|${t2}}}`,
                display: "﹅",
                title: "傍点（黒ゴマ）"
              });
              var node_53 = sibling(node_52, 2);
              InsertButton(node_53, {
                color: "green",
                text: (t2) => `{{傍点|style=open sesame|${t2}}}`,
                display: "﹆",
                title: "傍点（白ゴマ）"
              });
              var node_54 = sibling(node_53, 2);
              InsertButton(node_54, {
                color: "green",
                text: (t2) => `{{傍点|style=filled dot|${t2}}}`,
                display: "•",
                title: "傍点（黒点）"
              });
              var node_55 = sibling(node_54, 2);
              InsertButton(node_55, {
                color: "green",
                text: (t2) => `{{傍点|style=open dot|${t2}}}`,
                display: "◦",
                title: "傍点（白点）"
              });
              var node_56 = sibling(node_55, 2);
              InsertButton(node_56, {
                color: "green",
                text: (t2) => `{{傍点|style=filled circle|${t2}}}`,
                display: "●",
                title: "傍点（黒丸）"
              });
              var node_57 = sibling(node_56, 2);
              InsertButton(node_57, {
                color: "green",
                text: (t2) => `{{傍点|style=open circle|${t2}}}`,
                display: "○",
                title: "傍点（白丸）"
              });
              var node_58 = sibling(node_57, 2);
              InsertButton(node_58, {
                color: "green",
                text: (t2) => `{{傍点|style=filled double-circle|${t2}}}`,
                display: "◉",
                title: "傍点（黒二重丸）"
              });
              var node_59 = sibling(node_58, 2);
              InsertButton(node_59, {
                color: "green",
                text: (t2) => `{{傍点|style=open double-circle|${t2}}}`,
                display: "◎",
                title: "傍点（白二重丸）"
              });
              var node_60 = sibling(node_59, 2);
              InsertButton(node_60, {
                color: "green",
                text: (t2) => `{{傍点|style=filled triangle|${t2}}}`,
                display: "▲",
                title: "傍点（黒三角）"
              });
              var node_61 = sibling(node_60, 2);
              InsertButton(node_61, {
                color: "green",
                text: (t2) => `{{傍点|style=open triangle|${t2}}}`,
                display: "△",
                title: "傍点（白三角）"
              });
              var node_62 = sibling(node_61, 4);
              InsertButton(node_62, {
                color: "pink",
                text: (t2) => `{{ruby|${t2}|}}`,
                display: "ルビ"
              });
              var node_63 = sibling(node_62, 4);
              InsertButton(node_63, {
                color: "green",
                text: (t2) => `<ref>${t2}</ref>`,
                display: "註釋"
              });
              var node_64 = sibling(node_63, 2);
              InsertButton(node_64, {
                color: "green",
                text: (t2) => `{{分註|${t2}|}}`,
                display: "分註",
                title: "分註（割註）"
              });
              append($$anchor4, div_5);
            });
            var div_6 = sibling(node_51, 2);
            var node_65 = sibling(child(div_6), 2);
            InsertButton(node_65, { color: "green", text: "—", title: "emダッシュ" });
            var node_66 = sibling(node_65, 2);
            InsertButton(node_66, { color: "green", text: "…", title: "省略号" });
            var node_67 = sibling(node_66, 2);
            InsertButton(node_67, { color: "green", text: "、", title: "読点" });
            var node_68 = sibling(node_67, 2);
            InsertButton(node_68, { color: "green", text: "，", title: "カンマ" });
            var node_69 = sibling(node_68, 2);
            InsertButton(node_69, { color: "green", text: "。", title: "句点" });
            var node_70 = sibling(node_69, 2);
            InsertButton(node_70, { color: "green", text: "-", title: "ハイフン" });
            var node_71 = sibling(node_70, 2);
            InsertButton(node_71, {
              color: "green",
              text: " ",
              display: "␣",
              title: "半角スペース"
            });
            var node_72 = sibling(node_71, 2);
            InsertButton(node_72, {
              color: "green",
              text: "　",
              display: "▢",
              title: "全角スペース"
            });
            var node_73 = sibling(node_72, 2);
            InsertButton(node_73, { color: "green", text: "◯", title: "全角丸" });
            var div_7 = sibling(div_6, 2);
            var node_74 = sibling(child(div_7), 2);
            InsertButton(node_74, { color: "green", text: "々", title: "同の字点" });
            var node_75 = sibling(node_74, 2);
            InsertButton(node_75, {
              color: "green",
              text: "ゝ",
              title: "一の字点（ひらがな）"
            });
            var node_76 = sibling(node_75, 2);
            InsertButton(node_76, {
              color: "green",
              text: "ゞ",
              title: "一の字点（ひらがな、濁点付き）"
            });
            var node_77 = sibling(node_76, 2);
            InsertButton(node_77, {
              color: "green",
              text: "ヽ",
              title: "一の字点（カタカナ）"
            });
            var node_78 = sibling(node_77, 2);
            InsertButton(node_78, {
              color: "green",
              text: "ヾ",
              title: "一の字点（カタカナ、濁点付き）"
            });
            var node_79 = sibling(node_78, 2);
            InsertButton(node_79, { color: "green", text: "〻", title: "二の字点" });
            var node_80 = sibling(node_79, 2);
            InsertButton(node_80, { color: "green", text: "〳", title: "くの字点上" });
            var node_81 = sibling(node_80, 2);
            InsertButton(node_81, {
              color: "green",
              text: "〴",
              title: "くの字点上（濁点付き）"
            });
            var node_82 = sibling(node_81, 2);
            InsertButton(node_82, { color: "green", text: "〵", title: "くの字点下" });
            var node_83 = sibling(node_82, 2);
            InsertButton(node_83, {
              color: "green",
              text: "〱",
              title: "くの字点（濁点付き）"
            });
            var node_84 = sibling(node_83, 2);
            InsertButton(node_84, {
              color: "green",
              text: "〲",
              title: "くの字点（濁点付き）"
            });
            var div_8 = sibling(div_7, 2);
            var node_85 = sibling(child(div_8), 2);
            InsertButton(node_85, { color: "green", text: "〆", title: "締め" });
            var node_86 = sibling(node_85, 2);
            InsertButton(node_86, { color: "green", text: " ͡と", title: "「こと」" });
            var node_87 = sibling(node_86, 2);
            InsertButton(node_87, { color: "green", text: "ゟ", title: "「より」" });
            var node_88 = sibling(node_87, 2);
            InsertButton(node_88, { color: "green", text: "𬼂", title: "「也」" });
            var node_89 = sibling(node_88, 2);
            InsertButton(node_89, { color: "green", text: "𬻿", title: "「也」" });
            var node_90 = sibling(node_89, 2);
            InsertButton(node_90, { color: "green", text: "ヿ", title: "「コト」" });
            var node_91 = sibling(node_90, 2);
            InsertButton(node_91, { color: "green", text: "𪜈", title: "「トモ」" });
            var node_92 = sibling(node_91, 2);
            InsertButton(node_92, { color: "green", text: "𬼀", title: "「タメ」" });
            var button = sibling(node_92, 4);
            button.__click = [on_click, editingCustom];
            var node_93 = sibling(button, 2);
            if_block(
              node_93,
              () => get(editingCustom),
              ($$anchor4) => {
                InsertButtonEdit($$anchor4, {
                  get color() {
                    return customColor;
                  },
                  get text() {
                    return get(customText);
                  },
                  get display() {
                    return get(customDisplay);
                  },
                  onedit: (color, text, display) => {
                    get(customButtons).push({
                      text,
                      color,
                      display: !display || display === text ? void 0 : display
                    });
                    _GM.setValue("customButtons", JSON.stringify(get(customButtons)));
                    set(editingCustom, false);
                  }
                });
              },
              ($$anchor4) => {
                var fragment_4 = comment();
                var node_94 = first_child(fragment_4);
                each(node_94, 17, () => get(customButtons), index, ($$anchor5, $$item, i2) => {
                  let text = () => get($$item).text;
                  let display = () => get($$item).display;
                  let color = () => get($$item).color;
                  CustomInsertButton($$anchor5, {
                    get color() {
                      return color();
                    },
                    get text() {
                      return text();
                    },
                    get display() {
                      return display();
                    },
                    onedit: (color2, text2, display2) => {
                      get(customButtons)[i2] = {
                        color: color2,
                        text: text2,
                        display: !display2 || display2 === text2 ? void 0 : display2
                      };
                    },
                    ondelete: () => {
                      get(customButtons).splice(i2, 1);
                    }
                  });
                });
                append($$anchor4, fragment_4);
              }
            );
            append($$anchor3, div2);
          },
          $$slots: { default: true }
        });
      },
      ($$anchor2) => {
        var button_1 = root_8();
        button_1.__click = [on_click_1, shown];
        var img = child(button_1);
        set_attribute(img, "src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAaLSURBVHgB7VtdUttWFD6SScxMH0pXgOhbSNqYHcAKCiuoO9MXYDKYFeCsAGcI8NIZkxWQrAC6AkibwltxV1BemmKCrX5HSFi+Plc6km0QU38zHpGrqyvde8/Pd865IZpgggn+z3Ckxv1z8nBp+j4t0sPg1HFoZfUZtWjMcKVGTPzwASfPqOD9R+FGjBVTlvYKPTw8LMIGrpuazs0Tmvn8lGqQ6Q2I9QyaGmvz6c+KEoABjqkAwAJUNf12P1H1c5kuoDZb4eQZtb1z+jHtWXEBrtr0Ey6n9MDAhGZ2frerIlRkEb8jx6VmbOK95yldjUUV2FwIjM8C3TP2z+jINz66VKIfyJBI7HjFLdF2mp3yFZLsUoHQ7dI7sy2uBqznmHwDO36imHxt7dngeCYcKhC2McGnrMuGOHddWnY6kMiegbOCd/0aKhxKcSpSF2CMnED09XtndIjLMmUETxyTqcPy/5rluanUgf3gg8bhFitdn5q4LsUbsdNv/FKmBWjRDW2uf0/vKQc0NmBsnECy0lc3dIrdvEx7lvtgc+rtNi2s5Zw8I3UBxskJfMHVQncvXSd5Qjxx6Pnc+nN6zf1pCKQuwLg4QWisVsSbN7L15mfaI5p4hJF5ARgv32yDQco1vs0bdDq09Oq7nkSygY7ZqFwBlIoH8IuYcfEkd8/zBSnsw6Mx8LvY+81u6GxqMDXVT205YKKejeIA6mLnD6pTBmiJ0J0bdHDlF/MuUQZcTfcxNw+Wvpk4hqAGIErLxjOe2aeEeIAXWLtJqgUQOIAHET0kJThYMQMb5vlPn9g/chWibnoDfgZScOeVEgw0q8YFFmI7baNUCyC9iF1YUqDS19elLaG5df0lWV/xjgOzLa4GoYFuJQxRK5fpJOk7VQvAL5J8c2mKZkkHb6DFoXqaJQcp+mC2xdWA6S4M7RzUsp4wjIeA6ujtJ+QKBKgWgF/kdvpdFi9I+0pHO00JgngeaAIVmxqUp4MIsdcPbpHdIyVIg+sGyZXBdlJi9db9rISTeX/dpSVtwBFIkB+I82lAYq51WR6GpAZSoiQuDZK02thlIXlAHPvQX3iMo3gbFuASizhnUyGoiDddhueKU22HqpLUFS4alLB7Rn8PhMGWCfU9B++DxMksvv3YFiUWLhqUEKpBzfiuKi6JC7D+YlB9TBQuGhT7Cd4AClfJSsYkFC4alKD1BnlQzGhQgOQNtBKUMm42cCoaunuYlptLQAM+WwxnR2xwVUY2U1Z4F5EWB0JDTJ5hpac89gi9TWRkE6FaAA5l357RAVdepPuaFJaBAXoKHsHhsUcjhEZFdLEAQll0tJWZWtBlsYiShZ763eEtugmNkdWGw1XLCzhFtWCjxFnoKSLD3IlN27dpjGwqEQrBK2nygcb6vI7Tc7ACn/3OpKdQqUb0NxtFlMaOzdIYV3jwnjc0JugkoNsLh4NrFzTUmPxAxGeIH0vD6jwt8ViYeB1NiwNU1hE5hzV1ZoJrhs2M5EjtBpl1fVWml/+06aPkwjgAKd9miSpZy1MR8gQ+wXPnQZqOLb7H/+749PrVc11ucGTR4KggBT5mNjhCEm+AbfpGkzpPtQH3HQ1yNtg0umaJPDoNgn5btsEhjS9xSU3YpNqAMZ4XEokK3vVBaKtGf4OP1KLTIGRHS1sk1XiBe40GIbrH2L3+fgh8mDSxJGgORVzfxi8qaN3gvcHmDkGauK6QhBZ+1fWM5fFCnRCJ0HX1pKivSpxx8oxcEpA31yflDSW4sAPo2Ejr53Nytk2bWd1t37uogAg9Q8t2Pzz8tAhxXxlm8oyhbIDSRaoOLApgNejPA96y0bpJjfk78h6rHUoClC6yhoryFmWEJQ9I8clzToGJU1gHvNAcjDQxrAqoXKSbI8635QHjiRS4xfgBSQ8LdMALsXOu5y1DLYA2YernTKyWhOdCVhipnyc85pVuD1o3NSXyoRYgLWEa7mBDUweU0OkKahBGh6HO29/tByX51AMTQxnBcR+p5SQJWKFJl71f/qTZn7+lv+D7VwZKYAb4wATU5lgKphiFdIMRmBVKaoaq9HJ4/y7HQAlu03lCX9vu5ZIALaEZCThJMuhpeAHuvEFYAjvgWmB4GMOL7rEafvmXPtqGL7QEBLgR6K2lLMYLwTnIUCJOw+Ozy0lkKZXSjnu3NbQ6S5IkKx5FbVAqi2U4npOIR1EbNFlhluM5qWPTIwFXjvCxG8Hku6gtvnj4/9IzwQQTPH78B7gKG4oYvtjQAAAAAElFTkSuQmCC");
        append($$anchor2, button_1);
      }
    );
    append($$anchor, fragment);
    pop();
  }
  delegate(["click"]);
  var root_1 = /* @__PURE__ */ template(`<!> <!> <!>`, 1);
  function App($$anchor, $$props) {
    push($$props, true);
    const url = new URL(window.location.href);
    const platform = (() => {
      if (url.host.includes("honkoku.org")) return "honkoku";
      if (url.host.includes("wikisource.org")) return "wikisource";
      return void 0;
    })();
    console.info("[honkoku-toolbox] platform: ", platform);
    let editor = state(void 0);
    const MAX_RETRIES = 10;
    setTimeout(
      () => {
        if (!platform) {
          throw new Error("[honkoku-toolbox] Unsupported platform");
        }
        if (platform === "honkoku") {
          let kojiWrapper;
          const wrappers = document.getElementsByClassName("editor-wrapper");
          if (wrappers.length > 0) {
            kojiWrapper = wrappers[0];
          }
          if (!kojiWrapper) {
            let retries = 0;
            const interval = setInterval(
              () => {
                const wrappers2 = document.getElementsByClassName("editor-wrapper");
                if (wrappers2.length > 0) {
                  kojiWrapper = wrappers2[0];
                  set(editor, proxy(new KojiEditor(kojiWrapper)));
                  console.log("[honkoku-toolbox] KojiEditor initialized: ", get(editor));
                  clearInterval(interval);
                }
                if (retries > MAX_RETRIES) {
                  clearInterval(interval);
                }
                retries += 1;
              },
              500
            );
          } else {
            set(editor, proxy(new KojiEditor(kojiWrapper)));
            console.log("[honkoku-toolbox] KojiEditor initialized: ", get(editor));
          }
          return;
        }
        if (platform === "wikisource") {
          let cm;
          const codeMirrorDivs = document.getElementsByClassName("CodeMirror");
          if (codeMirrorDivs.length > 0) {
            const codeMirror = codeMirrorDivs[0];
            cm = codeMirror.CodeMirror;
            set(editor, proxy(new CodeMirrorEditor(cm)));
            console.info("[honkoku-toolbox] CodeMirrorEditor initialized: ", get(editor));
          } else {
            let retries = 0;
            const interval = setInterval(
              () => {
                const codeMirrorDivs2 = document.getElementsByClassName("CodeMirror");
                if (codeMirrorDivs2.length > 0) {
                  const codeMirror = codeMirrorDivs2[0];
                  cm = codeMirror.CodeMirror;
                  set(editor, proxy(new CodeMirrorEditor(cm)));
                  console.info("[honkoku-toolbox] CodeMirrorEditor initialized: ", get(editor));
                  clearInterval(interval);
                } else {
                  if (retries > MAX_RETRIES) {
                    clearInterval(interval);
                  }
                  retries += 1;
                }
              },
              500
            );
          }
        }
      },
      500
    );
    var fragment = comment();
    var node = first_child(fragment);
    if_block(node, () => get(editor) && platform, ($$anchor2) => {
      var fragment_1 = root_1();
      var node_1 = first_child(fragment_1);
      VariantKana(node_1, {
        get editor() {
          return get(editor);
        }
      });
      var node_2 = sibling(node_1, 2);
      MainMenu(node_2, {
        get editor() {
          return get(editor);
        },
        platform
      });
      var node_3 = sibling(node_2, 2);
      VariantKanji(node_3, {
        get editor() {
          return get(editor);
        }
      });
      append($$anchor2, fragment_1);
    });
    append($$anchor, fragment);
    pop();
  }
  mount(App, {
    target: (() => {
      const app2 = document.createElement("div");
      document.body.append(app2);
      return app2;
    })()
  });

})();