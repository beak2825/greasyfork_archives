// ==UserScript==
// @name                dati
// @name:zh-CN          大头答题
// @namespace           www.icycat.com
// @description         自动答题
// @description:zh-CN   检测答案自动答题
// @author              冻猫
// @include             https://www.douyu.com/*
// @version             1.6.3
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/372647/dati.user.js
// @updateURL https://update.greasyfork.org/scripts/372647/dati.meta.js
// ==/UserScript==

function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
}

exec(function() {
    function checkPreview() {
        if (document.querySelector('div[class^="answerPreview"]')) {
            console.log('%c30秒后开始答题', 'color:#f60');
            setTimeout(function() {
                console.log('%c开始检测答案', 'color:#f60');
                findAnswer(1);
            }, 25000);
            return;
        }
        setTimeout(function() {
            checkPreview();
        }, 1000);
    }

    function findAnswer(t) {
        var json = {};
        json[1] = 0;
        json[2] = 0;
        json[3] = 0;
        var content = document.querySelectorAll('.Barrage-content');
        for (var i = 0; i < content.length; i++) {
            switch (content[i].innerText.substr(0, 1).toUpperCase()) {
                case 'A':
                    json[1]++;
                    break;
                case 'B':
                    json[2]++;
                    break;
                case 'C':
                    json[3]++;
                    break;
            }
        }
        var tempVal = 0,
            tempKey = '';
        for (var key in json) {
            if (json[key] > tempVal) {
                tempKey = key;
                tempVal = json[key];
            }
        }
        if (tempKey) {
            console.log('%c检测到最多答案为' + tempKey + '!', 'color:#f60');
            socketAnswer(tempKey - 1);
            // answer(tempKey - 1);
        } else {
            t++;
            if (t < 30) {
                setTimeout(function() {
                    findAnswer(t);
                }, 100);
            } else {
                console.log('%c没有检测到答案，有C选C了', 'color:#f60');
                socketAnswer(2);
                // answer(2);
            }
        }
    }

    function answer(ans) {
        console.log('%c准备答题', 'color:#f60');
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                var li = document.querySelectorAll('div[class^="answerProblem"] ul li');
                if (li.length > 0) {
                    li[ans].click();
                    var d = new Date();
                    console.log('%c' + d.toLocaleTimeString() + '.' + d.getMilliseconds(), 'color:#f60');
                    console.log('%c答题完成 -- 无延迟点击，19分钟后自动刷新网页', 'color:#f60');
                    setTimeout(function() {
                        window.location.reload();
                    }, 1140000);
                    observer.disconnect();
                }
            });
        });
        observer.observe(document.querySelector('div[class^="answerPreview"]').parentNode, {
            childList: true
        });
    }

    function socketAnswer(ans) {
        window.socketProxy.socketStream.subscribe('compqs', problemHandler);
        var rid = window.socketProxy.info.room.roomId;
        var uid = document.querySelector('.Avatar-img').getAttribute('uid');

        function problemHandler(e) {
            if (e.qid) {
                var msg = {
                    type: 'compqaq',
                    acid: 'act_comdt',
                    qid: e.qid,
                    aid: ans,
                    rid: rid,
                    uid: uid,
                };
                window.socketProxy.sendMessage(msg);
                var d = new Date();
                console.log('%c' + d.toLocaleTimeString() + '.' + d.getMilliseconds(), 'color:#f60');
                console.log('%c答题完成 -- 直接上传答案，19分钟后自动刷新网页', 'color:#f60');
                setTimeout(function() {
                    window.location.reload();
                }, 1140000);
            }
        }
    }

    checkPreview();
    console.log('%c开始自动答题 -- 1.6.3', 'color:#f60');

});