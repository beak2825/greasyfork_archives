// ==UserScript==
// @name                福利吧论坛 - 好孩子看得见
// @name:zh-TW          福利吧論壇 - 好孩子看得見
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://greasyfork.org/zh-CN/users/193133-pana
// @version             9.4.3
// @description         好孩子才看得见，论坛小助手
// @description:zh-TW   好孩子才看得見，論壇小助手
// @author              pana
// @include             /www.wnflb\d*.com/
// @require             https://cdn.bootcss.com/crypto-js/4.0.0/core.min.js
// @require             https://cdn.bootcss.com/crypto-js/4.0.0/enc-base64.min.js
// @require             https://gcore.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @require             https://greasyfork.org/scripts/403716-gm-config-cn/code/GM_config_CN.js
// @connect             pan.baidu.com
// @connect             keyfc.net
// @grant               GM_info
// @grant               GM_setClipboard
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_registerMenuCommand
// @grant               GM_xmlhttpRequest
// @grant               GM_addStyle
// @run-at              document-start
// @noframes
// @license             GNU General Public License v3.0 or later
// @note                注意: 9.0.0 以前的版本的配置不兼容新版本，若之前改动过默认设置，请升级后重新设置一遍
// @downloadURL https://update.greasyfork.org/scripts/381494/%E7%A6%8F%E5%88%A9%E5%90%A7%E8%AE%BA%E5%9D%9B%20-%20%E5%A5%BD%E5%AD%A9%E5%AD%90%E7%9C%8B%E5%BE%97%E8%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/381494/%E7%A6%8F%E5%88%A9%E5%90%A7%E8%AE%BA%E5%9D%9B%20-%20%E5%A5%BD%E5%AD%A9%E5%AD%90%E7%9C%8B%E5%BE%97%E8%A7%81.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (typeof GM_config == 'undefined') {
    console.error('福利吧论坛 - 好孩子看得见:\nGM_config 库文件加载失败，脚本无法正常工作，请尝试刷新网页以重新加载。');
  } else if (typeof document.arrive == 'undefined') {
    console.error('福利吧论坛 - 好孩子看得见:\narrive 库文件加载失败，脚本可能无法正常工作，请尝试刷新网页以重新加载。');
  } else if (typeof CryptoJS == 'undefined') {
    console.warn('福利吧论坛 - 好孩子看得见:\nCryptoJS 库文件加载失败，BASE64 编解码功能无法使用。');
  } else {
    console.debug('福利吧论坛 - 好孩子看得见:\n脚本工作环境正常。');
  }
  const icon = {
    settings: 'url(https://cdn.jsdelivr.net/gh/LightAPIs/PicGoImg@master/img/settings.svg)',
    codeGray: 'url(https://cdn.jsdelivr.net/gh/LightAPIs/PicGoImg@master/img/code_gray.svg)',
    codeBlue: 'url(https://cdn.jsdelivr.net/gh/LightAPIs/PicGoImg@master/img/code_blue.svg)',
    modeNight: 'url(https://cdn.jsdelivr.net/gh/LightAPIs/PicGoImg@master/img/mode_night.svg)',
    modeDay: 'url(https://cdn.jsdelivr.net/gh/LightAPIs/PicGoImg@master/img/mode_day.svg)',
    signatureAdd: 'url(https://cdn.jsdelivr.net/gh/LightAPIs/PicGoImg@master/img/signature_add.svg)',
    signatureMinus: 'url(https://cdn.jsdelivr.net/gh/LightAPIs/PicGoImg@master/img/signature_minus.svg)',
    collapsedYes: 'static/image/common/collapsed_yes.gif',
    collapsedNo: 'static/image/common/collapsed_no.gif',
  };
  const style = {
    settings: `
      #myGoodBoyConfig input, #myGoodBoyConfig button {
        cursor: pointer;
      }
      #myGoodBoyConfig .reset_holder {
        float: left;
        position: relative;
        bottom: -3vh;
      }
      #myGoodBoyConfig .section_header a {
        color: #F5F9FB;
        text-decoration: none;
      }
      `,
    codePanel: `
      #myCodePanel input, #myCodePanel button {
        cursor: pointer;
      }
      #myCodePanel_bjxEncodeBtn_var, #myCodePanel_bjxDecodeBtn_var,
      #myCodePanel_coreValuesEncodeBtn_var, #myCodePanel_coreValuesDecodeBtn_var,
      #myCodePanel_yflcEncodeBtn_var, #myCodePanel_yflcDecodeBtn_var,
      #myCodePanel_base64EncodeBtn_var, #myCodePanel_base64DecodeBtn_var,
      #myCodePanel_baiduQueryBtn_var {
        display: inline;
      }
      #myCodePanel {
        width: 600px !important;
        height: 430px !important;
      }
      #myCodePanel .reset_holder {
        float: left;
        position: relative;
        bottom: -1vh;
      }
      #myCodePanel .nav-tabs {
        text-align: center;
      }
      #myCodePanel .nav-tabs > div {
        padding: 5px 20px;
      }
      #myCodePanel #myCodePanel_saveBtn {
        display: none;
      }
      #myCodePanel #myCodePanel_resetLink {
        text-decoration: underline;
      }
      #myCodePanel textarea {
        width: 96%;
      }
      `,
    night: `
      html, body, .bm, .bdl, .bdl dt, .bdl dd.bdl_a a, .tb .a a, .pn, .fl .bm_h, .ct2_a, .ct3_a, .t_table, table.plhin {
        background-color: #282A36 !important;
        background-blend-mode: multiply;
      }
      .bdl dl.a, .tl .th, .tl .ts th, .tl .ts td, .pg a, .pg strong, .pgb a, .pg label, .bml .bm_h, #scrolltop a, .bmn, .bm_h, td.pls, .ad td.plc, div.exfm, .tb a, .tb_h, .ttp li.a a, div.uo a, input#addsubmit_btn, #gh .bm .bm_h, .jump_bdl li, .newthread tr th, .newthread tr td, .tl .threadpre td, .tl .threadpre:hover td, .nfl .f_c, #myCodePanel {
        background-color: #282A36 !important;
      }
      #nv, .card_gender_0, .card .o a, .tbn li.a, #p_btn a, #p_btn i {
        background: #40444D !important;
      }
      #toptb, .tedt .bar, .edt .bar, .edt .bbar, #post_extra_tb label.a, #extcreditmenu.a, #g_upmine.a, .tl #forumnewshow, .jump_bdl .a a, .jump_bdl .a a:hover, .psth, .pl .quote, .pm_tac, .pm .c, .pml .hover, #uhd, #flw_header .bar, .ttp a, .ttp strong, .bmw .bm_h, .GzList ul li a, .m_c, .m_c .o, .dt th, .section_header_holder p, #fx_checkin_menu,#fx_checkin_menub, .pl .blockcode ol li:hover {
          background-color: #40444D !important;
      }
      #nv li a:hover, #nv li.hover a, #nv li.hover a:hover, #nv > a {
        background: #1A1A1A !important;
        background-blend-mode: multiply;
      }
      .p_pop, .p_pof, .sllt, .tl #forumnewshow a:hover, #autopbn:hover, .pgbtn a:hover, #hiddenpoststip {
        background-color: #1A1A1A !important;
      }
      #threadlist > div > table > tbody > tr:hover > *, #threadlist > div > form > table > tbody > tr:not(.threadpre):hover > *, div.tl > form > table > tbody > tr:hover > * {
        background-color: #1A1A1A !important;
      }
      .p_pop a:hover {
        background: #3D3D3D !important;
      }
      a, #um, #um a, body, input, button, select, textarea, .xi2, .xi2 a, .pg a, .pg strong, .pgb a, .pg label, .jump_bdl a, div#forum_rules_37 font {
        color: #C0C0C0 !important;
      }
      .tps a, .chart em {
        color: #666 !important;
      }
      .GzList ul li a {
        color: #000 !important !important;
      }
      .tedt .pt, .px, .pt, .ps, select, input,
      #myCodePanel textarea, #myCodePanel button
      {
        background-color: #38383D !important;
      }
      .pl .blockcode {
        background: #38383D !important;
      }
      ul.cl.nav li a, ul.cl.nav li a:hover {
        background-repeat: no-repeat !important;
        background-position: 50% 5px !important;
      }
      #fastpostsmilie_88_td, #fx_checkin_topb, #hd h2 a,#newspecial, #newspecialtmp, #post_reply, #post_replytmp, .ico_fall, .ico_increase, .o img, fieldset legend, div.ac1 {
        mix-blend-mode: multiply;
      }
      .p_pop a, .tl #forumnewshow a {
        filter: brightness(.7);
      }
      #category_36 tbody td p>a, .bm_c tbody h2>a, .common font, .fl .bm_h h2 a, .tl th a, .xw0.xi1, .y.xg1 font {
        mix-blend-mode: color-dodge;
      }
      .ignore_notice {
        right: -3px !important;
        top: -53px !important;
      }
      .tps a:hover {
        background-color: #C0C0C0 !important;
      }
      `,
    basic: `
      .my_good_boy_div_float {
        position: absolute;
        max-width: 430px;
        padding-left: 20px;
        padding-right: 10px;
        margin-left: 962px;
        margin-top: -170px;
        border: 2px solid #CDCDCD;
        border-radius: 8px;
      }
      .my_good_boy_div_basic {
        margin-top: 10px;
      }
      .my_good_boy_p {
        color: red;
        font-size: 15px;
      }
      .my_good_boy_p_float {
        margin-left: 0px !important;
      }
      .my_good_boy_li {
        list-style-type: disc;
        white-space: nowrap;
      }
      .my_good_boy_a {
        display: inline;
        font-size: 15px;
        white-space: nowrap;
      }
      .my_good_boy_a_copy {
        display: inline-block;
        font-size: 15px;
        margin-left: 20px;
        text-decoration: underline;
      }
      .a_copy_completed {
        color: #F60 !important;
      }
      .link_faild {
        color: #999 !important;
        text-decoration: line-through !important;
      }
      .show_more_link {
        text-decoration: underline;
      }
      #settingsIcon {
        display: block;
        float: right;
        cursor: pointer;
        margin-top: 5px;
        width: 23px;
        height: 18px;
        background-image: ${icon.settings};
        background-repeat: no-repeat;
        background-size: 16px auto;
        background-position: center;
      }
      .expand_box {
        bottom: 0px;
        height: 60px;
        position: fixed;
        right: -6vw;
        transition: 0.5s;
        width: 12vw;
        z-index: 999;
      }
      .expand_box_h {
        bottom: 0px;
        height: 120px;
        position: fixed;
        right: -6vw;
        transition: 0.5s;
        width: 12vw;
        z-index: 999;
      }
      .show_expand_box {
        right: 0;
        width: 6vw;
      }
      #myCodeSpan {
        background-image: ${icon.codeGray};
        background-repeat: no-repeat;
        background-size: 32px auto;
        background-position: center;
        background-color: #787878;
        border-radius: 19px;
        border: 1px solid #787878;
        bottom: 10px;
        color: #FFF;
        cursor: pointer;
        display: block;
        font-size: 13px;
        height: 38px;
        line-height: 38px;
        position: absolute;
        right: 1vw;
        text-align: center;
        width: 38px;
        z-index: 999;
      }
      #myCodeSpan:hover {
        box-shadow: 0 0 5px green;
        background-image: ${icon.codeBlue};
      }
      #myNightSpan {
        background-repeat: no-repeat;
        background-size: 32px auto;
        background-position: center;
        background-color: #00A1D6;
        border-radius: 19px;
        border: 1px solid #00A1D6;
        bottom: 10px;
        color: #FFF;
        cursor: pointer;
        display: block;
        font-size: 13px;
        height: 38px;
        line-height: 38px;
        position: absolute;
        right: 1vw;
        text-align: center;
        width: 38px;
        z-index: 999;
      }
      #myNightSpan_2 {
        background-repeat: no-repeat;
        background-size: 32px auto;
        background-position: center;
        background-color: #00A1D6;
        border-radius: 19px;
        border: 1px solid #00A1D6;
        bottom: 60px;
        color: #FFF;
        cursor: pointer;
        display: block;
        font-size: 13px;
        height: 38px;
        line-height: 38px;
        position: absolute;
        right: 1vw;
        text-align: center;
        width: 38px;
        z-index: 999;
      }
      #myNightSpan:hover, #myNightSpan_2:hover {
        box-shadow: 0 0 5px green;
      }
      .collapsed_hide {
        display: none;
      }
      .signature_switch_div {
        width: 16px;
        height: 16px;
        display: block;
        position: relative;
        top: -5px;
        cursor: pointer;
        background-image: ${icon.signatureMinus};
        background-size: 16px auto;
        background-repeat: no-repeat;
        background-position: center;
      }
      .signature_switch_close {
        background-image: ${icon.signatureAdd};
      }
      .signature_hide {
        display: none;
      }
      `,
  };
  const reg = {
    url: /^[\S\s]*?(magnet:\?xt=urn:btih:(?:[a-z0-9]{40}|[a-z0-9]{32})|ftp:\/\/\S*|ed2k:\/\/\S*|thunder:\/\/\S*|flashget:\/\/\S*|qqdl:\/\/\S*|xfplay:\/\/\S*|https?:\/\/[\w零一二三四五六七八九壹贰叁肆伍陆柒捌玖-]*\.?[\w零一二三四五六七八九壹贰叁肆伍陆柒捌玖-]+\.+\w+\S*)/i,
    download: /^[\S\s]*?(magnet:\?xt=urn:btih:(?:[a-z0-9]{40}|[a-z0-9]{32})|ed2k:\/\/\S*|thunder:\/\/\S*)/i,
    www: /^[\S\s]*?(www\.[\w-]+\.[a-z]+[\w#=%+?/-]*)/i,
    baidupan: /^https?:\/\/pan\.baidu\.com\/s(?:hare)?\/[\w=?&-]+$/i,
    baidupanIncludeCode: /^https?:\/\/pan\.baidu\.com\/s(?:hare)?\/[\w=?#&-]+$/i,
    code: /(?:提取)+[^a-z0-9解压]*([a-z0-9]{4})[^a-z0-9]*/i,
    baidupanCode: /^(?:(?:下载)?链接\S+\s+)?(?:[^解压]+\s+)?[^a-z0-9解压]*([a-z0-9]{4})[^a-z0-9]*(?:app)?[^a-z0-9]*$/i,
    singleCharCode: /^[a-z0-9]$/i,
    missingHeaderBaidupan: /^[\S\s]*?[^/\w-]?((?<!xunlei\.com\/)s(?:hare)?\/[\w=?-]{10,50})/i,
    missingHeaderBaidupanTest: /^([\w=?-]{15,50})\s+[a-z0-9]{4}$/i,
    pan: /^[\S\s]*?(pan\.(?:baidu|xunlei|lanzou)\.com\/?s?(?:hare)?\/[\w=?&-]+)/i,
    hash: /(?:[^a-z0-9]|^)([a-z0-9]{40}|[a-z0-9]{32})(?:&dn=.*|[^a-z0-9]|$)/i,
    md5: /(?:md5[^a-z0-9]+|sha1[^a-z0-9]+)/i,
    core: /^.*?((?:富强|民主|文明|和谐|自由|平等|公正|法治|爱国|敬业|诚信|友善){10,}).*?$/i,
    baijia:
      /^.*?([赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻福水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳唐罗薛伍余米贝姚孟顾尹江钟]{10,}).*?$/i,
    foyu: /^.*?((?:佛曰：|如是我闻：)\S{10,}).*?$/i,
    prefixLinkMagnet: /^https?:\/\/www\.wnflb\d*\.com\/magnet:\?xt=.*$/i,
    prefixLinkMagnetReplace: /^https?:\/\/www\.wnflb\d*\.com\//i,
    prefixCode: /^https?:\/\/www\.wnflb\d*\.com\/(\w+-\w+$|chrome-extension:\/\/)/i,
    prefixHash: /^https?:\/\/www\.wnflb\d*\.com\/([a-z0-9]{40}|[a-z0-9]{32})$/i,
    prefixUrl: /^https?:\/\/www\.wnflb\d*\.com\/(www\..*$|.*\.(?:com|net|cn|org|site|info|edu|gov)$)/i,
    redircdn: /^https?:\/\/to\.redircdn\.com\/\?(.*)&z$/i,
    prefixReplace: /^https?:\/\/www\.wnflb\d*\.com\//i,
    baseImage: /^https?:\/\/(data:)/i,
  };
  const filterReg = [
    /^https?:\/\/pan\.baidu\.com\/(?:s|share|mbox)?\/[\w#?%=/&-]*[^\w#?%=/&-]+/i,
    /^https?:\/\/www\.52pojie\.cn\/?#?$/i,
    /^https?:\/\/www\.52pojie\.cn\/(?:forum|home|misc)\.php\?/i,
    /^https?:\/\/www\.52pojie\.cn\/(?:forum|thread)-\d+-\d+(?:-\d+)?\.html$/i,
    /^https?:\/\/www\.wnflb\d*\.com\/?$/i,
    /^https?:\/\/www\.wnflb\d*\.com\/(?:home|forum)\.php\?/i,
    /^https?:\/\/www\.wnflb\d*\.com\/(?:thread|forum)-\d+-\d+(?:-\d+)?\.html$/i,
    /^https?:\/\/www\.imdb\.com\/title\//i,
    /^https?:\/\/movie\.douban\.com\/(?:subject|celebrity)/i,
    /^https?:\/\/photo\.weibo\.com\//i,
    /^https?:\/\/s\.weibo\.com\/weibo\?q=/i,
    /^https?:\/\/baike\.(?:so|baidu|sogou)\.com/i,
    /^https?:\/\/app\.bilibili\.com/i,
    /^https?:\/\/bbs\.zhiyoo\.com\/(?:forum|gforum)-\d+-\d+\.html/i,
    /^https?:\/\/www\.3dmgame\.com\/tag\//i,
    /^https?:\/\/www\.3dmgame\.com\/games\/[^/]*\/?$/i,
    /^https?:\/\/www\.tv432\.com\/search\.php\?searchword=/i,
    /^https?:\/\/www\.viidii\.info\/\?/i,
    /^https?:\/\/www\.daybox\.net\/image\//i,
    /^https?:\/\/www\.yidianzixun\.com\/channel\//i,
    /^https?:\/\/[\w-]*\.?sina\.com\.cn\/?/i,
    /^https?:\/\/(?:www|post)\.smzdm\.com\/(?:fenlei|p)\//i,
    /^https?:\/\/laod\.cn\/tag\//i,
    /^https?:\/\/www\.smmimg\.com\/i\//i,
  ];
  const coreValues = '富强民主文明和谐自由平等公正法治爱国敬业诚信友善';
  const baijiaValues = {
    赵: '0',
    钱: '1',
    孙: '2',
    李: '3',
    周: '4',
    吴: '5',
    郑: '6',
    王: '7',
    冯: '8',
    陈: '9',
    褚: 'a',
    卫: 'b',
    蒋: 'c',
    沈: 'd',
    韩: 'e',
    杨: 'f',
    朱: 'g',
    秦: 'h',
    尤: 'i',
    许: 'j',
    何: 'k',
    吕: 'l',
    施: 'm',
    张: 'n',
    孔: 'o',
    曹: 'p',
    严: 'q',
    华: 'r',
    金: 's',
    魏: 't',
    陶: 'u',
    姜: 'v',
    戚: 'w',
    谢: 'x',
    邹: 'y',
    喻: 'z',
    福: 'A',
    水: 'B',
    窦: 'C',
    章: 'D',
    云: 'E',
    苏: 'F',
    潘: 'G',
    葛: 'H',
    奚: 'I',
    范: 'J',
    彭: 'K',
    郎: 'L',
    鲁: 'M',
    韦: 'N',
    昌: 'O',
    马: 'P',
    苗: 'Q',
    凤: 'R',
    花: 'S',
    方: 'T',
    俞: 'U',
    任: 'V',
    袁: 'W',
    柳: 'X',
    唐: 'Y',
    罗: 'Z',
    薛: '.',
    伍: '-',
    余: '_',
    米: '+',
    贝: '=',
    姚: '/',
    孟: '?',
    顾: '#',
    尹: '%',
    江: '&',
    钟: '*',
    高: ':',
    田: '|',
  };
  const status = {
    nightEnable: GM_config.getValue('nightEnable', false),
    collapsedGwwzEnable: GM_config.getValue('collapsedGwwzEnable', false),
    accessNum: GM_config.getValue('accessNumber', 90),
    nightStyleDom: null,
    checkDate: GM_config.getValue('checkDate', '2000-1-1'),
    oldUrl: location.href,
    timer1: null,
    timer2: null,
    timer3: null,
    timer4: null,
  };
  class Good_Boy {
    constructor(config, linkArray = []) {
      this.config = config;
      this.floatEnable = this.isMobilePage() ? false : config.get('displayPosition') == '右侧';
      this.linkArray = linkArray;
      this.totalCount = linkArray.length;
      this.currentCount = 0;
      this.showMoreStatus = false;
      this.insertUlStatus = false;
      this.ulNode = document.createElement('ul');
    }
    insertLinkItem(linkArray = []) {
      this.linkArray = this.linkArray.concat(linkArray);
      this.totalCount = this.linkArray.length;
      if (this.currentCount < this.config.get('maxLinkNumber') || this.config.get('maxLinkNumber') < 0) {
        for (; this.currentCount < this.totalCount && this.currentCount != this.config.get('maxLinkNumber'); this.currentCount++) {
          const tempA = this.createLink(this.linkArray[this.currentCount]);
          tempA && this.ulNode.appendChild(tempA);
        }
      }
      if (this.config.get('maxLinkNumber') > -1 && this.totalCount > this.config.get('maxLinkNumber')) {
        this.ulNode.getElementsByTagName('p')[0].textContent =
          '[共提取到 ' + this.totalCount + ' 个链接，仅显示前 ' + this.config.get('maxLinkNumber') + ' 个]:';
        if (!this.showMoreStatus) {
          this.ulNode.appendChild(this.showMoreLink());
          this.showMoreStatus = true;
        }
      } else {
        this.ulNode.getElementsByTagName('p')[0].textContent = '[共提取到 ' + this.totalCount + ' 个链接]:';
      }
    }
    isMobilePage() {
      return /android|webos|iphone|ipod|blackberry/i.test(navigator.userAgent);
    }
    getCutLinkText(linkText) {
      if (this.isMobilePage()) {
        return linkText.length >= 35 ? linkText.slice(0, 15) + ' ... ' + linkText.slice(-10) : linkText;
      } else if (this.floatEnable) {
        return linkText.length >= 50 ? linkText.slice(0, 25) + ' ... ' + linkText.slice(-15) : linkText;
      }
      return linkText.length >= 80 ? linkText.slice(0, 45) + ' ... ' + linkText.slice(-25) : linkText;
    }
    managePrefixCode(inputLink) {
      const { prefixCode, prefixHash, prefixReplace, prefixUrl, redircdn } = reg;
      if (prefixCode.test(inputLink)) {
        return inputLink.replace(prefixReplace, '');
      } else if (prefixHash.test(inputLink)) {
        return inputLink.replace(prefixReplace, 'magnet:?xt=urn:btih:');
      } else if (prefixUrl.test(inputLink)) {
        return inputLink.replace(prefixReplace, 'http://');
      } else if (redircdn.test(inputLink)) {
        return inputLink.replace(redircdn, '$1').replace('______', '.');
      }
      return inputLink;
    }
    createLink(linkHref) {
      const { baidupanIncludeCode } = reg;
      if (linkHref.length > 2000) {
        return null;
      }
      const linkLi = document.createElement('li');
      linkLi.className = 'my_good_boy_li';
      const linkA = document.createElement('a');
      linkA.title = '点击访问';
      linkHref = this.managePrefixCode(linkHref);
      linkA.className = 'my_good_boy_a';
      linkA.href = encodeURI(linkHref);
      linkA.target = '_blank';
      linkA.textContent = this.getCutLinkText(linkHref);
      linkA.style.color = this.config.get('linkColor');
      linkLi.appendChild(linkA);
      if (this.config.get('copyEnable')) {
        const copyA = document.createElement('a');
        copyA.className = 'my_good_boy_a_copy';
        copyA.title = '复制链接';
        copyA.href = 'javascript:;';
        copyA.target = '_self';
        copyA.textContent = '复制';
        copyA.style.color = this.config.get('linkColor');
        copyA.addEventListener('click', function () {
          GM_setClipboard(linkHref, 'text');
          this.classList.add('a_copy_completed');
          this.title = '复制成功';
          status.timer1 && clearTimeout(status.timer1);
          status.timer1 = setTimeout(() => {
            this.classList.remove('a_copy_completed');
            this.title = '复制链接';
          }, 2000);
        });
        linkLi.appendChild(copyA);
        if (baidupanIncludeCode.test(linkHref) && /(?:#|\?pwd=)[a-z0-9]{4}$/i.test(linkHref)) {
          const codeValue = /#([a-z0-9]{4})$/i.exec(linkHref)[1];
          const codeCopyA = document.createElement('a');
          codeCopyA.className = 'my_good_boy_a_copy';
          codeCopyA.title = '复制提取码';
          codeCopyA.href = 'javascript:;';
          codeCopyA.target = '_self';
          codeCopyA.textContent = '复制提取码';
          codeCopyA.style.color = this.config.get('linkColor');
          codeCopyA.addEventListener('click', function () {
            GM_setClipboard(codeValue, 'text');
            this.classList.add('a_copy_completed');
            this.title = '复制成功';
            status.timer2 && clearTimeout(status.timer2);
            status.timer2 = setTimeout(() => {
              this.classList.remove('a_copy_completed');
              this.title = '复制提取码';
            }, 2000);
          });
          linkLi.appendChild(codeCopyA);
        }
      }
      this.config.get('checkEnable') && baidupanIncludeCode.test(linkHref) && this.checkBaidupan(linkHref, linkA);
      return linkLi;
    }
    showMoreLink() {
      const linkLi = document.createElement('li');
      linkLi.className = 'my_good_boy_li';
      const linkA = document.createElement('a');
      linkA.className = 'my_good_boy_a show_more_link';
      linkA.href = 'javascript:;';
      linkA.title = '显示全部提取链接';
      linkA.textContent = '显示全部';
      linkA.target = '_self';
      linkA.style.color = this.config.get('linkColor');
      linkA.addEventListener(
        'click',
        () => {
          this.ulNode.removeChild(linkLi);
          for (; this.currentCount < this.totalCount; this.currentCount++) {
            const tempA = this.createLink(this.linkArray[this.currentCount]);
            tempA && this.ulNode.appendChild(tempA);
          }
          this.ulNode.getElementsByTagName('p')[0].textContent = '[共提取到 ' + this.totalCount + ' 个链接]:';
          this.showMoreStatus = false;
        },
        false
      );
      linkLi.appendChild(linkA);
      return linkLi;
    }
    createGoodBoyFrame(container, linkArray = []) {
      if (this.insertUlStatus) {
        this.insertLinkItem(linkArray);
      } else {
        const goodBoyDiv = document.createElement('div');
        goodBoyDiv.className = this.floatEnable ? 'my_good_boy_div_float' : 'my_good_boy_div_basic';
        const goodBoyP = document.createElement('p');
        goodBoyP.className = this.floatEnable ? 'my_good_boy_p my_good_boy_p_float' : 'my_good_boy_p';
        this.ulNode.appendChild(goodBoyP);
        this.insertLinkItem(linkArray);
        goodBoyDiv.appendChild(this.ulNode);
        container.appendChild(goodBoyDiv);
        this.insertUlStatus = true;
      }
    }
    createGoodBoyElement(container, linkObj, textObj, nodeTextArray) {
      const backLinkArray = this.autoEvent(
        container,
        linkObj.linkObjArray,
        linkObj.baiduObjArray,
        linkObj.linksArray,
        textObj.hideTextArray,
        textObj.showTextArray,
        nodeTextArray
      );
      backLinkArray.length > 0 && this.createGoodBoyFrame(container, backLinkArray);
    }
    managePrefix(inputLinkArray) {
      const { prefixLinkMagnet, prefixLinkMagnetReplace } = reg;
      const returnLinkArray = [];
      inputLinkArray.forEach(item => {
        returnLinkArray.push(prefixLinkMagnet.test(item) ? item.replace(prefixLinkMagnetReplace, '') : item);
      });
      return returnLinkArray;
    }
    pickUpMagnet(item) {
      const { url, download, hash, md5 } = reg;
      let tempLink = '';
      const item1 = item.replace(/[^a-z0-9:=?/\\.&%|-]/gi, '');
      if (download.test(item1)) {
        tempLink = download.exec(item1)[1];
      } else {
        const item2 = item.replace(/[^a-z0-9:=?/\\.,，。|\s+-]/gi, '');
        if (!md5.test(item2) && hash.test(item2) && !url.test(item2)) {
          const tempHash = hash.exec(item2)[1];
          if (!/^(?:[a-z]+|[0-9]+)$/i.test(tempHash)) {
            tempLink = 'magnet:?xt=urn:btih:' + tempHash;
          }
        }
      }
      return tempLink;
    }
    manageText(textArray) {
      const { url, download, www, missingHeaderBaidupan, missingHeaderBaidupanTest, pan, hash, md5 } = reg;
      const tempArray = [];
      textArray.forEach(item => {
        let tempLink = '';
        if (pan.test(item)) {
          tempLink = 'https://' + pan.exec(item)[1];
        } else if (/magnet:|ed2k:|thunder:/i.test(item)) {
          if (download.test(item)) {
            tempLink = download.exec(item)[1];
          }
        } else if (url.test(item)) {
          tempLink = url.exec(item)[1];
        } else if (www.test(item)) {
          tempLink = 'http://' + www.exec(item)[1];
        } else if (missingHeaderBaidupan.test(item)) {
          const linkMissValue = missingHeaderBaidupan.exec(item)[1];
          tempLink = /^\//i.test(linkMissValue) ? 'https://pan.baidu.com' + linkMissValue : 'https://pan.baidu.com/' + linkMissValue;
        } else if (missingHeaderBaidupanTest.test(item)) {
          tempLink = 'https://pan.baidu.com/s/' + missingHeaderBaidupanTest.exec(item)[1];
        } else if (!md5.test(item) && hash.test(item)) {
          tempLink = 'magnet:?xt=urn:btih:' + hash.exec(item)[1];
        } else if (item.length > 32) {
          tempLink = this.pickUpMagnet(item);
        }
        filterLink(tempLink) && tempArray.push(tempLink);
      });
      return this.managePrefix(tempArray);
    }
    decodeLink(inputLinkArray) {
      const { url } = reg;
      inputLinkArray.forEach((item, index) => {
        if (url.test(item)) {
          inputLinkArray[index] = decodeURI(item);
        }
      });
      return inputLinkArray;
    }
    pickUpBaidupanCode(textArray) {
      const { code, baidupanCode, singleCharCode } = reg;
      const codeArray = [];
      const charArray = [];
      textArray.forEach(item => {
        let tempValue = '';
        if (code.test(item)) {
          tempValue = code.exec(item)[1];
        } else if (baidupanCode.test(item)) {
          tempValue = baidupanCode.exec(item)[1];
        } else if (singleCharCode.test(item)) {
          charArray.push(item);
        }
        if (tempValue && !/\d{4}/i.test(tempValue) && codeArray.indexOf(tempValue) === -1) {
          codeArray.push(tempValue);
        }
      });
      while (charArray.length > 0 && charArray.length % 4 === 0) {
        const tempCode = charArray.splice(0, 4);
        const charValue = tempCode.join('');
        if (!/\d{4}/i.test(charValue) && codeArray.indexOf(charValue) === -1) {
          codeArray.push(charValue);
        }
      }
      return codeArray;
    }
    manageRepeatArray(inputLinkArray) {
      const outputLinkArray = [];
      for (let i = 0, l = inputLinkArray.length; i < l; i++) {
        for (let j = i + 1; j < l; j++) {
          if (getPureLink(inputLinkArray[i]) === getPureLink(inputLinkArray[j])) {
            ++i;
            j = i;
          }
        }
        outputLinkArray.push(inputLinkArray[i]);
      }
      return outputLinkArray;
    }
    splitWrap(textArray) {
      let tempArray = [];
      textArray.forEach(text => {
        if (text) {
          tempArray = tempArray.concat(text.split('\n').filter(v => v));
        }
      });
      return tempArray;
    }
    autoEvent(container, linkObjArray, baiduObjArray, _linksArray, hideTextArray, showTextArray, nodeTextArray) {
      const { url, baidupan, hash, md5 } = reg;
      const linkArray = [];
      const linkTextArray = [];
      linkObjArray.forEach(item => {
        linkArray.push(item.eleValue);
        linkTextArray.push(item.eleContainer);
      });
      if (hideTextArray.length > 0) {
        hideTextArray = this.splitWrap(hideTextArray);
      }
      if (showTextArray.length > 0) {
        showTextArray = this.splitWrap(showTextArray);
      }
      if (nodeTextArray.length > 0) {
        nodeTextArray = this.splitWrap(nodeTextArray);
      }
      const concatTextArray = this.manageRepeatArray(this.decodeLink(hideTextArray));
      let concatLinkArray = this.manageRepeatArray(this.decodeLink(this.manageText(linkArray.concat(concatTextArray))));
      const generalTextArray = showTextArray.concat(nodeTextArray.concat(linkTextArray));
      const indexA = [];
      const codeB = this.pickUpBaidupanCode(concatTextArray);
      let codeC = [];
      if (codeB.length > 0) {
        for (let j = 0; j < concatLinkArray.length; j++) {
          if (baidupan.test(concatLinkArray[j])) {
            indexA.push(j);
          }
        }
        if (codeB.length === indexA.length) {
          for (let k = 0; k < indexA.length; k++) {
            if (!/\?pwd=/.test(concatLinkArray[indexA[k]])) {
              concatLinkArray[indexA[k]] += '?pwd=' + codeB[k];
            }
          }
        } else if (codeB.length === baiduObjArray.length) {
          for (let l = 0; l < baiduObjArray.length; l++) {
            if (!/\?pwd=/.test(baiduObjArray[l].ele.href)) {
              baiduObjArray[l].ele.textContent = baiduObjArray[l].eleContainer + '?pwd=' + codeB[l];
              baiduObjArray[l].ele.href = baiduObjArray[l].eleValue + '?pwd=' + codeB[l];
            }
          }
        }
      } else {
        codeC = this.pickUpBaidupanCode(generalTextArray);
        if (codeC.length > 0) {
          for (let j = 0; j < concatLinkArray.length; j++) {
            if (baidupan.test(concatLinkArray[j])) {
              indexA.push(j);
            }
          }
          if (codeC.length === indexA.length) {
            for (let k = 0; k < indexA.length; k++) {
              concatLinkArray[indexA[k]] += '?pwd=' + codeC[k];
            }
          } else if (codeC.length === baiduObjArray.length) {
            for (let l = 0; l < baiduObjArray.length; l++) {
              baiduObjArray[l].ele.textContent = baiduObjArray[l].eleContainer + '?pwd=' + codeC[l];
              baiduObjArray[l].ele.href = baiduObjArray[l].eleValue + '?pwd=' + codeC[l];
            }
          }
        }
      }
      let hashArray = [];
      generalTextArray.forEach(item => {
        if (!url.test(item)) {
          if (!md5.test(item) && hash.test(item)) {
            hashArray.push('magnet:?xt=urn:btih:' + hash.exec(item)[1]);
          } else if (item.length > 32) {
            let temp_link = this.pickUpMagnet(item);
            temp_link && hashArray.push(temp_link);
          }
        }
      });
      hashArray = this.decodeLink(hashArray);
      concatLinkArray = this.manageRepeatArray(concatLinkArray.concat(hashArray));
      if (this.config.get('checkEnable')) {
        for (let p of baiduObjArray) {
          this.checkBaidupan(p.eleValue, p.ele);
        }
      }
      const hideCodeTextArray = this.decodeCoreValues(container, hideTextArray.concat(generalTextArray));
      if (hideCodeTextArray.length > 0) {
        hideCodeTextArray.forEach((item, index) => {
          if (!url.test(item)) {
            if (!md5.test(item) && hash.test(item)) {
              hideCodeTextArray[index] = 'magnet:?xt=urn:btih:' + hash.exec(item)[1];
            } else if (item.length > 32) {
              const tempLink = this.pickUpMagnet(item);
              if (tempLink) {
                hideCodeTextArray[index] = tempLink;
              }
            }
          }
        });
        concatLinkArray = this.manageRepeatArray(concatLinkArray.concat(hideCodeTextArray));
      }
      concatLinkArray = concatLinkArray
        .map(item => {
          if (generalTextArray.includes(item)) {
            return null;
          }
          return item;
        })
        .filter(v => v);
      return concatLinkArray;
    }
    foyuPromise(encoded) {
      return new Promise(function (resolve, _reject) {
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'https://keyfc.net/bbs/tools/tudou.aspx',
          data: 'orignalMsg=' + encoded.replace(/\s/g, '') + '&action=Decode',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          onload: function (res) {
            if (res.status == 200 && res.readyState == 4) {
              resolve(res.responseText.replace(/^<BUDDHIST><Message><!\[CDATA\[|\]\]><\/Message><\/BUDDHIST>$/g, ''));
            } else {
              console.warn('福利吧论坛 - 好孩子看得见:\n自动解码出错！');
              resolve('');
            }
          },
          onerror: function () {
            console.error('福利吧论坛 - 好孩子看得见:\n网络链接出错！');
            resolve('');
          },
        });
      });
    }
    async foyuDecode(container, encoded) {
      await this.foyuPromise(encoded).then(data => {
        data && this.createGoodBoyFrame(container, [data]);
      });
    }
    decodeCoreValues(container, textArray) {
      const { core, baijia, foyu } = reg;
      const decodeArray = [];
      textArray.forEach(item => {
        if (core.test(item)) {
          decodeArray.push(coreValuesDecode(core.exec(item)[1]));
        } else if (baijia.test(item)) {
          decodeArray.push(baijiaDecode(baijia.exec(item)[1]));
        } else if (foyu.test(item)) {
          this.foyuDecode(container, foyu.exec(item)[1]);
        }
      });
      return decodeArray;
    }
    checkBaidupan(linkValue, linkDom) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: linkValue,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        onload: function (res) {
          if (
            res.responseText.indexOf('此链接分享内容可能因为涉及侵权') !== -1 ||
            res.responseText.indexOf('你所访问的页面不存在了') !== -1 ||
            res.responseText.indexOf('分享的文件已经被取消了') !== -1
          ) {
            linkDom.classList.add('link_faild');
            linkDom.title = '链接资源已经失效!';
          } else {
            linkDom.title = '链接资源正常。';
          }
        },
        onerror: function () {
          console.wran('福利吧论坛 - 好孩子看得见:\n网络连接失败。\n', linkValue);
        },
      });
    }
  }
  function randBin() {
    return Math.random() >= 0.5;
  }
  function str2Utf8(str) {
    const notEncoded = /[A-Za-z0-9\-_.!~*'()]/g;
    const str1 = str.replace(notEncoded, c => c.codePointAt(0).toString(16));
    const str2 = encodeURIComponent(str1);
    const concated = str2.replace(/%/g, '').toUpperCase();
    return concated;
  }
  function hex2Duo(hexs) {
    const duo = [];
    for (let c of hexs) {
      const n = Number.parseInt(c, 16);
      if (n < 10) {
        duo.push(n);
      } else {
        if (randBin()) {
          duo.push(10);
          duo.push(n - 10);
        } else {
          duo.push(11);
          duo.push(n - 6);
        }
      }
    }
    return duo;
  }
  function utf82Str(utfs) {
    const l = utfs.length;
    const splited = [];
    for (let i = 0; i < l; i++) {
      if ((i & 1) === 0) {
        splited.push('%');
      }
      splited.push(utfs[i]);
    }
    return decodeURIComponent(splited.join(''));
  }
  function duo2Hex(duo) {
    const hex = [];
    const l = duo.length;
    let i = 0;
    while (i < l) {
      if (duo[i] < 10) {
        hex.push(duo[i]);
      } else {
        if (duo[i] === 10) {
          i++;
          hex.push(duo[i] + 10);
        } else {
          i++;
          hex.push(duo[i] + 6);
        }
      }
      i++;
    }
    return hex.map(v => v.toString(16).toUpperCase()).join('');
  }
  function duo2Values(duo) {
    return duo.map(d => coreValues[2 * d] + coreValues[2 * d + 1]).join('');
  }
  function coreValuesEncode(str) {
    return duo2Values(hex2Duo(str2Utf8(str)));
  }
  function coreValuesDecode(encoded) {
    const duo = [];
    for (let c of encoded) {
      let i = coreValues.indexOf(c);
      if (i === -1) {
        continue;
      } else if (i & 1) {
        continue;
      } else {
        duo.push(i >> 1);
      }
    }
    const hexs = duo2Hex(duo);
    let str;
    try {
      str = utf82Str(hexs);
    } catch (e) {
      throw e;
    }
    return str;
  }
  function isFloat(str) {
    return str == '右侧';
  }
  function baijiaEncode(str) {
    str = str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    const v = str.replace(/magnet:\?xt=urn:btih:/, '');
    const strc = v.split('');
    let a = '';
    for (let item of strc) {
      for (let key in baijiaValues) {
        if (baijiaValues[key] === item) {
          a += key;
          break;
        }
      }
    }
    return a;
  }
  function baijiaDecode(encoded) {
    const charArray = encoded.split('');
    let str = '';
    for (let item of charArray) {
      if (baijiaValues[item]) {
        str += baijiaValues[item];
      }
    }
    if (/^https?\/\//i.test(str)) {
      return str.replace(/^(https?)/, '$1' + ':');
    } else if (/^(https?:\/\/|ed2k:\/\/)/.test(str)) {
      return str;
    } else {
      return 'magnet:?xt=urn:btih:' + str;
    }
  }
  function convertChineseNumber(textString) {
    return textString.replace(/[零一二三四五六七八九壹贰叁肆伍陆柒捌玖]/gi, arg0 => {
      let index = '零一二三四五六七八九'.indexOf(arg0);
      if (index === -1) {
        index = '壹贰叁肆伍陆柒捌玖'.indexOf(arg0) + 1;
      }
      return index;
    });
  }
  function filterLink(inputLink) {
    let status = true;
    if (inputLink) {
      for (let i in filterReg) {
        if (filterReg[i].test(inputLink)) {
          status = false;
          break;
        }
      }
    } else {
      status = false;
    }
    return status;
  }
  function getPureLink(inputLink, depthBoolean) {
    const { baidupanIncludeCode } = reg;
    let outputLink = inputLink;
    if (depthBoolean) {
      if (baidupanIncludeCode.test(outputLink)) {
        if (/#[a-z0-9]{4}$/i.test(outputLink)) {
          outputLink = outputLink.replace(/#[a-z0-9]{4}$/i, '');
        }
      } else if (/^https?:\/\/www\.bilibili\.com\/video\/av\d+\?from=search/i.test(outputLink)) {
        outputLink = outputLink.replace(/\?from=search.*/, '');
      }
    }
    let returnLink = outputLink
      .replace(/(^(?:\s+)?(?:\[url\])?(?:\s+)?(?:https?:\/\/)?|(?:\/+)?(?:\s+)?(?:\[\/url\])?$|%C2%A0$)/gi, '')
      .replace(/%C2%A0/gi, '%20');
    try {
      returnLink = decodeURI(returnLink);
    } catch (e) {
      console.warn('福利吧论坛 - 好孩子看得见:\n出现编码转换错误。', outputLink);
      console.warn(e);
      returnLink = outputLink
        .replace(/(^(?:\s+)?(?:\[url\])?(?:\s+)?(?:https?:\/\/)?|(?:\/+)?(?:\s+)?(?:\[\/url\])?$|%C2%A0$)/gi, '')
        .replace(/%C2%A0/gi, '%20');
    }
    return returnLink;
  }
  function contrastTextAndLink(textValue, linkValue) {
    let sta = true;
    textValue = getPureLink(textValue, true);
    linkValue = getPureLink(linkValue, true);
    if (/\s...\s/i.test(textValue)) {
      sta = false;
    } else if (textValue === linkValue) {
      sta = false;
    }
    return sta;
  }
  function findLink(container) {
    const { baidupan } = reg;
    const linkA = container.getElementsByTagName('a');
    const tempObj = {
      linkObjArray: [],
      baiduObjArray: [],
      linksArray: [],
    };
    const tempBaiduArray = [];
    for (let i = 0; i < linkA.length; i++) {
      if (linkA[i].closest('div.aimg_tip')) {
        continue;
      }
      const tempLink = linkA[i].href;
      if (filterLink(tempLink)) {
        const tempImg = linkA[i].querySelectorAll('img');
        if (tempImg.length === 0 || (tempImg.length > 0 && tempImg[0].src !== tempLink && tempImg[0].getAttribute('file') !== tempLink)) {
          const tempText = linkA[i].innerText.replace(/^\s+|\s+$/gi, '');
          if (contrastTextAndLink(tempText, tempLink)) {
            const linkObj = {
              eleValue: tempLink,
              eleContainer: tempText,
              ele: linkA[i],
            };
            tempObj.linkObjArray.push(linkObj);
          } else if (baidupan.test(tempLink)) {
            const baiduObj = {
              eleValue: tempLink,
              eleContainer: tempText,
              ele: linkA[i],
            };
            if (tempBaiduArray.indexOf(tempLink) === -1) {
              tempBaiduArray.push(tempLink);
              tempObj.baiduObjArray.push(baiduObj);
            }
          }
        }
        tempObj.linksArray.indexOf(tempLink) === -1 && tempObj.linksArray.push(tempLink);
      }
    }
    return tempObj;
  }
  function judgeColor(rgbColorValue) {
    if (/rgb\(/i.test(rgbColorValue)) {
      const rgbValue = rgbColorValue.replace('rgb(', '').replace(')', '');
      const rgbValueArray = rgbValue.split(',');
      const grayLevel = rgbValueArray[0] * 0.299 + rgbValueArray[1] * 0.587 + rgbValueArray[2] * 0.114;
      return grayLevel > 192;
    } else if (/rgba\(/i.test(rgbColorValue)) {
      const rgbaValue = rgbColorValue.replace('rgba(', '').replace(')', '');
      const rgbaValueArray = rgbaValue.split(',');
      if (rgbaValueArray[3] <= 0.2) {
        return true;
      } else {
        const grayLevel2 = rgbaValueArray[0] * 0.299 + rgbaValueArray[1] * 0.587 + rgbaValueArray[2] * 0.114;
        return grayLevel2 > 192;
      }
    }
    return false;
  }
  function rgb2Rgba(colorString) {
    const colorValue = colorString.match(/\d+/g);
    if (colorValue.length === 3) {
      return 'rgba(' + colorValue[0] + ', ' + colorValue[1] + ', ' + colorValue[2] + ', 1)';
    }
    return colorString;
  }
  function display_Text(container, newTextColor, newTextBackgroundColor) {
    const { url } = reg;
    const textFont = container.getElementsByTagName('font');
    const tempObj = {
      hideTextArray: [],
      showTextArray: [],
    };
    for (let i = 0; i < textFont.length; i++) {
      if (textFont[i].closest('.quote') || textFont[i].getElementsByClassName('aimg_tip').length !== 0) {
        continue;
      }
      const tempText = textFont[i].innerText.replace(/^\s+|\s+$/gi, '');
      if (!/^\s*$/i.test(tempText)) {
        const textColor = window.getComputedStyle(textFont[i]).color;
        const textBackgroundColor = window.getComputedStyle(textFont[i]).backgroundColor;
        if (judgeColor(textColor) && judgeColor(textBackgroundColor)) {
          textFont[i].style.color = newTextColor;
          tempObj.hideTextArray.push(tempText);
        } else if (rgb2Rgba(textBackgroundColor) === rgb2Rgba(textColor)) {
          textFont[i].style.backgroundColor = newTextBackgroundColor;
          textFont[i].style.color = newTextColor;
          tempObj.hideTextArray.push(tempText);
        } else if (!judgeColor(textBackgroundColor) && !judgeColor(textColor)) {
          textFont[i].style.backgroundColor = newTextBackgroundColor;
          textFont[i].style.color = newTextColor;
          tempObj.hideTextArray.push(tempText);
        } else if (textFont[i].childNodes.length === 1 && textFont[i].childNodes[0].nodeType === 3) {
          if (GM_config.get('extractEnable')) {
            if (url.test(tempText)) {
              textFont[i].innerHTML = textFont[i].innerHTML.replace(url, (_arg0, arg1) => {
                return (
                  '<a href="' + convertChineseNumber(arg1) + '" title="点击访问" target="_blank">' + convertChineseNumber(arg1) + '</a>'
                );
              });
            }
          }
          !tempObj.showTextArray.includes(tempText) && tempObj.showTextArray.push(tempText);
        } else if (textFont[i].childNodes.length > 1) {
          const tFont = textFont[i].childNodes;
          for (let child_index in tFont) {
            analysisText(tFont[child_index]);
          }
          !tempObj.showTextArray.includes(tempText) && tempObj.showTextArray.push(tempText);
        }
      }
    }
    const tempTable = container.getElementsByTagName('table');
    for (let j = 0; j < tempTable.length; j++) {
      if (!judgeColor(tempTable[j].style.backgroundColor) && !judgeColor(tempTable[j].style.color)) {
        tempTable[j].style.backgroundColor = newTextBackgroundColor;
      } else if (judgeColor(tempTable[j].style.color) && judgeColor(tempTable[j].style.backgroundColor)) {
        tempTable[j].style.color = newTextColor;
      }
    }
    return tempObj;
  }
  function text2A(node) {
    const { url } = reg;
    const tempSpan = document.createElement('span');
    tempSpan.innerHTML = node.nodeValue.replace(url, (arg0, arg1) => {
      if (arg1.length > 2000) {
        return arg0;
      }
      return arg0.replace(
        arg1,
        '<a href="' + convertChineseNumber(arg1) + '" title="点击访问" target="_blank">' + convertChineseNumber(arg1) + '</a>'
      );
    });
    node.parentNode.replaceChild(tempSpan, node);
  }
  function analysisText(domPoint) {
    const { url } = reg;
    const nodeList = domPoint.childNodes;
    const nodeTextArray = [];
    for (let i in nodeList) {
      if (nodeList[i].nodeType === 3) {
        const tempText = nodeList[i].nodeValue.replace(/^\s+|\s+$/gi, '');
        if (!/^\s*$/i.test(tempText)) {
          if (GM_config.get('extractEnable')) {
            if (url.test(tempText)) {
              text2A(nodeList[i]);
            }
          }
          nodeTextArray.push(tempText);
        }
      } else if (
        nodeList[i].nodeType === 1 &&
        !nodeList[i].className.includes('quote') &&
        !nodeList[i].className.includes('pstatus') &&
        !nodeList[i].className.includes('aimg_tip') &&
        !nodeList[i].className.includes('blockcode') &&
        nodeList[i].nodeName !== 'FONT' &&
        nodeList[i].nodeName !== 'A' &&
        nodeList[i].nodeName !== 'SCRIPT' &&
        nodeList[i].childNodes.length > 0
      ) {
        const recursiveArray = analysisText(nodeList[i]);
        for (let j in recursiveArray) {
          nodeTextArray.push(recursiveArray[j]);
        }
      }
    }
    return nodeTextArray;
  }
  function isMobilePage() {
    return /android|webos|iphone|ipod|blackberry/i.test(navigator.userAgent);
  }
  function getNowDate() {
    const now = new Date();
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
  }
  function timeAddZero(value) {
    return value < 10 ? '0' + value : value;
  }
  function getUpdateTime(unixTime) {
    if (unixTime) {
      const tempTime = new Date(unixTime);
      return (
        ' (更新时间: ' +
        tempTime.getFullYear() +
        '-' +
        timeAddZero(tempTime.getMonth() + 1) +
        '-' +
        timeAddZero(tempTime.getDate()) +
        ' ' +
        timeAddZero(tempTime.getHours()) +
        ':' +
        timeAddZero(tempTime.getMinutes()) +
        ':' +
        timeAddZero(tempTime.getSeconds()) +
        ')'
      );
    }
    return '';
  }
  function highlightPost() {
    try {
      let userAccessNum = 90;
      let upmimeNum = document.getElementById('g_upmine').textContent;
      upmimeNum = /LV\.(-?[0-9])/.exec(upmimeNum)[1];
      if (upmimeNum == -1) {
        userAccessNum = 0;
      } else if (upmimeNum == 0) {
        userAccessNum = 5;
      } else if (upmimeNum >= 1 && upmimeNum <= 8) {
        userAccessNum = upmimeNum * 10;
      }
      if (status.accessNum != userAccessNum) {
        status.accessNum = userAccessNum;
        GM_config.setValue('accessNumber', status.accessNum);
      }
    } catch (e) {
      console.warn('福利吧论坛 - 好孩子看得见:\n识别用户阅读权限出错，将使用存储中记录的用户阅读权限。');
    }
    console.debug('福利吧论坛 - 好孩子看得见:\n用户阅读权限:', status.accessNum);
    document.arrive('div#threadlist form table tbody', { onceOnly: true }, function () {
      let item = this.querySelectorAll('.common, .new, .lock')[0];
      if (item) {
        let readNum = item.querySelector('.xw1');
        let tempStatus = true;
        if (readNum) {
          readNum = Number(readNum.textContent);
          if (readNum > 90) {
            item
              .querySelector('.xst')
              .setAttribute('style', 'color: #999; font-weight: bold; text-decoration-line: line-through; text-decoration-color: #000000;');
            tempStatus = false;
          } else if (readNum > status.accessNum) {
            item.querySelector('.xst').setAttribute('style', 'color: #999; font-weight: bold;');
            tempStatus = false;
          }
        }
        if (tempStatus && item.querySelector('.xst').style.fontWeight === '700') {
          tempStatus = false;
        }
        if (tempStatus) {
          let agreeNum = 0;
          const fontEle = item.querySelectorAll('font');
          for (let j = 0; j < fontEle.length; j++) {
            let fontNum = fontEle[j].textContent;
            if (fontNum) {
              fontNum = Number(fontNum.replace('+', ''));
              if (fontNum > agreeNum) {
                agreeNum = fontNum;
              }
            }
          }
          if (agreeNum > 0) {
            if (agreeNum >= GM_config.get('agreeThreshold')) {
              item.querySelector('.xst').setAttribute('style', 'font-weight: bold; color: ' + GM_config.get('agreeColor') + ';');
              tempStatus = false;
            }
          }
        }
        if (tempStatus) {
          let replyNum = item.parentNode.querySelector('td.num a').textContent;
          if (replyNum) {
            replyNum = Number(replyNum);
            if (replyNum >= GM_config.get('replyTHreshold')) {
              item.querySelector('.xst').setAttribute('style', 'font-weight: bold; color: ' + GM_config.get('replyColor') + ';');
            }
          }
        }
      }
    });
  }
  function createSettingsIcon() {
    const iconSpan = document.createElement('span');
    iconSpan.id = 'settingsIcon';
    iconSpan.title = '打开好孩子看得见设置';
    iconSpan.addEventListener('click', () => {
      GM_config.open();
    });
    return iconSpan;
  }
  function operateCode(inputId, outputId, callback, waitStr = '') {
    const str = document.getElementById(inputId).value;
    if (str) {
      document.getElementById(outputId).value = waitStr;
      const result = callback(str, outputId);
      if (result) {
        document.getElementById(outputId).value = result;
      }
    }
  }
  function copyCode(copyBtn, resultId) {
    const copyStr = document.getElementById(resultId).value;
    if (copyStr) {
      GM_setClipboard(copyStr, 'text');
      copyBtn.title = '复制成功';
      copyBtn.classList.add('a_copy_completed');
      status.timer3 && clearTimeout(status.timer3);
      status.timer3 = setTimeout(() => {
        copyBtn.classList.remove('a_copy_completed');
        copyBtn.title = '将输出的结果复制到剪贴板中';
      }, 2000);
    }
  }
  function createSwitchSpan(keyValue, domArray) {
    const switchSpan = document.createElement('span');
    switchSpan.className = 'o';
    const switchImg = document.createElement('img');
    switchImg.id = keyValue + '_user_img';
    switchImg.title = '收起/展开';
    switchImg.alt = '收起/展开';
    if (status[keyValue]) {
      domArray.forEach(function (item) {
        item.classList.add('collapsed_hide');
      });
      switchImg.src = icon.collapsedYes;
    } else {
      switchImg.src = icon.collapsedNo;
    }
    switchImg.addEventListener('click', () => {
      if (status[keyValue]) {
        domArray.forEach(item => {
          item.classList.remove('collapsed_hide');
        });
        switchImg.src = icon.collapsedNo;
        status[keyValue] = false;
      } else {
        domArray.forEach(item => {
          item.classList.add('collapsed_hide');
        });
        switchImg.src = icon.collapsedYes;
        status[keyValue] = true;
      }
      GM_config.setValue(keyValue, status[keyValue]);
    });
    switchSpan.appendChild(switchImg);
    return switchSpan;
  }
  function createSignatureSwitch(signature, switchStatus = true) {
    const switchDiv = document.createElement('div');
    switchDiv.className = 'signature_switch_div';
    if (switchStatus) {
      switchDiv.title = '收起';
    } else {
      switchDiv.title = '展开';
      switchDiv.classList.add('signature_switch_close');
      signature.classList.add('signature_hide');
    }
    switchDiv.addEventListener(
      'click',
      () => {
        if (switchStatus) {
          switchStatus = false;
          switchDiv.title = '展开';
          switchDiv.classList.add('signature_switch_close');
          signature.classList.add('signature_hide');
        } else {
          switchStatus = true;
          switchDiv.title = '收起';
          switchDiv.classList.remove('signature_switch_close');
          signature.classList.remove('signature_hide');
        }
      },
      false
    );
    return switchDiv;
  }
  function mobileInit() {
    const { checkDate, oldUrl } = status;
    if (GM_config.get('highlightEnable')) {
      if (oldUrl.indexOf('mod=forumdisplay') !== -1 || /forum-\d+-\d+\.html/i.test(oldUrl)) {
        document.body.arrive('.threadlist li', { fireOnAttributesModification: true, existing: true }, function () {
          let replyNum = this.querySelector('span.num.icon.iconfont').textContent;
          if (replyNum) {
            replyNum = Number(/\d+/.exec(replyNum)[0]);
            if (replyNum >= GM_config.get('replyTHreshold')) {
              this.querySelector('div.thread-item-sub').setAttribute(
                'style',
                'font-weight: bold; color: ' + GM_config.get('replyColor') + ';'
              );
            }
          }
        });
      }
    }
    if (oldUrl.indexOf('mod=viewthread') !== -1 || /thread-\d+-\d+(?:-\d+)?\.html/i.test(oldUrl)) {
      const phoneBackgroundColor = window.getComputedStyle(document.body).backgroundColor;
      const messageDom = document.querySelectorAll('.message');
      for (let messageEle of messageDom) {
        const textObj = display_Text(messageEle, GM_config.get('textColor'), phoneBackgroundColor);
        const textArray = analysisText(messageEle);
        const linkObj = findLink(messageEle);
        const goodBoyObj = new Good_Boy(GM_config);
        goodBoyObj.createGoodBoyElement(messageEle, linkObj, textObj, textArray);
      }
    }
    if (GM_config.get('autoCheckInEnable')) {
      document.body.arrive('.bg > a', { onceOnly: true, existing: true }, function (item) {
        if (item.textContent === '签到领奖') {
          const nowDate = getNowDate();
          if (nowDate !== checkDate) {
            GM_config.setValue('checkEnable', nowDate);
            setTimeout(() => {
              item.click();
            }, 2000);
            console.info('福利吧论坛 - 好孩子看得见:\n完成自动签到。');
          }
        }
      });
    }
  }
  function pcInit() {
    const { baseImage } = reg;
    const { oldUrl } = status;
    if (oldUrl.indexOf('mod=forumdisplay') !== -1 || /forum-\d+-\d+\.html/i.test(oldUrl)) {
      if (oldUrl.indexOf('fid=37') !== -1 || /forum-37-/i.test(oldUrl)) {
        document.arrive('div.bm_h.cl', { fireOnAttributesModification: true, onceOnly: true, existing: true }, function () {
          if (this.querySelectorAll('span.y').length === 0) {
            const themeArray = [];
            themeArray.push(this.nextElementSibling);
            this.insertBefore(createSwitchSpan('collapsedGwwzEnable', themeArray), this.childNodes[0]);
          }
        });
      }
      GM_config.get('highlightEnable') && highlightPost();
      if (GM_config.get('visitedEnable')) {
        const visitedStyle = '.tl th a.s.xst:visited, .tl td.fn a:visited { color: ' + GM_config.get('visitedColor') + ' !important; }';
        GM_addStyle(visitedStyle);
        console.debug('福利吧论坛 - 好孩子看得见:\n完成注入自定义己访问帖子的样式。');
      }
    }
    if (oldUrl.indexOf('mod=viewthread') !== -1 || /thread-\d+-\d+(?:-\d+)?\.html/i.test(oldUrl)) {
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          const tFImg = document.querySelectorAll('td.t_f img');
          for (let imgEle of tFImg) {
            let baseSrc = imgEle.getAttribute('file');
            if (baseImage.test(baseSrc)) {
              baseSrc = baseSrc.replace(baseImage, '$1');
              imgEle.setAttribute('file', baseSrc);
              imgEle.src = baseSrc;
            }
          }
          const zoomImg = document.querySelectorAll('.t_f img.zoom');
          for (let zoomEle of zoomImg) {
            zoomEle.removeAttribute('height');
          }
          const htmlBackgroundColor = window.getComputedStyle(document.body).backgroundColor;
          const tFDom = document.querySelectorAll('td.t_f');
          for (let domEle of tFDom) {
            const goodBoyObj = new Good_Boy(GM_config);
            if (isFloat(GM_config.get('displayPosition'))) {
              const favatarBtn = domEle.closest('table.plhin').querySelector('div.favatar');
              const textObj = display_Text(domEle, GM_config.get('textColor'), htmlBackgroundColor);
              const textArray = analysisText(domEle);
              const linkObj = findLink(domEle);
              goodBoyObj.createGoodBoyElement(favatarBtn, linkObj, textObj, textArray);
            } else {
              const mainBtn = domEle.closest('div.pcb').querySelector('div.t_fsz') || domEle.closest('div.pcb').querySelector('div.pcbs');
              const textObj = display_Text(domEle, GM_config.get('textColor'), htmlBackgroundColor);
              const textArray = analysisText(domEle);
              const linkObj = findLink(domEle);
              goodBoyObj.createGoodBoyElement(mainBtn, linkObj, textObj, textArray);
            }
          }
          const signA = document.querySelectorAll('div.sign a');
          for (let signEle of signA) {
            if (/member\.php\?mod=logging&action=logout/i.test(signEle.href)) {
              signEle.style.display = 'none';
            }
          }
          if (GM_config.get('signatureEnable')) {
            const sign = document.querySelectorAll('div.sign');
            const signStatus = GM_config.get('signatureSwitch') == '展开';
            for (let signItem of sign) {
              signItem.insertAdjacentElement('beforebegin', createSignatureSwitch(signItem, signStatus));
            }
          }
        },
        false
      );
    }
    if (GM_config.get('autoCheckInEnable')) {
      document.arrive('#fx_checkin_topb', { fireOnAttributesModification: true, onceOnly: true, existing: true }, function () {
        if (this.getElementsByTagName('img')[0].alt !== '已签到') {
          if (typeof fx_checkin === 'function') {
            this.click();
          } else {
            setTimeout(() => {
              this.click();
            }, 2000);
          }
          console.info('福利吧论坛 - 好孩子看得见:\n自动签到完成。');
        }
      });
    }
    if (GM_config.get('codeEnable') || GM_config.get('nightBtnEnable')) {
      document.addEventListener('DOMContentLoaded', function () {
        const expandBox = document.createElement('div');
        expandBox.className = 'expand_box';
        if (GM_config.get('codeEnable') && GM_config.get('nightBtnEnable')) {
          expandBox.className = 'expand_box_h';
        }
        expandBox.onmouseenter = function () {
          this.classList.add('show_expand_box');
        };
        expandBox.onmouseleave = function () {
          this.classList.remove('show_expand_box');
        };
        if (GM_config.get('codeEnable')) {
          const codeFrame = document.createElement('div');
          document.body.appendChild(codeFrame);
          const codePanel = new GM_configStruct({
            id: 'myCodePanel',
            title: '编解码工具',
            isTabs: true,
            skin: 'tab',
            frame: codeFrame,
            css: style.codePanel,
            fields: {
              bjxInput: {
                label: '输入:',
                section: [
                  '百家姓',
                  GM_config.create('a', {
                    textContent: '百家姓编码原示例地址',
                    title: '点击跳转到百家姓编码示例',
                    target: '_blank',
                    href: 'https://fulibus.net/anhao.html',
                  }),
                ],
                type: 'textarea',
                labelPos: 'above',
                placeholder: '请输入内容',
                default: '',
                save: false,
              },
              bjxEncodeBtn: {
                label: '编码 >>>',
                title: '使用"百家姓"进行编码',
                type: 'button',
                click: () => {
                  operateCode('myCodePanel_field_bjxInput', 'myCodePanel_field_bjxOutput', baijiaEncode, '编码中...');
                },
              },
              bjxDecodeBtn: {
                label: '解码 >>>',
                title: '对"百家姓"的编码进行解码',
                type: 'button',
                click: () => {
                  operateCode('myCodePanel_field_bjxInput', 'myCodePanel_field_bjxOutput', baijiaDecode, '解码中...');
                },
              },
              bjxOutput: {
                label: '输出:',
                type: 'textarea',
                labelPos: 'above',
                placeholder: '此处显示结果',
                default: '',
                save: false,
              },
              bjxCopyBtn: {
                label: '复制结果',
                title: '将输出的结果复制到剪贴板中',
                type: 'button',
                click: function () {
                  copyCode(this, 'myCodePanel_field_bjxOutput');
                },
              },
              coreValuesInput: {
                label: '输入:',
                section: [
                  '社会主义核心价值观',
                  GM_config.create('a', {
                    textContent: '社会主义核心价值观编码项目地址',
                    title: '点击跳转到社会主义核心价值观编码项目',
                    target: '_blank',
                    href: 'https://github.com/sym233/core-values-encoder',
                  }),
                ],
                type: 'textarea',
                labelPos: 'above',
                placeholder: '请输入内容',
                default: '',
                save: false,
              },
              coreValuesEncodeBtn: {
                label: '编码 >>>',
                title: '使用"社会主义核心价值观"进行编码',
                type: 'button',
                click: () => {
                  operateCode('myCodePanel_field_coreValuesInput', 'myCodePanel_field_coreValuesOutput', coreValuesEncode, '编码中...');
                },
              },
              coreValuesDecodeBtn: {
                label: '解码 >>>',
                title: '对"社会主义核心价值观"的编码进行解码',
                type: 'button',
                click: () => {
                  operateCode('myCodePanel_field_coreValuesInput', 'myCodePanel_field_coreValuesOutput', coreValuesDecode, '解码中...');
                },
              },
              coreValuesOutput: {
                label: '输出:',
                type: 'textarea',
                labelPos: 'above',
                placeholder: '此处显示结果',
                default: '',
                save: false,
              },
              coreValuesCopyBtn: {
                label: '复制结果',
                title: '将输出的结果复制到剪贴板中',
                type: 'button',
                click: function () {
                  copyCode(this, 'myCodePanel_field_coreValuesOutput');
                },
              },
              yflcInput: {
                label: '输入:',
                section: [
                  '与佛论禅',
                  GM_config.create('a', {
                    textContent: '与佛论禅编码原工具地址',
                    title: '点击跳转到与佛论禅编码工具',
                    target: '_blank',
                    href: 'http://keyfc.net/bbs/tools/tudoucode.aspx',
                  }),
                ],
                type: 'textarea',
                labelPos: 'above',
                placeholder: '请输入内容',
                default: '',
                save: false,
              },
              yflcEncodeBtn: {
                label: '编码 >>>',
                title: '使用"与佛论禅"进行编码',
                type: 'button',
                click: () => {
                  operateCode(
                    'myCodePanel_field_yflcInput',
                    'myCodePanel_field_yflcOutput',
                    (str, result_id) => {
                      GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://keyfc.net/bbs/tools/tudou.aspx',
                        data: 'orignalMsg=' + encodeURIComponent(str) + '&action=Encode',
                        headers: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        onload: res => {
                          if (res.status == 200 && res.readyState == 4) {
                            document.getElementById(result_id).value = res.responseText.replace(
                              /^<BUDDHIST><Message><!\[CDATA\[|\]\]><\/Message><\/BUDDHIST>$/g,
                              ''
                            );
                          } else {
                            document.getElementById(result_id).value = '编码出现错误!';
                          }
                        },
                        onerror: () => {
                          document.getElementById(result_id).value = '网络连接出错!';
                        },
                      });
                      return false;
                    },
                    '联网进行编码中...'
                  );
                },
              },
              yflcDecodeBtn: {
                label: '解码 >>>',
                title: '对"与佛论禅"的编码进行解码',
                type: 'button',
                click: () => {
                  operateCode(
                    'myCodePanel_field_yflcInput',
                    'myCodePanel_field_yflcOutput',
                    (str, result_id) => {
                      GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://keyfc.net/bbs/tools/tudou.aspx',
                        data: 'orignalMsg=' + str.replace(/\s/g, '') + '&action=Decode',
                        headers: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        onload: res => {
                          if (res.status == 200 && res.readyState == 4) {
                            document.getElementById(result_id).value = res.responseText.replace(
                              /^<BUDDHIST><Message><!\[CDATA\[|\]\]><\/Message><\/BUDDHIST>$/g,
                              ''
                            );
                          } else {
                            document.getElementById(result_id).value = '解码出现错误!';
                          }
                        },
                        onerror: () => {
                          document.getElementById(result_id).value = '网络连接出错!';
                        },
                      });
                      return false;
                    },
                    '联网进行解码中...'
                  );
                },
              },
              yflcOutput: {
                label: '输出:',
                type: 'textarea',
                labelPos: 'above',
                placeholder: '此处显示结果',
                default: '',
                save: false,
              },
              yflcCopyBtn: {
                label: '复制结果',
                title: '将输出的结果复制到剪贴板中',
                type: 'button',
                click: function () {
                  copyCode(this, 'myCodePanel_field_yflcOutput');
                },
              },
              base64Input: {
                label: '输入:',
                section: [
                  'BASE64',
                  GM_config.create('a', {
                    textContent: 'crypto-js 项目地址',
                    title: '点击跳转到 crypto-js 项目',
                    target: '_blank',
                    href: 'https://github.com/brix/crypto-js',
                  }),
                ],
                type: 'textarea',
                labelPos: 'above',
                placeholder: '请输入内容',
                default: '',
                save: false,
              },
              base64EncodeBtn: {
                label: '编码 >>>',
                title: '使用"BASE64"进行编码',
                type: 'button',
                click: () => {
                  operateCode(
                    'myCodePanel_field_base64Input',
                    'myCodePanel_field_base64Output',
                    str => {
                      if (typeof CryptoJS == 'undefined') {
                        return 'crypto-js 库文件不存在！';
                      } else {
                        str = CryptoJS.enc.Utf8.parse(str);
                        return CryptoJS.enc.Base64.stringify(str);
                      }
                    },
                    '编码中...'
                  );
                },
              },
              base64DecodeBtn: {
                label: '解码 >>>',
                title: '对"BASE64"的编码进行解码',
                type: 'button',
                click: () => {
                  operateCode(
                    'myCodePanel_field_base64Input',
                    'myCodePanel_field_base64Output',
                    str => {
                      if (typeof CryptoJS == 'undefined') {
                        return 'crypto-js 库文件不存在！';
                      } else {
                        let words = CryptoJS.enc.Base64.parse(str);
                        return words.toString(CryptoJS.enc.Utf8);
                      }
                    },
                    '解码中...'
                  );
                },
              },
              base64Output: {
                label: '输出:',
                type: 'textarea',
                labelPos: 'above',
                placeholder: '此处显示结果',
                default: '',
                save: false,
              },
              base64CopyBtn: {
                label: '复制结果',
                title: '将输出的结果复制到剪贴板中',
                type: 'button',
                click: function () {
                  copyCode(this, 'myCodePanel_field_base64Output');
                },
              },
            },
            events: {
              open: function (doc) {
                let config = this;
                doc.getElementById(config.id + '_closeBtn').title = '关闭面板';
                doc.getElementById(config.id + '_resetLink').textContent = '清空内容';
                doc.getElementById(config.id + '_resetLink').title = '清空所有内容';
              },
            },
          });
          const codeSpan = document.createElement('span');
          codeSpan.id = 'myCodeSpan';
          codeSpan.title = '打开编解码工具';
          codeSpan.addEventListener(
            'click',
            () => {
              codePanel.open();
            },
            false
          );
          expandBox.appendChild(codeSpan);
        }
        if (GM_config.get('nightBtnEnable')) {
          const nightBtnSpan = document.createElement('span');
          nightBtnSpan.id = 'myNightSpan';
          if (GM_config.get('codeEnable')) {
            nightBtnSpan.id = 'myNightSpan_2';
          }
          if (status.nightEnable) {
            nightBtnSpan.style.backgroundImage = icon.modeNight;
            nightBtnSpan.title = '切换到日间模式';
          } else {
            nightBtnSpan.style.backgroundImage = icon.modeDay;
            nightBtnSpan.title = '切换到夜间模式';
          }
          nightBtnSpan.addEventListener(
            'click',
            () => {
              if (status.nightEnable) {
                status.nightStyleDom && status.nightStyleDom.parentNode.removeChild(status.nightStyleDom);
                status.nightEnable = false;
                GM_config.setValue('nightEnable', status.nightEnable);
                nightBtnSpan.title = '切换到夜间模式';
                nightBtnSpan.style.backgroundImage = icon.modeDay;
              } else {
                status.nightStyleDom = GM_addStyle(style.night);
                status.nightEnable = true;
                GM_config.setValue('nightEnable', status.nightEnable);
                nightBtnSpan.title = '切换到日间模式';
                nightBtnSpan.style.backgroundImage = icon.modeNight;
              }
            },
            false
          );
          expandBox.appendChild(nightBtnSpan);
        }
        document.body.appendChild(expandBox);
      });
    }
    document.arrive('#sslct', { fireOnAttributesModification: true, onceOnly: true, existing: true }, item => {
      item.after(createSettingsIcon());
    });
  }
  function aInit() {
    try {
      GM_registerMenuCommand('好孩子看得见 - 设置', () => {
        GM_config.open();
      });
    } catch (e) {
      console.error('福利吧论坛 - 好孩子看得见:\n在扩展中注册菜单项出错！');
      console.error(e);
    }
    GM_addStyle(style.basic);
    if (isMobilePage()) {
      console.info('福利吧论坛 - 好孩子看得见:\n当前页面为移动端页面。');
      document.addEventListener('DOMContentLoaded', () => {
        mobileInit();
      });
    } else {
      if (document.head) {
        if (document.head.querySelector('title')) {
          if (status.nightEnable) {
            status.nightStyleDom = GM_addStyle(style.night);
          }
          pcInit();
        } else {
          document.addEventListener('DOMContentLoaded', function () {
            console.warn('福利吧论坛 - 好孩子看得见:\n网页加载失败。即将自动刷新重载。');
            status.timer4 && clearTimeout(status.timer4);
            status.timer4 = setTimeout(() => {
              location.reload();
            }, 2000);
          });
        }
      } else {
        if (status.nightEnable) {
          status.nightStyleDom = GM_addStyle(style.night);
        }
        pcInit();
      }
    }
  }
  GM_config.init({
    id: 'myGoodBoyConfig',
    title: GM_config.create('a', {
      textContent: '好孩子看得见-设置 ver.' + GM_info.script.version,
      title: '点击跳转到脚本页面' + getUpdateTime(GM_info.script.lastModified),
      target: '_blank',
      href: 'https://sleazyfork.org/zh-CN/scripts/381494',
    }),
    skin: 'tab',
    css: style.settings,
    frameStyle: {
      width: '400px',
      height: '720px',
    },
    fields: {
      autoCheckInEnable: {
        label: '自动签到',
        title: '进入论坛后自动点击签到按钮',
        labelPos: 'right',
        type: 'checkbox',
        default: true,
        section: GM_config.create('a', {
          textContent: '作者: pana',
          title: '点击反馈问题',
          target: '_blank',
          href: location.origin + '/home.php?mod=spacecp&ac=pm&op=showmsg&touid=8548',
        }),
      },
      nightBtnEnable: {
        label: '显示切换夜间模式的悬浮按钮',
        title: '将鼠标移至网页右下角弹出 (仅支持电脑端页面)',
        labelPos: 'right',
        type: 'checkbox',
        default: false,
      },
      codeEnable: {
        label: '显示编解码工具的悬浮按钮',
        title: '将鼠标移至网页右下角弹出 (仅支持电脑端页面)',
        labelPos: 'right',
        type: 'checkbox',
        default: false,
      },
      copyEnable: {
        label: '显示复制按钮',
        title: '在所提取链接后显示复制按钮',
        labelPos: 'right',
        type: 'checkbox',
        default: true,
      },
      extractEnable: {
        label: '识别文字中的网址并转换为超链接',
        title: '将帖子中网址文字转换为可点击访问的超链接',
        labelPos: 'right',
        type: 'checkbox',
        default: true,
      },
      checkEnable: {
        label: '自动检测百度网盘链接有效性',
        title: '检测并标记出已经失效的百度网盘链接',
        labelPos: 'right',
        type: 'checkbox',
        default: false,
      },
      displayPosition: {
        label: '自定义提取链接的显示位置: ',
        title: '指定所提取链接的显示位置 (仅支持电脑端页面)',
        labelPos: 'left',
        type: 'select',
        options: ['底部', '右侧'],
        default: '底部',
      },
      maxLinkNumber: {
        label: '所提取链接的最大显示数量: ',
        title: '每个楼层所提取链接的默认最大显示数量值 (-1 表示无限制)',
        labelPos: 'left',
        type: 'int',
        size: 18,
        default: 5,
      },
      linkColor: {
        label: '自定义提取链接的文字颜色: ',
        title: '设定所提取链接显示的文字颜色',
        labelPos: 'left',
        type: 'text',
        size: 18,
        default: '#369',
      },
      textColor: {
        label: '自定义隐藏文字的高亮颜色: ',
        title: '设定将隐藏文字高亮的颜色',
        labelPos: 'left',
        type: 'text',
        size: 18,
        default: '#FF33CC',
      },
      signatureEnable: {
        label: '显示签名档折叠图标',
        title: '在签名档的左上方显示一个折叠图标',
        labelPos: 'right',
        type: 'checkbox',
        default: true,
        line: 'start',
      },
      signatureSwitch: {
        label: '签名档的默认折叠状态: ',
        title: '自定义签名档默认的折叠状态',
        labelPos: 'left',
        type: 'select',
        options: ['展开', '收起'],
        default: '展开',
        line: 'end',
      },
      highlightEnable: {
        label: '启用热帖高亮功能',
        title: '在帖子列表页面开启热帖高亮 (移动端页面只支持回复高亮)',
        labelPos: 'right',
        type: 'checkbox',
        default: true,
        line: 'start',
      },
      agreeThreshold: {
        label: '按分享值高亮的阈值: ',
        title: '分享值>=阈值时高亮',
        labelPos: 'left',
        type: 'unsigned int',
        size: 18,
        default: 20,
      },
      agreeColor: {
        label: '按分享值高亮的颜色: ',
        title: '优化级高',
        labelPos: 'left',
        type: 'text',
        size: 18,
        default: '#EE1B2E',
      },
      replyTHreshold: {
        label: '按回复数高亮的阈值: ',
        title: '回复数>=阈值时高亮',
        labelPos: 'left',
        type: 'unsigned int',
        size: 18,
        default: 50,
      },
      replyColor: {
        label: '按回复数高亮的颜色: ',
        title: '优化级低',
        labelPos: 'left',
        type: 'text',
        size: 18,
        default: '#2B65B7',
        line: 'end',
      },
      visitedEnable: {
        label: '标记已打开过的帖子',
        title: '允许将已打开过的帖子设置成自定义的颜色',
        labelPos: 'right',
        type: 'checkbox',
        default: false,
        line: 'start',
      },
      visitedColor: {
        label: '自定义已打开过的帖子的颜色',
        title: '优先级最高',
        labelPos: 'left',
        type: 'text',
        size: 18,
        default: '#666',
        line: 'end',
      },
    },
    events: {
      init: () => {
        console.debug('福利吧论坛 - 好孩子看得见:\n配置信息读取完成。');
        aInit();
      },
      save: () => {
        location.reload();
      },
    },
  });
})();
