// ==UserScript==
// @name         AKATSUKI Giveaway Helper
// @namespace    http://www.parallel-bits.com
// @version      1.8
// @description  Helps to create monthly giveaways for AKATSUKI. Set group, start and end date and standard description
// @author       Daerphen
// @match        https://www.steamgifts.com/giveaways/new
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/35686/AKATSUKI%20Giveaway%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/35686/AKATSUKI%20Giveaway%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var description = '### Monthly giveaway';
    var groups = [
        {
            id: '835390303',
            name: 'Akatsuki Monthly',
            description: '### {0} Giveaway\n\n**AkatsukiType: monthly**'
        },{
            id: '835390303',
            name: 'Akatsuki Extra',
            description: '### {0} Giveaway\n\n**AkatsukiType: extra**'
        }
    ];
	var buttonRow = $('#autofill-row');
    if(!$('#autofill-row').length) {
        $('.form__row--giveaway-keys').after('<div class="form__row"><div class="form__heading"><div class="form__heading__number"></div><div class="form__heading__text">Autofill</div></div><div class="form__row__indent" id="autofill-row"></div></div>');
    }
    for(var g of groups) {
		(function(group) {
			if(isMemberOf(group.id)) {
				// is member of
				var button = $('<div id="b'+group.id+'" class="autofill-button" style="display:inline-block; border:1px solid #CCC; border-radius: 5px; background-image: linear-gradient(#f7fcf2 0%, #e7f6da 100%); background-image: -moz-linear-gradient(#f7fcf2 0%, #e7f6da 100%); background-image: -webkit-linear-gradient(#f7fcf2 0%, #e7f6da 100%); border-color: #C5E9A5; color: #6b7a8c; box-shadow: 0 0 5px -1px rgba(0,0,0,0.2); cursor:pointer; vertical-align:middle; max-width: 100px; padding: 5px; margin: 5px; text-align: center;">'+group.name+'</div>');
				button.click(function() {
					performAction(group);
				});
				$('#autofill-row').append(button);
			}
		})(g);
    }
  function addStyle(style) {
    var styleElement = $('style');
    console.log(styleElement);
    if (!style) {
      styleElement = $('<style>');
      $('head').append(styleElement);
    }
    styleElement.append(style);
  }
	function insertDates(start, end) {
		$('input[name="start_time"]').val(formatDate(start));
		$('input[name="end_time"]').val(formatDate(end));
	}
	function formatDate(date) {
		console.log($.datepicker);
		var output = $.datepicker.formatDate('M dd, yy', date);
		var time = date.toLocaleString('en-US', { hour: 'numeric', minute:'numeric', hour12: true });
		console.log(output + ' ' + time);
		return output + ' ' + time;
	}
	function extendNumber(n) {
		if(n < 10) {
			return '0' + n;
		}
		return n;
	}
	function setRegionRestriction() {
		$('div[data-checkbox-value="0"]').trigger('click');
	}
	function setGroups(group) {
		$('div[data-checkbox-value="groups"]').trigger('click');
        var groupSelectionButton = $('div[data-item-id="' + group.id + '"]');
		if(!groupSelectionButton.hasClass('is-selected')) {
			groupSelectionButton.trigger('click');
		}
	}
	function setDescription(description) {
		$('textarea[name="description"]').val(description);
	}
	function performAction(group) {
		var ending_day = 30;
		var current_date = new Date();
		var current_day = current_date.getDate();
		var current_month = current_date.getMonth();
		var current_year = current_date.getYear();
		if(current_day >= 28) {
			if(current_month == 11) {
				current_year += 1;
			}
			current_month += 1;
			current_month %= 12;
		}
		if(current_month == 1) {
			ending_day = 28;
		}
		var start = new Date();
		var end = new Date((current_month + 1) + '/' + ending_day + '/' + (current_year+1900) + ' 18:00:00 GMT');
		insertDates(start, end);
		setRegionRestriction();
		setGroups(group);
		setDescription(group.description.format(end.toLocaleString('en-GB', { month: "long" })));
	}
    function isMemberOf(groupId) {
        var groups = $('div[data-item-id]');
        var res = false;
        groups.each(function(i,g){
            var dataId = $(g).data('item-id');
            if(parseInt(dataId) === parseInt(groupId)) {
                res = true;
            }
        });
        return res;
    }
    function maxDate(a,b) {
        if(a.getTime() < b.getTime()) {
            return b;
        }
        return a;
    }
	String.prototype.format = function() {
	    var formatted = this;
	    for( var arg in arguments ) {
	        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
	    }
	    return formatted;
	};
})();
