// ==UserScript==
// @name         Pikabu Auto Expand Comments
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Automatically expands comment blocks on site Pikabu.ru, navigation in posts with A/D keys
// @author       voshong
// @match        https://pikabu.ru/story/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458882/Pikabu%20Auto%20Expand%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/458882/Pikabu%20Auto%20Expand%20Comments.meta.js
// ==/UserScript==

// Сворачивать вложенные комментарии после этого уровня, значение от 1 до 10, как на Пикабу. Или большое значение, например, 100, чтобы не сворачивать.
const commentAutoExpandLevel = 3

window.addEventListener('scroll', autoExpand)
setTimeout(autoExpand, 2000)

const commentsContainer = document.querySelector(".comments__container")
let firstLevelComment
const firstLevelCommentSelector = '.comment[data-indent="0"]'
const mouseOverEvent = new MouseEvent('mouseover', {'view': window, 'bubbles': true, 'cancelable': true})

commentsContainer.addEventListener('click', manageCollapsedClass)

function manageCollapsedClass(e){
    const collapseButton = e.target

    if(collapseButton.classList.contains('comment-toggle-children__icon')){
        collapseButton.parentElement.classList.add('user-managed')
    }
    else if(collapseButton.classList.contains('comment__collapsing-area')){
        collapseButton.parentElement.previousElementSibling.classList.add('user-managed')
    }
    else if(collapseButton.classList.contains('comment-toggle-children')){
        collapseButton.classList.add('user-managed')
    }
}

function autoExpand(){
    const commentHiddenGroupToggle = commentsContainer.querySelector(".comment-hidden-group__toggle:not([hidden])")
    const commentToggleChildrenCollapse = commentsContainer.querySelector(`.comment:not([data-indent="${commentAutoExpandLevel-1}"]) > .comment-toggle-children_collapse:not(.user-managed)`)
    const commentMore = commentsContainer.querySelector(".comment__more")

    if(commentHiddenGroupToggle && isInViewport(commentHiddenGroupToggle)){
        commentHiddenGroupToggle.click()
    }
    if(commentToggleChildrenCollapse && isInViewport(commentToggleChildrenCollapse)){
        commentToggleChildrenCollapse.click()
    }
    if(commentMore && isInViewport(commentMore)){
        commentMore.click()
    }
}

document.addEventListener('keydown', manageKey)

function manageKey(keyboardEvent){
    if(keyboardEvent.ctrlKey || keyboardEvent.altKey || keyboardEvent.shiftKey) return
    const target = keyboardEvent.target
    if(target.matches('input') || target.matches('textarea') || target.matches('[contenteditable="true"]')) return
    if(keyboardEvent.code == 'KeyE'){
        const visibleExpandButton = Array.from(document.querySelectorAll(':not(.comment__children[hidden] .comment-toggle-children_collapse).comment-toggle-children_collapse')).find(isInViewport)
        if(visibleExpandButton){
            visibleExpandButton.click()
        }
    }
    if(keyboardEvent.code == 'KeyA' || keyboardEvent.code == 'KeyD'){
        if(!firstLevelComment){
            firstLevelComment = commentsContainer.querySelector(firstLevelCommentSelector)
            scrollWithOffset(firstLevelComment)
        }else{
            if(keyboardEvent.code == 'KeyA'){
                firstLevelComment = getPrevFirstComment(firstLevelComment)
            }
            if(keyboardEvent.code == 'KeyD'){
                firstLevelComment = getNextFirstComment(firstLevelComment)
            }
        }
        if(firstLevelComment){
            const commentBody = firstLevelComment.querySelector('.comment__body')
            commentBody.dispatchEvent(mouseOverEvent)
            if(commentBody.classList.contains('comment__body_highlight_yellow')){
                commentBody.click()
            }
            tempChangeBgColor(commentBody)
        }
    }
}

function tempChangeBgColor(elem){
    const oldBgColor = elem.style.backgroundColor
    const oldTransition = elem.style.transition
    elem.style.backgroundColor = "rgba(0, 0, 0, 0.3)"
    setTimeout(() => {
        elem.style.transition = "background 1s linear"
        elem.style.backgroundColor = ''
        elem.style.transition = ''
    }, 1000)
}

function getPrevFirstComment(element){
	let sibling = element.previousElementSibling
	while(sibling){
		if(sibling.matches(firstLevelCommentSelector)){
            scrollWithOffset(sibling)
            return sibling
        }
		sibling = sibling.previousElementSibling
	}
    return element
}

function getNextFirstComment(element){
	let sibling = element.nextElementSibling
    const collapseButton = element.querySelector('.comment-toggle-children:not(.comment-toggle-children_collapse)')
    if(collapseButton){
        collapseButton.click()
        autoExpand()
    }
	while(sibling){
		if(sibling.matches(firstLevelCommentSelector)){
            scrollWithOffset(sibling)
            return sibling
        }
		sibling = sibling.nextElementSibling
	}
    return element
}

function scrollWithOffset(element){
    window.scrollTo({top: element.getBoundingClientRect().top + window.pageYOffset - 4})
}

function isInViewport(element){
    const rect = element.getBoundingClientRect()
    return(
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    )
}