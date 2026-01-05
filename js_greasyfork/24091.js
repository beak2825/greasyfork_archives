// ==UserScript==
// @name        (You)
// @description Добавляет метки (You) к ответам на ваши посты на имиджбордах (по имени и\или трипкоду)
// @include     *
// @version     0.1.0
// @grant       GM_getValue
// @grant       GM_setValue
// @require     http://code.jquery.com/jquery-1.11.1.min.js
// @run-at      document-end
// @namespace   https://github.com/VVatashi
// @downloadURL https://update.greasyfork.org/scripts/24091/%28You%29.user.js
// @updateURL https://update.greasyfork.org/scripts/24091/%28You%29.meta.js
// ==/UserScript==

const configLocalStorageKey = 'you-config';

let config = {
    name: "Name",
    trip: "!Trip"
};

function loadConfig() {
    config = JSON.parse(GM_getValue(configLocalStorageKey, JSON.stringify(config)));
}

function saveConfig() {
    GM_setValue(configLocalStorageKey, JSON.stringify(config));
}

const configFormClass = 'you-config-form';
const configFormTextClass = 'you-config-form-text';
const myPostClass = 'you-post-my';
const replyPostClass = 'you-post-reply';
const replyLinkClass = 'you-post-reply-link';

function createStyle() {
    let css = document.createElement("style");
    css.type = "text/css";

    css.innerHTML = `
.${myPostClass} {
    box-shadow: 6px 0 2px -2px rgba(97,107,134,.8), -6px 0 2px -2px rgba(97,107,134,.8);
}

.${replyPostClass} {
    box-shadow: 6px 0 2px -2px rgba(97,134,107,.8), -6px 0 2px -2px rgba(97,134,107,.8);
}

.${replyLinkClass}:after {
    content: " (You)";
}

.${configFormClass} {
    position: absolute;
    background-color: white;
    box-shadow: 0px 2px 6px 0px rgba(97,107,134,.8);
    padding: 12px 16px;
    z-index: 1;
}

.${configFormTextClass} {
    color: black;
}
`;

    document.head.appendChild(css);
}

function createConfigForm() {
    const configNameFieldClass = 'you-config-name';
    const configTripFieldClass = 'you-config-trip';

    const configToogleButtonClass = 'you-config-toogle';
    const configSaveButtonClass = 'you-config-save';

    let parent = $('.adminbar, #adminbar, .boardlist, .menu, .board-list').first();

    parent.after(`
[ <a class="${configToogleButtonClass}">(You) config</a> ]
<br />
<form class="${configFormClass}">
    <table>
        <tr><td class="${configFormTextClass}">Name:</td><td><input type="text" class="${configNameFieldClass}" value="${config.name}" /></td></tr>
        <tr><td class="${configFormTextClass}">Trip:</td><td><input type="text" class="${configTripFieldClass}" value="${config.trip}" /></td></tr>
        <tr><td><button class="${configSaveButtonClass}">Save</button></td><td></td></tr>
    </table>
</form>
`);

    $('.' + configToogleButtonClass).click(function () {
        $('.' + configFormClass).toggle();
    });

    $('.' + configSaveButtonClass).click(function () {
        config.name = $('.' + configNameFieldClass).val();
        config.trip = $('.' + configTripFieldClass).val();
        saveConfig();
    });

    $('.' + configFormClass).hide();
}

const domains = [
    '2ch.hk',
    'dobrochan.com',
    'iichan.hk',
    'syn-ch.com',
    '2-ch.su',
    'nowere.net',
    '410chan.org',
    'kurisa.ch',
    'chuck.dfwk.ru',
    'owlchan.ru',
    'haibane.ru',
    'volgach.ru',
    'hohoemy.exach.com',
    'zerochan.ru',
    'haruhichan.ovh',
    'chaos.cyberpunk.us',
    '02ch.in',
    'ozuchan.ru',
    'dvach.hut2.ru',
    '2watch.su'
];

function checkDomain() {
    for (let i = 0; i < domains.length; i++) {
        if (window.location.hostname.indexOf(domains[i]) != -1)
            return true;
    }

    return false;
}

const postSelector = 'td.reply[id], div.reply[id], td.post[id], div.post[id], div.thread_OP[id], div.thread_reply[id]';
const postBodySelector = 'blockquote, .body, .postbody, .post_body';
const nameSelector = '.postername, .name, .commentpostername, .poster-name';
const tripSelector = '.postertrip, .trip, .tripcode';

const processedClass = 'you-processed';
const processedSelector = '.' + processedClass;

function main() {
    let posts = $(postSelector);

    let myPosts = posts.filter(function (index, element) {
        let name = $(element).find(nameSelector).text();
        let trip = $(element).find(tripSelector).text();

        return name.indexOf(config.name) != -1 && trip.indexOf(config.trip) != -1;
    });

    let newPosts = posts.not(processedSelector);
    let myNewPosts = myPosts.not(processedSelector);

    myNewPosts.addClass(myPostClass);

    let myPostsIds = $.map(myPosts, function (element, index) {
        return $(element).attr('id').match(/\d+/)[0];
    });

    let replies = newPosts.filter(function (index, element) {
        let replyBodyText = $(element).find(postBodySelector).text();

        for (let i = 0; i < myPostsIds.length; i++) {
            if (replyBodyText.indexOf('>>' + myPostsIds[i]) != -1)
                return true;
        }

        return false;
    });

    replies.addClass(replyPostClass);

    replies.find(postBodySelector).find('a').each(function (index, element) {
        let linkText = $(element).text();

        for (let i = 0; i < myPostsIds.length; i++) {
            if (linkText == '>>' + myPostsIds[i]) {
                $(element).addClass(replyLinkClass);
                return;
            }
        }
    });

    newPosts.addClass(processedClass);
    myNewPosts.addClass(processedClass);
}

$(document).ready(function () {
    if (!checkDomain()) return;

    loadConfig();
    createStyle();
    createConfigForm();
    main();

    setInterval(main, 10000);
});
