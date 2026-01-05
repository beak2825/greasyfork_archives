// ==UserScript==
// @name         DL RedMp3
// @namespace    http://tampermonkey.net/
// @version      2
// @description  try to take over the world!
// @author       You
// @include      http://redmp3.su/*
// @include      https://redmp3.su/*
// @exclude      http://redmp3.su/album/*
// @exclude      https://redmp3.su/album/*
// @exclude      http://redmp3.su/artist/*
// @exclude      https://redmp3.su/artist/*

// @include      http://mp3red.su/*
// @include      https://mp3red.su/*
// @exclude      http://mp3red.su/album/*
// @exclude      https://mp3red.su/album/*
// @exclude      http://mp3red.su/artist/*
// @exclude      https://mp3red.su/artist/*

// @include      http://mp3red.co/*
// @include      https://mp3red.co/*
// @exclude      http://mp3red.co/album/*
// @exclude      https://mp3red.co/album/*
// @exclude      http://mp3red.co/artist/*
// @exclude      https://mp3red.co/artist/*

// @include      http://mp3red.cc/*
// @include      https://mp3red.cc/*
// @exclude      http://mp3red.cc/album/*
// @exclude      https://mp3red.cc/album/*
// @exclude      http://mp3red.cc/artist/*
// @exclude      https://mp3red.cc/artist/*

// @include      http://mp3red.me/*
// @include      https://mp3red.me/*
// @exclude      http://mp3red.me/album/*
// @exclude      https://mp3red.me/album/*
// @exclude      http://mp3red.me/artist/*
// @exclude      https://mp3red.me/artist/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22710/DL%20RedMp3.user.js
// @updateURL https://update.greasyfork.org/scripts/22710/DL%20RedMp3.meta.js
// ==/UserScript==

$('img').css('display','none');

$('document').ready(function() {
    //alert('test');
    $('img').css('display','none');
    window.location.href = $('#download_link').attr('href');
});