// ==UserScript==
// @name         getFreeSS
// @namespace    elonhhuang@gmail.com
// @version      0.2.8
// @description  从free-ss获取批量ss账号到剪切板
// @author       ElonH <elonhhuang@gmail.com>
// @license      MIT https://opensource.org/licenses/MIT
// @match        *://*.free-ss.site
// @match        *://*.free-ss.tw
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/377265/getFreeSS.user.js
// @updateURL https://update.greasyfork.org/scripts/377265/getFreeSS.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var getFreeSS = {
        nowDate: '',
        tableClassName: 'compact stripe hover nowrap dataTable no-footer',
        emptyTableClassName: 'dataTables_empty',
        Filed: ["V/T/U/M", "Address", "Port", "Method", "Password"],
        Method: ["rc4-md5", "salsa20", "chacha20", "chacha20-ietf",
                 "aes-256-cfb", "aes-192-cfb", "aes-128-cfb",
                 "aes-256-ctr", "aes-192-ctr", "aes-128-ctr",
                 "bf-cfb", "chacha20-ietf-poly1305", "xchacha20-ietf-poly1305",
                 "camellia-128-cfb", "camellia-192-cfb", "camellia-256-cfb",
                 "aes-128-gcm", "aes-192-gcm", "aes-256-gcm"],
        colorField: 'pink',
        colorItem: '#DAF7A6',


        init: function () {
            var tmpDate = new Date();
            this.nowDate = '(' + (tmpDate.getMonth() + 1) + '-' + tmpDate.getDate() + ')';
            //console.log(getFreeSS.nowDate);
            this.add_panel();
        },
        //add panel
        add_panel: function () {
            var tmp = document.getElementsByTagName('h3')[1];// locate title
            tmp.id = 'sTitle';
            $('#sTitle').after('<textarea id="ss_ta" rows="1" cols="100"></textarea>');// add textarea
            for (let i = 3; i > 0; i--) {
                $('#ss_ta').after('<button id="ss_btn' + i + '">extra</button>');// add button
                document.getElementById('ss_btn' + i).addEventListener("click", function () { getFreeSS.extra_ss(i) }, false);// add listener
            }
            $('#ss_ta').after('<br>');
        },
        // button function
        extra_ss: function (tab_idx) {
            console.log('extra_ss: ' + tab_idx);
            var vector = document.getElementsByClassName(this.tableClassName);
            getFreeSS.reset();
            var sTable = vector[tab_idx];
            console.log(sTable);
            getFreeSS.set_field_color(sTable);

            var content = sTable.getElementsByTagName('tr');
            var idx = getFreeSS.get_field_idx(content[0].children)
            // gen ss
            var collector = [];
            for (let i = 1; i < content.length; i++) {
                let item = content[i];
                if (item.children[0].className == this.emptyTableClassName) {
                    console.log('Empty Table');
                    return;
                }
                let score_list = item.children[idx[0]].textContent.match(/\d+/g), // V/T/U/M
                    address = item.children[idx[1]].textContent, // IP地址
                    port = item.children[idx[2]].textContent, // 端口
                    method = item.children[idx[3]].textContent, // 加密方法
                    pass = item.children[idx[4]].textContent, // 密码
                    country = item.children[idx[6]].textContent, // 国家
                    aliax = country + getFreeSS.nowDate + item.children[idx[5]].textContent; // 配置名称

                score_list.forEach(function (value, index) { // string to int
                    score_list[index] = parseInt(value, 10);
                });
                //--------------------filter----------------------
                var score_total = 0;
                score_list.forEach(function (value) { score_total += value; });
                if (score_list[1] < 7) { // Chinese Telecom
                    if (score_total < score_list.length * 7)
                        continue;
                    if (score_total < score_list.length * 9 && !(country in ["JP", "RU", "KR"]))
                        continue;
                }
                //--------------------filter----------------------
                getFreeSS.set_item_color(item);

                var ss = 'ss://' + btoa(method + ':' + pass + '@' + address + ':' + port) + '#' + aliax;
                collector.push({
                    'score': score_total,
                    'ss': ss
                });
                //console.log(ss);
            }
            //--------------------sort----------------------
            collector.sort(function (a, b) { return b.score - a.score; }); // sort by score_total(Descend)
            console.log(collector);
            //--------------------sort----------------------
            var ss_list = '';
            collector.forEach(function (value) { ss_list += value.ss + '\n'; })
            //copy operation
            GM_setClipboard(ss_list, 'text');
            $('#ss_ta').val(ss_list);

        },
        // reset the selected item 
        reset: function (vector) {
            var vector = document.getElementsByClassName(this.tableClassName);
            $('#ss_ta').val('');
            var trs = document.getElementsByTagName('tr')
            for (let i = 0; i < trs.length; i++) {
                trs[i].style.backgroundColor = '';
            }
        },
        //set correspondent table title backgounnd color
        set_field_color: function (sTable) {
            sTable.getElementsByTagName('tr')[0].style.backgroundColor = this.colorField;
        },
        // mark selected item with green background color
        set_item_color: function (item) {
            item.style.backgroundColor = this.colorItem;
        },
        // get Table Field idx
        get_field_idx: function (field_list) {
            var names = Array();
            for (let i = 0; i < field_list.length; i++) {
                names.push(field_list[i]);
            }
            var idx = [];
            for (var i = 0; i < this.Filed.length; i++) {
                idx.push(names.findIndex(function (field) { return field.textContent == getFreeSS.Filed[i]; }));
            }
            idx.push(5, 6, 7);
            if (idx[3] == -1 || idx[4] == -1) {
                console.log("don't exist the Field \"Method\" or \"Password\"")
                // judge by width(bug)
                /*
                let width_idx = [];
                for (let i = 0; i < field_list.length; i++) {
                    if (idx.indexOf(i) != -1)
                        continue;
                    console.log(field_list[i]);
                    let w = field_list[i].style.width;
                    width_idx.push({
                        index: i,
                        width: parseInt(w.substr(0, w.length - 2),10)
                    });
                }
                width_idx.sort(function (a, b) { return b.width - a.width; });
                idx[4] = width_idx[0].index;
                idx[3] = width_idx[1].index;
                */
                // judge by method string
                var method_simple = field_list[0].parentElement.parentElement.nextElementSibling.children[0].children[3]
                if (getFreeSS.Method.indexOf(method_simple.innerText) != -1) {
                    idx[3] = 3;
                    idx[4] = 4;
                }
                else {
                    idx[3] = 4;
                    idx[4] = 3;
                }
            }
            console.log(idx);
            return idx;
        }
    };
    getFreeSS.init();

})();