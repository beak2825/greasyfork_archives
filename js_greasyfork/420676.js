// ==UserScript==
// @name         cicd预发自动点击
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  try to take over the world!
// @author       You
// @match        http://cicd.vivo.xyz/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/420676/cicd%E9%A2%84%E5%8F%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/420676/cicd%E9%A2%84%E5%8F%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var 头部空白处 = 'body > div.app.app-content > section > header';

    var 框框父级 = 'body > div > section > main > div > div.runmain-tabs.el-tabs.el-tabs--card.el-tabs--top > div.el-tabs__content > div.page-inner > div.pipeline-fix > div > div > div.swiper-wrapper';

    var 进度 = 'body > div > section > main > div > div.runmain-tabs.el-tabs.el-tabs--card.el-tabs--top > div.el-tabs__content > div.page-inner > div.pipeline-fix > div > div > div.swiper-wrapper > div.swiper-slide.swiper-slide-next > div > div.el-card__body';

    var 空白 = 'body > div > section > main > div > div.el-tabs__content > div.page-inner > div.el-card.box-card.gap-top.component-card.is-always-shadow > div.el-card__body';

    var 上传 = 'body > div.app.app-content > section > main > div > div.runmain-tabs.el-tabs.el-tabs--card.el-tabs--top > div.el-tabs__content > div.page-inner > div.el-card.box-card.gap-top.component-card.is-always-shadow';

    var 构建立即运行 = 'body > div > section > main > div > div.runmain-tabs.el-tabs.el-tabs--card.el-tabs--top > div.el-tabs__content > div.page-inner > div.el-card.box-card.gap-top.component-card.is-always-shadow > div.el-card__body > div > div.txt-center.execbuildform-menu > div > div:nth-child(2) > div > div:nth-child(1) > button > span';

    var 准备部署 = 'body > div.app.app-content > section > main > div > div.runmain-tabs.el-tabs.el-tabs--card.el-tabs--top > div.el-tabs__content > div.page-inner > div.el-card.box-card.gap-top.component-card.is-always-shadow > div.el-card__body > div > div.startup-content > div > section > div.txt-center > button';

    var 第一行的包 = 'body > div.app.app-content > section > main > div > div.runmain-tabs.el-tabs.el-tabs--card.el-tabs--top > div.el-tabs__content > div.page-inner > div.el-card.box-card.gap-top.component-card.is-always-shadow > div.el-card__body > div > div.startup-content > div > div > div > div.deploy-content > div > div > div.el-table.no-selectall.el-table--fit.el-table--border.el-table--scrollable-x.el-table--enable-row-hover.el-table--enable-row-transition.el-table--small > div.el-table__body-wrapper.is-scrolling-left > table > tbody > tr:nth-child(1)';

    var 第一行的包_下一步 = 'body > div.app.app-content > section > main > div > div.runmain-tabs.el-tabs.el-tabs--card.el-tabs--top > div.el-tabs__content > div.page-inner > div.el-card.box-card.gap-top.component-card.is-always-shadow > div.el-card__body > div > div.startup-content > div > div > div > div.deploy-content > div > div > div.form-footer > button.el-button.main-btn.el-button--primary.el-button--medium';

    var 服务器全选 = 'body > div.app.app-content > section > main > div > div.runmain-tabs.el-tabs.el-tabs--card.el-tabs--top > div.el-tabs__content > div.page-inner > div.el-card.box-card.gap-top.component-card.is-always-shadow > div.el-card__body > div > div.startup-content > div > div > div > div.deploy-content > div > div > div.instancetb > div.vxe-table--main-wrapper > div.vxe-table--body-wrapper.body--wrapper > table > tbody > tr > td:first > div > span > span.vxe-checkbox--icon.vxe-checkbox--unchecked-icon';

    var 服务器全选_下一步 = 'body > div.app.app-content > section > main > div > div.runmain-tabs.el-tabs.el-tabs--card.el-tabs--top > div.el-tabs__content > div.page-inner > div.el-card.box-card.gap-top.component-card.is-always-shadow > div.el-card__body > div > div.startup-content > div > div > div > div.deploy-content > div > div > div.form-footer > div > div:nth-child(2) > div > button > span';

    var 机器状态检查 = 'body > div > section > main > div > div.runmain-tabs.el-tabs.el-tabs--card.el-tabs--top > div.el-tabs__content > div.page-inner > div.el-card.box-card.gap-top.component-card.is-always-shadow > div.el-card__body > div > div.startup-content > div > div > div > div.deploy-content > div > div > div.form-footer > button:nth-child(3) > span';

    var 立即运行_最后一步 = 'body > div.app.app-content > section > main > div > div.runmain-tabs.el-tabs.el-tabs--card.el-tabs--top > div.el-tabs__content > div.page-inner > div.el-card.box-card.gap-top.component-card.is-always-shadow > div.el-card__body > div > div.startup-content > div > div > div > div.deploy-content > div > div > div.form-footer > div > div:nth-child(2) > div > button > span';

    var 测试_部署 = 'body > div.app.app-content > section > main > div > div.runmain-tabs.el-tabs.el-tabs--card.el-tabs--top > div.el-tabs__content > div.page-inner > div.el-card.box-card.gap-top.component-card.is-always-shadow > div.el-card__body > div > div.form-footer > div > div:nth-child(2) > div > div > div:nth-child(2) > div > button.el-button.main-btn.el-button--primary.el-button--small > span';

    var 构建;

    var 测试;

    var 预发;


    var _deploy_one = setInterval(function(){
        //console.info("_deploy_one")
        if($(头部空白处).length){

            var p = $('<button>',{
                type:'button',
                class:'el-button main-btn el-button--primary el-button--small',
                id:'gj'
            });

            var yyy = $('<span>',{
            });
            yyy.append('构建 & 一键部署');
            yyy.appendTo($(p))
            p.appendTo($('body > div.app.app-content > section > header'))

            clearInterval(_deploy_one);
        }
    }, 100)

    var _iIntervalID_one = setInterval(function(){
        //console.info("_iIntervalID_one")
        if($(头部空白处).length){

            var p = $('<button>',{
                type:'button',
                class:'el-button main-btn el-button--primary el-button--small',
                id:'yjbs'
            });

            var yyy = $('<span>',{
            });
            yyy.append('一键部署 >>> 测试&预发');
            yyy.appendTo($(p))
            p.appendTo($('body > div.app.app-content > section > header'))

            clearInterval(_iIntervalID_one);
        }
    }, 100)


    var _deploy_onasdfsafae = setInterval(function(){

        if($(框框父级).length>0){
            var len = $(框框父级).children('div').length;
            for (var i = 0; i <= len; i++) {
                var oo = $($(框框父级).children('div').get(i)).children('div').children('div').children('div').children('span').children('span');
                if(oo.length>0){
                    if(oo.html().indexOf("构建")>= 0){
                        构建=oo;
                        进度=$($(框框父级).children('div').get(i));
                    }else if(oo.html().indexOf("测试")>= 0){
                        测试=oo;
                    }else if(oo.html().indexOf("预发")>= 0){
                        预发=oo;
                    }
                }
            }
            clearInterval(_deploy_onasdfsafae);
        }
    }, 100)


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    $(document).on('click', '#gj' , function() {
        setTimeout(function(){
            $(构建).click();

            var _iIntervalID_zbfs = setInterval(function(){
                if($(构建立即运行).length){
                    setTimeout(function(){
                        $(构建立即运行).click();
                    },100);

                    clearInterval(_iIntervalID_zbfs);
                }

            }, 100)

            },200);
    })

    $(document).on('click', 构建立即运行 , function() {
        var _dddddfsdfsafas = setInterval(function(){
            if($(进度).length){
                if($(进度).html().indexOf("运行中")>= 0){
                    clearInterval(_dddddfsdfsafas);

                    var _bvnvbnbv = setInterval(function(){
                        console.info('运行中')

                        if($(进度).html().indexOf("已成功")>= 0){

                            console.info('已成功')

                            setTimeout(function(){
                                $('#yjbs').click();
                            },100);
                            clearInterval(_bvnvbnbv);
                        }

                    }, 1000)
                    }
            }
        }, 1000)
        });

    $(document).on('click', '#yjbs' , function() {

        setTimeout(function(){
            $(测试).click();
        },300);
        setTimeout(function(){
            $(测试_部署).click();
        },800);

    })


    $(document).on('click', 测试_部署 , function() {


        setTimeout(function(){
            $(测试).click();
        },100);
        setTimeout(function(){
            $(预发).click();

            var _iIntervalID_zbfs = setInterval(function(){
                if($(准备部署).length){
                    setTimeout(function(){
                        $(准备部署).click();
                    },100);

                    clearInterval(_iIntervalID_zbfs);
                }

            }, 100)

            },200);
    })



    $(document).on('click', 准备部署 , function() {

        var _iIntervalID_dyhdb = setInterval(function(){
            if($(第一行的包).length){
                $(第一行的包).click();
                setTimeout(function(){
                    $(第一行的包_下一步).click();
                },200);
                clearInterval(_iIntervalID_dyhdb);
            }
        }, 100)

        })

    $(document).on('click', 第一行的包_下一步, function() {
        var _iIntervalID_qx = setInterval(function(){
            if($(服务器全选).length>0){
                $(服务器全选).click();
                setTimeout(function(){
                    $(服务器全选_下一步).click();
                },200);
                setTimeout(function(){
                    $(机器状态检查).click();
                },800);
                setTimeout(function(){
                    $(立即运行_最后一步).click();
                },1200);
                clearInterval(_iIntervalID_qx);
            }
        }, 100)
        })




})();