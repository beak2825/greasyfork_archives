// ==UserScript==
// @name         采集贴吧拼团信息
// @namespace    http://tampermonkey.net/
// @version      2024-07-30
// @description  采集贴吧拼团信息version
// @author       imzhi <yxz_blue@126.com>
// @match        https://tieba.baidu.com/f?ie=utf-8&kw=%E6%8B%BC%E5%A4%9A%E5%A4%9A%E6%8B%BC%E5%9B%A2*
// @match        https://tieba.baidu.com/f?kw=%E6%8B%BC%E5%A4%9A%E5%A4%9A%E6%8B%BC%E5%9B%A2*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/clipboard.js/2.0.10/clipboard.min.js
// @connect      work2000.cn
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502147/%E9%87%87%E9%9B%86%E8%B4%B4%E5%90%A7%E6%8B%BC%E5%9B%A2%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/502147/%E9%87%87%E9%9B%86%E8%B4%B4%E5%90%A7%E6%8B%BC%E5%9B%A2%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    // GM_deleteValue('__caiji_tieba_pintuan_page')
    // return

    function waitTime(time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, time)
        })
    }

    function dataParam(list) {
        const str_arr = []
        for (const [key, item] of Object.entries(list)) {
            const item_str = encodeURIComponent(item)
            str_arr.push(`${key}=${item_str}`)
        }
        return str_arr.join('&')
    }

    function reqPost(url, data) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'post',
                url,
                responseType: 'json',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data,
                onload: function(res){
                    resolve(res.response)
                }
            })
        })
    }

    function reqGet(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'get',
                url,
                onload: function(res){
                    resolve(res.response)
                }
            })
        })
    }

    await waitTime(2500)
    const tieba_name = $('.card_title_fname').text().trim().replace(/吧$/, '')
    await caiji()

    const pn = href_pn(location.href)
    if (check_last_pn(pn)) return
    await waitTime(500)

    const the_url = join_req_url(tieba_name, pn + 50)
    console.log('the_url______________', the_url)
    location.href = the_url


    // 构造 https://tieba.baidu.com/f?kw=%E6%8B%BC%E5%A4%9A%E5%A4%9A%E6%8B%BC%E5%9B%A2&ie=utf-8&pn=111150
    function join_req_url(kw, pn) {
        const pn_curr = pn || 0
        if (!pn_curr) {
            return `https://tieba.baidu.com/f?kw=${kw}&ie=utf-8`
        }
        return `https://tieba.baidu.com/f?kw=${kw}&ie=utf-8&pn=${pn_curr}`
    }

    function caiji() {
        return new Promise(resolve => {
            const len = $('.j_thread_list').length
            $('.j_thread_list').each(async function (i, el) {
                const $el = $(el)
                const $title = $el.find('.threadlist_title')
                const $link = $title.find('a')
                const $text = $el.find('.threadlist_text')
                const field_data = $el.data('field')
                // console.log('field_data________________', field_data)

                const tieba_id = field_data.id
                const link = $link.prop('href')
                const title = $title.text().trim()
                const author_name = field_data.author_name
                const author_nickname = field_data.author_nickname
                const first_post_id = field_data.first_post_id
                const content = $text.text().trim()
                const data_param = dataParam({
                    tieba_name,
                    tieba_id,
                    title,
                    link,
                    author_name,
                    author_nickname,
                    first_post_id,
                    content,
                })
                // console.log('data_param________________', data_param)
                const response = await reqPost('https://tool.work2000.cn/v_api/pintuan/write', data_param)
                console.log('onload________________', response)

                const response_get = await reqGet(link)
                const doc = new DOMParser().parseFromString(response_get, "text/html");
                // console.log('onload_response_get________________', response_get)
                console.log('onload_response_get________________', link, doc.querySelectorAll('.post-tail-wrap .tail-info')[3])

                if (i >= len - 1) resolve()
            })
        })

    }

    function href_pn(href) {
        const match = href.match(/&pn=(\d+)/)
        if (!match) {
            return 0
        }
        return +match[1]
    }

    function check_last_pn(pn) {
        const link = $('#frs_list_pager').find('a:last')
        if (!link.length) {
            return true
        }

        const last_pn = href_pn(link.prop('href'))
        // console.log('last_pn______________', last_pn)
        if (!last_pn) {
            return true
        }
        return pn >= last_pn
    }
})();