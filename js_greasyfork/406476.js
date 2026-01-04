// ==UserScript==
// @name         KeyJoker Auto Task
// @namespace    KeyJokerAutoTask
// @version      1.6.1
// @description  KeyJoker Auto Task Script
// @description:zh-cn  KeyJoker 的任务自动化脚本
// @author       祭夜
// @icon         https://www.jysafe.cn/assets/images/avatar.jpg
// @match      *://www.keyjoker.com/entries*
// @match      *://assets.hcaptcha.com/*
// @match      https://www.twitch.tv/settings/profile?keyjokertask=*
// @match      https://twitter.com/settings/account?keyjokertask=*
// @match      http://localhost:3001*
// @match      https://msojocs.github.io/keyjoker-script*
// @supportURL   https://greasyfork.org/zh-CN/scripts/406476-keyjoker-auto-task/feedback
// @homepage     https://github.com/msojocs/keyjoker-script/
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_getResourceText
// @connect      hcaptcha.com
// @connect      store.steampowered.com
// @connect      steamcommunity.com
// @connect      twitter.com
// @connect      facebook.com
// @connect      discord.com
// @connect      twitch.tv
// @connect      tumblr.com
// @connect      spotify.com
// @connect      task.jysafe.cn
// @connect      raw.fastgit.org
// @connect      127.0.0.1
// @resource iconfont https://at.alicdn.com/t/font_3156299_07qky93uxv0e.css
// @require      https://lib.baomitu.com/jquery/3.3.1/jquery.min.js
// @require      https://lib.baomitu.com/i18next/21.3.0/i18next.min.js
// @require      https://lib.baomitu.com/jquery-i18next/1.2.1/jquery-i18next.min.js
// @require      https://unpkg.com/i18next-http-backend@1.3.2/i18nextHttpBackend.min.js
// @require      https://cdn.jsdelivr.net/gh/msojocs/keyjoker-script@9a84040672898ece9d677e72c7617f95d7c92c86/keyjoker.ext.js
// @downloadURL https://update.greasyfork.org/scripts/406476/KeyJoker%20Auto%20Task.user.js
// @updateURL https://update.greasyfork.org/scripts/406476/KeyJoker%20Auto%20Task.meta.js
// ==/UserScript==
// @require      http://task.jysafe.cn/keyjoker/script/keyjoker6.ext.js

(function() {
    'use strict';
    const debug = false;

    const languagePrefix = "https://cdn.jsdelivr.net/gh/msojocs/keyjoker-script@master/locales"
    const KJConfig = GM_getValue('KJConfig') || {
        language: navigator.language
    }
    // iconfont
    GM_addStyle(GM_getResourceText('iconfont'))

    const discordAuth = GM_getValue('discordAuth') || {
        enable: false,
        authorization: "",
        status:0,
        updateTime: 0
    }
    // steam信息
    const steamConfig = GM_getValue('steamInfo') || {
        userName: '',
        steam64Id: '',
        communitySessionID: '',
        storeSessionID: '',
        comUpdateTime: 0,
        storeUpdateTime: 0
    }
    const twitchConfig = GM_getValue('twitchAuth') || {
        "auth-token": "",
        status:0,
        updateTime: 0
    }
    const twitterConfig = GM_getValue('twitterAuth') || {
        authorization: "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
        ct0: '',
        status: 0,
        updateTime: 0
    }
    const ignoreList = GM_getValue('ignoreList') || [];

    const jq = $;
    const kjData = offlineData;
    unsafeWindow.jq = jq
    let completeCheck = null;

    // 监听处理器hook
    window.pro_elt_addEventListener=Element.prototype.addEventListener;
    Element.prototype.addEventListener=function(){
        if(!this.eventList) this.eventList={};
        if(!this.eventList[arguments[0]]) this.eventList[arguments[0]]=[];
        this.eventList[arguments[0]].push(arguments[1]);

        // fix dropdown
        if(this.id === 'user-dropdown' && this.eventList?.click?.length === 1)return;

        window.pro_elt_addEventListener.apply(this,arguments);
    };

    // 0-未动作|200-成功取得|401未登录|603正在取得
    const getAuthStatus = {
        discord: false,
        spotify: false,
        steamStore: 0,
        steamCom: 0,
        // tumblr: false,
        twitch: false,
        twitter: 0
    }
    var checkSwitchId = null;
    const noticeFrame = {
        loadFrame: ()=>{
            log.log("loadFrame");
            jq('body').append(`<style>
            .hidden{display:none!important}
.fuck-task-logs li{display:list-item !important;float:none !important}
#extraBtn .el-badge.item{margin-bottom:4px !important}
#extraBtn .el-badge.item sup{padding-right:0 !important}
.fuck-task-logs{width:auto;max-width:50%;max-height:50%;z-index:99999999999 !important}
.fuck-task-logs .el-notification__group{width:100%}
.fuck-task-logs .el-notification__title{text-align:center}
.fuck-task-logs .el-notification__content{overflow:auto;max-height:230px}
font.start{color:black;}
font.success{color:green;}
font.error{color:red;}
font.warning{color:#00f;}
font.wait{color:#9c27b0;}
.el-notification{display:-webkit-box;display:-ms-flexbox;display:flex;padding:14px 26px 14px 13px;border-radius:8px;-webkit-box-sizing:border-box;box-sizing:border-box;border:1px solid #ebeef5;position:fixed;background-color:#fff;-webkit-box-shadow:0 2px 12px 0 rgba(0,0,0,.1);box-shadow:0 2px 12px 0 rgba(0,0,0,.1);-webkit-transition:opacity .3s,left .3s,right .3s,top .4s,bottom .3s,-webkit-transform .3s;transition:opacity .3s,left .3s,right .3s,top .4s,bottom .3s,-webkit-transform .3s;transition:opacity .3s,transform .3s,left .3s,right .3s,top .4s,bottom .3s;transition:opacity .3s,transform .3s,left .3s,right .3s,top .4s,bottom .3s,-webkit-transform .3s;overflow:hidden}
.el-notification__group{margin-left:13px;margin-right:8px}
.el-notification__title{font-weight:700;font-size:16px;color:#303133;margin:0}
.el-notification__content{font-size:14px;line-height:21px;margin:6px 0 0;color:#606266;text-align:justify}
.el-notification__content p{margin:0}
.el-badge{position:relative;vertical-align:middle;display:inline-block}
.el-badge__content{background-color:#f56c6c;border-radius:10px;color:#fff;display:inline-block;font-size:12px;height:18px;line-height:18px;padding:0 6px;text-align:center;white-space:nowrap;border:1px solid #fff}
.el-badge__content.is-fixed{position:absolute;top:10px;right:10px;-webkit-transform:translateY(-50%) translateX(100%);transform:translateY(-50%) translateX(100%)}
.el-badge__content.is-fixed.is-dot{right:8px}
.el-badge__content.is-dot{height:8px;width:8px;padding:0;right:0;border-radius:50%}
.el-button{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}
.el-button{-webkit-box-sizing:border-box}
.el-button{display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;background:#fff;border:1px solid #dcdfe6;color:#606266;-webkit-appearance:none;text-align:center;box-sizing:border-box;outline:0;margin:0;-webkit-transition:.1s;transition:.1s;font-weight:500;padding:12px 20px;font-size:14px;border-radius:4px}
.el-button:focus,.el-button:hover{color:#409eff;border-color:#c6e2ff;background-color:#ecf5ff}
.el-button:active{color:#3a8ee6;border-color:#3a8ee6;outline:0}
.el-button::-moz-focus-inner{border:0}
.el-button.is-circle{border-radius:50%;padding:15px}
#extraBtn .el-button.is-circle{padding:8px !important}
</style>

<div role="alert" class="el-notification fuck-task-logs right" style="bottom: 16px; z-index: 2000;">
    <div class="notification el-notification__group">
        <h2 id="extraBtn" class="el-notification__title">

            <div class="el-badge item">
                <button id="checkUpdate" type="button" class="el-button el-button--default is-circle" data-i18n="[title]notification.checkUpdate" title="检查更新">
                    <i class="iconfont icon-update"></i>
                </button>
                <sup class="el-badge__content el-badge__content--undefined is-fixed is-dot" style="display: none;"></sup>
            </div>

            <div class="el-badge item">
                <button id="fuck" type="button" class="el-button el-button--default is-circle" data-i18n="[title]notification.startTask" title="开始做任务">
                    <i class="iconfont icon-Start-01"></i>
                </button>
                <sup class="el-badge__content el-badge__content--undefined is-fixed is-dot" style="display: none;"></sup>
            </div>
            <div class="el-badge item hidden" >
                <button id="pause-fuck" type="button" class="el-button el-button--default is-circle" data-i18n="[title]notification.pauseTask" title="暂停做任务">
                    <i class="iconfont icon-Stop"></i>
                </button>
                <sup class="el-badge__content el-badge__content--undefined is-fixed is-dot" style="display: none;"></sup>
            </div>
            <div class="el-badge item hidden" >
                <button id="stop-fuck" type="button" class="el-button el-button--default is-circle" data-i18n="[title]notification.stopTask" title="停止做任务">
                    <i class="iconfont icon-Stop"></i>
                </button>
                <sup class="el-badge__content el-badge__content--undefined is-fixed is-dot" style="display: none;"></sup>
            </div>

            <div class="el-badge item"><button id="changeLog" type="button" class="el-button el-button--default is-circle" data-i18n="[title]notification.viewChangelog" title="查看更新内容">
                    <i class="iconfont icon-text"></i>
                </button>
                <sup class="el-badge__content el-badge__content--undefined is-fixed is-dot" style="display: none;"></sup>
            </div>

            <div class="el-badge item">
                <button type="button" id="setting" class="el-button el-button--default is-circle" data-i18n="[title]notification.setting" title="设置">
                    <i class="iconfont icon-setting"></i>
                </button>
                <sup class="el-badge__content el-badge__content--undefined is-fixed is-dot" style="display: none;"></sup>
            </div>

            <div class="el-badge item">
                <button id="clearNotice" type="button" class="el-button el-button--default is-circle" data-i18n="[title]notification.clearLog" title="清空执行日志">
                    <i class="iconfont icon-clear"></i>
                </button>
                <sup class="el-badge__content el-badge__content--undefined is-fixed is-dot" style="display: none;"></sup>
            </div>

            <div class="el-badge item">
                <button id="report" type="button" class="el-button el-button--default is-circle" data-i18n="[title]notification.bugReport" title="提交建议/BUG">
                    <i class="iconfont icon-bug-report"></i>
                </button>
                <sup class="el-badge__content el-badge__content--undefined is-fixed is-dot" style="display: none;"></sup>
            </div>
        </h2>
        <h2 class="el-notification__title" data-i18n="notification.logForRunning">任务执行日志</h2>
        <div class="el-notification__content">
            <span class="${!debug?'hidden':''}" data-i18n="test.one" data-i18n-options='{"a": "123"}'>test</span>
            <p></p>
        </div>
    </div>
</div>
`)
        },
        // 添加
        addNotice: function(data){
            switch(data.type)
            {
                case "taskStatus":
                    jq('.el-notification__content').append(`<li>${data.task.task.name}<a href="${data.task.data.url}" target="_blank">${(data.task.data.name||data.task.data.username)}</a>|<font id="${data.task.id}" class="${data.status}">${data.status}</font></li>`);
                    break;
                case "msg":
                    jq('.el-notification__content').append(`<li>${data.msg}</li>`);
                    break;
                case "authVerify":
                    jq('.el-notification__content').append(`<li>${data.name} |<font id="${data.status.id}" class="${data.status.class}">${data.status.text}</font></li>`);
                    break;
                default:
                    jq('.el-notification__content').append(`<li>${data}</li>`);
                    break;
            }
            if(jq('.notification').localize)jq('.notification').localize();
        },
        // 清空
        clearNotice:()=>{
            jq('.el-notification__content li').remove();
        },
        // 更新
        updateNotice: function(id, result){
            jq(`font#${id}`).removeClass()
            jq(`font#${id}`).addClass(result.class)
            jq(`font#${id}`).text(result.text)
        },
    }
    const KJModal = {
        show: (config)=>{
            const html = `<div id="custom-modal" tabindex="-1" role="dialog" aria-labelledby="fraud-warning-modal-title" class="modal fade show" style="display: block; padding-right: 15px;" aria-modal="true">
          <div role="document" class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                 <div class="modal-header">
                     <h5 id="fraud-warning-modal-title" class="modal-title" data-i18n="modal.${config?.title ?? 'title'}">${config?.title ?? 'title'}</h5>
                     <button id="custom-modal-close" type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button>
                 </div>
                 <div class="modal-body">${config?.content ?? 'content'}</div>
                 <div class="modal-footer">
                    <button id="custom-modal-cancel" class="btn btn-secondary" data-i18n="modal.${config?.cancelText??'cancel'}">${config?.cancelText??'Cancel'}</button>
                    <button id="custom-modal-confirm" class="btn btn-primary" data-i18n="modal.${config?.comfirText??'confirm'}">${config?.comfirText??'Okay'}</button>
                 </div>
             </div><!--modal-content-->
            </div><!--document-->
         </div>
         <div class="modal-backdrop fade show"></div>`

            return new Promise((resolve, reject)=>{
                if(jq('#custom-modal').length === 1){
                    jq('#custom-modal').remove()
                    jq('.modal-backdrop, .fade, .show').remove()
                }
                const ele = jq('body').append(html)

                jq('#custom-modal').localize(config?.options ?? null)

                jq('#custom-modal-close').click(()=>{
                    jq('#custom-modal').remove()
                    jq('.modal-backdrop, .fade, .show').remove()
                    reject()
                })
                jq('#custom-modal-cancel').click(()=>{
                    jq('#custom-modal').remove()
                    jq('.modal-backdrop, .fade, .show').remove()
                    reject()
                })
                jq('#custom-modal-confirm').click(()=>{
                    jq('#custom-modal').remove()
                    jq('.modal-backdrop, .fade, .show').remove()
                    resolve()
                })
            })
        }
    }
    const log = (()=>{
        const log = (...data)=>{
            if(debug)console.log("KJ", ...data)
        }
        const info = (...data)=>{
            if(debug)console.info("KJ", ...data)
        }
        const error = (...data)=>{
            console.error("KJ", ...data)
        }
        const warn = (...data)=>{
            if(debug)console.warn("KJ", ...data)
        }
        return {
            log,
            info,
            warn,
            error
        }
    })();
    const HTTP = (function(){
        // [修改自https://greasyfork.org/zh-CN/scripts/370650]
        const httpRequest = function (e) {
            const requestObj = {}
            requestObj.url = e.url
            requestObj.method = e.method.toUpperCase()
            requestObj.timeout = e.timeout || 30000
            if (e.responseType) requestObj.responseType = e.responseType
            if (e.headers) requestObj.headers = e.headers
            if (e.binary) requestObj.binary = e.binary;
            if (e.data) requestObj.data = e.data
            if (e.cookie) requestObj.cookie = e.cookie
            if (e.anonymous) requestObj.anonymous = e.anonymous
            if (e.onload) requestObj.onload = e.onload
            if (e.fetch) requestObj.fetch = e.fetch
            if (e.onreadystatechange) requestObj.onreadystatechange = e.onreadystatechange
            requestObj.onerror = e.onerror || function (data) {
                log.info('请求出错:', data)
            }
            requestObj.ontimeout = e.ontimeout || function (data) {
                log.info('请求超时:', data)
                e.onerror({reason: 'ontimeout', status: 408, data})
            }
            requestObj.onabort = e.onabort || function (data) {
                log.info('请求终止:', data)
                e.onerror({reason: 'abort', data})
            }
            log.info('发送请求:', requestObj)
            GM_xmlhttpRequest(requestObj);
        }
        function get(url, data={}, e = {}){
            return new Promise((resolve, reject)=>{
                e.url = url;
                e.method = "GET";
                e.data = data;
                e.onload = resolve;
                e.onerror = reject;
                httpRequest(e)
            })
        }
        function post(url, data={}, e = {}){
            return new Promise((resolve, reject)=>{
                e.url = url;
                e.method = "POST";
                e.data = data;
                e.onload = resolve;
                e.onerror = reject
                httpRequest(e);
            })
        }
        function put(url, data={}, e = {}){
            return new Promise((resolve, reject)=>{
                e.url = url;
                e.method = "PUT";
                e.data = data;
                e.onload = resolve
                e.onerror = reject
                httpRequest(e);
            })
        }
        return {
            GET: get,
            POST: post,
            PUT: put
        }
    })();
    try{
        const checkTask = {
            reLoad: function (time){
                let date=new Date();
                let hour=date.getHours();
                let min=date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes();
                if(GM_getValue("start")==1){
                    jq(".border-bottom > #checkTime").text(`${hour}:${min}`);
                    log.info(`检测：${parseInt(new Date().getTime()/1000)}`)
                    jq.ajax({
                        url:"/entries/load",
                        type:"get",
                        headers:{'x-csrf-token': jq('meta[name="csrf-token"]').attr('content')},
                        success:(data,status,xhr)=>{
                            // 忽略处理，不做的任务处理
                            const disabledTask = GM_getValue('taskDisabled') || {}
                            log.log(disabledTask)
                            // 过滤出不在忽略列表且要做的任务
                            log.log('actions before filter', data.actions)
                            data.actions = data.actions.filter(e=>ignoreList.indexOf(e.id)===-1 && !disabledTask[e.task.provider.icon])
                            log.log('actions after filter', data.actions)

                            log.info("检测是否新增")
                            if(data && (data.actions && (data.actions.length > 0) )){
                                log.info("检测是否新增", "是")
                                log.log(data);
                                let date=new Date();
                                let hour=date.getHours();
                                let min=date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes();
                                jq(".border-bottom").html(`${hour}:${min} <span data-i18n='message.newTaskAvailable'>检测到新任务（暂停检测）</span>`);

                                // 清空提示
                                noticeFrame.clearNotice();
                                // 关闭检测开关
                                GM_setValue("start", 0);
                                // 菜单显示更新
                                checkSwitch();

                                log.info("更新列表")
                                kjData.loadData.actions = data.actions
                                kjData.loadData.reward = data.reward
                                kjData.loadData.isLoading = false

                                log.info("做任务")
                                func.do_task(data);
                            }else{
                                log.info("检测是否新增", "否")
                                setTimeout(()=>this.reLoad(time), time);
                            }
                        },
                        error:(err)=>{
                            window.location.reload(true);
                        }
                    });
                }
            },
            setTime: function (){
                let time=prompt('请输入获取任务信息的时间间隔(单位:秒)：');
                if(!isNaN(time)){
                    GM_setValue("time",parseInt(time));
                }
            },
            start: function (r = null){
                let time = GM_getValue("time");
                if(!time){
                    time=60;
                }

                KJModal.show({
                    title: 'exeConfirm',
                    content: `<span data-i18n="modal.exeConfirm1" data-i18n-options='{"time": ${time}}'></span>`,
                }).then(()=>{
                    log.log('确认')
                    if(GM_getValue('start') === 1)return;
                    GM_setValue("start",1);
                    if(r)r();
                    this.next();
                }).catch(()=>{
                    log.log('取消')
                })
            },
            next: function (){
                if(kjData.loadData)kjData.loadData.actions = []
                //kjData.loadData.isLoading = true
                jq(".border-bottom").html("<span id='checkTime'></span><span data-i18n='message.executing'>执行新任务检测</span>");
                jq(".border-bottom").localize && jq(".border-bottom").localize()
                // 关闭弹窗提示
                document.cookie = "fraud_warning_notice=1; expires=Sun, 1 Jan 2030 00:00:00 UTC; path=/"
                // 初始化凭证获取状态
                getAuthStatus.spotify = false;
                getAuthStatus.steamStore = 0;
                getAuthStatus.steamCom = 0;
                // getAuthStatus.tumblr = false;
                getAuthStatus.twitch = false;
                getAuthStatus.twitter = 0;

                // 切换按钮
                jq('#fuck').parent().addClass('hidden')
                jq('#pause-fuck').parent().addClass('hidden')
                jq('#stop-fuck').parent().removeClass('hidden')

                let time = GM_getValue("time");
                if(!time){
                    time=60;
                }
                this.reLoad(time*1000);
            },

        }
        // 模拟点击
        const DISCORD = (()=>{
            // 在KJ界面执行
            const JoinServer = (r, data)=>{
                log.info("加入discord", data.url)
                const url = data.url;
                GM_openInTab(`${url}?keyjokertask=joinDiscord&taskid=${data.id}`, true);
                let before = GM_getValue("discord") || {}
                before[data.id] = 0
                GM_setValue("discord", before)
                let checkInterval;
                const checkDiscordTaskStatus = ()=>{
                    let status = GM_getValue("discord") || {}
                    if(status[data.id] !== 0){
                        r(status[data.id])
                        clearInterval(checkInterval)
                    }
                }
                checkInterval = setInterval(checkDiscordTaskStatus, 1000)
            }
            // 在Discord邀请页面执行
            const JoinServer2 = ()=>{
                log.info('JoinServer2')
                window.onbeforeunload = window.onunload = ()=>{
                    log.info('溜了溜了')
                    window.close()
                }
                let status = GM_getValue("discord") || {}
                const clickAction = ()=>{
                    let search = location.search
                    if(search == null){
                        log.info("discord", "search获取失败")
                        return;
                    }
                    let match = search.match(/taskid=(\d+)/)
                    if(match == null){
                        log.info("discord", "taskid获取失败")
                        return;
                    }
                    let id = match[1]

                    if(jq("input[name='username']").length === 1 || jq("input[name='email']").length === 1){
                        // 未登录
                        log.info("discord", "未登录")
                        status[id]= 401
                    }else if(jq('button').length === 2){
                        status[id]= 404
                        log.info("discord", "服务器不存在")
                    }else if(jq('button').length === 1){
                        status[id]= 200
                        log.info("discord", "加入服务器")
                        jq('button').click()
                        setTimeout(window.close, 1000)
                    }
                    GM_setValue("discord", status)
                }
                setInterval(clickAction, 1000)
            }
            return {
                JoinServer: JoinServer,
                JoinServer2: JoinServer2,
            }
        })();
        // 自动化
        const DISCORD2 = (()=>{
            const AuthUpdate = (update = false)=>{
                return new Promise((resolve, reject)=>{
                    if (new Date().getTime() - discordAuth.updateTime < 30 * 60 * 1000 && discordAuth.status == 200 && !update) {
                        log.info("DISCORD: 直接使用未过期的Auth")
                        resolve(200)
                        return;
                    }
                    if(false == getAuthStatus.discord || true === update)
                    {
                        getAuthStatus.discord = true;
                        const tab = GM_openInTab("https://discord.com/channels/@me?keyjokertask=storageAuth", {active: false, insert: true, setParent: true});
                        tab.onclose = ()=>{
                            if(GM_getValue("discordAuth") && new Date().getTime() - GM_getValue("discordAuth").updateTime <= 10 * 1000)
                            {
                                if(GM_getValue("discordAuth").status != 200)
                                {
                                    reject(GM_getValue("discordAuth").status)
                                    return;
                                }
                                discordAuth.authorization = GM_getValue("discordAuth").authorization
                                discordAuth.updateTime = GM_getValue("discordAuth").updateTime
                                discordAuth.status = GM_getValue("discordAuth").status;
                                resolve(discordAuth.status)
                            }
                        }
                    }
                })
            }
            const getServerInfo = async(server)=>{
                // https://discord.com/api/v9/invites/h9frErUaV4?with_counts=true&with_expiration=true
                return HTTP.GET(`https://discord.com/api/v9/invites/${server}`, {
                    with_counts: true,
                    with_expiration: true
                }, {
                    headers: {
                        referer: 'https://discord.com/invite/' + server,
                        authorization: discordAuth.authorization,
                        'x-super-properties': discordAuth.xSuperProperties,
                        'x-fingerprint': discordAuth.xFingerprint,
                    },
                    responseType: 'json'
                }).then(res=>{
                    if(res.status == 200)return Promise.resolve(res.response)
                    else return Promise.reject(res.status)
                })
            }
            const doJoinServer = (server, info)=>{
                const xContextProperties = {
                    "location":"Accept Invite Page",
                    "location_guild_id":info.guild.id,
                    "location_channel_id":info.channel.id,
                    "location_channel_type":info.channel.type
                };
                return HTTP.POST(`https://discord.com/api/v6/invites/${server}`, "{}", {
                    headers: {
                        'content-type': 'application/json',
                        referer: 'https://discord.com/invite/' + server,
                        authorization: discordAuth.authorization,
                        'x-super-properties': discordAuth.xSuperProperties,
                        'x-fingerprint': discordAuth.xFingerprint,
                        'x-context-properties': window.btoa(JSON.stringify(xContextProperties))
                    },
                    overrideMimeType: 'application/json',
                    responseType: 'json'
                }).then(res=>{
                    if (res.status === 200) {
                        log.log({ result: 'success', statusText: res.statusText, status: res.status })
                        return Promise.resolve(200);
                    } else {
                        log.error("状态码异常：", res);
                        log.info(res.responseText)
                        return Promise.reject(res.status);
                    }
                })
            }
            const JoinServer = async (r, server)=>{
                log.info("DISCORD: 准备加入服务器：", server)
                try{
                    log.info("DISCORD: 更新凭证：", server)
                    const auth = await AuthUpdate()

                    log.info("DISCORD: 加入服务器：", server)
                    const serverInfo = await getServerInfo(server)
                    const ret = await doJoinServer(server, serverInfo)
                    log.info('DISCORD: ret', ret)
                    r(ret)
                }catch(e){
                    log.error("DISCORD: 加入服务器出错：", e)
                    r(e);
                    return;
                }
            }
            const LeaveServer = (r, serverId)=>{
                AuthUpdate((ret)=>{
                    if(ret != 200)
                    {
                        r(ret);
                        return;
                    }
                    jq.ajax({
                        url: 'https://discord.com/api/v6/users/@me/guilds/' + serverId,
                        method: 'DELETE',
                        headers: { authorization: discordAuth.authorization, "content-type": "application/json"},
                        onload: (response) => {
                            if (response.status === 604) {
                                log.log({ result: 'success', statusText: response.statusText, status: response.status })
                                r(604);
                            } else {
                                log.error(response);
                                r(601);
                            }
                        },
                        error:(res)=>{
                            log.error(res);
                            r(601);
                        },
                        anonymous:true
                    })
                })
            }
            return {
                AuthUpdate: AuthUpdate,
                JoinServer: JoinServer,
                LeaveServer: LeaveServer
            }
        })();
        const SPOTIFY = (()=>{
            const GetUserInfo = async (r)=>{
                r(603)
                const accessToken = await GetAccessToken()
                return HTTP.GET('https://api.spotify.com/v1/me', null, {
                    headers:{authorization: "Bearer " + accessToken},
                    anonymous:true
                }).then((res, accessToken)=>{
                    if (res.status === 200) {
                        r(200, accessToken, JSON.parse(res.responseText).id);
                    } else {
                        log.error(res)
                        r(401);
                    }
                }).catch(err=>{
                    log.error("SPOTIFY.GetUserInfo error", err)
                    r(408)
                })
            }
            const GetAccessToken = function(){
                return HTTP.GET('https://open.spotify.com/get_access_token?reason=transport&productType=web_player', null, {responseType: 'json'})
                    .then(res=>{
                    //log.log(res)
                    if(res.status != 200){
                        return Promise.reject(401);
                    }
                    const resp = res.response
                    if (!resp.isAnonymous) {
                        return Promise.resolve(JSON.parse(res.responseText).accessToken);
                    } else {
                        log.error(res);
                        return Promise.reject(401);
                    }
                }).catch(err=>{
                    log.error('SPOTIFY.GetAccessToken', err)
                    return Promise.reject(err.status)
                })
            }
            const SaveAuto = (r, data, del = false)=>{
                GetUserInfo((status, accessToken = null, userId = null)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    let putUrl = "";
                    new Promise((resolve, reject)=>{
                        switch(data.type)
                        {
                            case "album":
                                putUrl = "https://spclient.wg.spotify.com/collection-view/v1/collection/albums/" + userId + "?base62ids=" + data.id + "&model=bookmark";
                                resolve(putUrl);
                                break;
                            case "track":
                                HTTP.GET('https://api.spotify.com/v1/tracks?ids=' + data.id + '&market=from_token', null, {
                                    headers:{authorization: "Bearer " + accessToken},
                                    anonymous:true
                                }).then(res=>{
                                    if(res.status == 200)
                                    {
                                        let temp = JSON.parse(res.response);
                                        putUrl = "https://spclient.wg.spotify.com/collection-view/v1/collection/albums/" + userId + "?base62ids=" + temp.tracks[0].album.id + "&model=bookmark";
                                        resolve(putUrl);
                                    }else
                                    {
                                        log.error(res);
                                        reject(601);
                                    }
                                }).catch(err=>{
                                    log.error(err);
                                    reject(601);
                                })
                                break;
                            default:
                                log.error("spotifySaveAuto未知类型：", data);
                                r(601);
                                return;
                                break;
                        }
                    }).then((putUrl)=>{
                        log.log(putUrl)
                        jq.ajax({
                            type: !del?'PUT':"DELETE",
                            url: putUrl,
                            headers: {authorization: "Bearer " + accessToken},
                            success: function(data){
                                log.log(data);
                                r(200);
                            },
                            error: function(data){
                                log.error(data);
                                r(601);
                            },
                            anonymous:true
                        });
                    })
                });
            }
            const Follow = (r, data, del = false)=>{
                GetUserInfo((status, accessToken = null)=>{
                    if(status != 200)
                    {
                        r(status)
                        return;
                    }
                    let putUrl = "";
                    switch(data.type)
                    {
                        case "artist":
                            putUrl = "https://api.spotify.com/v1/me/following?type=artist&ids=" + data.id;
                            break;
                        case "playlist":
                            putUrl = "https://api.spotify.com/v1/playlists/" + data.id + "/followers"
                            break;
                        case "user":
                            putUrl = "https://api.spotify.com/v1/me/following?type=user&ids=" + data.id;
                            break;
                        default:
                            log.error(data);
                            r(601);
                            return;
                            break;
                    }
                    jq.ajax({
                        type: !del?'PUT':"DELETE",
                        url: putUrl,
                        headers: {authorization: "Bearer " + accessToken},
                        success: function(data){
                            r(200);
                        },
                        error: function(data){
                            log.error(data);
                            r(604);
                        },
                        anonymous:true
                    });
                });
            }
            return {
                GetAccessToken: GetAccessToken,
                SaveAuto: SaveAuto,
                Follow: Follow
            }
        })();
        const STEAM = (()=>{
            const InfoUpdate = async (type = 'all', forceUpdate = false)=> {
                if (type === 'community' || type === 'all') {
                    await getComAuth(forceUpdate)
                }
                if (type === 'store' || type === 'all') {
                    await getStoreAuth(forceUpdate)
                }
            }
            const getComAuth = (forceUpdate = false)=>{
                if (new Date().getTime() - steamConfig.comUpdateTime > 10 * 60 * 1000 || forceUpdate) {
                    getAuthStatus.steamCom = 603;
                    HTTP.GET('https://steamcommunity.com/my')
                        .then(res=>{
                        if (res.status === 200) {
                            if (jq(res.responseText).find('a[href*="/login/home"]').length > 0) {
                                getAuthStatus.steamCom = 401;
                                return Promise.reject(401);
                            } else {
                                const steam64Id = res.responseText.match(/g_steamID = "(.+?)";/);
                                const communitySessionID = res.responseText.match(/g_sessionID = "(.+?)";/);
                                const userName = res.responseText.match(/steamcommunity.com\/id\/(.+?)\/friends\//);
                                if (steam64Id) steamConfig.steam64Id = steam64Id[1];
                                if (communitySessionID) steamConfig.communitySessionID = communitySessionID[1];
                                if (userName) steamConfig.userName = userName[1];
                                getAuthStatus.steamCom = 200;
                                steamConfig.comUpdateTime = new Date().getTime();
                                GM_setValue('steamInfo', steamConfig);
                                return Promise.resolve(200);
                            }
                        } else {
                            log.error(res);
                            getAuthStatus.steamCom = 601;
                            return Promise.reject(601);
                        }
                    })
                } else {
                    return Promise.resolve(200);
                }
            }
            const getStoreAuth = (forceUpdate = false)=>{
                if (new Date().getTime() - steamConfig.storeUpdateTime > 10 * 60 * 1000 || forceUpdate) {
                    getAuthStatus.steamStore = 603;
                    return HTTP.GET('https://store.steampowered.com/stats/', null )
                        .then(res=>{
                        if (res.status === 200) {
                            if (jq(res.responseText).find('a[href*="/login/"]').length > 0) {
                                log.log(res)
                                getAuthStatus.steamStore = 401;
                                return Promise.reject(401)
                            } else {
                                const storeSessionID = res.responseText.match(/g_sessionID = "(.+?)";/)
                                if (storeSessionID) steamConfig.storeSessionID = storeSessionID[1]
                                getAuthStatus.steamStore = 200;
                                steamConfig.storeUpdateTime = new Date().getTime();
                                GM_setValue('steamInfo', steamConfig);
                                return Promise.resolve(200);
                            }
                        } else {
                            log.error(res);
                            getAuthStatus.steamStore = 601;
                            return Promise.reject(601);
                        }
                    })
                } else {
                    return Promise.resolve(200)
                }
            }

            const Rep = async (r, id)=>{
                try{
                    const check = await RepHisCheck(id)
                    HTTP.POST('https://steamcommunity.com/comment/Profile/post/' + id + '/-1/',jq.param({comment:'+rep',count:6,sessionid:steamConfig.communitySessionID,feature2:-1}), {
                        headers:{'content-type': 'application/x-www-form-urlencoded'},
                    }).then(res=>{
                        if(res.status == 200)
                        {
                            let ret = JSON.parse(res.response)
                            if(ret.success == true)r(200);
                            else{
                                log.error("发送评论失败", res);
                                r(601);
                            }
                        }else{
                            log.error("评论返回值异常", res);
                            r(601);
                        }
                    }).catch(err=>{
                        log.error("请求发送异常", err);
                        r(601);
                    })
                }catch(e){
                    r(e);
                    return;
                }
            }
            const RepHisCheck = async function (id){
                const auth = await InfoUpdate( "community")
                return HTTP.GET("https://steamcommunity.com/profiles/" + id)
                    .then(res=>{
                    if(res.status == 200)
                    {
                        let comments = res.responseText.match(/commentthread_comments([\s\S]*)commentthread_footer/);
                        log.log(comments);
                        if(comments != null)
                        {
                            if(comments[1].includes(steamConfig.steam64Id) || steamConfig.userName?comments[1].includes(steamConfig.userName):false)
                            {
                                return Promise.resolve(200, true);
                            }
                            else if(!res.responseText.includes("commentthread_textarea"))
                            {
                                return Promise.reject(605)
                            }else{
                                return Promise.resolve(200, false);
                            }
                        }
                        else return Promise.reject(605);
                    }else{
                        log.error("检查评论记录返回异常", res);
                        return Promise.reject(601);
                    }
                })

            }
            const isGroupExist = (url)=>{
                return HTTP.GET(url).then(res=>{
                    const html = res.responseText;
                    return Promise.resolve(html.indexOf('已被移除。') !== -1 || html.indexOf('无法检索到该指定 URL 的组') !== -1)
                })
            }
            const JoinGroupAuto = async function (r, url) {
                try{
                    const auth = await InfoUpdate('community')
                    HTTP.POST(url, jq.param({ action: 'join', sessionID: steamConfig.communitySessionID }), {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    }).then(res=>{
                        if (res.status === 200 && !res.responseText.includes('grouppage_join_area')) {
                            if(res.responseText.match(/<h3>(.+?)<\/h3>/) && res.responseText.match(/<h3>(.+?)<\/h3>/)[1] != "您已经是该组的成员了。")
                            {
                                log.error("STEAM.JoinGroupAuto1", res);
                                r(404);
                            }else r(200);
                        } else {
                            log.error("STEAM.JoinGroupAuto2", res);
                            r(601);
                        }
                    })
                }catch(e){
                    let exist = await isGroupExist(url)
                    r(!exist?404:e);
                    return;
                }

            }
            const LeaveGroup = function (r, url) {
                let groupName = url.split('s/')[1];
                GetGroupID(groupName, (groupName, groupId) => {
                    var postUrl = "";
                    postUrl = (steamConfig.userName) ? 'https://steamcommunity.com/id/' + steamConfig.userName + '/home_process' : 'https://steamcommunity.com/profiles/' + steamConfig.steam64Id + '/home_process'
                    HTTP.POST(postUrl, jq.param({ sessionID: steamConfig.communitySessionID, action: 'leaveGroup', groupId: groupId }), {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    }).then(res=>{
                        if (res.status === 200 && res.finalUrl.includes('groups') && jq(res.responseText.toLowerCase()).find(`a[href='https://steamcommunity.com/groups/${groupName.toLowerCase()}']`).length === 0) {
                            r(200);
                        } else {
                            log.error(res);
                            r(601);
                        }
                    })
                })
            }
            const GetGroupID = async function (groupName, callback) {
                try{
                    const auth = InfoUpdate()
                    HTTP.GET('https://steamcommunity.com/groups/' + groupName, null, {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    }).then(res=>{
                        log.log(res)
                        if (res.status === 200) {
                            const groupId = res.responseText.match(/OpenGroupChat\( '([0-9]+)'/)
                            if (groupId === null) {
                                log.error(res)
                            } else {
                                if (groupId[1] !== false && callback) callback(groupName, groupId[1]);
                            }
                        } else {
                            log.error(res)
                        }
                    })
                }catch(e){
                    callback(e);
                    return;
                }
            }
            const AddWishlistAuto = async function (r, gameId) {
                try{
                    const auth = await InfoUpdate('store')

                    HTTP.POST('https://store.steampowered.com/api/addtowishlist', jq.param({ sessionid: steamConfig.storeSessionID, appid: gameId }), {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        responseType: 'json'
                    }).then(res=>{
                        log.log(res)
                        if (res.status === 200 && res.response && res.response.success === true) {
                            r(200)
                        } else {
                            HTTP.GET('https://store.steampowered.com/app/' + gameId)
                                .then(res=>{
                                log.log(res)
                                if (res.status === 200) {
                                    if (res.responseText.includes('class="queue_actions_ctn"') && res.responseText.includes('已在库中')) {
                                        r(200)
                                    } else if ((res.responseText.includes('class="queue_actions_ctn"') && !res.responseText.includes('add_to_wishlist_area" style="display: none;"')) || !res.responseText.includes('class="queue_actions_ctn"')) {
                                        log.error(res);
                                        r(601);
                                    } else {
                                        r(200);
                                    }
                                } else {
                                    log.error(res);
                                    r(601);
                                }
                            })
                            return Promise.resolve({ result: 'error', statusText: res.statusText, status: res.status })
                        }
                    })
                }catch(e){
                    log.error(e);
                    r(601);
                }
            }
            const RemoveWishlistAuto = function (r, gameId) {
                this.steamInfoUpdate(() => {
                    new Promise(resolve => {
                        HTTP.POST('https://store.steampowered.com/api/removefromwishlist', jq.param({ sessionid: steamConfig.storeSessionID, appid: gameId }), {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                            responseType: 'json',
                            onabort: response => { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
                            ontimeout: response => { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
                            r: resolve
                        }).then(res=>{
                                if (res.status === 200 && res.response && res.response.success === true) {
                                    resolve({ result: 'success', statusText: res.statusText, status: res.status })
                                } else {
                                    resolve({ result: 'error', statusText: res.statusText, status: res.status })
                                }
                        })
                    }).then(result => {
                        if (result.result === 'success') {
                            r(200);
                        } else {
                            HTTP.GET('https://store.steampowered.com/app/' + gameId)
                                .then(res=>{
                                if (res.status === 200) {
                                    if (res.responseText.includes('class="queue_actions_ctn"') && (res.responseText.includes('已在库中') || res.responseText.includes('添加至您的愿望单'))) {
                                        r(200);
                                    } else {
                                        log.error(res);
                                        r(601);
                                    }
                                } else {
                                    log.error(res);
                                    r(601);
                                }
                            })
                        }
                    }).catch(err => {
                        log.error(err);
                        r(601);
                    })
                })
            }
            return {
                InfoUpdate: InfoUpdate,
                Rep: Rep,
                JoinGroup: JoinGroupAuto,
                LeaveGroup: LeaveGroup,
                AddWishlist: AddWishlistAuto
            }
        })();
        const TWITCH = (()=>{
            const FollowAuto = async function(r, channelId){
                try{
                    const auth = await AuthUpdate()
                    HTTP.POST( 'https://gql.twitch.tv/gql','[{"operationName":"FollowButton_FollowUser","variables":{"input":{"disableNotifications":false,"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"3efee1acda90efdff9fef6e6b4a29213be3ee490781c5b54469717b6131ffdfe"}}}]', {
                        headers: { Authorization: "OAuth " + twitchConfig["auth-token"]},
                    }).then(res=>{
                        if (res.status === 200) {
                            r(200);
                        } else if(res.status === 401){
                            twitchConfig.updateTime = 0;
                            GM_setValue("twitchAuth", null);
                            r(401);
                        }else{
                            log.error(res);
                            r(601);
                        }
                    })
                }catch(e){
                    r(status);
                    return;
                }
            }
            const UnfollowAuto = function(r, channelId){
                AuthUpdate((status)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    HTTP.POST('https://gql.twitch.tv/gql', '[{"operationName":"FollowButton_UnfollowUser","variables":{"input":{"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"d7fbdb4e9780dcdc0cc1618ec783309471cd05a59584fc3c56ea1c52bb632d41"}}}]', {
                        headers: { Authorization: "OAuth " + twitchConfig["auth-token"]},
                    }).then(res=>{
                        if (res.status === 200) {
                            r(200);
                        } else if(res.status === 401){
                            twitchConfig.updateTime = 0;
                            GM_setValue("twitchAuth", null);
                            r(401);
                        }else{
                            log.error(res);
                            r(601);
                        }
                    })
                })
            }
            // 弃用
            const twitchGetId = function(r, channels){
                HTTP.GET('https://api.twitch.tv/api/channels/' + channels + '/access_token?oauth_token=' + GM_getValue("twitchAuth").match(/auth-token=(.+?); /)[1] + '&need_https=true&platform=web&player_type=site&player_backend=mediaplayer', null, {
                    anonymous:true
                }) .then(res=>{
                    if (res.status === 200) {
                        let rep = JSON.parse(JSON.parse(res.responseText).token);
                        r(rep.channel_id);
                    } else {
                        log.error(res);
                        r('error')
                    }
                })
            }
            const AuthUpdate = function(forceUpdate = false){
                return new Promise((resolve, reject)=>{
                    if (new Date().getTime() - twitchConfig.updateTime < 30 * 60 * 1000 && twitchConfig.status === 200 && !forceUpdate) {
                        resolve(200)
                        return
                    }
                    if(false == getAuthStatus.twitch || true === forceUpdate)
                    {
                        getAuthStatus.twitch = true;
                        const tab = GM_openInTab("https://www.twitch.tv/settings/profile?keyjokertask=storageAuth", {active: false, insert: true, setParent: true});
                        tab.onclose = ()=>{
                            if(GM_getValue("twitchAuth") && new Date().getTime() - GM_getValue("twitchAuth").updateTime <= 10 * 1000)
                            {
                                if(GM_getValue("twitchAuth").status != 200)
                                {
                                    reject(401);
                                    return;
                                }
                                twitchConfig["auth-token"] = GM_getValue('twitchAuth')["auth-token"];
                                twitchConfig.updateTime = GM_getValue('twitchAuth').updateTime;
                                twitchConfig.status = GM_getValue('twitchAuth').status;
                                resolve(200)
                            }
                        }
                    }
                })
            }
            return {
                AuthUpdate: AuthUpdate,
                FollowAuto: FollowAuto,
                UnfollowAuto: UnfollowAuto
            }
        })();
        const TWITTER = (()=>{
            const FollowAuto = async function(r, data){
                try{
                    const auth = await AuthUpdate()
                    const uinfo = await GetUserInfo(data.username)
                    let userId = uinfo[1]
                    HTTP.POST('https://api.twitter.com/1.1/friendships/create.json',
                              jq.param({
                        include_profile_interstitial_type: 1,
                        include_blocking: 1,
                        include_blocked_by: 1,
                        include_followed_by: 1,
                        include_want_retweets: 1,
                        include_mute_edge: 1,
                        include_can_dm: 1,
                        include_can_media_tag: 1,
                        skip_status: 1,
                        id: userId
                    }), {
                        headers: { authorization: "Bearer " + twitterConfig.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token':twitterConfig.ct0},
                    }).then(res=>{
                        if (res.status === 200) {
                            r(200);
                        } else {
                            log.error(res);
                            twitterConfig.updateTime = 0;
                            GM_setValue("twitterAuth", twitterConfig);
                            r(601);
                        }
                    })
                }catch(e){
                    log.error("TWITTER: 关注出错：", e)
                    r(e);
                    return;
                }
            }
            const UnfollowAuto = function(r, data){
                AuthUpdate((status)=>{
                    if(status != 200)
                    {
                        r(status);
                        return;
                    }
                    GetUserInfo((userId)=>{
                        log.log(userId)
                        if("error" == userId)
                        {
                            r(601);
                            return;
                        }
                        HTTP.POST('https://api.twitter.com/1.1/friendships/destroy.json', jq.param({ include_profile_interstitial_type: 1,include_blocking: 1,include_blocked_by: 1,include_followed_by: 1,include_want_retweets: 1,include_mute_edge: 1,include_can_dm: 1,include_can_media_tag: 1,skip_status: 1,id: userId}), {
                            headers: { authorization: "Bearer " + twitterConfig.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token':twitterConfig.ct0},
                        }).then(res=>{
                            if (res.status === 200) {
                                r(200);
                            } else {
                                log.error(res);
                                twitterConfig.updateTime = 0;
                                GM_setValue("twitterAuth", twitterConfig);
                                r(601);
                            }
                        })
                    }, data.username)
                })
            }
            const RetweetAuto = async function(r, url){
                let retweetId = url.split("status/")[1];
                try{
                    const auth = await AuthUpdate()
                    HTTP.POST( 'https://api.twitter.com/1.1/statuses/retweet.json', jq.param({ tweet_mode: "extended",id: retweetId}), {
                        headers: { authorization: "Bearer " + twitterConfig.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token':twitterConfig.ct0},
                    }).then(res=>{
                        if (res.status === 200 || (res.status === 403 && res.responseText == '{"errors":[{"code":327,"message":"You have already retweeted this Tweet."}]}')) {
                            r(200);
                        } else {
                            twitterConfig.updateTime = 0;
                            GM_setValue("twitterAuth", twitterConfig);
                            r(601);
                        }
                    })
                }catch(e){
                    log.error("TWITTER: 转推出错：", e)
                    r(e);
                    return;
                }
            }
            const GetUserInfo = function(userName){
                if(debug)log.log("====twitterGetUserInfo====");
                return HTTP.GET('https://api.twitter.com/graphql/-xfUfZsnR_zqjFd-IfrN5A/UserByScreenName?variables=%7B%22screen_name%22%3A%22' + userName + '%22%2C%22withHighlightedLabel%22%3Atrue%7D', null, {
                    headers: { authorization: "Bearer " + twitterConfig.authorization, "content-type": "application/json"},
                    anonymous:true
                }).then(res=>{
                    if (res.status === 200) {
                        return Promise.resolve([200, JSON.parse(res.responseText).data.user.rest_id]);
                    } else {
                        log.error(res);
                        return Promise.reject(601);
                    }
                })
            }
            const AuthUpdate = function(update = false){
                return new Promise((resolve, reject)=>{
                    if(new Date().getTime() - twitterConfig.updateTime < 30 * 60 * 1000 && !update){
                        // 未过期，不强制更新
                        resolve(200)
                        return;
                    }

                    if(false == getAuthStatus.twitter || true === update)
                    {
                        getAuthStatus.twitter = true;
                        const tab = GM_openInTab("https://twitter.com/settings/account?keyjokertask=storageAuth", {active: false, insert: true, setParent: true});
                        tab.onclose = ()=>{
                            log.log("twitter tab closed")
                            const auth = GM_getValue("twitterAuth");
                            // 10s之内
                            if(GM_getValue("twitterAuth") && new Date().getTime() - auth.updateTime <= 10 * 1000)
                            {
                                if(auth.status != 200)
                                {
                                    reject(auth.status)
                                    return;
                                }
                                twitterConfig.ct0 = auth.ct0;
                                twitterConfig.updateTime = auth.updateTime
                                twitterConfig.status = auth.status;
                                resolve(twitterConfig.status)
                            }else{
                                reject(408)
                            }

                        }
                    }
                })
            }
            // 推特取得用户页面响应头（OK）
            /*twitterAP:function(r){
            HTTP.GET( 'https://twitter.com/settings/account?k')
            .then(res=>{
                        if (res.status === 200) {
                            log.log(res)
                            r(200, res.responseHeaders)
                        } else {
                            log.error(res);
                            r(601);
                        }
            }).catch(err=>{
                        log.error(res);
                        r(601);
            })
            },*/

            return {
                FollowAuto: FollowAuto,
                RetweetAuto: RetweetAuto,
                AuthUpdate: AuthUpdate
            }
        })();
        const func = {
            // 部分站点凭证存储处理，人机验证处理
            appHandle: function(){
                switch(location.hostname)
                {
                    case "www.twitch.tv":
                        if(location.search == "?keyjokertask=storageAuth")
                        {
                            let cookie = document.cookie + ";"
                            twitchConfig.updateTime = new Date().getTime();
                            if(cookie.match(/auth-token=(.+?);/) != null)
                            {
                                twitchConfig["auth-token"] = cookie.match(/auth-token=(.+?);/)[1]
                                twitchConfig.status = 200;
                            }else twitchConfig.status = 401;
                            GM_setValue("twitchAuth", twitchConfig)
                            log.log(twitchConfig)
                            window.close();
                        }
                        window.close();
                        break;
                    case "discord.com":
                        if(location.search.includes("?keyjokertask=joinDiscord"))
                        {
                            // 模拟点击
                            log.info("discord", "ready")
                            jq(document).ready(DISCORD.JoinServer2);
                        }else if(location.search == "?keyjokertask=storageAuth"){

                            // test
                            const temp = JSON.parse(localStorage.getItem("token") || "{}")
                            const language = navigator.language||navigator.userLanguage;
                            const browserInfo = func.getBrowserInfo()
                            const xSuperProperties = {
                                "os": temp.os || navigator.userAgentData.platform,
                                "browser": temp.browser || (browserInfo[0].slice(0,1).toUpperCase() + browserInfo[0].slice(1).toLowerCase()),
                                "device": temp.device || "",
                                "system_locale": temp.system_locale || language,
                                "browser_user_agent":navigator.userAgent,
                                "browser_version":browserInfo[1],
                                "os_version":"",
                                "referrer":"",
                                "referring_domain":"",
                                "referrer_current":"",
                                "referring_domain_current":"",
                                "release_channel":"stable",
                                "client_build_number":111330,
                                "client_event_source":null
                            }
                            log.log(xSuperProperties)

                            const xFingerprint = localStorage.getItem("fingerprint") || "";
                            // test
                            discordAuth.xSuperProperties = window.btoa(JSON.stringify(xSuperProperties))
                            discordAuth.xFingerprint = xFingerprint.replaceAll('"', '')

                            discordAuth.authorization = JSON.parse(localStorage.getItem("token"));
                            if(discordAuth.authorization == null)discordAuth.status = 401;
                            else discordAuth.status = 200;
                            discordAuth.updateTime = new Date().getTime();
                            GM_setValue("discordAuth", discordAuth);
                            log.log(discordAuth)

                            window.close();
                        }
                        break;
                    case "twitter.com":
                        // https://twitter.com/settings/account?keyjokertask=storageAuth
                        if(location.search === "?keyjokertask=storageAuth")
                        {
                            log.log('twitter auth store')
                            log.log(location.href)
                            // 注册地址变换事件
                            const _historyWrap = function(type) {
                                const orig = history[type];
                                const e = new Event(type);
                                return function() {
                                    const rv = orig.apply(this, arguments);
                                    e.arguments = arguments;
                                    window.dispatchEvent(e);
                                    return rv;
                                };
                            };
                            history.replaceState = _historyWrap('replaceState');
                            // 监听地址变换
                            window.addEventListener('replaceState', function(e) {
                                log.log(location.href)
                                console.log('change replaceState', e);
                                if(location.href.endsWith('login')){
                                    // 切换到登陆页面
                                    twitterConfig.status = 401;
                                    GM_setValue("twitterAuth", twitterConfig)
                                    unsafeWindow.close();
                                }
                            });

                            // 检测cookie有效性
                            let m = document.cookie.match(/ct0=(.+?);/);
                            HTTP.GET('https://twitter.com/i/api/1.1/users/email_phone_info.json', null, {
                                headers: {
                                    authorization: `Bearer ${twitterConfig.authorization}`,
                                    'x-csrf-token': m[1]
                                },
                                responseType: 'json'
                            })
                            .then(res=>{
                                log.log(res)
                                twitterConfig.updateTime = new Date().getTime()
                                if(res.status === 200){
                                    // 未登录时，页面地址会发生变更
                                    if(m != null && m[1])
                                    {
                                        twitterConfig.status = 200;
                                        twitterConfig.ct0 = m[1];
                                    }else{
                                        twitterConfig.status = 401;
                                    }
                                }else{
                                    twitterConfig.status = 401;
                                }
                                GM_setValue("twitterAuth", twitterConfig)
                                unsafeWindow.close();
                            }).catch(err=>{
                                log.err(err)
                                twitterConfig.status = 401;
                                GM_setValue("twitterAuth", twitterConfig)
                                unsafeWindow.close();
                            })
                        }
                        break;
                    case "www.keyjoker.com":
                        if(location.search == "?keyjokertask=unbindDiscord")
                        {
                            jq(document).ready(()=>{
                                log.log("keyjoker unbindDiscord")
                                const auto = jq("h4:contains('Discord')")[0].parentNode
                                //auto.nextElementSibling.firstChild.click()
                                const modal = auto.parentNode.parentNode.parentNode.nextElementSibling
                                if(modal.id.indexOf('delete-identity-')===0) modal.firstChild.firstChild.lastChild.firstChild.lastChild.click()
                                else location.href = "https://www.keyjoker.com/socialite/discord"
                            })
                        }
                        break;
                    case "assets.hcaptcha.com":
                        // 人机验证
                        func.hcaptcha2();
                        break;
                    default :
                        unsafeWindow.kj = {
                            get: GM_getValue,
                            set: GM_setValue
                        }
                        break;
                }
            },
            authVerify:function(){
                noticeFrame.clearNotice();
                noticeFrame.addNotice("<span data-i18n=\"notification.checkAuth\">检查各项凭证</span>");
                if(discordAuth.enable)noticeFrame.addNotice({type: "authVerify", name: "<a href=\"https://discord.com/login/\" target=\"_blank\">Discord</a> Auth", status:{id: "discord", class: "wait", text:"ready"}});
                noticeFrame.addNotice({type: "authVerify", name: "<a href=\"https://accounts.spotify.com/login/\" target=\"_blank\">Spotify</a> Auth&nbsp;", status:{id: "spotify", class: "wait", text:"ready"}});
                noticeFrame.addNotice({type: "authVerify", name: "<a href=\"https://steamcommunity.com/login/\" target=\"_blank\">Steam</a> Auth&nbsp;&nbsp;", status:{id: "steam", class: "wait", text:"ready"}});
                // noticeFrame.addNotice({type: "authVerify", name: "<a href=\"https://www.tumblr.com/login\" target=\"_blank\">Tumblr</a> Auth", status:{id: "tumblr", class: "wait", text:"ready"}});
                noticeFrame.addNotice({type: "authVerify", name: "<a href=\"https://www.twitch.tv/login\" target=\"_blank\">Twitch</a> Auth&nbsp;", status:{id: "twitch", class: "wait", text:"ready"}});
                noticeFrame.addNotice({type: "authVerify", name: "<a href=\"https://twitter.com/login/\" target=\"_blank\">Twitter</a> Auth", status:{id: "twitter", class: "wait", text:"ready"}});

                if(discordAuth.enable){
                    DISCORD2.AuthUpdate(true).then(res=>{
                        this.statusReact(res, "discord");
                    }).catch(err=>{
                        this.statusReact(err, "discord");
                    });
                }
                SPOTIFY.GetAccessToken().then((res)=>{
                    log.info("spotify", res)
                    this.statusReact(200, "spotify");
                }).catch(err=>{
                    this.statusReact(err, "spotify");
                });
                STEAM.InfoUpdate("all", true).then((res)=>{
                    log.info("STEAM", res)
                    this.statusReact(200, "steam");
                }).catch(err=>{
                    this.statusReact(err, "steam");
                });
                // TUMBLR.AuthUpdate(true).then((status)=>{
                //     this.statusReact(200, "tumblr");
                // }).catch(err=>{
                //     this.statusReact(err, "tumblr");
                // });
                TWITCH.AuthUpdate(true).then((status)=>{
                    this.statusReact(status, "twitch");
                }).catch(err=>{
                    this.statusReact(err, "twitch");
                });
                TWITTER.AuthUpdate(true).then((status)=>{
                    this.statusReact(status, "twitter");
                }).catch(err=>{
                    this.statusReact(err, "twitter");
                });
            },
            statusReact: (code, id)=>{
                const result = {
                    0:{class:"error", text:"Time Out"},
                    200: {
                        class:"success",
                        text: 'success'
                    },
                    601: {
                        class:"error",
                        text: 'error'
                    },
                    401: {
                        class:"error", text:"Not Login"
                    },
                    408: {class:"error", text:"Time Out"},
                    603: {class:"wait", text:"Getting Auth"},
                    604: {class:"error", text:"Network Error"},
                    605: {class:"error", text:"评论区未找到"},
                }
                log.info('statusReact', id, code)
                if(result[code]) noticeFrame.updateNotice(id, result[code])
            },
            checkUpdate: function(){
                noticeFrame.addNotice({type:"msg",msg:"<span data-i18n=\"notification.checkingUpdate\">正在检查版本信息...(当前版本：</span>" + GM_info.script.version + ")"})
                HTTP.GET('https://task.jysafe.cn/keyjoker/script/update.php?type=ver', null, {headers:{action: "keyjoker"}})
                .then(res=>{
                    const resp = JSON.parse(res.response)
                    if(resp.status != 200)
                        {
                            noticeFrame.addNotice({type:"msg", msg:"异常！<font class=\"error\">" + resp.msg + "</font>"})
                            return;
                        }
                        if(func.checkVersion(resp.ver))
                        {
                            noticeFrame.addNotice({type:"msg", msg:"<span data-i18n=\"notification.newVersionFound\">发现新版本！</span><font class=\"success\">" + resp.ver + "=>" + resp.msg + "</font>"})
                        }else{
                            noticeFrame.addNotice({type:"msg",msg:"<span data-i18n=\"notification.youAreInLatest\">当前已是最新版本！</span>"})
                        }
                }).catch(err=>{
                    log.error(err);
                    noticeFrame.addNotice({type:"msg", msg:"<span data-i18n=\"notification.errGoConsole\" style=\"color:red\">请求异常！请至控制台查看详情！</span>"})
                })
            },
            checkVersion: function(ver){
                let new_ver = ver.split('.');
                let old_ver = GM_info.script.version.split('.');
                for(var i=0; i<new_ver.length && i<old_ver.length; i++){
                    let _new = parseInt(new_ver[i]);
                    let _old = parseInt(old_ver[i]);
                    if(_new >_old){
                        // 需更新
                        return 1;
                    }else if(_new == _old){
                        continue;
                    }else{
                        break;
                    }
                }
                return 0;
            },
            getTaskReplace: async function(task){
                log.log('task', task)
                const res = await HTTP.GET(`https://raw.fastgit.org/msojocs/keyjoker-script/master/task-replace/${task.task.provider.icon}.json`, null, {
                    responseType: 'json'
                })
                log.log('res', res)
                const resp = res.response
                log.log('resp', resp)
                return resp[task.data.name]
            },
            // 做单个任务
            do_task_single: function(task, retry=false){
                retry || noticeFrame.addNotice({type: "taskStatus", task:task, status:'wait'});
                retry && noticeFrame.updateNotice(task.id, {class:"wait", text:"重试中"})
                this.runDirectUrl(task.redirect_url);
                let react = (code)=>{
                    switch(code)
                    {
                        case 200:
                            noticeFrame.updateNotice(task.id, {class:"success",text:'success'})
                            this.redeemAuto(task.redirect_url);
                            break;
                        case 601:
                            noticeFrame.updateNotice(task.id, {class:"error",text:'error'})
                            break;
                        case 401:
                            noticeFrame.updateNotice(task.id, {class:"error", text:"Not Login"})
                            break;
                        case 404:
                            {
                                // 创建一个新的 div 元素
                                let ignoreBtn = document.createElement("button");
                                ignoreBtn.innerText = '忽略'
                                ignoreBtn.style.background = 'red'
                                ignoreBtn.style.color = 'white'
                                ignoreBtn.style['margin-left'] = '10px'
                                ignoreBtn.className = 'btn'
                                ignoreBtn.addEventListener('click', e=>{
                                    log.info("点击忽略")
                                    log.log(e)
                                    log.log(task.id)
                                    log.log(kjData.loadData)
                                    kjData.loadData.actions = kjData.loadData.actions.filter(a=>a.id!==task.id)
                                    if(!ignoreList.includes(task.id)){
                                        ignoreList.push(task.id)
                                    }
                                    GM_setValue('ignoreList', ignoreList)
                                })
                                if(jq(`a[href='https://www.keyjoker.com/entries/open/24301']`)[0].parentNode.children.length === 2){
                                    jq(`a[href='https://www.keyjoker.com/entries/open/${task.id}']`)[0].parentNode.append(ignoreBtn)
                                }
                                noticeFrame.updateNotice(task.id, {class:"error", text:"目标不存在"})

                                task.try = task?.try ?? 0
                                task.try++
                                if(task.try <= 1){
                                    log.log('test')
                                    this.getTaskReplace(task)
                                    .then(url=>{
                                        log.log('获取到的新任务链接：', url)
                                        if(url){
                                            task.data.url = url
                                            setTimeout(()=>{
                                                this.do_task_single(task, true)
                                            }, 5000)
                                        }
                                    })
                                }
                            }
                            break;
                        case 408:
                            noticeFrame.updateNotice(task.id, {class:"error", text:"Time Out"})
                            break;
                        case 603:
                            noticeFrame.updateNotice(task.id, {class:"wait", text:"Getting Auth"})
                            break;
                        case 604:
                            noticeFrame.updateNotice(task.id, {class:"error", text:"Network Error"})
                            break;
                        case 605:
                            noticeFrame.updateNotice(task.id, {class:"error", text:"评论区未找到"})
                            break;
                        default:
                            noticeFrame.updateNotice(task.id, {class:"error", text:"Unknown Error"})
                            log.error("React Unknown Error--->", code)
                            break;
                    }
                }

                switch(task.task.name)
                {
                    case "Join Steam Group":
                        STEAM.JoinGroup(react, task.data.url);
                        break;
                    case "Rep Steam Account":
                        STEAM.Rep(react, task.data.id);
                        break;
                    case "Wishlist Steam Game":
                        STEAM.AddWishlist(react, task.data.id);
                        break;
                    case "Follow Twitter Account":
                        TWITTER.FollowAuto(react, task.data);
                        break;
                    case "Join Discord Server":
                        if(!discordAuth.enable){
                            DISCORD.JoinServer(react, task.data)
                        }else{
                            let server = task.data.url.split(".gg/")[1];
                            DISCORD2.JoinServer(react, server)
                        }
                        break;
                    case "Retweet Twitter Tweet":
                        TWITTER.RetweetAuto(react, task.data.url);
                        break;
                    case "Save Spotify Album":
                        SPOTIFY.SaveAuto(react, task.data);
                        break;
                    case "Follow Spotify Account":
                        SPOTIFY.Follow(react, task.data);
                        break;
                    case "Follow Twitch Channel":
                        TWITCH.FollowAuto(react, task.data.id);
                        break;
                        //case "Follow Tumblr Blog":
                        //TUMBLR.Follow(react, task.data.name);
                        //break;
                    default:
                        noticeFrame.updateNotice(task.id, {class:"error", text:"Unknow Type:" + task.task.name})
                        log.error("未指定操作" + task.task.name)
                        break;
                }
            },
            // 做任务
            do_task: function(data){
                log.info("遍历做任务")
                for(const task of data.actions)
                {
                    this.do_task_single(task)
                }
                log.info("遍历完毕")

                let i = 0;

                // 清除上次残留线程
                if(null != completeCheck)clearInterval(completeCheck);
                let discordCheck = true;
                const completeCheckFunc = ()=>{
                    log.info("检测任务是否完成", "start")
                    i++;
                    //if(i >= 50)clearInterval(completeCheck);
                    //else
                    log.info("点击redeem按钮")
                    // 点击redeem按钮
                    jq('.card-body button[class="btn btn-primary"]').click();
                    // 除遮罩
                    jq(".modal-backdrop, .fade, .show").remove();
                    /*
                    if(1 == jq('#fraud-warning-modal[style!="display: none;"]').length){
                        log.info("有弹窗，模拟点击OK")
                        const ele = jq('button.btn.btn-secondary[type!="button"]')
                        if(ele.length > 0)ele[0].click();
                    }*/
                    if( document.getElementById("toast-container")){
                        if(document.getElementById("toast-container").textContent == "This action does not exist."){
                            log.info("任务操作不存在")
                            jq('.card').remove();
                        }
                        // check discord error [Could not refresh Discord information, please try again.]
                        if(discordCheck == true && (document.getElementById("toast-container").textContent == "Could not verify server information from Discord, please try again." || document.getElementById("toast-container").textContent == "Could not refresh Discord information, please try again."))
                        {
                            log.info("Discord 身份过期")
                            discordCheck = false;
                            GM_openInTab("https://www.keyjoker.com/account/identities?keyjokertask=unbindDiscord", false)
                        }
                    }
                    if(jq(".list-complete-item").length == 0)
                    {
                        clearInterval(completeCheck);
                        noticeFrame.addNotice({type:"msg", msg:"<span data-i18n='notification.taskOK'>任务似乎已完成，恢复监测!</span>"});
                        GM_setValue("start", 1);
                        checkSwitch();
                        checkTask.next();
                    }
                    log.info("检测任务是否完成", "end")
                }
                completeCheck = setInterval(completeCheckFunc, 5 * 1000)
            },
            // 人机验证出现图片时的处理
            hC_get_c: function(r){
                new Promise((resolve, reject)=>{
                    HTTP.GET( 'https://hcaptcha.com/checksiteconfig?host=dashboard.hcaptcha.com&sitekey=e4b28873-6852-49c0-9784-7231f004b96b&sc=1&swa=1', null, {
                        headers: { 'Content-Type': 'application/json; charset=utf-8'},
                    }).then(res=>{
                        let ret = JSON.parse(res.response);
                        if(ret.pass){
                            GM_log(ret);
                            resolve(ret.c);
                        }else{
                            reject();
                        }
                    })
                }).then((c)=>{
                    r(c);
                }).catch((err)=>{
                    log.error(err);
                    //let text = document.getElementsByClassName("prompt-text")[0].innerText;
                    //document.getElementsByClassName("prompt-text")[0].innerText = text + "\n免验证Cookie获取异常，请手动进行验证";
                });

            },
            hC_getcaptcha: function(r){
                this.hC_get_c((c)=>{
                    new Promise((resolve, reject)=>{
                        HTTP.POST('https://hcaptcha.com/getcaptcha', jq.param({
                                sitekey:'e4b28873-6852-49c0-9784-7231f004b96b',
                                host:'dashboard.hcaptcha.com',
                                n:'暂未实现获取方案',
                                c:JSON.stringify(c)
                            }), {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                        })
                    }).then((res)=>{
                        let rep = JSON.parse(res.response);
                        let c = rep.generated_pass_UUID
                        r(c);
                    }).catch((err)=>{
                        log.error(err);
                        r(false)
                        //let text = document.getElementsByClassName("prompt-text")[0].innerText;
                        //document.getElementsByClassName("prompt-text")[0].innerText = text + "\ngetcaptcha failed!";
                    });
                });
            },
            hcaptcha2: function () {
                return false;
                let hcaptcha2Click=setInterval(()=>{
                    if(document.getElementsByClassName("challenge-container").length != 0 && document.getElementsByClassName("challenge-container")[0].children.length != 0)
                    {
                        clearInterval(hcaptcha2Click);
                        log.log("open hcaptcha");
                        let text = document.getElementsByClassName("prompt-text")[0].innerText;
                        document.getElementsByClassName("prompt-text")[0].innerText = text + "\n正在自动获取免验证Cookie";
                        //$(".task-grid").remove();
                        //$(".challenge-example").remove();

                        HTTP.GET('https://accounts.hcaptcha.com/user', null, {
                            headers: { 'Content-Type': 'application/json'},
                        }).then((csrf)=>{
                            this.hC_getcaptcha((token)=>{
                                if(token == false)
                                {
                                    document.getElementsByClassName("prompt-text")[0].innerText = text + "\ntoken 获取失败";
                                    return ;
                                }
                                HTTP.POST('https://accounts.hcaptcha.com/accessibility/get_cookie', JSON.stringify({token:token}), {
                                    headers: { 'Content-Type': 'application/json','x-csrf-token':csrf},
                                }).then(res=>{
                                    let response = res
                                    if(response.status == 200)
                                    {
                                        document.getElementsByClassName("prompt-text")[0].innerText = text + "\n免验证Cookie获取成功，请重新点击验证框";
                                    }else if(response.status == 401)
                                    {
                                        document.getElementsByClassName("prompt-text")[0].innerText = text + "\n当前账号或IP的免验证Cookie获取次数已达上限，请更换hcaptcha账号或IP";
                                        // setTimeout(()=>{window.open("https://dashboard.hcaptcha.com/welcome_accessibility")}, 3000);
                                    }else if(response.status == 500)
                                    {
                                        document.getElementsByClassName("prompt-text")[0].innerText = text + "\n未登录hCaptcha";
                                        // setTimeout(()=>{window.open("https://dashboard.hcaptcha.com/welcome_accessibility")}, 3000);
                                    }else{
                                        log.error(response);
                                        document.getElementsByClassName("prompt-text")[0].innerText = text + "\n发生未知错误,已将数据记录至控制台";
                                    }
                                }).catch(err=>{
                                    log.error(err)
                                })
                            });
                        }).catch((err)=>{
                            if(err.status == 401)
                            {
                                document.getElementsByClassName("prompt-text")[0].innerText = text + "\n未登录hCaptcha";
                                // setTimeout(()=>{window.open("https://dashboard.hcaptcha.com/welcome_accessibility")}, 3000);
                            }else{
                                document.getElementsByClassName("prompt-text")[0].innerText = text + "\n未知错误";
                            }
                            log.error(err);
                        });
                    }
                },1000);
            },
            // OK
            redeemAuto: function(redirect_url){
                if(0 != jq('a[href="' + redirect_url + '"]').length)jq('a[href="' + redirect_url + '"]').next().click();
            },
            reset: function (){
                if(!confirm("你确定要执行重置操作？"))return;
                noticeFrame.addNotice({type:"msg",msg:"正在重置设置"})
                const listValues = GM_listValues()
                for (const value of listValues) {
                    if(value == "currentVer")continue;
                    noticeFrame.addNotice({type:"msg",msg:"<font class=\"error\">正在删除：" + value + "</font>"})
                    GM_deleteValue(value)
                }
                noticeFrame.addNotice({type:"msg",msg:"设置重置完毕"})
            },
            getBrowserInfo: function() {
                let agent = navigator.userAgent.toLowerCase();
                //console.log(agent);
                // let system = agent.split(' ')[1].split(' ')[0].split('(')[1];
                let REGSTR_EDGE = /edge\/[\d.]+/gi;
                let REGSTR_IE = /trident\/[\d.]+/gi;
                let OLD_IE = /msie\s[\d.]+/gi;
                let REGSTR_FF = /firefox\/[\d.]+/gi;
                let REGSTR_CHROME = /chrome\/[\d.]+/gi;
                let REGSTR_SAF = /safari\/[\d.]+/gi;
                let REGSTR_OPERA = /opr\/[\d.]+/gi;
                let REGSTR_QQ = /qqbrowser\/[\d.]+/gi;
                let REGSTR_METASR = /metasr\+/gi;
                let REGSTR_WECHAT = /MicroMessenger\/[\d.]+/gi;

                if (agent.indexOf('trident') > 0) {
                    // IE
                    return [agent.match(REGSTR_IE)[0].split('/')[0], agent.match(REGSTR_IE)[0].split('/')[1]];
                } else if (agent.indexOf('msie') > 0) {
                    // OLD_IE
                    return [agent.match(OLD_IE)[0].split('/')[0], agent.match(OLD_IE)[0].split('/')[1]];
                } else if (agent.indexOf('edge') > 0) {
                    // Edge
                    return [agent.match(REGSTR_EDGE)[0].split('/')[0], agent.match(REGSTR_EDGE)[0].split('/')[1]];
                } else if (agent.indexOf('firefox') > 0) {
                    // firefox
                    return [agent.match(REGSTR_FF)[0].split('/')[0], agent.match(REGSTR_FF)[0].split('/')[1]];
                } else if (agent.indexOf('opr') > 0) {
                    // Opera
                    return [agent.match(REGSTR_OPERA)[0].split('/')[0], agent.match(REGSTR_OPERA)[0].split('/')[1]];
                } else if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
                    // Safari
                    return [agent.match(REGSTR_SAF)[0].split('/')[0], agent.match(REGSTR_SAF)[0].split('/')[1]];
                } else if (agent.indexOf('qqbrowse') > 0) {
                    // qqbrowse
                    return [agent.match(REGSTR_QQ)[0].split('/')[0], agent.match(REGSTR_QQ)[0].split('/')[1]];
                } else if (agent.indexOf('metasr') > 0) {
                    // metasr火狐
                    return 'metasr';
                } else if (agent.indexOf('micromessenger') > 0) {
                    // 微信内置浏览器
                    return [agent.match(REGSTR_WECHAT)[0].split('/')[0], agent.match(REGSTR_WECHAT)[0].split('/')[1]];
                } else if (agent.indexOf('chrome') > 0) {
                    // Chrome
                    return [agent.match(REGSTR_CHROME)[0].split('/')[0], agent.match(REGSTR_CHROME)[0].split('/')[1]];
                } else {
                    return ['chrome', '97.0.4692.71'];
                }
            },
            runDirectUrl:function(direct_url){
                GM_log("====访问跳转链接====")
                HTTP.GET(direct_url, null, {
                    headers: {'x-csrf-token': jq('meta[name="csrf-token"]').attr('content')},
                })
            },
            test: function(){
                // GM_openInTab("https://discord.com/channels/@me?keyjokertask=storageAuth", true);
                DISCORD2.JoinServer(log.info, 'h9frErUaV4')
                //console.log(func.getBrowserVersion())
            }
        }
        // ============Start===========
        if(location.pathname == "/entries"){
            window.onload=()=>{
                log.info("KJ main")
                GM_setValue("discord", {})
                if(document.getElementsByClassName("nav-item active").length != 0 && document.getElementsByClassName("nav-item active")[0].innerText == "Earn Credits" && document.getElementById("logout-form")){
                    if(typeof kjData === "object")
                    {
                        log.log("加载app.js.....")
                        jq('.row')[1].remove();
                        jq('.layout-container').append('<entries-component></entries-component>');
                        kjData["app.js"]();
                        // fix dropdown
                        document.getElementById('user-dropdown').click()
                    }

                    try{
                        log.log("i18n初始化")
                        // i18n初始化 navigator.language
                        // use plugins and options as needed, for options, detail see
                        // https://www.i18next.com/overview/configuration-options
                        i18next.use(i18nextHttpBackend).init({
                            lng: KJConfig.language || navigator.language, // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
                            backend:{
                                loadPath : languagePrefix + '/{{lng}}/{{ns}}.json?v=' + GM_info.script.version,
                            },
                            ns: ['translation','message'],
                            defaultNS: 'translation', //默认使用的，不指定namespace时
                        }, function(err, t) {
                            log.log("i18n初始化END")
                            // for options see
                            // https://github.com/i18next/jquery-i18next#initialize-the-plugin
                            jqueryI18next.init(i18next, jq, {
                                tName: 't', // --> appends $.t = i18next.t
                                i18nName: 'i18n', // --> appends $.i18n = i18next
                                handleName: 'localize', // --> appends $(selector).localize(opts);
                                selectorAttr: 'data-i18n', // selector for translating elements
                                targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if diffrent then itself)
                                optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
                                useOptionsAttr: true, // see optionsAttr
                                parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
                            });

                            // 加载操作面板
                            noticeFrame.loadFrame();
                            // 事件绑定
                            eventBind();
                            // 更新检测
                            checkUpdate();

                            // start localizing, details:
                            // https://github.com/i18next/jquery-i18next#usage-of-selector-function
                            jq('.notification').localize();
                            jq(".border-bottom").localize()
                            if(GM_getValue("start")==1){
                                setTimeout(()=>{checkTask.next()}, 1000);
                            }
                            //jq('.nav').localize();
                            //jq('.content').localize();

                        });
                    }catch(e){
                        log.error(e)
                    }

                }else{
                    if(jq('.container').length > 0)
                    {
                        let i = 0;
                        let check = setInterval(()=>{
                            i++;
                            if(jq('.container')[0].innerText == "Whoops, looks like something went wrong.")location.href = location.pathname
                            if(i >= 10)clearInterval(check)
                        }, 1000);
                    }
                }
            }
        }else{
            func.appHandle();
        }
        function checkUpdate(){
            // 隔一段时间检测新版本
            if(new Date().getTime() - (GM_getValue("lastCheckUpdate") || 0) > 6 * 60 * 60 * 1000)
            {
                func.checkUpdate();
                GM_setValue("lastCheckUpdate", new Date().getTime())
            }
        }
        // 时间绑定
        function eventBind(){
            jq('button#checkUpdate').click(func.checkUpdate)
            // 开始做任务按钮
            jq('button#fuck').click(function(){
                if(null != completeCheck){
                    clearInterval(completeCheck);
                    completeCheck=null;
                }
                checkTask.start(()=>{jq('.card').remove();})
            })
            // 停止做任务按钮
            jq('button#stop-fuck').click(function(){
                GM_setValue('start', 0)
                if(null != completeCheck){
                    clearInterval(completeCheck);
                    completeCheck=null;
                }
                // 按钮切换
                jq('#fuck').parent().removeClass('hidden')
                jq('#pause-fuck').parent().addClass('hidden')
                jq('#stop-fuck').parent().addClass('hidden')
                jq(".border-bottom").html(`<span data-i18n='message.taskStopped'>手动停止</span>`);
                jq('#fuck').parent().removeClass('hidden')
                jq('#stop-fuck').parent().addClass('hidden')
            })
            jq('button#clearNotice').click(function(){
                noticeFrame.clearNotice()
            })
            jq('button#changeLog').click(function(){
                noticeFrame.addNotice({type:"msg", msg:"<span data-i18n=\"notification.getChangeLog\">获取日志中...</span>"})
                HTTP.GET( 'https://task.jysafe.cn/keyjoker/script/update.php?type=changelog&ver=' + GM_info.script.version, null, {
                    headers:{action: "keyjoker"},
                }).then(res=>{
                    let ret = JSON.parse(res.response)
                    if(ret.status != 200)
                    {
                        noticeFrame.addNotice({type:"msg", msg:"异常！<font class=\"error\">" + ret.msg + "</font>"})
                    }else
                    {
                        noticeFrame.addNotice({type:"msg", msg:"<font class=\"success\">" + ret.msg + "</font>"})
                    }
                }).catch(err=>{
                    log.error(err);
                    noticeFrame.addNotice({type:"msg", msg:"<font class=\"error\">请求异常！请至控制台查看详情！</font>"})
                })
            })
            jq('button#setting').click(function(){
                // https://msojocs.github.io/keyjoker-script/
                const settingPage = GM_openInTab('https://msojocs.github.io/keyjoker-script/', {active: true, insert: true, setParent: true})
                settingPage.onclose = ()=>{
                    // 关闭设置页面后更新配置
                    KJConfig.language = GM_getValue('KJConfig').language
                    i18next.changeLanguage(KJConfig.language, (err, t) => {
                        if (err) console.log('something went wrong loading', err);
                        jq('.notification').localize()
                        jq('.border-bottom').localize()
                        jq('#custom-modal').localize()
                    });
                }
            })
            jq('button#report').click(function(){
                noticeFrame.addNotice({type:"msg",msg:"<span data-i18n='notification.reportChannel'>目前提供以下反馈渠道：</span>"})
                noticeFrame.addNotice({type:"msg",msg:"<a href=\"https://greasyfork.org/zh-CN/scripts/406476-keyjoker-auto-task/feedback\" target=\"_blank\">Greasy Fork</a>"})
                noticeFrame.addNotice({type:"msg",msg:"<a href=\"https://github.com/msojocs/keyjoker-script/issues/new/choose\" target=\"_blank\">GitHub</a>"})
                noticeFrame.addNotice({type:"msg",msg:"<a href=\"https://www.jysafe.cn/4332.air\" target=\"_blank\">博客页面</a>"})
            })
            // 版本升级后显示一次更新日志
            if(GM_getValue("currentVer") != GM_info.script.version)
            {
                HTTP.GET('https://task.jysafe.cn/keyjoker/script/update.php?type=changelog&ver=' + GM_info.script.version, null, {
                    headers:{action: "keyjoker"},
                    anonymous:true
                }).then(res=>{
                    let ret = JSON.parse(res.response)
                    if(ret.status != 200){
                        noticeFrame.addNotice({type:"msg", msg:"异常！<font class=\"error\">" + ret.msg + "</font>"})
                    }else{
                        noticeFrame.addNotice({type:"msg", msg:"<font class=\"success\">" + ret.msg + "</font>"})
                    }
                }).catch(err=>{
                    log.error(err);
                    noticeFrame.addNotice({type:"msg", msg:"更新日志获取异常！请至控制台查看详情！"})
                })
                GM_setValue("currentVer", GM_info.script.version)
            }
        }
        GM_registerMenuCommand("设置时间间隔", checkTask.setTime);
        GM_registerMenuCommand("重置设置", func.reset);
        GM_registerMenuCommand("凭证检测",()=>{
            func.authVerify();
        });
        function checkSwitch(){
            GM_unregisterMenuCommand(checkSwitchId);
            if(1 == GM_getValue("start")){
                checkSwitchId = GM_registerMenuCommand("停止检测",()=>{
                    let date=new Date();
                    let hour=date.getHours();
                    let min=date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes();
                    GM_setValue("start",0);
                    jq(".border-bottom").text("手动停止");
                    checkSwitch();
                });
            }else{
                checkSwitchId = GM_registerMenuCommand("开始检测",()=>{
                    checkTask.start();
                    checkSwitch();
                });
            }
        }
        // 检测开关
        checkSwitch(null);
        if(debug)
        {
            GM_registerMenuCommand("Test",()=>{
                func.test();
            });
        }
    } catch (e) {
        setTimeout(() => {
            noticeFrame.addNotice({ type: 'msg', msg:"<font class\"error\">任务脚本执行期间发生预期之外的错误，详情见控制台</font>" })
        }, 500)
        console.log('发生异常：%c%s', 'color:white;background:red', e.stack)
    }
})();
