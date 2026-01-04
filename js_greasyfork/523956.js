// ==UserScript==
// @name         GF举报查看页面功能快速翻页
// @namespace    shenchanran
// @version      0.0.1
// @description  在GF的举报查看页面快速地上翻与下翻页，并且在头部添加“举报查看”功能
// @author       申禅姌
// @match        https://greasyfork.org/*
// @icon         data:image/ong;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggEBCQHM3fXsAAAAVdJREFUOMudkz2qwkAUhc/goBaGJBgUtBCZyj0ILkpwAW7Bws4yO3AHLiCtEFD8KVREkoiFxZzX5A2KGfN4F04zMN+ce+5c4LMUgDmANYBnrnV+plBSi+FwyHq9TgA2LQpvCiEiABwMBtzv95RSfoNEHy8DYBzHrNVqVEr9BWKcqNFoxF6vx3a7zc1mYyC73a4MogBg7vs+z+czO50OW60Wt9stK5UKp9Mpj8cjq9WqDTBHnjAdxzGQZrPJw+HA31oulzbAWgLoA0CWZVBKIY5jzGYzdLtdE9DlcrFNrY98zobqOA6TJKHW2jg4nU5sNBpFDp6mhVe5rsvVasUwDHm9Xqm15u12o+/7Hy0gD8KatOd5vN/v1FozTVN6nkchxFuI6hsAAIMg4OPxMJCXdtTbR7JJCMEgCJhlGUlyPB4XfumozInrupxMJpRSRtZlKoNYl+m/6/wDuWAjtPfsQuwAAAAASUVORK5CYII=
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523956/GF%E4%B8%BE%E6%8A%A5%E6%9F%A5%E7%9C%8B%E9%A1%B5%E9%9D%A2%E5%8A%9F%E8%83%BD%E5%BF%AB%E9%80%9F%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/523956/GF%E4%B8%BE%E6%8A%A5%E6%9F%A5%E7%9C%8B%E9%A1%B5%E9%9D%A2%E5%8A%9F%E8%83%BD%E5%BF%AB%E9%80%9F%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    //76480是当前最新的举报ID，如果你用的时候太老了就尝试加大数字，当你翻页的时候，脚本会储存当前Id，保证你每次点进来都从上次的开始看
    const reportId = GM_getValue('GFreportsId','76480')
    let newId = GM_getValue('GFreportsIdNew',reportId)//访问从没看过的id时，如果是最大的值，储存为最新id
    const $w = unsafeWindow
    const $d = $w.document
    const $ = s => { return $d.querySelector(s) }
    let r = setInterval(() => {
        try {
            let s = $('.text-content')
            if (s) {
                if (s.innerHTML.includes('被举报用户') || s.innerHTML.includes('404 - 页面未找到')) {
                    const match = $w.location.href.match(/\/(\d+)$/);
                    // 如果找到了匹配的数字部分
                    if (match) {
                        const h4 = s.querySelector('h4')
                        if (h4) {
                            h4.style.marginTop = '5px'
                        }
                        let id = match[1]
                        if(!s.innerHTML.includes('404 - 页面未找到')){
                            GM_setValue('GFreportsId',id)
                            if(id>newId){
                                newId = id
                                GM_setValue('GFreportsIdNew',id)
                            }
                        }
                        id = id * 1
                        const pre = $d.createElement('a')
                        const next = $d.createElement('a')
                        const neww = $d.createElement('a')
                        pre.setAttribute('href', `https://greasyfork.org/zh-CN/reports/${id - 1}`)
                        next.setAttribute('href', `https://greasyfork.org/zh-CN/reports/${id + 1}`)
                        neww.setAttribute('href', `https://greasyfork.org/zh-CN/reports/${newId}`)
                        neww.setAttribute('title', '此链接并不会定位到GF最新的举报，而是定位到你查看过的最新的举报')
                        pre.style.marginRight = '10px'
                        next.style.marginRight = '10px'
                        next.innerHTML = '下一个'
                        pre.innerHTML = '上一个'
                        neww.innerHTML = '查看最新'
                        if(id!=newId){
                            s.insertBefore(neww, s.firstChild)
                        }
                        s.insertBefore(next, s.firstChild)
                        s.insertBefore(pre, s.firstChild)
                        clearInterval(r)
                    } else {
                        console.log("没有找到数字部分");
                    }
                }
            }
        } catch (e) {
            console.log(e)
            clearInterval(r)
        }
    }, 200)
    let e = setInterval(() => {
        try{
            let navs = $d.querySelectorAll('nav')
            for(let nav of navs){
                if (nav.innerHTML.includes('更多')&&nav.innerHTML.includes('帮助')&&nav.innerHTML.includes('论坛')) {
                    let li = $d.createElement('li')
                    li.setAttribute('class', 'scripts-index-link')
                    li.innerHTML = `<a href="/zh-CN/reports/${reportId}">举报查看</a>`
                    nav.insertBefore(li, nav.firstChild)
                    clearInterval(e)
                }
            } 
        }catch(e){
            console.log(e)
            clearInterval(e)
        }
    }, 200)
})();