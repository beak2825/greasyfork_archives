// ==UserScript==
// @name         BUG Giveaway Creator
// @namespace    http://www.parallel-bits.com
// @version      1.8
// @description  Small Helper for BUG (Best Unique Giveaways). Sets Region, Group, Start and End Date
// @author       Daerphen
// @match        https://www.steamgifts.com/giveaways/new
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/35705/BUG%20Giveaway%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/35705/BUG%20Giveaway%20Creator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var groups = [
        {
            id: '1431880219',
            name: 'BUG Normal Tier',
            description: '### Tier NORMAL\nGifts with Historical Minimum Value between 2.99$ and 9.99$\n\n### IF YOU WIN THIS GA YOU WILL NEED TO MAKE ANOTHER GA IN NO MORE THAN 48 HOURS! and remember to put your link in this [thread](http://steamcommunity.com/groups/bestuniquegifts/discussions/0/142260895147405805/)'
        },
        {
            id: '1431880219',
            name: 'BUG Elite Tier',
            description: '### Tier ELITE\nGifts with Historical Minimum Value of at least 10$ \n\n### IF YOU WIN THIS GA YOU WILL NEED TO MAKE ANOTHER GA IN NO MORE THAN 48 HOURS! and remember to put your link in this [thread](http://steamcommunity.com/groups/bestuniquegifts/discussions/0/142260895147403666/)'
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
	function insertDates(start, end) {
		$('input[name="start_time"]').val(formatDate(start));
		$('input[name="end_time"]').val(formatDate(end));
	}
	function formatDate(date) {
		var output = $.datepicker.formatDate('M dd, yy', date);
		var time = date.toLocaleString('en-US', { hour: 'numeric',minute:'numeric', hour12: true });
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
        var start = new Date();
        console.log(start.getTime());
        console.log(4*24*60*60*1000);
		var end = new Date(start.getTime() + 4*24*60*60*1000);
		insertDates(start, end);
		setRegionRestriction();
		setGroups(group);
		setDescription(group.description);
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
})();
 




