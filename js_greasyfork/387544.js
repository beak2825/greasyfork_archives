// ==UserScript==
// @name         PostNord - VAT Payment - Allow access to picture on confirmed packages
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows the user to view the package image even after confirming it - the image was available, but hidden.
// @author       sarf
// @match        https://moms.postnord.se/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387544/PostNord%20-%20VAT%20Payment%20-%20Allow%20access%20to%20picture%20on%20confirmed%20packages.user.js
// @updateURL https://update.greasyfork.org/scripts/387544/PostNord%20-%20VAT%20Payment%20-%20Allow%20access%20to%20picture%20on%20confirmed%20packages.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Note: while the match is done for the entire domain, code is only injected on confirmation page.

    const endsWith = (str, endStr) => {
        if (typeof str !== 'string' || typeof endStr !== 'string') return false
        const index = str.indexOf(endStr)
        return index == str.length - endStr.length
    }
    const untilDone = (func, time) => {
        if (!func()) {
            setTimeout(untilDone, time, func, time)
        }
    }
    const confirmationImageFix = () => {
        // Helper functions...
        const setAttr = (elem, attr) => {
            if (elem && attr) {
                if (typeof attr === "string" ) {
                    attr.split(';;').forEach(attrib => {
                        const split=attrib.indexOf(':')
                        if (split > -1) {
                            elem.setAttribute(attrib.substring(0, split).trim(), attrib.substring(split+1).trim())
                        }
                    })
                } else {
                    for (const [key, value] of Object.entries(attr)) {
                        elem.setAttribute(key, value)
                    }
                }
            }
        }
        const insertAfter = (elem, elemHook) => {
            elemHook.parentNode.insertBefore(elem, elemHook.nextSibling)
        }
        const addClick = (elem, onClick) => {
            if (elem) {
                elem.addEventListener('click', onClick);
            }
        }
        const eznode = (tag, attr, text) => {
            const elem = document.createElement(tag)
            setAttr(elem, attr)
            if(text) {
                elem.appendChild(document.createTextNode(text))
            }
            return elem
        }
        const computeStyle = (node, pseudoElement, defaultStyle) => {
            let style = window.getComputedStyle(node, pseudoElement)
            if (style && style.cssText) {
                style = style.cssText
            } else {
                style = defaultStyle
            }
            return style
        }
        // Page functions
        const showModal = elem => {
            setAttr(elem, 'class:;;aria-hidden:false')
        }
        const hideModal = elem => {
            setAttr(elem, 'class:ng-hide;;aria-hidden:true')
        }

        const fixCloseModalButton = () => {
            let modal = document.querySelector('image-modal > article');
            if (modal) {
                let closeButton = document.querySelector('image-modal article i[ng-click="$ctrl.close()"]')
                addClick(closeButton, () => hideModal(modal))
                return true
            }
            return false
        }
        const createLink = () => {
            const images = document.querySelectorAll('image-modal > article > section > img')
            const whereToPlace = document.querySelector('shipment-details')
            if (whereToPlace && images) {
                const section = document.createElement('section')
                const modal = document.querySelector('image-modal > article')
                if (modal) {
                    const buttonStyle = 'background-color: transparent;border: 0;color: #00a0d6;cursor: pointer;display: block;font-size: 13px;font-weight: 500;outline: none;padding: 0;'
                    const showPackage = eznode('button', 'type:button;;style:'+buttonStyle+';float: left;')
                    const iconStyle = computeStyle(document.querySelector('confirmation > form > header > h1'), ':before', 'background-image: url(../assets/images/icon-package-blue@3x.png); background-repeat: no-repeat; background-size: 20px 20px; height: 20px; width: 20px; display: inline-block;margin: 0 5px 0 0;position: relative;top: 6px;width: 20px;')
                    showPackage.appendChild(eznode('i', 'style:'+iconStyle+'cursor: pointer;'))
                    showPackage.appendChild(eznode('span', 'class:ng-binding', 'Show'))
                    addClick(showPackage, () => { showModal(modal); return false; })
                    section.appendChild(showPackage)
                    section.appendChild(document.createElement('br'))
                    untilDone(fixCloseModalButton, 100)
                }
                let num = 1
                const onlyOneImage = images.length === 1
                images.forEach(image => {
                    const text = 'Link to package image' + (onlyOneImage ? '' : '# ' + num++)
                    console.log(text)
                    const link = eznode('a', 'href:'+image.getAttribute('src')+';;style: color: #00a0d6;display: block;font-weight: 700;', text)
                    section.appendChild(link)
                    section.appendChild(document.createElement('br'))
                })
                insertAfter(section, whereToPlace)
                return true
            }
            return false
        }
        untilDone(createLink, 200)
    }

    //If we are not on confirmation screen, don't do anything.
    const onlyOnConfirmationPage = () => {
        const onConfirmation = endsWith(document.location.href, '/confirmation')
        if(onConfirmation) {
            confirmationImageFix()
            return true
        }
        return false
    }

    untilDone(onlyOnConfirmationPage, 200)




})();