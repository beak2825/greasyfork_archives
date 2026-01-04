// ==UserScript==
// @name         Amazon eBook Mark
// @namespace    https://greasyfork.org/users/34380
// @version      20210724
// @description  标记已购的电子书。
// @match        https://www.amazon.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/429768/Amazon%20eBook%20Mark.user.js
// @updateURL https://update.greasyfork.org/scripts/429768/Amazon%20eBook%20Mark.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const is_autosave = GM_getValue('is_autosave', false);
    const loc = location.href;
    let asins_s = GM_getValue('asins_saved', []);
    let asins_a = GM_getValue('asins_added', []);

    if (loc.match(/\/kindle-dbs\/thankYouPage/) && is_autosave) {
        autoSaveBookPage();
    }
    setTimeout(() => {
        addBookButton();
        if (document.querySelector('#ng-app')) {
            saveAllBooksPage();
        } else if (loc.match(/\/dp\//) || loc.match(/\/product\//)) {
            viewBookDetailPage();
        }
        markBooksPage();
    }, 5000);

    function addBookButton() {
        document.querySelector('#nav-xshop').insertAdjacentHTML('afterbegin', `
            <a id="display-panel" class="nav-a">添加书籍</a>
        `);
        document.querySelector('body').insertAdjacentHTML('afterbegin', `
            <div id="fixed-panel">
                <button id="refresh-page">刷新</button>
                <button id="btn-add-book">添加</button>
                <button id="btn-delete-book">删除</button>
                <input id="book-link" type="text" placeholder="输入书籍链接"></input>
            </div>
        `);
        document.querySelector('#display-panel').addEventListener('click', () => {
            document.querySelector('#fixed-panel').style.display = 'block';
        });
        document.querySelector('#refresh-page').addEventListener('click', () => {
            const nodes_added = document.querySelectorAll('.added');
            for (const node of nodes_added) {
                const href = node.parentNode.href;
                const matched = href.match(/dp\/(\w+)\//) || href.match(/\/product\/(\w+)\?/);
                if (!asins_a.includes(matched[1])) {
                    node.classList.remove('added');
                }
            }
            markOwnedAdded(document);
        });
        document.querySelector('#btn-add-book').addEventListener('click', () => {
            const input_link = document.querySelector('#book-link');
            const asin = input_link.value.match(/\/dp\/(\w+)/) || input_link.value.match(/\/product\/(\w+)/);
            if (!asins_a.includes(asin[1])) {
                asins_a.push(asin[1]);
                GM_setValue('asins_added', asins_a);
                input_link.value = '';
                input_link.setAttribute('placeholder', '添加成功');
            } else {
                input_link.value = '';
                input_link.setAttribute('placeholder', '已添加');
            }
        });
        document.querySelector('#btn-delete-book').addEventListener('click', () => {
            const input_link = document.querySelector('#book-link');
            const asin = input_link.value.match(/\/dp\/(\w+)/) || input_link.value.match(/\/product\/(\w+)/);
            if (asins_a.includes(asin[1])) {
                asins_a.splice(asins_a.indexOf(asin[1]), 1);
                GM_setValue('asins_added', asins_a);
                input_link.value = '';
                input_link.setAttribute('placeholder', '删除成功');
            } else {
                input_link.value = '';
                input_link.setAttribute('placeholder', '已删除');
            }
        });
    }

    function saveAllBooksPage() {
        document.querySelector('.myx-spacing-top-mini').insertAdjacentHTML('beforeend', `
            <div id="myx-panel" class="myx-float-left">
                <button id="save-asins" type="button" title="每页可显示 200 个，滚动到页尾加载，再点击保存按钮。">保存本页电子书</button>
                <button id="clear-asins-added" type="button">清空已添加书籍</button>
                已保存 <span id="saved">${asins_s.length}</span> 本，添加已购 <span id="added">${asins_a.length}</span>本。
                <label id="label-autosave"><input id="cb-autosave" type="checkbox"></input>购买后自动保存</label>
            </div>
        `);

        document.querySelector('#save-asins').addEventListener('click', () => {
            const items = document.querySelectorAll('.listItem_myx > div');
            for (const item of items) {
                const asin = item.getAttribute('name').replace('contentTabList_', '');
                if (!asins_s.includes(asin)) { asins_s.push(asin); }
            }
            GM_setValue('asins_saved', asins_s);
            document.querySelector('#saved').innerText = asins_s.length;
        });

        document.querySelector('#clear-asins-added').addEventListener('click', () => {
            GM_setValue('asins_added', []);
        });

        document.querySelector('#cb-autosave').checked = GM_getValue('is_autosave', false);
        document.querySelector('#cb-autosave').addEventListener('click', function () {
            GM_setValue('is_autosave', this.checked);
        });
    }

    function autoSaveBookPage() {
        const asin_loc = loc.match(/asin=(\w+)&/)[1];
        if (!asins_s.includes(asin_loc)) {
            asins_s.push(asin_loc);
            GM_setValue('asins_saved', asins_s);
            document.title = '已购电子书自动保存成功。';
        }
    }

    function viewBookDetailPage() {
        const asin_loc = loc.match(/\/dp\/(\w+)/) || loc.match(/\/product\/(\w+)/);
        if (!asins_s.includes(asin_loc[1])) {
            document.querySelector('#title').insertAdjacentHTML('afterbegin', `
                <label id="label-add-book"><input id="cb-add-book" class="nav-a" type="checkbox"></input>添加到已购书籍</label>
            `);

            document.querySelector('#cb-add-book').checked = asins_a.includes(asin_loc[1]);
            document.querySelector('#cb-add-book').addEventListener('click', function () {
                if (this.checked) {
                    asins_a.push(asin_loc[1]);
                    GM_setValue('asins_added', asins_a);
                } else {
                    asins_a.splice(asins_a.indexOf(asin_loc[1]), 1);
                    GM_setValue('asins_added', asins_a);
                }
            });
        }
    }

    function markBooksPage() {
        markOwnedAdded(document);
        const config = { attributes: false, childList: true, subtree: true };
        const threadMutation = (mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type == 'childList' && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeName == 'DIV') { markOwnedAdded(node); }
                    }
                }
            }
        };
        let container = document.querySelector("#a-page");
        let threadObserver = new MutationObserver(threadMutation);
        threadObserver.observe(container, config);
    }

    function markOwnedAdded(node) {
        // 1/2 common top and bottom 3 search 4 recommend 5 bestseller 6 product
        const title_class1 = ['.acs-product-block__product-title',
            '.a-spacing-top-small > .a-link-normal',
            '.s-line-clamp-2 > .a-link-normal.a-text-normal'];
        const titles1 = node.querySelectorAll(title_class1.join(','));
        for (const title of titles1) {
            const href = title.href;
            const asin = href.match(/\/dp\/(\w+)/)[1] ;
            if (asins_s.includes(asin)) {
                title.querySelector('*').classList.add('owned');
            } else if (asins_a.includes(asin)) {
                title.querySelector('*').classList.add('added');
            }
        }

        const title_class2 = ['.a-carousel-card > div > .a-link-normal:nth-last-of-type(1)',
            '.aok-inline-block.zg-item > .a-link-normal'];
        const titles2 = node.querySelectorAll(title_class2.join(','));
        for (const title of titles2) {
            const href = title.href;
            const asin = href.match(/\/dp\/(\w+)/)[1];
            if (asins_s.includes(asin)) {
                title.querySelector(':nth-child(2)').classList.add('owned');
            } else if (asins_a.includes(asin)) {
                title.querySelector(':nth-child(2)').classList.add('added');
            }
        }

        const title_class3 = ['.a-box-group.a-spacing-top-micro >.a-size-small.a-link-normal'];
        const titles3 = node.querySelectorAll(title_class3.join(','));
        for (const title of titles3) {
            const href = title.href;
            const asin = href.match(/\/product\/(\w+)/)[1];
            if (asins_s.includes(asin)) {
                title.classList.add('owned');
            } else if (asins_a.includes(asin)) {
                title.classList.add('added');
            }
        }
    }

    document.querySelector('head').insertAdjacentHTML('beforeend', `<style>
        #myx-panel { margin-left: 10px; }
        #myx-panel > button{ height: 31px; padding: 0 10px 0 11px; }
        #fixed-panel { display: none; position: fixed; left: 240px; bottom: 30px; z-index: 2; }
        #label-add-book { width: max-content; font-size: 14px; }
        #label-add-book:hover { background-color: #fc9b1a; }
        #cb-add-book { margin: revert; vertical-align: middle; position: revert; }
        #label-autosave { display: revert; padding: 5px; }
        #label-autosave:hover { background-color: #fc9b1a; }
        #cb-autosave { margin: revert; vertical-align: middle; position: revert; }
        .owned { background-color: #8bc34a; }
        .added { background-color: #fc9b1a; }
    </style>`);
})();