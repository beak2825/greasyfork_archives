// ==UserScript==
// @name         NordeaVisa4Ever
// @version      0.4
// @description  Ser till att ditt Visa-kort hålls öppet för onlineköp kontinuerligt, glöm inte ställa in personnummer och personlig kod.
// @author       tregota
// @match        https://internetbanken.privat.nordea.se/*
// @match        https://www.nordea.se/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://code.jquery.com/jquery-latest.js
// @namespace    @tregota
// @downloadURL https://update.greasyfork.org/scripts/18430/NordeaVisa4Ever.user.js
// @updateURL https://update.greasyfork.org/scripts/18430/NordeaVisa4Ever.meta.js
// ==/UserScript==

var personnummer = 197001010000;
var personligkod = 0000;

var cardActivateInterval = 1000*60*50; // 50 minutes in milliseconds (time inbetween reactivations)
var checkInterval = 1000*60*20; // reload page every 20 minutes and check time left until next activation (heard somewhere that javascript timeouts are unreliable timekeepers.)

jQuery(function($)
{
    var lastActivation = GM_getValue('lastActivation');
    var path = window.location.pathname;
    
    if(path === '/nsp/login')
    {
        if($('#validation_error').length > 0)
        {
            alert('Du måste ställa in rätt inloggningsuppgifter i scriptet!')
            return;
        }
        
        if(($.now()-lastActivation) < cardActivateInterval)
        {
            var left = (cardActivateInterval-($.now()-lastActivation));
            var wait = checkInterval;
            if(wait > left)
            {
                wait = left+10000;
            }
            if(wait < 1) // probably unnecessary
            {
                wait = 1;
            }
            setTimeout(function()
            {
                window.location.href = 'https://internetbanken.privat.nordea.se/nsp/login';
            }, wait);
            window.setInterval(function()
            {
                $('#crisis_info').text(Math.round((cardActivateInterval-($.now()-lastActivation))/1000)+' seconds until reactivation.');
            }, 1000);
            return;
        }

        var easyLoginTab = $('a').filter(function(index) { return $(this).text() === "Förenklad inloggning"; });
        if(easyLoginTab.length > 0)
        {
            var current = easyLoginTab.parent().attr('id');
            if(current !== 'current')
            {
                window.location.href = easyLoginTab.attr('href');
                return;
            }
            else
            {
                $('input#personnummer').val(personnummer);
                $('input#personligkod').val(personligkod);
                
                setTimeout(function()
                {
                    $('input.button').click();
                }, 500);
                return;
            }
        }
        else // path still '/nsp/login' after login, just click 'Kort'
        {
            var kortLink = $('a').filter(function(index) { return $(this).text() === "Kort"; });
            if(kortLink.length > 0)
            {
                window.location.href = kortLink.attr('href');
                return;
            }
        }
    }
    else if(path === '/nsp/engine')
    {
        var oppnaLink = $('a').filter(function(index) { return $(this).text() === "Öppna och stänga kort"; });
        if(oppnaLink.length > 0)
        {
            var currentpage = oppnaLink.attr('id');
            if(currentpage !== 'currentpage')
            {
                window.location.href = oppnaLink.attr('href');
                return;
            }
            else
            {
                var andraButton = $('input[name="card_regions$go_to_card_regions_edit_page_command"]');
                if(andraButton.length > 0)
                {
                    
                    if(!lastActivation || ($.now()-lastActivation) >= cardActivateInterval)
                    {
                        andraButton.click();
                        return;
                    }
                    else
                    {
                        var logoutLink = $('a').filter(function(index) { return $(this).text().indexOf("Logga ut") >= 0 });
                        if(logoutLink.length > 0)
                        {
                            window.location.href = logoutLink.attr('href');
                            return;
                        }
                    }
                }
                var sparaButton = $('input[name="card_regions$save_card_regions_command"]');
                if(sparaButton.length > 0)
                {
                    var allaInternetKop = $('input[type=radio]').filter(function(index) { return $(this).parent().text().indexOf("Alla internetköp") >= 0 });
                    var endastSakra = $('input[type=radio]').filter(function(index) { return $(this).parent().text().indexOf("Endast säkra internetköp") >= 0 });
                    if(allaInternetKop.length > 0)
                    {
                        if(allaInternetKop.prop("checked"))
                        {
                            endastSakra.prop("checked", true);
                            sparaButton.click();
                        }
                        else
                        {
                            allaInternetKop.prop("checked", true);
                            GM_setValue('lastActivation', $.now());
                            sparaButton.click();
                        }
                        return;
                    }
                }
                
            }
        }
    }
    window.location.href = 'https://internetbanken.privat.nordea.se/nsp/login';
});
