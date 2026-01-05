// ==UserScript==
// @name         TW Event
// @namespace    ILLEGAL
// @version      1.0
// @description  External links on tw village view
// @author       GamateKID
// @include      http*://gr*.fyletikesmaxes.gr/game.php?*screen=event_royalty*
// @icon         https://dsgr.innogamescdn.com/8.74/32409/graphic/events/easter2014/logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27665/TW%20Event.user.js
// @updateURL https://update.greasyfork.org/scripts/27665/TW%20Event.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var botBtn='<btn id="evtbt">ΑΥΤΟΜΑΤΟΣ ΠΙΛΟΤΟΣ : <span style="color:red">ΑΝΕΝΕΡΓΟΣ</span></btn>';

    $(botBtn).insertAfter($('.caves p'));
    
    $('#evtbt').css({
        'position':'relative',
        'display':'block',
        'z-index':'666',
        'width':' 926px',
        'border-radius':'10px',
        'border':'2px solid gray',
        'margin-bottom':'10px',
        'height':'50px',
        'background':'#333',
        'text-align':'center',
        'line-height':'50px',
        'font-size':'20px',
        'font-weight':'bold',
        'color':'aliceblue'
    });

    $('#evtbt').hover(function(){
        $(this).css('text-shadow','none!important');
    });

    jQuery.fn.exists = function(){ return this.length > 0; }

    function wait(ms){
        console.log('waiting ' + ms/1000+ 's...');
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
            end = new Date().getTime();
            /*   if((start-end)/2000===0){
                console.log('waiting '+ (start+ms-end)/1000+'s....');
            }*/
        }
    }
    function executeAsync(func) {
        setTimeout(func, 0);
    }
    
    $('<span id="switch"></span>').insertAfter($('#evtbt'));

    function setOn() {
        $('#evtbt').html('<btn id="evtbt">ΑΥΤΟΜΑΤΟΣ ΠΙΛΟΤΟΣ : <span style="color:green">ΕΝΕΡΓΟΣ</span></btn>');
    }
    function setOff() {
        $('#evtbt').html('<btn id="evtbt">ΑΥΤΟΜΑΤΟΣ ΠΙΛΟΤΟΣ : <span style="color:red">ΑΝΕΝΕΡΓΟΣ</span></btn>');
    }
    $('#switch').click(function(){
        setOn();
    });

var monstaz = {
    'Κενταυρος':'Δορατοφόρος',
    'Ελεφαντας':'Δορατοφόρος',
    'Μονοκερος':'Δορατοφόρος',
    'Δρακος':'Τσεκουρομάχος',
    'Βασιλισκος':'Τσεκουρομάχος',
    'Δαιμονιο':'Ελαφρύ ιππικό',
    'Καλικάντζαρος':'Ελαφρύ ιππικό',
    'Ορκ':'Ξιφομάχος',
    'Δεντροφύλακας':'Ξιφομάχος',
    'Γιγαντας':'Ξιφομάχος',
    'Μινοταυρος':'Ξιφομάχος'
};
    
    
    $('#evtbt').click(function(){

        console.log('Scanning');
        if($('td.cave-action a.btn.btn-confirm-yes').exists()){
            console.log('found: '+$('td.cave-action a.btn.btn-confirm-yes').length+':');
            wait(5000);
            var a_href = $('td.cave-action a.btn.btn-confirm-yes').first().attr('href');
            console.log($('td.cave-action a.btn.btn-confirm-yes').first().text+':'+a_href);
            $('td.cave-action a.btn.btn-confirm-yes').first().css('background','green');
            window.open(a_href,'_self');
        }else
        if($('td.cave-action a.btn.challenge').exists()){
            console.log('found: '+$('td.cave-action a.btn.challenge').length+':');
            var a_href = $('td.cave-action a.btn.challenge').eq(0).attr('href');
            console.log($('td.cave-action a.btn.challenge').eq(0).text+':'+a_href);
            console.log('wtf');
            $('td.cave-action a.btn.challenge').first().css('background','green');
            wait(5000);
            $('td.cave-action a.btn.challenge').first().click();
        }else{ 
            window.open('/game.php?screen=overview','_self');
        }
    });
    
    function getF(monstah) {
             return monstaz[monstah];
        
    }


})();