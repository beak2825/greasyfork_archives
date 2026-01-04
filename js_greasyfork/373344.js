// ==UserScript==
// @name         隐心百度云盘钥匙
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  百度云盘钥匙，主要功能有：1、打开百度云盘链接地址时，会自动获取提取码填入，并会自动提交，一键打开分享链接，方便快捷；2、浏览任何网页时，只要包含百度云盘分享链接，都会在页面左上角显示链接是否有效，如果有效则会显示提取码。
// @author       Yisin
// @match        *://pan.baidu.com/*
// @match        *://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      meek.com.cn
// @connect      ip.cn
// @downloadURL https://update.greasyfork.org/scripts/373344/%E9%9A%90%E5%BF%83%E7%99%BE%E5%BA%A6%E4%BA%91%E7%9B%98%E9%92%A5%E5%8C%99.user.js
// @updateURL https://update.greasyfork.org/scripts/373344/%E9%9A%90%E5%BF%83%E7%99%BE%E5%BA%A6%E4%BA%91%E7%9B%98%E9%92%A5%E5%8C%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var isBDY = false;
    var URL_STORE = {};
    var CK_DATA = {};
    var EC = new EventControl();
    var PAN_S = 'https://pan.baidu.com/s/';
    var PAN_S1 = '//pan.baidu.com/s/';
    var PAN_I = 'https://pan.baidu.com/share/init?surl=';
    var PAN_I1 = '//pan.baidu.com/share/init';

    function getLocationKey(){
        var key = "";
        var url = document.location.href;
        if(url.indexOf(PAN_S1) != -1){
           key = document.location.pathname.substring(4);
        } else if(url.indexOf(PAN_I1) != -1){
           key = getUrlParam(null, "surl");
        }
        if(/^1[^\s]+/g.test(key)){
            key = key.substring(1);
        }
        return key;
    }

    function getUrlKey(url){
        var key = "";
        if(url.indexOf(PAN_S1) != -1){
           key = url.substring(url.indexOf(PAN_S1) + 18);
        } else if(url.indexOf(PAN_I1) != -1){
           key = getUrlParam(url, "surl");
        }
        if(/^1[^\s]+/g.test(key)){
            key = key.substring(1);
        }
        console.info("===>" + key);
        return key;
    }

    function getUrlParam(u, param) {
        var url = u || location.href;
        var reg = new RegExp("(" + param + ")=([^&#]*)", "g"),
            matched = url.match(reg);

        return matched && matched[0] ? matched[0].replace(param + "=", "") : null;
    }

    function LoadPass(bdyKey, purl, callback){
        var bdyUrl = purl.indexOf(PAN_I1) != -1 ? PAN_I + bdyKey : PAN_S + bdyKey;
        var bdyPass = "";
        if(window.localStorage){
            bdyPass = localStorage.getItem(bdyUrl);
            if(!bdyPass || bdyPass.length < 4){
                var hashs = document.location.hash;
                var ret = hashs.match(/^(#tqm=[0-9a-zA-Z]{4})/g);
                if(ret && ret.length){
                    bdyPass = ret[0].substring(5);
                }
            }
        }
        if(bdyPass && bdyPass.length == 4){
            console.info(bdyUrl,"->",bdyPass);
            if(callback){
                callback(bdyPass);
            }
            if(isBDY){
                $('.verify-input input').val(bdyPass);
                $('.g-button.g-button-blue-large').click();
                return;
            }
        } else {
            var weburl = 'http://ypsuperkey.meek.com.cn/api/items/BDY-' + bdyKey + '?access_key=4fxNbkKKJX2pAm3b8AEu2zT5d2MbqGbD&client_version=web-client&' + new Date().getTime();
            GM_xmlhttpRequest({
                method: 'GET',
                url: weburl,
                headers: {"Accept": "application/json"},
                contentType: "application/json",
                dataType: 'json',
                onload: function(response){
                    if(response.statusText == 'OK'){
                        try{
                            var res = JSON.parse(response.responseText);
                            bdyPass = res.access_code;
                            console.info(bdyUrl,"->",bdyPass);
                            if(bdyPass && bdyPass.length == 4){
                                if(window.localStorage){
                                    localStorage.setItem(bdyUrl, bdyPass);
                                }
                                if(isBDY){
                                    $('.verify-input input').val(bdyPass);
                                    $('.g-button.g-button-blue-large').click();
                                    return;
                                }
                            }
                            if(callback){
                                callback(bdyPass);
                            } else {
                                autoGet(bdyUrl);
                            }
                        }catch(e){}
                    } else if(callback){
                        callback(bdyPass);
                    } else {
                        autoGet(bdyUrl);
                    }
                }
            });
        }
    }

    function CheckUrl(weburl, callback){
        GM_xmlhttpRequest({
            method: 'GET',
            url: weburl,
            contentType: "text/html",
            onload: function(response){
                if(response.statusText == 'OK' && response.responseText){
                    //
                   if(/分享的文件已经被取消了/g.test(response.responseText) || /此链接分享内容可能因为涉及侵权/g.test(response.responseText)
                      || /啊哦，邀请链接已失效/g.test(response.responseText) || /啊哦，你所访问的页面不存在了/g.test(response.responseText)
                     || /分享的文件已经被删除了/g.test(response.responseText)){
                       callback(false);
                   } else {
                       callback(true);
                   }
                } else {
                    callback(false);
                }
            }
        });
    }

    function ShowBDYPass(url, pass){
        if(URL_STORE[url]){
            return;
        }
        pass = pass || "";
        var px = pass;
        URL_STORE[url] = pass;
        var $div = $('#__BDY-DIV-BOX');
        var $list = {};
        var $box = {};
        var $btn = {};
        if(!$div.length){
            $div = $('<div id="__BDY-DIV-BOX"><div class="____list"></div><div class="____btnbox"><div class="____btn" style="width:22px;height:22px;line-height:20px;text-align:center;border:1px solid #dddddd;background:#ffffff;cursor:pointer;" title="关闭窗口">X</div></div></div>');
            $('html').append($div);
            $list = $div.find('.____list');
            $box = $div.find('.____btnbox');
            $btn = $div.find('.____btnbox .____btn');
            $div.css({
                "position": "fixed",
                "width": "510px",
                "height": "23px",
                "overflow": "hidden",
                "font-size": "13px",
                "top": '2px',
                "left": '-490px',
                "border": "1px solid #999999",
                "background": "#ffffff",
                "border-radius": '5px',
                "box-shadow": '#999999 2px 2px 4px',
                "color": "#5555ff",
                "z-index": 9999999,
                "opacity": '0.5'
            });
            $list.css({
                "width": "450px",
                "height": "auto",
                "padding": "10px",
                "float": 'left'
            });
            $box.css({
                "width": "23px",
                "height": "auto",
                "padding": "0",
                "float": 'right'
            });
            $div.hover(function(){
                $div.css({
                    'left': '2px',
                    "height": "100px",
                    "overflow": "auto",
                    "opacity": '1'
                });
                $box.css({
                    "float": 'left',
                    "margin-top": "2px"
                });
            }, function(){
                $div.css({
                    'left': "-490px",
                    "height": "23px",
                    "overflow": "hidden",
                    "opacity": '0.5'
                });
                $box.css({
                    "float": 'right',
                    "margin-top": 0
                });
            });
            $btn.hover(function(){
                $btn.css({
                    "background": '#eeeeee',
                    "border": '1px solid #ddcccc',
                    "color": "#ff0000"
                });
            }, function(){
                $btn.css({
                    "background": '#ffffff',
                    "border": '1px solid #dddddd',
                    "color": "#000000"
                });
            });
            $btn.on('click', function(){
                $div.hide();
            });
        } else {
            $list = $div.find('.____list');
            $box = $div.find('.____btnbox');
            $btn = $div.find('.____btnbox button');
        }
        var color = '#000000';
        if(pass == '链接已失效'){
            pass = '，' + pass;
            color = '#ff0000';
        } else if(pass){
            pass = '，提取码：' + pass;
            color = '#55aa55';
        }
        $list.append('<div style="line-height:18px;"><a href="'+url+'#tqm='+px+'" target="_blank" style="color:'+color+'">' + url + '</a>' + pass + '</div>');

        autoGet(url);
    }

    function autoGet(url){
        if(isBDY){
            $('.verify-input input').on('blur', function(){
                var code = $(this).val();
                if(code && code.length == 4){
                   if(window.localStorage){
                       localStorage.setItem(url, code);
                   }
                }
            });
        }
    }

    function BaiduPan(url){
        this.url = url;
        this.code = '';
    }

    BaiduPan.prototype = {
        load: function(){
            var that = this;
            var bdyKey = getUrlKey(that.url);
            if(!bdyKey){return}
            var res = CK_DATA[that.url];
            if(res){
                if(res.suc){
                    LoadPass(bdyKey, that.url, function(pass){
                        ShowBDYPass(that.url, that.getPagePass(pass));
                    });
                } else {
                    ShowBDYPass(that.url, "链接已失效");
                }
            } else {
                CheckUrl(that.url, function(suc){
                    if(suc){
                        CK_DATA[that.url] = {"suc": true};
                        LoadPass(bdyKey, that.url, function(pass){
                            ShowBDYPass(that.url, that.getPagePass(pass));
                        });
                    } else {
                        CK_DATA[that.url] = {"suc": false};
                        ShowBDYPass(that.url, "链接已失效");
                    }
                });
            }
        },
        getPagePass: function(pass){
            if(!pass){
                var that = this;
                $('body *').each(function(){
                    var $t = $(this);
                    var str = $t.text();
                    if(str.indexOf(that.url) != -1 && str.indexOf("提取码") != -1){
                        str = str.substring(str.indexOf("提取码"));
                        var groups = str.match(/[0-9a-zA-Z]{4}/g);
                        if(groups && groups.length){
                            pass = groups[0];
                        }
                    } else if(str.indexOf(that.url) != -1){
                        str = $t.parent().parent().text();
                        if(str.indexOf("提取码") != -1){
                            str = str.substring(str.indexOf("提取码"));
                            var matchs = str.match(/[0-9a-zA-Z]{4}/g);
                            if(matchs && matchs.length){
                                pass = matchs[0];
                            }
                        }
                    }
                    if(!pass) return pass;
                    if(window.localStorage){
                        localStorage.setItem(that.url, pass);
                    }
                });
            }
            return pass;
        }
    };

    function EventControl(){
        this.EVENTS = {};
    }
    EventControl.prototype = {
        reg: function(name, callback){
            this.EVENTS[name] = callback;
        },
        call: function(name, arg0, arg1, arg2, arg3){
            this.EVENTS[name] && this.EVENTS[name].call(arg0, arg1, arg2, arg3);
        }
    };

    if(/^(http|https):\/\/pan.baidu.com\//g.test(document.location.href)){
        isBDY = true;
        var bdyKey = getLocationKey();
        if(bdyKey){
             LoadPass(bdyKey, document.location.href);
        }
    } else {
        var html = $('body').html();
        if(html){
            var arrs = html.match(/pan.baidu.com\/s\/[a-zA-Z0-9_-]+/g);
            if(arrs && arrs.length){
                var index = 0;
                for(var i = 0; i < arrs.length; i++){
                    var bp = new BaiduPan("https://" + arrs[i]);
                    setTimeout(function(){bp.load();}, 1);
                }
            }
            arrs = html.match(/pan.baidu.com\/share\/init\?surl=[a-zA-Z0-9_-]+/g);
            if(arrs && arrs.length){
                index = 0;
                for(var j = 0; j < arrs.length; j++){
                    var bp2 = new BaiduPan("https://" + arrs[j]);
                    setTimeout(function(){bp2.load();}, 1);
                }
            }
        }
    }


})();