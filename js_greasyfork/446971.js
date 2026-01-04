// ==UserScript==
// @name         Groupees Backup
// @namespace    https://greasyfork.org/users/34380
// @version      20220706
// @description  备份 Groupees 数据。
// @match        https://groupees.com/purchases
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446971/Groupees%20Backup.user.js
// @updateURL https://update.greasyfork.org/scripts/446971/Groupees%20Backup.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    var id, page, generator1, generator2, all, text, output;
    var plats = ["Steam", "Itch.io", "Desura"];
    var kws = ["PC", "OS X", "Linux", "Android", "Mp3", "Flac"];
    var user_id = document.querySelector('.fayepub').getAttribute('data-user');

    function getNextPageBundle(mode) {
        fetch('https://groupees.com/users/'+ user_id + '/more_entries?page=' + page + '&kind=bundles').then(res => res.json()).then(res => {
            if (res.length > 0) {
                if (mode == 1) {
                    generator1 = getBundleHTML(res);
                    generator1.next();
                } else {
                    generator2 = revealOrder(res);
                    generator2.next();
                }
            } else {
                if (mode == 1) { toExcel(); } else { output.value += '刮开完成。\n'; }
            }
        });
    }

    function* getBundleHTML(bundles) {
        for (var bundle of bundles) {
            var bun = JSON.parse(bundle);
            if (id) {
                if (id == bun.id) { id = false; }
            } else {
                yield fetch('https://groupees.com/orders/' + bun.id + '?user_id=' + user_id).then(res => res.text()).then(res => {
                    // var html = res.match(/(?<=html = )[\s\S]+(?=;[\s\S]+var groupeesRe)/);
                    var html = res.match(/(?<=html = \$\(')[\s\S]+(?='\);[\s\S]+var groupeesRe)/);
                    var div = document.createElement('DIV');
                    html = html[0].replace(/\\n/g, "").replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\//g, "/");
                    div.innerHTML = html;
                    var [json, note] = getMainData(div);
                    all.push([bun, json, note]);
                    output.value += '已加载包 id ' + bun.id + ' ' + bun.bundle_name + '\n';

                    setTimeout(() => {
                        if (generator1.next().done == true) {
                            page++;
                            getNextPageBundle(1);
                        }
                    }, 3000);
                });
            }
        }
        if (id && bundles.length) { page++; getNextPageBundle(1); }
    }

    function getMainData(div) {
        var jsons = [];
        var items = div.querySelectorAll('.product');
        var note = div.querySelector('.announcements');
        note = note ? note.innerText.replace(/\n/g, ' ') : '';
        for (var item of items) {
            var obj = {};
            obj['name'] = item.querySelector('.product-name').innerText;

            var action = item.querySelector('.product-meta');
            if (action) {
                if (action.querySelector('.icon-givenaway-arrow')) { obj['Steam'] = { "key": "", "status": "Givenaway" }; }
                else { obj['Steam'] = { "key": "", "status": "Reveal this product" }; }
            } else {
                var keys_rows = item.querySelectorAll('.col-sm-6.key');
                for (var row of keys_rows) {
                    var type = row.querySelector('strong').innerText.replace(/^i/, "I");
                    var key = row.querySelector('.form-control.code');
                    // if (!key)  {document.querySelector('.key-meta').innerText;}
                    var value = key.value;
                    var status = key.disabled;
                    if (row.querySelector('.key-meta .green')) { status = row.querySelector('.key-meta .green').innerText; }
                    if (obj[type]) { note += type + ' ' + obj['name'] + ': ' + value + ' ' + status + '. '; }
                    if (!plats.includes(type)) { note += type + ' ' + obj['name'] + ': ' + value + ' ' + status + '. '; }
                    obj[type] = { "key": value, "status": status };
                }

                var link_row = item.querySelectorAll('.dropdown-header');
                for (var row of link_row) {
                    var type = row.innerText;
                    var link = row.nextElementSibling.children[0].href;
                    if (obj[type]) { note += type + ' ' + obj['name'] + ': ' + link + ' . '; }
                    if (!kws.includes(type)) { note += type + ' ' + obj['name'] + ': ' + link + ' . '; }
                    obj[type] = link;
                }
            }
            jsons.push(obj);
        }
        return [jsons, note];
    }

    function toExcel() {
        text = '包名	价格	日期	名字	Steam	状态	Itch	状态	Desura	状态	PC	OS X	Linux	Android	Mp3	Flac\n';
        for (var one of all) {
            var text_bun = one[0].bundle_name + '	' + one[0].total_amount + '	' + one[0].completed_at + '	';
            for (var item of one[1]) {
                var text_item = item.name + '	';
                for (var plat of plats) {
                    if (item[plat]) {
                        text_item += item[plat].key + '	' + item[plat].status + '	';
                    } else {
                        text_item += '	' + '	';
                    }
                }

                for (var kw of kws) {
                    text_item += (item[kw] || '') + '	';
                }
                text += text_bun + text_item + '\n';
            }
            if (one[2] != '') { text += one[2] + '\n'; }
        }
        output.value = text;
    }

    function* revealOrder(bundles) {
        for (var bundle of bundles) {
            var bun = JSON.parse(bundle);
            yield $.ajax({
                url: 'https://groupees.com/orders/' + bun.id + '/reveal_all_products', method: "POST", data: { v: 0 }, dataType: "script"
            }).done(function (res) {
                var html = res.match(/(?<=html = \$\(')[\s\S]+(?='\);[\s\S]+var groupeesRe)/);
                var div = document.createElement('DIV');
                html = html[0].replace(/\\n/g, "").replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\//g, "/");
                div.innerHTML = html;
                revealKey(div);
                output.value += 'Revealed 包 id ' + bun.id + ' ' + bun.bundle_name + '\n';

                setTimeout(() => {
                    if (generator2.next().done == true) {
                        page++;
                        getNextPageBundle(2);
                    }
                }, 5000);
            });
        }
    }

    function revealKey(div) {
        var items = div.querySelectorAll('.product');
        for (var item of items) {
            var name = item.querySelector('.product-name').innerText;
            var keys_rows = item.querySelectorAll('.col-sm-6.key');
            for (var row of keys_rows) {
                ajaxKey(name ,row);
            }
        }
    }

    function ajaxKey(name ,row){
        if (row.querySelector('.unrevealed-group') && row.querySelector('.key-meta .green').innerText == 'Not revealed') {
            var type = row.querySelector('strong').innerText.replace(/^i/, "I");
            var key_id = row.getAttribute('data-id');
            $.ajax({ url: 'https://groupees.com/activation_codes/' + key_id + '/reveal', method: "POST"}).done(function (res) {
                output.value += name + ' ' + type + ' key: ' + res.code + '\n';
            });
        }
    }

    document.querySelector('.pre-nav').insertAdjacentHTML('afterend', `
        <div>
            <input id="bun-id" type="text" placeholder="留空或输入 id 继续上次加载" style="width:200px;">
            <button id="run-script"type="button">运行备份脚本</button>
            <button id="excel-data" type="button">Excel 数据</button>
            <button id="reveal-all" type="button">刮开所有</button>
            <button id="download-links" type="button">下载输入链接</button>
            <textarea id="output-textarea" style="display:block; wide:100%;"></textarea>
            <div id="textarea-links"></div>
            <style>#textarea-links a{display:block;}</style>
        </div>
    `);

    document.querySelector('#run-script').addEventListener('click', () => {
        output = document.querySelector('#output-textarea');
        output.value = '加载中\n';
        page = 1, all = [];
        id = document.querySelector('#bun-id').value;
        id = id == "" ? false : parseInt(id, 10);
        getNextPageBundle(1);
    });

    document.querySelector('#excel-data').addEventListener('click', () => {
        toExcel();
    });

    document.querySelector('#reveal-all').addEventListener('click', () => {
        output = document.querySelector('#output-textarea');
        output.value = '刮开中\n';
        page = 1;
        getNextPageBundle(2);
    });

    document.querySelector('#download-links').addEventListener('click',()=>{
        var value = document.querySelector('#output-textarea').value;
        if (!value.match(/^https:\/\/storage\.groupees\.com/)){
            document.querySelector('#output-textarea').value = '请输入下载链接，一行一条。';
        } else {
            var links = value.split('\n');
            var html = '';
            for (var link of links) {
                if (link.match(/storage\.groupees\.com/)){
                    html += `<a href="${link}">${link}</a>`;
                }
            }
            document.querySelector('#textarea-links').innerHTML = html;
            // $('#textarea-links a').each(function (t, e) { return setTimeout(function () { return e.click() }, 1500 * t); });
        }      
    });
})();