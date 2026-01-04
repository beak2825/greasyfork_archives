// ==UserScript==
// @name         DouBan
// @namespace    http://tampermonkey.net/
// @version      4.20.191007.1
// @description  这个脚本已经失效了，不要再安装，现在找不到稳定的BT源。而且在线播放也更加方便。
// @author       laohoo
// @match        https://movie.douban.com/subject/*
// @connect      www.zhongzilou.com
// @connect      bt.ituoniao.com.cn
// @run-at       document-idle
// @grant        GM.xmlHttpRequest

// @downloadURL https://update.greasyfork.org/scripts/368397/DouBan.user.js
// @updateURL https://update.greasyfork.org/scripts/368397/DouBan.meta.js
// ==/UserScript==


/************************** 一些说明 *****************************

*  头部元数据 说明：
*        // ==UserScript==    脚本的头部开始
*        // @name         脚本名称，可省略
*        // @namespace    名字空间，这个一般写自己网站的域名，也可以是其他任意内容
*        // @version      脚本的版本号，上传到脚本网站后，通过比较版本号来升级脚本
*        // @description  脚本描述，一般简要地描述该脚本的功能
*        // @author       作者
*        // @match        脚本的适用网址，可以使用通配符，每个网址占一行
*        // @include      与   // @match  功能等价的另一种写法
*        // @exclude      脚本的排除网址，该网络不执行脚本，可以使用通配符，每个网址占一行
*        // @connect      使用 GM.xmlHttpRequest 进行数据传输的 目标网站，缺少时第一次调用该功能会有是否允许连接的选项，每个网站写一行
*        // @run-at       在什么时候开始执行脚本，"document_idle"表示在"document_end"与触发window.onload事件之间的某个时间
*        // @grant        用于声明在脚本中使用到的 GreaseMonkey API，例如：GM.xmlHttpRequest
*        // ==/UserScript==   脚本的头部结束
*
************************** 分隔线 *****************************

*  脚本大概思路介绍 ：
*  1、从豆瓣电影中获取 电影的中文名字
*  2、从磁力链搜索网络获取 该电影的搜索结果页
*  3、提取搜索结果中的相关信息，如电影标题、文件大小、磁力链等
*  4、在电影海报下方插入表格，显示电影的相关信息

************************** 分隔线 *****************************

*  自动执行函数（立即调用函数）：用匿名函数作为一个“容器”，
*  “容器”内部可以访问外部的变量，而外部环境不能访问“容器”内部的变量，
*  内部定义的变量不会和外部的变量发生冲突，典型写法如下：
*  (function() {
*
*  // 此处添加代码
*
*  })();
*
************************** 说明结束 *****************************/


(function() {
    // JavaScript 严格模式
    'use strict';

    //  获取电影的中文名字
    //  获取电影的标题节点，document.querySelector()  选择器，只返回第一个匹配的节点
    let title = document.querySelector("#content h1 span");

    if(title){
        // 用空格进行分割为数组，取下标[0]的部分（电影中文名 ）
        let key = title.innerText.split(" ")[0];
        console.log("电影名称：", key);

        // 最后要将电影的磁力结果添加到网页中，以下为该位置的选择器
        var info = document.querySelector("#interest_sect_level");

        // 自定义 parsetext 函数，用于获取的网页转换为 HTML文档以便后继处理
        function parsetext(text) {
            var doc = null;
            try {
                // 创建一个 HTML 文档对象
                doc = document.implementation.createHTMLDocument("");
                // 将要专业的内容添加为文档对象的HTML
                doc.documentElement.innerHTML = text;
                return doc;
            }
            catch (e) {
                alert("parse error");
            }
        }

        let magurl = `http://bt.ituoniao.com.cn/api/search?source=种子搜&keyword=${key}&page=1&sort=time`;


        // GM.xmlHttpRequest 为跨网页传输内容时使用 GreaseMonkey 提供的API，功能类似于JQuery的AJAX，GM为 GreaseMonkey 的缩写
        // 要在头部添加  // @grant       GM_xmlhttpRequest  的说明
        GM.xmlHttpRequest({
            // 传送数据的 HTTP 方法
            method: "GET",

            // 传送数据的目标网址，此处由 磁力搜索网站与 电影名称 组成
            // url: "https://www.zhongzilou.com/list/"+key+"/1",
            url: magurl,

            // onload 用于载入结果，response 为自己定义的变量名，其内容为接收到的数据
            onload:  function(response){
                // console.log("磁力查找结果：",response.responseText);

                var data=[];

                let result =JSON.parse(response.responseText);
                console.log("磁力查找结果：",result);
                console.log(result.message);
                console.log(result.data.results);
                result.data.results.forEach(function(item){
                    console.log(item);
                    data.push({
                        "title":item.name,
                        "url":item.detailUrl,
                        "magnet": item.magnet,                  //  hot：电影热度数据
                        "hot": item.hot,                        //  description：其他信息
                        "description":item.formatSize
                    });
                });



                // 调用自定义的函数处理网页，以便后继操作，response.responseText 是从目标网址接收到的网页
                // let ms = parsetext(response.responseText.message);



                // 使用 document.querySelectorAll() 选择器获取每个电影的节点，返回所有匹配的节点，结果为数组，这个方法与 JQuery 的 $() 相同
//                 let megs = ms.querySelectorAll("div.panel-body.table-responsive.table-condensed table");
//                 console.log(megs);

//                 // 定义数组用于保存电影信息
                

//                 // 用于保存过滤后匹配的电影数量，大于0 为有可用信息
                 let msCount = 0;

//                 // 遍历所有的电影信息节点
//                 megs.forEach(function(item,index){
//                     console.log("电影信息",index);

//                     data.push({
//                         // title：电影标题；innerText 表示节点的文本内容
//                         "title": item.querySelector("tbody tr td div.text-left h4 a").innerText,
//                         // url：搜索结果的详细页连接；href 表示 节点的 超链接 属性
//                         "url": item.querySelector("tbody tr td div.text-left h4 a").href,
//                         // magnet：电影磁力链
//                         "magnet": item.querySelector("tbody tr td.ls-magnet a").href,
//                         //  hot：电影热度数据
//                         "hot": item.querySelector(" tbody tr td:nth-child(3) strong").innerText,
//                         //  description：其他信息
//                         "description": item.querySelector("tbody tr:nth-child(2) td:nth-child(2) strong").innerText,
//                     });
//                 });

                console.log("从搜索网站提取的电影:",data);


                /************************************* 添加表格到网中的思路 *********************
*    创建一个表格
*    给表格添加一个表头 thead
*    给表格添加一个主体 tbody
*
*    创建一个表格行，创建若干个单元格，并添加表格行中
*
*    将添加好单元格及内容的行添加到 thead 或 tbody 中
*
*    将 thead 和 tbody 添加到表格中
*
*    将表格添加网页中
********************************************************************************/

                // 创建显示信息的表格
                var table = document.createElement("table");

                // 给表格添加一个 thead
                var thead = table.createTHead();

                // 给表格添加一个 tbody
                var tbody = table.createTBody();

                // 创建一个表格行
                var tr = document.createElement("tr");

                // 创建一个表头行单元格 th1
                var th1=document.createElement("th");

                // 使用 setAttribute() 方法给单元格添加 style 属性（样式），只在表头行指定前三个单元格宽度，最后一个单元格没有width（宽度）属性
                th1.setAttribute("style","border:1px dashed #dddddd; text-align:center; width:50px; color:#007722; font-size:14px; padding:5px;");

                // 给单元格添加内部 HTML 内容
                th1.innerHTML = "磁力链";
                // 给表头行添加一个 单元格 th1
                tr.appendChild(th1);

                // 创建一个表头行单元格 th2
                var th2=document.createElement("th");
                // 使用 setAttribute() 方法给单元格添加 style 属性（样式）
                th2.setAttribute("style","border:1px dashed #dddddd; text-align:center; width:40px; color:#007722; font-size:14px; padding:5px;");
                // 给单元格添加内部 HTML 内容
                th2.innerHTML = "热度";
                // 单元格对齐方式
                th2.align="center";
                // 给表头行添加一个 单元格 th2
                tr.appendChild(th2);

                // 创建一个表头行单元格 th3
                var th3=document.createElement("th");
                // 使用 setAttribute() 方法给单元格添加 style 属性（样式）
                th3.setAttribute("style","border:1px dashed #dddddd; text-align:center; width:80px; color:#007722; font-size:14px; padding:5px;");
                // 给单元格添加内部 HTML 内容
                th3.innerHTML = "文件大小";
                th3.align="center";
                // 给表头行添加一个 单元格 th3
                tr.appendChild(th3);

                // 创建一个表头行单元格 th4
                var th4=document.createElement("th");
                // 使用 setAttribute() 方法给单元格添加 style 属性（样式），最后一个单元格不指定宽度，占用剩余宽度
                th4.setAttribute("style","border:1px dashed #dddddd; text-align:center; color:#007722; font-size:14px; padding:5px;");
                // 给单元格添加内部 HTML 内容
                th4.innerHTML = "标题";
                th4.align="center";
                // 给表头行添加一个 单元格 th4
                tr.appendChild(th4);
                // 表头行的对齐方式
                tr.align="center";

                // 将上面的表格行添加到表头
                thead.appendChild(tr);

                // 如果电影信息不为0
                if(data.length){

                    // 遍历所在电影信息，每行生成一个表格行
                    data.forEach(function(item,index){

                        // 对电影标题进行比较，只显示包含有完整电影名称的结果，indexOf(key)用于查找是包含小括号中的关键字。没有的时候是 -1
                        if(item.title.indexOf(key) != -1){
                            msCount ++;
                            var tr = document.createElement("tr");
                            var td1 = document.createElement("td");
                            // 使用 setAttribute() 方法给单元格添加 style 属性（样式），具体内容单元格不指定宽度，其宽度与表头行相同（下面所有单元格相同）
                            td1.setAttribute("style","border:1px dashed #dddddd; text-align:center; color:#007722; font-size:14px; padding:5px;");

                            // 创建一个超链接元素
                            var a = document.createElement("a");
                            a.href = item.magnet;
                            a.innerText = "磁力链";
                            td1.appendChild(a);
                            tr.appendChild(td1);
                            var td2 = document.createElement("td");
                            td2.setAttribute("style","border:1px dashed #dddddd; text-align:center; color:#007722; font-size:14px; padding:5px;");
                            td2.innerHTML = item.hot;
                            tr.appendChild(td2);
                            var td3 = document.createElement("td");
                            td3.setAttribute("style","border:1px dashed #dddddd; text-align:center;  color:#007722; font-size:14px; padding:5px;");
                            td3.innerHTML = item.description;
                            tr.appendChild(td3);
                            var td4 = document.createElement("td");
                            td4.setAttribute("style","border:1px dashed #dddddd; text-align:left;  color:#007722; font-size:14px; padding:5px;");
                            //td4.innerHTML = item.title;
                            var p = document.createElement("sapn");
                            p.innerText = item.title.slice(0,55);
                            p.title = item.title;
                            // p.href = item.url;
                            console.log(item.url);
                            td4.appendChild(p);

                            console.log(item.title.length);
                            tr.appendChild(td4);

                            // 添加一行到表格的主体 tbody
                            tbody.appendChild(tr);
                            console.log(item);
                        }
                    });

                    // 当没有匹配的电影资源时，生成一个合并单元格显示 错误提示信息
                    if(msCount===0){
                        // 创建一个表格行
                        var trerror = document.createElement("tr");
                        // 创建一个单元格
                        var tderror = document.createElement("td");
                        // 设置单元格的 colspan 属性合并单元格k
                        tderror.setAttribute("colspan","4");
                        // 设置单元格内 信息显示的样式属性
                        tderror.setAttribute("style","border:1px dashed #dddddd; text-align:left; text-align:center; color:#d9896a; font-size:14px; padding:5px;");
                        // 单元格内显示 的文字
                        tderror.innerText ="电影 "+key+" 找不到可用磁力资源！";
                        // 添加单元格到表格行
                        trerror.appendChild(tderror);
                        // 添加表格行到表格主体 tbody
                        tbody.appendChild(trerror);
                    }

                    // 将表头行添加到表格
                    table.appendChild(thead);
                    // 将表格主体添加到表格
                    table.appendChild(tbody);
                    // 设置表格线宽度
                    table.border="1";
                    // 设置表格的 style 属性
                    table.setAttribute("style","width: 100%; padding: 0; margin-bottom: 3px;");
                    // 将表格添加到 网页中。
                    info.parentNode.insertBefore(table,info);
                }


            }  // end forEach

        });    // end GM.xmlHttpRequest

    }else{
        console.info("载入信息错误！");
    }

})();