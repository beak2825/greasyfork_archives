// ==UserScript==
// @name            The West - Sectors Name
// @name:it         The West - Sectors Name
// @name:pl         The West - Sectors Name
// @description     Show name of the sectors during fort battle
// @description:it  Visualizza nome settori battaglia
// @description:pl  Dodaje opcje pokazania numeracji sektorów podczas bitwy o fort
// @namespace       Esperiano
// @author	        Esperiano
// @include         http*://*.the-west.*/game.php*
// @version         0.0.8.5
// @exclude         http*://www.the-west.*
// @exclude         http*://forum.the-west.*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/38043/The%20West%20-%20Sectors%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/38043/The%20West%20-%20Sectors%20Name.meta.js
// ==/UserScript==
TWNS_inject = function(){

    if (document.getElementById('TWNS_js'))
    { alert("Script già installato"); return; }
    var TWNSjs = document.createElement('script');
    TWNSjs.setAttribute('type', 'text/javascript');
    TWNSjs.setAttribute('language', 'javascript');
    TWNSjs.setAttribute('id', 'TWNS_js');
    TWNSjs.innerHTML = "("+(function(){
        /*inizio corpo script*/

        var TWNS_api = TheWestApi.register('tw-namesector', 'TW - Sectors Name', '2.120', Game.version.toString(), 'Esperiano [aka Neper]');
        TWNS_api.setGui('Show name of the sectors during fort battle');
        var datafort= {};


        $('#windows').on('DOMNodeInserted', function(e) {
            var element = e.target;

            if($(element).is("div[class*='fortbattle-']")) {
                var NSfortID, NSfortType, NSman;
                NSfortID = $.grep(element.className.split(" "), function(v, i){
                    return v.indexOf('fortbattle-') === 0;
                }).join();
                NSman=NSfortID=NSfortID.split("-")[1];
                if (NSfortID.startsWith("m")) {NSfortID=NSfortID.substr(1);}   //manovra
                if (!datafort[NSfortID]){
                    Ajax.remoteCallMode('fort', 'display', {
                        fortid: NSfortID,
                    }, function (data) {
                        var fD = data.data;
                        datafort[NSfortID] = fD.type;
                    });}else{NSfortType=datafort[NSfortID];}

                setTimeout(function(){
                    var NSurl;
                    var NSlang = Game.locale.substr(0, 2);
                    switch (datafort[NSfortID]) {
                        case 0: //PICCOLO
                            if(NSlang=='it') NSurl='https://i.imgur.com/I0jYDmE.png';
                            else if(NSlang=='el') NSurl='https://i.imgur.com/hZ0Uj94.png';
                            else if(NSlang=='de') NSurl='https://i.imgur.com/9kJefxr.png';
                            else if(NSlang=='pl') NSurl='https://i.imgur.com/pibDbhH.png';
                            else if(NSlang=='nl') NSurl='https://i.imgur.com/0h9nVxs.png';
                            else NSurl='https://media.innogamescdn.com/com_WEST_IT/ImmaginiScriptEsterni/small.png';
                            break;
                        case 2: //GRANDE
                            if(NSlang=='it') NSurl='https://i.imgur.com/Ew64LA6.png';
                            else if(NSlang=='el') NSurl='https://i.imgur.com/mEwNxX7.png';
                            else if(NSlang=='de') NSurl='https://i.imgur.com/dUInJCT.png';
                            else if(NSlang=='pl') NSurl='https://i.imgur.com/Jww2I4G.png';
                            else if(NSlang=='nl') NSurl='https://i.imgur.com/xxYGZ0E.png';
                            else NSurl='https://media.innogamescdn.com/com_WEST_IT/ImmaginiScriptEsterni/big.png';
                            break;
                        default: //MEDIO
                            if(NSlang=='it') NSurl='https://i.imgur.com/nzAWZT2.png';
                            else if(NSlang=='el') NSurl='https://i.imgur.com/epgDjXR.png';
                            else if(NSlang=='de') NSurl='https://i.imgur.com/Cw1z1JC.png';
                            else if(NSlang=='pl') NSurl='https://i.imgur.com/dxLWoGr.png';
                            else if(NSlang=='nl') NSurl='https://i.imgur.com/qDspvL9.png';
                            else NSurl='https://media.innogamescdn.com/com_WEST_IT/ImmaginiScriptEsterni/medium.png';
                    }
                    if((!$('#NSectors'+NSman).length)&&($('.fortbattle-'+NSman+' .fort_battle_buttons').length)) $('.fortbattle-'+NSman+' .tw2gui_window_content_pane').append('<div id="NSectors'+NSman+'" class="fort_battle_battleground" style="background-image: url(&quot;'+NSurl+'&quot;); z-index: 1;pointer-events: none"></div>');
                    if(!$('.fortbattle-'+NSman+' .fort_NS').length) $('.fortbattle-'+NSman+' .fort_battle_buttons').append('<div class="fort_battle_button fort_NS" style="left: 105px;" onclick="javascript:$(\'#NSectors'+NSman+'\').toggle();"></div>');

                }, 2000);
            }
        });
        /*fine corpo script*/
    }
                           ).toString()+")();";
    document.body.appendChild(TWNSjs);
};

if (location.href.indexOf(".the-west.") != -1 && location.href.indexOf("game.php") != -1)
    setTimeout(TWNS_inject, 2000, false);
