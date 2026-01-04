// ==UserScript==
// @name         吉大吃瓜助手
// @namespace    http://ygfw.jsu.edu.cn/
// @version      2024-01-11
// @description  吉大吃瓜助手11
// @licence      MIT
// @author       You
// @match        https://ygfw.jsu.edu.cn/column/detail/index.shtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jsu.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498966/%E5%90%89%E5%A4%A7%E5%90%83%E7%93%9C%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/498966/%E5%90%89%E5%A4%A7%E5%90%83%E7%93%9C%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    async function getDetails() {
        let id = getQueryParams("id")
        let data = new FormData();
        data.append("id", id);
        data.append("method", "showGuestBookInfoInShtml");

        let headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        let urlencoded = new URLSearchParams();
        urlencoded.append("id", id);
        urlencoded.append("method", "showGuestBookInfoInShtml");

        let response = await fetch("https://ygfw.jsu.edu.cn/ext/GuestbookServletInShtml", {
            method: "POST",
            body: urlencoded,
            headers: headers
        });

        let result = await response.json();
        return result;
    }


    function getQueryParams(name) {
        let query = window.location.search.substring(1);
        let lets = query.split("&");
        for (let i = 0; i < lets.length; i++) {
            let pair = lets[i].split("=");
            if (pair[0] === name) {
                return pair[1];
            }
        }
        return null;
    }

    setTimeout(async () => {
        let id = getQueryParams("id")
        let ss = document.createElement("button")
        ss.classList.add("btn")
        ss.classList.add("btn-success")
        ss.innerText = "上一个"
        let p = document.querySelector("body > div.container.s-padding-t30.step-top.noprint > div > div > ol")
        ss.addEventListener("click", () => {
            window.location.href = "index.shtml?id=" + (Number(getQueryParams("id")) - 1)
        });
        p.appendChild(ss)
        let results = await getDetails()
        console.log(results)
        let result = results.gbInfo
        let sss = document.createElement("button")
        sss.classList.add("btn")
        sss.classList.add("btn-success")
        sss.innerText = "下一个"
        sss.addEventListener("click", () => {
            window.location.href = "index.shtml?id=" + (Number(getQueryParams("id")) + 1)
        });
        p.appendChild(sss)
        if (document.querySelector("#detail").innerText.includes("{Template Error}")) {
            document.querySelector("#detail").innerText = ""
            if (result) {
                document.querySelector("#detail").innerHTML = '                <table id="result" class="table table-bordered s-noIndent">                    <tbody>                        <tr>                            <td colspan="4" style="font-size:16px;width: 325px;"><b>受理问题</b>                            	<button type="button" class="btn btn-danger isprint" onclick="isprint()" style="float: right;">									<i class="fa fa-print m-right-xs"></i>打印								</button>	                          	</td>                        </tr>                        <tr>                            <td>                                <font class="s-textBlue"><b>标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题</b></font>                            </td>                            <td colspan="3"><b>&nbsp;&nbsp;地板砖破损严重(回复编号：4055)</b></td>                        </tr>                        <tr>                            <td>                                <font class="s-textBlue"><b>内容描述</b></font>                            </td>                            <td colspan="3" id="detailcontent"> 老师好，我是张家界校区的，住在9栋宿舍楼，放假前，不知道为什么地板砖突然开裂，隆起，后去报修，但是寒假没有修，所以想问下开学了能修吗，因为实在不方便，无论是过路还是坐人。破损情况如图。</td>                        </tr>                        <tr>                            <td>                                <font class="s-textBlue"><b>问题类型</b></font>                            </td>                            <td>政策咨询</td>                            <td>                                <font class="s-textBlue"><b>提交时间</b></font>                            </td>                            <td>2019-02-23</td>                        </tr>                        <tr>                            <td>                                <font class="s-textBlue"><b>问题提出人</b></font>                            </td>                            <td>肖**</td>                            <td>                                <font class="s-textBlue"><b>提出人身份</b></font>                            </td>                            <td>                            	                                   学生/家长                                  							</td>                        </tr>                        <tr>                            <td>                                <font class="s-textBlue"><b>处理状态</b></font>                            </td>                            <td colspan="3">  										                                            <font class="s-textGreen"> 已处理</font>                                                                    </td>                        </tr>                    </tbody>                <tbody><tr><th>附件</th><td colspan="3">无附件</td></tr></tbody></table>'
                document.querySelector("#detailcontent").innerHTML = result.content
                document.querySelector("#result > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2) > font").innerText = "未知 - 被吃瓜助手恢复"
                document.querySelector("#result > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > b").innerText = result.title
                document.querySelector("#result > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2)").innerText = result.category
                document.querySelector("#result > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2)").innerText = result.man
                document.querySelector("#result > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(4)").innerText = "未解析"
                document.querySelector("#result > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(4)").innerText = "未解析"
            }
            else {
                let s = document.querySelector("#detail")
                let h1 = document.createElement("h1")
                h1.innerText = "你似乎来到了没有知识的荒原"
                // h1 居中
                h1.style.textAlign = "center"
                s.appendChild(h1)
                return
            }
        } else {
            setTimeout(async () => {
                // 创建附件table 元素

                let table = document.createElement("tbody")
                let attachTr = document.createElement("tr")
                let attachTh = document.createElement("th")
                attachTh.innerText = "附件"
                attachTr.appendChild(attachTh)
                let attachTd = document.createElement("td")
                attachTd.colSpan = 3
                let infoTitle = document.querySelector("#result > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > b")
                infoTitle.innerText = infoTitle.innerText + `(回复编号：${result.orderId})`
                if (result && result.currentstatus === "9") {
                    let name = document.querySelectorAll("#result > tbody > tr:nth-child(2) > td:nth-child(2)")[1]
                    name.innerText = name.innerText + ` ${result.answerTruename}`
                }
                // 如果attach不存在，则显示无附件
                attachTd.innerText = "无附件"
                if (result && result.attach) {
                    attachTd.innerText = ""
                    let ext = result.attachname.split(".")[result.attachname.split(".").length - 1]
                    // 如果为图片，则显示图片
                    if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "gif") {
                        let img = document.createElement("img")
                        img.src = "https://ygfw.jsu.edu.cn/" + result.attach
                        img.style.width = "100%"
                        attachTd.appendChild(img)
                    } else {
                        // 使用Blob下载
                        let a = document.createElement("a")
                        a.href = "https://ygfw.jsu.edu.cn/" + result.attach
                        a.download = result.attachname
                        a.innerText = `附件下载 ${result.attachname}`
                        attachTd.appendChild(a)
                    }
                }
                if (document.querySelector("#orderId") !== null) {
                    document.querySelector("#orderId").value = result.orderId
                }

                attachTr.appendChild(attachTd)
                table.appendChild(attachTr)
                // 插入Table
                document.querySelectorAll("table#result")[0].appendChild(table)
            }, 100)
        }

    }, 100)

})();