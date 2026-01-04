// ==UserScript==
// @name         NGA ui-原神树脂计算器
// @version      1.2
// @description  一个基于nga-ui的树脂计算器
// @author       InfSeinP
// @match        *://nga.178.com/*
// @match        *://ngabbs.com/*
// @match        *://bbs.nga.cn/*
// @grant        none
// @note         v1.1 ui优化
// @note         v1.2 ui优化; 添加误差提示; 优化错误提示
// @namespace https://greasyfork.org/users/994825
// @downloadURL https://update.greasyfork.org/scripts/456308/NGA%20ui-%E5%8E%9F%E7%A5%9E%E6%A0%91%E8%84%82%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/456308/NGA%20ui-%E5%8E%9F%E7%A5%9E%E6%A0%91%E8%84%82%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Init common
    const page = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;
    const $ = page.$;
    const _$ = page._$;
    const commonui = page.commonui;
    if (!commonui) { return; }
    const limit = 15; // 显示的最大行数

    // Core functions

    // 1. 计算回满时间
    function _f1(curr) {
        var remainingTime = Math.floor((160 - curr) * 8);
        var h = Math.floor(remainingTime / 60);
        var m = remainingTime % 60;
        var date = new Date();
        var d = date.getDate();
        date.setHours(date.getHours() + h);
        date.setMinutes(date.getMinutes() + m);
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        var res = d != day ? '次日' : '今日';
        res += hours + ":" + minutes;
        return res;
    }
    // 2. 按整点输出
    function _f2(curr) {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var nd = false;

        var data = [];

        while (curr < 320) {
            var remainingMinutes = 60 - minutes;
            minutes = 0;
            curr += remainingMinutes / 8;
            if (data.length >= limit) {
                break;
            }

            hours++;
            if (hours >= 24) { hours -= 24; nd = true; }
            if (hours < 10) { hours = "0" + hours; }
            var key = (nd ? '次日' : '') + hours + ":00";
            key = `<div>${key}</div>`

            var value = `<div>${parseInt(curr)}</div>`;
            if (curr > 160) {
                value = `<p style='color: red'>${parseInt(curr)}</p>`;
            }
            else if (curr == 160) {
                value = `<p style='color: orange'>${parseInt(curr)}</p>`;
            }

            data.push({key:key,value:value});
        }

        return data;
    }
    // 3. 按树脂输出
    function _f3(curr) {
        const interval = 8 * 60 * 1000;
        var date = new Date();
        var d = date.getDate();

        var data = [];

        while (curr < 320) {
            curr++;
            date.setTime(date.getTime() + interval);

            if (data.length >= limit) {
                break;
            }

            if (curr%10 == 0) {
                var c = parseInt(curr)
                var key = c>160 ? `<div style='color: red'>${c}</div>` : c==160 ? `<div style='color: orange'>${c}</div>` : `<div>${c}</div>`;

                var day = date.getDate();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var value = '';
                if (day != d ) { value += '次日'; }
                if (hours< 10) { hours = '0' + hours; }
                if (minutes < 10) { minutes = '0' + minutes; }
                value += hours + ":" + minutes;
                value = `<div>${value}</div>`;

                data.push({key:key,value:value});
            }
        }

        return data;
    }

    // Add ui-entry
    commonui.mainMenu && commonui.mainMenu.addItemOnTheFly('树脂计算器', null, () => {
        const w = commonui.createadminwindow();
        var csz, ft, bt, bs, bt1, bt2, bs1, bs2, blk;
        w._.addContent(null);
        w._.addContent(
            '当前树脂 ',
            csz = _$('/input','id','csz','maxlength','3','style','width:105px;','placeholder','只能是整数'),
            _$('/button','type','button','innerHTML','更新','onclick',async () => {
                console.log(csz.value);
                let sz = parseInt(csz.value);
                if (!csz.value || sz<0 || sz>160) { alert('输入0~160的整数'); return; }
                ft.innerHTML = _f1(sz);
                console.log('f1.success')

                let t1 = _f2(sz);
                let t2 = _f3(sz);
                var t1a = '',t1b = '',t2a = '',t2b = '';
                for(var i=0;i<t1.length;i++){
                    t1a += t1[i].key// + '</br>';
                    t1b += t1[i].value// + '</br>';
                }
                for(i=0;i<t2.length;i++){
                    t2a += t2[i].key// + '</br>';
                    t2b += t2[i].value// + '</br>';
                }
                var blklen = Math.max(t1.length, t2.length);
                var blkcon = ' | </br> | </br>';
                for(i=0;i<blklen;i++){
                    blkcon += ' | </br>';
                }
                blk.innerHTML = blkcon;
                bt1.innerHTML = t1a; bt2.innerHTML = t1b;
                bs1.innerHTML = t2a; bs2.innerHTML = t2b;
                console.log('f2/3.success')

            }),
            _$('/br'),
            _$('/span','class','silver','innerHTML',' - 将于 ', 'style', 'margin-left: 5px;'),
            ft = _$('/span','class','silver','innerHTML',''),
            _$('/span','class','silver','innerHTML',' 回满'),_$('/br'),
            _$('/span','class','silver','innerHTML','注意: 本工具提供的时间会有最多8分钟的误差!'),_$('/br'),
            _$('/table')._.add(_$('/tbody')._.add(_$('/tr')._.add(
                _$('/td','colspan','2','innerHTML','<strong>时间轴</strong>','style','text-align:center'),
                blk = _$('/td','rowspan','3','innerHTML',' | '),
                _$('/td','colspan','2','innerHTML','<strong>树脂轴</strong>','style','text-align:center'),
            ))._.add(_$('/tr')._.add(
                _$('/td','innerHTML','时间','style','text-align:left;padding-right:0.7em;'),
                _$('/td','innerHTML','树脂','style','text-align:center;padding-right:0.7em;'),
                _$('/td','innerHTML','树脂','style','text-align:center;padding-left:0.7em;padding-right:0.7em'),
                _$('/td','innerHTML','时间','style','text-align:right;padding-right:0.7em;'),
            ))._.add(_$('/tr')._.add(
                bt1 = _$('/td','style','padding-right:0.7em;text-align:right'),
                bt2 = _$('/td','style','padding-right:0.7em'),
                bs1 = _$('/td','style','padding-left:0.7em;padding-right:0.7em'),
                bs2 = _$('/td','style','padding-right:0.7em;text-align:right'),
            )))
        );
        w._.addTitle('原神树脂计算器');
        w._.show();
    });
})();