// ==UserScript==
// @name         TimeHelper
// @version      1.1.0
// @author       Ikzelf
// @include https://*.grepolis.com/game/*
// @exclude forum.*.grepolis.*/*
// @exclude wiki.*.grepolis.*/*
// @description  nerd timings
// @grant        none
// @namespace https://greasyfork.org/users/984383
// @downloadURL https://update.greasyfork.org/scripts/478742/TimeHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/478742/TimeHelper.meta.js
// ==/UserScript==

(function () {
    let box
    $(document).ajaxComplete(function (e, xhr, opt) {
      var url = opt.url.split('?'), action = ''
      if (typeof (url[1]) !== 'undefined' && typeof (url[1].split(/&/)[1]) !== 'undefined') {
        action = url[0].substr(5) + '/' + url[1].split(/&/)[1].substr(7)
      }
      switch (action) {
        case '/town_info/attack':
        case '/town_info/support':
          setTimeout(setSecondsTiming, 20)
      }
    })
  
    $.Observer(GameEvents.command.send_unit).subscribe(() => {
      if (!box) return
      const commandList = $('#toolbar_activity_commands_list .js-dropdown-item-list').children()
      if (commandList.length <= 0) return
  
      const movementId = commandList[0].attributes.id.value.split('_')[1]
      const movement = MM.getModels().MovementsUnits[movementId]
      
      const arrivalSeconds = Timestamp.toDate(movement.getArrivalAt()).getSeconds()
  
      // console.log('ArrivalSeconds: ', arrivalSeconds)
      const inputValue = $('div.button_wrapper > div:nth-child(1) > input:nth-child(1)').val()
      const desiredSecond = parseInt(inputValue)
  
      if (isNaN(desiredSecond)) return
      // console.log('DesiredSeconds: ', desiredSecond)
      if (arrivalSeconds === desiredSecond) {
        removeCancel()
      }
    })
  
    function removeCancel() {
      $('div.square:nth-child(3)').removeClass('remove')
    }
  
    function setSecondsTiming() {
      const textBox = '<div><input type="text" id="timehelperbox" name="timehelper" value="" size="3" class="timehelper town_info_input unit_input_ground" tabindex="36" onblur="DeprecatedHelper.parseToValidNumericValue(this)"></div>'
      if($('#timehelperbox').length > 0) return
      box = $('div.button_wrapper').prepend(textBox)
    }
  })()