// ==UserScript==
// @name         末日動漫批量下载
// @namespace    https://greasyfork.org/zh-CN/scripts/502444
// @version      0.6.2
// @description 为末日動漫（share.acgnx.net）增加批量下载的功能
// @author       MD1304
// @match        *://share.acgnx.net/*
// @match        *://share.acgnx.se/*
// @match        *://share.acgnx.cc/*
// @icon         data:image/x-icon;base64,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
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      LGPLv3
// @require     https://update.greasyfork.org/scripts/12092/71384/jQuery%20JavaScript%20Library%20v142.js
// @downloadURL https://update.greasyfork.org/scripts/502444/%E6%9C%AB%E6%97%A5%E5%8B%95%E6%BC%AB%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/502444/%E6%9C%AB%E6%97%A5%E5%8B%95%E6%BC%AB%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    //添加自定义样式
    GM_addStyle(".list_style .l2 {width: 5%;}");
    GM_addStyle(".list_style .l5 {width: 5%;}");
    GM_addStyle(".list_style .l8 {width: 8%;}");
    //调整表格列
    var node = document.querySelector("#listTable > thead > tr");
    node.children[2].insertAdjacentHTML('beforebegin', node.children[4].outerHTML);
    node.children[2].innerHTML = "";
    for (let i = 1; i < document.querySelectorAll('#data_list tr').length+1; i++) {
        node = document.querySelector("#data_list > tr:nth-child("+String(i)+")");
        node.children[2].insertAdjacentHTML('beforebegin', node.children[4].outerHTML);
        node.children[2].children[0].children[0].title ="复制链接";
        node.children[2].children[0].children[0].style ="filter: hue-rotate(90deg)";
        node.children[2].querySelectorAll("#netdisk").forEach(element => element.remove());
    }
})();

//添加tracker
const tk="&tr=http%3A%2F%2F104.143.10.186%3A8000%2Fannounce&tr=udp%3A%2F%2F104.143.10.186%3A8000%2Fannounce&tr=http%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=http%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=http%3A%2F%2Fopen.acgtracker.com%3A1096%2Fannounce&tr=http%3A%2F%2Ftracker1.itzmx.com%3A8080%2Fannounce&tr=http%3A%2F%2Ftracker2.itzmx.com%3A6961%2Fannounce&tr=http%3A%2F%2Ftracker3.itzmx.com%3A6961%2Fannounce&tr=http%3A%2F%2Ftracker4.itzmx.com%3A2710%2Fannounce&tr=udp%3A%2F%2Ftracker1.itzmx.com%3A8080%2Fannounce&tr=udp%3A%2F%2Ftracker2.itzmx.com%3A6961%2Fannounce&tr=udp%3A%2F%2Ftracker3.itzmx.com%3A6961%2Fannounce&tr=udp%3A%2F%2Ftracker4.itzmx.com%3A2710%2Fannounce&tr=http%3A%2F%2Ft.nyaatracker.com%3A80%2Fannounce&tr=https%3A%2F%2Ftracker.nanoha.org%2Fannounce&tr=http%3A%2F%2Ft.acg.rip%3A6699%2Fannounce&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=https%3A%2F%2Ftr.bangumi.moe%3A9696%2Fannounce&tr=http%3A%2F%2Ftr.bangumi.moe%3A6969%2Fannounce";

function acgnx() {
    var that = this;
    this.init = function () {
        //复选框
        var tds = $('#data_list tr td:nth-child(3)');
        tds.each(function () {
            if ($(this).find('#magnet').attr('href') !=="./error-423.html") {
                $(this).append('<input type="checkbox" class="magnet"/>');
            }
        });
        $('.magnet:checkbox').click(function () {
            that.strMagnet();
            console.log("已选中 "+that.gatherMagnet().length+" 项");
        });
        //全选
        $('#listTable thead tr th:nth-child(3)').append('<input class="select-all" type="checkbox" style="margin-left: 3px;" title="全选"></a>');
        $('.select-all').click(function () {
            if ($('.magnet:checkbox').length !== $('.magnet:checkbox:checked').length) {
                $('.magnet:checkbox').attr('checked', true);
            } else {
                $('.magnet:checkbox').attr('checked', false);
            }
            that.strMagnet();
            console.log("已选中 "+that.gatherMagnet().length+" 项");
        });
        //复制当前
        $('td:nth-child(3) img').click(function (f) {
            f.preventDefault();
            GM_setClipboard(this.parentNode.getAttribute("href")+tk+"\r\n");
            console.log("已复制 当前 项");
            toast("已复制当前条目链接");
        });
        //复制所选
        $('div.box.clear div.left').prepend('<a class="download-all" style="color:green;margin-left: 10px;">复制所选链接至剪贴板<img src="./images/download_1.gif" title="复制所选" style="filter: hue-rotate(90deg); margin-left: 16px;"></img></a>　');
        $('div.box.clear span.text_bold').prepend('<a class="download-all" style="color:green;margin-left: 10px;">复制所选链接至剪贴板<img src="./images/download_1.gif" title="复制所选" style="filter: hue-rotate(90deg); margin-left: 16px;"></img></a>　');
        $('#listTable thead tr th:nth-child(3)').prepend('<img class="download-all" src="./images/download_1.gif" title="复制所选" style="filter: hue-rotate(90deg);">&nbsp;</img>');
        $('.download-all').click(function (e) {
            e.preventDefault();
            if (that.gatherMagnet().length == 0) {
                toast("未选中任何条目");
                return;
            }
            GM_setClipboard(that.strMagnet()+"\r\n");
            console.log("已复制 "+that.gatherMagnet().length+" 项");
            toast("已复制　"+that.gatherMagnet().length+" 项　选中条目链接");
        });
    };
    //收集磁力链接
    this.gatherMagnet = function () {
        var magnets = [];
        $('input.magnet:checkbox:checked').each(function () {
            var magnetStr = $(this).parents('tr').find('#magnet').attr('href');
            if (magnetStr !== "./error-423.html") {magnets.push(magnetStr);}
        });
        return magnets;
    };
    //格式化磁力链接字符串
    this.strMagnet = function () {
        var str = this.gatherMagnet().join(tk+"\r\n");
        $('.download-all').attr('href', str);
        return str;
    };
    //弹出提示框
    function toast(msg) {
        var toastSpan = document.createElement("span");
        toastSpan.style.top = "45%";
        toastSpan.style.left = "50%";
        toastSpan.style.color = "#fff";
        toastSpan.style.position = "fixed";
        toastSpan.style.borderRadius = "4px";
        toastSpan.style.padding = "8px 16px";
        toastSpan.style.background = "rgba(0,0,0,0.6)";
        toastSpan.style.transform = "translate(-50%, -50%)";
        toastSpan.style.transition = "opacity .3s";
        toastSpan.style.opacity = "1";
        toastSpan.innerText = msg;
        document.body.appendChild(toastSpan);
        setTimeout(function () {
            toastSpan.style.opacity = "0";
            setTimeout(function () {
                toastSpan.remove(toastSpan);
            }, 300);
        }, 1500);
    }

    // 悬浮按钮容器样式
    const style = document.createElement('style');
    style.textContent = `
    #float-btns {
        position: fixed;
        left: 15px;
        top: 55%;
        transform: translateY(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .float-btn {
        width: 20px;
        height: 20px;
        border-radius: 40%;
        border: 2px solid #247;
        background: #fff;
        color: #247;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.3s;
        font-size: 20px;
        position: relative;
    }
    .float-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
    .tooltip {
        position: absolute;
        left: 40px;
        white-space: nowrap;
        background: #333;
        color: #fff;
        padding: 5px 10px;
        border-radius: 4px;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
        font-size: 10px;
    }
    .float-btn:hover .tooltip {
        opacity: 1;
    }
    `;

    // 创建按钮容器
    const btnContainer = document.createElement('div');
    btnContainer.id = 'float-btns';

    // 按钮功能实现
    const buttons = [
        {
            icon: '⎘',
            text: '复制所选',
            action: () => {
                const selected = document.querySelectorAll('.magnet:checked');
                if(selected.length === 0) {
                    toast("未选中任何条目");
                    return;
                }
                const links = Array.from(selected).map(checkbox =>
                    checkbox.closest('tr').querySelector('a#magnet').href
                ).join(tk+'\n')+tk;
                navigator.clipboard.writeText(links);
                toast("已复制　"+that.gatherMagnet().length+" 项　选中条目链接");
            }
        },
        {
            icon: '👁',
            text: '隐藏未选中',
            action: () => {
                $('input.magnet:checkbox:not(:checked)').closest('tr').toggle();
                toast("已切换未选中条目的显示状态");
            }
        },
        {
            icon: '╳',
            text: '清除所选',
            action: () => {
                document.querySelectorAll('.magnet').forEach(checkbox => {
                    checkbox.checked = false;
                });
                document.querySelector('.select-all').checked = false;
                toast("已清除所有选择");
            }
        }
    ];

    // 动态生成按钮
    buttons.forEach(btn => {
        const button = document.createElement('div');
        button.className = 'float-btn';
        button.innerHTML = `${btn.icon}<span class="tooltip">${btn.text}</span>`;
        button.onclick = btn.action;
        btnContainer.appendChild(button);
    });

    // 添加到页面
    document.head.appendChild(style);
    document.body.appendChild(btnContainer);
}
new acgnx().init();