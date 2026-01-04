// ==UserScript==
// @name        商品库存分析 - erp321.com
// @namespace   jst Scripts
// @match       https://bi-1w.erp321.com/app/report/subject/stockanalysis/default.aspx
// @grant       none
// @version     1.1
// @author      -
// @description 聚水潭商品库存分析自动导出
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457277/%E5%95%86%E5%93%81%E5%BA%93%E5%AD%98%E5%88%86%E6%9E%90%20-%20erp321com.user.js
// @updateURL https://update.greasyfork.org/scripts/457277/%E5%95%86%E5%93%81%E5%BA%93%E5%AD%98%E5%88%86%E6%9E%90%20-%20erp321com.meta.js
// ==/UserScript==

window.onload=function(){
    if (confirm("本脚本3s将自动执行库存导出？\n\n 请确认!")==true){
      //自动点击元素
      setTimeout(function(){
            document.getElementById('qty1').value='1';
            document.getElementById('is_exclude_0_qty').checked=true;
            document.getElementById('iidTab').click();
            document.querySelectorAll('.btn_search')[0].click();
            },3000);
           //自动点击元素
      setTimeout(function(){
          Export(this);
           // window.open("http://www.baidu.com") //后续用来调用jenkins执行导入任务
            },40000);
          }
    else{
        alert("脚本已取消!");
       }
}