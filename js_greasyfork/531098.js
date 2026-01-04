// ==UserScript==
// @name         摸鱼百度搜索看小说
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  摸鱼才是赚钱，在百度搜索页面添加窗口添加小说内容，无缝隐藏
// @author       xiuyuan
// @match        https://www.baidu.com/*
// @match        https://*.biqu04.cc/book/*/*html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531098/%E6%91%B8%E9%B1%BC%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%9C%8B%E5%B0%8F%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/531098/%E6%91%B8%E9%B1%BC%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%9C%8B%E5%B0%8F%E8%AF%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    const button = document.createElement('div');
    button.style.position = 'fixed';
    button.id = 'btnf';
    button.style.zIndex = '9999';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.backgroundColor = '#ff6347'; // 橙红色
    button.style.borderRadius = '50%';
    button.style.cursor = 'pointer';
    button.style.transition = 'transform 0.3s, background-color 0.3s';
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    button.innerHTML = '<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white;font-size: 22px;">摸</span>';

    // 创建悬浮菜单元素
    const menu = document.createElement('div');
    menu.id = 'menuf';
    menu.style.zIndex = '9998';
    menu.style.position = 'fixed';
    menu.style.width = '100px';
    menu.style.height = 'auto';
    menu.style.backgroundColor = '#fff';
    menu.style.border = '1px solid #ccc';
    menu.style.borderRadius = '5px';
    menu.style.padding = '10px';
    menu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    menu.style.display = 'none'; // 默认隐藏菜单
    menu.style.left = `${window.innerWidth - 210}px`; // 菜单宽度 + 按钮宽度的一半
    menu.style.top = `${window.innerHeight - 75}px`; // 按钮高度的一半

    // 添加一些示例菜单项
    menu.innerHTML = `
        <div style="cursor: pointer; padding: 5px 0;" id='cc1'>模式 1</div>
        <div style="cursor: pointer; padding: 5px 0;" id='cc2'>模式 2</div>
        <div style="cursor: pointer; padding: 5px 0;" id='cc3'>设置</div>
        <div style="cursor: pointer; padding: 5px 0;" id='cc4'>添加</div>
    `;

    //设置页面内容
    let setdiv = document.createElement('div');
    setdiv.id = 'setdiv';
    setdiv.style.zIndex = '9999';
    setdiv.style.position = 'fixed';
    setdiv.style.width = '400px';
    setdiv.style.height = '300px';
    setdiv.style.top = '20%';
    setdiv.style.left = '30%';
    setdiv.style.backgroundColor = '#fff';
    setdiv.style.border = '1px solid #ccc';
    setdiv.style.padding = '10px';
    setdiv.style.borderRadius = '5px';
    setdiv.style.display = 'none';
    setdiv.innerHTML = `
        <style>
            #seturl, #setnum{
                width: 350px;
                height: 40px;
                border: 1px solid #ccc;
                border-radius: 5px;
                margin: 10px 0;
                padding: 0 10px;
            }
            #setbtn, #setclose {
                width: 80px;
                height: 30px;
                border: 1px solid #ccc;
                border-radius: 5px;
                margin: 10px 0;
            }
        </style>
        <h4>摸鱼设置</h4>
        <div>
            <p>网址</p>
            <input type="text" class="form-control" id="seturl" placeholder="请输入网址" style="display: inline-block;">
            <a href="https://dcb68146.biqu04.cc" target="_blank" id="seturl2" style="display: inline-block;">去书城</a>
        </div>
        <div>
            <p>每页显示字数</p>
            <input type="text" class="form-control" id="setnum" placeholder="请输入每页显示字数">
        </div>
        <div>
            <button id="setbtn" class="btn btn-primary" type="button">确定</button>
            <button id="setclose" class="btn btn-secondary" type="button" onclick="document.getElementById('setdiv').style.display='none'">取消</button>
        </div>
    `;
    //document.body.appendChild(setdiv);
    // 获取 body 的第一个子元素
    const firstChild = document.body.firstChild;

    // 将按钮插入到 body 的第一个子元素之前
    if (firstChild) {
        document.body.insertBefore(button, firstChild);
        document.body.insertBefore(menu, firstChild);
        document.body.insertBefore(setdiv, firstChild);
    } else {
        document.body.appendChild(button);
        document.body.appendChild(menu);
    }



    // 使用 GM_xmlhttpRequest 获取网页内容
    function fetchWebContent(co = 0) {
        let nexturl = GM_getValue('nexturl', '');
        if (!nexturl) {
            if(co == 0) {
                set_view('请先设置网址');
            }else{
                set_view2('请先设置网址');
            }
            return;
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: nexturl,
            onload: function(response) {
                try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    let lnextcontent = doc.querySelector('#chaptercontent').innerText;
                    // lnextcontent = lnextcontent.replace(/\s+/g, '').replace(/<br>/g, '\n').replace(/&nbsp;/g, ' ').replace(/<p>/g, '').replace(/<\/p>/g, '\n').replace(/<br\/>/g, '\n').replace(/<br \/>/g, '\n');
                    lnextcontent = lnextcontent.replaceAll('<br><br>', '<br>').replaceAll('请收藏', '').replaceAll('（温馨提示：请关闭畅读或阅读模式，否则内容无法正常显示）', '');
                    GM_setValue('lnextcontent', lnextcontent);
                    if(co == 0) {
                        document.querySelector('#cc1').click();
                    }else{
                        document.querySelector('#cc2').click();
                    }

                    let nexturl0 = doc.querySelector('#pb_next').getAttribute('href');
                    let _split = nexturl0.split('/');
                    let nexturl = GM_getValue('nexturl', '');
                    for (let i = 0; i < _split.length; i++) {
                        if (_split[i] != '') {
                            nexturl = nexturl.split(_split[i])[0] + _split[i] + nexturl0.split(_split[i])[1];
                            GM_setValue('nexturl', nexturl);
                            console.log('下一页地址为',nexturl);
                            break;
                        }
                    }
                } catch (error) {
                    console.error('Error parsing web content:', error);
                    if(co == 0) {
                        set_view('网址解析错误，请检查网址');
                    }else{
                        set_view2('网址解析错误，请检查网址');
                    }
                }
            },
            onerror: function(error) {
                console.error('Error fetching web content:', error);
                if(co == 0) {
                    set_view('网址解析错误，请检查网址');
                }else{
                    set_view2('网址解析错误，请检查网址');
                }
            }
        });
    }

    menu.addEventListener('click', function(e){
        menu.style.display = 'none';
    });

    //快捷设置
    document.querySelector('#cc4').addEventListener('click', () => {
        GM_setValue('nexturl', document.URL);
        GM_setValue('viewpage', 0);
        GM_setValue('lnextcontent', '');
    });

    document.querySelector('#cc1').addEventListener('click', function(){
        let lnextcontent = GM_getValue('lnextcontent', '');
        let offset = GM_getValue('viewpage', 0) * GM_getValue('getnum', 100);
        // console.log('当前页数',GM_getValue('viewpage', 0));
        if (lnextcontent.length >= offset && lnextcontent.length > 0) {
            let content = lnextcontent.substring(offset, (offset + GM_getValue('getnum', 100)) > lnextcontent.length ? lnextcontent.length : (offset + GM_getValue('getnum', 100)));
            set_view(content);
            //GM_setValue('lnextcontent', lnextcontent.substring(getnum));
        }else{
            // console.log('获取下一页');
            GM_setValue('viewpage', 0);
            fetchWebContent();
        }
    });

    document.querySelector('#cc2').addEventListener('click', function(){
        let lnextcontent = GM_getValue('lnextcontent', '');
        let offset = GM_getValue('viewpage', 0) * GM_getValue('getnum', 100);
        // console.log('当前页数',GM_getValue('viewpage', 0));
        if (lnextcontent.length >= offset && lnextcontent.length > 0) {
            let content = lnextcontent.substring(offset, (offset + GM_getValue('getnum', 100)) > lnextcontent.length ? lnextcontent.length : (offset + GM_getValue('getnum', 100)));
            set_view2(content);
        }else{
            GM_setValue('viewpage', 0);
            fetchWebContent(1);
        }
    });

    function set_view2(content){
        let c0 = document.querySelector('#con-ar');
        let c2 = c0.querySelectorAll('div')[0];
        let cp = c2;
        let nextp = document.querySelector('#r_pb_next');
        if(c2.id == 'con-ceiling-wrapper') {
            cp = document.createElement('div');
            c0.insertBefore(cp, c2);
        }
        cp.innerHTML = content;
        if(!nextp){
            nextp = document.createElement('span');
            nextp.className = 'c-color-gray';
            nextp.id = 'r_pb_next';
            //nextp.textContent = content.length < GM_getValue('getnum', 100) ? '下一章' : '下一页';
            nextp.addEventListener('click', function(){
                if(nextp.textContent == '加载中...') return;
                nextp.textContent = '加载中...';
                GM_setValue('viewpage', GM_getValue('viewpage', 0) + 1);
                document.querySelector('#cc2').click();
            });
            c0.insertBefore(nextp, c2);
        }
        nextp.textContent = content.length < GM_getValue('getnum', 100) ? '下一章' : '下一页';
    }

    function set_view(content){
        let c3 = document.querySelector('#zhong');
        if(!c3) {
            let c0 = document.querySelector('#content_left');
            let c2 = c0.querySelectorAll('.result[id] > div')[0];
            c3 = c2.querySelector('div.c-row') ? c2.querySelector('div.c-row') : c2;

            let c1 = c2.querySelectorAll('div');
            for(let i = 0; i < c1.length; i++) {
                if(c1[i].querySelectorAll('a[href]').length == 1) {
                    console.log(i, c1[i+1].innerHTML);
                    for(let j =i+1; j < c1.length; j++) {
                        c1[j].remove();
                    }
                    c3.id = 'zhong';
                    c2.appendChild(c3);
                    break;
                }
            }
        }

        c3.innerHTML = '';
        const cp = document.createElement('p');
        cp.innerHTML = content;
        c3.appendChild(cp);
        //<span class="c-color-gray" aria-hidden="true">橙篇</span>
        let nextp = document.createElement('span');
        nextp.className = 'c-color-gray';
        nextp.textContent = content.length < GM_getValue('getnum', 100) ? '下一章' : '下一页';
        nextp.addEventListener('click', function(){
            if(nextp.textContent == '加载中...') return;
            nextp.textContent = '加载中...';
            GM_setValue('viewpage', GM_getValue('viewpage', 0) + 1);
            document.querySelector('#cc1').click();
        });
        c3.appendChild(nextp);
    }

    // 定义吸附位置函数
    function stickToEdge(flag = 2) {
        const rect = button.getBoundingClientRect();
        let x = window.innerWidth - rect.width / flag;
        let y = window.innerHeight - rect.height / flag;

        if (rect.left < 0) {
            x = rect.width / flag;
        }
        if (rect.top < 0) {
            y = rect.height / flag;
        }

        // 计算距离四个边的距离
        const distances = {
            right: window.innerWidth - rect.right,
            //bottom: window.innerHeight - rect.bottom,
            left: rect.left,
            //top: rect.top
        };

        // 找到最近的边缘
        const minDistance = Math.min(...Object.values(distances));
        switch (minDistance) {
            case distances.right:
                x = window.innerWidth - rect.width / flag;
                break;
            case distances.left:
                x = rect.width / flag;
                break;
        }

        button.style.left = `${x - rect.width / flag}px`;
        button.style.transform = 'scale(0.5)';
    }

    // 监听鼠标移动事件
    let isDragging = false;
    let offsetX, offsetY;
    let ismove = false;

    button.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - button.offsetLeft;
        offsetY = e.clientY - button.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        ismove = true;
        showmenu();
        button.style.left = `${e.clientX - offsetX}px`;
        button.style.top = `${e.clientY - offsetY}px`;
        button.style.transform = 'scale(1)';
    });

    document.addEventListener('mouseup', (e) => {
        if (button.contains(e.target)) {
            showmenu();
        }
        isDragging = false;
        ismove = false;
        //stickToEdge();
    });

    // 初始吸附到右下角
    button.style.left = `${window.innerWidth - 50}px`; // 50px width / 2 = 25px
    button.style.top = `100px`; // 50px height / 2 = 25px
    button.style.transform = 'scale(0.5)';

    // 鼠标移入时显示完整按钮
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1)';
    });

    // 鼠标移出时恢复半显示并吸附
    button.addEventListener('mouseleave', () => {
        stickToEdge();
    });

    // 点击按钮时显示或隐藏菜单，并自动判断菜单显示位置
    function showmenu(){
        if(ismove) return;
        if (menu.style.display === 'block') {
            menu.style.display = 'none';
            return;
        }
        const btnRect = button.getBoundingClientRect();
        // const menuWidth = menu.style.width > 0 ? menu.style.width : menu.offsetWidth;
        // const menuHeight = menu.style.height > 0 ? menu.style.height : menu.offsetHeight;

        const menuWidth = menu.offsetWidth > 0 ? menu.offsetWidth : parseInt(menu.style.width) ? parseInt(menu.style.width) : 100;
        const menuHeight = menu.offsetHeight > 0 ? menu.offsetHeight : parseInt(menu.style.height) ? parseInt(menu.style.height) : 200;

        console.log(document.querySelector('#menuf').style.width, document.querySelector('#menuf').style.height);
        let menuTop, menuLeft;

        // 计算可用空间
        const spaceAbove = btnRect.top;
        const spaceBelow = window.innerHeight - btnRect.bottom;
        const spaceLeft = btnRect.left;
        const spaceRight = window.innerWidth - btnRect.right;

        // 选择最佳显示位置
        if (spaceBelow >= menuHeight && spaceRight >= menuWidth) {
            // 下方
            menuTop = btnRect.bottom;
            menuLeft = btnRect.left;
            console.log('下方');
        } else if (spaceAbove >= menuHeight && spaceRight >= menuWidth) {
            // 上方
            menuTop = btnRect.top - menuHeight;
            menuLeft = btnRect.left;
        } else if (spaceBelow >= menuHeight && spaceLeft >= menuWidth) {
            // 下方左侧
            menuTop = btnRect.bottom;
            menuLeft = btnRect.left - menuWidth;
        } else if (spaceAbove >= menuHeight && spaceLeft >= menuWidth) {
            // 上方左侧
            menuTop = btnRect.top - menuHeight;
            menuLeft = btnRect.left - menuWidth;
        }

        menu.style.top = `${menuTop}px`;
        menu.style.left = `${menuLeft}px`;
        console.log(menuTop, menuLeft);
        menu.style.display = 'block';
    }

    // 点击菜单外区域时隐藏菜单
    document.addEventListener('click', (e) => {
        if (!button.contains(e.target) && !menu.contains(e.target)) {
            menu.style.display = 'none';
        }
    });

    //设置页面内容
    document.querySelector('#cc3').addEventListener('click', function(){
        document.querySelector('#seturl').value = GM_getValue('nexturl');
        document.querySelector('#setnum').value = GM_getValue('getnum');
        document.querySelector('#setdiv').style.display = 'block';
    });
    //设置页面确定按钮
    document.querySelector('#setbtn').addEventListener('click', function(){
        GM_setValue('getnum', parseInt(document.querySelector('#setnum').value) ? parseInt(document.querySelector('#setnum').value) : GM_getValue('getnum', 100))
        if (document.querySelector('#seturl').value && document.querySelector('#seturl').value != GM_getValue('nexturl')) {
            GM_setValue('nexturl', document.querySelector('#seturl').value);
            GM_setValue('viewpage', 0);
            GM_setValue('lnextcontent', '');
            fetchWebContent();
        }

        console.log('设置网页地址为',GM_getValue('nexturl'));
        console.log('设置显示字数为',GM_getValue('getnum', 100));

        document.querySelector('#setdiv').style.display = 'none';
    });

    if (window.location.href.indexOf('baidu.com') > -1) {
        document.querySelector('#cc1').style.display = 'block';
        document.querySelector('#cc2').style.display = 'block';
        document.querySelector('#cc3').style.display = 'block';
        document.querySelector('#cc4').style.display = 'none';
    } else if (window.location.href.indexOf('biqu04.cc') > -1) {
        document.querySelector('#cc1').style.display = 'none';
        document.querySelector('#cc2').style.display = 'none';
        document.querySelector('#cc3').style.display = 'none';
        document.querySelector('#cc4').style.display = 'block';
    }else {
        document.querySelector('#cc4').style.display = 'none';
    }

    // 调整窗口大小时重新吸附
    window.addEventListener('resize', () => {stickToEdge(1);});
})();