// ==UserScript==
// @name      MH - Show Trains
// @author    Giuseppe Di Sciacca (Improved by Hazado)
// @version   1.002
// @description Shows you the upcoming train schedule even when your on the train. Originally found at http://mhutilitiesbyshk.altervista.org/scripts.php
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @include     http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @namespace https://greasyfork.org/users/149039
// @downloadURL https://update.greasyfork.org/scripts/399551/MH%20-%20Show%20Trains.user.js
// @updateURL https://update.greasyfork.org/scripts/399551/MH%20-%20Show%20Trains.meta.js
// ==/UserScript==

if(user.environment_name=='Gnawnian Express Station') {
  window.setInterval(function(){
    if(jQuery('#hudLocationContent .trainStationHUD').is(':visible'))
      return;
    else
      jQuery('#hudLocationContent .trainStationHUD').show();
  },1000);
  showMHTrains();
}

// the guts of this userscript
function showMHTrains() {
    //add css
    var TrainCss = document.createElement( 'style' );
    TrainCss.type = 'text/css';
    TrainCss.id = 'MHTrainScriptCss';
    TrainCss.innerHTML = "#toggleTrainHUD{cursor:pointer;position:absolute;top:5px;left:17px;font-size:10px;letter-spacing:normal;border:0;background-color:#FFF;border-radius:3px;box-shadow:-3px 3px 3px rgb(0, 0, 0);padding:3px 8px;}#TrainHUDToResize.hiddenTrainHUD{height:30px;}";
    document.head.appendChild(TrainCss);
    jQuery('.trainStationHUD .pendingTrainContainer')[0].hidden=true;

    //add show/hide button
    jQuery('.trainStationHUD .trainStationBar .trainTitle').parent().parent().attr('id','TrainHUDToResize');
    jQuery('#TrainHUDToResize').addClass('hiddenTrainHUD');

    jQuery('#hudLocationContent .trainStationHUD').removeClass('hidden').slideDown(function(){
        //add button to reduce HUD
        jQuery('.trainStationHUD .trainStationBar .trainTitle').append('<button id="toggleTrainHUD">Show/Hide HUD</button>');
        jQuery(document).on('click','#toggleTrainHUD',function(){
            if(jQuery('#TrainHUDToResize').hasClass('hiddenTrainHUD')) {
                jQuery('#TrainHUDToResize').removeClass('hiddenTrainHUD');
                jQuery('.trainStationHUD .pendingTrainContainer')[0].hidden=false;
            }
            else{
                jQuery('#TrainHUDToResize').addClass('hiddenTrainHUD');
                jQuery('.trainStationHUD .pendingTrainContainer')[0].hidden=true;
            }
        });
    });
    jQuery(document).on('click','.refreshTrains.trainButton',function(){
      refreshTrains();
    });
}

function refreshTrains() {
  var interval=window.setInterval(function(){
    if(!jQuery('#hudLocationContent .trainStationHUD').is(':visible')){
        window.clearInterval(interval);
        jQuery('#hudLocationContent .trainStationHUD').show();
        //this is function trainStationUpdatePendingTrains()
        jQuery('#hudLocationContent .trainStationHUD .countDown').each(function(index, element) {
            var trainDepartsInTimestamp = new Date(jQuery(element).data('end'));
            var startsInString = '';
            var secondsRemaining = trainDepartsInTimestamp - new Date().getTime();
            secondsRemaining = (secondsRemaining > 0) ? Math.ceil(secondsRemaining / 1000) : 0;
            var mins = Math.floor(secondsRemaining / 60) % 60;
            var hours = Math.floor(secondsRemaining / 3600);
            var seconds = secondsRemaining % 60;
            if (mins == 0 && hours == 0) {
                if (secondsRemaining > 0) {
                    startsInString = secondsRemaining + ' secs.';
                }
                else {
                    startsInString = 'Departing...';
                }
            }
            else {
                if (hours) {
                    startsInString += hours + ' hr ';
                }
                startsInString += mins + ' mins';
                if (hours == 0 && mins < 5) {
                    startsInString += ' ' + seconds + ' secs';
                }
            }
            jQuery(element).text(startsInString);
        });//end of function
    }
  },100);
}