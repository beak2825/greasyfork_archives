// ==UserScript==
// @name           紫荆网种子点赞神器！
// @namespace      https://greasyfork.org/zh-CN/users/5433-hsinchu
// @version        2.4
// @description    仅用于紫荆种子点赞
// @include        http://zijingbt.njuftp.org/index.html*
// @copyright      2017+, Lumin
// @downloadURL https://update.greasyfork.org/scripts/28579/%E7%B4%AB%E8%8D%86%E7%BD%91%E7%A7%8D%E5%AD%90%E7%82%B9%E8%B5%9E%E7%A5%9E%E5%99%A8%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/28579/%E7%B4%AB%E8%8D%86%E7%BD%91%E7%A7%8D%E5%AD%90%E7%82%B9%E8%B5%9E%E7%A5%9E%E5%99%A8%EF%BC%81.meta.js
// ==/UserScript==


var thxing = false;
var table_tool=document.getElementsByClassName("top_header")[0];
//var td_tools=table_tool.getElementsByTagName("td");
//var td_tool=td_tools[td_tools.length - 1];
//var tr_tool=td_tool.parentNode;
var id_list = [];

function analysis(){
    var tds = document.getElementsByClassName("index_name");
    for(var i = 0; i < tds.length; i++) {
        var node = tds[i].getElementsByTagName("a")[0];
        var link = node.href;
        if(link !== undefined) {
            var id = link.substr(link.indexOf('?')+4); // 示例，'?id=10289'
            id_list.push(id);
        }
    }
    if(id_list.length !== 0) {
        thxloop = setInterval(thanks_curr_page,100);
    }
}

function thanks_curr_page() {
    var total_count = id_list.length;
    if(total_count === 0) {    //数组已为空
        clearInterval(thxloop);
        alert("该页种子已全部点赞！O(∩_∩)O哈哈~");
        location.reload();  //本页面刷新
        return;
    }
    if(thxing)  return;     //如果前一个赞没有完成不会进行新的赞
    thxing = true;
    var tid = id_list.pop();
    var query = "/stats.html?&thanks=1&id=" + tid;
    xmlhttp.open("GET",query,false);
    xmlhttp.send();
    if(xmlhttp.status != 200) {
        console.log("error:" + tid);
    }
    thxing = false;
}

//<td class="navbar"><a class="navbar_staff" title="点赞" href="#">点赞</a></td>

var zijingsi = setInterval(function(){
    var tr_tool=document.querySelector("table.top_header > tbody > tr.top_navbar > td > div > table > tbody > tr"); //节点的copy selector操作，时有时无的= =!是几个意思！document.ready才行么...
    if(tr_tool) {
        clearInterval(zijingsi);
        var td_ele = document.createElement("td");
        td_ele.setAttribute("class","navbar");

        var zangNode=document.createElement("a");
        zangNode.setAttribute("class","navbar_staff");
        zangNode.setAttribute("title","点赞");
        zangNode.setAttribute("href", "#");
        zangNode.innerText="CLICK ME！开始点赞吧！";
        zangNode.onclick=analysis;

        td_ele.appendChild(zangNode);               //伪装成顶层一个标签= =!这样就不用自己刷样式了，嘻嘻
        tr_tool.appendChild(td_ele);
    }
},200);