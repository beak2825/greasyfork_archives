// ==UserScript==
// @name  Amazon Category Validation for Mturk
// @require  http://code.jquery.com/jquery-latest.min.js
// @namespace  Waffles
// @version  Use at your own risk
// @description  Categorize
// @author  TastyWaffles-MTG
// @include  https://www.mturkcontent.com/*
// @include  https://www.mturk.com/*
// @downloadURL https://update.greasyfork.org/scripts/10383/Amazon%20Category%20Validation%20for%20Mturk.user.js
// @updateURL https://update.greasyfork.org/scripts/10383/Amazon%20Category%20Validation%20for%20Mturk.meta.js
// ==/UserScript==
// Press :
//F for Financial/Obscene
//U for Unsure
//N for No
//O for One
//M for multiples
//P for Partial (After clicking O)
//S to Submit

$(window).keyup(function(oph) {
if (oph.which == 70) { $('input[value="Obscene_Finance"]').click(); }
});

$(window).keyup(function(oph) {
if (oph.which == 85) { $('input[value="Cannot_See_Unsure"]').click(); }
});

$(window).keyup(function(oph) {
if (oph.which == 78) { $('input[value="Missing_Object"]').click(); }
});

$(window).keyup(function(oph) {
if (oph.which == 79) { $('input[value="Valid_Object"]').click(); }
});

$(window).keyup(function(oph) {
if (oph.which == 77) { $('input[value="Multiple_Objects"]').click(); }
});

$(window).keyup(function(oph) {
if (oph.which == 80) { $('input[value="Partial_Object"]').click(); }
});

$(window).keyup(function(oph) {
if (oph.which == 83) { $('#submitButton').click(); }
});