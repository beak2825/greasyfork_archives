// ==UserScript==
// @name         云南电信页面iptv初始化
// @license      GPL-3.0-only
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  云南iptv页面由于缺少部分参数，无法在浏览器正常运行，所以搞个脚本来辅助运行
// @author       TSCats
// @match        http://182.245.29.75:78/*
// @match        http://182.245.29.168:78/*
// @match        http://112.115.0.134:9099/*
// @match        https://182.245.29.75:78/*
// @match        https://182.245.29.168:78/*
// @match        https://112.115.0.134:9099/*
// @grant        none
// @run-at       document-start
// @namespace    437986376@qq.com
// @downloadURL https://update.greasyfork.org/scripts/470740/%E4%BA%91%E5%8D%97%E7%94%B5%E4%BF%A1%E9%A1%B5%E9%9D%A2iptv%E5%88%9D%E5%A7%8B%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/470740/%E4%BA%91%E5%8D%97%E7%94%B5%E4%BF%A1%E9%A1%B5%E9%9D%A2iptv%E5%88%9D%E5%A7%8B%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(!window.Authentication){
        window.Navigation = {
            disableDefaultNavigation:function(){}
        };
        window.Authentication = {
            data:{
                UserGroupNMB:"",
                UserID:"test1",
                STBID:"",
                STBType:"",
                TerminalType:"",
                AreaNode:"",
                IP:"",
                MAC:"",
                mac:"",
                UserToken:"test",
                EPGDomain:"http://182.245.29.75:78",
                EncryptedUserToken:"test",
                UserPlatform:"",
                JoyUOrder:"",
                CountyID:"",
                JoyUIndexUrl:""
            },
            strArr:['UserGroupNMB','UserID','STBID','STBType','TerminalType','AreaNode','IP','MAC','mac','UserToken','EPGDomain','EncryptedUserToken','UserPlatform','JoyUOrder','CountyID'],
            getData: function (str) {
                var res = '';
                switch (str) {
                    case 'UserGroupNMB':
                        res = this.data[str] || '';
                        break;
                    case 'UserID':
                        res = this.data[str] || 'test1';
                        break;
                    case 'STBID':
                        res = this.data[str] || '';
                        break;
                    case 'STBType':
                        res = this.data[str] || '';
                        break;
                    case 'TerminalType':
                        res = this.data[str] || '';
                        break;
                    case 'AreaNode':
                        res = this.data[str] || '';
                        break;
                    case 'IP':
                        res = this.data[str] || '';
                        break;
                    case 'MAC':
                        res = this.data[str] || '';
                        break;
                    case 'mac':
                        res = this.data[str] || '';
                        break;
                    case 'UserToken':
                        res = this.data[str] || 'test';
                        break;
                    case 'EPGDomain':
                        res = this.data[str] || 'http://182.245.29.75:78';
                        break;
                    case 'EncryptedUserToken':
                        res = this.data[str] || 'test';
                        break;
                    case 'UserPlatform':
                        res = this.data[str] || '';
                        break;
                    case 'JoyUOrder':
                        res = this.data[str] || '';
                        break;
                    case 'CountyID':
                        res = this.data[str] || '';
                        break;
                    case 'JoyUIndexUrl':
                        res = this.data[str] || '';
                        break;
                    default :
                        res = '';
                        break;
                }
                return res;
            },
            CTCGetConfig:function (str){
                var res = sessionStorage.getItem(str)||this.getData(str);
                return res;
            },
            CTCSetConfig:function (str,value){
                sessionStorage.setItem(str,value);
                this.data[str] = value;
            },
            init:function (){
                console.log('执行了云南环境脚本初始化');
            }
        };
        window.Authentication.init();
    }
    var TMKeyCodeMap= {
        'LEFT': 37,
        'UP': 38,
        'RIGHT': 39,
        'DOWN': 40,
        'BACK': 8
    };
    window.addEventListener('keydown',function (e){
        var code = e.keyCode;
        if (code === TMKeyCodeMap.LEFT||code === TMKeyCodeMap.UP||code === TMKeyCodeMap.RIGHT||code === TMKeyCodeMap.DOWN||code === TMKeyCodeMap.BACK){
            if(!document.onkeypress)return;
            document.onkeypress({keyCode:code});
        }
    });
    // Your code here...
})();