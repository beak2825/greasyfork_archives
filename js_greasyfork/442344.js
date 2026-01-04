// ==UserScript==
// @name          The Nude - Show directly thumbnails of Actress in "Appears with:"
// @description	  Show directly thumbnails of Actress in "Appears with:" section. With the help of indefined (thanks)
// @author        janvier57
// @namespace     https://greasyfork.org/users/7434
// @include       https://www.thenude.com/*
// @match         https://www.thenude.com/*
// @version       2
// @license       unlicense
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/442344/The%20Nude%20-%20Show%20directly%20thumbnails%20of%20Actress%20in%20%22Appears%20with%3A%22.user.js
// @updateURL https://update.greasyfork.org/scripts/442344/The%20Nude%20-%20Show%20directly%20thumbnails%20of%20Actress%20in%20%22Appears%20with%3A%22.meta.js
// ==/UserScript==


// GOOD 1
//.bio-list>li> a[data-img^="https://static.thenude.com/models/"]

$( ".bio-list>li> a[data-img^='https://static.thenude.com/models/']" ).each(function() {
  var attr = $(this).attr('data-img');
  if (typeof attr !== typeof undefined && attr !== false) {
      // 'url('+attr+')' should be  "url("+attr+")"
        $(this).css('background-image' , 'url("'+attr+'")' );
    }
})

// add CSS
$('head').append(`
<style type='text/css'>
ul.bio-list  {
    display: inline-block !important;
    text-align: left !important;
}
ul.bio-list li {
    text-align: left !important;
}

ul.bio-list .list-quest {
    display: inline-block;
    width: 100% !important;
    text-align: left !important;
    font-size: 15px !important;
    background: #111;
}
ul.bio-list >li> a[data-img^='https://static.thenude.com/models/'] {
    display: inline-block !important;
    vertical-align: bottom !important;
    background-size : contain !important;
    background-repeat : no-repeat !important;
    background-position: center 25px !important;
    line-height: 15px !important;
    height: 100% !important;
    min-height : 195px !important;
    max-height : 195px !important;
    width : 100% !important;
    min-width : 150px !important;
    max-width : 150px !important;
    margin: 0 -45px 5px 0 !important;
    padding: 5px 0 0px 0 !important;
    text-align: center !important;
    font-size: 15px !important;
    overflow: hidden !important;
background-color: black !important;
border: 1px solid red !important;
}

</style>
`)
console.log('TheNude: CSS added')
