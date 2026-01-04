// ==UserScript==
// @name         飞书
// @description  先点下面这问号👇？👇，查看教材安装相应浏览器的插件再安装本脚本
// @namespace    feishu
// @author       LiHaoMing
// @version      1.16
// @match        https://4399.feishu.cn/
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_deleteValue
 
// @license      MIT License
// @contributionURL    
// @contributionAmount 1￥
// @downloadURL https://update.greasyfork.org/scripts/454170/%E9%A3%9E%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/454170/%E9%A3%9E%E4%B9%A6.meta.js
// ==/UserScript==
setTimeout(() => {
	
     console.clear()
var amm =[]
var name = "俊杰小分队"
document.querySelectorAll('.feedCard_item').forEach((item)=>{
    if(item.getAttribute('aria-label').indexOf(name)!==-1){
       var timer = setInterval(()=>{
        let text = item.querySelector('.feedMessagePreviewContent').innerHTML
        if(text !== amm[amm.length-1]){
            console.log('小铭插件___'+text)
            amm.push(text)
        }
    },300)
    }
})
}, 1000);
 
    
