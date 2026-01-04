// ==UserScript==
// @name         大淘客-我的淘礼金页面优化
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.4.0
// @description  none
// @author       windeng
// @match        https://www.dataoke.com/pmc/tlj-list.html*
// @match        http://www.dataoke.com/pmc/tlj-list.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414710/%E5%A4%A7%E6%B7%98%E5%AE%A2-%E6%88%91%E7%9A%84%E6%B7%98%E7%A4%BC%E9%87%91%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/414710/%E5%A4%A7%E6%B7%98%E5%AE%A2-%E6%88%91%E7%9A%84%E6%B7%98%E7%A4%BC%E9%87%91%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(".lay-com-sidebar").hide()
    $(".row").css("margin", "auto")

    var table = $(".layui-table")[0]
    var head = table.getElementsByTagName("thead")[0]
    var headTr = head.getElementsByTagName("tr")[0]
    var curTh = headTr.getElementsByTagName("th")[0]

    var th = document.createElement("th")
    th.innerHTML = "大淘客链接"
    headTr.insertBefore(th, curTh)

    th = document.createElement("th")
    th.innerHTML = "文案"
    headTr.insertBefore(th, curTh)


    var trList = table.getElementsByTagName("tr")
    for (var i=0; i<trList.length; ++i) {
        var tr = trList[i]
        var a = tr.getElementsByTagName("a")[0]
        if(a) {
            console.log(a)
            var taobao_url = a.getAttribute("href")
            let idx = i
            $.get(`https://dtkapi.ffquan.cn/go_getway/proxy/search?platform=1&page=1&sortType=4&kw=${taobao_url}`, (data, status) => {
                // console.log(data, status)
                // console.log(data.data.search.list)
                let tr = trList[idx]
                var curTd = tr.getElementsByTagName("td")[0]
                var td = document.createElement("td")
                tr.insertBefore(td, curTd)

                var tdDesc = document.createElement("td")
                tr.insertBefore(tdDesc, curTd)
                if (data.data.search.list.length > 0) {
                    var product = data.data.search.list[0]
                    td.innerHTML = `<a href="https://www.dataoke.com/item?id=${product.id}" target="_blank">
<img src="${product.main_pic}"/>
<p>${product.d_title}</p>
</a>`
                    /*
                    $.post("https://www.dataoke.com/dtpwd", {
                        gid: product.id,
                        type: 2,
                        referer: "https%3A%2F%2Fwww.dataoke.com%2Fpmc%2Ftlj-list.html%3Fpmc%252Ftlj-list_html%3D%26page%3D1%26per-page%3D10",
                    }, (result) => {
                        console.log("获取淘口令", result)
                    })
                    */
                    $.post("https://www.dataoke.com/detailtpl", {
                        gid: product.id,
                        type: 1,
                    }, (result) => {
                        console.log("获取描述", result)
                        var content = result.data.tpl2
                        let tr = trList[idx]
                        var taokoulingElement = tr.getElementsByClassName("tlj-table-copy")[1].parentNode
                        console.log("淘口令", taokoulingElement.innerText)
                        var taokouling = taokoulingElement.innerText
                        tr.insertBefore(tdDesc, curTd)
                        // console.log("before replace", content)
                        content = content.replace(/\(\w+\)\:\//, `${taokouling}:/`)
                        content = content.replace(/\(.*?\[.*?\].*?\)\:\//, `${taokouling}:/`)
                        // console.log("after replace", content)
                        tdDesc.innerHTML = `<span>${content}</span><button class="tlj-table-copy"></button>`
                        tdDesc.style.setProperty("min-width", "200px")

                        /*
                        var clipboard = new Clipboard('#copy-content-btn', {
                            target: function(trigger) {
                                return trigger.previousElementSibling;
                            }
                        });

                        clipboard.on('success', function(e) {
                            layer.msg('复制成功');
                        });
                        */
                    })
                } else {
                    var a = tr.getElementsByTagName("a")[0]
                    var taobao_url = a.getAttribute("href")
                    td.innerHTML = taobao_url
                }
            })
        }
    }

})();