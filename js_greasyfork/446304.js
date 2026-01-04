// ==UserScript==
// @name         Acfun直播观众助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Acfun直播间自动点赞（可设置下次进入直播间就直接开始自动点赞），自动发送弹幕（弹幕抽奖好帮手）；此脚本仅限个人学习交流，若侵犯到您的权益请联系删除。
// @author       czhen
// @license      MIT
// @match        https://live.acfun.cn/live/*
// @icon         https://cdn.aixifan.com/ico/favicon.ico
// @require      https://libs.baidu.com/jquery/1.11.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_notification
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/446304/Acfun%E7%9B%B4%E6%92%AD%E8%A7%82%E4%BC%97%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446304/Acfun%E7%9B%B4%E6%92%AD%E8%A7%82%E4%BC%97%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //格式化字符
    const tempName = 'acLive';
    //用户uid对应的cookie名
    const userCookie = 'auth_key';
    //显示的base64图片
    const imgBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAACXBIWXMAAAAAAAAAAQCEeRdzAAADAFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAAAhISEODg4TExM7OzsoKCgbGxs4ODgDAwP9/f0sLCwxMTE9PT1JSUk1NTUeHh4YGBgHBwdOTk4/Pz8lJSULCwt6enq+vr7z8/PU1NR3d3dzc3NGRkb29vZoaGj6+vr4+Pi6urqHh4eEhIS2traurq5UVFRRUVFBQUEvLy/R0dHMzMyrq6uYmJhra2tjY2MBAQHu7u7o6OjBwcGbm5uQkJB+fn5cXFzW1taxsbGBgYFubm6np6eUlJSKioplZWXw8PDY2Ni0tLTq6urk5OTg4ODa2tqMjIxfX19ZWVlDQ0Pe3t5YWFjs7OzOzs7Dw8PHx8ekpKTJycmioqLFxcWgoKCfn5+enp719fUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABJATM3AAABAHRSTlMA7w6Widt1PRoJBPrVzMK2bzgy48i8Zk8sIfbor3xdVhaknZBsSkSqJtH/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////loZ16AAADDFJREFUeJztWmdX20gXhoSQQnoC6T2b7N6rZrn3hjG2wd1gMNiYYjqE3glJ/vjekWTjDpx9c877Ic8HJFmaeTS33xEdHX/wB3/wB3/wf4c7j9/1dfe9u3nrN3I8fvjh6d0nN+697nr74vcwvO++AVX4582Fy7n215vrX3sffLj+8Mu1y3G86QHYjw+kjG7Jurc5tAzQ03W73YBnr1+ev1Ln9ccXUzy+C+Db9mAFnsQQwJObLQe8pQEwUiglLJZE4GyELr4+v4DjLcCMhabO8Q5LNhsdF3N0Yaah3R0df3/pe/Ppw4Pe3vv3e79+eqhYxeN/AHaL0vk7pTfDAG/acnwGOKUnXa70ji2mLH/yp4t+WADorVGUivsf6YExNrfd4i0lTXY9ndp+ADy405rjC0AAUReDktGsmy9PFaMXDdBx7WB2yjs2nUg6nXtL3oXYjJ9+LDiIIXAC4dHi2LbFbLQTjWUZ7rZkud0Dw4gpGus0irb4+RuPIy6NGbEevLm4RH+zJKB4WpBMVjFlsYg2es11uN+K5DqcIDpp0jAjma2Si6jNagwmxkNbe0H3uWVY9un+HG9MiUabTZLNO84Erc0PXc05bgHYUGJz/rKkRW6ozDBxmpBQSAwP7Q5WWJf743PTaQFxgF0FPOKOkXMG5qYlzmWdXtSjCaC5QX6CUcR+ZYqdtOjOq9NFsm7UFUfO56/CAIbYYZU4OHmIpAaZaZs1N7WKOAevmmrkJRjRogxec5lEaUQ5PTWhaWG9GQPABp9kh3BKSkmm8jNJyTkAIcRJeNuE5B30Ix6odita5TRbU8aJXPZXcwqALXXdMbtZ5g7KPw5+Y395HIcbTdUeRaP64LpslU0rAFlHLjDZigI2HFuq0HQuW6Du3jDq/fC+keQfSKFUnIofrMG+SbZaYXAPzd9bUtAr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';
    //js脚本操作实体
    let JSEntity = {
        //脚本是否可用
        isEnable: true,
        //添加样式
        addStyle: function () {
            let style = document.createElement('style');
            style.type = 'text/css';
            style.textContent = `
            .${tempName}-dom {
              position: absolute;
              z-index: 100;
              top: 108px;
              left: 50%;
            }
            #${tempName}-click {
             width: 50px;
             height: 50px;
             background-image:url(${imgBase64});
             background-size:100% 100%;
             background-position: center center;
             background-repeat:no-repeat;
             background-color: #fd4c5c;
             cursor: pointer;
             border:1px solid red;
             border-radius: 10px;
            }
            #${tempName}-click:hover {
              background-size:122% 122%;
            }
            #${tempName}-menu {
             z-index: 200;
             width: 400px;
             height: 160px;
             display:none;
             border-radius: 10px;
             background-color: #fd4c5c;
             color:#fff;
            }
            #${tempName}-menu dt {
              font-size:16px;
              font-weight:700;
              margin-bottom:5px;
              color:#ffefa2;
            }
            #${tempName}-menu label { cursor: pointer; }
            #${tempName}-menu input[type="checkbox"] {
              vertical-align:middle;
              width:16px;
              height:16px;
              cursor: pointer;
              margin-left:0;
              margin-right:3px;
            }
            #${tempName}-menu input[type="number"] {
              vertical-align:middle;
              width:30%;
              height:18px;
              font-size:16px;
              padding-top:2px;
              padding-left:5px;
              border:1px solid #767676;
              border-radius: 5px;
              margin-left:0;
              margin-right:3px;
            }
            #${tempName}-menu > .menu-box {
              height:72%;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              align-content: stretch;
            }
            #${tempName}-menu > .menu-box > .menu-item {
              box-sizing: border-box;
              width: 50%;
              padding:2%;
              border: 1px dashed #ffbc00;
              border-radius:10px;
            }
            #${tempName}-menu button {
              cursor: pointer;
            }
            #${tempName}-menu dd.action-btns {
              margin-top: 5px;
              text-align:center;
            }
            #${tempName}-menu > .menu-btns {
              margin-top: 12px;
              text-align:center;
            }
            input.intervalTime::-webkit-outer-spin-button {
              -webkit-appearance: none;
            }
            input.intervalTime::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }
            input.intervalTime {
              -moz-appearance: textfield;
            }
            `;
            document.head.appendChild(style);
        },
        //添加dom节点
        addDom: function () {
            let addHtml = `
        <div class="${tempName}-dom" id="${tempName}-click" title="点击我打开菜单栏"></div>
        <div class="${tempName}-dom" id="${tempName}-menu">
            <div class="menu-box">
                <div class="menu-item" id="${tempName}-likeItem">
                    <dl>
                        <dt>自动点赞</dt>
                        <dd title="每隔多少秒执行一次自动点赞"><input type="number" value="10" class="intervalTime" />间隔秒数</dd>
                        <dd title="勾选表示下次进入当前直播间后就会直接开始自动点赞"><label><input type="checkbox" class="isAuto" />下次进入自动点赞</label></dd>
                        <dd class="action-btns">
                            <button type="button" data-type="likestart">开始点赞</button>
                            <button type="button" data-type="likeend">取消点赞</button>
                        </dd>
                    </dl>
                </div>
                <div class="menu-item" id="${tempName}-commentItem">
                    <dl>
                        <dt>自动弹幕</dt>
                        <dd title="每隔多少秒发送一次弹幕"><input type="number" value="10" class="intervalTime" />间隔秒数</dd>
                        <dd class="action-btns">
                            <button type="button" data-type="commentstart">开始弹幕</button>
                            <button type="button" data-type="commentend">取消弹幕</button>
                        </dd>
                    </dl>
                </div>
            </div>
            <div class="menu-btns">
                <button type="button" data-type="close">关闭弹窗</button>
            </div>
        </div>
`;
            //添加操作菜单
            $('body').append(addHtml);

            //添加点赞次数
            $('.author-info-detail').append(`<div style="color:red;font-size:18px;margin-left:15px;" title="已点赞次数">+<b id="${tempName}-likeCount">0</b></div>`);
        },
        //点赞相关功能
        likeUnits: {
            //点赞按钮
            btn: null,
            //点赞次数
            count: 0,
            //点赞计时器
            timer: null,
            //执行点赞的方法
            exeFn: function () {
                let _this = this;
                _this.btn.click();
                _this.count++;
                $(`#${tempName}-likeCount`).text(_this.count);
            },
            //自动开始点赞
            autoStart: function (num) {
                let _this = this;
                let _p = JSEntity.publicUnits;

                _this.btn = $('.author-interactive-area >.like-btn');

                //未找到点赞按钮，直接返回
                if (!_this.btn) {
                    //发送失败通知
                    _p.showPageNotify('自动点赞功能 开启失败！\nX﹏X');
                    return false;
                };

                //发送通知
                _p.showPageNotify('开启 自动点赞功能！\n（づ￣3￣）づ╭❤～');

                //直接先触发一次点赞事件
                _this.exeFn();

                //初始化计时器开始连续点赞
                _this.timer = setInterval(function () {
                    _this.exeFn();
                }, num * 1000);

                //发送弹幕
                JSEntity.commentUnits.inputVal('请组织放心，我已开启自动点赞！为' + (_p.upNickName) + '疯狂打CALL！！！');
                $('.wrap-bottom-area > .send-btn').click();
            },
            //开始点赞
            start: function () {
                let _this = this;
                let _p = JSEntity.publicUnits;
                _this.btn = $('.author-interactive-area >.like-btn');
                //未找到点赞按钮，直接返回
                if (!_this.btn) {
                    //发送失败通知
                    _p.showPageNotify('自动点赞功能 开启失败！\nX﹏X');
                    return false;
                };
                //隐藏菜单
                _p.toggleMenu(0);

                //发送通知
                _p.showPageNotify('开启 自动点赞功能！\n（づ￣3￣）づ╭❤～');

                //直接先触发一次点赞事件
                _this.exeFn();

                //获取计时器时间间隔
                let val = $(`#${tempName}-likeItem`).find('input.intervalTime').val();
                let num = Number(val) || 10;
                if (num < 1) num = 1;

                //先清除原有计时器
                _this.timer && clearInterval(_this.timer);
                //初始化计时器开始连续点赞
                _this.timer = setInterval(function () {
                    _this.exeFn();
                }, num * 1000);

                //是否下次进入直播间就自动开始点赞
                let isAuto = $(`#${tempName}-likeItem`).find('input.isAuto').prop('checked');

                //存储本地数据
                _p.setValue('like', { intervalTime: num, isAuto: isAuto });
            },
            //取消点赞
            end: function () {
                let _this = this;
                let _p = JSEntity.publicUnits;
                //隐藏菜单
                _p.toggleMenu(0);

                //发送通知
                _p.showPageNotify('关闭 自动点赞功能！\nヾ(￣▽￣)Bye~Bye~');

                //清除计时器
                if (_this.timer) {
                    clearInterval(_this.timer);
                    _this.timer = null;
                };

                //还原本地存储为默认数据
                let def = _p.defStorageOptions.like;
                _p.setValue('like', def);
            }
        },
        //发送弹幕相关功能
        commentUnits: {
            //弹幕发送按钮
            btn: null,
            //弹幕内容文本框
            textarea: null,
            //输入的弹幕内容
            content: null,
            //自动发送弹幕次数
            count: 0,
            //发送弹幕计时器
            timer: null,
            //填入弹幕内容
            inputVal: function (val) {
                let _this = this;
                if (!_this.textarea) _this.textarea = $('.danmaku-input-wrap >textarea');
                _this.textarea.val(val);
                let event = new Event('input', { bubbles: true });
                let tracker = _this.textarea[0]._valueTracker;
                if (tracker) tracker.setValue('');
                _this.textarea[0].dispatchEvent(event);
            },
            //执行发送弹幕的方法
            exeFn: function () {
                let _this = this;
                _this.btn.click();
                _this.count++;
                _this.inputVal(_this.content);
            },
            //开始发送弹幕
            start: function () {
                let _this = this;
                let _p = JSEntity.publicUnits;
                _this.btn = $('.wrap-bottom-area > .send-btn');
                //未找到发送弹幕按钮，直接返回
                if (!_this.btn) {
                    //发送失败通知
                    _p.showPageNotify('自动发送弹幕功能 开启失败！\nX﹏X');
                    return false;
                };
                _this.textarea = $('.danmaku-input-wrap >textarea');
                _this.content = _this.textarea.val();
                //没有要发送的弹幕内容，直接返回
                if (!_this.btn.hasClass('enable') || !_this.content) {
                    //发送失败通知
                    _p.showPageNotify('没有装填弹幕，这让我很难搞啊！\n请先在右下角评论框中输入弹幕！\n ┗( T﹏T )┛');
                    _this.textarea.focus();
                    return false;
                };

                //隐藏菜单
                _p.toggleMenu(0);

                //发送通知
                _p.showPageNotify('开启 自动发送弹幕功能！\n(o゜▽゜)o☆');

                //直接先触发一次弹幕发送事件
                _this.exeFn();

                //获取计时器时间间隔
                let val = $(`#${tempName}-commentItem`).find('input.intervalTime').val();
                let num = (Number(val) || 10);
                if (num < 0.1) num = 0.1;

                //先清除原有计时器
                _this.timer && clearInterval(_this.timer);
                //初始化计时器开始连续发送弹幕
                _this.timer = setInterval(function () {
                    _this.exeFn();
                }, num * 1000);

                //存储本地数据
                _p.setValue('comment', { intervalTime: num });
            },
            //取消发送弹幕
            end: function () {
                let _this = this;
                let _p = JSEntity.publicUnits;
                //隐藏菜单
                _p.toggleMenu(0);

                //发送通知
                _p.showPageNotify('关闭 自动发送弹幕功能！\nヾ(￣▽￣)Bye~Bye~');

                //清除计时器
                if (_this.timer) {
                    clearInterval(_this.timer);
                    _this.timer = null;
                };

                //还原本地存储为默认数据
                let def = _p.defStorageOptions.comment;
                _p.setValue('comment', def);
            }
        },
        //公用相关功能
        publicUnits: {
            //脚本名称
            scriptName: null,
            //主播uid
            upUid: null,
            //主播昵称
            upNickName: null,
            //主播头像
            upPhoto: null,
            //当前登录用户uid
            userUid: null,
            //当前直播间的本地存储名称
            storageName: null,
            //桌面通知默认配置
            defNotifyOptions: {
                title: 'ACFUN',
                text: '通知信息',
                image: 'https://cdn.aixifan.com/ico/favicon.ico',
                highlight: true,
                timeout: 60000
            },
            //本地存储默认配置
            defStorageOptions: {
                like: {
                    intervalTime: 10,
                    isAuto: false
                },
                comment: {
                    intervalTime: 10
                }
            },
            //显示/隐藏菜单
            toggleMenu: function (type) {
                let $menu = $(`#${tempName}-menu`);
                if (type === 1) {
                    $menu.show();
                } else {
                    $menu.hide();
                }
            },
            //显示桌面通知基础方法
            showNotify: function (options) {
                if (!options) return false;
                if (typeof options === 'string') options = { text: options };
                let config = $.extend({}, JSEntity.publicUnits.defNotifyOptions, options);
                GM_notification(config);
            },
            //显示当前页面的桌面通知（带着主播头像和昵称）
            showPageNotify: function (text) {
                let _this = this;
                _this.showNotify({
                    title: `${_this.upNickName}的直播间`,
                    text: text,
                    image: `${_this.upPhoto}`
                });
            },
            //设置本地存储的数据
            setValue: function (type, value) {
                let _this = this;
                let typeData = {};
                typeData[type] = value;

                let oldValue = _this.getValue();
                let newValue = $.extend(true, {}, oldValue, typeData);
                GM_setValue(_this.storageName, newValue);
            },
            //获取本地存储
            getValue: function () {
                let _this = this;
                return GM_getValue(_this.storageName, _this.defStorageOptions);
            },
            //删除本地存储
            deleteValue: function (name) {
                let _this = this;
                GM_deleteValue(name || _this.storageName);
            },
            //清空本地存储
            clearValue: function () {
                let _this = this;
                let list = GM_listValues();
                if (list.length > 0) {
                    list.forEach(function (item) {
                        _this.deleteValue(item);
                    });
                };
            }
        },
        //绑定事件
        bindEvents: function () {
            //显示菜单
            $(`#${tempName}-click`).click(function () {
                JSEntity.publicUnits.toggleMenu(1);
            });
            //菜单按钮点击
            $(`#${tempName}-menu button`).click(function () {
                let $btn = $(this),
                    type = $btn.data('type');
                switch (type) {
                    case 'likestart':
                        JSEntity.likeUnits.start();
                        break;
                    case 'likeend':
                        JSEntity.likeUnits.end();
                        break;
                    case 'commentstart':
                        JSEntity.commentUnits.start();
                        break;
                    case 'commentend':
                        JSEntity.commentUnits.end();
                        break;
                    default:
                        JSEntity.publicUnits.toggleMenu(0);
                        break;
                }
            });
        },
        initData: function () {
            let publicUnits = JSEntity.publicUnits;
            //脚本名称
            publicUnits.scriptName = publicUnits.defNotifyOptions.title = GM_info.script.name;

            //登录用户uid
            let userUid = document.cookie.match(`[;\s+]?${userCookie}=([^;]*)`)?.pop();
            if (!userUid) {
                publicUnits.showNotify('没登录还想调戏我！ ╮（╯＿╰）╭');
                JSEntity.isEnable = false;
                return false;
            };
            publicUnits.userUid = userUid;

            //主播uid
            publicUnits.upUid = window.location.href.split('/live/')[1];
            //主播昵称
            publicUnits.upNickName = $('.author-info-detail').find('a.up-name').text();
            //主播头像
            publicUnits.upPhoto = $('.live-author-avatar').find('img.live-author-avatar-img').attr('src');

            //存储名称
            publicUnits.storageName = `${tempName}_${publicUnits.upUid}`;
        },
        //初始化本地存储
        initStorage: function () {
            //获取当前直播间的本地存储数据
            let storage = JSEntity.publicUnits.getValue();
            //根据本地存储的数据设置页面元素的值
            for (let key in storage) {
                let json = storage[key];
                if (key === 'like') {
                    let $item = $(`#${tempName}-likeItem`);
                    $('input.intervalTime', $item).val(json.intervalTime);
                    if (json.isAuto) {
                        //如果勾选了下次自动点赞，直接开始执行自动点赞事件
                        $('input.isAuto', $item).prop('checked', true);
                        //在页面全部加载完成之后再开始点赞，一开始点赞按钮还没加载
                        $(window).load(function () {
                            JSEntity.likeUnits.autoStart(json.intervalTime);
                        });
                    }
                } else {
                    let $item = $(`#${tempName}-commentItem`);
                    $('input.intervalTime', $item).val(json.intervalTime);
                }
            };
        },
        //注册脚本菜单
        registerMenuCmd: function () {
            let _this = this;
            GM_registerMenuCommand("清空本地存储", function () {
                let publicUnits = _this.publicUnits;
                publicUnits.clearValue();
                publicUnits.showNotify('本地存储已清空！\n所有直播间的设置都没了~\n (。﹏。*)');
            });
            GM_registerMenuCommand("帮助中心", function () {
                alert('脚本用法及介绍请至A站文章区搜索“' + (JSEntity.publicUnits.scriptName) + '”\r\n联系作者：wx784354310（微信）');
            });
        },
        //初始化所有数据
        initAll: function () {
            this.initData();
            if (!this.isEnable) return false;
            this.addStyle();
            this.addDom();
            this.initStorage();
            this.bindEvents();
            this.registerMenuCmd();
        }
    };
    JSEntity.initAll();

})();