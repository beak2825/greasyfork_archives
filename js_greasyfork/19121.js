// ==UserScript==
// @author      Xiphias[187717]
// @name        Torn City - Travel Run One Click Update by Xiphias[187717]
// @namespace   Xiphias[187717]
// @description Update Travel Run and the Travel Thread with one button click.
// @include     http://www.torn.com/index.php
// @include     https://www.torn.com/index.php
// @version     1.0.3.2
// @downloadURL https://update.greasyfork.org/scripts/19121/Torn%20City%20-%20Travel%20Run%20One%20Click%20Update%20by%20Xiphias%5B187717%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/19121/Torn%20City%20-%20Travel%20Run%20One%20Click%20Update%20by%20Xiphias%5B187717%5D.meta.js
// ==/UserScript==
const HOSPITAL = "hospital";
const NO_MARKET = "no market";


function getMarketData() {
	var country = $('.info-msg-cont').children(":visible").text().replace(/\s+/g, " ");
	var hosp_check = country.match("in hospital");
	if (hosp_check) {
		return HOSPITAL;
	} else {
		var market_string = "";
		var market_list = $('.travel-agency-market > ul > li > span');
		if (!market_list.length) {
			return NO_MARKET;
		} else {
			market_list.each(function () {
				market_string += $(this).children(":visible").text().replace(/\s+/g, " ") + "\n";
			});

			return country + "\n" + market_string;
		}
	}
}

function ajax_post_TravelRun(market_data, on_success_message) {
	$.ajax({
		type : 'POST',
		url : 'https://cors-anywhere.herokuapp.com/http://travelrun.torncentral.com/update2.php',
		data : {
			'data' : market_data
		},
		error : function (data) {
            $('#travelrun_msg').text("Something went wrong.");
		}, success : function (data) {
            $('#travelrun_msg').text(on_success_message);
        }
	});
}

function updateTravelRun(on_success_message) {
	var market_data = getMarketData();
	if (market_data == HOSPITAL) {
		$('#travelrun_msg').text("You are in the hospital. You cannot possibly see the market from the hospital you filthy liar.");
	} else if (market_data == NO_MARKET) {
		$('#travelrun_msg').text("Error. I cannot seem you find the market on this page. Please try again or contact the script creator");
	} else {
        ajax_post_TravelRun(market_data, on_success_message);
	}
}

function add_update_button() {
    var button = $('<button style="float: right; position: relative;  top: -5px; margin-bottom: 40px;" >Update TravelRun</button>');
  var message_cont = $('<span id="travelrun_msg" style="float: right;  position: relative; left: -5px;" ></span>');
    button.button().click(function( event ) {
        updateTravelRun("Updated TravelRun.");
      });
    if (getCountry()) {
        $('.footer > .container').prepend(message_cont);
        $('.footer > .container').prepend(button);
    }
}

function setShopAjaxListener() {
    $('body').ajaxComplete(function (e, xhr, settings) {
        var url = settings.url;
        if (url.indexOf("shops.php") >= 0) {
            var market_data = getMarketData();
            if (market_data != HOSPITAL && market_data != NO_MARKET) {
                if (isShopsBuySuccessful(xhr)) {
                    updateTravelRun("Auto updated Travel Run");
                }
            }
        }
    });
}

function isShopsBuySuccessful(xhr) {
    var responseText = xhr.responseText;
    var obj = tryParseJSON(responseText);
    if (obj) {
        if (obj.length > 0) {
            obj = obj[0];
        }

        if (obj.hasOwnProperty('success')) {
            return obj.success;
        }
    }
    return false;
}


function tryParseJSON(jsonString) {
	try {
		var o = JSON.parse(jsonString);
		// Handle non-exception-throwing cases:
		// Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
		// but... JSON.parse(null) returns 'null', and typeof null === "object",
		// so we must check for that, too.
		if (o && typeof o === 'object' && o !== null) {
			return o;
		}
	} catch (e) {}
	return false;
};

function market_table_creater() {
    var tableStr = '<table id="traveltable" width="100%" cellspacing="1" cellpadding="0" border="0"> \
                    <tbody> \
                        <tr id="traveltable_header" bgcolor="#151515" style="font-family:Montserrat, sans-serif;letter-spacing:2px;"> \
                            <th><span style="color:#ffffff;"><strong>TYPE</strong></span></th> \
                            <th><span style="color:#ffffff;"><strong>ITEM</strong></span></th> \
                            <th><span style="color:#ffffff;"><strong>COST</strong></span></th> \
                            <th><span style="color:#ffffff;"><strong>STOCK</strong></span></th> \
                        </tr>  \
                     </tbody> \
                   </table>';
    var table = $(tableStr);

    var rows = "";
    $('.travel-agency-market > ul > li > span').each(function() {
      var elem = $(this);
      var type = elem.find('.type').text().replace(/type:/ig, "").trim();
      var name = elem.find('.name').text().replace(/^\s+x\d+(?:[.,]\d+)*/ig, "").trim();
      var cost = elem.find('.cost > .c-price').text().trim();
      var stock = elem.find('.stock > .stck-amount').text().trim();
      var row = '<tr style="font-family:Montserrat, sans-serif;">\
                    <td>' + type + '</td>\
                    <td>'+name + '</td>\
                    <td><center>'+cost + '</center></td>\
                    <td><center>' + stock + '</center></td>\
                 </tr>';
      rows += row;
    });

    table.append(rows);
    return table;
}

function getCountry() {
    return $('.user-info').text().replace(/\r?\n|\r/g, "").replace(/.*you are in (.*?) and have \$.*/gi, '$1');
}

/* Run script */
add_update_button();
setShopAjaxListener();