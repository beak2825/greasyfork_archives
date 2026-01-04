// ==UserScript==
// @name         京东京喜红包详情
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  可以查看京东 京喜 极速平台的红包
// @author       You
// @match        *://*.jd.com/*
// @require      https://lib.baomitu.com/jquery/3.5.1/jquery.min.js
// @namespace    https: //greasyfork.org/zh-CN/scripts/419131
// @downloadURL https://update.greasyfork.org/scripts/419131/%E4%BA%AC%E4%B8%9C%E4%BA%AC%E5%96%9C%E7%BA%A2%E5%8C%85%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/419131/%E4%BA%AC%E4%B8%9C%E4%BA%AC%E5%96%9C%E7%BA%A2%E5%8C%85%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.clear();
    //悬浮球创建
    var css = '#fb{width:50px;height:50px;background:rgb(19,167,19);position:fixed;cursor:move;box-sizing:border-box;border-radius:50%;background-size:100% 100%;box-shadow:5px 5px 40px rgba(0,0,0,0.5);overflow:hidden;}';
    var style = document.createElement('style');
    style.innerHTML = css;
    document.getElementsByTagName('head')[0].appendChild(style);
    var fbDiv = document.createElement("div");
    fbDiv.setAttribute('id', 'fb');
    document.getElementsByTagName('body')[0].appendChild(fbDiv);
    var fb = document.querySelector('#fb');
    var fbW = fb.offsetWidth;
    var fbH = fb.offsetHeight;
    var cuntW = 0;
    var cuntH = 0;
    fb.style.left = '0px';
    fb.style.top = '117px';

    function move(obj, w, h) {
        if (obj.direction === 'left') {
            obj.style.left = 0 - w + 'px';
        } else if (obj.direction === 'right') {

            obj.style.left = document.body.offsetWidth - fbW + w + 'px';
        }
        if (obj.direction === 'top') {
            obj.style.top = 0 - h + 'px';
        } else if (obj.direction === 'bottom') {
            obj.style.top = document.body.offsetHeight - fbH + h + 'px';
        }
    }

    function rate(obj, a) {
        obj.style.transform = ' rotate(' + a + ')'
    }

    function action(obj) {
        var dir = obj.direction;
        switch (dir) {
            case 'left':
                rate(obj, '90deg');
                break;
            case 'right':
                rate(obj, '-90deg');
                break;
            case 'top':
                rate(obj, '-180deg');
                break;
            default:
                rate(obj, '-0');
                break;
        }

    }
    fb.onmousedown = function (e) {
        var fbL = e.clientX - fb.offsetLeft;
        var fbT = e.clientY - fb.offsetTop;
        document.onmousemove = function (e) {
            cuntW = 0;
            cuntH = 0;
            fb.direction = '';
            fb.style.transition = '';
            fb.style.left = (e.clientX - fbL) + 'px';
            fb.style.top = (e.clientY - fbT) + 'px';
            if (e.clientX - fbL < 5) {
                fb.direction = 'left';
            }
            if (e.clientY - fbT < 5) {
                fb.direction = 'top';
            }
            if (e.clientX - fbL > document.body.offsetWidth - fbW - 5) {
                fb.direction = 'right';
            }
            if (e.clientY - fbT > document.body.offsetHeight - fbH - 5) {
                fb.direction = 'bottom';
            }
            move(fb, 0, 0);
        }
    }
    fb.onmouseover = function () {
        move(this, 0, 0);
        rate(this, 0)
    }

    fb.onmouseout = function () {
        move(this, fbW / 2, fbH / 2);
        action(this);
    }

    fb.onmouseup = function () {
        document.onmousemove = null;
        this.style.transition = '.5s';
        move(this, fbW / 2, fbH / 2);
        action(this);
    }

    window.onresize = function () {
        var bodyH = document.body.offsetHeight;
        var fbT = fb.offsetTop;
        var bodyW = document.body.offsetWidth;
        var fbL = fb.offsetLeft;

        if (fbT + fbH > bodyH) {
            fb.style.top = bodyH - fbH + 'px';
            cuntH++;
        }
        if (bodyH > fbT && cuntH > 0) {
            fb.style.top = bodyH - fbH + 'px';
        }
        if (fbL + fbW > bodyW) {
            fb.style.left = bodyW - fbW + 'px';
            cuntW++;
        }
        if (bodyW > fbL && cuntW > 0) {
            fb.style.left = bodyW - fbW + 'px';
        }

        move(fb, fbW / 2, fbH / 2);
    }

    //引入layui
    $(document.head).append('<link rel="stylesheet" type="text/css" href="https://www.layuicdn.com/layui/css/layui.css"/>');
    $(document.head).append('<script src="https://cdn.bootcdn.net/ajax/libs/layui/2.5.7/layui.all.min.js"></script>');

    //悬浮球点击事件
    fb.onclick = function () {
        var layer = layui.layer;
        var table = layui.table;

        $(document.body).append('<div style="display: none;"  id="moneyDiv"></div>');
        $('#moneyDiv').append('<table  id="subHB"></table>');
        $('#moneyDiv').append('<table  id="money"></table>');
        $('#moneyDiv').append('<table  id="expiresToDayMoney"></table>');
        $('#moneyDiv').append('<table  id="expiresToDayMoneyDetail"></table>');
        $('#moneyDiv').append('<table  id="expiresTomorrowMoney"></table>');
        $('#moneyDiv').append('<table  id="expiresTomorrowMoneyDetail"></table>');
        $('#moneyDiv').append('<table  id="expiresDATMoney"></table>');
        $('#moneyDiv').append('<table  id="expiresDATMoneyDetail"></table>');

        layer.open({
            type: 1,
            skin: 'layui-layer-molv', //加上边框
            area: ['1000px', '600px'], //宽高
            content: $('#moneyDiv'),
            maxmin: true,
            success: function () {
                function getCookie(name) {
                    var cookie = document.cookie;
                    var prefix = name + "=";
                    var start = cookie.indexOf(prefix);
                    if (start == -1) {
                        return null;
                    }

                    var end = cookie.indexOf(";", start + prefix.length)
                    if (end == -1) {
                        end = cookie.length;
                    }

                    var value = cookie.substring(start + prefix.length, end)
                    return unescape(value);
                }

                function contain(orgStr, str) {
                    return orgStr.indexOf(str) != -1;
                }

                function add(arg1, arg2) {
                    arg1 = arg1.toString(), arg2 = arg2.toString();
                    var arg1Arr = arg1.split("."),
                        arg2Arr = arg2.split("."),
                        d1 = arg1Arr.length == 2 ? arg1Arr[1] : "",
                        d2 =
                        arg2Arr.length == 2 ? arg2Arr[1] : "";
                    var maxLen = Math.max(d1.length, d2.length);
                    var m = Math.pow(10, maxLen);
                    var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
                    var d = arguments[2];
                    return typeof d === "number" ? Number((result).toFixed(d)) : result;
                }

                function calHB(orgLimitStr, hb, jx, jd, jdyh) {
                    if (contain(orgLimitStr, '京喜') || contain(orgLimitStr, '拼购')) {
                        jx = add(hb.balance, jx);
                    } else if (contain(orgLimitStr, '全部渠道通用')) {
                        jd = add(hb.balance, jd);
                    } else if (contain(orgLimitStr, '极速')) {
                        jdyh = add(hb.balance, jdyh);
                    }
                    return {
                        jx,
                        jd,
                        jdyh
                    };
                }
                var json;
                var url =
                    'https://api.m.jd.com/api?appid=myhongbao_pc&functionId=myhongbao_list_usable&body={"appId":"pcHongBao","appToken":"f7e5532105b80989","jda":"' +
                    getCookie('jda') + '","pin":"' + getCookie('pin') +
                    '","platform":"0","platformId":"pcHongBao","platformToken":"f7e5532105b80989","shshshfp":"' +
                    getCookie('shshshfp') +
                    '","shshshfpa":"' + getCookie('shshshfpa') + '","shshshfpb":"' + getCookie(
                        'shshshfpb') +
                    '","organization":"JD","pageNum":1}&jsonp=jsonp_' + new Date().getTime() + '_95971';
                var httpRequest = new XMLHttpRequest();
                httpRequest.open('GET', url, true);
                httpRequest.withCredentials = true
                httpRequest.send();
                httpRequest.onreadystatechange = function () {
                    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                        json = eval(httpRequest.responseText.substr(25));

                        let hbs = json.hongBaoList;

                        let subHB = 0;
                        let jx = 0;
                        let jd = 0;
                        let jdyh = 0;

                        let expiresToDay = 0;
                        let expiresToDayJD = 0;
                        let expiresToDayJX = 0;
                        let expiresToDayJS = 0;

                        let expiresTomorrow = 0;
                        let expiresTomorrowJD = 0;
                        let expiresTomorrowJX = 0;
                        let expiresTomorrowJS = 0;

                        let expiresDAT = 0;
                        let expiresDATJD = 0;
                        let expiresDATJX = 0;
                        let expiresDATJS = 0;

                        var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1;
                        let tomorrowStart = timeStamp + 86400000;
                        let tomorrowEnd = timeStamp + 86400000 * 2;
                        let DATEnd = timeStamp + 86400000 * 3;
                        let res;

                        for (let i = 0; i < hbs.length; i++) {
                            let hb = hbs[i];
                            let orgLimitStr = hb.orgLimitStr;

                            //计算各平台总额
                            res = calHB(orgLimitStr, hb, jx, jd, jdyh);
                            jx = res.jx;
                            jd = res.jd;
                            jdyh = res.jdyh;

                            //今天过期
                            if (hb.endTime < tomorrowStart) {
                                res = calHB(orgLimitStr, hb, expiresToDayJX, expiresToDayJD, expiresToDayJS);
                                expiresToDayJX = res.jx;
                                expiresToDayJD = res.jd;
                                expiresToDayJS = res.jdyh;
                                expiresToDay = add(hb.balance, expiresToDay);
                            }
                            //明天过期
                            else if (tomorrowStart <= hb.endTime && hb.endTime < tomorrowEnd) {
                                res = calHB(orgLimitStr, hb, expiresTomorrowJX, expiresTomorrowJD, expiresTomorrowJS);
                                expiresTomorrowJX = res.jx;
                                expiresTomorrowJD = res.jd;
                                expiresTomorrowJS = res.jdyh;
                                expiresTomorrow = add(hb.balance, expiresTomorrow);
                            }
                            //后天过期
                            else if (tomorrowEnd <= hb.endTime && hb.endTime < DATEnd) {
                                res = calHB(orgLimitStr, hb, expiresDATJX, expiresDATJD, expiresDATJS);
                                expiresDATJX = res.jx;
                                expiresDATJD = res.jd;
                                expiresDATJS = res.jdyh;
                                expiresDAT = add(hb.balance, expiresDAT);
                            }
                        }

                        subHB = add(add(jd, jx), jdyh);
                        //渲染各项总金额表格
                        table.render({
                            elem: '#subHB',
                            cols: [
                                [{
                                    field: 'subHB',
                                    title: '红包总额',
                                    align: 'center'
                                }]
                            ],
                            data: [{
                                "subHB": subHB
                            }]
                        });
                        //渲染各项总金额表格
                        table.render({
                            elem: '#money',
                            cols: [
                                [{
                                    field: 'name',
                                    title: '红包平台',
                                    align: 'center'
                                }, {
                                    field: 'balance',
                                    title: '红包总金额（元）',
                                    sort: true,
                                    align: 'center'
                                }]
                            ],
                            data: [{
                                "name": '京东',
                                "balance": jd
                            }, {
                                "name": '京喜',
                                "balance": jx
                            }, {
                                "name": '极速',
                                "balance": jdyh
                            }]
                        });
                        //渲染今天过期总金额表格
                        table.render({
                            elem: '#expiresToDayMoney',
                            cols: [
                                [{
                                    field: 'balance',
                                    title: '今天过期总金额（元）',
                                    align: 'center'
                                }]
                            ],
                            data: [{
                                "balance": expiresToDay
                            }]
                        });

                        //渲染今天过期金额详情表格
                        table.render({
                            elem: '#expiresToDayMoneyDetail',
                            cols: [
                                [{
                                    field: 'orgLimitStr',
                                    title: '红包平台',
                                    align: 'center'
                                }, {
                                    field: 'balance',
                                    title: '今天过期金额详情（元）',
                                    sort: true,
                                    align: 'center'
                                }]
                            ],
                            data: [{
                                "orgLimitStr": '今天过期京喜红包总额',
                                "balance": expiresToDayJX
                            }, {
                                "orgLimitStr": '今天过期京东红包总额',
                                "balance": expiresToDayJD
                            }, {
                                "orgLimitStr": '今天过期极速红包总额',
                                "balance": expiresToDayJS
                            }]
                        });
                        //渲染明天过期总金额表格
                        table.render({
                            elem: '#expiresTomorrowMoney',
                            cols: [
                                [{
                                    field: 'balance',
                                    title: '明天过期总金额（元）',
                                    align: 'center'
                                }]
                            ],
                            data: [{
                                "balance": expiresTomorrow
                            }]
                        });

                        //渲染明天过期金额详情表格
                        table.render({
                            elem: '#expiresTomorrowMoneyDetail',
                            cols: [
                                [{
                                    field: 'orgLimitStr',
                                    title: '红包平台',
                                    align: 'center'
                                }, {
                                    field: 'balance',
                                    title: '明天过期金额详情（元）',
                                    sort: true,
                                    align: 'center'
                                }]
                            ],
                            data: [{
                                "orgLimitStr": '明天过期京喜红包总额',
                                "balance": expiresTomorrowJX
                            }, {
                                "orgLimitStr": '明天过期京东红包总额',
                                "balance": expiresTomorrowJD
                            }, {
                                "orgLimitStr": '明天过期极速红包总额',
                                "balance": expiresTomorrowJS
                            }]
                        });
                        //渲染后天过期总金额表格
                        table.render({
                            elem: '#expiresDATMoney',
                            cols: [
                                [{
                                    field: 'balance',
                                    title: '后天过期总金额（元）',
                                    align: 'center'
                                }]
                            ],
                            data: [{
                                "balance": expiresDAT
                            }]
                        });

                        //渲染后天过期金额详情表格
                        table.render({
                            elem: '#expiresDATMoneyDetail',
                            cols: [
                                [{
                                    field: 'orgLimitStr',
                                    title: '红包平台',
                                    align: 'center'
                                }, {
                                    field: 'balance',
                                    title: '后天过期金额详情（元）',
                                    sort: true,
                                    align: 'center'
                                }]
                            ],
                            data: [{
                                "orgLimitStr": '后天过期京喜红包总额',
                                "balance": expiresDATJX
                            }, {
                                "orgLimitStr": '后天过期京东红包总额',
                                "balance": expiresDATJD
                            }, {
                                "orgLimitStr": '后天过期极速红包总额',
                                "balance": expiresDATJS
                            }]
                        });
                    }
                }
            }
        });

    }
    window.onload = function () {
        document.querySelectorAll("div.dt.cw-icon").forEach((e, index, arr) => {
            if (arr.length == 7) {
                if (index != 1 && index != 0 && index != 6) {
                    console.log('7=' + index);
                    e.style.width = '56px';
                }
            } else {
                if (index != 0) {
                    e.style.width = '56px';
                }
            }
        });
    }
})();