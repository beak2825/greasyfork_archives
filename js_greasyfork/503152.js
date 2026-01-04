// ==UserScript==
// @name         lg 题目统计
// @version      1.0.2
// @description  题目统计
// @author       incra
// @match        https://www.luogu.com.cn/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAsCAIAAAB60XZVAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAHYcAAB2HAY/l8WUAAAIJSURBVFhH7ZPRcQMxCESvkHymChfkelyNm3ENqcHhjhWHOEBImczkI2/2IxIs2pzk7f2X+E8Ts57m6+MzEjrmmU5jDs4FT5m5NOawomAuUE1jDmCh1mN6WKiNKKVZG73gGqRZmGiYmpClmRqUUJ9TTYOtVYqjwjTaz0JhlcqoiTQk1FYZjvLTaI/8zbo9XtwDnvdt2/pN2rJdgszBusdJIwbx6B3S/cnbO6/HzYQ54oVx9BxsKbI0WB/IJqsFsmGO9abjXpEhWCuqaQjZP6v2mvZ1HoXoJvTYNNJqu4+DdZW0X0mKe196ArYaYRqsL0gDK3ofOWLHujGdhpCeYWdE5C2l4bepkTYWdj3yy8K6sfJt3DfUftrDR7yjXB3Tadp32v9naYaFa4WndFp6ptLIjZ0HSj9c/IFGX+js76mmuT4dQSys2+PBiZJI0ox1I0yjW9XlEEew/jq0qxlb/kumS+eJTUNErQ0nDSGu1LuT9Pw8DV4KIUZWdFHSgLUiS+Maom/DaK9rz6tOGiIxEMfXCJ+oeN0J0T4zSBPYzttx0XY9wd3U+GmIoTNH23mCWbqEaYiKP0HbtVD2yNIQxSkR2i5CzWMiTT4oYmrCIA1hxpFQGGFcJBRixmkYM5eFWo/pYaE2opqGMAfUBX+BiTSMOSkXPGWm0wjmYC10zLOe5jf4TxPzl9K8398kNPdShpSoHAAAAABJRU5ErkJggg==
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1264013
// @downloadURL https://update.greasyfork.org/scripts/503152/lg%20%E9%A2%98%E7%9B%AE%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/503152/lg%20%E9%A2%98%E7%9B%AE%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

$(window).load(function() {
    var user = "wmrqwq";
    var lstt = 12;
    var type = prompt("是否退出？退出请输入0否则请输入1");
    if (type == 0 || type == null) {
        return;
    }
    var cd = 10000;
    var a = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    var pre = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var numcnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var colors = ['rgb(191, 191, 191)', 'rgb(254, 76, 97)', 'rgb(243, 156, 17)', 'rgb(255, 193, 22)', 'rgb(82, 196, 26)', 'rgb(52, 152, 219)', 'rgb(157, 61, 207)', 'rgb(14, 29, 105)', 'rgb(14, 29, 105)'];
    var name = "灰红橙黄绿蓝紫黑卷";
    var lst = Array(), pro = Array();
    var ans = Array(),anslen = 0;
    var cnt = -1;
    function onSearch(obj) {
        var gradeId = document.getElementById('grade');
        var storeId = document.getElementById('store');
        var rowsLength = storeId.rows.length;
        var key = document.getElementById('key').value;
        for (var i = 1; i < rowsLength; i++) {
            var searchText = storeId.rows[i].cells[0].innerHTML;
            if (key == "*" || searchText.match(key)) {
                storeId.rows[i].style.display = '';
            }
            else {
                storeId.rows[i].style.display = 'none';
            }
        }
        rowsLength = gradeId.rows.length;
        key = document.getElementById('key').value;
        for (var ii = 1; ii < rowsLength; ii++) {
            var SearchText = gradeId.rows[ii].cells[0].innerHTML;
            if (key == "*" || SearchText.match(key)) {
                gradeId.rows[ii].style.display = '';
            }
            else {
                gradeId.rows[ii].style.display = 'none';
            }
        }
    }
    var str = '<div><select onchange="onSearch();" name="key" id="key"><option value="*">*</option>';

    document.body.innerHTML = "<h1 style='text-align:center;color:red;font-family:Microsoft Yahei'>luogu 题目统计（By incra）</h1>";
    document.body.innerHTML += "<p>luogu 目前只能统计 AC 的前 3000 题，所以这个插件就诞生了！！！</p>";
    var left = 1,right = 1000;
    while (left < right) {
        var mid = Math.floor((left + right + 1) / 2);
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', 'https://www.luogu.com.cn/record/list?user=' + user + '&status=12&page=' + mid, false);
        httpRequest.send();
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var content = httpRequest.responseText;
            var patten = /decodeURIComponent\(".*?"\)/;
            content = patten.exec(content)[0];
            content = content.substr(20, content.length - 22);
            content = JSON.parse(decodeURIComponent(content));
            if (content.currentData.records.result.length != 0) left = mid;
            else right = mid - 1;
        }
        else {
            alert ("Failed");
            return ;
        }
    }
    document.body.innerHTML += "<p>Pagenum = " + left + "</p>";
    var Pagenum = left;
    var leng = 0;
    const mp = new Map ();
    for (;Pagenum >= 1; Pagenum--) {
        httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', 'https://www.luogu.com.cn/record/list?user=' + user + '&status=12&page=' + Pagenum, false);
        httpRequest.send();
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            content = httpRequest.responseText;
            patten = /decodeURIComponent\(".*?"\)/;
            content = patten.exec(content)[0];
            content = content.substr(20, content.length - 22);
            content = JSON.parse(decodeURIComponent(content));
            var prob, col, pid, title;
            for (var i = Math.min(content.currentData.records.result.length - 1, 19); i >= 0; i--) {
                lstt = content.currentData.records.result[i].submitTime;
                if (content.currentData.records.result[i].status == 12) {
                    prob = content.currentData.records.result[i].problem;
                    col = colors[prob.difficulty];
                    pid = prob.pid;
                    title = prob.title;
                  //  document.body.innerHTML += "<p>" + prob.href + "</p>";
                    if (mp.get (pid)==undefined) ++numcnt[prob.difficulty];
                    mp.set (pid,1);
                }
            }
        }
    }
    for (i = 0;i < 8;i++) document.body.innerHTML += "<p>这个用户卷了 " + name[i] + "题 " + numcnt[i] + "</p>";
    return ;
});