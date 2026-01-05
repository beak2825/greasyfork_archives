// ==UserScript==
// @name        x4的夺宝岛脚本•Plus
// @description zh-cn
// @namespace   dbditem.jd.com
// @version     1.3.4
// @grant       none
// @homepageURL https://greasyfork.org/zh-CN/scripts/24867-x4%E7%9A%84%E5%A4%BA%E5%AE%9D%E5%B2%9B%E8%84%9A%E6%9C%AC-%E6%94%B9
// @include     /https?\://dbditem.jd.com/*
// @downloadURL https://update.greasyfork.org/scripts/24867/x4%E7%9A%84%E5%A4%BA%E5%AE%9D%E5%B2%9B%E8%84%9A%E6%9C%AC%E2%80%A2Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/24867/x4%E7%9A%84%E5%A4%BA%E5%AE%9D%E5%B2%9B%E8%84%9A%E6%9C%AC%E2%80%A2Plus.meta.js
// ==/UserScript==

var sdiv = $('<div><b>最高出价<input id="maxpirce" type="text" maxlength="5" style="width:55px;">' +
             '<input type="checkbox" id="notestchujia">正式出价  | ' +
             '监测间隔<input type="text" id="checkppp" value="100" style="width:25px;"></b>' +
             '<hr>倒计时：<span id="xxxtimes">0</span> | ' +
             '我的出价：<b id="mypirce" style="color:#F00">0</b><hr></div>');
sdiv.css({
    'position': 'fixed',
    'top': '25px',
    'right': '10px',
    'width': '280px',
    'border': '2px solid #000',
    'z-index': '999',
    'background-color': 'rgb(221, 221, 221)',
    'padding': '5px'
});
$('body').append(sdiv);
var jbtn = $('<button>刷新价格</button>');
var sbtn = $('<button>开始夺宝</button>');
var cbtn = $('<button>测</button>');
var ebtn = $('<button>停</button>');
sdiv.append(ebtn);
sdiv.append(cbtn);
sdiv.append(sbtn);
sdiv.append(jbtn);
sdiv.append('<hr><ul id="clog"></ul>');
cbtn.click(function () {
    var num = 0;
    var allys = 0;
    $('#clog').empty();
    var ttt = setInterval(function () {
        var now = new Date().getTime();
        $.getJSON(document.location.protocol + '//dbditem.jd.com/json/current/englishquery?paimaiId=' + paimaiId + '&skuId=0&start=0&end=1', function (data) {
            var cbk = new Date().getTime();
            num++;
            $('#clog').append('<li>第' + num + '次测试：延时 ' + (cbk - now) + ' ms</li>');
            allys += (cbk - now);
            if (num >= 10) {
                clearInterval(ttt);
                $('#clog').append('<li><b>10次平均：延时 ' + (allys / 10) + ' ms</b></li>');
            }
        });
    }, 300);
});

sbtn.click(function () {
    var runtimer;
    sbtn.text('监测中…竞拍编号：' + paimaiId);
    var checktimess = parseInt($('#checkppp').val());
    var mypirce = 0;
    var chujianum = 0;
    $('#clog').empty();
    $.getJSON(document.location.protocol + '//dbditem.jd.com/json/current/englishquery?paimaiId=' + paimaiId + '&skuId=0&start=0&end=1', function (data) {
        $('#clog').append('<li>校准时间：' + data.remainTime + ' ms 当前价：' + data.currentPrice + '</li>');
        remainTime = data.remainTime;
        var ssstrat = remainTime % checktimess;
        var ttimenum = remainTime - ssstrat;
        var nowjia = 0; //当前加价幅度
        var oldjia = 0; //上次价
        setTimeout(function () {
            runtimer = setInterval(function () {
                ttimenum = ttimenum - checktimess;
                $('#xxxtimes').text((ttimenum / 1000).toFixed(4) + ' s');
                // 自动关闭弹窗提示
                if ($('.ui-dialog').size()) {
                    $('#clog').append('<li>弹窗：' + $('.ui-dialog').find('.jbox-content').text() + '</li>');
                    $('.ui-dialog,.ui-mask').remove();
                }
                // 2000毫秒开始监测价格
                if (ttimenum <= 2000) {
                    // 请求json
                    var nowttt = new Date().getTime();
                    $.getJSON(document.location.protocol + '//dbditem.jd.com/json/current/englishquery?paimaiId=' + paimaiId + '&skuId=0&start=0&end=1', function (data) {
                        var cbkttt = new Date().getTime() - nowttt;
                        var nowp = parseInt(data.currentPrice);
                        if (oldjia !== 0) nowjia = nowp - oldjia;
                        if (oldjia === 0 && oldjia != nowp) oldjia = nowp;
                        ttimenum = data.remainTime;
                        // 夺宝完毕
                        if (ttimenum == '-1') {
                            if ($('#endduobao').size() === 0) {
                                $('#clog').append('<li id="endduobao">夺宝完毕！(' + data.currentPrice + '|' + data.remainTime + ')</li>');
                                sbtn.text('开始夺宝');
                            }
                            runtimer = clearInterval(runtimer);
                            return false;
                        }
                        var myygcj = nowp + nowjia + 1;
                        $('#clog').append('<li>时：' + data.remainTime +
                                          ' 价：' + parseInt(data.currentPrice) +
                                          ' 延：' + cbkttt +
                                          ' 幅：' + nowjia +
                                          ' 需：' + myygcj + '</li>');
                        // 出价时点
                        if (ttimenum <= (1050 + cbkttt + checktimess)) {
                            if ($('#cjtimenow').size() === 0) $('#clog').append('<hr><li id="cjtimenow" style="color:#F00">出价时点 >>> (' + data.remainTime + ' | <b>' + myygcj + '</b>)</li>');
                            // 出价判断
                            if (myygcj <= parseInt($('#maxpirce').val()) && mypirce < nowp) {
                                // 加价幅度
                                mypirce = myygcj;
                                //
                                $('#mypirce').text(mypirce + '|' + data.remainTime);
                                $('#bidPrice').val(mypirce);
                                // 正式或测试出价
                                if (mypirce <= parseInt($('#maxpirce').val()) && $('#notestchujia').prop('checked') === true) {
                                    $('#clog').append('<li style="color:#F00">正式出价 >>> (' + mypirce + '|' + data.remainTime + ')</li>');
                                    var url = '/services/bid.action?t=' + getRamdomNumber();
                                    var data = {
                                        paimaiId: paimaiId,
                                        price: mypirce,
                                        proxyFlag: 0,
                                        bidSource: 0
                                    };
                                    jQuery.getJSON(url, data, function (jqXHR) {
                                        if (jqXHR.result == '200') {
                                            $('#clog').append('<li  style="color:#F00">出价成功！(' + mypirce + ')</li>');
                                        } else {
                                            $('#clog').append('<li>' + jqXHR.result + ' ' + jqXHR.message + '</li>');
                                        }
                                    });
                                } else {
                                    $('#clog').append('<li style="color:#F00">测试出价 >>> (' + mypirce + '|' + data.remainTime + ')</li>');
                                }
                            }
                            // 出价判断完毕
                        }
                    }); // 请求json完毕
                }
            }, checktimess); // 多少毫秒监测一次
        }, ssstrat); //修正延时
    });
    ebtn.one('click', function () {
        sbtn.text('开始夺宝');
        runtimer = clearInterval(runtimer);
    });
});

jbtn.click(function () {
    $('#clog').empty();
    $.getJSON(document.location.protocol + '//dbditem.jd.com/json/current/englishquery?paimaiId=' + paimaiId + '&skuId=0&start=0&end=1', function (data) {
        $('#auction3dangqianjia').html('<em class="font12">¥</em>' + data.currentPrice);
        $('#clog').append('<li>价格最后更新时间：' + new Date().toLocaleTimeString() + '</li>');
    });
});

var dragging = false;
var iX,iY;
sdiv.mousedown(function (e) {
    dragging = true;
    iX = e.clientX - this.offsetLeft;
    iY = e.clientY - this.offsetTop;
});
document.onmousemove = function (e) {
    if (dragging) {
        var e = e || window.event;
        var oX = e.clientX - iX;
        var oY = e.clientY - iY;
        sdiv.css({
            'left': oX + 'px',
            'top': oY + 'px'
        });
        return false;
    }
};
$(document).mouseup(function (e) {
    dragging = false;
    e.cancelBubble = true;
});