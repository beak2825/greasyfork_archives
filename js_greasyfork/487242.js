// ==UserScript==
// @name         轻小说文库美化
// @namespace    http://tampermonkey.net/
// @version      2024.02.15.14
// @description  适配轻小说文库的阅读界面
// @author       Le_le
// @match        https://www.wenku8.net/novel/*/*/*
// @match        https://www.wenku8.cc/novel/*/*/*
// @icon         https://www.wenku8.net/favicon.ico
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/487242/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/487242/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function index_function() {
        let check_box = document.createElement('input');
        check_box.type = 'checkbox';
        check_box.id = 'beautify';
        check_box.title = 'Beautify';
        check_box.addEventListener('change', function () {
            if (this.checked) {
                GM_setValue('beautify', true);
            }
            else {
                GM_setValue('beautify', false);
            }
            window.location.reload();
        }
        );
        if (GM_getValue('beautify', false)) {
            check_box.checked = true;
            index_changeherf();
        }
        let label = document.createElement('label');
        label.htmlFor = 'beautify';
        label.appendChild(document.createTextNode('启用美化'));
        document.getElementById('linkright').appendChild(label);
        document.getElementById('linkright').appendChild(check_box);
    }

    function index_changeherf() {
        let tbody = document.getElementsByTagName('tbody')[0];
        // 获取所有的tr
        let trs = tbody.getElementsByTagName('tr');
        let a;
        // 排除第一行
        for (let i = 1; i < trs.length; i++) {
            a = trs[i].getElementsByTagName('a');
            for (let i = 0; i < a.length; i++) {
                if (a[i].innerText.indexOf('插图') > -1) {
                    continue;
                }
                a[i].href = a[i].href + '/beautify';
            }
        }
    }

    async function beautify_function() {
        document.body.innerHTML = "";
        document.head.innerHTML = "";
        let url = window.location.href;
        // 去除最后的/beautify
        addhtml();
        url = url.substring(0, url.lastIndexOf('/'));
        await fetchAndDecode(url, 'gbk');

    }


    async function fetchAndDecode(file, encoding) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', file);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            if (this.status == 200) {
                var dataView = new DataView(this.response);
                var decoder = new TextDecoder(encoding);
                var decodedString = decoder.decode(dataView);
                // 获取js的变量 var preview_page = "index.htm";
                var preview_page = decodedString.match(/var preview_page = "(.*?)";/)[1];
                var next_page = decodedString.match(/var next_page = "(.*?)";/)[1];
                var index_page = decodedString.match(/var index_page = "(.*?)";/)[1];
                console.log(preview_page);
                // 解析html
                let parser = new DOMParser();
                let doc = parser.parseFromString(decodedString, 'text/html');
                let content = doc.getElementById('content');
                window.contentvalue = content.innerHTML;
                let title = doc.title;
                document.title = title;
                title=doc.getElementById('title').innerText;
                document.getElementsByTagName('mdui-top-app-bar-title')[0].innerText = title;
                document.getElementById('content').innerHTML = content.innerHTML;
                // 添加事件
                document.getElementById('preview').addEventListener('click', function () {
                    if (preview_page == 'index.htm') {
                        mdui.snackbar({
                            message: '已经是第一章节了'
                        });
                        return;
                    }
                    var url = window.location.href;
                    url = url.substring(0, url.lastIndexOf('/'));
                    url = url.substring(0, url.lastIndexOf('/'));
                    url = url + "/" + preview_page + '/beautify';
                    window.location.href = url;
                }
                );
                document.getElementById('next').addEventListener('click', function () {
                    if (next_page.indexOf('lastchapter') > -1) {
                        mdui.snackbar({
                            message: '已经是最后章节了'
                        });
                        return;
                    }
                    // 返回目录两次
                    var url = window.location.href;
                    url = url.substring(0, url.lastIndexOf('/'));
                    url = url.substring(0, url.lastIndexOf('/'));
                    url = url + "/" + next_page + '/beautify';
                    window.location.href = url;
                }
                );
                document.getElementById('index').addEventListener('click', function () {
                    var url = window.location.href;
                    url = url.substring(0, url.lastIndexOf('/'));
                    url = url.substring(0, url.lastIndexOf('/'));
                    url = url + '/' + index_page;
                    window.location.href = url;
                }
                );
            } else {
                console.error('Error while requesting', file, this);
            }
        };
        xhr.send();
    }


    let locate = window.location;
    if (locate.href.indexOf('index') > -1) {
        index_function();
    } else if (locate.href.indexOf('beautify') > -1) {
        beautify_function();
    }

    function addhtml() {
        let div = `<html class="mdui-theme-auto">
        <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
        <link rel="stylesheet" href="https://unpkg.com/mdui@2.0.3/mdui.css">
        <script src="https://unpkg.com/mdui@2.0.3/mdui.global.js"></script>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <!-- Filled -->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

        <!-- Outlined -->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">

        <!-- Rounded -->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">

        <!-- Sharp -->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet">

        <!-- Two Tone -->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Two+Tone" rel="stylesheet">
        <style>
            #content {
                --pad: 40px;
                columns: 100vw auto;
                height: calc(99vh - var(--pad) * 2);
                column-gap: calc(var(--pad) * 2);
                font-size: 4vh;
                overflow: visible;
                transform: translateX(0vw);
                transition: transform 500ms var(--mdui-motion-easing-emphasized);
                padding: var(--pad);
                cursor: default;
                column-rule: solid 1px rgba(0, 0, 0, 0.1);
                word-break: break-all;

            }

            body {
                padding: 0;
                margin: 0;
                overflow: hidden;
                width: auto;
                background-color: rgba(var(--mdui-color-surface), 1);
            }

            h1 {
                margin: 20px auto;
                position: relative;
                left: 0;
                right: 0;
                width: fit-content;

            }

            .intro {
                padding: 20px;
                background-color: rgba(var(--mdui-color-inverse-primary), 1);
                text-align: center;
            }

            mdui-bottom-app-bar {
                background-color: rgba(var(--mdui-color-surface-bright), 0.8);
            }

            @media screen and (min-width: 600px) {
                #content {
                    columns: 40vw auto;
                }
            }

            .setting_item {
                text-align: center;
            }
            mdui-top-app-bar{
                box-shadow: var(--mdui-elevation-level1);
            }
        </style>

        <body>
            <mdui-top-app-bar style="position: fixed;">
                <mdui-button-icon icon="menu" onclick="openDrawer()"></mdui-button-icon>
                <mdui-top-app-bar-title>轻小说文库</mdui-top-app-bar-title>
                <div style="flex-grow: 1"></div>
                <mdui-button-icon icon="fullscreen" onclick="
                            document.body.requestFullscreen()
                        "></mdui-button-icon>
                <mdui-button-icon icon="light_mode" onclick="
                        if(this.icon == 'light_mode'){
                            this.icon = 'dark_mode'
                            mdui.setTheme('dark')
                        }else{
                            this.icon = 'light_mode'
                            mdui.setTheme('light')
                        }
                        "></mdui-button-icon>
                <mdui-button-icon icon="close" variant="tonal" onclick="hideBar(true)"></mdui-button-icon>
            </mdui-top-app-bar>
            <mdui-navigation-drawer close-on-overlay-click class="example-drawer" modal="true">
                <div class="intro">
                    <h1>轻小说文库美化</h1>
                    <p>Powered By 乐乐</p>
                </div>
                <mdui-divider></mdui-divider>
                <div class="settting">
                    <div class="setting_item">
                        <p>字体大小</p>
                        <mdui-slider id="font-slider" min="15" max="50" value="30" step="1" display-mark></mdui-slider>
                    </div>
                    <mdui-divider></mdui-divider>
                    <div class="setting_item">
                        <p>页边距</p>
                        <mdui-slider id="page-slider" min="0" max="100" value="30" step="1" display-mark></mdui-slider>
                    </div>
                    <mdui-divider></mdui-divider>
                    <div class="setting_item">
                        <p>行间距</p>
                        <mdui-slider id="line-slider" min="0" max="100" value="30" step="1" display-mark></mdui-slider>
                    </div>
                    <mdui-divider></mdui-divider>
                    <div class="setting_item">
                        <p>字间距</p>
                        <mdui-slider id="word-slider" min="0" max="30" value="5" step="1" display-mark></mdui-slider>
                    </div>
                </div>
            </mdui-navigation-drawer>
            <div id="content">
                正在加载文章...
            </div>
            <mdui-bottom-app-bar>
                <mdui-tooltip content="上一章">
                    <mdui-button-icon id="preview" icon="arrow_back"></mdui-button-icon>
                </mdui-tooltip>
                <mdui-tooltip content="章节">
                    <mdui-button-icon id="index" icon="collections_bookmark"></mdui-button-icon>
                </mdui-tooltip>
                <mdui-tooltip content="下一章">
                    <mdui-button-icon id="next" icon="arrow_forward"></mdui-button-icon>
                </mdui-tooltip>
                <div style="flex-grow: 1"></div>
                <mdui-fab extended icon="find_in_page" onclick="
                    document.getElementById('jumpto').open=true
                ">
                    <div>页数: <span id="page">1</span>/<span id="allpage">1</span></div>
                </mdui-fab>
            </mdui-bottom-app-bar>
            <mdui-snackbar id="tip-snackbar"></mdui-snackbar>

            <mdui-dialog class="example-dialog" id="jumpto" close-on-esc close-on-overlay-click>
                <span slot="headline">跳转到指定的页数</span>
                还没做完
                <mdui-button slot="action" variant="text" onclick="document.getElementById('jumpto').open=false" icon="close">取消</mdui-button>
                <mdui-button slot="action" variant="tonal" icon="done">确定</mdui-button>
            </mdui-dialog>
        </body>
        <script>
            window.page = 0;
            function openDrawer() {
                var flag = document.getElementsByTagName('mdui-navigation-drawer')[0].open
                console.log(flag)
                if (flag == false) {
                    document.getElementsByTagName('mdui-navigation-drawer')[0].open = true
                } else {
                    document.getElementsByTagName('mdui-navigation-drawer')[0].open = false
                }
            }
            function hideBar(flag) {
                var topBar = document.getElementsByTagName('mdui-top-app-bar')[0];
                var bottomBar = document.getElementsByTagName('mdui-bottom-app-bar')[0];
                if (flag == true) {
                    topBar.hide = true;
                    bottomBar.hide = true;
                } else {
                    topBar.hide = false;
                    bottomBar.hide = false;
                }
            }
            setTimeout(function () {
                document.body.style.paddingTop = 0;
                document.body.style.paddingBottom = 0;
            }, 10)
            function page_change(flag) {
                hideBar(true)
                window.page = flag + window.page;
                var allpage = document.getElementById('content').scrollWidth / document.body.clientWidth;
                document.getElementById('page').innerHTML = window.page + 1;
                document.getElementById('allpage').innerHTML = parseInt(allpage);
                console.log(allpage, window.page);
                if (window.page >= allpage - 1) {
                    document.getElementById('tip-snackbar').innerHTML = '已经是最后一页了';
                    document.getElementById('tip-snackbar').open = true;
                    hideBar(false)
                    window.page = parseInt(allpage);

                }
                if (window.page <= 0) {
                    document.getElementById('tip-snackbar').innerHTML = '已经是第一页了';
                    document.getElementById('tip-snackbar').open = true;
                    hideBar(false)
                    window.page = 0;

                }
                document.getElementById('content').style.transform = 'translateX(' + (-100 * window.page) + 'vw)';

            }
            window.addEventListener('mousewheel', function (e) {
                // content总宽度/页面宽度
                if (e.deltaY > 0) {
                    page_change(1);
                } else {
                    page_change(-1);
                }

            })
            window.addEventListener('keydown', function (e) {
                if (e.key == 'ArrowRight') {
                    page_change(1);
                } else if (e.key == 'ArrowLeft') {
                    page_change(-1);
                } else if (e.key == 'Escape') {
                    hideBar(false)
                }
            })
            document.getElementById('content').addEventListener('click', enent => {
                // 获取click的位置
                var x = enent.clientX;
                var width = document.body.clientWidth;
                if (x < width / 3) {
                    page_change(-1);
                } else if (x > width / 3 * 2) {
                    page_change(1);
                } else {
                    hideBar(false)
                }
            })
            document.getElementById('font-slider').addEventListener('input', function (e) {
                var value = e.target.value;
                document.getElementById('content').style.fontSize = value + 'px';
            })
            document.getElementById('page-slider').addEventListener('input', function (e) {
                var value = e.target.value;
                document.getElementById('content').style.setProperty('--pad', value + 'px');
            })
            document.getElementById('line-slider').addEventListener('input', function (e) {
                var value = e.target.value;
                document.getElementById('content').style.lineHeight = value + 'px';
            })
            document.getElementById('word-slider').addEventListener('input', function (e) {
                var value = e.target.value;
                document.getElementById('content').style.letterSpacing = value + 'px';
            })
        </script>

        </html>`

        document.write(div);
        document.close();
    }
})();