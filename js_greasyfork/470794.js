// ==UserScript==
// @name         GEE任务取消
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  根据输入框里的关键词，将任务列表中匹配关键词的任务批量删除（通常这个关键词是日期）
// @author       You
// @match        https://code.earthengine.google.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470794/GEE%E4%BB%BB%E5%8A%A1%E5%8F%96%E6%B6%88.user.js
// @updateURL https://update.greasyfork.org/scripts/470794/GEE%E4%BB%BB%E5%8A%A1%E5%8F%96%E6%B6%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function findStringInDiv(div, searchString) {
  // 获取 div 内容的文本
  const divText = div.textContent || div.innerText;

  // 在 div 文本中搜索指定字符串
  if (divText.includes(searchString)) {
    return true;
  } else {
    return false;
  }
}
    $("body")
        .append("<div style='position:fixed;z-index:999;width:250px;heigh:90px;top:15px;right:260px;display:flex'id='cancel_muti'><input type='text' class='search' style='width:130px' placeholder='Type keywords' id='keyword_of_del'></input><button class='goog-button link-button' style='color:#4888ef;margin-left: 5px;' id='muti-cancel'>Muti-Cancel</button></div>")
    var list_box = $('div > div.content > ee-remote-task-list');
    $("#muti-cancel").click(function(){
        var keywords = $('#keyword_of_del').val();
        console.log(keywords)
        document.querySelector("#task-pane").shadowRoot.querySelector("div > ee-remote-task-list").shadowRoot.querySelector("div.remote-tasks").querySelectorAll('div').forEach(childDiv => {
            // 在这里对每个子 div 进行操作
            //console.log(childDiv);
            childDiv.click();
            if(findStringInDiv(childDiv,keywords)){
                try{
                    childDiv.querySelector("div.info > div.links > button").click()
                }catch(err){
                    console.log("er")
                }

            }

        })
    })
    console.log(list_box)
})();