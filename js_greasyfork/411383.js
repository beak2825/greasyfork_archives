// ==UserScript==
// @name        migrate douban collection to bangumi
// @name:zh-CN  迁移豆瓣收藏到 Bangumi
// @namespace   https://github.com/22earth
// @description migrate douban collection to bangumi and export douban collection
// @description:zh-cn 迁移豆瓣动画收藏到 Bangumi.
// @include     /^https?:\/\/(bangumi|bgm|chii)\.(tv|in)\/?$/
// @include     https://movie.douban.com/mine
// @include     https://search.douban.com/movie/subject_search*
// @author      22earth
// @homepage    https://github.com/22earth/gm_scripts
// @version     0.0.9
// @run-at      document-end
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_getResourceText
// @require     https://cdnjs.cloudflare.com/ajax/libs/fuse.js/6.4.0/fuse.min.js
// @resource    bangumiDataURL https://unpkg.com/bangumi-data@0.3/dist/data.json
// @downloadURL https://update.greasyfork.org/scripts/411383/migrate%20douban%20collection%20to%20bangumi.user.js
// @updateURL https://update.greasyfork.org/scripts/411383/migrate%20douban%20collection%20to%20bangumi.meta.js
// ==/UserScript==

(function () {
  'use strict';

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

  var SubjectTypeId;
  (function (SubjectTypeId) {
      SubjectTypeId[SubjectTypeId["book"] = 1] = "book";
      SubjectTypeId[SubjectTypeId["anime"] = 2] = "anime";
      SubjectTypeId[SubjectTypeId["music"] = 3] = "music";
      SubjectTypeId[SubjectTypeId["game"] = 4] = "game";
      SubjectTypeId[SubjectTypeId["real"] = 6] = "real";
      SubjectTypeId["all"] = "all";
  })(SubjectTypeId || (SubjectTypeId = {}));

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
  const typeIdDict$1 = {
      dropped: {
          name: '抛弃',
          id: '5',
      },
      on_hold: {
          name: '搁置',
          id: '4',
      },
      do: {
          name: '在看',
          id: '3',
      },
      collect: {
          name: '看过',
          id: '2',
      },
      wish: {
          name: '想看',
          id: '1',
      },
  };
  function findInterestStatusById(id) {
      for (let key in typeIdDict$1) {
          const obj = typeIdDict$1[key];
          if (obj.id === id) {
              return {
                  key: key,
                  ...obj,
              };
          }
      }
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
  async function setSearchResultByGM(data) {
      const res = {
          type: SEARCH_RESULT,
          timestamp: +new Date(),
          data,
      };
      GM_setValue(SEARCH_RESULT, res);
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

  function getBgmHost() {
      return `${location.protocol}//${location.host}`;
  }
  function getSubjectId$1(url) {
      const m = url.match(/(?:subject|character)\/(\d+)/);
      if (!m)
          return '';
      return m[1];
  }
  function getUserId$1(url) {
      // https://bgm.tv/user/a_little
      const m = url.match(/user\/(.*)/);
      if (!m)
          return '';
      return m[1];
  }
  function insertLogInfo($sibling, txt) {
      const $log = document.createElement('div');
      $log.classList.add('e-wiki-log-info');
      // $log.setAttribute('style', 'color: tomato;');
      $log.innerHTML = txt;
      $sibling.parentElement.insertBefore($log, $sibling);
      $sibling.insertAdjacentElement('afterend', $log);
      return $log;
  }
  function convertItemInfo$1($item) {
      let $subjectTitle = $item.querySelector('h3>a.l');
      let itemSubject = {
          name: $subjectTitle.textContent.trim(),
          rawInfos: $item.querySelector('.info').textContent.trim(),
          // url 没有协议和域名
          url: $subjectTitle.getAttribute('href'),
          greyName: $item.querySelector('h3>.grey')
              ? $item.querySelector('h3>.grey').textContent.trim()
              : '',
      };
      let matchDate = $item
          .querySelector('.info')
          .textContent.match(/\d{4}[\-\/\年]\d{1,2}[\-\/\月]\d{1,2}/);
      if (matchDate) {
          itemSubject.releaseDate = dealDate(matchDate[0]);
      }
      const $rateInfo = $item.querySelector('.rateInfo');
      if ($rateInfo) {
          const rateInfo = {};
          if ($rateInfo.querySelector('.fade')) {
              rateInfo.score = $rateInfo.querySelector('.fade').textContent;
              rateInfo.count = $rateInfo
                  .querySelector('.tip_j')
                  .textContent.replace(/[^0-9]/g, '');
          }
          else {
              rateInfo.score = '0';
              rateInfo.count = '少于10';
          }
          itemSubject.rateInfo = rateInfo;
      }
      const $rank = $item.querySelector('.rank');
      if ($rank) {
          itemSubject.rank = $rank.textContent.replace('Rank', '').trim();
      }
      const $collectInfo = $item.querySelector('.collectInfo');
      const collectInfo = {};
      const $comment = $item.querySelector('#comment_box');
      if ($comment) {
          collectInfo.comment = $comment.textContent.trim();
      }
      if ($collectInfo) {
          const textArr = $collectInfo.textContent.split('/');
          collectInfo.date = textArr[0].trim();
          textArr.forEach((str) => {
              if (str.match('标签')) {
                  collectInfo.tags = str.replace(/标签:/, '').trim();
              }
          });
          const $starlight = $collectInfo.querySelector('.starlight');
          if ($starlight) {
              $starlight.classList.forEach((s) => {
                  if (/stars\d/.test(s)) {
                      collectInfo.score = s.replace('stars', '');
                  }
              });
          }
      }
      if (Object.keys(collectInfo).length) {
          collectInfo.tags = collectInfo.tags || '';
          collectInfo.comment = collectInfo.comment || '';
          itemSubject.collectInfo = collectInfo;
      }
      const $cover = $item.querySelector('.subjectCover img');
      if ($cover && $cover.tagName.toLowerCase() === 'img') {
          // 替换 cover/s --->  cover/l 是大图
          const src = $cover.getAttribute('src') || $cover.getAttribute('data-cfsrc');
          if (src) {
              itemSubject.cover = src.replace('pic/cover/s', 'pic/cover/l');
          }
      }
      return itemSubject;
  }
  function getItemInfos$1($doc = document) {
      const items = $doc.querySelectorAll('#browserItemList>li');
      const res = [];
      for (const item of Array.from(items)) {
          res.push(convertItemInfo$1(item));
      }
      return res;
  }
  function getTotalPageNum$2($doc = document) {
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
  function genCollectionURL$1(userId, subjectType, interestType) {
      const dict = {
          movie: 'anime',
          music: 'music',
          book: 'book',
      };
      return `https://bgm.tv/${dict[subjectType]}/list/${userId}/${interestType}`;
  }
  async function getAllPageInfo$1(userId, subjectType, interestType) {
      const url = genCollectionURL$1(userId, subjectType, interestType);
      console.info('bgm collection page: ', url);
      const rawText = await fetchText(url);
      const $doc = new DOMParser().parseFromString(rawText, 'text/html');
      const totalPageNum = getTotalPageNum$2($doc);
      const res = [...getItemInfos$1($doc)];
      let page = 2;
      while (page <= totalPageNum) {
          let reqUrl = url;
          const m = url.match(/page=(\d*)/);
          if (m) {
              reqUrl = reqUrl.replace(m[0], `page=${page}`);
          }
          else {
              reqUrl = `${reqUrl}?page=${page}`;
          }
          await sleep(500);
          console.info('fetch info: ', reqUrl);
          const rawText = await fetchText(reqUrl);
          const $doc = new DOMParser().parseFromString(rawText, 'text/html');
          res.push(...getItemInfos$1($doc));
          page += 1;
      }
      return res;
  }
  function loadIframe$1($iframe, subjectId) {
      return new Promise((resolve, reject) => {
          $iframe.src = `/update/${subjectId}`;
          let timer = setTimeout(() => {
              timer = null;
              reject('bangumi iframe timeout');
          }, 5000);
          $iframe.onload = () => {
              clearTimeout(timer);
              $iframe.onload = null;
              resolve(null);
          };
      });
  }
  async function getUpdateForm(subjectId) {
      const iframeId = 'e-userjs-update-interest';
      let $iframe = document.querySelector(`#${iframeId}`);
      if (!$iframe) {
          $iframe = document.createElement('iframe');
          $iframe.style.display = 'none';
          $iframe.id = iframeId;
          document.body.appendChild($iframe);
      }
      await loadIframe$1($iframe, subjectId);
      const $form = $iframe.contentDocument.querySelector('#collectBoxForm');
      return $form;
      // return $form.action;
  }
  /**
   * 更新用户收藏
   * @param subjectId 条目 id
   * @param data 更新数据
   */
  async function updateInterest$1(subjectId, data) {
      // gh 暂时不知道如何获取，直接拿 action 了
      const $form = await getUpdateForm(subjectId);
      const formData = new FormData($form);
      const obj = Object.assign({ referer: 'ajax', tags: '', comment: '', update: '保存' }, data);
      for (let [key, val] of Object.entries(obj)) {
          if (!formData.has(key)) {
              formData.append(key, val);
          }
          else {
              // 标签和吐槽可以直接清空
              if (['tags', 'comment', 'rating'].includes(key)) {
                  formData.set(key, val);
              }
              else if (!formData.get(key) && val) {
                  formData.set(key, val);
              }
          }
      }
      await fetch($form.action, {
          method: 'POST',
          body: formData,
      });
  }

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

  /**
   * 为页面添加样式
   * @param style
   */
  /**
   * 下载内容
   * https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
   * @example
   * download(csvContent, 'dowload.csv', 'text/csv;encoding:utf-8');
   * BOM: data:text/csv;charset=utf-8,\uFEFF
   * @param content 内容
   * @param fileName 文件名
   * @param mimeType 文件类型
   */
  function downloadFile(content, fileName, mimeType = 'application/octet-stream') {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([content], {
          type: mimeType,
      }));
      a.style.display = 'none';
      a.setAttribute('download', fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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

  function getSearchItem($item) {
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
          return getSearchItem($item);
      });
  }
  function getTotalPageNum$1($doc = document) {
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
  async function searchSubject(subjectInfo, bgmHost = 'https://bgm.tv', type = SubjectTypeId.all, uniqueQueryStr = '', opts = {}) {
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
      const numOfPage = getTotalPageNum$1($doc);
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
          return await searchSubject(subjectInfo, bgmHost, type, '', {
              ...searchOpts,
              shortenQuery: true,
              query,
          });
      }
      if (isUniqueQuery(subjectInfo)) {
          return await searchSubject(subjectInfo, bgmHost, type, subjectInfo.name.trim(), searchOpts);
      }
      let searchResult = await searchSubject(subjectInfo, bgmHost, type, '', searchOpts);
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
          searchResult = await searchSubject(subjectInfo, bgmHost, type, '', {
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
  async function checkAnimeSubjectExist$1(subjectInfo) {
      const result = await checkExist(subjectInfo, getBgmHost(), SubjectTypeId.anime, true);
      return result;
  }
  const siteUtils$1 = {
      name: 'Bangumi',
      contanerSelector: '#columnHomeB',
      getUserId: getUserId$1,
      getSubjectId: getSubjectId$1,
      updateInterest: updateInterest$1,
      checkSubjectExist: checkAnimeSubjectExist$1,
      getAllPageInfo: getAllPageInfo$1,
  };

  function genCollectionURL(userId, interestType, subjectType = 'movie', start = 1) {
      const baseURL = `https://${subjectType}.douban.com/people/${userId}/${interestType}`;
      if (start === 1) {
          return baseURL;
      }
      else {
          return `${baseURL}?start=${start}&sort=time&rating=all&filter=all&mode=grid`;
      }
  }
  function convertBangumiScore(num) {
      return Math.ceil(num / 2);
      // if (num < 4) {
      //   return 1;
      // }
      // if (num < 6) {
      //   return 2;
      // }
      // if (num < 8) return 3;
      // if (num < 9) return 4;
      // if (num === 10) return 5;
      // return 0;
  }
  function getSubjectId(url) {
      const m = url.match(/movie\.douban\.com\/subject\/(\d+)/);
      if (m) {
          return m[1];
      }
      return '';
  }
  function getUserId(homeURL) {
      let m = homeURL.match(/douban.com\/people\/([^\/]*)\//);
      if (m) {
          return m[1];
      }
      return '';
  }
  function convertItemInfo($item) {
      let $subjectTitle = $item.querySelector('.info .title a');
      // 默认第二项为日文名
      const titleArr = $subjectTitle.textContent
          .trim()
          .split('/')
          .map((str) => str.trim());
      const rawInfos = $item.querySelector('.info .intro').textContent.trim();
      let itemSubject = {
          name: titleArr[1],
          rawInfos,
          url: $subjectTitle.getAttribute('href'),
          greyName: titleArr[0],
      };
      const $cover = $item.querySelector('.pic img');
      if ($cover && $cover.tagName.toLowerCase() === 'img') {
          const src = $cover.getAttribute('src');
          if (src) {
              itemSubject.cover = src;
          }
      }
      const jpDateReg = /(\d+-\d\d\-\d\d)(?:\(日本\))/;
      const dateReg = /\d+-\d\d\-\d\d/;
      let m;
      if ((m = rawInfos.match(jpDateReg))) {
          itemSubject.releaseDate = m[1];
      }
      else if ((m = rawInfos.match(dateReg))) {
          itemSubject.releaseDate = m[0];
      }
      const $collectInfo = $item.querySelector('.info');
      if ($collectInfo) {
          const collectInfo = {};
          collectInfo.date = $collectInfo
              .querySelector('li .date')
              ?.textContent.trim();
          collectInfo.tags = $collectInfo
              .querySelector('li .tags')
              ?.textContent.replace('标签: ', '')
              .trim() ?? '';
          collectInfo.comment = $collectInfo
              .querySelector('li .comment')
              ?.textContent.trim() ?? '';
          const $rating = $collectInfo.querySelector('[class^=rating]');
          if ($rating) {
              const m = $rating.getAttribute('class').match(/\d/);
              if (m) {
                  // 十分制
                  collectInfo.score = +m[0] * 2;
              }
          }
          itemSubject.collectInfo = collectInfo;
      }
      return itemSubject;
  }
  function getTotalPageNum($doc = document) {
      const numStr = $doc.querySelector('.mode > .subject-num').textContent.trim();
      return Number(numStr.split('/')[1].trim());
  }
  /**
   * 拿到当前页面豆瓣用户收藏信息列表
   * @param $doc DOM
   */
  function getItemInfos($doc = document) {
      const items = $doc.querySelectorAll('#content .grid-view > .item');
      const res = [];
      for (const item of Array.from(items)) {
          res.push(convertItemInfo(item));
      }
      return res;
  }
  /**
   * 获取所有分页的条目数据
   * @param userId 用户id
   * @param subjectType 条目类型
   * @param interestType 条目状态
   */
  async function getAllPageInfo(userId, subjectType = 'movie', interestType) {
      let res = [];
      const url = genCollectionURL(userId, interestType, subjectType);
      const rawText = await fetchText(url);
      const $doc = new DOMParser().parseFromString(rawText, 'text/html');
      const totalPageNum = getTotalPageNum($doc);
      res = [...getItemInfos($doc)];
      // 16 分割
      let page = 16;
      while (page <= totalPageNum) {
          let reqUrl = genCollectionURL(userId, interestType, subjectType, page);
          await sleep(500);
          console.info('fetch info: ', reqUrl);
          const rawText = await fetchText(reqUrl);
          const $doc = new DOMParser().parseFromString(rawText, 'text/html');
          res.push(...getItemInfos($doc));
          page += 15;
      }
      return res;
  }
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
   * 提取所有 search.douban.com 的条目信息
   * @param $doc 页面容器
   */
  function getAllSearchResult($doc = document) {
      let items = $doc.querySelectorAll('#root .item-root');
      return Array.prototype.slice
          .call(items)
          .map(($item) => convertSubjectSearchItem($item));
  }
  /**
   * 提取 search.douban.com 的条目信息
   * @param $item 单项搜索结果容器 DOM
   */
  function convertSubjectSearchItem($item) {
      // item-root
      const $title = $item.querySelector('.title a');
      let name = '';
      let releaseDate = '';
      let rawName = '';
      if ($title) {
          const rawText = $title.textContent.trim();
          rawName = rawText;
          const yearRe = /\((\d{4})\)$/;
          releaseDate = (rawText.match(yearRe) || ['', ''])[1];
          let arr = rawText.split(/ (?!-)/);
          if (arr && arr.length === 2) {
              name = arr[0];
              arr[1].replace(yearRe, '');
          }
          else {
              arr = rawText.split(/ (?!(-|\w))/);
              name = arr[0];
              rawText.replace(name, '').trim().replace(yearRe, '').trim();
          }
      }
      let ratingsCount = '';
      let averageScore = '';
      const $ratingNums = $item.querySelector('.rating_nums');
      if ($ratingNums) {
          const $count = $ratingNums.nextElementSibling;
          const m = $count.textContent.match(/\d+/);
          if (m) {
              ratingsCount = m[0];
          }
          averageScore = $ratingNums.textContent;
      }
      return {
          name,
          rawName,
          url: $title.getAttribute('href'),
          score: averageScore,
          count: ratingsCount,
          releaseDate,
      };
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
  async function sendSearchResults() {
      const searchItems = getAllSearchResult();
      setSearchResultByGM(searchItems);
  }
  async function updateInterest(subjectId, data) {
      const interestObj = findInterestStatusById(data.interest);
      let query = '';
      if (data.interest !== undefined) {
          query = 'interest=' + interestObj.key;
      }
      let url = `https://movie.douban.com/j/subject/${subjectId}/interest?${query}`;
      const collectInfo = await fetchJson(url);
      const interestStatus = collectInfo.interest_status;
      const tags = collectInfo.tags;
      const $doc = new DOMParser().parseFromString(collectInfo.html, 'text/html');
      const $form = $doc.querySelector('form');
      const formData = new FormData($form);
      const sendData = {
          interest: interestObj.key,
          tags: data.tags,
          comment: data.comment,
          rating: convertBangumiScore(+data.rating) + '',
      };
      if (tags && tags.length) {
          sendData.tags = tags.join(' ');
      }
      if (interestStatus) {
          sendData.interest = interestStatus;
      }
      if (data.privacy === '1') {
          // @ts-ignore
          sendData.privacy = 'on';
      }
      for (let [key, val] of Object.entries(sendData)) {
          if (!formData.has(key)) {
              formData.append(key, val);
          }
          else if (formData.has(key) && !formData.get(key) && val) {
              formData.set(key, val);
          }
      }
      // share-shuo: douban  删除分享广播
      if (formData.has('share-shuo')) {
          formData.delete('share-shuo');
      }
      await fetch($form.action, {
          method: 'POST',
          headers: {
              'X-Requested-With': 'XMLHttpRequest',
          },
          body: formData,
      });
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
  const siteUtils = {
      name: '豆瓣',
      contanerSelector: '#content .aside',
      getUserId,
      getSubjectId,
      getAllPageInfo,
      updateInterest,
      checkSubjectExist: checkAnimeSubjectExist,
  };

  function insertControl(contanerSelector, name) {
      GM_addStyle(`
  .e-userjs-export-tool-container input {
    margin-bottom: 12px;
  }
  .e-userjs-export-tool-container .title {
    color: #F09199;
    font-weight: bold;
    font-size: 14px;
    margin: 12px 0;
    display: inline-block;
  }
  .e-userjs-export-tool-container .import-btn{
    margin-top: 12px;
  }
  .e-userjs-export-tool-container .export-btn {
    display: none;
  }
  .e-userjs-export-tool-container .retry-btn {
    display: none;
  }
  .ui-button {
    display: inline-block;
    line-height: 20px;
    font-size: 14px;
    text-align: center;
    color: #4c5161;
    border-radius: 4px;
    border: 1px solid #d0d0d5;
    padding: 9px 15px;
    min-width: 80px;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: center;
    text-decoration: none;
    box-sizing: border-box;
    transition: border-color .15s, box-shadow .15s, opacity .15s;
    font-family: inherit;
    cursor: pointer;
    overflow: visible;

    background-color: #2a80eb;
    color: #fff;
  }
`);
      const $parent = document.querySelector(contanerSelector);
      const $container = htmlToElement(`
<div class="e-userjs-export-tool-container">
<div>
  <span class="title">${name}主页 URL: </span><br/>
  <input placeholder="输入${name}主页的 URL" class="inputtext" autocomplete="off" type="text" size="30" name="tags" value="">
</div>
  <div>
<label for="movie-type-select">选择同步类型:</label>
<select name="movieType" id="movie-type-select">
    <option value="">所有</option>
    <option value="do">在看</option>
    <option value="wish">想看</option>
    <option value="collect">看过</option>
</select>
  </div>
  <button class="ui-button import-btn" type="submit">
导入${name}动画收藏
  </button>
  <br/>
  <button class="ui-button export-btn" type="submit">
导出${name}动画的收藏同步信息
  </button>
  <button class="ui-button retry-btn" type="submit">
重新同步失败的条目
  </button>
</div>
  `);
      $parent.appendChild($container);
      return $container;
  }

  let bangumiData = null;
  const typeIdDict = {
      dropped: {
          name: '抛弃',
          id: '5',
      },
      on_hold: {
          name: '搁置',
          id: '4',
      },
      do: {
          name: '在看',
          id: '3',
      },
      collect: {
          name: '看过',
          id: '2',
      },
      wish: {
          name: '想看',
          id: '1',
      },
  };
  function getBangumiSubjectId(name = '', greyName = '') {
      if (!bangumiData)
          return;
      const obj = bangumiData.items.find((item) => {
          let cnNames = [];
          if (item.titleTranslate && item.titleTranslate['zh-Hans']) {
              cnNames = item.titleTranslate['zh-Hans'];
          }
          return (item.title === name ||
              item.title === greyName ||
              cnNames.includes(greyName));
      });
      return obj?.sites?.find((item) => item.site === 'bangumi').id;
  }
  function genCSVContent(infos) {
      const header = '\ufeff名称,别名,发行日期,地址,封面地址,收藏日期,我的评分,标签,吐槽,其它信息,类别,同步情况,搜索结果信息';
      let csvContent = '';
      const keys = Object.keys(infos);
      keys.forEach((key) => {
          infos[key].forEach((item) => {
              csvContent += `\r\n${item.name || ''},${item.greyName || ''},${item.releaseDate || ''}`;
              const subjectUrl = item.url;
              csvContent += `,${subjectUrl}`;
              const cover = item.cover || '';
              csvContent += `,${cover}`;
              const collectInfo = item.collectInfo || {};
              const collectDate = collectInfo.date || '';
              csvContent += `,${collectDate}`;
              const score = collectInfo.score || '';
              csvContent += `,${score}`;
              const tag = collectInfo.tags || '';
              csvContent += `,${tag}`;
              const comment = collectInfo.comment || '';
              csvContent += `,"${comment}"`;
              const rawInfos = item.rawInfos || '';
              csvContent += `,"${rawInfos}"`;
              csvContent += `,"${typeIdDict[key].name}"`;
              csvContent += `,${item.syncStatus || ''}`;
              // 新增搜索结果信息
              let searchResultStr = '';
              if (item.syncSubject) {
                  const obj = item.syncSubject;
                  searchResultStr = `${obj.name};${obj.greyName || ''};${obj.url || ''};${obj.rawName || ''}`;
              }
              // 同步信息
              csvContent += `,"${searchResultStr}"`;
          });
      });
      return header + csvContent;
  }
  // 区分是否为动画
  function isJpMovie(item) {
      return item.rawInfos.indexOf('日本') !== -1;
  }
  function clearLogInfo($container) {
      $container
          .querySelectorAll('.e-wiki-log-info')
          .forEach((node) => node.remove());
  }
  function init(site) {
      let targetUtils;
      let originUtils;
      if (site === 'bangumi') {
          targetUtils = siteUtils;
          originUtils = siteUtils$1;
      }
      else {
          targetUtils = siteUtils$1;
          originUtils = siteUtils;
      }
      const $container = insertControl(originUtils.contanerSelector, targetUtils.name);
      const $input = $container.querySelector('input');
      const $importBtn = $container.querySelector('.import-btn');
      const $exportBtn = $container.querySelector('.export-btn');
      const $retryBtn = $container.querySelector('.retry-btn');
      const interestInfos = {
          do: [],
          collect: [],
          wish: [],
          dropped: [],
          on_hold: [],
      };
      $exportBtn.addEventListener('click', async (e) => {
          const $text = e.target;
          $text.value = '导出中...';
          let name = 'Bangumi';
          if (site === 'bangumi') {
              name = '豆瓣';
          }
          let strName = `${name}动画的收藏`;
          const csv = genCSVContent(interestInfos);
          // $text.value = '导出完成';
          $text.style.display = 'none';
          downloadFile(csv, `${strName}-${formatDate(new Date())}.csv`);
      });
      $retryBtn.addEventListener('click', async (e) => {
          try {
              bangumiData = JSON.parse(GM_getResourceText('bangumiDataURL'));
          }
          catch (e) {
              console.log('parse JSON:', e);
          }
          const userId = getUserIdFromInput($input.value, targetUtils.getUserId);
          if (!userId)
              return;
          const arr = getInterestTypeArr();
          for (let type of arr) {
              const res = interestInfos[type];
              for (let i = 0; i < res.length; i++) {
                  let item = res[i];
                  if (!item.syncStatus) {
                      item = await migrateCollection(originUtils, item, site, type);
                  }
                  res[i] = item;
              }
          }
          clearLogInfo($container);
          $exportBtn.style.display = 'inline-block';
          $retryBtn.style.display = 'inline-block';
      });
      $importBtn.addEventListener('click', async (e) => {
          try {
              bangumiData = JSON.parse(GM_getResourceText('bangumiDataURL'));
          }
          catch (e) {
              console.log('parse JSON:', e);
          }
          const userId = getUserIdFromInput($input.value, targetUtils.getUserId);
          if (!userId)
              return;
          const arr = getInterestTypeArr();
          for (let type of arr) {
              try {
                  const res = (await targetUtils.getAllPageInfo(userId, 'movie', type));
                  for (let i = 0; i < res.length; i++) {
                      let item = res[i];
                      item = await migrateCollection(originUtils, item, site, type);
                      res[i] = item;
                  }
                  interestInfos[type] = [...res];
              }
              catch (error) {
                  console.error(error);
              }
          }
          clearLogInfo($container);
          $exportBtn.style.display = 'inline-block';
          $retryBtn.style.display = 'inline-block';
      });
  }
  function getUserIdFromInput(val, fn) {
      if (!val) {
          alert(`请输入${name}主页地址`);
          return '';
      }
      const userId = fn(val);
      if (!userId) {
          alert(`无效${name}主页地址`);
          return '';
      }
      return userId;
  }
  function getInterestTypeArr() {
      const $container = document.querySelector('.e-userjs-export-tool-container');
      const $select = $container.querySelector('#movie-type-select');
      // const arr: InterestType[] = ['wish'];
      let arr = ['do', 'collect', 'wish'];
      if ($select && $select.value) {
          arr = [$select.value];
      }
      return arr;
  }
  async function migrateCollection(siteUtils, item, site, type) {
      const subjectItem = { ...item };
      const $container = document.querySelector('.e-userjs-export-tool-container');
      const $btn = $container.querySelector('.import-btn');
      // 在 Bangumi 上 非日语的条目跳过
      if (site === 'bangumi' && !isJpMovie(subjectItem)) {
          return subjectItem;
      }
      let subjectId = '';
      // 使用 bangumi data
      if (site === 'bangumi') {
          subjectId = getBangumiSubjectId(subjectItem.name, subjectItem.greyName);
      }
      if (!subjectId) {
          try {
              await randomSleep(1000, 400);
              const result = await siteUtils.checkSubjectExist({
                  name: subjectItem.name,
                  releaseDate: subjectItem.releaseDate,
              });
              if (result && result.url) {
                  subjectId = siteUtils.getSubjectId(result.url);
                  subjectItem.syncSubject = result;
              }
          }
          catch (error) {
              console.error(error);
          }
      }
      if (subjectId) {
          clearLogInfo($container);
          const nameStr = `<span style="color:tomato">《${subjectItem.name}》</span>`;
          insertLogInfo($btn, `更新收藏 ${nameStr} 中...`);
          await siteUtils.updateInterest(subjectId, {
              interest: typeIdDict[type].id,
              ...subjectItem.collectInfo,
              rating: subjectItem.collectInfo.score || '',
          });
          subjectItem.syncStatus = '成功';
          await randomSleep(2000, 1000);
          insertLogInfo($btn, `更新收藏 ${nameStr} 成功`);
      }
      return subjectItem;
  }
  if (location.href.match(/bgm.tv|bangumi.tv|chii.in/)) {
      init('bangumi');
  }
  if (location.href.match(/movie.douban.com/)) {
      init('douban');
  }
  if (location.href.match(/search\.douban\.com\/movie\/subject_search/)) {
      if (window.top !== window.self) {
          sendSearchResults();
      }
  }

})();
