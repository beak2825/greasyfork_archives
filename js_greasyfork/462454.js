// ==UserScript==
// @name         北大馆藏目录增强工具箱 (SirsiDynix e-Library PowerKit @PKUL)
// @namespace    http://www.lib.pku.edu.cn
// @version      1.1.23Q1.0324
// @description  北京大学图书馆公共联机目录（OPAC）网页功能增强工具集 (WebCatPK)
// @author       徐清白
// @license      MIT
// @match        http://162.105.138.200/*
// @icon         https://www.lib.pku.edu.cn/portal/sites/default/files/favicon.ico
// @connect      162.105.138.200
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_notification
// @require      https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.core.min.js

// @downloadURL https://update.greasyfork.org/scripts/462454/%E5%8C%97%E5%A4%A7%E9%A6%86%E8%97%8F%E7%9B%AE%E5%BD%95%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E7%AE%B1%20%28SirsiDynix%20e-Library%20PowerKit%20%40PKUL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462454/%E5%8C%97%E5%A4%A7%E9%A6%86%E8%97%8F%E7%9B%AE%E5%BD%95%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E7%AE%B1%20%28SirsiDynix%20e-Library%20PowerKit%20%40PKUL%29.meta.js
// ==/UserScript==
// 准备附加 CSS
var styles = "@charset utf-8;";


// 通用：总开关
// 凡是需要启动显示的 PowerKit 增强界面，具体添加 .powerkit_block/inline/table-cell 类之一
// 凡是需要启动 PK 后隐藏的原生界面，具体添加 .powerkit_original_block/inline/table-cell 类之一
styles += ".powerkit_block { display: block; } ";                // 用于 div p ul ol li dl dd dt form hr h1...h6 等
styles += ".powerkit_inline { display: inline; } ";              // 用于 span a label input textarea select em strong 等
styles += ".powerkit_inline-block { display: inline-block; } ";  // 用于 img input button 等
styles += ".powerkit_table { display: table; } ";                // 用于 table
styles += ".powerkit_table-row { display: table-row; } ";        // 用于 tr
styles += ".powerkit_table-cell { display: table-cell; } ";      // 用于 th td
styles += ".powerkit_original_block, .powerkit_original_inline, .powerkit_original_inline-block, .powerkit_original_table, .powerkit_original_table-row, .powerkit_original_table-cell { display: none; } ";
// 控制 PowerKit 增强界面显示
// 关闭显示：上级容器添加 .powerkit_OFF
// 重新显示：上级容器去掉 .powerkit_OFF
// 上级容器通常是 document.body 但也可以是其他局部的上级容器
styles += ".powerkit_OFF .powerkit_block { display: none!important; } ";
styles += ".powerkit_OFF .powerkit_inline { display: none!important; } ";
styles += ".powerkit_OFF .powerkit_inline-block { display: none!important; } ";
styles += ".powerkit_OFF .powerkit_table { display: none!important; } ";
styles += ".powerkit_OFF .powerkit_table-row { display: none!important; } ";
styles += ".powerkit_OFF .powerkit_table-cell { display: none!important; } ";
styles += ".powerkit_OFF .powerkit_original_block { display: block; } ";
styles += ".powerkit_OFF .powerkit_original_inline { display: inline; } ";
styles += ".powerkit_OFF .powerkit_original_inline-block { display: inline-block; } ";
styles += ".powerkit_OFF .powerkit_original_table { display: table-cell; } ";
styles += ".powerkit_OFF .powerkit_original_table-row { display: table-row; } ";
styles += ".powerkit_OFF .powerkit_original_table-cell { display: table-cell; } ";

// 通用：局部样式
styles += ".hiddenData { display: none; }";
styles += ".redBold { color: red; font-weight: bold; }";
styles += ".powerkit_bold { font-weight: bold; }";
styles += ".powerkit_green { color: green; }";
styles += ".powerkit_darkgoldenrod { color: darkgoldenrod; }";
styles += ".powerkit_darkred { color: darkred; }";
styles += ".powerkit_OFF .powerkit_bold { font-weight: unset; }";
styles += ".powerkit_OFF .powerkit_green, .powerkit_OFF .powerkit_darkgoldenrod, .powerkit_OFF .powerkit_darkred { color: unset; }";

// 页面招牌：追加的小标题
styles += "div.branding > span { font-size: 16pt; font-family: Georgia, Arial; color: black; }";

// 右栏面板：清空油猴设置按钮
styles += "#ulPowerKit > li > button.powerkit_original_block { border: 1px solid black; border-radius: 4px; margin-left: 18px; }";
styles += "#ulPowerKit > li > button.powerkit_original_block:hover { background: red; color: yellow; }";
// 右栏面板：window.scroll 触发检测增减这个类
styles += ".floatingRightPanel { position: fixed; z-index: 500; top: 0px; }";
styles += ".pct25 .floatingRightPanel { width: calc(25% - 28px); }";
styles += ".pct50 .floatingRightPanel { width: calc(50% - 28px); }";
// 右栏面板：无序列表
styles += "#ulPowerKit { padding-left: 4px; }";
styles += "#ulPowerKit > li { list-style: none; }";
styles += "#ulPowerKit > li input[type='checkbox'] { vertical-align: sub; }";
// 右栏面板：有序列表
// 原生 CSS 写成 ul li 中间缺了 > 所以把 ol > li 也整成无序的了，在此修正
styles += "#ulPowerKit ol > li { list-style-type: unset; }";
// 二级 ol 改为小写拉丁字母编号
styles += "#ulPowerKit ol ol > li { list-style-type: lower-latin; }";

// 右栏面板：帮助信息
// Sirsi 原生 CSS“花式隐藏”了 h4 起各级标题的显示，在此 unset 或指定新值来显示并使用
styles += "#liManPK h4 { width: unset; height: unset; text-indent: 2em; font-size: larger; }";
styles += "#liManPK h5, #liManPK h6 { width: unset; height: unset; text-indent: unset; font-size: unset; }";

// 卡片页增强：中栏馆藏列表限高
styles += "#detail_item_information > ul:nth-child(5) { overflow-y: auto; max-height: 960px; } ";
styles += ".powerkit_OFF #detail_item_information > ul:nth-child(5) { overflow-y: unset; max-height: unset; } ";

// 卡片页增强：右栏“相关类别”限高
// 受限于父选择器，采用 jQuery 动态添加
styles += ".maxHeightLimited196 { max-height: 196px; overflow: auto; } ";
styles += ".powerkit_OFF .maxHeightLimited196 { max-height: unset; overflow: unset; } ";

// 卡片页增强：左栏
styles += "div.item_details ul.itemservices hr { width: 65%; margin-left: 0; }";
styles += "div.item_details ul.itemservices pre { display: none; overflow: auto; height: 160px; width: 90%; border: 1px dotted black; font-size: 9pt; font-family: 'Microsoft Yahei', 'Arial'; padding: 4px; }";

// 卡片页增强：右栏面板：临时索书清单
styles += "#liCallSlips.empty { display: none; }"; // 索书清单非空时 remove，清空时 add
styles += "#liCallSlips h4 { width: unset; height: unset; text-indent: unset; font-size: medium; margin: 4px 2px 4px; }";
styles += "#liCallSlips > span > button { margin-left: 2px; cursor: pointer; }";
styles += "#liCallSlips table { table-layout: fixed; }";
styles += "#liCallSlips th { font-size: larger; }";
styles += "#liCallSlips th:nth-child(1) { width: 5%; max-width: 10px; }";
styles += "#liCallSlips th:nth-child(2) { width: 37%; max-width: 76px; }";
styles += "#liCallSlips th:nth-child(3) { width: 33%; max-width: 66px; }";
styles += "#liCallSlips th:nth-child(4) { width: 25%; max-width: 50px; }";
styles += "#liCallSlips th:nth-child(5) { display: none; }";
styles += "#liCallSlips td { overflow: hidden; word-break: keep-all; white-space: nowrap; padding: 1px;}";
styles += "#liCallSlips td button { margin: 1px; padding: 1px 5px; border-radius: 10px; border: 1px solid gray; font-size: small; background-color: white; color: red; cursor: pointer; }";
styles += "#liCallSlips td button:hover { border-color: darkred; background-color: darkred; color: white; }";
styles += "#liCallSlips tr:nth-child(odd) td { background-color: rgb(240,240,240)}";
styles += "#liCallSlips tr:nth-child(even) td { background-color: rgb(208,208,208)}";
styles += "#liCallSlips tr td:nth-child(1) { background-color: white; }";
styles += "#liCallSlips tr td:nth-child(3) { color: darkgreen; }";
// 卡片页增强：馆藏表格：抄录索书单
styles += "button.butAddCallSlip { margin: 1px 0 0 1px; padding: 1px 3px; border-radius: 10px; border: 0; font-size: smaller; background-color: rgb(0,175,57); color: white; cursor: pointer; }";
styles += "button.butAddCallSlip:hover { background-color: rgb(30,139,195); }";

// 检索结果增强
styles += "div.kept_options input[type='radio'] { vertical-align: sub; }";
styles += "li.hit_list_buttons { text-indent: 10px; }";
styles += "li.hit_list_buttons button{ letter-spacing: 4px; padding-left: 4px; }";
styles += "#spanVoptRadio { margin-bottom: 10px; }";
styles += "#spanVoptRadio > li { margin-bottom: 6px; }";
styles += "#spanVoptRadio > li label { color: blue; }";

// 题名级馆藏报表增强
styles += "#divMarkedRecords li { list-style: none; font-size: 14px; }";
styles += "#divMarkedRecords li a { font-weight: bold; }";
styles += "#liTabs input { display: none; }";
styles += "#liTabs strong { color: #3662e0; cursor: pointer; padding: 0 8px 0 0; }";
styles += "#liTabs input:checked +strong { color: unset; }";
styles += "#libraryFilter { width: 108px; margin-left: 4px!important; } ";
styles += "#liOrigText > pre { overflow: auto; height: 240px; min-width: 384px; width: 100%; border: 1px dotted black; font-size: 9pt; font-family: 'Microsoft Yahei', 'Arial'; }";
styles += "#liExtractedTable table { font-size: smaller; } ";
styles += "#liExtractedTable tr:nth-child(even) { background: lightgray; } ";
styles += "#liExtractedTable th, #liExtractedTable td { border: 1px solid gray; text-align: center; padding: 2px; } ";
styles += "#liExtractedTable table td a { font-weight: normal!important; } ";
styles += "#liExtractedTable > div { padding: 0; text-align: right; } ";
styles += "#liExtractedTable > div > button { cursor: pointer; margin: 2px 0; } ";
styles += "#butAddNewTable { color: green; } ";
styles += "#liExtractedTable > div li strong { cursor: pointer; } ";
styles += "#olSavedTables { display: block; padding: 0; } ";
styles += "#olSavedTables li { display: inline; font-size: 9px; background: white; white-space: nowrap; padding: 2px 8px 2px 0; } ";
styles += "#olSavedTables li.savedTag:hover { background: lightyellow; } ";
styles += "#olSavedTables li.savedTag.clickedTag { background: lightyellow; } ";
styles += "#olSavedTables li > button { color: red; border: 0; border-radius: 12px; padding: 0 4px; cursor: pointer; } ";
styles += "#olSavedTables li > button:hover { color: white; background: darkred; border-color: darkred; } ";
styles += "#olSavedTables > button { color: red; margin: 0 4px 0; cursor: pointer; } ";
styles += "#olSavedTables > button:hover { color: white; background: darkred; border-color: darkred; } ";
styles += "#recalledTable { padding: 4px; border-radius: 8px; border: 1px dotted gray; background: lightyellow; margin-bottom: 8px; text-align: left; } ";
styles += "#recalledTable h3 > strong { position: absolute; right: 19px; cursor: pointer; border: 2px gray solid; background: white; color: gray; padding: 0 3px 1px; } ";
styles += "#recalledTable h3 > strong:hover { background: darkred; border-color: darkred; color: white; } ";
styles += "#recalledTable span { margin-right: 1em; } ";
styles += "#recalledTable button { margin: 0 4px; cursor: pointer; } ";
styles += "#recalledTable > table { display: block; max-height: 640px; overflow: auto; margin-top: 4px; text-align: center; } ";
styles += "#recalledTable tr:nth-child(odd) { background: white; } ";
styles += "#recalledTable tr:nth-child(even) { background: unset; } ";

// 读者服务增强：借出列表
styles += ".charges_utils { position: absolute; right: 16px; font-weight: normal; } ";
styles += ".charges_utils a { font-weight: bold; } ";
styles += "td.powerkit_recent-due { color: saddlebrown; } ";               // 高亮：最近到期
styles += "td.powerkit_status-caution { background-color: lightcoral; } "; // 高亮：状态异常/催还
styles += ".powerkit_OFF td.powerkit_recent-due { color: unset; } ";                 // 关闭高亮
styles += ".powerkit_OFF td.powerkit_status-caution { background-color: unset; } ";  // 关闭高亮
styles += ".renew_utils a { padding-right; 16px; font-weight: bold; } ";
styles += ".renew_utils label { font-weight: bold; } ";
styles += ".renew_utils input[type='checkbox'] { vertical-align: sub; }";

// 索书号检索增强：浏览列表高亮命中
styles += "ul.hit_list .powerkit_highlightedRow { background-color: lightblue; background-image: none; } "; // 取消原背景图片，改为背景色
styles += ".powerkit_OFF ul.hit_list .powerkit_highlightedRow { background-image: url(/Css/default/images/summary_column.jpg); } ";
styles += "ul.hit_list .powerkit_highlightedKeywords { color: darkviolet; background-color: lightgreen; }";
styles += ".powerkit_OFF ul.hit_list .powerkit_highlightedKeywords { color: unset; background-color: unset; }";

// 索书号检索增强：中图法浏览
styles += "#divCLCBrowser { font-family: 'Microsoft Yahei', 'Arial'; } ";
styles += "#divCLCBrowser .content { overflow: hidden; } ";
styles += "#ulCLCTree { overflow-y: scroll; overflow-x: hidden; height: 508px; padding: 0; margin: 2px 0; cursor: pointer; } ";
styles += "#ulCLCTree ul { padding: 0; margin: 0; background-color: #ffffff; } ";
styles += "#ulCLCTree li { list-style-type: none; display: inline-block; padding: 0 0; margin: 0; width: 100%; min-width: 300px; } ";
styles += "#ulCLCTree .CLCTreeLevel_0_ > button { display: none; } ";   // 根节点隐藏
styles += "#ulCLCTree .CLCTreeLevel_0_ > .CLCNode { display: none; } "; // 根节点隐藏
styles += "#ulCLCTree .CLCTreeLevel_1_ > .CLCNode > .CLCNodeTag { margin-left: 4px; } ";
styles += "#ulCLCTree .CLCTreeLevel_2_ > .CLCNode > .CLCNodeTag { margin-left: 16px; } ";
styles += "#ulCLCTree .CLCTreeLevel_3_ > .CLCNode > .CLCNodeTag { margin-left: 28px; } ";
styles += "#ulCLCTree .CLCTreeLevel_4_ > .CLCNode > .CLCNodeTag { margin-left: 40px; } ";
styles += "#ulCLCTree .CLCNode { display: inline-block; white-space: nowrap; padding: 3px 0; width: calc(100% - 16px); cursor: pointer; } ";
styles += "#ulCLCTree .CLCNode:hover { background-color: #d0dff8; } ";
styles += "#ulCLCTree .routerNode { font-weight: bold; } ";
styles += "#ulCLCTree .clickedNode { font-weight: bold; background-color: #d0f8df; } ";
styles += "#ulCLCTree .hitNode { font-weight: bold; background-color: yellow; } ";
styles += "#ulCLCTree .CLCNodeTag { vertical-align: top; color: royalblue; font-family: Consolas; font-size: 14px; } ";
styles += "#ulCLCTree .CLCNodeName { color: green; margin-left: 4px; white-space: normal; display: inline-block; vertical-align: top; } ";
styles += "#ulCLCTree li > button { display: inline-block; width: 16px; margin: 4px 0 0 0; padding: 0; border-radius: 4px; border: 0; font-weight: bold; font-size: smaller; vertical-align: top; background-color: rgb(0,175,57); color: yellow; cursor: pointer; } ";
styles += "#ulCLCTree li > button:hover { background-color: rgb(30,139,195); }";
// 收起全部类目按钮
styles += "#divCLCBrowser .divCloseAllLines { display: none; width: 14px; text-align: center; font-size: 12px; position: absolute; right: 12px; bottom: 72px; z-index: 100; background-color: #d0f8df; color: green; } ";
styles += "#divCLCBrowser .divCloseAllLines:hover { background-color: #d0dff8; font-weight: bold; } ";
// 限定控件：第一行
styles += ".ulCLCFilters, .ulCLCFilters form { margin: 0; padding: 0; font-size: 14px; } ";
styles += ".ulCLCFilters li { list-style-type: none; min-width: 316px; } ";
styles += ".ulCLCFilters .liCLCSearchData input { width: 152px; letter-spacing: 1.5px; border: 2px black solid; background-color: #d0f8df; color: blue; padding: 3px 4px; font-weight: bold; font-family: Consolas, 'Microsoft Yahei'; } ";
styles += ".ulCLCFilters .liCLCSearchData input:focus { background-color: #d0dff8; } ";
styles += ".ulCLCFilters .liCLCSearchData button { font-weight: bold; margin: 0 4px 0 0; padding: 4px 8px; border: 0; border-radius: 4px; background-color: rgb(0,175,57); } ";
styles += ".ulCLCFilters .liCLCSearchData button:hover { background-color: rgb(30,139,195); } ";
styles += ".ulCLCFilters .liCLCSearchData #butSearchItemsByTag { cursor: pointer; color: yellow; }";
styles += ".ulCLCFilters .liCLCSearchData #butSearchTagsByName { cursor: help; color: white; }";
// 限定控件：类名搜索
styles += ".ulCLCFilters .liCLCSearchData ul { display: none; width: calc(100% - 38px); min-width: 280px; margin: 0; padding: 0; position: absolute; top: 66px; left: 10px; z-index: 100; border: 1px green solid; max-height: 200px; overflow-x: hidden; overflow-y: auto; white-space: nowrap;  font-size: 12px; } ";
styles += ".ulCLCFilters .liCLCSearchData ul li { margin: 0; padding: 2px 4px; width: 100%; background-color: #d0f8df; cursor: pointer; } ";
styles += ".ulCLCFilters .liCLCSearchData ul li:hover { background-color: lightgray; } ";
styles += ".ulCLCFilters .liCLCSearchData ul li > strong.CLCHitTag { color: blue; cursor: pointer; font-family: Consolas; } ";
styles += ".ulCLCFilters .liCLCSearchData ul li > strong.CLCNoHitTag { color: red; cursor: pointer; width: 100%; display: inline-block; text-align: center; } ";
styles += ".ulCLCFilters .liCLCSearchData ul li > label { color: green; padding-left: 4px; cursor: pointer; } ";
styles += ".ulCLCFilters .liCLCSearchData ul li > label > strong { background-color: yellow; } ";
styles += ".CLCTagHitList_ToClose { background-color: red!important; cursor: pointer!important; } ";
// 限定控件：第二行
styles += ".ulCLCFilters .liCLCLangRadios { padding-left: 40px; padding-left: 98px; color: darkgreen; } ";
styles += ".ulCLCFilters input[type=radio] { display: none; } ";
styles += ".ulCLCFilters input[type=radio] +strong { color: green; margin: 2px 0; padding: 2px 3.2px; border: 2px #d0dff8 solid; background-color: #d0dff8; cursor: pointer; } ";
styles += ".ulCLCFilters input[type=radio]:checked +strong { border: 2px green solid; } ";
styles += "#formCLCBrowser { visibility: hidden; display: none; } ";

// 索书号检索增强：结果浏览左上复刻检索框
styles += ".left_column td.call_number_search li { display: inline; float: unset; } ";
styles += ".left_column td.call_number_search li label { display: inline; float: unset; } ";
styles += ".left_column td.call_number_search li input:text { display: inline; width: 120px!important; } ";
styles += ".left_column td.call_number_search li select { display: inline; } ";
styles += ".left_column td.call_number_search li select#class { width: 160px; } ";
styles += ".left_column td.call_number_search li select#library { width: 160px; } ";
styles += ".left_column td.call_number_search li .button[type=submit] { margin-left: 45px!important; }";
styles += ".left_column td.call_number_search li .button { display: inline-block; width: 64px; letter-spacing: 4px; } ";
styles += ".left_column td.call_number_search li label[for='item_type'] { margin-left: 82px; } ";
styles += ".left_column td.call_number_search li select#item_type { width: 160px; } ";
styles += ".left_column td.call_number_search li select#location { width: 136px; } ";

GM_addStyle(styles); // 油猴脚本附加 CSS


//【开始】JSON HPack 数据压缩工具
// - 压缩：hpacked  = JSON.hpack(original_json)
// - 还原：original = JSON.hunpack(hpacked_json)
/** json.hpack
 * @description JSON Homogeneous Collection Packer
 * @version     1.0.1
 * @author      Andrea Giammarchi
 * @license     Mit Style License
 * @project     http://github.com/WebReflection/json.hpack/tree/master
 * @blog        http://webreflection.blogspot.com/
 */(function(cache){(this.JSON||(JSON={})).hpack=function(collection,compression){if(3<compression){var i=JSON.hbest(collection),result=cache[i];cache=[]}else{var indexOf=Array.prototype.indexOf||function(v){for(var l=this.length,i=0;i<l;++i){if(this[i]===v){return i}}return -1},header=[],result=[header],first=collection[0],index=0,k=0,len;for(var key in first){header[index++]=key}len=index;index=0;for(var length=collection.length,i=0;i<length;++i){for(var item=collection[i],row=[],j=0;j<len;++j){row[j]=item[header[j]]}result[++index]=row}++index;if(0<compression){for(row=result[1],j=0;j<len;++j){if(typeof row[j]!="number"){header[j]=[header[j],first=[]];first.indexOf=indexOf;for(i=1;i<index;++i){var value=result[i][j],l=first.indexOf(value);result[i][j]=l<0?first.push(value)-1:l}}}}if(2<compression){for(j=0;j<len;++j){if(header[j] instanceof Array){for(row=header[j][1],value=[],first=[],k=0,i=1;i<index;++i){value[k]=row[first[k]=result[i][j]];++k}if(JSON.stringify(value).length<JSON.stringify(first.concat(row)).length){for(k=0,i=1;i<index;++i){result[i][j]=value[k];++k}header[j]=header[j][0]}}}}else{if(1<compression){length-=Math.floor(length/2);for(j=0;j<len;++j){if(header[j] instanceof Array){if(length<(first=header[j][1]).length){for(i=1;i<index;++i){var value=result[i][j];result[i][j]=first[value]}header[j]=header[j][0]}}}}}if(0<compression){for(j=0;j<len;++j){if(header[j] instanceof Array){header.splice(j,1,header[j][0],header[j][1]);++len;++j}}}}return result};JSON.hunpack=function(collection){for(var result=[],keys=[],header=collection[0],len=header.length,length=collection.length,index=-1,k=-1,i=0,l=0,j,row;i<len;++i){keys[++k]=header[i];if(typeof header[i+1]=="object"){++i;for(j=1;j<length;++j){row=collection[j];row[l]=header[i][row[l]]}}++l}for(i=0,len=keys.length;i<len;++i){keys[i]='o["'.concat(keys[i].replace('"',"\\x22"),'"]=a[',i,"];")}var anonymous=Function("o,a",keys.join("")+"return o;");for(j=1;j<length;++j){result[++index]=anonymous({},collection[j])}return result};JSON.hclone=function(collection){for(var clone=[],i=0,length=collection.length;i<length;++i){clone[i]=collection[i].slice(0)}return clone};JSON.hbest=function(collection){for(var i=0,j=0,len=0,length=0;i<4;++i){cache[i]=JSON.hpack(collection,i);len=JSON.stringify(cache[i]).length;if(length===0){length=len}else{if(len<length){length=len;j=i}}}return j}})([]);
//【结束】JSON HPack 数据压缩工具


//【开始】jQuery v1.4.4
/*!
 * jQuery JavaScript Library v1.4.4
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Nov 11 19:04:53 2010 -0500
 */
(function(E,B){function ka(a,b,d){if(d===B&&a.nodeType===1){d=a.getAttribute("data-"+b);if(typeof d==="string"){try{d=d==="true"?true:d==="false"?false:d==="null"?null:!c.isNaN(d)?parseFloat(d):Ja.test(d)?c.parseJSON(d):d}catch(e){}c.data(a,b,d)}else d=B}return d}function U(){return false}function ca(){return true}function la(a,b,d){d[0].type=a;return c.event.handle.apply(b,d)}function Ka(a){var b,d,e,f,h,l,k,o,x,r,A,C=[];f=[];h=c.data(this,this.nodeType?"events":"__events__");if(typeof h==="function")h=
h.events;if(!(a.liveFired===this||!h||!h.live||a.button&&a.type==="click")){if(a.namespace)A=RegExp("(^|\\.)"+a.namespace.split(".").join("\\.(?:.*\\.)?")+"(\\.|$)");a.liveFired=this;var J=h.live.slice(0);for(k=0;k<J.length;k++){h=J[k];h.origType.replace(X,"")===a.type?f.push(h.selector):J.splice(k--,1)}f=c(a.target).closest(f,a.currentTarget);o=0;for(x=f.length;o<x;o++){r=f[o];for(k=0;k<J.length;k++){h=J[k];if(r.selector===h.selector&&(!A||A.test(h.namespace))){l=r.elem;e=null;if(h.preType==="mouseenter"||
h.preType==="mouseleave"){a.type=h.preType;e=c(a.relatedTarget).closest(h.selector)[0]}if(!e||e!==l)C.push({elem:l,handleObj:h,level:r.level})}}}o=0;for(x=C.length;o<x;o++){f=C[o];if(d&&f.level>d)break;a.currentTarget=f.elem;a.data=f.handleObj.data;a.handleObj=f.handleObj;A=f.handleObj.origHandler.apply(f.elem,arguments);if(A===false||a.isPropagationStopped()){d=f.level;if(A===false)b=false;if(a.isImmediatePropagationStopped())break}}return b}}function Y(a,b){return(a&&a!=="*"?a+".":"")+b.replace(La,
"`").replace(Ma,"&")}function ma(a,b,d){if(c.isFunction(b))return c.grep(a,function(f,h){return!!b.call(f,h,f)===d});else if(b.nodeType)return c.grep(a,function(f){return f===b===d});else if(typeof b==="string"){var e=c.grep(a,function(f){return f.nodeType===1});if(Na.test(b))return c.filter(b,e,!d);else b=c.filter(b,e)}return c.grep(a,function(f){return c.inArray(f,b)>=0===d})}function na(a,b){var d=0;b.each(function(){if(this.nodeName===(a[d]&&a[d].nodeName)){var e=c.data(a[d++]),f=c.data(this,
e);if(e=e&&e.events){delete f.handle;f.events={};for(var h in e)for(var l in e[h])c.event.add(this,h,e[h][l],e[h][l].data)}}})}function Oa(a,b){b.src?c.ajax({url:b.src,async:false,dataType:"script"}):c.globalEval(b.text||b.textContent||b.innerHTML||"");b.parentNode&&b.parentNode.removeChild(b)}function oa(a,b,d){var e=b==="width"?a.offsetWidth:a.offsetHeight;if(d==="border")return e;c.each(b==="width"?Pa:Qa,function(){d||(e-=parseFloat(c.css(a,"padding"+this))||0);if(d==="margin")e+=parseFloat(c.css(a,
"margin"+this))||0;else e-=parseFloat(c.css(a,"border"+this+"Width"))||0});return e}function da(a,b,d,e){if(c.isArray(b)&&b.length)c.each(b,function(f,h){d||Ra.test(a)?e(a,h):da(a+"["+(typeof h==="object"||c.isArray(h)?f:"")+"]",h,d,e)});else if(!d&&b!=null&&typeof b==="object")c.isEmptyObject(b)?e(a,""):c.each(b,function(f,h){da(a+"["+f+"]",h,d,e)});else e(a,b)}function S(a,b){var d={};c.each(pa.concat.apply([],pa.slice(0,b)),function(){d[this]=a});return d}function qa(a){if(!ea[a]){var b=c("<"+
a+">").appendTo("body"),d=b.css("display");b.remove();if(d==="none"||d==="")d="block";ea[a]=d}return ea[a]}function fa(a){return c.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:false}var t=E.document,c=function(){function a(){if(!b.isReady){try{t.documentElement.doScroll("left")}catch(j){setTimeout(a,1);return}b.ready()}}var b=function(j,s){return new b.fn.init(j,s)},d=E.jQuery,e=E.$,f,h=/^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,l=/\S/,k=/^\s+/,o=/\s+$/,x=/\W/,r=/\d/,A=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,
C=/^[\],:{}\s]*$/,J=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,w=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,I=/(?:^|:|,)(?:\s*\[)+/g,L=/(webkit)[ \/]([\w.]+)/,g=/(opera)(?:.*version)?[ \/]([\w.]+)/,i=/(msie) ([\w.]+)/,n=/(mozilla)(?:.*? rv:([\w.]+))?/,m=navigator.userAgent,p=false,q=[],u,y=Object.prototype.toString,F=Object.prototype.hasOwnProperty,M=Array.prototype.push,N=Array.prototype.slice,O=String.prototype.trim,D=Array.prototype.indexOf,R={};b.fn=b.prototype={init:function(j,
s){var v,z,H;if(!j)return this;if(j.nodeType){this.context=this[0]=j;this.length=1;return this}if(j==="body"&&!s&&t.body){this.context=t;this[0]=t.body;this.selector="body";this.length=1;return this}if(typeof j==="string")if((v=h.exec(j))&&(v[1]||!s))if(v[1]){H=s?s.ownerDocument||s:t;if(z=A.exec(j))if(b.isPlainObject(s)){j=[t.createElement(z[1])];b.fn.attr.call(j,s,true)}else j=[H.createElement(z[1])];else{z=b.buildFragment([v[1]],[H]);j=(z.cacheable?z.fragment.cloneNode(true):z.fragment).childNodes}return b.merge(this,
j)}else{if((z=t.getElementById(v[2]))&&z.parentNode){if(z.id!==v[2])return f.find(j);this.length=1;this[0]=z}this.context=t;this.selector=j;return this}else if(!s&&!x.test(j)){this.selector=j;this.context=t;j=t.getElementsByTagName(j);return b.merge(this,j)}else return!s||s.jquery?(s||f).find(j):b(s).find(j);else if(b.isFunction(j))return f.ready(j);if(j.selector!==B){this.selector=j.selector;this.context=j.context}return b.makeArray(j,this)},selector:"",jquery:"1.4.4",length:0,size:function(){return this.length},
toArray:function(){return N.call(this,0)},get:function(j){return j==null?this.toArray():j<0?this.slice(j)[0]:this[j]},pushStack:function(j,s,v){var z=b();b.isArray(j)?M.apply(z,j):b.merge(z,j);z.prevObject=this;z.context=this.context;if(s==="find")z.selector=this.selector+(this.selector?" ":"")+v;else if(s)z.selector=this.selector+"."+s+"("+v+")";return z},each:function(j,s){return b.each(this,j,s)},ready:function(j){b.bindReady();if(b.isReady)j.call(t,b);else q&&q.push(j);return this},eq:function(j){return j===
-1?this.slice(j):this.slice(j,+j+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(N.apply(this,arguments),"slice",N.call(arguments).join(","))},map:function(j){return this.pushStack(b.map(this,function(s,v){return j.call(s,v,s)}))},end:function(){return this.prevObject||b(null)},push:M,sort:[].sort,splice:[].splice};b.fn.init.prototype=b.fn;b.extend=b.fn.extend=function(){var j,s,v,z,H,G=arguments[0]||{},K=1,Q=arguments.length,ga=false;
if(typeof G==="boolean"){ga=G;G=arguments[1]||{};K=2}if(typeof G!=="object"&&!b.isFunction(G))G={};if(Q===K){G=this;--K}for(;K<Q;K++)if((j=arguments[K])!=null)for(s in j){v=G[s];z=j[s];if(G!==z)if(ga&&z&&(b.isPlainObject(z)||(H=b.isArray(z)))){if(H){H=false;v=v&&b.isArray(v)?v:[]}else v=v&&b.isPlainObject(v)?v:{};G[s]=b.extend(ga,v,z)}else if(z!==B)G[s]=z}return G};b.extend({noConflict:function(j){E.$=e;if(j)E.jQuery=d;return b},isReady:false,readyWait:1,ready:function(j){j===true&&b.readyWait--;
if(!b.readyWait||j!==true&&!b.isReady){if(!t.body)return setTimeout(b.ready,1);b.isReady=true;if(!(j!==true&&--b.readyWait>0))if(q){var s=0,v=q;for(q=null;j=v[s++];)j.call(t,b);b.fn.trigger&&b(t).trigger("ready").unbind("ready")}}},bindReady:function(){if(!p){p=true;if(t.readyState==="complete")return setTimeout(b.ready,1);if(t.addEventListener){t.addEventListener("DOMContentLoaded",u,false);E.addEventListener("load",b.ready,false)}else if(t.attachEvent){t.attachEvent("onreadystatechange",u);E.attachEvent("onload",
b.ready);var j=false;try{j=E.frameElement==null}catch(s){}t.documentElement.doScroll&&j&&a()}}},isFunction:function(j){return b.type(j)==="function"},isArray:Array.isArray||function(j){return b.type(j)==="array"},isWindow:function(j){return j&&typeof j==="object"&&"setInterval"in j},isNaN:function(j){return j==null||!r.test(j)||isNaN(j)},type:function(j){return j==null?String(j):R[y.call(j)]||"object"},isPlainObject:function(j){if(!j||b.type(j)!=="object"||j.nodeType||b.isWindow(j))return false;if(j.constructor&&
!F.call(j,"constructor")&&!F.call(j.constructor.prototype,"isPrototypeOf"))return false;for(var s in j);return s===B||F.call(j,s)},isEmptyObject:function(j){for(var s in j)return false;return true},error:function(j){throw j;},parseJSON:function(j){if(typeof j!=="string"||!j)return null;j=b.trim(j);if(C.test(j.replace(J,"@").replace(w,"]").replace(I,"")))return E.JSON&&E.JSON.parse?E.JSON.parse(j):(new Function("return "+j))();else b.error("Invalid JSON: "+j)},noop:function(){},globalEval:function(j){if(j&&
l.test(j)){var s=t.getElementsByTagName("head")[0]||t.documentElement,v=t.createElement("script");v.type="text/javascript";if(b.support.scriptEval)v.appendChild(t.createTextNode(j));else v.text=j;s.insertBefore(v,s.firstChild);s.removeChild(v)}},nodeName:function(j,s){return j.nodeName&&j.nodeName.toUpperCase()===s.toUpperCase()},each:function(j,s,v){var z,H=0,G=j.length,K=G===B||b.isFunction(j);if(v)if(K)for(z in j){if(s.apply(j[z],v)===false)break}else for(;H<G;){if(s.apply(j[H++],v)===false)break}else if(K)for(z in j){if(s.call(j[z],
z,j[z])===false)break}else for(v=j[0];H<G&&s.call(v,H,v)!==false;v=j[++H]);return j},trim:O?function(j){return j==null?"":O.call(j)}:function(j){return j==null?"":j.toString().replace(k,"").replace(o,"")},makeArray:function(j,s){var v=s||[];if(j!=null){var z=b.type(j);j.length==null||z==="string"||z==="function"||z==="regexp"||b.isWindow(j)?M.call(v,j):b.merge(v,j)}return v},inArray:function(j,s){if(s.indexOf)return s.indexOf(j);for(var v=0,z=s.length;v<z;v++)if(s[v]===j)return v;return-1},merge:function(j,
s){var v=j.length,z=0;if(typeof s.length==="number")for(var H=s.length;z<H;z++)j[v++]=s[z];else for(;s[z]!==B;)j[v++]=s[z++];j.length=v;return j},grep:function(j,s,v){var z=[],H;v=!!v;for(var G=0,K=j.length;G<K;G++){H=!!s(j[G],G);v!==H&&z.push(j[G])}return z},map:function(j,s,v){for(var z=[],H,G=0,K=j.length;G<K;G++){H=s(j[G],G,v);if(H!=null)z[z.length]=H}return z.concat.apply([],z)},guid:1,proxy:function(j,s,v){if(arguments.length===2)if(typeof s==="string"){v=j;j=v[s];s=B}else if(s&&!b.isFunction(s)){v=
s;s=B}if(!s&&j)s=function(){return j.apply(v||this,arguments)};if(j)s.guid=j.guid=j.guid||s.guid||b.guid++;return s},access:function(j,s,v,z,H,G){var K=j.length;if(typeof s==="object"){for(var Q in s)b.access(j,Q,s[Q],z,H,v);return j}if(v!==B){z=!G&&z&&b.isFunction(v);for(Q=0;Q<K;Q++)H(j[Q],s,z?v.call(j[Q],Q,H(j[Q],s)):v,G);return j}return K?H(j[0],s):B},now:function(){return(new Date).getTime()},uaMatch:function(j){j=j.toLowerCase();j=L.exec(j)||g.exec(j)||i.exec(j)||j.indexOf("compatible")<0&&n.exec(j)||
[];return{browser:j[1]||"",version:j[2]||"0"}},browser:{}});b.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(j,s){R["[object "+s+"]"]=s.toLowerCase()});m=b.uaMatch(m);if(m.browser){b.browser[m.browser]=true;b.browser.version=m.version}if(b.browser.webkit)b.browser.safari=true;if(D)b.inArray=function(j,s){return D.call(s,j)};if(!/\s/.test("\u00a0")){k=/^[\s\xA0]+/;o=/[\s\xA0]+$/}f=b(t);if(t.addEventListener)u=function(){t.removeEventListener("DOMContentLoaded",u,
false);b.ready()};else if(t.attachEvent)u=function(){if(t.readyState==="complete"){t.detachEvent("onreadystatechange",u);b.ready()}};return E.jQuery=E.$=b}();(function(){c.support={};var a=t.documentElement,b=t.createElement("script"),d=t.createElement("div"),e="script"+c.now();d.style.display="none";d.innerHTML="   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";var f=d.getElementsByTagName("*"),h=d.getElementsByTagName("a")[0],l=t.createElement("select"),
k=l.appendChild(t.createElement("option"));if(!(!f||!f.length||!h)){c.support={leadingWhitespace:d.firstChild.nodeType===3,tbody:!d.getElementsByTagName("tbody").length,htmlSerialize:!!d.getElementsByTagName("link").length,style:/red/.test(h.getAttribute("style")),hrefNormalized:h.getAttribute("href")==="/a",opacity:/^0.55$/.test(h.style.opacity),cssFloat:!!h.style.cssFloat,checkOn:d.getElementsByTagName("input")[0].value==="on",optSelected:k.selected,deleteExpando:true,optDisabled:false,checkClone:false,
scriptEval:false,noCloneEvent:true,boxModel:null,inlineBlockNeedsLayout:false,shrinkWrapBlocks:false,reliableHiddenOffsets:true};l.disabled=true;c.support.optDisabled=!k.disabled;b.type="text/javascript";try{b.appendChild(t.createTextNode("window."+e+"=1;"))}catch(o){}a.insertBefore(b,a.firstChild);if(E[e]){c.support.scriptEval=true;delete E[e]}try{delete b.test}catch(x){c.support.deleteExpando=false}a.removeChild(b);if(d.attachEvent&&d.fireEvent){d.attachEvent("onclick",function r(){c.support.noCloneEvent=
false;d.detachEvent("onclick",r)});d.cloneNode(true).fireEvent("onclick")}d=t.createElement("div");d.innerHTML="<input type='radio' name='radiotest' checked='checked'/>";a=t.createDocumentFragment();a.appendChild(d.firstChild);c.support.checkClone=a.cloneNode(true).cloneNode(true).lastChild.checked;c(function(){var r=t.createElement("div");r.style.width=r.style.paddingLeft="1px";t.body.appendChild(r);c.boxModel=c.support.boxModel=r.offsetWidth===2;if("zoom"in r.style){r.style.display="inline";r.style.zoom=
1;c.support.inlineBlockNeedsLayout=r.offsetWidth===2;r.style.display="";r.innerHTML="<div style='width:4px;'></div>";c.support.shrinkWrapBlocks=r.offsetWidth!==2}r.innerHTML="<table><tr><td style='padding:0;display:none'></td><td>t</td></tr></table>";var A=r.getElementsByTagName("td");c.support.reliableHiddenOffsets=A[0].offsetHeight===0;A[0].style.display="";A[1].style.display="none";c.support.reliableHiddenOffsets=c.support.reliableHiddenOffsets&&A[0].offsetHeight===0;r.innerHTML="";t.body.removeChild(r).style.display=
"none"});a=function(r){var A=t.createElement("div");r="on"+r;var C=r in A;if(!C){A.setAttribute(r,"return;");C=typeof A[r]==="function"}return C};c.support.submitBubbles=a("submit");c.support.changeBubbles=a("change");a=b=d=f=h=null}})();var ra={},Ja=/^(?:\{.*\}|\[.*\])$/;c.extend({cache:{},uuid:0,expando:"jQuery"+c.now(),noData:{embed:true,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:true},data:function(a,b,d){if(c.acceptData(a)){a=a==E?ra:a;var e=a.nodeType,f=e?a[c.expando]:null,h=
c.cache;if(!(e&&!f&&typeof b==="string"&&d===B)){if(e)f||(a[c.expando]=f=++c.uuid);else h=a;if(typeof b==="object")if(e)h[f]=c.extend(h[f],b);else c.extend(h,b);else if(e&&!h[f])h[f]={};a=e?h[f]:h;if(d!==B)a[b]=d;return typeof b==="string"?a[b]:a}}},removeData:function(a,b){if(c.acceptData(a)){a=a==E?ra:a;var d=a.nodeType,e=d?a[c.expando]:a,f=c.cache,h=d?f[e]:e;if(b){if(h){delete h[b];d&&c.isEmptyObject(h)&&c.removeData(a)}}else if(d&&c.support.deleteExpando)delete a[c.expando];else if(a.removeAttribute)a.removeAttribute(c.expando);
else if(d)delete f[e];else for(var l in a)delete a[l]}},acceptData:function(a){if(a.nodeName){var b=c.noData[a.nodeName.toLowerCase()];if(b)return!(b===true||a.getAttribute("classid")!==b)}return true}});c.fn.extend({data:function(a,b){var d=null;if(typeof a==="undefined"){if(this.length){var e=this[0].attributes,f;d=c.data(this[0]);for(var h=0,l=e.length;h<l;h++){f=e[h].name;if(f.indexOf("data-")===0){f=f.substr(5);ka(this[0],f,d[f])}}}return d}else if(typeof a==="object")return this.each(function(){c.data(this,
a)});var k=a.split(".");k[1]=k[1]?"."+k[1]:"";if(b===B){d=this.triggerHandler("getData"+k[1]+"!",[k[0]]);if(d===B&&this.length){d=c.data(this[0],a);d=ka(this[0],a,d)}return d===B&&k[1]?this.data(k[0]):d}else return this.each(function(){var o=c(this),x=[k[0],b];o.triggerHandler("setData"+k[1]+"!",x);c.data(this,a,b);o.triggerHandler("changeData"+k[1]+"!",x)})},removeData:function(a){return this.each(function(){c.removeData(this,a)})}});c.extend({queue:function(a,b,d){if(a){b=(b||"fx")+"queue";var e=
c.data(a,b);if(!d)return e||[];if(!e||c.isArray(d))e=c.data(a,b,c.makeArray(d));else e.push(d);return e}},dequeue:function(a,b){b=b||"fx";var d=c.queue(a,b),e=d.shift();if(e==="inprogress")e=d.shift();if(e){b==="fx"&&d.unshift("inprogress");e.call(a,function(){c.dequeue(a,b)})}}});c.fn.extend({queue:function(a,b){if(typeof a!=="string"){b=a;a="fx"}if(b===B)return c.queue(this[0],a);return this.each(function(){var d=c.queue(this,a,b);a==="fx"&&d[0]!=="inprogress"&&c.dequeue(this,a)})},dequeue:function(a){return this.each(function(){c.dequeue(this,
a)})},delay:function(a,b){a=c.fx?c.fx.speeds[a]||a:a;b=b||"fx";return this.queue(b,function(){var d=this;setTimeout(function(){c.dequeue(d,b)},a)})},clearQueue:function(a){return this.queue(a||"fx",[])}});var sa=/[\n\t]/g,ha=/\s+/,Sa=/\r/g,Ta=/^(?:href|src|style)$/,Ua=/^(?:button|input)$/i,Va=/^(?:button|input|object|select|textarea)$/i,Wa=/^a(?:rea)?$/i,ta=/^(?:radio|checkbox)$/i;c.props={"for":"htmlFor","class":"className",readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing",rowspan:"rowSpan",
colspan:"colSpan",tabindex:"tabIndex",usemap:"useMap",frameborder:"frameBorder"};c.fn.extend({attr:function(a,b){return c.access(this,a,b,true,c.attr)},removeAttr:function(a){return this.each(function(){c.attr(this,a,"");this.nodeType===1&&this.removeAttribute(a)})},addClass:function(a){if(c.isFunction(a))return this.each(function(x){var r=c(this);r.addClass(a.call(this,x,r.attr("class")))});if(a&&typeof a==="string")for(var b=(a||"").split(ha),d=0,e=this.length;d<e;d++){var f=this[d];if(f.nodeType===
1)if(f.className){for(var h=" "+f.className+" ",l=f.className,k=0,o=b.length;k<o;k++)if(h.indexOf(" "+b[k]+" ")<0)l+=" "+b[k];f.className=c.trim(l)}else f.className=a}return this},removeClass:function(a){if(c.isFunction(a))return this.each(function(o){var x=c(this);x.removeClass(a.call(this,o,x.attr("class")))});if(a&&typeof a==="string"||a===B)for(var b=(a||"").split(ha),d=0,e=this.length;d<e;d++){var f=this[d];if(f.nodeType===1&&f.className)if(a){for(var h=(" "+f.className+" ").replace(sa," "),
l=0,k=b.length;l<k;l++)h=h.replace(" "+b[l]+" "," ");f.className=c.trim(h)}else f.className=""}return this},toggleClass:function(a,b){var d=typeof a,e=typeof b==="boolean";if(c.isFunction(a))return this.each(function(f){var h=c(this);h.toggleClass(a.call(this,f,h.attr("class"),b),b)});return this.each(function(){if(d==="string")for(var f,h=0,l=c(this),k=b,o=a.split(ha);f=o[h++];){k=e?k:!l.hasClass(f);l[k?"addClass":"removeClass"](f)}else if(d==="undefined"||d==="boolean"){this.className&&c.data(this,
"__className__",this.className);this.className=this.className||a===false?"":c.data(this,"__className__")||""}})},hasClass:function(a){a=" "+a+" ";for(var b=0,d=this.length;b<d;b++)if((" "+this[b].className+" ").replace(sa," ").indexOf(a)>-1)return true;return false},val:function(a){if(!arguments.length){var b=this[0];if(b){if(c.nodeName(b,"option")){var d=b.attributes.value;return!d||d.specified?b.value:b.text}if(c.nodeName(b,"select")){var e=b.selectedIndex;d=[];var f=b.options;b=b.type==="select-one";
if(e<0)return null;var h=b?e:0;for(e=b?e+1:f.length;h<e;h++){var l=f[h];if(l.selected&&(c.support.optDisabled?!l.disabled:l.getAttribute("disabled")===null)&&(!l.parentNode.disabled||!c.nodeName(l.parentNode,"optgroup"))){a=c(l).val();if(b)return a;d.push(a)}}return d}if(ta.test(b.type)&&!c.support.checkOn)return b.getAttribute("value")===null?"on":b.value;return(b.value||"").replace(Sa,"")}return B}var k=c.isFunction(a);return this.each(function(o){var x=c(this),r=a;if(this.nodeType===1){if(k)r=
a.call(this,o,x.val());if(r==null)r="";else if(typeof r==="number")r+="";else if(c.isArray(r))r=c.map(r,function(C){return C==null?"":C+""});if(c.isArray(r)&&ta.test(this.type))this.checked=c.inArray(x.val(),r)>=0;else if(c.nodeName(this,"select")){var A=c.makeArray(r);c("option",this).each(function(){this.selected=c.inArray(c(this).val(),A)>=0});if(!A.length)this.selectedIndex=-1}else this.value=r}})}});c.extend({attrFn:{val:true,css:true,html:true,text:true,data:true,width:true,height:true,offset:true},
attr:function(a,b,d,e){if(!a||a.nodeType===3||a.nodeType===8)return B;if(e&&b in c.attrFn)return c(a)[b](d);e=a.nodeType!==1||!c.isXMLDoc(a);var f=d!==B;b=e&&c.props[b]||b;var h=Ta.test(b);if((b in a||a[b]!==B)&&e&&!h){if(f){b==="type"&&Ua.test(a.nodeName)&&a.parentNode&&c.error("type property can't be changed");if(d===null)a.nodeType===1&&a.removeAttribute(b);else a[b]=d}if(c.nodeName(a,"form")&&a.getAttributeNode(b))return a.getAttributeNode(b).nodeValue;if(b==="tabIndex")return(b=a.getAttributeNode("tabIndex"))&&
b.specified?b.value:Va.test(a.nodeName)||Wa.test(a.nodeName)&&a.href?0:B;return a[b]}if(!c.support.style&&e&&b==="style"){if(f)a.style.cssText=""+d;return a.style.cssText}f&&a.setAttribute(b,""+d);if(!a.attributes[b]&&a.hasAttribute&&!a.hasAttribute(b))return B;a=!c.support.hrefNormalized&&e&&h?a.getAttribute(b,2):a.getAttribute(b);return a===null?B:a}});var X=/\.(.*)$/,ia=/^(?:textarea|input|select)$/i,La=/\./g,Ma=/ /g,Xa=/[^\w\s.|`]/g,Ya=function(a){return a.replace(Xa,"\\$&")},ua={focusin:0,focusout:0};
c.event={add:function(a,b,d,e){if(!(a.nodeType===3||a.nodeType===8)){if(c.isWindow(a)&&a!==E&&!a.frameElement)a=E;if(d===false)d=U;else if(!d)return;var f,h;if(d.handler){f=d;d=f.handler}if(!d.guid)d.guid=c.guid++;if(h=c.data(a)){var l=a.nodeType?"events":"__events__",k=h[l],o=h.handle;if(typeof k==="function"){o=k.handle;k=k.events}else if(!k){a.nodeType||(h[l]=h=function(){});h.events=k={}}if(!o)h.handle=o=function(){return typeof c!=="undefined"&&!c.event.triggered?c.event.handle.apply(o.elem,
arguments):B};o.elem=a;b=b.split(" ");for(var x=0,r;l=b[x++];){h=f?c.extend({},f):{handler:d,data:e};if(l.indexOf(".")>-1){r=l.split(".");l=r.shift();h.namespace=r.slice(0).sort().join(".")}else{r=[];h.namespace=""}h.type=l;if(!h.guid)h.guid=d.guid;var A=k[l],C=c.event.special[l]||{};if(!A){A=k[l]=[];if(!C.setup||C.setup.call(a,e,r,o)===false)if(a.addEventListener)a.addEventListener(l,o,false);else a.attachEvent&&a.attachEvent("on"+l,o)}if(C.add){C.add.call(a,h);if(!h.handler.guid)h.handler.guid=
d.guid}A.push(h);c.event.global[l]=true}a=null}}},global:{},remove:function(a,b,d,e){if(!(a.nodeType===3||a.nodeType===8)){if(d===false)d=U;var f,h,l=0,k,o,x,r,A,C,J=a.nodeType?"events":"__events__",w=c.data(a),I=w&&w[J];if(w&&I){if(typeof I==="function"){w=I;I=I.events}if(b&&b.type){d=b.handler;b=b.type}if(!b||typeof b==="string"&&b.charAt(0)==="."){b=b||"";for(f in I)c.event.remove(a,f+b)}else{for(b=b.split(" ");f=b[l++];){r=f;k=f.indexOf(".")<0;o=[];if(!k){o=f.split(".");f=o.shift();x=RegExp("(^|\\.)"+
c.map(o.slice(0).sort(),Ya).join("\\.(?:.*\\.)?")+"(\\.|$)")}if(A=I[f])if(d){r=c.event.special[f]||{};for(h=e||0;h<A.length;h++){C=A[h];if(d.guid===C.guid){if(k||x.test(C.namespace)){e==null&&A.splice(h--,1);r.remove&&r.remove.call(a,C)}if(e!=null)break}}if(A.length===0||e!=null&&A.length===1){if(!r.teardown||r.teardown.call(a,o)===false)c.removeEvent(a,f,w.handle);delete I[f]}}else for(h=0;h<A.length;h++){C=A[h];if(k||x.test(C.namespace)){c.event.remove(a,r,C.handler,h);A.splice(h--,1)}}}if(c.isEmptyObject(I)){if(b=
w.handle)b.elem=null;delete w.events;delete w.handle;if(typeof w==="function")c.removeData(a,J);else c.isEmptyObject(w)&&c.removeData(a)}}}}},trigger:function(a,b,d,e){var f=a.type||a;if(!e){a=typeof a==="object"?a[c.expando]?a:c.extend(c.Event(f),a):c.Event(f);if(f.indexOf("!")>=0){a.type=f=f.slice(0,-1);a.exclusive=true}if(!d){a.stopPropagation();c.event.global[f]&&c.each(c.cache,function(){this.events&&this.events[f]&&c.event.trigger(a,b,this.handle.elem)})}if(!d||d.nodeType===3||d.nodeType===
8)return B;a.result=B;a.target=d;b=c.makeArray(b);b.unshift(a)}a.currentTarget=d;(e=d.nodeType?c.data(d,"handle"):(c.data(d,"__events__")||{}).handle)&&e.apply(d,b);e=d.parentNode||d.ownerDocument;try{if(!(d&&d.nodeName&&c.noData[d.nodeName.toLowerCase()]))if(d["on"+f]&&d["on"+f].apply(d,b)===false){a.result=false;a.preventDefault()}}catch(h){}if(!a.isPropagationStopped()&&e)c.event.trigger(a,b,e,true);else if(!a.isDefaultPrevented()){var l;e=a.target;var k=f.replace(X,""),o=c.nodeName(e,"a")&&k===
"click",x=c.event.special[k]||{};if((!x._default||x._default.call(d,a)===false)&&!o&&!(e&&e.nodeName&&c.noData[e.nodeName.toLowerCase()])){try{if(e[k]){if(l=e["on"+k])e["on"+k]=null;c.event.triggered=true;e[k]()}}catch(r){}if(l)e["on"+k]=l;c.event.triggered=false}}},handle:function(a){var b,d,e,f;d=[];var h=c.makeArray(arguments);a=h[0]=c.event.fix(a||E.event);a.currentTarget=this;b=a.type.indexOf(".")<0&&!a.exclusive;if(!b){e=a.type.split(".");a.type=e.shift();d=e.slice(0).sort();e=RegExp("(^|\\.)"+
d.join("\\.(?:.*\\.)?")+"(\\.|$)")}a.namespace=a.namespace||d.join(".");f=c.data(this,this.nodeType?"events":"__events__");if(typeof f==="function")f=f.events;d=(f||{})[a.type];if(f&&d){d=d.slice(0);f=0;for(var l=d.length;f<l;f++){var k=d[f];if(b||e.test(k.namespace)){a.handler=k.handler;a.data=k.data;a.handleObj=k;k=k.handler.apply(this,h);if(k!==B){a.result=k;if(k===false){a.preventDefault();a.stopPropagation()}}if(a.isImmediatePropagationStopped())break}}}return a.result},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
fix:function(a){if(a[c.expando])return a;var b=a;a=c.Event(b);for(var d=this.props.length,e;d;){e=this.props[--d];a[e]=b[e]}if(!a.target)a.target=a.srcElement||t;if(a.target.nodeType===3)a.target=a.target.parentNode;if(!a.relatedTarget&&a.fromElement)a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement;if(a.pageX==null&&a.clientX!=null){b=t.documentElement;d=t.body;a.pageX=a.clientX+(b&&b.scrollLeft||d&&d.scrollLeft||0)-(b&&b.clientLeft||d&&d.clientLeft||0);a.pageY=a.clientY+(b&&b.scrollTop||
d&&d.scrollTop||0)-(b&&b.clientTop||d&&d.clientTop||0)}if(a.which==null&&(a.charCode!=null||a.keyCode!=null))a.which=a.charCode!=null?a.charCode:a.keyCode;if(!a.metaKey&&a.ctrlKey)a.metaKey=a.ctrlKey;if(!a.which&&a.button!==B)a.which=a.button&1?1:a.button&2?3:a.button&4?2:0;return a},guid:1E8,proxy:c.proxy,special:{ready:{setup:c.bindReady,teardown:c.noop},live:{add:function(a){c.event.add(this,Y(a.origType,a.selector),c.extend({},a,{handler:Ka,guid:a.handler.guid}))},remove:function(a){c.event.remove(this,
Y(a.origType,a.selector),a)}},beforeunload:{setup:function(a,b,d){if(c.isWindow(this))this.onbeforeunload=d},teardown:function(a,b){if(this.onbeforeunload===b)this.onbeforeunload=null}}}};c.removeEvent=t.removeEventListener?function(a,b,d){a.removeEventListener&&a.removeEventListener(b,d,false)}:function(a,b,d){a.detachEvent&&a.detachEvent("on"+b,d)};c.Event=function(a){if(!this.preventDefault)return new c.Event(a);if(a&&a.type){this.originalEvent=a;this.type=a.type}else this.type=a;this.timeStamp=
c.now();this[c.expando]=true};c.Event.prototype={preventDefault:function(){this.isDefaultPrevented=ca;var a=this.originalEvent;if(a)if(a.preventDefault)a.preventDefault();else a.returnValue=false},stopPropagation:function(){this.isPropagationStopped=ca;var a=this.originalEvent;if(a){a.stopPropagation&&a.stopPropagation();a.cancelBubble=true}},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=ca;this.stopPropagation()},isDefaultPrevented:U,isPropagationStopped:U,isImmediatePropagationStopped:U};
var va=function(a){var b=a.relatedTarget;try{for(;b&&b!==this;)b=b.parentNode;if(b!==this){a.type=a.data;c.event.handle.apply(this,arguments)}}catch(d){}},wa=function(a){a.type=a.data;c.event.handle.apply(this,arguments)};c.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){c.event.special[a]={setup:function(d){c.event.add(this,b,d&&d.selector?wa:va,a)},teardown:function(d){c.event.remove(this,b,d&&d.selector?wa:va)}}});if(!c.support.submitBubbles)c.event.special.submit={setup:function(){if(this.nodeName.toLowerCase()!==
"form"){c.event.add(this,"click.specialSubmit",function(a){var b=a.target,d=b.type;if((d==="submit"||d==="image")&&c(b).closest("form").length){a.liveFired=B;return la("submit",this,arguments)}});c.event.add(this,"keypress.specialSubmit",function(a){var b=a.target,d=b.type;if((d==="text"||d==="password")&&c(b).closest("form").length&&a.keyCode===13){a.liveFired=B;return la("submit",this,arguments)}})}else return false},teardown:function(){c.event.remove(this,".specialSubmit")}};if(!c.support.changeBubbles){var V,
xa=function(a){var b=a.type,d=a.value;if(b==="radio"||b==="checkbox")d=a.checked;else if(b==="select-multiple")d=a.selectedIndex>-1?c.map(a.options,function(e){return e.selected}).join("-"):"";else if(a.nodeName.toLowerCase()==="select")d=a.selectedIndex;return d},Z=function(a,b){var d=a.target,e,f;if(!(!ia.test(d.nodeName)||d.readOnly)){e=c.data(d,"_change_data");f=xa(d);if(a.type!=="focusout"||d.type!=="radio")c.data(d,"_change_data",f);if(!(e===B||f===e))if(e!=null||f){a.type="change";a.liveFired=
B;return c.event.trigger(a,b,d)}}};c.event.special.change={filters:{focusout:Z,beforedeactivate:Z,click:function(a){var b=a.target,d=b.type;if(d==="radio"||d==="checkbox"||b.nodeName.toLowerCase()==="select")return Z.call(this,a)},keydown:function(a){var b=a.target,d=b.type;if(a.keyCode===13&&b.nodeName.toLowerCase()!=="textarea"||a.keyCode===32&&(d==="checkbox"||d==="radio")||d==="select-multiple")return Z.call(this,a)},beforeactivate:function(a){a=a.target;c.data(a,"_change_data",xa(a))}},setup:function(){if(this.type===
"file")return false;for(var a in V)c.event.add(this,a+".specialChange",V[a]);return ia.test(this.nodeName)},teardown:function(){c.event.remove(this,".specialChange");return ia.test(this.nodeName)}};V=c.event.special.change.filters;V.focus=V.beforeactivate}t.addEventListener&&c.each({focus:"focusin",blur:"focusout"},function(a,b){function d(e){e=c.event.fix(e);e.type=b;return c.event.trigger(e,null,e.target)}c.event.special[b]={setup:function(){ua[b]++===0&&t.addEventListener(a,d,true)},teardown:function(){--ua[b]===
0&&t.removeEventListener(a,d,true)}}});c.each(["bind","one"],function(a,b){c.fn[b]=function(d,e,f){if(typeof d==="object"){for(var h in d)this[b](h,e,d[h],f);return this}if(c.isFunction(e)||e===false){f=e;e=B}var l=b==="one"?c.proxy(f,function(o){c(this).unbind(o,l);return f.apply(this,arguments)}):f;if(d==="unload"&&b!=="one")this.one(d,e,f);else{h=0;for(var k=this.length;h<k;h++)c.event.add(this[h],d,l,e)}return this}});c.fn.extend({unbind:function(a,b){if(typeof a==="object"&&!a.preventDefault)for(var d in a)this.unbind(d,
a[d]);else{d=0;for(var e=this.length;d<e;d++)c.event.remove(this[d],a,b)}return this},delegate:function(a,b,d,e){return this.live(b,d,e,a)},undelegate:function(a,b,d){return arguments.length===0?this.unbind("live"):this.die(b,null,d,a)},trigger:function(a,b){return this.each(function(){c.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0]){var d=c.Event(a);d.preventDefault();d.stopPropagation();c.event.trigger(d,b,this[0]);return d.result}},toggle:function(a){for(var b=arguments,d=
1;d<b.length;)c.proxy(a,b[d++]);return this.click(c.proxy(a,function(e){var f=(c.data(this,"lastToggle"+a.guid)||0)%d;c.data(this,"lastToggle"+a.guid,f+1);e.preventDefault();return b[f].apply(this,arguments)||false}))},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var ya={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};c.each(["live","die"],function(a,b){c.fn[b]=function(d,e,f,h){var l,k=0,o,x,r=h||this.selector;h=h?this:c(this.context);if(typeof d===
"object"&&!d.preventDefault){for(l in d)h[b](l,e,d[l],r);return this}if(c.isFunction(e)){f=e;e=B}for(d=(d||"").split(" ");(l=d[k++])!=null;){o=X.exec(l);x="";if(o){x=o[0];l=l.replace(X,"")}if(l==="hover")d.push("mouseenter"+x,"mouseleave"+x);else{o=l;if(l==="focus"||l==="blur"){d.push(ya[l]+x);l+=x}else l=(ya[l]||l)+x;if(b==="live"){x=0;for(var A=h.length;x<A;x++)c.event.add(h[x],"live."+Y(l,r),{data:e,selector:r,handler:f,origType:l,origHandler:f,preType:o})}else h.unbind("live."+Y(l,r),f)}}return this}});
c.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),function(a,b){c.fn[b]=function(d,e){if(e==null){e=d;d=null}return arguments.length>0?this.bind(b,d,e):this.trigger(b)};if(c.attrFn)c.attrFn[b]=true});E.attachEvent&&!E.addEventListener&&c(E).bind("unload",function(){for(var a in c.cache)if(c.cache[a].handle)try{c.event.remove(c.cache[a].handle.elem)}catch(b){}});
(function(){function a(g,i,n,m,p,q){p=0;for(var u=m.length;p<u;p++){var y=m[p];if(y){var F=false;for(y=y[g];y;){if(y.sizcache===n){F=m[y.sizset];break}if(y.nodeType===1&&!q){y.sizcache=n;y.sizset=p}if(y.nodeName.toLowerCase()===i){F=y;break}y=y[g]}m[p]=F}}}function b(g,i,n,m,p,q){p=0;for(var u=m.length;p<u;p++){var y=m[p];if(y){var F=false;for(y=y[g];y;){if(y.sizcache===n){F=m[y.sizset];break}if(y.nodeType===1){if(!q){y.sizcache=n;y.sizset=p}if(typeof i!=="string"){if(y===i){F=true;break}}else if(k.filter(i,
[y]).length>0){F=y;break}}y=y[g]}m[p]=F}}}var d=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,e=0,f=Object.prototype.toString,h=false,l=true;[0,0].sort(function(){l=false;return 0});var k=function(g,i,n,m){n=n||[];var p=i=i||t;if(i.nodeType!==1&&i.nodeType!==9)return[];if(!g||typeof g!=="string")return n;var q,u,y,F,M,N=true,O=k.isXML(i),D=[],R=g;do{d.exec("");if(q=d.exec(R)){R=q[3];D.push(q[1]);if(q[2]){F=q[3];
break}}}while(q);if(D.length>1&&x.exec(g))if(D.length===2&&o.relative[D[0]])u=L(D[0]+D[1],i);else for(u=o.relative[D[0]]?[i]:k(D.shift(),i);D.length;){g=D.shift();if(o.relative[g])g+=D.shift();u=L(g,u)}else{if(!m&&D.length>1&&i.nodeType===9&&!O&&o.match.ID.test(D[0])&&!o.match.ID.test(D[D.length-1])){q=k.find(D.shift(),i,O);i=q.expr?k.filter(q.expr,q.set)[0]:q.set[0]}if(i){q=m?{expr:D.pop(),set:C(m)}:k.find(D.pop(),D.length===1&&(D[0]==="~"||D[0]==="+")&&i.parentNode?i.parentNode:i,O);u=q.expr?k.filter(q.expr,
q.set):q.set;if(D.length>0)y=C(u);else N=false;for(;D.length;){q=M=D.pop();if(o.relative[M])q=D.pop();else M="";if(q==null)q=i;o.relative[M](y,q,O)}}else y=[]}y||(y=u);y||k.error(M||g);if(f.call(y)==="[object Array]")if(N)if(i&&i.nodeType===1)for(g=0;y[g]!=null;g++){if(y[g]&&(y[g]===true||y[g].nodeType===1&&k.contains(i,y[g])))n.push(u[g])}else for(g=0;y[g]!=null;g++)y[g]&&y[g].nodeType===1&&n.push(u[g]);else n.push.apply(n,y);else C(y,n);if(F){k(F,p,n,m);k.uniqueSort(n)}return n};k.uniqueSort=function(g){if(w){h=
l;g.sort(w);if(h)for(var i=1;i<g.length;i++)g[i]===g[i-1]&&g.splice(i--,1)}return g};k.matches=function(g,i){return k(g,null,null,i)};k.matchesSelector=function(g,i){return k(i,null,null,[g]).length>0};k.find=function(g,i,n){var m;if(!g)return[];for(var p=0,q=o.order.length;p<q;p++){var u,y=o.order[p];if(u=o.leftMatch[y].exec(g)){var F=u[1];u.splice(1,1);if(F.substr(F.length-1)!=="\\"){u[1]=(u[1]||"").replace(/\\/g,"");m=o.find[y](u,i,n);if(m!=null){g=g.replace(o.match[y],"");break}}}}m||(m=i.getElementsByTagName("*"));
return{set:m,expr:g}};k.filter=function(g,i,n,m){for(var p,q,u=g,y=[],F=i,M=i&&i[0]&&k.isXML(i[0]);g&&i.length;){for(var N in o.filter)if((p=o.leftMatch[N].exec(g))!=null&&p[2]){var O,D,R=o.filter[N];D=p[1];q=false;p.splice(1,1);if(D.substr(D.length-1)!=="\\"){if(F===y)y=[];if(o.preFilter[N])if(p=o.preFilter[N](p,F,n,y,m,M)){if(p===true)continue}else q=O=true;if(p)for(var j=0;(D=F[j])!=null;j++)if(D){O=R(D,p,j,F);var s=m^!!O;if(n&&O!=null)if(s)q=true;else F[j]=false;else if(s){y.push(D);q=true}}if(O!==
B){n||(F=y);g=g.replace(o.match[N],"");if(!q)return[];break}}}if(g===u)if(q==null)k.error(g);else break;u=g}return F};k.error=function(g){throw"Syntax error, unrecognized expression: "+g;};var o=k.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(g){return g.getAttribute("href")}},relative:{"+":function(g,i){var n=typeof i==="string",m=n&&!/\W/.test(i);n=n&&!m;if(m)i=i.toLowerCase();m=0;for(var p=g.length,q;m<p;m++)if(q=g[m]){for(;(q=q.previousSibling)&&q.nodeType!==1;);g[m]=n||q&&q.nodeName.toLowerCase()===
i?q||false:q===i}n&&k.filter(i,g,true)},">":function(g,i){var n,m=typeof i==="string",p=0,q=g.length;if(m&&!/\W/.test(i))for(i=i.toLowerCase();p<q;p++){if(n=g[p]){n=n.parentNode;g[p]=n.nodeName.toLowerCase()===i?n:false}}else{for(;p<q;p++)if(n=g[p])g[p]=m?n.parentNode:n.parentNode===i;m&&k.filter(i,g,true)}},"":function(g,i,n){var m,p=e++,q=b;if(typeof i==="string"&&!/\W/.test(i)){m=i=i.toLowerCase();q=a}q("parentNode",i,p,g,m,n)},"~":function(g,i,n){var m,p=e++,q=b;if(typeof i==="string"&&!/\W/.test(i)){m=
i=i.toLowerCase();q=a}q("previousSibling",i,p,g,m,n)}},find:{ID:function(g,i,n){if(typeof i.getElementById!=="undefined"&&!n)return(g=i.getElementById(g[1]))&&g.parentNode?[g]:[]},NAME:function(g,i){if(typeof i.getElementsByName!=="undefined"){for(var n=[],m=i.getElementsByName(g[1]),p=0,q=m.length;p<q;p++)m[p].getAttribute("name")===g[1]&&n.push(m[p]);return n.length===0?null:n}},TAG:function(g,i){return i.getElementsByTagName(g[1])}},preFilter:{CLASS:function(g,i,n,m,p,q){g=" "+g[1].replace(/\\/g,
"")+" ";if(q)return g;q=0;for(var u;(u=i[q])!=null;q++)if(u)if(p^(u.className&&(" "+u.className+" ").replace(/[\t\n]/g," ").indexOf(g)>=0))n||m.push(u);else if(n)i[q]=false;return false},ID:function(g){return g[1].replace(/\\/g,"")},TAG:function(g){return g[1].toLowerCase()},CHILD:function(g){if(g[1]==="nth"){var i=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(g[2]==="even"&&"2n"||g[2]==="odd"&&"2n+1"||!/\D/.test(g[2])&&"0n+"+g[2]||g[2]);g[2]=i[1]+(i[2]||1)-0;g[3]=i[3]-0}g[0]=e++;return g},ATTR:function(g,i,n,
m,p,q){i=g[1].replace(/\\/g,"");if(!q&&o.attrMap[i])g[1]=o.attrMap[i];if(g[2]==="~=")g[4]=" "+g[4]+" ";return g},PSEUDO:function(g,i,n,m,p){if(g[1]==="not")if((d.exec(g[3])||"").length>1||/^\w/.test(g[3]))g[3]=k(g[3],null,null,i);else{g=k.filter(g[3],i,n,true^p);n||m.push.apply(m,g);return false}else if(o.match.POS.test(g[0])||o.match.CHILD.test(g[0]))return true;return g},POS:function(g){g.unshift(true);return g}},filters:{enabled:function(g){return g.disabled===false&&g.type!=="hidden"},disabled:function(g){return g.disabled===
true},checked:function(g){return g.checked===true},selected:function(g){return g.selected===true},parent:function(g){return!!g.firstChild},empty:function(g){return!g.firstChild},has:function(g,i,n){return!!k(n[3],g).length},header:function(g){return/h\d/i.test(g.nodeName)},text:function(g){return"text"===g.type},radio:function(g){return"radio"===g.type},checkbox:function(g){return"checkbox"===g.type},file:function(g){return"file"===g.type},password:function(g){return"password"===g.type},submit:function(g){return"submit"===
g.type},image:function(g){return"image"===g.type},reset:function(g){return"reset"===g.type},button:function(g){return"button"===g.type||g.nodeName.toLowerCase()==="button"},input:function(g){return/input|select|textarea|button/i.test(g.nodeName)}},setFilters:{first:function(g,i){return i===0},last:function(g,i,n,m){return i===m.length-1},even:function(g,i){return i%2===0},odd:function(g,i){return i%2===1},lt:function(g,i,n){return i<n[3]-0},gt:function(g,i,n){return i>n[3]-0},nth:function(g,i,n){return n[3]-
0===i},eq:function(g,i,n){return n[3]-0===i}},filter:{PSEUDO:function(g,i,n,m){var p=i[1],q=o.filters[p];if(q)return q(g,n,i,m);else if(p==="contains")return(g.textContent||g.innerText||k.getText([g])||"").indexOf(i[3])>=0;else if(p==="not"){i=i[3];n=0;for(m=i.length;n<m;n++)if(i[n]===g)return false;return true}else k.error("Syntax error, unrecognized expression: "+p)},CHILD:function(g,i){var n=i[1],m=g;switch(n){case "only":case "first":for(;m=m.previousSibling;)if(m.nodeType===1)return false;if(n===
"first")return true;m=g;case "last":for(;m=m.nextSibling;)if(m.nodeType===1)return false;return true;case "nth":n=i[2];var p=i[3];if(n===1&&p===0)return true;var q=i[0],u=g.parentNode;if(u&&(u.sizcache!==q||!g.nodeIndex)){var y=0;for(m=u.firstChild;m;m=m.nextSibling)if(m.nodeType===1)m.nodeIndex=++y;u.sizcache=q}m=g.nodeIndex-p;return n===0?m===0:m%n===0&&m/n>=0}},ID:function(g,i){return g.nodeType===1&&g.getAttribute("id")===i},TAG:function(g,i){return i==="*"&&g.nodeType===1||g.nodeName.toLowerCase()===
i},CLASS:function(g,i){return(" "+(g.className||g.getAttribute("class"))+" ").indexOf(i)>-1},ATTR:function(g,i){var n=i[1];n=o.attrHandle[n]?o.attrHandle[n](g):g[n]!=null?g[n]:g.getAttribute(n);var m=n+"",p=i[2],q=i[4];return n==null?p==="!=":p==="="?m===q:p==="*="?m.indexOf(q)>=0:p==="~="?(" "+m+" ").indexOf(q)>=0:!q?m&&n!==false:p==="!="?m!==q:p==="^="?m.indexOf(q)===0:p==="$="?m.substr(m.length-q.length)===q:p==="|="?m===q||m.substr(0,q.length+1)===q+"-":false},POS:function(g,i,n,m){var p=o.setFilters[i[2]];
if(p)return p(g,n,i,m)}}},x=o.match.POS,r=function(g,i){return"\\"+(i-0+1)},A;for(A in o.match){o.match[A]=RegExp(o.match[A].source+/(?![^\[]*\])(?![^\(]*\))/.source);o.leftMatch[A]=RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[A].source.replace(/\\(\d+)/g,r))}var C=function(g,i){g=Array.prototype.slice.call(g,0);if(i){i.push.apply(i,g);return i}return g};try{Array.prototype.slice.call(t.documentElement.childNodes,0)}catch(J){C=function(g,i){var n=0,m=i||[];if(f.call(g)==="[object Array]")Array.prototype.push.apply(m,
g);else if(typeof g.length==="number")for(var p=g.length;n<p;n++)m.push(g[n]);else for(;g[n];n++)m.push(g[n]);return m}}var w,I;if(t.documentElement.compareDocumentPosition)w=function(g,i){if(g===i){h=true;return 0}if(!g.compareDocumentPosition||!i.compareDocumentPosition)return g.compareDocumentPosition?-1:1;return g.compareDocumentPosition(i)&4?-1:1};else{w=function(g,i){var n,m,p=[],q=[];n=g.parentNode;m=i.parentNode;var u=n;if(g===i){h=true;return 0}else if(n===m)return I(g,i);else if(n){if(!m)return 1}else return-1;
for(;u;){p.unshift(u);u=u.parentNode}for(u=m;u;){q.unshift(u);u=u.parentNode}n=p.length;m=q.length;for(u=0;u<n&&u<m;u++)if(p[u]!==q[u])return I(p[u],q[u]);return u===n?I(g,q[u],-1):I(p[u],i,1)};I=function(g,i,n){if(g===i)return n;for(g=g.nextSibling;g;){if(g===i)return-1;g=g.nextSibling}return 1}}k.getText=function(g){for(var i="",n,m=0;g[m];m++){n=g[m];if(n.nodeType===3||n.nodeType===4)i+=n.nodeValue;else if(n.nodeType!==8)i+=k.getText(n.childNodes)}return i};(function(){var g=t.createElement("div"),
i="script"+(new Date).getTime(),n=t.documentElement;g.innerHTML="<a name='"+i+"'/>";n.insertBefore(g,n.firstChild);if(t.getElementById(i)){o.find.ID=function(m,p,q){if(typeof p.getElementById!=="undefined"&&!q)return(p=p.getElementById(m[1]))?p.id===m[1]||typeof p.getAttributeNode!=="undefined"&&p.getAttributeNode("id").nodeValue===m[1]?[p]:B:[]};o.filter.ID=function(m,p){var q=typeof m.getAttributeNode!=="undefined"&&m.getAttributeNode("id");return m.nodeType===1&&q&&q.nodeValue===p}}n.removeChild(g);
n=g=null})();(function(){var g=t.createElement("div");g.appendChild(t.createComment(""));if(g.getElementsByTagName("*").length>0)o.find.TAG=function(i,n){var m=n.getElementsByTagName(i[1]);if(i[1]==="*"){for(var p=[],q=0;m[q];q++)m[q].nodeType===1&&p.push(m[q]);m=p}return m};g.innerHTML="<a href='#'></a>";if(g.firstChild&&typeof g.firstChild.getAttribute!=="undefined"&&g.firstChild.getAttribute("href")!=="#")o.attrHandle.href=function(i){return i.getAttribute("href",2)};g=null})();t.querySelectorAll&&
function(){var g=k,i=t.createElement("div");i.innerHTML="<p class='TEST'></p>";if(!(i.querySelectorAll&&i.querySelectorAll(".TEST").length===0)){k=function(m,p,q,u){p=p||t;m=m.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!u&&!k.isXML(p))if(p.nodeType===9)try{return C(p.querySelectorAll(m),q)}catch(y){}else if(p.nodeType===1&&p.nodeName.toLowerCase()!=="object"){var F=p.getAttribute("id"),M=F||"__sizzle__";F||p.setAttribute("id",M);try{return C(p.querySelectorAll("#"+M+" "+m),q)}catch(N){}finally{F||
p.removeAttribute("id")}}return g(m,p,q,u)};for(var n in g)k[n]=g[n];i=null}}();(function(){var g=t.documentElement,i=g.matchesSelector||g.mozMatchesSelector||g.webkitMatchesSelector||g.msMatchesSelector,n=false;try{i.call(t.documentElement,"[test!='']:sizzle")}catch(m){n=true}if(i)k.matchesSelector=function(p,q){q=q.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!k.isXML(p))try{if(n||!o.match.PSEUDO.test(q)&&!/!=/.test(q))return i.call(p,q)}catch(u){}return k(q,null,null,[p]).length>0}})();(function(){var g=
t.createElement("div");g.innerHTML="<div class='test e'></div><div class='test'></div>";if(!(!g.getElementsByClassName||g.getElementsByClassName("e").length===0)){g.lastChild.className="e";if(g.getElementsByClassName("e").length!==1){o.order.splice(1,0,"CLASS");o.find.CLASS=function(i,n,m){if(typeof n.getElementsByClassName!=="undefined"&&!m)return n.getElementsByClassName(i[1])};g=null}}})();k.contains=t.documentElement.contains?function(g,i){return g!==i&&(g.contains?g.contains(i):true)}:t.documentElement.compareDocumentPosition?
function(g,i){return!!(g.compareDocumentPosition(i)&16)}:function(){return false};k.isXML=function(g){return(g=(g?g.ownerDocument||g:0).documentElement)?g.nodeName!=="HTML":false};var L=function(g,i){for(var n,m=[],p="",q=i.nodeType?[i]:i;n=o.match.PSEUDO.exec(g);){p+=n[0];g=g.replace(o.match.PSEUDO,"")}g=o.relative[g]?g+"*":g;n=0;for(var u=q.length;n<u;n++)k(g,q[n],m);return k.filter(p,m)};c.find=k;c.expr=k.selectors;c.expr[":"]=c.expr.filters;c.unique=k.uniqueSort;c.text=k.getText;c.isXMLDoc=k.isXML;
c.contains=k.contains})();var Za=/Until$/,$a=/^(?:parents|prevUntil|prevAll)/,ab=/,/,Na=/^.[^:#\[\.,]*$/,bb=Array.prototype.slice,cb=c.expr.match.POS;c.fn.extend({find:function(a){for(var b=this.pushStack("","find",a),d=0,e=0,f=this.length;e<f;e++){d=b.length;c.find(a,this[e],b);if(e>0)for(var h=d;h<b.length;h++)for(var l=0;l<d;l++)if(b[l]===b[h]){b.splice(h--,1);break}}return b},has:function(a){var b=c(a);return this.filter(function(){for(var d=0,e=b.length;d<e;d++)if(c.contains(this,b[d]))return true})},
not:function(a){return this.pushStack(ma(this,a,false),"not",a)},filter:function(a){return this.pushStack(ma(this,a,true),"filter",a)},is:function(a){return!!a&&c.filter(a,this).length>0},closest:function(a,b){var d=[],e,f,h=this[0];if(c.isArray(a)){var l,k={},o=1;if(h&&a.length){e=0;for(f=a.length;e<f;e++){l=a[e];k[l]||(k[l]=c.expr.match.POS.test(l)?c(l,b||this.context):l)}for(;h&&h.ownerDocument&&h!==b;){for(l in k){e=k[l];if(e.jquery?e.index(h)>-1:c(h).is(e))d.push({selector:l,elem:h,level:o})}h=
h.parentNode;o++}}return d}l=cb.test(a)?c(a,b||this.context):null;e=0;for(f=this.length;e<f;e++)for(h=this[e];h;)if(l?l.index(h)>-1:c.find.matchesSelector(h,a)){d.push(h);break}else{h=h.parentNode;if(!h||!h.ownerDocument||h===b)break}d=d.length>1?c.unique(d):d;return this.pushStack(d,"closest",a)},index:function(a){if(!a||typeof a==="string")return c.inArray(this[0],a?c(a):this.parent().children());return c.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var d=typeof a==="string"?c(a,b||this.context):
c.makeArray(a),e=c.merge(this.get(),d);return this.pushStack(!d[0]||!d[0].parentNode||d[0].parentNode.nodeType===11||!e[0]||!e[0].parentNode||e[0].parentNode.nodeType===11?e:c.unique(e))},andSelf:function(){return this.add(this.prevObject)}});c.each({parent:function(a){return(a=a.parentNode)&&a.nodeType!==11?a:null},parents:function(a){return c.dir(a,"parentNode")},parentsUntil:function(a,b,d){return c.dir(a,"parentNode",d)},next:function(a){return c.nth(a,2,"nextSibling")},prev:function(a){return c.nth(a,
2,"previousSibling")},nextAll:function(a){return c.dir(a,"nextSibling")},prevAll:function(a){return c.dir(a,"previousSibling")},nextUntil:function(a,b,d){return c.dir(a,"nextSibling",d)},prevUntil:function(a,b,d){return c.dir(a,"previousSibling",d)},siblings:function(a){return c.sibling(a.parentNode.firstChild,a)},children:function(a){return c.sibling(a.firstChild)},contents:function(a){return c.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:c.makeArray(a.childNodes)}},function(a,
b){c.fn[a]=function(d,e){var f=c.map(this,b,d);Za.test(a)||(e=d);if(e&&typeof e==="string")f=c.filter(e,f);f=this.length>1?c.unique(f):f;if((this.length>1||ab.test(e))&&$a.test(a))f=f.reverse();return this.pushStack(f,a,bb.call(arguments).join(","))}});c.extend({filter:function(a,b,d){if(d)a=":not("+a+")";return b.length===1?c.find.matchesSelector(b[0],a)?[b[0]]:[]:c.find.matches(a,b)},dir:function(a,b,d){var e=[];for(a=a[b];a&&a.nodeType!==9&&(d===B||a.nodeType!==1||!c(a).is(d));){a.nodeType===1&&
e.push(a);a=a[b]}return e},nth:function(a,b,d){b=b||1;for(var e=0;a;a=a[d])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){for(var d=[];a;a=a.nextSibling)a.nodeType===1&&a!==b&&d.push(a);return d}});var za=/ jQuery\d+="(?:\d+|null)"/g,$=/^\s+/,Aa=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Ba=/<([\w:]+)/,db=/<tbody/i,eb=/<|&#?\w+;/,Ca=/<(?:script|object|embed|option|style)/i,Da=/checked\s*(?:[^=]|=\s*.checked.)/i,fb=/\=([^="'>\s]+\/)>/g,P={option:[1,
"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};P.optgroup=P.option;P.tbody=P.tfoot=P.colgroup=P.caption=P.thead;P.th=P.td;if(!c.support.htmlSerialize)P._default=[1,"div<div>","</div>"];c.fn.extend({text:function(a){if(c.isFunction(a))return this.each(function(b){var d=
c(this);d.text(a.call(this,b,d.text()))});if(typeof a!=="object"&&a!==B)return this.empty().append((this[0]&&this[0].ownerDocument||t).createTextNode(a));return c.text(this)},wrapAll:function(a){if(c.isFunction(a))return this.each(function(d){c(this).wrapAll(a.call(this,d))});if(this[0]){var b=c(a,this[0].ownerDocument).eq(0).clone(true);this[0].parentNode&&b.insertBefore(this[0]);b.map(function(){for(var d=this;d.firstChild&&d.firstChild.nodeType===1;)d=d.firstChild;return d}).append(this)}return this},
wrapInner:function(a){if(c.isFunction(a))return this.each(function(b){c(this).wrapInner(a.call(this,b))});return this.each(function(){var b=c(this),d=b.contents();d.length?d.wrapAll(a):b.append(a)})},wrap:function(a){return this.each(function(){c(this).wrapAll(a)})},unwrap:function(){return this.parent().each(function(){c.nodeName(this,"body")||c(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,true,function(a){this.nodeType===1&&this.appendChild(a)})},
prepend:function(){return this.domManip(arguments,true,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,false,function(b){this.parentNode.insertBefore(b,this)});else if(arguments.length){var a=c(arguments[0]);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,false,function(b){this.parentNode.insertBefore(b,
this.nextSibling)});else if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,c(arguments[0]).toArray());return a}},remove:function(a,b){for(var d=0,e;(e=this[d])!=null;d++)if(!a||c.filter(a,[e]).length){if(!b&&e.nodeType===1){c.cleanData(e.getElementsByTagName("*"));c.cleanData([e])}e.parentNode&&e.parentNode.removeChild(e)}return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++)for(b.nodeType===1&&c.cleanData(b.getElementsByTagName("*"));b.firstChild;)b.removeChild(b.firstChild);
return this},clone:function(a){var b=this.map(function(){if(!c.support.noCloneEvent&&!c.isXMLDoc(this)){var d=this.outerHTML,e=this.ownerDocument;if(!d){d=e.createElement("div");d.appendChild(this.cloneNode(true));d=d.innerHTML}return c.clean([d.replace(za,"").replace(fb,'="$1">').replace($,"")],e)[0]}else return this.cloneNode(true)});if(a===true){na(this,b);na(this.find("*"),b.find("*"))}return b},html:function(a){if(a===B)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(za,""):null;
else if(typeof a==="string"&&!Ca.test(a)&&(c.support.leadingWhitespace||!$.test(a))&&!P[(Ba.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Aa,"<$1></$2>");try{for(var b=0,d=this.length;b<d;b++)if(this[b].nodeType===1){c.cleanData(this[b].getElementsByTagName("*"));this[b].innerHTML=a}}catch(e){this.empty().append(a)}}else c.isFunction(a)?this.each(function(f){var h=c(this);h.html(a.call(this,f,h.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(c.isFunction(a))return this.each(function(b){var d=
c(this),e=d.html();d.replaceWith(a.call(this,b,e))});if(typeof a!=="string")a=c(a).detach();return this.each(function(){var b=this.nextSibling,d=this.parentNode;c(this).remove();b?c(b).before(a):c(d).append(a)})}else return this.pushStack(c(c.isFunction(a)?a():a),"replaceWith",a)},detach:function(a){return this.remove(a,true)},domManip:function(a,b,d){var e,f,h,l=a[0],k=[];if(!c.support.checkClone&&arguments.length===3&&typeof l==="string"&&Da.test(l))return this.each(function(){c(this).domManip(a,
b,d,true)});if(c.isFunction(l))return this.each(function(x){var r=c(this);a[0]=l.call(this,x,b?r.html():B);r.domManip(a,b,d)});if(this[0]){e=l&&l.parentNode;e=c.support.parentNode&&e&&e.nodeType===11&&e.childNodes.length===this.length?{fragment:e}:c.buildFragment(a,this,k);h=e.fragment;if(f=h.childNodes.length===1?h=h.firstChild:h.firstChild){b=b&&c.nodeName(f,"tr");f=0;for(var o=this.length;f<o;f++)d.call(b?c.nodeName(this[f],"table")?this[f].getElementsByTagName("tbody")[0]||this[f].appendChild(this[f].ownerDocument.createElement("tbody")):
this[f]:this[f],f>0||e.cacheable||this.length>1?h.cloneNode(true):h)}k.length&&c.each(k,Oa)}return this}});c.buildFragment=function(a,b,d){var e,f,h;b=b&&b[0]?b[0].ownerDocument||b[0]:t;if(a.length===1&&typeof a[0]==="string"&&a[0].length<512&&b===t&&!Ca.test(a[0])&&(c.support.checkClone||!Da.test(a[0]))){f=true;if(h=c.fragments[a[0]])if(h!==1)e=h}if(!e){e=b.createDocumentFragment();c.clean(a,b,e,d)}if(f)c.fragments[a[0]]=h?e:1;return{fragment:e,cacheable:f}};c.fragments={};c.each({appendTo:"append",
prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){c.fn[a]=function(d){var e=[];d=c(d);var f=this.length===1&&this[0].parentNode;if(f&&f.nodeType===11&&f.childNodes.length===1&&d.length===1){d[b](this[0]);return this}else{f=0;for(var h=d.length;f<h;f++){var l=(f>0?this.clone(true):this).get();c(d[f])[b](l);e=e.concat(l)}return this.pushStack(e,a,d.selector)}}});c.extend({clean:function(a,b,d,e){b=b||t;if(typeof b.createElement==="undefined")b=b.ownerDocument||
b[0]&&b[0].ownerDocument||t;for(var f=[],h=0,l;(l=a[h])!=null;h++){if(typeof l==="number")l+="";if(l){if(typeof l==="string"&&!eb.test(l))l=b.createTextNode(l);else if(typeof l==="string"){l=l.replace(Aa,"<$1></$2>");var k=(Ba.exec(l)||["",""])[1].toLowerCase(),o=P[k]||P._default,x=o[0],r=b.createElement("div");for(r.innerHTML=o[1]+l+o[2];x--;)r=r.lastChild;if(!c.support.tbody){x=db.test(l);k=k==="table"&&!x?r.firstChild&&r.firstChild.childNodes:o[1]==="<table>"&&!x?r.childNodes:[];for(o=k.length-
1;o>=0;--o)c.nodeName(k[o],"tbody")&&!k[o].childNodes.length&&k[o].parentNode.removeChild(k[o])}!c.support.leadingWhitespace&&$.test(l)&&r.insertBefore(b.createTextNode($.exec(l)[0]),r.firstChild);l=r.childNodes}if(l.nodeType)f.push(l);else f=c.merge(f,l)}}if(d)for(h=0;f[h];h++)if(e&&c.nodeName(f[h],"script")&&(!f[h].type||f[h].type.toLowerCase()==="text/javascript"))e.push(f[h].parentNode?f[h].parentNode.removeChild(f[h]):f[h]);else{f[h].nodeType===1&&f.splice.apply(f,[h+1,0].concat(c.makeArray(f[h].getElementsByTagName("script"))));
d.appendChild(f[h])}return f},cleanData:function(a){for(var b,d,e=c.cache,f=c.event.special,h=c.support.deleteExpando,l=0,k;(k=a[l])!=null;l++)if(!(k.nodeName&&c.noData[k.nodeName.toLowerCase()]))if(d=k[c.expando]){if((b=e[d])&&b.events)for(var o in b.events)f[o]?c.event.remove(k,o):c.removeEvent(k,o,b.handle);if(h)delete k[c.expando];else k.removeAttribute&&k.removeAttribute(c.expando);delete e[d]}}});var Ea=/alpha\([^)]*\)/i,gb=/opacity=([^)]*)/,hb=/-([a-z])/ig,ib=/([A-Z])/g,Fa=/^-?\d+(?:px)?$/i,
jb=/^-?\d/,kb={position:"absolute",visibility:"hidden",display:"block"},Pa=["Left","Right"],Qa=["Top","Bottom"],W,Ga,aa,lb=function(a,b){return b.toUpperCase()};c.fn.css=function(a,b){if(arguments.length===2&&b===B)return this;return c.access(this,a,b,true,function(d,e,f){return f!==B?c.style(d,e,f):c.css(d,e)})};c.extend({cssHooks:{opacity:{get:function(a,b){if(b){var d=W(a,"opacity","opacity");return d===""?"1":d}else return a.style.opacity}}},cssNumber:{zIndex:true,fontWeight:true,opacity:true,
zoom:true,lineHeight:true},cssProps:{"float":c.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,b,d,e){if(!(!a||a.nodeType===3||a.nodeType===8||!a.style)){var f,h=c.camelCase(b),l=a.style,k=c.cssHooks[h];b=c.cssProps[h]||h;if(d!==B){if(!(typeof d==="number"&&isNaN(d)||d==null)){if(typeof d==="number"&&!c.cssNumber[h])d+="px";if(!k||!("set"in k)||(d=k.set(a,d))!==B)try{l[b]=d}catch(o){}}}else{if(k&&"get"in k&&(f=k.get(a,false,e))!==B)return f;return l[b]}}},css:function(a,b,d){var e,f=c.camelCase(b),
h=c.cssHooks[f];b=c.cssProps[f]||f;if(h&&"get"in h&&(e=h.get(a,true,d))!==B)return e;else if(W)return W(a,b,f)},swap:function(a,b,d){var e={},f;for(f in b){e[f]=a.style[f];a.style[f]=b[f]}d.call(a);for(f in b)a.style[f]=e[f]},camelCase:function(a){return a.replace(hb,lb)}});c.curCSS=c.css;c.each(["height","width"],function(a,b){c.cssHooks[b]={get:function(d,e,f){var h;if(e){if(d.offsetWidth!==0)h=oa(d,b,f);else c.swap(d,kb,function(){h=oa(d,b,f)});if(h<=0){h=W(d,b,b);if(h==="0px"&&aa)h=aa(d,b,b);
if(h!=null)return h===""||h==="auto"?"0px":h}if(h<0||h==null){h=d.style[b];return h===""||h==="auto"?"0px":h}return typeof h==="string"?h:h+"px"}},set:function(d,e){if(Fa.test(e)){e=parseFloat(e);if(e>=0)return e+"px"}else return e}}});if(!c.support.opacity)c.cssHooks.opacity={get:function(a,b){return gb.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var d=a.style;d.zoom=1;var e=c.isNaN(b)?"":"alpha(opacity="+b*100+")",f=
d.filter||"";d.filter=Ea.test(f)?f.replace(Ea,e):d.filter+" "+e}};if(t.defaultView&&t.defaultView.getComputedStyle)Ga=function(a,b,d){var e;d=d.replace(ib,"-$1").toLowerCase();if(!(b=a.ownerDocument.defaultView))return B;if(b=b.getComputedStyle(a,null)){e=b.getPropertyValue(d);if(e===""&&!c.contains(a.ownerDocument.documentElement,a))e=c.style(a,d)}return e};if(t.documentElement.currentStyle)aa=function(a,b){var d,e,f=a.currentStyle&&a.currentStyle[b],h=a.style;if(!Fa.test(f)&&jb.test(f)){d=h.left;
e=a.runtimeStyle.left;a.runtimeStyle.left=a.currentStyle.left;h.left=b==="fontSize"?"1em":f||0;f=h.pixelLeft+"px";h.left=d;a.runtimeStyle.left=e}return f===""?"auto":f};W=Ga||aa;if(c.expr&&c.expr.filters){c.expr.filters.hidden=function(a){var b=a.offsetHeight;return a.offsetWidth===0&&b===0||!c.support.reliableHiddenOffsets&&(a.style.display||c.css(a,"display"))==="none"};c.expr.filters.visible=function(a){return!c.expr.filters.hidden(a)}}var mb=c.now(),nb=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
ob=/^(?:select|textarea)/i,pb=/^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,qb=/^(?:GET|HEAD)$/,Ra=/\[\]$/,T=/\=\?(&|$)/,ja=/\?/,rb=/([?&])_=[^&]*/,sb=/^(\w+:)?\/\/([^\/?#]+)/,tb=/%20/g,ub=/#.*$/,Ha=c.fn.load;c.fn.extend({load:function(a,b,d){if(typeof a!=="string"&&Ha)return Ha.apply(this,arguments);else if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var f=a.slice(e,a.length);a=a.slice(0,e)}e="GET";if(b)if(c.isFunction(b)){d=b;b=null}else if(typeof b===
"object"){b=c.param(b,c.ajaxSettings.traditional);e="POST"}var h=this;c.ajax({url:a,type:e,dataType:"html",data:b,complete:function(l,k){if(k==="success"||k==="notmodified")h.html(f?c("<div>").append(l.responseText.replace(nb,"")).find(f):l.responseText);d&&h.each(d,[l.responseText,k,l])}});return this},serialize:function(){return c.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?c.makeArray(this.elements):this}).filter(function(){return this.name&&
!this.disabled&&(this.checked||ob.test(this.nodeName)||pb.test(this.type))}).map(function(a,b){var d=c(this).val();return d==null?null:c.isArray(d)?c.map(d,function(e){return{name:b.name,value:e}}):{name:b.name,value:d}}).get()}});c.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){c.fn[b]=function(d){return this.bind(b,d)}});c.extend({get:function(a,b,d,e){if(c.isFunction(b)){e=e||d;d=b;b=null}return c.ajax({type:"GET",url:a,data:b,success:d,dataType:e})},
getScript:function(a,b){return c.get(a,null,b,"script")},getJSON:function(a,b,d){return c.get(a,b,d,"json")},post:function(a,b,d,e){if(c.isFunction(b)){e=e||d;d=b;b={}}return c.ajax({type:"POST",url:a,data:b,success:d,dataType:e})},ajaxSetup:function(a){c.extend(c.ajaxSettings,a)},ajaxSettings:{url:location.href,global:true,type:"GET",contentType:"application/x-www-form-urlencoded",processData:true,async:true,xhr:function(){return new E.XMLHttpRequest},accepts:{xml:"application/xml, text/xml",html:"text/html",
script:"text/javascript, application/javascript",json:"application/json, text/javascript",text:"text/plain",_default:"*/*"}},ajax:function(a){var b=c.extend(true,{},c.ajaxSettings,a),d,e,f,h=b.type.toUpperCase(),l=qb.test(h);b.url=b.url.replace(ub,"");b.context=a&&a.context!=null?a.context:b;if(b.data&&b.processData&&typeof b.data!=="string")b.data=c.param(b.data,b.traditional);if(b.dataType==="jsonp"){if(h==="GET")T.test(b.url)||(b.url+=(ja.test(b.url)?"&":"?")+(b.jsonp||"callback")+"=?");else if(!b.data||
!T.test(b.data))b.data=(b.data?b.data+"&":"")+(b.jsonp||"callback")+"=?";b.dataType="json"}if(b.dataType==="json"&&(b.data&&T.test(b.data)||T.test(b.url))){d=b.jsonpCallback||"jsonp"+mb++;if(b.data)b.data=(b.data+"").replace(T,"="+d+"$1");b.url=b.url.replace(T,"="+d+"$1");b.dataType="script";var k=E[d];E[d]=function(m){if(c.isFunction(k))k(m);else{E[d]=B;try{delete E[d]}catch(p){}}f=m;c.handleSuccess(b,w,e,f);c.handleComplete(b,w,e,f);r&&r.removeChild(A)}}if(b.dataType==="script"&&b.cache===null)b.cache=
false;if(b.cache===false&&l){var o=c.now(),x=b.url.replace(rb,"$1_="+o);b.url=x+(x===b.url?(ja.test(b.url)?"&":"?")+"_="+o:"")}if(b.data&&l)b.url+=(ja.test(b.url)?"&":"?")+b.data;b.global&&c.active++===0&&c.event.trigger("ajaxStart");o=(o=sb.exec(b.url))&&(o[1]&&o[1].toLowerCase()!==location.protocol||o[2].toLowerCase()!==location.host);if(b.dataType==="script"&&h==="GET"&&o){var r=t.getElementsByTagName("head")[0]||t.documentElement,A=t.createElement("script");if(b.scriptCharset)A.charset=b.scriptCharset;
A.src=b.url;if(!d){var C=false;A.onload=A.onreadystatechange=function(){if(!C&&(!this.readyState||this.readyState==="loaded"||this.readyState==="complete")){C=true;c.handleSuccess(b,w,e,f);c.handleComplete(b,w,e,f);A.onload=A.onreadystatechange=null;r&&A.parentNode&&r.removeChild(A)}}}r.insertBefore(A,r.firstChild);return B}var J=false,w=b.xhr();if(w){b.username?w.open(h,b.url,b.async,b.username,b.password):w.open(h,b.url,b.async);try{if(b.data!=null&&!l||a&&a.contentType)w.setRequestHeader("Content-Type",
b.contentType);if(b.ifModified){c.lastModified[b.url]&&w.setRequestHeader("If-Modified-Since",c.lastModified[b.url]);c.etag[b.url]&&w.setRequestHeader("If-None-Match",c.etag[b.url])}o||w.setRequestHeader("X-Requested-With","XMLHttpRequest");w.setRequestHeader("Accept",b.dataType&&b.accepts[b.dataType]?b.accepts[b.dataType]+", */*; q=0.01":b.accepts._default)}catch(I){}if(b.beforeSend&&b.beforeSend.call(b.context,w,b)===false){b.global&&c.active--===1&&c.event.trigger("ajaxStop");w.abort();return false}b.global&&
c.triggerGlobal(b,"ajaxSend",[w,b]);var L=w.onreadystatechange=function(m){if(!w||w.readyState===0||m==="abort"){J||c.handleComplete(b,w,e,f);J=true;if(w)w.onreadystatechange=c.noop}else if(!J&&w&&(w.readyState===4||m==="timeout")){J=true;w.onreadystatechange=c.noop;e=m==="timeout"?"timeout":!c.httpSuccess(w)?"error":b.ifModified&&c.httpNotModified(w,b.url)?"notmodified":"success";var p;if(e==="success")try{f=c.httpData(w,b.dataType,b)}catch(q){e="parsererror";p=q}if(e==="success"||e==="notmodified")d||
c.handleSuccess(b,w,e,f);else c.handleError(b,w,e,p);d||c.handleComplete(b,w,e,f);m==="timeout"&&w.abort();if(b.async)w=null}};try{var g=w.abort;w.abort=function(){w&&Function.prototype.call.call(g,w);L("abort")}}catch(i){}b.async&&b.timeout>0&&setTimeout(function(){w&&!J&&L("timeout")},b.timeout);try{w.send(l||b.data==null?null:b.data)}catch(n){c.handleError(b,w,null,n);c.handleComplete(b,w,e,f)}b.async||L();return w}},param:function(a,b){var d=[],e=function(h,l){l=c.isFunction(l)?l():l;d[d.length]=
encodeURIComponent(h)+"="+encodeURIComponent(l)};if(b===B)b=c.ajaxSettings.traditional;if(c.isArray(a)||a.jquery)c.each(a,function(){e(this.name,this.value)});else for(var f in a)da(f,a[f],b,e);return d.join("&").replace(tb,"+")}});c.extend({active:0,lastModified:{},etag:{},handleError:function(a,b,d,e){a.error&&a.error.call(a.context,b,d,e);a.global&&c.triggerGlobal(a,"ajaxError",[b,a,e])},handleSuccess:function(a,b,d,e){a.success&&a.success.call(a.context,e,d,b);a.global&&c.triggerGlobal(a,"ajaxSuccess",
[b,a])},handleComplete:function(a,b,d){a.complete&&a.complete.call(a.context,b,d);a.global&&c.triggerGlobal(a,"ajaxComplete",[b,a]);a.global&&c.active--===1&&c.event.trigger("ajaxStop")},triggerGlobal:function(a,b,d){(a.context&&a.context.url==null?c(a.context):c.event).trigger(b,d)},httpSuccess:function(a){try{return!a.status&&location.protocol==="file:"||a.status>=200&&a.status<300||a.status===304||a.status===1223}catch(b){}return false},httpNotModified:function(a,b){var d=a.getResponseHeader("Last-Modified"),
e=a.getResponseHeader("Etag");if(d)c.lastModified[b]=d;if(e)c.etag[b]=e;return a.status===304},httpData:function(a,b,d){var e=a.getResponseHeader("content-type")||"",f=b==="xml"||!b&&e.indexOf("xml")>=0;a=f?a.responseXML:a.responseText;f&&a.documentElement.nodeName==="parsererror"&&c.error("parsererror");if(d&&d.dataFilter)a=d.dataFilter(a,b);if(typeof a==="string")if(b==="json"||!b&&e.indexOf("json")>=0)a=c.parseJSON(a);else if(b==="script"||!b&&e.indexOf("javascript")>=0)c.globalEval(a);return a}});
if(E.ActiveXObject)c.ajaxSettings.xhr=function(){if(E.location.protocol!=="file:")try{return new E.XMLHttpRequest}catch(a){}try{return new E.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}};c.support.ajax=!!c.ajaxSettings.xhr();var ea={},vb=/^(?:toggle|show|hide)$/,wb=/^([+\-]=)?([\d+.\-]+)(.*)$/,ba,pa=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]];c.fn.extend({show:function(a,b,d){if(a||a===0)return this.animate(S("show",
3),a,b,d);else{d=0;for(var e=this.length;d<e;d++){a=this[d];b=a.style.display;if(!c.data(a,"olddisplay")&&b==="none")b=a.style.display="";b===""&&c.css(a,"display")==="none"&&c.data(a,"olddisplay",qa(a.nodeName))}for(d=0;d<e;d++){a=this[d];b=a.style.display;if(b===""||b==="none")a.style.display=c.data(a,"olddisplay")||""}return this}},hide:function(a,b,d){if(a||a===0)return this.animate(S("hide",3),a,b,d);else{a=0;for(b=this.length;a<b;a++){d=c.css(this[a],"display");d!=="none"&&c.data(this[a],"olddisplay",
d)}for(a=0;a<b;a++)this[a].style.display="none";return this}},_toggle:c.fn.toggle,toggle:function(a,b,d){var e=typeof a==="boolean";if(c.isFunction(a)&&c.isFunction(b))this._toggle.apply(this,arguments);else a==null||e?this.each(function(){var f=e?a:c(this).is(":hidden");c(this)[f?"show":"hide"]()}):this.animate(S("toggle",3),a,b,d);return this},fadeTo:function(a,b,d,e){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,d,e)},animate:function(a,b,d,e){var f=c.speed(b,
d,e);if(c.isEmptyObject(a))return this.each(f.complete);return this[f.queue===false?"each":"queue"](function(){var h=c.extend({},f),l,k=this.nodeType===1,o=k&&c(this).is(":hidden"),x=this;for(l in a){var r=c.camelCase(l);if(l!==r){a[r]=a[l];delete a[l];l=r}if(a[l]==="hide"&&o||a[l]==="show"&&!o)return h.complete.call(this);if(k&&(l==="height"||l==="width")){h.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY];if(c.css(this,"display")==="inline"&&c.css(this,"float")==="none")if(c.support.inlineBlockNeedsLayout)if(qa(this.nodeName)===
"inline")this.style.display="inline-block";else{this.style.display="inline";this.style.zoom=1}else this.style.display="inline-block"}if(c.isArray(a[l])){(h.specialEasing=h.specialEasing||{})[l]=a[l][1];a[l]=a[l][0]}}if(h.overflow!=null)this.style.overflow="hidden";h.curAnim=c.extend({},a);c.each(a,function(A,C){var J=new c.fx(x,h,A);if(vb.test(C))J[C==="toggle"?o?"show":"hide":C](a);else{var w=wb.exec(C),I=J.cur()||0;if(w){var L=parseFloat(w[2]),g=w[3]||"px";if(g!=="px"){c.style(x,A,(L||1)+g);I=(L||
1)/J.cur()*I;c.style(x,A,I+g)}if(w[1])L=(w[1]==="-="?-1:1)*L+I;J.custom(I,L,g)}else J.custom(I,C,"")}});return true})},stop:function(a,b){var d=c.timers;a&&this.queue([]);this.each(function(){for(var e=d.length-1;e>=0;e--)if(d[e].elem===this){b&&d[e](true);d.splice(e,1)}});b||this.dequeue();return this}});c.each({slideDown:S("show",1),slideUp:S("hide",1),slideToggle:S("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){c.fn[a]=function(d,e,f){return this.animate(b,
d,e,f)}});c.extend({speed:function(a,b,d){var e=a&&typeof a==="object"?c.extend({},a):{complete:d||!d&&b||c.isFunction(a)&&a,duration:a,easing:d&&b||b&&!c.isFunction(b)&&b};e.duration=c.fx.off?0:typeof e.duration==="number"?e.duration:e.duration in c.fx.speeds?c.fx.speeds[e.duration]:c.fx.speeds._default;e.old=e.complete;e.complete=function(){e.queue!==false&&c(this).dequeue();c.isFunction(e.old)&&e.old.call(this)};return e},easing:{linear:function(a,b,d,e){return d+e*a},swing:function(a,b,d,e){return(-Math.cos(a*
Math.PI)/2+0.5)*e+d}},timers:[],fx:function(a,b,d){this.options=b;this.elem=a;this.prop=d;if(!b.orig)b.orig={}}});c.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this);(c.fx.step[this.prop]||c.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a=parseFloat(c.css(this.elem,this.prop));return a&&a>-1E4?a:0},custom:function(a,b,d){function e(l){return f.step(l)}
var f=this,h=c.fx;this.startTime=c.now();this.start=a;this.end=b;this.unit=d||this.unit||"px";this.now=this.start;this.pos=this.state=0;e.elem=this.elem;if(e()&&c.timers.push(e)&&!ba)ba=setInterval(h.tick,h.interval)},show:function(){this.options.orig[this.prop]=c.style(this.elem,this.prop);this.options.show=true;this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur());c(this.elem).show()},hide:function(){this.options.orig[this.prop]=c.style(this.elem,this.prop);this.options.hide=true;
this.custom(this.cur(),0)},step:function(a){var b=c.now(),d=true;if(a||b>=this.options.duration+this.startTime){this.now=this.end;this.pos=this.state=1;this.update();this.options.curAnim[this.prop]=true;for(var e in this.options.curAnim)if(this.options.curAnim[e]!==true)d=false;if(d){if(this.options.overflow!=null&&!c.support.shrinkWrapBlocks){var f=this.elem,h=this.options;c.each(["","X","Y"],function(k,o){f.style["overflow"+o]=h.overflow[k]})}this.options.hide&&c(this.elem).hide();if(this.options.hide||
this.options.show)for(var l in this.options.curAnim)c.style(this.elem,l,this.options.orig[l]);this.options.complete.call(this.elem)}return false}else{a=b-this.startTime;this.state=a/this.options.duration;b=this.options.easing||(c.easing.swing?"swing":"linear");this.pos=c.easing[this.options.specialEasing&&this.options.specialEasing[this.prop]||b](this.state,a,0,1,this.options.duration);this.now=this.start+(this.end-this.start)*this.pos;this.update()}return true}};c.extend(c.fx,{tick:function(){for(var a=
c.timers,b=0;b<a.length;b++)a[b]()||a.splice(b--,1);a.length||c.fx.stop()},interval:13,stop:function(){clearInterval(ba);ba=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){c.style(a.elem,"opacity",a.now)},_default:function(a){if(a.elem.style&&a.elem.style[a.prop]!=null)a.elem.style[a.prop]=(a.prop==="width"||a.prop==="height"?Math.max(0,a.now):a.now)+a.unit;else a.elem[a.prop]=a.now}}});if(c.expr&&c.expr.filters)c.expr.filters.animated=function(a){return c.grep(c.timers,function(b){return a===
b.elem}).length};var xb=/^t(?:able|d|h)$/i,Ia=/^(?:body|html)$/i;c.fn.offset="getBoundingClientRect"in t.documentElement?function(a){var b=this[0],d;if(a)return this.each(function(l){c.offset.setOffset(this,a,l)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return c.offset.bodyOffset(b);try{d=b.getBoundingClientRect()}catch(e){}var f=b.ownerDocument,h=f.documentElement;if(!d||!c.contains(h,b))return d||{top:0,left:0};b=f.body;f=fa(f);return{top:d.top+(f.pageYOffset||c.support.boxModel&&
h.scrollTop||b.scrollTop)-(h.clientTop||b.clientTop||0),left:d.left+(f.pageXOffset||c.support.boxModel&&h.scrollLeft||b.scrollLeft)-(h.clientLeft||b.clientLeft||0)}}:function(a){var b=this[0];if(a)return this.each(function(x){c.offset.setOffset(this,a,x)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return c.offset.bodyOffset(b);c.offset.initialize();var d,e=b.offsetParent,f=b.ownerDocument,h=f.documentElement,l=f.body;d=(f=f.defaultView)?f.getComputedStyle(b,null):b.currentStyle;
for(var k=b.offsetTop,o=b.offsetLeft;(b=b.parentNode)&&b!==l&&b!==h;){if(c.offset.supportsFixedPosition&&d.position==="fixed")break;d=f?f.getComputedStyle(b,null):b.currentStyle;k-=b.scrollTop;o-=b.scrollLeft;if(b===e){k+=b.offsetTop;o+=b.offsetLeft;if(c.offset.doesNotAddBorder&&!(c.offset.doesAddBorderForTableAndCells&&xb.test(b.nodeName))){k+=parseFloat(d.borderTopWidth)||0;o+=parseFloat(d.borderLeftWidth)||0}e=b.offsetParent}if(c.offset.subtractsBorderForOverflowNotVisible&&d.overflow!=="visible"){k+=
parseFloat(d.borderTopWidth)||0;o+=parseFloat(d.borderLeftWidth)||0}d=d}if(d.position==="relative"||d.position==="static"){k+=l.offsetTop;o+=l.offsetLeft}if(c.offset.supportsFixedPosition&&d.position==="fixed"){k+=Math.max(h.scrollTop,l.scrollTop);o+=Math.max(h.scrollLeft,l.scrollLeft)}return{top:k,left:o}};c.offset={initialize:function(){var a=t.body,b=t.createElement("div"),d,e,f,h=parseFloat(c.css(a,"marginTop"))||0;c.extend(b.style,{position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",
height:"1px",visibility:"hidden"});b.innerHTML="<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";a.insertBefore(b,a.firstChild);d=b.firstChild;e=d.firstChild;f=d.nextSibling.firstChild.firstChild;this.doesNotAddBorder=e.offsetTop!==5;this.doesAddBorderForTableAndCells=
f.offsetTop===5;e.style.position="fixed";e.style.top="20px";this.supportsFixedPosition=e.offsetTop===20||e.offsetTop===15;e.style.position=e.style.top="";d.style.overflow="hidden";d.style.position="relative";this.subtractsBorderForOverflowNotVisible=e.offsetTop===-5;this.doesNotIncludeMarginInBodyOffset=a.offsetTop!==h;a.removeChild(b);c.offset.initialize=c.noop},bodyOffset:function(a){var b=a.offsetTop,d=a.offsetLeft;c.offset.initialize();if(c.offset.doesNotIncludeMarginInBodyOffset){b+=parseFloat(c.css(a,
"marginTop"))||0;d+=parseFloat(c.css(a,"marginLeft"))||0}return{top:b,left:d}},setOffset:function(a,b,d){var e=c.css(a,"position");if(e==="static")a.style.position="relative";var f=c(a),h=f.offset(),l=c.css(a,"top"),k=c.css(a,"left"),o=e==="absolute"&&c.inArray("auto",[l,k])>-1;e={};var x={};if(o)x=f.position();l=o?x.top:parseInt(l,10)||0;k=o?x.left:parseInt(k,10)||0;if(c.isFunction(b))b=b.call(a,d,h);if(b.top!=null)e.top=b.top-h.top+l;if(b.left!=null)e.left=b.left-h.left+k;"using"in b?b.using.call(a,
e):f.css(e)}};c.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),d=this.offset(),e=Ia.test(b[0].nodeName)?{top:0,left:0}:b.offset();d.top-=parseFloat(c.css(a,"marginTop"))||0;d.left-=parseFloat(c.css(a,"marginLeft"))||0;e.top+=parseFloat(c.css(b[0],"borderTopWidth"))||0;e.left+=parseFloat(c.css(b[0],"borderLeftWidth"))||0;return{top:d.top-e.top,left:d.left-e.left}},offsetParent:function(){return this.map(function(){for(var a=this.offsetParent||t.body;a&&!Ia.test(a.nodeName)&&
c.css(a,"position")==="static";)a=a.offsetParent;return a})}});c.each(["Left","Top"],function(a,b){var d="scroll"+b;c.fn[d]=function(e){var f=this[0],h;if(!f)return null;if(e!==B)return this.each(function(){if(h=fa(this))h.scrollTo(!a?e:c(h).scrollLeft(),a?e:c(h).scrollTop());else this[d]=e});else return(h=fa(f))?"pageXOffset"in h?h[a?"pageYOffset":"pageXOffset"]:c.support.boxModel&&h.document.documentElement[d]||h.document.body[d]:f[d]}});c.each(["Height","Width"],function(a,b){var d=b.toLowerCase();
c.fn["inner"+b]=function(){return this[0]?parseFloat(c.css(this[0],d,"padding")):null};c.fn["outer"+b]=function(e){return this[0]?parseFloat(c.css(this[0],d,e?"margin":"border")):null};c.fn[d]=function(e){var f=this[0];if(!f)return e==null?null:this;if(c.isFunction(e))return this.each(function(l){var k=c(this);k[d](e.call(this,l,k[d]()))});if(c.isWindow(f))return f.document.compatMode==="CSS1Compat"&&f.document.documentElement["client"+b]||f.document.body["client"+b];else if(f.nodeType===9)return Math.max(f.documentElement["client"+
b],f.body["scroll"+b],f.documentElement["scroll"+b],f.body["offset"+b],f.documentElement["offset"+b]);else if(e===B){f=c.css(f,d);var h=parseFloat(f);return c.isNaN(h)?f:h}else return this.css(d,typeof e==="string"?e:e+"px")}})})(window);
//【结束】jQuery v1.4.4


jQuery.noConflict(); // 避免宿主页面 $ 名字冲突

(function($) { // 该函数内可以使用 $ 调用 jQuery
    'use strict';
    console.log("------ WebCatPK Loading Started ------");
    //console.log("Testing ExcelJS...", window.ExcelJS != null);
    console.log("Testing SheetJS...", window.XLSX != null);


    // 本工具仅在简体中文界面下开启
    const flagHTMLLanguage = $("html").attr("lang");
    console.log(`网页语种 <html lang='${flagHTMLLanguage}' />`); // 反引号格式化字符串
    if (flagHTMLLanguage != "zh-CN")
        return;


    //////////////////////////////////////////////////////////////////////////
    //【开始】UTF8 Base64 编码工具
    // 缩减改编自他人代码 https://www.npmjs.com/package/jquery-base64-js 
    // 本脚本中，调用 btoaUTF8() 用于 <a href='data:*** base64, XXXX'> 编码生成 download 文件
    // encodeURIComponent() 无法转换 ' 等文本常见字符，更不可能保存二进制文件，弃用，必需 Base64

    /*!
    * jquery.base64.js 0.0.3 - https://github.com/yckart/jquery.base64.js
    * Makes Base64 en & -decoding simpler as it is.
    *
    * Based upon: https://gist.github.com/Yaffle/1284012
    *
    * Copyright (c) 2012 Yannick Albert (http://yckart.com)
    * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
    * 2013/02/10
    **/

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    a256 = '',
    r64 = [256],
    r256 = [256],
    i = 0;
  
    function UTF8encode(strUni) {
        // use regular expressions & String.replace callback function for better efficiency
        // than procedural approaches
        var strUtf = strUni.replace(/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
        })
        .replace(/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
        });
        return strUtf;
    }

    while(i < 256) {
        var c = String.fromCharCode(i);
        a256 += c;
        r256[i] = i;
        r64[i] = b64.indexOf(c);
        ++i;
    }

    function code(s, discard, alpha, beta, w1, w2) {
        s = String(s);
        var buffer = 0,
            i = 0,
            length = s.length,
            result = '',
            bitsInBuffer = 0;
    
        while(i < length) {
            var c = s.charCodeAt(i);
            c = c < 256 ? alpha[c] : -1;
    
            buffer = (buffer << w1) + c;
            bitsInBuffer += w1;
    
            while(bitsInBuffer >= w2) {
                bitsInBuffer -= w2;
                var tmp = buffer >> bitsInBuffer;
                result += beta.charAt(tmp);
                buffer ^= tmp << bitsInBuffer;
            }
            ++i;
        }
        if(!discard && bitsInBuffer > 0) result += beta.charAt(buffer << (w2 - bitsInBuffer));
        return result;
    }
    //【函数】业务代码中调用这个 btoaUTF8() 函数即可
    function btoaUTF8(plain) {
        plain = UTF8encode(plain);
        plain = code(plain, false, r256, b64, 8, 6);
        return plain + '===='.slice((plain.length % 4) || 4);
    }
    //【结束】UTF8 Base64 编码工具

    //////////////////////////////////////////////////////////////////////////
    // 全局通用界面

    //////////////////////////////////////////////////////////////////////////
    //【函数】当前日期时间的本地化格式转换，处理后供文件名使用
    function getFilenameTimestampNow(){
        const DateNow = new Date();
        // 三段简易日期时间 yyyy-MMdd-hhmm 省略秒数
        const dateString = DateNow.toLocaleDateString()        // 形如：2023/2/1
                                  .replace(/\/(\d)\//, "/0$1/") // 月份可能一位数，补零
                                  .replace(/\/(\d)$/, "/0$1")  // 日子可能一位数，补零
                                  .replace(/(\d{4})\/(\d\d)\/(\d\d)/, "$1-$2$3") // 改为 yyyy-MMdd
                         + "-"
                         + DateNow.toLocaleTimeString()        // 形如：17:03:52
                                  .replace(/(\d\d):(\d\d):\d\d/, "$1$2");
        console.log("getFilenameTimestampNow() 返回值 (yyyy-MMdd-hhmm):", dateString);
        return dateString;
    }

    //【函数】判断操作系统，确定换行符组成
    // navigator.platform 已被弃用，但本脚本无妨沿用
    // 正则 i 标识：忽略大小写
    const getNewLineChar = () => /Win32|Windows/i.test(navigator.platform) ? "\r\n" : (/macintosh|mac os x/i.test(navigator.platform) ? "\r" : "\n");
    // 输出换行符相关调试信息
    const newLineChar = getNewLineChar();
    console.log("UA OS (navigator.platform):", (newLineChar == "\r\n" ? "Windows" : ( newLineChar == "\r" ? "macOS" : "Other (Unix/Linux...)")));

    //【函数】从二维数组获取 TSV 文本
    // 每行各列用水平制表符连接，各行用换行符连接，最后返回一整个字符串
    const getTSVfromAoA = (aoa) => aoa.map((cols) => cols.join("\t")).join(getNewLineChar());

    //【函数】字符串排序
    // 如果系统支持 localeCompare() 则采用本地字符比较，即按汉语拼音排序，用于 sort()
    const compareString = (a, b) => (String.prototype.localeCompare ? a.localeCompare(b, "zh") : (a > b ? 1 : (a < b ? -1 : 0)));

    //【函数】下拉框选项按内部文本排序
    // 按 selector 提取 select innerHTML，其中各 option 原本换行分开
    // 拆成数组元素，分别用 jQuery 选择器 $() 封装再提取 innerText 做比较
    // 比较后用换行连接，最后当作 innerHTML 回填 selector
    const sortSelectByOptionText = (selector) => $(selector).html($(selector).html().split("\n").sort((a, b) => compareString($(a).text(), $(b).text())).join("\n"));

    //【函数】返回一个 Sirsi 原生样式的栏位面板 jQuery 选择器
    // 参数：外围 div 的 ID 和 CSS 类，h3 小标题文字
    const generateWebCatPanel = (elementID, cssClass, h3text) => $(`<div class="content_container ${cssClass}" id="${elementID}">`
    + `<div class="content"><h3>${h3text}</h3></div>`
    + '<div class="top_edge"></div>'
    + '<div class="right_edge"></div>'
    + '<div class="bottom_edge"></div>'
    + '<div class="left_edge"></div>'
    + '<div class="top_left"></div>'
    + '<div class="top_right"></div>'
    + '<div class="bottom_right"></div>'
    + '<div class="bottom_left"></div></div>"))');

    //【函数】深度复制保存原表（全部元素值复制）
    const getDuplicatedAoA = (aoa) => aoa.map((array) => Array.from(array));

    //////////////////////////////////////////////////////////////////////////
    // 初始化帮助信息 ID
    // 不同的专用业务界面会重新赋值
    // 缺省值不会显示特定的帮助信息
    let idManPK = "GENERAL";

    // 记录原生的网页标题，以后随时可以改回来
    const originalDocumentTitle = document.title;

    //////////////////////////////////////////////////////////////////////////
    // 在标题图片和中文标题后面追加 PK 界面提示文字
    // 中文标题删节开头的英文
    $("div.branding").append($("<span class='powerkit_inline'>with PowerKit</span>"));
    const strNewHTML = $("div.branding_subheading").text().trim().replace(/(e-Library at \.{4})\s+(\S.+)/, "<span class='powerkit_original_inline'>$1 </span>$2<span class='powerkit_inline'> + 增强工具箱 v1.1</span>");
    $("div.branding_subheading").html(strNewHTML);

    //////////////////////////////////////////////////////////////////////////
    // 右栏面板
    // 寻找和整理右栏
    // 用同一个 jQuery 选择器兼容不同页面的不同类名
    if ($("div.details_right_column").length > 0)
        // 卡片页的右栏是 .details_right_column
        var $right_column = $("div.details_right_column");
    else if ($("div.right_column").length > 0)
        // 很多其他页面右栏是 .right_column
        var $right_column = $("div.right_column");
    else if ($("div.pct25").length > 0)
        // 个别页面右栏是 .column.pct25 就按 .pct25 算
        var $right_column = $("div.pct25");
    else if ($("div.pct100").length > 0) {
        // 如果只有通栏，缩窄宽度，右边新增一栏 .right_column
        $("div.pct100").removeClass("pct100")
                       .addClass("pct75")
                       .after($("<div class='column pct25 right_column'></div>"));
        var $right_column = $("div.right_column");
    } else if ($("div.pct50").length == 2) {
        // 如果是等宽两栏，不改宽度，右栏加类 .right_column
        $("div.pct50:last").addClass("right_column");
        var $right_column = $("div.right_column");
    } else {
        // 其他情况中止脚本（退出最外围匿名函数）
        console.log('*** 无处安放 PowerKit 控制面板 ***');
        return;            
    }

    // 最下方插入一块新的面板，套用 Sirsi 原生样式
    // 有些页面没有右栏，要自建右栏，所以一律新建，而不要找一个现成的 clone() 然后 empty()
    $right_column.append(generateWebCatPanel("divPowerKit", "", "PowerKit 工具箱"));
    $("#divPowerKit h3").after('<ul id="ulPowerKit"></ul>');
    $("#ulPowerKit").after('<span class="powerkit_source">以上功能由<a href="https://greasyfork.org/" target="_blank">用户脚本</a>生成</span></div>');

    // PK 增强功能界面开关
    $("#ulPowerKit").append($("<li style='display: block!important;'></li>")); // 别让开关把自己隐藏掉，所以 !important
    $("#ulPowerKit > li").append($("<label>启用增强功能</label>"));
    $("#ulPowerKit > li > label").prepend($("<input id='chkPKEnhancements' type='checkbox' />"));
    // 从油猴扩展系统的本机设置读取，第二个参数 true 为无存储的缺省值（初始化启用）
    $("#chkPKEnhancements").attr("checked", GM_getValue("WannaShow", true));
    console.log("GM_getValue('WannaShow'); // 读取设置："
               + GM_getValue("WannaShow"), GM_getValue("WannaShow") ? "启用" : "停用");
    // 绑定复选框事件
    $("#chkPKEnhancements").click(refreshPKEnhancementVis); // 定义见后面
    
    // 全部清空 PK 增强工具箱油猴设置按钮
    // 关闭 PK 界面后才会显示出来
    $("#ulPowerKit > li").append($("<button type='button' class='powerkit_original_block'>清空增强工具箱本机设置</button>"));
    $("#ulPowerKit > li > button.powerkit_original_block").click(() => {
        const willDeleteValues = "确定要清空设置吗？索书清单、馆藏分类浏览最后视图、索书号检索参数等，将被清除。下次启用 PowerKit 工具箱，会恢复初始设置。";
        if (confirm(willDeleteValues)) {
            const GMValueNum = GM_listValues().length;
            GM_listValues().forEach((key, indexNum) => GM_deleteValue(key));
            alert(`全部 PowerKit 增强工具箱设置，共 ${GMValueNum} 条，已清除完毕！`);
        }
    });

    // 自动刷新
    // 针对原生系统行为：setTimeout(function() { var pop = new myPop(); pop.popOut("您的登录会话已处于非活动状态一段时间了。 您将会在 60 秒的非活动状态后被自动退出本次会话。"); }, (840-60)*1000);
    // 翻译一下：14 分钟（840 秒）后，会话超时，所以提前一分钟弹出一个 modal 对话框 (.square)，底下还有蒙板 (.overdiv) 提醒用户 60 秒后超时；如果用户点击确认后在 OPAC 中做其他联系服务器的操作，就不会超时，如果不理睬，就会超时，会话断开
    // 设置自动刷新的延时秒数
    let secondsRemain = 840 - 5; // 比系统超时提前 5s 自动刷新
    const milisecBeforeAutoRefresh = secondsRemain * 1000;
    let startActualTime = Date.now();
    // 构造自动刷新启用开关 + 倒计时显示
    // 初始化总是开启；如果关闭，或整个关闭 PK 增强界面，到时候就不会自动刷新
    // 初始显示文字 e.g.: 页面自动刷新（还有 13 分 55 秒）
    $("#ulPowerKit").append($(`<li class='powerkit_block'><label title='会话超时前，页面自动刷新以保持连接，确保操作体验连续。'><input id='chkAutoRefresh' type='checkbox' checked='checked' />页面自动刷新（还有 <span id='spanAutoRefreshInMinutes'>${parseInt(secondsRemain/60)}</span> 分 <span id='spanAutoRefreshInSeconds'>${secondsRemain%60}</span> 秒）</label></li>`));
    //【函数】自动刷新倒计时显示
    function countDownAutoRefresh() {
        // 递归调用导致延时累积误差巨大
        // 可以根据系统时间计算误差
        const pastActualTime = Date.now() - startActualTime;
        const pastCoutDownTime = milisecBeforeAutoRefresh - secondsRemain * 1000;
        //if (pastCoutDownTime <= 15000 || secondsRemain <= 20) // 调试输出
        //    console.log(`R: ${secondsRemain} || Act ${pastActualTime} - Cd ${pastCoutDownTime} = ERR ${pastActualTime - pastCoutDownTime}`, " >> TOO SLOW?", pastActualTime - pastCoutDownTime > 1000);
        if (pastActualTime - pastCoutDownTime > 1000)
            // 误差补偿
            secondsRemain--;
        // 更新倒计时分秒数
        $("#spanAutoRefreshInMinutes").text(parseInt(secondsRemain / 60)); // 整除
        $("#spanAutoRefreshInSeconds").text(secondsRemain % 60);           // 余数
        // 剩余时间减一秒
        if (--secondsRemain <= 0)
            // 倒计时结束？
            if ($("#chkPKEnhancements").attr("checked") && $("#chkAutoRefresh").attr("checked"))
                // 超时之前，如果 PK 启用且自动刷新也启用，接下来自动刷新网页
                self.location.reload(); // 当然也就退出递归了
            else
                // 如果不做自动刷新，显示文字改为提醒已超时，退出递归，终止倒计时
                return $("#chkAutoRefresh").parent().parent().html("已超时，请手动刷新页面，或打开<a href='/'>新的馆藏目录会话。</a>").addClass("redBold");
        if (secondsRemain < 180)
            // 三分钟倒计时起，显示文字 label 改为红色加粗
            $("#chkAutoRefresh").parent().addClass("redBold");
        if (secondsRemain > 0)
            // 延时递归调用，直到倒计时为 0
            setTimeout(countDownAutoRefresh, 1000);
    }
    // 第一次倒计时不设延时
    countDownAutoRefresh();
    
    //////////////////////////////////////////////////////////////////////////
    // 底部footer_container


    //////////////////////////////////////////////////////////////////////////
    // 专用功能界面

    //////////////////////////////////////////////////////////////////////////
    // 登录用户相关界面
    // 获取 WebCat 用户登录会话 ID（个人识别号）
    // 来源：当前网址中的连续 8 或 9 位数字，或 "0"（未登录）
    // 用途：构造快捷链接，类似：`http://162.105.138.200/uhtbin/cgisirsi/0/0/${userSessionID}/92`
    // 该 ID 之后的一级或多级“路径”代表不同的 WebCat 业务功能
    // TODO 有问题，暂时无法实现含有 ID 的链接
    const tmpMatchedSessionID = self.location.href.replace(/.+\/(\d{8,9})\/.+/, "$1");
    const userSessionID = /^http/.test(tmpMatchedSessionID) ? "0" : tmpMatchedSessionID;
    console.log("用户登录会话 ID =", userSessionID, (userSessionID == 0 ? "// 未登录" : ""));
    // 获取用户名称
    const userName = $("div.user_first_name").text().trim().replace(/欢迎您 (.+)!/, "$1"); // replace() 不怕空值
    console.log("用户名称：" + (userName == "" ? "（无） // 未登录" : userName));
    // 右上角用户名下方增加一个“退出登录”链接
    // 套用原生登录按钮样式，去掉下划线
    if (userName != "") {
        $("div.user_first_name").append($("<p class='powerkit_block'></a>"));
        $("div.user_first_name > .powerkit_block").append($("li.menu_link > a:contains('退出登录'):eq(0)").clone().addClass("login_button").css("text-decoration", "none"));
    }

    //////////////////////////////////////////////////////////////////////////
    // 馆藏卡片页增强
    // （I）复制书目详细信息
    // （II）索书清单
    // TODO 3）馆别馆址地理信息——在 butAddCallSlip 生成时同步添加（馆别+馆址）

    if ($("div.pct75 .item_details").length >0) {
        idManPK = "馆藏卡片页";

        //（0）界面调整
        // 替换标题 Item Details 为中文
        $("div.item_details h3:contains('Item Details')")
            .addClass("powerkit_original_block")
            .after($("<h3 class='powerkit_block'>馆藏详细信息（卡片页）</h3>"));
        // 右栏“相关类别”限高
        // 原生界面该板块有时候能显示十多条，太高了！
        // 限制到 196px 并自动出现滚动条
        $(".pct25 h3:contains('相关类别')").parent().addClass("maxHeightLimited196");
        // 右栏：隐藏琐碎的原生版块
        $(".pct25 h3:contains('延伸查询')").parent().parent().addClass("powerkit_original_block");
        $(".pct25 h3:contains('OpenURL')").parent().parent().addClass("powerkit_original_block");
        $(".pct25 h3:contains('检索')").parent().parent().addClass("powerkit_original_block");

        //（I）快捷复制书目详细信息功能
        // 馆藏详细信息：#detail_item_information // 相当于“简略”题名报表 + 馆藏分布信息
        // 书目相关信息：#detail_marc_record      // 默认为“完全”题名报表，也可从选项改成 ALL 类型
        // 非格式化选项：dt/dd.viewmarctags       // 默认否：MARC 描述性字段名称
        //              dt/dd.unformatted        // 可选是：MARC 数字式字段名称
        // 左栏：复制书目详细信息命令 + 剪贴板透视
        // 融入原有的几个链接当中，而且不随右栏版块浮动，因为书目信息都在卡片页上方，用不着跟随浮动
        // 但也用上下两条 hr 括住，以免与上下其他命令混淆
        $("div.item_details ul.itemservices li").eq(-2).after($("<hr class='powerkit_block' />"))
                                                       .after($("<hr class='powerkit_block' />"));
        $("div.item_details ul.itemservices hr:last").before($("<li class='powerkit_block'><h3>增强功能</h3></li>"))
                                                     .before($("<li class='powerkit_block'><a id='aCopyMARC_KV'></a></li>"))
                                                     .before($("<li class='powerkit_block'><a id='aCopyMARC_HB'></a></li>"))
                                                     .before($("<pre class='powerkit_block' title='剪贴板透视'></pre>"));
        // 提取“书目相关信息”标签页下各字段数据
        const bibinfoTitle = $("#detail_marc_record .bibinfo strong").text();
        const bibinfoAuthor = $("#detail_marc_record .bibinfo").html().trim().replace(/[\s\S]+?<!-- Print the author, if one exists -->\s*(\S.*?)<br.+/, "$1");
        let MARC_HB = [
            ["TITLE", "AUTHOR"],           // [0] 存储字段名称，待追加
            [bibinfoTitle, bibinfoAuthor]  // [1] 存储字段值，待追加
        ];
        $("#detail_marc_record > dl > dt").each((ind, thisDT) => {
            // 提取字段名称，追加到 [0]
            if ($(thisDT).hasClass("viewmarctags"))
                // 描述性：删除末尾的冒号
                MARC_HB[0].push($(thisDT).text().trim().match(/(.+):/)[1]);
            else  // 必定是 .unformatted
                // 数字式：删除中间的多余换行、空格，删除末尾的冒号，但保留中间的冒号
                MARC_HB[0].push($(thisDT).text().trim().replace(/\s/g, "").replace(/(.+):$/,"$1"));
        });
        $("#detail_marc_record > dl > dd").each((ind, thisDD) => {
            // 提取字段值，追加到 [1]
            if ($(thisDD).hasClass("viewmarctags"))
                // 描述性
                MARC_HB[1].push($(thisDD).text().trim());
            else  // 必定是 .unformatted
                // 数字式：删除开头冒号及随后的多余换行、空格
                MARC_HB[1].push($(thisDD).text().trim().replace(/^:\s*/,""));
        });
        // 随书光盘信息
        // 有的书实际没有随书光盘，但网页中仍然隐藏了这个信息，只会打开申请链接
        // 描述性字段名称方式下真有的才会显示，没有的就不显示；数字式字段名称方式下都是隐藏提供的
        // 本功能不做判断，一律提取
        // 不在 #detail_marc_record > dl 里；其 dt/dd 缺少 dl 容器而直属 #detail_marc_record
        const $dtCD = $("#detail_marc_record > dt.viewmarctags:contains('随书光盘下载')");
        if ($dtCD.length > 0) {
            // 随书光盘系统当前 IP = 162\.105\.138\.112 （正则表达式的字符实体 . 前加 \ 转义）
            MARC_HB[0].push("随书光盘下载");
            MARC_HB[1].push($dtCD.next().html().match(/(http:\/\/162\.105\.138\.112\/.+)">CD/)[1]);
        }
        // 元素转置：MARC_HB -> MARC_KV
        let MARC_KV = [];
        MARC_HB[0].forEach((fieldName, index) => {
            MARC_KV.push([fieldName, MARC_HB[1][index]]);
        });
        // 保存到油猴设置
        GM_setValue("details_MARC_HB_TSV", getTSVfromAoA(MARC_HB));
        GM_setValue("details_MARC_KV_TSV", getTSVfromAoA(MARC_KV));
        
        // 一键复制书目详细信息（第一列是字段名称，第二列是值）
        $("#aCopyMARC_KV").text("复制书目详细信息（字段分行 TSV）")
                          .attr("href","#")
                          .attr("title", "复制到系统剪贴板")
                          .click(() => {
            // 读取油猴变量
            let MARC_TSV = GM_getValue("details_MARC_KV_TSV", "");
            // 复制到系统剪贴板
            GM_setClipboard(MARC_TSV);
            // 浏览器通知
            GM_notification("书目相关信息（字段分行）已复制到系统剪贴板，可以粘贴到文本编辑器或电子表格中使用。", "已复制到剪贴板");
            // 左栏显示预览
            $("div.item_details ul.itemservices pre").html(MARC_TSV.split(getNewLineChar()).join("<br />")).slideDown();
            // 模拟点击“书目相关信息”标签页
            $(".detail_marc_record").trigger("click");
            return false; // 阻止链接跳转
        });
        // 一键复制书目详细信息（第一行是表头即字段名称，第二行是值）
        $("#aCopyMARC_HB").text("复制书目详细信息（字段分列 TSV）")
                          .attr("href","#")
                          .attr("title", "复制到系统剪贴板")
                          .click(() => {
            // 读取油猴变量
            let MARC_TSV = GM_getValue("details_MARC_HB_TSV", "");
            // 复制到系统剪贴板
            GM_setClipboard(MARC_TSV);
            // 浏览器通知
            GM_notification("书目相关信息（字段分列）已复制到系统剪贴板，可以粘贴到文本编辑器或电子表格中使用。", "已复制到剪贴板");
            // 左栏显示预览
            $("div.item_details ul.itemservices pre").html(MARC_TSV.split(getNewLineChar()).join("<br />")).slideDown();
            // 模拟点击“书目相关信息”标签页
            $(".detail_marc_record").trigger("click");
            return false; // 阻止链接跳转
        });
        // “书目相关信息”后方增设“查看选项”链接
        $("li.detail_marc_record").after("<li class='powerkit_block'>［<a>查看选项</a>］</li>")
        $("li.detail_marc_record +li a").attr("href", "javascript: document.item_view.form_type.value = 'VOPTIONS'; document.item_view.submit();")
                                        .attr("title", "变更书目相关信息的记录篇幅（ALL/完全/简略），以及馆藏显示方式等。");


        //（II）临时索书清单
        // 利用油猴设置（CallSlips）存取一套临时收藏夹，用来收藏简单的书目信息+馆别+索书号+馆藏位置，形成馆藏清单，可方便借阅书刊
        // 在馆藏 table 中为逐个馆藏位置创建生成索书单按钮，存储 value = 索书单信息，用于向索书清单逐条添加索书单

        // 右栏：索书清单
        // 添加索书单后去掉 .empty 才会显示出来
        $("#ulPowerKit").append($("<li class='powerkit_block empty' id='liCallSlips'></li>"));
        $("#liCallSlips").append($("<h4>临时索书清单 (<span>0</span>)</h4>"));
        $("#liCallSlips").append($("<span></span>"));
        $("#liCallSlips").append($("<table><tr><th>　</th><th>题名</th><th>位置</th><th>索书号</th><th></th></tr></table>"));
        $("#liCallSlips > span").append($("<button type='button' id='butCallSlips_ClearAll'>全部清空</button>"))
                                .append($("<button type='button' id='butCallSlips_SorByTitle'>题名排序</button>"))
                                .append($("<button type='button' id='butCallSlips_SortByPlaces'>位置排序</button>"))
                                .append($("<button type='button' id='butCallSlips_DownloadTSV'>导出 TSV</button>"))
        if (window.XLSX) $("#liCallSlips > span").append($("<button type='button' id='butCallSlips_DownloadExcel'>导出 Excel</button>"));
        // 索书清单功能按钮
        // 全部清空按钮
        $("#butCallSlips_ClearAll").click(() => {
            if(confirm("临时索书清单，真的要全部清空吗？")){
                // 清空临时索书清单数据二维数组
                aoaCallSlips = [];
                // 清空油猴设置
                GM_deleteValue("CallSlips");
                // 删除索书清单表格各行（表头不删）
                $("#liCallSlips table tr.baseCallSlips").remove();
                $("#liCallSlips").addClass("empty");
            }
        });
        // 两种排序按钮：单击，对当前索书清单排序——
        // 题名排序按钮
        $("#butCallSlips_SorByTitle").click(() => {
            // 考虑到题名完全相同的可能，实际并不会只按题名排序
            // 参考：aoaCallSlips 每条记录元素的结构：[0] 题名, [1] 著者, [2]出版项, [3]馆别, [4]索书号, [5]馆藏位置
            // 而是先后按每条索书单的（1）题名（2）索书号（3）馆藏位置字段排序
            aoaCallSlips.sort((a, b) => {
                // [0] 题名  [3] 索书号  [4] 馆藏位置
                const compareTitle = compareString(a[0], b[0]);
                if (compareTitle == 0) {
                    const compareCallNumber = compareString(a[4], b[4]);
                    if (compareCallNumber == 0)
                        return compareString(a[5], b[5]);
                    return compareCallNumber;
                }
                return compareTitle;
            });
            // 保存到油猴设置
            GM_setValue("CallSlips", aoaCallSlips);
            // 索书清单表格：清空后重建
            rebuildCallSlipTableRows();
        });
        // 位置排序按钮
        $("#butCallSlips_SortByPlaces").click(() => {
            // 先后按每条索书单的（1）馆别（2）馆藏位置（3）索书号字段排序
            aoaCallSlips.sort((a, b) => {
                // [3] 馆别  [5] 馆藏位置  [4] 索书号
                const compareLibrary = compareString(a[3], b[3]);
                if (compareLibrary == 0) {
                    const compareLocation = compareString(a[5], b[5]);
                    if (compareLocation == 0)
                        return compareString(a[4], b[4]);
                    return compareLocation;
                }
                return compareLibrary;
            });
            // 保存到油猴设置
            GM_setValue("CallSlips", aoaCallSlips);
            // 索书清单表格：清空后重建
            rebuildCallSlipTableRows();
        });
        // 索书清单表头，供导出文件时另建带表头的二维数组用
        const arrCallSlipsHeader = ["题名", "著者", "出版项", "馆别", "索书号", "馆藏位置"];
        // 导出 TSV 按钮
        $("#butCallSlips_DownloadTSV").click(() => {
            // 另建一个带表头的索书清单二维数组
            let aoaCallSlipsPlusHeader = Array.from(aoaCallSlips);
            aoaCallSlipsPlusHeader.unshift(arrCallSlipsHeader);
            // 调用油猴的下载文件功能，凭空构造 Data URI (base64)
            GM_download({
                url: "data:text/tab-separated-values;base64," + btoaUTF8(getTSVfromAoA(aoaCallSlipsPlusHeader)),
                name: `索书清单-${getFilenameTimestampNow()}-(${aoaCallSlips.length}).txt`
            });
        });
        // 导出 Excel 按钮
        if (window.XLSX) $("#butCallSlips_DownloadExcel").click(() => {
            // 另建一个带表头的索书清单二维数组
            let aoaCallSlipsPlusHeader = Array.from(aoaCallSlips);
            aoaCallSlipsPlusHeader.unshift(arrCallSlipsHeader);
            // 调用 SheetJS 生成工作表，加入工作簿
            const sheetCallSlips = XLSX.utils.aoa_to_sheet(aoaCallSlipsPlusHeader);
            const wbCallSlips = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wbCallSlips, sheetCallSlips, "索书清单");
            // 社区版 SheetJS 无法修饰单元格格式，就这样了
            // 写入文件并被浏览器“下载”
            XLSX.writeFile(wbCallSlips, `索书清单-${getFilenameTimestampNow()}-(${aoaCallSlips.length}).xlsx`);
            return false; // 阻止链接前进
        });

        // 读取油猴设置，初始化临时索书清单数组
        var aoaCallSlips = GM_getValue("CallSlips", []);
        console.log("GM_getValue('CallSlips'); // 索书清单二维数组 aoaCallSlips\n", aoaCallSlips);

        //【函数】索书清单表格：清空后重建
        // 遍历 aoaCallSlips 二维数组，初始化构造每一条索书单
        function rebuildCallSlipTableRows() {
            // 索书清单表格：清空 tr（留下表头）
            $("#liCallSlips table tr.baseCallSlips").remove();
            // 索书清单表格：根据 aoaCallSlips 重建 tr
            aoaCallSlips.forEach((thisCallSlip, index) => {
                // 先都提取出来，其中 author, pub 不使用
                let [title, author, pub, library, callNumber, location] = thisCallSlip;
                // 馆别：删节“北大中心馆”，其他加粗显示
                if (library == "北大中心馆")
                    library = "";
                else
                    library = `<strong>${library}</strong>`;
                $("#liCallSlips > table").append($("<tr class='baseCallSlips'></tr>"));
                $("#liCallSlips tr:last").append($("<td title='删除这条索书单'><button type='button'>×</button></td>"))
                                        .append($(`<td title='题名：${title}'>${title}</td>`))
                                        .append($(`<td title='位置：${location}'>${library} ${location}</td>`))
                                        .append($(`<td title='索书号：${callNumber}'>${callNumber}</td>`))
                                        .append($(`<td class='hiddenData'>${index}</td>`));
                if (/^https?:/.test(callNumber)) {
                    // 网络资源类馆藏条目的索书号是一个网址，设为超链接
                    $("#liCallSlips tr:last td:eq(3)").html(`<a href='${callNumber}' target='_blank'>${callNumber}</a>`).attr("title", "点击访问资源网址");
                }
            });
            // 删除按钮：删除本条索书单
            $("#liCallSlips tr button").click((ev) => {
                // 从当前行找到索引，从临时索书清单数据二维数组中删除
                let index = $(ev.target).parent().parent().find("td").last().text();
                aoaCallSlips.splice(Number(index), 1);
                // 写入油猴设置，实现跨页保存
                GM_setValue("CallSlips", aoaCallSlips);
                // 删除索书清单界面当前行
                $(ev.target).parent().parent().remove();
                // 更新小标题后索书单数量
                $("#liCallSlips > h4 > span").text(aoaCallSlips.length);
                // 如果删到只剩下表头一行
                if ($("#liCallSlips tr").length == 1) {
                    // 清空油猴设置
                    GM_deleteValue("CallSlips");
                    // 隐藏索书清单界面
                    $("#liCallSlips").addClass("empty");
                }
            });
        }
        // 索书清单表格：清空后重建
        rebuildCallSlipTableRows();
        // 小标题后显示索书单数量
        $("#liCallSlips > h4 > span").text(aoaCallSlips.length);
        // 如果有索书单，就显示临时索书清单界面
        if (aoaCallSlips.length > 0) $("#liCallSlips").removeClass("empty");

        // 索书单生成界面
        // 为卡片页馆藏表格中每一个有单独馆藏位置的复本添加一个按钮，用于抄录索书号

        // 初始化当前馆别、索书号、馆藏位置（空字符串）
        let [currentLibrary, currentCallNumber, currentLocation] = ["", "", ""];
        // 初始化当前卡片页有效馆藏数据（空字典）
        let dictItemHoldings = {};
        
        // 获取卡片页中的出版项
        // a) 书目相关信息“出版信息”（格式化显示）
        // b) 书目相关信息 210/260 字段（非格式化显示）
        // c) 馆藏详细信息“出版者+出版日期”——缺少出版地，所以最后考虑
        // ——按以上顺次获取，优先的为空再尝试后一种

        // a) 书目相关信息“出版信息”（描述性字段名称）
        let pub = $("#detail_marc_record dl dt:contains('出版信息:') +dd").text().trim();
        // b) 非格式化显示的出版发行项（MARC 数字式字段名称）
        if (pub == "") pub = $("#detail_marc_record dl dt:contains('210:') +dd").text().trim(); // CNMARC F210
        if (pub == "") pub = $("#detail_marc_record dl dt:contains('260:') +dd").text().trim(); // USMARC F260
        // 子字段标志 |a |b |c |d 一律替换为空格；开头的冒号及空白字符全部剔除
        pub = pub.replace(/\|[abcd]/g, " ").replace(/^:\s*/, "");
        // c) 馆藏详细信息：出版者 + " " + 出版日期
        if (pub == "") pub = $("#detail_item_information dl dd.publisher").text().trim() + " "
                           + $("#detail_item_information dl dd.publishing_date").text().trim();
        console.log("卡片页书目出版项：" + pub);

        // 逐行遍历馆藏表格
        $("#detail_item_information tr").each((row, thisTR) => {
            // 获取馆别：跨四列的 .holdingsheader 单元格
            if ($(thisTR).find("td.holdingsheader[colspan='4']").length > 0) {
                currentLibrary = $(thisTR).find("td").text().trim();
                return; // 该行不可能还有索书号、馆藏位置等
            }
            // 凡是分成四列 .holdingslist 单元格的表格行，可能包含索书号、馆藏位置等
            if ($(thisTR).find("td.holdingslist").length == 4) {
                // 跳过订单表格，不用于生成索书单
                if (/(订购中|状态)/.test($(thisTR).find("td.holdingslist:eq(2)").text())) return;
                // 获取索书号：第一列非空、非“索书号”的单元格
                const tmpCol1 = $(thisTR).find("td.holdingslist:eq(0)").text().trim();
                if (tmpCol1 != "" && tmpCol1 != "索书号") {
                    // 加粗高亮显示
                    $(thisTR).find("td.holdingslist:eq(0)").html(`<span class='powerkit_bold'>${tmpCol1}</span>`);
                    // 网络资源的索书号改用网址代替，不用 OPAC 显示的“索书号”，那个没法用
                    if (currentLibrary == "网络资源")
                        // 网址来自馆藏详细信息里有 URL 图标的链接
                        currentCallNumber = $("#detail_item_information > ul.enriched_content > li.enrichment_container > a").attr("href");
                    else
                        // 非网络资源，就用 OPAC 表格里的索书号
                        currentCallNumber = tmpCol1;
                }
                // 获取馆藏位置：第四列非“馆藏位置”的单元格
                // 剔除多余的换行回车字符
                const tmpCol4 = $(thisTR).find("td.holdingslist:eq(3)").text().replace(/[\n\r]/g, "");
                if (tmpCol4 != "馆藏位置") {
                    // 获取馆藏位置文本，剔除所有多余空白字符，用于临时索书清单的储存和显示
                    currentLocation = tmpCol4.replace(/\s/g, "");
                    if (currentLocation == "") {
                        // 馆藏位置为空的书刊：一般是新书到馆，暂未上架，无论是否北大中心馆
                        currentLocation = "［暂未上架］";
                        // 明确标出来并高亮
                        $(thisTR).find("td.holdingslist:eq(3)").html(`<span class='powerkit_inline powerkit_darkred'>${currentLocation}</span>`);
                    } else {
                        //【函数】根据馆藏位置区分文字颜色
                        const getClassByLocation = (location) => {
                            // 短期不能借阅（见不着书）：红
                            if (/(到期|预约|馆际互借)/.test(location)) return "powerkit_darkred";
                            // 不能外借的（见得着，借不走）：黄
                            if (/(非流通)/.test(location)) return "powerkit_darkgoldenrod";
                            // 其他都是在馆在架（见得着，借得走）：绿
                            return "powerkit_green";
                        };
                        if (currentLibrary == "北大中心馆") {
                            // 根据北大中心馆的馆藏位置，判定是否可借出，据此高亮馆藏位置文字
                            const locationClass = getClassByLocation(tmpCol4);
                            $(thisTR).find("td.holdingslist:eq(3)").html(`<span class='${locationClass}'>${tmpCol4}</span>`);
                        }
                    }
                    // 登记一条有效馆藏数据
                    dictItemHoldings[row.toString()] = [bibinfoTitle, bibinfoAuthor, pub, currentLibrary, currentCallNumber, currentLocation];
                    // 创建按钮：抄录到临时索书清单
                    $(thisTR).find("td.holdingslist:eq(3)").prepend($("<button class='powerkit_inline butAddCallSlip' type='button'></button>"));
                    // 按钮的 value 保存馆藏表格的行数 row 作为字典 key
                    // 即按钮中的 $(ev.target).val()
                    $(thisTR).find(".butAddCallSlip").val(row);
                    // 添加索书单按钮命令
                    $(thisTR).find(".butAddCallSlip").click((ev) => {
                        // 从当前有效馆藏数据读取
                        let [title, author, pub, library, callNumber, location] = dictItemHoldings[$(ev.target).val()];
                        // 追加新索书单之前的数组长度即当前索引
                        const index = aoaCallSlips.length;
                        // 追加到临时索书清单数组
                        aoaCallSlips.push([title, author, pub, library, callNumber, location]);
                        // 写入油猴设置，实现跨页保存
                        GM_setValue("CallSlips", aoaCallSlips);
                        // 索书清单表格：清空后重建
                        // 这样做比单独创建一条要慢一点点，实际感觉不出来，重要的是代码不用重复写了，易于维护
                        rebuildCallSlipTableRows();
                        // 因为添加了一条，所以要更新小标题后索书单数量
                        $("#liCallSlips > h4 > span").text(aoaCallSlips.length);
                        // 无论是否已经显示，现在都显示索书清单
                        $("#liCallSlips").removeClass("empty");
                    });
                }
            }
        });
        console.log("当前有效馆藏数据 (dictItemHoldings)\n", dictItemHoldings);
        // 抄录索书单按钮的文字和鼠标悬停提示文字
        $("#detail_item_information .butAddCallSlip").text("Ｃ").attr("title","抄录到临时索书清单");
    }

    //////////////////////////////////////////////////////////////////////////
    // 馆别馆址增强
    // 用于卡片页等，凡显示馆别/馆址的页面
    // 馆别：院系分馆，含医院部几个主要分馆
    // 馆址：中心馆开放服务的主要馆址
    // 馆别信息：从主页 ajax 抓取
    /// 主页院系分馆 https://www.lib.pku.edu.cn/portal/cn/fg/yuanxifenguanlist
    /// ul.pagination li a 文本 2 开始所有的，构成后续页面，加上首页信息
    /// 右栏 right_column 创建容器（ifram），供显示馆别信息
    /// 左栏的馆别文字，生成复本 a href=data:text/html,xxx target=iframe

    //////////////////////////////////////////////////////////////////////////
    // 检索结果列表增强
    // 至少单数行(.odd_row)的数量要大于零
    if ($("ul.hit_list .odd_row").length > 0) {
        idManPK = "检索结果列表";

        // 当有检索结果时——
        // 获取检索结果数据列表：由多个 ul 元素序贯组成，而非 li 元素
        let $hitListItems = $("ul.hit_list ul.hit_list_row");
        console.log("当前页面检索结果数量：", $hitListItems.length);
        // 创建快速选择增强界面
        // 利用原有闲置的 .hit_list_buttons 容器
        $("li.hit_list_buttons").html("<button type='button'>全选</button>"
                                    + "　<button type='button'>反选</button>"
                                    + "　<button type='button'>全消</button>"
                                    + "　　<button type='button'>保存已选取的检索结果</button>"
                                    ).addClass("powerkit_block");
        // 套用 Sirsi 原生样式
        $("li.hit_list_buttons button").addClass("button");
        // 统一设置延时间隔
        // 每次点击 checkbox 并非单纯的客户端活动，而是都会请求 200 服务器，所以用 each() 并发 trigger() 几乎一定会有错漏
        // 间隔数值无需太长，比如 50 就可以，最多 20 条则 1s 遍历完成，用户体验也合格；总之不要搞并发，服务器就处理得过来
        var clickInterval = 50; // 毫秒
        // 全选
        $("li.hit_list_buttons > button:eq(0)").click(function (){
            // 模拟点击，延时递归调用，下次判断会从 value 被改变后列表的下一个元素开始
            function click_another_first_checkbox() {
                $("ul.hit_list > li:eq(2) > ul input.put_keepremove_cb[value='选取']").eq(0).trigger("click");
                if($("ul.hit_list > li:eq(2) > ul input.put_keepremove_cb[value='选取']").length > 0)
                    setTimeout(click_another_first_checkbox, clickInterval);
            }
            click_another_first_checkbox();
        });
        // 反选
        $("li.hit_list_buttons > button:eq(1)").click(function (){
            // 模拟点击，延时递归调用，全部轮一遍，不判断 checkbox 状态（属性值）
            var i = 0, hit_list_length = $("ul.hit_list > li:eq(2) > ul input.put_keepremove_cb").length;
            function click_another_checkbox() {
                $("ul.hit_list > li:eq(2) > ul input.put_keepremove_cb").eq(i++).trigger("click");
                if (i < hit_list_length)
                    setTimeout(click_another_checkbox, clickInterval);
            };
            click_another_checkbox();
        });
        // 全消
        $("li.hit_list_buttons > button:eq(2)").click(() => {
            // 弹出确认对话框，否：中止
            if ($("ul.hit_list > li:eq(2) > ul input.put_keepremove_cb[value='删除']").length == 0)
                return false;
            if (!window.confirm("消除本页内已经选取的全部项目，确定吗？"))
                return false;
            // 【递归函数】模拟点击，延时递归调用，下次判断会从 value 被改变后列表的下一个元素开始
            function click_another_first_checkbox() {
                $("ul.hit_list > li:eq(2) > ul input.put_keepremove_cb[value='删除']").eq(0).trigger("click");
                if($("ul.hit_list > li:eq(2) > ul input.put_keepremove_cb[value='删除']").length > 0)
                    setTimeout(click_another_first_checkbox, clickInterval);
            };
            click_another_first_checkbox();
        });
        // 方便按钮：打印/邮寄/保存
        $("li.hit_list_buttons > button:eq(3)").click(() => {
            // 原生界面抄来的，不懂
            document.hitlist.form_type.value = 'CAPTURE';
            document.hitlist.submit();
        });
        // 克隆一行刚刚构造的快速选择增强界面，放到检索结果列表的底部
        $("li.searchsum_container_bottom").before($("li.hit_list_buttons").clone(true)); // true 带事件
    }

    //////////////////////////////////////////////////////////////////////////
    // 打印/邮寄/保存（准备报表页面）增强
    if ($("div.kept_screen").length > 0) {
        idManPK = "打印邮寄保存";

        // 获取馆别下拉框所有选项 + 最后选项
        // 保存到油猴设置，供后续“题名级馆藏报表”（点击“查看”按钮）复刻使用
        GM_setValue("SavedItems_SelectLibraryOptions", $("#library").html());
        // 该下拉框改变时，记录最后选择的馆别选项
        $("#library").change((ev) => {
            GM_setValue("SavedItems_SelectedLibraryOption", ev.target.value);
            console.log("SavedItems_SelectedLibraryOption = " + GM_getValue("SavedItems_SelectedLibraryOption"));
        });
        // 不下拉变更也至少记录一次
        $("#library").trigger("change");

        // 标题后附加显示已选取的检索结果数
        let itemQty = $("ul.kept_list_options div.item").length;
        if( itemQty > 0 )
            $("div.kept_screen > .content > h3").append($(`<span class='powerkit_inline'>（已选取 ${itemQty} 条题名记录）</span>`)); // 反引号格式化字符串
        if($("#vopt_elst").length > 0) {
            // 替换“记录查看”控件：隐藏下拉框（select option）
            $("#vopt_elst").addClass("powerkit_original_inline");
            // 替换“记录查看”控件：换成单选框（input:radio）
            $("#vopt_elst").after($("<ul id='spanVoptRadio' class='powerkit_block'></ul>"));
            $("#spanVoptRadio").html("<li></li>".repeat(3));
            // 注意：三个选项的 value 与显示文字不尽相同
            // 尤其注意：ALL 和 FULL 不是一回事
            $("#spanVoptRadio > li:eq(0)").html("<label><input type='radio' name='vopt_elst' value='ALL' checked='checked' />ALL</label> ——“完全”各字段 + 统一识别符、语种、来源（801/919）");
            $("#spanVoptRadio > li:eq(1)").html("<label><input type='radio' name='vopt_elst' value='FULL' />完全</label> ——“简略”各字段 + 统一题名、版本、丛书信息");
            $("#spanVoptRadio > li:eq(2)").html("<label><input type='radio' name='vopt_elst' value='BRIEF' />简略</label> ——题名与责任者、出版信息、索书号、ISBN/ISSN");
            // 两套界面（原生/PK）都保留的前提下，两个 name 相同的控件同步 value 确保提交表单属性正常
            // PK -> 原生
            $("#spanVoptRadio input").click(() => { // 用户单击相关 label 同样触发其中 radio 的这个事件
                let value = $("#spanVoptRadio input:checked").val();
                if(GM_getValue("WannaShow", false)) // 预防死循环
                    // 修改 select 的 value 属性就能影响控件视图的显示文字，value 相当于键，文字相当于值
                    $("#vopt_elst").val(value);
            });
            // 原生 -> PK
            $("#vopt_elst").change(() => {
                let value = $("#vopt_elst").val();
                if(!GM_getValue("WannaShow", false)) // 预防死循环
                    // 一组 radio 当中任何一个设置 checked=true 就会取消选择其他
                    $(`#spanVoptRadio input[value='${value}']`).attr("checked", true);
            })
            // 修改默认选项为 ALL
            $("#vopt_elst").val("ALL");
        }
    };

    //////////////////////////////////////////////////////////////////////////
    // 题名级馆藏报表增强（已选取的检索结果）
    // 声明/初始化全局变量
    // 当前报表所提取的表格数据（字典），回显表格数据（字典），临时收藏的表格数据（数组套字典）
    let currentResultTable = {}, recalledTable = {}, aoaTitleReportTables = [];
    if ($("div.print_kept_records").length > 0) {
        idManPK = "题名级馆藏报表";
        
        //【函数】从馆藏报表提取报表生产时间，生成日期时间戳字符串，用于下载文件名
        const getTimestampStringFromReportText = (text) => {
            let [
                strYear, strMonth, strDay,
                strHour, strMinute, strAMPM
            ] = text.match(
                /产生的.+?(\d{4}).+?(\d{1,2})月.+?(\d{1,2}) 在 (\d{1,2}):(\d{1,2}) ([AP]M)/
            ).slice(1); // [0] 是完整匹配结果，不用
            // 转换为二十四小时制
            if (strHour == "12")
                strHour = "0";
            if (strAMPM == "PM")
                strHour = (Number(strHour) + 12).toString();
            // 补零：月、日、时、分
            // 可能不都需要，暂且都写上
            if (strMonth.length == 1)
                strMonth = '0' + strMonth;
            if (strDay.length == 1)
                strDay = '0' + strDay;
            if (strHour.length == 1)
                strHour = '0' + strHour;
            if (strMinute.length == 1)
                strMinute = '0' + strMinute;
            return `${strYear}-${strMonth}${strDay}-${strHour}${strMinute}`; // 反引号格式化字符串
        };

        // 从原生界面 pre 容器获取报表文本
        let reportText = $("div.print_kept_records pre").html();
        // 现在就要形成时间戳字符串，后面（reportText 会变）一直可供下载文件命名使用
        const reportTimestampString = getTimestampStringFromReportText(reportText);
        
        // 【函数】“大提取”——关键功能
        // 按照匹配式执行全局替换，返回所有替换结果的数组
        // 该操作即模拟 Regexr.com by gskinner 提供的 List 功能
        function listall(find_pattern, list_format, orig_string) {
            const compiled_pattern = new RegExp(find_pattern, "g");
            const all_found_strings = orig_string.match(compiled_pattern);
            if (all_found_strings == null)
                return []; // 空结果
            return all_found_strings.map((one) => one.replace(compiled_pattern, list_format));
        }

        // 【函数】根据原始报表文本，提取生成二维数组数据
        //！！！本工具箱各项功能中算法最复杂、最容易出错、最难维护的部分！！！
        // 基本原理——
        //（1）反复使用正则表达式，对 resultText 执行文本替换（预处理），主要目的：合并多值、多行字段，生成必要的空项，统一字段名称，清除有干扰的字段
        //（2）使用 listall() 执行“大替换”：根据一条超长匹配式，提取捕获组，按目标格式形成记录结果
        //（3）每条题名记录可挂有多个馆别的索书号，提取表格只能由用户预先选择其一，而不显示其他的（留空）；
        //     除索书号以外的书目信息，并不按馆别筛选——全部题名记录都会保留返回
        //（4）后期处理，返回二维数组：每行是一条题名级馆藏记录，每列是一个字段
        //（5）三种报表类型：ALL/FULL/BRIEF 字段不同，按不同的预处理和“大提取”流程处理
        // 返回值：字典：报表日期时间，书目记录数，报表类型，完整表格二维数组，索书号限定馆别
        function getResultAoAfromText(text, library) {
            // 参数预处理：简单修剪，随即替换删除报表中的“页眉”
            let resultText = text.trim().replace(/ *馆藏 报表[\w\W]+?产生的 (星期|周).+\d [AP]M\s+\n/g, "");
            console.log("用于筛选索书号的馆别：", library);

            // 判断报表类型：ALL / FULL=完全 / BRIEF=简略
            const reportType = /( 识别符: | 键: | 记录控制号: )/.test(resultText) ? "ALL" :
                ( /( 丛书: | 统一题名: | 变异题名: )/.test(resultText) ? "FULL" : "BRIEF");
            console.log("报表类型：" + reportType, reportType == 'FULL' ? "(完全)" : (reportType == "BRIEF" ? "(简略)" :"(ALL)"));

            // ALL 报表预处理：删除干扰字段（不采用，而且可能影响位置判断）
            resultText = resultText.replace(/ *(前导字符|头标|记录处理时间|封面题名|数据源|日期\/时间戳|定长字段数据|LCCN|记录处理时间标识): .+\n/g, "");
            
            // 通用预处理：ISBN/ISSN 整理+多值合并
            // ISBN/ISSN 可能多行，也可以多值，上下相邻，同题名记录可能同时包含 ISBN 和 ISSN
            // 定价、光盘、册数等杂项信息也会混杂在书刊号后，多行也只有第一行是真号所在，后面都是杂项和空白
            // 字段名称：ISSN 也统一为 ISBN
            resultText = resultText.replace(/( +)ISSN: /g, "$1ISBN: ");
            // 删除无真 ISBN/ISSN 的 ISBN/ISSN: 行
            resultText = resultText.replace(/ +ISBN: \D.+?\n/g, "");
            // 删除真号后的杂项数据
            resultText = resultText.replace(/( +ISBN: \d[\dXx\-]+)[^\dXx\-]?.*/g, "$1");
            // 字段名称临时替换为可分裂特殊标记 【【ISBN】】:
            resultText = resultText.replace(/( +)ISBN: /g, "$1【【ISBN】】: ");
            // ISBN 多行合并
            resultText = resultText.replace(/BN】】: (.+)\n +【【IS/g, "BN】】: $1;【【IS"); // 紧邻
            resultText = resultText.replace(/BN】】: (.+)\n.+\n +【【IS/g, "BN】】: $1;【【IS"); // 隔了一行杂项
            resultText = resultText.replace(/BN】】: (.+)\n.+\n.+\n +【【IS/g, "BN】】: $1;【【IS"); // 隔了两行杂项
            resultText = resultText.replace(/BN】】: (.+)\n.+\n.+\n.+\n +【【IS/g, "BN】】: $1;【【IS"); // 隔了三行杂项
            // 分号分隔
            resultText = resultText.replace(/BN】】: (.+)\n +【【IS/g, "BN】】: $1;【【IS");
            resultText = resultText.replace(/;【【ISBN】】: /g, ";");
            // 恢复原统一字段名称
            resultText = resultText.replace(/【【ISBN】】: /g, "ISBN: ");

            // 通用预处理：统一字段名变体
            resultText = resultText.replace(/ 题名与责任者: /g, " 题名: ");
            resultText = resultText.replace(/ Publication, Distrib: /g, " 出版信息: ");

            // 通用预处理：合并题名(与责任者)多行
            resultText = resultText.replace(/(\n\n\S.+ 索书号 +\n)/g, "\n   馆别之前插入无用字段: 用于多行题名终点识别$1");
            resultText = resultText.replace(/( 题名: )([\w\W]+?)(\n\s+\S.+?: )/g, "$1『『『『$2』』』』$3");
            // 假定不会超过 20 行
            for (let i = 1; i <= 20; i++) {
                resultText = resultText.replace(/(『『『『.+)\n *((?:(?<!『『『『)[\w\W])+?』』』』)/g, "$1 $2");
            }

            // 通用预处理：索书号整理+多值合并
            // 删除复本编号前多余空格，索书号后多余空格，复本号)替换为临时记号≮≮索C取N号】】:
            resultText = resultText.replace(/ *\d+\)(\S.*?) +\n/g, "≮≮索C取N号】】: $1\n");
            // 创建临时标记 ≮≮ 用来辅助标记不同馆别的起始位置
            resultText = resultText.replace(/([^ ].+? 索书号)/g, "≮≮\n$1"); // 后面的一个馆别之前
            // ALL 报表：相当于以识别符开头（清除干扰字段后）
            resultText = resultText.replace(/( +)(?:键|记录控制号): (.+)/g, "$1识别符: $2"); // 统一字段名称
            resultText = resultText.replace(/( +识别符: )/g, "≮≮\n$1"); // 统一识别符之前
            // 通用：相当于以 ISBN/ISSN 或题名开头（清除干扰字段后）
            resultText = resultText.replace(/( +ISBN: )/g, "≮≮\n$1"); // ISBN/ISSN 之前
            resultText = resultText.replace(/( +题名: )/g, "≮≮\n$1"); // 题名与责任者之前
            // 删除相邻索书号之间的非索书号信息
            // 利用临时标记开头的两个≮，只匹配前一个，全部匹配，不会漏掉
            // 凡是夹在中间的临时标记，都变成≮≮索C取N号】】:
            resultText = resultText.replace(/(≮索C取N号】】: .+)\n[\w\W]+?≮/g, "$1");
            // 临时标记替换成 /// 分隔符（约定）
            resultText = resultText.replace(/([^≮])≮索C取N号】】: /g, "$1 /// ");
            // 替换删除临时记号
            resultText = resultText.replace(/≮{1,2}\n/g, "\n");

            // 特殊报表类型预处理
            switch(reportType) {
                case "ALL":
                    // 统一字段名称
                    resultText = resultText.replace(/ Donor: /g, " 919: ");
                    resultText = resultText.replace(/ (语言代码|作品语种): /g, " 作品语文: ");
                
                    // 来源：多值合并，分号分隔
                    resultText = resultText.replace(/(\n +)来源: (.+)/g, "$1【【来801源】】: $2");
                    resultText = resultText.replace(/1源】】: (.+)\n +【【来80/g, "1源】】: $1;【【来80");
                    resultText = resultText.replace(/;【【来801源】】: /g, ";");
                    // 919：多值合并，分号分隔
                    
                    resultText = resultText.replace(/(\n +)919: (.+)/g, "$1【【捐赠919来源】】: $2");
                    resultText = resultText.replace(/9来源】】: (.+)\n +【【捐赠91/g, "9来源】】: $1;【【捐赠91");
                    resultText = resultText.replace(/;【【捐赠919来源】】: /g, ";");
                    // no break; 继续按 FULL 报表预处理
                case "FULL": // 【完全】类型报表预处理 + ALL 类型
                    // 给每一个题名与责任者后面增加一个空版本项，用于给无版本项记录增加空版本项
                    resultText = resultText.replace(/』』』』/g, "』』』』\n   版本: »无«");
                    // 如果两个版本项连续出现，删掉前一个空的；但如果原本就缺，则不会删掉空的
                    resultText = resultText.replace(/\n   版本: »无«\n +版本: /g, "\n   版本: ");

                    // 给每一个版本后面增加一个空出版项，用于给无出版项记录增加空出版项
                    resultText = resultText.replace(/( 版本: .+)/g, "$1\n   出版信息: »无«");
                    // 如果两个出版信息连续出现，删掉前一个空的；但如果原本就缺，则不会删掉空的
                    resultText = resultText.replace(/\n   出版信息: »无«\n +出版信息: /g, "\n   出版信息: ");

                    // 合并统一题名多行
                    resultText = resultText.replace(/( 统一题名: )([\w\W]+?)(\n\s+\S.+?: )/g, "$1〖〖〖〖$2〗〗〗〗$3");
                    // 假定不会超过 10 行
                    for (let i = 1; i <= 10; i++) {
                        resultText = resultText.replace(/(〖〖〖〖.+)\n *((?:(?<!〖〖〖〖)[\w\W])+?〗〗〗〗)/g, "$1 $2");
                    }

                    // 丛书多值合并
                    // 丛书字段可以多值，而且可以多行（两行），识别困难，必须经可能合并
                    // 先把每一条丛书字段的末尾做上临时标记（头尾可分裂匹配），删除字段名前空格
                    resultText = resultText.replace(/\n +丛书: ([^ ])/g, "\n【【丛HT书】】: $1");
                    // 多值丛书之间的两行丛书合并为一行，空格分隔
                    resultText = resultText.replace(/T书】】: (.+)\n *(.+?)\n【【丛H/g, "T书】】$1 $2\n【【丛H");
                    // 后跟其他字段的两行丛书合并为一行，空格分隔
                    // 注意：向后负面断言组 ((?<!: ).)+ 让匹配停在下一个字段标记(: )位置
                    resultText = resultText.replace(/(【【丛HT书】】: .+)\n *((?:(?<!: ).)+?)\n( +[^ ].+: )/g, "$1 $2\n$3");
                    // 分裂临时标记，替换为分号（;）
                    resultText = resultText.replace(/T书】】: (.+)\n【【丛H/g, "$1;");
                    // 清除剩余的临时标记（无多值的）：缩减以便与本 switch 过程的临时标记区分
                    resultText = resultText.replace(/\n【【丛HT书】】: /g, "\n【【丛S书】】: ");
                    // 多值第一个的残余标记
                    resultText = resultText.replace(/\n【【丛H([^T])/g, "\n【【丛S书】】: $1");
                    // 多值最后一个的残余标记：删掉
                    resultText = resultText.replace(/([^H])T书】】: /g, "$1");
                    break;

                default: // "BRIEF" 简略
                    // 给每一个题名与责任者后面增加一个空出版项，用于给无出版项记录增加空出版项
                    resultText = resultText.replace(/』』』』/g, "』』』』\n   出版信息: »无«");
                    // 如果两个出版信息连续出现，删掉前一个空的；但如果原本就缺，则不会删掉空的
                    resultText = resultText.replace(/\n   出版信息: »无«\n +出版信息: /g, "\n   出版信息: ");
            }
            // 后续通用预处理：在索书号行之后插入一行明确的记录分隔符
            const patternNearCallNumber = new RegExp(`\\n\\n${library} 索书号\\s+?复本号 馆藏类型  馆藏位置 \\n≮≮索C取N号】】: (.+)`, "g");
            resultText = resultText.replace(patternNearCallNumber, `\n\n≮≮${library}≮≮索取号: $1\n【【【_BETWEEN_RECORD_】】】\n`);
            resultText = resultText.replace(/(≮≮索C取N号】】: .+)/g, `$1\n【【【_BETWEEN_RECORD_】】】\n`);
            // 开头也加上分隔符
            resultText = "_RECORD_】】】\n" + resultText;

            // 匹配表达式：根据报表类型（ALL/FULL/BRIEF）确定
            // 随后在“大提取”listall() 当中作为搜索匹配式，用于提取不同类型报表的各字段数据
            // 反引号格式化字符串里的 ${library} 单独提取特定馆别的索书号数据
            const patternBy = {
                "ALL"  : // ALL 报表：以北大中心馆为例——
                // _RECORD_】】】\s+(?:ISBN: (.+)\n[\w\W]*?)? *题名: 『『『『(.+)』』』』\n\s+出版信息: (.+)\n[\w\W]+?(?:(?:【【【_BETWEEN_RECORD_】】】\n\n\n)?≮≮北大中心馆≮≮索取号: (.+)\n)?【【【_BETWEEN
                "_RECORD_】】】\\s+" // 预处理加入的记录分隔符
                + "(?: *识别符: (.+)\\n[\\w\\W]*?)?" // $1: 统一识别符/题名键/F001，单行，理论上讲系统必备，但个别记录在报表中缺失该字段
                + "(?: *ISBN: (.+)\\n[\\w\\W]*?)?" // $2: ISBN/ISSN 未必有
                + "(?: *作品语文: (.+)\\n[\\w\\W]*?)?" // $3: 语种代码，单行，该有但实际未必有
                + " +题名: 『『『『(.+)』』』』\\n" // $4: 题名与责任者，常见多行，已经合并，必有
                + " +版本: (.+)\\n" // $5: 版本，单行，未必有但已经设法添加空项，紧邻题名与责任者之后
                + " +出版信息: (.+)\\n[\\w\\W]+?" // $6: 出版项，单行，未必有但已经设法添加空项，紧邻题名与责任者、版本项之后
                + "(?:【【丛S书】】: (.+)\\n[\\w\\W]+?)?" // $7: 丛书题名与责任者，多值、多行已经合并到一行，未必有
                + "(?: +统一题名: 〖〖〖〖(.+)〗〗〗〗\\n[\\w\\W]+?)?" // $8: 统一题名，未必有，在丛书之后，多行已经合并到一行
                + "(?:【【来801源】】: (.+)\\n[\\w\\W]+?)?" // $9: 来源 F801，可能多值，已合并到一行，未必有
                + "(?:【【捐赠919来源】】: (.+)\\n[\\w\\W]+?)?" // $10: 捐赠来源 F919，可能多值，已合并到一行，未必有
                + `(?:(?:【【【_BETWEEN_RECORD_】】】\\n\\n\\n)?≮≮${library}≮≮索取号: (.+)\\n)?` // $11: 索书号，必有但根据馆别约束则未必有，多值在此已经合并到一行；根据传入参数，挑选索书号所属的馆别
                + "【【【_BETWEEN" // 记录分隔标志

                ,"FULL" : // FULL（完全）报表：以北大中心馆为例——
                // _RECORD_】】】\s+(?:ISBN: (.+)\n[\w\W]*?)? *题名: 『『『『(.+)』』』』\n +版本: (.+)\n\s+出版信息: (.+)\n[\w\W]+?(?:【【丛S书】】: (.+)\n[\w\W]+?)?(?: +统一题名: 〖〖〖〖(.+)〗〗〗〗\n[\w\W]+?)?(?:(?:【【【_BETWEEN_RECORD_】】】\n\n\n)?≮≮北大中心馆≮≮索取号: (.+)\n)?【【【_BETWEEN
                  "_RECORD_】】】\\s+" // 预处理加入的记录分隔符
                + "(?:ISBN: (.+)\\n[\\w\\W]*?)?" // $1: ISBN/ISSN 未必有
                + " *题名: 『『『『(.+)』』』』\\n" //$2:  题名与责任者，常见多行，已经合并，必有
                + " +版本: (.+)\\n" // $3: 版本，单行，未必有但已经设法添加空项，紧邻题名与责任者之后
                + "\\s+出版信息: (.+)\\n[\\w\\W]+?" // $4: 出版项，单行，未必有但已经设法添加空项，紧邻题名与责任者、版本项之后
                + "(?:【【丛S书】】: (.+)\\n[\\w\\W]+?)?" // $5: 丛书题名与责任者，多值、多行已经合并到一行，未必有
                + "(?: +统一题名: 〖〖〖〖(.+)〗〗〗〗\\n[\\w\\W]+?)?" // $6: 统一题名，未必有，在丛书之后，多行已经合并到一行
                + `(?:(?:【【【_BETWEEN_RECORD_】】】\\n\\n\\n)?≮≮${library}≮≮索取号: (.+)\\n)?` // $7: 索书号，必有但根据馆别约束则未必有，多值在此已经合并到一行；根据传入参数，挑选索书号所属的馆别
                + "【【【_BETWEEN" // 记录分隔标志

                ,"BRIEF" : // BRIEF（简略）报表：以北大中心馆为例——
                // _RECORD_】】】\s+(?:ISBN: (.+)\n[\w\W]*?)? *题名: 『『『『(.+)』』』』\n\s+出版信息: (.+)\n[\w\W]+?(?:\n\n北大中心馆 索书号\s+复本号 馆藏类型  馆藏位置 \n *≮≮索C取N号】】: (.+?)\n)?【【【_BETWEEN
                  "_RECORD_】】】\\s+" // 预处理加入的记录分隔符
                + "(?:ISBN: (.+)\\n[\\w\\W]*?)?" // $1: ISBN/ISSN 未必有
                + " *题名: 『『『『(.+)』』』』\\n" // $2: 题名与责任者，常见多行，已经合并，必有
                + "\\s+出版信息: (.+)\\n[\\w\\W]+?" // $3: 出版项，单行，未必有但已经设法添加空项，紧邻题名与责任者之后
                + `(?:(?:【【【_BETWEEN_RECORD_】】】\\n\\n\\n)?≮≮${library}≮≮索取号: (.+)\\n)?` // $4: 索书号，必有但根据馆别约束则未必有，多值在此已经合并到一行；根据传入参数，挑选索书号所属的馆别
                + "【【【_BETWEEN" // 记录分隔标志
            };
            console.log(patternBy[reportType]); // 调试：当前报表所用匹配式
            // 列表（list）表达式：根据报表类型（ALL/FULL/BRIEF）确定
            const formatBy = {
                // 每列的序号固定，扑空的捕获组返回空值（允许缺失字段）
                // ALL 报表
                // $1 统一识别符 | $3 语种代码 | $4 题名与责任者 | $8 统一题名 | $5 版本 | $6 出版项 | $7 丛书信息 | $11 索书号 | $2 ISBN/ISSN | $9 来源 801 | $10 捐赠 919
                "ALL"  : "$1\t$3\t$4\t$8\t$5\t$6\t$7\t$11\t$2\t$9\t$10",
                // 完全报表
                // $2 题名与责任者 | $6 统一题名 | $3 版本 | $4 出版项 | $5 丛书信息 | $6 索书号 | $1 ISBN/ISSN
                "FULL" : "$2\t$6\t$3\t$4\t$5\t$7\t$1",
                // 简略报表
                // $2 题名与责任者 | $3 出版项 | $4 索书号 | $1 ISBN/ISSN
                "BRIEF" : "$2\t$3\t$4\t$1"
            };
            
            // 大提取！！！
            // 提取报表数据为二维数组
            console.log(resultText); // 调试：大提取之前的匹配输出
            let resultArray = listall(patternBy[reportType], formatBy[reportType], resultText);

            // 添加表头行：根据报表类型（ALL/FULL/BRIEF）确定
            const headerByType = {
                "ALL"  : `统一识别符\t语种代码\t题名与责任者\t统一题名\t版本\t出版项\t丛书信息（分号分隔）\t${library}索书号（/// 分隔）\tISBN/ISSN（分号分隔）\t来源 801（分号分隔）\t捐赠 919（分号分隔）`,
                "FULL" : `题名与责任者\t统一题名\t版本\t出版项\t丛书信息（分号分隔）\t${library}索书号（/// 分隔）\tISBN/ISSN（分号分隔）`,
                "BRIEF" : `题名与责任者\t出版项\t${library}索书号（/// 分隔）\tISBN/ISSN（分号分隔）`
            };
            resultArray.unshift(headerByType[reportType]);
            
            // 最后的处理
            // 然后返回一个字典：报表日期时间，书目记录数，报表类型，完整表格二维数组，索书号限定馆别
            return {
                timestamp: reportTimestampString, // 全局常量
                base_rows: resultArray.length - 1,
                report_type: reportType,
                whole_table: resultArray.map((row) => {
                    // 删除“行”内的换行及换行前后的多余空格——否则 TSV 数据会因换行而出错
                    // 原则上讲，之前的预处理应该已经消除了各项多行值，保险起见再筛一遍
                    const rowOneLine = row.replace(/ *\n */g, " ");
                    // 无论表头还是内容，按每一行的 \t 切分为数组
                    const splitRow = rowOneLine.split("\t");
                    // 清除预处理环节人工添加的空项值
                    return splitRow.map((cell) => cell.replace(/»无«/, ""));
                }),
                library: library
            };
        }

        //【函数】在指定的表格选择器内生成题名级报表的表格显示
        // resultAoA: getResultAoAfromText() 返回值，包含提取数据表 aoa 和索书号限定馆别 library
        // 返回值：resultAoA 原样返回
        function fillTableFromResultAoA(tableSelector, resultAoA) {
            // 深度复制原二维数组，函数参数留给返回值原样返回
            const aoaResultTable = getDuplicatedAoA(resultAoA.whole_table);
            // 拆出表头列表
            let arrHeader = aoaResultTable[0];
            // 拆出表身列表
            let aoaSavedItems = aoaResultTable.slice(1);
            // 判定二维数组内报表的类型
            const reportType = arrHeader[1] == "语种代码" ? "ALL" : (arrHeader[1] == "统一题名" ? "FULL" : "BRIEF");

            // 二维数组内容处理
            // 1. 分号改成换行
            //    为 ISBN/ISSN 创建 OPAC 链接
            // 2. 索书号分隔符 /// 改成换行
            // 3. 为统一识别符创建 OPAC 链接
            $.each(arrHeader, (col, th) => {
                if (/分号分隔/.test(th)) {
                    arrHeader[col] = th.replace(/（分号分隔）/, "");
                    // ISBN/ISSN 一定存在于分号分隔的列中，一趟循环顺便处理了
                    $.each(aoaSavedItems, (row) =>{
                        if (/ISBN/.test(th))
                            // 先按分号拆成数组，每个元素判断是 ISBN 还是 ISSN，分别构造超链接
                            // 用 HTML 硬断行 <br /> 连接为字符串，回填单元格 HTML 数据
                            aoaSavedItems[row][col] = aoaSavedItems[row][col].split(";").map((line) => /^\d{4}-\d{3}[\dXx]$/.test(line) ? `<a href='http://162.105.138.200/uhtbin/issn/${line}' title='点击根据 ISSN 查询该期刊'>${line}</a>` : `<a href='http://162.105.138.200/uhtbin/isbn/${line}' title='点击根据 ISBN 查询该书籍'>${line}</a>`).join("<br />");
                        else
                            aoaSavedItems[row][col] = aoaSavedItems[row][col].replace(/;/g, "<br />");
                    });
                } else if (/\/\/\//.test(th)) {
                    arrHeader[col] = th.replace(/（\/\/\/ 分隔）/, "");
                    $.each(aoaSavedItems, (row) =>{
                        aoaSavedItems[row][col] = aoaSavedItems[row][col].replace(/ \/\/\/ /g, "<br />");
                    });
                }
            });
            if (reportType == "ALL") aoaSavedItems.forEach((item, row) => {
                // 根据统一识别符创建 OPAC 链接
                const f001 = aoaSavedItems[row][0];
                aoaSavedItems[row][0] = `<a href='http://162.105.138.200/uhtbin/f001/${f001}' title='第 ${row+1} 行：点击查看题名的卡片页'>${f001}</a>`;
            });

            // 根据二维数组的数据构造 table 内表格元素
            // 表头 tr th
            $(tableSelector).append("<tr class='extractedHeader'></tr>");
            arrHeader.forEach((field) => {
                $(tableSelector).find(".extractedHeader").append($(`<th>${field}</th>`));
            });
            // 表身 tr td
            aoaSavedItems.forEach((item, row) => {
                $(tableSelector).append(`<tr class='extractedBase' title='第 ${row+1} 行'></tr>`);
                item.forEach((field) => {
                    $(tableSelector).find(".extractedBase:last").append($(`<td>${field}</td>`));
                });
            });

            // 返回原参数（字典：报表日期时间，书目记录数，报表类型，完整表格二维数组，索书号限定馆别）
            return resultAoA;
        }

        // 隐藏原生文本容器
        $("div.print_kept_records > div.content").addClass("powerkit_original_block");
        // 追加新容器供 PK 增强内容
        $("div.print_kept_records").prepend($("<div id='divMarkedRecords' class='powerkit_block content'></div>"));
        $("#divMarkedRecords").html("<h3>已选取的检索结果</h3> <ul></ul>");
        $("#divMarkedRecords > ul").html(""
            + "<li id='liExtraction'>下载保存：</li>"
            + "<li id='liDiscretion' class='redBold'>谨慎使用：由报表文本生成的表格数据，可能存在乱码、缺漏、错位，仅供参考。</li>"
            + "<li id='liTabs'>报表预览：</li>"
            + "<li id='liOrigText' class='liTabs'><pre></pre></li>"
            + "<li id='liExtractedTable' class='liTabs'>"
                + "<div></div>" // 临时收藏夹控件区
                + "<h3>当前报表提取</h3><table></table>"
            + "</li>");
        // 标签栏
        $("#liTabs").append($("<label><input type='radio' name='show_result' value='liExtractedTable' checked='checked' /><strong>表格数据</strong></label>"))
                    .append($("<label><input type='radio' name='show_result' value='liOrigText' /><strong>原始文本</strong></label>"));
        // 根据点击的标签显示标签页
        $("#liTabs input").click((ev) => {
            $(".liTabs").hide(); // 先都隐藏
            $(`#${ev.target.value}`).show();
        });
        
        // 按钮：提取表格化报表数据
        $("#liExtraction").append($("<button type='button' class='button' id='butDownloadTSV'>制表符分隔值（TSV）文本</button>"));
        if (window.XLSX) $("#liExtraction").append($("<button type='button' class='button' id='butDownloadExcel'>Excel 表格（推荐）</button>"));

        // 下拉框：按馆藏位置筛选提取索书号（两个下载按钮共用其取值）
        // 如果有油猴设置（来自先前的打印/邮寄/保存环节），读取并填充
        $("#liExtraction").append($("<span>««« 按馆别</span><select id='libraryFilter'></select><span>提取索书号</span>"));
        const defaultLibraryOptions = "<option selected='selected'>北大中心馆</option>\n<option>医学图书馆</option>";
        const selectLibraryOptions = GM_getValue("SavedItems_SelectLibraryOptions", defaultLibraryOptions);
        $("#libraryFilter").html(selectLibraryOptions);
        // 对下拉框选项文本按拼音排序
        sortSelectByOptionText("#libraryFilter");
        // 删除 ALL（不支持不分馆别）
        $("#libraryFilter option[value='ALL']").remove();
        // 读取油猴设置，上一环节“馆别”下拉框的选项
        let lastSelectedLibrary = GM_getValue("SavedItems_SelectedLibraryOption", "北大中心馆");
        // 如果选的是 ALL 就改成北大中心馆
        if (lastSelectedLibrary == "ALL") lastSelectedLibrary = "北大中心馆";
        // 置顶北大中心馆，选中上一环节所选馆别
        $("#libraryFilter").prepend($("#libraryFilter option:contains('北大中心馆')")).val(lastSelectedLibrary);
        // 分隔线设为无效选项
        $("#libraryFilter option:contains('==========')").attr("disabled", true);
        // 馆别下拉框变更：更新预览 table
        $("#libraryFilter").change(()=>{
            if (/^=*$/.test($("#libraryFilter").val())) return;
            // 清空预览表格后，重新从文本报表提取二维数组，显示在空表元素内，并记录到全局变量
            $("#liExtractedTable > table").empty();
            currentResultTable = fillTableFromResultAoA("#liExtractedTable > table", getResultAoAfromText(reportText, $("#liExtraction > select").attr("value")));
            // 更新标签“表格数据”末尾 () 内揭示的记录数
            $("#liTabs input[value='liExtractedTable'] +strong").text(`表格数据 (${currentResultTable.base_rows})`);
            // 回显表格区特效收起隐藏
            $("#recalledTable").slideUp();
        });
        

        //【函数】下载表格数据 TSV
        function downloadTSVfromResultTable(table) {
            // 从文本报表提取二维数组，转为 TSV，再 Base64 编码
            const dataURI_header = "data:text/tab-separated-values;base64,";
            const dataURI_TSV = btoaUTF8(getTSVfromAoA(table.whole_table));
            // 下载文件名：注明索书号馆别、报表生成时间戳、结果数量
            const fileName = `保存检索结果-TSV-${table.timestamp}-(${table.base_rows})-${table.report_type}-${table.library}.txt`;
            // 调用油猴下载 API
            GM_download({
                url: dataURI_header + dataURI_TSV,
                name: fileName
            });
        }

        //【函数】下载表格数据 Excel
        function downloadExcelfromResultTable(table) {
            // 深度复制二维数组，以免改变全局变量 currentResultTable
            const result = getDuplicatedAoA(table.whole_table);
            // 为 ALL 报表 Excel 格式在原第一列“统一识别符”左边增加“OPAC”列
            if (table.report_type == "ALL") {
                console.log("ALL 报表 / Excel 表格");
                // 先在二维数组里增加表头和公式数据
                result[0].unshift("OPAC");
                result.forEach((row, index) => {
                    // 表头跳过
                    if (index == 0) return;
                    // 每行开头：增加空值，以后向 Worksheet 对象填公式
                    result[index].unshift("");
                });
            }
            // 调用 SheetJS 生成工作表
            const sheetReport = XLSX.utils.aoa_to_sheet(result);
            // 为 ALL 报表 Excel 格式增加 OPAC 链接列数据
            if (/统一识别符/.test(result[0][1])) {
                result.forEach((row, index) => {
                    // 表头跳过
                    if (index == 0) return;
                    const cell = "A"+(index+1);
                    // 从 A2 开始向下填充公式
                    // 下载后“启用编辑”才能使用这个链接
                    if (result[index][1] != "")
                        // 统一识别符非空，构造 F001 字段直达链接，显示为“链接” 
                        sheetReport[cell]["f"] = `=HYPERLINK("http://162.105.138.200/uhtbin/f001/${result[index][1]}","链接")`;
                    else if (result[index][9] != "") {
                            // 从 ISBN/ISSN 字段截取可能存在的分号之前的字符串，即第一个书刊号值
                            const firstISBNorISSN = result[index][9].replace(/^(.+?);?.*/, "$1");
                            // 国际刊号的结构容易判定（但最终未必准确）
                            if (/^\d{4}-\d{3}[\dXx]$/.test(firstISBNorISSN))
                                // 构造国际刊号卡片页链接
                                sheetReport[cell]["f"] = `=HYPERLINK("http://162.105.138.200/uhtbin/issn/${firstISBNorISSN}","刊号链接")`;
                            else
                                // 构造国际书号卡片页链接
                                sheetReport[cell]["f"] = `=HYPERLINK("http://162.105.138.200/uhtbin/isbn/${firstISBNorISSN}","书号链接")`;
                    } else
                        sheetReport[cell]["v"] = "[无]";
                });
            }
            // 加入工作簿
            const wbCharges = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wbCharges, sheetReport, `索书号仅提取<${table.library}>`);
            // 下载文件名：注明索书号馆别、报表生成时间戳、结果数量
            const fileName = `保存检索结果-Excel-${table.timestamp}-(${table.base_rows})-${table.report_type}-${table.library}.xlsx`;
            // 写入文件并被浏览器“下载”
            XLSX.writeFile(wbCharges, fileName);
        }

        // 下载 TSV 按钮
        $("#liExtraction #butDownloadTSV").click(() => {
            downloadTSVfromResultTable(currentResultTable);
        });

        // 下载 Excel 按钮
        if (window.XLSX) $("#liExtraction #butDownloadExcel").click(() => {
            downloadExcelfromResultTable(currentResultTable);
        });

        // 报表预览：原始文本
        // 链接：下载原始报表文本，利用 Data URI 生成文件数据
        $("#liOrigText").prepend($("<a target='_blank'>下载报表的原始文本</a>"));
        $("#liOrigText > a").attr("href", "data:text/plain;base64,"
                                + btoaUTF8(reportText))
                            .attr("download", "保存检索结果-原始报表-"
                                + reportTimestampString + ".txt");
        // 显示原始报表文本
        $("#liOrigText > pre").html(reportText);
        // 初始隐藏
        $("#liOrigText").hide();

        // 报表预览：表格数据
        // 从文本报表提取二维数组，填充进 table 并记录到全局变量
        currentResultTable = fillTableFromResultAoA("#liExtractedTable > table", getResultAoAfromText(reportText, $("#liExtraction > select").attr("value")));
        // 更新标签“表格数据”末尾 () 内揭示的记录数
        $("#liTabs input[value='liExtractedTable'] +strong").text(`表格数据 (${currentResultTable.base_rows})`);

        // 报表预览：表格数据 -> 临时收藏
        $("#liExtractedTable > div").append($(""
            + "<button type='button' id='butShowSavedTables' title='整理已收藏的书目表格'>☰ <strong>整理收藏</strong></button>"
            + " <button type='button' id='butAddNewTable' title='当前书目表格加入临时收藏'>⊕ <strong>收藏当前</strong></button>"
            + "<ol id='olSavedTables'></ol>"
            + "<div id='recalledTable'></div>"));
        // 初始隐藏临时收藏表格列表+收藏表格预览 table
        $("#olSavedTables").hide();
        $("#recalledTable").hide();

        // 点击“整理收藏”按钮
        $("#butShowSavedTables").click(() => {
            // 切换显示/隐藏临时收藏夹（快速特效）
            $("#olSavedTables").toggle("fast");
            // 特效收起隐藏回显表格（无论如何）
            $("#recalledTable").slideUp();
            // 收藏标签清除特定选定
            $("#olSavedTables .savedTag").removeClass("clickedTag");
        });

        // 全部清空按钮
        $("#olSavedTables").append($("<button type='button' title='清空全部已收藏的表格'>× 全部清空</button>"));
        // 清空全部已收藏的表格
        $("#olSavedTables > button").click(() => {
            // 对话框确认
            if (window.confirm("确定要清空所有已收藏的馆藏书目表格吗？")) {
                // 清空油猴设置保存的临时收藏
                GM_setValue("TitleReportTables", []);
                // 删除所有临时收藏表格的标签
                $("#olSavedTables .savedTag").remove();
            };
        });

        //【函数】添加一条收藏标签
        // dictResultTable 单个书目表格数据（字典）：报表日期时间，书目记录数，报表类型，完整表格二维数组，索书号限定馆别
        function addSavedTableLI(dictResultTable, index) {
            // 根据参数提供的表格数据，合成标签文字
            // 格式：日期时间戳(记录数)报表类型
            const resultTableTag = `${dictResultTable.timestamp}(${dictResultTable.base_rows})${dictResultTable.report_type}`;

            // 添加标签显示+索引值
            $("#olSavedTables").append(`<li class='savedTag'><button type='button' title='删除 ${resultTableTag}' value='${index}'>×</button><strong title='翻阅收藏的表格数据（${dictResultTable.library}）'>${resultTableTag}</strong></li>`);

            // 清空单条表格收藏
            $("#olSavedTables .savedTag:last button").click((ev) => {
                const index = ev.target.value;
                // 读取油猴设置，根据索引删除记录 1 条，保存回去
                const aoaNewTitleReportTables = GM_getValue("TitleReportTables", []);
                aoaNewTitleReportTables.splice(index, 1);
                GM_setValue("TitleReportTables", aoaNewTitleReportTables);
                // 清空全部收藏标签，全部重新构造
                $("#olSavedTables .savedTag").remove();
                reloadAllSavedTableLIs();
            });

            // 回显单条表格收藏
            $("#olSavedTables .savedTag:last strong").click((ev) => {
                const index = $(ev.target).prev().val();
                // 读取油猴设置到全局变量，清空原表格，显示所选表格数据
                recalledTable = GM_getValue("TitleReportTables", [])[index];
                $("#recalledTable").empty();
                $("#recalledTable").append($("<table></table"));
                fillTableFromResultAoA("#recalledTable > table", recalledTable);
                // 补充表格信息
                $("#recalledTable").prepend($(`<h3>收藏的表格数据</h3>`
                                            + `<span>索书号限定馆别：<strong>${recalledTable.library}</strong></span>`
                                            + `<span>日期时间：<strong>${recalledTable.timestamp}</strong></span>`
                                            + `<span>题名数量 (<strong>${recalledTable.base_rows}</strong>)</span>`
                                            + `<span>报表类型：<strong>${recalledTable.report_type}</strong></span>`
                                            + `<button id='butDownloadSavedTableTSV' type='button' title='下载该收藏表格的制表符分隔值文本'>下载 TSV 文本</button>`
                                            + `<button id='butDownloadSavedTableExcel' type='button' title='下载该收藏表格的 Excel 表格数据'>下载 Excel 表格</button>`
                                            ));
                $("#recalledTable h3").append($("<strong>×</strong>"));
                // 右上角 × 按钮
                $("#recalledTable h3 strong").click(() => {
                    // 关闭回显表格界面（特效拉起）
                    $("#recalledTable").slideUp();
                    // 去除收藏标签选定
                    $("#olSavedTables .savedTag").removeClass("clickedTag");
                });
                // 下载回显表格 TSV 按钮
                $("#butDownloadSavedTableTSV").click(() => {
                    downloadTSVfromResultTable(recalledTable);
                });
                // 下载回显表格 Excel 按钮
                $("#butDownloadSavedTableExcel").click(() => {
                    downloadExcelfromResultTable(recalledTable);
                });
                // 特效展开显示
                $("#recalledTable").slideDown();
                // 当前标签高亮
                $("#olSavedTables .savedTag").removeClass("clickedTag");
                $(ev.target).parent().addClass("clickedTag");
                console.log("回显表格：index=" + index, recalledTable);
            });
            console.log("aoaTitleReportTables", aoaTitleReportTables);
        }

        //【函数】重新构造全部收藏标签
        function reloadAllSavedTableLIs() {
            // 提取油猴设置，逐条恢复显示已保存的临时收藏表格列表
            aoaTitleReportTables = GM_getValue("TitleReportTables", []);
            aoaTitleReportTables.forEach((table, index) => {
                addSavedTableLI(table, index);
            });
            console.log("aoaTitleReportTables", aoaTitleReportTables);
        }

        // 点击“收藏当前”按钮：将由当前报表提取的表格数据保存为新增收藏
        $("#butAddNewTable").click(() => {
            // 提取油猴设置，添加一条数据，保存回去
            const aoaTitleReportTables = GM_getValue("TitleReportTables", []);
            aoaTitleReportTables.push(currentResultTable);
            GM_setValue("TitleReportTables", aoaTitleReportTables);
            // 将当前表格结果的收藏标签
            addSavedTableLI(currentResultTable, aoaTitleReportTables.length-1);
            // 添加完成，显示临时收藏夹（快速特效）
            $("#olSavedTables").slideDown();
        });
        
        // 重新构造全部收藏标签
        reloadAllSavedTableLIs();
    }

    //////////////////////////////////////////////////////////////////////////
    // 读者服务增强
    // 用户状态查询（我的账号）：借出界面增强
    if ($("div.account_left_column").length > 0) {
        idManPK = "借出";
        // 要用到“借出”标签页
        let $divChargesPanel = $("div.account_left_column > div.account_details > div.content > div.account_details > div.charges_panel");
        // 给借出列表 tbody 自定一个 class=tbody_charges 作为引用名称
        // 文档中另有一个容器也是 id=tblCharge （这不应当），所以最好别引用 #tblCharge
        $divChargesPanel.find("table > tbody:last").addClass("tbody_charges");
        // 要用到借出图书的题名列元素（单元格）集合
        let $tdChargesTitles = $divChargesPanel.find(".tbody_charges td.title");
        console.log("我的账号 | 借出图书总数：" + $tdChargesTitles.length);
        // 有借出的图书……
        if ($tdChargesTitles.length > 0) {
            // 每本书的“一键检索”
            // 表中不含其他唯一标识符数据，只能采用索书号浏览，比较准；题名与责任者不准
            // 仅限北大中心馆；为减省界面，不提供分馆的速查
            // 该功能先跑一遍，迭代器与后面的不同
            $tdChargesTitles.each((index, thisTD) => {
                // 索书号在第一列（题名）下面的 strong 标签内
                let $strongCallNumber = $(thisTD).children("strong");
                // 前置说明文字
                $strongCallNumber.before($("<span class='powerkit_inline'>索书号 </span>"));
                $strongCallNumber.after($("<span class='powerkit_inline'> 按排架法 </span>"));
                // 共用的 URL 参数，字符转码准备
                let callNumberEncoded = encodeURIComponent($strongCallNumber.text());
                let libraryEncoded = encodeURIComponent("北大中心馆");
                let classEncoded = encodeURIComponent("中图法_"); // 完整应为：中图法_C 等，后面拼接时迭代补完
                $.each({ "中":"C", "西":"W" }, (langText, langToken) => {
                    // 创建链接，用于按中图法不同语种排架法的索书号浏览（无法一种兼通）
                    let $aCallNumber = $("<a class='powerkit_inline' target='_blank'></a>");
                    // 链接文字：中/西
                    $aCallNumber.text(`［${langText}］`); // 反引号格式化字符串
                    // 链接地址：新标签页索书号浏览查询
                    $aCallNumber.attr("href", `http://162.105.138.200/uhtbin/cgisirsi/x/%E5%8C%97%E5%A4%A7%E4%B8%AD%E5%BF%83%E9%A6%86/0/25?searchdata1=${callNumberEncoded}&class=${classEncoded}${langToken}&library=${libraryEncoded}&location=ANY&shadow=NO&maxskip=50&icat1=ANY&icat2=ANY&item_type=ANY`); // 反引号格式化字符串
                    $(thisTD).append($aCallNumber);
                });
                // 后置说明文字
                $(thisTD).append($("<span class='powerkit_inline'> 速查（浏览）北大中心馆</span>"));
            });

            // 书单数据增强功能：要用到借出图书的表格各行数据
            let $trCharges = $divChargesPanel.find(".tbody_charges tr");
            // 创建二维数组用于保存借出列表数据
            // [0] 存放自定义表头
            let aoaChargesTable = new Array();
            aoaChargesTable[0] = ["索书号", "题名与责任者", "著者", "到期日期", "催还日期", "异常状态"];
            // 遍历借出列表每一行，提取数据，存进二维数组
            // 同期高亮借出状态异常的表格行，以及最近到期的表格行
            let recentDueDate = ""; // 块外先声明，块内初始化
            $trCharges.each((row, thisTR) => {
                let callNumber = $(thisTR).find("td.title strong").text().trim();
                let title = $(thisTR).find("td.title").text().trim().replace(/^(.+)\n[\w\W]*/, "$1");
                let author = $(thisTR).find("td.author").text().trim();
                let dueDateRoutine = $(thisTR).find("td.due_date > strong:eq(0)").text().trim().replace(/.+?(\d.+?),.+/, "$1"); // 正常到期日期；省略时间（逗号后 23:59）
                let dueDateUrged = $(thisTR).find("td.due_date > strong:eq(1)").text().trim().replace(/.+?(\d.+?),.+/, "$1"); // 催还日期：通常缺此字段；省略时间（逗号后 23:59）
                let overdue = $(thisTR).find("td.overdue").text().trim();
                // 存进二维数组
                // [0] 表头，后续从 [1] 开始
                aoaChargesTable[row + 1] = [callNumber, title, author, dueDateRoutine, dueDateUrged, overdue];
                // 隐藏到期日期/催还日期的时间部分
                // 方式：重写 html() 将 ,23:59 装进 .powerkit_original_line 容器
                $(thisTR).find("td.due_date > strong:eq(0)").html("借书到期日期：" + dueDateRoutine + "<span class='powerkit_original_inline'>,23:59</span>");
                $(thisTR).find("td.due_date > strong:eq(1)").html("借书催还日期：" + dueDateUrged + "<span class='powerkit_original_inline'>,23:59</span>");
                // 高亮：异常状态的行内每个单元格（状态列非空，或催还日期非空）
                if (overdue != "" || dueDateUrged != "")
                    $(thisTR).find("td").addClass("powerkit_status-caution");
                // 初始化最近到期日期：排序缘故，最近的在最上面
                // 但如果是催还的，不算，要排除 dueDateUrged 非空值的
                // 无催还的第一个 dueDateRoutine 就是最近到期日期
                if (recentDueDate == "" && dueDateUrged == "")
                    recentDueDate = dueDateRoutine;
                // 高亮：最近到期的行内每个单元格（与最近到期日期相等的到期日期）
                if (recentDueDate == dueDateRoutine)
                    $(thisTR).find("td").addClass("powerkit_recent-due");
            });
            console.log("aoaChargesTable 行数（含表头）：" + aoaChargesTable.length);

            // 借出书单导出 TSV
            let nowDateTime = getFilenameTimestampNow();
            let tsvChargesTableEncoded = btoaUTF8(getTSVfromAoA(aoaChargesTable));
            let aDownloadChargesTSV = "［<a "
                + `download='借出书单-${userName}-${nowDateTime}-(${$trCharges.length}).txt' ` // 反引号格式化字符串
                + `href='data:text/tab-separated-values;base64,${tsvChargesTableEncoded}'>导出书单 TSV</a>］`;
            // 借出书单导出 Excel
            // SheetJS 来自外部资源，校园网内未必成功加载，要检验
            let aDownloadChargesXlsx = window.XLSX ? "［<a href='#'>导出书单 Excel</a>］" : "";

            // 创建容器：借出列表增强命令，在“细节”小标题内部（右侧）
            let $chargesUtils = $("<span class='powerkit_inline charges_utils'></span>");
            $chargesUtils.html(aDownloadChargesTSV + aDownloadChargesXlsx);
            $divChargesPanel.find("table").prev().append($chargesUtils);

            // 挂接事件：借出书单导出 Excel
            if (window.XLSX) $chargesUtils.find("a:eq(1)").click(() => {
                // 调用 SheetJS 生成工作表，加入工作簿
                const sheetCharges = XLSX.utils.aoa_to_sheet(aoaChargesTable);
                const wbCharges = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wbCharges, sheetCharges, "借出书单");
                // 写入文件并被浏览器“下载”
                XLSX.writeFile(wbCharges, `借出书单-${userName}-${nowDateTime}-(${$trCharges.length}).xlsx`);
                return false; // 阻止链接前进
            });
        }
        // 隐藏借出列表第六列（目前积欠款项）：表头（th 有 id）和表身（td.fines）
        // 当前北大中心馆流通政策：借书逾期不罚款
        $("#t1sc6").addClass("powerkit_original_table-cell");
        $divChargesPanel.find("table td.fines").addClass("powerkit_original_table-cell");
        // 右栏面板：快捷链接：续借
        // TODO 有问题，暂时取消含有 ID 的链接
        // $("#ulPowerKit").append($(`<li class='powerkit_block'><a href='http://162.105.138.200/uhtbin/cgisirsi/0/0/${userSessionID}/92'>快捷链接：读者服务 | 续借</a></li>`)); // 反引号格式化字符串
    }

    // 续借界面增强
    if ($("div.renew_form").length > 0) {
        idManPK = "续借";
        // 获取可续借馆藏表格行
        let $trRenewItems = $("form.renew_form table tr");
        // 两个单选框也占一行，续借命令也占一行，有数据必须是 3 行起
        if ($trRenewItems.length > 2) {
            // 创建二维数组用于保存借出列表数据
            // [0] 存放自定义表头
            let aoaRenewTable = new Array();
            aoaRenewTable[0] = ["复本条码", "索书号", "复本号", "题名与责任者", "著者", "到期日期", "催还日期"];
            // 遍历续借列表每一行，提取数据，存进二维数组
            // 同期高亮已催还的表格行，以及最近到期的表格行
            let recentDueDate = ""; // 最近到期日期，块外声明，块内初始化
            $trRenewItems.each((row, thiTR) => {
                // 跳过：第一行（单选框以及 PK 界面）和最后一行（续借命令按钮）
                if (row == 0 || row == $trRenewItems.length - 1)
                    return;
                // 依次匹配提取：复本条码、索书号、复本号、著者、题名与责任者
                // 数据来源：复选框的 name 属性值
                const [
                    barCode, callNumber, copyNumber, author, title
                ] = $(thiTR).find("td input").attr("name").trim().match(
                    /^RENEW\^(.+?)\^(.+?)\^(.+?)\^(.+?)\^(.+?)\^$/
                ).slice(1); // [0] 是完整匹配结果，不用
                let dueDateRoutine = "", dueDateUrged = "";
                // 获取到期日期、催还日期
                const strongs = $(thiTR).find("td > strong").length;
                if ( strongs == 1) {// 无催还情况
                    dueDateRoutine = $(thiTR).find("td > strong").text().trim().replace(/^(.+?),.+/, "$1"); // 正常到期日期；省略时间（逗号后 23:59）
                    // 隐藏到期日期的时间部分
                    // 方式：重写 html() 将 ,23:59 装进 .powerkit_original_line 容器
                    $(thiTR).find("td > strong").html(dueDateRoutine + "<span class='powerkit_original_inline'>,23:59</span>");
                } else if (strongs == 3) { // 有催还情况
                    dueDateRoutine = $(thiTR).find("td > strong:eq(1)").text().trim().replace(/^(.+?),.+/, "$1"); // 正常到期日期（但有催还）；省略时间（逗号后 23:59）
                    dueDateUrged = $(thiTR).find("td > strong:eq(2)").text().trim().replace(/^(.+?),.+/, "$1"); // 催还日期；省略时间（逗号后 23:59）
                    // 隐藏到期日期/催还日期的时间部分
                    // 方式：重写 html() 将 ,23:59 装进 .powerkit_original_line 容器
                    // 另外，给催还日期（一般更早）前面加上标注（原生界面这里比较乱）
                    $(thiTR).find("td > strong:eq(1)").html(dueDateRoutine + "<span class='powerkit_original_inline'>,23:59</span>");
                    $(thiTR).find("td > strong:eq(2)").html("<span class='powerkit_inline'>催还日期：</span>" + dueDateUrged + "<span class='powerkit_original_inline'>,23:59</span>");
                    // 使第一列的复选框无效，因为催还的不允许续借 // 很难用开关切换，暂不实现
                    // $(thiTR).find("input[type='checkbox']").attr("disabled", true);
                }
                // 存进二维数组
                // [0] 表头，后续从 [1] 开始，但本表数据也是从 row=1 开始，所以 row-1+1 -> row
                aoaRenewTable[row] = [barCode, callNumber, copyNumber, title, author, dueDateRoutine, dueDateUrged];
                // 增加数据字段
                $(thiTR).find("input").parent().before($("<td class='powerkit_tabel-cell'></td>")
                                                     .append($(`<span class='powerkit_inline'>${barCode}</span>`))
                                                     .append($(`<span class='powerkit_inline'><br />索书号：${callNumber}</span>`)));
                // 初始化最近到期日期：排序缘故，最近的在最上面
                // 但如果是催还的，不算，要排除 dueDateUrged 非空值的
                // 无催还的第一个 dueDateRoutine 就是最近到期日期
                if (recentDueDate == "" && dueDateUrged == "")
                    recentDueDate = dueDateRoutine;
                // 高亮：最近到期的行内每个单元格（与最近到期日期相等的到期日期）
                if (recentDueDate == dueDateRoutine)
                    $(thiTR).find("td").addClass("powerkit_recent-due");
                // 高亮：已催还的行内每个单元格（有提醒标志）
                if ($(thiTR).find("td > strong.overdue").length > 0)
                    $(thiTR).find("td").addClass("powerkit_status-caution");
                // 隐藏题名与责任者之后多余的著者字段
                // 匹配 HTML 注释后半段，装进一个 powerkit_original 系列的容器里
                let titleAuthor = $(thiTR).find("td > label").html();
                $(thiTR).find("td > label").html(titleAuthor.replace(/([\w\W]+-->)([\w\W]*)/, "$1<span class='powerkit_original_inline'>$2</span>"));
            });
            console.log("aoaRenewTable 行数（含单选框行、按钮行）：" + aoaRenewTable.length);
            
            // 待续借书单导出 TSV
            let nowDateTime = getFilenameTimestampNow();
            let tsvRenewTableEncoded = btoaUTF8(getTSVfromAoA(aoaRenewTable));
            let aDownloadRenewTSV = "［<a "
              + `download='待续借清单-${userName}-${nowDateTime}-(${$trRenewItems.length-2}).txt' ` // 反引号格式化字符串
              + `href='data:text/tab-separated-values;base64,${tsvRenewTableEncoded}'>导出待续借清单 TSV</a>］`;
            // 待续借书单导出 Excel
            // SheetJS 来自外部资源，校园网内未必成功加载，要检验
            let aDownloadRenewXlsx = window.XLSX ? "［<a href='#'>导出待续借清单 Excel</a>］" : "";

            // 创建容器：续借增强功能，在列表上方两个单选框左边
            let $spanRenewUtils = $("<span class='powerkit_inline renew_utils'></span>");
            $spanRenewUtils.html(aDownloadRenewTSV + aDownloadRenewXlsx);
            $trRenewItems.eq(0).find("td").prepend($spanRenewUtils);

            // 挂接事件：待续借书单导出 Excel
            if (window.XLSX) $spanRenewUtils.find("a:eq(1)").click(() => {
                // 调用 SheetJS 生成工作表，加入工作簿
                const sheetRenew = XLSX.utils.aoa_to_sheet(aoaRenewTable);
                const wbRenew = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wbRenew, sheetRenew, "待续借书单");
                // 社区版 SheetJS 无法修饰单元格格式，就这样了
                // 写入文件并被浏览器“下载”
                XLSX.writeFile(wbRenew, `待续借清单-${userName}-${nowDateTime}-(${$trRenewItems.length-2}).xlsx`);
                return false; // 阻止链接前进
            });
            
            // 全选 + 全选最近到期
            let $labelSelectAllRenew = $("<label class='powerkit_inline'></label>");
            $labelSelectAllRenew.html("<input type='checkbox' id='chkSelectAllRenew' /> 全选");
            let $labelSelectAllRecentRenew = $("<label class='powerkit_inline'></label>");
            $labelSelectAllRecentRenew.html("　<input type='checkbox' id='chkSelectAllRecentRenew' /> 全选最近到期（不含已催还）");
            $spanRenewUtils.prepend($labelSelectAllRecentRenew)
                           .prepend($labelSelectAllRenew);
            // 挂接事件
            $("#chkSelectAllRenew").click(() => {
                // 全选
                // 在所有单元格中...
                //   凡其中第一个 strong 不含催还标记 .overdue 的...
                //   其同行的复选框，选中（无论是否已经选中）
                $("td").find("strong:eq(0):not(.overdue)") // 必须用 find() 断开后 eq() 才能正确计数
                       .parent() // td
                       .parent() // tr
                       .find("input[type='checkbox']").attr("checked", true);
            });
            $("#chkSelectAllRecentRenew").click(() => {
                // check 才会继续
                if ($("#chkSelectAllRecentRenew").attr("checked") != true)
                    return;
                // 在之前添加了 .powerkit_recent-due 的单元格中...
                //   凡其中第一个 strong 不含催还标记 .overdue 的...
                //   其同行的复选框，选中（无论是否已经选中）
                $("td.powerkit_recent-due").find("strong:eq(0):not(.overdue)") // 必须用 find() 断开后 eq() 才能正确计数
                                           .parent() // td
                                           .parent() // tr
                                           .find("input[type='checkbox']").attr("checked", true);
                // 顺便模拟点击“选择续借馆藏”（全部续借就没意义了）
                $("#renew_selected").trigger("click");
            });
            $("td > input[type='checkbox']").click(() => {
                // 只要有任何待续借馆藏被手动选取，就取消勾选“全选”和“选中所有最近到期”，以便再次使用之
                $("#chkSelectAllRecentRenew").attr("checked", false);
                $("#chkSelectAllRenew").attr("checked", false);
            });
        }
        // 右栏面板：快捷链接：用户状态查询
        // TODO 有问题，暂时取消含有 ID 的链接
        // $("#ulPowerKit").append($(`<li class='powerkit_block'><a href='http://162.105.138.200/uhtbin/cgisirsi/0/0/${userSessionID}/30'>快捷链接：读者服务 | 用户状态查询（借出、预约等）</a></li>`));
    }

    //////////////////////////////////////////////////////////////////////////
    // 索书号浏览中图法分类增强
    // 中图法分类数据表（将近 3800 行 JS 字典/对象格式）
    // JSON 转换日期：2023/02/27
    // JSON HPack 压缩：2023/03/08
const CLCnodesH = [["level","tag","name","parentTag"],[0,"__root__","中图法第五版","__none__"],[1,"A","马克思主义、列宁主义、毛泽东思想、邓小平理论","__root__"],[2,"A1","马克思、恩格斯著作","A"],[3,"A11","选集、文集","A1"],[3,"A12","单行著作","A1"],[3,"A13","书信集、日记、函电、谈话","A1"],[3,"A14","诗词","A1"],[3,"A15","手迹","A1"],[3,"A16","专题汇编","A1"],[3,"A18","语录","A1"],[2,"A2","列宁著作","A"],[3,"A21","选集、文集","A2"],[3,"A22","单行著作","A2"],[3,"A23","书信集、日记、函电、谈话","A2"],[3,"A25","手迹","A2"],[3,"A26","专题汇编","A2"],[3,"A28","语录","A2"],[2,"A3","斯大林著作","A"],[3,"A31","选集、文集","A3"],[3,"A32","单行著作","A3"],[3,"A33","书信集、日记、函电、谈话","A3"],[3,"A35","手迹","A3"],[3,"A36","专题汇编","A3"],[3,"A38","语录","A3"],[2,"A4","毛泽东著作","A"],[3,"A41","选集、文集","A4"],[3,"A42","单行著作","A4"],[3,"A43","书信集、日记、函电、谈话","A4"],[3,"A44","诗词","A4"],[3,"A45","手迹","A4"],[3,"A46","专题汇编","A4"],[3,"A48","语录","A4"],[2,"A49","邓小平著作","A"],[3,"A491","选集、文集","A49"],[3,"A492","单行著作","A49"],[3,"A493","书信集、日记、函电、谈话","A49"],[3,"A495","手迹","A49"],[3,"A496","专题汇编","A49"],[3,"A498","语录","A49"],[2,"A5","马克思、恩格斯、列宁、斯大林、毛泽东、邓小平著作汇编","A"],[3,"A56","专题汇编","A5"],[3,"A58","语录","A5"],[2,"A7","马克思、恩格斯、列宁、斯大林、毛泽东、邓小平生平和传记","A"],[3,"A71","马克思","A7"],[3,"A72","恩格斯","A7"],[3,"A73","列宁","A7"],[3,"A74","斯大林","A7"],[3,"A75","毛泽东","A7"],[3,"A76","邓小平","A7"],[2,"A8","马克思主义、列宁主义、毛泽东思想、邓小平理论的学习和研究","A"],[3,"A81","马克思主义的学习和研究","A8"],[3,"A82","列宁主义的学习和研究","A8"],[3,"A83","斯大林的思想的学习和研究","A8"],[3,"A84","毛泽东思想的学习和研究","A8"],[3,"A849","邓小平理论的学习和研究","A8"],[3,"A85","著作汇编的学习和研究","A8"],[1,"B","哲学、宗教","__root__"],[2,"B-4","哲学教育与普及","B"],[3,"B-49","哲学学习与普及","B-4"],[2,"B0","哲学理论","B"],[3,"B0-0","马克思主义哲学","B0"],[3,"B01","哲学基本问题","B0"],[3,"B02","辩证唯物主义","B0"],[3,"B03","历史唯物主义（唯物史观）","B0"],[3,"B08","哲学流派及其研究","B0"],[2,"B1","世界哲学","B"],[3,"B12","古代哲学","B1"],[3,"B13","中世纪哲学","B1"],[3,"B14","近代哲学","B1"],[3,"B15","现代哲学","B1"],[3,"{B17}","马克思主义哲学的传播和发展","B1"],[2,"B2","中国哲学","B"],[3,"B20","唯物主义与唯心主义","B2"],[3,"B21","古代哲学","B2"],[3,"B22","先秦哲学（~前220年）","B2"],[3,"B232","秦汉哲学（总论）（公元前221~公元220年）","B2"],[3,"B233","秦代哲学（公元前221~前207年）","B2"],[3,"B234","汉代哲学（公元前206~公元220年）","B2"],[3,"B235","三国、晋、南北朝哲学（220~589年）","B2"],[3,"B241","隋、唐、五代哲学（581~960年）","B2"],[3,"B244","宋、元哲学（960~1368年）","B2"],[3,"B248","明代哲学（1368~1644年）","B2"],[3,"B249","清代哲学（1644~1840年）","B2"],[3,"B25","近代哲学（1840~1918年）","B2"],[3,"B26","现代哲学（1919年~）","B2"],[3,"B27","马克思主义哲学在中国的传播与发展","B2"],[2,"B3","亚洲哲学","B"],[3,"B302","古代哲学","B3"],[3,"B303","中世纪哲学","B3"],[3,"B304","近代哲学","B3"],[3,"B305","现代哲学","B3"],[3,"{B307}","马克思主义哲学在亚洲的传播与发展","B3"],[3,"B31","东亚哲学","B3"],[3,"B33","东南亚哲学","B3"],[3,"B35","南亚哲学","B3"],[3,"B36","中亚及外高加索地区哲学","B3"],[3,"B37","西亚（西南亚）哲学","B3"],[2,"B4","非洲哲学","B"],[3,"B41","北非哲学","B4"],[2,"B5","欧洲哲学","B"],[3,"B502","古代哲学","B5"],[3,"B503","中世纪哲学","B5"],[3,"B504","十七~十九世纪前期哲学","B5"],[3,"B505","十九世纪后期~二十世纪哲学","B5"],[3,"B506","二十一世纪哲学","B5"],[3,"{B507}","马克思主义哲学在欧洲的传播与发展","B5"],[3,"B51","东欧、中欧哲学","B5"],[3,"B53","北欧哲学","B5"],[3,"B54","南欧（东南欧、西南欧）哲学","B5"],[3,"B56","西欧哲学","B5"],[2,"B6","大洋洲及太平洋岛屿哲学","B"],[3,"B61","澳、新、巴地区哲学","B6"],[3,"B63","波利尼西亚哲学","B6"],[3,"B65","密克罗尼西亚哲学","B6"],[3,"B66","美拉尼西亚哲学","B6"],[2,"B7","美洲哲学","B"],[3,"B71","北美洲哲学","B7"],[2,"B80","思维科学","B"],[3,"B80-0","思维科学理论与方法论","B80"],[3,"B802","思维规律","B80"],[3,"B804","思维方式","B80"],[2,"B81","逻辑学（论理学）","B"],[3,"B81-0","逻辑学理论与方法论","B81"],[3,"B811","辩证逻辑","B81"],[3,"B812","形式逻辑（名学、辩学）","B81"],[3,"[B813]","数理逻辑（符号逻辑）","B81"],[3,"[B814]","概率逻辑","B81"],[3,"B815","哲理逻辑（非经典逻辑）","B81"],[3,"B819","应用逻辑","B81"],[2,"B82","伦理学（道德哲学）","B"],[3,"B82-0","伦理学理论与方法论","B82"],[3,"B821","人生观、人生哲学","B82"],[3,"B822","国家道德","B82"],[3,"B823","家庭、婚姻道德","B82"],[3,"B824","社会公德","B82"],[3,"B825","个人修养","B82"],[3,"B829","其他伦理规范","B82"],[2,"B83","美学","B"],[3,"B83-0","美学理论","B83"],[3,"B832","美学与社会生产","B83"],[3,"B834","美学与现实社会生活","B83"],[3,"[B835]","艺术美学","B83"],[2,"B84","心理学","B"],[3,"B84-0","心理学理论","B84"],[3,"B841","心理学研究方法","B84"],[3,"B842","心理过程与心理状态","B84"],[3,"B843","发生心理学","B84"],[3,"B844","发展心理学（人类心理学）","B84"],[3,"B845","生理心理学","B84"],[3,"B846","变态心理学、病态心理学、超意识心理学","B84"],[3,"B848","个性心理学（人格心理学）","B84"],[3,"B849","应用心理学","B84"],[2,"B9","宗教","B"],[3,"B91","对宗教的分析和研究","B9"],[3,"B92","宗教理论与概况","B9"],[3,"B93","神话与原始宗教","B9"],[3,"B94","佛教","B9"],[3,"B95","道教","B9"],[3,"B96","伊斯兰教（回教）","B9"],[3,"B97","基督教","B9"],[3,"B98","其他宗教","B9"],[3,"B99","术数、迷信","B9"],[1,"C","社会科学总论","__root__"],[2,"C0","社会科学理论与方法论","C"],[3,"C01","科学研究的方针、政策及其阐述","C0"],[3,"C02","科学的哲学原理","C0"],[3,"C03","科学的方法论","C0"],[3,"C04","术语规范与交流","C0"],[3,"C05","与其他科学的关系","C0"],[3,"C06","学派、学说及其评论研究","C0"],[3,"{C08}","资产阶级理论及其评论研究","C0"],[3,"C09","社会科学史","C0"],[2,"C1","社会科学概况、现状、进展","C"],[3,"C11","世界社会科学概况、现状、进展","C1"],[3,"C12","中国社会科学概况、现状、进展","C1"],[3,"C13","亚洲社会科学概况、现状、进展","C1"],[3,"C14","非洲社会科学概况、现状、进展","C1"],[3,"C15","欧洲社会科学概况、现状、进展","C1"],[3,"C16","大洋洲及太平洋岛屿社会科学概况、现状、进展","C1"],[3,"C17","美洲社会科学概况、现状、进展","C1"],[3,"C18","专利","C1"],[3,"C19","创造发明、先进经验","C1"],[2,"C2","社会科学机构、团体、会议","C"],[3,"C20","国际组织","C2"],[3,"C23","社会团体","C2"],[3,"C24","研究机构","C2"],[3,"C26","学术团体、学会、协会","C2"],[3,"C27","学术会议、专业会议","C2"],[3,"C28","展览会、展览馆、博物馆","C2"],[3,"C289","图书馆、信息服务机构、咨询机构","C2"],[3,"C29","企业","C2"],[2,"C3","社会科学研究方法","C"],[3,"C31","调查方法、工作方法","C3"],[3,"C32","统计方法、计算方法","C3"],[3,"C33","试验方法与试验设备","C3"],[3,"C34","分析研究、测试与鉴定","C3"],[3,"C35","技术条件","C3"],[3,"C36","组织方法、管理方法","C3"],[3,"C37","数据处理","C3"],[3,"C39","信息化建设、新技术的应用","C3"],[2,"C4","社会科学教育与普及","C"],[3,"C40","教育组织、学校","C4"],[3,"C41","教学计划、教学大纲、课程研究","C4"],[3,"C42","教学方法、教学参考书","C4"],[3,"C43","教材、课本","C4"],[3,"C44","习题、试题与题解","C4"],[3,"C45","教学实验、实习、实践","C4"],[3,"C46","教学设备","C4"],[3,"C47","考核、评估、奖励","C4"],[3,"C49","普及读物","C4"],[2,"C5","社会科学丛书、文集、连续性出版物","C"],[3,"C51","丛书（汇刻书）、文库","C5"],[3,"C52","全集、选集","C5"],[3,"C53","论文集","C5"],[3,"C54","年鉴、年刊","C5"],[3,"C55","连续出版物","C5"],[3,"C56","政府出版物、团体出版物","C5"],[2,"C6","社会科学参考工具书","C"],[3,"C61","名词术语、辞典、百科全书（类书）","C6"],[3,"C62","手册、名录、指南、一览表、年表","C6"],[3,"C63","目录、样本、说明书","C6"],[3,"C64","表解、图解、图册、公式、数据、地图","C6"],[3,"C65","条例、规程、标准","C6"],[3,"C66","统计资料","C6"],[3,"C67","参考资料","C6"],[2,"[C7]","社会科学文献检索工具书","C"],[2,"C79","非书资料、视听资料","C"],[3,"C791","缩微制品","C79"],[3,"C792","录音制品","C79"],[3,"C793","感光制品、录像制品","C79"],[3,"C794","机读资料","C79"],[3,"C795","网络资源","C79"],[2,"C8","统计学","C"],[3,"C81","统计方法","C8"],[3,"[C82]","专类统计学","C8"],[3,"C829","世界各国统计工作","C8"],[3,"C83","世界各国统计资料","C8"],[2,"C91","社会学","C"],[3,"C91-0","理论与方法论","C91"],[3,"[C911]","社会发展和变迁","C91"],[3,"C912","社会结构和社会关系","C91"],[3,"C913","社会生活、社会问题、社会保障","C91"],[3,"C914","社会利益","C91"],[3,"C915","社会调查和社会分析","C91"],[3,"C916","社会工作、社会管理、社会规划","C91"],[3,"[C919]","分科社会学","C91"],[2,"C92","人口学","C"],[3,"C92-0","人口学理论与方法论","C92"],[3,"C921","人口统计学","C92"],[3,"C922","人口地理学","C92"],[3,"C923","人口与计划生育","C92"],[3,"C924","世界各国人口调查及其研究","C92"],[2,"C93","管理学","C"],[3,"C93-0","管理学理论与方法论","C93"],[3,"C931","管理技术与方法","C93"],[3,"C932","咨询学","C93"],[3,"C933","领导学","C93"],[3,"C934","决策学","C93"],[3,"C935","管理计划和控制","C93"],[3,"C936","管理组织学","C93"],[3,"C939","应用管理学","C93"],[2,"[C94]","系统科学","C"],[2,"C95","民族学、文化人类学","C"],[3,"C95-0","民族学理论与方法论","C95"],[3,"C951","民族起源、发展、变迁","C95"],[3,"[C952]","民族史志、民族地理","C95"],[3,"[C953]","民俗学","C95"],[3,"C954","民族社会形态、社会制度","C95"],[3,"C955","民族性、民族心理","C95"],[3,"C956","民族融合、民族同化","C95"],[3,"[C957]","民族工作、民族问题","C95"],[3,"C958","文化人类学","C95"],[2,"C96","人才学","C"],[3,"C961","人才培养与人才选拔","C96"],[3,"C961.9","人才预测与人才规划","C96"],[3,"C962","人才管理","C96"],[3,"C963","人才智力开发","C96"],[3,"C964","世界各国人才调查及其研究","C96"],[3,"[C965]","人才市场","C96"],[3,"[C969]","专门人才学","C96"],[2,"C97","劳动科学","C"],[3,"C970","劳动科学基础理论","C97"],[3,"[C971]","劳动经济学","C97"],[3,"[C972]","劳动法学","C97"],[3,"[C973]","劳动关系学","C97"],[3,"[C974]","劳动管理学","C97"],[3,"C975","职业培训","C97"],[3,"C976.1","劳动社会学","C97"],[3,"[C976.2]","劳动安全、劳动卫生","C97"],[3,"C976.7","劳动计量学","C97"],[3,"[C976.8]","劳动统计学","C97"],[3,"[C979]","社会保障学","C97"],[1,"D","政治、法律","__root__"],[2,"D0","政治学、政治理论","D"],[3,"D0-0","科学社会主义理论（总论）","D0"],[3,"D01","阶级、阶层理论","D0"],[3,"D02","革命理论","D0"],[3,"D03","国家理论","D0"],[3,"D04","无产阶级革命与无产阶级专政理论","D0"],[3,"D05","政党理论","D0"],[3,"D06","民族独立、殖民地问题理论","D0"],[3,"D068","战争与和平问题理论","D0"],[3,"D069","国际主义与爱国主义","D0"],[3,"D08","其他政治理论问题","D0"],[3,"D09","政治学史、政治思想史","D0"],[2,"D1","国际共产主义运动","D"],[3,"[D10]","共产主义运动理论","D1"],[3,"D11","共产主义运动初期（1846~1864年）","D1"],[3,"D12","第一国际（国际工人协会，1864~1876年）","D1"],[3,"D13","巴黎公社（1871年）","D1"],[3,"D139","第一国际解散后的共产主义运动（1877~1889年）","D1"],[3,"D14","第二国际（1889~1900年）","D1"],[3,"D15","十月社会主义革命（1917年）","D1"],[3,"D16","共产国际（第三国际，1919年3月~1943年6月）","D1"],[3,"D169","托派","D1"],[3,"D17","共产党、工人党情报局（1947年9月~1956年4月）","D1"],[3,"D18","当代国际共产主义运动（1956年4月~）","D1"],[2,"D2","中国共产党","D"],[3,"D2-0","党的领导人著作","D2"],[3,"D20","建党理论","D2"],[3,"D21","党章","D2"],[3,"D22","党的组织、会议及其文献","D2"],[3,"D23","党史","D2"],[3,"D24","党的总路线和总政策","D2"],[3,"D25","党的领导","D2"],[3,"D26","党的建设","D2"],[3,"D27","中国共产党与各国共产党的关系","D2"],[3,"D29","中国共产主义青年团","D2"],[2,"D33","亚洲共产党","D"],[3,"D331","东亚共产党","D33"],[3,"D333","东南亚共产党","D33"],[3,"D335","南亚共产党","D33"],[3,"D336","中亚及外高加索地区共产党","D33"],[3,"D337","西亚（西南亚）共产党","D33"],[2,"D34","非洲共产党","D"],[3,"D341","北非共产党","D34"],[3,"D342","东非共产党","D34"],[3,"D343","西非共产党","D34"],[3,"D346","中非共产党","D34"],[3,"D347","南非共产党","D34"],[2,"D35","欧洲共产党","D"],[3,"D351","东欧、中欧共产党","D35"],[3,"D353","北欧共产党","D35"],[3,"D354","南欧（东南欧、西南欧）共产党","D35"],[3,"D356","西欧共产党","D35"],[2,"D36","大洋洲及太平洋岛屿共产党","D"],[3,"D361","澳、新、巴地区共产党","D36"],[3,"D363","波利尼西亚共产党","D36"],[3,"D365","密克罗尼西亚共产党","D36"],[3,"D366","美拉尼西亚共产党","D36"],[2,"D37","美洲共产党","D"],[3,"D371","北美洲共产党","D37"],[3,"D373","中美洲共产党","D37"],[3,"D375","西印度群岛共产党","D37"],[3,"D377","南美洲共产党","D37"],[2,"D4","工人、农民、青年、妇女运动与组织","D"],[3,"D41","工人运动与组织","D4"],[3,"D42","农民运动与组织","D4"],[3,"D43","青年、学生运动与组织","D4"],[3,"D44","妇女运动与组织","D4"],[2,"D5","世界政治","D"],[3,"D50","世界政治概况","D5"],[3,"D51","国际政治矛盾与斗争","D5"],[3,"D52","世界政治制度与国家行政管理","D5"],[3,"D55","世界政治事件","D5"],[3,"D56","世界社会结构","D5"],[3,"D57","社会保障与社会福利","D5"],[3,"D58","社会生活、社会问题、社会工作","D5"],[3,"D59","世界政治制度史","D5"],[2,"D6","中国政治","D"],[3,"D60","政策、政论","D6"],[3,"D61","中国革命和建设问题","D6"],[3,"D619","社会主义革命和社会主义建设成就","D6"],[3,"D62","政治制度与国家机构","D6"],[3,"D63","国家行政管理","D6"],[3,"D64","思想政治教育和精神文明建设","D6"],[3,"D65","政治运动、政治事件","D6"],[3,"D66","阶级结构与社会结构","D6"],[3,"D668","社会调查和社会分析","D6"],[3,"D669","社会生活、社会问题、社会工作","D6"],[3,"D67","地方政治","D6"],[3,"D69","政治制度史","D6"],[2,"D73","亚洲政治","D"],[3,"D731","东亚政治","D73"],[3,"D733","东南亚政治","D73"],[3,"D735","南亚政治","D73"],[3,"D736","中亚及外高加索地区政治","D73"],[3,"D737","西亚（西南亚）政治","D73"],[2,"D74","非洲政治","D"],[3,"D741","北非政治","D74"],[3,"D742","东非政治","D74"],[3,"D743","西非政治","D74"],[3,"D746","中非政治","D74"],[3,"D747","南非政治","D74"],[2,"D75","欧洲政治","D"],[3,"D751","东欧、中欧政治","D75"],[3,"D753","北欧政治","D75"],[3,"D754","南欧（东南欧、西南欧）政治","D75"],[3,"D756","西欧政治","D75"],[2,"D76","大洋洲及太平洋岛屿政治","D"],[3,"D761","澳、新、巴地区政治","D76"],[3,"D763","波利尼西亚政治","D76"],[3,"D765","密克罗尼西亚政治","D76"],[3,"D766","美拉尼西亚政治","D76"],[2,"D77","美洲政治","D"],[3,"D771","北美洲政治","D77"],[3,"D773","中美洲政治","D77"],[3,"D775","西印度群岛政治","D77"],[3,"D777","南美洲政治","D77"],[2,"D8","外交、国际关系","D"],[3,"D80","外交、国际关系理论","D8"],[3,"D81","国际关系","D8"],[3,"D82","中国外交","D8"],[3,"D83","亚洲外交","D8"],[3,"D84","非洲外交","D8"],[3,"D85","欧洲外交","D8"],[3,"D86","大洋洲及太平洋岛屿外交","D8"],[3,"D87","美洲外交","D8"],[2,"D9","法律","D"],[3,"D90","法律理论（法学）","D9"],[3,"D91","法学各部门","D9"],[3,"D92","中国法律","D9"],[3,"D93","亚洲法律","D9"],[3,"D94","非洲法律","D9"],[3,"D95","欧洲法律","D9"],[3,"D96","大洋洲及太平洋岛屿法律","D9"],[3,"D97","美洲法律","D9"],[3,"D99","国际法","D9"],[1,"E","军事","__root__"],[2,"E0","军事理论","E"],[3,"E0-02","军事哲学","E0"],[3,"E0-03","军事科学方法论","E0"],[3,"E0-05","军事学与其他科学的关系","E0"],[3,"E07","军事分支学科","E0"],[3,"E08","各军种、兵种建设理论","E0"],[3,"E09","军事学史、军事思想史","E0"],[2,"E1","世界军事","E"],[3,"E10","军事政策","E1"],[3,"E11","军事建设与战备","E1"],[3,"E12","军事制度","E1"],[3,"E13","军事教育与训练","E1"],[3,"E139","军事科研组织与活动","E1"],[3,"E141","司令部工作","E1"],[3,"E142","政治工作","E1"],[3,"E144","后方勤务","E1"],[3,"E145","军事装备工作","E1"],[3,"E15","各种武装力量（各军、兵种）","E1"],[3,"E16","军事组织与活动","E1"],[3,"E19","军事史","E1"],[2,"E2","中国军事","E"],[3,"E20","军事理论","E2"],[3,"E21","司令部工作","E2"],[3,"E22","政治工作","E2"],[3,"E23","后方勤务","E2"],[3,"E24","军事装备工作","E2"],[3,"E249","生产建设工作","E2"],[3,"E25","国防建设与战备","E2"],[3,"E26","军事制度","E2"],[3,"E27","各种武装力量（各军、兵种）","E2"],[3,"E28","民兵","E2"],[3,"E289","地方军事","E2"],[3,"E29","军事史（战史、建军史）","E2"],[2,"E3","亚洲军事","E"],[3,"E31","东亚军事","E3"],[3,"E33","东南亚军事","E3"],[3,"E35","南亚军事","E3"],[3,"E36","中亚及外高加索地区军事","E3"],[3,"E37","西亚（西南亚）军事","E3"],[2,"E4","非洲军事","E"],[3,"E41","北非军事","E4"],[3,"E42","东非军事","E4"],[3,"E43","西非军事","E4"],[3,"E46","中非军事","E4"],[3,"E47","南非军事","E4"],[2,"E5","欧洲军事","E"],[3,"E51","东欧、中欧军事","E5"],[3,"E53","北欧军事","E5"],[3,"E54","南欧（东南欧、西南欧）军事","E5"],[3,"E56","西欧军事","E5"],[2,"E6","大洋洲及太平洋岛屿军事","E"],[3,"E61","澳、新、巴地区军事","E6"],[3,"E63","波利尼西亚军事","E6"],[3,"E65","密克罗尼西亚军事","E6"],[3,"E66","美拉尼西亚军事","E6"],[2,"E7","美洲军事","E"],[3,"E71","北美洲军事","E7"],[3,"E73","中美洲军事","E7"],[3,"E75","西印度群岛军事","E7"],[3,"E77","南美洲军事","E7"],[2,"E8","战略学、战役学、战术学","E"],[3,"E81","战略学","E8"],[3,"E82","战役学","E8"],[3,"E83","战术学","E8"],[3,"E86","非常规战争","E8"],[3,"E87","军事情报与军事侦察","E8"],[3,"E89","古代兵法、战法","E8"],[2,"E9","军事技术","E"],[3,"E91","军事技术基础科学","E9"],[3,"E92","武器、军用器材","E9"],[3,"E94","军事指挥信息系统","E9"],[3,"E95","军事工程","E9"],[3,"E96","军事通信","E9"],[3,"E99","军事地形学、军事地理学","E9"],[1,"F","经济","__root__"],[2,"F0","经济学","F"],[3,"F0-0","马克思主义政治经济学（总论）","F0"],[3,"F0-08","西方经济学（总论）","F0"],[3,"F01","经济学基本理论","F0"],[3,"F02","前资本主义社会生产方式","F0"],[3,"F03","资本主义社会生产方式","F0"],[3,"F04","社会主义社会生产方式","F0"],[3,"F05","共产主义社会生产方式","F0"],[3,"F06","经济学分支科学","F0"],[3,"F08","各科经济学","F0"],[3,"F09","经济思想史","F0"],[2,"F1","世界各国经济概况、经济史、经济地理","F"],[3,"F11","世界经济、国际经济关系","F1"],[3,"F12","中国经济","F1"],[3,"F13","亚洲经济","F1"],[3,"F14","非洲经济","F1"],[3,"F15","欧洲经济","F1"],[3,"F16","大洋洲及太平洋岛屿经济","F1"],[3,"F17","美洲经济","F1"],[2,"F2","经济管理","F"],[3,"F20","国民经济管理","F2"],[3,"F21","经济计划与规划","F2"],[3,"F22","经济计算、经济数学方法","F2"],[3,"F23","会计","F2"],[3,"F239","审计","F2"],[3,"F24","劳动经济","F2"],[3,"F25","物流经济","F2"],[3,"F26","产业经济","F2"],[3,"F27","企业经济","F2"],[3,"F28","基本建设经济","F2"],[3,"F29","城市经济、房地产经济","F2"],[2,"F3","农业经济","F"],[3,"F30","农业经济理论","F3"],[3,"F31","世界农业经济","F3"],[3,"F32","中国农业经济","F3"],[3,"F33","亚洲农业经济","F3"],[3,"F34","非洲农业经济","F3"],[3,"F35","欧洲农业经济","F3"],[3,"F36","大洋洲及太平洋岛屿农业经济","F3"],[3,"F37","美洲农业经济","F3"],[2,"F4","工业经济","F"],[3,"F40","工业经济理论","F4"],[3,"F41","世界工业经济","F4"],[3,"F42","中国工业经济","F4"],[3,"F43","亚洲工业经济","F4"],[3,"F44","非洲工业经济","F4"],[3,"F45","欧洲工业经济","F4"],[3,"F46","大洋洲及太平洋岛屿工业经济","F4"],[3,"F47","美洲工业经济","F4"],[3,"F49","信息产业经济","F4"],[2,"F5","交通运输经济","F"],[3,"F50","交通运输经济理论","F5"],[3,"F51","世界各国交通运输经济","F5"],[3,"F53","铁路运输经济","F5"],[3,"F54","陆路、公路运输经济","F5"],[3,"F55","水路运输经济","F5"],[3,"F56","航空运输经济","F5"],[3,"F57","城市交通运输经济","F5"],[2,"F59","旅游经济","F"],[3,"F590","旅游经济理论与方法","F59"],[3,"F591","世界旅游业","F59"],[3,"F592","中国旅游业","F59"],[3,"F593","亚洲旅游业","F59"],[3,"F594","非洲旅游业","F59"],[3,"F595","欧洲旅游业","F59"],[3,"F596","大洋洲及太平洋岛屿旅游业","F59"],[3,"F597","美洲旅游业","F59"],[2,"F6","邮电通信经济","F"],[3,"F60","通信经济理论","F6"],[3,"F61","邮政","F6"],[3,"F62","电信","F6"],[3,"F63","世界各国邮电通信经济","F6"],[2,"F7","贸易经济","F"],[3,"F71","国内贸易经济","F7"],[3,"F72","中国国内贸易经济","F7"],[3,"F73","世界各国国内贸易经济","F7"],[3,"F74","国际贸易","F7"],[3,"F75","各国对外贸易","F7"],[3,"F76","商品学","F7"],[2,"F8","财政、金融","F"],[3,"F81","财政、国家财政","F8"],[3,"F82","货币","F8"],[3,"F83","金融、银行","F8"],[3,"F84","保险","F8"],[1,"G","文化、科学、教育、体育","__root__"],[2,"G0","文化理论","G"],[3,"G02","文化哲学","G0"],[3,"G03","文化的民族性","G0"],[3,"G04","比较文化学","G0"],[3,"G05","文化与其他学科的关系","G0"],[3,"[G07]","文化地理学","G0"],[3,"[G09]","文化史","G0"],[2,"G1","世界各国文化与文化事业","G"],[3,"G11","世界","G1"],[3,"G12","中国","G1"],[3,"G13","亚洲","G1"],[3,"G14","非洲","G1"],[3,"G15","欧洲","G1"],[3,"G16","大洋洲及太平洋岛屿","G1"],[3,"G17","美洲","G1"],[2,"G2","信息与知识传播","G"],[3,"G20","信息与传播理论","G2"],[3,"G209","传播事业","G2"],[3,"G21","新闻事业","G2"],[3,"G22","广播、电视事业","G2"],[3,"G23","出版事业","G2"],[3,"G24","群众文化事业","G2"],[3,"G25","图书馆事业、信息事业","G2"],[3,"G26","博物馆事业","G2"],[3,"G27","档案事业","G2"],[2,"G3","科学、科学研究","G"],[3,"G30","科学研究理论","G3"],[3,"G31","科学研究工作","G3"],[3,"G32","世界各国科学研究事业","G3"],[3,"{G35}","情报学、情报工作","G3"],[2,"G4","教育","G"],[3,"G40","教育学","G4"],[3,"G41","思想政治教育、德育","G4"],[3,"G42","教学理论","G4"],[3,"G43","电化教育","G4"],[3,"G44","教育心理学","G4"],[3,"G45","教师与学生","G4"],[3,"G459","学校与家庭、学校与社会","G4"],[3,"G46","教育行政","G4"],[3,"G47","学校管理","G4"],[3,"G48","学校建筑和设备的管理","G4"],[3,"G51","世界教育事业","G4"],[3,"G52","中国教育事业","G4"],[3,"G53","亚洲教育事业","G4"],[3,"G54","非洲教育事业","G4"],[3,"G55","欧洲教育事业","G4"],[3,"G56","大洋洲及太平洋岛屿教育事业","G4"],[3,"G57","美洲教育事业","G4"],[3,"G61","学前教育、幼儿教育","G4"],[3,"G62","初等教育","G4"],[3,"G63","中等教育","G4"],[3,"G64","高等教育","G4"],[3,"G65","师范教育、教师教育","G4"],[3,"G71","职业技术教育","G4"],[3,"G72","成人教育、业余教育","G4"],[3,"G74","华侨教育、侨民教育","G4"],[3,"G75","少数民族教育","G4"],[3,"G76","特殊教育","G4"],[3,"G77","社会教育","G4"],[3,"G78","家庭教育","G4"],[3,"G79","自学","G4"],[2,"G8","体育","G"],[3,"G80","体育理论","G8"],[3,"G81","世界各国体育事业","G8"],[3,"G818","运动场地与设备","G8"],[3,"G819","体育运动技术（总论）","G8"],[3,"G82","田径运动","G8"],[3,"G83","体操运动","G8"],[3,"G84","球类运动","G8"],[3,"G85","武术及民族形式体育","G8"],[3,"G86","水上、冰上与雪上运动","G8"],[3,"G87","其他体育运动","G8"],[3,"G89","文娱性体育活动","G8"],[1,"H","语言、文字","__root__"],[2,"H0","语言学","H"],[3,"H0-0","语言理论与方法论","H0"],[3,"H002","语言规划","H0"],[3,"H003","语言的分类","H0"],[3,"H004","语言的分布","H0"],[3,"H01","语音学","H0"],[3,"H02","文字学","H0"],[3,"H03","语义学、语用学、词汇学、词义学","H0"],[3,"H04","语法学","H0"],[3,"H05","写作学、修辞学","H0"],[3,"H059","翻译学","H0"],[3,"H06","词典学","H0"],[3,"H07","方言学","H0"],[3,"H08","应用语言学","H0"],[3,"H09","语文教学","H0"],[2,"H1","汉语","H"],[3,"H1-0","汉语理论与方法论","H1"],[3,"H102","汉语的规范化、标准化、推广普通话","H1"],[3,"H109.2","古代汉语","H1"],[3,"H109.3","近代汉语","H1"],[3,"H109.4","现代汉语","H1"],[3,"H11","语音","H1"],[3,"H12","文字学","H1"],[3,"H13","语义、语用、词汇、词义（训诂学）","H1"],[3,"H14","语法","H1"],[3,"H15","写作、修辞","H1"],[3,"H159","翻译","H1"],[3,"H16","字书、字典、词典","H1"],[3,"H17","方言","H1"],[3,"H19","汉语教学","H1"],[2,"H2","中国少数民族语言","H"],[3,"H211","少数民族古语言","H2"],[3,"H212","蒙古语","H2"],[3,"H214","藏语","H2"],[3,"H215","维吾尔语","H2"],[3,"H216","苗语","H2"],[3,"H217","彝语","H2"],[3,"H218","壮语","H2"],[3,"H219","朝鲜语","H2"],[3,"H221","满语","H2"],[3,"H222","达斡尔语（达呼尔语）","H2"],[3,"H223","鄂温克语（索伦语）","H2"],[3,"H224","鄂伦春语","H2"],[3,"H225","赫哲语","H2"],[3,"H231","土族语","H2"],[3,"H232","撒拉语","H2"],[3,"H233","东乡语","H2"],[3,"H234","保安语","H2"],[3,"H235","裕固语（撒里维吾尔语）","H2"],[3,"H236","哈萨克语","H2"],[3,"H237","柯尔克孜语（吉尔吉斯语）","H2"],[3,"H238","乌孜别克语","H2"],[3,"H241","塔吉克语","H2"],[3,"H242","塔塔尔语","H2"],[3,"H243","锡伯语","H2"],[3,"H244","俄罗斯语","H2"],[3,"H249","基诺语","H2"],[3,"H251","瑶语（曼语）","H2"],[3,"H252","白语（民家语）","H2"],[3,"H253","傣语","H2"],[3,"H254","哈尼语","H2"],[3,"H255","佤语（本人语）","H2"],[3,"H256","傈僳语","H2"],[3,"H257","纳西语（么些语）","H2"],[3,"H258","拉祜语（保语）","H2"],[3,"H259","景颇语","H2"],[3,"H261","布朗语","H2"],[3,"H262","阿昌语","H2"],[3,"H263","怒语","H2"],[3,"H264","德昂语","H2"],[3,"H265","独龙语（俅语）","H2"],[3,"H266","普米语（西番语）","H2"],[3,"H267","门巴语","H2"],[3,"H268","布依语","H2"],[3,"H269","水语（水家语）","H2"],[3,"H271","仡佬语","H2"],[3,"H272","侗语","H2"],[3,"H273","土家语（毕基语）","H2"],[3,"H274","羌语","H2"],[3,"H275","仫佬语（莫语）","H2"],[3,"H276","毛南语","H2"],[3,"H281","黎语","H2"],[3,"H282","京语（越南语）","H2"],[3,"H284","高山语","H2"],[3,"H289","其他","H2"],[2,"H3","常用外国语","H"],[3,"H31","英语","H3"],[3,"H32","法语","H3"],[3,"H33","德语","H3"],[3,"H34","西班牙语","H3"],[3,"H35","俄语","H3"],[3,"H36","日语","H3"],[3,"H37","阿拉伯语","H3"],[2,"H4","汉藏语系","H"],[3,"H41","壮侗语族（侗傣语族）","H4"],[3,"H42","藏缅语族","H4"],[3,"H43","苗瑶语族","H4"],[3,"H44","越南语","H4"],[2,"H5","阿尔泰语系（突厥-蒙古-通古斯语系）","H"],[3,"H51","突厥语族","H5"],[3,"H53","蒙古语族","H5"],[3,"H54","通古斯-满语族","H5"],[3,"H55","朝鲜语","H5"],[2,"H61","南亚语系（澳斯特罗-亚细亚语系）","H"],[3,"H611","扪达语族","H61"],[3,"H612","孟语","H61"],[3,"H613","高棉语（柬埔寨国语）","H61"],[3,"H614","占语","H61"],[3,"[H616]","老挝语","H61"],[3,"[H617]","泰语（暹罗语）","H61"],[3,"[H618]","越南语","H61"],[3,"H619","其他语言","H61"],[2,"H62","南印语系（达罗毗荼语系、德拉维达语系）","H"],[3,"H621","泰卢固语","H62"],[3,"H622","泰米尔语","H62"],[3,"H623","马拉雅兰语","H62"],[3,"H624","卡那拉语","H62"],[3,"H625","库伊语","H62"],[3,"H626","贡德语","H62"],[3,"H627","布拉呼语","H62"],[3,"H628","图鲁语","H62"],[3,"H629","其他语言","H62"],[2,"H63","南岛语系（马来亚-玻里尼西亚语系）","H"],[3,"H631","印度尼西亚语族","H63"],[3,"H632","密克罗尼西亚语族","H63"],[3,"H633","美拉尼西亚语族","H63"],[3,"H634","玻里尼西亚语族","H63"],[3,"H635","巴布亚诸语言","H63"],[3,"H636","安达曼语","H63"],[2,"H64","东北亚诸语言","H"],[3,"H641","楚克奇语（罗拉维特兰语）","H64"],[3,"H642","内梅兰语（科里亚克语）","H64"],[3,"H643","伊杰耳缅语（堪察加语）","H64"],[3,"H644","开特语（叶尼塞-奥斯加克语）","H64"],[3,"H645","奥杜尔语（犹卡吉尔语）","H64"],[3,"H646","尼夫赫语（吉里雅克语）","H64"],[3,"H647","阿伊努语（虾夷语）","H64"],[3,"H648","琉球语","H64"],[2,"H65","高加索语系（伊比利亚-高加索语系）","H"],[3,"H651","卡尔特维里语族（伊比利亚语族）","H65"],[3,"H652","阿布哈兹-阿第盖语族","H65"],[3,"H653","巴茨比-基斯金语族","H65"],[3,"H654","列兹金语族","H65"],[3,"H655","达格斯坦语族","H65"],[3,"H659","巴斯克语","H65"],[2,"H66","乌拉尔语系（芬兰-乌戈尔语系）","H"],[3,"H661","芬兰语族","H66"],[3,"H662","乌拉尔语族（乌戈尔语族）","H66"],[2,"H67","闪-含语系（阿非罗-亚细亚语系）","H"],[3,"H671","闪语族","H67"],[3,"H672","柏柏尔语族","H67"],[3,"H673","埃及-科普特语族","H67"],[3,"H674","库希特语族","H67"],[3,"H675","乍得语族","H67"],[2,"H7","印欧语系","H"],[3,"H71","印度语族","H7"],[3,"H73","伊朗语族","H7"],[3,"H74","斯拉夫语族","H7"],[3,"H75","波罗的语族","H7"],[3,"H76","日耳曼语族","H7"],[3,"H77","罗马语族","H7"],[3,"H78","凯尔特语族","H7"],[3,"H791","希腊语族","H7"],[3,"H792","阿尔巴尼亚语族：阿尔巴尼亚语","H7"],[3,"H793","亚美尼亚语族：亚美尼亚语","H7"],[3,"H794","安纳托利亚语族","H7"],[3,"H795","吐火罗语族","H7"],[2,"H81","非洲诸语言","H"],[3,"H811","沙里-尼罗语系","H81"],[3,"H815","尼日尔-刚果语系","H81"],[3,"H824","布斯曼-霍登托（考伊散）语系","H81"],[2,"H83","美洲诸语言","H"],[3,"H831","那华特耳语、奎车语、卡克契阔耳语、曼姆语、犹卡特克语、刻克齐语、奥托米语、乍泼特克语、密希特克语、托托那克语（墨西哥、危地马拉境内语言）","H83"],[3,"H832","图皮-瓜拉尼语系（巴拉圭、巴西西南部）","H83"],[3,"H833","革拉耳语（巴西亚马逊河流域）","H83"],[3,"H834","奎出瓦语（秘鲁、厄瓜多尔、玻利维亚）","H83"],[3,"H835","埃马拉语（秘鲁、玻利维亚）","H83"],[3,"H836","那瓦荷语（美国西南部）","H83"],[3,"H839","爱斯基摩-阿留申语系（北美洲极北部）","H83"],[2,"H84","大洋洲诸语言","H"],[2,"H9","国际辅助语","H"],[3,"H91","世界语","H9"],[3,"H92","沃拉布克国际语","H9"],[3,"H93","阿克奇顿道尔国际语","H9"],[3,"H94","艾多国际语","H9"],[3,"H95","国际语","H9"],[1,"I","文学","__root__"],[2,"I0","文学理论","I"],[3,"I0-02","文学的哲学基础","I0"],[3,"I0-03","文学的方法论","I0"],[3,"I0-05","文学与其他科学的关系","I0"],[3,"I01","文艺美学","I0"],[3,"I02","文学理论的基本问题","I0"],[3,"I03","文艺工作者","I0"],[3,"I04","文学创作论","I0"],[3,"I05","各体文学理论和创作方法","I0"],[3,"I06","文学评论、文学欣赏","I0"],[2,"I1","世界文学","I"],[3,"I1-1","现状及发展","I1"],[3,"I1-2","机构、团体、会议","I1"],[3,"I106","作品评论和研究","I1"],[3,"I109","文学史、文学思想史","I1"],[3,"I11","作品集","I1"],[2,"I2","中国文学","I"],[3,"I2-1","现状及发展","I2"],[3,"I2-2","机构、团体、会议","I2"],[3,"I200","方针政策及其阐述","I2"],[3,"I206","文学评论和研究","I2"],[3,"I207","各体文学评论和研究","I2"],[3,"I209","文学史、文学思想史","I2"],[3,"I21","作品集","I2"],[3,"I22","诗歌、韵文","I2"],[3,"I23","戏剧文学","I2"],[3,"I239","曲艺","I2"],[3,"I24","小说","I2"],[3,"I25","报告文学","I2"],[3,"I26","散文","I2"],[3,"I269","杂著","I2"],[3,"I27","民间文学","I2"],[3,"I28","儿童文学","I2"],[3,"I29","少数民族文学","I2"],[3,"I299","宗教文学","I2"],[2,"I3","亚洲文学","I"],[3,"I31","东亚文学","I3"],[3,"I33","东南亚文学","I3"],[3,"I35","南亚文学","I3"],[3,"I36","中亚及外高加索地区文学","I3"],[3,"I37","西亚（西南亚）文学","I3"],[2,"I4","非洲文学","I"],[3,"I41","北非文学","I4"],[3,"I42","东非文学","I4"],[3,"I43","西非文学","I4"],[3,"I46","中非文学","I4"],[3,"I47","南非文学","I4"],[2,"I5","欧洲文学","I"],[3,"I51","东欧、中欧文学","I5"],[3,"I53","北欧文学","I5"],[3,"I54","南欧（东南欧、西南欧）文学","I5"],[3,"I56","西欧文学","I5"],[2,"I6","大洋洲及太平洋岛屿文学","I"],[3,"I61","澳、新、巴地区文学","I6"],[3,"I63","波利尼西亚文学","I6"],[3,"I65","密克罗尼西亚文学","I6"],[3,"I66","美拉尼西亚文学","I6"],[2,"I7","美洲文学","I"],[3,"I71","北美洲文学","I7"],[3,"I73","中美洲文学","I7"],[3,"I75","西印度群岛文学","I7"],[3,"I77","南美洲文学","I7"],[1,"J","艺术","__root__"],[2,"J0","艺术理论","J"],[3,"J0-02","艺术的哲学基础","J0"],[3,"J0-03","艺术的方法论","J0"],[3,"J0-05","艺术与其他科学的关系","J0"],[3,"J01","艺术美学","J0"],[3,"J02","艺术理论的基本问题","J0"],[3,"J03","艺术工作者","J0"],[3,"J04","艺术创作方法","J0"],[3,"J05","艺术评论、欣赏","J0"],[3,"J06","造型艺术理论","J0"],[3,"J08","艺术技法（总论）","J0"],[2,"J1","世界各国艺术概况","J"],[3,"J11","世界艺术","J1"],[3,"J12","中国艺术","J1"],[3,"J13","亚洲艺术","J1"],[3,"J14","非洲艺术","J1"],[3,"J15","欧洲艺术","J1"],[3,"J16","大洋洲及太平洋岛屿艺术","J1"],[3,"J17","美洲艺术","J1"],[3,"[J18]","美术考古","J1"],[3,"J19","专题艺术与现代边缘艺术","J1"],[2,"J2","绘画","J"],[3,"J2-3","绘画研究方法、工作方法","J2"],[3,"J20","绘画理论","J2"],[3,"J21","绘画技法","J2"],[3,"J22","中国绘画作品","J2"],[3,"J23","各国绘画作品","J2"],[2,"J29","书法、篆刻","J"],[3,"J292","中国书法、篆刻","J29"],[3,"J293","外文书法","J29"],[2,"J3","雕塑","J"],[3,"J30","雕塑理论","J3"],[3,"J31","雕塑技法","J3"],[3,"J32","中国雕塑作品","J3"],[3,"J33","各国雕塑作品","J3"],[2,"J4","摄影艺术","J"],[3,"J40","摄影艺术理论","J4"],[3,"J41","各种摄影艺术","J4"],[3,"J42","中国摄影艺术作品","J4"],[3,"J43","世界各国摄影艺术作品","J4"],[2,"J5","工艺美术","J"],[3,"J50","工艺美术理论","J5"],[3,"J51","图案设计","J5"],[3,"J52","中国工艺美术","J5"],[3,"J53","各国工艺美术","J5"],[2,"[J59]","建筑艺术","J"],[3,"[J590]","建筑艺术理论","[J59]"],[3,"[J595]","建筑艺术与其他艺术和科学的关系","[J59]"],[3,"[J596]","建筑风格、流派及作品评价","[J59]"],[3,"[J597]","建筑艺术作品的保护、修缮和仿造","[J59]"],[3,"[J598]","建筑艺术图集","[J59]"],[3,"[J599]","建筑艺术史","[J59]"],[2,"J6","音乐","J"],[3,"J60","音乐理论","J6"],[3,"J61","音乐技术理论与方法","J6"],[3,"J62","西洋器乐理论与演奏法","J6"],[3,"J63","民族器乐理论和演奏法","J6"],[3,"J639","其他","J6"],[3,"J64","中国音乐作品","J6"],[3,"J65","各国音乐作品","J6"],[3,"J69","音乐事业","J6"],[2,"J7","舞蹈","J"],[3,"J70","舞蹈理论","J7"],[3,"J71","舞蹈技术和方法","J7"],[3,"J72","中国舞蹈、舞剧","J7"],[3,"J73","各国舞蹈、舞剧","J7"],[3,"J79","舞蹈事业","J7"],[2,"J8","戏剧、曲艺、杂技艺术","J"],[3,"J80","戏剧艺术理论","J8"],[3,"J81","舞台艺术","J8"],[3,"J82","中国戏剧、曲艺、杂技艺术","J8"],[3,"J83","各国戏剧、杂技艺术","J8"],[3,"J89","戏剧、曲艺、杂技事业","J8"],[2,"J9","电影、电视艺术","J"],[3,"J90","电影、电视艺术理论","J9"],[3,"J91","电影、电视艺术与技术","J9"],[3,"J92","电影、电视分镜头脚本","J9"],[3,"J93","电影、电视拍摄艺术与技术","J9"],[3,"J94","电影、电视企业组织与管理","J9"],[3,"J95","各种电影、电视：按内容与样式分","J9"],[3,"J96","各种电影、电视：按表现形式和技术分","J9"],[3,"J97","各种电影、电视：按题材分","J9"],[3,"J98","幻灯","J9"],[3,"J99","电影、电视事业","J9"],[1,"K","历史、地理","__root__"],[2,"K0","史学理论","K"],[3,"K01","史学的哲学基础","K0"],[3,"K02","社会发展理论","K0"],[3,"K03","史学专论","K0"],[3,"K04","年代学","K0"],[3,"K05","史料学","K0"],[3,"K06","历史研究","K0"],[3,"K09","史学史","K0"],[2,"K1","世界史","K"],[3,"K10","通史","K1"],[3,"K11","上古史（公元前40世纪以前）","K1"],[3,"K12","古代史（公元前40世纪~公元476年）","K1"],[3,"K13","中世纪史（476~1640年）","K1"],[3,"K14","近代史（1640~1917年）","K1"],[3,"K15","现代史（1917年~）","K1"],[3,"K18","民族史志","K1"],[2,"K2","中国史","K"],[3,"K20","通史","K2"],[3,"K21","上古史（约170万年前~约公元前2070年）","K2"],[3,"K22","古代史早期（约公元前2070~公元前475年）","K2"],[3,"K23","古代史中期（公元前475~公元581年）","K2"],[3,"K24","古代史后期（581~1840年）","K2"],[3,"K25","近代史（1840~1919年）","K2"],[3,"K26","近代史（1919~1949年）","K2"],[3,"K27","中华人民共和国时期（1949年~）","K2"],[3,"K28","民族史志","K2"],[3,"K29","地方史志","K2"],[2,"K3","亚洲史","K"],[3,"K300","通史","K3"],[3,"K301","上古史","K3"],[3,"K302","古代史","K3"],[3,"K303","中世纪史","K3"],[3,"K304","近代史","K3"],[3,"K305","现代史","K3"],[3,"K308","民族史志","K3"],[3,"K31","东亚","K3"],[3,"K33","东南亚","K3"],[3,"K35","南亚","K3"],[3,"K36","中亚","K3"],[3,"K37","西亚（西南亚）","K3"],[2,"K4","非洲史","K"],[3,"K400","通史","K4"],[3,"K401","上古史","K4"],[3,"K402","古代史","K4"],[3,"K403","中世纪史","K4"],[3,"K404","近代史","K4"],[3,"K405","现代史","K4"],[3,"K408","民族史志","K4"],[3,"K41","北非","K4"],[3,"K42","东非","K4"],[3,"K43","西非","K4"],[3,"K46","中非","K4"],[3,"K47","南非","K4"],[2,"K5","欧洲史","K"],[3,"K500","通史","K5"],[3,"K501","上古史","K5"],[3,"K502","古代史","K5"],[3,"K503","中世纪史","K5"],[3,"K504","近代史","K5"],[3,"K505","现代史","K5"],[3,"K508","民族史志","K5"],[3,"K51","东欧、中欧","K5"],[3,"K53","北欧","K5"],[3,"K54","南欧（东南欧、西南欧）","K5"],[3,"K56","西欧","K5"],[2,"K6","大洋洲史","K"],[3,"K61","澳、新、巴地区","K6"],[2,"K7","美洲史","K"],[3,"K700","通史","K7"],[3,"K702","古代史（~1492年）","K7"],[3,"K703","殖民地时期（1492~1774年）","K7"],[3,"K704","美国独立战争至第二次世界大战时期（1775~1945年）","K7"],[3,"K705","第二次世界大战以后（1945年~）","K7"],[3,"K708","民族史志","K7"],[3,"K71","北美洲","K7"],[3,"K73","拉丁美洲","K7"],[3,"K75","西印度群岛","K7"],[3,"K77","南美洲","K7"],[2,"K81","传记","K"],[3,"K810","传记研究与编写","K81"],[3,"K811","世界人物传记","K81"],[3,"K82","中国人物传记","K81"],[3,"K833","亚洲人物传记","K81"],[3,"K834","非洲人物传记","K81"],[3,"K835","欧洲人物传记","K81"],[3,"K836","大洋洲及太平洋岛屿人物传记","K81"],[3,"K837","美洲人物传记","K81"],[2,"K85","文物考古","K"],[3,"[K852]","古文献学","K85"],[3,"K853","纹章学","K85"],[3,"K854","考古方法","K85"],[3,"K86","世界文物考古","K85"],[3,"K87","中国文物考古","K85"],[3,"K883","亚洲文物考古","K85"],[3,"K884","非洲文物考古","K85"],[3,"K885","欧洲文物考古","K85"],[3,"K886","大洋洲及太平洋岛屿文物考古","K85"],[3,"K887","美洲文物考古","K85"],[2,"K89","风俗习惯","K"],[3,"K890","民俗学","K89"],[3,"K891","世界风俗习惯","K89"],[3,"K892","中国风俗习惯","K89"],[3,"K893","亚洲风俗习惯","K89"],[3,"K894","非洲风俗习惯","K89"],[3,"K895","欧洲风俗习惯","K89"],[3,"K896","大洋洲及太平洋岛屿风俗习惯","K89"],[3,"K897","美洲风俗习惯","K89"],[2,"K9","地理","K"],[3,"K90","地理学","K9"],[3,"K91","世界地理","K9"],[3,"K92","中国地理","K9"],[3,"K93","亚洲地理","K9"],[3,"K94","非洲地理","K9"],[3,"K95","欧洲地理","K9"],[3,"K96","大洋洲及太平洋岛屿地理","K9"],[3,"K97","美洲地理","K9"],[3,"K99","地图","K9"],[1,"N","自然科学总论","__root__"],[2,"N0","自然科学理论与方法论","N"],[3,"N01","科学研究的方针、政策及其阐述","N0"],[3,"[N019]","法令、法规及其阐述","N0"],[3,"N02","科学的哲学原理","N0"],[3,"N03","科学的方法论","N0"],[3,"N04","术语规范及交流","N0"],[3,"N05","自然科学与其他学科的关系","N0"],[3,"N06","学派与学说及其评论研究","N0"],[3,"N07","不明的自然现象与事物","N0"],[3,"{N08}","自然科学研究中的资产阶级理论及其评论研究","N0"],[3,"N09","自然科学史","N0"],[2,"N1","自然科学概况、现状、进展","N"],[3,"N11","世界自然科学概况、现状、进展","N1"],[3,"N12","中国自然科学概况、现状、进展","N1"],[3,"N13","亚洲自然科学概况、现状、进展","N1"],[3,"N14","非洲自然科学概况、现状、进展","N1"],[3,"N15","欧洲自然科学概况、现状、进展","N1"],[3,"N16","大洋洲及太平洋岛屿自然科学概况、现状、进展","N1"],[3,"N17","美洲自然科学概况、现状、进展","N1"],[3,"N18","专利","N1"],[3,"N19","创造发明、先进经验","N1"],[2,"N2","自然科学机构、团体、会议","N"],[3,"N20","国际组织","N2"],[3,"N23","社会团体","N2"],[3,"N24","研究机构","N2"],[3,"N26","学术团体、学会、协会","N2"],[3,"N27","学术会议、专业会议","N2"],[3,"N28","展览会、展览馆、博物馆","N2"],[3,"N289","图书馆、信息服务机构、咨询机构","N2"],[3,"N29","企业、生产单位","N2"],[2,"N3","自然科学研究方法","N"],[3,"N31","调查方法、工作方法","N3"],[3,"N32","统计方法、计算方法","N3"],[3,"N33","实验方法与实验设备","N3"],[3,"N34","分析研究、测试与鉴定","N3"],[3,"N35","技术条件","N3"],[3,"N36","组织方法、管理方法","N3"],[3,"N37","数据处理","N3"],[3,"N39","信息化建设、新技术的应用","N3"],[2,"N4","自然科学教育与普及","N"],[3,"N40","教育组织、学校","N4"],[3,"N41","教学计划、教学大纲、课程研究","N4"],[3,"N42","教学法、教学参考书","N4"],[3,"N43","教材、课本","N4"],[3,"N44","习题、试题与题解","N4"],[3,"N45","教学实验、实习、实践","N4"],[3,"N46","教学设备","N4"],[3,"N47","考核、评估、奖励","N4"],[3,"N49","普及读物","N4"],[2,"N5","自然科学丛书、文集、连续性出版物","N"],[3,"N51","丛书（汇刻书）、文库","N5"],[3,"N52","全集、选集","N5"],[3,"N53","论文集","N5"],[3,"N54","年鉴、年刊","N5"],[3,"N55","连续性出版物","N5"],[3,"N56","政府出版物、团体出版物","N5"],[2,"N6","自然科学参考工具书","N"],[3,"N61","名词术语、辞典、百科全书","N6"],[3,"N62","手册、名录、指南、一览表、年表","N6"],[3,"[N629]","年鉴","N6"],[3,"N63","产品目录、产品样本、产品说明书","N6"],[3,"N64","表解、图解、谱录、数据、公式、图册","N6"],[3,"N65","条例、规程、标准","N6"],[3,"N66","统计资料","N6"],[3,"N67","参考资料","N6"],[2,"[N7]","自然科学文献检索工具","N"],[2,"N79","非书资料、视听资料","N"],[3,"N791","缩微制品","N79"],[3,"N792","录音制品","N79"],[3,"N793","感光制品、录像制品","N79"],[3,"N794","机读资料","N79"],[3,"N795","网络资源","N79"],[2,"N8","自然科学调查、考察","N"],[3,"N81","世界自然科学调查、考察","N8"],[3,"N82","中国自然科学调查、考察","N8"],[3,"N83","亚洲自然科学调查、考察","N8"],[3,"N84","非洲自然科学调查、考察","N8"],[3,"N85","欧洲自然科学调查、考察","N8"],[3,"N86","大洋洲及太平洋岛屿自然科学调查、考察","N8"],[3,"N87","美洲自然科学调查、考察","N8"],[2,"N91","自然研究、自然历史","N"],[3,"N911","世界自然研究、自然历史","N91"],[3,"N912","中国自然研究、自然历史","N91"],[3,"N913","亚洲自然研究、自然历史","N91"],[3,"N914","非洲自然研究、自然历史","N91"],[3,"N915","欧洲自然研究、自然历史","N91"],[3,"N916","大洋洲及太平洋岛屿自然研究、自然历史","N91"],[3,"N917","美洲自然研究、自然历史","N91"],[2,"N93","非线性科学","N"],[2,"N94","系统科学","N"],[3,"N94-0","系统科学理论与方法论","N94"],[3,"N941","系统学、现代系统理论","N94"],[3,"N945","系统工程","N94"],[3,"N949","系统科学在各方面的应用","N94"],[2,"[N99]","情报学、情报工作","N"],[1,"O","数理科学和化学","__root__"],[2,"O1","数学","O"],[3,"O1-0","数学理论","O1"],[3,"O1-6","数学参考工具书","O1"],[3,"O1-8","计算工具","O1"],[3,"O11","古典数学","O1"],[3,"O119","中国数学","O1"],[3,"O12","初等数学","O1"],[3,"O13","高等数学","O1"],[3,"O14","数理逻辑、数学基础","O1"],[3,"O15","代数、数论、组合理论","O1"],[3,"O17","数学分析","O1"],[3,"O18","几何、拓扑","O1"],[3,"O19","动力系统理论","O1"],[3,"O21","概率论与数理统计","O1"],[3,"O22","运筹学","O1"],[3,"O23","控制论、信息论（数学理论）","O1"],[3,"O24","计算数学","O1"],[3,"O29","应用数学","O1"],[2,"O3","力学","O"],[3,"O301","牛顿定律、达朗伯原理","O3"],[3,"O302","力学中的数学方法","O3"],[3,"O303","量纲分析与相似理论","O3"],[3,"O31","理论力学（一般力学）","O3"],[3,"O32","振动理论","O3"],[3,"O33","连续介质力学（变形体力学）","O3"],[3,"O34","固体力学","O3"],[3,"O35","流体力学","O3"],[3,"O37","流变学","O3"],[3,"O38","爆炸力学","O3"],[3,"O39","应用力学","O3"],[2,"O4","物理学","O"],[3,"O4-0","物理学理论","O4"],[3,"O4-1","物理学现状与发展","O4"],[3,"O4-3","物理学研究方法","O4"],[3,"O41","理论物理学","O4"],[3,"O42","声学","O4"],[3,"O43","光学","O4"],[3,"O44","电磁学、电动力学","O4"],[3,"O45","无线电物理学","O4"],[3,"O46","真空电子学（电子物理学）","O4"],[3,"O469","凝聚态物理学","O4"],[3,"O47","半导体物理学","O4"],[3,"O48","固体物理学","O4"],[3,"O51","低温物理学","O4"],[3,"O52","高压与高温物理学","O4"],[3,"O53","等离子体物理学","O4"],[3,"O55","热学与物质分子运动论","O4"],[3,"O56","分子物理学、原子物理学","O4"],[3,"O57","原子核物理学、高能物理学","O4"],[3,"O59","应用物理学","O4"],[2,"O6","化学","O"],[3,"O6-0","化学原理和方法","O6"],[3,"O6-1","化学现状与发展","O6"],[3,"O6-3","化学实验（实验化学）","O6"],[3,"O6-6","化学参考工具书","O6"],[3,"O61","无机化学","O6"],[3,"O62","有机化学","O6"],[3,"O63","高分子化学（高聚物）","O6"],[3,"O64","物理化学（理论化学）、化学物理学","O6"],[3,"O65","分析化学","O6"],[3,"O69","应用化学","O6"],[2,"O7","晶体学","O"],[3,"O71","几何晶体学","O7"],[3,"O72","X射线晶体学","O7"],[3,"O73","晶体物理","O7"],[3,"O74","晶体化学","O7"],[3,"O75","非晶态和类晶态","O7"],[3,"O76","晶体结构","O7"],[3,"O77","晶体缺陷","O7"],[3,"O78","晶体生长","O7"],[3,"O79","晶体物理化学过程","O7"],[3,"O799","应用晶体学","O7"],[1,"P","天文学、地球科学","__root__"],[2,"P1","天文学","P"],[3,"P1-0","理论与方法论","P1"],[3,"P1-2","机构、团体、会议","P1"],[3,"P1-4","教育与普及","P1"],[3,"P11","天文观测设备与观测资料","P1"],[3,"P12","天体测量学","P1"],[3,"P13","天体力学（理论天文学）","P1"],[3,"P14","天体物理学","P1"],[3,"P148","天体化学","P1"],[3,"[P149]","天体生物学","P1"],[3,"P15","恒星天文学、星系天文学、宇宙学","P1"],[3,"P16","射电天文学（无线电天文学）","P1"],[3,"P17","空间天文学","P1"],[3,"P18","太阳系","P1"],[3,"P19","时间、历法","P1"],[2,"P2","测绘学","P"],[3,"P2-0","理论与方法","P2"],[3,"P20","一般性问题","P2"],[3,"P21","普通测量学、地形测量学","P2"],[3,"P22","大地测量学","P2"],[3,"P23","摄影测量学与测绘遥感","P2"],[3,"[P24]","测绘仪器","P2"],[3,"P25","专业测绘","P2"],[3,"P27","地籍学","P2"],[3,"P28","地图制图学（地图学）","P2"],[2,"P3","地球物理学","P"],[3,"P31","大地（岩石界）物理学（固体地球物理学）","P3"],[3,"P33","水文科学（水界物理学）","P3"],[3,"P35","空间物理","P3"],[2,"P4","大气科学（气象学）","P"],[3,"P40","一般理论与方法","P4"],[3,"P41","大气探测（气象观测）","P4"],[3,"P42","气象基本要素、大气现象","P4"],[3,"P43","动力气象学","P4"],[3,"P44","天气学","P4"],[3,"P45","天气预报","P4"],[3,"P46","气候学","P4"],[3,"[P47]","海洋气象学","P4"],[3,"P48","人工影响天气","P4"],[3,"P49","应用气象学","P4"],[2,"P5","地质学","P"],[3,"P51","动力地质学","P5"],[3,"[P52]","古生物学","P5"],[3,"P53","历史地质学、地层学","P5"],[3,"P54","构造地质学","P5"],[3,"P55","地质力学","P5"],[3,"P56","区域地质学","P5"],[3,"P57","矿物学","P5"],[3,"P58","岩石学","P5"],[3,"P59","地球化学","P5"],[3,"P61","矿床学","P5"],[3,"P62","地质、矿产普查与勘探","P5"],[3,"P64","水文地质学与工程地质学","P5"],[3,"[P65]","地震地质学","P5"],[3,"[P66]","环境地质学","P5"],[3,"[P67]","海洋地质学","P5"],[3,"P68","宇宙地质学","P5"],[3,"P691","行星地质学","P5"],[3,"P694","灾害地质学","P5"],[2,"P7","海洋学","P"],[3,"P71","海洋调查与观测","P7"],[3,"P72","区域海洋学","P7"],[3,"P73","海洋基础科学","P7"],[3,"P74","海洋资源与开发","P7"],[3,"P75","海洋工程","P7"],[3,"[P76]","海洋环境科学","P7"],[3,"[P77]","潜水医学","P7"],[3,"[P79]","军事海洋学","P7"],[2,"P9","自然地理学","P"],[3,"P90","一般理论与方法","P9"],[3,"P91","数理地理学","P9"],[3,"[P92]","古地理学","P9"],[3,"P93","部门自然地理学","P9"],[3,"P94","区域自然地理学","P9"],[3,"[P951]","环境地理学","P9"],[3,"[P954]","灾害地理学","P9"],[3,"P96","自然资源学","P9"],[3,"[P97]","地理探险与发现","P9"],[3,"P98","自然地理图","P9"],[1,"Q","生物科学","__root__"],[2,"Q-0","生物科学的理论与方法","Q"],[3,"Q-03","定量生物学","Q-0"],[3,"Q-06","生物学说","Q-0"],[2,"Q-1","生物科学现状与发展","Q"],[3,"Q-11","世界生物科学现状与发展","Q-1"],[3,"Q-12","中国生物科学现状与发展","Q-1"],[3,"Q-13","亚洲生物科学现状与发展","Q-1"],[3,"Q-14","非洲生物科学现状与发展","Q-1"],[3,"Q-15","欧洲生物科学现状与发展","Q-1"],[3,"Q-16","大洋洲及太平洋岛屿生物科学现状与发展","Q-1"],[3,"Q-17","美洲生物科学现状与发展","Q-1"],[3,"Q-18","专利","Q-1"],[3,"Q-19","创造发明、先进经验","Q-1"],[2,"Q-3","生物科学的研究方法、技术","Q"],[3,"Q-31","生物科学研究法","Q-3"],[3,"Q-33","生物学实验与生物学技术","Q-3"],[3,"Q-34","生物标本的采集和制备","Q-3"],[2,"Q-4","生物科学教育与普及","Q"],[3,"Q-45","生产实习","Q-4"],[3,"Q-49","生物学的科学普及读物","Q-4"],[2,"Q-9","生物资源调查","Q"],[3,"Q-91","世界生物资源调查","Q-9"],[3,"Q-92","中国生物资源调查","Q-9"],[3,"Q-93","亚洲生物资源调查","Q-9"],[3,"Q-94","非洲生物资源调查","Q-9"],[3,"Q-95","欧洲生物资源调查","Q-9"],[3,"Q-96","大洋洲及太平洋岛屿生物资源调查","Q-9"],[3,"Q-97","美洲生物科学资源调查","Q-9"],[2,"Q1","普通生物学","Q"],[3,"Q1-0","生命科学总论","Q1"],[3,"Q10","生命的起源","Q1"],[3,"Q11","生物演化与发展","Q1"],[3,"Q13","生物形态学","Q1"],[3,"Q14","生态学（生物生态学）","Q1"],[3,"Q15","生物分布与生物地理学","Q1"],[3,"Q16","保护生物学","Q1"],[3,"Q17","水生生物学","Q1"],[3,"Q18","寄生生物学","Q1"],[3,"Q19","生物分类学","Q1"],[2,"Q2","细胞生物学","Q"],[3,"Q2-0","细胞生物学理论与方法论","Q2"],[3,"Q2-3","细胞生物研究方法","Q2"],[3,"Q21","细胞的起源及演化","Q2"],[3,"[Q23]","细胞遗传学","Q2"],[3,"Q24","细胞形态学","Q2"],[3,"Q25","细胞生理学","Q2"],[3,"Q26","细胞生物化学","Q2"],[3,"Q27","细胞生物物理学","Q2"],[3,"[Q291]","细胞分子生物学","Q2"],[2,"Q3","遗传学","Q"],[3,"Q3-0","理论与方法论","Q3"],[3,"Q3-3","研究方法与实验遗传学","Q3"],[3,"Q31","遗传与变异","Q3"],[3,"Q32","杂交与杂种","Q3"],[3,"[Q33]","人工选择与自然选择","Q3"],[3,"Q34","遗传学分支学科","Q3"],[3,"[Q36]","微生物遗传学","Q3"],[3,"[Q37]","植物遗传学","Q3"],[3,"[Q38]","动物遗传学","Q3"],[3,"[Q39]","人类遗传学","Q3"],[2,"Q4","生理学","Q"],[3,"Q4-0","生理学理论与方法论","Q4"],[3,"Q4-3","生理学研究方法","Q4"],[3,"Q41","普通生理学","Q4"],[3,"Q42","神经生理学","Q4"],[3,"Q43","分析器生理学（感官生理学）","Q4"],[3,"Q44","运动器官生理学","Q4"],[3,"Q45","内分泌生理学","Q4"],[3,"Q46","循环生理学","Q4"],[3,"Q47","呼吸生理学","Q4"],[3,"Q48","消化生理学","Q4"],[3,"Q491","排泄生理学","Q4"],[3,"Q492","生殖生理学","Q4"],[3,"Q493","新陈代谢与营养","Q4"],[3,"Q494","特殊环境生理学、生态生理学","Q4"],[3,"Q495","比较生理学与进化生理学","Q4"],[2,"Q5","生物化学","Q"],[3,"Q5-3","生物化学研究法","Q5"],[3,"Q50","一般性问题","Q5"],[3,"Q51","蛋白质","Q5"],[3,"Q52","核酸","Q5"],[3,"Q53","糖（醣）","Q5"],[3,"Q54","脂类","Q5"],[3,"Q55","酶","Q5"],[3,"Q56","维生素","Q5"],[3,"Q57","激素","Q5"],[3,"Q58","生物体其他化学成分","Q5"],[3,"Q591","物质代谢及能量代谢","Q5"],[3,"Q592","体液化学","Q5"],[3,"Q593","器官生物化学","Q5"],[3,"Q594","比较生物化学","Q5"],[3,"Q599","应用生物化学","Q5"],[2,"Q6","生物物理学","Q"],[3,"Q6-3","生物物理学研究与实验","Q6"],[3,"Q61","理论生物物理学","Q6"],[3,"Q62","生物声学","Q6"],[3,"Q63","生物光学","Q6"],[3,"Q64","生物电磁学","Q6"],[3,"Q65","生物热学","Q6"],[3,"Q66","生物力学","Q6"],[3,"Q67","物理化学生物学","Q6"],[3,"Q68","物理因素对生物的作用","Q6"],[3,"Q691","辐射生物学（放射生物学）","Q6"],[3,"[Q692]","仿生学","Q6"],[3,"Q693","空间（宇宙）生物学","Q6"],[2,"Q7","分子生物学","Q"],[3,"Q71","生物大分子的结构和功能","Q7"],[3,"Q73","生物膜的结构和功能","Q7"],[3,"Q74","生物小分子的结构和功能","Q7"],[3,"Q75","分子遗传学","Q7"],[3,"Q77","生物能的转换","Q7"],[3,"Q78","基因工程（遗传工程）","Q7"],[2,"Q81","生物工程学（生物技术）","Q"],[3,"Q811","仿生学","Q81"],[3,"[Q812]","基因工程（遗传工程）","Q81"],[3,"Q813","细胞工程","Q81"],[3,"Q814","酶工程","Q81"],[3,"[Q815]","发酵工程（微生物工程）","Q81"],[3,"[Q816]","蛋白质工程","Q81"],[3,"Q819","生物工程应用","Q81"],[2,"[Q89]","环境生物学","Q"],[2,"Q91","古生物学","Q"],[3,"Q91-0","理论与方法论","Q91"],[3,"Q91-3","古生物学研究法","Q91"],[3,"Q911","普通古生物学","Q91"],[3,"Q913","微体古生物学","Q91"],[3,"Q914","古植物学","Q91"],[3,"Q915","古动物学","Q91"],[3,"Q919","应用古生物学","Q91"],[2,"Q93","微生物学","Q"],[3,"Q93-3","微生物研究与微生物实验","Q93"],[3,"Q931","微生物的演化（适应与变异）","Q93"],[3,"Q932","微生物细胞学","Q93"],[3,"Q933","微生物遗传学","Q93"],[3,"Q934","微生物形态学","Q93"],[3,"Q935","微生物生理学","Q93"],[3,"Q936","微生物生物化学","Q93"],[3,"Q937","微生物生物物理学","Q93"],[3,"Q938","微生物生态学和地区分布","Q93"],[3,"Q939","微生物分类学（系统微生物学）","Q93"],[3,"Q939.9","应用微生物学","Q93"],[2,"Q94","植物学","Q"],[3,"Q94-3","植物学研究和植物学实验","Q94"],[3,"Q941","植物演化与植物发展","Q94"],[3,"Q942","植物细胞学","Q94"],[3,"Q943","植物细胞遗传学","Q94"],[3,"Q944","植物形态学","Q94"],[3,"Q945","植物生理学","Q94"],[3,"[Q945.8]","植物病理学","Q94"],[3,"Q946","植物生物化学","Q94"],[3,"Q947","植物生物物理学","Q94"],[3,"Q948","植物生态学和植物地理学","Q94"],[3,"Q949","植物分类学（系统植物学）","Q94"],[3,"Q949.9","应用植物学（经济植物学）","Q94"],[2,"Q95","动物学","Q"],[3,"Q95-3","动物学的研究与实验","Q95"],[3,"Q951","动物演化与发展","Q95"],[3,"Q952","动物细胞学","Q95"],[3,"Q953","动物遗传学","Q95"],[3,"Q954","动物形态学","Q95"],[3,"[Q955]","动物生理学","Q95"],[3,"[Q956]","动物生物化学","Q95"],[3,"[Q957]","动物生物物理学","Q95"],[3,"Q958","动物生态学和动物地理学","Q95"],[3,"Q959","动物分类学（系统动物学）","Q95"],[3,"Q959.9","应用动物学（经济动物学）","Q95"],[2,"Q96","昆虫学","Q"],[3,"Q961","昆虫演化与发展","Q96"],[3,"Q962","昆虫细胞学","Q96"],[3,"Q963","昆虫遗传学","Q96"],[3,"Q964","昆虫形态学","Q96"],[3,"Q965","昆虫生理学","Q96"],[3,"Q965.8","昆虫病理学","Q96"],[3,"Q965.9","昆虫毒理学","Q96"],[3,"Q966","昆虫生物化学","Q96"],[3,"Q967","昆虫生物物理学","Q96"],[3,"Q968","昆虫生态学和昆虫地理学","Q96"],[3,"Q969","昆虫分类学","Q96"],[3,"Q969.9","应用昆虫学（经济昆虫学）","Q96"],[2,"Q98","人类学","Q"],[3,"Q98-0","人类学理论与方法论","Q98"],[3,"Q981","古人类学","Q98"],[3,"Q982","人种学","Q98"],[3,"Q983","体质人类学","Q98"],[3,"Q984","人体测量学","Q98"],[3,"[Q985]","人体形态学","Q98"],[3,"Q986","分子人类学","Q98"],[3,"Q987","人类遗传学","Q98"],[3,"Q988","人类生态学","Q98"],[3,"Q989","应用人类学","Q98"],[1,"R","医药、卫生","__root__"],[2,"R-0","一般理论","R"],[3,"R-01","方针、政策及其阐述","R-0"],[3,"R-02","医学哲学","R-0"],[3,"R-05","医学与其他学科的关系","R-0"],[3,"R-09","医学史","R-0"],[2,"R-1","现状与发展","R"],[3,"R-11","世界现状与发展","R-1"],[3,"R-12","中国现状与发展","R-1"],[3,"R-13","亚洲现状与发展","R-1"],[3,"R-14","非洲现状与发展","R-1"],[3,"R-15","欧洲现状与发展","R-1"],[3,"R-16","大洋洲及太平洋岛屿现状与发展","R-1"],[3,"R-17","美洲现状与发展","R-1"],[3,"R-18","专利","R-1"],[3,"R-19","创造发明、先进经验","R-1"],[2,"R-3","医学研究方法","R"],[3,"R-33","实验医学、医学实验","R-3"],[2,"R1","预防医学、卫生学","R"],[3,"R1-9","卫生经济学","R1"],[3,"R11","卫生基础科学","R1"],[3,"R12","环境医学、环境卫生","R1"],[3,"R13","职业卫生","R1"],[3,"R14","放射卫生","R1"],[3,"R149","战备卫生","R1"],[3,"R15","营养卫生、饮食卫生","R1"],[3,"R16","个人卫生","R1"],[3,"R169","生殖健康与卫生","R1"],[3,"R17","妇幼卫生","R1"],[3,"R179","儿童、少年卫生","R1"],[3,"R18","流行病学与防疫","R1"],[3,"R19","卫生事业管理（保健组织与事业）","R1"],[2,"R2","中国医学","R"],[3,"R2-0","中国医学理论","R2"],[3,"R2-4","中医学教育与普及","R2"],[3,"R2-5","中医学丛书、文集、连续出版物","R2"],[3,"R21","中医预防、卫生学","R2"],[3,"R22","中医基础理论","R2"],[3,"R24","中医临床学","R2"],[3,"R25","中医内科学","R2"],[3,"R26","中医外科学","R2"],[3,"R271","中医妇产科学","R2"],[3,"R272","中医儿科学","R2"],[3,"R273","中医肿瘤科学","R2"],[3,"R274","中医骨伤科学","R2"],[3,"R275","中医皮科学","R2"],[3,"R276","中医五官科学","R2"],[3,"R277","中医其他学科","R2"],[3,"R278","中医急症学","R2"],[3,"R28","中药学","R2"],[3,"R289","方剂学","R2"],[3,"R29","中国少数民族医学","R2"],[2,"R3","基础医学","R"],[3,"R31","医用一般科学","R3"],[3,"R32","人体形态学","R3"],[3,"R33","人体生理学","R3"],[3,"[R34]","人体生物化学","R3"],[3,"[R35]","人体生物物理学","R3"],[3,"R36","病理学","R3"],[3,"R37","医学微生物学（病原细菌学、病原微生物学）","R3"],[3,"R38","医学寄生虫学","R3"],[3,"R392","医学免疫学","R3"],[3,"R393","医学分子生物学","R3"],[3,"R394","医学遗传学","R3"],[3,"R395","医学心理学、病理心理学","R3"],[2,"R4","临床医学","R"],[3,"R41","临床诊疗问题","R4"],[3,"R44","诊断学","R4"],[3,"R45","治疗学","R4"],[3,"R47","护理学","R4"],[3,"R48","临终关怀学","R4"],[3,"R49","康复医学","R4"],[3,"R499","临床医学的其他分支学科","R4"],[2,"R5","内科学","R"],[3,"R51","传染病","R5"],[3,"R52","结核病","R5"],[3,"R53","寄生虫病","R5"],[3,"R535","人畜共患病","R5"],[3,"R54","心脏、血管（循环系）疾病","R5"],[3,"R55","血液及淋巴系疾病","R5"],[3,"R56","呼吸系及胸部疾病","R5"],[3,"R57","消化系及腹部疾病","R5"],[3,"R58","内分泌腺疾病及代谢病","R5"],[3,"R59","全身性疾病","R5"],[3,"R599","地方病学","R5"],[2,"R6","外科学","R"],[3,"R602","外科病理学、解剖学","R6"],[3,"R604","外科诊断学","R6"],[3,"R605","外科治疗学","R6"],[3,"R608","外科诊疗器械与用具","R6"],[3,"R61","外科手术学","R6"],[3,"R62","整形外科学（修复外科学）","R6"],[3,"R63","外科感染","R6"],[3,"R64","创伤外科学","R6"],[3,"R65","外科学各论","R6"],[3,"R68","骨科学（运动系疾病、矫形外科学）","R6"],[3,"R69","泌尿科学（泌尿生殖系疾病）","R6"],[2,"R71","妇产科学","R"],[3,"R711","妇科学","R71"],[3,"R713","妇科手术","R71"],[3,"R714","产科学","R71"],[3,"R715","临床优生学","R71"],[3,"R717","助产学","R71"],[3,"R719","产科手术","R71"],[2,"R72","儿科学","R"],[3,"R720.5","儿科治疗学","R72"],[3,"R722","新生儿、早产儿疾病","R72"],[3,"R723","婴儿的营养障碍","R72"],[3,"R725","小儿内科学","R72"],[3,"R726","小儿外科学","R72"],[3,"R729","小儿其他疾病","R72"],[2,"R73","肿瘤学","R"],[3,"R73-3","肿瘤学实验研究","R73"],[3,"R730","一般性问题","R73"],[3,"R732","心血管肿瘤","R73"],[3,"R733","造血器及淋巴系肿瘤","R73"],[3,"R734","呼吸系肿瘤","R73"],[3,"R735","消化系肿瘤","R73"],[3,"R736","内分泌腺肿瘤","R73"],[3,"R737","泌尿生殖器肿瘤","R73"],[3,"R738","运动系肿瘤","R73"],[3,"R739.4","神经系肿瘤","R73"],[3,"R739.5","皮肤肿瘤","R73"],[3,"R739.6","耳鼻咽喉肿瘤","R73"],[3,"R739.7","眼肿瘤","R73"],[3,"R739.8","口腔、颌面部肿瘤","R73"],[3,"R739.9","其他部位肿瘤","R73"],[2,"R74","神经病学与精神病学","R"],[3,"R741","神经病学","R74"],[3,"R749","精神病学","R74"],[2,"R75","皮肤病学与性病学","R"],[3,"R751","皮肤病学","R75"],[3,"R759","性病学","R75"],[2,"R76","耳鼻咽喉科学","R"],[3,"R762","耳鼻咽喉外科学","R76"],[3,"R763","耳鼻咽喉科真菌病","R76"],[3,"R764","耳科学、耳疾病","R76"],[3,"R765","鼻科学、鼻疾病","R76"],[3,"R766","咽科学、咽疾病","R76"],[3,"R767","喉科学、喉疾病","R76"],[3,"R768","气管与食管镜学","R76"],[2,"R77","眼科学","R"],[3,"R770.4","眼科诊断学","R77"],[3,"R771","眼的一般性疾病","R77"],[3,"R772","眼纤维膜疾病","R77"],[3,"R773","眼色素层（葡萄膜）疾病","R77"],[3,"R774","视网膜及视神经疾病","R77"],[3,"R775","眼压与青光眼","R77"],[3,"R776","晶状体与玻璃体疾病","R77"],[3,"R777","眼附属器官疾病","R77"],[3,"R778","眼屈光学","R77"],[3,"R779.1","眼损伤与异物","R77"],[3,"R779.6","眼外科手术","R77"],[3,"R779.7","小儿眼科学","R77"],[3,"R779.9","热带眼科学","R77"],[2,"R78","口腔科学","R"],[3,"R780.1","口腔疾病的预防与口腔卫生","R78"],[3,"R780.2","口腔病理学","R78"],[3,"R781","口腔内科学","R78"],[3,"R782","口腔颌面部外科学","R78"],[3,"R783","口腔矫形学、牙科美学","R78"],[3,"R787","老年口腔疾病","R78"],[3,"R788","儿童口腔疾病","R78"],[2,"R79","外国民族医学","R"],[3,"R793","亚洲各民族医学","R79"],[3,"R794","非洲各民族医学","R79"],[3,"R795","欧洲各民族医学","R79"],[3,"R796","大洋洲各民族医学","R79"],[3,"R797","美洲各民族医学","R79"],[2,"R8","特种医学","R"],[3,"R81","放射医学","R8"],[3,"R82","军事医学","R8"],[3,"R83","航海医学","R8"],[3,"R84","潜水医学","R8"],[3,"R85","航空航天医学","R8"],[3,"R87","运动医学","R8"],[3,"[R89]","法医学","R8"],[2,"R9","药学","R"],[3,"R9-39","计算机在药学中的应用","R9"],[3,"R91","药物基础科学","R9"],[3,"R917","药物分析","R9"],[3,"R918","药物设计","R9"],[3,"R92","药典、药方集（处方集）、药物鉴定","R9"],[3,"R93","生药学（天然药物学）","R9"],[3,"R94","药剂学","R9"],[3,"R95","药事组织","R9"],[3,"R96","药理学","R9"],[3,"R97","药品","R9"],[3,"R99","毒物学（毒理学）","R9"],[1,"S","农业科学","__root__"],[2,"S-0","一般性理论","S"],[3,"S-01","农业科学技术研究方针、政策及其阐述","S-0"],[3,"S-02","农业哲学","S-0"],[3,"S-03","农业科学技术研究方法","S-0"],[3,"S-05","农业科学与其他学科的关系","S-0"],[3,"S-09","农业史","S-0"],[2,"S-1","农业科学技术现状与发展","S"],[3,"S-11","世界农业科学技术现状与发展","S-1"],[3,"S-12","中国农业科学技术现状与发展","S-1"],[3,"S-13","亚洲农业科学技术现状与发展","S-1"],[3,"S-14","非洲农业科学技术现状与发展","S-1"],[3,"S-15","欧洲农业科学技术现状与发展","S-1"],[3,"S-16","大洋洲及太平洋岛屿农业科学技术现状与发展","S-1"],[3,"S-17","美洲农业科学技术现状与发展","S-1"],[3,"S-18","专利","S-1"],[3,"S-19","创造发明、先进经验","S-1"],[2,"S-3","农业科学技术研究、试验","S"],[3,"S-33","农业科学技术试验方法与设备","S-3"],[3,"S-35","农业推广学","S-3"],[3,"S-36","农业科研管理学","S-3"],[2,"[S-9]","农业经济","S"],[2,"S1","农业基础科学","S"],[3,"S11","农业数学","S1"],[3,"S12","农业物理学","S1"],[3,"S13","农业化学","S1"],[3,"S14","肥料学","S1"],[3,"S15","土壤学","S1"],[3,"S16","农业气象学","S1"],[3,"[S17]","农业地理学","S1"],[3,"S18","农业生物学","S1"],[3,"[S19]","农业生产环境保护","S1"],[2,"S2","农业工程","S"],[3,"S21","农业动力、农村能源","S2"],[3,"S22","农业机械及农具","S2"],[3,"S23","农业机械化","S2"],[3,"S24","农业电气化与自动化","S2"],[3,"S25","农业航空","S2"],[3,"S26","农业建筑与农业生物环境工程","S2"],[3,"S27","农田水利","S2"],[3,"S28","农田基本建设、农垦","S2"],[3,"S29","农业工程勘测、土地测量","S2"],[2,"S3","农学（农艺学）","S"],[3,"S3-3","农学的研究方法","S3"],[3,"S31","作物生物学原理、栽培技术与方法","S3"],[3,"S32","作物品种与种质资源（品种资源）","S3"],[3,"S33","作物遗传育种与良种繁育","S3"],[3,"S34","耕作学","S3"],[3,"S35","播种、栽植","S3"],[3,"S36","田间管理","S3"],[3,"S37","农产品收获、加工及贮藏","S3"],[3,"S38","农产品的综合利用","S3"],[3,"S39","农产副业技术","S3"],[2,"S4","植物保护","S"],[3,"S40","动植物检疫","S4"],[3,"S41","植物检疫","S4"],[3,"S42","气象灾害及其防御","S4"],[3,"S43","病虫害及其防治","S4"],[3,"S44","动物危害及其防治","S4"],[3,"S45","有害植物及其防除","S4"],[3,"S46","其他灾害及其防治","S4"],[3,"S47","各种防治方法","S4"],[3,"S48","农药防治（化学防治）","S4"],[3,"S49","植物保护机械","S4"],[2,"S5","农作物","S"],[3,"S5-3","研究方法","S5"],[3,"S50","一般性问题","S5"],[3,"S51","禾谷类作物","S5"],[3,"S52","豆类作物","S5"],[3,"S53","薯类作物","S5"],[3,"S54","饲料作物、牧草","S5"],[3,"S55","绿肥作物","S5"],[3,"S56","经济作物","S5"],[3,"S58","野生植物","S5"],[3,"S59","热带、亚热带作物","S5"],[2,"S6","园艺","S"],[3,"S6-0","园艺理论与研究方法","S6"],[3,"S6-3","园艺研究方法与工作方法","S6"],[3,"S60","一般性问题","S6"],[3,"S61","苗圃学","S6"],[3,"S62","设施园艺（保护地栽培）","S6"],[3,"S63","蔬菜园艺","S6"],[3,"S65","瓜果园艺","S6"],[3,"S66","果树园艺","S6"],[3,"S68","观赏园艺（花卉和观赏树木）","S6"],[2,"S7","林业","S"],[3,"S7-0","林业理论与方法论","S7"],[3,"[S7-9]","林业经济","S7"],[3,"S71","林业基础科学","S7"],[3,"S72","造林学、林木育种及造林技术","S7"],[3,"S73","绿化建设","S7"],[3,"S75","森林经营学、森林计测学、森林经理学","S7"],[3,"S76","森林保护学","S7"],[3,"S77","森林工程、林业机械","S7"],[3,"S78","森林采运与利用","S7"],[3,"S79","森林树种","S7"],[2,"S8","畜牧、动物医学、狩猎、蚕、蜂","S"],[3,"S8-0","理论与方法论","S8"],[3,"S8-1","畜牧业现状与发展","S8"],[3,"[S8-9]","畜牧经济","S8"],[3,"S81","普通畜牧学","S8"],[3,"S82","家畜","S8"],[3,"S83","家禽","S8"],[3,"S85","动物医学（兽医学）","S8"],[3,"S86","狩猎、野生动物驯养","S8"],[3,"S87","畜禽产品的综合利用","S8"],[3,"S88","蚕、桑","S8"],[3,"S89","养蜂、益虫饲养","S8"],[2,"S9","水产、渔业","S"],[3,"S9-0","理论与方法论","S9"],[3,"[S9-9]","水产业、渔业经济","S9"],[3,"S91","水产基础科学","S9"],[3,"S92","水产地区分布、水产志","S9"],[3,"S93","水产资源","S9"],[3,"S94","水产保护学","S9"],[3,"S95","水产工程","S9"],[3,"S96","水产养殖技术","S9"],[3,"S97","水产捕捞","S9"],[3,"S98","水产物运输、保鲜、贮藏、加工、包装","S9"],[1,"T","工业技术","__root__"],[2,"T-0","工业技术理论","T"],[3,"T-01","方针、政策及其阐述","T-0"],[3,"T-09","工业技术发展史","T-0"],[2,"T-1","工业技术现状与发展","T"],[3,"T-11","世界工业技术现状与发展","T-1"],[3,"T-12","中国工业技术现状与发展","T-1"],[3,"T-13","亚洲工业技术现状与发展","T-1"],[3,"T-14","非洲工业技术现状与发展","T-1"],[3,"T-15","欧洲工业技术现状与发展","T-1"],[3,"T-16","大洋洲及太平洋岛屿工业技术现状与发展","T-1"],[3,"T-17","美洲工业技术现状与发展","T-1"],[3,"T-18","专利","T-1"],[3,"T-19","先进经验、创造发明","T-1"],[2,"T-2","机构、团体、会议","T"],[3,"T-20","国际组织","T-2"],[3,"T-23","社会团体","T-2"],[3,"T-24","研究机构","T-2"],[3,"T-26","学术团体、学会、协会","T-2"],[3,"T-27","学术会议、专业会议","T-2"],[3,"T-28","展览会、展览馆、博物馆","T-2"],[3,"T-289","图书馆、信息服务机构、咨询机构","T-2"],[3,"T-29","工程技术人员","T-2"],[2,"T-6","参考工具书","T"],[3,"T-62","工程师手册、技术手册","T-6"],[3,"T-63","产品目录、样本","T-6"],[3,"T-65","工业规程与标准","T-6"],[2,"[T-9]","工业经济","T"],[2,"TB","一般工业技术","T"],[3,"TB1","工程基础科学","TB"],[4,"TB11","工程数学","TB1"],[4,"TB12","工程力学","TB1"],[4,"TB13","工程物理学","TB1"],[4,"[TB14]","工程化学","TB1"],[4,"TB15","工程天文学","TB1"],[4,"[TB16]","工程地质学","TB1"],[4,"TB17","工程仿生学","TB1"],[4,"TB18","人体工程学","TB1"],[3,"TB2","工程设计与测绘","TB"],[4,"TB21","工程设计","TB2"],[4,"TB22","工程测量","TB2"],[4,"TB23","工程制图","TB2"],[4,"TB24","工程模拟","TB2"],[3,"TB3","工程材料学","TB"],[4,"TB30","工程材料一般性问题","TB3"],[4,"[TB31]","金属材料","TB3"],[4,"TB32","非金属材料","TB3"],[4,"TB33","复合材料","TB3"],[4,"TB34","功能材料","TB3"],[4,"TB35","耐高温材料、耐低温材料","TB3"],[4,"TB36","耐磨材料","TB3"],[4,"TB37","耐腐蚀材料","TB3"],[4,"TB381","智能材料","TB3"],[4,"TB383","特种结构材料","TB3"],[4,"TB39","其他材料","TB3"],[3,"TB4","工业通用技术与设备","TB"],[4,"TB41","爆破技术","TB4"],[4,"TB42","密封技术","TB4"],[4,"TB43","薄膜技术","TB4"],[4,"TB44","粉末技术","TB4"],[4,"TB45","防潮技术、干燥技术技术","TB4"],[4,"TB47","工业设计","TB4"],[4,"TB48","包装工程","TB4"],[4,"TB49","工厂、车间","TB4"],[3,"TB5","声学工程","TB"],[4,"TB51","声学仪器","TB5"],[4,"TB52","声学测量","TB5"],[4,"TB53","振动、噪声及其控制","TB5"],[4,"TB54","电声工程","TB5"],[4,"TB55","超声工程","TB5"],[4,"TB56","水声工程","TB5"],[4,"TB57","光声工程","TB5"],[3,"TB6","制冷工程","TB"],[4,"TB61","制冷理论","TB6"],[4,"TB64","制冷材料","TB6"],[4,"TB65","制冷机械和设备","TB6"],[4,"TB66","制冷技术","TB6"],[4,"TB69","制冷应用","TB6"],[3,"TB7","真空技术","TB"],[4,"TB71","真空技术基础理论","TB7"],[4,"TB74","真空材料","TB7"],[4,"TB75","真空获得技术及设备","TB7"],[4,"TB77","真空测试及仪器","TB7"],[4,"TB79","真空技术的应用","TB7"],[3,"TB8","摄影技术","TB"],[4,"TB81","摄影理论","TB8"],[4,"TB82","拍摄技术","TB8"],[4,"TB84","感光材料","TB8"],[4,"TB85","摄影机具与设备","TB8"],[4,"TB86","各种摄影技术","TB8"],[4,"TB88","洗印技术","TB8"],[4,"TB89","摄影技术的应用","TB8"],[3,"TB9","计量学","TB"],[4,"TB91","计量单位与单位制","TB9"],[4,"TB92","几何量计量","TB9"],[4,"TB93","力学计量","TB9"],[4,"TB94","热学计量","TB9"],[4,"TB95","声学计量","TB9"],[4,"TB96","光学计量","TB9"],[4,"TB97","电磁学与无线电计量","TB9"],[4,"TB98","电离辐射和放射性计量","TB9"],[4,"TB99","物理化学计量","TB9"],[2,"TD","矿业工程","T"],[3,"TD-0","矿业工程理论与方法论","TD"],[4,"TD-05","矿业工程与其他学科的关系","TD-0"],[3,"[TD-9]","矿山经济","TD"],[3,"TD1","矿山地质与测量","TD"],[4,"[TD11]","矿床学","TD1"],[4,"[TD12]","水文地质学与工程地质学","TD1"],[4,"[TD15]","普查与勘探","TD1"],[4,"TD163","矿井地质","TD1"],[4,"TD164","露天矿地质","TD1"],[4,"TD166","生产地质勘探","TD1"],[4,"TD167","矿山环境地质","TD1"],[4,"TD17","矿山测量与制图","TD1"],[3,"TD2","矿山设计与建设","TD"],[4,"TD21","矿山设计","TD2"],[4,"TD22","矿山地面建设","TD2"],[4,"TD23","凿岩爆破工程","TD2"],[4,"TD26","井巷工程","TD2"],[3,"TD3","矿山压力与支护","TD"],[4,"TD31","矿山压力理论","TD3"],[4,"TD32","矿山压力与岩层移动","TD3"],[4,"TD35","矿井支护与设备","TD3"],[3,"TD4","矿山机械","TD"],[4,"TD40","一般性问题","TD4"],[4,"[TD41]","勘探机械、钻孔机","TD4"],[4,"TD42","采掘机械","TD4"],[4,"TD43","水力采矿机械化设备","TD4"],[4,"TD44","矿山固定机械设备","TD4"],[4,"TD45","选矿机械","TD4"],[3,"TD5","矿山运输与设备","TD"],[4,"TD50","一般性问题","TD5"],[4,"TD52","井下运输与设备","TD5"],[4,"TD53","矿井提升","TD5"],[4,"TD54","井口设备","TD5"],[4,"TD55","斜井运输","TD5"],[4,"TD56","地面运输","TD5"],[4,"TD57","露天矿运输","TD5"],[4,"TD58","矿外运输","TD5"],[3,"TD6","矿山电工","TD"],[4,"TD60","一般性问题","TD6"],[4,"TD61","矿山输电与配电","TD6"],[4,"TD62","矿山电气照明及设备","TD6"],[4,"TD63","矿山机械的电力装备与自动化","TD6"],[4,"TD64","矿山电机车的电力装备","TD6"],[4,"TD65","矿山信号与通信","TD6"],[4,"TD67","矿山生产自动化技术","TD6"],[4,"TD68","矿山电气安全设备","TD6"],[3,"TD7","矿山安全与劳动保护","TD"],[4,"TD71","矿井大气","TD7"],[4,"TD72","矿井通风","TD7"],[4,"[TD73]","岩石沉陷及安全措施","TD7"],[4,"TD74","矿山排水与堵水","TD7"],[4,"TD75","矿山防火","TD7"],[4,"TD76","矿山安全监测系统","TD7"],[4,"TD77","矿山事故及救护","TD7"],[4,"TD78","矿山卫生","TD7"],[4,"TD79","劳动安全","TD7"],[3,"TD8","矿山开采","TD"],[4,"TD80","一般性问题","TD8"],[4,"TD82","煤矿开采","TD8"],[4,"TD83","油页岩开采","TD8"],[4,"TD84","煤及油页岩地下气化","TD8"],[4,"TD85","金属矿开采","TD8"],[4,"TD87","非金属矿开采","TD8"],[4,"TD88","矿区复田","TD8"],[3,"TD9","选矿","TD"],[4,"TD91","选矿理论","TD9"],[4,"TD92","选矿流程与方法","TD9"],[4,"TD94","选煤","TD9"],[4,"TD95","金属矿选矿","TD9"],[4,"TD97","非金属矿选矿","TD9"],[4,"TD98","矿产资源的综合利用","TD9"],[4,"TD981","黑色金属矿产","TD9"],[4,"TD982","有色及贵重金属矿产","TD9"],[4,"TD983","稀有、分散、放射矿产","TD9"],[4,"TD984","燃料矿产","TD9"],[4,"TD985","非金属矿产","TD9"],[4,"TD989","其他","TD9"],[2,"TE","石油、天然气工业","T"],[3,"[TE-9]","石油、天然气工业","TE"],[3,"TE0","能源与节能","TE"],[4,"TE01","能源计算","TE0"],[4,"TE02","能源调查","TE0"],[4,"TE08","节能","TE0"],[4,"TE09","能源综合利用","TE0"],[3,"TE1","石油、天然气地质与勘探","TE"],[4,"TE11","油气田勘探组织与管理","TE1"],[4,"[TE12]","石油、天然气地质","TE1"],[4,"[TE13]","石油、天然气调查与勘探","TE1"],[4,"TE14","油矿地质","TE1"],[4,"TE15","油气田测量和储量计算","TE1"],[4,"TE17","油气田区域分布","TE1"],[4,"TE19","新技术在石油、天然气地质与勘探中的应用","TE1"],[3,"TE2","钻井工程","TE"],[4,"TE21","钻井理论","TE2"],[4,"TE22","钻井设计","TE2"],[4,"TE24","钻井工艺","TE2"],[4,"TE25","洗井、固井、完井、油层损害与预防","TE2"],[4,"TE26","井身质量及固井质量检查","TE2"],[4,"TE27","中途测试及试油","TE2"],[4,"TE28","钻井安全生产与复杂情况处理","TE2"],[4,"[TE29]","钻井综合技术经济指标分析","TE2"],[3,"TE3","油气田开发与开采","TE"],[4,"TE31","基础理论","TE3"],[4,"TE32","油气田开发设计与计算","TE3"],[4,"TE33","油气田动态分析","TE3"],[4,"TE34","油田开发（油藏工程）","TE3"],[4,"TE35","采油工程","TE3"],[4,"TE37","气田开发与开采","TE3"],[4,"TE38","油气田开发和开采安全技术","TE3"],[4,"TE39","油田应用化学","TE3"],[3,"TE4","油气田建设工程","TE"],[4,"TE41","工厂设计、规划与布局","TE4"],[4,"TE42","设备与安装、施工","TE4"],[4,"TE43","力能供应","TE4"],[4,"TE44","供暖与照明设备","TE4"],[4,"TE45","给水、排水","TE4"],[4,"TE46","交通与通信","TE4"],[4,"TE48","生产技术安全与卫生","TE4"],[4,"TE49","其他","TE4"],[3,"TE5","海上油气田勘探与开发","TE"],[4,"[TE51]","海上油气田地质与勘探","TE5"],[4,"TE52","海上油气田钻井工程","TE5"],[4,"TE53","海上油气田开采技术","TE5"],[4,"TE54","海上油气田建设工程","TE5"],[4,"TE58","海上油气田勘探与开发安全技术","TE5"],[3,"TE6","石油、天然气加工工业","TE"],[4,"TE62","石油炼制","TE6"],[4,"TE64","天然气加工","TE6"],[4,"TE65","石油化学工业","TE6"],[4,"TE66","人造石油","TE6"],[4,"TE68","油气加工厂","TE6"],[3,"TE8","石油、天然气储存与运输","TE"],[4,"TE81","油气储运过程中油气性质及组分测定","TE8"],[4,"TE82","油气储存","TE8"],[4,"TE83","油气输送与运输","TE8"],[4,"TE85","油气储存损耗及预防措施","TE8"],[4,"TE86","矿场油气集输与处理","TE8"],[4,"TE88","油气储运安全技术","TE8"],[4,"TE89","其他","TE8"],[3,"TE9","石油机械设备与自动化","TE"],[4,"[TE91]","地质勘探机械设备","TE9"],[4,"TE92","钻井机械设备","TE9"],[4,"TE93","油气开采机械设备","TE9"],[4,"TE94","油气田工程建设机械设备","TE9"],[4,"TE95","海上油气田开发开采机械设备","TE9"],[4,"TE96","油气加工厂机械设备","TE9"],[4,"TE97","油气储运机械设备","TE9"],[4,"TE98","机械设备的腐蚀与防护","TE9"],[3,"[TE99]","石油、天然气工业环境保护与综合利用","TE"],[4,"[TE991]","石油、天然气工业环境污染与防治","[TE99]"],[4,"[TE992]","石油、天然气工业三废处理与综合利用","[TE99]"],[2,"TF","冶金工业","T"],[3,"[TF-9]","冶金工业经济","TF"],[3,"TF0","一般性问题","TF"],[4,"TF01","冶金原理","TF0"],[4,"TF02","冶炼计算","TF0"],[4,"TF03","冶炼试验与分析","TF0"],[4,"TF04","冶炼原料及矿石预处理","TF0"],[4,"TF05","冶金燃料与燃烧","TF0"],[4,"TF06","冶金炉","TF0"],[4,"TF08","冶金工厂","TF0"],[4,"[TF09]","冶金工业废物处理与综合利用","TF0"],[3,"TF1","冶金技术","TF"],[4,"TF11","提炼冶金（化学冶金）","TF1"],[4,"TF12","粉末冶金（金属陶瓷工艺）","TF1"],[4,"TF13","真空冶金","TF1"],[4,"TF14","电渣重熔","TF1"],[4,"TF15","原子能冶金","TF1"],[4,"TF16","纤维冶金","TF1"],[4,"TF17","卤素冶金","TF1"],[4,"TF18","微生物冶金","TF1"],[4,"TF19","其他冶金技术","TF1"],[3,"TF3","冶金机械、冶金生产自动化","TF"],[4,"TF30","一般性问题","TF3"],[4,"TF31","钢铁冶炼机械与生产自动化","TF3"],[4,"TF32","炼铁机械与生产自动化","TF3"],[4,"TF33","铁合金冶炼机械与生产自动化","TF3"],[4,"TF34","炼钢机械与生产自动化","TF3"],[4,"TF35","有色冶金机械与生产自动化","TF3"],[4,"TF37","粉末冶金机械与生产自动化","TF3"],[3,"TF4","钢铁冶炼（黑色金属冶炼）（总论）","TF"],[3,"TF5","炼铁","TF"],[4,"TF51","理论与计算","TF5"],[4,"TF52","原材料","TF5"],[4,"TF53","高炉熔冶过程","TF5"],[4,"TF54","高炉操作","TF5"],[4,"TF55","铁矿石直接还原","TF5"],[4,"TF56","其他炼铁法","TF5"],[4,"TF57","炼铁炉（高炉）","TF5"],[4,"TF58","炼铁厂","TF5"],[4,"TF59","炼铁产品","TF5"],[3,"TF6","铁合金冶炼","TF"],[4,"TF61","理论和计算","TF6"],[4,"TF62","原材料","TF6"],[4,"TF63","冶炼方法","TF6"],[4,"TF64","各种铁合金冶炼","TF6"],[3,"TF7","炼钢","TF"],[4,"TF70","一般性问题","TF7"],[4,"TF71","转炉炼钢","TF7"],[4,"TF72","氧气转炉炼钢","TF7"],[4,"TF73","平炉炼钢","TF7"],[4,"TF741","电炉炼钢","TF7"],[4,"TF742","混合炼钢","TF7"],[4,"[TF743]","真空炼钢","TF7"],[4,"[TF744]","钢的电渣重熔","TF7"],[4,"TF746","其他炼钢法","TF7"],[4,"TF747","早期炼钢法","TF7"],[4,"TF748","炼钢炉","TF7"],[4,"TF758","炼钢厂","TF7"],[4,"TF76","各种钢的冶炼","TF7"],[4,"TF769","钢液二次精炼和炉外处理","TF7"],[4,"TF77","铸锭","TF7"],[3,"TF79","其他黑色金属冶炼","TF"],[4,"TF791","炼铬","TF79"],[4,"TF792","炼锰","TF79"],[3,"TF8","有色金属冶炼","TF"],[4,"TF80","一般性问题","TF8"],[4,"TF81","重金属冶炼","TF8"],[4,"TF82","轻金属冶炼","TF8"],[4,"TF83","贵金属及铂族金属冶炼","TF8"],[4,"TF84","稀有金属冶炼","TF8"],[4,"[TF88]","放射性元素冶炼","TF8"],[4,"[TF89]","半导体元素冶炼","TF8"],[2,"TG","金属学与金属工艺","T"],[3,"TG1","金属学与热处理","TG"],[4,"TG11","金属学（物理冶金）","TG1"],[4,"TG13","合金学与各种性质合金","TG1"],[4,"TG14","金属材料","TG1"],[4,"TG15","热处理","TG1"],[4,"TG17","金属腐蚀与保护、金属表面处理","TG1"],[3,"TG2","铸造","TG"],[4,"TG21","铸造理论","TG2"],[4,"TG22","铸造原材料及配制","TG2"],[4,"TG23","铸造机械设备","TG2"],[4,"TG24","铸造工艺","TG2"],[4,"TG249","特种铸造","TG2"],[4,"TG25","铸铁件铸造","TG2"],[4,"TG26","钢件铸造","TG2"],[4,"TG27","合金铸造","TG2"],[4,"TG28","铸造车间（厂）","TG2"],[4,"TG29","有色金属铸造","TG2"],[3,"TG3","金属压力加工","TG"],[4,"TG30","一般性问题","TG3"],[4,"TG31","锻造、锻压与锻工","TG3"],[4,"TG33","轧制","TG3"],[4,"TG35","拉制、拉拔","TG3"],[4,"TG37","挤压","TG3"],[4,"TG38","冷冲压（钣金加工）","TG3"],[4,"TG39","高能成型","TG3"],[3,"TG4","焊接、金属切割及金属粘接","TG"],[4,"TG40","焊接基本问题","TG4"],[4,"TG42","焊接材料","TG4"],[4,"TG43","焊接设备","TG4"],[4,"TG44","焊接工艺","TG4"],[4,"TG47","焊接的应用","TG4"],[4,"TG48","金属切割及设备","TG4"],[4,"TG49","粘接、胶接","TG4"],[3,"TG5","金属切削加工及机床","TG"],[4,"TG50","一般性问题","TG5"],[4,"TG51","车削加工及车床（旋床）","TG5"],[4,"TG52","钻削加工及钻床","TG5"],[4,"TG53","镗削加工及镗床","TG5"],[4,"TG54","铣削加工及铣床","TG5"],[4,"TG55","刨削加工、刨床与插床（立刨）","TG5"],[4,"TG56","锯削加工与锯床、锉床","TG5"],[4,"TG57","拉削加工与拉床","TG5"],[4,"TG58","磨削加工与磨床","TG5"],[4,"TG61","齿轮加工及齿轮机床","TG5"],[4,"TG62","螺纹加工及螺纹加工机床","TG5"],[4,"TG63","刻线加工及刻线机","TG5"],[4,"TG64","仪表加工及仪表机床","TG5"],[4,"TG65","组合机床及其加工","TG5"],[4,"TG659","程序控制机床、数控机床及其加工","TG5"],[4,"TG66","特种加工机床及其加工","TG5"],[4,"TG68","机床加工生产自动化","TG5"],[3,"TG7","刀具、磨料、磨具、夹具、模具和手工具","TG"],[4,"TG70","一般性问题","TG7"],[4,"TG71","刀具","TG7"],[4,"TG73","磨料","TG7"],[4,"TG74","磨具、研具","TG7"],[4,"TG75","夹具","TG7"],[4,"TG76","模具","TG7"],[4,"[TG78]","手工具","TG7"],[3,"TG8","公差与技术测量及机械量仪","TG"],[4,"TG80","一般性问题","TG8"],[4,"TG81","长度测量及其量仪","TG8"],[4,"TG82","角度测量及其量仪","TG8"],[4,"TG83","形位偏差测量及其量仪","TG8"],[4,"TG84","表面光洁度（表面粗糙度）的测量及其量仪","TG8"],[4,"TG85","螺纹测量及其量仪","TG8"],[4,"TG86","齿轮测量及其量仪","TG8"],[4,"TG87","自动量仪","TG8"],[4,"[TG88]","光学量仪","TG8"],[3,"TG9","钳工工艺与装配工艺","TG"],[4,"TG91","基本理论","TG9"],[4,"TG93","钳工工作法及其装备","TG9"],[4,"TG95","机器装配、机器安装法","TG9"],[4,"TG96","包装技术与产品标识","TG9"],[2,"TH","机械、仪表工业","T"],[3,"TH-3","机械仪表工业研究方法、工作方法","TH"],[4,"TH-39","机电一体化","TH-3"],[3,"[TH-9]","机械、仪表工业经济","TH"],[3,"TH11","机械学（机械设计基础理论）","TH"],[4,"TH111","机械原理","TH11"],[4,"TH112","机构学","TH11"],[4,"TH113","机械动力学","TH11"],[4,"TH114","机械强度","TH11"],[4,"TH115","机械精确度","TH11"],[4,"TH117","机械摩擦、磨损与润滑","TH11"],[3,"TH12","机械设计、计算与制图","TH"],[4,"TH121","标准、规格","TH12"],[4,"TH122","机械设计","TH12"],[4,"TH123","机械计算","TH12"],[4,"[TH124]","机械公差、配合与技术测量","TH12"],[4,"TH126","机械制图","TH12"],[4,"TH128","机械模型","TH12"],[3,"TH13","机械零件及传动装置","TH"],[4,"TH131","联接及联接零件","TH13"],[4,"TH132","机械传动机构","TH13"],[4,"TH133","转动机件","TH13"],[4,"TH134","控制机件","TH13"],[4,"TH135","弹簧","TH13"],[4,"TH136","其他机械元件","TH13"],[4,"TH137","液压传动","TH13"],[4,"TH138","气压传动","TH13"],[4,"TH139","其他传动","TH13"],[3,"TH14","机械制造用材料","TH"],[4,"TH140","一般性问题","TH14"],[4,"TH142","金属材料","TH14"],[4,"TH145","非金属材料","TH14"],[3,"TH16","机械制造工艺","TH"],[4,"TH161","机械加工精度理论","TH16"],[4,"TH162","工艺设计","TH16"],[4,"TH163","成组工艺","TH16"],[4,"TH164","计算机辅助机械制造","TH16"],[4,"TH165","柔性制造系统及柔性制造单元","TH16"],[4,"TH166","计算机集成制造","TH16"],[3,"TH17","机械运行与维修","TH"],[3,"TH18","机械工厂（车间）","TH"],[4,"TH181","规划与设计","TH18"],[4,"TH182","设备安装","TH18"],[4,"TH183","力能供应","TH18"],[4,"TH184","空调与照明","TH18"],[4,"TH185","给水与排水","TH18"],[4,"TH186","生产技术管理","TH18"],[4,"TH187","贮运","TH18"],[4,"TH188","生产技术安全与卫生","TH18"],[3,"TH2","起重机械与运输机械","TH"],[4,"TH21","起重机械","TH2"],[4,"TH22","运输机械","TH2"],[4,"TH24","装卸机械","TH2"],[3,"TH3","泵","TH"],[4,"TH31","叶片式泵","TH3"],[4,"TH32","容积泵","TH3"],[4,"TH33","内燃泵","TH3"],[4,"TH34","水锤泵","TH3"],[4,"TH35","电磁泵（液体金属泵）","TH3"],[4,"[TH36]","真空泵","TH3"],[4,"TH38","各种用途泵","TH3"],[3,"TH4","气体压缩与输送机械","TH"],[4,"TH41","压缩空气工程","TH4"],[4,"[TH42]","风扇","TH4"],[4,"TH43","通风机","TH4"],[4,"TH44","鼓风机","TH4"],[4,"TH45","压缩机、压气机","TH4"],[4,"TH47","其他气动工具","TH4"],[4,"TH48","各种用途气体压缩输送机械","TH4"],[4,"TH49","压力容器","TH4"],[3,"TH6","专用机械与设备","TH"],[4,"TH69","其他专用机械与设备","TH6"],[3,"TH7","仪器、仪表","TH"],[4,"TH70","一般性问题","TH7"],[4,"TH71","计量仪器","TH7"],[4,"TH72","坐标器、计算机具、计数器","TH7"],[4,"TH73","物理学与力学一般仪器","TH7"],[4,"TH74","光学仪器","TH7"],[4,"TH75","天文仪器","TH7"],[4,"TH76","地球科学仪器","TH7"],[4,"TH77","医药卫生器械","TH7"],[4,"TH79","生物科学与农林科学仪器","TH7"],[4,"TH81","热工量的测量仪表","TH7"],[4,"TH82","力学量测量仪表","TH7"],[4,"TH83","成分分析仪器","TH7"],[4,"TH841","波谱仪","TH7"],[4,"TH842","能谱仪","TH7"],[4,"TH843","质谱仪","TH7"],[4,"TH85","显示仪表","TH7"],[4,"TH86","工业自动化仪表","TH7"],[4,"TH87","材料试验机与试验仪器","TH7"],[4,"TH89","其他仪器仪表","TH7"],[2,"TJ","武器工业","T"],[3,"[TJ-9]","武器工业经济","TJ"],[3,"TJ0","一般性问题","TJ"],[4,"TJ01","理论与试验","TJ0"],[4,"TJ02","设计、计算、制图","TJ0"],[4,"TJ03","结构","TJ0"],[4,"TJ04","材料","TJ0"],[4,"TJ05","制造工艺及设备","TJ0"],[4,"TJ06","测试技术及设施","TJ0"],[4,"[TJ07]","保养与维修","TJ0"],[4,"TJ08","工厂","TJ0"],[4,"TJ089","储运、销毁","TJ0"],[3,"TJ2","枪械","TJ"],[4,"TJ20","一般性问题","TJ2"],[4,"TJ21","手枪、转轮枪","TJ2"],[4,"TJ22","步枪、马枪","TJ2"],[4,"TJ23","冲锋枪","TJ2"],[4,"TJ24","轻、重机枪与两用机枪","TJ2"],[4,"TJ25","高射机枪、大口径机枪","TJ2"],[4,"TJ26","坦克机枪、舰用机枪、航空机枪","TJ2"],[4,"TJ27","特种用途与特殊性能枪","TJ2"],[4,"TJ279","其他枪械","TJ2"],[4,"TJ28","冷兵器","TJ2"],[4,"TJ29","榴弹发射器、枪榴弹发射器","TJ2"],[3,"TJ3","火炮","TJ"],[4,"TJ30","一般性问题","TJ3"],[4,"TJ31","迫击炮","TJ3"],[4,"TJ32","无座力炮","TJ3"],[4,"TJ33","榴弹炮","TJ3"],[4,"TJ34","加农炮","TJ3"],[4,"TJ35","高射炮、高射机关炮","TJ3"],[4,"TJ36","超级炮","TJ3"],[4,"TJ37","反坦克炮","TJ3"],[4,"TJ38","坦克炮","TJ3"],[4,"TJ391","舰炮","TJ3"],[4,"TJ392","航空炮","TJ3"],[4,"TJ393","火箭炮","TJ3"],[4,"TJ394","海岸炮","TJ3"],[4,"TJ395","铁道炮","TJ3"],[4,"TJ396","原子炮","TJ3"],[4,"TJ399","其他","TJ3"],[3,"TJ4","弹药、引信、火工品","TJ"],[4,"TJ41","弹药","TJ4"],[4,"TJ43","引信","TJ4"],[4,"TJ45","火工品","TJ4"],[3,"TJ5","爆破器材、烟火器材、火炸药、军用器材","TJ"],[4,"TJ51","爆破器材","TJ5"],[4,"TJ53","烟火器材","TJ5"],[4,"[TJ55]","火炸药","TJ5"],[4,"TJ56","军用侦察器材","TJ5"],[4,"TJ57","军用指挥仪器和设备","TJ5"],[4,"TJ58","军用训练器材","TJ5"],[4,"TJ589","警用器材","TJ5"],[4,"TJ59","其他军用器材","TJ5"],[3,"TJ6","水中兵器","TJ"],[4,"TJ61","水雷","TJ6"],[4,"TJ63","鱼雷及其发射装置","TJ6"],[4,"TJ65","深水炸弹及发射装置","TJ6"],[4,"TJ67","反潜武器","TJ6"],[3,"TJ7","火箭、导弹","TJ"],[4,"TJ71","火箭筒、火箭炮、火箭弹","TJ7"],[4,"TJ76","导弹","TJ7"],[3,"TJ8","战车、战舰、战机、航天武器","TJ"],[4,"TJ81","战车","TJ8"],[4,"[TJ83]","战舰","TJ8"],[4,"[TJ85]","战机","TJ8"],[4,"TJ86","航天武器（太空武器）","TJ8"],[3,"TJ9","核武器与其他特种武器及其防护设备","TJ"],[4,"TJ91","核武器及防护设备","TJ9"],[4,"TJ92","化学（毒物）武器及防护设备","TJ9"],[4,"TJ93","生物武器及防护设备","TJ9"],[4,"TJ95","激光武器及防护设备","TJ9"],[4,"TJ96","声学武器与防护设备","TJ9"],[4,"TJ97","等离子武器与防护设备","TJ9"],[4,"TJ99","其他特种武器与防护设备","TJ9"],[2,"TK","能源与动力工程","T"],[3,"[TK-9]","能源与动力工业经济","TK"],[3,"TK0","一般性问题","TK"],[4,"TK01","能源","TK0"],[4,"TK02","蓄能技术","TK0"],[4,"TK05","动力机械","TK0"],[4,"TK08","动力厂","TK0"],[4,"[TK09]","三废处理与综合利用","TK0"],[3,"TK1","热能、热力工程","TK"],[4,"TK11","热能","TK1"],[4,"TK12","热力工程理论","TK1"],[4,"TK14","气体透平（涡轮机）","TK1"],[4,"TK16","燃料与燃烧","TK1"],[4,"TK17","工业用热工设备","TK1"],[3,"TK2","蒸汽动力工程","TK"],[4,"TK21","蒸汽理论","TK2"],[4,"TK22","蒸汽锅炉","TK2"],[4,"TK24","蒸汽机","TK2"],[4,"TK26","蒸汽轮机（蒸汽透平、汽轮机）","TK2"],[4,"TK28","蒸汽动力工厂（车间）","TK2"],[3,"TK3","热工量测和热工自动控制","TK"],[4,"TK31","量测技术及仪表","TK3"],[4,"TK32","热工自动控制","TK3"],[4,"TK36","安装、调整","TK3"],[4,"TK37","运行","TK3"],[4,"TK38","检修、维护","TK3"],[4,"TK39","热工量测和热工自动控制的应用","TK3"],[3,"TK4","内燃机","TK"],[4,"TK40","一般性问题","TK4"],[4,"TK41","汽油机","TK4"],[4,"TK42","柴油机","TK4"],[4,"TK43","气体燃料内燃机","TK4"],[4,"TK44","复合式发动机","TK4"],[4,"TK45","旋转活塞式内燃机","TK4"],[4,"TK46","其他燃料的内燃机","TK4"],[4,"TK47","燃气轮机（燃气透平）","TK4"],[4,"[TK48]","喷气推进器","TK4"],[4,"[TK49]","火箭发动机","TK4"],[3,"TK5","特殊热能及其机械","TK"],[3,"TK51","太阳能及其应用","TK"],[4,"TK511","太阳能","TK51"],[4,"TK512","太阳能的收集与贮存","TK51"],[4,"TK513","太阳能转换装置和设备","TK51"],[4,"[TK514]","太阳能发电装置","TK51"],[4,"TK515","太阳能加热装置","TK51"],[4,"TK519","太阳能利用","TK51"],[3,"TK52","地下热能、地下热能机械","TK"],[4,"TK521","地下热能","TK52"],[4,"TK523","地下热能机械和设备","TK52"],[4,"TK529","地下热能利用","TK52"],[3,"TK6","生物能及其利用","TK"],[4,"TK61","生物质能","TK6"],[4,"TK62","生物质的燃烧与转化","TK6"],[4,"TK63","各种生物质燃料","TK6"],[4,"TK64","生物质能机械和设备","TK6"],[4,"[TK65]","生物质发电","TK6"],[4,"TK69","生物质能的利用","TK6"],[3,"TK7","水能、水力机械","TK"],[4,"TK71","水能","TK7"],[4,"TK72","水力机械理论","TK7"],[4,"TK73","水力原动机、水轮机","TK7"],[4,"TK79","水能的利用","TK7"],[3,"TK8","风能、风力机械","TK"],[4,"TK81","风能","TK8"],[4,"TK82","风能的贮存","TK8"],[4,"TK83","风力机械和设备","TK8"],[4,"TK89","风能的利用","TK8"],[3,"TK91","氢能及其利用","TK"],[4,"TK911","氢能","TK91"],[4,"TK912","氢能的存储、输送","TK91"],[4,"TK919","氢能利用","TK91"],[2,"TL","原子能技术","T"],[3,"[TL-9]","原子能技术经济","TL"],[3,"TL1","基础理论","TL"],[4,"[TL11]","原子能物理","TL1"],[4,"[TL12]","放射性化学","TL1"],[4,"[TL13]","辐射化学","TL1"],[3,"TL2","核燃料及其生产","TL"],[4,"TL21","铀燃料的生产","TL2"],[4,"TL22","钍燃料的生产","TL2"],[4,"TL24","乏燃料后处理","TL2"],[4,"TL25","铀同位素、稳定同位素的分离","TL2"],[4,"TL27","核燃料的分析","TL2"],[4,"TL28","核燃料生产用辅助物料及其分析","TL2"],[4,"TL291","热核燃料的生产","TL2"],[4,"TL292","热室及其设备","TL2"],[3,"TL3","核反应堆工程","TL"],[4,"TL31","反应堆基础理论","TL3"],[4,"TL32","反应堆物理及其设计、计算","TL3"],[4,"TL33","反应堆热工水力学及其设计、计算","TL3"],[4,"TL34","反应堆材料及其性能","TL3"],[4,"TL35","反应堆部件及其设计、制造","TL3"],[4,"TL36","反应堆安全与控制","TL3"],[4,"TL37","反应堆设计、建造、安装、实验与测量","TL3"],[4,"TL38","反应堆运行与维修","TL3"],[3,"TL4","各种核反应堆、核电厂","TL"],[4,"TL41","核反应堆：按用途分","TL4"],[4,"TL42","核反应堆：按冷却剂分","TL4"],[4,"TL43","核反应堆：按中子能谱分","TL4"],[4,"TL44","核反应堆：按燃料分","TL4"],[4,"TL45","核反应堆：按结构分","TL4"],[4,"TL46","裂变、聚变混合反应堆","TL4"],[4,"[TL48]","核电厂（核电站）","TL4"],[3,"TL5","加速器","TL"],[4,"TL50","一般性问题","TL5"],[4,"TL51","高压倍加器","TL5"],[4,"TL52","静电加速器、串列式静电加速器","TL5"],[4,"TL53","直线加速器","TL5"],[4,"TL54","圆形加速器（循环加速器）","TL5"],[4,"TL55","电子束聚变加速器","TL5"],[4,"TL56","重离子加速器","TL5"],[4,"TL57","粒子工厂","TL5"],[4,"TL58","粒子束聚变加速器","TL5"],[4,"TL593","交变梯度强聚焦加速器","TL5"],[4,"TL594","储存环（对头碰）","TL5"],[3,"TL6","受控热核反应（聚变反应理论及实验装置）","TL"],[4,"TL61","理论","TL6"],[4,"TL62","聚变工程技术","TL6"],[4,"TL63","热核装置","TL6"],[4,"TL64","热核反应堆（聚变堆）","TL6"],[4,"TL65","等离子体诊断（测量）","TL6"],[4,"TL67","实验技术与设备","TL6"],[4,"TL69","热核反应堆安全与环境","TL6"],[3,"TL7","辐射防护","TL"],[4,"[TL71]","防护理论","TL7"],[4,"[TL72]","辐射剂量学","TL7"],[4,"TL73","辐射事故","TL7"],[4,"TL75","核设施和铀矿山的辐射监测防护和卫生","TL7"],[4,"TL76","核试验的防护","TL7"],[4,"TL77","辐射源的防护","TL7"],[3,"TL8","粒子探测技术、辐射探测技术与核仪器仪表","TL"],[4,"TL81","辐射探测技术和仪器仪表","TL8"],[4,"TL82","核电子学仪器","TL8"],[4,"TL84","放射性计量学与计量技术","TL8"],[3,"TL91","核爆炸","TL"],[3,"TL92","放射性同位素的生产与制备","TL"],[4,"TL92+1","放射性同位素生产方式","TL92"],[4,"TL92+2","放射性同位素的分离提取","TL92"],[4,"TL92+3","标机化合物的制备","TL92"],[3,"TL929","辐射源","TL"],[3,"TL93","放射性物质的包装、运输和贮存","TL"],[4,"TL93+1","包装方法和设备","TL93"],[4,"TL93+2","运输方式和设备","TL93"],[4,"TL93+3","贮存","TL93"],[3,"TL94","放射性废物管理及综合利用","TL"],[4,"TL941","放射性废物及其处理","TL94"],[4,"TL942","放射性废物的处置","TL94"],[4,"TL943","核设施退役","TL94"],[4,"TL944","核设施和设备的去污","TL94"],[4,"[TL949]","放射性废物的综合利用","TL94"],[3,"TL99","原子能技术的应用","TL"],[2,"TM","电工技术","T"],[3,"[TM-9]","电工技术经济","TM"],[3,"TM0","一般性问题","TM"],[4,"TM02","电工设计、制图","TM0"],[4,"TM05","电工安装技术","TM0"],[4,"TM07","电工保养、维修","TM0"],[4,"TM08","电工安全","TM0"],[3,"TM1","电工基础理论","TM"],[4,"TM11","电工单位、电工计算","TM1"],[4,"[TM12]","电学、磁学","TM1"],[4,"TM13","电路理论","TM1"],[4,"TM14","磁路","TM1"],[4,"TM15","电磁场理论的应用","TM1"],[3,"TM2","电工材料","TM"],[4,"TM20","一般性问题","TM2"],[4,"TM21","绝缘材料、电介质及其制品","TM2"],[4,"TM22","强性介质和压电介质","TM2"],[4,"[TM23]","半导体材料","TM2"],[4,"TM24","导电材料及其制品","TM2"],[4,"TM25","微波吸收材料","TM2"],[4,"TM26","超导体、超导体材料","TM2"],[4,"TM27","磁性材料、铁氧体","TM2"],[4,"TM28","电工陶瓷材料","TM2"],[3,"TM3","电机","TM"],[4,"TM30","一般性问题","TM3"],[4,"TM31","发电机、大型发电机组（总论）","TM3"],[4,"TM32","电动机（总论）","TM3"],[4,"TM33","直流电机","TM3"],[4,"TM34","交流电机","TM3"],[4,"TM35","特殊电机","TM3"],[4,"TM36","无接点电机","TM3"],[4,"TM37","超导体电机","TM3"],[4,"TM38","微电机","TM3"],[3,"TM4","变压器、变流器及电抗器","TM"],[4,"TM40","一般性问题","TM4"],[4,"TM41","电力变压器","TM4"],[4,"TM42","变压器：按作用性能分","TM4"],[4,"TM43","变压器：按频率分","TM4"],[4,"TM44","稳定器","TM4"],[4,"TM45","互感器","TM4"],[4,"TM46","变流器","TM4"],[4,"TM47","电抗器","TM4"],[3,"TM5","电器","TM"],[4,"TM50","一般性问题","TM5"],[4,"TM51","高压电器（总论）","TM5"],[4,"TM52","低压电器（总论）","TM5"],[4,"TM53","电容器","TM5"],[4,"TM54","电阻器、电位器","TM5"],[4,"TM55","电感器、线圈、扼流圈","TM5"],[4,"TM56","开关电器、断路器","TM5"],[4,"TM57","控制器、接触器、起动器、电磁铁","TM5"],[4,"TM58","继电器","TM5"],[4,"TM59","成套电器","TM5"],[3,"TM6","发电、发电厂","TM"],[4,"TM60","电能学","TM6"],[4,"TM61","各种发电","TM6"],[4,"TM62","发电厂","TM6"],[4,"TM63","变电所","TM6"],[4,"TM64","配电设备和电气接线","TM6"],[3,"TM7","输配电工程、电力网及电力系统","TM"],[4,"TM71","理论与分析","TM7"],[4,"TM72","输配电技术","TM7"],[4,"TM73","电力系统的调度、管理、通信","TM7"],[4,"TM74","电力系统的模拟与计算","TM7"],[4,"TM75","线路及杆塔","TM7"],[4,"TM76","电力系统的自动化","TM7"],[4,"TM77","电力系统继电保护","TM7"],[3,"TM8","高电压技术","TM"],[4,"TM81","高压安全","TM8"],[4,"TM83","高电压试验设备及测量技术","TM8"],[4,"TM84","高电压带电操作技术","TM8"],[4,"TM85","高电压绝缘技术","TM8"],[4,"TM86","过电压及其防护","TM8"],[4,"TM89","高电压及大电流技术的应用","TM8"],[3,"TM91","独立电源技术（直接发电）","TM"],[4,"TM910","一般性问题","TM91"],[4,"TM911","化学电源、电池、燃料电池","TM91"],[4,"TM912","蓄电池","TM91"],[4,"TM913","温差电池、温差发电器","TM91"],[4,"TM914","光电池","TM91"],[4,"TM915","热离子、热电子换能器","TM91"],[4,"TM916","磁流体发电","TM91"],[4,"TM917","电流体发电、电气体发电、超导体发电","TM91"],[4,"TM918","核能换能器","TM91"],[4,"TM919","其他独立电源","TM91"],[3,"TM92","电气化、电能应用","TM"],[4,"TM921","电力拖动（电气传动）","TM92"],[4,"TM922","电力牵引","TM92"],[4,"TM923","电气照明","TM92"],[4,"TM924","电热","TM92"],[4,"TM925","家用电器及其他电器设备","TM92"],[4,"[TM926]","农村电气化","TM92"],[3,"TM93","电气测量技术及仪器","TM"],[4,"TM930","一般性问题","TM93"],[4,"TM931","微波测量及仪表","TM93"],[4,"TM932","数字式测量及仪表","TM93"],[4,"TM933","电数量的测量及仪表","TM93"],[4,"TM934","集中参数、分布参数的测量及仪表","TM93"],[4,"TM935","频率、波形参数的测量及仪表","TM93"],[4,"TM936","磁数量测量及仪器","TM93"],[4,"TM937","电磁场强度（信号强度）测量及仪表","TM93"],[4,"TM938","复用、较量、记录和模拟测试装置","TM93"],[2,"TN","电子技术、通信技术","T"],[3,"[TN-9]","电子工业经济","TN"],[3,"TN0","一般性问题","TN"],[4,"TN01","基础理论","TN0"],[4,"TN02","设计、制图","TN0"],[4,"TN03","结构","TN0"],[4,"TN04","材料","TN0"],[4,"TN05","制造工艺及设备","TN0"],[4,"TN06","测试技术及设备","TN0"],[4,"TN07","无线电产品的维修、保养","TN0"],[4,"TN08","无线电工厂","TN0"],[3,"TN1","真空电子技术","TN"],[4,"TN10","一般性问题","TN1"],[4,"TN11","电子管","TN1"],[4,"TN12","微波电子管","TN1"],[4,"TN13","气体放电器件、离子管","TN1"],[4,"TN14","电子束器件、X射线管、阴极射线管","TN1"],[4,"TN15","光电器件、光电管","TN1"],[4,"TN16","电子光学仪器","TN1"],[3,"TN2","光电子技术、激光技术","TN"],[4,"TN20","一般性问题","TN2"],[4,"TN21","红外技术及仪器","TN2"],[4,"TN22","夜视技术、夜视仪","TN2"],[4,"TN23","紫外技术及仪器","TN2"],[4,"TN24","激光技术、微波激射技术","TN2"],[4,"TN25","波导光学与集成光学","TN2"],[4,"[TN26]","全息术","TN2"],[4,"TN27","显示技术","TN2"],[4,"TN29","光电子技术的应用","TN2"],[3,"TN3","半导体技术","TN"],[4,"TN30","一般性问题","TN3"],[4,"TN31","半导体二极管","TN3"],[4,"TN32","半导体三极管（晶体管）","TN3"],[4,"TN335","PNPN四层结构器件","TN3"],[4,"TN34","晶闸管（可控硅）","TN3"],[4,"TN35","半导体整流器","TN3"],[4,"TN36","半导体光电器件","TN3"],[4,"TN37","半导体热电器件、热敏电阻","TN3"],[4,"TN382","霍尔器件、光磁电探测器件","TN3"],[4,"TN383","发光器件","TN3"],[4,"TN384","铁电及压电器件","TN3"],[4,"TN385","微波半导体器件","TN3"],[4,"TN386","场效应器件","TN3"],[4,"TN387","体效应器件","TN3"],[4,"TN389","其他器件","TN3"],[3,"TN4","微电子学、集成电路","TN"],[4,"TN40","一般性问题","TN4"],[4,"TN41","印刷电路","TN4"],[4,"TN42","微模组件","TN4"],[4,"TN43","半导体集成电路（固体电路）","TN4"],[4,"TN44","膜集成电路","TN4"],[4,"TN45","混合集成电路","TN4"],[4,"TN46","中规模集成电路","TN4"],[4,"TN47","大规模集成电路、超大规模集成电路","TN4"],[4,"TN48","真空集成电路","TN4"],[4,"TN491","光学集成电路（集成光路）","TN4"],[4,"TN492","专用集成电路","TN4"],[4,"TN495","功能块（分子电路）","TN4"],[3,"TN6","电子元件、组件","TN"],[4,"TN60","一般性问题","TN6"],[4,"TN61","微波元件、微波铁氧体元件","TN6"],[4,"TN62","微波传输控制元件","TN6"],[4,"TN63","微波过渡元件","TN6"],[4,"TN64","电声器件","TN6"],[4,"TN65","声光器件","TN6"],[3,"TN7","基本电子电路","TN"],[4,"TN70","一般性问题","TN7"],[4,"TN710","电子电路类型","TN7"],[4,"TN711","网络","TN7"],[4,"TN712","变能器","TN7"],[4,"TN713","滤波技术、滤波器","TN7"],[4,"TN715","均衡器、衰减器（衰耗器）","TN7"],[4,"TN72","放大技术、放大器","TN7"],[4,"TN73","功率合成器","TN7"],[4,"TN74","频率合成技术、频率合成器","TN7"],[4,"TN75","振荡技术、振荡器","TN7"],[4,"TN76","调制技术与调制器、解调技术与解调器","TN7"],[4,"TN77","倍频器、分频器、变频器","TN7"],[4,"TN78","脉冲技术、脉冲电路","TN7"],[4,"TN79","数字电路","TN7"],[3,"TN8","无线电设备、电信设备","TN"],[4,"TN80","一般性问题","TN8"],[4,"TN81","馈线设备（传输线和波导）","TN8"],[4,"TN82","天线","TN8"],[4,"TN83","发送设备、发射机","TN8"],[4,"TN85","接收设备、无线电收音机","TN8"],[4,"TN86","电源","TN8"],[4,"TN87","终端设备","TN8"],[3,"TN91","通信","TN"],[4,"TN911","通信理论","TN91"],[4,"TN912","电声技术和语音信号处理","TN91"],[4,"TN913","有线通信、通信线路工程","TN91"],[4,"TN914","通信系统（传输系统）","TN91"],[4,"TN915","通信网","TN91"],[4,"TN916","电话","TN91"],[4,"TN917","电报、传真","TN91"],[4,"TN918","通信保密与通信安全","TN91"],[4,"TN919","数据通信","TN91"],[4,"TN919.8","图像通信、多媒体通信","TN91"],[3,"TN92","无线通信","TN"],[4,"TN921","无线电通信基础","TN92"],[4,"TN923","无线电和有线电通信联接系统","TN92"],[4,"TN924","无线电台","TN92"],[4,"TN925","无线电中继通信、微波通信","TN92"],[4,"TN926","无线接入技术与无线通信网","TN92"],[4,"TN927","卫星通信和宇宙通信","TN92"],[4,"TN928","波导通信、毫米波通信","TN92"],[4,"TN929.1","光波通信、激光通信","TN92"],[4,"TN929.3","水下通信（声纳通信）","TN92"],[4,"TN929.4","地下通信、岩层通信","TN92"],[4,"TN929.5","移动通信","TN92"],[4,"TN929.6","中微子束通信","TN92"],[3,"TN93","广播","TN"],[4,"TN931","广播中心、广播电台","TN93"],[4,"TN932","广播站","TN93"],[4,"TN933","有线广播","TN93"],[4,"TN934","无线广播","TN93"],[4,"TN935","立体声广播","TN93"],[4,"TN937","超短波广播","TN93"],[4,"TN938","卫星广播","TN93"],[4,"TN939.1","节目传送与分配","TN93"],[3,"TN94","电视","TN"],[4,"TN941","电视信号理论","TN94"],[4,"TN942","电视光学","TN94"],[4,"TN943","电视信号的传输","TN94"],[4,"TN944","电视扫描系统","TN94"],[4,"TN945","电视同步系统","TN94"],[4,"TN946","录像系统、放像系统","TN94"],[4,"TN947","电视偏转和聚焦系统","TN94"],[4,"TN948","电视中心、电视设备","TN94"],[4,"TN949.1","电视：按体制分","TN94"],[4,"TN949.2","电视：按功能、用途分","TN94"],[4,"TN949.5","制式交换与国际节目交换","TN94"],[4,"TN949.6","电视测量及测量仪器","TN94"],[4,"TN949.7","电视接收机的维修","TN94"],[4,"TN949.8","电视传真","TN94"],[3,"TN95","雷达","TN"],[4,"TN951","雷达原理","TN95"],[4,"TN952","雷达电子电路装置","TN95"],[4,"TN953","雷达跟踪系统","TN95"],[4,"TN954","雷达监控与保护系统","TN95"],[4,"TN955","雷达系统模拟","TN95"],[4,"TN956","雷达的可靠性","TN95"],[4,"TN957","雷达设备、雷达站","TN95"],[4,"TN958","雷达：按体制分","TN95"],[4,"TN959","雷达：按用途分","TN95"],[4,"TN959.7","雷达：按使用地点分","TN95"],[3,"TN96","无线电导航","TN"],[4,"TN961","无线电导航原理","TN96"],[4,"TN962","导航电子电路装置","TN96"],[4,"TN964","导航的伺服系统和控制系统","TN96"],[4,"TN965","导航设备、导航台","TN96"],[4,"TN966","各种体制的导航系统","TN96"],[4,"TN967","各种方式和用途的导航系统","TN96"],[3,"TN97","电子对抗（干扰及抗干扰）","TN"],[4,"TN971","侦察问题","TN97"],[4,"TN972","干扰","TN97"],[4,"TN973","反侦察、反干扰","TN97"],[4,"TN974","雷达电子对抗","TN97"],[4,"TN975","通信电子对抗","TN97"],[4,"TN976","红外电子对抗","TN97"],[4,"TN977","激光电子对抗","TN97"],[4,"TN978","通信干扰设备","TN97"],[3,"[TN98]","无线电、电信测量技术及仪器","TN"],[3,"TN99","无线电电子学的应用","TN"],[2,"TP","自动化技术、计算机技术","T"],[3,"[TP-9]","自动化技术经济","TP"],[3,"TP1","自动化基础理论","TP"],[4,"TP11","自动化系统理论","TP1"],[4,"TP13","自动控制理论","TP1"],[4,"TP14","自动信息理论","TP1"],[4,"TP15","自动模拟理论（自动仿真理论）","TP1"],[4,"TP17","开关电路理论","TP1"],[4,"TP18","人工智能理论","TP1"],[3,"TP2","自动化技术及设备","TP"],[4,"TP20","一般性问题","TP2"],[4,"TP21","自动化元件、部件","TP2"],[4,"TP23","自动化装置与设备","TP2"],[4,"TP24","机器人技术","TP2"],[4,"TP27","自动化系统","TP2"],[4,"TP29","自动化技术在各方面的应用","TP2"],[3,"TP3","计算技术、计算机技术","TP"],[4,"TP3-05","计算机与其他学科的关系","TP3"],[4,"TP30","一般性问题","TP3"],[4,"TP31","计算机软件","TP3"],[4,"TP32","一般计算器和计算机","TP3"],[4,"TP33","电子数字计算机（不连续作用电子计算机）","TP3"],[4,"TP34","电子模拟计算机（连续作用电子计算机）","TP3"],[4,"TP35","混合电子计算机","TP3"],[4,"TP36","微型计算机","TP3"],[4,"TP37","多媒体技术与多媒体计算机","TP3"],[4,"TP38","其他计算机","TP3"],[4,"TP39","计算机的应用","TP3"],[3,"TP6","射流技术（流控技术）","TP"],[4,"TP60","一般性问题","TP6"],[4,"TP61","射流元件","TP6"],[4,"TP62","射流附件","TP6"],[4,"TP63","检测发信装置","TP6"],[4,"TP64","执行机构","TP6"],[4,"TP65","动力源","TP6"],[4,"TP66","射流控制线路","TP6"],[4,"TP67","射流自动控制系统","TP6"],[4,"TP69","射流技术的应用","TP6"],[3,"TP7","遥感技术","TP"],[4,"TP70","一般性问题","TP7"],[4,"TP72","遥感方式","TP7"],[4,"TP73","探测仪器及系统","TP7"],[4,"TP75","遥感图像的解译、识别与处理","TP7"],[4,"TP79","遥感技术的应用","TP7"],[3,"TP8","运动技术","TP"],[4,"TP80","一般性问题","TP8"],[4,"[TP81]","远动元件、部件","TP8"],[4,"TP83","远动化装置","TP8"],[4,"TP84","远程信道","TP8"],[4,"TP87","远动化系统","TP8"],[4,"TP89","远动技术在各方面的应用","TP8"],[2,"TQ","化学工业","T"],[3,"[TQ-9]","化学工业经济","TQ"],[3,"TQ0","一般性问题","TQ"],[4,"TQ01","基础理论","TQ0"],[4,"TQ02","化工过程（物理过程及物理化学过程）","TQ0"],[4,"TQ03","化学反应过程","TQ0"],[4,"TQ04","化工原料、辅助物料","TQ0"],[4,"TQ05","化工机械与仪器、设备","TQ0"],[4,"TQ06","化工生产过程、产品最后处理及包装","TQ0"],[4,"TQ07","化工产品与副产品","TQ0"],[4,"TQ08","化工厂","TQ0"],[4,"[TQ09]","化学工业废物的处理与综合利用","TQ0"],[3,"TQ11","基本无机化学工业","TQ"],[4,"TQ110","一般性问题","TQ11"],[4,"TQ111","无机酸类生产","TQ11"],[4,"TQ113","氨和铵盐工业","TQ11"],[4,"TQ114","氯碱工业","TQ11"],[4,"TQ115","无机盐工业","TQ11"],[4,"TQ116","工业气体","TQ11"],[4,"TQ117","特种气体","TQ11"],[4,"TQ118","无机过酸及过酸盐","TQ11"],[3,"TQ12","非金属元素及其无机化合物化学工业","TQ"],[4,"TQ122","氢","TQ12"],[4,"TQ123","氧","TQ12"],[4,"TQ124","卤素及其化合物","TQ12"],[4,"TQ125","第Ⅵ族非金属元素及其无机化合物","TQ12"],[4,"TQ126","第Ⅴ族非金属元素及其无机化合物","TQ12"],[4,"TQ127","第Ⅳ族非金属元素及其无机化合物","TQ12"],[4,"TQ128","第Ⅲ族非金属元素（硼）及其无机化合物","TQ12"],[4,"TQ129","多种非金属元素组成的无机化合物","TQ12"],[3,"TQ13","金属元素的无机化合物化学工业","TQ"],[4,"TQ131","第Ⅰ族金属元素的无机化合物","TQ13"],[4,"TQ132","第Ⅱ族金属元素的无机化合物","TQ13"],[4,"TQ133","第Ⅲ族金属元素的无机化合物","TQ13"],[4,"TQ134","第Ⅳ族金属元素的无机化合物","TQ13"],[4,"TQ135","第Ⅴ族金属元素的无机化合物","TQ13"],[4,"TQ136","第Ⅵ族金属元素的无机化合物","TQ13"],[4,"TQ137","第Ⅶ族金属元素的无机化合物","TQ13"],[4,"TQ138","第Ⅷ族金属元素的无机化合物","TQ13"],[4,"TQ139.1","杂多元酸及其盐类的生产","TQ13"],[4,"TQ139.2","其他复杂的无机化合物的生产","TQ13"],[3,"TQ15","电化学工业","TQ"],[4,"TQ150","一般性问题","TQ15"],[4,"TQ151","电解工业","TQ15"],[4,"[TQ152]","化学电源","TQ15"],[4,"TQ153","电镀工业","TQ15"],[3,"TQ16","电热工业、高温制品工业","TQ"],[4,"TQ160.5","高温电炉","TQ16"],[4,"TQ161","碳化钙（电石）的生产","TQ16"],[4,"TQ162","氰胺钙的生产","TQ16"],[4,"TQ163","人造超硬度材料的生产","TQ16"],[4,"TQ164","人造宝石、合成宝石的生产","TQ16"],[4,"TQ165","人造石墨","TQ16"],[3,"TQ17","硅酸盐工业","TQ"],[4,"TQ170","一般性问题","TQ17"],[4,"TQ171","玻璃工业","TQ17"],[4,"TQ172","水泥工业","TQ17"],[4,"TQ173","搪瓷（珐琅、搪玻璃、衬玻璃）工业","TQ17"],[4,"TQ174","陶瓷工业","TQ17"],[4,"TQ175","耐火材料工业","TQ17"],[4,"TQ176","石棉工业","TQ17"],[4,"TQ177","人造石及其他胶凝材料","TQ17"],[4,"[TQ178]","砼（混凝土）及砼制品","TQ17"],[4,"[TQ179]","砖、瓦、砌块","TQ17"],[3,"TQ2","基本有机化学工业","TQ"],[4,"TQ20","一般性问题","TQ2"],[4,"TQ21","各类有机化合物的生产（总论）","TQ2"],[4,"TQ22","脂肪族化合物（无环化合物）的生产","TQ2"],[4,"TQ23","碳环化合物、脂环族化合物的生产","TQ2"],[4,"TQ24","芳香族化合物的生产","TQ2"],[4,"TQ25","杂环化合物的生产","TQ2"],[4,"TQ26","元素有机化合物的生产","TQ2"],[4,"TQ27","含同位素有机化合物的生产","TQ2"],[4,"TQ28","天然有机化合物的生产","TQ2"],[3,"TQ31","高分子化合物工业（高聚物工业）","TQ"],[4,"TQ311","基础理论","TQ31"],[4,"TQ314","原料与辅助材料","TQ31"],[4,"TQ315","机械与设备","TQ31"],[4,"TQ316","生产过程","TQ31"],[4,"TQ317","高分子化合物产品","TQ31"],[4,"TQ318","高分子化合物工厂","TQ31"],[4,"[TQ319]","三废处理与综合利用","TQ31"],[3,"TQ32","合成树脂与塑料工业","TQ"],[4,"TQ320","一般性问题","TQ32"],[4,"TQ321","天然高分子树脂与塑料","TQ32"],[4,"TQ322","合成树脂及塑料","TQ32"],[4,"TQ323","缩聚类树脂及塑料","TQ32"],[4,"TQ324","特种塑料","TQ32"],[4,"TQ325","聚合类树脂及塑料","TQ32"],[4,"TQ327","增强塑料、填充塑料","TQ32"],[4,"TQ328","泡沫塑料","TQ32"],[3,"TQ33","橡胶工业","TQ"],[4,"TQ330","一般性问题","TQ33"],[4,"TQ331","胶乳","TQ33"],[4,"TQ332","天然橡胶","TQ33"],[4,"TQ333","合成橡胶","TQ33"],[4,"TQ334","热塑性弹性体","TQ33"],[4,"TQ335","再生橡胶","TQ33"],[4,"TQ336","橡胶制品","TQ33"],[4,"TQ337","胶乳制品","TQ33"],[4,"TQ338","胶布及胶布制品","TQ33"],[4,"TQ339","橡胶胶粘剂","TQ33"],[3,"TQ34","化学纤维工业","TQ"],[4,"TQ340","一般性问题","TQ34"],[4,"TQ341","再生纤维","TQ34"],[4,"TQ342","合成纤维","TQ34"],[4,"TQ343","无机纤维","TQ34"],[3,"TQ35","纤维素质的化学加工工业","TQ"],[4,"TQ351","木材化学加工工业","TQ35"],[4,"TQ352","纤维素化学加工工业","TQ35"],[4,"TQ353","植物纤维水解工业","TQ35"],[3,"TQ39","精细与专用化学品工业","TQ"],[4,"TQ39-09","工业史","TQ39"],[4,"TQ39-1","现状及发展","TQ39"],[4,"TQ391","基础理论","TQ39"],[4,"TQ394","原料与辅助物料","TQ39"],[4,"TQ395","机械与设备","TQ39"],[4,"TQ396","生产过程与生产工业","TQ39"],[4,"TQ397","产品","TQ39"],[4,"TQ398","工厂","TQ39"],[4,"[TQ399]","三废处理与综合利用","TQ39"],[3,"TQ41","溶剂与增塑剂的生产","TQ"],[4,"TQ410","一般性问题","TQ41"],[4,"TQ413","溶剂","TQ41"],[4,"TQ414","增塑剂","TQ41"],[4,"TQ415","有毒溶剂","TQ41"],[3,"TQ42","试剂与纯化学品的生产","TQ"],[4,"TQ420","一般性问题","TQ42"],[4,"TQ421","试剂","TQ42"],[4,"TQ422","光化学物质","TQ42"],[4,"TQ423","表面活性剂","TQ42"],[4,"TQ424","吸附剂","TQ42"],[4,"TQ425","离子交换剂","TQ42"],[4,"TQ426","催化剂（触媒）","TQ42"],[4,"TQ427","胶体与半胶体物质","TQ42"],[3,"TQ43","胶粘剂工业","TQ"],[4,"TQ430","一般性问题","TQ43"],[4,"TQ431","动物胶","TQ43"],[4,"TQ432","植物胶粘剂","TQ43"],[4,"TQ433","合成胶粘剂","TQ43"],[4,"TQ436","各种性能胶粘剂","TQ43"],[4,"TQ437","各种用途的胶粘剂","TQ43"],[3,"TQ44","化学肥料工业","TQ"],[4,"TQ440","一般性问题","TQ44"],[4,"TQ441","氮肥","TQ44"],[4,"TQ442","磷肥","TQ44"],[4,"TQ443","钾肥","TQ44"],[4,"TQ444","复合肥料（混合肥料）","TQ44"],[4,"TQ445","其他无机肥料","TQ44"],[4,"TQ446","生物肥料（细菌肥料）","TQ44"],[4,"TQ447","专用肥料","TQ44"],[4,"TQ449","其他化学肥料","TQ44"],[3,"TQ45","农药工业","TQ"],[4,"TQ450","一般性问题","TQ45"],[4,"TQ451","土农药","TQ45"],[4,"TQ452","植物生长调节剂","TQ45"],[4,"TQ453","杀虫剂","TQ45"],[4,"TQ454","杀螨剂","TQ45"],[4,"TQ455","杀菌剂","TQ45"],[4,"TQ456","杀鼠剂","TQ45"],[4,"TQ457","除草剂","TQ45"],[4,"TQ458","生物农药、无公害农药","TQ45"],[4,"TQ459","其他农药","TQ45"],[3,"TQ46","制药化学工业","TQ"],[4,"TQ460","一般性问题","TQ46"],[4,"TQ461","中草药制剂的生产","TQ46"],[4,"TQ462","无机化合物药物的生产","TQ46"],[4,"TQ463","有机化合物药物的生产","TQ46"],[4,"TQ464","生物制品药物的生产","TQ46"],[4,"TQ465","抗菌素制造","TQ46"],[4,"TQ466","维生素制造","TQ46"],[4,"TQ467","激素制造","TQ46"],[4,"TQ468","磺胺类药物制造","TQ46"],[4,"[TQ469]","各种药剂的制备","TQ46"],[3,"TQ51","燃料化学工业（总论）","TQ"],[4,"TQ511","基础理论","TQ51"],[4,"TQ514","原料","TQ51"],[4,"TQ515","机械与设备","TQ51"],[4,"TQ517","燃料种类及性质","TQ51"],[4,"TQ519","燃料化学加工的综合利用","TQ51"],[3,"TQ52","炼焦化学工业","TQ"],[4,"TQ520","一般性问题","TQ52"],[4,"TQ521","土法炼焦","TQ52"],[4,"TQ522","煤的高温干馏","TQ52"],[4,"TQ523","煤的低温干馏、中温干馏","TQ52"],[4,"TQ524","其他来源的焦油及其处理","TQ52"],[4,"TQ529","煤炭液化","TQ52"],[3,"TQ53","煤化学及煤的加工利用","TQ"],[4,"TQ530","煤化学基础理论","TQ53"],[4,"TQ531","煤的性质与测定","TQ53"],[4,"TQ533","煤的分析与检验","TQ53"],[4,"TQ534","煤的燃烧","TQ53"],[4,"TQ536","煤的加工利用","TQ53"],[3,"TQ54","煤炭气化工业","TQ"],[4,"TQ541","气化理论（可燃气体、瓦斯）","TQ54"],[4,"TQ542","煤气的种类和性质","TQ54"],[4,"TQ544","气化原料与辅助物料","TQ54"],[4,"TQ545","气化设备","TQ54"],[4,"TQ546","气化工艺","TQ54"],[4,"TQ547","煤气的分析、鉴定和储运","TQ54"],[4,"TQ548","煤气厂（煤气站、煤气车间）","TQ54"],[4,"[TQ549]","城市煤气供应","TQ54"],[3,"TQ55","燃料照明工业","TQ"],[3,"TQ56","爆炸物工业、火柴工业","TQ"],[4,"TQ56-0","爆炸物工业、火柴工业理论与方法论","TQ56"],[4,"TQ560","一般性问题","TQ56"],[4,"TQ561","土法制火药及炸药","TQ56"],[4,"TQ562","发射药","TQ56"],[4,"TQ563","起爆药","TQ56"],[4,"TQ564","猛性炸药","TQ56"],[4,"TQ565","点火、点爆材料","TQ56"],[4,"TQ567","火工术、焰火、爆竹","TQ56"],[4,"TQ568","火柴工业","TQ56"],[4,"TQ569","灭火器与灭火用剂的生产","TQ56"],[3,"TQ57","感光材料工业","TQ"],[4,"TQ571","感光理论","TQ57"],[4,"TQ572","原材料及辅助物料","TQ57"],[4,"TQ573","机械与设备","TQ57"],[4,"TQ574","生产工艺","TQ57"],[4,"TQ575","感光乳剂合成","TQ57"],[4,"TQ576","支持体","TQ57"],[4,"TQ577","感光材料产品、产品分析及鉴定","TQ57"],[4,"TQ578","感光材料制造厂","TQ57"],[4,"[TQ579]","三废处理与综合利用","TQ57"],[3,"TQ58","磁性记录材料工业","TQ"],[4,"TQ581","磁记录技术理论","TQ58"],[4,"TQ584","原材料及辅助物料","TQ58"],[4,"TQ585","机械与设备","TQ58"],[4,"TQ586","生产工艺","TQ58"],[4,"TQ587","产品","TQ58"],[4,"TQ588","磁记录材料厂","TQ58"],[4,"[TQ589]","三废处理与综合利用","TQ58"],[3,"TQ59","光学记录材料工业","TQ"],[4,"TQ591","光学记录技术理论","TQ59"],[4,"TQ594","原材料及辅助物料","TQ59"],[4,"TQ595","机械与设备","TQ59"],[4,"TQ596","生产工艺","TQ59"],[4,"TQ597","产品","TQ59"],[4,"TQ598","光学记录材料厂","TQ59"],[4,"[TQ599]","三废处理与综合利用","TQ59"],[3,"TQ61","染料及中间体工业","TQ"],[4,"TQ610","一般性问题","TQ61"],[4,"TQ611","天然染料","TQ61"],[4,"TQ612","中间体产品","TQ61"],[4,"TQ613","各种结构的合成染料","TQ61"],[4,"TQ615","各种性能的合成染料","TQ61"],[4,"TQ617","各种用途的合成染料","TQ61"],[4,"TQ619","染料应用","TQ61"],[3,"TQ62","颜料工业","TQ"],[4,"TQ620","一般性问题","TQ62"],[4,"TQ621","消色颜料","TQ62"],[4,"TQ622","彩色颜料","TQ62"],[4,"TQ623","体质颜料","TQ62"],[4,"TQ624","金属颜料","TQ62"],[4,"[TQ625]","有机颜料、色淀","TQ62"],[4,"TQ626","金属元素发光体颜料","TQ62"],[4,"TQ628","专用颜料","TQ62"],[4,"TQ629","其他","TQ62"],[3,"TQ63","涂料工业","TQ"],[4,"TQ630","一般性问题","TQ63"],[4,"TQ631","油基漆","TQ63"],[4,"TQ633","天然树脂漆、合成树脂漆","TQ63"],[4,"TQ634","硝基漆","TQ63"],[4,"TQ635","各种用途涂料","TQ63"],[4,"TQ636","稀料","TQ63"],[4,"TQ637","各种功能涂料","TQ63"],[4,"TQ638","其他涂料","TQ63"],[4,"TQ639","涂料的施工","TQ63"],[3,"TQ64","油脂和蜡的化学加工工业、肥皂工业","TQ"],[4,"TQ641","基础理论","TQ64"],[4,"TQ642","原料","TQ64"],[4,"TQ643","机械与设备","TQ64"],[4,"TQ644","生产工艺","TQ64"],[4,"TQ645","油脂工业产品及副产品","TQ64"],[4,"TQ646","油料和油脂分析及检验","TQ64"],[4,"TQ647","油脂工厂","TQ64"],[4,"TQ648","肥皂工业","TQ64"],[4,"TQ649","合成洗涤剂工业","TQ64"],[3,"TQ65","香料及化妆品工业","TQ"],[4,"TQ651","香料化学","TQ65"],[4,"TQ652","香料及化妆品的药理","TQ65"],[4,"TQ653","香料毒理","TQ65"],[4,"TQ654","天然香料","TQ65"],[4,"TQ655","合成香料","TQ65"],[4,"TQ656","各种用途香料","TQ65"],[4,"TQ657","香精","TQ65"],[4,"TQ658","化妆品","TQ65"],[3,"TQ9","其他化学工业","TQ"],[4,"TQ91","农产物化学加工工业","TQ9"],[4,"TQ92","发酵工业","TQ9"],[4,"TQ93","蛋白质（朊）化学加工工业","TQ9"],[4,"TQ94","鞣料工业","TQ9"],[4,"TQ95","海洋化学工业","TQ9"],[2,"TS","轻工业、手工业、生活服务业","T"],[3,"[TS-9]","轻工业、手工业、生活服务业经济","TS"],[3,"TS0","一般性问题","TS"],[4,"TS01","基础理论","TS0"],[4,"TS02","设计、计算、制图","TS0"],[4,"TS03","原材料及辅助物料","TS0"],[4,"TS04","机械与设备","TS0"],[4,"TS05","生产工艺","TS0"],[4,"TS06","产品及副产品","TS0"],[4,"TS07","产品标准与检验","TS0"],[4,"TS08","轻工业、手工业工厂","TS0"],[4,"TS09","包装装潢技术","TS0"],[3,"TS1","纺织工业、染整工业","TS"],[4,"TS10","一般性问题","TS1"],[4,"TS11","棉纺织","TS1"],[4,"TS12","麻纺织","TS1"],[4,"TS13","毛纺织","TS1"],[4,"TS14","丝纺织","TS1"],[4,"TS15","化学纤维纺织","TS1"],[4,"TS17","非织造布","TS1"],[4,"TS18","针织","TS1"],[4,"TS19","染整工业","TS1"],[3,"TS2","食品工业","TS"],[4,"TS20","一般性问题","TS2"],[4,"TS21","粮食加工工业","TS2"],[4,"TS22","食用油脂加工工业","TS2"],[4,"TS23","淀粉工业","TS2"],[4,"TS24","制糖工业","TS2"],[4,"TS251","屠宰及肉类加工工业","TS2"],[4,"TS252","乳品加工工业","TS2"],[4,"TS253","蛋品加工工业","TS2"],[4,"TS254","水产加工工业","TS2"],[4,"TS255","水果、蔬菜、坚果加工工业","TS2"],[4,"TS26","酿造工业","TS2"],[4,"TS27","饮料冷食制造工业","TS2"],[4,"TS29","罐头工业","TS2"],[3,"TS3","制盐工业","TS"],[4,"TS31","制盐基础科学","TS3"],[4,"TS32","盐业资源","TS3"],[4,"TS33","盐业机械","TS3"],[4,"TS34","海盐生产技术","TS3"],[4,"TS35","其他原盐生产技术","TS3"],[4,"TS36","原盐加工技术及盐产品","TS3"],[4,"TS37","产品标准与检验","TS3"],[4,"TS38","盐场、盐矿及盐化工厂","TS3"],[4,"TS39","盐业副产品加工及利用","TS3"],[3,"TS4","烟草工业","TS"],[4,"TS41","基础科学","TS4"],[4,"TS42","原料","TS4"],[4,"TS43","机械与设备","TS4"],[4,"TS44","烟草初加工","TS4"],[4,"TS45","烟草加工工艺及制品","TS4"],[4,"TS47","产品标准与检验","TS4"],[4,"TS48","烟草加工厂","TS4"],[4,"TS49","烟草工业副产品加工与利用","TS4"],[3,"TS5","皮革工业","TS"],[4,"TS51","皮革学","TS5"],[4,"TS52","原料及辅助物料","TS5"],[4,"TS53","加工机械与设备","TS5"],[4,"TS54","制革工艺","TS5"],[4,"TS55","毛皮工艺","TS5"],[4,"TS56","皮革产品","TS5"],[4,"TS57","产品标准与检验","TS5"],[4,"TS58","皮革工厂","TS5"],[4,"TS59","毛皮副产品加工及利用","TS5"],[3,"TS6","木材加工工业、家具制造工业","TS"],[4,"TS61","理论","TS6"],[4,"TS62","原材料与辅料","TS6"],[4,"TS63","结构、部件","TS6"],[4,"TS64","加工机具与设备","TS6"],[4,"TS65","加工工艺","TS6"],[4,"TS66","各种制品","TS6"],[4,"TS67","木材产品标准与检验","TS6"],[4,"TS68","木材加工厂","TS6"],[4,"TS69","木材副产品加工及利用","TS6"],[3,"TS7","造纸工业","TS"],[4,"TS71","基础理论","TS7"],[4,"TS72","原料及辅助物料","TS7"],[4,"TS73","机械与设备","TS7"],[4,"TS74","制浆工艺","TS7"],[4,"TS75","造纸工艺","TS7"],[4,"TS76","产品","TS7"],[4,"TS77","产品标准与检验","TS7"],[4,"TS78","造纸厂","TS7"],[4,"TS79","造纸副产品加工与利用","TS7"],[3,"TS8","印刷工业","TS"],[4,"TS80","一般性问题","TS8"],[4,"TS81","凸版印刷","TS8"],[4,"TS82","平版印刷","TS8"],[4,"TS83","凹版印刷","TS8"],[4,"[TS84]","孔版印刷","TS8"],[4,"TS85","特种印刷","TS8"],[4,"TS86","数字印刷","TS8"],[4,"TS87","其他印刷","TS8"],[4,"TS88","装订技术、装帧技术","TS8"],[4,"TS89","印刷技术的应用","TS8"],[3,"TS91","五金制品工业","TS"],[4,"TS911","基础理论","TS91"],[4,"TS912","原材料及辅料","TS91"],[4,"TS913","加工工艺及设备","TS91"],[4,"TS914","五金制品","TS91"],[4,"TS916","金属编结及制品","TS91"],[4,"TS917","产品标准检验","TS91"],[4,"TS918","五金工厂","TS91"],[3,"TS93","工艺美术制品工业","TS"],[4,"TS932","雕塑工艺品","TS93"],[4,"TS933","石料美术制品","TS93"],[4,"TS934","金属工艺美术制品","TS93"],[4,"TS935","刺绣、编结、制毯","TS93"],[4,"[TS936]","陶瓷、玻璃工艺美术制品","TS93"],[4,"TS938","民间工艺美术制品","TS93"],[4,"TS939","其他工艺美术制品","TS93"],[3,"TS94","服装工业、制鞋工业","TS"],[4,"TS941","服装工业","TS94"],[4,"TS942","服装表演、服装展示","TS94"],[4,"TS943","制鞋工业","TS94"],[3,"TS95","其他轻工业、手工业","TS"],[4,"TS951","文教用品制造工业","TS95"],[4,"TS952","体育器具制造工业","TS95"],[4,"TS953","乐器制造工业","TS95"],[4,"TS954","放音器、录音片","TS95"],[4,"TS955","舞台道具、装饰用品、实物模特制造工业","TS95"],[4,"TS956","灯具制造","TS95"],[4,"TS958","玩具制造工业","TS95"],[4,"TS959.1","毛发、羽毛加工及制品","TS95"],[4,"TS959.2","竹、藤、棕、草等加工及制品","TS95"],[4,"TS959.3","漆器及其制造","TS95"],[4,"TS959.4","纸料工","TS95"],[4,"TS959.5","制扇、制伞","TS95"],[4,"TS959.6","眼镜及其制造","TS95"],[4,"TS959.7","制镜","TS95"],[4,"TS959.9","其他","TS95"],[3,"TS97","生活服务技术","TS"],[4,"TS971","饮食科学","TS97"],[4,"TS972","饮食烹饪技术及设备","TS97"],[4,"TS973","衣着、日用纺织品、装饰品服务","TS97"],[4,"TS974","美容、美发、沐浴","TS97"],[4,"TS975","居住、住宿管理","TS97"],[4,"TS976","生活知识、家政服务","TS97"],[4,"TS979","其他","TS97"],[2,"TU","建筑科学","T"],[3,"TU-0","建筑理论","TU"],[4,"TU-02","建筑科学基础理论","TU-0"],[4,"TU-05","建筑学与其他学科的关系","TU-0"],[4,"TU-09","建筑史","TU-0"],[3,"TU-8","建筑艺术","TU"],[4,"TU-80","建筑艺术理论","TU-8"],[4,"TU-85","建筑艺术与其他艺术和科学的关系","TU-8"],[4,"TU-86","建筑风格、流派及作品评价","TU-8"],[4,"TU-87","建筑艺术作品的保护、修缮和仿造","TU-8"],[4,"TU-88","建筑艺术图集","TU-8"],[4,"[TU-89]","建筑艺术史","TU-8"],[3,"[TU-9]","建筑经济","TU"],[3,"TU1","建筑基础科学","TU"],[4,"TU11","建筑物理学","TU1"],[4,"TU12","数学在建筑中的应用","TU1"],[4,"[TU13]","力学在建筑中的应用","TU1"],[4,"TU14","气象学在建筑中的应用","TU1"],[4,"TU17","电子计算机在建筑中的应用","TU1"],[4,"TU18","其他科学技术在建筑中的应用","TU1"],[3,"TU19","建筑勘测","TU"],[4,"TU191","建筑勘探原理与组织","TU19"],[4,"TU192","取样、试验、参数","TU19"],[4,"[TU193]","钻进技术","TU19"],[4,"TU194","钻进设计、钻进布置","TU19"],[4,"TU195","勘探技术","TU19"],[4,"TU196","观测","TU19"],[4,"[TU197]","勘探仪器与设备","TU19"],[4,"TU198","建筑工程测量及制图","TU19"],[3,"TU2","建筑设计","TU"],[4,"TU20","一般性问题","TU2"],[4,"TU22","房屋细部构造设计","TU2"],[4,"TU24","民用建筑","TU2"],[4,"TU26","农业建筑","TU2"],[4,"TU27","工业建筑","TU2"],[4,"[TU28]","地下建筑","TU2"],[4,"TU289","水下建筑","TU2"],[4,"TU29","其他建筑","TU2"],[3,"TU3","建筑结构","TU"],[4,"TU31","结构理论、计算","TU3"],[4,"TU32","杆件系统结构","TU3"],[4,"TU33","薄壳结构","TU3"],[4,"TU34","实体结构","TU3"],[4,"TU35","特种结构","TU3"],[4,"TU36","土、砖、石、竹、木结构","TU3"],[4,"TU37","混凝土结构、钢筋混凝土结构","TU3"],[4,"TU38","非金属结构","TU3"],[4,"TU39","金属结构","TU3"],[4,"TU398","组合结构","TU3"],[4,"TU399","其他结构","TU3"],[3,"TU4","土力学、地基基础工程","TU"],[4,"TU41","土工试验","TU4"],[4,"[TU42]","工程地质学、水文地质学","TU4"],[4,"TU43","土力学","TU4"],[4,"TU44","各类型土与地基","TU4"],[4,"TU45","岩石（岩体）力学及岩石测试","TU4"],[4,"TU46","地下水与基础","TU4"],[4,"TU47","地基基础","TU4"],[4,"TU48","薄壳基础","TU4"],[3,"TU5","建筑材料","TU"],[4,"TU50","一般性问题","TU5"],[4,"TU51","金属材料","TU5"],[4,"TU52","非金属材料","TU5"],[4,"TU53","有机材料、建筑化工材料","TU5"],[4,"TU54","耐高温材料（耐火材料）、防火材料","TU5"],[4,"TU55","隔热材料、隔（吸）声材料","TU5"],[4,"TU56","建筑涂料、装饰材料","TU5"],[4,"TU57","防水、防潮材料，嵌缝、密封材料","TU5"],[4,"TU58","粘结料","TU5"],[4,"TU59","其他特种材料","TU5"],[3,"TU6","建筑施工机械和设备","TU"],[4,"TU60","一般性问题","TU6"],[4,"[TU61]","起重运输机械","TU6"],[4,"TU62","土工机械、挖掘机械","TU6"],[4,"TU63","石方机械和设备","TU6"],[4,"TU64","混凝土机械与设备","TU6"],[4,"TU65","砖瓦砌筑机具、粉刷机具和装修机具","TU6"],[4,"TU66","压实机械","TU6"],[4,"TU67","桩工机械","TU6"],[4,"[TU681]","挖泥船、卸泥船、运泥船","TU6"],[4,"[TU687]","管道铺设机械","TU6"],[4,"[TU688]","金属加工工具","TU6"],[4,"TU689","机器人在建筑施工中的应用","TU6"],[4,"TU69","其他建筑机械和工具","TU6"],[3,"TU7","建筑施工","TU"],[4,"TU71","施工管理","TU7"],[4,"TU72","施工组织与计划","TU7"],[4,"TU73","施工设备","TU7"],[4,"TU74","施工技术","TU7"],[4,"TU75","各项工程与工种","TU7"],[3,"TU8","房屋建筑设备","TU"],[4,"TU80","一般性问题","TU8"],[4,"TU81","管道设备","TU8"],[4,"TU82","房屋卫生技术设备","TU8"],[4,"TU83","空气调节、采暖、通风及其设备","TU8"],[4,"[TU84]","煤气设备","TU8"],[4,"TU85","机电设备","TU8"],[4,"TU86","降温与保温（隔热）设备","TU8"],[4,"TU87","消声、隔声设备","TU8"],[4,"[TU88]","照明设备","TU8"],[4,"TU89","安全设备","TU8"],[3,"TU9","地下建筑","TU"],[4,"TU91","地下建筑理论、勘测与计算","TU9"],[4,"TU92","地下建筑设计","TU9"],[4,"TU93","地下建筑结构","TU9"],[4,"TU94","地下建筑施工、施工机械与设备","TU9"],[4,"TU95","地下建筑设备","TU9"],[3,"TU97","高层建筑","TU"],[4,"TU971","高层建筑理论","TU97"],[4,"TU972","高层建筑设计","TU97"],[4,"TU973","高层建筑结构","TU97"],[4,"TU974","高层建筑施工、施工机械与设备","TU97"],[4,"TU976","高层建筑设备","TU97"],[4,"TU978","高层建筑养护、维修、改建","TU97"],[3,"TU98","区域规划、城乡规划","TU"],[4,"TU981","规划理论与方法","TU98"],[4,"TU982","区域规划","TU98"],[4,"TU983","景观规划设计","TU98"],[4,"TU984","城市规划","TU98"],[4,"TU985","绿化规划","TU98"],[4,"TU986","园林规划与建设","TU98"],[3,"TU99","市政工程","TU"],[4,"TU990.0","一般性问题","TU99"],[4,"TU990.3","管线工程","TU99"],[4,"TU991","给水工程（上水道工程）","TU99"],[4,"TU992","排水工程（沟渠工程、下水道工程）","TU99"],[4,"TU993","公共卫生工程","TU99"],[4,"TU994","城市供电和通信","TU99"],[4,"TU995","城市集中供热","TU99"],[4,"TU996","城市燃气供应","TU99"],[4,"[TU997]","城市道路、桥梁工程","TU99"],[4,"TU998","其他市政工程及公用设备","TU99"],[2,"TV","水利工程","T"],[3,"[TV-9]","水利经济","TV"],[3,"TV1","水利工程基础科学","TV"],[4,"[TV11]","水文学","TV1"],[4,"TV12","工程水文学","TV1"],[4,"TV13","水力学","TV1"],[4,"TV14","泥沙动力学、河流动力学","TV1"],[4,"TV15","世界各国河流泥沙","TV1"],[4,"[TV16]","土力学","TV1"],[3,"TV21","水资源调查与水利规划","TV"],[4,"TV211","水利调查","TV21"],[4,"TV212","水利规划、水电规划","TV21"],[4,"TV213","水资源开发","TV21"],[4,"TV214","水利计算","TV21"],[3,"TV22","水工勘测、水工设计","TV"],[4,"TV221","水工勘测","TV22"],[4,"TV222","水工设计","TV22"],[4,"TV223","地基基础及其加固","TV22"],[3,"TV3","水工结构","TV"],[4,"TV31","结构理论和计算","TV3"],[4,"TV32","结构试验","TV3"],[4,"TV33","混凝土结构和加筋混凝土结构","TV3"],[4,"TV34","金属结构","TV3"],[4,"TV35","非金属结构","TV3"],[4,"TV36","水下结构","TV3"],[4,"TV37","拱和薄壳结构","TV3"],[4,"TV39","其他","TV3"],[3,"TV4","水工材料","TV"],[4,"TV41","水工材料试验","TV4"],[4,"TV42","水泥、集料（骨料）、掺加料和外加剂","TV4"],[4,"TV43","水工混凝土和砂浆","TV4"],[4,"TV44","防渗材料和止水材料","TV4"],[4,"TV45","气硬性胶结材料","TV4"],[4,"TV46","环氧树脂胶结材料","TV4"],[4,"TV47","防腐材料","TV4"],[4,"TV48","金属材料","TV4"],[4,"TV49","其他","TV4"],[3,"TV5","水利工程施工","TV"],[4,"TV51","施工计划和管理","TV5"],[4,"TV52","施工技术","TV5"],[4,"TV53","施工机械与设备","TV5"],[4,"TV54","各种工程、工种","TV5"],[3,"TV6","水利枢纽、水工建筑物","TV"],[4,"TV61","水利枢纽工程","TV6"],[4,"TV62","水库工程","TV6"],[4,"TV63","世界各国水利枢纽与水库","TV6"],[4,"TV64","挡水坝","TV6"],[4,"TV65","泄水建筑物","TV6"],[4,"TV66","水闸","TV6"],[4,"TV67","取水、引水工程","TV6"],[4,"TV68","调水工程","TV6"],[4,"[TV691]","过航建筑物","TV6"],[4,"TV697","水库管理","TV6"],[4,"TV698","水工建筑物管理","TV6"],[3,"TV7","水能利用、水电站工程","TV"],[4,"TV72","水能勘测与设计","TV7"],[4,"TV73","水电站建筑与设备","TV7"],[4,"TV74","各种水电站","TV7"],[4,"TV75","世界各国水力发电工程","TV7"],[4,"TV76","中小河道水能利用","TV7"],[3,"TV8","治河工程与防洪工程","TV"],[4,"TV81","河工学","TV8"],[4,"TV82","治河勘测及规划","TV8"],[4,"TV83","河工试验","TV8"],[4,"[TV84]","河工材料","TV8"],[4,"TV85","治河方法（河道整治）","TV8"],[4,"TV86","整治建筑","TV8"],[4,"TV87","防洪工程","TV8"],[4,"TV88","世界各国河流治理","TV8"],[3,"[TV91]","运渠（运河、渠道）工程","TV"],[3,"[TV92]","港湾工程","TV"],[3,"[TV93]","农田水利工程","TV"],[1,"U","交通运输","__root__"],[2,"[U-9]","交通运输经济","U"],[2,"U1","综合运输","U"],[3,"U11","综合运输体制与结构","U1"],[3,"U12","城市交通运输","U1"],[3,"U13","乡村交通运输","U1"],[3,"U14","长途运输","U1"],[3,"[U15]","联运","U1"],[3,"U16","特种货物运输","U1"],[3,"U169","集装箱运输","U1"],[3,"U17","管道运输","U1"],[3,"U18","索道运输","U1"],[2,"U2","铁路运输","U"],[3,"[U2-9]","铁路运输经济","U2"],[3,"U21","铁路线路工程","U2"],[3,"U22","电气化铁路","U2"],[3,"U23","特种铁路","U2"],[3,"[U24]","铁路桥涵工程","U2"],[3,"[U25]","铁路隧道工程","U2"],[3,"U26","机车工程","U2"],[3,"U27","车辆工程","U2"],[3,"U28","铁路通信、信号","U2"],[3,"U29","铁路运输管理工程","U2"],[2,"U4","公路运输","U"],[3,"[U4-9]","公路运输经济","U4"],[3,"U41","道路工程","U4"],[3,"U44","桥涵工程","U4"],[3,"U45","隧道工程","U4"],[3,"U46","汽车工程","U4"],[3,"U48","其他道路运输工具","U4"],[3,"U49","交通工程与公路运输技术管理","U4"],[2,"U6","水路运输","U"],[3,"[U6-9]","水路运输经济","U6"],[3,"U61","航道工程","U6"],[3,"U64","通航建筑物与助航设备","U6"],[3,"U65","港口工程","U6"],[3,"U66","船舶工程","U6"],[3,"U69","水路运输技术管理","U6"],[2,"[U8]","航空运输","U"],[1,"V","航空、航天","__root__"],[2,"V1","航空、航天技术的研究与探索","V"],[3,"V11","航空、航天的发展与空间探索","V1"],[3,"V19","航空、航天的应用","V1"],[2,"V2","航空","V"],[3,"[V2-9]","航空运输经济","V2"],[3,"V21","基础理论及试验","V2"],[3,"V22","飞机构造与设计","V2"],[3,"V23","航空发动机（推进系统）","V2"],[3,"V24","航空仪表、航空设备、飞行控制与导航","V2"],[3,"V25","航空用材料","V2"],[3,"V26","航空制造工艺","V2"],[3,"V27","各类型航空器","V2"],[3,"V31","航空用燃料及润滑剂","V2"],[3,"V32","航空飞行术","V2"],[3,"V35","航空港（站）、机场及其技术管理","V2"],[3,"V37","航空系统工程","V2"],[2,"V4","航天（宇宙航行）","V"],[3,"V41","基础理论及试验","V4"],[3,"V42","火箭、航天器构造（总体）","V4"],[3,"V43","推进系统（发动机、推进器）","V4"],[3,"V44","航天仪表、航天器设备、航天器制导与控制","V4"],[3,"[V45]","航天用材料","V4"],[3,"V46","制造工艺","V4"],[3,"V47","航天器及其运载工具","V4"],[3,"V51","航天用燃料（推进剂）及润滑剂","V4"],[3,"V52","航天术","V4"],[3,"V55","地面设备、试验场、发射场、航天基地","V4"],[3,"V57","航天系统工程","V4"],[2,"[V7]","航空、航天医学","V"],[1,"X","环境科学、安全科学","__root__"],[2,"X-0","环境科学理论","X"],[3,"X-01","环境保护政策及其阐述","X-0"],[3,"[X-019]","环境保护法","X-0"],[2,"X-1","环境科学技术现状与发展","X"],[3,"X-11","世界环境科学技术现状与发展","X-1"],[3,"X-12","中国环境科学技术现状与发展","X-1"],[3,"X-13","亚洲环境科学技术现状与发展","X-1"],[3,"X-14","非洲环境科学技术现状与发展","X-1"],[3,"X-15","欧洲环境科学技术现状与发展","X-1"],[3,"X-16","大洋洲及太平洋岛屿环境科学技术现状与发展","X-1"],[3,"X-17","美洲环境科学技术现状与发展","X-1"],[2,"X-2","环境保护组织、机构、会议","X"],[3,"X-20","国际组织","X-2"],[3,"X-23","社会团体","X-2"],[3,"X-24","研究机构","X-2"],[3,"X-26","学术团体、学会、协会","X-2"],[3,"X-27","学术会议、专业会议","X-2"],[3,"X-28","展览会、展览馆、博物馆","X-2"],[3,"X-289","图书馆、信息服务机构、咨询机构","X-2"],[3,"X-29","生产单位、企业","X-2"],[2,"X-4","环境保护宣传教育及普及","X"],[3,"X-40","教育组织、学校","X-4"],[3,"X-41","教学计划、教学大纲、课程","X-4"],[3,"X-42","教学方法、教学参考书","X-4"],[3,"X-43","教材、课本","X-4"],[3,"X-44","习题、试题与题解","X-4"],[3,"X-45","教学实验、实习、实践","X-4"],[3,"X-46","教学设备","X-4"],[3,"X-47","考核、评估、奖励","X-4"],[3,"X-49","普及读物","X-4"],[2,"X-6","环境保护参考工具书","X"],[3,"X-65","环境保护标准","X-6"],[2,"X1","环境科学基础理论","X"],[3,"X11","环境数学","X1"],[3,"X12","环境物理学","X1"],[3,"X13","环境化学","X1"],[3,"X14","环境地学","X1"],[3,"X16","环境气象学","X1"],[3,"X169","环境空气动力学","X1"],[3,"X17","环境生物学","X1"],[3,"[X18]","环境医学","X1"],[3,"[X191]","环境心理学","X1"],[3,"X192","环境系统学（环境系统工程）","X1"],[3,"X196","环境经济学","X1"],[3,"[X197]","环境法学","X1"],[2,"X2","社会与环境","X"],[3,"X2-1","现状与综合调查","X2"],[3,"X21","环境与环境系统","X2"],[3,"X22","环境与发展","X2"],[3,"X24","人类、资源、能源与环境的关系","X2"],[3,"X26","环境容量与环境自净","X2"],[2,"X3","环境保护管理","X"],[3,"X32","环境规划与环境管理","X3"],[3,"[X33]","环境卫生与卫生工程","X3"],[3,"[X34]","放射卫生与辐射防护","X3"],[3,"X36","自然保护区划及其管理","X3"],[3,"X37","自然资源合理开发与环境保护","X3"],[3,"X38","环境与清洁生产（无污染技术）","X3"],[2,"X4","灾害及其防治","X"],[3,"X43","自然灾害及其防治","X4"],[3,"X45","人为灾害及其防治","X4"],[2,"X5","环境污染及其防治","X"],[3,"X50","一般性问题","X5"],[3,"X51","大气污染及其防治","X5"],[3,"X52","水体污染及其防治","X5"],[3,"X53","土壤污染及其防治","X5"],[3,"X54","岩石地层污染及其防治","X5"],[3,"X55","海洋污染及其防治","X5"],[3,"X56","食物污染及其防治","X5"],[3,"X57","热污染及其防治","X5"],[3,"X591","放射性物质污染及其防治","X5"],[3,"X592","农用化学物质、有毒化学物质污染及其防治","X5"],[3,"[X593]","噪声、振动及其控制","X5"],[2,"X7","行业污染、废物处理与综合利用","X"],[3,"X70","一般性问题","X7"],[3,"X71","农业污染、废物处理与综合利用","X7"],[3,"X72","森林工业污染、废物处理与综合利用","X7"],[3,"X73","交通运输业污染、废物处理与综合利用","X7"],[3,"X74","石油、天然气工业污染、废物处理与综合利用","X7"],[3,"X75","矿业、冶金工业污染、废物处理与综合利用","X7"],[3,"X76","机械、仪表工业污染、废物处理与综合利用","X7"],[3,"X77","动力工业污染、废物处理与综合利用","X7"],[3,"X78","化学工业污染、废物处理与综合利用","X7"],[3,"X79","轻工业污染、废物处理与综合利用","X7"],[3,"X799","其他","X7"],[2,"X8","环境质量评价与环境监测","X"],[3,"X82","环境质量分析与评价","X8"],[3,"X83","环境监测","X8"],[3,"X84","环境监测网、站，监测系统","X8"],[3,"X85","环境监测仪器设备","X8"],[3,"X87","环境遥感","X8"],[2,"X9","安全科学","X"],[3,"X9-6","安全科学参考工具书","X9"],[3,"X91","安全科学基础理论","X9"],[3,"X92","安全管理（劳动保护管理）","X9"],[3,"X93","安全工程","X9"],[3,"X96","劳动卫生工程","X9"],[1,"Z","综合图书","__root__"],[2,"Z1","丛书","Z"],[3,"Z12","中国丛书","Z1"],[3,"Z13","亚洲丛书","Z1"],[3,"Z14","非洲丛书","Z1"],[3,"Z15","欧洲丛书","Z1"],[3,"Z16","大洋洲及太平洋岛屿丛书","Z1"],[3,"Z17","美洲丛书","Z1"],[2,"Z2","百科全书、类书","Z"],[3,"Z22","中国百科全书、类书","Z2"],[3,"Z23","亚洲百科全书","Z2"],[3,"Z24","非洲百科全书","Z2"],[3,"Z25","欧洲百科全书","Z2"],[3,"Z26","大洋洲及太平洋岛屿百科全书","Z2"],[3,"Z27","美洲百科全书","Z2"],[3,"[Z28]","专科百科全书","Z2"],[2,"Z3","辞典","Z"],[3,"Z32","中国辞典","Z3"],[3,"Z33","亚洲辞典","Z3"],[3,"Z34","非洲辞典","Z3"],[3,"Z35","欧洲辞典","Z3"],[3,"Z36","大洋洲及太平洋岛屿辞典","Z3"],[3,"Z37","美洲辞典","Z3"],[3,"[Z38]","专科辞典","Z3"],[2,"Z4","论文集、全集、选集、杂著","Z"],[3,"Z42","中国论文集、全集、选集、杂著","Z4"],[3,"Z43","亚洲论文集、全集、选集、杂著","Z4"],[3,"Z44","非洲论文集、全集、选集、杂著","Z4"],[3,"Z45","欧洲论文集、全集、选集、杂著","Z4"],[3,"Z46","大洋洲及太平洋岛屿论文集、全集、选集、杂著","Z4"],[3,"Z47","美洲论文集、全集、选集、杂著","Z4"],[2,"Z5","年鉴、年刊","Z"],[3,"Z52","中国年鉴、年刊","Z5"],[3,"Z53","亚洲年鉴、年刊","Z5"],[3,"Z54","非洲年鉴、年刊","Z5"],[3,"Z55","欧洲年鉴、年刊","Z5"],[3,"Z56","大洋洲及太平洋岛屿年鉴、年刊","Z5"],[3,"Z57","美洲年鉴、年刊","Z5"],[3,"[Z58]","专科年鉴、年刊","Z5"],[2,"Z6","期刊、连续性出版物","Z"],[3,"Z62","中国期刊、连续性出版物","Z6"],[3,"Z63","亚洲期刊、连续性出版物","Z6"],[3,"Z64","非洲期刊、连续性出版物","Z6"],[3,"Z65","欧洲期刊、连续性出版物","Z6"],[3,"Z66","大洋洲及太平洋岛屿期刊、连续性出版物","Z6"],[3,"Z67","美洲期刊、连续性出版物","Z6"],[3,"[Z68]","专科期刊、连续出版物","Z6"],[2,"Z8","图书报刊目录、文摘、索引","Z"],[3,"Z81","国家总目录","Z8"],[3,"Z82","图书馆藏书目录","Z8"],[3,"Z83","各类型目录","Z8"],[3,"Z84","私家藏书目录","Z8"],[3,"Z85","出版发行目录","Z8"],[3,"Z86","个人著作目录","Z8"],[3,"Z87","期刊目录、报纸目录","Z8"],[3,"Z88","专科目录","Z8"],[3,"Z89","文摘、索引","Z8"]];

const CLC = {
    "bookTitle": "《中国图书馆分类法》（第五版）",
    "selectionTitle": "中图法五版主表实用三级类目",
    "selector": "徐清白",
    "selectDateRange": "2013/09-2017/05",
    "jsonDate": "2023/03",
    "edition": 5,
    "level_AS_UZ": 3,
    "level_T": 4,
    "classes" : {
        "total": 3760,
        "normal": 3555,
        "alternative": 198,
        "deprecated": 7
    },
    // JSON HPack 1.0.1 还原
    "nodes": JSON.hunpack(CLCnodesH),
    
    // 根据分类号获得类目节点
    getNodeByTag: (nodeTag) => {
        let nodeByTag = null;
        CLC.nodes.forEach((node) => {
            if (node.tag == nodeTag)
                nodeByTag = node;
        });
        return nodeByTag;
    },

    // 根据分类号获得子类目节点
    getChildNodesByTag: (nodeTag) => {
        let children = [];
        CLC.nodes.forEach((node) => {
            if (node.parentTag == nodeTag)
                children.push(node);
        });
        return children;
    },

    // 根据类目名称关键词获得类目节点
    matchedNodesByName: (nodeNameKW) => {
        // 用类名构造匹配式（套在捕获组中）
        const pattern = new RegExp(`${nodeNameKW}`, "i"); // 不区分大小写
        let nodes = [];
        CLC.nodes.forEach((node) => {
            if (pattern.test(node.name)) nodes.push(node);
        });
        return nodes;
    },

    // 用于 match(CLC.rePureClassTag)[0] 剔除分类号文本左右的 [] {} 标记
    rePureClassTag: /\w.*\d|[A-Z]{1,2}/
};

    // 原生索书号检索用户输入参数快照
    let snapCallNumberSearch = {
        searchdata1: "", // 索书号(文本框）
        selects: {       // 下拉框
            "library": "北大中心馆",
            "class": "中图法_C",
            "item_type": "ANY",
            "location": "ANY"
        },
        hiddens: {       // 隐藏参数
            "shadow": "NO",
            "maxskip": "50",
            "icat1": "ANY",
            "icat2": "ANY",
            "icat3": "ANY",
            "icat4": "ANY",
            "icat5": "ANY"
        }
    };

    // 初始化 PK 界面分类浏览的用户输入参数快照
    let snapCLCBrowserForm = {
        "searchdata1": "",  // 索书号
        "class": "中图法_C",
        "library": "北大中心馆",
        "location": "ANY",
        "item_type": "ANY"
    };
    
    // 读取中图法分类树形显示相关油猴设置
    // 如果缺省，按空集、空值、零值等初始化
    // 展开节点（分类号）集合快照
    let snapCLCUnfoldedNodeTags = GM_getValue("CLCUnfoldedNodeTags", {});
    // 垂直滚动位置
    let snapCLCTreeScrollTop = GM_getValue("CLCTreeScrollTop", 0);
    // 最后点击节点（分类号）
    let snapCLCLastClickedNodeTag = GM_getValue("CLCLastClickedNodeTag", "");

    //【函数】装载显示子类列表
    // 根据分类号指定节点，装载后展开显示
    function loadChildListByTag(nodeTag) {
        if ($(`#ulCLCTree button[value='${nodeTag}']`).length == 0) {
            // 如果当前节点并没有创建，删除展开节点集合快照中相应元素记录，保存回油猴设置
            // 比如用户展开 A 又展开 A8 然后收起了整个 A 再刷新页面，这时 A 的下级不会装载，A8 的下级当然就无处装载
            delete snapCLCUnfoldedNodeTags[nodeTag];
            GM_getValue("CLCUnfoldedNodeTags", snapCLCUnfoldedNodeTags);
            // 不会继续装载，中止退出
            return;
        }

        // 添加到展开节点集合
        snapCLCUnfoldedNodeTags[nodeTag] = true;
        // 保存到油猴设置
        GM_setValue("CLCUnfoldedNodeTags", snapCLCUnfoldedNodeTags);

        // 获取当前节点的下级节点列表
        const $ulCLCChildNodes = $(`#ulCLCTree button[value='${nodeTag}']`).next().next();
        if ($ulCLCChildNodes.length > 0)
            // 已经装载，无需创建，直接恢复显示（特效拉下）
            $ulCLCChildNodes.slideDown();
            // ()=>{console.log("已经装载，所以直接拉下"+nodeTag+"的子类列表！"); return true;}
        else {
            // 还没装载，需要创建（装载）
            // 根据每行里的查询按钮的 value 属性确定当前节点所在 li 元素，紧跟着创建子类列表
            const $ulNewCLCChildNodes = $(`#ulCLCTree button[value='${nodeTag}']`).parent().append($("<ul class='CLCChildNodes'></ul>")).find(".CLCChildNodes");
            // 暂时隐藏，创建完成后特效显示
            $ulNewCLCChildNodes.css("display", "none");
            // 获取上级节点的鼠标悬停提示文字，用于当前节点鼠标悬停提示文字的合成
            const parentTitle = $(`#ulCLCTree button[value='${nodeTag}']`).next().attr("title");
            // 在新建的子类列表内，填充创建子类节点容器及内部结构
            CLC.getChildNodesByTag(nodeTag).forEach((node) => {
                // 子节点容器：用 .CLCTreeLevel_x_ 标记分类层级
                let $liNewNode = $(`<li class='CLCTreeLevel_${node.level}_'></li>`);
                $ulNewCLCChildNodes.append($liNewNode);
                $liNewNode.append($(`<button value='${node.tag}'>←</button>`))
                          .append($(`<label class='CLCNode'></label>`));
                $liNewNode.find(".CLCNode").append($(`<strong class='CLCNodeTag'>${node.tag}</strong>`))
                                           .append($(`<span class='CLCNodeName'>${node.name}</span>`))
                                           .attr("title", parentTitle + " » " + node.name); // 悬停提示
                // 整行类目的单击事件：展开/收起当前节点的子类
                $liNewNode.find(".CLCNode").bind("click", toggleCLCLine);
                // 类目前按钮的单击事件：提交检索查询
                $liNewNode.find("button").bind("click", submitCLCsearch);
                // 检索按钮的鼠标悬停提示文字
                $liNewNode.find("button").attr("title", "检索中图法分类号：" + node.tag.match(CLC.rePureClassTag)[0]);
            });
            // 创建完成，特效拉下显示
            $ulNewCLCChildNodes.slideDown();
        }
    }

    //【函数】递归标记全部上级途径节点 .routerNode
    // 参数必须是一个 $(".CLCNode")
    function markRouterCLCNode($node) {
        // 标记参数所指的节点为途径节点
        $node.addClass("routerNode");
        // 获取上级节点：.CLCNode < li < ul prev=.CLCNode
        // 绝不能从 li 向下 find .CLCNode 因为那样会找到一大堆不相关的子节点
        const $parentNode = $node.parent().parent().prev();
        const $parentNodeLI = $parentNode.parent();
        // 如果上级为根节点（所在 li 类判定）则开始退出递归
        if ($parentNodeLI.hasClass("CLCTreeLevel_0_")) return;
        // 否则，先去标记上级节点
        markRouterCLCNode($parentNode);
    }

    //【函数】如果一级类目都收起就隐藏“收起全部类目”按钮
    function trySlideUpCloseAllLines() {
        // 获取当前一级类目节点
        const allNodesL1 = CLC.getChildNodesByTag("__root__");
        // 初始化统计数字为节点总数
        let unfoldedNodesL1 = allNodesL1.length;
        allNodesL1.forEach((nodeL1) => {
            // 如果某一级节点收起了，统计数字减一
            if (snapCLCUnfoldedNodeTags[nodeL1.tag] === undefined) unfoldedNodesL1--;
        });
        // 最终如果统计数字减到了零，即一级类目全部收起了，那么隐藏“收起全部类目”按钮
        if (unfoldedNodesL1 == 0) $("#divCLCBrowser .divCloseAllLines").slideUp();
    }

    //【函数】切换中图法分类树一行的展开或收起
    function toggleCLCLine(ev) {
        // 校准当前节点
        // 容器嵌套导致重复绑定事件：ev.target 可能是被嵌套的下级 span 而不是绑定事件的 label，取决于单击时的位置
        const $CLCnode = $(ev.target).hasClass("CLCNode") ? $(ev.target) : $(ev.target).parent();

        // 去掉所有的途径节点类，然后重新标记全部上级途径节点
        $("#ulCLCTree .CLCNode").removeClass("routerNode");
        markRouterCLCNode($CLCnode);

        // 去掉之前标记的当前点击节点，重新标记新的
        $("#ulCLCTree .CLCNode").removeClass("clickedNode");
        $CLCnode.addClass("clickedNode");

        // 获取当前节点分类号
        const nodeTag = $CLCnode.prev("button").attr("value");
        // “提纯”后填写到显示控件的文本输入框
        $(".liCLCSearchData input:text").val(nodeTag.match(CLC.rePureClassTag)[0]);
        // 保存油猴设置，下次初始化页面时使用
        snapCLCLastClickedNodeTag = nodeTag;
        GM_setValue("CLCLastClickedNodeTag", snapCLCLastClickedNodeTag);
        GM_setValue("CLCManualSearchData", $(".liCLCSearchData input:text").val());
        
        // 获取子节点集合
        const childNodes = CLC.getChildNodesByTag(nodeTag);

        // 节点没有子节点，无所谓展开/收起，中止执行
        if (childNodes.length == 0) return false;

        // 执行展开/收起
        if (snapCLCUnfoldedNodeTags[nodeTag] === undefined) {
            // 从当前节点展开显示
            loadChildListByTag(nodeTag);
            // 显示“收起全部类目”按钮
            $("#divCLCBrowser .divCloseAllLines").slideDown();
        } else {
            // 收起
            // 当前节点原来已经展开，标记从展开集合删除
            delete snapCLCUnfoldedNodeTags[nodeTag];
            // 保存到油猴设置
            GM_setValue("CLCUnfoldedNodeTags", snapCLCUnfoldedNodeTags);
            // 收起显示（特效拉起）当前节点内的 ul.CLCChildNodes 列表，即子节点列表
            $CLCnode.next().slideUp();
            // 如果一级类目都收起就隐藏“收起全部类目”按钮
            trySlideUpCloseAllLines();
        }
    }

    //【函数】以当前节点分类号为索书号，提交检索查询
    // 树形显示中每一行的 button 绑定该事件
    function submitCLCsearch(ev) {
        // 获取当前节点分类号
        const nodeTag = ev.target.value;
        // 不需要分类号左右可能存在的 [] 或 {}
        const pureClassTag = nodeTag.match(CLC.rePureClassTag)[0];
        // 数据同步：隐藏表单的索书号、显示控件的文本输入框、原生索书号检索框的索书号
        $("#inputCLC_searchdata1, .liCLCSearchData input:text, #searchdata1").val(pureClassTag);
        // 触发原生索书号检索框变更事件，保存输入值
        // 之所以要同步原生检索框，是为了高亮索书号检索结果
        $(".call_number_search input:text").trigger("change");
        // 油猴设置保存手动输入值
        GM_setValue("CLCManualSearchData", pureClassTag);
        // 将当前行保存为最后点击的类目（分类号）
        snapCLCLastClickedNodeTag = nodeTag;
        GM_setValue("CLCLastClickedNodeTag", snapCLCLastClickedNodeTag);
        // 提交查询（当前页面会刷新）
        $("#formCLCBrowser").submit();
    }

    //【函数】在树形显示中找到指定类号的类目
    function seekCLCTreeByTag(targetTag) {
        const targetNode = CLC.getNodeByTag(targetTag);
        // 手动输入的可能不会匹配任何类号，中止
        if (targetTag == "" || targetNode === null) return false;

        // 如果目标为根节点或一级节点，已经装载显示了
        if (targetNode.level > 1) {
            // 获取指定类号所有上级节点的类号列表
            let parentNodeTags = []; // [1-3最大]
            for (let level = targetNode.level - 1, node = targetNode; level > 0; level--) {
                // e.g. 四级类 TP39 最后会生成 ["T", "TP", "TP3"] 数组
                node = CLC.getNodeByTag(node.parentTag);
                parentNodeTags.unshift(node.tag);
            }
            // 尝试装载显示所有上级节点
            parentNodeTags.forEach((nodeTag) => {
                loadChildListByTag(nodeTag);
            });
            // 肯定需要显示“收起全部类目”按钮
            $("#divCLCBrowser .divCloseAllLines").slideDown();
        }
        // 已装载，获取目标节点 label
        const $labelTargetCLCNode = $(`#ulCLCTree button[value='${targetTag}']`).next();
        // 临时高亮，仅改变显示样式，刷新就会消失
        $labelTargetCLCNode.addClass("hitNode");
        // 显示完毕，现在滚动跳转
        // 计算目标节点 label 的垂直位置
        const targetTop = $labelTargetCLCNode[0].offsetTop - $("#ulCLCTree")[0].offsetTop;
        // 垂直滚动到目标行的位置上，延时是考虑控件装载时间
        setTimeout(() => { $("#ulCLCTree").scrollTop(targetTop); }, 800);
        // 成功 seek 则最后返回真值
        return true;
    }

    // 索书号浏览结果页面增强
    if ($(".left_column ul.hit_list h3:contains('索书号检索')").length > 0) {
        idManPK = "索书号结果";
        // 从油猴设置读取索书号浏览面板数据，然后在左栏顶部复刻创建
        // 通常索书号浏览界面由入口而来，但如果是从借书清单界面过来，就要看以前是否保存过了
        const contentHTML = GM_getValue("OriginalCallNumberSearch_contentHTML", "");
        $("div.left_column table tr:last").after($("<tr class='powerkit_table-row'><td class='call_number_search'></td></tr>"));
        $("div.left_column td.call_number_search").html(contentHTML);
        // 删除多余的小标题
        $(".call_number_search h3").remove();
        // 增设返回索书号入口的快捷链接
        $(".searchsum_container h3").append($("<span class='powerkit_inline'>［<a href='http://162.105.138.200/uhtbin/cgisirsi/0/0/0/61/58/X' title='返回索书号检索入口'>返回</a>］</span>"));
        // 重调控件顺序，增加硬换行
        $(".call_number_search select#class").parent().after($(".call_number_search select#library").parent());
        $(".call_number_search select#library").after($("<br />"));
        $(".call_number_search select#item_type").parent().before($(".call_number_search li:last"));
        // 修改重置按钮文字，按下行为增加 confirm 确认
        $(".call_number_search .button[type=reset]").val("重置").click(() => confirm("确定重置索书号检索框吗？输入的索书号会被清空，下拉选择框会恢复初始选项。"));
        // 复刻翻页按钮：浏览列表上下，从原生绿色导航栏都复刻“后退”“前进”链接
        $(".hit_list > li.searchsummary, .hit_list > li.searchsum_container_bottom").append("<button class='powerkit_inline-block button call_number_search_prevNext'></button>".repeat(2));
        $("li").find(".call_number_search_prevNext:first").text("　＜＜ 上一页　").click(() => {
            self.location.href = $(".bottom_buttons .menu_link a:contains('后退')").attr("href");
        });
        $("li").find(".call_number_search_prevNext:last").text("　下一页 ＞＞　").click(() => {
            self.location.href = $(".bottom_buttons .menu_link a:contains('向前')").attr("href");
        });
        
        // 仅当成功复刻原生索书号检索框时——
        if ($("#library").length > 0) {
            // （复刻的）原生索书号检索框：馆别、馆藏位置排序（先中文后英文，中文按汉语拼音排序）
            sortSelectByOptionText("#library");
            sortSelectByOptionText("#location");
            // 调整选项，加设 ========== 分隔线
            // 馆别“北大中心馆”选项置顶
            $("#library").prepend($("<option disabled='disabled'>==========</option>"));
            $("#library").prepend($("#library option:contains('北大中心馆')"));
            // 类型“任何”选项
            $("#item_type").prepend($("<option disabled='disabled'>==========</option>"));
            $("#item_type").prepend($("#item_type option[value='ANY']"));
            // 馆藏位置“任何”选项置顶
            $("#location").prepend($("<option disabled='disabled'>==========</option>"));
            $("#location").prepend($("#location option[value='ANY']"));
            // 排架法部分选项翻译
            let tmpClassHTML = $("#class").html();
            // 反复替换 innerHTML 里涉及可用中图法的选项
            $.each({"Chinese": "中文", "Western": "西文", "Arabic": "阿拉伯文"}, (en, zh) => {
                const pattern = new RegExp(`Chinese Classification for ${en} books`);
                const repl = `中图法（${zh}）`;
                tmpClassHTML = tmpClassHTML.replace(pattern, repl);
            });
            $("#class").html(tmpClassHTML);
        }

        // 根据油猴设置，恢复用户输入参数
        // 如果油猴设置缺省，按先前初始化的来
        snapCallNumberSearch = GM_getValue("OriginalCallNumberSearch_paramSnap", snapCallNumberSearch);
        $(".call_number_search input#searchdata1").val(snapCallNumberSearch.searchdata1);
        $(".call_number_search select").each((ind, ele) => {
            $(ele).val(snapCallNumberSearch.selects[$(ele).attr("name")]);
        });
        $(".call_number_search input:hidden").each((ind, ele) => {
            $(ele).val(snapCallNumberSearch.hiddens[$(ele).attr("name")]);
        });
        // 用户输入的特殊字符转义，然后创建索书号匹配正则表达式
        const seachDataEscaped = snapCallNumberSearch.searchdata1.trim().replace(/([\.\(\)])/g, "\\$1"); // . ( )
        const patternBeginwithCN = new RegExp("^(" + seachDataEscaped + ")(.*)", "i");
        $("ul.hit_list ul.hit_list_row").each((ind, ele) => {
            let rowCallNumber = $(ele).find("dd.title > a").text().trim();
            // 凡以用户输入索书号开头的浏览列表项目，整体背景高亮
            if (patternBeginwithCN.test(rowCallNumber))
                $(ele).addClass("powerkit_highlightedRow");
            // 凡以用户输入索书号开头的索书号，匹配部分文字高亮
            $(ele).find("dd.title > a").html(rowCallNumber.replace(patternBeginwithCN, "<span class='powerkit_highlightedKeywords'>$1</span>$2"));
        });
    }

    // 索书号检索入口页面增强
    if ($(".left_column > .call_number_search").length > 0) {
        idManPK = "索书号入口";
        // 保存索书号浏览原生界面
        GM_setValue("OriginalCallNumberSearch_contentHTML", $(".call_number_search .content").html());
        // 重新提取 snapCallNumberSearch.hiddens（表单隐藏参数）
        $(".call_number_search input:hidden").each((ind, ele) => {
            snapCallNumberSearch.hiddens[$(ele).attr("name")] = $(ele).val();
        });
    }

    // 索书号检索入口 + 结果页面增强
    if ($(".left_column > .call_number_search").length > 0 || $(".left_column ul.hit_list h3:contains('索书号检索')").length > 0) {
        $(".call_number_search input:text").change(() => {
            // 表单索书号有变化，记录原生界面检索参数
            // 该事件函数也用于馆藏分类浏览的输入值同步，以便高亮检索结果命中项
            snapCallNumberSearch.searchdata1 = $(".call_number_search input#searchdata1").val().trim();
            // 写入油猴设置
            GM_setValue("OriginalCallNumberSearch_paramSnap", snapCallNumberSearch);
        });
        $(".call_number_search select").change(() => {
            // 表单下拉框有变化，记录原生界面检索参数
            $(".call_number_search select").each((ind, ele) => {
                snapCallNumberSearch.selects[$(ele).attr("name")] = $(ele).val();
            });
            // 写入油猴设置
            GM_setValue("OriginalCallNumberSearch_paramSnap", snapCallNumberSearch);
        });
        // 隐藏右栏“检索”面板，让右栏高度宽裕一些
        $right_column.find("div.itemservices").addClass("powerkit_original_block");

        // 中图法分类浏览检索面板
        $right_column.prepend(generateWebCatPanel("divCLCBrowser", "powerkit_block", "馆藏分类浏览"));
        // 分类树形显示列表
        $("#divCLCBrowser h3").after('<ul id="ulCLCTree"></ul>');
        $("#ulCLCTree").scroll(() => {
            // 获取分类树形容器的滚动位置，保存到油猴设置
            GM_setValue("CLCTreeScrollTop", $("#ulCLCTree").scrollTop());
        });
        // 关于分类法的简单提示
        $("#ulCLCTree").after('<span class="powerkit_source">以上分类表根据<a href="http://clc.nlc.cn/" target="_blank">《中国图书馆分类法》（第五版）</a>编制</span></div>');
        // 操作提示
        //$("#divCLCBrowser h3").after('<span>※ 点击「←」：浏览书目　※ 点击类目：展开/收起</span>');
        
        // 索书号检索表单
        $("#divCLCBrowser").append($("<form id='formCLCBrowser' target='_self' method='POST'></form>"));
        $("#formCLCBrowser").attr("action", "http://162.105.138.200/uhtbin/cgisirsi/x/%E5%8C%97%E5%A4%A7%E4%B8%AD%E5%BF%83%E9%A6%86/0/25");
        // 根据油猴设置，恢复 PK 界面分类浏览的用户输入参数
        // 如果油猴设置缺省，按先前初始化的来
        snapCLCBrowserForm = GM_getValue("CLCBrowserForm", snapCLCBrowserForm);
        // 原生界面的交互控件参数也改为隐藏式
        // 参数值通过增强界面的交互控件另行赋予
        $.each(snapCLCBrowserForm, (name, value) => {
            $("#formCLCBrowser").append($(`<input type='hidden' name='${name}' id='inputCLC_${name}' value='${value}' />`));
        });
        // 几组索书号检索的隐藏参数，根据原生检索界面的参数快照构建
        $.each(snapCallNumberSearch.hiddens, (name, value) => {
            $("#formCLCBrowser").append($(`<input type='hidden' name='${name}' value='${value}' />`));
        });

        // 中图法浏览限定控件（显示控件）
        // 这一组控件是经过精简的，间接控制隐藏表单和提交查询操作
        $("#divCLCBrowser h3").after($("<ul class='ulCLCFilters'><li class='liCLCSearchData'></li><li class='liCLCLangRadios'></li></ul>"));
        // 从油猴设置读取手动输入内容，缺省空串
        let manualSearchData = GM_getValue("CLCManualSearchData", "");
        if (manualSearchData == "") {
            // 无论是读取了空串还是缺省空串，只要是空串，就再从读取的隐藏表单获得索书号
            const inputCLC_searchdata1 = $("#inputCLC_searchdata1").val();
            // 隐藏表单索书号非空，则提纯
            manualSearchData = inputCLC_searchdata1 == "" ? "" : inputCLC_searchdata1.match(CLC.rePureClassTag)[0];
        }
        // 设置保存回去
        GM_setValue("CLCManualSearchData", manualSearchData);
        // 套一个表单，用于键盘回车 submit（但本 form 从来不真 submit）
        $(".liCLCSearchData").append($("<form></form>"));
        $(".liCLCSearchData form").append($(`<input type='text' name='searchdata1' value='${manualSearchData}' placeholder='分类号或类名关键词' />`))
                                  .append($(`<button type='submit' id='butSearchItemsByTag' title='输入类号，浏览馆藏图书'>类号查书</button>`))
                                  .append($("<button type='button' id='butSearchTagsByName' title='输入类名，搜索中图法类目'>类名搜索</button>"))
                                  .append($("<ul></ul>"));
        // 文本输入框：编辑变更
        $(".liCLCSearchData input:text").change((ev) => {
            // 获取并修剪当前输入文本
            const currentSearch = ev.target.value.trim();
            ev.target.value = currentSearch;
            // 保存到油猴设置
            GM_setValue("CLCManualSearchData", currentSearch);
            // 尝试按照用户输入内容跳转到树形显示中相应位置
            // 过程：第一次查不到，则从后往前逐个字符缩减了重试
            // 假定用户输入的索书号中的分类号可能很深入，例如 F832 超出 CLC.nodes 收录范围，当然查不到
            // 一次查不到时 seekCLCTreeByTag() 返回 false 则下次 trySeek 砍掉末尾字符
            // 例如 F832 砍到 F83 终于查到了，则返回 true 并终止循环
            // 也有可能从长到短都不会命中，循环了一遍最后啥也不做
            for (let trySeek = currentSearch;
                // 一旦长度归零，&& 后面调用函数就不会执行
                trySeek.length > 0 && !seekCLCTreeByTag(trySeek);
                // slice() 也适用截取字符串；始于开头位置（0），终于倒数第二位置（-1）
                trySeek = trySeek.slice(0,-1));
                // 无需循环体
        });
        // 文本输入框：获得焦点
        $(".liCLCSearchData input:text").focus((ev) => {
            // 如果类名搜索结果列表可见，模拟单击关闭按钮
            if ($(".liCLCSearchData form ul").css("display") != "none")
                $("#butSearchTagsByName").trigger("click");
        });
        // 类号查书按钮：单击
        $("#butSearchItemsByTag").click((ev) => {
            // 从显示控件的文本输入框获得 value 并修剪
            const currentManualSearchData = $(".liCLCSearchData input:text").val().trim();
            // 数据同步：隐藏表单的索书号、原生索书号检索框的索书号
            $("#inputCLC_searchdata1, #searchdata1").val(currentManualSearchData);
            // 保存油猴设置
            //【注意】不要据此保存其他 CLC 系列油猴设置！因为用户手动输入内容会产生干扰
            GM_setValue("CLCManualSearchData", currentManualSearchData);
            // 触发原生索书号检索框变更事件，保存输入值
            // 之所以要同步原生检索框，是为了高亮索书号检索结果
            $(".call_number_search input:text").trigger("change");
            // 提交查询（当前页面会刷新）
            $("#formCLCBrowser").submit();
            return false; // 阻止提交
        });
        // 类名搜索/关闭列表按钮：单击
        $("#butSearchTagsByName").click(() => {
            // 获得限定控件文本输入框内容
            const CLCNameKW = $(".liCLCSearchData input:text").val().trim();
            // 定位类目搜索结果列表
            const $CLCTagHitList = $(".liCLCSearchData form ul");
            if ($CLCTagHitList.css("display") != "none") {
                // 结果列表当前是打开显示的——
                // 隐藏（特效拉起）结果列表
                $CLCTagHitList.slideUp("normal", () => { // callback 确保先完成拉起，再清除内容
                    // “关闭列表”变为“类目搜索”
                    $("#butSearchTagsByName").text("类名搜索").removeClass("CLCTagHitList_ToClose");
                    // 清空结果列表
                    $CLCTagHitList.empty();
                });
            } else if (CLCNameKW.length > 1) {
                // 结果列表当前是关闭隐藏的，且关键词长度至少为 2——
                // “类目搜索”变为“关闭列表”
                $("#butSearchTagsByName").text("关闭列表").addClass("CLCTagHitList_ToClose");
                // 构造用于替换的匹配式
                const pattern = new RegExp(`(.*)(${CLCNameKW})(.*)`, "i"); // 不区分大小写
                // 将输入内容当作类名关键词，筛选匹配类目节点
                CLC.matchedNodesByName(CLCNameKW).forEach((node) => {
                    // 用类名关键词替换每个匹配类目节点名称，高亮其中的匹配部分
                    const highlightedNodeName = node.name.replace(pattern, "$1<strong>$2</strong>$3");
                    // 类目搜索结果列表新增一条
                    $CLCTagHitList.append($(`<li><strong class='CLCHitTag'>${node.tag}</strong><label>${highlightedNodeName}</label></li>`));
                    $CLCTagHitList.find("li:last").attr("title", "点击在分类表中查看：" + node.name)
                });
                // 每条命中类目结果：单击
                $CLCTagHitList.find("li").click((ev) => {
                    let $ele = $(ev.target);
                    // 容器嵌套会重复绑定事件，必须逐层测试，向下找到 .CLCHitTag 才能继续
                    if ($ele.find(".CLCHitTag").length == 0) {
                        $ele = $ele.parent();
                        if ($ele.find(".CLCHitTag").length == 0)
                            $ele = $ele.parent();
                    }
                    // 获取命中类目结果的类号
                    const nodeTag = $ele.find(".CLCHitTag").text();
                    // 滚动到树形显示中相应位置（尽量接近）
                    seekCLCTreeByTag(nodeTag);
                });
                if ($CLCTagHitList.find("li").length == 0) {
                    // 搜索不到任何结果
                    $CLCTagHitList.append("<li><strong class='CLCNoHitTag'>没有找到匹配的类目</strong></li>");
                    $CLCTagHitList.find("strong").click(() => { $("#butSearchTagsByName").trigger("click"); });
                }
                // 显示（特效拉下）结果列表
                $CLCTagHitList.slideDown();
            } else
                // 按钮文字提醒关键词太短
                $("#butSearchTagsByName").html("类名搜索：<em style='color: yellow;'>关键词太短啦</em>");
        });

        // 中图法排架语种选择：中文、西文、阿拉伯文
        $(".liCLCLangRadios").append("排架语种：");
        $.each({"C":"中文", "W":"西文", "A":"阿拉伯文"}, (token, text) => {
            $(".liCLCLangRadios").append($(`<label><input type='radio' value='中图法_${token}' name='class' /><strong>${text}</strong></label>`));
            // 迂回绑定 label 内的 strong 以免嵌套绑定事件
            $(".liCLCLangRadios strong").click((ev) => {
                // 隐藏表单：更改排架法
                snapCLCBrowserForm.class = $(ev.target).parent().find("input").val();
                // 同步数据：隐藏表单排架法、原生索书号检索排架法下拉框
                $("#inputCLC_class, #class").val(snapCLCBrowserForm.class);
                // 保存到油猴设置
                GM_setValue("CLCBrowserForm", snapCLCBrowserForm);
            });
        });
        // 恢复排架法选择
        $(`.liCLCLangRadios input[value='${snapCLCBrowserForm.class}']`).attr("checked", true);

        // 快捷按钮：收起全部类目
        $("#ulCLCTree").append($("<div class='divCloseAllLines' title='收起所有每一级展开的类目'>收起全部类目</div>"));
        // 点击即可收起所有已经打开的类目
        $("#divCLCBrowser .divCloseAllLines").click(() => {
            // 删除 2 级子类列表（更深的自然也没了），保留 1 级（A-Z）
            $("#ulCLCTree .CLCTreeLevel_1_ > ul").remove();
            // 删除节点样式标记
            $("#ulCLCTree .CLCNode").removeClass("routerNode");
            $("#ulCLCTree .CLCNode").removeClass("clickedNode");
            // 清空重置最后点击节点、已展开节点、垂直滚动位置
            snapCLCLastClickedNodeTag = "";
            snapCLCUnfoldedNodeTags = {};
            snapCLCTreeScrollTop = 0;
            // 保存清空重置的设置
            GM_setValue("CLCLastClickedNodeTag", snapCLCLastClickedNodeTag);
            GM_setValue("CLCUnfoldedNodeTags", snapCLCUnfoldedNodeTags);
            GM_setValue("CLCTreeScrollTop", snapCLCTreeScrollTop);
            // 隐藏自己
            $("#divCLCBrowser .divCloseAllLines").slideUp();
        });
        
        // 分类树形显示初始化，插入隐藏的根节点
        $("#ulCLCTree").append("<li class='CLCTreeLevel_0_'><button type='button' value='__root__'></button><label class='CLCNode' title='中图法类目'><strong class='CLCNodeTag'></strong><span class='CLCNodeName'></span></label></li>");
        // 从根节点开始，装载显示第一级类目
        loadChildListByTag("__root__");
        // 根据读取的设置，装载显示其他已展开节点的子类节点
        // 字典实际上是数组，有顺序，不用担心上级类目没有装载时就要装载下级类目
        Object.keys(snapCLCUnfoldedNodeTags).forEach((tag) => {
            loadChildListByTag(tag);
        });

        // 恢复分类树形显示的节点样式：途经点、最后点击
        if (snapCLCLastClickedNodeTag != "") {
            // 根据读取的设置，获取上次最后点击的节点 .CLCNode
            const $lastClickedCLCNode = $(`#ulCLCTree button[value='${snapCLCLastClickedNodeTag}']`).next();
            // 标记全部上级途径节点
            markRouterCLCNode($lastClickedCLCNode);
            // 标记当前点击节点
            $lastClickedCLCNode.addClass("clickedNode");
        } // 如果不存在设置，什么都不用做

        // 如果装载了至少一个二级类目列表，就需要显示“收起全部类目”按钮
        if ($("#ulCLCTree .CLCTreeLevel_1_ > ul").length > 0)
            $("#divCLCBrowser .divCloseAllLines").slideDown();

        // 根据已读取的油猴设置，恢复滚动位置
        // 延时，否则还没装载完就设置，会失效，不会发生滚动
        const timerCLCTreeScrollTop = 1200;
        setTimeout(() => { $("#ulCLCTree")[0].scrollTop = snapCLCTreeScrollTop; }, timerCLCTreeScrollTop);
    }

    //////////////////////////////////////////////////////////////////////////
    // 后续通用界面
    // 专用界面构造完毕后才能追加
    // 1）帮助信息
    // 2）…… //TODO

    //////////////////////////////////////////////////////////////////////////
    // 右栏面板显示不同业务功能的帮助信息
    // 存储帮助信息
    // key: idManPK // 缺省值 GENERAL 表示当前业务不存在 PK 增强功能
    // heading: 标题（会自动套入 h4 标签）
    // items: 内容项目（用于 ol 有序列表），支持 HTML 标签，可添加 a 链接、h5 小标题、下级 ol 或 ul 列表等。
    const aoaManPK = {
        "GENERAL": {
            heading: "欢迎使用馆藏目录网页增强工具箱！",
            items: [
                "本软件通过『<a target='_blank' href='https://greasyfork.org/'>用户脚本</a>』功能实现，旨在无需改变服务器端软件功能的前提下，调整网页样式，提供便捷功能，升级用户体验。",
                "<h5>特色功能</h5><ol>"
                + "<li>题名级馆藏报表：方便快捷选取检索结果，利用馆藏报表提取并下载书目数据的电子表格，还可以临时收藏在浏览器中。</li>"
                + "<li>馆藏卡片页：一键复制书目详细信息，随手抄录临时索书清单（保存在浏览器），还可排序并导出下载。</li>"
                + "<li>读者服务：借出图书、续借界面改善，一键选中最近到期日期，一键导出当前借阅书单。</li>"
                + "<li>索书号检索：改善检索和浏览体验，提供馆藏分类查询功能（中图法）。</li>"
                + "<li>会话超时前自动刷新，尽量保持操作体验连续（受网页休眠影响，不总有效）。</li>",
                "</ol>点击本版块上方『启用增强功能』复选框，用户可以随时关闭、开启以上所有的增强功能界面。",
                "相关脚本设置和部分用户数据保存在浏览器中。关闭增强功能界面时，可以找到清空全部本机设置的按钮。"
            ]},
        "馆藏卡片页": {
            heading: "【馆藏卡片页】增强界面使用指南",
            items: [
                "所谓『卡片页』就像传统目录中的一张卡片，提供馆藏书目的详细信息。",
                "<h5>复制书目详细信息</h5>将当前馆藏的机读目录数据复制到系统剪贴板。可从选项中切换为『非格式化』（是），获取 MARC 数字式字段名称。",
                "<h5>索书清单</h5>将馆藏位置、索书号、题名、著者等信息抄录到右栏的『临时索书清单』中，然后排序，导出为表格等，方便读者寻找、借阅书刊。该临时清单保存在浏览器中，可跨目录页面保留。可以逐条或全部清空。"
            ]},
        "检索结果列表" :{
            heading: "【检索结果列表】增强界面使用指南",
            items: [
                "增加了快速选择检索结果的几个按钮，位于列表的上方和下方。",
                "『全选』按钮：快速选中当前页面内所有结果。",
                "『反选』按钮：快速反向选择每一个结果，即凡是没选的，变为选中，凡是已选的，变为不选。",
                "『全消』按钮：快速取消选择当前页面内所有结果。随即弹出对话框，点击『确定』才会执行。",
                "顺便增设『保存已选取的检索结果』按钮，与绿色导航栏的『打印/邮寄/保存』链接功能一致，方便前往下一环节，以便将选取的检索结果用于生成题名级馆藏报表。"
            ]},
        "打印邮寄保存": {
            heading: "【保存检索结果】增强界面使用指南",
            items: [
                "这里可看作题名级馆藏报表页的准备环节，可预览当前会话临时保存的已选取题名记录，删除不需要的题名记录。",
                "<h5>右侧『记录查看』单选框</h5>请从『ALL/完全/简略』中选择一种类型的报表。推荐使用 PK 界面默认的 ALL 报表（可包含馆藏目录链接）。",
                "点击『查看』按钮后，进入题名级馆藏报表页面。"
            ]},
        "题名级馆藏报表": {
            heading: "【题名级馆藏报表】增强界面使用指南",
            items: [
                "先前已选取的检索结果，现在提供除原始报表文本之外的表格格式文件下载。",
                "<h5>制表符分隔值（TSV）</h5>一种格式化的文本文件，字段之间以水平制表符分隔，可复制、粘贴到电子表格内继续处理。",
                "<h5>Excel 表格</h5>如果连接了校园网网关，可直接生成 .xlsx 电子表格工作簿。推荐使用！",
                "点击『原始文本』标签页，可以预览和下载原始的报表文本，供参考、检验和获取全部原始报表数据。",
                "【注意】必须选择一个馆别（默认：北大中心馆）。所得表格文件中的索书号字段，仅列出所选馆别的索书号，不能同时显示其他馆别的索书号。",
                "由报表文本生成的表格数据，可能存在乱码、缺漏、错位，仅供参考。请谨慎使用！"
            ]},
        "借出": {
            heading: "【用户状态查询：借出】增强界面使用指南",
            items: [
                "<h5>一键查询馆藏目录</h5>根据索书号查询（浏览）北大中心馆的书目信息。注意：仅支持中图法排架浏览，需要用户自行区分选择中文、西文语种（独立排架）。索书号浏览不同于一般的馆藏检索，不能精准定位，需要用户在结果序列中再次找寻。结果仅供参考。其他排架法只能另行手动查询，建议使用一般的快速检索或高级检索功能。",
                "<h5>高亮最近到期</h5>所有最近到期的馆藏，用鞍褐色 (saddle brown) 文字标明。",
                "<h5>高亮状态异常</h5>催还、超期的馆藏，用亮珊瑚红色 (light coral) 背景标明。",
                "<h5>调整书单字段</h5>隐藏“目前积欠款项”（当前政策：超期不罚款），删节到期/催还日期中的时间（23:59）。",
                "<h5>一键导出借出书单</h5>下载 TSV（制表符分隔值）文本格式或 Excel 电子表格文件（后者需连接校园网 IP 网关），获得当前借出书单。其中包含索书号、题名与责任者、（单独的）著者字段、到期日期、催还日期、异常状态等字段。"
            ]},
        "续借": {
            heading: "【续借】增强界面使用指南",
            items: [
                "<h5>快速全选最近到期</h5>点击该复选框，立刻选中所有最近到期的馆藏项目。已经催还、超期的不会选中，因为无法续借。另外增加一个“全选”，方便全选后剔除不需要续借的个别项目。",
                "<h5>高亮最近到期</h5>所有最近到期的馆藏，用鞍褐色 (saddle brown) 文字标明。",
                "<h5>高亮状态异常</h5>催还、超期的馆藏，用亮珊瑚红色 (light coral) 背景标明。",
                "<h5>调整清单字段</h5>增加复本条码、索书号字段，隐藏单独的著者字段，删节到期/催还日期中的时间（23:59）。",
                "<h5>一键导出待续借清单</h5>下载 TSV（制表符分隔值）文本格式或 Excel 电子表格文件（后者需连接校园网 IP 网关），获得当前待续借清单。其中包含复本条码、索书号、题名与责任者、（单独的）著者字段、到期日期、催还日期等字段。"
            ]},
        "索书号结果": {
            heading: "【索书号检索】增强界面使用指南",
            items: [
                "<h5>增设检索框</h5>无需返回检索入口，随时调整索书号检索参数，并临时记忆检索参数。馆别、馆藏位置下拉选择框重新按汉语拼音排序，方便挑选。",
                "<h5>增设翻页链接</h5>除上方绿色导航条外，在结果上下增加方便翻页浏览的按钮。",
                "<h5>高亮命中结果</h5>匹配索书号的检索结果，高亮匹配馆藏项目和索书号关键词。",
                "<h5>馆藏分类浏览</h5>根据图书馆主要采用的《中国图书馆分类法》（第五版）部分常见类目，分级展开并便捷浏览馆藏书刊。可按类目名称反查分类号。"
            ]},
        "索书号入口": {
            heading: "",
            items: [
                "<h5>馆藏分类浏览</h5>根据图书馆主要采用的《中国图书馆分类法》（第五版）部分常见类目，分级展开并便捷浏览馆藏书刊。",
                "<h5>其他索书号检索增强功能</h5>详见索书号检索结果。"
            ]}
    };
    // 显示帮助信息
    // h4: 标题
    // ol > li: 内容项目
    // 注意反引号格式化字符串
    $("#ulPowerKit").append(`<li class='powerkit_block' id='liManPK'><h4>${aoaManPK[idManPK].heading}</h4><ol></ol></li>`);
    aoaManPK[idManPK].items.forEach((item) => {
        $("#liManPK > ol").append($(`<li>${item}</li>`));
    });

    //////////////////////////////////////////////////////////////////////////
    // 【函数】根据“启用增强功能”复选框值，显示或隐藏相关界面
    function refreshPKEnhancementVis() {
        // 保存设置：在本机记住当前（新）选择
        let wannaShow = $("#chkPKEnhancements").attr("checked");
        GM_setValue("WannaShow", wannaShow);
        console.log("GM_setValue('WannaShow',", wannaShow + "); // 保存设置：" + (wannaShow ? "启用" : "停用"));

        // 显示/隐藏 PK 界面/原生界面
        // body.powerkit_OFF 统辖其他具体控件凡添加 powerkit_block/inline 类的显示效果（令 PK 的隐藏，原生的重新显示）
        if (wannaShow)
            $(document.body).removeClass("powerkit_OFF");
        else
            $(document.body).addClass("powerkit_OFF");
       
        // 启动/停止右栏的跟随滚动特性
        // 先获取保留右栏 PK 面板的初始垂直位置，以后跟随浮动了就不是初始值了
        var initPanelTop = $("#divPowerKit").offset().top;
        if (wannaShow)
            // 显示 PK 界面时，绑定窗口滚动事件
            $(window).bind("scroll", () => {
                // 检测文档滚动位置，判断是否启动跟随特性
                // 当前滚动位置到文档顶部的距离
                let scrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
                // 如果超过右栏面板的初始垂直位置就浮动跟随，否则恢复
                if (scrollTop > initPanelTop)
                    $("#divPowerKit").addClass("floatingRightPanel");
                else
                    $("#divPowerKit").removeClass("floatingRightPanel");
            });
        else {
            // 要隐藏 PK 界面，则同时解绑(上述)滚动事件，并立刻直接关闭浮动跟随定义类（不然有可能行为怪异）
            $(window).unbind("scroll"); //DEBUG 曾试图先在 if 结构外 function 定义有名函数，在 bind/unbind 中指名，但发现绑定/解绑行为异常，只好解绑所有 onScroll 事件了（应该没什么别的）
            $("#divPowerKit").removeClass("floatingRightPanel");
        }

        // 浏览器外围显示增强
        if (wannaShow) {
            // 网页标题增加全局名称标志
            document.title += " | 北大馆藏目录 +PK";
            // 设置浏览器标签页图标为图书馆主页图标（能立刻生效）
            $("head").append($('<link rel="shortcut icon" href="https://www.lib.pku.edu.cn/portal/sites/default/files/favicon.ico" type="image/vnd.microsoft.icon">'));
            
        } else {
            // 恢复原生界面的网页标题
            document.title = originalDocumentTitle;
            // 删除浏览器标签页图标——不会立刻生效，但至少下次刷新后不会看到任何标签页图标
            $("head link[rel='shortcut icon']").remove();
        }
    }
    // 增强界面已经构造完毕，现在根据是否启用的设置，刷新显示或隐藏
    // 假如不存在右边栏设置控件……早就 return 退出了，走不到这一步
    refreshPKEnhancementVis(); // 复选框控件的事件当然也会关联该函数
    console.log("GM_listValues()", GM_listValues());
    GM_listValues().forEach((key, indexNum) => {
        console.log(indexNum, `GM_getValue("${key}")`, GM_getValue(key));
    });
    
    console.log("------ WebCatPK: Loading Completed ------")


})(jQuery);


// EOF