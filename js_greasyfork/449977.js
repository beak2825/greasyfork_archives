// ==UserScript==
// @name          IndeXXX - Show directly thumbnails of Actress v.2.66
// @description	  Show directly thumbnails of Actress
// @author        janvier57
// @namespace     https://greasyfork.org/users/7434
// @include       https://www.indexxx.com/*
// @match         https://www.indexxx.com/*
// @version       2.66
// @icon        https://www.indexxx.com/apple-touch-icon.png
// @license       unlicense
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/449977/IndeXXX%20-%20Show%20directly%20thumbnails%20of%20Actress%20v266.user.js
// @updateURL https://update.greasyfork.org/scripts/449977/IndeXXX%20-%20Show%20directly%20thumbnails%20of%20Actress%20v266.meta.js
// ==/UserScript==

    // GOOD 1

//    $( ".bio-list>li> a[data-img^='https://static.thenude.com/models/']" ).each(function() {
$( ".modelLink.item[data-modelphoto^='https://img.indexxx.com/images/models/']" ).each(function() {
      var attr = $(this).attr('data-modelphoto');
      if (typeof attr !== typeof undefined && attr !== false) {
          // 'url('+attr+')' should be  "url("+attr+")"
            $(this).css('background-image' , 'url("'+attr+'")' );
        }
    })

    // add CSS
    $('head').append(`
    <style type='text/css'>
/* === (new65) x- IndeXX - SETs - Show directly thumbnails of Actress - v.2.65 ==== */
.block1.clearfix {
background: #222 !important;
border: 1px solid gray;
}
.floatingElementsContainer .pset.card.text-center.border-0.smaller.mb-3.mb-md-0 {
    position: relative !important;
    float: left !important;
    height: auto !important;
    height: 190px !important;;
    line-height: 15px;
    min-width: 32% !important;
    max-width: 32% !important;
    top: 0;
    margin: 0 5px 4px 10px !important;
    padding-top: 3px !important;
    border-radius: 5px;
    text-align: center;
background: #333 !important;
border: 1px solid gray;
}

.pset.card.text-center.border-0.smaller.mb-3.mb-md-0 .photoSection.card-img-top.d-flex.align-items-end.justify-content-center {
    display: inline-block !important;
    height: 181px !important;
    width: 48% !important;
    overflow: hidden !important;
border: 1px solid #222 !important;
} 
.pset .photoSection > div {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    overflow: hidden;
}
.psetInfo {
    position: absolute !important;
    display: inline-block !important;
    max-height: 180px !important;
    min-height: 180px !important;
    width: 50% !important;
    top: 0 !important;
    right: 0 !important;
    overflow: hidden !important;
border-left: 1px solid red !important;
} 

.pset ul {
    position: relative !important;
    display: inline-block !important;
    width: 99% !important;
    max-height: 145px !important;
    min-height: 145px !important;
    bottom: 0;
    left: 0;
    margin-left: 1px;
    overflow: hidden;
    overflow-y: auto !important;
    padding: 0;
/* border: 1px solid aqua !important; */
}
.pset ul .modelLink.item:not([style="color: red;"]) {
    display: inline-block !important;
    min-height: 70px !important;
    max-height: 70px !important;
    line-height: 15px !important;
    width: 100% !important;
    min-width: 48% !important;
    max-width: 48% !important;
    margin: 0 0px 0 0 !important;
    padding: 0px 0 0px 0  !important;
    vertical-align: bottom !important;
    background-size : contain !important;
    background-repeat : no-repeat !important;
    background-position: center 18px !important;
    visibility: visible !important;
    opacity: 1 !important;
color: gold !important;
background-color: #111 !important;
border: 1px solid red !important;
}
.pset ul .modelLink.item:not([style="color: red;"]):not([style^="background-image"]) {
    display: inline-block !important;
    min-height: 20px !important;
    max-height: 20px !important;
    line-height: 20px !important;
    width: 85px !important;
    margin: 0px 0px 0 0 !important;
color: gold !important;
background-color: #111 !important;
border: 1px solid red !important;
}
.pset:hover ul .modelLink.item:not([style="color: red;"]):not([style^="background-image"]) {
    margin: 4px 0px 0 0 !important;
}

.pset ul  a.modelLink.item:not([style="color: red;"]) {
    color: peru !important;
background-color: #111 !important;
}
.pset .psetInfo >  .my-2.my-sm-1.my-md-0 a{
    text-decoration: none !important;
    cursor: pointer !important;
    color: gray !important;
/* background-color: #111 !important; */
}
.pset .psetInfo >  .my-2.my-sm-1.my-md-0 a time{
    text-decoration: none !important;
    cursor: pointer !important;
    color: gray !important;
}
.pset .psetInfo .psWebsite.card-link.mb-md-0 {
    text-decoration: none !important;
    color: peru !important;
background-color: #111 !important;
}

.pset .models.card-link, 
.models.card-link ,
.pset:hover .models.card-link, 
.models.card-link:hover {
    position: relative !important;
    display: inline-block !important;
    width: 97.5% !important;
    max-height: 150px !important;
    min-height: 150px !important;
    bottom: 0;
    left: 0;
    margin-left: 1px;
    overflow: hidden;
    padding: 0 !important;
background: #222 !important;
/* border: 1px solid green !important; */
}

/*=== END == x- IndeXX - SETs - Show directly thumbnails of Actress ==== */
}
}
    </style>
    `)
    console.log('IndeXXX: CSS added')