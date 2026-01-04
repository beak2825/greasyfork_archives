// ==UserScript==
// @name         NGA论坛Vtuber讨论区表情包
// @version      0.1.0
// @description  在NGA发帖框中增加VTB表情（现为清露イクナ和湊あくあ），图片来自于NGA用户绘制。
// @author       hoshikaze
// @match        *://bbs.ngacn.cc/post.php*
// @match        *://ngabbs.com/post.php*
// @match        *://nga.178.com/post.php*
// @match        *://bbs.nga.cn/post.php*
// @grant        none
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.2.1.js
// @namespace    https://greasyfork.org/users/296667
// @downloadURL https://update.greasyfork.org/scripts/382398/NGA%E8%AE%BA%E5%9D%9BVtuber%E8%AE%A8%E8%AE%BA%E5%8C%BA%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/382398/NGA%E8%AE%BA%E5%9D%9BVtuber%E8%AE%A8%E8%AE%BA%E5%8C%BA%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    const addStyle = (css) => {
      const style = document.createElement('style')
      style.innerText = css
      document.head.appendChild(style)
    }

    addStyle(`
    .single_ttip2 .div3 > div {
      padding: 4px 4px 0 4px;
    }
    .single_ttip2 .div3 > div:empty {
      display: inline-block;
      padding: 0;
    }
    .vtb-sticker img {
      max-height: 130px;
      cursor: pointer;
    }
    `)

    const stickers = ['./mon_201904/01/-zue37Q5-aki2KlToS1x-1o.png','./mon_201904/01/-zue37Q5-g8wdKoToS1x-1o.png','./mon_201904/01/-zue37Q5-eqmKlToS1x-1o.png','./mon_201904/01/-zue37Q5-6ae0KmToS1x-1o.png','./mon_201904/01/-zue37Q5-bwarKoToS1x-1o.png','./mon_201904/30/-88lruQ5-6s2bKzToS4g-3m.png',
    './mon_201904/30/-88lruQ5-l5q4KzToS4g-3m.png',
    './mon_201904/30/-88lruQ5-drj3KvToS4g-3m.png',
    './mon_201904/30/-88lruQ5-6z8fKwToS4g-3m.png',
    './mon_201904/30/-88lruQ5-lakzK11ToS4g-3m.png',
    './mon_201904/30/-88lruQ5-8c88KvToS4g-3m.png',
    './mon_201904/30/-88lruQ5-c58KvToS4g-3m.png',
    './mon_201904/30/-88lruQ5-e8xyK10ToS4g-3m.png',
    './mon_201904/30/-88lruQ5-hxdqKvToS4g-3m.png',
    './mon_201904/30/-88lruQ5-a34dKuToS4g-3m.png',
    './mon_201904/30/-88lruQ5-2pqhKyToS4g-3m.png',
    './mon_201904/30/-88lruQ5-gtu0KzToS4g-3m.png',
    './mon_201904/30/-88lruQ5-8cwvKxToS4g-3m.png',
    './mon_201904/30/-88lruQ5-fry6KvToS4g-3m.png',
    './mon_201904/30/-88lruQ5-7dm7KxToS4g-3m.png',
    './mon_201904/30/-88lruQ5-fx5xKyToS4g-3m.png',
    './mon_201904/30/-88lruQ5-h8pxKwToS4g-3m.png',
    './mon_201904/30/-88lruQ5-i0qyKrToS4g-3m.png',
    './mon_201904/30/-88lruQ5-75twKrToS4g-3m.png',
    './mon_201904/30/-88lruQ5-jcorKrToS4g-3m.png',
    './mon_201904/30/-88lruQ5-gdz8KpToS4g-3m.png',
    './mon_201904/30/-88lruQ5-8tynKpToS4g-3m.png',
    './mon_201904/30/-88lruQ5-1lsdKrToS4g-3m.png',
    './mon_201904/30/-88lruQ5-g9e8KsToS4g-3m.png',
    './mon_201904/30/-88lruQ5-9ig8KqToS4g-3m.png',
    './mon_201904/30/-88lruQ5-31n5KsToS4g-3m.png',
    './mon_201904/30/-88lruQ5-ctslKmToS4g-3m.png',
    './mon_201904/30/-88lruQ5-5934KwToS4g-3m.png'
    ]
    const insertBtn = () => {
      if (document.querySelector('button#vtb-sticker')) return
      const box = document.querySelector('#uiAddTag .div3')
      box.insertAdjacentHTML('beforeend', '<button id="vtb-sticker" onclick="window.setvtbSticker(this)">Vtuber</button><div class="vtb-sticker"></div>')
    }
    function m() {
        $("#xoxoxxxoxoxxoo").find("tr").eq(3).find("td.c2").append('&nbsp;<button title="vtb区" id="vtb-sticker"  type="button" style="" onclick="window.setvtbSticker(this)">VTB专区</button><div class="vtb-sticker"></div>');
    }
    m()
    
    $("body").on("click","#vtb-sticker",function(e) {
        postfunc.dialog.createWindow('uiAddTag')
        postfunc.dialog.w.style.display='none'
        postfunc.dialog.w._.addContent(null)
        postfunc.dialog.w._.addTitle('VTB区表情')
        var tmp = ''
        tmp += "<div style='display: block; transform-origin: 0px 0px; width: 1314px; visibility: inherit; transform: translate(0px, 0px) scale(1); left: 19px; top: 449px;'>" 
        /*调整边框大小和图片大小*/
        for (var k in stickers) {
            tmp += "<img src='http://img.nga.178.com/attachments/"+stickers[k]+"' max-height='130' onclick='postfunc.dialog.w._.hide();postfunc.addText(\"[img]"+stickers[k]+"[/img]\")' />"
        }
        tmp += "</div>"
        postfunc.dialog.w._.addContent(tmp)
        postfunc.dialog.w._.show(e)
    })

    const obConfig = {
      subtree: true,
      childList: true
    }

    const targetNode = document.body
    const observer = new MutationObserver(mutationCallback)
    observer.observe(targetNode, obConfig)
  })();