// ==UserScript==
// @name         GDax Additional Information
// @version      1.2.5
// @author       Simonthebrit
// @description  Adds useful information to your GDax crypto-exchange view.
// @namespace    GDaxTweaks
// @grant        none
// @include      *.gdax.com*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/37619/GDax%20Additional%20Information.user.js
// @updateURL https://update.greasyfork.org/scripts/37619/GDax%20Additional%20Information.meta.js
// ==/UserScript==

// Specs
var grossPreText = 'GRS'; // Label to use to indicate our added gross values
var buttonText = 'CALCULATE GROSS (' + grossPreText + ')';
var tipBalance = 'The AVAILABLE balance of your account, which has been deducted by any open (unfilled) BUY orders.';
var tipActual = 'The available balance of your account plus the cost of any open (unfilled) BUY orders from this page added back in (does not include fees).';
var tipBTC = 'The AVAILABLE crypto amount in your account, which has been deducted by any open SELL orders.';
var tipSells = 'The total potential balance of your account if all currently-open orders from this page are filled, including potential sales profits.';
var buttonCSS = {
  "display" : "flex",
  "justify-content" : "center",
  "align-items" : "center",
  "margin-left" : "20px",
  "padding" : "3px 7px",
  "border" : "2px solid #788085",
  "border-radius" : "40px",
  "font-size" : "9px",
  "font-weight" : "bold",
  "color" : "#ced2d5",
  "cursor" : "pointer",
  "transition" : "background .2s ease-out"
};
var labelCSS = {          
  'text-decoration' : 'none',
  'border-bottom' : 'dotted 1px #999',
  'cursor' : 'help'
}

// Start when main view is loaded
var checkExist = setInterval(function() {
   if ($('div:acp("PanelHeader_title-and-children")').length) {
      doIt();
   }
}, 500); // check every 500ms

function doIt() {
    
    var grs = [], actual = [], addValSells = 0, addValActual = 0, currentUSD = 0, net = 0;
    
    // Do 'orders' list ------------------
    $('ul:acp("OrderList_list") li:acp("OrderList_row")').each( function() {
      
        var $this = $(this);
        var market = $this.find(':acp("OrderList_order-price") span.whole').text() + 
            '.' + $this.find(':acp("OrderList_order-price") span.part').text();
        var wholeBTC = $this.find(':acp("OrderList_split-number") span.whole:first').text();
        var subNum = (wholeBTC.substr(0,1) == '≈') ? 2 : 0;
        var btc = $this.find(':acp("OrderList_order-size") :acp("OrderList_split-number") span.whole:first').text().substr(subNum) + 
            '.' + $this.find(':acp("OrderList_order-size") :acp("OrderList_split-number") span.part').text();
        var net = roundTo(market * btc, 2);
        //alert('market: ' + market + ', btc: ' + btc + ', multiplied: ' + (market * btc) + ', net: ' + net); //debug
        
        var color = $this.find(':acp("OrderList_order-tag")').is('[class*="buy"]') ? "rgba(255,105,57,.85)" : "rgba(132,247,102,.85)";
        var buyOrSell = $this.find(':acp("OrderList_order-tag")').is('[class*="buy"]') ? "-" : "+";
      
        if (!$this.hasClass('NetDone') && !$this.find('div:acp("OrderList_order-price"):acp("OrderList_column") :acp("OrderList_split-number") span.grs').length ){
            $this.find('div:acp("OrderList_order-price"):acp("OrderList_column") :acp("OrderList_split-number")')
              .append(" <br><span class='grs'> (" + grossPreText + " <span style='color:" + color + ";'>" + buyOrSell 
                      + "</span> $<span style='color:" + color + "'>" + net + "</span>)</span>");
        }
      
        $this.addClass('NetDone');
      
        net = parseFloat(net); 
      
        // For POTENTIAL field: GDax already adjusts displayed balance to account for open buy orders. We therefore only add the sell orders. 
        var addValSells = (buyOrSell == '+') ? net : 0; 
      
        // For ACTUAL field: Only count buy orders and re-add them to the default balance displayed
        var addValActual = (buyOrSell == '+') ? 0 : net; 
      
        grs.push(addValSells);
        actual.push(addValActual);
      
    });
    
    // Do 'fills' list ------------------
    $('ul:acp("FillList_list") li:acp("FillList_row")').each( function() {
      
        var $this = $(this);
        var market = $this.find(':acp("FillList_fill-price") span.whole').text() + 
            '.' + $this.find(':acp("FillList_fill-price") span.part').text();
        var wholeBTC = $this.find(':acp("FillList_split-number") span.whole:first').text();
        var subNum = (wholeBTC.substr(0,1) == '≈') ? 2 : 0;
        var btc = $this.find(':acp("FillList_fill-size") :acp("FillList_split-number") span.whole:first').text().substr(subNum) + 
            '.' + $this.find(':acp("FillList_fill-size") :acp("FillList_split-number") span.part').text();
        $this.find(':acp("FillList_fill-price")').css('white-space','inherit');
        var net = roundTo(market * btc, 2); 
        //alert('market: ' + market + ', btc: ' + btc + ', multiplied: ' + (market * btc) + ', net: ' + net); //debug
        
        var color = $this.find(':acp("FillList_fill-tag")').is('[class*="buy"]') ? "rgba(255,105,57,.85)" : "rgba(132,247,102,.85)";
        var buyOrSell = $this.find(':acp("FillList_fill-tag")').is('[class*="buy"]') ? "-" : "+";
      
        if (!$this.hasClass('NetDone')){
            $this.find(':acp("FillList_fill-price"):acp("FillList_column") :acp("FillList_split-number")')
              .append(" <br>(" + grossPreText + " <span style='color:" + color + ";'>" + buyOrSell + "</span> $<span style='color:" + color + ";'>" + net + "</span>)");
        }

        $this.addClass('NetDone');
      
    });
    
    // Tweak some styles for better display with the added info
    $(':acp("FillList_fill-list") :acp("FillList_row") :acp("FillList_fill-price")')
        .css('width','25%');
    $(':acp("FillList_fill-list") :acp("FillList_row") :acp("FillList_fill-time")')
        .css('width','20%');
    $(':acp("OrderList_order-list") :acp("OrderList_list") :acp("OrderList_order") :acp("OrderList_order-tag") :acp("OrderList_tag")')
        .css('height','27px');
    $(':acp("FillList_fill-list") :acp("FillList_list") :acp("FillList_fill") :acp("FillList_fill-tag") span')
        .css('height','27px');
    
    // Do totals
    if (!$('.totalGRS').length) {
      
        // Make new labels
        $(':acp("BalanceInfo_currencies") :acp("BalanceInfo_spacer"):first').addClass('spacerLabel1');
        $(':acp("BalanceInfo_currencies") div:first').addClass('labelUSD').css(labelCSS).attr('title', tipBalance);
        $(':acp("BalanceInfo_currencies") div:eq(2)').addClass('labelBTC').css(labelCSS).attr('title',tipBTC);

      
        $('.spacerLabel1').clone().addClass('spacerLabel2').removeClass('spacerLabel1').insertAfter('.labelBTC'); 
        $('.spacerLabel2').after('<div class="totalSellsLabel" style="color:yellow;" title="' + tipSells + '">POTENTIAL</div>'); 
        $('.totalSellsLabel').css(labelCSS);

        $('.spacerLabel2').clone().addClass('spacerLabel3').removeClass('spacerLabel2').insertAfter('.totalSellsLabel'); 
        $('.spacerLabel3').after('<div class="totalActualLabel" style="color:yellow;" title="' + tipActual + '">ACTUAL</div>'); 
        $('.totalActualLabel').css(labelCSS);

      
        // Make new values
        $(':acp("BalanceInfo_balances") :acp("Tooltip_wrapper"):first').addClass('balUSD');
        $(':acp("BalanceInfo_balances") :acp("Tooltip_wrapper"):eq(1)').addClass('balBTC');
        $(':acp("BalanceInfo_balances") :acp("BalanceInfo_spacer"):first').addClass('spacerBal1');
      
        $('.spacerBal1').clone().addClass('spacerBal2').removeClass('spacerBal1').insertAfter('.balBTC'); 
        $('.balUSD').clone().addClass('totalGRS').removeClass('balUSD').insertAfter('.spacerBal2');
      
        $('.spacerBal1').clone().addClass('spacerBal3').removeClass('spacerBal1').insertAfter('.totalGRS'); 
        $('.balUSD').clone().addClass('totalActual').removeClass('balUSD').insertAfter('.spacerBal3');

    }
    var currentUSD = $(':acp("BalanceInfo_balances") span:acp("BalanceInfo_term-description"):first').text();
    currentUSD = parseFloat(currentUSD);
    $('.totalGRS span:acp("BalanceInfo_term-description")').css('color','yellow').html(currentUSD + grs.reduce(add, 0));
    $('.totalActual span:acp("BalanceInfo_term-description")').css('color','yellow').html(currentUSD + actual.reduce(add, 0));
    
  //});
  
}

function add(a, b) {
    return a + b;
}

// Declare :acp() custom jQuery selector. It finds individual class names beginning with 'string'
$(function(){
    $.expr[":"].acp = function(elem, index, m){
          var regString = '\\b' + m[3];
          var reg = new RegExp(regString, "g");
          return elem.className.match(reg);
    }
});

// Rounding
function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
    if ( n < 0) {
      negative = true;
      n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if ( negative ) {    
        n = (n * -1).toFixed(2);
    }
    return n;
}