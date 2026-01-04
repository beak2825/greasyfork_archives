// ==UserScript==
// @name         Factorio: Block MODs and MOD authors
// @name:ja      Factirio: MODおよびMOD作者をブロック
// @namespace    https://2238.club/
// @version      1.0.1
// @description  This script provides buttons to block MODs and MOD authors on the MOD portal
// @description:ja MODポータルに個々のMODや特定の作者のMODを一式ブロックするボタンを追加します
// @author       sakuro
// @match        https://mods.factorio.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=factorio.com
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/502332/Factorio%3A%20Block%20MODs%20and%20MOD%20authors.user.js
// @updateURL https://update.greasyfork.org/scripts/502332/Factorio%3A%20Block%20MODs%20and%20MOD%20authors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const uniq = (array) => [...new Set(array)];

    class BlockList {
        constructor(key) {
            this.key = key;
            this.load();
        }

        load() {
            const rawData = localStorage.getItem(this.key);
            this.list = rawData ? JSON.parse(rawData) : [];
        }

        save() {
            localStorage.setItem(this.key, JSON.stringify(this.list));
        }

        add(item) {
            this.list = uniq([item, ...this.list]);
            this.save();
        }

        isBlocked(item) {
            return this.list.includes(item);
        }

        clear() {
            this.list = [];
            localStorage.removeItem(this.key);
        }
    };

    const getNames = (anchor, prefix) => {
        try {
            if (!(anchor instanceof HTMLAnchorElement)) {
                throw new Error('anchor must be an HTMLAnchorElement');
            }
            if (!prefix.startsWith('/') || !prefix.endsWith('/')) {
                throw new Error('prefix must start and end with /');
            }

            const textContent = anchor.textContent.trim() || '';
            const href = anchor.getAttribute('href') || '';
            const pathname = new URL(href, document.location).pathname;
            const strippedHref = pathname.startsWith(prefix) ? pathname.substring(prefix.length) : pathname;

            return [textContent, strippedHref];
        } catch (error) {
            console.error({anchor, prefix, error});
            return [];
        }
    }


    const getMod = (mod) => getNames(mod.querySelector('a[href^="/mod/"]'), '/mod/');
    const getAuthor = (mod) => getNames(mod.querySelector('a[href^="/user/"]'), '/user/');

    const blockedMods = new BlockList('blocked mods');
    const blockedAuthors = new BlockList('blocked authors');

    const modList = document.querySelector('.mod-list');

    const onBlockMod = (mod) => {
        return (evt) => {
            const [name, id] = getMod(mod, '/mod/');
            blockedMods.add(id);
            refresh(modList);
        };
    };

    const onBlockAuthor = (mod) => {
        return (evt) => {
            const [name, id] = getAuthor(mod, '/user/');
            blockedAuthors.add(id);
            refresh(modList);
        };
    };


    const onUnblockAll = (evt) => {
        blockedAuthors.clear();
        blockedMods.clear();
        refresh(modList);
    };

    const createButton = (iconName, tooltip, handler) => {
        const div = document.createElement('div');
        div.classList.add('mr12');

        const button = document.createElement('button');
        button.classList.add('button');
        button.style = 'min-width: 44px; line-height: 1; text-align: center;';
        button.title = tooltip;
        button.ariaLabel = tooltip;
        button.addEventListener('click', handler);

        const icon = document.createElement('i');
        icon.classList.add('fa');
        icon.classList.add(iconName);

        button.append(icon);
        div.append(button);

        return div;
    };

    const refresh = (list) => {
        list.querySelectorAll('.panel-inset-lighter.flex-column.p0').forEach((e) => {
            const [authorName, authorId] = getAuthor(e);
            if (! authorId) {
                console.log("author not found");
                return;
            }

            const [modName, modId] = getMod(e);
            if (! modId) {
                console.log("mod not found");
                return;
            }

            if (blockedAuthors.isBlocked(authorId)) {
                e.style.display = 'none';
                console.log(`Blocked: ${modId} by ${authorId}`);
            } else if (blockedMods.isBlocked(modId)) {
                e.style.display = 'none';
                console.log(`Blocked: ${modId}`);
            } else {
                e.style.display = 'block';
                const section = e.querySelector('.mod-download-section');
                const lastElement = section.lastElementChild;
                if (section.querySelectorAll('.mr12').length < 4) {
                    const blockModButton = createButton('fa-circle-xmark', 'Block this mod', onBlockMod(e));
                    lastElement.insertAdjacentElement('beforebegin', blockModButton);
                    const blockAuthorButton = createButton('fa-person-circle-xmark', 'Block this author', onBlockAuthor(e));
                    lastElement.insertAdjacentElement('beforebegin', blockAuthorButton);
                }
            }
        });
    };

    const unblockAllButton = createButton('fa-recycle', 'Unblock all blocked MODs and MOD authors', onUnblockAll);
    document.querySelector('.header-links').appendChild(unblockAllButton);

    refresh(modList);
}());

