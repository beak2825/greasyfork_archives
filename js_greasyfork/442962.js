// ==UserScript==
// @name         TEL Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  TEL 系统助手
// @author       The King of Crap
// @match        https://*.tigermed.net/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @require      https://cdn.bootcdn.net/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_addStyle
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442962/TEL%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/442962/TEL%20Helper.meta.js
// ==/UserScript==

(function () {
    var KeyCodes = {
        Spacebar: 32
    };

    // 更新题库
    function do_update() {
        $(".questionflagpostdata").each(function () {
            var qid = /(qid)=(\d+)/.exec(this.value)[2];
            var slot = /(slot)=(\d+)/.exec(this.value)[2];
            var qubaid = /(qubaid)=(\d+)/.exec(this.value)[2];
            var inp = $(`.answer div[class^='r'] input[id^='q${qubaid}:${slot}_']`);
            var type = inp[0].type;
            var flag = false;
            var rs = inp.parent().siblings();
            var i = 0;
            var len = rs.length;
            var answer = {};
            for (i = 0; i < len; i++) {
                var cor = rs[i].className.split(/ +/)[1];
                var txt = rs[i].innerHTML.replace(/<.+?>|\n|&nbsp;| /gim, "").replace(/^[a-z]\.\s*/gim, "").trim();
                if (cor && cor.trim() == "correct") {
                    answer[txt] = 2;
                    flag = true;
                } else if (cor && cor.trim() == "incorrect") {
                    answer[txt] = 1;
                } else {
                    answer[txt] = -1;
                }
            }
            if (flag && type == "radio") {
                for (var key in answer) {
                    answer[key] = Math.abs(answer[key]);
                }
            }
            var storage = window.localStorage;
            var old_answer = storage[qid];
            if (old_answer) {
                old_answer = JSON.parse(old_answer);
                for (key in answer) {
                    answer[key] = Math.max(old_answer[key], answer[key]);
                }
            }
            storage[qid] = JSON.stringify(answer);
        });

    }

    // Fisher–Yates shuffle 洗牌算法
    function shuffleSelf(array, size) {
        var index = -1;
        var length = array.length;
        var lastIndex = length - 1;
        var value;

        size = size === undefined ? length : size;
		while (++index < size) {
            var rand = index + Math.floor( Math.random() * (lastIndex - index + 1))
            value = array[rand];

            array[rand] = array[index];
            array[index] = value;
	}
        array.length = size;
        return array;
    }

    // 进行选题
    function do_select() {
        $(".questionflagpostdata").each(function () {
            var qid = /(qid)=(\d+)/.exec(this.value)[2];
            var slot = /(slot)=(\d+)/.exec(this.value)[2];
            var qubaid = /(qubaid)=(\d+)/.exec(this.value)[2];
            var inp = $(`.answer div[class^='r'] input[id^='q${qubaid}:${slot}_']`);
            var type = inp[0].type;
            var rs = inp.parent().siblings();
            var cs = rs.find("input[type='radio'], input[type='checkbox']");
            var i = 0;
            var len = rs.length;
            var storage = window.localStorage;
            var answer = storage[qid];

            var txts = [];
            for (i = 0; i < len; i++) {
                var txt = rs[i].innerHTML.replace(/<.+?>|\n|&nbsp;| /gim, "").replace(/^[a-z]\.\s*/gim, "").trim();
                txts.push(txt.trim());
            }

            if (!answer) {
                answer = {};
                for (i = 0; i < len; i++) {
                    if (txts[i] == '是YES') {
                        answer[txts[i]] = 0.5;
                    }
                    else {
                        answer[txts[i]] = -1;
                    }
                }
            } else {
                answer = JSON.parse(answer);
            }

            var order = shuffleSelf([...new Array(len).keys()]);
            for (i = 0; i < len; i++) {
                var idx = order[i];
                if ([0.5, 2].includes(answer[txts[idx]])) {
                    cs[idx].checked = true;
                    if (type == "radio") {
                        return;
                    }
                } else if (answer[txts[idx]] == 1) {
                    cs[idx].checked = false;
                } else if (answer[txts[idx]] == -1) {
                    cs[idx].checked = true;
                }
            }
        });
    }

    function do_click(nodeobj) {
        nodeobj.click();
    }

    var pathname = window.location.pathname;
    var search = window.location.search;
    var href = window.location.href;
    if (pathname.endsWith("attempt.php")) {
        do_select();
        window.addEventListener('load', function() {
            $("input[type='submit'][name='next']").click();
        }, false);
    } else if (pathname.endsWith("review.php")) {
        if (/showall=1/.test(search)) {
            do_update();
            $(".brand[title='Home'").text("更新题库成功");
            window.addEventListener('load', function() {
                $("div.submitbtns>a.mod_quiz-next-nav")[0].click();
            }, false);
        } else {
            $(location).attr("href", href + "&showall=1");
        }
    } else if (pathname.endsWith("summary.php")) {
        waitForKeyElements ("input[type='submit'][value='Submit all and finish']", do_click);
        waitForKeyElements ("input[type='button'][value='Submit all and finish']", do_click);
    } else if (pathname.endsWith("mod/quiz/view.php") || pathname.endsWith("mod/url/view.php")) {
        window.addEventListener('load', function() {
            if ($("div[class=row-fluid] div.pull-right>a")[0]) {
                $("div[class=row-fluid] div.pull-right>a")[0].click();
            } else if ($("div.urlworkaround>a")[0]) {
                $("div.urlworkaround>a")[0].click();
            } else if ($("input[type='submit'][value*='attempt']")) {
                document.querySelector("input[type=submit]").click();
            }
        });
    } else if (pathname.endsWith("course/view.php")){//主页
        window.addEventListener('load', function() {
            var urls = $("li#section-1 div.activityinstance a");
            var imgs = $("li#section-1 span.actions img");
            var len  = urls.length;
            var need_reload = false;
            for (var i = 0; i < urls.length; i++) {
                if (urls[i].innerText.indexOf("Signature") != -1 || urls[i].innerText.indexOf("Examination") != -1) {
                    if (!imgs[i].src.endsWith('-y') && !imgs[i].src.endsWith('-pass')) {
                        urls[i].click();
                        break;
                    }
                }
                else if (!imgs[i].src.endsWith('-y') && !imgs[i].src.endsWith('-pass')) {
                    if (imgs[i].src.indexOf('manual') != -1) {
                        imgs.click();
                    } else {
                        need_reload = true;
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: urls[i].href,
                            onload: function(response) {
                                console.log(response.responseHeaders);
                            }
                        });
                    }
                }
            }
            if (need_reload) {
                window.location.reload();
            }
        });
    }
    else if (pathname.endsWith("MoodleDigitalSignature")) {
        window.addEventListener('load', function() {
            $("a[onclick*=agreeToSign]")[0].click();
            window.location.href = "https://tel.tigermed.net/moodle/course/view.php?id=" + /^.*?course=(\d+).*$/i.exec(window.location.href)[1];
        });
    }

})();
