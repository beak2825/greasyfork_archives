// ==UserScript==
// @name            sukebei-link-to-JaVR
// @namespace       https://sukebei.luvium.xyz/
// @icon            https://sukebei.nyaa.si/static/favicon.png
// @version         2.6
// @description     helper for sukebei.nyaa.si
// @author          purezhi
// @license         MIT
// @match           https://sukebei.nyaa.si/*
// @match           https://jvrlibrary.com/*
// @match           https://www.jvrlibrary.com/*
// @require         https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require         https://cdn.jsdelivr.net/npm/dayjs@1.11.12/dayjs.min.js
// @require         https://cdn.jsdelivr.net/npm/notyf@3.9.0/notyf.min.js
// @require         https://cdn.jsdelivr.net/npm/hystmodal@1.0.1/dist/hystmodal.min.js
// @require         https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @resource        CSS_notyf https://cdn.jsdelivr.net/npm/notyf@3.9.0/notyf.min.css
// @resource        CSS_hystModal https://cdn.jsdelivr.net/npm/hystmodal@1.0.1/dist/hystmodal.min.css
// @resource        CSS_pureCss https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.min.css
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      safari
// @downloadURL https://update.greasyfork.org/scripts/516655/sukebei-link-to-JaVR.user.js
// @updateURL https://update.greasyfork.org/scripts/516655/sukebei-link-to-JaVR.meta.js
// ==/UserScript==

/*
sukebei helper
*/

// 提示框实例
let notyf = null;
// 模态窗口实例
let gmHystModal = null;

(async function () {
  "use strict";

  // 初始化助手
  initHelper();

  // [Sukebei] home page/torrent list page
  const $torrentList = $(".torrent-list");
  if ($torrentList && $torrentList.find("tbody>tr")) {
    const $tbodyRows = $torrentList.find("tbody>tr");

    // 插入标题
    $('<th class="hdr-jvr text-center" style="width:90px;">JAV/JVR</th>').insertBefore(
      $torrentList.find("th.hdr-link"),
    );

    // 匹配番号
    for (let i = 0; i < $tbodyRows.length; i++) {
      const $row = $($tbodyRows[i]);
      const $nameCol = $row.find("td[colspan=2]");
      if (!$nameCol) {
        continue;
      }

      // 解析番号
      const banGaoInfo = parseTitle($nameCol.find("a").text());
      // 插入 JAV/JVR 链接
      let searchLnk = "";
      if (banGaoInfo.jvrBanGao) {
        searchLnk = `&nbsp;<a href="https://www.avbase.net/works?q=${banGaoInfo.jvrBanGao}" target="_blank">${banGaoInfo.search}</a>`;
      }
      $(
        `<td class="text-center"><a href="${banGaoInfo.jvrUrl}" target="_blank">${banGaoInfo.icon}</a>${searchLnk}</td>`,
      ).insertAfter($nameCol);
    }
  }

  // [Sukebei] show page
  const $detailHeading = $("script + .panel.panel-default .panel-heading .panel-title");
  if ($detailHeading && $detailHeading.text()) {
    // 解析番号
    const banGaoInfo = parseTitle($detailHeading.text().trim());
    // 插入 JAV/JVR 链接
    let searchLnk = "";
    if (banGaoInfo.jvrBanGao) {
      searchLnk = `&nbsp;<a href="https://www.avbase.net/works?q=${banGaoInfo.jvrBanGao}" target="_blank">${banGaoInfo.search}</a>`;
    }
    $detailHeading.append(`
      <span>&nbsp;↔&nbsp;<a style="color: #337ab7;" href="${banGaoInfo.jvrUrl}" target="_blank">${banGaoInfo.icon}</a>${searchLnk}</span>
    `);
  }

  // JVR
  const $jvr = $(".single-view>.content>.section>.line:nth-child(1)>.value");
  if ($jvr && $jvr.text()) {
    // 解析番号
    const banGaoInfo = parseTitle($jvr.text().trim());
    console.log(`bangao ${banGaoInfo.banGao} found.`);
    const $jvrZhLnk = $(
      `<a href="https://www.jvrlibrary.com/zh/jvr?id=${banGaoInfo.jvrBanGao}" style="margin-left: 5px;" target="_blank">JvrLibrary ZH ➡️</a>`,
    );
    $jvr.append($jvrZhLnk);
    const $skbLnk = $(
      `<a href="https://sukebei.nyaa.si/?q=${banGaoInfo.skbBanGao}" style="margin-left: 5px;" target="_blank">Sukebei ➡️</a>`,
    );
    $jvr.append($skbLnk);
    const $btdLnk = $(
      `<a href="https://btdig.com/search?order=0&q=${banGaoInfo.skbBanGao}" style="margin-left: 5px;" target="_blank">BTDigg ➡️</a>`,
    );
    $jvr.append($btdLnk);
    const $bt4gLnk = $(
      `<a href="https://bt4gprx.com/search?q=${banGaoInfo.skbBanGao}" style="margin-left: 5px;" target="_blank">BT4G ➡️</a>`,
    );
    $jvr.append($bt4gLnk);
    // 永久地址： https://btsow..com/
    const $btsowLnk = $(
      `<a href="https://btsow.pics/search/${banGaoInfo.skbBanGao}" style="margin-left: 5px;" target="_blank">btsow ➡️</a>`,
    );
    $jvr.append($btsowLnk);
    // 永久地址： https://skrcili.com, https://skrcili.net
    const $skrLnk = $(
      `<a href="https://skrbtgb.top/search?sos=relevance&sofs=all&sot=all&soft=all&som=auto&p=1&keyword=${banGaoInfo.skbBanGao}" style="margin-left: 5px;" target="_blank">SkrBT ➡️</a>`
    );
    $jvr.append($skrLnk);
  }
})();

// 匹配番号
function parseTitle(name) {
  // odnoklassniki > Odnoklassniki 社交, 小人
  // pied-piper-alt > 花衣风笛手
  // grav > 宇航员
  // tripadvisor > 猫途鹰 Tripadvisor
  // digg > Digg
  // vimeo

  let banGao, jvrBanGao, skbBanGao;
  let jvrUrl, skbUrl;
  let icon = '<i class="fa fa-fw fa-google"></i>';

  // 匹配番号
  const regex = /(([\w\d]+)(?:-([\w\d]+))+)/im;
  // VR匹配配置
  // - keywords: 匹配关键词
  // - jvr0: JVR 站点中番号是否以 0 开始
  // - skb0: Sukebei 站点中番号是否以 0 开始
  const vrConfArr = [
    { keywords: "VR", jvr0: null, skb0: null },
    { keywords: "VRPRD", jvr0: false, skb0: true },
    { keywords: "RVR", jvr0: false, skb0: true },
    { keywords: "KOMZ", jvr0: false, skb0: true },
    { keywords: "KIWVRB", jvr0: false, skb0: true },
    { keywords: "CAFUKU", jvr0: false, skb0: true },
    { keywords: "AQUMA", jvr0: false, skb0: true },
    { keywords: "AQUCO", jvr0: true, skb0: true },
    { keywords: "AQUBE", jvr0: true, skb0: true },
    { keywords: "GGPVR", jvr0: false, skb0: true },
  ];

  let m;
  if ((m = regex.exec(name)) != null && m.length > 0) {
    jvrBanGao = skbBanGao = banGao = m[0];
    if (banGao) {
      // VR 番号匹配正则
      const vrRegex = new RegExp(vrConfArr.map((c) => c.keywords).join("|"), "i");
      if (vrRegex.test(banGao)) {
        for (const cnf of vrConfArr.filter((c) => c.jvr0 != null || c.skb0 != null)) {
          const modRegex = new RegExp(`^(${cnf.keywords}-)(0*)([1-9]\\d*)$`, "i");
          if ((vm = modRegex.exec(banGao)) !== null) {
            if (cnf.jvr0 != null) {
              jvrBanGao = vm[1] + (cnf.jvr0 ? "0" : "") + vm[3];
            }
            if (cnf.skb0 != null) {
              skbBanGao = vm[1] + (cnf.skb0 ? "0" : "") + vm[3];
            }
            break;
          }
        }

        jvrUrl = `https://www.jvrlibrary.com/zh/jvr?id=${jvrBanGao}`;
        icon = '<i class="fa fa-fw fa-odnoklassniki"></i>';
      } else if (banGao.includes("FC2") || banGao.includes("fc2")) {
        jvrUrl = `https://www.google.com/search?q=${banGao}`;
      } else {
        jvrUrl = `https://www.javlibrary.com/cn/vl_searchbyid.php?keyword=${banGao}`;
        icon = '<i class="fa fa-fw fa-vimeo"></i>';
      }
      // console.log(url);
    }
  }

  // 未匹配到番号, 改用 google 搜索
  if (jvrUrl == null) {
    jvrUrl = `https://www.google.com/search?q=${name}`;
  }
  if (skbUrl == null) {
    skbUrl = `https://sukebei.nyaa.si/?q=${skbBanGao}`;
  }

  let search = '<i class="fa fa-fw fa-digg"></i>';

  return { banGao, jvrBanGao, skbBanGao, jvrUrl, skbUrl, icon, search };
}

// 初始化助手按钮
function initHelperBar() {
  // 统计按钮
  let statBtn = `<p><button table-summary class="gm-tool-btn gm-tool-btn-s gm-tool-btn-styl-7">🗓 查看统计</button></p>`;
  if (enableStatPages.indexOf(page) < 0) {
    statBtn = "";
  }

  // 查询表单
  const $form = $(".jeecg-basic-table form > .ant-row:last-child .ant-col:last-child");
  $("body").append(`
    <div class="gm-tool-toolbar">
      ${statBtn}
      <p><button table-config class="gm-tool-btn gm-tool-btn-s gm-tool-btn-styl-7">🗒 表格配置</button></p>
    </div>
    <div class="hystmodal" id="gm-hyst-modal-config" aria-hidden="true">
      <div class="hystmodal__wrap">
        <div class="hystmodal__window" role="dialog" aria-modal="true">
          <button data-hystclose class="hystmodal__close">关闭</button>
          <div class="hystmodal-content-container">
          </div>
        </div>
      </div>
    </div>
    <div class="hystmodal" id="gm-hyst-modal-stat" aria-hidden="true">
      <div class="hystmodal__wrap">
        <div class="hystmodal__window" role="dialog" aria-modal="true">
          <button data-hystclose class="hystmodal__close">关闭</button>
          <div class="hystmodal-content-container">
          </div>
          <!-- /.hystmodal-content-container -->
        </div>
      </div>
    </div>
  `);
}

// 初始化助手
function initHelper(page) {
  const notyfCss = GM_getResourceText("CSS_notyf");
  GM_addStyle(notyfCss);
  const hystModalCss = GM_getResourceText("CSS_hystModal");
  GM_addStyle(hystModalCss);
  const pureCss = GM_getResourceText("CSS_pureCss");
  GM_addStyle(pureCss);

  GM_addStyle(`
    .gm-tool-btn { opacity:0.4;font-size:14px;border-radius:0.1875rem;color:#f1f1f1;box-sizing:content-box;box-shadow:0 1px 3px rgba(0,0,0,.3);text-shadow:2px 2px 3px rgba(0,0,0,.3);letter-spacing:1px;font-weight:bold;cursor:pointer;user-select:none;display:inline-block;text-align:center;vertical-align:middle;white-space:nowrap; }
    .gm-tool-btn:hover { opacity:0.8 }
    .gm-tool-btn-s { height:20px;line-height:20px;font-size:13px;padding: 0 8px; } /* width:121px; */
    .gm-tool-btn-m { height:30px;line-height:30px;font-size:14px;padding: 0 12px; } /* width:108px; */
    .gm-tool-btn-l { height:35px;line-height:35px;font-size:16px;padding: 0 15px; } /* width:200px; */
    .gm-tool-btn-styl-0 { background:#000000 }
    .gm-tool-btn-styl-1 { background:radial-gradient(#707070, #9e9e9e);border:1px solid #707070 } /* misc */
    .gm-tool-btn-styl-2 { background:radial-gradient(#fc4e4e, #f26f5f);border:1px solid #fc4e4e } /* doujinshi */
    .gm-tool-btn-styl-3 { background:radial-gradient(#e78c1a, #fcb417);border:1px solid #e78c1a } /* manga */
    .gm-tool-btn-styl-4 { background:radial-gradient(#c7bf07, #dde500);border:1px solid #c7bf07 } /* artistcg */
    .gm-tool-btn-styl-5 { background:radial-gradient(#1a9317, #05bf0b);border:1px solid #1a9317 } /* gamecg */
    .gm-tool-btn-styl-6 { background:radial-gradient(#2756aa, #5f5fff);border:1px solid #2756aa } /* imageset*/
    .gm-tool-btn-styl-7 { background:radial-gradient(#8800c3, #9755f5);border:1px solid #8800c3 } /* cosplay */
    .gm-tool-btn-styl-8 { background:radial-gradient(#b452a5, #fe93ff);border:1px solid #b452a5 } /* asianporn */
    .gm-tool-btn-styl-9 { background:radial-gradient(#0f9ebd, #08d7e2);border:1px solid #0f9ebd } /* nonh */
    .gm-tool-btn-styl-a { background:radial-gradient(#5dc13b, #14e723);border:1px solid #5dc13b } /* western */
    .gm-tool-btn[data-disabled] { opacity:0.4 }
    .gm-tool-btn[data-disabled]:hover { opacity:0.6 }
    .gm-tool-btn:not([data-disabled]):hover { opacity:0.8 }
    .itg { margin-bottom:15px }
    /* .itg .gm-tool-btn-s { width:88px } */
    .gm-tool-toolbar { position:fixed;padding:5px;height:50px;left:0;bottom:20px;z-index:65535; }
    .gm-tool-toolbar p { margin-bottom: 0.5em; }
    .notyf__message { font-size: 14px; }
    /* HystModal container */
    .hystmodal.hystmodal--active { z-index: 65535 !important; }
    .hystmodal-content-container { display:flex;flex-flow:column;align-items:flex-start;padding:0.5rem 1rem;background:#eeaeca radial-gradient(circle,#eeaeca 0%,#94bbe9 100%); overflow:hidden; }
    .hystmodal-content-container h2 { font-weight:800;margin:1rem 0 0 }
    .hystmodal-content-container ul { display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr 1fr 1fr;flex-wrap:wrap;list-style:none }
    .hystmodal-content-container ul li { display:flex;width:6rem;height:6rem;margin:.1rem;flex-flow:column;border-radius:.1rem;overflow:hidden;padding:0.5rem;font-weight:300;font-size:.8rem;box-sizing:border-box;background:rgba(255,255,255,0.25);box-shadow:0 8px 32px 0 rgba(31,38,135,0.37);backdrop-filter:blur(4px);border-radius:6px;border:1px solid rgba(255,255,255,0.18) }
    .hystmodal-content-container ul li time { font-size:1.5rem;color:#000000d9;margin:0;font-weight:500; }
    .hystmodal-content-container ul li p { margin-bottom: 0.125rem; }
    .hystmodal-content-container ul li p.green { color: green; }
    .hystmodal-content-container ul li p.red { color: red; }
    .hystmodal-content-container ul li p.warn { color: red; }
    .hystmodal-content-container ul .delay { position: absolute; top: 0.5rem; right: 0.5rem; }
    .hystmodal-content-container ul .blank { background:none;opacity:0.6;box-shadow:none; }
    .hystmodal-content-container ul .today { background:#c191fe70 } /*#ffffff70*/
    .hystmodal-content-container ul .today time { font-weight:800 }
    #gm-hyst-modal-stat .hystmodal__window { width: 725px; overflow: hidden; }
    #gm-hyst-modal-config .hystmodal__window { width: 725px; overflow: hidden; }
    #gm-hyst-modal-config .hystmodal-content-container { padding: 1rem 3.5rem 1rem 1rem; }
    /* purecss */
    .pure-table { margin-top:0.5rem;background:rgba(255, 255, 255, 0.2);border: 1px solid rgba(255,255,255,0.4);box-shadow:inset 0 0 20px rgba(255, 255, 255, 0.3); }
    .pure-table td, .pure-table th { border-color: rgba(255,255,255,0.4);text-align:center; }
    .pure-table th { user-select:none; }
    /* 周计划 */
    div[desformcode="xia_zhou_gong_zuo_ji_hua_k3mp"] .el-table__row.past { background: #f1f1f1 !important; }
    div[desformcode="xia_zhou_gong_zuo_ji_hua_k3mp"] .el-table__row.next { background: #ffffca !important; }
  `);

  // 提示框
  notyf = new Notyf({ position: { x: "center", y: "top" }, dismissible: true, duration: 2500 });
  // 模块窗口
  gmHystModal = new HystModal({
    linkAttributeName: "data-hystmodal",
    //settings (optional). see Configuration
  });
}

function showError(msg) {
  showMsg(msg, "error");
}
function showSuccess(msg) {
  showMsg(msg, "success");
}
function showMsg(msg, typ) {
  if (notyf)
    notyf.open({
      type: typ ? typ : "info",
      message: msg,
    });
  else alert(msg);
}
