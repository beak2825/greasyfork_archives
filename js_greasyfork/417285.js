// ==UserScript==
// @name         轻之国度百度盘无提取码跳转
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @update       2021.09.22
// @description  在发布的百度网盘链接后添加一个无提取码跳转的链接，需要安装“百度盘分享提取码自动跳转”脚本，否则无法自动输入提取码。由于轻之国度发布者分享链接无固定格式，故可能无法识别到。如果无法识别，请将链接反馈给我，我将尽量适配。
// @author       charghet
// @grant        none
// @run-at  document-start
// @license GPL
// @include https://www.lightnovel.us/detail/*
// @include https://www.lightnovel.us/*/detail/*
// @downloadURL https://update.greasyfork.org/scripts/417285/%E8%BD%BB%E4%B9%8B%E5%9B%BD%E5%BA%A6%E7%99%BE%E5%BA%A6%E7%9B%98%E6%97%A0%E6%8F%90%E5%8F%96%E7%A0%81%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/417285/%E8%BD%BB%E4%B9%8B%E5%9B%BD%E5%BA%A6%E7%99%BE%E5%BA%A6%E7%9B%98%E6%97%A0%E6%8F%90%E5%8F%96%E7%A0%81%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    var end = false;
    document.onreadystatechange = function(){
        if(document.readyState = 'interactive' && !end){
            var f = function(){
                var i = 0;
                var a_list = document.getElementsByTagName('a')
                for(i = 0;i < a_list.length;i++)
                {
                    var aa = a_list[i]
                    var parent = aa.parentElement;
                    var href = aa.href
                    var index = -1;
                    if((index = href.indexOf("pan.baidu.com/s/")) != -1){
                        var id = href.substring(index+17,index+39);
                        var pwd = '';
                        var a = document.createElement('a');
                        a.target = "_blank";
                        a.innerText = '无提取码跳转';
                        a.href = "https://pan.baidu.com/share/init?surl="+id+"&pwd=";
                        var n = -1;
                        //提取码跟在链接后  测试链接：https://www.lightnovel.us/detail/975978
                        try{
                            var s = aa.nextSibling.data
                            if(s.length < 4){
                                s = aa.nextElementSibling.nextSibling.data
                            }
                            if((n = s.search(/[A-z0-9]{4}/)) != -1 && s.replace(/[A-z0-9]{4}/,'').search(/[A-z0-9]/) == -1){
                                pwd = s.substring(n,n+4);
                                a.href += pwd;
                                parent.insertBefore(a,aa.nextSibling.nextSibling)
                                continue;
                            }
                        }catch(e){};
                        //提取码为链接名 测试链接：https://www.lightnovel.us/detail/1087201
                        if(pwd == ''){
                            s = aa.innerText
                            if((n = s.search(/[A-z0-9]{4}/)) != -1 && s.replace(/[A-z0-9]{4}/,'').search(/[A-z0-9]/) == -1){
                                pwd = s.substring(n,n+4);
                                a.href += pwd;
                                parent.insertBefore(a,aa.nextSibling)
                                var t = document.createElement('text')
                                t.innerText = " "
                                parent.insertBefore(t,aa.nextSibling)
                            }
                        }
                        //提取码在链接中
                        if(pwd == ''){
                            href = href.substring(47);
                            if((n = href.search(/[A-z0-9]{4}/)) != -1 && href.replace(/[A-z0-9]{4}/,'').search(/[A-z0-9]/) == -1){
                                pwd = href.substring(n,n+4);
                                a.href += pwd;
                                parent.insertBefore(a,aa.nextSibling)
                                t = document.createElement('text')
                                t.innerText = " "
                                parent.insertBefore(t,aa.nextSibling)
                            }
                        }
                    }
                }
                end = true;
            }
            window.setTimeout(f, 0);
        }
    }
})();