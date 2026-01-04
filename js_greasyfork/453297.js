// ==UserScript==
// @name         moso Userscript
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  云班课助手
// @author       ygy
// @match        https://www.mosoteach.cn/web/index.php?*
// @require      https://cdn.staticfile.org/jquery/2.1.3/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mosoteach.cn
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @connect      43.138.68.195
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453297/moso%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/453297/moso%20Userscript.meta.js
// ==/UserScript==

(function (events, handler) {
    'use strict';
    // 结构有问题，需要大更新。。。
    // let test_str = "id=334CC103-F382-417E-B50C-892C69583AE8&clazz_course_id=5AB5BA55-1EC5-11ED-8539-1C34DA7B3F7C&data=%5B%7B%22id%22%3A%22437F600F-5E0F-4D20-96DB-4D9BAA81E0D1%22%2C%22type%22%3A%22MULTI%22%2C%22proof_attachments%22%3A%5B%5D%2C%22answers%22%3A%5B0%2C1%2C2%5D%7D%2C%7B%22id%22%3A%223E4A258C-C6D9-42E1-9973-F39FC6B1625E%22%2C%22type%22%3A%22SINGLE%22%2C%22proof_attachments%22%3A%5B%5D%2C%22answers%22%3A%5B0%5D%7D%2C%7B%22id%22%3A%221FE91947-2DF4-4F11-B430-3A6A1C070FF1%22%2C%22type%22%3A%22SINGLE%22%2C%22proof_attachments%22%3A%5B%5D%2C%22answers%22%3A%5B2%5D%7D%2C%7B%22id%22%3A%22E0D8C972-5B9D-495B-9698-E14218A91AC0%22%2C%22type%22%3A%22SINGLE%22%2C%22proof_attachments%22%3A%5B%5D%2C%22answers%22%3A%5B0%5D%7D%2C%7B%22id%22%3A%2283BB5152-0CF9-4DE2-BA46-5084E407CD0A%22%2C%22type%22%3A%22MULTI%22%2C%22proof_attachments%22%3A%5B%5D%2C%22answers%22%3A%5B0%2C2%2C1%5D%7D%2C%7B%22id%22%3A%22E9E347FA-026A-4A54-A1CA-D2F566110846%22%2C%22type%22%3A%22SINGLE%22%2C%22proof_attachments%22%3A%5B%5D%2C%22answers%22%3A%5B1%5D%7D%2C%7B%22id%22%3A%2281F498A5-0F34-4D11-8549-ACB6345DA188%22%2C%22type%22%3A%22SINGLE%22%2C%22proof_attachments%22%3A%5B%5D%2C%22answers%22%3A%5B2%5D%7D%2C%7B%22id%22%3A%22C0E3D79A-83A2-41D7-A24E-6149E6E2EE75%22%2C%22type%22%3A%22SINGLE%22%2C%22proof_attachments%22%3A%5B%5D%2C%22answers%22%3A%5B0%5D%7D%2C%7B%22id%22%3A%2247806244-94E6-48DB-B9CE-EB5CE0D5C0C4%22%2C%22type%22%3A%22SINGLE%22%2C%22proof_attachments%22%3A%5B%5D%2C%22answers%22%3A%5B0%5D%7D%2C%7B%22id%22%3A%22AC5C0BB1-6D10-44B8-9B84-3B769A13A7B6%22%2C%22type%22%3A%22SINGLE%22%2C%22proof_attachments%22%3A%5B%5D%2C%22answers%22%3A%5B1%5D%7D%2C%7B%22id%22%3A%227ADD5D43-046D-4D50-90BB-41E2BD22F0C1%22%2C%22type%22%3A%22SINGLE%22%2C%22proof_attachments%22%3A%5B%5D%2C%22answers%22%3A%5B1%5D%7D%2C%7B%22id%22%3A%221D67A5DA-8D01-425A-8338-47D9E638CB04%22%2C%22type%22%3A%22SINGLE%22%2C%22proof_attachments%22%3A%5B%5D%2C%22answers%22%3A%5B0%5D%7D%2C%7B%22id%22%3A%226CCFA8BB-3784-408C-87E5-21A77F3CE1C5%22%2C%22type%22%3A%22MULTI%22%2C%22proof_attachments%22%3A%5B%5D%2C%22answers%22%3A%5B1%2C5%5D%7D%2C%7B%22id%22%3A%22723BF8DC-CB38-4B21-9855-92712161CC6C%22%2C%22type%22%3A%22MULTI%22%2C%22proof_attachments%22%3A%5B%5D%2C%22answers%22%3A%5B3%2C1%2C0%5D%7D%2C%7B%22id%22%3A%22345F3ABB-364D-40D2-AA5B-FE3D141900E9%22%2C%22type%22%3A%22SINGLE%22%2C%22proof_attachments%22%3A%5B%5D%2C%22answers%22%3A%5B0%5D%7D%5D"


    let request_str = false
    let reslist = []
    let inputlist = []
    let delay = 500
//     劫持xhr请求，若匹配到了请求参数，赋值到request_str,转msgAction
    let hookXhrSend=unsafeWindow.XMLHttpRequest.prototype.send
    unsafeWindow.XMLHttpRequest.prototype.send=function(body){
        if (body!=null){
            // let regExp = /^id=[0-9a-zA-Z-]*&clazz_course_id=[0-9a-zA-Z-]*&data=[0-9a-zA-Z-%_]*$/
            if (checkBody(body) == true){
                console.log("get it!!!!")
                console.log(body)
                request_str=body
                setTimeout(msgAction,2000)
            }else{
                console.log("no...")
            }
        }
        hookXhrSend.apply(this,[body]);
    }
    let host_url="43.138.68.195"
    let host_port=8080
//     接收题库状态对象
    let QuesBankStatus={
        createNew:function(obj){
                let quesBankStatus={}
                quesBankStatus.fullMarks=obj.fullMarks,
                quesBankStatus.maxMarks=obj.maxMarks,
                quesBankStatus.submitUserNum=obj.submitUserNum,
                quesBankStatus.parseLog = function(){
                let str = ""
                str = "是否满分："
                quesBankStatus.fullMarks==true?str+="是":str+="否"
                str += "：最高分："+quesBankStatus.maxMarks
                str += "：提交人数："+quesBankStatus.submitUserNum
                return str
            }
            return quesBankStatus
        }
    }

    // 添加助手按钮
    function insertTabBtn() {
        console.log("begin insertTabBtn")
        let $userInfo = $('#menu-content')

        let $btn1 = $('<span><input id="queryBtn" type="button"  value="题库状态" ></span>')
        let $btn2 = $('<span><input id="writeBtn1" type="button"  value="答案导入"></span>')
        let $btn3 = $('<span><input id="writeBtn2" type="button"  value="完成资源"></span>')
        let $btn4 = $('<span><input id="imgBtn" type="button"  value="获取截图" ></span>')

        let $logSpan = $('<span id="logSpan"></span>')

        $userInfo.append($btn1)
        $userInfo.append($btn2)
        $userInfo.append($btn3)
        $userInfo.append($btn4)
        $userInfo.append($logSpan)
    }
// 插入对话框，反应提交题库信息
    function insertSubmitLog(){
        let $submitLog = $("<span id='submitLog'>hello!</span>")
        $('.el-message-box .el-button.el-button--default.el-button--small.el-button--primary').before($submitLog)
    }
// 查询题库状态
    function queryStat() {
        let id = getId()
        if (id == false){
            return false
        }
        showLog("查询题库状态。。。")
        GM_xmlhttpRequest({
            method: "get",
            url: 'http://'+host_url+":"+host_port+'/moso/status/'+id,
            data: {},
            timeout: 3000,
            onload: function(res){
                if (res.status==200){
                    let jsonObj = JSON.parse(res.response)
                    console.log(jsonObj)
                    if (jsonObj.data == null){
                        showLog("题库为空！")
                        return false
                    }
                    let statusObj = QuesBankStatus.createNew(jsonObj.data)
                    showLog(statusObj.parseLog())
                }else{
                    showLog("error!")
                    return false
                }
            },
            onerror: function(){
                showLog("服务器掉线？！")
            },
            ontimeout: function(){
                let opt = confirm("您似乎开启了网络代理，请关闭代理后点击确认按钮重试。。。")
                showLog("请求超时！")
                if (opt == true){
                    queryStat()
                }
            }
        });
    }
    function actInputlist(){
        if (inputlist.length <= 0){
            showLog("作答结束！")
            return true
        }
        setTimeout(()=>{
            let input = inputlist.shift()
            showLog("正在作答第"+(input.idx+1)+"题。。。。")
            if (input.iType == "SINGLE"||input.iType == "MULTI"){
                input.item.click()
            }else if (input.iType == "FILL"){
                input.item.click()
                input.item.value = input.iValue
            }
            actInputlist()
        }, delay)
    }
    function writeAns(data,score){
        let conMsg = ""
        if (score != ""){
            conMsg = "本答案分值："+score+"分。"
        }else{
            conMsg = "本答案分数未知！"
        }
        conMsg += "是否导入？"
        let opt = confirm(conMsg)
        if (opt == false){
            alert('已取消导入。。。')
            return false
        }
        let $topicItems = $('.con-list>.topic-item')
        showLog('此页面共'+$topicItems.length+"道题，开始作答。。。。。。")
        let mapObj = new Map()
        for (let i=0;i<data.length;i++){
            mapObj.set(data[i].id,data[i])
        }
        let inputList = []
        for (let i=0;i<$topicItems.length;i++){
            // $elt是一个topic-item
            let $elt = $($topicItems[i])
            // 获取题目的id值
            let id = $elt.children('a')[0].name
            // 获取题目类别
            let type = $elt.children('.t-con').children('.t-info').children('div')[0].className.split(" ")[1]

            let $inputs = $($elt.children('.t-con').children('div')[2]).find('input')
            if ($inputs.length <= 0){
                showLog("未获得题目选项数据！",pre_str)
                break
            }
            let ansData = mapObj.get(id)
            if (type == "SINGLE"||type == "MULTI"){
                let ans = ansData.answers
                for (let j=0;j<$inputs.length;j++){
                    if (ans.includes(parseInt($inputs[j].value))){
//                         是答案而且没被点
                        if ($inputs[j].checked == false){
                            inputList.push({
                                idx: i,
                                item: $inputs[j],
                                iType: type,
                                iValue: ""
                            })
                            if (type == "SINGLE"){
                                break
                            }
                        }
                    }else{
//                         不是答案但被点了
                        if ($inputs[j].checked == true){
                            inputList.push({
                                idx: i,
                                item: $inputs[j],
                                iType: type,
                                iValue: ""
                            })
                        }
                    }
                }
            }else if (type == "FILL"){
                let blk = ansData.blanks
                for (let j=0;j<$inputs.length;j++){
                    // 填空题应该也行，就是要用map存
                    inputList.push({
                        idx: i,
                        item: $inputs[j],
                        iType: type,
                        iValue: blk[j].content
                    })
                }
            }
        }
        inputlist = inputList
        return actInputlist()
    }
// 一键导入
    function getDirectAns(){
        let id = getId()
        if (id == false){
            return false
        }
        let $topicItems = $('.con-list>.topic-item')
        if ($topicItems.length <= 0){
            showLog('此页面未查询到题目内容！')
            return false
        }
        if ($topicItems.length != data.length){
            showLog('答案题目数和此页面题目数不等！')
            return false
        }
        showLog("正在尝试获取结果。。。")
        GM_xmlhttpRequest({
            method: "get",
            url: 'http://'+host_url+":"+host_port+'/moso/'+id+'/1',
            data: {},
            timeout: 3000,
            onload: function(res){
                if (res.status==200){
                    let jsonObj = JSON.parse(res.response)
                    if (jsonObj.data == null){
                        showLog("答案为空！")
                        return false
                    }
                    let ansData = jsonObj.data.data
                    let ansScore = jsonObj.data.score
                    if (ansScore == undefined){
                        ansScore = ""
                    }
                    console.log(jsonObj.data.data)
                    console.log(jsonObj.data.score)
                    // showLog("成功，请在控制台查看")
                    // 取消函数返回
                    return writeAns(ansData,ansScore)
                }else{
                    showLog("服务器未正常响应!响应码："+res.status)
                    return false
                }
            },
            onerror: function(){
                showLog("服务器掉线？！")
                return false
            },
            ontimeout: function(){
                let opt = confirm("您似乎开启了网络代理，请关闭代理后点击确认按钮重试。。。")
                showLog("请求超时！")
                if (opt == true){
                    getDirectAns()
                }
            }
        });
    }
    // 若确实是成绩结算界面，准确无误就提交
    function msgAction(){
        let msgTitle = $('.el-message-box > .el-message-box__header > .el-message-box__title > span').text()
        let $subBtn = $('.el-message-box > .el-message-box__btns > button')
        console.log(msgTitle)
        if (msgTitle == "提交答案"){
            $subBtn.attr('disabled',true)
            insertSubmitLog()
            let score = getScore()
            let user_id = getUserId()
            let allScore = getAllScore()
            if (score == false || user_id == false){
                showSubLog('分数或学生id为空！')
                $subBtn.attr('disabled',false)
                return false
            }
            if (allScore == false){
                showSubLog('未查询到总分！')
                $subBtn.attr('disabled',false)
                return false
            }
            if (score == "-1"){
                showSubLog('本次不是最佳成绩！')
                $subBtn.attr('disabled',false)
                return false
            }
            let isFullMarks = getIsFullMarks(score,allScore)
            postAns(request_str,score,user_id,isFullMarks,$subBtn)
        }else {
            return false
        }
    }
// 提交自己答案
    function postAns(str,score,user_id,isFullMarks,$btn){
        if (str == null || str == ""){
            showSubLog("未获取题目信息！")
            return false
        }
        let request_json = parseJsonObj(str)
        request_json.score = score
        request_json.user_id = user_id
        request_json.isFullMarks = isFullMarks
        console.log(request_json)
        showSubLog("正在尝试上传。。。")
        GM_xmlhttpRequest({
            method: "post",
            url: 'http://'+host_url+":"+host_port+'/moso/',
            headers: {"Content-Type": "application/json;charset=UTF-8"},
            data: JSON.stringify(request_json),
            timeout: 3000,
            onload: function(res){
                if (res.status==200){
                    let jsonObj = JSON.parse(res.response)
                    showSubLog(jsonObj.msg)
                }else{
                    showSubLog("服务器未正常响应!响应码："+res.status)
                }
                $btn.attr('disabled',false)
            },
            onerror: function(){
                showSubLog("服务器掉线？！")
                $btn.attr('disabled',false)
            },
            ontimeout: function(){
                let opt = confirm("您似乎开启了网络代理，请关闭代理后点击确认按钮重试。。。")
                showLog("请求超时！")
                if (opt == true){
                    postAns(str,score,user_id,isFullMarks,$btn)
                }else{
                    $btn.attr('disabled',false)
                }
            }
        });
    }
//     测试服务器连通性
    function testServer(){
        GM_xmlhttpRequest({
            method: "get",
            url: 'http://'+host_url+":"+host_port+'/moso/test',
            data: {},
            timeout: 3000,
            onload: function(res){
                alert("服务器连接成功！")
                console.log(res.data)
            },
            onerror: function(){
                alert("服务器掉线？！")
                showLog("请求失败！")
            },
            ontimeout: function(){
                alert("您疑似开启了网络代理！\n为了能正常使用此脚本请关闭代理软件！")
                showLog("请求超时！")
            }
        });
    }
//     开始一键资源完成
    function compRes() {
        var ask = getJson(window.location.href)
        if (ask.clazz_course_id && ask.c == "res") {
            var resList = []
            let $resAll = $(".res-row-open-enable")
            for(let i=0; i<$resAll.length;i++){
                let $ele = $($resAll[i])
                console.log($ele.find('span[data-is-drag]')[0].dataset.isDrag)
                // return true
                if ($ele.find('span[data-is-drag]')[0].dataset.isDrag == "N") {
                    console.log($ele.attr('data-mime'))
                    resList.push({
                        id: $ele.attr('data-value'),
                        state: $ele.find('span[data-is-drag]')[0].dataset.isDrag,
                        type: $ele.attr('data-mime')
                    })
                }
            };
            reslist = resList
            console.log(reslist)
            if (reslist.length != 0) {
                let opt = confirm("还有"+reslist.length+"个资源没有完成，是否一键完成？")
                if (opt == true){
                    do_res()
                }else{
                    alert("已取消")
                    return true
                }
            } else {
                showLog("所有资源已完成。。。")
                return true
            }
        }else{
            showLog("不是资源页面！")
        }

    }
//     资源处理阶段
    function do_res() {
        $("#writeBtn2").attr("disabled", true)
        var watch = reslist[0]
        var req = {}
        if (reslist.length != 0) {
            showLog("剩余" + reslist.length + "个")
        } else {
            showLog("已全部完成")
            location.reload()
            return true
        }
        var clazz_course_id = getJson(window.location.href).clazz_course_id
        $.ajax({
            type: "POST",
            url: "https://www.mosoteach.cn/web/index.php?c=res&m=request_url_for_json",
            data: {
                'file_id': watch.id,
                'type': 'VIEW',
                'clazz_course_id': clazz_course_id
            },
            dataType: "json",
            success: msg => {
                const src = msg.src
                if (src.indexOf("m3u8") > -1) {
                    fetch(src)
                        .then(data => data.text())
                        .then(text => {
                            let time = 0
                            for (let i of text.split("\n")) {
                                if (i.indexOf("#EXTINF:") > -1) {
                                    i = parseFloat(i.replace("#EXTINF:", ""))
                                    time += i
                                }
                            }
                            time = Math.ceil(time)
                            $.ajax({
                                type: 'post',
                                dataType: 'json',
                                url: 'https://www.mosoteach.cn/web/index.php?c=res&m=save_watch_to',
                                data: {
                                    clazz_course_id: clazz_course_id,
                                    res_id: watch.id,
                                    watch_to: time,
                                    duration: time,
                                    current_watch_to: time
                                },
                                success: res => {
                                    reslist.splice(0, 1)
                                    do_res()
                                }
                            });
                        })
                } else {
                    reslist.splice(0, 1)
                    do_res()
                }
            }
        })
    }
//     保存cc-main的页面截图
    function saveMainImg(){
        // console.log(getYMD())
        let ele = undefined
        if ($('#cc-main').length > 0){
            ele = $('#cc-main')[0]
        }else if($('.con-list').length > 0){
            ele = $('.con-list')[0]
        }else if($('#app').length > 0){
            ele = $('#app')[0]
        }
        console.log(ele)
        if (ele == undefined){
            showLog("获取主页面失败！")
            return false
        }
        showLog("获取主页面成功！正在尝试截图。。。")
        canvaSave(ele,getImgName(getYMD),$('#imgBtn'))
    }
    function canvaSave(element, file_name, $btn){
        $btn.attr('disabled',true)
        html2canvas(element,{
            useCORS: true,
            allowTaint: true
        }).then(canvas => {
            canvas.toBlob(blob => {
                saveAs(blob, file_name)
            })
            $('#imgBtn').attr('disabled',false)
            showLog("截图已保存！")
        });
    }
    function getImgName(callback = () => {return 'test'} ,type='.jpg'){
        return callback() + type
    }
//     url转对象
    function getJson(url) {
        if(url.indexOf("?")!=-1){
           var arr = url.split('?')[1].split('&')
           var theRequest = new Object();
           for (var i = 0; i < arr.length; i++) {
            var kye = arr[i].split("=")[0]
            var value = arr[i].split("=")[1]
            theRequest[kye] = value
           }
           return theRequest;
        }else{
            return {
                c:'clazzcourse',
                m:'index'
            }
        }
    }
//     生成uuid
    function getUUID() {
        let s = [];
        let hexDigits = "0123456789ABCDEF";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        let uuid = s.join("");
        showLog(uuid)
        return uuid;
    }
    function checkUUID(uuid){
        let pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/
        return pattern.test(uuid)
    }
    function checkBody(body){
        let pattern = /^id=[0-9a-zA-Z-]*&clazz_course_id=[0-9a-zA-Z-]*&data=[0-9a-zA-Z-%_]*$/
        return pattern.test(body)
    }
//         拦截请求的body转json对象
    function parseJsonObj(str){
        let s = unescape(str);
        let regExp = /([a-zA-Z0-9-_]*)([=&])/g
        s = s.replace(regExp,"\""+"$1"+"\""+"$2")
        s = s.replaceAll("=",":")
        s = s.replaceAll("&",",")
        s = "{"+s+"}"
        return JSON.parse(s)
    }
//     获取本页的考试id
    function getId(){
        showLog("查询测试id中。。。")
        let href = unsafeWindow.location.href
        // console.log(href)
        let regExp = /&id=([0-9A-Z-]*)/
        let res = href.match(regExp)
        // console.log(res)
        if (res==null||res.length!==2){
            showLog("未找到测试id！")
            return false
        }else {
            showLog("测试id为："+res[1])
            return res[1]
        }
    }
//     找到蓝色的数字，就是最高分
    function getScore(){
        let len = $('.el-message-box .el-message-box__message > p > span').length
//         若为2，则这次没最高分高
        if (len <= 0){
            return false
        }
        if (len == 1){
            let score = $('.el-message-box .el-message-box__message > p > .light-bold').text()
            console.log("score="+score)
            return score
        }else{
            return "-1"
        }
    }
//     获取学生id，准备弄个setValue啥的
    function getUserId(){
        let user_id = GM_getValue("moso_user_id")
        if (user_id == undefined || (checkUUID(user_id) == false)){
            user_id = getUUID()
            GM_setValue("moso_user_id",user_id)
        }
        console.log('user_id='+user_id)
        return user_id
    }
//     获取总分数
    function getAllScore(){
        let len = $('.all-score-big').length
        if (len == 1){
            let allScore = $('.all-score-big').text()
            console.log('allScore='+allScore)
            return allScore
        }
        return false
    }
    function getIsFullMarks(score,allScore){
        let isFullMarks = false
        if (score == allScore){
            isFullMarks = true
        }
        console.log(isFullMarks)
        return isFullMarks
    }
    function getYMD(){
        let time = new Date()
        let y = time.getFullYear()
        let m = time.getMonth() + 1
        let d = time.getDate()
        m = m<10 ? '0'+m : m
        d = d<10 ? '0'+d : d
        return y+''+m+''+d
    }
//     显示信息的东西
    function showLog(log,prefix=''){
        $('#logSpan').text(prefix+log)
    }
    function showSubLog(log,prefix=''){
        $('#submitLog').text(prefix+log)
    }
//     延迟执行，等页面加载完
    function scriptBegin(){
        insertTabBtn()
        // 绑事件
        $('#queryBtn').on('click', queryStat)
        $('#writeBtn1').on('click', getDirectAns)
        $('#writeBtn2').on('click', compRes)
        $('#imgBtn').on('click', saveMainImg)
        // $('#writeBtn2').on('click', testServer)
        // $('#testBtn').on('click', {str: test_str}, postAns)
//         测试服务器连通性
        // testServer()

    }
    setTimeout(scriptBegin,1000)


    // Your code here...
})();