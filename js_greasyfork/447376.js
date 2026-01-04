// ==UserScript==
// @name         B站、油管、推特屏蔽原神内鬼爆料相关视频
// @namespace    http://tampermonkey.net/
// @version      3.0.0-alpha.2
// @description  屏蔽B站、油管、推特三大平台的原神、星穹铁道内鬼爆料视频和消息
// @author       凡云 - https://space.bilibili.com/3491267
// @match        *://*.bilibili.com/*
// @match        *://*.youtube.com/*
// @match        *://*.twitter.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447376/B%E7%AB%99%E3%80%81%E6%B2%B9%E7%AE%A1%E3%80%81%E6%8E%A8%E7%89%B9%E5%B1%8F%E8%94%BD%E5%8E%9F%E7%A5%9E%E5%86%85%E9%AC%BC%E7%88%86%E6%96%99%E7%9B%B8%E5%85%B3%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/447376/B%E7%AB%99%E3%80%81%E6%B2%B9%E7%AE%A1%E3%80%81%E6%8E%A8%E7%89%B9%E5%B1%8F%E8%94%BD%E5%8E%9F%E7%A5%9E%E5%86%85%E9%AC%BC%E7%88%86%E6%96%99%E7%9B%B8%E5%85%B3%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const authorLink = 'https://space.bilibili.com/3491267'
    const scriptLink = 'https://greasyfork.org/zh-CN/scripts/447376'
    const baseApi = 'https://lcybff.github.io/helper/mihoyoLeaksBlock'
    const configApi = baseApi + '/config.json'
    const areaApi = baseApi + '/arealist.json'
    const imagesAll = {
        bilibili: {
            // 右侧按钮背景图标
            openIcon: 'https://i0.hdslb.com/bfs/article/7e764e5831314a698d116f59f2977aed3491267.png',
            // 设置界面标题背景图
            layoutHeaderBg: 'https://i0.hdslb.com/bfs/article/f2ef018ee493b3e6df285333f6a9fc623491267.jpg',
            // 设置界面四角图标
            cornerIcon: 'https://i0.hdslb.com/bfs/article/e99bbc04cdb89bcd1da5d78fdab0b1dd3491267.png',
            // 外链图标
            outlinkIcon: 'https://i0.hdslb.com/bfs/article/546d3a598cbe738e74ab6645b8d3ed023491267.png',
            // 帮助图标
            helpIcon: 'https://i0.hdslb.com/bfs/article/91129a4c63c0bd1a77dd423a5f9b6c313491267.png',
            // 关闭按钮
            closeIcon: 'https://i0.hdslb.com/bfs/article/a4ac29bb1567b563b6a682d6ae467ba23491267.png',
            // 设置界面底部图
            brImg: 'https://i0.hdslb.com/bfs/article/16e88865719a0baaa4433e1334d047fb3491267.png',
            // 导入配置图标
            importIcon: 'https://i0.hdslb.com/bfs/article/03b81284c1e2e110b1fb07dc59e30ced3491267.png',
            // 导出配置图标
            exportIcon: 'https://i0.hdslb.com/bfs/article/cbe024b4261dc156cf3b154af33f56ef3491267.png',
            // 查看图标
            watchIcon: 'https://i0.hdslb.com/bfs/article/bbbf6251696153107c2774f6aa4c604b3491267.png',
            // 清除缓存配置图标
            clearIcon: 'https://i0.hdslb.com/bfs/article/0fbfaeb4d2b116bc729429745a27c4f53491267.png'
        },
        youtube: {
            openIcon: 'https://pbs.twimg.com/media/FgzUHioakAAQxc0?format=png',
            layoutHeaderBg: 'https://pbs.twimg.com/media/FhdHiktaYAAtB6Q?format=jpg',
            cornerIcon: 'https://pbs.twimg.com/media/FgzUHimaYAE0RgH?format=png',
            outlinkIcon: 'https://pbs.twimg.com/media/FyQ6cRmaMAgxd2N?format=png',
            helpIcon: 'https://pbs.twimg.com/media/FyQ6cReacAA_AFg?format=png',
            closeIcon: 'https://pbs.twimg.com/media/FyQ6cRaaYAIBj7o?format=png',
            brImg: 'https://pbs.twimg.com/media/FhdHikiaUAE1nRX?format=png',
            importIcon: 'https://pbs.twimg.com/media/FyQ6eqIaUAAaaq-?format=png',
            exportIcon: 'https://pbs.twimg.com/media/FyQ6eppaMAEh_C2?format=png',
            watchIcon: 'https://pbs.twimg.com/media/FyQ6cRfaIAAICMe?format=png',
            clearIcon: 'https://pbs.twimg.com/media/FyQ7cWPakAALZeB?format=png',
        },
        twitter: {
            openIcon: 'https://pbs.twimg.com/media/FgzUHioakAAQxc0?format=png',
            layoutHeaderBg: 'https://pbs.twimg.com/media/FhdHiktaYAAtB6Q?format=jpg',
            cornerIcon: 'https://pbs.twimg.com/media/FgzUHimaYAE0RgH?format=png',
            outlinkIcon: 'https://pbs.twimg.com/media/FyQ6cRmaMAgxd2N?format=png',
            helpIcon: 'https://pbs.twimg.com/media/FyQ6cReacAA_AFg?format=png',
            closeIcon: 'https://pbs.twimg.com/media/FyQ6cRaaYAIBj7o?format=png',
            brImg: 'https://pbs.twimg.com/media/FhdHikiaUAE1nRX?format=png',
            importIcon: 'https://pbs.twimg.com/media/FyQ6eqIaUAAaaq-?format=png',
            exportIcon: 'https://pbs.twimg.com/media/FyQ6eppaMAEh_C2?format=png',
            watchIcon: 'https://pbs.twimg.com/media/FyQ6cRfaIAAICMe?format=png',
            clearIcon: 'https://pbs.twimg.com/media/FyQ7cWPakAALZeB?format=png',
        },
    }
    const blockTimeout = 500

    // 远程获取初始化配置
    function requestConfig(api = '') {
        return new Promise(function(resolve, reject){
            GM_xmlhttpRequest({
                method: 'GET',
                url: api,
                responseType: 'json',
                onload: function(res) {
                    if (res.status == 200) {
                        resolve(res.response);
                    } else {
                        reject({ error: '数据请求失败，请稍后重试' });
                    }
                },
                onerror: function() {
                    alert('请求失败，请允许访问跨源资源重试')
                }
            })
        })
    }

    var fullBlockTitle,
    fullBlockUsers,
    fullBlockUsersWhite,
    areaList,
    areaListGM,
    images,
    activeDomain

    // 初始化过滤
    function initialize() {
        // 获取全部区域
        areaListGM = GMGetValue('areaList', [])

        images = imagesAll.common

        if (/bilibili/.test(document.domain)) {
            areaList = getAreaList('bilibili')
            initActive(toCnName('Bili'), 'Bili')
            blockArea('bilibili')
            images = imagesAll.bilibili
        }

        if (/youtube/.test(document.domain)) {
            areaList = getAreaList('youtube')
            initActive(toCnName('Ytb'), 'Ytb')
            blockArea('youtube')
            images = imagesAll.youtube
        }

        if (/twitter/.test(document.domain)) {
            areaList = getAreaList('twitter')
            initActive(toCnName('Twitter'), 'Twitter')
            blockArea('twitter')
            images = imagesAll.twitter
        }

        initImages()

        // 表单赋值
        document.getElementById('blockTitle').value = GMGetValue(fullBlockTitle)
        document.getElementById('blockUsers').value = GMGetValue(fullBlockUsers)
        document.getElementById('blockUsersWhite').value = GMGetValue(fullBlockUsersWhite)

        // 监听
        GMChange(fullBlockTitle)
        GMChange(fullBlockUsers)
        GMChange(fullBlockUsersWhite)
    }

    // 转换标识英文
    function toCnName(string = '') {
        if (/Bili/.test(string)) {
            return 'B站'
        } else if (/Ytb/.test(string)) {
            return '油管'
        } else {
            return '推特'
        }
    }

    // 公共
    function blockCommon(main = '', item = '', text = '', media = '', user = '', home = false) {
        let blockTitle = getBlockRegExp(fullBlockTitle);
        let blockUsers = getBlockRegExp(fullBlockUsers);
        let blockUsersWhite = getBlockRegExp(fullBlockUsersWhite);
        $(main).find(item).each(function(){
            let that = $(this)
            let textString = text ? that.find(text).text():''
            let userString = user ? (home === true ? $(user).text() : that.find(user).text()):''
            if (blockUsersWhite.test(userString.trim())) {
                // 白名单
            } else if (blockTitle.test(textString) || blockUsers.test(userString)) {
                blurBlock('on', that, text, media)
            } else {
                blurBlock('off', that, text, media)
            }
        })
    }

    // 推特
    function blockTwitter(item = '', text = '', media = '', user = '') {
        let blockTitle = getBlockRegExp(fullBlockTitle);
        let blockUsers = getBlockRegExp(fullBlockUsers);
        let blockUsersWhite = getBlockRegExp(fullBlockUsersWhite);
        $(item).each(function(){
            let that = $(this)
            let textString = text ? that.find(text).text():''
            let userString = user ? that.find(user).text():''
            if (blockUsersWhite.test(userString.trim())) {
                // 白名单
            } else if ((blockTitle.test(textString) || blockUsers.test(userString)) && $(item).attr('tabindex') === '0') {
                blurBlock('on', that, text, media)
            } else {
                blurBlock('off', that, text, media)
            }
        })
    }

    // 获取生效区域列表
    function getAreaList(name = '', field = 'area') {
        let list = []
        $('#blockLayout #areaWrap .areaBox .areaList').empty()
        areaListGM.forEach((e, i) => {
            let switchStatus = e.on === true ? 'on' : ''
            if (e[field] == name) {
                list.push(e)
                $('#blockLayout #areaWrap .areaBox .areaList').append('<div class="areaItem"><div class="name" title="' + e.name + '" data-index="' + i + '">' + e.name + '</div><div class="actions"><div class="switchButton ' + switchStatus + '" data-index="' + i + '"><i></i></div></div></div>')
            }
        });
        return list
    }

    // 统一过滤入口
    function blockArea(name = '') {
        setInterval(() => {
            areaList.forEach(e => {
                // 启用屏蔽状态
                if (e.on === true) {
                    switch (name) {
                        case 'twitter':
                            blockTwitter(e.item, e.text, e.media, e.user)
                            break;
                        default:
                            blockCommon(e.main, e.item, e.text, e.media, e.user, e.home)
                            break;
                    }
                }
            })
        }, blockTimeout)
    }

    // 目标标题和图片模糊化处理
    function blurBlock(type = '', item = '', text = '', media = '') {
        if (type === 'on') {
            // 添加模糊化
            item.find(text).addClass('blurBlock').attr('title', item.find(text).text())
            item.find(media).addClass('blurBlock')
        } else {
            // 去除模糊化
            item.find(text).removeClass('blurBlock')
            item.find(media).removeClass('blurBlock')
        }
    }

    // 恢复过滤前的状态
    function blockRestart() {
        $('.blurBlock').removeClass('blurBlock')
    }

    // 设置当前生效配置
    function initActive(name = '', activeName = '') {
        $('#blockLayout .tabs .tabs-title .tab').text(name)
        // 赋值键名
        fullBlockTitle = 'blockTitle' + activeName
        fullBlockUsers = 'blockUsers' + activeName
        fullBlockUsersWhite = 'blockUsersWhite' + activeName
        activeDomain = activeName
    }

    // 显示/隐藏 屏蔽设置界面
    $('body').on('click', '#blockOpenButton, #blockLayout .bg, #blockLayout .closeButton1', function() {
        $('#blockLayout').toggleClass('active')
    })

    // 显示/隐藏区域界面
    $('body').on('click', '#blockLayout .btnGroup .listButton, #blockLayout #areaWrap .closeButton2', function() {
        $('#blockLayout #areaWrap').toggleClass('show')
    })

    // 隐藏更新界面
    $('body').on('click', '#blockLayout #updateWrap .closeButton3', function() {
        $('#blockLayout #updateWrap').removeClass('show')
    })

    // 隐藏比较界面
    $('body').on('click', '#blockLayout #compareWrap .closeButton4', function() {
        $('#blockLayout #compareWrap').removeClass('show')
    })

    // 显示屏蔽区域参数修改界面
    $('body').on('click', '#blockLayout #areaWrap .areaBox .areaList .areaItem .name', function() {
        $('#blockLayout #areaWrap .areaBox .areaForm').css('display', 'flex')
        $('#blockLayout #areaWrap .areaBox .areaList').css('display', 'none')
        areaFormInit(areaListGM[$(this).data('index')], $(this).data('index'))
    })

    // 隐藏屏蔽区域参数修改界面
    $('body').on('click', '#blockLayout #areaWrap .areaBox .areaForm .backToList', function() {
        $('#blockLayout #areaWrap .areaBox .areaForm').hide()
        $('#blockLayout #areaWrap .areaBox .areaList').show()
        areaFormInit()
    })

    // 提交修改屏蔽区域参数
    $('body').on('click', '#blockLayout #areaWrap .areaBox .areaForm .submitArea', function() {
        let areaForm = document.getElementById('areaForm');
        let areaFormData = new FormData(areaForm);
        let areaData = {}
        for(var d of areaFormData.entries()) {
            let value = d[1]
            if (d[0] == 'on') {
                value = value == 'true' ? true : false
            }
            areaData[d[0]] = value;
        }
        $('#blockLayout #areaWrap .areaBox .areaForm').css('display', 'none')
        $('#blockLayout #areaWrap .areaBox .areaList').css('display', 'block')
        let index = $(this).data('index') ? $(this).data('index'):0

        areaListGM[index] = areaData
        GM_setValue('areaList', areaListGM)
        showMsg('修改成功')
        areaFormInit()
        clearInterval()
        blockRestart()
        initialize()
        return false;
    })

    // 屏蔽列表区域选项开关
    $('body').on('click', '#blockLayout #areaWrap .areaBox .areaList .areaItem .switchButton', function() {
        $(this).toggleClass("on")
        areaListGM[$(this).data('index')].on = $(this).hasClass('on')
        GM_setValue('areaList', areaListGM)
        clearInterval()
        blockRestart()
        initialize()
    });

    var importConfig = []

    // 导入配置
    $('body').on('click', '#blockLayout .importConfigButton', function() {
        requestConfig(configApi).then(res => {
            importConfig = res
            $('#blockLayout #updateWrap').addClass('show')
            $('#blockLayout #updateWrap .areaBox .areaList').empty()
            let keys = Object.keys(importConfig)
            let name, checked = '', newIcon = ''
            keys.forEach(key => {
                if (/blockTitle/.test(key)) name = toCnName(key) + ' 屏蔽关键词'
                else if (/blockUsersWhite/.test(key)) name = toCnName(key) + ' 作者白名单'
                else if (/blockUsers/.test(key)) name = toCnName(key) + ' 作者黑名单'
                if (str2RegExp('/' + activeDomain + '/').test(key)) checked = 'checked'
                if (importConfig[key] != GMGetValue(key)) newIcon = '<i></i>'
                $('#blockLayout #updateWrap .areaBox .areaList').append('<div class="areaItem"><div class="name" title="' + name + '">' + name + '</div><div class="actions"><div><input id="' + key + '" type="checkbox" ' + checked + '><label for="' + key + '"></label></div><div class="watchButton iconButton" title="查看对比" style="background-image: url(' + images.watchIcon + ')" data-key="' + key + '">' + newIcon + '</div></div></div>')
                checked = ''
                newIcon = ''
            })
        })
    })

    // 导入区域列表配置
    $('body').on('click', '#blockLayout .importAreaButton', function() {
        requestConfig(areaApi).then(res => {
            GM_setValue('areaList', res.arealist)
            clearInterval()
            blockRestart()
            initialize()
        })
    })

    // 查看新旧值对比
    $('body').on('click', '#blockLayout #updateWrap .areaBox .areaList .areaItem .watchButton', function() {
        let oldConfig = GMGetValue($(this).data('key'))
        let newConfig = importConfig[$(this).data('key')]
        $('#blockLayout #compareWrap').addClass('show')
        $('#blockLayout #compareWrap .old').val(oldConfig)
        $('#blockLayout #compareWrap .new').val(newConfig)
    });

    // 全选更新区域按钮
    $('body').on('click', '#blockLayout #updateWrap #checkAllUpdate', function(e) {
        if ($(this).prop('checked')) {
            $('#blockLayout #updateWrap .areaBox .areaList input').prop('checked', true)
        } else {
            $('#blockLayout #updateWrap .areaBox .areaList input').prop('checked', false)
        }
    })

    // 确认更新设置
    $('body').on('click', '#blockLayout .btnGroup .submitButton2', function() {
        clearInterval()
        $('#blockLayout #updateWrap .areaBox .areaList input').each(function() {
            if ($(this).prop('checked')) {
                let key = $(this).attr('id')
                GM_setValue(key, importConfig[key])
                console.log(importConfig[key])
            }
        })
        showMsg('更新成功')
        $('#blockLayout #updateWrap').removeClass('show')
        $('#blockLayout #updateWrap .areaBox .areaList').empty()
        $('#blockLayout #compareWrap').removeClass('show')
        $('#blockLayout #compareWrap textarea').val('')
        $("#blockLayout #updateWrap #checkAllUpdate").prop('checked', false)
        importConfig = []
        blockRestart()
        initialize()
    })

    // 导出配置
    $('body').on('click', '#blockLayout .exportConfigButton', function() {
        var configList = {}
        GM_listValues().forEach(e => {
            configList[e] = GM_getValue(e)
        })
        var text = JSON.stringify(configList, null, "\t");
        var element = document.createElement('a');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', '米哈游内鬼屏蔽插件配置.json');
        element.click();
        document.body.removeChild(element);
    })

    // 清理缓存配置
    $('body').on('click', '#blockLayout .clearConfigButton', function() {
        if (confirm('确认清除本地缓存？')) {
            clearInterval()
            blockRestart()
            GM_listValues().forEach(e => {
                GM_deleteValue(e)
            })
            initialize()
            showMsg('清理缓存成功')
        }
    })

    // 重置初始化设置
    $('body').on('click', '#blockLayout .btnGroup .resetButton', function() {
        if (confirm('确认初始化当前网站配置？')) {
            requestConfig(configApi).then(res => {
                clearInterval()
                GM_setValue(fullBlockTitle, res[fullBlockTitle])
                GM_setValue(fullBlockUsers, res[fullBlockUsers])
                GM_setValue(fullBlockUsersWhite, res[fullBlockUsersWhite])
                showMsg('初始化成功')
                blockRestart()
                initialize()
            })
        }
    })

    // 确认保存设置
    $('body').on('click', '#blockLayout .btnGroup .submitButton', function() {
        clearInterval()
        GM_setValue(fullBlockTitle, $('#blockTitle').val())
        GM_setValue(fullBlockUsers, $('#blockUsers').val())
        GM_setValue(fullBlockUsersWhite, $('#blockUsersWhite').val())
        showMsg('保存成功')
        blockRestart()
        initialize()
    })

    // 获取配置，如不存在则返回默认值
    function GMGetValue(name = '', defaultValue = '') {
        return GM_getValue(name) ? GM_getValue(name) : defaultValue;
    }

    // 监听同域名的其他标签页的修改操作
    function GMChange(name) {
        if (GM_getValue(name)) {
            GM_addValueChangeListener(name, function(Name, old_value, new_value, remote) {
                if (remote === true) {
                    clearInterval()
                    blockRestart()
                    initialize()
                }
            })
        }
    }

    // 显示提示
    function showMsg(msg = '', timeout = 3000) {
        $('#blockMsg').text(msg)
        $('#blockMsg').addClass('active')
        setTimeout(() => {
            $('#blockMsg').removeClass('active')
        }, timeout);
    }

    // 获取屏蔽文本并转成RegExp对象
    function getBlockRegExp(name = '') {
        let str = GM_getValue(name) ? GM_getValue(name) : null
        return new str2RegExp(str)
    }

    // 字符串转RegExp对象
    function str2RegExp(str = '') {
        return new RegExp(str.replace(/^\/|\/[a-z]*$/gi, ''), str.replace(/^\/.*\/[^a-z]*/i, ''))
    }

    // 渲染屏蔽列表表单
    function areaFormInit(data = {}, index = 0) {
        if (data) {
            let dataKeys = Object.keys(data)
            dataKeys.forEach((e, i) => {
                $('#blockLayout #areaForm ' + '[name="' + e + '"').val(data[e])
            })
            $('#blockLayout #areaWrap .areaBox .areaForm .submitArea').attr('data-index', index)
        } else {
            $('#blockLayout #areaWrap .areaBox .areaForm input').val('')
        }
    }

    // 屏蔽设置界面追加
    function addBlockConsole() {
        // 右侧按钮
        const blockOpenButton = "<a id='blockOpenButton'>米哈游内鬼屏蔽</a>";
        $('body').append(blockOpenButton)

        // 区域界面
        const areaWrap = '<div id="areaWrap"><div class="toolerGroup"><a href="javascript:;"class="importAreaButton iconButton"title="导入屏蔽配置"></a><a href="javascript:;"class="closeButton closeButton2 iconButton"title="关闭区域列表"></a></div><div class="areaBox"><h2>区域列表</h2><div class="areaList"></div><form id="areaForm"class="areaForm"><p>名称</p><input type="text"name="name"><p>域名</p><input type="text"name="area"><p>父类</p><input type="text"name="main"><p>目标</p><input type="text"name="item"><p>标题</p><input type="text"name="text"><p>媒体</p><input type="text"name="media"><input type="hidden"name="on"><input type="hidden"name="home"><p>用户名</p><input type="text"name="user"><button type="button"class="backToList">返回列表</button><button type="button"class="submitArea">确认修改</button></form></div></div>'

        // 更新、比较界面
        const updateWrap = '<div id="updateWrap"><div class="toolerGroup"><div><input id="checkAllUpdate" type="checkbox"><label for="checkAllUpdate"></label></div><a href="javascript:;"class="closeButton closeButton3 iconButton"title="关闭更新列表"></a></div><div class="areaBox"><h2>更新列表</h2><div class="areaList"></div><div class="btnGroup"><div class="submitButton2 button" alt=""><div class="icon"><div class="yellow-circle"><div class="black-circle"></div></div></div><div class="text">确认更新</div></div></div></div></div><div id="compareWrap"><div class="toolerGroup"><a href="javascript:;"class="closeButton closeButton4 iconButton"title="关闭比较界面"></a></div><div class="areaBox"><h2>更新比较</h2><p>旧值</p><textarea class="old"rows="5" readonly></textarea><p>新值</p><textarea class="new"rows="5" readonly></textarea></div></div>'

        // 设置全局界面
        const blockLayout = '<div id="blockLayout"><div class="bg"></div><div class="box"><div class="cornerIcon lt"></div><div class="cornerIcon rt"></div><div class="cornerIcon lb"></div><div class="cornerIcon rb"></div><div class="toolerGroup"><a href="javascript:;"class="clearConfigButton iconButton"title="清除缓存"></a><a href="javascript:;"class="exportConfigButton iconButton"title="导出配置"></a><a href="javascript:;"class="importConfigButton iconButton"title="导入区域配置"></a><a href="javascript:;"class="outlinkButton iconButton"target="_blank"title="作者B站主页"></a><a href="javascript:;"class="helpButton iconButton"target="_blank"title="帮助文档"></a><a href="javascript:;"class="closeButton closeButton1 iconButton"title="关闭界面"></a></div><div class="header"><h1>米哈游内鬼屏蔽工具</h1></div><div class="body"><div class="tabs"><div class="tabs-title"><div class="tab"></div></div><div class="tabs-content"><div class="tab-item"><p>屏蔽关键词</p><textarea id="blockTitle"rows="5"></textarea><p>作者黑名单</p><textarea id="blockUsers"rows="5"></textarea><p>作者白名单</p><textarea id="blockUsersWhite"rows="5"></textarea></div></div></div><div class="btnGroup"><div class="listButton button"alt=""><div class="icon listIcon"><span></span><span></span><span></span></div><div class="text">区域列表</div></div><div class="submitButton button"alt=""><div class="icon"><div class="yellow-circle"><div class="black-circle"></div></div></div><div class="text">确认修改</div></div></div><img src=""class="brImg"alt=""></div></div><div class="modulesWrap">' + areaWrap + updateWrap + '</div><div id="blockMsg"></div></div>';

        $('body').append(blockLayout)
    }

    // 追加静态图片
    function initImages() {
        $('#blockOpenButton').css('background-image', 'url(' + images.openIcon + ')')
        $('#blockLayout .box .header').css('background-image', 'url(' + images.layoutHeaderBg + ')')
        $('#blockLayout .cornerIcon').css('background-image', 'url(' + images.cornerIcon + ')')
        $('#blockLayout .outlinkButton').css('background-image', 'url(' + images.outlinkIcon + ')').attr('href', authorLink)
        $('#blockLayout .helpButton').css('background-image', 'url(' + images.helpIcon + ')').attr('href', scriptLink)
        $('#blockLayout .closeButton').css('background-image', 'url(' + images.closeIcon + ')')
        $('#blockLayout .importConfigButton').css('background-image', 'url(' + images.importIcon + ')')
        $('#blockLayout .importAreaButton').css('background-image', 'url(' + images.importIcon + ')')
        $('#blockLayout .exportConfigButton').css('background-image', 'url(' + images.exportIcon + ')')
        $('#blockLayout .clearConfigButton').css('background-image', 'url(' + images.clearIcon + ')')
        $('.brImg').attr('src', images.brImg)
    }

    // 初始化屏蔽界面
    addBlockConsole()

    // 初始化
    initialize()

    // 样式表
    const BLOCK_STYLE = `
        #blockOpenButton {
            position:fixed;
            z-index:99997;
            right:0;
            top:40%;
            width:30px;
            border-top-right-radius:2px;
            border-bottom-right-radius:2px;
            background-color:rgba(0 178 255);
            font-size:12px;
            color:#fff;
            padding:8px 9px;
            line-height:14px;
            box-sizing:border-box;
            text-decoration:none;
            outline:none;
            cursor:pointer;
            background-position: center 5px;
            background-size: 24px;
            background-repeat: no-repeat;
            padding-top: 30px;
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
            transition: all 0.3s;
        }
        #blockOpenButton:hover {
            box-shadow:0 0px 10px 0 rgba(0 178 255 / 40%);
        }
        #blockLayout {
            display: none;
        }
        #blockLayout *::-webkit-scrollbar {
            width: 6px;
            height: 1px;
        }
        #blockLayout *::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: #dfd0b3;
        }
        #blockLayout *::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            border-radius: 10px;
            background: #ededed;
        }
        #blockLayout * {
            font-family: 'system-ui' !important
        }
        #blockLayout .bg {
            position: fixed;
            inset: 0px;
            background: rgba(0, 0, 0, 0.7);
            animation-name: balh-settings-bg;
            animation-duration: 0.5s;
            z-index: 99997;
            cursor: pointer;
        }
        #blockLayout .box {
            position: fixed;
            background: rgb(59, 67, 84);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            cursor: default;
            z-index: 99997;
        }
        #blockLayout .box * {
            line-height: 1.5
        }
        #blockLayout .box .header {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            text-align: center;
            background-size: contain;
            background-repeat: no-repeat;
            height: 80px;
        }
        #blockLayout .box .body {
            padding: 20px;
            background-color: #ece5d8;
            border-bottom-right-radius: 10px;
            border-bottom-left-radius: 10px;
            background-size: cover;
        }
        #blockLayout .box img {
            max-width: 100%;
        }
        #blockLayout.active {
            display: block;
        }
        #blockLayout .box h1 {
            color: #d3bc8e;
            font-size: 32px;
            font-weight: bolder;
            line-height: 80px;
            margin: 0;
        }
        #blockLayout .box p {
            color: #323947;
            font-size: 18px;
            margin: 0;
            margin-bottom: 10px;
        }
        #blockLayout .box label {
            font-size: 16px;
        }
        #blockLayout .box .tabs {
            width: 100%;
        }
        #blockLayout .box .tabs-title {
            position: relative;
            height: 40px;
            white-space: nowrap;
            border-bottom: 1px solid #7e7e7e;
            display: flex;
        }
        #blockLayout .box .tabs-title .tab {
            display: inline-block;
            vertical-align: middle;
            font-size: 18px;
            position: relative;
            line-height: 40px;
            padding: 0 15px;
            text-align: center;
            cursor: pointer;
            flex: 1 0 0;
            width: auto;
            color: #7e7e7e;
            color: #323947;
        }
        #blockLayout .box .tabs-title .tab::after {
            position: absolute;
            left: 0;
            top: 0;
            content: "";
            width: 100%;
            height: 41px;
            border-radius: 2px 2px 0 0;
            box-sizing: border-box;
            pointer-events: none;
            border-bottom: 2px solid #323947;
        }
        #blockLayout .box .tabs-content .tab-item {
            padding: 10px 0;
            max-height: 400px;
            overflow-x: hidden;
            padding-right: 8px;
        }
        #blockLayout textarea, #blockLayout input {
            width: 100%;
            box-sizing: border-box;
            resize:none;
            padding: 10px;
            font-size: 16px;
            color: #000;
            height: 120px;
            border-radius: 5px;
            background-color: #fff;
            border: 0;
            margin-bottom: 10px;
        }
        #blockLayout input {
            padding: 4px 5px;
            height: auto;
            font-size: 14px;
        }
        #blockLayout textarea:focus-visible, #blockLayout input:focus-visible {
            outline: 0;
        }
        #blockLayout input[type="checkbox"] {
            padding: 0;
            margin: 0;
            width: auto;
        }
        #blockLayout input[type="checkbox"] + label {
            position: relative;
            margin-right: 10px;
        }
        #blockLayout input[type="checkbox"] + label::before {
            background-color: #ece5d8;
            border-radius: 0.5px;
            color: #FFF;
            content: "\\a0";
            display: inline-block;
            height: 15px;
            text-align: center;
            line-height: 100%;
            width: 15px;
            cursor: pointer;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
        #blockLayout input[type="checkbox"] {
            clip: rect(0, 0, 0, 0);
            position: absolute;
        }
        #blockLayout input[type="checkbox"]:checked + label::before {
            content: "\\2713";
            color: #323947;
        }
        #blockLayout .cornerIcon {
            position: absolute;
            width: 24px;
            height: 24px;
            background-size: 24px 24px;
        }
        #blockLayout .cornerIcon.lt {
            left: -10px;
            top: -10px;
        }
        #blockLayout .cornerIcon.rt {
            right: -10px;
            top: -10px;
            transform: rotate(90deg);
        }
        #blockLayout .cornerIcon.lb {
            left: -10px;
            bottom: -10px;
            transform: rotate(-90deg);
        }
        #blockLayout .cornerIcon.rb {
            right: -10px;
            bottom: -10px;
            transform: rotate(180deg);
        }
        #blockLayout .toolerGroup {
            position: absolute;
            top: 30px;
            right: 20px;
            display: flex;
            align-items: center;
        }
        #blockLayout .iconButton {
            cursor: pointer;
            display: inline-block;
            width: 24px;
            height: 24px;
            background-size: 24px 24px;
            margin-left: 5px;
            position: relative;
        }
        #blockLayout .iconButton.watchButton i {
            position: absolute;
            display: block;
            top: 0;
            right: 0;
            width: 6px;
            height: 6px;
            background: red;
            border-radius: 50%;
        }
        #blockLayout .btnGroup {
            display: flex;
            justify-content: space-evenly;
            margin-top: 10px;
        }
        #blockLayout #blockMsg {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            min-width: 100px;
            border-radius: 2px;
            background-color: rgba(0,0,0,.6);
            color: #fff;
            visibility: hidden;
            transition: all 0.3s;
            padding: 12px 25px;
            text-align: center;
        }
        #blockLayout #blockMsg.active {
            visibility: visible;
            z-index: 99999;
        }
        .blurBlock {
            filter: blur(30px);
        }
        #blockLayout .button {
            background-color: #4a5366;
            border-radius: 50px;
            padding: 5px;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s;
        }
        #blockLayout .button:hover {
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        #blockLayout .button .icon {
            background: #333333;
            border-radius: 50%;
            position: relative;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #blockLayout .button .text {
            color: #ece5d8;
            margin: 0 30px;
            font-size: 18px;
        }
        #blockLayout .button .icon span {
            border-radius: 10px;
            width: 20px;
            height: 2px;
        }
        #blockLayout .resetButton span {
            background-color: #38a1e4;
            position: absolute;
        }
        #blockLayout .resetButton span:first-child {
            -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
        }
        #blockLayout .resetButton span:last-child {
            -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
        }
        #blockLayout .button .icon.listIcon {
            flex-direction: column;
        }
        #blockLayout .button .icon.listIcon span {
            background-color: #ece5d8;
            margin: 3px 0
        }
        #blockLayout .button .icon .yellow-circle {
            width: 25px;
            height: 25px;
            background-color: #ffcc33;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #blockLayout .button .icon .black-circle {
            background-color: #333333;
            width: 20px;
            height: 20px;
            border-radius: 50%;
        }
        #blockLayout .modulesWrap {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99998;
            display: flex;
            gap: 10px
        }
        #blockLayout .modulesWrap > * {
            position: relative;
            width: 300px;
            border-radius: 2px;
            background-color: #323947;
            color: #fff;
            display: none;
            text-align: center;
            z-index: 99998;
            border: 5px solid #fff;
            border-radius: 10px;
        }
        #blockLayout .modulesWrap #compareWrap {
            width: 400px
        }
        #blockLayout .modulesWrap > *.show {
            display: block;
        }
        #blockLayout .modulesWrap .toolerGroup {
            top: 12px;
        }
        #blockLayout .modulesWrap .areaBox {
            padding: 12px;
        }
        #blockLayout .modulesWrap .areaBox h2 {
            font-size: 18px;
            font-weight: 400;
            margin: 0;
            color: #fff;
        }
        #blockLayout .modulesWrap .areaBox .areaList, #blockLayout .modulesWrap .areaBox .areaForm {
            margin-top: 10px;
            overflow-x: hidden;
            max-height: 340px;
            padding: 0 2px;
        }
        #blockLayout .modulesWrap #updateWrap .areaBox .areaList {
            overflow: unset;
        }
        #blockLayout .modulesWrap .areaBox .areaList .areaItem {
            padding: 0px 10px;
            margin-bottom: 5px;
            border-radius: 5px;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #323947;
            height: 33px;
        }
        #blockLayout .modulesWrap .areaBox .areaList .areaItem:hover {
            transform: scale(1.01);
        }
        #blockLayout .modulesWrap .areaBox .areaList .areaItem:last-child {
            margin-bottom: 0;
        }
        #blockLayout .modulesWrap .areaBox .areaList .areaItem .name {
            width: 70%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            cursor: pointer;
            text-align: left;
            font-size: 14px;
        }
        #blockLayout .modulesWrap .areaBox .areaList .areaItem .actions {
            width: 20%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        #blockLayout #areaWrap .areaBox .areaList .areaItem .actions .switchButton {
            position: relative;
            height: 22px;
            line-height: 22px;
            width: 45px;
            border: 1px solid #d2d2d2;
            border-radius: 20px;
            cursor: pointer;
            background-color: #fff;
            -webkit-transition: .1s linear;
            transition: .1s linear;
        }
        #blockLayout #areaWrap .areaBox .areaList .areaItem .actions .switchButton.on {
            border-color: #cfc1a6;
            background-color: #cfc1a6;
        }
        #blockLayout #areaWrap .areaBox .areaList .areaItem .actions .switchButton i {
            position: absolute;
            left: 5px;
            top: 2.5px;
            width: 16px;
            height: 16px;
            border-radius: 20px;
            background-color: #d2d2d2;
            -webkit-transition: .1s linear;
            transition: .1s linear;
        }
        #blockLayout #areaWrap .areaBox .areaList .areaItem .actions .switchButton.on i {
            left: 100%;
            margin-left: -21px;
            background-color: #fff;
        }
        #blockLayout #areaWrap .areaBox .areaForm {
            display: none;
            flex-wrap: wrap;
            justify-content: space-evenly;
            align-items: center;
        }
        #blockLayout #areaWrap .areaBox .areaForm p {
            width: 25%;
            font-size: 14px;
            margin-top: 0;
        }
        #blockLayout #areaWrap .areaBox .areaForm input {
            width: 75%;
            line-height: 0;
        }
        #blockLayout #areaWrap .areaBox .areaForm > * {
            margin-bottom: 10px;
        }
        #blockLayout #areaWrap .areaBox .areaForm button {
            width: 35%;
            margin-top: 10px;
            height: 30px;
            border-radius: 5px;
            border: 0;
            cursor:pointer;
        }
        #blockLayout #areaWrap .areaBox .areaForm button.backToList {
            background: #fff;
            color: #323947;
        }
        #blockLayout #areaWrap .areaBox .areaForm button.submitArea {
            background: #00b2ff;
            color: #fff;
        }
        #blockLayout #compareWrap .areaBox p {
            font-size: 16px;
            text-align: left;
            margin-bottom: 10px;
        }
        @media screen and (max-width: 768px){
            #blockLayout .box {
                width: 95%;
            }
            #blockLayout .box .header {
                height: 50px;
            }
            #blockLayout .box h1 {
                font-size: 18px;
                line-height: 50px;
            }
            #blockLayout .toolerGroup {
                top: 15px;
            }
        }
    `;

    GM_addStyle(BLOCK_STYLE)

})();
