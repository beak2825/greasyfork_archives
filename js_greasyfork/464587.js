// ==UserScript==
// @name         MyHeritage Profile Helper
// @namespace    nikku
// @license      MIT
// @version      1.4
// @description  Открывает возможность переходить на деревья, сайты и профили людей из поиска, а также отсылать личные сообщения без платной подписки
// @author       nikku
// @match        https://www.myheritage.am/research*
// @match        https://www.myheritage.am/site-*
// @match        https://www.myheritage.am/profile-*
// @match        https://www.myheritage.am/dna/*
// @match        https://www.myheritage.am/discovery-hub/*
// @match        https://www.myheritage.at/research*
// @match        https://www.myheritage.at/site-*
// @match        https://www.myheritage.at/profile-*
// @match        https://www.myheritage.at/dna/*
// @match        https://www.myheritage.at/discovery-hub/*
// @match        https://www.myheritage.cat/research*
// @match        https://www.myheritage.cat/site-*
// @match        https://www.myheritage.cat/profile-*
// @match        https://www.myheritage.cat/dna/*
// @match        https://www.myheritage.cat/discovery-hub/*
// @match        https://www.myheritage.cn/research*
// @match        https://www.myheritage.cn/site-*
// @match        https://www.myheritage.cn/profile-*
// @match        https://www.myheritage.cn/dna/*
// @match        https://www.myheritage.cn/discovery-hub/*
// @match        https://www.myheritage.co.il/research*
// @match        https://www.myheritage.co.il/site-*
// @match        https://www.myheritage.co.il/profile-*
// @match        https://www.myheritage.co.il/dna/*
// @match        https://www.myheritage.co.il/discovery-hub/*
// @match        https://www.myheritage.co.in/research*
// @match        https://www.myheritage.co.in/site-*
// @match        https://www.myheritage.co.in/profile-*
// @match        https://www.myheritage.co.in/dna/*
// @match        https://www.myheritage.co.in/discovery-hub/*
// @match        https://www.myheritage.co.kr/research*
// @match        https://www.myheritage.co.kr/site-*
// @match        https://www.myheritage.co.kr/profile-*
// @match        https://www.myheritage.co.kr/dna/*
// @match        https://www.myheritage.co.kr/discovery-hub/*
// @match        https://www.myheritage.com.br/research*
// @match        https://www.myheritage.com.br/site-*
// @match        https://www.myheritage.com.br/profile-*
// @match        https://www.myheritage.com.br/dna/*
// @match        https://www.myheritage.com.br/discovery-hub/*
// @match        https://www.myheritage.com.hr/research*
// @match        https://www.myheritage.com.hr/site-*
// @match        https://www.myheritage.com.hr/profile-*
// @match        https://www.myheritage.com.hr/dna/*
// @match        https://www.myheritage.com.hr/discovery-hub/*
// @match        https://www.myheritage.com.pt/research*
// @match        https://www.myheritage.com.pt/site-*
// @match        https://www.myheritage.com.pt/profile-*
// @match        https://www.myheritage.com.pt/dna/*
// @match        https://www.myheritage.com.pt/discovery-hub/*
// @match        https://www.myheritage.com.tr/research*
// @match        https://www.myheritage.com.tr/site-*
// @match        https://www.myheritage.com.tr/profile-*
// @match        https://www.myheritage.com.tr/dna/*
// @match        https://www.myheritage.com.tr/discovery-hub/*
// @match        https://www.myheritage.com.ua/research*
// @match        https://www.myheritage.com.ua/site-*
// @match        https://www.myheritage.com.ua/profile-*
// @match        https://www.myheritage.com.ua/dna/*
// @match        https://www.myheritage.com.ua/discovery-hub/*
// @match        https://www.myheritage.com/research*
// @match        https://www.myheritage.com/site-*
// @match        https://www.myheritage.com/profile-*
// @match        https://www.myheritage.com/dna/*
// @match        https://www.myheritage.com/discovery-hub/*
// @match        https://www.myheritage.cz/research*
// @match        https://www.myheritage.cz/site-*
// @match        https://www.myheritage.cz/profile-*
// @match        https://www.myheritage.cz/dna/*
// @match        https://www.myheritage.cz/discovery-hub/*
// @match        https://www.myheritage.de/research*
// @match        https://www.myheritage.de/site-*
// @match        https://www.myheritage.de/profile-*
// @match        https://www.myheritage.de/dna/*
// @match        https://www.myheritage.de/discovery-hub/*
// @match        https://www.myheritage.dk/research*
// @match        https://www.myheritage.dk/site-*
// @match        https://www.myheritage.dk/profile-*
// @match        https://www.myheritage.dk/dna/*
// @match        https://www.myheritage.dk/discovery-hub/*
// @match        https://www.myheritage.ee/research*
// @match        https://www.myheritage.ee/site-*
// @match        https://www.myheritage.ee/profile-*
// @match        https://www.myheritage.ee/dna/*
// @match        https://www.myheritage.ee/discovery-hub/*
// @match        https://www.myheritage.es/research*
// @match        https://www.myheritage.es/site-*
// @match        https://www.myheritage.es/profile-*
// @match        https://www.myheritage.es/dna/*
// @match        https://www.myheritage.es/discovery-hub/*
// @match        https://www.myheritage.fi/research*
// @match        https://www.myheritage.fi/site-*
// @match        https://www.myheritage.fi/profile-*
// @match        https://www.myheritage.fi/dna/*
// @match        https://www.myheritage.fi/discovery-hub/*
// @match        https://www.myheritage.fr/research*
// @match        https://www.myheritage.fr/site-*
// @match        https://www.myheritage.fr/profile-*
// @match        https://www.myheritage.fr/dna/*
// @match        https://www.myheritage.fr/discovery-hub/*
// @match        https://www.myheritage.gr/research*
// @match        https://www.myheritage.gr/site-*
// @match        https://www.myheritage.gr/profile-*
// @match        https://www.myheritage.gr/dna/*
// @match        https://www.myheritage.gr/discovery-hub/*
// @match        https://www.myheritage.hu/research*
// @match        https://www.myheritage.hu/site-*
// @match        https://www.myheritage.hu/profile-*
// @match        https://www.myheritage.hu/dna/*
// @match        https://www.myheritage.hu/discovery-hub/*
// @match        https://www.myheritage.it/research*
// @match        https://www.myheritage.it/site-*
// @match        https://www.myheritage.it/profile-*
// @match        https://www.myheritage.it/dna/*
// @match        https://www.myheritage.it/discovery-hub/*
// @match        https://www.myheritage.jp/research*
// @match        https://www.myheritage.jp/site-*
// @match        https://www.myheritage.jp/profile-*
// @match        https://www.myheritage.jp/dna/*
// @match        https://www.myheritage.jp/discovery-hub/*
// @match        https://www.myheritage.lt/research*
// @match        https://www.myheritage.lt/site-*
// @match        https://www.myheritage.lt/profile-*
// @match        https://www.myheritage.lt/dna/*
// @match        https://www.myheritage.lt/discovery-hub/*
// @match        https://www.myheritage.lv/research*
// @match        https://www.myheritage.lv/site-*
// @match        https://www.myheritage.lv/profile-*
// @match        https://www.myheritage.lv/dna/*
// @match        https://www.myheritage.lv/discovery-hub/*
// @match        https://www.myheritage.mk/research*
// @match        https://www.myheritage.mk/site-*
// @match        https://www.myheritage.mk/profile-*
// @match        https://www.myheritage.mk/dna/*
// @match        https://www.myheritage.mk/discovery-hub/*
// @match        https://www.myheritage.nl/research*
// @match        https://www.myheritage.nl/site-*
// @match        https://www.myheritage.nl/profile-*
// @match        https://www.myheritage.nl/dna/*
// @match        https://www.myheritage.nl/discovery-hub/*
// @match        https://www.myheritage.no/research*
// @match        https://www.myheritage.no/site-*
// @match        https://www.myheritage.no/profile-*
// @match        https://www.myheritage.no/dna/*
// @match        https://www.myheritage.no/discovery-hub/*
// @match        https://www.myheritage.pl/research*
// @match        https://www.myheritage.pl/site-*
// @match        https://www.myheritage.pl/profile-*
// @match        https://www.myheritage.pl/dna/*
// @match        https://www.myheritage.pl/discovery-hub/*
// @match        https://www.myheritage.ro/research*
// @match        https://www.myheritage.ro/site-*
// @match        https://www.myheritage.ro/profile-*
// @match        https://www.myheritage.ro/dna/*
// @match        https://www.myheritage.ro/discovery-hub/*
// @match        https://www.myheritage.rs/research*
// @match        https://www.myheritage.rs/site-*
// @match        https://www.myheritage.rs/profile-*
// @match        https://www.myheritage.rs/dna/*
// @match        https://www.myheritage.rs/discovery-hub/*
// @match        https://www.myheritage.se/research*
// @match        https://www.myheritage.se/site-*
// @match        https://www.myheritage.se/profile-*
// @match        https://www.myheritage.se/dna/*
// @match        https://www.myheritage.se/discovery-hub/*
// @match        https://www.myheritage.si/research*
// @match        https://www.myheritage.si/site-*
// @match        https://www.myheritage.si/profile-*
// @match        https://www.myheritage.si/dna/*
// @match        https://www.myheritage.si/discovery-hub/*
// @match        https://www.myheritage.sk/research*
// @match        https://www.myheritage.sk/site-*
// @match        https://www.myheritage.sk/profile-*
// @match        https://www.myheritage.sk/dna/*
// @match        https://www.myheritage.sk/discovery-hub/*
// @match        https://www.myheritage.tw/research*
// @match        https://www.myheritage.tw/site-*
// @match        https://www.myheritage.tw/profile-*
// @match        https://www.myheritage.tw/dna/*
// @match        https://www.myheritage.tw/discovery-hub/*
// @exclude      https://www.myheritage.*/site-family-tree-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myheritage.com
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/464587/MyHeritage%20Profile%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/464587/MyHeritage%20Profile%20Helper.meta.js
// ==/UserScript==

function personId(item) {
    return item[1] * 1000000 + parseInt(item[2]);
}

function createUrl(coll, item, name, link) {
    switch (coll) {
        case '1':
            return '/profile-' + item[0] + '-' + personId(item) + '/profile';
        case '2':
            return '/site-' + item[0] + '/site';
        case '3':
            return '/profile-' + item[0] + '/profile';
        default:
            return link;
    }
}

function processSearchData(data) {
    data.forEach(function(rec) {
        var coll = rec.record.collection.id.split('-')[1];
        var item = rec.record.id.split('-')[2].split('_');
        var name = rec.record.name;
        var link = rec.user_info.link;
        var newUrl = createUrl(coll, item, name, link);

        if (link != newUrl) {
            rec.user_info.link = newUrl;
            rec.record.name = '✨ ' + rec.record.name;
            if (coll == '1') {
                var parts = rec.record.collection.name.split(',');
                if (parts.length > 1) {
                    var tree = '<b><a onclick="event.stopPropagation();" href="/site-family-tree-' + item[0] + '/tree?rootIndivudalID=' + personId(item) + '&familyTreeID=' + item[1] + '">🌳 Древо</a></b>';
                    var website = '<span class="sub"><b><a onclick="event.stopPropagation();" href="/site-' + item[0] + '/site">' + parts[0] + '</a></b></span>';
                    var admin = parts[1].replace(/(.*) (\S+ \S+)/, '$1 <b>$2</b>').replace('администрирует', 'адм.');
                    rec.record.collection.name = tree + website + ',' + admin;
                }
            }
        }

        if (coll == '40000') {
            rec.record.collection.name = '🌀 ' + rec.record.collection.name;
        }

        if (coll == '40001') {
            rec.record.collection.name = '🌱 ' + rec.record.collection.name;
        }
    });
}

function processMatchData(data) {
    data.forEach(function(rec) {
        var fields = rec.record.display_fields;
        if (fields && fields.length) {
            fields.forEach(function(item) {
                if (item.value.includes('/paywall')) {
                    item.value = item.value.replaceAll(/href="[^"]+-i-(\d+)-\d+-(\d+)[^"]+"/gi, 'href="/profile-$1-$2/profile"');
                }
            });
        }
    });
}

function messageUrl(memberId) {
    return window.location.origin + '/inbox/compose/recipient/' + memberId + '/type/1?reason=153';
}

function messageHtml(memberId) {
    return '<a href="' + messageUrl(memberId) + '" ' +
        'class="mh_button button_component allow_hover shape_rounded hierarchy_secondary">' +
        '<span class="button_content size_small">✨ Разблокировать личные сообщения</span></a>';
}

function buttonHtml(href, text) {
    return '<a href="' + href + '"><button type="submit" ' +
        'class="mh_button variant_festive hierarchy_secondary rounded size_small">' +
        '<span class="mh_button_content">' + text + '</span></button></a>';
}

function addDnaButtons(node) {
    node.querySelectorAll('.buttons_container > a:nth-child(2)').forEach(function (link) {
        var pediHref = link.href.replace(/&kitId.*/, '');
        var treeHref = pediHref.replace(/(.*)pedigree-tree-(\d+)-(\d+)(.*)/, '$1site-family-tree-$2$4&rootIndividualID=$3');
        link.insertAdjacentHTML('afterend', buttonHtml(treeHref, '✨ Семейное древо'));
        link.insertAdjacentHTML('afterend', buttonHtml(pediHref, '✨ Вид по родословной'));
    });
}

function openMsgForm(args, withTopic) {
    var msgUrl = '/messaging-center/all/compose/user-';
    var homeUrl = unsafeWindow.navigationBarApp.clientData.homePageUrl;
    var targetURL = msgUrl + args[0];
    var lang;

    if (homeUrl) {
        lang = homeUrl.split('?');
    }

    if (withTopic && args[1]) {
        targetURL += '/' + args[1];
    }

    if (lang[1]) {
        targetURL += '?' + lang[1];
    }

    window.open(targetURL);
}

(function(open) {
    XMLHttpRequest.prototype.open = function() {
        var isSearch = arguments[1].includes('search_in_historical_records');
        var isMatch = arguments[1].includes('matches_for_person_fetch_entries');
        if (isSearch || isMatch) {
            this.addEventListener('load', function() {
                var json = JSON.parse(this.responseText);
                var res = isSearch ? json.data.search_query_upload.response.results : json.data.individual.matches;

                if (res.data && res.data.length) {
                    isSearch ? processSearchData(res.data) : processMatchData(res.data);
                    Object.defineProperty(this, 'responseText', {writable: true});
                    this.responseText = JSON.stringify(json);
                }
            }, false);
        }

        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);

(function() {
    'use strict';

    var cssCode = [
        '.main_ctas .mh_button { display: block; width: 100%; white-space: normal; transition: none; }',
        '.main_ctas .hierarchy_secondary, .person_profile_page .hierarchy_secondary { border-color: #ccc !important; color: #2385c4 !important; background-color: #fcfcfc !important; }',
        '.main_ctas .hierarchy_secondary:hover, .person_profile_page .hierarchy_secondary:hover { background-color: #fff5f4 !important; text-decoration: none !important; }',
        '.main_ctas .primary_separator { display: none; }',
        '.contact_site_creator_cta { margin-top: 16px; }',
        '.site-creator .profile_details_layout { background: #fff; border-radius: 100px; }',
        '.profile_page_top { position: relative; }',
        '.profile_page_top .mh_button { position: absolute; top: 0; left: 0; right: 0; width: fit-content; margin: 0 auto; }',
    ].join('\n');
    GM_addStyle(cssCode);

    var wPath = window.location.pathname;
    var isProfile = wPath.startsWith('/profile-');
    var isSite = wPath.startsWith('/site-');
    var isDna = wPath.startsWith('/dna/');
    var memberId;

    if (isSite || isProfile) {
        var json = unsafeWindow.clientData;
        if (json) {
            memberId = json.memberId || json.profileDetails.creator_id;
        }
    }

    if (!isDna) {
        unsafeWindow.contactMember = function() {
            openMsgForm(arguments, true);
        };

        unsafeWindow.contactWebmasterViaInbox = function() {
            openMsgForm(arguments);
        };
    }

    if (isSite && memberId) {
        var profile = document.querySelector('.profile_details_container');
        var contact = document.querySelector('.contact_site_creator_cta');
        var tree = document.querySelector('.view_family_tree_url .link');
        profile.innerHTML = '<a href="/profile-' + memberId + '/profile">' + profile.innerHTML + '</a>';
        contact.insertAdjacentHTML('beforebegin', messageHtml(memberId));
        contact.classList.replace('hierarchy_primary', 'hierarchy_secondary');
        contact.firstElementChild.prepend('📨 ');
        document.querySelector('.request_membership_cta > span').prepend('📩 ');
        tree.className = 'mh_button button_component allow_hover shape_rounded hierarchy_secondary';
        tree.firstElementChild.className = 'button_content size_small';
        tree.firstElementChild.prepend('🌳 ');
    }

    if (isProfile && memberId) {
        document.querySelector('.profile_page_top').insertAdjacentHTML('beforeend', messageHtml(memberId));
    }

    if (isDna) {
        var observer = new MutationObserver(function (mutList) {
            mutList.forEach(function (mut) {
                mut.addedNodes.forEach(function (anod) {
                    if (anod.matches('.dna_results_matches') || anod.matches('.matches_cards')) {
                        addDnaButtons(anod);
                    }
                });
            });
        });

        observer.observe(document.querySelector('#dna_results_root'), {
            subtree: true, childList: true
        });
    }
})();