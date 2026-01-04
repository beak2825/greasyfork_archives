// ==UserScript==
// @name         打板客网股票代码复制插件
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  给dabanke股票表格添加复制按钮，复制股票代码到剪贴板
// @match        https://dabanke.com/*
// @grant        GM_setClipboard
// @icon         https://dabanke.com/favicon.ico
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544747/%E6%89%93%E6%9D%BF%E5%AE%A2%E7%BD%91%E8%82%A1%E7%A5%A8%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/544747/%E6%89%93%E6%9D%BF%E5%AE%A2%E7%BD%91%E8%82%A1%E7%A5%A8%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待表格加载（确保页面渲染完成）
    function waitForTable() {
        var flag1=localStorage.getItem("OnlySuccessLimitUpLocked");
        flag1 = (flag1 && 'true'==flag1)? true : false;
        var flag2=localStorage.getItem("ExcludeChiNextBoard");
        flag2 = (flag2 && 'true'==flag2)? true : false;

        addOnlySuccessLimitUpLockedButton(flag1);//涨停板封板的个股
        addExcludeChiNextBoardButton(flag2);//排除创业板科创板这两个有交易门槛的股票代码
        //-------------------------以上为股票代码复制中的个性化操作-----------------------
        const table = document.querySelector("table");
        if (table) {
            addCopyButtons(table);
            addGlobalCopyButton(table);
        } else {
            setTimeout(waitForTable, 500); // 如果未加载完成，继续等待
        }
    }
    //仅复制成功封板的个股代码
    function addOnlySuccessLimitUpLockedButton(flag){
        // 创建 label（用于包裹复选框和文字，点击文字也能勾选）
        const label = document.createElement('label');

        // 创建复选框
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = flag;
        checkbox.id='onlySuc';
        checkbox.addEventListener('change', () => {
            localStorage.setItem('OnlySuccessLimitUpLocked', checkbox.checked);
            // 刷新当前页面
            location.reload();
            //console.log('Checkbox 状态已保存:', checkbox.checked);
        });

        // 创建文字节点
        const text = document.createTextNode('onlySuc');

        // 组合元素
        label.appendChild(checkbox);
        label.appendChild(text);
        label.style.position = "fixed";
        label.style.bottom = "64px";
        label.style.right = "20px";
        label.style.zIndex = "9999";
        label.style.padding = "8px 12px";
        label.style.fontSize = "14px";
        label.style.border = "1px #000 solid";

        // 添加到 body（也可以换成指定容器）
        document.body.appendChild(label);
    }
    //排除创业板科创板等有交易权限的个股
    function addExcludeChiNextBoardButton(flag){
        // 创建 label（用于包裹复选框和文字，点击文字也能勾选）
        const label = document.createElement('label');

        // 创建复选框
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = flag;
        checkbox.id='excldChiNxtBord';
        checkbox.addEventListener('change', () => {
            localStorage.setItem('ExcludeChiNextBoard', checkbox.checked);
            // 刷新当前页面
            location.reload();
            //console.log('Checkbox 状态已保存:', checkbox.checked);
        });

        // 创建文字节点
        const text = document.createTextNode('Exclude');

        // 组合元素
        label.appendChild(checkbox);
        label.appendChild(text);
        label.style.position = "fixed";
        label.style.bottom = "108px";
        label.style.right = "20px";
        label.style.zIndex = "9999";
        label.style.padding = "8px 12px";
        label.style.fontSize = "14px";
        label.style.border = "1px #000 solid";

        // 添加到 body（也可以换成指定容器）
        document.body.appendChild(label);
    }
    //全局复制按钮，复制所有股票代码
    function addGlobalCopyButton(table) {
        //------------个性化复制 start----------------------
        var onlySuc = document.getElementById('onlySuc');
        onlySuc = onlySuc ? onlySuc.checked : false;
        var sucList = ['(成)','(败)','(炸)'];
        if(onlySuc){
            sucList=['(成)'];
        }
        var excldChiNxtBord= document.getElementById('excldChiNxtBord');
        excldChiNxtBord = excldChiNxtBord ? excldChiNxtBord.checked : false;
        var excldList = ['科','创','沪','深'];
        if(excldChiNxtBord){
            excldList=['沪','深'];
        }
        //------------个性化复制 end----------------------
        const button = document.createElement("button");
        button.textContent = "CopyAll";
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.zIndex = "9999";
        button.style.padding = "8px 12px";
        button.style.fontSize = "14px";
        button.style.cursor = "pointer";

        button.addEventListener("click", () => {
            //------------------invalided version 1.0---------------------
            //const links = table.querySelectorAll('a[href*="/gupiao-"]');
            //const allCodes = Array.from(links).map(link => {
            //    const href = link.getAttribute("href");
            //    const match = href.match(/gupiao-(\d+)\.html/);
            //    return match ? match[1] : null;
            //}).filter(code => code !== null);

            //---------------version 2.0------------------------
            const div_link_flag=table.querySelectorAll('div[class="col-12 col-md-6 col-lg-3 col-container mb-1"]');
            const allCodes = Array.from(div_link_flag).map(item => {
                var clazz = item.querySelector('span[class="d-inline-block industry-name text-width-20"]').innerText;
                //clazz = clazz.innerText;
                var succ = item.querySelector('span.industry-name.text-green, span.industry-name.text-red, span.industry-name:not(.text-width-20)').innerText;
                //succ = succ.innerText;
                const isExcluded = excldList.includes(clazz);
                const ss=sucList.includes(succ);
                if(!(ss && isExcluded)){
                    return null;
                }
                var link_href = item.querySelector('a[href*="/gupiao-"]').href;

                const match = link_href.match(/gupiao-(\d+)\.html/);
                return match ? match[1] : null;
            }).filter(code => code !== null);

            if (allCodes.length > 0) {
                const uniqueCodes = [...new Set(allCodes)];
                GM_setClipboard(uniqueCodes.join(" "));
                button.textContent = "CopiedAll";
                setTimeout(() => {
                    button.textContent = "CopyAll";
                }, 1500);
            } else {
                button.textContent = "None";
                setTimeout(() => {
                    button.textContent = "CopyAll";
                }, 1500);
            }
        });

        document.body.appendChild(button);
    }
    //针对N板个股进行X板的个股代码复制
    function addCopyButtons(table) {
        //------------个性化复制 start----------------------
        var onlySuc = document.getElementById('onlySuc');
        onlySuc = onlySuc ? onlySuc.checked : false;
        var sucList = ['(成)','(败)','(炸)'];
        if(onlySuc){
            sucList=['(成)'];
        }
        var excldChiNxtBord= document.getElementById('excldChiNxtBord');
        excldChiNxtBord = excldChiNxtBord ? excldChiNxtBord.checked : false;
        var excldList = ['科','创','沪','深'];
        if(excldChiNxtBord){
            excldList=['沪','深'];
        }
        //------------个性化复制 end----------------------
        const rows = table.querySelectorAll("tr");
        rows.forEach(row => {
            const tdList = row.querySelectorAll("td");

            // 确保是我们要处理的行（至少3列）
            if (tdList.length >= 3) {
                const thirdTd = tdList[2];
                //const links = thirdTd.querySelectorAll('a[href*="/gupiao-"]');
                const div_link_flag=thirdTd.querySelectorAll('div[class="col-12 col-md-6 col-lg-3 col-container mb-1"]');

                //---------------invalidate version 1.0 -----------------
                //const stockCodes = Array.from(links).map(link => {
                //    const href = link.getAttribute("href");
                //    const match = href.match(/gupiao-(\d+)\.html/);
                //    return match ? match[1] : null;
                //}).filter(code => code !== null);
                //---------------version 2.0------------------------
                const stockCodes = Array.from(div_link_flag).map(item => {
                    var clazz = item.querySelector('span[class="d-inline-block industry-name text-width-20"]').innerText;
                    //clazz = clazz.innerText;
                    var succ = item.querySelector('span.industry-name.text-green, span.industry-name.text-red, span.industry-name:not(.text-width-20)').innerText;
                    //succ = succ.innerText;
                    const isExcluded = excldList.includes(clazz);
                    const ss=sucList.includes(succ);
                    if(!(ss && isExcluded)){
                       return null;
                    }
                    var link_href = item.querySelector('a[href*="/gupiao-"]').href;

                    const match = link_href.match(/gupiao-(\d+)\.html/);
                    return match ? match[1] : null;
                }).filter(code => code !== null);

                if (stockCodes.length > 0) {
                    // 创建按钮
                    const button = document.createElement("button");
                    button.textContent = "Copy";
                    button.style.marginLeft = "5px";
                    button.style.cursor = "pointer";
                    button.style.fontSize = "12px";

                    // 绑定点击事件
                    button.addEventListener("click", () => {
                        GM_setClipboard(stockCodes);
                        button.textContent = "Copied";
                        setTimeout(() => {
                            button.textContent = "Copy";
                        }, 1000);
                    });

                    // 插入到第一列（tdList[0]）中
                    tdList[0].appendChild(button);
                }
            }
        });
    }

    waitForTable();
})();
