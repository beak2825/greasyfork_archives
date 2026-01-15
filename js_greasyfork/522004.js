// ==UserScript==
// @name            福利吧小助手
// @namespace       https://greasyfork.org/zh-CN/users/860681-aoguai
// @version         1.0.5.9
// @description     一个用于增强福利吧功能的油猴脚本，提供链接提取、界面美化、编解码等功能。
// @author          aoguai
// @match           http://fulibus.net/*
// @match           https://fulibus.net/*
// @match           http://fuliba2025.net/*
// @match           https://fuliba2025.net/*
// @match           http://*.fuliba2025.net/*
// @match           https://*.fuliba2025.net/*
// @match           http://fuliba2020.net/*
// @match           https://fuliba2020.net/*
// @match           http://fuliba2021.net/*
// @match           https://fuliba2021.net/*
// @match           http://fuliba2022.net/*
// @match           https://fuliba2022.net/*
// @match           http://fuliba2023.net/*
// @match           https://fuliba2023.net/*
// @match           http://fuliba2024.net/*
// @match           https://fuliba2024.net/*
// @match           http://fuliba2026.net/*
// @match           https://fuliba2026.net/*
// @match           http://fuliba2027.net/*
// @match           https://fuliba2027.net/*
// @match           http://fuliba2028.net/*
// @match           https://fuliba2028.net/*
// @match           http://fuliba2029.net/*
// @match           https://fuliba2029.net/*
// @match           http://fuliba2030.net/*
// @match           https://fuliba2030.net/*
// @match           http://f.uliba.net/*
// @match           https://f.uliba.net/*
// @match           http://*.wnflb2020.com/*
// @match           https://*.wnflb2020.com/*
// @match           http://*.wnflb2021.com/*
// @match           https://*.wnflb2021.com/*
// @match           http://*.wnflb2022.com/*
// @match           https://*.wnflb2022.com/*
// @match           http://*.wnflb2024.com/*
// @match           https://*.wnflb2024.com/*
// @match           http://*.wnflb2025.com/*
// @match           https://*.wnflb2025.com/*
// @match           http://*.wnflb2026.com/*
// @match           https://*.wnflb2026.com/*
// @match           http://*.wnflb2027.com/*
// @match           https://*.wnflb2027.com/*
// @match           http://*.wnflb2028.com/*
// @match           https://*.wnflb2028.com/*
// @match           http://*.wnflb2029.com/*
// @match           https://*.wnflb2029.com/*
// @match           http://*.wnflb2030.com/*
// @match           https://*.wnflb2030.com/*
// @match           http://www.wnflb2020.com/*
// @match           https://www.wnflb2020.com/*
// @match           http://www.wnflb2021.com/*
// @match           https://www.wnflb2021.com/*
// @match           http://www.wnflb2022.com/*
// @match           https://www.wnflb2022.com/*
// @match           http://www.wnflb2024.com/*
// @match           https://www.wnflb2024.com/*
// @match           http://www.wnflb2025.com/*
// @match           https://www.wnflb2025.com/*
// @match           http://www.wnflb2026.com/*
// @match           https://www.wnflb2026.com/*
// @match           http://www.wnflb2027.com/*
// @match           https://www.wnflb2027.com/*
// @match           http://www.wnflb2028.com/*
// @match           https://www.wnflb2028.com/*
// @match           http://www.wnflb2029.com/*
// @match           https://www.wnflb2029.com/*
// @match           http://www.wnflb2030.com/*
// @match           https://www.wnflb2030.com/*
// @match           http://wnflb2023.com/*
// @match           https://wnflb2023.com/*
// @match           http://*.wnflb2023.com/*
// @match           https://*.wnflb2023.com/*
// @icon            data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAC1puYAeG/TAHxz1CF5cNJJe3HQBnt1ygJ7c8wIgXy9AXt0zAd4c8oGdm7bAHp9qAAAAAAAAAAAAAAAAAAAAAAAioDaACckvAB4cNSQeW/V1X5z1CZ7cNV9em/Vsnpv1ZR4b9OyeW/UpH1x1SN8cNYArL9QAJOI2wB3a9YAf3LYL31v2YF+cdc5enDWtHlv1cR9cdeHe2/X6H1w2c57b9jzenDVmnlv1vN7b9aWhXfNA39z0gCEe9kAh3/YBHxw2Kp8btn/fG/Y1ntv1915cNXAe2/Y2Hpv1+98b9nwfG/Z+X1x14F4b9XRem/X73lw0kB4b9QAhnvcAI+N1wF9cNqLe27Z/npv1/95b9b/eHDT2Hhv1fJ6cNWxfG/Z1npv1/97cNe5eHHUl3hu1f93b9Ope3TMB7C74wB/ctsAgXTcD3pw15h5b9b8eG7V/3Zu0/x3btT+enDWx3pv1+t5b9b2enHTUHlx00l3b9T4d2/U1Hpy0BkAAAAAfXLWAIF02B98cNejeW/W+npv1/95b9b/eW/W8nlw1KZ8cdeTeW/W83lv1eB6b9fjeW/W/3lw1at+dtAKrafkAHdr1wB8cdd5e2/Y/3pv1v96b9f/em/X/Hlv1el5b9Tae3DX2Xpw1ux6b9f/enDX5Hxx2KB8c9YneG/WAKyn5AB6btcAe3HWTHlv1ud6cNbeeG/U+3pv1vR7cdaleG/U8npw1cx5b9bzeW/V9Xty1FaXiucCgXXaAMK95wAAAAAAfnbWAIR+1gJ7cdZZe3HVq3lw1KB7cNe0f3PZXXpv1uV5cNTKem/W5Xlv1OF5cdE3dnDTAIN1zAAAAAAAAAAAAAAAAACDd9wAmo3xAXty1kl6cNScenDVe31x1298cNjVfXDYwntv1/R5btX/eG/Uw3px0RR6cdEAAAAAAAAAAAAAAAAAAAAAAIF02gCBdNskem/W33lu1v97cNfRe2/X53xu2f58b9j6e2/Y/3lv1ct8c9QVfXPUAAAAAAAAAAAAAAAAAAAAAAB+cdkAf3LZRHlv1fd3btT/eG/V+npv1/58btr/e2/Y/3pv1/94b9Ovf3nMBH52zQAAAAAAAAAAAAAAAAAAAAAAfHLWAH1z1zF4b9Tjd2/U4Hpx1Yp7cdeMe3DYpHlv1vF5b9X+eHDSgW5Z6QB8eMoAAAAAAAAAAAAAAAAAAAAAAH521gB/d9YEeXLUMnly1Cx+e9IEf3vUAn921wd9ctg/e3HWVnp00xJ5ctMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AcAAPgDAADAAQAAgAEAAIAAAADAAAAAwAAAAMABAADAAwAAwAcAAOADAADwAwAA8AMAAPAHAADwBwAA//8AAA==
// @require         https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require         https://greasyfork.org/scripts/403716-gm-config-cn/code/GM_config_CN.js
// @connect         keyfc.net
// @connect         fuliba123.com
// @grant           GM_info
// @grant           GM_setClipboard
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_xmlhttpRequest
// @grant           GM_addStyle
// @run-at          document-start
// @early-start
// @noframes
// @license         GNU General Public License v3.0 or later
// @namespace       https://greasyfork.org/scripts/522004
// @supportURL      https://greasyfork.org/scripts/522004
// @homepageURL     https://greasyfork.org/scripts/522004
// @downloadURL https://update.greasyfork.org/scripts/522004/%E7%A6%8F%E5%88%A9%E5%90%A7%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522004/%E7%A6%8F%E5%88%A9%E5%90%A7%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";
  if (typeof GM_config == "undefined") {
    console.error(
      "福利吧小助手:\nGM_config 库文件加载失败，脚本无法正常工作，请尝试刷新网页以重新加载。"
    );
  } else if (typeof document.arrive == "undefined") {
    console.error(
      "福利吧小助手:\narrive 库文件加载失败，脚本可能无法正常工作，请尝试刷新网页以重新加载。"
    );
  } else if (typeof CryptoJS == "undefined") {
    console.warn(
      "福利吧小助手:\nCryptoJS 库文件加载失败，BASE64 编解码功能无法使用。"
    );
  } else {
    console.debug("福利吧小助手:\n脚本工作环境正常。");
  }
  const icon = {
    settings: "url(https://www.svgrepo.com/download/529867/settings.svg)",
    codeGray: "url(https://www.svgrepo.com/download/362599/code-bold.svg)",
    codeBlue: "url(https://www.svgrepo.com/download/528184/code.svg)",
    modeNight: "url(https://www.svgrepo.com/download/528178/cloudy-moon.svg)",
    modeDay: "url(https://www.svgrepo.com/download/407540/sun.svg)",
    signatureAdd: "url(https://www.svgrepo.com/download/528833/add-square.svg)",
    signatureMinus:
      "url(https://www.svgrepo.com/download/529096/minus-square.svg)",
    collapsedYes: "static/image/common/collapsed_yes.gif",
    collapsedNo: "static/image/common/collapsed_no.gif",
  };
  const style = {
    // 设置面板样式
    settings: `
  #myGoodBoyConfig {
  --primary: #4A90E2;
  --text: #333;
  --bg: #FFF;
  --border: #E0E0E0;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  }
  
  #myGoodBoyConfig .section_header {
  padding: 1rem;
  background: var(--primary);
  border-radius: 0.4rem;
  }
  
  #myGoodBoyConfig input[type="checkbox"] {
  width: 1.2em;
  height: 1.2em;
  }
  
  #myGoodBoyConfig button {
  padding: 0.6em 1.2em;
  border-radius: 0.4em;
  transition: opacity 0.2s;
  }
  
  #myGoodBoyConfig button:hover {
  opacity: 0.9;
  }
  `,

    // 代码面板样式
    codePanel: `
  #myCodePanel {
  width: 35vw !important;
  max-width: 25rem;
  min-height: 20rem;
  border-radius: 0.8rem;
  box-shadow: 0 0.2rem 1rem rgba(0,0,0,0.1);
  }
  
  .nav-tabs {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    margin: 10px 0;
  }
  
  .section_header {
    flex: 1;
    min-width: 120px;
    text-align: center;
    padding: 2px 12px;
    box-sizing: border-box;
    border-bottom: 2px solid transparent;
  }
  
  .section_header.active {
    font-weight: bold;
  }
  
  #myCodePanel textarea {
  width: 100%;
  min-height: 10em;
  padding: 0.8em;
  border-radius: 0.4em;
  }
  
  #myCodePanel button {
  padding: 0.6em 1.2em;
  border-radius: 0.4em;
  }
  
  .config_var {
    width: 95%;
    box-sizing: border-box;
    margin: 10px auto;
    padding: 5px;
  }
  
  .config_var textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: monospace;
    resize: vertical;
  }
  
  #myCodePanel .section_desc {
    width: 100%
  }
  `,

    // 夜间模式样式
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
  
  .signature_switch_div {
    background-color: #00A1D6 !important;
    filter: brightness(1.5) contrast(1.2);
    box-shadow: 0 0 3px rgba(0,255,0,0.5);
  }
  
  `,
    blocked: `
      .my-blocked {
          position: relative;
          opacity: 0.6;
          transition: opacity 0.3s;
      }
      .my-blocked::after {
          content: "🚫";
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2em;
      }
      .my-blocked-alert {
          background: #fff0f0;
          border-left: 3px solid #ff4d4d;
          padding: 8px;
          margin: 5px 0;
      }
      `,
    // 基础样式
    basic: `
  :root {
  --link-color: #369;
  --hover-color: #2B65B7;
  }
  
  .container.my-custom-width {
    max-width: none !important;
    width: var(--custom-content-width) !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
  
  .my_good_boy_div_float {
  position: absolute;
  width: 20rem;
  padding: 1rem;
  margin: 0 1rem 1rem 0;
  border: 0.1rem solid var(--border);
  border-radius: 0.8rem;
  box-shadow: 0 0.2rem 0.8rem rgba(0,0,0,0.1);
  }
  
  .my_good_boy_div_basic {
  margin-top: 16px;
  }
  
  .my_good_boy_p {
  color: #FF4D4F;
  font-size: 15px;
  margin: 8px 0;
  }
  
  .my_good_boy_p_float {
  margin-left: 0 !important;
  }
  
  .my_good_boy_li {
  list-style-type: disc;
  white-space: nowrap;
  margin: 8px 0;
  }
  
  .my_good_boy_a {
  color: var(--link-color);
  text-decoration: none;
  }
  
  .my_good_boy_a:hover {
  color: var(--hover-color);
  text-decoration: underline;
  }
  
  .my_good_boy_a_copy {
  display: inline-block;
  font-size: 15px;
  margin-left: 20px;
  text-decoration: underline;
  cursor: pointer;
  }
  
  .a_copy_completed {
  color: #FF6600 !important;
  animation: fadeIn 0.3s;
  }
  
  .link_faild {
  color: #999 !important;
  text-decoration: line-through !important;
  }
  
  .show_more_link {
  text-decoration: underline;
  color: var(--primary-color);
  cursor: pointer;
  }
  
  #settingsIcon {
  display: block;
  float: right;
  cursor: pointer;
  margin: 4px 5px;
  width: 17px;
  height: 17px;
  background-image: ${icon.settings};
  background-repeat: no-repeat;
  background-size: 16px auto;
  background-position: center;
  transition: transform 0.2s;
  }
  
  #settingsIcon:hover {
  opacity: 1;
  }
  
  .expand_box,
  .expand_box_h {
  bottom: 0;
  height: 60px;
  position: fixed;
  right: -6vw;
  transition: all 0.3s ease;
  width: 12vw;
  z-index: 999;
  }
  
  .expand_box_h {
  height: 120px;
  }
  
  .show_expand_box {
  right: 0;
  width: 6vw;
  }
  
  #myCodeSpan,
  #myNightSpan,
  #myNightSpan_2 {
  background-repeat: no-repeat;
  background-size: 32px auto;
  background-position: center;
  border-radius: 50%;
  color: #FFF;
  cursor: pointer;
  display: block;
  height: 38px;
  width: 38px;
  position: absolute;
  right: 1vw;
  transition: all 0.3s ease;
  }
  
  #myCodeSpan {
  background-image: ${icon.codeGray};
  background-color: #787878;
  bottom: 10px;
  }
  
  #myCodeSpan:hover {
  box-shadow: 0 0 10px rgba(0,255,0,0.5);
  background-image: ${icon.codeBlue};
  transform: scale(1.1);
  }
  
  #myNightSpan,
  #myNightSpan_2 {
  background-color: #00A1D6;
  }
  
  #myNightSpan {
  bottom: 10px;
  }
  
  #myNightSpan_2 {
  bottom: 60px;
  }
  
  #myNightSpan:hover,
  #myNightSpan_2:hover {
  box-shadow: 0 0 10px rgba(0,255,0,0.5);
  transform: scale(1.1);
  }
  
  .signature_switch_div {
  position: absolute;
  top: 5px;
  z-index: 100;
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
  transition: all 0.2s;
  }
  
  .signature_switch_div:hover {
  transform: scale(1.1);
  }
  
  .signature_switch_close {
  background-image: ${icon.signatureAdd};
  }
  
  .signature_hide {
    display: none;
  }
  
  @keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
  }
  `,
  };

  // 定义网站地址常量
  const SITE_URLS = {
    HOME: "",
    FORUM: "",
  };
  const reg = {
    url: /^[\s\S]*?(magnet:\?xt=urn:btih:(?:[a-z0-9]{40}|[a-z0-9]{32})|ftp:\/\/\S*|ed2k:\/\/\S*|thunder:\/\/\S*|flashget:\/\/\S*|qqdl:\/\/\S*|xfplay:\/\/\S*|https?:\/\/[\w零一二三四五六七八九壹贰叁肆伍陆柒捌玖-]*\.?[\w零一二三四五六七八九壹贰叁肆伍陆柒捌玖-]+\.+\w+\S*)/i,
    download:
      /^[\s\S]*?(magnet:\?xt=urn:btih:(?:[a-z0-9]{40}|[a-z0-9]{32})|ed2k:\/\/\S*|thunder:\/\/\S*)/i,
    www: /^[\s\S]*?(www\.[\w-]+\.[a-z]+[\w#=%+?/-]*)/i,
    baidupan: /^https?:\/\/pan\.baidu\.com\/s(?:hare)?\/[\w=?&-]+$/i,
    baidupanIncludeCode:
      /^https?:\/\/pan\.baidu\.com\/s(?:hare)?\/[\w=?#&-]+$/i,
    code: /(?:提取)+[^a-z0-9解压]*([a-z0-9]{4})[^a-z0-9]*/i,
    baidupanCode:
      /^(?:(?:下载)?链接\S+\s+)?(?:[^解压]+\s+)?[^a-z0-9解压]*([a-z0-9]{4})[^a-z0-9]*(?:app)?[^a-z0-9]*$/i,
    singleCharCode: /^[a-z0-9]$/i,
    missingHeaderBaidupan:
      /^[\s\S]*?[^/\w-]?((?<!xunlei\.com\/)s(?:hare)?\/[\w=?-]{10,50})/i,
    missingHeaderBaidupanTest: /^([\w=?-]{15,50})\s+[a-z0-9]{4}$/i,
    pan: /^[\s\S]*?(pan\.(?:baidu|xunlei|lanzou)\.com\/?s?(?:hare)?\/[\w=?&-]+)/i,
    hash: /(?:[^a-z0-9]|^)([a-z0-9]{40}|[a-z0-9]{32})(?:&dn=.*|[^a-z0-9]|$)/i,
    md5: /(?:md5[^a-z0-9]+|sha1[^a-z0-9]+)/i,
    core: /^.*?((?:富强|民主|文明|和谐|自由|平等|公正|法治|爱国|敬业|诚信|友善){10,}).*?$/i,
    baijia:
      /^.*?([\s\S]*?[赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻福水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳唐罗薛伍余米贝姚孟顾尹江钟竺]{10,}[\s\S]*?)$/i,
    foyu: /^.*?((?:佛曰：|如是我闻：)\S{10,}).*?$/i,
    prefixLinkMagnet: /^https?:\/\/www\.wnflb\d*\.com\/magnet:\?xt=.*$/i,
    prefixLinkMagnetReplace: /^https?:\/\/www\.wnflb\d*\.com\//i,
    prefixCode:
      /^https?:\/\/www\.wnflb\d*\.com\/(\w+-\w+$|chrome-extension:\/\/)/i,
    prefixHash: /^https?:\/\/www\.wnflb\d*\.com\/([a-z0-9]{40}|[a-z0-9]{32})$/i,
    prefixUrl:
      /^https?:\/\/www\.wnflb\d*\.com\/(www\..*$|.*\.(?:com|net|cn|org|site|info|edu|gov)$)/i,
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
  const ELEMENTS_TO_REMOVE = [
    ".topbar",
    ".breadcrumbs",
    ".branding",
    "#focusslide",
    ".sidebar",
    ".post-copyright",
    ".shares",
    ".action.action-rewards",
    ".title.excerpts-title .more",
  ];

  const KEEP_KEYWORDS = [
    "RSS",
    "联系TG",
    "联系邮箱",
    "百家姓暗号",
    "核心价值观",
    "加密解密工具",
    "地址发布",
    "搜索",
  ];

  const BLOCK_KEYWORDS = [
    "内裤",
    "邀请码",
    "购物",
    "淘宝",
    "taobao",
    "手机卡",
    "流量卡",
    "网赚",
  ];
  const coreValues = "富强民主文明和谐自由平等公正法治爱国敬业诚信友善";
  const baijiaValues = new Map([
    ["赵", "0"],
    ["钱", "1"],
    ["孙", "2"],
    ["李", "3"],
    ["周", "4"],
    ["吴", "5"],
    ["郑", "6"],
    ["王", "7"],
    ["冯", "8"],
    ["陈", "9"],
    ["褚", "a"],
    ["卫", "b"],
    ["蒋", "c"],
    ["沈", "d"],
    ["韩", "e"],
    ["杨", "f"],
    ["朱", "g"],
    ["秦", "h"],
    ["尤", "i"],
    ["许", "j"],
    ["何", "k"],
    ["吕", "l"],
    ["施", "m"],
    ["张", "n"],
    ["孔", "o"],
    ["曹", "p"],
    ["严", "q"],
    ["华", "r"],
    ["金", "s"],
    ["魏", "t"],
    ["陶", "u"],
    ["姜", "v"],
    ["戚", "w"],
    ["谢", "x"],
    ["邹", "y"],
    ["喻", "z"],
    ["福", "A"],
    ["水", "B"],
    ["窦", "C"],
    ["章", "D"],
    ["云", "E"],
    ["苏", "F"],
    ["潘", "G"],
    ["葛", "H"],
    ["奚", "I"],
    ["范", "J"],
    ["彭", "K"],
    ["郎", "L"],
    ["鲁", "M"],
    ["韦", "N"],
    ["昌", "O"],
    ["马", "P"],
    ["苗", "Q"],
    ["凤", "R"],
    ["花", "S"],
    ["方", "T"],
    ["俞", "U"],
    ["任", "V"],
    ["袁", "W"],
    ["柳", "X"],
    ["唐", "Y"],
    ["罗", "Z"],
    ["薛", "."],
    ["伍", "-"],
    ["余", "_"],
    ["米", "+"],
    ["贝", "="],
    ["姚", "/"],
    ["孟", "?"],
    ["顾", "#"],
    ["尹", "%"],
    ["江", "&"],
    ["钟", "*"],
    ["高", ":"],
    ["田", "|"],
  ]);

  // 创建反向映射，用于编码
  const reverseMap = new Map(
    Array.from(baijiaValues.entries()).map(([k, v]) => [v, k])
  );

  // 预编译正则表达式
  const MAGNET_PREFIX_REGEX = /^magnet:\?xt=urn:btih:/;
  const TRIM_REGEX = /^\s+|\s+$/g;
  const HTTP_PROTOCOL_REGEX = /^https?\/\//i;
  const URL_PROTOCOL_REGEX = /^(https?:\/\/|ed2k:\/\/)/;

  const CONFIG = {
    DEFAULT_ACCESS_NUM: 90,
    MAX_ACCESS_NUM: 90,
    LEVEL_ACCESS_MAP: {
      "-1": 0,
      0: 5,
    },
  };

  const IMAGE_SELECTOR = [
    'img[src*="avatar"]',
    'img[id*="aimg"]',
    "img.thumb",
    'img[decoding="async"]',
  ].join(",");

  const status = {
    nightEnable: GM_config.getValue("nightEnable", false),
    collapsedGwwzEnable: GM_config.getValue("collapsedGwwzEnable", false),
    accessNum: GM_config.getValue("accessNumber", 90),
    nightStyleDom: null,
    checkDate: GM_config.getValue("checkDate", "2000-1-1"),
    oldUrl: location.href,
    timer1: null,
    timer2: null,
    timer3: null,
    timer4: null,
  };
  class Good_Boy {
    constructor(config, linkArray = []) {
      this.config = config;
      this.floatEnable = this.isMobilePage()
        ? false
        : config.get("displayPosition") == "右侧";
      this.linkArray = linkArray;
      this.totalCount = linkArray.length;
      this.currentCount = 0;
      this.showMoreStatus = false;
      this.insertUlStatus = false;
      this.ulNode = document.createElement("ul");
    }
    insertLinkItem(linkArray = []) {
      this.linkArray = this.linkArray.concat(linkArray);
      this.totalCount = this.linkArray.length;
      const maxLinkNumber = this.config.get("maxLinkNumber");
      for (
        let i = this.currentCount;
        i < this.totalCount && i < maxLinkNumber;
        i++
      ) {
        const tempA = this.createLink(this.linkArray[i]);
        tempA && this.ulNode.appendChild(tempA);
      }
      this.currentCount = Math.min(this.totalCount, maxLinkNumber);
      if (maxLinkNumber > -1 && this.totalCount > maxLinkNumber) {
        const message = `[共提取到 ${this.totalCount} 个链接，仅显示前 ${maxLinkNumber} 个]：`;
        const pElement = this.ulNode.getElementsByTagName("p")[0];
        pElement && (pElement.textContent = message);
        if (!this.showMoreStatus) {
          this.ulNode.appendChild(this.showMoreLink());
          this.showMoreStatus = true;
        }
      } else {
        const message = `[共提取到 ${this.totalCount} 个链接]：`;
        const pElement = this.ulNode.getElementsByTagName("p")[0];
        pElement && (pElement.textContent = message);
      }
    }
    isMobilePage() {
      return /android|webos|iphone|ipod|blackberry/i.test(navigator.userAgent);
    }
    getCutLinkText(linkText) {
      if (this.isMobilePage()) {
        return linkText.length >= 35
          ? linkText.slice(0, 15) + " ... " + linkText.slice(-10)
          : linkText;
      } else if (this.floatEnable) {
        return linkText.length >= 50
          ? linkText.slice(0, 25) + " ... " + linkText.slice(-15)
          : linkText;
      }
      return linkText.length >= 80
        ? linkText.slice(0, 45) + " ... " + linkText.slice(-25)
        : linkText;
    }
    managePrefixCode(inputLink) {
      const { prefixCode, prefixHash, prefixReplace, prefixUrl, redircdn } =
        reg;
      if (prefixCode.test(inputLink)) {
        return inputLink.replace(prefixReplace, "");
      } else if (prefixHash.test(inputLink)) {
        return inputLink.replace(prefixReplace, "magnet:?xt=urn:btih:");
      } else if (prefixUrl.test(inputLink)) {
        return inputLink.replace(prefixReplace, "http://");
      } else if (redircdn.test(inputLink)) {
        return inputLink.replace(redircdn, "$1").replace("______", ".");
      }
      return inputLink;
    }
    createLink(linkHref) {
      const { baidupanIncludeCode } = reg;
      if (linkHref.length > 2000) {
        return null;
      }
      const linkLi = document.createElement("li");
      linkLi.className = "my_good_boy_li";
      const linkA = document.createElement("a");
      linkA.title = "点击访问";
      linkHref = this.managePrefixCode(linkHref);
      linkA.className = "my_good_boy_a";
      linkA.href = encodeURI(linkHref);
      linkA.target = "_blank";
      linkA.textContent = this.getCutLinkText(linkHref);
      linkA.style.color = this.config.get("linkColor");
      linkLi.appendChild(linkA);
      if (this.config.get("copyEnable")) {
        const copyA = document.createElement("a");
        copyA.className = "my_good_boy_a_copy";
        copyA.title = "复制链接";
        copyA.href = "javascript:;";
        copyA.target = "_self";
        copyA.textContent = "复制";
        copyA.style.color = this.config.get("linkColor");
        copyA.addEventListener(
          "click",
          function () {
            GM_setClipboard(linkHref, "text");
            this.classList.add("a_copy_completed");
            this.title = "复制成功";
            status.timer1 && clearTimeout(status.timer1);
            status.timer1 = setTimeout(() => {
              this.classList.remove("a_copy_completed");
              this.title = "复制链接";
            }, 2000);
          },
          { passive: true }
        );
        linkLi.appendChild(copyA);
        if (
          baidupanIncludeCode.test(linkHref) &&
          /(?:#|\?pwd=)[a-z0-9]{4}$/i.test(linkHref)
        ) {
          const codeMatch = /#([a-z0-9]{4})$/i.exec(linkHref);
          if (!codeMatch) return linkLi;
          const codeValue = codeMatch[1];
          const codeCopyA = document.createElement("a");
          codeCopyA.className = "my_good_boy_a_copy";
          codeCopyA.title = "复制提取码";
          codeCopyA.href = "javascript:;";
          codeCopyA.target = "_self";
          codeCopyA.textContent = "复制提取码";
          codeCopyA.style.color = this.config.get("linkColor");
          codeCopyA.addEventListener(
            "click",
            function () {
              GM_setClipboard(codeValue, "text");
              this.classList.add("a_copy_completed");
              this.title = "复制成功";
              status.timer2 && clearTimeout(status.timer2);
              status.timer2 = setTimeout(() => {
                this.classList.remove("a_copy_completed");
                this.title = "复制提取码";
              }, 2000);
            },
            { passive: true }
          );
          linkLi.appendChild(codeCopyA);
        }
      }
      return linkLi;
    }
    showMoreLink() {
      const linkLi = document.createElement("li");
      linkLi.className = "my_good_boy_li";
      const linkA = document.createElement("a");
      linkA.className = "my_good_boy_a show_more_link";
      linkA.href = "javascript:;";
      linkA.title = "显示全部提取链接";
      linkA.textContent = "显示全部";
      linkA.target = "_self";
      linkA.style.color = this.config.get("linkColor");
      linkA.addEventListener(
        "click",
        () => {
          this.ulNode.removeChild(linkLi);
          for (; this.currentCount < this.totalCount; this.currentCount++) {
            const tempA = this.createLink(this.linkArray[this.currentCount]);
            tempA && this.ulNode.appendChild(tempA);
          }
          this.ulNode.getElementsByTagName("p")[0].textContent =
            "[共提取到 " + this.totalCount + " 个链接]:";
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
        const goodBoyDiv = document.createElement("div");
        goodBoyDiv.className = this.floatEnable
          ? "my_good_boy_div_float"
          : "my_good_boy_div_basic";
        const goodBoyP = document.createElement("p");
        goodBoyP.className = this.floatEnable
          ? "my_good_boy_p my_good_boy_p_float"
          : "my_good_boy_p";
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
      backLinkArray.length > 0 &&
        this.createGoodBoyFrame(container, backLinkArray);
    }
    managePrefix(inputLinkArray) {
      const { prefixLinkMagnet, prefixLinkMagnetReplace } = reg;
      const returnLinkArray = [];
      inputLinkArray.forEach((item) => {
        returnLinkArray.push(
          prefixLinkMagnet.test(item)
            ? item.replace(prefixLinkMagnetReplace, "")
            : item
        );
      });
      return returnLinkArray;
    }
    pickUpMagnet(item) {
      const { url, download, hash, md5 } = reg;
      let tempLink = "";
      const item1 = item.replace(/[^a-z0-9:=?/\\.&%|-]/gi, "");
      if (download.test(item1)) {
        tempLink = download.exec(item1)[1];
      } else {
        const item2 = item.replace(/[^a-z0-9:=?/\\.,，。|\s+-]/gi, "");
        if (!md5.test(item2) && hash.test(item2) && !url.test(item2)) {
          const tempHash = hash.exec(item2)[1];
          if (!/^(?:[a-z]+|[0-9]+)$/i.test(tempHash)) {
            tempLink = "magnet:?xt=urn:btih:" + tempHash;
          }
        }
      }
      return tempLink;
    }
    manageText(textArray) {
      const {
        url,
        download,
        www,
        missingHeaderBaidupan,
        missingHeaderBaidupanTest,
        pan,
        hash,
        md5,
      } = reg;
      const tempArray = [];
      textArray.forEach((item) => {
        let tempLink = "";
        if (pan.test(item)) {
          tempLink = "https://" + pan.exec(item)[1];
        } else if (/magnet:|ed2k:|thunder:/i.test(item)) {
          if (download.test(item)) {
            tempLink = download.exec(item)[1];
          }
        } else if (url.test(item)) {
          tempLink = url.exec(item)[1];
        } else if (www.test(item)) {
          tempLink = "http://" + www.exec(item)[1];
        } else if (missingHeaderBaidupan.test(item)) {
          const linkMissValue = missingHeaderBaidupan.exec(item)[1];
          tempLink = /^\//i.test(linkMissValue)
            ? "https://pan.baidu.com" + linkMissValue
            : "https://pan.baidu.com/" + linkMissValue;
        } else if (missingHeaderBaidupanTest.test(item)) {
          tempLink =
            "https://pan.baidu.com/s/" +
            missingHeaderBaidupanTest.exec(item)[1];
        } else if (!md5.test(item) && hash.test(item)) {
          tempLink = "magnet:?xt=urn:btih:" + hash.exec(item)[1];
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
      textArray.forEach((item) => {
        let tempValue = "";
        if (code.test(item)) {
          tempValue = code.exec(item)[1];
        } else if (baidupanCode.test(item)) {
          tempValue = baidupanCode.exec(item)[1];
        } else if (singleCharCode.test(item)) {
          charArray.push(item);
        }
        if (
          tempValue &&
          !/\d{4}/i.test(tempValue) &&
          codeArray.indexOf(tempValue) === -1
        ) {
          codeArray.push(tempValue);
        }
      });
      while (charArray.length > 0 && charArray.length % 4 === 0) {
        const tempCode = charArray.splice(0, 4);
        const charValue = tempCode.join("");
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
          if (
            getPureLink(inputLinkArray[i]) === getPureLink(inputLinkArray[j])
          ) {
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
      textArray.forEach((text) => {
        if (text) {
          tempArray = tempArray.concat(text.split("\n").filter((v) => v));
        }
      });
      return tempArray;
    }
    autoEvent(
      container,
      linkObjArray,
      baiduObjArray,
      _linksArray,
      hideTextArray,
      showTextArray,
      nodeTextArray
    ) {
      const { url, baidupan, hash, md5 } = reg;
      const linkArray = [];
      const linkTextArray = [];
      linkObjArray.forEach((item) => {
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
      const concatTextArray = this.manageRepeatArray(
        this.decodeLink(hideTextArray)
      );
      let concatLinkArray = this.manageRepeatArray(
        this.decodeLink(this.manageText(linkArray.concat(concatTextArray)))
      );
      const generalTextArray = showTextArray.concat(
        nodeTextArray.concat(linkTextArray)
      );
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
              concatLinkArray[indexA[k]] += "?pwd=" + codeB[k];
            }
          }
        } else if (codeB.length === baiduObjArray.length) {
          for (let l = 0; l < baiduObjArray.length; l++) {
            if (!/\?pwd=/.test(baiduObjArray[l].ele.href)) {
              baiduObjArray[l].ele.textContent =
                baiduObjArray[l].eleContainer + "?pwd=" + codeB[l];
              baiduObjArray[l].ele.href =
                baiduObjArray[l].eleValue + "?pwd=" + codeB[l];
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
              concatLinkArray[indexA[k]] += "?pwd=" + codeC[k];
            }
          } else if (codeC.length === baiduObjArray.length) {
            for (let l = 0; l < baiduObjArray.length; l++) {
              baiduObjArray[l].ele.textContent =
                baiduObjArray[l].eleContainer + "?pwd=" + codeC[l];
              baiduObjArray[l].ele.href =
                baiduObjArray[l].eleValue + "?pwd=" + codeC[l];
            }
          }
        }
      }
      let hashArray = [];
      generalTextArray.forEach((item) => {
        if (!url.test(item)) {
          if (!md5.test(item) && hash.test(item)) {
            hashArray.push("magnet:?xt=urn:btih:" + hash.exec(item)[1]);
          } else if (item.length > 32) {
            let temp_link = this.pickUpMagnet(item);
            temp_link && hashArray.push(temp_link);
          }
        }
      });
      hashArray = this.decodeLink(hashArray);
      concatLinkArray = this.manageRepeatArray(
        concatLinkArray.concat(hashArray)
      );
      const hideCodeTextArray = this.decodeCoreValues(
        container,
        hideTextArray.concat(generalTextArray)
      );
      if (hideCodeTextArray.length > 0) {
        hideCodeTextArray.forEach((item, index) => {
          if (!url.test(item)) {
            if (!md5.test(item) && hash.test(item)) {
              hideCodeTextArray[index] =
                "magnet:?xt=urn:btih:" + hash.exec(item)[1];
            } else if (item.length > 32) {
              const tempLink = this.pickUpMagnet(item);
              if (tempLink) {
                hideCodeTextArray[index] = tempLink;
              }
            }
          }
        });
        concatLinkArray = this.manageRepeatArray(
          concatLinkArray.concat(hideCodeTextArray)
        );
      }
      concatLinkArray = concatLinkArray
        .map((item) => {
          if (generalTextArray.includes(item)) {
            return null;
          }
          return item;
        })
        .filter((v) => v);
      return concatLinkArray;
    }
    foyuPromise(encoded) {
      return new Promise(function (resolve, _reject) {
        GM_xmlhttpRequest({
          method: "POST",
          url: "https://keyfc.net/bbs/tools/tudou.aspx",
          data: "orignalMsg=" + encoded.replace(/\s/g, "") + "&action=Decode",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          onload: function (res) {
            if (res.status == 200 && res.readyState == 4) {
              resolve(
                res.responseText.replace(/^<\/Message><\/BUDDHIST>$/g, "")
              );
            } else {
              console.warn("福利吧小助手:\n自动解码出错！");
              resolve("");
            }
          },
          onerror: function () {
            console.error("福利吧小助手:\n网络链接出错！");
            resolve("");
          },
        });
      });
    }
    async foyuDecode(container, encoded) {
      await this.foyuPromise(encoded).then((data) => {
        data && this.createGoodBoyFrame(container, [data]);
      });
    }
    decodeCoreValues(container, textArray) {
      const { core, baijia, foyu } = reg;
      const decodeArray = [];
      textArray.forEach((item) => {
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
  }
  function randBin() {
    return Math.random() >= 0.5;
  }
  function str2Utf8(str) {
    const ENCODED_CHARS = /[A-Za-z0-9\-_.!~*'()]/g;
    return Array.from(str)
      .map((char) => {
        if (ENCODED_CHARS.test(char)) {
          ENCODED_CHARS.lastIndex = 0;
          return char.codePointAt(0).toString(16);
        }
        const code = char.charCodeAt(0);
        if (code < 128) {
          return code.toString(16).padStart(2, "0");
        }
        if (code < 2048) {
          return (
            ((code >> 6) | 0xc0).toString(16) +
            ((code & 0x3f) | 0x80).toString(16)
          );
        }
        return (
          ((code >> 12) | 0xe0).toString(16) +
          (((code >> 6) & 0x3f) | 0x80).toString(16) +
          ((code & 0x3f) | 0x80).toString(16)
        );
      })
      .join("")
      .toUpperCase();
  }
  function hex2Duo(hexs) {
    const duo = new Array(hexs.length * 2);
    let index = 0;
    const len = hexs.length;
    for (let i = 0; i < len; i++) {
      const n =
        hexs[i] >= "a"
          ? hexs.charCodeAt(i) - 87
          : hexs[i] >= "A"
          ? hexs.charCodeAt(i) - 55
          : hexs.charCodeAt(i) - 48;
      if (n < 10) {
        duo[index++] = n;
      } else {
        if (randBin()) {
          duo[index++] = 10;
          duo[index++] = n - 10;
        } else {
          duo[index++] = 11;
          duo[index++] = n - 6;
        }
      }
    }
    return duo.slice(0, index);
  }
  function utf82Str(utfs) {
    const len = utfs.length * 2;
    const arr = new Array(len);
    for (let i = 0, j = 0; i < utfs.length; i++) {
      arr[j++] = "%";
      arr[j++] = utfs[i];
    }
    return decodeURIComponent(arr.join(""));
  }
  function duo2Hex(duo) {
    const l = duo.length;
    const result = new Array(l);
    let pos = 0;
    for (let i = 0; i < l; i++) {
      const curr = duo[i];
      if (curr < 10) {
        result[pos++] = curr.toString(16).toUpperCase();
      } else if (curr === 10) {
        result[pos++] = (duo[++i] + 10).toString(16).toUpperCase();
      } else {
        result[pos++] = (duo[++i] + 6).toString(16).toUpperCase();
      }
    }
    return result.slice(0, pos).join("");
  }
  function duo2Values(duo) {
    return duo.map((d) => coreValues[2 * d] + coreValues[2 * d + 1]).join("");
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
    return str == "右侧";
  }
  function baijiaEncode(str) {
    const cleaned = str.replace(TRIM_REGEX, "");
    const value = cleaned.replace(MAGNET_PREFIX_REGEX, "");
    return Array.from(value)
      .map((char) => reverseMap.get(char) || "")
      .join("");
  }
  function baijiaDecode(encoded) {
    const decoded = Array.from(encoded)
      .map((char) => baijiaValues.get(char) || "")
      .join("");
    if (HTTP_PROTOCOL_REGEX.test(decoded)) {
      return decoded.replace(/^(https?)/, "$1:");
    }
    if (URL_PROTOCOL_REGEX.test(decoded)) {
      return decoded;
    }
    return `magnet:?xt=urn:btih:${decoded}`;
  }
  function convertChineseNumber(textString) {
    return textString.replace(
      /[零一二三四五六七八九壹贰叁肆伍陆柒捌玖]/gi,
      (arg0) => {
        let index = "零一二三四五六七八九".indexOf(arg0);
        if (index === -1) {
          index = "壹贰叁肆伍陆柒捌玖".indexOf(arg0) + 1;
        }
        return index;
      }
    );
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
          outputLink = outputLink.replace(/#[a-z0-9]{4}$/i, "");
        }
      } else if (
        /^https?:\/\/www\.bilibili\.com\/video\/av\d+\?from=search/i.test(
          outputLink
        )
      ) {
        outputLink = outputLink.replace(/\?from=search.*/, "");
      }
    }
    let returnLink = outputLink
      .replace(
        /(^(?:\s+)?(?:\[url\])?(?:\s+)?(?:https?:\/\/)?|(?:\/+)?(?:\s+)?(?:\[\/url\])?$|%C2%A0$)/gi,
        ""
      )
      .replace(/%C2%A0/gi, "%20");
    try {
      returnLink = decodeURI(returnLink);
    } catch (e) {
      console.warn("福利吧小助手:\n出现编码转换错误。", outputLink);
      console.warn(e);
      returnLink = outputLink
        .replace(
          /(^(?:\s+)?(?:\[url\])?(?:\s+)?(?:https?:\/\/)?|(?:\/+)?(?:\s+)?(?:\[\/url\])?$|%C2%A0$)/gi,
          ""
        )
        .replace(/%C2%A0/gi, "%20");
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
    const linkA = container.getElementsByTagName("a");
    const tempObj = {
      linkObjArray: [],
      baiduObjArray: [],
      linksArray: [],
    };
    const tempBaiduArray = [];
    for (let i = 0; i < linkA.length; i++) {
      if (linkA[i].closest("div.aimg_tip")) {
        continue;
      }
      const tempLink = linkA[i].href;
      if (filterLink(tempLink)) {
        const tempImg = linkA[i].querySelectorAll("img");
        if (
          tempImg.length === 0 ||
          (tempImg.length > 0 &&
            tempImg[0].src !== tempLink &&
            tempImg[0].getAttribute("file") !== tempLink)
        ) {
          const tempText = linkA[i].innerText.replace(/^\s+|\s+$/gi, "");
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
        tempObj.linksArray.indexOf(tempLink) === -1 &&
          tempObj.linksArray.push(tempLink);
      }
    }
    return tempObj;
  }
  // 定义常量，提高可读性和性能
  const GRAY_THRESHOLD = 192;
  const OPACITY_THRESHOLD = 0.2;
  const GRAY_COEFFICIENTS = {
    R: 0.299,
    G: 0.587,
    B: 0.114,
  };
  function judgeColor(color) {
    // 使用一个正则表达式同时匹配 rgb 和 rgba
    const matches = color.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/i
    );
    if (!matches) return false;
    const [, r, g, b, a = 1] = matches.map((val) => +val);
    // 如果是 rgba 且透明度低于阈值，直接返回
    if (a <= OPACITY_THRESHOLD) return true;
    // 计算灰度值
    const grayLevel =
      r * GRAY_COEFFICIENTS.R +
      g * GRAY_COEFFICIENTS.G +
      b * GRAY_COEFFICIENTS.B;
    return grayLevel > GRAY_THRESHOLD;
  }
  // rgb 转 rgba 函数
  function rgb2Rgba(colorString) {
    const matches = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
    if (!matches) return colorString;
    const [, r, g, b] = matches;
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }
  function display_Text(container, newTextColor, newTextBackgroundColor) {
    const { url } = reg;
    const tempObj = {
      hideTextArray: [],
      showTextArray: [],
    };

    // 处理font标签
    const textFont = container.getElementsByTagName("font");
    for (let i = 0; i < textFont.length; i++) {
      if (
        textFont[i].closest(".quote") ||
        textFont[i].getElementsByClassName("aimg_tip").length !== 0
      ) {
        continue;
      }
      const tempText = textFont[i].innerText.replace(/^\s+|\s+$/gi, "");
      if (!/^\s*$/i.test(tempText)) {
        const textColor = window.getComputedStyle(textFont[i]).color;
        const textBackgroundColor = window.getComputedStyle(
          textFont[i]
        ).backgroundColor;
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
        } else if (
          textFont[i].childNodes.length === 1 &&
          textFont[i].childNodes[0].nodeType === 3
        ) {
          if (GM_config.get("extractEnable")) {
            if (url.test(tempText)) {
              textFont[i].innerHTML = textFont[i].innerHTML.replace(
                url,
                (_arg0, arg1) => {
                  return (
                    '<a href="' +
                    convertChineseNumber(arg1) +
                    '" title="点击访问" target="_blank">' +
                    convertChineseNumber(arg1) +
                    "</a>"
                  );
                }
              );
            }
          }
          !tempObj.showTextArray.includes(tempText) &&
            tempObj.showTextArray.push(tempText);
        } else if (textFont[i].childNodes.length > 1) {
          const tFont = textFont[i].childNodes;
          for (let child_index in tFont) {
            analysisText(tFont[child_index]);
          }
          !tempObj.showTextArray.includes(tempText) &&
            tempObj.showTextArray.push(tempText);
        }
      }
    }

    // 处理table标签
    const tempTable = container.getElementsByTagName("table");
    for (let j = 0; j < tempTable.length; j++) {
      if (
        !judgeColor(tempTable[j].style.backgroundColor) &&
        !judgeColor(tempTable[j].style.color)
      ) {
        tempTable[j].style.backgroundColor = newTextBackgroundColor;
      } else if (
        judgeColor(tempTable[j].style.color) &&
        judgeColor(tempTable[j].style.backgroundColor)
      ) {
        tempTable[j].style.color = newTextColor;
      }
    }

    // 处理blockquote标签
    const blockquotes = container.getElementsByTagName("blockquote");
    for (let k = 0; k < blockquotes.length; k++) {
      // 检查blockquote本身的颜色
      const blockquoteColor = window.getComputedStyle(blockquotes[k]).color;
      const blockquoteBgColor = window.getComputedStyle(
        blockquotes[k]
      ).backgroundColor;

      if (
        judgeColor(blockquoteColor) ||
        rgb2Rgba(blockquoteBgColor) === rgb2Rgba(blockquoteColor)
      ) {
        blockquotes[k].style.color = newTextColor;
        const tempText = blockquotes[k].innerText.replace(/^\s+|\s+$/gi, "");
        if (!/^\s*$/i.test(tempText)) {
          tempObj.hideTextArray.push(tempText);
        }
      }
    }

    // 处理strong标签
    const strongs = container.getElementsByTagName("strong");
    for (let m = 0; m < strongs.length; m++) {
      const strongColor = window.getComputedStyle(strongs[m]).color;
      const strongBgColor = window.getComputedStyle(strongs[m]).backgroundColor;
      const tempText = strongs[m].innerText.replace(/^\s+|\s+$/gi, "");

      if (!/^\s*$/i.test(tempText)) {
        if (judgeColor(strongColor) && judgeColor(strongBgColor)) {
          strongs[m].style.color = newTextColor;
          tempObj.hideTextArray.push(tempText);
        } else if (rgb2Rgba(strongBgColor) === rgb2Rgba(strongColor)) {
          strongs[m].style.backgroundColor = newTextBackgroundColor;
          strongs[m].style.color = newTextColor;
          tempObj.hideTextArray.push(tempText);
        } else if (!judgeColor(strongBgColor) && !judgeColor(strongColor)) {
          strongs[m].style.backgroundColor = newTextBackgroundColor;
          strongs[m].style.color = newTextColor;
          tempObj.hideTextArray.push(tempText);
        }
      }
    }

    // 处理span标签 (通常用于隐藏文本)
    const spans = container.getElementsByTagName("span");
    for (let n = 0; n < spans.length; n++) {
      const spanColor = window.getComputedStyle(spans[n]).color;
      const spanBgColor = window.getComputedStyle(spans[n]).backgroundColor;
      const tempText = spans[n].innerText.replace(/^\s+|\s+$/gi, "");

      if (!/^\s*$/i.test(tempText)) {
        if (judgeColor(spanColor) && judgeColor(spanBgColor)) {
          spans[n].style.color = newTextColor;
          tempObj.hideTextArray.push(tempText);
        } else if (rgb2Rgba(spanBgColor) === rgb2Rgba(spanColor)) {
          spans[n].style.backgroundColor = newTextBackgroundColor;
          spans[n].style.color = newTextColor;
          tempObj.hideTextArray.push(tempText);
        } else if (spanColor === "rgb(255, 255, 255)") {
          spans[n].style.color = newTextColor;
          tempObj.hideTextArray.push(tempText);
        }
      }
    }

    return tempObj;
  }
  function text2A(node) {
    const { url } = reg;
    const tempSpan = document.createElement("span");
    tempSpan.innerHTML = node.nodeValue.replace(url, (arg0, arg1) => {
      if (arg1.length > 2000) {
        return arg0;
      }
      return arg0.replace(
        arg1,
        '<a href="' +
          convertChineseNumber(arg1) +
          '" title="点击访问" target="_blank">' +
          convertChineseNumber(arg1) +
          "</a>"
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
        const tempText = nodeList[i].nodeValue.replace(/^\s+|\s+$/gi, "");
        if (!/^\s*$/i.test(tempText)) {
          if (GM_config.get("extractEnable")) {
            if (url.test(tempText)) {
              text2A(nodeList[i]);
            }
          }
          nodeTextArray.push(tempText);
        }
      } else if (
        nodeList[i].nodeType === 1 &&
        !nodeList[i].className.includes("quote") &&
        !nodeList[i].className.includes("pstatus") &&
        !nodeList[i].className.includes("aimg_tip") &&
        !nodeList[i].className.includes("blockcode") &&
        nodeList[i].nodeName !== "FONT" &&
        nodeList[i].nodeName !== "A" &&
        nodeList[i].nodeName !== "SCRIPT" &&
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
    return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
  }
  function getUpdateTime(unixTime) {
    if (!unixTime) return "";
    const formatter = new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return ` (更新时间: ${formatter
      .format(new Date(unixTime))
      .replace(/\//g, "-")})`;
  }
  // 用户权限相关的纯函数
  function calculateUserAccess(level) {
    if (level in CONFIG.LEVEL_ACCESS_MAP) {
      return CONFIG.LEVEL_ACCESS_MAP[level];
    }
    return level >= 1 && level <= 8 ? level * 10 : CONFIG.DEFAULT_ACCESS_NUM;
  }
  // 样式处理相关的纯函数
  function getPostStyle(type, color = "") {
    const styles = {
      blocked:
        "color: #999; font-weight: bold; text-decoration-line: line-through; text-decoration-color: #000000;",
      restricted: "color: #999; font-weight: bold;",
      highlighted: `font-weight: bold; color: ${color};`,
    };
    return styles[type] || "";
  }
  // 数字提取工具函数
  function extractNumber(text) {
    if (!text) return 0;
    return Number(text.replace("+", ""));
  }
  // 获取最大点赞数
  function getMaxAgreeCount(fontElements) {
    return Array.from(fontElements)
      .map((el) => extractNumber(el.textContent))
      .reduce((max, current) => Math.max(max, current), 0);
  }
  function highlightPost() {
    // 确保DOM已经加载
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => initHighlight());
    } else {
      initHighlight();
    }
  }
  // 初始化高亮功能
  function initHighlight() {
    try {
      updateUserAccessLevel();
      initializePostHighlighting();
    } catch (error) {
      console.warn("福利吧小助手:\n执行出错:", error.message);
    }
  }
  // 更新用户访问权限
  function updateUserAccessLevel() {
    try {
      const upMineElement = document.getElementById("g_upmine");
      if (!upMineElement) return;
      const levelMatch = /LV\.(-?[0-9])/.exec(upMineElement.textContent);
      if (!levelMatch) return;
      const newAccessNum = calculateUserAccess(levelMatch[1]);
      if (status.accessNum !== newAccessNum) {
        status.accessNum = newAccessNum;
        GM_config.setValue("accessNumber", newAccessNum);
      }
    } catch (error) {
      console.warn(
        "福利吧小助手:\n识别用户阅读权限出错，将使用存储中记录的用户阅读权限。"
      );
    }
    console.debug("福利吧小助手:\n用户阅读权限:", status.accessNum);
  }
  // 初始化帖子高亮
  function initializePostHighlighting() {
    // 缓存选择器字符串，避免重复创建字符串
    const THREADLIST_SELECTOR = "#threadlisttableid";
    // 立即检查目标元素
    const threadlist = document.querySelector(THREADLIST_SELECTOR);
    if (threadlist) {
      processThreadList(threadlist);
      return;
    }
    // 创建单个共享的 MutationObserver 配置对象
    const observerConfig = {
      childList: true,
      subtree: true,
    };
    // 使用函数声明提升性能，避免在回调中重复创建函数
    function threadlistCallback(mutations, obs) {
      const threadlist = document.querySelector(THREADLIST_SELECTOR);
      if (threadlist) {
        processThreadList(threadlist);
        obs.disconnect();
      }
    }
    function bodyCallback(mutations, obs) {
      if (document.body) {
        obs.disconnect();
        const observer = new MutationObserver(threadlistCallback);
        observer.observe(document.body, observerConfig);
      }
    }
    // 主逻辑
    if (document.body) {
      const observer = new MutationObserver(threadlistCallback);
      observer.observe(document.body, observerConfig);
    } else {
      const bodyObserver = new MutationObserver(bodyCallback);
      bodyObserver.observe(document.documentElement, {
        childList: true,
      });
    }
  }
  // 处理帖子列表
  function processThreadList(tbody) {
    const items = tbody.querySelectorAll(".common, .new, .lock");
    items.forEach(processPostItem);
  }
  // 处理单个帖子
  function processPostItem(item) {
    const titleElement = item.querySelector(".xst");
    if (!titleElement) return;
    // 如果已经是加粗样式，跳过处理
    if (titleElement.style.fontWeight === "700") return;
    const readNum = extractNumber(item.querySelector(".xw1")?.textContent);
    // 处理阅读权限
    if (readNum > CONFIG.MAX_ACCESS_NUM) {
      titleElement.setAttribute("style", getPostStyle("blocked"));
      return;
    }
    if (readNum > status.accessNum) {
      titleElement.setAttribute("style", getPostStyle("restricted"));
      return;
    }
    // 处理点赞数
    const agreeNum = getMaxAgreeCount(item.querySelectorAll("font"));
    if (agreeNum >= GM_config.get("agreeThreshold")) {
      titleElement.setAttribute(
        "style",
        getPostStyle("highlighted", GM_config.get("agreeColor"))
      );
      return;
    }
    // 处理回复数
    const replyNum = extractNumber(
      item.parentNode.querySelector("td.num a")?.textContent
    );
    if (replyNum >= GM_config.get("replyTHreshold")) {
      titleElement.setAttribute(
        "style",
        getPostStyle("highlighted", GM_config.get("replyColor"))
      );
    }
  }
  function createSettingsIcon() {
    const iconSpan = document.createElement("span");
    iconSpan.id = "settingsIcon";
    iconSpan.title = "打开福利吧小助手设置";
    iconSpan.addEventListener("click", () => {
      GM_config.open();
    });
    return iconSpan;
  }
  function operateCode(inputId, outputId, callback, waitStr = "") {
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
      GM_setClipboard(copyStr, "text");
      copyBtn.title = "复制成功";
      copyBtn.classList.add("a_copy_completed");
      status.timer3 && clearTimeout(status.timer3);
      status.timer3 = setTimeout(() => {
        copyBtn.classList.remove("a_copy_completed");
        copyBtn.title = "将输出的结果复制到剪贴板中";
      }, 2000);
    }
  }
  function createSwitchSpan(keyValue, domArray) {
    const switchSpan = document.createElement("span");
    switchSpan.className = "o";
    const switchImg = document.createElement("img");
    switchImg.id = keyValue + "_user_img";
    switchImg.title = "收起/展开";
    switchImg.alt = "收起/展开";
    if (status[keyValue]) {
      domArray.forEach(function (item) {
        item.classList.add("collapsed_hide");
      });
      switchImg.src = icon.collapsedYes;
    } else {
      switchImg.src = icon.collapsedNo;
    }
    switchImg.addEventListener("click", () => {
      if (status[keyValue]) {
        domArray.forEach((item) => {
          item.classList.remove("collapsed_hide");
        });
        switchImg.src = icon.collapsedNo;
        status[keyValue] = false;
      } else {
        domArray.forEach((item) => {
          item.classList.add("collapsed_hide");
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
    const switchDiv = document.createElement("div");
    switchDiv.className = "signature_switch_div";
    if (switchStatus) {
      switchDiv.title = "收起";
    } else {
      switchDiv.title = "展开";
      switchDiv.classList.add("signature_switch_close");
      signature.classList.add("signature_hide");
    }
    switchDiv.addEventListener(
      "click",
      () => {
        if (switchStatus) {
          switchStatus = false;
          switchDiv.title = "展开";
          switchDiv.classList.add("signature_switch_close");
          signature.classList.add("signature_hide");
        } else {
          switchStatus = true;
          switchDiv.title = "收起";
          switchDiv.classList.remove("signature_switch_close");
          signature.classList.remove("signature_hide");
        }
      },
      false
    );
    return switchDiv;
  }
  function applyContentBlocking() {
    if (!GM_config.get("blockUsersEnable")) return;
    const blockList = GM_config.get("blockUsersList")
      .split(",")
      .map((s) => s.trim());

    GM_addStyle(style.basic);

    // 主题列表处理
    blockList.forEach((userId) => {
      // 通过 uid 匹配 (从 space-uid-XXXXX.html 提取)
      const xpathByUid = `//tbody[contains(@id, 'normalthread')][.//td[contains(@class,'by')]//a[contains(@href, "space-uid-")]]`;
      const postsByUid = document.evaluate(
        xpathByUid,
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null
      );

      // 处理 uid 匹配结果
      Array.from({ length: postsByUid.snapshotLength }, (_, i) =>
        postsByUid.snapshotItem(i)
      ).forEach((post) => {
        const userLinks = post.querySelectorAll('a[href*="space-uid-"]');
        for (const link of userLinks) {
          const href = link.getAttribute("href");
          const uidMatch = href.match(/space-uid-(\d+)\.html/);
          if (uidMatch && uidMatch[1] === userId) {
            post.innerHTML = `
                              <tr>
                                  <td class="icn"><img src="static/image/common/folder_common.gif"></td>
                                  <th class="common my-blocked" colspan="4">
                                      <div class="my-blocked-alert">
                                          ${GM_config.get("blockDisplayText")}
                                          <small>(UID: ${userId})</small>
                                      </div>
                                  </th>
                              </tr>`;
          }
        }
      });
    });

    // 内容页处理
    blockList.forEach((userId) => {
      const selectors = [
        `//table[tbody/tr/td[1]//a[text()="${userId}"]]`,
        `//table[tbody/tr/td[1]/div[1]//font[text()="${userId}"]]`,
      ];

      selectors.forEach((xpath) => {
        const replies = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
          null
        );

        Array.from({ length: replies.snapshotLength }, (_, i) =>
          replies.snapshotItem(i)
        ).forEach((reply) => {
          reply.style.backgroundColor = "#ffe6e6";
          reply.innerHTML = `
                      <td colspan="3" class="my-blocked-alert">
                          <del>${reply.textContent.substr(0, 50)}...</del>
                          <div style="margin-top:5px;font-size:0.9em">
                              <i class="icon icon-lock"></i>
                              已屏蔽用户 ${userId} 的回复
                          </div>
                      </td>`;
        });
      });
    });
  }

  function allInit() {
    const isMobile = isMobilePage();
    const { baseImage } = reg;
    const { checkDate, oldUrl, nightEnable } = status;

    // 注册菜单命令并添加基本样式
    try {
      GM_registerMenuCommand("福利吧小助手 - 设置", () => GM_config.open());
    } catch (e) {
      console.error("福利吧小助手:\n在扩展中注册菜单项出错！");
      console.error(e);
    }

    // 主初始化逻辑
    const executeInitialization = () => {
      GM_addStyle(style.basic);

      // 处理自动签到功能
      if (GM_config.get("autoCheckInEnable")) {
        if (isMobile) {
          document.body.arrive(
            ".bg > a",
            { onceOnly: true, existing: true },
            function (item) {
              if (item.textContent === "签到领奖") {
                const nowDate = getNowDate();
                if (nowDate !== checkDate) {
                  GM_config.setValue("checkEnable", nowDate);
                  setTimeout(() => item.click(), 2000);
                  console.info("福利吧小助手:\n完成自动签到。");
                }
              }
            }
          );
        } else {
          document.arrive(
            "#fx_checkin_topb",
            {
              fireOnAttributesModification: true,
              onceOnly: true,
              existing: true,
            },
            function () {
              if (this.getElementsByTagName("img")[0].alt !== "已签到") {
                const clickAction = () => this.click();
                typeof fx_checkin === "function"
                  ? clickAction()
                  : setTimeout(clickAction, 2000);
                console.info("福利吧小助手:\n自动签到完成。");
              }
            }
          );
        }
      }

      // 处理论坛显示页面
      const isForumDisplayPage =
        oldUrl.indexOf("mod=forumdisplay") !== -1 ||
        /forum-\d+-\d+\.html/i.test(oldUrl);
      if (isForumDisplayPage) {
        if (GM_config.get("highlightEnable")) {
          if (isMobile) {
            document.body.arrive(
              ".threadlist li",
              { fireOnAttributesModification: true, existing: true },
              function () {
                let replyNum = this.querySelector(
                  "span.num.icon.iconfont"
                ).textContent;
                if (replyNum) {
                  replyNum = Number(/\d+/.exec(replyNum)[0]);
                  if (replyNum >= GM_config.get("replyTHreshold")) {
                    this.querySelector("div.thread-item-sub").setAttribute(
                      "style",
                      `font-weight: bold; color: ${GM_config.get(
                        "replyColor"
                      )};`
                    );
                  }
                }
              }
            );
          } else {
            highlightPost();
          }
        }

        if (!isMobile) {
          const isForum37 =
            oldUrl.indexOf("fid=37") !== -1 || /forum-37-/i.test(oldUrl);
          if (isForum37) {
            document.arrive(
              "div.bm_h.cl",
              {
                fireOnAttributesModification: true,
                onceOnly: true,
                existing: true,
              },
              function () {
                if (this.querySelectorAll("span.y").length === 0) {
                  const themeArray = [this.nextElementSibling];
                  this.insertBefore(
                    createSwitchSpan("collapsedGwwzEnable", themeArray),
                    this.childNodes[0]
                  );
                }
              }
            );
          }

          // 访问的链接样式
          if (GM_config.get("visitedEnable")) {
            const visitedStyle = `.tl th a.s.xst:visited, .tl td.fn a:visited { color: ${GM_config.get(
              "visitedColor"
            )} !important; }`;
            GM_addStyle(visitedStyle);
            console.debug("福利吧小助手:\n完成注入自定义己访问帖子的样式。");
          }
        }
      }

      const isThreadViewPage =
        oldUrl.indexOf("mod=viewthread") !== -1 ||
        /thread-\d+-\d+(?:-\d+)?\.html/i.test(oldUrl);
      if (isThreadViewPage) {
        const processThreadPage = () => {
          if (isMobile) {
            const phoneBackgroundColor = window.getComputedStyle(
              document.body
            ).backgroundColor;
            const messageDom = document.querySelectorAll(".message");

            for (let messageEle of messageDom) {
              const textObj = display_Text(
                messageEle,
                GM_config.get("textColor"),
                phoneBackgroundColor
              );
              const textArray = analysisText(messageEle);
              const linkObj = findLink(messageEle);
              const goodBoyObj = new Good_Boy(GM_config);
              goodBoyObj.createGoodBoyElement(
                messageEle,
                linkObj,
                textObj,
                textArray
              );
            }
          } else {
            // 处理图片
            const tFImg = document.querySelectorAll("td.t_f img");
            for (let imgEle of tFImg) {
              let baseSrc = imgEle.getAttribute("file");
              if (baseImage.test(baseSrc)) {
                baseSrc = baseSrc.replace(baseImage, "$1");
                imgEle.setAttribute("file", baseSrc);
                imgEle.src = baseSrc;
              }
            }

            const zoomImg = document.querySelectorAll(".t_f img.zoom");
            for (let zoomEle of zoomImg) {
              zoomEle.removeAttribute("height");
            }

            const htmlBackgroundColor = window.getComputedStyle(
              document.body
            ).backgroundColor;
            const tFDom = document.querySelectorAll("td.t_f");

            for (let domEle of tFDom) {
              const goodBoyObj = new Good_Boy(GM_config);
              const textObj = display_Text(
                domEle,
                GM_config.get("textColor"),
                htmlBackgroundColor
              );
              const textArray = analysisText(domEle);
              const linkObj = findLink(domEle);

              if (isFloat(GM_config.get("displayPosition"))) {
                const favatarBtn = domEle
                  .closest("table.plhin")
                  .querySelector("div.favatar");
                goodBoyObj.createGoodBoyElement(
                  favatarBtn,
                  linkObj,
                  textObj,
                  textArray
                );
              } else {
                const mainBtn =
                  domEle.closest("div.pcb").querySelector("div.t_fsz") ||
                  domEle.closest("div.pcb").querySelector("div.pcbs");
                goodBoyObj.createGoodBoyElement(
                  mainBtn,
                  linkObj,
                  textObj,
                  textArray
                );
              }
            }

            const signA = document.querySelectorAll("div.sign a");
            for (let signEle of signA) {
              if (
                /member\.php\?mod=logging&action=logout/i.test(signEle.href)
              ) {
                signEle.style.display = "none";
              }
            }

            if (GM_config.get("signatureEnable")) {
              const sign = document.querySelectorAll("div.sign");
              const signStatus = GM_config.get("signatureSwitch") == "展开";
              for (let signItem of sign) {
                const signatureContainer = signItem.closest("td.plc, div.pcb");
                if (signatureContainer) {
                  signatureContainer.insertBefore(
                    createSignatureSwitch(signItem, signStatus),
                    signatureContainer.firstChild
                  );
                }
              }
            }
          }
        };

        processThreadPage();
      }

      if (!isMobile) {
        document.arrive(
          "#sslct",
          {
            fireOnAttributesModification: true,
            onceOnly: true,
            existing: true,
          },
          (item) => item.after(createSettingsIcon())
        );

        document.arrive(
          ".site-nav.site-navbar",
          {
            fireOnAttributesModification: true,
            onceOnly: true,
            existing: true,
          },
          (nav) => {
            const searchLi = nav.querySelector(".navto-search");
            searchLi
              ? nav.insertBefore(createSettingsIcon(), searchLi)
              : nav.appendChild(createSettingsIcon());
          }
        );

        if (nightEnable) {
          status.nightStyleDom = GM_addStyle(style.night);
        }

        if (GM_config.get("codeEnable") || GM_config.get("nightBtnEnable")) {
          const expandBox = document.createElement("div");
          expandBox.className =
            GM_config.get("codeEnable") && GM_config.get("nightBtnEnable")
              ? "expand_box_h"
              : "expand_box";
          expandBox.onmouseenter = function () {
            this.classList.add("show_expand_box");
          };
          expandBox.onmouseleave = function () {
            this.classList.remove("show_expand_box");
          };

          if (GM_config.get("codeEnable")) {
            const createCodePanel = () => {
              const fragment = document.createDocumentFragment();
              const codeFrame = document.createElement("div");
              fragment.appendChild(codeFrame);
              // 提取共用的field配置
              const createTextField = (label, section = null) => ({
                label: label,
                section: section,
                type: "textarea",
                labelPos: "above",
                placeholder: "请输入内容",
                default: "",
                save: false,
              });
              const createButtonField = (label, title, clickHandler) => ({
                label: label,
                title: title,
                type: "button",
                click: clickHandler,
              });
              // 创建编解码处理器工厂
              const createCodeHandler =
                (inputId, outputId, processor, processingMsg) => () =>
                  operateCode(inputId, outputId, processor, processingMsg);
              // 提取重复的URL配置
              const links = {
                baijia: `${SITE_URLS.HOME}/anhao.html`,
                coreValues: "https://github.com/sym233/core-values-encoder",
                yflc: "http://keyfc.net/bbs/tools/tudoucode.aspx",
              };
              // 优化与佛论禅的网络请求处理
              const createYflcProcessor = (action) => (str, resultId) => {
                const handleResponse = (res) => {
                  const outputEl = document.getElementById(resultId);
                  if (res.status === 200 && res.readyState === 4) {
                    outputEl.value = res.responseText.replace(
                      /^<BUDDHIST><Message><!\[CDATA\[|\]\]><\/Message><\/BUDDHIST>$/g,
                      ""
                    );
                  } else {
                    outputEl.value = `${action}出现错误!`;
                  }
                };
                GM_xmlhttpRequest({
                  method: "POST",
                  url: "https://keyfc.net/bbs/tools/tudou.aspx",
                  data: `orignalMsg=${
                    action === "编码"
                      ? encodeURIComponent(str)
                      : str.replace(/\s/g, "")
                  }&action=${action}`,
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  onload: handleResponse,
                  onerror: () =>
                    (document.getElementById(resultId).value = "网络连接出错!"),
                });
                return false;
              };
              // 配置面板
              const codePanel = new GM_configStruct({
                id: "myCodePanel",
                title: "编解码工具",
                isTabs: true,
                skin: "tab",
                frame: codeFrame,
                css: style.codePanel,
                fields: {
                  // 百家姓
                  bjxInput: {
                    ...createTextField("输入:", [
                      "百家姓",
                      GM_config.create("a", {
                        textContent: "百家姓编码原示例地址",
                        title: "点击跳转到百家姓编码示例",
                        target: "_blank",
                        href: links.baijia,
                      }),
                    ]),
                  },
                  bjxEncodeBtn: createButtonField(
                    "编码 >>>",
                    '使用"百家姓"进行编码',
                    createCodeHandler(
                      "myCodePanel_field_bjxInput",
                      "myCodePanel_field_bjxOutput",
                      baijiaEncode,
                      "编码中..."
                    )
                  ),
                  bjxDecodeBtn: createButtonField(
                    "解码 >>>",
                    '对"百家姓"的编码进行解码',
                    createCodeHandler(
                      "myCodePanel_field_bjxInput",
                      "myCodePanel_field_bjxOutput",
                      baijiaDecode,
                      "解码中..."
                    )
                  ),
                  bjxOutput: createTextField("输出:"),
                  bjxCopyBtn: createButtonField(
                    "复制结果",
                    "将输出的结果复制到剪贴板中",
                    function () {
                      copyCode(this, "myCodePanel_field_bjxOutput");
                    }
                  ),
                  // 社会主义核心价值观
                  coreValuesInput: {
                    ...createTextField("输入:", [
                      "社会主义核心价值观",
                      GM_config.create("a", {
                        textContent: "社会主义核心价值观编码项目地址",
                        title: "点击跳转到社会主义核心价值观编码项目",
                        target: "_blank",
                        href: links.coreValues,
                      }),
                    ]),
                  },
                  coreValuesEncodeBtn: createButtonField(
                    "编码 >>>",
                    '使用"社会主义核心价值观"进行编码',
                    createCodeHandler(
                      "myCodePanel_field_coreValuesInput",
                      "myCodePanel_field_coreValuesOutput",
                      coreValuesEncode,
                      "编码中..."
                    )
                  ),
                  coreValuesDecodeBtn: createButtonField(
                    "解码 >>>",
                    '对"社会主义核心价值观"的编码进行解码',
                    createCodeHandler(
                      "myCodePanel_field_coreValuesInput",
                      "myCodePanel_field_coreValuesOutput",
                      coreValuesDecode,
                      "解码中..."
                    )
                  ),
                  coreValuesOutput: createTextField("输出:"),
                  coreValuesCopyBtn: createButtonField(
                    "复制结果",
                    "将输出的结果复制到剪贴板中",
                    function () {
                      copyCode(this, "myCodePanel_field_coreValuesOutput");
                    }
                  ),
                  // 与佛论禅
                  yflcInput: {
                    ...createTextField("输入:", [
                      "与佛论禅",
                      GM_config.create("a", {
                        textContent: "与佛论禅编码原工具地址",
                        title: "点击跳转到与佛论禅编码工具",
                        target: "_blank",
                        href: links.yflc,
                      }),
                    ]),
                  },
                  yflcEncodeBtn: createButtonField(
                    "编码 >>>",
                    '使用"与佛论禅"进行编码',
                    createCodeHandler(
                      "myCodePanel_field_yflcInput",
                      "myCodePanel_field_yflcOutput",
                      createYflcProcessor("编码"),
                      "联网进行编码中..."
                    )
                  ),
                  yflcDecodeBtn: createButtonField(
                    "解码 >>>",
                    '对"与佛论禅"的编码进行解码',
                    createCodeHandler(
                      "myCodePanel_field_yflcInput",
                      "myCodePanel_field_yflcOutput",
                      createYflcProcessor("解码"),
                      "联网进行解码中..."
                    )
                  ),
                  yflcOutput: createTextField("输出:"),
                  yflcCopyBtn: createButtonField(
                    "复制结果",
                    "将输出的结果复制到剪贴板中",
                    function () {
                      copyCode(this, "myCodePanel_field_yflcOutput");
                    }
                  ),
                  // BASE64
                  base64Input: {
                    ...createTextField("输入:", [
                      "BASE64",
                      GM_config.create("a", {
                        textContent: "crypto-js 项目地址",
                        title: "点击跳转到 crypto-js 项目",
                        target: "_blank",
                        href: "https://github.com/brix/crypto-js",
                      }),
                    ]),
                  },
                  base64EncodeBtn: createButtonField(
                    "编码 >>>",
                    '使用"BASE64"进行编码',
                    createCodeHandler(
                      "myCodePanel_field_base64Input",
                      "myCodePanel_field_base64Output",
                      (str) => {
                        if (!window.CryptoJS) return "crypto-js 库文件不存在！";
                        const words = CryptoJS.enc.Utf8.parse(str);
                        return CryptoJS.enc.Base64.stringify(words);
                      },
                      "编码中..."
                    )
                  ),
                  base64DecodeBtn: createButtonField(
                    "解码 >>>",
                    '对"BASE64"的编码进行解码',
                    createCodeHandler(
                      "myCodePanel_field_base64Input",
                      "myCodePanel_field_base64Output",
                      (str) => {
                        if (!window.CryptoJS) return "crypto-js 库文件不存在！";
                        const words = CryptoJS.enc.Base64.parse(str);
                        return words.toString(CryptoJS.enc.Utf8);
                      },
                      "解码中..."
                    )
                  ),
                  base64Output: createTextField("输出:"),
                  base64CopyBtn: createButtonField(
                    "复制结果",
                    "将输出的结果复制到剪贴板中",
                    function () {
                      copyCode(this, "myCodePanel_field_base64Output");
                    }
                  ),
                },
                events: {
                  open: function (doc) {
                    const config = this;
                    const closeBtn = doc.getElementById(
                      config.id + "_closeBtn"
                    );
                    const resetLink = doc.getElementById(
                      config.id + "_resetLink"
                    );
                    if (closeBtn) closeBtn.title = "关闭面板";
                    if (resetLink) {
                      resetLink.textContent = "清空内容";
                      resetLink.title = "清空所有内容";
                    }
                  },
                },
              });
              // 创建打开面板的按钮
              const codeSpan = document.createElement("span");
              codeSpan.id = "myCodeSpan";
              codeSpan.title = "打开编解码工具";
              codeSpan.addEventListener("click", () => codePanel.open(), {
                passive: true,
              });
              // 一次性添加所有DOM元素
              document.body.appendChild(fragment);
              expandBox.appendChild(codeSpan);
              return codePanel;
            };

            createCodePanel();
          }

          // 如果启用，则初始化夜间模式按钮
          if (GM_config.get("nightBtnEnable")) {
            const nightBtnSpan = document.createElement("span");
            nightBtnSpan.id = GM_config.get("codeEnable")
              ? "myNightSpan_2"
              : "myNightSpan";

            // 根据当前夜间模式设置初始状态
            nightBtnSpan.style.backgroundImage = nightEnable
              ? icon.modeNight
              : icon.modeDay;
            nightBtnSpan.title = nightEnable
              ? "切换到日间模式"
              : "切换到夜间模式";

            // 为夜间模式切换添加点击处理程序
            nightBtnSpan.addEventListener(
              "click",
              () => {
                if (status.nightEnable) {
                  status.nightStyleDom &&
                    status.nightStyleDom.parentNode.removeChild(
                      status.nightStyleDom
                    );
                  status.nightEnable = false;
                  GM_config.setValue("nightEnable", status.nightEnable);
                  nightBtnSpan.title = "切换到夜间模式";
                  nightBtnSpan.style.backgroundImage = icon.modeDay;
                } else {
                  status.nightStyleDom = GM_addStyle(style.night);
                  status.nightEnable = true;
                  GM_config.setValue("nightEnable", status.nightEnable);
                  nightBtnSpan.title = "切换到日间模式";
                  nightBtnSpan.style.backgroundImage = icon.modeNight;
                }
              },
              false
            );

            expandBox.appendChild(nightBtnSpan);
          }

          document.body.appendChild(expandBox);
        }

        if (document.head && !document.head.querySelector("title")) {
          console.warn("福利吧小助手:\n网页加载失败。即将自动刷新重载。");
          status.timer4 && clearTimeout(status.timer4);
          status.timer4 = setTimeout(() => location.reload(), 2000);
        }
      }

      const isFulibaDomain =
        location.hostname.includes("fulibus.net") ||
        location.hostname.includes("fuliba") ||
        location.hostname.includes("f.uliba.net");

      if (isFulibaDomain) {
        removeElements();
        adjustStyles();
        simplifyNavigation();
        removePromotions();

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", processText);
        } else {
          processText();
        }
      }

      // 在论坛页面移除GzList广告位
      if (!isFulibaDomain) {
        removeGzListAds();
      }

      // 头像勋章移除功能初始化
      if (GM_config.get("removeAvatarMedalEnable")) {
        handleAvatarAndMedal();
      }

      // 头像/图片模糊功能初始化
      if (GM_config.get("blurAvatarEnable")) {
        handleAvatarBlur();
      }

      // 屏蔽功能初始化
      if (GM_config.get("blockUsersEnable")) {
        // 初始执行
        applyContentBlocking();

        // 动态内容监听
        new MutationObserver((mutations) => {
          mutations.forEach(() => applyContentBlocking());
        }).observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    };

    // 动态内容检测
    if (document.body) {
      executeInitialization();
    } else {
      new MutationObserver((mutations, observer) => {
        if (document.body) {
          observer.disconnect();
          executeInitialization();
        }
      }).observe(document.documentElement, { childList: true });
    }
  }

  function handleAvatarAndMedal() {
    if (!GM_config.get("removeAvatarMedalEnable")) return;
    // 添加CSS隐藏样式
    const styleId = "avatarMedalHideStyle";
    if (!document.getElementById(styleId)) {
      GM_addStyle(`
        .avatar, .md_ctrl {
            display: none !important;
        }
    `);
    }
    // 确保在body存在后初始化Observer
    function initObserver() {
      if (!document.body) {
        setTimeout(initObserver, 100);
        return;
      }
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // 处理新增节点
              const elements =
                node.querySelectorAll?.(".avatar, .md_ctrl") || [];
              elements.forEach((el) => (el.style.display = "none"));

              // 处理节点自身
              if (node.matches(".avatar, .md_ctrl")) {
                node.style.display = "none";
              }
            }
          });
        });
      });
      // 使用document.documentElement作为备选
      const observeTarget = document.body || document.documentElement;
      observer.observe(observeTarget, {
        childList: true,
        subtree: true,
      });
    }
    // 延迟初始化确保body存在
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initObserver);
    } else {
      initObserver();
    }
  }

  function handleAvatarBlur() {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", handleAvatarBlur);
      return;
    }

    const handleHover = (e) => {
      const img = e.target.closest(IMAGE_SELECTOR);
      if (!img || !img.dataset.blurEnabled) return;
      if (e.type === "mouseenter") {
        img.style.filter = "none";
      } else if (e.type === "mouseleave") {
        img.style.filter = "blur(10px)";
      }
    };
    // 先移除旧的事件监听避免重复绑定
    document.body.removeEventListener("mouseenter", handleHover, true);
    document.body.removeEventListener("mouseleave", handleHover, true);
    // 使用捕获阶段确保动态加载的元素也能触发
    document.body.addEventListener("mouseenter", handleHover, true);
    document.body.addEventListener("mouseleave", handleHover, true);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 处理新增节点及其子节点
            const images = node.matches(IMAGE_SELECTOR)
              ? [node]
              : node.querySelectorAll(IMAGE_SELECTOR);
            images.forEach((img) => processAvatar(img));
          }
        });
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    // 初始化现有图片
    document.querySelectorAll(IMAGE_SELECTOR).forEach(processAvatar);
  }

  function processAvatar(img) {
    if (!img.dataset.blurEnabled) {
      img.style.filter = "blur(10px)";
      img.style.transition = "filter 0.3s ease-in-out";
      img.dataset.blurEnabled = "true";

      // 确保鼠标移出时恢复模糊
      img.addEventListener("mouseleave", () => {
        if (img.dataset.blurEnabled === "true") {
          img.style.filter = "blur(10px)";
        }
      });
    }
  }

  // 移除多余元素
  function removeElements() {
    if (!GM_config.get("enableAdPurge")) return;
    // 移除预定义列表中的元素
    ELEMENTS_TO_REMOVE.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    // 更精准地定位并移除.content中的广告链接
    const contentDiv = document.querySelector(".content");
    if (contentDiv) {
      // 查找所有直接子元素中的a标签
      const adLinks = contentDiv.querySelectorAll(
        ":scope > a, :scope > br + a"
      );
      adLinks.forEach((adLink) => {
        // 检查这个链接是否为广告链接
        if (isAdvertisementLink(adLink)) {
          contentDiv.removeChild(adLink);
        }
      });
    }
  }

  // 判断链接是否为广告
  function isAdvertisementLink(link) {
    // 检查是否包含图片
    const hasImage = link.querySelector("img") !== null;

    // 检查链接是否在文章内容前面
    const isBeforeContent =
      link.nextElementSibling &&
      (link.nextElementSibling.classList.contains("title") ||
        link.nextElementSibling.classList.contains("excerpt"));

    // 检查链接URL是否包含常见广告域名关键词
    const href = link.href.toLowerCase();
    const isAdDomain =
      href.includes("ad") ||
      href.includes("click") ||
      href.includes("haha") ||
      href.includes("cq.com");

    // 检查链接是否只包含一个图片元素且没有其他内容
    const hasOnlyImage =
      link.childNodes.length === 1 && link.querySelector("img");

    return hasImage && (isBeforeContent || isAdDomain || hasOnlyImage);
  }
  // 样式调整函数
  function adjustStyles() {
    const header = document.querySelector(".header");
    header && (header.style.padding = "20px 0");

    const containers = document.querySelectorAll(".container, .main-wrapper");
    const contents = document.querySelectorAll(".content");
    if (!containers.length || !contents.length) return;

    if (GM_config.get("customStyleEnable")) {
      const widthInput = parseInt(GM_config.get("contentWidth"));
      const validWidth = isNaN(widthInput)
        ? 80
        : Math.min(Math.max(widthInput, 30), 100);

      containers.forEach((container) => {
        container.style.cssText = `
                    max-width: none !important; 
                    min-width: 0 !important;
                    width: 100% !important;
                    margin-left: auto !important;
                    margin-right: auto !important;
                `;
      });

      contents.forEach((content) => {
        content.style.cssText = `
                    width: ${validWidth}% !important;
                    margin-left: auto !important;
                    margin-right: auto !important;
                    max-width: none !important;
                `;
      });
    } else {
      // 恢复默认状态
      containers.forEach((container) => {
        container.style.cssText = ""; // 清空内联样式
        container.style.removeProperty("max-width");
        container.style.removeProperty("width");
      });
      contents.forEach((content) => {
        content.style.cssText = ""; // 清空内联样式
        if (GM_config.get("enableAdPurge")) {
          content.style.marginLeft = "190px";
          content.style.marginRight = "190px";
        }
      });
    }
  }
  // 优化导航栏
  function simplifyNavigation() {
    if (!GM_config.get("enableAdPurge")) return;
    const navSelectors = ["ul.site-nav.site-navbar", "ul.m-navbar"];

    navSelectors.forEach((selector) => {
      const nav = document.querySelector(selector);
      if (!nav) return;

      function shouldKeepSpecific(element) {
        const text = element.textContent.trim();
        return KEEP_KEYWORDS.some((keyword) => text.includes(keyword));
      }

      function shouldBlock(element) {
        const text = element.textContent.toLowerCase();
        const link = element.querySelector("a")?.href.toLowerCase() || "";
        return BLOCK_KEYWORDS.some(
          (keyword) =>
            text.includes(keyword.toLowerCase()) ||
            link.includes(keyword.toLowerCase())
        );
      }

      function shouldKeep(element) {
        const text = element.textContent;
        const isSearch = element.classList.contains("navto-search");
        const isSpecificItem = shouldKeepSpecific(element);
        return (
          isSpecificItem ||
          isSearch ||
          ((text.includes("福") || text.includes("关于")) &&
            !shouldBlock(element))
        );
      }

      function processNavItems(parent) {
        Array.from(parent.children).forEach((item) => {
          if (item.tagName.toLowerCase() === "li") {
            const subMenu = item.querySelector(".sub-menu");
            if (subMenu) {
              processNavItems(subMenu);
            }
            // 如果子菜单为空且父项不是特定保留项，则删除父项
            if (
              subMenu &&
              subMenu.children.length === 0 &&
              !shouldKeepSpecific(item)
            ) {
              item.remove();
            }
            // 如果不应保留，则删除
            else if (!shouldKeep(item)) {
              item.remove();
            }
          }
        });
      }

      processNavItems(nav);
    });
  }
  // 移除推广内容
  function removePromotions() {
    if (!GM_config.get("enableAdPurge")) return;
    const content = document.querySelector(".content");
    if (!content) return;
    Array.from(content.querySelectorAll("article")).forEach((article) => {
      const likeCount = parseInt(
        article.querySelector(".post-like span")?.textContent
      );
      if (likeCount > 100) article.remove();
    });
  }

  // 移除GzList广告位
  function removeGzListAds() {
    if (!GM_config.get("enableAdPurge")) return;

    // 查找所有GzList广告位容器
    const gzListElements = document.querySelectorAll(".GzList");

    gzListElements.forEach((gzList) => {
      // 移除GzList及其父容器
      const parentContainer = gzList.closest("div.wp.cl");
      if (parentContainer && parentContainer.parentNode) {
        parentContainer.parentNode.removeChild(parentContainer);
      } else if (gzList.parentNode) {
        // 如果没有找到父容器，直接移除GzList元素
        gzList.parentNode.removeChild(gzList);
      }
    });
  }
  // 处理正文内容
  function processText() {
    // 获取网页背景颜色
    const htmlBackgroundColor = window.getComputedStyle(
      document.body
    ).backgroundColor;

    // 处理段落
    const paragraphs = document.querySelectorAll("p");
    paragraphs.forEach((p) => {
      const text = p.innerText;
      if (text) {
        // 处理百家姓编码
        const surnameMatches = findSurnameEncoding(text);
        if (surnameMatches.length > 0) {
          let newText = text;
          surnameMatches.forEach((match) => {
            const decoded = processSurnameEncoding(match);
            if (decoded) {
              const isValid = isValidDecodedLink(decoded);
              const container = document.createElement("div");
              // 根据有效性添加不同内容
              if (isValid) {
                // 有效链接：显示可点击链接和复制按钮
                const link = document.createElement("a");
                link.href = decoded;
                link.textContent = decoded;
                link.target = "_blank";
                link.className = "my_good_boy_a";
                container.appendChild(link);
                if (GM_config.get("copyEnable")) {
                  const copyBtn = document.createElement("a");
                  copyBtn.className = "my_good_boy_a_copy";
                  copyBtn.title = "复制链接";
                  copyBtn.href = "javascript:;";
                  copyBtn.textContent = "复制";
                  copyBtn.addEventListener("click", function () {
                    GM_setClipboard(decoded, "text");
                    this.classList.add("a_copy_completed");
                    this.title = "复制成功";
                    status.timer1 && clearTimeout(status.timer1);
                    status.timer1 = setTimeout(() => {
                      this.classList.remove("a_copy_completed");
                      this.title = "复制链接";
                    }, 2000);
                  });
                  container.appendChild(copyBtn);
                }
              } else {
                const warning = document.createElement("span");
                warning.textContent =
                  "(未通过磁力验证，原文提供编码可能存在错误)";
                warning.style.color = "red";
                const content = document.createElement("code");
                content.textContent = decoded;
                container.appendChild(warning);
                container.appendChild(content);
              }
              newText = newText.replace(match, "");
              p.innerHTML = newText;
              p.appendChild(container);
            }
          });
        }
        // 处理YouTube链接
        if (text.includes("watch?v=")) {
          const videoId = text.split("?v=")[1]?.split(/[\s&]/)[0];
          if (videoId) {
            const link = document.createElement("a");
            link.href = `https://www.youtube.com/watch?v=${videoId}`;
            link.textContent = "油管链接";
            link.target = "_blank";
            link.className = "my_good_boy_a";
            p.appendChild(link);
          }
        }
      }

      // 处理好孩子看不见
      display_Text(p, GM_config.get("textColor"), htmlBackgroundColor);
    });

    // 处理好孩子看不见
    const blockquotes = document.querySelectorAll("blockquote");
    blockquotes.forEach((blockquote) => {
      display_Text(blockquote, GM_config.get("textColor"), htmlBackgroundColor);
    });

    const contentDivs = document.querySelectorAll("div.t_f, div.pcb");
    contentDivs.forEach((div) => {
      display_Text(div, GM_config.get("textColor"), htmlBackgroundColor);
    });
  }

  // 查找百家姓编码
  function findSurnameEncoding(text) {
    // 使用原有的 reg.baijia 正则表达式
    const matches = reg.baijia.exec(text);
    return matches ? [matches[1]] : [];
  }
  // 处理百家姓编码
  function processSurnameEncoding(encodedText) {
    try {
      return baijiaDecode(encodedText);
    } catch (e) {
      console.warn("福利吧小助手:\n百家姓解码出错:", e);
      return null;
    }
  }
  // 验证解码结果
  function isValidDecodedLink(decoded) {
    // 验证是否是磁力链接
    if (decoded.startsWith("magnet:?xt=urn:btih:")) {
      const hash = decoded.replace("magnet:?xt=urn:btih:", "").split("&")[0]; // 获取hash并忽略其他参数
      return /^[a-fA-F0-9]{40}$/i.test(hash); // 验证是否是40位的十六进制字符
    }
    // 验证是否是http/https链接
    if (decoded.startsWith("http://") || decoded.startsWith("https://")) {
      try {
        new URL(decoded);
        return true;
      } catch (e) {
        return false;
      }
    }
    // 验证是否是其他支持的协议链接
    const supportedProtocols = [
      "ed2k://",
      "thunder://",
      "flashget://",
      "qqdl://",
      "xfplay://",
      "ftp://",
    ];
    return supportedProtocols.some((protocol) => decoded.startsWith(protocol));
  }
  GM_config.init({
    id: "myGoodBoyConfig",
    title: GM_config.create("a", {
      textContent: "福利吧小助手-设置 ver." + GM_info.script.version,
      title: "点击跳转到脚本页面" + getUpdateTime(GM_info.script.lastModified),
      target: "_blank",
      href: "https://sleazyfork.org/zh-CN/scripts/381494",
    }),
    skin: "tab",
    css: style.settings,
    frameStyle: {
      width: "400px",
      height: "720px",
    },
    fields: {
      autoCheckInEnable: {
        label: "自动签到",
        title: "进入论坛后自动点击签到按钮",
        labelPos: "right",
        type: "checkbox",
        default: true,
        section: GM_config.create("a", {
          textContent: "作者: aoguai",
          title: "点击反馈问题",
          target: "_blank",
          href:
            location.origin +
            "/home.php?mod=spacecp&ac=pm&op=showmsg&touid=90713",
        }),
      },
      enableAdPurge: {
        label: "净化页面广告",
        title: "移除页面广告和推广内容",
        labelPos: "right",
        type: "checkbox",
        default: true,
      },
      customStyleEnable: {
        label: "启用调整页面样式",
        title: "启用后应用脚本的页面样式调整，关闭则保留原站样式",
        labelPos: "right",
        type: "checkbox",
        default: true,
      },
      contentWidth: {
        label: "内容区域宽度(%)",
        title: "输入30-100之间的数字控制内容区域宽度（默认80%）",
        type: "text",
        default: "80",
        validate: function (value) {
          const num = Number(value);
          return !isNaN(num) && num >= 30 && num <= 100;
        },
        dependent: ["customStyleEnable"],
      },
      nightBtnEnable: {
        label: "显示切换夜间模式的悬浮按钮",
        title: "将鼠标移至网页右下角弹出 (仅支持电脑端页面)",
        labelPos: "right",
        type: "checkbox",
        default: true,
      },
      codeEnable: {
        label: "显示编解码工具的悬浮按钮",
        title: "将鼠标移至网页右下角弹出 (仅支持电脑端页面)",
        labelPos: "right",
        type: "checkbox",
        default: false,
      },
      copyEnable: {
        label: "显示复制按钮",
        title: "在所提取链接后显示复制按钮",
        labelPos: "right",
        type: "checkbox",
        default: true,
      },
      extractEnable: {
        label: "识别文字中的网址并转换为超链接",
        title: "将帖子中网址文字转换为可点击访问的超链接",
        labelPos: "right",
        type: "checkbox",
        default: true,
      },
      displayPosition: {
        label: "自定义提取链接的显示位置: ",
        title: "指定所提取链接的显示位置 (仅支持电脑端页面)",
        labelPos: "left",
        type: "select",
        options: ["底部", "右侧"],
        default: "底部",
      },
      maxLinkNumber: {
        label: "所提取链接的最大显示数量: ",
        title: "每个楼层所提取链接的默认最大显示数量值 (-1 表示无限制)",
        labelPos: "left",
        type: "int",
        size: 18,
        default: 5,
      },
      linkColor: {
        label: "自定义提取链接的文字颜色: ",
        title: "设定所提取链接显示的文字颜色",
        labelPos: "left",
        type: "text",
        size: 18,
        default: "#369",
      },
      textColor: {
        label: "自定义隐藏文字的高亮颜色: ",
        title: "设定将隐藏文字高亮的颜色",
        labelPos: "left",
        type: "text",
        size: 18,
        default: "#FF33CC",
      },
      signatureEnable: {
        label: "显示签名档折叠图标",
        title: "在签名档的左上方显示一个折叠图标",
        labelPos: "right",
        type: "checkbox",
        default: true,
        line: "start",
      },
      signatureSwitch: {
        label: "签名档的默认折叠状态: ",
        title: "自定义签名档默认的折叠状态",
        labelPos: "left",
        type: "select",
        options: ["展开", "收起"],
        default: "展开",
        line: "end",
      },
      highlightEnable: {
        label: "启用热帖高亮功能",
        title: "在帖子列表页面开启热帖高亮 (移动端页面只支持回复高亮)",
        labelPos: "right",
        type: "checkbox",
        default: true,
        line: "start",
      },
      agreeThreshold: {
        label: "按分享值高亮的阈值: ",
        title: "分享值>=阈值时高亮",
        labelPos: "left",
        type: "unsigned int",
        size: 18,
        default: 20,
      },
      agreeColor: {
        label: "按分享值高亮的颜色: ",
        title: "优化级高",
        labelPos: "left",
        type: "text",
        size: 18,
        default: "#EE1B2E",
      },
      replyTHreshold: {
        label: "按回复数高亮的阈值: ",
        title: "回复数>=阈值时高亮",
        labelPos: "left",
        type: "unsigned int",
        size: 18,
        default: 50,
      },
      replyColor: {
        label: "按回复数高亮的颜色: ",
        title: "优化级低",
        labelPos: "left",
        type: "text",
        size: 18,
        default: "#2B65B7",
        line: "end",
      },
      visitedEnable: {
        label: "标记已打开过的帖子",
        title: "允许将已打开过的帖子设置成自定义的颜色",
        labelPos: "right",
        type: "checkbox",
        default: false,
        line: "start",
      },
      visitedColor: {
        label: "自定义已打开过的帖子的颜色",
        title: "优先级最高",
        labelPos: "left",
        type: "text",
        size: 18,
        default: "#666",
        line: "end",
      },
      blurAvatarEnable: {
        label: "启用头像/图片模糊效果",
        title: "启用后用户头像与帖子中的图片会显示为模糊，鼠标悬停时清晰",
        labelPos: "right",
        type: "checkbox",
        default: false,
      },
      removeAvatarMedalEnable: {
        label: "移除用户头像和勋章",
        title: "启用后会隐藏所有用户头像和获得的勋章",
        labelPos: "right",
        type: "checkbox",
        default: false,
      },
      blockUsersEnable: {
        label: "启用帖子屏蔽功能",
        title: "启用后根据屏蔽ID列表过滤主题帖",
        labelPos: "right",
        type: "checkbox",
        default: false,
      },
      blockUsersList: {
        label: "屏蔽用户ID列表",
        title: "输入要屏蔽的用户ID，多个用英文逗号分隔",
        type: "textarea",
        default: "",
        placeholder: "例如: user1,user2,user3",
      },
      blockDisplayText: {
        label: "屏蔽提示文字",
        title: "被屏蔽帖子显示的文字内容",
        type: "text",
        default: "该帖子已根据您的屏蔽设置隐藏",
      },
    },
    events: {
      init: async () => {
        console.debug("福利吧小助手:\n配置信息读取完成。");
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", allInit);
        } else {
          allInit();
        }
      },
      save: () => {
        if (GM_config.get("enableAdPurge")) {
          removeElements();
          simplifyNavigation();
          removePromotions();
          removeGzListAds();
        } else {
          location.reload();
        }

        // 强制重新应用样式
        if (document.getElementById("customStyle")) {
          document.getElementById("customStyle").remove();
        }

        // 处理头像勋章显示状态
        const styleNode = document.getElementById("avatarMedalHideStyle");
        if (GM_config.get("removeAvatarMedalEnable")) {
          if (!styleNode) handleAvatarAndMedal();
        } else {
          styleNode?.remove();
        }

        // 清理旧的模糊状态
        document.querySelectorAll(IMAGE_SELECTOR).forEach((img) => {
          img.style.filter = "";
          img.style.transition = "";
          delete img.dataset.blurEnabled;
        });

        // 重新初始化功能
        if (GM_config.get("blurAvatarEnable")) {
          handleAvatarBlur();
        } else {
          document.querySelectorAll('img[src*="avatar"]').forEach((img) => {
            img.style.filter = "";
            img.style.transition = "";
          });
        }
        location.reload();
      },
    },
  });
})();
