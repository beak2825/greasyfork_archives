// ==UserScript==
// @name         DDNSTO自动续期
// @icon         https://www.ddnsto.com/app/favicon.ico
// @namespace    http://www.ddnsto.com/
// @version      0.1.5
// @description  路由器插件ddnsto免费套餐续期。
// @author       everstu
// @match        *://web.ddnsto.com/*
// @match        *://www.ddnsto.com/*
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/layer/3.5.1/layer.min.js
// @grant        unsafeWindow
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/431608/DDNSTO%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/431608/DDNSTO%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%9C%9F.meta.js
// ==/UserScript==

(function () {
        'use strict';
        $('head').append('<link href="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layer/3.5.1/theme/default/layer.min.css" rel="stylesheet">')

        setTimeout(function () {
            let myHref = window.location.href;
            let urlObj = new URL(myHref);
            let product, userprd, requestUrl, requestData, is_async, method;
            let nowTime = Date.now();
            let daySeconds = 24 * 60 * 60 * 1000;//每天有多少毫秒
            let feeDiff = parseInt(getStorge('feeDiff'));
            let tipsLable = '.user';
            let nowHostName = urlObj.hostname;
            $('#app').append('<div style="position: fixed;z-index:9999;top:5px;right:1px;background: #000000;color: white;border-radius: 17px;width: 70px;height: 20px;text-align:center;line-height: 20px;font-size:12px;opacity: 0.6;cursor:pointer;" id="plugin_setting">插件设置</div>');
            $('#plugin_setting').click(() => {
                showFeeDiff();
            });

            if (myHref.indexOf('app/#/devices') !== -1) {
                console.log(feeDiff);
                if (!feeDiff) {
                    showFeeDiff();
                    return;
                }
                //获取用户产品列表
                requestUrl = `https://${nowHostName}/api/user/routers/?limit=50&offset=0`;
                is_async = false;
                doRequest(function (res) {
                    if (res.hasOwnProperty('results')) {
                        let tempUserprd = res.results;
                        let i = 0;
                        userprd = {};
                        $.each(tempUserprd, (k, v) => {
                            if (v.hasOwnProperty('has_active_non_free_plan') && v.has_active_non_free_plan === false) {
                                userprd[i] = v;
                                i++;
                            }
                        });
                    }
                });

                let is_return = false;
                if (empty(userprd)) {
                    layerTips('用户免费套餐为空，不执行续期操作。');
                    is_return = true;
                } else if (userprd.length > 1) {
                    layerTips('用户有两个免费套餐，不执行续期操作。');
                    is_return = true;
                }

                let userPrdinfo = userprd[0];
                if (empty(userPrdinfo)) {
                    layerTips('用户免费套餐为空，不执行续期操作。');
                    is_return = true;
                } else {
                    let exprieTime = Date.parse(userPrdinfo.active_plan.product_expired_at);
                    let diffTime = exprieTime - nowTime;
                    if (diffTime > feeDiff * daySeconds) {
                        let diffDays = (diffTime / daySeconds).toFixed(1);
                        layerTips('当前免费套餐有效期：' + diffDays + '天。<br>套餐有效期大于' + feeDiff + '天，停止自动续期。');
                        is_return = true;
                    }
                }

                if (is_return) {
                    return;
                }

                //获取可用免费套餐
                requestUrl = `https://${nowHostName}/api/user/product/products/`;
                is_async = false;
                doRequest(function (res) {
                    $.each(res, (k, v) => {
                        if (v.hasOwnProperty('price') && parseInt(v.price) === 0) {
                            product = v;
                        }
                    });
                });

                //执行下单操作。
                requestUrl = `https://${nowHostName}/api/user/product/orders/`;
                requestData = {product_id: product.id, uuid_from_client: generateUUID()};
                method = 'post';
                doRequest(function (res) {
                    let order_id = res.id;
                    //查询订单，并不知道有什么用。
                    requestUrl = `https://${nowHostName}/api/user/product/orders/${order_id}/`;
                    doRequest(function (res) {
                        requestUrl = userprd[0].url;
                        requestData = {plan_ids_to_add: [order_id], server: userprd[0].server};
                        method = 'patch';
                        doRequest(function (res) {
                            let expireDate = res.longest_plan_due_date;
                            let routerName = res.name;
                            layerTips('续期成功,路由器 ' + routerName + '<br>当前到期时间：' + utc2beijing(expireDate));
                        });
                    });
                });
            }

            function doRequest(callback) {
                if (is_async === undefined) {
                    is_async = true;
                } else {
                    is_async = is_async === true;
                }
                if (!method) {
                    method = 'get';
                }
                if (!requestUrl) {
                    alert('未设置url，请检查代码');
                    return;
                }
                let opt = {
                    type: method.toUpperCase(),
                    async: is_async,
                    url: requestUrl,
                    contentType: "application/json;charset=UTF-8", //必须这样写
                    dataType: "json",
                    beforeSend: function (request) {
                        request.setRequestHeader("x-csrftoken", getCsrfToken());
                    },
                    success: function (res) {
                        callback(res);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        layerTips('续期失败，请求出错，以下是错误信息<br><br>' + jqXHR.responseText);
                    }
                };

                if (requestData !== undefined && requestData) {
                    opt.data = JSON.stringify(requestData);
                }

                method = requestUrl = is_async = requestData = undefined;

                $.ajax(opt);
            }

            function generateUUID() {
                let d = new Date().getTime();
                if (window.performance && typeof window.performance.now === "function") {
                    d += performance.now(); //use high-precision timer if available
                }
                let uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    let r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            }

            function getCsrfToken() {
                return getCookie('csrftoken');
            }

            function getCookie(name) {
                let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg))
                    return unescape(arr[2]);
                else
                    return null;
            }

            function getStorge(name, type) {
                if (type === 'session') {
                    return sessionStorage.getItem(name);
                }
                return localStorage.getItem(name);
            }

            function setStorge(name, data, type) {
                if (type === 'session') {
                    return sessionStorage.setItem(name, data);
                }
                return localStorage.setItem(name, data);
            }

            function removeStorge(name, type) {
                if (type === 'session') {
                    return sessionStorage.removeItem(name);
                }
                return localStorage.removeItem(name)
            }

            function empty(value) {
                let ret = false;
                if (!value) {
                    ret = true;
                }

                return ret;
            }

            function utc2beijing(utc_datetime) {
                // 转为正常的时间格式 年-月-日 时:分:秒
                var T_pos = utc_datetime.indexOf('T');
                var Z_pos = utc_datetime.indexOf('Z');
                var year_month_day = utc_datetime.substr(0, T_pos);
                var hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
                var new_datetime = year_month_day + " " + hour_minute_second; // 2017-03-31 08:02:06

                // 处理成为时间戳
                var timestamp = new Date(Date.parse(new_datetime));
                timestamp = timestamp.getTime();
                timestamp = timestamp / 1000;

                // 增加8个小时，北京时间比utc时间多八个时区
                timestamp = timestamp + 8 * 60 * 60;

                var date = new Date(parseInt(timestamp) * 1000);
                var year = date.getFullYear();
                var mon = date.getMonth() + 1;
                var day = date.getDate();
                var hour = date.getHours();
                var min = date.getMinutes();

                // 时间戳转为时间
                return year + '年' + mon + '月' + day + '日 ' + hour + ':' + min;
            }

            /**
             * 弹出layer tips
             * @param msg
             */
            function layerTips(msg) {
                layer.tips(msg + '<br /><br />提示：当前设置套餐剩余 ' + feeDiff + ' 天时自动续费。', tipsLable, {tips: 1});
            }

            /**
             * 显示设置自动续期天数弹窗
             */
            function showFeeDiff() {
                let message = '请输入>=1且<=3的数字';
                feeDiff = feeDiff ? feeDiff : 3;
                layer.open({
                    title: '输入自动续期天数',
                    type: 0,
                    content: '请输入套餐剩余几天自动续期：<br /><input name="feeDiff" id="feeDiff" value="' + feeDiff + '" type="number" style="height: 20px;width: 70px;line-height: 20px;margin:10px 0;background: #f1f1f1">&nbsp;天<br />' + message,
                    yes: (index) => {
                        let tmpFeeDiff = $('#feeDiff').val();
                        if (tmpFeeDiff < 1 || tmpFeeDiff > 3) {
                            layer.tips(message, '#feeDiff', {tips: 1});
                            return;
                        }

                        feeDiff = tmpFeeDiff;
                        layer.close(index);
                        setStorge('feeDiff', feeDiff);
                        window.location.reload();
                    },
                    cancel: () => {
                        feeDiff = feeDiff ? feeDiff : 5;
                        setStorge('feeDiff', feeDiff);
                        window.location.reload();
                    },
                });
            }

        }, 2000);
    }
)();