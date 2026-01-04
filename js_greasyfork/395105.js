// ==UserScript==
// @name         gitlab contribution statistics
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  gitlab 贡献榜
// @author       teeeemoji
// @include        /.*\/gitlab/.*/
// @downloadURL https://update.greasyfork.org/scripts/395105/gitlab%20contribution%20statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/395105/gitlab%20contribution%20statistics.meta.js
// ==/UserScript==
// 创建 DOM 节点
function createDom(type, props, style) {
    const dom = document.createElement(type)
    Object.assign(dom, props)
    Object.assign(dom.style, style)
    return dom
}
// 创建 css link
function createCssLink(href) {
    document.head.append(
        createDom('link', {
            as: 'style',
            rel: 'stylesheet',
            type: 'text/css',
            href: href
        })
    )
}
// 创建 script 标签
function createScripTag(src) {
    document.body.append(
        createDom('script',{
            src: src
        })
    )
}





createCssLink("https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/gitlab-contribute-statistics/css/app.b1b2a44f.css")


createScripTag("https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/gitlab-contribute-statistics/js/app.0be34325.js")

