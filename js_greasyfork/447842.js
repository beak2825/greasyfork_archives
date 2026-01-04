// ==UserScript==
// @name         有米云联机版888
// @namespace    http://tampermonkey.net/
// @version      2.96
// @description  无
// @author       小刘
// @match        https://data.kuaixp.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdn.bootcss.com/jquery/3.6.0/jquery.min.js
// @license      小刘
// @downloadURL https://update.greasyfork.org/scripts/447842/%E6%9C%89%E7%B1%B3%E4%BA%91%E8%81%94%E6%9C%BA%E7%89%88888.user.js
// @updateURL https://update.greasyfork.org/scripts/447842/%E6%9C%89%E7%B1%B3%E4%BA%91%E8%81%94%E6%9C%BA%E7%89%88888.meta.js
// ==/UserScript==
/* globals cookieStore , $  */

GM_registerMenuCommand('导出密钥', ()=>{Get()})
GM_registerMenuCommand('登录', ()=>{landing()})
GM_registerMenuCommand('无视版本登录', ()=>{landing1()})
GM_registerMenuCommand('获取浏览器版本号', ()=>{alert(getBrowserInfo())})
GM_registerMenuCommand('获取密钥', ()=>GetByServer())
GM_registerMenuCommand('上传密钥到服务器', ()=>sendCookie())
onkeydown = function(event){
    if(event.code=='Backquote'){
        download()
    }else if(event.code=='KeyF' && event.ctrlKey){
        search()
    }
}

var docCookies = {
    getItem: function (sKey) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!sKey || !this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        /*         for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); } */
        return aKeys;
    }
};

function landing() {
    let cookie = prompt('输入密钥')
    if (cookie) {
        cookie = atob(cookie)
        const edition=cookie.split(';')[2] + ';' + cookie.split(';')[3] + ';' + cookie.split(';')[4]
        if (edition == navigator.userAgent.toLowerCase()) {
            docCookies.setItem('AG_Token', cookie.split(';')[0], new Date(parseInt(cookie.split(';')[1])), null, '.kuaixp.com')
            location.reload()
        } else {
            alert('浏览器版本号不对:\n密钥浏览器版本号为：' + edition + '\n本机浏览器版本号为：' + navigator.userAgent.toLowerCase() + '\n可以使用Modheader插件修改浏览器版本后点击无视版本登录功能')
        }
    }
}//登录    ok

async function Get() {
    const C=await cookieStore.get('AG_Token')
    if(C){
        let cookie=C.value + ';' + C.expires + ';' + navigator.userAgent.toLowerCase()
        cookie=btoa(cookie)
        GM_setClipboard(cookie)
        alert('已复制到剪贴板')
    }else alert('请登录并刷新')
}//获取本机cookie    ok

async function GetByServer() {
    if(await cookieStore.get('AG_Token')){
        alert('已经登录，请勿重复提交')
    }else {
        const time=prompt('需要使用的时间（分钟    1-30）',10)
        if(time>0&&time<=30){
            const mytime=new Date().getTime() + 1000 * 60 * time
            const usetime=new Date((mytime)).toLocaleString().replace(/[/]/g, '-')
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://175.178.72.197:12311/outputcookie',
                data:`{"usetime" :"${usetime}"}`,
                responseType:'json',
                onload:(e)=>{
                    console.log(11111111,e)
                    if(e.response){
                        const obj=e.response
                        if(obj.result=='2'){
                            let value=obj.data
                            alert('有人正在使用有米云，请稍后\n' + value + '  后可以获取到密钥')
                        }else{
                            try{
                                const data = atob(obj[`${Object.keys(obj)[0]}`][0].Cookie)
                                const edition=data.split(';')[2] + ';' + data.split(';')[3] + ';' + data.split(';')[4]
                                let cookie=data.split(';')[0] + ';' + mytime + ';' + edition
                                cookie=btoa(cookie)
                                GM_setClipboard(cookie)
                                alert('复制成功，请先将密钥保存下来以免丢失')
                            }catch(err){
                                alert('暂未解决的问题，请联系作者查看')
                                alert(err)
                                alert(e.responseText)
                            }
                        }
                    }else{
                        alert('暂未解决的问题，请联系作者查看')
                        alert(e.responseText)
                    }
                }
            })
        }else alert('请输入1-30内的数字')
    }
}//获取服务器cookie    ok-1

function getBrowserInfo(){
    var agent = navigator.userAgent.toLowerCase() ;
    var regStr_ie = /msie [\d.]+;/gi ;
    var regStr_ff = /firefox\/[\d.]+/gi
    var regStr_chrome = /chrome\/[\d.]+/gi ;
    var regStr_saf = /safari\/[\d.]+/gi ;
    //IE
    if(agent.indexOf("msie") > 0)
    {
        return agent.match(regStr_ie) ;
    }

    //firefox
    if(agent.indexOf("firefox") > 0)
    {
        return agent.match(regStr_ff) ;
    }

    //Safari
    if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0)
    {
        return agent.match(regStr_saf) ;
    }

    //Chrome
    if(agent.indexOf("chrome") > 0)
    {
        return agent.match(regStr_chrome) ;
    }
}//获取浏览器版本号     ok

function landing1() {
    let cookie = prompt('输入密钥')
    if(cookie){
        cookie = atob(cookie)
        docCookies.setItem('AG_Token', cookie.split(';')[0],new Date(parseInt(cookie.split(';')[1])) , null, '.kuaixp.com')
        location.reload()
    }
}//无视版本登录     ok

async function sendCookie() {
    const C=await cookieStore.get('AG_Token')
    if(C.expires>new Date().getTime() + 1000 * 60 * 60 * 24){
        let cookie=C.value + ';' + C.expires + ';' + navigator.userAgent.toLowerCase()
        cookie=btoa(cookie)
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://175.178.72.197:12311/inputcookie',
            data:`{"data" :"${cookie}"}`,
            responseType:'json',
            onload:(e)=>{
                let data=e.response.data
                alert(data)
            }
        })

    }else alert('请先账号登录')


}//上传cookie     ok

function download(){
    if($('video')[0]){
        const url1=$('video')[0].src;
        GM_download(url1,'视频.mp4');
    }else alert('暂无发现播放中视频')
}//下载视频     ok

function search(){
    const data = prompt('搜索')
    if(data){
        const date1 = new Date(new Date()-1000*60*60*24*30*3).toLocaleDateString().replace(/[/]/g, '-')
        const date2 = new Date().toLocaleDateString().replace(/[/]/g, '-')
        const url = 'https://data.kuaixp.com/leaflet?viewType=material&startDate=' + date1 + '&endDate=' + date2 + '&order=-mtScore&isExact=false&keyword=' + data + '&page=1'
        window.open(url, "_blank");
    }
}//搜索素材     ok