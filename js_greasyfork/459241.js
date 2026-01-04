// ==UserScript==
// @name         头条助手（星图）
// @namespace    http://tampermonkey.net/
// @version      0.0.8
// @description  头条助手（星图）使用
// @author       myaijarvis
// @run-at       document-end
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/lm_yhaz_kh/ljhwZthlaukjlkulzlp/favicon.png
// @match        https://www.xingtu.cn/*
// @connect      47.119.113.79
// @connect      127.0.0.1
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.1/dist/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/459241/%E5%A4%B4%E6%9D%A1%E5%8A%A9%E6%89%8B%EF%BC%88%E6%98%9F%E5%9B%BE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/459241/%E5%A4%B4%E6%9D%A1%E5%8A%A9%E6%89%8B%EF%BC%88%E6%98%9F%E5%9B%BE%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //debugger
    addStyle();

    addBtn_jump();
    $("#Btn_jump").click(function () {
        let url=document.URL
        let id=get_id(url)
        let temp_url=`http://tt.myaijarvis.com/xtwinner.html?challenge_id=${id}`;
        window.open(temp_url, "_blank");
    })

    addBtn();
    $("#my_reward").click(async function () {
        let url=document.URL
        let id=get_id(url)
        let res=await get_reward_info(id)
        console.log(`${res['stat_time']}\n${res['total_item_count']}`);
        let $dom=$('.sr-reward-item')
        $('.item-title').css({'width':'990px'})
        $('.item-name').css({'margin-left':'10px'})
        $('.attr').css({'width':'110px','margin-left':'10px'})
        $.each($dom,function(index,item){
            //console.log(item)
            //console.log(index)
            $(item).prepend(`<span style='padding-right:10px;'>${index+1}</span>`)
            $(item).append(`<a href="${res['url'][index]}" target="_blank" style="width: 50px;">链接</a>`)
        })
    });

    function get_reward_info(challenge_id){
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "get",
                url: "http://47.119.113.79:2001/get_reward?challenge_id="+challenge_id,
                async : false,
                onload: function(response){
                    console.log("请求成功");
                    //console.log(response.responseText);
                    let result=JSON.parse(response.responseText);
                    console.log(result);
                    //debugger
                    if(result.code==1){
                        //console.log(result.data);
                        resolve(result.data)
                    }else{
                        reject();
                    }
                },
                onerror: function(response){
                    console.log("请求失败");
                    reject();
                }
            });
        })
    }

    function get_id(str){// /https:\/\/www\.xingtu\.cn\/sup\/creator\/submission\/detail\/(\d+)/
        return str.match(/https:\/\/www\.xingtu\.cn\/sup\/creator\/submission\/detail\/(\d+)/)[1];
    }

    function addStyle() {
        //debugger;
        let layui_css = `
         .layui-btn{
                   display: inline-block; vertical-align: middle; height: 38px; line-height: 38px; border: 1px solid transparent; padding: 0 18px;
                   background-color: #009688; color: #fff; white-space: nowrap; text-align: center; font-size: 14px; border-radius: 2px; cursor: pointer;
                   -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;
         }
         .layui-btn-sm{height: 30px; line-height: 30px; padding: 0 10px; font-size: 12px;}`;
        GM_addStyle(layui_css);
    }

    function addBtn() {
        let element = $(`<button style="top: 150px;left:0px; position: fixed;z-index:1000;cursor:pointer;background:green;width:auto;" class="layui-btn layui-btn-sm" id="my_reward">请求</button>`);
        $("body").append(element);
    }

    function addBtn_jump() {
        let element = $(`<button style="top: 100px;left:0px; position: fixed;z-index:1000;cursor:pointer;background:green;width:auto;" class="layui-btn layui-btn-sm" id="Btn_jump">跳转</button>`);
        $("body").append(element);
    }

})();