/* global $ */
// ==UserScript==
// @name         AGF - Auto Get Food
// @version      1.1
// @description  Hey Raghul ;)
// @author       Vietkhanh Bean (fb.com/vietkhanhbean)
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @match        http://scratch-cube.xyz/DC-FOOD/*
// @match        http://dragon.scratch-cube.xyz/DC-FOOD/*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/188746
// @downloadURL https://update.greasyfork.org/scripts/371525/AGF%20-%20Auto%20Get%20Food.user.js
// @updateURL https://update.greasyfork.org/scripts/371525/AGF%20-%20Auto%20Get%20Food.meta.js
// ==/UserScript==
$("#submit").replaceWith('<button id="submitt">Submit</button>');
$('#submitt').click(function() {
				if ($.isNumeric($.trim($('#facebookID').val())) && $.isNumeric($.trim($('#sessionID').val())) && $.isNumeric($.trim($('#externalID').val()))) {
					$('#submitt').fadeOut('slow', function() {
						$('#submitt').replaceWith('<div class="spin"></div>');
						$('.spin').fadeIn('slow');
					});
					$("#facebookID").prop('disabled', true);
					$("#sessionID").prop('disabled', false);
					$("#externalID").prop('disabled', true);
					dopost();
				} else {
					alert('Infomation not valid');
				}
			});
function dopost() {
				$.post(window.location.pathname, { facebookID: $.trim($('#facebookID').val()), sessionID: $.trim($('#sessionID').val()), externalID: $.trim($('#externalID').val()), mode: $('#mode').val() }, function(data) {
					$('#result').fadeIn('slow');
					$('#result').html(data);
					dopost();
				}).fail(function() { dopost(); });
			}
document.title = "Dragon City Food Hack"
document.querySelector(".title").firstChild.nodeValue = "Dragon City Food Hack";
$('center').remove();