// ==UserScript==
// @name         云课堂职教云Icve ☑︎ 智慧职教 ❑ MOOC学院 ❑ --网课兼考试助手 (绿版v3)
// @version      3.4.8
// @description  职教云学习效率提升助手小脚本,中文化自定义各项参数,自动课件,课件一目十行,保险模式,解除Ctrl+C限制,下载课件,自动四项评论,支持极高正确率的自动答题(作业，测验，考试),搜题填题,软件定制
// @author        tuChanged
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @match       *://*.zjy2.icve.com.cn/*
// @match       *://*zjy2.icve.com.cn/*
// @exclude     *://*zjy2.icve.com.cn/study/homework/docHomeworkPreview.html*
// @license      MIT
// @namespace https://greasyfork.org/users/449085
// @connect 39.96.64.75
// @supportURL https://tuchg.github.io
// @contributionURL https://greasyfork.org/users/449085
// @downloadURL https://update.greasyfork.org/scripts/404524/%E4%BA%91%E8%AF%BE%E5%A0%82%E8%81%8C%E6%95%99%E4%BA%91Icve%20%E2%98%91%EF%B8%8E%20%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%20%E2%9D%91%20MOOC%E5%AD%A6%E9%99%A2%20%E2%9D%91%20--%E7%BD%91%E8%AF%BE%E5%85%BC%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%20%28%E7%BB%BF%E7%89%88v3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/404524/%E4%BA%91%E8%AF%BE%E5%A0%82%E8%81%8C%E6%95%99%E4%BA%91Icve%20%E2%98%91%EF%B8%8E%20%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%20%E2%9D%91%20MOOC%E5%AD%A6%E9%99%A2%20%E2%9D%91%20--%E7%BD%91%E8%AF%BE%E5%85%BC%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%20%28%E7%BB%BF%E7%89%88v3%29.meta.js
// ==/UserScript==
/*jshint esversion:6 */
/**
 * 根据下方根据提示修改脚本配置
 */

'use strict'
const setting = {
    // true 为打开,false 为关闭
    // 题库 IP地址 ,可在553行查看对接接口要求
    自定义题库服务器: "Ｙｅｓ",// 协议://IP
    // 随机评论,自行扩充格式如     "你好",     (英文符号)
    随机评论词库: ["........", ".", "...",],
    // 刺激!风险未知,暂知时长不良 打开需关闭仅评论
    学神模式: false,
    // 稳!保证文档类与网站请求保持同步,因此速度较慢,实测可以不用这么严格,默认打开
    保险模式: false,//如果课件始终不跳下一个,请勿打开该项
    //是否打开课件下载
    打开课件下载: true,
    // 部分课件存在无检测机制问题,会尝试自动关闭保险模式
    自动关闭保险模式: true,
    /*影响速度关键选项,延时非最优解,过慢请自行谨慎调整*/
    最高延迟响应时间: 4000,//毫秒
    最低延迟响应时间: 3000,//毫秒
    组件等待时间: 1500,//毫秒 组件包括视频播放器,JQuery,答题等,视网络,设备性能而定,启动失败则调整
    考试填题时间: 3000,//3秒 1 秒=1000 毫秒
    //0-高清 1-清晰 2-流畅 3-原画
    //感谢tonylu00提供最新实测参数 --0-原画 1-高清 2-清晰 3-流畅
    视频清晰度: 3,
    //2倍速,允许开倍速则有效,请放心使用,失败是正常现象
    视频播放倍速: 2,
    //是否保持静音
    是否保持静音: true,
    激活仅评论: false,//与学神模式冲突,需二选一
    //开启所有选项卡的评论,最高优先等级,打开该项会覆盖下面的细分设置,
    激活所有选项卡的评论: false,
    激活评论选项卡: false,
    激活问答选项卡: false,
    激活笔记选项卡: false,
    激活报错选项卡: false,
    显示评论数: 1000,
    //
    自动答题: true
    /*
    * 📣如果您有软件定制(管理系统,APP,小程序等),毕设困扰,又或者课程设计困扰等欢迎联系,
    *    价格从优,源码调试成功再付款💰,
    *     实力保证,包远程,包讲解 QQ:2622321887
    */
}, top = unsafeWindow,
    url = location.pathname
//产生区间随机数
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const classId = getQueryValue("openClassId")
const cellID = getQueryValue("cellId")
const stuId = localStorage.getItem("userId")
// 课件完成相关判定数据
let pageCount, mediaLong, cellType, startTime, lastArchiveCount
//课件是否已完成
let isFinshed = false;
// 评论标志位
const isUnFinishedTabs = [setting.激活所有选项卡的评论 || setting.激活评论选项卡, setting.激活所有选项卡的评论 || setting.激活笔记选项卡, setting.激活所有选项卡的评论 || setting.激活问答选项卡, setting.激活所有选项卡的评论 || setting.激活报错选项卡]

//定时任务栈
let taskStack = 0
/**
 * 使用异步包装
 *  随机延迟执行方法
 * @param {需委托执行的函数} func
 */
async function delayExec(func, fixedDelay = null) {
    // taskStack.push(func)
    taskStack++
    const newTask = new Promise((resolve, reject) => {
        const newTime = rnd(fixedDelay || (setting.最低延迟响应时间) * (taskStack / 3), fixedDelay || (setting.最高延迟响应时间) * (taskStack / 2.5));
        setTimeout(() => {
            resolve(func())
            taskStack--
            console.log(`完成延时${newTime}ms的任务,待执行任务总计:${taskStack}`);
        }, newTime);
        console.log(`新增任务,等待时间${newTime}ms,待执行任务总计:${taskStack}`);
    });
    return newTask
}
function autoCloseDialog() {
    const $dialog = $(".ui-dialog");
    //关闭限制弹窗
    if ($dialog.length > 0)
        $dialog.find("#studyNow").click()

    if ($(".xcConfirm")) {
        $(".xcConfirm").css({ "display": "none" })
    }
}

GM_registerMenuCommand("🔄重新获取未完成小节", function () {
    sessionStorage.clear()
    goPage("p")
});

GM_registerMenuCommand("问题反馈", function () {
    top.open("https://github.com/W-ChihC/SimpleIcveMoocHelper/issues")
});
GM_registerMenuCommand("🌹为脚本维护工作助力", function () {
    top.open("https://greasyfork.org/zh-CN/users/449085")
});
GM_registerMenuCommand("📝检查脚本配置", function () {
    alert(`
    当前版本:绿版 v3.4.6✅
    题库:${setting.自定义题库服务器 ? setting.自定义题库服务器 : "❌无"}
    学神模式: ${setting.学神模式 ? "✅打开" : "❌关闭"}
    保险模式: ${setting.保险模式 ? "✅打开" : "❌关闭"}
    仅评论模式: ${setting.激活仅评论 ? "✅打开" : "❌关闭"}
    自动填题:${setting.自动答题 ? "✅打开" : "❌关闭"}
    当前组件响应时间(秒):${setting.组件等待时间 % (1000 * 60) / 1000}
    考试填题时间(秒):${setting.考试填题时间 % (1000 * 60) / 1000}
    当前评论库: [ ${setting.随机评论词库} ]
    已激活的评论选项卡:${((setting.激活所有选项卡的评论 || setting.激活评论选项卡) ? "评论;" : "") + ((setting.激活所有选项卡的评论 || setting.激活问答选项卡) ? "问答;" : "") + ((setting.激活所有选项卡的评论 || setting.激活笔记选项卡) ? "笔记;" : "") + ((setting.激活所有选项卡的评论 || setting.激活报错选项卡) ? "报错" : "")}\n
    📝修改配置请找到油猴插件的管理面板
    插件仅供提升学习效率减少,繁杂工作,解放双手之用,未利用任何漏洞达成目的,均为网页自动化测试技术,切勿滥用
    脚本完全免费开源,遵循 MIT 协议,严禁倒卖,如果您是购买使用请举报售卖者
    `)
});



// 一页页面加载后的工作
delayExec(() => {
    autoCloseDialog()
    //匹配不需要监听网络的URL
    switch (url) {
        //作业区
        case "/study/homework/preview.html":
        case "/study/homework/do.html":
            // case "/study/faceTeachInfo/testPreview.html":
            homeworkHandler()
            break;
        //考试
        case "/study/onlineExam/preview.html":
        case "/study/onlineExam/do.html":
            alert("请勿过快提交,同时也尽量调整脚本考试填题时间设置\n答题过快会被检测然后翻车哦")
            setting.组件等待时间 = setting.考试填题时间
            homeworkHandler()
            break
    }

    $(document).ajaxSend((e, xhr, options) => {
        if (!$.parseParams)
            $.extend({
                parseParams: function (e) {
                    for (var o, i = /([^&=]+)=?([^&]*)/g, n = /\+/g, c = function (e) {
                        return decodeURIComponent(e.replace(n, " "))
                    }, r = {}; o = i.exec(e);) {
                        var f = c(o[1])
                            , a = c(o[2]);
                        "[]" === f.substring(f.length - 2) ? (f = f.substring(0, f.length - 2),
                            (r[f] || (r[f] = [])).push(a)) : r[f] = a
                    }
                    return r
                },
                htmlencode: function (o) {
                    return e("<div />").text(o).html()
                },
                htmldecode: function (o) {
                    return e("<div />").html(o).text()
                }
            })
        if (setting.学神模式 && !setting.激活仅评论)
            if (options.url.indexOf("stuProcessCellLog") > -1) {

                const params = $.parseParams && $.parseParams(options.data);
                if (params)
                    options.data = $.param({
                        ...params,
                        studyNewlyTime: mediaLong,
                        picNum: pageCount,
                        studyNewlyPicNum: pageCount
                    })
            }
        // 修改评论页数
        if (options.url.indexOf("getCellCommentData") > -1) {
            const params = $.parseParams && $.parseParams(options.data);
            if (params)
                options.data = $.param({
                    ...params,
                    pageSize: setting.显示评论数
                })
        }
    });

}, setting.组件等待时间);
let lastNum = 10;
let currentCellData = {};
let isPassMonit = false;



// 全局请求拦截器
(function (open, send) {

    // 拦截发出的请求
    XMLHttpRequest.prototype.send = function (data) {

        // 学生课件状态检查
        if (data && data.indexOf("studyNewlyTime") >= 0) {
            // 关闭错误弹窗
            $(".sgBtn.ok").click();

            try {
                isPassMonit = true
                autoCloseDialog()
                if (!setting.激活仅评论) {
                    let readedNum = parseInt(getQueryValue("studyNewlyPicNum", "?" + data));
                    // 四舍五入留两位与服务器计时同步
                    const readedTime = Math.round(parseFloat(getQueryValue("studyNewlyTime", "?" + data)) * 100) / 100;
                    const picNum = parseInt(getQueryValue("picNum", "?" + data))
                    // 非媒体课件下启动
                    if ((!readedTime || setting.学神模式) && !startTime)
                        startTime = $.now()
                    // 纠正空课件监控问题
                    if (pageCount === 1)
                        readedNum = 1
                    // 损坏课件的问题
                    if (picNum === 1 && readedNum === 0)
                        pageCount = 1
                    console.log(`文档同步进度:${readedNum}/${pageCount}`, `视频同步进度:${readedTime}/${mediaLong}`);
                    // 某些课件未被检测
                    lastNum = readedNum && readedNum
                    if (lastNum === 0 && setting.保险模式) {
                        console.log("保险模式启动失败,已尝试关闭");
                        if (setting.自动关闭保险模式) {
                            setting.保险模式 = false
                            requestMatcher("viewDirectory", currentCellData)
                        }
                        return
                    }

                    // 判断当前课件是否已结束
                    if ((readedNum && pageCount && (readedNum >= pageCount)) || setting.学神模式) {
                        isFinshed = true
                        const endTime = $.now()
                        // 应对检测需停留 10 秒
                        if (startTime && (endTime - startTime >= 10000)) {
                            // 评论任务均已完成则跳转
                            if (isUnFinishedTabs.indexOf(true) === -1) {
                                nextCell()
                                return
                            }
                        }
                        console.log(`未满足职教云课件完成检测 10 秒要求,继续等待中,已等待:${endTime - startTime}ms`);
                    } else {
                        if (setting.保险模式)
                            pageCount && console.log(`文档类🔐模式:${readedNum}/${pageCount}`);
                        nextDOCPPT()
                    }
                } else {
                    // 评论任务均已完成则跳转
                    if (isUnFinishedTabs.indexOf(true) === -1) {
                        nextCell()
                        return
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        send.apply(this, arguments);
    };

    // 拦截数据响应
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener("readystatechange", () => {
            if (this.readyState >= 4)
                requestMatcher(this.responseURL, JSON.parse(this.responseText), this)
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);

/**
 * 请求匹配器,任务调度中心
 */
async function requestMatcher(url, data, that) {
    autoCloseDialog()
    // debugger
    switch (url) {
        // 评论
        case String(url.match(/.*getCellCommentData$/)):
            if (isUnFinishedTabs[0] || isUnFinishedTabs[1] || isUnFinishedTabs[2] || isUnFinishedTabs[3] || setting.激活所有选项卡的评论) {
                const userId = localStorage.getItem("userId");
                const item = data.list && data.list.find(item => item.userId === userId);
                // 评论已完成
                console.log("我的评论: ", item);

                switch (data.type) {
                    case 1: {
                        if (setting.激活评论选项卡 || setting.激活所有选项卡的评论) {
                            if (!item) {
                                await submitComment()
                                console.log("已完成评论提交");
                            }
                            isUnFinishedTabs[data.type - 1] = false
                        }
                    }
                        break;
                    case 2:
                        {
                            if (setting.激活笔记选项卡 || setting.激活所有选项卡的评论) {
                                if (!item) {
                                    await submitNote()
                                    console.log("已完成笔记提交");
                                }
                                isUnFinishedTabs[data.type - 1] = false
                            }

                        }
                        break;
                    case 3:
                        {
                            if (setting.激活问答选项卡 || setting.激活所有选项卡的评论) {
                                if (!item) {
                                    await submitQuestion()
                                    console.log("已完成问答提交");
                                }
                                isUnFinishedTabs[data.type - 1] = false
                            }
                        }
                        break;
                    case 4:
                        {
                            if (setting.激活报错选项卡 || setting.激活所有选项卡的评论) {
                                if (!item) {
                                    await submitReport()
                                    console.log("已完成报错提交");
                                }
                                isUnFinishedTabs[data.type - 1] = false
                            }
                        }
                        break;
                }

                let tab = isUnFinishedTabs.indexOf(true);
                if (!setting.激活笔记选项卡 && data.type !== 1)
                    tab -= 1
                if (tab > -1 && tab + 2 !== data.type) {
                    await delayExec(() => {
                        $($(".am-tabs-nav>li a")[tab]).click()
                    })
                }



                //解决不同机制判断问题
                if ((setting.激活仅评论 || isFinshed) && isUnFinishedTabs.indexOf(true) === -1 && taskStack === 0) {
                    nextCell()
                }
            }
            break;
        // 载入课件
        case String(url.match(/.*viewDirectory|loadCellResource$/)):
            {
                if (data.code === -33) {
                    nextCell()
                    return
                }

                autoCloseDialog()
                if (setting.激活仅评论) {
                    console.log("仅开启评论已打开");
                    // commentHandler()
                    return
                }

                if (currentCellData && setting.打开课件下载) {
                    // 课件下载 todo
                    data.isAllowDownLoad = true
                    data.isDownLoad = true
                    console.log("当前课件下载地址:", data.downLoadUrl);
                    // 修改服务器返回数据
                    if (!that._responseText) {
                        Object.defineProperty(that, 'responseText', {
                            get: () => that['_responseText'] === undefined ? that.responseText : that['_responseText'],
                            set: (val) => {
                                that['_responseText'] = val
                            },
                            enumerable: true
                        });
                    }
                    //修改响应数据
                    that._responseText = JSON.stringify(data)
                }
                // 课件页数
                pageCount = data.pageCount
                // // 课件当前已阅览时间
                // readTime = data.stuStudyNewlyTime
                // 媒体时间长度
                mediaLong = data.audioVideoLong;
                // 课件进度
                const cellPercent = data.cellPercent
                // 课件类型
                cellType = data.categoryName
                // 如果当前课件为遗漏课件则进入下一个课件
                if (cellPercent === 100 && isUnFinishedTabs.indexOf(true) === -1) {
                    nextCell()
                    return
                }
                currentCellData = data
                console.log("当前课件: ", data);
                cellHandlerMatcher()
            }
            break;

        case String(url.match(/.*faceTeachActivityInfo$/)):
            {
                delayExec(() => {
                    appendSign(data.list)
                }, setting.组件等待时间)
            }
            break
        // 课程章节目录
        case String(url.match(/.*getProcessList$/)):
            {
                const localS = sessionStorage.getItem(classId);
                //未在本地找到遗留数据则重新获取
                if (!localS || localS === "[]" || localS === "null") {

                    if (!confirm("正在获取未完成小节数据,为避免检测,请耐心等待🖥\n✅确定以继续,确认后勿关闭本页\n直到再次弹窗,否则脚本将结束工作\n  ‼️插件仅供提升学习效率减少,繁杂工作,解放双手之用,未利用任何漏洞达成目的,均为网页自动化技术,请健康使用勿要滥用\n"))
                        return
                    const parentNode = data && data.progress;
                    //过滤已经学习完的课件
                    let dirs = parentNode && parentNode.moduleList.filter(item => item.percent !== 100)
                    if (setting.激活仅评论)
                        dirs = parentNode.moduleList
                    //请求课程所有数据
                    const orginalData = (await sendIcveRequest(urls2.courseView_getCourseDetailList)).courseProcessInfo
                    //过滤掉已完成的章节
                    const list = orginalData && orginalData.filter(item => dirs.find(i => i.id === item.id))
                    const cid = getQueryValue("courseOpenId")
                    const oid = getQueryValue("openClassId")
                    //最终处理数据
                    const finalData = []
                    //提取未完成的课件
                    for (const item of list) {
                        for (const i of item.topics) {
                            // 最终需要处理的数据
                            const cellList = (await sendIcveRequest(urls.process_getCellByTopicId, { courseOpenId: cid, openClassId: oid, topicId: i.id })).cellList
                            cellList && cellList.forEach(item => {
                                const childList = item.childNodeList;
                                if (childList && childList.length !== 0) {
                                    const childVaildList = childList.filter(i => {
                                        // if (i.cellType !== 4 && i.fromType !== 4) {
                                        if (i.cellType !== 4) {
                                            if (setting.激活仅评论)
                                                return true
                                            if (i.stuCellFourPercent !== 100)
                                                return true
                                        }
                                        return false
                                    });
                                    console.log(childVaildList);
                                    finalData.push(...childVaildList)
                                    // } else if (item.cellType !== 4 && item.fromType !== 4) {
                                } else if (item.cellType !== 4) {
                                    if (setting.激活仅评论)
                                        finalData.push(item)
                                    else if (item.stuCellPercent !== 100)
                                        finalData.push(item)
                                    console.log(item);
                                }
                            })
                        }
                    }
                    console.log(`已成功缓存${finalData.length}条未完成小节信息`);
                    sessionStorage.setItem(classId, JSON.stringify(finalData.reverse()))
                }
                const data_ = JSON.parse(sessionStorage.getItem(classId))
                console.log(data_);
                if (confirm(`✅已初始化完成,发现${data_.length}个课件未完成,是否立即启动不知疲倦学习🙇🏼‍♂️📚模式`))
                    goPage(null, data_[data_.length - 1])
            }
            break;
        default:
            if (data && data.msg && data.msg.indexOf("操作成功") < 0) {
                console.log("无任务可分配", data);
            }
            break;
    }
}
/**
 * 查找下一个课件,并在本地缓存更新相应信息
 */
function nextCell() {
    // debugger
    const data = JSON.parse(sessionStorage.getItem(classId));
    if (!data) {
        if (confirm("🆇未从缓存中检测到课程数据,是否进入正常运行流程")) {
            goPage("p")
            return
        }
    }
    const surplusData = data && data.filter(item => item.Id !== cellID);
    sessionStorage.setItem(classId, JSON.stringify(surplusData))

    if (surplusData && surplusData.length === 0) {
        alert("课程已完成\n脚本完全免费开源,遵循 MIT 协议,严禁倒卖,如果您是购买使用请举报售卖者")
        return
    }

    console.log("当前课件任务已完成----");

    delayExec(() => {
        goPage(null, surplusData.pop())
    })
}


/**
 * 跳转到某页面
 */
function goPage(url, data = undefined) {
    let newPage;
    if (!url) {
        newPage = `${location.origin}/common/directory/directory.html?courseOpenId=${data.courseOpenId}&openClassId=${classId}&cellId=${data.Id}&flag=${data.flag || "s"}&moduleId=${data.parentId}`;
        console.log("下一个课件: ", newPage);
    } else {
        newPage = `${location.origin}/study/process/process.html?courseOpenId=${getQueryValue("courseOpenId")}&openClassId=${getQueryValue("openClassId")}`
    }
    top.location.href = newPage
}

/**
 * 对网站发送请求集中处理,解析结果,处理成功与否逻辑
 */
function sendIcveRequest(url, data = {}) {
    return new Promise((resolve, reject) => {
        delayExec(() => {
            _.ajax(url, data, (r) => {
                if (r.code == 1) {
                    resolve(r)
                } else {
                    console.log("请求出问题了🔐", r)
                    reject(r)
                }
            })
        })
    })
}


/**
 * 课件匹配处理调度
 */
function cellHandlerMatcher() {

    if (!setting.激活仅评论)
        switch (cellType) {
            case "图片":
            case "文档":
            case "excel文档":
            case "office文档":
            case "pdf文档":
            case "其它":
            case "ppt文档":
                if (!setting.保险模式)
                    delayExec(() => {
                        docHandler()
                    })
                break;
            case "ppt":
                if (!setting.保险模式)
                    delayExec(async () => {
                        await pptHandler()
                    })
                break;
            case "swf":
                swfHandler()
                break;
            case "视频":
            case "音频":
                delayExec(() => {
                    mediaHandler()
                }, setting.组件等待时间)
                break;
            case "图文":
            case "压缩包":
                emptyHandler()
                break;
            default:
                console.log(`课件 : ${cellType} 未提供兼容, ${setting.未做兼容课件打开评论 ? '已开启兼容评论,仅运行评论' : '已跳过处理'},请在github issue  (https://github.com/W-ChihC/SimpleIcveMoocHelper)  反馈该日志,与作者取得联系`);
                break
        }
}





/**
 * 获取url查询字段
 * @param {查询字段} query
 * @param 默认为地址栏
 */
function getQueryValue(query, url = window.location.search) {
    let theRequest = new Object();
    if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++)
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
    return theRequest[query];
}


/**
 * 仅仅评论的处理器
 */
async function emptyHandler() {
    console.log("啥也没干,请联系作者", cellType);
}

async function swfHandler() {
    //当不支持flash时执行
    if ($('.popBox').length !== 0) {
        $($('.popBox a')[1]).click()
    }
}

/**
 * 视频/音频类处理
 */
function mediaHandler() {
    try {
        let player = top.jwplayer($(".jwplayer").attr("id"));
        let state = null;
        state = player.getState();
        //视频暂停状态
        if (state == "paused" || state === 'idle') {
            console.log("媒体已暂停,恢复播放");
            player.play()
        }
        if (player.getDuration() === 0) {
            if (state === "buffering") {
                const timer = setInterval(() => {
                    if (player.getPosition() === 0)
                        delayExec(() => {
                            if (player.getPosition() === 0)
                                player.play();
                        }, setting.组件等待时间);
                    else
                        clearInterval(timer)
                }, setting.组件等待时间);

            } else {
                if (setting.学神模式 || isUnFinishedTabs.indexOf(true) === -1) {
                    nextCell()
                    return
                }
                isFinshed = true
            }
        }
        //播放原已完成
        if (player.getState() == "complete") {
            console.log("媒体播放已完成");
            // 评论任务均已完成则跳转
            if (isUnFinishedTabs.indexOf(true) === -1) {
                nextCell()
                return
            }
            isFinshed = true
            return
        }
        //播放回调
        player.on("playlistComplete", () => {
            console.log("媒体播放完成");
            // 评论任务均已完成则跳转
            if (isUnFinishedTabs.indexOf(true) === -1) {
                nextCell()
                return
            }
            isFinshed = true
        })
        //配置
        player.setMute(setting.是否保持静音)//静音
        player.setCurrentQuality(setting.视频清晰度)
        try {
            player.setPlaybackRate(setting.视频播放倍速)
        } catch (error) {
            console.log('倍速开启失败...正常现象.');
        }
    } catch (error) {
        console.log("课件为空或无法解析", error);
        // 评论任务均已完成则跳转
        if (isUnFinishedTabs.indexOf(true) === -1) {
            nextCell()
            return
        }
        isFinshed = true
    }

}
/**
 * 文档处理
 */
async function docHandler() {

    if ($(".MPreview-pageNext").length !== 0) {
        //根据按钮状态判断是否还有下一页
        while ($(".MPreview-pageNext").hasClass('current')) {
            console.log(`文档翻页,总页数:${pageCount}`);
            //ppt翻页 异步方式
            await delayExec(() => {
                $(".MPreview-pageNext").click()
            })
        }
    } else {
        await pptHandler()
    }
}


/**
 * PPT类别处理
 */
async function pptHandler() {
    // 异步处理
    return new Promise(async (resolve, reject) => {
        for (let i = 1; i <= pageCount * 2; i++) {
            //点击下一页
            await delayExec(() => {
                nextDOCPPT()
                // console.log(`ppt第${i}页,总页数:${pageCount}`);
                //达到次数解除阻塞
                if (isFinshed || i === pageCount && mediaLong === 0)
                    resolve()
            })
        }
        // if (pageCount === 1) {
        //     for (let i = 0; i < 5; i++)
        //         nextDOCPPT()
        //     delayExec(() => {
        //         nextCell()
        //         resolve()
        //     }, 15000)
        // }
    })
}
/**
 * 下一页PPT 或文档
 */
function nextDOCPPT() {
    const pptNext = $(".stage-next"), docNext = $(".MPreview-pageNext"), sNext = $(".stage-next-btn");
    pptNext && pptNext.click()
    docNext && docNext.click()
    sNext && sNext.click()
}
/**
* 对XHR的二次全局封装,方便后期扩展
* @param {*} method
* @param {*} url
* @param {*} headers
* @param {*} data
* @param {*} onSuccess
*/
function requestAPI(method, url, { headers = {}, data, onSuccess } = {}) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: method,
            url: url,
            headers: headers,
            data: data,
            //关闭 cookie
            anonymous: true,
            timeout: 2000,
            onload: function (xhr) {
                switch (xhr.status) {
                    case 200:
                        // let obj = $.parseJSON(xhr.responseText) || {};
                        if (onSuccess)
                            onSuccess(xhr)
                        else
                            resolve(xhr)
                        break;
                    default:
                        alert(xhr)
                        reject(xhr)
                        break;
                }
            },
            onabort: function (params) {
                reject(params)

            },
            onerror: function (params) {
                // debugger
                reject(params)
            },
            ontimeout: function (params) {
                reject(params)
            }
        });
    })

}


/**
 * 评论
 */
async function submitComment() {
    // debugger
    return new Promise(async (resolve, reject) => {

        //评5星
        $("#star #starImg4").click();
        //随机从词库填写评论
        $(".commentContent").text(setting.随机评论词库[rnd(0, setting.随机评论词库.length - 1)])
        //提交
        await delayExec(async () => {
            $("#btnComment").click();
            resolve()
        });
    })
}
/**
 * 单选 多选 判断 填空 问答
 */
async function autoFill() {
    const q = $(".qBtn");
    for (let i = 0; i < q.length; i++) {
        const e = q[i];
        await delayExec(() => {
            e.click()
        }, setting.组件等待时间)
    }
    if (list.length != 0) {
        await requestAPI("PUT", "http://39.96.64.75/s", {
            headers: { "Content-Type": "application/json;charset=utf-8" },
            data: JSON.stringify(list)
        })
        delayExec(() => {
            $("#submitHomeWork").click()
        }, setting.组件等待时间)
    }
}
/**
 * 问答
 */
async function submitQuestion() {
    // debugger
    return new Promise(async (resolve, reject) => {
        //随机从词库填写评论
        $(".questionContent").text(setting.随机评论词库[rnd(0, setting.随机评论词库.length - 1)])
        //提交
        await delayExec(async () => {
            $("#btnQuestion").click();
            resolve()
        }, 60000);
    })
}
const list = []
/**
 * 笔记
 */
async function submitNote() {
    // debugger
    return new Promise(async (resolve, reject) => {
        //随机从词库填写评论
        $(".noteContent").text(setting.随机评论词库[rnd(0, setting.随机评论词库.length - 1)])
        //提交
        await delayExec(async () => {
            $("#btnNote").click();
            resolve()
        });
    })
}
/**
 * 报错
 */
async function submitReport() {

    return new Promise(async (resolve, reject) => {
        //随机从词库填写评论
        $(".cellErrorContent").text(setting.随机评论词库[rnd(0, setting.随机评论词库.length - 1)])
        //提交
        await delayExec(async () => {
            $("#btnCellError").click();
            resolve()
        }, 60000);
    })
}


/*
*  解除文本限制
*/
function uncageCopyLimit() {
    let arr = ["oncontextmenu", "ondragstart", "onselectstart", "onselect", "oncopy", "onbeforecopy"]
    for (let i of arr)
        $(".hasNoLeft").attr(i, "return true")
    console.log("已成功解除复制限制,📣如果您有软件定制(管理系统,APP,小程序等),毕设困扰,又或者课程设计困扰等欢迎联系,价格从优,源码调试成功再付款💰,实力保证,包远程,包讲解 QQ:2622321887")
}


/**
 * 搜索答案
 * @param {*} i
 */
async function searchAnswer(i) {
    await requestAPI("GET", "http://39.96.64.75/").catch(e => {
        if (e.status != 200) {
            console.log("服务器异常")
            throw Error
        }
    })
    if (!setting.自动答题) {
        await requestAPI("PUT", "http://39.96.64.75/s", {
            headers: { "Content-Type": "application/json;charset=utf-8" },
            data: JSON.stringify(list)
        })
    }
    bugGetAnswer(i)
    // 往前查找同辈元素
    // const question = $($(".qBtn")[i]).prevAll(".e-q-q").text().trim();
    // requestAPI('GET', `${server}/q?q=${question}`, {
    // onSuccess: (xhr) => {
    // const body = JSON.parse(xhr.responseText)
    // showAnswerListDiv(question, body, i)
    // }
    // })
}
/**
* 作业处理
*/
async function homeworkHandler() {
    await requestAPI("GET", "http://39.96.64.75/").catch(() => {
        alert("服务器被D到自闭🤯 ,无法继续查题，请在两小时后重试")
        throw Error
    })
    uncageCopyLimit()
    if (!setting.自定义题库服务器) {
        alert("未填写题库📝,无法正常使用答题,仅提供解除网站限制")
    }
    bindBtnToQuestion()
    if (setting.自动答题)
        autoFill()
}

// 重新渲染答题区的标志位
let reRender = false

/**
 * 将查询按钮按ID调用插入到题目区未位
*/
function bindBtnToQuestion() {
    // $(`<button class="qBtn" type="button">🔍</button>`).appendTo(".e-q-quest")
    // $($(".e-a-g")[2]).prev(".e-q-q")
    $(".e-q-quest").each(async (i, e) => {
        $(`<button class="qBtn" x="${i}" type="button">🔍</button>`).appendTo($(e))
    })
    //去除填空按钮,提高答案匹配
    $('.fillbox').detach()

    //绕过网站全局事件注册
    $(".qBtn").on("click", (event) => {
        reRender = true
        searchAnswer(event.srcElement.attributes["x"].value)
    })
}

const server = setting.自定义题库服务器 || "http://127.0.0.1:5000"

/**
 * //接口对接规范(JSON) 快速通道(/q?q=问题) 更多信息(/q2?q=问题)
 *  [
 *   {
 *    'question': '问题,可留空',
 *    'answer': '答案', //判断题 1 为正确,其余为错误
 *    'options':'题目选项,可留空',
 *    'msg': '消息,可留空'
 * },{
 *
 *    }
 * ]
 *
 */
/**
 * bug
 * @param {*} i 
 */
function bugGetAnswer(i) {
    let qId = $($(".qBtn")[i]).parents(".e-q-body").data().questionid;
    if (!qId) {
        qId = $($(".qBtn")[i]).parents(".e-q-body").data().question;
    }

    requestAPI('POST', `https://zjy2.icve.com.cn/api/faceTeach/test/previewQuestion`, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: `questionId=${qId}`,
        onSuccess: (xhr) => {
            const json = JSON.parse(xhr.responseText)
            const submitBody = {}
            const questions = json.question;
            submitBody._id = qId
            submitBody.q = questions.allTitle
            submitBody.a = []
            submitBody.o = []
            questions.optionList.forEach(e => {
                if (e.IsAnswer == "True")
                    submitBody.a.push(e.Content)
                submitBody.o.push(e.Content)
            })

            submitBody.t = questions.questionType
            if (questions.optionList.length == 0)
                submitBody.a.push(questions.answer)
            if (questions.questionType == 7) {
                json.answerList.forEach((e, i) => {
                    submitBody.a.push(`${e.OptionContent}-${json.answerContentList[e.OptionSelectContent].OptionAnswerContent}`)
                })
            }
            if (submitBody.a.length === 0 && questions.questionType === 4) {
                questions.questionAnswer.forEach(e => {
                    submitBody.a.push(e)
                })
            }
            if (submitBody.a.length === 0) {
                submitBody._id = submitBody._id + "x"
                questions.questionAnswer.forEach((e, i) => {
                    submitBody.a.push(questions.optionList[e].Content)
                })
            }
            submitBody.s = questions.resultAnalysis
            list.push(submitBody)
            showAnswerListDiv(submitBody.q,
                [{
                    'question': submitBody.q,
                    'answer': submitBody.a,
                    'options': submitBody.o,
                }], i)
        }
    })
}



/**
 * 填题
 * @param {*} id  答案 ID
 */
function fillAnswer(aID, qId) {
    // 多选 及自动答题模块
    //todo 后端: 1,2,3
    const answer = $(`#${aID}`).text();
    const qBody = $($(".qBtn")[qId]).parents(".e-q-body");
    const questionType = qBody.data("questiontype");
    let inputBlock;
    switch (questionType) {
        // <!-- 1：单选 2：多选 -->
        case 1:
        case 2:
            answer.split(",").forEach(e => {
                inputBlock = $(qBody.find(`.e-a-g li:contains("${e}")`));
                inputBlock.click()
                inputBlock.focus()
            })
            break;
        // < !--3：判断题-- >
        case 3:
            inputBlock = $(qBody.find(".e-a-g li")[answer == "1" ? 0 : 1]);
            //默认第一项为正确
            inputBlock.click()
            inputBlock.focus()
            break;
        // <!-- 4：填空题(主观) 5：填空题(客观) 6 问答-->
        case 4:
        case 5:
            answer.split(",").forEach((e, i) => {
                inputBlock = $(qBody.find(".e-a-g input")[i])
                inputBlock.val(e)
                inputBlock.blur()
            })
            break;
        case 6:
            inputBlock = $(qBody.find("textarea")[0])
            inputBlock.val(answer)
            inputBlock.blur()
            break;
        default:
            break;
    }
}
// 查看更多答案的锁
let nextLock = false
/**
 * 显示搜索框
 * @param {*} params
 */
async function showAnswerListDiv(questionTitle, data, id) {
    if ($("#answerBlock").length == 0) {
        const baseDiv = ` <div id="answerBlock"   style="background: #cccccc8c;max-width:50%; float: right; margin-right: 230px;height:400px;overflow:auto; position: fixed; top: 0; right: 0; z-index: 9999;">
                                    <table border="1" cellspacing="0" align="center" style="font-size: 14px;">
                                        <caption>${questionTitle}</caption>
                                        <thead>
                                            <tr>
                                                <th>标题</th>
                                                <th>填题目📝</th>
                                                <th>消息</th>
                                            </tr>
                                            <tr>
                                                <th colspan="2">选项</th>
                                            </tr>
                                            <tr>
                                                <th colspan="2">结果</th>
                                            </tr>
                                        </thead>
                                        <tbody align="left">
                                        </tbody>
                                        <tfoot align="center">
                                        <tr>
                                            <td><button type="button" id="nextBtn" >查找更多</a></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>`
        $(baseDiv).appendTo("body")
        // 初次初始化后关闭
        reRender = false
        //允许查看更多
        nextLock = false
    } else {
        if (reRender) {
            //更新对应数据
            $("#answerBlock caption").text(questionTitle)
            //删除原有的数据
            $('#answerBlock tbody tr').detach()
            // 换题后立即关闭
            reRender = false
            //允许查看更多
            nextLock = false
        }
    }
    let tbody = "";
    data && data.forEach((item, i) => {
        if (item != null) {
            let { question, answer, options, msg } = item
            const x = rnd(10, 1000000) + i
            tbody += `
                    <tr>
                        <td>${question || ""}</td>
                        <td><button class="aBtn" aId="${x}" qId=${id} type="button">填入</button></td>
                        <td>
                            <p>${msg || ""}</p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">${options || ""}</td>
                    </tr>
                    <tr>
                        <td colspan="3"><span  id=${x}>${answer || ""}</span></td>
                    </tr>
                    `
        }
    });
    /**
      * 查看更多
      */
    if (!nextLock) {
        $("#nextBtn").off("click")
        $("#nextBtn").on("click", (event) => {
            if (!nextLock)
                requestAPI('GET', `${server}/q2?q=${questionTitle}`, {
                    onSuccess: (xhr) => {
                        const body = JSON.parse(xhr.responseText)
                        console.log(body);
                        showAnswerListDiv(questionTitle, body, id)
                        //不再允许重复访问
                        nextLock = true
                    }
                })
        })
    }
    /**
     * tbody区
     */
    $(tbody).appendTo("#answerBlock table tbody")
    $('#answerBlock p').css({ margin: '0', wordwrap: 'break-word', maxwidth: '50px' });
    $('#answerBlock em').css({ color: 'red' })
    //绕过网站全局事件注册
    $(".aBtn").on("click", (event) => {
        fillAnswer(event.srcElement.attributes["aId"].value, event.srcElement.attributes["qId"].value)
    })
    if (setting.自动答题)
        /**填写第一项到答案 */
        $(".aBtn")[0].click()

}
