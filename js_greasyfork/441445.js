// ==UserScript==
// @name         PT站 HDsky 海报插件
// @namespace    https://www.hdsky.me/
// @version      3.2.3
// @license      3.2.3
// @description  HDsky海报墙
// @author       Howard QQ群:924099912，我在群里面
// @match        *://hdsky.me/*
// @match        https://www.pthome.net/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/441445/PT%E7%AB%99%20HDsky%20%E6%B5%B7%E6%8A%A5%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/441445/PT%E7%AB%99%20HDsky%20%E6%B5%B7%E6%8A%A5%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css1 = '.imgUI:hover{ cursor: crosshair; transform: scale(12) translateY(-46%) translateX(47.3%); } .imgUI{ transition: all 0.16s; }'; // 创建海报放大动画style
    var style1 = document.createElement('style');
    if (style1.styleSheet) {
        style1.styleSheet.cssText = css1;
    } else {
        style1.appendChild(document.createTextNode(css1));
    }
    document.getElementsByTagName('head')[0].appendChild(style1); // 注入海报放大动画style到head头部
    document.querySelectorAll("body")[0].style.backgroundColor = "#F1DDD2" // body颜色
    document.querySelectorAll("body")[0].style.backgroundImage = "linear-gradient(to right, rgb(253,247,216), rgb(211,155,194))" // body颜色
    document.getElementsByClassName("mainouter")[0].style.backgroundColor = "#00000000" // 面板颜色
    document.getElementsByClassName("mainouter")[0].style.backgroundImage = "linear-gradient(to right, rgb(250, 234, 250), rgb(232, 248, 246))" // 载体颜色
    document.getElementsByClassName("menu")[0].style.backgroundColor = "#00000000" // 菜单栏颜色
    document.querySelectorAll("table#info_block")[0].style.backgroundColor = "#F9EFD6" // 信息栏颜色（大框）
    document.querySelectorAll("table#info_block")[0].querySelectorAll("table")[0].style.backgroundColor = "#F9EFD6" // 信息栏颜色 （小框）
    document.getElementsByClassName("main")[0].style.backgroundColor = "#00000000" // 载体颜色（上框）
    document.getElementsByClassName("main")[1].style.backgroundColor = "#00000000" // 载体颜色（下框）
    document.querySelectorAll("table.searchbox")[0].style.backgroundColor = "#F9EFD6" // 搜索箱颜色（大框）
    document.querySelectorAll("table.searchbox")[0].querySelectorAll("tbody#ksearchboxmain")[0].querySelectorAll("table")[0].style.backgroundColor = "#F9EFD6" // 搜索箱颜色（小框）
    document.querySelectorAll("table.searchbox")[0].querySelectorAll("tbody#ksearchboxmain")[0].querySelectorAll("table")[1].style.backgroundColor = "#F9EFD6" // 搜索箱颜色（小框）
    document.querySelectorAll("table.searchbox")[0].querySelectorAll("tbody")[4].querySelectorAll("table")[0].querySelectorAll("tbody")[0].style.backgroundColor = "#F9EFD6" // 搜索箱颜色（小框）
    var i1 = 0
    title1(i1);
    function title1(i1) {
        try { // 尝试
            document.querySelectorAll("td.colhead")[i1].style.backgroundColor = "#429CE3" // 蓝色标题栏
            document.querySelectorAll("td.colhead")[i1].querySelectorAll("a")[0].style.backgroundColor = "#429CE3" // 蓝色标题栏字体背景
        }
        catch (e) {
            return i1; // 异常抛出
        }
        finally { // 尝试结束，最后执行
            i1++;
            if (i1 < 11) {
                title1(i1);
            }
            else {
                return i1;
            }
        }
    };

    // document.getElementsByClassName("embedded")[0].style.backgroundColor = "#FAEAFA00"
    // document.getElementsByClassName("embedded")[1].style.backgroundColor = "#FAEAFA00"

    var num1 = document.querySelectorAll('.torrentname').length; // 页面种子数量
    var i=0;
    function replaceUI(i){
        //titleUIUI(i);  // 添加电影名（涉及爬虫，响应速度很慢，建议不用这个功能）
        function titleUIUI(i){
            var torrentpage = document.querySelectorAll('.torrentname')[i].querySelectorAll('tr')[0].querySelectorAll('a')[0].href; // 获取种子子页面
            var url = torrentpage; //设置查询字符串
            var xhr = new XMLHttpRequest(); //实例化XMLHttpRequest 对象
            xhr.open("GET", url, false); //建立连接，要求同步响应
            xhr.setRequestHeader ('Content-type', 'application/x-www-form-urlencoded'); //设置为表单方式提交
            xhr.send("callback=functionName"); //发送请求
            //console.log(xhr.response); //接收数据
            var res = xhr.response; // 读取html文本
            var parser=new DOMParser(); // 新建DOM函数
            var htmlDoc=parser.parseFromString(res,"text/html"); // html文本 转 document
            var tds1 = htmlDoc.getElementById("dbdl"); // 筛选
            var name1 = tds1.querySelectorAll("dd")[0].outerHTML; // document 转 文本
            var name2 = tds1.querySelectorAll("dd")[1].outerHTML;
            var name3 = tds1.querySelectorAll("dd")[2].outerHTML;
            var name1 = name1.replace(/<dd>/i,"<dd style=\"margin: auto;font-weight:bold;\">");
            var name2 = name2.replace(/<dd>/i,"<dd style=\"margin: auto;font-weight:bold;\">");
            var tds = tds1.outerHTML;
            console.log(tds1);
            console.log(name1);
            var title2 = document.querySelectorAll('.torrentname')[i].querySelectorAll('tr')[0]; // 提取种子的标题框架的第一个tr字典
            var titleUI2 = title2.innerHTML; // 提取字典的innerHTML值
            title2.innerHTML = "<td style=\"padding: 0%;width: 150px;height: 152px;text-align: center;\">"+name1+"<br>"+name2+"<br>"+"</td>"+titleUI2; // 注入海报到innerHTML
        }



        var torrentpage = document.querySelectorAll('.torrentname')[i].querySelectorAll('tr')[0].querySelectorAll('a')[0].href;
        var doubanurl = document.querySelectorAll('.torrentname')[i].querySelectorAll('.embedded')[1].querySelectorAll('.embedded')[0].querySelectorAll('a')[0].href; // 提取豆瓣网址
        var reg = /[1-9][0-9]*/g; // 定义数字
        var doubanID = doubanurl.match(reg); // 提取豆瓣网址数字ID
        var doubanimg = 'https://hdsky.me/doubanimg/d'+doubanID+'.jpg'; // 制作海报网址
        // var douban = document.querySelectorAll('.torrentname')[i].querySelectorAll('.embedded')[1].querySelectorAll('.embedded')[0].querySelectorAll('a')[0]; // hdsky 提取豆瓣评分图标
        // douban.innerHTML = "<img src=\""+doubanimg+"\" height=\"40%\" width=\"40%\">";
        var title1 = document.querySelectorAll('.torrentname')[i].querySelectorAll('tr')[0]; // 提取种子的标题框架的第一个tr字典
        var titleUI = title1.innerHTML; // 提取字典的innerHTML值
        title1.innerHTML = "<td style=\"padding:0px 10px 0px 0px;;width: 22.95px;height: 34px;border:none;\"><a><img class=\"imgUI\" style=\"border-radius: 2px;box-shadow: 3px 3px 8px #3f3f3f;\" src=\""+doubanimg+"\" height=\"100%\" width=\"100%\"></a></td>"+titleUI; // 注入海报到种子框架
        document.getElementsByClassName("progresstr")[i].style.backgroundColor = "#F9EFD6" // 种子框架颜色
        document.getElementsByClassName("stickbg progresstr")[i].style.backgroundImage = "linear-gradient(to right, #CED8F0, #CED8F0)" // 置顶种子框架颜色
        // document.querySelectorAll('.torrentname')[i].querySelectorAll('td')[1].style.textAlign = "center"
        // document.getElementsByClassName("progresstr")[i].querySelectorAll('table.torrentname')[0].querySelectorAll('td.embedded')[0].style.padding = "4pt"
        // document.querySelectorAll('.torrentname')[i].querySelectorAll('td')[1].style.fontWeight = "bold" // 种子标题字体加粗
        //document.querySelectorAll('.torrentname')[i].querySelectorAll('td')[1].style.fontSize = "4pt" // 中文标题
        //document.querySelectorAll('.torrentname')[i].querySelectorAll('td')[1].querySelectorAll('b')[0].style.fontSize = "5pt" // 英文标题
        var u=0;
        var uL = document.querySelectorAll('.torrentname')[i].querySelectorAll('td')[1].querySelectorAll('span').length;
        runUI1(u,i,uL);
        function runUI1(u,i,uL){
            try { // 尝试
                //document.querySelectorAll('.torrentname')[i].querySelectorAll('td')[1].querySelectorAll('span')[u].style.fontSize = "5pt" // 彩色标签字体大小
                //document.querySelectorAll('.torrentname')[i].querySelectorAll('td')[1].querySelectorAll('span')[u].style.fontWeight = "normal" // 彩色标签字体大小粗细
            }
            catch (e) {
                return u; // 异常抛出
            }
            finally{ // 尝试结束，最后执行
                u++;
                if (u<uL){
                    runUI1(u,i,uL);
                }
                else{
                    return u;
                }
            }
        };
    };
    function runUI(i){
        try { // 尝试
            replaceUI(i);
        }
        catch (e) {
            return i; // 异常抛出
        }
        finally{ // 尝试结束，最后执行
            i++;
            if (i<num1){
                runUI(i);
            }
            else{
                return i;
            }
        }
    };
    runUI(i);

})();