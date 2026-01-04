// ==UserScript==
// @name         阿里云日志美化
// @namespace    GoldSubmarine
// @version      0.3
// @description  Log format
// @author       GoldSubmarine
// @match        https://sls.console.aliyun.com/lognext/project/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/426528/%E9%98%BF%E9%87%8C%E4%BA%91%E6%97%A5%E5%BF%97%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/426528/%E9%98%BF%E9%87%8C%E4%BA%91%E6%97%A5%E5%BF%97%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 💬💡
    function getObserver() {
        return new MutationObserver(function(records) {
            for(const record of records) {
                record.addedNodes.forEach(li => {
                    let hiddenStr = ""
                    $(li).find("div[class^='Virtual__style__live-content'] > div").each(function() {
                        let html = $(this).text()

                        let removeLabelArr = ["__raw_log__: "]
                        removeLabelArr.forEach((removeLabel) => {
                            if(html.indexOf(removeLabel) === 0) {
                                let span = $(this).find("span").eq(0)
                                if(span.text() === removeLabel) span.remove()
                            }
                        })

                        let labelArr = ["__tag__:__hostname__:", "__tag__:__path__:", "app:", "__tag__:__receive_time__:", "__tag__:__client_ip__:", "ts:"]
                        labelArr.forEach((label) => {
                            if(html.indexOf(label) === 0) {
                                hiddenStr += html + ' '
                                $(this).css("display","none")
                            }
                        })
                    })
                    let tipHtml = $(li).find("div[class^='Virtual__style__live-content'] > span:eq(1)")
                    tipHtml.html(" 💡 ")
                    tipHtml.attr("aria-label", hiddenStr)
                    tipHtml.attr("data-balloon-pos", "right")
                })
            }
        });
    }

    addCssByLink('https://cdn.jsdelivr.net/npm/balloon-css@1.2.0/balloon.min.css')

    function addCssByLink(url) {
        var link = document.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('type', 'text/css')
        link.setAttribute('href', url)

        var heads = document.getElementsByTagName('head')
        if (heads.length) heads[0].appendChild(link)
        else document.documentElement.appendChild(link)
    }

    let observer = getObserver()

    setInterval(() => {
        $("div[class^='Context__style__inner-list'] .next-virtual-list-wrapper ul").each(function() {
            let html = $(this)[0]
            observer.observe(html, {childList: true})
        })
    }, 1000)

})();