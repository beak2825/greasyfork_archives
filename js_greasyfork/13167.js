// ==UserScript==
// @name           LennyFace w wiadomosciach na facebooku
// @author         cordant
// @include        https://*.facebook.com*
// @include        http://*.facebook.com*
// @include        http://*.facebook.com/messages*
// @include        https://*.facebook.com/messages*
// @include        https://*.messenger.com/t*
// @require        http://code.jquery.com/jquery-latest.min.js
// @grant       none
// @version 0.5
// @description dodaje lennyface'y na facebooku
// @run-at 		document-end
// @namespace fb lenny
// @downloadURL https://update.greasyfork.org/scripts/13167/LennyFace%20w%20wiadomosciach%20na%20facebooku.user.js
// @updateURL https://update.greasyfork.org/scripts/13167/LennyFace%20w%20wiadomosciach%20na%20facebooku.meta.js
// ==/UserScript==

function main() {
    // emotki
    var LennyFace = [
        '( \u0361\u00B0 \u035C\u0296 \u0361\u00B0)',
        '( \u0361\u00B0 \u0296\u032F \u0361\u00B0)',
        '( \u0361\u00BA \u035C\u0296\u0361\u00BA)',
        '( \u0361\u00B0( \u0361\u00B0 \u035C\u0296( \u0361\u00B0 \u035C\u0296 \u0361\u00B0)\u0296 \u0361\u00B0) \u0361\u00B0)',
        '(\u2310 \u0361\u25A0 \u035C\u0296 \u0361\u25A0)',
        '(\u30FB\u3078\u30FB)',
        '\u10DA(\u0CA0_\u0CA0 \u10DA)',
        '(\u2565\uFE4F\u2565)',
        '(\u256F\uFE35\u2570,)',
        '( \u0361; \u0296\u032F \u0361;)',
        '( \u203E\u0296\u032B\u203E)',
        '(\u0298\u203F\u0298)',
        '(\uFF61\u25D5\u203F\u203F\u25D5\uFF61)',
        '\u1559(\u21C0\u2038\u21BC\u2036)\u1557',
        '\u1566(\u00F2_\u00F3\u02C7)\u1564',
        '(\u270C \uFF9F \u2200 \uFF9F)\u261E',
        't(\u30C4)_/\u00AF',
        '\u25D5\u203F\u25D5',
        '(\uFF9F\uFF70\uFF9F)',
        '(>\u10DA)',
        '\uFD3E\u0361\u0E4F\u032F\u0361\u0E4F\uFD3F',
        '\u0CA0_\u0CA0',
        '\u0628_\u0628',
        '\u30FD( \u035D\u00B0 \u035C\u0296\u0361\u00B0)\uFF89',
        '( \u0361\u00B0\u256D\u256E\u0361 \u00B0)',
        '\u0295\u2022\u1D25\u2022\u0294',
        '\u1D98\u1D52\u1D25\u1D52\u1D85',
        '(\u2312(oo)\u2312)',
        '\u113D\u1F41\u020D \u032A \u0151\u1F40\u113F',
        '&#9829;&#8255;&#9829;',
        '(&#8226; &#949; &#8226;)',
        '(&#9684;&#815;&#9684;)',
        '(&#664;&#5609;&#664;")',
        '&#3237;_&#3237;',
        '[&#818;&#773;$&#818;&#773;(&#818;&#773;5&#818;&#773;)&#818;&#773;$&#818;&#773;]',
        '&#3900; &#12388; &#9685;_&#9685; &#3901;&#12388;',
        '(&#12389;&#12539;&#12525;&#12539;)&#12389;',
        '(&#12389;&#9685; &#179;&#9685;)&#12389;',
        '&#5461;(&#5147;)&#5463;',
        '(=&#728;&#982;&#728;=)'];
    var symbole = [
        'α',
        'β',
        'γ',
        'Δ',
        'ε',
        'ζ',
        'η',
        'Σ',
        '°C',
        '√',
        'π',
        '²',
        '³',
        '∞'
        ];

    var LennyEmot = '';
    LennyFace.forEach(function (el) {
        LennyEmot += '<a href="#" class="lennybuzia" lenny-face="' + el + '">' + el + '</a>';
    });

    var symbole_lista = '';
    symbole.forEach(function (el) {
        symbole_lista += '<a href="#" class="lennybuzia" lenny-face="' + el + '">' + el + '</a>';
    });

    // css
    $("<style type='text/css'> ._1r- { display:none!important; }</style>").appendTo("head");
    $("<style type='text/css'> .lenny {float: right; padding-right: 6px; position: relative; line-height: 34px; margin-right: 30px; font-size: 20px} </style>").appendTo("head");
    $("<style type='text/css'> .lennybuzia {display:inline-block; margin:0 2px 0 2px;}</style>").appendTo("head");
    $("<style type='text/css'>.komentarze {width: 300px; height: 300px; background-color: #eee; z-index: 9999; position: fixed; display: none; font-size: 13px; float: left; text-align: justify; position: absolute; margin: 0px;} </style>").appendTo("head");
    $("<style type='text/css'> .lenny2 {position: relative; margin: 2px 2px;} </style>").appendTo("head");

    // facebook.com/messages
    $("<style type='text/css'> .lennyokno {width: 300px; height: 300px; background-color: #eee; z-index: 9999; position: fixed; display: none; bottom: 65px; font-size: 13px; float:left; text-align: justify;} </style>").appendTo("head");
    $('._1rw').append('<div class="lenny"><a>( ͡° ͜ʖ ͡°)</a></div>');
    $('.lenny').append('<div class="lennyokno hide">' + LennyEmot + '</div>');
    $('.lennyokno').append('<div class="symbole">' + symbole_lista + '</div>');
    $('.lenny').mouseover(function () {
        $('.lennyokno').show();
    });
    $('.lenny').mouseout(function () {
        $('.lennyokno').hide();
    });


    // facebook
    // $(document).on('click', '.UFIAddComment', function () {
    //     $(this).each(function (obj, i) {
    //         var dziadek = $(this).parent().parent().attr("id");
    //         $("#" + dziadek + " .UFIList").append('<div class="lenny2"><a>( ͡° ͜ʖ ͡°)</a></div>');
    //         $('.lenny2').append('<div class="komentarze hide">' + LennyEmot + '</div>');
    //         $('.lenny2').mouseover(function () {
    //             $('.komentarze').show();
    //         });
    //         $('.lenny2').mouseout(function () {
    //             $('.komentarze').hide();
    //         });

    //     });
    // });


    //     // messenger.com
    //     $('._4rv4').append('<li class="lenny"><a>( ͡° ͜ʖ ͡°)</a></li>');
    //     $("<style type='text/css'> ._4rv4 .lennybuzia { height:auto!important; width:auto!important; }</style>").appendTo("head");
    //     $("<style type='text/css'> ._4rv4 { right:10px!important; }</style>").appendTo("head");
    //     $("<style type='text/css'> ._4rv4 .lennyokno{ bottom:35px!important; }</style>").appendTo("head");

    jQuery.fn.extend({
        insertAtCaret: function (myValue) {
            return this.each(function (i) {
                if (document.selection) {
                    //For browsers like Internet Explorer
                    this.focus();
                    sel = document.selection.createRange();
                    sel.text = myValue;
                    this.focus();
                } else if (this.selectionStart || this.selectionStart == '0') {
                    //For browsers like Firefox and Webkit based
                    var startPos = this.selectionStart;
                    var endPos = this.selectionEnd;
                    var scrollTop = this.scrollTop;
                    this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                    this.focus();
                    this.selectionStart = startPos + myValue.length;
                    this.selectionEnd = startPos + myValue.length;
                    this.scrollTop = scrollTop;
                } else {
                    this.value += myValue;
                    this.focus();
                }
            });
        }
    });

    function insertTextAtCursor(text) {
        var sel, range, html;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(text));
            }
        } else if (document.selection && document.selection.createRange) {
            document.selection.createRange().text = text;
        }
    }
    $(document).on('click', 'a.lennybuzia', function () {
        var lenny = ($(this).attr('lenny-face'));
        // komentarze
        if ($("._54-z").length) {
            $(lenny).appendTo("._54-z");
            // facebook.com 
        } else if ($("._1rv").length) {
            $("._1rv").insertAtCaret(lenny + ' ');
        }
    });
}
window.onload = function () {
    if (typeof $ == 'undefined') {
        if (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery) {
            // Firefox
            var $ = unsafeWindow.jQuery;
            main();
        } else {
            // Chrome
            addJQuery(main);
        }
    } else {
        // Opera >.>
        main();
    }
};

function addJQuery(callback) {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
}