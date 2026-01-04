// ==UserScript==
// @name 碧藍幻想打完了
// @namespace https://gist.github.com/biuuu/gbf-dwl-custom
// @version 2.0.0
// @description 無
// @icon http://game.granbluefantasy.jp/favicon.ico
// @author Richard
// @match *://game.granbluefantasy.jp/*
// @match *://gbf.game.mbga.jp/*
// @run-at document-body
// @grant GM_notification
// @downloadURL https://update.greasyfork.org/scripts/469535/%E7%A2%A7%E8%97%8D%E5%B9%BB%E6%83%B3%E6%89%93%E5%AE%8C%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/469535/%E7%A2%A7%E8%97%8D%E5%B9%BB%E6%83%B3%E6%89%93%E5%AE%8C%E4%BA%86.meta.js
// ==/UserScript==
(function () {
  "use strict" ;
  const addStyle = (css) => {
    const style = document.createElement("style")
    style.innerText = css
    document.head.appendChild(style)
  }
  // 隱藏Mobage
  addStyle(`
    body>div:first-child>div:first-child>div:first-child[data-reactid] {
      display: none;
    }
    body>div:first-child>div:nth-child(2) {
      margin-left: 0 !important;
    }
  `)
  let eventOn = false
  window.addEventListener("hashchange", () => {
    let hash = location.hash
    //多人戰
    if (/^#result_multi\/\d/.test(hash)) {
      GM_notification(
        {
          title: "打完了",
          text: "看一下",
          timeout: 100000,
        },
        () => {
          //https://game.granbluefantasy.jp/?#quest/supporter/794521/1
          //quest/supporter/794531/1/0/10456
          //location.hash = 'quest/assist'
          //https://game.granbluefantasy.jp/?#quest/supporter/795401/1
          //location.hash = 'quest/supporter/795631/1/0/10459'
          //四象青龍
          //location.hash = 'quest/supporter/711091/1'
          //四象朱雀
          //location.hash = 'quest/supporter/711191/1'
          //四象玄武
          //location.hash = 'quest/supporter/711041/1'
          //四象白虎
          location.hash = "quest/assist"
          //location.hash = 'event/sequenceraid018/supporter/1401803'
          window.focus()
        }
      )
    }

    //單人戰
    if (/^#result\/\d/.test(hash)) {
      if (!eventOn) {
        eventOn = true
        $(document).ajaxSuccess(function (event, xhr, settings, data) {
          if (/\/result(multi)?\/data\/\d+/.test(settings.url)) {
            //判斷是否出寶箱 buff怪
            if (data.replicard.has_occurred_event) {
              GM_notification(
                {
                  title: "出寶箱了",
                  text: "出寶箱了",
                  timeout: 100000,
                },
                () => {
                  //轉世一-左下
                  //location.hash = 'replicard/stage/4'
                  //轉世一-左上
                  location.hash = 'replicard/stage/2'
                  //轉世一-右下
                  //location.hash = 'replicard/stage/5'
                  //轉世一-右上
                  //location.hash = 'replicard/stage/3'
                  //轉世二-左上
                  //location.hash = 'replicard/stage/6'
                  //轉世二-右下
                  //location.hash = 'replicard/stage/9'
                  //轉世二-右上
                  //location.hash = 'replicard/stage/7'
                  //轉世二-左下
                  //location.hash = "replicard/stage/8"
                  //左下-倒吊
                  //location.hash = 'replicard/supporter/8/8/3/817011/25'
                  //轉世三
                  //location.hash = 'replicard/stage/10'

                  window.focus()
                }
              )
            } else {
              GM_notification(
                {
                  title: "打完了",
                  text: "看一下",
                  timeout: 100000,
                },
                () => {
                  //轉世一-右下
                  //location.hash = 'replicard/stage/5'
                  //轉世一-土文書
                  //location.hash = 'replicard/supporter/4/4/3/813011/25'
                  //轉世一-水文書
                  //location.hash = 'replicard/supporter/3/3/4/812011/25'
                  //轉世一-風文書
                  //location.hash = 'replicard/supporter/5/5/2/814011/25'
                  //轉世一-火文書
                  location.hash = 'replicard/supporter/2/2/3/811011/25'
                  //轉世二-左上
                  //location.hash = 'replicard/stage/6'
                  //轉世二-右下
                  //location.hash = 'replicard/stage/9'
                  //轉世二-右上-月亮
                  //location.hash = 'replicard/supporter/7/7/5/816021/25'
                  //轉世二-左下-塔
                  //location.hash = 'replicard/supporter/8/8/4/817021/25'
                  //轉世二-左下-倒吊
                  //location.hash = 'replicard/supporter/8/8/3/817011/25'
                  //轉世二-左下-def
                  //location.hash = 'replicard/supporter/8/8/4/817071/25'
                  //轉世二-左下
                  //location.hash =  'replicard/stage/8'
                  //左下-倒吊
                  //location.hash = 'replicard/supporter/8/8/3/817011/25'
                  //轉世三-土五格
                  //location.hash = 'replicard/supporter/10/10/6/819041/25'
                  //轉世三-土三格
                  //location.hash = 'replicard/supporter/10/10/7/819051/25'
                  //轉世三-土def
                  //location.hash = 'replicard/supporter/10/10/6/819161/25'
                  //轉世三-暗三格
                  //location.hash = 'replicard/supporter/10/10/11/819091/25'
                  //轉世三-光五格
                  //location.hash = 'replicard/supporter/10/10/4/819031/25'
                  //轉世三-火五格
                  //location.hash = 'replicard/supporter/10/10/2/819011/25'
                  //轉世三-火三格
                  //location.hash = 'replicard/supporter/10/10/3/819021/25'
                  //轉世三-火def
                  //location.hash = 'replicard/supporter/10/10/3/819141/25'
                  //轉世三-水五格
                  //location.hash = 'replicard/supporter/10/10/9/819071/25'
                  //轉世三-水def
                  //location.hash = 'replicard/supporter/10/10/9/819151/25'
                  //轉世三-風五格
                  //location.hash = 'replicard/supporter/10/10/13/819101/25'
                  //轉世三-風def
                  //location.hash = 'replicard/supporter/10/10/13/819171/25'
                  //轉世三-風三格
                  //location.hash = 'replicard/supporter/10/10/14/819111/25'
                  //轉世三-世界
                  //location.hash = 'replicard/supporter/10/10/16/819131/25/0/25085'
                  window.focus()
                }
              )
            }
          }
        })
      }
    }
  })
})();
