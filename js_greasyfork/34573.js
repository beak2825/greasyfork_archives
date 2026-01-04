// ==UserScript==
// @name         京东领优惠券
// @namespace    https://github.com/nameldk/user-script
// @version      0.1
// @description  京东领优惠券,访问地址 https://coupon.m.jd.com/center/getCouponCenter.action
// @icon         https://www.jd.com/favicon.ico
// @author       nameldk
// @match        https://coupon.m.jd.com/center/getCouponCenter.action*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34573/%E4%BA%AC%E4%B8%9C%E9%A2%86%E4%BC%98%E6%83%A0%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/34573/%E4%BA%AC%E4%B8%9C%E9%A2%86%E4%BC%98%E6%83%A0%E5%88%B8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 用chrome访问链接 https://coupon.m.jd.com/center/getCouponCenter.action 登录后打开控制台Console 粘贴运行

    var _uuid_ = 0;
    var _total = 0;

    function wait(duration) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, duration);
        });
    }

    function uuid() {
        return ++_uuid_;
    }

    function loadMore() {
        var objContent = document.getElementById('mjdContent');
        return new Promise((resolve, reject) => {
            var c = 0;
            var h = setInterval(function () {
                objContent.scrollTop = objContent.scrollHeight;
                console.log('loadMore', uuid());
                var s = document.getElementById("clickChange").getAttribute("style");
                if (s == 'display: block;') {
                    c += 1;
                }
                if (c > 3) {
                    console.log('preLoadMoreOk', uuid());
                    clearInterval(h);
                    resolve();
                }
            }, 1000);
        });
    }

    function doClick() {
        return new Promise((resolve, reject) => {
            var list = document.querySelectorAll(".coupon-btn");
            var length = list.length;
            console.log("need Click cnt :", length);
            if (length === 0) {
                console.log('preDoClickOk', uuid());
                resolve();
            } else {
                list.forEach((v, i) => {
                    (function (v, i) {
                        wait(3000 * i).then(function () {
                            console.log('do click:', i + 1 + '/' + length, 'total:' + (++_total), uuid());
                            v.click();
                            if (i === length - 1) {
                                console.log('last one over', uuid());
                                resolve();
                            }
                        });
                    })(v, i);
                });
            }
        });
    }

    function loadNextPage() {
        console.log('loadNextPage', uuid());
        document.getElementById("clickChange").click();
        return Promise.resolve();
    }

    var doCount = 0;

    function doit() {
        return loadMore().then(function () {
            return doClick();
        }).then(function () {
            return loadNextPage();
        }).then(function () {
            doCount++;
            console.log("next loop:", doCount, uuid());
            if (doCount < 20) {
                doit();
            } else {
                alert('完成了');
            }
        });
    }

    doit();

})();