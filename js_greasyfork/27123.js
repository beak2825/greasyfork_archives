// ==UserScript==
// @name         Subhd,Zimuku for RARBG
// @namespace    http://rarbg.to/
// @version      0.3.6
// @description  Adds Subhd,Zimuku shortcut to RARBG.to
// @author       tofuliang
// @match        https://rarbg.to/*
// @match        http://rarbg.to/*
// @match        https://rarbg.is/*
// @match        http://rarbg.is/*
// @match        https://rarbgprx.org/*
// @match        http://rarbgprx.org/*
// @match        https://proxyrarbg.org/*
// @match        http://proxyrarbg.org/*
// @match        http://rarbggo.org/*
// @match        https://rarbggo.org/*
// @downloadURL https://update.greasyfork.org/scripts/27123/Subhd%2CZimuku%20for%20RARBG.user.js
// @updateURL https://update.greasyfork.org/scripts/27123/Subhd%2CZimuku%20for%20RARBG.meta.js
// ==/UserScript==

$(document).on('ready AutoPagerize_DOMNodeInserted', function(e) {
    let subhdIcon='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAQlBMVEU5VpU5VpU5VpU5VpU5VpU5VpU5VpVHcEw5VpU5VpU5VpX///+otdDo6/JcdKdFYJtziLT29/qVpMbU2uiElr3Ayd2XrvmhAAAAC3RSTlP/n1qd7NWPACgNzTsaPV0AAAEtSURBVDjLhVPZtsMgCCTRpppiXPP/v3pdUGxtz+WJgyPLMMBzmN7FKQHkKXbNUeiO2mCyTX0A9AEfdugZoB6w2EMxQMkasgnv+0ZHCKk6oL1b9K9mJk2IDNA1v40vNqQqugJaf1i+BudSTUQ5jgJQrX4O3y16mQylPlQGtPld/mYpWvyL+HiCHkE/JswpArkadsrLv3I/MfZZdxAwejDXSpeAk7yQU3hcICfI7t6VgRjeMXLyO5MxWPhuF5oG8elHjjwtYZCfzyVPbSaNJsWXUhPXohMVjXFciHnfO9VmqguWadV9Wblw5BoDsI11p6mxog3P6ybBFEEFZh1ZMCS5q/BoMITKhLGT5Ei0l2FNtr120S6y9mjfZc+H4wJicHY5nP9PbzleoZbr/nX+fwpvE7F7BpKvAAAAAElFTkSuQmCC';
    let zimukuIcon='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAY1BMVEUbbZ0OZ5v2+PoALU0acKMUbKALY5b///8CXZMZbJw9WGkLOFNxhJAIQ2b7+/pjmrsJWYqJjpEAGzVSaHQ7aIPZ3uECSn4dUXAnSl6xyNWEsczj6/FCf6Q/R0uurq6mpKReX2CzkpbwAAABBElEQVQ4y5WT2RKDIAxFibIElypqrV3t/39ljQgOKu30PpHJCZPkAmOrNF5VrVlUGk9KXfEos0ielVIP0F6+0qknovchWkJLFZNt6AtQ8vkK/AFoApp0qyYELnwrIGBtsuRabkRlYgbgNZpuP0FhiqVJhnVd7YALSOB+l3AAiGDZMOSL0iGh/LvnoR9L7wJvlH41kh8aCo+5/Fny0Ex/YpQ+u3LtzFrt66f82EBoJ04eJ04qPDMi8B41S2U0KyZxoCNAdG3mNEyv0rigLYydRqyiZ1uAi2C/DAv4ofcKAPY3MPlbJ18AqG4VuR4F3MJaEb3BAimP/d3ZytMzPgSYNsvzbf4DIcYT1XG30F8AAAAASUVORK5CYII=';
    $('a[href^="/torrents.php?imdb="][subed!=subed]').each(function() {
        let title = document.location.href.match(/https?:\/\/rarbg\w*\.\w+\/torrent\/\w+/)?$('h1').text():($(this).attr('title')||$(this).siblings("a[title][onmouseover]").attr('title'));
        if(title){
            let parts =  title.replace(/\s+/g,'.').split('.'),part='';
            var partsBak = parts.slice(0);
            while(parts.length > 0 && (part = parts.pop().match(/^\d{4}$/)) === null){}
            if(parts === null || parts.length < 1){
                parts = partsBak.slice(0);
                while(parts.length > 0 && (part = parts.pop().match(/^s\d{1,2}e?\d{0,2}$/i)) === null){}
            }
            parts.push(part);
            var keyword = parts.join('.'),
                subhdUrl='http://subhd.tv/search/'+keyword,
                zimuzuUrl='http://zmk.pw/search?q='+keyword;
            $(this).after('<a style="margin-left:5px;" href='+subhdUrl+' target="_blank" onmouseover="return overlib(\'<span>去subhd找字幕</span>\')" onmouseout="return nd();"><img src="'+subhdIcon+'" style="height:18px;"></img></a><a style="margin-left:5px;" href='+zimuzuUrl+' target="_blank" onmouseover="return overlib(\'<span>去zimuku找字幕</span>\')" onmouseout="return nd();"><img src="'+zimukuIcon+'" style="height:18px;"></img></a>');
            $(this).attr('subed','subed');
        }
    });
});
$(document).bind("ready", function() {});
$(document).ready(function() {
    $(document).trigger("ready");
});


