// ==UserScript==
// @name         [timerd] 音乐解析 网易、ＱＱ、酷狗、酷我（新增）、(定期更新增加新的解析网站)(2019-09-20)更新
// @namespace    http://timerd.ml
// @version      0.0.12
// @description  音乐解析 网易、ＱＱ音乐解析 欢迎收听！
// @author       timerd
// @include      *://music.163.com/*song*
// @include      *://y.qq.com/*/song/*
// @include      *://*.kugou.com/song/*
// @include      *://*.kuwo.cn/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @icon         http://timerd.me/favicon.ico
// @run-at       document-end
// @grant        unsafeWindow
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/386846/%5Btimerd%5D%20%E9%9F%B3%E4%B9%90%E8%A7%A3%E6%9E%90%20%E7%BD%91%E6%98%93%E3%80%81%EF%BC%B1%EF%BC%B1%E3%80%81%E9%85%B7%E7%8B%97%E3%80%81%E9%85%B7%E6%88%91%EF%BC%88%E6%96%B0%E5%A2%9E%EF%BC%89%E3%80%81%28%E5%AE%9A%E6%9C%9F%E6%9B%B4%E6%96%B0%E5%A2%9E%E5%8A%A0%E6%96%B0%E7%9A%84%E8%A7%A3%E6%9E%90%E7%BD%91%E7%AB%99%29%282019-09-20%29%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/386846/%5Btimerd%5D%20%E9%9F%B3%E4%B9%90%E8%A7%A3%E6%9E%90%20%E7%BD%91%E6%98%93%E3%80%81%EF%BC%B1%EF%BC%B1%E3%80%81%E9%85%B7%E7%8B%97%E3%80%81%E9%85%B7%E6%88%91%EF%BC%88%E6%96%B0%E5%A2%9E%EF%BC%89%E3%80%81%28%E5%AE%9A%E6%9C%9F%E6%9B%B4%E6%96%B0%E5%A2%9E%E5%8A%A0%E6%96%B0%E7%9A%84%E8%A7%A3%E6%9E%90%E7%BD%91%E7%AB%99%29%282019-09-20%29%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==


(function () {

    'use strict';
    function addInfrastructure() {
        let style = document.createElement("style");
      
        style.appendChild(document.createTextNode(`
              #mywidget a {
              position: absolute;
              left: -75px;
              transition: 0.3s;
              padding: 15px 30px 15px 15px; 
              text-decoration: none;
              color: white!important;
              border-radius: 0 8px 8px 0;
              font: 20px "Microsoft YaHei",SimHei,helvetica,arial,verdana,tahoma,sans-serif;
              min-width: 80px;
              text-align:right;
              white-space:nowrap;             
            }


            #mywidget a:hover {
                left: 0;
             }    
   
             #vparse {
               background-color: #f44336;
             }

             #myplaybutton {
                 position:absolute; 
                 right:-8px;
                 top: 14px; 
                 width:0px;
                 height:0px;
                 margin:0px;
                 border-width: 16px;
                 border-style: solid;
                 border-color:transparent transparent transparent white;
             }

             #mywidget a img {
             width: 28px;
             height:34px;
             position: absolute;
             top:12px;
             right: 5px;
             align-items: center;
       }`));        

        document.head.appendChild(style);
    }


    let playurl = window.location.href;
    let rArray = playurl.split('?');
    let cWeb = rArray[0];
 

    const musicSites = new Array();
    musicSites[0]=/163(.*)song/i;
    musicSites[1]=/QQ(.*)song/i;
    musicSites[2]=/(.*)kugou.com/i;
    musicSites[3]=/(.*)kuwo.cn/i;
   
    musicSites.every((item) => {
        if (item.test(cWeb)) {
            addInfrastructure();
            var jumpButton = $(`
            <div id="mywidget" href='javascript:void(0)' target='_blank' style="z-index:9999; position:fixed;left:0px;top:280px;">    
                <a href="#" id="vparse">❀音乐解析<div id="myplaybutton"></div></a>
            </div>
            `);
           
            $("body").append(jumpButton);
    
            // bind onclick event
            $("#mywidget").click(function () {
                var openUrl = window.location.href;
                window.open('https://timerd.me/static/m.html?zxm=' + encodeURIComponent(openUrl));
            });
            return false;
        }
        return true;
    });
})()