// ==UserScript==
// @name         Aur 搜索结果优化(Aur search Enhance)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ①Swap the version number and the last update time position ②The last update time is shortened and displayed ③For packages that have not been updated for a long time, the last update field turns gray①将版本号和最后更新时间位置互换②最近更新时间缩短显示③长时间不更新的包，时间字段变灰色
// @author       xianmua
// @match        https://aur.archlinux.org/packages*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archlinux.org
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469192/Aur%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%BC%98%E5%8C%96%28Aur%20search%20Enhance%29.user.js
// @updateURL https://update.greasyfork.org/scripts/469192/Aur%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%BC%98%E5%8C%96%28Aur%20search%20Enhance%29.meta.js
// ==/UserScript==

function modifyResult(){

    let trs=document.querySelectorAll("tr")
    for (let tr of trs) {
        let td1 = tr.children[1]
        let td2 = tr.children[6];
        let tmp = td1.innerHTML;
        td1.innerHTML = td2.innerHTML;
        td2.innerHTML = tmp;
        if(td1.tagName!="TH"){
            td1.setAttribute("originTime",td1.innerHTML)
            td1.onmouseover=function() {
                this.innerHTML=this.getAttribute("originTime")
            }
            td1.onmouseleave=function() {
                td1.innerHTML=this.getAttribute("originTime").slice(0,10)
            }
            td1.innerHTML=td1.innerHTML.slice(0,10)
        }
        //超过三年未更新的包，时间字段颜色变淡
        let datestr=td1.innerHTML
        let now=new Date()
        let lastModified=new Date(datestr)
        if((now.getFullYear()-lastModified.getFullYear())>3){
            //console.log(td1.innerHTML)
            td1.style="color:grey"
        }
    }
}
document.addEventListener(
    "DOMContentLoaded",
    modifyResult
)