// ==UserScript==
// @name         52pojie 吾爱破解功能增强
// @description  功能：1. 筛选最近的帖子 2. 回复数/点击数升降序显示 3. 点击过的帖子显隐 4. 默认排序（不排序）菜单项
// @author       cjcchester
// @namespace    cjcchester.com
// @match        https://www.52pojie.cn/*
// @version      1.0.0
// @require      https://cdn.staticfile.org/jquery/1.12.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/479011/52pojie%20%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/479011/52pojie%20%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    // 设置信息对象
    const settings = {
        hoursCount: GM_getValue('hours_count', 24),
        clickHide: GM_getValue('click_hide', false),
        sortOrder: GM_getValue('sort_order', 'default'),
        layLoad: GM_getValue('lay_load', false),
    };

    // 获取当前时间
    const nowTime = new Date();
    // 计算时间范围（毫秒）
    const hideSpace = settings.hoursCount * 60 * 60 * 1000;

    // 使用jQuery的noConflict模式，以避免冲突
    const $ = jQuery.noConflict();

    // 处理链接点击事件
    function onLinkClick(event) {
        const id = event.currentTarget.id;
        localStorage.setItem(id, 1); // 标记链接被点击

        if (settings.clickHide) {
            $(event.currentTarget).hide();
        }
    }

    // 在排序后重新设置序号
    function renumberList() {
        let counter = 0;
        $('.bm_c table tbody:visible').each(function () {
            counter++;
            $(this).find('td:first').text(counter);
        });
    }

    // 处理公共样式
    function commonDeal() {
        // 添加自定义CSS样式
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = `
            .tl table { table-layout: auto }
        `;
        const head = document.querySelector('head');
        head.appendChild(style);

        // 隐藏部分页面元素 免责声明、版权声明
        $('.bm_c.cl.pbn, .res-footer-note, .wp.vw50_kfc_f, #ft').hide();
    }

    // 处理帖子详情页的元素
    function detailDeal() {
        // 移除每个回答中的吾爱提示、图片；发布回复的吾爱头像、吾爱提示
        $('.vw50_kfc_pb, .sign, .avatar.avtm, .ptm.pnpost span, .vw50_kfc_pt').remove();
        // 只保留类名为姓名和个人信息
        $('.pls.cl.favatar').children().not('.pi, .pil.cl.credit-list').remove();
        // 只保留个人信息中吾爱币这一项
        $('.pil.cl.credit-list').children().not('.cr-ext2').remove();
        $('.t_fsz').css('min-height', 'auto');
        $('.pct').css('padding-bottom','0');
        $('#p_btn').css('padding','0 0 0 0')
    }

    var sequenceElementAdded = false

    function getColorForValue(num) {
        if (num >= 10) return '#FFEBEB';
        if (num >= 50) return '#FFCDCD';
        if (num >= 200) return '#FFAAAA';
        if (num >= 500) return '#FF8888';
        if (num >= 1000) return '#FF6666';
    }


    // 处理悬赏帖子列表的主要逻辑
    function listDeal() {
        let counter = 0; // 初始化序号计数器

        $('.bm_c table tbody').each(function () {
            const dateText = $('em span', this).text(); // 获取日期文本
            const createTime = Date.parse(new Date(dateText));
            const num = $('.num a', this).text();

            // 检查帖子的创建时间是否在时间范围内
            if ((nowTime - createTime) < hideSpace) {
                counter++; // 帖子在时间范围内，增加计数器
                // 根据帖子回复数量设置背景颜色
                const bgColor = getColorForValue(num)
                $(this).css('background', bgColor);
            } else {
                $(this).hide();
            }

            const id = this.id;
            if (id) {
                if (localStorage.getItem(id) > 0) {
                    $(this).hide();
                } else {
                    $(this).click(onLinkClick);
                }
            }

            if (!sequenceElementAdded) {
                // 如果还没有添加序号元素，创建并添加
                const sequenceElement = document.createElement('td');
                sequenceElement.style.padding = '0 10px';
                $('td.icn', this).before(sequenceElement);
                sequenceElementAdded = true;
            }
        });
        if (counter === 0) {
            createAutoCloseModal("帖子太旧了，全部都不在时间范围内，您可以调整时间或看其他页", 3000);
        }
    }

    function guideListDeal() {
        let counter = 0; // 初始化序号计数器

        $('#threadlist tbody').each(function () {
            const dateText = $('em span', this).text(); // 获取日期文本
            const createTime = Date.parse(new Date(dateText));
            const num = $('.num a', this).text();

            // 检查帖子的创建时间是否在时间范围内
            if ((nowTime - createTime) < hideSpace) {
                counter++; // 帖子在时间范围内，增加计数器
                // 根据帖子回复数量设置背景颜色
                const bgColor = getColorForValue(num)
                $(this).css('background', bgColor);
            } else {
                $(this).hide();
            }

            const id = this.id;
            if (id) {
                if (localStorage.getItem(id) > 0) {
                    $(this).hide();
                } else {
                    $(this).click(onLinkClick);
                }
            }

            if (!sequenceElementAdded) {
                // 如果还没有添加序号元素，创建并添加
                const sequenceElement = document.createElement('td');
                sequenceElement.style.padding = '0 10px';
                $('td.icn', this).before(sequenceElement);
                sequenceElementAdded = true;
            }
        });
        if (counter === 0) {
            createAutoCloseModal("帖子太旧了，全部都不在时间范围内，您可以调整时间或看其他页", 3000);
        }
    }

    function reSort(){
        if (settings.sortOrder === 'reply_asc' || settings.sortOrder === 'reply_desc') {
            // 按回复数升序或降序排列
            $('.bm_c table tbody').sort(function (a, b) {
                const replyA = parseInt($('.num a', a).text());
                const replyB = parseInt($('.num a', b).text());
                return settings.sortOrder === 'reply_asc' ? replyA - replyB : replyB - replyA;
            }).appendTo('.bm_c table');
        } else if (settings.sortOrder === 'click_asc' || settings.sortOrder === 'click_desc') {
            // 按点击数升序或降序排列
            $('.bm_c table tbody').sort(function (a, b) {
                const clickA = parseInt($('.num em', a).text());
                const clickB = parseInt($('.num em', b).text());
                return settings.sortOrder === 'click_asc' ? clickA - clickB : clickB - clickA;
            }).appendTo('.bm_c table');
        } else if (settings.sortOrder === '52coin') {
            // 按吾爱币降序排列
            $('.bm_c table tbody').sort(function (a, b) {
                // 防止已解决的解析失败 同时已解决放最后
                const clickA = parseInt($('.xi1 .xw1', a).text()) || 0;
                const clickB = parseInt($('.xi1 .xw1', b).text()) || 0;
                return clickB - clickA;
            }).appendTo('.bm_c table');
        }
        // 在排序后重新设置序号
        //if (settings.sortOrder !== 'default') {
        renumberList();
        //}
    }

    // 处理特定列表页面的逻辑
    function otherDeal() {
        // 悬赏列表页
        if (currentLink.includes("forumdisplay") || currentLink.includes("forum-")) {
            createTimeIn = 'em span';
            listDeal();
            reSort(); // 重排序
        }
        // 新帖列表页
        if(currentLink.includes("guide")){
            // createTimeIn = 'em span';
            guideListDeal();
            reSort(); // 重排序
        }
    }


    // 注册菜单选项
    GM_registerMenuCommand(`查看后帖子隐藏：${settings.clickHide}`, function () {
        settings.clickHide = !settings.clickHide;
        const message = settings.clickHide ? "已开启查看后帖子隐藏" : "已关闭查看后帖子隐藏";
        createAutoCloseModal(message, 3000);
        GM_setValue('click_hide', settings.clickHide);
        location.reload();
    });
    GM_registerMenuCommand(`自动加载（默认5s,加载5页）：${settings.layLoad}`, function () {
        settings.layLoad = !settings.layLoad;
        GM_setValue('lay_load', settings.layLoad);
        const message = settings.layLoad ? "已开启自动加载" : "已关闭自动加载";
        createAutoCloseModal(message, 3000);
        location.reload();
    });
    GM_registerMenuCommand(`设置帖子的时间范围：${settings.hoursCount}`, function () {
        const hours = prompt('请输入帖子的时间范围（小时）', settings.hoursCount);
        if (hours !== null) {
            settings.hoursCount = parseInt(hours);
            GM_setValue('hours_count', settings.hoursCount);
            let hideSpace = settings.hoursCount * 60 * 60 * 1000;
            createAutoCloseModal('已设置时间范围为' + settings.hoursCount + '小时内', 3000);
            location.reload();
        }
    });
    // 添加排序菜单选项
    GM_registerMenuCommand(`按回复数升序/降序排列`, function () {
        settings.sortOrder = settings.sortOrder === 'reply_asc' ? 'reply_desc' : 'reply_asc';
        GM_setValue('sort_order', settings.sortOrder);
        reSortAndFilterList()
        createAutoCloseModal("已切换 回复数 排序", 3000);
    });
    GM_registerMenuCommand(`按点击数升序/降序排列`, function () {
        settings.sortOrder = settings.sortOrder === 'click_asc' ? 'click_desc' : 'click_asc';
        GM_setValue('sort_order', settings.sortOrder);
        reSortAndFilterList()
        createAutoCloseModal("已切换 点击数 排序", 3000);
    });
    GM_registerMenuCommand(`按吾爱币降序排列`, function () {
        settings.sortOrder = '52coin';
        GM_setValue('sort_order', settings.sortOrder);
        reSortAndFilterList()
        createAutoCloseModal("已设为 吾爱币 降序", 3000);
    });
    GM_registerMenuCommand(`默认排序（不排序）`, function () {
        settings.sortOrder = 'default';
        GM_setValue('sort_order', settings.sortOrder);
        reSortAndFilterList()
        createAutoCloseModal("已设为 默认 排序", 3000);
    });


    let createTimeIn; // 创建时间定位元素地址
    const currentLink = window.location.href; // 当前页面地址

    // 自动加载
    function layLoad(){
        createAutoCloseModal("自动加载中，稍等……", 3000);
        // 记录开始时间
        const startTime = new Date().getTime();
        const intervalId = setInterval(function () {
            $('#autopbn').click();
            if (new Date().getTime() - startTime >= 3000) {
                clearInterval(intervalId); // 停止循环
            }
        }, 800);
        setTimeout(function () {
            otherDeal(); // 执行处理函数
            createAutoCloseModal("完成", 1000);
        }, 5000);
    }

    // 定义一个函数，用于重新排列和筛选列表
    function reSortAndFilterList() {
        // 重新排列列表
        reSort();
        // 筛选列表
        listDeal();
        // 重新设置序号
        renumberList();
    }


    // 主函数，调用所有处理逻辑
    function main() {
        // 通用样式处理
        commonDeal();
        // 帖子详情页
        if (currentLink.includes("viewthread") || currentLink.includes("thread-")) {
            detailDeal();
        }
        if (currentLink.includes("forumdisplay") || currentLink.includes("guide") || currentLink.includes("forum-")) {
            if (settings.layLoad) {
                layLoad();
            } else {
                otherDeal();
            }
        }
    }

    main(); // 调用主函数

    // 消息提示
    function createAutoCloseModal(message, timeout) {
        var modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.top = "50%";
        modal.style.left = "50%";
        modal.style.transform = "translate(-50%, -50%)";
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        modal.style.color = "white";
        modal.style.padding = "20px";
        modal.style.borderRadius = "5px";
        modal.style.zIndex = "1000";
        modal.innerText = message;
        document.body.appendChild(modal);

        setTimeout(function () {
            document.body.removeChild(modal);
        }, timeout);
    }

    // 在地址栏变化时重新执行脚本
    /*window.addEventListener('popstate', function (event) {
        main();
        //otherDeal();
    });*/

})();
