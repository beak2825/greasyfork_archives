// ==UserScript==
// @name          DMZJ Subscriber 动漫之家订阅助手
// @namespace     https://github.com/DriverHub/dmzj-assistant
// @version       0.1.3
// @description   提供动漫之家漫画的订阅批量导入导出功能
// @match         http://i.dmzj.com/*
// @match         http://manhua.dmzj.com/*
// @copyright     2016, DriverHub
// @author        UnluckyNinja, pa001024

// @grant         unsafeWindow
// @grant         GM_xmlhttpRequest
// @connect       self
// @connect       user.dmzj.com
// @connect       s.acg.178.com
// @downloadURL https://update.greasyfork.org/scripts/17078/DMZJ%20Subscriber%20%E5%8A%A8%E6%BC%AB%E4%B9%8B%E5%AE%B6%E8%AE%A2%E9%98%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/17078/DMZJ%20Subscriber%20%E5%8A%A8%E6%BC%AB%E4%B9%8B%E5%AE%B6%E8%AE%A2%E9%98%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// userscript for https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo
(function($, window) {
    // loadCSS start
    var styleRes = function() {
        /*
            #da_import_button, .dy_content_li{cursor: pointer;}
            .da_button{width: 400px; display:block; float:right;}
            div.popup {
                padding: 6px;
                position: relative;
                margin-top: 5px;
                left: calc(-50px);
                display: block;
                background-color: white;
                color: black;
                width: 200px;
                height: 100px;
                border: 1px solid #e6e6e6;
            }
            div.popup.import {
                left: -120px;
                height: 135px;
            }
            div.popup.import i.popup {
                right: 33px;
            }
            textarea.popup {
                display: block;
                width: 100%;
                height: 100px;
                color: black;
                font-size: small;
                overflow: hidden;
            }
            i.popup {
                position: absolute;
                display: inline-block;
                width: initial;
                height: initial;
                margin: 0;
                border: 10px solid;
                top: -20px;
                right: calc(100px - 10px);
                border-color: transparent;
                border-bottom-color: #e6e6e6;
            }
            #da_import_button {
                margin-right: 6px;
                padding-left: 4px;
                float: right;
                background: url(img/border.gif) no-repeat scroll -283px -46px;
                color: #fd3600;
                height: 20px;
                margin: 0 1px 0 0;
                padding: 3px 0 0 3px;
            }
            #import_button {
                position:relative;
                width: 50px;
                height: 30px;
                margin: 5px 0 0 0;
                float: left;
                left: calc(50% - 25px);
                font-size: small;
            }
            
        */
    };
    var myCSS = $("#ad_style");
    if (!myCSS.length)
        myCSS = $("<style id='ad_style'>").insertAfter($(document.body).find(":last"));
    var stylestr = styleRes.toString().replace(/^[\s\S]*?\/\*\s*|\s*\*\/[\s\S]*?$/g, "");
    myCSS.html(stylestr);
    // loadCSS end

    window.DmzjAssistant = {
        version: '0.1.3',
        auto_expand_enable: true,
        teleport_enable: false,
        choosing_enable: false,
        is_loading: false,
        cur_page: 1,
        uid: 0,
        over_subscribed: false,
        itemOnClick: function(event) {
            var item = $(event.currentTarget);
            item.find('div.dy_img').toggleClass("comic_chosen");
            item.toggleClass("on_choosing");
            item.hasClass('on_choosing') ? item.fadeTo('fast', 1) : item.fadeTo('fast', 0.3);
        },

        hideNonChosenItem: function(event) {
            var all_item = $('div.dy_content_li');
            all_item.not('.on_choosing').fadeTo('slow', 0.3);
        },

        subscribeAll: function(obj, callback) {
            this.over_subscribed = false;
            var self = this;
            if (!self.uid) {
                return;
            }
            console.log('dmzj助手 - 开始批量订阅漫画');
            var count = Object.keys(obj).length;
            var success_count = 0;
            var fail_count = 0;
            var finished = 0;
            var failed = {};
            $.each(obj, function(comic_id, v) {
                self.subscribe(self.uid, comic_id, v, function(comic_id, subscribe_status) {
                    finished += 1;
                    callback(comic_id, subscribe_status);
                    if (subscribe_status === 0) {
                        fail_count += 1;
                        failed[comic_id] = v;
                        console.log(`dmzj助手 - 漫画 ${v.name} 订阅失败 (${success_count}:${fail_count}/${finished})`);
                    }
                    else if (subscribe_status === 1) {
                        success_count += 1;
                        console.log(`dmzj助手 - 漫画 ${v.name} 订阅成功 (${success_count}:${fail_count}/${finished})`);
                    }
                    else if (subscribe_status === 2) {
                        fail_count += 1;
                        failed[comic_id] = v;
                        if (!self.over_subscribed) {
                            self.over_subscribed = true;
                            console.log(`dmzj助手 - 漫画 ${v.name} 无法订阅，超出订阅数量限制 (${success_count}:${fail_count}/${finished})`);
                        }
                    }
                    else if (subscribe_status === 3) {
                        success_count += 1;
                        console.log(`dmzj助手 - 漫画 ${v.name} 已经订阅 (${success_count}:${fail_count}/${finished})`);
                    }
                    if (finished == count) {
                        var text = `dmzj助手 - 批量订阅完成，${success_count} 成功 ${fail_count} 失败`;
                        if (Object.keys(failed).length == 0) {
                            alert(text);
                        }
                        else {
                            alert(text+'\n订阅失败的部分请在浏览器控制台窗口复制，重新尝试批量订阅');
                            console.log(JSON.stringify(failed));
                        }
                    }
                    else {
                        console.log(`dmzj助手 - 订阅进度 ${success_count}:${fail_count} / No. ${finished} / Total ${count}`);
                    }
                });
            });
        },

        subscribe: function(uid, comic_id, value, callback) {
            if (this.over_subscribed) {
                callback(comic_id, 2);
                return;
            }
            var self = this;
            var proxy_url = "http://s.acg.178.com/sns/comic_test.php?jsonpcallback=?";
            console.log('dmzj助手 - 正在订阅漫画 ' + value.name);
            // 避免跨域错误
            GM_xmlhttpRequest({
                url: 'http://user.dmzj.com/subscribe/sure/' + uid + '/mh/' + comic_id,
                method: 'GET',
                headers: {
                    'Referer': location.href
                },
                // overrideMimeType: 'text/plain',
                onerror: function(response) {
                    self.over_subscribed = true;
                    callback(comic_id, 0);
                    console.log('dmzj助手 - 请求异常，终止订阅');
                },
                onload: function(response) {
                    // 订阅查询
                    var string = response.responseText;
                    var match = string.match(/\((.)\)/);
                    if (match && match.length == 2 && match[1] == 1) {
                        callback(comic_id, 3);
                        return;
                    }
                    else if (!match || match.length != 2) {
                        console.log('dmzj助手 - 订阅漫画' + value.name + '时服务器返回数据异常');
                        callback(comic_id, 0);
                        return;
                    }
                    var dataobj = {
                        'operation': 'subscribe',
                        'comic_id': comic_id,
                        'uid': uid
                    };
                    // 真正订阅，jsonp
                    $.getJSON(proxy_url, dataobj, function(jsondata) {
                        callback(comic_id, jsondata.subscribe_status);
                    }).fail(function(jsondata) {
                        self.over_subscribed = true;
                        console.log('dmzj助手 - 请求异常，终止订阅');
                        callback(comic_id, 0);
                    });
                }
            });
        },

        subscribeFetch: function(data, callback, fail) {
            var url = "/ajax/my/subscribe";
            /* data 格式
            var data = {
                page: 2,
                type_id: "2", //1国漫2日漫3动画4轻小说，页面标签
                letter_id: "0", //首字母，0 ALL
                read_id: "1" //1全部更新，2未读更新
            };
            */
            $.post(url, data, function(text, status, jqxhr) {
                callback(text);
                console.log('dmzj助手 - 成功获取第' + data.page + '页订阅列表');
            }).fail(fail);
        },

        subscribeLoad: function(event) {
            var self = this;
            var pagefoot = $('#page_id');
            var should_load = function() {
                return self.isElementInViewport(pagefoot);
            };
            // 避免重复加载
            if (this.auto_expand_enable && should_load() && !self.is_loading) {
                self.is_loading = true;
                var type_id = $('.optioned').attr('value');
                var letter_id = $('.cur').attr('value');
                var read_id = $('.oped').attr('value');
                var data = {
                    'page': self.cur_page + 1,
                    'type_id': type_id,
                    'letter_id': letter_id,
                    'read_id': read_id
                };

                self.subscribeFetch(data, function(text) {
                    //初始检测
                    var target = $('#my_subscribe_id_' + self.cur_page);
                    if (target.length < 1) {
                        target = $('#my_subscribe_id');
                    }
                    // 添加内容
                    var newList = $(text);
                    self.cur_page += 1;
                    var container = $(`<div class="dy_content autoHeight" id="my_subscribe_id_${self.cur_page}" style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(230, 230, 230);"></div>`);
                    container.insertAfter(target).append(newList);
                    $('#my_subscribe_id_' + self.cur_page).append(newList);

                    // 动画效果与事件响应
                    if (self.choosing_enable) {
                        self.hideNonChosenItem();
                        $('#my_subscribe_id_' + self.cur_page + ' div.dy_content_li').click(function(event) {
                            self.itemOnClick(event);
                        });
                    }
                    else {
                        $('#my_subscribe_id_' + self.cur_page + ' div.dy_content_li').click(function(event) {
                            self.choosing_enable = true;
                            var item = $(event.currentTarget);
                            item.find('div.dy_img').toggleClass("comic_chosen");
                            item.addClass('on_choosing');

                            self.hideNonChosenItem(event);

                            $('div.dy_content_li').off('click').click(function(event) {
                                self.itemOnClick(event);
                            });
                        });
                    }
                    self.is_loading = false;
                }, function() {
                    self.is_loading = false;
                });

            }

        },
        // source: http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
        isElementInViewport: function(element) {

            //special bonus for those using jQuery
            if (typeof jQuery === "function" && element instanceof jQuery) {
                element = element[0];
            }

            var rect = element.getBoundingClientRect();

            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
            );
        },

        exportSubscribe: function() {
            var self = this;
            var result = {};
            if (self.choosing_enable) {
                $('.on_choosing .dy_r').each(function(index, element) {

                    var info = $(element).find('h3 a');
                    var name = info.text();
                    var url = info.attr('href').trim();
                    var id = $(element).find('a.qx').attr('value');
                    result[id] = {
                        'name': name,
                        'url': url
                    };
                });
            }
            return JSON.stringify(result);
        },

        importSubscribe: function(text) {
            var self = this;
            var obj = {};
            try {
                obj = JSON.parse(text);
                var all_clear = true;
                $.each(obj, function(k, v) {
                    if(k.match(/^\d+$/).length < 1){
                        all_clear = false;
                    }
                });
                if(!all_clear || Object.keys(obj).length == 0){
                    alert("JSON数据有误，请检查分享代码格式！");
                    return;
                }
            }
            catch (e) {
                console.log(e);
                alert("解析JSON发生异常，请检查分享代码格式！");
            }
            self.subscribeAll(obj, function(id, jsondata) {
                    // nothing to do
            });
        },
        popupTextArea: function(element, content, select) {
            var popup = $(`<div class="popup"><i class="popup"></i><textarea id="popup_text" class="popup">${content}</textarea></div>`)
                .insertAfter(element);
            if (select) {
                popup.find('textarea').focus().select();
            }
            return popup;
        }
    };

    var _da = window._da = window.DmzjAssistant;

    function enable_subscribe() {
        // 好像然并卵
        /*$('div.dy_content_li').on("load change", function() {
            if (_da.choosing_enable) {
                _da.hideNonChosenItem();
            }
        });*/
        // 触发自动续屏，一颗赛艇
        $(window).scroll(function(event) {
            _da.subscribeLoad(event);
        });

        // 添加一键导出按钮
        var origin = $('.sub_potion').css('display', 'inline-block');
        var new_tab = $('<ul class="sub_potion da_button">' +
            '<li><a href="javascript:;" id="clear_choose" class="sub_potion_li sub_type_id" value="1">清除选择</a></li>' +
            '<li><a href="javascript:;" id="expand_off" class="sub_potion_li sub_type_id" value="1">关闭滚动</a></li>' +
            '<li><a href="javascript:;" id="da_export" class="sub_potion_li sub_type_id" value="1">导出订阅</a></li>' +
            '<li><a href="javascript:;" id="da_import" class="sub_potion_li sub_type_id" value="1">批量订阅</a></li>' +
            '</ul>').insertAfter(origin);
        new_tab.find('#clear_choose').click(function(event) {
            if (_da.choosing_enable) {
                _da.choosing_enable = false;
                $('.on_choosing').removeClass('on_choosing');
                // the same as above one
                $('div.dy_content_li').off('click').click(function(event) {
                    _da.choosing_enable = true;
                    var item = $(event.currentTarget);
                    item.find('div.dy_img').toggleClass("comic_chosen");
                    item.addClass('on_choosing');

                    _da.hideNonChosenItem(event);

                    $('div.dy_content_li').off('click').click(function(event) {
                        _da.itemOnClick(event);
                    });
                });
                $('div.dy_content_li').fadeTo('slow', 1.0);
            }
        });
        new_tab.find('#expand_off').click(function(event) {
            if (_da.auto_expand_enable) {
                _da.auto_expand_enable = false;
                $(event.target).text('开启滚动');
            }
            else {
                _da.auto_expand_enable = true;
                $(event.target).text('关闭滚动');
            }
        });
        // 导出按钮
        new_tab.find('#da_export').click(function(event) {
            if (_da.choosing_enable) {
                var popup = _da.popupTextArea(event.currentTarget, _da.exportSubscribe(), true);
                popup.find('textarea').attr('readonly', true);
                popup.focusout(function(event) {
                    $(event.currentTarget).remove();
                });
            }
            else {
                alert('请先选择漫画！');
            }
        });
        // 导入按钮
        new_tab.find('#da_import').click(function(event) {
            if($('div.popup.import').length > 0 ){
                return;
            }
            var popup = _da.popupTextArea(event.currentTarget, '{}', false);
            popup.addClass('import');
            popup.mouseleave(function(event) {
                $('div.popup.import').remove();
            });
            $('<button id="import_button">提交</button>').appendTo(popup).click(function(event) {
                _da.importSubscribe($('#popup_text').val());
                popup.remove();
            });
        });
        // 首次点击隐藏其余元素
        $('.dy_content_li').ready(function(event) {
            $('.dy_content_li').click(function(event) {
                _da.choosing_enable = true;
                var item = $(event.currentTarget);
                item.find('.dy_img').toggleClass("comic_chosen");
                item.addClass('on_choosing');

                _da.hideNonChosenItem(event);

                $('.dy_content_li').off('click').click(function(event) {
                    _da.itemOnClick(event);
                });
            });
        });
    }

    function popupText(name, content) {
        var base = "data:text/html;charset=utf-8,";
        return open(base + content, name, 'height=300,width=1000');
    }

    function enable_import() {
        var button = $('<li class="history_tab s-nav3" id="da_import_button" target_div="subscribe_panel">' +
            '<span id="subscribe_tab">订阅导入</span></li>');
        $('li[target_div]').eq(0).after(button);
        button.click(function(event) {
            // _da.importOnClick(event); // 删掉了
        });
    }

    function enable_import2() {
        var button = $('<span class="update"><a href="javascript:;">订阅导入</a></span>');
        $('.anim_title_text').eq(0).after(button);
        button.click(function(event) {
            // _da.importOnClick(event);
        });
    }
    /*global Cookies*/

    function dmzj_init() {
        console.log('dmzj助手 - 正在启动');
        console.log('dmzj助手 - 判断用户登陆情况');

        // get UID
        if (window.userId) {
            var uid = window.userId;
        }
        else {
            var datas = Cookies.get('my');
            if (datas != null && datas != '') {
                var t = datas.split('|');
                uid = t[0];
            }
            else {
                uid = 0;
            }
        }

        if (uid) {
            console.log('dmzj助手 - 用户已登录，UID为' + uid);
        }
        else {
            console.log('dmzj助手 - 用户未登录，请先登录');
        }

        if (uid) {
            _da.uid = uid;
            /* //before 4/28 OLD
            var mh_found = $('#mh');
            var mh_clicked = $('#mh2');
            if (mh_found.length > 0 || mh_clicked.length > 0) {
                enable_subscribe();
            }*/
            var mh_found = $('#yc1.optioned');
            if (mh_found.length > 0) {
                enable_subscribe();
            }
            else {
                /*
                if (location.hostname == 'manhua.dmzj.com') {
                    if (location.pathname == '/') {
                        // enable_import();
                    }
                    else {
                        // enable_import2();
                    }
                }
                // enable_teleport();*/
            }
            console.log('dmzj助手 - 启动完成');
            console.log('dmzj助手 - v' + _da.version + ' repo: https://github.com/DriverHub/dmzj-assistant author: UnluckyNinja, pa001024');
        }
    }

    /*! js-cookie v2.1.0 | MIT */
    ! function(a) {
        if ("function" == typeof define && define.amd) define(a);
        else if ("object" == typeof exports) module.exports = a();
        else {
            var b = window.Cookies,
                c = window.Cookies = a();
            c.noConflict = function() {
                return window.Cookies = b, c
            }
        }
    }(function() {
        function a() {
            for (var a = 0, b = {}; a < arguments.length; a++) {
                var c = arguments[a];
                for (var d in c) b[d] = c[d]
            }
            return b
        }

        function b(c) {
            function d(b, e, f) {
                var g;
                if (arguments.length > 1) {
                    if (f = a({
                            path: "/"
                        }, d.defaults, f), "number" == typeof f.expires) {
                        var h = new Date;
                        h.setMilliseconds(h.getMilliseconds() + 864e5 * f.expires), f.expires = h
                    }
                    try {
                        g = JSON.stringify(e), /^[\{\[]/.test(g) && (e = g)
                    }
                    catch (i) {}
                    return e = c.write ? c.write(e, b) : encodeURIComponent(String(e)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), b = encodeURIComponent(String(b)), b = b.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent), b = b.replace(/[\(\)]/g, escape), document.cookie = [b, "=", e, f.expires && "; expires=" + f.expires.toUTCString(), f.path && "; path=" + f.path, f.domain && "; domain=" + f.domain, f.secure ? "; secure" : ""].join("")
                }
                b || (g = {});
                for (var j = document.cookie ? document.cookie.split("; ") : [], k = /(%[0-9A-Z]{2})+/g, l = 0; l < j.length; l++) {
                    var m = j[l].split("="),
                        n = m[0].replace(k, decodeURIComponent),
                        o = m.slice(1).join("=");
                    '"' === o.charAt(0) && (o = o.slice(1, -1));
                    try {
                        if (o = c.read ? c.read(o, n) : c(o, n) || o.replace(k, decodeURIComponent), this.json) try {
                            o = JSON.parse(o)
                        }
                        catch (i) {}
                        if (b === n) {
                            g = o;
                            break
                        }
                        b || (g[n] = o)
                    }
                    catch (i) {}
                }
                return g
            }
            return d.get = d.set = d, d.getJSON = function() {
                return d.apply({
                    json: !0
                }, [].slice.call(arguments))
            }, d.defaults = {}, d.remove = function(b, c) {
                d(b, "", a(c, {
                    expires: -1
                }))
            }, d.withConverter = b, d
        }
        return b(function() {})
    });


    $('body').ready(dmzj_init);

}).call(unsafeWindow || window, (unsafeWindow || window).$, unsafeWindow || window);