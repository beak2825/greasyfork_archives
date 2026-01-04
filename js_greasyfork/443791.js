// ==UserScript==
// @name         米游社_米游币工具
// @namespace    https://space.bilibili.com/451551665
// @version      1.3
// @description  米游社 原神签到 获取米游币
// @author       灵舒
// @match        *://*/*
// @icon         https://images.cnblogs.com/cnblogs_com/zhou1106/1804028/o_220422043444_1.webp
// @require      https://cdn.jsdelivr.net/npm/js-md5@0.7.3/build/md5.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @connect      api-takumi.mihoyo.com
// @connect      bbs-api.mihoyo.com
// @run-at       document-end
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443791/%E7%B1%B3%E6%B8%B8%E7%A4%BE_%E7%B1%B3%E6%B8%B8%E5%B8%81%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/443791/%E7%B1%B3%E6%B8%B8%E7%A4%BE_%E7%B1%B3%E6%B8%B8%E5%B8%81%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

function Rn(min,max){
    return Math.floor(Math.random()*(max-min+1)+min)
}

function ds() {
    var s = 'h8w582wxwgqvahcdkpvdhbh2w9casgfl'
    var t = Math.floor(Date.now() / 1000)
    var r = Math.random().toString(36).slice( - 6)
    var c = 'salt=' + s + '&t=' + t + '&r=' + r
    var ds = t + ',' + r + ',' + md5(c)
    return ds
}

var headers = {
    'Referer': 'https://bbs.mihoyo.com/',
    'DS': ds(),
    'x-rpc-app_version': '2.3.0',
    'x-rpc-client_type': '5',
    'x-rpc-device_id': 'bd7f912e-908c-3692-a520-e70206823495',
}

var mpid=[9873884]
//防止出毛病感觉多设一点好了。。。
for (var i=0; i<30; i++)
{
    mpid.push(Rn(6000000,9870000))
}

var siPost,siReply,siUpvote

//发主帖 (有时间限制)
function mPost(){
    var url = 'https://bbs-api.mihoyo.com/post/wapi/releasePost'
    var data = {"collection_id":0,
                "content":"<p>水贴谁是第一？</p><p>【灵舒】天下第一！</p>",
                "cover":"",
                "draft_id":"666",
                "f_forum_id":0,
                "forum_id":0,"gids":"2",
                "is_original":0,
                "post_id":"",
                "structured_content":"[{\"insert\":\"水贴谁是第一？\\n【灵舒】天下第一！\\n\"}]",
                "subject":"【灵舒】天下第一",
                "topic_ids":["180"],
                "view_type":1
               }
    var sData = JSON.stringify(data)

    GM_xmlhttpRequest({
        url: url,
        method: 'POST',
        data: sData,
        headers: headers,
        onload: function(xhr) {
            var re = (xhr.responseText)
            console.log("发帖："+re)
            var json = JSON.parse(re)
            if (json.message == "OK") {
                GM_setValue('vPost',GM_getValue('vPost',0)+1)
            }
            if(GM_getValue('vPost',0)>=2){
                ShowToast("发主贴经验已混完！", 3)
                GM_notification({
                    title: "[米游社 水经验]",
                    text: "发主贴经验已混完！",
                })
            }
        }
    })
}

//发评论 (有时间限制)
function mReply(){
    var url = 'https://bbs-api.mihoyo.com/post/wapi/releaseReply'
    var data = {
        "content":"<p>灵舒天下第一！</p>",
        "gids":"2",
        "post_id":"9873884",
        "structured_content":"[{\"insert\":\"灵舒天下第一！\\n\"}]"
    }
    var sData = JSON.stringify(data)

    GM_xmlhttpRequest({
        url: url,
        method: 'POST',
        data: sData,
        headers: headers,
        onload: function(xhr) {
            var re = (xhr.responseText)
            console.log("评论："+re)
            var json = JSON.parse(re)
            if (json.message == "OK") {
                GM_setValue('vReply',GM_getValue('vReply',0)+1)
            }
            if(GM_getValue('vReply',0)>=3){
                ShowToast("发评论经验已混完！", 3)
                GM_notification({
                    title: "[米游社 水经验]",
                    text: "发评论经验已混完！",
                })
            }
        }
    })
}

//点赞 (这个没有时间限制)
function mUpvote(){
    var tip = 0
    for (var i in mpid) {
        var id = mpid[i].toString()
        var url = 'https://bbs-api.mihoyo.com/apihub/api/upvotePost'
        var data = {"gids":"2",
                    "is_cancel":false,
                    "post_id":id
                   }
        var sData = JSON.stringify(data)

        GM_xmlhttpRequest({
            url: url,
            method: 'POST',
            data: sData,
            headers: headers,
            onload: function(xhr) {
                var re = (xhr.responseText)
                console.log("点赞："+re)
                var json = JSON.parse(re)
                if (json.message == "OK") {
                    GM_setValue('vUpvote',GM_getValue('vUpvote',0)+1)
                }
                if(GM_getValue('vUpvote',0)>=10){
                    if(tip == 0){
                        tip = 2
                        ShowToast("点赞经验已混完！", 3)
                        GM_notification({
                            title: "[米游社 水经验]",
                            text: "点赞经验已混完！",
                        })
                    }
                }
            }
        })
    }
}


function Multiline(string) {
    var str = string.toString().split('\n')
    return str.slice(1, str.length - 1).join('\n')
}

function su_style() {/*
#Su-1_kawaii{
    position: fixed;
    z-index: 999999999;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: #44444488;
}
#Su-1_Out{
    position: absolute;
    z-index: 80;
    height: 200px;
    width: 660px;
    margin-top: -100px;
    margin-left: -330px;
    top: 50%;
    left: 50%;
    background: #4e6ef2e8;
    border-radius: 20px;
    justify-content: center;
    padding-top: 50px;
}
#Su-1_In{
    height: 100%;
    width: 100%;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    font-size: 24px;
    text-shadow: #000 1px 0 0, #000 0 1px 0, #000 -1px 0 0, #000 0 -1px 0;
    color: #fff;
}
#Su-1_kawaii a {
    text-decoration: none;
    color: #f00;
}
*/}

GM_addStyle(Multiline(su_style))

function ShowToast(str, s) {
    var ele = '<div id="Su-1_kawaii"><div id="Su-1_Out"><div id="Su-1_In">' + str + '</div></div></div>'
    let toast = document.createElement('su')
    toast.innerHTML = ele
    document.querySelector('body').append(toast)
    if (s > 0) {
        setInterval(function() { toast.remove() },s * 1000)
    }
}

var host = window.location.href
var mihoyo = "bbs.mihoyo.com"
var ysweb = host.indexOf(mihoyo)
var ysurl = "https://bbs.mihoyo.com/ys/"

var date = new Date()
var today = date.toLocaleDateString()

var data, uid, region, region_name, nickname, level, message

GM_registerMenuCommand('求关注！', function(){ window.open("https://space.bilibili.com/451551665")})
GM_registerMenuCommand('前往米游社！', function(){ window.open("https://bbs.mihoyo.com/ys/")})

GM_registerMenuCommand('开关',function(){
    if(GM_getValue('hExp','关闭')=='关闭'){
        GM_setValue('hExp','打开')
    }else{
        GM_setValue('hExp','关闭')
    }
    ShowToast("水经验开关状态："+GM_getValue('hExp','关闭')+"<br>详细看<a target='_blank' href='https://greasyfork.org/zh-CN/scripts/432059'>脚本安装页</a>说明。。。<br>感觉可能会出BUG。。。", 3)
    GM_notification({
        title: "[米游社 水经验]",
        text: "开关状态："+GM_getValue('hExp','关闭')+"\n详细看安装页说明。。。\n感觉可能会出BUG。。。",
        ondone: () =>{ window.open('https://greasyfork.org/zh-CN/scripts/443791-%E7%B1%B3%E6%B8%B8%E7%A4%BE-%E7%B1%B3%E6%B8%B8%E5%B8%81%E5%B7%A5%E5%85%B7') },
    })
})

GM_registerMenuCommand('换号！',function(){
    GM_setValue('SignState','灵舒')
})

GM_registerMenuCommand('强国！',function(){ window.open("https://www.xuexi.cn/")})

if (GM_getValue('SignState', '灵舒') != today) {

    GM_setValue('vPost', 0)
    GM_setValue('vReply', 0)
    GM_setValue('vUpvote', 0)
    GM_setValue('ExpT','灵舒')

    GM_xmlhttpRequest({
        url: "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn",
        method: "GET",
        onload: function(xhr) {
            var json = JSON.parse(xhr.responseText)
            if (json.retcode !== 0) {
                if (ysweb < 0) {
                    GM_notification({
                        title: "[米游社 原神签到]\n帐号未登录！",
                        text: "点击前往登录！",
                        ondone: () =>{ window.open(ysurl) },
                    })
                    ShowToast('[米游社 原神签到]<br>帐号未登录！<br><a target="_blank" href=' + ysurl + '>点击前往登录！</a>', 5)
                } else {
                    GM_notification({
                        title: "[米游社 原神签到]\n帐号未登录！",
                        text: "请登录帐号！",
                    })
                    ShowToast('[米游社 原神签到]<br>帐号未登录！<br>请登录帐号！', 1)
                }
            } else {
                var list = json.data.list
                for (var i in list) {

                    uid = json.data.list[i].game_uid
                    region = json.data.list[i].region
                    region_name = json.data.list[i].region_name
                    nickname = json.data.list[i].nickname
                    level = json.data.list[i].level

                    data = '{"act_id":"e202009291139501","region":"' + region + '","uid":"' + uid + '"}'

                    /*----------------------------------------------------------------------------------------------*/
                    GM_xmlhttpRequest({
                        url: 'https://api-takumi.mihoyo.com/event/bbs_sign_reward/sign',
                        method: 'POST',
                        data: data,
                        headers: headers,
                        onload: function(xhr) {
                            var json = JSON.parse(xhr.responseText)
                            message = json.message
                            if (message == "OK") {
                                message = "今日打卡完成！"
                            }
                            var tips = '【' + region_name + '】[ Lv : ' + level + ']<br>[UID : ' + uid + ']【' + nickname + '】<br>' + message
                            GM_notification({
                                title: "[米游社 原神签到]\n签到成功！！",
                                text: '【' + region_name + '】[ Lv : ' + level + ']\n[UID : ' + uid + ']【' + nickname + '】\n' + message,
                            })
                            ShowToast(tips, 3)
                            GM_setValue('SignState', today)
                        }
                    })
                    /*----------------------------------------------------------------------------------------------*/
                }

            }
        }
    })
}



var sleep = 30

//执行发主贴
if(GM_getValue('vPost',0)<2 && GM_getValue('hExp','关闭')!='关闭'){
    mPost()
    siPost = setInterval(function(){
        if(GM_getValue('vPost',0)<2){
            mPost()
        }else{
            clearInterval(siPost)
        }
    },1000*sleep)
}

//执行发评论
if(GM_getValue('vReply',0)<3 && GM_getValue('hExp','关闭')!='关闭'){
    mReply()
    siReply = setInterval(function(){
        if(GM_getValue('vReply',0)<3){
            mReply()
        }else{
            clearInterval(siReply)
        }
    },1000*sleep)
}

//执行点赞
if(GM_getValue('vUpvote',0)<10 && GM_getValue('hExp','关闭')!='关闭'){
    mUpvote()
    siUpvote = setInterval(function(){
        if(GM_getValue('vUpvote',0)<10){
            mUpvote()
        }else{
            clearInterval(siUpvote)
        }
    },1000*sleep)
}

if(GM_getValue('vPost',0)>=2 && GM_getValue('vReply',0)>=3 && GM_getValue('vUpvote',0)>=10 && GM_getValue('ExpT','灵舒')=='灵舒'){
    ShowToast("亲爱的旅行者呦~<br>脚本能混到手的经验都混完了呦~~~", 3)
    GM_notification({
        title: "[米游社 水经验]",
        text: "亲爱的旅行者呦~\n脚本能混到手的经验都混完了呦~~~",
    })
    GM_setValue('ExpT','混子灵舒东拼西凑做脚本。。。')
}