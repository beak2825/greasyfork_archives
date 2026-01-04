// ==UserScript==
// @name         慕课挂机
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  取消网页版离开窗口限制、自动切换下一节课。
// @author       hoccz
// @match        *://*.imooc.com/*
// @icon         https://www.imooc.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449469/%E6%85%95%E8%AF%BE%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/449469/%E6%85%95%E8%AF%BE%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

;+function () {

    ;+function () {

        Object.defineProperties(document,
            {
                'visibilityState': {
                    get: function () {
                        return 'visible'
                    },
                },
                'webkitVisibilityState': {
                    get: function () {
                        return 'visible'
                    },
                },
                'mozVisibilityState': {
                    get: function () {
                        return 'visible'
                    },
                },
                'hidden': {
                    get: function () {
                        return false
                    },
                },
                'webkitHidden': {
                    get: function () {
                        return false
                    },
                },
                'mozHidden': {
                    get: function () {
                        return false
                    },
                },
            }
        )

        var old_func = document.addEventListener,
            func = function (a, b, c) {
            if (/visibilitychange$/.test(a)) {
                return
            }
            old_func.call(this, a, b, c)
        }
        document.addEventListener = func

    }()

    ;+function () {

        var old_func = window.addEventListener,
            func = function (a, b, c) {
                if (a == 'focus' || a == 'blur') {
                    return
                }
                old_func.call(this, a, b, c)
            }
        window.addEventListener = func

    }()

    ;+function () {

        function wait (select) {
            return new Promise(function (done, undone) {
                var sm = 0,
                    run = function () {
                        var dom = document.querySelector(select);
                        if (dom) {
                            done(dom);
                        }
                        else if (sm++ < 50) {
                            setTimeout(run, 100);
                        }
                        else {
                            undone('Cannot not find ' + select + ' in 5s.');
                        }
                    };
                run();
            });
        };

        function has_class (class_name) {
            var list = this.classList
            for (var i = 0; i < list.length; ++i) {
                if (list[i] == class_name) {
                    return true
                }
            }
            return false
        }

        wait('.J-next-btn.next-auto.moco-btn.moco-btn-green')
        .then(function (dom) {
            var run = function () {
                if (!has_class.call(dom, 'hide')) {
                    dom.click()
                }
                else {
                    // do nothing.
                }
            }
            setInterval(run, 1000)
        })
        .catch(console.log)

    }()

}()