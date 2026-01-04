// ==UserScript==
// @name         知乎去除视频
// @namespace    
// @version      0.4
// @description  去除知乎首页推荐视频，干净的文字阅读
// @author       clen
// @match        https://www.zhihu.com/
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433039/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/433039/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
                'use strict';
                var COUNT = 12
                function clear(time = 40){
                    setTimeout(() => {
                            var all = document.querySelectorAll('.TopstoryItem-isRecommend')
                            for (var j = all.length; j > all.length - COUNT; j--) {
                                var item = all[j]
                                if (item && (item.getAttribute('class').includes('TopstoryItem--advertCard') || item.children[0].getAttribute('data-za-extra-module').includes('Zvideo')|| item.children[0].getAttribute('data-za-extra-module').includes('video_id'))) {
                                    item.parentNode.removeChild(item)
                                }
                            }
                        },time)
                }
                function perf_observer(list, observer) {
                    // Process the "resource" event
                    var entries = list.getEntries();
                    var bol = false

                    for (var i = 0; i < entries.length; i++) {
                        if (entries[i].name.includes('recommend')) {
                            bol = true
                            break
                        }
                    }

                    if (bol) {
                        clear()
                    }
                }
                var observer2 = new PerformanceObserver(perf_observer);
                observer2.observe({ entryTypes: ["resource"] });
clear(100)
            })();