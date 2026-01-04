// ==UserScript==
// @name         B站游戏wiki ——支线任务完成标记
// @namespace      https://greasyfork.org/users/3128
// @version       0.3.8
// @description    对H3任务标题添加【任务标记】、【内容折叠】功能，以便于了解自己完成的任务。对树桩、宝箱添加标记功能，记录领取状态。
// @author       极品小猫
// @match        https://wiki.biligame.com/yanyu/*
// @match        https://wiki.biligame.com/sr/*
// @exclude      https://wiki.biligame.com/yanyu/%E6%B8%B8%E6%88%8F%E6%94%AF%E7%BA%BF
// @require         https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant          GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/448287/B%E7%AB%99%E6%B8%B8%E6%88%8Fwiki%20%E2%80%94%E2%80%94%E6%94%AF%E7%BA%BF%E4%BB%BB%E5%8A%A1%E5%AE%8C%E6%88%90%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/448287/B%E7%AB%99%E6%B8%B8%E6%88%8Fwiki%20%E2%80%94%E2%80%94%E6%94%AF%E7%BA%BF%E4%BB%BB%E5%8A%A1%E5%AE%8C%E6%88%90%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let u=unsafeWindow,
        webHost=location.host.toLowerCase(),
        webPath=location.pathname;

    let wgConfig,
        wgGameName,
        wgPageName;
    let GM_Config, GM_Config_Task={},
        GMAPI={
            save(TableName, Data) {
                GM_setValue('update', new Date().getTime());
                if(arguments.length===0)
                    GM_setValue(wgGameName, GM_Config);
            }
        }

    if(webHost==='wiki.biligame.com') {
        wgConfig = u?.RLCONF || u?.mw?.config.get(),
            wgGameName = wgConfig?.wgGameName, //游戏Wiki名
            wgPageName = wgConfig?.wgPageName; //页面标题
        if(!wgPageName) alert(`加载基础数据失败，请刷新页面。`);

        GM_Config=GM_getValue(wgGameName, {});


        //转换 1.0 版本储存于 localStorage 的配置数据，使用 GM 存储 API 保存数据
        if(localStorage[wgPageName]) {
            GM_Config_Task=JSON.parse(localStorage[wgPageName]);
            GMAPI.save();
            delete localStorage[wgPageName];
        }
        if(!GM_Config[wgPageName]) {
            //转换 2.0 版本存储于 根节点 的配置数据，数据保存于 Wiki 对应的名称下，便于支持多 Wiki
            GM_Config_Task=GM_getValue(wgPageName, {});
            GM_Config[wgPageName]=GM_Config_Task;
            GM_deleteValue(wgPageName);
            GMAPI.save();
        } else {
            GM_Config_Task=GM_Config[wgPageName];
        }

        GM_addStyle(`
                input[title="任务完成标记"]{width:80px;height80px}
                /*解决信息盒子没有新信息时塌陷的问题*/
                .oo-ui-popupWidget-body {min-height:300px;}
                `);
        let Bind={
            InputClick(e) { // @Rank = 归类
                //console.log(this, e);
                if(e.data.Rank) {
                    if(!GM_Config_Task[e.data.Rank]) GM_Config_Task[e.data.Rank]={};
                    GM_Config_Task[e.data.Rank][e.data.key]=e.target.checked;
                }
                else GM_Config_Task[e.data.key]=e.target.checked;
                GMAPI.save();
            }
        }

        //专用功能
        switch(wgGameName) {
            case 'yanyu':
                //首页
                if(webPath.includes('%E9%A6%96%E9%A1%B5')) {
                    let hideModule=$('#游戏更新, #同人专区, #烟雨江湖WIKI, #游戏公告, #凤鸣书院, #其他作品')
                    //模块标题隐藏
                    hideModule.parent().hide();
                    //模块内容隐藏
                    hideModule.parent().next().hide();
                    $('#视频攻略').parentsUntil('small').parent().hide()
                    //答题辅助图片
                    $('a[title="答题辅助"]').parentsUntil('.sy-box-css, .sy-box-css-n').parent().hide();
                    $('.wikipoke img, img[alt="世界地图.png"]').hide();

                } else if(webPath.includes('%E7%AD%94%E9%A2%98%E8%BE%85%E5%8A%A9')) {
                    //答题辅助页面
                    let t=setInterval(function(e){
                        if($('.form-control.searcher-text').length>0) {
                            $('.form-control.searcher-text').focus(function(){
                                console.log($(this).select());
                                $(this).select();
                            });
                            clearInterval(t);
                        }
                    }, 1000);
                }

                //地图导航追加
                let MapModule=$('<div class="wiki-menu-li-1">'),
                    MapModuleTitle=$('<a href="javascript:;" class="menu-title">').text('世界地图').append('<span class="caret"></span>'),
                    MapModuleMenuUl2=$('<div class="wiki-menu-ul-2 " style="display: none;">'),
                    MapModuleMenuUl2_li2=$('<div class="wiki-menu-li-2">').append($('<a href="javascript:;" class="menu-title">').text('城镇').append('<span class="caret nav-rotate"></span>')),
                    MapModuleMenuUl3=$('<div class="wiki-menu-ul-3">');
                //遍历地图添加
                $('div[title="城镇"] a').each((i,e)=>{
                    let menu_Li=$('<div class="wiki-menu-li-3">').append($(e).clone().addClass('ment-title').text(e.textContent))
                    MapModuleMenuUl3.append(menu_Li);
                });
                MapModule.append(MapModuleTitle, MapModuleMenuUl2.append(MapModuleMenuUl2_li2.append(MapModuleMenuUl3)))
                $('.menu-wrap').prepend(MapModule)

                //树桩、宝箱添加标记框
                $('#TbPn-shuzhuang .wikitable tr:not(:first-child), #TbPn-baoxiang .wikitable tr:not(:first-child), #TbPn-sousuo .wikitable tr:not(:first-child)').each(function(i, e){
                    let td=$('<td>'),
                        boxPosition = $(this).find('td:nth-child(-n+2):not([rowspan])').text().trim().replace(/，/,',').replace(/[^\d,]/g,''), //获取树桩、宝箱坐标信息
                        checkBox = $('<input type="checkBox" title="标记物品已领取">').attr({id:`checkBox_${boxPosition}`}).on('click', {key: boxPosition, Rank: '资源'}, Bind.InputClick);
                    checkBox.prop('checked', GM_Config_Task?.['资源']?.[boxPosition]);
                    $(this).append(td.append(checkBox));
                });

                break;
        }

        /**
         * 通用功能
         */

        //首页不生效
        if(!webPath.includes('%E9%A6%96%E9%A1%B5')) {
            //遍历任务导航层级，获得最后一级导航
            let toclevel;
            for(let i=2;i>0;i--) {
                //console.log(i, `.toclevel-${i}`, document.querySelector(`.toclevel-${i}`));
                if(document.querySelector(`.toclevel-${i}`)) {
                    toclevel=`.toclevel-${i}`;
                    let taskTitleID=$(toclevel).find('a[href^="#"]').attr('href').replace('#','');
                    if($(`#${taskTitleID}`).parent().prop("tagName")==='H4') continue;
                    break;
                }
            }

            if(toclevel) {
                $(toclevel).each(function(i, e){ //遍历二级标题
                    let this_toc=this;

                    let taskTitleID=$(this).find('a[href^="#"]').attr('href').replace('#',''), //获得锚点作为ID
                        taskInputID=`checkTask_${taskTitleID}`, //使用任务锚点作为任务ID，避免出现同名任务
                        //获得任务ID，并过滤掉一些影响ID使用的特殊字符
                        taskTitleID_Selector=taskTitleID.replace(/([:.])/g,'\\$1');

                    let checkTask=$('<input type="checkbox" title="任务完成标记">').attr({id:taskInputID}).click(function(e, aa){
                        GM_Config_Task[taskTitleID]=this.checked;
                        GMAPI.save();
                        if(this.checked) {
                            $(this_toc).append('<span class="checkTask">√</span>');
                            headLineBox_ContentBox.show()
                        }
                        else {
                            $(this_toc).find('.checkTask').remove();
                            headLineBox_ContentBox.hide()
                        }

                    });

                    //插入任务完成标记Input
                    $(`#${taskTitleID_Selector}`).before(checkTask);

                    let label=$('<label>').attr({for:taskInputID}).text(taskTitleID);
                    $(`#${taskTitleID_Selector}`).parent().find('.mw-headline').html(label); //在标题前插入复选框

                    let headLineBox=$(`#${taskTitleID_Selector}`).parent(); //任务标题获得父容器

                    //创建内容容器
                    let headLineBox_ContentBox=$(`<div data-taskTitle="${taskTitleID}">`);
                    headLineBox_ContentBox.append(headLineBox.nextUntil('h2, h3')); //遍历获得父容器间的内容，并填充

                    headLineBox.click((e)=>{
                        headLineBox_ContentBox.toggle();
                    }); //为标题父容器添加折叠事件
                    label.click(()=>{
                        headLineBox_ContentBox.toggle();
                    });


                    headLineBox_ContentBox.insertAfter(headLineBox);
                    //读取任务状态
                    if(GM_Config_Task[taskTitleID]) {
                        checkTask.prop('checked', GM_Config_Task[taskTitleID]||false); //变更配置数据
                        $(this).append('√'); //添加任务状态
                        headLineBox_ContentBox.hide(); //隐藏掉任务内容
                    }
                });
            }
        }
    }

    // Your code here...
})();