// ==UserScript==
// @name         douban topic search
// @namespace    https://juuun.io
// @version      0.42
// @description  在一个豆瓣小组的帖子的所有回复中进行搜索。
// @author       leadream
// @match        https://www.douban.com/group/topic/*
// @icon         https://www.google.com/s2/favicons?domain=douban.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/431912/douban%20topic%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/431912/douban%20topic%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.$
    var listData = []
    var link = location.href.match(/https:\/\/www.douban.com\/group\/topic\/[0-9]+\//)[0]
    var pageTotal = $('.paginator').children().eq(-2).text() - 0

    // 创建容器
    var div = document.createElement('div')
    div.style = "display: flex;align-items: center;"

    // 创建搜索框和按钮
    var input = document.createElement('input')
    var button = document.createElement('button')
    button.disabled = true
    button.innerText = "正在处理数据，请稍后……"

    // 创建提示
    var tip = document.createElement('p')

    // 创建列表
    var ul = document.createElement('ul')
    ul.style.width = "600px"
    ul.style.marginTop = "12px"

    div.append(input)
    div.append(button)

    var content = document.getElementById('content')
    content.prepend(ul)
    content.prepend(tip)
    content.prepend(div)

    if (!localStorage.getItem("maybeMyGirlfriendList")) {

    }
    fetchData(0)

    // 绑定事件
    button.addEventListener("click", search)
    input.addEventListener("keydown", function (e) {
        if (e.code==='Enter') {
            search()
        }
    })

    function search () {
        var value = input.value
        var keywords = value.split('/')
        var filteredList = listData.filter(function (one) {
            var flag = true
            keywords.map(function (k) {
                flag = flag && one.content.includes(k)
            })
            return flag
        })
        console.log(filteredList)
        tip.innerText = "共搜索到" + filteredList.length + "条"
        ul.innerHTML = filteredList.map(function (one) {
          return '<li style="margin-bottom: 12px; padding: 12px; border: 1px solid #CCC;">' +
            '<a href="' + one.authorLink + '" target="_blank">' +
            '<img class="pil" src="' + one.avatar + '" alt="Holder">' +
            one.authorName +
            '</a>' +
            '<p style="margin: 0">' + one.content + '</p>' +
            '<p style="margin: 0">' + one.datetime +
            '  |  <a href="https://www.douban.com/group/topic/185580543/?start=' + (one.page-1)*100 +
            '#' + one.id + '" target="_blank">第' + one.page + '页</a></p>' +
            '</li>'
        }).join("")
    }

    function fetchData (start) {
        fetch(link + '?start=' + start)
        .then(function (res) {
          return res.text()
        })
        .then(function (html) {
            var page = Math.floor(start/100) + 1
            button.innerText = "正在处理第" + page + "/" + pageTotal + "页"
            var el = $(html);
            el.find(".comment-item").each(function (i, e) {
                var content = $(e).find(".reply-content").text()
                var avatar = $(e).find(".user-face img")
                var author = $(e).find("h4 a")
                var datetime = $(e).find("h4 span").text()
                listData.push({
                    id: $(e).attr("id"),
                    page: page,
                    content: content,
                    authorName: author.text(),
                    authorLink: author.attr("href"),
                    avatar: avatar.attr("src"),
                    datetime: datetime
                })
            })

            if (start<pageTotal*100) {
                fetchData(start + 100)
            }
            if (start===pageTotal*100) {
                button.disabled = false
                button.innerText = "搜索"
            }
        })
    }

})();
