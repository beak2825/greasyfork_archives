// ==UserScript==
// @name         Custom Status Bar
// @description  Lets you customize the Geoguessr status bar via a GUI
// @version      1.3.0
// @license      MIT
// @author       zorby#1431
// @namespace    https://greasyfork.org/en/users/986787-zorby
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @downloadURL https://update.greasyfork.org/scripts/465248/Custom%20Status%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/465248/Custom%20Status%20Bar.meta.js
// ==/UserScript==

function pathMatches(path) {
    return location.pathname.match(new RegExp(`^/(?:[^/]+/)?${path}$`))
}

function getIndex(element) {
    if (!element) return -1

    let i = 0
    while (element = element.previousElementSibling) {
        i++
    }

    return i
}

const OBSERVER_CONFIG = {
    characterDataOldValue: false,
    subtree: true,
    childList: true,
    characterData: false
}

const SCRIPT_PREFIX = "csb__"
const CONFIG_KEY = SCRIPT_PREFIX + "config"
const STYLE_ID = SCRIPT_PREFIX + "style"
const PERCENTAGE_INPUT_CLASS = SCRIPT_PREFIX + "percentage-input"
const COLOR_INPUT_CLASS = SCRIPT_PREFIX + "color-input"
const TEXT_INPUT_CLASS = SCRIPT_PREFIX + "text-input"
const DELETE_BUTTON_CLASS = SCRIPT_PREFIX + "delete-button"
const STANDARD_BUTTON_CLASS = SCRIPT_PREFIX + "standard-button"
const DOWN_BUTTON_CLASS = SCRIPT_PREFIX + "down-button"
const UP_BUTTON_CLASS = SCRIPT_PREFIX + "up-button"
const CUSTOMIZE_STATUS_BAR_BUTTON_ID = SCRIPT_PREFIX + "customize-status-bar-button"
const ADD_GRADIENT_NODE_BUTTON_ID = SCRIPT_PREFIX + "add-gradient-node-button"
const CUSTOMIZE_STATUS_BAR_SCREEN_ID = SCRIPT_PREFIX + "customize-status-bar-screen"
const GRADIENT_NODE_LIST_ID = SCRIPT_PREFIX + "gradient-node-list"
const TEXT_COLOR_NODE_LIST_ID = SCRIPT_PREFIX + "text-color-node-list"
const RESUME_BUTTON_ID = SCRIPT_PREFIX + "resume-button"
const BACKGROUND_COLOR_ID = SCRIPT_PREFIX + "background-color"
const TEMP_COLOR_VAR = "--" + SCRIPT_PREFIX + "temp-color"
const RESET_DEFAULTS_BUTTON_ID = SCRIPT_PREFIX + "reset-defaults-button"

const defaultNode = () => ({
    color: "#000000",
    percentage: 100
})

const DEFAULT_BACKGROUND_COLOR = "var(--ds-color-purple-80)"

const DEFAULT_GRADIENT_NODES = [
    {
        color: "#a19bd999",
        percentage: 0
    },
    {
        color: "#00000000",
        percentage: 50
    },
    {
        color: "#00000000",
        percentage: 50
    }
]

const DEFAULT_TEXT_COLORS = [
    "var(--ds-color-purple-20)",
    "var(--ds-color-white)"
]

const configString = localStorage.getItem(CONFIG_KEY)
let gradientNodes = DEFAULT_GRADIENT_NODES
let textColors = DEFAULT_TEXT_COLORS
let backgroundColor = DEFAULT_BACKGROUND_COLOR

if (configString) {
    const config = JSON.parse(configString)

    gradientNodes = config.gradient
    textColors = config.textColors
    backgroundColor = config.backgroundColor
}

const CUSTOMIZE_STATUS_BAR_BUTTON = `
  <button id="${CUSTOMIZE_STATUS_BAR_BUTTON_ID}" class="button_button__aR6_e button_variantSecondary__hvM_F">
    Customize status bar
  </button>
  <div class="game-menu_divider__IhA4t"></div>
`

const COLOR_WIDGET = `
  <input type="color" class="${COLOR_INPUT_CLASS}" ></input>
  <input type="text" class="${TEXT_INPUT_CLASS}" style="width: 5.5rem;" required></input>
`

const GRADIENT_NODE = `
  <div style="
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  ">
    <div class="grid-element">
      <input type="number" class="${PERCENTAGE_INPUT_CLASS}" min="0" max="100" step="any" required></input>
      <div style="font-weight: 700;">%</div>
    </div>
    <div class="grid-element" style="flex-direction: row-reverse">
      <button class="${DELETE_BUTTON_CLASS}">X</button>
      <button class="${STANDARD_BUTTON_CLASS} ${DOWN_BUTTON_CLASS}">↓</button>
      <button class="${STANDARD_BUTTON_CLASS} ${UP_BUTTON_CLASS}" style="margin-left: 1rem;">↑</button>
      ${COLOR_WIDGET}
    </div>
  </div>
`

const colorNode = (label, id) => `
  <div id="${id}" style="
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  ">
    <div class="grid-element">
      <div style="font-weight: 700;">${label}</div>
    </div>
    <div class="grid-element" style="flex-direction: row-reverse">
      ${COLOR_WIDGET}
    </div>
  </div>
`

// Transforms an arbitrary css color value (like "rgb(0, 0, 0)" or "var(--some-color)") into a hex color
// (pretty hacky)
const evaluateColor = (color) => {
    const statusBar = document.querySelector(".game_status___YFni")
    statusBar.style.setProperty(TEMP_COLOR_VAR, color)
    const hexColor = window.getComputedStyle(statusBar).getPropertyValue(TEMP_COLOR_VAR)

    // Verify that it's indeed a hex color
    if (!hexColor.startsWith("#")) {
        console.log("could not evaluate color!")
        return "#000000"
    }

    // Strip the alpha channel
    if (hexColor.length > 7) {
        return hexColor.substr(0, 7)
    }

    // Expand the color, if it's in compressed form
    if (hexColor.length == 4) {
        return "#" + hexColor.substr(1).split("").map(char => char + char).join("")
    }

    return hexColor
}

const appendTextColorNode = (parent, label, index) => {
    parent.insertAdjacentHTML("beforeend", colorNode(label, ""))
    const textColorNode = parent.lastElementChild

    const colorInput = textColorNode.querySelector(`.${COLOR_INPUT_CLASS}`)
    const colorTextInput = textColorNode.querySelector(`.${TEXT_INPUT_CLASS}`)

    console.log(evaluateColor(textColors[index]))
    colorInput.value = evaluateColor(textColors[index])
    colorTextInput.value = textColors[index]

    colorInput.oninput = () => {
        textColors[index] = colorInput.value
        colorTextInput.value = textColors[index]
        updateStatusBarStyles()
    }

    colorTextInput.oninput = () => {
        textColors[index] = colorTextInput.value
        colorInput.value = evaluateColor(textColors[index])
        updateStatusBarStyles()
    }
}

const generateGradientString = () => {
    return `linear-gradient(180deg, ${
        gradientNodes.map((node) => `${node.color} ${node.percentage}%`).join(",")
    })`
}

const updateStatusBarStyles = () => {
    const style = document.getElementById(STYLE_ID)

    style.innerHTML = `
      .slanted-wrapper_variantPurple__AujW3 {
        --variant-background-color: ${generateGradientString()}, ${backgroundColor};
      }

      .slanted-wrapper_variantPurple__AujW3 .status_label__mZ7Ok {
        color: ${textColors[0]}
      }

      .slanted-wrapper_variantPurple__AujW3 .status_value__w_Nh0 {
        color: ${textColors[1]}
      }
    `

    localStorage.setItem(CONFIG_KEY, JSON.stringify({
        "gradient": gradientNodes,
        "textColors": textColors,
        "backgroundColor": backgroundColor
    }))
}

const appendGradientNode = (parent) => {
    parent.insertAdjacentHTML("beforeend", GRADIENT_NODE)
    const gradientNode = parent.lastElementChild

    const percentageInput = gradientNode.querySelector(`.${PERCENTAGE_INPUT_CLASS}`)
    const colorInput = gradientNode.querySelector(`.${COLOR_INPUT_CLASS}`)
    const colorTextInput = gradientNode.querySelector(`.${TEXT_INPUT_CLASS}`)
    const deleteButton = gradientNode.querySelector(`.${DELETE_BUTTON_CLASS}`)
    const upButton = gradientNode.querySelector(`.${UP_BUTTON_CLASS}`)
    const downButton = gradientNode.querySelector(`.${DOWN_BUTTON_CLASS}`)

    const updateInputs = () => {
        percentageInput.value = gradientNodes[getIndex(gradientNode)].percentage
        colorInput.value = evaluateColor(gradientNodes[getIndex(gradientNode)].color)
        colorTextInput.value = gradientNodes[getIndex(gradientNode)].color
    }

    gradientNode.updateInputs = updateInputs

    updateInputs()

    percentageInput.oninput = () => {
        gradientNodes[getIndex(gradientNode)].percentage = percentageInput.value
        updateStatusBarStyles()
    }

    colorInput.oninput = () => {
        gradientNodes[getIndex(gradientNode)].color = colorInput.value
        colorTextInput.value = gradientNodes[getIndex(gradientNode)].color
        updateStatusBarStyles()
    }

    colorTextInput.oninput = () => {
        gradientNodes[getIndex(gradientNode)].color = colorTextInput.value
        colorInput.value = evaluateColor(gradientNodes[getIndex(gradientNode)].color)
        updateStatusBarStyles()
    }

    deleteButton.onclick = () => {
        gradientNodes.splice(getIndex(gradientNode), 1)
        gradientNode.remove()
        updateStatusBarStyles()
    }

    upButton.onclick = () => {
        let temp = gradientNodes[getIndex(gradientNode)].color
        gradientNodes[getIndex(gradientNode)].color = gradientNodes[getIndex(gradientNode) - 1].color
        gradientNodes[getIndex(gradientNode) - 1].color = temp
        parent.children[getIndex(gradientNode) - 1].updateInputs()
        updateInputs()
        updateStatusBarStyles()
    }

    downButton.onclick = () => {
        let temp = gradientNodes[getIndex(gradientNode)].color
        gradientNodes[getIndex(gradientNode)].color = gradientNodes[getIndex(gradientNode) + 1].color
        gradientNodes[getIndex(gradientNode) + 1].color = temp
        parent.children[getIndex(gradientNode) + 1].updateInputs()
        updateInputs()
        updateStatusBarStyles()
    }
}

const CUSTOMIZE_STATUS_BAR_SCREEN = `
  <div id="${CUSTOMIZE_STATUS_BAR_SCREEN_ID}" class="game-menu_inGameMenuOverlay__XWQpg">
    <style>
      .${PERCENTAGE_INPUT_CLASS}, .${COLOR_INPUT_CLASS},
      .${TEXT_INPUT_CLASS}, .${DELETE_BUTTON_CLASS}, .${STANDARD_BUTTON_CLASS} {
        background: rgba(255,255,255,0.1);
        color: white;
        border: none;
        border-radius: 5px;
        font-family: var(--default-font);
        font-size: var(--font-size-14);
        padding: 0.5rem;
      }

      .${PERCENTAGE_INPUT_CLASS}, .${COLOR_INPUT_CLASS} {
        width: 3rem;
      }

      .${PERCENTAGE_INPUT_CLASS}, .${TEXT_INPUT_CLASS} {
        text-align: center;
        -moz-appearance: textfield;
      }

      .${PERCENTAGE_INPUT_CLASS}::-webkit-outer-spin-button,
      .${PERCENTAGE_INPUT_CLASS}::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      .${COLOR_INPUT_CLASS} {
        height: 100%;
        padding: 0.25rem;
      }

      .${COLOR_INPUT_CLASS}::-webkit-color-swatch-wrapper {
        padding: 0;
      }

      .${COLOR_INPUT_CLASS}::-webkit-color-swatch {
        border: none;
        border-radius: 5px;
      }

      .${TEXT_INPUT_CLASS}:invalid, .${PERCENTAGE_INPUT_CLASS}:invalid {
        background: rgba(209, 27, 38, 0.1);
        color: var(--color-red-60);
      }

      .${DELETE_BUTTON_CLASS}, .${STANDARD_BUTTON_CLASS} {
        width: 2rem;
        user-select: none;
      }

      .${DELETE_BUTTON_CLASS} {
        background: rgba(209, 27, 38, 0.1);
      }

      .${DELETE_BUTTON_CLASS}:hover, .${STANDARD_BUTTON_CLASS}:hover, .${COLOR_INPUT_CLASS}:hover {
        cursor: pointer;
      }

      .${DELETE_BUTTON_CLASS}:hover {
        background: var(--color-red-60);
      }

      .${STANDARD_BUTTON_CLASS}:hover {
        background: var(--color-grey-70);
      }

      #${CUSTOMIZE_STATUS_BAR_SCREEN_ID} .grid-element {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    </style>
    <div class="game-menu_inGameMenuContentWrapper__mGVx4">
      <div class="game-menu_innerContainer__Kxqz_">
        <p class="game-menu_header__Hs03p">Customize Status Bar</p>
        <div class="game-menu_volumeContainer__aWb0Y" style="display: flex; flex-direction: column; gap: 0.4rem;">
          <p class="game-menu_subHeader__Ul5Vl">Background</p>
          ${colorNode("Color", BACKGROUND_COLOR_ID)}
        </div>
        <div class="game-menu_volumeContainer__aWb0Y" style="display: flex; flex-direction: column; gap: 0.4rem;">
          <p class="game-menu_subHeader__Ul5Vl">Gradient</p>
          <div id="${GRADIENT_NODE_LIST_ID}" style="display: flex; flex-direction: column; gap: 0.4rem; max-height: 10rem; overflow-y: auto;"></div>
        </div>
        <button id="${ADD_GRADIENT_NODE_BUTTON_ID}" class="button_button__aR6_e button_variantSecondary__hvM_F">Add node</button>
        <div class="game-menu_volumeContainer__aWb0Y" style="display: flex; flex-direction: column; gap: 0.4rem;">
          <p class="game-menu_subHeader__Ul5Vl">Text colors</p>
          <div id="${TEXT_COLOR_NODE_LIST_ID}" style="display: flex; flex-direction: column; gap: 0.4rem;"></div>
        </div>
        <div class="game-menu_divider__IhA4tL"></div>
        <button id="${RESET_DEFAULTS_BUTTON_ID}" class="button_button__aR6_e button_variantSecondary__hvM_F">Reset Defaults</button>
        <div class="game-menu_divider__IhA4t"></div>
        <button id="${RESUME_BUTTON_ID}" class="button_button__aR6_e button_variantPrimary__u3WzI">Resume Game</button>
      </div>
    </div>
  </div>
`


const onCustomizeStatusBarButtonClick = () => {
    // Close the settings overlay
    document.querySelector(".game-menu_inGameMenuOverlay__XWQpg .buttons_buttons__3yvvA .button_variantPrimary__u3WzI").click()

    const gameLayout = document.querySelector(".in-game_layout__kqBbg")
    gameLayout.insertAdjacentHTML("beforeend", CUSTOMIZE_STATUS_BAR_SCREEN)

    const backgroundColorDiv = document.getElementById(BACKGROUND_COLOR_ID)

    const colorInput = backgroundColorDiv.querySelector(`.${COLOR_INPUT_CLASS}`)
    const colorTextInput = backgroundColorDiv.querySelector(`.${TEXT_INPUT_CLASS}`)

    colorInput.value = evaluateColor(backgroundColor)
    colorTextInput.value = backgroundColor

    colorInput.oninput = () => {
        backgroundColor = colorInput.value
        colorTextInput.value = backgroundColor
        updateStatusBarStyles()
    }

    colorTextInput.oninput = () => {
        backgroundColor = colorTextInput.value
        colorInput.value = evaluateColor(backgroundColor)
        updateStatusBarStyles()
    }

    const addGradientNodeButton = document.getElementById(ADD_GRADIENT_NODE_BUTTON_ID)
    addGradientNodeButton.onclick = () => {
        gradientNodes.push(defaultNode())
        appendGradientNode(gradientNodeList)
    }

    const resetButton = document.getElementById(RESET_DEFAULTS_BUTTON_ID)
    resetButton.onclick = () => {
        gradientNodes = DEFAULT_GRADIENT_NODES
        textColors = DEFAULT_TEXT_COLORS
        backgroundColor = DEFAULT_BACKGROUND_COLOR
        updateStatusBarStyles()
    }

    const resumeButton = document.getElementById(RESUME_BUTTON_ID)
    resumeButton.onclick = () => {
        const statusBar = document.querySelector(".game_status___YFni")
        statusBar.style.zIndex = null
        document.querySelector(".game_canvas__twTKG").appendChild(statusBar)
        document.getElementById(CUSTOMIZE_STATUS_BAR_SCREEN_ID).remove()
    }

    // Move the status bar up so it's visible through the backdrop blur
    const statusBar = document.querySelector(".game_status___YFni")
    statusBar.style.zIndex = "30"
    document.querySelector(".in-game_layout__kqBbg").appendChild(statusBar)

    const gradientNodeList = document.getElementById(GRADIENT_NODE_LIST_ID)
    for (const i in gradientNodes) {
        appendGradientNode(gradientNodeList)
    }

    const textColorNodeList = document.getElementById(TEXT_COLOR_NODE_LIST_ID)
    appendTextColorNode(textColorNodeList, "Labels", 0)
    appendTextColorNode(textColorNodeList, "Values", 1)
}

const injectCustomizeStatusBarButton = (settingsScreen) => {
    settingsScreen.insertAdjacentHTML("afterend", CUSTOMIZE_STATUS_BAR_BUTTON)
    document.getElementById(CUSTOMIZE_STATUS_BAR_BUTTON_ID).onclick = onCustomizeStatusBarButtonClick
}

const onMutations = () => {
    if (!pathMatches("game/.+")) return

    if (!document.getElementById(STYLE_ID)) {
        const style = document.createElement("style")
        style.id = STYLE_ID
        document.body.appendChild(style)
        updateStatusBarStyles()
    }

    const settingsScreen = document.querySelector(".in-game_layout__kqBbg > .game-menu_inGameMenuOverlay__XWQpg .game-menu_settingsContainer__NeJu2 > .game-menu_divider__IhA4t")

    if (settingsScreen && !document.querySelector(`#${CUSTOMIZE_STATUS_BAR_BUTTON_ID}`)) {
        injectCustomizeStatusBarButton(settingsScreen)
    }
}

const observer = new MutationObserver(onMutations)

observer.observe(document.body, OBSERVER_CONFIG)