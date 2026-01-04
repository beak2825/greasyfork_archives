// ==UserScript==
// @name         快手磁力金牛助手
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  try to take over the world!
// @author       Newwbbie
// @match        https://niu.e.kuaishou.com/manage*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kuaishou.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463099/%E5%BF%AB%E6%89%8B%E7%A3%81%E5%8A%9B%E9%87%91%E7%89%9B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/463099/%E5%BF%AB%E6%89%8B%E7%A3%81%E5%8A%9B%E9%87%91%E7%89%9B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    if (!checkMM()) {
        const class_overlay = 'z-index:999999;position: fixed;top: 0;left: 0;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.8);display: flex;justify-content: center;align-items: center;'
        const class_modal = 'background-color: white;width: 400px;padding: 20px;text-align: center;border-radius: 5px;'
        const class_input = 'padding: 10px;border-radius: 5px;border: none;margin-bottom: 10px;'
        const class_btn = '  padding: 10px;border-radius: 5px;border: none;background-color: #1E90FF;color: white;font-size: 16px;cursor: pointer;'
        $("body").append(`<div style="${class_overlay}"><div style="${class_modal}"><h2>请输入秘钥:</h2><input type="text" id="secret-key" style="${class_input}"><button id="confirm-btn" style="${class_btn}">确定</button></div></div>`);

        const confirmBtn = document.querySelector('#confirm-btn');

        confirmBtn.addEventListener('click', () => {
            const secretKey = document.querySelector('#secret-key').value;
            // 处理秘钥输入
            if (secretKey == 'aMgXfHF.4k.VBH4') {
                localStorage.setItem('mm', 'aMgXfHF.4k.VBH4')
                location.reload()
            }
        });
        return;
    }
    let url = window.location.href;
    let page_no = '';
    let interval;
    let i0, i1, i2, i3, i4, i5;
    let chk_value = [];
    // 设置分页为200
    localStorage.setItem('esp-manage-table-pagination-pagesize', 200);
    localStorage.setItem('MANAGE_APPEAL_SUB_KEY', 17);

    let ready = setInterval(function () {
        if ($('.ant-tabs-tab.ant-tabs-tab-active').length > 0) {
            clearInterval(ready);
            initPageNo();
            initInterval();
        }
    }, 100);

    function init(url) {
        if (url.includes('promotionType=96&searchLevel=2')) {
            page_no = '经营版 广告计划'
            createGUI(page_no, 5)
        } else if (url.includes('promotionType=96&searchLevel=3')) {
            page_no = '经营版 广告创意'
            createGUI(page_no)
        } else if (url.includes('promotionType=2&searchLevel=1')) {
            page_no = '专业版 广告计划'
            createGUI(page_no)
        } else if (url.includes('promotionType=2&searchLevel=2')) {
            page_no = '专业版 广告组'
            createGUI(page_no, 5)
        } else if (url.includes('promotionType=2&searchLevel=3')) {
            page_no = '专业版 广告创意'
            createGUI(page_no)
        } else if (url.includes('promotionType=96')) {
            page_no = '经营版 广告计划'
            createGUI(page_no, 5)
        } else if (url.includes('promotionType=2')) {
            page_no = '专业版 广告计划'
            createGUI(page_no)
        }
        initInterval();
    }
    
    // 监听页面大类变化
    function initPageNo() {
        let first = $('.index-module__typeActive___2_BX4').text();
        let second = $('.ant-tabs-tab.ant-tabs-tab-active').text();
        page_no = first + ' ' + second;
        $('#newwbbie').remove();
        if (page_no == '专业版 广告组' || page_no == '经营版 广告计划') {
            createGUI(page_no, 5);
        } else {
            createGUI(page_no);
        }
    }

    function createGUI(text, type = 0) {
        let html = []
        html.push(`<div id='newwbbie' draggable="true" style='left: 5px;bottom: 5px;background: #eee;z-index: 9999;position: fixed;border-radius: 4px;padding: 10px;box-shadow: 0px 0px 10px 5px rgb(25 25 25 / 20%);'>`)
        html.push(`<div style='font-size: 14px; margin-bottom: 10px;'>当前监听页面：<span id='s0' style='color: red;'>${text}</span></div>`)
        html.push(`<div style='margin-bottom: 10px;'>刷新间隔：<input id='i0' type='number' style='width: 30px;height: 16px;margin: 0 4px;'/>秒</div>`)
        html.push(`<div style='display: flex; flex-direction: column;'>`)
        html.push(`<label><input name="gg" type="checkbox" value="1" />1. 平均花费<input id='i1' type='number' style='width: 30px;'/>出一单否则关闭满足开启</label>`)
        html.push(`<label><input name="gg" type="checkbox" value="2" />2. 当日roi低于<input id='i2' type='number' style='width: 30px;'/>关闭否则开启</label>`)
        html.push(`<label><input name="gg" type="checkbox" value="3" />3. 当日转化达高于<input id='i3' type='number' style='width: 30px;'/>关闭否则开启</label>`)
        html.push(`<label><input name="gg" type="checkbox" value="4" />4. 当日花费<input id='i4' type='number' style='width: 30px;'/>没出单即关闭</label>`)
        if (type == 5) {
            html.push(`<label><input name="gg" type="checkbox" value="5" />5. 当日花费大于预算一半自动扩预算<input id='i5' type='number' style='width: 30px;'/>倍</label>`)
        }
        html.push(`<label style="color: red; display: flex;">当前执行的功能：<div id="d0"></div></label>`)
        html.push(`<button type='button' id='b0'>保存并执行</button>`)
        html.push(`<button type='button' id='b1'>清空当前页面缓存</button>`)
        html.push(`</div>`)
        html.push(`</div>`)
        $("body").append(html.join(''));

        $('#newwbbie label').css('margin-bottom', '8px')
        $('#newwbbie label input:nth-child(2)').css('height', '16px').css('margin', '0 4px')
        $('#newwbbie button').css('margin-bottom', '8px')
        // 拖拽
        var myDiv = document.getElementById("newwbbie");
        var isDragging = false;
        var mouseOffset = { x: 0, y: 0 };

        myDiv.addEventListener("mousedown", function(event) {
            isDragging = true;
            mouseOffset.x = event.clientX - myDiv.offsetLeft;
            mouseOffset.y = event.clientY - myDiv.offsetTop;
        });

        document.addEventListener("mousemove", function(event) {
        if (isDragging) {
            myDiv.style.left = (event.clientX - mouseOffset.x) + "px";
            myDiv.style.top = (event.clientY - mouseOffset.y) + "px";
        }
        });

        document.addEventListener("mouseup", function() {
            isDragging = false;
        });

        // 填字
        i0 = localStorage.getItem(text + '_i0');
        if (i0 == null || i0 == '') {
            localStorage.setItem(text + '_i0', '10');
            $('#i0').val('10');
        } else {
            $('#i0').val(i0);
        }
        interval = $('#i0').val() != '' ? $('#i0').val() * 1000 : 3000;
        i1 = localStorage.getItem(text + '_i1')
        if (i1 != null && i1 != '') {
            $('#i1').val(i1);
        }
        i2 = localStorage.getItem(text + '_i2')
        if (i2 != null && i2 != '') {
            $('#i2').val(i2);
        }
        i3 = localStorage.getItem(text + '_i3')
        if (i3 != null && i3 != '') {
            $('#i3').val(i3);
        }
        i4 = localStorage.getItem(text + '_i4')
        if (i4 != null && i4 != '') {
            $('#i4').val(i4);
        }
        i5 = localStorage.getItem(text + '_i5')
        if (i5 != null && i5 != '') {
            $('#i5').val(i5);
        }
        // 打钩
        chk_value = localStorage.getItem(page_no)
        if (chk_value != null && chk_value != '') {
            chk_value.split(',').forEach(item => {
                $('input[name="gg"]')[--item].checked = true
            });
        }

        $('#b0').click(e => {
            chk_value = [];
            $('input[name="gg"]:checked').each(function () {
                let value = $(this).val();
                if ($('#i' + value).val() != '') {
                    chk_value.push(value);
                }
            });
            console.log(chk_value);
            localStorage.setItem(text + '_i0', $('#i0').val());
            localStorage.setItem(text + '_i1', $('#i1').val());
            localStorage.setItem(text + '_i2', $('#i2').val());
            localStorage.setItem(text + '_i3', $('#i3').val());
            localStorage.setItem(text + '_i4', $('#i4').val());
            localStorage.setItem(text + '_i5', $('#i5').val());
            localStorage.setItem(page_no, chk_value);
            alert('当前配置已保存！')
            localStorage.removeItem('list_' + page_no);
            alert(page_no + '的表格缓存已清空！')
            location.reload();
        });
        $('#b1').click(e => {
            localStorage.removeItem('list_' + page_no);
            alert(page_no + '的表格缓存已清空！')
        });
    }

    function initInterval() {
        let ready = setInterval(function () {
            if ($('.ant-table-row').length > 0) {
                clearInterval(ready);
                // 花费降序排列
                for (var i = 0; i < $('.title').length; ++i) {
                    const item = $('.title')[i]
                    if (item.textContent == '花费') {
                        item.click()
                        break
                    }
                }

                setInterval(function () {
                    // 加载完毕，开始执行监听
                    // 监听页面大类变化
                    // initPageNo();
                    // 监听数据表里的信息
                    let list = []
                    let btn_i = 2, cost_i = 0, roi_i = 0, zhcb_i = 0, ljdd_i = 0, jrys_i = 0;
                    let headerDom = $('.ant-table-thead th');
                    for (let i = 0; i < headerDom.length; ++i) {
                        let index = Number(i) + 1;
                        let header = $('.ant-table-thead th:nth-child(' + index + ')').text();
                        if (header == '花费') {
                            cost_i = index;
                        } else if (header == '直接ROI') {
                            roi_i = index;
                        } else if (header == '转化成本') {
                            zhcb_i = index;
                        } else if (header == '当日累计订单数') {
                            ljdd_i = index;
                        } else if (header == '今日预算') {
                            jrys_i = index;
                        }
                    }
                    for (let i = 1; i < $('.ant-table-row.ant-table-row-level-0').length; ++i) {
                        let css_row = `.ant-table-row.ant-table-row-level-0:nth-child(${i + 2})`
                        let btn_classname = $(`${css_row}>td:nth-child(${btn_i}) button`).attr('class');
                        let info = {
                            'btn': btn_classname.includes('checked') ? true : false,
                            'name': $(`${css_row}>td:nth-child(3) .c-label-edit`).text(),
                            'cost': $(`${css_row}>td:nth-child(${cost_i})`).text(),
                            'roi': $(`${css_row}>td:nth-child(${roi_i})`).text(),
                            'zhcb': $(`${css_row}>td:nth-child(${zhcb_i})`).text(),
                            'ljdd': $(`${css_row}>td:nth-child(${ljdd_i})`).text(),
                            'now': new Date().getTime(),
                            'ignore': false
                        };
                        if (jrys_i > 0) {
                            info['jrys'] = $(`${css_row}>td:nth-child(${jrys_i})`).text();
                        }
                        list.push(info);
                    }
                    console.log(list)
                    var oldList = JSON.parse(localStorage.getItem("list_" + page_no));
                    if (oldList == null) {
                        oldList = list;
                        // 保存当前商品初始值
                        localStorage.setItem('init_list', list)
                    } else {
                        // 如果开启功能1，需要和历史数据比较
                        if (i1 != null && i1 != '') {
                            for (let n of list) {
                                for (let old of oldList) {
                                    if (n.name == old.name) {
                                        old.costInterval = parseFloat(n.cost) - parseFloat(old.cost) - (parseInt(n.ljdd) - parseInt(old.ljdd)) * i1
                                        break;
                                    }
                                }
                            }
                        }
                        // 将新数据刷到oldList中
                        oldList = mergeList(oldList, list);
                    }
                    localStorage.setItem("list_" + page_no, JSON.stringify(oldList));
                }, interval);

                doMain(chk_value, interval);
            }
        }, 100);
    }

    function mergeList(oldList, list) {
        for (let i = 0; i < list.length; i++) {
            let found = false;
            for (let j = 0; j < oldList.length; j++) {
                if (list[i].name === oldList[j].name) {
                    if (list[i].btn != oldList[j].btn) {
                        oldList[j].ignore = true;
                    }
                    oldList[j] = list[i];
                    found = true;
                    break;
                }
            }
            if (!found) {
                oldList.push(list[i]);
                // 添加初始list
                let l = localStorage.getItem('init_list');
                l.push(list[i]);
                localStorage.setItem('init_list', l)
            }
        }
        return oldList;
    }


    function doMain(chk_value, interval) {
        if (chk_value == null) {
            alert('助手提醒：请勾选面板功能，并按保存按钮。')
            return;
        }
        $('#d0').html(chk_value)
        setInterval(async function () {
            i1 = $('#i1').val();
            i2 = $('#i2').val();
            i3 = $('#i3').val();
            i4 = $('#i4').val();
            i5 = $('#i5').val();
            var list = JSON.parse(localStorage.getItem("list_" + page_no));
            if (list == null) {
                return;
            }
            for (let item of list) {
                if (item.ignore) {
                    console.log(item.name + '已忽略')
                    continue;
                }
                let dom = $(`.ant-table-row .c-label-edit > span.clickable`)
                for (let d in dom) {
                    if (dom[d].textContent == item.name) {
                        if (item.ignore) break;
                        let open = 0, close = 0;
                        if (chk_value.indexOf('1') >= 0 && i1 != null && i1 != '' && item.costInterval) {
                            if (parseFloat(item.costInterval) > parseFloat(i1)) {
                                close = 1;
                            } else {
                                open = 1;
                            }
                        }
                        if (chk_value.indexOf('2') >= 0 && i2 != null && i2 != '') {
                            if (parseFloat(item.roi) < parseFloat(i2) && parseFloat(item.roi) > 0) {
                                close = 1;
                            } else {
                                open = 1;
                            }
                        }
                        if (chk_value.indexOf('3') >= 0 && i3 != null && i3 != '') {
                            if (parseFloat(item.zhcb) > parseFloat(i3) && parseFloat(item.zhcb) > 0) {
                                close = 1;
                            } else {
                                open = 1;
                            }
                        }
                        if (chk_value.indexOf('4') >= 0 && i4 != null && i4 != '') {
                            let more = parseFloat(item.cost) > parseFloat(i4)
                            if (more && parseFloat(item.ljdd) == 0) {
                                close = 1;
                            } else {
                                open = 1;
                            }
                        }
                        if (chk_value.indexOf('5') >= 0 && i5 != null && i5 != '') {
                            let juysDom = $('.ant-table-row-level-0 .c-label-click')[d];
                            if (juysDom.textContent != '不限') {
                                let jrys = parseFloat(juysDom.textContent.replace(',', ''));
                                if (jrys < parseFloat(item.cost) * 2) {
                                    juysDom.click();
                                    await sleep(500);
                                    $(".ad-form-col-21 label:nth-child(6) > span.ant-radio-button").click();
                                    await sleep(500);
                                    document.querySelector(".ad-form-col-21 > div > div > span > input").value = jrys * parseFloat(i5);
                                    await sleep(500);
                                    document.querySelector("div.ant-modal-footer > button.ant-btn.ant-btn-primary").click();
                                    await sleep(500);
                                }
                            }
                        }
                        if ((open == 1 && !item.btn) || (open == 0 && close == 1 && item.btn)) {
                            $('.ant-table-row .ant-table-cell-fix-left:nth-child(2) > button')[d].click()
                            console.log('点击：' + item.name);
                        }
                        break;
                    }
                }
            }
        }, interval);
    }

    function checkMM() {
        let m = localStorage.getItem('mm')
        if (m == 'aMgXfHF.4k.VBH4') {
            return true;
        } else {
            return false;
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

})();