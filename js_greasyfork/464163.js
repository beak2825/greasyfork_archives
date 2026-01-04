// ==UserScript==
// @name         Kemono访问时间记录&去广告
// @namespace    https://greasyfork.org/users/325815
// @version      2.0
// @description  移除页面的部分广告，并且在关注(favorites)及作者页面记录和展示上次的访问时间
// @author       monat151
// @match        http*://kemono.su/*
// @match        http*://kemono.cr/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/464163/Kemono%E8%AE%BF%E9%97%AE%E6%97%B6%E9%97%B4%E8%AE%B0%E5%BD%95%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/464163/Kemono%E8%AE%BF%E9%97%AE%E6%97%B6%E9%97%B4%E8%AE%B0%E5%BD%95%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

setTimeout(() => {
    const _vd_valueKey = 'kemono_monat_last_visit'
    let lastvisit_appended = false
    let lastpage = ''

    const isFavPage = () => {
        return document.location.href.includes('favorites')
    }
    const getAuthorId = () => {
        if (document.location.href.includes('/post/')) return ''
        return document.location.href.match(/\/user\/(\d+)/)?.[1] ?? ''
    }
    const getAuthorLVKey = (aid) => `kemono_monat_last_visit_author_${aid}`

    setInterval(() => {
        console.log('lastvisit_appended:',lastvisit_appended,'isFavPage:',isFavPage())
        // 当页面路由发生更改时，重置访问时间元素的生成状态
        if (document.location.href !== lastpage) {
            lastpage = document.location.href
            lastvisit_appended = false
        }

        // 显示上次访问时间 仅限关注(favorites)页面
        if (!lastvisit_appended && isFavPage()) {
            let lastVisitDate = GM_getValue(_vd_valueKey) ?? 'NEVER';
            const _element = document.createElement('div');
            _element.style = 'justify-content: center; display: grid; margin-top: 3px;'
            _element.innerHTML = `<label>- Last Visit: ${lastVisitDate} -</label>`;
            const target = document.location.href.includes('account/favorites/artists') ? document.getElementById('filter-favorites') : document.getElementsByClassName('dropdowns')[0]
            console.log('target:',target)
            if (target) {
                target.after(_element)
                lastvisit_appended = true
                const currDate = new Date()
                const currDateString = currDate.toLocaleString()
                GM_setValue(_vd_valueKey, currDateString)
            }
        }

        const authorId = getAuthorId()
        if (!lastvisit_appended && authorId) {
            const vkey = getAuthorLVKey(authorId)
            let lastVisitDate = GM_getValue(vkey) ?? 'NEVER';
            const _element = document.createElement('div');
            _element.style = 'justify-content: center; display: grid; margin-top: 3px;'
            _element.innerHTML = `<label>- Last Visit: ${lastVisitDate} -</label>`;
            const target = document.getElementsByClassName('user-header')[0]
            console.log('target:',target)
            if (target) {
                target.after(_element)
                lastvisit_appended = true
                const currDate = new Date()
                const currDateString = currDate.toLocaleString()
                GM_setValue(vkey, currDateString)
            }
        }

        // 去广告
        (['ad-container', 'root--ujvuu']).forEach(key => {
            const ads = [...(document.getElementsByClassName(key))]
            ads.forEach(ad => {
                ad.style = 'display: none;'
                ad.remove()
            })
        })
    }, 500);
}, 1500)