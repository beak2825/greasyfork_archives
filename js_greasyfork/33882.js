// ==UserScript==
// @name         Chamilo document tree
// @namespace    https://rkok.nl/
// @version      1
// @description  Walks directory tree and renders it on the page
// @author       rkok
// @match        *://*/main/document/document.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33882/Chamilo%20document%20tree.user.js
// @updateURL https://update.greasyfork.org/scripts/33882/Chamilo%20document%20tree.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function() {
    const walkTree = (html, target) => {
        const rows = $(html).find('.data_table tr').toArray().slice(1);
        if( ! rows) return;

        const nodes = rows.map(row => {
            const mainLink = $('a', row)[1];
            const isFolder = (row.innerHTML.indexOf('folder_document') !== -1);
            return {
                name: mainLink.title,
                url_nav: isFolder ? mainLink.href : false,
                url_dl: $('img[title="Download"]', row).parent()[0].href
            };
        });

        const ul = $('<ul></ul>');
        target.append(ul);

        nodes.forEach(node => {
            const domnode = $(`<li><a href='${node.url_dl}'>${node.name}</a></li>`);
            ul.append(domnode);

            if(node.url_nav) {
                const loading = $('<span class="loader"></span>');
                domnode.append(loading);
                $.get(node.url_nav, html => {
                    loading.remove();
                    walkTree(html, domnode);
                });
            }
        });
    };

    // Loader animation styling
    $(`<style>@keyframes loader{to{transform:rotate(360deg)}}.loader{content:'';display:inline-block;box-sizing:border-box;width:13px;height:13px;margin-left:10px;border-radius:50%;border:2px solid #ccc;border-top-color:#333;animation:loader .6s linear infinite}</style>`)
        .appendTo($('body'));

    const root = $('<div></div>');
    $('.data_table').parent().append(root);
    walkTree(document, root);
})();