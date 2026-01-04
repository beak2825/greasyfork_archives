// ==UserScript==
// @name         dt（研究中，请不要下载！）
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        http://dyjy.dtdjzx.gov.cn/*
// @match        https://dyjy.dtdjzx.gov.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/415662/dt%EF%BC%88%E7%A0%94%E7%A9%B6%E4%B8%AD%EF%BC%8C%E8%AF%B7%E4%B8%8D%E8%A6%81%E4%B8%8B%E8%BD%BD%EF%BC%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/415662/dt%EF%BC%88%E7%A0%94%E7%A9%B6%E4%B8%AD%EF%BC%8C%E8%AF%B7%E4%B8%8D%E8%A6%81%E4%B8%8B%E8%BD%BD%EF%BC%81%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    var abc="<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:40%;left:0px;'>"+
        "<div id='baiduwenku_helper_download_btn' style='font-size:12px;padding:8px 2px;color:#FFF;background-color:#25AE84;'>播放</div>"+
        "<div id='baiduwenku_helper_copyall_btn' style='font-size:12px;padding:8px 2px;color:#FFF;background-color:#FE8A23;'>停止</div>"+
        "<div id='sc' style='font-size:12px;padding:8px 2px;color:#FFF;background-color:#FE8A23;'>时长</div>"+
        "</div>";
    $("#app").append(abc);
    //document.getElementById("app").append(abc);
    function xiaobf(){
        try{
            if( document.getElementsByClassName("el-icon-video-play")[0]){
                var cc=document.getElementsByClassName("cell")[10].textContent;
                var ccs=Number(cc)*1000*60+30000;

                document.getElementsByClassName("el-icon-video-play")[0].click();
                console.log(">>1已点击播放列表")
                GM_setValue('zw_test', ccs);
                console.log("播放时长："+GM_getValue('zw_test')+"毫秒");
                console.log(ccs/1000+"秒");
                console.log(ccs/1000/60+"分");
                var scs=document.getElementById("sc");
                scs.innerHTML=ccs/1000/60+"分";
                //return ccs
            }else{
                console.log(">>1未找到播放列表");
            }
        }catch(e){console.log(">>1try");}
    }

    function dabf(){
        try{
            if(document.getElementsByTagName("canvas")[0]){
                var ee=document.querySelector("table > tr:nth-child(2) > td:nth-child(4) > span").innerText
                var cce=ee.replace("分钟","");
                var cces=Number(cce)*1000*60+30000;
                console.log(cces/1000+"秒");
                console.log(cces/1000/60+"分");
                var scs=document.getElementById("sc");
                scs.innerHTML=cces/1000/60+"分";
                //document.getElementsByTagName("canvas")[0].click();
                document.getElementsByTagName("video")[0].muted = true;
                document.getElementsByTagName("video")[0].play();
                console.log(">>2开始播放");
                return cces
            }else{
                console.log(">>2播放失败");
            }
        }catch(e){console.log(">>2try");}
    }

    function guanbi(){
        try{
            if(document.getElementsByTagName("canvas")[0]){
                window.close();
                window.close();
                console.log(">>3已关闭");
            }else{
                console.log(">>3关闭失败");
            }
        }catch(e){console.log(">>3try");}
    }
    function shuaxin(){

        try{
            if( document.getElementsByClassName("el-icon-video-play")[0]){
                window.location.reload()
                console.log(">>4已刷新");
            }
        }catch(e){console.log(">>4try");}
    }

  //  window.onload=function(){
        console.log(">>0开始运行");
        var aa= window.setTimeout(function() {
            console.log(">>1.1点播放列表");
            xiaobf();
            // console.log(">>1.2:"+dy);
            window.setTimeout(function() {
                console.log(">>2.1点播放");
                // if(dy==undefined){
                //     dy=dabf();
                //     console.log(">>2.2:"+dy);
                //  }else{
                dabf();
                //  }
                window.setTimeout(function() {
                    console.log(">>3.1点关闭");
                    guanbi();
                    window.setTimeout(function() {
                        console.log(">>4.1点刷新");
                        shuaxin()
                    }, 60000);
                }, GM_getValue('zw_test'));
            }, 10000);
        }, 10000);
  //  }

    $("#app").on("click","#baiduwenku_helper_download_btn",function(){
        alert("请刷新网页开始播放！")
        // window.location.reload();
    });
    $("#app").on("click","#baiduwenku_helper_copyall_btn",function(){
        //  window.clearTimeout(aa);
        //   console.log(">>"+aa);
        alert("请自行关闭！")
    });
})();