// ==UserScript==
// @name         SCU党课网课自动学习
// @namespace    https://blog.csdn.net/steve95
// @version      2.1
// @description  解放你的双手
// @author       SNiFe
// @match        http://211.83.159.74/*
// @include      http://211.83.159.74/*
// @grant        none
// @run-at document-end
// @require    http://code.jquery.com/jquery-1.11.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/412716/SCU%E5%85%9A%E8%AF%BE%E7%BD%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/412716/SCU%E5%85%9A%E8%AF%BE%E7%BD%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function () {
    for (var event_name of ["visibilitychange", "webkitvisibilitychange", "blur"]) {
		  window.addEventListener(event_name, function(event) {
				event.stopImmediatePropagation();
			}, true);
		}
    setTimeout(function hhh() {
        var tips;
        var flag = true;
        var url = window.location.href;
        var tmp = url.split('=');
        var i, num, k = 0, j = 0, s;

        clearInterval(timer);
        for (i = 0; i < tmp.length; i++) {
            if (tmp[i][tmp[i].length - 4] == 'r' && tmp[i][tmp[i].length - 3] == '_' && tmp[i][tmp[i].length - 2] == 'i') {
                while ('0' <= tmp[i + 1][k] && tmp[i + 1][k] <= '9') k++;
                num = tmp[i + 1].substr(0, k);
                s = tmp[i + 1].substr(k, tmp[i + 1].length - k);
                num = Number(num);
                num++;
                num = String(num);
                tmp[i + 1] = num + s;
            }
        }
        url = tmp[0]; url += '=';
        for (i = 1; i < tmp.length; i++) {
            url += tmp[i];
            if (i != tmp.length - 1) url += '=';
        }
        window.setInterval(function () {
            if ($(".plyr__time--current").text() == "00:00") {
                window.location.href = url;
                return false;
            }
            else {
                $(".public_close").click(); //此为关闭方法
                player.play();
            }
        }, 5000);
    }, 3000);
})();