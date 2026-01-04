// ==UserScript==
// @name         Keylol-Autorate
// @namespace    Keylol
// @include      https://keylol.com/forum.php
// @include      https://keylol.com/
// @require      https://code.jquery.com/jquery-3.5.1.min.js#sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=
// @version      1.2.6-DreamNya
// @icon         https://raw.githubusercontent.com/DreamNya/Keylol-Autorate/DreamNya-patch-1/img/konoha.png
// @description  Keylol forum autorate tool
// @author       DreamNya
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/438565/Keylol-Autorate.user.js
// @updateURL https://update.greasyfork.org/scripts/438565/Keylol-Autorate.meta.js
// ==/UserScript==
const update_logs=
`13.version 1.2.6-DreamNya(2021-1-15)
a.优化部分提示
b.优化面板按钮，归集同类功能按钮
c.优化面板位置，现在默认为相对浏览器水平居中、垂直居中
d.导出体力记录从正序显示改为倒序显示
e.修改自定义变量默认关闭，需手动添加本地存储变量"debug_mode": true,
f.加入脚本运行时阻止页面关闭功能
g.移除精确倒计时，优化倒计时方式
h.移除debug加体力模式
i.现在没有正确格式收藏帖会自动清除冷却时间，不再无限提示了
j.现在体力可以加到50页以后的回复了（论坛政策导致很多历史帖无法加体，现在已经出现了无帖子可加体的情况）
k.修复加体记录对比bug，加快运行速度

12.version 1.2.5-DreamNya(2021-1-19)
a.进一步优化多页面冲突解决方案

11.version 1.2.4-DreamNya(2020-12-23)
a.现在多页面冲突时能正常加体力了（初步测试没有问题 可能仍有bug 需要更多反馈）
b.加入自定义存储变量功能，方便debug，需手动修改const debug = false;为const debug = true;
c.增加原先遗漏的论坛主页定时刷新功能

10.version 1.2.3-DreamNya(2020-12-08)
a.修复启用精确冷却倒计时时开启多页面造成的毫秒级重复加体冲突
b.现已加入随机标识符辨别脚本运行次数
c.优化检测剩余体力速度
d.优化面板按钮代码
e.增加及取消注释某些debug，降低作者答疑难度

9.version 1.2.2-DreamNya(2020-12-01)
a.体力冷却异常增加防御措施，现在不会无限提示无体力了
b.main()函数增加try catch防御措施，以防万一,但运行速度变慢，自行选择
c.现在每加完一个回复的体力就更新一次收藏说明，而不是以前的加完全部回复才更新，防止异常漏更新
d.现在体力记录、调试信息可以动态更新了
e.进一步模块化设置面板div文本代码
f.增加可能有点鸡肋的记录面板位置功能
（本来想用函数算最佳位置，后来想了想还是自定义吧）

8.version 1.2.1-DreamNya(2020-11-23)
a.优化Autorate显示方法，如超过10秒未成功初始化，会弹出提示建议刷新页面
b.优化代码写法
c.优化导出调试信息，现在可以导出完整调试信息
d.优化导出体力记录/链接
e.优化css代码，添加@grant GM_addStyle，增加可读性，看上去没有以前那么杂乱了

7.version 1.2.0-DreamNya(2020-11-22)
a.重大更新，增加可视化脚本操作面板
b.原自定义常量设置直接加入设置面板，无需打开油猴即可设置
c.增加体力导出功能，现可查看历史加体力信息，并自动转到目标帖
d.增加导出脚本调试信息功能，方便debug，提交异常信息
f.增加脚本强制复位功能（与连续3次手动执行脚本共存）

6.version 1.1.3-DreamNya (2020-11-12)
a.修复对比pid记录bug
b.优化获取时间函数

5.version 1.1.2-DreamNya（2020-11-05）
a.修复手动Autorate后的倒计时bug
b.修复对比pid记录bug

4.version 1.1.1-DreamNya（2020-10-25）
a.增加检测脚本重复运行机制，防止多页面重复运行脚本导致加体力冲突
（如脚本异常退出，要使脚本正常运行需连续点击3次按钮，或手动修改脚本存储内容"Status": "On"为"Status": "Off",）

3.version 1.1.0-DreamNya（2020-10-20）
a.修复毫秒显示bug
b.重写RateRecord，现pid tid已根据uid分类
c.增加定时刷新页面功能

2.version 1.0.9-DreamNya（2020-09-16）
a.修复冷却完毕时的计时器bug
b.新增加体力延迟、精确冷却倒计时功能
c.重写main()中获取帖子加体力的逻辑(未测试同时加多个收藏贴的功能 不推荐同时加多个收藏贴 可能存在bug)
d.存储已加体力tid pid信息，进一步优化加体力速度
e.存储运行日志，方便debug以及记录体力操作信息

1.version 1.0.8-DreamNya（2020-08-26）
a.在原作者ohperhaps 1.0.7版本基础上新增登陆论坛无需点击Autorate按钮自动加体力功能（首次使用需要手动点击按钮）
b.增加Autorate按钮显示体力冷却倒计时功能（hh:mm:ss格式）。默认开启，每隔1000毫秒刷新一次
  脚本编辑页面开头可自定义刷新时间const Autotime = 1000;（修改默认1000的为目标时间，单位毫秒，0为关闭显示）
c.修改脚本只有在论坛主页才会生效，以加快论坛加载速度

已知问题：
a.同时多个收藏贴只会平均体力，快加完其中一个时，不会优先加完。可能是1.0.9版本重写main()时存在逻辑问题。(无打算处理，不推荐同时加多个体力)

计划中：
a.增加存储debug信息开关。目前需要手动删除debug注释(暂无计划更新)
b.uid体力加完后一段时间自动清理(暂无计划更新)
c.每次增加体力前获取一次体力信息(因功能取舍/逻辑问题更新推迟)
`
const version="1.2.6-DreamNya"

let Autotime = GM_getValue('Autotime',1000); //自定义体力冷却倒计时刷新周期，单位毫秒，0为关闭显示。
let HideAutoRate = GM_getValue('HideAutoRate',false); //显示体力冷却时是否隐藏Autorate文字 true:hh:mm:ss / false:Autorate hh:mm:ss
let delay = GM_getValue('delay',5000); //自定义24小时体力冷却完毕后再次加体力时延迟
let refresh = GM_getValue('refresh',600000); //定时刷新页面，单位毫秒，0为不刷新
let position = GM_getValue('position', false); //设置刷新页面后面板位置 0:固定面板位置 1:点击关闭按钮时记录面板位置 -1：恢复默认位置(不影响是否固定)
//let debug_main = GM_getValue('debug_main',false); //是否开始debug加体力模式 false:正常运行速度，如遇bug需自行查看控制台 true:运行速度变慢，但较稳定，适合新手
let debug = GM_getValue('debug_mode',false); //临时
//const debug = 3; //0:不存储除体力冷却体力操作以外的任何信息 1:存储有限debug信息 2:存储大量debug信息 3:1+2
//提示：原自定义常量设置现已加入设置面板，如需手动修改可至脚本存储处`


(function() {
    'use strict';
    const $ = unsafeWindow.jQuery
    const homePage = "https://keylol.com/"
    const selfUid = $("li.dropdown").find("a").attr("href").split("-")[1]
    const formHash = $("[name=formhash]").val()
    const init = GM_getValue('Ratetime')
    const init_time = new Date().getTime()
    const uuid = random_uuid() //脚本运行标识符
    let Timer_normal
    let timeout = true
    let status
    let auto_refresh = 0 //记录脚本运行时间
    let running = false

    console.log(getDate()+" Autorate "+version)

    if (init){ //初始化倒计时
        var Cooldown=init+86400000+delay-init_time //获取体力冷却时间
        var Timer
        AutoTimer()
    }

    if ($('#nav-user-action-bar').length>0){ //初始化Autorate按钮
        views()
    }else{
        var views_times=0
        var views_Timer =setInterval(views_onload,1000)
        }

    window.onbeforeunload = function (e) {
        if(running){
            e = e || window.event;
            if (e) {
                e.returnValue = '脚本运行中'
            }
            return '脚本运行中'
        }
    }

    function random_uuid(){ //随机标识符
        let random_string="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        let result=""
        for (let i=0;i<5;++i){
            result += random_string.charAt(Math.floor(Math.random() * random_string.length))
        }
        return result
    }

    function xhrAsync (url, method="GET", data="") {
        if (method === "GET") {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    "method": "GET",
                    "url": homePage + url,
                    "onload": resolve
                })
            })
        } else if (method === "POST") {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    "method": "POST",
                    "url": homePage + url,
                    "data": data,
                    "onload": resolve
                })
            })
        }
    }
    function compare(property){
        return function(a,b){
            let value1 = a[property];
            let value2 = b[property];
            return value1 - value2;
        }
    }
    async function getUserScore() {
        let ts_ = (new Date()).getTime()
        let score_ = await xhrAsync(
            `forum.php?mod=misc&action=rate&tid=7800&pid=106186&infloat=yes&handlekey=rate&t=${ts_}&inajax=1&ajaxtarget=fwin_content_rate` //选用了一个没人加过体的古老帖子检测剩余体力，加快检测速度
                                   ).then((res) => { return $("table.dt.mbm td:last", res.response).text() })
        if (/^\d+$/.test(score_)) { return parseInt(score_) }
        else{
            let threads = await xhrAsync(`forum.php?mod=guide&view=newthread`).then((res) => {
                let threads = []
                $("div.bm_c", res.response).find("tbody").each(function () { threads.push($(this).attr("id").split("_").pop()) })
                return threads })
            for (let thread of threads) {
                let posts = await xhrAsync(`t${thread}-1-1`).then((res) => {
                    let posts = []
                    $("#postlist > div[id^=post_]", res.response).each(function () { posts.push($(this).attr("id").split("_").pop()) })
                    return posts
                })
                for (let post of posts) {
                    let ts = (new Date()).getTime()
                    let score = await xhrAsync(`forum.php?mod=misc&action=rate&tid=${thread}&pid=${post}&infloat=yes&handlekey=rate&t=${ts}&inajax=1&ajaxtarget=fwin_content_rate`).then((res) => {
                        return $("table.dt.mbm td:last", res.response).text()
                    })
                    if (/^\d+$/.test(score)) { return parseInt(score) }
                }
            }
        }
    }
    function getUserCredit(uid) {
        let creditBox = {
            "30": { step: 0, max:0},
            "31": { step: 0, max:0},
            "32": { step: 1, max:3},
            "33": { step: 2, max:5},
            "34": { step: 2, max:8},
            "35": { step: 3, max:10},
            "36": { step: 3, max:15},
            "37": { step: 4, max:15},
            "51": { step: 5, max:15},
            "52": { step: 0, max:0},
        }
        return Promise.all([xhrAsync(`suid-${uid}`), getUserScore()]).then((results) => {
            let gid = $("li:contains('用户组')", results[0].response).find("a").attr("href").split("=").pop()
            let credits = creditBox[gid] || { step: 4, max:15}
            credits.total = results[1]
            return credits
        })
    }
    async function getCollections() {
        let collections = []
        for(let page = 1; page <= 40; page++) {
            let res = await xhrAsync(`plugin.php?id=keylol_favorite_notification:favorite_enhance&formhash=${formHash}&size=100&page=${page}`)
            let cs = $("#delform", res.response).find("tr")
            if (cs.length === 0) { break }
            else {
                cs.each(function () {
                    let quote = formatQuote($("span.favorite_quote.xi1", this).text())
                    if (quote) {
                        collections.push({favid: $(this).attr("id").split("_").pop(),
                                          uid: $("[href^='suid']", this).attr("href").split("-").pop(),
                                          username: $("[href^='suid']", this).text(),
                                          quote: quote[0],
                                          remain: quote[1],
                                          score: 0})
                    }
                })
            }
        }
        return collections.sort(compare('remain'))
    }
    function calcScores() {
        return Promise.all([getCollections(), getUserCredit(selfUid)]).then((results) => {
            let total = results[1].total
            let calcFlag = results[0].length > 0
            while(calcFlag) {
                for(let item of results[0]) {
                    if (total < 1) { calcFlag = false; break }
                    else {
                        if (item.score < item.remain) { item.score++; total-- }
                    }
                }
                if (results[0].every(item => item.score === item.remain)) { calcFlag = false }
            }
            results[0].forEach(function (item) {item.step = results[1].step})
            return [results[0], results[1].total, results[1].max]
        })
    }
    function getUserReplys(uid, page=1) {
        return xhrAsync(`home.php?mod=space&uid=${uid}&do=thread&view=me&from=space&type=reply&order=dateline&page=${page}`).then((res) => {
            let replys = []
            $("#delform", res.response).find("td.xg1").each(function () {
                let urlParams = new URLSearchParams($(this).find("a").attr("href"))
                replys.push({tid: urlParams.get("ptid"),
                             pid: urlParams.get("pid")})
            })
            if (replys.length>0){
                return replys
            }else{
                return "empty"
            }
        })

    }
    function formatQuote(quote, addend=0) {
        let quote_num = quote.match(/\d+/g)
        if (/^\d+\/\d+$/.test(quote) && parseInt(quote_num[0]) < parseInt(quote_num[1])) {
            return [(parseInt(quote_num[0]) + parseInt(addend)).toString() + '/' + quote_num[1].toString(), (parseInt(quote_num[1]) - parseInt(quote_num[0]) - parseInt(addend))]
        }
    }
    function updateQuote(favid, quote) {
        const formData = new FormData()
        formData.append("favid", favid)
        formData.append("quote", quote)
        return xhrAsync(`plugin.php?id=keylol_favorite_notification:favorite_enhance&formhash=${formHash}`, "POST", formData).then((res) => {
            return res.responseText
        })
    }
    function rate(tid, pid, score, reason) {
        const formData = new FormData()
        formData.append("formhash", formHash)
        formData.append("tid", tid)
        formData.append("pid", pid)
        formData.append("referer", `${homePage}forum.php?mod=viewthread&tid=${tid}&page=0#pid${pid}`)
        formData.append("handlekey", "rate")
        formData.append("score1", score)
        formData.append("reason", reason)
        return xhrAsync(`forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1`, "POST", formData).then((res) => {
            if (res.responseText.indexOf('succeedhandle_rate') !== -1) {
                return ('successful')
            } else if (res.responseText.indexOf('errorhandle_rate') && res.responseText.indexOf('24 小时评分数超过限制') !== -1) {
                return ('exceeded')
            } else if (res.responseText.indexOf('errorhandle_rate') && res.responseText.indexOf('您不能对同一个帖子重复评分') !== -1) {
                return ('failed')
            } else if (res.responseText.indexOf('errorhandle_rate') && res.responseText.indexOf('该帖子已无法评分') !== -1) {
                console.log(`tid:${tid} pid:${pid} 该帖子已无法评分： `+res.responseText)
                return ('expired')
            } else {
                console.log(res)
                console.log("未知错误，可反馈给脚本作者："+res.responseText)
                return ('Unknown')
            }
        })
    }

    function main(Auto=false){
        running = true
        if (Auto){
            GM_setValue(getDate()+' main','自动执行脚本')
            main_normal()
        }else{
            status = GM_getValue('Status',"Off") //检测加体力状态 防止重复运行
            if (status == "Off"){
                GM_setValue('Status',uuid)
                GM_setValue(getDate()+' main','手动执行脚本')
                main_normal()
            }else{
                GM_setValue(getDate()+' Error','手动加体力 检测到脚本重复运行'+status)
                alert(`Error\n手动加体力\nuuid: ${uuid}  status:${status}\n检测到脚本重复运行\n如脚本异常退出请手动强制复位`)
                running = false
            }
        }
    }

    async function main_normal() {
        let message = []
        let itemScores = await calcScores()
        let page =1
        let replys="init"
        let RateRecord=await GM_getValue('RateRecord',[]) //读取tid pid记录
        let i=0 //根据uid获取RateRecord存储序号
        let mark=false //正常运行标记
        let fine=true
        let 本次应加体力数=itemScores[1]
        let 本次实加体力数=0
        let 加体力前记录=itemScores[0][0].quote
        let 加体力后记录
        GM_setValue(getDate()+' normal main',version)
        status = GM_getValue('Status',"Off") //检测加体力状态 防止重复运行
        if (status == uuid){
            GM_setValue(getDate()+' itemScores',itemScores)
            if (itemScores[0].length === 0) {
                Cooldown=undefined
                GM_deleteValue('Ratetime')
                message.push('未找到正确格式的收藏帖子！\n冷却时间已清除，待体力冷却完毕后，请手动运行脚本初始冷却时间。')
                GM_setValue(getDate()+' result','未找到正确格式的收藏帖子！')
            }
            while (itemScores[0].length >0){
                if (itemScores[1] === 0) {
                    Cooldown = GM_getValue('Ratetime')+86400000+delay-new Date().getTime()
                    if (Cooldown < 0){
                        Cooldown=undefined
                        GM_deleteValue('Ratetime')
                        GM_setValue(getDate()+' Error','脚本冷却异常，当前无剩余体力！')
                        message.push('Error\n脚本冷却异常，当前无剩余体力！\n冷却时间已清除，待体力冷却完毕后，请手动运行脚本初始冷却时间。')
                    } else {
                        GM_setValue(getDate()+' result','当前无剩余体力！请稍后再尝试！')
                        message.push('当前无剩余体力！请稍后再尝试！\n')
                    }
                    break
                }else{
                    mark=true
                    body:
                    while(replys!="empty"){
                        replys = await getUserReplys(itemScores[0][0].uid, page)
                        hand:
                        while (replys!="empty" && replys.length > 0 ){
                            if (itemScores[0][0].score > 0) { //剩余体力
                                let attend = Math.min(itemScores[0][0].step, itemScores[0][0].score) //每次加体力数
                                let new_quote = formatQuote(itemScores[0][0].quote, attend)[0] //体力说明计数
                                let tid=[]
                                let pid=[]
                                if (RateRecord.length>0){
                                    i=getRateRecord(RateRecord,itemScores[0][0].uid) //读取uid记录
                                    if (i > -1){
                                        tid=RateRecord[i].tid //读取tid记录
                                        pid=RateRecord[i].pid //读取pid记录
                                    } else{
                                        RateRecord.push({uid:itemScores[0][0].uid,
                                                         tid:tid,
                                                         pid:pid})
                                        i=RateRecord.length-1
                                    }
                                    for (let n=0;n<pid.length;n++){ //对比pid记录 存在则直接跳过 减少POST
                                        if (replys[0].pid == pid[n]){
                                            replys.shift()
                                            if (!replys.length>0){
                                                break hand
                                            }
                                            n=0
                                        }
                                    }
                                }else{
                                    RateRecord=[{uid:itemScores[0][0].uid,
                                                 tid:tid,
                                                 pid:pid}]
                                    i=0
                                }
                                status = GM_getValue('Status')
                                if (status != uuid){ //最后一道检测重复运行防线
                                    GM_setValue(getDate()+' Error','uuid不匹配2 检测到脚本重复运行 status: '+status)
                                    mark=false
                                    fine=false
                                    message.push(`Error\nuuid不匹配\nuuid: ${uuid}  status:${status}\n检测到脚本重复运行\n如脚本异常退出请手动强制复位\n`)
                                    break body
                                }
                                let rate_result = await rate(replys[0].tid, replys[0].pid, attend, new_quote)
                                /*GM_setValue(getDate()+" rate_log",{replys_tid: replys[0].tid,
                                                          replys_pid: replys[0].pid,
                                                          attend: attend,
                                                          new_quote: new_quote,
                                                          rate_result: rate_result})*/
                                let log=`user: ${itemScores[0][0].username} tid: ${replys[0].tid} pid: ${replys[0].pid} score: ${attend} reason:${new_quote}`
                                if (rate_result === 'successful') {
                                    itemScores[0][0].score -= attend
                                    本次实加体力数 += attend
                                    itemScores[0][0].quote = new_quote
                                    GM_setValue('Ratetime', new Date().getTime()) //记录加体力时间
                                    Cooldown = 86400000+delay
                                    GM_setValue(getDate()+" rate",log) //记录加体力结果
                                    message.push(log+`\n`)
                                } else if (rate_result === 'exceeded') {
                                    updateQuote(itemScores[0][0].favid, itemScores[0][0].quote)
                                    GM_setValue(getDate()+' result','当前体力已全部加完!')
                                    message.push('当前体力已全部加完!\n')
                                    break body
                                } else if(rate_result === 'Unknown'){
                                    GM_setValue(getDate()+" rate_log",log+`,rate_result: ${rate_result}`)
                                    message.push(`已自动跳过异常帖（F12控制台有详细原因）:${log},rate_result: ${rate_result}\n`)
                                    console.log(log)
                                }
                                RateRecord[i].tid.unshift(replys[0].tid) //记录本次tid
                                RateRecord[i].pid.unshift(replys[0].pid) //记录本次pid
                                updateQuote(itemScores[0][0].favid, itemScores[0][0].quote) //增加POST防止漏体力
                                加体力后记录=itemScores[0][0].quote
                            }else {
                                updateQuote(itemScores[0][0].favid, itemScores[0][0].quote)
                                加体力后记录=itemScores[0][0].quote
                                break body
                            }
                            replys.shift() //加下一个体力
                        }
                        ++page
                        if(replys=="empty"){
                            message.push(`目标用户已无可加体力帖\nuser: ${itemScores[0][0].username}  uid: ${itemScores[0][0].uid}  page: ${page}\n`)
                        }
                    }
                }
                itemScores[0].shift() //加下一个收藏贴体力 *未测试存在多个收藏贴的情况 可能存在bug；如有bug可以手动多次运行
            }
            if(mark){
                GM_setValue('RateRecord',RateRecord)
                let debug_a=`本次应加体力数=${本次应加体力数}，本次实加体力数=${本次实加体力数}${本次应加体力数-本次实加体力数>0?"，似乎遗漏体力请联系作者":""}\n`
                let debug_b=`加体力前记录=${加体力前记录},加体力后记录=${加体力后记录}\n`
                GM_setValue(getDate()+' debug_a',debug_a.replace("\n",""))
                GM_setValue(getDate()+' debug_b',debug_b.replace("\n",""))
                message.push(debug_a)
                message.push(debug_b)
            }
            if(fine){
                GM_setValue('Status',"Off")
            }
            alert(message.join(''))
            if(Cooldown>0 && Timer == null && Autotime>0){ //重启倒计时冷却
                Timer = setTimeout(AutoTimer,Autotime)
                timeout = true
            }
        }else{
            clearTimeout(Timer)
            Timer = null
            timeout = false
            GM_setValue(getDate()+' Error','uuid不匹配 检测到脚本重复运行 status: '+status+' Timer_normal: '+Timer_normal)
            if(Timer_normal){
                alert(`Error\nuuid不匹配\nuuid: ${uuid}  status:${status}\n检测到脚本重复运行\n如脚本异常退出请手动强制复位\n`)
            }else{
                Timer_normal=setTimeout(main_normal,3000)
                GM_setValue(getDate()+' Timer_normal: ',Timer_normal)
            }
        }
        running = false
    }

    function getDate(){
        let d=new Date()
        return [d.getFullYear(),check(d.getMonth()+1),check(d.getDate())].join('-')+' '+[check(d.getHours()),check(d.getMinutes()),check(d.getSeconds()),check_mil(d.getMilliseconds())].join(':')+' '+uuid
    }

    function getRateRecord(RateRecord,uid){ //读取uid记录
        let i = 0
        for (let Record of RateRecord){
            if (Record.uid == uid) {
                return i
            }
            ++i
        }
        return -1
    }

    function check(val) { //优化显示体力冷却时间
        if (val < 10) {
            return ("0" + val)
        }else{
            return (val)
        }
    }

    function check_mil(val) { //优化显示体力冷却时间(毫秒)
        if (val < 10) {
            return ("00" + val)
        }else if (val<100){
            return ("0" + val)
        }else{
            return (val)
        }
    }
    function AutoTimer() { //自动加体力
        let now_time = new Date().getTime()
        Cooldown = GM_getValue('Ratetime')+86400000+delay-now_time
        let Hour = Math.floor(Cooldown/1000/3600)
        let Minute = Math.floor((Cooldown-Hour*1000*3600)/1000/60)
        let Second = Math.floor((Cooldown-Hour*1000*3600-Minute*1000*60)/1000)
        let time =[check(Hour),check(Minute),check(Second)].join(':')
        if (Cooldown <0) { //判断体力冷却是否结束
            let time_debug =new Date().getTime()
            Cooldown=GM_getValue('Ratetime')+86400000+delay-time_debug //精确冷却时间
            if (Cooldown <1){
                clearTimeout(Timer)
                Timer = null
                timeout=false
                status = GM_getValue('Status',"Off") //检测加体力状态 防止重复运行
                if (status == "Off"){
                    GM_setValue('Status',uuid)
                    main(true)
                }else{
                    GM_setValue(getDate()+' Error','自动加体力 检测到脚本重复运行')
                    alert(`Error\n自动加体力\nuuid: ${uuid}  status:${status}\n检测到脚本重复运行\n如脚本异常退出请手动强制复位`)
                }
            }else{
                location.reload()
            }
        }else if(Cooldown > 1 && Autotime > 0 ){ //体力冷却中
            if (HideAutoRate == false) { //显示体力冷却时间
                $('#autoRate').html('Autorate<br/>'+time)
            }else{
                $('#autoRate').html(time)
            }
            if(Timer == null){
                timeout = true
                Timer = setTimeout(AutoTimer,Autotime) //设置显示体力冷却时间计时器
            }
        }

        auto_refresh=now_time-init_time

        if (auto_refresh > refresh && refresh > 0){
            location.reload()
        }

        if (timeout){
            Timer = setTimeout(AutoTimer,Autotime)
        }
    }

    function views() { //初始化Autorate按钮
        let rateDiv = $('<div/>', {id: 'rateDiv'})
        let rateBtn = $('<a/>', {
            id: 'autoRate',
            html: 'Autorate',
            class: 'btn btn-user-action',
            style: 'margin-right: 10px', //从与搜索框绑定改为与消息提醒头像绑定后右边距自动缩了，原因不明
            mouseover: function () { $(this).css({'background-color': '#57bae8', 'color': '#f7f7f7'}) },
            mouseleave: function () { $(this).css({'background-color': '', 'color': ''}) },
            click: function () { panel() }}) //点击显示可视化操作面板
        rateDiv.append(rateBtn)
        $('#nav-user-action-bar').before(rateDiv) //从与搜索框绑定改为与消息提醒头像绑定 增加稳定性（可能）
    }

    function views_onload(){ //
        if ($('#nav-user-action-bar').length>0){
            views()
            clearInterval(views_Timer)
            views_Timer =null
        } else {
            ++views_times
            if(views_times==10){
                alert("Error\n脚本已运行超过10秒，Autorate按钮初始化失败。\n建议刷新页面。")
            }
        }
    }

    function panel(){
        let width=window.innerWidth //浏览器内宽度
        let height=window.innerHeight //浏览器内高度
        let z=1 //z-index累加
        if($("#setting").length>0){
            $("#setting").toggle()
        }else{
            GM_addStyle (`
.setting_div_height{height:15px!important;}
.setting_div_left{text-align:left!important;}
.setting_button{width:90px!important;white-space: nowrap!important;}
.setting_div_div{margin-top:4px!important;}
.hide_button{position:absolute!important;top:20px!important;right:20px!important;}
.div_text{line-height:15px; font-size:11px;padding:5px; clear:both; margin-top:5px;margin-left:5px;height:500px;overflow-y:auto;}
.div_logs_export{height:120px;width:500px;}
.div_cooldown_setting{height:200px;width:650px;}
.setting{position:fixed;z-index:201;left:360px;top:120px;}
.update_logs{position:fixed;z-index:201;left:320px;top:40px;}
.log_all{position:fixed;z-index:201;left:450px;top:40px;}
.log_history{position:fixed;z-index:201;left:450px;top:40px;}
.log_history_link{position:fixed;z-index:201;left:450px;top:40px;}
`)
            function addPanel(id){
                return `
<div id=${id} style="position:fixed;z-index:201;">
<table cellpadding="0" cellspacing="0"><tbody><tr><td class="t_l"></td><td class="t_c" style="cursor:move" onmousedown="dragMenu($('${id}'), event, 1)"></td>
<td class="t_r"></td></tr><tr><td class="m_l" style="cursor:move" onmousedown="dragMenu($('${id}'), event, 1)"></td>
<td class="m_c" style="width:780px;">
<span><a href="javascript:;" class="flbc" id=${id+"_hide"} >关闭</a></span>
<form id=${id+"_panel_form"}>

</form></td>
<td class="m_r" style="cursor:move" onmousedown="dragMenu($('${id}'), event, 1)"></td></tr>
<tr><td class="b_l"></td><td class="b_c" style="cursor:move" onmousedown="dragMenu($('${id}'), event, 1)"></td><td class="b_r"></td>
</tr>
</tbody>
</table>
</div>`}

            $("body").append(addPanel("setting"))
            $("#setting_panel_form").append(`<div style="line-height:20px; font-size:13px;padding:5px; clear:both; margin-top:5px;margin-left:5px;width:500px">
<b>自动加体力脚本Keylol-Autorate</b>
<div id="version">Version:</div>
增强版作者：<a href="https://keylol.com/suid-138415">DreamNya(steven026)</a> 原作者：<a href="https://keylol.com/suid-816143">ohperhaps</a><br>
Github：<a href="https://github.com/DreamNya/Keylol-Autorate">https://github.com/DreamNya/Keylol-Autorate</a><br>
Keylol：<a href="https://keylol.com/t660000-1-1">https://keylol.com/t660000-1-1</a><br>
</div>`)

            function addform(id,tittle,text,selector_id="setting_panel_form"){ //添加面板按钮
                $(`#${selector_id}`).append(`<div class="o pns"><button type="button" id="${id}">${tittle}</button><div>${text}</div></div>`)
            }

            addform("main" ,"手动执行脚本",`手动执行一次加体力操作 提示：在脚本自动弹出结果对话框前请耐心等待，切勿关闭或刷新页面以免脚本异常运行。`)
            //addform("debug_main" , "设置运行模式",`是否开始debug加体力模式 0:正常运行速度，如遇bug需自行查看控制台 1:运行速度变慢，但较稳定，适合新手，默认0。`)
            addform("update_log" , "显示更新日志",`显示脚本更新日志`)
            addform("cool" , "倒计时相关设置",`包含设置倒计时、文字、延迟、定时刷新页面等功能。`)
            addform("reset" , "脚本强制复位",`当脚本异常退出无法执行时可点击此按钮强制复位后再手动执行脚本。（手动执行前收藏说明可能需要手动修改）`)
            addform("position" , "设置面板位置",`设置刷新页面后面板位置 0:固定面板位置 1:点击关闭按钮时记录面板位置 -1:恢复默认位置(不影响是否固定)，默认0。`)
            addform("logs" , "导出体力记录",`包含导出体力文本、导出体力链接、导出调试信息。`)
            //addform("AutoLottery" , "其乐茸茸轮盘",`其乐茸茸自动轮盘功能，默认关闭。`)

            if(debug){
                addform("variable" , "自定义存储变量",`仅为方便debug 慎用 不提供说明`)
                $('#variable').on("click",function(){
                    let variable=prompt("存储变量名")
                    let value=prompt('存储变量值 注：留空为删除变量、字符串需加""')
                    if (variable!=null && variable!=""){
                        if(value==""){
                            GM_deleteValue(variable)
                        }else{
                            try{
                                GM_setValue(variable,JSON.parse(value))
                            }catch(error){
                                alert("ERROR\n"+error)
                            }
                        }
                    }
                })
            }

            $('.o.pns>button').addClass("pn pnc z setting_button") //设置div_button添加css
            $('.o.pns').addClass("setting_div_left setting_div_height") //设置div添加css
            $('.o.pns:last').removeClass("setting_div_height") //设置最后一个div移除高度css
            $('.o.pns>div').addClass("setting_div_div") //设置div_div添加css
            $('.m_c>span').addClass("hide_button") //关闭按钮添加css
            $('#version').html("Version:"+version) //显示版本号
            let left=GM_getValue('setting left',(width-$("#setting").width())/2)
            let top=GM_getValue('setting top',(height-$("#setting").height())/2)
            $('#setting').css({"position":"fixed","z-index":201,"left":left,"top":top}) //*不知道为什么这段必须通过.css()添加为style不能通过.addClass()添加为class，否则Div无法被拖动，可能和论坛的dragMenu函数有关

            logs_init()
            $('.div_logs_export>.o.pns>button').addClass("pn pnc z setting_button") //设置div_button添加css
            $('.div_logs_export>.o.pns').addClass("setting_div_left setting_div_height") //设置div添加css
            $('.div_logs_export>.o.pns:last').removeClass("setting_div_height") //设置最后一个div移除高度css
            $('.div_logs_export>.o.pns>div').addClass("setting_div_div") //设置div_div添加css
            cooldown_setting_init()
            $('.div_cooldown_setting>.o.pns>button').addClass("pn pnc z setting_button") //设置div_button添加css
            $('.div_cooldown_setting>.o.pns').addClass("setting_div_left setting_div_height") //设置div添加css
            $('.div_cooldown_setting>.o.pns:last').removeClass("setting_div_height") //设置最后一个div移除高度css
            $('.div_cooldown_setting>.o.pns>div').addClass("setting_div_div") //设置div_div添加css


            $('#setting_hide').on("click",function(){
                if(position){
                    let left_=$('#setting').css("left")
                    let top_=$('#setting').css("top")
                    if (GM_getValue('setting left') != left_){GM_setValue(`setting left`,left_)}
                    if (GM_getValue('setting top') != top_){GM_setValue(`setting top`,top_)}
                }
                $('#setting').hide()}) //设置面板关闭按钮点击事件

            $('#main').on("click",function(){main()}) //手动执行脚本点击事件

            $('#autotime').on("click",function(){ //设置倒计时点击事件
                let autotime=prompt("自定义体力冷却倒计时刷新周期，单位毫秒，0为关闭显示，默认1000。",Autotime)
                if (autotime!=null && autotime!=""){
                    if(Number(autotime)>=0){
                        autotime=Number(autotime)
                        Autotime=autotime
                        GM_setValue("Autotime", autotime)
                        clearTimeout(Timer)
                        Timer = setTimeout(AutoTimer,Autotime)
                    }else{
                        (alert("Error\n设置倒计时输入错误，请输入非负数"))
                    }
                }
            })

            function HideAutorate_(){ //倒计时名称初始化
                if(HideAutoRate){
                    $('#hideautorate').html("倒计时显示名称")
                }else{
                    $('#hideautorate').html("倒计时隐藏名称")
                }
            }
            HideAutorate_()
            $('#hideautorate').on("click",function(){ //倒计时名称点击事件
                HideAutoRate = !HideAutoRate
                GM_setValue("HideAutoRate", HideAutoRate)
                HideAutorate_()
            })

            $('#position').on("click",function(){ //设置面板位置点击事件
                let i
                if(position){i=1}else{i=0}
                let position_=prompt("设置刷新页面后面板位置 0:固定面板位置 1:点击关闭按钮时记录面板位置 -1：恢复默认位置(不影响是否固定)，默认0。",i)
                if (position_!=null && position_!=""){
                    switch(position_){
                        case "1":
                            position=true
                            GM_setValue("position", position)
                            break
                        case "0":
                            position=false
                            GM_setValue("position", position)
                            break
                        case "-1":
                            for (let log of GM_listValues()){if(log.slice(-4)=="left" || log.slice(-3)=="top"){GM_deleteValue(log)}}
                            break
                        default:
                            alert("Error\n设置面板位置输入错误，请输入0或1或-1")
                    }
                }
            })

            $('#delay').on("click",function(){ //倒计时延迟点击事件
                let delay_=prompt("自定义24小时体力冷却完毕后再次加体力时延迟，单位毫秒,最小为0，默认5000。",delay)
                if (delay_!=null && delay_!=""){
                    if(Number(delay_)>=0){
                        delay_=Number(delay_)
                        delay=delay_
                        GM_setValue("delay", delay)
                    }else{
                        (alert("Error\n倒计时延迟输入错误，请输入非负数"))
                    }
                }
            })

            $('#refresh').on("click",function(){ //定时刷新页面点击事件
                let refresh_=prompt("定时刷新论坛主页页，单位毫秒，0为不刷新，默认600000。",refresh)
                if (refresh_!=null && refresh_!=""){
                    if(Number(refresh_)>=0){
                        refresh_=Number(refresh_)
                        refresh=refresh_
                        GM_setValue("refresh", refresh)
                    }else{
                        (alert("Error\n定时刷新页面输入错误，请输入非负数"))
                    }
                }
            })

            $('#reset').on("click",function(){ //脚本强制复位点击事件
                if(GM_getValue("Status")!="Off"){
                    GM_setValue("Status","Off")
                    GM_setValue(getDate()+' reset','用户强制复位脚本')
                    alert("脚本已强制复位，已可手动执行脚本，如再次异常退出请联系作者提交异常情况。\n提示：如脚本异常退出可能需要手动修改收藏说明防止漏记体力。")}
                else{alert("脚本正常无须强制复位")}
            })

            $("#logs_text").on("click",()=>{New_Div("log_history","体力记录文本",export_log_history("text"))}) //导出体力文本点击事件

            $('#logs_link').on("click",()=>{New_Div("log_history_link","体力记录链接",export_log_history("link"))}) //导出体力链接点击事件

            $('#logs_all').on("click",()=>{New_Div("log_all","脚本调试信息",export_logs_all())}) //导出调试信息点击事件

            $('#update_log').on('click',()=>{New_Div("update_logs","更新日志",update_logs)}) //显示更新日志点击事件

            $("#logs").on("click",()=>{New_Div("logs_export")})//导出体力记录点击事件

            $("#cool").on("click",()=>{New_Div("cooldown_setting")})//倒计时相关设置点击事件

            /*$('#logs_new').on("click",()=>{NewRateRecord()})

            async function NewRateRecord(){ //导出体力记录
                let log=GM_listValues()
                let results=[]
                let RateRecord=GM_getValue('RateRecord',[])
                let already=[]
                let k=log.length-1
                for(let n=RateRecord.length-1;n>=0;n--){
                    let uid=RateRecord[n].uid
                    console.log("uid"+uid)
                    body:
                    for (let i=k;i>=0;i--){
                        if(log[i].slice(-4)=="rate"){
                            let log_value=GM_getValue(log[i])
                            let user=log_value.slice(log_value.search("user:")+6,log_value.search("tid:")-1)
                            for (let q=0;q<already.length;q++){
                                if(user==already[q]){break}
                            }
                            console.log(user)
                            let tid=log_value.slice(log_value.search("tid:")+5,log_value.search("pid:")-1)
                            let pid=log_value.slice(log_value.search("pid:")+5,log_value.search("score:")-1)
                            let reason=log_value.slice(log_value.search("reason:")+7,log_value.length)
                            let uid_ = await xhrAsync(`forum.php?mod=redirect&goto=findpost&ptid=${tid}&pid=${pid}`).then((res) => {
                                return $(`#favatar${pid} > div.pi > div > a`, res.response).attr("href") })
                            let uid__=uid_.replace(/[^\d]/g, '')
                            if(uid==uid__){
                                k=i-1
                                already.push(user)
                                RateRecord[n].user=user
                                RateRecord[n].tid=tid
                                RateRecord[n].pid=pid
                                RateRecord[n].reason=reason
                                console.log(RateRecord[n])
                                break body
                            }
                        }
                    }
                }
                //return results
            }*/



            function logs_init(){ //初始化logs
                let div_id="logs_export"
                New_Div(div_id,"导出体力记录")
                addform("logs_text" , "导出体力文本",`以文本形式导出所有存储在本地的加体力记录。`,div_id+"_text")
                addform("logs_link" , "导出体力链接",`以链接形式导出所有存储在本地的加体力记录。`,div_id+"_text")
                addform("logs_all" , "导出调试信息",`导出所有存储在本地的脚本运行调试信息，包含加体力记录文本。`,div_id+"_text")
                //addform("logs_new" , "导出体力记录",`RateRecord`,div_id+"_text")
                $(`#${div_id}`).hide()
            }

            function cooldown_setting_init(){ //初始化cool
                let div_id="cooldown_setting"
                New_Div(div_id,"冷却倒计时相关设置")
                addform("autotime" , "设置倒计时",`自定义体力冷却倒计时刷新周期，单位毫秒，0为关闭显示，默认1000。`,div_id+"_text")
                addform("hideautorate" , "初始化失败",`体力冷却倒计时时显示或隐藏Autorate文字 隐藏:hh:mm:ss / 显示:Autorate hh:mm:ss`,div_id+"_text")
                addform("delay" , "倒计时延迟",`自定义24小时体力冷却完毕后再次加体力时延迟，单位毫秒，最小为0，默认5000。`,div_id+"_text")
                addform("refresh" , "定时刷新页面",`定时刷新论坛主页，单位毫秒，0为不刷新，默认600000。`,div_id+"_text")
                $(`#${div_id}`).hide()
            }

            function export_log_history(method){ //导出体力记录
                let logs_=GM_listValues()
                let results=[]
                for (let log of logs_){
                    if(log.slice(-4)=="rate"){
                        let log_value=GM_getValue(log)
                        let tid=log_value.slice(log_value.search("tid:")+5,log_value.search("pid:")-1)
                        let pid=log_value.slice(log_value.search("pid:")+5,log_value.search("score:")-1)
                        switch (method){
                            case "link":
                                results.unshift(`<a href=https://keylol.com/forum.php?mod=redirect&goto=findpost&ptid=${tid}&pid=${pid}>https://keylol.com/forum.php?mod=redirect&goto=findpost&ptid=${tid}&pid=${pid}</a>\n`)
                                break
                            case "text":
                                results.unshift(`<a href=https://keylol.com/forum.php?mod=redirect&goto=findpost&ptid=${tid}&pid=${pid}>${log} : ${log_value}</a>\n`)
                                break
                        }
                    }
                }
                return results
            }

            function export_logs_all(){ //导出调试信息
                let logs_=GM_listValues()
                let results=[]
                for (let log of logs_){
                    let log_string=GM_getValue(log)
                    if(typeof log_string == "object"){log_string=JSON.stringify(log_string).replace(/,/g,",\n").replace(/\[/g,"[\n").replace(/\{/g,"{\n")} //object对象文本化
                    results.push(log+" : "+log_string+"\n")
                }
                return results
            }

            function New_Div(id,tittle,text){ //初始化Div
                if($(`#${id}`).length>0){
                    if(!$(`#${id}`).hasClass("z-index")){
                        let left=GM_getValue(`${id} left`,(width-$(`#${id}`).width())/2)
                        let top=GM_getValue(`${id} top`,(height-$(`#${id}`).height())/2)
                        $(`#${id}`).css({"position":"fixed","z-index":201+z++,"left":left,"top":top})//Div窗口添加css
                    }
                    $(`#${id}`).css("z-index",201+z++)
                    $(`#${id+"_text"}`).html(text) //动态更新文本
                    $(`#${id}`).toggle()
                }else{
                    $("body").append(addDiv(id)) //添加Div窗口
                    $(`#${id+"_em"}`).html(tittle) //显示标题
                    $(`#${id+"_text"}`).html(text) //显示文本
                    if(text!=undefined){
                        $(`#${id+"_text"}`).addClass("div_text")//文本添加css
                        $(`#${id}`).css({"position":"fixed","z-index":201+z++}) //*此处必须分段先设置position,$().width()才能正常获取宽度，原因未知可能与css有关
                        left=GM_getValue(`${id} left`,(width-$(`#${id}`).width())/2)
                        top=GM_getValue(`${id} top`,(height-$(`#${id}`).height())/2)
                        $(`#${id}`).css({"left":left,"top":top})
                    }else{
                        $(`#${id+"_text"}`).addClass("div_"+id)
                    }
                    $(`#${id+"_hide"}`).on("click",function(){ //关闭按钮点击事件
                        if(position){
                            let left_=$(`#${id}`).css("left")
                            let top_=$(`#${id}`).css("top")
                            if (GM_getValue(`${id} left`) != left_){GM_setValue(`${id} left`,left_)}
                            if (GM_getValue(`${id} top`) != top_){GM_setValue(`${id} top`,top_)}
                        }
                        $(`#${id}`).hide()})
                }
            }

            function addDiv(id){ //添加Div窗口
                return `
<div id="${id}">
<table cellpadding="0" cellspacing="0"><tbody><tr><td class="t_l"></td><td class="t_c" style="cursor:move" onmousedown="dragMenu($('${id}'), event, 1)"></td>
<td class="t_r"></td></tr><tr><td class="m_l" style="cursor:move" onmousedown="dragMenu($('${id}'), event, 1)"></td>
<td class="m_c"><h3 class="flb" style="cursor: move;" onmousedown="dragMenu($('${id}'), event, 1)">
<em id="${id+"_em"}"></em>
<span><a href="javascript:;" class="flbc" id="${id+"_hide"}" >关闭</a></span>
</h3><form><div class="pbt cl">
<pre id="${id+"_text"}"></pre>
</div></form></td><td class="m_r" style="cursor:move" onmousedown="dragMenu($('${id}'), event, 1)"></td></tr>
<tr><td class="b_l"></td><td class="b_c" style="cursor:move" onmousedown="dragMenu($('${id}'), event, 1)"></td><td class="b_r"></td></tr></tbody></table></div>`
            }
        }
    }
})();