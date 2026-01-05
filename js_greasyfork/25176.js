// ==UserScript==
// @name        Company Profit Calculator
// @version     2.2.1
// @namespace   https://greasyfork.org/en/users/5563-bloodymind
// @include     *://*.torn.com/companies.php*
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @grant       none
// @description Calculate company net income
// @downloadURL https://update.greasyfork.org/scripts/25176/Company%20Profit%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/25176/Company%20Profit%20Calculator.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var companyIncome, adBudget, stockCost = 0, netIncome, employeesPay = 0;

String.prototype.remove = function (search) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), '');
};

String.prototype.toInt = function (string) {
	return parseInt(this.remove(string).remove(' ').remove(','), 10);
};

Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

(function () {
	companyIncome = $('ul.company-stats-list:nth-child(4) > li:nth-child(2) > div:nth-child(3)').text().remove('\\$').toInt('Daily income:');
	$.ajax({
		type: 'post',
		url: addRFC('/companies.php?step=employees'),
		success: function (response) {
			if (response.toString().indexOf('Here you can') >= 0) {
				$(response).find('input[name$="pay"]').each(function (index, element) {
					employeesPay += $(element).val().toString().toInt('');
				});
				$.ajax({
					type: 'post',
					url: addRFC('/companies.php?step=advertising'),
					success: function (response) {
						adBudget = $(response).find('input[name="budget"]').val().toString().toInt('');
						$.ajax({
							type: 'post',
							url: addRFC('/companies.php?step=pricing'),
							success: function (response) {
								$(response).find('ul.pricing-list li').each(function (index, element) {
                                    var cost=$(element).find('div.cost').text().toString().trim().remove('Cost Each:').toInt('\\$') * $(element).find('div.sold-daily').text().toString().trim().remove('Sold Daily:').toInt('\\$');
									stockCost += isNaN(cost) ? 0:cost;
								});
								$('ul.company-stats-list:nth-child(4) > li:nth-child(2) > div:nth-child(3)').prop('title', '<strong>Employees pay: </strong>$' + employeesPay.format(0,3) + '</br>' + '<strong>Stock cost: </strong>$' + stockCost.format(0,3) + '</br>' + '<strong>Net income: </strong>$' + (companyIncome - employeesPay - adBudget - stockCost).format(0,3));
							}
						});
					}
				});
			}
		}
	});
})();
