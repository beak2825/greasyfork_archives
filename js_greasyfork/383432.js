// ==UserScript==
// @name         公需课在线学习平台 辅助工具
// @namespace    ggfw.gdhrss.gov.cn
// @version      2.0
// @description  自动播放视频，视频提问自动判断对错，作业快速回答
// @author       极品小猫
// @match        http://ggfw.gdhrss.gov.cn/zxpx/auc/play/player?*
// @match        http://ggfw.gdhrss.gov.cn/zxpx/auc/courseExam?*
// @match        http://ggfw.gdhrss.gov.cn/ssologin/login*
// @icon         http://ggfw.gdhrss.gov.cn/favicon.ico
// @grant        unsafeWindow
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/383432/%E5%85%AC%E9%9C%80%E8%AF%BE%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%20%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/383432/%E5%85%AC%E9%9C%80%E8%AF%BE%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%20%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var u=unsafeWindow,
        urls=location.href,
        path=location.pathname;

        var OptionConfig=OptionConfigFn('OptionConfig');



    if(path.search('player')>-1) {
        window.addEventListener('load',function(){
            if(OptionConfig.AutoPlayer) $('.prism-big-play-btn').click();
            $('video').addEventListener('ended',function(){
                Notif('视频播放已结束');
            });
            if(!$('.panel.window')) {
                MObserver('body', function(mutations, observer){
                    mutations.some(function(x){
                        x.addedNodes.forEach(function(e){
                            //对错选项提交
                            if(e.className=='panel window') {
                                observer.disconnect();//停止Body监听
                                console.log(e.className, '对话框已添加到 Body');
                                panduan();//第一次显示对话框，先执行判断操作
                                MObserver('.panel.window',function(pw_m, observer){
                                    console.log('属性发生变化', pw_m);
                                    pw_m.some(function(x){
                                        if(x.target.style.display=='block') {
                                            if(OptionConfig.VideoAnsTips) Notif('选择答案');
                                            if(OptionConfig.VideoAutoAns) panduan();//后续属性发送变化时执行判断操作
                                        }
                                    });
                                }, false, {attributes: true, attributeFilter: ["style"]});
                            }
                        });
                    });
                }, false, {childList: true});
            }
        });
    } else if(path.search('courseExam')>-1){
        if(OptionConfig.WorkAutoAns) {
            u.$('input[type="radio"][value="1"]').each(function(){
                this.checked=true;
            });
        }
    }

    //判断操作函数
    function panduan(){
        setTimeout(function(){
            $('[name="panduan"][value="1"]').checked=true;//默认选择正确
            if(Option_AnswerTips) subAnswer();//提交答案
            if(OptionConfig.VideoAnsTips) Notif('选择答案');
            setTimeout(function(){
                $('.l-btn-text').click();//确定
                $('.l-btn').click();//确定
            }, 3000);
        }, 2000);
    }

    function $(obj){
        return document.querySelector(obj);
    }

    function MObserver(selector, callback, kill, option){
        var watch = document.querySelector(selector);
        if (!watch) return;

        var observer = new MutationObserver(function(mutations){
            callback(mutations, observer);
            if(kill) console.log('停止'+selector+'的监控'),observer.disconnect();
        });
        observer.observe(watch, option||{childList: true, subtree: true});
    }

    function Notif(text){
        GM_notification(text, '', 'http://ggfw.gdhrss.gov.cn/favicon.ico')
    }


    function OptionConfigFn(ConfigName){
        //ConfigName —— localStorage 的Key，以JSON格式保存配置信息
        var settingUI=function(ConfigChange){
            if(!document.querySelector('#OptionConfigUI')) {
                var mainUI=u.$('<div style="width:550px;height:400px;position:fixed;left:25%;top:25%;padding:20px;background:#F5F8FD;z-index:9;font-size:16px;line-height:24px;text-align:justify;">').attr({'id':'OptionConfigUI'}).append(`
欢迎首次使用 公需课 辅助脚本，脚本程序为了提高学习速度而制作，在使用之前请先了解使用方法，如需保证正确率，请根据需要关闭自动回答的功能。
<br>默认对视频答案选择“对”，且自动提交回答。
<br>课程作业的判断题默认选择“对”，但不自动提交答卷。
<p style="color:red">自动登录功能以明文方式记录在浏览器的 localStorage 中，如担心泄漏，可不使用。</p><p></p>
<style>#OptionConfigUI>input{padding:0 5px;}</style>`),
                    Option_UserInfo=u.$('<div>').append('自动登录功能：','<input type="checkbox" id="Option_AutoLogin">','<label for="Option_AutoLogin">启用自动登录账户</label>','<br>','<input id="Option_UserName" placeholder="请输入账户名">','<input id="Option_PassWord" placeholder="请输入密码">'),
                    Option_AutoPlayer=u.$('<div>').append('<input type="checkbox" id="Option_AutoPlayer">','<label for="Option_AutoPlayer">开启自动播放视频</label>'),
                    Option_WorkAutoAns=u.$('<div>').append('<input type="checkbox" id="Option_WorkAutoAns">','<label for="Option_WorkAutoAns">开启“课程作业”自动答题</label>'),
                    Option_VideoAutoAns=u.$('<div>').append('<input type="checkbox" id="Option_VideoAutoAns">','<label for="Option_VideoAutoAns">开启“视频”自动答题</label>','<input type="checkbox" id="Option_VideoAnsTips">','<label for="Option_VideoAnsTips">开启“视频”答题提醒</label>');


                var OptionConfigBtn=u.$('<button>').text('提交').click(function(){
                    var OptionConfig_AutoPlayer=u.$('#Option_AutoPlayer').is(':checked'),
                        OptionConfig_WorkAutoAns=u.$('#Option_WorkAutoAns').is(':checked'),
                        OptionConfig_AutoLogin=u.$('#Option_AutoLogin').is(':checked'), OptionConfig_UserName=u.$('#Option_UserName').val(), OptionConfig_PassWord=u.$('#Option_PassWord').val(),
                        OptionConfig_VideoAutoAns=u.$('#Option_VideoAutoAns').is(':checked'), OptionConfig_VideoAnsTips=u.$('#Option_VideoAnsTips').is(':checked');
                    //自动登录填写情况验证
                    if(OptionConfig_AutoLogin) {
                        if(!OptionConfig_UserName) {
                            alert('未输入账户名');
                            return false;
                        }
                        if(!OptionConfig_PassWord) {
                            alert('未输入账户密码');
                            return false;
                        }
                    }

                    OptionConfig={
                        'AutoLogin':OptionConfig_AutoLogin,
                        'AutoPlayer':OptionConfig_AutoPlayer,
                        'WorkAutoAns':OptionConfig_WorkAutoAns,
                        'UserName':OptionConfig_UserName,
                        'PassWord':OptionConfig_PassWord,
                        'VideoAutoAns':OptionConfig_VideoAutoAns,
                        'VideoAnsTips':OptionConfig_VideoAnsTips
                    };
                    StorageDB(ConfigName).insert(OptionConfig);
                    u.$('#OptionConfigUI').remove();
                });
                mainUI.append('<br>', Option_UserInfo, '<br>', Option_AutoPlayer, '<br>', Option_VideoAutoAns, '<br>', Option_WorkAutoAns, '<br>', OptionConfigBtn).appendTo('body');

                //配置信息读取
                if(ConfigChange) {
                    OptionConfig=StorageDB(ConfigName).read();
                    u.$('#Option_AutoLogin').attr('checked', OptionConfig.AutoLogin);
                    u.$('#Option_AutoPlayer').attr('checked', OptionConfig.AutoPlayer);
                    u.$('#Option_WorkAutoAns').attr('checked', OptionConfig.WorkAutoAns);
                    u.$('#Option_VideoAutoAns').attr('checked', OptionConfig.VideoAutoAns);
                    u.$('#Option_VideoAnsTips').attr('checked', OptionConfig.VideoAnsTips);
                    u.$('#Option_UserName').val(OptionConfig.UserName);
                    u.$('#Option_PassWord').val(OptionConfig.PassWord);
                }
            }
        }

        var settingBtn=function(){
            var right=10,
                bottom=10;
            u.$('<div style="text-align:center">').css({'font-size':'18px','width':'80px','height':'80px','line-height':'80px','position':'fixed','right':'10px','bottom':bottom,'background':'#ccc','cursor':'pointer'}).text('设置').click(function(){
                settingUI(true);
            }).appendTo('body');
        }

        //如果存在配置信息，读取配置信息
        if(!localStorage[ConfigName]) {
            settingUI(); //界面并修改配置信息
        } else {
            //读取配置信息
            OptionConfig=StorageDB(ConfigName).read();
            console.log(OptionConfig, OptionConfig.AutoLogin);
            if(OptionConfig.AutoLogin) {
                var t=setInterval(function(){
                    if($('#password_personal')) {
                        u.$('#username_personal').val(OptionConfig.UserName);
                        u.$('#password_personal').val(OptionConfig.PassWord);
                        clearInterval(t);
                    }
                }, 100);
            }
        }
        settingBtn();
        return OptionConfig;

        function StorageDB(collectionName) {
            //如果没有 集合名，则使用默认 default
            collectionName = collectionName ? collectionName : 'default';
            //创建JSON缓存，如果缓存存在，则转为JSON，否则新建
            var cache = localStorage[collectionName] ? JSON.parse(localStorage[collectionName]) : {};

            return {
                add : function(name, value) {
                    cache[name]=value;
                    localStorage.setItem(collectionName, JSON.stringify(cache));        //回写 localStorage
                },
                del:function(name) {
                    if(name) {
                        console.log(cache,cache[name]);
                        delete cache[name];
                        localStorage.setItem(collectionName, JSON.stringify(cache));        //回写 localStorage
                    } else {
                        //删除整个 localStorage 数据
                        localStorage.removeItem(name);
                    }
                },
                insert: function(obj){
                    localStorage.setItem(collectionName, JSON.stringify(obj));
                },
                Updata : function(name,obj,value){
                    cache[obj]=cache[obj]||{};
                    cache[obj][name]=value;
                    localStorage.setItem(collectionName, JSON.stringify(cache));        //回写 localStorage
                },
                Query : function(obj,name){
                    return cache[obj]?name?(cache[obj][name]?cache[obj][name]:null):cache[obj]:null;
                },
                find : function(name) {
                    if(!collectionName) return false;
                    return cache[name];
                },
                read : function(){
                    return u.$.isEmptyObject(cache)?null:cache;//如果为空，则返回 null
                },
                deleteExpires : function(now){
                    now=now||$.now();
                    for(var i in cache) {
                        //console.log(i, collectionName, now, cache[i]['exp'], now>cache[i]['exp']); //删除记录显示
                        //console.log(cache[i], localStorage[i]);
                        if(now>cache[i]['exp']) {
                            delete localStorage[i];     //删除对应分享 ID 的记录
                            this.del(i);                //删除时间表中的记录
                        }
                    }
                }
            };
        }
    }
})();