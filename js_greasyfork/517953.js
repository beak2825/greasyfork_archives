// ==UserScript==
// @name         看帖：PAUSE EA 持久版
// @namespace    https://www.gamemale.com/space-uid-687897.html
// @version      0.8.8.11
// @description  勋章触发奖励时停+发帖回帖奖励账本查询！
// @author       瓦尼
// @match        https://www.gamemale.com/*
// @match        https://www.gamemale.com/forum.php
// @grant        GM_registerMenuCommand
// @icon         https://www.gamemale.com/template/mwt2/extend/img/favicon.ico
// @exclude      https://www.gamemale.com/*inajax=1*
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/517953/%E7%9C%8B%E5%B8%96%EF%BC%9APAUSE%20EA%20%E6%8C%81%E4%B9%85%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/517953/%E7%9C%8B%E5%B8%96%EF%BC%9APAUSE%20EA%20%E6%8C%81%E4%B9%85%E7%89%88.meta.js
// ==/UserScript==

// 下载地址 https://greasyfork.org/zh-CN/scripts/517953
// R语言计算灵魂概率 https://www.gamemale.com/blog-723150-117070.html

/**
 * 基于瓦尼开发的 勋章触发记录他来了-本地发回帖账本PAUSE https://www.gamemale.com/thread-136471-1-1.html
 * 基于星之子修改的 勋章触发记录 PAUSE(EA) 账本界面皮肤 https://www.gamemale.com/thread-145044-1-1.html
 * 回帖限制请参考你需要知道的回帖发帖收益及各版版规 https://www.gamemale.com/thread-114869-1-1.html
 * 回帖限制请参考关于各版块的回帖数限制的回答 https://www.gamemale.com/forum.php?mod=redirect&goto=findpost&ptid=150652&pid=4647886&fromuid=723150
 * 重构表格生成代码，使其更为直观。
 * 新增回帖分区统计，避免超出回帖上限
 * 新增【开启提示框暂停】，0为关闭，1为开启
 * 新增【发帖灵魂统计】，0为关闭，1为开启
 */

// DONE 区别账号
// TODO 区域合并
// DONE 全区监控之后，有一些报错暂时未处理
// DONE 仅在发帖和回帖时，记录区域位置
// DONE 仅在发帖和回帖时，弹出提示框
// TODO 定制颜色样式
// TODO 如果某条回复打到阈值，突出显示
// TODO 合并灵魂期望和回帖期望

(function () {
    'use strict'

    // 0为关闭，1为开启
    let Config = {
        开启提示框暂停: 1,
        显示默认区域: 1,
        发帖灵魂统计: 0
    }

    if (localStorage.getItem('账本配置')) {
        Config = JSON.parse(localStorage.getItem('账本配置'))
    }
    // 自动获取用户uid，请勿随意修改
    // 目前仅与主题配色相关
    const uid = discuz_uid
    /////////////////////////快速设置////////////////////////////////

    // 抽卡音乐开关，值为0时关闭，值为1时开启
    //const gachaSound = 0;

    // 抽卡音乐链接
    // 崩铁抽卡音效 网抑云源
    //const gachaMusicUrl = 'https://music.163.com/song/media/outer/url?id=2034614721.mp3';
    //PAUSE EX-AID时停音效 使用Gimhoy音乐盘源 https://music.gimhoy.com/
    //const gachaMusicUrl = 'https://dlink.host/musics/aHR0cHM6Ly9vbmVkcnYtbXkuc2hhcmVwb2ludC5jb20vOnU6L2cvcGVyc29uYWwvc3Rvcl9vbmVkcnZfb25taWNyb3NvZnRfY29tL0VVR1R6WlZJeEhoSnBJNnpPclVRcXNBQkN4ZkkwNlh5M25sZmNkV2ZSVzBqc1E.mp3';

    // Firefox火狐浏览器失效保护设置，默认为0，使用firefox浏览器却无法打开账本，可以尝试将此项值设为1，其他浏览器请勿修改！
    const firefoxBrowser = 0

    /////////////////////////快速设置部分结束///////////////////////

    // 使用的浏览器检测
    var brwoserType = ""
    const userAgent = navigator.userAgent
    if ((userAgent.indexOf('Firefox') > -1) || firefoxBrowser) {
        brwoserType = "Firefox"
    } else if (userAgent.indexOf('Chrome') > -1) {
        brwoserType = "Chrome"
    } else {
        brwoserType = "Others"
    }

    // 播放抽卡音效的函数
    // 由于音效的缓存需要时间，触发暂停时可能无法及时播放
    function playSound(sound) {

        sound.addEventListener("canplaythrough", event => {
            console.log("获取成功，开始播放")
            sound.play()
        })

        return 0
    }


    // 主要负责暂停和记录的主函数
    function pauseAndSave() {
        // 获取内容并暂停
        var creditElement = document.getElementById("creditpromptdiv")
        // 获取分区元素
        const area = (() => {
            const ele = document.querySelector("#pt > div")
            return ele ? ele.textContent.split('›').map(item => item.trim()).slice(-2, -1)[0] : undefined
        })()

        // 保存内容
        extractAndSave(creditElement, area)

        console.log("记录器工作中...")

        return 0
    }

    // 持续监听页面，当目标节点发生变化时，调用检测函数
    function startObserve() {
        const targetNode = document.getElementById('append_parent')
        if (!targetNode) return

        // 观察器配置
        const config = { attributes: false, childList: true, subtree: false }

        // 设置计数器，防止出现无限循环
        let changeCount = 0
        let lastSuccessTime = new Date(0)

        // 当检测到变化时调用的回调函数
        const callback = function () {

            // 提前加载音效
            //if(gachaSound == 1){
            //console.log("正在获取音效....");
            //var sound = new Audio();
            //sound.src = gachaMusicUrl;
            //sound.load();
            //}

            // 如果检测到奖励内容再执行函数
            if (document.getElementById("creditpromptdiv")) {

                // 检查和上一次的间隔毫秒
                let curTime = new Date()
                let timeDiff = curTime.getTime() - lastSuccessTime.getTime()

                // 如果小于一定间隔则不执行
                if (timeDiff >= 10000) {

                    // 播放音效
                    //if(gachaSound == 1){
                    //playSound(sound);
                    //}

                    // 执行主函数
                    pauseAndSave()

                    // 计数器加一并更新最新时间
                    lastSuccessTime = curTime
                    changeCount++
                    console.log(`PAUSE账本第 ${changeCount} 次记录完成`)

                    // 如果变化次数达到一定次，断开观察！防止无限循环。
                    if (changeCount >= 10) {
                        console.log('达到设定的变更次数，停止观察。')
                        observer.disconnect()
                    }

                } else {
                    //alert("成功拦截重复记录");
                    console.log("成功拦截重复记录")
                }

            }

        }

        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(callback)

        // 开始观察目标节点
        observer.observe(targetNode, config)

        console.log("PAUSE账本正在运行中···")

        return 0
    }

    startObserve()

    function extractAndSave(divElement, area) {
        let curTime = new Date()

        // 获取灵魂期望
        const linghunExpectations = JSON.parse(localStorage.getItem('灵魂期望'))

        const result = {
            creditType: '',
            badgeActivated: '否',
            area: '',
            lvCheng: 0,
            jinBi: 0,
            xueYe: 0,
            zhuiSui: 0,
            zhouShu: 0,
            zhiShi: 0,
            lingHun: 0,
            duoLuo: 0,
            acquiredAt: curTime,
            linghunExpectations
        }

        const keyMap = {
            '旅程': 'lvCheng',
            '金币': 'jinBi',
            '血液': 'xueYe',
            '追随': 'zhuiSui',
            '咒术': 'zhouShu',
            '知识': 'zhiShi',
            '灵魂': 'lingHun',
            '堕落': 'duoLuo'
        }

        // 提取奖励类型
        const creditTypeNode = divElement.querySelector('i')
        console.log(creditTypeNode, divElement.outerHTML)
        //creditTypeNode 可能为空 当他是赠礼或者花钱的时候
        if (!creditTypeNode) return
        var parts = creditTypeNode.textContent.trim().split(' ')

        // 出现以下关键词则代表第一个部分不是类型
        var keywords = ['金币', '血液', '咒术', '知识', '灵魂', '堕落', '旅程', '追随']
        var reason = parts[0]

        // 检查原因是否包含关键词，如果包含则替换为"无"
        if (keywords.some(keyword => reason.includes(keyword))) {
            console.log("无奖励类型")
            reason = '无'
        }

        result.creditType = reason
        // 奖励类型为发表回复或发表主题时，记录区域
        if (result.creditType === '发表回复' || result.creditType === '发表主题') {
            result.area = area
        }

        // 检查是否触发勋章
        if (creditTypeNode.textContent.includes('勋章功能触发')) {
            result.badgeActivated = '是'
        }

        // 提取积分变化
        const spans = divElement.querySelectorAll('span')
        spans.forEach(span => {
            const text = span.textContent
            let match
            if ((match = text.match(/(旅程|金币|血液|追随|咒术|知识|灵魂|堕落)\+(\d+)/))) {
                const key = keyMap[match[1]]
                result[key] = parseInt(match[2], 10)
            } else if ((match = text.match(/(旅程|金币|血液|追随|咒术|知识|灵魂|堕落)\-(\d+)/))) {
                const key = keyMap[match[1]]
                result[key] = -parseInt(match[2], 10)
            }
        })

        // 保存记录
        var historyArrayEx
        if (localStorage.getItem("extractedCreditHistory")) {
            historyArrayEx = JSON.parse(localStorage.getItem("extractedCreditHistory"))
        } else {
            historyArrayEx = new Array()
        }

        historyArrayEx.push(result)
        console.log(result)
        localStorage.setItem('extractedCreditHistory', JSON.stringify(historyArrayEx))

        // 最后弹框提示
        if (Config.开启提示框暂停) {
            if (result.creditType === '发表回复' || result.creditType === '发表主题') {
                setTimeout(function () {
                    alert(divElement.textContent)
                }, 500)
            }
        }
        return 0
    }

    //////以下是菜单部分/////////


    // 在新窗口通过调整样式来显示消息
    // alert弹窗只会在原窗口弹出，不容易注意到，因此需通过此方法提示
    function showMsg(msgID, pageContent) {
        var targetMsg = pageContent.getElementById(msgID)

        // 确保元素存在
        if (targetMsg) {
            // 显示元素
            targetMsg.style.display = 'block'

            // 设置5秒后隐藏元素
            setTimeout(function () {
                targetMsg.style.display = 'none'
            }, 5000)
        } else {
            console.error('无法找到ID为' + msgID + '的元素')
        }
    }

    // 重新生成右侧表格，并将结果返回
    function generateRightHTML() {
        //重新获取记录
        var creditHistoryStr = localStorage.getItem('extractedCreditHistory')
        var creditHistory = JSON.parse(creditHistoryStr)

        //创建行号
        var rowNumber = 0
        var tempLvCheng = 0
        var temmpJinBi = 0
        var tempXueYe = 0
        var tempZhouShu = 0
        var tempZhiShi = 0
        var tempLingHun = 0
        var tempDuoLuo = 0

        const checkCreditHistory = []
        if (creditHistory) {
            creditHistory.forEach(function (item) {
                //检查过滤条件，不满足条件的item，返回true跳过执行
                if (checkItem(item)) {
                    return
                }
                rowNumber++
                checkCreditHistory.push({ ...item, rowNumber })

                tempLvCheng += item.lvCheng
                temmpJinBi += item.jinBi
                tempXueYe += item.xueYe
                tempZhouShu += item.zhouShu
                tempZhiShi += item.zhiShi
                tempLingHun += item.lingHun
                tempDuoLuo += item.duoLuo
            })
        }

        // 格式化日期和时间
        // 解析ISO 8601时间字符串为UTC时间，然后转为本地时间
        var formattedDateTime = (date) => {
            var date = new Date(date)
            return date.getFullYear() + '-' +
                ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                ('0' + date.getDate()).slice(-2) + ' ' +
                ('0' + date.getHours()).slice(-2) + ':' +
                ('0' + date.getMinutes()).slice(-2) + ':' +
                ('0' + date.getSeconds()).slice(-2)
        }


        const settings = JSON.parse(localStorage.getItem("filterSettings"))
        const 显示灵魂期望 = Config.发帖灵魂统计 && settings.showFaTie
        const 显示回帖期望 = settings.showHuiTie
        const settingsDays = settings.days

        const headers = [
            '行号', '奖励类型', '是否触发', '分区', '旅程', '金币', '血液', '咒术', '知识', '灵魂', '堕落', '时间',
            ...(显示灵魂期望 ? ['灵魂期望'] : []),
        ]

        const dataKeys = [
            'rowNumber', 'creditType', 'badgeActivated', 'area', 'lvCheng', 'jinBi', 'xueYe', 'zhouShu', 'zhiShi', 'lingHun', 'duoLuo', 'acquiredAt',
            ...(显示灵魂期望 ? ['linghunExpectations'] : []),
        ]

        const dataFormat = {
            acquiredAt: val => formattedDateTime(val),
            ...(显示灵魂期望 ? {
                linghunExpectations: (val, item) => item.creditType === '发表主题' ?
                    linghunExpectationsFormat(val) : ''
            } : {}),
        }
        const mainTable = generateTable(checkCreditHistory, headers, dataKeys, dataFormat, true)

        const qiwangFormat = (obj, all) => {
            const format = (val) => all ? (val / all).toFixed(2) : 0
            // return Object.fromEntries(Object.entries(obj).map(([key, val]) => [key, key === 'rowNumber' ? val : format(val)]))

            const num = Math.min(all, 30)
            return Object.fromEntries(
                Object.entries(obj).map(([key, val]) => {
                    if (key === 'rowNumber') {
                        return [key, val]
                    } else if (key === 'temmpJinBi' && Number(settingsDays) === 1) {
                        // 只在当天-30*2期望，跨天算起来就得每天判断是否满30回复，不能简单*30再减，因此干脆不算
                        return [key, `${format(val)}(${format(val - num * 2)})`]
                    } else {
                        return [key, format(val)]
                    }
                }))
        }

        const allExpectations = JSON.parse(localStorage.getItem('回帖期望'))
        const summaryTableData = [
            { rowNumber: rowNumber, tempLvCheng, temmpJinBi, tempXueYe, tempZhouShu, tempZhiShi, tempLingHun, tempDuoLuo },
            qiwangFormat({ rowNumber: '实际期望', tempLvCheng, temmpJinBi, tempXueYe, tempZhouShu, tempZhiShi, tempLingHun, tempDuoLuo }, rowNumber),
            ...(allExpectations ? [{ rowNumber: '理论期望', ...allExpectations }] : [])
        ]
        // 小计表格
        const summaryTable = generateSummaryTable(显示回帖期望 ? summaryTableData : summaryTableData.slice(0, 1))

        // 计算分区 并 生成回帖数表格
        const areaNum = getAreaNum(checkCreditHistory)
        const areaTable = generateAreaTable(areaNum)

        // 整合页面HTML
        var rightHTML = '<h3>当前记录汇总</h3>' + summaryTable + areaTable + mainTable

        return rightHTML
    }

    // 根据设置检查功能
    function checkItem(item) {
        var showItem = false
        var catCheck = false
        var daysCheck = false

        var settings
        if (localStorage.getItem("filterSettings")) {
            settings = JSON.parse(localStorage.getItem("filterSettings"))
        } else {
            settings = {
                showHuiTie: true,
                showFaTie: true,
                showQiTa: false,
                days: 1
            }
            localStorage.setItem('filterSettings', JSON.stringify(settings))
        }

        //检查类型
        if (settings.showHuiTie) {
            catCheck = ((catCheck) || (item.creditType == "发表回复"))
        }
        if (settings.showFaTie) {
            catCheck = ((catCheck) || (item.creditType == "发表主题"))
        }
        if (settings.showQiTa) {
            catCheck = ((catCheck) || ((item.creditType != "发表主题") && (item.creditType != "发表回复")))
        }

        // 检查时间
        if (settings.days != 0) {
            // 转换格式
            var curDate = new Date()
            curDate.setHours(0, 0, 0, 0)
            //console.log(curDate);
            var recordDate = new Date(item.acquiredAt)
            recordDate.setHours(0, 0, 0, 0)
            //console.log(recordDate);

            // 获取目标日期
            var targetDate = new Date(curDate.setDate(curDate.getDate() - settings.days + 1))
            targetDate.setHours(0, 0, 0, 0)
            //console.log(targetDate);

            // 记录日期大于等于目标日期则显示，小于则返回跳过
            if (recordDate.getTime() >= targetDate.getTime()) {
                daysCheck = true
            }
        } else {
            daysCheck = true
        }

        //类型筛选和时间筛选同时满足才显示
        showItem = daysCheck && catCheck

        return !showItem
    }

    /////////////////脚本菜单主部分//////////////

    //创建查看数据菜单
    GM_registerMenuCommand('查看账本', () => {
        viewLedger()
    })

    function viewLedger() {
        // 创建一个隐藏的iframe
        var iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        document.body.appendChild(iframe)

        // 读取localStorage中的creditHistory数据
        var creditHistoryStr = localStorage.getItem('extractedCreditHistory')
        try {
            // 解析JSON字符串为对象数组
            var creditHistory = JSON.parse(creditHistoryStr)

            //创建功能区
            var fixedHTML = '<div id="fixedBox"><h3>记录工具箱</h3>'

            //创建记录存档操作区
            var toolHTML = '<div id="toolBox">'

            // 添加导出按钮
            toolHTML += '<button id="exportBtn">导出本地记录为.txt</button>'

            // 添加导入按钮和文件输入框
            toolHTML += '<input type="file" id="importFile" accept=".txt" style="display:none;">'
            toolHTML += '<button id="importBtn">从.txt导入本地记录</button>'

            // 添加删除按钮
            toolHTML += '<button id="deleteBtn">删除所有本地记录</button>'

            //提示信息
            toolHTML += '<p id="exportNull" style="display: none;">没有数据可以导出。</p>'
            toolHTML += '<p id="importSuccess" style="display: none;">导入成功！</p>'
            toolHTML += '<p id="importFail" style="display: none;">导入失败，文件内容不是有效的JSON数组。</p>'
            toolHTML += '<p id="importError" style="display: none;">导入失败，无法解析文件内容,请前往主页面弹窗查看原因。</p>'
            toolHTML += '<div id="customConfirmModal" style="display: none;"><p>确定要删除所有本地积分记录吗？此操作不可逆！</p><div class="buttonContainer"><button id="confirmYes">确定</button><button id="confirmNo">取消</button></div></div>'
            toolHTML += '<p id="deleteSuccess" style="display: none;">已删除所有记录</p>'

            toolHTML += '</div>'

            //创建右侧记录筛选区
            var filterHTML = '<div id="toolBox"><h3>筛选记录</h3>'

            filterHTML += `
                    <fieldset>
                    <legend>奖励类型</legend>
                      <div>
                      <input type="checkbox" id="showHuiTie" name="showHuiTie" checked />
                      <label for="showHuiTie">回帖奖励</label>
                      </div>
                      <div>
                      <input type="checkbox" id="showFaTie" name="showFaTie" checked />
                      <label for="showFaTie">发帖奖励</label>
                      </div>
                      <div>
                      <input type="checkbox" id="showQiTa" name="showQiTa" checked />
                      <label for="showQiTa">其他奖励</label>
                      </div>
                    </fieldset>
    
                    <fieldset>
                    <legend>时间范围</legend>
                    <input type="radio" id="option1" name="timeRange" value="1">
                        <label for="option1">当天</label><br>
    
                    <input type="radio" id="option2" name="timeRange" value="custom" checked>
                    <label for="option2">自定义  <input type="number" min="0" id="customDays" value="0"></label><br>
                    <small>(N:过去N天内 1:当天 0:全部)</small>
                    </fieldset>
    
                    `

            filterHTML += '</div>'

            //将左侧的模块都塞进fixed部分
            fixedHTML += toolHTML
            fixedHTML += filterHTML

            fixedHTML += '</div>'

            //最后塞入用于显示/隐藏的按钮
            fixedHTML += '<button id="toggleToolBoxBtn"></button>'

            //通过函数生成右侧表格内容（方便后期更新表格）
            var rightHTML = '<div id="tableBox">' + generateRightHTML() + '</div>'

            //总结构
            var overallHTML = '<div class="container">' + fixedHTML + rightHTML + '</div>'

            // 插入到新窗口的文档中
            iframe.contentDocument.body.innerHTML += overallHTML

            //////////////////// 添加css/////////////////////////
            // 获取IFrame的内容文档对象
            var iframeDoc = iframe.contentDocument || iframe.contentWindow.document

            // 创建一个新的<style>元素
            var styleTag = iframeDoc.createElement('style')

            // 定义CSS样式内容
            var styles = `
                    #fixedBox {
                        position: fixed;
                        width: auto;
                        height: 96vh;
                        background: #eeeeee;
                        float: left;
                        min-width: 100px;
                        overflow-y: auto;
                        border-radius: 8px;
                        font-family: Noto Sans SC, Microsoft Yahei, Arial, sans-serif;
                    }
    
                    .container {
                        display: flex;
                    }
    
                    #toolBox {
                        padding: 10px;
                    }
    
                    #exportBtn,
                    #importBtn {
                        margin: 6px auto 20px;
                    }
    
                    #deleteBtn {
                        margin: auto;
                    }
    
                    #exportBtn,
                    #importBtn,
                    #deleteBtn {
                        display: block;
                        background-color: transparent;
                        border: 2px solid #1A1A1A;
                        border-radius: 0.6em;
                        color: #3B3B3B;
                        font-weight: 600;
                        font-size: 14.4px;
                        padding: 0.4em 1.2em;
                        text-align: center;
                        text-decoration: none;
                        transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
                        font-family: Noto Sans SC, Microsoft Yahei, Arial, sans-serif;
                    }
    
                    #exportBtn:hover,
                    #importBtn:hover,
                    #deleteBtn:hover {
                        color: #fff;
                        background-color: #1A1A1A;
                        box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
                        transform: translateY(-2px);
                    }
    
                    #exportBtn:active,
                    #importBtn:active,
                    #deleteBtn:active {
                        box-shadow: none;
                        transform: translateY(0);
                    }
    
                    h3 {
                        display: block;
                        text-align: center;
                        font-size: 2em;
                        margin: 36px auto 12px;
                    }
    
                    #customConfirmModal {
                        border-style: solid;
                        border-width: 3px;
                        border-color: red;
                    }
    
                    #customConfirmModal p {
                        color: red;
                        margin: 20px;
                    }
    
                    #confirmYes {
                        margin: 0 20% 20px 20%;
                    }
    
                    #customDays {
                        width: 4em;
                        font-family: Noto Sans SC, Microsoft Yahei, Arial, sans-serif;
                        border-radius: 6px;
                        border: 1px solid #333;
                    }
    
                    #tableBox {
                        width: 80%;
                        float: right;
                        margin-left: 20%;
                    }
    
                    #tableBox table {
                        margin: 20px auto 40px auto;
                        border: 2px solid #333;
                        border-radius: 6px;
                        border-spacing: 0;
                        overflow: hidden;
                    }
    
                    th,
                    td {
                        padding: 4px 8px;
                        text-align: center;
                        transition: all 0.2s;
                        border: none;
                    }
    
                    th {background-color: #f2f2f2;}
                    tr:nth-child(even) {background-color: #f2f2f2; transition: all 0.2s;}
                    tr:hover {background-color: #d3d3d3; transition: all 0.2s;}
    
                    #toggleToolBoxBtn {
                        position: fixed;
                        width: 16px;
                        height: 16px;
                        margin-top: 8px;
                        margin-left: 8px;
                        z-index: 1000;
                        border: 1px solid #333;
                        padding: 4px;
                        border-radius: 50%;
                    }
    
                    fieldset {
                      border: 2px solid #333; /* 设置边框 */
                      padding: 8px 12px 16px 12px; /* 设置内边距 */
                      margin: 20px 10px; /* 设置外边距 */
                      background-color: #f9f9f9; /* 设置背景颜色 */
                      border-radius: 6px; /* 设置圆角 */
                    }
    
                    legend {
                      font-weight: bold; /* 设置字体加粗 */
                      color: #000; /* 设置字体颜色 */
                    }
    
                    label {
                      font-size:14.4px;
                    }
                    `


            // 将样式内容赋值给<style>元素的textContent属性
            styleTag.textContent = styles

            // 将<style>元素添加到IFrame的<head>中
            var head = iframeDoc.head || iframeDoc.getElementsByTagName('head')[0]
            head.appendChild(styleTag)

            //////////////添加网页标题////////////////
            var titleElement = document.createElement('title')
            titleElement.innerText = 'PAUSE账本'

            head.appendChild(titleElement)

            ////////////根据浏览器类型选择是否更改iframe的src属性////////
            if (brwoserType == "Firefox") {
                iframe.src = "PAUSE"
                console.log("检测到使用Firefox浏览器，已为iframe添加src属性")
            }

        } catch (e) {
            console.error('解析localStorage中的creditHistory失败:', e)
            // 如果解析失败，可以在这里处理错误，比如显示一个错误消息
            iframe.contentDocument.body.textContent = '数据加载失败，请检查浏览器的localStorage设置。'
        }

        // 将iframe的内容复制到新窗口
        var newWindow = window.open('', '_blank')
        newWindow.document.replaceChild(
            newWindow.document.importNode(iframe.contentDocument.documentElement, true),
            newWindow.document.documentElement
        )

        //根据存储数据初始化界面
        if (localStorage.getItem('filterSettings')) {
            var filterSettings = JSON.parse(localStorage.getItem('filterSettings'))
            newWindow.document.getElementById('showHuiTie').checked = filterSettings.showHuiTie
            newWindow.document.getElementById('showFaTie').checked = filterSettings.showFaTie
            newWindow.document.getElementById('showQiTa').checked = filterSettings.showQiTa
            newWindow.document.getElementById('option2').checked = true
            newWindow.document.getElementById('customDays').value = filterSettings.days
            console.log("初始化界面完成！")
        }

        // 显示/隐藏工具箱
        // 名为toolBox 实际上是对外层fixedBox进行操作
        newWindow.document.getElementById('toggleToolBoxBtn').addEventListener('click', function () {
            var toolBox = newWindow.document.getElementById('fixedBox')
            if (toolBox.style.display === 'none') {
                toolBox.style.display = 'block'
            } else {
                toolBox.style.display = 'none'
            }
        })

        // 导出数据
        // 给exportBtn添加点击事件监听器
        newWindow.document.getElementById('exportBtn').addEventListener('click', function () {
            var creditHistoryStr = localStorage.getItem('extractedCreditHistory')
            if (creditHistoryStr) {
                var blob = new Blob([creditHistoryStr], { type: 'text/plain;charset=utf-8' })
                var url = URL.createObjectURL(blob)
                var link = document.createElement('a')
                link.href = url
                link.download = 'extractedCreditHistory.txt'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
            } else {
                //alert('没有数据可以导出。');
                showMsg("exportNull", newWindow.document)
            }
        })


        // 导入数据
        // 绑定导入按钮的点击事件，触发文件选择对话框
        newWindow.document.getElementById('importBtn').addEventListener('click', function () {
            newWindow.document.getElementById('importFile').click()
        })
        // 绑定文件输入框的change事件，处理文件读取
        newWindow.document.getElementById('importFile').addEventListener('change', function (e) {
            var file = e.target.files[0]
            if (!file) return
            var reader = new FileReader()
            reader.onload = function (e) {
                var content = e.target.result
                try {
                    var parsedData = JSON.parse(content)
                    if (Array.isArray(parsedData)) {
                        localStorage.setItem('extractedCreditHistory', JSON.stringify(parsedData))
                        showMsg("importSuccess", newWindow.document)
                    } else {
                        //alert('导入失败，文件内容不是有效的JSON数组。');
                        showMsg("importFail", newWindow.document)
                    }
                } catch (error) {
                    alert('导入失败，无法解析文件内容: ' + error)
                    showMsg("importError", newWindow.document)
                }
            }
            reader.readAsText(file)
        })

        // 删除数据
        // 绑定删除按钮的点击事件
        newWindow.document.getElementById('deleteBtn').addEventListener('click', function () {
            var customConfirmModal = newWindow.document.getElementById('customConfirmModal')

            // 如果已经显示了，再次点击则隐藏提示框
            if (customConfirmModal.style.display == 'block') {
                customConfirmModal.style.display = 'none'
            } else {
                customConfirmModal.style.display = 'block'
            }

            // 绑定自定义对话框内的确认和取消按钮事件
            newWindow.document.getElementById('confirmYes').addEventListener('click', function () {
                customConfirmModal.style.display = 'none'
                localStorage.removeItem('extractedCreditHistory')
                localStorage.removeItem('filterSettings')
                showMsg("deleteSuccess", newWindow.document)
            })

            newWindow.document.getElementById('confirmNo').addEventListener('click', function () {
                customConfirmModal.style.display = 'none'
            })
        })

        // 奖励类型
        newWindow.document.getElementById('showHuiTie').addEventListener('change', function () {
            var filterSettings = JSON.parse(localStorage.getItem('filterSettings'))
            filterSettings.showHuiTie = this.checked
            localStorage.setItem('filterSettings', JSON.stringify(filterSettings))
            newWindow.document.getElementById('tableBox').innerHTML = generateRightHTML()
            console.log("已更改奖励类型筛选条件")
        })

        newWindow.document.getElementById('showFaTie').addEventListener('change', function () {
            var filterSettings = JSON.parse(localStorage.getItem('filterSettings'))
            filterSettings.showFaTie = this.checked
            localStorage.setItem('filterSettings', JSON.stringify(filterSettings))
            newWindow.document.getElementById('tableBox').innerHTML = generateRightHTML()
            console.log("已更改奖励类型筛选条件")
        })

        newWindow.document.getElementById('showQiTa').addEventListener('change', function () {
            var filterSettings = JSON.parse(localStorage.getItem('filterSettings'))
            filterSettings.showQiTa = this.checked
            localStorage.setItem('filterSettings', JSON.stringify(filterSettings))
            newWindow.document.getElementById('tableBox').innerHTML = generateRightHTML()
            console.log("已更改奖励类型筛选条件")
        })

        // 天数筛选
        newWindow.document.getElementById('option1').addEventListener('click', function () {
            if (this.checked) {
                var filterSettings = JSON.parse(localStorage.getItem('filterSettings'))
                filterSettings.days = 1
                localStorage.setItem('filterSettings', JSON.stringify(filterSettings))
                newWindow.document.getElementById('tableBox').innerHTML = generateRightHTML()
                console.log("已更改时间范围条件")
            }
        })

        newWindow.document.getElementById('option2').addEventListener('click', function () {
            if (this.checked) {
                var filterSettings = JSON.parse(localStorage.getItem('filterSettings'))
                filterSettings.days = newWindow.document.getElementById('customDays').value
                localStorage.setItem('filterSettings', JSON.stringify(filterSettings))
                newWindow.document.getElementById('tableBox').innerHTML = generateRightHTML()
                console.log("已更改时间范围条件")
            }
        })

        newWindow.document.getElementById('customDays').addEventListener('change', function () {
            var option2 = newWindow.document.getElementById('option2')
            if (newWindow.document.getElementById('option2').checked) {
                var filterSettings = JSON.parse(localStorage.getItem('filterSettings'))
                filterSettings.days = this.value
                localStorage.setItem('filterSettings', JSON.stringify(filterSettings))
                newWindow.document.getElementById('tableBox').innerHTML = generateRightHTML()
                console.log("已更改时间范围条件")
            }
        })

        // 重置筛选
        // newWindow.document.getElementById('showAllBtn').addEventListener('click', function () {
        //     var defaultSettings = {
        //         showHuiTie: true,
        //         showFaTie: true,
        //         showQiTa: true,
        //         days: 0
        //     };
        //     newWindow.document.getElementById('showHuiTie').checked = defaultSettings.showHuiTie;
        //     newWindow.document.getElementById('showFaTie').checked = defaultSettings.showFaTie;
        //     newWindow.document.getElementById('showQiTa').checked = defaultSettings.showQiTa;
        //     newWindow.document.getElementById('option2').checked = true;
        //     newWindow.document.getElementById('customDays').value = defaultSettings.days;
        //     localStorage.setItem('filterSettings', JSON.stringify(defaultSettings));
        //     newWindow.document.getElementById('tableBox').innerHTML = generateRightHTML();
        //     console.log("已重置筛选条件");
        // });

        // 清理创建的iframe
        document.body.removeChild(iframe)
    }

    // 计算分区回帖数
    function getAreaNum(historyArray) {
        let result = {}
        if (Config.显示默认区域) {
            result = { 'C G A I': 0, '生活爆照': 0, '和谐动漫': 0, '汉化游戏': 0, '和谐游戏': 0, }
        }
        historyArray.forEach(e => {
            if (e.area) {
                if (!result[e.area]) {
                    result[e.area] = 1
                } else {
                    result[e.area] += 1
                }

            }
        })
        return result
    }
    // 生成计算分区回帖数表格
    function generateAreaTable(data) {
        const newdata = [{ '回帖数': '', ...data }]
        const headers = Object.keys(data)
        const dataKeys = headers
        return generateTable(newdata, headers, dataKeys, {}, true)
    }

    // 生成总计
    function generateSummaryTable(data) {
        const headers = ['行数', '旅程', '金币', '血液', '咒术', '知识', '灵魂', '堕落']
        const dataKeys = ['rowNumber', 'tempLvCheng', 'temmpJinBi', 'tempXueYe', 'tempZhouShu', 'tempZhiShi', 'tempLingHun', 'tempDuoLuo']
        return generateTable(data, headers, dataKeys, {}, true)
    }

    GM_registerMenuCommand('更新所有期望', () => {
        fetchData()
            .then(doc => {
                const linghunResult = processLinghun(doc)
                const huiResult = processHui(doc)
                localStorage.setItem('灵魂期望', JSON.stringify(linghunResult))
                localStorage.setItem('回帖期望', JSON.stringify(huiResult))
                alert('期望更新成功')
            })
            .catch(error => {
                console.error('发生错误:', error)
            })
    })

    // 公共数据获取函数
    function fetchData() {
        return fetch('https://www.gamemale.com/wodexunzhang-showxunzhang.html?action=my')
            .then(response => response.text())
            .then(html => new DOMParser().parseFromString(html, 'text/html'))
    }

    // 灵魂期望处理
    function processLinghun(doc) {
        const result = {}
        doc.querySelectorAll('.my_fenlei .myblok').forEach(element => {
            const linghun = [...element.querySelectorAll('.jiage.shuxing')].find(p => p.textContent.includes('灵魂'))
            const triggerProbability = [...element.querySelectorAll('.jiage')].find(p => p.textContent.includes('触发几率'))

            if (linghun && triggerProbability) {
                const probabilityMatch = triggerProbability.textContent.match(/触发几率 (\d+)%/)
                if (probabilityMatch) {
                    const probability = parseFloat(probabilityMatch[1]) / 100
                    const countMatch = linghun.textContent.match(/发帖\s*[\u00A0]*灵魂\s*\+\s*(\d+)/)
                    const count = countMatch ? parseInt(countMatch[1], 10) : 0

                    result[probability] = (result[probability] || 0) + count
                }
            }
        })
        return result
    }

    // 回帖期望处理
    function processHui(doc) {
        const xunzhangList = doc.querySelectorAll('.my_fenlei .myblok')

        const qiwang = pattern => {
            const result = { 金币: 0, 血液: 0, 咒术: 0, 知识: 0, 旅程: 0, 堕落: 0, 灵魂: 0 };

            [...xunzhangList].forEach(block => {
                const text = block.textContent
                if (text.includes("已寄售")) return

                const probMatch = text.match(/几率 (\d+)%/i)
                if (!probMatch) return

                const probability = parseInt(probMatch[1], 10) / 100
                const matches = Array.from(text.matchAll(pattern))

                for (const match of matches) {
                    const [, type, sign, value] = match
                    result[type] += probability * parseInt(sign + value, 10)
                }
            })

            return Object.fromEntries(
                Object.entries(result).map(([k, v]) => [k, Number(v).toFixed(2)])
            )
        }

        const hui = qiwang(/回帖\s+(.+?)\s([+-])(\d+)/gi)
        return {
            tempLvCheng: hui.旅程,
            temmpJinBi: hui.金币,
            tempXueYe: hui.血液,
            tempZhouShu: hui.咒术,
            tempZhiShi: hui.知识,
            tempLingHun: hui.灵魂,
            tempDuoLuo: hui.堕落
        }
    }

    // 格式化函数保持原样
    function linghunExpectationsFormat(result) {
        if (!result) return '暂无数据'
        const total = Object.entries(result).reduce((sum, [prob, count]) => sum + prob * count, 0)
        return `${total.toFixed(2)} = ${Object.entries(result).map(([k, v]) => `${k}(${v})`).join(' + ')}`
    }

    /**
     * 生成一个 HTML 表格。
     *
     * @param {Array<Object>} data - 表格数据的数组，每个对象代表一行数据。
     * @param {Array<string>} headers - 表头的名称数组，用于定义表格的列标题。
     * @param {Array<string>} dataKeys - 数据对象中对应的键名数组，用于从数据中提取显示的值。
     * @param {Object} [dataFormat] - 可选参数，包含格式化函数的对象，格式化每个字段的显示值。
     * @param {boolean} [inHTML=false] - 可选参数，若为 true，则返回 HTML 字符串形式的表格；否则返回 DOM 元素。
     * 
     * @returns {HTMLElement|string} 返回生成的表格元素或 HTML 字符串，具体取决于 `inHTML` 参数的值。
     *
     * @example
     * const data = [{lvcheng: 1, jinbi: 10}];
     * const headers = ['旅程', '金币'];
     * const dataKeys = ['lvcheng', 'jinbi'];
     * const tableElement = generateTable(data, headers, dataKeys);
     * document.body.appendChild(tableElement);
     */
    function generateTable(data, headers, dataKeys, dataFormat, inHTML) {
        if (dataFormat) {
            data = data.map(item => {
                const formattedItem = {}
                for (const key of dataKeys) {
                    if (dataFormat[key]) {
                        formattedItem[key] = dataFormat[key](item[key], item)
                    } else {
                        formattedItem[key] = item[key]
                    }
                }
                return formattedItem
            })
        }

        // 根据 uid 获取颜色配置，如果没有则使用默认配置（全黑）
        const colorMap = uid ? colorMapByUid[uid] || defaultColorMap : defaultColorMap

        let tableHTML = '<table><thead><tr>'

        // 生成表头，并应用颜色
        headers.forEach(header => {
            const colorConfig = colorMap[header]
            tableHTML += `<th>${applyColor(header, colorConfig)}</th>`
        })

        tableHTML += '</tr></thead><tbody>'

        // 生成表格数据行，并应用颜色
        data.forEach(item => {
            tableHTML += '<tr>'
            dataKeys.forEach((key, index) => {
                const value = item[key] !== undefined ? item[key] : ''
                const header = headers[index]
                const colorConfig = colorMap[header]
                tableHTML += `<td>${applyColor(value, colorConfig)}</td>`
            })
            tableHTML += '</tr>'
        })

        tableHTML += '</tbody></table>'

        if (inHTML) {
            return tableHTML // 返回 HTML 字符串
        } else {
            const table = document.createElement('div')
            table.innerHTML = tableHTML // 将 HTML 字符串插入到一个 div 中
            return table.firstChild // 返回生成的 table 元素
        }
    }

    /**
     * 应用颜色样式到 HTML 元素。
     *
     * @param {string} content - 要显示的内容。
     * @param {string|Object} colorConfig - 颜色配置，可以是字符串（颜色值或渐变）或对象（包含样式属性）。
     * @returns {string} 返回应用了样式的 HTML 字符串。
     */
    function applyColor(content, colorConfig) {
        function camelToKebab(camelCase) {
            return camelCase.replace(/([A-Z])/g, '-$1').toLowerCase()
        }
        if (!colorConfig) return content

        let style = ''

        if (typeof colorConfig === 'object') {
            // 遍历对象属性，动态生成 style 字符串
            for (const [key, value] of Object.entries(colorConfig)) {
                if (value) {
                    const cssProperty = camelToKebab(key) // 转换驼峰式为短横线分隔
                    style += `${cssProperty}: ${value};`
                }
            }
        } else if (colorConfig.startsWith('linear-gradient')) {
            style = `background: ${colorConfig}; -webkit-background-clip: text; background-clip: text; color: transparent;`
        } else {
            style = `color: ${colorConfig};`
        }

        return `<span style="${style}">${content}</span>`
    }

    const colorMapByUid = {
        694610: {
            '行数': 'black', // 行数：黑色
            '旅程': {
                color: '#99FF00', // 文字颜色
                textShadow: '#6666FF 0px 1px 3px, #6666FF 1px 0px 3px, #6666FF 0px -1px 3px, #6666FF -1px 0px 3px', // 发光效果
                filter: 'glow(color=#6666FF, strength=3)' // 发光滤镜
            },
            '金币': {
                color: '#FF6666', // 文字颜色
                textShadow: '#FFFF00 0px 1px 3px, #FFFF00 1px 0px 3px, #FFFF00 0px -1px 3px, #FFFF00 -1px 0px 3px', // 发光效果
                filter: 'glow(color=#FFFF00, strength=3)' // 发光滤镜
            },
            '血液': {
                color: '#000000', // 文字颜色
                textShadow: '#FF0000 0px 1px 3px, #FF0000 1px 0px 3px, #FF0000 0px -1px 3px, #FF0000 -1px 0px 3px', // 发光效果
                filter: 'glow(color=#FF0000, strength=3)' // 发光滤镜
            },
            '咒术': {
                color: '#FFFFFF', // 文字颜色
                textShadow: '#0000FF 0px 1px 3px, #0000FF 1px 0px 3px, #0000FF 0px -1px 3px, #0000FF -1px 0px 3px', // 发光效果
                filter: 'glow(color=#0000FF, strength=3)' // 发光滤镜
            },
            '知识': {
                color: '#FFFFFF', // 文字颜色
                textShadow: '#0099FF 0px 1px 3px, #0099FF 1px 0px 3px, #0099FF 0px -1px 3px, #0099FF -1px 0px 3px', // 发光效果
                filter: 'glow(color=#0099FF, strength=3)' // 发光滤镜
            },
            '灵魂': {
                color: '#66FFFF', // 文字颜色
                textShadow: '#0000FF 0px 1px 3px, #0000FF 1px 0px 3px, #0000FF 0px -1px 3px, #0000FF -1px 0px 3px', // 发光效果
                filter: 'glow(color=#0000FF, strength=3)' // 发光滤镜
            },
            '堕落': {
                color: '#FFFFFF', // 文字颜色
                textShadow: '#000000 0px 1px 3px, #000000 1px 0px 3px, #000000 0px -1px 3px, #000000 -1px 0px 3px', // 发光效果
                filter: 'glow(color=#000000, strength=3)' // 发光滤镜
            }
        },
        723150: {
            '行数': 'black', // 行数：黑色
            '旅程': 'linear-gradient(to bottom, #90EE90, #008000)', // 旅程：从上到下的浅绿到绿色渐变
            '金币': 'orange', // 金币：橙色
            '血液': 'red', // 血液：红色
            '咒术': 'purple', // 咒术：紫色
            '知识': 'blue', // 知识：蓝色
            '灵魂': 'linear-gradient(to bottom, #6A11CB, #2575FC)', // 灵魂：从上到下的紫色到蓝色渐变
            '堕落': 'black' // 堕落：黑色
        }
    }

    // 默认颜色配置（全黑）
    const defaultColorMap = {
        '行数': 'black',
        '旅程': 'black',
        '金币': 'black',
        '血液': 'black',
        '咒术': 'black',
        '知识': 'black',
        '灵魂': 'black',
        '堕落': 'black'
    }

    // 调用函数
    addLedgerLink()
    // 插入链接
    function addLedgerLink() {
        // 图片URL
        const icon = 'https://img.gamemale.com/album/202412/30/145538ebff949ooy6ybfo4.png.thumb.jpg'

        // 创建一个按钮元素
        const div = document.createElement('div')

        // 设置按钮的样式
        div.style.position = 'absolute'
        div.style.right = '0px'
        // div.style.left = '40px'
        // div.style.top = '-20px'
        div.style.background = 'none' // 去掉默认背景
        div.style.cursor = 'pointer' // 鼠标悬停时显示为手型

        // 创建图片元素
        const img = document.createElement('img')
        img.src = icon
        img.width = 30
        img.height = 30

        div.appendChild(img)

        // 获取目标元素
        const targetElement = document.querySelector("#um > div.u-info.col_2a > div.u-info-credit.col_3.sdw")

        // 将按钮添加到目标元素中
        if (targetElement) {
            targetElement.insertBefore(div, targetElement.firstChild) // 插入到最前面
            div.addEventListener('click', () => {
                viewLedger()
            })
        } else {
            console.error('未找到class为"div.u-info-credit.col_3.sdw"的元素')
        }
    }
})()