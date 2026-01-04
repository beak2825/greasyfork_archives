// ==UserScript==
// @name         FUT 18 APP
// @namespace    SY
// @version      0.5
// @description  try to take over the world!
// @author       SY
// @match        https://www.easports.com/fifa/ultimate-team/web-app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33410/FUT%2018%20APP.user.js
// @updateURL https://update.greasyfork.org/scripts/33410/FUT%2018%20APP.meta.js
// ==/UserScript==


// FLECHE HAUT et FLECHE BAS


(function() {
    'use strict';

    // MARCHE PO : Lorsqu'on bouge un prix, ça clique sur RECHERCHE automatiquement après
    var ConfigAutoSearch = false;

    console.log('STARTING SCRIPT');

    function augmentePrix(oldVal)
    {
        if (oldVal == "") oldVal = '100';
        oldVal = getPrix(oldVal);
        var range = getRange(oldVal);

        return (oldVal + range);
    }

    function baisserPrix(oldVal)
    {
        if (oldVal == "") oldVal = '100';

        oldVal = getPrix(oldVal);
        var range = getRange(oldVal);

        return (oldVal - range);
    }

    function getRange(oldVal)
    {
        oldVal = parseInt(oldVal);
        var range = 50;

        if (oldVal < 1000)
        {
            range = 50;
        }
        else if (oldVal < 10000)
        {
          range = 100;
        }
        else if (oldVal < 50000)
        {
         range = 250;
        }
        else
        {
            range = 500;
        }

        return range;
    }

    function getPrix(val)
    {
        val = val.replace(/\s+/g, '');
        val = parseInt(val);
        return val;
    }
    function searchPlayer(index)
    {

    }

    function removeShield()
    {
        // $('#ClickShield').remove();
        // $('.popupClickShield').remove();
    }


    function submitRecherche()
    {
        console.log('CLICK');
        var button = $('.mobileButtons.buttonContainer .call-to-action').get(0);
        callClickEvent2(button);
        callClickEvent(button);
        callClickEvent3(button);
    }

    // # https://stackoverflow.com/questions/7457603/simulate-human-click-in-javascript
    function callClickEvent(element){
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", true, true);
        element.dispatchEvent(evt);
    }

    function callClickEvent2(element){
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window,
                           0, 0, 0, 0, 0, false, false, false, false, 0, null);
        element.dispatchEvent(evt);
    }

    function callClickEvent3(element){
        $(element).focus().trigger('click');
    }
    // # https://stackoverflow.com/questions/7457603/simulate-human-click-in-javascript


    function upInputFocus()
    {
        var input = $(':focus');
        var oldVal = input.val();
        var newVal = augmentePrix(oldVal);
       input.trigger('focus').val(newVal).addClass('filled').trigger('change');
    }

    function downInputFocus()
    {
        var input = $(':focus');
        var oldVal = input.val();
        var newVal = baisserPrix(oldVal);
       input.trigger('focus').val(newVal).addClass('filled').trigger('change');
    }

    function buttonBack()
    {
        NavManager.requestGoBackScreen();
    }

    function searchButtonClicked()
    {
        if ($('.QuickListPanel').length > 0)
        {
            setPrixDepart();
        }
        else
        {
            NavManager.getCurrentScreen()._controller.onSearchButtonClicked();
        }
    }

    function setPrixDepart()
    {
        var inputDepart = $('.panelActions .bidSpinner:eq(0)');
        console.log(inputDepart);
        var inputImmediat = $('.panelActions .bidSpinner:eq(1)');
        console.log(inputImmediat);
        console.log(inputImmediat.val());
    }

    $(window).keydown(function(event) {
        if (event.which == 38) upInputFocus();
        else if (event.which == 40) downInputFocus();
        else if (event.which == 37) buttonBack();
        else if (event.which == 39) searchButtonClicked();
    });
})();