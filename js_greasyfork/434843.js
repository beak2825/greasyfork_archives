// ==UserScript==
// @name        m3u转换器
// @namespace   Violentmonkey Scripts
// @match       *://*/*.txt*
// @match       *://*/*.m3u*
// @match       http://127.0.0.1*/*playerlist*
// @grant       none
// @version     1.1.1
// @author      percygyq
// @description 配合使用:Chrome扩展(https://www.hlsplayer.org/) 或者egdge扩展 M3u8 Player(https://microsoftedge.microsoft.com/addons/detail/hls-m3u8-player-live-/bmmmdhlnijgodpfbhpgjfkpjiigbpcbk?hl=zh-CN)


let Store = {
    get: function (key, default_vaule) {
        let value = localStorage.getItem(key);
        if (value) {
            try {
                return JSON.parse(value);
            } catch (ignore) {
                if (default_vaule !== undefined) {
                    return default_vaule;
                }
                return null;
            }
        }
        if (default_vaule !== undefined) {
            return default_vaule;
        }
        return null;
    },
    contains: function (key) {
        return !is_empty(localStorage.getItem(key));
    },
    set: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove: function (key) {
        localStorage.removeItem(key);
    },
};
//region 数组功能扩展
//数组迭代函数
Array.prototype.each = function (fn) {
    fn = fn || Function.K;
    let a = [];
    let args = Array.prototype.slice.call(arguments, 1);
    for (let i = 0; i < this.length; i++) {
        let res = fn.apply(this, [this[i], i].concat(args));
        if (res != null) a.push(res);
    }
    return a;
};
//数组是否包含指定元素
Array.prototype.contains = function (suArr) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === suArr) {
            return true;
        }
    }
    return false;
};
//不重复元素构成的数组
Array.prototype.uniquelize = function () {
    // let ra = [];
    // for (let i = 0; i < this.length; i++) {
    //     if (!ra.contains(this[i])) {
    //         ra.push(this[i]);
    //     }
    // }
    // return ra;
    return this;
};
//删除某一元素
Array.prototype.remove = function (val) {
    let index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
        return true;
    }
    return false;
};
Array.prototype.isEmpty = function () {
    return this.length === 0;
};
//两个数组的交集
Array.intersect = function (a, b) {
    return a.uniquelize().each(function (o) {
        return b.contains(o) ? o : null
    });
};
//两个数组的差集
Array.minus = function (a, b) {
    return a.uniquelize().each(function (o) {
        return b.contains(o) ? null : o
    });
};
//两个数组的补集
Array.complement = function (a, b) {
    return Array.minus(Array.union(a, b), Array.intersect(a, b));
};
//两个数组并集
Array.union = function (a, b) {
    return a.concat(b).uniquelize();
};

window.requestIdleCallback = window.requestIdleCallback ||
    function (cb) {
        let start = Date.now();
        return setTimeout(function () {
            cb({
                didTimeout: false,
                timeRemaining: function () {
                    return Math.max(0, 50 - (Date.now() - start));
                }
            });
        }, 1);
    };

window.cancelIdleCallback = window.cancelIdleCallback ||
    function (id) {
        clearTimeout(id);
    };

//endregion

// @downloadURL https://update.greasyfork.org/scripts/434843/m3u%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/434843/m3u%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // @match       *://*/*

    //region 定义变量
    let summary_page_url = window.location.origin + '/res/playerlist'
    let pageSize = 50;//每页显示的记录条数
    let curPage = 0;//当前页
    let direct = 0;//方向
    let len;//总行数
    let page;//总页数
    let title_dic;
    let match_indexes;
    let show_indexs;
    let has_oper_td = false;

    const repeat_str = window.location.host.indexOf("a.bc") || window.location.host.indexOf("193.112.18.11") ? 'res/playerlist' : null;
    let url = window.location.href;
    url = url.split('?')[0];
    url = url.replace('#', '');
    let fav = 'fav';
    let his = 'his';
    let splitr = '~';
    let fav_prefix = fav + splitr;
    let his_prefix = his + splitr;
    let B;  // 文件夹名(C所在的文件夹)
    let C; // 文件名(m3u文件或者txt文件的文件名)
    let imgElements; // {}
    /**
     * 是否收藏状态
     */
    let fav_status = false;
    let fav_indexes;
    let his_status = false;
    let his_indexes;
    let summary;
    let categories;
    /**
     * select选择框 筛选出的 index
     */
    let select_indexes = null;
    let progress = 0;
    let start;
    let period_start;
    //endregion

    //region 逻辑代码
    if (url.startsWith('file:')) {
        //    local file
        console.log('local file------')
    }

    if (getQueryString("mode") === 'summary') {
        // 汇集模式 (显示所有的收藏和历史记录)
        summary = true;
        let datas = load_localStorage();
        printProgress('summary load_localStorage');
        install_table(datas);
        printProgress('summary install_table localStorage');
        return;
    }

    let is_match = url.endsWith(".txt") || url.endsWith(".m3u");
    if (!is_match) {
        window.addEventListener('click', throttle(listen_click, 500, 1000));
        return;
    }

    printProgress('start init html');
    let body_pre = document.querySelector('body > pre');
    if (is_empty(body_pre)) {
        return;
    }
    let text = body_pre.innerText;
    const datas = extract_datas(text);

    printProgress('extract_data_from_html');
    // write_doc(datas);
    install_table(datas);
    printProgress('install_table from html');
    //endregion

    //-----------------------  以下是函数 --------------------
    //region 以下是函数
    function init_some_name(url) {
        let split = url.split('/');
        split = split.each(x => x.length > 0 ? x : null);
        let len = split.length;
        C = decodeURI(split[len - 1]);
        if (len <= 3) {
            B = 'default';
        } else {
            B = decodeURI(split.slice(2, len - 1).join('/'));
        }
        if (!is_empty(repeat_str)) {
            B = B.replace(repeat_str + '/', '');
            B = B.replace(repeat_str, '');
        }
        if (is_empty(B)) {
            B = 'default';
        }
        console.log('B:' + B + ',C:' + C);
    }

    function listen_click(e) {
        let mhref = e && e.target && e.target.href;
        if (is_empty(mhref)) {
            return;
        }
        console.log('mhref', mhref);
        let b = mhref.split('?')[0].endsWith("m3u");
        let c = mhref.split('?')[0].endsWith("txt");
        if (mhref && (b || c)) {
            if (c) {
                // let new_window = window.open(mhref, '_blank');
                // new_window.focus();
                return;
            }
            printProgress('start click url');
            let text = readContent(mhref);
            printProgress('read data from url');
            const datas = extract_datas(text);
            if (datas.length === 0) {
                return;
            }
            url = mhref;
            e.preventDefault();
            e.stopPropagation();
            console.log("e", mhref);
            printProgress('extract data from url');
            install_table(datas);
            printProgress('install_table from url');
            return;
        }
    }

    function lazyload() { //监听页面滚动事件
        let seeHeight = document.documentElement.clientHeight; //可见区域高度
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop; //滚动条距离顶部高度
        for (let i of show_indexs) {
            let img = imgElements[i];
            if (img && img.offsetTop < seeHeight + scrollTop) {
                if (is_empty(img.getAttribute("src"))) {
                    // console.log("lazyload:", i);
                    img.src = img.getAttribute("data-src");
                }
            }
        }
    }


    function listen_key_down(event) {
        // console.log(event.code);
        switch (event.keyCode) {
            case 37:
                frontPage();
                break;
            case 39:
                nextPage();
                break;
            case 38:
                if (event.altKey) {
                    window.scrollTo(0, 0);
                }
                break;
            case 40:
                if (event.altKey) {
                    window.scrollTo(0, document.body.scrollHeight);
                }
                break
        }
    }


    function favorite_update(d, i) {
        let fav_page_key = fav_prefix + C;
        let fav_item_key = fav_page_key + splitr + d.title;
        let innerText = this.innerText;
        // let page_favs2 = Store.get(page_key) || [];
        let title_favs2 = Store.get(fav_page_key, []);
        if (innerText.includes('💗')) {
            // 取消收藏
            fav_indexes.remove(i);
            this.innerText = this.innerText.replace('💗', '🤍');
            Store.remove(fav_item_key);
            if (title_favs2.remove(d.title)) {
                if (title_favs2.isEmpty()) {
                    Store.remove(fav_page_key);
                    let dir_key = fav_prefix + B;
                    let dir_favs = Store.get(dir_key, []);
                    if (dir_favs.remove(C)) {
                        if (dir_favs.isEmpty()) {
                            Store.remove(dir_key);
                            let top_list = Store.get(fav, []);
                            if (top_list.remove(B)) {
                                Store.set(fav, top_list);
                            }
                        } else {
                            Store.set(dir_key, dir_favs);
                        }
                    }
                } else {
                    Store.set(fav_page_key, title_favs2);
                }
            }
        } else {
            // 收藏
            if (!fav_indexes.includes(i)) {
                fav_indexes.push(i);
            }
            this.innerText = this.innerText.replace('🤍', '💗');
            d.time = now();
            Store.set(fav_item_key, d);
            if (!title_favs2.includes(d.title)) {
                title_favs2.push(d.title);
                Store.set(fav_page_key, title_favs2);
                let dir_key = fav_prefix + B;
                let dir_favs = Store.get(dir_key, []);
                if (!dir_favs.includes(C)) {
                    dir_favs.push(C);
                    Store.set(dir_key, dir_favs);
                    let top_list = Store.get(fav, []);
                    if (!top_list.includes(B)) {
                        top_list.push(B);
                        Store.set(fav, top_list);
                    }
                }
            }
        }
    }

    function history_update(d) {
        let his_page_key = his_prefix + C;
        let title_hiss = Store.get(his_page_key, []);
        d.time = now();
        Store.set(his_page_key + splitr + d.title, d);
        if (!title_hiss.includes(d.title)) {
            title_hiss.push(d.title);
            Store.set(his_page_key, title_hiss);
            let dir_key = his_prefix + B;
            let dir_hiss = Store.get(dir_key, []);
            if (!dir_hiss.includes(C)) {
                dir_hiss.push(C);
                Store.set(dir_key, dir_hiss);
                let top_list = Store.get(his, []);
                if (!top_list.includes(B)) {
                    top_list.push(B);
                    Store.set(his, top_list);
                }
            }
        }
    }

    function fill_table(tbody, start, end, datas) {
        let fragment = document.createDocumentFragment();
        for (let i = start; i < end; i++) {
            let d = datas[i];
            let tr = document.createElement('tr');
            td_attach_event(tr, i % 2 === 0);
            fragment.appendChild(tr);
            let title = d.title;
            let logo = d.logo;
            let group = d.group;
            let url = d.url;
            if (d.index === undefined) {
                d.index = i;
            }
            title_dic[i] = title;
            let td_size = has_oper_td ? 3 : 2;
            for (let j = 0; j < td_size; j++) {
                let td = document.createElement('td');
                tr.appendChild(td);
                switch (j) {
                    case 0:
                        if (fav_indexes.includes(i)) {
                            td.innerText = i + 1 + '💗';
                        } else {
                            td.innerText = i + 1 + '🤍';
                        }
                        td.onclick = function () {
                            setBC(fav, i);
                            favorite_update.call(this, d, i);
                        };
                        break;
                    case 1:
                        let e_link = document.createElement("a");
                        e_link.setAttribute("href", url);
                        e_link.setAttribute("target", '_blank');
                        if (is_empty(group)) {
                            e_link.setAttribute('data-group', group);
                        }
                        e_link.onclick = function () {
                            // 播放记录
                            console.log(`click url ${title} -> ${url}`);
                            if (!his_indexes.includes(i)) {
                                his_indexes.push(i);
                            }
                            setBC(his, i);
                            history_update(d);
                        };
                        if (is_empty(logo)) {
                            e_link.innerText = title;
                            e_link.setAttribute('title', getTip(i, d));
                            td.appendChild(e_link);
                        } else {
                            pageSize = 10;
                            let e_img = document.createElement('img');
                            e_img.setAttribute('alt', '😎');
                            e_img.setAttribute('data-src', logo);
                            e_img.setAttribute('title', getTip(i, d));
                            e_img.onerror = function () {
                                this.src = "https://tva4.sinaimg.cn/small/87c01ec7gy1fsnqqz0c17j21kw0w07lt.jpg";
                                this.onerror = null;
                            };
                            e_link.appendChild(e_img);
                            let e_p2 = document.createElement('p');
                            e_p2.setAttribute('class', 'title');
                            e_p2.innerText = title;
                            td.appendChild(e_link);
                            td.appendChild(e_p2);
                            td.onmouseover = function (ev) {
                                if (is_empty(e_img.getAttribute("src"))) {
                                    e_img.src = e_img.getAttribute("data-src");
                                }
                            };
                            imgElements[i] = e_img;
                        }
                        break;
                    case 2:
                        td.innerHTML = "<a href='javascript:void()' style='color:#01AAED'>编辑</a>";
                        break;
                }
            }
        }
        tbody.appendChild(fragment);
    }

    function install_table(datas) {
        if (datas.length === 0) {
            alert("没有读取到任何数据!")
            return;
        }

        if (!summary) {
            init_some_name(url);
            init_history();
            init_favorite();
            document.title = C;
            printProgress('init history and favorite')
        } else {
            document.title = '汇集';
        }

        imgElements = {};
        title_dic = {};
        document.body.innerHTML = '<!DOCTYPE html><html lang="zh-CN"><body></body></html>';
        let html_str = '<a id="btn0"></a><input id="pageSize" type="text" size="1" maxlength="3" /><a> 条 </a>' +
            '<a href="#" id="pageSizeSet">设置</a> ' +
            '&nbsp;&nbsp;<input type="file" id="file_upload" style="background-color: #E1FFFF">' +
            '<p id="sjzl"></p> ' +
            '<a href="#" id="btn1">首页</a> ' +
            '<a href="#" id="btn2">上一页</a> ' +
            '<a href="#" id="btn3">下一页</a> ' +
            '<a href="#" id="btn4">尾页</a> ' +
            '<a>转到 </a> ' +
            '<input id="changePage" type="text" size="1" maxlength="4"/> ' +
            '<a>页 </a> ' +
            '<a href="#" id="btn5">跳转</a>' +
            '<br/>' +
            '<input type="text" name="name" id="keyword" style="width:150px;height:30px; ali;text-align:center;"/> ' +
            '<input  id="search_button" type="button" value="search" style="width:50px;height:30px; ali;text-align:center;">' +
            '&nbsp;&nbsp;' +
            '<input  id="fav_button" type="button" value="收藏" style="width:50px;height:30px; ali;text-align:center;">' +
            '&nbsp;&nbsp;' +
            '<input  id="his_button" type="button" value="记录" style="width:50px;height:30px; ali;text-align:center;">' +
            '&nbsp;&nbsp;' +
            '<input  id="summary_button" type="button" value="汇集" style="width:50px;height:30px; ali;text-align:center;">'
        ;
        document.body.innerHTML += html_str;
        if (summary) {
            add_select();
            printProgress('summary add_select')
        }

        let my_div = document.createElement('div');
        my_div.setAttribute('id', 'center');
        document.body.appendChild(my_div);

        printProgress('summary add_select');

        createTab();

        printProgress('create top_tab');
        let tableStyle = document.createElement('style');
        tableStyle.innerHTML = 'td{' +
            'border-left: #d2d2d2 1px solid;' +
            'border-top: #d2d2d2 1px solid;' +
            'width:50px;' +
            'height:50px;' +
            'text-align:center;' +
            'border-collapse:collapse;' +
            'white-space: nowrap;' +
            'background:snow' +
            '}';
        document.head.appendChild(tableStyle);
        let tab = document.createElement("table");
        tab.setAttribute("id", "mytable");
        let tbody = document.createElement('tbody');
        tab.appendChild(tbody);

        let first_load = 1000;
        if (first_load >= datas.length) {
            first_load = datas.length;
        } else {
            requestIdleCallback(function () {
                let tab = document.querySelector("#mytable > tbody");
                printProgress("lazy load start ");
                fill_table(tab, first_load, datas.length, datas);
                datas = [];
                display();
                printProgress("lazy load end ");
            }, {timeout: 50});
        }
        fill_table(tbody, 0, first_load, datas);
        my_div.appendChild(tab);
        printProgress('create data tab');
        attach_event();
        display();
        printProgress('display');
    }

    function add_select() {
        let style = document.createElement('style');
        style.innerHTML = '.select_style {\n' +
            '    width: 200px;\n' +
            '    height: 50px;\n' +
            '    overflow: hidden;\n' +
            '    background: no-repeat 215px;\n' +
            '    border: 1px solid #ccc;\n' +
            '    -moz-border-radius: 5px; /* Gecko browsers */\n' +
            '    -webkit-border-radius: 5px; /* Webkit browsers */\n' +
            '    border-radius: 5px;\n' +
            '    margin: 10px;\n' +
            '    display: inline;\n' +
            '}\n' +
            '.select_style select {\n' +
            '    padding: 5px;\n' +
            '    background: transparent;\n' +
            '    width: 150px;\n' +
            '    font-size: 16px;\n' +
            '    border: none;\n' +
            '    height: 30px;\n' +
            '    -webkit-appearance: none;\n' +
            '}';
        document.head.appendChild(style);

        let dic = {fav: '收藏', his: '播放记录'};

        document.body.innerHTML += '<br/><br/><br/>'
        let div = document.createElement('div');
        div.setAttribute('id', 'search_options');


        div.appendChild(create_select_div('stype', '类别', Object.keys(categories), 'dir', onStypeChange));
        div.appendChild(create_select_div('dir', '文件夹', [], 'm3u', onDirChange));
        div.appendChild(create_select_div('m3u', '列表', [], '', onM3uChange));
        document.body.appendChild(div);


        function create_select_div(id, tip, values, next_id, func) {
            let div = document.createElement('div');
            div.setAttribute('class', 'select_style');
            let select = document.createElement('select');
            select.setAttribute('id', id);
            select.options.add(new Option(`--${tip}--`, ''))
            for (let value of values) {
                let option = new Option(dic[value] || value, value);
                select.options.add(option);
            }
            div.appendChild(select);
            select.onchange = function () {
                let nextOptionVaules = func(this.value);
                // console.log(this.value);
                if (!is_empty(next_id)) {
                    let e = document.getElementById(next_id);
                    e.options.length = 1;
                    let keys = nextOptionVaules || [];
                    for (let key of keys) {
                        let option = new Option(key, key);
                        e.options.add(option);
                    }
                }
            }
            return div;
        }

    }

    function createTab() {
        let top_tab = document.createElement("table");
        let my_div = document.getElementById('center');
        const tab_array = ["序号", "名称", "选择", "导出"];

        let len = tab_array.length;
        let title = document.createElement("h1");
        title.innerHTML = "节目表";

        let br = document.createElement("br");

        for (let i = 0; i < 1; i++) {
            let tr = top_tab.insertRow(i);
            for (let j = 0; j < len; j++) {
                let td = top_tab.rows[i].insertCell(j);
                td.style.cssText = "BORDER:#d2d2d2 1px solid ;width:50px;height:50px; ali;text-align:center;";
                td.innerHTML = tab_array[j];
                // td.style.background = '#f2f2f2';
                switch (j) {
                    case 2:
                        td.onclick = do_select;
                        break;
                    case 3:
                        td.onclick = do_export;
                        break;
                }
            }
        }
        my_div.appendChild(title);
        my_div.appendChild(br);
        my_div.appendChild(top_tab);
    }

    function getTip(i, d) {
        let time = d.time === undefined ? '' : ' ' + d.time;
        if (summary) {
            let tip = '';
            let stype;
            if (fav_indexes.includes(i)) {
                stype = fav;
            } else if (his_indexes.includes(i)) {
                stype = his;
            }
            if (stype) {
                let m = categories[stype].movies_dic[i];
                if (!is_empty(m)) {
                    tip += m + ' ';
                }
                tip += time;
            }
            return tip;
        } else {
            return d.title + time;
        }
    }

    function attach_event() {
        document.getElementById("btn1").onclick = function firstPage() {    // 首页
            curPage = 1;
            direct = 0;
            displayPage();
        };
        document.getElementById("btn4").onclick = function lastPage() {    // 尾页
            curPage = page;
            direct = 0;
            displayPage();
        };
        document.getElementById("btn5").onclick = function changePage() {    // 转页
            curPage = document.getElementById("changePage").value;
            if (!/^[1-9]\d*$/.test(curPage)) {
                alert("请输入正整数");
                return;
            }
            if (curPage > page) {
                alert("超出数据页面");
                return;
            }
            direct = 0;
            displayPage();
        };
        document.getElementById("btn2").onclick = frontPage;
        document.getElementById("btn3").onclick = nextPage;
        document.getElementById("pageSizeSet").onclick = setPageSize;
        document.getElementById("pageSize").onblur = setPageSize;

        document.getElementById("search_button").onclick = do_search_title;
        document.getElementById("keyword").onblur = do_search_title;
        document.getElementById("fav_button").onclick = show_favorite;
        document.getElementById("his_button").onclick = show_history;
        document.getElementById("file_upload").onchange = reload_by_file;
        document.getElementById("summary_button").onclick = function () {
            let new_window = window.open(summary_page_url + '?mode=summary', '_blank');
            new_window.focus();
        };
        // 图片懒加载
        if (imgElements.length > 0) {
            lazyload();
            window.addEventListener('scroll', throttle(lazyload, 500, 1000));
        }
        window.onkeydown = listen_key_down;
        printProgress('attach event');
    }

    function display() {
        search_title();
        printProgress('search_title');
        curPage = 1;    // 设置当前为第一页
        displayPage();//显示第一页
        printProgress('displayPage');
    }

    function frontPage() {    // 上一页
        direct = -1;
        displayPage();
    }

    function nextPage() {    // 下一页
        direct = 1;
        displayPage();
    }

    function setPageSize() {    // 设置每页显示多少条记录
        pageSize = document.getElementById("pageSize").value;    //每页显示的记录条数
        if (!/^[1-9]\d*$/.test(pageSize)) {
            alert("请输入正整数");
            return;
        }
        pageSize = parseInt(pageSize);
        curPage = 1;
        direct = 0;
        displayPage();
    }

    function do_search_title() {
        curPage = 1;
        direct = 0;
        search_title();
        displayPage();
    }

    function show_favorite() {
        curPage = 1;
        direct = 0;
        fav_status = !fav_status;
        document.getElementById("fav_button").style.backgroundColor = fav_status ? '#FFB6C1' : '#F8F8FF';
        displayPage();
    }

    function show_history() {
        curPage = 1;
        direct = 0;
        his_status = !his_status;
        document.getElementById("his_button").style.backgroundColor = his_status ? '#95c1fc' : '#F8F8FF';
        displayPage();
    }

    function reload_by_file() {
        if (this.files.length === 0) {
            console.log('请选择文件！');
            return;
        }
        let file = this.files[0];
        const reader = new FileReader();
        reader.onload = function fileReadCompleted() {
            // 当读取完成时，内容只在`reader.result`中
            // console.log(reader.result);
            let datas = extract_datas(reader.result);
            if (datas.isEmpty()) {
                console.error(`文件 [${name}] 没有读取到数据!`)
            } else {
                url = `${window.location.origin}/local/${file.name}`;
                summary = false;
                printProgress('read from localFile');
                install_table(datas);
                printProgress('install_table from localFile');
            }
        };
        reader.readAsText(file);
    }

    function search_title() {
        let keyword = document.getElementById('keyword').value;
        match_indexes = [];
        let b1 = is_empty(keyword);
        for (let i in title_dic) {
            let t = title_dic[i];
            if (is_empty(t)) {
                continue
            }
            i = parseInt(i);
            if (b1) {
                match_indexes.push(i);
            } else if (t.toLowerCase().includes(keyword.toLowerCase())) {
                match_indexes.push(i);
            }
        }
    }

    function displayPage() {
        if (curPage <= 1 && direct === -1) {
            direct = 0;
            alert("已经是第一页了");
            return;
        } else if (curPage >= page && direct === 1) {
            direct = 0;
            alert("已经是最后一页了");
            return;
        }
        let eligible_indexes = match_indexes;
        if (fav_status) {
            eligible_indexes = Array.intersect(eligible_indexes, fav_indexes);
        }
        if (his_status) {
            eligible_indexes = Array.intersect(eligible_indexes, his_indexes);
        }
        if (summary && select_indexes !== null) {
            eligible_indexes = Array.intersect(eligible_indexes, select_indexes);
        }
        len = eligible_indexes.length;
        page = len % pageSize === 0 ? len / pageSize : Math.floor(len / pageSize) + 1;

        // 修复当len=1时，curPage计算得0的bug
        if (len > pageSize) {
            curPage = ((curPage + direct + len) % len);
        } else {
            curPage = 1;
        }

        printProgress('calc page');

        document.getElementById("btn0").innerHTML = '当前 ' + curPage + '/' + page + ' 页    每页 ';
        document.getElementById("sjzl").innerHTML = '数据总量: ' + len + '';
        document.getElementById("pageSize").value = pageSize;

        show_indexs = eligible_indexes.slice((curPage - 1) * pageSize, curPage * pageSize);

        let all = document.querySelectorAll('#mytable tr');
        all.forEach(function (e, i) {
            if (show_indexs.includes(i)) {
                e.style.setProperty('display', 'block');
            } else {
                e.style.setProperty('display', 'none');
            }
        });
        printProgress('show page');

        if (direct >= 0 && pageSize <= 30) {
            // 预加载下一页的图片
            let load_indexes = eligible_indexes.slice((curPage - 1) * pageSize, (curPage + 1) * pageSize);
            for (let i of load_indexes) {
                let img = imgElements[i];
                if (img && is_empty(img.getAttribute("src"))) {
                    img.src = img.getAttribute("data-src");
                }
            }
        }
        printProgress('preload next page')
    }

    function do_select() {
        if (this.x !== 1) {
            // 点击
            this.x = 1;
        } else {
            // 再次点击
            this.x = 0;
        }
        let f = this.x;
        const t = document.querySelectorAll("#mytable tr");
        for (let i = 0; i < t.length; i++) {
            if (!show_indexs.includes(i)) {
                continue;
            }
            t[i]["x"] = f;
            if (f) {
                t[i].style.backgroundColor = "#bce774";
            } else {
                // 取消选中
                t[i].style.backgroundColor = (t[i].sectionRowIndex % 2 === 0) ? "#f8fbfc" : "#e5f1f4";
            }
        }
    }

    function do_export() {
        const t = document.querySelectorAll("#mytable tr");
        let datas = [];
        for (let i = 0; i < t.length; i++) {
            let f = t[i]["x"];
            if (f) {
                t[i].style.backgroundColor = "#e3cf4a";
                let e = t[i].querySelector('td:nth-child(2)');
                let a = e.querySelector('td>a');

                let title = e.innerText;
                let url = a.href;
                let group = a.dataset.group || '';

                let imageElement = a.querySelector('img');
                let logo = '';
                if (imageElement) {
                    logo = imageElement.dataset.src || '';
                }
                let d = {
                    'url': url,
                    'title': title,
                    'tvg-logo': logo,
                    'group-title': group
                };
                datas.push(d);
                console.log('export:', t[i].x, i, title);
            }
        }
        let s = datas_to_m3u(datas);
        if (is_empty(s)) {
            alert("没有选中数据!");
            return;
        }
        let file_name;
        if (summary) {
            file_name = 'summary-export.m3u';
        } else {
            file_name = C.split(".")[0] + '-export.m3u';
        }
        exportRaw(file_name, s);
    }

    /**
     * 从本地存储初始化播放记录
     */
    function init_history() {
        his_indexes = [];
        let page_key = his_prefix + C;
        let title_hiss = Store.get(page_key, []);
        for (let title of title_hiss) {
            let item_key = page_key + splitr + title;
            let item = Store.get(item_key);
            if (item) {
                let index = item.index;
                if (index !== undefined) {
                    his_indexes.push(index);
                }
            }
        }

    }

    function init_favorite() {
        fav_indexes = [];
        let page_key = fav_prefix + C;
        let title_favs = Store.get(page_key, []);
        for (let title of title_favs) {
            let item_key = page_key + splitr + title;
            let item = Store.get(item_key);
            if (item) {
                let index = item.index;
                if (index !== undefined) {
                    fav_indexes.push(index);
                }
            }
        }
    }

    function load_favorite() {
        let page_key = fav_prefix + C;
        let page_favs1 = Store.get(page_key, []);
        for (let title of page_favs1) {
            let item_key = page_key + splitr + title;
            let item = Store.get(item_key);
            if (item) {
                let index = item.index;
                if (index) {
                    fav_indexes.push(index);
                }
            }
        }
    }

    function load_localStorage() {
        let datas = [];
        fav_indexes = [];
        his_indexes = [];
        let c = -1;
        let duplicate_check = [];
        categories = {};
        categories.fav = load_data(fav);
        categories.his = load_data(his);

        function load_data(stype) {
            console.log('----type----', stype);
            let dirs = Store.get(stype, []);
            let prefix = stype + splitr;
            let dir_dic = {};
            let m3u_dic = {};
            let movies_dic = {};
            for (let dir of dirs) {
                let m3us = Store.get(prefix + dir, []);
                if (!m3us.isEmpty()) {
                    dir_dic[dir] = m3us;
                }
                for (let m3u of m3us) {
                    let movies = Store.get(prefix + m3u, []);
                    let index_arr = [];
                    let k = dir + splitr + m3u;
                    for (let m of movies) {
                        let item = Store.get(prefix + m3u + splitr + m);
                        if (item) {
                            let j = k + splitr + m;
                            if (duplicate_check.includes(j)) {
                                continue;
                            }
                            duplicate_check.push(j);
                            c++;
                            movies_dic[c] = k;
                            datas.push(item);
                            index_arr.push(c);
                            // console.log('m:', item);
                            switch (stype) {
                                case fav:
                                    fav_indexes.push(c);
                                    break;
                                case his:
                                    his_indexes.push(c);
                                    break;
                            }
                        }
                    }
                    if (!index_arr.isEmpty()) {
                        m3u_dic[k] = index_arr;
                    }
                }
            }
            return {
                'dir_dic': dir_dic,
                'm3u_dic': m3u_dic,
                'movies_dic': movies_dic,
            };
        }

        return datas;
    }

    function setBC(stype, i) {
        if (summary) {
            let m = categories[stype].movies_dic[i];
            if (is_empty(m)) {
                return;
            }
            let split = m.split(splitr);
            B = split[0];
            C = split[1];
        }
    }

    function onStypeChange(x) {
        document.getElementById('m3u').options.length = 1;
        select_indexes = null;
        switch (x) {
            case fav:
                his_status = false;
                fav_status = false;
                document.getElementById("his_button").style.backgroundColor = '#F8F8FF';
                show_favorite();
                break;
            case his:
                his_status = false;
                fav_status = false;
                document.getElementById("fav_button").style.backgroundColor = '#F8F8FF';
                show_history();
                break;
            default:
                his_status = false;
                fav_status = false;
                document.getElementById("fav_button").style.backgroundColor = '#F8F8FF';
                document.getElementById("his_button").style.backgroundColor = '#F8F8FF';
                curPage = 1;
                direct = 0;
                displayPage();
                return [];
        }
        return Object.keys(categories[x].dir_dic);
    }

    function onDirChange(x) {
        let pre = document.getElementById('stype');
        let stype = pre.options[pre.selectedIndex].value;
        if (is_empty(stype)) {
            return null;
        }
        if (is_empty(x)) {
            onStypeChange(stype);
            return null;
        }
        select_indexes = [];
        let m3us = categories[stype].dir_dic[x] || [];
        for (let m3u of m3us) {
            let k = x + splitr + m3u;
            let arr = categories[stype].m3u_dic[k] || [];
            for (let i of arr) {
                select_indexes.push(i);
            }
        }
        curPage = 1;
        direct = 0;
        displayPage();
        return categories[stype].dir_dic[x];
    }

    function onM3uChange(x) {
        let pre = document.getElementById('stype');
        let stype = pre.options[pre.selectedIndex].value;
        if (is_empty(stype)) {
            return;
        }
        pre = document.getElementById('dir');
        let dir = pre.options[pre.selectedIndex].value;
        if (is_empty(dir)) {
            return;
        }
        if (is_empty(x)) {
            onDirChange(dir);
            return;
        }
        select_indexes = [];
        let k = dir + splitr + x;
        let arr = categories[stype].m3u_dic[k] || [];
        for (let i of arr) {
            select_indexes.push(i);
        }
        curPage = 1;
        direct = 0;
        displayPage();
        return;
    }

    function printProgress(name) {
        let now = Date.now();
        if (isNaN(start)) {
            start = now;
            period_start = now;
        }
        let cost = now - start;
        let period_cost = now - period_start;
        period_start = now;
        console.log(`${++progress}\t\t${cost}ms\t${name} -> ${period_cost} ms`)
    }

    //endregion
})();

//-----------------------  以下是global函数 --------------------
//region 以下是global函数
function td_attach_event(tr, odd) {
    if (odd) {
        tr.style.backgroundColor = '#f8fbfc';
    } else {
        tr.style.backgroundColor = '#e5f1f4';
    }
    tr.onclick = function () {
        if (this.x !== 1) {
            // 选中
            this.x = 1;
            this.style.backgroundColor = "#bce774";
        } else {
            // 取消选中
            this.x = 0;
            this.style.backgroundColor = (this.sectionRowIndex % 2 === 0) ? "#f8fbfc" : "#e5f1f4";
        }
    };
    tr.onmouseover = function () {
        if (this.x !== 1) this.style.backgroundColor = "#ecfbd4";
    };
    tr.onmouseout = function () {
        if (this.x !== 1) this.style.backgroundColor = (this.sectionRowIndex % 2 === 0) ? "#f8fbfc" : "#e5f1f4";
    };
}

/**
 * 节流函数
 */
function throttle(fun, delay, time) {
    let timeout, startTime = new Date();
    return function () {
        let context = this, args = arguments, curTime = new Date();
        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if (curTime - startTime >= time) {
            fun.apply(context, args);
            startTime = curTime;
            // 没达到触发间隔，重新设定定时器
        } else {
            timeout = setTimeout(fun, delay);
        }
    };
}

function replace_all(str, old_value, new_value) {//吧f替换成e
    let reg = new RegExp(old_value, "g"); //创建正则RegExp对象
    return str.replace(reg, new_value);
}

function is_empty(str) {
    return str == null || str === 'undefined' || !str || !/[^\s]/.test(str);
}

function readContent(url) {
    let xhr = new XMLHttpRequest(), okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', url, false);
    xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}

function extract_datas(text) {
    const dic_list = [];

    let split = text.split("\n");
    if (split.length === 1) {
        split = text.split("\r\n");
    }
    if (!split[0].includes('#EXTM3U')) {
        return dic_list;
    }
    let dic = {};
    let f = false;
    for (let s of split) {
        if (is_empty(s)) {
            continue
        }
        if (s.includes('#EXTM3U')) {
            continue
        }
        if (s.includes('#EXTINF')) {
            f = true;
            s = s.replace('#EXTINF:-1', '');
            let title = /((\s[\w,-]+)="([^"]+)")*\s*,\s*(.+)/.exec(s)[4].trim();
            let tmp_dic = {};
            let r = /(\s[\w,-]+)="([^"]+)"/g;
            while (r.test(s)) {
                tmp_dic[RegExp.$1.trim()] = RegExp.$2.trim();
            }
            dic = {};
            dic.title = title;
            dic.logo = tmp_dic['tvg-logo'] || '';
            dic.group = tmp_dic['group-title'] || '';
            dic.tvg_name = tmp_dic['tvg-name'] || '';
            continue
        }
        if (f) {
            if (is_empty(s)) {
                continue
            }
            s = s.trim();
            if (s.startsWith("#") || s.includes("#")) {
                continue;
            }
            dic.url = s;
            dic_list.push(dic)
        }
        // console.log(s)
    }
    console.log("-----------------------");
    return dic_list;
}

function datas_to_m3u(datas) {
    if (datas.length === 0) {
        return "";
    }
    let s = "#EXTM3U\n";
    for (let d of datas) {
        s += "#EXTINF:-1 ";
        if (!is_empty(d['tvg-logo'])) {
            s += `tvg-logo="${d['tvg-logo']}" `;
        }
        if (is_empty(d['group-title'])) {
            s += `group-title="${d['group-title']}" `;
        }
        s += `, ${d.title}\n${d.url}\n`;
    }
    return s;
}

function fakeClick(obj) {
    let ev = document.createEvent("MouseEvents");
    ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    obj.dispatchEvent(ev);
}

function exportRaw(name, data) {
    let urlObject = window.URL || window.webkitURL || window;
    let export_blob = new Blob([data]);
    let save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    fakeClick(save_link);
}

function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = decodeURI(window.location.search.substr(1)).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function now() {
    return dateFormat("YYYY-mm-dd HH:MM:SS", new Date());
}

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}


//endregion
