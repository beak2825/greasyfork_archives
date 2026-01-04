// ==UserScript==
// @name         行政區自動填入
// @namespace    http://tampermonkey.net/
// @version      2024-01-29
// @description  自動識別行政區
// @author       You
// @match        https://highschool.kh.edu.tw/Login.action
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.tw
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485988/%E8%A1%8C%E6%94%BF%E5%8D%80%E8%87%AA%E5%8B%95%E5%A1%AB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/485988/%E8%A1%8C%E6%94%BF%E5%8D%80%E8%87%AA%E5%8B%95%E5%A1%AB%E5%85%A5.meta.js
// ==/UserScript==


(function() {
    'use strict';
	setTimeout(2000);
$.post("School.action", { schNo: '553301D' }, function (json) {
    var d = json.parameterMap;
    if (d != null && d.list != null) {
        var h1 = ['<option value="">請選擇</option>'];
        var cc = {};

        var doChange = false;

        for (var i = 0; i < d.list.length; i++) {
            var selected = '';
            if (d.list[i].d == 'Y') {
                selected = ' selected="selected"';
                doChange = true;
            }
            h1.push('<option value="' + d.list[i].z + '"' + selected + '>' + d.list[i].n + '</option>');
            cc['' + d.list[i].z] = d.list[i].s;
        }

        $("#zip").html(h1.join("")).change(function () {
            var v = $(this).val();
            var def = $('#schNo').attr("def");
            $('#schNo').removeAttr("def");

            if (cc[v]) {
                var h2 = ['<option value="">請選擇</option>'];
                for (var i = 0; i < cc[v].length; i++) {
                    var selected = '';
                    if (def != null && def == cc[v][i].s) selected = ' selected="selected"';
                    h2.push('<option value="' + cc[v][i].s + '"' + selected + '>' + cc[v][i].n + '</option>');
                }
                $("#schNo").html(h2.join(""));
                if (h2.length == 2) {
                    $("#schNo").val($("#schNo").find("option:last")[0].value);
                    $("#loginId").focus();
                }
            }
        })

        if (doChange) {
            $("#schNo").attr("def", "553301D");
            $("#zip").change();
        }
    }
    setTimeout(3000);
    $("#schNo").prop("selectedIndex", 5);
}, 'json');


})();