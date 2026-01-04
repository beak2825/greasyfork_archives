    // ==UserScript==
    // @name         NGA优化摸鱼体验插件-标记整页
    // @namespace    https://github.com/DelCrona/WholePageMark
    // @version      2.4
    // @author       DelCrona
    // @description  一键标全楼，浏览自动标。
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
// @downloadURL https://update.greasyfork.org/scripts/489007/NGA%E4%BC%98%E5%8C%96%E6%91%B8%E9%B1%BC%E4%BD%93%E9%AA%8C%E6%8F%92%E4%BB%B6-%E6%A0%87%E8%AE%B0%E6%95%B4%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/489007/NGA%E4%BC%98%E5%8C%96%E6%91%B8%E9%B1%BC%E4%BD%93%E9%AA%8C%E6%8F%92%E4%BB%B6-%E6%A0%87%E8%AE%B0%E6%95%B4%E9%A1%B5.meta.js
    // ==/UserScript==

    (function (registerPlugin) {
        'use strict';
        const PageMark = ({
            name: 'PageMark',  // 插件唯一KEY
            title: '标记整页',  // 插件名称
            desc: '一键对整页用户上标记,点击右边设置按钮使用',  // 插件说明
            settings: [{
                key: 'tips',
                title: '1.使用之前先备份本体配置文件和标记列表'
            },{
                key: 'tips2',
                title: '2.不用的时候取消勾选或者关闭插件，否则看到哪标到哪。'
            },{
                key: 'tips3',
                title: '3.出bug的话可以去github反馈'
            },{
                key: 'tips4',
                title: '4.如果文本重复但是颜色不重复，不会自动标记'
            },{
                key: 'tips5',
                title: '5.不同窗口同时一键标记会串标少标'
            },{
                key: 'markEnable',
                title: '启用自动浏览标记',
                desc: '勾选来启动自动标记（不用记得关）',
                default: false
            },{
                key: 'markAllEnable',
                title: '启用一键标记全贴',
                desc: '勾选启动，请在单个窗口使用！',
                default: true
            },{
                key: 'anonyEnable',
                title: '启用标记匿名',
                desc: '勾选标记匿名，不勾选就不标 P.S：匿名用户为共用UID，标记无法破匿名，可按需勾选',
                default: false
            },{
                key: 'defColor',
                title: '使用默认颜色（蓝色）[#1f72f1]',
                desc: '这个选项出现的原因是：作者的默认色表没有他的默认颜色#1f72f1，我不懂这是为什么。',
                default: true
            },{
                key: 'markColor',
                title: '自定义颜色',
                desc: '默认蓝色，下面的色表里没有这个颜色，需要默认颜色请勾选上方按钮',
                default: '#1f72f1'
            },{
                key: 'markInput',
                title: '输入你要挂的标记',
                desc: '在此处填写，不宜过长，我不知道会不会有bug',
                default: ''
            }],
            markColor: '#1f72f1',
            markList: [],
            executeCount: 0,
            isMarking: false,
            preProcFunc() {
                // console.log('已运行: preProcFunc()')

            },
            initFunc() {
                // 调用标准模块authorMark初始化颜色选择器
                const $ = this.mainScript.libs.$;
                this.mainScript.getModule('AuthorMark').initSpectrum(`[plugin-id="${this.pluginID}"][plugin-setting-key="markColor"]`);
                
                // 提前标记颜色属性，在初始化模块判断使用哪个颜色
                if(!this.pluginSettings['defColor']) this.markColor = this.pluginSettings['markColor'];
                console.log(`标记颜色：${this.markColor}`);

                /* console.log($.trim(' '))
                console.log('已运行: 标记整页')
                console.log('插件ID: ', this.pluginID)
                console.log('插件配置: ', this.pluginSettings)
                console.log('主脚本: ', this.mainScript)
                console.log('主脚本引用库: ', this.mainScript.libs) */
            },
            postProcFunc() {

            },
            renderThreadsFunc($el) {
                //筛掉不是主题帖的链接
                if ($el.find('input[type="checkbox"]').length || !this.pluginSettings['markAllEnable']) return;
                //写按钮和点击
                $el.find('.c2').append(`<button class="hld__markForum hld__help" id=repair help=标记全贴&nbsp;当前标记:${this.pluginSettings["markInput"]}>🏷️</button>`);
                $el.find('.c2 > .hld__markForum').click(() =>{
                    if(this.pluginSettings['markInput'].trim() == '')  {
                        this.mainScript.popMsg(`标记为空，无法标记`);
                        return;
                    } else if ($el.find('.c2 > .hld__markForum').attr('id') == 'repairing') {
                        this.mainScript.popMsg(`正在标记中，无法标记`, 'err');
                        return;
                    }
                    //找到对应链接和页数
                    $el.find('.c2 > .hld__markForum').attr('id', 'repairing');
                    if(this.pluginSettings['markInput'].trim() == '') return;
                    var forumlink = $el.find('.c2 > .topic').attr('href');
                    var tid = this.mainScript.getModule('AuthorMark').getQueryString('tid',forumlink);
                    var pageNumber = '1';
                    if ($el.find('.c2 > span > .pager').length){
                        pageNumber = $el.find('.c2 > span > .pager a').last().text();
                    }
                    const preMark = this.pluginSettings['markInput']; //准备标记
                    const markColor = this.markColor; //标记颜色
                    this.markList = this.mainScript.getModule('MarkAndBan').markList;
                    this.mergeUidlist(tid, pageNumber)
                        .then(list =>{
                            for (const item of list){
                                if (parseInt(item) > 0) this.markUser(item, preMark, markColor);
                            }
                            this.mainScript.setValue('hld__NGA_mark_list', JSON.stringify(this.markList))
                            this.mainScript.popMsg(`标记完成，标记了${this.executeCount}个`, 'ok');
                            console.log(`标记完成，标记了${this.executeCount}个`);
                            this.executeCount = 0;
                            $el.find('.c2 > .hld__markForum').attr('id', 'repair');
                        })
                        .catch(e =>{
                            console.log(e);
                            this.mainScript.popMsg('标记失败');
                            return;
                        })
                })
            },
            renderFormsFunc($el) {
                const currentUid = $el.find('[name=uid]').text() + '' ; // 获取uid，具体什么方式是复制的本体，能用就行。
                // 判断是否勾选启动按钮和是否标记匿名
                if (!this.pluginSettings['markEnable'] || (!this.pluginSettings['anonyEnable'] && parseInt(currentUid) < 0)){
                    console.log("未勾选启动标记或未开启标记匿名且本楼匿名，直接return");
                    return;
                }
                // const preMark = this.pluginSettings['markInput']; // 获取设置内自己填写的标记（准备标记）
                const preMark = this.pluginSettings['markInput']; // 获取设置内自己填写的标记（准备标记）
                let preColor = ""
                if(this.pluginSettings['defColor']){
                    preColor = '#1f72f1';
                }
                else{
                    preColor = this.pluginSettings['markColor'];
                }
                try{
                    var markArray = this.mainScript.getModule('MarkAndBan').getUserMarks({uid: currentUid});
                    // 判断是否为空
                    if (!markArray){
                        // 空的直接标
                        // console.log("没被标记过，可以直接标");
                        // 定义标记对象
                        let markObj = {
                            marks: [{mark: preMark, text_color: '#ffffff', bg_color: preColor}],
                            name: '',
                            uid: currentUid
                        }
                        this.mainScript.getModule('MarkAndBan').setUserMarks(markObj); // 调用标记函数
                        console.log("无标记者标记成功");
                    }else{
                        // console.log(markArray.marks[0].mark);
                        // 使用find函数找重复，有的话if判断为true接return
                        if(markArray.marks.find((element) => {return preMark === element.mark;})){
                            console.log("有重复，无需标记");
                            return;
                        }
                        /*
                        老版本写法：
                        for (let i=0; i<markArray.marks.length; i++){
                            if (preMark === markArray.marks[i].mark){
                                console.log("有重复，无需标记");
                                return;
                            }
                        }
                        */
                        // console.log("没重复，添加标记");
                        // 没有重复那么直接标记
                        // let markList = markArray.marks; // 接收标记数组
                        markArray.marks.push({mark: preMark, text_color: '#ffffff', bg_color: preColor}); // 在末尾插入标记 默认颜色是#1f72f1 作者为什么不在封装的取色列表里加入这个默认颜色，我不理解
                        // 写明标记对象并调用标记函数
                        // let markObj = {marks: markArray.marks, name: '', uid: currentUid};
                        this.mainScript.getModule('MarkAndBan').setUserMarks({marks: markArray.marks, name: '', uid: currentUid});
                        console.log("有标记者标记成功");
                    }
                }catch(e){
                    console.log(e);
                }
            },
            
             /**
             * 标记功能
             * @method markUser 标记功能
             * @description 获取UID进行标记
             * @param {String} _uid uid
             */
            async markUser(_uid, preMark, markColor){
                var markArray = this.getUserMarks({uid: _uid}); //标记对象的原标记
                //const preMark = this.pluginSettings['markInput']; //准备标记
                //const markColor = this.markColor; //标记颜色
                try{
                    if (!markArray){
                        // 空的直接标，定义标记对象
                        let markObj = {
                            marks: [{mark: preMark, text_color: '#ffffff', bg_color: markColor}],
                            name: '',
                            uid: _uid
                        }
                        //this.mainScript.getModule('MarkAndBan').setUserMarks(markObj); // 调用标记函数
                        this.setUserMarks(markObj);
                        this.executeCount += 1;
                        console.log("无标记者标记成功");
                    }else{
                        // 使用find函数找重复，有的话if判断为true接return
                        if(markArray.marks.find((element) => {return preMark === element.mark;})){
                            console.log("有重复，无需标记");
                            return;
                        }
                        // 没有重复那么直接标记
                        let pushMark = {mark: preMark, text_color: '#ffffff', bg_color: markColor}
                        markArray.marks.push(pushMark); // 在末尾插入标记 默认颜色是#1f72f1 作者为什么不在封装的取色列表里加入这个默认颜色，我不理解
                        // 写明标记对象并调用标记函数
                        let markAll = {marks: markArray.marks, name: '', uid: _uid}
                        //this.mainScript.getModule('MarkAndBan').setUserMarks(markAll);
                        this.setUserMarks(markAll);
                        this.executeCount += 1;
                        console.log("有标记者标记成功");
                    }
                }catch(e){
                    console.log(e);
                    this.mainScript.popMsg('标记失败')
                }},
                
                /**
                 * 保存标签
                 * @method setUserMarks
                 * @param {Object} userMarks 标签对象
                 */
                setUserMarks(userMarks) {
                    // 检查是否已有标签
                    const _this = this
                    const check = _this.markList.findIndex(v => (v.uid && userMarks.uid && v.uid == userMarks.uid) || 
                    (v.name && userMarks.name && v.name == userMarks.name))
                    if(check > -1) {
                        if (userMarks.marks.length == 0) {
                            _this.markList.splice(check, 1)
                        } else {
                            _this.markList[check] = userMarks
                        }
                    }else {
                        _this.markList.push(userMarks)
                    }
                },

                        /**
                 * 获取用户标签对象
                 * @method getUserMarks
                 * @param {String} uid UID
                 * @param {String} user 用户名
                 * @return {Object|null} 标签对象
                 */
                getUserMarks(user) {
                    const _this = this
                    const check = _this.markList.findIndex(v => (v.uid && user.uid && v.uid == user.uid) || (v.name && user.name && v.name == user.name))
                    if(check > -1) {
                        let userMark = _this.markList[check]
                        if ((!userMark.uid && user.uid) || (!userMark.name && user.name)) {
                            userMark.uid = user.uid + '' || ''
                            userMark.name = user.name || ''
                            //script.setValue('hld__NGA_mark_list', JSON.stringify(this.markList))
                        }
                        return userMark
                    } else {
                        return null
                    }
                },
             /**
             * 合并UID列表
             * @method mergeUidlist 合并uid列表
             * @description 合并uid列表
             * @param {String} tid 帖子链接
             * @param {Int} page 页码
             */
            async mergeUidlist(tid, page){
                //定义空set
                var mergedSet = new Set();
                //备用延迟函数
                this.mainScript.popMsg('标记中', 'warn');
                
                //循环获取每一页的uid并合并
                for(let i=1; i<=page; i++){
                    let uidSet = await this.getUidlist(tid, i)
                    try{
                        mergedSet = new Set([...uidSet, ...mergedSet]);
                    }catch(e){
                        console.log(e)
                        this.mainScript.popMsg('获取第'+i+'页失败')
                    }
                    console.log(`第${i}页`);
                }
                console.log('获取UID完成，标记中')
                this.mainScript.popMsg('获取uid完成，标记中', 'ok');
                return(mergedSet);
            },

            /**
             * 获取UID列表
             * @method getUidlist
             * @description 获取uid列表
             * @param {String} tid 帖子链接
             * @param {Int} page 页码
             */
            getUidlist(tid, page) {
                return new Promise((resolve, reject) =>{
                    let url = `https://${window.location.host}/read.php?tid=${tid}&page=${page}`
                    var uidSet = new Set();
                    $.ajax({url})
                        .then(postRes => {
                            var $dom = $(postRes) //获取的是未执行js代码的网页
                            var $uidList = $dom.find('td.c1 > span > a'); //找到有uid的链接
                            //遍历元素集合，获取uid的set
                            $uidList.each((index, href) => {
                                //console.log($(href).attr('href'));
                                let str = $(href).attr('href').toString();
                                let urlParams = new URLSearchParams(str);
                                let uid = urlParams.get('uid');
                                uidSet.add(uid);
                            })
                            resolve(uidSet)
                            
                        })
                        .catch(e => {
                            reject(e)
                        })
                })
            },
            renderAlwaysFunc() {
                // console.log('循环运行: renderAlwaysFunc()')
            },
            asyncStyle() {
                return `#ngascript_plugin_${this.pluginID} {color: red}`
            },
            style: `
            #ngascript_plugin_test {color: red; }
            .hld__markForum {text-decoration: none; background-color:#c7edcc; border:1px outset #000000; }
            `
        })
        registerPlugin(PageMark)
    })(function(plugin) {
        plugin.meta = GM_info.script
        unsafeWindow.ngaScriptPlugins = unsafeWindow.ngaScriptPlugins || []
        unsafeWindow.ngaScriptPlugins.push(plugin)
    });
