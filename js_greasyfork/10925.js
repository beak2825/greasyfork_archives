// ==UserScript==
// @name        %name%
// @description Does some stuff.
// @version     1.0
// @author      DCI
// @namespace   http://www.redpandanetwork.org
// @include     https://s3.amazonaws.com/*
// @include     https://www.mturkcontent.com/*
// @include     %include%
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/10925/%25name%25.user.js
// @updateURL https://update.greasyfork.org/scripts/10925/%25name%25.meta.js
// ==/UserScript==

var $j = jQuery.noConflict(true);

var textsearch = $j( ":contains('xxxxxxxx')" );
if (textsearch.length){runscript()}

function runscript (){
focus();



}

/*


$j("#IdHere").eq(0).click();

$j(".ClassHere").eq(0).click();

$j("TagName").eq(0).click();

$j('input[type="radio"]').eq(0).click();

$j('input[type="checkbox"]').eq(0).prop('checked', true);

$j('input[type="text"]').first().focus();

$j('input[type="text"]').last().change(function(){
popup.close()
$j("#submitButton").eq(0).click();
});

$j('.panel-heading').hide(); // new style instruction hide
$j('.panel-body').hide();
$j('.panel.panel-primary').hide();

var DropdownMenu = document.getElementsByTagName('select')[0]; 
DropdownMenu.selectedIndex = 1;

$j('#textfield').val('My text');

var textsearch = $j( ":contains('xxxxxxxx')" );
if (textsearch.length){}

var TargetLink = $j("a:contains('xxxxxxx')")
if (TargetLink.length){
window.open(TargetLink[0].href,'_blank');

setTimeout(function(){xxxxxxxxxxxxxxxxxx},0200);

location.reload(true);

window.location.replace("https://www.mturk.com");

document.title = "My New Page Title";

chimeSound = new Audio("http://static1.grsites.com/archive/sounds/birds/birds008.wav");
chimeSound.play(); 

var TextExtract = document.getElementsByTagName('h3')[1].innerHTML;
var TextExtract2 = TextExtract.replace('Extra text','');

var texturl = "https://encrypted.google.com/maps/place/" + encodeURIComponent(TextExtract2);

var texturl = "https://encrypted.youtube.com/user/" + encodeURIComponent(TextExtract2);

var texturl = "https://encrypted.google.com/search?q=site:yelp.com " + encodeURIComponent(TextExtract2);

var texturl = "https://encrypted.google.com/search?q=site:linkedin.com " + encodeURIComponent(TextExtract2);

GM_openInTab(texturl) + " Additional Text");

popup = window.open((texturl), "", "width=955, height=1052, left=965, scrollbars=yes");
$j('#submitButton')[0].onclick = function closer(){popup.close()}

popup = window.open((texturl), "", "width=952, height=465, left=962, scrollbars=yes, statusbar=no");
popup = window.open((texturl), "", "width=952, height=465, left=962, top=514, scrollbars=yes, statusbar=no");
$j('#submitButton')[0].onclick = function closer(){popup.close()}

var iframe = document.createElement('iframe');
iframe.src = "http://www.google.com/custom?q=" + (searchterms);
$j(iframe).css('width', '80%');
$j(iframe).css('height', '500px');
$j(iframe).css('margin', '0 auto');
$j(iframe).css('display', 'block');
//iframe.sandbox = 'allow-scripts';
$j('body').prepend(iframe);

document.addEventListener( "keydown", press, false);

function press(i) {

if ( i.keyCode == 112 ) { //F1 - 
i.preventDefault();
$j('#submitButton').click();
}

if ( i.keyCode == 113 ) { //F2 - 
i.preventDefault();
}

if ( i.keyCode == 114 ) { //F3 - 
i.preventDefault();
}

if ( i.keyCode == 115 ) { //F4 - 
i.preventDefault();
}

if ( i.keyCode == 112 ) { //F5 - 
i.preventDefault();
}

if ( i.keyCode == 27 ) { //ESC - 
i.preventDefault();
}

document.addEventListener( "keydown", press, false);

function press(i) {

if ( i.keyCode == 65 || i.keyCode == 97 ) { //A or npad 1 - 
}

if ( i.keyCode == 83 || i.keyCode == 98 ) { //S or npad 2 - 
}

if ( i.keyCode == 68 || i.keyCode == 99 ) { //D or npad 3 - 
}

if ( i.keyCode == 70 || i.keyCode == 100 ) { //F or npad 4 - 
}

if ( i.keyCode == 71 || i.keyCode == 101 ) { //G or npad 5 -
} 

if ( i.keyCode == 81 || i.keyCode == 102 ) { //Q or npad 6 - 
}

if ( i.keyCode == 87 || i.keyCode == 103 ) { //W or npad 7 - 
}
}


*/