// ==UserScript==
// @name             IO piilotin helpotin
// @namespace        Autot.fi
// @version          1.1.7
// @description      Autot.fi <3
// @author           Jeamama
// @match            https://bbs.io-tech.fi/forums/*
// @match            https://bbs.io-tech.fi/threads/*
// @match            https://bbs.io-tech.fi/search/*
// @grant            GM_xmlhttpRequest
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            GM_listValues
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/396948/IO%20piilotin%20helpotin.user.js
// @updateURL https://update.greasyfork.org/scripts/396948/IO%20piilotin%20helpotin.meta.js
// ==/UserScript==

/* globals $ */
/* jshint esversion: 6 */
/* jshint scripturl: true */

const ujsOldmsg = `Käyttämäsi ${GM_info.script.name}.user.js (v.${GM_info.script.version}) on vanhentunut, eikä sitä enää päivitetä.<br>Tee varmuuskopio ja päivitä uuteen versioon. `;
document.body.insertAdjacentHTML('afterbegin', `<div style="background: #D9BE77; margin: 0 0 0 0; text-align: center; font-size:0.9rem; padding: 3px">${ujsOldmsg} Ohjeet <a href="https://aapvo.com/userjs/?i=ve2EAouw6&n=IO_Piilotin">tästä linkistä</a>.</div>`);

const uiStrings = {
    'en-US': {
        'hideThreads': 'Hide threads',
        'showThreads': 'Show threads',
        'hidePosts': 'Hide posts',
        'showPosts': 'Show posts',
        'hideLimitPre': 'Show again',
        'hideLimitPost': '',
        'ignoreThreadIcon': '<i class="far fa-comment-alt"></i>',
        'restoreThreadIcon': '<i class="far fa-comment-alt-slash"></i>',
        'hiddenContentPrefix': 'Show hidden content by ',
        'hiddenContentPostfix': ''
    },
    'fi-FI': {
        'hideThreads': 'Piilota ketjut',
        'showThreads': 'Näytä ketjut',
        'hidePosts': 'Piilota viestit',
        'showPosts': 'Näytä viestit',
        'hideLimitPre': 'Näytä jälleen',
        'hideLimitPost': '',
        'ignoreThreadIcon': '<i class="far fa-comment-alt"></i>',
        'restoreThreadIcon': '<i class="far fa-comment-alt-slash"></i>',
        'hiddenContentPrefix': 'Näytä käyttäjän ',
        'hiddenContentPostfix': ' piiloitettu sisältö.'
    }
};
var xfLang = $('html').attr('lang');
if (typeof (uiStrings[xfLang]) == 'undefined') { xfLang = 'en-US'; }

const targetNode = document.documentElement || document.body;
const config = { childList: true, subtree: true };
const callback = function (mutations, observer) {
    for (let mutation of mutations) {
        if (mutation.type !== 'childList' || typeof mutation.addedNodes != 'object') {
            continue;
        }
        for (let addednode of mutation.addedNodes) {
            if (addednode.nodeName != 'DIV') {
                continue;
            }
            if (mutation.target.className == 'tooltip-content') {
                jeaIOPH_updateTooltipLinks(addednode);
            } else if(addednode.classList.contains('tooltip--basic')) {
                if (hiddenAuthors.length > 0 && addednode.textContent.indexOf(hiddenContentPrefix) == 0 && addednode.textContent.indexOf(hiddenContentPostfix) > 0) {
                    hiddenContentTooltipId = addednode.id;
                    jeaIOPH_updateShowHiddenContentTooltip(hiddenContentTooltipId);
                }
            }
        }
    }
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

var jea_debug = false;
var settingsObject = jeaIOPH_loadStorage('jeaIOPH_Users');
jeaIOPH_debuglog(JSON.stringify(settingsObject));

var hiddenContentTooltipId = '';
var hiddenContentPrefix = uiStrings[xfLang].hiddenContentPrefix;
var hiddenContentPostfix = uiStrings[xfLang].hiddenContentPostfix;
var hiddenContentVariable = '{{names}}';
var hiddenAuthors = [];

var housekeepingUpdate = false;
for (let i in settingsObject) {
    if (typeof (settingsObject[i].HideThreadsUntil) != 'undefined' && new Date(settingsObject[i].HideThreadsUntil) <= new Date()) {
        jeaIOPH_debuglog('Disable Hide Threads from ' + settingsObject[i].Name + ' (aged @ ' + settingsObject[i].HideThreadsUntil + ')');
        settingsObject[i].HideThreads = false;
        delete settingsObject[i].HideThreadsUntil;
        housekeepingUpdate = true;
    }
    if (typeof (settingsObject[i].HidePostsUntil) != 'undefined' && new Date(settingsObject[i].HidePostsUntil) <= new Date()) {
        jeaIOPH_debuglog('Disable Hide Posts from ' + settingsObject[i].Name + ' (aged @ ' + settingsObject[i].HidePostsUntil + ')');
        settingsObject[i].HidePosts = false;
        delete settingsObject[i].HidePostsUntil;
        housekeepingUpdate = true;
    }
    if (settingsObject[i].HideThreads === false && settingsObject[i].HidePosts === false) {
        jeaIOPH_debuglog('Remove settings from ' + settingsObject[i].Name);
        delete settingsObject[i];
        housekeepingUpdate = true;
    }
}
if (housekeepingUpdate === true) { jeaIOPH_saveStorage('jeaIOPH_Users', settingsObject); }

switch ($('html').attr('data-template')) {

    case 'forum_view':
        // Hide
        for (let i in settingsObject) {
            if (settingsObject[i].HideThreads === true) {
                if ($('div.structItem--thread[data-author="' + settingsObject[i].Name + '"]').length > 0) {
                    jeaIOPH_debuglog('Hide threads from ' + settingsObject[i].Name);
                    $('div.structItem--thread[data-author="' + settingsObject[i].Name + '"]').css('display', 'none');
                    $('div.structItem--thread[data-author="' + settingsObject[i].Name + '"]').addClass('is-hidden');
                    if (!hiddenAuthors.includes(settingsObject[i].Name)) {
                        hiddenAuthors.push(settingsObject[i].Name);
                    }
                }
            }
        }
        // Ignore
        var threadelements = document.getElementsByClassName('structItem structItem--thread');
        for (var i = 0; i < threadelements.length; i++) {
            var linkelement = $(threadelements[i]).find('div.structItem-title a[href*="/threads/"]')[0];
            jeaIOPH_addThreadLink(linkelement, threadelements[i]);
        }
        break;

    case "thread_view":
        // Hide
        for (let i in settingsObject) {
            if (settingsObject[i].HidePosts === true) {
                if ($('article.message.message--post[data-author="' + settingsObject[i].Name + '"]').length > 0) {
                    jeaIOPH_debuglog('Hide posts from ' + settingsObject[i].Name);
                    $('article.message.message--post[data-author="' + settingsObject[i].Name + '"]').css('display', 'none');
                    $('article.message.message--post[data-author="' + settingsObject[i].Name + '"]').addClass('is-hidden');

                    if (!hiddenAuthors.includes(settingsObject[i].Name)) {
                        hiddenAuthors.push(settingsObject[i].Name);
                    }
                }
            }
        }
        break;
}

if ($('html').attr('data-template') == 'forum_view' || $('html').attr('data-template') == 'thread_view') {
    var linkShowIgnored = document.getElementsByClassName('showIgnoredLink');
    $(linkShowIgnored).on({
        'click': function (event) {
            jeaIOPH_showManuallyHiddenElements();
        }
    });
}

if (hiddenAuthors.length > 0) {
    var ignoredLink = document.getElementsByClassName('showIgnoredLink')[0];
    $(ignoredLink).removeClass('is-hidden');
}


// Functions for Hide

function jeaIOPH_updateShowHiddenContentTooltip(hiddenContentTooltipId) {

    var ignoredLink = document.getElementsByClassName('showIgnoredLink')[0];
    if (hiddenContentTooltipId == '') {
        // Initialize
        if (!$(ignoredLink).hasClass('is-hidden')) {
            $(ignoredLink).addClass('is-hidden');
        }
        $(ignoredLink).removeClass('is-hidden');
    } else {
        var tooltipcontentelement = $($('#' + hiddenContentTooltipId)).find('div.tooltip-content')[0];
        var tooltipContent = (tooltipcontentelement.textContent).replace(hiddenContentPrefix, '');
        tooltipContent = tooltipContent.replace(hiddenContentPostfix, '');
        tooltipContent = tooltipContent.replace(hiddenContentVariable, '');

        if (hiddenAuthors.length == 0 && tooltipContent == '') {
            $(ignoredLink).addClass('is-hidden');
        } else {
            var tooltipContentArrayPre = [];
            var tooltipContentArrayPost = [];
                tooltipContentArrayPre = tooltipContent.split(', ');
            for (var i = 0; i < tooltipContentArrayPre.length; i++) {
                if (!(hiddenAuthors.includes(tooltipContentArrayPre[i]))) {
                    tooltipContentArrayPost.push(tooltipContentArrayPre[i]);
                }
            }
            tooltipContentArrayPost = tooltipContentArrayPost.concat(hiddenAuthors);
            tooltipContentArrayPost = tooltipContentArrayPost.filter(function(e){ return e === 0 || e; });
            tooltipContentArrayPost.sort();
            tooltipcontentelement.textContent = hiddenContentPrefix + tooltipContentArrayPost.join(', ') + hiddenContentPostfix;
            if ($(ignoredLink).hasClass('is-hidden')) {
                $(ignoredLink).removeClass('is-hidden');
            }
        }
    }
}

function jeaIOPH_updateTooltipLinks(tooltipelement) {

    var messageAuthorElement = $(tooltipelement).find('a.username')[0];
    var messageAuthorName = $(messageAuthorElement).text();
    var messageAuthorUserId = $(messageAuthorElement).attr('data-user-id');
    var loggedinUserId = $('nav.p-nav .p-navgroup-link--user span.avatar.avatar--xxs').data('user-id').toString();

    var tooltipactionselement = $(tooltipelement).find('div.memberTooltip-actions')[0];
    if (!(typeof (tooltipactionselement) == 'undefined' || typeof (messageAuthorUserId) == 'undefined' || (loggedinUserId === messageAuthorUserId))) {
        jeaIOPH_debuglog('Update links for ' + messageAuthorName + ' (' + messageAuthorUserId + ')');
        var tableelement = $(tooltipelement).find('table.tooltipExtraLinks')[0];
        if ($(tableelement).length) {
            tableelement.remove();
        }

        var tbl = document.createElement('table');
        tbl.setAttribute('class', 'tooltipExtraLinks');
        var tr1 = tbl.insertRow();
        var tr2 = tbl.insertRow();
        var tr1td1 = tr1.insertCell();
        var tr1td2 = tr1.insertCell();
        var tr1td3 = tr1.insertCell();
        var tr2td1 = tr2.insertCell();
        var tr2td2 = tr2.insertCell();
        var tr2td3 = tr2.insertCell();

        var jeaCells = [tr1td1, tr1td2, tr1td1, tr1td3, tr2td1, tr2td2, tr2td3];
        jeaCells.forEach(function (jeaCell) {
            $(jeaCell).css('padding', '0 0 4px 4px');
        });

        tooltipactionselement.after(tbl);

        var settingsObject = jeaIOPH_loadStorage('jeaIOPH_Users');

        var Action = 'Hide Threads';
        var ActionLabel = uiStrings[xfLang].hideThreads;
        if (typeof (settingsObject[messageAuthorName]) != 'undefined' && typeof (settingsObject[messageAuthorName].HideThreads) != 'undefined' && settingsObject[messageAuthorName].HideThreads === true) {
            Action = 'Show Threads';
            ActionLabel = uiStrings[xfLang].showThreads;
        }

        var threadsA = document.createElement('a');
        threadsA.href = 'javascript:void(0);';
        $(threadsA).addClass('button--link button');
        threadsA.innerHTML = ActionLabel;
        if ($(tooltipactionselement).find('h4.memberTooltip-name a:contains("' + Action + '")')[0] == null) {
            threadsA.addEventListener('click', jeaIOPH_processTooltipLinkElement.bind(threadsA, Action, tooltipelement, messageAuthorName, messageAuthorUserId), false);
            tr1td1.appendChild(threadsA);
        }

        Action = 'Hide Posts';
        ActionLabel = uiStrings[xfLang].hidePosts;
        if (typeof (settingsObject[messageAuthorName]) != 'undefined' && typeof (settingsObject[messageAuthorName].HidePosts) != 'undefined' && settingsObject[messageAuthorName].HidePosts === true) {
            Action = 'Show Posts';
            ActionLabel = uiStrings[xfLang].showPosts;
        }

        var postsA = document.createElement('a');
        postsA.href = 'javascript:void(0);';
        $(postsA).addClass('button--link button');
        postsA.innerHTML = ActionLabel;
        if ($(tooltipactionselement).find('h4.memberTooltip-name a:contains("' + Action + '")')[0] == null) {
            postsA.addEventListener('click', jeaIOPH_processTooltipLinkElement.bind(postsA, Action, tooltipelement, messageAuthorName, messageAuthorUserId), false);
            tr2td1.appendChild(postsA);
        }

        var jeaDate = new Date();
        jeaDate.setDate(jeaDate.getDate() + 2);
        var jeaDateValue = jeaDate.toISOString().substr(0, 10);
        var jeaTimeValue = '09:00:00';
        var jeaFontSize = '12px';
        var jeaStyleColor = 'gray';

        var jeaDateValue1 = jeaDateValue;
        var jeaDateValue2 = jeaDateValue;
        var jeaTimeValue1 = jeaTimeValue;
        var jeaTimeValue2 = jeaTimeValue;

        var daylimitCheckbox1 = document.createElement('input');
        daylimitCheckbox1.type = 'checkbox';
        daylimitCheckbox1.id = 'daylimitCheckbox1';
        var daylimitCheckbox1Label = document.createElement('label');
        daylimitCheckbox1Label.htmlFor = 'daylimitCheckbox1';
        daylimitCheckbox1Label.style.fontSize = jeaFontSize;
        daylimitCheckbox1Label.style.color = jeaStyleColor;
        daylimitCheckbox1Label.appendChild(document.createTextNode(' ' + uiStrings[xfLang].hideLimitPre));
        tr1td2.appendChild(daylimitCheckbox1);
        tr1td2.appendChild(daylimitCheckbox1Label);

        if (!(typeof (settingsObject[messageAuthorName]) == 'undefined' || typeof (settingsObject[messageAuthorName].HideThreadsUntil) == 'undefined')) {
            jeaDateValue1 = (settingsObject[messageAuthorName].HideThreadsUntil).split('T')[0];
            jeaTimeValue1 = (settingsObject[messageAuthorName].HideThreadsUntil).split('T')[1];
            daylimitCheckbox1.checked = true;
        }

        var limitDate1 = document.createElement('input');
        limitDate1.type = 'date';
        limitDate1.id = 'limitDate1';
        limitDate1.value = jeaDateValue1;
        limitDate1.style.fontSize = jeaFontSize;
        limitDate1.style.color = jeaStyleColor;
        tr1td3.appendChild(limitDate1);

        var limitTime1 = document.createElement('input');
        limitTime1.type = 'time';
        limitTime1.id = 'limitTime1';
        limitTime1.value = jeaTimeValue1;
        limitTime1.style.fontSize = jeaFontSize;
        limitTime1.style.color = jeaStyleColor;

        var limitTime1Label = document.createElement('label');
        limitTime1Label.style.fontSize = jeaFontSize;
        limitTime1Label.style.color = jeaStyleColor;
        limitTime1Label.htmlFor = 'limitTime1';
        limitTime1Label.appendChild(document.createTextNode(' ' + uiStrings[xfLang].hideLimitPost));
        tr1td3.appendChild(limitTime1);
        tr1td3.appendChild(limitTime1Label);

        var daylimitCheckbox2 = document.createElement('input');
        daylimitCheckbox2.type = 'checkbox';
        daylimitCheckbox2.id = 'daylimitCheckbox2';
        var daylimitCheckbox2Label = document.createElement('label');
        daylimitCheckbox2Label.htmlFor = 'daylimitCheckbox2';
        daylimitCheckbox2Label.style.fontSize = jeaFontSize;
        daylimitCheckbox2Label.style.color = jeaStyleColor;
        daylimitCheckbox2Label.appendChild(document.createTextNode(' ' + uiStrings[xfLang].hideLimitPre));
        tr2td2.appendChild(daylimitCheckbox2);
        tr2td2.appendChild(daylimitCheckbox2Label);

        if (!(typeof (settingsObject[messageAuthorName]) == 'undefined' || typeof (settingsObject[messageAuthorName].HidePostsUntil) == 'undefined')) {
            jeaDateValue2 = (settingsObject[messageAuthorName].HidePostsUntil).split('T')[0];
            jeaTimeValue2 = (settingsObject[messageAuthorName].HidePostsUntil).split('T')[1];
            daylimitCheckbox2.checked = true;
        }

        var limitDate2 = document.createElement('input');
        limitDate2.type = 'date';
        limitDate2.id = 'limitDate2';
        limitDate2.value = jeaDateValue2;
        limitDate2.style.fontSize = jeaFontSize;
        limitDate2.style.color = jeaStyleColor;
        tr2td3.appendChild(limitDate2);

        var limitTime2 = document.createElement('input');
        limitTime2.type = 'time';
        limitTime2.id = 'limitTime2';
        limitTime2.value = jeaTimeValue2;
        limitTime2.style.fontSize = jeaFontSize;
        limitTime2.style.color = jeaStyleColor;

        var limitTime2Label = document.createElement('label');
        limitTime2Label.style.fontSize = jeaFontSize;
        limitTime2Label.style.color = jeaStyleColor;
        limitTime2Label.htmlFor = 'limitTime2';
        limitTime2Label.appendChild(document.createTextNode(' ' + uiStrings[xfLang].hideLimitPost));
        tr2td3.appendChild(limitTime2);
        tr2td3.appendChild(limitTime2Label);
    }
}

function jeaIOPH_processTooltipLinkElement(action, tooltipelement, messageAuthorName, messageAuthorUserId) {

    var settingsObject = jeaIOPH_loadStorage('jeaIOPH_Users');
    if (typeof (settingsObject[messageAuthorName]) == 'undefined') {
        settingsObject[messageAuthorName] = {};
        settingsObject[messageAuthorName].Name = messageAuthorName;
        settingsObject[messageAuthorName].UserId = messageAuthorUserId;
        settingsObject[messageAuthorName].HidePosts = false;
        settingsObject[messageAuthorName].HideThreads = false;
    }

    switch (action) {

        case 'Hide Posts':
            jeaIOPH_debuglog('Hide posts from ' + messageAuthorName);
            settingsObject[messageAuthorName].HidePosts = true;
            if ($(tooltipelement).find('#daylimitCheckbox2')[0].checked === true) {
                settingsObject[messageAuthorName].HidePostsUntil = $(tooltipelement).find('#limitDate2')[0].value + 'T' + $(tooltipelement).find('#limitTime2')[0].value;
            }
            $('article.message.message--post[data-author="' + messageAuthorName + '"]').css('display', 'none');
            break;

        case 'Show Posts':
            jeaIOPH_debuglog('Show posts from ' + messageAuthorName);
            settingsObject[messageAuthorName].HidePosts = false;
            $('article.message.message--post[data-author="' + messageAuthorName + '"]').css('display', '');
            break;

        case 'Hide Threads':
            jeaIOPH_debuglog('Hide threads from ' + messageAuthorName);
            settingsObject[messageAuthorName].HideThreads = true;
            if ($(tooltipelement).find('#daylimitCheckbox1')[0].checked === true) {
                settingsObject[messageAuthorName].HideThreadsUntil = $(tooltipelement).find('#limitDate1')[0].value + 'T' + $(tooltipelement).find('#limitTime1')[0].value;
            }
            $('div.structItem--thread[data-author="' + messageAuthorName + '"]').css('display', 'none');
            break;

        case 'Show Threads':
            jeaIOPH_debuglog('Show threads from ' + messageAuthorName);
            settingsObject[messageAuthorName].HideThreads = false;
            $('div.structItem--thread[data-author="' + messageAuthorName + '"]').css('display', '');
            break;
    }

    if (settingsObject[messageAuthorName].HideThreads === false && settingsObject[messageAuthorName].HidePosts === false) {
        jeaIOPH_debuglog('Remove settings from ' + messageAuthorName + ' (' + messageAuthorUserId + ')');
        delete settingsObject[messageAuthorName];
    }

    jeaIOPH_saveStorage('jeaIOPH_Users', settingsObject);
    jeaIOPH_updateTooltipLinks(tooltipelement);
}

function jeaIOPH_saveStorage(key, value) {
    GM_setValue(key, value);
}

function jeaIOPH_loadStorage(key, defaultvalue) {
    return GM_getValue(key, {});
}


// Functions for Ignore

function jeaIOPH_addThreadLink(linkelement, parentthreadelement) {
    if ($('html').data('logged-in')) {
        var a = document.createElement('a');
        a.href = 'javascript:void(0);';

        var Action = 'Ignore';
        var ActionIcon = uiStrings[xfLang].ignoreThreadIcon;

        if ($(parentthreadelement).hasClass('is-ignored') || $(parentthreadelement).hasClass('is-manuallyhidden')) {
            Action = 'Restore';
            ActionIcon = uiStrings[xfLang].restoreThreadIcon;
        }

        a.innerHTML = ActionIcon;
        a.style.display = 'inline-block';
        a.style.float = 'right';
        a.style.margin = '2px 0 0 0';
        $(a).addClass('structItem-minor');
        $(a).data('jea-action', Action);
        a.addEventListener('click', jeaIOPH_processThreadLinkElement.bind(a, linkelement, parentthreadelement, Action), false);
        linkelement.after(a);
    }
}


function jeaIOPH_switchThreadIgnoreLink(linkelement, parentthreadelement, action) {
    var links = $($($(linkelement).closest('div.structItem-title')).find('a'));
    for (var i = 0; i < links.length; i++) {
        if ($(links[i]).data('jea-action') == action) {
            $(links[i]).remove();
            jeaIOPH_addThreadLink(linkelement, parentthreadelement);
        }
    }
}

function jeaIOPH_processThreadLinkElement(linkelement, parentthreadelement, action) {

    var unread = linkelement.href.lastIndexOf('unread');
    var href = linkelement.href.substring(0, unread);

    jeaIOPH_debuglog(action + ' thread: ' + href);

    switch (action) {

        case 'Ignore':

            var threadid = jeaIOPH_parseThreadId(linkelement);
            parentthreadelement.style.display = 'none';
            $(parentthreadelement).addClass('is-manuallyhidden');
            href = 'https://bbs.io-tech.fi/misc/tic-ignore?content_type=thread&content_id=' + threadid;
            GM_xmlhttpRequest({
                method: 'GET',
                url: href
            });
            break;

        case 'Restore':
            jeaIOPH_getElementFromUrl(function (dom) {
                var linkelementIgnore = $(dom).find('div.buttonGroup a[href*="unignore?"]')[0];
                href = linkelementIgnore.href;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: href
                });
            }, href);
            break;
    }

    jeaIOPH_switchThreadIgnoreLink(linkelement, parentthreadelement, action);
}

function jeaIOPH_parseThreadId(linkelement) {
    var period = linkelement.href.lastIndexOf('.');
    var threadid = linkelement.href.substring(period + 1);
    period = threadid.lastIndexOf('/');
    threadid = parseInt(threadid.substring(0, period));
    return threadid;
}

function jeaIOPH_getElementFromUrl(callback, href) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: href,
        onload: function (response) {
            var parser = new DOMParser();
            callback(parser.parseFromString(response.responseText, 'text/html'));
        }
    });
}


// Functions for Ignore and Hide

function jeaIOPH_showManuallyHiddenElements() {

    switch ($('html').attr('data-template')) {

        case 'forum_view':
            var threadelements = document.getElementsByClassName('structItem structItem--thread');
            jeaIOPH_debuglog('Show ignored threads');
            for (var foo = 0; foo < threadelements.length; foo++) {
                if ($(threadelements[foo]).hasClass('is-manuallyhidden')) {
                    threadelements[foo].style.display = '';
                    $(threadelements[foo]).removeClass('is-manuallyhidden');
                    var linkelement = $(threadelements[foo]).find('div.structItem-title a[href*="/threads/"]')[0];
                    jeaIOPH_switchThreadIgnoreLink(linkelement, threadelements[foo], 'Ignore');
                }
            }
            jeaIOPH_debuglog('Show hidden threads');
            for (var bar = 0; bar < hiddenAuthors.length; bar++) {
                $('div.structItem--thread[data-author="' + hiddenAuthors[bar] + '"]').css('display', '');
            }
            break;

        case 'thread_view':
            for (var baz = 0; baz < hiddenAuthors.length; baz++) {
                $('article.message.message--post[data-author="' + hiddenAuthors[baz] + '"]').css('display', '');
            }
            break;
    }
}

function jeaIOPH_debuglog(foo) {
    if (jea_debug === true) {
        console.log('__ jeaIOPH: ' + foo);
    }
}


// Backup by Paavo <3

let saveButton = '<a href="#" class="p-navgroup-link badgeContainer"><span class="p-navgroup-linkText"><i class="fal fa-save" id="helpotinsave"></i></span></a>';
let forumBannerElement = document.querySelector('.p-navgroup.p-account.p-navgroup--member');
forumBannerElement.insertAdjacentHTML('afterbegin', saveButton);
forumBannerElement.addEventListener('click', (event) => {
    if (event.target.id === 'helpotinsave') {
        event.preventDefault();
        let currentStoredKeys = GM_listValues();
        if (!Array.isArray(currentStoredKeys) || currentStoredKeys.length < 1) {
            return; // Nothing stored, return
        }
        currentStoredKeys = currentStoredKeys.sort();
        let backupObject = {};
        currentStoredKeys.forEach(currentStoredKey => {
            backupObject[currentStoredKey] = GM_getValue(currentStoredKey, []);
        });
        let tmStorage = JSON.stringify(backupObject, null, 4);
        // Makes invisible temporary link element to DOM, clicks it and removes it.
        let tempLink = document.createElement('a');
        tempLink.style = 'display: none';
        tempLink.href = window.URL.createObjectURL(new Blob([tmStorage], { type: 'application/json' }));
        tempLink.download = `${GM_info.script.name}.json`;
        document.body.appendChild(tempLink);
        tempLink.click();
        tempLink.remove();
    }
});
