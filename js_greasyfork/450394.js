// ==UserScript==
// @name         千川移动端适配
// @namespace    https://qianchuan.jinritemai.com/
// @version      1.1
// @description  在千策页面展示千川数据,无缝切入千策数据中
// @author       MrZhang1899
// @match        https://qianchuan.jinritemai.com/data-report/evaluation/today-live*
// @icon         data:image/png;base64,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
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/450394/%E5%8D%83%E5%B7%9D%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%80%82%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/450394/%E5%8D%83%E5%B7%9D%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%80%82%E9%85%8D.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // 设置按钮
    // let Setting = document.createElement('span');
    // Setting.innerHTML = '<div data-v-3bc4e2f6=""><div data-v-325d650f="" data-v-3bc4e2f6="" class="question-wrapper"><div data-v-325d650f="" class="byted-popover-wrapper"><div data-v-325d650f=""><img data-v-325d650f="" width="28px" src="http://uuuu0.com/qianchuan-setting.svg" alt="" class="icon"></div></div></div></div>';

    //检查状态
    let click_one = true;
    let click_two = true;

    window.onload = function() {
        setTimeout(getframe, 5000);
    };


    // Your code here...
    function getframe() {
        // 直播间观看人次
        var b = document.evaluate('//span[text()="直播间观看人次"]/parent::div/following-sibling::div//text()', document).iterateNext();
        try {
            var GKRC_NUM = b.data;
        } catch (error) {
            console.log(error);
        }
        // 整体成单数
        var c = document.evaluate('//span[text()="整体成单数"]/parent::div/following-sibling::div//text()', document).iterateNext();
        try {
            var ZTCD_NUM = c.data;
        } catch (error) {
            console.log(error);
        }
        // 累计成交金额(元)
        var d = document.evaluate('//span[text()="累计成交金额(元)"]/parent::div/following-sibling::div//text()', document).iterateNext();
        try {
            if (d.nextSibling.innerText) {
                var LJCJ_NUM = d.data + d.nextSibling.innerText;
            } else {
                var LJCJ_NUM = d.data;
            }
        } catch (error) {
            console.log(error);
        }
        // GPM(元)
        var e = document.evaluate('//span[text()="GPM(元)"]/parent::div/following-sibling::div//text()', document).iterateNext();
        try {
            if (e.nextSibling.innerText) {
                var GPM_NUM = e.data + e.nextSibling.innerText;
            } else {
                var GPM_NUM = e.data;
            }
        } catch (error) {
            console.log(error);
        }

        // 消耗(元)
        var g = document.evaluate('//span[text()="消耗(元)"]/parent::div/following-sibling::div//text()', document).iterateNext();
        try {
            if (g.nextSibling.innerText) {
                var XH_NUM = g.data + g.nextSibling.innerText;
            } else {
                var XH_NUM = g.data;
            }
        } catch (error) {
            console.log(error);
        }

        // 整体消耗
        var a = document.evaluate('//span[text()="整体消耗(元)"]/parent::div/following-sibling::div[1]//text()', document).iterateNext();
        try {
            // console.dir(a.nextSibling.innerText);
            if (!a) {
                var ZTXH_NUM = XH_NUM;
            } else {
                var ZTXH_NUM = a.data + a.nextSibling.innerText;
            }

        } catch (error) {
            console.log(error);
        }

        // 整体ROI
        var f = document.evaluate('//span[text()="整体ROI"]/parent::div/following-sibling::div//text()', document).iterateNext();
        try {
            if (!f) {
                var leiji = LJCJ_NUM.replace(",", "");
                var xiaohao = ZTXH_NUM.replace(",", "");
                //计算整体ROI
                var ZTROI_NUM = parseFloat(leiji / xiaohao).toFixed(2);
            } else {
                if (f.nextSibling.innerText) {
                    var ZTROI_NUM = f.data + f.nextSibling.innerText;
                } else {
                    var ZTROI_NUM = f.data;
                }
            }
        } catch (error) {
            console.log(error);
        }

        // 广告点击次数
        var h = document.evaluate('//span[text()="广告点击次数"]/parent::div/following-sibling::div//text()', document).iterateNext();
        try {
            var DJCS_NUM = h.data;
        } catch (error) {
            console.log(error);
        }
        // 广告成单数
        var i = document.evaluate('//span[text()="广告成单数"]/parent::div/following-sibling::div//text()', document).iterateNext();
        try {
            var GGCD_NUM = i.data;
        } catch (error) {
            console.log(error);
        }
        // 广告成交金额(元)
        var j = document.evaluate('//span[text()="广告成交金额(元)"]/parent::div/following-sibling::div//text()', document).iterateNext();
        try {
            if (j.nextSibling.innerText) {
                var GGCJ_NUM = j.data + j.nextSibling.innerText;
            } else {
                var GGCJ_NUM = j.data;
            }
        } catch (error) {
            console.log(error);
        }
        // 广告GPM(元)
        var k = document.evaluate('//span[text()="广告GPM(元)"]/parent::div/following-sibling::div//text()', document).iterateNext();
        try {
            if (k.nextSibling.innerText) {
                var GGGPM_NUM = k.data + k.nextSibling.innerText;
            } else {
                var GGGPM_NUM = k.data;
            }
        } catch (error) {
            console.log(error);
        }
        // 广告ROI
        var l = document.evaluate('//span[text()="广告ROI"]/parent::div/following-sibling::div//text()', document).iterateNext();
        try {
            if (l.nextSibling.innerText) {
                var GGROI_NUM = l.data + l.nextSibling.innerText;
            } else {
                var GGROI_NUM = j.data;
            }
        } catch (error) {
            console.log(error);
        }


        // 时间
        var m = document.evaluate('//span[contains(text(), "数据更新于")]/text()', document).iterateNext();
        var QCTIME = m.textContent;

       // 余额
        var n = document.getElementsByClassName("int")[0].innerText;
        var YE = n;
        console.log(YE)



        // 自动刷新
        var auto_click = document.evaluate('//button[contains(text(), "刷新")]', document).iterateNext();
        auto_click.click();


        //输出数据
        try {
            var shop_name = document.getElementsByClassName("shop-name")[0].innerText;
            $.ajax({
                type: 'GET',
                url: 'https://q.uuuu0.com/update_data.php',
                data: {
                    YE: YE,
                    SHOPNAME: shop_name,
                    ZTXH: ZTXH_NUM,
                    GKRC: GKRC_NUM,
                    ZTCD: ZTCD_NUM,
                    LJCJ: LJCJ_NUM,
                    GPM: GPM_NUM,
                    ZTROI: ZTROI_NUM,
                    XH: XH_NUM,
                    DJCS: DJCS_NUM,
                    GGCD: GGCD_NUM,
                    GGCJ: GGCJ_NUM,
                    GGGPM: GGGPM_NUM,
                    GGROI: GGROI_NUM,
                    QCTIME: QCTIME
                },
                dataType: 'jsonp',
                jsonp: 'callback',
                success: function(res) {
                    console.log(res);
                }

            });
        } catch (err) {
            console.log()
        }
        //输出设置按钮
        // if (document.getElementsByClassName('header-container')[0]) {
        //     if (document.getElementsByClassName('header-container')[0].childElementCount && document.getElementsByClassName('header-container')[0].childElementCount > 0 && click_two) {
        //         // console.log('加载好，跑起来了')
        //         click_two = false;
        //         console.log(2);
        //         var setting_icon = document.evaluate('//div[@class="question-wrapper"]/parent::div', document).iterateNext();
        //         console.log(3);
        //         document.getElementsByClassName('header-container')[0].insertBefore(Setting, setting_icon);
        //         // clearInterval(fun)
        //     } else {
        //         console.log(4);
        //         // console.log('不操作')
        //     }
        // } else {
        //     console.log(5);
        //     // console.log('页面还没加载好')

        // }
        //半小时一轮
        setTimeout(getframe, 60000);
    }


})();