// ==UserScript==
// @name        Torn City - Shortcut Menu Extension by Xiphias[187717]
// @namespace   https://greasyfork.org/users/3898
// @description Adds custom buttons in the Areas section.
// @include     http://www.torn.com/*
// @include     https://www.torn.com/*
// @include     torn.com/*
// @exclude     torn.com/laptop.php*
// @exclude     http://www.torn.com/laptop.php*
// @exclude     https://www.torn.com/laptop.php*
// @exclude     torn.com/loader2.php*
// @exclude     http://www.torn.com/loader2.php*
// @exclude     https://www.torn.com/loader2.php*
// @grant       none
// @version     1.0.4
// @downloadURL https://update.greasyfork.org/scripts/19423/Torn%20City%20-%20Shortcut%20Menu%20Extension%20by%20Xiphias%5B187717%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/19423/Torn%20City%20-%20Shortcut%20Menu%20Extension%20by%20Xiphias%5B187717%5D.meta.js
// ==/UserScript==

/************
IDEAS

Need to set up JSON object for these shortcuts.
Object
Maybe Constructor function


Multiple shortcuts
Shortcuts for Items (Some kind of Array of items)
One button per item in the item list.
Will show checked if the item is already in the shortcut list.
Somehow find out if user has none of a certain item left.
Other customizable shortcuts?
Settings window
Show all shortcuts.
Remove certain shortcuts.
Shortcut for crimes (one only maybe?)
Shortcut for gym (one)


Gym
Strength  - q=1
Defence   - q=2
Speed     - q=3
Dexterity - q=4
Dunno     - step : embeddedgym2
Amount    - t=1

 ***************/

/*
------------------------
Helper functions
------------------------
 */

/**
 * Store data in the local storage.
 */
function setItem(key, value) {
	window.localStorage.setItem(key, value);
}

/**
 * Get data from the local storage.
 */
function getItem(key, defaultValue) {
	var value = window.localStorage.getItem(key);
	defaultValue = defaultValue || "";
	if (value != null && value != undefined) {
		return value;
	} else {
		return defaultValue;
	}
}

function isStorageSet() {
	return (window.localStorage.getItem('cc_name') &&
		window.localStorage.getItem('cc_crime') &&
		window.localStorage.getItem('cc_image') &&
		window.localStorage.getItem('cc_nerve'));
}

/**
 * Add CSS styles to the page.
 */
function addGlobalStyle(css) {
	var head,
	style;
	head = document.getElementsByTagName('head')[0];
	if (!head) {
		return;
	}
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

/**
 * Semi auto adjust font size depending on the length of the string.
 * A string over a certain length will still overlow but such a string
 * should not be expected.
 */
(function ($) {
	$.fn.textfill = function () {
		return this.each(function () {
			var ourText = $(this),
			textLength = ourText.text().length,
			newFontSize = '12px';
			if (textLength < 18) {
				newFontSize = '12px';
			} else if (textLength >= 18 && textLength < 23) {
				newFontSize = '11px';
			} else if (textLength >= 23 && textLength < 25) {
				newFontSize = '10px';
			} else if (textLength >= 25 && textLength < 30) {
				newFontSize = '9px';
			} else {
				newFontSize = '8px';
			}
			ourText.css('fontSize', newFontSize);
		});
	};
})(jQuery);

/*
------------------------
Main Code
------------------------
 */

/**
 * Decrement nerve by a certain amount.
 * @param {nerve] The amount of nerve to decrement with.
 */
function decrementNerve(nerve) {
	var currentNerve = parseInt($('#nerve > .count.left').contents()[0].textContent);
	currentNerve -= nerve; // Remove n nerve
	$('#nerve > .count.left').contents()[0].textContent = currentNerve;

	// Shorten the nerve bar length.
	var totalNerve = parseInt($('#nerve > .count.left').attr('data-total'));
	var newBarLength = Math.ceil((currentNerve * 100) / totalNerve);
	$('#nerve').find('.progress-line').css('width', newBarLength + '%'); // Set bar length
	if (currentNerve != totalNerve) {
		$('#customCrime-li').removeClass('bg-green h act');
	}
}

/**
 * Post request to perform a crime.
 *
 * @param {name} The name of the crime to be shown on the Crime button.
 * @param {crime} The crime code to send with the post request
 * @param {nerve} The nerveTake value to send with the post request
 */
function ajaxCustomCrime(name, crime, nerve) {
	$.ajax({
		type : 'POST',
		url : '//www.torn.com/crimes.php?step=docrime4&rfcv=' + getCookie('rfc_v'),
		data : {
			'crime' : crime,
			'nervetake' : nerve
		},
		success : function (data) {
			try {
				var $data = $(data); // Parse data to html
				// If validation is needed go to crimes page.
				if ($data.find('#skip-to-content').text().toLowerCase().indexOf('please validate') > -1) {
					window.location.href = 'http://torn.com/crimes.php';
				} else {
					var msg = $data.find('.msg.right-round').text();
					console.log(msg);
					msg = msg.toLowerCase();
					if (msg.indexOf('you will have to wait for') > -1) {
						$('#custom-crime-text').text('Not Enough Nerve');
						$('#customCrime').addClass('cc-bg-red');
					} else if (msg.indexOf("blocked when in hospital") > -1) {
						$('#custom-crime-text').text('In Hospital');
						$('#customCrime').addClass('cc-bg-red');
					} else {
						console.log("decrement now");
						decrementNerve(nerve);
						// Set Crime label
						$('#custom-crime-text').text(name);
						var currentNerve = parseInt($('#nerve > .count.left').contents()[0].textContent);
						if (currentNerve >= nerve) {
							$('#customCrime').removeClass('cc-bg-red');
						} else {
							$('#customCrime').addClass('cc-bg-red');
						}

					}
				}
			} catch (err) {
				console.log(data);
				var json = JSON.parse(data);
				if (json != undefined && json.redirect == true) {
					//alert('Redirect, probably failed to load authentication');
					window.location.href = "crimes.php";
				} else {
					console.log('Unknown error: ');
					console.log(json);
				}
			}
		}
	});
}

/**
 * The default ajax request made when doing a crime from the crimes page.
 */
function ajaxCrimeDefaultCall(crime, nerve) {
	$.ajax({
		type : 'POST',
		url : '//www.torn.com/crimes.php?step=docrime4&rfcv=' + getCookie('rfc_v'),
		data : {
			'crime' : crime,
			'nervetake' : nerve
		},
		success : function (data) {
			var $elem = $('.content-wrapper.m-left20.left.spring');
			$elem.empty();
			$elem.append(data);
		}
	});
}

/**
 * Set the ajax listener to catch different ajax request being made.
 */
function setAjaxCompleteListener() {
	$('body').ajaxComplete(function (e, xhr, settings) {
		var url = settings.url;
		if (url.indexOf('refreshenergy.php') >= 0 || url.indexOf('refreshtopofsidebar') >= 0) {
			var html = $(xhr.responseText);

			var hospital_icon = $("#icon15");
			var jail_icon = $("#icon16");
			if (hospital_icon.length > 0) {
				$('#customCrime').addClass('cc-bg-red');
				$('#custom-crime-text').text('In Hospital');
			} else if (jail_icon.length > 0) {
                $('#customCrime').addClass('cc-bg-red');
                $('#custom-crime-text').text('In Jail');
            
            
            }else {

				var currentNerve = parseInt($('#nerve > .count.left').attr('data-current'));
				var totalNerve = parseInt($('#nerve > .count.left').attr('data-total'));
				var nerveNeeded = 10;
				if (currentNerve == totalNerve) {
					resetCrimeButton(window.cc_name);
					$('#customCrime-li').addClass('bg-green h act');
				} else if (currentNerve >= nerveNeeded) {
					resetCrimeButton(window.cc_name);
				} else if (currentNerve < nerveNeeded) {
					$('#customCrime').addClass('cc-bg-red');
				}
			}
		}
	});
}
/**
 *  Perform gym training with this Ajax Get request.
 *
 *  @param {stats_type} The stats to train: {Strength = 1, Defense = 2, Speed = 3, Dexterity = 4}
 *  @param {amount}   Amount of trainings to do.
 */
function ajaxGym(stats_type, amount) {
	$.ajax({
		type : 'GET',
		url : '//www.torn.com/gym.php?step=embeddedgym2&rfcv=' + getCookie('rfc_v'),
		data : {
			'q' : stats_type,
			't' : amount
		},
		success : function (data) {
			console.log($(data));
			// Handle callback
			// <div id="outputMsg">You do not have enough energy left</div><div id="currentEnergyCounter">0</div>

			//<div id="roleplaytext">You achieved <b>1</b> straight leg dead lift at <b>270kgs</b></div><div id="roleplaygain">You gained 3,585.2601 strength</div><div id="newStatTotal">8,857,749.62</div><div id="currentEnergyCounter">0</div>
		}
	});
}

/**
 *  Some hacks to refresh the information section on the sidebar.
 *  Since I do not know how to restart the timers I explicitely
 *  update the information that is returned in the get request.
 */
function ajaxRefreshTopOfSidebar() {
	$.ajax({
		type : 'GET',
		datatype : 'html',
		url : '//www.torn.com/refreshtopofsidebar.php?rfcv=' + getCookie('rfc_v'),
		success : function (data) {
			var $data = $(data);
			var $energy_count_left = $data.find('#energy > .count.left');
			var $energy_line_energy = $data.find('#energy > .line.energy');
			var $happy_count_left = $data.find('#happy > .count.left');
			var $happy_line_happy = $data.find('#happy > .line.happy');
			var $nerve_count_left = $data.find('#nerve > .count.left');
			var $nerve_line_nerve = $data.find('#nerve > .line.nerve');
			$('#energy').find('.count.left').replaceWith($energy_count_left);
			$('#energy').find('.line.energy').replaceWith($energy_line_energy);
			$('#happy').find('.count.left').replaceWith($happy_count_left);
			$('#happy').find('.line.happy').replaceWith($happy_line_happy);
			$('#nerve').find('.count.left').replaceWith($nerve_count_left);
			$('#nerve').find('.line.nerve').replaceWith($nerve_line_nerve);
		}
	});
}

/**
 * Create a new CrimeButton in the style of the left hand side
 * menu area buttons.
 *
 * @param {name} The label of the button (name of the crime).
 * @param {image} Image url for the crime in question.
 * @param {crime} The crime code used in the ajax request.
 * @param {nerve} The amount of nerve the crime takes.
 */
function setupCrimeButton(name, image, crime, nerve) {
	var $customCrimeButton = $('<li id="customCrime-li" class="noselect"><div id="customCrime" class="list-link"><a style="cursor: pointer;"><img style="width: 23px; height: 23px; padding-left:5px; padding-right:6px;" class="crimes-navigation-icons left"><span class="border-l"></span><span class="border-r"></span><span id="custom-crime-text" class="list-link-name"></span></div></a></li>');
	$customCrimeButton.find('img').attr('src', image);
	$customCrimeButton.find('#custom-crime-text').text(name).textfill();
	$customCrimeButton.click(function () {
		ajaxCustomCrime(name, crime, nerve);
	});
	return $customCrimeButton;
}

/**
 * Set the Custom Crime button to its default state.
 * @param {str} The label to be shown on the button (Usually Crime name).
 */
function resetCrimeButton(str) {
	$('#custom-crime-text').text(str).textfill();
	$('#customCrime').removeClass('cc-bg-red');
	$('#customCrime').removeClass('bg-green h act');
}

function setupShortcutsArea() {
	var $shortcutsAreaHTML = $('<li class="m-areas">\
																														        <!-- Shortcuts -->\
																														        <div class="menu">\
																														            <div class="menu-header" role="menu" tabindex="0">\
																														                <i class="menu-header-arrow side right"></i>Shortcuts\
																														            </div>\
																														        </div>\
																														        <div class="menu list-link-wrapper">\
																														            <ul id="shortcuts-list-menu" role="menu"></ul>\
																														        </div>\
																														    </li>\
																														    ');
	$('#menu-list-accordion > .m-info').after($shortcutsAreaHTML);
}

function setupCrimeSetShortcutBtn() {
	var $ccSetShortcutBtn = $('\
																														            <div class="special btn-wrap right silver m-top10" style="margin-right:11px;">   \
																														                <div id="cc-set-shortcut-btn" class="btn" role="button">SET SHORTCUT</div>   \
																														            </div>');
}

/*
---------------------------
Run script
---------------------------
 */

addGlobalStyle("                                                     \
										    .cc-bg-red {                                                     \
										      background-color :  #F5C4C4 !important;   //Red color          \
										     }                                                               \
										    .cc-bg-red:hover {                                               \
										       background-color : #F59090 !important;  // Lighter red color  \
										     }                                                               \
										     .noselect {                                                     \
										       -webkit-touch-callout: none;                                  \
										       -webkit-user-select: none;                                    \
										       -khtml-user-select: none;                                     \
										       -moz-user-select: none;                                       \
										       -ms-user-select: none;                                        \
										       user-select: none;                                            \
										    }                                                                \
										     ");
function RunScript() {
	setAjaxCompleteListener();

	if (isStorageSet()) {
		window.cc_name = getItem("cc_name");
		window.cc_crime = getItem("cc_crime");
		window.cc_image = getItem("cc_image");
		window.cc_nerve = parseInt(getItem("cc_nerve"));
	} else {
		window.cc_name = "Mob Boss";
		window.cc_crime = "murdermobboss";
		window.cc_image = "http://www.torn.com/images/crimes/i4.png";
		window.cc_nerve = 10;
	}

	/*



	 */

	setupShortcutsArea();

	var $customCrimeButton = setupCrimeButton(window.cc_name, window.cc_image, window.cc_crime, window.cc_nerve);
    var $customStockItem = setupStocksItem();
    getStocksInformation(30);
	$('#shortcuts-list-menu').append($customCrimeButton);
    $('#shortcuts-list-menu').append($customStockItem);

	var currentNerve = parseInt($('#nerve > .count.left').contents()[0].textContent);
	var totalNerve = parseInt($('#nerve > .count.left').attr('data-total'));
	if (currentNerve == totalNerve) {
		$('#customCrime-li').addClass('bg-green h act');
	}
	if (currentNerve < window.cc_nerve) {
		$('#customCrime').addClass('cc-bg-red');
	}
}


/***************************************************/
/************  CHECK IF TRAVELING ******************/
/***************************************************/

/**
 * This API call can be quite slow.
 */
function getTravelInformation() {
	$.ajax({
		type : 'POST',
		url : '//api.torn.com/user/?selections=travel&key=XDzPXpDQ',
		success : function (data) {
			var travel = data['travel'];
			var destination = travel['destination'];
			var time_left = travel['time_left'];
			console.log(travel);
			console.log(destination);
			console.log(time_left > 0);
			if (destination == 'Torn' && time_left == 0) {
				RunScript();
			}
		}
	});
}



/***************************************************/
/************ CHECK AVAILABLE STOCKS ***************/
/***************************************************/

function setupStocksItem() {
    var $customStockItem = '<div id="customStock" class="list-link"><span class="border-l"></span><span class="border-r"></span><span style="font-size: 12px;" id="stock_text" class="list-link-name"></span></div>';
    return $customStockItem;
}


function getStocksInformation(stockID) {
	$.ajax({
		type : 'POST',
		url : '//api.torn.com/torn/' + stockID.toString() + '?selections=stocks&key=XDzPXpDQ',
		success : function (data) {
            var stock = data['stocks'][stockID.toString()];
            var name = stock['acronym'];
            var available_shares = stock['available_shares'];
            var current_price = stock['current_price'];
            $('#stock_text').text(name + ": " + available_shares + " - $" + current_price );
		}
	});
}



$(function () {
  getTravelInformation();
});