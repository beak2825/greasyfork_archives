// ==UserScript==
// @name         Pixiv快速隐私收藏
// @description  右键点任意位置的收藏按钮可以快速隐私收藏作品
// @namespace    https://github.com/journey-ad
// @version      1.0.1
// @author       journey-ad
// @license      WTFPL
// @match        *://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?domain=pixiv.net
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425832/Pixiv%E5%BF%AB%E9%80%9F%E9%9A%90%E7%A7%81%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/425832/Pixiv%E5%BF%AB%E9%80%9F%E9%9A%90%E7%A7%81%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 配合document-start使用observe监控global data标签存在，第一时间取到csrf token
  (new MutationObserver(check)).observe(document, { childList: true, subtree: true });

  function check(changes, observer) {
    if (document.querySelector('#meta-global-data')) {
      observer.disconnect();
      init()
    }
  };

  function init() {
    let globalData = null
    try {
      const content = $('#meta-global-data').attr('content')
      globalData = JSON.parse(content)
    } catch (ex) {
      console.error('global data 解析失败')
      return false
    }

    const BUTTON_CLASSNAME = 'button.sc-kgq5hw-0.fgVkZi'

    const ICON_CSS = `.jyafz {
  box-sizing: border-box;
  line-height: 0;
  font-size: 0px;
  vertical-align: top;
  transition: color 0.2s ease 0s, fill 0.2s ease 0s;
  color: rgb(255, 64, 96);
  fill: currentcolor;
}

.jyafz .j89e3c-0 {
  transition: fill 0.2s ease 0s;
  fill: rgb(255, 64, 96);
}

.jyafz mask .j89e3c-0 {
  fill: white;
}

.iGPkEj {
  fill: rgba(0, 0, 0, 0.88);
  fill-rule: evenodd;
  clip-rule: evenodd;
}

.fsBRJQ {
  fill: rgb(255, 255, 255);
  fill-rule: evenodd;
  clip-rule: evenodd;
}`

    const ICON_SVG_BASE = `<svg viewBox="0 0 32 32" width="32" height="32" class="j89e3c-1 hfJNCQ"><path d="
M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183
C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5
C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366
C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z"></path><path d="M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5
C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328
C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5
C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z" class="j89e3c-0 kjQasE"></path></svg>`
    const ICON_SVG = `<svg viewBox="0 0 32 32" width="32" height="32" class="j89e3c-1 jyafz"><path d="
M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183
C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5
C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366
C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z"></path><path d="M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5
C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328
C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5
C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z" class="j89e3c-0 kjQasE"></path><path d="M29.9796 20.5234C31.1865 21.2121 32 22.511 32 24V28
C32 30.2091 30.2091 32 28 32H21C18.7909 32 17 30.2091 17 28V24C17 22.511 17.8135 21.2121 19.0204 20.5234
C19.2619 17.709 21.623 15.5 24.5 15.5C27.377 15.5 29.7381 17.709 29.9796 20.5234Z" class="j89e3c-2 fsBRJQ"></path><path d="M28 22C29.1046 22 30 22.8954 30 24V28C30 29.1046 29.1046 30 28 30H21
C19.8954 30 19 29.1046 19 28V24C19 22.8954 19.8954 22 21 22V21C21 19.067 22.567 17.5 24.5 17.5
C26.433 17.5 28 19.067 28 21V22ZM23 21C23 20.1716 23.6716 19.5 24.5 19.5C25.3284 19.5 26 20.1716 26 21V22H23
V21Z" class="j89e3c-3 iGPkEj"></path></svg>`

    addStyle(ICON_CSS)

    $(document).on('contextmenu', BUTTON_CLASSNAME, function (e) {
      const $this = $(this)
      const state = $this.attr('data-state')
      const url = $this.closest('div[type="illust"]').find('a').attr('href') || location.pathname
      const illust_id = url.match(/\d+$/)?.[0]
      if (!illust_id) return true

      if (state !== 'liked') {
        addFav(illust_id, 1, (res) => {
          if (res.error) return
          if (res) {
            const { last_bookmark_id } = res.body
            $this
              .attr('data-state', 'liked')
              .attr('data-bookmark-id', last_bookmark_id)
              .html(ICON_SVG)

            console.log(`作品 ${illust_id} 添加隐私收藏`)
          }
        })
      } else {
        const bookmark_id = $this.attr('data-bookmark-id')
        delFav(bookmark_id, (res) => {
          if (res.error) return
          if (state) {
            $this
              .attr('data-state', null)
              .attr('data-bookmark-id', null)
              .html(ICON_SVG_BASE)

            console.log(`作品 ${illust_id} 解除收藏`)
          }
        })
      }
      return false;
    })

    function addFav(illust_id, restrict, cb) {
      fetch("https://www.pixiv.net/ajax/illusts/bookmarks/add", {
        "headers": {
          "accept": "application/json",
          "content-type": "application/json; charset=utf-8",
          "x-csrf-token": globalData.token
        },
        "referrer": "https://www.pixiv.net",
        "body": JSON.stringify({ illust_id, restrict, comment: "", tags: [] }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      })
        .then(res => res.json())
        .then(res => {
          cb && cb(res)
        })
    }

    function delFav(illust_id, cb) {
      fetch("https://www.pixiv.net/rpc/index.php", {
        "headers": {
          "accept": "application/json",
          "content-type": "application/x-www-form-urlencoded; charset=utf-8",
          "x-csrf-token": globalData.token
        },
        "referrer": "https://www.pixiv.net",
        "body": `mode=delete_illust_bookmark&bookmark_id=${illust_id}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      })
        .then(res => res.json())
        .then(res => {
          cb && cb(res)
        })
    }

    function addStyle(css) {
      if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
      } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
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
    }
  }
})();
