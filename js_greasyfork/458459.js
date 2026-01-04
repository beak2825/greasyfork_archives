// ==UserScript==
// @name         NTKO办公OA优化企业快讯管理页
// @namespace    https://penicillin.github.io/
// @version      2024.11.07
// @description  将标题列表栏由编辑功能改为浏览功能
// @author       Penicillinm
// @match        http://192.168.1.65/SubModule/News/NewsBackList.aspx?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458459/NTKO%E5%8A%9E%E5%85%ACOA%E4%BC%98%E5%8C%96%E4%BC%81%E4%B8%9A%E5%BF%AB%E8%AE%AF%E7%AE%A1%E7%90%86%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/458459/NTKO%E5%8A%9E%E5%85%ACOA%E4%BC%98%E5%8C%96%E4%BC%81%E4%B8%9A%E5%BF%AB%E8%AE%AF%E7%AE%A1%E7%90%86%E9%A1%B5.meta.js
// ==/UserScript==

function formatDate(dateStr){
    var tempStr=dateStr.split('/');
    return tempStr[0]+'年'+tempStr[1]+'月'+tempStr[2]+'日';
}
/**
//拆分表格标题行
let titleNode = document.getElementById('gvRegulationsList');
if (titleNode != null){
    titleNode.getElementsByTagName('th')[5].setAttribute('colspan','3')
}
**/
let node='';
let dateArray=[];
let tempEl='';
let MoonFlag='';
let tempYM='';
for(var i=2;i<17;i++){
    document.getElementById('gvRegulationsList_ctl'+(i<10?'0'+i:i)+'_lblLSSUC').parentElement.style.borderLeft='3px solid #3899ff';//左定界加粗蓝边框

    tempEl=document.getElementById('gvRegulationsList_ctl'+(i<10?'0'+i:i)+'_lblread')
    tempEl.nextElementSibling.remove();//移除“清空已阅”
    tempEl.remove();//移除“查看结果”

    node=document.getElementById('gvRegulationsList_ctl'+(i<10?'0'+i:i)+'_lbltitle');
    if (node == null){break;};
    //更换链接
    node.innerHTML=node.innerHTML.replace('NewsEdit.aspx','NewsDetail.aspx').replace('action=edit','');

    //清理拟稿人空格
    node.parentNode.nextSibling.innerHTML=node.parentNode.nextSibling.innerHTML.trim();

    //清理序号空格
    node.parentElement.parentElement.firstElementChild.innerHTML=node.parentElement.parentElement.firstElementChild.innerHTML.trim();

    //补全标题
    node.getElementsByTagName('a')[0].innerHTML=node.getAttribute('title');

    //拆分发布时间
    /*
    tempEl=node.parentNode.nextSibling.nextSibling;
    tempEl.parentNode.insertBefore(tempEl.cloneNode(true),tempEl);//保留原格式
    dateArray=tempEl.innerHTML.split(' ');//把内容按空格拆分为日期和时间数组
    tempEl.innerHTML=formatDate(dateArray[0]);
    tempEl.parentNode.insertBefore(tempEl.cloneNode(true),tempEl.nextSibling);
    tempEl.nextSibling.innerHTML=dateArray[1];
    */

    node.parentNode.nextSibling.nextSibling.style.borderRight='3px solid #3899ff';//右定界加粗蓝边框

    tempYM=node.parentNode.nextSibling.nextSibling.innerHTML.split(' ')[0].match(/^([^\/]*\/[^\/]*)\//)[1];// 提取四位数年份和月份
    if (MoonFlag !=''){
        if (MoonFlag != tempYM){
            node.parentElement.parentElement.style.boxShadow='red 0px -1px 0px';// 为月份间加线分隔
        }
    }
        MoonFlag = tempYM;
}

//翻页工具栏表格样式

document.getElementById('PageBar1_plPage').getElementsByTagName('table')[0].removeAttribute('style');

//创建样式表
var myStyle = document.createElement('style') 
document.head.appendChild(myStyle)

//更改已访问链接为黑色
myStyle.innerHTML="a:visited { color: black; }"
//翻页样式
myStyle.append('.table_Conference{width: max-content;}');//去掉搜索背景色
myStyle.append('#PageBar1_plPage {position: fixed; right: 0px; top: 43px; width: max-content; background-color: rgba(139, 230, 230, 0.53);}');//把翻页工具栏浮动并定位
myStyle.append('#PageBar1_lblCurrPage {font-size: 20px;  font-weight: bold;  font-style: italic;color: #c115ff;  text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;}');//改变翻页工具当前页面数值栏样式
myStyle.append('#PageBar1_plPage a {display:inline-block;padding:1px 5px; border: 1px solid #666;border-radius:5px;}')//改变翻页工具栏链接样式
