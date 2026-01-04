// ==UserScript==
// @name         getCompoundData
// @namespace    https://greasyfork.org/users/207107
// @version      0.2
// @description  getCompoundMSDSData
// @author       JingyangNi
// @match        http://msds.chemicalbook.com/Search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371498/getCompoundData.user.js
// @updateURL https://update.greasyfork.org/scripts/371498/getCompoundData.meta.js
// ==/UserScript==

function main() {
    let ele = getElement();
    let data = {}, dataText = [], cbNum = 0;
    document.body.onkeyup = function (e) {
        if (e.keyCode === 84) {//T
            data = localStorage.database ? JSON.parse(localStorage.database) : {};
            //获取数据
            cbNum = ele[0].innerHTML.split("：")[1];
            for (var i = 1; i < ele.length; i++) {
                if (i === 2) {
                    dataText.push(ele[i].innerHTML.split("CAS：")[1]);
                    dataText.push(" ");
                }
                else if (i < 12) {
                    dataText.push(ele[i].innerHTML.replace(","," ").replace(/<\/?span>|&nbsp;| /g, "").split("：")[1])
                }
                else if (i < 14) {
                    dataText.push(ele[i].innerHTML.replace(","," ").split(":")[1]);
                }
                else dataText.push(ele[i].innerHTML.replace(","," ").replace(/&nbsp;|<!-- .* -->|<\/?p>| /g, ""));
            }
            for (let tag in data) {
                if (tag === cbNum) {
                    alert("该物质资料已存在！");
                    return;
                }
            }
            console.log(dataText);
            data[cbNum] = dataText;
            dataText = [];
            localStorage.database = JSON.stringify(data);
        }
    };
    buttonEvent();
}

function getElement() {//元素获取
    var style = document.createElement('style');
    style.innerHTML = `.usefulData {color:red;font-weight: bold;background:white; font-size:20px}`;
    document.head.appendChild(style);
    let comEle = [];
    comEle.push(document.querySelectorAll(".proinf>ul>li")[1]);//cbNumber
    comEle.push(document.querySelector(".proinf>h2"));//name
    comEle.push(document.querySelectorAll(".proinf>ul>li")[0]);//cas
    comEle.push(document.querySelectorAll(".proinf>ul>li")[3]);//mw
    let table1 = document.querySelectorAll(".sds-cn-content>table")[1],
        table2 = document.querySelectorAll(".sds-cn-content>dl")[8],
        table3 = document.querySelectorAll(".sds-cn-content>dl");
    comEle.push(childNode(table1, 0, 0, 0));//appearance
    comEle.push(childNode(table1, 0, 0, 1));//smell
    comEle.push(childNode(table1, 0, 6, 0));//den
    comEle.push(childNode(table1, 0, 8, 0));//solubility
    comEle.push(childNode(table1, 0, 2, 0));//bp
    comEle.push(childNode(table1, 0, 1, 1));//mp
    comEle.push(childNode(table1, 0, 3, 0));//fp
    comEle.push(childNode(table1, 0, 2, 1));//sbp
    comEle.push(childNode(table2, 1, 0));//ld
    comEle.push(childNode(table2, 1, 1));//lc
    comEle.push(childNode(table3[7], 1));//stability
    comEle.push(childNode(table3[1], 5, 0, 11));//harm
    comEle.push(childNode(table3[5], 1));//ope
    comEle.push(childNode(table3[5], 3));//storage
    for (let i = 1; i < comEle.length; i++) {
        comEle[i].className = "usefulData";
    }
    return comEle;
}

function dataTrack() {//数据显示
    let box = document.createElement('div');
    box.id = 'dataBox';
    box.setAttribute('style', "position: absolute; top:240px; padding:2px; left:320px; border: 1px solid; background-color: #E3E0D1; text-align:center; z-css:99; -webkit-user-select:none; border-radius: 10px; font-size: 13px");
    box.innerHTML = '<div id="track" style="height:14px;line-height: 14px;margin: auto; padding:2px;font-weight: bold; font-size: 18px">Data Box</div>';
    document.body.appendChild(box);
    dragEle(box);
    //---------------------------------------------
    let data = {};
    if (localStorage.database) data = JSON.parse(localStorage.database);
    else return;
    let frg = document.createDocumentFragment();
    let i = 1;
    for (let key in data) {
        let div = document.createElement('div');
        div.id = key;
        div.innerHTML += "<a class='dataShowed' cbn=" + key + ">删除</a>" + "  <a href='http://msds.chemicalbook.com/Search/MSDS?cbn="+ key + "&l=CN' cbn=>链接</a>" +"   " + i + "." + data[key][0] + " Cas:"+data[key][1] +"<br>";
        i++;
        frg.appendChild(div);
    }
    box.appendChild(frg);
    i = 1;
    frg = null;
    deleteSingleData();
}

function deleteSingleData() {
    let arrA = document.getElementsByClassName("dataShowed");
    for (let i = 0; i < arrA.length; i++) {
        arrA[i].onclick = function (e) {
            let temp = e.target.parentNode;
            let cbNum = temp.id;
            let data = JSON.parse(localStorage.database);
            delete data[cbNum];
            localStorage.database = JSON.stringify(data);
            temp.parentNode.removeChild(temp);
        }
    }
}

function buttonEvent() {//数据按钮
    let getMsds = document.createElement('div');
    getMsds.id = 'getMsds';
    document.body.appendChild(getMsds);
    createButton("显示数据", "showData", 320);
    createButton("关闭数据", "closeData", 380);
    createButton("删除全部", "deleteData", 440);
    createButton("下载保存", "downloadData", 500);
    buttonEvent.flag = false;
    document.getElementById("showData").addEventListener('click', function (e) {
        if (!buttonEvent.flag) {
            dataTrack();
            buttonEvent.flag = true;
        }
    });
    document.getElementById("closeData").addEventListener('click', function (e) {
        let temp = document.getElementById("dataBox");
        if (temp) temp.parentNode.removeChild(temp);
        buttonEvent.flag = false;
    });
    document.getElementById("deleteData").addEventListener('click', function (e) {
        if (confirm("确定删除吗?")) localStorage.removeItem("database");
    });
    document.getElementById("downloadData").addEventListener('click', function (e) {
        let data = localStorage.database ? JSON.parse(localStorage.database) : alert("数据不存在");
        let arrDataName = ["名称", "有无MSDS", "Cas No", "化学结构", "分子量", "外观与性状", "气味", "密度", "水溶解度", "沸点", "熔点", "闪点", "引燃温度", "燃烧热", "饱和蒸汽压", "临界温度", "临界压力", "爆炸上限", "爆炸下限", "LD50", "LC50", "稳定性", "危害", "储存要求", "使用注意事项"];
        for (let tag in data) {
            data[tag].splice(1, 0, "有");
            data[tag].splice(13, 0, "", "", "", "", "", "");
            for (let i = 0; i < data[tag].length; i++) {
                arrDataName[i] = arrDataName[i] + "," + data[tag][i];
            }
        }
        let strCsv = "";
        for (let i = 0; i < arrDataName.length; i++) {
            strCsv = strCsv + arrDataName[i] + "\n";
        }
        let safeData = document.createElement('a');
        safeData.id = 'safeData';
        safeData.download = '安全评估数据.csv';
        safeData.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent("\uFEFF" + strCsv);
        document.body.appendChild(safeData);
        document.getElementById('safeData').click();
        document.getElementById('safeData').parentNode.removeChild(document.getElementById('safeData'));
    });
}

function createButton(btnName, btnId, left) {//创建按钮
    let but = document.createElement('button');
    but.type = 'button';
    but.innerHTML = btnName;
    but.id = btnId;
    but.setAttribute("style", "top:190px; left:" + (50+left) + "px; position:absolute; font-weight:bold; z-css:1;");
    document.getElementById("getMsds").appendChild(but);
}

function dragEle(ele) {//元素拖拽
    ele.onmousedown = function down(e) {
        let mouseX = e.clientX, mouseY = e.clientY;
        let eleX = parseFloat(this.getBoundingClientRect().left),
            eleY = parseFloat(this.getBoundingClientRect().top);
        document.onmousemove = function move(e) {
            let deltaX = e.clientX - mouseX, deltaY = e.clientY - mouseY;
            let maxX = document.documentElement.clientWidth - ele.offsetWidth,
                maxY = document.documentElement.clientHeight - ele.offsetHeight;
            ele.style.left = (eleX + deltaX < 0 ? 0 : eleX + deltaX > maxX ? maxX : eleX + deltaX) + 'px';
            ele.style.top = (eleY + deltaY < 0 ? 0 : eleY + deltaY > maxY ? maxY : eleY + deltaY) + 'px';
        };
        document.onmouseup = function up() {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

function childNode(curEle, n) {//找子元素
    let node = curEle;
    for (let i = 1; i < arguments.length; i++) {
        node = node.children[arguments[i]];
    }
    return node;
}

main();