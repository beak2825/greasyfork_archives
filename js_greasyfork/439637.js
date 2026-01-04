// ==UserScript==
// @name jkStyle
// @namespace franciszhao
// @version 0.0.1.20240905025010
// @description jkStyle累积
// @author Francis Zhao <francis@n2o.io>
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/439637/jkStyle.user.js
// @updateURL https://update.greasyfork.org/scripts/439637/jkStyle.meta.js
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
/*
h=>height
w=>width
row-h50,row-height50
clm-w50,clm-width50
flex:1;会影响width或height的设置
rowx==>row-hfull
clmx==>clm-wfull
*/
row{display:flex;flex-direction:row;justify-content:flex-start;align-items:stretch;}
rowx{flex:1;display:flex;flex-direction:row;justify-content:flex-start;align-items:stretch;}
row-h50,rowx-h50{height:50px;display:flex;flex-direction:row;justify-content:flex-start;align-items:stretch;}
row-h80,rowx-h80{height:80px;display:flex;flex-direction:row;justify-content:flex-start;align-items:stretch;}
row-h120,rowx-h120{height:80px;display:flex;flex-direction:row;justify-content:flex-start;align-items:stretch;}
row-hfull,rowx-hfull{flex:1;display:flex;flex-direction:row;justify-content:flex-start;align-items:stretch;}
row-hauto,rowx-hauto{display:flex;flex-direction:row;justify-content:flex-start;align-items:stretch;}
//clm需要高度确定，flex:1才能起作用；
clm100{height:100%;display:flex;flex-direction:column;justify-content: flex-start;align-items:stretch;flex-shrink:0;}
clm{display:flex;flex-direction:column;justify-content: flex-start;align-items:stretch;flex-shrink:0;}
clmx{flex:1;display:flex;flex-direction:column;justify-content: flex-start;align-items:stretch;}
clm-w50,clmx-w50{width:50px;display:flex;flex-direction:column;justify-content: flex-start;align-items:stretch;}
clm-w80,clmx-w80{width:80px;display:flex;flex-direction:column;justify-content: flex-start;align-items:stretch;}
clm-w120,clmx-w120{width:120px;display:flex;flex-direction:column;justify-content: flex-start;align-items:stretch;}
clm-wfull,clmx-wfull{flex:1;display:flex;flex-direction:column;justify-content: flex-start;align-items:stretch;}
clm-wauto,clmx-wauto{display:flex;flex-direction:column;justify-content: flex-start;align-items:stretch;}

line{height:1px;background-color:rgb(245,245,245);margin:0px 10px;}
grayline{height:1px;background-color:rgb(235,235,235);margin:0px 10px;}
whiteline{height:1px;background-color:white;margin:0px 10px;}
redline{height:1px;background-color:red;margin:0px 10px;}

.hfull,.wfull{flex:1;}
.h30{height:30px;}
.h50{height:50px;}
.h80{height:80px;}
.h120{height:120px;}

 /*上下左右居中*/
.allcenter{ display:flex;flex-direction:row;align-items:center;justify-content:center;}
/*当前为clm,设置内部文字的对齐*/
.clm-tbtop{display:flex;flex-direction:column;justify-content: flex-start;}
.clm-tbbottom{display:flex;flex-direction:column;justify-content:flex-end;}
.clm-tbcenter{ display:flex;flex-direction:column;justify-content: center;}
.clm-tbavg,.clm-tbstretch{display:flex;flex-direction:column;justify-content: space-evenly;}
.clm-lrleft{ display:flex;flex-direction:column;align-items:flex-start;}
.clm-lrright{display:flex;flex-direction:column;align-items:flex-end;}
.clm-lrcenter{display:flex;flex-direction:column;align-items:center;}
.clm-lrstretch{display:flex;flex-direction:column;align-items:stretch;}

/*当前为row,设置内部文字的对齐*/
.row-lrleft{ display:flex;flex-direction:row;justify-content:flex-start;}
.row-lrcenter{display:flex;flex-direction:row;justify-content:center;}
.row-lrright{display:flex;flex-direction:row;justify-content:flex-end;}
.row-lravg,.row-lrstretch{display:flex;flex-direction:row;justify-content: space-evenly;}
.row-tbtop{ display:flex;flex-direction:row;align-items:flex-start;}
.row-tbcenter{display:flex;flex-direction:row;align-items:center;}
.row-tbbottom{display:flex;flex-direction:row;align-items:flex-end;}
.row-tbstretch{display:flex;flex-direction:row;align-items:stretch;}

body{padding:20px;}

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
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
