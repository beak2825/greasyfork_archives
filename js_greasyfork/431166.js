// ==UserScript==
// @name         草榴社区一夜精品磁力搜索
// @namespace    https://greasyfork.org/zh-CN/scripts/431166
// @version      0.4.2
// @description  在skrbt网站中搜索资源，复制磁力哈希下载资源，而不是使用那些什么垃圾网盘，大多数资源都能在skrbt网站搜索到。
// @author       木羊羽
// @include      https://cl.*x.xyz/htm_data/*
// @include      https://t66y.com/htm_data/*
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.8/clipboard.js
// @resource css https://www.layuicdn.com/layui/css/layui.css
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/431166/%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%E4%B8%80%E5%A4%9C%E7%B2%BE%E5%93%81%E7%A3%81%E5%8A%9B%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/431166/%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%E4%B8%80%E5%A4%9C%E7%B2%BE%E5%93%81%E7%A3%81%E5%8A%9B%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
// 0.4.2 优化include，更新skrbt链接<br>
// 0.4.1 修复脚本猫ScriptCat无法使用的bug（感谢[cxxjackie](https://bbs.tampermonkey.net.cn/space-uid-14082.html)的帮助，哥哥爱了爱了！！）<br>
// 0.4   更新skrbt链接，优化代码逻辑（脚本猫ScriptCat无法正常使用，油猴Tampermonkey正常）<br>
// 0.3   自动更新skrbt网站地址<br>
// 0.2   自动获取cookies（感谢[cxxjackie](https://bbs.tampermonkey.net.cn/space-uid-14082.html)的帮助）<br>
// 0.1   获取磁力哈希
(async function () {

    GM_addStyle(GM_getResourceText("css"))

    let headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9',
        'dnt': '1',
        'referer': 'https://skrbtgi.xyz/',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    }

    async function get_url() {

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: headers.referer,
                method: 'get',
                onload: function (response) {
                    let html = $(response.responseText)
                    let targetUrl = html.find('#targetUrl').attr("href")
                    resolve(targetUrl)
                }
            })
        })
    }

    //跳过验证
    function skipCaptcha() {

        const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const randStr = len => {
            let str = '';
            for (let i = 0; i < len; i++) {
                const poz = Math.floor(Math.random() * charSet.length)
                str += charSet.charAt(poz)
            }
            return str
        }
        const token = randStr(100)
        const formatDate = new Date().toJSON().split('.')[0].replace(/\D/g, '')
        const aywcUid = randStr(10) + '_' + formatDate
        const costtime = Math.floor(Math.random() * 1000 + 10001) //必须大于10000
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: `${host_url}anti/recaptcha/v4/verify?token=${token}&aywcUid=${aywcUid}&costtime=${costtime}`,
                method: 'get',
                responType: 'text',
                onload: res => res.status === 200 && res.finalUrl === host_url ? resolve() : reject(),
                onerror: () => reject()
            })
        })
    }

    function analysis(content) {

        // 判断是否存在对象
        if (content.html().indexOf("影片名称") == -1) {
            return 0
        }

        let flag = content.children('br')
        let reg = /【影片名称】([\s\S]*?)<br>/g
        let title_list = content.html().match(reg)
        let title_count = title_list.lengt
        let j = -1

        for (let i = 0; i < flag.length; i++) {
            let br = $(flag[i]).get(0)
            let br_after = br.nextSibling.nodeValue

            if (br_after === null) {
                continue
            } else {
                if (br_after.indexOf("下载") != -1) {
                    j++
                    if (j > title_count) {
                        break
                    }
                } else {
                    continue
                }
            }

            if (title_list[j] == undefined) {
                return 0
            }
            let keywords = title_list[j].replace('【影片名称】', '')

            keywords = keywords.replace('：', '')
            keywords = keywords.replace('<br>', '')
            keywords = keywords.replace('[', '')
            keywords = keywords.replace(']', '')

            let search_url = `${host_url}search?keyword=${keywords}`

            GM_xmlhttpRequest({
                method: 'GET',
                url: search_url,
                headers: headers,
                onload: function (response) {

                    let data_list = []
                    let doc = $(response.responseText)

                    let search_results = $(doc.find('.list-unstyled'))
                    let count = search_results.length

                    if (doc.find('.sr-only').length) {
                    } else if (count === 0) {
                    } else {
                        count <= 5 ? count : count = 5
                        for (let i = 0; i < count; i++) {
                            let title = $(search_results[i]).children('li')[0].innerText
                            let info = $(search_results[i]).children('li')[1].innerText
                            let href = host_url + $($(search_results[i]).children('li')[0]).children('a').attr("href")
                            data_list.push({
                                title: title,
                                info: info,
                                href: href
                            })
                        }

                        $(flag[i]).before(`<br><i><b>title：${keywords}</b></i>`)


                        for (let k = 0; k < data_list.length; k++) {

                            headers.referer = encodeURI(search_url)

                            let content_url = data_list[k].href

                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: content_url,
                                headers: headers,
                                onload: function (response) {

                                    let doc = $(response.responseText)

                                    try {
                                        data_list[k].magnet = $(doc.find('.list-unstyled')[0]).children('li')[3].innerText.match(/[A-Z0-9]{40,40}$/)[0]
                                    }

                                    catch (err) {
                                        console.log(headers.referer)

                                        return console.log(`出错啦【${err.message}】`)
                                    }

                                    $(flag[i]).after(`****************************************************************************************<br>
                            <b>${data_list[k].title}</b><br>
                            ${data_list[k].info}<br>
                            <button class="copy layui-btn layui-btn-xs" data-clipboard-text="${data_list[k].magnet}">点击复制磁力哈希</button><br>`)

                                    headers.referer = host_url


                                }
                            })


                        }
                    }


                }
            })
        }



    }

    let targetUrl = await get_url()
    targetUrl && (headers.referer = targetUrl)
    let host_url = headers.referer

    await skipCaptcha()

    GM_xmlhttpRequest({
        method: 'GET',
        url: host_url + 'search?keyword=%E8%A7%A6%E4%B8%8D%E5%8F%AF%E5%8F%8A',
        headers: headers,
        onload: function (response) {
            let doc = $(response.responseText)
            if (doc.find('.sr-only').length) {
                return alert('请更新skrbt搜索网站的referer！')
            }
        }
    })

    let contents = $($("div[class^='tpc_cont']"))
    for (let i = 0; i < 4; i++) {
        analysis($(contents[i]))
    }

    let clipboard = new ClipboardJS('.copy')

    clipboard.on('success', function (e) {
        $(e.trigger).addClass("layui-btn-normal")
        e.clearSelection()
    })


})()

