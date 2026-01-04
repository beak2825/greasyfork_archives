// ==UserScript==
// @name         fb-ad-copyer
// @namespace    fb-ad-copyer
// @version      1.0
// @description  fb ad copyer
// @author       You
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489716/fb-ad-copyer.user.js
// @updateURL https://update.greasyfork.org/scripts/489716/fb-ad-copyer.meta.js
// ==/UserScript==


//加载外部CSS，资源已在上方resource中

let _scroller = false;
function getLink(parentDom){
    if(!parentDom) return;
    let a = $(parentDom).find("a");
    if(!a)return;
    if(a.attr("href") && a.attr("href").indexOf('https://l.facebook.com/l.php?u=') > -1){
          return a.attr("href");
    }
    return;
}

function copyToClipboard(textToCopy) {
    // navigator clipboard 需要https等安全上下文
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard 向剪贴板写文本
        return navigator.clipboard.writeText(textToCopy).then(function () {
            layer.msg("复制成功Https！", { icon: 1 })
        });
    } else {
        // 创建text area
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        // 使text area不在viewport，同时设置不可见
        textArea.style.position = "absolute";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // 执行复制命令并移除文本框
            layer.msg("复制成功Http！", { icon: 1 });
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
}


function addBtns(){
        _scroller = true;
       $("video").each(function(index,domEle){
           if($(domEle).data("btn")){
               return;
           }
           let parentDom =  $(domEle).parent();
           let pLink = null;
           //向上查20级的dom
           for(var i=0;i<20;i++){
             pLink = getLink(parentDom);
             if(pLink){
                break;
             }
              parentDom = $(parentDom).parent();
           }

           $(domEle).parent().parent().css("position","relative");
           $(domEle).parent().append("<div style=' position: absolute;top: 10px;left: 10px;'><button class='rtc-download' data-open='"+$(domEle).attr("src")+"'>视频</button></div>");
           $(domEle).parent().append("<div style=' position: absolute;top: 40px;left: 10px;'><button class='rtc-download' data-open='"+$(domEle).attr("poster")+"' >视频封面</button></div>");
           $(domEle).parent().append("<div style=' position: absolute;top: 70px;left: 10px;'><button class='rtc-copy-link' data-open='"+pLink+"' >产品链接</button></div>");
      });
    _scroller = false;
}

(async function ($) {
    // 'use strict';
    /** model init */
    if(location.href.indexOf("facebook.com/ads/library") <= -1){
      return;
    }
    setTimeout(()=>{
        addBtns();
        window.addEventListener('scroll', function() {
           if(_scroller){
               return;
           }
            addBtns();
        });

        $("body").on("click",'.rtc-download',function(){
            window.open($(this).data("open"),"_blank");
        });

         $("body").on("click",'.rtc-copy-link',function(){
             copyToClipboard($(this).data("open"));
             $(this).text("产品链接(已复制)");
        });

        }, 1000 * 2)

})(window.jQuery);