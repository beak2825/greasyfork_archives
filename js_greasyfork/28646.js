// ==UserScript==
// @name         RN Post Helper
// @namespace    https://greasyfork.org/en/users/49275
// @version      2.2
// @description  Makes a magic button to fix common problems.
// @author       buttlust
// @match        https://transcribe.racenote.com/recordings/*/postprocess?*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/28646/RN%20Post%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/28646/RN%20Post%20Helper.meta.js
// ==/UserScript==

// This script adds a magic button that helps with grammar and junk for the RN post process
// Highlight or message c.ander with changes or fixes or ideas to improve this script

//Crew names
var names = [
    ' clint ',
    ' kurt ',
    ' brad ',
    ' larson ',
    ' brett ',
    ' denny ',
    ' kevin ',
    ' harvick ',
    ' jamie ',
    ' matt ',
    ' paul ',
    ' joey ',
    ' todd ',
    ' greg ',
    ' chad ',
    ' rodney ',
    ' jason ',
    ' cole ',
    ' nick ',
    ' billy ',
    ' luke ',
    ' keith ',
    ' roman ',
    ' mike ',
    ' alan ',
    ' slugger ',
    ' adam ',
    ' aj ',
    ' aric ',
    ' trevor ',
    ' ryan ',
    ' chris ',
    ' kyle ',
    ' chase ',
    ' kasey ',
    ' martin ',
    ' ricky ',
    ' daniel ',
    ' jamie ',
    ' erik ',
    ' jimmie ',
    ' dale ',
    ' austin ',
    ' josh ',
    ' tony ',
    ' tj ',
    ' derek ',
    ' justin ',
    ' brandon ',
    ' clayton ',
    ' richard ',
    ' tim ',
    ' jeremy '
];

//Misc fixes (must be in pairs)
var fixes = [
    ' i ',' I ',
    ' i\'',' I\'',
    'I am','I\'m',
    'I\'ma','I\'m',
    'was not','wasn\'t',
    'you are','you\'re',
    'did not','didn\'t',
    'do not','don\'t',
    '10-4 ','10-4, ',
    'yeah ','yeah, ',
    'tulus','too loose',
    'kayoed','K.O.\'d',
    'feel switch','fuel switch',
    ' till ',' until ',
    'laptime','lap time',
    'cannot', 'can\'t',
    'mick murray','McMurray',
    'pay it','pit',
    'time bye','time by',
    'scott a problem','\'s got a problem',
    'centre','center',
    'costumes','cautions',
    'alright bud ','alright bud, ',
    'will be alright','we\'ll be alright',
    'alright but we','Alright, bud. We',
    'lab','lap',
    'breaks','brakes',
    'down word','downward',
    ' awhile ',' a while ',
    'goodnough','good enough',
    'curt','Kurt',
    ' pets ',' pits ',
    'remarq','at your mark',
    'pittser','pits are',
    'feel lonely','fuel only',
    ' pet ',' pit ',
    'senderoff','center off',
    'pit pit','pit, pit',
    'bidding','pitting',
    'rays','raise',
    'in fort','10-4',
    'loussier','looser',
    'for tires','four tires',
    'lockdown','lap down',
    'two go','to go',
    'jimmy','Jimmie',
    'rear \'s','rears',
    'lover','lever',
    ' \'s','\'s',
    'pensky','Penske',
    'debry','debris',
    'role in','rolling',
    'oclair','all clear',
    'cautiones','cautions',
    'gripper','grip or',
    'tiger this','tighter this',
    'toulouse','too loose',
    'pick this time','pit this time',
    ' coz ',' because ',
    'titof','tight off',
    'carbs','cars',
    'this guys','these guys',
    'fibrations','vibrations',
    'temperatures','temp',
    'danny','Denny',
    'tyersal','tires all',
    'gogogo','go, go, go',
    'drinker','drink or',
    'wheel pit','we\'ll pit',
    'beef and','bead fan',
    'big fan','bead fan',
    'monard','Menard',
    'helluva','hell of a',
    'roll cage','voltage',
    '\'cause','because',
    'compititive','competitive',
    'OK 10-4','OK, 10-4',
    'V H T','VHT',
    'R P M','RPM',
    'BHT','VHT',
    'ten ford','10-4,',
    'tip check','temp check',
    'five four three two one','five, four, three, two, one,',
    'three two one','three, two, one,',
    'therapy','there, P',
    'loosened','loose in',
    'breer','rear',
    'ploughing','plowing',
    'ploughs','plows',
    'around in the','a round in the',
    'client','Clint',
    'takrir garippo','take rear grip',
    'rear drip','rear grip',
    'terra','tear off',
    'nachtomi','knocked me',
    'buga','Bugga',
    'denford','10-4,',
    'tapyr','tape here',
    'crib','grip',
    'truck bar','track bar',
    'pick here','pit here',
    'enenche','one inch',
    'freiras','freer as',
    'lucin','loose in',
    'titan','tight in',
    ' uh ',' ',
    ' wise ','-wise ',
    'balance wise','balance-wise',
    ' man ',' man, ',
    'US','us',
    'friauf','free off',
    'can hear','can here',
    'yyler','your',
    'interliner','inner liner',
    'real good','real good,',
    'friend turn','front turn',
    'truck barware','track bar where',
    'griffin','grip in',
    'B four','It\'ll be four',
    'painted','pitted'
];

var textbox = 'textarea#uterance_transcription';

(function() {
    //    $(document).ready(function() {
    /* Select driver instead of unknown by default
        // Messes up "Previous" selection, so not enabled by default
        if ( $( "section#speaker-types" ).length ) {
            $('a.speaker-type-button')[1].click();
        }
        */
    //Fix Stuff button
    $("textarea.form-control:first").before('<br /><input type="button" id="butts" value=" Fix Stuff "/>');
    $('input#butts').on('click',function(){
        //Misc fixes
        for (f = 0; f < fixes.length; f+=2) {
            $(textbox).val($(textbox).val().split(fixes[f]).join(fixes[(f+1)]));
        }
        //Fix names
        for (i = 0; i < names.length; i++) {
            var propername = (names[i].substr(0,2).toUpperCase()+names[i].substr(2));
            $(textbox).val($(textbox).val().split(names[i]).join(propername));
        }
        //Remove tags
        $(textbox).val($(textbox).val().split('<profanity>').join(''));
        $(textbox).val($(textbox).val().split('</profanity>').join(''));
        //Switch period to question mark if you clicked twice
        if ($(textbox).val().substr($(textbox).val().length-1) == '.' ) {
            $(textbox).val($(textbox).val().slice(0,-1));
            $(textbox).val($(textbox).val() + "?");
        }
        //Add period if there isn't punctuation already
        if ($(textbox).val().substr($(textbox).val().length-1) != '.' &&
            $(textbox).val().substr($(textbox).val().length-1) != '!' &&
            $(textbox).val().substr($(textbox).val().length-1) != '?' ) {
            $(textbox).val($(textbox).val() + ".");
        }
        //Capitalize first letter
        $(textbox).val($(textbox).val().substr(0,1).toUpperCase() +
                       $(textbox).val().substr(1));
    });
    /*
        //Bad Grip button
        $("section#metadata-editor.row").before('<br /><input type="button" id="badgrip" value=" Bad Grip "/>');
        $('input#badgrip').on('click',function(){
            $('span.metadata-button-name')[1].click();
            $('a.speaker-type-button')[1].click();
            $('#balance_feedback_grip_status>option:eq(2)').prop('selected', true);
        });
        */
    //    });
})();