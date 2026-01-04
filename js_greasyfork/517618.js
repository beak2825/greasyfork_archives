// ==UserScript==
// @name         Bangumi-Custom Staff Sorting and Collapsing
// @name:zh-CN   班固米-条目职位自定义排序与折叠
// @version      1.4.5-2.2
// @description  Customize the sorting and collapsing of staff roles in all types of subjects
// @author       weiduhuo
// @namespace    https://github.com/weiduhuo/scripts
// @match        *://bgm.tv/subject/*
// @match        *://bgm.tv/character/*
// @match        *://bgm.tv/person/*
// @match        *://bgm.tv/settings/privacy*
// @match        *://bangumi.tv/subject/*
// @match        *://bangumi.tv/character/*
// @match        *://bangumi.tv/person/*
// @match        *://bangumi.tv/settings/privacy*
// @match        *://chii.in/subject/*
// @match        *://chii.in/character/*
// @match        *://chii.in/person/*
// @match        *://chii.in/settings/privacy*
// @grant        none
// @license      MIT
// @description:zh-CN  对所有类型条目的制作人员信息进行职位的自定义排序与折叠，可在[设置-隐私]页面进行相关设置
// @downloadURL https://update.greasyfork.org/scripts/517618/Bangumi-Custom%20Staff%20Sorting%20and%20Collapsing.user.js
// @updateURL https://update.greasyfork.org/scripts/517618/Bangumi-Custom%20Staff%20Sorting%20and%20Collapsing.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const SCRIPT_NAME = '班固米-职位排序组件';
  const CURRENT_DATA_VERSION = '2.2';
  const DEBUG = false;

  /** 自定义`console` (避免重写妨碍其他脚本正常使用`console`) */
  const C = {
    log: console.log,
    error: console.error,
    // DEBUG模式下，阻断console的相关操作
    debug: DEBUG ? console.debug : function () {},
    time: DEBUG ? console.time : function () {},
    timeEnd: DEBUG ? console.timeEnd : function () {},
  }

  /** 排序延迟时间 */
  const SORTING_DELAY = 0; // 数值0仍然有意义，将延迟到所有同步脚本之后执行
  /** 防抖延迟时间 */
  const DEBOUNCE_DELAY = 500;
  /** 是否对职位信息进行了折叠，忽略网页自身`sub_group`的折叠 (依此判断 `更多制作人员` 开关的必要性) */
  let hasFolded = false;
  /** 尾部折叠图标的激活阈值相对于视口高度的系数 */
  const sideTipRate = 0.25;
  /** @type {number} 尾部折叠图标的激活行数阈值 */
  let sideTipLineThr = null;
  /** @type {Array<HTMLElement> | null} 最后一组`sub_group`的数据包 */
  let lastGroup = null;
  /** `infobox`以被折叠元素结尾 */
  let endWithFold = false;

  /**
   * 图标，已在`loadStaffStyle`中通过父元素类名`staff_sorting_icon`约束所显示的范围
   */
  const ICON = {
    /** 三角形顶点向右，可表展开按键 */
    TRIANGLE_RIGHT: `
      <svg xmlns='http://www.w3.org/2000/svg' viewbox='0 0 13 13' height='0.7em'>
        <polygon points='0.5,0 12.5,6.5 0.5,13'  fill='currentColor' />
      </svg>
    `,
    /** 三角形顶点向下，可表折叠按键 */
    TRIANGLE_DOWN: `
      <svg xmlns='http://www.w3.org/2000/svg' viewbox='0 0 13 13' height='0.7em'>
        <polygon points='0,0.5 13,0.5 6.5,12.5'  fill='currentColor' />
      </svg>
    `,
    /** 三角形顶点向上，可表折叠按键 */
    TRIANGLE_UP: `
      <svg xmlns='http://www.w3.org/2000/svg' viewbox='0 0 13 13' height='0.7em'>
        <polygon points='0,12.5 13,12.5 6.5,0.5'  fill='currentColor' />
      </svg>
    `,
    /** 加号，可表展开按键 */
    PLUS: `
      <svg xmlns='http://www.w3.org/2000/svg' viewbox='0 0 10 10' width='100%' height='100%'>
        <polygon points='1,4 9,4 9,6 1,6' fill='currentColor' />
        <polygon points='4,1 6,1 6,9 4,9' fill='currentColor' />
      </svg>
    `,
  };

  /**
   * 枚举所支持的条目类型
   */
  const SubjectType = {
    // 所支持的类型
    ANIME: {en: 'anime', zh: '动画'},
    BOOK: {en: 'book', zh: '书籍'},
    MUSIC: {en: 'music', zh: '音乐'},
    GAME: {en: 'game', zh: '游戏'},
    REAL: {en: 'real', zh: '三次元'},
    CHARACTER: {en: 'character', zh: '角色'},
    PERSON: {en: 'person', zh: '人物'},
    /**
     * @param {boolean} [isObj=false] - `true`时返回对象序列，`false`时返回英文序列
     * @returns {{ en: string, zh: string }[] | string[]}
     */
    getAll(isObj = false) {
      if (isObj) return utils.filterEnumValues(this);
      else return utils.filterEnumValues(this).map(item => item.en);
    },
    /** @returns {string | null} 有效则返回原数值，无效则返回空 */
    parse(value) {
      if (this.getAll().includes(value)) return value;
      return null;
    },
    needPrase(value) {
      return value !== this.CHARACTER.en && value !== this.PERSON.en;
    },
  };

  /**
   * 枚举各类型条目的排序折叠功能启用状态
   */
  const SortEnableState = {
    /** 全部功能禁用 */
    ALL_DISABLED: 'allDisable',
    /** 启用部分功能，仅排序不折叠 */
    PARTIAL_ENABLED: 'partialEnable',
    /** 启用全部功能 */
    ALL_ENABLED: 'allEnable',
    /**  @returns {Array<string>} */
    getAll() {
      return utils.filterEnumValues(this);
    },
  };

  /**
   * 枚举二次折叠的开关的可选位置 (相对于职位名称)
   */
  const RefoldSwitchPosition = {
    NONE: 'none',
    LEFT: 'left',
    RIGHT: 'right',
    /**  @returns {Array<string>} */
    getAll() {
      return utils.filterEnumValues(this);
    },
  }

  /**
   * 管理`localStorage`的键名与初值。
   * 键值分为全局配置与各类型条目配置、简单类型与复杂类型
   */
  const Key = {
    /** 键名前缀 */
    KEY_PREF: 'BangumiStaffSorting',
    /** 数据版本 */
    DATA_VERSION: '_dataVersion__',

    /** 超过此行数的职位信息将被二次折叠*/
    REFOLD_THRESHOLD_KEY: '_refoldThreshold__',
    REFOLD_THRESHOLD_OLD_KEY: 'refoldThreshold',
    REFOLD_THRESHOLD_DEFAULT: 4,
    REFOLD_THRESHOLD_DISABLED: 0,

    /** 是否继承历史的匹配记录 */
    INHERIT_PREVIOUS_MATCHES_KEY: '_inheritPreMatches__',
    INHERIT_PREVIOUS_MATCHES_DEFAULT: true,

    /** 二次折叠的开关位置 */
    REFOLD_SWITCH_POSITION_KEY: '_refoldSwitchPosition__',
    REFOLD_SWITCH_POSITION_DEFAULT: RefoldSwitchPosition.RIGHT,

    /** 各类型条目模块的展开状态 */
    BLOCK_OPEN_KEY: 'BlockOpen',
    BLOCK_OPEN_OLD_KEY: 'blockOpen', // dataVerion < 1.4
    BLOCK_OPEN_DEFAULT: false,

    /** 各类型条目的功能启用状态 */
    ENABLE_STATE_KEY: 'EnableState',
    ENABLE_STATE_DEFAULT: SortEnableState.ALL_ENABLED,

    /** 各类型条目的自定义排序与折叠 (复杂类型，参见 {@link StaffMapListType}) */
    STAFF_MAP_LIST_KEY: 'StaffMapList',
    /** 职位排序索引的分组映射 (复杂类型，参见 {@link jobOrderMapType}) */
    JOB_ORDER_MAP_KEY: 'JobOrderMap',
    
    /** 当前使用的键值的所属条目类型 (可即时切换) */
    _subType: null,

    makeKey(key, type = null) {
      this.setSubType(type);
      if (this.isGlobalData(key)) return `${this.KEY_PREF}_${key}`;
      else return `${this.KEY_PREF}_${this._subType}${key}`;
    },
    setSubType(type) {
      if (type) this._subType = type;
    },
    isComplexData(key) {
      return [
        this.STAFF_MAP_LIST_KEY, this.JOB_ORDER_MAP_KEY,
      ].includes(key);
    },
    isGlobalData(key) {
      return [
        this.DATA_VERSION, this.INHERIT_PREVIOUS_MATCHES_KEY,
        this.REFOLD_THRESHOLD_KEY,  this.REFOLD_THRESHOLD_OLD_KEY,
        this.REFOLD_SWITCH_POSITION_KEY,
      ].includes(key);
    }
  }

  /**
   * 配置存储，提供`localStorage`的接口。
   * 仅对简单数据类型进行解析、编码、缓存，复杂数据类型放权给外部
   * (为便于进行防抖动绑定，由对象类型改为静态类实现)
   */
  class Store {
    /** 数据缓存，仅对简单类型的键值 */
    static _cache = {};
    /** 需要对数据进行更新 */
    static updateRequired = false;
    /** 定义防抖逻辑的占位 (忽略短时间内改变多对键值的极端情况) */
    static debouncedSet;

    /** 为缺损的配置进行初始化 */
    static initialize() {
      // 缓存初始化
      Store._cache = {};
      // 绑定防抖逻辑，确保 this 指向 Store
      Store.debouncedSet = debounce(Store._set.bind(this));
      // 全局配置初始化
      ['REFOLD_THRESHOLD', 'INHERIT_PREVIOUS_MATCHES', 'REFOLD_SWITCH_POSITION'].forEach(
        (key) => Store._setDefault(key)
      );
      // 局部配置初始化
      SubjectType.getAll().forEach((type) => {
        ['BLOCK_OPEN', 'ENABLE_STATE'].forEach(
          (key) => Store._setDefault(key, type)
        );
      });
      // 检查数据版本
      if (Store.get(Key.DATA_VERSION) !== CURRENT_DATA_VERSION) {
        Store.updateRequired = true;
        Store.preProcessConfigUpdate();
      }
    }

    /** 版本变更，重要配置更新，主任务前执行 */
    static preProcessConfigUpdate() {
      // 键名变更，重要数据进行继承
      if (Store.get(Key.DATA_VERSION) < '1.4') { // 已涵盖 null
        // 变更了全局配置的键名格式
        const preRefoldThreshold = Store.get(Key.REFOLD_THRESHOLD_OLD_KEY);
        if (preRefoldThreshold !== null) {
          Store.set(Key.REFOLD_THRESHOLD_KEY, preRefoldThreshold);
        }
      }
    }

    /** 版本变更，次要配置更新，主任务后执行 */
    static postProcessConfigUpdate() {
      if (!Store.updateRequired) return;
      const preDataVer = Store.get(Key.DATA_VERSION);
      C.log(`${SCRIPT_NAME}：数据版本 ${preDataVer} > ${CURRENT_DATA_VERSION} 更新中...`);
      
      // [固定]对默认设置的解析缓存进行更新
      SubjectType.getAll().forEach((type) => {
        const jsonStr = Store.get(Key.STAFF_MAP_LIST_KEY, type);
        if (jsonStr) return; // 跳过自定义设置
        const staffMapList = new StaffMapList(type);
        staffMapList.initialize(null, true);
        if (Store.get(Key.INHERIT_PREVIOUS_MATCHES_KEY)) staffMapList.inheritPreMatches();
        staffMapList.saveResolvedData();
      });
      // [暂时]删除旧有的键值对，低价值数据直接丢弃
      if (preDataVer < '1.4') {
        // 已完成继承
        Store.remove(Key.REFOLD_THRESHOLD_OLD_KEY);
        // 模块的展开状态键名变更
        SubjectType.getAll().forEach((type) => {
          Store.remove(Key.BLOCK_OPEN_OLD_KEY, type);
        });
        // 旧有的异步通信接口
        Store.removeByPrefix(`${Key.KEY_PREF}Interface`);
      }

      // 更新全部完毕后再修改版本号，防止被提前终止
      Store.set(Key.DATA_VERSION, CURRENT_DATA_VERSION);
      C.log(`${SCRIPT_NAME}：数据更新成功`);
    }

    static removeByPrefix(pref) {
      // 将键名缓存到数组中，避免遍历过程中修改 localStorage 导致索引混乱
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(pref)) keysToRemove.push(key);
      }
      // 遍历并删除匹配的键
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    }

    static _setDefault(_key, type = null) {
      if (this.get(Key[`${_key}_KEY`], type) === null)
        this.set(Key[`${_key}_KEY`], Key[`${_key}_DEFAULT`]);
    }

    static set(key, value, type = null, isHighFreq = false) {
      if (isHighFreq) this.debouncedSet(key, value, type);
      else this._set(key, value, type);
    }

    static _set(key, value, type = null) {
      Key.setSubType(type);
      const fullKey = Key.makeKey(key);
      if (!Key.isComplexData(key)) {
        this._cache[fullKey] = value; // 同步到缓存 (注意缓存的需是原始数据)
        value = JSON.stringify(value);
      }
      localStorage.setItem(fullKey, value);
    }

    /** 仅修改缓存 */
    static setCache(key, value, type = null) {
      Key.setSubType(type);
      const fullKey = Key.makeKey(key);
      this._cache[fullKey] = value;
    }

    static get(key, type = null) {
      Key.setSubType(type);
      const fullKey = Key.makeKey(key);
      // 简单数据类型，命中缓存
      if (!Key.isComplexData() && Store._isCacheHit(fullKey)) {
        // C.debug(`HIT CHACHE - ${fullKey}: ${this._cache[fullKey]}`);
        return this._cache[fullKey];
      }
      // 无缓存，读取并缓存
      const value = localStorage.getItem(fullKey);
      if (Key.isComplexData(key)) return value;
      const parsedValue = JSON.parse(value);
      this._cache[fullKey] = parsedValue;
      return parsedValue;
    }

    static remove(key, type = null) {
      Key.setSubType(type);
      const fullKey = Key.makeKey(key);
      // 同时删除缓存与数据
      delete this._cache[fullKey];
      localStorage.removeItem(fullKey);
    }

    static _isCacheHit(fullKey) {
      return Object.prototype.hasOwnProperty.call(this._cache, fullKey);
    }
  }

  /**
   * 包含`RegExp`元素的`JSON`格式化字符串。
   * 1. 用于`StaffMapList`解析、编码，其最短的有效字符串为`"[]"`，示设置空缺。
   * 2. 用于`JobOrderMap`编码，由于其只在规定区域内还有`RegExp`元素，
   *    全局使用`reviver`解析性能较低，故单独处理
   */
  const RegexInJSON = {
    regexPattern: /^\/(.+)\/([gimsuy]*)$/,
    /**
     * 解析`StaffMapList`字符串。
     * 用于初步解析与有效性检测，
     * 更进一步的解析，将在`StaffMapList`中进行。
     * 仅检查：
     *   1. 是否满足`JSON`格式
     *   2. 是否为数组类型
     *   3. 字符串样式的正则表达式，是否满足规定格式
     * @returns {Array | null} 空值表失败
     */
    parse(text) {
      let parsedData;
      try {
        parsedData = JSON.parse(text, this._reviver);
      } catch (e) {
        C.error(`${SCRIPT_NAME}：StaffMapList 解析失败 - ${e}`);
        return null;
      }
      if (!utils.isArray(parsedData)) {
        C.error(`${SCRIPT_NAME}：StaffMapList 类型错误 - 非数组类型`);
        return null;
      }
      return parsedData;
    },

    /**
     * 将`RegexInList`转为`JSON`格式化字符串
     * @param {string | number | undefined} space
     */
    stringify(data, space) {
      return JSON.stringify(data, this._replacer, space);
    },

    /** 解析`JSON`字符串中的正则表达式 */
    _reviver(key, value) {
      if (utils.isString(value) && value.startsWith('/')) {
        const match = value.match(RegexInJSON.regexPattern);
        if (!match) {
          throw new Error(`正则表达式 "${value}" 不符合 ${RegexInJSON.regexPattern} 格式`);
        } try {
          return new RegExp(match[1], match[2]);
        } catch (e) {
          throw new Error(`正则表达式 "${value}" 非法 - ${e}`);
        }
      }
      return value;
    },

    /** 将正则表达式转化为字符串，以满足`JSON`格式 */
    _replacer(key, value) {
      if (utils.isRegExp(value)) return value.toString();
      return value;
    },
  }

  /**
   * 职位排序与折叠设置，是职位排序与默认折叠的职位二者信息的复合 (此为原罪)。
   * 其有两种表现形式：
   * 1. `StaffMapList`，即`this.data`，面向用户，结构简明直接，供用户自定义编辑。
   * 2. `JobOrderMap`，面向程序，来自对`StaffMapList`的解析与历史匹配记录。
   *    由`this.{exactOrderMap, regexOrderList, insertUnmatched, insertSubGroup}`组成
   */
  class StaffMapList {
    /**
     * @typedef {string | RegExp | number} MatchJob
     * - 匹配职位名称，其中`number`表示紧邻其后`RegExp`的匹配优先级 (解析时实则为弱关联，不需严格相邻)
     * @typedef {Array<MatchJob | [boolean | MatchJob, ...MatchJob[]]>} StaffMapListType
     * - 其中`boolean`表示子序列内的职位是否默认折叠，缺损值为`false`，需位于子序列的首位才有意义
     *   (默认配置中`,,`表示在`JSON`数组中插入`null`元素，用于输出格式化文本时标记换行)
     * 
     * @typedef {Object} jobOrderMapType
     * - 是一张分组映射表，用于映射匹配职位的序列号，初值为`StaffMapList`的解析数据。
     *   其中序列号`number`的大小表示该匹配职位的次序，奇偶表示该匹配职位是否默认折叠。
     *   (由原先的`Map<MatchJob, number>`整表改进而为分组表，极大减少了解析与维护开销)
     * @property {Object<string, number>} exact - 精确匹配，
     *   以及用于缓存正则匹配、插入未被匹配的历史记录，并于任务结束后写入`Store`
     * @property {Array<[RegExp, number]>} regex - 正则匹配，
     *   基于需遍历使用、对象类型的键不得为字符串以外的类型，采用键值对数组
     * @property {Object<string, number>} insert - 插入匹配，
     *   目前有插入未被匹配的职位信息、插入二级职位引导信息 (后者的优先级更高，且高于其他匹配)
     */
    
    /** 未被匹配职位信息的插入前缀`'=='` */
    static _insertUnmatchedPref = '==';
    /** 二级职位引导信息的插入前缀`'>>'` */
    static _insertSubGroupPref = '>>';
    /** 正则匹配优先级缺损值 */
    static _defaultRegexPriority = 100;
    /** 懒加载的默认配置 */
    static _defaultLazyData = {
      [SubjectType.ANIME.en]: () => [,
        "===【注释】正则匹配优先级：缺损-100, dd-优先于缺损, 20d-`宣`相关, 30d-`3D`相关, 40d-`设`相关, 50d-`画`相关, 60d-`音`相关, 70d-`色`相关, 80d-`制`相关, 9dd-兜底 ===",,
        ,
        "中文名", /^(罗马|拼音|索引)名$/, [true, "英文名", "别名", /.+名$/],, // 联动罗马名获取组件
        "类型", "适合年龄", /国家|地区/, "语言", "对白", /话数/, [true, "季数"], /(片|时)长/,,
        "放送开始", /开始|放送|播出/, 90, /放送星期/, "放送时间", /(上|公)映/, /发售/,,
        ,
        "原作", "原著", "原案", "故事原案", /原作插(图|绘)?/, [true, /原作/, /连载|連載/],, // ?'原案'可复指'故事/人物原案'
        "团长", "超监督", "系列监督", "总监督", "总导演",,
        "导演", "监督", "联合导演", "副导演", [true, /^((OP|ED).*)?(执行|主任).*导演/, 990, /导演助/],,
        "系列构成", "剧本统筹", /系列|构成|大纲/,,
        201, /(脚|剧)本|编剧|故事|主笔|文(艺|芸|案)|脚色/, 990, /内容/, [true, 601, /对白|台词/],,
        21, /分镜|故事[板版]|台本/, "OP・ED 分镜", "氛围稿", /氛围|Image ?Board|イメージボード/i,,
        /^(主|总)演出$/, "演出", "演出制作", /(片(头|尾)|OP|ED)演出/, [true, "演出助理", /^演出助/],,
        /(人物|角色).*原案/, 400, /(人物|角色).*[设設]/, [true, 983, /人物|角色/],,
        ,
        /^(主要?动画师|总作画)$/, "总作画监督", /(作|原)画总监/, [true, "总作画监督助理"], /机械导演/,,
        [false, "作画监督"], 501, /(机械|动作|特效)?(作|原|操)画.*(导演|监)|作监$/,,
        [true, "作画监督助理", 500, /作画?[监監]督?(助|補|.+佐|协力)/],,
        "设定", 405, /[设設]定/, [true, 989, /机械/],,
        507, /[设設]计|Design|デザイン/i, 989, /原案/, /字(符|体)|icon|アイコン|logo|ロゴ/i,,
        507, /构图|Layout/i, [true, 502, /操画/], [false, "原画", "原画师"],,
        [true, "第二原画", /(作|原)画监?修|修型/],,
        /作画特殊?效果?/, 987, /(作|原)画|绘制/, /数码绘图/,
        [false, 500, /[动動]画?.*(检查?|チェック)/], [true, "补间动画", "扫描", "描线"],,
        508, /[动動]画/,,
        ,
        /(美|艺)[术術].*(导演|[監监]督|总监|主管|括)/, [true, 90, /美[术術]?[監监]督?(助|補|.+佐)/],,
        "主美", 406, /概念(美|艺)术|视觉概念/, /美术设(计|定)/, /美[术術](board|板|ボード)/,,
        /(场|布)景设计/, [false, "背景美术", /^美[术術]$/, 506, /(场|布|绘|制)景/, 983, /景/],,
        [false, 507, /(美|艺)[术術]|アート|ART WORK/i],,
        [true, /美[术術]((辅|补)佐|[协協]力)/], [true, /原图整理/], [/工艺|创意/],,
        ,
        /色彩(导演|监督|总监)/, /色彩.*设(计|定)/, [true, 90, /色彩设计.+佐/],,
        20, /色彩((脚|剧)本|故事[板版]|演出)|Color ?Script|カラースクリプト/i,,
        [false, /色彩?指定/, 700, /[色仕].?[检検校]/], [true, "上色", 701, /色彩|仕上/, 984, /色/],,
        ,
        301, /(CGI?|3D|三维|立体|电脑).*(导演|[監监]督|总监|主管|统|ディレクター)/, /^(3D ?CGI?|三维)$/,,
        /(CGI?|3D).*演出/, /(3D|三维) ?(layout|LO|构图)/i, /(CGI?|3D).*(设计|(美|艺)术|アート)/,,
        /(建模|(模|造)(型|形)|モデリング)(导演|监督|总监|主管|ディレクター)/, [true, 300, /建模|(模|造)(型|形)|Model/i],,
        /绑(骨|定)(监督|总监)/, [true, /绑|骨/, 303, /材质|贴图|テクスチャー|Texture?/i],,
        [true, /数字背景/, 988, /地形|建筑|资(源|产)/, /管线|Pipeline/i, 10, /LookDev|^UE/, "工程师"],,
        /(动作|武戏|战斗.*)(导演|监督|主管)/, /动作设计/, [true, 504, /动作|表情/], /帧|动作?捕捉?/,,
        /(CGI?|3D).*原画/, /(CGI?|3D|三维).*(动画|アニメーション)/,,
        /(CGI?|3D|三维)特效/, 303, /(CGI?|3D|三维|电脑图形).*制作/,,
        [true, 302, /(CGI?|3D|三维|电脑图形).*(制作人|プロデュース)/, /(CGI?|3D|电脑图形).*制片人/],,
        [true, 980, /CGI?|3D|三维|立体|电脑|コンピュータ/],,
        /Motion Graphic|モーショングラフィック/i,,
        ,
        300, /2DCG.*导演/, /2D(w| ?works|ワークス)/i, /UI|图形界面/, 980, /2D|二维/,,
        ,
        "摄影监督", "副摄影监督", 604, /(中|后)(期|制).*(导演|监督|总监|管|统)/,,
        [false, /張り込み|ハリコミ/, /摄(影|制)/], [true, /线拍/],,
        [true, 608, /(中|后)期/, 605, /合成/, /(摄|撮)|照明|光(源|照)|灯光|映像/, 302, /渲染|解算/],,
        /((效|効)|特技)(导演|[監监]督|总监|主管)/, [true, 609, /(效|効)|特技|Effect|监视器|モニター/i],,
        /(V|C)?FX/, [true, 980, /视觉/], [true, 987, /技[术術]|Technical/i],,
        ,
        [false, "剪辑", "编集"], [true, 609, /剪辑|[编編]集/, /联机/],,
        /标题|字幕|タイトル/, /(冲|洗)印|現像|デジタルラボ|介质/, "转录",,
        ,
        "音乐", /音乐.*(导演|监督|总监)/, [true, "音乐制作人", "音乐制作", "音乐助理"],,
        "演唱", "作词", "作曲", "编曲", // 兼容MV类型条目
        [true, /音乐/, 606, /音|乐/i, 605, /奏|键盘|吉他|贝斯|鼓|弦乐/],,
        "主题歌演出", "主题歌", "主题曲", [true, "主题歌作词", "主题歌作曲", "主题歌编曲"],,
        /片头(曲|歌曲)(.*演(出|唱))?$/, [true, /片头(曲|歌)/],,
        /片尾(曲|歌曲)(.*演(出|唱))?$/, [true, /片尾(曲|歌)/],,
        "插入歌演出", [true, "插入歌作词", "插入歌作曲", "插入歌编曲"],,
        [true, 603, /歌|曲|作[词詞]|song/i], [true, /[选選]曲/],,
        ,
        /(音(响|频)|声音|Sound).*(导演|监督|总监|主管|Direction)/i,,
        "音响", [true, /音响/], "音效", [true, 600, /音效|拟音/],,
        [false, "录音"], [true, "录音助理",  600, /录|録/], [true, /声音/, 604, /音频|(整|调)音|母带|混|声|調整/],,
        /(配音|演员).*(导演|监)/, "主演", /主要配音/,
        [true, 603, /配音|出演|旁白|演(员|出)|声优|キャスティング|cast/i], [true, /(配音|演员|角色).*(管|统)|选角/],,
        ,
        "企画", "企划制作人", 202, /企[划画]|策划|战略/, [true, /企[划画][协協]力/],,
        980, /出品/, [true, "总监制", 989, /监制/],,
        800, /总制片|[统統概]括/, "制片人", "制片", "执行制片人", [true, 808, /制片|プロデューサー/],,
        ,
        [true, 980, /主编/, 989, /编辑|ライター/, /排版|数据|翻译|清书/, 980, /审|检验/],,
        [true, 200, /宣(传|伝|发)?|推广|广告|広報|パンフレット/],,
        [true, 402, /市场|运营|营销|销售|セールス|商(务|业)|(商|产)品|パッケージ|衍生|周边|授权|ライセンス|品牌|IP/, /Business|Sales/i],,
        [true, 987, /人事|法务|维权|(财|税)务|后(勤|盾)|支援|^助理|剧务|场记/, /(水滴|深空)攻坚/, 989, /支持/],,
        509, /取材|考(据|证|証)/, [true, 987, /校/],,
        ,
        "动画制片人",,
        [true, 809, /[制製]作(管理|主任|担当|デスク|总|総|.?监|人)/, "担当制作"],,
        [true, 989, /统|統|管理/, "计划管理", 801, /制作助./, 980, /プロダクション|マネージャー|经理|PM/],,
        [true, 403, /[设設]定(制作|管理)/], [true, /制作(进|進)行/, "制作协调"],,
        "动画制作", 500, /动画制作/, 989, /制作/, /定格动画|(ねんど|パペット)アニメ/,,
        980, /制作[协協]力/, 990, /[协協]力?/, 30, /手语|发音/, 987, /(监|監)修|顾问|指导/,,
        [false, /同人|题字/, /谢|Thanks/i],,
        ,
        /官方网站|官网|公式|HP/, [true, 90, /(官方网站|官网|公式|HP).*(备份|制作)/], /推特|Twitter|^X$|blog/i, "微博",,
        "发行", [true, /(音像|图书)(出版|发行)/, 981, /发行/], [true, 990, /开发/],,
        "播放电视台", "其他电视台", /bilibili/i, 609, /网络|在线|播放|配[给給送信]?|番|版/,,
        "播放结束", /结束/,,
        /JAN(码|番号)|imdb/i, "链接", "价格",,
        ,
        "其他", /其他/, [true, "备注"],,
        [false, "===此处插入未被匹配的职位==="],,
        10, /许可证|备案号/, 980, /官方(支持|伙伴)?/,,
        "制作", "製作", "製作协力", /製作委員会|(制作)?著作|出品方?$|版权/, "Copyright",
      ],
      [SubjectType.BOOK.en]: () => [,
        "中文名", /名/,,
        [false, "===此处插入未被匹配的职位==="],,
        ">>>此处插入二级职位引导>>>",,
        "ISBN",
      ],
      [SubjectType.MUSIC.en]: () => [,
        "制作人",,
        "艺术家", "作词", "作曲", "编曲",,
        "脚本", "声乐", "乐器", "混音", "母带制作",,
        "插图", "原作", "出版方", "厂牌",
      ],
    };

    /** @type {StaffMapListType} 主数据 */
    data = [];
    /** @type {Object<string, number>} 精确匹配的映射表，同时用于缓存匹配记录 */
    exactOrderMap = {};
    /**
     * @type {Array<[string | RegExp, number, number]>}
     * 正则匹配的映射序列，子序列为正则表达式、序列号、匹配优先级
     * (允许正则表达式适时活化)
     */
    regexOrderList = [];
    /** 是否为默认数据 */
    isDefault = null;
    /** 重新解析数据 */
    newResolvedData = false;
    /** 新记录的匹配计数器 */
    newlyMatchedCount = 0;
    /** 是否开启折叠功能 */
    foldable = false;
    /** 是否执行了折叠功能 */
    hasFolded = false;
    /** 未被匹配职位信息的插入位置 */
    insertUnmatched = Infinity;
    /** 二级职位引导信息的插入位置 (一旦启用，即为最高优先级) */
    insertSubGroup = null;
    /** 默认配置格式化文本的缓存 */
    _defaultTextBuffer = null;

    constructor(subType) {
      /** 所属条目类型（不可变更）*/
      this.subType = subType; // 小心 Key._subType 被其他模块切换
      /** 序列号计数器 */
      this.index = 0;
      /** 排序功能启用状态 */
      this.sortEnableState = Store.get(Key.ENABLE_STATE_KEY, this.subType);
      /** `_resolveData`中当前正则匹配的优先级 */
      this._priority = StaffMapList._defaultRegexPriority;
    }

    /**
     * 依据`EnableState`进行初始化，使其具备职位匹配的能力。
     * 若仅为获取`StaffMapList`格式化字符串，则不需要执行本初始化。
     * @param {any[] | null | undefined} [parsedData=null] 
     * - 由设置界面传入的被初步解析的数据
     * @param {boolean} [forcedEnable=false]
     * - 是否开启强制模式 (默认关闭)，强制模式下关闭`EnableState`检查并禁用折叠
     */
    initialize(parsedData = undefined, forcedEnable = false) {
      // 非强制模式下，禁止了排序功能
      if (!forcedEnable && this.sortEnableState === SortEnableState.ALL_DISABLED) return;
      // 是否开启折叠功能
      this.foldable = !forcedEnable && this.sortEnableState === SortEnableState.ALL_ENABLED;
      this._init();
      // 尝试优先获取存储的解析数据
      if (parsedData === undefined) {
        if (this._loadResolvedData()) return;
        else this._init(); // 需再次初始化
      }
      // 在设置界面保存设置时进行强制重新解析，或者在条目界面进行初始化解析
      if (!this._loadData(parsedData)) {
        this._setDefault();
        this.isDefault = true;
      }
      // 解析数据
      this._resolveData();
      this.data = null; // 释放原始数据的存储空间
      this.newResolvedData = true;
      // 替换 Infinity (替换为当前的尾值，来免除对 Infinity 在 JSON 序列化时需单独处理)
      if (!utils.isFinity(this.insertUnmatched)) {
        // 替换默认值
        this.insertUnmatched = this.index << 1;
        // 若启用了插入二级引导，且设定为尾值，则替换。以保证二级引导插入末尾的优先级
        if (utils.isNumber(this.insertSubGroup) && this.insertUnmatched - this.insertSubGroup === 2) {
          [this.insertSubGroup, this.insertUnmatched] = [this.insertUnmatched, this.insertSubGroup];
        }
      }
    }

    /** 数据参数初始化 */
    _init() {
      this.index = 0;
      this.exactOrderMap = {};
      this.regexOrderList = [];
      this.insertUnmatched = Infinity;
      this.insertSubGroup = null;
      this._defaultTextBuffer = null;
      this._priority = StaffMapList._defaultRegexPriority;
    }

    /**
     * 表示未经`initialize`，或是空缺设置，将关闭脚本的职位排序。
     * 空缺设置有两种独立开启途径：
     *   1. `EnableState = "allDisable"`
     *   2. `StaffMapListJSON = "[]"`
     */
    isNull() { return this.index === 0; }

    /**
     * 判断职位是否默认折叠
     * @param {string} job
     */
    isFoldedJob(job) {
      if (!this.foldable) return false;
      const index = this.exactOrderMap[job];
      const result = (index & 1) === 1; // 奇数代表默认折叠
      if (!this.hasFolded && result) this.hasFolded = true;
      return result;
    }

    /** 保存自定义的数据 */
    saveData(jsonStr, parsedData) {
      this.isDefault = false;
      Store.set(Key.STAFF_MAP_LIST_KEY, jsonStr, this.subType);
      C.log(jsonStr);
      C.log(`${SCRIPT_NAME}：保存自定义 ${this.subType}StaffMapList 数据`);
      this.initialize(parsedData, true);
      if (Store.get(Key.INHERIT_PREVIOUS_MATCHES_KEY)) this.inheritPreMatches();
      this.saveResolvedData();
    }

    /** 恢复默认数据的设置 */
    resetData() {
      this.isDefault = true;
      Store.remove(Key.STAFF_MAP_LIST_KEY, this.subType);
      C.log(`${SCRIPT_NAME}：恢复默认 ${this.subType}StaffMapList 数据`);
      this.initialize(null, true); // 传入null表强制重新解析
      if (Store.get(Key.INHERIT_PREVIOUS_MATCHES_KEY)) this.inheritPreMatches();
      this.saveResolvedData();
    }

    /** 继承历史的匹配记录 */
    inheritPreMatches() {
      this.newResolvedData = true;
      this.newlyMatchedCount = 0;
      // 获取历史的匹配记录
      const jsonStr = Store.get(Key.JOB_ORDER_MAP_KEY, this.subType);
      if (!jsonStr) return;
      let preMatches;
      try {
        /** @type {jobOrderMapType} */
        const parsedMap = JSON.parse(jsonStr);
        preMatches = parsedMap.exact;
      } catch { return; }
      // 不进行排序，仅遍历匹配
      const sorter = new BaseStaffSorter(this, preMatches);
      sorter.scan();
      sorter.printRegexMatchLog();
      sorter.printUnmatchLog();
      if (this.newlyMatchedCount) {
        C.log(`${SCRIPT_NAME}：从 ${this.subType} 历史匹配记录中继承 ${this.newlyMatchedCount} 项匹配`);
      }
    }

    /**
     * 组合并保存解析数据`jobOrderMap`
     * @param {boolean} [inSubject=false] - 是否为条目界面操作
     */
    saveResolvedData(inSubject = false) {
      // 空缺设置
      if (this.isNull()) {
        if (this.sortEnableState !== SortEnableState.ALL_DISABLED) {
          Store.remove(Key.JOB_ORDER_MAP_KEY, this.subType);
        } return;
      }
      // 解析数据未更新
      if (!this.newlyMatchedCount && !this.newResolvedData) return;
      // 组合解析数据
      this._sortExactOrderMap(inSubject || !Store.get(Key.INHERIT_PREVIOUS_MATCHES_KEY));
      const jobOrderMap = {
        'exact': this.exactOrderMap,
        'regex': this.regexOrderList,
        'insert': { [StaffMapList._insertUnmatchedPref]: this.insertUnmatched }
      };
      if (utils.isNumber(this.insertSubGroup)) {
        jobOrderMap.insert[StaffMapList._insertSubGroupPref] = this.insertSubGroup;
      }
      // JSON 序列化后进行存储
      const jsonStr = RegexInJSON.stringify(jobOrderMap);
      Store.set(Key.JOB_ORDER_MAP_KEY, jsonStr, this.subType);
      C.log(`${SCRIPT_NAME}：保存 ${this.subType}JobOrderMap 解析缓存`);
    }

    /** 恢复默认配置 */
    _setDefault() {
      // 该类型条目未有默认设置
      if (!StaffMapList._defaultLazyData[this.subType]) this.data = [];
      // 懒加载默认设置
      else this.data = StaffMapList._defaultLazyData[this.subType]();
    }

    /**
     * 尝试载入自定义的数据，并作初步解析
     * @param {any[] | null} [parsedData=null] 
     */
    _loadData(parsedData = null) {
      const jsonStr = Store.get(Key.STAFF_MAP_LIST_KEY, this.subType);
      if (!jsonStr) return null; // 键值为空，表示用户启用默认设置
      if (!parsedData) parsedData = RegexInJSON.parse(jsonStr);
      if (!parsedData) {
        // 通过UI进行的配置一般不可能发生
        C.error(
          `${SCRIPT_NAME}：自定义 ${this.subType}StaffMapList 解析失败，将使用脚本默认的数据`
        );
        return false;
      }
      /* 修复外层重复嵌套 `[]` 的形式，例如 [["", [true, ""], ""]]
       * 同时区分形如 [[true, "", ""]] 此类不需要降维的情形，
       * 忽略存在的漏洞：形如 [[true, "", [true, ""], ""]] 将无法降维 */
      if (
        parsedData.length === 1 &&
        utils.isArray(parsedData[0]) &&
        !utils.isBoolean(parsedData[0][0])
      ) {
        parsedData = parsedData[0];
      }
      this.isDefault = false;
      this.data = parsedData;
      return true;
    }

    /** 完全解析数据，拆解为`jobOrderMap` */
    _resolveData() {
      for (let item of this.data) {
        let isFolded = false;
        if (utils.isArray(item)) {
          if (!item.length) continue;
          // 对数组进行完全展平，提高对非标多维数组的兼容性
          item = item.flat(Infinity);
          /* 对于标准格式，仅当 Boolean 为一级子序列的首元素时，对该子序列的全部元素生效
           * 此时更广义的表述为，仅当 Boolean 为一级子序列的最左节点时，对该子序列的全部元素生效 */
          if (utils.isBoolean(item[0])) {
            // 始终解析折叠信息，是否最终执行通过 foldable 进行限制
            if (item[0]) isFolded = true;
            item.shift(); // 移除第一个元素，替代 slice(1)
          }
          this._processMatchers(isFolded, ...item);
        } else {
          this._processMatchers(isFolded, item);
        }
      }
      this.regexOrderList.sort((a, b) => a[2] - b[2]); // 对正则匹配进行优先级排序
      if(!this.isNull()) C.debug(`经过解析初始化 ${this.subType}StaffMapList`);
    }

    /** 尝试载入存储的解析数据`jobOrderMap` */
    _loadResolvedData() {
      const jsonStr = Store.get(Key.JOB_ORDER_MAP_KEY, this.subType);
      if (!jsonStr) return null; // 键值为空，表示存储数据为空
      try {
        /** @type {jobOrderMapType} */
        const parsedMap = JSON.parse(jsonStr);
        this.exactOrderMap = parsedMap.exact;
        this.regexOrderList = parsedMap.regex;
        // 活化正则表达式 (改为适时活化)
        // for (const item of this.regexOrderList) {
        //   const match = item[0].match(RegexInJSON.regexPattern);
        //   item[0] = RegExp(match[1], match[2]);
        // }
        this.insertUnmatched = parsedMap.insert[StaffMapList._insertUnmatchedPref];
        this.insertSubGroup = parsedMap.insert[StaffMapList._insertSubGroupPref];
        if (!utils.isNumber(this.insertUnmatched)) {
          throw new Error(`插入匹配的序列号 ${this.insertUnmatched} 无效`); // 必需的数据
        }
      } catch (e) {
        C.error(
          `${SCRIPT_NAME}：${this.type}JobOrderMap 缓存数据损坏，将对 staffMapList 重新进行解析 - ${e}`
        );
        return false;
      }
      this.regexOrderList ??= []; // 允许缺损
      this.index = Infinity; // 无实义，仅表完成初始化，作用于 isNull
      C.debug(`经过读取缓存初始化 ${this.subType}StaffMapList`);
      return true;
    }

    /**
     * 处理一组匹配，用于`_resolveData`，
     * 使得`jobOrderMap.number`同时表示序列号与折叠状态
     * @param {boolean} isFolded
     * @param {...MatchJob} matchers 
     */
    _processMatchers(isFolded, ...matchers) {
      for (const matcher of matchers) {
        const matcherType = StaffMapList.getMatcherType(matcher);
        if (matcherType === 0 || matcher === '') continue;
        // 获取正则匹配的优先级
        if (matcherType === 3) {
          this._priority = matcher;
          continue;
        };
        // 生成序列号
        let _index = this.index++ << 1;
        if (isFolded) _index++; // 默认折叠则为奇数，相否则为偶数
        // 构建正则表达式引用列表
        if (matcherType === 2) {
          this.regexOrderList.push([matcher, _index, this._priority]);
          this._priority = StaffMapList._defaultRegexPriority;
          continue;
        }
        // 仅剩余 matcherType === 1
        const prefixType = StaffMapList.getPrefixType(matcher);
        switch (prefixType) {
          // 精确匹配，构建哈希表
          case 0:
            this.exactOrderMap[matcher] = _index;
            break;
          // 插入匹配，未被匹配职位信息
          case 1:
            this.insertUnmatched = _index;
            C.debug(`insertUnmatched: "${matcher}", index: ${_index}}`);
            break;
          // 插入匹配，二级职位引导信息
          case 2:
            _index = _index & ~1; // 消除折叠性
            this.insertSubGroup = _index;
            C.debug(`insertSubGroup: "${matcher}", index: ${_index}}`);
            break;
        }
      }
    }

    /**
     * 对精确映射表按序列号进行排序
     * @param {boolean} [useMerge=false] - 是否使用归并排序
     */
    _sortExactOrderMap(useMerge = false) {
      if (this.newlyMatchedCount === 0) return;
      let arr = Object.entries(this.exactOrderMap);
      const compareFn = (a, b) => a[1] - b[1];
      if (useMerge) {
        // 1. 对无序部分排序后，再进行归并排序
        const sortedLength = arr.length - this.newlyMatchedCount;
        const unsortedPart = arr
          .slice(sortedLength)
          // .filter((value) => value[1] !== this.insertUnmatched) // 过滤未被匹配的职位
          .sort(compareFn);
        arr = utils.mergeSorted(arr, unsortedPart, sortedLength, this.newlyMatchedCount, compareFn);
      } else {
        // 2. 整体排序 (在继承匹配记录时，无序部分占比高)
        arr.sort(compareFn);
      }
      this.exactOrderMap = Object.fromEntries(arr);
    }

    /**
     * 将数据转化为格式化文本 (有别于`StaffMapListJSON`)
     * 用于设置内的显示与编辑，自定义数据与默认数据二者格式化有别
     * @returns {string} 格式化文本
     */
    formatToText(useDefault) {
      let jsonStr = null;
      if (!useDefault) {
        jsonStr = Store.get(Key.STAFF_MAP_LIST_KEY, this.subType);
        this.isDefault = jsonStr === null; // useDefault 不能改变 isDefault
      }
      // 自定义数据
      if (jsonStr) return jsonStr.slice(1, -1); // 消除首尾的 `[]`
      // 读取缓存的默认数据
      else if (this._defaultTextBuffer) return this._defaultTextBuffer;
      // 将默认数据转化为格式化文本
      this._setDefault();
      const text = RegexInJSON.stringify(this.data, 1)
        .replace(/(null,\n )|(\n\s+)/g, (match, g1, g2) => {
          if (g1) return '\n';
          if (g2) return ' ';
          return match;
        })
        .slice(3, -2); // 消除首部 `[ \n` 与尾部 `\n]`
      // 使得 `[ `->`[` 同时 ` ]`->`]`
      /* const text = RegexInJSON.stringify(this.data, 1).replace(
        /(null,)|(?<!\[)(\n\s+)(?!])|(\[\s+)|(\s+],)/g,
        (match, g1, g2, g3, g4) => {
          if (g1) return '\n';
          if (g2) return ' ';
          if (g3) return '[';
          if (g4) return '],';
          return match;
        }).slice(3, -2); */
      this._defaultTextBuffer = text;
      this.data = null; // 释放原始数据的存储空间
      return text;
    }

    /**
     * 获取该插入匹配的前缀类型
     * @param {string} matcher
     * @returns {0 | 1 | 2} 0-无，1-插入未被匹配，2-插入二级引导
     */
    static getPrefixType(matcher) {
      if (matcher.startsWith(StaffMapList._insertUnmatchedPref))
        return 1;
      if (matcher.startsWith(StaffMapList._insertSubGroupPref))
        return 2;
      return 0;
    }

    /**
     * 获取该匹配的类型
     * @param {MatchJob | any} matcher
     * @returns {0 | 1 | 2 | 3} 0-无效类型，1-字符串，2-正则式，3-数字
     */
    static getMatcherType(matcher) {
      return utils.isString(matcher) ? 1 : utils.isRegExp(matcher) ? 2 : utils.isNumber(matcher) ? 3 : 0;
    }
  }

  /**
   * 基类，职位排序的核心逻辑。
   * 可被拓展用于不同的场景：网页`infobox`职位信息、职位名称序列、API`infobox`职位信息。
   * 
   * 经算法重构，并修改`StaffMapList`的解析数据的结构，
   * 总复杂度由原本的 `O(k+m + nk·T)` 变为 `O(k+m+n + nk·t + klogk)`，
   * 借助缓存匹配记录，最高可达到 `O(k+m+n + klogk)`，其中：
   *  - `k`为`li`元素的个数
   *  - `m`为精确匹配规则的数量
   *  - `n`为正则匹配规则的数量
   *  - `t/T`为正则表达式平均匹配时间
   * 
   * 其中的匹配逻辑`nk·T`实现为`for(n+m){for(k not M){T}}`，`nk·t`实现为`for(k not M){for(n){t}}`，
   * 因此对总复杂度的影响`T >> t`，同时借助该循环方式的改变，实现了精确匹配绝对优先于正则匹配
   */
  class BaseStaffSorter {
    /**
     * @type {Object<string, any> | Iterable<string>}
     * 原始数据，元素内需包含待匹配职位名称
     */
    rawData;
    /** @type {StaffMapList} 职位排序与折叠设置 */
    staffMapList;
    /** @type {Array<string>} 职位名称的排序结果 */
    sortedJobs;
    /** @type {Map<RegExp, Array<string>>} 被正则匹配的职位名称 */
    regexMatchedJobs;
    /** @type {Array<string>} 未被匹配的职位名称 */
    unmatchedJobs;

    /**
     * 构造函数，子类可细化`rawData`的类型定义，
     * 并自行对其初始化，且需在其后调用`_initSetData`函数
     */
    constructor(staffMapList, rawData = null) {
      this.staffMapList = staffMapList;
      this.regexMatchedJobs = new Map();
      this.unmatchedJobs = [];
      if (rawData) {
        this.rawData = rawData;
        this._initSortedJobs();
      }
    }

    /** 初始化排序结果 */
    _initSortedJobs() {
      if (utils.isArray(this.rawData) || utils.isSet(this.rawData)) {
        this.sortedJobs = Array.from(this.rawData);
      } else {
        this.sortedJobs = Object.keys(this.rawData);
      }
    }

    /**
     * 获取匹配后的序列号，
     * 被正则匹配与未被匹配的职位，将所得的序列号写入解析缓存`jobOrderMap`
     * @param {string} job - 数据集合
     * @return {number} 返回用于`Array.sort`的序列号
     */
    getMatchIndex(job) {
      let index;
      // 1.精确匹配，或命中缓存 (优先)
      index = this.staffMapList.exactOrderMap[job];
      if (index !== undefined) {
        return index;
      }
      // 新的匹配记录，需写入`Store`
      this.staffMapList.newlyMatchedCount++;
      // 2.正则匹配
      for (const item of this.staffMapList.regexOrderList) {
        if (utils.isString(item[0])) {
          // 懒活化正则表达式
          const match = item[0].match(RegexInJSON.regexPattern);
          item[0] = RegExp(match[1], match[2]);
        }
        if (!item[0].test(job)) continue;
        index = item[1];
        this.staffMapList.exactOrderMap[job] = index;
        this._addRegexMatchLog(item[0], job);
        return index;
      }
      // 3.未被匹配
      index = this.staffMapList.insertUnmatched;
      // this._addUnmatchLog(job); // 推迟记录操作，以确保无论未被匹配职位是否已被缓存的，均被记录
      this.staffMapList.exactOrderMap[job] = index;
      return index;
    }

    /** 进行匹配排序 */
    sort() {
      this.sortedJobs.sort((a, b) => this.getMatchIndex(a) - this.getMatchIndex(b));
    }
    /** 进行匹配遍历，并记录未被匹配的职位 */
    scan() {
      const insertUnmatched = this.staffMapList.insertUnmatched;
      for (const job of this.sortedJobs) {
        const index = this.getMatchIndex(job, false);
        if (index === insertUnmatched) this._addUnmatchLog(job);
      }
    }

    /**
     * 记录一条被正则匹配的职位信息
     * @param {RegExp} regex
     * @param {string} job
     */
    _addRegexMatchLog(regex, job) {
      // C.log(`${SCRIPT_NAME}：使用正则表达式 ${regex} 成功匹配 "${job}"`);
      if (this.regexMatchedJobs.has(regex)) {
        this.regexMatchedJobs.get(regex).push(job);
      } else {
        this.regexMatchedJobs.set(regex, [job]);
      }
    }
    printRegexMatchLog() {
      if (!this.regexMatchedJobs.size) return;
      C.log(`${SCRIPT_NAME}：${this.staffMapList.subType} 中被正则匹配到的职位`,
        [...this.regexMatchedJobs]
        .map(([regex, jobs]) => [regex, jobs.join('，')])
      );
    }

    /**
     * 记录一条未被匹配的职位信息
     * @param {string} job
     */
    _addUnmatchLog(job) {
      this.unmatchedJobs.push(job);
    }
    printUnmatchLog() {
      if (!this.unmatchedJobs.length) return;
      C.log(`${SCRIPT_NAME}：${this.staffMapList.subType} 中未被匹配到的职位`, this.unmatchedJobs);
    }
  }

  /**
   * 实现网页`infobox`职位信息的排序与折叠，
   * `sub_group`及属其所有的`sub_container`将被视为一个整体进行排序
   */
  class InfoboxStaffSorter extends BaseStaffSorter {
    /**
     * @type {Object<string, HTMLElement | Array<HTMLElement>>}
     * 原始职位信息字典 (细化基类的数据格式)
     */
    rawData;

    /**
     * @param {HTMLElement} ul - `infobox`
     * @param {StaffMapList} staffMapList - 职位排序与折叠设置
     * @param {Object<string, HTMLElement | Array<HTMLElement>>} infoboxDict - 职位信息字典
     * @param {string} subjectId - 条目`ID`
     */
    constructor(ul, staffMapList, infoboxDict, subjectId) {
      super(staffMapList);
      this.rawData = infoboxDict;
      this._initSortedJobs();
      /** `infobox` */
      this.ul = ul;
      /** `infobox`临时片段 */
      this.fragment = document.createDocumentFragment();
      /** 当前条目的`ID` */
      this.subjectId = subjectId;
      /** 启用插入二级职位引导信息 */
      this.needInsertSubGroup = utils.isNumber(this.staffMapList.insertSubGroup);
    }

    /**
     * 获取匹配后的序列号，
     * 在原有的基础上增加优先插入二级职位引导的功能
     */
    getMatchIndex(job) {
      if (this.needInsertSubGroup && utils.isArray(this.rawData[job])) {
        return this.staffMapList.insertSubGroup;
      }
      return super.getMatchIndex(job);
    }

    sort() {
      // 进行匹配排序
      super.sort();
      // 执行排序结果
      let foldedJobs = [];
      let preUnfolded = null;
      for (const job of this.sortedJobs) {
        const li = this.rawData[job];
        // 1. sub_group 及属其所有的 sub_container 组成的序列
        if (utils.isArray(li)) {
          if (foldedJobs.length) dealFoldsList(foldedJobs, li[0], preUnfolded, false);
          preUnfolded = null;
          this.fragment.append(...li);
          lastGroup = li;
          continue;
        }
        // 2. 普通职位信息
        if (this.staffMapList.isFoldedJob(job)) {
          li.classList.add('folded', 'foldable');
          // 加入队列
          foldedJobs.push(job);
        } else {
          // 未被折叠
          if (foldedJobs.length) {
            dealFoldsList(foldedJobs, li, preUnfolded, li.classList.contains('refoldable'));
          }
          preUnfolded = li;
        }
        this.fragment.appendChild(li);
      }
      // 尾部元素折叠的情形
      dealEndWithFold(this.ul, foldedJobs, preUnfolded);
      // 一次性更新 DOM 
      this.ul.append(...this.fragment.childNodes);
    }
  }

  /** 主函数入口 */
  async function main() {
    const urlPatterns = [
      /^\/(subject)\/(\d+)$/,
      /^\/(subject)\/(\d+)\/(add_related\/person)$/,
      /^\/(character)\/(\d+)$/,
      /^\/(person)\/(\d+)/,
      /^\/(settings)\/privacy$/,
    ];
    Store.initialize();
    for (const pattern of urlPatterns) {
      const match = window.location.pathname.match(pattern);
      if (!match) continue;
      const [, patternType, subId, subPath] = match;
      if (patternType === 'settings') handlerSettings();
      else await handlerSubject(patternType, subId, subPath); // 传入条目类型与条目ID
      break;
    }
    Store.postProcessConfigUpdate();
  }

  /** 处理设置 */
  function handlerSettings() {
    loadSettingStyle();
    const ui = buildSettingUI({ id: 'staff_sorting' });
    document.getElementById('columnA').appendChild(ui);
    // 支持 url.hash = ID 进行导引
    if (location.hash.slice(1) === 'staff_sorting') {
      ui.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /** 处理条目 */
  async function handlerSubject(subType, subId, subPath) {
    if (SubjectType.needPrase(subType))
      subType = SubjectType.parse(getSubjectType());
    if (!subType) return; // 不支持该类型条目
    if (subPath === 'add_related/person') {
      // 条目的关联人物页面，关闭所有折叠功能
      Store.setCache(Key.REFOLD_THRESHOLD_KEY, Key.REFOLD_THRESHOLD_DISABLED);
      if (Store.get(Key.ENABLE_STATE_KEY, subType) === SortEnableState.ALL_ENABLED){
        Store.setCache(Key.ENABLE_STATE_KEY, SortEnableState.PARTIAL_ENABLED);
      }
    }
    const ul = document.querySelector('#infobox');
    loadStaffStyle();
    DockStyle.watchHeight(6000);
    C.time(`StaffMapList`);
    const staffMapList = new StaffMapList(subType);
    staffMapList.initialize();
    C.timeEnd(`StaffMapList`);
    let sorter = null;
    // 延迟执行，提高对其他修改 infobox 信息的脚本的兼容性
    await delay(SORTING_DELAY);
    if (!staffMapList.isNull()) {
      // 1.实行自定义的职位顺序
      const infoboxDict = getInfoboxDict(ul);
      C.time(`StaffSorting`);
      sorter = new InfoboxStaffSorter(ul, staffMapList, infoboxDict, subId);
      sorter.sort();
      C.timeEnd(`StaffSorting`);
      hasFolded = staffMapList.hasFolded;
    } else {
      // 2.实行网页原有的职位顺序
      scanInfobox(ul);
      C.log(`${SCRIPT_NAME}：实行网页原有的职位顺序`);
    }
    JobStyle.setStaffStyleProperty();
    addFoldButtonListener(ul);
    modifyExpandButton(ul);
    dealLastGroup(ul);
    $(function () {
      $('#infobox .folds_list .staff_sorting_icon').tooltip({
        container: 'body',
        // 非 jQuery UI 的 tooltip 而是 Bootstrap 的 tooltip
        // 且 Bootstrap = 3.4.1 < 5.2.0 customClass 无效
        template: `
          <div class="tooltip folds_list_tip" role="tooltip">
            <div class="tooltip-arrow"></div>
            <div class="tooltip-inner"></div>
          </div>`,
      });
    });
    if (sorter) {
      // 打印匹配记录
      sorter.scan(); // 扫描未被匹配的职位
      sorter.printRegexMatchLog();
      sorter.printUnmatchLog();
      // 保存匹配记录
      staffMapList.saveResolvedData(true);
    }
  }

  /**
   * 巧妙地使用非常便捷的方法，获取当前条目的类型
   * 源自 https://bangumi.tv/dev/app/2723/gadget/1242
   */
  function getSubjectType() {
    const href = document.querySelector('#navMenuNeue .focus').getAttribute('href');
    return href.split('/')[1];
  }

  /**
   * 从`span.tip`元素中获取职位名称
   * @param {HTMLElement} tip
   * @returns {string}
   */
  function getJobFromTip(tip) {
    return tip.innerText.trim().slice(0, -1); // 去掉最后的冒号
  }

  /**
   * 获取一个对象来存储`infobox`中的职位信息。
   * 并对职位信息进行二次折叠，
   * 同时将`sub_group`及属其所有的`sub_container`打包为一个序列作为字典的键值
   * @param {HTMLElement} ul - `infobox`
   * @returns {Object<string, HTMLElement | Array<HTMLElement>>} 返回职位信息字典，键值为`DOM`或者`DOM`序列
   */
  function getInfoboxDict(ul) {
    const staffDict = {};
    const lis = ul.querySelectorAll(':scope > li');
    lis.forEach((li) => {
      const tip = li.querySelector('span.tip');
      if (!tip) return;
      let job = getJobFromTip(tip);
      if (li.classList.contains('sub_group')) {
        // 新的小组
        staffDict[job] = [li];
      } else if (li.classList.contains('sub_container')
        && li.hasAttribute('attr-info-group')) {
        // 整合进组
        job = li.getAttribute('attr-info-group');
        if (staffDict[job]) staffDict[job].push(li);
        else staffDict[job] = [li];
      } else {
        // 普通元素
        staffDict[job] = li;
        // 为了正确计算元素高度，需使其 display
        li.classList.remove('folded');
        refoldJob(li, tip);
        // li.folded 属性已经失效无需还原
      }
    });
    return staffDict;
  }

  /**
   * 遍历`infobox中的职位信息，
   * 为网页原有的`folded`类别添加`foldable`便签，用于实现切换，
   * 忽略属于`sub_group`的`sub_container`，
   * 并对职位信息进行二次折叠
   * @param {HTMLElement} ul - `infobox`
   */
  function scanInfobox(ul) {
    const lis = ul.querySelectorAll(':scope > li');
    let foldedJobs = [];
    let preUnfolded = null;
    lis.forEach(li => {
      // 获取 lastGroup
      if (li.classList.contains('sub_group')) {
        if (foldedJobs.length) dealFoldsList(foldedJobs, li, preUnfolded, false);
        preUnfolded = null;
        lastGroup = [li];
      } else if (li.classList.contains('sub_container') && li.hasAttribute('attr-info-group')) {
        lastGroup.push(li);
      }
      const tip = li.querySelector('span.tip');
      if (!tip) return;
      const job = getJobFromTip(tip);
      const flag = li.classList.contains('folded') && !li.hasAttribute('attr-info-group');
      // 为了正确计算元素高度，需先使其 display
      if (flag) li.classList.remove('folded');
      refoldJob(li, tip);
      /* 特殊用法：当 StaffMapList = "[]" 空缺设置，同时 SortEnableState = "partialDisable"
       * 将实行网页原有的职位顺序，同时禁止其折叠 */
      if (Store.get(Key.ENABLE_STATE_KEY) === SortEnableState.PARTIAL_ENABLED) return;
      if (flag) {
        // 被折叠
        if (!hasFolded) hasFolded = true;
        li.classList.add('folded', 'foldable');
        // 加入队列
        foldedJobs.push(job);
      } else {
        // 未被折叠
        if (foldedJobs.length) {
          dealFoldsList(foldedJobs, li, preUnfolded, li.classList.contains('refoldable'));
        }
        preUnfolded = li;
      }
    });
    // 尾部元素折叠的情形
    dealEndWithFold(ul, foldedJobs, preUnfolded);
  }

  /** 
   * 处理有效的折叠队列。
   * 为未被折叠的当前元素或先前元素，添加该折叠队列的控制按钮。
   * @param {Array<string>} foldedJobs - 被折叠的职位名称序列
   * @param {HTMLElement} curUnfolded - 当前未被折叠的元素
   * @param {HTMLElement | null} preUnfolded - 先前的第一个未被折叠的元素
   * @param {boolean} position - `true`为先前元素添加，`false`为当前元素添加
   */
  function dealFoldsList(foldedJobs, curUnfolded, preUnfolded, position) {
    const aTitle = '+ ' + foldedJobs.join('，');
    if (position && preUnfolded) {
      addFoldsListButton(preUnfolded, aTitle, 'bottom');
    } else {
      addFoldsListButton(curUnfolded, aTitle, 'top');
    }
    foldedJobs.length = 0; // 使用 = [] 方法将无法引用返回
  }

  /**
   * 处理`infobox`以被折叠元素序列结尾的情景
   * @param {HTMLElement} ul - `infobox`
   * @param {Array<string>} foldedJobs - 被折叠的职位名称序列
   * @param {HTMLElement} preUnfolded - 先前的第一个未被折叠的元素
   */
  function dealEndWithFold(ul, foldedJobs, preUnfolded) {
    if (foldedJobs.length && preUnfolded) {
      const aTitle = '+ ' + foldedJobs.join('，');
      addFoldsListButton(preUnfolded, aTitle, 'bottom', 'end_with_fold');
      ul.classList.add('padding_bottom');
      endWithFold = true;
    }
  }

  /**
   * 添加折叠队列的控制按钮
   * @param {HTMLElement} li - 被添加按钮的元素
   * @param {string} aTitle - 超链接的标题，即被折叠的职位名称序列
   * @param {'top' | 'bottom'} position - 按钮的方位
   * @param {string | undefined} tip - 特殊类名标记
   */
  function addFoldsListButton(li, aTitle, position, tip) {
    const span = createElement('span', { class: `folds_list expand_${position}` });
    if (tip) span.classList.add(tip);
    const plusIcon = createElement('a', { class: 'staff_sorting_icon' });
    plusIcon.innerHTML = ICON.PLUS;
    plusIcon.title = aTitle;
    span.appendChild(plusIcon);
    li.appendChild(span);
  }

  /**
   * 对超出限制行数的职位信息进行二次折叠，并添加开关。
   * 实现动态不定摘要的类似于`summary`的功能。
   * 过滤`别名`等不定行高的`infobox`信息
   * @param {HTMLElement} li - 职位信息根节点
   * @param {HTMLElement} tip - 职位名称节点
   */
  function refoldJob(li, tip) {
    if (Store.get(Key.REFOLD_THRESHOLD_KEY) === Key.REFOLD_THRESHOLD_DISABLED) return;
    if (li.classList.contains('sub_container') || li.classList.contains('sub_group')) return;
    if (!JobStyle.compStyle) JobStyle.initialize(li);
    const lineCnt = getLineCnt(li);
    const refoldThr = Store.get(Key.REFOLD_THRESHOLD_KEY);
    if (lineCnt <= refoldThr) return;
    // 添加头部开关状态图标
    const prefIcon = createElement('i', { class: 'staff_sorting_icon' });
    prefIcon.innerHTML = ICON.TRIANGLE_RIGHT;
    /* 尝试使用<symbol><use>模板或直接使用JS构建实例的方法均失败...
     * 最终改为直接修改innerHTML */
    const switchPos = Store.get(Key.REFOLD_SWITCH_POSITION_KEY);
    if (switchPos == RefoldSwitchPosition.RIGHT) {
      updateSubElements(tip, prefIcon, 'append');
    } else if (switchPos == RefoldSwitchPosition.LEFT) {
      updateSubElements(tip, prefIcon, 'prepend');
    }
    tip.classList.add('switch');

    // 添加尾部折叠图标
    const suffIcon = createElement('i', { class: 'staff_sorting_icon' });
    const sideTip = createElement('span', {class: 'tip side'}, suffIcon);
    suffIcon.innerHTML = ICON.TRIANGLE_UP;
    li.appendChild(sideTip);

    // 记录被折叠的行数，由于 span{clear: right} 防止其换行，需先渲染并重新计算行数
    const refoldLine = getLineCnt(li) - refoldThr;
    // C.debug(getJobFromTip(tip), refoldLine);
    sideTipLineThr ??= getSideTipThr(); // 小于阈值的将被隐藏
    if (refoldLine >= sideTipLineThr) sideTip.dataset.refoldLine = refoldLine;
    // else delete sideTip.dataset.refoldLine;

    // 添加二次折叠效果 (样式将在随后通过 loadStaffStyle 动态载入)
    li.classList.add('refoldable', 'refolded');
    // const nest = nestElementWithChildren(li, 'div', {class: 'refoldable refolded'});
    /* 尝试不修改 DOM 结构仅通过添加样式达到完备的折叠效果，
     * 难点在于处理溢出到 li.padding-bottom 区域的信息
     * 最终通过施加多层遮蔽效果实现，故不再需要内嵌一层新的 div 元素 */
  }

  /**
   * 为多个折叠类型按钮绑定开关事件，
   * 包含一次连续折叠、二次折叠。
   * 采用`事件委托`形式绑定事件 (事件冒泡机制)
   * @param {HTMLElement} ul - `infobox`
   */
  function addFoldButtonListener(ul) {
    /* 检查点击的元素是否是开关本身 span 或其子元素 icon
     * 使用 .closest('.cls') 替代 classList.contains('cls')
     * 使得子元素也能响应点击事件 */
    ul.addEventListener('click', (event) => {
      /** @type {HTMLElement} 被点击的目标 */
      const target = event.target;
      let button;
      // 1.一次连续折叠
      button = target.closest('.folds_list');
      if (button && ul.contains(button)) {
        // 1.1一次连续折叠的前部开关
        if (button.classList.contains('expand_top')) return onFoldsList(button, 'previous');
        // 1.2一次连续折叠的后部开关
        if (button.classList.contains('expand_bottom')) {
          if (button.classList.contains('end_with_fold')) {
            ul.classList.remove('padding_bottom');
          }
          return onFoldsList(button, 'next');
        }
        return;
      }
      // 2.二次折叠
      if (Store.get(Key.REFOLD_THRESHOLD_KEY) === 0) return;
      // 2.1首部二次折叠开关
      button = target.closest('.switch');
      if (button && ul.contains(button)) return onPrefRefold(button);
      // 2.2尾部二次折叠开关
      button = target.closest('.side');
      if (button && ul.contains(button)) return onSuffRefold(button);
    });

    /**
     * 一次连续折叠的前部开关
     * @param {HTMLElement} button
     * @param {'previous' | 'next'} direction
     */
    function onFoldsList(button, direction) {
      const li = button.parentElement;
      const foldsList = getSiblings(li, direction, isFoldable);
      foldsList.forEach(removeFolded);
      button.classList.add('hidden');
    }
    function isFoldable(li) { return li.classList.contains('foldable'); }
    function removeFolded(li) { li.classList.remove('folded'); }

    /**
     * 首部折叠二次开关
     * @param {HTMLElement} prefTip
     */
    function onPrefRefold(prefTip) {
      // 职位名称或开关状态图标被点击了
      const li = prefTip.parentElement;
      if (li.classList.contains('refolded')) {
        li.classList.remove('refolded');
        prefTip.querySelector('i').innerHTML = ICON.TRIANGLE_DOWN;
      } else {
        li.classList.add('refolded');
        prefTip.querySelector('i').innerHTML = ICON.TRIANGLE_RIGHT;
      }
    }

    /**
     * 尾部折叠二次开关
     * @param {HTMLElement} prefTip
     */
    function onSuffRefold(suffTip) {
      const li = suffTip.parentElement;
      // 滚轮将自动上移被折叠的距离，以确保折叠后的内容不会让用户迷失上下文
      const rectBefore = li.getBoundingClientRect();
      // 更改折叠状态
      li.classList.add('refolded');
      // 等待下一帧，让浏览器完成渲染
      requestAnimationFrame(() => {
        const rectAfter = li.getBoundingClientRect();
        /* 尝试通过 suffTip.dataset.refoldLine 计算高度变化
         * 会与理想值有 ~0.5px 的随机偏差，故改用获取元素窗口的高度变化 */
        const distance = rectAfter.top - rectBefore.top + rectAfter.height - rectBefore.height;
        // C.debug( `\n` +
        //   `heightBefore: \t${rectBefore.height},\nheightAfter: \t${rectAfter.height},\n` +
        //   `topAfter: \t${rectAfter.top},\ntopBefore: \t${rectBefore.top},\ndistance: \t${distance},\n` +
        //   `byRefoldLine: \t${suffTip.dataset.refoldLine * JobStyle.lineHeight}`
        // );
        /* 需考虑 li.top 的前后变化，且不要使用 scrollTo
         * 因为部分浏览器对于超出视口的 li 元素进行折叠时，会自主进行防迷失优化，
         * 此时 distance 的计算机结果将会是 0 */
        window.scrollBy({ top: distance, behavior: 'instant' });
      });
      // 修改首部开关的图标
      li.firstChild.querySelector('i').innerHTML = ICON.TRIANGLE_RIGHT;
    }

    /* 在 mousedown 阶段阻止用户拖动或双击时的默认选中行为。
     * 由于 span.switch 本质仍然是内容段落的一部分，
     * 不通过 user-select: none 这钟粗暴的方法禁止用户的一切选中行为
     * 而是采用温和的方法阻止部分情形下对该区域的选中行为 */
    ul.addEventListener('mousedown', (event) => {
      if (event.target.closest('.switch')) event.preventDefault();
    });
  }

  /**
   * 处理最后一组`sub_group`，若为`infobox`末尾元素，则为其添加标签。
   * 以优化样式，当其非末尾元素时，添加边界以区分`sub_container > li`与普通`li`
   * @param {HTMLElement} ul - `infobox`
   */
  function dealLastGroup(ul) {
    if (!lastGroup || ul.lastElementChild !== lastGroup[lastGroup.length - 1]) return;
    lastGroup.forEach((li) => {
      if (li.classList.contains('sub_container'))
        li.classList.add('last_group');
    })
  }

  /**
   * 获取固定行高`#infobox.li`元素显示的行数
   * 经测试，职员信息除了`8px`的`padding`还有`<1px`的`border`因为不影响行数计算忽略
   */
  function getLineCnt(el, padding = 8, border = 0) {
    const height = el.getBoundingClientRect().height - padding - border;
    return ~~(height / JobStyle.lineHeight);
  }

  /**
   * 根据页面视口高度，计算尾部折叠图标的激活行数阈值
   * 对于二次折叠区域较小，不予显示
   */
  function getSideTipThr() {
    const threshold = ~~(getViewportHeight() / JobStyle.lineHeight * sideTipRate);
    C.debug(`${SCRIPT_NAME}：`, {'sideTipLineThreshold': threshold});
    return threshold;
  }

  /**
   * 将原本存在的`更多制作人员`一次性按钮，转绑新事件，并改为永久性左右双开关。
   * 使用网页原有的`folded`元素类别，实现对立于`StaffSorter`功能。
   * 通过`hasFolded`判断，若需要则进行添加，不需要则删除。
   * 双按钮中：
   *   1. 左开关拥有切换功能，用于常规场景；
   *   2. 右开关不能进行切换，用于辅助连续折叠功能。
   * @param {HTMLElement} ul - `infobox`
    <div class="infobox_expand">
      <a>更多制作人员 +</a>
      <a>更多制作人员 -</a>
    </div>
   */
  function modifyExpandButton(ul) {
    const buttonName = '更多制作人员';
    const buttonValue = { on: `${buttonName} +`, off: `${buttonName} -` };
    const infoboxCntr = ul.parentElement;
    let buttonCntr = document.querySelector('#infobox + .infobox_expand'); // 无法实现 :scope +
    let expandLink;
    // 无必要，不进行事件绑定与可能的添加，并将原有的开关隐藏
    if (!hasFolded) {
      if (buttonCntr) {
        buttonCntr.style.display = 'none';
        C.log(`${SCRIPT_NAME} - 将原有的 '${buttonName}' 隐藏`);
      } return;
    }
    // 检查原展开按钮
    if (!buttonCntr) {
      expandLink = createElement('a', null, buttonValue.on);
      buttonCntr = createElement('div', { class: 'infobox_expand' }, expandLink);
      infoboxCntr.appendChild(buttonCntr);
      C.log(`${SCRIPT_NAME}：添加原不存在的 '${buttonName}' 按钮`);
    } else {
      expandLink = buttonCntr.firstChild;
      expandLink.removeAttribute('href');
    }
    // 添加折叠按钮
    const collapseLink = createElement('a', null, buttonValue.off);
    buttonCntr.appendChild(collapseLink);
    const lis = ul.querySelectorAll(':scope > li');
    const foldsBtns = ul.querySelectorAll('span.folds_list');
    const foldedLis = ul.querySelectorAll(':scope > li.foldable');
    // 展开事件监听 (可能继承自网页原有的按钮)
    expandLink.addEventListener('click', function (event) {
      event.stopImmediatePropagation(); // 阻止其他事件的触发
      onClick(expandLink);
    }, { capture: true }); // 使事件处理函数在捕获阶段运行
    // 折叠事件监听
    collapseLink.addEventListener('click', function () {
      onClick(collapseLink);
    });
    // 监听粘滞效果
    const sentinel = createElement('div', { class: 'sticky-sentinel' });
    infoboxCntr.appendChild(sentinel);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const isStuck = entry.intersectionRatio < 1;
        buttonCntr.classList.toggle('stuck', isStuck);
      });
    }, { threshold: [1], rootMargin: '0px 0px -1px 0px' });
    observer.observe(sentinel);

    function onClick(link) {
      const flag = link === expandLink;
      // 寻找锚点元素
      let anchor = lis[0];
      for (const li of lis) {
        const rect = li.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          anchor = li;
          break;
        }
      }
      const yBefore = anchor.getBoundingClientRect().top;
      // 显示/隐藏职位
      foldedLis.forEach(li => li.classList.toggle('folded', !flag));
      // 修正滚动，防迷失
      const yAfter = anchor.getBoundingClientRect().top;
      window.scrollBy({ top: yAfter - yBefore, behavior: 'instant' });
      // 显示/隐藏连续折叠前后的展开按钮
      foldsBtns.forEach(button => button.classList.toggle('hidden', flag));
      if (endWithFold) ul.classList.toggle('padding_bottom', !flag);
      // 切换开关位置
      if (link === buttonCntr.firstChild) buttonCntr.appendChild(link);
    }
  }

  /**
   * 创建用户设置`UI`界面
   * 仿照`#columnA`中的同类元素进行构建，使用原有的结构与样式
    <table class="settings">
      <tbody>
        <tr>
          <td>
            <h2 class="subtitle">条目职位排序 · 默认折叠</h2>
            <div class="right_inline"><p class="tip_j">默认设置版本号</p></div>
          </td>
        </tr>
        <!-- 此处添加子模块 -->
      </tbody>
    </table>
   */
  function buildSettingUI(mainStyle) {
    const dataVersion = createElement('p', { class: 'tip_j' }, `数据 v${CURRENT_DATA_VERSION}`);
    const mainTitle = createElement('tr', null, [
      createElement('td', { class: 'maintitle' }, [
        createElement('h2', { class: 'subtitle' }, '条目职位排序 · 默认折叠'),
        createElement('div', {class: 'right_inline'}, dataVersion)
      ])
    ]);
    const lineLimitBlock = buildLineLimitBlock();
    const inheritPreMatchBlock = buildInheritPreMatchBlock();
    const refoldSwitchPosBlock = buildRefoldSwitchPosBlock();
    const subjectBlocks = SubjectType.getAll(true).map(sub => buildSubjectBlock(sub));
    const ui = createElement('div', mainStyle, [
      createElement('table', { class: 'settings' }, [
        createElement('tbody', null, [
          mainTitle,
          lineLimitBlock,
          refoldSwitchPosBlock,
          inheritPreMatchBlock,
          ...subjectBlocks,
        ])
      ])
    ]);
    // 隐藏功能，双击版本号触发版本数据强制刷新 (主要作为调试工具)
    dataVersion.addEventListener('dblclick', () => {
      Store.remove(Key.DATA_VERSION);
      location.reload();
    });
    return ui;
  }

  /**
   * 创建职位信息二次折叠的行高限制设置界面
    <tr class="line_limit_block">
      <td>
        <h2 class="subtitle">职位信息高度 限制</h2>
        <div class="right_inline">
          <fieldset class="num_input_cntr">...</fieldset>
          <div class="toggle">...</div>
        </div>
      </td>
    </tr>
   */
  function buildLineLimitBlock() {
    const subTitle = createElement('h2', { class: 'subtitle' }, '职位信息高度 限制');
    // 搭建滑动开关
    const [toggle, toggleCntr] = buildToggleSlider('refold_switch');
    // 搭建整数步进输入器
    const intInput = new IntInputStepper('refold_threshold_input', '行数');
    intInput.build();
    // 搭建外部框架
    const block = createElement('tr', { class: 'line_limit_block' }, [
      createElement('td', null, [
        subTitle,
        createElement('div', { class: 'right_inline' }, [
          intInput.root, toggleCntr
        ])
      ])
    ]);

    // 初始化 (此处无需关心Key._subType)
    toggle.checked = Store.get(Key.REFOLD_THRESHOLD_KEY) !== Key.REFOLD_THRESHOLD_DISABLED;
    intInput.num = Store.get(Key.REFOLD_THRESHOLD_KEY);
    if (!toggle.checked) {
      intInput.display = false;
      block.classList.add('turn_off');
    }
    // 绑定事件
    function setRefloadThreshold(num) {
      // 与缓存进行对比，防止无效写入
      if (num === Store.get(Key.REFOLD_THRESHOLD_KEY)) return;
      Store.set(Key.REFOLD_THRESHOLD_KEY, num, null, true);
    }
    toggle.addEventListener('click', () => {
      if (toggle.checked) {
        intInput.display = true;
        block.classList.remove('turn_off');
        setRefloadThreshold(intInput.num); // 使用 DOM 中可能的暂存数据
      } else {
        intInput.display = false;
        block.classList.add('turn_off');
        setRefloadThreshold(Key.REFOLD_THRESHOLD_DISABLED);
      }
    });
    intInput.onNumChange = setRefloadThreshold;

    return block;
  }

  /**
   * 创建二次折叠的开关位置设置界面
    <tr class="refold_switch_pos_block">
      <td>
        <h2 class="subtitle">· 折叠开关图标的位置</h2>
        <div class="right_inline">
          <p class="tip_j"><!-- message --></p>
          <div class="tri_state_selector">...</div>
        </div>
      </td>
    </tr>
   */
  function buildRefoldSwitchPosBlock() {
    const subTitle = createElement('h2', { class: 'subtitle' }, '· 折叠开关图标的位置');
    // 搭建滑动开关
    const selector = new TriStateSlider('refold_switch_position', RefoldSwitchPosition.getAll());
    const selectorMsgBox = createElement('p', { class: 'tip_j' });
    const selectorField = createElement('div', {class: 'right_inline'}, [
      selectorMsgBox, selector.root
    ]);
    selector.build();
    // 搭建外部框架
    const block = createElement('tr', { class: 'refold_switch_pos_block' }, [
      createElement('td', null, [
        subTitle, selectorField
      ])
    ]);
    // 初始化并绑定事件
    selector.state = Store.get(Key.REFOLD_SWITCH_POSITION_KEY);
    setSelectorMsgBox(selector.state);
    selector.onStateChange = (newState) => {
      setSelectorMsgBox(newState);
      Store.set(Key.REFOLD_SWITCH_POSITION_KEY, newState, null, true);
    };

    return block;

    function setSelectorMsgBox(state) {
      switch (state) {
        case RefoldSwitchPosition.NONE:
          setMessage(selectorMsgBox, '隐藏开关图标'); break;
        case RefoldSwitchPosition.LEFT:
          setMessage(selectorMsgBox, '位于职位名称左边'); break;
        case RefoldSwitchPosition.RIGHT:
          setMessage(selectorMsgBox, '位于职位名称右边'); break;
      }
    }
  }
  
  /**
   * 创建继承历史匹配记录设置界面
    <tr class="inherit_prematch_block">
      <td>
        <h2 class="subtitle">继承历史匹配记录</h2>
        <div class="right_inline">
          <p class="tip_j"><!-- message --></p>
          <div class="toggle">...</div>
        </div>
      </td>
    </tr>
   */
  function buildInheritPreMatchBlock() {
    const subTitle = createElement('h2', { class: 'subtitle' }, '继承历史匹配记录');
    // 搭建滑动开关
    const [toggle, toggleCntr] = buildToggleSlider('inherit_switch');
    const toggleMsgBox = createElement('p', { class: 'tip_j' });
    // 搭建外部框架
    const block = createElement('tr', { class: 'inherit_prematch_block' }, [
      createElement('td', null, [
        subTitle,
        createElement('div', {class: 'right_inline'}, [
          toggleMsgBox, toggleCntr
        ])
      ])
    ]);
    // 初始化并绑定事件
    toggle.checked = Store.get(Key.INHERIT_PREVIOUS_MATCHES_KEY);
    toggleOnClick();
    toggle.addEventListener('click', toggleOnClick);

    return block;

    function toggleOnClick() {
      if (toggle.checked) {
        setMessage(toggleMsgBox, '设置变更时将继承');
        Store.set(Key.INHERIT_PREVIOUS_MATCHES_KEY, true, null, true);
      } else {
        setMessage(toggleMsgBox, '设置变更时不继承');
        Store.set(Key.INHERIT_PREVIOUS_MATCHES_KEY, false, null, true);
      }
    }
  }

  /**
   * 创建`staffMapList`文本内容编辑界面
   * 对于`textarea`,`button`等控件仍然使用原有的结构与样式
    <tr class="subject_staff_block">
      <td>
        <details open="">
          <summary>
            <h2 class="subtitle"><!-- subject type --></h2>
            <div class="right_inline">
              <p class="tip_j"><!-- message --></p>
              <div class="tri_state_selector">...</div>
            </div>
          </summary>
          <div class="staffMapList_editor">...</div>
        </details>
      </td>
    </tr>
   */
  function buildSubjectBlock(subTypeObj) {
    const subType = subTypeObj.en;
    // 设置信息，editor 与 matchLog 公有
    const staffMapList = new StaffMapList(subType);
    // 搭建标题
    const subTitle = createElement('h2', { class: 'subtitle' });
    // 搭建滑动开关
    const selector = new TriStateSlider(`${subType}_subject_enable`, SortEnableState.getAll());
    const selectorMsgBox = createElement('p', { class: 'tip_j' });
    const selectorField = createElement('div', {class: 'right_inline hidden'}, [
      selectorMsgBox, selector.root
    ]);
    selector.build();
    // 定义编辑器，暂不构建
    const editor = new StaffMapListEditor(subType, staffMapList);
    // 搭建展开容器
    const detail = createElement('details', null, [
      createElement('summary', null, [
        subTitle, selectorField
      ]),
      editor.root,
    ])
    // 搭建外部结构
    const block = createElement('tr', {class: 'subject_staff_block'}, [
      createElement('td', null, detail)
    ]);

    // 初始化
    subTitle.textContent = `${subTypeObj.zh}条目`;
    detail.open = Store.get(Key.BLOCK_OPEN_KEY, subType);
    selector.state = Store.get(Key.ENABLE_STATE_KEY, subType);
    setSelectorMsgBox(selector.state);
    blockOnOpen();

    // 绑定事件
    selector.onStateChange = (newState) => {
      setSelectorMsgBox(newState);
      Store.set(Key.ENABLE_STATE_KEY, newState, subType, true);
    };
    detail.addEventListener('toggle', blockOnOpen); // 无需上下文环境

    return block;

    function setSelectorMsgBox(state) {
      switch (state) {
        case SortEnableState.ALL_DISABLED:
          setMessage(selectorMsgBox, '禁用设置，但仍可编辑保存'); break;
        case SortEnableState.PARTIAL_ENABLED:
          setMessage(selectorMsgBox, '仅启用排序，禁用折叠'); break;
        case SortEnableState.ALL_ENABLED:
          setMessage(selectorMsgBox, '启用自定义 / 默认设置'); break;
      }
    }
    function blockOnOpen() {
      if (detail.open) {
        // 在第一次展开时构建
        if (!editor.built) editor.build();
        selectorField.classList.remove('hidden');
      } else {
        selectorField.classList.add('hidden');
      }
      Store.set(Key.BLOCK_OPEN_KEY, detail.open, subType, true);
    }
  }

  /**
   * `staffMapList`编辑器，并对数据进行自主管理
    <div class="staffMapList_editor">
      <div class="markItUp">
        <textarea class="quick markItUpEditor hasEditor codeHighlight" name="staff_map_list">
          <!-- staffMapListText -->
        </textarea>
      </div>
      <div>
        <input class="inputBtn" type="submit" name="submit_context" value="保存">
        <input class="inputBtn" type="submit" name="reset_context" value="恢复默认">
        <p class="tip_j" style="display: inline;">
          <!-- message -->
        </p>
      </div>
      <!-- margin-right 为移动端预留的 mainpage 滑动空间 -->
    </div>
   */
  class StaffMapListEditor {
    static _editorCls = 'staffMapList_editor';

    /**
     * @param {string} subType - 条目类型
     * @param {StaffMapList} staffMapList
     */
    constructor(subType, staffMapList) {
      this.subType = subType;
      this.staffMapList = staffMapList;
      this.root = createElement('div', { class: StaffMapListEditor._editorCls });
      this.textArea = null; // 输入文本框
      this.resetBtn = null; // 提交按钮
      this.submitBtn = null; // 重置按钮
      this.editorMsgBox = null; // 简易提示框
      this.isDefault = null; // 标记是否为默认数据
      this.hasInputed = null; // 文本框内容是否被改变且未被保存
      this.preInheritState = Store.get(Key.INHERIT_PREVIOUS_MATCHES_KEY);
      this.built = false; // 标记是否已经初始化
    }

    build() {
      if (this.built) return; // 防止重复构建
      // 构建元素结构
      this.textArea = createElement('textarea', {
        class: 'quick markItUpEditor hasEditor codeHighlight', name: 'staff_map_list', id: `${this.subType}_staff_map_list`
      });
      this.submitBtn = createElement('input', {
        class: 'inputBtn', type: 'submit', name: 'submit_context', value: '保存'
      });
      this.resetBtn = createElement('input', {
        class: 'inputBtn', type: 'submit', name: 'reset_context', value: '恢复默认'
      });
      this.editorMsgBox = createElement('p', { class: 'tip_j'});
      this.root.append(
        createElement('div', { class: 'markItUp' }, this.textArea),
        createElement('div', null, [this.submitBtn, this.resetBtn, this.editorMsgBox])
      );
      // 初始化状态
      const text = this.staffMapList.formatToText(false);
      this.textArea.value = text;
      this.isDefault = this.staffMapList.isDefault;
      this.hasInputed = false;
      if (text.trim() === '') setMessage(this.editorMsgBox, '现为设置空缺', 0); // 网页实行原有的职位顺序与折叠
      else if (this.isDefault) setMessage(this.editorMsgBox, '现为默认设置', 0); // 初始化时，提醒用户已为默认设置
      else setMessage(this.editorMsgBox, '现为自定义设置', 0);
      // 绑定事件
      this.textArea.addEventListener('input', this._onInput.bind(this));
      this.resetBtn.addEventListener('click', this._onReset.bind(this));
      this.submitBtn.addEventListener('click', this._onSubmit.bind(this));
      this.built = true;
    }

    _onInput() {
      if (this.isDefault) this.isDefault = false;
      if (!this.hasInputed) this.hasInputed = true;
      // C.debug("IS INPUTTING");
    }

    async _onReset() {
      if (this.isDefault) return setMessage(this.editorMsgBox, '已为默认内容');
      await trySetText(
        this.textArea, this.editorMsgBox, this.staffMapList.formatToText(true),
        '已恢复默认内容', false
      );
      // 需进行同步等待，由于 setText 可能会触发 input 事件
      this.isDefault = true;
      this.hasInputed = false;
    }

    async _onSubmit() {
      // 判断是否为重置后未对默认内容进行修改
      if (this.isDefault) {
        if (this.staffMapList.isDefault && !this._onInheritStateChange()) {
          setMessage(this.editorMsgBox, '已为默认设置');
        } else {
          // 由自定义改为默认设置，或继承状态发生改变
          this.staffMapList.resetData();
          setMessage(this.editorMsgBox, '保存成功！恢复默认设置');
        }
        this.hasInputed = false;
        return;
      }
      if (!this.hasInputed && !this._onInheritStateChange()) {
        setMessage(this.editorMsgBox, '未作修改');
        return;
      }
      const [modifiedData, isModified, curCursorPos] = StaffMapListEditor.modifyText(this.textArea);
      // 强制将用户输入的文本外层嵌套 `[]`，若为重复嵌套可在 loadMapList 中识别并去除
      const savedData = `[${modifiedData}]`;
      const parsedData = RegexInJSON.parse(savedData);
      // 数据解析失败
      if (!parsedData) return setMessage(this.editorMsgBox, '保存失败！格式存在错误');
      // 保存数据
      this.staffMapList.saveData(savedData, parsedData);
      // 页面显示
      if (modifiedData.trim() === "") setMessage(this.editorMsgBox, '保存成功！空缺设置');
      else if (isModified) {
        await trySetText(
          this.textArea, this.editorMsgBox, modifiedData,
          '保存成功！并自动纠错', true, curCursorPos
        );
      } else setMessage(this.editorMsgBox, '保存成功！');
      this.hasInputed = false;
    }

    _onInheritStateChange() {
      const curInheritState = Store.get(Key.INHERIT_PREVIOUS_MATCHES_KEY);
      if (this.preInheritState !== curInheritState) {
        this.preInheritState = curInheritState;
        return true;
      } else return false;
    }

    /**
     * 对用户输入可能的常见语法与格式错误，进行自动纠错，以满足`JSON`格式
     * 并计算文本修改后，光标的适宜位置
     * 已基本兼容`JavaScript`格式的文本数据，实现格式转化
     * `group2`与`group4`致使正则表达式中不允许出现`/'"`三种字符
     */
    static modifyText(textArea) {
      const preCursorPos = getTextAreaPos(textArea).cursorPos;
      let curCursorPos = preCursorPos;
      let flags = new Array(6).fill(false);
      const rslt = textArea.value.replace(
        /(,\s*)+(?=]|$)|(?<=\[|^)(\s*,)+|(,\s*)+(?=,)|(['‘’“”])|(?<!['"‘“])(\/[^/'"‘’“”]+\/[gimsuy]*)(?!['"’”])|([，、])/g,
        (match, g1, g2, g3, g4, g5, g6, offset) => {
          isTriggered(0, '删除序列末尾元素后的 `,` 逗号', g1);
          isTriggered(1, '删除序列首位元素前的 `,` 逗号', g2);
          isTriggered(2, '删除连续重复的 `,` 逗号', g3);
          isTriggered(3, '将非半角单引号的引号替换', g4);
          isTriggered(4, '将正则表达式以双引号包裹', g5);
          isTriggered(5, '将全角逗号顿号变为半角逗号', g6);
          if (booleanOr(g1, g2, g3)) {
            let diff = preCursorPos - offset;
            if (diff > 0) curCursorPos -= Math.min(diff, match.length);
            return '';
          }
          if (g4) return '"';
          if (g5) {
            if (offset < preCursorPos && preCursorPos < offset + match.length) curCursorPos += 1;
            else if (preCursorPos >= offset + match.length) curCursorPos += 2;
            return `"${match}"`;
          }
          if (g6) return ',';
          return match;
        });
      return [rslt, booleanOr(...flags), curCursorPos];

      function isTriggered(index, msg, ...groups) {
        if (!flags[index] && booleanOr(...groups)) {
          C.log(`${SCRIPT_NAME}：触发自动纠错 - ${msg}`);
          flags[index] = true;
        }
      }
      function booleanOr(...values) {
        return values.reduce((acc, val) => acc || val, false);
      }
    }
  }

  /**
   * 整数步进输入器，
   * 不使用`input.type: 'number'`而是自我搭建相关控制
    <fieldset class="num_input_cntr">
      <span class="text">行数</span>
      <input class="inputtext input_num" type="text" maxlength="2">
      <div class="num_ctrs">
        <div><svg>...</svg></div>
        <div><svg>...</svg></div>
      </div>
    </fieldset>
   */
  class IntInputStepper {
    static default = Key.REFOLD_THRESHOLD_DEFAULT;
    // 所用样式的类名
    static _fieldCls = 'num_input_cntr';
    static _inputCls = 'inputtext input_num';
    static _ctrsCls = 'num_ctrs';
    /**
     * @type {(newNum: int) => void | null}
     * 回调函数，当数据变化时被调用
     */
    onNumChange = null;

    constructor(id, labelName, initNum = IntInputStepper.default) {
      this.root = createElement('fieldset', { class: IntInputStepper._fieldCls });
      this.numInput = null;
      this.incBtn = null;
      this.decBtn = null;
      this.id = id;
      this.labelName = labelName;
      this.initNum = initNum;
      this.minNum = {int: 1, str: '1'};
      this.maxDigits = 2;
    }

    set num(num) {
      if(!num) num = IntInputStepper.default;
      this.numInput.value = String(num);
    }
    get num() {
      return Number(this.numInput.value);
    }
    /**  @param {boolean} flag */
    set display(flag) {
      this.root.style.display = flag ? 'flex' : 'none';
    }

    build() {
      // 构建元素结构
      this.numInput = createElement('input', {
        class: IntInputStepper._inputCls, type: 'text', maxlength: this.maxDigits, id: this.id
      });
      this.incBtn = createElement('div', { name: 'inc_btn' });
      this.decBtn = createElement('div', { name: 'dec_btn' });
      this.incBtn.innerHTML = ICON.TRIANGLE_UP;
      this.decBtn.innerHTML = ICON.TRIANGLE_DOWN;
      this.root.append(
        createElement('span', { class: 'text' }, this.labelName),
        this.numInput,
        createElement('div', { class: IntInputStepper._ctrsCls }, [this.incBtn, this.decBtn])
      );
      // 初始化状态并绑定事件
      this.num = this.initNum;
      this.numInput.addEventListener('input', this._onInput.bind(this));
      this.numInput.addEventListener('keydown', this._onKeyDown.bind(this));
      this.incBtn.addEventListener('click', this._onInc.bind(this));
      this.decBtn.addEventListener('click', this._onDec.bind(this));
    }

    /** 限制输入为正整数 */
    _onInput() {
      let value = this.numInput.value.replace(/[^0-9]/g, '');
      if (value === '' || parseInt(value) === 0) value = this.minNum.str;
      this.numInput.value = value;
      if (this.onNumChange) this.onNumChange(this.num);
    }
    /** 限制键盘输入行为，禁止非数字键输入 */
    _onKeyDown(event) {
      if (!/^[0-9]$/.test(event.key) && event.key !== 'Backspace'
        && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
        event.preventDefault();
      if (event.key === 'ArrowUp') this._onInc();
      else if (event.key === 'ArrowDown') this._onDec();
    }
    /** 步增，可按钮或键盘触发 */
    _onInc() {
      let value = this.num;
      this.num = value + 1;
      if (this.onNumChange) this.onNumChange(this.num);
    }
    /** 步减，可按钮或键盘触发 */
    _onDec() {
      let value = this.num;
      if (value > this.minNum.int) this.num = value - 1;
      if (this.onNumChange) this.onNumChange(this.num);
    }
  }

  /**
   * 三态滑动选择器
    <div class="tri_state_selector">
      <input type="radio" name="_subject_enable_group" value="allDisable" class="radio_input">
      <label class="radio_label"></label>
      <input type="radio" name="_subject_enable_group" value="partialEnable" class="radio_input">
      <label class="radio_label"></label>
      <input type="radio" name="_subject_enable_group" value="allEnable" class="radio_input">
      <label class="radio_label"></label>
      <div class="select_slider">
        <div class="select_indicator"></div>
      </div>
    </div>
   */
  class TriStateSlider {
    // 所用样式的类名
    static _selectorCls = 'tri_state_selector';
    static _radioCls = 'radio_input';
    static _labelCls = 'radio_label';
    static _sliderCls = 'select_slider';
    static _indicatorCls = 'select_indicator';
    /** 待选状态 */
    states = [
      "0", // 灰
      "1", // 红
      "2", // 蓝
    ];
    /**
     * @type {(newState: string) => void | null}
     * 回调函数，当状态变化时被调用
     */
    onStateChange = null;

    constructor(idPref, states) {
      this.root = createElement('div', { class: TriStateSlider._selectorCls });
      this.radios = {};
      this.idPref = idPref;
      this.states = states.slice(0, 3);
      this.initState = this.states[2];
      this._stateHis = {pre: null, pre2: null};
    }

    set state(state) {
      if (!state || !this.states.includes(state))
        state = this.states[2];
      this.initState = state;
      this._initStateHis();
      this.radios[state].checked = true;
    }

    get state() {
      for (const [state, radio] of Object.entries(this.radios)) {
        if (radio.checked) return state;
      }
      return this.initState;
    }

    /**
     * 构造`DOM`树，并绑定事件
     */
    build() {
      // 构建单选格，radio 本体将通过样式隐藏
      this.states.forEach((state) => {
        const radioId = `${this.idPref}_${state}`;
        const radio = createElement('input', {
          type: 'radio', name: `${this.idPref}_group`, id: radioId,
          value: state, class: TriStateSlider._radioCls
        });
        const label = createElement('label', { htmlFor: radioId, class: TriStateSlider._labelCls });
        this.radios[state] = radio;
        this.root.append(radio, label);
      });
      // 构建滑动外观
      this.root.append(
        createElement('div', { class: TriStateSlider._sliderCls },
          createElement('div', { class: TriStateSlider._indicatorCls })
      ));
      // 初始化状态并绑定事件
      this.radios[this.initState].checked = true;
      // 1) 箭头函数每次事件触发时，都会创建一个新的匿名函数，影响性能
      // this.selector.addEventListener('click', (event) => this._onClick(event));
      // 2) 事件监听器的回调函数本身会改变 this，使得它从指向类的实例对象，变为指向事件触发的元素
      // this.selector.addEventListener('click', this._onClick);
      // 3) 使用绑定后的函数
      this.root.addEventListener('click', this._onClick.bind(this));
    }

    _initStateHis() {
      this._stateHis.pre = this.initState;
      // 设定历史状态，使得无需在 _onClick 为重复点击初始状态单独处理
      this._stateHis.pre2 = this.initState === this.states[1]
        ? this.states[2] : this.states[1]; // ((1,3) 2)->(2 3)
    }

    /**
     * 采用事件委托的形式处理点击事件，
     * 将原本的`radio`操作体验处理为`ToggleSlider`手感
     */
    _onClick(event) {
      if (!event.target.classList.contains('radio_input')) return;
      let curState = event.target.value;
      // 现在与过去互异，正常不处理；现在与过去的过去互异，模拟 Toggle
      if (curState === this._stateHis.pre && curState !== this._stateHis.pre2) {
        this.radios[this._stateHis.pre2].checked = true;
        curState = this._stateHis.pre2;
      }
      this._stateHis.pre2 = this._stateHis.pre;
      this._stateHis.pre = curState;
      // 使用回调函数通知外部
      if (this.onStateChange) this.onStateChange(curState);
    }
  }

  /**
   * 创建一个滑动开关
   * @param {string} sliderId - 开关的`ID`
   * @returns {[HTMLElement, HTMLElement]} 返回`开关`与`开关容器`构成的数组
    <div class="toggle">
      <input class="toggle_input" type="checkbox" id="refold_switch">
      <label class="toggle_slider" for="refold_switch"></label>
    </div>
   */
  function buildToggleSlider(sliderId) {
    const toggle = createElement('input', { class: 'toggle_input', type: 'checkbox', id: sliderId });
    const toggleCntr = createElement('div', { class: 'toggle' },
      [toggle, createElement('label', { class: 'toggle_slider', htmlFor: sliderId })]
    );
    return [toggle, toggleCntr];
  }

  /**
   * 优先尝试使用`execCommand`方法改写文本框，使得改写前的用户历史记录不被浏览器清除
   * (虽然`execCommand`方法已被弃用...但仍然是实现该功能最便捷的途径)
   */
  async function trySetText(textArea, msgBox, text, msg, isRestore, setCursorPos = null, transTime = 100) {
    let {scrollVert, cursorPos} = getTextAreaPos(textArea);
    try {
      setMessage(msgBox);
      await clearAndSetTextarea(textArea, text, transTime);
      setMessage(msgBox, `${msg}，可快捷键撤销`, 0);
    } catch {
      textArea.value = '';
      await delay(transTime);
      textArea.value = text;
      setMessage(msgBox, msg, 0);
      C.log(`${SCRIPT_NAME}：浏览器不支持 execCommand 方法，改为直接重置文本框，将无法通过快捷键撤销重置`)
    }
    if (isRestore) {
      setCursorPos ??= cursorPos; // 可以使用外部计算获取的光标位置
      restorePos();
    }

    /**
     * 恢复滚动位置和光标位置
     */
    function restorePos() {
      const currentTextLen = textArea.value.length;
      if (setCursorPos > currentTextLen) setCursorPos = currentTextLen;
      textArea.scrollTop = Math.min(scrollVert, textArea.scrollHeight);
      // textArea.scrollLeft = Math.min(scrollHoriz, textArea.scrollWidth - textArea.clientWidth);
      textArea.setSelectionRange(setCursorPos, setCursorPos);
    }
  }

  /**
   * 获取文本框的滚动位置和光标位置
   */
  function getTextAreaPos(textArea) {
    return {
      scrollVert: textArea.scrollTop,
      scrollHoriz: textArea.scrollLeft,
      cursorPos: textArea.selectionStart
    };
  }

  async function clearAndSetTextarea(textarea, newText, timeout = 100) {
    textarea.focus();
    // 全选文本框内容并删除
    textarea.setSelectionRange(0, textarea.value.length);
    document.execCommand('delete');
    // 延迟一段时间后，插入新的内容
    await delay(timeout);
    document.execCommand('insertText', false, newText);
  }

  async function setMessage(container, message, timeout = 100) {
    container.style.display = 'none';
    if (!message) return; // 无信息输入，则隐藏
    // 隐藏一段时间后，展现新内容
    if (timeout) await delay(timeout);
    container.textContent = message;
    container.style.display = 'inline';
  }

  /**
   * 获取当前页面的视口高度
   */
  function getViewportHeight() {
    return document.documentElement.clientHeight || document.body.clientHeight;
  }

  /**
   * 获取该元素前后所有连续的符合要求的兄弟节点
   * @param {HTMLElement} element - 元素
   * @param {'both' | 'previous' | 'next'} direction - 捕获的方向
   * @param {(el: HTMLElement) => boolean} [condition=() => true]
   *  - 兄弟节点的条件要求，一旦结果为否将终止该方向的捕获
   * @returns {Array<HTMLElement>}
   */
  function getSiblings(element, direction, condition = () => true) {
    let siblings = [];
    if (direction === 'both' || direction === 'previous') {
      let sibling = element.previousElementSibling;
      while (sibling && condition(sibling)) {
        siblings.push(sibling);
        sibling = sibling.previousElementSibling;
      }
    }
    if (direction === 'both' || direction === 'next') {
      let sibling = element.nextElementSibling;
      while (sibling && condition(sibling)) {
        siblings.push(sibling);
        sibling = sibling.nextElementSibling;
      }
    }
    return siblings;
  }

  /**
   * 创建元素实例
   * @param {string} tagName - 类名
   * @param {Object | undefined} options - 属性
   * @param {Array<HTMLElement | string> | undefined} subElements - 子元素
   * @param {Object<string, Function> | undefined} eventHandlers - 绑定的事件
   */
  function createElement(tagName, options, subElements, eventHandlers) {
    const element = document.createElement(tagName);
    if (options) {
      for (const opt of Object.keys(options)) {
        if (opt === 'class') element.className = options[opt];
        else if (['maxlength', 'open'].includes(opt)) {
          element.setAttribute(opt, options[opt]);
        } else if (opt === 'dataset' || opt === 'style') {
          for (const key of Object.keys(options[opt])) {
            element[opt][key] = options[opt][key];
          }
        } else element[opt] = options[opt];
      }
    }
    if (subElements) updateSubElements(element, subElements);
    if (eventHandlers) {
      for (const e of Object.keys(eventHandlers)) {
        element.addEventListener(e, eventHandlers[e]);
      }
    }
    return element;
  }

  /**
   * 更新子元素的内容
   * @param {HTMLElement} parent - 父元素
   * @param {Array<HTMLElement | string> | HTMLElement | string | undefined} subElements - 要插入的子元素
   * @param {'append' | 'prepend' | 'replace'} [actionType='append'] - 操作类型，可以是以下之一：
   *  - `prepend` 将元素插入到父元素的首位
   *  - `append` 将元素插入到父元素的末尾
   *  - `replace` 清空父元素内容并插入元素
   */
  function updateSubElements(parent, subElements, actionType = 'append') {
    if (actionType === 'replace') parent.innerHTML = '';
    if (!subElements) return parent;
    if (!utils.isArray(subElements)) subElements = [subElements];
    subElements = subElements.map(e => typeof e === 'string' ? document.createTextNode(e) : e);
    switch (actionType) {
      case 'append':
      case 'replace':
        parent.append(...subElements);
        break;
      case 'prepend':
        parent.prepend(...subElements);
        break;
      default:
        throw new Error(`'${actionType}' is invalid action type of updateElements!`);
    }
    return parent;
  }

  /**
   * 使用闭包定义防抖动函数模板。
   * 若为立即执行，将先执行首次触发，再延迟执行最后一次触发
   * @param {Function} func - 回调函数
   * @param {boolean} [immediate=false] - 是否先立即执行
   */
  function debounce(func, immediate = false, delay = DEBOUNCE_DELAY) {
    let timer = null;
    return function (...args) {
      const context = this; // 保存调用时的上下文
      const callNow = immediate && !timer;
      if (timer) clearTimeout(timer);
      // 设置新的定时器
      timer = setTimeout(() => {
        timer = null;
        if (!immediate) func.apply(context, args); // 延时执行
      }, delay);
      if (callNow) func.apply(context, args); // 立即执行
    };
  }

  /** 异步延迟 */
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /** 基本工具函数集 */
  const utils = {
    isObject: (value) => value !== null && typeof value === 'object',
    isArray: Array.isArray,
    isSet: (value) => value instanceof Set,
    isRegExp: (value) => value instanceof RegExp,
    isString: (value) => typeof value === 'string',
    isBoolean: (value) => typeof value === 'boolean',
    isFunction: (value) => typeof value === 'function',
    isNumber: (value) => typeof value === 'number' && !isNaN(value),
    isFinity: (num) => Number.isFinite(num),

    /**
     * 过滤对象中的方法，只返回对象的枚举值
     * @param {Object} obj - 需要过滤的对象
     * @param {(value: any) => boolean} [filterFn=value => typeof value !== 'function']
     * - 过滤函数 (默认过滤掉函数类型)
     * @returns {Array} 过滤后的枚举值数组
     */
    filterEnumValues: (
      obj, filterFn = (value) => typeof value !== 'function'
    ) => Object.values(obj).filter(filterFn),

    /**
     * 归并排序
     * @param {Array} arr1 - 第一个有序数组
     * @param {Array} arr2 - 第二个有序数组
     * @param {number} [len1=arr1.length] - 第一个数组的归并长度
     * @param {number} [len2=arr2.length] - 第二个数组的归并长度
     * @param {(a: any, b: any) => number} [compareFn=(a, b) => a - b] - 自定义比较函数
     * @returns {Array} 归并后的有序数组
     */
    mergeSorted: (
      arr1, arr2, len1 = arr1.length, len2 = arr2.length, compareFn = (a, b) => a - b
    ) => {
      if (len1 > arr1.length) len1 = arr1.length;
      if (len2 > arr2.length) len2 = arr2.length;
      const sortedArray = [];
      let i = 0;
      let j = 0;
      while (i < len1 && j < len2) {
        if (compareFn(arr1[i], arr2[j]) <= 0) sortedArray.push(arr1[i++]);
        else sortedArray.push(arr2[j++]);
      }
      while (i < len1) sortedArray.push(arr1[i++]);
      while (j < len2) sortedArray.push(arr2[j++]);
      return sortedArray;
    },
  };

  /**
   * `infobox.li`职位人员信息的计算样式
   */
  const JobStyle = {
    compStyle: null,
    // fontSize: null, // num
    lineHeight: null, // num
    borderBottom: null, // px
    paddingBottom: null, // px
    initialize(el) {
      this.compStyle = window.getComputedStyle(el); // 通常不会返回 em % normal 类别的数据
      // this.fontSize = parseFloat(this.compStyle.fontSize);
      this.lineHeight = parseFloat(this.compStyle.lineHeight);
      this.borderBottom = this.compStyle.borderBottomWidth;
      this.paddingBottom = this.compStyle.paddingBottom;
      C.debug(`${SCRIPT_NAME}：JobStyle`, {
        'lineHeight': `${this.lineHeight}px`,
        'borderBottom': this.borderBottom,
        'paddingBottom': this.paddingBottom,
      });
    },
    /** 设置职位排序的样式参数 */
    setStaffStyleProperty() {
      if (!this.compStyle) return;
      document.documentElement.style.setProperty('--job-line-height', `${this.lineHeight}px`);
      document.documentElement.style.setProperty('--job-border-bottom', this.borderBottom);
      document.documentElement.style.setProperty('--job-padding-bottom', this.paddingBottom);
    },
  }

  const DockStyle = {
    $el: $('#dock'),
    lastHeight: null,
    getHeight() {
      const h = `${this.$el?.outerHeight(true) || 0}px`;
      this.lastHeight ??= h;
      C.debug(`${SCRIPT_NAME}：DockHeight`, h);
      return h;
    },
    watchHeight(duration) {
      const el = this.$el?.get(0);
      if (!(el instanceof HTMLElement)) return;
      this.lastHeight = this.getHeight();
      const ro = new ResizeObserver(() => {
        const h = this.getHeight();
        if (h !== this.lastHeight) {
          this.lastHeight = h;
          document.documentElement.style.setProperty('--dock-height', h);
        }
      });
      ro.observe(el);
      if (!duration) return;
      setTimeout(() => {
        ro.disconnect();
      }, duration);
    }
  }

  /**
   * 动态载入职位排序的默认样式。
   * 通过先于`DOM`操作载入样式再设置参数的方式，加快解析与渲染。
   */
  function loadStaffStyle() {
    const style = createElement('style', {class: 'staff_sorting'});
    style.innerHTML = `
      :root {
        --refold-threshold: ${Store.get(Key.REFOLD_THRESHOLD_KEY)};
        --job-line-height: 18px;
        --job-border-bottom: 0.64px;
        --job-padding-bottom: 4px;
        --dock-height: ${DockStyle.getHeight()};
      }

      #infobox {
        /* 强制关闭内部元素的滚动锚点，交由 JS 来精确控制 */
        overflow-anchor: none;
      }

      /* 删除与前继元素重复的边线 */
      #infobox li.sub_container li.sub_section:first-child,
      #infobox li.sub_group,
      html[data-theme='dark'] ul#infobox li.sub_group {
        border-top: none; !important
      }

      /* 优化小组样式 */
      #infobox li:not(.last_group)[attr-info-group] {
        border-bottom: none;
      }
      #infobox li:not(.last_group)[attr-info-group] > ul {
        border-bottom: 3px solid #fafafa;
      }
      html[data-theme='dark'] #infobox li:not(.last_group)[attr-info-group] > ul {
        border-bottom: 3px solid #3d3d3f;
      }

      /* 防止图标可能污染爬取 infobox 数据的脚本 */
      .staff_sorting_icon {
        display: none;
      }
      #infobox .staff_sorting_icon {
        display: inline;
      }

      /* 公用 */
      #infobox span.tip.switch:hover i,
      #infobox span.tip.side:hover i,
      #infobox span.folds_list:hover {
        color: #2ea6ff;
      }

      /* 职位信息一次折叠 */
      #infobox li.foldable {
        background-color: transparent;
        transition: background-color 1s ease;
      }
      #infobox li.foldable.folded {
        display: list-item;
        background-color: grey;
        visibility: hidden;    /* 不移除元素，只是隐藏 */
        height: 0;
        padding: 0;
        margin: 0;
        border: none;
      }

      /* 更多制作人员 */
      #infobox + .infobox_expand {
        display: grid;
        grid-template-columns: 1fr 1fr;
        border-bottom: 1px solid #EEE; /* 同原有的border-top */
      }
      html[data-theme='dark'] #infobox + .infobox_expand {
        border-bottom: 1px solid #444;
      }
      #infobox + .infobox_expand > a {
        cursor: pointer;
        /* transition: height 0.3s ease; */
      }
      #infobox + .infobox_expand > a:first-child {
        border-right: 2px solid #EEE;
      }
      html[data-theme='dark'] #infobox + .infobox_expand > a:first-child {
        border-right: 2px solid #2d2e2f;
      }

      /* 优化移动端样式 */
      #infobox ~ .sticky-sentinel {
        position: absolute;
        bottom: 0;
        width: 1px;
        height: 1px;
      }
      @media (max-width: 640px) {
        #infobox + .infobox_expand.stuck > a {
          padding-bottom: calc(var(--dock-height) + 7px);
        }
      }

      /* 职位信息一次折叠队列展开 */
      #infobox.padding_bottom {
        padding-bottom: 10px;
      }
      #infobox li {
        position: relative;
      }
      #infobox span.folds_list {
        position: absolute;
        width: 32px;
        height: 8px;
        right: -8px;
        cursor: pointer;
      }
      #infobox span.folds_list.hidden {
        display: none;
      }
      #infobox span.folds_list:hover {
        height: 16px;
      }
      #infobox span.folds_list.expand_top {
        top: calc(-4px - var(--job-border-bottom) / 2);
      }
      #infobox span.folds_list.expand_top:hover {
        top: calc(-8px - var(--job-border-bottom) / 2);
      }
      #infobox span.folds_list.expand_bottom {
        bottom: calc(-4px - var(--job-border-bottom) / 2);
      }
      #infobox span.folds_list.expand_bottom:hover {
        bottom: calc(-8px - var(--job-border-bottom) / 2);
      }
      #infobox span.folds_list a,
      #infobox span.folds_list svg {
        position: absolute;
        height: 100%;
        top: 0;
      }
      #infobox span.folds_list a {
        width: 100%;
        left: 0;
      }
      #infobox span.folds_list svg {
        width: auto;
        right: 0;
      }
      #infobox span.folds_list:hover svg {
        right: -4px;
      }
      .tooltip.folds_list_tip .tooltip-arrow {
        margin-left: 8px;
      }
      .tooltip.folds_list_tip .tooltip-inner {
        max-width: 142px;
        text-align: center;
      }

      /* 职位信息二次折叠 */
      #infobox li.refoldable {
        display: inline-block; /* 使其容纳.tip.side */
        overflow: visible;
        height: auto;
      }
      #infobox li.refolded {
        display: block;
        overflow: hidden;
        height: calc(var(--refold-threshold) * var(--job-line-height));
        /* 由下至上进行遮蔽 */
        -webkit-mask-image:
          linear-gradient(black, black),
          linear-gradient(transparent, transparent),
          linear-gradient(160deg, black 10%, transparent 90%),
          linear-gradient(black, black);
                mask-image:
          linear-gradient(black, black),                       /* 显现 border-bottom */
          linear-gradient(transparent, transparent),           /* 隐藏溢出到 padding-bottom 区域的信息 */
          linear-gradient(160deg, black 10%, transparent 90%), /* 修饰最后一行人员信息 */
          linear-gradient(black, black);                       /* 显现其余的人员信息 */
        -webkit-mask-size:
          100% var(--job-border-bottom),
          100% var(--job-padding-bottom),
          100% var(--job-line-height),
          100% 100%;
                mask-size:
          100% var(--job-border-bottom),
          100% var(--job-padding-bottom),
          100% var(--job-line-height),
          100% 100%;
        -webkit-mask-position:
          0 100%,
          0 calc(100% - var(--job-border-bottom)),
          0 calc(100% - var(--job-border-bottom) - var(--job-padding-bottom)),
          0 calc(100% - var(--job-border-bottom) - var(--job-padding-bottom) - var(--job-line-height));
                mask-position:
          0 100%,
          0 calc(100% - var(--job-border-bottom)),
          0 calc(100% - var(--job-border-bottom) - var(--job-padding-bottom)),
          0 calc(100% - var(--job-border-bottom) - var(--job-padding-bottom) - var(--job-line-height));
        -webkit-mask-repeat: no-repeat;
                mask-repeat: no-repeat;
        -webkit-mask-composite: source-over;
                mask-composite: add;
      }
      #infobox .tip.switch,
      #infobox .tip.side {
        cursor: pointer;
      }
      #infobox .tip.switch:hover {
        color: #000;
      }
      html[data-theme='dark'] #infobox .tip.switch:hover {
        color: #FFF;
      }
      #infobox .tip.side {
        display: none;
        float: right; /* 将其推到尾行右侧 */
        clear: right; /* 如果尾行放不下，则换到新行 */
        margin: 0 5px;
      }
      #infobox .tip.side[data-refold-line] {
        display: inline-block;
      }
    `;
    document.head.appendChild(style);
  }

  /** 载入设置界面的样式 */
  function loadSettingStyle() {
    const style = createElement('style', {class: 'staff_sorting'});
    // 使用CSS变量提高对代码的复用性
    style.innerHTML = `
      :root {
        --state-selector-size: 22px;
        --state-selector-step: 19px;
      }

      /* 设置界面的样式 */
      #staff_sorting > .settings {
        margin-left: 5px;
      }
      #staff_sorting .right_inline {
        display: flex;
        float: right;
        align-items: center;
      }
      #staff_sorting .right_inline .tip_j {
        margin-right: 15px;
      }
      #staff_sorting .hidden {
        display: none;
      }
      #staff_sorting h2 {
        display: inline-block;
      }
      #staff_sorting [class*='_block'] h2 {
        font-size: 16px;
      }

      /* 主标题 */
      #staff_sorting .maintitle .right_inline {
        height: 25px;
      }
      #staff_sorting .maintitle .tip_j {
        font-size: 13px;
        margin-right: 6px;
      }

      /* 二次折叠的开关位置设置 */
      #staff_sorting .line_limit_block.turn_off ~ .refold_switch_pos_block {
        display: none;
      }

      /* 各类型条目的职位设置模块 */
      .subject_staff_block h2,
      .subject_staff_block summary::marker {
        cursor: pointer;
      }
      .subject_staff_block .tip_j {
        display: none;
        margin: 0 5px;
      }
      .subject_staff_block .staffMapList_editor {
        padding-right: 10%;
        margin-bottom: 5px;
      }
      .staffMapList_editor .inputBtn {
        margin-right: 5px;
      }
      .staffMapList_editor textarea {
        font-size: 15px;
        line-height: 21px;
      }

      /* 数字输入框与控制器 */
      .num_input_cntr {
        display: flex;
        float: left;
        align-items: center;
        gap: 5px;
        margin-right: 30px;
      }
      .num_input_cntr .text {
        font-size: 14px;
        margin-right: 2px;
      }
      .inputtext.input_num {
        width: 30px;
        height: 11px;
        text-align: center;
        font-size: 15px;
      }
      .num_ctrs {
        display: flex;
        flex-direction: column;
        background-color: white;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
        gap: 0;
      }
      html[data-theme="dark"] .num_ctrs {
        background-color: black;
        border: 1px solid #757575;
      }
      .num_ctrs div {
        display: flex;
        text-align: center;
        width: 12px;
        height: 6.5px;
        padding: 2px;
        cursor: pointer;
      }
      .num_ctrs div:first-child {
        border-radius: 3px 3px 0 0;
      }
      .num_ctrs div:last-child {
        border-radius: 0 0 3px 3px;
      }
      .num_ctrs div svg {
        width: 100%;
        height: 100%;
      }
      .num_ctrs div:active {
        background-color: #2ea6ff;
      }

      /* 滑动开关 */
      .toggle {
        position: relative;
        width: 44px;
        height: 22px;
        display: block;
        float: right;
      }
      .toggle_input {
        display: none;
      }
      .toggle_slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #eaeaea;
        border-radius: 22px;
        box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.2);
        transition: background-color 0.2s ease-in;
      }
      html[data-theme="dark"] .toggle_slider {
        background-color: #9a9a9a;
      }
      .toggle_slider::before {
        content: "";
        position: absolute;
        height: 16px;
        width: 16px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        border-radius: 50%;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
        transition: transform 0.2s ease-in;
      }
      .toggle_input:checked + .toggle_slider {
        background-color: #72b6e3;
      }
      html[data-theme="dark"] .toggle_input:checked + .toggle_slider {
        background-color: #3072dc;
      }
      .toggle_input:checked + .toggle_slider::before {
        transform: translateX(22px);
      }

      /* 滑动选择器公有 */
      .tri_state_selector {
        position: relative;
        height: var(--state-selector-size);
        display: inline-block;
      }
      .radio_input {
        position: absolute;
        opacity: 0;
        z-index: 2;
      }
      .select_slider {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #eaeaea;
        border-radius: var(--state-selector-size);
        box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 1;
        overflow: hidden;
        transition: background-color 0.2s ease-in;
      }
      html[data-theme="dark"] .select_slider {
        background-color: #9a9a9a;
      }
      .select_indicator {
        position: absolute;
        width: calc(var(--state-selector-size) - 4px);
        height: calc(var(--state-selector-size) - 4px);
        top: 2px;
        left: 2px;
        background-color: white;
        border-radius: 50%;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
        z-index: 1;
        transition: transform 0.2s ease-in;
      }
      .radio_label {
        position: absolute;
        width: var(--state-selector-step);
        height: 100%;
        top: 0;
        cursor: pointer;
        z-index: 3;
      }

      /* 三态滑动选择器 */
      .tri_state_selector {
        width: calc(
          var(--state-selector-size) + var(--state-selector-step) * 2
        );
      }
      label.radio_label:nth-of-type(1) {
        left: 0;
      }
      label.radio_label:nth-of-type(2) {
        left: var(--state-selector-step);
      }
      label.radio_label:nth-of-type(3) {
        width: var(--state-selector-size);
        left: calc(var(--state-selector-step) * 2);
      }
      input.radio_input:nth-of-type(2):checked ~ .select_slider {
        background-color: #f47a88;
      }
      input.radio_input:nth-of-type(3):checked ~ .select_slider {
        background-color: #72b6e3;
      }
      html[data-theme="dark"] input.radio_input:nth-of-type(2):checked ~ .select_slider {
        background-color: #ff668a;
      }
      html[data-theme="dark"] input.radio_input:nth-of-type(3):checked ~ .select_slider {
        background-color: #3072dc;
      }
      input.radio_input:nth-of-type(1):checked ~ .select_slider .select_indicator {
        transform: translateX(0);
      }
      input.radio_input:nth-of-type(2):checked ~ .select_slider .select_indicator {
        transform: translateX(var(--state-selector-step));
      }
      input.radio_input:nth-of-type(3):checked ~ .select_slider .select_indicator {
        transform: translateX(calc(var(--state-selector-step) * 2));
      }
      .select_slider::after {
        content: "";
        position: absolute;
        width: calc(var(--state-selector-size) + var(--state-selector-step));
        height: var(--state-selector-size);
        left: var(--state-selector-step);
        border-radius: calc(var(--state-selector-size) / 2);
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.1), inset 0 0 6px rgba(0, 0, 0, 0.3);
        transition: transform 0.2s ease-in-out;
      }
      input.radio_input:nth-of-type(1):checked ~ .select_slider::after {
        transform: translateX(calc(0px - var(--state-selector-step)));
      }
    `;
    document.head.appendChild(style);
  }

  main();

})();