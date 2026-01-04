// ==UserScript==
// @name         sobooks,nmod等同框架书籍网站添加豆瓣跳转链接方便查看具体评分等信息
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  sobooks;nmod等图书网站将书籍名称(article-title)链接修改为豆瓣搜索链接，方便查看豆瓣评分，如有需要添加的网站列表可以给我留言
// @author       You
// @match        https://sobooks.net/books/*
// @match        https://sobooks.cc/books/*
// @match        https://www.nmod.net/book/*
// @match        https://*.lanzoum.com/*
// @match        https://*.lanzout.com/*
// @match        https://*.lanzoui.com/*
// @match        https://developer.lanzoug.com/file/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sobooks.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454433/sobooks%2Cnmod%E7%AD%89%E5%90%8C%E6%A1%86%E6%9E%B6%E4%B9%A6%E7%B1%8D%E7%BD%91%E7%AB%99%E6%B7%BB%E5%8A%A0%E8%B1%86%E7%93%A3%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%E6%96%B9%E4%BE%BF%E6%9F%A5%E7%9C%8B%E5%85%B7%E4%BD%93%E8%AF%84%E5%88%86%E7%AD%89%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/454433/sobooks%2Cnmod%E7%AD%89%E5%90%8C%E6%A1%86%E6%9E%B6%E4%B9%A6%E7%B1%8D%E7%BD%91%E7%AB%99%E6%B7%BB%E5%8A%A0%E8%B1%86%E7%93%A3%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%E6%96%B9%E4%BE%BF%E6%9F%A5%E7%9C%8B%E5%85%B7%E4%BD%93%E8%AF%84%E5%88%86%E7%AD%89%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

function downLoadLinks() {
    // 将下载链接从跳转改成直链
    // let esecret = document.querySelector('body > section > div > div > article > div > b')
    let esecret = document.getElementsByClassName('e-secret')[0].getElementsByTagName('b')[0]
    var str = esecret.innerText
    var reg = /(蓝奏云盘：.+? 密码[:：])(.+?)(\n)/
    var s = reg.exec(str)[2]
    console.log(s)


    let esecret_item = esecret.getElementsByTagName("a")
    for (var i = 0; i < esecret_item.length; i++) {
        esecret_item[i].href = esecret_item[i].href.replace("https://sobooks.cc/go.html?url=", "")
    }

    async function copyPageUrl() {
        try {
            await navigator.clipboard.writeText(s);
            console.log('Page URL copied to clipboard');

        } catch (err) {
            console.error('Failed to copy: ', err);
            alert(err)
        }
    }

    copyPageUrl()

}

function addDoubanLink() {
    let target = document.getElementsByTagName('h1')[0]
    let bookName = target.innerText
    let aTag = target.getElementsByTagName('a')[0]
    aTag.href = "https://www.douban.com/search?q=" + bookName
    aTag.target = "_blank"
    aTag.style.color = '#007722' // 豆瓣绿
}

// TODO 页面下载完成自动关闭蓝奏云页面 或者考虑页面不跳转？？


function inputCode(code) {
    let inputs = document.getElementsByTagName('input')
    inputs[0].value = code
    setTimeout(() => {
        inputs[1].click()
    }, 1000)


}

function goDownloadPage() {
    let name = document.getElementById('name')
    name.getElementsByTagName('a')[0].click()
}

function downloadFile() {
    setTimeout(() => {
        let target = document.getElementsByClassName('txt')
        target[0].click()
    }, 3000)

}

function finalCheck() {
    setTimeout(() => {
        document.getElementById('sub').getElementsByTagName('div')[0].click()
        setTimeout(() => {
            document.getElementById('go').getElementsByTagName('a')[0].click()
        }, 1000)
    }, 2000)

}


(function () {
    'use strict';
    if (document.URL.includes('cc')) {
        console.log('in sobook.cc')
        addDoubanLink()
        downLoadLinks()
    }


    // lanzou Part
    navigator.clipboard
        .readText()
        .then((v) => {
            console.log("获取剪贴板成功：", v);
            try {
                inputCode(v)

                setTimeout(() => {
                    console.log('in goDown')
                    goDownloadPage()
                }, 3000)

            } catch (e) {
                console.log(e)
            }
        })
        .catch((v) => {
            console.log("获取剪贴板失败: ", v);
        });

    downloadFile()
    finalCheck()

})();