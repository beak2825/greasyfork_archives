// ==UserScript==
// @name        와고바코드
// @namespace   abcddd
// @include     *://m.ygosu.com/*
// @include     *://www.ygosu.com/*
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_deleteValue
// @version      1.1.6
// @description  fu** barcode
// @author       abcddd
// @downloadURL https://update.greasyfork.org/scripts/390728/%EC%99%80%EA%B3%A0%EB%B0%94%EC%BD%94%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/390728/%EC%99%80%EA%B3%A0%EB%B0%94%EC%BD%94%EB%93%9C.meta.js
// ==/UserScript==
var message
if (window.location.origin.indexOf('m.') > -1) {

    var a = $('#contain_user_info a')[0].outerHTML.match(/\((.*),'/).pop()
    $('.title_info').each(function() {
        if (typeof(GM_getValue(a)) != 'undefined') {
            message = GM_getValue(a)
        } else {
            message = '메모'
        }

        $(this).find('p').append('| User: ' + a + ' <div id= ' + a + ' contentEditable="true">' + message + '</div>')
    })

    $('.comment').find('.desc p').each(function() {
        var b = $(this)[0].outerHTML.match(/minilog\((.*),''/).pop();

        if (typeof(GM_getValue(b)) != 'undefined') {
            message = GM_getValue(b)
        } else {
            message = '메모'
        }
        $(this).append(' <span> | ' + b + '<div id =' + b + ' contentEditable="true">' + message + '</div>')
    })
} else {
    var pc = $('#contain_user_info')[0].outerHTML.match(/minilog\((.*),/)[1].split(',')[0]
    $('.nickname').each(function() {
        if (typeof(GM_getValue(pc)) != 'undefined') {
            message = GM_getValue(pc)
        } else {
            message = '메모'
        }
        $(this).append('| User: ' + pc + ' <div id= ' + pc + ' contentEditable="true">' + message + '</div>')
    })

    $('.reply').find('.nick').each(function() {
        var b = $(this)[0].outerHTML.match(/minilog\((.*),/)[1].split(',')[0];
        $(this).append(b)

        if (typeof(GM_getValue(b)) != 'undefined') {
            $(this).append('<div id =' + b + ' contentEditable="true">' + GM_getValue(b) + '</div>')

        } else {
            $(this).append(' <div id= ' + b + ' contentEditable="true">메모</div>')

        }
    })

}

$('[contenteditable]').on('focus', function() {
    var $this = $(this);
    $this.data('before', $this.html());
    return $this;
}).on('blur keyup paste', function() {
    var $this = $(this);
    if ($this.data('before') !== $this.html()) {
        $this.data('before', $this.html());
        $this.trigger('change');
    }
    console.log('22222222222222')
    GM_setValue($this.attr('id'), $this[0].innerText)
    return $this;
});