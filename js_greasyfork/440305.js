// ==UserScript==
// @name Greasy Fork Install Button at search
// @namespace -
// @version 1.2.0
// @description Adds an install button to search and user pages
// @author NotYou
// @match *://sleazyfork.org/*
// @match *://greasyfork.org/*
// @grant GM.addStyle
// @grant GM.addElement
// @run-at document-idle
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/440305/Greasy%20Fork%20Install%20Button%20at%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/440305/Greasy%20Fork%20Install%20Button%20at%20search.meta.js
// ==/UserScript==

!function() {
    const { protocol, hostname } = location
    const linkBuilder = {
        createUserScriptLink: (scriptId, scriptName) => `${protocol}//${hostname}/scripts/${scriptId}/code/${scriptName}.user.js`,
        createUserStyleLink: (styleId, styleName) => `${protocol}//${hostname}/scripts/${styleId}/code/${styleName}.user.css`,
        createLibraryLink: (libraryId, libraryName) => `${protocol}//${hostname}/scripts/${libraryId}/code/${libraryName}.js`
    }

    GM.addStyle(`
    .install-link.custom-install-link, .install-link.custom-install-link:hover {
      display: inline;
      font-size: 0.75rem;
      border-radius: 0.25rem;
      text-decoration: none;
      padding: 0.25em 0.5em;
      margin-left: 0.5em;
      transition: background-color 200ms;
    }

    .custom-install-link:hover {
      background-color: rgb(30, 151, 30);
    }
    `)

    // User Styles

    document.querySelectorAll(
        '#user-script-list > li[data-script-language="css"] > article > h2 > a,' +
        '#browse-script-list > li[data-script-language="css"] > article > h2 > a'
    ).forEach(async ($styleLink) => {
        const styleData = $styleLink.parentNode.parentNode.parentNode.dataset

        const $installAsStyleBtn = await GM.addElement('a', {
            href: linkBuilder.createUserStyleLink(styleData.scriptId, styleData.scriptName),
            class: 'install-link custom-install-link',
            textContent: 'Install as style',
            target: '_blank',

            'data-install-format': 'css',
            'data-script-id': styleData.scriptId,
            'data-script-name': styleData.scriptName,
            'data-post-install-url': location.href
        })

        $styleLink.after($installAsStyleBtn)
    })

    // User Scripts

    document.querySelectorAll(
        '#user-script-list > li[data-script-type="public"] > article > h2 > a,' +
        '#browse-script-list > li[data-script-type="public"] > article > h2 > a'
    ).forEach(async ($scriptLink) => {
        const scriptData = $scriptLink.parentNode.parentNode.parentNode.dataset

        const $installBtn = await GM.addElement('a', {
            href: linkBuilder.createUserScriptLink(scriptData.scriptId, scriptData.scriptName),
            class: 'install-link custom-install-link',
            textContent: 'Install',

            'data-install-format': 'js',
            'data-script-id': scriptData.scriptId,
            'data-script-name': scriptData.scriptName,
            'data-post-install-url': location.href
        })

        $scriptLink.after($installBtn)
    })

    // Libraries

    document.querySelectorAll(
        '#user-library-script-list > li > article > h2 > a, ' +
        '#browse-script-list > li[data-script-type="library"] > article > h2 > a'
    ).forEach(async ($libraryLink) => {
        const libraryData = $libraryLink.parentNode.parentNode.parentNode.dataset
        const codeUrl = libraryData.codeUrl

        const $copyUrlBtn = await GM.addElement('a', {
            href: '#!',
            class: 'install-link custom-install-link',
            textContent: 'Copy URL (always latest)'
        })

        const $copyUrlCurrentBtn = await GM.addElement('a', {
            href: '#!',
            class: 'install-link custom-install-link',
            textContent: 'Copy URL (current version)'
        })

        $copyUrlBtn.addEventListener('click', ev => {
            ev.preventDefault()

            const libraryUrl = linkBuilder.createLibraryLink(libraryData.scriptId, libraryData.scriptName)

            navigator.clipboard.writeText(libraryUrl)

            alert(
                `"${libraryUrl}" url is copied!\n\n` +
                'Code from this url will be updated automatically when the changes code to the library'
            )
        })

        $copyUrlCurrentBtn.addEventListener('click', ev => {
            ev.preventDefault()


            navigator.clipboard.writeText(codeUrl)

            alert(
                `"${codeUrl}" url is copied!\n\n` +
                'Code from this url will NOT be updated, even if the latest version is different'
            )
        })

        $libraryLink.after($copyUrlBtn)
        $libraryLink.after($copyUrlCurrentBtn)
    })
}()
