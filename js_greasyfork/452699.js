// ==UserScript==
// @name         城市售票網-快速購票(自動選擇票數及快速購票)
// @namespace    http://
// @version      0.1.1
// @description  佢係基於城網購買頁面,自動咁選擇票價,人數,同按快速購票呢三樣野。如果無反應應該係撞咗SCRIPT, 試下係段SCRIPT之前加//會取消個SCRIPT。希望呢個小SCRIPT可以幫大家係座位畀人HOLD起時候,最後成功咁CHOP到個位出黎。
// @author       You
// @match        https://ticket.urbtix.hk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452699/%E5%9F%8E%E5%B8%82%E5%94%AE%E7%A5%A8%E7%B6%B2-%E5%BF%AB%E9%80%9F%E8%B3%BC%E7%A5%A8%28%E8%87%AA%E5%8B%95%E9%81%B8%E6%93%87%E7%A5%A8%E6%95%B8%E5%8F%8A%E5%BF%AB%E9%80%9F%E8%B3%BC%E7%A5%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/452699/%E5%9F%8E%E5%B8%82%E5%94%AE%E7%A5%A8%E7%B6%B2-%E5%BF%AB%E9%80%9F%E8%B3%BC%E7%A5%A8%28%E8%87%AA%E5%8B%95%E9%81%B8%E6%93%87%E7%A5%A8%E6%95%B8%E5%8F%8A%E5%BF%AB%E9%80%9F%E8%B3%BC%E7%A5%A8%29.meta.js
// ==/UserScript==



//呢個係選擇票價
//document.querySelector("#pricezone-radio-input-368").click()
//document.querySelector("#pricezone-radio-input-369").click()
//document.querySelector("#pricezone-radio-input-370").click()
//document.querySelector("#pricezone-radio-input-371").click()
//document.querySelector("#pricezone-radio-input-638").click()
//document.querySelector("#pricezone-radio-input-101").click()

setTimeout(function(){
//呢個係選擇買幾多張飛
document.querySelector("#ticket-quota-223-sel").value = 2
}
,100)

setTimeout(function(){
//呢個係禁快速購票,後面係MS秒數
document.querySelector('div[id="express-purchase-btn"]').click()
}
,100)

;