// ==UserScript==
// @name         贴吧自动发贴（发图）
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  贴吧发图片,支付宝搜索 838049592
// @author       4yop
// @match        https://tieba.baidu.com/p/*
// @match        https://tieba.baidu.com/f?*kw=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/479063/%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E5%8F%91%E8%B4%B4%EF%BC%88%E5%8F%91%E5%9B%BE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/479063/%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E5%8F%91%E8%B4%B4%EF%BC%88%E5%8F%91%E5%9B%BE%EF%BC%89.meta.js
// ==/UserScript==

(async function () {

    'use strict';

    class CacheHandler {
        constructor(key) {
            this.key = key;
        }

        get() {
            return localStorage.getItem(this.key);
        }

        getList() {
            let list = localStorage.getItem(this.key);
            list = list ? JSON.parse(list) : [];
            return Array.isArray(list) ? list.sort() : [];
        }

        exists(data) {
            return this.getList().some(item => item === data);
        }

        set(data) {
            this.add(data);
        }

        add(data) {
            let list = this.getList();
            if (Array.isArray(data)) {
                list.push(...data);
            } else {
                list.push(data);
            }
            list = Array.from(new Set(list)).sort();
            localStorage.setItem(this.key, JSON.stringify(list));
        }

        cover(data) {
            let list = data;
            list = Array.from(new Set(list));
            localStorage.setItem(this.key, JSON.stringify(list));
        }

    }

    class Config {
        statusKey = 'script_status';
        nameKey = 'names';

        constructor(statusKey = 'script_status', nameKey = 'names') {
            this.statusKey = statusKey
            this.nameKey = nameKey
            this.nameCache = new CacheHandler(this.nameKey)
        }

        getStatus(val) {
            return localStorage.setItem(this.statusKey, val);
        }

        setStatus() {
            return !!localStorage.getItem(this.statusKey);
        }

        getNames() {
            let sort = JSON.parse(localStorage.getItem('names_sort'));
            if (!sort) sort = {};
            let names = this.nameCache.getList()
            names.sort((a, b) => parseInt((sort[b] || 0)) - parseInt((sort[a] || 0)));
            return names;
        }

        setNames(data) {
            return this.nameCache.cover(data);
        }

    }


    const tiebaCache = new CacheHandler(document.querySelector('.search_inp_border').value);
    const imgsCache = new CacheHandler('p_imgs');
    const config = new Config();


    class ElementService {
        constructor() {

        }

        createNamesTextarea() {
            if (!!document.querySelector('#names')) {
                return;
            }
            const rows = Math.min(Math.max(5, config.getNames().length), 20);
            const cols = config.getNames().reduce((max, str) => Math.max(max, str.length) * 2, 12);
            const textarea = document.createElement('textarea');
            textarea.id = 'names';
            textarea.name = 'names';
            textarea.rows = rows; // 设置行数
            textarea.cols = cols; // 设置列数
            textarea.placeholder = '一行一个吧名';
            textarea.style.position = 'fixed';
            textarea.style.right = '10px';
            textarea.style.top = '150px';
            textarea.style.display = 'block';
            textarea.value = config.getNames().join("\n");
            textarea.onchange = () => {
                let data = textarea.value.split("\n");
                config.setNames(data)
                alert('保存成功');
            }
            // 将 textarea 元素添加到文档中的某个容器中，例如 body
            document.body.appendChild(textarea);
        }

        createPLog() {
            if (!!document.querySelector('#p-log')) {
                return;
            }
            const pEle = document.createElement('p');
            pEle.id = 'p-log'
            pEle.style.position = 'fixed';
            pEle.style.right = '10px';
            pEle.style.top = '80px';
            pEle.style.display = 'block';
            pEle.style.border = '1px solid red'
            pEle.value = '';
            pEle.readOnly = true;
            document.body.appendChild(pEle);
        }

        createClearCacheBtn() {
            if (!!document.querySelector('#clear-btn')) {
                return;
            }
            const link = document.createElement('button');
            link.id = 'clear-btn'
            link.style.position = 'fixed';
            link.style.right = '10px';
            link.style.top = '110px';
            link.style.display = 'block';
            link.innerText = '清除缓存';
            link.onclick = () => {
                log('清理缓存啦');
                config.getNames().forEach((name) => {
                    localStorage.removeItem(name);
                });
                alert('全清理了');
            }
            document.body.appendChild(link);
        }

        log(text) {
            this.createPLog();
            document.querySelector('#p-log').innerText = text;
        }

    }


    const elementService = new ElementService();
    elementService.createPLog();
    elementService.createClearCacheBtn();
    elementService.createNamesTextarea();

    function log(text) {
        elementService.log(text);
    }


    const delay = (ms) => {
        return new Promise((resolve) => {
            let t = 0;
            let timer = setInterval(() => {
                t++;
                let timeLeft = (ms / 1000) - t;
                log('已过了：' + t + '秒,请再等待:' + timeLeft + '秒');
                if (t >= ms / 1000) {
                    clearInterval(timer);
                    resolve(); // 在达到指定延迟后解析 Promise
                }
            }, 1000);
        });
    };
    const closeWeb = async () => {
        //    await delay(3000);
        log('关闭页面');
        window.opener = null;
        window.open('', '_self');
        window.close();
        setTimeout(() => {
            closeWeb();
        }, 1000);
    };

    const names = config.getNames();

    async function getNextUrl() {
        let currentName = document.querySelector('.search_inp_border').value
        let currentIndex = names.indexOf(currentName);
        let index = currentIndex === -1 || currentIndex >= names.length - 1 ? 0 : currentIndex + 1;
        log('下一个吧：' + names[index])
        if (index === 0) {
            //await delay(30 * 10  * 1000)
        }
        return `https://tieba.baidu.com/f?kw=${names[index]}`;
    }

    function isRun() {
        return names.indexOf(document.querySelector('.search_inp_border').value) !== -1
    }

    const imgs = [
        "https://tiebapic.baidu.com/forum/w%3D580/sign=7a302287f4b7d0a27bc90495fbef760d/db77698b4710b9121ff8b8cb85fdfc03924522b4.jpg?tbpicau=2023-11-10-05_db70f0fd031eda3d56cd13c54976967b"
    ];
    imgs.push(...imgsCache.getList());
    await delay(1000);
    let u1 = '';
    if (!!document.querySelector('.u_username_title')) {
        u1 = document.querySelector('.u_username_title').innerText;
        localStorage.setItem('p_username', u1);
    } else {
        u1 = localStorage.getItem('p_username');
    }
    const username = u1;


    const run = async () => {
        window.scrollTo(0, document.documentElement.scrollHeight)
        try {
            if (!isRun()) {
                log('不是设置的吧');
                return;
            }
            //.poster_warning
            if (document.querySelector('.poster_warning')) {
                tiebaCache.add(document.URL)
                log('不允许评论');
                await closeWeb();
                return;
            }
            if (document.querySelector('.l_pager.pager_theme_5.pb_list_pager').innerText !== '') {
                log('存在翻页');
                await closeWeb();
                return;
            }

            //if (cacheExists(document.URL)) {
            //    log('缓存已存在:' + document.URL);
            //   closeWeb();
            //    return;
            // }
            let hasSend = false;
            for (let i = 0; i < document.querySelectorAll('.d_name').length; i++) {
                let it = document.querySelectorAll('.d_name')[i]
                log(it.innerText)
                if (it.innerText === username) {
                    hasSend = true;
                    tiebaCache.add(document.URL)
                    log('有了:' + username);

                    let imgElement = it.parentNode.parentNode.parentNode.querySelector('img.BDE_Image');
                    if (imgElement) {
                        log(imgElement.src)
                        imgsCache.add(imgElement.src);
                    }
                    await closeWeb();
                    return;
                }
            }
            window.scrollTo(0, document.documentElement.scrollHeight)
            await delay(3000);
            document.querySelector('.edui-icon-image.edui-icon').click();
            await delay(1000);
            document.querySelector('.edui-popup-body .from_web a').click();
            await delay(1000);

            let imgUrl = imgs[Math.floor(Math.random() * imgs.length)]
            document.querySelector('.l_netpic_input.j_input.ui_textfield').value = imgUrl;
            await delay(1000);
            document.querySelector('.ui_btn.ui_btn_m.j_addpic').click();
            await delay(1000);
            while (!!document.querySelector('.progress') && document.querySelector('.progress').style.display !== 'none') {
                await delay(7000);
            }
            document.querySelector('.i_layer_bottom .ui_btn.ui_btn_m').click();
            await delay(1000);
            document.querySelector('.ui_btn.ui_btn_m.j_submit.poster_submit').click();
            tiebaCache.add(document.URL)
            await delay(4000);
            await closeWeb();
        } catch (e) {
            log(e);
            await delay(1000);
            history.go(0)
        }

    }

    function getRandom(max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function setNameSort(){
        let namesSort = JSON.parse(localStorage.getItem('names_sort'));
        if (!namesSort) {
            namesSort = {};
        }
        namesSort[document.querySelector('.search_inp_border').value] = parseInt(document.querySelector('.card_menNum').innerText.replaceAll(',',''))
        localStorage.setItem('names_sort', JSON.stringify(namesSort));
    }

    async function pause() {
        let runTime = parseInt(localStorage.getItem('run_time'));
        if (isNaN(runTime)) runTime = 0;
        let nowTime = Date.now();
        let timeDiff = nowTime - runTime;
        console.log(timeDiff)
        if (timeDiff >= 60 * 60 * 1000) {
            log('run time 和现在差大于 1个钟');
            localStorage.setItem('run_time', Date.now().toString());
        } else if (timeDiff < 60 * 60 * 1000 && timeDiff > 30 * 60 * 1000) {
            log('run time 和现在差在 31-59分钟');
            await delay(runTime + 60 * 60 * 1000 - nowTime);
            //localStorage.setItem('run_time', Date.now().toString());
            history.go(0);
        } else if (timeDiff <= 30 * 60 * 1000) {
            log('run time 和现在差小于 30分钟');
        }
    }

    const run2 = async () => {

        await pause();


        let ignore = [
            'https://tieba.baidu.com/bawu2/errorPage?bz=1'
        ];
        setNameSort();
        await delay(1000);
        if (document.querySelector('#j_head_focus_btn.islike_focus')) {
            document.querySelector('#j_head_focus_btn.islike_focus').click();
        }
        await delay(1000);
        if (document.querySelector('.j_signbtn')) {
            document.querySelector('.j_signbtn').click();
        }

        if (!!document.querySelector('.poster_warning')) {
            log('有警告,不可发帖');
            let url = await getNextUrl();
            window.open(url, '_blank');
            await closeWeb();
            return;
        }
        let post = {
            href: '',
            n: 0,
        };
        for (const it of document.querySelectorAll('.col2_right.j_threadlist_li_right ')) {
            log(it.innerText)
            let n = parseInt(it.parentNode.querySelector('.col2_left.j_threadlist_li_left').innerText);
            if (n >= 30) {
                log('回复有30了');
                continue;
            }
            if (it.querySelectorAll('i.icon-top,i.icon-good,.icon-bazhurecruit').length > 0) {
                log('置顶帖：i有' + it.querySelectorAll('i').length);
                continue;
            }

            let href = it.querySelector('a').href;
            if (ignore.indexOf(href) !== -1) {
                continue;
            }
            if (tiebaCache.exists(href)) {
                log('缓存中有了');
                continue;
            }

            if (post.n <= n) {
                post.href = href;
                post.n = n
            }
        }
        log('看完，');
        log('要打开：' + post.href)
        if (post.href !== '') {
            await delay(137000);
            window.open(post.href, '_blank')
        }


        if (!!document.querySelector('.tbManagerApply') && !!document.querySelector('.poster_warning') === false) {
            log('这吧没吧主');
            let hasSend = false;
            for (let i = 0; i < document.querySelectorAll('.frs-author-name-wrap').length; i++) {
                let it = document.querySelectorAll('.frs-author-name-wrap')[i]
                log(it.innerText)
                if (it.innerText === username) {
                    hasSend = true;
                }
            }

            let now = Date.now();
            let lastTime = parseInt(localStorage.getItem('last_send_time'));
            if (isNaN(lastTime)) lastTime = 0;
            if (!hasSend && now - lastTime > 1000 * 10 * 60) {
                log('首页没：' + username + '，要发帖')

                window.scrollTo(0, document.documentElement.scrollHeight)
                await delay(3000);
                localStorage.setItem('last_send_time', now.toString());
                document.querySelector('.edui-icon-image.edui-icon').click();
                await delay(1000);
                document.querySelector('.edui-popup-body .from_web a').click();
                await delay(1000);

                let imgUrl = imgs[Math.floor(Math.random() * imgs.length)]
                document.querySelector('.l_netpic_input.j_input.form-control').value = imgUrl;
                await delay(1000);
                document.querySelector('.btn_default.btn_middle.j_addpic').click();
                   await delay(1000);
                while (!!document.querySelector('.progress') && document.querySelector('.progress').style.display !== 'none') {
                await delay(7000);
               }
                document.querySelector('.i_layer_btn .btn_default.btn_middle').click();
                let symbols = ['!', '.', '。',' '];

                let title = '王思聪太顶了' + (symbols[Math.floor(Math.random() * symbols.length)].repeat(getRandom(3, 5)));

                document.querySelector('.editor_textfield.editor_title.ui_textfield.j_title.j_topic_sug_input.normal-prefix').value += title;
                await delay(1000);
                document.querySelector('.btn_default.btn_middle.j_submit.poster_submit').click();
            }

        }

        let url = await getNextUrl();
        window.open(url, '_blank');
        await closeWeb();
        // if (document.querySelector('.next.pagination-item')) {
        //     window.open(document.querySelector('.next.pagination-item').href, '_self');
        // }
    };

    let go = true;
    if (go) {
        window.scrollTo(0, document.documentElement.scrollHeight)
        if (!isRun()) {
            log('不是设置的吧');
            return;
        }
        window.scrollTo(0, document.documentElement.scrollHeight)
        if (document.URL.startsWith('https://tieba.baidu.com/f?')) {
            //  setTimeout(() => {
            //      log('刷新啦');
            //     history.go(0);
            // }, 60000);
            setTimeout(() => {
                log('刷新啦');
                history.go(0);
            }, 700000);
            run2().then(() => {
            })
        } else {
            log(145)
            setTimeout(() => {
                log('刷新啦');
                history.go(0);
            }, 60000);
            run().then(r => {
            });
        }
    }
    // Your code here...
})();
