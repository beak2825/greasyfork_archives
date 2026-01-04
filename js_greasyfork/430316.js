// ==UserScript==
// @name         寂月download
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  寂月神社图片预览下使用的是复用页面，分辨率为300x300，本脚本为自动访问分辨率高的地址并下载图片。
// @description  v0.1版本进入页面后点击“获取”按钮，提示获取完成后点击“下载”按钮；目前仅能同时下载58张以下的图片。
// @description  v0.2版本进入页面后点击“获取”按钮，提示获取完成后点击“下载”按钮；目前由于服务器访问数量限制，超过59页将会以一页/s的速度访问（会消耗大量浏览器资源）。
// @description  v0.3版本去掉下载按钮，获取链接后自动下载；针对图片过多会某些图片下载失败新增校验按钮，在浏览器无反应后点击校验来查看是否失败（有失败则重新点击获取按钮下载，删掉重复图片即可）。
// @description  本脚本不可用于商业行为，仅限交流自用！
// @author       香香不吃饭
// @match        https://www.jiyue.pro/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @require      https://cdn.bootcss.com/FileSaver.js/1.3.8/FileSaver.min.js
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/430316/%E5%AF%82%E6%9C%88download.user.js
// @updateURL https://update.greasyfork.org/scripts/430316/%E5%AF%82%E6%9C%88download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //创建隐藏a标签
    //var elea = document.createElement("a");
    //elea.setAttribute("id", "a");
    //elea.textContent="值";
    //elea.setAttribute("href", "www.baidu.com");


    //创建一个img标签
    //var eleimg = document.createElement("img");
    //eleimg.setAttribute("id", "img");
    // eleimg.textContent="值";
    //eleimg.setAttribute("class", "img-fluid lazyloaded");

    //创建数组来存储每张图片对应的src
    var imgUrl = [];

    //创建下载超时回调数组
    var timeOutArr = [];

    //创建下载失败回调数组
    var onErrorArr = [];

    var button = document.createElement("button"); //创建一个获取图片url按钮
    button.setAttribute("id", "btn");
    button.setAttribute("type", "button");
    button.textContent="获取";
    button.style.background = "#b46300";
    button.style.color = "white";
    button.style.cssText="padding:4px 0;position: absolute;top:-1px;right:45px;width:40px;height:35px";

    var button2 = document.createElement("button"); //创建一个校验图片按钮
    button2.setAttribute("id", "btn2");
    button2.setAttribute("type", "button");
    button2.textContent="校验";
    button2.style.background = "#b46300";
    button2.style.color = "white";
    button2.style.cssText="padding:4px 0;position: absolute;top:-1px;right:0px;width:40px;height:35px";

    var testdiv = document.getElementById("navbarNav");
    testdiv.appendChild(button);
    testdiv.appendChild(button2);
    //testdiv.appendChild(elea);
    //elea.appendChild(eleimg);

    //eleimg.style.display="none";

    //document.getElementById("elea").style.display="none";

    var newurl = "";
    var pagenum = 0; //图片页数
    var imgname = ''; //漫画名称

    var x = 1;

    //拿到当前页面所有预览图片对应的URL
    var baseUrl = window.location.href;

    button.onclick = function getimgurl(){
        alert("开始获取")
        pagenum = document.getElementsByClassName('badge badge-pill badge-secondary float-right')[0].innerText;
        pagenum = pagenum.substr(0,pagenum.length-1);
        imgname = document.getElementsByClassName('h4 font-weight-bold title mb-2')[0].innerText;

        //eleimg.setAttribute("alt",imgname);

        if(pagenum>59){
            sleep(1000);
        }else{
            for(let i = 1;i<=pagenum;i++) {
                newurl = baseUrl + '/'+i
                geturl();
            }
        }

        alert("共获取"+pagenum+"页！开始下载！")
        //console.log(imgUrl)

        downloadimg();

    }

    function sleep(n){
        if(x <= pagenum){
            newurl = baseUrl + '/'+x
            //console.log(x)
            geturl();
            x = x+1

            var start = new Date().getTime();
            //  console.log('休眠前：' + start);
            while (true) {
                if (new Date().getTime() - start > n) {
                    break;
                }
            }
            // console.log('休眠后：' + new Date().getTime());
            sleep(1000);

        }else{
            console.log("获取完成!")
        }


    }



    //ajax同步请求获取url
    function geturl(){
        $.ajax({
            type:'get',
            url:newurl,//这里是url
            async: false,
            //data就是内容了，也就是url网页中的内容
            success:function(data){
                //正则表达式截取图片url
                var srcReg = /"(.*?)"/g
                var arr = data.match(srcReg)[162]
                arr = arr.substr(1,arr.length-2)

                imgUrl.push(arr)
                //console.log(arr)


            }
        });
    }

    function downloadimg(){
        alert("开始下载！")
        for(let a=0;a<=imgUrl.length-1;a++){
            GM_download({
                url:imgUrl[a],
                name:"picture"+a,
                onload:function(){
                    console.log("下载第"+(a+1)+"张成功!")
                },
                onerror:function(e){
                    console.log("下载第"+(a+1)+"张失败!")
                    console.log(e)
                    onErrorArr.push(imgUrl[a])
                },
                ontimeout: function(){
                    console.log("下载第"+(a+1)+"张超时!")
                    timeOutArr.push(imgUrl[a])
                },
                onprogress:function(e){
                    //console.log(e)
                }
            })
        }

        //  GM_download(imgUrl[6],"picture"+6);
        //  GM_download(imgUrl[8],"picture"+8);
        //  GM_download(imgUrl[9],"picture"+9);
        //  GM_download(imgUrl[11],"picture"+11);
        //  GM_download(imgUrl[17],"picture"+17);
        //  GM_download(imgUrl[18],"picture"+18);
        //  GM_download(imgUrl[20],"picture"+20);
        //  GM_download(imgUrl[33],"picture"+33);
        //  GM_download(imgUrl[40],"picture"+40);
        //  GM_download(imgUrl[41],"picture"+41);
        //  GM_download(imgUrl[42],"picture"+42);
        //  GM_download(imgUrl[45],"picture"+45);
        //  GM_download(imgUrl[46],"picture"+46);
        //  GM_download(imgUrl[47],"picture"+47);
        //  GM_download(imgUrl[48],"picture"+48);
        //  GM_download(imgUrl[49],"picture"+49);


        //GM_download(imgUrl[0],"aaa");

    }


    button2.onclick = function checkfailed(){
        if(!onErrorArr.length == 0){
            alert("有"+onErrorArr.length+"条图片下载失败!")
        }else{
            alert("未检测到下载失败图片!")
        }
        if(!timeOutArr.length == 0){
            alert("有"+timeOutArr.length+"条图片下载超时!")
        }else{
             alert("未检测到下载超时图片!")
        }


    }



    //alert("获取完成!")

    // Your code here...
})();