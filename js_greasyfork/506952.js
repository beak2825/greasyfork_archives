// ==UserScript==
// @name         罗盘编辑页面
// @description  快速进入罗盘编辑页面
// @namespace    CN_SJ
// @version      0.0.9
// @license      GPLv3
// @author       @QK
// @match        *h.cainiao-inc.com/*
// @match        *pre-h.cainiao-inc.com/*
// @match        *fbi.alibaba-inc.com/*
// @match        *quark.alibaba-inc.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @grant         GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/506952/%E7%BD%97%E7%9B%98%E7%BC%96%E8%BE%91%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/506952/%E7%BD%97%E7%9B%98%E7%BC%96%E8%BE%91%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

function fbiMenuResolove() {
  const linkURL = new URL(window.location.href);
  const cn = linkURL.searchParams.get("CAINIAO_STAFF");
  if (!cn) {
    return;
  }
  const fbi_id = linkURL.searchParams.get("id");
  if (!fbi_id) {
    return;
  }

  var bt = document.createElement("a");
  bt.id = "fbi_bt";
  bt.href = "https://fbi.alibaba-inc.com/fbi/design/" + fbi_id + "/edit.htm";
  bt.target = "_blank";
  bt.innerText = "编辑报表";

  var vt = document.createElement("a");
  vt.id = "fbi_vt";
  vt.href = "https://fbi.alibaba-inc.com/dashboard/view/page.htm?id=" + fbi_id;
  vt.target = "_blank";
  vt.innerText = "查看报表";
  GM_addStyle(`
    #fbi_bt {
      margin-left:8px;
      border:1px;
      border-style:dashed;
      border-color:red;
      font-size:14px;
      color:deepskyblue;
    }

    #fbi_vt {
      margin-left:8px;
      border:1px;
      border-style:dashed;
      border-color:red;
      font-size:14px;
      color:deepskyblue;
    }
  `);

  var x = document.getElementById("wrapper");
  x.appendChild(bt);
  x.appendChild(vt);
}

function dscdMenuResolve() {
  const menuList = unsafeWindow.childApp || [];
  if (menuList.length == 0) {
    console.warn("menuList is empty.");
    return;
  }
  const pathname = window.location.pathname;
  const menu = menuList.find((item) => item.path === pathname);
  if (!menu) {
    console.warn("can not find menu, pathname:" + pathname);
    return;
  }

  let typeName = "";
  if (menu.type === "blank") {
    typeName = "空节点";
  } else if (menu.type === "ebcPage") {
    typeName = "在线开发";
  } else if (menu.type === "link") {
    typeName = "iframe嵌入";
  } else if (menu.type === "mode") {
    typeName = "源码资源开发";
  }

  let fbi_id = "";
  if (menu.type === "link") {
    const linkURL = new URL(menu.menuUrl);
    if (linkURL.href.includes("tida-scm.cainiao-inc.com/api/fbi")) {
      fbi_id = linkURL.pathname.split("/").pop();
    } else if (
      linkURL.href.includes("fbi.alibaba-inc.com") ||
      linkURL.href.includes("quark.alibaba-inc.com")
    ) {
      fbi_id = linkURL.searchParams.get("id");
    }
  }

  const edit_url =
    "https://fbi.alibaba-inc.com/fbi/design/" + fbi_id + "/edit.htm";
  let view_url =
    "https://fbi.alibaba-inc.com/dashboard/view/page.htm?id=" + fbi_id;

  const container = document.createElement("div");
  container.id = "dscd_div";

  const page = document.createElement("div");
  page.id = "dscd_page";
  page.textContent = `页面类型【${typeName}】`;
  container.appendChild(page);

  if (fbi_id) {
    const btn = document.createElement("a");
    btn.id = "dscd_btn";
    btn.href = edit_url;
    btn.target = "_blank";
    btn.innerText = "编辑报表";

    container.appendChild(btn);

    const vtn = document.createElement("a");
    vtn.id = "dscd_vtn";
    vtn.href = view_url;
    vtn.target = "_blank";
    vtn.innerText = "查看报表";
    container.appendChild(vtn);
  }

  if (menu.type === "link") {
    const url_text = document.createElement("a");
    url_text.id = "dscd_url_text";
    container.appendChild(url_text);

    url_text.href = menu.menuUrl;
    url_text.target = "_blank";
    url_text.innerText = menu.menuUrl;
  }

  GM_addStyle(`
    #dscd_div {
      display:flex;
      justify-content:flex-start;
      align-items:center;
    }

    #dscd_page {
      background_color:lightgreen;
      padding:5px;
    }

    #dscd_btn {
      margin-left:8px;
      border:1px;
      border-style:dashed;
      border-color:red;
      font-size:14px;
      color:deepskyblue;
    }

    #dscd_vtn {
      margin-left:8px;
      border:1px;
      border-style:dashed;
      border-color:red;
      font-size:14px;
      color:deepskyblue;
    }

    #dscd_url_text {
      margin-left:8px;
      font-size:14px;
      color:lightgray;
    }
  `);

  const shells = document.getElementsByClassName("cn-ui-shell-content");
  if (shells.length > 0) {
    const shell = shells[0];
    shell.insertBefore(container, shell.firstChild);
  }
}

(function ($) {
  "use strict";

  // origin fbi
  const href = window.location.href;
  if (
    href.includes("fbi.alibaba-inc.com") ||
    href.includes("quark.alibaba-inc.com")
  ) {
    fbiMenuResolove();
  }

  // dscd
  if (href.includes("h.cainiao-inc.com/dscd")) {
    setTimeout(() => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          const divs = $(".cn-ui-shell-content");
          if (divs.length > 0) {
            const div = divs[0];
            const child = div.querySelector("#dscd_div");
            if (child) {
              div.removeChild(child);
            }
            dscdMenuResolve();
          }
        });
      });

      const divs = $(".cn-ui-shell-content");
      if (divs.length > 0) {
        observer.observe(divs[0].lastChild, {
          childList: true,
          subtree: false,
        });
        dscdMenuResolve();
      }
    }, 3000);
  }
})(jQuery);
