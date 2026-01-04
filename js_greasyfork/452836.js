// ==UserScript==
// @name         采蘑菇网辅助脚本
// @namespace    https://www.caimogu.cc/
// @version      0.2.5
// @license      MIT
// @description  帮助用户记录下载的历史MOD, 添加bing搜索引擎：好过没有吧😂
// @author       折戟沉沙丶丿
// @match        https://www.caimogu.cc/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=caimogu.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452836/%E9%87%87%E8%98%91%E8%8F%87%E7%BD%91%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/452836/%E9%87%87%E8%98%91%E8%8F%87%E7%BD%91%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const undef = undefined
    const limit_size = 10
    const free_attachment = []

    // 加载JQ
    // 踩蘑菇自带了，导致附件窗内口无法点击
    // let script = document.querySelector("#jQuery")
    // if (!script) {
    //     let link = "https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js"
    //     script = document.createElement('script');
    //     script.id = "jQuery"
    //     script.src = link
    //     document.body.appendChild(script)

    //     function stdOnEnd() {
    //         script.onload = function () {
    //             this.onerror = this.onload = null
    //             _ready()
    //         }
    //         script.onerror = function () {
    //             this.onerror = this.onload = null
    //             console.err('Failed to load ' + link)
    //         }
    //     }

    //     function ieOnEnd() {
    //         script.onreadystatechange = function () {
    //             if (this.readyState !== 'complete' && this.readyState !== 'loaded') return
    //             this.onreadystatechange = null
    //              _ready()
    //         }
    //     }

    //     ('onload' in script ? stdOnEnd : ieOnEnd)()
    // }
    $(_ready)

    // 就绪
    function _ready() {
        if (location.pathname == "/user/my/collect.html") {
            loadHistory(function(list) {
                let tabs = $(".info-container > .tabs")
                tabs.append("<div id=histry class=item><span class=txt>历史</span></div>")
                let $history = $("#histry")
                $history.click(function() {
                    let tab = tabs.find(".active")[0]
                    if (tab.id === "histry") return
                    $(tab).removeClass("active")
                    $history.addClass("active")
                    $(".list-container > .list[data-target]").css("display", "none")
                    $(".list-container > #list-histry").css("display", "")
                    $(".list-container > .pagination-block > div").each(function(idx, item) {
                        if (!$(item).hasClass("hide")) $(item).addClass("hide")
                    })
                    $("#histry-limit").removeClass("hide")
                    historyRender(list)
                })
                $("<div id=list-histry class=list data-target=post style='display:none'></div>").insertBefore(".list-container > .pagination-block")
                $(".list-container > .pagination-block").append(
                `<div id=histry-limit class="pagination-container hide">
                    <div class="pagination">
                        <span class="prev"></span><div class="active">1</div><span class="next"></span>
                    </div>
                    <div class="pagination-jump">
                        <input type="text" data-max="1"><div class="split"></div><div class="total-page">1</div>
                    </div>
                </div>`)


                $("#histry-limit .prev").click(function() {
                    if ($(this).hasClass("active")) {
                        let curr = $("#histry-limit .pagination > div[class='active']")
                        curr.removeClass("active")
                        curr.prev("div").addClass("active")
                        historyRender(list)
                    }
                })
                $("#histry-limit .next").click(function() {
                    if ($(this).hasClass("active")) {
                        let curr = $("#histry-limit .pagination > div[class='active']")
                        curr.removeClass("active")
                        curr.next("div").addClass("active")
                        historyRender(list)
                    }
                })
                $("#histry-limit input").keydown(function(e) {
                    if (e.keyCode === 13) {
                        const total = parseInt($(e.target).attr("data-max"))
                        const input = parseInt(e.target.value)
                        e.target.value = ""
                        if (isNaN(input)) {
                            return
                        }
                        let curr = $("#histry-limit .pagination > div[class='active']")
                        if (input >= 1 && input <= total && input != curr.text()) {
                            curr.text(input)
                            historyRender(list)
                        }
                    }
                })
            })
        }

        if (/^\/post\/[0-9]+[.]html/.test(location.pathname)) {
            $(".attachment-container .download").each(function(idx, item) {
                if ($(".attachment-container .point").text().trim() === "免费") {
                    free_attachment.push($(item).attr("data-id"))
                    let maxAsk = 10
                    function _ask() {
                        setTimeout(function() {
                            const $free = $(".attachment-info-float .address")
                            if ($free.length === 0 && 0 < maxAsk--) {
                                _ask()
                            } else {
                                $free && $free.click(function() {
                                    saveHistory(location.pathname.replace(/[^0-9]/ig, ""))
                                })
                            }
                        }, 100)
                    }
                    $(item).click(function() {
                        _ask()
                    })
                }
            })
        }

        // 高级搜索
        $(`<div id=adv-search_1 style='padding-bottom: 10px'>
            <a href='javascript:;' style='
                font-size: 12px;
                position: relative;
                left: calc(100% - 72px);
            '>高级搜索</a>
        </div>`).insertBefore(".search-bar > .search-float > .init > div:first")
        $(`<div id=adv-search_2>
                <a id=adv-hide href='javascript:;' style='
                    font-size: 12px;
                    position: relative;
                    left: calc(100% - 72px);
                '>收起</a>
                <iframe style='
                    display: block;
                    width: 498px;
                    height: 550px;
                ' name="adv-search" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowTransparency="true" srcdoc='
                    <div>
                        <head>
                        <style>${googleStyles}</style>
                        </head>
                        ${googleBody}
                    </div>
                '/>
            </div>`).appendTo(".search-bar > .search-float")

        $("#adv-search_2").hide()
        $("#adv-search_1").click(function() {
            $(".search-bar > .search-float > .init").hide()
            $("#adv-search_2").show()
        })
        $("#adv-hide").click(function() {
            $(".search-bar > .search-float > .init").show()
            $("#adv-search_2").hide()
        })

        window.frames['adv-search'].caimogu = {
            submit: (doc) => {
                const data = $(doc).find("form").serializeArray()
                console.log(data)
                let searchVal = "https://cn.bing.com/search?q="
                let as_occt = ""
                for(const idx in data) {
                    const d = data[idx]
                    console.log(d)
                    switch(d.name) {
                        case "as_sitesearch": {
                            searchVal += "site:" + d.value + " "
                            break
                        }
                        case "as_occt": {
                            as_occt = d.value
                            break
                        }
                        case "as_q": {
                            searchVal += as_occt + d.value + " "
                            break
                        }
                        case "as_epq": {
                            const val = d.value.trim()
                            if (val === "") break
                            searchVal += "\"" + val.split(" ").join("\" \"") + "\" "
                            break
                        }
                        case "as_oq": {
                            const val = d.value.trim()
                            if (val === "") break
                            searchVal += val.split(" ").join(" OR ") + " "
                            break
                        }
                        case "as_eq": {
                            const val = d.value.trim()
                            if (val === "") break
                            searchVal += "-" + val.split(" ").join(" -") + " "
                            break
                        }
                    }
                }
                window.open(searchVal.trim())
            }
        }
    }

    // 加载历史数据
    function loadHistory(call) {
        function _create() {
            $.ajax({
                url: "https://www.caimogu.cc/post/act/save_drafts",
                type: "POST",
                data: {
                    title: "#####怪物猎人崛起Mod 下载历史#####",
                    content: "<p></p>",
                    cid: 345,
                    price: 0,
                    attach: [],
                    did: 0
                },
                success(res) {
                    call([], res.data.id)
                }
            })
        }

        // if (location.pathname == "/user/my/collect.html") {
            $.ajax({
                url: "https://www.caimogu.cc/user/act/my_list?act=drafts&page=1",
                type: "GET",
                success(res) {
                    for (var i = 0; i < res.data.list.length; i++) {
                        if (res.data.list[i].title === "#####怪物猎人崛起Mod 下载历史#####") {
                            let content = res.data.list[i].content
                            call(content === "" ? [] : content.split(","), res.data.list[i].id)
                            return
                        }
                    }
                     _create()
                }
            })
        // }
    }

    // 渲染页面
    function historyRender(total) {
        function limit(page, size) {
            debugger
            let retur = []
            let maxIdx = (page - 1) * size
            for (var i = maxIdx; i < Math.min(maxIdx + size, total.length); i++) {
                retur.push(total[i])
            }
            return retur
        }

        const total_page = parseInt((total.length + limit_size - 1) / limit_size)
        $("#histry-limit .total-page").text(total_page)
        $("#histry-limit input").attr("data-max", total_page)
        const curr = parseInt($("#histry-limit .pagination > div[class='active']").text())
        const list = limit(curr, limit_size)
        let l, r = 0
        // 1 2 3 4 5
        if (curr - 2 < 1) {
            l = 1, r = 5
        } else if (curr + 2 > total_page) {
            l = total_page - 5, r = total_page
        } else {
            l = curr - 2, r = curr + 2
        }

        $("#histry-limit .pagination > div").remove()
        for (var i = l; i <= r; i++) {
            if (i >= 1 && i <= total_page) {
                const $_ = $(`<div class=${i === curr ? 'active':''}>${i}</div>`)
                $_.insertBefore("#histry-limit .next")
                if (i !== curr) {
                    $_.click(function() {
                        $("#histry-limit .pagination > div[class='active']").removeClass("active")
                        $_.addClass("active")
                        historyRender(total)
                    })
                }
            }
        }

        ($("#histry-limit .prev")[curr !== 1 ? 'addClass':'removeClass'])("active");
        ($("#histry-limit .next")[curr !== total_page ? 'addClass':'removeClass'])("active")

        $("#list-histry").html("")
        function promi(idx, list) {
            if (idx >= list.length) return
            $.ajax({
                url: `https://www.caimogu.cc/post/${list[idx]}.html`,
                type: "GET",
                success(res) {
                    const $html = $(res)
                    const htmlAvatar = $html.find(".author-container > a")
                    const htmlNickname = $html.find(".author-container .author-nickname").text()
                    const title = $html.find(".post-content-container > .title").text()
                    const htmlTags = $html.find(".post-content-container > .tags-container")
                    $html.find (".post-content-container > .post-content-txt > .post-sidebar").remove()
                    const content = $html.find(".post-content-container > .post-content-txt").text().trim().substr(0, 160) + " ..."
                    const imgs = $html.find(".post-content-container > .post-content-txt .ql-align-center > img")
                    function buildLink(href, text, classes = "title") {
                        if (!href) href = "https://www.caimogu.cc/post/" + list[idx] + ".html"
                        return "<a href=" + href + " class='" + classes + "' target=_blank>" + text + "</a>"
                    }

                    function buildImgs() {
                        let html = ""
                        for (var i = 0; i < Math.min(3, imgs.length); i++) {
                            html += buildLink(undef, "<img src=" + $(imgs[i]).attr("data-source") + ">")
                        }
                        return html
                    }

                    let html =
                    `<div class=item>
                        <div class=avatar>${buildLink(htmlAvatar.attr("href"), htmlAvatar.html())}</div>
                        <div class='content${idx >= list.length - 1 ? " last" : ""}'>
                            <div class=author>${buildLink(htmlAvatar.attr("href"), htmlNickname, "nickname")}<span class="time"> - </span></div>
                            ${buildLink(undef, title)}
                            <div class=text>${buildLink(undef, content)}</div>
                            <div class=image>${buildImgs()}</div>
                            <div class=tag>${htmlTags.html()}</div>
                            <div class=action />
                        </div>
                    </div>`
                    $("#list-histry").append(html)
                    promi(idx + 1, list)
                }
            })
        }

        promi(0, list)
    }


    function recordHttpLog() {
        // 监听ajax的状态
        const origin = {
            open: XMLHttpRequest.prototype.open,
            send: XMLHttpRequest.prototype.send
        }
        XMLHttpRequest.prototype.open = function() {
            //console.log("open", arguments, this)
            this._oargs_ = arguments
            origin.open.apply(this, arguments)
        }
        XMLHttpRequest.prototype.send = function(a, b) {
            //console.log("send", arguments)
            this._sargs_ = arguments
            origin.send.apply(this, arguments)
        }

        function ajaxEventTrigger(event) {
            var ajaxEvent = new CustomEvent(event, {
                detail: this
            })
            //console.log('ajaxEvent', ajaxEvent)

            // if (ajaxEvent.type === "ajaxLoadEnd" && /https:\/\/www.caimogu.cc\/post\/attachment\/[0-9]+/.test(ajaxEvent.detail.responseURL)) {
            //     debugger
            // }
            if (ajaxEvent.type === "ajaxLoadEnd" && "https://www.caimogu.cc/post/act/buy_attachment" === ajaxEvent.detail.responseURL) {
                if (ajaxEvent.detail.status === 200) {
                    const res = JSON.parse(ajaxEvent.detail.responseText)
                    if (res.status === 1) {
                        saveHistory(location.pathname.replace(/[^0-9]/ig, ""))
                    }
                }
            }
            window.dispatchEvent(ajaxEvent)
        }
        var OldXHR = window.XMLHttpRequest
        function newXHR() {
            var realXHR = new OldXHR()
            realXHR.addEventListener('abort', function() { ajaxEventTrigger.call(this, 'ajaxAbort') }, false)
            realXHR.addEventListener('error', function() { ajaxEventTrigger.call(this, 'ajaxError') }, false)
            realXHR.addEventListener('load', function() { ajaxEventTrigger.call(this, 'ajaxLoad') }, false)
            realXHR.addEventListener('loadstart', function() { ajaxEventTrigger.call(this, 'ajaxLoadStart') }, false)
            realXHR.addEventListener('progress', function() { ajaxEventTrigger.call(this, 'ajaxProgress') }, false)
            realXHR.addEventListener('timeout', function() { ajaxEventTrigger.call(this, 'ajaxTimeout') }, false)
            realXHR.addEventListener('loadend', function() { ajaxEventTrigger.call(this, 'ajaxLoadEnd') }, false)
            realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange') }, false)
            return realXHR
        }

        window.XMLHttpRequest = newXHR
    }
    recordHttpLog()


    function saveHistory(id) {
        loadHistory(function(list, oldId = 0) {
            if (list.indexOf(id) !== -1) return
            list.unshift(id)
            $.ajax({
                url: "https://www.caimogu.cc/post/act/save_drafts",
                type: "POST",
                data: {
                    title: "#####怪物猎人崛起Mod 下载历史#####",
                    content: "<p>" + list.join(",") + "</p>",
                    cid: 345,
                    price: 0,
                    attach: [],
                    did: oldId
                },
                success(r) {
                    /*$.ajax({
                        url: "https://www.caimogu.cc/user/act/del_drafts",
                        type: "POST",
                        data: { id : oldId },
                        success(res) { console.log(res) }
                    })*/
                }
            })
        })
    }




    const googleStyles = `.goog-inline-block{position:relative;display:-moz-inline-box;display:inline-block }* html .goog-inline-block{display:inline }*:first-child+html .goog-inline-block{display:inline }.jfk-button{-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;cursor:default;font-size:11px;font-weight:bold;text-align:center;white-space:nowrap;margin-right:16px;height:27px;line-height:27px;min-width:54px;outline:0;padding:0 8px }.jfk-button-hover{-webkit-box-shadow:0 1px 1px rgba(0,0,0,.1);-moz-box-shadow:0 1px 1px rgba(0,0,0,.1);box-shadow:0 1px 1px rgba(0,0,0,.1) }.jfk-button-selected{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);box-shadow:inset 0 1px 2px rgba(0,0,0,0.1) }.jfk-button .jfk-button-img{margin-top:-3px;vertical-align:middle }.jfk-button-label{margin-left:5px }.jfk-button-narrow{min-width:34px;padding:0 }.jfk-button-collapse-left,.jfk-button-collapse-right{z-index:1 }.jfk-button-collapse-left.jfk-button-disabled{z-index:0 }.jfk-button-checked.jfk-button-collapse-left,.jfk-button-checked.jfk-button-collapse-right{z-index:2 }.jfk-button-collapse-left:focus,.jfk-button-collapse-right:focus,.jfk-button-hover.jfk-button-collapse-left,.jfk-button-hover.jfk-button-collapse-right{z-index:3 }.jfk-button-collapse-left{margin-left:-1px;-moz-border-radius-bottomleft:0;-moz-border-radius-topleft:0;-webkit-border-bottom-left-radius:0;-webkit-border-top-left-radius:0;border-bottom-left-radius:0;border-top-left-radius:0 }.jfk-button-collapse-right{margin-right:0;-moz-border-radius-topright:0;-moz-border-radius-bottomright:0;-webkit-border-top-right-radius:0;-webkit-border-bottom-right-radius:0;border-top-right-radius:0;border-bottom-right-radius:0 }.jfk-button.jfk-button-disabled:active{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none }.jfk-button-action{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;background-color:#4d90fe;background-image:-webkit-linear-gradient(top,#4d90fe,#4787ed);background-image:-moz-linear-gradient(top,#4d90fe,#4787ed);background-image:-ms-linear-gradient(top,#4d90fe,#4787ed);background-image:-o-linear-gradient(top,#4d90fe,#4787ed);background-image:linear-gradient(top,#4d90fe,#4787ed);border:1px solid #3079ed;color:#fff }.jfk-button-action.jfk-button-hover{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;background-color:#357ae8;background-image:-webkit-linear-gradient(top,#4d90fe,#357ae8);background-image:-moz-linear-gradient(top,#4d90fe,#357ae8);background-image:-ms-linear-gradient(top,#4d90fe,#357ae8);background-image:-o-linear-gradient(top,#4d90fe,#357ae8);background-image:linear-gradient(top,#4d90fe,#357ae8);border:1px solid #2f5bb7;border-bottom-color:#2f5bb7 }.jfk-button-action:focus{-webkit-box-shadow:inset 0 0 0 1px #fff;-moz-box-shadow:inset 0 0 0 1px #fff;box-shadow:inset 0 0 0 1px #fff;border:1px solid #fff;border:rgba(0,0,0,0) solid 1px;outline:1px solid #4d90fe;outline:rgba(0,0,0,0) 0 }.jfk-button-action.jfk-button-clear-outline{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;outline:none }.jfk-button-action:active{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);background:#357ae8;border:1px solid #2f5bb7;border-top:1px solid #2f5bb7 }.jfk-button-action.jfk-button-disabled{background:#4d90fe;filter:alpha(opacity=50);opacity:.5 }.jfk-button-contrast{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;background-color:#f5f5f5;background-image:-webkit-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:-moz-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:-ms-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:-o-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:linear-gradient(top,#f5f5f5,#f1f1f1);color:#444;border:1px solid #dcdcdc;border:1px solid rgba(0,0,0,0.1) }.jfk-button-contrast.jfk-button-hover,.jfk-button-contrast.jfk-button-clear-outline.jfk-button-hover{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;background-color:#f8f8f8;background-image:-webkit-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-moz-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-ms-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-o-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:linear-gradient(top,#f8f8f8,#f1f1f1);border:1px solid #c6c6c6;color:#333 }.jfk-button-contrast:active,.jfk-button-contrast.jfk-button-hover:active{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);box-shadow:inset 0 1px 2px rgba(0,0,0,.1);background:#f8f8f8 }.jfk-button-contrast.jfk-button-selected,.jfk-button-contrast.jfk-button-clear-outline.jfk-button-selected{background-color:#eee;background-image:-webkit-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-moz-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-ms-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-o-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:linear-gradient(top,#f8f8f8,#f1f1f1);border:1px solid #ccc;color:#333 }.jfk-button-contrast.jfk-button-checked,.jfk-button-contrast.jfk-button-clear-outline.jfk-button-checked{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);box-shadow:inset 0 1px 2px rgba(0,0,0,.1);background-color:#eee;background-image:-webkit-linear-gradient(top,#eee,#e0e0e0);background-image:-moz-linear-gradient(top,#eee,#e0e0e0);background-image:-ms-linear-gradient(top,#eee,#e0e0e0);background-image:-o-linear-gradient(top,#eee,#e0e0e0);background-image:linear-gradient(top,#eee,#e0e0e0);border:1px solid #ccc;color:#333 }.jfk-button-contrast:focus{border:1px solid #4d90fe;outline:none }.jfk-button-contrast.jfk-button-clear-outline{border:1px solid #dcdcdc;outline:none }.jfk-button-contrast.jfk-button-disabled{background:#fff;border:1px solid #f3f3f3;border:1px solid rgba(0,0,0,0.05);color:#b8b8b8 }.jfk-button-contrast .jfk-button-img{opacity:.55 }.jfk-button-contrast.jfk-button-checked .jfk-button-img,.jfk-button-contrast.jfk-button-selected .jfk-button-img,.jfk-button-contrast.jfk-button-hover .jfk-button-img{opacity:.9 }.jfk-button-contrast.jfk-button-disabled .jfk-button-img{filter:alpha(opacity=33);opacity:.333 }.jfk-button-default{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;background-color:#3d9400;background-image:-webkit-linear-gradient(top,#3d9400,#398a00);background-image:-moz-linear-gradient(top,#3d9400,#398a00);background-image:-ms-linear-gradient(top,#3d9400,#398a00);background-image:-o-linear-gradient(top,#3d9400,#398a00);background-image:linear-gradient(top,#3d9400,#398a00);border:1px solid #29691d;color:#fff;text-shadow:0 1px rgba(0,0,0,0.1) }.jfk-button-default.jfk-button-hover{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;background-color:#368200;background-image:-webkit-linear-gradient(top,#3d9400,#368200);background-image:-moz-linear-gradient(top,#3d9400,#368200);background-image:-ms-linear-gradient(top,#3d9400,#368200);background-image:-o-linear-gradient(top,#3d9400,#368200);background-image:linear-gradient(top,#3d9400,#368200);border:1px solid #2d6200;border-bottom:1px solid #2d6200;text-shadow:0 1px rgba(0,0,0,0.3) }.jfk-button-default:focus{-webkit-box-shadow:inset 0 0 0 1px #fff;-moz-box-shadow:inset 0 0 0 1px #fff;box-shadow:inset 0 0 0 1px #fff;border:1px solid #fff;border:rgba(0,0,0,0) solid 1px;outline:1px solid #3d9400;outline:rgba(0,0,0,0) 0 }.jfk-button-default.jfk-button-clear-outline{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;outline:none }.jfk-button-default:active{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);background:#368200;border:1px solid #2d6200;border-top:1px solid #2d6200 }.jfk-button-default.jfk-button-disabled{background:#3d9400;filter:alpha(opacity=50);opacity:.5 }.jfk-button-primary{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;background-color:#d14836;background-image:-webkit-linear-gradient(top,#dd4b39,#d14836);background-image:-moz-linear-gradient(top,#dd4b39,#d14836);background-image:-ms-linear-gradient(top,#dd4b39,#d14836);background-image:-o-linear-gradient(top,#dd4b39,#d14836);background-image:linear-gradient(top,#dd4b39,#d14836);border:1px solid transparent;color:#fff;text-shadow:0 1px rgba(0,0,0,0.1);text-transform:uppercase }.jfk-button-primary.jfk-button-hover{-webkit-box-shadow:0 1px 1px rgba(0,0,0,0.2);-moz-box-shadow:0 1px 1px rgba(0,0,0,0.2);box-shadow:0 1px 1px rgba(0,0,0,0.2);background-color:#c53727;background-image:-webkit-linear-gradient(top,#dd4b39,#c53727);background-image:-moz-linear-gradient(top,#dd4b39,#c53727);background-image:-ms-linear-gradient(top,#dd4b39,#c53727);background-image:-o-linear-gradient(top,#dd4b39,#c53727);background-image:linear-gradient(top,#dd4b39,#c53727);border:1px solid #b0281a;border-bottom-color:#af301f }.jfk-button-primary:focus{-webkit-box-shadow:inset 0 0 0 1px #fff;-moz-box-shadow:inset 0 0 0 1px #fff;box-shadow:inset 0 0 0 1px #fff;border:1px solid #fff;border:rgba(0,0,0,0) solid 1px;outline:1px solid #d14836;outline:rgba(0,0,0,0) 0 }.jfk-button-primary.jfk-button-clear-outline{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;outline:none }.jfk-button-primary:active{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);background-color:#b0281a;background-image:-webkit-linear-gradient(top,#dd4b39,#b0281a);background-image:-moz-linear-gradient(top,#dd4b39,#b0281a);background-image:-ms-linear-gradient(top,#dd4b39,#b0281a);background-image:-o-linear-gradient(top,#dd4b39,#b0281a);background-image:linear-gradient(top,#dd4b39,#b0281a);border:1px solid #992a1b;border-top:1px solid #992a1b }.jfk-button-primary.jfk-button-disabled{background:#d14836;filter:alpha(opacity=50);opacity:.5 }.jfk-slideToggle{-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;-webkit-box-shadow:inset 0 1px 2px 0 rgba(0,0,0,.1);-moz-box-shadow:inset 0 1px 2px 0 rgba(0,0,0,.1);box-shadow:inset 0 1px 2px 0 rgba(0,0,0,.1);background-color:#f5f5f5;background-image:-webkit-linear-gradient(top,#eee,#e0e0e0);background-image:-moz-linear-gradient(top,#eee,#e0e0e0);background-image:-ms-linear-gradient(top,#eee,#e0e0e0);background-image:-o-linear-gradient(top,#eee,#e0e0e0);background-image:linear-gradient(top,#eee,#e0e0e0);border:1px solid #ccc;color:#666;font-weight:bold;height:27px;line-height:27px;margin-right:16px;outline:none;overflow:hidden;padding:0;position:relative;width:94px }.jfk-slideToggle-on,.jfk-slideToggle-off,.jfk-slideToggle-thumb{display:inline-block;text-align:center;text-transform:uppercase;width:47px }.jfk-slideToggle-on{-webkit-box-shadow:inset 0 1px 2px 0 rgba(0,0,0,.1);-moz-box-shadow:inset 0 1px 2px 0 rgba(0,0,0,.1);box-shadow:inset 0 1px 2px 0 rgba(0,0,0,.1);background-color:#398bf2;background-image:-webkit-linear-gradient(top,#3b93ff,#3689ee);background-image:-moz-linear-gradient(top,#3b93ff,#3689ee);background-image:-ms-linear-gradient(top,#3b93ff,#3689ee);background-image:-o-linear-gradient(top,#3b93ff,#3689ee);background-image:linear-gradient(top,#3b93ff,#3689ee);color:#fff;height:27px }.jfk-slideToggle-off{-webkit-border-radius:2px 2px 0 0;-moz-border-radius:2px 2px 0 0;border-radius:2px 2px 0 0 }.jfk-slideToggle-thumb{-webkit-box-shadow:0 1px 2px 0 rgba(0,0,0,.1);-moz-box-shadow:0 1px 2px 0 rgba(0,0,0,.1);box-shadow:0 1px 2px 0 rgba(0,0,0,.1);background-color:#f5f5f5;background-image:-webkit-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-moz-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-ms-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-o-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:linear-gradient(top,#f8f8f8,#f1f1f1);-webkit-transition:all .13s ease-out;-moz-transition:all .13s ease-out;-o-transition:all .13s ease-out;transition:all .13s ease-out;border:1px solid #ccc;display:block;height:27px;left:-1px;position:absolute;top:-1px }.jfk-slideToggle-thumb::after{content:"";background-image:-webkit-linear-gradient(left,#ccc 50%,transparent 50%),-webkit-linear-gradient(left,#ccc 50%,transparent 50%),-webkit-linear-gradient(left,#ccc 50%,transparent 50%),-webkit-linear-gradient(left,#ccc 50%,transparent 50%),-webkit-linear-gradient(left,#ccc 50%,transparent 50%);background-image:-moz-linear-gradient(left,#ccc 50%,transparent 50%),-moz-linear-gradient(left,#ccc 50%,transparent 50%),-moz-linear-gradient(left,#ccc 50%,transparent 50%),-moz-linear-gradient(left,#ccc 50%,transparent 50%),-moz-linear-gradient(left,#ccc 50%,transparent 50%);background-image:-ms-linear-gradient(left,#ccc 50%,transparent 50%),-ms-linear-gradient(left,#ccc 50%,transparent 50%),-ms-linear-gradient(left,#ccc 50%,transparent 50%),-ms-linear-gradient(left,#ccc 50%,transparent 50%),-ms-linear-gradient(left,#ccc 50%,transparent 50%);background-image:-o-linear-gradient(left,#ccc 50%,transparent 50%),-o-linear-gradient(left,#ccc 50%,transparent 50%),-o-linear-gradient(left,#ccc 50%,transparent 50%),-o-linear-gradient(left,#ccc 50%,transparent 50%),-o-linear-gradient(left,#ccc 50%,transparent 50%);background-image:linear-gradient(left,#ccc 50%,transparent 50%),linear-gradient(left,#ccc 50%,transparent 50%),linear-gradient(left,#ccc 50%,transparent 50%),linear-gradient(left,#ccc 50%,transparent 50%),linear-gradient(left,#ccc 50%,transparent 50%);background-position:0 0,0 2px,0 4px,0 6px,0 8px;background-repeat:repeat-x;background-size:2px 1px;display:block;height:9px;left:15px;position:absolute;top:9px;width:17px }.jfk-slideToggle.jfk-slideToggle-checked .jfk-slideToggle-thumb{left:47px }.jfk-slideToggle:focus{border:1px solid #4d90fe }.jfk-slideToggle.jfk-slideToggle-clearOutline{border:1px solid #ccc }.jfk-button-standard{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;background-color:#f5f5f5;background-image:-webkit-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:-moz-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:-ms-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:-o-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:linear-gradient(top,#f5f5f5,#f1f1f1);color:#444;border:1px solid #dcdcdc;border:1px solid rgba(0,0,0,0.1) }.jfk-button-standard.jfk-button-hover,.jfk-button-standard.jfk-button-clear-outline.jfk-button-hover{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;background-color:#f8f8f8;background-image:-webkit-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-moz-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-ms-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-o-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:linear-gradient(top,#f8f8f8,#f1f1f1);border:1px solid #c6c6c6;color:#333 }.jfk-button-standard:active,.jfk-button-standard.jfk-button-hover:active{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);box-shadow:inset 0 1px 2px rgba(0,0,0,.1);background:#f8f8f8;color:#333 }.jfk-button-standard.jfk-button-selected,.jfk-button-standard.jfk-button-clear-outline.jfk-button-selected{background-color:#eee;background-image:-webkit-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-moz-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-ms-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-o-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:linear-gradient(top,#f8f8f8,#f1f1f1);border:1px solid #ccc;color:#333 }.jfk-button-standard.jfk-button-checked,.jfk-button-standard.jfk-button-clear-outline.jfk-button-checked{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);box-shadow:inset 0 1px 2px rgba(0,0,0,.1);background-color:#eee;background-image:-webkit-linear-gradient(top,#eee,#e0e0e0);background-image:-moz-linear-gradient(top,#eee,#e0e0e0);background-image:-ms-linear-gradient(top,#eee,#e0e0e0);background-image:-o-linear-gradient(top,#eee,#e0e0e0);background-image:linear-gradient(top,#eee,#e0e0e0);border:1px solid #ccc;color:#333 }.jfk-button-standard:focus{border:1px solid #4d90fe;outline:none }.jfk-button-standard.jfk-button-clear-outline{border:1px solid #dcdcdc;border:1px solid rgba(0,0,0,0.1);outline:none }.jfk-button-standard.jfk-button-disabled{background:#fff;border:1px solid #f3f3f3;border:1px solid rgba(0,0,0,0.05);color:#b8b8b8 }.jfk-button-standard .jfk-button-img{opacity:.55 }.jfk-button-standard.jfk-button-checked .jfk-button-img,.jfk-button-standard.jfk-button-selected .jfk-button-img,.jfk-button-standard.jfk-button-hover .jfk-button-img{opacity:.9 }.jfk-button-standard.jfk-button-disabled .jfk-button-img{filter:alpha(opacity=33);opacity:.333 }.jfk-button-flat{-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;border:1px solid transparent;font-size:13px;font-weight:normal;height:21px;line-height:21px;margin-right:1px;min-width:0;padding:0 }.jfk-button-flat.jfk-button-hover,.jfk-button-flat.jfk-button-selected,.jfk-button-flat:focus,.jfk-button-flat:active{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none }.jfk-button-flat .jfk-button-img{height:21px;opacity:.55;width:21px }.jfk-button-flat .jfk-button-label{display:inline-block;margin:0;padding:0 1px }.jfk-button-flat.jfk-button-selected .jfk-button-img,.jfk-button-flat.jfk-button-hover .jfk-button-img{opacity:.9 }.jfk-button-flat.jfk-button-disabled .jfk-button-img{filter:alpha(opacity=33);opacity:.333 }.jfk-button-flat:focus{border:1px solid #4d90fe }.jfk-button-flat.jfk-button-clear-outline{border:1px solid transparent }.jfk-button-mini{background-color:#f5f5f5;background-image:-webkit-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:-moz-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:-ms-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:-o-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:linear-gradient(top,#f5f5f5,#f1f1f1);border:1px solid #dcdcdc;border:1px solid rgba(0,0,0,0.1);color:#444;height:17px;line-height:17px;min-width:22px;text-shadow:0 1px rgba(0,0,0,0.1) }.jfk-button-mini.jfk-button-hover,.jfk-button-mini.jfk-button-clear-outline.jfk-button-hover{background-color:#f8f8f8;background-image:-webkit-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-moz-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-ms-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-o-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:linear-gradient(top,#f8f8f8,#f1f1f1);border:1px solid #c6c6c6;text-shadow:0 1px rgba(0,0,0,0.3) }.jfk-button-mini:active{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);box-shadow:inset 0 1px 2px rgba(0,0,0,.1) }.jfk-button-mini.jfk-button-checked,.jfk-button-mini.jfk-button-clear-outline.jfk-button-checked{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);box-shadow:inset 0 1px 2px rgba(0,0,0,.1);background-color:#e0e0e0;background-image:-webkit-linear-gradient(top,#eee,#e0e0e0);background-image:-moz-linear-gradient(top,#eee,#e0e0e0);background-image:-ms-linear-gradient(top,#eee,#e0e0e0);background-image:-o-linear-gradient(top,#eee,#e0e0e0);background-image:linear-gradient(top,#eee,#e0e0e0);border:1px solid #ccc;color:#333 }.jfk-button-mini:focus{border:1px solid #4d90fe }.jfk-button-mini.jfk-button-clear-outline{border:1px solid #dcdcdc }.jfk-button-mini.jfk-button-disabled{background:#fff;border:1px solid #f3f3f3;border:1px solid rgba(0,0,0,0.05);color:#b8b8b8 }.jfk-colormenu.goog-menu{padding:0 }.jfk-palette{cursor:default;outline:none }.jfk-palette-table{empty-cells:show;margin:16px }.jfk-palette-cell{border:1px solid transparent;cursor:pointer;margin:0;position:relative }.jfk-palette-cell-hover{border:1px solid #000 }.jfk-palette-cell-selected{outline:1px solid #000 }.jfk-palette-colorswatch{height:16px;width:16px }.jfk-palette-cell-selected>.jfk-palette-colorswatch{background:url(//ssl.gstatic.com/ui/v1/colorpicker/checkmark.png) no-repeat 50% 50% }.jfk-colorwell{border:1px solid #d9d9d9 }.goog-menu{-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;-webkit-box-shadow:0 2px 4px rgba(0,0,0,0.2);-moz-box-shadow:0 2px 4px rgba(0,0,0,0.2);box-shadow:0 2px 4px rgba(0,0,0,0.2);-webkit-transition:opacity .218s;-moz-transition:opacity .218s;-o-transition:opacity .218s;transition:opacity .218s;background:#fff;border:1px solid #ccc;border:1px solid rgba(0,0,0,.2);cursor:default;font-size:13px;margin:0;outline:none;padding:6px 0;position:absolute }.goog-flat-menu-button{-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;background-color:#f5f5f5;background-image:-webkit-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:-moz-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:-ms-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:-o-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:linear-gradient(top,#f5f5f5,#f1f1f1);border:1px solid #dcdcdc;color:#444;cursor:default;font-size:11px;font-weight:bold;line-height:27px;list-style:none;margin:0 2px;min-width:46px;outline:none;padding:0 18px 0 6px;text-align:center;text-decoration:none }.goog-flat-menu-button-disabled{background-color:#fff;border-color:#f3f3f3;color:#b8b8b8 }.goog-flat-menu-button.goog-flat-menu-button-hover{background-color:#f8f8f8;background-image:-webkit-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-moz-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-ms-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-o-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:linear-gradient(top,#f8f8f8,#f1f1f1);-webkit-box-shadow:0 1px 1px rgba(0,0,0,.1);-moz-box-shadow:0 1px 1px rgba(0,0,0,.1);box-shadow:0 1px 1px rgba(0,0,0,.1);border-color:#c6c6c6;color:#333 }.goog-flat-menu-button.goog-flat-menu-button-focused{border-color:#4d90fe }.goog-flat-menu-button.goog-flat-menu-button-open,.goog-flat-menu-button.goog-flat-menu-button-active{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);box-shadow:inset 0 1px 2px rgba(0,0,0,.1);background-color:#eee;background-image:-webkit-linear-gradient(top,#eee,#e0e0e0);background-image:-moz-linear-gradient(top,#eee,#e0e0e0);background-image:-ms-linear-gradient(top,#eee,#e0e0e0);background-image:-o-linear-gradient(top,#eee,#e0e0e0);background-image:linear-gradient(top,#eee,#e0e0e0);border:1px solid #ccc;color:#333;z-index:2 }.goog-flat-menu-button-caption{vertical-align:top;white-space:nowrap }.goog-flat-menu-button-dropdown{border-color:#777 transparent;border-style:solid;border-width:4px 4px 0;height:0;width:0;position:absolute;right:5px;top:12px }.goog-flat-menu-button .goog-flat-menu-button-img{margin-top:-3px;opacity:.55;vertical-align:middle }.goog-flat-menu-button-active .goog-flat-menu-button-img,.goog-flat-menu-button-open .goog-flat-menu-button-img,.goog-flat-menu-button-selected .goog-flat-menu-button-img,.goog-flat-menu-button-hover .goog-flat-menu-button-img{opacity:.9 }.goog-flat-menu-button-active .goog-flat-menu-button-dropdown,.goog-flat-menu-button-open .goog-flat-menu-button-dropdown,.goog-flat-menu-button-selected .goog-flat-menu-button-dropdown,.goog-flat-menu-button-hover .goog-flat-menu-button-dropdown{border-color:#595959 transparent }.goog-flat-menu-button-left,.goog-flat-menu-button-right{z-index:1 }.goog-flat-menu-button-left.goog-flat-menu-button-disabled{z-index:0 }.goog-flat-menu-button-right:focus,.goog-flat-menu-button-hover.goog-flat-menu-button-collapse-right{z-index:2 }.goog-flat-menu-button-left:focus,.goog-flat-menu-button-hover.goog-flat-menu-button-collapse-left{z-index:2 }.goog-flat-menu-button-collapse-left{margin-left:-1px;-moz-border-radius-bottomleft:0;-moz-border-radius-topleft:0;-webkit-border-bottom-left-radius:0;-webkit-border-top-left-radius:0;border-bottom-left-radius:0;border-top-left-radius:0;min-width:0;padding-left:0;vertical-align:top }.goog-flat-menu-button-collapse-right{margin-right:0;-moz-border-radius-topright:0;-moz-border-radius-bottomright:0;-webkit-border-top-right-radius:0;-webkit-border-bottom-right-radius:0;border-top-right-radius:0;border-bottom-right-radius:0 }.goog-menuitem,.goog-tristatemenuitem,.goog-filterobsmenuitem{position:relative;color:#333;cursor:pointer;list-style:none;margin:0;padding:6px 8em 6px 30px;white-space:nowrap }.goog-menu-nocheckbox .goog-menuitem,.goog-menu-noicon .goog-menuitem{padding-left:16px;vertical-align:middle }.goog-menu-noaccel .goog-menuitem{padding-right:44px }.goog-menuitem-disabled{cursor:default }.goog-menuitem-disabled .goog-menuitem-accel,.goog-menuitem-disabled .goog-menuitem-content{color:#ccc !important }.goog-menuitem-disabled .goog-menuitem-icon{filter:alpha(opacity=30);opacity:.3 }.goog-menuitem-highlight,.goog-menuitem-hover{background-color:#eee;border-color:#eee;border-style:dotted;border-width:1px 0;padding-top:5px;padding-bottom:5px }.goog-menuitem-highlight .goog-menuitem-content,.goog-menuitem-hover .goog-menuitem-content{color:#333 }.goog-menuitem-checkbox,.goog-menuitem-icon{background-repeat:no-repeat;height:21px;left:3px;position:absolute;right:auto;top:3px;vertical-align:middle;width:21px }.goog-option-selected{background-image:url(//ssl.gstatic.com/ui/v1/menu/checkmark.png);background-repeat:no-repeat;background-position:left center }.goog-option-selected .goog-menuitem-content{color:#333 }.goog-menuitem-accel{color:#777;direction:ltr;left:auto;padding:0 6px;position:absolute;right:0;text-align:right }.goog-menuitem-mnemonic-hint{text-decoration:underline }.goog-menuitem-mnemonic-separator{color:#777;font-size:12px;padding-left:4px }.goog-slider{position:relative;outline:0 }.goog-slider-horizontal{height:18px }.goog-slider-vertical{width:18px }.goog-slider-thumb{background-color:#f5f5f5;background-image:-webkit-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:-moz-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:-ms-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:-o-linear-gradient(top,#f5f5f5,#f1f1f1);background-image:linear-gradient(top,#f5f5f5,#f1f1f1);-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;-webkit-transition:background-color .218s,border-color .218s,background-image .218s;-moz-transition:background-color .218s,border-color .218s,background-image .218s;-o-transition:background-color .218s,border-color .218s,background-image .218s;transition:background-color .218s,border-color .218s,background-image .218s;border:1px solid #dcdcdc;height:16px;position:absolute;width:16px }.goog-slider-thumb:hover{background-color:#f8f8f8;background-image:-webkit-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-moz-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-ms-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-o-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:linear-gradient(top,#f8f8f8,#f1f1f1);border-color:#c6c6c6 }.goog-slider-scale{position:absolute }.goog-slider-horizontal .goog-slider-scale{border-top:1px solid #ccc;top:8px;width:100% }.goog-slider-vertical .goog-slider-scale{border-left:1px solid #ccc;height:100%;left:8px }.jfk-textinput{-webkit-border-radius:1px;-moz-border-radius:1px;border-radius:1px;border:1px solid #d9d9d9;border-top:1px solid #c0c0c0;font-size:13px;height:25px;padding:1px 8px }.jfk-textinput:focus{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);border:1px solid #4d90fe;outline:none }.jfk-textinput::-ms-clear{display:none }.jfk-scrollbar::-webkit-scrollbar{height:16px;overflow:visible;width:16px }.jfk-scrollbar::-webkit-scrollbar-button{height:0;width:0 }.jfk-scrollbar::-webkit-scrollbar-track{background-clip:padding-box;border:solid transparent;border-width:0 0 0 4px }.jfk-scrollbar::-webkit-scrollbar-track:horizontal{border-width:4px 0 0 }.jfk-scrollbar::-webkit-scrollbar-track:hover{background-color:rgba(0,0,0,.05);box-shadow:inset 1px 0 0 rgba(0,0,0,.1) }.jfk-scrollbar::-webkit-scrollbar-track:horizontal:hover{box-shadow:inset 0 1px 0 rgba(0,0,0,.1) }.jfk-scrollbar::-webkit-scrollbar-track:active{background-color:rgba(0,0,0,.05);box-shadow:inset 1px 0 0 rgba(0,0,0,.14),inset -1px 0 0 rgba(0,0,0,.07) }.jfk-scrollbar::-webkit-scrollbar-track:horizontal:active{box-shadow:inset 0 1px 0 rgba(0,0,0,.14),inset 0 -1px 0 rgba(0,0,0,.07) }.jfk-scrollbar-dark.jfk-scrollbar::-webkit-scrollbar-track:hover{background-color:rgba(255,255,255,.1);box-shadow:inset 1px 0 0 rgba(255,255,255,.2) }.jfk-scrollbar-dark.jfk-scrollbar::-webkit-scrollbar-track:horizontal:hover{box-shadow:inset 0 1px 0 rgba(255,255,255,.2) }.jfk-scrollbar-dark.jfk-scrollbar::-webkit-scrollbar-track:active{background-color:rgba(255,255,255,.1);box-shadow:inset 1px 0 0 rgba(255,255,255,.25),inset -1px 0 0 rgba(255,255,255,.15) }.jfk-scrollbar-dark.jfk-scrollbar::-webkit-scrollbar-track:horizontal:active{box-shadow:inset 0 1px 0 rgba(255,255,255,.25),inset 0 -1px 0 rgba(255,255,255,.15) }.jfk-scrollbar::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.2);background-clip:padding-box;border:solid transparent;border-width:1px 1px 1px 6px;min-height:28px;padding:100px 0 0;box-shadow:inset 1px 1px 0 rgba(0,0,0,.1),inset 0 -1px 0 rgba(0,0,0,.07) }.jfk-scrollbar::-webkit-scrollbar-thumb:horizontal{border-width:6px 1px 1px;padding:0 0 0 100px;box-shadow:inset 1px 1px 0 rgba(0,0,0,.1),inset -1px 0 0 rgba(0,0,0,.07) }.jfk-scrollbar::-webkit-scrollbar-thumb:hover{background-color:rgba(0,0,0,.4);box-shadow:inset 1px 1px 1px rgba(0,0,0,.25) }.jfk-scrollbar::-webkit-scrollbar-thumb:active{background-color:rgba(0,0,0,0.5);box-shadow:inset 1px 1px 3px rgba(0,0,0,0.35) }.jfk-scrollbar-dark.jfk-scrollbar::-webkit-scrollbar-thumb{background-color:rgba(255,255,255,.3);box-shadow:inset 1px 1px 0 rgba(255,255,255,.15),inset 0 -1px 0 rgba(255,255,255,.1) }.jfk-scrollbar-dark.jfk-scrollbar::-webkit-scrollbar-thumb:horizontal{box-shadow:inset 1px 1px 0 rgba(255,255,255,.15),inset -1px 0 0 rgba(255,255,255,.1) }.jfk-scrollbar-dark.jfk-scrollbar::-webkit-scrollbar-thumb:hover{background-color:rgba(255,255,255,.6);box-shadow:inset 1px 1px 1px rgba(255,255,255,.37) }.jfk-scrollbar-dark.jfk-scrollbar::-webkit-scrollbar-thumb:active{background-color:rgba(255,255,255,.75);box-shadow:inset 1px 1px 3px rgba(255,255,255,.5) }.jfk-scrollbar-borderless.jfk-scrollbar::-webkit-scrollbar-track{border-width:0 1px 0 6px }.jfk-scrollbar-borderless.jfk-scrollbar::-webkit-scrollbar-track:horizontal{border-width:6px 0 1px }.jfk-scrollbar-borderless.jfk-scrollbar::-webkit-scrollbar-track:hover{background-color:rgba(0,0,0,.035);box-shadow:inset 1px 1px 0 rgba(0,0,0,.14),inset -1px -1px 0 rgba(0,0,0,.07) }.jfk-scrollbar-borderless.jfk-scrollbar-dark.jfk-scrollbar::-webkit-scrollbar-track:hover{background-color:rgba(255,255,255,.07);box-shadow:inset 1px 1px 0 rgba(255,255,255,.25),inset -1px -1px 0 rgba(255,255,255,.15) }.jfk-scrollbar-borderless.jfk-scrollbar::-webkit-scrollbar-thumb{border-width:0 1px 0 6px }.jfk-scrollbar-borderless.jfk-scrollbar::-webkit-scrollbar-thumb:horizontal{border-width:6px 0 1px }.jfk-scrollbar::-webkit-scrollbar-corner{background:transparent }body.jfk-scrollbar::-webkit-scrollbar-track-piece{background-clip:padding-box;background-color:#f5f5f5;border:solid #fff;border-width:0 0 0 3px;box-shadow:inset 1px 0 0 rgba(0,0,0,.14),inset -1px 0 0 rgba(0,0,0,.07) }body.jfk-scrollbar::-webkit-scrollbar-track-piece:horizontal{border-width:3px 0 0;box-shadow:inset 0 1px 0 rgba(0,0,0,.14),inset 0 -1px 0 rgba(0,0,0,.07) }body.jfk-scrollbar::-webkit-scrollbar-thumb{border-width:1px 1px 1px 5px }body.jfk-scrollbar::-webkit-scrollbar-thumb:horizontal{border-width:5px 1px 1px }body.jfk-scrollbar::-webkit-scrollbar-corner{background-clip:padding-box;background-color:#f5f5f5;border:solid #fff;border-width:3px 0 0 3px;box-shadow:inset 1px 1px 0 rgba(0,0,0,.14) }.jfk-radiobutton{display:inline-block;outline:none;padding:5px 7px;position:relative }.jfk-radiobutton-radio{-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;background:url(//ssl.gstatic.com/ui/v1/radiobutton/unchecked.png) -3px -3px;background:rgba(255,255,255,0);border:1px solid rgba(198,198,198,1);height:15px;left:7px;margin:0;outline:none;position:absolute;text-align:left;top:6px;width:15px }.jfk-radiobutton:active .jfk-radiobutton-radio{background:rgba(235,235,235,1);border-color:rgba(182,182,182,1) }.jfk-radiobutton:hover .jfk-radiobutton-radio{-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.1);-moz-box-shadow:inset 0 1px 1px rgba(0,0,0,.1);box-shadow:inset 0 1px 1px rgba(0,0,0,.1);border-color:rgba(182,182,182,1) }.jfk-radiobutton:focus .jfk-radiobutton-radio{border-color:rgba(77,144,254,1) }.jfk-radiobutton-checked .jfk-radiobutton-radio{background:url(//ssl.gstatic.com/ui/v1/radiobutton/checked.png) -3px -3px;background:rgba(255,255,255,0) }.jfk-radiobutton.jfk-radiobutton:focus .jfk-radiobutton-radio{background:url(//ssl.gstatic.com/ui/v1/radiobutton/unchecked_focused.png) -3px -3px;background:rgba(255,255,255,0) }.jfk-radiobutton-checked.jfk-radiobutton:focus .jfk-radiobutton-radio{background:url(//ssl.gstatic.com/ui/v1/radiobutton/checked_focused.png) -3px -3px;background:rgba(255,255,255,0) }.jfk-radiobutton-checked .jfk-radiobutton-radio::after{-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;background:rgba(96,96,96,1);border:2px solid #606060;box-sizing:border-box;content:"";display:block;height:7px;left:3px;position:relative;top:3px;width:7px }.jfk-radiobutton .jfk-radiobutton-label{cursor:default;margin-left:22px }.jfk-radiobutton-disabled .jfk-radiobutton-radio{background:url(//ssl.gstatic.com/ui/v1/radiobutton/unchecked-disabled.png) -3px -3px;background:rgba(255,255,255,0);border-color:rgba(241,241,241,1) }.jfk-radiobutton-disabled.jfk-radiobutton-checked .jfk-radiobutton-radio{background:url(//ssl.gstatic.com/ui/v1/radiobutton/checked-disabled.png) -3px -3px;background:rgba(255,255,255,0) }.jfk-radiobutton-disabled.jfk-radiobutton-checked .jfk-radiobutton-radio::after{background:rgba(184,184,184,1) }.jfk-radiobutton-disabled .jfk-radiobutton-label{color:#b8b8b8 }.jfk-radiobutton-disabled:active .jfk-radiobutton-radio,.jfk-radiobutton-disabled:hover .jfk-radiobutton-radio{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;background:rgba(255,255,255,1);border-color:rgba(241,241,241,1) }html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,font,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td{margin:0;padding:0;border:0;font-weight:inherit;font-style:inherit;font-size:100%;vertical-align:baseline;text-decoration:none }a:hover{text-decoration:underline }a:visited{color:#12c }ol,ul{list-style:none }html,body{height:100% }.appbar{color:#dd4b39;font-size:20px;margin:25px 35px }.appbar_b{border-bottom:1px solid #ebebeb }._KHb{float:left }._pX{background:url(//ssl.gstatic.com/ui/v1/zippy/arrow_down.png);background-position:right center;background-repeat:no-repeat;display:inline-block;float:right;height:4px;margin-right:8px;margin-top:12px;opacity:.667;vertical-align:middle;width:7px }._Jc:hover>._pX{opacity:.9 }.kd-menulist._aE{width:100% }._aE{padding:0;text-align:left;width:100% }._aE span.label{padding-left:8px }div._YR{padding-right:16px }div._Vkb{max-width:1140px;min-width:200px;width:96%;margin:40px 2% 0 45px }div._Ie{width:100%;clear:both }div._Ie div._Oj{clear:both }div._Ie div._P9,div._qpb{float:left;display:inline-block;min-width:167px;width:16%;font-size:16px;height:42px;font-weight:500;color:#333;vertical-align:middle }div._Ie div._Bmb{float:left;display:inline-block;min-width:167px;min-height:41px;vertical-align:middle;width:50% }div._Ie div._XQ{float:left;display:inline-block;width:33%;font-size:13px;font-weight:700;color:#777;padding-left:5px;vertical-align:middle }div._Ie div._Vm{float:left;display:inline-block;min-width:167px;width:16%;height:42px;color:#222;font-size:13px;line-height:16px;vertical-align:middle }div._Ie div._Ai{float:left;display:inline-block;min-width:167px;min-height:41px;vertical-align:middle;width:50% }div._Ie div._Rj{float:left;display:inline-block;width:32%;min-width:160px;margin:0 0 8px 1%;color:#555;font-size:11px;padding-left:5px;vertical-align:middle;position:relative }div._Ie div._FIb{clear:both;font-size:13px;line-height:16px;height:20px;text-align:left }div._yf{height:30px;display:table-cell;vertical-align:middle }div._Ie div._Ai input[type="text"],div._Ie div._Ai span._gRb{width:100%;text-align:left }div._Ie div._Ai select{width:100%;height:29px;font-weight:700;font-size:11px;background-color:#eee;line-height:27px;padding-left:4px;color:#333;border:1px solid #d9d9d9;border-top:1px solid #c0c0c0;display:inline-block;vertical-align:top;padding-left:2px;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-border-radius:1px }div._Ie div._Rj span._fq{color:#666;font-family:monospace;font-size:11px;white-space:pre }div._Mib{margin:18px 0;clear:both;border-top:1px solid #ebebeb }input._JQ{padding:0 12px }div._Ie div._Oj input._JQ{float:right;margin:10px 0 }@media (max-width:1056px){div._XQ{display:none !important }}div.bottom-wrapper{min-height:100%;margin:0 auto -60px }div.bottom-links-wrapper,div._UD{height:60px }div.bottom-links-wrapper{position:relative;z-index:10;width:100%;background-color:white }div.bottom-links{width:100%;position:absolute;bottom:0;text-align:center }div.bottom-links a{margin:0 8px;font-size:13px;white-space:nowrap;line-height:30px;color:#12c }._oB{width:100%;margin:0;padding:0;text-align:left;text-indent:4px }._nB{max-height:200px;z-index:12;overflow:auto }.slmarker{border-left:1px solid #d0d0d0;display:inline-block;height:9px;position:absolute;width:0;z-index:-1 }.slruler{height:9px;margin:0;padding:0;position:absolute;top:4px;width:100%;z-index:-1 }.goog-slider li{color:#343434;cursor:default;float:left;font-size:11px;font-weight:bold;line-height:17px;position:relative;text-align:left;top:20px }.goog-slider:focus .goog-slider-thumb{border:1px solid #4d90fe }.jfk-button-action:hover{background-color:#357ae8;background-image:-webkit-linear-gradient(top,#4d90fe,#357ae8);background-image:-moz-linear-gradient(top,#4d90fe,#357ae8);background-image:-ms-linear-gradient(top,#4d90fe,#357ae8);background-image:-o-linear-gradient(top,#4d90fe,#357ae8);background-image:linear-gradient(top,#4d90fe,#357ae8);border:1px solid #2f5bb7;border-image:initial }.jfk-radiobutton:focus{outline-width:0 }.jfk-palette-cell-nonselected{border:1px solid rgba(0,0,0,0.2);margin-top:-1px;margin-right:-1px }.jfk-radiobutton-label{font-size:13px }.colorpicker-container{background-color:white;outline:1px solid rgba(0,0,0,0.2) }`
    const googleBody = `<body><div class="bottom-wrapper"><div class="_Vkb"><form id="adv" action="javascript:window.caimogu.submit(window.document)" method="GET" name="f">
                <input class="jfk-textinput" value="caimogu.cc" id="_SKg" name="as_sitesearch" type="hidden"><div class="_Ie">
                <div class="_Oj">
                <div class="_Vm"><div class="_yf"><label for="_dKg">字词出现位置：</label></div></div><div class="_Ai"><div class="_YR">
                <div style="font-size: 12px; padding-bottom: 3px">
                <input type="radio" name="as_occt" value="" checked/>任何位置 
                <input type="radio" name="as_occt" value="intitle:"/>网页标题 
                <input type="radio" name="as_occt" value="inbody:"/>网页文本 <br/>
                </div>
                </div></div><div class="_Rj _YQ"></div></div>
                <div class="_Oj"><div class="_Vm"><div class="_yf"><label for="_dKg">以下所有字词：</label></div></div><div class="_Ai"><div class="_YR"><input class="jfk-textinput" value="" autofocus="autofocus" id="_dKg" name="as_q" type="text"></div></div><div class="_Rj _YQ"><div class="_yf">输入重要字词：
                <span class="_fq">折戟沉沙丶丿</span></div></div></div><div class="_Oj"><div class="_Vm"><div class="_yf"><label for="_aKg">与以下字词完全匹配：</label></div></div><div class="_Ai"><div class="_YR"><input class="jfk-textinput" value="" id="_aKg" name="as_epq" type="text"></div></div><div class="_Rj _YQ"><div class="_yf">用引号将需要完全匹配的字词引起：
                <span class="_fq">"MOD"</span></div></div></div><div class="_Oj"><div class="_Vm"><div class="_yf"><label for="_cKg">以下任意字词：</label></div></div><div class="_Ai"><div class="_YR"><input class="jfk-textinput" value="" id="_cKg" name="as_oq" type="text"></div></div><div class="_Rj _YQ"><div class="_yf">在所需字词之间添加
                <span class="_fq">或</span>：<span class="_fq">崛起 OR 教程</span></div></div></div><div class="_Oj"><div class="_Vm"><div class="_yf"><label for="_bKg">不含以下任意字词：</label></div></div><div class="_Ai"><div class="_YR"><input class="jfk-textinput" value="" id="_bKg" name="as_eq" type="text"></div></div><div class="_Rj _YQ"><div class="_yf">在不需要的字词前添加一个减号：
                <span class="_fq">-白嫖、-"点赞"</span></div></div></div><div class="_Oj">
                <div class="_Ie"><div class="_Oj"><div class="_Vm"></div><div class="_Ai" style="text-align:right"><input class="jfk-button jfk-button-action _JQ" style="-webkit-user-select:none;user-select:none;line-height:100%;height:30px;min-width:120px" value="高级搜索" type="submit"></div><div class="_Rj"></div></div><div class="_Oj"></div></div></form></div></div></body>`
})();