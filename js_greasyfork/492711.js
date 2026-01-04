// ==UserScript==
// @name         NGA优化摸鱼体验插件-信息加强
// @namespace    https://github.com/DelCrona/NGA_checkInfo
// @version      1.1.1
// @author       DelCrona
// @description  修复属地显示，成分查询（仅1页）
// @license      MIT
// @require      https://cdn.staticfile.net/jquery/3.4.0/jquery.min.js
// @require      https://cdn.staticfile.net/spectrum/1.8.0/spectrum.js
// @require      https://cdn.staticfile.net/localforage/1.10.0/localforage.min.js
// @require      https://cdn.staticfile.net/echarts/5.4.2/echarts.min.js
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @match        *://g.nga.cn/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        unsafeWindow
// @run-at       document-start
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/492711/NGA%E4%BC%98%E5%8C%96%E6%91%B8%E9%B1%BC%E4%BD%93%E9%AA%8C%E6%8F%92%E4%BB%B6-%E4%BF%A1%E6%81%AF%E5%8A%A0%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/492711/NGA%E4%BC%98%E5%8C%96%E6%91%B8%E9%B1%BC%E4%BD%93%E9%AA%8C%E6%8F%92%E4%BB%B6-%E4%BF%A1%E6%81%AF%E5%8A%A0%E5%BC%BA.meta.js
// ==/UserScript==

(function (registerPlugin) {
    'use strict';
    registerPlugin({
        name: 'checkInfo',  // 插件唯一KEY
        title: '信息增强',  // 插件名称
        desc: '修复查询端口被封的问题',  // 插件说明
        settings: [{
            key: 'textInput',
            title: '占位符',
            desc: '描述信息\n描述信息',
        }],
        requestTasks: [],
        currentUserInfo: {},
        queryTimer: null,
        $el: null,
        pageInfo: {},
        beforeSaveSettingFunc(setting) {
            //console.log(setting)
            // return 值则不会保存，并抛出错误
            //return '拦截'
        },
        preProcFunc() {
            console.log('已运行: preProcFunc()')
        },
        initFunc() {
            console.log('已运行: initFunc()')
            console.log('插件ID: ', this.pluginID)
            console.log('插件配置: ', this.pluginSettings)
            console.log('主脚本: ', this.mainScript)
            console.log('主脚本引用库: ', this.mainScript.libs)
        },
        postProcFunc() {

        },
        renderThreadsFunc($el) {

        },
        renderFormsFunc($el) {
            var _this = this;
            const uid = parseInt($el.find('[name="uid"]').text());
            const userInfo = unsafeWindow.commonui.userInfo.users[uid];
            //console.log(userInfo);
            $el.find('.hld__qbc').append('<button id=repair>1页主题回复</button>');
            //点击按钮执行
            $el.find('.hld__qbc > #repair').click(() => {
                if($el.find('.postcontent > .checkInfo_record').length) return;
                //给全局变量赋值，方便调用
                this.$el = $el;
                this.currentUserInfo = userInfo;
                this.pageInfo = {
                post: {
                    label: '发布主题',
                    pages: 0,
                    status: '',
                    earliestPostdate: new Date().getTime() / 1000
                },
                reply: {
                    label: '回复主题',
                    pages: 0,
                    status: '',
                    earliestPostdate: new Date().getTime() / 1000
                }};
                // 一页主题+一页回复
                _this.checkRecord(uid, 'post', 1);
                _this.queryRecord('on');
            });
            //调用获取信息的函数，异步使用
            _this.getUserInfo(uid)
                .then(userInfo =>{
                    this.$el = $el;
                    //覆盖本体属地信息
                    _this.displayLoc(userInfo);
                })
            
        }, 
        checkRecord(uid, type, page){
            return new Promise((resolve, reject) => {
                var url = `https://${window.location.host}/thread.php?authorid=${uid}&page=${page}`
                if (type == 'reply') url += '&searchpost=1';
                $.ajax({url})
                    .then(postInfo =>{
                        var _this = this;
                        var parser = new DOMParser();
                        var htmlDoc = parser.parseFromString(postInfo, "text/html");
                        var scriptTags = htmlDoc.querySelectorAll('.titleadd2')
                        var contentCount = {};
                        //全局变量翻页
                        if (page > this.pageInfo[type].pages) {
                            this.pageInfo[type].pages = page;
                        }
                        //获取成分
                        if (scriptTags.length) {
                            scriptTags.forEach(element =>{
                                //console.log(element.textContent);
                                var content = element.textContent.trim();
                                if (contentCount[content]) {    
                                    contentCount[content]++;
                                  } else {
                                    contentCount[content] = 1;
                                  }
                            })
                        }
                        //打印+合并
                        _this.displayRecord(uid, contentCount);
                        resolve(contentCount);
                    })
            })
            .catch(error => {
                // 请求失败，将错误传递给reject
                reject(error);
                console.log(error);
            });
        },
        async queryRecord(status){
            if(status != 'end'){
                var _this = this;
                //定时任务，启动！
                this.queryTimer = setInterval(async() => {
                    try {
                        /*
                        if(this.pageInfo.post.pages < 3){
                            console.log(this.pageInfo.post.pages + 1);
                            await _this.checkRecord(this.currentUserInfo.uid, 'post', this.pageInfo.post.pages + 1)
                        } 
                        else*/ 
                        if(this.pageInfo.reply.pages < 1){
                            //console.log(this.pageInfo.reply.pages + 1);
                            await _this.checkRecord(this.currentUserInfo.uid, 'reply', this.pageInfo.reply.pages + 1);
                            this.queryRecord('end');
                        }
                        if(this.pageInfo.post.pages >= 3 && this.pageInfo.reply.pages >= 3) this.queryRecord('end');
                        
                    } catch(err) {
                        console.log(err)
                        this.queryRecord('end');
                    } finally {

                    }
                }, 3000); 
            } else {
                if (this.queryTimer) {
                    clearInterval(this.queryTimer)
                    this.queryTimer = null
                }
            }
        },
        displayLoc(userInfo){
            var _this = this;
            //调用本体函数显示属地
            var flag = _this.mainScript.getModule('UserEnhance').getCountryFlag(userInfo.ipLoc);
            this.$el.find('.hld__user-location').attr('title', `IP属地: ${userInfo.ipLoc}`)
            this.$el.find('.hld__user-location > span').replaceWith(flag);
        },
        displayRecord(uid, contentCount){
            //查找是否生成过
            var insert = this.$el.find('.postcontent > .checkInfo_record').length;
            if(!insert){
                //生成第一页
                this.$el.find('.postcontent').prepend(`<div class = checkInfo_record><span>${JSON.stringify(contentCount,null,2)}</span></div>`);
            }else{
                //原值和新值合并
                var reply =  this.$el.find('.postcontent > .checkInfo_record').text();
                var replyJson = JSON.parse(reply);
                //轮询每个键，相同则+1，不同则新增
                Object.keys(contentCount).forEach(key =>{
                    replyJson[key] = (replyJson[key] || 0) + contentCount[key];
                }) 
                this.$el.find('.postcontent > .checkInfo_record').text(`${JSON.stringify(replyJson,null,2)}`)
                //console.log(replyJson);
            }
        },
        //访问个人页获取uid和信息字符串
        getUserInfo(uid){
            return new Promise((resolve, reject) => {
                $.ajax(`https://${window.location.host}/nuke.php?func=ucp&uid=${uid}`)
                    .then(html => {
                        var parser = new DOMParser();
                        var htmlDoc = parser.parseFromString(html, "text/html");
                        // 查找包含__UCPUSER项的<script>标签
                        var scriptTags = htmlDoc.querySelectorAll("script");
                        scriptTags.forEach(scr =>{
                            //获取标签里的内容
                            var scrText = scr.textContent;
                            if (scrText.includes("__UCPUSER")){
                                //获取用户信息的json文件并以正则提取
                                var match = scrText.match(/var __UCPUSER =(\{.*\});/);
                                var userInfo = JSON.parse(match[1]);
                                // 解析成功，将用户信息传递给resolve
                                resolve(userInfo);
                            }
                        })
                    })
                    .catch(error => {
                        // 请求失败，将错误传递给reject
                        reject(error);
                    });
            });
        },
        asyncStyle() {
            return `#ngascript_plugin_${this.pluginID} {color: red}`
        },
        style: `
        #ngascript_plugin_test {color: red}
        `
    })

})(function(plugin) {
    plugin.meta = GM_info.script
    unsafeWindow.ngaScriptPlugins = unsafeWindow.ngaScriptPlugins || []
    unsafeWindow.ngaScriptPlugins.push(plugin)
});