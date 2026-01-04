javascript:
// ==UserScript==
// @name         Set arrival time by linovlo & pts upgraded
// @version      2.0
// @author       linovlo & pts
// @include      https://*/game.php?*village=*&screen=place&try=confirm
// @description  oszczedza czas ;)
// @namespace    https://greasyfork.org/users/291327
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.js
// @downloadURL https://update.greasyfork.org/scripts/426150/Set%20arrival%20time%20by%20linovlo%20%20pts%20upgraded.user.js
// @updateURL https://update.greasyfork.org/scripts/426150/Set%20arrival%20time%20by%20linovlo%20%20pts%20upgraded.meta.js
// ==/UserScript==

// DON'T MESS WITH THIS IF YOU DON'T KNOW WHAT YOU ARE DOING

var ok = true

// dodanie wiersza offset nic nie zmienione
window.offsetTr = document.createElement('tr')
window.offsetTd = document.createElement('td')
var arrTimeNow = document.getElementById('date_arrival')
window.offsetTr.appendChild(window.offsetTd) // Append td to tr
arrTimeNow.parentNode.parentNode.insertBefore(window.offsetTr, arrTimeNow.parentNode[1])




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
var abc = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate())).slice(-2) + 'T' + ('0' + (date.getHours())).slice(-2) + ':' + ('0' + (date.getMinutes())).slice(-2) + ':' + ('0' + (date.getSeconds())).slice(-2) + '.' + (date.getUTCMilliseconds())
console.log("czy to to "+abc)
var nowa_localdatetime = new Date(date)
console.log(nowa_localdatetime)

// i przypisanie
//inputTime.value = abc
//inputTime.value = nowa_localdatetime.format().substring(0,19)+'.000'



var divBox =  document.createElement('div');
divBox.setAttribute('id','div_time');

inputTime.setAttribute('style', 'margin-top:10px;font-size:22px;')
parentInput.appendChild(divBox, parentInput.nextElementSibling)
$("#div_time").append('<input type="date" id="input_date"><input type="time" id="input_time" step="1"><input type="number" step ="1" min="1" value="" id="input_ms">')
setTimeout(()=>{
$("#input_date").val(formatDate(nowa_localdatetime))
$("#input_time").val(getTimeFromDate(nowa_localdatetime))
},500)

window.setArrTimeTr = document.createElement('tr')
window.setArrTimeTd = document.createElement('td')
var offset = Timing.offset_to_server
$("#inputTime").closest('tbody').append('<tr><td>Server delay: ' + Timing.offset_to_server + '</td></tr>')

btn.onclick = function () {
  'use strict'

  var delayTime = Timing.offset_to_server; // pobieranie offsetu może być przydatne ?
  var intervalTime = 10 // Set interval in ms

  var arrTimeNow = document.getElementById('date_arrival')

  var arrivalTime = $('#input_date').val()+' '+$('#input_time').val(); // pobranie wartości z inputa np:  arrivalTime = "2019-12-06T16:23:03.917"

  var readarival = Math.floor(Timing.getCurrentServerTime()) + parseInt(Timing.tickHandlers.forwardTimers._timers[0][0].dataset.duration)*1000
  var test = new Date(arrivalTime)
  a = $("#input_ms").val() | 1;
  var milliseconds_wait = parseInt(a)
  test.setMilliseconds(0)

  window.setArrTimeTd.setAttribute('colspan', '2')
  window.setArrTimeTd.setAttribute('id', 'setArrTime')

  console.log(new Date(1000))

  var a = $('.troop_confirm_go').filter((i,e) => $(e).css('display') !== 'none')[0]

  $("#input_date").closest('tbody').append('<tr><td>Set! Have fun :) </td></tr>')
  $("#arrTime").remove()
  $("#input_date").prop('disabled',true)
  $("#input_time").prop('disabled',true)
  $("#input_ms").prop('disabled',true)

  var run = setInterval(function retime () {
    readarival = new Date(Math.floor(Timing.getCurrentServerTime()) + parseInt(Timing.tickHandlers.forwardTimers._timers[0][0].dataset.duration)*1000)
    readarival.setMilliseconds(0)

    //if (readarival < test) {console.log('nie')}
    //if (readarival >= test) {console.log('tak')}

    if (readarival >= test) {
      setTimeout(function () {
          if (ok) a.click()
          ok = false
        clearInterval(run)
      }, milliseconds_wait+49)
    }
  }, 1)
}





function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}



function getTimeFromDate(date) {
    var d = new Date(date);
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    if (hours < 10 ) hours = "0"+hours
    if (minutes < 10 ) minutes = "0"+minutes
    if (seconds < 10 ) seconds = "0"+seconds
    return hours+":"+minutes+":"+seconds
}








