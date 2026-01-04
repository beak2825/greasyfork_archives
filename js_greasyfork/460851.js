// ==UserScript==
// @name         导出文献的Bibtex
// @namespace    jw23
// @version      0.1
// @description  支持从知网和谷歌学术导出BiBTex。在知网中，点击论文的checkbox，就会把论文的bibtex复制到剪切板
// @author       jw23
// @match        https://kns.cnki.net/kns8/defaultresult/index
// @match        https://scholar.google.com/scholar*
// @match        https://scholar.google*
// @match        https://s.wanfangdata.com.cn/paper*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460851/%E5%AF%BC%E5%87%BA%E6%96%87%E7%8C%AE%E7%9A%84Bibtex.user.js
// @updateURL https://update.greasyfork.org/scripts/460851/%E5%AF%BC%E5%87%BA%E6%96%87%E7%8C%AE%E7%9A%84Bibtex.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const lauch_in_cnki = () => {
        setTimeout(() => {
            waitUnUtil("div.divLoading", () => {
                console.log("开始插入元素")
                waitUtil(".cbItem", () => {
                    insertToHTML()
                }, 3000)
            }, 8000)
        }, 1000)
    }
    if (document.URL.indexOf("cnki") != -1) {
        lauch_in_cnki()
        document.onkeydown = (e) => {
            if (e.key == "Enter") {
                lauch_in_cnki()
            }
        }
        document.querySelector("input.search-btn").onclick = () => {
            lauch_in_cnki()
        }
    } else if (document.URL.indexOf("scholar.google") != -1) {
        waitUtil(".gs_r.gs_or.gs_scl", () => {
            let items = document.querySelectorAll(".gs_r.gs_or.gs_scl")
            for (let item of items) {
                let id = item.querySelector('h3>a').id
                let box = item.querySelector('div.gs_fl:nth-last-child(1)')
                let btn = document.createElement('a')
                btn.style = "cursor:pointer"
                btn.text = "导出为BiBTex"
                btn.onclick = () => {
                    getBixTexPageFromGoogle(id).then(page => {
                        let dom = document.createElement("div")
                        dom.innerHTML = page;
                        let lists = dom.querySelector("#gs_citi")
                        let first = lists.querySelector("a").href
                        GM_xmlhttpRequest({
                            url: first,
                            method: "GET",
                            onload: (response) => {
                                GM_setClipboard(response.responseText)
                            }
                        })
                    })
                }
                box.appendChild(btn)

            }
        }, 5000)
    } else if (document.URL.indexOf("wanfangdata") != -1) {
        waitUtil("div.normal-list", () => {
            let list = document.querySelectorAll("div.normal-list");
            for (let article of list) {
                let title = article.querySelector("span.title").textContent;
                let button_group = article.querySelector("div.button-list>div")
                let btn_google = document.createElement("div")
                btn_google.className = "wf-list-button"
                btn_google.textContent = "去Google学术查看"
                btn_google.onclick = () => { window.open(`https://scholar.google.com.hk/scholar?hl=zh-CN&as_sdt=0%2C5&q=${title}&btnG=`) }
                button_group.appendChild(btn_google)
            }
        }, 8000)
    }

    // Your code here...
})();
function insertToHTML() {
    let items = document.querySelectorAll('.cbItem')
    for (let checkbox of items) {
        checkbox.onchange = (e) => {
            let filename = e.target.value;
            getBixTex(filename).then(bib => {
                GM_setClipboard(bib)
            })
        }
    }
    let box = document.querySelector("#batchOpsBox")
    let li = document.createElement("li")
    li.textContent = "导出所有的BibTex"
    li.onclick = () => {
        let total = ""
        for (let checkbox of items) {
            if (checkbox.checked) {
                getBixTex(checkbox.value).then(bib => {
                    total += bib;
                    GM_setClipboard(total)
                })
            }
        }
    }
    box.appendChild(li)
}
function getBixTex(filename) {
    // GM_xmlhttpRequest({
    //     url: "https://kns.cnki.net/dm/api/ShowExport",
    //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //     data: encodeURIComponent(`FileName=${filename}&DisplayMode=BibTex&OrderParam=0&OrderType=desc&SelectField=&PageIndex=1&PageSize=20&language=&uniplatform=NZKPT&random=${Math.random()}`),
    //     onload: (response) => {
    //         console.log("得到结果:");
    //         console.log(response.responseText)
    //     },
    //     onerror: (err) => {
    //         console.log("获取BixTex失败", err)
    //     }
    // })
    return fetch("https://kns.cnki.net/dm/api/ShowExport", {
        "headers": {
            "accept": "text/plain, */*; q=0.01",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Microsoft Edge\";v=\"110\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `FileName=${filename}&DisplayMode=BibTex&OrderParam=0&OrderType=desc&SelectField=&PageIndex=1&PageSize=20&language=&uniplatform=NZKPT&random=0.6662329504606448`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(respose => respose.text()).then(result => {
        let dom = document.createElement("div")
        dom.innerHTML = result;
        let bib = dom.querySelector("li")
        // console.log(bib.textContent)
        return bib.textContent
    })
}
function waitUtil(ele, callback, timeout) {
    let success = false;
    let id = setInterval(function () {
        let target = document.querySelector(ele)
        if (target != null) {
            success = true
            clearInterval(id);
            callback(target)
        }
    }, 100)
    setTimeout(() => {
        if (!success) {
            clearInterval(id)
            console.log("[何碧]页面超时")
        }
    }, timeout)
}
function waitUnUtil(ele, callback, timeout) {
    let success = false;
    let id = setInterval(function () {
        let target = document.querySelector(ele)
        if (target == null) {
            success = true
            clearInterval(id);
            callback(target)
        }
    }, 100)
    setTimeout(() => {
        if (!success) {
            clearInterval(id)
            console.log("[何碧]页面超时")
        }
    }, timeout)
}

function getBixTexPageFromGoogle(id) {
    return fetch(`/scholar?q=info:${id}:scholar.google.com/&output=cite&scirp=1&hl=zh-CN`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Microsoft Edge\";v=\"110\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XHR"
        },
        "referrerPolicy": "origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then(response => response.text()).then(result => { return result })
}
