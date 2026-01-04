// ==UserScript==
// @name        toodledo.com - extra features
// @namespace   Violentmonkey Scripts
// @match       https://www.toodledo.com/tasks/index.php
// @match       https://tasks.toodledo.com/folders/*
// @grant       none
// @version     1.1
// @author      Krzysztof Księżyk
// @license MIT
// @description 1/13/2022, 11:00:00 PM
// @downloadURL https://update.greasyfork.org/scripts/436515/toodledocom%20-%20extra%20features.user.js
// @updateURL https://update.greasyfork.org/scripts/436515/toodledocom%20-%20extra%20features.meta.js
// ==/UserScript==


// adjustable variables
var rowColorByPrioEnabled = true;
var rowColorByTagsEnabled = true;
var rowSeparatorEnabled = true;

var extraPadding = 3;
var rowSeparatorStyle = "1px dotted black";
var sectionSeparatorBackgroundColor = 'black'
var sectionSeparatorTextColor = 'white'


// internal variables
var isScrolling;
var mode = '';
var observer;


debug('- ToodleDo extra features script loaded -');

function debug(message) {
    console.debug('TDEX: ' + message);
}

function tagsToColor(tags) {
    var color;
    for (var tag of tags.split(',')) {
        tag = tag.trim();
        switch(tag) {
            case '#red':
            case '#r':
                color = "#ee6e6e"; break;
            case '#green':
            case '#g':
                color = "#74ee6e"; break;
            case '#blue':
            case '#b':
                color = "#608ceb"; break;
            case '#yellow':
            case '#y':
                color = "#ebdf60"; break;
            case '#prio1':
                color = "#f0c661"; break;
            case '#prio2':
                color = "#f08561"; break;
            case '#prio3':
                color = "#ee6e6e"; break;
            default:
                if (tag[0] == "#") { color = tag };
        }
        if (color) {
            return color;
        }
    }
    return color;
}

function applyModifications() {
    if (extraPadding > 0) {
        extraPadding_px = extraPadding + 'px';
        debug('applying extra padding');
        if (mode == 'tasks') {
            // for tasks.toodledo.com
            for (var selector of ['.taskRow', '.taskRowDivider']) {
                var list = document.querySelectorAll(selector);
                for (var item of list) {
                    item.style.paddingTop = extraPadding_px;
                    item.style.paddingBottom = extraPadding_px;
                }
            }
        } else {
            // for www.toodledo.com/tasks
            for (var selector of ['.row', '.sep']) {
                var list = document.querySelectorAll(selector);
                for (var item of list) {
                    item.style.paddingTop = extraPadding_px;
                    item.style.paddingBottom = extraPadding_px;
                }
            }
        }
    }
    if (mode == 'tasks') {
        // for tasks.toodledo.com
        var list = document.querySelectorAll('.taskRowDivider');
        if (sectionSeparatorBackgroundColor) {
            for (var item of list) {
                item.style.backgroundColor = sectionSeparatorBackgroundColor;
            }
        }
        if (sectionSeparatorTextColor) {
            var list = document.querySelectorAll('.taskRowDivider a');
            for (var item of list) {
                item.style.color = sectionSeparatorTextColor;
            }
        }
    } else {
        // for www.toodledo.com/tasks
        var list = document.querySelectorAll('.sep');
        if (sectionSeparatorBackgroundColor) {
            for (var item of list) {
                item.style.backgroundColor = sectionSeparatorBackgroundColor;
            }
        }
        if (sectionSeparatorTextColor) {
            var list = document.querySelectorAll('.sep a');
            for (var item of list) {
                item.style.color = sectionSeparatorTextColor;
            }
        }
    }

    if (rowSeparatorEnabled) {
        debug('adjusting row separator');
        if (mode == 'tasks') {
            // for tasks.toodledo.com
            var list = document.querySelectorAll('.taskRow');
            for (var item of list) {
                if (item.parentNode.firstChild == item) { continue; }
                item.style.borderTop = rowSeparatorStyle;
            }
        } else {
            // for www.toodledo.com/tasks
            var list = document.querySelectorAll('.row');
            for (var item of list) {
                if (item.previousElementSibling.classList.contains('sep')) { continue; }
                item.style.borderTop = rowSeparatorStyle;
            }
        }
    }

    if (rowColorByTagsEnabled) {
        debug('applying colors by tags');
        if (mode == 'tasks') {
            // for tasks.toodledo.com
            var list = document.querySelectorAll('.tag-label');
            for (var item of list) {
                tags = item.innerText;
                if (tags != "") {
                    var color = tagsToColor(tags);
                    if (!color) {
                        color = getComputedStyle(item, null).backgroundColor;
                    }
                    if (color) {
                        item.parentNode.parentNode.style.backgroundColor = color;
                    }
                }
            }
        } else {
            // for www.toodledo.com/tasks
            var list = document.querySelectorAll('.dett.col128');
            for (var item of list) {
                tags = item.innerText;
                if (tags != "none") {
                    var color = tagsToColor(tags);
                    if (!color && item.firstChild && item.firstChild.firstChild) {
                        color = getComputedStyle(item.firstChild.firstChild, null).backgroundColor;
                    }
                    if (color) {
                        item.parentNode.style.backgroundColor = color;
                    }
                }
            }
        }
    }

    if (rowColorByPrioEnabled) {
        debug('applying colors by priority');
        if (mode == 'tasks') {
            // for tasks.toodledo.com
            for (var prio of [1,2,3]) {
                selector = '.taskRow.pri' + prio;
                color = tagsToColor('#prio' + prio);
                var list = document.querySelectorAll(selector);
                for (var item of list) {
                    item.style.backgroundColor = color
                }
            }
        } else {
            // for www.toodledo.com/tasks
            for (var prio of [1,2,3]) {
                selector = 'span.pri' + prio;
                color = tagsToColor('#prio' + prio);
                var list = document.querySelectorAll(selector);
                for (var item of list) {
                    item.parentNode.parentNode.style.backgroundColor = color;
                }
            }
        }
    }    
}

function addObserver() {
    if (observer) {
        return;
    }
    debug('installing observer to detect folder reload');
    if (mode == 'tasks') {
        selector = '#TasksContainer';
    } else {
        selector = '#tasks';
    }
    var skipApplyingModifications = false;
    var element = document.querySelector(selector);
    observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            debug('detected change:' + mutation.type);
            if (mutation.type === "childList" && skipApplyingModifications == false) {
                waitForTasks(false);
                skipApplyingModifications = true;
                setTimeout(function() { skipApplyingModifications = false; }, 500);
            }
        });
    });
    observer.observe(element, {
        childList:true
    });
}

cnt=0
function waitForTasks() {
    installObserver=false;
    cnt++
    debug('waiting once tasks are loaded');
    if (mode == 'tasks') {
        // for tasks.toodledo.com
        if (document.querySelector('.tasksFooter')) {
            setTimeout(applyModifications, 500);
            addObserver();
            return;
        }
    } else {
        // for www.toodledo.com/tasks
        if (document.querySelector('#bot_len_sum')) {
            applyModifications();
            addObserver();
            return;
        }        
    }
    if (cnt < 30) {
        setTimeout(waitForTasks, 500);
    }
}

function init() {
    if (document.URL.split("/")[2] == 'tasks.toodledo.com') {
        mode = 'tasks';
    } else {
        mode = 'toodledo';
    }
  
    if (mode == 'tasks') {
        window.addEventListener('scroll', function ( event ) {
            console.log('is scrolling')
            window.clearTimeout( isScrolling );
            isScrolling = setTimeout(function() {
                applyModifications();
            }, 200);
        }, false);
    }
    debug('mode detected: ' + mode);
    waitForTasks(true);
}

init();