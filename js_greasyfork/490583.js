// ==UserScript==
// @name        kinopoisk comments rating
// @namespace   https://github.com/qiwichupa/userscripts/blob/master/kinopoisk_comments_rating
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @include     https://www.kinopoisk.ru/film/*
// @include     https://www.kinopoisk.ru/series/*
// @run-at        document-idle
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @version     20240323.2501
// @author      qiwichupa
// @description Добавляет рейтинг, основанный на комментариях. Кликнуть на рейтинг для получения пользовательского.
// @license       CC BY-SA
// @downloadURL https://update.greasyfork.org/scripts/490583/kinopoisk%20comments%20rating.user.js
// @updateURL https://update.greasyfork.org/scripts/490583/kinopoisk%20comments%20rating.meta.js
// ==/UserScript==

function CountForm (number, titles) {
// https://gist.github.com/realmyst/1262561?permalink_comment_id=3443551#gistcomment-3443551
// CountForm(count, ['рубль', 'рубля', 'рублей']);
  number = Math.abs(number);
  if (Number.isInteger(number)) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
  }
  return titles[1];
}


function waitForKeyElements (
// https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}


waitForKeyElements('[id^=user-review]', function() {
  var ucommelements = $('[class^=styles_count__]');
  var index;
  var element;
  var ucommscore;
  var ucommpos;
  var ucommcons;
  var ucommneu;
  var ucommtotal;


  for (index = 0; index < ucommelements.length; index++) {
    element = $(ucommelements[index]);

    if (element.next().text()) {
      if (element.parent().next().text() === 'Положительные'){
        ucommpos = Number(element.text());
        //element.parent().next().text('test' + ucommpos);
      }
      if (element.parent().next().text() === 'Отрицательные'){
        ucommcons = Number(element.text());
        //element.parent().next().text('test' + ucommcons);
      }
      if (element.parent().next().text() === 'Нейтральные'){
        ucommneu = Number(element.text());
        //element.parent().next().text('test' + ucommneu);
      }
    } else {
      ucommtotal = Number(element.parent().text());
      //element.parent().text('test' + ucommtotal);
    }
  }

  if (!ucommpos){ucommpos=0;}
  if (!ucommcons){ucommcons=0;}
  if (!ucommneu){ucommneu=0;}

  if (ucommtotal > 1 ){
    ucommscore =  ((10*ucommpos  + 5*ucommneu + 1*ucommcons) / ucommtotal ).toFixed(1);
    commsform = CountForm(ucommtotal, ['комментария', 'комментариев', 'комментариев']);

    $('[class^=film-rating-value]').children('span').each(function() {
      var element = $(this);
      var currenttext = element.text();

      $(this).text(currenttext + ' (' + ucommscore +  ')');
      $(this).attr('title', ucommscore +  ' на основе ' + ucommtotal + ' ' + commsform);
    });
  }

});


$(document).ready(function(){
  $('[class^=film-rating-value]').children('span').each(function() {
    var element = $(this);
    var currenttext = element.text();
    $(this).attr("style", "text-decoration: underline dotted #33AAFF")
    $(this).attr('title', 'Нажмите для рейтинга комментариев');
    element.click(function(event) {
      $('html, body').animate({ scrollTop: $(document).height() - $(window).height() }, 600, function() {
        $(document).scrollTop(0);
      });
    });
  });
});
