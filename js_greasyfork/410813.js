// ==UserScript==
// @name       RYM discography average rating
// @version    1.2
// @description:en  Shows the average album rating of artists, weighted according to number of ratings.
// @description Shows the average album rating of artists, weighted according to number of ratings.
// @match      https://rateyourmusic.com/artist/*
// @namespace https://greasyfork.org/users/194849
// @downloadURL https://update.greasyfork.org/scripts/410813/RYM%20discography%20average%20rating.user.js
// @updateURL https://update.greasyfork.org/scripts/410813/RYM%20discography%20average%20rating.meta.js
// ==/UserScript==

var $ = unsafeWindow.jQuery;
var ratingsSum = 0;
var avg = 0;
var ratings = $('#disco_type_s').find('.disco_avg_rating');
var numberofRatingsList = $('#disco_type_s').find('.disco_ratings');
//console.log(ratings[i].innerHTML);

for(var i = 0; i < numberofRatingsList.length;i++){

    if(!ratings[i].innerHTML.includes("data") && ratings[i].innerHTML.includes(".")){
        console.log(ratings[i] + "counts");
    ratingsSum+=parseFloat(numberofRatingsList[i].innerHTML.replace(",", ""));
    }
}


for(i = 0; i < ratings.length;i++){

    if(!ratings[i].innerHTML.includes("data") && ratings[i].innerHTML.includes(".")){
   avg += parseFloat(ratings[i].innerHTML.replace(",", "")) * parseFloat(numberofRatingsList[i].innerHTML.replace(",", "")) / ratingsSum;
    }
}
console.log(avg);


var avgElements = $('.hide-for-small-inline');

avgElements[0].innerHTML = "avg(" + avg.toFixed(2) +")";