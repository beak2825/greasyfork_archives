// ==UserScript==
// @name         Javadoc translate
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Java文档的翻译优化。需提前打开Chrome的自带翻译，并选择自动翻译英文网页。
// @author       再见
// @icon         https://www.google.com/s2/favicons?domain=ow2.io
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @grant        none
// @match        http://*/*
// @match        https://*/*
// @downloadURL https://update.greasyfork.org/scripts/432125/Javadoc%20translate.user.js
// @updateURL https://update.greasyfork.org/scripts/432125/Javadoc%20translate.meta.js
// ==/UserScript==
//自行添加匹配的网址
//禁止被翻译的区域 .notranslate
//jdk9
const index = [
    $('[class*=col-first]'),
]
const overview = [
    $('.header>.title'),
    $('.contentContainer>div>ul>li>a'),
    $('.colFirst>a'),
    //jdk9
    $('.colLast>.block>a')
]
const model = [
    $('[class*=col-first]'),
    $('[class*=col-last] a'),
]
const packages = [
    $('caption'),
    $('.colFirst'),
    $('.code'),
    //jdk9
    $('.col-first')
]
const clazz = [
    $('.header'),
    $('.memberSummary>tbody>.colFirst'),
    $('.blockList>h4'),
    $('.blockList>pre'),
    $('.inherited-list'),
    $('.code'),
    //jdk9
    $('.inheritance'),
    $('.type-signature'),
    $('.detail>h3'),
    $('.detail a'),
    $('.member-signature')
]
const classUse = [
    $('.header>.title'),
    $('.blockList option'),
    $('.blockList>h3'),
    $('.colFirst'),
    $('.colLast>.typeNameLabel'),
    $('.colLast>code'),
    //jdk9
    $('.col-first'),
    $('.detail>h2'),
    $('.detail>.caption'),
    $('.col-second'),
    $('.summary-table a'),
]
~(function() {
    'use strict';
    var pn = location.pathname
    let local = overview
    switch(true) {
        case pn.endsWith('index.html'):
            console.log(location)
            if ($('[name=classFrame]').length != 0) location.href = location.origin + pn.replace('index.html','overview-summary.html')
            else local = index
            break
        case pn.endsWith('module-summary.html'):
            local = model
            break
        case pn.endsWith('package-summary.html'):
            local = packages
            break
        case pn.endsWith('overview-summary.html'):
            local = overview
            break
        case pn.includes('class-use'):
            local = classUse
            break
        default:
            local = clazz
    }
    local.forEach(function(e) {e.addClass('notranslate')})
})();