// ==UserScript==
// @name        喵喵插件~
// @namespace	https://github.com/jiang-ruo/moescript
// @description 游戏《猫国建设者/喵国建设者/Kittens Game》网页自动化插件（就是外挂），可以在页面->选项->MoeScript中开启/关闭自动化功能
// @version     2.0.2
// @author		jiang
// @author      visnz
// @match       https://likexia.gitee.io/cat-zh/*
// @match		https://zhaolinxu.github.io/cat-zh/*
// @match		https://lolitalibrary.com/maomao/*
// @match		https://kittensgame.com/web/*
// @resource	dragula_css https://cdn.jsdelivr.net/npm/dragula@3.7.3/dist/dragula.min.css
// @grant		unsafeWindow
// @grant		GM_addStyle
// @grant		GM_getResourceText
// @license		GPL-3.0
// 
// @downloadURL https://update.greasyfork.org/scripts/523304/%E5%96%B5%E5%96%B5%E6%8F%92%E4%BB%B6~.user.js
// @updateURL https://update.greasyfork.org/scripts/523304/%E5%96%B5%E5%96%B5%E6%8F%92%E4%BB%B6~.meta.js
// ==/UserScript==
//
//	附猫国建设者百科：https://lolitalibrary.com/wiki
// 
//  源码可以直接访问上方 @namespace 地址
//  frok from: https://github.com/visnz/moescript
//  基于@visnz的版本进行了二开，做一些符合个人喜好的改动，以及适配新的网址
//
// 下面是声明变量：
// game - 页面中自带的game对象
// initGame - 游戏加载完成后，会调用的函数
/* global initGame */
/* global game */
/* global $ */
/* global LZString */

var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _level, _module, _level2, _module2, _data, _Setting_instances, parseVersion_fn, verTo1_0_fn, verTo2_1_fn, verToLast_fn, _upgradeFn, loadConfig_fn, save_fn, _data2, _observe, _观测天空_instances, activate_fn, _光阴似箭_instances, activate_fn2, run_fn, _option, _selected, _val, _options, _span, _numInput, _config, _打猎_instances, getNumInput_fn, numInputEvent_fn, _config2, _备份助手_instances, activate_fn3, _config3, _classLeft, _classRight, _style, _喵喵职业助手_instances, cat2id_fn, load_fn, delete_fn, addLoader_fn, saveJobs_fn, _loaderBtn, addHtml_fn, activate_fn4, _QueueOptionManager_instances, canRun_fn, _radioInstance, _任务队列_instances, radio_get, _queue, _meta, _id, activate_fn5, deactivate_fn, buildQueue_fn, task2Html_fn, getTaskFromGame_fn, loadData_fn, refreshSelect_fn, refresh_fn, addTask_fn, removeTask_fn, _selected2, _sval, _unit, _uval, _a, _config4, _sourceNum, _span2, _generateNum, _generateSelect, _合成木材_instances, loadHtml_fn, deactivate_fn2, _from, _to, getCraftCount_fn, craft_fn, _selected3, _sval2, _unit2, _uval2, _b, _config5, _sourceNum2, _span3, _generateNum2, _generateSelect2, _合成木梁_instances, loadHtml_fn2, deactivate_fn3, _from2, _to2, _selected4, _sval3, _unit3, _uval3, _c, _config6, _sourceNum3, _span4, _generateNum3, _generateSelect3, _合成石板_instances, loadHtml_fn3, deactivate_fn4, _from3, _to3, _selected5, _sval4, _unit4, _uval4, _d, _config7, _sourceNum4, _span5, _generateNum4, _generateSelect4, _合成金属板_instances, loadHtml_fn4, deactivate_fn5, _from4, _to4, _selected6, _sval5, _unit5, _uval5, _config8, _sourceNum5, _span6, _generateNum5, _generateSelect5, _合成钢_instances, loadHtml_fn5, deactivate_fn6, _fromIron, _fromCoal, _to5, _config9, _numInput2, _container, _打猎后合成羊皮纸_instances, loadHtml_fn6, _from5, _to6, _MoeEventManager_instances, run_fn2, pause_fn, tabRender_fn, import_fn, unlock_fn, hunt_fn, addQueue_fn, _interval, _timers, _Moe_instances, startLoop_fn, stopLoop_fn;
const LOG_PREFIX = "喵喵插件~:";
const DEFAULT_LOG_LEVEL = 7;
const LOG_TAG = "moeLogger";
class ConsoleLog {
  constructor(module, level = DEFAULT_LOG_LEVEL) {
    __privateAdd(this, _level);
    //@ts-ignore - 忽略该变量未使用的问题。
    __privateAdd(this, _module);
    __privateSet(this, _level, level ?? DEFAULT_LOG_LEVEL);
    __privateSet(this, _module, module);
  }
  error(...logs) {
    if (__privateGet(this, _level) < 1) return;
    console.error(LOG_PREFIX, ...logs);
  }
  warn(...logs) {
    if (__privateGet(this, _level) < 2) return;
    console.warn(LOG_PREFIX, ...logs);
  }
  info(...logs) {
    if (__privateGet(this, _level) < 3) return;
    console.log(LOG_PREFIX, ...logs);
  }
  http(...logs) {
    if (__privateGet(this, _level) < 4) return;
    this.info(...logs);
  }
  verbose(...logs) {
    if (__privateGet(this, _level) < 5) return;
    this.http(...logs);
  }
  debug(...logs) {
    if (__privateGet(this, _level) < 6) return;
    console.debug(LOG_PREFIX, ...logs);
  }
  silly(...logs) {
    if (__privateGet(this, _level) < 7) return;
    this.debug(...logs);
  }
}
_level = new WeakMap();
_module = new WeakMap();
class MoeLog {
  constructor(module, level = DEFAULT_LOG_LEVEL) {
    __privateAdd(this, _level2);
    //@ts-ignore - 忽略该变量未使用的问题。
    __privateAdd(this, _module2);
    __privateSet(this, _level2, level ?? DEFAULT_LOG_LEVEL);
    __privateSet(this, _module2, module);
  }
  error(msg, noBullet = false) {
    if (__privateGet(this, _level2) < 1) return;
    game.msg(msg, "alert", LOG_TAG, noBullet);
  }
  warn(msg, noBullet = false) {
    if (__privateGet(this, _level2) < 2) return;
    game.msg(msg, "important", LOG_TAG, noBullet);
  }
  info(msg, noBullet = false) {
    if (__privateGet(this, _level2) < 3) return;
    game.msg(msg, "default", LOG_TAG, noBullet);
  }
  http(msg, noBullet = false) {
    if (__privateGet(this, _level2) < 4) return;
    this.info(msg, noBullet);
  }
  verbose(msg, noBullet = false) {
    if (__privateGet(this, _level2) < 5) return;
    this.http(msg, noBullet);
  }
  debug(msg, noBullet = false) {
    if (__privateGet(this, _level2) < 6) return;
    game.msg(msg, "notice", LOG_TAG, noBullet);
  }
  silly(msg, noBullet = false) {
    if (__privateGet(this, _level2) < 7) return;
    game.msg(msg, "urgent", LOG_TAG, noBullet);
  }
}
_level2 = new WeakMap();
_module2 = new WeakMap();
function getLogger(module, type = "console", option2) {
  if (type === "moe") {
    return new MoeLog(module, option2 == null ? void 0 : option2.level);
  } else {
    return new ConsoleLog(module, option2 == null ? void 0 : option2.level);
  }
}
const VERSION = "2.0.2";
const log$8 = getLogger("store", "console");
const STORAGE_KEY = "com.nuclearunicorn.kittengame.plugin.moe";
class Setting {
  constructor() {
    __privateAdd(this, _Setting_instances);
    /**
     * 插件的所有缓存数据
     */
    __publicField(this, "config", { flags: {}, version: VERSION, save: [] });
    /**
     * 当前游戏存档对应的缓存数据
     */
    __privateAdd(this, _data, {
      guid: "",
      time: Date.now(),
      flags: {}
    });
    __privateAdd(this, _upgradeFn, [
      __privateMethod(this, _Setting_instances, verTo1_0_fn),
      __privateMethod(this, _Setting_instances, verTo2_1_fn),
      __privateMethod(this, _Setting_instances, verToLast_fn)
    ]);
  }
  init(game2, options) {
    __privateMethod(this, _Setting_instances, loadConfig_fn).call(this, game2);
    const crossFlag = options.map((opt) => opt.crossSaver ? opt.flag : void 0).filter((flag) => flag !== void 0);
    for (const flag of Object.keys(this.config.flags)) {
      log$8.debug("include:", crossFlag.includes(flag));
      if (!crossFlag.includes(flag)) {
        delete this.config.flags[flag];
      }
    }
    const flags = options.map((opt) => !opt.crossSaver ? opt.flag : void 0).filter((flag) => flag !== void 0);
    for (const flag of Object.keys(__privateGet(this, _data).flags)) {
      log$8.debug("include:", flags.includes(flag));
      if (!flags.includes(flag)) {
        delete __privateGet(this, _data).flags[flag];
      }
    }
    log$8.debug("config:", this.config);
    __privateMethod(this, _Setting_instances, save_fn).call(this);
  }
  /**
   * 
   * @param flag 
   * @returns undefined - 该flag未定义
   */
  flag(flag) {
    if (flag in this.config.flags) return this.config.flags[flag];
    return __privateGet(this, _data).flags[flag];
  }
  set(flag, value, crossSaver) {
    if (value === void 0) {
      this.del(flag, crossSaver);
    } else {
      if (crossSaver) {
        this.config.flags[flag] = value;
      } else {
        __privateGet(this, _data).flags[flag] = value;
      }
      log$8.debug(`设置${crossSaver ? "跨存档" : "当前存档"}选项 ${flag}:`, value);
      __privateMethod(this, _Setting_instances, save_fn).call(this);
    }
  }
  del(flag, crossSaver) {
    if (crossSaver) {
      delete this.config.flags[flag];
    } else {
      delete __privateGet(this, _data).flags[flag];
    }
    log$8.debug(`删除${crossSaver ? "跨存档" : "当前存档"}选项 ${flag}`);
    __privateMethod(this, _Setting_instances, save_fn).call(this);
  }
}
_data = new WeakMap();
_Setting_instances = new WeakSet();
parseVersion_fn = function(version) {
  if (!version) return 0;
  const [major, minor, _] = version.split(".");
  return Number.parseFloat(`${major}.${minor}`);
};
/**
 * 游戏存档升级到1.0
 */
verTo1_0_fn = function(sver, game2) {
  if (sver < 1) {
    log$8.debug("升级存档到1.0.x版本:", this.config);
    const config = {
      flags: this.config.flags,
      version: "1.0.0",
      save: [{
        guid: game2.telemetry.guid,
        time: Date.now(),
        flags: JSON.parse(JSON.stringify(this.config.flags))
      }]
    };
    this.config = config;
  }
};
/**
 * 游戏存档升级到2.1
 */
verTo2_1_fn = function(sver) {
  if (sver < 2.1) {
    log$8.debug("升级存档到2.0.x版本:", this.config);
    for (const flag of Object.keys(this.config.flags)) {
      const val = this.config.flags[flag];
      if (typeof val === "boolean") {
        this.config.flags[flag] = { activate: val };
      }
    }
    for (const save of this.config.save) {
      for (const flag of Object.keys(save.flags)) {
        const val = save.flags[flag];
        if (typeof val === "boolean") {
          save.flags[flag] = { activate: val };
        }
      }
    }
    this.config.version = "2.1.0";
  }
};
/**
 * 版本无实质性变动，仅修改版本号
 */
verToLast_fn = function(sver) {
  if (sver < __privateMethod(this, _Setting_instances, parseVersion_fn).call(this, VERSION)) {
    this.config.version = VERSION;
  }
};
_upgradeFn = new WeakMap();
loadConfig_fn = function(game2) {
  const configStr = localStorage.getItem(STORAGE_KEY);
  let hasSave = false;
  if (configStr) {
    this.config = JSON.parse(configStr);
    const sver = __privateMethod(this, _Setting_instances, parseVersion_fn).call(this, this.config.version);
    if (sver < __privateMethod(this, _Setting_instances, parseVersion_fn).call(this, VERSION)) {
      for (const fn of __privateGet(this, _upgradeFn)) {
        fn.call(this, sver, game2);
      }
    }
    const saves = this.config.save;
    const year = 365 * 24 * 60 * 60 * 1e3;
    for (let i = saves.length - 1; i >= 0; i--) {
      const save = saves[i];
      if (save.guid === game2.telemetry.guid) {
        hasSave = true;
        save.time = Date.now();
        __privateSet(this, _data, save);
      } else {
        if (Date.now() - save.time > year) {
          saves.splice(saves.indexOf(save), 1);
        }
      }
    }
  }
  log$8.debug("hasSave:", hasSave);
  if (!hasSave) {
    __privateGet(this, _data).guid = game2.telemetry.guid;
    this.config.save.push(__privateGet(this, _data));
  }
};
save_fn = function() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
};
const setting = new Setting();
const log$7 = getLogger("view", "console");
const moe$e = getLogger("view", "moe");
class Option {
}
__publicField(Option, "ALL_CLASS", "moe-moescript");
__publicField(Option, "CLASS_PREFIX", "moe-moescript-");
__publicField(Option, "ID_PREFIX", "moe-");
const _MoeDomImpl = class _MoeDomImpl {
  constructor(dom) {
    /**
     * 当前DOM节点本身
     */
    __publicField(this, "ele");
    // [key in K]: Node | undefined;
    __privateAdd(this, _data2, {});
    this.ele = dom;
  }
  set(key, value) {
    __privateGet(this, _data2)[key] = value;
    if (!_MoeDomImpl.fields.includes(key)) {
      Object.defineProperty(this, key, {
        get: () => __privateGet(this, _data2)[key]
      });
    }
  }
  get(key) {
    return __privateGet(this, _data2)[key];
  }
};
_data2 = new WeakMap();
// 定义这个类的属性
__publicField(_MoeDomImpl, "fields", ["ele", "get", "set"]);
let MoeDomImpl = _MoeDomImpl;
function createMoeDom(dom) {
  return new MoeDomImpl(dom);
}
var view;
((view2) => {
  var _sec;
  let initialized = false;
  function init() {
    const OPTION_STYLES = `
		.moe-tabs-header {
			border-bottom: 1px solid #999;
			margin-bottom: 15px;
		}

		.moe-tab {
			display: inline-block;
			padding: 5px 15px;
			margin-right: 5px;
			text-decoration: none;
			color: inherit;
		}

		.moe-tab.moe-active {
			border: 1px solid #999;
			border-bottom: none;
			background: #fff;
		}
			`;
    GM_addStyle(OPTION_STYLES);
    const optionsDiv = $("#optionsDiv");
    const tabsHtmlPrefix = `
			<a id="optionsDialogClose" href="#" class="close" onclick="gamePage.closeOptions()" style="position: absolute; top: 10px; right: 15px;">关闭</a>
			<div class="moe-tabs-header" style="margin: 10px 0;">
				<a href="#" class="moe-tab moe-active" data-tab="moe-game">游戏选项</a>
				<a href="#" class="moe-tab" data-tab="moe-moe">${NAME}</a>
			</div>`;
    const tabsHtmlInner = `<div class="moe-tab-content" id="moe-gameTab" style="display: block;"></div>`;
    const tabsHtmlSuffix = `
			<div class="moe-tab-content" id="moe-moeTab" style="display: none;">
				<!-- 添加更多MoeScript选项 -->
				<p style="color: red">说明: 喵喵插件并不追求完全的自动化，只是提供一些便利功能，提高挂机体验。如果追求完全自动化，建议开启小猫珂学家。</p>
			</div>
		`;
    optionsDiv.wrapInner(tabsHtmlInner);
    optionsDiv.prepend(tabsHtmlPrefix);
    optionsDiv.append(tabsHtmlSuffix);
    $(".moe-tab").on("click", function(e) {
      e.preventDefault();
      const targetTab = $(this).data("tab");
      $(".moe-tab").removeClass("moe-active");
      $(this).addClass("moe-active");
      $(".moe-tab-content").hide();
      $(`#${targetTab}Tab`).show();
    });
    initialized = true;
  }
  view2.init = init;
  class ViewInterval {
    constructor() {
      __privateAdd(this, _sec, {});
    }
    // #min: {[key: string]: Option[]} = {};
    addOption(opt) {
      if (!(opt.script && opt.period)) return;
      __privateGet(this, _sec)[opt.flag] = { time: opt.period.sec(), opt };
    }
    removeOption(opt) {
      if (typeof opt === "string") {
        delete __privateGet(this, _sec)[opt];
      } else {
        delete __privateGet(this, _sec)[opt.flag];
      }
    }
    sec() {
      return () => {
        const flags = Object.keys(__privateGet(this, _sec));
        for (const flag of flags) {
          const opt = __privateGet(this, _sec)[flag];
          if (!opt) continue;
          opt.time--;
          if (opt.time > 0) continue;
          opt.time = opt.opt.period.sec();
          opt.opt.script();
        }
      };
    }
  }
  _sec = new WeakMap();
  view2.optionInterval = new ViewInterval();
  function addOptions(options) {
    if (!initialized) {
      log$7.error("视图未初始化，请先调用view.init()");
    }
    const optionMap = {};
    for (const opt of options) {
      if (!optionMap[opt.panel]) {
        optionMap[opt.panel] = [];
      }
      optionMap[opt.panel].push(opt);
    }
    const moeTab = $("#moe-moeTab");
    const flags = [];
    for (const panel in optionMap) {
      const opts = optionMap[panel].sort((a, b) => (a.index ?? 9999) - (b.index ?? 9999));
      const doms = [];
      for (const opt of opts) {
        if (flags.includes(opt.flag)) {
          moe$e.error(`功能【${opt.name}】无法运行，存在同名缓存键: flag = ${opt.flag}`);
          continue;
        } else {
          flags.push(opt.flag);
        }
        const sval = setting.flag(opt.flag);
        log$7.debug(`选项【${opt.name}】的flag: ${opt.flag}，值:`, sval);
        const p = $(`<p class="${Option.ALL_CLASS}"></p>`);
        const dom = opt.dom(sval, (config, option2) => {
          if (!(option2 == null ? void 0 : option2.justUpdate)) {
            if (config == null ? void 0 : config.activate) {
              moe$e.info(`开启选项【${opt.name}】${opt.description.activate}`);
              view2.optionInterval.addOption(opt);
            } else {
              moe$e.info(`关闭选项【${opt.name}】${opt.description.deactivate}`);
              view2.optionInterval.removeOption(opt.flag);
            }
          }
          setting.set(opt.flag, config, opt.crossSaver ?? false);
        });
        p.append(dom);
        doms.push(p);
        if (sval == null ? void 0 : sval.activate) {
          view2.optionInterval.addOption(opt);
        }
      }
      const div = $(`<div></div>`).append(doms);
      const paneldiv = $(`<div><h4>${panel}</h4></div>`).append(div);
      moeTab.append(paneldiv);
    }
    return view2.optionInterval;
  }
  view2.addOptions = addOptions;
})(view || (view = {}));
class RadioComponent {
  constructor(option2) {
    __publicField(this, "dom");
    __publicField(this, "update", (option2) => {
      this.update.label = option2.label;
    });
    const span = $(`<label style="white-space:nowrap; cursor: pointer; display: inline-block;">
				<input type="checkbox" style="display:inline">
			</label>`);
    const label = document.createTextNode((option2 == null ? void 0 : option2.label) ?? "");
    span.append(label);
    this.dom = createMoeDom(span.get(0));
    this.dom.set("label", label);
    const input = span.find("input");
    this.dom.set("input", input.get(0));
    Object.defineProperty(this.update, "label", {
      get: () => this.dom.label.nodeValue,
      set: (label2) => {
        this.dom.label.nodeValue = label2 ?? "";
      }
    });
  }
  get $dom() {
    return $(this.dom.ele);
  }
  get val() {
    return $(this.dom.input).is(":checked");
  }
  set val(val) {
    $(this.dom.input).prop("checked", val);
  }
  create(config, callback) {
    const input = $(this.dom.input);
    input.prop("checked", config ?? false);
    input.on("change", (e) => {
      const activate = $(e.currentTarget).is(":checked");
      callback(activate);
    });
    return this.$dom;
  }
}
const log$6 = getLogger("option/观测天空", "console");
const moe$d = getLogger("option/观测天空", "moe");
class 观测天空 {
  constructor() {
    __privateAdd(this, _观测天空_instances);
    __publicField(this, "index");
    __publicField(this, "panel", "杂项");
    __publicField(this, "name", "自动观测天文现象");
    __publicField(this, "condition");
    __publicField(this, "description", {
      activate: "出现天文事件时将会自动观测天空",
      deactivate: "停止自动观测天空"
    });
    __publicField(this, "flag", "观测天空");
    __publicField(this, "crossSaver", true);
    __privateAdd(this, _observe);
    __publicField(this, "period");
    __publicField(this, "script");
  }
  dom(config, callback) {
    if (config == null ? void 0 : config.activate) __privateMethod(this, _观测天空_instances, activate_fn).call(this);
    return new RadioComponent({ label: this.name }).create(config == null ? void 0 : config.activate, (acti) => {
      var _a2;
      if (acti) {
        __privateMethod(this, _观测天空_instances, activate_fn).call(this);
      } else {
        (_a2 = __privateGet(this, _observe)) == null ? void 0 : _a2.disconnect();
        __privateSet(this, _observe, void 0);
      }
      callback({ activate: acti });
    });
  }
}
_observe = new WeakMap();
_观测天空_instances = new WeakSet();
/**
 * 选项开启时，进行事件绑定。
 */
activate_fn = function() {
  if (__privateGet(this, _observe)) return;
  __privateSet(this, _observe, new MutationObserver((mutations) => {
    if (mutations.length === 0) {
      log$6.warn("$('#observeButton') MutationObserver没有检测到任何变化!!!");
    } else {
      if (mutations.length > 2) {
        log$6.info(`$('#observeButton') mutations数量: ${mutations.length}`);
        moe$d.error("异常情况，mutatioin大于2，请注意检查");
        log$6.info("mutation:", mutations);
      }
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          const length = mutation.addedNodes.length;
          if (length > 0) {
            if (length > 1) {
              moe$d.error("异常情况，addNodes数量大于1");
              log$6.info("mutation: ", mutation);
            }
            const game2 = Moe.getInstance().game;
            if (!game2.calendar.observeBtn) {
              moe$d.error("脚本异常，为检测到观测天空按钮");
            } else {
              setTimeout(() => {
                moe$d.debug(`检测到天空中出现一种罕见的天文现象，自动进行“观测天空”操作`);
                game2.calendar.observeHandler();
              }, 2e3);
            }
          }
        }
      }
    }
  }));
  __privateGet(this, _observe).observe($("#observeButton")[0], {
    childList: true,
    // 监听子节点变化
    subtree: false,
    // 不监听子节点的子节点
    attributes: false,
    // 不监听属性变化
    characterData: false
    // 不监听文本内容变化
  });
};
const option$c = new 观测天空();
const moe$c = getLogger("option/光阴似箭", "moe");
class 光阴似箭 {
  constructor() {
    __privateAdd(this, _光阴似箭_instances);
    __publicField(this, "index");
    __publicField(this, "panel", "时间");
    __publicField(this, "name", "自动开启【光阴似箭】");
    __publicField(this, "condition", {
      science: ["calendar"]
    });
    __publicField(this, "description", {
      activate: "进入游戏或暂停恢复时，自动开启【光阴似箭】",
      deactivate: ""
    });
    __publicField(this, "flag", "光阴似箭");
    __publicField(this, "crossSaver", true);
    __publicField(this, "period");
    __publicField(this, "script");
  }
  dom(config, callback) {
    if (config == null ? void 0 : config.activate) __privateMethod(this, _光阴似箭_instances, activate_fn2).call(this);
    return new RadioComponent({ label: this.name }).create(config == null ? void 0 : config.activate, (activate) => {
      callback({ activate });
      if (activate) {
        __privateMethod(this, _光阴似箭_instances, activate_fn2).call(this);
      } else {
        const event = Moe.getInstance().event.off;
        event.pause(this.flag);
        event.import(this.flag);
      }
    });
  }
}
_光阴似箭_instances = new WeakSet();
/**
 * 选项开启时，进行事件绑定。
 */
activate_fn2 = function() {
  __privateMethod(this, _光阴似箭_instances, run_fn).call(this);
  const event = Moe.getInstance().event.on;
  event.pause(this.flag, (isPaused) => {
    if (!isPaused) __privateMethod(this, _光阴似箭_instances, run_fn).call(this);
  });
  event.import(this.flag, () => {
    __privateMethod(this, _光阴似箭_instances, run_fn).call(this);
  });
};
/**
 * 执行加速功能
 */
run_fn = function() {
  const game2 = Moe.getInstance().game;
  if (!game2.science.get("calendar").researched) return;
  if (game2.time.isAccelerated) return;
  if (game2.isPaused) return;
  if (game2.resPool.get("temporalFlux").value < 5) return;
  game2.time.isAccelerated = true;
  moe$c.debug("开启【光阴似箭】");
};
const option$b = new 光阴似箭();
const sec = (s) => s * 1e3;
const min = (m) => m * sec(60);
const hour = (h) => h * min(60);
const day = (d) => d * hour(24);
const __sec_for_timeobj = sec;
const __min_for_timeobj = min;
const __hour_for_timeobj = hour;
const __day_for_timeobj = day;
var timeobj;
((timeobj2) => {
  class Time {
    constructor(time) {
      __publicField(this, "__time");
      this.__time = time;
    }
    /**
     * 返回时间的类型
     */
    get type() {
      return this.constructor.name;
    }
    /**
     *
     * @param digits 保留digits位小数
     */
    sec(digits = 0) {
      const sec3 = this.time / 1e3;
      if (digits > 0) {
        const secfixed = sec3.toFixed(digits);
        const secfloat = Number.parseFloat(secfixed);
        return secfloat;
      } else {
        return Math.round(sec3);
      }
    }
    min(digits = 0) {
      const min3 = this.sec() / 60;
      if (digits > 0) {
        const minfixed = min3.toFixed(digits);
        const minfloat = Number.parseFloat(minfixed);
        return minfloat;
      } else {
        return Math.round(min3);
      }
    }
    hour(digits = 0) {
      const hour3 = this.min() / 60;
      if (digits > 0) {
        const hourfixed = hour3.toFixed(digits);
        const hourfloat = Number.parseFloat(hourfixed);
        return hourfloat;
      } else {
        return Math.round(hour3);
      }
    }
    day(digits = 0) {
      const day3 = this.hour() / 24;
      if (digits > 0) {
        const dayfixed = day3.toFixed(digits);
        const dayfloat = Number.parseFloat(dayfixed);
        return dayfloat;
      } else {
        return Math.round(day3);
      }
    }
  }
  timeobj2.Time = Time;
  class Sec extends Time {
    constructor(s) {
      super(s);
    }
    get time() {
      return __sec_for_timeobj(this.__time);
    }
  }
  timeobj2.Sec = Sec;
  class Min extends Time {
    constructor(m) {
      super(m);
    }
    get time() {
      return __min_for_timeobj(this.__time);
    }
  }
  timeobj2.Min = Min;
  class Hour extends Time {
    constructor(h) {
      super(h);
    }
    get time() {
      return __hour_for_timeobj(this.__time);
    }
  }
  timeobj2.Hour = Hour;
  class Day extends Time {
    constructor(d) {
      super(d);
    }
    get time() {
      return __day_for_timeobj(this.__time);
    }
  }
  timeobj2.Day = Day;
  timeobj2.sec = (s) => new Sec(s);
  timeobj2.min = (m) => new Min(m);
  timeobj2.hour = (h) => new Hour(h);
  timeobj2.day = (d) => new Day(d);
})(timeobj || (timeobj = {}));
const moe$b = getLogger("src/option/component/Select");
class SelectComponent {
  constructor(options, option2) {
    __publicField(this, "dom");
    __publicField(this, "update", (option2) => {
      this.update.prelabel = option2.prelabel;
      this.update.label = option2.label;
      this.update.options = option2.options;
    });
    const prelabel = document.createTextNode((option2 == null ? void 0 : option2.prelabel) ?? "");
    const label = document.createTextNode((option2 == null ? void 0 : option2.label) ?? "");
    const select = $(`<select style="display:inline"></select>`);
    const dom = $(`<span style="white-space:nowrap;"></span>`).append(prelabel, select, label);
    this.dom = createMoeDom(dom.get(0));
    this.dom.set("prelabel", prelabel);
    this.dom.set("label", label);
    this.dom.set("select", select.get(0));
    Object.defineProperty(this.update, "prelabel", {
      get: () => this.dom.prelabel.nodeValue,
      set: (prelabel2) => {
        this.dom.prelabel.nodeValue = prelabel2 ?? "";
      }
    });
    Object.defineProperty(this.update, "label", {
      get: () => this.dom.label.nodeValue,
      set: (label2) => {
        this.dom.label.nodeValue = label2 ?? "";
      }
    });
    Object.defineProperty(this.update, "options", {
      get: () => {
        const opts = [];
        const soptions = $(this.dom.select).find("option");
        for (const option22 of soptions) {
          opts.push({
            value: $(option22).val(),
            name: $(option22).text(),
            disable: $(option22).is(":disabled")
          });
        }
        return opts;
      },
      set: (options2) => {
        const select2 = $(this.dom.select);
        select2.empty();
        if (!options2 || options2.length === 0) return;
        let optHtml = "";
        for (const option22 of options2) {
          const disable = option22.disable ? "disabled" : "";
          optHtml += `<option value="${option22.value}" ${disable}>${option22.name}</option>`;
        }
        select2.append(optHtml);
        select2.prop("selectedIndex", 0);
      }
    });
    this.update.options = options;
  }
  get $dom() {
    return $(this.dom.ele);
  }
  get val() {
    return $(this.dom.select).val();
  }
  /**
   * @param value K - 选项的value值
   * @param value number - 选项的index值
   */
  set val(value) {
    const select = $(this.dom.select);
    if (value === void 0) {
      select.prop("selectedIndex", -1);
      return;
    }
    if (typeof value === "number") {
      const opts = select.find("option");
      if (value < 0 || value >= opts.length) {
        const error = `SelectCompoent: 不存在第[${value}]个选项`;
        moe$b.error(error);
        throw new Error(error);
      }
      select.prop("selectedIndex", value);
    } else if (typeof value === "string") {
      select.val(value);
    }
  }
  create(config, callback) {
    const select = $(this.dom.select);
    this.val = config;
    select.on("change", (e) => {
      const selectElem = e.currentTarget;
      const select2 = selectElem.value;
      callback(select2);
    });
    return this.$dom;
  }
}
class NumInputComponent {
  constructor(option2) {
    /**
     * input的最大最小值
     */
    __privateAdd(this, _option);
    __publicField(this, "dom");
    __publicField(this, "update", (option2) => {
      this.update.min = option2.min;
      this.update.max = option2.max;
      this.update.step = option2.step;
      this.update.prelabel = option2.prelabel;
      this.update.label = option2.label;
    });
    var _a2, _b2;
    __privateSet(this, _option, option2 ?? {});
    const prelabel = document.createTextNode((option2 == null ? void 0 : option2.prelabel) ?? "");
    const label = document.createTextNode((option2 == null ? void 0 : option2.label) ?? "");
    const rangePrefx = document.createTextNode("[");
    const rangeMin = document.createTextNode(((_a2 = option2 == null ? void 0 : option2.min) == null ? void 0 : _a2.toString()) ?? "-∞");
    const rangeMid = document.createTextNode(", ");
    const rangeMax = document.createTextNode(((_b2 = option2 == null ? void 0 : option2.max) == null ? void 0 : _b2.toString()) ?? "+∞");
    const rangeSuffix = document.createTextNode("]");
    const range = $(`<span style="color:gray; font-size: 12px;"></span>`).append(rangePrefx, rangeMin, rangeMid, rangeMax, rangeSuffix);
    const inputHtml = `<input type="number" style="width:60px;"
			${(option2 == null ? void 0 : option2.min) ? `min="${option2.min}"` : ""}
			${(option2 == null ? void 0 : option2.max) ? `max="${option2.max}"` : ""}
			${(option2 == null ? void 0 : option2.step) ? `step="${option2.step}"` : ""}>`;
    const input = $(inputHtml);
    const dom = $(`<span style="white-space:nowrap;"></span>`).append(prelabel, input, label, range);
    this.dom = createMoeDom(dom.get(0));
    this.dom.set("prelabel", prelabel);
    this.dom.set("label", label);
    this.dom.set("min", rangeMin);
    this.dom.set("max", rangeMax);
    this.dom.set("input", input.get(0));
    Object.defineProperty(this.update, "min", {
      get: () => {
        var _a3;
        return (_a3 = __privateGet(this, _option)) == null ? void 0 : _a3.min;
      },
      set: (min2) => {
        __privateGet(this, _option)["min"] = min2;
        $(this.dom.input).attr("min", (min2 == null ? void 0 : min2.toString()) ?? "");
        this.dom.min.nodeValue = (min2 == null ? void 0 : min2.toString()) ?? "";
      }
    });
    Object.defineProperty(this.update, "max", {
      get: () => {
        var _a3;
        return (_a3 = __privateGet(this, _option)) == null ? void 0 : _a3.max;
      },
      set: (max) => {
        __privateGet(this, _option)["max"] = max;
        $(this.dom.input).attr("max", (max == null ? void 0 : max.toString()) ?? "");
        this.dom.max.nodeValue = (max == null ? void 0 : max.toString()) ?? "";
      }
    });
    Object.defineProperty(this.update, "step", {
      get: () => $(this.dom.input).attr("step"),
      set: (step) => {
        $(this.dom.input).attr("step", (step == null ? void 0 : step.toString()) ?? "");
      }
    });
    Object.defineProperty(this.update, "prelabel", {
      get: () => this.dom.prelabel.nodeValue,
      set: (prelabel2) => {
        this.dom.prelabel.nodeValue = prelabel2 ?? "";
      }
    });
    Object.defineProperty(this.update, "label", {
      get: () => this.dom.label.nodeValue,
      set: (label2) => {
        this.dom.label.nodeValue = label2 ?? "";
      }
    });
  }
  get $dom() {
    return $(this.dom.ele);
  }
  get val() {
    const input = $(this.dom.input);
    const val = Number(input.val());
    if (isNaN(val)) {
      return NaN;
    }
    return val;
  }
  set val(value) {
    var _a2, _b2;
    const input = $(this.dom.input);
    if (value === void 0 || isNaN(value)) {
      input.val("");
      return;
    }
    if (((_a2 = __privateGet(this, _option)) == null ? void 0 : _a2.min) && value < __privateGet(this, _option).min) {
      value = __privateGet(this, _option).min;
    }
    if (((_b2 = __privateGet(this, _option)) == null ? void 0 : _b2.max) && value > __privateGet(this, _option).max) {
      value = __privateGet(this, _option).max;
    }
    input.val(value.toString());
  }
  create(config, callback) {
    const input = $(this.dom.input);
    this.val = config;
    input.on("change", () => {
      var _a2, _b2;
      const value = this.val;
      if (isNaN(value)) {
        callback(NaN);
      } else {
        let val = value;
        if (((_a2 = __privateGet(this, _option)) == null ? void 0 : _a2.min) && value < __privateGet(this, _option).min) {
          val = __privateGet(this, _option).min;
        }
        if (((_b2 = __privateGet(this, _option)) == null ? void 0 : _b2.max) && value > __privateGet(this, _option).max) {
          val = __privateGet(this, _option).max;
        }
        callback(val);
      }
    });
    return this.$dom;
  }
}
_option = new WeakMap();
const log$5 = getLogger("option/打猎", "console");
const moe$a = getLogger("option/打猎", "moe");
class 打猎Description {
  constructor(selected, val) {
    __privateAdd(this, _selected);
    __privateAdd(this, _val);
    __publicField(this, "deactivate", "停止自动打猎");
    __privateSet(this, _selected, selected);
    __privateSet(this, _val, val);
  }
  get activate() {
    const selected = __privateGet(this, _selected).call(this);
    if (selected === void 0) return "";
    const val = __privateGet(this, _val).call(this);
    if (selected === "threshold") {
      return `喵力达到${val}%时派出所有猎人`;
    } else if (selected === "number") {
      return `可派出${val}次猎人时派出所有猎人`;
    }
    throw new Error("未设置打猎方式");
  }
}
_selected = new WeakMap();
_val = new WeakMap();
const DEFAULT_ACTIVATE = Object.freeze({
  activate: false,
  lastThreshold: 95,
  lastNumber: 1
});
class 打猎 {
  constructor() {
    __privateAdd(this, _打猎_instances);
    __publicField(this, "index");
    __publicField(this, "panel", "杂项");
    __publicField(this, "name", "自动打猎");
    __publicField(this, "condition", {
      // 箭术
      science: ["archery"]
    });
    __publicField(this, "flag", "打猎");
    __publicField(this, "crossSaver", true);
    __privateAdd(this, _options, [
      { value: "", name: "" },
      { value: "threshold", name: "按喵力阈值" },
      { value: "number", name: "按打猎次数" }
    ]);
    __privateAdd(this, _span);
    __privateAdd(this, _numInput);
    __privateAdd(this, _config, { activate: false });
    __publicField(this, "description", new 打猎Description(() => {
      var _a2;
      return (_a2 = __privateGet(this, _config)) == null ? void 0 : _a2.select;
    }, () => {
      var _a2;
      return (_a2 = __privateGet(this, _config)) == null ? void 0 : _a2.val;
    }));
    __publicField(this, "period", timeobj.min(1));
    /**
     * TODO 计算喵力占喵力上限的百分比resMap[manpower] = res.value / res.maxValue
     * TODO 后续添加一个选项，用于平衡贸易和打猎
     */
    __publicField(this, "script", () => {
      if (!__privateGet(this, _config).activate) return false;
      const game2 = Moe.getInstance().game;
      const res = game2.resPool.get("manpower");
      const val = __privateGet(this, _config).val;
      const huntNum = Math.floor(res.value / 100);
      let isdo = false;
      let msg = "";
      if (__privateGet(this, _config).select === "threshold") {
        const threshold = +(res.value / res.maxValue * 100).toFixed(1);
        isdo = threshold >= val;
        msg = `喵力(${threshold}%)达到阈值(${val}%)，执行打猎`;
      } else {
        isdo = huntNum >= val;
        msg = `可打猎次数(${huntNum})已达到设定值(${val})，执行打猎`;
      }
      if (isdo) {
        moe$a.debug(msg);
        game2.village.huntAll();
      }
      return true;
    });
  }
  /**
   * 
   * @param config 
   * @param callback 
   * @returns <select/><span><input/></span>
   */
  dom(config, callback) {
    __privateSet(this, _config, config ? config : JSON.parse(JSON.stringify(DEFAULT_ACTIVATE)));
    const select = new SelectComponent(__privateGet(this, _options), { label: this.name }).create((config == null ? void 0 : config.select) ?? "", (select2) => {
      if (__privateGet(this, _config).select === "threshold") {
        __privateGet(this, _config).lastThreshold = __privateGet(this, _config).val;
      } else if (__privateGet(this, _config).select === "number") {
        __privateGet(this, _config).lastNumber = __privateGet(this, _config).val;
      }
      if (!select2) {
        delete __privateGet(this, _config).select;
        __privateGet(this, _config).activate = false;
      } else {
        if (select2 === "threshold") {
          __privateGet(this, _config).val = __privateGet(this, _config).lastThreshold;
        } else if (select2 === "number") {
          __privateGet(this, _config).val = __privateGet(this, _config).lastNumber;
        }
        __privateGet(this, _config).activate = true;
        __privateGet(this, _config).select = select2;
      }
      log$5.debug("打猎.bind:this.#config:", __privateGet(this, _config));
      __privateMethod(this, _打猎_instances, numInputEvent_fn).call(this, callback);
      callback(JSON.parse(JSON.stringify(__privateGet(this, _config))));
    });
    const span = $(`<span style="margin-left:4px;"></span>`);
    const dom = select.add(span);
    __privateSet(this, _span, span);
    __privateMethod(this, _打猎_instances, numInputEvent_fn).call(this, callback);
    return dom;
  }
}
_options = new WeakMap();
_span = new WeakMap();
_numInput = new WeakMap();
_config = new WeakMap();
_打猎_instances = new WeakSet();
getNumInput_fn = function() {
  if (!__privateGet(this, _config).activate) return;
  if (__privateGet(this, _config).select === "threshold") {
    return new NumInputComponent({ min: 1, max: 100, step: 1 });
  } else if (__privateGet(this, _config).select === "number") {
    return new NumInputComponent({ min: 1, step: 1 });
  }
  return;
};
/**
 * 根据选择事件修改inputHtml
 */
numInputEvent_fn = function(callback) {
  const dom = __privateGet(this, _span);
  dom.empty();
  __privateSet(this, _numInput, __privateMethod(this, _打猎_instances, getNumInput_fn).call(this));
  if (!__privateGet(this, _config).activate) return;
  log$5.debug("渲染打猎数字框，配置: ", __privateGet(this, _config));
  dom.append(__privateGet(this, _numInput).create(__privateGet(this, _config).val, (val) => {
    __privateGet(this, _config).val = val;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config))));
  }));
};
const option$a = new 打猎();
const moe$9 = getLogger("option/备份助手", "moe");
class 备份助手 {
  constructor() {
    __privateAdd(this, _备份助手_instances);
    __publicField(this, "panel", "杂项");
    __publicField(this, "name", "快捷备份");
    __publicField(this, "condition");
    __publicField(this, "description", {
      activate: "在上方添加【保存备份】【导入备份】按钮",
      deactivate: "已恢复游戏页面"
    });
    __publicField(this, "flag", "备份");
    __publicField(this, "crossSaver", true);
    __privateAdd(this, _config2, { activate: false, save: "" });
  }
  dom(config, callback) {
    if (config) __privateSet(this, _config2, config);
    const actcallback = (save) => {
      __privateGet(this, _config2).save = save;
      callback(JSON.parse(JSON.stringify(__privateGet(this, _config2))), { justUpdate: true });
    };
    if (config == null ? void 0 : config.activate) __privateMethod(this, _备份助手_instances, activate_fn3).call(this, actcallback);
    return new RadioComponent({ label: this.name }).create(config == null ? void 0 : config.activate, (activate) => {
      if (activate) {
        __privateGet(this, _config2).activate = true;
        __privateMethod(this, _备份助手_instances, activate_fn3).call(this, actcallback);
      } else {
        __privateGet(this, _config2).activate = false;
        $(`#${Option.ID_PREFIX}${this.flag}backup`).remove();
        $(`#${Option.ID_PREFIX}${this.flag}import`).remove();
      }
      callback(JSON.parse(JSON.stringify(__privateGet(this, _config2))));
    });
  }
}
_config2 = new WeakMap();
_备份助手_instances = new WeakSet();
activate_fn3 = function(callback) {
  $("#topBar .links-block").prepend(`
            <span id="${Option.ID_PREFIX}${this.flag}backup"><a href="#" title="与游戏保存按钮相互独立的备份功能">保存备份</a> |</span>
            <span id="${Option.ID_PREFIX}${this.flag}import"><a href="#" title="将备份导入游戏">导入备份</a> |</span>
        `);
  $(`#${Option.ID_PREFIX}${this.flag}backup a`).on("click", () => {
    const moegame = Moe.getInstance();
    callback(moegame.event.save(), true);
    moe$9.debug("已成功备份游戏存档!");
  });
  $(`#${Option.ID_PREFIX}${this.flag}import a`).on("click", () => {
    if (!__privateGet(this, _config2).save) {
      alert("请先备份游戏数据，才能使用进行导入功能");
      return;
    }
    const game2 = Moe.getInstance().game;
    game2.saveImport(__privateGet(this, _config2).save);
    moe$9.debug("已成功导入备份的游戏存档!");
  });
};
const option$9 = new 备份助手();
class TextInputComponent {
  constructor(option2) {
    __publicField(this, "dom");
    __publicField(this, "update", (option2) => {
      this.update.placeholder = option2.placeholder;
      this.update.prelabel = option2.prelabel;
      this.update.label = option2.label;
    });
    const prelabel = document.createTextNode((option2 == null ? void 0 : option2.prelabel) ?? "");
    const label = document.createTextNode((option2 == null ? void 0 : option2.label) ?? "");
    const input = $(`<input type="text" style="width:120px;"
			${(option2 == null ? void 0 : option2.placeholder) ? `placeholder="${option2 == null ? void 0 : option2.placeholder}"` : ""}/>`);
    const dom = $(`<span style="white-space:nowrap;"></span>`).append(prelabel, input, label);
    this.dom = createMoeDom(dom.get(0));
    this.dom.set("prelabel", prelabel);
    this.dom.set("label", label);
    this.dom.set("input", input.get(0));
    Object.defineProperty(this.update, "prelabel", {
      get: () => this.dom.prelabel.nodeValue,
      set: (prelabel2) => {
        this.dom.prelabel.nodeValue = prelabel2 ?? "";
      }
    });
    Object.defineProperty(this.update, "label", {
      get: () => this.dom.label.nodeValue,
      set: (label2) => {
        this.dom.label.nodeValue = label2 ?? "";
      }
    });
    Object.defineProperty(this.update, "placeholder", {
      get: () => $(this.dom.input).attr("placeholder"),
      set: (placeholder) => {
        $(this.dom.input).attr("placeholder", placeholder ?? "");
      }
    });
  }
  get $dom() {
    return $(this.dom.ele);
  }
  get val() {
    const val = $(this.dom.input).val();
    return val;
  }
  set val(value) {
    const input = $(this.dom.input);
    input.val(value ?? "");
  }
  create(config, callback) {
    const input = $(this.dom.input);
    input.val(config ?? "");
    input.on("change", (e) => {
      const val = $(e.currentTarget).val();
      callback(val ?? "");
    });
    return this.$dom;
  }
}
function compress(data) {
  return LZString.compressToBase64(data);
}
function decompress(data) {
  return LZString.decompressFromBase64(data);
}
const moe$8 = getLogger("option/喵喵职业助手", "moe");
const log$4 = getLogger("option/喵喵职业助手", "console");
class 喵喵职业助手 {
  constructor() {
    __privateAdd(this, _喵喵职业助手_instances);
    __publicField(this, "panel", "杂项");
    __publicField(this, "name", "喵喵职业管理助手");
    __publicField(this, "condition", {
      tab: ["Village"]
    });
    __publicField(this, "description", {
      get activate() {
        const game2 = Moe.getInstance().game;
        const villageName = game2.villageTab.tabName;
        return `请到【${villageName}】中查看`;
      },
      deactivate: "已保存的职业分配数据不会删除"
    });
    __publicField(this, "flag", "喵喵职业助手");
    __publicField(this, "crossSaver");
    __privateAdd(this, _config3, { activate: false, save: [] });
    __privateAdd(this, _classLeft, `${Option.CLASS_PREFIX}${this.flag}-job-panel-left`);
    __privateAdd(this, _classRight, `${Option.CLASS_PREFIX}${this.flag}-right`);
    // 因为游戏的contentDiv左右两侧有10px的padding，所以需要减去20px
    // @ts-ignore
    __privateAdd(this, _style, GM_addStyle(`
		.${__privateGet(this, _classLeft)} {
			width: 60%;
			float: left;
		}
		.${__privateGet(this, _classRight)} {
			width: calc(40% - 20px);
			float: left;
		}
	`));
    // TODO 该功能开启的时候，会导致https://lolitalibrary.com/maomao/#页中第一个按钮变形
    __privateAdd(this, _loaderBtn);
  }
  dom(config, callback) {
    if (config) __privateSet(this, _config3, config);
    const actcallback = () => {
      callback(JSON.parse(JSON.stringify(__privateGet(this, _config3))), { justUpdate: true });
    };
    if (config == null ? void 0 : config.activate) __privateMethod(this, _喵喵职业助手_instances, activate_fn4).call(this, actcallback);
    return new RadioComponent({ label: this.name }).create(config == null ? void 0 : config.activate, (acti) => {
      __privateGet(this, _config3).activate = acti;
      if (acti) {
        __privateMethod(this, _喵喵职业助手_instances, activate_fn4).call(this, actcallback);
      } else {
        const moegame = Moe.getInstance();
        const panel = moegame.game.villageTab.jobsPanel;
        if (panel) {
          const content = $(panel.contentDiv).removeClass(__privateGet(this, _classLeft));
          const right = content.next();
          const clear = right.next();
          right.remove();
          clear.remove();
          $(".loadout").css("float", "right");
        }
        moegame.event.off.render("Village", this.flag);
      }
      callback(JSON.parse(JSON.stringify(__privateGet(this, _config3))));
    });
  }
}
_config3 = new WeakMap();
_classLeft = new WeakMap();
_classRight = new WeakMap();
_style = new WeakMap();
_喵喵职业助手_instances = new WeakSet();
cat2id_fn = function(cat) {
  return `name: ${cat.name} ${cat.surname}
age: ${cat.age}
trait: ${cat.trait.name}
color: ${cat.color}
variety: ${cat.variety}`;
};
load_fn = function(name) {
  const jobData = __privateGet(this, _config3).save.find((job) => job.name === name);
  if (!jobData) {
    moe$8.error("未找到职业配置: " + name);
    return;
  }
  const game2 = Moe.getInstance().game;
  const village = game2.village;
  village.clearJobs(false);
  const jobs = JSON.parse(decompress(jobData.data));
  if (jobData.type === "savebynumber") {
    const jobCount = {};
    for (const job of jobs) {
      jobCount[job.job] = (jobCount[job.job] || 0) + 1;
    }
    log$4.debug("jobCount", jobCount);
    for (const job of Object.keys(jobCount)) {
      village.assignJob(village.getJob(job), jobCount[job]);
    }
  } else if (jobData.type === "savebyname") {
    const kittens = village.sim.kittens;
    for (const kitten of kittens) {
      const id = __privateMethod(this, _喵喵职业助手_instances, cat2id_fn).call(this, kitten);
      const data = jobs.find((data2) => data2.id === id);
      if (data) {
        kitten.job = data.job;
        village.getJob(data.job).value++;
      }
    }
  }
  moe$8.debug("加载职业配置成功: " + name);
};
delete_fn = function(name, callback) {
  moe$8.debug("删除职业配置: " + name);
  __privateGet(this, _config3).save = __privateGet(this, _config3).save.filter((job) => job.name !== name);
  __privateMethod(this, _喵喵职业助手_instances, addLoader_fn).call(this, callback);
};
addLoader_fn = function(callback) {
  const loader = __privateGet(this, _loaderBtn);
  loader.empty();
  for (const job of __privateGet(this, _config3).save) {
    const span = $("<p style='margin-top: 5px; margin-bottom: 5px;'></p>");
    const button = $(`<button>${job.name}(${job.type === "savebynumber" ? "按人数" : "按职业"})(${job.length})</button>`);
    button.on("click", () => __privateMethod(this, _喵喵职业助手_instances, load_fn).call(this, job.name));
    const x = $(`<a style="color: red; cursor: pointer; margin-left: 3px;">[x]</a>`);
    x.on("click", () => {
      __privateMethod(this, _喵喵职业助手_instances, delete_fn).call(this, job.name, callback);
      callback(JSON.parse(JSON.stringify(__privateGet(this, _config3))), true);
    });
    span.append(button);
    span.append(x);
    loader.append(span);
  }
};
saveJobs_fn = function(callback, type, name = "默认") {
  name = name ? name.trim() : "默认";
  const game2 = Moe.getInstance().game;
  const kittens = game2.village.sim.kittens;
  const jobs = [];
  for (const kitten of kittens) {
    jobs.push({
      id: __privateMethod(this, _喵喵职业助手_instances, cat2id_fn).call(this, kitten),
      job: kitten.job
    });
  }
  const jobStr = compress(JSON.stringify(jobs));
  const existingJob = __privateGet(this, _config3).save.find((job) => job.name === name);
  if (existingJob) {
    existingJob.data = jobStr;
    existingJob.type = type;
    existingJob.length = jobs.length;
    __privateGet(this, _config3).save.splice(__privateGet(this, _config3).save.indexOf(existingJob), 1);
    __privateGet(this, _config3).save.unshift(existingJob);
    moe$8.debug(`覆盖职业配置: ${name}，小猫数量: ${jobs.length}`);
  } else {
    __privateGet(this, _config3).save.unshift({
      name,
      type,
      data: jobStr,
      length: jobs.length
    });
    moe$8.debug(`添加职业配置: ${name}，小猫数量: ${jobs.length}`);
  }
  __privateMethod(this, _喵喵职业助手_instances, addLoader_fn).call(this, callback);
};
_loaderBtn = new WeakMap();
addHtml_fn = function(callback) {
  const game2 = Moe.getInstance().game;
  const panel = game2.villageTab.jobsPanel;
  if (!panel) {
    moe$8.error("村庄职业面板未加载");
    return;
  }
  const text = new TextInputComponent({
    prelabel: `保存为: `,
    placeholder: "默认"
  });
  $(text.dom.input).css("width", "120px");
  const content = $(panel.contentDiv).addClass(__privateGet(this, _classLeft));
  const html = $(`<div class="${__privateGet(this, _classRight)}" style="padding-top: 30px;"></div>`);
  const numberBtn = $(`<button>按职业人数</button>`);
  const nameBtn = $(`<button>按小猫职业</button>`);
  const span = $(`<span style="margin-top: 8px;"><label>保存当前职业配置: </label><br/></span>`).append(numberBtn, nameBtn);
  const div = $(`<div></div>`).append(text.$dom, "<br/>", span);
  __privateSet(this, _loaderBtn, $(`<div style="margin-top: 15px;"></div>`));
  html.append(div, __privateGet(this, _loaderBtn));
  content.after(html);
  content.next().after(`<div style="clear:both;"></div>`);
  log$4.debug("loadout", $(".loadout").css("float", ""));
  numberBtn.on("click", () => {
    __privateMethod(this, _喵喵职业助手_instances, saveJobs_fn).call(this, callback, "savebynumber", text.val);
    callback();
  });
  nameBtn.on("click", () => {
    __privateMethod(this, _喵喵职业助手_instances, saveJobs_fn).call(this, callback, "savebyname", text.val);
    callback();
  });
  __privateMethod(this, _喵喵职业助手_instances, addLoader_fn).call(this, callback);
};
activate_fn4 = function(callback) {
  const moegame = Moe.getInstance();
  const village = moegame.game.villageTab;
  if (village.jobsPanel) {
    __privateMethod(this, _喵喵职业助手_instances, addHtml_fn).call(this, callback);
  }
  moegame.event.on.render("Village", this.flag, () => {
    __privateMethod(this, _喵喵职业助手_instances, addHtml_fn).call(this, callback);
  });
};
const option$8 = new 喵喵职业助手();
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var atoa$1 = function atoa(a, n) {
  return Array.prototype.slice.call(a, n);
};
var si = typeof setImmediate === "function", tick;
if (si) {
  tick = function(fn) {
    setImmediate(fn);
  };
} else {
  tick = function(fn) {
    setTimeout(fn, 0);
  };
}
var tickyBrowser = tick;
var ticky = tickyBrowser;
var debounce$1 = function debounce(fn, args, ctx) {
  if (!fn) {
    return;
  }
  ticky(function run() {
    fn.apply(ctx || null, args || []);
  });
};
var atoa2 = atoa$1;
var debounce2 = debounce$1;
var emitter$1 = function emitter(thing, options) {
  var opts = options || {};
  var evt = {};
  if (thing === void 0) {
    thing = {};
  }
  thing.on = function(type, fn) {
    if (!evt[type]) {
      evt[type] = [fn];
    } else {
      evt[type].push(fn);
    }
    return thing;
  };
  thing.once = function(type, fn) {
    fn._once = true;
    thing.on(type, fn);
    return thing;
  };
  thing.off = function(type, fn) {
    var c = arguments.length;
    if (c === 1) {
      delete evt[type];
    } else if (c === 0) {
      evt = {};
    } else {
      var et = evt[type];
      if (!et) {
        return thing;
      }
      et.splice(et.indexOf(fn), 1);
    }
    return thing;
  };
  thing.emit = function() {
    var args = atoa2(arguments);
    return thing.emitterSnapshot(args.shift()).apply(this, args);
  };
  thing.emitterSnapshot = function(type) {
    var et = (evt[type] || []).slice(0);
    return function() {
      var args = atoa2(arguments);
      var ctx = this || thing;
      if (type === "error" && opts.throws !== false && !et.length) {
        throw args.length === 1 ? args[0] : args;
      }
      et.forEach(function emitter3(listen) {
        if (opts.async) {
          debounce2(listen, args, ctx);
        } else {
          listen.apply(ctx, args);
        }
        if (listen._once) {
          thing.off(type, listen);
        }
      });
      return thing;
    };
  };
  return thing;
};
var NativeCustomEvent = commonjsGlobal.CustomEvent;
function useNative() {
  try {
    var p = new NativeCustomEvent("cat", { detail: { foo: "bar" } });
    return "cat" === p.type && "bar" === p.detail.foo;
  } catch (e) {
  }
  return false;
}
var customEvent$1 = useNative() ? NativeCustomEvent : (
  // IE >= 9
  "undefined" !== typeof document && "function" === typeof document.createEvent ? function CustomEvent(type, params) {
    var e = document.createEvent("CustomEvent");
    if (params) {
      e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
    } else {
      e.initCustomEvent(type, false, false, void 0);
    }
    return e;
  } : (
    // IE <= 8
    function CustomEvent2(type, params) {
      var e = document.createEventObject();
      e.type = type;
      if (params) {
        e.bubbles = Boolean(params.bubbles);
        e.cancelable = Boolean(params.cancelable);
        e.detail = params.detail;
      } else {
        e.bubbles = false;
        e.cancelable = false;
        e.detail = void 0;
      }
      return e;
    }
  )
);
var eventmap$1 = [];
var eventname = "";
var ron = /^on/;
for (eventname in commonjsGlobal) {
  if (ron.test(eventname)) {
    eventmap$1.push(eventname.slice(2));
  }
}
var eventmap_1 = eventmap$1;
var customEvent = customEvent$1;
var eventmap = eventmap_1;
var doc$1 = commonjsGlobal.document;
var addEvent = addEventEasy;
var removeEvent = removeEventEasy;
var hardCache = [];
if (!commonjsGlobal.addEventListener) {
  addEvent = addEventHard;
  removeEvent = removeEventHard;
}
var crossvent$1 = {
  add: addEvent,
  remove: removeEvent,
  fabricate: fabricateEvent
};
function addEventEasy(el, type, fn, capturing) {
  return el.addEventListener(type, fn, capturing);
}
function addEventHard(el, type, fn) {
  return el.attachEvent("on" + type, wrap(el, type, fn));
}
function removeEventEasy(el, type, fn, capturing) {
  return el.removeEventListener(type, fn, capturing);
}
function removeEventHard(el, type, fn) {
  var listener = unwrap(el, type, fn);
  if (listener) {
    return el.detachEvent("on" + type, listener);
  }
}
function fabricateEvent(el, type, model) {
  var e = eventmap.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
  if (el.dispatchEvent) {
    el.dispatchEvent(e);
  } else {
    el.fireEvent("on" + type, e);
  }
  function makeClassicEvent() {
    var e2;
    if (doc$1.createEvent) {
      e2 = doc$1.createEvent("Event");
      e2.initEvent(type, true, true);
    } else if (doc$1.createEventObject) {
      e2 = doc$1.createEventObject();
    }
    return e2;
  }
  function makeCustomEvent() {
    return new customEvent(type, { detail: model });
  }
}
function wrapperFactory(el, type, fn) {
  return function wrapper(originalEvent) {
    var e = originalEvent || commonjsGlobal.event;
    e.target = e.target || e.srcElement;
    e.preventDefault = e.preventDefault || function preventDefault() {
      e.returnValue = false;
    };
    e.stopPropagation = e.stopPropagation || function stopPropagation() {
      e.cancelBubble = true;
    };
    e.which = e.which || e.keyCode;
    fn.call(el, e);
  };
}
function wrap(el, type, fn) {
  var wrapper = unwrap(el, type, fn) || wrapperFactory(el, type, fn);
  hardCache.push({
    wrapper,
    element: el,
    type,
    fn
  });
  return wrapper;
}
function unwrap(el, type, fn) {
  var i = find(el, type, fn);
  if (i) {
    var wrapper = hardCache[i].wrapper;
    hardCache.splice(i, 1);
    return wrapper;
  }
}
function find(el, type, fn) {
  var i, item;
  for (i = 0; i < hardCache.length; i++) {
    item = hardCache[i];
    if (item.element === el && item.type === type && item.fn === fn) {
      return i;
    }
  }
}
var cache = {};
var start = "(?:^|\\s)";
var end = "(?:\\s|$)";
function lookupClass(className) {
  var cached = cache[className];
  if (cached) {
    cached.lastIndex = 0;
  } else {
    cache[className] = cached = new RegExp(start + className + end, "g");
  }
  return cached;
}
function addClass(el, className) {
  var current = el.className;
  if (!current.length) {
    el.className = className;
  } else if (!lookupClass(className).test(current)) {
    el.className += " " + className;
  }
}
function rmClass(el, className) {
  el.className = el.className.replace(lookupClass(className), " ").trim();
}
var classes$1 = {
  add: addClass,
  rm: rmClass
};
var emitter2 = emitter$1;
var crossvent = crossvent$1;
var classes = classes$1;
var doc = document;
var documentElement = doc.documentElement;
function dragula(initialContainers, options) {
  var len = arguments.length;
  if (len === 1 && Array.isArray(initialContainers) === false) {
    options = initialContainers;
    initialContainers = [];
  }
  var _mirror;
  var _source;
  var _item;
  var _offsetX;
  var _offsetY;
  var _moveX;
  var _moveY;
  var _initialSibling;
  var _currentSibling;
  var _copy;
  var _renderTimer;
  var _lastDropTarget = null;
  var _grabbed;
  var o = options || {};
  if (o.moves === void 0) {
    o.moves = always;
  }
  if (o.accepts === void 0) {
    o.accepts = always;
  }
  if (o.invalid === void 0) {
    o.invalid = invalidTarget;
  }
  if (o.containers === void 0) {
    o.containers = initialContainers || [];
  }
  if (o.isContainer === void 0) {
    o.isContainer = never;
  }
  if (o.copy === void 0) {
    o.copy = false;
  }
  if (o.copySortSource === void 0) {
    o.copySortSource = false;
  }
  if (o.revertOnSpill === void 0) {
    o.revertOnSpill = false;
  }
  if (o.removeOnSpill === void 0) {
    o.removeOnSpill = false;
  }
  if (o.direction === void 0) {
    o.direction = "vertical";
  }
  if (o.ignoreInputTextSelection === void 0) {
    o.ignoreInputTextSelection = true;
  }
  if (o.mirrorContainer === void 0) {
    o.mirrorContainer = doc.body;
  }
  var drake = emitter2({
    containers: o.containers,
    start: manualStart,
    end: end2,
    cancel,
    remove,
    destroy,
    canMove,
    dragging: false
  });
  if (o.removeOnSpill === true) {
    drake.on("over", spillOver).on("out", spillOut);
  }
  events();
  return drake;
  function isContainer(el) {
    return drake.containers.indexOf(el) !== -1 || o.isContainer(el);
  }
  function events(remove2) {
    var op = remove2 ? "remove" : "add";
    touchy(documentElement, op, "mousedown", grab);
    touchy(documentElement, op, "mouseup", release);
  }
  function eventualMovements(remove2) {
    var op = remove2 ? "remove" : "add";
    touchy(documentElement, op, "mousemove", startBecauseMouseMoved);
  }
  function movements(remove2) {
    var op = remove2 ? "remove" : "add";
    crossvent[op](documentElement, "selectstart", preventGrabbed);
    crossvent[op](documentElement, "click", preventGrabbed);
  }
  function destroy() {
    events(true);
    release({});
  }
  function preventGrabbed(e) {
    if (_grabbed) {
      e.preventDefault();
    }
  }
  function grab(e) {
    _moveX = e.clientX;
    _moveY = e.clientY;
    var ignore = whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
    if (ignore) {
      return;
    }
    var item = e.target;
    var context = canStart(item);
    if (!context) {
      return;
    }
    _grabbed = context;
    eventualMovements();
    if (e.type === "mousedown") {
      if (isInput(item)) {
        item.focus();
      } else {
        e.preventDefault();
      }
    }
  }
  function startBecauseMouseMoved(e) {
    if (!_grabbed) {
      return;
    }
    if (whichMouseButton(e) === 0) {
      release({});
      return;
    }
    if (e.clientX !== void 0 && Math.abs(e.clientX - _moveX) <= (o.slideFactorX || 0) && (e.clientY !== void 0 && Math.abs(e.clientY - _moveY) <= (o.slideFactorY || 0))) {
      return;
    }
    if (o.ignoreInputTextSelection) {
      var clientX = getCoord("clientX", e) || 0;
      var clientY = getCoord("clientY", e) || 0;
      var elementBehindCursor = doc.elementFromPoint(clientX, clientY);
      if (isInput(elementBehindCursor)) {
        return;
      }
    }
    var grabbed = _grabbed;
    eventualMovements(true);
    movements();
    end2();
    start2(grabbed);
    var offset = getOffset(_item);
    _offsetX = getCoord("pageX", e) - offset.left;
    _offsetY = getCoord("pageY", e) - offset.top;
    classes.add(_copy || _item, "gu-transit");
    renderMirrorImage();
    drag(e);
  }
  function canStart(item) {
    if (drake.dragging && _mirror) {
      return;
    }
    if (isContainer(item)) {
      return;
    }
    var handle = item;
    while (getParent(item) && isContainer(getParent(item)) === false) {
      if (o.invalid(item, handle)) {
        return;
      }
      item = getParent(item);
      if (!item) {
        return;
      }
    }
    var source = getParent(item);
    if (!source) {
      return;
    }
    if (o.invalid(item, handle)) {
      return;
    }
    var movable = o.moves(item, source, handle, nextEl(item));
    if (!movable) {
      return;
    }
    return {
      item,
      source
    };
  }
  function canMove(item) {
    return !!canStart(item);
  }
  function manualStart(item) {
    var context = canStart(item);
    if (context) {
      start2(context);
    }
  }
  function start2(context) {
    if (isCopy(context.item, context.source)) {
      _copy = context.item.cloneNode(true);
      drake.emit("cloned", _copy, context.item, "copy");
    }
    _source = context.source;
    _item = context.item;
    _initialSibling = _currentSibling = nextEl(context.item);
    drake.dragging = true;
    drake.emit("drag", _item, _source);
  }
  function invalidTarget() {
    return false;
  }
  function end2() {
    if (!drake.dragging) {
      return;
    }
    var item = _copy || _item;
    drop(item, getParent(item));
  }
  function ungrab() {
    _grabbed = false;
    eventualMovements(true);
    movements(true);
  }
  function release(e) {
    ungrab();
    if (!drake.dragging) {
      return;
    }
    var item = _copy || _item;
    var clientX = getCoord("clientX", e) || 0;
    var clientY = getCoord("clientY", e) || 0;
    var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
    var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
    if (dropTarget && (_copy && o.copySortSource || (!_copy || dropTarget !== _source))) {
      drop(item, dropTarget);
    } else if (o.removeOnSpill) {
      remove();
    } else {
      cancel();
    }
  }
  function drop(item, target) {
    var parent = getParent(item);
    if (_copy && o.copySortSource && target === _source) {
      parent.removeChild(_item);
    }
    if (isInitialPlacement(target)) {
      drake.emit("cancel", item, _source, _source);
    } else {
      drake.emit("drop", item, target, _source, _currentSibling);
    }
    cleanup();
  }
  function remove() {
    if (!drake.dragging) {
      return;
    }
    var item = _copy || _item;
    var parent = getParent(item);
    if (parent) {
      parent.removeChild(item);
    }
    drake.emit(_copy ? "cancel" : "remove", item, parent, _source);
    cleanup();
  }
  function cancel(revert) {
    if (!drake.dragging) {
      return;
    }
    var reverts = arguments.length > 0 ? revert : o.revertOnSpill;
    var item = _copy || _item;
    var parent = getParent(item);
    var initial = isInitialPlacement(parent);
    if (initial === false && reverts) {
      if (_copy) {
        if (parent) {
          parent.removeChild(_copy);
        }
      } else {
        _source.insertBefore(item, _initialSibling);
      }
    }
    if (initial || reverts) {
      drake.emit("cancel", item, _source, _source);
    } else {
      drake.emit("drop", item, parent, _source, _currentSibling);
    }
    cleanup();
  }
  function cleanup() {
    var item = _copy || _item;
    ungrab();
    removeMirrorImage();
    if (item) {
      classes.rm(item, "gu-transit");
    }
    if (_renderTimer) {
      clearTimeout(_renderTimer);
    }
    drake.dragging = false;
    if (_lastDropTarget) {
      drake.emit("out", item, _lastDropTarget, _source);
    }
    drake.emit("dragend", item);
    _source = _item = _copy = _initialSibling = _currentSibling = _renderTimer = _lastDropTarget = null;
  }
  function isInitialPlacement(target, s) {
    var sibling;
    if (s !== void 0) {
      sibling = s;
    } else if (_mirror) {
      sibling = _currentSibling;
    } else {
      sibling = nextEl(_copy || _item);
    }
    return target === _source && sibling === _initialSibling;
  }
  function findDropTarget(elementBehindCursor, clientX, clientY) {
    var target = elementBehindCursor;
    while (target && !accepted()) {
      target = getParent(target);
    }
    return target;
    function accepted() {
      var droppable = isContainer(target);
      if (droppable === false) {
        return false;
      }
      var immediate = getImmediateChild(target, elementBehindCursor);
      var reference = getReference(target, immediate, clientX, clientY);
      var initial = isInitialPlacement(target, reference);
      if (initial) {
        return true;
      }
      return o.accepts(_item, target, _source, reference);
    }
  }
  function drag(e) {
    if (!_mirror) {
      return;
    }
    e.preventDefault();
    var clientX = getCoord("clientX", e) || 0;
    var clientY = getCoord("clientY", e) || 0;
    var x = clientX - _offsetX;
    var y = clientY - _offsetY;
    _mirror.style.left = x + "px";
    _mirror.style.top = y + "px";
    var item = _copy || _item;
    var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
    var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
    var changed = dropTarget !== null && dropTarget !== _lastDropTarget;
    if (changed || dropTarget === null) {
      out();
      _lastDropTarget = dropTarget;
      over();
    }
    var parent = getParent(item);
    if (dropTarget === _source && _copy && !o.copySortSource) {
      if (parent) {
        parent.removeChild(item);
      }
      return;
    }
    var reference;
    var immediate = getImmediateChild(dropTarget, elementBehindCursor);
    if (immediate !== null) {
      reference = getReference(dropTarget, immediate, clientX, clientY);
    } else if (o.revertOnSpill === true && !_copy) {
      reference = _initialSibling;
      dropTarget = _source;
    } else {
      if (_copy && parent) {
        parent.removeChild(item);
      }
      return;
    }
    if (reference === null && changed || reference !== item && reference !== nextEl(item)) {
      _currentSibling = reference;
      dropTarget.insertBefore(item, reference);
      drake.emit("shadow", item, dropTarget, _source);
    }
    function moved(type) {
      drake.emit(type, item, _lastDropTarget, _source);
    }
    function over() {
      if (changed) {
        moved("over");
      }
    }
    function out() {
      if (_lastDropTarget) {
        moved("out");
      }
    }
  }
  function spillOver(el) {
    classes.rm(el, "gu-hide");
  }
  function spillOut(el) {
    if (drake.dragging) {
      classes.add(el, "gu-hide");
    }
  }
  function renderMirrorImage() {
    if (_mirror) {
      return;
    }
    var rect = _item.getBoundingClientRect();
    _mirror = _item.cloneNode(true);
    _mirror.style.width = getRectWidth(rect) + "px";
    _mirror.style.height = getRectHeight(rect) + "px";
    classes.rm(_mirror, "gu-transit");
    classes.add(_mirror, "gu-mirror");
    o.mirrorContainer.appendChild(_mirror);
    touchy(documentElement, "add", "mousemove", drag);
    classes.add(o.mirrorContainer, "gu-unselectable");
    drake.emit("cloned", _mirror, _item, "mirror");
  }
  function removeMirrorImage() {
    if (_mirror) {
      classes.rm(o.mirrorContainer, "gu-unselectable");
      touchy(documentElement, "remove", "mousemove", drag);
      getParent(_mirror).removeChild(_mirror);
      _mirror = null;
    }
  }
  function getImmediateChild(dropTarget, target) {
    var immediate = target;
    while (immediate !== dropTarget && getParent(immediate) !== dropTarget) {
      immediate = getParent(immediate);
    }
    if (immediate === documentElement) {
      return null;
    }
    return immediate;
  }
  function getReference(dropTarget, target, x, y) {
    var horizontal = o.direction === "horizontal";
    var reference = target !== dropTarget ? inside() : outside();
    return reference;
    function outside() {
      var len2 = dropTarget.children.length;
      var i;
      var el;
      var rect;
      for (i = 0; i < len2; i++) {
        el = dropTarget.children[i];
        rect = el.getBoundingClientRect();
        if (horizontal && rect.left + rect.width / 2 > x) {
          return el;
        }
        if (!horizontal && rect.top + rect.height / 2 > y) {
          return el;
        }
      }
      return null;
    }
    function inside() {
      var rect = target.getBoundingClientRect();
      if (horizontal) {
        return resolve(x > rect.left + getRectWidth(rect) / 2);
      }
      return resolve(y > rect.top + getRectHeight(rect) / 2);
    }
    function resolve(after) {
      return after ? nextEl(target) : target;
    }
  }
  function isCopy(item, container) {
    return typeof o.copy === "boolean" ? o.copy : o.copy(item, container);
  }
}
function touchy(el, op, type, fn) {
  var touch = {
    mouseup: "touchend",
    mousedown: "touchstart",
    mousemove: "touchmove"
  };
  var pointers = {
    mouseup: "pointerup",
    mousedown: "pointerdown",
    mousemove: "pointermove"
  };
  var microsoft = {
    mouseup: "MSPointerUp",
    mousedown: "MSPointerDown",
    mousemove: "MSPointerMove"
  };
  if (commonjsGlobal.navigator.pointerEnabled) {
    crossvent[op](el, pointers[type], fn);
  } else if (commonjsGlobal.navigator.msPointerEnabled) {
    crossvent[op](el, microsoft[type], fn);
  } else {
    crossvent[op](el, touch[type], fn);
    crossvent[op](el, type, fn);
  }
}
function whichMouseButton(e) {
  if (e.touches !== void 0) {
    return e.touches.length;
  }
  if (e.which !== void 0 && e.which !== 0) {
    return e.which;
  }
  if (e.buttons !== void 0) {
    return e.buttons;
  }
  var button = e.button;
  if (button !== void 0) {
    return button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
  }
}
function getOffset(el) {
  var rect = el.getBoundingClientRect();
  return {
    left: rect.left + getScroll("scrollLeft", "pageXOffset"),
    top: rect.top + getScroll("scrollTop", "pageYOffset")
  };
}
function getScroll(scrollProp, offsetProp) {
  if (typeof commonjsGlobal[offsetProp] !== "undefined") {
    return commonjsGlobal[offsetProp];
  }
  if (documentElement.clientHeight) {
    return documentElement[scrollProp];
  }
  return doc.body[scrollProp];
}
function getElementBehindPoint(point, x, y) {
  point = point || {};
  var state = point.className || "";
  var el;
  point.className += " gu-hide";
  el = doc.elementFromPoint(x, y);
  point.className = state;
  return el;
}
function never() {
  return false;
}
function always() {
  return true;
}
function getRectWidth(rect) {
  return rect.width || rect.right - rect.left;
}
function getRectHeight(rect) {
  return rect.height || rect.bottom - rect.top;
}
function getParent(el) {
  return el.parentNode === doc ? null : el.parentNode;
}
function isInput(el) {
  return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || isEditable(el);
}
function isEditable(el) {
  if (!el) {
    return false;
  }
  if (el.contentEditable === "false") {
    return false;
  }
  if (el.contentEditable === "true") {
    return true;
  }
  return isEditable(getParent(el));
}
function nextEl(el) {
  return el.nextElementSibling || manually();
  function manually() {
    var sibling = el;
    do {
      sibling = sibling.nextSibling;
    } while (sibling && sibling.nodeType !== 1);
    return sibling;
  }
}
function getEventHost(e) {
  if (e.targetTouches && e.targetTouches.length) {
    return e.targetTouches[0];
  }
  if (e.changedTouches && e.changedTouches.length) {
    return e.changedTouches[0];
  }
  return e;
}
function getCoord(coord, e) {
  var host = getEventHost(e);
  var missMap = {
    pageX: "clientX",
    // IE8
    pageY: "clientY"
    // IE8
  };
  if (coord in missMap && !(coord in host) && missMap[coord] in host) {
    coord = missMap[coord];
  }
  return host[coord];
}
var dragula_1 = dragula;
const dragula$1 = /* @__PURE__ */ getDefaultExportFromCjs(dragula_1);
const log$3 = getLogger("src/option/任务队列", "console");
const moe$7 = getLogger("src/option/任务队列", "moe");
class Folder extends Array {
  constructor(id, ...tasks) {
    super(...tasks);
    __publicField(this, "id");
    this.id = id;
  }
}
class QueueOptionManager {
  constructor() {
    __privateAdd(this, _QueueOptionManager_instances);
    __publicField(this, "__options", []);
    this.__options = Queue.load();
  }
  get panels() {
    const rs = [];
    for (const option2 of this.__options) {
      if (!rs.includes(option2.panel)) {
        if (__privateMethod(this, _QueueOptionManager_instances, canRun_fn).call(this, option2)) {
          rs.push(option2.panel);
        }
      }
    }
    return rs;
  }
  panel(panel) {
    const rs = [];
    for (const option2 of this.__options) {
      if (option2.panel === panel) {
        if (__privateMethod(this, _QueueOptionManager_instances, canRun_fn).call(this, option2)) {
          rs.push(option2);
        }
      }
    }
    rs.sort((a, b) => (a.index ?? Number.MAX_SAFE_INTEGER) - (b.index ?? Number.MAX_SAFE_INTEGER));
    return rs;
  }
  flag(flag) {
    for (const option2 of this.__options) {
      if (option2.flag === flag) {
        return option2;
      }
    }
    return void 0;
  }
}
_QueueOptionManager_instances = new WeakSet();
canRun_fn = function(opt) {
  if ("onceable" in opt && "once" in opt && "repeat" in opt && "until" in opt) {
    moe$7.error(`【${NAME}】插件异常！队列任务不能同时支持onceable和repeatable`);
    return false;
  }
  if ("onceable" in opt && "once" in opt) return true;
  if ("repeat" in opt && "until" in opt) return true;
  return false;
};
class 任务队列 {
  constructor() {
    __privateAdd(this, _任务队列_instances);
    __publicField(this, "panel", "杂项");
    __publicField(this, "description", {
      get activate() {
        const game2 = Moe.getInstance().game;
        if (game2.time.queue) {
          return "任务队列支持并行任务";
        } else {
          return "";
        }
      },
      get deactivate() {
        const game2 = Moe.getInstance().game;
        if (game2.time.queue) {
          return `【${NAME}】的任务将会从队列中删除`;
        } else {
          return "所有的任务都将被清空";
        }
      }
    });
    __publicField(this, "flag", "任务队列");
    __privateAdd(this, _radioInstance);
    __publicField(this, "crossSaver", false);
    /**
     * 该字段用于在浏览器控制台显示option选项
     */
    __publicField(this, "queueOption");
    __privateAdd(this, _queue);
    __privateAdd(this, _meta, (() => {
      const meta = {
        containerId: Option.ID_PREFIX + "rightTabQueue",
        btnId: Option.ID_PREFIX + "queueLink",
        queueAdderId: Option.ID_PREFIX + `${this.flag}-queue-adder`,
        folderClass: Option.CLASS_PREFIX + `${this.flag}-folder`,
        folderActiveClass: Option.CLASS_PREFIX + `${this.flag}-folder-active`,
        dataContainerClass: Option.CLASS_PREFIX + `${this.flag}-container`,
        folderProp: `moe-${this.flag}-data-id`,
        css: "",
        /**
         * 容器的模板
         */
        container: {},
        // 
        taskClass: Option.CLASS_PREFIX + `${this.flag}-task`,
        taskProp: `moe-${this.flag}-task-id`,
        typeOption: [
          { name: "合成x次", value: "time" },
          { name: "合成到x", value: "until" }
        ]
      };
      meta.css = `
.${meta.folderActiveClass} {
    --folder-bg: #ffaecb !important;
    --folder-border-color: #ff98be !important;
}
.${meta.folderClass} {
    --folder-width: 35px;
    --folder-height: 15px;
    --folder-border-radius: 2px;
    --folder-bg: #cccccc;
    --folder-border-color: #cccccc;
    --min-height: 1em; /* 最小高度为1em */

    position: relative;
    margin: calc(var(--folder-height) + 2px) auto 0;
    border-radius: 0 var(--folder-border-radius) var(--folder-border-radius) var(--folder-border-radius);
    border: 1px solid var(--folder-border-color);
}
.${meta.folderClass}::before {
    position: absolute;
    top: calc(0px - var(--folder-height));
    left: 0;
    background-color: var(--folder-bg);
    width: var(--folder-width);
    height: var(--folder-height);
    border-radius: var(--folder-border-radius) 0 0 0;
    content: '';
    cursor: move;
}
.${meta.folderClass}::after {
    position: absolute;
    top: calc(0px - var(--folder-height));
    left: var(--folder-width);
    /* height: var(--folder-height); */
    border-top: var(--folder-height) solid white;
    border-left: var(--folder-height) solid var(--folder-bg);
    content: '';
    cursor: move;
}
.${meta.dataContainerClass} {
    min-height: var(--min-height);
}
.${meta.taskClass} {
    display: flex;
}

.${meta.taskClass}::before {
    content: "";
    display: block;
    width: 20px;
    cursor: move;
    user-select: none;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16"><path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>');
    background-repeat: repeat-y;
    background-size: 20px 24px;
}
.${meta.taskClass}>p{
    margin: 2px;
    width: 100%;
}
.${meta.taskClass}>p>span {
    cursor: pointer;
}
        `;
      meta.container = {
        get: (id) => {
          return $(`.${meta.folderClass}[${meta.folderProp}="${id}"]`);
        },
        id: (id) => {
          return function(strs, ...values) {
            const strarr = [];
            for (let i = 0; i < strs.length; i++) {
              strarr.push(strs[i]);
              if (values[i]) {
                strarr.push(values[i]);
              }
            }
            const html = strarr.join("");
            return `<div class="${meta.folderClass}" ${meta.folderProp}="${id}">
                        <div class="${meta.dataContainerClass}">
                            ${html}
                        </div>
                    </div>`;
          };
        }
      };
      return meta;
    })());
    __privateAdd(this, _id, function* () {
      let i = 1;
      while (true) {
        yield i++;
      }
    }());
    __publicField(this, "period", timeobj.sec(1));
    __publicField(this, "script", () => {
      const tasks = [...__privateGet(this, _queue).task[0]];
      const gqueue = Moe.getInstance().game.time.queue;
      for (const task of tasks) {
        if (task.type === "MoeTask") {
          const meta = task.meta;
          const opt = __privateGet(this, _queue).queueOption.flag(meta.flag);
          if (meta.type === "once") {
            if ("onceable" in opt) {
              if (opt.onceable && opt.once()) {
                __privateMethod(this, _任务队列_instances, removeTask_fn).call(this, task.id);
              }
            } else {
              moe$7.error("任务队列中选项错误，详细信息见控制台");
              log$3.error("任务队列中选项错误: ", task);
              __privateMethod(this, _任务队列_instances, removeTask_fn).call(this, task.id);
            }
          } else if (meta.type === "time") {
            if ("repeat" in opt) {
              const time = opt.repeat(meta.value);
              if (meta.value - time > 0) {
                meta.value -= time;
              } else {
                __privateMethod(this, _任务队列_instances, removeTask_fn).call(this, task.id);
              }
            } else {
              moe$7.error("任务队列中选项错误，详细信息见控制台");
              log$3.error("任务队列中选项错误: ", task);
              __privateMethod(this, _任务队列_instances, removeTask_fn).call(this, task.id);
            }
          } else if (meta.type === "until") {
            if ("until" in opt) {
              if (opt.until(meta.value)) {
                __privateMethod(this, _任务队列_instances, removeTask_fn).call(this, task.id);
              }
            } else {
              moe$7.error("任务队列中选项错误，详细信息见控制台");
              log$3.error("任务队列中选项错误: ", task);
              __privateMethod(this, _任务队列_instances, removeTask_fn).call(this, task.id);
            }
          }
        } else if (task.type === "GameTask") {
          const olength = gqueue.queueItems.length;
          gqueue.queueItems.push(task.meta);
          gqueue.update();
          if (gqueue.queueItems.length > olength) {
            gqueue.queueItems.pop();
          } else {
            __privateMethod(this, _任务队列_instances, removeTask_fn).call(this, task.id);
          }
        } else {
          moe$7.error("任务队列中的任务类型错误，详细信息见控制台");
          log$3.error("任务队列中的任务类型错误: ", task);
        }
      }
      return true;
    });
  }
  get name() {
    const game2 = Moe.getInstance().game;
    if (game2.time.queue) {
      return "任务队列增强";
    } else {
      return "任务队列";
    }
  }
  dom(config, callback) {
    const activateCallback = (task) => {
      callback({ activate: true, task }, { justUpdate: true });
    };
    if (config == null ? void 0 : config.activate) {
      __privateMethod(this, _任务队列_instances, activate_fn5).call(this, config.task, activateCallback);
    }
    return __privateGet(this, _任务队列_instances, radio_get).create(config == null ? void 0 : config.activate, (activate) => {
      var _a2;
      if (activate) {
        __privateMethod(this, _任务队列_instances, activate_fn5).call(this, [], activateCallback);
      } else {
        __privateMethod(this, _任务队列_instances, deactivate_fn).call(this);
      }
      callback({ activate, task: (_a2 = __privateGet(this, _queue)) == null ? void 0 : _a2.task });
    });
  }
  /**
   * 该方法用于在浏览器控制台显示option选项
   */
  get options() {
    var _a2;
    return (_a2 = __privateGet(this, _queue)) == null ? void 0 : _a2.queueOption;
  }
  /**
   * 该字段用于在浏览器控制台显示task选项
   */
  get task() {
    var _a2;
    return (_a2 = __privateGet(this, _queue)) == null ? void 0 : _a2.task;
  }
}
_radioInstance = new WeakMap();
_任务队列_instances = new WeakSet();
radio_get = function() {
  if (!__privateGet(this, _radioInstance)) {
    __privateSet(this, _radioInstance, new RadioComponent({ label: this.name }));
  }
  return __privateGet(this, _radioInstance);
};
_queue = new WeakMap();
_meta = new WeakMap();
_id = new WeakMap();
activate_fn5 = function(tasks, callback) {
  __privateMethod(this, _任务队列_instances, buildQueue_fn).call(this, callback);
  __privateMethod(this, _任务队列_instances, loadData_fn).call(this, tasks);
};
deactivate_fn = function() {
  var _a2, _b2, _c2, _d2, _e, _f;
  const event = Moe.getInstance().event;
  event.off.queueAdd.before(this.flag);
  event.off.queueAdd.after(this.flag);
  event.off.import(this.flag);
  if (__privateGet(this, _queue)) {
    const game2 = Moe.getInstance().game;
    if (game2.time.queue) {
      const queueItems = [];
      for (const folder of __privateGet(this, _queue).task) {
        for (const task of folder) {
          if (task.type === "GameTask") queueItems.push(task.meta);
        }
      }
      for (const task of queueItems) {
        game2.time.queue.addToQueue(task.name, task.type, task.label);
      }
      if (game2.time.queue.queueItems.length > 0) {
        game2.save();
      }
    }
    $(`#${__privateGet(this, _meta).containerId}`).remove();
    if (game2.time.queue) {
      $("#queueViewport>.queue-container[data-reactid='.2']>div:nth-of-type(2)[data-reactid='.2.4']").removeAttr("style");
    } else {
      $(`#${__privateGet(this, _meta).btnId}`).remove();
      $("#rightTabLog").removeAttr("style");
      $(`#logLink`).off("click", __privateGet(this, _queue).logclick);
    }
    (_b2 = (_a2 = __privateGet(this, _queue)) == null ? void 0 : _a2.css) == null ? void 0 : _b2.remove();
    (_d2 = (_c2 = __privateGet(this, _queue)) == null ? void 0 : _c2.containerDrake) == null ? void 0 : _d2.destroy();
    (_f = (_e = __privateGet(this, _queue)) == null ? void 0 : _e.taskDrake) == null ? void 0 : _f.destroy();
    __privateSet(this, _queue, void 0);
    this.queueOption = void 0;
  }
};
/**
 * 构建队列
 * 注册事件+队列html
 * @param isload 是否是加载存档时调用
 * @returns 
 */
buildQueue_fn = function(callback) {
  if (__privateGet(this, _queue)) return;
  const css = GM_addStyle(GM_getResourceText("dragula_css") + __privateGet(this, _meta).css);
  const queueOption = new QueueOptionManager();
  this.queueOption = queueOption;
  const panelOption = [];
  for (const panel of queueOption.panels) {
    panelOption.push({
      value: panel,
      name: panel
    });
  }
  const optOption = [];
  for (const opt of queueOption.panel(panelOption[0].value)) {
    optOption.push({
      name: opt.label,
      value: opt.flag
    });
  }
  __privateSet(this, _queue, {
    task: [],
    queueOption,
    callback,
    css,
    panelSelector: new SelectComponent(panelOption),
    optionSelector: new SelectComponent(optOption),
    typeSelector: new SelectComponent(__privateGet(this, _meta).typeOption),
    numInput: new NumInputComponent({ min: 1, step: 1, prelabel: "x = " })
  });
  const mgame = Moe.getInstance();
  const event = mgame.event;
  const game2 = mgame.game;
  event.on.queueAdd.before(this.flag, () => {
    const g = Moe.getInstance().game;
    const tasks = [...g.time.queue.queueItems];
    g.time.queue.queueItems.length = 0;
    const e = Moe.getInstance().event;
    e.on.queueAdd.afterOnce(this.flag, () => {
      const gtasks = __privateMethod(this, _任务队列_instances, getTaskFromGame_fn).call(this);
      __privateMethod(this, _任务队列_instances, addTask_fn).call(this, ...gtasks);
      __privateGet(this, _queue).callback(JSON.parse(JSON.stringify(__privateGet(this, _queue).task)));
      g.time.queue.queueItems.push(...tasks);
    });
  });
  event.on.import(this.flag, () => {
    __privateMethod(this, _任务队列_instances, loadData_fn).call(this);
  });
  if (game2.time.queue) {
    $("#queueViewport>.queue-container[data-reactid='.2']>div:nth-of-type(2)[data-reactid='.2.4']").hide();
    $("#queueViewport>.queue-container[data-reactid='.2']").append(`<div id="${__privateGet(this, _meta).containerId}"></div>`);
  } else {
    $(".right-tab-header").append(`<a id="${__privateGet(this, _meta).btnId}" href="#">队列</a>`);
    $("#rightColumn").append(`<div id="${__privateGet(this, _meta).containerId}" style="display: none;"></div>`);
    $(`#${__privateGet(this, _meta).btnId}`).on("click", () => {
      $("#rightTabLog").hide();
      $(`#${__privateGet(this, _meta).containerId}`).show();
    });
    __privateGet(this, _queue).logclick = () => {
      $("#rightTabLog").show();
      $(`#${__privateGet(this, _meta).containerId}`).hide();
    };
    $(`#logLink`).on("click", __privateGet(this, _queue).logclick);
  }
  const container = $(`#${__privateGet(this, _meta).containerId}`);
  const addBtn = $("<button>添加</button>");
  const queueAdder = $(`<div></div>`).append(
    __privateGet(this, _queue).panelSelector.$dom,
    __privateGet(this, _queue).optionSelector.$dom,
    "<br/>",
    __privateGet(this, _queue).typeSelector.$dom,
    __privateGet(this, _queue).numInput.$dom,
    addBtn
  );
  container.append(queueAdder);
  __privateMethod(this, _任务队列_instances, refreshSelect_fn).call(this);
  __privateGet(this, _queue).panelSelector.create(panelOption[0].value, (select) => {
    const options = __privateGet(this, _queue).queueOption.panel(select);
    const opts = [];
    for (const opt of options) {
      opts.push({
        name: opt.label,
        value: opt.flag
      });
    }
    __privateGet(this, _queue).optionSelector.update.options = opts;
    __privateMethod(this, _任务队列_instances, refreshSelect_fn).call(this);
  });
  __privateGet(this, _queue).optionSelector.create(optOption[0].value, (select) => {
    __privateMethod(this, _任务队列_instances, refreshSelect_fn).call(this, select);
  });
  addBtn.on("click", () => {
    const option2 = __privateGet(this, _queue).queueOption.flag(__privateGet(this, _queue).optionSelector.val);
    if (!option2) {
      moe$7.error(`【${this.name}】插件异常！选择的OptionFlag在Option中不存在`);
      return;
    }
    const once = "once" in option2 ? option2.once : false;
    const repeat = "repeat" in option2 && "until" in option2;
    if (once && repeat) {
      moe$7.error(`【${this.name}】插件异常！${option2.flag}既可以once，又可以repeat`);
      return;
    }
    __privateMethod(this, _任务队列_instances, addTask_fn).call(this, {
      type: "MoeTask",
      id: __privateGet(this, _id).next().value,
      meta: {
        flag: option2.flag,
        type: repeat ? __privateGet(this, _queue).typeSelector.val : "once",
        value: repeat ? __privateGet(this, _queue).numInput.val : 1
      }
    });
    __privateGet(this, _queue).callback(JSON.parse(JSON.stringify(__privateGet(this, _queue).task)));
  });
  const cdrake = dragula$1([container[0]], {
    // 没有用到的入参，以_开头(eslint)
    moves: (_el, _container2, handle) => {
      return handle ? $(handle).hasClass(__privateGet(this, _meta).folderClass) : false;
    }
  });
  cdrake.on("drop", (el, _target, _source, sibling) => {
    const id = Number.parseInt(el.getAttribute(__privateGet(this, _meta).folderProp));
    const index = __privateGet(this, _queue).task.findIndex((folder2) => folder2.id === id);
    const folder = __privateGet(this, _queue).task[index];
    __privateGet(this, _queue).task.splice(index, 1);
    if (sibling) {
      const sid = Number.parseInt(sibling.getAttribute(__privateGet(this, _meta).folderProp));
      const sindex = __privateGet(this, _queue).task.findIndex((folder2) => folder2.id === sid);
      __privateGet(this, _queue).task.splice(sindex, 0, folder);
    } else {
      __privateGet(this, _queue).task.push(folder);
    }
    __privateMethod(this, _任务队列_instances, refresh_fn).call(this);
    __privateGet(this, _queue).callback(JSON.parse(JSON.stringify(__privateGet(this, _queue).task)));
  });
  __privateGet(this, _queue).containerDrake = cdrake;
  const tdrake = dragula$1($(`.${__privateGet(this, _meta).dataContainerClass}`).toArray(), {
    moves: (_el, _container2, handle) => {
      return handle ? $(handle).hasClass(__privateGet(this, _meta).taskClass) : false;
    }
  });
  tdrake.on("drop", (el, target, source, sibling) => {
    const taskId = Number.parseInt(el.getAttribute(__privateGet(this, _meta).taskProp));
    const tid = Number.parseInt($(target).parent().attr(__privateGet(this, _meta).folderProp));
    const sid = Number.parseInt($(source).parent().attr(__privateGet(this, _meta).folderProp));
    if (tid === sid) {
      const folder = __privateGet(this, _queue).task.find((folder2) => folder2.id === tid);
      const index = folder.findIndex((task2) => task2.id === taskId);
      const task = folder[index];
      folder.splice(index, 1);
      if (sibling) {
        const silbId = Number.parseInt(sibling.getAttribute(__privateGet(this, _meta).taskProp));
        const sindex = folder.findIndex((task2) => task2.id === silbId);
        folder.splice(sindex, 0, task);
      } else {
        folder.push(task);
      }
    } else {
      const sfolder = __privateGet(this, _queue).task.find((folder2) => folder2.id === sid);
      log$3.debug("taskId: ", taskId);
      log$3.debug("source: ", $(source).parent());
      log$3.debug("sid: ", sid);
      log$3.debug("tid: ", tid);
      const sindex = sfolder.findIndex((task2) => task2.id === taskId);
      const task = sfolder[sindex];
      sfolder.splice(sindex, 1);
      const folder = __privateGet(this, _queue).task.find((folder2) => folder2.id === tid);
      if (sibling) {
        const silbId = Number.parseInt(sibling.getAttribute(__privateGet(this, _meta).taskProp));
        const sindex2 = folder.findIndex((task2) => task2.id === silbId);
        folder.splice(sindex2, 0, task);
      } else {
        folder.push(task);
      }
    }
    __privateMethod(this, _任务队列_instances, refresh_fn).call(this);
    __privateGet(this, _queue).callback(JSON.parse(JSON.stringify(__privateGet(this, _queue).task)));
  });
  __privateGet(this, _queue).taskDrake = tdrake;
};
task2Html_fn = function(...tasks) {
  const htmls = [];
  for (const task of tasks) {
    const type = task.type;
    let label = "";
    if (type === "GameTask") {
      label = task.meta.label;
    } else {
      const option2 = __privateGet(this, _queue).queueOption.flag(task.meta.flag);
      const mid = task.meta.type === "time" ? "" : "到";
      const suffix = task.meta.type === "time" ? "次" : "";
      label = `合成${option2.label}${mid}${task.meta.value}${suffix}`;
    }
    const html = `<div class="${__privateGet(this, _meta).taskClass}" ${__privateGet(this, _meta).taskProp}="${task.id}"><p>${label} <span>[x]</span></p></div>`;
    htmls.push(html);
  }
  return htmls;
};
/**
 * 获取游戏的任务队列并将其清空
 */
getTaskFromGame_fn = function(save = false) {
  const tasks = [];
  const game2 = Moe.getInstance().game;
  if (game2.time.queue) {
    log$3.debug(`游戏原任务队列:`, game2.time.queue.queueItems);
    for (const gtask of game2.time.queue.queueItems) {
      for (let i = 0; i < gtask.value; i++) {
        tasks.push({
          type: "GameTask",
          id: __privateGet(this, _id).next().value,
          meta: {
            name: gtask.name,
            label: gtask.label,
            type: gtask.type,
            value: 1
          }
        });
      }
    }
    if (game2.time.queue.queueItems.length > 0) {
      game2.time.queue.queueItems.length = 0;
      if (save) game2.save();
    }
  }
  return tasks;
};
/**
 * 加载任务队列数据
 * @param tasks 缓存中的任务数据
 */
loadData_fn = function(tasks = []) {
  __privateGet(this, _queue).task.length = 0;
  $(`#${__privateGet(this, _meta).containerId} > .${__privateGet(this, _meta).folderClass}`).remove();
  const gtasks = __privateMethod(this, _任务队列_instances, getTaskFromGame_fn).call(this, true);
  for (const gtask of gtasks) {
    __privateGet(this, _queue).task.push(new Folder(__privateGet(this, _id).next().value, gtask));
  }
  for (const folder of tasks) {
    const f = new Folder(__privateGet(this, _id).next().value);
    for (const task of folder) {
      task.id = __privateGet(this, _id).next().value;
      f.push(task);
    }
    __privateGet(this, _queue).task.push(f);
  }
  log$3.debug(`加载任务队列: `, __privateGet(this, _queue).task);
  const container = $(`#${__privateGet(this, _meta).containerId}`);
  for (const folder of __privateGet(this, _queue).task) {
    const taskHtml = __privateMethod(this, _任务队列_instances, task2Html_fn).call(this, ...folder).join("");
    container.append(__privateGet(this, _meta).container.id(folder.id)`${taskHtml}`);
  }
  __privateMethod(this, _任务队列_instances, refresh_fn).call(this);
};
/**
 * 根据选项刷新type
 */
refreshSelect_fn = function(flag) {
  if (!flag) flag = __privateGet(this, _queue).optionSelector.val;
  const option2 = __privateGet(this, _queue).queueOption.flag(flag);
  if (!option2) {
    moe$7.error(`选项${flag}不存在`);
    return;
  }
  let repeat = false;
  if ("repeat" in option2) {
    repeat = true;
  }
  if ("until" in option2) {
    repeat = true;
  }
  if (!repeat) {
    __privateGet(this, _queue).typeSelector.$dom.hide();
    __privateGet(this, _queue).numInput.$dom.hide();
  } else {
    __privateGet(this, _queue).typeSelector.val = 0;
    __privateGet(this, _queue).numInput.val = 1;
    __privateGet(this, _queue).typeSelector.$dom.show();
    __privateGet(this, _queue).numInput.$dom.show();
  }
};
/**
 * 刷新任务，
 * 1. 删除为空的folder(最后一个除外)
 * 2. 添加容器后，刷新容器
 * 3. 刷新任务的drake(负责任务的拖动排序)
 */
refresh_fn = function() {
  for (let i = __privateGet(this, _queue).task.length - 2; i >= 0; i--) {
    const folder = __privateGet(this, _queue).task[i];
    if (folder.length === 0) {
      __privateGet(this, _queue).task.splice(i, 1);
      const fid = folder.id;
      $(`.${__privateGet(this, _meta).folderClass}[${__privateGet(this, _meta).folderProp}="${fid}"]`).remove();
    }
  }
  const addLast = __privateGet(this, _queue).task.length === 0 || __privateGet(this, _queue).task[__privateGet(this, _queue).task.length - 1].length > 0;
  if (addLast) {
    const id = __privateGet(this, _id).next().value;
    __privateGet(this, _queue).task.push(new Folder(id));
    $(`#${__privateGet(this, _meta).containerId}`).append(__privateGet(this, _meta).container.id(id)``);
  }
  $(`.${__privateGet(this, _meta).folderClass}`).off("click").on("click", (e) => {
    const t = $(e.target);
    if (t.hasClass(__privateGet(this, _meta).folderClass)) {
      t.toggleClass(__privateGet(this, _meta).folderActiveClass);
    } else {
      $(`.${__privateGet(this, _meta).folderClass}`).removeClass(__privateGet(this, _meta).folderActiveClass);
      t.addClass(__privateGet(this, _meta).folderActiveClass);
    }
  });
  $(`.${__privateGet(this, _meta).taskClass}>p>span`).off("click").on("click", (e) => {
    const t = $(e.target);
    log$3.debug("current task: ", t.parent().parent());
    const id = Number.parseInt(t.parent().parent().attr(__privateGet(this, _meta).taskProp));
    log$3.debug("current task id: ", id);
    __privateMethod(this, _任务队列_instances, removeTask_fn).call(this, id);
    __privateGet(this, _queue).callback(JSON.parse(JSON.stringify(__privateGet(this, _queue).task)));
  });
  __privateGet(this, _queue).taskDrake.containers.length = 0;
  __privateGet(this, _queue).taskDrake.containers.push(...$(`.${__privateGet(this, _meta).dataContainerClass}`).toArray());
};
addTask_fn = function(...tasks) {
  if (tasks.length === 0) return;
  const [task, ...ts] = tasks;
  const activeId = $(`.${__privateGet(this, _meta).folderClass}.${__privateGet(this, _meta).folderActiveClass}`).attr(__privateGet(this, _meta).folderProp);
  let folder;
  if (activeId) {
    folder = __privateGet(this, _queue).task.find((folder2) => folder2.id === Number(activeId));
  } else {
    folder = __privateGet(this, _queue).task[__privateGet(this, _queue).task.length - 1];
  }
  if (!folder) {
    moe$7.error(`【${this.name}】插件异常！选择的FolderId在Folder中不存在`);
    return;
  }
  folder.push(task);
  const id = folder.id;
  const taskhtml = __privateMethod(this, _任务队列_instances, task2Html_fn).call(this, task).join("");
  log$3.debug(`添加任务: `, taskhtml);
  $(`.${__privateGet(this, _meta).folderClass}[${__privateGet(this, _meta).folderProp}="${id}"] > div`).append(taskhtml);
  if (ts.length > 0) {
    __privateMethod(this, _任务队列_instances, addTask_fn).call(this, ...ts);
  } else {
    __privateMethod(this, _任务队列_instances, refresh_fn).call(this);
  }
};
removeTask_fn = function(id) {
  $(`.${__privateGet(this, _meta).taskClass}[${__privateGet(this, _meta).taskProp}="${id}"]`).remove();
  for (const folder of __privateGet(this, _queue).task) {
    for (let i = 0; i < folder.length; i++) {
      const task = folder[i];
      if (task.id === id) {
        folder.splice(i, 1);
        log$3.debug("removeTask，准备刷新: ", JSON.stringify(__privateGet(this, _queue).task));
        __privateMethod(this, _任务队列_instances, refresh_fn).call(this);
        return;
      }
    }
  }
};
const option$7 = new 任务队列();
const log$2 = getLogger("option/合成木材", "console");
const moe$6 = getLogger("option/合成木材", "moe");
let description$4 = (_a = class {
  constructor(selected, sval, unit, uval) {
    __privateAdd(this, _selected2);
    __privateAdd(this, _sval);
    __privateAdd(this, _unit);
    __privateAdd(this, _uval);
    __publicField(this, "deactivate", "停止自动合成木材");
    __privateSet(this, _selected2, selected);
    __privateSet(this, _sval, sval);
    __privateSet(this, _unit, unit);
    __privateSet(this, _uval, uval);
  }
  get activate() {
    const unitMap = {
      threshold: "%",
      number: "次"
    };
    const uval = __privateGet(this, _uval).call(this) + unitMap[__privateGet(this, _unit).call(this)];
    const selected = __privateGet(this, _selected2).call(this);
    const sval = __privateGet(this, _sval).call(this);
    if (selected === "time") {
      return `可合成${sval}次木材时，合成${uval}木材`;
    } else if (selected === "threshold") {
      return `猫薄荷达到${sval}%时，合成${uval}木材`;
    } else if (selected === "number") {
      return `猫薄荷达到${sval}株时，合成${uval}木材`;
    }
    throw new Error("未设置合成木材方式");
  }
}, _selected2 = new WeakMap(), _sval = new WeakMap(), _unit = new WeakMap(), _uval = new WeakMap(), _a);
class 合成木材 {
  constructor() {
    __privateAdd(this, _合成木材_instances);
    __publicField(this, "index", 1);
    __publicField(this, "panel", "合成");
    __publicField(this, "name", "自动合成木材");
    __publicField(this, "flag", "合成木材");
    __publicField(this, "crossSaver", true);
    __privateAdd(this, _config4, {
      activate: false,
      select: "threshold",
      selectVal: 95,
      lastSelectTime: 1,
      lastSelectThreshold: 95,
      lastSelectNumber: 100,
      unit: "number",
      unitVal: 1,
      lastUnitThreshold: 95,
      lastUnitNumber: 1
    });
    __publicField(this, "description", new description$4(
      () => __privateGet(this, _config4).select,
      () => __privateGet(this, _config4).selectVal,
      () => __privateGet(this, _config4).unit,
      () => __privateGet(this, _config4).unitVal
    ));
    // 猫薄荷判断
    __privateAdd(this, _sourceNum);
    __privateAdd(this, _span2);
    // 合成数量判断
    __privateAdd(this, _generateNum);
    __privateAdd(this, _generateSelect, new SelectComponent([
      { value: "threshold", name: "%" },
      { value: "number", name: "次" }
    ]));
    __publicField(this, "period", timeobj.sec(30));
    __privateAdd(this, _from, "catnip");
    __privateAdd(this, _to, "wood");
    __publicField(this, "label", "木材");
    __publicField(this, "repeat", (t = 1) => {
      if (t < 1) return 0;
      const time = __privateMethod(this, _合成木材_instances, getCraftCount_fn).call(this);
      if (time < 1) return 0;
      const min2 = Math.min(time, t);
      const rs = __privateMethod(this, _合成木材_instances, craft_fn).call(this, min2, false);
      return rs ? min2 : 0;
    });
    __publicField(this, "until", (num) => {
      const game2 = Moe.getInstance().game;
      const val = game2.resPool.get(__privateGet(this, _from)).value;
      if (val >= num) return true;
      const ctime = __privateMethod(this, _合成木材_instances, getCraftCount_fn).call(this);
      if (ctime < 1) return false;
      const subtraction = num - val;
      const to = game2.workshop.getCraft(__privateGet(this, _to));
      const price = game2.workshop.getCraftPrice(to)[0];
      const time = Math.ceil(subtraction / price.val);
      __privateMethod(this, _合成木材_instances, craft_fn).call(this, time);
      const nval = game2.resPool.get(__privateGet(this, _from)).value;
      return nval >= num;
    });
  }
  /**
   * ${this.name}${sourceSelectHtml}<span><span>
   * @param config 
   * @param callback 
   * @returns 
   */
  dom(config, callback) {
    if (config) __privateSet(this, _config4, config);
    const select = new SelectComponent([
      { value: "", name: "" },
      { value: "time", name: "可合成次数" },
      { value: "threshold", name: "猫薄荷阈值" },
      { value: "number", name: "猫薄荷数量" }
    ]).create((config == null ? void 0 : config.activate) ? config.select : "", (select2) => {
      if (!select2) {
        __privateMethod(this, _合成木材_instances, deactivate_fn2).call(this);
        __privateGet(this, _config4).activate = false;
        callback(JSON.parse(JSON.stringify(__privateGet(this, _config4))));
      } else {
        if (__privateGet(this, _config4).activate && __privateGet(this, _config4).select === select2) return;
        if (__privateGet(this, _config4).selectVal) {
          if (__privateGet(this, _config4).select === "time") {
            __privateGet(this, _config4).lastSelectTime = __privateGet(this, _config4).selectVal;
          } else if (__privateGet(this, _config4).select === "threshold") {
            __privateGet(this, _config4).lastSelectThreshold = __privateGet(this, _config4).selectVal;
          } else if (__privateGet(this, _config4).select === "number") {
            __privateGet(this, _config4).lastSelectNumber = __privateGet(this, _config4).selectVal;
          }
        }
        if (select2 === "time") {
          __privateGet(this, _config4).selectVal = __privateGet(this, _config4).lastSelectTime;
        } else if (select2 === "threshold") {
          __privateGet(this, _config4).selectVal = __privateGet(this, _config4).lastSelectThreshold;
        } else if (select2 === "number") {
          __privateGet(this, _config4).selectVal = __privateGet(this, _config4).lastSelectNumber;
        }
        __privateGet(this, _config4).activate = true;
        __privateGet(this, _config4).select = select2;
        callback(JSON.parse(JSON.stringify(__privateGet(this, _config4))));
        __privateMethod(this, _合成木材_instances, loadHtml_fn).call(this, callback);
      }
    });
    __privateSet(this, _span2, $(`<span></span>`));
    if (config == null ? void 0 : config.activate) __privateMethod(this, _合成木材_instances, loadHtml_fn).call(this, callback);
    const dom = $().add(document.createTextNode(this.name)).add(select).add(__privateGet(this, _span2));
    return dom;
  }
  script() {
    if (!__privateGet(this, _config4).activate) return false;
    const game2 = Moe.getInstance().game;
    let isdo = false;
    let msg = "";
    const select = __privateGet(this, _config4).select;
    const sval = __privateGet(this, _config4).selectVal;
    if (select === "time") {
      const time = __privateMethod(this, _合成木材_instances, getCraftCount_fn).call(this);
      isdo = time >= sval;
      msg = `可合成次数(${time})已达到设定值(${sval})，`;
    } else if (select === "threshold") {
      const cn = game2.resPool.get(__privateGet(this, _from));
      const threshold = +(cn.value / cn.maxValue * 100).toFixed(1);
      isdo = threshold >= sval;
      msg = `猫薄荷数量(${threshold}%)达到阈值(${sval}%)，`;
    } else if (select === "number") {
      const cnVal = game2.resPool.get(__privateGet(this, _from)).value;
      isdo = cnVal >= sval;
      msg = `猫薄荷数量(${cnVal})已达到设定值(${sval})，`;
    }
    if (!isdo) return false;
    const unit = __privateGet(this, _config4).unit;
    const uval = __privateGet(this, _config4).unitVal;
    if (unit === "threshold") {
      const source = game2.workshop.getCraft(__privateGet(this, _to));
      const price = game2.workshop.getCraftPrice(source);
      const cnVal = game2.resPool.get(__privateGet(this, _from)).maxValue;
      const maxTime = Math.floor(cnVal / price[0].val);
      const time = Math.floor(maxTime * (uval / 100));
      msg += `尝试合成${time}次(${uval}%)木材`;
      moe$6.debug(msg);
      return __privateMethod(this, _合成木材_instances, craft_fn).call(this, time);
    } else if (unit === "number") {
      msg += `尝试合成${uval}次木材`;
      moe$6.debug(msg);
      return __privateMethod(this, _合成木材_instances, craft_fn).call(this, uval);
    }
    return false;
  }
}
_config4 = new WeakMap();
_sourceNum = new WeakMap();
_span2 = new WeakMap();
_generateNum = new WeakMap();
_generateSelect = new WeakMap();
_合成木材_instances = new WeakSet();
// [--/可合成次数/猫薄荷数量/猫薄荷阈值]达到[number](次/株/%)时，合成(猫薄荷上限)[number][次/%]木材
loadHtml_fn = function(callback) {
  if (!__privateGet(this, _config4).activate) return;
  const container = __privateGet(this, _span2);
  container.empty();
  if (__privateGet(this, _config4).select === "time") {
    __privateSet(this, _sourceNum, new NumInputComponent({ min: 1, step: 1, label: "次" }));
  } else if (__privateGet(this, _config4).select === "threshold") {
    __privateSet(this, _sourceNum, new NumInputComponent({ min: 1, max: 100, step: 1, label: "%" }));
  } else if (__privateGet(this, _config4).select === "number") {
    __privateSet(this, _sourceNum, new NumInputComponent({ min: 1, step: 1, label: "株" }));
  }
  if (__privateGet(this, _config4).unit === "threshold") {
    __privateSet(this, _generateNum, new NumInputComponent({ min: 1, step: 1, prelabel: "最大可合成次数" }));
  } else if (__privateGet(this, _config4).unit === "number") {
    __privateSet(this, _generateNum, new NumInputComponent({ min: 1, step: 1 }));
  }
  const sourceNum = __privateGet(this, _sourceNum).create(__privateGet(this, _config4).selectVal, (val) => {
    __privateGet(this, _config4).selectVal = val;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config4))));
  });
  const generateNum = __privateGet(this, _generateNum).create(__privateGet(this, _config4).unitVal, (val) => {
    __privateGet(this, _config4).unitVal = val;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config4))));
  });
  const generateSelect = __privateGet(this, _generateSelect).create(__privateGet(this, _config4).unit, (select) => {
    log$2.debug("合成木材", select);
    if (__privateGet(this, _config4).unit === select) return;
    if (__privateGet(this, _config4).unit === "threshold") {
      __privateGet(this, _config4).lastUnitThreshold = __privateGet(this, _config4).unitVal;
    } else if (__privateGet(this, _config4).unit === "number") {
      __privateGet(this, _config4).lastUnitNumber = __privateGet(this, _config4).unitVal;
    }
    if (select === "threshold") {
      __privateGet(this, _config4).unitVal = __privateGet(this, _config4).lastUnitThreshold;
    } else if (select === "number") {
      __privateGet(this, _config4).unitVal = __privateGet(this, _config4).lastUnitNumber;
    }
    __privateGet(this, _config4).unit = select;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config4))));
    __privateMethod(this, _合成木材_instances, loadHtml_fn).call(this, callback);
  });
  container.append(
    "达到",
    sourceNum,
    "时，合成",
    generateNum,
    generateSelect,
    "木材"
  );
};
deactivate_fn2 = function() {
  if (!__privateGet(this, _config4).activate) return;
  __privateGet(this, _config4).activate = false;
  __privateGet(this, _span2).empty();
  __privateSet(this, _sourceNum, void 0);
  if (__privateGet(this, _config4).select === "time") {
    __privateGet(this, _config4).lastSelectTime = __privateGet(this, _config4).selectVal;
  } else if (__privateGet(this, _config4).select === "threshold") {
    __privateGet(this, _config4).lastSelectThreshold = __privateGet(this, _config4).selectVal;
  } else if (__privateGet(this, _config4).select === "number") {
    __privateGet(this, _config4).lastSelectNumber = __privateGet(this, _config4).selectVal;
  }
  __privateSet(this, _generateNum, void 0);
};
_from = new WeakMap();
_to = new WeakMap();
/**
 * 获取可合成次数
 * @returns 可合成次数
 */
getCraftCount_fn = function() {
  const game2 = Moe.getInstance().game;
  const time = game2.workshop.getCraftAllCount(__privateGet(this, _to));
  return time;
};
/**
 * 合成num次木材
 * @param num 
 * @param forceAll 资源不足时是否退化为“尽可能合成全部”
 * @returns 是否合成成功
 */
craft_fn = function(num, forceAll = true) {
  const game2 = Moe.getInstance().game;
  return game2.workshop.craft(__privateGet(this, _to), num, true, forceAll);
};
const option$6 = new 合成木材();
const moe$5 = getLogger("option/合成木梁", "moe");
let description$3 = (_b = class {
  constructor(selected, sval, unit, uval) {
    __privateAdd(this, _selected3);
    __privateAdd(this, _sval2);
    __privateAdd(this, _unit2);
    __privateAdd(this, _uval2);
    __publicField(this, "deactivate", "停止自动合成木梁");
    __privateSet(this, _selected3, selected);
    __privateSet(this, _sval2, sval);
    __privateSet(this, _unit2, unit);
    __privateSet(this, _uval2, uval);
  }
  get activate() {
    const unitMap = {
      threshold: "%",
      number: "次"
    };
    const uval = __privateGet(this, _uval2).call(this) + unitMap[__privateGet(this, _unit2).call(this)];
    const selected = __privateGet(this, _selected3).call(this);
    const sval = __privateGet(this, _sval2).call(this);
    if (selected === "time") {
      return `可合成${sval}次木梁时，合成${uval}木梁`;
    } else if (selected === "threshold") {
      return `木材达到${sval}%时，合成${uval}木梁`;
    } else if (selected === "number") {
      return `木材达到${sval}个时，合成${uval}木梁`;
    }
    throw new Error("未设置合成木梁方式");
  }
}, _selected3 = new WeakMap(), _sval2 = new WeakMap(), _unit2 = new WeakMap(), _uval2 = new WeakMap(), _b);
class 合成木梁 {
  constructor() {
    __privateAdd(this, _合成木梁_instances);
    __publicField(this, "index", 2);
    __publicField(this, "panel", "合成");
    __publicField(this, "name", "自动合成木梁");
    __publicField(this, "flag", "合成木梁");
    __publicField(this, "crossSaver", true);
    __privateAdd(this, _config5, {
      activate: false,
      select: "threshold",
      selectVal: 95,
      lastSelectTime: 1,
      lastSelectThreshold: 95,
      lastSelectNumber: 100,
      unit: "number",
      unitVal: 1,
      lastUnitThreshold: 95,
      lastUnitNumber: 1
    });
    __publicField(this, "description", new description$3(
      () => __privateGet(this, _config5).select,
      () => __privateGet(this, _config5).selectVal,
      () => __privateGet(this, _config5).unit,
      () => __privateGet(this, _config5).unitVal
    ));
    // 猫薄荷判断
    __privateAdd(this, _sourceNum2);
    __privateAdd(this, _span3);
    // 合成数量判断
    __privateAdd(this, _generateNum2);
    __privateAdd(this, _generateSelect2, new SelectComponent([
      { value: "threshold", name: "%" },
      { value: "number", name: "次" }
    ]));
    __publicField(this, "period", timeobj.sec(30));
    __privateAdd(this, _from2, "wood");
    __privateAdd(this, _to2, "beam");
  }
  /**
   * ${this.name}${sourceSelectHtml}<span><span>
   * @param config 
   * @param callback 
   * @returns 
   */
  dom(config, callback) {
    if (config) __privateSet(this, _config5, config);
    const select = new SelectComponent([
      { value: "", name: "" },
      { value: "time", name: "可合成次数" },
      { value: "threshold", name: "木材阈值" },
      { value: "number", name: "木材数量" }
    ]).create((config == null ? void 0 : config.activate) ? config.select : "", (select2) => {
      if (!select2) {
        __privateMethod(this, _合成木梁_instances, deactivate_fn3).call(this);
        __privateGet(this, _config5).activate = false;
        callback(JSON.parse(JSON.stringify(__privateGet(this, _config5))));
      } else {
        if (__privateGet(this, _config5).activate && __privateGet(this, _config5).select === select2) return;
        if (__privateGet(this, _config5).selectVal) {
          if (__privateGet(this, _config5).select === "time") {
            __privateGet(this, _config5).lastSelectTime = __privateGet(this, _config5).selectVal;
          } else if (__privateGet(this, _config5).select === "threshold") {
            __privateGet(this, _config5).lastSelectThreshold = __privateGet(this, _config5).selectVal;
          } else if (__privateGet(this, _config5).select === "number") {
            __privateGet(this, _config5).lastSelectNumber = __privateGet(this, _config5).selectVal;
          }
        }
        if (select2 === "time") {
          __privateGet(this, _config5).selectVal = __privateGet(this, _config5).lastSelectTime;
        } else if (select2 === "threshold") {
          __privateGet(this, _config5).selectVal = __privateGet(this, _config5).lastSelectThreshold;
        } else if (select2 === "number") {
          __privateGet(this, _config5).selectVal = __privateGet(this, _config5).lastSelectNumber;
        }
        __privateGet(this, _config5).activate = true;
        __privateGet(this, _config5).select = select2;
        callback(JSON.parse(JSON.stringify(__privateGet(this, _config5))));
        __privateMethod(this, _合成木梁_instances, loadHtml_fn2).call(this, callback);
      }
    });
    __privateSet(this, _span3, $(`<span></span>`));
    if (config == null ? void 0 : config.activate) __privateMethod(this, _合成木梁_instances, loadHtml_fn2).call(this, callback);
    const dom = $().add(document.createTextNode(this.name)).add(select).add(__privateGet(this, _span3));
    return dom;
  }
  script() {
    if (!__privateGet(this, _config5).activate) return false;
    const game2 = Moe.getInstance().game;
    let isdo = false;
    let msg = "";
    const select = __privateGet(this, _config5).select;
    const sval = __privateGet(this, _config5).selectVal;
    if (select === "time") {
      const time = game2.workshop.getCraftAllCount(__privateGet(this, _to2));
      isdo = time >= sval;
      msg = `可合成次数(${time})已达到设定值(${sval})，`;
    } else if (select === "threshold") {
      const cn = game2.resPool.get(__privateGet(this, _from2));
      const threshold = +(cn.value / cn.maxValue * 100).toFixed(1);
      isdo = threshold >= sval;
      msg = `木材数量(${threshold}%)达到阈值(${sval}%)，`;
    } else if (select === "number") {
      const cnVal = game2.resPool.get(__privateGet(this, _from2)).value;
      isdo = cnVal >= sval;
      msg = `木材数量(${cnVal})已达到设定值(${sval})，`;
    }
    if (!isdo) return false;
    const unit = __privateGet(this, _config5).unit;
    const uval = __privateGet(this, _config5).unitVal;
    if (unit === "threshold") {
      const source = game2.workshop.getCraft(__privateGet(this, _to2));
      const price = game2.workshop.getCraftPrice(source);
      const cnVal = game2.resPool.get(__privateGet(this, _from2)).maxValue;
      const maxTime = Math.floor(cnVal / price[0].val);
      const time = Math.floor(maxTime * (uval / 100));
      msg += `尝试合成${time}次(${uval}%)木梁`;
      moe$5.debug(msg);
      return game2.workshop.craft(__privateGet(this, _to2), time, true, true, false);
    } else if (unit === "number") {
      msg += `尝试合成${uval}次木梁`;
      moe$5.debug(msg);
      return game2.workshop.craft(__privateGet(this, _to2), uval, true, true, false);
    }
    return false;
  }
}
_config5 = new WeakMap();
_sourceNum2 = new WeakMap();
_span3 = new WeakMap();
_generateNum2 = new WeakMap();
_generateSelect2 = new WeakMap();
_合成木梁_instances = new WeakSet();
// [--/可合成次数/木材数量/木材阈值]达到[number](次/个/%)时，合成(猫薄荷上限)[number][次/%]木梁
loadHtml_fn2 = function(callback) {
  if (!__privateGet(this, _config5).activate) return;
  const container = __privateGet(this, _span3);
  container.empty();
  if (__privateGet(this, _config5).select === "time") {
    __privateSet(this, _sourceNum2, new NumInputComponent({ min: 1, step: 1, label: "次" }));
  } else if (__privateGet(this, _config5).select === "threshold") {
    __privateSet(this, _sourceNum2, new NumInputComponent({ min: 1, max: 100, step: 1, label: "%" }));
  } else if (__privateGet(this, _config5).select === "number") {
    __privateSet(this, _sourceNum2, new NumInputComponent({ min: 1, step: 1, label: "个" }));
  }
  if (__privateGet(this, _config5).unit === "threshold") {
    __privateSet(this, _generateNum2, new NumInputComponent({ min: 1, step: 1, prelabel: "最大可合成次数" }));
  } else if (__privateGet(this, _config5).unit === "number") {
    __privateSet(this, _generateNum2, new NumInputComponent({ min: 1, step: 1 }));
  }
  const sourceNum = __privateGet(this, _sourceNum2).create(__privateGet(this, _config5).selectVal, (val) => {
    __privateGet(this, _config5).selectVal = val;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config5))));
  });
  const generateNum = __privateGet(this, _generateNum2).create(__privateGet(this, _config5).unitVal, (val) => {
    __privateGet(this, _config5).unitVal = val;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config5))));
  });
  const generateSelect = __privateGet(this, _generateSelect2).create(__privateGet(this, _config5).unit, (select) => {
    if (__privateGet(this, _config5).unit === select) return;
    if (__privateGet(this, _config5).unit === "threshold") {
      __privateGet(this, _config5).lastUnitThreshold = __privateGet(this, _config5).unitVal;
    } else if (__privateGet(this, _config5).unit === "number") {
      __privateGet(this, _config5).lastUnitNumber = __privateGet(this, _config5).unitVal;
    }
    if (select === "threshold") {
      __privateGet(this, _config5).unitVal = __privateGet(this, _config5).lastUnitThreshold;
    } else if (select === "number") {
      __privateGet(this, _config5).unitVal = __privateGet(this, _config5).lastUnitNumber;
    }
    __privateGet(this, _config5).unit = select;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config5))));
    __privateMethod(this, _合成木梁_instances, loadHtml_fn2).call(this, callback);
  });
  container.append(
    "达到",
    sourceNum,
    "时，合成",
    generateNum,
    generateSelect,
    "木梁"
  );
};
deactivate_fn3 = function() {
  if (!__privateGet(this, _config5).activate) return;
  __privateGet(this, _config5).activate = false;
  __privateGet(this, _span3).empty();
  __privateSet(this, _sourceNum2, void 0);
  if (__privateGet(this, _config5).select === "time") {
    __privateGet(this, _config5).lastSelectTime = __privateGet(this, _config5).selectVal;
  } else if (__privateGet(this, _config5).select === "threshold") {
    __privateGet(this, _config5).lastSelectThreshold = __privateGet(this, _config5).selectVal;
  } else if (__privateGet(this, _config5).select === "number") {
    __privateGet(this, _config5).lastSelectNumber = __privateGet(this, _config5).selectVal;
  }
  __privateSet(this, _generateNum2, void 0);
};
_from2 = new WeakMap();
_to2 = new WeakMap();
const option$5 = new 合成木梁();
const moe$4 = getLogger("option/合成石板", "moe");
let description$2 = (_c = class {
  constructor(selected, sval, unit, uval) {
    __privateAdd(this, _selected4);
    __privateAdd(this, _sval3);
    __privateAdd(this, _unit3);
    __privateAdd(this, _uval3);
    __publicField(this, "deactivate", "停止自动合成石板");
    __privateSet(this, _selected4, selected);
    __privateSet(this, _sval3, sval);
    __privateSet(this, _unit3, unit);
    __privateSet(this, _uval3, uval);
  }
  get activate() {
    const unitMap = {
      threshold: "%",
      number: "次"
    };
    const uval = __privateGet(this, _uval3).call(this) + unitMap[__privateGet(this, _unit3).call(this)];
    const selected = __privateGet(this, _selected4).call(this);
    const sval = __privateGet(this, _sval3).call(this);
    if (selected === "time") {
      return `可合成${sval}次石板时，合成${uval}石板`;
    } else if (selected === "threshold") {
      return `木材达到${sval}%时，合成${uval}石板`;
    } else if (selected === "number") {
      return `木材达到${sval}个时，合成${uval}石板`;
    }
    throw new Error("未设置合成石板方式");
  }
}, _selected4 = new WeakMap(), _sval3 = new WeakMap(), _unit3 = new WeakMap(), _uval3 = new WeakMap(), _c);
class 合成石板 {
  constructor() {
    __privateAdd(this, _合成石板_instances);
    __publicField(this, "index", 3);
    __publicField(this, "panel", "合成");
    __publicField(this, "name", "自动合成石板");
    __publicField(this, "flag", "合成石板");
    __publicField(this, "crossSaver", true);
    __privateAdd(this, _config6, {
      activate: false,
      select: "threshold",
      selectVal: 95,
      lastSelectTime: 1,
      lastSelectThreshold: 95,
      lastSelectNumber: 100,
      unit: "number",
      unitVal: 1,
      lastUnitThreshold: 95,
      lastUnitNumber: 1
    });
    __publicField(this, "description", new description$2(
      () => __privateGet(this, _config6).select,
      () => __privateGet(this, _config6).selectVal,
      () => __privateGet(this, _config6).unit,
      () => __privateGet(this, _config6).unitVal
    ));
    // 猫薄荷判断
    __privateAdd(this, _sourceNum3);
    __privateAdd(this, _span4);
    // 合成数量判断
    __privateAdd(this, _generateNum3);
    __privateAdd(this, _generateSelect3, new SelectComponent([
      { value: "threshold", name: "%" },
      { value: "number", name: "次" }
    ]));
    __publicField(this, "period", timeobj.sec(30));
    __privateAdd(this, _from3, "minerals");
    __privateAdd(this, _to3, "slab");
  }
  /**
   * ${this.name}${sourceSelectHtml}<span><span>
   * @param config 
   * @param callback 
   * @returns 
   */
  dom(config, callback) {
    if (config) __privateSet(this, _config6, config);
    const select = new SelectComponent([
      { value: "", name: "" },
      { value: "time", name: "可合成次数" },
      { value: "threshold", name: "矿物阈值" },
      { value: "number", name: "矿物数量" }
    ]).create((config == null ? void 0 : config.activate) ? config.select : "", (select2) => {
      if (!select2) {
        __privateMethod(this, _合成石板_instances, deactivate_fn4).call(this);
        __privateGet(this, _config6).activate = false;
        callback(JSON.parse(JSON.stringify(__privateGet(this, _config6))));
      } else {
        if (__privateGet(this, _config6).activate && __privateGet(this, _config6).select === select2) return;
        if (__privateGet(this, _config6).selectVal) {
          if (__privateGet(this, _config6).select === "time") {
            __privateGet(this, _config6).lastSelectTime = __privateGet(this, _config6).selectVal;
          } else if (__privateGet(this, _config6).select === "threshold") {
            __privateGet(this, _config6).lastSelectThreshold = __privateGet(this, _config6).selectVal;
          } else if (__privateGet(this, _config6).select === "number") {
            __privateGet(this, _config6).lastSelectNumber = __privateGet(this, _config6).selectVal;
          }
        }
        if (select2 === "time") {
          __privateGet(this, _config6).selectVal = __privateGet(this, _config6).lastSelectTime;
        } else if (select2 === "threshold") {
          __privateGet(this, _config6).selectVal = __privateGet(this, _config6).lastSelectThreshold;
        } else if (select2 === "number") {
          __privateGet(this, _config6).selectVal = __privateGet(this, _config6).lastSelectNumber;
        }
        __privateGet(this, _config6).activate = true;
        __privateGet(this, _config6).select = select2;
        callback(JSON.parse(JSON.stringify(__privateGet(this, _config6))));
        __privateMethod(this, _合成石板_instances, loadHtml_fn3).call(this, callback);
      }
    });
    __privateSet(this, _span4, $(`<span></span>`));
    if (config == null ? void 0 : config.activate) __privateMethod(this, _合成石板_instances, loadHtml_fn3).call(this, callback);
    const dom = $().add(document.createTextNode(this.name)).add(select).add(__privateGet(this, _span4));
    return dom;
  }
  script() {
    if (!__privateGet(this, _config6).activate) return false;
    const game2 = Moe.getInstance().game;
    let isdo = false;
    let msg = "";
    const select = __privateGet(this, _config6).select;
    const sval = __privateGet(this, _config6).selectVal;
    if (select === "time") {
      const time = game2.workshop.getCraftAllCount(__privateGet(this, _to3));
      isdo = time >= sval;
      msg = `可合成次数(${time})已达到设定值(${sval})，`;
    } else if (select === "threshold") {
      const cn = game2.resPool.get(__privateGet(this, _from3));
      const threshold = +(cn.value / cn.maxValue * 100).toFixed(1);
      isdo = threshold >= sval;
      msg = `矿物数量(${threshold}%)达到阈值(${sval}%)，`;
    } else if (select === "number") {
      const cnVal = game2.resPool.get(__privateGet(this, _from3)).value;
      isdo = cnVal >= sval;
      msg = `矿物数量(${cnVal})已达到设定值(${sval})，`;
    }
    if (!isdo) return false;
    const unit = __privateGet(this, _config6).unit;
    const uval = __privateGet(this, _config6).unitVal;
    if (unit === "threshold") {
      const source = game2.workshop.getCraft(__privateGet(this, _to3));
      const price = game2.workshop.getCraftPrice(source);
      const cnVal = game2.resPool.get(__privateGet(this, _from3)).maxValue;
      const maxTime = Math.floor(cnVal / price[0].val);
      const time = Math.floor(maxTime * (uval / 100));
      msg += `尝试合成${time}次(${uval}%)石板`;
      moe$4.debug(msg);
      return game2.workshop.craft(__privateGet(this, _to3), time, true, true, false);
    } else if (unit === "number") {
      msg += `尝试合成${uval}次石板`;
      moe$4.debug(msg);
      return game2.workshop.craft(__privateGet(this, _to3), uval, true, true, false);
    }
    return false;
  }
}
_config6 = new WeakMap();
_sourceNum3 = new WeakMap();
_span4 = new WeakMap();
_generateNum3 = new WeakMap();
_generateSelect3 = new WeakMap();
_合成石板_instances = new WeakSet();
// [--/可合成次数/矿物数量/矿物阈值]达到[number](次/个/%)时，合成(猫薄荷上限)[number][次/%]石板
loadHtml_fn3 = function(callback) {
  if (!__privateGet(this, _config6).activate) return;
  const container = __privateGet(this, _span4);
  container.empty();
  if (__privateGet(this, _config6).select === "time") {
    __privateSet(this, _sourceNum3, new NumInputComponent({ min: 1, step: 1, label: "次" }));
  } else if (__privateGet(this, _config6).select === "threshold") {
    __privateSet(this, _sourceNum3, new NumInputComponent({ min: 1, max: 100, step: 1, label: "%" }));
  } else if (__privateGet(this, _config6).select === "number") {
    __privateSet(this, _sourceNum3, new NumInputComponent({ min: 1, step: 1, label: "个" }));
  }
  if (__privateGet(this, _config6).unit === "threshold") {
    __privateSet(this, _generateNum3, new NumInputComponent({ min: 1, step: 1, prelabel: "最大可合成次数" }));
  } else if (__privateGet(this, _config6).unit === "number") {
    __privateSet(this, _generateNum3, new NumInputComponent({ min: 1, step: 1 }));
  }
  const sourceNum = __privateGet(this, _sourceNum3).create(__privateGet(this, _config6).selectVal, (val) => {
    __privateGet(this, _config6).selectVal = val;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config6))));
  });
  const generateNum = __privateGet(this, _generateNum3).create(__privateGet(this, _config6).unitVal, (val) => {
    __privateGet(this, _config6).unitVal = val;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config6))));
  });
  const generateSelect = __privateGet(this, _generateSelect3).create(__privateGet(this, _config6).unit, (select) => {
    if (__privateGet(this, _config6).unit === select) return;
    if (__privateGet(this, _config6).unit === "threshold") {
      __privateGet(this, _config6).lastUnitThreshold = __privateGet(this, _config6).unitVal;
    } else if (__privateGet(this, _config6).unit === "number") {
      __privateGet(this, _config6).lastUnitNumber = __privateGet(this, _config6).unitVal;
    }
    if (select === "threshold") {
      __privateGet(this, _config6).unitVal = __privateGet(this, _config6).lastUnitThreshold;
    } else if (select === "number") {
      __privateGet(this, _config6).unitVal = __privateGet(this, _config6).lastUnitNumber;
    }
    __privateGet(this, _config6).unit = select;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config6))));
    __privateMethod(this, _合成石板_instances, loadHtml_fn3).call(this, callback);
  });
  container.append(
    "达到",
    sourceNum,
    "时，合成",
    generateNum,
    generateSelect,
    "石板"
  );
};
deactivate_fn4 = function() {
  if (!__privateGet(this, _config6).activate) return;
  __privateGet(this, _config6).activate = false;
  __privateGet(this, _span4).empty();
  __privateSet(this, _sourceNum3, void 0);
  if (__privateGet(this, _config6).select === "time") {
    __privateGet(this, _config6).lastSelectTime = __privateGet(this, _config6).selectVal;
  } else if (__privateGet(this, _config6).select === "threshold") {
    __privateGet(this, _config6).lastSelectThreshold = __privateGet(this, _config6).selectVal;
  } else if (__privateGet(this, _config6).select === "number") {
    __privateGet(this, _config6).lastSelectNumber = __privateGet(this, _config6).selectVal;
  }
  __privateSet(this, _generateNum3, void 0);
};
_from3 = new WeakMap();
_to3 = new WeakMap();
const option$4 = new 合成石板();
const moe$3 = getLogger("option/合成金属板", "moe");
let description$1 = (_d = class {
  constructor(selected, sval, unit, uval) {
    __privateAdd(this, _selected5);
    __privateAdd(this, _sval4);
    __privateAdd(this, _unit4);
    __privateAdd(this, _uval4);
    __publicField(this, "deactivate", "停止自动合成石板");
    __privateSet(this, _selected5, selected);
    __privateSet(this, _sval4, sval);
    __privateSet(this, _unit4, unit);
    __privateSet(this, _uval4, uval);
  }
  get activate() {
    const unitMap = {
      threshold: "%",
      number: "次"
    };
    const uval = __privateGet(this, _uval4).call(this) + unitMap[__privateGet(this, _unit4).call(this)];
    const selected = __privateGet(this, _selected5).call(this);
    const sval = __privateGet(this, _sval4).call(this);
    if (selected === "time") {
      return `可合成${sval}次石板时，合成${uval}石板`;
    } else if (selected === "threshold") {
      return `木材达到${sval}%时，合成${uval}石板`;
    } else if (selected === "number") {
      return `木材达到${sval}个时，合成${uval}石板`;
    }
    throw new Error("未设置合成石板方式");
  }
}, _selected5 = new WeakMap(), _sval4 = new WeakMap(), _unit4 = new WeakMap(), _uval4 = new WeakMap(), _d);
class 合成金属板 {
  constructor() {
    __privateAdd(this, _合成金属板_instances);
    __publicField(this, "index", 4);
    __publicField(this, "panel", "合成");
    __publicField(this, "name", "自动合成金属板");
    __publicField(this, "flag", "合成金属板");
    __publicField(this, "crossSaver", true);
    __privateAdd(this, _config7, {
      activate: false,
      select: "threshold",
      selectVal: 95,
      lastSelectTime: 1,
      lastSelectThreshold: 95,
      lastSelectNumber: 100,
      unit: "number",
      unitVal: 1,
      lastUnitThreshold: 95,
      lastUnitNumber: 1
    });
    __publicField(this, "description", new description$1(
      () => __privateGet(this, _config7).select,
      () => __privateGet(this, _config7).selectVal,
      () => __privateGet(this, _config7).unit,
      () => __privateGet(this, _config7).unitVal
    ));
    // 猫薄荷判断
    __privateAdd(this, _sourceNum4);
    __privateAdd(this, _span5);
    // 合成数量判断
    __privateAdd(this, _generateNum4);
    __privateAdd(this, _generateSelect4, new SelectComponent([
      { value: "threshold", name: "%" },
      { value: "number", name: "次" }
    ]));
    __publicField(this, "period", timeobj.sec(30));
    __privateAdd(this, _from4, "iron");
    __privateAdd(this, _to4, "plate");
  }
  /**
   * ${this.name}${sourceSelectHtml}<span><span>
   * @param config 
   * @param callback 
   * @returns 
   */
  dom(config, callback) {
    if (config) __privateSet(this, _config7, config);
    const select = new SelectComponent([
      { value: "", name: "" },
      { value: "time", name: "可合成次数" },
      { value: "threshold", name: "铁矿阈值" },
      { value: "number", name: "铁矿数量" }
    ]).create((config == null ? void 0 : config.activate) ? config.select : "", (select2) => {
      if (!select2) {
        __privateMethod(this, _合成金属板_instances, deactivate_fn5).call(this);
        __privateGet(this, _config7).activate = false;
        callback(JSON.parse(JSON.stringify(__privateGet(this, _config7))));
      } else {
        if (__privateGet(this, _config7).activate && __privateGet(this, _config7).select === select2) return;
        if (__privateGet(this, _config7).selectVal) {
          if (__privateGet(this, _config7).select === "time") {
            __privateGet(this, _config7).lastSelectTime = __privateGet(this, _config7).selectVal;
          } else if (__privateGet(this, _config7).select === "threshold") {
            __privateGet(this, _config7).lastSelectThreshold = __privateGet(this, _config7).selectVal;
          } else if (__privateGet(this, _config7).select === "number") {
            __privateGet(this, _config7).lastSelectNumber = __privateGet(this, _config7).selectVal;
          }
        }
        if (select2 === "time") {
          __privateGet(this, _config7).selectVal = __privateGet(this, _config7).lastSelectTime;
        } else if (select2 === "threshold") {
          __privateGet(this, _config7).selectVal = __privateGet(this, _config7).lastSelectThreshold;
        } else if (select2 === "number") {
          __privateGet(this, _config7).selectVal = __privateGet(this, _config7).lastSelectNumber;
        }
        __privateGet(this, _config7).activate = true;
        __privateGet(this, _config7).select = select2;
        callback(JSON.parse(JSON.stringify(__privateGet(this, _config7))));
        __privateMethod(this, _合成金属板_instances, loadHtml_fn4).call(this, callback);
      }
    });
    __privateSet(this, _span5, $(`<span></span>`));
    if (config == null ? void 0 : config.activate) __privateMethod(this, _合成金属板_instances, loadHtml_fn4).call(this, callback);
    const dom = $().add(document.createTextNode(this.name)).add(select).add(__privateGet(this, _span5));
    return dom;
  }
  script() {
    if (!__privateGet(this, _config7).activate) return false;
    const game2 = Moe.getInstance().game;
    let isdo = false;
    let msg = "";
    const select = __privateGet(this, _config7).select;
    const sval = __privateGet(this, _config7).selectVal;
    if (select === "time") {
      const time = game2.workshop.getCraftAllCount(__privateGet(this, _to4));
      isdo = time >= sval;
      msg = `可合成次数(${time})已达到设定值(${sval})，`;
    } else if (select === "threshold") {
      const cn = game2.resPool.get(__privateGet(this, _from4));
      const threshold = +(cn.value / cn.maxValue * 100).toFixed(1);
      isdo = threshold >= sval;
      msg = `铁矿数量(${threshold}%)达到阈值(${sval}%)，`;
    } else if (select === "number") {
      const cnVal = game2.resPool.get(__privateGet(this, _from4)).value;
      isdo = cnVal >= sval;
      msg = `铁矿数量(${cnVal})已达到设定值(${sval})，`;
    }
    if (!isdo) return false;
    const unit = __privateGet(this, _config7).unit;
    const uval = __privateGet(this, _config7).unitVal;
    if (unit === "threshold") {
      const source = game2.workshop.getCraft(__privateGet(this, _to4));
      const price = game2.workshop.getCraftPrice(source);
      const cnVal = game2.resPool.get(__privateGet(this, _from4)).maxValue;
      const maxTime = Math.floor(cnVal / price[0].val);
      const time = Math.floor(maxTime * (uval / 100));
      msg += `尝试合成${time}次(${uval}%)金属板`;
      moe$3.debug(msg);
      return game2.workshop.craft(__privateGet(this, _to4), time, true, true, false);
    } else if (unit === "number") {
      msg += `尝试合成${uval}次金属板`;
      moe$3.debug(msg);
      return game2.workshop.craft(__privateGet(this, _to4), uval, true, true, false);
    }
    return false;
  }
}
_config7 = new WeakMap();
_sourceNum4 = new WeakMap();
_span5 = new WeakMap();
_generateNum4 = new WeakMap();
_generateSelect4 = new WeakMap();
_合成金属板_instances = new WeakSet();
// [--/可合成次数/铁矿数量/铁矿阈值]达到[number](次/个/%)时，合成(铁矿上限)[number][次/%]金属板
loadHtml_fn4 = function(callback) {
  if (!__privateGet(this, _config7).activate) return;
  const container = __privateGet(this, _span5);
  container.empty();
  if (__privateGet(this, _config7).select === "time") {
    __privateSet(this, _sourceNum4, new NumInputComponent({ min: 1, step: 1, label: "次" }));
  } else if (__privateGet(this, _config7).select === "threshold") {
    __privateSet(this, _sourceNum4, new NumInputComponent({ min: 1, max: 100, step: 1, label: "%" }));
  } else if (__privateGet(this, _config7).select === "number") {
    __privateSet(this, _sourceNum4, new NumInputComponent({ min: 1, step: 1, label: "个" }));
  }
  if (__privateGet(this, _config7).unit === "threshold") {
    __privateSet(this, _generateNum4, new NumInputComponent({ min: 1, step: 1, prelabel: "最大可合成次数" }));
  } else if (__privateGet(this, _config7).unit === "number") {
    __privateSet(this, _generateNum4, new NumInputComponent({ min: 1, step: 1 }));
  }
  const sourceNum = __privateGet(this, _sourceNum4).create(__privateGet(this, _config7).selectVal, (val) => {
    __privateGet(this, _config7).selectVal = val;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config7))));
  });
  const generateNum = __privateGet(this, _generateNum4).create(__privateGet(this, _config7).unitVal, (val) => {
    __privateGet(this, _config7).unitVal = val;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config7))));
  });
  const generateSelect = __privateGet(this, _generateSelect4).create(__privateGet(this, _config7).unit, (select) => {
    if (__privateGet(this, _config7).unit === select) return;
    if (__privateGet(this, _config7).unit === "threshold") {
      __privateGet(this, _config7).lastUnitThreshold = __privateGet(this, _config7).unitVal;
    } else if (__privateGet(this, _config7).unit === "number") {
      __privateGet(this, _config7).lastUnitNumber = __privateGet(this, _config7).unitVal;
    }
    if (select === "threshold") {
      __privateGet(this, _config7).unitVal = __privateGet(this, _config7).lastUnitThreshold;
    } else if (select === "number") {
      __privateGet(this, _config7).unitVal = __privateGet(this, _config7).lastUnitNumber;
    }
    __privateGet(this, _config7).unit = select;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config7))));
    __privateMethod(this, _合成金属板_instances, loadHtml_fn4).call(this, callback);
  });
  container.append(
    "达到",
    sourceNum,
    "时，合成",
    generateNum,
    generateSelect,
    "金属板"
  );
};
deactivate_fn5 = function() {
  if (!__privateGet(this, _config7).activate) return;
  __privateGet(this, _config7).activate = false;
  __privateGet(this, _span5).empty();
  __privateSet(this, _sourceNum4, void 0);
  if (__privateGet(this, _config7).select === "time") {
    __privateGet(this, _config7).lastSelectTime = __privateGet(this, _config7).selectVal;
  } else if (__privateGet(this, _config7).select === "threshold") {
    __privateGet(this, _config7).lastSelectThreshold = __privateGet(this, _config7).selectVal;
  } else if (__privateGet(this, _config7).select === "number") {
    __privateGet(this, _config7).lastSelectNumber = __privateGet(this, _config7).selectVal;
  }
  __privateSet(this, _generateNum4, void 0);
};
_from4 = new WeakMap();
_to4 = new WeakMap();
const option$3 = new 合成金属板();
const moe$2 = getLogger("option/合成钢", "moe");
class description {
  constructor(selected, sval, unit, uval) {
    __privateAdd(this, _selected6);
    __privateAdd(this, _sval5);
    __privateAdd(this, _unit5);
    __privateAdd(this, _uval5);
    __publicField(this, "deactivate", "停止自动合成钢");
    __privateSet(this, _selected6, selected);
    __privateSet(this, _sval5, sval);
    __privateSet(this, _unit5, unit);
    __privateSet(this, _uval5, uval);
  }
  get activate() {
    const unitMap = {
      threshold: "%",
      number: "次"
    };
    const uval = __privateGet(this, _uval5).call(this) + unitMap[__privateGet(this, _unit5).call(this)];
    const selected = __privateGet(this, _selected6).call(this);
    const sval = __privateGet(this, _sval5).call(this);
    if (selected === "time") {
      return `可合成${sval}次钢时，合成${uval}钢`;
    } else if (selected === "ironThreshold") {
      return `铁矿达到${sval}%时，合成${uval}钢`;
    } else if (selected === "ironNumber") {
      return `铁矿达到${sval}个时，合成${uval}钢`;
    } else if (selected === "coalThreshold") {
      return `煤矿达到${sval}%时，合成${uval}钢`;
    } else if (selected === "coalNumber") {
      return `煤矿达到${sval}个时，合成${uval}钢`;
    }
    throw new Error("未设置合成钢方式");
  }
}
_selected6 = new WeakMap();
_sval5 = new WeakMap();
_unit5 = new WeakMap();
_uval5 = new WeakMap();
class 合成钢 {
  constructor() {
    __privateAdd(this, _合成钢_instances);
    __publicField(this, "index", 5);
    __publicField(this, "panel", "合成");
    __publicField(this, "name", "自动合成钢");
    __publicField(this, "flag", "合成钢");
    __publicField(this, "crossSaver", true);
    __privateAdd(this, _config8, {
      activate: false,
      select: "coalThreshold",
      selectVal: 95,
      lastSelectTime: 1,
      lastSelectThreshold: 95,
      lastSelectNumber: 100,
      unit: "number",
      unitVal: 1,
      lastUnitThreshold: 95,
      lastUnitNumber: 1
    });
    __publicField(this, "description", new description(
      () => __privateGet(this, _config8).select,
      () => __privateGet(this, _config8).selectVal,
      () => __privateGet(this, _config8).unit,
      () => __privateGet(this, _config8).unitVal
    ));
    // 猫薄荷判断
    __privateAdd(this, _sourceNum5);
    __privateAdd(this, _span6);
    // 合成数量判断
    __privateAdd(this, _generateNum5);
    __privateAdd(this, _generateSelect5, new SelectComponent([
      { value: "threshold", name: "%" },
      { value: "number", name: "次" }
    ]));
    __publicField(this, "period", timeobj.sec(30));
    __privateAdd(this, _fromIron, "iron");
    __privateAdd(this, _fromCoal, "coal");
    __privateAdd(this, _to5, "steel");
  }
  /**
   * ${this.name}${sourceSelectHtml}<span><span>
   * @param config 
   * @param callback 
   * @returns 
   */
  dom(config, callback) {
    if (config) __privateSet(this, _config8, config);
    const select = new SelectComponent([
      { value: "", name: "" },
      { value: "time", name: "可合成次数" },
      { value: "ironThreshold", name: "铁矿阈值" },
      { value: "ironNumber", name: "铁矿数量" },
      { value: "coalThreshold", name: "煤矿阈值" },
      { value: "coalNumber", name: "煤矿数量" }
    ]).create((config == null ? void 0 : config.activate) ? config.select : "", (select2) => {
      if (!select2) {
        __privateMethod(this, _合成钢_instances, deactivate_fn6).call(this);
        __privateGet(this, _config8).activate = false;
        callback(JSON.parse(JSON.stringify(__privateGet(this, _config8))));
      } else {
        if (__privateGet(this, _config8).activate && __privateGet(this, _config8).select === select2) return;
        if (__privateGet(this, _config8).selectVal) {
          if (__privateGet(this, _config8).select === "time") {
            __privateGet(this, _config8).lastSelectTime = __privateGet(this, _config8).selectVal;
          } else if (__privateGet(this, _config8).select === "ironThreshold" || __privateGet(this, _config8).select === "coalThreshold") {
            __privateGet(this, _config8).lastSelectThreshold = __privateGet(this, _config8).selectVal;
          } else if (__privateGet(this, _config8).select === "ironNumber" || __privateGet(this, _config8).select === "coalNumber") {
            __privateGet(this, _config8).lastSelectNumber = __privateGet(this, _config8).selectVal;
          }
        }
        if (select2 === "time") {
          __privateGet(this, _config8).selectVal = __privateGet(this, _config8).lastSelectTime;
        } else if (select2 === "ironThreshold" || select2 === "coalThreshold") {
          __privateGet(this, _config8).selectVal = __privateGet(this, _config8).lastSelectThreshold;
        } else if (select2 === "ironNumber" || select2 === "coalNumber") {
          __privateGet(this, _config8).selectVal = __privateGet(this, _config8).lastSelectNumber;
        }
        __privateGet(this, _config8).activate = true;
        __privateGet(this, _config8).select = select2;
        callback(JSON.parse(JSON.stringify(__privateGet(this, _config8))));
        __privateMethod(this, _合成钢_instances, loadHtml_fn5).call(this, callback);
      }
    });
    __privateSet(this, _span6, $(`<span></span>`));
    if (config == null ? void 0 : config.activate) __privateMethod(this, _合成钢_instances, loadHtml_fn5).call(this, callback);
    const dom = $().add(document.createTextNode(this.name)).add(select).add(__privateGet(this, _span6));
    return dom;
  }
  script() {
    var _a2, _b2;
    if (!__privateGet(this, _config8).activate) return false;
    const game2 = Moe.getInstance().game;
    let isdo = false;
    let msg = "";
    const select = __privateGet(this, _config8).select;
    const sval = __privateGet(this, _config8).selectVal;
    if (select === "time") {
      const time = game2.workshop.getCraftAllCount(__privateGet(this, _to5));
      isdo = time >= sval;
      msg = `可合成次数(${time})已达到设定值(${sval})，`;
    } else if (select === "ironThreshold") {
      const cn = game2.resPool.get(__privateGet(this, _fromIron));
      const threshold = +(cn.value / cn.maxValue * 100).toFixed(1);
      isdo = threshold >= sval;
      msg = `铁矿数量(${threshold}%)达到阈值(${sval}%)，`;
    } else if (select === "ironNumber") {
      const cnVal = game2.resPool.get(__privateGet(this, _fromIron)).value;
      isdo = cnVal >= sval;
      msg = `铁矿数量(${cnVal})已达到设定值(${sval})，`;
    } else if (select === "coalThreshold") {
      const cn = game2.resPool.get(__privateGet(this, _fromCoal));
      const threshold = +(cn.value / cn.maxValue * 100).toFixed(1);
      isdo = threshold >= sval;
      msg = `煤矿数量(${threshold}%)达到阈值(${sval}%)，`;
    } else if (select === "coalNumber") {
      const cnVal = game2.resPool.get(__privateGet(this, _fromCoal)).value;
      isdo = cnVal >= sval;
      msg = `煤矿数量(${cnVal})已达到设定值(${sval})，`;
    }
    if (!isdo) return false;
    const unit = __privateGet(this, _config8).unit;
    const uval = __privateGet(this, _config8).unitVal;
    if (unit === "threshold") {
      const source = game2.workshop.getCraft(__privateGet(this, _to5));
      const price = game2.workshop.getCraftPrice(source);
      const ironPrice = (_a2 = price.find((item) => item.name === "iron")) == null ? void 0 : _a2.val;
      const coalPrice = (_b2 = price.find((item) => item.name === "coal")) == null ? void 0 : _b2.val;
      const ironVal = game2.resPool.get(__privateGet(this, _fromIron)).maxValue;
      const ironMax = Math.floor(ironVal / ironPrice);
      const coalVal = game2.resPool.get(__privateGet(this, _fromCoal)).maxValue;
      const coalMax = Math.floor(coalVal / coalPrice);
      const maxTime = Math.min(ironMax, coalMax);
      const time = Math.floor(maxTime * (uval / 100));
      msg += `尝试合成${time}次(${uval}%)钢`;
      moe$2.debug(msg);
      return game2.workshop.craft(__privateGet(this, _to5), time, true, true, false);
    } else if (unit === "number") {
      msg += `尝试合成${uval}次钢`;
      moe$2.debug(msg);
      return game2.workshop.craft(__privateGet(this, _to5), uval, true, true, false);
    }
    return false;
  }
}
_config8 = new WeakMap();
_sourceNum5 = new WeakMap();
_span6 = new WeakMap();
_generateNum5 = new WeakMap();
_generateSelect5 = new WeakMap();
_合成钢_instances = new WeakSet();
// [--/可合成次数/铁矿数量/铁矿阈值/煤矿数量/煤矿阈值]达到[number](次/个/%)时，合成(铁矿上限)[number][次/%]钢
loadHtml_fn5 = function(callback) {
  if (!__privateGet(this, _config8).activate) return;
  const container = __privateGet(this, _span6);
  container.empty();
  if (__privateGet(this, _config8).select === "time") {
    __privateSet(this, _sourceNum5, new NumInputComponent({ min: 1, step: 1, label: "次" }));
  } else if (__privateGet(this, _config8).select === "ironThreshold" || __privateGet(this, _config8).select === "coalThreshold") {
    __privateSet(this, _sourceNum5, new NumInputComponent({ min: 1, max: 100, step: 1, label: "%" }));
  } else if (__privateGet(this, _config8).select === "ironNumber" || __privateGet(this, _config8).select === "coalNumber") {
    __privateSet(this, _sourceNum5, new NumInputComponent({ min: 1, step: 1, label: "个" }));
  }
  if (__privateGet(this, _config8).unit === "threshold") {
    __privateSet(this, _generateNum5, new NumInputComponent({ min: 1, step: 1, prelabel: "最大可合成次数" }));
  } else if (__privateGet(this, _config8).unit === "number") {
    __privateSet(this, _generateNum5, new NumInputComponent({ min: 1, step: 1 }));
  }
  const sourceNum = __privateGet(this, _sourceNum5).create(__privateGet(this, _config8).selectVal, (val) => {
    __privateGet(this, _config8).selectVal = val;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config8))));
  });
  const generateNum = __privateGet(this, _generateNum5).create(__privateGet(this, _config8).unitVal, (val) => {
    __privateGet(this, _config8).unitVal = val;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config8))));
  });
  const generateSelect = __privateGet(this, _generateSelect5).create(__privateGet(this, _config8).unit, (select) => {
    if (__privateGet(this, _config8).unit === select) return;
    if (__privateGet(this, _config8).unit === "threshold") {
      __privateGet(this, _config8).lastUnitThreshold = __privateGet(this, _config8).unitVal;
    } else if (__privateGet(this, _config8).unit === "number") {
      __privateGet(this, _config8).lastUnitNumber = __privateGet(this, _config8).unitVal;
    }
    if (select === "threshold") {
      __privateGet(this, _config8).unitVal = __privateGet(this, _config8).lastUnitThreshold;
    } else if (select === "number") {
      __privateGet(this, _config8).unitVal = __privateGet(this, _config8).lastUnitNumber;
    }
    __privateGet(this, _config8).unit = select;
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config8))));
    __privateMethod(this, _合成钢_instances, loadHtml_fn5).call(this, callback);
  });
  container.append(
    "达到",
    sourceNum,
    "时，合成",
    generateNum,
    generateSelect,
    "钢"
  );
};
deactivate_fn6 = function() {
  if (!__privateGet(this, _config8).activate) return;
  __privateGet(this, _config8).activate = false;
  __privateGet(this, _span6).empty();
  __privateSet(this, _sourceNum5, void 0);
  if (__privateGet(this, _config8).select === "time") {
    __privateGet(this, _config8).lastSelectTime = __privateGet(this, _config8).selectVal;
  } else if (__privateGet(this, _config8).select === "ironThreshold" || __privateGet(this, _config8).select === "coalThreshold") {
    __privateGet(this, _config8).lastSelectThreshold = __privateGet(this, _config8).selectVal;
  } else if (__privateGet(this, _config8).select === "ironNumber" || __privateGet(this, _config8).select === "coalNumber") {
    __privateGet(this, _config8).lastSelectNumber = __privateGet(this, _config8).selectVal;
  }
  __privateSet(this, _generateNum5, void 0);
};
_fromIron = new WeakMap();
_fromCoal = new WeakMap();
_to5 = new WeakMap();
const option$2 = new 合成钢();
const log$1 = getLogger("option/合成羊皮纸.打猎后", "console");
const moe$1 = getLogger("option/合成羊皮纸.打猎后", "moe");
class 打猎后合成羊皮纸 {
  constructor() {
    __privateAdd(this, _打猎后合成羊皮纸_instances);
    __publicField(this, "index", 14);
    __publicField(this, "panel", "合成");
    __publicField(this, "name", "打猎后合成羊皮纸");
    __publicField(this, "description", {
      activate: "派出猎人后，会自动将毛皮合成为羊皮纸",
      deactivate: ""
    });
    __publicField(this, "flag", "合成羊皮纸-打猎后");
    __publicField(this, "crossSaver", true);
    __privateAdd(this, _config9, {
      activate: false,
      val: 0,
      select: "number"
    });
    __privateAdd(this, _numInput2);
    __privateAdd(this, _container);
    __privateAdd(this, _from5, "furs");
    __privateAdd(this, _to6, "parchment");
  }
  // 打猎后自动合成(可合成次数)[number][次/%]羊皮纸
  dom(config, callback) {
    if (config) __privateSet(this, _config9, config);
    const select = new SelectComponent([
      { value: "number", name: "次" },
      { value: "threshold", name: "%" }
    ]).create(__privateGet(this, _config9).select, (select2) => {
      if (select2 === __privateGet(this, _config9).select) return;
      __privateGet(this, _config9).select = select2;
      callback(JSON.parse(JSON.stringify(__privateGet(this, _config9))), { justUpdate: true });
      __privateMethod(this, _打猎后合成羊皮纸_instances, loadHtml_fn6).call(this, callback);
    });
    __privateSet(this, _container, $(`<span></span>`));
    __privateMethod(this, _打猎后合成羊皮纸_instances, loadHtml_fn6).call(this, callback);
    if (__privateGet(this, _config9).activate) {
      const event = Moe.getInstance().event;
      event.on.hunt(this.flag, () => {
        this.script();
      });
    }
    return $().add(document.createTextNode("打猎后自动合成")).add(__privateGet(this, _container)).add(select).add(document.createTextNode("羊皮纸"));
  }
  /**
   * 执行合成羊皮纸
   * @returns 
   */
  script() {
    if (!__privateGet(this, _config9).activate) return false;
    const game2 = Moe.getInstance().game;
    const select = __privateGet(this, _config9).select;
    const val = __privateGet(this, _config9).val;
    log$1.debug("打猎后合成羊皮纸: ", __privateGet(this, _config9));
    if (select === "threshold") {
      const all = game2.workshop.getCraftAllCount(__privateGet(this, _to6));
      if (all === 0) return false;
      const time = Math.floor(all * (val / 100));
      let result = false;
      if (time > 0) {
        result = game2.workshop.craft(__privateGet(this, _to6), time, true, true, false);
      }
      moe$1.debug(`本次打猎后，可合成羊皮纸${all}次，尝试合成${time}次(${val}%)羊皮纸`);
      return result;
    } else if (select === "number") {
      const cnVal = game2.resPool.get(__privateGet(this, _from5)).value.toFixed(2);
      const result = game2.workshop.craft(__privateGet(this, _to6), val, true, true, false);
      moe$1.debug(`本次打猎后，毛皮数量为${cnVal}，尝试合成${val}次羊皮纸`);
      return result;
    }
    return false;
  }
}
_config9 = new WeakMap();
_numInput2 = new WeakMap();
_container = new WeakMap();
_打猎后合成羊皮纸_instances = new WeakSet();
loadHtml_fn6 = function(callback) {
  let hasDe = false;
  if (__privateGet(this, _config9).select === "number") {
    __privateSet(this, _numInput2, new NumInputComponent({ min: 0, step: 1, label: "次" }));
  } else if (__privateGet(this, _config9).select === "threshold") {
    __privateSet(this, _numInput2, new NumInputComponent({ min: 0, max: 100, step: 1, label: "%", prelabel: "可合成次数" }));
    hasDe = true;
  }
  const container = __privateGet(this, _container);
  container.empty();
  const num = __privateGet(this, _numInput2).create(__privateGet(this, _config9).val, (val) => {
    if (val > 0) {
      if (!__privateGet(this, _config9).activate) {
        __privateGet(this, _config9).activate = true;
        const event = Moe.getInstance().event;
        event.on.hunt(this.flag, () => {
          this.script();
        });
      }
      __privateGet(this, _config9).val = val;
    } else {
      const event = Moe.getInstance().event;
      event.off.hunt(this.flag);
      __privateGet(this, _config9).activate = false;
      __privateGet(this, _config9).val = 0;
    }
    callback(JSON.parse(JSON.stringify(__privateGet(this, _config9))));
  });
  container.append(num, hasDe ? "的" : "");
};
_from5 = new WeakMap();
_to6 = new WeakMap();
const option$1 = new 打猎后合成羊皮纸();
var option;
((option2) => {
  const options = Object.freeze([
    option$c,
    option$b,
    option$a,
    option$9,
    option$8,
    option$7,
    option$6,
    option$5,
    option$4,
    option$3,
    option$2,
    option$1
  ]);
  function load() {
    return options;
  }
  option2.load = load;
})(option || (option = {}));
var Queue;
((Queue2) => {
  const queueFunction = [];
  function isQueueFunction(option2) {
    if (!("label" in option2)) return false;
    if ("onceable" in option2 && "once" in option2 && typeof option2.once === "function") {
      return true;
    }
    if ("repeat" in option2 && typeof option2.repeat === "function" && "until" in option2 && typeof option2.until === "function") {
      return true;
    }
    return false;
  }
  function load() {
    const options = option.load();
    const rs = [...queueFunction];
    for (const option2 of options) {
      if (isQueueFunction(option2)) {
        rs.push(option2);
      }
    }
    return Object.freeze(rs);
  }
  Queue2.load = load;
})(Queue || (Queue = {}));
const log = getLogger("moe", "console");
const moe = getLogger("moe", "moe");
const NAME = "喵喵插件~";
const FLAG = "MOE";
class EventQueue {
  constructor() {
    __publicField(this, "before", {});
    __publicField(this, "after", {});
  }
  on(before, after) {
    const on = function(flag, fn) {
      on.after(flag, fn);
    };
    if (before === "default") before = void 0;
    on.before = before ?? ((flag, fn) => {
      this.before[flag] = fn;
    });
    on.after = after ?? ((flag, fn) => {
      this.after[flag] = fn;
    });
    on.beforeOnce = (flag, fn) => {
      this.before[flag] = (...params) => {
        fn(...params);
        delete this.before[flag];
      };
    };
    on.afterOnce = (flag, fn) => {
      this.after[flag] = (...params) => {
        fn(...params);
        delete this.after[flag];
      };
    };
    return on;
  }
  off(before, after) {
    const off = function(flag) {
      off.after(flag);
    };
    if (before === "default") before = void 0;
    off.before = before ?? ((flag) => {
      delete this.before[flag];
    });
    off.after = after ?? ((flag) => {
      delete this.after[flag];
    });
    return off;
  }
}
function createEventQueueOn(before, after, beforeOnce, afterOnce) {
  return Object.assign(function(...params) {
    after(...params);
  }, {
    before,
    after,
    beforeOnce,
    afterOnce
  });
}
function createEventQueueOff(before, after) {
  return Object.assign(function(...params) {
    after(...params);
  }, {
    before,
    after
  });
}
const _MoeEventManager = class _MoeEventManager {
  constructor() {
    __privateAdd(this, _MoeEventManager_instances);
    __publicField(this, "queue", {
      pause: new EventQueue(),
      render: {},
      import: new EventQueue(),
      unlock: new EventQueue(),
      hunt: new EventQueue(),
      queueAdd: new EventQueue()
    });
    /**
     * 注册/监听游戏事件
     */
    __publicField(this, "on", {
      /**
       * 游戏暂停/恢复事件
       * @param flag 
       * @param fn 
       */
      pause: this.queue.pause.on((flag, fn) => {
        if (flag in this.queue.pause.before) throw new Error(`游戏暂停/恢复(前)监听事件注册失败，标识【${flag}】已存在，请更换标识。`);
        this.queue.pause.before[flag] = fn;
      }, (flag, fn) => {
        if (flag in this.queue.pause.after) throw new Error(`游戏暂停/恢复(后)监听事件注册失败，标识【${flag}】已存在，请更换标识。`);
        this.queue.pause.after[flag] = fn;
      }),
      /**
       * ui渲染事件，渲染tab页时，会传入tabContainer参数，渲染Queue和Log时，无任何入参
       * @param tabId 
       * @param flag 
       * @param fn 
       */
      render: createEventQueueOn((tabId, flag, fn) => {
        const queue = this.queue.render[tabId];
        if (!queue) throw new Error(`【${tabId}】tab不存在，请检查是否加载。`);
        if (flag in queue.before) throw new Error(`${tabId}tab渲染(前)事件注册失败，标识【${flag}】已存在，请更换标识。`);
        queue.before[flag] = fn;
      }, (tabId, flag, fn) => {
        const queue = this.queue.render[tabId];
        if (!queue) throw new Error(`【${tabId}】tab不存在，请检查是否加载。`);
        if (flag in queue.after) throw new Error(`${tabId}tab渲染(后)事件注册失败，标识【${flag}】已存在，请更换标识。`);
        queue.after[flag] = fn;
      }, (tabId, flag, fn) => {
        const queue = this.queue.render[tabId];
        if (!queue) throw new Error(`【${tabId}】tab不存在，请检查是否加载。`);
        if (flag in queue.before) throw new Error(`${tabId}tab渲染(前)事件注册失败，标识【${flag}】已存在，请更换标识。`);
        queue.before[flag] = (tc) => {
          fn(tc);
          delete queue.before[flag];
        };
      }, (tabId, flag, fn) => {
        const queue = this.queue.render[tabId];
        if (!queue) throw new Error(`【${tabId}】tab不存在，请检查是否加载。`);
        if (flag in queue.after) throw new Error(`${tabId}tab渲染(后)事件注册失败，标识【${flag}】已存在，请更换标识。`);
        queue.after[flag] = (tc) => {
          fn(tc);
          delete queue.after[flag];
        };
      }),
      /**
       * 游戏存档导入事件
       * @param flag 
       * @param fn 
       */
      import: this.queue.import.on((flag, fn) => {
        if (flag in this.queue.import.before) throw new Error(`游戏存档导入(前)事件注册失败，标识【${flag}】已存在，请更换标识。`);
        this.queue.import.before[flag] = fn;
      }, (flag, fn) => {
        if (flag in this.queue.import.after) throw new Error(`游戏存档导入(后)事件注册失败，标识【${flag}】已存在，请更换标识。`);
        this.queue.import.after[flag] = fn;
      }),
      /**
       * 游戏解锁事件
       * @param flag 
       * @param fn 
       */
      unlock: this.queue.unlock.on((flag, fn) => {
        if (flag in this.queue.unlock.before) throw new Error(`游戏解锁(前)事件注册失败，标识【${flag}】已存在，请更换标识。`);
        this.queue.unlock.before[flag] = fn;
      }, (flag, fn) => {
        if (flag in this.queue.unlock.after) throw new Error(`游戏解锁(后)事件注册失败，标识【${flag}】已存在，请更换标识。`);
        this.queue.unlock.after[flag] = fn;
      }),
      /**
       * 派出猎人事件
       * @param flag 
       * @param fn 
       */
      hunt: this.queue.hunt.on((flag, fn) => {
        if (flag in this.queue.hunt.before) throw new Error(`派出猎人(前)事件注册失败，标识【${flag}】已存在，请更换标识。`);
        this.queue.hunt.before[flag] = fn;
      }, (flag, fn) => {
        if (flag in this.queue.hunt.after) throw new Error(`派出猎人(后)事件注册失败，标识【${flag}】已存在，请更换标识。`);
        this.queue.hunt.after[flag] = fn;
      }),
      /**
       * 添加任务队列事件
       * @param flag 
       * @param fn 
       */
      queueAdd: this.queue.queueAdd.on((flag, fn) => {
        if (flag in this.queue.queueAdd.before) throw new Error(`添加任务队列(前)事件注册失败，标识【${flag}】已存在，请更换标识。`);
        this.queue.queueAdd.before[flag] = fn;
      }, (flag, fn) => {
        if (flag in this.queue.queueAdd.after) throw new Error(`添加任务队列(后)事件注册失败，标识【${flag}】已存在，请更换标识。`);
        this.queue.queueAdd.after[flag] = fn;
      })
    });
    /**
     * 解除监听
     */
    __publicField(this, "off", {
      pause: this.queue.pause.off(),
      render: createEventQueueOff((tabId, flag) => {
        const queue = this.queue.render[tabId];
        if (!queue) return;
        delete queue.before[flag];
      }, (tabId, flag) => {
        const queue = this.queue.render[tabId];
        if (!queue) return;
        delete queue.after[flag];
      }),
      import: this.queue.import.off(),
      unlock: this.queue.unlock.off(),
      hunt: this.queue.hunt.off(),
      queueAdd: this.queue.queueAdd.off()
    });
  }
  static getInstance() {
    var _a2, _b2, _c2, _d2, _e, _f;
    if (!_MoeEventManager.instance) {
      _MoeEventManager.instance = new _MoeEventManager();
      __privateMethod(_a2 = _MoeEventManager.instance, _MoeEventManager_instances, pause_fn).call(_a2);
      __privateMethod(_b2 = _MoeEventManager.instance, _MoeEventManager_instances, tabRender_fn).call(_b2);
      __privateMethod(_c2 = _MoeEventManager.instance, _MoeEventManager_instances, import_fn).call(_c2);
      __privateMethod(_d2 = _MoeEventManager.instance, _MoeEventManager_instances, unlock_fn).call(_d2);
      __privateMethod(_e = _MoeEventManager.instance, _MoeEventManager_instances, hunt_fn).call(_e);
      __privateMethod(_f = _MoeEventManager.instance, _MoeEventManager_instances, addQueue_fn).call(_f);
    }
    return _MoeEventManager.instance;
  }
  /**
   * 因为game.village.gainHuntRes打猎没有消耗喵力，所以这里写一个打猎事件
   * 该打猎事件，模拟game.village.huntAll实现
   * @param squads 打猎次数
   */
  hunt(squads) {
    if (squads <= 0) {
      return;
    }
    const res = game.resPool.get("manpower");
    const power = squads * 100;
    if (res.value < power) {
      moe.error(`喵力不足，无法执行打猎${squads}次事件`);
      return;
    }
    game.resPool.addResEvent("manpower", -power);
    game.village.gainHuntRes(squads);
    if (squads >= 1e3) {
      const challenge = game.challenges.getChallenge("pacifism");
      if (!challenge.unlocked) {
        challenge.unlocked = true;
      }
    }
  }
  /**
   * 导出游戏存档
   * @returns 
   */
  save() {
    var data = game.save();
    data = JSON.stringify(data);
    return game.compressLZData(data);
  }
};
_MoeEventManager_instances = new WeakSet();
run_fn2 = function(event, oqueue, ...params) {
  const flags = Object.keys(oqueue);
  for (const flag of flags) {
    try {
      const fn = oqueue[flag];
      if (fn) fn(...params);
    } catch (e) {
      moe.error(`执行[${event}]事件时组件${flag}发生错误，详细信息请到浏览器控制台查看。`);
      log.error(`执行[${event}]事件时组件${flag}发生错误:`, e);
    }
  }
};
/**
 * 游戏暂停/恢复事件
 */
pause_fn = function() {
  const togglePause = game.togglePause;
  game.togglePause = () => {
    __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, "游戏暂停/恢复(前)", this.queue.pause.before, game.isPaused);
    togglePause.apply(game);
    __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, "游戏暂停/恢复(后)", this.queue.pause.after, game.isPaused);
  };
};
/**
 * 游戏ui(tab)渲染事件
 */
tabRender_fn = function() {
  const tabs = game.tabs;
  for (const tab of tabs) {
    const id = tab.tabId;
    const render = tab.render;
    this.queue.render[id] = new EventQueue();
    tab.render = (tabContainer) => {
      var _a2, _b2;
      __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, `${tab.tabName}tab渲染(前)`, ((_a2 = this.queue.render[id]) == null ? void 0 : _a2.before) ?? {}, tabContainer);
      render.call(tab, tabContainer);
      __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, `${tab.tabName}tab渲染(后)`, ((_b2 = this.queue.render[id]) == null ? void 0 : _b2.after) ?? {}, tabContainer);
    };
  }
  if (game.ui.loadQueue) {
    const queueLoader = game.ui.loadQueue;
    this.queue.render["Queue"] = new EventQueue();
    game.ui.loadQueue = () => {
      var _a2, _b2;
      __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, "任务队列渲染(前)", ((_a2 = this.queue.render["Queue"]) == null ? void 0 : _a2.before) ?? {});
      queueLoader.call(game.ui);
      __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, "任务队列渲染(后)", ((_b2 = this.queue.render["Queue"]) == null ? void 0 : _b2.after) ?? {});
    };
    const logLoader = game.ui.loadLog;
    this.queue.render["Log"] = new EventQueue();
    game.ui.loadLog = () => {
      var _a2, _b2;
      __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, "日志渲染(前)", ((_a2 = this.queue.render["Log"]) == null ? void 0 : _a2.before) ?? {});
      logLoader.call(game.ui);
      __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, "日志渲染(后)", ((_b2 = this.queue.render["Log"]) == null ? void 0 : _b2.after) ?? {});
    };
  }
};
/**
 * 游戏存档导入事件
 */
import_fn = function() {
  const saveImport = game.saveImportDropboxText;
  game.saveImportDropboxText = (save, callback) => {
    saveImport.call(game, save, (e) => {
      __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, "游戏导入(前)", this.queue.import.before, save);
      callback(e);
      __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, "游戏导入(后)", this.queue.import.after, save);
    });
  };
};
/**
 * 游戏解锁事件
 */
unlock_fn = function() {
  const unlock = game.unlock;
  game.unlock = (lock) => {
    __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, "解锁(前)", this.queue.unlock.before, lock);
    unlock.call(game, lock);
    __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, "解锁(后)", this.queue.unlock.after, lock);
  };
};
hunt_fn = function() {
  const hunt = game.village.gainHuntRes;
  game.village.gainHuntRes = (huntCount) => {
    __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, "派出猎人(前)", this.queue.hunt.before, huntCount);
    hunt.call(game.village, huntCount);
    __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, "派出猎人(后)", this.queue.hunt.after, huntCount);
  };
};
/**
 * 
 * @returns 任务队列添加事件
 */
addQueue_fn = function() {
  if (!game.time.queue) return;
  const addToQueue = game.time.queue.addToQueue;
  game.time.queue.addToQueue = (name, type, label, addAll) => {
    __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, "添加任务队列(前)", this.queue.queueAdd.before, name, type, label, addAll);
    addToQueue.call(game.time.queue, name, type, label, addAll);
    __privateMethod(this, _MoeEventManager_instances, run_fn2).call(this, "添加任务队列(后)", this.queue.queueAdd.after, name, type, label, addAll);
  };
};
__publicField(_MoeEventManager, "instance");
let MoeEventManager = _MoeEventManager;
const _Moe = class _Moe {
  constructor() {
    __privateAdd(this, _Moe_instances);
    __privateAdd(this, _interval);
    __privateAdd(this, _timers, {
      min: {
        time: 60,
        // 每分钟60秒
        timers: []
      },
      sec: {
        time: 1,
        // 每秒1秒
        timers: []
      }
    });
    /**
     * 游戏中的事件控制器
     */
    __publicField(this, "event", MoeEventManager.getInstance());
    /**
     * moe的选项，用于在浏览器控制台中查看
     */
    __publicField(this, "options");
  }
  static getInstance() {
    if (!_Moe.instance) {
      _Moe.instance = new _Moe();
      unsafeWindow.moe = _Moe.instance;
    }
    return _Moe.instance;
  }
  get game() {
    return game;
  }
  run() {
    log.info(`加载【${NAME}】`);
    this.event.on.pause(FLAG, (isPaused) => {
      if (isPaused) {
        __privateMethod(this, _Moe_instances, stopLoop_fn).call(this);
      } else {
        __privateMethod(this, _Moe_instances, startLoop_fn).call(this);
      }
    });
    this.event.on.unlock(FLAG, (lock) => {
      log.debug("触发解锁事件:", lock);
      const keys = Object.keys(lock);
      for (const key of keys) {
        if (!["tabs", "tech", "buildings", "jobs", "pacts", "chronoforge", "policies", "upgrades", "crafts", "zebraUpgrades"].includes(key)) {
          moe.error(`检测到新的解锁项LockType: ${key}，请到控制台查看详细信息。`);
          return;
        }
      }
    });
    view.init();
    log.info("加载可执行操作。");
    const options = option.load();
    this.options = options;
    setting.init(this.game, options);
    const viewTimeCreater = view.addOptions(options);
    this.addTimerCreater(viewTimeCreater);
    __privateMethod(this, _Moe_instances, startLoop_fn).call(this);
  }
  addTimerCreater(creator) {
    if (creator.sec) {
      __privateGet(this, _timers).sec.timers.push(creator.sec());
    }
    if (creator.min) {
      __privateGet(this, _timers).min.timers.push(creator.min());
    }
  }
};
_interval = new WeakMap();
_timers = new WeakMap();
_Moe_instances = new WeakSet();
/**
 * 开启事件循环
 */
startLoop_fn = function() {
  if (__privateGet(this, _interval)) return;
  __privateSet(this, _interval, setInterval(() => {
    const secTimers = __privateGet(this, _timers).sec.timers;
    for (const secTimer of secTimers) {
      try {
        secTimer();
      } catch (e) {
        log.error("执行秒级事件时发生错误:", e);
      }
    }
    const min2 = __privateGet(this, _timers).min;
    min2.time--;
    if (min2.time <= 0) {
      min2.time = 60;
      for (const minTimer of min2.timers) {
        try {
          minTimer();
        } catch (e) {
          log.error("执行分钟级事件时发生错误:", e);
        }
      }
    }
  }, 1e3));
};
/**
 * 停止事件循环
 */
stopLoop_fn = function() {
  if (__privateGet(this, _interval)) {
    clearInterval(__privateGet(this, _interval));
    __privateSet(this, _interval, void 0);
  }
};
__publicField(_Moe, "instance");
let Moe = _Moe;
async function createMoe() {
  return new Promise((resolve) => {
    let originalInitGame;
    function customInitGame() {
      if (originalInitGame) originalInitGame();
      log.info("游戏初始化完成~~");
      resolve(Moe.getInstance());
    }
    function overrideInitGame() {
      if (typeof initGame !== "undefined") {
        originalInitGame = initGame;
        unsafeWindow.initGame = customInitGame;
      } else {
        setTimeout(overrideInitGame, 100);
      }
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", overrideInitGame);
    } else {
      overrideInitGame();
    }
  });
}
(async function() {
  const moe2 = await createMoe();
  moe2.run();
})();
