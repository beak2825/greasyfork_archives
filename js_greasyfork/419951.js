// ==UserScript==
// @name         qnaHabrDark
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Темная тема для QNA Habr
// @author       DiceMasters
// @match        https://qna.habr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419951/qnaHabrDark.user.js
// @updateURL https://update.greasyfork.org/scripts/419951/qnaHabrDark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DARK_THEME_BUTTON = document.createElement('li')
          DARK_THEME_BUTTON.classList.add('main-menu__item')
          DARK_THEME_BUTTON.setAttribute('id', 'dm-dark-theme')
          DARK_THEME_BUTTON.innerHTML = '<a class="main-menu__link" href="#"><svg id="Capa_1" class="icon_svg icon_menu_notification" width="18px" height="18px" viewBox="0 0 483.48 483.48" style="enable-background:new 0 0 483.48 483.48; color: #a7b3cb;"	 xml:space="preserve"><g>	<g>		<path d="M361.08,0H122.4C54.799,0,0,54.798,0,122.4v238.68c0,67.602,54.799,122.4,122.4,122.4h238.68			c67.602,0,122.4-54.799,122.4-122.4V122.4C483.48,54.798,428.682,0,361.08,0z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>Темная тема</a>'

    if (localStorage.getItem('toster-dm-dt') && localStorage.getItem('toster-dm-dt') === 'on') {
        document.querySelector('.layout__body').classList.add('dm_dark_theme-page')
    }

    DARK_THEME_BUTTON.addEventListener('click', function(e) {
        e.preventDefault()
        let el = document.querySelector('.layout__body')
        if (el.classList.contains('dm_dark_theme-page')) {
            document.querySelector('.layout__body').classList.remove('dm_dark_theme-page')
            localStorage.setItem('toster-dm-dt', 'off')
        } else {
            document.querySelector('.layout__body').classList.add('dm_dark_theme-page')
            localStorage.setItem('toster-dm-dt', 'on')
        }
    })

    document.getElementsByClassName('main-menu')[1].append(DARK_THEME_BUTTON)

    const CSS = '.dm_dark_theme-page .page__header,.dm_dark_theme-page .page__tabs,.dm_dark_theme-page .page__filters,.dm_dark_theme-page, .dm_dark_theme-page:before, .dm_dark_theme-page .page__body{background-color:#303b44}.dm_dark_theme-page .user-summary__name{color:white}.dm_dark_theme-page .tags-list__item>a{color:white !important}.dm_dark_theme-page .question__title,.dm_dark_theme-page .question__title>*,.dm_dark_theme-page .question__body,.dm_dark_theme-page .question__body>*:not(time){color:white}.dm_dark_theme-page .section-header{border-bottom:2px solid white}.dm_dark_theme-page .section-header>.section-header__title,.dm_dark_theme-page .answer__text{color:white}.dm_dark_theme-page .column_sidebar .panel-heading_inner{background-color:#303b44}.dm_dark_theme-page .column_sidebar .panel-heading__title,.dm_dark_theme-page .column_sidebar .question__title-link,.dm_dark_theme-page .inline-list_meta-attrs .inline-list__item span{color:white}.dm_dark_theme-page .page__header-title{color:#fff;}.dm_dark_theme-page .filters-menu{background-color:#303b44}.dm_dark_theme-page .filters-menu .filters-menu__link:not(.filters-menu__link_active){color:white !important;}'
    let head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style')

    head.appendChild(style)

    style.type = 'text/css'
    if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = CSS
    } else {
        style.appendChild(document.createTextNode(CSS))
    }
})();