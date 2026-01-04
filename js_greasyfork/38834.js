// ==UserScript==
// @name         PMIS One
// @namespace    http://www.womow.cn/
// @version      0.6.0
// @description  增强报销页面的功能
// @require    https://cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.js
// @author       Song
// @match        *://pmis.womow.cn/pmis/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38834/PMIS%20One.user.js
// @updateURL https://update.greasyfork.org/scripts/38834/PMIS%20One.meta.js
// ==/UserScript==

(function () {


    /**
     * 为一些常用功能创建桌面快捷方式
     */
    function createShortcut() {


        //要复制的快捷方式标题
        let titles = ['费用报销', '差旅报销', '在线报工'];

        //桌面快捷方式容器
        let shortcutContainer = $('#win10-shortcuts');

        //开始屏幕的快捷方式。
        let startShortcuts = $('#win10-menu').find('.sub-item');

        /*桌面快捷方式数量*/
        let count = shortcutContainer.children().size();

        startShortcuts.each(function (i, ele) {
            let shortcut = $(ele);
            let title = shortcut.text().trim();

            if (titles.indexOf(title) < 0)
                return;

            let url = ele.onclick.toString();

            let s = $('<div class="shortcut flipInX animated"></div>');

            /*计算位置*/
            // 行列索引
            let colIndex = parseInt(count / 8), rowIndex = count % 8;
            s.css({left: (colIndex * 100 + 10) + 'px', top: (rowIndex * 100 + 10) + 'px'});

            s[0].onclick = ele.onclick;

            let start = url.indexOf('Win10.openUrl(') + 14;
            let args = fetchArgs(url);

            s.data('url', args[0]);
            s.append($(args[1]));
            s.append($('<div class="title"></div>').text(title));

            shortcutContainer.append(s);
            count++;
        });
    }

    /**
     * 从函数的String中提取参数。
     * @param funcStr
     * @return {string[]}
     */
    function fetchArgs(funcStr) {
        funcStr = funcStr.substring(funcStr.indexOf('{') + 1, funcStr.length - 1).trim();
        let args = funcStr.substring(funcStr.indexOf('(') + 1, funcStr.lastIndexOf(')'));
        args = args.split(',');
        args[0] = eval(args[0]);// 运行字符串+

        let tag = args[1];
        tag = tag.substring(1, tag.length - 1);//截取引号内部
        tag = tag.split('\\\'').join('"');//替换转义字符\'
        args[1] = tag;

        return args;
    }


    /**
     *   替换连接
     *   /pmis/views/index.jsp
     */
    function replaceLink() {
        let desktop = $('.desktop');

        let apps = desktop.find('.shortcut');
        let len = apps.length;
        for (let i = 0; i < len; i++) {

            let ap = apps.get(i);//dom 对象

            if (ap.onclick === null)
                continue;

            let url = ap.onclick.toString();
            let args = fetchArgs(url);
            $(ap).data('url', args[0]);
            ap.onclick = null;
        }

        desktop.on('click', '.shortcut', function () {
            let app = $(this);
            window.open(app.data('url'));
        });
    }

    /**
     * 增加预打印按钮
     */
    function addPrePrint() {

        let withFrame = window.frames.length > 0;
        if (withFrame) {
            let frame = window.frames[0];
            frame.onload = function () {
                lazyAdd(frame.document);
            };
        } else {
            lazyAdd(window.document);
        }

        function lazyAdd(doc) {
            /*
             * onload 之后，没有".layui-table-main table" ， 只能观察body
             */
            afterMutation(doc.body, function () {
                /*发生mutation时依然找不到 ".layui-table-main table" ，需要一个延时*/
                setTimeout(function () {
                    addPrePrint_(doc);
                }, 500);
            });
        }
    }

    /**
     *
     * @param doc
     * @private
     */
    function addPrePrint_(doc) {
        let table = $(doc).find('.layui-table-main').children('table');
        let trs = table.find('tr');
        trs.each(function (i) {
            let tds = $(this).children('td');
            let td = $(tds.get(tds.size() - 1)).children('div');
            if (td.text().indexOf('打印') < 0) {
                td.append('<a class="layui-btn layui-btn-mini  layui-btn-normal" lay-event="print">預打印</a>');
            }
        });
    }

    /**
     * 添加截图按钮。
     * 报销单打印页面添加截图按钮。
     */
    function addSnapBtn() {
        let targetNode = document.querySelector('#baseTable').querySelector('span');
        afterMutation(targetNode, prepareSnap);
    }

    /**
     * 初始化截图功能
     */
    function prepareSnap() {

        // 外层容器
        let c = $('#baseTable');

        /*找出报销单号*/
        let h = c.find('.header span').text();
        let hs = h.trim().split('：');
        if (hs.length > 1 && hs[1].length > 0) {
            h = hs[1];
        } else {
            console.warn('未能找到报销单号，终止操作！', h);
            return;
        }

        /* 调整布局、添加元素*/
        c.css({padding: '10px'});
        $('#caiqie').css({'z-index': -1, 'text-align': 'right'});//裁切线div

        // 控制区容器
        let cd = $('.btnframe');
        cd.append('<a id="snapLink" class="down" href="" download="foo.png"></a>');
        cd.append('<button id="snapBtn" class="green">截图</button>');


        let b = document.querySelector('#snapBtn');
        b.addEventListener('click', function (event) {
            snap();
        });

        /**
         * 快照
         */
        function snap() {
            let a = document.querySelector('#snapLink');
            if (a.getAttribute('data-snapped') === 'true') {
                a.dispatchEvent(new MouseEvent('click', {cancelable: true, bubble: true, view: window}));
            } else {
                doSnap();
            }
        }

        /*
         * 给报销单快照，真正的截图方法。
         */
        function doSnap() {
            cd.hide();

            /*
             *  html2canvas-0.5 默认背静是透明。1.0默认背景是白色
             */
            html2canvas(document.getElementById('baseTable'), {'background': '#FFF'}).then(function (canvas) {
                document.body.appendChild(canvas);
                let a = document.querySelector('#snapLink');
                a.setAttribute('download', h + '.png');
                a.setAttribute('data-snapped', 'true');
                a.setAttribute('href', canvas.toDataURL());
                a.dispatchEvent(new MouseEvent('click', {cancelable: true, bubble: true, view: window}));
                document.body.removeChild(canvas);
                /*
                 * hide() show() 会增加内嵌样式“display”，导致打印时，@print 中的隐藏样式无法覆盖内嵌display样式。依然会显示。
                 *  因此使用 removeAttr("style"); 代替 // cd.show();
                 */
                cd.removeAttr('style');
            });
        }


    }

    /**
     * 模拟全局对象、父级对象
     */
    function mockObject() {
        if (!window.top.WinObjPool) {
            window.top.WinObjPool = {};
        }
        parent.openNewWin = function (url, title) {
            window.open(url);
        };
    }

    /**
     *  添加打印报销明细的按钮
     */
    function addPrintDetailButton() {
        let span = $('#sumAmountSpan');//报销明细记录
        let div = $('<div class="no-print"></div>');

        let btn = $('<button class="green">打印报销明细</button>');
        btn.on('click', function () {
            logDetail(false);
        });
        div.append(btn);
        div.append($('<textarea id="tplInput" rows="1">'));
        span.after(div);
    }

    /**
     * 选择打印区域
     */
    function logDetail(allType) {
        let span = $('#sumAmountSpan'); // 小计 span
        let wrapper = span.prev();
        let tbl = wrapper.find('.layui-table-body > table');
        let trs = tbl.find('tr');

        let texts = [];

        trs.each(function (i) {
            let tr = $(this);
            let tds = tr.children();
            let td = $(tds[2]);
            let text = td.text();
            let expend = $(tds[3]).text();
            parseText(text, parseFloat(expend));

        });
        let msg = texts.join('\n');
        console.info(msg);
        let input = document.getElementById('tplInput');
        input.value = msg;
        input.focus();
        input.select();
        let f = document.execCommand('copy');
        if (f === true) input.value = '';

        function parseText(text, expend) {
            let a = text.split('【');
            let info = {};

            for (let i = 0; i < a.length; i++) {
                let expr = a[i];
                if (expr.length === 0) continue;
                expr = expr.trim();

                let kv = expr.split('】：');
                info[kv[0]] = kv[1];
            }

            if (allType || info['交通工具'] === '汽车') {
                let t = info['交通时间'];
                let ts = t.split(' ');
                let s = [];
                s.push(ts[0]); //
                s.push(ts[1] + ts[2] + ts[4]);
                s.push(info['相关人员']);//人员
                s.push(info['说明']);
                s.push(info['出发地 ~ 到达地']);//行程路线
                s.push(expend);

                texts.push(s.join('\t'));
            }
        }
    }


    /**
     * 页面元素改变之后执行回调。仅执行一次。用于数据加载之后执行初始化操作
     * @param target 元素Node
     * @param callback 回调函数
     */
    function afterMutation(target, callback) {
        let config = {childList: true, attributes: true, characterData: true, subtree: true};
        let observer = new MutationObserver(function (mutations) {
            callback();
            observer.disconnect();
        });
        observer.observe(target, config);
    }


    /**
     * 初始化方法
     */
    function init() {
        let pathname = window.location.pathname;
        if (pathname.indexOf('views/index.jsp') > 0) {
            createShortcut();
            replaceLink();
        } else if (pathname.indexOf('bx/list_') > 0 && pathname.indexOf('_apply') < 0) {
            addPrePrint();
            mockObject();
        } else if (pathname.indexOf('bx_print.jsp') > 0) {
            addSnapBtn();
        } else if (pathname.indexOf('bx_detail.jsp') > 0) {
            addPrintDetailButton();
        }
    }


    try {
        init();
    } catch (e) {
        console.error('初始PmisOne化发生错误：', e);
    }
})();
