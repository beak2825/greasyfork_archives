// ==UserScript==
// @name KinoGo Download Button
// @name:ru KinoGo Кнопка Скачать
// @namespace -
// @version 1.1.0
// @description creates download button below description.
// @description:ru содаёт кнопку скачать под описанием.
// @author NotYou
// @match *://kinogo.la/*
// @match *://kinogo.appspot.com/*
// @license GPL-3.0
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/438095/KinoGo%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/438095/KinoGo%20Download%20Button.meta.js
// ==/UserScript==

if(window.location.pathname.indexOf('engine') != -1) {
    var css = 'body { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Liberation Sans",sans-serif; background: rgb(19, 19, 19); color: rgb(191, 191, 191); }'
    var styleNode = document.createElement("style")
    styleNode.appendChild(document.createTextNode(css))
    document.querySelector('head').appendChild(styleNode)
}

(function($) {
    $(document).ready(function(){
        if($('.shortstory').length) {
            $('head').append('<style> .downloadButton { position: relative; top: -3px; padding-top: 1px; left: 4px; } .podrobnee * { outline: none !important; } .downloadButton a { text-decoration: none; }</style>')
            $('.icons .podrobnee').each(function() {
                var _href = $('.zagolovki a[href*="/"]', $(this).closest('.icons').prev()).attr('href')
                var _id = _href.match(/(\d+)-/)[1]

                $(this).append('<button class="downloadButton fbutton5"><a target="_blank" href="#!">Скачать</a></button>')

                $('.downloadButton', this).on('click', function(e) {
                    e.preventDefault()
                    $.ajax(_href).then(function(r) {
                        var doc = new DOMParser().parseFromString(r, 'text/html')
                        var id = doc.querySelector('li[onclick*="download"]').getAttribute('onclick').match(/news_id=(\d+)/)[1]
                        var href = '/engine/ajax/cdn_download_dl.php?news_id=' + id

                        var _a = document.createElement('a')
                        _a.href = href
                        _a.target = '_blank'
                        _a.click()
                    })
                })
            })
        }
    });

    if(window.location.pathname.indexOf("/index.php") != -1) {
        $('.downloadButton').hide()
    }
})(window.jQuery)