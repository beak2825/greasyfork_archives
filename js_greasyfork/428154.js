// ==UserScript==
// @name         eSim MU Storage 2
// @namespace    eSim-MU2
// @version      2.1
// @description  Improve the E-sim Mu Storage page
// @author       gg
// @match        https://*.e-sim.org/militaryUnitStorage.html*
// @icon         https://cdn.discordapp.com/icons/316566483021070356/cfffdee309ec53078e9a9698ec4eef42.png?size=256
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428154/eSim%20MU%20Storage%202.user.js
// @updateURL https://update.greasyfork.org/scripts/428154/eSim%20MU%20Storage%202.meta.js
// ==/UserScript==

const qualityForm = document.getElementById('quantity')
const tickAllBtn = document.getElementById('tickAll')
const esimDonateForm = document.getElementById('donateProductForm')
const userElement = document.getElementById('userName')
const userId = userElement.href.split('=')[1]
const productOptions = document.getElementById('product')
const storage = document.querySelectorAll('.storage')
const elementList = document.querySelectorAll('.receipments')
const foodDiv = document.createElement('div')
const foodTextarea = document.createElement('input')
const foodQuantityInput = document.createElement('input')
const giftDiv = document.createElement('div')
const giftTextarea = document.createElement('input')
const giftQuantityInput = document.createElement('input')
const wepDiv = document.createElement('div')
const wepTextarea = document.createElement('input')
const wepQuantityInput = document.createElement('input')
const btnSendSupps = document.createElement('BUTTON')
const lineBreak = document.createElement('hr')

const delay = ms => new Promise(res => setTimeout(res, ms))

function randomNumber () {
  const n = Math.floor(Math.random() * 3000) + 4000
  return n
}

function findFormCitizenId () {
  for (let i = 0; i < elementList.length; i++) {
    if (elementList[i].value === userId) {
      return elementList[i].name
    }
  }
}

function createElements () {
  const quantityAdd10Btn = document.createElement('BUTTON')
  quantityAdd10Btn.type = 'button'
  quantityAdd10Btn.setAttribute('class', 'submit')
  quantityAdd10Btn.innerHTML = '10'
  qualityForm.parentNode.insertBefore(quantityAdd10Btn, qualityForm.nextSibling)
  quantityAdd10Btn.addEventListener('click', function () { addQuantity(10) })

  const quantityAdd100Btn = document.createElement('BUTTON')
  quantityAdd100Btn.type = 'button'
  quantityAdd100Btn.innerHTML = '100'
  qualityForm.parentNode.insertBefore(quantityAdd100Btn, quantityAdd10Btn.nextSibling)
  quantityAdd100Btn.addEventListener('click', function () { addQuantity(100) })

  const quantityAdd1000btn = document.createElement('BUTTON')
  quantityAdd1000btn.type = 'button'
  quantityAdd1000btn.innerHTML = '1000'
  qualityForm.parentNode.insertBefore(quantityAdd1000btn, quantityAdd100Btn.nextSibling)
  quantityAdd1000btn.addEventListener('click', function () { addQuantity(1000) })

  const formName = findFormCitizenId()
  const sendYourselfBtn = document.createElement('BUTTON')
  sendYourselfBtn.innerHTML = 'Send Yourself'
  sendYourselfBtn.setAttribute('name', formName)
  sendYourselfBtn.setAttribute('value', userId)
  tickAllBtn.parentNode.insertBefore(sendYourselfBtn, tickAllBtn.nextSibling)

  foodDiv.style.display = 'inline-block'
  foodDiv.setAttribute('id', 'foodProductForm')

  esimDonateForm.parentNode.insertBefore(foodDiv, esimDonateForm)

  foodTextarea.setAttribute('value', 'Q5-FOOD')
  foodTextarea.setAttribute('name', 'product')
  foodTextarea.value = 'Food'
  foodTextarea.disabled = true
  foodTextarea.style.cssText = 'color:black; width:33px; height:15px;'
  foodDiv.appendChild(foodTextarea)

  foodQuantityInput.style.cssText = 'margin-left: -0.1em!important; margin-right: 0.5em!important; width:31px; height:15px'
  foodQuantityInput.setAttribute('name', 'quantity')
  foodQuantityInput.setAttribute('value', '15')
  foodQuantityInput.type = 'digit'
  foodDiv.appendChild(foodQuantityInput)

  giftDiv.style.display = 'inline-block'
  giftDiv.setAttribute('id', 'giftProductForm')

  esimDonateForm.parentNode.insertBefore(giftDiv, esimDonateForm)

  giftTextarea.value = 'Gift'
  giftTextarea.disabled = true
  giftTextarea.style.cssText = 'color:black; width:30px; height:15px;'
  giftDiv.appendChild(giftTextarea)

  giftQuantityInput.style.cssText = 'margin-left: -0.1em!important; margin-right: 0.5em!important; width:31px; height:15px'
  giftQuantityInput.type = 'digit'
  giftQuantityInput.setAttribute('value', '15')
  giftDiv.appendChild(giftQuantityInput)

  wepDiv.style.display = 'inline-block'
  wepDiv.setAttribute('id', 'wepProductForm')
  wepDiv.noValidate = true
  esimDonateForm.parentNode.insertBefore(wepDiv, esimDonateForm)

  wepTextarea.value = 'Wep'
  wepTextarea.disabled = true
  wepTextarea.style.cssText = 'color:black; width:30px; height:15px;'
  wepDiv.appendChild(wepTextarea)

  wepQuantityInput.style.cssText = 'margin-left: -0.1em!important; margin-right: 0.5em!important; width:31px; height:15px'
  wepQuantityInput.type = 'digit'
  wepQuantityInput.setAttribute('value', '250')
  wepDiv.appendChild(wepQuantityInput)

  btnSendSupps.type = 'button'
  btnSendSupps.addEventListener('click', sendSupps)
  btnSendSupps.innerHTML = 'SEND SUPPS'
  esimDonateForm.parentNode.insertBefore(btnSendSupps, esimDonateForm)

  esimDonateForm.parentNode.insertBefore(lineBreak, esimDonateForm)

  productOptions.options[0].text = 'Click on an item'
}

function suppsStatusColor (suppType, status) {
  if (suppType === 'FOOD') {
    if (status === 'ORANGE') {
      foodTextarea.style.color = 'Orange'
      foodQuantityInput.style.color = 'Orange'
    } else if (status === 'GREEN') {
      foodQuantityInput.style.color = '#11806a'
      foodTextarea.style.color = '#11806a'
    }
  }
  if (suppType === 'GIFT') {
    if (status === 'ORANGE') {
      giftTextarea.style.color = 'Orange'
      giftQuantityInput.style.color = 'Orange'
    } else if (status === 'GREEN') {
      giftTextarea.style.color = '#11806a'
      giftQuantityInput.style.color = '#11806a'
    }
  }
  if (suppType === 'WEAPON') {
    if (status === 'ORANGE') {
      wepTextarea.style.color = 'Orange'
      wepQuantityInput.style.color = 'Orange'
    } else if (status === 'GREEN') {
      wepTextarea.style.color = '#11806a'
      wepQuantityInput.style.color = '#11806a'
    }
  }
}

function resetButtonsAndText () {
  foodTextarea.style.color = 'Black'
  foodQuantityInput.style.color = 'Black'
  giftTextarea.style.color = 'Black'
  giftQuantityInput.style.color = 'Black'
  wepTextarea.style.color = 'Black'
  wepQuantityInput.style.color = 'Black'
  btnSendSupps.disabled = false
}

function startConnection () {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', '/militaryUnitStorage.html', true)

  // Send the proper header information along with the request
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

  xhr.onreadystatechange = function () { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE) {
      // Request finished. Do processing here.
    }
  }
  return xhr
}

const sendSupps = async () => {
  btnSendSupps.disabled = true

  let xhr
  const citizenId = findFormCitizenId()
  if (foodQuantityInput.value > 1) {
    suppsStatusColor('FOOD', 'ORANGE')
    await delay(randomNumber())
    const foodFormData = 'product=5-FOOD&quantity=' + foodQuantityInput.value + '&reason=&' + citizenId + '=' + userId
    xhr = startConnection()
    xhr.send(foodFormData)
    suppsStatusColor('FOOD', 'GREEN')
  }
  if (giftQuantityInput.value > 1) {
    suppsStatusColor('GIFT', 'ORANGE')
    await delay(randomNumber())
    const giftFormData = 'product=5-GIFT&quantity=' + giftQuantityInput.value + '&reason=&' + citizenId + '=' + userId
    xhr = startConnection()
    xhr.send(giftFormData)
    suppsStatusColor('GIFT', 'GREEN')
  }
  if (wepQuantityInput.value > 1) {
    suppsStatusColor('WEAPON', 'ORANGE')
    await delay(randomNumber())
    console.log('product=5-WEAPON&quantity=' + wepQuantityInput.value + '&reason=&' + citizenId + '=' + userId)
    const wepFormData = 'product=5-WEAPON&quantity=' + wepQuantityInput.value + '&reason=&' + citizenId + '=' + userId
    xhr = startConnection()
    xhr.send(wepFormData)
    suppsStatusColor('WEAPON', 'GREEN')
  }
  resetButtonsAndText()
}

function addQuantity (amount) {
  qualityForm.value = parseInt(qualityForm.value) + amount
}

function itemClickedOn (item) {
  for (let i = 1; i < productOptions.length; i++) {
    const pOption = productOptions[i]
    if (pOption.value === item) {
      pOption.selected = true
    }
  }
}

createElements()
for (let i = 0; i < storage.length; i++) {
  const itemInStorage = storage[i]
  const itemDirty = itemInStorage.children[0].className
  if (itemDirty) {
    const itemClean = itemDirty.replace('-ammount', '')
    switch (itemClean) {
      case 'Weapon-5':
        itemInStorage.addEventListener('click', function () { itemClickedOn('5-WEAPON') })
        break
      case 'Weapon-4':
        itemInStorage.addEventListener('click', function () { itemClickedOn('4-WEAPON') })
        break
      case 'Weapon-3':
        itemInStorage.addEventListener('click', function () { itemClickedOn('3-WEAPON') })
        break
      case 'Weapon-2':
        itemInStorage.addEventListener('click', function () { itemClickedOn('2-WEAPON') })
        break
      case 'Weapon-1':
        itemInStorage.addEventListener('click', function () { itemClickedOn('1-WEAPON') })
        break
      case 'Food-5':
        itemInStorage.addEventListener('click', function () { itemClickedOn('5-FOOD') })
        break
      case 'Food-4':
        itemInStorage.addEventListener('click', function () { itemClickedOn('4-FOOD') })
        break
      case 'Food-3':
        itemInStorage.addEventListener('click', function () { itemClickedOn('3-FOOD') })
        break
      case 'Food-2':
        itemInStorage.addEventListener('click', function () { itemClickedOn('2-FOOD') })
        break
      case 'Food-1':
        itemInStorage.addEventListener('click', function () { itemClickedOn('1-FOOD') })
        break
      case 'Gift-5':
        itemInStorage.addEventListener('click', function () { itemClickedOn('5-GIFT') })
        break
      case 'Gift-4':
        itemInStorage.addEventListener('click', function () { itemClickedOn('4-GIFT') })
        break
      case 'Gift-3':
        itemInStorage.addEventListener('click', function () { itemClickedOn('3-GIFT') })
        break
      case 'Gift-2':
        itemInStorage.addEventListener('click', function () { itemClickedOn('2-GIFT') })
        break
      case 'Gift-1':
        itemInStorage.addEventListener('click', function () { itemClickedOn('1-GIFT') })
        break
      case 'Ticket-5':
        itemInStorage.addEventListener('click', function () { itemClickedOn('5-TICKET') })
        break
      case 'Ticket-4':
        itemInStorage.addEventListener('click', function () { itemClickedOn('4-TICKET') })
        break
      case 'Ticket-3':
        itemInStorage.addEventListener('click', function () { itemClickedOn('3-TICKET') })
        break
      case 'Ticket-2':
        itemInStorage.addEventListener('click', function () { itemClickedOn('2-TICKET') })
        break
      case 'Ticket-1':
        itemInStorage.addEventListener('click', function () { itemClickedOn('1-TICKET') })
        break
      case 'House-5':
        itemInStorage.addEventListener('click', function () { itemClickedOn('5-HOUSE') })
        break
      case 'Estate-5':
        itemInStorage.addEventListener('click', function () { itemClickedOn('5-ESTATE') })
        break
    }
  }
}
