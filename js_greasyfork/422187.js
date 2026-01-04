// ==UserScript==
// @name        补全hash磁力链并粘贴至粘贴板
// @namespace   sky
// @description 鼠标选中哈希值（散列），会自动进行相应的磁力链接下载
// @include     /^https?:*/
// @author      sky
// @icon        https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2166564894,3332278849&fm=26&gp=0.jpg
// @license     MIT
// @version     1.0.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/422187/%E8%A1%A5%E5%85%A8hash%E7%A3%81%E5%8A%9B%E9%93%BE%E5%B9%B6%E7%B2%98%E8%B4%B4%E8%87%B3%E7%B2%98%E8%B4%B4%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/422187/%E8%A1%A5%E5%85%A8hash%E7%A3%81%E5%8A%9B%E9%93%BE%E5%B9%B6%E7%B2%98%E8%B4%B4%E8%87%B3%E7%B2%98%E8%B4%B4%E6%9D%BF.meta.js
// ==/UserScript==

function generateLink() {
    let textContent = window.getSelection().toString().trim();

    if (textContent.length === 40 || textContent.length === 32) {

        if (textContent.match(/^\w{40}|\w{32}/)) {
            magnetLink = "magnet:?xt=urn:btih:" + textContent;
            
            // 开始下载
          copyMagnetLink(magnetLink)

        } else {
            // 所选字符串并非HASH串
        }

    }

}

/**
 * 接受一个链接，自动开始下载
 * 建立一个a标签并设置其href属性，建立一个鼠标点击事件，让a模拟触发
 * @param link
 */
function autoDownload(link) {

    let btnDownload = document.createElement('a'),
        clickEvent = document.createEvent("MouseEvent");

    clickEvent.initEvent("click", true, false);
    btnDownload.setAttribute("href", link);

    btnDownload.dispatchEvent(clickEvent);

}
/**
 * 接受一个链接，复制到粘贴板
 * @param link
 */
function copyMagnetLink(link){
  if(window.clipboardData){
        window.clipboardData.setData('text',link);
    }else{
        (function(link){
            document.oncopy=function(e){
                e.clipboardData.setData('text',link);
                e.preventDefault();
                document.oncopy=null;
            }
        })(link);
        document.execCommand('Copy');
    }
}

window.addEventListener("mouseup", generateLink);
