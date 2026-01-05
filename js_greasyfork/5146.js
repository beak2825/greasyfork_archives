// ==UserScript==
// @name        Web Test
// @namespace   DCI
// @include     https://s3.amazonaws.com/mturk_bulk/*
// @version     1.2
// @grant       none
// @require     http://code.jquery.com/jquery-latest.min.js
// @description webbies
// @downloadURL https://update.greasyfork.org/scripts/5146/Web%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/5146/Web%20Test.meta.js
// ==/UserScript==

var TargetLink = $("a:contains('their profile')")
if (TargetLink.length){window.open(TargetLink[0].href,'_blank');}

$('input[id="Q1LinktoWebpage"]').eq(0).click();
$('input[id="Q3aName"]').eq(0).click();
$('input[id="Q3bAddress"]').eq(0).click();
$('input[id="Q3cPhone"]').eq(0).click();
$('input[id="Q3dEmail"]').eq(0).click();
$('input[id="Q3eBackground"]').eq(1).click();
$('input[id="Q3gFirstPersonPoV"]').eq(1).click();
$('input[id="Q3hAssociate"]').eq(1).click();
$('input[id="Q3iExperience"]').eq(1).click();
$('input[id="Q3jEducation"]').eq(1).click();
$('input[id="Q3kAreasofFocus"]').eq(1).click();
$('input[id="Q3lCommunityInvolvement"]').eq(1).click();
$('#Q2JobTitle').val('Financial Advisor');

document.addEventListener( "keydown", kas, false);

function kas(i) {  
if ( i.keyCode == 27 ) { // ESC

$('input[id="Q5LinktoWebpage"]').eq(0).click();
$('input[id="Q1LinktoWebpage"]').prop("checked",false);
$('input[id="Q3aName"]').eq(0).prop("checked",false);
$('input[id="Q3bAddress"]').prop("checked",false);
$('input[id="Q3cPhone"]').prop("checked",false);
$('input[id="Q3dEmail"]').prop("checked",false);
$('input[id="Q3eBackground"]').prop("checked",false);
$('input[id="Q3gFirstPersonPoV"]').prop("checked",false);
$('input[id="Q3hAssociate"]').prop("checked",false);
$('input[id="Q3iExperience"]').prop("checked",false);
$('input[id="Q3jEducation"]').prop("checked",false);
$('input[id="Q3kAreasofFocus"]').prop("checked",false);
$('input[id="Q3lCommunityInvolvement"]').prop("checked",false);
$('#Q2JobTitle').val('');}
}









