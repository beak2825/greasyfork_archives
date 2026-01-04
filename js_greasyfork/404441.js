// ==UserScript==
// @name         Ukryj wykop (aka WykopSeen)
// @namespace    wykop.pl
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @version      1.0
// @description  Dodaje guzik 'X' przy każdym wykopie do ukrywania. Przywracasz guzikiem 'POKAŻ'
// @author       mirek123
// @match        *://www.wykop.pl/
// @match        *://www.wykop.pl/strona/*
// @match        *://www.wykop.pl/link/*
// @match        *://www.wykop.pl/wykopalisko/*
// @match        *://www.wykop.pl/hity/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/404441/Ukryj%20wykop%20%28aka%20WykopSeen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/404441/Ukryj%20wykop%20%28aka%20WykopSeen%29.meta.js
// ==/UserScript==

var jq = this.$ = this.jQuery = jQuery.noConflict(true);
var seenWykopClass = 'seen';

function eachLi() {
    var wykopitem = jq(this);
    var wykopitemparent = wykopitem.parent();
    var btn = jq('<button class=\'seen-btn\'></button>');
    var href = wykopitem.find('h2 a').attr('href');
    if (!href) return;
    var isseen = getIsSeen(href);

    function btnOnClick2(event) {
        var result = btnOnClick.call(this, event);
        var jqThis = jq(this);
        var isseen = jqThis.data('isseen');

        if (isseen) {
            wykopitem.addClass(seenWykopClass);
            /// Usuń video
            wykopitemparent.append(wykopitem).find('.videoWrapper').remove();
        } else {
            wykopitem.removeClass(seenWykopClass);
            wykopitemparent.prepend(wykopitem);
        }

        return false;
    }

    if (isseen) {
        wykopitem.addClass(seenWykopClass);
        wykopitemparent.append(wykopitem);
    }

    btn.data('href', href).data('isseen', isseen).on('click', btnOnClick2);

    refreshBtnText.call(btn);

    wykopitem.children('div').append(btn);
}

function refreshBtnText() {
    var jqThis = jq(this);

    if (jqThis.data('isseen')) {
        jqThis.text('POKAŻ');
    } else {
        jqThis.text('🗙');
    }
}

function btnOnClick(event) {
    if (event) event.preventDefault();
    var jqThis = jq(this);
    var href = jqThis.data('href');
    var isseen = jqThis.data('isseen');
    isseen = !isseen;
    jqThis.data('isseen', isseen);
    setIsSeen(href, isseen);
    refreshBtnText.call(jqThis);

    return false;
}

function getIsSeen(href) {
    return GM_getValue(href);
}

function setIsSeen(href, value) {
    if (value) {
        GM_setValue(href, 1);
    } else {
        GM_deleteValue(href);
    }
}

function seenFullBtn() {
    var btn = jq('<button class=\'seen-btn\'></button>');
    var href = getHrefFromLocation();
    if (!href) return;
    var isseen = getIsSeen(href);

    btn.data('href', href).data('isseen', isseen).on('click', btnOnClick);
    refreshBtnText.call(btn);
    jq('.article.fullview .lcontrast').append(btn);
}

function cssRules() {
    var rules = [
        'li.seen { background: transparent }',
        'li.seen * { color: gray !important }',
        'li.seen .diggbox { display: none !important }',
        'li.seen .media-content { display: none }',
        'li.seen .fix-tagline { display: none }',
        'li.seen .description { display: none }',
        'li.seen .elements { display: none }',
        'li.seen .article { min-height: 0; padding: 0 1rem 0 1rem }',
        'li.seen .article .lcontrast { margin: 0 !important; padding-left: 0rem; padding-right: 6rem; }',
        '.seen-btn { color: #999; position: absolute; top: 0px; right: 0px; z-index: 9999; background-color: transparent; border: none; }',
        '.seen-btn:hover { background-color: #ccc;}',
        '@media (min-width: 767px) { .article .lcontrast :nth-child(1) { margin-right: 2.5rem } }',
    ];
    return rules.join('\n');
}

function getHrefFromLocation() {
    var href = document.location.toString().split('#')[0];
    if (href.indexOf('www.wykop.pl/link/') >= 0) {
        return href;
    }
}

function makeSeenLink() {
    var href = getHrefFromLocation();
    if (href) {
        setIsSeen(href, true);
    }
}

function exec() {
    makeSeenLink();
    jq(document.body).append(jq('<style type=\'text/css\'></style>').html(cssRules()));
    jq('#itemsStream li').each(eachLi);
    seenFullBtn();
}

exec();

/// Pokaż wszystkie 'leniwe' miniaturki
jq('img.lazy').each(function (i,e) { jq(e).attr('src', jq(e).data('original'))})
