// ==UserScript==
// @name         Better Player Info 2
// @namespace    http://tampermonkey.net/
// @version      2.05
// @description  The best info Script!
// @author       Dikinx(Diamondkingx)
// @match        https://zombs.io/*
// @match        http://zombs.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vscode.dev
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433138/Better%20Player%20Info%202.user.js
// @updateURL https://update.greasyfork.org/scripts/433138/Better%20Player%20Info%202.meta.js
// ==/UserScript==

'use strict'

// Helper Functions----->

const log = console.log

function element(selector) {
    return document.querySelector(selector)
}

// Simplifies creation of new elements
function createElement(type, attributes = {}, properties = {}, creationOptions = {}) {
    const element = document.createElement(type, creationOptions)

    // Add all the attributes
    for (let attribute in attributes)
        element.setAttribute(attribute, attributes[attribute])

    // Add all the js properties
    for (let [property, value] of Object.entries(properties))
        element[property] = value

    element.appendTo = function (parent) {
        let parentElement

        if (typeof parent == "string")
            parentElement = element(parent)
        else if (parent instanceof HTMLElement)
            parentElement = parent
        else throw new TypeError("Unknown parent type.")

        if (!parentElement) throw new ReferenceError("Undefined Parent.")

        parentElement.append(this)
        return this
    }

    return element
}

// Elements created for the script to use
function defineScriptElement(name, type, attributes = {}, properties = {}, creationOptions = {}) {
    // Create the element and define it in the scriptElements object
    return main.scriptElements[name] = createElement(type, attributes, { name, ...properties }, creationOptions)
}

// A function that only fires once after a transition ends on an element
HTMLElement.prototype.onceontransitionend = function (callback) {
    if (typeof callback !== "function") throw new TypeError("'callback' must be a function.")

    const transitionEndHandler = () => {
        callback.bind(this)()
        this.removeEventListener("transitionend", transitionEndHandler)
    }

    this.addEventListener("transitionend", transitionEndHandler)
}

Math.lerp = function (a, b, c) {
    return a + (b - a) * c
}

Math.lerpAngles = function (a1, a2, c, returnUnitVec = false) {
    let x2 = Math.lerp(Math.cos(a1), Math.cos(a2), c),
        y2 = Math.lerp(Math.sin(a1), Math.sin(a2), c),
        mag

    if (returnUnitVec) {
        mag = Math.sqrt(x2 ** 2 + y2 ** 2)
        return { x: x2 / mag, y: y2 / mag, angle: Math.atan2(x2, y2) }
    }

    return Math.atan2(y2, x2)
}

// function toIndianNumberSystem(string = '0') {
//     if (string.length <= 3) return string;

//     const firstPartLength = (string.length - 3) % 2 === 0 ? 2 : 1
//     const firstPart = string.slice(0, firstPartLength)
//     const rest = string.slice(firstPartLength, -3)
//     const lastThree = string.slice(-3)

//     const formattedRest = rest.match(/.{2}/g)?.join(',') || ''

//     return firstPart + (formattedRest ? ',' + formattedRest : '') + ',' + lastThree
// }


function toInternationalNumberSystem(number = '0') {
    if (typeof number == "string") return number
    if (number.length <= 3) return number
    let rest = number.slice(0, number.length % 3)
    let groups = number.slice(rest.length).match(/.{3}/g) || []
    return (rest ? rest + ',' : '') + groups.join(',')
}

function toLargeUnits(number = 0) {
    if (typeof number == "string") return number
    if (number < 1_000) return number.toString()

    const units = ['k', 'mil', 'bil', 'tri']
    const unitIndex = Math.floor(Math.log10(number) / 3)

    if (unitIndex >= units.length) return number.toLocaleString()

    const scaledNumber = number / Math.pow(10, unitIndex * 3)

    return `${scaledNumber.toFixed(2) / 1}${units[unitIndex - 1]}`
}


// Main css----->

const css = `
    :root {
        --background-dark: rgb(0 0 0 / .6);
        --background-light: rgb(0 0 0 / .4);
        --background-verylight: rgb(0 0 0 / .2);
        --background-purple: rgb(132 115 212 / .9);
        --background-yellow: rgb(214 171 53 / .9);
        --background-green: rgb(118 189 47 / .9);
        --background-healthgreen: rgb(100 161 10);
        --background-orange: rgb(214 120 32 / .9);
        --background-red: rgb(203 87 91 / .9);
        --text-light: rgb(255 255 255 / .6);
        --text-verylight: #eee;
    }

    #mainMenuWrapper {
        display: grid;
        grid-template-rows: repeat(2, auto);
        grid-template-columns: repeat(3, auto);
        width: max-content;
        height: max-content;
        position: absolute;
        padding: .625rem;
        scale: 0;
        opacity: 0;
        inset: 0;
        z-index: 11;
        border-radius: .25rem;
        pointer-events: none;
        transition: opacity .35s ease-in-out, scale .55s ease-in-out;
    }

    #mainMenuWrapper.open {
        scale: 1;
        opacity: 1;
    }

    #mainMenuWrapper.moveTransition {
        transition: all .35s ease-in-out, opacity .35s ease-in-out, scale .55s ease-in-out;
    }

    #mainMenuWrapper.pinned {
        z-index: 16;
    }

    #mainMenuWrapper #mainMenuTagsContainer {
        display: grid;
        grid-template-columns: auto auto;
        align-items: center;
        justify-items: center;
        gap: .25rem;
        width: max-content;
        height: max-content;
        padding: inherit;
        position: relative;
        grid-area: 1 / 2;
        inset: 0;
        margin-bottom: .5rem;
        background: var(--background-verylight);
        border-radius: inherit;
        transition: all .35s ease-in-out;
    }

    #mainMenuWrapper :is(#mainMenuTagsContainer[data-tagscount="1"], #mainMenuTagsContainer:empty) {
        gap: 0;
    }

    #mainMenuWrapper #mainMenuTagsContainer:empty {
        padding: 0;
        margin-bottom: 0;
        background: transparent;
        transition-delay: 2s;
    }

    #mainMenuWrapper .tag {
        width: max-content;
        height: max-content;
        padding: 0rem 0rem;
        position: relative;
        opacity: 0;
        font-family: 'Hammersmith One', sans-serif;
        font-size: 0px;
        color: var(--text-verylight);
        background: var(--background-verylight);
        border-radius: inherit;
        transition: all .55s cubic-bezier(.65, .05, .19, 1.02), opacity .65s cubic-bezier(.65, .05, .19, 1.02);
    }

    #mainMenuWrapper .tag.neutral {
        color: color-mix(in srgb, var(--background-green) 10%, #eee);
        background: var(--background-green);
    }

    #mainMenuWrapper .tag.warning {
        color: color-mix(in srgb, var(--background-yellow) 10%, #eee);
        background: var(--background-yellow);
    }

    #mainMenuWrapper .tag.error {
        margin: 0;
        color: color-mix(in srgb, var(--background-red) 10%, #eee);
        background: var(--background-red);
    }

    #mainMenuWrapper .tag.active {
        padding: .2rem .4rem;
        opacity: 1;
        font-size: 18px;
    }

    #mainMenuWrapper #mainMenuFeatureContainer {
        display: flex;
        flex-direction: column;
        gap: .25rem;
        height: max-content;
        position: relative;
        grid-area: 2 / 1;
        margin-right: .5rem;
        border-radius: inherit;
        pointer-events: all;
    }

    #mainMenuWrapper #mainMenuFeatureContainer .featureButton {
        width: 2.25rem;
        height: 2.25rem;
        padding: .625rem;
        scale: 1;
        font-size: 17px;
        color: var(--background-light);
        background: var(--background-verylight);
        outline: none;
        border: none;
        border-radius: inherit;
        cursor: pointer;
        transition: background .45s ease-in-out, all .35s ease-in-out, scale .25s cubic-bezier(0, .16, .79, 1.66);
    }

    #mainMenuWrapper #mainMenuFeatureContainer button:hover {
        background: var(--background-light);
    }

    #mainMenuWrapper #mainMenuFeatureContainer button.light {
        scale: .922;
        font-size: 14px;
        color: var(--text-verylight);
        background: var(--background-light);
    }

    #mainMenuWrapper #otherMenuTogglesContainer {
        display: flex;
        flex-direction: column;
        align-self: flex-end;
        gap: 0rem;
        width: max-content;
        height: max-content;
        padding: 0;
        position: relative;
        grid-area: 2 / 3;
        inset: 0 0 0 -350%;
        margin-left: 0rem;
        opacity: 0;
        background: var(--background-verylight);
        border-radius: .25rem;
        pointer-events: none;
        transition: all .35s ease-out, left .4s cubic-bezier(.5, 0, .5, 0), padding .35s ease-in;
    }

     #mainMenuWrapper #otherMenuTogglesContainer.open {
        gap: .25rem;
        left: 0%;
        padding: .625rem;
        margin-left: .5rem;
        opacity: 1;
        pointer-events: all;
        transition: all .35s ease-in, left .4s cubic-bezier(.5, 1, .5, 1), padding .35s ease-out, pointer-events 1ms linear .5s;
    }

    #mainMenuWrapper #otherMenuButton {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 2rem;
        height: 2rem;
        position: relative;
        left: 100%;
        translate: -100% 0;
        z-index: 1;
        font-family: 'Hammersmith One', sans-serif;
        font-size: 15px;
        color: var(--text-light);
        background: var(--background-verylight);
        border: none;
        border-radius: .25rem;
        outline: none;
        transition: color .15s ease-in-out, width .35s ease-in-out, background .35s ease-in-out, transform .35s ease-in-out, translate .45s ease-in-out, left .45s ease-in-out;
        cursor: pointer;
    }
    
    #mainMenuWrapper .toggleButton {
        width: 0rem;
        height: 0rem;
        padding: 0;
        position: relative;
        opacity: 1;
        font-size: 0;
        color: var(--text-light);
        background: var(--background-verylight);
        border: none;
        border-radius: inherit;
        outline: none;
        transition: all .35s ease-in-out, color .15s ease-in-out;
        cursor: pointer;
    }

    #mainMenuWrapper :is(#otherMenuButton, .toggleButton):is(:hover, .dark):not(.disabled) {
        color: var(--text-verylight);
        background: var(--background-light);
    }

    #mainMenuWrapper #otherMenuButton.rotated {
        transform: rotateY(180deg);
    }

    #mainMenuWrapper #otherMenuButton.moved {
        left: 0%;
        translate: 0%;
    }

    #mainMenuWrapper .toggleButton.dark {
        color: var(--text-verylight);
        background: var(--background-light);
    }

    #mainMenuWrapper .toggleButton.disabled {
        opacity: .65;
        cursor: not-allowed;
    }

    #mainMenuWrapper #otherMenuTogglesContainer.open > .toggleButton {
        width: 2.25rem;
        height: 2.25rem;
        font-size: 15px;
    }

    #mainMenu {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 22.5rem;
        height: 14rem;
        position: relative;
        grid-area: 2 / 2;
        inset: 0;
        background: var(--background-light);
        border-radius: .25rem;
        padding: .625rem;
        pointer-events: all;
        transition: width .35s ease-in-out, height .35s ease-in-out;
    }

    #mainMenu :is(span, p)  {
        display: inline-block;
        height: max-content;
        line-height: 100%;
    }

    #mainMenu #mainMenuBody {
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: inherit;
    }

    #mainMenuBody .contentHolder {
        width: 100%;
        height: 100%;
        position: absolute;
        translate: -100% 0;
        z-index: 0;
        opacity: 0;
        border-radius: inherit;
        transition: opacity .45s cubic-bezier(.03, .02, .21, .78), translate .55s cubic-bezier(0, 1, 1, 1);
        pointer-events: none;
    }

    #mainMenuBody .contentHolder.opaque {
        opacity: 1;
        transition: opacity .45s cubic-bezier(.03, .02, .78, .21), translate .55s cubic-bezier(0, 1, 1, 1)
        pointer-events: all;
    }

    #mainMenuBody .contentHolder.moved {
        translate: 0% 0%;
        pointer-events: all;
    }

    #mainMenuBody .contentHolder.moved.opaque {
        z-index: 100;
    }

    #mainMenu #header {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    #mainMenu #entityName {
        display: block;
        margin: 0;
        color: #eee;
        font-size: 24px;
    }

    #mainMenu #entityUID {
        display: block;
        margin: 0;
        color: var(--text-light);
        font-size: 18px;
        letter-spacing: .1rem;
    }

    #mainMenu #entityHealthBarsContainer {
        display: flex;
        justify-self: end;
        align-items: center;
        justify-content: flex-end;
        gap: .25rem;
        width: 100%;
        height: 100%;
        grid-area: 1 / 2 / 3;
    }

    #mainMenu .entityHealth {
        width: 0rem;
        height: 2.125rem;
        padding: .25rem 0 .25rem 0;
        position: relative;
        opacity: 1;
        background: var(--background-verylight);
        border-radius: .25rem;
        transition: all .35s ease-in-out, opacity .35s ease-in;
    }

   #mainMenu .entityHealth::before {
        content: attr(data-name);
        display: block;
        width: max-content;
        height: max-content;
        position: absolute;
        inset: 50% .5rem;
        translate: 0% -50%;
        opacity: 0;
        font-family: 'Hammersmith One', sans-serif;
        color: var(--text-verylight);
        font-size: 12px;
        text-shadow: 0 0 1px rgb(0 0 0 / .8);
        transition: all .15s ease-in;
   }

   #mainMenu .entityHealth.visible {
        width: min(6.25rem, 100%);
        padding-inline: .25rem;
        opacity: 1;
   }

   #mainMenu .entityHealth.visible::before {
        opacity: 1;
   }

    #mainMenu .entityHealthBar {
        width: 0%;
        height: 100%;
        background: var(--background-healthgreen);
        border-radius: inherit;
        transition: width .35s ease-in-out;
    }

    #mainMenu #body {
        width: 100%;
        height: max-content;
        padding: .625rem;
        border-radius: inherit;
        background: var(--background-verylight);
    }

    #mainMenu #body.infoMenuBody {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        row-gap: .3rem;
        margin-top: 1rem;
    }

    #mainMenu .entityInfo {
        margin: 0;
        opacity: .33;
        font-family: 'Open Sans', sans-serif;
        font-size: 14px;
        color: var(--text-light);
        transition: all .35s ease-in-out;
    }

    #mainMenu .entityInfo.visible {
        opacity: 1;
    }

    #mainMenu .entityInfo strong {
        color: var(--text-verylight);
    }

    #mainMenu .entityInfo span {
        display: inline-block;
    }

    #mainMenu #body.spectateMenuBody {
        width: 100%;
        height: 400%;
        max-height: 100%;
        overflow: hidden;
        border-radius: inherit;
    }

    #mainMenu .spectateButton {
        width: 100%;
        height: 100%;
        padding-bottom: 0rem;
        border-radius: inherit;
        opacity: 0;
        transition: opacity .35s ease-in-out, height .45s ease-in-out, padding .45s ease-in-out;
    }

    #mainMenu .spectateButton button {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: .625rem;
        scale: 1;
        font-size: 2rem;
        font-family: 'Hammersmith One';
        color: var(--text-verylight);
        background: var(--background-verylight);
        border: none;
        border-radius: inherit;
        outline: none;
        overflow: hidden;
        pointer-events: inherit;
        cursor: pointer;
        transition: background .35s ease-in-out, scale .35s cubic-bezier(0, .16, .79, 1.66);
    }

    #mainMenu .spectateButton button:hover {
        background: var(--background-light);
    }

    #mainMenu .spectateButton button:active {
        scale: .95;
    }

    #mainMenu #body.spectateMenuBody .spectateButton.visible{
        opacity: 1
    }

    #mainMenu #body.spectateMenuBody[data-playercount="1"] .spectateButton.visible{
        height: 100%;
    }

    #mainMenu #body.spectateMenuBody[data-playercount="2"] .spectateButton.visible{
        height: 50%;
    }

    #mainMenu #body.spectateMenuBody[data-playercount="3"] .spectateButton.visible{
        height: 33.33%;
    }

    #mainMenu .spectateMenuBody .wrapper {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr auto auto;
        gap: .4rem 0rem;
        width: 100%;
        height: 90%;
        border-radius: inherit;
        transition: all .45s ease-in-out;
    }

    #mainMenu .spectateButton span.name {
        justify-self: flex-start;
        align-self: center;
        max-width: min(18ch, 100%);
        text-overflow: ellipsis;
        overflow: hidden;
        transition: all .35s ease-in-out;
    }

    #mainMenu .spectateButton[data-partyposition="0"] .tag.position {
        background: var(--background-purple);
        color: color-mix(in srgb, var(--background-purple) 10%, #eee);
    }

    #mainMenu .spectateButton[data-partyposition="1"] .tag.position {
        background: var(--background-yellow);
        color: color-mix(in srgb, var(--background-yellow) 10%, #eee)
    }

    #mainMenu .spectateButton[data-partyposition="2"] .tag.position {
        background: var(--background-green);
        color: color-mix(in srgb, var(--background-green) 10%, #eee)
    }

    #mainMenu .spectateButton[data-partyposition="3"] .tag.position {
        background: var(--background-orange);
        color: color-mix(in srgb, var(--background-orange) 10%, #eee)
    }

    #mainMenu :is(#body.spectateMenuBody[data-playercount="2"]) .wrapper {
        grid-template-columns: repeat(2, max-content);
        grid-template-rows: 1fr 1fr;
        gap: 0rem .2rem;
        height: 100%;
    }

    #mainMenu :is(#body.spectateMenuBody[data-playercount="2"], #body.spectateMenuBody[data-playercount="3"]) .wrapper span.name {
        justify-self: flex-start;
        grid-area: 1 / 4 / 1 / 1;
        font-size: 1.25rem;
    }

    #mainMenu :is(#body.spectateMenuBody[data-playercount="2"], #body.spectateMenuBody[data-playercount="3"]) .wrapper .tag {
        font-size: 12px;
    }

    #mainMenu #body.spectateMenuBody[data-playercount="3"] .wrapper {
        grid-template-columns: 1fr repeat(2, max-content);
        grid-template-rows: 1fr;
        gap: 0rem .2rem;
        height: 100%;
    }

    #mainMenu #body.spectateMenuBody[data-playercount="3"] .wrapper span.name{
        grid-area: 1 / 1;
    }

    #entityFollower {
        position: absolute;
        translate: -50% -50%;
        opacity: 0;
        font-size: 22px;
        transition: opacity .35s ease-in-out, font-size .35s ease-in-out;
    }

    #entityFollower.visible {
        opacity: 1;
    }

    #entityFollower i {
        display: block;
        width: max-content;
        height: max-content;
        position: absolute;
        inset: 50%;
        translate: -50% -50%;
        rotate: 45deg;
        color: var(--text-light);
        -webkit-text-stroke: .12em rgb(42 42 42 / .9);
    }
    `

// Create the element and append it on script's initialization
const style = createElement("style")
style.append(document.createTextNode(css))

//Main Constants----->

// Main controller constant, and it's functions
const main = {
    settings: {
        targetableEntityClass: ["PlayerEntity", "Prop", "Npc"],
        mouseCollisionCheckFPS: 24,
        menuUpdateFPS: 20,
        backgroundMenuUpdateFPS: 10,
        activationKey: "control",
        paused: false,
    },
    gameElements: {},
    scriptElements: {},
    cursor: {
        x: innerWidth / 2,
        y: innerHeight / 2
    },
    controls: {
        listenedKeys: ["control"],
    },
    menu: {
        mainMenuName: "infoMenu",
        navigationStack: [],
        features: {},
        pinned: false,
    },
    // This data is not in the game but on the wiki
    gameData: {
        towers: {
            SlowTrap: {
                slowAmount: [40, 45, 50, 55, 60, 65, 70, 70]
            },
            Harvester: {
                attackSpeed: [1500, 1400, 1300, 1200, 1100, 1000, 900, 800]
            },
            MeleeTower: {
                attackSpeed: [400, 333, 284, 250, 250, 250, 250, 250]
            },
            BombTower: {
                attackSpeed: [1000, 1000, 1000, 1000, 1000, 1000, 900, 900]
            },
            MagicTower: {
                attackSpeed: [800, 800, 704, 602, 500, 400, 300, 300]
            }
        },
        pets: {
            PetCARL: {
                speed: [15, 16, 17, 17.5, 17.5, 18.5, 18.5, 19],
            },
            PetMiner: {
                speed: [30, 32, 34, 35, 35, 37, 37, 38],
                resourceGain: [1, 1, 2, 2, 3, 3, 4, 4]
            },
        }
    },
    inGame: false,
}

// This proxy allows tracking of value additions or removals from the stack.
const navigationStackProxyHandler = {
    get(stack, property) {
        const value = stack[property]

        // If the accessed property is a function, wrap it to track stack modifications
        if (typeof value == "function") {
            return function (...args) {
                const returnValue = value.apply(stack, args)

                // Invoke the appropriate callback when a value is added or removed
                if (property == "push") stack.onAddCallback?.()
                else if (property == "pop") stack.onRemoveCallback?.()

                return returnValue
            }
        }
        // Otherwise, return the accessed value
        return value
    }
}
main.menu.navigationStack = new Proxy(main.menu.navigationStack, navigationStackProxyHandler)

// Define the function to set a new active menu
main.menu.setActiveMenu = function (name, onActivatedArgs = [], forceIntoNavigationStack = false) {
    if (name == this.activeMenu)
        return

    // Push it to the navigationStack to enable navigation back if necessary
    if ((name !== this.mainMenuName && name !== this.navigationStack[this.navigationStack.length - 1]) || forceIntoNavigationStack)
        this.navigationStack.push(name)

    const prevMenuObject = this.activeMenuObject,
        foundMenu = this.activeMenuObject = Menu.getActiveMenuObject(name)

    if (!foundMenu)
        throw new SyntaxError(`Cannot find Menu ${name}.\nAvailable Menus: ${Menu.getAvailableMenuNames().join(', ')}`)

    // Activate the new menu and pass any arguments for when a menu is activated
    foundMenu.activate(...onActivatedArgs)

    foundMenu.toggleButton?.setState(1, 0)
    this.activeMenu = name

    if (!prevMenuObject)
        return

    prevMenuObject.hideAllTags()
    prevMenuObject.toggleButton?.setState(0, 0)
}

// Define the function to add a new fature button
main.menu.defineFeature = function (name, icon, activationType, ...callbacks) {
    const buttonElement = createElement("button", { class: `featureButton ${activationType}` }, {
        active: false,
        innerHTML: `<i class="${icon}"></i>`,
        setState(light) {
            this.classList.toggle("light", light)
        },
    }).appendTo(main.scriptElements.mainMenuFeatureContainer)

    // Bind all calbacks to refer to the buttonElement
    callbacks = callbacks.map(callback => callback.bind(buttonElement))

    switch (activationType) {
        case "toggle": {
            buttonElement.onclick = function (event) {
                this.setState(this.active = !this.active)
                callbacks[0]?.(event)
            }
            // This is to prevent the player from attacking
            buttonElement.onmousedown = function (event) {
                event.stopImmediatePropagation()
            }
        }
            break
        case "hold": {
            buttonElement.onmousedown = function (event) {
                event.stopImmediatePropagation()
                this.setState(this.active = true)
                callbacks[0]?.(event)
            }
            addEventListener("mouseup", function (event) {
                buttonElement.setState(buttonElement.active = false)
                callbacks[1]?.(event)
            })
        }
            break
        case "click": {
            buttonElement.onmouseenter = function (event) {
                this.setState(this.active = true)
                callbacks[1]?.(event)
            }
            buttonElement.onmouseleave = function (event) {
                this.setState(this.active = false)
                callbacks[2]?.(event)
            }
            buttonElement.onclick = callbacks[0]
            // This is to prevent the player from attacking
            buttonElement.onmousedown = function (event) {
                event.stopImmediatePropagation()
            }
        }
    }

    main.menu.features[name] = {
        name,
        activationType,
        icon,
        element: buttonElement,
        callbacks,
    }
}

// Define the 'main' variable in global scope for accessibility from the console
window.bpi2 = main

// Classes----->

// Define the menu class
class Menu {
    // Store all defined menus
    static DefinedMenus = []

    static getActiveMenuObject(activeMenuName) {
        return this.DefinedMenus.find(menu => menu.name === activeMenuName)
    }

    static getAvailableMenuNames() {
        return Menu.DefinedMenus.map((menu) => {
            return menu.name
        })
    }

    static createContentHolder(template) {
        const contentHolder = createElement("div",
            {
                class: "contentHolder"
            },
            {
                innerHTML: template,
                setState(moved, opaque) {
                    this.classList.toggle("moved", moved)
                    this.classList.toggle("opaque", opaque)
                },
            }).appendTo(main.scriptElements.mainMenuBody)
        return contentHolder
    }

    constructor(name, template, hasToggleButton = true, toggleButtonIcon, toggleButtonIndex = 0, isState = false) {
        if (Menu.getAvailableMenuNames().includes(name)) throw new SyntaxError(`Duplicate Menu name, ${name}.`)
        this.name = name
        this.template = template
        this.hasToggleButton = hasToggleButton
        this.isState = isState
        this.active = false
        this.type = "empty"

        if (!isState) {
            this.activeState = "none"
            this.hasStates = false
            this.tags = []
            this.canUpdateTags = false
        }

        this.defineMainElements(template)

        if (hasToggleButton && !isState)
            this.defineToggleButton(toggleButtonIcon, toggleButtonIndex)

        Menu.DefinedMenus.push(this)
    }
    // Defines the main header, body and footer elements of a given menu
    defineMainElements(template) {
        this.contentHolder = Menu.createContentHolder(template)
        this.header = this.contentHolder.querySelector("#header")
        this.body = this.contentHolder.querySelector("#body")
        this.footer = this.contentHolder.querySelector("#footer")
    }
    // Defines the toggle button for the menu
    defineToggleButton(icon, index = 0) {
        const toggleButtonContainer = main.scriptElements.otherMenuTogglesContainer
        this.toggleButton = toggleButtonContainer.addToggleButton(this.name,
            () => {
                if (main.menu.activeMenu == this.name)
                    return
                main.menu.setActiveMenu(this.toggleButton.dataset.menuname)
                //Wait a bit so the user is ready for the change
                this.contentHolder.onceontransitionend(() => toggleButtonContainer.setState(0))
            }, icon, index)
    }

    initStates() {
        this.definedStates = []
        this.stateObject = this.stateMenu = this.stateContentHolder = null

        this.defineState = function (name, menu, callback = () => { }) {
            if (!menu.isState) throw new TypeError("A stateMenu should be a state. Define the menu with isState true.")
            this.definedStates.push({ name, menu, callback })
        }

        this.showState = function (stateObject) {
            if (stateObject) this.contentHolder.setState(0, 0)
            else return this.hideAllStates()

            this.definedStates.forEach(state => {
                if (state.menu.active = state.name == stateObject.name)
                    state.menu.contentHolder.setState(1, 1)
                else state.menu.contentHolder.setState(0, 0)
            })

            this.resizeMenuCallback?.()
            this.onStateChangeCallback?.()
        }

        this.hideAllStates = function () {
            this.definedStates.forEach(state => state.menu.contentHolder.setState(0, 0))
            this.contentHolder.setState(1, 1)

            this.resizeMenuCallback?.()
            this.onStateChangeCallback?.()
        }

        this.setState = function (value) {
            // Check if the state is already set
            if (value == this.activeState)
                return

            // Find the new state 
            const foundState = this.definedStates.find(state => state.name == value)

            // If no state is found then return back to the empty state
            if (!foundState)
                return this.hideAllStates()

            // Update the info about current state
            this.stateObject = foundState
            this.stateMenu = this.stateObject.menu
            this.stateContentHolder = this.stateMenu.contentHolder

            // Update current state name only after everything is done properly
            this.activeState = value
            // Show the state
            return this.showState(foundState)
        }

        this.hasStates = true
        return this
    }

    activate() {
        if (this.active) return
        setTimeout(() => this.canUpdateTags = true, 1200);

        // If there is an active state, display its content; otherwise, display the default content.
        // We can't rely on the showState function because states might not be initialized.
        (this.activeState != "none" ? this.stateContentHolder : this.contentHolder).setState(1, 1)

        // Iterate through defined menus to update their states
        Menu.DefinedMenus.forEach(menu => {
            // Deactivate the other menus
            if (menu.name != this.name && menu.name != this.stateMenu?.name)
                menu.deactivate()
        })

        // Execute the callback function when the menu is activated, passing any arguments from setActiveMenu
        this.onActivatedCallback?.(...arguments)
        this.resizeMenuCallback?.()
        this.active = true
    }

    deactivate() {
        (this.hasStates && this.activeState != "none" ? this.stateContentHolder : this.contentHolder).setState(0, 0)
        this.active = this.canUpdateTags = false
    }

    defineTag(name, type, callback, removalFrequency = 0) {
        const tagElement = createElement("span",
            {
                class: `tag ${type}`,
                "data-name": name.replaceAll(" ", ""),
                "data-removalfrequency": removalFrequency
            },
            {
                textContent: name
            })

        callback = callback.bind(this)

        const tagObject = {
            name,
            type,
            callback,
            removalFrequency,
            element: tagElement,
            state: "closed",
            show() {
                // return if tag is already open
                if (this.state === "open") return

                const container = main.scriptElements.mainMenuTagsContainer
                let inserted = false

                // This code arranges tags according to their likelihood of being 'shown'.
                if (container.childElementCount) {
                    for (let element of Array.from(container.children)) {
                        if (this.removalFrequency <= element.dataset.removalfrequency || !element.classList.contains("active")) {
                            element.insertAdjacentElement("beforebegin", this.element)
                            inserted = true
                            break
                        }
                    }
                }

                // 'inserted' will only be false when no tag is in the tagsContainer, hence we can just append this tag
                if (!inserted)
                    container.append(this.element)

                // Update this attribute to get the attribute from css and change the styling
                container.dataset.tagscount = parseInt(container.dataset.tagscount) + 1

                // Use requestAnimationFrame for optimal DOM update timing, and to be stop any visual glitches
                requestAnimationFrame(() => this.element.classList.add("active"))

                this.state = "open"
            },
            hide() {
                // Return if tag is closed or the element doesn't exist
                if (this.state === "closed" || this.state === "closing" || !this.element)
                    return

                const container = main.scriptElements.mainMenuTagsContainer

                // Remove the 'active' class to hide the tag
                this.element.classList.remove("active")
                // Update the tag count attribute in the container
                container.dataset.tagscount = parseInt(container.dataset.tagscount) - 1

                // Remove the element from DOM after transition ends
                this.element.onceontransitionend(() => {
                    this.element.remove()
                    this.state = "closed"
                })

                this.state = "closing"
            }
        }

        this.tags.push(tagObject)
    }

    removeTag(name) {
        // Find the tag with the specified display name
        const tag = this.tags.find(tag => tag.name == name)

        if (!tag) return

        tag.hide()

        // Filter out the tag from the tags array
        this.tags = this.tags.filter(tag => tag.name != name)
    }

    hideAllTags() {
        this.tags.forEach(tag => tag.hide())
    }

    setUpdateCallback(callback) {
        this.updateCallback = callback
    }

    setBackgroundUpdateCallback(callback) {
        this.backgroundUpdateCallback = callback
    }

    setOnActivatedCallback(callback) {
        this.onActivatedCallback = callback
    }

    setOnStateChangeCallback(callback) {
        this.onStateChangeCallback = callback
    }

    setResizeMenuCallback(callback) {
        this.resizeMenuCallback = callback
    }

    updateTags(forceUpdate) {
        // Exit early if tag updates are not allowed and no force update is requested
        if (!this.canUpdateTags && !forceUpdate) return

        // Iterate through all tags
        this.tags.forEach(tag => {
            // Execute the callback function of the tag
            if (tag.callback())
                return tag.show() // Show the tag if callback returns true

            // Hide the tag if callback returns false
            tag.hide()
        })
    }

    updateStates(forceUpdate) {
        // Exit early if there are no states defined and no force update is requested
        if (!this.hasStates && !forceUpdate) return

        // Iterate through defined states
        for (let state of this.definedStates) {
            // Execute the callback function of the state
            if (state.callback()) {
                this.setState(state.name)
                return this.stateMenu.update()
            }
        }

        // Hide all states if no state is set
        if (this.activeState != "none") {
            this.activeState = "none"
            this.hideAllStates()
        }
    }

    update() {
        this.updateTags()

        // Check if any state is updated
        if (this.updateStates())
            return

        // Execute the updateCallback function if no state is updated
        this.updateCallback?.()
    }
}

class InfoMenu extends Menu {
    static Template = `
            <section id="header">
            <h2 id="entityName" data-forattr="name">Entity</h2>
            <h3 id="entityUID" data-forattr="uid">UID: <span>9817265</span></h3>
            <div id="entityHealthBarsContainer"></div>
            </div>
            </section>
            <section id="body" class="infoMenuBody"></section>`

    constructor(name, updatedAttributes = [], hasToggleButton = true, toggleButtonIcon, isState = false) {
        super(name, InfoMenu.Template, hasToggleButton, toggleButtonIcon, 0, isState)
        this.type = "info"
        // Make sure the place or the order in which attributes are presented can be controlled
        this.updatedAttributes = updatedAttributes.sort((a, b) => { return (a.index || 0) < (b.index || 0) ? -1 : 1 })
        this.infoElements = {}
        this.healthBars = []
        this.header.healthBarsContainer = this.header.querySelector("#entityHealthBarsContainer")
        this.parseHeaderElements()
        this.parseUpdatedAttributes()
    }

    createInfoElement(name, referenceName, activationCondition = () => { return true }, value, isVisible = true, index = 0, type = "text") {
        const infoElement = createElement("p",
            {
                class: "entityInfo" + (isVisible ? " visible" : "")
            },
            {
                innerHTML: `<span>${name}:</span> <strong>${0}</strong>`,
                name,
                referenceName,
                activationCondition,
                value,
                type,
                isVisible,
                index,
                setValue(value) {
                    let toSetValue = value ?? null
                    // if (this.type == "number" && toSetValue != null) {
                    //     switch (this.displayNumberSystem) {
                    //         case 0:
                    //             toSetValue = toLargeUnits(toSetValue)
                    //             break;
                    //         case 1:
                    //             toSetValue = toInternationalNumberSystem(new String(Math.floor(toSetValue)))
                    //             break
                    //     }
                    // }
                    return this.querySelector("strong").textContent = toSetValue
                }
            }).appendTo(this.body)

        if (type == "number") {
            infoElement.displayNumberSystem = 0
            infoElement.addEventListener("mousedown", () => infoElement.displayNumberSystem = (infoElement.displayNumberSystem + 1) % 3)
        }

        this.infoElements[name] = infoElement
    }

    createHealthBar(name, currentValRef, maxValRef, activationCondition = () => { return true }, barColor = getComputedStyle(document.body).getPropertyValue("--background-healthgreen"), isVisible = true) {
        const healthBar = createElement("div",
            {
                class: `entityHealth` + (isVisible ? " visible" : ""),
                'data-name': name,
            },
            {
                innerHTML: `<div class="entityHealthBar"></div>`,
                currentValRef,
                maxValRef,
                activationCondition,
                barColor,
                isVisible
            }).appendTo(this.header.healthBarsContainer)

        this.healthBars.push(healthBar)

        healthBar.bar = healthBar.querySelector("div")
        healthBar.bar.style.background = barColor
    }

    parseHeaderElements() {
        for (let child of this.header.children)
            this.infoElements[child.dataset.forattr] = child
    }

    parseUpdatedAttributes() {
        this.updatedAttributes.forEach(attribute => {
            if (attribute.isBar === true)
                return this.createHealthBar(attribute.name, attribute.currentValRef, attribute.maxValRef, attribute.activationCondition, attribute.barColor, attribute.isVisible)
            this.createInfoElement(attribute.name, attribute.referenceName, attribute.activationCondition, attribute.value, attribute.isVisible, attribute.index, attribute.type)
        })
    }

    updateInfo(entity) {
        let element
        for (let property in this.infoElements) {
            element = this.infoElements[property]

            // Set value if the element has a setValue function and call it with the corresponding entity property
            if (element.classList.contains("entityInfo")) {
                element.classList.toggle("visible", element.activationCondition(entity))

                if (element.value)
                    element.setValue(typeof element.value == "function" ? element.value(entity) : element.value)
                else element.setValue(entity.targetTick[typeof element.referenceName == "function" ? element.referenceName() : element.referenceName])

                continue
            }


            switch (element.dataset.forattr) {
                // Set element's text content to entity's name or model if name is not available
                case "name":
                    element.textContent = entity.targetTick.name || entity.targetTick.model
                    break
                // Set the text content of the span element to the entity's UID
                case "uid":
                    element.querySelector("span").textContent = entity.targetTick.uid
                    break
            }
        }

        let percentage
        for (let healthBar of this.healthBars) {
            percentage = entity.targetTick[healthBar.currentValRef] / entity.targetTick[healthBar.maxValRef] * 100
            healthBar.classList.toggle("visible", healthBar.activationCondition(entity))
            healthBar.bar.style.width = `${percentage}%`
        }
    }

    updateCallback() {
        const activeEntity = main.menu.activeEntity

        if (activeEntity)
            this.updateInfo(activeEntity)
    }

    resizeMenuCallback() {
        // Hardcoded min size(.9) for now
        main.scriptElements.mainMenu.resize(.9 + (this.activeState != "none" && this.stateMenu.updatedAttributes ? this.stateMenu : this).updatedAttributes.length / 36)
    }
}

// Other Handler Functions----->
function checkMouseCollisionWithEntity() {
    // Check if the activation key is pressed down
    if (main.controls[main.settings.activationKey + "Down"] !== true || (main.menu.activeMenu != main.menu.mainMenuName && main.scriptElements.mainMenuWrapper.open))
        return

    let entityObj, entityWidth, entityHeight, entityTick, posScreen, distX, distY, circleRadius, dist

    // Iterate through each entity in the world
    Object.entries(game.world.entities).forEach(entity => {
        entityObj = entity[1]

        // Check if the entity belongs to a targetable class
        if (!main.settings.targetableEntityClass.includes(entityObj.entityClass))
            return

        // Get the entity's width and height
        entityWidth = entityObj.currentModel.base.sprite.width
        entityHeight = entityObj.currentModel.base.sprite.height

        // Throw an error if width or height is missing
        if (!entityWidth || !entityHeight) throw new ReferenceError("Cannot check collision without width and height.")

        entityTick = entityObj.targetTick
        posScreen = game.renderer.worldToScreen(entityTick.position.x, entityTick.position.y)
        distX = main.cursor.x - posScreen.x
        distY = main.cursor.y - posScreen.y
        circleRadius = Math.max(entityHeight, entityWidth) / 3
        dist = Math.sqrt(distX ** 2 + distY ** 2)

        // Check if the mouse is within the circle radius of the entity
        if (dist > circleRadius)
            return

        // Set the active entity's UID and update the menu state
        main.menu.activeEntityUID = entityTick.uid

        main.scriptElements.mainMenuWrapper.setState(1)
        main.scriptElements.mainMenuWrapper.moveToEntity(entityObj)
        main.scriptElements.entityFollower.followEntity(entityObj.targetTick.uid)
    })
}

function updateActiveEntity() {
    // Check if the active entity still exists in the world
    if (!game.world.entities[main.menu.activeEntityUID]) {
        // If the active entity exists, update the last active entity
        if (main.menu.activeEntity)
            main.menu.lastActiveEntity = main.menu.activeEntity
        main.menu.activeEntity = undefined
        return
    }

    // Update the active entity with the current entity data
    // Had to do this because objects are passed by reference
    const entity = game.world.entities[main.menu.activeEntityUID]
    main.menu.activeEntity = { entity, targetTick: entity.targetTick }
}

// Function responsible for initializing the main script, triggered on DOMContentLoaded event----->

function script() {
    // DOM Manipulation----->

    // Return if hud is undefined
    if (!document.querySelector(".hud"))
        return

    // Append style element to the head of the document
    document.head.append(style)

    // Append style element for font-awesome to the head of the document
    document.head.append(createElement("link", { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" }))

    // Define and append main menu wrapper element
    defineScriptElement("mainMenuWrapper", "div", { id: "mainMenuWrapper" }, {
        open: false,

        x: 0,
        y: 0,
        width: 0,
        height: 0,

        // Set the state of the main menu wrapper
        setState(open) {
            // After transitionEnds wait for a delay before updates start
            this.onceontransitionend(() => setTimeout(() => this.open = open, 150))
            this.classList.toggle("open", open)
            main.scriptElements.entityFollower.setState(open)
        },

        // Move the main menu wrapper to the specified coordinates
        moveTo(x = this.x, y = this.y, pivotX = 0, pivotY = 0, transition = false) {
            const boundingBox = {
                width: this.scrollWidth,
                height: this.scrollHeight
            }

            let xPercent, yPercent, xTranslate = 0, yTranslate = 0

            this.classList.toggle("moveTransition", transition)

            // Move the menu in relation to the pivot
            x -= boundingBox.width * pivotX
            y -= boundingBox.height * pivotY

            // Using min-max instead of ifs to add bounds for the menu
            this.x = x = Math.round(Math.max(0, Math.min(x, innerWidth)))
            this.y = y = Math.round(Math.max(0, Math.min(y, innerHeight)))

            if (x > innerWidth - boundingBox.width)
                xTranslate = xPercent = 100
            // ^ This stops a bug where the otherMenuTogglesContainer is out of the screen
            else xPercent = (x / innerWidth) * 100

            if (y > innerHeight - boundingBox.height)
                yTranslate = yPercent = 100
            else yPercent = (y / innerHeight) * 100

            this.style.left = `${xPercent}%`
            this.style.top = `${yPercent}%`
            this.style.translate = `${-xTranslate}% ${-yTranslate}%`

            this.width = boundingBox.width
            this.height = boundingBox.height
        },

        moveToEntity(entity) {
            const menu = main.scriptElements.mainMenu,
                posScreen = game.renderer.worldToScreen(entity.targetTick.position.x, entity.targetTick.position.y)

            this.moveTo(posScreen.x, posScreen.y, .5 + (1 - menu.scrollWidth / this.width) / 2, 1.22, true)
        }
    }).appendTo(element(".hud"))

    // Define and append main menu element
    defineScriptElement("mainMenu", "div", { id: "mainMenu" }, {
        resize(ratio) {
            this.style.width = `${22.5 * ratio}rem`
            this.style.height = `${14 * ratio}rem`
        }
    }).appendTo(main.scriptElements.mainMenuWrapper)

    // Define and append main menu tags container element
    defineScriptElement("mainMenuTagsContainer", "div", { id: "mainMenuTagsContainer", "data-tagscount": 0 }).appendTo(main.scriptElements.mainMenuWrapper)

    // Define and append main menu feature buttons container
    defineScriptElement("mainMenuFeatureContainer", "div", { id: "mainMenuFeatureContainer" }).appendTo(main.scriptElements.mainMenuWrapper)

    // Define the feature for pinning the menu
    main.menu.defineFeature("pin", "fa-solid fa-location-pin", "toggle", () => main.scriptElements.mainMenuWrapper.classList.toggle("pinned", main.menu.pinned = !main.menu.pinned))

    // Function to handle the movement of the menu
    function moveFeatureHandler() {
        const eleBoundingBox = main.menu.features.move.element.getBoundingClientRect(),
            wrapperBoundingBox = main.scriptElements.mainMenuWrapper.getBoundingClientRect()

        const pivotX = ((eleBoundingBox.x - wrapperBoundingBox.x) + eleBoundingBox.width / 2) / wrapperBoundingBox.width,
            pivotY = ((eleBoundingBox.y - wrapperBoundingBox.y) + eleBoundingBox.height / 2) / wrapperBoundingBox.height

        main.scriptElements.mainMenuWrapper.moveTo(main.cursor.x, main.cursor.y, pivotX, pivotY, false)
    }

    let oldWidth = innerWidth,
        oldHeight = innerHeight

    // Make the menu responsive when screen resizes
    addEventListener("resize", () => {
        const wrapper = main.scriptElements.mainMenuWrapper

        wrapper.moveTo(wrapper.x / oldWidth * innerWidth, wrapper.y / oldHeight * innerHeight, 0, 0)

        oldWidth = innerWidth
        oldHeight = innerHeight
    })

    // Define the feature for moving the menu
    main.menu.defineFeature("move", "fa-solid fa-up-down-left-right", "hold",
        () => addEventListener("mousemove", moveFeatureHandler),
        () => removeEventListener("mousemove", moveFeatureHandler)
    )

    // document.addEventListener("visibilitychange", () => {
    //     if (main.scriptElements.mainMenuWrapper.open)
    //         main.scriptElements.mainMenuWrapper.setState(0)
    // })

    main.menu.defineFeature("forceClose", "fa-solid fa-xmark", "click", () => main.scriptElements.mainMenuWrapper.setState(0))

    // Define and append main menu body element
    defineScriptElement("mainMenuBody", "section", { id: "mainMenuBody" }).appendTo(main.scriptElements.mainMenu)

    // Define and append other menu button element
    defineScriptElement("otherMenuButton", "button", { id: "otherMenuButton" }, {
        innerHTML: `<i class="fa-solid fa-caret-right"></i>`,

        // Set the state of the other menu button
        setState(moved, rotated, dark) {
            this.classList.toggle("moved", moved)
            this.classList.toggle("rotated", rotated)
            this.classList.toggle("dark", dark)
        },

        // Return to the previous menu
        return() {
            const navigationStack = main.menu.navigationStack
            navigationStack.pop()
            main.menu.setActiveMenu(navigationStack[navigationStack.length - 1] ?? main.menu.mainMenuName)
        }
    }).appendTo(main.scriptElements.mainMenu)

    // Set callback functions for when a menu is added or removed from the navigation stack
    main.menu.navigationStack.onAddCallback = function () {
        main.scriptElements.otherMenuButton.setState(1, 1, 0)
    }

    main.menu.navigationStack.onRemoveCallback = function () {
        if (!this.length)
            main.scriptElements.otherMenuButton.setState(0, 0, 0)
    }

    // Define and append other menu container element
    defineScriptElement("otherMenuTogglesContainer", "div", { id: "otherMenuTogglesContainer" }, {
        open: false,
        toggleButtons: [],

        // Set the state of the other menu container
        setState(open) {
            this.classList.toggle("open", this.open = open)
        },

        // Add a toggle button for a specific menu
        addToggleButton(forMenuName, onClickCallback, icon, index = 0) {
            const toggleButton = createElement("button",
                {
                    class: "toggleButton",
                    "data-menuname": forMenuName,
                    "data-index": index
                },
                {
                    disabled: false,
                    textContent: forMenuName[0],
                    innerHTML: `<i class="${icon}"></i>`,
                    setState(dark, disabled) {
                        this.classList.toggle("dark", dark)
                        this.classList.toggle("disabled", this.disabled = disabled)
                    },
                })

            // Add event listener to the toggle button
            toggleButton.addEventListener("mousedown", function (event) {
                event.stopImmediatePropagation()
                if (!this.disabled)
                    onClickCallback()
            })

            // Allows control over what the order of buttons will be in the container
            switch (true) {
                case index == 0: this.append(toggleButton)
                    break
                case index >= this.childElementCount: this.prepend(toggleButton)
                    break
                default: for (let child of this.children) {
                    if (index > child.dataset.index)
                        return child.insertAdjacentElement("beforebegin", this)
                }
            }

            this.toggleButtons.push(toggleButton)
            return toggleButton
        }
    }).appendTo(main.scriptElements.mainMenuWrapper)

    defineScriptElement("entityFollower", "div", { id: "entityFollower" }, {
        innerHTML: `<i class="fa-solid fa-location-arrow"></i>`,
        _x: 0,
        _y: 0,
        _rotation: 0,
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        destination: { x: innerWidth / 2, y: innerHeight / 2, direction: 0, reached: false, outOfReach: false },
        friction: .05,
        speed: .4,
        idleSpeed: .1,
        normalSpeed: .4,
        delta: 0,
        lastFrameTime: 0,
        activeEntityUID: undefined,
        activeEntity: undefined,

        setState(visible) {
            this.classList.toggle("visible", visible)
        },

        followEntity(uid) {
            this.activeEntityUID = uid
        },

        setSize(size) {
            this.style.fontSize = `${size}px`
        },

        setDestination(x, y) {
            this.destination = { x, y }
        },

        update(time) {
            this.delta = (time - this.lastFrameTime) / (1000 / 60) // :)
            this.lastFrameTime = time
            this.activeEntity = game.world.entities[this.activeEntityUID]

            const subSteps = 8,
                divDT = this.delta / subSteps;

            // If there is an activeEntity, follow it by updating the destination and set the speed to normal
            if (this.activeEntity) {
                var targetTick = this.activeEntity.targetTick,
                    posScreen = game.renderer.worldToScreen(targetTick.position.x, targetTick.position.y),
                    entityWidth = this.activeEntity.currentModel.base.sprite.width,
                    entityHeight = this.activeEntity.currentModel.base.sprite.height,
                    radius = Math.sqrt(entityWidth ** 2 + entityHeight ** 2)

                this.speed = this.normalSpeed
                this.setDestination(posScreen.x, posScreen.y)
            }

            // Otherwise idle with slower speed while moving around to random destinations from the center of the screen <- removed
            else if (this.destination.reached || this.destination.outOfReach || main.menu.activeMenu != main.menu.mainMenuName)
                this.speed = this.idleSpeed

            this.setSize(Math.min(Math.max(22, (radius ?? 0) * .122), 36))

            for (let i = 0; i < subSteps; i++) {
                // Make the arrow bigger for bigger entities

                // Calculate the distance from the destination
                let distX = this.destination.x - this.x,
                    distY = this.destination.y - this.y,
                    dist = Math.sqrt(distX ** 2 + distY ** 2)

                // Calculate the direction of the destination
                this.destination.direction = Math.atan2(distY, distX)
                // Check if destination is reached
                this.destination.reached = dist < this.arrowSize

                // Compressed way of setting acceleration to 0 when the destination is reached
                // And to have a normal acceleartion when moving to a new destination
                this.acceleration.x = this.speed * Math.cos(this.destination.direction) * (!this.destination.reached)
                this.acceleration.y = this.speed * Math.sin(this.destination.direction) * (!this.destination.reached)

                this.x += this.velocity.x * divDT
                this.y += this.velocity.y * divDT

                // Smoothly rotate towards the destination
                this.rotation = Math.lerpAngles(this.rotation, Math.atan2(this.velocity.y, this.velocity.x), .22 * divDT)

                this.velocity.x *= 1 - this.friction
                this.velocity.y *= 1 - this.friction

                this.velocity.x += this.acceleration.x
                this.velocity.y += this.acceleration.y

                // Add bounds
                this.x = Math.max(Math.min(innerWidth - this.arrowSize, this.x), this.arrowSize)
                this.y = Math.max(Math.min(innerHeight - this.arrowSize, this.y), this.arrowSize)
            }

            // Define when a destination is out of reach
            this.destination.outOfReach = this.destination.x < 0 || this.destination.x > innerWidth || this.destination.y < 0 || this.destination.y > innerHeight
        },

        updateVisiblity() {
            if (this.activeEntity) this.setState(main.scriptElements.mainMenuWrapper.open)
            else if (this.destination.outOfReach || main.menu.activeMenu != main.menu.mainMenuName) this.setState(0)
        }
    }).appendTo(element(".hud"))

    Object.defineProperties(main.scriptElements.entityFollower, {
        x: {
            set(value) {
                this._x = value
                this.style.left = `${value}px`
            },

            get() {
                return this._x
            },
        },
        y: {
            set(value) {
                this._y = value
                this.style.top = `${value}px`
            },

            get() {
                return this._y
            },
        },
        rotation: {
            set(rad) {
                this._rotation = rad
                this.style.rotate = `${rad}rad`
            },
            get() {
                return this._rotation
            },
        },
        arrowSize: {
            get() {
                return this.querySelector("i").scrollWidth
            }
        }
    })

    // Event Listeners----->

    // Listen for mouse movement events and update the cursor position accordingly
    addEventListener("mousemove", (event) => {
        main.cursor = event
    })

    // Listen for keydown events and update controls accordingly
    addEventListener("keydown", (event) => {
        const key = event.key.toLocaleLowerCase()
        if (!main.controls.listenedKeys.includes(key)) return
        main.controls[`${key}Up`] = false
        main.controls[`${key}Down`] = true
    })

    // Listen for keyup events and update controls accordingly
    addEventListener("keyup", (event) => {
        const key = event.key.toLocaleLowerCase()
        if (!main.controls.listenedKeys.includes(key)) return
        main.controls[`${key}Up`] = true
        main.controls[`${key}Down`] = false
    })

    // Listen for mousedown events and close the main menu if it's open and the click is outside of it
    addEventListener("mousedown", (event) => {
        if (main.inGame && (main.scriptElements.mainMenuWrapper.contains(event.target) || !main.scriptElements.mainMenuWrapper.open || main.menu.pinned)) {
            event.preventDefault()
            event.stopImmediatePropagation()
            return
        }
        main.scriptElements.mainMenuWrapper.setState(0)
    })

    // Listen for mousedown events on the other menu button and toggle the other menu container's state
    main.scriptElements.otherMenuButton.addEventListener("mousedown", function (event) {
        event.stopImmediatePropagation()

        // If navigation stack is not empty, execute return function, else toggle the other menu container's state
        if (main.menu.navigationStack.length) return this.return()

        main.scriptElements.otherMenuTogglesContainer.setState(!main.scriptElements.otherMenuTogglesContainer.open)

        // Toggle button state based on the other menu container's state
        if (main.scriptElements.otherMenuTogglesContainer.open) this.setState(0, 1, 1)
        else this.setState(0, 0, 0)
    })

    var lastMenuUpdateTime = 0,
        lastMouseCollisionCheckTime = 0,
        lastBackgroundMenuUpdateTime = 0;

    // Self-invoking function to update ASAP
    (function update(time) {
        requestAnimationFrame(update)

        // Check if the player is in the game world
        if (!(main.inGame = window.game != undefined && game.network?.connected != undefined && game.world?.inWorld != undefined && game.ui?.playerTick != undefined) || main.settings.paused)
            return

        // Set the active menu to the main menu if no menu is currently active
        if (!main.menu.activeMenu)
            main.menu.setActiveMenu(main.menu.mainMenuName)

        // Perform mouse collision check if enough time has elapsed
        if (time - lastMouseCollisionCheckTime >= 1000 / main.settings.mouseCollisionCheckFPS) {
            checkMouseCollisionWithEntity()
            lastMouseCollisionCheckTime = time
        }

        main.scriptElements.entityFollower.updateVisiblity()

        if (!main.scriptElements.mainMenuWrapper.open)
            return

        // Update the active entity and active menu if enough time has elapsed
        if (time - lastMenuUpdateTime >= 1000 / main.settings.menuUpdateFPS) {
            updateActiveEntity()
            main.menu.activeMenuObject?.update()
            lastMenuUpdateTime = time
        }

        // Update background elements if enough time has elapsed
        if (time - lastBackgroundMenuUpdateTime >= 1000 / main.settings.backgroundMenuUpdateFPS) {
            // Call the background update callback for all menus and toggle buttons
            [...Menu.DefinedMenus, ...main.scriptElements.otherMenuTogglesContainer.toggleButtons].forEach(element => element.backgroundUpdateCallback?.())
            lastBackgroundMenuUpdateTime = time
        }

        main.scriptElements.entityFollower.update(time)
    })(0)

    // Defining Menus----->

    // Main Menu--->

    const mainInfoMenu = new InfoMenu("infoMenu", [
        { name: "Model", referenceName: "model" },
        { name: "Wood", referenceName: "wood", type: "number" },
        { name: "Token", referenceName: "token", type: "number" },
        { name: "Stone", referenceName: "stone", type: "number" },
        {
            name: "Wave", value: (player) => {
                return player.targetTick.wave ?? "Not Found"
            },
            type: "number"
        },
        { name: "Gold", referenceName: "gold", type: "number" },
        { name: "Score", referenceName: "score", type: "number" },
        { name: "Health", referenceName: "health" },
        { name: "MaxHealth", referenceName: "maxHealth" },
        {
            name: "ShieldHealth",
            referenceName: "zombieShieldHealth",
            activationCondition: (entity) => {
                return entity.targetTick.zombieShieldMaxHealth != 0
            },
            index: 1,
            type: "number"
        },
        {
            name: "MaxShieldHealth",
            referenceName: "zombieShieldMaxHealth",
            activationCondition: (entity) => {
                return entity.targetTick.zombieShieldMaxHealth != 0
            },
            index: 2,
            type: "number"
        },
        {
            isBar: true,
            name: "HP",
            currentValRef: "health",
            maxValRef: "maxHealth",
        },
        {
            isBar: true,
            name: "SH",
            currentValRef: "zombieShieldHealth",
            maxValRef: "zombieShieldMaxHealth",
            isVisible: false,
            activationCondition: (entity) => {
                return entity.targetTick.zombieShieldMaxHealth != 0
            },
            barColor: "#3da1d9"
        },
    ], false).initStates()

    mainInfoMenu.defineState(
        "ResourceProp",
        new InfoMenu(
            `infoMenuStateResource`,
            [
                { name: "Model", referenceName: "model" },
                { name: "CollisionRadius", referenceName: "collisionRadius" },
            ],
            false,
            "",
            true
        ),
        () => {
            return (main.menu.activeEntity || main.menu.lastActiveEntity)?.targetTick.model.match(/(tree)|(stone)|(neutralcamp)/gi)
        }
    )

    mainInfoMenu.defineState(
        "TowerProp",
        new InfoMenu(
            `infoMenuStateTower`,
            [
                { name: "Model", referenceName: "model" },
                { name: "Tier", referenceName: "tier", },
                { name: "Health", referenceName: "health", type: "number" },
                { name: "MaxHealth", referenceName: "maxHealth", type: "number" },
                // A lot of error handling
                {
                    name: "Damage",
                    activationCondition: (tower) => {
                        return game.ui.buildingSchema[tower.targetTick.model]?.damageTiers != undefined
                    },
                    value: (tower) => {
                        return game.ui.buildingSchema[tower.targetTick.model]?.damageTiers?.[tower.targetTick.tier - 1] ?? "Not Found"
                    },
                    type: "number"
                },
                {
                    name: "AttackSpeed",
                    activationCondition: (tower) => {
                        return main.gameData.towers[tower.targetTick.model]?.attackSpeed != undefined
                    },
                    value: (tower) => {
                        return main.gameData.towers[tower.targetTick.model]?.attackSpeed?.[tower.targetTick.tier - 1] ?? "Not Found"
                    }
                },
                {
                    name: "Range",
                    activationCondition: (tower) => {
                        return game.ui.buildingSchema[tower.targetTick.model]?.rangeTiers != undefined
                    },
                    value: (tower) => {
                        return game.ui.buildingSchema[tower.targetTick.model]?.rangeTiers?.[tower.targetTick.tier - 1] ?? "Not Found"
                    },
                },
                {
                    name: "Gold/Sec",
                    activationCondition: (tower) => {
                        return tower.targetTick.model.match(/goldmine/gi)
                    },
                    value: (tower) => {
                        return game.ui.buildingSchema[tower.targetTick.model]?.gpsTiers?.[tower.targetTick.tier - 1] ?? "Not Found"
                    },
                    type: "number"
                },
                {
                    name: "HarvestAmount",
                    activationCondition: (tower) => {
                        return tower.targetTick.model.match(/harvester/gi)
                    },
                    value: (tower) => {
                        return game.ui.buildingSchema[tower.targetTick.model]?.harvestTiers?.[tower.targetTick.tier - 1] ?? "Not Found"
                    }
                },
                {
                    name: "HarvestCapacity",
                    activationCondition: (tower) => {
                        return tower.targetTick.model.match(/harvester/gi)
                    },
                    value: (tower) => {
                        return game.ui.buildingSchema[tower.targetTick.model]?.harvestCapacityTiers?.[tower.targetTick.tier - 1] ?? "Not Found"
                    },
                    type: "number"
                },
                {
                    name: "SlowAmount",
                    activationCondition: (tower) => {
                        return tower.targetTick.model.match(/slowtrap/gi)
                    },
                    value: (tower) => {
                        return main.gameData.towers[tower.targetTick.model]?.slowAmount?.[tower.targetTick.tier - 1] ?? "Not Found"
                    }
                },
                {
                    isBar: true,
                    name: "HP",
                    currentValRef: "health",
                    maxValRef: "maxHealth",
                },
            ],
            false,
            "",
            true
        ),
        () => {
            return Object.entries(game.ui.buildingSchema).find(building => building[0] == (main.menu.activeEntity || main.menu.lastActiveEntity)?.targetTick.model)
        }
    )


    mainInfoMenu.defineState(
        "Npc",
        new InfoMenu(
            `infoMenuStateNPC`,
            [
                { name: "Model", referenceName: "model" },
                {
                    name: "Damage",
                    activationCondition: (npc) => {
                        return npc.targetTick.damage
                    },
                    value: (npc) => {
                        return npc.targetTick.damage ?? "Not Found"
                    },
                    type: "number"
                },
                { name: "Yaw", referenceName: "yaw" },
                { name: "Health", referenceName: "health", type: "number" },
                { name: "MaxHealth", referenceName: "maxHealth", type: "number" },
                {
                    isBar: true,
                    name: "HP",
                    currentValRef: "health",
                    maxValRef: "maxHealth",
                }
            ],
            false,
            "",
            true
        ),
        () => {
            return (main.menu.activeEntity || main.menu.lastActiveEntity)?.targetTick.entityClass == "Npc"
        }
    )

    mainInfoMenu.defineState(
        "PetProp",
        new InfoMenu("infoMenuStatePet", [
            { name: "Model", referenceName: "model" },
            {
                name: "Name",
                value: (pet) => {
                    return game.ui.itemSchema[pet.targetTick.model]?.name ?? "Not Found"
                }
            },
            { name: "Experience", referenceName: "experience", type: "number" },
            { name: "Tier", referenceName: "tier" },
            {
                name: "Damage",
                activationCondition: (pet) => {
                    return game.ui.itemSchema[pet.targetTick.model]?.damageTiers != undefined
                },
                value: (pet) => {
                    return game.ui.itemSchema[pet.targetTick.model]?.damageTiers?.[pet.targetTick.tier - 1] ?? "Not Found"
                },
                type: "number"
            },
            {
                name: "MovementSpeed",
                value: (pet) => {
                    return main.gameData.pets[pet.targetTick.model]?.speed?.[pet.targetTick.tier - 1] ?? "Not Found"
                }
            },
            {
                name: "AttackSpeed",
                value: (pet) => {
                    return (1000 / game.ui.itemSchema[pet.targetTick.model]?.attackSpeedTiers?.[pet.targetTick.tier - 1]) ?? "Not Found"
                }
            },
            {
                name: "ResourceGain",
                activationCondition: (pet) => {
                    return pet.targetTick.model.match(/petminer/gi)
                },
                value: (pet) => {
                    return main.gameData.pets[pet.targetTick.model]?.resourceGain?.[pet.targetTick.tier - 1] ?? "Not Found"
                },
                isVisible: false,
            },
            { name: "Health", referenceName: "health", type: "number" },
            { name: "MaxHealth", referenceName: "maxHealth", type: "number" },
            {
                isBar: true,
                name: "HP",
                currentValRef: "health",
                maxValRef: "maxHealth",
            },
        ],
            false,
            "",
            true),
        () => {
            return (main.menu.activeEntity || main.menu.lastActiveEntity)?.targetTick.model.match(/pet/gi)
        })

    mainInfoMenu.defineTag(
        "Entity Not Found",
        "error",
        () => {
            return (main.menu.activeMenu == main.menu.mainMenuName && !main.menu.activeEntity)
        },
        1)

    // Party Spectate Menu--->
    // The most annoying menu

    const partySpectateMenu = new Menu("partySpectateMenu", `<div id="body" class="spectateMenuBody"></div>`, true, "fas fa-users", 1)

    partySpectateMenu.spectateButtons = []

    partySpectateMenu.createSpectateButton = function () {
        const spectateButton = createElement("div",
            {
                class: "spectateButton",
                "data-partyposition": "",
                "data-playeruid": ""
            },
            {
                innerHTML: `
                <button>
                <div class="wrapper">
                <span class="name">Undef</span>
                <section class="tag active uid">UID: <span></span></section>
                <section class="tag active position"></section>
                </div>
                </button>
                `
            })

        spectateButton.nameTag = spectateButton.querySelector("span.name")
        spectateButton.positionTag = spectateButton.querySelector("section.position")
        spectateButton.uidTag = spectateButton.querySelector("section.uid span")

        spectateButton.addEventListener("mousedown", function (event) {
            event.stopImmediatePropagation()
            this.onceontransitionend(() => {
                spectateInfoMenu.spectateEntityUID = parseInt(this.dataset.playeruid)
                main.menu.setActiveMenu(spectateInfoMenu.name)
            })
        })

        this.spectateButtons.push(spectateButton)
        this.body.append(spectateButton)
    }

    // I don't know how to do this in css :(
    partySpectateMenu.styleButtons = function (gap) {
        const visibleElements = Array.from(partySpectateMenu.body.children).filter(element => element.classList.contains("visible"))

        this.body.dataset.playercount = visibleElements.length

        if (visibleElements.length == 1) return

        gap = `${gap / 2}px`

        let eleCurrent
        for (let index = 0; index < visibleElements.length; index++) {
            eleCurrent = visibleElements[index]
            if (visibleElements[index - 1]) eleCurrent.style.paddingTop = gap
            if (visibleElements[index + 1]) eleCurrent.style.paddingBottom = gap
        }
    }

    partySpectateMenu.updateCallback = function () {
        if (game.ui.playerPartyMembers.length <= 1)
            main.scriptElements.otherMenuButton.return()
    }

    partySpectateMenu.backgroundUpdateCallback = function () {
        // Filter out the player and add index to each party member
        const partyMembers = game.ui.playerPartyMembers.map((member, index) => {
            if (member.playerUid == game.ui.playerTick.uid) return undefined
            return { member, index }
        }).filter(element => element)

        this.spectateButtons.forEach((button, index) => {
            button.classList.toggle("visible", false)
            button.dataset.playeruid = button.dataset.partyposition = ""

            if (!partyMembers[index]) return

            const nameTag = button.nameTag,
                { member, index: memberIndex } = partyMembers[index]

            nameTag.textContent = member.displayName

            switch (button.dataset.partyposition = memberIndex) {
                case 0: button.positionTag.textContent = "Leader"
                    break
                case 1: button.positionTag.textContent = "Co-Leader"
                    break
                case 2: case 3: button.positionTag.textContent = "Member"
                    break
            }

            button.uidTag.textContent = button.dataset.playeruid = member.playerUid
            button.classList.toggle("visible")
        })
        this.styleButtons(8)
    }

    partySpectateMenu.toggleButton.backgroundUpdateCallback = function () {
        this.setState(0, game.ui.playerPartyMembers.length <= 1)
    }

    for (let i = 0; i < 4; i++)
        partySpectateMenu.createSpectateButton()

    // Spectate Info Menu--->

    const spectateInfoMenu = new InfoMenu("spectateInfoMenu",
        [
            ...mainInfoMenu.updatedAttributes,
            {
                name: "CanSell", value: (player) => {
                    return new Boolean(game.ui.getPlayerPartyMembers()?.find(member => member.playerUid == player.targetTick.uid)?.canSell)
                },
                index: 0,
            },
        ], false)

    spectateInfoMenu.spectateEntityUID = undefined

    spectateInfoMenu.updateCallback = function () {
        this.spectateEntity = game.world.entities[this.spectateEntityUID]

        if (this.spectateEntity)
            this.updateInfo(this.spectateEntity)
    }

    spectateInfoMenu.defineTag("Spectating", "neutral", function () {
        return true
    }, 0)

    spectateInfoMenu.defineTag("Entity Not Found", "error", function () {
        return !this.spectateEntity
    }, 1)

    // Pet Spectate Menu--->

    const petSpectateMenu = new InfoMenu("PetSpectateMenu", mainInfoMenu.definedStates.find(state => state.name == "PetProp").menu.updatedAttributes, true, "fa-solid fa-paw")

    petSpectateMenu.updateCallback = function () {
        const petTick = game.ui.getPlayerPetTick()

        if (petTick)
            this.updateInfo({ targetTick: petTick })
    }

    petSpectateMenu.toggleButton.backgroundUpdateCallback = function () {
        this.setState(0, main.menu.activeEntityUID != game.ui.playerTick.uid || !game.ui.getPlayerPetTick())
    }

    petSpectateMenu.defineTag("Pet Died", "warning", () => {
        return game.ui.getPlayerPetTick()?.health <= 0
    })
}

// If the document is already loaded, call the scriptInit function immediately
if (document.readyState != "loading") script()
else document.addEventListener("DOMContentLoaded", script)
// If the document is still loading, add an event listener for the DOMContentLoaded event