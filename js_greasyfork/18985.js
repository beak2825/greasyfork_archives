// ==UserScript==
// @name         Reddit RES Style Class
// @namespace    http://your.homepage/
// @version      1.0
// @description  Adds class to html for subreddit RES style on/off
// @author       muffleyd
// @match        http*://*.reddit.com/r/*
// @grant        none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/18985/Reddit%20RES%20Style%20Class.user.js
// @updateURL https://update.greasyfork.org/scripts/18985/Reddit%20RES%20Style%20Class.meta.js
// ==/UserScript==

var classname = 'no-subr-style'
var classname2 = 'yes-subr-style'
var $html = $('html')
$html.addClass(classname2)

window.addEventListener ("load", function () {

var toggleStyle = function () {
    $html.removeClass(classname).removeClass(classname2)
    if ($('head link[title="applied_subreddit_stylesheet"]').length == 0) {
        $html.addClass(classname)
    } else {
        $html.addClass(classname2)
    }
    /*if ($el.length) {
        if (!$el[0].checked) {
            $html.addClass(classname)
        } else {
            $html.addClass(classname2)
        }
    }*/
}

var $el = $('')
var refresh$el = function () {
    $el.off('click', toggleStyle)
    $el = $('.res-sr-style-toggle > input[type=checkbox]')
    if ($el.length) {
        $el.on('change', toggleStyle)
    }
}

document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
        refresh$el()
        toggleStyle()
    }
})

refresh$el()
toggleStyle()

})