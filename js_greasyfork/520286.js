// ==UserScript==
// @name         不想看b站推荐内容-屏蔽部分b站内容
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  仅在BiliBili播放页生效，如果想屏蔽首页的推荐，可直接用https://search.bilibili.com替代。如果失效了，欢迎反馈。可自行在labels数组增加想要屏蔽的控件。
// @author       blackpigeon
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://code.jquery.com/jquery-latest.js
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/520286/%E4%B8%8D%E6%83%B3%E7%9C%8Bb%E7%AB%99%E6%8E%A8%E8%8D%90%E5%86%85%E5%AE%B9-%E5%B1%8F%E8%94%BD%E9%83%A8%E5%88%86b%E7%AB%99%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/520286/%E4%B8%8D%E6%83%B3%E7%9C%8Bb%E7%AB%99%E6%8E%A8%E8%8D%90%E5%86%85%E5%AE%B9-%E5%B1%8F%E8%94%BD%E9%83%A8%E5%88%86b%E7%AB%99%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict'

    if (window.self !== window.top) {
        console.log("脚本在iframe或嵌入页面中，不执行后续代码")
        return;
    }

    let labels = [{text:"侧边推荐",label:".recommend-list-v1",hide:true},
                  {text:"播放结束页推荐",label:".bpx-player-ending-panel",hide:true},
                  {text:"侧边直播推荐",label:".pop-live-small-mode",hide:true},
                  //{text:"侧边活动推荐",label:"#reco_list",hide:true},
                  {text:"右上角菜单栏红点",label:".red-num--dynamic",hide:true},
                  {text:"评论区",label:"#commentapp",hide:false}]
    var arr = new Array;
    for (let i in labels) {
        arr.push[i];
        arr[i]=i;
    }
    // 获取小窗隐藏状态
    let window_show = GM_getValue("window-show",true);
    function changeWebStatus(i){
        if(labels[i].hide){
            $(labels[i].label).hide()
        }else{
            $(labels[i].label).show()
        }
        // 保存数据
        GM_setValue(labels[i].label,labels[i].hide);
    }
    function changeWindowStatus() {
                if(window_show){
                    $("#byebye-button").parent().css({'height': 25*labels.length+'px', 'width': '120px','right': '10px'});
                    $("#byebye-button").text("隐藏列表");
                    $("#byebye-button").css({'height': '20px', 'width': '60px'});
                    $("#byebye-button").siblings("ul").show();
                    GM_setValue("window-show",true);
                }else{
                    $("#byebye-button").parent().css({'height': '80px', 'width': '20px','right': '-10px'});
                    $("#byebye-button").text("筛\n选\n列\n表");
                    $("#byebye-button").css({'height': '80px', 'width': '20px'});
                    $("#byebye-button").siblings("ul").hide();

                    GM_setValue("window-show",false);
                }}
    function initializeStatus(){
        for (let i in labels) {
            // 获取数据
            labels[i].hide = GM_getValue(labels[i].label,labels[i].hide);
            // 填充小窗列表
            let t = '<li><input id="cckkbox'+i+'" type="checkbox"'+(labels[i].hide?" checked=true":" ")+'>'+labels[i].text+'</li>';
            $("#byebye-button").siblings("ul").append(t);
        }
        changeWindowStatus();
        // 初始化b站页面状态
        var j = 0;
        var interval =
            setInterval(function(){
                for (var i = 0; i < arr.length; i++) {
                    if($(labels[arr[i]].label)){
                        changeWebStatus(arr[i]);
                        if($(labels[arr[i]].label).is(":hidden")==labels[arr[i]].hide){
                            arr.splice(i, 1);
                            i--;
                            if(i==-1){
                                break;
                            }
                        }
                    }
                }
                j++;
                if(arr.length == 0 || j == 10){
                    clearInterval(interval);
                }
            },2000);

    }

    // 初始化小窗
    $("body").append(`<div style='right: 10px;
                            bottom: 250px;
                            background: #34b5f2;
                            color:#ffffff;
                            overflow: hidden;
                            z-index: 9999;
                            position: fixed;
                            padding:5px;
                            text-align:left;
                            width: 120px;
                            height: `+25*labels.length+`px;
                            border-bottom-left-radius: 4px;
                            border-bottom-right-radius: 4px;
                            border-top-left-radius: 4px;
                            border-top-right-radius: 4px;'>
                            <ul>-==筛选屏蔽元素==-
                            </ul>
                            <button id="byebye-button" style="color:#ffffff;
                                                                 background: #000000;
                                                                 width: 60px;
                                                                 height: 20px;">隐藏列表</button>
                        </div>`);

    // 等待网页加载完成
    window.addEventListener('load', function() {
        initializeStatus();
        // 在非播放页不展示右侧小窗
        if(!(window.location.href.includes("www.bilibili.com/video/"))){
            $("#byebye-button").parent().hide();
        }
        // 查找按钮元素
        var button = $("#byebye-button");
        if (button) {
            // 监听按钮的点击事件
            button.on('click', function() {
                if (window_show) {
                    window_show=false;
                } else {
                    window_show=true;
                }
                changeWindowStatus();
            });
        } else {
            console.log('未找到按钮元素');
        }
        // 读取复选框状态
        for (let i in labels) {
            var checkbox = $('#cckkbox'+i);
            checkbox.on('change', function() {
                if (this.checked) {
                    labels[i].hide=true;
                } else {
                    labels[i].hide=false;
                }
                changeWebStatus(i);
            });
        }


    });
})();
