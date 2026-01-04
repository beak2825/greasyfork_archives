// ==UserScript==
// @name         Bing导航
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       SunQipeng
// @match        https://cn.bing.com/*
// @match        https://www.bing.com/*
// @match        https://www2.bing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377140/Bing%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/377140/Bing%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var bing_data={
        rows: [
            {
                title: '影视',
                nodes: [
                    {title: "loldytt",icon: "https://www.dytt789.com/favicon.ico",url: "http://www.dytt789.com/"},
                    {title: "电影天堂",icon: "https://www.dytt8.net/favicon.ico",url: "http://www.dytt8.net/"},
                    {title: "斗鱼",icon: "https://www.douyu.com/favicon.ico",url: "https://www.douyu.com/"},
                    {title: "哔哩哔哩",icon: "https://www.bilibili.com/favicon.ico",url: "https://www.bilibili.com/"}
                ]
            },
            {
                title: '购物',
                nodes: [
                    {title: "淘宝网",icon: "https://ss3.bdstatic.com/iPoZeXSm1A5BphGlnYG/icon/95487.png",url: "http://www.taobao.com/"},
                    {title: "京东商城",icon: "https://www.jd.com/favicon.ico",url: "https://www.jd.com/"},
                    {title: "天猫",icon: "https://www.tmall.com/favicon.ico",url: "https://www.tmall.com/"},
                    {title: "",icon: "",url: ""}
                ]
            }
          ]
    };
    var tb = "";
    for(var i=0;i<bing_data.rows.length;i++){
        var row = bing_data.rows[i];
        console.log(row.title);
        tb+=("<tr><td><label style='font-weight:bold;color:#333'>"+row.title+"</label></td>");
        for(var j=0;j<row.nodes.length;j++){
            var node = row.nodes[j];
            if(node.title==="") {tb+="<td></td>";continue;}
            tb+=("<td><a href='"+node.url+"' target='_blank'><img height='16px' width='16px' src='"+node.icon+"'>"+node.title+"</a></td>");
        }
        tb+="</tr>";
    }
    var pointCut = document.createElement("div");
    document.getElementById("sbox").appendChild(pointCut);
    var html = [
        '<table id="intb">',
        tb,
        '</table>',
        '<style>#intb{width:100%;margin:100px 0 15px 0;border:0;}#intb td {border-bottom: 1px solid #ccc;border-width:1px;height: 38px;}#intb tr {border: 1px solid #ccc;}#intb td img {vertical-align: bottom;padding-right: 3px;}</style>'
    ].join("");
   pointCut.innerHTML=html;
})();