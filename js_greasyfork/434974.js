// ==UserScript==
// @name        Vault Save Password Configurations
// @description Adds saving of password configurations per service to getvau.lt
// @namespace   https://github.com/insin/greasemonkey/
// @match       https://getvau.lt/
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/434974/Vault%20Save%20Password%20Configurations.user.js
// @updateURL https://update.greasyfork.org/scripts/434974/Vault%20Save%20Password%20Configurations.meta.js
// ==/UserScript==

/** @typedef {'required' | 'allowed' | 'forbidden'} CharacterConfig */

/**
 * @typedef {{
 *   service: string
 *   vlength: string
 *   repeat: string
 *   lower: CharacterConfig
 *   upper: CharacterConfig
 *   number: CharacterConfig
 *   dash: CharacterConfig
 *   space: CharacterConfig
 *   symbol: CharacterConfig
 * }} Config
 */

function setText(selector, value) {
  let $input = document.querySelector(selector)
  $input.value = value
  $input.dispatchEvent(new Event('change'))
}

function setRadio(selector, value) {
  let $radio = document.querySelector(`${selector}[value="${value}"]`)
  $radio.checked = true
  $radio.dispatchEvent(new Event('change'))
}

/** @type {Config[]} */
let configs = JSON.parse(localStorage['configs'] || '[]')

// Add a <datalist> for the service name input with stored service names
let $services = document.createElement('datalist')
$services.id = 'services'
configs.forEach((config) => {
  let $option = document.createElement('option')
  $option.value = config.service
  $services.appendChild($option)
})
document.body.appendChild($services)

let $service = document.querySelector('#service')
$service.setAttribute('list', 'services')

// Populate config when a stored service name is entered
$service.addEventListener('input', () => {
  let service = $service.value
  let config = configs.find((config) => config.service == service)
  if (!config) return

  setText('#vlength', config.vlength)
  setText('#repeat', config.repeat)
  setRadio('input[name="lower"]', config.lower)
  setRadio('input[name="upper"]', config.upper)
  setRadio('input[name="number"]', config.number)
  setRadio('input[name="dash"]', config.dash)
  setRadio('input[name="space"]', config.space)
  setRadio('input[name="symbol"]', config.symbol)
})

// Wrap the form controls in a <form> so it's easier to get values out
let $form = document.createElement('form')
let $formDiv = document.querySelector('.form')
$formDiv.insertAdjacentElement('beforebegin', $form)
$form.appendChild($formDiv)

// Add a Save Service Config button which saves the current configuration
let $saveButtonSection = document.createElement('div')
$saveButtonSection.className = 'sub'
let $saveButton = document.createElement('button')
$saveButton.type = 'button'
$saveButton.innerText = 'Save Service Config'
$saveButton.addEventListener('click', () => {
  let service = $form.elements.service.value
  let existingServiceIndex = configs.findIndex(
    (config) => config.service == service
  )
  if (existingServiceIndex != -1) {
    configs.splice(existingServiceIndex, 1)
  }
  configs.push({
    service,
    vlength: $form.elements.vlength.value,
    repeat: $form.elements.repeat.value,
    lower: $form.elements.lower.value,
    upper: $form.elements.upper.value,
    number: $form.elements.number.value,
    dash: $form.elements.dash.value,
    space: $form.elements.space.value,
    symbol: $form.elements.symbol.value,
  })
  localStorage['configs'] = JSON.stringify(configs)
})
$saveButtonSection.appendChild($saveButton)
document.body.appendChild($saveButtonSection)
