// ==UserScript==
// @name         ERP321Delivery
// @namespace    https://www.erp321.com/
// @version      1.0
// @description  自动发货脚本
// @author       599846042@qq.com
// @match        *://www.erp321.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436788/ERP321Delivery.user.js
// @updateURL https://update.greasyfork.org/scripts/436788/ERP321Delivery.meta.js
// ==/UserScript==

(function () {
    'use strict'
    var CONFIG = {
        // 合法href 打单界面路由链接
        HREF: '/app/wms/express/expresssetter.aspx',
        // 定时执行周期 单位ms
        IntervalTimeOut: 1000 * 60 * 10,
        // 每天结束执行截止小时
        DeadlineHour: 17,
        // 默认是否开启自动发货
        IsOn: true,
    }

    typeof (OpenTab) === 'function' && OpenTab('打单拣货', 'app/wms/express/expresssetter.aspx', null, 'm_153')
    var delivery_company = ''
    var interval = null;//计时器
    var i = 0;

    /**
     * 获取Dom  table行元素
     * @param isChecked false 获取是否选中的行元素
     * @returns {*}
     */
    function getRowDom(isChecked = false) {
        var tableDom = $('#_jt_body_list');
        if (!tableDom) {
            console.log('tableDom 不存在')
            return []
        }
        // console.log($('#_jt_body_list').html())
        return tableDom.children(isChecked ? '._jt_row_checked' : '._jt_row');
    }

    /**
     * 获取每行中某单元格元素
     * @param domRow
     * @returns {{dom_way_no: jQuery, dom_delivery_company: jQuery, dom_check_box: jQuery}}
     */
    function getCellDom(domRow) {
        /**
         * 索引从 0 开始
         * 1：复选框；8：快递单号
         */
        var dom_delivery_company = $(domRow).children().eq(7);
        var dom_way_no = $(domRow).children().eq(8);
        var dom_check_box = $(domRow).children().eq(1);
        return {
            dom_delivery_company,
            dom_way_no,
            dom_check_box
        }
    }


    /**
     * 获取快递单号
     */
    function getDeliveryNo() {
        var children = getRowDom();
        //console.warn('children', children)
        //----------------------获取快递单号 start--------------------------
        for (var i = 0; i < children.length; i++) {
            var item = children[i];
            var {dom_way_no, dom_check_box, dom_delivery_company} = getCellDom(item)
            var way_no = dom_way_no.text();
            var class_row = $(item).attr('class');
            var is_row_checked = class_row.indexOf('_jt_row_checked') !== -1 // true选中 false非选中
            //console.warn('way_no', way_no)
            //console.warn('delivery_company', delivery_company)
            if (!way_no) {
                // 没有快递单号的行数据被触发选中
                if (!delivery_company) {
                    delivery_company = $(dom_delivery_company).text()
                }
                if ($(dom_delivery_company).text() === delivery_company) {
                    // 触发选中
                    $(dom_check_box).trigger('click')
                }
            } else {
                if (is_row_checked) {
                    // 有快递单号且被选中的元素  被反选
                    $(dom_check_box).trigger('click')
                }
            }
        }
        if (getRowDom(true).length) {
            // 触发【获取电子面单号】方法
            typeof (GetAndSetElids) === 'function' && GetAndSetElids()
        }
        delivery_company = ''
        //----------------------获取快递单号 end--------------------------
    }

    /**
     * 直接发货
     * 1. 触发选中行（条件：a.没有快递单号&&是选中状态；b.异常的快递单号&&选中状态；c.正常的快递单号&&非选中状态；）
     * 2. 调用发货方法（条件：选中行数大于0）
     */
    function toDeliverGoods() {
        //----------------------直接发货 start--------------------------
        var children = getRowDom();
        for (var i = 0; i < children.length; i++) {
            var item = children[i];
            var dom_way_no_delivery = getCellDom(item).dom_way_no
            var dom_check_box_delivery = getCellDom(item).dom_check_box
            var style_way_no = $(dom_way_no_delivery).attr('style');
            var class_row = $(item).attr('class');
            var way_no = dom_way_no_delivery.text();
            var is_row_checked = class_row.indexOf('_jt_row_checked') !== -1 // true选中 false非选中
            var is_row_unusual = style_way_no.indexOf('color') !== -1 // true异常 false正常

            console.log('class_row', class_row)
            console.log("style_way_no.indexOf('color')", style_way_no.indexOf('color'))

            if (!way_no) {
                // 没有快递单号&&是选中状态  进行反选！！
                is_row_checked && $(dom_check_box_delivery).trigger('click')
            } else {
                // 有快递单号
                if ((is_row_unusual && is_row_checked) || (!is_row_unusual && !is_row_checked)) {
                    // （是异常的快递单号&&当前行是选中状态）||（正常的快递单号&&非选中状态）
                    $(dom_check_box_delivery).trigger('click')
                }
            }
        }


        if (getRowDom(true).length) {
            // 触发【直接发货】方法
            typeof (Sends) === 'function' && Sends()
        }
        //----------------------直接发货 end--------------------------
    }

    function parseTime(time, cFormat = false) {
        if (arguments.length === 0 || !time) {
            return null
        }
        const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
        let date
        if (typeof time === 'object') {
            date = time
        } else {
            if ((typeof time === 'string')) {
                if ((/^[0-9]+$/.test(time))) {
                    // support "1548221490638"
                    time = parseInt(time)
                } else {
                    // support safari
                    // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
                    time = time.replace(new RegExp(/-/gm), '/')
                }
            }

            if ((typeof time === 'number') && (time.toString().length === 10)) {
                time = time * 1000
            }
            date = new Date(time)
        }
        const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        }
        return format.replace(/{([ymdhisa])+}/g, (result, key) => {
            const value = formatObj[key]
            // Note: getDay() returns 0 on Sunday
            if (key === 'a') {
                return ['日', '一', '二', '三', '四', '五', '六'][value]
            }
            return value.toString().padStart(2, '0')
        })
    }


    function start() {//启动计时器函数
        processDeliver()
        if (interval != null) {//判断计时器是否为空
            clearInterval(interval);
            interval = null;
        }
        interval = setInterval(processDeliver, CONFIG.IntervalTimeOut);//启动计时器，调用overs函数，
    }

    function stop() {
        clearInterval(interval);
        interval = null;
    }

    /**
     * processDeliver 发货进程
     */
    function processDeliver() {
        console.log('发货进程', parseTime(new Date().getTime()))
        var h_now = new Date(), h_hour = h_now.getHours();
        // console.log('now', h_hour)
        // console.log(CONFIG.DeadlineHour, typeof CONFIG.DeadlineHour)
        if (h_hour >= CONFIG.DeadlineHour) {
            // 【停止自动直接发货】当前时间大于等于截止时期
            alert(`${CONFIG.DeadlineHour} 点后不能进行自动发货操作！`)
            offAuto()
            return false
        }

        // 触发【搜索】查询方法
        typeof (Search) === 'function' && Search()
        setTimeout(() => {
            getDeliveryNo()
            setTimeout(() => {
                toDeliverGoods()
            }, 500)
            i++;
        }, 500)
    }

    /**
     * 生成按钮 Dom
     */
    function createButton() {
        $("head").append('<style type="text/css">     #shell-button {\n' +
            '        position: relative;\n' +
            '        font-size: 12px;\n' +
            '        font-weight: 700;\n' +
            '        min-height: 12px;\n' +
            '        overflow: hidden;\n' +
            '        display: flex;\n' +
            '        align-items: center;\n' +
            '        text-transform: uppercase;\n' +
            '        border-radius: 100px;\n' +
            '        padding: 12px 20px 8px;\n' +
            '        transition: all .15s ease, transform .2s ease-in-out;\n' +
            '        color: #fff;\n' +
            '        border-color: #959595;\n' +
            '        background-color: #959595;\n' +
            '        cursor: pointer;\n' +
            '        z-index: 1000;\n' +
            '        justify-content: center;\n' +
            '    }\n' +
            '\n' +
            '    .shell-button-text {\n' +
            '        position: relative;\n' +
            '        width: 100px;\n' +
            '        z-index: 1002;\n' +
            '        text-align: center;\n' +
            '    }\n' +
            '\n' +
            '    .shell-button-gradual {\n' +
            '        position: absolute;\n' +
            '        top: 0;\n' +
            '        bottom: 0;\n' +
            '        left: 0;\n' +
            '        right: 0;\n' +
            '        width: 0;\n' +
            '        height: 0;\n' +
            '        content: " ";\n' +
            '        display: block;\n' +
            '        background: -webkit-radial-gradient(center, ellipse cover, #402bf2 0, #f6174e 50%);\n' +
            '        transition: width .4s ease-in-out, height .4s ease-in-out;\n' +
            '        transform: translate(-50%, -50%); /*关键*/\n' +
            '        border-radius: 50%;\n' +
            '        z-index: 1001;\n' +
            '    }\n' +
            '\n' +
            '    #shell-button:hover .shell-button-gradual {\n' +
            '        width: 225%;\n' +
            '        height: 810px;\n' +
            '    }</style>');

        $("body").append('<div style="position: absolute;bottom:40px;right:40px">\n' +
            '    <div id="shell-button" flag="off">\n' +
            '        <div id="shell-button-text" class="shell-button-text">已关闭自动发货</div>\n' +
            '        <div class="shell-button-gradual"></div>\n' +
            '    </div>\n' +
            '</div>')
    }

    function offAuto() {
        var domButton = $('#shell-button')
        domButton.attr('flag', 'off')
        domButton.css('border-color', '#959595')
        domButton.css('background-color', '#959595')
        $('#shell-button-text').text('已关闭自动发货')
        stop()
    }


    function onAuto() {
        var domButton = $('#shell-button')
        domButton.attr('flag', 'on')
        domButton.css('border-color', '#fe1251')
        domButton.css('background-color', '#fe1251')
        $('#shell-button-text').text('已开启自动发货')
        start()
    }

    /**
     * 按钮拖拽 && 单击事件
     */
    function move() {
        var dv = document.getElementById('shell-button');
        var x = 0;
        var y = 0;
        var l = 0;
        var t = 0;
        var isDown = false;
        $('#shell-button').on('mousedown', function (e) { //鼠标按下
            x = e.clientX;
            y = e.clientY;
            l = dv.offsetLeft;
            t = dv.offsetTop;
            //开关打开
            isDown = true;
            //设置样式
            dv.style.cursor = 'pointer';
            // 判断一下这个按下是点击还是拖动
            var isClick = true;
            $(document).on('mousemove', (e) => {//鼠标移动
                dv.style.cursor = 'pointer';
                if (isDown == false) {
                    return;
                }
                //获取x和y
                var nx = e.clientX;
                var ny = e.clientY;
                //计算移动后的左偏移量和顶部的偏移量
                var nl = nx - (x - l);
                var nt = ny - (y - t);
                isClick = false
                dv.style.left = nl + 'px';
                dv.style.top = nt + 'px';
            })
            $(document).on('mouseup', (e) => {//鼠标抬起
                //当isClick为true时，就执行点击事件
                if (isClick) {
                    manualClick()
                }
                isDown = false;
                dv.style.cursor = 'pointer';
                $(document).off('mousemove mouseup')//移除鼠标移动、鼠标抬起事件
            })
        })

        function manualClick() {
            console.log("终于进来了2121");
            var domButton = $('#shell-button')
            if (domButton.attr('flag') === 'on') {
                offAuto()
            } else {
                onAuto()
            }
        }
    }

    /**
     * 判断是打单拣货才执行
     */
    if (window.location.href.indexOf(CONFIG.HREF) !== -1) {
        console.warn('window location', window.location)
        createButton()
        move()

        if (CONFIG.IsOn) {
            // 默认开启
            onAuto()
        }
    }
})()
