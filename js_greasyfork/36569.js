// ==UserScript==
// @name         Honeybtc (Auto Click)
// @version      1.0
// @description  Haz clic en más de 20 anuncios de HoneyBTC rapidamente...
// @author       EpeniBot
// @match        http://honeybtc.com/*
// @match        https://honeybtc.com/*
// @grant        none
// @namespace    http://epeni.tk
// @downloadURL https://update.greasyfork.org/scripts/36569/Honeybtc%20%28Auto%20Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/36569/Honeybtc%20%28Auto%20Click%29.meta.js
// ==/UserScript==
(function() {
    if(window.location.href.indexOf("ads") > -1){
        setInterval( function() {
            if (document.hasFocus())
            {
                var o = $(".asd:not('.disabled_asd'):first");
                if($(".asd:not('.disabled_asd')").length > 0)
                {
                    o.addClass('disabled_asd');
                    var link = o.parent().attr('href');
                    console.log(link);
                    window.open(link);
                }
            }}, 1000);
    }
    else if(window.location.href.indexOf("adview.php") > -1)
    {
        $('#bitmedad').prepend('<a href="//moneybot24.com/" target="_blank""><img src="//goo.gl/ZsHNQs" height="100%"/></a>');
        setInterval( function(){
            if($('#desc').text() === 'Completed'){
                window.close();
            }
            else if($('#desc').text().trim() === 'You already clicked to this ad!'){
                window.close();
            }
        }, 1000);
    }
    else if(window.location.href.indexOf("account") > -1)
    {
        setInterval( function() {
            if($('.ticket').length > -1)
            {
                $('.ticket').click();
            }
        }, 3000);
    }
	document.getElementById('asd_tittle1').insertAdjacentHTML('beforebegin',
    '<br><div id="dicebot-container" class="tab-content tab-content-xs" style="border-style: solid;width: 728px;border-color: #D1D1D1;border-radius: 4px;border-style: solid;border-width: 1px; padding-bottom: 9px;padding-left: 9px;padding-right: 9px; margin-left: 118px; padding-top: 9px;display:block"> <div id="dicebotinnerwrap"> <div id="controlWrapper" style="Display:inline-block;"> <left><a href="https://epenibot.blogspot.com" target="new"><img src="https://i.imgur.com/KQeO6u7.gif" /></a> <div id="tipDude" style="Display:inline-block;"></div> </center></div> <div id="ulikey" style="Display:inline-block;"><font color="red"><b>Puedes agradecer  con un donativo:</b></font><br><strong>Uphold:</strong> @EpeniBot<br><strong>Bitcoin:</strong> 17H6asehjzGDFjDMaT2ATPdHyYzhPvmT3x<br><b>Litecoin:</b> LgVsW8CiVUH3f7xokKbBaAAkC2kcvM4WZx<br><b>Ethereum:</b> 0x32144d3455a9D525F7b657Bfa660680163859f70 <br><b>Bitcoin Cash:</b> 19WCazmR8c8RnxJpsb6zYgDt9iA6te7RU2 <br><b>Dash:</b> XggLJUcFq8wT67F2cT41FEtWUsX8wRMQVu</div> </div>');
})();

