// ==UserScript==
// @name         BTNULL 电影评分筛选器手动输入筛选分值,包含没有评分
// @namespace    http://tampermonkey.net/
// @version      0.85
// @description  BTNULL 评分筛选功能
// @author       silvo27
// @match        https://www.btnull.net/*/*
// @match        https://www.btnull.org/*/*
// @match        https://www.btnull.si/*/*
// @match        https://www.btnull.to/*/*
// @match        https://www.btnull.nu/*/*
// @match        https://www.btnull.in/*/*
// @match        https://www.btnull.fun/*/*
// @license      GPLv3
// @grant        window.onurlchange
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/423299/BTNULL%20%E7%94%B5%E5%BD%B1%E8%AF%84%E5%88%86%E7%AD%9B%E9%80%89%E5%99%A8%E6%89%8B%E5%8A%A8%E8%BE%93%E5%85%A5%E7%AD%9B%E9%80%89%E5%88%86%E5%80%BC%2C%E5%8C%85%E5%90%AB%E6%B2%A1%E6%9C%89%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/423299/BTNULL%20%E7%94%B5%E5%BD%B1%E8%AF%84%E5%88%86%E7%AD%9B%E9%80%89%E5%99%A8%E6%89%8B%E5%8A%A8%E8%BE%93%E5%85%A5%E7%AD%9B%E9%80%89%E5%88%86%E5%80%BC%2C%E5%8C%85%E5%90%AB%E6%B2%A1%E6%9C%89%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

function hideLowScore(scoreFilter, isShowNA = 0) {
    let films = document.getElementsByClassName("content-list")[0].getElementsByTagName('li')
    for (let i of films) {
        let score = i.getElementsByTagName('h3')[0].getElementsByTagName('span')[0].innerText
        if (isShowNA) {
            if (score === 'N/A') {
                i.style.display = 'none'
            }
        }
        if (score <= scoreFilter) {
            i.style.display = 'none'
        }
    }
}

function setScore() {
    let filter_score = prompt(`点取消表示不筛选 \n请输入筛选数值(0~9.9)：`);
    if (filter_score >= 9.9) {
        filter_score = 9.9
    }
    if (isNaN(filter_score)) {
        filter_score = 0
    }
    if (!filter_score) {
        return
    }
    localStorage.setItem('filter_score', filter_score);
    console.log(filter_score)
    return
}

function setScoreLabe(storedScore) {
    let item = document.getElementsByTagName('nav')[0].getElementsByTagName('li')[0]
    item.innerHTML = `评分筛选:${storedScore}`;
    item.style.color = "blue";
    item.style.fontSize = '15px';
    item.style.padding = '0px 0px';
    item.onclick = function () {
        setScore()
        window.location.reload()
    }

}

function getScore() {
    let storedScore
    if (!localStorage.getItem('filter_score')) {
        localStorage.setItem('filter_score', 0);
        return 0
    } else {
        storedScore = localStorage.getItem('filter_score');
    }
    return storedScore
}

function getData1(i, abc) {
    let n = document.createElement("div")
    n.innerHTML = abc
    if(n.innerText.includes("今天")){
        n.style.backgroundColor = "rgb(0 255 0 / 80%)"
    }else{
        n.style.backgroundColor = "rgb(255 255 255 / 80%)"
    }
    
    n.style.position  = "absolute"
    n.style.top = "0%"
    i.parentElement.parentElement.append(n)
}

function getDataInBackground(i, url) {
    let getData = GM_xmlhttpRequest({
        url: url,
        // url:"https:www.taobao.com",
        method: "GET",
        headers: {
            "Content-Type": "text/html",
            "cookies": document.cookie
        },
        onload: function (res) {
            let domparser = new DOMParser()
            let doc = domparser.parseFromString(res.response, "text/html")
            let data = doc.body.getElementsByTagName("script")[0].innerText
            let dd = data.split(";")
            let updateInfo = JSON.parse(dd[4].split("=")[1])['status']
            getData1(i, updateInfo)
        }
    })

}


function add_zm_link(){
    console.log("查找字幕")
    let aaa = document.getElementsByClassName("main-ui-meta")[0]
    let filename = aaa.getElementsByTagName("h1")[0].innerText.split(" ")[0]
    let zm = document.createElement("a")
    zm.innerText = "查找字幕"
    zm.href = "https://zimuku.org/search?q=" + filename
    zm.target="_blank"
    zm.style="font-size:27px;"
    aaa.appendChild(zm)

}



(function () {
    console.log("分数筛选:" + localStorage.filter_score)
    try{
        let storedScore = getScore()
        setScoreLabe(storedScore)
        hideLowScore(storedScore)


        if (window.onurlchange === null) {
            window.addEventListener('urlchange', (info) => {
                // console.log("changed:" + document.URL)
                hideLowScore(storedScore)
            });
        }

        if (location.href === "https://www.btnull.in/user/favorite/") {
            let items = document.getElementsByTagName("h3")
            for (let i of items) {
                let url = i.getElementsByTagName("a")[0].href
                getDataInBackground(i, url)
            }
        }
    } catch(e){

    }

    window.addEventListener('load', function() {
        setTimeout(function() {
            console.log(1234)
            add_zm_link()
        },10)
    })

})();
