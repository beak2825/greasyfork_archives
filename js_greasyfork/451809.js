// ==UserScript==
// @name        评分对比助手
// @name:en     score comparation helper
// @namespace   https://github.com/22earth
// @description 在Bangumi、VNDB等上面显示其它网站的评分
// @description:en show subject score information from other site
// @author      22earth
// @license     MIT
// @homepage    https://github.com/zhifengle/gm_scripts
// @include     /^https?:\/\/(bangumi|bgm|chii)\.(tv|in)\/subject\/.*$/
// @include     https://movie.douban.com/subject/*
// @include     https://myanimelist.net/anime/*
// @include     https://anidb.net/anime/*
// @include     https://anidb.net/a*
// @include     https://2dfan.com/subjects/*
// @include     https://ddfan.org/subjects/*
// @include     https://vndb.org/v*
// @include     https://erogamescape.org/~ap2/ero/toukei_kaiseki/*.php?game=*
// @include     https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/*.php?game=*
// @include     https://moepedia.net/game/*
// @include     http://www.getchu.com/soft.phtml?id=*
// @version     0.1.31
// @note        0.1.29 能够设置后台搜索游戏的评分
// @run-at      document-end
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_addValueChangeListener
// @require     https://cdnjs.cloudflare.com/ajax/libs/fuse.js/6.4.0/fuse.min.js
// @downloadURL https://update.greasyfork.org/scripts/451809/%E8%AF%84%E5%88%86%E5%AF%B9%E6%AF%94%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/451809/%E8%AF%84%E5%88%86%E5%AF%B9%E6%AF%94%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * 为页面添加样式
   * @param style
   */
  /**
   * 获取节点文本
   * @param elem
   */
  function getText(elem) {
      if (!elem)
          return '';
      if (elem.tagName.toLowerCase() === 'meta') {
          return elem.content;
      }
      if (elem.tagName.toLowerCase() === 'input') {
          return elem.value;
      }
      return elem.textContent || elem.innerText || '';
  }
  /**
   * dollar 选择单个
   * @param {string} selector
   */
  function $q(selector) {
      if (window._parsedEl) {
          return window._parsedEl.querySelector(selector);
      }
      return document.querySelector(selector);
  }
  /**
   * dollar 选择所有元素
   * @param {string} selector
   */
  function $qa(selector) {
      if (window._parsedEl) {
          return window._parsedEl.querySelectorAll(selector);
      }
      return document.querySelectorAll(selector);
  }
  /**
   * 查找包含文本的标签
   * @param {string} selector
   * @param {string} text
   */
  function contains(selector, text, $parent) {
      let elements;
      if ($parent) {
          elements = $parent.querySelectorAll(selector);
      }
      else {
          elements = $qa(selector);
      }
      let t;
      if (typeof text === 'string') {
          t = text;
      }
      else {
          t = text.join('|');
      }
      return [].filter.call(elements, function (element) {
          return new RegExp(t, 'i').test(getText(element));
      });
  }
  function findElementByKeyWord(selector, $parent) {
      let res = null;
      if ($parent) {
          $parent = $parent.querySelector(selector.selector);
      }
      else {
          $parent = $q(selector.selector);
      }
      if (!$parent)
          return res;
      const targets = contains(selector.subSelector, selector.keyWord, $parent);
      if (targets && targets.length) {
          let $t = targets[targets.length - 1];
          // 相邻节点
          if (selector.sibling) {
              $t = targets[targets.length - 1].nextElementSibling;
          }
          return $t;
      }
      return res;
  }
  function findElement(selector, $parent) {
      let r = null;
      if (selector) {
          if (selector instanceof Array) {
              let i = 0;
              let targetSelector = selector[i];
              while (targetSelector && !(r = findElement(targetSelector, $parent))) {
                  targetSelector = selector[++i];
              }
          }
          else {
              if (!selector.subSelector) {
                  r = $parent
                      ? $parent.querySelector(selector.selector)
                      : $q(selector.selector);
              }
              else if (selector.isIframe) {
                  // iframe 暂时不支持 parent
                  const $iframeDoc = $q(selector.selector)?.contentDocument;
                  r = $iframeDoc?.querySelector(selector.subSelector);
              }
              else {
                  r = findElementByKeyWord(selector, $parent);
              }
              if (selector.closest) {
                  r = r.closest(selector.closest);
              }
              // recursive
              if (r && selector.nextSelector) {
                  const nextSelector = selector.nextSelector;
                  r = findElement(nextSelector, r);
              }
          }
      }
      return r;
  }
  /**
   * @param {String} HTML 字符串
   * @return {Element}
   */
  function htmlToElement(html) {
      var template = document.createElement('template');
      html = html.trim();
      template.innerHTML = html;
      // template.content.childNodes;
      return template.content.firstChild;
  }
  /**
   * 载入 iframe
   * @param $iframe iframe DOM
   * @param src iframe URL
   * @param TIMEOUT time out
   */
  function loadIframe($iframe, src, TIMEOUT = 5000) {
      return new Promise((resolve, reject) => {
          $iframe.src = src;
          let timer = setTimeout(() => {
              timer = null;
              $iframe.onload = undefined;
              reject('iframe timeout');
          }, TIMEOUT);
          $iframe.onload = () => {
              clearTimeout(timer);
              $iframe.onload = null;
              resolve(null);
          };
      });
  }

  function sleep(num) {
      return new Promise((resolve) => {
          setTimeout(resolve, num);
      });
  }
  function randomSleep(max = 400, min = 200) {
      return sleep(randomNum(max, min));
  }
  function randomNum(max, min) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // support GM_XMLHttpRequest
  let retryCounter = 0;
  let USER_SITE_CONFIG = {};
  function addSiteOption(host, config) {
      USER_SITE_CONFIG[host] = config;
  }
  function getSiteConfg(url, host) {
      let hostname = host;
      if (!host) {
          hostname = new URL(url)?.hostname;
      }
      const config = USER_SITE_CONFIG[hostname] || {};
      return config;
  }
  function mergeOpts(opts, config) {
      return {
          ...opts,
          ...config,
          headers: {
              ...opts?.headers,
              ...config?.headers,
          },
      };
  }
  function fetchInfo(url, type, opts = {}, TIMEOUT = 10 * 1000) {
      const method = opts?.method?.toUpperCase() || 'GET';
      opts = mergeOpts(opts, getSiteConfg(url));
      // @ts-ignore
      {
          const gmXhrOpts = { ...opts };
          if (method === 'POST' && gmXhrOpts.body) {
              gmXhrOpts.data = gmXhrOpts.body;
          }
          if (opts.decode) {
              type = 'arraybuffer';
          }
          return new Promise((resolve, reject) => {
              // @ts-ignore
              GM_xmlhttpRequest({
                  method,
                  timeout: TIMEOUT,
                  url,
                  responseType: type,
                  onload: function (res) {
                      if (res.status === 404) {
                          retryCounter = 0;
                          reject(404);
                      }
                      else if (res.status === 302 && retryCounter < 5) {
                          retryCounter++;
                          resolve(fetchInfo(res.finalUrl, type, opts, TIMEOUT));
                      }
                      if (opts.decode && type === 'arraybuffer') {
                          retryCounter = 0;
                          let decoder = new TextDecoder(opts.decode);
                          resolve(decoder.decode(res.response));
                      }
                      else {
                          retryCounter = 0;
                          resolve(res.response);
                      }
                  },
                  onerror: (e) => {
                      retryCounter = 0;
                      reject(e);
                  },
                  ...gmXhrOpts,
              });
          });
      }
  }
  function fetchText(url, opts = {}, TIMEOUT = 10 * 1000) {
      return fetchInfo(url, 'text', opts, TIMEOUT);
  }
  function fetchJson(url, opts = {}) {
      return fetchInfo(url, 'json', opts);
  }

  function formatDate(time, fmt = 'yyyy-MM-dd') {
      const date = new Date(time);
      var o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds(),
          'q+': Math.floor((date.getMonth() + 3) / 3),
          S: date.getMilliseconds(), //毫秒
      };
      if (/(y+)/i.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
          if (new RegExp('(' + k + ')', 'i').test(fmt)) {
              fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
          }
      }
      return fmt;
  }
  function dealDate(dataStr) {
      // 2019年12月19
      let l = [];
      if (/\d{4}年\d{1,2}月(\d{1,2}日?)?/.test(dataStr)) {
          l = dataStr
              .replace('日', '')
              .split(/年|月/)
              .filter((i) => i);
      }
      else if (/\d{4}\/\d{1,2}(\/\d{1,2})?/.test(dataStr)) {
          l = dataStr.split('/');
      }
      else if (/\d{4}-\d{1,2}(-\d{1,2})?/.test(dataStr)) {
          return dataStr;
      }
      else {
          return dataStr;
      }
      return l
          .map((i) => {
          if (i.length === 1) {
              return `0${i}`;
          }
          return i;
      })
          .join('-');
  }
  function isEqualDate(d1, d2, type = 'd') {
      const resultDate = new Date(d1);
      const originDate = new Date(d2);
      if (type === 'y') {
          return resultDate.getFullYear() === originDate.getFullYear();
      }
      if (type === 'm') {
          return resultDate.getFullYear() === originDate.getFullYear() && resultDate.getMonth() === originDate.getMonth();
      }
      if (resultDate.getFullYear() === originDate.getFullYear() &&
          resultDate.getMonth() === originDate.getMonth() &&
          resultDate.getDate() === originDate.getDate()) {
          return true;
      }
      return false;
  }
  function isEqualMonth(d1, d2) {
      const resultDate = new Date(d1);
      const originDate = new Date(d2);
      if (resultDate.getFullYear() === originDate.getFullYear() && resultDate.getMonth() === originDate.getMonth()) {
          return true;
      }
      return false;
  }
  function normalizeQuery(query) {
      let newQuery = query
          .replace(/^(.*?～)(.*)(～[^～]*)$/, function (_, p1, p2, p3) {
          return p1.replace(/～/g, ' ') + p2 + p3.replace(/～/g, ' ');
      })
          .replace(/＝|=/g, ' ')
          .replace(/　/g, ' ')
          .replace(/０/g, '0')
          .replace(/１/g, '1')
          .replace(/２/g, '2')
          .replace(/３/g, '3')
          .replace(/４/g, '4')
          .replace(/５/g, '5')
          .replace(/６/g, '6')
          .replace(/７/g, '7')
          .replace(/８/g, '8')
          .replace(/９/g, '9')
          .replace(/Ⅰ/g, 'I')
          .replace(/Ⅱ/g, 'II')
          .replace(/Ⅲ/g, 'III')
          .replace(/Ⅳ/g, 'IV')
          .replace(/Ⅴ/g, 'V')
          .replace(/Ⅵ/g, 'VI')
          .replace(/Ⅶ/g, 'VII')
          .replace(/Ⅷ/g, 'VIII')
          .replace(/Ⅸ/g, 'IX')
          .replace(/Ⅹ/g, 'X')
          .replace(/[－―～〜━\[\]『』~'…！？。♥☆\/♡★‥○, 【】◆×▼’&＇"＊?]/g, ' ')
          .replace(/[．・]/g, ' ')
          //.replace(/ー/g, " ")
          .replace(/\.\.\./g, ' ')
          .replace(/～っ.*/, '')
          .replace(/\(.*?\)/g, '')
          .replace(/\（.*?\）/g, ' ')
          .replace(/＜.+?＞/, '')
          .replace(/<.+?>/, '')
          .replace(/\s-[^-]+?-$/, '')
          .trim();
      newQuery = newQuery.replace(/\s{2,}/g, ' ');
      // game: 14 -one & four or the other meaning-
      if (/^\d+$/.test(newQuery)) {
          return query;
      }
      return newQuery;
  }
  function getShortenedQuery(query) {
      let newQuery = query;
      let parts = newQuery.split(' ');
      let englishWordCount = 0;
      let nonEnglishDetected = false;
      let japaneseWordCount = 0;
      let isJapaneseWord = false;
      for (let i = 0; i < parts.length; i++) {
          let isEnglishWord = /^[a-zA-Z]+$/.test(parts[i]);
          if (isEnglishWord || /^\d+$/.test(parts[i])) {
              englishWordCount++;
          }
          else {
              isJapaneseWord = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ーa-zA-Z0-9ａ-ｚＡ-Ｚ０-９々〆〤]/u.test(parts[i]);
              if (isJapaneseWord) {
                  nonEnglishDetected = true;
                  japaneseWordCount++;
              }
          }
          if (nonEnglishDetected && englishWordCount < 2 && parts[i].length > 2) {
              parts = [parts[i]];
              break;
          }
          if (isEnglishWord && englishWordCount >= 2 && parts.slice(0, i + 1).join('').length > 2) {
              parts = parts.slice(0, i + 1);
              break;
          }
          if (isJapaneseWord && japaneseWordCount == 2) {
              for (let j = 0; j <= i; j++) {
                  if (parts[j].length <= 1 && j < i) {
                      continue;
                  }
                  else {
                      parts = parts.slice(0, j + 1);
                      break;
                  }
              }
              break;
          }
      }
      newQuery = parts.join(' ');
      // xxx1  bb2, cc3 ----> xx1, bb, cc
      if (/[^\d]+\d+$/.test(newQuery)) {
          return newQuery.replace(/\d+$/, '').trim();
      }
      return newQuery;
  }

  // TinySegmenter 0.2 -- Super compact Japanese tokenizer in Javascript
  // (c) 2008 Taku Kudo <taku@chasen.org>
  // TinySegmenter is freely distributable under the terms of a new BSD licence.
  // For details, see http://chasen.org/~taku/software/TinySegmenter/LICENCE.txt

  function TinySegmenter() {
      var patterns = {
          "[一二三四五六七八九十百千万億兆]":"M",
          "[一-龠々〆ヵヶ]":"H",
          "[ぁ-ん]":"I",
          "[ァ-ヴーｱ-ﾝﾞｰ]":"K",
          "[a-zA-Zａ-ｚＡ-Ｚ]":"A",
          "[0-9０-９]":"N"
      };
      this.chartype_ = [];
      for (var i in patterns) {
          var regexp = new RegExp;
          regexp.compile(i);
          this.chartype_.push([regexp, patterns[i]]);
      }

      this.BIAS__ = -332;
      this.BC1__ = {"HH":6,"II":2461,"KH":406,"OH":-1378};
      this.BC2__ = {"AA":-3267,"AI":2744,"AN":-878,"HH":-4070,"HM":-1711,"HN":4012,"HO":3761,"IA":1327,"IH":-1184,"II":-1332,"IK":1721,"IO":5492,"KI":3831,"KK":-8741,"MH":-3132,"MK":3334,"OO":-2920};
      this.BC3__ = {"HH":996,"HI":626,"HK":-721,"HN":-1307,"HO":-836,"IH":-301,"KK":2762,"MK":1079,"MM":4034,"OA":-1652,"OH":266};
      this.BP1__ = {"BB":295,"OB":304,"OO":-125,"UB":352};
      this.BP2__ = {"BO":60,"OO":-1762};
      this.BQ1__ = {"BHH":1150,"BHM":1521,"BII":-1158,"BIM":886,"BMH":1208,"BNH":449,"BOH":-91,"BOO":-2597,"OHI":451,"OIH":-296,"OKA":1851,"OKH":-1020,"OKK":904,"OOO":2965};
      this.BQ2__ = {"BHH":118,"BHI":-1159,"BHM":466,"BIH":-919,"BKK":-1720,"BKO":864,"OHH":-1139,"OHM":-181,"OIH":153,"UHI":-1146};
      this.BQ3__ = {"BHH":-792,"BHI":2664,"BII":-299,"BKI":419,"BMH":937,"BMM":8335,"BNN":998,"BOH":775,"OHH":2174,"OHM":439,"OII":280,"OKH":1798,"OKI":-793,"OKO":-2242,"OMH":-2402,"OOO":11699};
      this.BQ4__ = {"BHH":-3895,"BIH":3761,"BII":-4654,"BIK":1348,"BKK":-1806,"BMI":-3385,"BOO":-12396,"OAH":926,"OHH":266,"OHK":-2036,"ONN":-973};
      this.BW1__ = {",と":660,",同":727,"B1あ":1404,"B1同":542,"、と":660,"、同":727,"」と":1682,"あっ":1505,"いう":1743,"いっ":-2055,"いる":672,"うし":-4817,"うん":665,"から":3472,"がら":600,"こう":-790,"こと":2083,"こん":-1262,"さら":-4143,"さん":4573,"した":2641,"して":1104,"すで":-3399,"そこ":1977,"それ":-871,"たち":1122,"ため":601,"った":3463,"つい":-802,"てい":805,"てき":1249,"でき":1127,"です":3445,"では":844,"とい":-4915,"とみ":1922,"どこ":3887,"ない":5713,"なっ":3015,"など":7379,"なん":-1113,"にし":2468,"には":1498,"にも":1671,"に対":-912,"の一":-501,"の中":741,"ませ":2448,"まで":1711,"まま":2600,"まる":-2155,"やむ":-1947,"よっ":-2565,"れた":2369,"れで":-913,"をし":1860,"を見":731,"亡く":-1886,"京都":2558,"取り":-2784,"大き":-2604,"大阪":1497,"平方":-2314,"引き":-1336,"日本":-195,"本当":-2423,"毎日":-2113,"目指":-724,"Ｂ１あ":1404,"Ｂ１同":542,"｣と":1682};
      this.BW2__ = {"..":-11822,"11":-669,"――":-5730,"−−":-13175,"いう":-1609,"うか":2490,"かし":-1350,"かも":-602,"から":-7194,"かれ":4612,"がい":853,"がら":-3198,"きた":1941,"くな":-1597,"こと":-8392,"この":-4193,"させ":4533,"され":13168,"さん":-3977,"しい":-1819,"しか":-545,"した":5078,"して":972,"しな":939,"その":-3744,"たい":-1253,"たた":-662,"ただ":-3857,"たち":-786,"たと":1224,"たは":-939,"った":4589,"って":1647,"っと":-2094,"てい":6144,"てき":3640,"てく":2551,"ては":-3110,"ても":-3065,"でい":2666,"でき":-1528,"でし":-3828,"です":-4761,"でも":-4203,"とい":1890,"とこ":-1746,"とと":-2279,"との":720,"とみ":5168,"とも":-3941,"ない":-2488,"なが":-1313,"など":-6509,"なの":2614,"なん":3099,"にお":-1615,"にし":2748,"にな":2454,"によ":-7236,"に対":-14943,"に従":-4688,"に関":-11388,"のか":2093,"ので":-7059,"のに":-6041,"のの":-6125,"はい":1073,"はが":-1033,"はず":-2532,"ばれ":1813,"まし":-1316,"まで":-6621,"まれ":5409,"めて":-3153,"もい":2230,"もの":-10713,"らか":-944,"らし":-1611,"らに":-1897,"りし":651,"りま":1620,"れた":4270,"れて":849,"れば":4114,"ろう":6067,"われ":7901,"を通":-11877,"んだ":728,"んな":-4115,"一人":602,"一方":-1375,"一日":970,"一部":-1051,"上が":-4479,"会社":-1116,"出て":2163,"分の":-7758,"同党":970,"同日":-913,"大阪":-2471,"委員":-1250,"少な":-1050,"年度":-8669,"年間":-1626,"府県":-2363,"手権":-1982,"新聞":-4066,"日新":-722,"日本":-7068,"日米":3372,"曜日":-601,"朝鮮":-2355,"本人":-2697,"東京":-1543,"然と":-1384,"社会":-1276,"立て":-990,"第に":-1612,"米国":-4268,"１１":-669};
      this.BW3__ = {"あた":-2194,"あり":719,"ある":3846,"い.":-1185,"い。":-1185,"いい":5308,"いえ":2079,"いく":3029,"いた":2056,"いっ":1883,"いる":5600,"いわ":1527,"うち":1117,"うと":4798,"えと":1454,"か.":2857,"か。":2857,"かけ":-743,"かっ":-4098,"かに":-669,"から":6520,"かり":-2670,"が,":1816,"が、":1816,"がき":-4855,"がけ":-1127,"がっ":-913,"がら":-4977,"がり":-2064,"きた":1645,"けど":1374,"こと":7397,"この":1542,"ころ":-2757,"さい":-714,"さを":976,"し,":1557,"し、":1557,"しい":-3714,"した":3562,"して":1449,"しな":2608,"しま":1200,"す.":-1310,"す。":-1310,"する":6521,"ず,":3426,"ず、":3426,"ずに":841,"そう":428,"た.":8875,"た。":8875,"たい":-594,"たの":812,"たり":-1183,"たる":-853,"だ.":4098,"だ。":4098,"だっ":1004,"った":-4748,"って":300,"てい":6240,"てお":855,"ても":302,"です":1437,"でに":-1482,"では":2295,"とう":-1387,"とし":2266,"との":541,"とも":-3543,"どう":4664,"ない":1796,"なく":-903,"など":2135,"に,":-1021,"に、":-1021,"にし":1771,"にな":1906,"には":2644,"の,":-724,"の、":-724,"の子":-1000,"は,":1337,"は、":1337,"べき":2181,"まし":1113,"ます":6943,"まっ":-1549,"まで":6154,"まれ":-793,"らし":1479,"られ":6820,"るる":3818,"れ,":854,"れ、":854,"れた":1850,"れて":1375,"れば":-3246,"れる":1091,"われ":-605,"んだ":606,"んで":798,"カ月":990,"会議":860,"入り":1232,"大会":2217,"始め":1681,"市":965,"新聞":-5055,"日,":974,"日、":974,"社会":2024,"ｶ月":990};
      this.TC1__ = {"AAA":1093,"HHH":1029,"HHM":580,"HII":998,"HOH":-390,"HOM":-331,"IHI":1169,"IOH":-142,"IOI":-1015,"IOM":467,"MMH":187,"OOI":-1832};
      this.TC2__ = {"HHO":2088,"HII":-1023,"HMM":-1154,"IHI":-1965,"KKH":703,"OII":-2649};
      this.TC3__ = {"AAA":-294,"HHH":346,"HHI":-341,"HII":-1088,"HIK":731,"HOH":-1486,"IHH":128,"IHI":-3041,"IHO":-1935,"IIH":-825,"IIM":-1035,"IOI":-542,"KHH":-1216,"KKA":491,"KKH":-1217,"KOK":-1009,"MHH":-2694,"MHM":-457,"MHO":123,"MMH":-471,"NNH":-1689,"NNO":662,"OHO":-3393};
      this.TC4__ = {"HHH":-203,"HHI":1344,"HHK":365,"HHM":-122,"HHN":182,"HHO":669,"HIH":804,"HII":679,"HOH":446,"IHH":695,"IHO":-2324,"IIH":321,"III":1497,"IIO":656,"IOO":54,"KAK":4845,"KKA":3386,"KKK":3065,"MHH":-405,"MHI":201,"MMH":-241,"MMM":661,"MOM":841};
      this.TQ1__ = {"BHHH":-227,"BHHI":316,"BHIH":-132,"BIHH":60,"BIII":1595,"BNHH":-744,"BOHH":225,"BOOO":-908,"OAKK":482,"OHHH":281,"OHIH":249,"OIHI":200,"OIIH":-68};
      this.TQ2__ = {"BIHH":-1401,"BIII":-1033,"BKAK":-543,"BOOO":-5591};
      this.TQ3__ = {"BHHH":478,"BHHM":-1073,"BHIH":222,"BHII":-504,"BIIH":-116,"BIII":-105,"BMHI":-863,"BMHM":-464,"BOMH":620,"OHHH":346,"OHHI":1729,"OHII":997,"OHMH":481,"OIHH":623,"OIIH":1344,"OKAK":2792,"OKHH":587,"OKKA":679,"OOHH":110,"OOII":-685};
      this.TQ4__ = {"BHHH":-721,"BHHM":-3604,"BHII":-966,"BIIH":-607,"BIII":-2181,"OAAA":-2763,"OAKK":180,"OHHH":-294,"OHHI":2446,"OHHO":480,"OHIH":-1573,"OIHH":1935,"OIHI":-493,"OIIH":626,"OIII":-4007,"OKAK":-8156};
      this.TW1__ = {"につい":-4681,"東京都":2026};
      this.TW2__ = {"ある程":-2049,"いった":-1256,"ころが":-2434,"しょう":3873,"その後":-4430,"だって":-1049,"ていた":1833,"として":-4657,"ともに":-4517,"もので":1882,"一気に":-792,"初めて":-1512,"同時に":-8097,"大きな":-1255,"対して":-2721,"社会党":-3216};
      this.TW3__ = {"いただ":-1734,"してい":1314,"として":-4314,"につい":-5483,"にとっ":-5989,"に当た":-6247,"ので,":-727,"ので、":-727,"のもの":-600,"れから":-3752,"十二月":-2287};
      this.TW4__ = {"いう.":8576,"いう。":8576,"からな":-2348,"してい":2958,"たが,":1516,"たが、":1516,"ている":1538,"という":1349,"ました":5543,"ません":1097,"ようと":-4258,"よると":5865};
      this.UC1__ = {"A":484,"K":93,"M":645,"O":-505};
      this.UC2__ = {"A":819,"H":1059,"I":409,"M":3987,"N":5775,"O":646};
      this.UC3__ = {"A":-1370,"I":2311};
      this.UC4__ = {"A":-2643,"H":1809,"I":-1032,"K":-3450,"M":3565,"N":3876,"O":6646};
      this.UC5__ = {"H":313,"I":-1238,"K":-799,"M":539,"O":-831};
      this.UC6__ = {"H":-506,"I":-253,"K":87,"M":247,"O":-387};
      this.UP1__ = {"O":-214};
      this.UP2__ = {"B":69,"O":935};
      this.UP3__ = {"B":189};
      this.UQ1__ = {"BH":21,"BI":-12,"BK":-99,"BN":142,"BO":-56,"OH":-95,"OI":477,"OK":410,"OO":-2422};
      this.UQ2__ = {"BH":216,"BI":113,"OK":1759};
      this.UQ3__ = {"BA":-479,"BH":42,"BI":1913,"BK":-7198,"BM":3160,"BN":6427,"BO":14761,"OI":-827,"ON":-3212};
      this.UW1__ = {",":156,"、":156,"「":-463,"あ":-941,"う":-127,"が":-553,"き":121,"こ":505,"で":-201,"と":-547,"ど":-123,"に":-789,"の":-185,"は":-847,"も":-466,"や":-470,"よ":182,"ら":-292,"り":208,"れ":169,"を":-446,"ん":-137,"・":-135,"主":-402,"京":-268,"区":-912,"午":871,"国":-460,"大":561,"委":729,"市":-411,"日":-141,"理":361,"生":-408,"県":-386,"都":-718,"｢":-463,"･":-135};
      this.UW2__ = {",":-829,"、":-829,"〇":892,"「":-645,"」":3145,"あ":-538,"い":505,"う":134,"お":-502,"か":1454,"が":-856,"く":-412,"こ":1141,"さ":878,"ざ":540,"し":1529,"す":-675,"せ":300,"そ":-1011,"た":188,"だ":1837,"つ":-949,"て":-291,"で":-268,"と":-981,"ど":1273,"な":1063,"に":-1764,"の":130,"は":-409,"ひ":-1273,"べ":1261,"ま":600,"も":-1263,"や":-402,"よ":1639,"り":-579,"る":-694,"れ":571,"を":-2516,"ん":2095,"ア":-587,"カ":306,"キ":568,"ッ":831,"三":-758,"不":-2150,"世":-302,"中":-968,"主":-861,"事":492,"人":-123,"会":978,"保":362,"入":548,"初":-3025,"副":-1566,"北":-3414,"区":-422,"大":-1769,"天":-865,"太":-483,"子":-1519,"学":760,"実":1023,"小":-2009,"市":-813,"年":-1060,"強":1067,"手":-1519,"揺":-1033,"政":1522,"文":-1355,"新":-1682,"日":-1815,"明":-1462,"最":-630,"朝":-1843,"本":-1650,"東":-931,"果":-665,"次":-2378,"民":-180,"気":-1740,"理":752,"発":529,"目":-1584,"相":-242,"県":-1165,"立":-763,"第":810,"米":509,"自":-1353,"行":838,"西":-744,"見":-3874,"調":1010,"議":1198,"込":3041,"開":1758,"間":-1257,"｢":-645,"｣":3145,"ｯ":831,"ｱ":-587,"ｶ":306,"ｷ":568};
      this.UW3__ = {",":4889,"1":-800,"−":-1723,"、":4889,"々":-2311,"〇":5827,"」":2670,"〓":-3573,"あ":-2696,"い":1006,"う":2342,"え":1983,"お":-4864,"か":-1163,"が":3271,"く":1004,"け":388,"げ":401,"こ":-3552,"ご":-3116,"さ":-1058,"し":-395,"す":584,"せ":3685,"そ":-5228,"た":842,"ち":-521,"っ":-1444,"つ":-1081,"て":6167,"で":2318,"と":1691,"ど":-899,"な":-2788,"に":2745,"の":4056,"は":4555,"ひ":-2171,"ふ":-1798,"へ":1199,"ほ":-5516,"ま":-4384,"み":-120,"め":1205,"も":2323,"や":-788,"よ":-202,"ら":727,"り":649,"る":5905,"れ":2773,"わ":-1207,"を":6620,"ん":-518,"ア":551,"グ":1319,"ス":874,"ッ":-1350,"ト":521,"ム":1109,"ル":1591,"ロ":2201,"ン":278,"・":-3794,"一":-1619,"下":-1759,"世":-2087,"両":3815,"中":653,"主":-758,"予":-1193,"二":974,"人":2742,"今":792,"他":1889,"以":-1368,"低":811,"何":4265,"作":-361,"保":-2439,"元":4858,"党":3593,"全":1574,"公":-3030,"六":755,"共":-1880,"円":5807,"再":3095,"分":457,"初":2475,"別":1129,"前":2286,"副":4437,"力":365,"動":-949,"務":-1872,"化":1327,"北":-1038,"区":4646,"千":-2309,"午":-783,"協":-1006,"口":483,"右":1233,"各":3588,"合":-241,"同":3906,"和":-837,"員":4513,"国":642,"型":1389,"場":1219,"外":-241,"妻":2016,"学":-1356,"安":-423,"実":-1008,"家":1078,"小":-513,"少":-3102,"州":1155,"市":3197,"平":-1804,"年":2416,"広":-1030,"府":1605,"度":1452,"建":-2352,"当":-3885,"得":1905,"思":-1291,"性":1822,"戸":-488,"指":-3973,"政":-2013,"教":-1479,"数":3222,"文":-1489,"新":1764,"日":2099,"旧":5792,"昨":-661,"時":-1248,"曜":-951,"最":-937,"月":4125,"期":360,"李":3094,"村":364,"東":-805,"核":5156,"森":2438,"業":484,"氏":2613,"民":-1694,"決":-1073,"法":1868,"海":-495,"無":979,"物":461,"特":-3850,"生":-273,"用":914,"町":1215,"的":7313,"直":-1835,"省":792,"県":6293,"知":-1528,"私":4231,"税":401,"立":-960,"第":1201,"米":7767,"系":3066,"約":3663,"級":1384,"統":-4229,"総":1163,"線":1255,"者":6457,"能":725,"自":-2869,"英":785,"見":1044,"調":-562,"財":-733,"費":1777,"車":1835,"軍":1375,"込":-1504,"通":-1136,"選":-681,"郎":1026,"郡":4404,"部":1200,"金":2163,"長":421,"開":-1432,"間":1302,"関":-1282,"雨":2009,"電":-1045,"非":2066,"駅":1620,"１":-800,"｣":2670,"･":-3794,"ｯ":-1350,"ｱ":551,"ｸﾞ":1319,"ｽ":874,"ﾄ":521,"ﾑ":1109,"ﾙ":1591,"ﾛ":2201,"ﾝ":278};
      this.UW4__ = {",":3930,".":3508,"―":-4841,"、":3930,"。":3508,"〇":4999,"「":1895,"」":3798,"〓":-5156,"あ":4752,"い":-3435,"う":-640,"え":-2514,"お":2405,"か":530,"が":6006,"き":-4482,"ぎ":-3821,"く":-3788,"け":-4376,"げ":-4734,"こ":2255,"ご":1979,"さ":2864,"し":-843,"じ":-2506,"す":-731,"ず":1251,"せ":181,"そ":4091,"た":5034,"だ":5408,"ち":-3654,"っ":-5882,"つ":-1659,"て":3994,"で":7410,"と":4547,"な":5433,"に":6499,"ぬ":1853,"ね":1413,"の":7396,"は":8578,"ば":1940,"ひ":4249,"び":-4134,"ふ":1345,"へ":6665,"べ":-744,"ほ":1464,"ま":1051,"み":-2082,"む":-882,"め":-5046,"も":4169,"ゃ":-2666,"や":2795,"ょ":-1544,"よ":3351,"ら":-2922,"り":-9726,"る":-14896,"れ":-2613,"ろ":-4570,"わ":-1783,"を":13150,"ん":-2352,"カ":2145,"コ":1789,"セ":1287,"ッ":-724,"ト":-403,"メ":-1635,"ラ":-881,"リ":-541,"ル":-856,"ン":-3637,"・":-4371,"ー":-11870,"一":-2069,"中":2210,"予":782,"事":-190,"井":-1768,"人":1036,"以":544,"会":950,"体":-1286,"作":530,"側":4292,"先":601,"党":-2006,"共":-1212,"内":584,"円":788,"初":1347,"前":1623,"副":3879,"力":-302,"動":-740,"務":-2715,"化":776,"区":4517,"協":1013,"参":1555,"合":-1834,"和":-681,"員":-910,"器":-851,"回":1500,"国":-619,"園":-1200,"地":866,"場":-1410,"塁":-2094,"士":-1413,"多":1067,"大":571,"子":-4802,"学":-1397,"定":-1057,"寺":-809,"小":1910,"屋":-1328,"山":-1500,"島":-2056,"川":-2667,"市":2771,"年":374,"庁":-4556,"後":456,"性":553,"感":916,"所":-1566,"支":856,"改":787,"政":2182,"教":704,"文":522,"方":-856,"日":1798,"時":1829,"最":845,"月":-9066,"木":-485,"来":-442,"校":-360,"業":-1043,"氏":5388,"民":-2716,"気":-910,"沢":-939,"済":-543,"物":-735,"率":672,"球":-1267,"生":-1286,"産":-1101,"田":-2900,"町":1826,"的":2586,"目":922,"省":-3485,"県":2997,"空":-867,"立":-2112,"第":788,"米":2937,"系":786,"約":2171,"経":1146,"統":-1169,"総":940,"線":-994,"署":749,"者":2145,"能":-730,"般":-852,"行":-792,"規":792,"警":-1184,"議":-244,"谷":-1000,"賞":730,"車":-1481,"軍":1158,"輪":-1433,"込":-3370,"近":929,"道":-1291,"選":2596,"郎":-4866,"都":1192,"野":-1100,"銀":-2213,"長":357,"間":-2344,"院":-2297,"際":-2604,"電":-878,"領":-1659,"題":-792,"館":-1984,"首":1749,"高":2120,"｢":1895,"｣":3798,"･":-4371,"ｯ":-724,"ｰ":-11870,"ｶ":2145,"ｺ":1789,"ｾ":1287,"ﾄ":-403,"ﾒ":-1635,"ﾗ":-881,"ﾘ":-541,"ﾙ":-856,"ﾝ":-3637};
      this.UW5__ = {",":465,".":-299,"1":-514,"E2":-32768,"]":-2762,"、":465,"。":-299,"「":363,"あ":1655,"い":331,"う":-503,"え":1199,"お":527,"か":647,"が":-421,"き":1624,"ぎ":1971,"く":312,"げ":-983,"さ":-1537,"し":-1371,"す":-852,"だ":-1186,"ち":1093,"っ":52,"つ":921,"て":-18,"で":-850,"と":-127,"ど":1682,"な":-787,"に":-1224,"の":-635,"は":-578,"べ":1001,"み":502,"め":865,"ゃ":3350,"ょ":854,"り":-208,"る":429,"れ":504,"わ":419,"を":-1264,"ん":327,"イ":241,"ル":451,"ン":-343,"中":-871,"京":722,"会":-1153,"党":-654,"務":3519,"区":-901,"告":848,"員":2104,"大":-1296,"学":-548,"定":1785,"嵐":-1304,"市":-2991,"席":921,"年":1763,"思":872,"所":-814,"挙":1618,"新":-1682,"日":218,"月":-4353,"査":932,"格":1356,"機":-1508,"氏":-1347,"田":240,"町":-3912,"的":-3149,"相":1319,"省":-1052,"県":-4003,"研":-997,"社":-278,"空":-813,"統":1955,"者":-2233,"表":663,"語":-1073,"議":1219,"選":-1018,"郎":-368,"長":786,"間":1191,"題":2368,"館":-689,"１":-514,"Ｅ２":-32768,"｢":363,"ｲ":241,"ﾙ":451,"ﾝ":-343};
      this.UW6__ = {",":227,".":808,"1":-270,"E1":306,"、":227,"。":808,"あ":-307,"う":189,"か":241,"が":-73,"く":-121,"こ":-200,"じ":1782,"す":383,"た":-428,"っ":573,"て":-1014,"で":101,"と":-105,"な":-253,"に":-149,"の":-417,"は":-236,"も":-206,"り":187,"る":-135,"を":195,"ル":-673,"ン":-496,"一":-277,"中":201,"件":-800,"会":624,"前":302,"区":1792,"員":-1212,"委":798,"学":-960,"市":887,"広":-695,"後":535,"業":-697,"相":753,"社":-507,"福":974,"空":-822,"者":1811,"連":463,"郎":1082,"１":-270,"Ｅ１":306,"ﾙ":-673,"ﾝ":-496};

      return this;
  }

  TinySegmenter.prototype.ctype_ = function(str) {
      for (var i in this.chartype_) {
          if (str.match(this.chartype_[i][0])) {
              return this.chartype_[i][1];
          }
      }
      return "O";
  };

  TinySegmenter.prototype.ts_ = function(v) {
      if (v) { return v; }
      return 0;
  };

  TinySegmenter.prototype.segment = function(input) {
      if (input == null || input == undefined || input == "") {
          return [];
      }
      var result = [];
      var seg = ["B3","B2","B1"];
      var ctype = ["O","O","O"];
      var o = input.split("");
      for (i = 0; i < o.length; ++i) {
          seg.push(o[i]);
          ctype.push(this.ctype_(o[i]));
      }
      seg.push("E1");
      seg.push("E2");
      seg.push("E3");
      ctype.push("O");
      ctype.push("O");
      ctype.push("O");
      var word = seg[3];
      var p1 = "U";
      var p2 = "U";
      var p3 = "U";
      for (var i = 4; i < seg.length - 3; ++i) {
          var score = this.BIAS__;
          var w1 = seg[i-3];
          var w2 = seg[i-2];
          var w3 = seg[i-1];
          var w4 = seg[i];
          var w5 = seg[i+1];
          var w6 = seg[i+2];
          var c1 = ctype[i-3];
          var c2 = ctype[i-2];
          var c3 = ctype[i-1];
          var c4 = ctype[i];
          var c5 = ctype[i+1];
          var c6 = ctype[i+2];
          score += this.ts_(this.UP1__[p1]);
          score += this.ts_(this.UP2__[p2]);
          score += this.ts_(this.UP3__[p3]);
          score += this.ts_(this.BP1__[p1 + p2]);
          score += this.ts_(this.BP2__[p2 + p3]);
          score += this.ts_(this.UW1__[w1]);
          score += this.ts_(this.UW2__[w2]);
          score += this.ts_(this.UW3__[w3]);
          score += this.ts_(this.UW4__[w4]);
          score += this.ts_(this.UW5__[w5]);
          score += this.ts_(this.UW6__[w6]);
          score += this.ts_(this.BW1__[w2 + w3]);
          score += this.ts_(this.BW2__[w3 + w4]);
          score += this.ts_(this.BW3__[w4 + w5]);
          score += this.ts_(this.TW1__[w1 + w2 + w3]);
          score += this.ts_(this.TW2__[w2 + w3 + w4]);
          score += this.ts_(this.TW3__[w3 + w4 + w5]);
          score += this.ts_(this.TW4__[w4 + w5 + w6]);
          score += this.ts_(this.UC1__[c1]);
          score += this.ts_(this.UC2__[c2]);
          score += this.ts_(this.UC3__[c3]);
          score += this.ts_(this.UC4__[c4]);
          score += this.ts_(this.UC5__[c5]);
          score += this.ts_(this.UC6__[c6]);
          score += this.ts_(this.BC1__[c2 + c3]);
          score += this.ts_(this.BC2__[c3 + c4]);
          score += this.ts_(this.BC3__[c4 + c5]);
          score += this.ts_(this.TC1__[c1 + c2 + c3]);
          score += this.ts_(this.TC2__[c2 + c3 + c4]);
          score += this.ts_(this.TC3__[c3 + c4 + c5]);
          score += this.ts_(this.TC4__[c4 + c5 + c6]);
  //  score += this.ts_(this.TC5__[c4 + c5 + c6]);
          score += this.ts_(this.UQ1__[p1 + c1]);
          score += this.ts_(this.UQ2__[p2 + c2]);
          score += this.ts_(this.UQ3__[p3 + c3]);
          score += this.ts_(this.BQ1__[p2 + c2 + c3]);
          score += this.ts_(this.BQ2__[p2 + c3 + c4]);
          score += this.ts_(this.BQ3__[p3 + c2 + c3]);
          score += this.ts_(this.BQ4__[p3 + c3 + c4]);
          score += this.ts_(this.TQ1__[p2 + c1 + c2 + c3]);
          score += this.ts_(this.TQ2__[p2 + c2 + c3 + c4]);
          score += this.ts_(this.TQ3__[p3 + c1 + c2 + c3]);
          score += this.ts_(this.TQ4__[p3 + c2 + c3 + c4]);
          var p = "O";
          if (score > 0) {
              result.push(word);
              word = "";
              p = "B";
          }
          p1 = p2;
          p2 = p3;
          p3 = p;
          word += seg[i];
      }
      result.push(word);

      return result;
  };

  var lib = TinySegmenter;

  const SEARCH_RESULT = 'search_result';

  const SKIP_SEARCH_KEY = 'SCH_SKIP_SEARCH';
  /**
   * 过滤搜索结果： 通过名称以及日期
   * @param items
   * @param subjectInfo
   * @param opts
   */
  function filterResults(items, subjectInfo, opts) {
      if (!items)
          return;
      // 只有一个结果时直接返回, 不再比较日期
      if (items.length === 1 && opts.uniqueSearch) {
          return items[0];
      }
      // 使用发行日期过滤
      if (subjectInfo.releaseDate && opts.dateFirst) {
          const list = items
              .filter((item) => isEqualDate(item.releaseDate, subjectInfo.releaseDate))
              .sort((a, b) => +b.count - +a.count);
          if (opts.sameName) {
              return list.find((item) => item.name === subjectInfo.name);
          }
          if (list && list.length > 0) {
              return list[0];
          }
      }
      var results = new Fuse(items, { ...opts, includeScore: true }).search(subjectInfo.name);
      // 去掉括号包裹的，再次模糊查询
      if (!results.length && /<|＜|\(|（/.test(subjectInfo.name)) {
          results = new Fuse(items, { ...opts, includeScore: true }).search(subjectInfo.name
              .replace(/＜.+＞/g, '')
              .replace(/<.+>/g, '')
              .replace(/（.+）/g, '')
              .replace(/\(.+\)/g, ''));
      }
      if (!results.length) {
          return;
      }
      if (opts.score) {
          results = results.filter((item) => {
              if (item.score > opts.score) {
                  return false;
              }
              return true;
          });
      }
      if (opts.sortCount) {
          results.sort((a, b) => {
              return +b.item.count - +a.item.count;
          });
      }
      // 有参考的发布时间
      if (subjectInfo.releaseDate) {
          const sameDateResults = [];
          const sameYearResults = [];
          const sameMonthResults = [];
          for (const obj of results) {
              const result = obj.item;
              if (result.releaseDate) {
                  // 只有年的时候
                  if (result.releaseDate.length === 4) {
                      if (result.releaseDate === subjectInfo.releaseDate.slice(0, 4)) {
                          return result;
                      }
                  }
                  if (isEqualDate(result.releaseDate, subjectInfo.releaseDate)) {
                      sameDateResults.push(obj);
                      continue;
                  }
                  if (isEqualDate(result.releaseDate, subjectInfo.releaseDate, 'm')) {
                      sameMonthResults.push(obj);
                      continue;
                  }
                  if (isEqualDate(result.releaseDate, subjectInfo.releaseDate, 'y')) {
                      sameYearResults.push(obj);
                  }
              }
          }
          if (opts.sameDate) {
              return sameDateResults[0]?.item;
          }
          if (sameDateResults.length) {
              return sameDateResults[0].item;
          }
          if (sameMonthResults.length) {
              return sameMonthResults[0].item;
          }
          if (sameYearResults.length && opts.sameYear) {
              return sameYearResults[0].item;
          }
      }
      return results[0]?.item;
  }
  function findResultByMonth(items, info) {
      const list = items
          .filter((item) => isEqualMonth(item.releaseDate, info.releaseDate))
          .sort((a, b) => +b.count - +a.count);
      if (!list.length) {
          return;
      }
      if (list.length === 1) {
          return list[0];
      }
      const obj = list.find((item) => isEqualDate(item.releaseDate, info.releaseDate));
      if (obj) {
          return obj;
      }
      return list[0];
  }
  async function getSearchSubjectByGM() {
      return new Promise((resolve, reject) => {
          const listenId = window.gm_val_listen_id;
          if (listenId) {
              GM_removeValueChangeListener(listenId);
          }
          window.gm_val_listen_id = GM_addValueChangeListener(
          // const listenId = GM_addValueChangeListener(
          SEARCH_RESULT, (n, oldValue, newValue) => {
              console.log('enter promise');
              const now = +new Date();
              if (newValue.type === SEARCH_RESULT && newValue.timestamp && newValue.timestamp < now) {
                  // GM_removeValueChangeListener(listenId);
                  resolve(newValue.data);
              }
              reject('mismatch timestamp');
          });
      });
  }
  function isSingleJpSegment(name) {
      const segmenter = new lib();
      const segs = segmenter.segment(name);
      if (segs.length === 1) {
          if (/^\p{Script=Katakana}+$/u.test(name)) {
              return true;
          }
          if (/^\p{Script=Hiragana}+$/u.test(name)) {
              return true;
          }
      }
      return false;
  }

  async function searchAnimeData$1(subjectInfo) {
      let query = normalizeQuery((subjectInfo.name || '').trim());
      if (!query) {
          console.info('Query string is empty');
          return Promise.reject('empty query');
      }
      // 标点符号不一致
      // 戦闘員、派遣します！  ---->  戦闘員, 派遣します!
      query = subjectInfo.name
          .replace(/、|！/, ' ')
          .replace(/\s{2,}/, ' ')
          .trim();
      const url = `https://anidb.net/perl-bin/animedb.pl?show=json&action=search&type=anime&query=${encodeURIComponent(query)}`;
      console.info('anidb search URL: ', url);
      const info = await fetchJson(url, {
          headers: {
              referrer: 'https://anidb.net/',
              'content-type': 'application/json',
              'accept-language': 'en-US,en;q=0.9',
              'x-lcontrol': 'x-no-cache',
          },
      });
      await randomSleep(200, 100);
      const rawInfoList = info.map((obj) => {
          return {
              ...obj,
              url: obj.link,
              greyName: obj.hit,
          };
      });
      const options = {
          uniqueSearch: true,
          keys: ['greyName'],
      };
      let result;
      result = filterResults(rawInfoList, subjectInfo, options);
      if (result && result.url) {
          // 转换评分
          const obj = result;
          const arr = (obj.desc || '').split(',');
          const scoreObj = {
              score: '0',
              count: '0',
          };
          if (arr && arr.length === 3) {
              const scoreStr = arr[2];
              if (!scoreStr.includes('N/A') && scoreStr.includes('(')) {
                  const arr = scoreStr.split('(');
                  scoreObj.score = arr[0].trim();
                  scoreObj.count = arr[1].replace(/\).*/g, '');
              }
          }
          result = {
              ...result,
              ...scoreObj,
          };
          console.info('anidb search result: ', result);
          return result;
      }
  }
  const favicon$3 = 'data:image/x-icon;base64,AAABAAMAEBAAAAEABAAoAQAANgAAACAgAAABACAAqBAAAF4BAAAwMAAAAQAgAKglAAAGEgAAKAAAABAAAAAgAAAAAQAEAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAMG+vQAygMsAVAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIiIgIiIiAAIRESIhERIgAhIiEiEiISACEgISISIhIAISAhIhERIgAhIiEiEiISACEREiIRESIAIiIiIiIiIiIgAAICIgIgIgIiAgIiAiAiIAACAiICICAiIgICIgIAICAAIgAAIiIgIiIiIiIgICAAAAAAAAAiIAAAAAAAAAAIEDAACAAQAAgAEAAIgBAACIAQAAgAEAAIABAACAAAAAAAAAAAAAAAAAAAAAgAAAAIAAAACACAAA//gAAP//AAAoAAAAIAAAAEAAAAABACAAAAAAAIAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Af9/fwL/f38C/39/Av9/fwL/f38C/39/AgAAAAAAAAAAAAAAAAAAAAAAAAAA////Af9/fwL/f38C/39/Av9/fwL/f38C/39/Av///wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AaqqqgMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH9//wL///8BAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAADAAAABgAAAAAQAgAAAAAACAJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

  const BLANK_LINK = 'target="_blank" rel="noopener noreferrer nofollow"';
  const NO_MATCH_DATA = '点击搜索';
  const SCORE_ROW_WRAP_CLS = 'e-userjs-score-compare';
  function getFavicon(page) {
      let site = page.name;
      let favicon = '';
      site = site.split('-')[0];
      const dict = {
          anidb: favicon$3,
      };
      if (dict[site]) {
          return dict[site];
      }
      if (page.favicon) {
          return page.favicon;
      }
      try {
          favicon = GM_getResourceURL(`${site}_favicon`);
      }
      catch (error) { }
      return favicon;
  }
  function genScoreRowStr(info) {
      return `
<div class="e-userjs-score-compare-row" style="display:flex;align-items:center;margin-bottom:10px;">
<a target="_blank" rel="noopener noreferrer nofollow"
  style="margin-right:1em;"  title="点击在${info.name}搜索" href="${info.searchUrl}">
<img alt="${info.name}" style="width:16px;" src="${info.favicon}"/>
</a>
<strong style="margin-right:1em;">${info.score}</strong>
<a href="${info.url}"
  target="_blank" rel="noopener noreferrer nofollow">
  ${info.count}
</a>
</div>
`;
  }
  function genScoreRowInfo(title, page, info) {
      const favicon = getFavicon(page);
      const name = page.name.split('-')[0];
      let score = '0.00';
      let count = NO_MATCH_DATA;
      const searchUrl = page.searchApi.replace('{kw}', encodeURIComponent(normalizeQuery(title)));
      let url = searchUrl;
      if (info && info.url) {
          if (!isNaN(Number(info.score))) {
              score = Number(info.score || 0).toFixed(2);
          }
          else {
              score = '0.00';
          }
          count = (info.count || 0) + ' 人评分';
          url = info.url;
      }
      return { favicon, count, score, url, searchUrl, name };
  }
  function getScoreWrapDom(adjacentSelector, cls = '', style = '') {
      let $div = document.querySelector('.' + SCORE_ROW_WRAP_CLS);
      if (!$div) {
          $div = document.createElement('div');
          $div.className = `${SCORE_ROW_WRAP_CLS} ${cls}`;
          $div.setAttribute('style', `margin-top:10px;${style}`);
          findElement(adjacentSelector)?.insertAdjacentElement('afterend', $div);
      }
      return $div;
  }
  function insertScoreRow(wrapDom, rowInfo) {
      wrapDom.appendChild(htmlToElement(genScoreRowStr(rowInfo)));
  }
  function insertScoreCommon(page, info, opts) {
      const wrapDom = getScoreWrapDom(opts.adjacentSelector, opts.cls, opts.style);
      const rowInfo = genScoreRowInfo(opts.title, page, info);
      insertScoreRow(wrapDom, rowInfo);
  }

  const anidbPage = {
      name: 'anidb',
      href: ['https://anidb.net'],
      searchApi: 'https://anidb.net/anime/?adb.search={kw}&do.search=1',
      favicon: 'https://cdn-us.anidb.net/css/icons/touch/favicon.ico',
      expiration: 21,
      infoSelector: [
          {
              selector: '#tab_1_pane',
          },
      ],
      pageSelector: [
          {
              selector: 'h1.anime',
          },
      ],
      getSubjectId(url) {
          const m = url.match(/\/(anime\/|anidb.net\/a)(\d+)/);
          if (m) {
              return `${this.name}_${m[2]}`;
          }
          return '';
      },
      genSubjectUrl(id) {
          return `https://anidb.net/anime/${id}`;
      },
      getSearchResult: searchAnimeData$1,
      getScoreInfo: function () {
          const $table = $q('#tabbed_pane .g_definitionlist > table');
          let names = $table.querySelectorAll('tr.official .value > label');
          const info = {
              name: names[0].textContent.trim(),
              greyName: names[names.length - 1].textContent.trim(),
              score: 0,
              count: 0,
              url: location.href,
          };
          const $rating = $table.querySelector('tr.rating span.rating');
          if ($rating) {
              info.count = $rating
                  .querySelector('.count')
                  .textContent.trim()
                  .replace(/\(|\)/g, '');
              const score = Number($rating.querySelector('a > .value').textContent.trim());
              if (!isNaN(score)) {
                  info.score = score;
              }
              const $year = $table.querySelector('tr.year > .value > span[itemprop="startDate"]');
              if ($year) {
                  info.releaseDate = $year.getAttribute('content');
              }
              names = $table.querySelectorAll('tr.official .value');
              for (let i = 0; i < names.length; i++) {
                  const el = names[i];
                  if (el.querySelector('.icons').innerHTML.includes('japanese')) {
                      info.name = el.querySelector('label').textContent.trim();
                  }
                  else if (el.querySelector('.icons').innerHTML.includes('english')) {
                      info.greyName = el.querySelector('label').textContent.trim();
                  }
              }
          }
          return info;
      },
      insertScoreInfo: function (page, info) {
          const title = this.getScoreInfo().name;
          const opts = {
              title,
              adjacentSelector: this.infoSelector,
              cls: '',
              style: '',
          };
          const wrapDom = getScoreWrapDom(opts.adjacentSelector, opts.cls, opts.style);
          const rowInfo = genScoreRowInfo(opts.title, page, info);
          // refuse blob:<URL>
          rowInfo.favicon = page.favicon;
          insertScoreRow(wrapDom, rowInfo);
      },
  };

  var SubjectTypeId;
  (function (SubjectTypeId) {
      SubjectTypeId[SubjectTypeId["book"] = 1] = "book";
      SubjectTypeId[SubjectTypeId["anime"] = 2] = "anime";
      SubjectTypeId[SubjectTypeId["music"] = 3] = "music";
      SubjectTypeId[SubjectTypeId["game"] = 4] = "game";
      SubjectTypeId[SubjectTypeId["real"] = 6] = "real";
      SubjectTypeId["all"] = "all";
  })(SubjectTypeId || (SubjectTypeId = {}));

  const SUB_TITLE_PAIRS = ['--', '──', '~~', '～～', '－－', '<>', '＜＞'];
  function getAliasByName(name) {
      const opens = SUB_TITLE_PAIRS.map(pair => pair[0]);
      const closes = SUB_TITLE_PAIRS.map(pair => pair[1]);
      const len = name.length;
      if (closes.includes(name[len - 1])) {
          let i = len - 1;
          const c = name[len - 1];
          let idx = closes.indexOf(c);
          const openChar = opens[idx];
          const j = name.lastIndexOf(openChar, i - 1);
          if (j >= 0) {
              return [name.slice(0, j).trim(), name.slice(j + 1, i)];
          }
      }
      return [];
  }
  function getHiraganaSubTitle(name) {
      let alias = getAliasByName(name);
      if (alias.length === 0 && name.split(' ').length === 2) {
          alias = name.split(' ');
      }
      // const jpRe = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u;
      const hanAndHiraganaRe = /[\p{Script=Hiragana}\p{Script=Han}]/u;
      if (alias && alias.length > 0) {
          if (hanAndHiraganaRe.test(alias[1])) {
              // 以假名开头的、包含版本号的
              if (/^\p{Script=Katakana}/u.test(alias[0]) ||
                  /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}][ａ-ｚＡ-Ｚ0-9０-９]/u.test(alias[0])) {
                  return alias[1];
              }
          }
      }
      return '';
  }
  function normalizeEditionName(str) {
      return str.replace(/\s[^ ]*?(スペシャルプライス版|体験版|ダウンロード版|パッケージ版|限定版|通常版|廉価版|復刻版|初回.*?版|描き下ろし|DVDPG.*|DVD.*?版|Windows版|リニューアル|完全版|リメイク版).*?$/g, '').replace(/Memorial Edition$/, '')
          // fix いろとりどりのセカイ WORLD'S END COMPLETE
          .replace(/ WORLD'S END COMPLETE$/, '');
  }
  function removePairs(str, pairs = []) {
      for (let i = 0; i < pairs.length; i++) {
          if (pairs.length < 2) {
              continue;
          }
          const [open, close] = pairs[i];
          str = str.replace(new RegExp(open + '.+?' + close, 'g'), '');
      }
      return str
          .replace(/\(.*?\)/g, '')
          .replace(/\（.*?\）/g, '')
          .replace(/＜.+?＞/, '')
          .replace(/<.+?>/, '');
  }
  function removeSubTitle(str) {
      return removePairs(str, SUB_TITLE_PAIRS).trim();
  }
  function unique(str) {
      var result = '';
      for (var i = 0; i < str.length; i++) {
          if (result.indexOf(str[i]) < 0) {
              result += str[i];
          }
      }
      return result;
  }
  function charsToSpace(originStr, chars) {
      return originStr.replace(new RegExp(`[${chars}]`, 'g'), ' ').replace(/\s{2,}/g, ' ');
  }
  function replaceCharsToSpace(str, excludes = '', extra = '') {
      const fullwidthPair = '～－＜＞';
      // @TODO 需要更多测试
      var symbolString = '―〜━『』~\'…！？。♥☆/♡★‥○【】◆×▼’＇"＊?' + '．・　' + fullwidthPair;
      if (excludes) {
          symbolString = symbolString.replace(new RegExp(`[${excludes}]`, 'g'), '');
      }
      symbolString = symbolString + extra;
      let output = charsToSpace(str, unique(symbolString));
      // output =  output.replace(/[&,\[\]]/g, ' ');
      return output;
  }
  function pairCharsToSpace(str) {
      return charsToSpace(str, unique(SUB_TITLE_PAIRS.join(''))).trim();
  }
  function replaceToASCII(str) {
      return str
          .replace(/＝|=/g, ' ')
          .replace(/　/g, ' ')
          .replace(/０/g, '0')
          .replace(/１/g, '1')
          .replace(/２/g, '2')
          .replace(/３/g, '3')
          .replace(/４/g, '4')
          .replace(/５/g, '5')
          .replace(/６/g, '6')
          .replace(/７/g, '7')
          .replace(/８/g, '8')
          .replace(/９/g, '9')
          .replace(/Ⅰ/g, 'I')
          .replace(/Ⅱ/g, 'II')
          .replace(/Ⅲ/g, 'III')
          .replace(/Ⅳ/g, 'IV')
          .replace(/Ⅴ/g, 'V')
          .replace(/Ⅵ/g, 'VI')
          .replace(/Ⅶ/g, 'VII')
          .replace(/Ⅷ/g, 'VIII')
          .replace(/Ⅸ/g, 'IX')
          .replace(/Ⅹ/g, 'X');
  }
  function isEnglishName(name) {
      return /^[a-zA-Z][a-zA-Z\s.-]*[a-zA-Z]$/.test(name);
  }
  function isKatakanaName(name) {
      // ァ-ン
      return /^[ァ-ヶ][ァ-ヶー・\s]*[ァ-ヶー]?$/.test(name);
  }

  function getSearchItem$4($item) {
      let $subjectTitle = $item.querySelector('h3>a.l');
      let info = {
          name: $subjectTitle.textContent.trim(),
          // url 没有协议和域名
          url: $subjectTitle.getAttribute('href'),
          greyName: $item.querySelector('h3>.grey') ? $item.querySelector('h3>.grey').textContent.trim() : '',
      };
      let matchDate = $item.querySelector('.info').textContent.match(/\d{4}[\-\/\年]\d{1,2}[\-\/\月]\d{1,2}/);
      if (matchDate) {
          info.releaseDate = dealDate(matchDate[0]);
      }
      let $rateInfo = $item.querySelector('.rateInfo');
      if ($rateInfo) {
          if ($rateInfo.querySelector('.fade')) {
              info.score = $rateInfo.querySelector('.fade').textContent;
              info.count = $rateInfo.querySelector('.tip_j').textContent.replace(/[^0-9]/g, '');
          }
          else {
              info.score = '0';
              info.count = '少于10';
          }
      }
      else {
          info.score = '0';
          info.count = '0';
      }
      return info;
  }
  function extractInfoList($doc) {
      return [...$doc.querySelectorAll('#browserItemList>li')].map(($item) => {
          return getSearchItem$4($item);
      });
  }
  function getTotalPageNum($doc = document) {
      const $multipage = $doc.querySelector('#multipage');
      let totalPageNum = 1;
      const pList = $multipage?.querySelectorAll('.page_inner>.p');
      if (pList && pList.length) {
          let tempNum = parseInt(pList[pList.length - 2].getAttribute('href').match(/page=(\d*)/)[1]);
          totalPageNum = parseInt(pList[pList.length - 1].getAttribute('href').match(/page=(\d*)/)[1]);
          totalPageNum = totalPageNum > tempNum ? totalPageNum : tempNum;
      }
      return totalPageNum;
  }
  function filterSubjectByNameAndDate(items, subjectInfo) {
      const list = items.filter((item) => isEqualDate(item.releaseDate, subjectInfo.releaseDate));
      if (list.length === 0)
          return;
      let res = list.find((item) => item.name === subjectInfo.name);
      if (res) {
          return res;
      }
      return list.find((item) => item.greyName === subjectInfo.name);
  }
  /**
   * 获取搜索信息对象
   * @returns SearchSubject
   */
  function getSearchSubject$4() {
      const info = {
          name: $q('h1>a').textContent.trim(),
          score: $q('.global_score span[property="v:average"')?.textContent ?? 0,
          count: $q('span[property="v:votes"')?.textContent ?? 0,
          url: location.href,
      };
      let infoList = $qa('#infobox>li');
      if (infoList && infoList.length) {
          for (let i = 0, len = infoList.length; i < len; i++) {
              let el = infoList[i];
              if (el.innerHTML.match(/放送开始|上映年度|发行日期/)) {
                  info.releaseDate = dealDate(el.textContent.split(':')[1].trim());
              }
              // if (el.innerHTML.match('播放结束')) {
              //   info.endDate = dealDate(el.textContent.split(':')[1].trim());
              // }
          }
      }
      return info;
  }

  var BangumiDomain;
  (function (BangumiDomain) {
      BangumiDomain["chii"] = "chii.in";
      BangumiDomain["bgm"] = "bgm.tv";
      BangumiDomain["bangumi"] = "bangumi.tv";
  })(BangumiDomain || (BangumiDomain = {}));
  var Protocol;
  (function (Protocol) {
      Protocol["http"] = "http";
      Protocol["https"] = "https";
  })(Protocol || (Protocol = {}));
  function normalizeQueryBangumi(query) {
      query = replaceToASCII(query);
      query = removePairs(query);
      query = pairCharsToSpace(query);
      // fix いつまでも僕だけのママのままでいて!
      query = replaceCharsToSpace(query, '', '!');
      return query.trim();
  }
  /**
   * 搜索条目并过滤出搜索结果
   * @param subjectInfo
   * @param type
   * @param uniqueQueryStr
   */
  async function searchSubject$2(subjectInfo, bgmHost = 'https://bgm.tv', type = SubjectTypeId.all, uniqueQueryStr = '', opts = {}) {
      // fuse options
      const fuseOptions = {
          uniqueSearch: false,
          keys: ['name', 'greyName'],
      };
      let query = normalizeQueryBangumi((subjectInfo.name || '').trim());
      if (type === SubjectTypeId.book) {
          // 去掉末尾的括号并加上引号
          query = query.replace(/（[^0-9]+?）|\([^0-9]+?\)$/, '');
          query = `"${query}"`;
      }
      if (opts.query) {
          query = opts.query;
      }
      // for example: book's ISBN
      if (uniqueQueryStr) {
          query = `"${uniqueQueryStr || ''}"`;
          fuseOptions.uniqueSearch = true;
      }
      if (!query || query === '""') {
          console.info('Query string is empty');
          return;
      }
      const url = `${bgmHost}/subject_search/${encodeURIComponent(query)}?cat=${type}`;
      console.info('search bangumi subject URL: ', url);
      const content = await fetchText(url);
      const $doc = new DOMParser().parseFromString(content, 'text/html');
      const rawInfoList = extractInfoList($doc);
      // 使用指定搜索字符串如 ISBN 搜索时, 并且结果只有一条时，不再使用名称过滤
      if (uniqueQueryStr && rawInfoList && rawInfoList.length === 1) {
          return rawInfoList[0];
      }
      if (type === SubjectTypeId.game) {
          const name = subjectInfo.name;
          if (getAliasByName(name).length > 0) {
              // fix: グリザイアの楽園 -LE EDEN DE LA GRISAIA-
              const changedName = removeSubTitle(name);
              const info = { ...subjectInfo, name: changedName };
              let res = filterResults(rawInfoList, info, {
                  ...fuseOptions,
                  score: 0.1,
                  sameDate: true,
              });
              if (res) {
                  return res;
              }
          }
          if (isSingleJpSegment(subjectInfo.name) && rawInfoList.length >= 6) {
              return filterSubjectByNameAndDate(rawInfoList, subjectInfo);
          }
          // fix: "ソード(同人フリー版)"
          if (name.startsWith(query) && /[)）>＞]$/.test(name)) {
              return filterResults(rawInfoList, {
                  ...subjectInfo,
                  name: query,
              }, {
                  ...fuseOptions,
                  score: 0.1,
                  sameDate: true,
              });
          }
      }
      if (type === SubjectTypeId.anime) ;
      return filterResults(rawInfoList, subjectInfo, fuseOptions);
  }
  /**
   * 通过时间查找条目
   * @param subjectInfo 条目信息
   * @param pageNumber 页码
   * @param type 条目类型
   */
  async function findSubjectByDate(subjectInfo, bgmHost = 'https://bgm.tv', pageNumber = 1, type) {
      if (!subjectInfo || !subjectInfo.releaseDate || !subjectInfo.name) {
          throw new Error('invalid subject info');
      }
      const releaseDate = new Date(subjectInfo.releaseDate);
      if (isNaN(releaseDate.getTime())) {
          throw `invalid releasedate: ${subjectInfo.releaseDate}`;
      }
      const sort = releaseDate.getDate() > 15 ? 'sort=date' : '';
      const page = pageNumber ? `page=${pageNumber}` : '';
      let query = '';
      if (sort && page) {
          query = '?' + sort + '&' + page;
      }
      else if (sort) {
          query = '?' + sort;
      }
      else if (page) {
          query = '?' + page;
      }
      const url = `${bgmHost}/${type}/browser/airtime/${releaseDate.getFullYear()}-${releaseDate.getMonth() + 1}${query}`;
      console.info('find subject by date: ', url);
      const rawText = await fetchText(url);
      const $doc = new DOMParser().parseFromString(rawText, 'text/html');
      const rawInfoList = extractInfoList($doc);
      const numOfPage = getTotalPageNum($doc);
      const options = {
          threshold: 0.3,
          keys: ['name', 'greyName'],
      };
      let result = filterResults(rawInfoList, subjectInfo, options);
      if (!result) {
          if (pageNumber < numOfPage) {
              await sleep(300);
              return await findSubjectByDate(subjectInfo, bgmHost, pageNumber + 1, type);
          }
          else {
              throw 'notmatched';
          }
      }
      return result;
  }
  async function checkBookSubjectExist(subjectInfo, bgmHost = 'https://bgm.tv', type) {
      let searchResult = await searchSubject$2(subjectInfo, bgmHost, type, subjectInfo.isbn);
      console.info(`First: search book of bangumi: `, searchResult);
      if (searchResult && searchResult.url) {
          return searchResult;
      }
      searchResult = await searchSubject$2(subjectInfo, bgmHost, type, subjectInfo.asin);
      console.info(`Second: search book by ${subjectInfo.asin}: `, searchResult);
      if (searchResult && searchResult.url) {
          return searchResult;
      }
      // 默认使用名称搜索
      searchResult = await searchSubject$2(subjectInfo, bgmHost, type);
      console.info('Third: search book of bangumi: ', searchResult);
      return searchResult;
  }
  function isUniqueQuery(info) {
      // fix: ヴァージン・トリガー
      if (isKatakanaName(info.name) || isEnglishName(info.name)) {
          return true;
      }
      // fix いろとりどりのセカイ
      if (/^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー々\s]+$/u.test(info.name)) {
          return true;
      }
  }
  /**
   * 查找条目是否存在： 通过名称搜索或者日期加上名称的过滤查询
   * @param subjectInfo 条目基本信息
   * @param bgmHost bangumi 域名
   * @param type 条目类型
   */
  async function checkExist(subjectInfo, bgmHost = 'https://bgm.tv', type, opts) {
      const subjectTypeDict = {
          [SubjectTypeId.game]: 'game',
          [SubjectTypeId.anime]: 'anime',
          [SubjectTypeId.music]: 'music',
          [SubjectTypeId.book]: 'book',
          [SubjectTypeId.real]: 'real',
          [SubjectTypeId.all]: 'all',
      };
      let searchOpts = {};
      if (typeof opts === 'object') {
          searchOpts = opts;
      }
      const normalizedStr = normalizeQueryBangumi((subjectInfo.name || '').trim());
      // fix long name
      if (subjectInfo.name.length > 50) {
          let query = normalizeQueryBangumi(subjectInfo.name.split(' ')[0]);
          return await searchSubject$2(subjectInfo, bgmHost, type, '', {
              ...searchOpts,
              shortenQuery: true,
              query,
          });
      }
      if (isUniqueQuery(subjectInfo)) {
          return await searchSubject$2(subjectInfo, bgmHost, type, subjectInfo.name.trim(), searchOpts);
      }
      let searchResult = await searchSubject$2(subjectInfo, bgmHost, type, '', searchOpts);
      console.info(`First: search result of bangumi: `, searchResult);
      if (searchResult && searchResult.url) {
          return searchResult;
      }
      if (searchOpts.enableShortenQuery) {
          await sleep(300);
          const shortenedQuery = getShortenedQuery(normalizedStr);
          if (shortenedQuery === normalizedStr) {
              return;
          }
          searchResult = await searchSubject$2(subjectInfo, bgmHost, type, '', {
              ...searchOpts,
              shortenQuery: true,
              query: shortenedQuery,
          });
          if (searchResult && searchResult.url) {
              return searchResult;
          }
      }
      // disableDate
      if ((typeof opts === 'boolean' && opts) || (typeof opts === 'object' && opts.disableDate)) {
          return;
      }
      searchResult = await findSubjectByDate(subjectInfo, bgmHost, 1, subjectTypeDict[type]);
      console.info(`Second: search result by date: `, searchResult);
      return searchResult;
  }
  async function checkSubjectExist(subjectInfo, bgmHost = 'https://bgm.tv', type = SubjectTypeId.all, opts) {
      let result;
      switch (type) {
          case SubjectTypeId.book:
              result = await checkBookSubjectExist(subjectInfo, bgmHost, type);
              break;
          case SubjectTypeId.all:
          case SubjectTypeId.game:
          case SubjectTypeId.anime:
              result = await checkExist(subjectInfo, bgmHost, type, opts);
              break;
          case SubjectTypeId.real:
          case SubjectTypeId.music:
          default:
              console.info('not support type: ', type);
      }
      return result;
  }

  // http://mirror.bgm.rincat.ch
  let bgm_origin = 'https://bgm.tv';
  function genBgmUrl(url) {
      if (url.startsWith('http')) {
          return url;
      }
      return new URL(url, bgm_origin).href;
  }
  const bangumiAnimePage = {
      name: 'bangumi-anime',
      href: ['https://bgm.tv/', 'https://bangumi.tv/', 'https://chii.in/'],
      searchApi: 'https://bgm.tv/subject_search/{kw}?cat=2',
      favicon: 'https://bgm.tv/img/favicon.ico',
      controlSelector: [
          {
              selector: '#panelInterestWrapper h2',
          },
      ],
      infoSelector: [
          {
              selector: '#panelInterestWrapper .SidePanel > :last-child',
          },
      ],
      pageSelector: [
          {
              selector: '.focus.chl.anime',
          },
      ],
      getSubjectId(url) {
          // @TODO 修改域名。
          // const urlObj = new URL(url);
          // setBgmOrigin(urlObj.origin);
          // this.searchApi = `${bgm_origin}/subject_search/{kw}?cat=2`;
          const m = url.match(/\/(subject)\/(\d+)/);
          if (m) {
              return `${this.name}_${m[2]}`;
          }
          return '';
      },
      genSubjectUrl(id) {
          return `${bgm_origin}/subject/${id}`;
      },
      async getSearchResult(subject) {
          const res = await checkSubjectExist(subject, bgm_origin, SubjectTypeId.anime);
          if (res) {
              res.url = genBgmUrl(res.url);
          }
          return res;
      },
      getScoreInfo: getSearchSubject$4,
      // 插入评分信息的 DOM
      insertScoreInfo(page, info) {
          const title = $q('h1>a').textContent.trim();
          const opts = {
              title,
              adjacentSelector: this.infoSelector,
          };
          const wrapDom = getScoreWrapDom(opts.adjacentSelector);
          const rowInfo = genScoreRowInfo(opts.title, page, info);
          const rowStr = `
<div class="e-userjs-score-compare-row frdScore">
<a class="avatar"
target="_blank" rel="noopener noreferrer nofollow"
style="vertical-align:-3px;margin-right:10px;" title="点击在${rowInfo.name}搜索" href="${rowInfo.searchUrl}">
<img style="width:16px;" src="${rowInfo.favicon}"/>
</a>
<span class="num">${rowInfo.score}</span>
<span class="desc" style="visibility:hidden">还行</span>
<a href="${rowInfo.url}"
      target="_blank" rel="noopener noreferrer nofollow" class="l">
      ${rowInfo.count}
</a>
</div>
`;
          wrapDom.appendChild(htmlToElement(rowStr));
      },
      insertControlDOM($target, callbacks) {
          if (!$target)
              return;
          // 已存在控件时返回
          if ($q('.e-userjs-score-ctrl'))
              return;
          const rawHTML = `<a title="强制刷新评分" class="e-userjs-score-ctrl e-userjs-score-fresh">O</a>
      <a title="清除所有评分缓存" class="e-userjs-score-ctrl e-userjs-score-clear">X</a>
`;
          $target.innerHTML = $target.innerHTML + rawHTML;
          GM_addStyle(`
      .e-userjs-score-ctrl {color:#f09199;font-weight:800;float:right;}
      .e-userjs-score-ctrl:hover {cursor: pointer;}
      .e-userjs-score-clear {margin-right: 12px;}
      .e-userjs-score-loading { width: 208px; height: 13px; background-image: url("/img/loadingAnimation.gif"); }
      `);
          $q('.e-userjs-score-clear').addEventListener('click', callbacks.clear, false);
          $q('.e-userjs-score-fresh').addEventListener('click', callbacks.refresh, false);
      },
  };
  const bangumiGamePage = {
      ...bangumiAnimePage,
      name: 'bangumi-game',
      searchApi: 'https://bgm.tv/subject_search/{kw}?cat=4',
      expiration: 21,
      pageSelector: [
          {
              selector: 'a.focus.chl[href="/game"]',
          },
      ],
      async getSearchResult(subject) {
          const res = await checkSubjectExist(subject, bgm_origin, SubjectTypeId.game, {
              enableShortenQuery: true,
              disableDate: true,
          });
          if (res) {
              res.url = genBgmUrl(res.url);
          }
          return res;
      },
  };

  function convertHomeSearchItem($item) {
      const dealHref = (href) => {
          if (/^https:\/\/movie\.douban\.com\/subject\/\d+\/$/.test(href)) {
              return href;
          }
          const urlParam = href.split('?url=')[1];
          if (urlParam) {
              return decodeURIComponent(urlParam.split('&')[0]);
          }
          else {
              throw 'invalid href';
          }
      };
      const $title = $item.querySelector('.title h3 > a');
      const href = dealHref($title.getAttribute('href'));
      const $ratingNums = $item.querySelector('.rating-info > .rating_nums');
      let ratingsCount = '';
      let averageScore = '';
      if ($ratingNums) {
          const $count = $ratingNums.nextElementSibling;
          const m = $count.innerText.match(/\d+/);
          if (m) {
              ratingsCount = m[0];
          }
          averageScore = $ratingNums.innerText;
      }
      let greyName = '';
      const $greyName = $item.querySelector('.subject-cast');
      if ($greyName) {
          greyName = $greyName.innerText;
      }
      return {
          name: $title.textContent.trim(),
          greyName: greyName.split('/')[0].replace('原名:', '').trim(),
          releaseDate: (greyName.match(/\d{4}$/) || [])[0],
          url: href,
          score: averageScore,
          count: ratingsCount,
      };
  }
  /**
   * 通过首页搜索的结果
   * @param query 搜索字符串
   */
  async function getHomeSearchResults(query, cat = '1002') {
      const url = `https://www.douban.com/search?cat=${cat}&q=${encodeURIComponent(query)}`;
      console.info('Douban search URL: ', url);
      const rawText = await fetchText(url);
      const $doc = new DOMParser().parseFromString(rawText, 'text/html');
      const items = $doc.querySelectorAll('.search-result > .result-list > .result > .content');
      return Array.prototype.slice
          .call(items)
          .map(($item) => convertHomeSearchItem($item));
  }
  /**
   * 单独类型搜索入口
   * @param query 搜索字符串
   * @param cat 搜索类型
   * @param type 获取传递数据的类型: gm 通过 GM_setValue, message 通过 postMessage
   */
  async function getSubjectSearchResults(query, cat = '1002') {
      const url = `https://search.douban.com/movie/subject_search?search_text=${encodeURIComponent(query)}&cat=${cat}`;
      console.info('Douban search URL: ', url);
      const iframeId = 'e-userjs-search-subject';
      let $iframe = document.querySelector(`#${iframeId}`);
      if (!$iframe) {
          $iframe = document.createElement('iframe');
          $iframe.setAttribute('sandbox', 'allow-forms allow-same-origin allow-scripts');
          $iframe.style.display = 'none';
          $iframe.id = iframeId;
          document.body.appendChild($iframe);
      }
      // 这里不能使用 await 否则数据加载完毕了监听器还没有初始化
      loadIframe($iframe, url, 1000 * 10);
      return await getSearchSubjectByGM();
  }
  /**
   *
   * @param subjectInfo 条目信息
   * @param type 默认使用主页搜索
   * @returns 搜索结果
   */
  async function checkAnimeSubjectExist(subjectInfo, type = 'home_search') {
      let query = (subjectInfo.name || '').trim();
      if (!query) {
          console.info('Query string is empty');
          return Promise.reject();
      }
      let rawInfoList;
      let searchResult;
      const options = {
          sameYear: true,
          keys: ['name', 'greyName'],
      };
      if (type === 'home_search') {
          rawInfoList = await getHomeSearchResults(query);
      }
      else {
          rawInfoList = await getSubjectSearchResults(query);
      }
      searchResult = filterResults(rawInfoList, subjectInfo, options);
      console.info(`Search result of ${query} on Douban: `, searchResult);
      if (searchResult && searchResult.url) {
          return searchResult;
      }
  }

  const doubanAnimePage = {
      name: 'douban-anime',
      href: ['https://movie.douban.com/'],
      searchApi: 'https://www.douban.com/search?cat=1002&q={kw}',
      favicon: 'https://www.douban.com/favicon.ico',
      expiration: 21,
      infoSelector: [
          {
              selector: '#interest_sectl > .rating_wrap',
          },
      ],
      pageSelector: [
          {
              selector: 'body',
              subSelector: '.tags-body',
              keyWord: ['动画', '动漫'],
          },
          {
              selector: '#info',
              subSelector: 'span[property="v:genre"]',
              keyWord: ['动画', '动漫'],
          },
      ],
      getSubjectId(url) {
          const m = url.match(/\/(subject)\/(\d+)/);
          if (m) {
              return `${this.name}_${m[2]}`;
          }
          return '';
      },
      genSubjectUrl(id) {
          return `https://movie.douban.com/subject/${id}/`;
      },
      getSearchResult: checkAnimeSubjectExist,
      getScoreInfo() {
          const $title = $q('#content h1>span');
          const rawName = $title.textContent.trim();
          const keywords = $q('meta[name="keywords"]')?.getAttribute?.('content');
          let name = rawName;
          if (keywords) {
              // 可以考虑剔除第二个关键字里面的 Season 3
              const firstKeyword = keywords.split(',')[0];
              name = rawName.replace(firstKeyword, '').trim();
              // name: rawName.replace(/第.季/, ''),
          }
          const subjectInfo = {
              name,
              score: $q('.ll.rating_num')?.textContent ?? 0,
              count: $q('.rating_people > span')?.textContent ?? 0,
              rawName,
              url: location.href,
          };
          const $date = $q('span[property="v:initialReleaseDate"]');
          if ($date) {
              subjectInfo.releaseDate = $date.textContent.replace(/\(.*\)/, '');
          }
          return subjectInfo;
      },
      insertScoreInfo(page, info) {
          const title = this.getScoreInfo().name;
          const opts = {
              title,
              adjacentSelector: this.infoSelector,
              cls: 'friends_rating_wrap clearbox',
          };
          const wrapDom = getScoreWrapDom(opts.adjacentSelector, opts.cls);
          const rowInfo = genScoreRowInfo(opts.title, page, info);
          const rowStr = `
<div class="e-userjs-score-compare-row rating_content_wrap clearfix">
<strong class="rating_avg">${rowInfo.score}</strong>
<div class="friends">
  <a class="avatar"
  ${BLANK_LINK}
  href="${rowInfo.searchUrl}"
  style="cursor:pointer;"
  title="点击在${rowInfo.name}搜索">
  <img src="${rowInfo.favicon}"/>
  </a>
</div>
<a href="${rowInfo.url}"
  rel="noopener noreferrer nofollow" class="friends_count" target="_blank">
    ${rowInfo.count}
</a>
</div>
`;
          wrapDom.appendChild(htmlToElement(rowStr));
      },
  };

  async function searchAnimeData(subjectInfo) {
      let query = normalizeQuery((subjectInfo.name || '').trim());
      const url = `https://myanimelist.net/search/prefix.json?type=anime&keyword=${encodeURIComponent(query)}&v=1`;
      console.info('myanimelist search URL: ', url);
      const info = await fetchJson(url);
      let startDate = null;
      let items = info.categories[0].items;
      let pageUrl = '';
      let name = '';
      if (subjectInfo.releaseDate) {
          startDate = new Date(subjectInfo.releaseDate);
          for (let i = 0; i < items.length; i++) {
              const item = items[i];
              let aired = null;
              if (item.payload.aired.match('to')) {
                  aired = new Date(item.payload.aired.split('to')[0]);
              }
              else {
                  aired = new Date(item.payload.aired);
              }
              // 选择第一个匹配日期的
              if (startDate.getFullYear() === aired.getFullYear() &&
                  startDate.getMonth() === aired.getMonth()) {
                  pageUrl = item.url;
                  name = item.name;
                  break;
              }
          }
      }
      else if (items && items[0]) {
          name = items[0].name;
          pageUrl = items[0].url;
      }
      if (!pageUrl) {
          throw new Error('No match results');
      }
      let result = {
          name,
          url: pageUrl,
      };
      await randomSleep(200, 100);
      const content = await fetchText(pageUrl);
      const $doc = new DOMParser().parseFromString(content, 'text/html');
      let $score = $doc.querySelector('.fl-l.score');
      if ($score) {
          //siteScoreInfo.averageScore = parseFloat($score.textContent.trim()).toFixed(1)
          result.score = $score.textContent.trim();
          if (result.score === 'N/A') {
              result.score = 0;
          }
          if ($score.dataset.user) {
              result.count = $score.dataset.user.replace(/users|,/g, '').trim();
          }
          else {
              throw new Error('Invalid score info');
          }
      }
      else {
          throw new Error('Invalid results');
      }
      console.info('myanimelist search result: ', result);
      return result;
  }

  const myanimelistPage = {
      name: 'myanimelist',
      href: ['https://myanimelist.net/'],
      searchApi: 'https://myanimelist.net/anime.php?q={kw}&cat=anime',
      favicon: 'https://cdn.myanimelist.net/images/favicon.ico',
      infoSelector: [
          {
              selector: '.anime-detail-header-stats > .stats-block',
          },
      ],
      pageSelector: [
          {
              selector: '.breadcrumb a[href$="myanimelist.net/anime.php"]',
          },
      ],
      getSubjectId(url) {
          const m = url.match(/\/(anime)\/(\d+)/);
          if (m) {
              return `${this.name}_${m[2]}`;
          }
          return '';
      },
      genSubjectUrl(id) {
          return `https://myanimelist.net/anime/${id}`;
      },
      getSearchResult: searchAnimeData,
      getScoreInfo: function () {
          let name = $q('h1-title')?.textContent;
          const info = {
              name: name,
              greyName: name,
              score: $q('span[itemprop="ratingValue"]')?.textContent.trim() ?? 0,
              count: $q('span[itemprop="ratingCount"]')?.textContent.trim() ?? 0,
              url: location.href,
          };
          $qa('.leftside .spaceit_pad > .dark_text').forEach((el) => {
              if (el.innerHTML.includes('Japanese:')) {
                  info.name = el.nextSibling.textContent.trim();
              }
              else if (el.innerHTML.includes('Aired:')) {
                  const aired = el.nextSibling.textContent.trim();
                  if (aired.includes('to')) {
                      const startDate = new Date(aired.split('to')[0].trim());
                      info.releaseDate = formatDate(startDate);
                  }
              }
          });
          return info;
      },
      insertScoreInfo: function (page, info) {
          const title = this.getScoreInfo().name;
          insertScoreCommon(page, info, {
              title,
              adjacentSelector: this.infoSelector,
              cls: 'stats-block',
              style: 'height:auto;',
          });
      },
  };

  function getMilliseconds(opt) {
      if (typeof opt === 'number') {
          const oneDay = 24 * 60 * 60 * 1000;
          return oneDay * opt;
      }
      const d = (opt.dd || 0) + 1;
      return (+new Date(1970, 1, d, opt.hh || 0, opt.mm || 0, opt.ss || 0, opt.ms || 0) -
          +new Date(1970, 1));
  }
  class KvExpiration {
      constructor(engine, prefix, suffix = '-expiration', bucket = '') {
          this.engine = engine;
          this.prefix = prefix;
          this.suffix = suffix;
          this.bucket = bucket;
      }
      genExpirationKey(key) {
          return `${this.prefix}${this.bucket}${key}${this.suffix}`;
      }
      genKey(key) {
          return `${this.prefix}${this.bucket}${key}`;
      }
      flush() {
          this.engine.keys().forEach((key) => {
              if (key.startsWith(`${this.prefix}${this.bucket}`)) {
                  this.engine.remove(key);
              }
          });
      }
      flushExpired() {
          const pre = `${this.prefix}${this.bucket}`;
          this.engine.keys().forEach((key) => {
              if (key.startsWith(pre) && !key.endsWith(this.suffix)) {
                  this.flushExpiredItem(key.replace(pre, ''));
              }
          });
      }
      flushExpiredItem(key) {
          var exprKey = this.genExpirationKey(key);
          let time = this.engine.get(exprKey);
          if (time) {
              if (typeof time !== 'number') {
                  time = parseInt(time);
              }
              if (+new Date() >= time) {
                  this.engine.remove(exprKey);
                  this.engine.remove(this.genKey(key));
                  return true;
              }
          }
          return false;
      }
      set(key, value, opt) {
          this.engine.set(this.genKey(key), value);
          if (opt) {
              const invalidTime = +new Date() + getMilliseconds(opt);
              this.engine.set(this.genExpirationKey(key), invalidTime);
          }
          return true;
      }
      get(key) {
          if (this.flushExpiredItem(key)) {
              return;
          }
          return this.engine.get(this.genKey(key));
      }
      remove(key) {
          this.engine.remove(this.genKey(key));
          this.engine.remove(this.genExpirationKey(key));
      }
  }

  class GmEngine {
      set(key, value) {
          GM_setValue(key, value);
          return true;
      }
      get(key) {
          return GM_getValue(key);
      }
      remove(key) {
          GM_deleteValue(key);
      }
      keys() {
          return GM_listValues();
      }
  }

  const USERJS_PREFIX = 'E_SCORE_';
  const CURRENT_ID_DICT = 'CURRENT_ID_DICT';
  const storage = new KvExpiration(new GmEngine(), USERJS_PREFIX);
  function clearInfoStorage() {
      storage.flush();
  }
  function saveInfo(id, info, expiration) {
      expiration = expiration || 7;
      if (id === '') {
          console.error('invalid id:  ', info);
          return;
      }
      storage.set(id, info, expiration);
  }
  function getInfo(id) {
      if (id) {
          return storage.get(id);
      }
  }
  function getScoreMap(site, id) {
      const currentDict = storage.get(CURRENT_ID_DICT) || {};
      if (currentDict[site] === id) {
          return currentDict;
      }
      return storage.get('DICT_ID' + id) || {};
  }
  function setScoreMap(id, map) {
      storage.set(CURRENT_ID_DICT, map);
      storage.set('DICT_ID' + id, map, 7);
  }

  const site_origin$1 = 'https://ddfan.org/';
  const HEADERS = {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      referer: site_origin$1,
  };
  const favicon$2 = 'https://www.google.com/s2/favicons?domain=ddfan.org';
  function getSearchItem$3($item) {
      const $title = $item.querySelector('h4.media-heading > a');
      const href = new URL($title.getAttribute('href'), site_origin$1).href;
      const infos = $item.querySelectorAll('.tags > span');
      let releaseDate = undefined;
      for (let i = 0; i < infos.length; i++) {
          const el = infos[i];
          if (el.innerHTML.includes('发售日期')) {
              const m = el.textContent.match(/\d{4}-\d\d-\d\d/);
              if (m) {
                  releaseDate = m[0];
              }
          }
      }
      return {
          name: $title.textContent.trim(),
          releaseDate,
          url: href,
          score: 0,
          count: 0,
      };
  }
  async function searchGameData$1(subjectInfo) {
      let query = normalizeQuery((subjectInfo.name || '').trim());
      // fix long name
      if (subjectInfo.name.length > 50) {
          const arr = query.split(' ');
          if (arr[0].length > 10) {
              query = arr[0];
          }
          else {
              query = arr[0] + ' ' + arr[1];
          }
      }
      if (!query) {
          console.info('Query string is empty');
          return Promise.reject();
      }
      let searchResult;
      const options = {
          dateFirst: true,
          keys: ['name'],
      };
      const url = `${site_origin$1}subjects/search?keyword=${encodeURIComponent(query)}`;
      console.info('2dfan search URL: ', url);
      const rawText = await fetchText(url, {
          headers: HEADERS,
      });
      const $doc = new DOMParser().parseFromString(rawText, 'text/html');
      const items = $doc.querySelectorAll('#subjects > li');
      const rawInfoList = Array.prototype.slice
          .call(items)
          .map(($item) => getSearchItem$3($item));
      if (isEnglishName(subjectInfo.name)) {
          if (rawInfoList.every((item) => item.name.toLowerCase().startsWith(query.toLowerCase()))) {
              options.sameDate = true;
          }
      }
      searchResult = filterResults(rawInfoList, subjectInfo, options);
      console.info(`Search result of ${query} on 2dfan: `, searchResult);
      if (searchResult && searchResult.url) {
          randomSleep(200, 50);
          const res = await followSearch(searchResult.url);
          if (res) {
              res.url = searchResult.url;
              return res;
          }
          return searchResult;
      }
  }
  async function followSearch(url) {
      const rawText = await fetchText(url, {
          headers: {
              accept: HEADERS.accept,
              referer: url,
          },
      });
      window._parsedEl = new DOMParser().parseFromString(rawText, 'text/html');
      const res = getSearchSubject$3();
      window._parsedEl = undefined;
      return res;
  }
  function getSearchSubject$3() {
      const $table = $q('.media-body.control-group > .control-group');
      const name = $q('.navbar > h3').textContent.trim();
      const info = {
          name: name,
          greyName: name,
          score: $q('.rank-info.control-group .score')?.textContent.trim() ?? 0,
          count: 0,
          url: location.href,
      };
      const $count = $q('.rank-info.control-group .muted');
      if ($count) {
          info.count = $count.textContent.trim().replace('人评价', '');
          if (info.count.includes('无评分')) {
              info.count = '-';
          }
      }
      $table.querySelectorAll('p.tags').forEach((el) => {
          if (el.innerHTML.includes('发售日期')) {
              const m = el.textContent.match(/\d{4}-\d\d-\d\d/);
              if (m) {
                  info.releaseDate = m[0];
              }
          }
          else if (el.innerHTML.includes('又名：')) {
              info.greyName = el.querySelector('.muted').textContent;
          }
      });
      return info;
  }

  const twodfanPage = {
      name: '2dfan',
      href: [site_origin$1],
      searchApi: `${site_origin$1}subjects/search?keyword={kw}`,
      favicon: favicon$2,
      expiration: 21,
      infoSelector: [
          {
              selector: '.rank-info.control-group',
          },
      ],
      pageSelector: [
          {
              selector: '.navbar > h3',
          },
      ],
      getSubjectId(url) {
          const m = url.match(/\/(subjects\/)(\d+)/);
          if (m) {
              return `${this.name}_${m[2]}`;
          }
          return '';
      },
      genSubjectUrl(id) {
          return `${site_origin$1}/subjects/${id}`;
      },
      getSearchResult: searchGameData$1,
      getScoreInfo: getSearchSubject$3,
      insertScoreInfo: function (page, info) {
          const title = $q('.navbar > h3').textContent.trim();
          insertScoreCommon(page, info, {
              title,
              adjacentSelector: this.infoSelector,
              cls: '',
              style: '',
          });
      },
  };

  const favicon$1 = 'https://vndb.org/favicon.ico';
  function reviseQueryVNDB(name) {
      const titleDict = {
          'D.C.P.C. ～ダ・カーポ プラスコミュニケーション～': 'D.C.～ダ・カーポ～',
          'LOVE FOREVER 1 Progress': 'LOVE FOREVER',
      };
      const userTitleDict = window.VNDB_REVISE_QUERY_DICT || {};
      if (userTitleDict[name]) {
          return userTitleDict[name];
      }
      if (titleDict[name]) {
          return titleDict[name];
      }
  }
  function reviseTitle$1(title) {
      const titleDict = {
          'Lost Colors': 'ロストカラーズ',
          'レベル-F': 'Lv-F',
          'カオスヘッド らぶChu☆Chu!': 'CHAOS;HEAD らぶChu☆Chu!',
          'ドキドキ文芸部!': 'Doki Doki Literature Club!',
          // https://vndb.org/v13666
          '凍京NECRO＜トウキョウ・ネクロ＞': '凍京NECRO',
          // https://vndb.org/v4102
          'Ｓｕｍｍｅｒラディッシュ・バケーション!!2': 'サマー・ラディッシュ・バケーション!! 2',
          'ランス4　－教団の遺産－': 'Rance IV -教団の遺産-',
          'ランス５Ｄ －ひとりぼっちの女の子－': 'Rance5D ひとりぼっちの女の子',
          ＲａｇｎａｒｏｋＩｘｃａ: 'Ragnarok Ixca',
          'グリザイアの果実 -LE FRUIT DE LA GRISAIA-': 'グリザイアの果実',
          'ブラック ウルヴス サーガ -ブラッディーナイトメア-': 'Black Wolves Saga -Bloody Nightmare-',
          'ファミコン探偵倶楽部PartII うしろに立つ少女': 'ファミコン探偵倶楽部 うしろに立つ少女',
          'Rance Ⅹ -決戦-': 'ランス10',
          'PARTS ─パーツ─': 'PARTS',
      };
      const userTitleDict = window.VNDB_REVISE_TITLE_DICT || {};
      if (userTitleDict[title]) {
          return userTitleDict[title];
      }
      if (titleDict[title]) {
          return titleDict[title];
      }
      const shortenTitleDict = {
          淫獣学園: '淫獣学園',
      };
      for (const [key, val] of Object.entries(shortenTitleDict)) {
          if (title.includes(key)) {
              return val;
          }
      }
      return title.replace(' x ', ' ').replace(/　/g, ' ');
  }
  function getSearchItem$2($item) {
      const $title = $item.querySelector('.tc_title > a');
      const href = new URL($title.getAttribute('href'), 'https://vndb.org/').href;
      const $rating = $item.querySelector('.tc_rating');
      const rawName = $title.getAttribute('title');
      const info = {
          name: reviseTitle$1(rawName),
          rawName,
          url: href,
          count: 0,
          releaseDate: $item.querySelector('.tc_rel').textContent,
      };
      const score = $rating.firstChild.textContent;
      if (!isNaN(Number(score))) {
          info.score = score;
      }
      const m = $rating.textContent.match(/\((\d+)\)/);
      if (m) {
          info.count = m[1];
      }
      return info;
  }
  async function searchSubject$1(subjectInfo, opts = {}) {
      let query = opts.query || subjectInfo.name;
      if (!query) {
          console.info('Query string is empty');
          return Promise.reject();
      }
      let res;
      const url = `https://vndb.org/v?sq=${encodeURIComponent(query)}`;
      console.info('vndb search URL: ', url);
      const rawText = await fetchText(url, {
          headers: {
              referer: 'https://vndb.org/',
          },
      });
      const $doc = new DOMParser().parseFromString(rawText, 'text/html');
      const $vndetails = $doc.querySelector('.vndetails');
      // 重定向
      if ($vndetails) {
          window._parsedEl = $doc;
          const res = getSearchSubject$2();
          res.url = $doc.querySelector('head > base').getAttribute('href');
          window._parsedEl = undefined;
          return res;
      }
      const items = $doc.querySelectorAll('.browse.vnbrowse table > tbody > tr');
      const rawInfoList = Array.prototype.slice
          .call(items)
          .map(($item) => getSearchItem$2($item));
      const filterOpts = {
          keys: ['name'],
      };
      if (rawInfoList.length > 20) {
          // fix: ソード
          if (isKatakanaName(subjectInfo.name)) {
              return filterResults(rawInfoList, subjectInfo, {
                  ...filterOpts,
                  score: 0.1,
                  sameDate: true,
              });
          }
          // fix: Ib
          if (/^[a-zA-Z]+$/.test(subjectInfo.name)) {
              return filterResults(rawInfoList, subjectInfo, { ...filterOpts, dateFirst: true, sameName: true });
          }
          // fix: "ONE." different date
          let res = rawInfoList.find((item) => item.name === subjectInfo.name && isEqualDate(item.releaseDate, subjectInfo.releaseDate, 'm'));
          if (res) {
              return res;
          }
          return filterResults(rawInfoList, subjectInfo, { ...filterOpts, sameDate: true });
      }
      res = filterResults(rawInfoList, subjectInfo, filterOpts);
      if (res && res.url) {
          console.info(`Search result of ${query} on vndb: `, res);
          return res;
      }
      if (opts.shortenQuery) {
          const name = subjectInfo.name;
          // have sub title
          if (!res && getAliasByName(name).length > 0) {
              const changedName = removeSubTitle(name);
              // fix: 痕 -きずあと-
              res = rawInfoList.find((item) => item.name === changedName);
              if (res) {
                  return res;
              }
          }
          // @TODO maybe skip different date
          return filterResults(rawInfoList, { ...subjectInfo, name: opts.query }, {
              keys: ['name'],
              sameDate: true,
          });
      }
      if (opts.query) {
          res = filterResults(rawInfoList, { ...subjectInfo, name: opts.query }, filterOpts);
      }
      return res;
  }
  function normalizeQueryVNDB(query) {
      query = replaceToASCII(query);
      query = removePairs(query);
      query = replaceCharsToSpace(query);
      return query;
  }
  async function searchGameData(info) {
      const revisedName = reviseQueryVNDB(info.name);
      if (revisedName === SKIP_SEARCH_KEY) {
          console.log('[vndb] skip search', info.name);
          return;
      }
      if (revisedName) {
          let result = await searchSubject$1({ ...info, name: revisedName });
          return patchSearchResult(result);
      }
      // fix EXTRA VA MIZUNA
      if (isEnglishName(info.name)) {
          let result = await searchSubject$1(info);
          return patchSearchResult(result);
      }
      const querySet = new Set();
      let query = normalizeQueryVNDB(info.name);
      let result = await searchSubject$1(info, { query });
      querySet.add(query);
      if (!result) {
          await sleep(100);
          query = getShortenedQuery(query);
          if (querySet.has(query)) {
              return result;
          }
          result = await searchSubject$1(info, { shortenQuery: true, query });
      }
      return patchSearchResult(result);
  }
  async function patchSearchResult(result) {
      // when score is empty, try to extract score from page
      if (result && result.url && Number(result.count) > 0 && isNaN(Number(result.score))) {
          const rawText = await fetchText(result.url);
          window._parsedEl = new DOMParser().parseFromString(rawText, 'text/html');
          const res = getSearchSubject$2();
          res.url = result.url;
          window._parsedEl = undefined;
          return res;
      }
      else {
          return result;
      }
  }
  function getSearchSubject$2() {
      let name = $q('tr.title span[lang="ja"]')?.textContent;
      if (!name) {
          name = $q('tr.title td:nth-of-type(2) > span').textContent;
      }
      const info = {
          name,
          rawName: name,
          score: $q('.rank-info.control-group .score')?.textContent.trim() ?? 0,
          count: 0,
          url: location.href,
      };
      const vote = $q('.votegraph tfoot > tr > td')?.textContent.trim();
      if (vote) {
          const v = vote.match(/^\d+/);
          if (v) {
              info.count = v[0];
          }
          const s = vote.match(/(\d+(\.\d+)?)(?= average)/);
          if (s) {
              info.score = s[1];
          }
      }
      let alias = [];
      // get release date
      for (const elem of $qa('table.releases tr')) {
          if (elem.querySelector('.icon-rtcomplete')) {
              info.releaseDate = elem.querySelector('.tc1')?.innerText;
              const jaTitle = elem.querySelector('.tc4 > [lang="ja-Latn"]')?.title;
              if (jaTitle && !jaTitle.includes(info.name)) {
                  alias.push(normalizeEditionName(jaTitle));
              }
              break;
          }
      }
      const $title = $q('tr.title td:nth-of-type(2)')?.cloneNode(true);
      if ($title) {
          $title.querySelector('span')?.remove();
          const enName = $title.textContent.trim();
          if (enName) {
              alias.push(enName);
          }
      }
      alias.push(...getAliasVNDB(name));
      // find alias
      for (const $el of $qa('.vndetails > table tr > td:first-child')) {
          if ($el.textContent.includes('Aliases')) {
              alias.push(...$el.nextElementSibling.textContent.split(',').map((s) => s.trim()));
              break;
          }
      }
      if (alias.length > 0) {
          const newAlias = [];
          for (const s of alias) {
              // skip vol.1  vol1  vol2
              if (/vol\.?\d+/i.test(s)) {
                  continue;
              }
              // skip abbreviation
              if (/^[A-Z]{1,}$/.test(s)) {
                  continue;
              }
              if (!newAlias.includes(s)) {
                  newAlias.push(s);
              }
          }
          info.alias = newAlias;
      }
      // final step
      info.name = reviseTitle$1(info.name);
      return info;
  }
  // 注意使用 alias 时，太短的alias会干扰搜索结果
  // 吸血美人 vol.1 ---->  vol.1 就会干扰搜索结果
  function getAliasVNDB(name) {
      name = name.replace(/　/g, ' ');
      const alias = getAliasByName(name) || [];
      if (alias && alias.length > 0) {
          return alias;
      }
      return alias;
  }

  const vndbPage = {
      name: 'vndb',
      href: ['https://vndb.org/'],
      searchApi: 'https://vndb.org/v?sq={kw}',
      favicon: favicon$1,
      expiration: 21,
      infoSelector: [
          {
              selector: '.vnimg > :first-child',
          },
      ],
      pageSelector: [
          {
              selector: '.tabselected > a[href^="/v"]',
          },
      ],
      getSubjectId(url) {
          const m = url.match(/\/(v)(\d+)/);
          if (m) {
              return `${this.name}_${m[2]}`;
          }
          return '';
      },
      genSubjectUrl(id) {
          return `https://vndb.org/subjects/${id}`;
      },
      getSearchResult: searchGameData,
      getScoreInfo: getSearchSubject$2,
      insertScoreInfo: function (page, info) {
          const title = this.getScoreInfo().name;
          const opts = {
              title,
              adjacentSelector: this.infoSelector,
          };
          const wrapDom = getScoreWrapDom(opts.adjacentSelector);
          const rowInfo = genScoreRowInfo(opts.title, page, info);
          // refuse blob:<URL>
          rowInfo.favicon = page.favicon;
          insertScoreRow(wrapDom, rowInfo);
      },
  };

  var ErogamescapeCategory;
  (function (ErogamescapeCategory) {
      ErogamescapeCategory["game"] = "game";
      ErogamescapeCategory["brand"] = "brand";
      ErogamescapeCategory["creater"] = "creater";
      ErogamescapeCategory["music"] = "music";
      ErogamescapeCategory["pov"] = "pov";
      ErogamescapeCategory["character"] = "character";
  })(ErogamescapeCategory || (ErogamescapeCategory = {}));
  // https://erogamescape.org/favicon.ico
  const favicon = 'https://www.google.com/s2/favicons?domain=erogamescape.org';
  // 'http://erogamescape.org',
  const site_origin = 'https://erogamescape.org';
  function reviseQuery(name) {
      const titleDict = {
          // 'ONE.': 'ONE ～輝く季節へ～',  // ONE. remake
          '月影の鎖～紅に染まる番外編～': '月影の鎖?紅に染まる番外編',
          '異世界転生したら大魔法使いの推しになりました': '異世界転生したら大魔法使いの推しになりました',
          // 'Musicus-ムジクス-': 'Musicus-ムジクス-',
      };
      const userTitleDict = window.EGS_REVISE_QUERY_DICT || {};
      if (userTitleDict[name]) {
          return userTitleDict[name];
      }
      if (titleDict[name]) {
          return titleDict[name];
      }
  }
  function reviseTitle(title) {
      const titleDict = {
      // @TODO
      };
      const userTitleDict = window.EGS_REVISE_TITLE_DICT || {};
      if (userTitleDict[title]) {
          return userTitleDict[title];
      }
      if (titleDict[title]) {
          return titleDict[title];
      }
      const shortenTitleDict = {};
      for (const [key, val] of Object.entries(shortenTitleDict)) {
          if (title.includes(key)) {
              return val;
          }
      }
      return title;
  }
  function getSearchItem$1($item) {
      const $title = $item.querySelector('td:nth-child(1) > a');
      const href = $title.getAttribute('href');
      const $name = $item.querySelector('td:nth-child(1)');
      // remove tooltip text
      $name.querySelector('div.tooltip')?.remove();
      const info = {
          name: $name.innerText,
          url: href,
          count: $item.querySelector('td:nth-child(6)')?.textContent ?? 0,
          score: $item.querySelector('td:nth-child(4)')?.textContent ?? 0,
          releaseDate: $item.querySelector('td:nth-child(3)').textContent,
      };
      return info;
  }
  function normalizeQueryEGS(query) {
      let newQuery = query;
      newQuery = newQuery.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
          return String.fromCharCode(s.charCodeAt(0) - 65248);
      });
      newQuery = newQuery.replace(/^(.*?～)(.*)(～[^～]*)$/, function (_, p1, p2, p3) {
          return p1.replace(/～/g, ' ') + p2 + p3.replace(/～/g, ' ');
      });
      newQuery = removePairs(replaceToASCII(newQuery), ['‐‐'])
          .replace(/[-－―～〜━\[\]『』~'…！？。]/g, ' ')
          // keep "." or not?
          .replace(/[♥❤☆\/♡★‥○⁉,【】◆●∽＋‼＿◯※♠×▼％#∞’&!:＇"＊\*＆［］<>＜＞`_「」¨／◇：♪･@＠]/g, ' ')
          .replace(/[、，△《》†〇\/·;^‘“”√≪≫＃→♂?%~■‘〈〉Ω♀⇒≒§♀⇒←∬🕊¡Ι≠±『』♨❄—~Σ⇔↑↓‡▽□』〈〉＾]/g, ' ')
          .replace(/[─|+．・]/g, ' ')
          .replace(/°C/g, '℃')
          .replace(/[①②③④⑤⑥⑦⑧⑨]/g, ' ')
          .replace(/[¹²³⁴⁵⁶⁷⁸⁹⁰]/g, ' ')
          .replace(/\.\.\./g, ' ')
          .replace(/～っ.*/, '');
      // 	White x Red --->  	White Red
      newQuery = newQuery.replace(/ x /, ' ');
      newQuery = newQuery.replace(/\s{2,}/g, ' ');
      // return getShortenedQuery(newQuery);
      return newQuery;
  }
  async function getSubjectListBySearch(query, type = ErogamescapeCategory.game) {
      const url = `${site_origin}/~ap2/ero/toukei_kaiseki/kensaku.php?category=${type}&word_category=name&word=${encodeURIComponent(query)}&mode=normal`;
      console.info('search erogamescape subject URL: ', url);
      const rawText = await fetchText(url);
      const $doc = new DOMParser().parseFromString(rawText, 'text/html');
      const items = $doc.querySelectorAll('#result table tr:not(:first-child)');
      return [...items].map(($item) => getSearchItem$1($item));
  }
  function patchResultURL(result) {
      const site_search_url = `${site_origin}/~ap2/ero/toukei_kaiseki/kensaku.php`;
      // relative url to absolute
      const url = new URL(result.url, site_search_url).href;
      result.url = url;
  }
  async function followSearchSubject(result) {
      if (!result)
          return;
      patchResultURL(result);
      // await sleep(50)
      const rawText = await fetchText(result.url);
      window._parsedEl = new DOMParser().parseFromString(rawText, 'text/html');
      const res = getSearchSubject$1();
      res.url = result.url;
      window._parsedEl = undefined;
      return res;
  }
  async function searchSubject(subjectInfo, type = ErogamescapeCategory.game, opts = {}) {
      let query = opts.query || subjectInfo.name;
      const rawInfoList = await getSubjectListBySearch(query, type);
      let res;
      const fuseOptions = {
          sortCount: true,
          keys: ['name'],
      };
      if (opts.shortenQuery) {
          res = findResultByMonth(rawInfoList, subjectInfo);
          if (!res) {
              res = filterResults(rawInfoList, subjectInfo, fuseOptions);
          }
      }
      else {
          const newOpts = {
              ...fuseOptions,
              sameName: false,
              dateFirst: false,
          };
          // fix: なついろ; @TODO need more test
          if (isSingleJpSegment(subjectInfo.name) && rawInfoList.length > 6) {
              newOpts.dateFirst = true;
              newOpts.sameName = true;
          }
          if (isEnglishName(subjectInfo.name)) {
              newOpts.score = 0.1;
              // fix: Little Lover;
              // @TODO need more test, it would skip right results with different date
              if (rawInfoList.every(item => item.name.startsWith(subjectInfo.name))) {
                  newOpts.sameDate = true;
              }
          }
          if (opts.query) {
              // fix: query is "Musicus" for game "Musicus-ムジクス-"
              // fix: "ONE."
              if (/^[a-zA-Z.]+$/.test(opts.query)) {
                  newOpts.sameDate = true;
              }
          }
          res = filterResults(rawInfoList, subjectInfo, newOpts);
      }
      console.info(`Search result of ${query} on erogamescape: `, res);
      return res;
  }
  function canShortenQuery(query) {
      if (isEnglishName(query)) {
          return false;
      }
      if (isKatakanaName(query)) {
          return false;
      }
      return true;
  }
  async function searchGameSubject$1(info) {
      let res;
      const querySet = new Set();
      const revisedQueryStr = reviseQuery(info.name);
      if (revisedQueryStr === SKIP_SEARCH_KEY) {
          console.log('[erogamescape] skip search', info.name);
          return;
      }
      if (revisedQueryStr) {
          return await searchAndFollow(info, { query: revisedQueryStr });
      }
      const normalizedStr = normalizeQueryEGS(info.name);
      // fix フィギュア ～奪われた放課後～
      const subTitle = normalizeQueryEGS(getHiraganaSubTitle(info.name));
      if (subTitle) {
          res = await searchAndFollow(info, {
              shortenQuery: true,
              query: subTitle,
          });
          querySet.add(subTitle);
      }
      else if (isEnglishName(info.name)) {
          res = await searchAndFollow(info);
          querySet.add(info.name);
      }
      else {
          res = await searchAndFollow(info, { query: normalizedStr });
          querySet.add(normalizedStr);
      }
      if (res) {
          return res;
      }
      await sleep(100);
      let shortenedStr = '';
      if (canShortenQuery(normalizedStr)) {
          shortenedStr = getShortenedQuery(normalizedStr);
          // skip length <= 3 short query
          if (!querySet.has(shortenedStr) && shortenedStr.length > 3) {
              res = await searchAndFollow(info, { shortenQuery: true, query: shortenedStr });
              querySet.add(shortenedStr);
              if (res) {
                  return res;
              }
          }
      }
      await sleep(200);
      if (shortenedStr.length > 3) {
          const segmenter = new lib();
          const segs = segmenter.segment(shortenedStr);
          if (segs && segs.length > 2) {
              const query = segs[0] + '?' + segs[segs.length - 1];
              if (!querySet.has(query)) {
                  console.info('start use segment search with query: ', query);
                  res = await searchAndFollow(info, { shortenQuery: true, query });
                  querySet.add(query);
                  if (res) {
                      return res;
                  }
              }
          }
      }
      await sleep(200);
      let queryList = [];
      if (info.alias) {
          queryList = info.alias;
      }
      for (const s of queryList) {
          let queryStr = normalizeQueryEGS(s);
          let shortenQuery = false;
          if (canShortenQuery(queryStr)) {
              queryStr = getShortenedQuery(queryStr);
              shortenQuery = true;
          }
          if (querySet.has(queryStr)) {
              continue;
          }
          const res = await searchAndFollow(info, { shortenQuery, query: queryStr });
          querySet.add(queryStr);
          if (res) {
              return res;
          }
          await sleep(500);
      }
  }
  // search and follow the URL of search result
  async function searchAndFollow(info, opts = {}) {
      const result = await searchSubject(info, ErogamescapeCategory.game, opts);
      return await followSearchSubject(result);
  }
  function getSearchSubject$1() {
      const $title = $q('#soft-title > .bold');
      const rawName = normalizeEditionName($title.textContent.trim());
      const title = reviseTitle(rawName);
      let name = rawName;
      if (title !== rawName) {
          name = title;
      }
      const info = {
          name,
          rawName,
          score: $q('#average > td')?.textContent.trim() ?? 0,
          count: $q('#count > td')?.textContent.trim() ?? 0,
          url: location.href,
          releaseDate: $q('#sellday > td')?.textContent.trim(),
      };
      return info;
  }

  const erogamescapePage = {
      name: 'erogamescape',
      href: ['https://erogamescape.org/', 'https://erogamescape.dyndns.org/'],
      searchApi: 'https://erogamescape.org/~ap2/ero/toukei_kaiseki/kensaku.php?category=game&word_category=name&word={kw}&mode=normal',
      favicon: favicon,
      expiration: 21,
      infoSelector: [
          {
              selector: '#basic_information_table',
          },
          {
              selector: '#basic_infomation_table',
          },
      ],
      pageSelector: [
          {
              selector: '#soft-title',
          },
      ],
      getSubjectId(url) {
          const m = url.match(/(game=)(\d+)/);
          if (m) {
              return `${this.name}_${m[2]}`;
          }
          return '';
      },
      genSubjectUrl(id) {
          return `https://erogamescape.org/~ap2/ero/toukei_kaiseki/game.php?game=${id}`;
      },
      getSearchResult: searchGameSubject$1,
      getScoreInfo: getSearchSubject$1,
      insertScoreInfo: function (page, info) {
          const title = normalizeQueryEGS(this.getScoreInfo().name);
          insertScoreCommon(page, info, {
              title,
              adjacentSelector: this.infoSelector,
              cls: '',
              style: '',
          });
      },
  };

  function getSearchSubject() {
      const $title = $q('.body-top_info_title > h2');
      const info = {
          name: $title.textContent.trim(),
          score: 0,
          count: '-',
          url: location.href,
      };
      const topTableSelector = {
          selector: 'table',
          subSelector: 'tr > th',
          sibling: true,
      };
      const $d = findElement({
          ...topTableSelector,
          keyWord: '発売日',
      });
      if ($d) {
          info.releaseDate = dealDate($d.textContent.split('日')[0]);
      }
      return info;
  }
  function getSearchItem($item) {
      const $title = $item.querySelector('.product-title');
      const href = $item.querySelector('a.product-body').getAttribute('href');
      const info = {
          name: $title.textContent,
          url: href,
          count: '-',
          score: 0,
      };
      const $d = $item.querySelector('.product-date > p');
      if ($d) {
          info.releaseDate = dealDate($d.textContent.split('日')[0]);
      }
      return info;
  }
  async function searchGameSubject(info) {
      const query = normalizeQuery(info.name);
      const url = `https://moepedia.net/search/result/?s=${query}&t=on`;
      const rawText = await fetchText(url);
      const $doc = new DOMParser().parseFromString(rawText, 'text/html');
      const items = $doc.querySelectorAll('.sw-Products .sw-Products_Item');
      const rawInfoList = [...items].map(($item) => getSearchItem($item));
      const res = filterResults(rawInfoList, info, {
          keys: ['name'],
      });
      console.info(`Search result of ${info.name} on moepedia: `, res);
      if (res && res.url) {
          // 相对路径需要设置一下
          res.url = new URL(res.url, url).href;
          return res;
      }
  }

  const moepediaPage = {
      name: 'moepedia',
      href: ['https://moepedia.net/'],
      searchApi: 'https://moepedia.net/search/result/?s={kw}&t=on',
      favicon: 'https://moepedia.net/wp/wp-content/themes/moepedia/assets/images/common/common/favicon.ico',
      expiration: 21,
      infoSelector: [
          {
              selector: '.body-top_image_wrapper',
          },
      ],
      pageSelector: [
          {
              selector: '.body-top_info_title h2',
          },
      ],
      getSubjectId(url) {
          const m = url.match(/(game\/)(\d+)/);
          if (m) {
              return `${this.name}_${m[2]}`;
          }
          return '';
      },
      genSubjectUrl(id) {
          return `https://moepedia.net/game/${id}/`;
      },
      insertScoreInfo: function (page, info) {
          const title = $q('.body-top_info_title > h2').textContent.trim();
          insertScoreCommon(page, info, {
              title,
              adjacentSelector: this.infoSelector,
          });
      },
      getSearchResult: searchGameSubject,
      getScoreInfo: getSearchSubject,
  };

  const animePages = [
      bangumiAnimePage,
      doubanAnimePage,
      myanimelistPage,
      anidbPage,
  ];
  const gamePages = [
      bangumiGamePage,
      twodfanPage,
      vndbPage,
      erogamescapePage,
      moepediaPage,
  ];
  const BGM_UA = 'e_user_bgm_ua';
  var g_hide_game_score_flag = GM_getValue('e_user_hide_game_score') || '';
  var g_game_pages_conf = GM_getValue('e_user_game_pages_conf') || {};
  if (GM_registerMenuCommand) {
      GM_registerMenuCommand('clear cache', () => {
          clearInfoStorage();
          alert('cache cleared');
      }, 'c');
      GM_registerMenuCommand('refresh score', () => {
          document.querySelector('.e-userjs-score-compare')?.remove();
          initPage(animePages, true);
          !g_hide_game_score_flag && initPage(gamePages, true);
      }, 'c');
      GM_registerMenuCommand('设置Bangumi UA', () => {
          var p = prompt('设置 Bangumi UA', '');
          GM_setValue(BGM_UA, p);
      });
      GM_registerMenuCommand('设置对话框', () => {
          // g_hide_game_score_flag = prompt(
          //   '设置不为空时隐藏游戏评分',
          //   g_hide_game_score_flag
          // );
          // GM_setValue('e_user_hide_game_score', g_hide_game_score_flag);
          showConfigDialog();
      });
  }
  function showConfigDialog() {
      const gamePagesFormStr = gamePages.map((page) => {
          return `<div>
      <input type="checkbox" id="e-user-game-pages-${page.name}">
      <label for="e-user-game-pages-${page.name}">${page.name}</label>
    </div>`;
      }).join('\n');
      const $dialog = htmlToElement(`
<dialog>
  <div class="game-option-container" style="color: #000">
    <p style="color: #f09199; margin-bottom: 10px">游戏评分设置</p>
    <hr />
    <div>
      <input type="checkbox" id="e-user-hide-game-score">
      <label for="e-user-hide-game-score">隐藏游戏评分</label>
    </div>
    <hr />
    <p style="color: #00B41E;">是否后台搜索评分</p>
    ${gamePagesFormStr}
  </div>
  <div style="margin-top: 10px">
    <button autofocus>Close</button>
  </div>
</dialog>
`);
      $dialog.style.cssText = 'width: 300px; padding: 20px; margin: auto;';
      var g_hide_game_score_flag = GM_getValue('e_user_hide_game_score');
      g_game_pages_conf = GM_getValue('e_user_game_pages_conf') || {};
      if (g_hide_game_score_flag) {
          $dialog.querySelector('#e-user-hide-game-score').checked = true;
      }
      gamePages.forEach((page) => {
          const conf = g_game_pages_conf[page.name] || {};
          $dialog.querySelector(`#e-user-game-pages-${page.name}`).checked = conf.hide ? false : true;
      });
      $dialog.querySelector('.game-option-container').addEventListener('change', (e) => {
          if (e.target.id === 'e-user-hide-game-score') {
              g_hide_game_score_flag = e.target.checked ? '1' : undefined;
              GM_setValue('e_user_hide_game_score', g_hide_game_score_flag);
          }
          else if (e.target.id?.startsWith('e-user-game-pages-')) {
              const name = e.target.id.replace('e-user-game-pages-', '');
              const conf = g_game_pages_conf[name] || {};
              conf.hide = !e.target.checked;
              g_game_pages_conf[name] = conf;
              GM_setValue('e_user_game_pages_conf', g_game_pages_conf);
          }
      });
      document.body.appendChild($dialog);
      $dialog.showModal();
      $dialog.querySelector('button').addEventListener('click', () => {
          $dialog.close();
          $dialog.remove();
      });
  }
  function getPageIdxByHost(pages, host) {
      const idx = pages.findIndex((obj) => {
          if (Array.isArray(obj.href)) {
              return obj.href.some((href) => href.includes(host));
          }
          else {
              return obj.href.includes(host);
          }
      });
      return idx;
  }
  async function insertScoreRows(curPage, pages, curInfo, map, tasks) {
      for (const page of pages) {
          if (page.name === curPage.name || page.type === 'info') {
              continue;
          }
          let searchResult = getInfo(map[page.name]);
          if (!searchResult) {
              try {
                  searchResult = await Promise.race([
                      page.getSearchResult(curInfo),
                      new Promise((_, reject) => setTimeout(() => reject(new Error(`${page.name} search timeout`)), 10000)),
                  ]);
              }
              catch (error) {
                  console.error(error);
              }
              tasks.push({
                  page,
                  info: searchResult || { name: curInfo.name, url: '' },
              });
          }
          curPage.insertScoreInfo(page, searchResult);
      }
  }
  async function refreshScore(curPage, pages, force = false) {
      const saveTask = [];
      const curInfo = curPage.getScoreInfo();
      saveTask.push({
          page: curPage,
          info: curInfo,
      });
      const subjectId = curPage.getSubjectId(curInfo.url);
      let map = { [curPage.name]: subjectId };
      if (!force) {
          const scoreMap = getScoreMap(curPage.name, subjectId);
          map = { ...scoreMap, [curPage.name]: subjectId };
      }
      if (force) {
          document
              .querySelectorAll('.e-userjs-score-compare')
              .forEach((el) => el.remove());
      }
      await insertScoreRows(curPage, pages, curInfo, map, saveTask);
      saveTask.forEach((t) => {
          const { page, info } = t;
          if (info && info.url) {
              const key = page.getSubjectId(info.url);
              saveInfo(key, info, page.expiration);
              map[page.name] = key;
          }
          else {
              const key = `${page.name}_${info.name}`;
              saveInfo(key, { url: '', name: '' }, page.expiration);
              map[page.name] = key;
          }
      });
      setScoreMap(subjectId, map);
  }
  function isValidPage(curPage) {
      const $page = findElement(curPage.pageSelector);
      if (!$page)
          return false;
      const $info = findElement(curPage.infoSelector);
      if (!$info)
          return false;
      return true;
  }
  function insertControlDOM(curPage, pages) {
      if (curPage.controlSelector) {
          const $ctrl = findElement(curPage.controlSelector);
          curPage?.insertControlDOM?.($ctrl, {
              clear: clearInfoStorage,
              refresh: () => refreshScore(curPage, pages, true),
          });
      }
  }
  function initSiteConfig() {
      const ua = GM_getValue(BGM_UA);
      if (ua) {
          addSiteOption('bgm.tv', {
              headers: {
                  'user-agent': ua,
              },
          });
          addSiteOption('bangumi.tv', {
              headers: {
                  'user-agent': ua,
              },
          });
          addSiteOption('chii.in', {
              headers: {
                  'user-agent': ua,
              },
          });
      }
  }
  async function initPage(pages, force = false) {
      const idx = getPageIdxByHost(pages, location.host);
      if (idx === -1)
          return;
      const curPage = pages[idx];
      if (!isValidPage(curPage))
          return;
      insertControlDOM(curPage, pages);
      initSiteConfig();
      refreshScore(curPage, pages, force);
  }
  // user config for revising title
  window.VNDB_REVISE_TITLE_DICT = {
  // your config
  };
  window.EGS_REVISE_TITLE_DICT = {
  // your config
  };
  window.VNDB_REVISE_QUERY_DICT = {
  // for example: skip search with 'does not exist query'
  // 'does not exist query': 'SCH_SKIP_SEARCH',
  };
  window.EGS_REVISE_QUERY_DICT = {};
  initPage(animePages);
  if (!g_hide_game_score_flag) {
      initPage(gamePages.map((p) => {
          const conf = g_game_pages_conf[p.name] || {};
          if (conf.hide) {
              return {
                  ...p,
                  type: 'info',
              };
          }
          return p;
      }));
  }

})();
