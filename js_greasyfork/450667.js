// ==UserScript==
// @name         i问财数据导出
// @namespace    _s7util__
// @version      0.6
// @description  为 i问财 网站添加数据导出功能
// @author       shc0743
// @match        *://www.iwencai.com/unifiedwap/*
// @icon         https://iwencai.com/favicon.ico
// @grant        none
// @license      GPL-3.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/450667/i%E9%97%AE%E8%B4%A2%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/450667/i%E9%97%AE%E8%B4%A2%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here....
    let btn = document.createElement('button');
    btn.style.display = 'inline-block';
    btn.style.margin = '0 10px 0 0';
    btn.style.padding = '0 5px';
    btn.style.cursor = 'pointer';
    btn.innerHTML = '导出';

    function run_obs(observer) {
        observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    let observer = null;
    window.addEventListener('DOMContentLoaded', function () {
        observer = new MutationObserver(function (r, s) {
            //console.log(r);
            for (let i of r) {
                try {
                    let raw_exp_btn = i.target.parentElement.querySelector('.por.table-export');
                    if (!raw_exp_btn) return;

                    s.disconnect();

                    raw_exp_btn.style.display = 'none';
                    raw_exp_btn.parentElement.querySelector('.base-new-icon')?.remove();
                    raw_exp_btn.before(btn);

                    setTimeout(run_obs, 100, s);
                }
                catch (error) {}
            }
        });
        run_obs(observer);
    }, { once: true });

    btn.onclick = function () {
        this.disabled = true;
        this.style.cursor = 'not-allowed';
        this.innerHTML = '请稍候...';

        let p = new Promise(function (a, b) {
            let r = new String;

            let wrapper = document.querySelector('.iwc-table-wrapper');
            if (!wrapper) return b('未找到wrapper');
            let cont = wrapper.querySelector('.iwc-table-content');
            let pager = wrapper.querySelector('.pcwencai-pagination');
            if (!cont || !pager) return b('未找到数据');
            let hd = [], bd = [];
            let gcode_index = -1;

            let head = cont.querySelectorAll('.iwc-table-fixed .iwc-table-header ul li div');
            let head2 = cont.querySelectorAll('.iwc-table-scroll .iwc-table-header ul li');
            let body = cont.querySelectorAll('.iwc-table-scroll .iwc-table-body table tr');

            let rnl = function (str) {
                return str.replaceAll(/[\r\n]/ig, '');
            };

            for (let i of head) {
                hd.push(rnl(`"${i.innerText}"`));
            }
            for (let i of head2) {
                let s;
                if (s = i.querySelector('.thead-sub-box')) {
                    let h = i.querySelector('span.thead-span')?.innerText;
                    s.querySelectorAll('i.sub-thead div').forEach(e => hd.push(rnl(`"${h} ${e.innerText}"`)));
                }
                else if (s = i.querySelector('div')) {
                    hd.push(rnl(`"${s.innerText}"`));
                }
            }

            let bdec = function () {
                body = cont.querySelectorAll('.iwc-table-scroll .iwc-table-body table tr');
                for (let i of body) {
                    let arr = [];
                    i.querySelectorAll('td div').forEach(el => {
                        arr.push(rnl('"' + el.innerText + '"'));
                    });
                    arr.join(',');
                    bd.push(arr);
                }
            };
            let pagers = pager.querySelectorAll("li");
            let currentpage = 1, lastpage = 0, maxpage = (()=>{
                let n = pagers[pagers.length-2]?.querySelector('a')?.innerText;
                if (!n) return 1;
                let i = parseInt(n);
                return isNaN(i) ? 1 : i;
            })();
            if (maxpage === 1) {
                bdec();
                nextStep(a, b);
            } else {
                observer.disconnect();
                pagers[1]?.querySelector('a')?.click();
                let inv = setInterval(function (a, b) {
                    let load_e = wrapper.parentElement.querySelector('.table-loading');
                    if (load_e != null && load_e.style.display !== 'none') return;
                    currentpage = parseInt(pager.querySelector('.page-item.active')?.innerText || '1');
                    isNaN(currentpage) ? currentpage = 1 : void(0);
                    if (currentpage === maxpage) {
                        clearInterval(inv);
                        bdec();
                        let t = document.createElement('button');
                        t.innerHTML = '点击继续';
                        t.style.position = 'fixed';
                        t.style.left = t.style.top = 0;
                        t.style.width = t.style.height = '100%';
                        t.style.zIndex = 1000000;
                        t.style.fontSize = '2rem';
                        t.onclick = function () {
                            this.remove();
                            return new Promise(()=>nextStep(a, b));
                        }
                        document.body.append(t);
                        return ;
                    }
                    if (currentpage > lastpage && currentpage - lastpage === 1) {
                        bdec();
                        lastpage = currentpage;
                        pagers[pagers.length-1]?.querySelector('a')?.click();
                    }
                }, 500, a, b);
            }

            function nextStep (a, b) {
                console.log('Export data:', hd, bd);
                run_obs(observer);

                //r += hd.join(',');
                //r += '\r\n';
                //r += bd.join('\r\n');

                let blob = new Blob(['\uFEFF',
                                     hd.join(','),
                                     '\r\n',
                                     bd.join('\r\n'),
                                    ], { type: 'text/plain' }); // BOM
                if (typeof window.showSaveFilePicker !== 'undefined') {
                    (async function (a, b) {
                        try{
                            // create a new handle
                            const newHandle = await window.showSaveFilePicker({
                                types: [{
                                    description: 'CSV',
                                    suggestedName: String(new(Date)),
                                    accept: {'text/csv': ['.csv']},
                                },{
                                    description: '文本文件',
                                    suggestedName: String(new(Date)),
                                    accept: {'text/plain': ['.txt']},
                                }],
                            });

                            // create a FileSystemWritableFileStream to write to
                            const writableStream = await newHandle.createWritable();

                            // write our file
                            await writableStream.write(blob);

                            // close the file and write the contents to disk.
                            await writableStream.close();

                            a('导出成功');
                        }
                        catch (error) { b (error); }
                    })(a, b);
                } else { // download
                    let url = URL.createObjectURL(blob);
                    let A = document.createElement('a');
                    A.href = url;
                    A.download = String(new(Date)) + '.csv';
                    document.body.append(A);
                    A.click();
                    A.remove();
                    //URL.revokeObjectURL(blob);
                    a('导出成功,请按 Ctrl+J 查看');
                }

            }
        });
        p.then(function (t) {
            btn.innerHTML = t;
            setTimeout(e => {
                e.innerHTML = '导出';
                e.disabled = false;
                e.style.cursor = 'pointer';
            }, 3000, btn);
        })
        .catch(function (e) {
            console.error('iwencai export data failed:', e);
            btn.innerHTML = '导出失败,原因: ' + e + ', 请稍后再试';
            setTimeout(e => {
                e.innerHTML = '导出';
                e.disabled = false;
                e.style.cursor = 'pointer';
            }, 2000, btn);
        });
    }

})();