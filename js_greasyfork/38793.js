// ==UserScript==
// @name         网易云音乐列表导出
// @namespace    undefined
// @version      0.0.4
// @description  导出当前页网易云音乐列表为文本
// @author       allen smith
// @match        *://music.163.com/*
// @require      https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.js
// @require      https://cdn.bootcdn.net/ajax/libs/Sortable/1.15.0/Sortable.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38793/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%88%97%E8%A1%A8%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/38793/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%88%97%E8%A1%A8%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检测页面
    let htm = document.getElementsByClassName('f-oh');
    if(htm.length === 0){
        return;
    }

    // 创建dom节点
    function createDocument(txt) {
        const template = `<div class='childdom'>${txt}</div>`;
        let doc = new DOMParser().parseFromString(template, 'text/html');
        let div = doc.querySelector('.childdom');
        return div;
    }

    // 检测文档变动
    let doc = document.getElementById('g_mymusic');
    let _body = document.body;
    let clipboard, btn, spli, interId, waitTimeoutId, wait ;
    let ckdiv;
    let check1, check2, check3, check4, check5;
    let sortdiv;
    doc.addEventListener('DOMSubtreeModified', function () {

        //查找列表动画
        wait = document.getElementById('wait-animation');
        if(wait) _body.removeChild(wait);
        wait = document.createElement("span");
        wait.id = 'wait-animation';
        wait.setAttribute('style', 'display:inline-block;position:absolute;right:50px;top:100px;padding:3px 5px;border:1px solid lightgray;background-color:white;color:black;border-radius:5px;font-size:14px;');
        _body.appendChild(wait);
        wait.innerHTML = '导出：没有合适的列表';

        //检测列表
        let list = document.getElementsByClassName('m-table')[0];
        if (!list) {
            btn = document.getElementById('export-btn');
            spli = document.getElementById('export-spli');
            if(btn) _body.removeChild(btn);
            if(spli) _body.removeChild(spli);
            return;
        }
        _body.removeChild(wait);

        //创建按钮
        btn = null;
        spli = null;
        btn = document.getElementById('export-btn');
        spli = document.getElementById('export-spli');
        if (!spli) {
            spli = document.createElement("input");
            spli.id = 'export-spli';
            spli.className = 'export-spli';
            spli.setAttribute('placeholder','自定义分隔符（默认 -- ）');
            spli.setAttribute('style', 'display:inline-block;position:absolute;right:50px;top:100px;padding:3px 5px;border:1px solid lightgray;background-color:white;color:black;border-radius:5px;font-size:14px;');
            _body.appendChild(spli);
        }
        if (!btn) {
            btn = document.createElement("button");
            btn.id = 'export-btn';
            btn.className = 'export-btn';
            btn.innerText = '导出列表';
            btn.setAttribute('style', 'display:inline-block;position:absolute;right:50px;top:229px;padding:3px 5px;border:1px solid lightgray;background-color:white;color:black;border-radius:5px;font-size:14px;');
            _body.appendChild(btn);
        }
        // 选择列
        if(!ckdiv){
            ckdiv = document.createElement("div");
            ckdiv.id = 'ckdiv';
            ckdiv.className = 'export-ck';
            ckdiv.setAttribute('style', 'display:inline-block;position:absolute;right:50px;top:128px;padding:3px 5px;border:1px solid lightgray;background-color:white;color:black;border-radius:5px;font-size:14px;');
            _body.appendChild(ckdiv);
        }
        // 排序
        if(!sortdiv){
            // sortdiv = document.createElement("div");
            // sortdiv.id = 'sortdiv';
            // sortdiv.className = 'sortdiv';
            // sortdiv.setAttribute('style', 'display:inline-block;position:absolute;right:50px;top:156px;padding:3px 5px;border:1px solid lightgray;background-color:white;color:black;border-radius:5px;font-size:14px;');

            let divstr = `<div id="sortdivbox" style="display:inline-block;position:absolute;right:50px;top:159px;padding:3px 5px;border:1px solid lightgray;background-color:white;color:black;border-radius:5px;font-size:14px;"><div>拖动以排序</div><div id="sortdiv" style="margin:10px 0px;cursor:pointer;"><span style="margin:0 4px;padding:4px 8px;border-radius:3px;border:1px solid lightgray">歌名</span><span style="margin:0 4px;padding:4px 8px;border-radius:3px;border:1px solid lightgray">歌手</span><span style="margin:0 4px;padding:4px 8px;border-radius:3px;border:1px solid lightgray">专辑</span><span style="margin:0 4px;padding:4px 8px;border-radius:3px;border:1px solid lightgray">时长</span><span style="margin:0 4px;padding:4px 8px;border-radius:3px;border:1px solid lightgray">链接</span></div></div>`
             _body.appendChild(createDocument(divstr));
            sortdiv = new Sortable(document.querySelector('#sortdiv'))
        }

        let ckbuilder = function(id, label, uncheck, readonly){
            let tmpid = 'ck_' + id;
            let ckbox = document.createElement("input");
            ckbox.id = tmpid
            ckbox.setAttribute('type', 'checkbox');
            ckbox.setAttribute('style', 'vertical-align: middle;margin-top: -2px;');
            if(!uncheck) ckbox.checked = true;
            if(!!readonly) ckbox.setAttribute("disabled", "disabled");
            ckdiv.appendChild(ckbox);

            let ckspn = document.createElement("label");
            ckspn.setAttribute('for', tmpid);
            ckspn.innerHTML = ' ' + label;
            ckdiv.appendChild(ckspn);
            return ckbox;
        }
        if(!check1){
            check1 = ckbuilder("ck01","歌名 ", false, true);
        }
        if(!check2){
            check2 = ckbuilder("ck02","歌手 ");
        }
        if(!check3){
            check3 = ckbuilder("ck03","专辑 ", true);
        }
        if(!check4){
            check4 = ckbuilder("ck04","时长 ", true);
        }
        if(!check5){
            check5 = ckbuilder("ck05","链接", true);
        }


        //创建剪贴板
        if (clipboard) clipboard.destroy();
        clipboard = new Clipboard('.export-btn', {
            text: function (trigger) {

                //导出列表
                btn.innerText = '正在导出 ...';
                let result = '';
                let listBody = list.getElementsByTagName('tbody')[0];
                let rows = listBody.getElementsByTagName('tr');
                for (let i = 0; i < rows.length; i++) {
                    let ele = rows[i];
                    let cells = ele.getElementsByTagName('td');
                    let name = cells[1].getElementsByTagName('b')[0].getAttribute('title').replace(/<div class="soil">[\s\S\n]*?<\/div>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
                    let link = `https://music.163.com/#${cells[1].getElementsByTagName('a')[0].getAttribute('href')}`
                    let time = cells[2].querySelector('.u-dur').innerText;
                    let artist = cells[3].getElementsByTagName('span')[0].getAttribute('title').replace(/<div class="soil">[\s\S\n]*?<\/div>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
                    let album = cells[4].getElementsByTagName('a')[0].getAttribute('title').replace(/<div class="soil">[\s\S\n]*?<\/div>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

                    let spliChar = spli.value;
                    if(!spliChar) spliChar = ' -- ';


                    let isFirst = true;
                    document.querySelectorAll('#sortdiv span').forEach(item=>{
                        let type = item.innerText;
                        let tempSplit;
                        if(isFirst){
                            tempSplit = ()=> {isFirst = false; return "";}
                        }else {
                            tempSplit = ()=> spliChar;
                        }
                        switch(type){
                            case "歌名":
                                result += tempSplit() + name;
                                break;
                            case "歌手":
                                if(check2.checked){
                                    result += tempSplit() + artist;
                                }
                                break;
                            case "专辑":
                                if(check3.checked){
                                    result += tempSplit() + album;
                                }
                                break;
                            case "时长":
                                if(check4.checked){
                                    result += tempSplit() + time;
                                }
                                break;
                            case "链接":
                                if(check5.checked){
                                    result += tempSplit() + link;
                                }
                                break;
                        }
                    })
                    result += '\r\n';
                }

                //提示动画
                btn.innerText = '已复制到剪贴板 =';
                let count = 6;
                clearInterval(interId);
                interId = setInterval(function () {
                    count--;
                    if (count > 0){
                        btn.innerText = '已复制到剪贴板 ' + waitAnimationChar(count);
                    }
                    else{
                        btn.innerText = '导出列表';
                        clearInterval(interId);
                    }
                }, 300);

                //输出到控制台
                console.log(result);
                //输出到剪贴板
                trigger.setAttribute('aria-label', result);
                return trigger.getAttribute('aria-label');
            }
        });
    });
    //字符动画
    let waitAnimationChar = function(n){
        let temp = n % 3;
        if(temp === 0) return '#';
        else if(temp == 1) return '$';
        else if(temp == 2) return '+';
    };
})();