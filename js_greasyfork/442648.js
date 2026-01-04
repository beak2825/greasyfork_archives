// ==UserScript==
// @name         同传弹幕
// @namespace    http://tampermonkey.net/
// @version 1.0.
// @license MIT
// @description  B站同传弹幕高亮显示
// @author       wo
// @compatible   Chrome(80.0)
// @compatible   Firefox(74.0)
// @compatible   Edge(80.0)
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/442648/%E5%90%8C%E4%BC%A0%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/442648/%E5%90%8C%E4%BC%A0%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

setInterval(danmu, 50)
function danmu(){
    $(".bilibili-danmaku").each(function(){
        let top = 83
        let str = $(this).text()
        if(str.indexOf('【')!= -1 || str.indexOf('〖')!= -1 ){
          $(this).css({
              "color":'white',
              "text-shadow":'0px 0px 5px #E58750,0px 0px 5px #E58750,0px 0px 5px #E58750',
              "font-family":'楷体',
              "font-weight":'bold',
             // "font-size": '50px',
              "z-index": '9999',
             // "margin-top": '-10px',
             // "top": (top) + '%'
          })
          $(this).text(str.substring(1, str.length - 1))
        //  $(this).attr({'class':'mode-bottomMiddleFLoat bilibili-danmaku'})
        }
        // mode-bottomMiddleFLoat
    })
}
