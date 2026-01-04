// ==UserScript==
// @name         Steam便捷加入购物车
// @namespace    Steam便捷加入购物车
// @version      0.4
// @description  Steam便捷加入购物车，不自动跳转购物车页面。
// @author       HCLonely
// @match        https://store.steampowered.com/*
// @require      https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js
// @supportURL   https://blog.hclonely.com/posts/578f9be7/
// @homepage     https://blog.hclonely.com/posts/578f9be7/
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/387972/Steam%E4%BE%BF%E6%8D%B7%E5%8A%A0%E5%85%A5%E8%B4%AD%E7%89%A9%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/387972/Steam%E4%BE%BF%E6%8D%B7%E5%8A%A0%E5%85%A5%E8%B4%AD%E7%89%A9%E8%BD%A6.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    function addToCart(appid){
        swal({
            title: "Steam便捷加入购物车",
            text: "正在获取游戏信息...",
            icon: "info",
        });
        $.ajax({
            url:'https://store.steampowered.com/app/'+appid,
            type:'get',
            success:(data)=>{
                try{
                    let addToCart=data.match(/\<form name\=\"add\_to\_cart[\w\W]*?\<\/form\>/gim);
                    if(addToCart){
                        swal({
                            title: "Steam便捷加入购物车",
                            text: "获取游戏信息成功！ \n正在处理游戏信息...",
                            icon: "info",
                        });
                        let inputArr=addToCart[0].match(/\<input type\=\"hidden\".*?\>/gim);
                        let postData={};
                        for(let i=0;i<inputArr.length;i++){
                            let input=$(inputArr[i]);
                            let key=input.attr('name');
                            let value=input.attr('value');
                            postData[key]=value;
                        }
                        swal({
                            title: "Steam便捷加入购物车",
                            text: "获取游戏信息成功！ \n处理游戏信息完成！ \n正在加入购物车...",
                            icon: "info",
                        });
                        $.ajax({
                            url:'https://store.steampowered.com/cart/',
                            type:'post',
                            data:postData,
                            success:(data)=>{
                                try{
                                    let test=new RegExp('\<div class\=\"cart_row.*?data\-ds\-appid\=\"'+appid+'\"','g');
                                    if(test.test(data)){
                                        swal({
                                            title: "Steam便捷加入购物车",
                                            text: "获取游戏信息成功！ \n处理游戏信息完成！ \n加入购物车成功！",
                                            icon: "success",
                                        });
                                    }else{
                                        swal({
                                            title: "Steam便捷加入购物车",
                                            text: "获取游戏信息成功！ \n处理游戏信息完成！ \n加入购物车失败！",
                                            icon: "error",
                                        });
                                    }
                                }catch(e){
                                    swal({
                                        title: "Steam便捷加入购物车",
                                        text: "获取游戏信息成功！ \n处理游戏信息完成！ \n加入购物车失败！",
                                        icon: "error",
                                    });
                                }
                            },
                            error:()=>{
                                swal({
                                    title: "Steam便捷加入购物车",
                                    text: "获取游戏信息成功！ \n处理游戏信息完成！ \n加入购物车失败！",
                                    icon: "error",
                                });
                            },
                        });
                    }else{
                        swal({
                            title: "Steam便捷加入购物车",
                            text: "获取游戏信息成功！ \n没有找到添加购物车按钮，请手动添加！",
                            icon: "warning",
                            buttons: {
                                cancel: "关闭",
                                手动添加: true,
                            },
                        })
                            .then((value) => {
                            if(value) window.open('https://store.steampowered.com/app/'+appid,'_blank')
                        });
                    }
                }catch(e){
                    swal({
                        title: "Steam便捷加入购物车",
                        text: "脚本出错！",
                        icon: "error",
                    });
                    console.error(e);
                }
            },
            error:e=>{
                swal({
                    title: "Steam便捷加入购物车",
                    text: "获取游戏信息失败！",
                    icon: "error",
                });
                console.error(e);
            },
        });
    }
    function addBtn(){
        $('.ds_options').parent().not(':contains("添加至购物车")').append(`<div class="ds_options hclonely btnv6_green_white_innerfade"><span>添加至购物车</span></div>`);
        $('.ds_options.hclonely').click(function(e){
            e.preventDefault();
            addToCart($(this).parent().attr('data-ds-appid'));
        });
    }

    addBtn();

    setInterval(()=>{
        if($('.ds_options').parent().not(':contains("添加至购物车")').length>0) addBtn();
    },1500);

    GM_addStyle(`.hclonely{position: absolute;right: 0;top: 25px;z-index: 999999;padding: 0 !important;}`);

})(jQuery);
