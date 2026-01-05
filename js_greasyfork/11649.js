// ==UserScript==
// @name         BitFn's Better Deckbox Script
// @namespace    dlras.net
// @version      0.1
// @description  A better Deckbox.org experience.
// @author       Daniel Rasmussen
// @match        *://deckbox.org/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @require      http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/11649/BitFn%27s%20Better%20Deckbox%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/11649/BitFn%27s%20Better%20Deckbox%20Script.meta.js
// ==/UserScript==
 
$.noConflict();
     
function spriteToClass(spriteName, className, remove) {
    jQuery('li.submenu_entry.deck img.'+spriteName).each(function() {
        var $this = jQuery(this);
        var $li = $this.closest('li.submenu_entry.deck');
        if (remove) $this.remove();
        $li.addClass(className);
    });
}

function colorPrices($prices) {
 
    var getPrice = function($this) {
        return Number($this.text().replace(/[^0-9\.]+/g, ''));
    }
 
    var max = 0;
    var sum = 0;
    var count = 0;
 
    $prices.each(function() {
        var price = getPrice(jQuery(this));
        if (price === 0) return;
 
        count++;
        sum += price;
        if (price > max) max = price;
    });
    if (count === 0) return;
 
    var avg = sum / count;
 
    $prices.each(function() {
        var $this = jQuery(this);
        var price = getPrice($this);
        if (price === 0) return;
 
        $this.attr('data-title',$this.text());
        if (price < 1) {
            //$this.text(Math.round(price*100)+'¢');
            $this.text('¢');
            $this.addClass('muted');
        } else {
            $this.text('$'+Math.round(price));
        }
 
    });
}
 
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) return;
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
     
(function($) {
       
    addGlobalStyle('.muted { color:#ccc; }');
    
    $(document).on('click', 'a[target=_blank][href*="/mtg/"]', function(e) {
        var url = 'http://magiccards.info/query?q=!'+encodeURIComponent($(this).text().toLowerCase());
        window.open(url);
        
        e.preventDefault();
        return false;
    });
    
    spriteToClass('s_lightbulb', 'idea', true);
    spriteToClass('s_brick', 'built');
    spriteToClass('s_delete', 'private');
    spriteToClass('s_key', 'protected');
    
    $('.submenu_entry.deck [data-title], .submenu_entry [id^=folder_name][data-title]').html(function() {
        var $this = $(this);
        return $this.html().replace($this.text(), $this.data('title'));
    });
     
    $('td.card_count').each(function() {
        var $this = $(this);
        if ($this.text().trim() === '0') $this.addClass('muted');
    });
     
    colorPrices($('td.price:not(.price_min):not(.price_avg)'));
    colorPrices($('td.price_min'));
    colorPrices($('td.price_avg'));
 
    $('[id^=time_]').each(function() {
        var $this = $(this);
        var text = $this.text();
        $this.attr('data-title',text);
        $this.text(moment(text, 'DD-MMM-YYYY HH:mm').fromNow());
    });
   
    $('table.set_cards').each(function() {
        var $this = $(this);
        var $pTh, $tTh;
        $('th a', $this).each(function() {
            var $this = $(this);
            var text = $this.text().trim();
            if (text === 'P') $pTh = $this.parent();
            if (text === 'T') $tTh = $this.parent();
        });
        if (!$pTh || !$tTh) return;
        
        var pIndex = $('th', $this).index($pTh);
        var tIndex = $('th', $this).index($tTh);
        
        if (pIndex+1!=tIndex) return;
        
        $('tr[id]', $this).each(function() {
            var $this = $(this);
            var $pTd = $('td:eq('+pIndex+')', $this);
            var $tTd = $('td:eq('+tIndex+')', $this);
            
            var p = $pTd.text().trim();
            var t = $tTd.text().trim();
            
            if (p && t) $pTd.text(p+'\xA0/\xA0'+t);
            $pTd.attr('colspan','2');
            $tTd.remove();
        });
    });
     
})(jQuery);
