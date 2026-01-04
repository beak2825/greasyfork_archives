// ==UserScript==
// @name         网址监控通知
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  监控是否跳转到特殊网址，如果跳转则通过webhook（飞书等）通知，可用于登录失效识别等
// @author       Austin.Young
// @match        *
// @include      *
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      self
// @connect      localhost
// @connect      www.feishu.cn
// @connect      open.feishu.cn
// @connect      *  // 不支持 * 匹配
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/492515/%E7%BD%91%E5%9D%80%E7%9B%91%E6%8E%A7%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/492515/%E7%BD%91%E5%9D%80%E7%9B%91%E6%8E%A7%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==
let webHookList = []
let matchUrlList = []
let historyList = []
let detectDelay = 1000;
const preIdName = 'austinConfig_';

(function () {
    'use strict';
    const menu_command_id_1 = GM_registerMenuCommand("设置通知规则", function (event) {
        addConfig()
    }, {
        accessKey: "U",
        autoClose: true
    });
    // 进行检测
    getPara();
    setTimeout(detectUrl,detectDelay);
})();
var newElement =null,myshadowRoot =null;
function getDom(){
    let dom;
    if(myshadowRoot!=null){
        dom = myshadowRoot
    }else{
        dom = document
    }
    return dom
}
// 所有对象增加 austinConfig 前缀
function $(id,ignore) {
    let domId = preIdName + id
    let obj = getDom().getElementById(domId)
    if (obj == null) {
        if(ignore)
        {
            // 忽略提醒，返回失败
            return false
        }
        alert('找不到DOM对象:' + domId)
        return {};
    }
    return obj
}
function addConfig() {
    if(newElement!=null)return;// 已经创建过
    newElement = document.createElement("div");
    // 创建 Shadow Root
    // myshadowRoot = document.body.attachShadow({ mode: 'open' });
    // myshadowRoot.appendChild(newElement)
    // newElement.style.color="black"
    // newElement.style.textAlign="left"
    // newElement.style.padding="2px"
    // newElement.style.margin="0px"
    newElement.style.all ="initial"
    myshadowRoot = newElement.attachShadow({ mode: 'closed' });
    myshadowRoot.innerHTML = `
    <div style="inset: 10% auto auto 20%; border: 1px solid black;
    margin: 0px; max-height: 95%; opacity: 1;
    position: fixed; display: block;
    min-width: 320px;width:60%;max-width: 95%;
    z-index: 2147483647; overflow: auto; padding: 0px;" id="Panel">
        <div
            style="padding: 2px; background-color: rgb(49, 49, 49);color: #c7ed1c;font-weight: bold;font-size:large; text-align: center;line-height: 26px;">
            参数设置
            <div style="float:right;">
                <span style="border:1px white solid;cursor: pointer;" id="Refresh" title="刷新">🔁</span>
                <span style="border:1px white solid;cursor: pointer;" id="Save" title="保存">✔️</span>
                <span id="Close"
                    style="border:1px white solid;cursor: pointer;" title="关闭">❌</span>
            </div>
        </div>
        <div style="overflow: auto;height: 600px;width: 100%;background-color:aliceblue;">
            <div style="padding: 2px;">
                <div style="font-weight: bold;">页面载入后延时<input type="number" id="btDelay" min="0" step="1000" placeholder="毫秒数" style="width:5em"/>毫秒检测</div>
                <hr/>
                <div style="font-weight: bold;">通知参数 <input type="button" id="btNoticeList" value="显示/修改通知JSON"></div>
                举例 [{"name":"飞书","url":"https://open.feishu.cn/open-apis/bot/xxx","text":"[过期]url:{Url},监控:{MatchName}"}]
                <table border="1" style="border-collapse: collapse;">
                    <thead style="background-color:rgb(49, 49, 49);font-weight: bold;color: white;">
                        <td>序号</td>
                        <td>通知名称(name,不能重复)</td>
                        <td>Webhook地址(url)</td>
                        <td>发送内容(text,发送的内容,{MatchName}=监控名称,{Url}=当时访问的网址)</td>
                        <td>操作</td>
                    </thead>
                    <tbody id="NoticeShow"></tbody>
                </table>
                <textarea id="txtNoticeList" style="display: none;" cols="100" rows="7"
                    placeholder='JSON格式数组，如下:&#10;[{"name":"飞书","url":"https://www.feishu.cn/xxx","text":"机器人"}]'></textarea>
                <hr />
                <div style="font-weight: bold;">网址监控参数 <input type="button" id="btMatchList" value="显示/修改监控JSON"></div>
                举例 [{"name":"京东","type":0,"strMatch":"passport.jd.com/new/login.aspx","notice":"飞书"}]
                <table border="1" style="border-collapse: collapse;">
                    <thead style="background-color:rgb(49, 49, 49);font-weight: bold;color: white;">
                        <td>序号</td>
                        <td>监控名称(name)</td>
                        <td>处理类型(type,0=包含,1=正则)</td>
                        <td>匹配内容(strMatch,字符串或正则表达式)</td>
                        <td>通知名(notice,对应的通知名称)</td>
                    </thead>
                    <tbody id="UrlMatch"></tbody>
                </table>
                <textarea id="txtMatchUrlList" style="display: none;" cols="100" rows="7"
                    placeholder='JSON格式数组，类型参数 0 为字符串包含匹配，1为正则匹配。如下:&#10;[{"name":"名称","type":0,"strMatch":"https://www.feishu.cn/xxx","notice":""}]'></textarea>
                <hr />
                <div style="font-weight: bold;">最近消息列表(保留最近50次) <input type="button" id="btClear" value="清空历史"><br/></div>
                <textarea id="txtLastMsg" cols="100" rows="9" readonly="readonly"></textarea>
            </div>
        </div>
    </div>
`.replace(/id="(.*?)"/g, 'id="' + preIdName + '$1"')  // 全部临时替换为
    document.body.appendChild(newElement);
    $('Save').onclick = function () {
        if(saveConfig()){
            closeIt()
        }
    }
    $('Close').onclick = closeIt
    $('Refresh').onclick = function () {
        closeIt()
        addConfig()
        return;
    }
    getPara()
    showNoticeList(webHookList)
    showMatchList(matchUrlList)
    $('btDelay').value = detectDelay
    $('txtLastMsg').value = JSON.stringify(historyList, null, 2)
    $('btClear').onclick = function(){
        if(confirm('确认清空历史记录?'))
        {
            historyList = []
            GM_setValue(preIdName + 'History', historyList);
            $('txtLastMsg').value = JSON.stringify(historyList, null, 2)
        }
    }
    $('btNoticeList').onclick = NoticeList
    $('btMatchList').onclick = MatchList
}
function closeIt() {
    document.body.removeChild(newElement);
    newElement = null
    myshadowRoot =null
}
function NoticeList() {
    checkList('txtNoticeList', webHookList, showNoticeList)
}
function MatchList() {
    checkList('txtMatchUrlList', matchUrlList, showMatchList)
}
function checkList(objId, objList, fun) {
    let list = $(objId)
    if (list.style.display == 'none') {
        list.style.display = ''
        if (objList.length > 0) {
            list.value = JSON.stringify(objList,null,2)
        } else {
            list.value = ''
        }
    } else {
        list.style.display = 'none'
        // 显示为列表
        fun(list.value)
    }
}
// 检查入参是否是合法json，并修改入参数组
function checkJson(val) {
    let arr = []
    if (typeof val == 'string') {
        if (val.trim() == '') {
            val = '[]'
        }
        try {
            arr = JSON.parse(val)
        } catch (e) {
            alert('转换通知JSON异常！\n' + e)
            return { arr, res: false }
        }
    } else {
        arr = val
    }
    return { arr, res: true }
}
function showNoticeList(val) {
    let obj = checkJson(val)
    if (!obj.res) return
    webHookList = obj.arr
    let bt = `${preIdName}BtTest`
    let html = webHookList.map((x, i) => {
        return `<tr><td>${i+1}</td><td>${x.name}</td><td>${x.url}</td><td>${x.text}</td><td><input type="button" class="${bt}" value="测试"></td></tr>`
    }).join('')
    $('NoticeShow').innerHTML = html
    // 绑定事件
    getDom().querySelectorAll('.'+bt).forEach((x,i)=>{
        x.onclick = function(){sendWebHook(i)}
    })
}
function showMatchList(val) {
    let obj = checkJson(val)
    if (!obj.res) return
    matchUrlList = obj.arr
    let html = matchUrlList.map((x, i) => {
        // 如果 x.notice 在 webHookList 中找不到则要背景提示
        let findNotice = webHookList.some(y => {
            return y.name == x.notice
        })
        return `<tr style="color:${findNotice ? '' : 'red'}"><td>${i+1}</td><td>${x.name}</td><td>${x.type ? '正则' : '包含'}</td><td>${x.strMatch}</td><td>${x.notice} </td></tr>`
    }).join('')
    $('UrlMatch').innerHTML = html
}
function getPara() {
    webHookList = GM_getValue(preIdName + 'Notice', []);
    matchUrlList = GM_getValue(preIdName + 'Match', []);
    historyList = GM_getValue(preIdName + 'History', []);
    detectDelay = GM_getValue(preIdName + 'Delay', detectDelay ); // 延时检测毫秒数
}
function saveConfig() {
    if($('txtNoticeList').style.display!='none'){
        alert('通知参数未保存，请点击 显示/修改 按钮')
        return false
    }
    if($('txtMatchUrlList').style.display!='none'){
        alert('网址监控参数未保存，请点击 显示/修改 按钮')
        return false
    }
    let tmpDelay = parseInt($('btDelay').value)
    detectDelay = isNaN(tmpDelay)?detectDelay:tmpDelay
    GM_setValue(preIdName + 'Notice', webHookList);
    GM_setValue(preIdName + 'Match', matchUrlList);
    GM_setValue(preIdName + 'Delay', detectDelay);
    console.log('saveConfig')
    return true
}
function sendWebHook(i) {
    let obj = webHookList[i]
    if(obj!=null)sendWebHookCore(obj)
}
// matchName 为null 表示是手工测试触发，不是自动任务触发
async function sendWebHookCore(obj,matchName,triggerUrl) {
    let content = obj.text
    if(matchName){
        content = content.replace(/{MatchName}/ig,matchName)
    }
    if(triggerUrl){
        content = content.replace(/{Url}/ig,triggerUrl)
    }
    let r ;
    try {
        r = await GM.xmlHttpRequest(
            {
                method: "GET",
                url: obj.url,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({ "msg_type": "text", "content": { "text": content } }),
                method: "POST"
            }
        );
    } catch (e) {
        console.error(e)
        alert('发送异常:'+e.error)
        return
    }

    let rt = r.responseText
    let res = {},resTxt=''
    try{
        res = JSON.parse(rt);
    }catch (e)
    {
        resTxt = ('返回值:['+rt+']解析异常:'+ e )
    }
    if(res.code==0)
    {
        resTxt = ('成功发送')
    }else{
        resTxt = ('发送失败:['+JSON.stringify(res)+']')
    }
    if(matchName!=null){
        let histObj = {
            '监控名称':matchName,
            '通知名称':obj.name,
            '时间':new Date().toLocaleString(),
            '消息内容':content,
            '发送结果': resTxt
        }
        historyList.unshift(histObj)
        if(historyList.length>50)
        {
            historyList.pop()
        }
        GM_setValue(preIdName + 'History', historyList);
    }else{
        alert(resTxt)
    }
}
function detectUrl()
{
    let url = location.href
    matchUrlList.forEach(x=>{
        // 地址匹配
        let matched = false
        if(x.type)
        {
            // 正则
            matched = new RegExp(x.strMatch,ig).exec(url)
        }else{
            // 包含
            matched = url.indexOf(x.strMatch)>-1
        }
        // 找通知方式，如果通知方式
        let findNotice = webHookList.find(y => y.name == x.notice)
        if(matched && findNotice)
        {
            sendWebHookCore(findNotice,x.name,url)
        }
    })
}