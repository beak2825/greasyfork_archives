// ==UserScript==
// @name		eRepublik Inventory extras
// @version		0.1
// @include		*www.erepublik.com/*/economy/inventory
// @description Table with licenses and taxes in the inventory. Scan for prices in sortable table.  Also checks for the old license bug, when aliens are on top of the list of sellers. Now with job offers.
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.18.3/js/jquery.tablesorter.min.js
// @namespace   https://greasyfork.org/users/2402
// @downloadURL https://update.greasyfork.org/scripts/372736/eRepublik%20Inventory%20extras.user.js
// @updateURL https://update.greasyfork.org/scripts/372736/eRepublik%20Inventory%20extras.meta.js
// ==/UserScript==

var $ = jQuery;

function AddStyle(t) {
    $("head").append("<style>" + t + "</style>");
}

(function() {
    'use strict';
    var licenses = angular.element('.offers_market').scope().data.owned;
    $("#sell_offers").after('<div class="taxTable" style="display: block;" ng-app="mainApp" ng-controller="licensesController">' + '<table id="licenses" width="100%">' + "<thead>" + "<tr>" + '<th style="height: 40px; text-align: center; padding-left: 0px;"> </th>' + '<th style="height: 40px; text-align: center; padding-left: 0px;">' + '<img width="35px" height="35px" src="//www.erepublik.com/images/icons/industry/1/default.png" title="Food">' + "</th>" + '<th style="height: 40px; text-align: center; padding-left: 0px;">' + '<img width="35px" height="35px" src="//www.erepublik.com/images/icons/industry/2/default.png" title="Weapons">' + "</th>" + '<th style="height: 40px; text-align: center; padding-left: 0px;">' + '<img width="35px" height="35px" src="//www.erepublik.com/images/icons/industry/3/default.png" title="Tickets">' + "</th>" + '<th style="height: 40px; text-align: center; padding-left: 0px;">' + '<img width="35px" height="35px" src="//www.erepublik.com/images/icons/industry/4/default.png" title="Tickets">' + "</th>" + '<th style="height: 40px; text-align: center; padding-left: 0px;">' + '<img width="35px" height="35px" src="//www.erepublik.com/images/icons/industry/23/default.png" title="Hospital">' + "</th>" + '<th style="height: 40px; text-align: center; padding-left: 0px;">' + '<img width="35px" height="35px" src="//www.erepublik.com/images/icons/industry/24/default.png" title="Defence Systems">' + "</th>" + '<th style="height: 40px; text-align: center; padding-left: 0px;">' + '<img width="35px" height="35px" src="//www.erepublik.com/images/icons/industry/7/default.png" title="Food raw materials">' + "</th>" + '<th style="height: 40px; text-align: center; padding-left: 0px;">' + '<img width="35px" height="35px" src="//www.erepublik.com/images/icons/industry/12/default.png" title="Weapons raw materials">' + "</th>" + '<th style="height: 40px; text-align: center; padding-left: 0px;">' + '<img width="35px" height="35px" src="//www.erepublik.com/images/icons/industry/17/default.png" title="Houses raw materials">' + "</th>" + "</tr>" + "</thead>" + "<tbody></tbody>" + "</table>" + "</div>");
    $("#inventory_overview .taxTable table tbody").append("<tr ng-repeat='country in countries'><td style='padding-left: 5px;' colspan='9'>{{ 'Country: ' + country.name + ', Locale: ' + country.locale }}</td></tr>");
    //$("#inventory_overview .taxTable table tbody").append("<tr ng-repeat='license in licenses'><td style='padding-left: 5px;'>{{license.name}}</td><td>{{license.name}}</td></tr>");

    var mainApp = angular.module("mainApp", []);
    mainApp.controller('licensesController', function($scope) {
        $scope.countries = [{locale:'en-US',name:'United States'}, {locale:'en-GB',name:'United Kingdom'}, {locale:'en-FR',name:'France'}]
    });

    // Your code here...
})();