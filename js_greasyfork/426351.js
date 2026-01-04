// ==UserScript==
// @name         Ekşi Sözlük sol frame filtrele
// @version      0.1
// @description  Ekşi Sözlük sol frame'deki başlıkları kelimeye göre filtreleme
// @author       nahtoderfahrung
// @match        *://eksisozluk.com*
// @icon         https://www.google.com/s2/favicons?domain=eksisozluk.com
// @require      https://greasyfork.org/scripts/395037-monkeyconfig-modern/code/MonkeyConfig%20Modern.js?version=764968
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @grant          GM_addStyle
// @namespace https://greasyfork.org/users/732201
// @downloadURL https://update.greasyfork.org/scripts/426351/Ek%C5%9Fi%20S%C3%B6zl%C3%BCk%20sol%20frame%20filtrele.user.js
// @updateURL https://update.greasyfork.org/scripts/426351/Ek%C5%9Fi%20S%C3%B6zl%C3%BCk%20sol%20frame%20filtrele.meta.js
// ==/UserScript==

(function() {
    'use strict';

var cfg = new MonkeyConfig({
    title: 'Filtreleme Ayarları',
    buttons: [ 'save', 'cancel' ],
    menuCommand: true,
    windowFeatures: { height:200 },
    params: {
        sansurlu_kelimeler: {
            label: 'Kelimeleri virgülle ayırın',
            type: 'text',
            long: true
        }
    }
});
    var sansur = cfg.get('sansurlu_kelimeler');
    sansur = sansur.split(",");
    sansur = $.map(sansur, $.trim);
    sansur = sansur.filter(function(e){return e});
         waitForKeyElements (
            "ul.topic-list.partial li"
            , sansurle
        );
 function sansurle(){
  $("ul.topic-list.partial li").each(function(k,v){
      var j = 0;
    for (j = 0; j<sansur.length; j++) {
      var str = $(this).text();
      var subRe = sansur[j].split("/");
      if (subRe[1] == null) subRe[1] = "i";
      var re = new RegExp(subRe[0], subRe[1]);
      var n = str.search(re);
      if (n>=0) {
        $(this).remove();
        //console.log("Başlık sol frame'den çıkarıldı: " + $(this).text());
      } // /if
    } // /for
  });
}
 function waitForKeyElements (
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

})();