// ==UserScript==
// @name         Aerfaying Evolved
// @namespace    https://github.com/Silverteal/Aerfaying-Evolved
// @version      2.6-Fork6
// @description  用于增强阿儿法营部分功能的用户脚本
// @author       TimFang4162
// @author       Silverteal
// @match        *://*.aerfaying.com/*
// @match        *://*.gitblock.cn/*
// @match        *://*.3eworld.cn/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @license      GPLv3
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/445333/Aerfaying%20Evolved.user.js
// @updateURL https://update.greasyfork.org/scripts/445333/Aerfaying%20Evolved.meta.js
// ==/UserScript==

  //================== Global Func =====================
  $("body").prepend(`
<script>function dat_alert(title,name,useTime,markdown) {
        $("body").after(\`
<div class="ReactModalPortal" id="DAT_AlertWindow">
    <div class="ReactModal__Overlay ReactModal__Overlay--after-open modal_modal-overlay_2_Dgx" aria-modal="true">
        <div class="ReactModal__Content ReactModal__Content--after-open modal_modal-content_3brCX" tabindex="-1">
            <div class="box_box_tWy-0" style="flex-direction: column; flex-grow: 1;">
                <div class="modal_header_1dNxf" style="height: 3.125rem;">
                    <div class="modal_header-item_1WbOm modal_header-item-title_1N2BE">\`+title+\`</div>
                    <div class="modal_header-item_1WbOm modal_header-item-close_4akWi">
                        <div aria-label="Close" class="close-button_close-button_t5jqt close-button_large_2cCrv"
                            role="button" tabindex="0" onclick="$('#DAT_AlertWindow').remove();"><img
                                class="close-button_close-icon_ywCI5"
                                src="https://cdn.gitblock.cn/static/images/cb666b99d3528f91b52f985dfb102afa.svg"></div>
                    </div>
                </div>
                <div class="body box_box_tWy-0">
                    <div class="item-attached-thin-modal-body_wrapper_3KdPz">
                        <div>
                            <h1 class="item-attached-thin-modal-body_name_p9cDj">\`+name+\`</h1>
                            <div><span>\`+useTime+\`</span></div>
                        </div>
                    </div>
                    <div class="markdown_body_1wo0f item-isolator-modal_declarationDescp_2g62z">
                        <div class="content">
                            \`+markdown+\`
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>\`);
    }
</script>`);
  //================== Domain Redirect =====================
  var url = window.location.href;
  if (GM_getValue("DAT_domain", null) == null) {
    if (url.search("gitblock.cn") != -1) {
      GM_setValue("DAT_domain", "gitblock");
    }
    if (url.search("aerfaying.com") != -1) {
      GM_setValue("DAT_domain", "aerfaying");
    }
  }
  //console.log(GM_listValues());
  if (GM_getValue("DAT_domain") == "aerfaying") {
    if (url.search("gitblock.cn") != -1) {
      window.location.assign(window.location.href.replace("gitblock.cn", "aerfaying.com"));
    }
  }
  if (GM_getValue("DAT_domain") == "gitblock") {
    if (url.search("aerfaying.com") != -1) {
      window.location.assign(window.location.href.replace("aerfaying.com", "gitblock.cn"));
    }
  }
  //================== Report Center =====================
  if (url.search("/Admin/Reports") != -1) {
    //console.log("In report center, add css");
    GM_addStyle(`;
.user-info_wrapper_2acbL {
  color: #eee !important;
}
.btn-primary:hover,
.btn-primary:focus,
.btn-primary:active {
  background: #4c97ff !important;
  transition: none !important;
}
.btn-primary {
  border: 1px solid #fff3 !important;
}
.panel-top-bar_body_1OptA .search-group > * {
  border-color: #fff3 !important;
}
.btn-default {
  border: 1px solid #fff3 !important;
}
.table-striped > tbody > tr:nth-of-type(2n + 1) {
  background-color: #1e2227 !important;
}
a {
  color: #eee !important;
}
.btn-outline-primary {
  color: #fff !important;
  border-color: #fff3 !important;
  background-color: #0D1117 !important;
}
.btn-outline-primary:hover {
  background-color: #4C97FF !important;
}
.dropdown .dropdown-menu {
  border: 1px solid #fff3 !important;
}
.reports_nav_1SVZ3 {
  color: #888 !important;
}
.responsive-table_head_2zj6E th {
  color: #fff !important;
}
.footer-bar-full-screen_wrapper_1EVW- {
  display: none !important;
}
`);
  }

  //================== Comment ID =====================

  const COMMENT_ID_CLASS = 'dat_comment_id';
  const COMMENT_CLASS = 'comment_comment_P_hgY';
  GM_addStyle(`
    .${COMMENT_ID_CLASS} {
      display: inline;
      color: #888888;
      margin: 0 0.5rem;
      font-size: 12px;
      transition: color 0.1s ease;
    };
    .${COMMENT_ID_CLASS}:hover {
      color: #4C97FF !important;
      transition: color 0.1s ease;
    };
    `);
  setInterval(() => {
    var comments = $('.' + COMMENT_CLASS);
    comments.each(function () {
      var cidel = $('.' + COMMENT_ID_CLASS, this);
      if (cidel.length === 0) {
        var commentId = this.id;
        $('> div.comment_info_2Sjc0 > div:nth-child(2)', this).append(
          ` <a href="` + location.pathname + location.search + `#commentId=` + commentId + `" class="` + COMMENT_ID_CLASS + `">#` + commentId + `</a>`);
      }
    });
  }, 2500);

  //================== View Markdown =====================

  setInterval(() => {
    intervalFunc_ViewMarkdown();
  }, 2500);

  function intervalFunc_ViewMarkdown() {
    if ($(".panel2_panelHead_1Bn6y.panel-head:contains('个人简介')").length != 0 && $("#dat_viewmd").length == 0) {
      $(".panel2_panelHead_1Bn6y.panel-head:contains('个人简介')").children("h2").append(`
<a id="dat_viewmd">Markdown</a>`);
      $("#dat_viewmd").click(function (e) {
        var uid = url.split("/")[4];
        $.ajax({
          url: "/WebApi/Users/" + uid + "/Get",
          type: "POST",
          async: false,
          success: function (result) {
            var markdown = "<pre><code>" + result.user.abstract.replace(/\n/g, "</br>") + "</code></pre>";
            dat_alert("Markdown 原文", result.user.username, "#" + uid, markdown);
          },
        });
      })
    }
  }
;