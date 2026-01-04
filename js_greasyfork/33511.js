// ==UserScript==
// @name                GithubDashboardEnhance
// @description         Show the latest 30 starred repos in new Github dashboard and shortcuts in header navigation.
// @description:zh-CN   在 Github 新首页显示最近 30 个 star 项目，在头部导航栏中显示快捷方式
// @description:zh-TW   在 Github 新首頁顯示最近 30 個 star 項目，在頭部導航欄中顯示快捷方式
// @author              ladit
// @version             1.1.2
// @namespace           https://greasyfork.org/zh-CN/scripts/33511
// @homepageURL         https://github.com/ladit/Userscripts
// @supportURL          https://github.com/ladit/Userscripts

// @grant               GM.setValue
// @grant               GM.getValue
// @grant               GM.xmlHttpRequest
// @run-at              document-idle
// @include             https://github.com/*
// @connect             api.github.com
// @downloadURL https://update.greasyfork.org/scripts/33511/GithubDashboardEnhance.user.js
// @updateURL https://update.greasyfork.org/scripts/33511/GithubDashboardEnhance.meta.js
// ==/UserScript==

(async () => {
    let userName = document.querySelector('meta[name="user-login"]').getAttribute('content')
    if (userName === '') {
        return;
    }
    const actionMenu = document.querySelector('.AppHeader-actions > action-menu')
    if (actionMenu) {
        actionMenu.insertAdjacentHTML('afterend', `<div data-view-component="true" class="Button-withTooltip"> <a href="https://github.com/${userName}" id="item-profile-button" data-view-component="true" class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted rgh-seen--7567559453" aria-labelledby="tooltip-profile-button"> <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-person"> <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"> </path> </svg> </a> <tool-tip id="tooltip-profile-button" for="item-profile-button" data-direction="s" data-type="label" data-view-component="true" class="position-absolute sr-only" aria-hidden="true" role="tooltip">Profile</tool-tip></div><div data-view-component="true" class="Button-withTooltip"> <a href="https://github.com/${userName}?tab=repositories&type=source" id="item-repositories-button" data-view-component="true" class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted rgh-seen--7567559453" aria-labelledby="tooltip-repositories-button"> <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo"> <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"> </path> </svg> </a> <tool-tip id="tooltip-repositories-button" for="item-repositories-button" data-direction="s" data-type="label" data-view-component="true" class="position-absolute sr-only" aria-hidden="true" role="tooltip">Repositories</tool-tip></div><div data-view-component="true" class="Button-withTooltip"> <a href="/${userName}?tab=projects" id="item-projects-button" data-view-component="true" class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted rgh-seen--7567559453" aria-labelledby="tooltip-projects-button"> <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-project"> <path d="M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25ZM11.75 3a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Zm-8.25.75a.75.75 0 0 1 1.5 0v5.5a.75.75 0 0 1-1.5 0ZM8 3a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 3Z"> </path> </svg> </a> <tool-tip id="tooltip-projects-button" for="item-projects-button" data-direction="s" data-type="label" data-view-component="true" class="position-absolute sr-only" aria-hidden="true" role="tooltip">Projects</tool-tip></div><div data-view-component="true" class="Button-withTooltip"> <a href="/codespaces" id="item-codespaces-button" data-view-component="true" class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted rgh-seen--7567559453" aria-labelledby="tooltip-codespaces-button"> <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-codespaces"> <path d="M0 11.25c0-.966.784-1.75 1.75-1.75h12.5c.966 0 1.75.784 1.75 1.75v3A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm2-9.5C2 .784 2.784 0 3.75 0h8.5C13.216 0 14 .784 14 1.75v5a1.75 1.75 0 0 1-1.75 1.75h-8.5A1.75 1.75 0 0 1 2 6.75Zm1.75-.25a.25.25 0 0 0-.25.25v5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5a.25.25 0 0 0-.25-.25Zm-2 9.5a.25.25 0 0 0-.25.25v3c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-3a.25.25 0 0 0-.25-.25Z"> </path> <path d="M7 12.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm-4 0a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Z"> </path> </svg> </a> <tool-tip id="tooltip-codespaces-button" for="item-codespaces-button" data-direction="s" data-type="label" data-view-component="true" class="position-absolute sr-only" aria-hidden="true" role="tooltip">Codespaces</tool-tip></div><div data-view-component="true" class="Button-withTooltip"> <a href="/settings/organizations" id="item-organizations-button" data-view-component="true" class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted rgh-seen--7567559453" aria-labelledby="tooltip-organizations-button"> <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-organization"> <path d="M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75Zm-.25-1.75c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75Zm4 3A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Z"> </path> </svg> </a> <tool-tip id="tooltip-organizations-button" for="item-organizations-button" data-direction="s" data-type="label" data-view-component="true" class="position-absolute sr-only" aria-hidden="true" role="tooltip">Organizations</tool-tip></div><div data-view-component="true" class="Button-withTooltip"> <a href="/${userName}?tab=stars" id="item-stars-button" data-view-component="true" class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted rgh-seen--7567559453" aria-labelledby="tooltip-stars-button"> <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star"> <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"> </path> </svg> </a> <tool-tip id="tooltip-stars-button" for="item-stars-button" data-direction="s" data-type="label" data-view-component="true" class="position-absolute sr-only" aria-hidden="true" role="tooltip">Stars</tool-tip></div><div data-view-component="true" class="Button-withTooltip"> <a href="/sponsors/accounts" id="item-sponsors-button" data-view-component="true" class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted rgh-seen--7567559453" aria-labelledby="tooltip-sponsors-button"> <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-heart"> <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002ZM4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.58 20.58 0 0 0 8 13.393a20.58 20.58 0 0 0 3.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.749.749 0 0 1-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5Z"> </path> </svg> </a> <tool-tip id="tooltip-sponsors-button" for="item-sponsors-button" data-direction="s" data-type="label" data-view-component="true" class="position-absolute sr-only" aria-hidden="true" role="tooltip">Sponsors</tool-tip></div><div data-view-component="true" class="Button-withTooltip"> <a href="https://gist.github.com/mine" id="item-gist-button" data-view-component="true" class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted rgh-seen--7567559453" aria-labelledby="tooltip-gist-button"> <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-code-square"> <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Zm7.47 3.97a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1 0 1.06l-2 2a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L10.69 8 9.22 6.53a.75.75 0 0 1 0-1.06ZM6.78 6.53 5.31 8l1.47 1.47a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-2-2a.75.75 0 0 1 0-1.06l2-2a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"> </path> </svg> </a> <tool-tip id="tooltip-gist-button" for="item-gist-button" data-direction="s" data-type="label" data-view-component="true" class="position-absolute sr-only" aria-hidden="true" role="tooltip">Gists</tool-tip></div><div data-view-component="true" class="Button-withTooltip"> <a href="https://docs.github.com" id="item-docs-button" data-view-component="true" class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted rgh-seen--7567559453" aria-labelledby="tooltip-docs-button"> <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-book"> <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z"> </path> </svg> </a> <tool-tip id="tooltip-docs-button" for="item-docs-button" data-direction="s" data-type="label" data-view-component="true" class="position-absolute sr-only" aria-hidden="true" role="tooltip">Docs</tool-tip></div>`)
    }

    const rightFooter = document.querySelector('div[aria-label="Explore repositories"] > .footer')
    if (!rightFooter) {
        return;
    }

    const fetchMap = async (key, defaultMap) => {
        const v = await GM.getValue(key)
        if (!v) {
            return defaultMap
        }
        return new Map(JSON.parse(v))
    }

    const storeMap = async (key, m) => {
        await GM.setValue(key, JSON.stringify(Array.from(m.entries())))
    }

    const lastStoreColors = await GM.getValue('lastStoreColors', 0)
    if (lastStoreColors + 30 * 86400000 < Date.now()) {
        GM.xmlHttpRequest({
            method: 'GET',
            timeout: 5000,
            responseType: 'json',
            url: 'https://raw.githubusercontent.com/ozh/github-colors/master/colors.json',
            onload: async resp => {
                let languageColors = new Map()
                for (const [language, v] of Object.entries(resp.response)) {
                    languageColors.set(language, v.color)
                }
                await storeMap('languageColors', languageColors)
                await GM.setValue('lastStoreColors', Date.now())
            },
            onerror: resp => {
                console.log('[GithubDashboardEnhance]: request colors failed: ', resp)
            },
            ontimeout: () => {
                console.log('[GithubDashboardEnhance]: Request colors timeout.')
            },
        })
    }

    const lastStoreStarredReposTime = await GM.getValue('lastStoreStarredReposTime', 0)
    if (lastStoreStarredReposTime + 86400000 < Date.now()) {
        GM.xmlHttpRequest({
            method: 'GET',
            timeout: 5000,
            responseType: 'json',
            url: `https://api.github.com/users/${userName}/starred`,
            onload: async resp => {
                const languageColors = await fetchMap('languageColors', new Map())
                let starredReposBlock = '<h2 class="f5 text-bold pt-3 mt-4 border-top">Recent Starred repositories</h2><div data-view-component="true">'
                let i = 0
                for (const repo of resp.response) {
                    i += 1
                    let border = ''
                    if (i < resp.response.length) {
                        border = 'border-bottom'
                    }
                    starredReposBlock += `<div data-view-component="true" class="py-4 ${border}"> <div data-view-component="true" class="Truncate d-flex flex-justify-between"> <span style="word-wrap:normal;max-width: 300px;" data-view-component="true" class="Truncate-text ws-normal flex-1"> <img src="${repo.owner.avatar_url}" alt="@${repo.owner.login} profile" size="20" height="20" width="20" data-view-component="true" class="avatar avatar-small circle box-shadow-none mr-1"> <a href="${repo.html_url}" data-view-component="true" class="color-fg-default text-bold"> ${repo.owner.login} <span data-view-component="true" class="color-fg-muted text-light">/</span> ${repo.name} </a></span> </div> <p data-view-component="true" class="text-small color-fg-muted mt-2"> ${repo.description} </p> <div data-view-component="true" class="f6 color-fg-muted d-inline-block mr-4 mt-1"> <svg aria-label="star" role="img" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star"> <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"> </path> </svg> ${repo.stargazers_count > 1000 ? (repo.stargazers_count / 1000).toFixed(1) + 'k' : repo.stargazers_count} </div> <div data-view-component="true" class="f6 color-fg-muted d-inline-block mt-1"> <span class=""> <span class="repo-language-color" style="background-color: ${languageColors.get(repo.language)}"></span> <span itemprop="programmingLanguage">${repo.language}</span> </span> </div> </div>`
                }
                starredReposBlock += `<a href="/${userName}?tab=stars" data-view-component="true">More →</a></div>`
                await GM.setValue('starredReposBlock', starredReposBlock)
                await GM.setValue('lastStoreStarredReposTime', Date.now())
            },
            onerror: resp => {
                console.log('[GithubDashboardEnhance]: request failed: ', resp)
            },
            ontimeout: () => {
                console.log('[GithubDashboardEnhance]: Request timeout.')
            },
        })
    }
    rightFooter.insertAdjacentHTML('beforebegin', await GM.getValue('starredReposBlock', ''))
})()
