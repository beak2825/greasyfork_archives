// ==UserScript==
// @name         WatchSeries Host List Sorter
// @namespace    dannieboi
// @version      0.3
// @description  Sorts the host list on watchseries alphabetically
// @author       dannieboi
// @match        http://watchseries.ag/episode/*.html
// @match        http://watchseries.vc/episode/*.html
// @match        http://watchseries.se/episode/*.html
// @match        http://watchseriesfree.to/episode/*.html
// @match        https://watchseriesfree.to/episode/*.html
// @grant 		 none
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/12820/WatchSeries%20Host%20List%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/12820/WatchSeries%20Host%20List%20Sorter.meta.js
// ==/UserScript==

$("select.kwd_search").each(function(){
  var $select = $(this);

  var $selectOptions = $select.find("option");


  var optionValues = _.map($selectOptions.get(), function(x){
    return { text: x.innerText, value: x.value };
  });

  var sortedOptionValues = _.sortBy(optionValues, "text");

  $selectOptions.remove();

  optionTemplate = _.template("<option value='<%= value %>'><%= text %></option>");

  _.forEach(sortedOptionValues, function(x){
    $select.append(optionTemplate(x));
  });
});
