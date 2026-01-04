// ==UserScript==
// @name         京东评论合并工具
// @namespace    https://github.com/ClericPy/somethings
// @version      2.2
// @description  try to take over the world!
// @author       Clericpy
// @match        https://item.jd.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/402415/%E4%BA%AC%E4%B8%9C%E8%AF%84%E8%AE%BA%E5%90%88%E5%B9%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/402415/%E4%BA%AC%E4%B8%9C%E8%AF%84%E8%AE%BA%E5%90%88%E5%B9%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==



(function () {
    'use strict';
    var pages = {}


    window.auto_pager_running = false
    var css_to_hidden = {}
    window.backup_mc_innerHTML = ''
    var custom_css_to_hidden = ''
    var button_style = `font: inherit; margin: 3px; overflow: visible; text-transform: none; -webkit-appearance: button; letter-spacing: 0.01em; zoom: 1; line-height: normal; white-space: nowrap; vertical-align: middle; text-align: center; cursor: pointer; -webkit-user-drag: none; user-select: none; box-sizing: border-box; font-size: 100%; padding: .5em 1em; color: rgba(0,0,0,.8); border: none transparent; background-color: #e6e6e6; text-decoration: none; border-radius: 2px; font-family: inherit;`

    var new_style = document.createElement("style");
    new_style.setAttribute('type', 'text/css')
    new_style.setAttribute('id', 'new_style')
    document.getElementsByTagName('body')[0].appendChild(new_style)

    function alert_doc() {
        var doc = `
主要用途:
1. 京东的评论每次点翻页太麻烦了, 需要找关键词的时候又不能搜索, 只好全复制出来了
2. 偶尔需要语料

使用方法:
1. 加载网页以后, 在商品介绍 tab 位置会出现 [收集评论] 按钮, 点击
2. 可以手动点 [手动翻页], 一页页收集, 也可以配置好间隔秒数(默认2秒)点右边 checkbox 自动翻页
3. 采集结束(或自行停止)后, 点击 [展示全部] 按钮, 则评论会在原来位置对多页合并
4. 自行去噪过滤(可以通过选项, 也可以自己指定 css), 然后点击 [复制 TEXT] 即可复制到剪贴板
5. emoji [文本] 点击可以打开 Ubuntu 的 pastebin 来粘贴刚才复制了的文本    
        `
        alert(doc)
    }

    function check_missing_pages() {
        var exist_page_nums = Object.keys(pages).sort()
        var max_num = exist_page_nums[exist_page_nums.length - 1]
        var missing_page_nums = []
        var i = 1
        while (i < max_num) {
            if (!(i in exist_page_nums)) {
                missing_page_nums.push(i)
            }
            i++;
        }
        if (missing_page_nums.length > 0) {
            var span = document.getElementById('commenter_state')
            span.innerText = '页码缺失: ' + missing_page_nums
        } else {
            var span = document.getElementById('commenter_state')
            span.innerText = ''
        }

    }

    function add_class_for_filter() {
        document.querySelectorAll('#comment [style="display: block;"][data-tab="item"] a.comment-plus-icon').forEach(item => {
            item.parentElement.parentElement.parentElement.classList.add('commenter_plus_vip_item')
        });
        document.querySelectorAll('.comment-op').forEach(item => {
            if (item && !/\s*举报\s*\d+\s*0\s*/.test(item.innerText)) {
                item.parentElement.parentElement.parentElement.classList.add('commenter_with_reply')
            }
            if (item && !/\s*举报\s*0\s*\d+\s*/.test(item.innerText)) {
                item.parentElement.parentElement.parentElement.classList.add('commenter_with_like')
            }
        });

    }


    function collect_dom_to_pages() {
        var curr_page = document.querySelector('#comment [style="display: block;"][data-tab="item"] [class="ui-page-curr"]')
        let commenter_crawl_button = document.getElementById('commenter_crawl_button')
        if (!curr_page) {
            return
        }
        if (!commenter_crawl_button) {
            return
        }
        var page = curr_page.innerText
        console.log(Object.keys(pages).length + ' pages: ' + Object.keys(pages))

        commenter_crawl_button.innerText = '手动翻页 ' + page
        var node = document.querySelectorAll('#comment [style="display: block;"][data-tab="item"]>div.comment-item')
        if (node.length > 0) {
            let num = 0
            let page_num = pages.length
            for (const items of Object.values(pages)) {
                num += items.length
            }
            document.getElementById('commenter_status_bar').innerText = ' 已采集 ' + Object.keys(pages).length + ' 页 ' + num
            pages[page] = node
        }
        if (Object.keys(pages).length == 1) {
            let show_button = document.getElementById('commenter_show_button')
            show_button.disabled = false
            show_button.style.color = 'black'
        }
        check_missing_pages()
        // 反爬导致崩溃, 放上备用页面
        if (document.querySelector('#comment [style="display: block;"][data-tab="item"]')) {
            window.backup_mc_innerHTML = document.querySelector('#comment .mc').innerHTML
        } else {
            document.getElementById('commenter_status_bar').innerText = '没有评论了, 点击[展示全部]进行复制'
        }
        add_class_for_filter()
    }

    function filt_by_text() {
        let commenter_text_filter = document.getElementById('commenter_text_filter')
        let text_filters = []
        if (commenter_text_filter) {
            text_filters = commenter_text_filter.value.split(' ')
            if (text_filters == ['']) {
                text_filters = []
            }
        }
        for (const item of document.querySelectorAll('#comment [style="display: block;"][data-tab="item"]>.comment-item')) {
            var item_html = item.innerHTML
            if (!text_filters) {
                item.classList.remove('commenter_filt_by_text')
            }
            for (const text of text_filters) {
                if (text[0] == '-') {
                    if (item_html.includes(text.slice(1, text.length))) {
                        item.classList.add('commenter_filt_by_text')
                        break
                    }
                } else if (!item_html.includes(text)) {
                    item.classList.add('commenter_filt_by_text')
                    break
                } else {
                    item.classList.remove('commenter_filt_by_text')
                }
            }
        }
    }

    function show_pages() {
        var container = document.querySelector('#comment [style="display: block;"][data-tab="item"]')
        if (!container) {
            // 备用 container
            var mc_node = document.querySelector('#comment .mc')
            if (window.backup_mc_innerHTML) {
                mc_node.innerHTML = window.backup_mc_innerHTML
            }
        }
        var backup_np_node = document.getElementsByClassName('com-table-footer')[0]
        container.innerHTML = ''
        Object.keys(pages).sort().forEach(function (key) {
            let items = pages[key]
            items.forEach(item => {
                container.appendChild(item)
            });
        });
        document.getElementById('commenter_copy_button').style.display = 'inline-block'
        document.getElementById('commenter_copy_text_button').style.display = 'inline-block'
        if (backup_np_node) {
            container.appendChild(backup_np_node)
        }
        add_class_for_filter()
        filt_by_text()
    }

    function copy_html() {
        let items = document.querySelectorAll('#comment [style="display: block;"][data-tab="item"]>.comment-item')
        let text = ''
        let filt_plus = document.getElementById('commenter_non_plus_vip').checked
        let filt_reply = document.getElementById('commenter_non_reply').checked
        let filt_like = document.getElementById('commenter_non_like').checked
        items.forEach(item => {
            if (filt_plus && !item.classList.contains('commenter_plus_vip_item')) {
                return
            }
            if (filt_reply && !item.classList.contains('commenter_with_reply')) {
                return
            }
            if (filt_like && !item.classList.contains('commenter_with_like')) {
                return
            }
            if (item.classList.contains('commenter_filt_by_text')) {
                return
            }
            text += item.outerHTML
        });
        GM_setClipboard(text, 'text')
    }

    function copy_text() {
        let items = document.querySelectorAll('#comment [style="display: block;"][data-tab="item"]>.comment-item')
        let text = ''
        let filt_plus = document.getElementById('commenter_non_plus_vip').checked
        let filt_reply = document.getElementById('commenter_non_reply').checked
        let filt_like = document.getElementById('commenter_non_like').checked
        items.forEach(item => {
            if (filt_plus && !item.classList.contains('commenter_plus_vip_item')) {
                return
            }
            if (filt_reply && !item.classList.contains('commenter_with_reply')) {
                return
            }
            if (filt_like && !item.classList.contains('commenter_with_like')) {
                return
            }
            if (item.classList.contains('commenter_filt_by_text')) {
                return
            }
            text += item.innerText.replace('\n', ' ') + '\n'
        });
        GM_setClipboard(text, 'text')
    }

    function auto_pager_with_interval() {
        collect_next_page()
    }

    function shutdown_auto_pager() {
        if (window.auto_pager_running) {
            window.clearInterval(window.current_autopager)
            window.auto_pager_running = false
        }
    }

    function auto_next_page() {
        shutdown_auto_pager()
        var commenter_auto_np_node = document.getElementById('commenter_auto_np')
        if (commenter_auto_np_node.checked) {
            window.auto_pager_running = true
            var interval = document.getElementById('commenter_auto_np_interval').value
            window.current_autopager = setInterval(() => {
                auto_pager_with_interval()
            }, interval * 1000);

        } else {
            shutdown_auto_pager()
            return
        }
    }

    function update_new_style() {
        let hidden_list = ['.commenter_filt_by_text']
        Object.keys(css_to_hidden).forEach(key => {
            let value = css_to_hidden[key]
            if (value) {
                hidden_list.push(key)
            }
        });
        if (custom_css_to_hidden) {
            hidden_list.push(custom_css_to_hidden)
        }
        document.getElementById('new_style').innerHTML = hidden_list.join(',') + '{display: none;}\n'
    }

    function commenter_clear(checked, css_value) {
        css_to_hidden[css_value] = checked
        update_new_style()
    }

    function commenter_collect_layouts() {

        var head = document.getElementById('comment')
        var mc_node = document.querySelector('#comment .mc')

        var hr = document.createElement("hr");
        head.insertBefore(hr, mc_node)


        var show_button = document.createElement("button");
        show_button.innerText = '展示全部'
        show_button.setAttribute('id', 'commenter_show_button')
        show_button.setAttribute('style', button_style)
        show_button.disabled = true
        show_button.style.color = 'grey'
        show_button.addEventListener('click', show_pages)
        head.insertBefore(show_button, mc_node)

        var copy_button = document.createElement("button");
        copy_button.innerText = '复制 HTML'
        copy_button.setAttribute('id', 'commenter_copy_button')
        copy_button.setAttribute('style', button_style)
        copy_button.style.display = 'none'
        copy_button.addEventListener('click', copy_html)
        head.insertBefore(copy_button, mc_node)

        var copy_text_button = document.createElement("button");
        copy_text_button.innerText = '复制 TEXT'
        copy_text_button.setAttribute('id', 'commenter_copy_text_button')
        copy_text_button.setAttribute('style', button_style)
        copy_text_button.style.display = 'none'
        copy_text_button.addEventListener('click', copy_text)
        head.insertBefore(copy_text_button, mc_node)


        var pastebin = document.createElement("a");
        pastebin.innerText = '📋'
        pastebin.href = 'https://paste.ubuntu.com/'
        pastebin.target = '_blank'
        pastebin.style.margin = '2px'
        head.insertBefore(pastebin, mc_node)

        var commenter_state = document.createElement("span");
        commenter_state.setAttribute('id', 'commenter_state')
        commenter_state.setAttribute('style', 'padding: 0.5em;')
        head.insertBefore(commenter_state, mc_node)

        var commenter_auto_np_interval = document.createElement("input");
        commenter_auto_np_interval.setAttribute('id', 'commenter_auto_np_interval')
        commenter_auto_np_interval.setAttribute('value', '2')
        commenter_auto_np_interval.setAttribute('size', 1)
        commenter_auto_np_interval.setAttribute('style', 'text-align: center;')
        head.insertBefore(commenter_auto_np_interval, mc_node)

        var filter_node = document.createElement("div")
        filter_node.setAttribute('id', 'commenter_filter')
        filter_node.style.display = 'inline'
        filter_node.innerHTML = `
<label for="commenter_auto_np">
    <span style="weight: 1000; margin: 3px;">(s) <b>自动翻页</b>:</span>
    <input type="checkbox" id="commenter_auto_np">
</label>
<button id="commenter_crawl_button" disabled style="font-style: inherit; font-variant: inherit; font-weight: inherit; font-stretch: inherit; margin: 3px; overflow: visible; text-transform: none; -webkit-appearance: button; letter-spacing: 0.01em; zoom: 1; line-height: normal; white-space: nowrap; vertical-align: middle; text-align: center; cursor: pointer; -webkit-user-drag: none; user-select: none; box-sizing: border-box; font-size: 100%; padding: 0.5em 1em; color: grey; border: none transparent; background-color: rgb(230, 230, 230); text-decoration: none; border-radius: 2px; font-family: inherit; weight: 1000">手动翻页</button> | 
<button id="commenter_get_help">帮助</button>
<span id="commenter_status_bar"></span>
<hr><span><b>去噪:</b></span>
<label for="commenter_user"><input type="checkbox" checked name=".user-info" id="commenter_user">用户</label>
<label for="commenter_production"><input type="checkbox" checked name=".order-info>span:first-child" id="commenter_production">产品</label>
<label for="commenter_time"><input type="checkbox" checked name=".order-info>span:last-child" id="commenter_time">时间</label>
<label for="commenter_append"><input type="checkbox" checked name=".append-comment" id="commenter_append">追评</label>
<label for="commenter_append_time"><input type="checkbox" checked name=".append-comment>.append-time" id="commenter_append_time">追评时间</label>
<label for="commenter_other"><input type="checkbox" checked name=".comment-op,.user-level,.comment-star,.comment-message" id="commenter_other">冗余</label>
<label for="commenter_comment"><input type="checkbox" name=".comment-con" id="commenter_comment">文本</label>
<label for="commenter_comment_pics"><input type="checkbox" checked name=".pic-list" id="commenter_comment_pics">图片</label>
<label for="commenter_comment_video"><input type="checkbox" checked name=".J-video-view-wrap" id="commenter_comment_video">视频</label>
<label for="commenter_comment_tags"><input type="checkbox" checked name=".comment-info" id="commenter_comment_tags">标签</label>
<label for="commenter_seller_comment"><input type="checkbox" checked name=".recomment-con" id="commenter_seller_comment">卖家回复</label>
<label for="commenter_non_plus_vip"><input type="checkbox" name=".comment-item:not(.commenter_plus_vip_item)" title="如果选中, 则只显示 Plus 会员的评论" id="commenter_non_plus_vip">非 PLUS 会员</label>
<br>
<label for="commenter_non_reply"><input type="checkbox" name=".comment-item:not(.commenter_with_reply)" title="如果选中, 则只显示有回复的评论" id="commenter_non_reply">无回复</label>
<label for="commenter_non_like"><input type="checkbox" name=".comment-item:not(.commenter_with_like)" title="如果选中, 则只显示有点赞的评论" id="commenter_non_like">无赞</label>
<label for="commenter_comment_custom"><input type="text" style="width:10em;" value="" placeholder="自定义 CSS 过滤" id="commenter_comment_custom"></label>
<label for="commenter_text_filter"><input type="text" style="width:15em;" value="" placeholder="过滤词, 如'手机 -三星'" title="过滤词, 如'手机 -三星'" id="commenter_text_filter"></label>


<hr>
        `
        head.insertBefore(filter_node, mc_node)

        document.getElementById('commenter_get_help').addEventListener('click', alert_doc)
        document.getElementById('commenter_text_filter').addEventListener('input', filt_by_text)
        document.getElementById('commenter_crawl_button').addEventListener('click', collect_next_page)
        document.getElementById('commenter_auto_np').addEventListener('change', function () {
            auto_next_page()
        }, false)

        var filter_ids = ['commenter_user', 'commenter_production', 'commenter_time', 'commenter_append', 'commenter_append_time', 'commenter_other', 'commenter_comment', 'commenter_comment_pics', 'commenter_comment_video', 'commenter_comment_tags', 'commenter_seller_comment', 'commenter_non_plus_vip', 'commenter_non_reply', 'commenter_non_like']
        filter_ids.forEach(eid => {
            let node = document.getElementById(eid)
            css_to_hidden[node.name] = node.checked
            update_new_style()
            node.addEventListener('change', function () {
                commenter_clear(this.checked, this.name)
            })
        });
        let commenter_comment_custom = document.getElementById('commenter_comment_custom')

        commenter_comment_custom.addEventListener('input', function () {
            custom_css_to_hidden = this.value
            this.title = this.value
            update_new_style()
        })
        var tries = 0
        var checkExist = setInterval(function () {
            tries += 1
            if (document.getElementById('commenter_crawl_button')) {
                document.querySelectorAll('ul.filter-list>li').forEach(element => {
                    element.addEventListener('click', function () {
                        pages = {}
                    })
                });
                commenter_crawl_button.disabled = false
                commenter_crawl_button.style.color = 'black'
                collect_dom_to_pages()
                clearInterval(checkExist);
                return
            }
            if (tries > 20) {
                clearInterval(checkExist);
                return
            }
        }, 200);

    }

    function collect_next_page() {
        var np = document.querySelector('#comment [style="display: block;"][data-tab="item"] .ui-pager-next')
        if (!np) {
            shutdown_auto_pager()
            var commenter_auto_np_node = document.getElementById('commenter_auto_np')
            commenter_auto_np_node.checked = false
            document.getElementById('commenter_status_bar').innerText = '没有下一页, 点击[展示全部]进行复制'
            alert('没有下一页')
            return false
        } else {
            np.removeAttribute('href')
            np.click()
        }
        return true
    }

    function setup_commenter_collect_layouts() {
        if (document.getElementById('commenter_auto_np_interval')) {
            return
        }
        document.querySelector('[data-anchor="#comment"]').click()
        let observer = new MutationObserver(collect_dom_to_pages);
        let options = {
            'childList': true,
            'subtree': true,
            // 'characterData': true,
            // 'attributes': true,
        };
        // observer.observe(document.querySelector('#comment>.mc'), options)
        var tries = 0
        var checkExist = setInterval(function () {
            tries += 1
            var c0 = document.getElementById('comment-0')
            if (c0) {
                // console.log("Exists!");
                c0.setAttribute('style', 'display: block;')
                observer.observe(document.querySelector('#comment .mc >.comments-list>.tab-con'), options);
                commenter_collect_layouts()
                clearInterval(checkExist);
                return
            }
            if (tries > 20) {
                clearInterval(checkExist);
                return
            }
        }, 200);

    }

    function setup() {
        var tab = document.querySelector('#detail .tab-main>ul')
        var button = document.createElement("button");
        button.innerHTML = '<b>收集评论</b>'
        button.setAttribute('id', 'commenter_collect')
        button.setAttribute('style', button_style)
        button.style.zoom = '1.3'
        button.addEventListener('click', setup_commenter_collect_layouts)
        tab.appendChild(button)
    }
    window.onload = setup
})();
