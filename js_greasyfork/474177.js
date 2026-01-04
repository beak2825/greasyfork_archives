// ==UserScript==
// @name         POE流放之路网页市集插件
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @author       rxdey
// @description  市集一些优化
// @license      MIT
// @icon         https://poe.game.qq.com/favicon.ico
// @match        https://poe.game.qq.com/trade/*
// @match        https://apps.game.qq.com/poe/a20160407LoginCheck/loginsuccess.html
// @require      https://unpkg.com/cn-poe-export-db@0.3.2/dist/db.global.js
// @require      data:application/javascript,window.CnPoeExportDb%3DCnPoeExportDb
// @require      https://unpkg.com/vue@3.4.14/dist/vue.global.prod.js
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/474177/POE%E6%B5%81%E6%94%BE%E4%B9%8B%E8%B7%AF%E7%BD%91%E9%A1%B5%E5%B8%82%E9%9B%86%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/474177/POE%E6%B5%81%E6%94%BE%E4%B9%8B%E8%B7%AF%E7%BD%91%E9%A1%B5%E5%B8%82%E9%9B%86%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(r=>{if(typeof GM_addStyle=="function"){GM_addStyle(r);return}const t=document.createElement("style");t.textContent=r,document.head.append(t)})(' .d-button[data-v-91a14c1a]{--b-color: rgba(var(--color-white));--b-size: 12px;border:1px solid var(--b-border);background-color:var(--b-type);color:var(--b-color);padding-bottom:var(--b-size);padding-top:var(--b-size)}.d-button[data-v-91a14c1a]:active,.d-button[data-v-91a14c1a]:hover{background-color:var(--b-active)}.d-button.disabled[data-v-91a14c1a]{opacity:.5;cursor:not-allowed}.d-button.disabled[data-v-91a14c1a]:active,.d-button.disabled[data-v-91a14c1a]:hover{background-color:var(--b-type)}*,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.uno-6a64nq{position:fixed;bottom:5px;left:5px;z-index:2000;display:flex;flex-direction:row;gap:4px}.uno-cwirjq{position:absolute;left:50%;bottom:100%;display:none;flex-direction:column;--un-translate-x:-50%;transform:translate(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotate(var(--un-rotate-z)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));align-items:center;justify-content:center;background-color:#000000e6}.uno-d54z7h{position:absolute;bottom:100%;left:0;z-index:1;margin-bottom:4px;width:100%;display:flex;flex-direction:column;gap:2px}.uno-hbwt5n{position:fixed;left:50%;top:30%;z-index:1000;z-index:2001;min-width:400px;transform-origin:left center;--un-translate-x:-50%;transform:translate(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotate(var(--un-rotate-z)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));--un-translate-y:0;border-radius:12px;--un-bg-opacity:1;background-color:rgb(var(--color-white) / var(--un-bg-opacity));--un-text-opacity:1;color:rgb(var(--color-dark) / var(--un-text-opacity))}.uno-j2fx0m{position:fixed;bottom:0;left:0;right:0;top:0;z-index:200;background-color:#0000004d}.uno-kdj5ae{position:relative;height:40px;display:flex;flex-direction:row;align-items:center;border-bottom-width:1px;border-left-width:0px;border-right-width:0px;border-top-width:0px;--un-border-opacity:1;border-color:rgb(229 229 229 / var(--un-border-opacity));border-style:solid;padding-left:8px;padding-right:0}.uno-l9jv7r{position:absolute;bottom:100%;left:0;z-index:1;margin-bottom:4px;max-height:600px;width:100%;display:flex;flex-direction:column;gap:4px;overflow-y:auto}.uno-n727xu{position:relative;display:flex;flex-direction:row;align-items:center;justify-content:center;border-style:none;padding-left:16px;padding-right:16px;font-size:14px;line-height:1;outline:2px solid transparent;outline-offset:2px;transition:all .3s linear}.uno-ni5pzh{position:fixed;left:50%;top:30%;z-index:101;z-index:3001;min-width:350px;transform-origin:left center;--un-translate-x:-50%;transform:translate(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotate(var(--un-rotate-z)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));--un-translate-y:0;border-radius:12px;--un-bg-opacity:1;background-color:rgb(var(--color-white) / var(--un-bg-opacity));--un-text-opacity:1;color:rgb(var(--color-dark) / var(--un-text-opacity))}.uno-pjhpbh{position:relative;margin-top:10px;display:inline-block;cursor:pointer;padding-top:10px;font-size:12px;line-height:1;--un-text-opacity:1;color:rgb(var(--foreground) / var(--un-text-opacity))}.uno-y292xp{position:relative}.uno-kdj5ae:after{position:absolute;bottom:-1px;left:0;height:2px;width:0;--un-bg-opacity:1;background-color:rgb(var(--color-primary) / var(--un-bg-opacity));content:"";transition:all .3s linear}.uno-8ut93f{z-index:2;width:120px}.uno-k9nrt0{z-index:2;width:150px}.uno-36f1r2{margin-bottom:20px;display:flex;flex-direction:row;gap:10px}.uno-5mgg2s{margin-left:10px;display:flex;flex-direction:row;align-items:center;justify-content:center;--un-text-opacity:1;color:rgb(var(--color-white) / var(--un-text-opacity))}.uno-kzvvcj{margin-bottom:20px}.uno-v15f5i{margin-right:12px;font-size:20px}.uno-xy2f5e{margin-bottom:20px;display:flex;flex-direction:row;justify-content:flex-end;gap:10px}.uno-0aac7g{width:100%;height:100%}.uno-4f0c85{width:100%;height:100%;border-style:none;background-color:transparent;color:inherit;outline:2px solid transparent;outline-offset:2px}.uno-bmns78{min-width:60px;--un-text-opacity:1;color:rgb(var(--color-primary) / var(--un-text-opacity))}.uno-je4uyi{min-width:0;flex:1 1 0%;padding-left:8px;padding-right:8px}.uno-lnbmsj{min-width:120px}.uno-suerow{width:100%;resize:none;border-style:none;background-color:transparent;--un-text-opacity:1;color:rgb(var(--foreground) / var(--un-text-opacity));outline:2px solid transparent;outline-offset:2px}.uno-9b57t1{display:flex;flex-direction:row;justify-content:space-between;padding:20px 20px 10px}.uno-weqgrm{display:flex;flex-direction:row;cursor:pointer;--un-bg-opacity:1;background-color:rgb(var(--background) / var(--un-bg-opacity));padding:6px 8px;--un-text-opacity:1;color:rgb(var(--foreground) / var(--un-text-opacity))}.uno-xzlctu{display:flex;flex-direction:row;justify-content:flex-end;gap:10px;padding:10px 20px 20px}.group:hover .uno-cwirjq{display:flex}.uno-2x98nu{flex:1 1 0%;word-break:break-all}.uno-yqud7r{flex:1 1 0%;--un-bg-opacity:1;background-color:rgb(var(--background) / var(--un-bg-opacity));padding:4px}.uno-5i3h1r{cursor:pointer}.uno-f70hor{cursor:pointer;--un-bg-opacity:1;background-color:rgb(var(--color-blue) / var(--un-bg-opacity));padding:4px 8px;--un-text-opacity:1;color:rgb(var(--foreground) / var(--un-text-opacity))}.uno-q3uz8k{padding:20px}.uno-j8124d{font-size:18px;line-height:1}.uno-m8p83r,.uno-m8p83r:visited{--un-text-opacity:1;color:rgb(56 189 248 / var(--un-text-opacity))}.uno-2x98nu:hover{--un-text-opacity:1;color:rgb(var(--color-white) / var(--un-text-opacity))}.uno-gd7xcy:hover{--un-text-opacity:1;color:rgb(var(--color-danger) / var(--un-text-opacity))}.uno-m8p83r:hover{--un-text-opacity:1;color:rgb(56 189 248 / var(--un-text-opacity))}.visible{visibility:visible}.block{display:block}.w-full{width:100%}.after\\:w-100\\%:after{width:100%}.border{border-width:1px}.rounded-full{border-radius:9999px}.ps{padding-inline-start:4px}.outline{outline-style:solid}:root{--color-primary: 155 86 252;--color-success: 48 150 48;--color-info: 28 177 249;--color-warning: 255 178 2;--color-danger: 217 83 79;--color-brown: 90 56 6;--color-blue: 15 48 77;--color-black: 0 0 0;--color-dark: 30 33 36;--color-white: 255 255 255;--color-gray: 153 153 153;--foreground: 226 226 226;--background: 30 33 36;--btn-blue-border: 76 76 125;--btn-brown-border: 138 86 9}.scale-up-enter-active,.scale-up-leave-active{transition:all .3s ease}.scale-up-enter-from,.scale-up-leave-to{scale:.5;opacity:0;transform:translateY(0) translate(-50%)}.slider-enter-active,.slider-leave-active{transition:all .3s linear}.slider-enter-from,.slider-leave-to{opacity:0;transform:translateY(100%)}.fade-enter-active,.fade-leave-active{transition:all .3s linear}.fade-enter-from,.fade-leave-to{opacity:0}.scroll-bar::-webkit-scrollbar{width:3px}.scroll-bar::-webkit-scrollbar-thumb{background:#555454;border-radius:3px} ');

(function (vue) {
  'use strict';

  var _monkeyWindow = /* @__PURE__ */ (() => window)();
  class AttributeProvider {
    constructor(attrList) {
      this.attrIndexedByZhName = /* @__PURE__ */ new Map();
      for (const p of attrList) {
        const zh = p.zh;
        this.attrIndexedByZhName.set(zh, p);
      }
    }
    provideAttribute(zhName) {
      return this.attrIndexedByZhName.get(zhName);
    }
  }
  class BaseTypeProvider {
    constructor(baseTypesList) {
      var _a, _b;
      this.baseTypesIndexedByZh = /* @__PURE__ */ new Map();
      this.baseTypesIndexedByUniqueZh = /* @__PURE__ */ new Map();
      for (const baseTypeList of baseTypesList) {
        for (const baseType of baseTypeList) {
          const zh = baseType.zh;
          if (this.baseTypesIndexedByZh.has(zh)) {
            (_a = this.baseTypesIndexedByZh.get(zh)) === null || _a === void 0 ? void 0 : _a.push(baseType);
          } else {
            this.baseTypesIndexedByZh.set(zh, [baseType]);
          }
          const uniques = baseType.uniques;
          if (uniques !== void 0) {
            for (const unique of uniques) {
              const zh2 = unique.zh;
              if (zh2 in this.baseTypesIndexedByUniqueZh) {
                (_b = this.baseTypesIndexedByUniqueZh.get(zh2)) === null || _b === void 0 ? void 0 : _b.push(baseType);
              } else {
                this.baseTypesIndexedByUniqueZh.set(zh2, [baseType]);
              }
            }
          }
        }
      }
    }
    provideBaseTypesByZh(zh) {
      const entries = this.baseTypesIndexedByZh.get(zh);
      return entries;
    }
  }
  class GemProvider {
    constructor(gems, hybridSkills) {
      this.skillsIndexedByZh = /* @__PURE__ */ new Map();
      for (const gem of gems) {
        this.skillsIndexedByZh.set(gem.zh, gem);
      }
      for (const skill of hybridSkills) {
        this.skillsIndexedByZh.set(skill.zh, skill);
      }
    }
    provideSkill(zh) {
      return this.skillsIndexedByZh.get(zh);
    }
  }
  class PassiveSkillProvider {
    constructor(notables, keystones, ascendants) {
      this.notablesIndexedByZh = /* @__PURE__ */ new Map();
      this.keystonesIndexedByZh = /* @__PURE__ */ new Map();
      this.ascendantIndexedByZh = /* @__PURE__ */ new Map();
      for (const node of notables) {
        this.notablesIndexedByZh.set(node.zh, node);
      }
      for (const node of keystones) {
        this.keystonesIndexedByZh.set(node.zh, node);
      }
      for (const node of ascendants) {
        this.ascendantIndexedByZh.set(node.zh, node);
      }
    }
    provideNotableByZh(zhName) {
      return this.notablesIndexedByZh.get(zhName);
    }
    provideKeystoneByZh(zhName) {
      return this.keystonesIndexedByZh.get(zhName);
    }
    provideAscendantByZh(zhName) {
      return this.ascendantIndexedByZh.get(zhName);
    }
  }
  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  class StatUtil {
    static getBodyOfZhTemplate(template) {
      return this.getNonAsciiOrPer(template);
    }
    static getBodyOfZhModifier(mod) {
      return this.getNonAsciiOrPer(mod);
    }
    static getNonAsciiOrPer(str) {
      return str.replace(/[\u{0000}-\u{0024}\u{0026}-\u{007F}]/gu, "");
    }
    static render(enTemplate, zhTemplate, zhMod) {
      if (zhMod === zhTemplate) {
        return enTemplate;
      }
      const enTmpl = new Template(enTemplate);
      const zhTmpl = new Template(zhTemplate);
      const params = zhTmpl.parseParams(zhMod);
      if (params === void 0) {
        return void 0;
      }
      return enTmpl.render(params);
    }
  }
  class Template {
    constructor(text) {
      this.text = text;
      this.segments = [];
      this.paramNumbers = [];
      let j = 0;
      let k = 0;
      let onParam = false;
      for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        if (code === 123) {
          k = i;
          onParam = true;
        } else if (code === 125) {
          if (onParam) {
            this.segments.push(text.slice(j, k));
            this.paramNumbers.push(Number.parseInt(text.slice(k + 1, i + 1)));
            j = i + 1;
            onParam = false;
          }
        } else {
          if (onParam) {
            if (code < 48 || code > 57) {
              onParam = false;
            }
          }
        }
      }
      this.segments.push(text.slice(j));
    }
    /**
     * parseParams parses the modifier and returns positional parameters.
     * @param modifier rendered template result with params
     * @returns map contains positions and parameters ; undefined if the modifier does not match the template.
     */
    parseParams(modifier) {
      const regStr = `^${this.segments.map((s) => escapeRegExp(s)).join("(\\S+)")}$`;
      const execResult = new RegExp(regStr).exec(modifier);
      if (!execResult) {
        return void 0;
      }
      const paramList = execResult.slice(1, this.paramNumbers.length + 1);
      const paramMap = /* @__PURE__ */ new Map();
      for (const [i, num] of this.paramNumbers.entries()) {
        paramMap.set(num, paramList[i]);
      }
      return paramMap;
    }
    /**
     * Render template by positional params.
     * @param params positional parameters
     */
    render(params) {
      const buf = new Array(this.segments.length + this.paramNumbers.length);
      let j = 0;
      for (let i = 0; i < this.paramNumbers.length; i++) {
        buf[j++] = this.segments[i];
        const paramValue = params.get(this.paramNumbers[i]);
        buf[j++] = paramValue ? paramValue : `{${i}}`;
      }
      buf[j] = this.segments[this.segments.length - 1];
      return buf.join("");
    }
  }
  const VARIABLE_MARK = "{0}";
  class PropertyProvider {
    constructor(propertyList) {
      this.propertyIndexedByZhName = /* @__PURE__ */ new Map();
      this.variablePropertyIndexedByZhBody = /* @__PURE__ */ new Map();
      for (const p of propertyList) {
        const zh = p.zh;
        this.propertyIndexedByZhName.set(zh, p);
        if (zh.includes(VARIABLE_MARK)) {
          this.variablePropertyIndexedByZhBody.set(StatUtil.getBodyOfZhTemplate(zh), p);
        }
      }
    }
    provideProperty(zhName) {
      return this.propertyIndexedByZhName.get(zhName);
    }
    provideVariablePropertyByZhBody(zhBody) {
      return this.variablePropertyIndexedByZhBody.get(zhBody);
    }
  }
  class RequirementProvider {
    constructor(requirementList, suffixList) {
      this.requirementsIndexedByZh = /* @__PURE__ */ new Map();
      this.suffixesIndexedByZh = /* @__PURE__ */ new Map();
      for (const r of requirementList) {
        const zh = r.zh;
        this.requirementsIndexedByZh.set(zh, r);
      }
      for (const s of suffixList) {
        const zh = s.zh;
        this.suffixesIndexedByZh.set(zh, s);
      }
    }
    provideRequirement(zh) {
      return this.requirementsIndexedByZh.get(zh);
    }
    provideSuffix(zh) {
      return this.suffixesIndexedByZh.get(zh);
    }
  }
  const COMPOUNDED_STAT_LINE_SEPARATOR = "\n";
  class StatProvider {
    constructor(statList) {
      this.statsIndexedByZhBody = /* @__PURE__ */ new Map();
      this.compoundedStatsIndexedByFirstLinesZhBody = /* @__PURE__ */ new Map();
      for (const stat of statList) {
        const zh = stat.zh;
        const body = StatUtil.getBodyOfZhTemplate(zh);
        if (this.statsIndexedByZhBody.has(body)) {
          const array = this.statsIndexedByZhBody.get(body);
          array.push(stat);
        } else {
          this.statsIndexedByZhBody.set(body, [stat]);
        }
        if (zh.includes(COMPOUNDED_STAT_LINE_SEPARATOR)) {
          const lines = zh.split(COMPOUNDED_STAT_LINE_SEPARATOR);
          const firstLine = lines[0];
          const firstLineBody = StatUtil.getBodyOfZhTemplate(firstLine);
          const value = this.compoundedStatsIndexedByFirstLinesZhBody.get(firstLineBody);
          const compoundedStat = { lineSize: lines.length, stat };
          if (value === void 0) {
            this.compoundedStatsIndexedByFirstLinesZhBody.set(firstLineBody, {
              maxLineSize: lines.length,
              stats: [compoundedStat]
            });
          } else {
            if (value.maxLineSize < lines.length) {
              value.maxLineSize = lines.length;
            }
            value.stats.push(compoundedStat);
          }
        }
      }
      for (const value of this.compoundedStatsIndexedByFirstLinesZhBody.values()) {
        if (value.stats.length > 1) {
          value.stats.sort((a, b) => b.lineSize - a.lineSize);
        }
      }
    }
    provideStatsByZhBody(zhBody) {
      return this.statsIndexedByZhBody.get(zhBody);
    }
    provideCompoundedStatsByFirstLinesZhBody(body) {
      return this.compoundedStatsIndexedByFirstLinesZhBody.get(body);
    }
  }
  class AttributeService {
    constructor(attrProvider) {
      this.attrProvider = attrProvider;
    }
    translatePair(zhName, zhValue) {
      return this.doTranslate(zhName, zhValue);
    }
    translateName(zhName) {
      const result = this.doTranslate(zhName, void 0);
      if (result !== void 0) {
        return result.name;
      }
    }
    doTranslate(zhName, zhValue) {
      const attr = this.attrProvider.provideAttribute(zhName);
      if (attr !== void 0) {
        const enName = attr.en;
        if (zhValue !== void 0 && attr.values !== void 0) {
          for (const v of attr.values) {
            if (zhValue === v.zh) {
              return {
                name: enName,
                value: v.en
              };
            }
          }
        }
        return {
          name: enName,
          value: void 0
        };
      }
    }
  }
  const ZH_SUPERIOR_PREFIX = "精良的 ";
  const SUPERIOR_PREFIX = "Superior ";
  const ZH_SYNTHESISED_PREFIX = "忆境 ";
  const SYNTHESISED_PREFIX = "Synthesised ";
  class BaseTypeService {
    constructor(baseTypeProvider) {
      this.baseTypeProvider = baseTypeProvider;
    }
    /**
     *
     * @param zhName item's zh name.
     * There may be duplicate zh baseTypes, uniques's zh name can help translating.
     */
    getBaseTypeByZh(zh, zhName) {
      const list = this.baseTypeProvider.provideBaseTypesByZh(zh);
      if (list === void 0) {
        return void 0;
      }
      if (list.length === 1 || zhName === void 0) {
        return list[0];
      }
      for (const b of list) {
        if (b.uniques !== void 0) {
          for (const unique of b.uniques) {
            if (unique.zh === zhName) {
              return b;
            }
          }
        }
      }
      return list[0];
    }
    /**
     * Infer the zh base type by zh base type line, and returns the matched BaseType.
     *
     * @param zhName item's zh name. There may be duplicate zh baseTypes, uniques's zh name can help translating.
     */
    getBaseTypeByZhTypeLine(zhTypeLine, zhName) {
      if (zhTypeLine.startsWith(ZH_SUPERIOR_PREFIX)) {
        zhTypeLine = zhTypeLine.substring(ZH_SUPERIOR_PREFIX.length);
      }
      if (zhTypeLine.startsWith(ZH_SYNTHESISED_PREFIX)) {
        zhTypeLine = zhTypeLine.substring(ZH_SYNTHESISED_PREFIX.length);
      }
      const b = this.getBaseTypeByZh(zhTypeLine, zhName);
      if (b !== void 0) {
        return { baseType: b, zhBaseType: zhTypeLine };
      }
      const pattern = /.+?[之的]/gu;
      if (pattern.test(zhTypeLine)) {
        pattern.lastIndex = 0;
        const len = zhTypeLine.length;
        let slices = [];
        let lastIndex = 0;
        while (lastIndex < len) {
          const matches = pattern.exec(zhTypeLine);
          if (matches) {
            const result = matches[0];
            slices.push(result);
            lastIndex = pattern.lastIndex;
          } else {
            if (lastIndex < len) {
              slices.push(zhTypeLine.substring(lastIndex));
            }
            break;
          }
        }
        for (let i = slices.length; i > 0; i--) {
          const possible = slices.join();
          const b2 = this.getBaseTypeByZh(possible, zhName);
          if (b2 !== void 0) {
            return { baseType: b2, zhBaseType: possible };
          }
          slices = slices.slice(1);
        }
      }
      return void 0;
    }
    translateBaseType(zhBaseType, zhName) {
      const b = this.getBaseTypeByZh(zhBaseType, zhName);
      if (b !== void 0) {
        return b.en;
      }
      return void 0;
    }
    /**
     * 一般情况下，物品的typeLine等价于baseType。魔法物品有所不同，其在baseType的基础上多了一堆修饰词前缀。
     *
     * 修饰词的翻译很麻烦，且用处不大，这里选择去掉修饰词，仅保留baseType。
     *
     * 推荐使用baseType替换typeLine，只有在翻译文本格式的物品时，因为缺乏baseType，需要调用该方法。
     * @param zhTypeLine
     * @param zhName
     */
    translateTypeLine(zhTypeLine, zhName) {
      if (zhTypeLine.startsWith(ZH_SUPERIOR_PREFIX)) {
        const t = this.translateTypeLine(zhTypeLine.substring(ZH_SUPERIOR_PREFIX.length), zhName);
        if (t !== void 0) {
          return SUPERIOR_PREFIX + t;
        }
        return void 0;
      }
      if (zhTypeLine.startsWith(ZH_SYNTHESISED_PREFIX)) {
        const t = this.translateTypeLine(zhTypeLine.substring(ZH_SYNTHESISED_PREFIX.length), zhName);
        if (t !== void 0) {
          return SYNTHESISED_PREFIX + t;
        }
        return void 0;
      }
      const b = this.getBaseTypeByZhTypeLine(zhTypeLine, zhName);
      if (b !== void 0) {
        return b.baseType.en;
      }
      return void 0;
    }
  }
  const PROPERTY_NAMES = /* @__PURE__ */ new Map([
    ["等级", "Level"],
    ["品质", "Quality"]
  ]);
  class GemService {
    constructor(gemProvider) {
      this.gemProvider = gemProvider;
    }
    formatGemZh(zh) {
      return zh.replace("(", "（").replace(")", "）");
    }
    translateBaseType(zhBaseType) {
      var _a;
      return (_a = this.gemProvider.provideSkill(this.formatGemZh(zhBaseType))) === null || _a === void 0 ? void 0 : _a.en;
    }
    translateTypeLine(zhTypeLine) {
      let zhSkill = zhTypeLine;
      const skill = this.translateBaseType(zhSkill);
      return skill !== void 0 ? `${skill}` : void 0;
    }
    translatePropertyName(zhName) {
      if (PROPERTY_NAMES.has(zhName)) {
        return PROPERTY_NAMES.get(zhName);
      }
      return void 0;
    }
  }
  const DEFAULT_NAME = "Item";
  class ItemService {
    constructor(baseTypeProvider) {
      this.baseTypeProvider = baseTypeProvider;
    }
    /**
     * Translate item name, but only unique name is supported.
     *
     * @returns DEFAULT_NAME if no unique with the zhName.
     */
    translateName(zhName, zhBaseType) {
      const baseTypes = this.baseTypeProvider.provideBaseTypesByZh(zhBaseType);
      if (baseTypes !== void 0) {
        for (const baseType of baseTypes) {
          const uniques = baseType.uniques;
          if (uniques !== void 0) {
            for (const unique of uniques) {
              if (unique.zh === zhName) {
                return unique.en;
              }
            }
          }
        }
      }
      return DEFAULT_NAME;
    }
  }
  class PassiveSkillService {
    constructor(passiveSkillProvider) {
      this.passiveSkillProvider = passiveSkillProvider;
    }
    translateNotable(zh) {
      const node = this.passiveSkillProvider.provideNotableByZh(zh);
      if (node !== void 0) {
        return node.en;
      }
      return void 0;
    }
    translateKeystone(zh) {
      const node = this.passiveSkillProvider.provideKeystoneByZh(zh);
      if (node !== void 0) {
        return node.en;
      }
      return void 0;
    }
    translateAscendant(zh) {
      const node = this.passiveSkillProvider.provideAscendantByZh(zh);
      if (node !== void 0) {
        return node.en;
      }
      return void 0;
    }
  }
  class PropertyService {
    constructor(propProvider) {
      this.propProvider = propProvider;
    }
    translate(zhName, zhValue) {
      const prop = this.propProvider.provideProperty(zhName);
      if (prop !== void 0) {
        if (prop.values !== void 0) {
          for (const v of prop.values) {
            if (zhValue === v.zh) {
              return {
                name: prop.en,
                value: v.en
              };
            }
          }
        }
        return {
          name: prop.en
        };
      }
      return void 0;
    }
    translateName(zhName) {
      let prop = this.propProvider.provideProperty(zhName);
      if (prop !== void 0) {
        return prop.en;
      }
      prop = this.propProvider.provideVariablePropertyByZhBody(StatUtil.getBodyOfZhModifier(zhName));
      if (prop !== void 0) {
        const zhTmpl = new Template(prop.zh);
        const posParams = zhTmpl.parseParams(zhName);
        if (posParams === void 0) {
          return void 0;
        }
        const enTmpl = new Template(prop.en);
        return enTmpl.render(posParams);
      }
      return void 0;
    }
  }
  class RequirementService {
    constructor(requirementProvider) {
      this.requirementProvider = requirementProvider;
    }
    translate(zhName, zhValue) {
      const r = this.requirementProvider.provideRequirement(zhName);
      if (r) {
        if (r.values) {
          for (const v of r.values) {
            if (v.zh === zhValue) {
              return { name: r.en, value: v.en };
            }
          }
        }
        return {
          name: r.en
        };
      }
    }
    translateName(zhName) {
      const r = this.requirementProvider.provideRequirement(zhName);
      if (r) {
        return r.en;
      }
    }
    translateSuffix(zhSuffix) {
      const suffix = this.requirementProvider.provideSuffix(zhSuffix);
      if (suffix) {
        return suffix.en;
      }
    }
  }
  const ZH_ANOINTED_MOD_REGEXP = /^配置 (.+)$/;
  const ZH_FORBIDDEN_FLESH_MOD_REGEXP = /^禁断之火上有匹配的词缀则配置 (.+)$/;
  const ZH_FORBIDDEN_FLAME_MOD_REGEXP = /^禁断之肉上有匹配的词缀则配置 (.+)$/;
  const ZH_UNIQUE_ENEMY_IN_YOUR_PRESENCE = "有一个传奇怪物出现在你面前：";
  const EN_UNIQUE_ENEMY_IN_YOUR_PRESENCE = "While a Unique Enemy is in your Presence, ";
  const ZH_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENCE = "有一个异界图鉴最终首领出现在你面前：";
  const EN_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENCE = "While a Pinnacle Atlas Boss is in your Presence, ";
  class StatService {
    constructor(passiveSkillService, statProvider) {
      this.passiveSkillService = passiveSkillService;
      this.statProvider = statProvider;
    }
    translateMod(zhMod) {
      if (this.isAnointedMod(zhMod)) {
        return this.translateAnointedMod(zhMod);
      }
      if (this.isForbiddenFlameMod(zhMod)) {
        return this.translateForbiddenFlameMod(zhMod);
      }
      if (this.isForbiddenFleshMod(zhMod)) {
        return this.translateForbiddenFleshMod(zhMod);
      }
      if (this.isEldritchImplicitMod(zhMod)) {
        return this.translateEldritchImplicitMod(zhMod);
      }
      return this.translateModInner(zhMod);
    }
    translateModInner(zhMod) {
      const body = StatUtil.getBodyOfZhModifier(zhMod);
      const stats = this.statProvider.provideStatsByZhBody(body);
      if (stats !== void 0) {
        for (const stat of stats) {
          const result = this.doTranslateMod(stat, zhMod);
          if (result !== void 0) {
            return result;
          }
        }
      }
      return void 0;
    }
    isAnointedMod(zhMod) {
      return ZH_ANOINTED_MOD_REGEXP.test(zhMod);
    }
    translateAnointedMod(zhMod) {
      const matches = ZH_ANOINTED_MOD_REGEXP.exec(zhMod);
      if (matches !== null) {
        const zhNotable = matches[1];
        const notable = this.passiveSkillService.translateNotable(zhNotable);
        if (notable !== void 0) {
          return `Allocates ${notable}`;
        }
      }
      return void 0;
    }
    isForbiddenFlameMod(zhMod) {
      return ZH_FORBIDDEN_FLAME_MOD_REGEXP.test(zhMod);
    }
    translateForbiddenFlameMod(zhMod) {
      const matches = ZH_FORBIDDEN_FLAME_MOD_REGEXP.exec(zhMod);
      if (matches !== null) {
        const zhAscendant = matches[1];
        const ascendant = this.passiveSkillService.translateAscendant(zhAscendant);
        if (ascendant !== void 0) {
          return `Allocates ${ascendant} if you have the matching modifier on Forbidden Flesh`;
        }
      }
      return void 0;
    }
    isForbiddenFleshMod(zhMod) {
      return ZH_FORBIDDEN_FLESH_MOD_REGEXP.test(zhMod);
    }
    translateForbiddenFleshMod(zhMod) {
      const matches = ZH_FORBIDDEN_FLESH_MOD_REGEXP.exec(zhMod);
      if (matches !== null) {
        const zhAscendant = matches[1];
        const ascendant = this.passiveSkillService.translateAscendant(zhAscendant);
        if (ascendant !== void 0) {
          return `Allocates ${ascendant} if you have the matching modifier on Forbidden Flame`;
        }
      }
      return void 0;
    }
    isEldritchImplicitMod(zhMod) {
      return zhMod.startsWith(ZH_UNIQUE_ENEMY_IN_YOUR_PRESENCE) || zhMod.startsWith(ZH_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENCE);
    }
    translateEldritchImplicitMod(zhMod) {
      if (zhMod.startsWith(ZH_UNIQUE_ENEMY_IN_YOUR_PRESENCE)) {
        const subMod = this.translateMod(zhMod.substring(ZH_UNIQUE_ENEMY_IN_YOUR_PRESENCE.length));
        if (subMod !== void 0) {
          return EN_UNIQUE_ENEMY_IN_YOUR_PRESENCE + subMod;
        }
      } else if (zhMod.startsWith(ZH_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENCE)) {
        const subMod = this.translateMod(zhMod.substring(ZH_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENCE.length));
        if (subMod !== void 0) {
          return EN_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENCE + subMod;
        }
      }
      return void 0;
    }
    doTranslateMod(stat, zhMod) {
      if (zhMod === stat.zh) {
        return stat.en;
      }
      const zhTmpl = new Template(stat.zh);
      const posParams = zhTmpl.parseParams(zhMod);
      if (posParams === void 0) {
        return void 0;
      }
      const enTmpl = new Template(stat.en);
      return enTmpl.render(posParams);
    }
    getMaxLineSizeOfCompoundedMod(firstLine) {
      const body = StatUtil.getBodyOfZhModifier(firstLine);
      const entry = this.statProvider.provideCompoundedStatsByFirstLinesZhBody(body);
      if (entry !== void 0) {
        return entry.maxLineSize;
      }
      return 0;
    }
    /**
     * Translate compounded mod for text item.
     *
     * Caller should use `getMaxLineSizeOfCompoundedMod` before to get the max lines of candidates which has the first line.
     *
     * The method uses the `lines` to infer a compounded mod, returns the translation.
     */
    translateCompoundedMod(lines) {
      const body = StatUtil.getBodyOfZhModifier(lines[0]);
      const entry = this.statProvider.provideCompoundedStatsByFirstLinesZhBody(body);
      if (entry === void 0) {
        return;
      }
      for (const compoundedStat of entry.stats) {
        const lineSize = compoundedStat.lineSize;
        if (compoundedStat.lineSize > lines.length) {
          continue;
        }
        const stat = compoundedStat.stat;
        const mod = lines.slice(0, lineSize).join(COMPOUNDED_STAT_LINE_SEPARATOR);
        if (StatUtil.getBodyOfZhTemplate(stat.zh) === StatUtil.getBodyOfZhModifier(mod)) {
          const result = this.doTranslateMod(stat, mod);
          if (result !== void 0) {
            return {
              result,
              lineSize
            };
          }
        }
      }
      return void 0;
    }
  }
  const ZH_PROPERTY_NAME_LIMITED_TO = "仅限";
  const ZH_PROPERTY_NAME_RADIUS = "范围";
  const ZH_REQUIREMENT_NAME_CLASS = "职业：";
  const ZH_THIEF_TRINKET = "赏金猎人饰品";
  const ZH_FORBIDDEN_FLESH = "禁断之肉";
  const ZH_FORBIDDEN_FLAME = "禁断之火";
  const ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN = "暗影";
  const ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN_FIXED = "暗影（贵族）";
  const ZH_CLASS_SCION = "贵族";
  class JsonTranslator {
    constructor(baseTypeService, itemService, requirementService, propertyService, gemService, statService, passiveSkillService) {
      this.baseTypeService = baseTypeService;
      this.itemService = itemService;
      this.requirementService = requirementService;
      this.propertyService = propertyService;
      this.gemService = gemService;
      this.statService = statService;
      this.passiveSkillService = passiveSkillService;
    }
    preHandleItem(item) {
      if (item.name && (item.name === ZH_FORBIDDEN_FLAME || item.name === ZH_FORBIDDEN_FLESH)) {
        if (item.requirements) {
          for (const requirement of item.requirements) {
            const name = requirement.name;
            if (name !== ZH_REQUIREMENT_NAME_CLASS) {
              continue;
            }
            const value = requirement.values[0][0];
            if (value === ZH_CLASS_SCION) {
              if (item.explicitMods) {
                for (let i = 0; i < item.explicitMods.length; i++) {
                  const zhStat = item.explicitMods[i];
                  if (zhStat.endsWith(ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN)) {
                    item.explicitMods[i] = zhStat.replace(ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN, ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN_FIXED);
                  }
                }
              }
            }
            break;
          }
        }
      }
    }
    translateItems(data) {
      const items = data.items;
      const translatedItems = [];
      for (const item of items) {
        if (this.isPobItem(item)) {
          this.translateItem(item);
          translatedItems.push(item);
        }
      }
      data.items = translatedItems;
      return data;
    }
    isPobItem(item) {
      if (item.inventoryId === "MainInventory" || item.inventoryId === "ExpandedMainInventory" || item.baseType === ZH_THIEF_TRINKET) {
        return false;
      }
      return true;
    }
    translateItem(item) {
      this.preHandleItem(item);
      const zhBaseType = item.baseType;
      const zhName = item.name;
      const zhTypeLine = item.typeLine;
      if (zhName) {
        const res = this.itemService.translateName(zhName, zhBaseType);
        if (res) {
          item.name = res;
        } else {
          console.log(`warning: should be translated: item name, ${zhName}`);
        }
      }
      if (zhBaseType) {
        const res = this.baseTypeService.translateBaseType(zhBaseType, zhName);
        if (res) {
          item.baseType = res;
        } else {
          console.log(`warning: should be translated: base type, ${zhBaseType}`);
        }
      }
      if (zhTypeLine) {
        item.typeLine = item.baseType;
      }
      if (item.requirements) {
        for (const r of item.requirements) {
          const zhName2 = r.name;
          const res = this.requirementService.translateName(zhName2);
          if (res) {
            r.name = res;
          } else {
            console.log(`warning: should be translated: requirement name, ${zhName2}`);
          }
          if (zhName2 === ZH_REQUIREMENT_NAME_CLASS) {
            if (r.values) {
              for (const v of r.values) {
                const zhValue = v[0];
                const result = this.requirementService.translate(zhName2, zhValue);
                if (result && result.value) {
                  v[0] = result.value;
                } else {
                  console.log(`warning: should be translated: requirement value, ${zhValue}`);
                }
              }
            }
          }
          if (r.suffix) {
            const zhSuffix = r.suffix;
            const res2 = this.requirementService.translateSuffix(zhSuffix);
            if (res2) {
              r.suffix = res2;
            } else {
              console.log(`warning: should be translated: requirement suffix, ${zhSuffix}`);
            }
          }
        }
      }
      if (item.properties) {
        for (const p of item.properties) {
          const zhName2 = p.name;
          const enName = this.propertyService.translateName(zhName2);
          if (enName) {
            p.name = enName;
          } else {
            console.log(`warning: should be translated: property name, ${zhName2}`);
          }
          if (zhName2 === ZH_PROPERTY_NAME_LIMITED_TO || zhName2 === ZH_PROPERTY_NAME_RADIUS) {
            if (p.values) {
              for (const v of p.values) {
                const zhValue = v[0];
                const res = this.propertyService.translate(zhName2, zhValue);
                if (res) {
                  v[0] = res.value;
                } else {
                  console.log(`warning: should be translated: property value, ${zhValue}`);
                }
              }
            }
          }
        }
      }
      if (item.socketedItems) {
        for (const si of item.socketedItems) {
          if (si.abyssJewel) {
            this.translateItem(si);
          } else {
            this.translateGem(si);
          }
        }
      }
      if (item.enchantMods) {
        for (let i = 0; i < item.enchantMods.length; i++) {
          const zhStat = item.enchantMods[i];
          const res = this.statService.translateMod(zhStat);
          if (res) {
            item.enchantMods[i] = res;
          } else {
            console.log(`warning: should be translated: stat: ${zhStat}`);
          }
        }
      }
      if (item.explicitMods) {
        for (let i = 0; i < item.explicitMods.length; i++) {
          const zhStat = item.explicitMods[i];
          const res = this.statService.translateMod(zhStat);
          if (res) {
            item.explicitMods[i] = res;
          } else {
            console.log(`warning: should be translated: stat: ${zhStat}`);
          }
        }
      }
      if (item.implicitMods) {
        for (let i = 0; i < item.implicitMods.length; i++) {
          const zhStat = item.implicitMods[i];
          const res = this.statService.translateMod(zhStat);
          if (res) {
            item.implicitMods[i] = res;
          } else {
            console.log(`warning: should be translated: stat: ${zhStat}`);
          }
        }
      }
      if (item.craftedMods) {
        for (let i = 0; i < item.craftedMods.length; i++) {
          const zhStat = item.craftedMods[i];
          const res = this.statService.translateMod(zhStat);
          if (res) {
            item.craftedMods[i] = res;
          } else {
            console.log(`warning: should be translated: stat: ${zhStat}`);
          }
        }
      }
      if (item.utilityMods) {
        for (let i = 0; i < item.utilityMods.length; i++) {
          const zhStat = item.utilityMods[i];
          const res = this.statService.translateMod(zhStat);
          if (res) {
            item.utilityMods[i] = res;
          } else {
            console.log(`warning: should be translated: stat: ${zhStat}`);
          }
        }
      }
      if (item.fracturedMods) {
        for (let i = 0; i < item.fracturedMods.length; i++) {
          const zhStat = item.fracturedMods[i];
          const res = this.statService.translateMod(zhStat);
          if (res) {
            item.fracturedMods[i] = res;
          } else {
            console.log(`warning: should be translated: stat: ${zhStat}`);
          }
        }
      }
      if (item.scourgeMods) {
        for (let i = 0; i < item.scourgeMods.length; i++) {
          const zhStat = item.scourgeMods[i];
          const res = this.statService.translateMod(zhStat);
          if (res) {
            item.scourgeMods[i] = res;
          } else {
            console.log(`warning: should be translated: stat: ${zhStat}`);
          }
        }
      }
      if (item.crucibleMods) {
        for (let i = 0; i < item.crucibleMods.length; i++) {
          const zhStat = item.crucibleMods[i];
          const res = this.statService.translateMod(zhStat);
          if (res) {
            item.crucibleMods[i] = res;
          } else {
            console.log(`warning: should be translated: stat: ${zhStat}`);
          }
        }
      }
    }
    translateGem(item) {
      const zhBaseType = item.baseType;
      const zhTypeLine = item.typeLine;
      if (zhBaseType) {
        const res = this.gemService.translateBaseType(zhBaseType);
        if (res) {
          item.baseType = res;
        } else {
          console.log(`warning: should be translated: gem base type: ${zhBaseType}`);
        }
      }
      if (zhTypeLine) {
        const res = this.gemService.translateTypeLine(zhTypeLine);
        if (res) {
          item.typeLine = res;
        } else {
          console.log(`warning: should be translated: gem type line: ${zhTypeLine}`);
        }
      }
      if (item.hybrid) {
        item.hybrid.baseTypeName = this.gemService.translateTypeLine(item.hybrid.baseTypeName);
      }
      if (item.properties) {
        for (const p of item.properties) {
          const res = this.gemService.translatePropertyName(p.name);
          if (res) {
            p.name = res;
          }
        }
      }
    }
    translatePassiveSkills(data) {
      if (data.items) {
        for (const item of data.items) {
          this.translateItem(item);
        }
      }
      if (data.skill_overrides) {
        for (const [key, value] of Object.entries(data.skill_overrides)) {
          if (value.name) {
            const name = value.name;
            if (value.isKeystone) {
              const result = this.passiveSkillService.translateKeystone(name);
              if (result !== void 0) {
                value.name = result;
              } else {
                console.log(`warning: should be translated: keystone, ${name}`);
              }
            } else {
              const result = this.baseTypeService.translateBaseType(name, void 0);
              if (result !== void 0) {
                value.name = result;
              } else {
                console.log(`warning: should be translated: base type, ${name}`);
              }
            }
          }
          if (value.stats) {
            const stats = value.stats;
            for (let i = 0; i < stats.length; i++) {
              const stat = stats[i];
              const result = this.statService.translateMod(stat);
              if (result !== void 0) {
                stats[i] = result;
              } else {
                console.log(`warning: should be translated: stat: ${stat}`);
              }
            }
          }
        }
      }
    }
  }
  class TextTranslator {
    constructor(baseTypeService, itemService, requirementService, propertyService, gemService, statService, attributeService) {
      this.baseTypeService = baseTypeService;
      this.itemService = itemService;
      this.requirementService = requirementService;
      this.propertyService = propertyService;
      this.gemService = gemService;
      this.statService = statService;
      this.attributeService = attributeService;
    }
    translate(content) {
      const item = new TextItem(this.fixChineseTextError(content));
      const ctx = new Context();
      ctx.translator = this;
      return item.getTranslation(ctx);
    }
    // Fix Chinese translation error
    fixChineseTextError(content) {
      if (content.includes(ZH_FORBIDDEN_FLESH) || content.includes(ZH_FORBIDDEN_FLAME)) {
        if (content.includes(ZH_CLASS_SCION)) {
          content = content.replace(ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN, ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN_FIXED);
        }
      }
      return content;
    }
  }
  class Context {
  }
  const PART_SEPARATOR = "\n--------\n";
  const LINE_SEPARATOR = "\n";
  const KEY_VALUE_SEPARATOR = ": ";
  const ZH_ITEM_CLASS = "物品类别";
  class TextItem {
    constructor(content) {
      const partsContents = content.split(PART_SEPARATOR);
      this.parts = partsContents.map((partContent) => {
        if (partContent.startsWith(ZH_ITEM_CLASS)) {
          return new MetaPart(partContent);
        }
        return new Part(partContent);
      });
    }
    getTranslation(ctx) {
      ctx.item = this;
      return this.parts.map((part) => part.getTranslation(ctx)).join(PART_SEPARATOR);
    }
  }
  class Part {
    constructor(content) {
      const linesContents = content.split(LINE_SEPARATOR);
      this.lines = linesContents.map((lineContent) => Line.NewLine(lineContent));
    }
    getTranslation(ctx) {
      ctx.part = this;
      const translator = ctx.translator;
      const buf = [];
      for (let i = 0; i < this.lines.length; ) {
        const line = this.lines[i];
        const maxSize = translator.statService.getMaxLineSizeOfCompoundedMod(line.content);
        if (maxSize > 0) {
          const mod = this.lines.slice(i, Math.min(i + maxSize, this.lines.length));
          const translation = translator.statService.translateCompoundedMod(mod.map((line2) => line2 instanceof ModifierLine ? line2.modifier : line2.content));
          if (translation !== void 0) {
            buf.push(this.fillSuffixesOfCompoundedModTranslation(mod, translation.result));
            i += translation.lineSize;
            continue;
          }
        }
        buf.push(line.getTranslation(ctx));
        i++;
      }
      return buf.join(LINE_SEPARATOR);
    }
    fillSuffixesOfCompoundedModTranslation(mod, translation) {
      const slices = translation.split(COMPOUNDED_STAT_LINE_SEPARATOR);
      const buf = [];
      for (const [i, slice] of slices.entries()) {
        const sub = mod[i];
        if (sub instanceof ModifierLine && sub.suffix) {
          buf.push(`${slice} ${sub.suffix}`);
        } else {
          buf.push(slice);
        }
      }
      return buf.join(COMPOUNDED_STAT_LINE_SEPARATOR);
    }
  }
  class MetaPart extends Part {
    getTranslation(ctx) {
      ctx.part = this;
      const translator = ctx.translator;
      const buf = [];
      for (let i = 0; i < this.lines.length; i++) {
        const line = this.lines[i];
        if (this.isNameLine(i)) {
          const zhName = line.content;
          const zhTypeLine = this.lines[this.lines.length - 1].content;
          const result = translator.baseTypeService.getBaseTypeByZhTypeLine(zhTypeLine, zhName);
          buf.push(translator.itemService.translateName(zhName, result !== void 0 ? result.zhBaseType : zhTypeLine));
        } else if (this.isTypeLine(i)) {
          const t = translator.baseTypeService.translateTypeLine(line.content);
          buf.push(t !== void 0 ? t : line.content);
        } else {
          buf.push(line.getTranslation(ctx));
        }
      }
      return buf.join(LINE_SEPARATOR);
    }
    isNameLine(lineNum) {
      return lineNum === this.lines.length - 2 && this.lines[lineNum] instanceof ModifierLine;
    }
    isTypeLine(lineNum) {
      return lineNum === this.lines.length - 1 && this.lines[lineNum] instanceof ModifierLine;
    }
  }
  class Line {
    constructor(content) {
      this.content = content;
    }
    static NewLine(content) {
      if (content.includes(KEY_VALUE_SEPARATOR)) {
        const pair = content.split(KEY_VALUE_SEPARATOR);
        if (pair.length !== 2) {
          return new ModifierLine(content);
        } else {
          return new KeyValueLine(content, pair[0], pair[1]);
        }
      } else if (content.endsWith(":")) {
        return new OnlyKeyLine(content);
      } else {
        return new ModifierLine(content);
      }
    }
    getTranslation(ctx) {
      return this.content;
    }
  }
  class KeyValueLine extends Line {
    constructor(content, key, value) {
      super(content);
      this.key = key;
      this.value = value;
    }
    getTranslation(ctx) {
      const translator = ctx.translator;
      let translation = translator.propertyService.translate(this.key, this.value);
      if (translation !== void 0) {
        let key = this.key;
        if (translation.name) {
          key = translation.name;
        }
        let value = this.value;
        if (translation.value) {
          value = translation.value;
        }
        return `${key}${KEY_VALUE_SEPARATOR}${value}`;
      }
      translation = translator.requirementService.translate(this.key, this.value);
      if (translation !== void 0) {
        const key = translation.name;
        const value = translation.value;
        return `${key ? key : this.key}${KEY_VALUE_SEPARATOR}${value ? value : this.value}`;
      }
      translation = translator.attributeService.translatePair(this.key, this.value);
      if (translation !== void 0) {
        if (translation.name) {
          this.key = translation.name;
        }
        if (translation.value) {
          this.value = translation.value;
        }
      }
      return `${this.key}${KEY_VALUE_SEPARATOR}${this.value}`;
    }
  }
  class OnlyKeyLine extends Line {
    constructor(content) {
      super(content);
      this.key = content.substring(0, content.length - 1);
    }
    getTranslation(ctx) {
      const translator = ctx.translator;
      let translation = translator.propertyService.translateName(this.key);
      if (translation !== void 0) {
        return `${translation}${KEY_VALUE_SEPARATOR}`;
      }
      translation = translator.attributeService.translateName(this.key);
      if (translation !== void 0) {
        return `${translation}${KEY_VALUE_SEPARATOR}`;
      }
      return `${this.key}${KEY_VALUE_SEPARATOR}`;
    }
  }
  class ModifierLine extends Line {
    constructor(content) {
      super(content);
      const pattern = new RegExp("(.+)\\s(\\(\\w+\\))$");
      const match = pattern.exec(content);
      if (match !== null) {
        this.modifier = match[1];
        this.suffix = match[2];
      } else {
        this.modifier = content;
      }
    }
    getTranslation(ctx) {
      const translator = ctx.translator;
      let translation = translator.statService.translateMod(this.modifier);
      if (translation !== void 0) {
        if (this.suffix) {
          return `${translation} ${this.suffix}`;
        }
        return translation;
      }
      translation = translator.propertyService.translateName(this.modifier);
      if (translation !== void 0) {
        return translation;
      }
      translation = translator.attributeService.translateName(this.modifier);
      if (translation !== void 0) {
        return translation;
      }
      return this.content;
    }
  }
  class TranslatorFactory {
  }
  class BasicTranslatorFactory extends TranslatorFactory {
    constructor(assets) {
      super();
      const baseTypesList = [
        assets.amulets,
        assets.belts,
        assets.rings,
        assets.bodyArmours,
        assets.boots,
        assets.gloves,
        assets.helmets,
        assets.quivers,
        assets.shields,
        assets.flasks,
        assets.jewels,
        assets.weapons,
        assets.tattoos
      ];
      const baseTypeProvider = new BaseTypeProvider(baseTypesList);
      this.baseTypeService = new BaseTypeService(baseTypeProvider);
      this.itemService = new ItemService(baseTypeProvider);
      const requirementProvider = new RequirementProvider(assets.requirements, assets.requirementSuffixes);
      this.requirementService = new RequirementService(requirementProvider);
      const propertyProvider = new PropertyProvider(assets.properties);
      this.propertyService = new PropertyService(propertyProvider);
      const gemProvider = new GemProvider(assets.gems, assets.hybridSkills);
      this.gemService = new GemService(gemProvider);
      const passiveSkillProvider = new PassiveSkillProvider(assets.notables, assets.keystones, assets.ascendant);
      this.passiveSkillService = new PassiveSkillService(passiveSkillProvider);
      const statProvider = new StatProvider(assets.stats);
      this.statService = new StatService(this.passiveSkillService, statProvider);
      const attributeProvider = new AttributeProvider(assets.attributes);
      this.attributeService = new AttributeService(attributeProvider);
      this.jsonTranslator = new JsonTranslator(this.baseTypeService, this.itemService, this.requirementService, this.propertyService, this.gemService, this.statService, this.passiveSkillService);
      this.textTranslator = new TextTranslator(this.baseTypeService, this.itemService, this.requirementService, this.propertyService, this.gemService, this.statService, this.attributeService);
    }
    getJsonTranslator() {
      return this.jsonTranslator;
    }
    getTextTranslator() {
      return this.textTranslator;
    }
    getBaseTypeService() {
      return this.baseTypeService;
    }
    getPassiveSkillService() {
      return this.passiveSkillService;
    }
    getAttributeService() {
      return this.attributeService;
    }
    getGemService() {
      return this.gemService;
    }
    getItemService() {
      return this.itemService;
    }
    getPropertiesService() {
      return this.propertyService;
    }
    getRequirementService() {
      return this.requirementService;
    }
    getStatService() {
      return this.statService;
    }
  }
  const copyToClipboard = (txt = "", cb = () => {
  }) => {
    const node = document.createElement("textarea");
    node.value = txt;
    document.body.appendChild(node);
    node.select();
    document.execCommand("Copy");
    document.body.removeChild(node);
    cb();
  };
  const translateItem = (text) => {
    if (!text)
      return;
    const factory = new BasicTranslatorFactory(_monkeyWindow.CnPoeExportDb);
    const textTranslator = factory.getTextTranslator();
    return textTranslator.translate(text);
  };
  const importFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "text/plain";
    input.hidden = true;
    input.style.width = "0px";
    input.style.height = "0px";
    input.style.position = "absolute";
    document.body.appendChild(input);
    input.click();
    return new Promise((resolve, reject) => {
      input.onchange = (e) => {
        const files = e.target.files;
        resolve(files);
      };
    });
  };
  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };
  const exportTxtFile = (filename, text) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  const isValidConfig = (config) => {
    if (!Array.isArray(config))
      return false;
    for (const item of config) {
      if (typeof item !== "object" || typeof item.value !== "string")
        return false;
    }
    return true;
  };
  function mergeAndRemoveDuplicates(arr1, arr2) {
    const mergedArray = [...arr1, ...arr2];
    const map = /* @__PURE__ */ new Map();
    mergedArray.forEach((item) => {
      const key = item.label + item.value;
      if (!map.has(key)) {
        map.set(key, item);
      }
    });
    const uniqueArray = Array.from(map.values());
    return uniqueArray;
  }
  typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
  const isDef = (val) => typeof val !== "undefined";
  function cloneFnJSON(source) {
    return JSON.parse(JSON.stringify(source));
  }
  function useVModel(props, key, emit, options = {}) {
    var _a, _b, _c;
    const {
      clone = false,
      passive = false,
      eventName,
      deep = false,
      defaultValue,
      shouldEmit
    } = options;
    const vm = vue.getCurrentInstance();
    const _emit = emit || (vm == null ? void 0 : vm.emit) || ((_a = vm == null ? void 0 : vm.$emit) == null ? void 0 : _a.bind(vm)) || ((_c = (_b = vm == null ? void 0 : vm.proxy) == null ? void 0 : _b.$emit) == null ? void 0 : _c.bind(vm == null ? void 0 : vm.proxy));
    let event = eventName;
    if (!key) {
      {
        key = "modelValue";
      }
    }
    event = event || `update:${key.toString()}`;
    const cloneFn = (val) => !clone ? val : typeof clone === "function" ? clone(val) : cloneFnJSON(val);
    const getValue2 = () => isDef(props[key]) ? cloneFn(props[key]) : defaultValue;
    const triggerEmit = (value) => {
      if (shouldEmit) {
        if (shouldEmit(value))
          _emit(event, value);
      } else {
        _emit(event, value);
      }
    };
    if (passive) {
      const initialValue = getValue2();
      const proxy = vue.ref(initialValue);
      let isUpdating = false;
      vue.watch(
        () => props[key],
        (v) => {
          if (!isUpdating) {
            isUpdating = true;
            proxy.value = cloneFn(v);
            vue.nextTick(() => isUpdating = false);
          }
        }
      );
      vue.watch(
        proxy,
        (v) => {
          if (!isUpdating && (v !== props[key] || deep))
            triggerEmit(v);
        },
        { deep }
      );
      return proxy;
    } else {
      return vue.computed({
        get() {
          return getValue2();
        },
        set(value) {
          triggerEmit(value);
        }
      });
    }
  }
  const _hoisted_1$6 = { class: "DField" };
  const _hoisted_2$5 = { class: "uno-je4uyi" };
  const _hoisted_3$5 = ["type", "placeholder", "maxlength"];
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "DField",
    props: {
      modelValue: { default: "" },
      label: { default: "" },
      placeholder: { default: "" },
      icon: { default: "" },
      type: { default: "text" },
      max: {},
      min: {}
    },
    emits: ["update:modelValue", "iconClick"],
    setup(__props, { emit: __emit }) {
      const emit = __emit;
      const props = __props;
      const value = useVModel(props, "modelValue", emit);
      const focus = vue.ref(false);
      const inputRef = vue.ref();
      const onFocus = () => {
        focus.value = true;
      };
      const onBlur = () => {
        setTimeout(() => {
          focus.value = false;
        }, 0);
      };
      const onLabelClick = () => {
        if (inputRef.value) {
          inputRef.value.focus();
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$6, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["uno-kdj5ae", focus.value && "after:w-100%"])
          }, [
            _ctx.label ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "uno-bmns78",
              onClick: vue.withModifiers(onLabelClick, ["stop"])
            }, vue.toDisplayString(_ctx.label), 1)) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_2$5, [
              vue.withDirectives(vue.createElementVNode("input", {
                type: _ctx.type,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(value) ? value.value = $event : null),
                class: "uno-4f0c85",
                placeholder: _ctx.placeholder,
                ref_key: "inputRef",
                ref: inputRef,
                onFocus,
                onBlur,
                maxlength: _ctx.max
              }, null, 40, _hoisted_3$5), [
                [vue.vModelDynamic, vue.unref(value)]
              ])
            ])
          ], 2)
        ]);
      };
    }
  });
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "DButton",
    props: {
      block: { type: Boolean, default: false },
      type: { default: "primary" },
      round: { type: Boolean, default: false },
      variant: { default: "default" },
      color: {},
      loading: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      icon: {},
      size: { default: "sm" }
    },
    emits: ["click"],
    setup(__props, { emit: __emit }) {
      const emit = __emit;
      const props = __props;
      const createStyle = () => {
        const actions = {
          default: {
            "--b-type-alpha": 1,
            "--b-active-alpha": 0.9,
            "--b-color": "white"
          },
          outline: {
            "--b-type-alpha": 0,
            "--b-border": `rgb(var(--color-${props.type}))`
          },
          light: {
            "--b-type-alpha": 0.2,
            "--b-active-alpha": 0.3
          },
          text: {
            "--b-type-alpha": 0
          }
        };
        const size = {
          sm: `6px`,
          md: `10px`,
          lg: `16px`
        };
        const style = {
          "--b-active-alpha": 0.2,
          "--b-type": `rgb(var(--color-${props.type}) / var(--b-type-alpha))`,
          "--b-active": `rgb(var(--color-${props.type}) / var(--b-active-alpha))`,
          "--b-color": `rgb(var(--color-${props.type}))`,
          "--b-border": "transparent",
          "--b-size": size[props.size],
          ...actions[props.variant]
        };
        return style;
      };
      const customStyle = vue.computed(() => {
        if (props.color)
          return `--b-type: ${props.color};`;
        return createStyle();
      });
      const onClick = () => {
        if (props.loading || props.disabled)
          return;
        emit("click");
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("button", {
          class: vue.normalizeClass(["uno-n727xu d-button", [
            { "w-full": _ctx.block, disabled: _ctx.loading || _ctx.disabled, "rounded-full": _ctx.round }
          ]]),
          style: vue.normalizeStyle(customStyle.value),
          onClick: vue.withModifiers(onClick, ["stop"])
        }, [
          vue.createElementVNode("span", null, [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ])
        ], 6);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const DButton = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-91a14c1a"]]);
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "DMask",
    props: {
      show: { type: Boolean },
      styles: {},
      zIndex: {}
    },
    emits: ["click"],
    setup(__props, { emit: __emit }) {
      const emit = __emit;
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, { name: "fade" }, {
          default: vue.withCtx(() => [
            _ctx.show ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "uno-j2fx0m mask",
              onClick: _cache[0] || (_cache[0] = ($event) => emit("click")),
              style: vue.normalizeStyle({ "z-index": _ctx.zIndex, ..._ctx.styles || {} })
            }, null, 4)) : vue.createCommentVNode("", true)
          ]),
          _: 1
        });
      };
    }
  });
  const _hoisted_1$5 = { class: "uno-9b57t1" };
  const _hoisted_2$4 = { class: "uno-j8124d" };
  const _hoisted_3$4 = { class: "uno-q3uz8k" };
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "DDialog",
    props: {
      modelValue: { type: Boolean, default: false },
      title: { default: "" },
      beforeClose: {}
    },
    emits: ["update:modelValue", "confirm"],
    setup(__props, { emit: __emit }) {
      const emit = __emit;
      const props = __props;
      const visible = useVModel(props, "modelValue", emit);
      const loading = vue.ref(false);
      const onClose = async (e) => {
        if (loading.value)
          return;
        if (props.beforeClose) {
          loading.value = true;
          const res = await props.beforeClose(e);
          loading.value = false;
          if (!res)
            return;
        }
        visible.value = false;
      };
      const onCancel = () => {
        onClose(false);
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
          vue.createVNode(vue.Transition, { name: "scale-up" }, {
            default: vue.withCtx(() => [
              vue.unref(visible) ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: "uno-hbwt5n",
                onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
                }, ["stop"]))
              }, [
                vue.createElementVNode("div", _hoisted_1$5, [
                  vue.renderSlot(_ctx.$slots, "title", {}, () => [
                    vue.createElementVNode("span", _hoisted_2$4, vue.toDisplayString(_ctx.title), 1)
                  ])
                ]),
                vue.createElementVNode("div", _hoisted_3$4, [
                  vue.renderSlot(_ctx.$slots, "default")
                ])
              ])) : vue.createCommentVNode("", true)
            ]),
            _: 3
          }),
          vue.createVNode(_sfc_main$6, {
            onClick: onCancel,
            show: vue.unref(visible),
            zIndex: "2000"
          }, null, 8, ["show"])
        ]);
      };
    }
  });
  const _hoisted_1$4 = { class: "uno-9b57t1" };
  const _hoisted_2$3 = { class: "uno-j8124d" };
  const _hoisted_3$3 = { class: "uno-q3uz8k" };
  const _hoisted_4$2 = ["innerHTML"];
  const _hoisted_5$1 = { class: "uno-xzlctu" };
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "DMessageBox",
    props: {
      visible: { type: Boolean },
      close: { type: Function },
      confirm: { type: Function },
      title: {},
      message: {},
      showCancel: { type: Boolean },
      cancelText: {},
      confirmText: {}
    },
    emits: ["update:visible"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const loading = vue.ref(false);
      const show = vue.ref(false);
      const handleClose = () => {
        var _a;
        show.value = false;
        (_a = props.close) == null ? void 0 : _a.call(props);
      };
      const onMaskClick = () => {
        handleClose();
      };
      const onCancel = () => {
        handleClose();
      };
      const onConfirm = () => {
        var _a;
        (_a = props.confirm) == null ? void 0 : _a.call(props);
        show.value = false;
      };
      vue.watch(() => props.visible, (val) => {
        setTimeout(() => {
          show.value = val;
        }, 0);
      }, {
        immediate: true
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
          vue.createVNode(vue.unref(_sfc_main$6), {
            show: show.value,
            onClick: onMaskClick,
            "z-index": "3000"
          }, null, 8, ["show"]),
          vue.createVNode(vue.Transition, { name: "scale-up" }, {
            default: vue.withCtx(() => [
              show.value ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: "uno-ni5pzh",
                onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
                }, ["stop"]))
              }, [
                vue.createElementVNode("div", _hoisted_1$4, [
                  vue.createElementVNode("span", _hoisted_2$3, vue.toDisplayString(_ctx.title), 1)
                ]),
                vue.createElementVNode("div", _hoisted_3$3, [
                  vue.createElementVNode("div", { innerHTML: _ctx.message }, null, 8, _hoisted_4$2)
                ]),
                vue.createElementVNode("div", _hoisted_5$1, [
                  _ctx.showCancel ? (vue.openBlock(), vue.createBlock(vue.unref(DButton), {
                    key: 0,
                    round: "",
                    type: "primary",
                    variant: "outline",
                    size: "md",
                    disabled: loading.value,
                    onClick: onCancel
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(vue.toDisplayString(_ctx.cancelText), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"])) : vue.createCommentVNode("", true),
                  vue.createVNode(vue.unref(DButton), {
                    round: "",
                    type: "primary",
                    variant: "default",
                    size: "md",
                    loading: loading.value,
                    onClick: onConfirm
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(vue.toDisplayString(_ctx.confirmText), 1)
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])
              ])) : vue.createCommentVNode("", true)
            ]),
            _: 1
          })
        ]);
      };
    }
  });
  const defaultConfig = {
    title: "注意",
    message: "",
    cancelText: "取消",
    confirmText: "确认",
    showCancel: true
  };
  function showMessageBox(options) {
    return new Promise((resolve, reject) => {
      const mountNode = document.createElement("div");
      const dialogApp = vue.createApp(_sfc_main$4, {
        visible: true,
        ...defaultConfig,
        ...options,
        close: () => {
          resolve(false);
          setTimeout(() => {
            dialogApp.unmount();
            document.body.removeChild(mountNode);
          }, 300);
        },
        confirm: () => {
          resolve(true);
          setTimeout(() => {
            dialogApp.unmount();
            document.body.removeChild(mountNode);
          }, 300);
        }
      });
      document.body.appendChild(mountNode);
      dialogApp.mount(mountNode);
    });
  }
  const _hoisted_1$3 = { class: "uno-y292xp" };
  const _hoisted_2$2 = { class: "uno-d54z7h" };
  const _hoisted_3$2 = { class: "uno-yqud7r" };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "Translate",
    setup(__props) {
      const show = vue.ref(false);
      const value = vue.ref("");
      const tip = vue.ref("");
      let st = null;
      const onTranslate = () => {
        const res = translateItem(value.value);
        if (!res) {
          tip.value = "转换异常，请重试";
          return;
        }
        value.value = res;
        copyToClipboard(value.value);
        tip.value = "已复制";
      };
      vue.watch(
        () => tip.value,
        (val) => {
          if (val) {
            if (st)
              clearTimeout(st);
            st = setTimeout(() => {
              tip.value = "";
            }, 3e3);
          }
        }
      );
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
          vue.createVNode(vue.Transition, { name: "slider" }, {
            default: vue.withCtx(() => [
              vue.withDirectives(vue.createElementVNode("div", _hoisted_2$2, [
                vue.createElementVNode("div", _hoisted_3$2, [
                  vue.withDirectives(vue.createElementVNode("textarea", {
                    class: "uno-suerow scroll-bar",
                    rows: "5",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event),
                    placeholder: "在这里粘贴"
                  }, null, 512), [
                    [vue.vModelText, value.value]
                  ])
                ]),
                vue.createVNode(vue.unref(DButton), {
                  type: "blue",
                  onClick: onTranslate
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("翻译并复制")
                  ]),
                  _: 1
                })
              ], 512), [
                [vue.vShow, show.value]
              ])
            ]),
            _: 1
          }),
          vue.createVNode(vue.unref(DButton), {
            type: "brown",
            class: "uno-k9nrt0",
            onClick: _cache[1] || (_cache[1] = ($event) => show.value = !show.value)
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(vue.toDisplayString(show.value ? "隐藏翻译界面" : "显示翻译界面"), 1)
            ]),
            _: 1
          })
        ]);
      };
    }
  });
  const SEARCH_PARAMS = [
    { label: "希望之线", value: "ajJPd8Te" },
    { label: "全抗装备", value: "Kl9qPYEc5" },
    { label: "爆伤珠宝", value: "lgPddkwhV" },
    { label: "21/20技能", value: "Nkz0F5" },
    { label: "8天赋星团", value: "nw0p9VS0" }
  ];
  const CLUSTER_LIST = [
    {
      attribute: "斧类攻击造成的击中和异常状态伤害提高",
      detail: [
        {
          name: "恶毒穿刺",
          ps: "前缀",
          order: 0
        },
        {
          name: "鲜血之腥",
          ps: "前缀",
          order: 1
        },
        {
          name: "飘雪穿云",
          ps: "前缀",
          order: 2
        },
        {
          name: "恶化创伤",
          ps: "前缀",
          order: 3
        },
        {
          name: "截心击",
          ps: "后缀",
          order: 4
        },
        {
          name: "金刚拳",
          ps: "后缀",
          order: 5
        },
        {
          name: "武艺精湛",
          ps: "后缀",
          order: 6
        },
        {
          name: "灾殃",
          ps: "前缀",
          order: 7
        },
        {
          name: "破坏者",
          ps: "前缀",
          order: 8
        },
        {
          name: "充能备战",
          ps: "前缀",
          order: 9
        },
        {
          name: "毁灭引擎",
          ps: "前缀",
          order: 10
        },
        {
          name: "怒火盛宴",
          ps: "前缀",
          order: 11
        },
        {
          name: "以攻为守",
          ps: "前缀",
          order: 12
        }
      ]
    },
    {
      attribute: "长杖攻击造成的击中和异常状态伤害提高",
      detail: [
        {
          name: "恶毒穿刺",
          ps: "前缀",
          order: 0
        },
        {
          name: "霸主",
          ps: "前缀",
          order: 1
        },
        {
          name: "万象之力",
          ps: "前缀",
          order: 2
        },
        {
          name: "千斤坠",
          ps: "前缀",
          order: 3
        },
        {
          name: "截心击",
          ps: "后缀",
          order: 4
        },
        {
          name: "金刚拳",
          ps: "后缀",
          order: 5
        },
        {
          name: "武艺精湛",
          ps: "后缀",
          order: 6
        },
        {
          name: "灾殃",
          ps: "前缀",
          order: 7
        },
        {
          name: "破坏者",
          ps: "前缀",
          order: 8
        },
        {
          name: "充能备战",
          ps: "前缀",
          order: 9
        },
        {
          name: "毁灭引擎",
          ps: "前缀",
          order: 10
        },
        {
          name: "怒火盛宴",
          ps: "前缀",
          order: 11
        },
        {
          name: "以攻为守",
          ps: "前缀",
          order: 12
        }
      ]
    },
    {
      attribute: "爪类攻击造成的击中和异常状态伤害提高",
      detail: [
        {
          name: "恶毒穿刺",
          ps: "前缀",
          order: 0
        },
        {
          name: "螺旋之风",
          ps: "前缀",
          order: 1
        },
        {
          name: "回风之剑",
          ps: "前缀",
          order: 2
        },
        {
          name: "疫病弥漫",
          ps: "前缀",
          order: 3
        },
        {
          name: "截心击",
          ps: "后缀",
          order: 4
        },
        {
          name: "金刚拳",
          ps: "后缀",
          order: 5
        },
        {
          name: "武艺精湛",
          ps: "后缀",
          order: 6
        },
        {
          name: "灾殃",
          ps: "前缀",
          order: 7
        },
        {
          name: "破坏者",
          ps: "前缀",
          order: 8
        },
        {
          name: "充能备战",
          ps: "前缀",
          order: 9
        },
        {
          name: "毁灭引擎",
          ps: "前缀",
          order: 10
        },
        {
          name: "怒火盛宴",
          ps: "前缀",
          order: 11
        },
        {
          name: "以攻为守",
          ps: "前缀",
          order: 12
        }
      ]
    },
    {
      attribute: "弓类伤害提高",
      detail: [
        {
          name: "恶毒穿刺",
          ps: "前缀",
          order: 0
        },
        {
          name: "弧光箭",
          ps: "前缀",
          order: 1
        },
        {
          name: "淬火箭头",
          ps: "前缀",
          order: 2
        },
        {
          name: "侧舷炮",
          ps: "前缀",
          order: 3
        },
        {
          name: "截心击",
          ps: "后缀",
          order: 4
        },
        {
          name: "金刚拳",
          ps: "后缀",
          order: 5
        },
        {
          name: "武艺精湛",
          ps: "后缀",
          order: 6
        },
        {
          name: "灾殃",
          ps: "前缀",
          order: 7
        },
        {
          name: "破坏者",
          ps: "前缀",
          order: 8
        },
        {
          name: "充能备战",
          ps: "前缀",
          order: 9
        },
        {
          name: "毁灭引擎",
          ps: "前缀",
          order: 10
        },
        {
          name: "怒火盛宴",
          ps: "前缀",
          order: 11
        }
      ]
    },
    {
      attribute: "法杖攻击造成的击中和异常状态伤害提高",
      detail: [
        {
          name: "恶毒穿刺",
          ps: "前缀",
          order: 0
        },
        {
          name: "混元震天",
          ps: "前缀",
          order: 1
        },
        {
          name: "趁机发难",
          ps: "前缀",
          order: 2
        },
        {
          name: "风暴之手",
          ps: "前缀",
          order: 3
        },
        {
          name: "截心击",
          ps: "后缀",
          order: 4
        },
        {
          name: "金刚拳",
          ps: "后缀",
          order: 5
        },
        {
          name: "武艺精湛",
          ps: "后缀",
          order: 6
        },
        {
          name: "灾殃",
          ps: "前缀",
          order: 7
        },
        {
          name: "破坏者",
          ps: "前缀",
          order: 8
        },
        {
          name: "充能备战",
          ps: "前缀",
          order: 9
        },
        {
          name: "毁灭引擎",
          ps: "前缀",
          order: 10
        },
        {
          name: "怒火盛宴",
          ps: "前缀",
          order: 11
        }
      ]
    },
    {
      attribute: "双手武器的攻击伤害提高",
      detail: [
        {
          name: "恶毒穿刺",
          ps: "前缀",
          order: 0
        },
        {
          name: "翻天横扫",
          ps: "前缀",
          order: 1
        },
        {
          name: "战场主宰",
          ps: "前缀",
          order: 2
        },
        {
          name: "武艺专精",
          ps: "前缀",
          order: 3
        },
        {
          name: "好整以暇",
          ps: "前缀",
          order: 4
        },
        {
          name: "优雅处刑",
          ps: "前缀",
          order: 5
        },
        {
          name: "恶名昭著",
          ps: "前缀",
          order: 6
        },
        {
          name: "凶骇武士",
          ps: "前缀",
          order: 7
        },
        {
          name: "截心击",
          ps: "后缀",
          order: 8
        },
        {
          name: "金刚拳",
          ps: "后缀",
          order: 9
        },
        {
          name: "武艺精湛",
          ps: "后缀",
          order: 10
        },
        {
          name: "灾殃",
          ps: "前缀",
          order: 11
        },
        {
          name: "破坏者",
          ps: "前缀",
          order: 12
        },
        {
          name: "充能备战",
          ps: "前缀",
          order: 13
        },
        {
          name: "毁灭引擎",
          ps: "前缀",
          order: 14
        },
        {
          name: "怒火盛宴",
          ps: "前缀",
          order: 15
        }
      ]
    },
    {
      attribute: "攻击伤害在双持武器时提高",
      detail: [
        {
          name: "恶毒穿刺",
          ps: "前缀",
          order: 0
        },
        {
          name: "韵律战法",
          ps: "前缀",
          order: 1
        },
        {
          name: "连打带跑",
          ps: "前缀",
          order: 2
        },
        {
          name: "无尽杀戮",
          ps: "前缀",
          order: 3
        },
        {
          name: "破法",
          ps: "前缀",
          order: 4
        },
        {
          name: "技如长虹",
          ps: "前缀",
          order: 5
        },
        {
          name: "疾雨摧花",
          ps: "前缀",
          order: 6
        },
        {
          name: "又快又狠",
          ps: "前缀",
          order: 7
        },
        {
          name: "截心击",
          ps: "后缀",
          order: 8
        },
        {
          name: "金刚拳",
          ps: "后缀",
          order: 9
        },
        {
          name: "武艺精湛",
          ps: "后缀",
          order: 10
        },
        {
          name: "灾殃",
          ps: "前缀",
          order: 11
        },
        {
          name: "破坏者",
          ps: "前缀",
          order: 12
        },
        {
          name: "充能备战",
          ps: "前缀",
          order: 13
        },
        {
          name: "毁灭引擎",
          ps: "前缀",
          order: 14
        },
        {
          name: "怒火盛宴",
          ps: "前缀",
          order: 15
        }
      ]
    },
    {
      attribute: "持盾牌时造成的攻击伤害提高",
      detail: [
        {
          name: "恢宏壁垒",
          ps: "前缀",
          order: 0
        },
        {
          name: "先遣卫士",
          ps: "前缀",
          order: 1
        },
        {
          name: "领军之将",
          ps: "前缀",
          order: 2
        },
        {
          name: "勇毅斗士",
          ps: "前缀",
          order: 3
        },
        {
          name: "睚眦必报",
          ps: "前缀",
          order: 4
        },
        {
          name: "防御老手",
          ps: "前缀",
          order: 5
        },
        {
          name: "恶毒穿刺",
          ps: "前缀",
          order: 6
        },
        {
          name: "截心击",
          ps: "后缀",
          order: 7
        },
        {
          name: "金刚拳",
          ps: "后缀",
          order: 8
        },
        {
          name: "武艺精湛",
          ps: "后缀",
          order: 9
        },
        {
          name: "灾殃",
          ps: "前缀",
          order: 10
        },
        {
          name: "破坏者",
          ps: "前缀",
          order: 11
        },
        {
          name: "充能备战",
          ps: "前缀",
          order: 12
        },
        {
          name: "毁灭引擎",
          ps: "前缀",
          order: 13
        },
        {
          name: "怒火盛宴",
          ps: "前缀",
          order: 14
        },
        {
          name: "骚乱平息",
          ps: "前缀",
          order: 15
        }
      ]
    },
    {
      attribute: "攻击伤害提高",
      detail: [
        {
          name: "恶毒穿刺",
          ps: "前缀",
          order: 0
        },
        {
          name: "截心击",
          ps: "后缀",
          order: 1
        },
        {
          name: "金刚拳",
          ps: "后缀",
          order: 2
        },
        {
          name: "武艺精湛",
          ps: "后缀",
          order: 3
        },
        {
          name: "灾殃",
          ps: "前缀",
          order: 4
        },
        {
          name: "破坏者",
          ps: "前缀",
          order: 5
        },
        {
          name: "充能备战",
          ps: "前缀",
          order: 6
        },
        {
          name: "毁灭引擎",
          ps: "前缀",
          order: 7
        },
        {
          name: "怒火盛宴",
          ps: "前缀",
          order: 8
        }
      ]
    },
    {
      attribute: "法术伤害提高",
      detail: [
        {
          name: "先祖教化",
          ps: "前缀",
          order: 0
        },
        {
          name: "奥术专家",
          ps: "前缀",
          order: 1
        },
        {
          name: "弥补之印",
          ps: "前缀",
          order: 2
        },
        {
          name: "咒法之墙",
          ps: "前缀",
          order: 3
        },
        {
          name: "奥术英姿",
          ps: "前缀",
          order: 4
        },
        {
          name: "施法熟手",
          ps: "前缀",
          order: 5
        },
        {
          name: "掷象功",
          ps: "前缀",
          order: 6
        },
        {
          name: "奥法蠕虫",
          ps: "后缀",
          order: 7
        },
        {
          name: "精华疾攻",
          ps: "后缀",
          order: 8
        },
        {
          name: "心灵枯竭",
          ps: "后缀",
          order: 9
        },
        {
          name: "法师猎人",
          ps: "前缀",
          order: 10
        }
      ]
    },
    {
      attribute: "元素伤害提高",
      detail: [
        {
          name: "狂虐者",
          ps: "前缀",
          order: 0
        },
        {
          name: "腐蚀元素",
          ps: "前缀",
          order: 1
        },
        {
          name: "多利亚尼之训",
          ps: "后缀",
          order: 2
        },
        {
          name: "心神错乱",
          ps: "后缀",
          order: 3
        },
        {
          name: "棱光之心",
          ps: "前缀",
          order: 4
        },
        {
          name: "毁天灭地",
          ps: "后缀",
          order: 5
        },
        {
          name: "绝妙镇压",
          ps: "前缀",
          order: 6
        }
      ]
    },
    {
      attribute: "物理伤害提高",
      detail: [
        {
          name: "钢铁斗士",
          ps: "前缀",
          order: 0
        },
        {
          name: "规律主宰",
          ps: "前缀",
          order: 1
        },
        {
          name: "力量倍增",
          ps: "后缀",
          order: 2
        },
        {
          name: "狂风扫荡",
          ps: "后缀",
          order: 3
        },
        {
          name: "阴冷誓言",
          ps: "后缀",
          order: 4
        },
        {
          name: "坚守战场",
          ps: "前缀",
          order: 5
        }
      ]
    },
    {
      attribute: "火焰伤害提高",
      detail: [
        {
          name: "狂虐者",
          ps: "前缀",
          order: 0
        },
        {
          name: "腐蚀元素",
          ps: "前缀",
          order: 1
        },
        {
          name: "多利亚尼之训",
          ps: "后缀",
          order: 2
        },
        {
          name: "心神错乱",
          ps: "后缀",
          order: 3
        },
        {
          name: "棱光之心",
          ps: "前缀",
          order: 4
        },
        {
          name: "毁天灭地",
          ps: "后缀",
          order: 5
        },
        {
          name: "火焰之主",
          ps: "前缀",
          order: 6
        },
        {
          name: "燃烬之烟",
          ps: "前缀",
          order: 7
        },
        {
          name: "焚化炉",
          ps: "前缀",
          order: 8
        },
        {
          name: "熊熊燃烧",
          ps: "前缀",
          order: 9
        }
      ]
    },
    {
      attribute: "闪电伤害提高",
      detail: [
        {
          name: "狂虐者",
          ps: "前缀",
          order: 0
        },
        {
          name: "腐蚀元素",
          ps: "前缀",
          order: 1
        },
        {
          name: "多利亚尼之训",
          ps: "后缀",
          order: 2
        },
        {
          name: "心神错乱",
          ps: "后缀",
          order: 3
        },
        {
          name: "棱光之心",
          ps: "前缀",
          order: 4
        },
        {
          name: "毁天灭地",
          ps: "后缀",
          order: 5
        },
        {
          name: "暴风雪",
          ps: "前缀",
          order: 6
        },
        {
          name: "风暴痛饮",
          ps: "前缀",
          order: 7
        },
        {
          name: "瘫痪",
          ps: "前缀",
          order: 8
        },
        {
          name: "绝妙镇压",
          ps: "前缀",
          order: 9
        },
        {
          name: "天雷轰顶",
          ps: "前缀",
          order: 10
        },
        {
          name: "风暴骑手",
          ps: "前缀",
          order: 11
        },
        {
          name: "霹雳雷震",
          ps: "前缀",
          order: 12
        },
        {
          name: "闪光理念",
          ps: "前缀",
          order: 13
        }
      ]
    },
    {
      attribute: "冰霜伤害提高",
      detail: [
        {
          name: "狂虐者",
          ps: "前缀",
          order: 0
        },
        {
          name: "腐蚀元素",
          ps: "前缀",
          order: 1
        },
        {
          name: "多利亚尼之训",
          ps: "后缀",
          order: 2
        },
        {
          name: "心神错乱",
          ps: "后缀",
          order: 3
        },
        {
          name: "棱光之心",
          ps: "前缀",
          order: 4
        },
        {
          name: "毁天灭地",
          ps: "后缀",
          order: 5
        },
        {
          name: "暴风雪",
          ps: "前缀",
          order: 6
        },
        {
          name: "大雪漫天",
          ps: "前缀",
          order: 7
        },
        {
          name: "冻彻心扉",
          ps: "前缀",
          order: 8
        },
        {
          name: "冷血杀手",
          ps: "前缀",
          order: 9
        },
        {
          name: "绝妙镇压",
          ps: "前缀",
          order: 10
        },
        {
          name: "深寒",
          ps: "前缀",
          order: 11
        },
        {
          name: "千里冰封",
          ps: "前缀",
          order: 12
        },
        {
          name: "风暴骑手",
          ps: "前缀",
          order: 13
        }
      ]
    },
    {
      attribute: "混沌伤害提高",
      detail: [
        {
          name: "阴冷誓言",
          ps: "后缀",
          order: 0
        },
        {
          name: "罪恶滔天",
          ps: "前缀",
          order: 1
        },
        {
          name: "残酷之触",
          ps: "前缀",
          order: 2
        },
        {
          name: "不动之恶",
          ps: "前缀",
          order: 3
        },
        {
          name: "莫名之赐",
          ps: "后缀",
          order: 4
        },
        {
          name: "黑暗构想",
          ps: "前缀",
          order: 5
        },
        {
          name: "渎神雅量",
          ps: "后缀",
          order: 6
        },
        {
          name: "邪恶烟云",
          ps: "前缀",
          order: 7
        }
      ]
    },
    {
      attribute: "召唤生物的伤害提高",
      detail: [
        {
          name: "复兴",
          ps: "前缀",
          order: 0
        },
        {
          name: "寸草不生",
          ps: "前缀",
          order: 1
        },
        {
          name: "腐烂之爪",
          ps: "前缀",
          order: 2
        },
        {
          name: "屠夫呼唤",
          ps: "后缀",
          order: 3
        },
        {
          name: "恶毒撕咬",
          ps: "后缀",
          order: 4
        },
        {
          name: "原初之缚",
          ps: "后缀",
          order: 5
        },
        {
          name: "饕餮群魔",
          ps: "前缀",
          order: 6
        },
        {
          name: "魔侍凋零",
          ps: "前缀",
          order: 7
        }
      ]
    }
  ];
  const _hoisted_1$2 = { class: "uno-y292xp" };
  const _hoisted_2$1 = { class: "uno-l9jv7r scroll-bar" };
  const _hoisted_3$1 = { class: "uno-weqgrm" };
  const _hoisted_4$1 = ["onClick"];
  const _hoisted_5 = ["onClick"];
  const _hoisted_6 = /* @__PURE__ */ vue.createElementVNode("div", null, [
    /* @__PURE__ */ vue.createElementVNode("span", { class: "uno-v15f5i" }, "新增"),
    /* @__PURE__ */ vue.createElementVNode("a", {
      class: "uno-m8p83r",
      href: "",
      target: "_blank"
    }, "详见说明")
  ], -1);
  const _hoisted_7 = { class: "uno-0aac7g" };
  const _hoisted_8 = { class: "uno-36f1r2" };
  const _hoisted_9 = { class: "uno-xy2f5e" };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "Search",
    setup(__props) {
      const show = vue.ref(false);
      const showCustom = vue.ref(false);
      const searchKeys = vue.ref([]);
      const form = vue.ref({
        label: "",
        value: ""
      });
      const saveStore = (arr) => {
        localStorage.setItem("SEARCH_PARAMS", JSON.stringify(arr));
      };
      const onSearch = (data) => {
        let league = "";
        const localLeague = JSON.parse(localStorage.getItem("lscache-tradestate") || "{}");
        league = localLeague.league || window.location.href.match(/\/trade\/search\/([^/]+)/)[1];
        window.open(`https://poe.game.qq.com/trade/search/${league}/${data.value}`, "_blank");
      };
      const onDel = (i) => {
        searchKeys.value.splice(i, 1);
        saveStore(searchKeys.value);
      };
      const onSave = () => {
        if (!form.value.label || !form.value.value)
          return;
        searchKeys.value.push(vue.toRaw(form.value));
        vue.nextTick(() => {
          form.value = {
            value: "",
            label: ""
          };
          saveStore(searchKeys.value);
        });
      };
      const onReset = async () => {
        const res = await showMessageBox({
          title: "注意",
          message: "重置后将恢复预设选项，所有自定义的列表都将被删除。是否继续?"
        });
        if (!res)
          return;
        searchKeys.value = SEARCH_PARAMS;
        saveStore(SEARCH_PARAMS);
      };
      const onExport = async () => {
        const txt = JSON.stringify(searchKeys.value);
        exportTxtFile("trade_config.txt", txt);
      };
      const onImport = async () => {
        const files = await importFile();
        if (!files) {
          alert("获取文件失败");
          return;
        }
        const file = files[0];
        if (file.type !== "text/plain") {
          await showMessageBox({ title: "注意", message: "仅支持txt文本", showCancel: false });
          return;
        }
        try {
          const text = await readFile(file);
          const data = JSON.parse(text);
          if (!isValidConfig(data)) {
            throw new Error("格式错误");
          }
          searchKeys.value = mergeAndRemoveDuplicates(vue.toRaw(searchKeys.value), data);
          saveStore(searchKeys.value);
          showMessageBox({ title: "注意", message: "导入成功", showCancel: false });
        } catch (error) {
          console.error(error);
          await showMessageBox({ title: "注意", message: "文件读取异常，请确认格式正确", showCancel: false });
        }
      };
      vue.onMounted(() => {
        const searchkeyStr = localStorage.getItem("SEARCH_PARAMS");
        if (!searchkeyStr) {
          searchKeys.value = SEARCH_PARAMS;
        } else {
          searchKeys.value = JSON.parse(searchkeyStr);
        }
        saveStore(searchKeys.value);
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
          vue.createVNode(vue.Transition, { name: "slider" }, {
            default: vue.withCtx(() => [
              vue.withDirectives(vue.createElementVNode("div", _hoisted_2$1, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(searchKeys.value, (param, i) => {
                  return vue.openBlock(), vue.createElementBlock("div", _hoisted_3$1, [
                    vue.createElementVNode("span", {
                      class: "uno-2x98nu",
                      onClick: ($event) => onSearch(param)
                    }, vue.toDisplayString(param.label), 9, _hoisted_4$1),
                    vue.createElementVNode("span", {
                      class: "uno-gd7xcy",
                      onClick: ($event) => onDel(i)
                    }, "x", 8, _hoisted_5)
                  ]);
                }), 256)),
                vue.createElementVNode("div", {
                  class: "uno-f70hor",
                  onClick: _cache[0] || (_cache[0] = ($event) => showCustom.value = true)
                }, "+ 自定义")
              ], 512), [
                [vue.vShow, show.value]
              ])
            ]),
            _: 1
          }),
          vue.createVNode(vue.unref(DButton), {
            type: "brown",
            class: "uno-8ut93f",
            onClick: _cache[1] || (_cache[1] = ($event) => show.value = !show.value),
            title: "具体物品和数值需要点击跳转后手动输入，只是有的词缀选起来很烦"
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("快捷搜索")
            ]),
            _: 1
          }),
          vue.createVNode(vue.unref(_sfc_main$5), {
            modelValue: showCustom.value,
            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => showCustom.value = $event)
          }, {
            title: vue.withCtx(() => [
              _hoisted_6
            ]),
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_7, [
                vue.createElementVNode("div", _hoisted_8, [
                  vue.createVNode(vue.unref(DButton), {
                    type: "danger",
                    variant: "outline",
                    round: "",
                    onClick: onReset
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("重置为默认")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(vue.unref(DButton), {
                    round: "",
                    onClick: onImport
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("批量导入")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(vue.unref(DButton), {
                    round: "",
                    onClick: onExport
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("导出")
                    ]),
                    _: 1
                  })
                ]),
                vue.createElementVNode("div", null, [
                  vue.createVNode(vue.unref(_sfc_main$8), {
                    label: "名字",
                    modelValue: form.value.label,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.label = $event),
                    placeholder: "请输入名字",
                    class: "uno-kzvvcj",
                    max: 20
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(vue.unref(_sfc_main$8), {
                    label: "查询字符串",
                    modelValue: form.value.value,
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.value = $event),
                    placeholder: "地址里最后的字符串.如:nw0p9VS0",
                    class: "uno-kzvvcj"
                  }, null, 8, ["modelValue"]),
                  vue.createElementVNode("div", _hoisted_9, [
                    vue.createVNode(vue.unref(DButton), {
                      round: "",
                      variant: "outline",
                      size: "md",
                      class: "uno-lnbmsj",
                      onClick: _cache[4] || (_cache[4] = ($event) => showCustom.value = false)
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("取消")
                      ]),
                      _: 1
                    }),
                    vue.createVNode(vue.unref(DButton), {
                      round: "",
                      onClick: onSave,
                      size: "md",
                      class: "uno-lnbmsj"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("保存")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ])
            ]),
            _: 1
          }, 8, ["modelValue"])
        ]);
      };
    }
  });
  const _withScopeId = (n) => (vue.pushScopeId("data-v-e39b9b4e"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "uno-pjhpbh group" };
  const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", { title: "该功能尚在实验中, 不保证内容准确。如发现对不上的请前往插件页面反馈" }, "查看天赋位置", -1));
  const _hoisted_3 = { class: "uno-cwirjq" };
  const _hoisted_4 = ["width", "height"];
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "Cluster",
    props: {
      data: {}
    },
    setup(__props) {
      const size = vue.ref(180);
      vue.ref(false);
      const canvas = vue.ref();
      const props = __props;
      const createCanvas = (num, types) => {
        if (!canvas.value)
          return;
        const ctx = canvas.value.getContext("2d");
        if (!ctx)
          return;
        const centerX = canvas.value.width / 2;
        const centerY = canvas.value.height / 2;
        const radius = 50;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 2;
        ctx.stroke();
        const numDots = 12;
        const len = types.length;
        let count = 0;
        const angleStep = 2 * Math.PI / numDots;
        const startingAngle = -Math.PI;
        for (let i = 0; i < numDots; i++) {
          const angle = startingAngle + i * angleStep;
          let dotRadius = 4;
          ctx.fillStyle = "gray";
          if (i === 4 || i === 8)
            dotRadius = 6;
          const pointPosition = [];
          if (len >= 1)
            pointPosition.push(6);
          if (len >= 2)
            pointPosition.push(10);
          if (len >= 3)
            pointPosition.push(2);
          if (pointPosition.includes(i)) {
            dotRadius = 8;
            ctx.fillStyle = "#4dc64d";
          }
          const ignoreList = [];
          if (num <= 11)
            ignoreList.push(1);
          if (num <= 10)
            ignoreList.push(11);
          if (num <= 9)
            ignoreList.push(3);
          if (ignoreList.includes(i))
            continue;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
          ctx.fill();
          if (pointPosition.includes(i)) {
            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.fillText(types[count].name, x - 60, y + 5);
            count += 1;
          }
        }
      };
      vue.onMounted(() => {
        createCanvas(parseInt(props.data.num), props.data.types);
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          _hoisted_2,
          vue.createElementVNode("div", _hoisted_3, [
            vue.createElementVNode("canvas", {
              ref_key: "canvas",
              ref: canvas,
              width: size.value,
              height: size.value
            }, null, 8, _hoisted_4)
          ])
        ]);
      };
    }
  });
  const Cluster = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-e39b9b4e"]]);
  const injectButton = (cb) => {
    const targets = Array.from(document.querySelectorAll(".row[data-id]"));
    if (!targets || !targets.length)
      return;
    targets.forEach((target) => {
      if (target.querySelector(".copy-en"))
        return;
      const leftEl = target.querySelector(".left");
      if (!leftEl)
        return;
      const btn = document.createElement("div");
      btn.className = "copy-en";
      btn.title = "复制英文";
      btn.setAttribute(
        "style",
        `position: absolute;
            left: 84px;
            bottom: 10px;
            color: #fff;
            font-size: 14px;
            cursor: pointer;
            text-decoration: underline;`
      );
      btn.innerText = "复制英文";
      leftEl.appendChild(btn);
      btn.addEventListener("click", () => {
        const text = target.__vue__.itemText;
        let textarea = document.createElement("textarea");
        textarea.value = text;
        const res = translateItem(textarea.value);
        copyToClipboard(res);
        target.__vue__.itemTextCopied();
      });
      if (cb)
        cb(target);
    });
  };
  const initObserver = (cb) => {
    const observer = new MutationObserver((mutationsList, observer2) => {
      for (let mutation of mutationsList) {
        if (mutation.target.className !== "resultset")
          return;
        injectButton(cb);
      }
    });
    const targetNode = document.querySelector("body");
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
  };
  const _hoisted_1 = { class: "uno-6a64nq" };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "Trade",
    setup(__props) {
      const callBack = (e) => {
        var _a;
        const infoEl = e.querySelector(".middle");
        const name = (_a = infoEl.querySelector(".itemHeader")) == null ? void 0 : _a.innerText;
        if (!/大型星团珠宝/.test(name))
          return;
        const info = infoEl == null ? void 0 : infoEl.innerText;
        const num = info.match(/增加 (\d+) 个天赋技能/);
        const attribute = info.match(/增加的小天赋获得：(.*)/);
        if (!num || !attribute)
          return;
        const regex = /其中 1 个增加的天赋为(.*)/g;
        let matches = [];
        let match;
        while ((match = regex.exec(info)) !== null) {
          if (match[1].trim()) {
            matches.push(match[1].replace(/【|】/g, ""));
          }
        }
        if (!matches.length)
          return;
        const currentType = CLUSTER_LIST.find((e2) => new RegExp(`^${e2.attribute}`).test(attribute[1]));
        if (!currentType)
          return;
        const data = {
          num: num[1],
          attribute: attribute[1],
          types: currentType.detail.filter((e2) => matches.includes(e2.name))
        };
        const clusterCom = vue.createApp(Cluster, {
          data
        });
        const wrap = document.createElement("div");
        const taget = e.querySelector(".left");
        if (taget)
          taget.append(wrap);
        clusterCom.mount(wrap);
      };
      vue.onMounted(() => {
        initObserver(callBack);
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createVNode(_sfc_main$3),
          vue.createVNode(_sfc_main$2)
        ]);
      };
    }
  });
  if (/poe\.game\.qq\.com\/trade/.test(window.location.href)) {
    const app = vue.createApp(_sfc_main);
    app.mount(
      (() => {
        const app2 = document.createElement("div");
        app2.id = "poe-trade-plugin";
        document.body.append(app2);
        return app2;
      })()
    );
  }
  if (/apps\.game\.qq\.com/.test(window.location.href)) {
    setTimeout(() => {
      window.parent.location.replace("https://poe.game.qq.com/");
    }, 500);
  }

})(Vue);