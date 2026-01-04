// ==UserScript==
// @name         RouteAnalyzer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       pacifn
// @match        https://route-stager-na.corp.amazon.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/406644/RouteAnalyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/406644/RouteAnalyzer.meta.js
// ==/UserScript==

let intervalHolder;

// Global configuration
const config = {
    isDebugging: false,
    refreshTime: 5000,
    dangerPickTimeSeconds: 60 * 30,
    highWarningPickTimeSeconds: 60 * 30,
    medWarningPickTimeSeconds: 60 * 20,
    routeProgressLeewayPercent: 70,
    warningTimes:{
        noCartMed: 60*7,
        noCartHigh: 60*10
    }
}

// Converts hh:ss:mm to seconds
function hmsToSecondsOnly(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}

// Clears all custom warming formatting
function clearFormatting(){
    $(".rt-tr-group").each(function( index ) {
        $(this).removeClass("route_completed");
        $(this).removeClass("high_level_warning");
        $(this).removeClass("med_level_warning");
        $(this).removeClass("no_warning");
    });
}

// Gets the number between brackets. For example: 'CX120 [1]' returns '1'
function getStringBetweenBrackets(str) {
    var matches = str.match(/\[(.*?)\]/);

    if (matches) {
        var submatch = matches[1];
        return submatch;
    }
    return '';
}

function attachWarning(type, element) {
    switch(type){
        case 'high':
            element.addClass('high_level_warning')
            break;
        
        case 'med':
            element.addClass('med_level_warning')
            break;
    }
}

function debug(msg){
    if (config.isDebugging) {
        console.log(msg);
    }
}

function isValidRouteTime(routeTime){
    return (routeTime != 0 && !isNaN(routeTime))
}

function addCustomStyles(){
    GM_addStyle(".danger_level_warning { background-color: red; color: white; }");
    GM_addStyle(".danger_level_warning span { color: white; }");
    GM_addStyle(".high_level_warning { background-color: red; color: white; }");
    GM_addStyle(".high_level_warning span { color: white; }");
    GM_addStyle(".med_level_warning { background-color: yellow; color : red;}");
    GM_addStyle(".med_level_warning span { color: red; }");
    GM_addStyle(".route_completed { background-color: green; color: white; }");
    GM_addStyle(".route_completed span { color: white; }");
    GM_addStyle(".script_status { padding: 1em; }");
}

function clearAndAnalyzeRoutes(){
    clearFormatting();
    analyzeRoutes();
}
function routeStatusIs(routeStatus, status) {
    switch (status) {
        case 'staged':
        case 'Staged':
            return routeStatus.includes("Staged")
        case 'Departed':
        case 'departed':
            return routeStatus.includes("Departed")
        case 'assignable':
        case 'Assignable':
            return routeStatus.includes("Assignable")
    }
    return false;
}
function routeTimeNoCartHigh(routeTime){
    return routeTime > config.warningTimes.noCartHigh;
}

function routeTimeNoCartMed(routeTime){
    return routeTime > config.warningTimes.noCartMed;
}
function routeTimeWarningHigh(routeTime){
    return routeTime > config.warningTimes.noCartHigh;
}

function routeTimeWarningMed(routeTime){
    return routeTime > config.warningTimes.noCartMed;
}

function routeHasNoCart(routeCarts) {
    return routeCarts == '';
}
function routePickTimeIsHigh(routeTime){
    return routeTime > config.highWarningPickTimeSeconds;
}
function routePickTimeIsMed(routeTime){
    return routeTime > config.medWarningPickTimeSeconds;
}

function analyzeRoutes() {
    debug('%c Analyzing routes! ', 'background: #222; color: #bada55');
    
    $(".rt-tr-group").each(function( index ) {
        if (index > 50) {
            return false;
        }
        let route = {
            ref: $(this),
            time: hmsToSecondsOnly($(this).children().children(":last-child").text()),
            code: $(this).children().children(":first-child").text(),
            carts: getStringBetweenBrackets($(this).children().children(":first-child").text()),
            status: $(this).children().children(":nth-child(5)").text(),
            progress: {
                picked: $(this).children().children(":nth-child(7)").text().split('/')[0],
                toPick: $(this).children().children(":nth-child(7)").text().split('/')[1],
                percentComplete:Math.round((
                    parseInt($(this).children().children(":nth-child(7)").text().split('/')[0]) /
                    parseInt($(this).children().children(":nth-child(7)").text().split('/')[1])* 100.0)*100.0
                ) / 100

            }
        }

        if(routeStatusIs(route.status, "assignable")){
            return;
        }

        if(routeStatusIs(route.status, "staged") || routeStatusIs(route.status, "departed")){
            return;
        }

        /*****************************
        *   No Cart Section
        ******************************/
        if (routeHasNoCart(route.carts) && routeTimeNoCartHigh(route.time)) {
            debug("Added high warning to " + route.code + " because no cart was scanned in over 10 minutes");
            attachWarning('high', route.ref);
            return
        }
    
        if (routeHasNoCart(route.carts) && routeTimeNoCartMed(route.time)) {
            debug("Added med warning to " + route.code + " because no cart was scanned in over 7 minutes");
            attachWarning('med', route.ref);
            return
        }

        /*****************************
        *   Long pick time section
        ******************************/
        if (isValidRouteTime(route.time) && routePickTimeIsHigh(route.time)) {

            if (route.progress.percentComplete >= config.routeProgressLeewayPercent) {
                attachWarning('med', route.ref);
                debug("Added med warning to " + route.code + " because no cart was scanned in over 10 minutes and less than 80% done");
            }
            else {
                attachWarning('high', route.ref);
                debug("Added high warning to " + route.code + " because no cart was scanned in over 10 minutes and more than 80% done");
            }
            return;
        }

        if (isValidRouteTime(route.time) && routePickTimeIsMed(route.time)) {
            debug("Added med warning to " + route.code + " because pick time exceeds 20 minutes. Case: " + (route.time / 60) + " > 20");
            attachWarning('med', route.ref);
            return;
        }
    });
}

function runScript() {
    intervalHolder = setInterval(function(){
        clearAndAnalyzeRoutes();
    }, config.refreshTime);

    $(".script_status").text("RouteAnalyzer is running...");
    $(".script_status").removeClass("high_level_warning");
}

function stopScript(){
    clearInterval(intervalHolder);

    $(".script_status").text("RouteAnalyzer has stopped. Click the page to restart analyzation");
    $(".script_status").addClass("high_level_warning");
}
(function() {
    'use strict';

    addCustomStyles();

    $("body").prepend('<div class="script_status"></div>');

    // Hack, on page load wait 10 seconds and then analyize routes. (this should be when data is populated but hey.. it works.
    setTimeout(function(){
        runScript();

        $(window).focus(function() {
            runScript();
        });

        $(window).blur(function() {
            stopScript();
        });

        clearAndAnalyzeRoutes();

        $(".rt-resizable-header").on( "click", function() {
            clearFormatting();
            setTimeout(function(){
            analyzeRoutes();
            }, 500);
        });

        // On keyup of any textbox, reanalyze
        $("input[type='text']").on("keyup", function(){
            clearFormatting();
            setTimeout(function(){
            analyzeRoutes();
            }, 500);
        });
    }, 10000);
})();