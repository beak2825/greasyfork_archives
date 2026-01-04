// ==UserScript==
// @name        TimelessJewel Simulator Modifier Remover
// @name:zh-TW  珠寶模擬詳細詞條刪除器
// @namespace   https://github.com/zoosewu/PTTChatOnYoutube
// @match       https://poedb.tw/tw/TimelessJewel
// @grant       none
// @version     1.0.1
// @author      Zoosewu
// @license     MIT
// @description TimelessJewel Simulator Remove Modifier
// @description:zh-tw 珠寶模擬器刪除詳細詞條
// @downloadURL https://update.greasyfork.org/scripts/450744/TimelessJewel%20Simulator%20Modifier%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/450744/TimelessJewel%20Simulator%20Modifier%20Remover.meta.js
// ==/UserScript==
setInterval(()=>{
  let table = $("table[role='grid']")
  if(table)table.remove()
  },200)