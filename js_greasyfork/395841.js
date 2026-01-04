// ==UserScript==
// @name         McbbsReviewServerHelper
// @version      0.0.45
// @description  MRSH - 你的服务器审核版好助手
// @author       萌萌哒丶九灬书
// @namespace    https://space.bilibili.com/1501743
// @mainpage     https://greasyfork.org/zh-CN/scripts/395841-mcbbsreviewserverhelper/
// @supportURL   https://greasyfork.org/zh-CN/scripts/395841-mcbbsreviewserverhelper/feedback
// @home-url     https://greasyfork.org/zh-TW/scripts/395841-mcbbsreviewserverhelper/
// @homepageURL  https://greasyfork.org/zh-TW/scripts/395841-mcbbsreviewserverhelper/
// @license      GNU General Public License v3.0
// @create       2020-01-28
// @lastmodified 2023-07-29
// @note         0.0.45 更新: 1.修复了部分细节错误;
// @note         0.0.44 更新: 1.新增了新版版本号判定，待群内讨论后续标准;
// @note         0.0.43 更新: 1.移除了版本号的判定，待群内讨论标准;
// @note         0.0.42 更新: 1.新增了1.19.4至1.19.3的判定;
// @note         0.0.41 更新: 1.新增了1.19.2至1.19的判定;
// @note         0.0.40 更新: 1.移除了百度网盘判定;2.新增了1.17、1.17.1、1.18、1.18.1;
// @note         0.0.39 更新: 1.移除了模板判定中的1.12.1;
// @note         0.0.38 更新: 1.新增了1.16.5; 2.修复了一键移动至审核区按钮失效的问题;
// @note         0.0.37 更新: 1.新增了1.16.4;
// @note         0.0.36 更新: 1.修复了新人贴设置公益时会陷入无限循环的bug;
// @note         新增、更改、修复、移除、精简、*可能*
// @note         1.0.00 版本以前不会去支持一键审核，还需人工查看.
// @match        *://www.mcbbs.net/thread-*
// @match        *://www.mcbbs.net/forum.php?mod=viewthread*
// @match        *://www.mcbbs.net/forum-serverpending*
// @match        *://www.mcbbs.net/forum.php?mod=forumdisplay&fid=296*
// @match        *://www.mcbbs.net/forum-server*
// @match        *://www.mcbbs.net/forum.php?mod=forumdisplay&fid=179*
// @match        *://www.mcbbs.net/forum-362*
// @match        *://www.mcbbs.net/forum.php?mod=forumdisplay&fid=362*
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/395841/McbbsReviewServerHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/395841/McbbsReviewServerHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var jq = jQuery.noConflict();
    //jq名称重定义，避免冲突

    function isThisTitleJudged(str){
        //是否有判定标识
        var ZZ1 = /(🍃|🍁|🍂|✅|❌|🔔)+/;
        if(ZZ1.test(str)){
            return true;
        }else{
            return false;
        }

    }
    function ThreeDifferentTips(ele,str,info1,info2,info3){
    //顾名思义，添加了三种不同的tips
        if(ele > 0){
            str.html(function(i,origText){
                return '🍃' + origText + '🍃' + green(info1);
            });
        }else if(ele < 0) {
            str.html(function(i,origText){
                return '🍁' + origText + '🍁' + red(info2);
            });
        }else {
            str.html(function(i,origText){
                return '🍂' + origText + '🍂' + orange(info3);
            });
        };
    }
    function TrueOrFalsOrNull(ele,str,info2,info3){
    //顾名思义，添加了通过、不通过、NULL三种不同的tips
        if(ele > 0){
            str.html(function(i,origText){
                return '✅' + origText;
            });
        }else if(ele < 0) {
            str.html(function(i,origText){
                return '❌' + origText + '❌' + red(info2);
            });
        }else {
            str.html(function(i,origText){
                return '🔔' + origText + '🔔' + orange(info3);
            });
        };
    }
    function TrueOrFalse(ele,str,info2){
    //顾名思义，添加了通过、不通过两种不同的tips
        if(ele){
            str.html(function(i,origText){
                return '✅' + origText;
            });
        }else {
            str.html(function(i,origText){
                return '❌' + origText + '❌' + red(info2);
            });
        };
    }

    function OnlyFalse(ele,str,info2){
    //顾名思义，只添加了不通过的tip
        if(!ele){
            str.html(function(i,origText){
                return '❌' + red(info2) + origText;
            });
        };
    }

    function green(str){
    //文本快捷变绿
        if(str != ''){
            return '<font color="green">' + str + '</font>';
        }else{
            return '';
        }
    }

    function red(str){
    //文本快捷变红
        if(str != ''){
            return '<font color="red">' + str + '</font>';
        }else{
            return '';
        }
    }

    function orange(str){
    //文本快捷变橘
        if(str != ''){
            return '<font color="#A63C00">' + str + '</font>';
        }else{
            return '';
        }
    }

    var flag_ReviewTitleZZ = true;
    function ReviewTitleZZ(str){
        //正则判断标题
        //var ZZ = /^\[(电信|联通|移动|双线|多线|教育|港澳|台湾|欧洲|美洲|亚太|内网)\]([\u4e00-\u9fa5]|\w|\s|[\u0800-\u4e00])*(\s|)——(\s|).[^\[]*\[(\d|\.|X|x|\-)+]$/;
        //var ZZ = /^\[(电信|联通|移动|双线|多线|教育|港澳|台湾|欧洲|美洲|亚太|内网)\]([0-9a-zA-Z\u2160-\u217f\u3040-\u30ff\u31f0-\u31ff\u4e00-\u9fa5]|\s)+——([^\u2014]|\s)+\[(\-?((1\.\d{1,2}(\.(\d{1,2}|X|x))?)|(\d{2}w\d{2}[a-z]))){1,2}\]$/;
        /**
         * 全角英文：\u2160-\u217f Ⅰ-ⅿ
         * 日语：\u3040-\u30ff\u31f0-\u31ff ぀-ヿㇰ-ㇿ
         * 中文：\u4e00-\u9fa5 一-龥
         * 破折号：\u2014 —
         * 黑块：\u2588\u2589\u3013 █▉〓
         * emoji：\uD83C\uDF00-\uDFFF\uD83D\uDC00-\uDE4F\uD83D\uDE80-\uDEFF\u2700-\u27BF\uFE0F 🌀-�🐀-�🚀-�✀-➿️
        **/
        var ZZ = /^\[(电信|联通|移动|双线|多线|教育|港澳|台湾|欧洲|美洲|亚太|内网)\]([0-9a-zA-Z\u2160-\u217f\u3040-\u30ff\u31f0-\u31ff\u4e00-\u9fa5]|\s)+——([^\u2014\u2588\u2589\u3013\uD83C\uDF00-\uDFFF\uD83D\uDC00-\uDE4F\uD83D\uDE80-\uDEFF\u2700-\u27BF\uFE0F]|(\s))+\[(\-?((1\.\d{1,2}(\.(\d{1,2}|X|x))?)|(\d{2}w\d{2}[a-z]))){1,2}\]$/;
        if (ZZ.test(str)){
            return true;
        }else{
            flag_ReviewTitleZZ = false;
            return false;
        }
    }

    function UserPointZZ(ele){
        //正则判断数值是否为正(绿宝石&贡献)
        var ZZ = /^[0-9]*\s/;
        return ZZ.test(ele);
    }

    function trim(str){
        //通过正则，清空字符串左右的空白
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    function ServerTitleName(str,SvrName){
        var PoZheHao = str.indexOf("—");
        //从左寻找 “—” 的位置
        var YouKuoHao = str.indexOf("]");
        //从左寻找 “]” 的位置
        var subStr = String(str.substring(YouKuoHao + 1,PoZheHao));
        //通过 “]” 和 “—” 定位服务器名称
        subStr = trim(subStr);
        SvrName = trim(SvrName);
        //使用trim函数，清空字符串左右的空白
        //console.log("sbS:" + subStr);
        //console.log("SN:" + SvrName);
        //用于debug输出↑
        if (subStr == SvrName){
            return 3;
        }
        else if (subStr + "服务器" == SvrName){
            return 2;
        }
        else if (subStr == SvrName + "服务器"){
            return 1;
        }
        else{
            return 0;
        };
    }

    var VersionList = ['1.20.1','1.20',
                       '1.19.4','1.19.3','1.19.2','1.19.1','1.19',
                       '1.18.2','1.18.1','1.18',
                       '1.17.1','1.17',
                       '1.16.5','1.16.4','1.16.3','1.16.2','1.16.1','1.16',
                       '1.15.2', '1.15.1', '1.15',
                       '1.14.4', '1.14',
                       '1.13.2', '1.13.1', '1.13',
                       '1.12.2', '1.12',
                       '1.11.2', '1.11',
                       '1.10.X',
                       '1.9.4', '1.9',
                       '1.8.X',
                       '1.7.10', '1.7.2',
                       '1.6.4'];
    var VersionList_X = ['1.6.X', '1.7.X', '1.8.X', '1.9.X', '1.10.X', '1.11.X', '1.12.X', '1.13.X', '1.14.X', '1.15.X','1.16.X','1.17.X','1.18.X','1.19.X','1.20.X'];
    var VersionList_x = ['1.6.x', '1.7.x', '1.8.x', '1.9.x', '1.10.x', '1.11.x', '1.12.x', '1.13.x', '1.14.x', '1.15.x','1.16.x','1.17.x','1.18.x','1.19.x','1.20.x'];
    function ServerVersionXS(str){
        //从VersionList调取.x的最大值，如果不是.x，传回原str
        for(var i = 0; i < VersionList_X.length; i++){
            if((str == VersionList_X[i])||(str == VersionList_x[i])){
                break;
            };
        };
        switch(i){
            case 14:
                //1.20.1
                return VersionList[VersionList.length - 37];
            case 13:
                //1.19.4
                return VersionList[VersionList.length - 35];
            case 12:
                //1.18.2
                return VersionList[VersionList.length - 30];
            case 11:
                //1.17.1
                return VersionList[VersionList.length - 27];
            case 10:
                //1.16.5
                return VersionList[VersionList.length - 25];
            case 9:
                //1.15.2
                return VersionList[VersionList.length - 19];
            case 8:
                //1.14.4
                return VersionList[VersionList.length - 16];
            case 7:
                //1.13.2
                return VersionList[VersionList.length - 14];
            case 6:
                //1.12.2
                return VersionList[VersionList.length - 11];
            case 5:
                //1.11.2
                return VersionList[VersionList.length - 9];
            case 4:
                //1.10.x
                return VersionList[VersionList.length - 7];
            case 3:
                //1.9.4
                return VersionList[VersionList.length - 6];
            case 2:
                //1.8.x
                return VersionList[VersionList.length - 4];
            case 1:
                //1.7.10
                return VersionList[VersionList.length - 3];
            case 0:
                //1.6.4
                return VersionList[VersionList.length - 1];
            default:
                return str;
        };
    }
    function ServerVersionXE(str){
        //从VersionList调取.x的最小值，如果不是.x，传回原str
        for(var i = 0; i < VersionList_X.length; i++){
            if((str == VersionList_X[i])||(str == VersionList_x[i])){
                break;
            };
        };
        switch(i){
            case 14:
                //1.20
                return VersionList[VersionList.length - 36];
            case 13:
                //1.19
                return VersionList[VersionList.length - 31];
            case 12:
                //1.18
                return VersionList[VersionList.length - 28];
            case 11:
                //1.17
                return VersionList[VersionList.length - 26];
            case 10:
                //1.16
                return VersionList[VersionList.length - 20];
            case 9:
                //1.15
                return VersionList[VersionList.length - 17];
            case 8:
                //1.14
                return VersionList[VersionList.length - 15];
            case 7:
                //1.13
                return VersionList[VersionList.length - 12];
            case 6:
                //1.12
                return VersionList[VersionList.length - 10];
            case 5:
                //1.11
                return VersionList[VersionList.length - 8];
            case 4:
                //1.10.x
                return VersionList[VersionList.length - 7];
            case 3:
                //1.9
                return VersionList[VersionList.length - 5];
            case 2:
                //1.8.x
                return VersionList[VersionList.length - 4];
            case 1:
                //1.7.2
                return VersionList[VersionList.length - 2];
            case 0:
                //1.6.4
                return VersionList[VersionList.length - 1];
            default:
                return str;
        };
    }
    function SwitchLength(str1, str2){
        for(var i = 0; i < str2.length; i++){
            //在str2里遍历，直到找到str1位置
            if(str1 == str2[i]){
                return i;
            };
        };
    }
    function isServerVersionSelectTRUE(str1, str2, ServerVersion){
        //ServerVersion为模板选择的版本号
        var sv1_Diff = SwitchLength(ServerVersionXE(str1), VersionList) - SwitchLength(ServerVersionXS(str1), VersionList);
        //sv1在VersionList的.x区间长度
        var sv1_Diff2 = SwitchLength(ServerVersionXE(str1), ServerVersion) - SwitchLength(ServerVersionXS(str1), ServerVersion);
        //sv1在模板的.x区间长度
        if(str2 == null ){
            if (sv1_Diff == sv1_Diff2){
                return 1;
            }else{
                return -1;
            }
        }else{
            var sv2_Diff = SwitchLength(ServerVersionXE(str2), VersionList) - SwitchLength(ServerVersionXS(str2), VersionList);
            //sv2在VersionList的.x区间长度
            var sv2_Diff2 = SwitchLength(ServerVersionXE(str2), ServerVersion) - SwitchLength(ServerVersionXS(str2), ServerVersion);
            //sv2在模板的.x区间长度
            if ((sv1_Diff == sv1_Diff2) && (sv2_Diff == sv2_Diff2)){
                return 1;
            }else{
                return -1;
            }
        }
    }
    function ServerVersionTips(str1){
        var str2 = jq(".cgtl.mbm tbody tr td").eq(2).text();
        var ServerVersion = trim(str2)
        ServerVersion = ServerVersion.split(/\s+/);
        if (str1 > 0){
            if (ServerVersion.length > 5){
                ThreeDifferentTips(-1, jq(".cgtl.mbm tbody tr td").eq(2), "", "你确定有这么多核心？", "")
            }else{
                ThreeDifferentTips(1, jq(".cgtl.mbm tbody tr td").eq(2), "新版版规判定正确", "", "")
            }
        }else{
            OnlyFalse(-1, jq(".cgtl.mbm tbody tr td").eq(2), "模板版本号与标题不符")
        }
    }
    function getServerVersion(str1, str2){
        var strL = str1.lastIndexOf("[");
        var strR = str1.lastIndexOf("]");
        var subStr = String(str1.substring(strL + 1,strR));
        subStr = trim(subStr);
        var ServerVersion = trim(str2)
        ServerVersion = ServerVersion.split(/\s+/);
        //ServerVersion为模板选择的核心版本号
        var ZZ5 = /^1\.\d{1,2}(\.(\d{1,2}|X|x))?\-\d{2}w\d{2}[a-z]$/
        //1.7.x-20w05a
        var ZZ4 = /^\d{2}w\d{2}[a-z]$/;
        //20w05a
        var ZZ3 = /^1\.\d{1,2}(\.(\d{1,2}|X|x))?\-1\.\d{1,2}(\.(\d{1,2}|X|x))?$/;
        //1.7.x-1.12.x
        var ZZ2 = /^1\.\d{1,2}(\.\d{1,2})?$/;
        //1.7.10
        var ZZ1 = /^1\.\d{1,2}\.(X|x)$/;
        //1.7.x
    /*
        console.log("sbS:" + subStr);
        console.log("SvS:" + ServerVersion[0] + "; SvE:" + ServerVersion[ServerVersion.length - 1]);
        console.log("SvL:" + ServerVersion.length);
        console.log("VlS:" + VersionList[0] + "; VlE:" + VersionList[VersionList.length - 1]);
        console.log("VlL:" + VersionList.length);
        console.log(ZZ5.test(subStr));
        console.log(ZZ4.test(subStr));
        console.log(ZZ3.test(subStr));
        console.log(ZZ2.test(subStr));
        console.log(ZZ1.test(subStr));
        ↑调试用
    */
        if(ZZ5.test(subStr) && ServerVersion[ServerVersion.length - 1] == '其他版本'){
        /**
         * 标题为 1.7.2-20w05a 且勾选了 其他版本 的情况
         * 此为23年7月新版规规范
         */
            var TitleVersion5 = subStr.split('-');
            //TitleVersion为标题版本号
            trim(TitleVersion5[0]);
            trim(TitleVersion5[1]);
            //避免有人在-的左右加空格
            if(ZZ1.test(TitleVersion5[0])){
            //如果标题版本号1为.x
                if(isServerVersionSelectTRUE(TitleVersion5[0],null,ServerVersion)){
                //如果.x勾选正确
                    return 5;
                }else{
                    //标题中的版本号和模板不符 就直接return -3
                    return -3;
                };
            }else{
            //如果标题版本号1为.数字
                if(TitleVersion5[0] == ServerVersion[ServerVersion.length - 2]){
                    //判定标题中 左侧的版本号 是否和 模板倒数第二个(倒数第一为其他版本) 相符合
                    return 5;
                }else{
                    //标题中的版本号和模板不符 就直接return -3
                    return -3;
                };
            }
        }else if(ZZ4.test(subStr) && ServerVersion[ServerVersion.length - 1] == '其他版本'){
        /**
         * 标题为20w05a 且模板勾选了 其他版本 的情况
         */
            if (ServerVersion.length > 1 ){
                //模板选择多版本，标题选择单版本的情况 return -1
                return -1;
            }else{
                //模板有且仅有一个'其他版本'时 return 4
                return 4;
            }
        }else if(ZZ3.test(subStr)){
        /**
         * 标题为 1.7.x-1.12.x 多版本的情况
         * 23年7月新版规
         */
            var TitleVersion3 = subStr.split('-');
            //TitleVersion为标题版本号
            trim(TitleVersion3[0]);
            trim(TitleVersion3[1]);
            //避免有人在-的左右加空格
            //console.log("TV1:" + TitleVersion3[0] + "; TV2:" + TitleVersion3[1]);
            // ↑ 调试用 ↑ 
                if(ZZ1.test(TitleVersion3[0]) && ZZ1.test(TitleVersion3[1])){
                //如果标题版本号1和2均为.x
                //console.log("tv1");
                // ↑ 调试用 ↑ 
                    if(isServerVersionSelectTRUE(TitleVersion3[0], TitleVersion3[1], ServerVersion)){
                    //如果.x勾选正确
                        return 3;
                    }else{
                        //标题中的版本号和模板不符 就直接return -3
                        return -3;
                    };
                }else if(ZZ1.test(TitleVersion3[0])){
                //如果标题版本号1为.x，标题版本号2为.2
                //console.log("tv2");
                // ↑ 调试用 ↑ 
                    if(isServerVersionSelectTRUE(TitleVersion3[0], null, ServerVersion) && (TitleVersion3[1] == ServerVersion[0])){
                    //标题版本号1勾选正确，标题版本号2是否为模板版本号第一个
                        return 3;
                    }else{
                        //标题中的版本号和模板不符 就直接return -3
                        return -3;
                    };
                }else if(ZZ1.test(TitleVersion3[1])){
                //如果标题版本号1为.2，标题版本号2为.x
                //console.log("tv3");
                // ↑ 调试用 ↑ 
                    if((TitleVersion3[0] == ServerVersion[ServerVersion.length - 1]) && isServerVersionSelectTRUE(TitleVersion3[1], null, ServerVersion)){
                    //标题版本号1是否为模板版本号倒数第一个, 标题版本号2勾选正确
                        return 3;
                    }else{
                        //标题中的版本号和模板不符 就直接return -3
                        return -3;
                    };
                }else{
                //console.log("tv4");
                // ↑ 调试用 ↑ 
                //如果标题版本号1和2均为.2
                    if((TitleVersion3[0] == ServerVersion[ServerVersion.length - 1]) && (TitleVersion3[1] == ServerVersion[0])){
                    //标题版本号1是否为模板版本号倒数第一个，标题版本号2是否为模板版本号第一个
                        return 3;
                    }else{
                        //标题中的版本号和模板不符 就直接return -3
                        return -3;
                    };
                }
        }else if(ZZ2.test(subStr)){
        /** 
         * 标题为 1.7.2 单版本的情况
         */
            var TitleVersion2 = trim(subStr);
            if (ServerVersion.length > 1 ){
            //模板选择多版本，标题选择单版本的情况 return -1
                return -1;
            }
            if ((TitleVersion2 == ServerVersion[0]) || ((TitleVersion2 != ServerVersion[0]) && (ServerVersion[ServerVersion.length - 1] == '其他版本'))){
            //判定标题中的版本号是否和模板相符合 || 不符合的时候 是否选择了其他版本
                return 2;
            }else{
            //标题中的版本号和模板不符 就直接return -3
                return -3;
            };
        }else if(ZZ1.test(subStr)){
        /** 
         * 标题为 1.7.x 复合版本的情况, 23年7月新版规
         */
            var TitleVersion1 = trim(subStr);
            if(ZZ1.test(TitleVersion1)){
            //如果标题版本号1为.x
                if(isServerVersionSelectTRUE(TitleVersion1,null,ServerVersion)){
                //如果.x勾选正确
                    return 1;
                }else{
                    //标题中的版本号和模板不符 就直接return -3
                    return -3;
                };
            }else{
            //如果标题版本号1为.数字
                if(TitleVersion1 == ServerVersion[0]){
                    //判定标题中 左侧的版本号 是否和 模板第一个 相符合
                    return 1;
                }else{
                    //标题中的版本号和模板不符 就直接return -3
                    return -3;
                };
            }
        }else{
            //标题中的版本号和模板不符 就直接return -3
            return -3;
        };
    }

    function ServerIPAddress(str){
        var SvrIPAddress = trim(str);
        var ZZ3 = /((\w)+\.)+(\w)+(\:[0-9]+)?/;
        //正则匹配带端口或不带端口的域名地址
        var ZZ2 = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/;
        //正则匹配不带端口的IP地址
        var ZZ1 = /([\u4e00-\u9fa5]|\w|\s|[\u0800-\u4e00])+/;
        //正则匹配至少输入了点东西的
        if(ZZ3.test(SvrIPAddress)){
            return 3;
        }else if(ZZ2.test(SvrIPAddress)){
            return 2;
        }else if(ZZ1.test(SvrIPAddress)){
            return 1;
        }else{
            return 0;
        };
    }

    function ServerType(str){
        var strR = str.indexOf("»");
        //从左寻找 “»” 的位置
        var subStr = String(str.substring(0,strR));
        //从开头到 “»” 定位服务器类型
        subStr = trim(subStr);
        //console.log(subStr);
        if(subStr == "纯净服务器"){
            return 1;
        } else if(subStr == "Mod服务器"){
            return -1;
        } else if(subStr == "其他（下面注明）"){
            return 0;
        };
    }

    function ServerClientDownloadSet(str){
        var strL = str.indexOf("»");
        //从左寻找 “»” 的位置
        var strR = str.indexOf("下");
        //从左寻找 “下” 的位置
        var subStr = String(str.substring(strL + 1,strR));
        //通过 “»” 和 “下” 定位服务器是否需要下载专用客户端
        subStr = trim(subStr);
        if(subStr == "不需要"){
        //忽视内容，返回99
            return 99;
        } else if(subStr == "需要"){
            return -1;
        } else if(subStr == ""){
            return 0;
        };
    }

    function ServerClientDownload(str){
        var SvrCD = trim(str);
        var ZZ1 = /((\w)+\.)+(\w)+(\:[0-9]+)?/;
        var ZZ_1 = /^http(s)?\:\/\/(www.)?([\u4e00-\u9fa5]|\s|[\u0800-\u4e00]|)+(\w)*([0-9]+)*.com$/;
        var ZZ_2 = /jq\.qq\.com/;
        var ZZ_3 = /(群|君羊|裙)+/;
        var ZZ_4 = /mcbbs\.net/
        if(ZZ_4.test(SvrCD)){
            return -4;
        }else if(ZZ_3.test(SvrCD)){
            return -3;
        }else if(ZZ_2.test(SvrCD)){
            return -2;
        }else if(ZZ_1.test(SvrCD)){
            return -1;
        }else if(ZZ1.test(SvrCD)){
            return 1;
        }else {
            return 0;
        };
    }

    var flag_SeverBusinessConditionsWrite = false;
    //是否正确填写，正确填写为true，填写错误为false
    var flag_SeverBusinessConditionsValue = false;
    //是否为公益服，公益服为true，商业服为false
    function SeverBusinessConditions(str1,str2){
        var strR = str1.indexOf("服");
        //从左寻找 “服” 的位置
        var subStr = String(str1.substring(0,strR));
        //从头开始，通过 “服” 定位服务器是否公益
        var ZZ1 = /本服是公益服并且愿意承担虚假宣传的一切后果/;
        if(subStr == "公益"){
            if(ZZ1.test(str2)){
                //如果是公益服，且写明了标语，则返回中立
                flag_SeverBusinessConditionsValue = true;
                flag_SeverBusinessConditionsWrite = true;
                return 0;
            } else {
                //如果是公益服，没写明标语，则返回false
                flag_SeverBusinessConditionsValue = true;
                flag_SeverBusinessConditionsWrite = false;
                return -1;
            };
        } else if (subStr == "商业"){
            if(ZZ1.test(str2)){
                //如果是商业服，却写了标语，则返回false
                flag_SeverBusinessConditionsValue = false;
                flag_SeverBusinessConditionsWrite = false;
                return -1;
            } else {
                //如果是商业服，没写明标语，则返回true(unlimited)
                flag_SeverBusinessConditionsValue = false;
                flag_SeverBusinessConditionsWrite = true;
                return 99;
            };
        } else{
            //其他情况，返回false，提醒审核
            flag_SeverBusinessConditionsValue = false;
            flag_SeverBusinessConditionsWrite = false;
            return -1;
        };
    }

    function isAllEqual(array){
    //输入一个值，或是一个数组，判定其是否所有数值都相等;
        return array.every(function(value,i){
            return value == 1;
        });
    }

    function JudgeSameColor(str1,str2){
        //输入color1和color2，判定两个值是否在某个误差内
        var Dvalue = 15;
        var check = [];
        var str1L = str1.indexOf("(");
        var str1R = str1.indexOf(")");
        var subStr1 = String(str1.substring(str1L + 1,str1R));
        var Color1 = subStr1.split(', ');

        var str2L = str2.indexOf("(");
        var str2R = str2.indexOf(")");
        var subStr2 = String(str2.substring(str2L + 1,str2R));
        var Color2 = subStr2.split(', ');

        for(var i_1 = 0; i_1 < Color1.length; i_1++){
            if(Math.abs(Color1[i_1] - Color2[i_1]) <= Dvalue){
                check[i_1] = 1;
            }else{
                check[i_1] = 0;
            };
        };
        return isAllEqual(check);
    }

    var flag_BodyTextSize = true;
    var flag_BodyTextColor = true;
    var flag_BodyTextBGColor = true;
    var flag_BodyTextGGL = true;
    //设置全局变量 字体大小, 字体颜色, 背景颜色, 刮刮乐
    function BodyFont_Size_Color(str){
        var str_ZZ1 = /font\scolor/;
        var str_ZZ2 = /^<br>$/;
        var str_ZZ3 = /^\s+$/;
        var str_ZZ4 = /^\s$/;
        if (str_ZZ1.test(String(str.html()))){
            //如果内容中还包含‘font color’，跳出判断。
            //console.log('text: ' + str.text());
            //console.log('color: ' + cssFontColor);
            //console.log('flag_HTML: ' + String(str.html()));
            return true;
        }else if(str_ZZ2.test(str.html()) && trim(str.find("*").children().text()) == ''){
            //如果内容中只有‘<br>’且无其他内容时，跳出判断。
            //console.log('1_text: ' + str.text());
            //console.log('1_color: ' + cssFontColor);
            //console.log('1_flag_HTML: ' + String(str.html()));
            return true;
        }
        /* 旧版判断 if(trim(str.text()) == '' || trim(str.find("*").children().text()) != '' ) //如果内容为空，或依旧有内容时，直接返回true，即跳出判断; */
        var color = ['rgb(0, 255, 255)','rgb(255, 255, 0)','rgb(0, 255, 0)','rgb(36, 255, 36)','rgb(255, 0, 255)']
        var color_RGBA = ['rgba(0, 255, 255, 0)','rgba(255, 255, 0, 0)','rgba(0, 255, 0, 0)','rgba(36, 255, 36, 0)','rgba(255, 0, 255, 0)']
        //按顺序，分别为亮青色, 亮黄色, 亮绿色, 亮绿色, 亮粉色
        var flag_FontSize = true;
        var cssFontSize = str.css('font-size');
        //找到font-size的css，并提取
        var px = cssFontSize.indexOf('px');
        //找到px字符的位置
        var FontSize=cssFontSize.substring(0,px);
        //将px切割，保留数字字符
        if(parseInt(FontSize) > 24){
        //将string转换为int型，并判断
            flag_BodyTextSize = false;
            flag_FontSize = false;
        }
        var flag_FontColor = true;
        var cssFontColor = str.css('color');
        //var cssFontColor = str.getElementById('color').style.color;
        //找到color的css，并提取
        for (var i_color = 0; i_color < color.length; i_color++){
            if((JudgeSameColor(cssFontColor, color[i_color]) || JudgeSameColor(cssFontColor, color_RGBA[i_color])) && cssFontColor !='' && !str_ZZ3.test(str.text())){
                //判定RGB | RGBA | 是否为空 | 内容是否为多个空格
                console.log('2_text: ' + str.text());
                console.log('2_color: ' + cssFontColor);
                console.log('2_flag_HTML: ' + String(str.html()));
                console.log('2_color['+ i_color +']: ' + color[i_color] + 'RGBA['+ i_color +']: ' + color_RGBA[i_color]);
                console.log(str_ZZ3.test(str.text()));
            /*  调试用 暂时不删 ↑*/
                flag_BodyTextColor = false;
                flag_FontColor = false;
                break;
            }
        }
        var flag_FontBGColor = true;
        var cssFontBGColor = str.css("background-color");
        //var cssFontBGColor = str.getElementById('color').style.backgroundColor;
        //找到color的css，并提取
        for (var i_BGColor = 0; i_BGColor < color_RGBA.length; i_BGColor++){
            if((JudgeSameColor(cssFontBGColor, color[i_BGColor]) || JudgeSameColor(cssFontBGColor, color_RGBA[i_BGColor])) && cssFontBGColor !='' && !str_ZZ4.test(str.text())){
                console.log('3_text: ' + str.text());
                console.log('3_BGcolor: ' + cssFontBGColor);
                console.log('3_flag_HTML: ' + String(str.html()));
                console.log('3_BGcolor['+ i_BGColor +']: ' + color[i_BGColor] + 'RGBA['+ i_BGColor +']: ' + color_RGBA[i_BGColor]);
            /*  调试用 暂时不删 ↑*/
                flag_BodyTextBGColor = false;
                flag_FontBGColor = false;
                break;
            }
        }
        var flag_FontGGL = true;
        if (JudgeSameColor(cssFontBGColor, cssFontColor) && (cssFontBGColor != '' || cssFontColor != '') && !str_ZZ4.test(str.text())){
            console.log('4_text: ' + str.text());
            console.log('4_BGcolor: ' + cssFontBGColor);
            console.log('4_flag_HTML: ' + String(str.html()));
            console.log('4_BGcolor['+ i_BGColor +']: ' + color[i_BGColor] + 'RGBA['+ i_BGColor +']: ' + color_RGBA[i_BGColor]);
            /*  调试用 暂时不删 ↑*/
            flag_BodyTextGGL = false;
            flag_FontGGL = false;
        }

        return flag_FontSize && flag_FontColor && flag_FontBGColor && flag_FontGGL;
    }

    function BodyFontFlag(){
    //用于输出是否违规的tips
        var TipText = '';
        if(flag_BodyTextSize == false){
            TipText = TipText + red('❌字号大于5');
        }else{
            TipText = TipText + green('✅字号合规');
        };
        if(flag_BodyTextColor == false){
            TipText = TipText + '|' + red('❌亮色字体');
        }else{
            TipText = TipText + '|' + green('✅亮色字体');
        };
        if(flag_BodyTextBGColor == false){
            TipText = TipText + '|' + red('❌亮色背景');
        }else{
            TipText = TipText + '|' + green('✅亮色背景');
        };
        if(flag_BodyTextGGL == false){
            TipText = TipText + '|' + red('❌妨碍阅读的字体/背景');
        }else{
            TipText = TipText + '|' + green('✅其他颜色违规');
        };
        jq('.t_f').html(function(i,origText){
            return '<div align="center" class="FontSizeTipsDiv"><font size="4" class="FontSizeTips">' + TipText + '</font></div>' + origText;
        });
    }
    function CheckMultipleThread(){
    //一服多贴tips
        var UserHomeHref = jq('.avtm').attr("href");
        var ServerThreadHref = '&do=thread&from=space&fid=179';
        var TipText = '<a href="' + UserHomeHref + ServerThreadHref + '" class="CheckMultipleThread">' + orange('🔔检查一服多贴') + '</a>|'
        jq('.FontSizeTips').html(function(i,origText){
            return TipText + origText;
        });
    }

    function BtnPass(){
    //一键通过btn
        var BtnPassText = '<button class="BtnPass">'+ green('通过') +'</button>|'
        jq('.FontSizeTips').html(function(i,origText){
            return BtnPassText + origText;
        });
    }

    function BtnMoveToReviewServer(){
    //一键移回服务器审核版重新编辑
        var BtnMoveToReviewServerText = '<button class="BtnMoveToReviewServer">'+ orange('移回审核版') +'</button>'
        jq('#modmenu').html(function(i,origtext){
            return origtext + '<hr color="#D2D2D2"><div class="BtnlistsClass" id="BtnlistsId">' + BtnMoveToReviewServerText + '</div>';
        });
    }

    function BtnRemoveAllMarks(){
        //一键撤销评分
        var BtnRemoveAllMarksText = '<button class="BtnRemoveAllMarks">'+ red('撤销正面评分') +'</button>'
        jq('.BtnlistsClass').html(function(i,origtext){
            return origtext + '<span class="pipe">|</span>' + BtnRemoveAllMarksText;
        });
    }

    function isNowInServerForum(str){
        var ZZ1 = />服务器</;
        var ZZ2 = />服务器审核区</;
        var ZZ3 = /服务器\/玩家评论<\/a>\s<em>›<\/em>/
        var ZZ4 = />人才市场<\/a>\s<em>›<\/em>/
        var ZZ5 = /服务器版块版规|公告/
        var ZZ10 = /gid=167/;
        //多人联机大区分区的固定URL
        if((ZZ1.test(str) || ZZ2.test(str)) && !ZZ3.test(str) && !ZZ4.test(str) && !ZZ5.test(str) && ZZ10.test(str)){
            return true;
        } else {
            return false;
        };
    }

    function isNull(str){
        str = trim(str);
        if(str == '' || str == '-' || str == '\\' || str == '/'){
            return 0;
        } else{
            return 1;
        }
    }
    /********************
     * ↓一键通过按钮开始↓ *
     *********************/
    var ServerTypeslist = ["公告", "生存", "创造", "混合（下面注明）", "战争", "RPG", "小游戏（Mini Game）"]
    var ServerTypesValue = [360, 358, 359, 361, 395, 397, 2423]
    function ServerMoveType(str){
    //输入分类名(str)，返回分类为第几项(int)
        for(var i = 0; i < ServerTypeslist.length; i++){
            if(str == ServerTypeslist[i]){
                //console.log(i);
                return i;
            };
        };
    }
    function ServerMoveValue(str){
    //输入分类名(str)，返回分类value(int)
        for(var i = 0; i < ServerTypeslist.length; i++){
            if(str == ServerTypeslist[i]){
                //console.log(i);
                return ServerTypesValue[i];
            };
        };
    }
    var flag_Plate_ServerPass = false;
    var flag_Type_ServerPass = false;
    var Checked_Ping = 1;
    function checkServerType_ServerPass(){
        //确认版块选项是否正确(本函数为无限循环函数，首次延迟0.25秒，之后每次执行增加延迟0.25秒)
        if(flag_Plate_ServerPass == false){
            //console.log('3');
            jq("#moveto").trigger("change");
            setTimeout(function (){jq('#moveto optgroup:eq(5) option:eq(1)').prop("selected", true)}, 250 * Checked_Ping);
            //选择服务器版
            setTimeout(function (){
                if(jq('#moveto').val() == 179){
                //判断是否选择了服务器版
                    flag_Plate_ServerPass = true;
                }else{
                    Checked_Ping++;
                    setTimeout(function (){checkServerType_ServerPass();}, 250 * Checked_Ping);
                }
            }, 250 * Checked_Ping);
        };
    }
    function checkServerMoveValue_ServerPass(){
        //确认分类选项是否正确(本函数为无限循环函数，首次延迟0.25秒，之后每次执行增加延迟0.25秒)
        if(flag_Type_ServerPass == false){
            //console.log('4');
            jq("#moveto").trigger("change")
            //setTimeout(function (){jq('#threadtypes option:eq('+ ServerMoveType(jq('.cgtl.mbm tbody tr td').eq(4).text()) + ')').attr("selected", true)}, 500);
            setTimeout(function (){jq('#threadtypes option:eq('+ ServerMoveType(jq('.cgtl.mbm tbody tr td').eq(4).text()) + ')').prop("selected", true)}, 250 * Checked_Ping);
            //选择生存
            setTimeout(function (){
            //判断是否选择了对应分类
                if( jq('select[name="threadtypeid"]').val() == ServerMoveValue(jq('.cgtl.mbm tbody tr td').eq(4).text()) ){
                    flag_Type_ServerPass = true;
                }else{
                    Checked_Ping++;
                    setTimeout(function (){checkServerMoveValue_ServerPass();}, 250 * Checked_Ping);
                }
            }, 250 * Checked_Ping);
        };
    }
    function checkMoveTrue_ServerPass(){
        //确认移动选项是否都正确(本函数为无限循环函数，每次执行延迟0.25秒)
        if (flag_Type_ServerPass == true && flag_Plate_ServerPass == true){
            //console.log('5');
            jq("textarea#reason").val('通过')
            //填充文本“通过”
            setTimeout(function (){jq("button#modsubmit").click()}, 250);
            //延迟0.25秒点击确认
        };
        setTimeout(function (){checkMoveTrue_ServerPass();}, 250);
    }
    function OneKeyPass_ToDo(){
    //一键通过，执行清单
        modthreads(2, 'move')
        //执行“移动”，弹出操作窗口
        setTimeout(function (){
            //等待1秒后执行
            checkServerType_ServerPass();
            //选择版块
            setTimeout(function (){
                checkServerMoveValue_ServerPass();
                //选择分类
                setTimeout(function (){
                    checkMoveTrue_ServerPass();
                    //执行“通过”
                }, 250);
            }, 250);
        }, 1000)
    }
    function SeverBusinessConditionsCheck(){
    //公益服判定
        if(flag_SeverBusinessConditionsWrite == true && flag_SeverBusinessConditionsValue == true){
            if((flag_Stamp_ServerBusiness == true && flag_Stamplist_ServerBusiness == true) || jq('div#threadstamp').find('img').attr("title") == "公益"){
                return true;
            }else{
                ServerBusiness_Stamplist_Check()
                //图标判定
            }
        }else{
            return false;
        }
    }
    var flag_Stamplist_ServerBusiness = false;
    function ServerBusiness_Stamplist_Check(){
    //公益服图标判定
        modaction('stamplist');
        setTimeout(function (){
            jq("#stamplist.ps").trigger("change")
            setTimeout(function (){
                if(jq('#stamplist.ps').val() == 18){
                    //如果有图标，就关闭
                    flag_Stamplist_ServerBusiness = true;
                    hideWindow('mods')
                    ServerBusiness_Stamp_Check();
                    //执行图章
                }else if(jq('#stamplist.ps').val() >= 0 && jq('#stamplist.ps').val() != ""){
                    //如果有其他图标(例如新人帖)，就给予公益图标
                    jq('#stamplist.ps option:eq(11)').prop("selected", true)
                    //eq(11)为公益图标
                    updatestamplistimg()
                    setTimeout(function (){
                        if(jq('#stamplist.ps').val() == 18){
                        //最后判断是否选择了公益服图标
                            flag_Stamplist_ServerBusiness = true;
                            jq("textarea#reason.pt").val('公益服图标')
                            setTimeout(function (){
                                jq("button#modsubmit.pn.pnc").click();
                                //按下按钮
                                location.reload();
                                //刷新
                            }, 250);
                        }else{
                            Checked_Ping++;
                            setTimeout(function (){ServerBusiness_Stamplist_Check();}, 250 * Checked_Ping);
                        }
                    }, 250 * Checked_Ping);
                }else{
                    //如果没有图标，就给予图标
                    jq('#stamplist.ps option:eq(10)').prop("selected", true)
                    //eq(10)为公益图标
                    updatestamplistimg()
                    setTimeout(function (){
                        if(jq('#stamplist.ps').val() == 18){
                        //最后判断是否选择了公益服图标
                            flag_Stamplist_ServerBusiness = true;
                            jq("textarea#reason.pt").val('公益服图标')
                            setTimeout(function (){
                                jq("button#modsubmit.pn.pnc").click();
                                //按下按钮
                                location.reload();
                                //刷新
                            }, 250);
                        }else{
                            Checked_Ping++;
                            setTimeout(function (){ServerBusiness_Stamplist_Check();}, 250 * Checked_Ping);
                        }
                    }, 250 * Checked_Ping);
                }
            }, 250 * Checked_Ping);
        }, 1000);
    }
    var flag_Stamp_ServerBusiness = false;
    function ServerBusiness_Stamp_Check(){
    //公益服图章判定
        modaction('stamp');
        setTimeout(function (){
            jq("#stampl.ps").trigger("change")
            setTimeout(function (){
                if(jq('#stamp.ps').val() == 22){
                    //如果有图章，就关闭
                    flag_Stamp_ServerBusiness = true;
                    hideWindow('mods')
                }else{
                    //如果没有图标，就给予图章
                    jq('#stamp.ps option:eq(10)').prop("selected", true)
                    //eq(10)为公益图章
                    updatestampimg()
                    setTimeout(function (){
                        if(jq('#stamp.ps').val() == 22){
                        //最后判断是否选择了公益服图章
                            flag_Stamp_ServerBusiness = true;
                            jq("textarea#reason.pt").val('公益服图章')
                            setTimeout(function (){
                                jq("button#modsubmit.pn.pnc").click();
                                //按下按钮
                                location.reload();
                                //刷新
                            }, 250);
                        }else{
                            Checked_Ping++;
                            setTimeout(function (){ServerBusiness_Stamplist_Check();}, 250 * Checked_Ping);
                        }
                    }, 250 * Checked_Ping);
                }
            }, 250 * Checked_Ping);
        }, 1000);
    }
    function OneKeyPass(){
        //一键通过开始
        if(flag_SeverBusinessConditionsWrite == true && flag_SeverBusinessConditionsValue == false){
            //商业服
            OneKeyPass_ToDo();
        }else if (SeverBusinessConditionsCheck()){
            //公益服
            OneKeyPass_ToDo();
        }
    }
    /*********************
     * ↑一键通过按钮结束↑ *
     ********************/
    /********************
     * ↓移回审核按钮开始↓ *
     *********************/
    var flag_Plate_ToReviewServer = false;
    var flag_Type_ToReviewServer = false;
    function checkServerType_ToReviewServer(){
        //确认版块选项是否正确(本函数为无限循环函数，首次延迟0.25秒，之后每次执行增加延迟0.25秒)
        if(flag_Plate_ToReviewServer == false){
            //console.log('3');
            jq("#moveto").trigger("change");
            setTimeout(function (){jq('#moveto optgroup:eq(5) option:eq(4)').prop("selected", true)}, 250 * Checked_Ping);
            //选择服务器审核版
            setTimeout(function (){
                if(jq('#moveto').val() == 296){
                //判断是否选择了服务器审核版
                    flag_Plate_ToReviewServer = true;
                }else{
                    Checked_Ping++;
                    setTimeout(function (){checkServerType_ToReviewServer();}, 250 * Checked_Ping);
                }
            }, 250 * Checked_Ping);
        };
    }
    function checkServerMoveValue_ToReviewServer(){
        //确认分类选项是否正确(本函数为无限循环函数，首次延迟0.25秒，之后每次执行增加延迟0.25秒)
        if(flag_Type_ToReviewServer == false){
            //console.log('4');
            jq("#moveto").trigger("change")
            setTimeout(function (){jq('#threadtypes option:eq(7)').prop("selected", true)}, 250 * Checked_Ping);
            //选择待编辑
            setTimeout(function (){
            //判断是否选择了待编辑分类
                if( jq('select[name="threadtypeid"]').val() == 590 ){
                    flag_Type_ToReviewServer = true;
                }else{
                    Checked_Ping++;
                    setTimeout(function (){checkServerMoveValue_ToReviewServer();}, 250 * Checked_Ping);
                }
            }, 250 * Checked_Ping);
        };
    }
    function checkMoveTrue_ToReviewServer(){
        //确认选项是否都正确(本函数为无限循环函数，每次执行延迟0.25秒)
        if (flag_Plate_ToReviewServer == true && flag_Type_ToReviewServer == true){
            //console.log('5');
            jq("textarea#reason").val('从服务器版移回服务器审核版重新编辑')
            //填充文本“通过”
            setTimeout(function (){jq("button#modsubmit").click()}, 250);
            //延迟0.25秒点击确认
        };
        setTimeout(function (){checkMoveTrue_ToReviewServer();}, 250);
    }
    function OneKeyMoveToReviewServer(){
        //一键通过开始
        modthreads(2, 'move')
        //执行“移动”，弹出操作窗口
        setTimeout(function (){
            //等待1秒后执行
            checkServerType_ToReviewServer();
            //选择版块
            setTimeout(function (){
                checkServerMoveValue_ToReviewServer();
                //选择分类
                setTimeout(function (){
                    checkMoveTrue_ToReviewServer();
                    //执行“通过”
                }, 250);
            }, 250);
        }, 1000)
    }
    /*********************
     * ↑一键移动按钮结束↑ *
     ********************/
    function OnyKeyRemoveMarks(){
        showWindow('rate', jq("a:contains(撤销评分)").attr('href'), 'get', -1);
        setTimeout(function (){
            var MarksLength = Number(jq("table.list").find("tr").length) - 1;
            jq(".pc").prop("checked", true);
            //勾选“全选”
            checkall(document.getElementById("rateform"), 'logid');
            //更新“全选”的勾选
            for(var Mark_i = 0 ; Mark_i < MarksLength; Mark_i++){
            //撤销评分的判定循环
                if(Number(jq("table.list").find(".xw1").eq(Mark_i).text()) < 0){
                //如果评分的数值为负
                    jq("input[name='logidarray[]']").eq(Mark_i).prop("checked", false);
                    //则取消撤销勾选
                }
            }
            jq(".px.vm").val('版规4-12：删帖时撤回所有正面评分');
            setTimeout(function (){jq("button.pn.pnc.vm[name='ratesubmit']").click()}, 250);
            //延迟0.25秒点击确认
        }, 1000)
    }

    function isNowPassOK(str){
    //判定是否能审核
        var ZZ1 = /待编辑|编辑中|讨论/;
        if(ZZ1.test(str)){
            return false;
        } else {
            return true;
        };
    }
    function checkServerTitleInForum(){
    //判定页面上的标题是否合格
        jq("th.common").each(function(){
            //用于判定标题是否合格
            //console.log(jq(".common").text());
            if(jq(this).parent().parent().find('a[title*="本版置顶主题"]').length <= 0 && jq(this).parent().parent().find('a[title*="分类置顶主题"]').length <= 0 && jq(this).parent().parent().find('a[title*="全局置顶主题"]').length <= 0){
                if(!isThisTitleJudged(jq(this).find(".s.xst").text())){
                    if(isNowPassOK(jq(this).text())){
                        //用于判定页面所有非编辑状态下的服务器帖的标题
                        TrueOrFalse(ReviewTitleZZ(jq(this).find(".s.xst").text()), jq(this).find(".s.xst"), '')
                    }else{
                        TrueOrFalsOrNull(0,jq(this).find(".s.xst"),'','');
                    };
                };
            };
            //console.log(jq(this).find(".s.xst").text());
        });
        jq("th.new").each(function(){
        //用于判定标题是否合格_new
            if(jq(this).parent().parent().find('a[title*="本版置顶主题"]').length <= 0 && jq(this).parent().parent().find('a[title*="分类置顶主题"]').length <= 0 && jq(this).parent().parent().find('a[title*="全局置顶主题"]').length <= 0){
                if(!isThisTitleJudged(jq(this).find(".s.xst").text())){
                    if(isNowPassOK(jq(this).text())){
                        TrueOrFalse(ReviewTitleZZ(jq(this).find(".s.xst").text()), jq(this).find(".s.xst"), '');
                    }else{
                        TrueOrFalsOrNull(0,jq(this).find(".s.xst"),'','');
                    };
                };
            };
        });
        ServerHighLightThreads();
    }
    function ServerHighLightThreads(){
        //感谢MCBBS Extender提供的思路
        jq("head").append(`<style id="ServerHighLightThreads">
                            .tl .icn.pass{
                                background-image: linear-gradient(90deg, rgba(022, 198, 012, 0.3), transparent);
                                border-left: 3px solid rgb(022, 198, 012);
                            }
                            .tl .icn.out{
                                background-image: linear-gradient(90deg, rgba(240, 058, 023, 0.3), transparent);
                                border-left: 3px solid rgb(240, 058, 023);
                            }
                            .tl .icn.wait{
                                background-image: linear-gradient(90deg, rgba(255, 200, 061, 0.3), transparent);
                                border-left: 3px solid rgb(255, 200, 061);
                            }
                            .tl .icn.closed{
                                background-image: linear-gradient(90deg, rgba(255, 129, 255, 0.3), transparent);
                                border-left: 3px solid rgb(255, 129, 255);
                            }
                            </style>`);
        jq('a[title*="关闭的主题"]').parent().addClass("closed");
        jq('th.common').find(".s.xst:contains('✅')").parent().parent().children(".icn").addClass("pass");
        jq('th.common').find(".s.xst:contains('❌')").parent().parent().children(".icn").addClass("out");
        jq('th.common').find(".s.xst:contains('🔔')").parent().parent().children(".icn").addClass("wait");
        jq('th.new').find(".s.xst:contains('✅')").parent().parent().children(".icn").addClass("pass");
        jq('th.new').find(".s.xst:contains('❌')").parent().parent().children(".icn").addClass("out");
        jq('th.new').find(".s.xst:contains('🔔')").parent().parent().children(".icn").addClass("wait");
    }
    function NextPageEventListener(_func){
        //用于监听下一页按钮，并重新审核标题
        if((jq('#autopbn').text() != '下一页 »') && (jq('#autopbn').css("display") !='none')){
            //console.log(1);
            setTimeout(function (){
                NextPageEventListener(_func);
            }, 250);
        }else{
            _func();
        }
    }
    function Old_point(){
        //积分还原
        var i = 0;
        jq(".pil.cl").each(function(){
            var str1 = jq(".pil.cl").eq(i).text();
            var str2 = jq(".i.y").children(".cl").eq(i).text();
            var jf = str2.match(/积分-?\d+/);
            var rq = str2.match(/人气-?\d+/);
            var gx = str2.match(/贡献-?\d+/);
            var ax = str2.match(/爱心-?\d+/);
            var jl = str1.match(/金粒-?\d+/);
            var bs = str1.match(/宝石-?\d+/);
            var zs = str2.match(/钻石-?\d+/);

            var jf_int = jf[0].match(/-?\d+/);
            var rq_int = rq[0].match(/-?\d+/);
            var gx_int = gx[0].match(/-?\d+/);
            var ax_int = ax[0].match(/-?\d+/);
            var jl_int = jl[0].match(/-?\d+/);
            var bs_int = bs[0].match(/-?\d+/);
            var zs_int = zs[0].match(/-?\d+/);

            var str3 = "<dt>积分</dt><dd>" + jf_int.toString() + "</dd>" +
                "<dt>人气</dt><dd>" + rq_int.toString() + " 点</dd>" +
                "<dt>贡献</dt><dd>" + gx_int.toString() + " 份</dd>" +
                "<dt>爱心</dt><dd>" + ax_int.toString() + " 心</dd>" +
                "<dt>金粒</dt><dd>" + jl_int.toString() + " 粒</dd>" +
                "<dt>绿宝石</dt><dd>" + bs_int.toString() + " 颗</dd>" +
                "<dt>钻石</dt><dd>" + zs_int.toString() + " 颗</dd>"
            jq(".pil.cl").eq(i).html(str3);
            i++;
        });
    }
    function Old_medal(){
        //勋章长度还原
        jq(".md_ctrl").css("max-height","5000px");
    }
    function CheckThreadIsFlashed(){
        //判定页面是否刷新
        jq('.t_f').eq(0).html(function(i,origText){
            return origText + '<div class="CheckThreadIsFlashed"></div>';
        });
    }
    /************************
     * 从这开始，为主函数
    **/
    var Flag_TitleTrue = true;
    var Flag_UserPoint_GX = true;
    var Flag_UserPoint_LBS = true;
    function js_main_thread_body(){
    //贴子内，内容检测
        Flag_UserPoint_GX = UserPointZZ(jq(".pil.cl dd").eq(2).text());
        TrueOrFalse(Flag_UserPoint_GX, jq(".pil.cl dd").eq(2), '');
        //eq(2)为贡献

        Flag_UserPoint_LBS = UserPointZZ(jq(".pil.cl dd").eq(5).text());
        TrueOrFalse(Flag_UserPoint_LBS, jq(".pil.cl dd").eq(5), '');
        //eq(5)为绿宝石

        TrueOrFalse(ServerTitleName(jq('#thread_subject').text(), jq(".cgtl.mbm tbody tr td").eq(0).text()) > 0 , jq(".cgtl.mbm tbody tr td").eq(0), '模板服务器名称与标题不符');
        //eq(0)为服务器名称
        //提取标题中的服务器名称后，和模板内服务器名称做对比

        ServerVersionTips(getServerVersion(jq('#thread_subject').text(), jq(".cgtl.mbm tbody tr td").eq(2).text()));
        //eq2为版本号
        //提取标题中的版本号后，和模板内版本号做对比

        jq('.t_f').find('font').each(function(){
            OnlyFalse(BodyFont_Size_Color(jq(this)), jq(this), '');
        });
        //console.log(flag_BodyTextSize);
        //用于debug输出是否有大于5号的字↑

        jq('.spoilerbody').each(function(){
            jq(this).css('display','block');
        })
        //展开所有的折叠页

        BodyFontFlag();
        //输出是否违规的tips

        CheckMultipleThread();
        //输出检查一服多贴的tips

        //console.log(jq(".cgtl.mbm tbody tr td").eq(14).text());
        //用于debug输出IP地址↑
        TrueOrFalse(ServerIPAddress(jq(".cgtl.mbm tbody tr td").eq(14).text()) >= 1 , jq(".cgtl.mbm tbody tr td").eq(14), '未在模板标注有效的IP地址/获取方式');
        //eq(14)为IP地址
        //使用正则来匹配IP地址

        TrueOrFalsOrNull(ServerClientDownload(jq(".cgtl.mbm tbody tr td").eq(11).text()) + ServerClientDownloadSet(jq(".cgtl.mbm tbody tr td").eq(9).text()), jq(".cgtl.mbm tbody tr td").eq(11), '未在模板标注有效的客户端下载地址', '记得测试一下是否有效');
        //eq(9)为服务器类型，eq(11)为客户端下载地址

        ThreeDifferentTips(ServerType(jq(".cgtl.mbm tbody tr td").eq(9).text()), jq(".cgtl.mbm tbody tr td").eq(9), '该服为“纯净”类型，注意Mod/插件', '', '只允许领域服选择“其他”类型');
        //eq(9)为服务器类型

        TrueOrFalsOrNull(SeverBusinessConditions(jq(".cgtl.mbm tbody tr td").eq(3).text(), jq('.t_f').text()), jq(".cgtl.mbm tbody tr td").eq(3), "公益服标语不合格", "需要注意其公益服标语");
        //eq(3)为服务器营利模式, jq('.t_f').text()为服务器内容

        BtnPass();
        //创建一键通过按钮

        /**
         * ↓↓最后执行↓↓
         */
        jq(".cgtl.mbm tbody tr td").each( function(){
            //用于判定模板是否有空
            OnlyFalse(isNull(jq(this).text()), jq(this), '该项为空');
        });

        //start_xx_j();
        //↑百度网盘有效性判断

    };
    function js_main_thread_head(){
    //帖子内，标题部分
        Flag_TitleTrue = ReviewTitleZZ(jq('#thread_subject').text());
        TrueOrFalse(Flag_TitleTrue, jq('#thread_subject'), '');
        //通过正则表达式判断标题是否正确

        BtnMoveToReviewServer();
        //创建一键移回服务器审核版重新编辑按钮

        BtnRemoveAllMarks();
        //创建一键撤销按钮
    };
    function js_main_thread_addEventListener(){
    //贴子内，监听项目
        jq(".BtnPass").click(function() {
        //监听一键通过按钮
            OneKeyPass();
        })

        jq(".BtnMoveToReviewServer").click(function() {
        //监听一键移回服务器审核版重新编辑按钮
            OneKeyMoveToReviewServer();
        })

        jq(".BtnRemoveAllMarks").click(function() {
        //监听一键撤销评分
            OnyKeyRemoveMarks();
        })
    };

    function js_main_forum(){
    //在版块时运行的函数
        checkServerTitleInForum();
        //用于判定页面所有服务器帖的标题
        try{
            document.getElementById('autopbn').addEventListener('click', function(e){
            //监听下一页按钮触发click时，再次审核一遍
                NextPageEventListener(checkServerTitleInForum);
            }, false);
        }catch(err){
            "none";
        };
    };

    jq(document).ready(function(){
        if (isNowInServerForum(jq(".bm.cl").html())) {
        //判定在服务器版，执行以下操作；
            CheckThreadIsFlashed();
            //用于检测页面是否被刷新
            Old_point();
            //还原旧版积分
            Old_medal();
            //勋章长度还原
            js_main_forum();
            //在版块时运行的函数
            js_main_thread_head();
            js_main_thread_body();
            js_main_thread_addEventListener();
            //在贴内的函数
            jq(".pl.bm").children("div").on('DOMNodeInserted',function(){
                //当内容被改变时，重新加载body部分函数
                if(jq(".CheckThreadIsFlashed").val() == undefined){
                    CheckThreadIsFlashed();
                    //用于检测页面是否被刷新
                    Old_point();
                    //还原旧版积分
                    Old_medal();
                    //勋章长度还原
                    js_main_thread_body();
                    //在贴内的函数
                }
            })
        }else{
        //判定不在服务器版，执行以下操作；
            CheckThreadIsFlashed();
            Old_point();
            //还原旧版积分
            Old_medal();
            //勋章长度还原
            jq(".pl.bm").children("div").on('DOMNodeInserted',function(){
                //当内容被改变时，重新加载body部分函数
                if(jq(".CheckThreadIsFlashed").val() == undefined){
                    CheckThreadIsFlashed();
                    //用于检测页面是否被刷新
                    Old_point();
                    //还原旧版积分
                    Old_medal();
                    //勋章长度还原
                }
            })
        };
    });
})();
