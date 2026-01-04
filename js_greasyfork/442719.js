// ==UserScript==
// @name         文库精简&优化
// @icon         https://wenku.baidu.com/favicon.ico
// @version      1.03
// @description  删除主页广告、邀请、垃圾内容，更多功能不一一列举，用过都说好
// @author       zhang6666j
// @home-url	 https://greasyfork.org/zh-CN/scripts/422847
// @match        *://wenku.baidu.com/*
// @grant	     GM_addStyle
// @grant	     unsafeWindow
// @license      GPL-3.0-only
// @run-at       document-start
// @namespace https://greasyfork.org/users/894511
// @downloadURL https://update.greasyfork.org/scripts/442719/%E6%96%87%E5%BA%93%E7%B2%BE%E7%AE%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/442719/%E6%96%87%E5%BA%93%E7%B2%BE%E7%AE%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const w=unsafeWindow||window;
    const saveInfo=(a)=>{
        localStorage.setItem("taozhiyuWKBeautify", JSON.stringify(a));
    };
    const getInfo=()=>{
        return JSON.parse(localStorage.getItem("taozhiyuWKBeautify"));
    };
    let isautorun=false,step=100,timer=30,windowY=0;
    let info=(getInfo()&&Object.keys(getInfo()).length>0)?getInfo():{"noLogin":0};

    function checkmodule(argument) {
        var moduleJson = {
            "(": ")",
            "[": "]",
            "{": "}",
            "\'": "\'",
            "\"": "\""
        };
        var testStr = argument;
        var tempSaveArray = testStr.replace(/\\./g, "").match(/['"\[\]\(\)\{\}]/g);
        if (tempSaveArray.length !== 0) {
            var isdan = false;
            var isshuang = false;
            for (var j = 0; j < tempSaveArray.length; j < 0 ? j = 0 : j++) {
                if (j > 0 && moduleJson[tempSaveArray[j - 1]] !== undefined && moduleJson[tempSaveArray[j - 1]] == tempSaveArray[j]) {
                    tempSaveArray.splice(j - 1, 2);
                    j -= 2;
                    isdan = false;
                    isshuang = false;
                    continue;
                }
                if (isdan || isshuang) {
                    var ischanged = false;
                    if (isdan) {
                        tempSaveArray.splice(j, 1);
                        if (tempSaveArray[j] === "\'") {
                            isdan = false;
                        }
                        ischanged = true;
                    }
                    if (isshuang) {
                        tempSaveArray.splice(j, 1);
                        if (tempSaveArray[j] === "\"") {
                            isshuang = false;
                        }
                        ischanged = true;
                    }
                    if (ischanged) {
                        j--;
                        continue;
                    }
                } else if (tempSaveArray[j] == "\"") {
                    isshuang = true;
                } else if (tempSaveArray[j] == "\'") {
                    isdan = true;
                }
            }
            if (tempSaveArray.length) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    function retmatchtimes(i, endchar) {
        var txt = "([^" + endchar + "]*" + endchar + "){" + String(i) + "}";
        return txt;
    }

    function getFullFunctions(argument, exp, endchar = "\\}") {
        var matchingtimes = 0;
        try {
            var ret = "";
            while (matchingtimes <= 1000) {
                matchingtimes++;
                var tmp = argument.match(new RegExp(exp + retmatchtimes(matchingtimes, endchar), "gm"));
                if (tmp === null) break;
                if (checkmodule(tmp[0])) {
                    ret = tmp[0];
                    break;
                }
            }
            return ret;
        } catch (e) {
            console.log(e);
            return "";
        }
    }
    (w.webpackJsonp=[]).tao=w.webpackJsonp.push;
    w.webpackJsonp.push = (a) => {
        for (var x in a[1]) {
            var e = a[1][x].toString();
            if (e.match(/canCopy\s*:/)) {
                debugger
                var b = getFullFunctions(e, "canCopy\\s*:\\s*function\\s*\\([^\\)]+\\)\\s*\\{"),
                d = e.match(/function\s*\(([^,]+),([^,]+),([^)]+)\)/);
                e = e.replace(b, "canCopy:(t)=>true");//劫持复制
                a[1][x] = new Function(d[1], d[2], d[3], e.substring(e.indexOf("{") + 1, e.length - 1));
                break;
            }
        }
        w.webpackJsonp.tao(a);
    };
/*     const changeFavicon = link => {
        let $favicon = document.querySelector('link[rel="shortcut icon"]');
        let $favicon1 = document.querySelector('link[rel="icon"]');
        $favicon?$favicon.href = link:"";
        $favicon1?$favicon1.href = link:"";
        if(!($favicon||$favicon1)){
            $favicon = document.createElement("link");
            $favicon.rel = "icon";
            $favicon.href = link;
            document.head.appendChild($favicon);
        }
    };
    setTimeout(()=>{
        w.pageData&&w.pageData.vipInfo&&(w.pageData.vipInfo.global_vip_status=2);
        //修改logo
        changeFavicon("https://tva1.sinaimg.cn/large/008i3skNgy1gssioj9haig3040040glg.gif");
    },1000); */

    const killLogin=(iskill=true)=>{
        if(iskill){
            GM_addStyle(`
.登录style,
.pop-mask,
.tang-foreground,
.left-login,
.tang-background,
#passport-login-pop{
display:none!important
width:0!important;
overflow:hidden!important;
z-index:-99999!important;
}`);
            document.querySelector(".user-icon-wrap").onclick=(a)=>{
                killLogin(false);
            };
        }else{
            info.noLogin=0;
            saveInfo(info);
            var s=document.getElementsByTagName('style');
            for(var e=0; e<s.length;e++){
                if(s[e].innerHTML.indexOf("登录style")>=0){
                    s[e].remove();
                }
            }
        }
    };
    //.vip-layer-inner,
    //.pay-layer1509-wrapper,
    // [class*=pay-]{
    // display:none!important;
    // width:0!important;
    // overflow:hidden!important;
    // }
    GM_addStyle(`
.bottom-pop-wrap,
.experience-card-wrap,
.experience-card-dialog-wrap,
.experience-card-bar-wrap,
.doc-price-voucher-wrap,
.experience-card-content,
.vip-member-pop-content,
.copyright-wrap,
.edit-subscription-dialog-wrapper.mod,
.cover-img-ie8,
.user-guide-mask,
.opening-season-dialog,
[class*=pay-],
.vip-wrapper,
.client-wrapper,
.privilege-merging-dialog-wrap,
.notice-info-wrap,
.dialog-wraper,
.active-dialog-wrapper,
.client-download-wrap,
.product,
.red-text.bold-text,
#fengchaoad,
.tousu,
.new-vip-card-position,
.top-recommend-dsp-ad,
.woniu-wrap,
.topicBox,
.search-topicBox-wrap,
.author-organizition-wrapper,
.search-aside-adWrap,
#mywenku,
.doc-pack-wrapper,
.vip-content-wrapper,
.promotion-wrapper,
.user-card-wrapper,
.slide-wrapper,
.bg-wrapper,
.slide-circle-wrapper,
.operate-wrapper,
.voucher-pop-tip,
.theme-wap,
.experience-card-wrap,
.convert-btn-point,
.try-end-fold-page,
.bottom-pop-wrap,
.pure-guide-dialog,
.vip-card-wrap,
.vip-pop-wrap,
.inner-vip,
.vip-pop-wrap,
.inner-vip,
.hx-bottom-wrapper,
.hx-recom-wrapper,
.qr-wrapper,
.feedback-wrapper,
.hx-right-wrapper.sider-edge,
.app-btn,
.hx-warp,
.client-btn-wrap,
.relative-doc-ad-wrapper,
.red-point,
.tips,
.ex-wrapper,
.vip-activity-wrap-new,
.bz-doc-tool-dialog-fix,
.fixed-activity-bar,
.hx-warp,
.operation-wrapper,
.reader-page > div:nth-last-child(1),
.ppt-page-item > div:nth-last-child(1),
.doc-tool-dialog-wrapper{
display:none!important;
width:0!important;
overflow:hidden!important;
}
/*:last-of-type:nth-last-child(1)*/

.header-wrapper{
background-repeat: no-repeat;
background-position: 50% 0;
background-size: cover;
height: 100%;
background-image: url(https://edu-wenku.bdimg.com/v1/pc/2020%E4%BA%8C%E7%BA%A7%E9%A1%B5/%E5%AD%A6%E5%89%8D%E6%95%99%E8%82%B2-1584342432680.png)!important;
}
.product-line-wrap{
float: left;
padding-left: 22px;
}

.red-dot,.red-dot:after{
background-color:unset!important;
}
.small-btn-wrap{
float:unset!important;
}
.bg-items-wrapper{
margin-left:0!important;
}
body{
overflow-y: scroll!important;
}

::-webkit-scrollbar-track{
-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
border-radius: 10px;background-color: #F5F5F5;
}

::-webkit-scrollbar{
width: 8px;
height: 8px;
background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb{
border-radius: 10px;
-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
background-color: #c1c1c1;
}
/*打印屏蔽*/
@media print {
body {display: unset!important}
.reader-topbar,.lazy-load{display:none}
.content-wrapper{padding:0}
/*屏蔽导出脚本*/
.crx_bdwk_down_wrap{display:none}
}

/*滚动按钮*/
.backtop-wrapper #autoroll {
    margin-bottom: 5px;
    width: 40px;
    height: 40px;
    border-radius: 6px;
    border: 1px solid #f5f5f5;
    background-size: 40px 40px;
    background-repeat: no-repeat;
    background-image: url("data:image/gif;base64,R0lGODlhMAAwAHAAACH5BAEAAPwALAAAAAAwADAAhwAAAAAAMwAAZgAAmQAAzAAA/wArAAArMwArZgArmQArzAAr/wBVAABVMwBVZgBVmQBVzABV/wCAAACAMwCAZgCAmQCAzACA/wCqAACqMwCqZgCqmQCqzACq/wDVAADVMwDVZgDVmQDVzADV/wD/AAD/MwD/ZgD/mQD/zAD//zMAADMAMzMAZjMAmTMAzDMA/zMrADMrMzMrZjMrmTMrzDMr/zNVADNVMzNVZjNVmTNVzDNV/zOAADOAMzOAZjOAmTOAzDOA/zOqADOqMzOqZjOqmTOqzDOq/zPVADPVMzPVZjPVmTPVzDPV/zP/ADP/MzP/ZjP/mTP/zDP//2YAAGYAM2YAZmYAmWYAzGYA/2YrAGYrM2YrZmYrmWYrzGYr/2ZVAGZVM2ZVZmZVmWZVzGZV/2aAAGaAM2aAZmaAmWaAzGaA/2aqAGaqM2aqZmaqmWaqzGaq/2bVAGbVM2bVZmbVmWbVzGbV/2b/AGb/M2b/Zmb/mWb/zGb//5kAAJkAM5kAZpkAmZkAzJkA/5krAJkrM5krZpkrmZkrzJkr/5lVAJlVM5lVZplVmZlVzJlV/5mAAJmAM5mAZpmAmZmAzJmA/5mqAJmqM5mqZpmqmZmqzJmq/5nVAJnVM5nVZpnVmZnVzJnV/5n/AJn/M5n/Zpn/mZn/zJn//8wAAMwAM8wAZswAmcwAzMwA/8wrAMwrM8wrZswrmcwrzMwr/8xVAMxVM8xVZsxVmcxVzMxV/8yAAMyAM8yAZsyAmcyAzMyA/8yqAMyqM8yqZsyqmcyqzMyq/8zVAMzVM8zVZszVmczVzMzV/8z/AMz/M8z/Zsz/mcz/zMz///8AAP8AM/8AZv8Amf8AzP8A//8rAP8rM/8rZv8rmf8rzP8r//9VAP9VM/9VZv9Vmf9VzP9V//+AAP+AM/+AZv+Amf+AzP+A//+qAP+qM/+qZv+qmf+qzP+q///VAP/VM//VZv/Vmf/VzP/V////AP//M///Zv//mf//zP///wAAAAAAAAAAAAAAAAjPAPcJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3MixI0QAAAqC9JhwJEGQIUkaNDkQZUqVLV8KdClTJcuZIVHCxCkypU6YN/ex/Eky6M2gFmsaVbrxqNKaHIku3flzKtWRVq8S5bkTZ9auW4VCBfq0q9mzaNOqXSt2q1OvNGOGRRg35kmfNIe6XPiWq9+/X3vetUu4sFjBdPO+7Gs48N28jcsaPpxYZGTEfykfNHp58GSknzuLzuy5ZU/QSOuWZPp4bOq9bGPLnk27tsaAADs=");
}

.backtop-wrapper #autoroll:hover {
filter: drop-shadow(2px 3px 5px black);
}

.backtop-wrapper #autoroll.btnon {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAXIaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA2LjAtYzAwMiA3OS4xNjQ0NjAsIDIwMjAvMDUvMTItMTY6MDQ6MTcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMS4yIChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjEtMDUtMDZUMTM6MzA6NTUrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMDUtMDZUMTM6MzA6NTUrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIxLTA1LTA2VDEzOjMwOjU1KzA4OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE5MWU4MzdjLTY3NTItNWM0OC05MDgyLThiNDg3ZGYyYTQ1NSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjc5OGYzMGM0LTEzMmYtZWU0YS1hNzIwLTFjZjc4YTA5ZTczYSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmRlNjMxZmZmLWY3NDEtNzY0NS1iZGRhLWQ2MmIzMjg4NjlhNCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmRlNjMxZmZmLWY3NDEtNzY0NS1iZGRhLWQ2MmIzMjg4NjlhNCIgc3RFdnQ6d2hlbj0iMjAyMS0wNS0wNlQxMzozMDo1NSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxOTFlODM3Yy02NzUyLTVjNDgtOTA4Mi04YjQ4N2RmMmE0NTUiIHN0RXZ0OndoZW49IjIwMjEtMDUtMDZUMTM6MzA6NTUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4yIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7H2v9ZAAABoklEQVRoQ+2ajXHCMAxG7XQT+rMQXYTuURgEulB7HaVAPhNdhJqaYumwnOPdBS5gWj1LVkqdeOgJAy8fm/AznrrkIcbwuVwNZyEkgRYCl3y/vqXnDg+tBQ8ed+v0HJ936wMX6PoUgdOjHyjCPYsV5dSxJZCCR+AYBClPB2JCbDTBALF3++GEwGCvyNgQe1oDBE+PV2Rpnwm0yF2Ag95M/VmSe0/DzTNgLVGlhCwlqq0BK4mbC9CfAMBCokoGLCWqlZCVRDUBwCVKKRKw7CJaieIMeJFQlZClRClFApZdREtxBrxIqErIg4RKAGi7iBa1AKgpYSIAaknExfbd/xdhBv6Vwr/cm2WgFneB2jQvkF3EUxcn2W1ozKXXL13o+Odzv3d2i3gyA/+dVXDNWELzGbmX0VwG5GxnBWDND4/Mu42iFuXhjXlnwCNyg+OqNgrw3l+vc3Lllvv5YKph0Nj5Xcie+gzIjT7PYJeS9vIw+81lQG5E9kJyWZwsUWueDr4/TCD2Zu+VgNDXcjWWECxbgYIHv263oVNvC5tmGmUz3m4TwhGnXEZREtuo9wAAAABJRU5ErkJggg==");
}

`);
    let a=setInterval(()=>{
        let b=document.querySelector(".read-all")
        if(b){
            if(document.querySelector(".fold-no-vip-page-text")===null)b.click();//以后想办法解决这个vip的问题
            clearInterval(a);
        }
//        b=document.querySelector(".btn-know");
//        if(b){
//            b.click();
//        }
    },100);
    let b=setInterval(()=>{
        if(document.querySelector(".no-login")){
            clearInterval(b);
            if(info.noLogin===0){//0未知
                let c=setInterval(()=>{
                    if(!document.querySelector(".pop-mask,#passport-login-pop")){return;}
                    clearInterval(c);
                    if(confirm('是否屏蔽登录窗口？\n本浏览器本网站将一直有效，\n如需[登录]或[清除设置]请\n\n【点击右上角的登陆按钮】')){
                        info.noLogin=1;
                        saveInfo(info);
                        killLogin();
                    }else{
                        info.noLogin=2;
                        saveInfo(info);
                    }
                },100);
            }else if(info.noLogin===1){//屏蔽
                killLogin();
            }
        }
    },100);
    setTimeout(()=>{
        clearInterval(b);
        let d=document.querySelector(".small-btn-wrap");
        if(d){
            const a=document.createElement("span");
            a.innerHTML="作者：zhang6666j";
            a.style='color: #666;font-size: 14px;font-family: PingFangSC-Regular;';
            d.append(a);
        }

        document.querySelector("body").addEventListener("copy", a=>{
            try {
                a.clipboardData.setData("text", a.target.value.replace(/\n-{56}\n作者：(.|\n)+/,""));
                a.preventDefault();
            } catch (a) { console.log("111");}
        });
    },2000);

    /*护眼色 > div
#reader-container{
background-color: rgb(199 237 204);
}*/
})();