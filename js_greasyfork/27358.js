// ==UserScript==
// @name        Raporty spalania
// @namespace   raporty-spalania
// @include     *://www.otomoto.pl/oferta/*
// @version     1.1
// @grant       none
// @description Raporty spalania otomoto
// @downloadURL https://update.greasyfork.org/scripts/27358/Raporty%20spalania.user.js
// @updateURL https://update.greasyfork.org/scripts/27358/Raporty%20spalania.meta.js
// ==/UserScript==

if ($('body').find('#GMburningOfFuel').length <= 0) {
    $('body .offer-features').after('<div id="GMburningOfFuel"></div>');
    
    $('#GMburningOfFuel').css({
        borderTop: '1px solid #eee',
        clear: 'both',
        color: '#333',
        fontSize: '15px',
        lineHeight: '23px',
        padding: '40px 0',
    });
}

var marka = $('#parameters').find('li').filter(function() {
    return $(this).text().replace(/\s/g,'').startsWith('Marka');
}).find('a').text().replace(/^\s+|\s+$/g,'').replace(/\s/g,'-').toLowerCase();

var model = $('#parameters').find('li').filter(function() {
    return $(this).text().replace(/\s/g,'').startsWith('Model');
}).find('a').text().replace(/^\s+|\s+$/g,'').replace(/\s/g,'-').toLowerCase();

var wersja = $('#parameters').find('li').filter(function() {
    return $(this).text().replace(/\s/g,'').startsWith('Wersja');
}).find('a').text().replace(/^\s+|\s+$/g,'').toLowerCase().replace(/ *\([^)]*\) */g, "");

var paliwo = $('#parameters').find('li').filter(function() {
    return $(this).text().replace(/\s/g,'').startsWith('Rodzaj');
}).find('a').text().replace(/\s/g,'').toLowerCase();

var pojemnosc = $('#parameters').find('li').filter(function() {
    return $(this).text().replace(/\s/g,'').startsWith('Pojemność');
}).find('div').text().replace(/\s/g,'').toLowerCase();

var moc = $('#parameters').find('li').filter(function() {
    return $(this).text().replace(/\s/g,'').startsWith('Moc');
}).find('div').text().replace(/\s/g,'').toLowerCase();

var typ = $('#parameters').find('li').filter(function() {
    return $(this).text().replace(/\s/g,'').startsWith('Typ');
}).find('a').text().replace(/\s/g,'').toLowerCase();

$.ajax({
    url: '//dapi.net.pl/projekty/spalanie.php?url=http://www.autocentrum.pl/spalanie/' + marka + '/' + model + '/' + wersja + (typ ? ('/' + typ) : '') + '/&petrol=' + paliwo + '&engineCapacity=' + pojemnosc + '&power=' + moc
}).done(function(resp) {
    body = resp;
    
    $('body').find('#GMburningOfFuel').html(body);
    
    var power = $('#GMpower').val(),
        engineCapacity = $('#GMengineCapacity').val(),
        minEngineCapacity = $('#GMminEngineCapacity').val(),
        maxEngineCapacity = $('#GMmaxEngineCapacity').val(),
        canonical = $('#GMcanonical').val();
    
    $('#GMburningOfFuel').find('.ste-row').each(function() {
        if ((power === '' || $(this).text().indexOf(power) !== -1)
           && (engineCapacity == 0
              || $(this).text().indexOf(engineCapacity) !== -1 
              || $(this).text().indexOf(minEngineCapacity) !== -1
              || $(this).text().indexOf(maxEngineCapacity) !== -1 )
            && ((power !== '' || engineCapacity != 0))) {
            
            $(this).attr('data-matched', true);
        } else {
            $(this).attr('data-matched', false);
        }
    });
    
    $('#GMburningOfFuel .sa-table-engines').each(function() {
        if ($(this).find('[data-matched=true]').length > 0) {
            $(this).find('[data-matched=false]').css({ display: 'none' });
        } else {
            $(this).css({ display: 'none' });
            $(this).prev('h4').css({ display: 'none' });
        }
    });
    
    
    $('#GMburningOfFuel').append('<a href="' + canonical + '" target="_BLANK" style="margin-top: 50px; display: block;" class="gm-see-more">Zobacz raporty spalania dla pozostałych silników (otworzy się w nowej karcie)</a>');
});