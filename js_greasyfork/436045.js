// ==UserScript==
// @name         cqcet_eucaly
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  cqcet优化使用脚本
// @author       eucaly
// @include      *://*.cqcet.edu.cn/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @license      AGPL-3.0                     //脚本的授权许可信息
// @icon         http://120.79.93.22:81/?explorer/share/fileDownload&shareID=7k9fJPmA&path=%7BshareItemLink%3A7k9fJPmA%7D%2F&s=agTHI //脚本的图标（显示在脚本列表里）
// @downloadURL https://update.greasyfork.org/scripts/436045/cqcet_eucaly.user.js
// @updateURL https://update.greasyfork.org/scripts/436045/cqcet_eucaly.meta.js
// ==/UserScript==
(() => {
    'use strict';

    let _self = unsafeWindow;

    function skipPg() {//跳过登录防诈骗
        function removePg() {
            if (document.querySelector('.layui-layer-page')) {
                console.log(_self);
                _self.layer.close(1);
                _self.clearInterval(removeInterval);
                _self.layer.msg('跳过成功');
            }
        };
        var removeInterval = _self.setInterval(removePg, 200);
    }

    async function jp() {//教评
        let isDo = false;
        function getYearAndWeek() {
            GM_xmlhttpRequest({
                method: "get",
                url: 'http://ossc.cqcet.edu.cn/xg/teaching/student/xskb',
                onload: function (res) {
                    if (res.status === 200) {
                        let xnxq = /<select name="xnxq".*>\s*<option.*>(.*)</gm.exec(res.responseText)[1];
                        let zc = /<select name="weekly".*>\s*<option.*>.(.*).</gm.exec(res.responseText)[1];
                        GM_setValue('xnxq', xnxq);
                        GM_setValue('zc', zc);
                    } else {
                        console.log('失败')
                        console.log(res)
                    }
                },
                onerror: function (err) {
                    console.log('error')
                    console.log(err)
                }
            });
        }

        function doJp(xh, xm, skjsjgh, skjsmc, xn, xq, weekly, yxh) {
            var data = 'evaluationProject=[{"name":"老师教得怎么样?","id":"teach_situation","value":"5"},{"name":"学习收获怎么样?","id":"learn_harvest","value":"5"},{"name":"纪律管理怎么样?","id":"discipline","value":"5"},{"name":"课堂互动怎么样?","id":"interaction","value":"5"},{"name":"课后交流怎么样?","id":"communicat","value":"5"}]&advice=&xh=' + xh + '&xm=' + xm + '&kkdm=&skjsjgh=' + skjsjgh + '&skjsmc=' + skjsmc + '&remark=&year=' + xn + '&term=' + xq + '&weekLy=' + weekly + '&taskId=' + yxh
            GM_xmlhttpRequest({
                method: "post",
                url: 'http://ossc.cqcet.edu.cn/xg/teaching/student/teach/add',
                data: data,
                headers: {
                    'Origin': 'http://ossc.cqcet.edu.cn',
                    'Referer': 'http://ossc.cqcet.edu.cn/xg/teaching/student/xskb',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                onload: function (res) {
                    if (res.status === 200) {
                        console.log(weekly + 'ok----------------------');
                    } else {
                        console.log('失败')
                        console.log(res)
                    }
                },
                onerror: function (err) {
                    console.log('error')
                    console.log(err)
                }
            });
        }

        async function getList(xnxq, zc) {
            GM_xmlhttpRequest({
                method: "post",
                url: 'http://ossc.cqcet.edu.cn/xg/teaching/student/xskb/list',
                data: 'pageSize=10&pageNum=1&isAsc=asc&xnxq=' + xnxq + '&weekly=' + zc,
                headers: {
                    'Origin': 'http://ossc.cqcet.edu.cn',
                    'Referer': 'http://ossc.cqcet.edu.cn/xg/teaching/student/xskb',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                onload: function (res) {
                    if (res.status === 200) {
                        let courseList = JSON.parse(res.responseText).rows;
                        courseList.forEach(element => {
                            let { xh, xm, skjsjgh, skjsmc, xn, xq, weekly, yxh,complete } = element;
                            if(complete==false) {
                                isDo = true;
                                doJp(xh, xm, skjsjgh, skjsmc, xn, xq, weekly, yxh);
                            }
                        });
                    } else {
                        console.log('失败')
                        console.log(res)
                    }
                },
                onerror: function (err) {
                    console.log('error')
                    console.log(err)
                }
            });
        }
        getYearAndWeek();
        let xnxq = GM_getValue('xnxq', '')
        let zc = GM_getValue('zc', '');
        for (var i = 2; i <= parseInt(zc); i++) {
            var pro = getList(xnxq, i)
            pro.then(()=>{
                if(isDo){
                     _self.location.reload();
                }
                _self.layer.msg('教评完成,建议手动刷新当前页面');
            })
        }
    }

    if (_self.location.href == 'http://sso.cqcet.edu.cn/login' || _self.location.href == 'https://sso.cqcet.edu.cn/login') {
        skipPg();
    } else if (_self.location.href.slice(0, 56) == 'http://ossc.cqcet.edu.cn/xg/teaching/student/index/teach') {
        jp();
    }
})();
