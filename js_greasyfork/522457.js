// ==UserScript==
// @name jkcss2025
// @namespace franciszhao
// @version 0.0.1.20250101045041
// @description jkcss累积
// @author Francis Zhao <francis@n2o.io>
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/522457/jkcss2025.user.js
// @updateURL https://update.greasyfork.org/scripts/522457/jkcss2025.meta.js
// ==/UserScript==

(function() {
let css = `/*
flex布局；
简化布局规则：行里面必须是列；列里面必须是行；如果行里面，还要是多行，必须先嵌入一个列；
对齐什么的，只用flex:1进行填充，不用那么多的设置；
基本布局：一列里面多个行：标题栏，导航栏；主体区域；底部栏；
col已存在，不能作为自定义标签,用clm代替
<clm class="full">
   <row-h50 class="row-tbcenter">row-h50标题
     <button class="btn btngreen">
       button 
     </button>
  </row-h50>
     <row-h50 class="row-tbcenter">
      <table>
        <tr><th>标题</th><th>表格</th></tr>
        <tr><td>aaaa</td><td>aaaa</td></tr>
       </table>
  </row-h50>
  <row>
      <clm-wfull>clm-wfull</clm-wfull><clm-wfull>clm-wfull</clm-wfull>
  </row>
   <rowx>
     <clm-w120 class="clm-lrright clm-tbcenter">clm-w120</clm-w120><clm-wfull class="clm-lrcenter clm-tbcenter">clm-wfull</clm-wfull>
  </rowx>
   <row-h80 class="allcenter">row-h80底部</row-h80>
</clm>
======================================================
<row>
   <clm>a</clm><clm>b</clm>
</row>
如果行里面，还要是多行，必须先嵌入一个列；
<row>
   <clm style="flex:1">
      <row>a</row>
      <row>a</row>
   </clm>
</row>
*/

.float-toptool{
  position: fixed;top:0px;left:0px;right:0px;z-index:999;min-height:25px;min-width:25px;background-color:green;
}
.float-bottomtool{/*漂浮在上层的工具栏，底层最好留一个不小于它的空白块，以免看不到底层的全部内容；*/
  position: fixed;bottom:0px;left:0px;right:0px;z-index:999;min-height:25px;min-width:25px;background-color:green;
  /*fixed相对于浏览器可见区域；absolute相对浏览器整个页面*/
}
.float-lefttool{
  position: fixed;left:0px;top:45%;z-index:999;min-height:25px;min-width:25px;background-color:green;
  /*始终左侧，上下居中 精确要配合js计算*/
}
/*
 
*/
 
.btngreen{background-color:#4CAF50;color:white;} /* 绿色 */
.btnblue{background-color: #008CBA;color:white;} /* 蓝色 */
.btngray {background-color: #f7f7f7; color: black;} /* 灰色 */
.btnorange {background-color: #f47c3c; color:white;} /* 橙色 */

 .pd10{padding:5px;}
 
 .font1{font-family:Times New Roman,Times,serif;font-size:0.9em;font-weight:normal;}
 .font2{font-family:Times New Roman,Times,serif;font-size:1.1em;font-weight:bold;}
 
/*细线表格*/
table,th,td{
border:1px solid orange;
border-collapse:collapse;
}
*{border:1px solid red;margin:3px;}
full,.full{ /*全屏*/
    border:1px solid green; z-index: 0;
    position: absolute;left:5px;top:5px;right:5px;bottom:5px;
    background: rgb(247,247,247)/*rgba(255,255,255,0.1);*/
    margin: 10px;
    border-radius: 5px;
}
.basewhite{background-color:rgb(255,255,255)}
.basegray{background-color:rgb(247,247,247)}
.baseblock{
   background-color:rgb(255,255,255);
   border-radius: 10px;
   margin: 8px;
   padding: 15px;    
}
button1{flex:1; display:flex;flex-direction:row;align-items:center;justify-content:center;}
.btn {
    padding: 10px 20px;
    font-size: 14px;
    margin: 3px 10px;
  border: 1;
  background-color: #007BFF;
  color: white;
  cursor: pointer;
  outline: none;
  text-align: center;    text-decoration: none;
  border-radius:5px;
 display:flex;flex-direction:row;align-items:center;justify-content:center;
}
.btn:active {
  transform: translateY(2px);
}
.btgreen{background-color:#4CAF50;color:white;} /* 绿色 */
.btnblue {background-color: #008CBA;color:white;} /* 蓝色 */
.btngray {background-color: #f7f7f7; color: black;} /* 灰色 */
.btnorange {background-color: #f47c3c; color:white;} /* 橙色 */

 .pd10{padding:5px;}
/*多个名称，便于分类,增加属性定义,row,clm,ms,me,mc,ss,se,sc,sf*/
row,rowa,rowb,rowc,.row,.rowa,.rowb,.rowc{display:flex;flex-direction:row;justify-content:flex-start;align-items:stretch;}
row1{display:flex;flex-direction:row;justify-content:flex-start;align-items:stretch;flex:1}
clm,clma,clmb,clmc,.clm,.clma,.clmb,.clmc{display:flex;flex-direction:column;justify-content: flex-start;align-items:stretch;flex-shrink:0;}
clm1{display:flex;flex-direction:column;justify-content: flex-start;align-items:stretch;flex-shrink:0;flex:1}

.mainstart,.ms,.msa,.msb{justify-content:flex-start;}
.main-end,.me,.mea,.meb{justify-content:flex-end;}
.main-center,.mc,.mca,.mcb{justify-content:center;}
.main-full-invalid{flex:1}
.flex1{flex:1}
.flex2{flex:2}
.second-start,.ss,.ssa,.ssb{align-items:flex-start;}
.second-end,.se,.sea,.seb{align-items:flex-end;}
.second-center,.sc,.sca,.scb{align-items:center;}
.second-full,.sf,.sfa,.sfb{align-items:stretch;}

.h50{height:50px;}
.h80{height:80px;}
.h120{height:120px;}
.w50{width:50px;}
.w80{width:80px;}
.w120{width:120px;}
.ha{height:50px;}
.hb{height:50px;}
.wa{width:50px;}
.wb{width:50px;}

.fonta{}
.fontb{font-family: "Times New Roman", Times, serif;font-weight:bold;}
.corners1 {
  border-radius: 25px;
  background: #73AD21;
}
.corners2 {
  border-radius: 25px;
  border: 2px solid #73AD21;
}
 
line{height:1px;background-color:rgb(245,245,245);margin:0px 10px;}
grayline{height:1px;background-color:rgb(235,235,235);margin:0px 10px;}
whiteline{height:1px;background-color:white;margin:0px 10px;}
redline{height:1px;background-color:red;margin:0px 10px;}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
