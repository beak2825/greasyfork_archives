// ==UserScript==
// @name        Mp3Red Track Titles to CSV
// @namespace   charliet@gmail.com
// @include     http://redmp3.su/album/*
// @include     https://redmp3.su/album/*
// @include     http://mp3red.su/album/*
// @include     https://mp3red.su/album/*
// @include     http://mp3red.co/album/*
// @include     https://mp3red.co/album/*
// @include     http://mp3red.cc/album/*
// @include     https://mp3red.cc/album/*
// @include     http://mp3red.me/album/*
// @include     https://mp3red.me/album/*
// @include     http://mp3-red.cc/album/*
// @include     https://mp3-red.cc/album/*
// @version     4
// @grant       none
// @local       en-US
// @description Get tracklisting from album page and stores it in CSV file
// @downloadURL https://update.greasyfork.org/scripts/35417/Mp3Red%20Track%20Titles%20to%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/35417/Mp3Red%20Track%20Titles%20to%20CSV.meta.js
// ==/UserScript==

collection_name = $('h1').text().split(' —')[0];
filename_array = [];
var csvContent = "data:text/csv;charset=utf-8,";

count = $( ".track-title" ).length;
$( ".track-title" ).each(function( index ) {
  //console.log( $( this ).text().replace(' — ','-').replace(/\s/g,"-").toLowerCase() );
  raw_listing = $( this ).text().replace(/(\r\n|\n|\r)/gm," ");
  raw_listing = raw_listing.replace(/\u2013|\u2014/g, "-");
  listing_array = raw_listing.split(" - ");
  if(raw_listing.includes(" - ")){
   filename_array.push(listing_array[1]+'-'+listing_array[0]); 
  } else{
    filename_array.push(raw_listing.trim());
  }
  //console.log(listing_array[1]+'-'+listing_array[0]);
  //filename_array.push($( this ).attr('href').split('/')[2].slice(0, -5));
  //filename_array.push($( this ).text().replace(/(\r\n|\n|\r)/gm," ").replace('—','-'));
  //filename_array.push(listing_array[1]+'-'+listing_array[0]);
  count--;
  if (count == 0){
    do_export(filename_array.sort());
  }
});
//console.log(filename_array);

function do_export(fancy){
  console.log(fancy.length);
var csvRows = [];
/*
for(var i=0, l=fancy.length; i<l; ++i){
  console.log(fancy[i]);
    csvRows.push(fancy[i].join(','));
}
*/
var csvString = fancy.join("\n");
  console.log(csvString);
var a         = document.createElement('a');
a.href        = 'data:attachment/csv,' +  encodeURIComponent(csvString);
a.target      = '_blank';
a.download    = collection_name+'.csv';

document.body.appendChild(a);
a.click();
}