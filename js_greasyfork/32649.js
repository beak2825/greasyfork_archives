// ==UserScript==
// @name Hide succesful orders in shop
// @namespace http://meblujdom.pl/
// @version 0.1
// @description On admin order page creates a buttons which hides delivered orders
// @author Eryk Wróbel
// @match http://meblujdom.pl/*
// @match https://meblujdom.pl/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/32649/Hide%20succesful%20orders%20in%20shop.user.js
// @updateURL https://update.greasyfork.org/scripts/32649/Hide%20succesful%20orders%20in%20shop.meta.js
// ==/UserScript==

(function() {
if (window.location.href.indexOf("AdminOrders&token") > -1) { 
$( "#form-order .panel-heading > span.badge" ).after("<span class='btn btn-default schowaj'>Schowaj nieaktywne zamówienia</span> <span class='btn btn-default schowajwysylki'>Schowaj nieaktywne zamówienia + wysłane</span> <span class='btn btn-default schowajzajete'>Tymi się zajmij</span>");

$(".schowaj").on( "click", function() {
var myString = '';
$('.color_field').each(function(i, obj) {
var myString = $(this).text().trim();
if (myString == 'Dostarczone' || myString == 'Anulowane' || myString == 'Błąd płatności' || myString == 'Brak towaru' || myString == 'Zwrot wpłaty' || myString == 'Brak towaru z fakturą braku' || myString == 'Zwrot') {
$(this).closest('tr').remove();
}
console.log(myString);
});
});

$(".schowajwysylki").on( "click", function() {
var myString = '';
$('.color_field').each(function(i, obj) {
var myString = $(this).text().trim();
if (myString == 'Dostarczone' || myString == 'Anulowane' || myString == 'Błąd płatności' || myString == 'Brak towaru' || myString == 'Zwrot wpłaty' || myString == 'Brak towaru z fakturą braku' || myString == 'Zwrot' || myString == 'Wysłane') {
$(this).closest('tr').remove();
}
console.log(myString);
});
});

$(".schowajzajete").on( "click", function() {
var myString = '';
$('.color_field').each(function(i, obj) {
var myString = $(this).text().trim();
if (myString == 'Dostarczone' || myString == 'Anulowane' || myString == 'Błąd płatności' || myString == 'Brak towaru' || myString == 'Zwrot wpłaty' || myString == 'Brak towaru z fakturą braku' || myString == 'Zwrot' || myString == 'Wysłane' || myString == 'Oczekiwanie na dostawę od producenta'|| myString == 'Oczekiwanie na wysyłkę od producenta' || myString == 'Oczekiwanie na wysyłkę' || myString == 'Oczekiwanie na informację od Klienta' || myString == 'Skontaktuj się z Klientem' || myString == 'Klient oczekuje na dostępność towaru' ) {
$(this).closest('tr').remove();
}
console.log(myString);
});
});
}
})();