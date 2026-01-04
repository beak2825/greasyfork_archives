javascript:
// ==UserScript==
// @name         Set arrival time by linovlo & pts
// @version      1.4
// @author       linovlo & pts
// @include      https://*/game.php?*village=*&screen=place&try=confirm
// @description  oszczedza czas ;)
// @namespace    https://greasyfork.org/users/291327
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.js
// @downloadURL https://update.greasyfork.org/scripts/393366/Set%20arrival%20time%20by%20linovlo%20%20pts.user.js
// @updateURL https://update.greasyfork.org/scripts/393366/Set%20arrival%20time%20by%20linovlo%20%20pts.meta.js
// ==/UserScript==

// DON'T MESS WITH THIS IF YOU DON'T KNOW WHAT YOU ARE DOING



// dodanie wiersza offset nic nie zmienione
window.offsetTr = document.createElement('tr')
window.offsetTd = document.createElement('td')
var arrTimeNow = document.getElementById('date_arrival')
window.offsetTr.appendChild(window.offsetTd) // Append td to tr
arrTimeNow.parentNode.parentNode.insertBefore(window.offsetTr, arrTimeNow.parentNode[1])
window.offsetTd.innerHTML = 'Offset: '
window.offsetTd.setAttribute('colspan', '2')
window.offsetTd.setAttribute('id', 'offset')

// input do setoffset
var pEle = document.getElementById('offset') // Button comes after this element
var inputOffset = document.createElement('input')
inputOffset.setAttribute('id', 'inputOffset')
inputOffset.setAttribute('type', 'text')
inputOffset.setAttribute('style', 'font-size:15px;')
var callOffset1 = localStorage.getItem('saveOffset')
if (callOffset1 !== null) {
  var offsetInput = localStorage.getItem('saveOffset')
} else {
  var offsetInput = '15'
}
inputOffset.setAttribute('value', offsetInput)
inputOffset.setAttribute('style', 'margin-top:10px; width:50px;')
pEle.appendChild(inputOffset, pEle.nextElementSibling)

// Create "Set Offset" button
var parentSetOffset = document.getElementById('inputOffset') // Button comes after this element
var buttonOffset = document.createElement('a') // Create button called buttonOffset as a link because any button causes the attack to launch
buttonOffset.setAttribute('id', 'buttonOffset') // Set ID of buttonOffset
buttonOffset.setAttribute('class', 'btn')
buttonOffset.setAttribute('style', 'cursor:pointer;') // Set cursor to pointer
parentSetOffset.parentNode.insertBefore(buttonOffset, parentSetOffset.nextElementSibling) // Place buttonOffset after parentSetOffset
var text = document.createTextNode('Set Offset') // buttonOffset has this text
buttonOffset.appendChild(text) // Append text to buttonOffset

buttonOffset.onclick = function () {
  'use strict'
  var saveOffset = document.getElementById('inputOffset').value
  localStorage.setItem('saveOffset', saveOffset)
  var callOffset = localStorage.getItem('saveOffset')
  console.log(callOffset)
}

// Add new table row for arrival time
window.showArrTimeTr = document.createElement('tr')
window.showArrTimeTd = document.createElement('td')
var arrTimeNow = document.getElementById('date_arrival')
window.showArrTimeTr.appendChild(window.showArrTimeTd) // Append td to tr
arrTimeNow.parentNode.parentNode.insertBefore(window.showArrTimeTr, arrTimeNow.parentNode[1])
window.showArrTimeTd.innerHTML = 'Please enter the desired arrival time: '
window.showArrTimeTd.setAttribute('colspan', '2')
window.showArrTimeTd.setAttribute('id', 'showArrTime')

// Create "Set Arrival Time" button
var pEle = document.getElementById('showArrTime') // Button comes after this element
var para = document.createElement('p') // Create new paragraph
para.setAttribute('style', 'width:100%')
var btn = document.createElement('a') // Create button called btn as a link because any button causes the attack to launch
btn.setAttribute('id', 'arrTime') // Set ID of btn
btn.setAttribute('class', 'btn')
btn.setAttribute('style', 'cursor:pointer;') // Set cursor to pointer
pEle.parentNode.insertBefore(para, pEle.nextElementSibling) // Place para after pEle
para.parentNode.parentNode.appendChild(btn) // Set the paragraph after the table
var t = document.createTextNode('Set arrival time') // btn has this text
btn.appendChild(t) // Append text to btn

// Create input for time
// defaultTime zawiera czas przybycia wojska jako timestamp np: 1575645783.917385
// https://www.freeformatter.com/epoch-timestamp-to-date-converter.html  można to wklepać i sprawdzić
// rezultat 6.12.2019, 16:23:03
//var defaultTime = Timing.tickHandlers.forwardTimers._timers[0][0].dataset.duration
var defaultTime = Math.floor(Timing.getCurrentServerTime()) + parseInt(Timing.tickHandlers.forwardTimers._timers[0][0].dataset.duration)*1000
var parentInput = document.getElementById('showArrTime') // Button comes after this element
var inputTime = document.createElement('input')
inputTime.setAttribute('id', 'inputTime')
// tu zmiana inputa na datetime-local
inputTime.setAttribute('type', 'datetime-local')
// step ustawiony tak aby była możliwość ustawienia ms
inputTime.setAttribute('step', '0.001')

// przerobienie timestampa do formatu Fri Dec 06 2019 16:23:03 GMT+0100
var date = new Date(defaultTime)

// posklejanie do formy akceptowalnej przez datetimelocal czyli YYYY-MM-DDTHH:MM:SS.MS
// ('0' + (date.getMonth()+1)).slice(-2) <--- ta konstrukcja ma na celu zapis np stycznia jako "01" a nie "1"
//  date.getMonth()+1 nie wiadomo dla czego było o 1 miesiac za mało
var abc = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDay() + 1)).slice(-2) + 'T' + ('0' + (date.getHours())).slice(-2) + ':' + ('0' + (date.getMinutes())).slice(-2) + ':' + ('0' + (date.getSeconds())).slice(-2) + '.' + (date.getUTCMilliseconds())
console.log("czy to to "+abc)
var nowa_localdatetime = moment(new Date(date))
console.log(nowa_localdatetime.format().substring(0,19)+'.000')

// i przypisanie
//inputTime.value = abc
inputTime.value = nowa_localdatetime.format().substring(0,19)+'.000'

inputTime.setAttribute('style', 'margin-top:10px;font-size:22px;')
parentInput.appendChild(inputTime, parentInput.nextElementSibling)

// Create input for MS
var parentInputMs = document.getElementById('showArrTime') // Button comes after this element
var inputTimeMs = document.createElement('input')
inputTimeMs.setAttribute('id', 'inputTimeMs')
inputTimeMs.setAttribute('type', 'text')
inputTimeMs.setAttribute('value', '000')
inputTimeMs.setAttribute('style', 'margin-top:10px; width:30px;font-size:15px;')
// parentInputMs.appendChild(inputTimeMs, parentInputMs.nextElementSibling)

// nie wykorzystywane ale może się przydać
function timeConverter (UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000)
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var year = a.getFullYear()
  var month = months[a.getMonth()]
  var date = a.getDate()
  var hour = a.getHours()
  var min = a.getMinutes()
  var sec = a.getSeconds()
  var mil = a.getMilliseconds()
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec + ',' + mil
  return time
}

window.setArrTimeTr = document.createElement('tr')
window.setArrTimeTd = document.createElement('td')
var offset = Timing.offset_to_server
$("#inputTime").closest('tbody').append('<tr><td>Server delay: ' + Timing.offset_to_server + '</td></tr>')

btn.onclick = function () {
  'use strict'

  var delayTime = Timing.offset_to_server; // pobieranie offsetu może być przydatne ?
  var intervalTime = 10 // Set interval in ms

  var arrTimeNow = document.getElementById('date_arrival')

  var arrivalTime = document.getElementById('inputTime').value; // pobranie wartości z inputa np:  arrivalTime = "2019-12-06T16:23:03.917"

  var readarival = Math.floor(Timing.getCurrentServerTime()) + parseInt(Timing.tickHandlers.forwardTimers._timers[0][0].dataset.duration)*1000
  var test = new Date($('#inputTime').val())
  var milliseconds_wait = test.getMilliseconds()
  test.setMilliseconds(0)

  window.setArrTimeTd.setAttribute('colspan', '2')
  window.setArrTimeTd.setAttribute('id', 'setArrTime')

  console.log(new Date(1000))

  var a = document.getElementById('troop_confirm_go')

  $("#inputTime").closest('tbody').append('<tr><td>Set! Have fun :) </td></tr>')

  run = setInterval(function retime () {
    readarival = new Date(Math.floor(Timing.getCurrentServerTime()) + parseInt(Timing.tickHandlers.forwardTimers._timers[0][0].dataset.duration)*1000)
    readarival.setMilliseconds(0)

    //if (readarival < test) {console.log('nie')}
    //if (readarival >= test) {console.log('tak')}

    if (readarival >= test) {
      setTimeout(function () {
        a.click()
        clearInterval(run)
      }, milliseconds_wait+49)
    }
  }, 1)
}














