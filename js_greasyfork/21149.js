// ==UserScript==
// @name         Pep - Rate 6 sec. Video Clips
// @namespace    https://greasyfork.org/en/users/27845
// @version      1.0
// @description  Sets default answers for rude videos.
// @author       Pablo Escobar
// @include      https://www.mturkcontent.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21149/Pep%20-%20Rate%206%20sec%20Video%20Clips.user.js
// @updateURL https://update.greasyfork.org/scripts/21149/Pep%20-%20Rate%206%20sec%20Video%20Clips.meta.js
// ==/UserScript==


$('[name=Q1Emotion] option').filter(function() {
    return ($(this).text() == 'Neutral/no emotion'); //To select Neutral/no emotion
}).prop('selected', true);

$('[name=Q2Feeling] option').filter(function() {
    return ($(this).text() == '4. Neither upset nor happy'); //To select 4. Neither upset nor happy
}).prop('selected', true);

$('[name=Q3Arousal] option').filter(function() {
    return ($(this).text() == '1. Calm, completely relaxed, and/or sleepy'); //To select 1. Calm, completely relaxed, and/or sleepy
}).prop('selected', true);

$('[name=Q4Believability] option').filter(function() {
    return ($(this).text() == '7. Extremely believable'); //To select 7. Extremely believable
}).prop('selected', true);

$('[name=Q5Sex] option').filter(function() {
    return ($(this).text() == '1. Male'); //To select 1. Male
}).prop('selected', true);

$('[name=Q6Age]').val("38"); //To set your age