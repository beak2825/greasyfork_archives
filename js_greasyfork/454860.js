// ==UserScript==
// @name         快麦筛选地址辅助
// @namespace    superboss.cc
// @version      1.0.0
// @description  快麦筛选地址辅助函数
// @author       via
// @match        https://*.superboss.cc/*
// @icon         https://erpa.superboss.cc/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      luckiest.live
// @connect      127.0.0.1
// @license MIT
// ==/UserScript==

'use strict';

function setClipboard(msg) {
    GM_setClipboard(msg);
    alert("信息已复制到剪贴板，直接粘贴即可");
}

function addMask(className) {
    let pw = document.createElement("div");
    pw.style.cssText = "background-color:blue;opacity:0.3;position:absolute;width:100%;height:100%;left:0px;top:0px;text-align:center;font-size:200px;"
    pw.innerText = "请稍等...";
    return document.getElementsByClassName(className)[0].appendChild(pw);
}

// 获取所有省市区
function getAllCity() {
    function getChinaCity() {
        let city = "";
        // 获取省份区域
        let shengs = document.getElementsByClassName("province-list")[0].getElementsByClassName("addressWrap");
        // 遍历省份区域
        let lenSheng = shengs.length;
        for (let se = 0; se < lenSheng; se++) {
            let sheng = shengs[se];
            // 点击省份，显示市
            sheng.click();
            // 获取市区域
            let shis = document.getElementsByClassName("city-list")[0].getElementsByClassName("addressWrap");
            // 遍历市区域
            let lenShi = shis.length;
            for (let si = 0; si < lenShi; si++) {
                let shi = shis[si];
                // 点击市，显示区
                shi.click()
                let qus = document.getElementsByClassName("district-list")[0].getElementsByClassName("addressWrap");
                let lenQu = qus.length;
                if (lenQu === 0) {
                    city += `${sheng.innerText}\t${shi.innerText}\t其它区\n`;
                } else {
                    for (let qi = 0; qi < lenQu; qi++) {
                        let qu = qus[qi];
                        city += `${sheng.innerText}\t${shi.innerText}\t${qu.innerText}\n`;
                    }
                }
            }
        }
        setClipboard(city);
    }
    if (!confirm("获取全国所有省市区？")) {
        alert("终止任务！");
        return;
    }
    let field = document.getElementsByClassName('field-area area-info-field clearfix');
    if (field.length === 0) {
        alert("请打开快麦ERP筛选设置窗口");
        return;
    }
    let mask = addMask("rc-kmui-com-dlg");
    // 延时执行，否则遮罩不显示
    setTimeout(function () {
        getChinaCity();
        mask.remove();
    }, 500);
}

// 获取未勾选地区
function getNotSelectCity() {

    function getCity() {
        let city = "";
        // 获取省份区域
        let shengs = document.getElementsByClassName("province-list")[0].getElementsByClassName("addressWrap");
        // 遍历省份区域
        let lenSheng = shengs.length;
        for (let se = 0; se < lenSheng; se++) {
            let sheng = shengs[se];
            // 点击省份，显示市
            sheng.click();
            // 获取市区域
            let shis = document.getElementsByClassName("city-list")[0].getElementsByClassName("addressWrap");
            // 遍历市区域
            let lenShi = shis.length;
            for (let si = 0; si < lenShi; si++) {
                let shi = shis[si];
                // 点击市，显示区
                shi.click()
                let qus = document.getElementsByClassName("district-list")[0].getElementsByClassName("addressWrap");
                let lenQu = qus.length;
                if (lenQu === 0) {
                    if (!shi.getElementsByClassName("J_Checkbox region-city")[0].checked) {
                        city += `${sheng.innerText}\t${shi.innerText}\t其它区\n`;
                    }
                } else {
                    for (let qi = 0; qi < lenQu; qi++) {
                        let qu = qus[qi];
                        if (!qu.getElementsByClassName("J_Checkbox region-district")[0].checked) {
                            city += `${sheng.innerText}\t${shi.innerText}\t${qu.innerText}\n`;
                        }
                    }
                }
            }
        }
        setClipboard(city);
    }
    if (!confirm("获取未选择的区域？")) {
        alert("终止任务！");
        return;
    }
    //alert("请等待提取，不要操作当前页面，结果会出现在小弹窗");
    let field = document.getElementsByClassName('field-area area-info-field clearfix');
    if (field.length === 0) {
        alert("请打开快麦ERP筛选设置窗口");
        return;
    }
    let mask = addMask("rc-kmui-com-dlg");
    setTimeout(function () {
        getCity();
        mask.remove();
    }, 500);
}

// 获取已勾选地区
function getSelectCity() {

    function getCity() {
        let city = "";
        // 获取省份区域
        let shengs = document.getElementsByClassName("province-list")[0].getElementsByClassName("addressWrap");
        // 遍历省份区域
        let lenSheng = shengs.length;
        for (let se = 0; se < lenSheng; se++) {
            let sheng = shengs[se];
            // 点击省份，显示市
            sheng.click();
            // 获取市区域
            let shis = document.getElementsByClassName("city-list")[0].getElementsByClassName("addressWrap");
            // 遍历市区域
            let lenShi = shis.length;
            for (let si = 0; si < lenShi; si++) {
                let shi = shis[si];
                // 点击市，显示区
                shi.click()
                let qus = document.getElementsByClassName("district-list")[0].getElementsByClassName("addressWrap");
                let lenQu = qus.length;
                if (lenQu === 0) {
                    if (shi.getElementsByClassName("J_Checkbox region-city")[0].checked) {
                        city += `${sheng.innerText}\t${shi.innerText}\t其它区\n`;
                    }
                } else {
                    for (let qi = 0; qi < lenQu; qi++) {
                        let qu = qus[qi];
                        if (qu.getElementsByClassName("J_Checkbox region-district")[0].checked) {
                            city += `${sheng.innerText}\t${shi.innerText}\t${qu.innerText}\n`;
                        }
                    }
                }
            }
        }
        setClipboard(city);
    }

    if (!confirm("获取已经选中的城市？")) {
        alert("终止任务！");
        return;
    }
    let field = document.getElementsByClassName('field-area area-info-field clearfix');
    if (field.length === 0) {
        alert("请打开快麦ERP筛选设置窗口");
    }
    let mask = addMask("rc-kmui-com-dlg");
    setTimeout(function () {
        getCity();
        mask.remove();
    }, 500);

}

// 勾选指定地区
function selectCity() {
    function getInputCity() {
        let pause_city = prompt("请输入地区：");
        if (!(pause_city.includes('\n') && pause_city.includes('\t'))) {
            throw new Error("请输入excel复制的地区格式，省市区三列")
        }
        // alert("请等待提示勾选完成再进行其他操作！")
        pause_city = pause_city.replace(/\r/g, '');
        // console.log(pause_city);
        let city_list = [];
        pause_city.split('\n').forEach(function (e) {
            if (e !== '') {
                let ssq = e.split('\t');
                if (ssq.length === 3) {
                    city_list.push(ssq);
                }
            }
        })

        if (city_list.length === 0) {
            throw new Error("没有有效数据，请输入excel复制的地区格式，省市区三列");
        }

        let city = [];
        city_list.forEach(function (e) {
            if (city[e[0]] === undefined) {
                let a = [];
                a[e[1]] = Array(e[2]);
                city[e[0]] = Array(a);
            } else if (city[e[0]][0][e[1]] === undefined) {
                city[e[0]][0][e[1]] = Array(e[2]);
            } else {
                city[e[0]][0][e[1]].push(e[2]);
            }
        })
        return city;
    }

    const field = document.getElementsByClassName('field-area area-info-field clearfix');

    async function selectQu(obj, city) {
        for (let i = 0; i < obj.length; i++) {
            let c = obj[i];
            let c_check = c.getElementsByClassName("J_Checkbox region-district")[0];
            if (c_check.checked === false && city.includes(c.innerText)) {
                c.click();
            }
        }
    }

    async function selectShi(obj, city) {
        for (let i = 0; i < obj.length; i++) {
            let c = obj[i];
            let qus = city[0][c.innerText];
            // console.log(qus, c.innerText);
            if (qus !== undefined) {
                c.click();
                let temp = field[0].getElementsByClassName("district-list")[0].getElementsByClassName("addressWrap");
                // console.log(temp.length);
                if (temp.length === 0) {
                    let c_check = c.getElementsByClassName("J_Checkbox region-city")[0];
                    if (c_check.checked === false) {
                        c_check.click();
                    }
                } else {
                    await selectQu(temp, qus);
                }
            }
        }
    }

    async function selectSheng() {
        let city = getInputCity();
        let obj = field[0].getElementsByClassName("province-list")[0].getElementsByClassName("addressWrap");
        for (let i = 0; i < obj.length; i++) {
            let c = obj[i];
            let shis = city[c.innerText];
            if (shis !== undefined) {
                c.click();
                let temp = field[0].getElementsByClassName("city-list")[0].getElementsByClassName("addressWrap");
                await selectShi(temp, shis);
            }
        }
    }
    selectSheng().then(() => {
        alert("完成");
    });

}
