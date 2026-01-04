// ==UserScript==
// @name         下载趣味盒的图片
// @namespace    download-funbox-pic
// @version      0.1.2
// @description  下载pt网站的趣味盒的图片,兼容 NexusPHP 的网站,点击网页中的 下载趣味盒图片 按钮，游览器开始下载所有图片，22-11-27
// @author       zip11guge
// @match        https://*/fun.php?action=view
// @grant        GM_download
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455580/%E4%B8%8B%E8%BD%BD%E8%B6%A3%E5%91%B3%E7%9B%92%E7%9A%84%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/455580/%E4%B8%8B%E8%BD%BD%E8%B6%A3%E5%91%B3%E7%9B%92%E7%9A%84%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {

    'use strict';

    // BUTTON 5
    var button5 = document.createElement("button");

    button5.id = "id005";
    button5.textContent = "下载趣味盒图片";
    button5.style.width = "140px";
    button5.style.height = "20px";
    button5.style.align = "center";

    // END ~~~~~~~~

    button5.onclick = function (){

        msgk("开始下载任务");

        picsnap();
        //alert("开始下载任务");

        
    };

    //~~~~~~~~~~Add Button ~~~~~~~~~~~

    //查找  上一页的 元素
    var x = document.querySelector("body");

    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
    console.log("button 对象:",x);

    //添加 子元素
    //x.appendChild(button5);

    //insertBefore
    x.parentNode.insertBefore(button5, x);

    //~~~~~~~~~end~~~~~~~


    // css选择图片网址，下载图片
    function picsnap() {

        console.log('点击了按键,复制funbox img');

        // button5 text
        // var p=document.getElementById("id005");
        // p.innerHTML="开始下载";

        //var dmmimg=document.getElementsByName("funbox");

        let funimg=document.querySelectorAll("img");


        let i;

        // var img name
        let mz1='';

        // var img total number
        let imgnum = funimg.length;

        // button5 text
        //p.innerHTML="num="+imgnum;

        // 循环 下载 图片
        for (i = 0; i < imgnum ; i++) {

            // jpg src
            let picdt = funimg[i].src;
            console.log("jpg-src:"+picdt);

            // jpg name
            mz1 = GetPageName(picdt);


            // 下载图片 数量 统计---st---
            // no-down-img-number
            let nodown_img = imgnum - i ;

            // 按钮文本 修改 为 下载图片 剩余数量
            //p.innerHTML="num="+nodown_img;
            console.log("pic-num:" + nodown_img );
            
            // 下载图片
            down_jpg(picdt,mz1,i,imgnum);


        }
        // pic num = 0
        // p.innerHTML="num=0";
    }

    // 下载图片
    function down_jpg(ljtp,mz2,xzs,bmnum) {

        // download jpg

        GM_download({

            url:ljtp,
            name:mz2,
            onload: () => {

                // 下载完成，提示
                xzs = xzs +1;
                if(xzs == bmnum) {
                    console.log("xz-end:"+xzs);


                    GM_notification({
                        text:"下载结束-下载种子数量:"+xzs,
                        timeout: 2000
                    });
                }
                else {
                    console.log("xz-num:"+xzs+"/total_num:"+bmnum);
                }


            }

        });


    }

    // msgbox 2s
    function msgk(wb1) {

        GM_notification({
            text:wb1,
            timeout: 2000
        });       
    }

    //获取url 文件名
    function GetPageName(url)
    {

        var tmp= [];//临时变量，保存分割字符串

        tmp=url.split("/");//按照"/"分割

        var pp = tmp[tmp.length-1];//获取最后一部分，即文件名和参数

        //tmp=pp.split("?");//把参数和文件名分割开

        return pp;
    }

})();