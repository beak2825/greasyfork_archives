// ==UserScript==
// @name         Bangumi-To Romaji Title
// @name:zh-CN   班固米-获取条目罗马字标题
// @version      0.4.1
// @description  Retrieve the Romaji title of the subject and display it in the infobox
// @author       weiduhuo
// @namespace    https://github.com/weiduhuo/scripts
// @match        *://bgm.tv/
// @match        *://bgm.tv/subject/*
// @match        *://bangumi.tv/
// @match        *://bangumi.tv/subject/*
// @match        *://chii.in/
// @match        *://chii.in/subject/*
// @grant        none
// @license      MIT
// @description:zh-CN  基于MyAnimeList的非官方API Jikan，获取条目的罗马字标题，并呈现于infobox
// @downloadURL https://update.greasyfork.org/scripts/526618/Bangumi-To%20Romaji%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/526618/Bangumi-To%20Romaji%20Title.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const SCRIPT_NAME = '班固米-罗马名获取组件';
  const DB_NAME = "BangumiRomajiTitle";
  const DB_VERSION = 1;

  /** 首页单次查询延迟 */
  const HomePageQueryDelay = 300;

  /** 单次查询返回的结果数量上限 */
  const QueryLimit = 10;
  /** 相关度的最低采用阈值 (含自身) */
  const minRelThr = 2.5;
  /** 相关度的触发再尝阈值 (不含自身) */
  const retryRelThr = 7.5;

  /** 枚举启用状态 */
  const EnableState = {
    /** 全部 */
    ALL_ENABLED: 'allEnabled',
    /** 仅中日 */
    ONLY_CJ: 'onlyChinese&Japanese',
    /** 仅日文 */
    ONLY_JAPANESE: 'onlyJapanese',
  };

  /** 启用状态 */
  let enableState = EnableState.ONLY_CJ;

  /** 所支持的条目类型 */
  const SubjectType = ['anime'];

  /** 地区待选标签 */
  const RegionTags = [
    ['中国', '国产'],
    ['日本', '日本动画'],
    ['欧美', '美国', '法国', '英国', '韩国'] // , '俄罗斯', '苏联', '捷克', '马来西亚'],
  ];
  const Region = {
    null: 0,
    cn: 1,
    jp: 2,
    other: 3, // 用于提前阻断'国产'标签的识别，比如'成龙历险记'
    parse(value) {
      for (const [k, v] of Object.entries(this)) if (value === v) return k;
      return 'null';
    }
  };

  /** 媒体类型映射 BGM to MAL */
  const PlatformMap = {
    'anime': {
      'TV': 'tv', // ['tv','tv_special'] 将通过 subTags 尝试区分
      '剧场版': 'movie',
      'OVA': 'ova',
      'WEB': '', // ['ona','music','special','cm','pv',...] 一对多，但 Jikan API 不支持多参数，因此空缺转而全范围搜索
                 // 'music' 将通过 subTags 尝试区分
      '动态漫画': '',
    },
  };

  /** 匹配假名 */
  const KanaRe = /[\p{sc=Hiragana}\p{sc=Katakana}]/u;
  /** 匹配汉字 */
  const HanRe = /[\p{sc=Han}]/u;
  /** 匹配汉字与假名 */
  const CnJpRe = /[\p{sc=Hiragana}\p{sc=Katakana}\u30FC\u31F0-\u31FF\uFF61-\uFF9F\p{sc=Han}]/u;
  /** 匹配仅包含拉丁字母与符号 */
  // const OnlyLatinRe = /^[\s\u0020-\u00FF\u2000-\u206F\u2150-\u218F\u25A0-\u26FF\u3000-\u301E\uFE30-\uFF65\uFFE0-\uFFEF]+$/;
  // 上述分别匹配了空白字符、基本拉丁字母及补充、常用标点符号、数字形式、几何图形及杂项符号、CJK常见标点符号、 CJK兼容符号

  /** 匹配标题前缀 */
  const PrefTitleRe = /^(((劇場版?)?総集|特別|短)編|(映画|劇場|同人)版?)\s*|.?(Official )?Music Video.?/i;
  /** 匹配标题后缀 */
  const SuffTitleRe = /\s[^\s]*(版)$/;
  // const SuffTitleRe = /\s[^\s]*([\d\u2150-\u218F][^\s]*|版)$/;
  /** 匹配标题短语 */
  const PhrasesRe = /(\d+)|([a-z]{2,}|[\p{sc=Han}]+|[\p{sc=Hiragana}\u30FC]+|[\p{sc=Katakana}\u30FC\u31F0-\u31FF\uFF61-\uFF9F]+)/ug;
  // 注意 \p{scx=Han} 会匹配 '『』'符号
  /** 匹配标题短语分层过滤 */
  const PhrasesFilterRe = /^(映画|アニメ|第|st|nd|rd|th|season|章|編)$/;
  /** 匹配标题内无效符号 (需保留\u3005符号) */
  const PunctRe = /[「」]/g;
  // const PunctRe = /[\u2000-\u206F\u25A0-\u26FF\u3000-\u301E\uFE30-\uFF65\uFFE0-\uFFEF]/g;


  class Database {
    static storeName = 'names';

    constructor(db) {
      this._db = db;
    }
  
    static open() {
      return new Promise((resolve, reject) => {
        let request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = evt => reject(evt.target.errorCode);
        request.onsuccess = evt => resolve(new Database(evt.target.result));
        request.onupgradeneeded = evt => {
          this._upgradeDatabase(evt.target.result, evt.oldVersion);
        };
      });
    }

    static _upgradeDatabase(db) {
      if (!db.objectStoreNames.contains(Database.storeName)) {
        db.createObjectStore(Database.storeName, { keyPath: 'id' });
      }
    }
  
    _getActiveStore(store, mode) {
      let transaction = this._db.transaction([store], mode);
      return transaction.objectStore(store);
    }

    _querySingleStore(options) {
      return new Promise((resolve, reject) => {
        let store = this._getActiveStore(options.store, "readonly");
        let request = options.onrequest(store);
        if (request) {
          request.onerror = evt => reject(evt.target.error);
          request.onsuccess = evt => {
            try {
              const result = options.onsuccess(evt.target.result);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          };
        } else {
          resolve();
        }
      });
    }

    getName(id) {
      return this._querySingleStore({
        store: Database.storeName,
        onrequest(names) {
          return names.get(id);
        },
        onsuccess(entry) {
          return entry?.value ?? null;
        },
      });
    }

    putName(id, value) {
      let names = this._getActiveStore(Database.storeName, "readwrite");
      names.put({id, value});
    }
  
    putNames(items) {
      let names = this._getActiveStore(Database.storeName, "readwrite");
      for (let {id, value} of items) {
        names.put({id, value});
      }
    }
  }

  class Store {
    static KEY_PREF = 'jikan-';
    static get(id) {
      const key = `${this.KEY_PREF}${id}`;
      return sessionStorage.getItem(key);
    }
    static async set(id, data, db) {
      const key = `${this.KEY_PREF}${id}`;
      sessionStorage.setItem(key, JSON.stringify(data));
      const slimData = {
        'romaji': data.title,
        'english': data.title_english,
        'malId': data.mal_id,
      }
      db ??= await Database.open();
      db.putName(+id, slimData);
      return slimData;
    }
  }

  /** 条目地区 */
  let region;
  /** 文档对象 (真实/虚拟) */
  let doc = document;

  function main() {
    const path = location.pathname;
    if (path === '/') {
      handerHomePage();
    } else if (/^\/subject\/\d+(\/add_related\/person)?$/.test(path)) {
      handlerSubjectPage();
    }
  }

  async function handerHomePage() {
    const style = document.createElement('style');
    style.innerHTML = `
      #prgManagerHeader #prgManagerMode #switchRomajiTitle {
        cursor: pointer;
        font-weight: 700;
        color: #c3c3c3;
      }
      #prgManagerHeader #prgManagerMode #switchRomajiTitle.on {
        color: #F09199;
      }
      #prgManagerHeader #prgManagerMode li a.focus {
        background: transparent;
        border-bottom: 2px solid #F09199;
      }
      @media (max-width: 400px) {
        /* 移动端样式 */
        #prgManagerHeader ul.categoryTab li a {
          padding-left: 10px;
          padding-right: 10px;
        }
      }
    `;
    document.head.appendChild(style);

    const prg = document.querySelector('#prgManagerMode');
    const aSwitch = document.createElement('a');
    aSwitch.id = 'switchRomajiTitle';
    aSwitch.title = '罗马字标题';
    aSwitch.textContent = 'R';
    const liSwitch = document.createElement('li');
    liSwitch.appendChild(aSwitch);
    prg.prepend(liSwitch);

    const db = await Database.open();
    const cloSubs = document.querySelectorAll('#cloumnSubjectInfo div[subject_type="2"] a.textTip[href^="/subject/"]');
    const subQueueObj = {}; // 等待查询队列
    for (const sub of cloSubs) {
      const id = sub.dataset.subjectId;
      const name = await db.getName(+id);
      if (!name) {
        subQueueObj[id] = [sub];
        continue;
      }
      sub.dataset.subjectRomajiTitle = name.romaji;
    }
    const prgSubs = document.querySelectorAll('#prgSubjectList > li[subject_type="2"] > a.title');
    for (let sub of prgSubs) {
      const id = sub.dataset.subjectId;
      const name = await db.getName(+id);
      if (!name) {
        subQueueObj[id].push(sub);
        continue;
      }
      sub.dataset.subjectRomajiTitle = name.romaji;
    }

    const dock = document.querySelector('#dock');
    let onCn = false;
    aSwitch.addEventListener('click', () => {
      aSwitch.classList.toggle('on');
      const onRomaji = aSwitch.classList.contains('on');
      onCn = dock?.textContent.includes('◆');
      for (const sub of cloSubs) {
        toggleName(sub, sub, onRomaji, onCn);
      }
      for (let sub of prgSubs) {
        const span = sub.querySelector("span");
        toggleName(sub, span, onRomaji, onCn);
      }
    });
    if (!Object.keys(subQueueObj).length) return;

    // 进行查询
    const host = location.host;
    const protocol = location.protocol;
    const domParser = new DOMParser();
    for (const [id, [cloSub, prgSub]] of Object.entries(subQueueObj)) {
      const res = await fetch(`${protocol}//${host}/subject/${id}`);
      if (!res.ok) continue; // 失败则跳过
      const html = await res.text();
      doc = domParser.parseFromString(html, 'text/html');
      const data = await handlerSubjectPage(db, id);
      if (!data) continue;
      cloSub.dataset.subjectRomajiTitle = data.romaji;
      prgSub.dataset.subjectRomajiTitle = data.romaji;
      if (aSwitch.classList.contains('on')) {
        toggleName(cloSub, cloSub, true, onCn);
        const span = prgSub.querySelector("span");
        toggleName(prgSub, span, true, onCn);
      }
      await new Promise(resolve => setTimeout(resolve, HomePageQueryDelay));
    }
  }

  function toggleName(sub, title, onRomaji, onCn) {
    if (onRomaji && sub.dataset.subjectRomajiTitle) {
      title.textContent = sub.dataset.subjectRomajiTitle;
    } else if (onCn && sub.dataset.subjectNameCn) {
      title.textContent = sub.dataset.subjectNameCn;
    } else {
      title.textContent = sub.dataset.subjectName;
    }
  }

  async function handlerSubjectPage(db = null, id = null) {
    region = null;
    const subType = getSubjectType();
    if (!SubjectType.includes(subType)) return;

    // 基于条目地区，判断是否启用功能
    const infobox = doc.querySelector('#infobox');
    const rawTitle = getSubjectTitle();
    const isLatinTitle = !CnJpRe.test(rawTitle); // 判断标题是否仅包含拉丁字母
    const subTags = getSubjectTags();
    region = includeTargetTag(subTags, ...RegionTags);
    if (!region) {
      // 通过标题与角色名进行兜底 (公共标签未完全覆盖)
      if (KanaRe.test(rawTitle) || charNameHasKana() || KanaRe.test(getSubjectSummary())) {
        region = Region.jp;
      }
    }
    if (!region || region === Region.other) {
      if (enableState === EnableState.ALL_ENABLED) addTitle(infobox, region, isLatinTitle, rawTitle);
      return;
    } else if (region === Region.cn && enableState === EnableState.ONLY_JAPANESE) {
      return;
    }

    // 添加待定的名称
    const titleLis = addTitle(infobox, region, isLatinTitle);

    // 尝试先通过 sessionStorage 获取已存储的数据
    id ??= getSubjectId()[1];
    let subData = Store.get(id);
    // subData = null;
    if (subData) {
      subData = JSON.parse(subData);
      updateTitle(titleLis, [subData.title, subData.title_english]);
      console.log(`${SCRIPT_NAME}：`, {
        'relScore': subData.relScore,
        'romaji': subData.title,
        'english': subData.title_english,
      });
      if(subData.url) console.log(`${SCRIPT_NAME}：`, subData.url);
      
      return;
    } else if (doc === document) {
      db = await Database.open();
      const name = await db.getName(+id);
      if (name) {
        updateTitle(titleLis, [name.romaji, name.english]);
      }
    }

    // 初步解析网页数据 (用于API查询的数据优先)
    const rawPlatform = getPlatform();
    let platform = rawPlatform in PlatformMap[subType] ? PlatformMap[subType][rawPlatform] : '';
    if (includeTargetTag(subTags, ['MV'])) {
      platform = 'music';
    }
    if (platform === 'tv' && includeTargetTag(subTags, ['OVA', 'SP', 'TVSP'], ['MV']) === 1) {
      platform = 'tv_special';
    }
    const tips = infobox.querySelectorAll('span.tip');
    const startDate = getStartDate(infobox, tips, rawPlatform);
    let episodes, notFirstPart; // 延后解析

    // 尝试获取名称
    let subs, titles, url, mainTitle, phraseSet;
    mainTitle = rawTitle.replace(PrefTitleRe, ''); // 修复 Jikan API 首字符匹配权重过大的问题
    mainTitle = mainTitle.replace(PunctRe, ' '); // 修复 Jikan API 对诸如「」等符号匹配权重过大的问题
    const queryStartDate = startDate ? `${startDate.year - 1}-01-01` : ''; // 保守起见，仅精确到年份，并回退一年
    await handlerQuery(platform, queryStartDate);
    const data_1 = handleData();
    if (subData.relScore >= minRelThr ) {
      updateTitle(titleLis, titles);
    }
    if (subData.relScore >= retryRelThr) {
      return Store.set(id, data_1, db);
    }

    // 相关度较低，扩大搜索范围
    console.log(`${SCRIPT_NAME}：相关度较低，扩大搜索范围，再次尝试`);
    const preRelScore = subData.relScore;
    mainTitle = mainTitle.replace(SuffTitleRe, ''); // 删除如 'シーズン2' 的后缀，只保留主标题
    await handlerQuery();
    // 由于搜索的平台范围扩大，降低相关度得分
    if (platform && subData.relScore) subData.relScore -= 0.5;
    const data_2 = handleData();
    if (subData.relScore >= minRelThr && subData.relScore > preRelScore) {
      updateTitle(titleLis, titles);
      return Store.set(id, data_2, db);
    } else if (preRelScore >= minRelThr && subData.relScore <= preRelScore) {
      return Store.set(id, data_1, db);
    } else if (subData.relScore < minRelThr && preRelScore < minRelThr) {
      updateTitle(titleLis, [null, null]);
      return;
    }

    function handleData() {
      console.log(`${SCRIPT_NAME}：`, {
        'relScore': subData.relScore / 10,
        'romaji': titles[0],
        'english': titles[1],
      });
      if (url) console.log(`${SCRIPT_NAME}：`, url);
      return subData;
    }

    /** 执行一次查询 */
    async function handlerQuery(_platform = '', _startDate ='') {
      const promise = querySubject(mainTitle, subType, _platform, _startDate);
      // 同步解析网页数据 (减少忙等API)
      episodes ??= getEpisodes(infobox, tips);
      // 判断首集序号是否为开头，防止 BGM 与 MyAnimeList 条目合并不同
      notFirstPart ??= !isFirstPart();
      phraseSet = getPhraseSet(mainTitle, region);
      if (!titles) {
        console.log(`${SCRIPT_NAME}：`, {
          'bgmId': id,
          'region': Region.parse(region),
          'platform': platform,
          'episodes': episodes,
          'startDate': startDate,
          'phraseSet': phraseSet,
        });
      }
      subs = await promise;
      if (Array.isArray(subs)) {
        subData = searchSubject(subs, phraseSet, isLatinTitle, startDate, episodes);
      }
      if (subData) {
        titles = [subData.title, subData.title_english];
        url = subData.url;
      } else {
        [titles, url] = [[null, null], null];
        subData = {'relScore': 0};
      }
      // 对于非首Part的条目的开播时间参考的相关度降低
      if (notFirstPart) subData.relScore *= 0.75;
      titles = titles.map((title) => title?.replace(/\s\((TV|OVA)\)/, '')); // 删除后缀
    }
  }

  /**
   * 通过条目原标题获取相关条目数据集
   * @param {string} title 原标题
   * @param {string} subType 条目类型
   * @param {string} platform 媒体类型
   * @param {string} startDate 起始日期 'Y-m-d'
   * @param {number} limit 指定返回的结果数量
   * @returns {Promise<string | Array<Object>>} 条目数据集
   */
  async function querySubject(title, subType, platform, startDate, limit = QueryLimit) {
    const url = new URL(`https://api.jikan.moe/v4/${subType}`);
    url.searchParams.set('limit', limit);
    url.searchParams.set('q', title);
    if (platform) url.searchParams.set('type', platform);
    if (startDate) url.searchParams.set('start_date', startDate);
    try {
      // console.time(`Jikan API`);
      const response = await fetch(url);
      // console.timeEnd(`Jikan API`);
      const data = await response.json();
      const subs = data.data;
      if (!subs || subs.length === 0) return null;
      else return subs;
    } catch (error) {
      console.error('Jikan API请求失败:', error);
      return null;
    }
  }

  /**
   * @param {Array<Object>} subs
   * @param {Set<string>} phraseSet
   * @param {boolean} isLatinTitle
   * @param {{year: number, month: number, day: number} | null} startDate 开播时间
   * @param {number | null} episodes 集数
   * @returns {{relScore: number, title: string, title_english: string, url: string} | null}
   *   - `relScore`相关度 - 10分值，6分为原标题短语的匹配度，4分为开播时间与集数的匹配度
   */
  function searchSubject(subs, phraseSet, isLatinTitle, startDate, episodes) {
    const tmpSubs = [];
    console.groupCollapsed(`${SCRIPT_NAME}：详情`);
    subs.forEach((sub, index) => {
      let similarity;
      let phraseSet2;
      // 计算 jaccard 相似度
      if (!isLatinTitle) {
        [similarity, phraseSet2] = jaccardSimilarity(phraseSet, sub.title_japanese);
      } else {
        // 当搜索词全为拉丁字母时，同时考虑罗马音标题与英文标题
        [similarity, phraseSet2] = [
          jaccardSimilarity(phraseSet, sub.title),
          jaccardSimilarity(phraseSet, sub.title_english)
        ].sort((a, b) =>  b[0] - a[0])[0]; // maxSimilarity
      }
      sub.relScore = similarity * 6;
      // 旧方法难以区分 '日常 Eテレ版' 2012-1 在 ['日常' 2011-4, '男子高校生の日常' 2012-1 ]
      /* const title = (isLatinTitle ? sub.title : sub.title_japanese).toLowerCase();
      const simScore = phraseSet.keys().reduce((acc, val) => acc + title.includes(val), 0);
      sub.relScore = simScore * 6 / phraseSet.size; */
      if (sub.relScore) tmpSubs.push(sub);
      sub.index = index;
      console.log({
        'index': index,
        'simScore': sub.relScore,
        'type': sub.type,
        'startDate': sub.aired.from ? sub.aired.from.split('T')[0] : null,
        'episodes': sub.episodes,
        'japanese': sub.title_japanese,
        'romanji': sub.title,
        'english': sub.title_english,
        'phraseSet': phraseSet2,
        'url': sub.url,
      });
    });
    if (tmpSubs.length) {
      subs = tmpSubs;
      subs.sort((a, b) => b.relScore - a.relScore);
    } else {
      console.groupEnd();
      return null;
    }
    if (!startDate) {
      return getResult(1, subs);
    }
    const sameYearSubs = subs.filter(sub => sub.aired.prop.from.year === startDate.year);
    if (sameYearSubs.length === 0) {
      return getResult(0, subs);
    }
    const sameMonthSubs = sameYearSubs.filter(sub => startDate.month && sub.aired.prop.from.month === startDate.month);
    if (sameMonthSubs.length === 0) {
      return getResult(2, sameYearSubs);
    }
    if (sameMonthSubs.length === 1) {
      return getResult(4, sameMonthSubs);
    }
    if (!episodes) {
      return getResult(3, sameMonthSubs);
    }
    // 开播时间相同的有多个，寻找集数差异最小的
    let minDiff = Infinity, index = 0;
    sameMonthSubs.forEach((sub, _index) => {
      const diff = Math.abs(episodes - sub.episodes);
      if (diff < minDiff) {
        minDiff = diff;
        index = _index;
      }
    });
    sameMonthSubs[index].relScore += 2;
    return getResult(2, sameMonthSubs);

    /** 计算最终相似度，并获取结果 */
    function getResult(offset, _subs) {
      _subs.forEach(sub => { sub.relScore += offset });
      subs.sort((a, b) => b.relScore - a.relScore);
      // console.groupEnd();
      console.log('sortedByRelScore:', subs.map(sub => [sub.index, sub.relScore]));
      const data = subs[0];
      console.log('result:', data.index);
      console.groupEnd();
      // console.log(sub);
      // data.title_english ??= 'NULL';
      return data;
    }
  }

  /** @returns {[number, Set<string>]} */
  function jaccardSimilarity(set1, str2) {
    const set2 = getPhraseSet(str2?.replace(PrefTitleRe, ''));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return [intersection.size / union.size, set2];
  }

  function getPhraseSet(title) {
    if (!title) return new Set();
    let phrases = title.toLowerCase().match(PhrasesRe);
    if (region === Region.cn) {
      // 将国产类别标题中的汉字，再划分
      phrases = phrases.map(p => HanRe.test(p) ? [...p] : p).flat(Infinity);
    }
    if (!phrases) return new Set();
    return new Set(phrases
      .filter((s) => !PhrasesFilterRe.test(s))
    );
  }

  function getSubjectType() {
    return doc.querySelector('#navMenuNeue .focus').getAttribute('href').split('/')[1];
  }

  function getSubjectTitle() {
    return doc.querySelector('#headerSubject > h1 > a').textContent.trim();
  }

  function getSubjectTags() {
    return doc.querySelectorAll('.subject_tag_section > .inner span');
  }

  function getSubjectSummary() {
    return doc.querySelector('#subject_summary').textContent;
  }

  function getSubjectId() {
    const urlPattern = /^\/(.+)\/(\d+)/;
    const match = window.location.pathname.match(urlPattern);
    if (!match) return [null, null];
    const [, patternType, subId] = match;
    return [patternType, subId];
  }

  /**
   * @param {NodeListOf<Element>} subTags
   * @param {...Array<string>} targetTypeTags 目标种类的标签
   * @returns {number} 种类编号由1开始，0表不存在
   */
  function includeTargetTag(subTags, ...targetTypeTags) {
    for (const tag of subTags) {
      const _tag = tag.textContent.trim();
      for (const [type, targetTags] of targetTypeTags.entries()) {
        if (targetTags.includes(_tag)) return type + 1;
      }
    }
    return 0;
  }

  function charNameHasKana() {
    const chars = doc.querySelectorAll('#browserItemList strong');
    for (const char of chars) {
      if (KanaRe.test(char.innerText)) return true;
    }
    return false;
  }

  function getPlatform() {
    const smallTag = doc.querySelector('#headerSubject > h1 > small.grey');
    if (smallTag) return smallTag.innerText.trim();
    else return '';
  }

  function isFirstPart() {
    const firstEp = doc.querySelector('#subject_detail > .subject_prg > .prg_list > li:first-child');
    if (firstEp) {
      return ['00', '01'].includes(firstEp.innerText.trim());
    } else return true;
  }

  /**
   * @param {HTMLElement} infobox
   * @param {NodeListOf<HTMLElement>} tips
   * @returns {number | null}
   */
  function getEpisodes(infobox, tips) {
    const limit = 10;
    let ep = null;
    for (const [i, tip] of tips.entries()) {
      if (i > limit) return null;
      if (tip.innerText.trim() === '话数:') {
        ep = tip;
        break;
      }
    }
    if (!ep) return null;
    while (ep.parentElement !== infobox) {
      ep = ep.parentElement;
    }
    const match = ep.textContent.match(/(\d+)/);
    if (match) return +match[1];
    else return null;
  }

  /**
   * @param {HTMLElement} infobox
   * @param {NodeListOf<HTMLElement>} tips
   * @param {string} rawPlatform
   * @returns {{year: number, month: number, day: number} | null}
   */
  function getStartDate(infobox, tips, rawPlatform) {
    const reParts = [
      // 放送开始
      '(开始|(?:放送|播出)(?:开始|日期))',
      // 上映年度 (剧场版)
      '([上公]映(?!许可))',
      // 发售日 (OVA)
      '(发售)',
    ];
    const priorityEnd = 4;
    const regexMapping = (...ps) => RegExp(ps.map(i => `${reParts[i]}`).join('|'));
    const regexMap = {
      'TV': regexMapping(0, 1, 2),
      '剧场版': regexMapping(1, 0, 2),
      'OVA': regexMapping(2, 0, 1),
    };
    // 按不同类别的优先级匹配
    let regex = regexMap[rawPlatform in regexMap ? rawPlatform : 'TV'];
    let date = null;
    let preIndex = 10, index;
    for (const tip of tips) {
      const match = tip.innerText.match(regex);
      if (match) {
        for (const [i, m] of match.slice(1, priorityEnd).entries()) if (m) {
          index = i + 1; break;
        }
        if (index < preIndex) {
          date = tip; // 仅优先级更高的才可覆盖
          preIndex = index;
        }
        if (index === 1) break; // 最高优先级会截断任务
      }
    }
    if (!date) return null;
    while (date.parentElement !== infobox) {
      date = date.parentElement;
    }
    const dateText = date.textContent;
    let match;
    const dataReStr = '(\\d{4})[-/年]?(\\d{1,2})?[-/月]?(\\d{1,2})?[-/日]?';
    if (region === Region.jp) {
      // 优先匹配日本时间
      match = dateText.match(RegExp(`日本[^)）]*${dataReStr}`));
      match ??= dateText.match(RegExp(`${dataReStr}[\\s(（]+日本`));
    }
    match ??= dateText.match(RegExp(dataReStr));
    if (match) {
      return {
        year: +match[1],
        month: +match[2],
        day: +match[3]
      };
    } else return null;
  }

  /**
   * @param {HTMLElement} infobox
   * @param {number} region
   * @param {boolean} isLatinTitle 
   * @param {string} [title='···']
   * @returns {[HTMLElement]}
   */
  function addTitle(infobox, region, isLatinTitle, title = '···') {
    if (doc !== document) return;
    const romajiLi = doc.createElement('li');
    let romajiTip, englishLi = null;
    if (!region || region === Region.other) {
      romajiTip = '索引名';
    } else {
      if (isLatinTitle) {
        romajiTip = '索引名';
      } else if (region === Region.jp) {
        romajiTip = '罗马名';
      } else if (region === Region.cn) {
        romajiTip = '拼音名';
      }
      englishLi = doc.createElement('li');
      englishLi.className = 'folded';
      englishLi.innerHTML = `<span class="tip" style="user-select: none">英文名: </span>${title}`;
    }
    romajiLi.innerHTML = `<span class="tip" style="user-select: none">${romajiTip}: </span>${title}`;

    const firstLi = infobox.children[0];
    const tip = firstLi.querySelector('span.tip');
    const ref = tip && tip.innerText.trim() === '中文名:' ? firstLi.nextSibling : firstLi;
    infobox.insertBefore(romajiLi, ref);
    if (englishLi) {
      infobox.insertBefore(englishLi, ref);
      return [romajiLi, englishLi];
    } else {
      return [romajiLi];
    }
  }

  /**
   * @param {[HTMLElement]} lis
   * @param {[string]} titles
   */
  function updateTitle(lis, titles) {
    if (doc !== document) return;
    lis.forEach((li, index) => {
      li.childNodes[1].textContent = titles[index] ?? 'NULL';
    })
  }

  main();

})();