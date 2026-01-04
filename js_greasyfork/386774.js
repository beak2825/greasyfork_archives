// ==UserScript==
// @name         新物料信息
// @namespace    新物料信息
// @version      1.7
// @description  新物料信息收集-适用：1)探索试剂，耗材;2)安耐吉试剂;3)亚速旺耗材;4)禾汽仪器(多选框只读取第一个选项);5)添加自定义快速菜单
// @author       NJY
// @match        http*://www.tansoole.com/upload/detail/*
// @match        http*://www.energy-chemical.com/front/*
// @match        http*://www.asonline.cn/ProDetail.aspx?SysNo=*
// @match        http*://www.heqionline.com/goods*
// @match        http://159.228.64.243:8080/seeyon/collaboration/collaboration.do?method=newColl&from=templateNewColl&templateId=-5929793079627069729
// @match        http://159.228.64.243:8080/seeyon/collaboration/collaboration.do?method=newColl&summaryId*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386774/%E6%96%B0%E7%89%A9%E6%96%99%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/386774/%E6%96%B0%E7%89%A9%E6%96%99%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

function main() {
    if (window.location.href.indexOf("tansoole") > 0) {
        createButton("新物料", "newItem", document.getElementById("body"), "absolute", 1000, 250);
        document.getElementById("newItem").onclick = function () {
            //let i = window.location.href.match(/detail\/(\d+)\//)[1] - 1;
            //i === 2 ? i = 1 : null;
            //let info = document.getElementsByClassName("title")[i].title;
            let info = document.getElementsByClassName("title")[0].title;
            let tanNum = document.getElementsByClassName("reagent-prop-info")[2].innerText;
            info = "货号:" + tanNum + "|" + info + "|数量:1|" + window.location.href;
            prompt("新物料信息", info);
        }
    } else if (window.location.href.indexOf("nergy-chemical.com/front/cas") > 0 || window.location.href.indexOf("energy-chemical.com/front/search.htm?type=anjCas") > 0) {
        createButton("新物料", "newItem", document.querySelector(".related_pro_title"), "relative", 100, 0);
        let itemList = document.querySelectorAll("#jkgoodsDiv>div>div>table>tbody>tr.related");
        for (let i = 0; i < itemList.length; i++) {
            createCheckBox(itemList[i], "relative", -itemList[i].offsetWidth + -900, 5);
        }
        document.getElementById("newItem").onclick = function () {
            let info = "";
            let title = document.getElementsByClassName("leve_pro_title")[0].innerHTML;
            let casNum = document.querySelector(".leve_pro_norm>li>span").innerHTML;
            for (let i = 0; i < itemList.length; i++) {
                if (itemList[i].cb.checked === true) {
                    let goodNum = itemList[i].children[0].innerHTML;
                    let spec = itemList[i].children[1].innerHTML;
                    info = "货号:" + goodNum + "|品名:" + title + "|Cas:" + casNum + "|规格:" + spec + "|安耐吉|数量:1|" + window.location.href;
                    break;
                }
            }
            prompt("新物料信息", info);
        }
    } else if (window.location.href.indexOf("energy-chemical.com/front/goods") > 0) {
        createButton("新物料", "newItem", document.querySelector(".pro_detail_right"), "relative", 100, -500);
        document.getElementById("newItem").onclick = function () {
            let title = document.querySelector(".pro_title").innerHTML;
            let goodNum = document.querySelector(".pro_norm").innerHTML.match(/编号：(\w+) /)[1];
            let casNum = document.getElementsByClassName("pro_norm")[0].innerText.split("CAS号：")[1].split(" ")[0];
            let spec = document.querySelector(".wrap_up>.active").innerText;
            let num = document.getElementById("numShow").value;
            let info = "货号:" + goodNum + "|品名:" + title + "|Cas:" + casNum + "|规格:" + spec + "|安耐吉|数量:" + num + "|" + window.location.href;
            prompt("新物料信息", info);
        }
    } else if (window.location.href.indexOf("asonline") > 0) {
        createButton("新物料", "newItem", document.querySelector(".color_grey02"), "relative", 200, 150);
        let itemList = document.querySelectorAll(".padding_top10>table>tbody>tr");
        for (let i = 1; i < itemList.length; i++) {
            createCheckBox(itemList[i], "relative", -itemList[i].offsetWidth + 10, 10);
        }
        document.getElementById("newItem").onclick = function () {
            let info = "";
            let title = document.querySelector(".padding_top20>div.pull-right>div>div").innerText;
            //let casNum = document.querySelector(".leve_pro_norm>li>span").innerHTML;
            for (let i = 1; i < itemList.length; i++) {
                if (itemList[i].cb.checked === true) {
                    let goodNum = itemList[i].children[0].textContent;
                    let tag_arr = [], temp
                    for (let j = 0; j < 3; j++) {
                        if (itemList[0].children[j + 1].innerHTML !== "数量") {
                            temp = itemList[0].children[j + 1].innerHTML + ":" + itemList[i].children[j + 1].innerHTML;
                        } else {
                            temp = ""
                        }
                        tag_arr.push(temp)
                    }
                    info = "货号:" + goodNum + "|品名:" + title + "|" + tag_arr[0] + "|" + tag_arr[1] + "|" + tag_arr[2] + "|亚速旺|数量:1|" + window.location.href;
                    break;
                }
            }
            prompt("新物料信息", info);
        }
    } else if (window.location.href.indexOf("heqionline") > 0) {
        createButton("新物料", "newItem", document.querySelector(".pro1-list"), "relative", -350, 100);
        let itemList = document.querySelectorAll(".pro2-list>table>tbody>tr");
        //document.querySelectorAll(".pro2-list>table>tbody>tr")[1].children[0].offsetWidth
        for (let i = 1; i < itemList.length; i++) {
            createCheckBox(itemList[i].children[3], "relative", 2, 2);
        }
        document.getElementById("newItem").onclick = function () {
            let info = "";
            let title = document.querySelector(".tt_name").innerText;
            for (let i = 1; i < itemList.length; i++) {
                if (itemList[i].children[3].cb.checked === true) {
                    let goodNum = itemList[i].children[2].innerHTML;
                    let spec01 = itemList[0].children[1].innerHTML + ":" + itemList[i].children[1].innerHTML;
                    let spec02 = itemList[0].children[3].innerText + ":" + itemList[i].children[3].innerText;
                    let spec03 = itemList[0].children[5].innerHTML + ":" + itemList[i].children[5].innerHTML;
                    info = "货号:" + goodNum + "|品名:" + title + "|" + spec01 + "|" + spec02 + "|" + spec03 + "|禾汽|数量:1|" + window.location.href;
                    break;
                }
            }
            prompt("新物料信息", info);
        }
    } else if (window.location.href.indexOf("seeyon") > 0) {
        let ele = null;
        let mo = new MutationObserver(function () {
            ele = document.querySelector("iframe[id*=layui-layer-iframe]");
            if (ele) {
                let par = document.querySelector("iframe[id*=layui-layer-iframe]").contentDocument.body.children[0];
                if (!ele.contentDocument.querySelector("#mylist") && par) {
                    createButton("菜单", "mylist", par, "abosolute", -1000, 200);
                    let myBtn = ele.contentDocument.querySelector("#mylist");
                    myBtn.onclick = createMyList;
                }
                let typeOpt = ele.contentDocument.querySelector(".common_drop_list_content");
                if (typeOpt) {
                    typeOpt.children[2].click();
                }
            }
        });
        mo.observe(document.body, {attributes: true, childList: true, subtree: true});
    }
}

function createMyList() {
    let ifr = document.querySelector("iframe[id*=layui-layer-iframe]").contentDocument;
    if (ifr) {
        if (!ifr.querySelector("#listDiv")) {
            let listDiv = document.createElement("div");
            listDiv.id = "listDiv";
            listDiv.setAttribute('style', "position: absolute; top:50px; padding:2px; left:-600px; border: 1px solid; -webkit-user-select:none; line-height: 20px; margin: auto; background-color: #E3E0D1; z-css:99; border-radius: 8px; font-size: 13px; font-weight: bold");
            let listStyle = document.createElement("style");
            listStyle.innerHTML = ".hov:hover{background-color:yellow; cursor: pointer;}";
            ifr.head.appendChild(listStyle);
            let tempStr = "";
            let quickList = [];
            if (localStorage.itemList) {
                let data = JSON.parse(localStorage.itemList)
                for (let i = 0; i < data.length; i++) {
                    quickList.push(`${data[i][0]}=${data[i][1]}`)
                }
            }
            for (let i = 0; i < quickList.length; i++) {
                tempStr = `${tempStr}<div class='hov'>${quickList[i]}</div>`;
            }
            listDiv.innerHTML = tempStr;
            for (let i = 0; i < listDiv.children.length; i++) {
                listDiv.children[i].onclick = function (e) {
                    let typeOpt = ifr.querySelector(".common_drop_list_content");
                    if (typeOpt) {
                        typeOpt.children[2].click();
                        ifr.querySelector("#field0004").value = e.target.innerText.split("=")[0];
                        ifr.querySelector("#listDiv").parentNode.removeChild(ifr.querySelector("#listDiv"));
                        ifr.querySelector(".search_btn").click();
                        setTimeout(function () {
                            let ser = ifr.querySelector("#mytable>tbody>tr");
                            if (ser) {
                                ser.click();
                            }
                        }, 100);
                    }
                }
            }
            ifr.body.children[0].appendChild(listDiv);
            createButton("修改列表", "addItem", listDiv, "absolute", -60, 2);
            if (listDiv.querySelector("#addItem")) {
                listDiv.querySelector("#addItem").onclick = function () {
                    let quickList = "";
                    if (localStorage.itemList) {
                        let data = JSON.parse(localStorage.itemList)
                        for (let i = 0; i < data.length; i++) {
                            quickList = `${quickList}${data[i][0]}=${data[i][1]}\n`;
                        }
                    }
                    let itemList_arr = [];
                    let itemList = prompt("输入修改项目", quickList).split("\n");
                    for (let i = 0; i < itemList.length; i++) {
                        itemList_arr.push(itemList[i].split("="));
                    }
                    localStorage.itemList = JSON.stringify(itemList_arr);
                    ifr.querySelector("#listDiv").parentNode.removeChild(ifr.querySelector("#listDiv"));
                }
            }
        } else {
            ifr.querySelector("#listDiv").parentNode.removeChild(ifr.querySelector("#listDiv"));
        }
    }
}

function createCheckBox(ele, pos, x, y) {
    ele.cb = document.createElement("input");
    ele.cb.type = "checkbox";
    ele.cb.style.position = pos;
    ele.cb.style.left = x + "px";
    ele.cb.style.top = y + "px";
    ele.appendChild(ele.cb);
}

function createButton(btnText, btnId, ele, pos, left, top) {//创建按钮
    let but = document.createElement('button');
    but.type = 'button';
    but.innerHTML = btnText;
    but.id = btnId;
    but.setAttribute("style", "top:" + top + "px; left:" + left + "px; position:" + pos + "; font-weight:bold; z-index:1;");
    ele.appendChild(but);
}

main();