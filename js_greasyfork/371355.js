// ==UserScript==
// @name         显示信号强度
// @namespace    http://yonsm.github.io/
// @version      1.3.1
// @description  在 Padavan 设备状态中显示 WIFI 信号强度，点击“信号”标题可按信号强度排序。
// @author       Yonsm
// @include      */device-map/clients.asp
// @include      */Main_WStatus2g_Content.asp
// @run-at       document-end.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371355/%E6%98%BE%E7%A4%BA%E4%BF%A1%E5%8F%B7%E5%BC%BA%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/371355/%E6%98%BE%E7%A4%BA%E4%BF%A1%E5%8F%B7%E5%BC%BA%E5%BA%A6.meta.js
// ==/UserScript==


(function() {
    //'use strict';

    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var text = this.responseText;

            if (location.pathname == '/Main_WStatus2g_Content.asp') {
                var token = 'var ipmonitor = [[';
                var start = text.indexOf(token);
                if (start == -1) {
                    console.log('未找到特征：' + text);
                    return;
                }

                start += token.length;
                var end = text.indexOf(']];', start);
                var lines = text.substring(start, end).split('], [');

                var dict = [];
                for (var i = 0; i < lines.length; i++) {
                    var fields = lines[i].split(', ');
                    var mac = fields[1].replace(/\"/g, "");
                    var host = fields[2].replace(/\"/g, "");
                    if (host.length && host != 'null') {
                        dict[mac] = host;
                    }
                }

                var textareas = document.getElementsByTagName('textarea');
                for (var k = textareas.length - 1; k >= 0; k--) {
                    var textarea = textareas[k];
                    lines = textarea.innerHTML.split('\n');
                    var output = '';
                    var changed = false;
                    for (i = 0; i < lines.length; i++) {
                        var line = lines[i].trim();
                        var space = line.indexOf(' ');
                        if (space == 17) {
                            mac = line.substr(0, 17);
                            if (dict.hasOwnProperty(mac)) {
                                output += dict[mac];
                                for (var j = 17 - dict[mac].length; j > 0; j--) {
                                    output += ' ';
                                }
                                output += line.substr(17)+ '\n';
                                changed = true;
                                continue;
                            }
                        }
                        output += line + '\n';
                    }
                    if (changed) {
                        textarea.innerHTML = output;
                        break;
                    }
                }
                return;
            }

            var token = 'MAC                PhyMode  BW MCS SGI LDPC STBC TRate RSSI PSM Connect Time';
            var start = text.indexOf(token);
            if (start == -1) {
                console.log('未找到特征：' + text);
                return;
            }

            start += token.length;
            var end = text.indexOf('</textarea>', start);
            var lines = text.substring(start, end).split('\n');
            var dict = [];
            for (var i = 0; i < lines.length; i++) {
                var fields = lines[i].split(/\s+/);
                if (fields.length == 11) {
                    var mac = fields[0].split(':').join('');
                    dict[mac] = fields[8];
                }
            }

            var table = document.getElementById('Clients_table');
            if (table == null) {
                console.log('未找到表格');
                return;
            }
            var rows = table.rows;
            rows[1].cells[4].innerHTML = '<a href="#" onclick="reorder(); return false">信号</a>';
            var items = [];
            for (i = 2; i < rows.length; i++) {
                var cells = rows[i].cells;
                if (cells.length < 5) {
                    console.log('列表数据不足');
                    return;
                }
                mac = cells[3].innerText;
                var rssi = dict.hasOwnProperty(mac) ? dict[mac] : '-00';
                items.push([cells[0].innerHTML, cells[1].innerHTML, cells[2].innerHTML, cells[3].innerHTML, rssi]);
            }
            if (top.location.hash == '#sort') {
                items.sort(function(x, y) {return y[4] - x[4]});
            }
            for (i = 2; i < rows.length; i++) {
                for (var j = 0; j < 5; j++) {
                    rows[i].cells[j].innerHTML = items[i-2][j];
                }
            }

            var script = document.createElement('script');
            script.innerHTML = 'function reorder() {\n\
var rows = document.getElementById("Clients_table").rows;\n\
var items = [];\n\
for (i = 2; i < rows.length; i++) {\n\
var cells = rows[i].cells;\n\
var key = cells[4].innerText;\n\
items.push([cells[0].innerHTML, cells[1].innerHTML, cells[2].innerHTML, cells[3].innerHTML, key]);\n\
}\n\
items.sort(function(a, b) {return reverse ? a[4].localeCompare(b[4]) : b[4].localeCompare(a[4])});\n\
reverse = !reverse;\n\
for (i = 2; i < rows.length; i++) {\n\
for (var k = 0; k < 5; k++) {\n\
rows[i].cells[k].innerHTML = items[i-2][k];\n\
}\n\
}\n\
}\nvar reverse = false;';
            document.body.appendChild(script);
        }
    };
	ajax.open("GET", (location.pathname == '/Main_WStatus2g_Content.asp') ? '/device-map/clients.asp' : '/Main_WStatus2g_Content.asp', true);
    ajax.send();
})();
