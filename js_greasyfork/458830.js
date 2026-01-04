// ==UserScript==
// @name        Javbus 工具
// @description  Javbus 瀑布流排序
// @namespace    https://github.com/LiHang941/srcript/
// @version      0.05
// @author       lihang1329
// @include      https://www.javbus.com/*
// @supportURL https://github.com/LiHang941/srcript
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458830/Javbus%20%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/458830/Javbus%20%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    let datas = Array.from($("div#waterfall div.item"));
    if(datas.length === 0){
        return
    }
    $("#waterfall").html('')
    let pages = $(".pagination a")
    let pageUrls = Array.from(pages).map(it => {
        let url = $(it).prop('href')
        let val = $(it).html()
        if (/\d+/.test(val)) {
            return {
                url: url,
                page:parseInt(val),
            }
        }
        return null
    }).filter(it => it != null)

    Promise.all(pageUrls.map(it => {
        let url = it.url
        let page = it.page
        const fetchwithcookie = fetch(url, { credentials: 'same-origin' });
        return fetchwithcookie.then(response => response.text())
            .then(html => new DOMParser().parseFromString(html, 'text/html'))
            .then(doc => {
                console.log(doc)
                let elems = $(doc).find("div#waterfall div.item");
                return {
                    elems,
                    url,
                    page
                };
            });

    })).then(arrs => {
        for (const arr of arrs) {
            for (const it of Array.from(arr.elems)) {
                datas.push(it)
            }
        }

    }).then(() => {
        window.datas = datas;
        datas = Array.from(datas).sort((a, b) => {
            let dateA = $($(a).find("date")[1]).html()
            let dateB = $($(b).find("date")[1]).html()
            return new Date(dateB).getTime() - new Date(dateA).getTime()
        })

        $("#waterfall").html(datas)
        $('.movie-box').css("height", "500px");
        $('#waterfall').masonry({
            itemSelector: ".item",
            isAnimated: false,
            isFitWidth: true
        });
    })





})();
