// ==UserScript==
// @name        pikabu-better
// @namespace   Violentmonkey Scripts
// @match       https://pikabu.ru/*
// @grant       none
// @version     1.0.1
// @author      Panter
// @description 17.03.2023, 03:10:05
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461984/pikabu-better.user.js
// @updateURL https://update.greasyfork.org/scripts/461984/pikabu-better.meta.js
// ==/UserScript==


function _placeCSS (css) {
  document.body.appendChild(Object.assign(document.createElement('style'), { innerHTML: css }))
}

function _docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1)
    } else {
        document.addEventListener("DOMContentLoaded", fn)
    }
}

function _getHotLink () {
  const s = 1199131200000;
  const currentDay = (new Date().setHours(0,0,0,0) - s)/24/60/60/1000
  const prevDay = currentDay - 1

  return `https://pikabu.ru/search?r=3&d=${prevDay}&D=${currentDay}`
}


function removeUnnecessary () { // not works normally, better to use ublock origin to remove elements
    const selectors = [
'div.menu_vertical.menu.sidebar-block__content_hr.sidebar-block__content:nth-of-type(6)',
'div.menu_vertical.menu.sidebar-block__content_hr.sidebar-block__content:nth-of-type(5)',
'div.sidebar-block_border.sidebar-block:nth-of-type(1) > .sidebar-block__header',
'.sidebar-footer.sidebar-block-links.sidebar-block_border.sidebar-block',
'.sidebar-achievements.sidebar-block__content',
'.profile-ban.sidebar-block__content',
'.profile-info.sidebar-block__content',
'.messengers-widget.sidebar-block_border.sidebar-block',
'.keyboard-controls.sidebar-block_border.sidebar-block',
'.community-info-block.sidebar-block_border.sidebar-block',
'.communities-list.sidebar-block_border.sidebar-block',
'.sidebar-public-ratings.sidebar-block_border.sidebar-block',
'.button_width_100.button_add.button_success.button',
'.button_width_100.button_create-community.button',
'#menu-courses',
'#menu-companies',
'#menu-communities',
'.header-right-menu__item.header-right-menu__notification',
'.hint_bottom.hint.logo',
'.hint.story__share',
'.carousel_short-stories.carousel_small.carousel',
'.footer__inner',
'.story__community-subscribe',
'.story__community',
'.story__series',
'.recommended-communities.carousel_small.carousel',
'.story__to-comments.story__comments-link',
'.header-menu__extra-wrapper'
]

  for (const selector of selectors) {
    Array.from(document.querySelectorAll(selector) || []).forEach(n => { n.style = 'display:none !important;' });
  }
}

function replaceHot() {
  const hotLink = _getHotLink()
  const hotA = document.querySelector('.header-menu__item[data-feed-key="hot"] a')
  hotA.href = hotLink

  if (window.location.href.includes(hotLink)) {
    _placeCSS`.section_gray.stories-search__filters { display: none; }`

    _docReady(rollUpFilters)
  }
}

function rollUpFilters () {
  const toggleFn = () => {
    const elem = document.querySelector('.section_gray.stories-search__filters')

      if (elem.style.display === 'none') elem.style.display = 'block'
      else elem.style.display = 'none'
  }

  const row = document.querySelector('.stories-search .input_section')

  btn = document.createElement('button')
  btn.className = "button button_success"
  btn.innerHTML = "Фильтры"
  btn.style.marginLeft = "10px"
  btn.type = 'button'
  btn.onclick = toggleFn

  toggleFn()

  row.appendChild(btn)
}

function placeRecommended () { // old hot button
  const rec = document.createElement('div')

  rec.innerHTML = '<a href="/#recommended">Рекомендации</a>'
  rec.className = 'header-menu__item'
  rec.setAttribute('data-feed-key', 'recommended')

  document.querySelector('.header-menu').appendChild(rec)
}

function redirectToHot () {
  const l = window.location.href.length
  if (l === 17 || l === 18) window.location.href = _getHotLink()
}

function addCSS () {
  _placeCSS`
  .header__inner {
    max-width: 1000px !important;
    margin: 0 auto;
  }

  .header__menu {
    justify-content: left !important;
  }

  .header-menu {
    padding-left: 0 !important;
  }

  .header_search-expanded .header__right-menu {
      flex-grow:1
  }

  .header_search-expanded .header__right-menu .header-right-menu__search {
      flex-grow: 1;
      max-width: 250px;
      min-width: 120px;
      border-radius: 2px;
      border: 1px solid var(--color-black-440);
      background-color: var(--color-bright-800)
  }

  .header_search-expanded .header__right-menu .header-right-menu__search .input__box {
      opacity: 1
  }

  .header_search-expanded .header__right-menu .header-right-menu__search button>.icon.icon--ui__search {
      fill: var(--color-black-600);
      color: var(--color-black-600)
  }

  .stories-search .input.input_section {
    height: 50px;
    overflow: hidden;
  }
  `
}

redirectToHot()
addCSS()
// removeUnnecessary()
_docReady(replaceHot)
_docReady(placeRecommended)
