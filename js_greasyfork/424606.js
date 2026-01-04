// ==UserScript==
// @name         Copy Cite Directly
// @namespace    blog.rhilip.info
// @version      0.1
// @description  在学术网站上直接复制而不是下载源文件
// @author       You
// @match        https://xueshu.baidu.com/usercenter/paper/show?paperid=*
// @match        https://xueshu.baidu.com/s*
// @match        https://scholar.google.com/scholar*
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.js
// @connect      scholar.googleusercontent.com
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/424606/Copy%20Cite%20Directly.user.js
// @updateURL https://update.greasyfork.org/scripts/424606/Copy%20Cite%20Directly.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const copy_icon_base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA8klEQVQ4jaWTMU7DUBBE33xZlC5RipSIEtHkAhSR0qThIOQOnIAjUHAFaAwSN7BSItKlSE3pgIcicYTMX0uBkbb5Ozs72v0r20gqgSvghN9ogaXtt0wOgBJYAR6ILTC1TT8A5nvSKCAk4BV4yOWLzrbtTc6e7VZSHdkvokRP5OYoAUkFsAAmQV0D3NuuUkBYALcDDsfAk6SziDABHm1fBw4T8AVcpt5jh8Ru/1nYbn8Sa+ATeJZ0FxVFSLbfgRmwPrYY9kOyXQHVXwSiLfxboAFOe4M9QNLowAv+/5TdAQ0d2Aoo1V1Upss5cBG4bIAX2x/fnkCQPdBG4isAAAAASUVORK5CYII='

    // 百度学术
    if (location.href.match(/xueshu\.baidu\.com/)) {
        const selector = location.href.match(/xueshu\.baidu\.com\/usercenter\/paper\/show/) ? 'a.paper_q'  /* 正文页 */ : 'a.sc_q'  /* 目录页 */

        $(selector).click(function() {
            setTimeout(() => {
                $('a.download').each(function () {
                    let that = $(this)
                    let copy_another = $(`<img src='${copy_icon_base64}' style="width:10px;height:10px">`)
                    copy_another.click(function () {
                        $.get('https://xueshu.baidu.com/u/citation', {
                            type : that.data('type'),
                            paperid: that.data('paperid')
                        },"text").then(data => {
                            GM_setClipboard(data)
                            alert('复制成功')
                        })
                    })
                    that.before(copy_another, '&nbsp;')
                })
            },1e3)
        })
    }
    // 谷歌学术
    else if (location.href.match(/scholar\.google\.com\/scholar/)) {
        $('a[title="Cite"]').click(function () {
            setTimeout(() => {
                $('a.gs_citi').each(function () {
                    let that = $(this)
                    let copy_another = $(`<img src='${copy_icon_base64}' style="width:10px;height:10px">`)
                    copy_another.click(function () {
                        /**
                         * 谷歌学术的生成域名为 scholar.googleusercontent.com
                         * 不能直接使用页面上的ajax请求（CORS），使用 GM_xmlhttpRequest 中转
                         */

                        GM_xmlhttpRequest({
                            url: that.attr('href'),
                            onload: ({ responseText }) => {
                                GM_setClipboard(responseText)
                                alert('复制成功')
                            }
                        })
                    })
                    that.before(copy_another, '&nbsp;')
                })
            }, 2e3)  // 等 2s 防止加载失败
        })
    }
})();