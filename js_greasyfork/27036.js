// ==UserScript==
// @name         IN_FRIEND_VK
// @namespace    userscript
// @version      0.1.1
// @description  in friend vk
// @author       raletag
// @match        *://vk.com/*
// @include      *://vk.com/*
// @exclude      *://vk.com/notifier.php*
// @exclude      *://vk.com/*widget*.php*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27036/IN_FRIEND_VK.user.js
// @updateURL https://update.greasyfork.org/scripts/27036/IN_FRIEND_VK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var uid = window.vk.id || 0,
        storage = {
            friends : {
                result: false,
                cache_time: 600,
                domains: {},
                ids: {}
            },
            prefix: uid+'_ifvk_',
            get: function (name) {
                return window.localStorage[this.prefix+name];
            },
            set: function (name, value) {
                window.localStorage[this.prefix+name] = value;
            },
            remove: function (name) {
                window.localStorage.removeItem(this.prefix+name);
            }
        },
        ct = ((Date.now() / 1000 | 0) - (storage.get('ftime') || 1));

    if (ct > storage.friends.cache_time) {
        storage.remove('friends');
        log('Cache expired');
    } else {
        log('Cache more ' + (storage.friends.cache_time - ct));
    }

    if (storage.get('friends') !== undefined) {
        log('Load from storage');
        var tmp = JSON.parse(storage.get('friends'));
        storage.friends.domains = tmp.domains;
        storage.friends.ids = tmp.ids;
        storage.friends.result = true;
        work (document.body);
    } else {
        log('Load from VKAPI');
        xfriends();
    }

    function f (ms) {
        if (!storage.friends.result) return;
        ms.forEach(function (m) {
            m.addedNodes.forEach(function (n) {
                if (n.nodeType !== Node.ELEMENT_NODE) {
                    return;
                }
                work (n);
            });
        });
    }

    function form_access_token  () {
        var access_token = storage.get('access_token');
        do {
            access_token = prompt('Введите access_token с правами friends', access_token);
            if (access_token.length >= 32) break;
        } while (1);
        storage.set('access_token', access_token);
        window.location.reload(true);
    }

    function work (n) {
        /////////////////
        var vkidcheck, i, wk_vk_link = n.querySelectorAll('a.wk_vk_link[href]:not([ifc])'),
            mention_id_link = n.querySelectorAll('a[mention_id][href]:not([ifc])'),
            author_link = n.querySelectorAll('a[data-from-id][href]:not([ifc]):not([data-from-id*="-"])');
        for (i = wk_vk_link.length - 1; i >= 0; --i) {
            wk_vk_link[i].setAttribute('ifc', '1');
            vkidcheck = (wk_vk_link[i].href.match(/id(\d+)$/i)||[])[1];
            if ((storage.friends.domains[vkidcheck] || storage.friends.ids[vkidcheck])) {
                wk_vk_link[i].innerHTML +='<font color="green">[ДА]</font>';
            } else if (vkidcheck !== undefined && vkidcheck != uid) {
                wk_vk_link[i].innerHTML +='<font color="red">[НЕ]</font>';
            }
        }
        for (i = mention_id_link.length - 1; i >= 0; --i) {
            mention_id_link[i].setAttribute('ifc', '1');
            vkidcheck = (mention_id_link[i].getAttribute('mention_id').match(/id(\d+)$/i)||[])[1];
            if (storage.friends.domains[vkidcheck] || storage.friends.ids[vkidcheck]) {
                mention_id_link[i].innerHTML +='<font color="green">[ДА]</font>';
            } else if (vkidcheck !== undefined && vkidcheck != uid) {
                mention_id_link[i].innerHTML +='<font color="red">[НЕ]</font>';
            }
        }
        for (i =  author_link.length - 1; i >= 0; --i) {
            author_link[i].setAttribute('ifc', '1');
            vkidcheck =  author_link[i].getAttribute('data-from-id');
            if (storage.friends.domains[vkidcheck] || storage.friends.ids[vkidcheck]) {
                author_link[i].innerHTML +='<font color="green">[ДА]</font>';
            } else if (vkidcheck !== undefined && vkidcheck != uid) {
                author_link[i].innerHTML +='<font color="red">[НЕ]</font>';
            }
        }
        /////////////////
    }

    function log (t = '') {
        console.log('[IN_FRIEND_VK] '+t);
    }

    function xfriends (offset = 0) {
        var x = new XMLHttpRequest();
        x.onload = function () {
            var answer = JSON.parse(this.responseText), key, value;
            if (answer.error) {
                form_access_token();
                return;
            }
            if (!answer.response || !answer.response.items) return;
            if (offset === 0) {
                storage.friends.domains = {};
                storage.friends.ids = {};
            }
            for (key in answer.response.items) {
                value = answer.response.items[key];
                storage.friends.domains[value.domain] = true;
                storage.friends.ids[value.id] = true;
            }
            if (offset === 0 && answer.response.count >= 5000) {
                xfriends(5000);
                return;
            }
            storage.set('ftime', (Date.now() / 1000 | 0));
            storage.set('friends', JSON.stringify({
                domains: storage.friends.domains,
                ids: storage.friends.ids
            }));
            storage.friends.result = true;
            log('VKAPI data loaded');
        };
        x.onerror = function () {
            log('friends.get error!');
        };
        x.timeout = 15000;
        x.open('GET', '/api.php?oauth=1&method=friends.get&offset=' + offset + '&count=5000&fields=domain&v=5.74&access_token=' + storage.get('access_token'), true);
        x.send();
    }

    new MutationObserver(f).observe(document.body, {childList: true, subtree: true});
    log();
})();