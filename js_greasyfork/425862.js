// ==UserScript==
// @name         google translate batch upload script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description for those who need translate text files which can be identified  directly by browser(.xml .txt)
// @author       bridge
// @match        https://translate.google.cn/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/425862/google%20translate%20batch%20upload%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/425862/google%20translate%20batch%20upload%20script.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //传参
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    }
    var index = getQueryVariable('myquery')
    if (index !== false) {
        var e = document.createEvent("UIEvent");
        e.initUIEvent("input", true, true);
        document.querySelector('textarea').value = localStorage.getItem(index)
        localStorage.removeItem(index)
        document.querySelector('textarea').dispatchEvent(e);
    } else {
        localStorage.clear()
    }
    let cmp = `<input type="file" class = 'multiSelect' multiple="multiple"></br>`
    document.querySelector('body').insertAdjacentHTML('beforeEnd', cmp)
    $('.multiSelect').css('position', 'fixed')
    $('.multiSelect').css('top', '50%')
    $('.multiSelect').css('width', '70px')
    $('.multiSelect').css('z-index', '100')
    $('.multiSelect').on('input propertychange', function () {
        let files = $('.multiSelect')[0].files
        for (let i = 0; i < files.length; i++) {
            const r = new FileReader()
            r.readAsText(files[i])
            r.onloadend = function () {
                if (r.readyState === 2) {
                    localStorage.setItem(i, r.result.replaceAll(/<.*?>/g, '').replaceAll('\\n\\n', '').replaceAll('\\\'', '\''))
                    window.open('https://translate.google.cn/?myquery=' + i, i)
                }
            }
        }
    })
})();