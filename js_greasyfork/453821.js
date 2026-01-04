// ==UserScript==
// @name        启信宝自动复制当前页所有分支机构名称
// @namespace   Violentmonkey Scripts
// @match       https://www.qixin.com/company/*
// @grant       none
// @version     1.0
// @author      我爱小熊啊
// @description 2022/10/27 13:23:28
// @downloadURL https://update.greasyfork.org/scripts/453821/%E5%90%AF%E4%BF%A1%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E6%89%80%E6%9C%89%E5%88%86%E6%94%AF%E6%9C%BA%E6%9E%84%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/453821/%E5%90%AF%E4%BF%A1%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E6%89%80%E6%9C%89%E5%88%86%E6%94%AF%E6%9C%BA%E6%9E%84%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==
var t = setInterval(function(){
  var name_nodes = document.querySelectorAll('#company-branch .table tbody tr div a');

  if(name_nodes.length != 0){
    var name_arr = [];
    name_nodes.forEach(name_node =>{
      name_arr.push(name_node.text);
    });

    var name_of_current_page = name_arr.join('、');
    console.log(name_of_current_page);
    clearInterval(t);

    // 将获取到的内容复制到剪切板
    const copyContent = async () => {
      try {
        await navigator.clipboard.writeText(name_of_current_page);
        console.log('Content copied to clipboard');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    };
    copyContent();
  }
},100);
