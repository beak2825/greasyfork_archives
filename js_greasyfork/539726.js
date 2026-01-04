// ==UserScript==
// @name         Aternos Auto Bot
// @version      0.7.3
// @description  Auto-clicks Start/Confirm with toggle button showing icon + "Auto Start On/Off" with color indicator and native style settings menu
// @author       zuki
// @match        https://aternos.org/server/*
// @grant        none
// @namespace https://greasyfork.org/users/1484866
// @downloadURL https://update.greasyfork.org/scripts/539726/Aternos%20Auto%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/539726/Aternos%20Auto%20Bot.meta.js
// ==/UserScript==

let BotON = localStorage.getItem('aternosAutoBotON') === 'true'
let IsRunning = false
let AutoButton = null

let Settings = JSON.parse(localStorage.getItem('aternosAutoBotSettings') || '{}')
if (Settings.updateSpeed === undefined) Settings.updateSpeed = 300
if (Settings.autoToggle === undefined) Settings.autoToggle = false

if (Settings.autoToggle) BotON = true

const observer = new MutationObserver(() => {
    const StartButton = document.querySelector('div#start')
    if (StartButton && StartButton.parentElement && !document.getElementById('autostart-toggle')) {
        AutoButton = StartButton.cloneNode(true)
        AutoButton.id = "autostart-toggle"
        AutoButton.querySelector("i")?.remove()
        AutoButton.innerHTML = BotON
            ? '<i class="fa-solid fa-repeat"></i> Auto Start On'
            : '<i class="fa-solid fa-repeat"></i> Auto Start Off'
        AutoButton.style.backgroundColor = BotON ? '' : '#e3214b'
        AutoButton.style.transition = 'none'
        AutoButton.style.margin = '0'

        AutoButton.addEventListener("click", () => {
            BotON = !BotON
            localStorage.setItem('aternosAutoBotON', BotON)
            AutoButton.innerHTML = BotON
                ? '<i class="fa-solid fa-repeat"></i> Auto Start On'
                : '<i class="fa-solid fa-repeat"></i> Auto Start Off'
            AutoButton.style.transition = 'none'
            AutoButton.style.backgroundColor = BotON ? '' : '#e3214b'
        })

        StartButton.parentElement.appendChild(AutoButton)
        startTheServer()
        monitorVisibility()
    }
})

observer.observe(document.body, { childList: true, subtree: true })

function startTheServer() {
    if (BotON) {
        setTimeout(() => {
            antiBanCheckIfUnused()
            setTimeout(() => {
                if (IsRunning) {
                    document.querySelector('div#confirm')?.click()
                    document.querySelector('div#start')?.click()
                }
                startTheServer()
            }, 200)
        }, 900)
    } else {
        setTimeout(startTheServer, Settings.updateSpeed)
    }
}

function antiBanCheckIfUnused() {
    const Online = document.getElementsByClassName('status online')
    const Loading = document.getElementsByClassName('status loading')
    const Starting = document.getElementsByClassName('status loading starting')
    IsRunning = !(Online.length || Loading.length || Starting.length)
}

function monitorVisibility() {
    setInterval(() => {
        const StartVisible = isButtonVisible(document.querySelector('div#start'))
        const StopVisible = isButtonVisible(document.querySelector('div#stop'))
        const ConfirmVisible = isButtonVisible(document.querySelector('div#confirm'))

        if (!StartVisible && !StopVisible && !ConfirmVisible) {
            AutoButton.style.position = 'absolute'
            AutoButton.style.left = '50%'
            AutoButton.style.top = '50%'
            AutoButton.style.transform = 'translate(-50%, -50%)'
        } else {
            AutoButton.style.position = ''
            AutoButton.style.left = ''
            AutoButton.style.top = ''
            AutoButton.style.transform = ''
        }
    }, 300)
}

function isButtonVisible(button) {
    if (!button) return false
    return !!(button.offsetWidth || button.offsetHeight || button.getClientRects().length)
}

function AddSettingsButton() {
    const Nav = document.querySelector('nav.navigation-list')
    if (!Nav || document.getElementById('auto-start-settings-button')) return

    const SettingsButton = document.createElement('a')
    SettingsButton.href = '#'
    SettingsButton.className = 'item'
    SettingsButton.id = 'auto-start-settings-button'
    SettingsButton.title = 'Auto Start Settings'
    SettingsButton.style.borderRadius = '6px'

    const Icon = document.createElement('i')
    Icon.className = 'fas fa-wrench'
    Icon.style.borderRadius = '6px'

    const Label = document.createElement('span')
    Label.className = 'navigation-item-label'
    Label.style.borderRadius = '6px'
    Label.innerText = 'Auto Start Settings'

    SettingsButton.appendChild(Icon)
    SettingsButton.appendChild(Label)

    SettingsButton.addEventListener('click', (e) => {
        e.preventDefault()
        OpenSettingsModal()
    })

    Nav.appendChild(SettingsButton)
}

const NavObserver = new MutationObserver(() => AddSettingsButton())
NavObserver.observe(document.body, { childList: true, subtree: true })

function OpenSettingsModal() {
    if (document.getElementById('auto-start-modal')) return

    const Overlay = document.createElement('div')
    Overlay.id = 'auto-start-modal'
    Overlay.style.position = 'fixed'
    Overlay.style.top = '0'
    Overlay.style.left = '0'
    Overlay.style.width = '100%'
    Overlay.style.height = '100%'
    Overlay.style.backgroundColor = 'rgba(0,0,0,0.5)'
    Overlay.style.display = 'flex'
    Overlay.style.justifyContent = 'center'
    Overlay.style.alignItems = 'center'
    Overlay.style.zIndex = '9999'

    const Modal = document.createElement('div')
    Modal.className = 'config-options'
    Modal.style.backgroundColor = 'white'
    Modal.style.padding = '20px'
    Modal.style.borderRadius = '12px'
    Modal.style.minWidth = '400px'
    Modal.style.display = 'flex'
    Modal.style.flexDirection = 'column'
    Modal.style.gap = '20px'

    const CloseButton = document.createElement('button')
    CloseButton.innerText = 'Close'
    CloseButton.style.backgroundColor = '#e3214b'
    CloseButton.style.color = 'white'
    CloseButton.style.padding = '10px'
    CloseButton.style.border = 'none'
    CloseButton.style.borderRadius = '6px'
    CloseButton.style.cursor = 'pointer'
    CloseButton.addEventListener('click', () => Overlay.remove())

    Modal.appendChild(CreateToggleOption('Auto Toggle on Page Load', 'autoToggle'))
    Modal.appendChild(CreateNumberOption('Update Speed (ms)', 'updateSpeed', 100, 2000))
    Modal.appendChild(CloseButton)

    Overlay.appendChild(Modal)
    document.body.appendChild(Overlay)
}

function CreateToggleOption(labelText, settingKey) {
    const Option = document.createElement('div')
    Option.className = 'config-option config-option-toggle'

    const InputWrapper = document.createElement('div')
    InputWrapper.className = 'config-option-input'

    const Label = document.createElement('label')
    Label.innerText = labelText

    const SaveIcon = document.createElement('div')
    SaveIcon.className = 'options-save'
    SaveIcon.innerHTML = '<i class="fas fa-save"></i>'
    SaveIcon.style.display = 'none'

    const Toggle = document.createElement('div')
    Toggle.className = 'toggle'

    const Input = document.createElement('input')
    const ToggleID = `toggle-${settingKey}`
    Input.name = settingKey
    Input.id = ToggleID
    Input.type = 'checkbox'
    Input.checked = Settings[settingKey]

    const ToggleLabel = document.createElement('label')
    ToggleLabel.setAttribute('for', ToggleID)

    Input.addEventListener('change', () => {
        Settings[settingKey] = Input.checked
        SaveSettings()
        SaveIcon.style.display = 'block'
        setTimeout(() => SaveIcon.style.display = 'none', 1000)
        if (settingKey === 'autoToggle') {
            localStorage.setItem('aternosAutoBotON', Input.checked)
        }
    })

    Toggle.appendChild(Input)
    Toggle.appendChild(ToggleLabel)

    InputWrapper.appendChild(Label)
    InputWrapper.appendChild(SaveIcon)
    InputWrapper.appendChild(Toggle)
    Option.appendChild(InputWrapper)

    return Option
}

function CreateNumberOption(labelText, settingKey, min, max) {
    const Option = document.createElement('div')
    Option.className = 'config-option config-option-number'

    const InputWrapper = document.createElement('div')
    InputWrapper.className = 'config-option-input'

    const Label = document.createElement('label')
    Label.innerText = labelText

    const TypeInput = document.createElement('div')
    TypeInput.className = 'type-input number-input'

    const Icon = document.createElement('div')
    Icon.className = 'type-input-icon'
    Icon.innerHTML = '<i class="fa-solid fa-wrench"></i>'

    const Input = document.createElement('input')
    Input.type = 'number'
    Input.step = '1'
    Input.min = min
    Input.max = max
    Input.value = Settings[settingKey]
    Input.addEventListener('input', () => {
        Settings[settingKey] = parseInt(Input.value)
        SaveSettings()
    })

    const Controls = document.createElement('div')
    Controls.className = 'number-input-controls'

    const Up = document.createElement('div')
    Up.className = 'input-number-up'
    Up.innerHTML = '<i class="fas fa-plus"></i>'
    Up.addEventListener('click', () => {
        Input.stepUp()
        Input.dispatchEvent(new Event('input'))
    })

    const Down = document.createElement('div')
    Down.className = 'input-number-down'
    Down.innerHTML = '<i class="fas fa-minus"></i>'
    Down.addEventListener('click', () => {
        Input.stepDown()
        Input.dispatchEvent(new Event('input'))
    })

    Controls.appendChild(Up)
    Controls.appendChild(Down)

    TypeInput.appendChild(Icon)
    TypeInput.appendChild(Input)
    TypeInput.appendChild(Controls)

    InputWrapper.appendChild(Label)
    InputWrapper.appendChild(TypeInput)
    Option.appendChild(InputWrapper)

    return Option
}

function SaveSettings() {
    localStorage.setItem('aternosAutoBotSettings', JSON.stringify(Settings))
}