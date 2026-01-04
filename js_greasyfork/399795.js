// ==UserScript==
// @name    btsow-mag-helper
// @namespace btsow-mag-helper-ycy
// @version 0.1.2
// @description  show mag copy button in the search result page of btsow
// @author  ycycorona
// @match   *://bteve.com/search/*
// @run-at  document-end
// @grant   GM_addStyle
// @grant   GM_setClipboard
// @grant   GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/399795/btsow-mag-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/399795/btsow-mag-helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function magGenerator(hash, title) {
        return `magnet:?xt=urn:btih:${hash}&dn=${title}`
    }
    var dataListWrap = document.querySelector('.data-list')
    var rowList = document.querySelectorAll('.data-list .row:not(.hidden-xs)')
    dataListWrap.addEventListener('click', function(e) {
        if (e.target.classList.contains('mag-btn')) {
            console.log(e.target.dataset.magContent)
            GM_setClipboard(e.target.dataset.magContent)
            var bakText = e.target.textContent
            e.target.textContent = '已复制'
            setTimeout(function(){
                e.target.textContent = bakText
            }, 500)
            // GM_notification(e.target.dataset.title + '地址复制成功')
            e.stopPropagation
        }
    })

    rowList.forEach(function(rowDom){
        var magDom = document.createElement('button')
        var aDom = rowDom.querySelector('a')
        var matchRes = aDom.href.match(/\/hash\/(.*)$/)
        var hash = matchRes ? matchRes[1] : ''
        var magContent = magGenerator(hash, aDom.title)
        magDom.textContent = 'mag'
        magDom.dataset.magContent = magContent
        magDom.dataset.title = aDom.title
        magDom.classList.add('hidden-xs','col-sm-1','col-lg-1', 'mag-btn')
        var fileDom = rowDom.querySelector('.file')
        fileDom.classList.remove('col-lg-9', 'col-sm-8')
        fileDom.classList.add('col-lg-8', 'col-sm-7')
        aDom.after(magDom)
    })
})()