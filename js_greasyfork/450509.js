// ==UserScript==
// @name         PtSiteToNas-tools
// @author       Kind
// @description  PT站点cookie发送到nastools站点管理
// @namespace    http://tampermonkey.net/

// @match    http://hdmayi.com/index.php
// @match    http://ihdbits.me/index.php
// @match    https://1ptba.com/index.php
// @match    https://52pt.site/index.php
// @match    https://audiences.me/index.php
// @match    https://byr.pt/index.php
// @match    https://ccfbits.org/index.php
// @match    https://club.hares.top/index.php
// @match    https://cyanbug.net/index.php
// @match    https://discfan.net/index.php
// @match    https://et8.org/index.php
// @match    https://filelist.io/index.php
// @match    https://hdatmos.club/index.php
// @match    https://hdchina.org/index.php
// @match    https://hdcity.leniter.org/index.php
// @match    https://hdfans.org/index.php
// @match    https://hdhome.org/index.php
// @match    https://hdmayi.com/index.php
// @match    https://hdsky.me/index.php
// @match    https://hdtime.org/index.php
// @match    https://hdvideo.one/index.php
// @match    https://hhanclub.top/index.php
// @match    https://hudbt.hust.edu.cn/index.php
// @match    https://iptorrents.com/t
// @match    https://kp.m-team.cc/index.php
// @match    https://leaves.red/index.php
// @match    https://lemonhd.org/index.php
// @match    https://nanyangpt.com/index.php
// @match    https://npupt.com/index.php
// @match    https://ourbits.club/index.php
// @match    https://piggo.me/index.php
// @match    https://pt.btschool.club/index.php
// @match    https://pt.eastgame.org/index.php
// @match    https://pt.hdbd.us/index.php
// @match    https://pt.keepfrds.com/index.php
// @match    https://ptchina.org/index.php
// @match    https://pterclub.com/index.php
// @match    https://pthome.net/index.php
// @match    https://springsunday.net/index.php
// @match    https://totheglory.im/index.php
// @match    https://u2.dmhy.org/index.php
// @match    https://www.beitai.pt/index.php
// @match    https://www.carpet.net/index.php
// @match    https://www.haidan.video/index.php
// @match    https://www.hd.ai/index.php
// @match    https://www.hdarea.co/index.php
// @match    https://www.hddolby.com/index.php
// @match    https://www.hdpt.xyz/index.php
// @match    https://www.htpt.cc/index.php
// @match    https://www.icc2022.com/index.php
// @match    https://www.nicept.net/index.php
// @match    https://www.oshen.win/index.php
// @match    https://pt.soulvoice.club/index.php
// @match    https://www.pthome.net/index.php
// @match    https://www.pttime.org
// @match    https://www.tjupt.org/index.php
// @match    https://www.torrentleech.org
// @match    https://zmpt.cc/index.php

// @version      3.2.3
// @grant       GM_xmlhttpRequest
// @grant       GM_cookie
// @grant       GM_setValue
// @grant       GM_getValue
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/450509/PtSiteToNas-tools.user.js
// @updateURL https://update.greasyfork.org/scripts/450509/PtSiteToNas-tools.meta.js
// ==/UserScript==

/*
日志：
    20230531：适配nas-tools 3.2.3版本，适配添加全新站点API。
    20230301：适配nas-tools 3.0.0版本，使用新API更新站点Cookie。
    20230124：适配nas-tools 2.8.0版本，下次更新保留ip地址和token到浏览器存储避免更新后重新填写。
    20221124：适配nas-tools 2.5.0版本。
    20221029：适配nas-tools 2.3.0版本。
    20220924：适配nas-tools 2.1.2版本。修复一些Bug
    20220924：适配nas-tools 2.1.0版本。
    20220914：适配nas-tools 2.0.5版本。
*/

// 设置nas-tools的访问地址，如http://192.168.1.2:300
let nastoolurl = "http://192.168.1.204:xxx";
// 获取nas-tools的安全密钥，基础设置-安全-API密钥
var token = "IMCIrXB69GQUlHD9xxx";
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
    "subtitle": "Y",
    "limit_interval":"",
    "limit_count":"",
    "limit_seconds":""
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
if (nastoolurl != "http://192.168.1.204:xxx"){
    GM_setValue("nastoolurl", nastoolurl);
}else{
    nastoolurl = GM_getValue("nastoolurl");
}
console.log("【DEBUG】当前nastools地址：" + nastoolurl);
if (token != "IMCIrXB69GQUlHD9xxx"){
    GM_setValue("token", token);
}else{
    token = GM_getValue("token");
}
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
    // data = "cmd=update_site&data=" + encodeURIComponent(JSON.stringify(data)); // JSON.stringify 时候遇到rssurl中的&会自动分割，不能用encode
    GM_xmlhttpRequest({
        method: "POST",
        url: nastoolurl + dorandom,
        headers : {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': nastoolurl,
            'X-Requested-With': 'XMLHttpRequest',
        },
        data: JSON.stringify({
            cmd: "update_site",
            data: data
        }),
        onload: function (response) {
                console.log("【Debug】nas-tools请求发送成功");
                if (JSON.parse(response.responseText).code !== true){ // code : true 为请求成功
                console.log("【Debug】添加站点失败，可能由于nas-tools更新导致参数不对");
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

async function getData() {
    console.log("【Debug】开始获取PT站点信息");
    var data = {};
    var ptCookie = document.cookie;
    if (tampermonkeyVersion == "BETA") {
        GM_cookie('list', { // 异步,如果在return data之前还没执行完，部分站点会导致cookie不全。
            url: location.href
        }, (cookies) => {
            ptCookie = cookies.map(c => `${c.name}=${c.value}`).join('; ');
            console.log('【Debug】cookie:', ptCookie);
            // data.site_cookie = ptCookie;
        });
    }
    var ptUrl = document.URL;
    if (ptUrl.length > 50){
        console.log("【Debug】可能是cf盾，进入首页后再刷新一下页面");
        return false;
    }
    var ptTitle = (document.title + "").split('::')[0];
    const pattern = /[`~!@#$^\-&*()=|{}':;'\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g; // 去除( "等
    ptTitle = ptTitle.replace(pattern, "").substr(0,15);
    if (ptCookie == "" && tampermonkeyVersion!="BETA"){
        console.log("【Debug】获取的cookie为空，请使用BETA版油猴，退出脚本");
        return false
    }
    // 默认配置
    data.site_id = "";
    data.site_name = ptTitle;
    data.site_pri = my_site_pri;
    data.site_rssurl = "";
    data.site_signurl = ptUrl;
    data.site_cookie = ptCookie;
    data.site_include = my_site_include;
    data.site_note = my_site_note;
    var user_sites = await getUserSitesByApi();
    if (user_sites == ""){ return data } 			 // 第一次使用，一个站点都没有
    var host_url = ptUrl.substring(8,).replace("/index.php",""); // 解决因index不是签到url导致nas-tools签到失败
    for (var i = 0, l = user_sites.length; i < l; i++) {
        if (user_sites[i].signurl.search(host_url)!==-1) {
            var temp = user_sites[i]
            console.log("【Debug】查询到nas-tools中该站点的信息:",temp.name);
            if(temp.cookie == ptCookie){
                console.log("【Debug】cookie未过期，退出脚本");
                return false;
            }
            data = {};
	        data.site_id = temp.id;
	        data.site_cookie = ptCookie;
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