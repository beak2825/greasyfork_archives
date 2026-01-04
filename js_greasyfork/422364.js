// ==UserScript==
// @name         Pure bilibili
// @namespace    https://www.bilibili.com/
// @version      0.1
// @description  Offer a pure bilibili home page
// @author       You
// @match        https://www.bilibili.com/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/422364/Pure%20bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/422364/Pure%20bilibili.meta.js
// ==/UserScript==
(function() {
    const search_box_holder = 'ricercare videi'
    const right_font_style = 'color: #000; white-space: nowrap; text-shadow: none'
    delete_dom_by_className(['b-wrap', 'international-footer', 'bili-banner', 'contact-help', 'nav-link'])
    
    window.addEventListener('load', function(){
        delete_dom_by_className(['nav-search-btn', 'search-icon'])
        beauty_dom_by_id([
            {
                'name': 'app',
                'style': 'height: 100%'
            }
        ])
        beauty_dom_by_className([
            {
                'name': 'name',
                'style': right_font_style
            },{
                'name': 'mini-header',
                'style': 'position: relative; z-index: 1; width: 100%; height: 100%;'
            },{
                'name': 'mini-header__content',
                'style': 'flex-direction: column-reverse; height: 100%'
            },{
                'name': 'international-home',
                'style': 'height: 100%'
            },{
                'name': 'international-header',
                'style': 'height: 100%'
            },{
                'name': 'nav-search-box',
                'style': 'display: flex; margin: 0; height: 100%; width: 100%; align-items: center; justify-content: center; padding-bottom: 150px'
            },{
                'name': 'nav-search',
                'style': 'width: 500px'
            },{
                'name': 'nav-search-keyword',
                'style': 'border: 1px solid #e5e9ef; padding: 0 10px; box-shadow: 0 2px 4px rgb(0 0 0 / 16%); height: 45px; font-size: 18px'
            },{
                'name': 'nav-user-center',
                'style': 'display: inline-flex; flex-shrink: 0; flex-direction: row; align-self: flex-end; justify-items: flex-end;'
            }
        ])
        beauty_dom_by_id([
            {
                'name': 'nav_searchform',
                'style': 'padding: 0'
            }
        ])

        const nav_search_keyword = document.getElementsByClassName('nav-search-keyword')[0]
        nav_search_keyword.setAttribute('placeholder', search_box_holder)
        nav_search_keyword.focus()
    })

    
})();

function beauty_dom_by_className(targets){
    targets.forEach(target => {
        let dom = document.getElementsByClassName(target.name)
        for(let i = 0; i < dom.length; i++){
            dom[i].style.cssText = target.style;
        }
    });
}

function beauty_dom_by_id(targets){
    targets.forEach(target => {
        let dom = document.getElementById(target.name)
        dom.style.cssText = target.style;
    });
}

function delete_dom_by_className(names){
    names.forEach(name => {
        let dom = document.getElementsByClassName(name)
        while(dom.length > 0){
            dom[0].remove()
        }
    });
}
function delete_dom_by_id(ids){
    ids.forEach(id => {
        let dom = document.getElementById(id)
        dom.remove()
    });
}