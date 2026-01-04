// ==UserScript==
// @name         谷歌学术直接复制Bibtex
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  无需跳转直接复制Bibtex
// @author       HeMOu
// @match        https://scholar.google.com/scholar*
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456997/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E7%9B%B4%E6%8E%A5%E5%A4%8D%E5%88%B6Bibtex.user.js
// @updateURL https://update.greasyfork.org/scripts/456997/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E7%9B%B4%E6%8E%A5%E5%A4%8D%E5%88%B6Bibtex.meta.js
// ==/UserScript==

var App = {
    fetchContent() {
        document.querySelectorAll('#gs_citi a').forEach(function(elem) {
            if (elem.innerHTML === 'BibTeX') {
                GM_xmlhttpRequest({
                    url: elem.href,
                    onload: ({responseText}) => {
                        GM_setClipboard(responseText);
                        $('#cite_tip').text('已复制到剪切板')
                        $('#cite_content').text(responseText)
                    }
                });
            }
        })
    },
    bind() {
        var _this = this
        var intervalId = setInterval(function() {
            if ($('#gs_citi').length !== 0) {
                $('#gs_citi').after('<div><button id="my_button">获取BibTex</button><div id="cite_tip" style="padding-top: 10px; color: red;"></div><pre id="cite_content"></pre></div>')
                clearInterval(intervalId);
                $('#my_button').on('click', function(){
                    _this.fetchContent()
                })
            }
        }, 500)
    },
    init() {
        var _this = this
        $('a.gs_or_cit.gs_or_btn.gs_nph').on('click', function() {
            _this.bind()
        })
    }
}

App.init();