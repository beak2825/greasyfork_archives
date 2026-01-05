// ==UserScript==
// @name        HelloBank enhancements
// @namespace   camelsoft
// @description Miglioramenti a banking.hellobank.it
// @include     https://banking.hellobank.it/it/home*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAwFBMVEUAlbgAgqsRg6gAiKsAi64CjrEAk7UQkbUAmLsAnbkpk7ErlLIAorcEob0emrcenrUSpMAAqsUAr8okqMIAtMgAtc8Av9IXuc4Aw9dMsMkhvdFEtcwNxtoAzN87vdMAzuBPu9BKwNAwyddPxNRFyNiEusU6z91Lzdx+v9FsxtpyxdOavcZ2yteCy9py0NyA0+F51uF13OWE3OJ/3emm5em37fPf5ObH8fLQ8fTm7O7X8PXm8/Th9vXq9/j0+fz+//zmPYTTAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfhBBMJFDZIJUV1AAABXUlEQVQ4y4WT61LCMBBG1yqXQlvbUmgpDLdy844gIijs+7+V324AnVHj+ZEvuzmzk8lMiIgWefIr+YKULOv/QZbJ+ahvYUS07FtZ0bRrZUrdf8AV7VBLSDwv1U0r9bxE0vM80zDCM/PM1DPmJSI/8PtRyFMgQqqIIAlB65w0FmdhzLz6LqSUNgGEcVOBsEQkB/5IpE5IXx1CYd6/gCCJCU1tUBKDRwix0mN+ksQE06D4KAyulQGEKI4jTIiMEAkQtq/KVgSwh6CchS9UOPCucRRCcM/8tlY2EKQDIVQo9AGEganlktKBIOGH5J8E3fgd5geEu968mAa5ggi6cUWQFEkhNwC3zJ1AEUFycjfR2qWgCm4gVBURJPe80zqgoAwwoV1W2hAkIZgG6dooCt/UblE0JIfD3kkoWalQzS6UKLiyEtD80sqcqOZYqMnnrPx9XjHfe153Ln7iOHXMp0/QJVvdEQQalwAAAABJRU5ErkJggg==
// @version     1.1.6
// @grant       none
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/28241/HelloBank%20enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/28241/HelloBank%20enhancements.meta.js
// ==/UserScript==

// NB: queste due direttive non servono perche' c'e' gia' jQuery e sembra funzionare senza problemi
// require     http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
//jQuery.noConflict();

(function ($) { $(function () {
// -----------------------------------------------------------------------------
window.ads = $('.ls-row.footer').hide();

// sposta in basso il top banner
$('.ls-area.hellobank-content .ls-cmp-wrap.ls-1st').prependTo(window.ads);

// ridimensiona bilancio
$('iframe[src*=Financial]').on('load', function () {
  $(this).contents().
    find('.financial-state .title-wrapper').hide().
    next('.scroller-wrapper').css('margin', 'auto').css('float', 'none').
    find('.block-container').css('width', '100%');
  $(this).contents().find('div.financial-block.bilancio').css('width', '10em').css('visibility', 'hidden');
  $(this).contents().find('div.cf > div.scroller-wrapper, #financialscroller').css('width', '100%');
});

(function hide_footer () {
  if ($('#footer-container').length != 0)
    $('#footer-container').hide(); // nascondi footer
  else
    setTimeout(hide_footer, 500);
})();//hide_footer

$('.hellobank-header-row').hide(); // nascondi header

// crea menu piu' semplice
$('<style>#fixed-menu a:hover { background-color: #ccc; border-radius: 0.25rem; } #fixed-menu li.selected { background-color: #ccc; } </style>').appendTo('html > head');
var menu_top = parseInt($('iframe[src*=Financial]').height()),
    stili = 'position: fixed; top: '+menu_top+'px; left: 0; border: 1px solid black; padding: 0.2rem; font-size: x-small; text-transform: capitalize; line-height: 1.5rem;',
    menu  = $('<div id="fixed-menu" style="'+stili+'"><ul></ul></div>').appendTo('body'),
    lista = $('<ul></ul>').appendTo(menu);
// cicla tra i riquadri
$('.tile.level0').hide().children('a').each(function () {
  var link = $(this);
  
  var label = link.text().trim().replace(/Le mie|I miei/, '');
  if (label.match(/trading|investimenti|Saving|PAY|Store|Bilancio/)) return;
  if (label.match(/profilo/)) label = 'Profilo/Docs';
  if (label.match(/Mutui/  )) label = 'Mutui/Prestiti';
  
  $('<a href="#" class="linked">'+label+'</a>').data('link', link).appendTo(lista).wrap('<li></li>');
});

// click onclick sulle voci di menu reali
$('#fixed-menu').on('click', 'a.linked', function (ev) {
  ev.preventDefault();
  $('#fixed-menu li').removeClass('selected');
  $(this).parent().addClass('selected');
  $(this).data('link').click();
});

// links per: num messagi non letti, logout, toggle ADS
$('iframe[src*=WelcomeBox]').on('load', function () {
  var frame_wb = $(this).contents();
  
  // aggiunta link msg non letti
  var msg_unread = frame_wb.find('.notify-box.mail span').text().trim();
  lista.append('<li><hr style="margin: 0.2rem 0; border: 0; background-color: black;"></li>')
  $('<a href="#" class="linked"><b>'+msg_unread+'</b> unread msg</a>').
    data('link', menu.find('a:contains(messaggi)').parent().hide().end()).
    appendTo(lista).wrap('<li></li>');
  
  // link toggle ADS
  $('<li><a href="#" onclick="window.ads.toggle(); return false;">Toggle ADS</a></li>').appendTo(lista);
  
  // link per il logout
  $('<li><a href="'+this.contentWindow.logoutUrl+'">Logout</a></li>').appendTo(lista);
});
// -----------------------------------------------------------------------------
});})(jQuery);
