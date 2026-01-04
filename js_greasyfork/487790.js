// ==UserScript==
// @name         卷王监视器
// @version      1.6.5
// @description  监视身边那些偷偷卷的人
// @author       Ricky_in & hhoppitree
// @match        https://www.luogu.com.cn/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAsCAIAAAB60XZVAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAHYcAAB2HAY/l8WUAAAIJSURBVFhH7ZPRcQMxCESvkHymChfkelyNm3ENqcHhjhWHOEBImczkI2/2IxIs2pzk7f2X+E8Ts57m6+MzEjrmmU5jDs4FT5m5NOawomAuUE1jDmCh1mN6WKiNKKVZG73gGqRZmGiYmpClmRqUUJ9TTYOtVYqjwjTaz0JhlcqoiTQk1FYZjvLTaI/8zbo9XtwDnvdt2/pN2rJdgszBusdJIwbx6B3S/cnbO6/HzYQ54oVx9BxsKbI0WB/IJqsFsmGO9abjXpEhWCuqaQjZP6v2mvZ1HoXoJvTYNNJqu4+DdZW0X0mKe196ArYaYRqsL0gDK3ofOWLHujGdhpCeYWdE5C2l4bepkTYWdj3yy8K6sfJt3DfUftrDR7yjXB3Tadp32v9naYaFa4WndFp6ptLIjZ0HSj9c/IFGX+js76mmuT4dQSys2+PBiZJI0ox1I0yjW9XlEEew/jq0qxlb/kumS+eJTUNErQ0nDSGu1LuT9Pw8DV4KIUZWdFHSgLUiS+Maom/DaK9rz6tOGiIxEMfXCJ+oeN0J0T4zSBPYzttx0XY9wd3U+GmIoTNH23mCWbqEaYiKP0HbtVD2yNIQxSkR2i5CzWMiTT4oYmrCIA1hxpFQGGFcJBRixmkYM5eFWo/pYaE2opqGMAfUBX+BiTSMOSkXPGWm0wjmYC10zLOe5jf4TxPzl9K8398kNPdShpSoHAAAAABJRU5ErkJggg==
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1264013
// @downloadURL https://update.greasyfork.org/scripts/487790/%E5%8D%B7%E7%8E%8B%E7%9B%91%E8%A7%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/487790/%E5%8D%B7%E7%8E%8B%E7%9B%91%E8%A7%86%E5%99%A8.meta.js
// ==/UserScript==

$(window).load(function() {
    // bug: selector, latest 做题, multioj
    console.log('卷王监视器 Runs Successfully!');
        var userlist =
            ["hhoppitree", "kkksc03"]; // 在这里加入您想要监视的用户！
    var lstt = 12;
    var opentime = Math.round(new Date().getTime() / 1000);
    var tbegin = Math.round(new Date().getTime() / 1000);
    var type = prompt("输入小时数（0 为当天开始，24 为近 24 小时，168 为近 7 日，672 为近四周，-1 为取消，数字越大加载可能会越缓慢）");
    if (type == -1 || type == null) {
        return;
    } else if (type == 0) {
        tbegin -= tbegin % 86400;
    } else {
        tbegin -= type * 3600;
    }
    var cd = 10000;
    var a = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    var pre = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var numcnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var colors = ['rgb(191, 191, 191)', 'rgb(254, 76, 97)', 'rgb(243, 156, 17)', 'rgb(255, 193, 22)', 'rgb(82, 196, 26)', 'rgb(52, 152, 219)', 'rgb(157, 61, 207)', 'rgb(14, 29, 105)', 'rgb(14, 29, 105)'];
    var name = "灰红橙黄绿蓝紫黑卷";
    var lst = Array(), pro = Array();
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
    for (var i = 0; i < userlist.length; i++)
        str += '<option value="' + userlist[i] + '">' + userlist[i] + '</option>';
    str += '</select></div><table id="grade" style="white-space: nowrap;"><thead><tr><th>用户</th><th>题目数量</th>'
    for (var j = 0; j < 8; j++)
        str += '<th>' + "<a style='color:" + colors[j] + "'>" + name[j] + '</a></th>';
    str += '</tr></thead><tbody>';
    str += '</tbody></table><table id="store" style="white-space: nowrap;"><tr><th>用户</th><th>题号</th><th>标题</th></tr></table>';
    document.body.innerHTML = "<h1 style='text-align:center;color:red;font-family:Microsoft Yahei'>内卷监视工具（升级版）</h1>";
    document.body.innerHTML += "<b style='text-align:center;'>Author：<a href='https://www.luogu.com.cn/user/78206'>ricky_lin</a>；脚本化：hhoppitree</b>";
    document.body.innerHTML += str;
        function PARSE(First = false) {
            cnt = (cnt + 1) % userlist.length;
            var user = userlist[cnt];
            var Pagenum = 1;
            lstt = tbegin;
            var leng = 0;
            for (; lstt >= tbegin; Pagenum++) {
                var httpRequest = new XMLHttpRequest();
                httpRequest.open('GET', 'https://www.luogu.com.cn/record/list?user=' + user + '&status=12&page=' + Pagenum, false);
                httpRequest.send();
                if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                    var content = httpRequest.responseText;
                    var patten = /decodeURIComponent\(".*?"\)/;
                    content = patten.exec(content)[0];
                    content = content.substr(20, content.length - 22);
                    content = JSON.parse(decodeURIComponent(content));
                    var prob, col, pid, title;
                    lst[cnt] = 0;
                    if (content.currentData.records == undefined) {
                        window.alert("用户 " + user + " 未找到！请更改 NameList 并刷新页面，否则会有不可预知的错误发生。");
                    }
                    for (var i = Math.min(content.currentData.records.result.length - 1, 19); i >= 0; i--) {
                        var ts = 1;
                        for (var zz = 0; zz < ts; zz++) {
                            lstt = content.currentData.records.result[i].submitTime;
                            if (content.currentData.records.result[i].status == 12) {
                                prob = content.currentData.records.result[i].problem;
                                col = colors[prob.difficulty];
                                pid = prob.pid;
                                title = prob.title;
                                var flag = 1;
                                for (var z = 0; z < leng; z++) {
                                    if (pro[z] == pid) {
                                        flag = 0;
                                        break;
                                    }
                                }
                                if (tbegin <= lstt && flag) {
                                    document.getElementById('store').childNodes[0].innerHTML
                                        += '<tr><td>' + user + '</td><td>' + pid + '</td><td>' +
                                        "<a style='color:" + col + "' href='https://www.luogu.com.cn/problem/" + pid + "' target='_blank'>"
                                        + title + "</a>" + '</td></tr>';
                                    if (lstt >= opentime) alert(user + " 刚刚卷了" + name[prob.difficulty] + "题 " + pid + " " + title);
                                    ++numcnt[cnt];
                                    ++a[cnt][prob.difficulty];
                                    pro[leng] = pid;
                                    leng++;
                                }
                                pre[cnt] = pid;
                                lst[cnt] = content.currentData.records.result[i].id;
                            }
                        }
                    }
                }
            }
            if (cnt != userlist.length - 1) {
                return;
            }
            var tstr = "<thead><tr><th>用户</th><th>题目数量</th>";
            for (var k = 0; k < 9; k++)
                tstr += '<th>' + "<a style='color:" + colors[k] + "'>" + name[k] + '</a></th>';
            tstr += '</tr></thead><tbody>';
            var ids = new Array();
            for (var kk = 0; kk < userlist.length; ++kk) {
                var zzz = 0;
                for (var ll = 0; ll < userlist.length; ++ll) {
                    a[ll][8] = a[ll][0] * 100 + a[ll][1] * 25 + a[ll][2] * 50 + a[ll][3] * 100 + a[ll][4] * 150 + a[ll][5] * 250 + a[ll][6] * 500 + a[ll][7] * 1000;
                    zzz += (a[ll][8] > a[kk][8] || (a[ll][8] == a[kk][8] && ll < kk));
                }
                ids[zzz] = kk;
            }
            for (var tl = 0; tl < userlist.length; tl++) {
                var l = ids[tl];
                console.log(l);
                tstr += '<tr><td>' + userlist[l] + '</td><td>' + numcnt[l] + '</td>';
                for (var j = 0; j < 9; j++) {
                   tstr += '<td>' + a[l][j] + '</td>';
               }
                tstr += '</tr>';
            }
            document.getElementById('grade').childNodes[0].innerHTML = tstr;
        }
    for (var i2 = 0;i2 < userlist.length; i2++) lst[i2] = 0;
     for (var i3 = 0; i3 < userlist.length; i3++)PARSE(true);
});