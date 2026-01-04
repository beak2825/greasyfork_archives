// ==UserScript==
// @name         Keylol Chinaplay 2Game Table
// @namespace    https://greasyfork.org/users/34380
// @version      20240918
// @description  在购买心得 Chinaplay 和 2Game 板块的帖子一楼开始位置添加折扣表格，折后价和史低可排序。
// @supportURL   https://keylol.com/t920709-1-1
// @match        https://keylol.com/t*
// @match        https://keylol.com/forum.php?mod=viewthread&tid=*
// @connect      gitee.com
// @connect      raw.githubusercontent.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/369686/Keylol%20Chinaplay%202Game%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/369686/Keylol%20Chinaplay%202Game%20Table.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (document.querySelector('.subforum_left_title_left_up').innerText.match(/Chinaplay/)) {
        document.querySelector('head').insertAdjacentHTML('beforeend', `<style> .td-wide-80 { width:80px; } .td-wide-50 { width:50px; } .hidden1,.hidden2,.hidden3,.hidden4 { display:none; }</style>`);

        const html_table = `<br><div class="sff_collapse"><div class="sff_collapse_b" onclick="var s = this.parentNode; while (!s.classList.contains('sff_collapse')) {s = s.parentNode;} if (s.classList.contains('sff_collapsed')) {s.classList.remove('sff_collapsed');} else {s.classList.add('sff_collapsed');}"><span class="sff_collapse_t">&gt;</span> 折扣表格</div><div class="sff_collapse_d">
            <span id="checkbox-rows"><label><input id="cb-tr-higher" type="checkbox" value="tr-higher"></input>高于史低</label><label><input id="cb-tr-old" type="checkbox" value="tr-old"></input>高于史低CP</label><label><input id="cb-tr-not-wish" type="checkbox" value="tr-not-wish"></input>非愿望单</label><label><input id="cb-tr-own" type="checkbox" value="tr-own"></input>已拥有</label></span>
            <table id="table-chinaplay" class="t_table"><thead><tr><td data-col="index" data-reverse="1">游戏名</td><td class="td-wide-80" data-col="coupon" data-reverse="-1">折后价</td><td class="td-wide-80" data-col="hist-cp" data-reverse="-1">史低CP</td><td class="td-wide-80" data-col="hist" data-reverse="-1">史低</td><td>区域</td><td class="td-wide-50">截止</td><td>折扣码</td><td class="td-wide-50">加购</td></tr></thead><tbody></tbody></table>
            <div><a href="javascript:;" onclick="var s = this.parentNode; while (!s.classList.contains('sff_collapse')) {s = s.parentNode;} s.scrollIntoView(true); if (s.classList.contains('sff_collapsed')) {s.classList.remove('sff_collapsed');} else {s.classList.add('sff_collapsed');}">点击隐藏</a></div></div></div>`;

        const floor1 = document.querySelector('.t_f');
        const anchor = floor1.querySelector('.t_f .pstatus') || floor1.querySelector('.original_text_style1');
        if (anchor) {
            anchor.insertAdjacentHTML('afterend', '' + html_table);
        } else {
            floor1.insertAdjacentHTML('afterbegin', html_table);
        }
        const cb_rows = floor1.querySelector('#checkbox-rows');
        cb_rows.querySelectorAll('input').forEach((cb) => {
            cb.checked = true;
        });

        const tbody = floor1.querySelector('#table-chinaplay > tbody');

        // table col > name discount hist region expire code cart steam
        let name;
        let discount = 0;
        let hist = 0;
        let region;
        let expire;
        let code = '';
        let steam;
        let is_code4down

        let trs = [];
        let i_start = 0;
        let i_end = 0;
        let is_hist_fill = true;
        const vnode = document.createElement('div');
        vnode.innerHTML = floor1.innerHTML.replace(/<\/?span[^>]*>/g, '').replace(/<\/?strong[^>]*>/g, '');
        const nodes = vnode.childNodes;
        nodes.forEach((node) => {
            readNode(node);
        });
        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://gitee.com/mouse040429/keylol-chinaplay-table/raw/main/datacp.json',
            timeout: 9100,
            onload: (res) => {
				try {
                	const data = JSON.parse(res.responseText);
                	newTable(data);
				} catch (e) {
					console.log('可能是 Gitee 屏蔽关键字导致出错，正在连接 Github。');
					GM_xmlhttpRequest({
						method: "GET",
						url: 'https://raw.githubusercontent.com/mouse040429/Keylol-Chinaplay-Table/refs/heads/main/datacp.json',
						timeout: 9100,
						onload: (res) => {
							const data = JSON.parse(res.responseText);
							console.log('成功连接到 Github。');
							newTable(data);
						}
					});
				}
            }
        });

        setTimeout(() => {
            tbody.querySelectorAll('tr > td:nth-child(1) > a').forEach((node) => {
                if (!node.classList.contains('steam-info-wish')) {
                    if (node.classList.contains('steam-info-own')) {
                        node.parentNode.parentNode.classList.add('tr-own', 'tr-not-wish');
                    } else {
                        node.parentNode.parentNode.classList.add('tr-not-wish');
                    }
                }
            });
        }, 5000);

        function newTable(data) {
            let html = '';
            trs.forEach((tds, i) => {
                // tds [name, parseFloat(discount), parseFloat(hist), region, expire, code, cart, steam];
                const is_lower = tds[1] <= tds[2];
                const cur = data[tds[6]];
                let td_hist;
                let is_newlow = false;
                if (cur) {
                    const _low = cur.low;
                    is_newlow = tds[1] <= _low[0];
                    let tit = padEnsp(_low[0]) + _low[1] + '&#13;';
                    cur.hist.forEach((item) => {
                        tit = tit + '&#13;' + padEnsp(item[0]) + item[1];
                    });
                    td_hist = `<td data-hist-cp="${_low[0]}" title="${tit}">${is_newlow ? '<span style="background-color:LightBlue">' + _low[0] + '</span>' : _low[0]}</td>`;
                } else {
                    td_hist = `<td data-hist-cp="0">0</td>`;
                }
                html = html + `<tr class="${is_lower ? '' : 'tr-higher '}${is_newlow ? '' : 'tr-old'}"><td data-index="${i}"><a href="https://store.steampowered.com/${tds[7]}/" target="_blank">${tds[0]}</a></td><td data-coupon="${tds[1]}">${is_lower ? '<span style="background-color:Wheat">' + tds[1] + '</span>' : tds[1]}</td>${td_hist}<td data-hist="${tds[2]}">${tds[2]}</td><td>${tds[3]}</td><td>${tds[4]}</td><td>${tds[5]}</td><td><a href="https://chinaplay.store/detail/${tds[6]}/" target="_blank">加购</a></td></tr>`;
            });
            tbody.innerHTML = html;

            function padEnsp(para) {

                for (let i = para.toString().length; i < 8; i++) {
                    para += '&ensp;';
                }
                return para;
            }
        }

        function readNode(node) {
            if (node.nodeName == 'H1') {
                expire = '';
                region = '-';
                const matched1 = node.innerText.match(/((\d+\.\d+)?)(.*)（(.*)）/);
                if (matched1) {
                    expire = matched1[1];
                    region = matched1[4];
                    i_end = trs.length;
                    for (; i_start < i_end; i_start++) {
                        trs[i_start][5] = code;
                    }
                    const matched2 = matched1[3].match(/.*《(.*)》/);
                    if (matched2) {
                        name = matched2[1];
                    }
                    if (!is_hist_fill) {
                        trs[i_end - 1][2] = hist;
                    }
                }
            } else if (node.nodeName == 'A') {
                if (node.href.match(/https:\/\/store\.steampowered\.com\/(app|sub|bundle)\/\d+\//)) {
                    name = node.innerText;
                    steam = node.href.match(/https:\/\/store\.steampowered\.com\/((app|sub|bundle)\/\d+)\//)[1];
                } else if (node.href.match(/https:\/\/chinaplay\.store\/detail\/[\w-]+\/?/)) {
                    const cart = node.href.match(/https:\/\/chinaplay\.store\/detail\/([\w-]+)\/?/)[1];
                    if (!name) { name = cart.replace(/-/g, ' ').replace('   ', ' - '); }
                    trs.push([name, parseFloat(discount), parseFloat(hist), region, expire, code, cart, steam]);
                    if (is_code4down) { i_start++; }
                    name = null;
                    hist = 0;
                    is_hist_fill = true;
                }
            } else if (node.nodeName == '#text') {
                const content = node.textContent;
                if (content.match(/史低：?(\d+(\.\d+)?)/)) {
                    hist = content.match(/史低：?(\d+(\.\d+)?)/)[1];
                    is_hist_fill = false;
                } else if (content.match(/(\d+(\.\d+)?)元/)) {
                    discount = content.match(/(\d+(\.\d+)?)元/)[1];
                } else if (content.match(/适用折扣码：/)) {
                    code = content.match(/折扣码：(\S+)/)[1];
                    is_code4down = true;
                } else if (content.match(/对应折扣码：/)) {
                    code = content.match(/折扣码：(\S+)/)[1];
                }
            }
        }

        cb_rows.addEventListener('click', (event) => {
            if (event.target.nodeName == 'INPUT') {
                const hidden = {
                    'tr-higher': 'hidden1',
                    'tr-old': 'hidden2',
                    'tr-not-wish': 'hidden3',
                    'tr-own': 'hidden4'
                }
                const value = event.target.value;
                tbody.querySelectorAll('.' + value).forEach((node) => { node.classList.toggle(hidden[value]); });
            }
        });

        floor1.querySelector('#table-chinaplay > thead > tr').addEventListener('click', function (event) {
            const target = event.target;
            if (target.nodeName == 'TD' && target.hasAttribute('data-reverse')) {
                const col = target.getAttribute('data-col');
                let reverse = target.getAttribute('data-reverse');
                let sorted;
                if (reverse == 0) {
                    sorted = Array.from(tbody.querySelectorAll('tr')).sort((a, b) => {
                        return b.querySelector('td[data-' + col + ']').getAttribute('data-' + col) - a.querySelector('td[data-' + col + ']').getAttribute('data-' + col);
                    });
                    const siblings = this.querySelectorAll('[data-reverse="1"]');
                    target.setAttribute('data-reverse', '1');
                    siblings.forEach((node) => { node.setAttribute('data-reverse', '0'); });
                } else {
                    sorted = Array.from(tbody.querySelectorAll('tr')).sort((a, b) => { return a.querySelector('td[data-' + col + ']').getAttribute('data-' + col) - b.querySelector('td[data-' + col + ']').getAttribute('data-' + col); });
                    const siblings = this.querySelectorAll('[data-reverse="0"]');
                    target.setAttribute('data-reverse', '0');
                    siblings.forEach((node) => { node.setAttribute('data-reverse', '1'); });
                }
                sorted.forEach((node) => {
                    tbody.insertAdjacentElement('beforeend', node);
                });
            }
        });

    } else if (document.querySelector('.subforum_left_title_left_up').innerText.match(/2Game/)) {
        document.querySelector('head').insertAdjacentHTML('beforeend', `<style> .td-wide-80 { width:80px; } .td-wide-50 { width:50px; } .hidden1,.hidden2,.hidden3,.hidden4 { display:none; }</style>`);

        const html_table = `<br><div class="sff_collapse"><div class="sff_collapse_b" onclick="var s = this.parentNode; while (!s.classList.contains('sff_collapse')) {s = s.parentNode;} if (s.classList.contains('sff_collapsed')) {s.classList.remove('sff_collapsed');} else {s.classList.add('sff_collapsed');}"><span class="sff_collapse_t">&gt;</span> 折扣表格</div><div class="sff_collapse_d">
            <span id="checkbox-rows"><label><input id="cb-tr-old" type="checkbox" value="tr-old"></input>高于史低2G</label><label><input id="cb-tr-not-wish" type="checkbox" value="tr-not-wish"></input>非愿望单</label><label><input id="cb-tr-own" type="checkbox" value="tr-own"></input>已拥有</label></span>
            <table id="table-chinaplay" class="t_table" style="width:80%"><thead><tr><td data-col="index" data-reverse="1">游戏名</td><td class="td-wide-80" data-col="coupon" data-reverse="-1">折后价</td><td class="td-wide-80" data-col="hist-cp" data-reverse="-1">史低2G</td><td class="td-wide-50">加购</td></tr></thead><tbody></tbody></table>
            <div><a href="javascript:;" onclick="var s = this.parentNode; while (!s.classList.contains('sff_collapse')) {s = s.parentNode;} s.scrollIntoView(true); if (s.classList.contains('sff_collapsed')) {s.classList.remove('sff_collapsed');} else {s.classList.add('sff_collapsed');}">点击隐藏</a></div></div></div>`;

        const floor1 = document.querySelector('.t_f');
        const anchor = floor1.querySelector('.t_f .pstatus') || floor1.querySelector('.original_text_style1');
        if (anchor) {
            anchor.insertAdjacentHTML('afterend', '' + html_table);
        } else {
            floor1.insertAdjacentHTML('afterbegin', html_table);
        }
        const cb_rows = floor1.querySelector('#checkbox-rows');
        cb_rows.querySelectorAll('input').forEach((cb) => {
            cb.checked = true;
        });

        const tbody = floor1.querySelector('#table-chinaplay > tbody');

        // table col > name discount hist region expire code cart steam
        let name;
        let version;
        let discount = 0;
        let hist = 0;
        let region;
        let expire;
        let code = '';
        let steam;

        let trs = [];
        let i_start = 0;
        let i_end = 0;
        let is_hist_fill = true;
        const vnode = document.createElement('div');
        vnode.innerHTML = floor1.innerHTML.replace(/<\/?span[^>]*>/g, '').replace(/<\/?strong[^>]*>/g, '');
        const nodes = vnode.childNodes;
        nodes.forEach((node) => {
            readNode(node);
        });
        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://gitee.com/mouse040429/keylol-chinaplay-table/raw/main/data2g.json',
            timeout: 9100,
            onload: (res) => {
				try {
                	const data = JSON.parse(res.responseText);
                	newTable(data);
				} catch (e) {
					console.log('可能是 Gitee 屏蔽关键字导致出错，正在连接 Github。');
					GM_xmlhttpRequest({
						method: "GET",
						url: 'https://raw.githubusercontent.com/mouse040429/Keylol-Chinaplay-Table/refs/heads/main/data2g.json',
						timeout: 9100,
						onload: (res) => {
							const data = JSON.parse(res.responseText);
							console.log('成功连接到 Github。');
							newTable(data);
						}
					});
				}
            }
        });

        setTimeout(() => {
            tbody.querySelectorAll('tr > td:nth-child(1) > a').forEach((node) => {
                if (!node.classList.contains('steam-info-wish')) {
                    if (node.classList.contains('steam-info-own')) {
                        node.parentNode.parentNode.classList.add('tr-own', 'tr-not-wish');
                    } else {
                        node.parentNode.parentNode.classList.add('tr-not-wish');
                    }
                }
            });
        }, 5000);

        function newTable(data) {
            let html = '';
            trs.forEach((tds, i) => {
                // tds [name, parseFloat(discount), parseFloat(hist), region, expire, code, cart, steam];
                const cur = data[tds[2]];
                let td_hist;
                let is_newlow = false;
                if (cur) {
                    const _low = cur.low;
                    is_newlow = tds[1] <= _low[0];
                    let tit = _low[0] + '   ' + _low[1] + '&#13;';
                    cur.hist.forEach((item) => {
                        tit = tit + '&#13;' + item[0] + '   ' + item[1];
                    });
                    td_hist = `<td data-hist-2g="${_low[0]}" title="${tit}">${is_newlow ? '<span style="background-color:LightBlue">' + _low[0] + '</span>' : _low[0]}</td>`;
                } else {
                    td_hist = `<td data-hist-2g="0">0</td>`;
                }
                html = html + `<tr class="${is_newlow ? '' : 'tr-old'}"><td data-index="${i}"><a href="https://store.steampowered.com/${tds[3]}/" target="_blank">${tds[0]}</a></td><td data-coupon="${tds[1]}">${tds[1]}</td>${td_hist}<td><a href="https://chinaplay.store/detail/${tds[2]}/" target="_blank">加购</a></td></tr>`;
            });
            tbody.innerHTML = html;
        }

        function readNode(node) {
            if (node.nodeName == 'A') {
					console.log('a');
                if (node.href.match(/https?:\/\/store\.steampowered\.com\/(app|sub|bundle)\/\d+\//)) {
                    name = node.innerText;
                    steam = node.href.match(/https?:\/\/store\.steampowered\.com\/((app|sub|bundle)\/\d+)\//)[1];
                } else if (node.href.match(/https:\/\/2game\.hk\/cn\/[\w-]+\/?/)) {
                    const cart = node.href.match(/https:\/\/2game\.hk\/cn\/([\w-]+)/)[1];
                    trs.push([name + version, parseFloat(discount), cart, steam]);
                    hist = 0;
                    is_hist_fill = true;
                }
            } else if (node.nodeName == '#text') {
                const content = node.textContent;
                if (content.match(/价格：\d+(\.\d+)?/)) {
                    version = content.match(/(.*)叠加折扣码价格：/)[1];
                    discount = content.match(/价格：(\d+(\.\d+)?)/)[1];
                }

            } else if (node.nodeName == 'DIV') {
				node.childNodes.forEach((_node) => {
					readNode(_node);
				});
            }
        }

        cb_rows.addEventListener('click', (event) => {
            if (event.target.nodeName == 'INPUT') {
                const hidden = {
                    'tr-higher': 'hidden1',
                    'tr-old': 'hidden2',
                    'tr-not-wish': 'hidden3',
                    'tr-own': 'hidden4'
                }
                const value = event.target.value;
                tbody.querySelectorAll('.' + value).forEach((node) => { node.classList.toggle(hidden[value]); });
            }
        });

        floor1.querySelector('#table-chinaplay > thead > tr').addEventListener('click', function (event) {
            const target = event.target;
            if (target.nodeName == 'TD' && target.hasAttribute('data-reverse')) {
                const col = target.getAttribute('data-col');
                let reverse = target.getAttribute('data-reverse');
                let sorted;
                if (reverse == 0) {
                    sorted = Array.from(tbody.querySelectorAll('tr')).sort((a, b) => {
                        return b.querySelector('td[data-' + col + ']').getAttribute('data-' + col) - a.querySelector('td[data-' + col + ']').getAttribute('data-' + col);
                    });
                    const siblings = this.querySelectorAll('[data-reverse="1"]');
                    target.setAttribute('data-reverse', '1');
                    siblings.forEach((node) => { node.setAttribute('data-reverse', '0'); });
                } else {
                    sorted = Array.from(tbody.querySelectorAll('tr')).sort((a, b) => { return a.querySelector('td[data-' + col + ']').getAttribute('data-' + col) - b.querySelector('td[data-' + col + ']').getAttribute('data-' + col); });
                    const siblings = this.querySelectorAll('[data-reverse="0"]');
                    target.setAttribute('data-reverse', '0');
                    siblings.forEach((node) => { node.setAttribute('data-reverse', '1'); });
                }
                sorted.forEach((node) => {
                    tbody.insertAdjacentElement('beforeend', node);
                });
            }
        });
    }
})();