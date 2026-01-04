// ==UserScript==
// @name         eBay Hide Price Range and Show Sold
// @namespace    JoseScript
// @version      2.0
// @description  Add menu to hide range items and items without Sold quantity
// @author       Jose Araujo
// @match        http*://www.ebay.com/sch/*
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/36543/eBay%20Hide%20Price%20Range%20and%20Show%20Sold.user.js
// @updateURL https://update.greasyfork.org/scripts/36543/eBay%20Hide%20Price%20Range%20and%20Show%20Sold.meta.js
// ==/UserScript==

$(".x-refine__left__nav").first().after('<li class="x-refine__main__list "><div><h3 class="x-refine__item">Filter</h3><div class="cbx"><input class="cbx hiderangeitems" name="hiderangeitems" type="checkbox"><span class="cbx">Hide Price Range Items</span></div><div class="cbx"><input class="cbx showonlysold" name="showonlysold" type="checkbox"><span class="cbx">Show Only Sold Items</span></div></div></li>');
$('#Results .prRange').parents('.sresult').addClass('rangeitem');
$('.DEFAULT:contains( to )').parents('.s-item').addClass('rangeitem');
$("#Results .lvextras:not(:contains('Sold'))").parents('.sresult').addClass('nosolditem');
$('li.s-item:not(:contains("Sold"))').addClass('nosolditem');

$('.hiderangeitems').click(updateFilter);
$('.showonlysold').click(updateFilter);

function updateFilter() {
    $(".rangeitem").show();
    $(".nosolditem").show();  
    if($(".hiderangeitems").is(":checked")) 
       $(".rangeitem").hide();
    if($(".showonlysold").is(":checked")) 
       $(".nosolditem").hide();
}