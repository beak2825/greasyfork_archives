// ==UserScript==
// @name         右键超链接快速打开新标签页（Common Right Click Tab）
// @namespace    xiaohuohumax/userscripts/common-right-click-tab
// @version      1.3.1
// @author       xiaohuohumax
// @description  用户可以通过右键点击【普通链接、鼠标选中带链接的文字】等方式快速打开新标签页。效果类似于【Ctrl+左键】点击链接。
// @license      MIT
// @icon         https://raw.githubusercontent.com/xiaohuohumax/logo/refs/heads/main/logos/logo.svg
// @source       https://github.com/xiaohuohumax/userscripts.git
// @match        http*://*/*
// @require      https://unpkg.com/sweetalert2@11.15.9/dist/sweetalert2.all.min.js
// @grant        GM_addValueChangeListener
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/528494/%E5%8F%B3%E9%94%AE%E8%B6%85%E9%93%BE%E6%8E%A5%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%EF%BC%88Common%20Right%20Click%20Tab%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528494/%E5%8F%B3%E9%94%AE%E8%B6%85%E9%93%BE%E6%8E%A5%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%EF%BC%88Common%20Right%20Click%20Tab%EF%BC%89.meta.js
// ==/UserScript==

(function (Swal) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  function getAugmentedNamespace(n) {
    if (n.__esModule) return n;
    var f = n.default;
    if (typeof f == "function") {
      var a = function a2() {
        if (this instanceof a2) {
          return Reflect.construct(f, arguments, this.constructor);
        }
        return f.apply(this, arguments);
      };
      a.prototype = f.prototype;
    } else a = {};
    Object.defineProperty(a, "__esModule", { value: true });
    Object.keys(n).forEach(function(k) {
      var d = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d.get ? d : {
        enumerable: true,
        get: function() {
          return n[k];
        }
      });
    });
    return a;
  }
  var ipRegex;
  var hasRequiredIpRegex;
  function requireIpRegex() {
    if (hasRequiredIpRegex) return ipRegex;
    hasRequiredIpRegex = 1;
    const word = "[a-fA-F\\d:]";
    const b = (options) => options && options.includeBoundaries ? `(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))` : "";
    const v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
    const v6seg = "[a-fA-F\\d]{1,4}";
    const v6 = `
(?:
(?:${v6seg}:){7}(?:${v6seg}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(?::${v6seg}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(?::${v6seg}){0,1}:${v4}|(?::${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(?::${v6seg}){0,2}:${v4}|(?::${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(?::${v6seg}){0,3}:${v4}|(?::${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(?::${v6seg}){0,4}:${v4}|(?::${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
    const v46Exact = new RegExp(`(?:^${v4}$)|(?:^${v6}$)`);
    const v4exact = new RegExp(`^${v4}$`);
    const v6exact = new RegExp(`^${v6}$`);
    const ip = (options) => options && options.exact ? v46Exact : new RegExp(`(?:${b(options)}${v4}${b(options)})|(?:${b(options)}${v6}${b(options)})`, "g");
    ip.v4 = (options) => options && options.exact ? v4exact : new RegExp(`${b(options)}${v4}${b(options)}`, "g");
    ip.v6 = (options) => options && options.exact ? v6exact : new RegExp(`${b(options)}${v6}${b(options)}`, "g");
    ipRegex = ip;
    return ipRegex;
  }
  const require$$1 = JSON.parse('["aaa","aarp","abb","abbott","abbvie","abc","able","abogado","abudhabi","ac","academy","accenture","accountant","accountants","aco","actor","ad","ads","adult","ae","aeg","aero","aetna","af","afl","africa","ag","agakhan","agency","ai","aig","airbus","airforce","airtel","akdn","al","alibaba","alipay","allfinanz","allstate","ally","alsace","alstom","am","amazon","americanexpress","americanfamily","amex","amfam","amica","amsterdam","analytics","android","anquan","anz","ao","aol","apartments","app","apple","aq","aquarelle","ar","arab","aramco","archi","army","arpa","art","arte","as","asda","asia","associates","at","athleta","attorney","au","auction","audi","audible","audio","auspost","author","auto","autos","aw","aws","ax","axa","az","azure","ba","baby","baidu","banamex","band","bank","bar","barcelona","barclaycard","barclays","barefoot","bargains","baseball","basketball","bauhaus","bayern","bb","bbc","bbt","bbva","bcg","bcn","bd","be","beats","beauty","beer","bentley","berlin","best","bestbuy","bet","bf","bg","bh","bharti","bi","bible","bid","bike","bing","bingo","bio","biz","bj","black","blackfriday","blockbuster","blog","bloomberg","blue","bm","bms","bmw","bn","bnpparibas","bo","boats","boehringer","bofa","bom","bond","boo","book","booking","bosch","bostik","boston","bot","boutique","box","br","bradesco","bridgestone","broadway","broker","brother","brussels","bs","bt","build","builders","business","buy","buzz","bv","bw","by","bz","bzh","ca","cab","cafe","cal","call","calvinklein","cam","camera","camp","canon","capetown","capital","capitalone","car","caravan","cards","care","career","careers","cars","casa","case","cash","casino","cat","catering","catholic","cba","cbn","cbre","cc","cd","center","ceo","cern","cf","cfa","cfd","cg","ch","chanel","channel","charity","chase","chat","cheap","chintai","christmas","chrome","church","ci","cipriani","circle","cisco","citadel","citi","citic","city","ck","cl","claims","cleaning","click","clinic","clinique","clothing","cloud","club","clubmed","cm","cn","co","coach","codes","coffee","college","cologne","com","commbank","community","company","compare","computer","comsec","condos","construction","consulting","contact","contractors","cooking","cool","coop","corsica","country","coupon","coupons","courses","cpa","cr","credit","creditcard","creditunion","cricket","crown","crs","cruise","cruises","cu","cuisinella","cv","cw","cx","cy","cymru","cyou","cz","dad","dance","data","date","dating","datsun","day","dclk","dds","de","deal","dealer","deals","degree","delivery","dell","deloitte","delta","democrat","dental","dentist","desi","design","dev","dhl","diamonds","diet","digital","direct","directory","discount","discover","dish","diy","dj","dk","dm","dnp","do","docs","doctor","dog","domains","dot","download","drive","dtv","dubai","dunlop","dupont","durban","dvag","dvr","dz","earth","eat","ec","eco","edeka","edu","education","ee","eg","email","emerck","energy","engineer","engineering","enterprises","epson","equipment","er","ericsson","erni","es","esq","estate","et","eu","eurovision","eus","events","exchange","expert","exposed","express","extraspace","fage","fail","fairwinds","faith","family","fan","fans","farm","farmers","fashion","fast","fedex","feedback","ferrari","ferrero","fi","fidelity","fido","film","final","finance","financial","fire","firestone","firmdale","fish","fishing","fit","fitness","fj","fk","flickr","flights","flir","florist","flowers","fly","fm","fo","foo","food","football","ford","forex","forsale","forum","foundation","fox","fr","free","fresenius","frl","frogans","frontier","ftr","fujitsu","fun","fund","furniture","futbol","fyi","ga","gal","gallery","gallo","gallup","game","games","gap","garden","gay","gb","gbiz","gd","gdn","ge","gea","gent","genting","george","gf","gg","ggee","gh","gi","gift","gifts","gives","giving","gl","glass","gle","global","globo","gm","gmail","gmbh","gmo","gmx","gn","godaddy","gold","goldpoint","golf","goo","goodyear","goog","google","gop","got","gov","gp","gq","gr","grainger","graphics","gratis","green","gripe","grocery","group","gs","gt","gu","gucci","guge","guide","guitars","guru","gw","gy","hair","hamburg","hangout","haus","hbo","hdfc","hdfcbank","health","healthcare","help","helsinki","here","hermes","hiphop","hisamitsu","hitachi","hiv","hk","hkt","hm","hn","hockey","holdings","holiday","homedepot","homegoods","homes","homesense","honda","horse","hospital","host","hosting","hot","hotels","hotmail","house","how","hr","hsbc","ht","hu","hughes","hyatt","hyundai","ibm","icbc","ice","icu","id","ie","ieee","ifm","ikano","il","im","imamat","imdb","immo","immobilien","in","inc","industries","infiniti","info","ing","ink","institute","insurance","insure","int","international","intuit","investments","io","ipiranga","iq","ir","irish","is","ismaili","ist","istanbul","it","itau","itv","jaguar","java","jcb","je","jeep","jetzt","jewelry","jio","jll","jm","jmp","jnj","jo","jobs","joburg","jot","joy","jp","jpmorgan","jprs","juegos","juniper","kaufen","kddi","ke","kerryhotels","kerryproperties","kfh","kg","kh","ki","kia","kids","kim","kindle","kitchen","kiwi","km","kn","koeln","komatsu","kosher","kp","kpmg","kpn","kr","krd","kred","kuokgroup","kw","ky","kyoto","kz","la","lacaixa","lamborghini","lamer","lancaster","land","landrover","lanxess","lasalle","lat","latino","latrobe","law","lawyer","lb","lc","lds","lease","leclerc","lefrak","legal","lego","lexus","lgbt","li","lidl","life","lifeinsurance","lifestyle","lighting","like","lilly","limited","limo","lincoln","link","live","living","lk","llc","llp","loan","loans","locker","locus","lol","london","lotte","lotto","love","lpl","lplfinancial","lr","ls","lt","ltd","ltda","lu","lundbeck","luxe","luxury","lv","ly","ma","madrid","maif","maison","makeup","man","management","mango","map","market","marketing","markets","marriott","marshalls","mattel","mba","mc","mckinsey","md","me","med","media","meet","melbourne","meme","memorial","men","menu","merckmsd","mg","mh","miami","microsoft","mil","mini","mint","mit","mitsubishi","mk","ml","mlb","mls","mm","mma","mn","mo","mobi","mobile","moda","moe","moi","mom","monash","money","monster","mormon","mortgage","moscow","moto","motorcycles","mov","movie","mp","mq","mr","ms","msd","mt","mtn","mtr","mu","museum","music","mv","mw","mx","my","mz","na","nab","nagoya","name","navy","nba","nc","ne","nec","net","netbank","netflix","network","neustar","new","news","next","nextdirect","nexus","nf","nfl","ng","ngo","nhk","ni","nico","nike","nikon","ninja","nissan","nissay","nl","no","nokia","norton","now","nowruz","nowtv","np","nr","nra","nrw","ntt","nu","nyc","nz","obi","observer","office","okinawa","olayan","olayangroup","ollo","om","omega","one","ong","onl","online","ooo","open","oracle","orange","org","organic","origins","osaka","otsuka","ott","ovh","pa","page","panasonic","paris","pars","partners","parts","party","pay","pccw","pe","pet","pf","pfizer","pg","ph","pharmacy","phd","philips","phone","photo","photography","photos","physio","pics","pictet","pictures","pid","pin","ping","pink","pioneer","pizza","pk","pl","place","play","playstation","plumbing","plus","pm","pn","pnc","pohl","poker","politie","porn","post","pr","pramerica","praxi","press","prime","pro","prod","productions","prof","progressive","promo","properties","property","protection","pru","prudential","ps","pt","pub","pw","pwc","py","qa","qpon","quebec","quest","racing","radio","re","read","realestate","realtor","realty","recipes","red","redstone","redumbrella","rehab","reise","reisen","reit","reliance","ren","rent","rentals","repair","report","republican","rest","restaurant","review","reviews","rexroth","rich","richardli","ricoh","ril","rio","rip","ro","rocks","rodeo","rogers","room","rs","rsvp","ru","rugby","ruhr","run","rw","rwe","ryukyu","sa","saarland","safe","safety","sakura","sale","salon","samsclub","samsung","sandvik","sandvikcoromant","sanofi","sap","sarl","sas","save","saxo","sb","sbi","sbs","sc","scb","schaeffler","schmidt","scholarships","school","schule","schwarz","science","scot","sd","se","search","seat","secure","security","seek","select","sener","services","seven","sew","sex","sexy","sfr","sg","sh","shangrila","sharp","shell","shia","shiksha","shoes","shop","shopping","shouji","show","si","silk","sina","singles","site","sj","sk","ski","skin","sky","skype","sl","sling","sm","smart","smile","sn","sncf","so","soccer","social","softbank","software","sohu","solar","solutions","song","sony","soy","spa","space","sport","spot","sr","srl","ss","st","stada","staples","star","statebank","statefarm","stc","stcgroup","stockholm","storage","store","stream","studio","study","style","su","sucks","supplies","supply","support","surf","surgery","suzuki","sv","swatch","swiss","sx","sy","sydney","systems","sz","tab","taipei","talk","taobao","target","tatamotors","tatar","tattoo","tax","taxi","tc","tci","td","tdk","team","tech","technology","tel","temasek","tennis","teva","tf","tg","th","thd","theater","theatre","tiaa","tickets","tienda","tips","tires","tirol","tj","tjmaxx","tjx","tk","tkmaxx","tl","tm","tmall","tn","to","today","tokyo","tools","top","toray","toshiba","total","tours","town","toyota","toys","tr","trade","trading","training","travel","travelers","travelersinsurance","trust","trv","tt","tube","tui","tunes","tushu","tv","tvs","tw","tz","ua","ubank","ubs","ug","uk","unicom","university","uno","uol","ups","us","uy","uz","va","vacations","vana","vanguard","vc","ve","vegas","ventures","verisign","vermögensberater","vermögensberatung","versicherung","vet","vg","vi","viajes","video","vig","viking","villas","vin","vip","virgin","visa","vision","viva","vivo","vlaanderen","vn","vodka","volvo","vote","voting","voto","voyage","vu","wales","walmart","walter","wang","wanggou","watch","watches","weather","weatherchannel","webcam","weber","website","wed","wedding","weibo","weir","wf","whoswho","wien","wiki","williamhill","win","windows","wine","winners","wme","wolterskluwer","woodside","work","works","world","wow","ws","wtc","wtf","xbox","xerox","xihuan","xin","xxx","xyz","yachts","yahoo","yamaxun","yandex","ye","yodobashi","yoga","yokohama","you","youtube","yt","yun","za","zappos","zara","zero","zip","zm","zone","zuerich","zw","ελ","ευ","бг","бел","дети","ею","католик","ком","мкд","мон","москва","онлайн","орг","рус","рф","сайт","срб","укр","қаз","հայ","ישראל","קום","ابوظبي","ارامكو","الاردن","البحرين","الجزائر","السعودية","العليان","المغرب","امارات","ایران","بارت","بازار","بيتك","بھارت","تونس","سودان","سورية","شبكة","عراق","عرب","عمان","فلسطين","قطر","كاثوليك","كوم","مصر","مليسيا","موريتانيا","موقع","همراه","پاکستان","ڀارت","कॉम","नेट","भारत","भारतम्","भारोत","संगठन","বাংলা","ভারত","ভাৰত","ਭਾਰਤ","ભારત","ଭାରତ","இந்தியா","இலங்கை","சிங்கப்பூர்","భారత్","ಭಾರತ","ഭാരതം","ලංකා","คอม","ไทย","ລາວ","გე","みんな","アマゾン","クラウド","グーグル","コム","ストア","セール","ファッション","ポイント","世界","中信","中国","中國","中文网","亚马逊","企业","佛山","信息","健康","八卦","公司","公益","台湾","台灣","商城","商店","商标","嘉里","嘉里大酒店","在线","大拿","天主教","娱乐","家電","广东","微博","慈善","我爱你","手机","招聘","政务","政府","新加坡","新闻","时尚","書籍","机构","淡马锡","游戏","澳門","点看","移动","组织机构","网址","网店","网站","网络","联通","谷歌","购物","通販","集团","電訊盈科","飞利浦","食品","餐厅","香格里拉","香港","닷넷","닷컴","삼성","한국"]');
  const __viteBrowserExternal = {};
  const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __viteBrowserExternal
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$2 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
  var lib;
  var hasRequiredLib;
  function requireLib() {
    if (hasRequiredLib) return lib;
    hasRequiredLib = 1;
    const ipRegex2 = requireIpRegex();
    const tlds = require$$1;
    const ipv4 = ipRegex2.v4().source;
    const ipv6 = ipRegex2.v6().source;
    const host = "(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)";
    const domain = "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*";
    const strictTld = "(?:[a-z\\u00a1-\\uffff]{2,})";
    const defaultTlds = `(?:${tlds.sort((a, b) => b.length - a.length).join("|")})`;
    const port = "(?::\\d{2,5})?";
    let RE2;
    let hasRE2;
    lib = (options) => {
      options = {
        //
        // attempt to use re2, if set to false will use RegExp
        // (we did this approach because we don't want to load in-memory re2 if users don't want it)
        // <https://github.com/spamscanner/url-regex-safe/issues/28>
        //
        re2: true,
        exact: false,
        strict: false,
        auth: false,
        localhost: true,
        parens: false,
        apostrophes: false,
        trailingPeriod: false,
        ipv4: true,
        ipv6: true,
        returnString: false,
        ...options
      };
      const SafeRegExp = options.re2 && hasRE2 !== false ? (() => {
        if (typeof RE2 === "function") return RE2;
        try {
          RE2 = require$$2;
          return typeof RE2 === "function" ? RE2 : RegExp;
        } catch {
          hasRE2 = false;
          return RegExp;
        }
      })() : RegExp;
      const protocol = `(?:(?:[a-z]+:)?//)${options.strict ? "" : "?"}`;
      const auth = options.auth ? "(?:\\S+(?::\\S*)?@)?" : "";
      const tld = `(?:\\.${options.strict ? strictTld : options.tlds ? `(?:${options.tlds.sort((a, b) => b.length - a.length).join("|")})` : defaultTlds})${options.trailingPeriod ? "\\.?" : ""}`;
      let disallowedChars = '\\s"';
      if (!options.parens) {
        disallowedChars += "\\)";
      }
      if (!options.apostrophes) {
        disallowedChars += "'";
      }
      const path = options.trailingPeriod ? `(?:[/?#][^${disallowedChars}]*)?` : `(?:(?:[/?#][^${disallowedChars}]*[^${disallowedChars}.?!])|[/])?`;
      let regex = `(?:${protocol}|www\\.)${auth}(?:`;
      if (options.localhost) regex += "localhost|";
      if (options.ipv4) regex += `${ipv4}|`;
      if (options.ipv6) regex += `${ipv6}|`;
      regex += `${host}${domain}${tld})${port}${path}`;
      if (options.returnString) return regex;
      return options.exact ? new SafeRegExp(`(?:^${regex}$)`, "i") : new SafeRegExp(regex, "ig");
    };
    return lib;
  }
  var libExports = requireLib();
  const urlRegex = /* @__PURE__ */ getDefaultExportFromCjs(libExports);
  const DATA_URL_DEFAULT_MIME_TYPE = "text/plain";
  const DATA_URL_DEFAULT_CHARSET = "us-ascii";
  const testParameter = (name, filters) => filters.some((filter) => filter instanceof RegExp ? filter.test(name) : filter === name);
  const supportedProtocols = /* @__PURE__ */ new Set([
    "https:",
    "http:",
    "file:"
  ]);
  const hasCustomProtocol = (urlString) => {
    try {
      const { protocol } = new URL(urlString);
      return protocol.endsWith(":") && !protocol.includes(".") && !supportedProtocols.has(protocol);
    } catch {
      return false;
    }
  };
  const normalizeDataURL = (urlString, { stripHash }) => {
    var _a;
    const match = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(urlString);
    if (!match) {
      throw new Error(`Invalid URL: ${urlString}`);
    }
    let { type, data, hash } = match.groups;
    const mediaType = type.split(";");
    hash = stripHash ? "" : hash;
    let isBase64 = false;
    if (mediaType[mediaType.length - 1] === "base64") {
      mediaType.pop();
      isBase64 = true;
    }
    const mimeType = ((_a = mediaType.shift()) == null ? void 0 : _a.toLowerCase()) ?? "";
    const attributes = mediaType.map((attribute) => {
      let [key, value = ""] = attribute.split("=").map((string) => string.trim());
      if (key === "charset") {
        value = value.toLowerCase();
        if (value === DATA_URL_DEFAULT_CHARSET) {
          return "";
        }
      }
      return `${key}${value ? `=${value}` : ""}`;
    }).filter(Boolean);
    const normalizedMediaType = [
      ...attributes
    ];
    if (isBase64) {
      normalizedMediaType.push("base64");
    }
    if (normalizedMediaType.length > 0 || mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE) {
      normalizedMediaType.unshift(mimeType);
    }
    return `data:${normalizedMediaType.join(";")},${isBase64 ? data.trim() : data}${hash ? `#${hash}` : ""}`;
  };
  function normalizeUrl(urlString, options) {
    options = {
      defaultProtocol: "http",
      normalizeProtocol: true,
      forceHttp: false,
      forceHttps: false,
      stripAuthentication: true,
      stripHash: false,
      stripTextFragment: true,
      stripWWW: true,
      removeQueryParameters: [/^utm_\w+/i],
      removeTrailingSlash: true,
      removeSingleSlash: true,
      removeDirectoryIndex: false,
      removeExplicitPort: false,
      sortQueryParameters: true,
      ...options
    };
    if (typeof options.defaultProtocol === "string" && !options.defaultProtocol.endsWith(":")) {
      options.defaultProtocol = `${options.defaultProtocol}:`;
    }
    urlString = urlString.trim();
    if (/^data:/i.test(urlString)) {
      return normalizeDataURL(urlString, options);
    }
    if (hasCustomProtocol(urlString)) {
      return urlString;
    }
    const hasRelativeProtocol = urlString.startsWith("//");
    const isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);
    if (!isRelativeUrl) {
      urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
    }
    const urlObject = new URL(urlString);
    if (options.forceHttp && options.forceHttps) {
      throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
    }
    if (options.forceHttp && urlObject.protocol === "https:") {
      urlObject.protocol = "http:";
    }
    if (options.forceHttps && urlObject.protocol === "http:") {
      urlObject.protocol = "https:";
    }
    if (options.stripAuthentication) {
      urlObject.username = "";
      urlObject.password = "";
    }
    if (options.stripHash) {
      urlObject.hash = "";
    } else if (options.stripTextFragment) {
      urlObject.hash = urlObject.hash.replace(/#?:~:text.*?$/i, "");
    }
    if (urlObject.pathname) {
      const protocolRegex = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g;
      let lastIndex = 0;
      let result = "";
      for (; ; ) {
        const match = protocolRegex.exec(urlObject.pathname);
        if (!match) {
          break;
        }
        const protocol = match[0];
        const protocolAtIndex = match.index;
        const intermediate = urlObject.pathname.slice(lastIndex, protocolAtIndex);
        result += intermediate.replace(/\/{2,}/g, "/");
        result += protocol;
        lastIndex = protocolAtIndex + protocol.length;
      }
      const remnant = urlObject.pathname.slice(lastIndex, urlObject.pathname.length);
      result += remnant.replace(/\/{2,}/g, "/");
      urlObject.pathname = result;
    }
    if (urlObject.pathname) {
      try {
        urlObject.pathname = decodeURI(urlObject.pathname);
      } catch {
      }
    }
    if (options.removeDirectoryIndex === true) {
      options.removeDirectoryIndex = [/^index\.[a-z]+$/];
    }
    if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
      let pathComponents = urlObject.pathname.split("/");
      const lastComponent = pathComponents[pathComponents.length - 1];
      if (testParameter(lastComponent, options.removeDirectoryIndex)) {
        pathComponents = pathComponents.slice(0, -1);
        urlObject.pathname = pathComponents.slice(1).join("/") + "/";
      }
    }
    if (urlObject.hostname) {
      urlObject.hostname = urlObject.hostname.replace(/\.$/, "");
      if (options.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(urlObject.hostname)) {
        urlObject.hostname = urlObject.hostname.replace(/^www\./, "");
      }
    }
    if (Array.isArray(options.removeQueryParameters)) {
      for (const key of [...urlObject.searchParams.keys()]) {
        if (testParameter(key, options.removeQueryParameters)) {
          urlObject.searchParams.delete(key);
        }
      }
    }
    if (!Array.isArray(options.keepQueryParameters) && options.removeQueryParameters === true) {
      urlObject.search = "";
    }
    if (Array.isArray(options.keepQueryParameters) && options.keepQueryParameters.length > 0) {
      for (const key of [...urlObject.searchParams.keys()]) {
        if (!testParameter(key, options.keepQueryParameters)) {
          urlObject.searchParams.delete(key);
        }
      }
    }
    if (options.sortQueryParameters) {
      urlObject.searchParams.sort();
      try {
        urlObject.search = decodeURIComponent(urlObject.search);
      } catch {
      }
    }
    if (options.removeTrailingSlash) {
      urlObject.pathname = urlObject.pathname.replace(/\/$/, "");
    }
    if (options.removeExplicitPort && urlObject.port) {
      urlObject.port = "";
    }
    const oldUrlString = urlString;
    urlString = urlObject.toString();
    if (!options.removeSingleSlash && urlObject.pathname === "/" && !oldUrlString.endsWith("/") && urlObject.hash === "") {
      urlString = urlString.replace(/\/$/, "");
    }
    if ((options.removeTrailingSlash || urlObject.pathname === "/") && urlObject.hash === "" && options.removeSingleSlash) {
      urlString = urlString.replace(/\/$/, "");
    }
    if (hasRelativeProtocol && !options.normalizeProtocol) {
      urlString = urlString.replace(/^http:\/\//, "//");
    }
    if (options.stripProtocol) {
      urlString = urlString.replace(/^(?:https?:)?\/\//, "");
    }
    return urlString;
  }
  function functionTimeout(function_) {
    const wrappedFunction = (...arguments_) => function_(...arguments_);
    Object.defineProperty(wrappedFunction, "name", {
      value: `functionTimeout(${function_.name || "<anonymous>"})`,
      configurable: true
    });
    return wrappedFunction;
  }
  function timeSpan() {
    const start = performance.now();
    const end = () => performance.now() - start;
    end.rounded = () => Math.round(end());
    end.seconds = () => end() / 1e3;
    end.nanoseconds = () => end() * 1e6;
    return end;
  }
  const { toString } = Object.prototype;
  function isRegexp(value) {
    return toString.call(value) === "[object RegExp]";
  }
  const flagMap = {
    global: "g",
    ignoreCase: "i",
    multiline: "m",
    dotAll: "s",
    sticky: "y",
    unicode: "u"
  };
  function clonedRegexp(regexp, options = {}) {
    if (!isRegexp(regexp)) {
      throw new TypeError("Expected a RegExp instance");
    }
    const flags = Object.keys(flagMap).map((flag) => (typeof options[flag] === "boolean" ? options[flag] : regexp[flag]) ? flagMap[flag] : "").join("");
    const clonedRegexp2 = new RegExp(options.source || regexp.source, flags);
    clonedRegexp2.lastIndex = typeof options.lastIndex === "number" ? options.lastIndex : regexp.lastIndex;
    return clonedRegexp2;
  }
  const resultToMatch = (result) => ({
    match: result[0],
    index: result.index,
    groups: result.slice(1),
    namedGroups: result.groups ?? {},
    input: result.input
  });
  function isMatch(regex, string, { timeout } = {}) {
    try {
      return functionTimeout(() => clonedRegexp(regex).test(string), { timeout })();
    } catch (error) {
      throw error;
    }
  }
  function matches(regex, string, { timeout = Number.POSITIVE_INFINITY, matchTimeout = Number.POSITIVE_INFINITY } = {}) {
    if (!regex.global) {
      throw new Error("The regex must have the global flag, otherwise, use `firstMatch()` instead");
    }
    return {
      *[Symbol.iterator]() {
        try {
          const matches2 = string.matchAll(regex);
          while (true) {
            const nextMatch = functionTimeout(() => matches2.next(), { timeout: timeout !== Number.POSITIVE_INFINITY || matchTimeout !== Number.POSITIVE_INFINITY ? Math.min(timeout, matchTimeout) : void 0 });
            const end = timeSpan();
            const { value, done } = nextMatch();
            timeout -= Math.ceil(end());
            if (done) {
              break;
            }
            yield resultToMatch(value);
          }
        } catch (error) {
          {
            throw error;
          }
        }
      }
    };
  }
  const getUrlsFromQueryParameters = (url) => {
    const returnValue = /* @__PURE__ */ new Set();
    const { searchParams } = new URL(url.replace(/^(?:\/\/|(?:www\.))/i, "http://$2"));
    for (const [, value] of searchParams) {
      if (isMatch(urlRegex({ exact: true }), value, { timeout: 500 })) {
        returnValue.add(value);
      }
    }
    return returnValue;
  };
  function getUrls(text, options = {}) {
    if (typeof text !== "string") {
      throw new TypeError(`The \`text\` argument should be a string, got ${typeof text}`);
    }
    if (options.exclude !== void 0 && !Array.isArray(options.exclude)) {
      throw new TypeError("The `exclude` option must be an array");
    }
    const returnValue = /* @__PURE__ */ new Set();
    const add = (url) => {
      try {
        returnValue.add(normalizeUrl(url.trim().replace(/\.+$/, ""), options));
      } catch {
      }
    };
    const results = matches(
      urlRegex(options.requireSchemeOrWww === void 0 ? void 0 : {
        re2: false,
        strict: options.requireSchemeOrWww,
        parens: true
      }),
      text,
      {
        matchTimeout: 500
      }
    );
    for (const { match: url } of results) {
      add(url);
      if (options.extractFromQueryString) {
        const queryStringUrls = getUrlsFromQueryParameters(url);
        for (const queryStringUrl of queryStringUrls) {
          add(queryStringUrl);
        }
      }
    }
    for (const excludedItem of options.exclude ?? []) {
      const regex = new RegExp(excludedItem);
      for (const item of returnValue) {
        if (isMatch(regex, item, { timeout: 500 })) {
          returnValue.delete(item);
        }
      }
    }
    return returnValue;
  }
  const ID = "common-right-click-tab";
  const VERSION = "1.3.1";
  const LAST_VERSION = 2;
  class Store {
    constructor() {
      __publicField(this, "config", null);
      __publicField(this, "ID", `${ID}-config`);
      __publicField(this, "listeners", []);
      this.loadConfig();
      _GM_addValueChangeListener(this.ID, (_key, _oldValue, newValue, remote) => {
        if (remote) {
          this.config = this.configFormat(newValue);
          this.listeners.forEach((listener) => listener(this.config));
        }
      });
    }
    loadConfig() {
      const config = _GM_getValue(this.ID, void 0);
      this.config = this.configFormat(config);
      !config && this.saveConfig();
      console.log("加载配置：", this.config);
    }
    saveConfig() {
      _GM_setValue(this.ID, this.config);
      this.listeners.forEach((listener) => listener(this.config));
    }
    addConfigChangeListener(listener) {
      this.listeners.push(listener);
    }
    configFormat(data) {
      const config = {
        version: LAST_VERSION,
        active: true,
        trigger: "single"
      };
      if (!data) {
        return config;
      }
      if (data.version === 0) ;
      return Object.assign(config, data);
    }
    get active() {
      return this.config.active;
    }
    set active(value) {
      this.config.active = value;
      this.saveConfig();
    }
    get trigger() {
      return this.config.trigger;
    }
    set trigger(value) {
      this.config.trigger = value;
      this.saveConfig();
    }
  }
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3e3,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  class View {
    constructor(store2) {
      __publicField(this, "config", async () => {
        const { isConfirmed, value } = await Swal.fire({
          title: "设置",
          html: `<p style="margin: 0 !important; text-align: left;">超链接打开模式:</p>
      <select id="active-mode" class="swal2-select" style="width: 100%; margin: .75rem 0 !important;">
        <option value="background">后台</option>
        <option value="foreground">前台</option>
      </select>
      <p style="margin: 0 !important; text-align: left;">超链接触发模式:</p>
      <select id="trigger-mode" class="swal2-select" style="width: 100%; margin: .75rem 0 !important;">
        <option value="double">右键双击</option>
        <option value="single">右键单击</option>
      </select>`,
          willOpen: (popup) => {
            const activeMode = popup.querySelector("#active-mode");
            const triggerMode = popup.querySelector("#trigger-mode");
            activeMode.value = this.store.active ? "foreground" : "background";
            triggerMode.value = this.store.trigger;
          },
          preConfirm: () => {
            const activeMode = document.getElementById("active-mode");
            const triggerMode = document.getElementById("trigger-mode");
            return {
              activeMode: activeMode.value,
              triggerMode: triggerMode.value
            };
          },
          showCancelButton: true,
          confirmButtonText: "保存",
          cancelButtonText: "取消"
        });
        if (!isConfirmed) {
          await Toast.fire({
            icon: "warning",
            title: "已取消设置"
          });
          return;
        }
        this.store.active = value.activeMode === "foreground";
        this.store.trigger = value.triggerMode;
        await Toast.fire({
          icon: "success",
          title: "设置已保存"
        });
      });
      this.store = store2;
    }
  }
  const THRESHOLD = 300;
  const CLEANED = 0;
  let timer = CLEANED;
  const store = new Store();
  const view = new View(store);
  console.log(`${ID}(v${VERSION})`);
  function tryGetUrl(element) {
    var _a;
    const selection = (_a = window.getSelection()) == null ? void 0 : _a.toString();
    if (selection) {
      const urls = Array.from(getUrls(selection));
      return urls.length > 0 ? urls[0] : null;
    }
    const link = element.closest("a");
    return (link == null ? void 0 : link.href) || null;
  }
  document.addEventListener("contextmenu", (e) => {
    var _a;
    const href = (_a = tryGetUrl(e.target)) == null ? void 0 : _a.trim();
    if (!href) {
      return;
    }
    if (timer > CLEANED) {
      clearTimeout(timer);
      timer = CLEANED;
      if (store.trigger === "double") {
        e.preventDefault();
        _GM_openInTab(href, { active: store.active });
      }
      return;
    }
    if (store.trigger === "single") {
      e.preventDefault();
    }
    timer = setTimeout(() => {
      timer = CLEANED;
      if (store.trigger === "single") {
        _GM_openInTab(href, { active: store.active });
      }
    }, THRESHOLD);
  });
  _GM_registerMenuCommand("修改配置", view.config);

})(Swal);