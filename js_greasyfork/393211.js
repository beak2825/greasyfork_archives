// ==UserScript==
// @name         Moodle Fixer
// @namespace    
// @version      0.6.1
// @description  Fjerner alt det lort Moodle har ændret.
// @author       Mathias S 3.A
// @match        https://moodle.celf.dk/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393211/Moodle%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/393211/Moodle%20Fixer.meta.js
// ==/UserScript==

function checkStjerneMarkedeKurser() {

    $('div [data-region="starred-courses-view-content"]').find('.card-deck').css('flex-direction','column')
    $('div [data-region="starred-courses-view-content"]').find('.card-deck').css('overflow-x','auto')
    $('div [data-region="starred-courses-view-content"]').find('.card-deck').css('overflow-y','scroll')
    $('div [data-region="starred-courses-view-content"]').find('.card-deck').css('max-height','300px')
    $('div [data-region="starred-courses-view-content"]').find('.card-img').remove()
}

function checkSenestBesøgteKurser() {
    $('div [data-region="recentlyaccessedcourses-view-content"]').find('.card-deck').css('flex-direction','column')
    $('div [data-region="recentlyaccessedcourses-view-content"]').find('.card-deck').css('overflow-x','auto')
    $('div [data-region="recentlyaccessedcourses-view-content"]').find('.card-deck').css('overflow-y','scroll')
    $('div [data-region="recentlyaccessedcourses-view-content"]').find('.card-deck').css('max-height','300px')

    $('div [data-region="recentlyaccessedcourses-view-content"]').find('.card-img').remove()
}

function checkSenestBesøgteElementer() {
    $('div [data-region="recentlyaccesseditems-view-content"]').find('.card-deck').css('flex-direction','column')
    $('div [data-region="recentlyaccesseditems-view-content"]').find('.card-deck').css('overflow-x','auto')
    $('div [data-region="recentlyaccesseditems-view-content"]').find('.card-deck').css('overflow-y','scroll')
    $('div [data-region="recentlyaccesseditems-view-content"]').find('.card-deck').css('max-height','300px')
}


function flytTidslinje() {
    let d = $('#inst6113')
    $('#inst6113').parent().prepend(d)
}

function flytSkema() {
    let skema = $('#inst1823')
    $('#inst1823').parent().prepend(skema)
}

function flytKurser() {
    let kurser = $('#inst8')
    $('#inst8').parent().prepend(kurser)
}

function opdaterMineKurser() {
    $('body #page #nav-drawer a.list-group-item[data-type="20"]').remove()

    let overviewType = $('[aria-labelledby="displaydropdown"]').find('.active').attr('data-value')

    if (overviewType === 'list') {

        $('[data-region="paged-content-page"] ul li').each(function () {

        let courseId = $(this).attr('data-course-id')
        let courseName = $(this).find('.coursename').text()

        courseName = courseName.replace(/ +(?= )/g,'');

        if (courseName.includes('Kurset er markeret med stjerne')) {
            courseName = courseName.replace('Kurset er markeret med stjerne', '')
        }

        if (courseName.includes('Kursusnavn')) {
            courseName = courseName.replace('Kursusnavn', '')
        }

       let a = `<a class="list-group-item list-group-item-action " href="https://moodle.celf.dk/course/view.php?id=${courseId}" data-key="${courseId}" data-isexpandable="0" data-indent="1" data-showdivider="0" data-type="20" data-nodetype="1" data-collapse="0" data-forceopen="0" data-isactive="0" data-hidden="0" data-preceedwithhr="0" data-parent-key="mycourses" id="localboostnavigation${courseId}">${courseName}</a>`

        $(a).insertAfter($('[data-region="drawer"] a').first())

    })

    }
    if (overviewType === 'cards') {

        $('[data-region="paged-content-page"]').first().children().children().each(function () {


          let courseId = $(this).attr('data-course-id')
          let courseName = $(this).find('.coursename').children().last().text()

          courseName = courseName.replace(/ +(?= )/g,'');

           let a = `<a class="list-group-item list-group-item-action " href="https://moodle.celf.dk/course/view.php?id=${courseId}" data-key="${courseId}" data-isexpandable="0" data-indent="1" data-showdivider="0" data-type="20" data-nodetype="1" data-collapse="0" data-forceopen="0" data-isactive="0" data-hidden="0" data-preceedwithhr="0" data-parent-key="mycourses" id="localboostnavigation${courseId}">${courseName}</a>`

           $(a).insertAfter($('[data-region="drawer"] a').first())
        })

    }
    if (overviewType === 'summary') {

        $('[data-region="paged-content-page"]').first().children().children().each(function () {


          let courseId = $(this).attr('data-course-id')
          let courseName = $(this).find('.coursename').find('h6').text()

          courseName = courseName.replace(/ +(?= )/g,'');

           let a = `<a class="list-group-item list-group-item-action " href="https://moodle.celf.dk/course/view.php?id=${courseId}" data-key="${courseId}" data-isexpandable="0" data-indent="1" data-showdivider="0" data-type="20" data-nodetype="1" data-collapse="0" data-forceopen="0" data-isactive="0" data-hidden="0" data-preceedwithhr="0" data-parent-key="mycourses" id="localboostnavigation${courseId}">${courseName}</a>`

           $(a).insertAfter($('[data-region="drawer"] a').first())
        })

    }

    $('[data-key="mycourses"]').remove()
}


function retSkema() {
    $('body.pagelayout-mydashboard div#page-wrapper div#page div#page-content div#region-main-box section#region-main div.card.card-block iframe').css({ 'height' : '1000px'})
}

$(document).on('DOMSubtreeModified', 'div [data-region="recentlyaccesseditems-view-content"]', function() {
    checkSenestBesøgteElementer()
});

$(document).on('DOMSubtreeModified', 'div [data-region="recentlyaccessedcourses-view-content"]', function() {
    checkSenestBesøgteKurser()
});

$(document).on('DOMSubtreeModified', 'div [data-region="starred-courses-view-content"]', function() {
    checkStjerneMarkedeKurser()
});

$(document).on('DOMSubtreeModified', 'div [data-region="courses-view"]', function() {
    opdaterMineKurser()
});

$(window).on('load', function() {
    flytKurser()
    flytSkema()
    flytTidslinje()
    retSkema()
});