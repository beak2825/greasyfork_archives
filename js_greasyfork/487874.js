// ==UserScript==
// @name         Pikabu Auto Expand Comments
// @namespace    http://tampermonkey.net/
// @version      0.51
// @description  Automatically expands comment blocks on site Pikabu.ru, navigation in posts with A/D keys
// @author       voshong
// @match        https://pikabu.ru/story/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487874/Pikabu%20Auto%20Expand%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/487874/Pikabu%20Auto%20Expand%20Comments.meta.js
// ==/UserScript==

// Сворачивать вложенные комментарии после этого уровня, значение от 1 до 10, как на Пикабу. Или большое значение, например, 100, чтобы не сворачивать.
const commentAutoExpandLevel = 3
const myOffset = 4

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

function autoExpand(expandHidden = false){
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
        if(keyboardEvent.code == 'KeyA'){
            getPrevFirstComment()
        }
        if(keyboardEvent.code == 'KeyD'){
            getNextFirstComment()
        }
        autoExpand()
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
    const firstComments = Array.from(document.querySelectorAll(firstLevelCommentSelector))
    let firstComment
    if(firstComments.length == 0){
        return
    }
    for(let i = firstComments.length - 1; i >= 0 ; i--){
        if(firstComments[i].getBoundingClientRect().top < myOffset){
            firstComment = firstComments[i]
            break
        }
    }
    const commentBody = firstComment.querySelector('.comment__body')
    tempChangeBgColor(commentBody)
    scrollWithOffset(firstComment)
}

function getNextFirstComment(){
    // console.log('getNextFirstComment')
    const firstComments = Array.from(document.querySelectorAll(firstLevelCommentSelector))
    // console.log(firstComments)
    if(firstComments.length == 0){
        return
    }
    let nextFirstComment
    for(let i = 0; i < firstComments.length; i++){
        // console.log(firstComments[i])
        // console.log(firstComments[i].getBoundingClientRect().top)
        if (firstComments[i].getBoundingClientRect().top >= myOffset + 1){
            nextFirstComment = firstComments[i]
            break
        }
    }
    // console.log(nextFirstComment)
    if(nextFirstComment){
        const commentBody = nextFirstComment.querySelector('.comment__body')
        tempChangeBgColor(commentBody)
        scrollWithOffset(nextFirstComment)
    } else {
        const lastFistComment = firstComments[firstComments.length - 1]
        if(lastFistComment.getBoundingClientRect().top < 5){
            const collapseButton = lastFistComment.querySelector('.comment-toggle-children:not(.comment-toggle-children_collapse)')
            if(collapseButton){
                collapseButton.click()
            }
        }
    }

    // for(let i = 0; i < firstComments.length; i++){
    //     let commentToCollapse
    //     if (i == firstComments.length - 1 && firstComments[i].getBoundingClientRect().top < 5){
    //         commentToCollapse = firstComments[i]
    //     } else if(i != 0){
    //         commentToCollapse = firstComments[i - 1]
    //     }
    //     if(commentToCollapse){
    //         const collapseButton = commentToCollapse.querySelector('.comment-toggle-children:not(.comment-toggle-children_collapse)')
    //         if(collapseButton){
    //             collapseButton.click()
    //         }
    //     }
    //     if(firstComments[i].getBoundingClientRect().top >= 5){
    //         firstComment = firstComments[i]
    //         break
    //     }
    // }
    // if(firstComment){
    //     const commentBody = firstComment.querySelector('.comment__body')
    //     tempChangeBgColor(commentBody)
    //     scrollWithOffset(firstComment)
    // }
}

function scrollWithOffset(element){
    window.scrollTo({top: element.getBoundingClientRect().top + window.pageYOffset - myOffset})
}

function isInViewport(element){
    const rect = element.getBoundingClientRect()
    return(
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    )
}
