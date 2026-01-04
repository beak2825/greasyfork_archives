// ==UserScript==
// @name         dc-paginate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  dc 글을 페이지로 보기기
// @author       fienestar
// @match        https://gall.dcinside.com/board/view*
// @match        https://gall.dcinside.com/mgallery/board/view*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dcinside.com
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482946/dc-paginate.user.js
// @updateURL https://update.greasyfork.org/scripts/482946/dc-paginate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const SINGLE_PAGE = true;
    const RIGHT_IS_NEXT = true;
    const CONTROL_RIGHT_IS_NEXT = true;

    const write_div = document.getElementsByClassName('write_div')[0]

    function is_image_p(p){
        return p.getElementsByClassName('imgwrap').length
    }

    function is_space_p(p){
        return p.children.length === 0 || (p.children.length === 1 && p.children[0].tagName.toUpperCase() === 'BR')
    }

    let page_list = [[]]
    for(const child of write_div.children){
        if(is_image_p(child)){
            child.getElementsByTagName('img')[0].style.maxHeight = '90vh';
            page_list.push([child], []);
        }
        else page_list.at(-1).push(child);
    }

    const removed = [];

    page_list.forEach(page => {
        while(page.length !== 0 && is_space_p(page.at(0))) removed.push(page.shift());
        while(page.length !== 0 && is_space_p(page.at(-1))) removed.push(page.pop());
    })

    page_list = page_list.filter(page => page.length !== 0);

    let paginated = false;
    function pagenate()
    {
        if(paginated) return;
        paginated = true;

        removed.forEach(element => element.remove());

        const page_element_list = page_list.map(page => {
            const div = document.createElement('div');
            div.style.margin = '0 auto';
            div.style.width = 'fit-content';
            page.forEach(element => div.appendChild(element));
            return div;
        });
        const page_count = page_element_list.length

        const placeholder = document.createElement('p');
        const left = document.createElement('p');
        const right = document.createElement('p');

        for(const element of [placeholder, left, right])
            element.style.height = '90vh';

        placeholder.style.width = '100%';
        const p = document.createElement('p');
        const br = document.createElement('br');
        p.append(br);
        write_div.prepend(placeholder, br);

        const placeholder_rect = placeholder.getBoundingClientRect();
        const top = placeholder_rect.y - document.body.getBoundingClientRect().y

        if(SINGLE_PAGE)
            left.style.right = '27.5vw';
        else
            left.style.right = '50vw';
        right.style.left = '50vw';
        for(const page of [left, right]){
            page.style.position = 'absolute';
            page.style.top = top + 'px';
            page.style.height = '90vh';
            page.style.maxHeight = '90vh';
            page.style.width = placeholder_rect.width + 'px';
            page.style.maxWidth = '45vw';
            page.style.zIndex = '256';
            document.body.prepend(page);
        }

        function setPage(page)
        {
            location.hash = `#page-${page}`

            let a = SINGLE_PAGE ? 1 : 2;

            // RIGHT_IS_NEXT
            left.children[0]?.remove();
            left.append(page_element_list[page + (!SINGLE_PAGE) * (!RIGHT_IS_NEXT)] ?? '');
            if(!SINGLE_PAGE){
                right.children[0]?.remove();
                right.append(page_element_list[page + RIGHT_IS_NEXT] ?? '');
            }
            // console.log(page_element_list[page], page_element_list[page+1]);
        }

        let page = 0;

        function applyHash()
        {
            if(location.hash.startsWith('#page-')){
                page = +location.hash.slice('#page-'.length)
                setPage(page);
            }
        }
        applyHash();
        window.addEventListener("hashchange", applyHash);
        setPage(page);

        document.addEventListener('keydown', e => {
            let a = CONTROL_RIGHT_IS_NEXT ? 1 : -1
            if(!SINGLE_PAGE) a *= 2;
            if(e.key === 'ArrowRight') page += a;
            if(e.key === 'ArrowLeft') page -= a;

            page = Math.min(page, page_count-1);
            page = Math.max(page, 0);

            setPage(page);
        })
    }

    if(page_list.length > 4 && !paginated){
        const button = document.createElement('button')
        button.innerText = '페이지로 보기'
        button.addEventListener('click', () => {
            button.remove();
            pagenate();
        });
        write_div.prepend(button)
    }
})();