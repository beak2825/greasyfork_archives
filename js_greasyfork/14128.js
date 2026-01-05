/* jshint -W100 */
// ==UserScript==
// @name  WB2010 Alert
// @author el nino
// @namespace el nino
// @description Ostrzeżenie przed materiał sponsorowanym WB2010
// @include *://www.skyscrapercity.com/showthread.php*
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @version 3.1.7
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/14128/WB2010%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/14128/WB2010%20Alert.meta.js
// ==/UserScript==

var pageTitle = $(document).find("title").text();

var cssStripesUserPanel = 'repeating-linear-gradient( 60deg,#E1E4F2, #E1E4F2 20px, rgba(255, 255, 0, 0.3) 70px, #E1E4F2 100px )';


var usersPaid =  ['WB2010', 'noRTH1212', 'White Tigger', 'Vergelf', 'rkrzeptowski',
    'wonsbelfer'
];
var usersTroll = [
    'markus1234', 'Koppel', 'FRED PERRY', 'Corrny', 'arafat11', 'adam81w', 'eland1',
    'Radzik21', 'Toxic83', 'LubiePiwo', 'Muczi', 'techno_impact', 'Maciek97',
    'grzesiaczek', 'Saczers', 'kowal 3D', 'pedro_kosz', 'Juszatek', 'UPR20', 'okupant',
    'panAeL', 'hehehehehe', 'toni...', 'HarryMiller', 'Michal_Rad', 'PiesNaKomuchow',
    'Prawdziwy', 'Rafadan', 'andyln', 'Balsen', 'alek کی', 'DjSzuli', 'ReneLacoste',
    'martinjohnson', 'Jaq', 'pozy', 'cia', 'djmakus', 'RustySword', 'Bartas2004',
    'aperist', 'SouthNH', 'begbie', 'yasiinbey1', 'Pablo84krk', 'Agusia',
    'Antalya', 'Art79', 'byob88', 'calab', 'davidss1', 'Dema Kowalenko', 'dj817',
    'filip.arndt', 'FloatingSzczecin', 'FOMOCO', 'GOUST', 'grzesbuk', 'kciuk', 'lexus400',
    'mapik', 'marc123', 'marcel28', 'michasa120', 'p1otr3k1712', 'Paxson5',
    'Piett', 'PiotrRP', 'piotrus81', 'pitq', 'Pomocnik majstra', 'Popiel', 'PPrezess',
    'radhel', 'rba555', 'Sloczu', 'smugler', 'Solicitor', 'wislaken', 'Zawrotygłowy',
    'Scizoid.Trans.Prog.', 'Langfuhr', 'M.Szafran', 'Maruni', 'Bastian.', 'Kapustka',
    '-Wanted-', 'preslav', 'łodzianin', 'bm34484', 'sądeczanin_pol', 'el.polako', 'zimaww',
    'gregry', 'kasztelan54', 'macieii', 'aperist', 'ciacho23', 'PanCerka2',
    'borkosiu', 'Bartek78',  'truhl', 'moionet', 'Monarchi', 'r9999', 'aliveinchains',
    'tentom', 'Shagohad', 'openal', 'vvi', 'TYCZYW', 'victorek', 'Fantomasas', '_No_Name_',
    'Jan Mocny', 'Łyczakowski',
    'michal.j', 'born_ejty_siks', 'smugler', 'TakiSobie', 'xsxxxxx', 'Aotearoa_',
    'kamiloo', 'Marek_Gda', 'Stiggy', 'kaktus', 'wessig', 'zew_2', 'zygzak', 'zork123', 
    'BSG', 'Spomasz', 'artur_js', 'dawid392', 'Chudy1210', 'Filimer', 'zchpit', 'Jasq'
];

var warningPaid = '<div style="float: left;"><strong>Uwaga:</strong> Poniższy post może zwierać materiał sponsorowany!</div>';
var colorLightPaid = 'rgba(112,32,31,0.3)';
var colorDarkPaid = 'rgba(112,32,31,1)';

var warningTroll = '<div style="float: left;"><strong>Uwaga:</strong> Poniższy post może zawierać materiał specjalnego traktowania!</div>';
var colorLightTroll = 'rgba(51,0,102,0.3)';
var colorDarkTroll = 'rgba(51,0,102,1)';


//Dodajemy komunikat we wszystkich wątkach z tagiem polityka
if ($('#tag_list_cell > a:contains("polityka")').length > 0) {
    markUsers();
}
//Dodajemy w wątku o CPL
if(pageTitle.indexOf('Centralny Port Lotniczy') !== -1){ 
    markUsers();
}

function markUsers() {
    $(".tborder").css('background', 'none');
    $(".bigusername").each(function() {
        var tableId = '#' + $(this).closest('table').attr('id');
        if(jQuery.inArray($(this).text(), usersTroll) !== -1) addNotification(tableId, 'troll');
        else if(jQuery.inArray($(this).text(), usersPaid) !== -1) addNotification(tableId, 'paid');
    });
}

function addNotification(tableId, source) {
    var warning = source == 'troll' ? warningTroll : warningPaid;
    var colorLight = source == 'troll' ? colorLightTroll: colorLightPaid;
    var colorDark = source == 'troll' ? colorDarkTroll: colorDarkPaid;

    $(tableId).css({'border-color' : colorDark});
    $(tableId).children('tbody').children('tr:first').children('td:nth-child(2)').prepend(warning);
    $(tableId).find(".thead").css({'background-color': colorDark, 'background-image': 'none'});
    $(tableId).children('tbody').children("tr:nth-child(2)").children("td:nth-child(1)").css({'background-color': colorLight});
    $(tableId).children('tbody').children("tr:nth-child(3)").children("td:nth-child(1)").css({'background-color': colorLight});
}