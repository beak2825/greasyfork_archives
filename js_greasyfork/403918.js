// ==UserScript==
// @name        淘宝收藏夹快速删除
// @namespace   http://www.mozl.net 
// @match       https://shoucang.taobao.com/item_collect*.htm*
// @grant       none
// @run-at      document-end
// @version     1.0
// @author      Mozl
// @description 2020/5/22 上午12:57:50
// @downloadURL https://update.greasyfork.org/scripts/403918/%E6%B7%98%E5%AE%9D%E6%94%B6%E8%97%8F%E5%A4%B9%E5%BF%AB%E9%80%9F%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/403918/%E6%B7%98%E5%AE%9D%E6%94%B6%E8%97%8F%E5%A4%B9%E5%BF%AB%E9%80%9F%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
(function () {
  'use strict';
  KISSYisReady(function () {
    let observer

    S.one('.fav-tools').prepend('<div class="fav-tool-showbtn btn-quick-del btn-ok">快速删除</div>')

    showDelBtn()

    S.one('.btn-quick-del').on('click', () => {
      if (sessionStorage.getItem('quick-del-enable') === null) {
        sessionStorage.setItem('quick-del-enable', true)
        showDelBtn()
      } else {
        if (sessionStorage.getItem('quick-del-enable')) {
          S.one('.btn-quick-del').text('快速删除')
          S.all('.J_DeleteItem_Close.btn-close').fire('click')
          S.all('.is-quick-del').removeClass('.is-quick-del')
          sessionStorage.removeItem('quick-del-enable')
          observer.disconnect()
        }
      }
    })

    function showDelBtn () {
      if (sessionStorage.getItem('quick-del-enable')) {
        S.one('.btn-quick-del').text('关闭快速删除')
        setTimeout(function () {
          S.all('.J_FavListItem').addClass('is-quick-del').all('.delete-btn').fire('click')
        }, 500)
        const target = document.querySelector('.img-item-list.J_FavList')
        observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            const newItems = [].filter.call(mutation.addedNodes, (node) => { return S.one(node).hasClass("J_FavListItem") })
            if (newItems.length > 0) {
              S.all(newItems).addClass('is-quick-del').all('.delete-btn').fire('click')
            }
          });
        })

        observer.observe(target, {
          attributes: true,
          childList: true,
          characterData: true
        })
      }
    }
  }, 50)

  var css = [
    ".fav-tool-showbtn.btn-quick-del",
    "{",
    "	 	width:88px;",
    "   border-color: #ff4200;",
    "   background-color: #ff4200;",
    "   color: #fff !important;",
    "}",
    ".is-quick-del.del-pop-show .del-pop-bg",
    "{",
    "	 	opacity:.2;",
    "}",
    ".J_FavListItem.is-quick-del .del-pop-box > .txt,",
    ".J_FavListItem.is-quick-del .del-pop-box > .btns > .btn-close",
    "{",
    "   display:none",
    "}",
    ".J_FavListItem.is-quick-del .del-pop-box > .btns > .btn-ok",
    "{",
    "   text-indent: -9999px;",
    "   line-height: 0;",
    "}",
    ".J_FavListItem.is-quick-del .del-pop-box > .btns > .btn-ok::after",
    "{",
    "   content: '删除';",
    "   text-indent: 0;",
    "   display:block;",
    "   line-height: 22px;",
    "}"
  ].join("\n");
  if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
  } else if (typeof addStyle != "undefined") {
    addStyle(css);
  } else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
      heads[0].appendChild(node);
    } else {
      // no head yet, stick it whereever
      document.documentElement.appendChild(node);
    }
  }

  function KISSYisReady (fn, time) {
    if (typeof KISSY.one === "function") {
      fn();
    } else {
      setTimeout(() => {
        KISSYisReady(fn, time);
      }, time)
    }
  }

})()
