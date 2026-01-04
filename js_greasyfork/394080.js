// ==UserScript==
// @name         swagger-extends
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  swagger 2.0 友好交互拓展工具
// @author       teeeemoji
// @include        /.*\/swagger-ui\.html.*/
// @downloadURL https://update.greasyfork.org/scripts/394080/swagger-extends.user.js
// @updateURL https://update.greasyfork.org/scripts/394080/swagger-extends.meta.js
// ==/UserScript==

function createDom(type, props, style) {
    const dom = document.createElement(type)
    Object.assign(dom, props)
    Object.assign(dom.style, style)
    return dom
}

const appStyle = createDom('link', {
    as: 'style',
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/swagger-extends/css/app.6b076305.css'
})
const chunkStyle = createDom('link', {
    as: 'style',
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/swagger-extends/css/chunk-vendors.c63c8862.css'
})
const eleWoff = createDom('link', {
    href: 'https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/swagger-extends/fonts/element-icons.535877f5.woff'
})
const eleTtf = createDom('link', {
    href: 'https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/swagger-extends/fonts/element-icons.732389de.ttf'
})
document.head.append(appStyle)
document.head.append(chunkStyle)
document.head.append(eleWoff)
document.head.append(eleTtf)

const appScript = createDom('script', {
    src: 'https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/swagger-extends/js/app.262594ef.js'
})
const chunkScript = createDom('script', {
    src: 'https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/swagger-extends/js/chunk-vendors.9f96de28.js'
})
document.body.append(appScript)
document.body.append(chunkScript)