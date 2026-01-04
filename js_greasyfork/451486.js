// ==UserScript==
// @name         Redirect userstyles.org to uso.kkx.one (UserStyles.org Archive)
// @namespace    https://greasyfork.org/users/124677-pabli
// @version      0.4
// @description  Makes userstyles.org actually usable
// @author       Pabli
// @license      MIT
// @match        http*://userstyles.org/*
// @match        http*://uso.kkx.one/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://uso.kkx.one
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451486/Redirect%20userstylesorg%20to%20usokkxone%20%28UserStylesorg%20Archive%29.user.js
// @updateURL https://update.greasyfork.org/scripts/451486/Redirect%20userstylesorg%20to%20usokkxone%20%28UserStylesorg%20Archive%29.meta.js
// ==/UserScript==

if (window.location.hostname == 'userstyles.org' && window.location.search != '?noredirect') {

    let path = window.location.pathname.split('/')
    let p

    path[3] == 'newest-styles' ? p = 'browse/styles?sort=created' :
    path[3] == 'recently-updated' ? p = 'browse/styles?sort=updated' :
    path[3] == 'editors-choice' ? p = 'browse/styles?sort=rating' :
    path[2] == 'browse' && !path[3] ? p = 'browse/styles' :
    path[2] == 'browse' ? p = 'browse/styles?search=%23' + path[3] :
    path[1] == 'user-profile' ? p = 'browse/styles?search=%40' + path[2] :
    path[1] == 'categories' ? p = 'browse/categories' :
    path[1] == 'styles' ? p = 'style/' + path[2] : p = ''

    location.href = 'https://uso.kkx.one/' + p
}
// Make "View on UserStyles.org" button work without disabling the script
if (window.location.hostname == 'uso.kkx.one') {

    let observer = new MutationObserver(mutations => {
        let btn = document.querySelector('.container a[href^="https://userstyles.org/styles"]:not([href$="?noredirect"])')
        if (btn) {
            let title = document.querySelector('.container > h1').innerText
            title = title.replaceAll(/\W+/g, '-').replace(/-$/, '').toLowerCase()
            btn.href += '/' + title + '?noredirect'
        }
    })
    observer.observe(document.body, { childList: true, subtree: true })

}