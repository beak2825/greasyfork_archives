// ==UserScript==
// @name           2021年广东省教师继续教育信息管理平台公需课自动刷课
// @description    自用
// @author         gxk
// @match          http*://jsxx.gdedu.gov.cn/*
// @version        0.3
// @run-at         document-idle
// @license        WTFPL
// @namespace https://greasyfork.org/users/796911
// @downloadURL https://update.greasyfork.org/scripts/429819/2021%E5%B9%B4%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/429819/2021%E5%B9%B4%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';

    $(document)
        .ready(function() {
            var finished = false;
            var check_delay_in_ms = 1000;

            function checktimu() {
                if (document.getElementById('questionDiv') != null) {
                    setTimeout(solvetimu, 8000);
                }
            };

            function solvetimu() {
                console.log('solved timu.');
                console.debug($('#questionDiv')
                    .stopTime('C'));
                console.debug($('.mylayer-closeico')
                    .trigger('click'));
                //parent.player.videoPlay();
            }
            var checktimu_interval = setInterval(checktimu, check_delay_in_ms);

            function checkfinish() {
                if ((!finished) && document.getElementsByClassName('mylayer-content has-icon')
                    .length != 0 && document.getElementsByClassName('mylayer-content has-icon')[0].getElementsByTagName('div')[0].innerText == "您已完成这个活动") {
                    setTimeout(solvefinish, check_delay_in_ms);
                }
            };

            function solvefinish() {
                finished = true;
                console.log('finished.');
                goNext();
            }
            var checkfinish_interval = setInterval(checkfinish, check_delay_in_ms);

            function checkstatus() {
                updateVideoStatus();
            };
            setTimeout(checkstatus, check_delay_in_ms);

            function stopcountdown() {
                console.debug($('#playerDiv')
                    .stopTime('B'))
            }
            var stopcountdown_interval = setInterval(stopcountdown, check_delay_in_ms);

            function setsrc() {
                document.getElementById('video')
                    .firstElementChild.firstElementChild.setAttribute('src', 'about:blank')
            }
            setTimeout(setsrc, check_delay_in_ms);

            setTimeout(setTime, check_delay_in_ms);

            function checkmulti() {
                var saa = document.getElementsByClassName('mylayer-btn');
                for (var i = 0; i < saa.length; i++) {
                    if (saa[i].innerText == '计时观看') {
                        saa[i].setAttribute('id', 'jsgk123');
                        console.debug($('#jsgk123').click());
                    }
                }
            };

            function checktimeout() {
                if ((!finished) && document.getElementsByClassName('mylayer-content has-icon')
                    .length != 0 && document.getElementsByClassName('mylayer-content has-icon')[0].getElementsByTagName('div')[0].innerText == "页面已超时，请重新进入") {
                    setTimeout(solvetimeout, check_delay_in_ms);
                }
            };

            function solvetimeout() {
                window.location.href = '/uc/store/courseRegister';
            }
            var checktimeout_interval = setInterval(checktimeout, check_delay_in_ms);
            var checkmulti_interval = setInterval(checkmulti, check_delay_in_ms);

        });


})();