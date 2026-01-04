// ==UserScript==
// @name         Advanced RoyalRoad
// @namespace    https://github.com/RedCommander735
// @version      0.1.1
// @description  Makes RoyalRoad search infinitely scrollable and adds a minimum number of chapters filter
// @author       RedCommander735
// @license      GNU GPLv3
// @match        https://www.royalroad.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=royalroad.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      www.royalroad.com
// @downloadURL https://update.greasyfork.org/scripts/492543/Advanced%20RoyalRoad.user.js
// @updateURL https://update.greasyfork.org/scripts/492543/Advanced%20RoyalRoad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.arr-checkbox {
  webkit-transition:all .3s;
  cursor:pointer;
  display:inline-block;
  font-size:14px;
  margin-bottom:15px;
  padding-left:30px;
  position:relative;
  -moz-transition:all .3s;
  -ms-transition:all .3s;
  -o-transition:all .3s;
  transition:all .3s
}
.arr-checkbox>input {
  filter:alpha(opacity=0);
  opacity:0;
  position:absolute;
  z-index:-1
}
.arr-checkbox>span {
  background:#e6e6e6;
  border:1px solid transparent;
  height:19px;
  left:0;
  position:absolute;
  top:0;
  width:19px
}
.arr-checkbox>span:after {
  content:"";
  display:none;
  position:absolute
}
.arr-checkbox:hover>input:not([disabled])~span,
.arr-checkbox>input:checked~span,
.arr-checkbox>input:focus~span {
  webkit-transition:all .3s;
  background:#d9d9d9;
  -moz-transition:all .3s;
  -ms-transition:all .3s;
  -o-transition:all .3s;
  transition:all .3s
}
.arr-checkbox>input:checked~span:after,
.mt-radio>input:checked~span:after {
  display:block
}
.arr-checkbox:hover>input:not([disabled]):checked~span,
.arr-checkbox>input:checked~span {
  webkit-transition:all .3s;
  background:#d9d9d9;
  -moz-transition:all .3s;
  -ms-transition:all .3s;
  -o-transition:all .3s;
  transition:all .3s
}
.arr-checkbox>span:after {
  border:solid #666;
  border-width:0 2px 2px 0;
  height:10px;
  left:6px;
  top:3px;
  transform:rotate(45deg);
  width:5px
}
    `)


    let min_chapters;
    let current_page;
    let infiniscroll;




    function insertAfterElement(element, toInsert) {
        element.parentNode.insertBefore(toInsert, element.nextSibling);
    }

    function isElementInViewport(el) {

        if (el.style.display == "none") {
            return false;
        }

        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function isAnyInViewport(elements) {
        let isVisible = false;
        elements.forEach((elem) => {
            if (isElementInViewport(elem)) {isVisible = true;}
        })

        return isVisible;
    }

    async function get_next_search_page(url, page_num) {
        console.log(`Advanced RoyalRoad Search: [InfiniScroll] Loading next page: ${page_num}`)

        current_page = page_num;
        const DomParser = new DOMParser();

        const next_page = await GM.xmlHttpRequest({ url: url })
                    .then(resp => resp.responseText)
                    .catch(e => console.error(e));

        const next_page_dom = DomParser.parseFromString(next_page, 'text/html')
        let search_container = next_page_dom.querySelector('.search-container')

        let fiction_list = search_container.querySelector('.fiction-list')

        let fictions = fiction_list.children


        for (let i = 0; i < fictions.length; i++) {
            let element = fictions[i];
            const chapters = parseInt(element.querySelector('div.row.stats > div:nth-child(5) > span').textContent.split(' ')[0].replaceAll(',', ''), 10);
            if (chapters < parseInt(min_chapters, 10)) {element.setAttribute("style", "display: none;");}
        };

        document.querySelector('div.col-md-8:nth-child(1)').appendChild(search_container)
        document.querySelector('.search-container:nth-last-child(2)').querySelector('div.text-center').setAttribute("style", "display: none;");
    }


    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
    }

    let theme = getCookie('rrl_style')
    if (theme == 'dark') {
        GM_addStyle(`
        .arr-checkbox span {
	        border-color: hsla(0,0%,39%,.8) !important;
        }
        `)
    }


    const urlParams = new URLSearchParams(window.location.search)
    try {
        current_page = urlParams.get('page')
    } catch {
        current_page = 1;
    }

    try {
        min_chapters = urlParams.get('minChapters')
    } catch {
        min_chapters = 0;
    }

    try {
        infiniscroll = urlParams.get('infiniscroll')
    } catch {
        infiniscroll = 'false';
    }

    const min_chapters_html = `<div class="form-group">
                                   <label>Minimum Chapter Count</label>
                                   <input type="number" step="1" class="text-center col-xs-4 col-md-3 col-lg-2" name="minChapters" id="minChapters" value="${min_chapters}" style="margin-bottom: 15px">
                               </div>`

    const scroll_html = `<div class="form-group">
                             <label class="arr-checkbox" id="infiniscroll_label">
                                 <input type="text" name="infiniscroll" id="infiniscroll_text" style="display: none;" value="${infiniscroll}" />
                                 <input id="infiniscroll" value="true" type="checkbox"> Infinite scrolling
                                 <span></span>
                             </label>
                         </div>`

    const DomParser = new DOMParser();
    const scroll_dom = DomParser.parseFromString(scroll_html, 'text/html');
    const scroll = scroll_dom.querySelector('div.form-group');
    const scroll_label = scroll.querySelector('#infiniscroll_label')
    const scroll_text = scroll.querySelector('#infiniscroll_text')
    const scroll_checkbox = scroll.querySelector('#infiniscroll')
    const rating = document.querySelector('div.form-group:nth-child(15)');

    const chapter_dom = DomParser.parseFromString(min_chapters_html, 'text/html');
    const chapter = chapter_dom.querySelector('div.form-group');
    insertAfterElement(rating, scroll);
    insertAfterElement(scroll, chapter);

    scroll_checkbox.checked = (infiniscroll == 'true');

    scroll_label.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        let toggle = scroll_checkbox.checked;
        if (toggle) {
            scroll_checkbox.checked = false
            scroll_text.value = "false"
        } else {
            scroll_checkbox.checked = true
            scroll_text.value = "true"
        }
    })

    let search_container = document.querySelector('.search-container')

    let fiction_list = search_container.querySelector('.fiction-list')

    let fictions = fiction_list.children


    for (let i = 0; i < fictions.length; i++) {
        let element = fictions[i];
        const chapters = parseInt(element.querySelector('div.row.stats > div:nth-child(5) > span').textContent.split(' ')[0].replaceAll(',', ''), 10);
        if (chapters < parseInt(min_chapters, 10)) {element.setAttribute("style", "display: none;");}
    };


    onscroll = (event) => {
        if ((isAnyInViewport(document.querySelector('.search-container:last-child').querySelectorAll('div.row.fiction-list-item:nth-last-child(-n+5)')) || isElementInViewport(document.querySelector('.search-container:last-child > .text-center'))) && (infiniscroll == 'true')) {
            if (window.location.pathname == '/fictions/search') {
                let next_nav;
                let last_nav;
                let page_navs = document.querySelectorAll('.pagination > li')

                page_navs.forEach((element) => {
                    if (element.childNodes[0].innerText.startsWith('Next')) {
                        next_nav = element.childNodes[0];
                    }
                    if (element.childNodes[0].innerText.startsWith('Last')) {
                        last_nav = element.childNodes[0];
                    }
                });


                let next_page_link;
                if (next_nav) {
                    next_page_link = next_nav.href;
                } else if (last_nav) {
                    next_page_link = last_nav.href;
                }
                if (next_page_link) {
                    let next_page_number = new URL(next_page_link).searchParams.get('page');
                    if (next_page_number != current_page) {
                        get_next_search_page(next_page_link, next_page_number);
                    }
                }
            }
        }
    };

})();


