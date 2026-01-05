// ==UserScript==
// @name            rZhihu
// @author          nonoroazoro
// @description     为知乎首页添加类似 Google Reader 的快捷键。
// @description:en  Adding Google-like keyboard shortcuts for Zhihu homepage.
// @homepageURL     https://github.com/nonoroazoro/firefox/tree/master/greasemonkey/rZhihu
// @namespace       https://greasyfork.org/zh-CN/scripts/30036-rzhihu
// @grant           none
// @version         1.2.1
// @run-at          document-end
// @include         https://www.zhihu.com/
// @include         https://www.zhihu.com/#*
// @downloadURL https://update.greasyfork.org/scripts/30036/rZhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/30036/rZhihu.meta.js
// ==/UserScript==

let headerHeight = 0;
let currentIndex = -1;
let inProgress = false;
let maxIndex = -1;
let currentTopic = null;
let currentTopicStrip = null;
let stories = null;
let storyContainer = null;
const ignoreList = [
    {
        nodeName: "DIV",
        className: "public-DraftEditor-content"
    },
    {
        nodeName: "INPUT"
    },
    {
        nodeName: "TEXTAREA"
    }
];

function start()
{
    initCurrentTopicStrip();
    storyContainer = document.getElementById("TopstoryContent");
    observe(storyContainer, update);
    storyContainer.addEventListener("click", _handleClick);
    document.body.addEventListener("keydown", _handleKeydown);

    const header = document.querySelector(".AppHeader");
    if (header)
    {
        headerHeight = (header.offsetHeight || 50) + 10;
    }
}

function initCurrentTopicStrip()
{
    currentTopicStrip = document.createElement("div");
    currentTopicStrip.style.position = "absolute";
    currentTopicStrip.style.right = "0";
    currentTopicStrip.style.top = "0";
    currentTopicStrip.style.bottom = "0";
    currentTopicStrip.style.width = "2px";
    currentTopicStrip.style.backgroundColor = "#6cb8ff";
}

function _handleClick(e)
{
    // highlight the clicked story.
    const index = _getIndexOfStory(_getAncestor(e.target, "TopstoryItem"));
    if (index !== -1)
    {
        _flip(index, false);
    }
}

function _handleKeydown(e)
{
    if (!stories || _isIgnored(e.target) || e.altKey || e.shiftKey || e.ctrlKey || e.metaKey)
    {
        return;
    }

    if (e.keyCode === 74)
    {
        // press "j"
        _next();
    }
    else if (e.keyCode === 75)
    {
        // press "k"
        _prev();
    }
    else if (e.keyCode === 79 || e.keyCode === 13)
    {
        // press "o/enter"
        _toggle();
    }
    else if (e.keyCode === 67)
    {
        // press "c"
        _toggleComment();
    }
    else if (e.keyCode === 85)
    {
        // press "u"
        _unlike();
    }
    else if (e.keyCode === 86)
    {
        // press "v"
        _openInNewTab();
    }
}

/**
 * check if key press should be ignored.
 */
function _isIgnored(target)
{
    let ignored = false;
    const nodeName = target.nodeName;
    const className = target.className;
    for (const item of ignoreList)
    {
        ignored = nodeName === item.nodeName;
        if (item.className)
        {
            ignored = ignored && (className.indexOf(item.className) !== -1);
        }

        if (ignored)
        {
            break;
        }
    }
    return ignored;
}

/**
 * Flip to next story.
 */
function _next()
{
    _flip(currentIndex + 1);
}

/**
 * Flip to previous story.
 */
function _prev()
{
    _flip(currentIndex - 1);
}

/**
 * Flip to story.
 *
 * @param {number} index
 * @param {boolean} [ensureVisible=true]
 */
function _flip(index, ensureVisible = true)
{
    if (!inProgress)
    {
        inProgress = true;

        let targetIndex = index;
        if (targetIndex < 0)
        {
            targetIndex = 0;
        }

        if (targetIndex > maxIndex)
        {
            targetIndex = maxIndex;
        }

        const target = stories[targetIndex];
        if (target)
        {
            currentIndex = targetIndex;
            // Show strip.
            stories[currentIndex].appendChild(currentTopicStrip);
            if (ensureVisible)
            {
                window.scrollTo({
                    left: 0,
                    top: target.offsetTop - headerHeight,
                    behavior: "smooth"
                });
            }
        }

        inProgress = false;
    }
}

/**
 * Toggle story expand/collapse.
 */
function _toggle()
{
    const expand = _query(".is-collapsed .RichContent-inner");
    if (expand)
    {
        expand.click();
    }
    else
    {
        const collapse = _query(".ContentItem-actions > button:last-child");
        if (collapse)
        {
            collapse.click();
        }
    }
}

/**
 * Toggle comment expand/collapse.
 */
function _toggleComment()
{
    const close = document.querySelector(".Modal.Modal--fullPage > button");
    if (close)
    {
        // should close the dialog when comment dialog is shown.
        close.click();
    }
    else
    {
        // otherwise expand/collapse the comment.
        const comment = _query(".ContentItem-actions > button:nth-child(2)");
        if (comment)
        {
            comment.click();

            // resume state
            _flip(currentIndex);
        }
    }
}

/**
 * Toggle story unlike.
 */
function _unlike()
{
    const undo = _query("button:first-child");
    if (undo && undo.textContent === "撤销")
    {
        undo.click();
    }
    else
    {
        const element = _query(".ContentItem-actions > .Popover > button:last-child");
        if (element)
        {
            element.click();
            Promise.resolve().then(() =>
            {
                const unlike = document.querySelector(".Menu.AnswerItem-selfMenu button:last-child");
                if (unlike && unlike.textContent === "不感兴趣")
                {
                    unlike.click();

                    // auto-next
                    _next();
                }
            });
        }
    }
}

/**
 * Open current story in a new tab.
 */
function _openInNewTab()
{
    // 1. answer;
    // 2. empty answer;
    // 3. advertisement.
    const element = _query(".ContentItem-title a, .QuestionItem-title > a, .Advert--card > a");
    if (element)
    {
        element.click();
    }
}

/**
 * Finds the specified element in current story.
 *
 * @param {string} selector
 * @returns {Element}
 */
function _query(selector)
{
    if (selector)
    {
        const story = stories[currentIndex];
        if (story)
        {
            return story.querySelector(selector);
        }
    }
    return null;
}

/**
 * Gets the ancestor of the element with specified class name.
 *
 * @param {Element} element
 * @param {string} className
 * @returns {Element}
 */
function _getAncestor(element, className)
{
    if (element && className)
    {
        let ancestor = element;
        while (ancestor)
        {
            if (ancestor.className.trim().split(/\W+/).indexOf(className) !== -1)
            {
                return ancestor;
            }
            else
            {
                ancestor = ancestor.parentNode;
            }
        }
    }
    return null;
}

/**
 * Gets the index of the story.
 *
 * @param {Element} story
 * @returns {number}
 */
function _getIndexOfStory(story)
{
    if (story && stories)
    {
        return Array.prototype.indexOf.call(stories, story);
    }
    return -1;
}

/**
 * Updates after the story list is loaded.
 */
function update(mutations)
{
    if (mutations.length > 0)
    {
        const topicContainer = storyContainer.children[0];
        if (topicContainer)
        {
            if (topicContainer.className !== currentTopic)
            {
                // Switch topic and reset index.
                currentIndex = -1;
                currentTopic = topicContainer.className;
            }

            const subContainer = topicContainer.children[0];
            if (subContainer)
            {
                // Ignore adverts.
                stories = subContainer.querySelectorAll(".Card.TopstoryItem:not(.TopstoryItem--advertCard)");
                maxIndex = stories.length - 1;
                return;
            }
        }

        // Reset.
        currentIndex = -1;
        maxIndex = -1;
        stories = [];
    }
}

function observe(element, callback)
{
    if (element && typeof callback === "function")
    {
        (new window.MutationObserver(callback)).observe(element, {
            childList: true,
            subtree: true
        });
    }
}

function debounce(callback, delay = 500)
{
    let timer = null;
    return (...args) =>
    {
        const context = this;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => callback.apply(context, args), delay);
    };
}

/**
 * Check if run-at is working correctly.
 */
function isRunAtAvailabe()
{
    let available = false;
    if (typeof GM_info === "undefined")
    {
        available = true;
    }
    else
    {
        available = GM_info.scriptHandler === "Tampermonkey";
    }
    return available;
}

if (isRunAtAvailabe())
{
    start();
}
else
{
    document.addEventListener("DOMContentLoaded", () => start());
}
