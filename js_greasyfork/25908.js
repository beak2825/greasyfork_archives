// ==UserScript==
// @name           TradeSwitcher
// @description    Adds TradeSwitcher
// @include        https://politicsandwar.com/*
// @version        1.0
// @require		   http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require        http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.min.js
// @grant		   GM_setValue
// @grant		   GM_deleteValue
// @grant		   GM_getValue
// @grant          GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/88620
// @downloadURL https://update.greasyfork.org/scripts/25908/TradeSwitcher.user.js
// @updateURL https://update.greasyfork.org/scripts/25908/TradeSwitcher.meta.js
// ==/UserScript==



//Buy/Sell switcher button
if(GM_getValue('pnwBuySellSwitch', 1) == 1 && typeof jQuery('select[name="resource1"]').val() != 'undefined' && jQuery('select[name="resource1"]').val().length > 0){
	var resource1 = jQuery('select[name="resource1"]').val();
    var buysell = jQuery('select[name="buysell"]').val();
    var id = jQuery('input[name="id"]').val();
    var display = jQuery('input[name="display"]').val();
    var ob = jQuery('select[name="ob"]').val();
    var maximum = jQuery('input[name="maximum"]').val();
    var minimum = jQuery('input[name="minimum"]').val();
    var od;
    
    if(buysell == "sell"){
        buysell = "buy";
        od = "DESC";
    }else{
        buysell = "sell";
        od = "ASC";
    }
    jQuery('div[id="rightcolumn"] form:eq(0)').after('<form action="/index.php" method="get"><input type="hidden" name ="id" value="'+id+'"><input type="hidden" name ="display" value="'+display+'"><input type="hidden" name ="resource1" value="'+resource1+'"><input type="hidden" name ="buysell" value="'+buysell+'"><input type="hidden" name ="ob" value="'+ob+'"><input type="hidden" name ="od" value="'+od+'"><input type="hidden" name ="maximum" value="'+maximum+'"><input type="hidden" name ="minimum" value="'+minimum+'"><p style="text-align:center;"><input type="submit" value="Switch Buy/Sell"></p></form>');
}
