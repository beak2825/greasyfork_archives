// ==UserScript==
// @name         Schoology NCMS
// @version      1.0
// @description  Cool themes
// @author       @anonfanta#0001
// @grant        none
// @include      https://app.schoology.com/*
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/122434
// @downloadURL https://update.greasyfork.org/scripts/420510/Schoology%20NCMS.user.js
// @updateURL https://update.greasyfork.org/scripts/420510/Schoology%20NCMS.meta.js
// ==/UserScript==
$('.leaf first active-trail even').hide();
var bb = '#bb0202';
$('h2').text('9 for help');
function grade() {
    var grade = prompt('What do you want your grade to be? (only caps letters)');
    $('.awarded-grade').text(grade);
    if (grade[0] === 'A') {
        $('.awarded-grade').text(grade + ' (98%)');
    } if (grade[0] === 'B') {
        $('.awarded-grade').text(grade + ' (89%)');
    } if (grade[0] === 'C') {
        $('.awarded-grade').text(grade + ' (77%)');
    } if (grade[0] === 'D') {
        $('.awarded-grade').text(grade + ' (73%)');
    } if (grade[0] === 'F') {
        $('.awarded-grade').text(grade + ' (59%)');
    } if (grade[1] === ' ') {
        $('.awarded-grade').text(grade + ' ');
    } if (grade[1] === '(') {
        $('.awarded-grade').text(grade + ' ');
    }
}
function custom() {
    var ask = prompt('Customize? yes/no');
    if (ask === 'yes') {
        var back = prompt('Please input your background color (start it with a #');
        if (back[0] !== '#') {
            alert('please add a #');
        } if (back[0] === '#') {
            $('#body').css('background', back);
        }
        var main = prompt('What do you want your main to be?');
        if (main[0] !== '#') {
            alert('please add a #');
        } if (main[0] === '#') {
            $('#main').css('background', main);
            $('#main-content-wrapper').css('background', main);
            $('#main-content-wrapper').css('border', main);
            $('.with-tabs #center-top, .has-right-col .with-tabs #center-top').css('background', main);
            $('.gradebook-course, .attendance-course').css('border-top', main);
            $('body ul.primary').css('background', main);
            $('#home-feed-container #smart-box').css('border-bottom', main);
            $('.has-right-col #center-top').css('background', main);
            $('.s-like-sentence').css('background', main);
            $('.feed-comments').css('background', main);
            $('#sidebar-left .active-trail a, #left-nav #menu-s-main .menu .menu a.active, #sidebar-left .menu .expanded.active-trail a.active, #sidebar-left #left-nav .menu .expanded.active-trail .active-trail-dist-1 a, #sidebar-left #left-nav .menu .expanded.active-trail .menu .active-trail-dist-2 a').css('background-color', main);
            $('#header').css('background', main);
            $('body .search-toggle, body #primary-settings .unfold').css('background-color', main);
            $('.search-break').hide();
            $('#home').hide();
            $('#menu-3').hide();
            $('edge-footer').hide();
            $('#right-column').hide();
            $('s-like-sentence').hide();
        }
    } else {
        alert('Bye!');
    }

}
nenter();
function normal() {
    nenter();
    $('.search-break').show();
    $('#home').show();
    $('#menu-3').show();
    $('edge-footer').show();
    $('#right-column').show();
    $('s-like-sentence').show();
    $('#body').css('background', '#faf9f7');
    $('#header').css('background', '#ff8f00');
    $('.dropdown').css('color', '#10bdf1');
    $('#sidebar-left .active-trail a, #left-nav #menu-s-main .menu .menu a.active, #sidebar-left .menu .expanded.active-trail a.active, #sidebar-left #left-nav .menu .expanded.active-trail .active-trail-dist-1 a, #sidebar-left #left-nav .menu .expanded.active-trail .menu .active-trail-dist-2 a').css('background-color', '#ffffff');
    $('body .search-toggle, body #primary-settings .unfold').css('border-color', '#FF0000');
    $('body .search-toggle, body #primary-settings .unfold').css('background-color', '#ff9f10');
    $('body a, body .clickable, body .smart-box .filter-block li a, body #content-left-top .item-list li a, body .popups-tab, body .enrollment-filters span, body .grading-groups-list .grading-group, body #grading-group-create:hover').css('color', '#000000');
    $('#main').css('background', '#ffffff');
    $('#main-content-wrapper').css('background', '#ffffff');
    $('#main-content-wrapper').css('border', '#ffffff');
    $('.with-tabs #center-top, .has-right-col .with-tabs #center-top').css('background', '#ffffff');
    $('.gradebook-course, .attendance-course').css('border-top', '#ffffff');
    $('body ul.primary').css('background', '#ffffff');
    $('#home-feed-container #smart-box').css('border-bottom', '#ffffff');
    $('.has-right-col #center-top').css('background', '#ffffff');
    $('#center-top').css('border-bottom', '#229bbf');
    $('.realm-filter-tool #edge-filters').css('background', '#229bbf');
    $('.s-like-sentence').css('background', '#ffffff');
    $('.feed-comments').css('background', '#ffffff');

}
function renter() {

    $('#header').mouseenter(function(){
            $('#header').css('background', '#c02828');
    });
    $('#header').mouseout(function(){
        $('#header').css('background', '#bb0202');
    });
}
function benter() {

    $('#header').mouseenter(function(){
            $('#header').css('background', '#4fcdf3');
    });
    $('#header').mouseout(function(){
        $('#header').css('background', '#10bdf1');
    });
}
function genter() {

    $('#header').mouseenter(function(){
            $('#header').css('background', '#848485');
    });
    $('#header').mouseout(function(){
        $('#header').css('background', '#7a7b7c');
    });
}
function nenter() {

    $('#header').mouseenter(function(){
            $('#header').css('background', '#ffa635');
    });
    $('#header').mouseout(function(){
        $('#header').css('background', '#ff8f00');
    });
}
function center() {

    $('#header').mouseenter(function(){
            $('#header').css('background', '#main');
    });
    $('#header').mouseout(function(){
        $('#header').css('background', '#main');
    });
}
function style3() {
    renter();
    $('.search-break').hide();
    $('h2').text('***Made By anonfanta#0001***         Press 9 for help');
    $('#home').hide();
    $('#menu-3').hide();
    $('edge-footer').hide();
    $('#right-column').hide();
    $('s-like-sentence').hide();
    $('#header').css('background', '#bb0202');
    $('.dropdown').css('color', '#10bdf1');
    $('#body').css('background', '#ce0000');
    $('#sidebar-left .active-trail a, #left-nav #menu-s-main .menu .menu a.active, #sidebar-left .menu .expanded.active-trail a.active, #sidebar-left #left-nav .menu .expanded.active-trail .active-trail-dist-1 a, #sidebar-left #left-nav .menu .expanded.active-trail .menu .active-trail-dist-2 a').css('background-color', '#c40000');
    $('body .search-toggle, body #primary-settings .unfold').css('border-color', '#FF0000');
    $('body .search-toggle, body #primary-settings .unfold').css('background-color', '#ce0000');
    $('body a, body .clickable, body .smart-box .filter-block li a, body #content-left-top .item-list li a, body .popups-tab, body .enrollment-filters span, body .grading-groups-list .grading-group, body #grading-group-create:hover').css('color', '#000000');
    $('#main').css('background', '#c40000');
    $('#main-content-wrapper').css('background', '#c40000');
    $('#main-content-wrapper').css('border', '#c40000');
    $('.with-tabs #center-top, .has-right-col .with-tabs #center-top').css('background', '#c40000');
    $('.gradebook-course, .attendance-course').css('border-top', '#c40000');
    $('body ul.primary').css('background', '#c40000');
    $('#home-feed-container #smart-box').css('border-bottom', '#c40000');
    $('.has-right-col #center-top').css('background', '#c40000');
    $('#center-top').css('border-bottom', '#229bbf');
    $('.realm-filter-tool #edge-filters').css('background', '#229bbf');
    $('.s-like-sentence').css('background', '#c40000');
    $('.feed-comments').css('background', '#c40000');
}
function s2() {
    benter();
    $('h2').text('***Made By anonfanta#0001***         Press 9 for help');
    $('#header').css('background', '#10bdf1');
    $('.search-break').hide();
    $('#home').hide();
    $('.dropdown').css('color', '#10bdf1');
    $('#body').css('background', '#48aadb');
    $('#menu-3').hide();
    $('#sidebar-left .active-trail a, #left-nav #menu-s-main .menu .menu a.active, #sidebar-left .menu .expanded.active-trail a.active, #sidebar-left #left-nav .menu .expanded.active-trail .active-trail-dist-1 a, #sidebar-left #left-nav .menu .expanded.active-trail .menu .active-trail-dist-2 a').css('background-color', '#48a0dd');
    $('body .search-toggle, body #primary-settings .unfold').css('border-color', '#FF0000');
    $('body .search-toggle, body #primary-settings .unfold').css('background-color', '#48aadb');
    $('body a, body .clickable, body .smart-box .filter-block li a, body #content-left-top .item-list li a, body .popups-tab, body .enrollment-filters span, body .grading-groups-list .grading-group, body #grading-group-create:hover').css('color', '#000000');
    $('#main').css('background', '#48a0dd');
    $('#main-content-wrapper').css('background', '#48a0dd');
    $('#main-content-wrapper').css('border', '#48a0dd');
    $('.with-tabs #center-top, .has-right-col .with-tabs #center-top').css('background', '#48a0dd');
    $('.gradebook-course, .attendance-course').css('border-top', '#48a0dd');
    $('body ul.primary').css('background', '#48a0dd');
    $('#home-feed-container #smart-box').css('border-bottom', '#48a0dd');
    $('edge-footer').hide();
    $('.has-right-col #center-top').css('background', '#48a0dd');
    $('#center-top').css('border-bottom', '#229bbf');
    $('.realm-filter-tool #edge-filters').css('background', '#229bbf');
    $('#right-column').hide();
    $('s-like-sentence').hide();
    $('.s-like-sentence').css('background', '#48a0dd');
    $('.feed-comments').css('background', '#48a0dd');
}
function s1() {
    genter();
    $('h2').text('***Made By anonfanta#0001**        Press 9 for help');
    $('.search-break').hide();
    $('#home').hide();
    $('#menu-3').hide();
    $('edge-footer').hide();
    $('#right-column').hide();
    $('s-like-sentence').hide();
    $('#header').css('background', '#7a7b7c');
    $('.dropdown').css('color', '#10bdf1');
    $('#body').css('background', '#6d6f72');
    $('#sidebar-left .active-trail a, #left-nav #menu-s-main .menu .menu a.active, #sidebar-left .menu .expanded.active-trail a.active, #sidebar-left #left-nav .menu .expanded.active-trail .active-trail-dist-1 a, #sidebar-left #left-nav .menu .expanded.active-trail .menu .active-trail-dist-2 a').css('background-color', '#696b6d');
    $('body .search-toggle, body #primary-settings .unfold').css('border-color', '#FF0000');
    $('body .search-toggle, body #primary-settings .unfold').css('background-color', '#6d6f72');
    $('body a, body .clickable, body .smart-box .filter-block li a, body #content-left-top .item-list li a, body .popups-tab, body .enrollment-filters span, body .grading-groups-list .grading-group, body #grading-group-create:hover').css('color', '#000000');
    $('#main').css('background', '#696b6d');
    $('#main-content-wrapper').css('background', '#696b6d');
    $('#main-content-wrapper').css('border', '#696b6d');
    $('.with-tabs #center-top, .has-right-col .with-tabs #center-top').css('background', '#696b6d');
    $('.gradebook-course, .attendance-course').css('border-top', '#696b6d');
    $('body ul.primary').css('background', '#696b6d');
    $('#home-feed-container #smart-box').css('border-bottom', '#696b6d');
    $('.has-right-col #center-top').css('background', '#696b6d');
    $('#center-top').css('border-bottom', '#229bbf');
    $('.realm-filter-tool #edge-filters').css('background', '#229bbf');
    $('.s-like-sentence').css('background', '#696b6d');
    $('#profile-picture').attr('src', 'https://yt3.ggpht.com/-5lj2cgSTiak/AAAAAAAAAAI/AAAAAAAAAAA/mQjl4g7nlc4/s900-c-k-no-mo-rj-c0xffffff/photo.jpg');
    $('.feed-comments').css('background', '#696b6d');
}
var a = Math.floor(Math.random() * 25);

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '49') {
        s1();
    }
    if (e.keyCode == '50') {
        s2();
    }
    if (e.keyCode == '51') {
        style3();
    }
    if (e.keyCode == '192') {
        custom();
    }
    if (e.keyCode == '48') {
        normal();
    }
    if (e.keyCode == '189') {
        grade();
    }
    if (e.keyCode == '53') {
        $('#nuke').toggle();
    }
    if (e.keyCode == '52') {
        $('#mario').toggle();
    }
    if (e.keyCode == '57') {
        alert('Yo, Thanks for installing this script and giving me dinero. Press 1, 2, or 3 for the colored presets. You can press ~ for a custom theme where you put in your own color code! Make sure you include a # though! If you want to get back to normal without reloading you can press 0. If you are on a grades page you can press - to change your grades, make sure your grade letter is capitalized, You can press 4 to toggle the mario game. The controls are WASD. You can press 5 to toggle a nuke.');
    }
    if (e.keyCode == '87') {
     $( "#mario" ).animate({
        top: "-=25",
        }, 200, function() {
  }).delay(5).animate({
        top: "-=-15",
        }, 100, function() {
  });
    }
    if (e.keyCode == '83') {
     $( "#mario" ).animate({
        top: "-=15",
        }, 200, function() {
  }).delay(5).animate({
        top: "-=-25",
        }, 100, function() {
  });
    }
    if (e.keyCode == '65') {
     $( "#mario" ).animate({
        left: "-=25",
        }, 200, function() {
  });
    }
    if (e.keyCode == '68') {
     $( "#mario" ).animate({
        left: "-=-25",
        }, 200, function() {
  });
    }
    if (e.keyCode == '87') {
     $( "#mush1" ).animate({
        top: "-=25",
        }, 200, function() {
  }).delay(5).animate({
        top: "-=-15",
        }, 100, function() {
  });
    }
    if (e.keyCode == '83') {
     $( "#mush1" ).animate({
        top: "-=15",
        }, 200, function() {
  }).delay(5).animate({
        top: "-=-25",
        }, 100, function() {
  });
    }
    if (e.keyCode == '65') {
     $( "#mush1" ).animate({
        left: "-=25",
        }, 200, function() {
  });
    }
    if (e.keyCode == '68') {
     $( "#mush1" ).animate({
        left: "-=-25",
        }, 200, function() {
  });
    }
}
$('#container').append('<img src="https://tolmema.files.wordpress.com/2013/02/8-bit-mario.png" width="60" height="75" alt="mario" title="mario" id="mario"/>');
$('#mario').hide();
$('#mario').css('position', 'absolute');
$('#mario').css('top', '255px');
$('#mario').css('left', '610px');
$('#container').append('<img src="https://s-media-cache-ak0.pinimg.com/originals/4d/2b/06/4d2b069f141036404857d5eb7ace182d.png" width="40" height="40" alt="m" title="m" id="mush1"/>');
$('#mush1').hide();
$('#mush1').css('position', 'absolute');
$('#mush1').css('top', '255px');
$('#mush1').css('left', '610px');
$('#body').append('<img src="http://bestanimations.com/Military/Explosions/atomic-mushroom-cloud-explosion-2-2.gif" width="1350" height="700" alt="nu" title="nu" id="nuke"/>');
$('#nuke').hide();
$('#nuke').css('position', 'absolute');
$('#nuke').css('top', '0px');
$('#nuke').css('left', '0px');
$('nuke').hide();