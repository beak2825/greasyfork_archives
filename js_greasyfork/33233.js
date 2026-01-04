// ==UserScript==
// @name         动漫花园(dmhy.org) - 批量复制磁力链接
// @namespace    moe.jixun.dmhy
// @version      1.3.4
// @description  点选所有需要下载的种子然后一键复制。
// @author       Jixun
// @match      http://share.dmhy.org/*
// @match      https://share.dmhy.org/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/33233/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%28dmhyorg%29%20-%20%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/33233/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%28dmhyorg%29%20-%20%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

const APP_NAME = '动漫花园 - 批量复制磁力链接';

function text (str) {
    return document.createTextNode(str);
}

function span (str) {
    let span = document.createElement('span');
    span.appendChild(text(str));
    return span;
}

function h(tag, attr = null, ...child) {
    const el = document.createElement(tag);
    if (attr) {
        Object.assign(el, attr);
    }
    if (child.length > 0) {
        child.forEach(c => {
            if (typeof c === 'string') {
                c = text(c);
            }
            el.appendChild(c);
        });
    }
    return el;
}

function button (name, click, type = '', icon = '') {
    let btn = document.createElement('button');
    btn.classList.add('btn');
    if (type) {
        btn.classList.add('btn-' + type);
    }

    if (icon) {
        let i = document.createElement('i');
        i.className = icon;
        btn.appendChild(i);
        btn.appendChild(text(' '));
        btn.classList.add('btn-icon');
    }
    btn.addEventListener('click', click);
    btn.appendChild(text(name));
    return btn;
}

function toggleClass(el, selector, className, force) {
    if (el instanceof Array || el instanceof NodeList) {
        el.forEach(e => toggleClass(e, selector, className, force));
        return ;
    }

    if (el) {
        if (selector) {
            toggleClass(el.querySelectorAll(selector), null, className, force);
            return ;
        }

        el.classList.toggle(className, force);
    }
}

function main() {
    var topics = document.getElementById('topic_list');
    var style = document.createElement('style');
    style.textContent = `
body {
padding-bottom: 3rem;
}

/* 横幅广告不应太长 */
a > img {
  max-width: 80vw;
}

.moe-jixun-container
{
user-select: none;
position: fixed;
left: 0;
bottom: 0;
width: 100%;
padding: .5rem;
margin-bottom: 0;
}

.moe-jixun-container > .filter {
display: inline-block;
margin-left: 1rem;
}

.moe-jixun-container .btn + .btn,
.moe-jixun-container > span
{
margin-left: .3rem;
}

.moe-jixun-container > span
{
background: #efe;
padding: 2px 1em;
font-weight: bold;
}

.btn {
background: white;
border: 1px solid black;
padding: .3rem 1rem;
border-radius: 5px;
box-shadow: 2px 2px 5px #f3f3f3;
}

.selected td,
.selected th,
table.selected.tablesorter tbody tr.even td,
table.selected.tablesorter tbody tr.odd td
{
background: lightgreen !important;
}

.filter-rules > span:hover {
background: green;
cursor: pointer;
color: white;
}
.filter-rules > span {
padding: 0 .2rem;
transition: .3s;
}
`;
    if (topics) {
        console.info('[%s]: 找到列表，开始绑定事件...', APP_NAME);
        topics.addEventListener('click', function (e) {
            let p = e.target;

            while (p) {
                if (p.tagName === 'A') {
                    // ignore
                    return ;
                } else if (p.tagName === 'TR') {
                    e.preventDefault();
                    e.stopPropagation();

                    toggleClass(p, null, 'selected');
                    return;
                }

                p = p.parentNode;
            }
        });

        let btnContainer = document.createElement('div');
        btnContainer.className = 'moe-jixun-container table';
        btnContainer.appendChild(button('拷贝所选磁力', function (e) {
            let anchors = topics.querySelectorAll('.selected a.arrow-magnet');
            let urls = Array.prototype.map.call(anchors, anchor => anchor.href);

            let dummy = document.createElement('textarea');
            dummy.value = urls.join('\n');
            document.body.appendChild(dummy);
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);

            let notice = span(`已复制 (${urls.length} 条链接)!`);
            btnContainer.appendChild(notice);
            setTimeout(function () {
                btnContainer.removeChild(notice);
            }, 1500);
        }, 'copy'));

        btnContainer.appendChild(button('选深色', function (e) {
            toggleClass(topics, 'tr.even', 'selected');
        }, 'select'));
        btnContainer.appendChild(button('选浅色', function (e) {
            toggleClass(topics, 'tr.odd', 'selected');
        }, 'select'));
        btnContainer.appendChild(button('全选', function (e) {
            toggleClass(topics, 'tr', 'selected', true);
        }, 'select'));
        btnContainer.appendChild(button('全不', function (e) {
            toggleClass(topics, 'tr', 'selected', false);
        }, 'select'));

        const inputCopyFilter = h('input', {
            className: 'copy-filter',
            onkeyup: (e) => {
                if (e.keyCode === 13) {
                    filterHandler();
                }
            }
        });
        btnContainer.appendChild(
            h('div', { className: 'filter' },
                span('条件:'),
                inputCopyFilter,
                h('span', {
                    className: 'filter-rules',
                    onclick: (e) => {
                        if (inputCopyFilter.value) {
                            inputCopyFilter.value += ';';
                        }
                        inputCopyFilter.value += '(' + e.target.textContent + ')';
                    }
                },
                    span('GBK|CHS|简'), // 简体/多语
                    span('BIG5|CHT|繁'), // 繁体/多语
                    // span('外[掛挂]'), // 外挂字幕
                    span('720p'),
                    span('1080p'),
                ),
                button('条件选择', filterHandler, 'select'),
                button('×', () => {
                    inputCopyFilter.value = '';
                }, 'clear')
            )
        );

        function filterHandler() {
            if (inputCopyFilter.value === '') {
                alert('过滤条件为空');
                return;
            }

            // 编译正则表达式
            let regexList;
            try {
                regexList = inputCopyFilter.value.split(';').map(r => new RegExp(r, 'i'));
            } catch (error) {
                alert('过滤器表达式错误! 请查看 console 获取详细信息。');
                throw error;
            }

            // 全部取消
            // toggleClass(topics, 'tr', 'selected', false);

            // 根据每一项来检查是否匹配
            [].forEach.call(topics.querySelectorAll('tr'), (tr) => {
                const title = tr.querySelector('.title > .tag+a, .title > a');
                const select = title && regexList.reduce((result, regex) => result && regex.test(title.textContent), true);
                tr.classList.toggle('selected', select || false);
            });
        }

        document.body.appendChild(btnContainer);
        document.body.appendChild(style);
        console.info('[%s]: 就绪。', APP_NAME);
    } else {
        console.info('[%s]: 未找到下载列表，如果误报请联系作者修正。', APP_NAME);
    }
}

if (document.readyState === 'complete') {
	setTimeout(main, 0);
} else {
	addEventListener('DOMContentLoaded', main);
}
