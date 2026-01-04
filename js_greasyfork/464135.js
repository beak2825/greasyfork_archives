// ==UserScript==
// @name         PtSiteToNasTools
// @author       shareit
// @description  P将T站点cookie发送到nastools站点管理
// @namespace    http://tampermonkey.net/

// @include    http://hdmayi.com/*
// @include    http://ihdbits.me/*
// @include    https://zhuque.in/*
// @include    https://1ptba.com/*
// @include    https://52pt.site/*
// @include    https://audiences.me/*
// @include    https://byr.pt/*
// @include    https://ccfbits.org/*
// @include    https://club.hares.top/*
// @include    https://cyanbug.net/*
// @include    https://discfan.net/*
// @include    https://et8.org/*
// @include    https://filelist.io/*
// @include    https://hdatmos.club/*
// @include    https://hdchina.org/*
// @include    https://hdcity.leniter.org/*
// @include    https://hdfans.org/*
// @include    https://hdhome.org/*
// @include    https://hdmayi.com/*
// @include    https://hdsky.me/*
// @include    https://hdtime.org/*
// @include    https://hdvideo.one/*
// @include    https://hhanclub.top/*
// @include    https://hudbt.hust.edu.cn/*
// @include    https://iptorre*
// @include    https://kp.m-team.cc/*
// @include    https://leaves.red/*
// @include    https://lemonhd.org/*
// @include    https://nanyangpt.com/*
// @include    https://npupt.com/*
// @include    https://ourbits.club/*
// @include    https://piggo.me/*
// @include    https://pt.btschool.club/*
// @include    https://pt.eastgame.org/*
// @include    https://pt.hdbd.us/*
// @include    https://pt.keepfrds.com/*
// @include    https://ptchina.org/*
// @include    https://pterclub.com/*
// @include    https://pthome.net/*
// @include    https://springsunday.net/*
// @include    https://totheglory.im/*
// @include    https://u2.dmhy.org/*
// @include    https://www.beitai.pt/*
// @include    https://www.carpet.net/*
// @include    https://www.haidan.video/*
// @include    https://www.hd.ai/*
// @include    https://www.hdarea.co/*
// @include    https://www.hddolby.com/*
// @include    https://www.hdpt.xyz/*
// @include    https://www.htpt.cc/*
// @include    https://www.icc2022.com/*
// @include    https://www.nicept.net/*
// @include    https://www.oshen.win/*
// @include    https://www.pthome.net/*
// @include    https://www.tjupt.org/*
// @include    https://www.torrent*
// @include    https://zmpt.cc/*
// @include    https://carpt.net/*
// @include    https://wintersakura.net/*
// @include    https://sharkpt.net/*
// @include    https://gainbound.net/*
// @include    https://hdvideo.one/*
// @include    https://pt.2xfree.org/*
// @include    http://www.oshen.win/*
// @include    http://uploads.ltd/*
// @include    https://ubits.club/*
// @include    http://hdzone.me/*
// @include    https://pt.soulvoice.club/*
// @include    https://www.gamegamept.com/*
// @include    https://pt.itzmx.com/*
// @include    https://pt.0ff.cc/*
// @include    https://www.pttime.org/*
// @include    https://xxxx/*
// @include    https://xxxx/*
// @include    https://xxxx/*
// @include    https://xxxx/*
// @include    https://xxxx/*
// @include    https://xxxx/*




// @version      3.2.7
// @grant       GM_xmlhttpRequest
// @grant       GM_cookie
// @grant       GM_setValue
// @grant       GM_getValue
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/464135/PtSiteToNasTools.user.js
// @updateURL https://update.greasyfork.org/scripts/464135/PtSiteToNasTools.meta.js
// ==/UserScript==

/*
日志：
    20230301：适配nas-tools 3.0.0版本，使用新API更新站点Cookie。
    20230124：适配nas-tools 2.8.0版本，下次更新保留ip地址和token到浏览器存储避免更新后重新填写。
    20221124：适配nas-tools 2.5.0版本。
    20221029：适配nas-tools 2.3.0版本。
    20220924：适配nas-tools 2.1.2版本。修复一些Bug
    20220924：适配nas-tools 2.1.0版本。
    20220914：适配nas-tools 2.0.5版本。
*/

// 设置nas-tools的访问地址，如http://192.168.1.2:300
let nastoolurl = "http://192.168.1.13:3000";
// 获取nas-tools的安全密钥，基础设置-安全-API密钥
var token = "None";
// 如果油猴插件是测试版(可获取更多cookie)，保持不变，否则改为"BET"
var tampermonkeyVersion = "BETA";
// 自定义配置：日常观影，下载设置默认（若预设则填写-1），解析rss，ua, 浏览器仿真，N 不用代理服务器，消息通知，字幕下载
var my_site_note = {
    "rule": "1000",
    "download_setting": "",
    "parse": "Y",
    "ua": navigator.userAgent,
    "chrome": "Y",
    "proxy": "N",
    "message": "Y",
    "subtitle": "Y"
};
// 自定义配置：默认优先级为"2"
var my_site_pri = "2"
// 自定义配置：签到Q、订阅D(未设置rss链接时无法订阅)、刷流S（未设置rss无法刷流）、统计T
var my_site_include = "QDST"
// 下面这些不用修改
var userSitesApi = "/api/v1/site/sites"
var cookieUpdateApi = "/api/v1/site/cookie/update"
var dorandom = "/do?random=0.19956351081249935";
// this.$$ = this.jQuery;
console.log("【DEBUG】当前nastools地址：" + nastoolurl);
console.log("【DEBUG】当前token:" + token);

(function () {
    'use strict';
    main();
})();

async function getUserSitesByApi(){
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: nastoolurl + userSitesApi,
            headers: {
                'Origin': nastoolurl,
                "Authorization":token,
            },
            onload: function (response) {
		        var data = JSON.parse(response.responseText);
                console.log("【Debug】nas-tools请求userSite成功,status:",data.code);
                // console.log(response.responseText);
                if(data.code==401){
                    console.log("【Debug】获取userSite失败，请检查密钥是否正确");}
                    resolve(data.data.user_sites)
                },
                onerror: function (response) {
                    console.log("【Debug】nas-tools请求userSite失败，请检查IP地址是否设置正确");
                    reject("");
                }
        })
    })
}

async function sendSiteToNastools(data) {
    data = {
        cmd: "update_site",
        data: data
    };
    // post_data = {}
    // post_data.cmd="update_site";
    // post_data.data = data;
    // data = "cmd=update_site&data=" + encodeURIComponent(JSON.stringify(data)); // JSON.stringify 时候遇到rssurl中的&会自动分割，不能用encode
    data = JSON.stringify(data)
    console.log("更新site:"+data);
    GM_xmlhttpRequest({
        method: "POST",
        url: nastoolurl + dorandom,
        headers : {
            // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Origin': nastoolurl,
            'X-Requested-With': 'XMLHttpRequest',
        },
        data: data,
        onload: function (response) {
                console.log("【Debug】nas-tools请求发送成功");
                if (JSON.parse(response.responseText).code !== true){ // code : true 为请求成功
                    console.log("【Debug】添加站点失败，可能由于nas-tools更新导致参数不对");
                    console.log(response.responseText)
                }
            },
        onerror: function (response) {
                console.log("nas-tools更新站点请求失败");
            }
    });
    console.log("【Debug】站点信息发送完毕");
}

async function updataCookie(data){
    data = "site_id=" + data.site_id + "&site_cookie=" + encodeURIComponent(data.site_cookie);
    // data = JSON.stringify(data);
    GM_xmlhttpRequest({
        method: "POST",
        url: nastoolurl + cookieUpdateApi,
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': nastoolurl,
             "Authorization":token,
        },
        data: data,
        onload: function (response) {
                console.log("【Debug】nas-tools请求发送成功");
                if (JSON.parse(response.responseText).code !== 0){
                console.log("【Debug】更新站点cookie失败，可能是API返回变更");
                }
            },
        onerror: function (response) {
                console.log("nas-tools更新站点cookie请求失败");
            }
    });
    console.log("【Debug】站点信息发送完毕");
}

function checkUrlExists(url) {
    var cookies = document.cookie;
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "HEAD",
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36",
                "Cookie": cookies
            },
            onload: function(response) {
                if (response.status === 200) {
                    resolve(true); // URL 存在
                } else {
                    console.log(url+"响应："+response.status)
                    resolve(false); // URL 不存在
                }
            },
            onerror: function(error) {
                resolve(false); // 请求错误，URL 不存在
            }
        });
    });
}

async function getData() {
    console.log("【Debug】开始获取PT站点信息");
    var data = {};
    var ptCookie = document.cookie;
    if (tampermonkeyVersion == "BETA") {
        GM_cookie('list', { // 异步,如果在return data之前还没执行完，部分站点会导致cookie不全。
            url: location.href
        }, (cookies) => {
            if(cookies!=undefined){
                ptCookie = cookies.map(c => `${c.name}=${c.value}`).join('; ');
                console.log('【Debug】cookie:', ptCookie);
                // data.site_cookie = ptCookie;
            }
        });
    }
    // var ptUrl = document.URL;
    var parser = document.createElement('a')
    parser.href = document.URL
    var ptUrl = "https://"+parser.hostname
    // var ptUrl = window.location.hostname;
    // console.log("host: ",window.location.host);
    // console.log("hostname: ",window.location.hostname);
    if (ptUrl.length > 150){
        console.log("【Debug】可能是cf盾，进入首页后再刷新一下页面");
        return false;
    }
    // var ptTitle = (document.title + "").split('::')[0];
    // const pattern = /[`~!@#$^\-&*()=|{}':;'\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g; // 去除( "等
    // ptTitle = ptTitle.replace(pattern, "").substr(0,15);
    var ptTitle = parser.hostname
    if (ptCookie == "" && tampermonkeyVersion!="BETA"){
        console.log("【Debug】获取的cookie为空，请使用BETA版油猴，退出脚本");
        return false
    }
    // 默认配置
    data.site_id = "";
    data.site_name = ptTitle;
    data.site_pri = my_site_pri;
    data.site_rssurl = "";
    //data.site_signurl = ptUrl;
    data.site_cookie = ptCookie;
    data.site_include = my_site_include;
    data.site_note = my_site_note;

    console.log("host_url:"+ host_url);
    var sign_url = "/attendance.php"

    var exists = await checkUrlExists(sign_url);
    if (exists) {
        console.log(sign_url+ " 存在");
        sign_url = ptUrl+"/attendance.php"
    } else {
        console.log(sign_url+ " 不存在");
        sign_url = ptUrl;
    }
    console.log("sign_url:"+ sign_url);
    data.site_signurl = sign_url;


    var user_sites = await getUserSitesByApi();
    if (user_sites == ""){ return data } 			 // 第一次使用，一个站点都没有
    var host_url = ptUrl.substring(8,).replace("/index.php",""); // 解决因index不是签到url导致nas-tools签到失败


    for (var i = 0, l = user_sites.length; i < l; i++) {
        if (user_sites[i].signurl.search(sign_url)!==-1) {
            var temp = user_sites[i]
            console.log("【Debug】查询到nas-tools中该站点的信息:",JSON.stringify(temp));
            if(temp.cookie == ptCookie){
                console.log("【Debug】cookie未过期，退出脚本");
                return false;
            }
            data = {};
	        data.site_id = temp.id;
	        data.site_cookie = ptCookie;
            data.site_signurl = sign_url;
            //data.site_id = temp.id;
            //data.site_name = temp.name;
            //data.site_pri = temp.pri;
            //data.site_rssurl = temp.rssurl; // rss中存在&导致后面把json转换字符串在编码时候出现分割，先encode一下,但是后面在encode时候会出错
            //data.site_signurl = temp.signurl;
            //data.site_cookie = ptCookie;
            //data.site_include = ""
            //if(temp.signin_enable == true){data.site_include += "Q";} 	 // 签到
            //if(temp.rss_enable == true){data.site_include += "D";} 	 // rss
            //if(temp.brush_enable == true){data.site_include += "S";} 	 // 刷流
            //if(temp.statistic_enable == true){data.site_include += "T";} // 统计
            //data.site_note = {};
            //data.site_note.rule = temp.rule;
            //data.site_note.parse = temp.parse;
            //data.site_note.ua = temp.ua;
            //temp.chrome == true ? data.site_note.chrome = "Y" :data.site_note.chrome = "N";
            //temp.proxy == true ? data.site_note.proxy = "Y" :data.site_note.proxy = "N";
            //temp.message == true ? data.site_note.message = "Y" :data.site_note.message = "N";
            // temp.subtitle == true ? data.site_note.subtitle = "Y" :data.site_note.subtitle = "N"
	    // data.site_note.download_setting = temp.download_setting
            updataCookie(data);
            return false;
        }
    }
    return data;
}

async function main() {
    var data = await getData();
    if(data==false) return ;
    // await ajax_post("update_site",data,"")
    await sendSiteToNastools(data);
}


async function ajax_post(cmd, data, handler){
    // @require        https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
    data = {
        cmd: cmd,
        data: JSON.stringify(data)
    };
    $$.ajax({ // (已屏蔽:mixed-content) 无法在https里面发生http请求，因此暂时不使用
        type: "POST",
        url: nastoolurl + dorandom,
        dataType: "json",
        data: data,
        cache: false,
        timeout: 0,
        success: "", // 待更新
        error: function(){ // 待更新
        }
    });
}