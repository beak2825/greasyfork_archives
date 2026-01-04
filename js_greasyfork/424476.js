// ==UserScript==
// @name         hidden baidu recommend
// @namespace    http://tampermonkey.net/hidden_baidu_recommend
// @version      0.4
// @description  关闭百度左侧的推荐
// @author       宏斌
// @match        https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424476/hidden%20baidu%20recommend.user.js
// @updateURL https://update.greasyfork.org/scripts/424476/hidden%20baidu%20recommend.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Hello 👏");
    var content_right = document.getElementById('content_right');
    if (content_right){
        content_right.parentNode.removeChild(content_right);
        //    content_right.innerHTML = '<h1>Hello</h1>'
        const Live = document.createElement('script');
        Live.src = "https://eqcn.ajz.miesnfu.com/wp-content/plugins/wp-3d-pony/live2dw/lib/L2Dwidget.min.js";
        Live.onload = function () {
            L2Dwidget.init({
                "model": {
                    jsonPath: "https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json",
                    "scale": 1
                },
                "display": {
                    "position": "right",
                    "width": 120,
                    "height": 240,
                    "hOffset": 0,
                    "vOffset": -20
                },
                "mobile": {
                    "show": true,
                    "scale": 0.5
                },
                "react": {
                    "opacityDefault": 0.7,
                    "opacityOnHover": 0.2
                }
            });

                $('#u').remove();//右侧用户信息移除
                $('#result_logo').css("visibility","hidden");//隐藏百度logo
            //搜索框高度微调
            $('.wrapper_new .s_ipt_wr').css('height','36.5px');
            //内容加宽
            $('.new-pmd.c-container').css('width','670px');
            addClipBoardSearch();
        };

        document.body.appendChild(Live);
        };
    //按钮变色
    $('.wrapper_new .s_btn_wr .s_btn').css({'background':'linear-gradient(221deg, rgb(47 9 202 / 58%), rgb(9 212 232))','border-radius':0});
    //footer模糊效果
    $(".wrapper_new .sam_newgrid~#page").css({
    'backdrop-filter': 'blur(6px)',
    'box-shadow': '-1px 0px 3px 1px #ddd',
    'position':'fixed','bottom':0,
        width:"100%",'background-color':'transparent','z-index':9
    });
    //head模糊
    $("#head").css({
    'backdrop-filter': 'blur(10px)',
    'box-shadow': '-1px 0px 3px 1px #eee',
     width:"100%",'background-color':'transparent','z-index':9
    });
    $("#s_tab").css('padding-top','70px');

    function addClipBoardSearch() {
        const sb = document.createElement("button");
      sb.id = "clipSearchBtn";
      sb.innerHTML = "CLIPBOARD";
      $("#form").append(sb);
        $("#su").val("SEARCH");//百度一下改为Search
      $("#clipSearchBtn").css({
        width: "100px",
        height: "40px",
        border: "none",
        color: "white",
        cursor: "pointer",
        "border-left": "0.5px solid #fff",
        "border-top-right-radius": "7px",
        "border-bottom-right-radius": "7px",
        background:
          "linear-gradient(132deg, rgb(47 9 202 / 58%),rgb(9 212 232))",
      });
      async function getClipboardData() {
        try {
          const { clipboard } = navigator;
          const text = await clipboard.readText();
          console.log(text);
          $("#kw").val(text);
          setTimeout(() => {
            $("#su").click();
              setTimeout(() => {
                  content_right = document.getElementById('content_right');
                  if(content_right){
                      content_right.parentNode.removeChild(content_right);
                  }
              },1000)
          }, 0);
        } catch (error) {
          console.error("读取剪贴板失败:", error);
        }
      }
      $("#clipSearchBtn").on("click", getClipboardData);
    };
})();