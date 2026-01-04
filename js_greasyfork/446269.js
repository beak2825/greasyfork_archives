/* 
	Youtube sticky Show Less button: Makes SHOW LESS button to be "sticky" 
	to the video description section, so you can easily fold a long description 
	without scrolling it all the way to its bottom.
	Copyright (C) 2025  T1mL3arn

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	You should have received a copy of the GNU General Public License
	along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

// ==UserScript==
// @name        Youtube sticky Show Less button
// @description Makes SHOW LESS button to be "sticky" to the video description section, so you can easily fold a long description without scrolling it all the way to its bottom.
// @description:RU Делает кнопку СВЕРНУТЬ в описании видео "липкой". Чтобы свернуть длинное описание теперь не нужно прокручивать это описание в самый низ.
// @namespace   https://github.com/t1ml3arn-userscript-js
// @version     2.0.0
// @match				https://www.youtube.com/*
// @match       https://youtube.com/*
// @noframes
// @grant       none
// @author      T1mL3arn
// @homepageURL	https://github.com/t1ml3arn-userscript-js/Youtube-sticky-SHOW-LESS-button
// @supportURL	https://github.com/t1ml3arn-userscript-js/Youtube-sticky-SHOW-LESS-button/issues
// @license			GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/446269/Youtube%20sticky%20Show%20Less%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/446269/Youtube%20sticky%20Show%20Less%20button.meta.js
// ==/UserScript==


const SHOWLESS_BTN_WRAP_CLS = 'sticky-show-less-btn-wrap';
const STICKY_STYLE_ELT_ID = 'sticky-states-css'

const STICKY_STYLESHEET_CONTENT = `

.${SHOWLESS_BTN_WRAP_CLS} {
	text-align: right;
	position: fixed;
  top: 50%;
	pointer-events: none;
	z-index: 999;
}

tp-yt-paper-button#collapse {
	pointer-events: initial;
	padding: 6px 16px;
	background: darkseagreen;
	color: white;
	margin-top: 0 !important;
}
`;

let SETTINGS = {
	videoDescriptionSelector: 'ytd-video-secondary-info-renderer',
	videoTitleSelector: 'div#info.ytd-watch-flexy',
	showLessBtnSelector: 'ytd-expander.ytd-video-secondary-info-renderer tp-yt-paper-button#less.ytd-expander',
}

function addCss(css, id) {
	const style = document.head.appendChild(document.createElement('style'))
	style.textContent = css;
	style.id = id;
}

function getVisibleElt(selector) {
	return Array.from(document.querySelectorAll(selector)).find(e => e.offsetParent != null)
}

function fixScroll() {
	
	if (areCommentsVisible())
		preserveCommentsOnScreen()
	else if (isDescriptionTopEdgeOutView())
		scrollDescriptionIntoView();
	else {
		// console.debug('do nothing with scroll')
	}
}

function areCommentsVisible() {
	const vpHeight = window.visualViewport.height
	const commentsTop = getVisibleElt('ytd-comments').getBoundingClientRect().top

	return commentsTop < vpHeight;
}

function preserveCommentsOnScreen() {
	const descriptionElt = document.querySelector(SETTINGS.videoDescriptionSelector)
	// scrollOffset must not be negative!
	const scrollOffset = Math.abs(descriptionElt.getBoundingClientRect().height - descriptionHeight)
	let { scrollX, scrollY } = window;
	
	// console.debug('preserve comments:', scrollY, scrollOffset, scrollY - scrollOffset)

	scrollY = scrollY - scrollOffset;
	window.scrollTo(scrollX, scrollY)
}

function isDescriptionTopEdgeOutView() {
	const descriptionElt = document.querySelector(SETTINGS.videoTitleSelector);

	return descriptionElt.getBoundingClientRect().top < 0
}

function scrollDescriptionIntoView() {
	// console.debug('scroll description into view')
	document.querySelector(SETTINGS.videoTitleSelector).scrollIntoView({ behavior: 'smooth' })
}

let descriptionHeight;

function saveDescriptionHeight() {
	// saving initial description elt height (it is needed to fix scroll position)
	const descriptionElt = document.querySelector(SETTINGS.videoDescriptionSelector)
	descriptionHeight = descriptionElt.getBoundingClientRect().height;

	// at saveDescriptionHeight() call height might be not actual,
	// and delaying the reading helps
	setTimeout(() => {
		const h = document.querySelector(SETTINGS.videoDescriptionSelector).getBoundingClientRect().height
		// console.log(`description HEIGHT is (${h})`)
		descriptionHeight = h
	}, 0);
}

function enchance2025() {
  // The main idea:
  // query parents til #description
  // move the button into it
  // emulate sticky behavior with 'position: fixed' and js

  // TODO query only visible elements ?
	let expanders = document.querySelectorAll(SETTINGS.showLessBtnSelector)
	// console.log('EXPANDERS COUNT:', expanders.length)

	for (const showLessBtn of expanders ) {

		// console.log('original button', showLessBtn)

		const descriptionElt = showLessBtn.parentElement.parentElement
		// console.log('description', descriptionElt)

		// don't touch the wrong button
		// (mb the wrong button will be used later in different way)
		if (!descriptionElt.matches('#description-inner'))
			continue
		
		const btnWrap = document.createElement('div')
		btnWrap.appendChild(showLessBtn)
		// I use wrap to intercept clicks in CAPTURE phase
		// to calcalute scroll offset BEFORE youtube hides the description
		btnWrap.addEventListener('click', fixScroll, true)
		
		const stickyWrap = document.createElement('div');
		stickyWrap.classList.add(SHOWLESS_BTN_WRAP_CLS)
		stickyWrap.appendChild(btnWrap);
		
		// add sticky wrapper (with showless button) to video description element
		descriptionElt.appendChild(stickyWrap)
		
		emulateSticky(stickyWrap, descriptionElt)

    descriptionElt.parentElement.addEventListener('click', () => {
			// console.log('click correctioon');
			correctPlacement(stickyWrap, descriptionElt)
		})
	}
}

/**
 * Didn't figure it out how to make elt sticky on a new youtube design.
 * ~Fuck this stupid css.~
 * Let's emulate it with JS
 */
function emulateSticky(sticky, container) {
  const crect = container.getBoundingClientRect()
	sticky.style.left = `${crect.right}px`
  sticky.style.transform = `translate(-100%, 0px)`
	correctPlacement(sticky, container)

	window.addEventListener('scroll', e => {
		correctPlacement(sticky, container)
	}, { passive: true })

	window.addEventListener('scrollend', e => {
		correctPlacement(sticky, container)
    // console.log('scrollend');
	}, { passive: true })

  window.addEventListener('resize', e => {
    
    requestAnimationFrame(() => {
      sticky.style.left = `${container.getBoundingClientRect().right}px`
      correctPlacement(sticky, container)
      // console.log('resize');
    })
  })
}

function correctPlacement(sticky, container) {

	const centerY = window.visualViewport.height*0.5
	const offsetBottom = 60

	let crect = container.getBoundingClientRect()

	if (crect.top > centerY) {
    sticky.style.top = `${crect.top}px`
    requestAnimationFrame(() => {
      // container's top value is the actual limit,
      // (sticky must be BELOW that line)
      // so just query the actual top value
      // inside requestAnimationFrame(),
      // that way I finally donot see layout tearing
      let crect = container.getBoundingClientRect()
      sticky.style.top = `${crect.top}px`
      // console.log(crect.top, crect.bottom, centerY, crect.top > centerY, crect.bottom-offsetBottom < centerY)
      // console.log('correct top')
    })
		// console.log('top overscroll', dy);
	} else if ((crect.bottom - offsetBottom) < centerY) {
    sticky.style.top = `${crect.bottom - offsetBottom}px`
    requestAnimationFrame(() => {
      // container's bottom(- offset) value is the actual limit,
      // (sticky must be ABOVE that line)
      // so just query the actual top value
      // inside requestAnimationFrame(),
      // that way I finally donot see layout tearing
      let crect = container.getBoundingClientRect()
      let newTop = `${crect.bottom - offsetBottom}px`
      sticky.style.top = newTop
      // console.log(crect.top, crect.bottom, centerY, crect.top > centerY, crect.bottom-offsetBottom < centerY)
      // console.log('correct bottom')
    })
		// console.log('bottom overscroll', dy);
	} else {
    // removing inline style activates 50% for top from CSS rule
    sticky.style.top = ''
    // console.log('clear top')
    // requestAnimationFrame(() => sticky.style.top = '')
  }
}

/** For debug purpose */
function drawVerticalCenterLine() {
  let a = document.createElement('div')
  a.style.boxSizing = 'border-box'
  a.style.width = '100%'
  a.style.height = '3px'
  a.style.background = 'red'
  a.style.position = 'fixed'
  a.style.top = '50%'
  a.style.left = 0
  a.id = 'sticky-grid'
  document.body.appendChild(a)
}

function init() {

	// Looks like 'yt-page-data-updated' is the event I need to listen
	// to know exactly when youtube markup is ready to be queried.
	document.addEventListener('yt-page-data-updated', _ => {
		// console.log('YT EVENT yt-page-data-updated');
		
		// Script should work only for pages with a video,
		// such pages have url like https://www.youtube.com/watch?v=25YbRHAc_h4
		if (window.location.search.includes('v=')) {

			// settings for the actual design
			SETTINGS = {
				videoDescriptionSelector: '#above-the-fold.ytd-watch-metadata',
				videoTitleSelector: '#above-the-fold.ytd-watch-metadata',
				showLessBtnSelector: '#collapse.button.ytd-text-inline-expander',
				css: STICKY_STYLESHEET_CONTENT,
			}

			addCss(SETTINGS.css, STICKY_STYLE_ELT_ID)

			// Wait a little to get ALL the buttons initialized
			// (better use MutationObserver ?)
			setTimeout(() => {
				try {
					saveDescriptionHeight();
					enchance2025()
				} catch(e) { 
					console.log('Something went wrong, probably page layot has changed')
					console.error(e)
				}

        // drawVerticalCenterLine()
      }, 125);
		}
	})
}

init()