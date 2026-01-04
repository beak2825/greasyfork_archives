// ==UserScript==
// @name         dogedoge 搜索增强工具
// @namespace    https://github.com/ClericPy/somethings
// @version      0.7
// @description  try to take over the world!
// @author       Clericpy
// @match        https://www.dogedoge.com/results*
// @grant        GM_xmlhttpRequest
// @connect      dict.youdao.com

// @downloadURL https://update.greasyfork.org/scripts/402414/dogedoge%20%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/402414/dogedoge%20%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function translate(q, cb) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: youdaoUrl + encodeURI(q),
            headers: {
                'cookie': ''
            },
            onload: cb
        });
    }

    function en2cn(resp) {
        let span = document.createElement('div')
        span.style = 'border: 1px dotted; padding: 1em;'
        let text = '<p>'
        let rjson = JSON.parse(resp.responseText)
        if (!rjson.ec || !rjson.ec.word) {
            return
        }
        for (const item of rjson.ec.word[0].trs) {
            text += item.tr[0].l.i[0] + '<br>'
        }
        text += '</p>'
        let q = rjson.meta.input
        span.innerHTML = '<h4>翻译: <a style="color: #283593;" href="http://www.youdao.com/w/' + encodeURIComponent(q) + '" target="_blank">' + q + '</a></h4><hr>' + text
        let links = document.getElementById('links')
        links.insertBefore(span, links.childNodes[0])
    }

    function cn2en(resp) {
        let span = document.createElement('div')
        span.style = 'border: 1px dotted; padding: 1em;'
        let result = '<p>'
        let rjson = JSON.parse(resp.responseText)
        if (!rjson.ce || !rjson.ce.word) {
            return
        }
        for (const item of rjson.ce.word[0].trs) {
            let meta_list = item.tr[0].l.i
            let trans = item.tr[0].l['#tran'] || ''
            var prefix = ''
            var word_list = []
            for (const i of meta_list) {
                if (!i) {
                    continue
                }
                if (typeof (i) == 'string') {
                    prefix += i
                } else {
                    word_list.push(i['#text'])
                }
            }
            let word = word_list.join(' ')
            result += prefix + '<a style="color: #283593;" href="http://www.youdao.com/w/' + encodeURIComponent(word) + '" target="_blank">' + word + '</a>' + ': ' + trans + '<br>'
        }
        let phone = rjson.ce.word[0].phone || ''
        if (phone) {
            phone = ' - ' + phone
        }
        result += '</p>'
        let q = rjson.input
        span.innerHTML = '<h4>翻译: <a style="color: #283593;" href="http://www.youdao.com/w/' + encodeURIComponent(q) + '" target="_blank">' + q + '</a>' + phone + '</h4><hr>' + result
        let links = document.getElementById('links')
        links.insertBefore(span, links.childNodes[0])
    }
    var button_style = 'font-weight: 1000;color: #666; margin: 9px'
    var word = document.getElementById("search_form_input").value
    var duckbar_static = document.getElementById("duckbar_static")
    var node = document.createElement('a')
    node.setAttribute('href', 'https://www.baidu.com/s?wd=' + encodeURI(word))
    // node.setAttribute('target', '_blank')
    node.setAttribute('style', button_style)
    node.innerText = '百度'
    duckbar_static.appendChild(node);
    var node2 = document.createElement('a')
    node2.setAttribute('href', 'https://www.google.com/search?q=' + encodeURI(word))
    // node2.setAttribute('target', '_blank')
    node2.setAttribute('style', button_style)
    node2.innerText = 'Google'
    duckbar_static.appendChild(node2);
    var youdaoUrl = 'http://dict.youdao.com/jsonapi?xmlVersion=5.1&jsonversion=2&q=';

    // 纯英文检索
    // if (/^[a-zA-Z\s0-9-]+.*$/.test(word)) {
    if (!/.*[\u4e00-\u9fa5]+.*$/.test(word)) {
        translate(word, en2cn)
        return
    }
    if (/.* (翻译|英语|英文)$/.test(word)) {
        let cn_words = word.slice(0, -3)
        translate(cn_words, cn2en)
        return
    }
    document.querySelectorAll('li.zcm__item>a').forEach(i => {
        if (i && i.getAttribute('href').slice(0, 4) == 'java') {
            i.remove()
        }
    });

})();
