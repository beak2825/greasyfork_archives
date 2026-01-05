// ==UserScript==
// @name         Karakter ID Kopyalayıcı
// @version      0.1
// @description  Karakter ID ve ismini kopyalar.
// @author       Antön Latz
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        htt*://*.popmundo.com/Forum/Popmundo.aspx/Thread/*
// @namespace https://greasyfork.org/users/6949
// @downloadURL https://update.greasyfork.org/scripts/29983/Karakter%20ID%20Kopyalay%C4%B1c%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/29983/Karakter%20ID%20Kopyalay%C4%B1c%C4%B1.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$('.forumMessageTools').prepend(
    '<a href="#" class="copy-user-tag">' +
    '<img src="http://i.imgsafe.org/497c2f3ba4.png" alt="" width="13" height="13">' +
    '</a>'
);

$('#ctl00_cphLeftColumn_ctl00_hdrMain').append(
    '<input type="text" name="charTag" value="">'
);

$('input[name="charTag"]').css({
    position: "absolute",
    left: "-1000px",
    top: "-1000px",
});

$('.copy-user-tag').on('click', function (e) {
    e.preventDefault();

    var _ct = $('input[name="charTag"]'),
        _hd = $(e.target).closest('.forumMessageTools').next(),
        _pr = $(_hd).find('a').first(),
        _ar = _pr.attr('href').split('/');

    _ct.val('[charid=' + _ar[_ar.length - 1] + ' name=' + _pr.text() + ']');
    _ct.select();
    document.execCommand('copy');
});
