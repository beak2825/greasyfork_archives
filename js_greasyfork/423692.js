// ==UserScript==
// @name         Mouseless Link Opener
// @description  Open links and click buttons easily using only the keyboard!
// @version      0.4.0
// @author       sllypper
// @homepage     https://greasyfork.org/en/users/55535-sllypper
// @namespace    sllypper
// @match        *://*/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/423692/Mouseless%20Link%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/423692/Mouseless%20Link%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // for American keyboard layout, switch it to "`" instead
    // so you can use it with one hand
    // or whatever other key you want
    const HOTKEY = "'"

    const also_other_elements = true

    // Label Colors
    const textColor = "#fff"
    const backgroundColor = "#555"

    //

    let elBag = [];
    let isSet = false;
    let visibleLinks = [];
    //let page;

    function setListeners() {
        document.addEventListener("keydown", event => {
            if (!isSet) {
                if (event.key === HOTKEY && event.ctrlKey) {
                    event.preventDefault()
                    getElements()
                    filterElements()
                    pickTooltips()
                    placeTooltips()
                    isSet = true
                }
            } else {
                if (event.key >= 0 && event.key < 10) {
                    event.preventDefault()
                    if (chooseTooltip(parseInt(event.key), event.ctrlKey)) {
                        clearTooltips()
                        isSet = false
                    }
                } else if (event.key === "Tab") {
                    event.preventDefault()
                    shiftTooltips()
                } else if (event.ctrlKey) {
                    event.preventDefault()
                } else {
                    clearTooltips()
                    isSet = false
                }
            }
        })
    }

    function chooseTooltip(num, ctrl) {
        if (num > visibleLinks.length || (num === 0 && visibleLinks.length < 10)) return false
        if (num === 0) {
            if (!ctrl) visibleLinks[9].click()
            else clickNewTab(visibleLinks[9])
            return true
        }
        // console.log(visibleLinks[num-1])
        // console.log(ctrl)
        if (!ctrl) visibleLinks[num-1].click()
        else clickNewTab(visibleLinks[num-1])
        return true
    }

    function clickNewTab(el) {
        GM_openInTab(el.href, {'insert': true, 'setParent': true})
        // GM_openInTab(el.href, {'active': true, 'insert': true, 'setParent': true})
    }

    function shiftTooltips() {
        visibleLinks = []
        clearTooltips()
        if (elBag.length > 0) {
            pickTooltips()
            placeTooltips()
        } else {
            getElements()
            filterElements()
            pickTooltips()
            placeTooltips()
        }
    }

    function clearAction() {
        // let el
        for (let el of document.querySelectorAll('.displayText_container')) { el.remove() }
        for (let el of document.querySelectorAll('.displayText')) { el.remove() }
        visibleLinks = []
        isSet = false
    }

    function clearTooltips() {
        for (let el of document.querySelectorAll('.displayText_container')) { el.remove() }
        for (let el of document.querySelectorAll('.displayText')) { el.remove() }
        visibleLinks = []
    }

    function pickTooltips() {
        // gets up to 10 tooltips from elBag into visibleLink
        visibleLinks = []
        let i,
            len = elBag.length

        for (i=0; i <= 9 && i < len; i++) {
            visibleLinks.push(elBag.shift())
        }
    }

    function placeTooltips() {
        //console.log('placing '+visibleLinks.length+' tooltips', visibleLinks, elBag)
        for (let i = 0; i <= 8 && i < visibleLinks.length; i++) {
            createTooltip(visibleLinks[i], i+1)
        }
        if (visibleLinks.length === 10) {
            createTooltip(visibleLinks[9], 0)
        }
    }

    function getElements() {
        if (also_other_elements) {
            elBag = Array.from(document.querySelectorAll('div,a,button'))
            return
        }

        elBag = Array.from(document.querySelectorAll('a,button'))
    }

    function filterElements() {
        elBag = elBag.filter(
            (el) => isInViewport(el) && !(el.offsetWidth === 0 || el.offsetHeight === 0) && !(el.nodeName === "A" && el.getAttribute('href') == null)
        )

        if (also_other_elements) elBag = elBag.filter((el) => el.tagName == "A" || el.tagName == "BUTTON" || window.getComputedStyle(el).cursor == "pointer" || el.type == "checkbox" || el.type == "radio")

        elBag = elBag.filter(isVisible)
    }

    function createTooltip(el, num) {
        let oldDisplay = el.style.display
        el.style.display = "inline-block"
        const rect = getCoords(el);
        el.style.display = oldDisplay

        const tooltip = document.createElement("div")
        tooltip.setAttribute("class", "displayText")
        tooltip.innerText = num

        tooltip.style.left = rect.right + 'px'
        tooltip.style.top = rect.top + 'px'

        document.body.appendChild(tooltip)

        return tooltip
    }

    function addCustomCSS() {
        let customStyles = document.createElement("style");
        customStyles.setAttribute("type", "text/css");

        let styles = ".displayText { position: absolute; top: 0; right: -16px; margin: 0; overflow: visible !important; width: min-content; background-color: " + backgroundColor + "; color: " + textColor + "; text-align: center; border-radius: 2px; padding: 0px 2px; line-height: 20px; font-size: 14px; z-index: 9999; }"

        customStyles.innerHTML = styles;

        document.getElementsByTagName("head")[0].appendChild(customStyles);
    }

    /*!
     * Determine if an element is in the viewport
     * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
     * @param  {Node}    elem The element
     * @return {Boolean}      Returns true if element is in the viewport
     */
    var isInViewport = function (elem) {
        var distance = elem.getBoundingClientRect();
        return (
            distance.top >= 0 &&
            distance.left >= 0 &&
            distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            distance.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    var isVisible = function (elem) {
        const elemCenter = {
            x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
            y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
        };
        let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
        do {
            if (pointContainer === elem) return true;
        } while (pointContainer = pointContainer.parentNode);
        return false;
    }

    function getCoords(elem) {
        let box = elem.getBoundingClientRect();

        return {
            top: box.top + window.pageYOffset,
            right: box.right + window.pageXOffset,
            bottom: box.bottom + window.pageYOffset,
            left: box.left + window.pageXOffset
        };
    }

    addCustomCSS()
    setListeners()

})();