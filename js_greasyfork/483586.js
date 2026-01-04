// ==UserScript==
// @name         MoeTest
// @namespace    http://tampermonkey.net/
// @version      0.1i
// @description  萌享论坛新功能测试
// @author       DIBAO
// @match        https://moeshare.cc/u.php
// @match        https://www.moeshare.cc/u.php
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483586/MoeTest.user.js
// @updateURL https://update.greasyfork.org/scripts/483586/MoeTest.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var url = window.location.href;
    var nums = 0 ;
    switch (url) {
        case "https://moeshare.cc/u.php":
            DailyAttendance(nums);
            break;
        case "https://www.moeshare.cc/u.php":
            DailyAttendance(nums);
            break;
    }
    function DailyAttendance(nums) {
        var div = document.querySelector('.mb20');
        var card = div.querySelector('.fr');
        card.insertAdjacentHTML('afterend', '<span class="fr" style="padding:0 15px 0 0; margin-top: 5px;"><button id="usecard" type="button" class="card">' +
                                '<span style="color:blue; letter-spacing:-0.01em;" onclick="confirmbuy()">活跃度卡</span></button>' +
                                '<form id="buycard" action="profile.php?action=toolcenter&" method="post">' +
                                '<input type="hidden" name="job" value="buy">' +
                                '<input type="hidden" name="step" value="2">' +
                                '<input type="hidden" name="id" value="35">' +
                                `<input id="nums" type="hidden" name="nums" value=${nums}>` +
                                '<button type="button" style="padding: 3px 6px;" onclick="confirmnum()">⇐购买</button></form>' +
                                '<br><input type="checkbox" id="jump" name="jump" checked>使用时弹窗确认</input></span>');
        var checkbox = document.getElementById('jump');
        var isChecked = getCookie('jumpChecked') === 'true';
        checkbox.checked = isChecked;
        checkbox.addEventListener('change', function () {
            document.cookie = 'jumpChecked=' + checkbox.checked;
        });
    }
    window.confirmnum = function() {
        var num = prompt('请输入购买数量（一张活跃度卡消耗一次本月打卡）');
        if (num === null) {
    } else {
        var nums = parseFloat(num);
        if (isNaN(nums)) {
          alert('请输入有效的数字！');
      } else {
          var NumInput = document.getElementById('nums');
          NumInput.value = nums;
          document.getElementById('buycard').submit();
      }
    }
    }
    window.confirmbuy = function() {
        var checkbox = document.getElementById('jump');
        if (checkbox.checked) {
            var isConfirmed = confirm("确定使用活跃度卡吗？");
            if (isConfirmed) {
                window.location.href = "https://www.moeshare.cc/profile.php?action=toolcenter&job=use&toolid=35";
            }
        } else {
            window.location.href = "https://www.moeshare.cc/profile.php?action=toolcenter&job=use&toolid=35";
        }
    }
    function getCookie(name) {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return '';
    }
})();