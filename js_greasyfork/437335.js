// ==UserScript==
// @name         Redmine: Dark Theme
// @version      0.0.4
// @author       HayaoGai
// @description  Make redmine dark theme.
// @match        http://rm.rdcircle.com/*
// @icon         https://idroot.us/wp-content/uploads/2017/12/Redmine-logo.png
// @namespace    https://github.com/HayaoGai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437335/Redmine%3A%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/437335/Redmine%3A%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict'

    const REFRESH_ICON = "https://i.imgur.com/bErbwdf.png"
    const COLOR_WHITE = "#FFFFFF"
    const COLOR_RED = "#bb0000"
    const COLOR_BLUE = "#6dc8ff"
    const COLOR_LIGHT_GRAY = "#767676"
    const COLOR_GRAY = "#2a2a2a"
    const COLOR_DARK_GRAY = "#505050"
    const textStyle = `
.icon-refresh {
    width: 20px;
    height: 20px;
    cursor: pointer;
}`;

    css()

    init()

    function init() {
        createRefreshButton()
        document.querySelectorAll( "#content" ).forEach( c => { c.style.backgroundColor = COLOR_GRAY; } )
        document.querySelectorAll( "#footer" ).forEach( f => { f.style.backgroundColor = COLOR_GRAY; } )
        document.querySelectorAll( "#sidebar" ).forEach( s => { s.style.backgroundColor = COLOR_GRAY; } )
        document.querySelectorAll( "div.issue" ).forEach( i => { i.style.backgroundColor = COLOR_LIGHT_GRAY; } )
        document.querySelectorAll( "h1" ).forEach( h1 => { h1.style.color = COLOR_WHITE; } )
        document.querySelectorAll( "h2" ).forEach( h2 => { h2.style.color = COLOR_WHITE; } )
        document.querySelectorAll( "h3" ).forEach( h3 => { h3.style.color = COLOR_WHITE; } )
        document.querySelectorAll( "h4" ).forEach( h4 => { h4.style.color = COLOR_WHITE; } )
        document.querySelectorAll( "body" ).forEach( body => { body.style.color = COLOR_WHITE; } )
        document.querySelectorAll( "a" ).forEach( a => { a.style.color = COLOR_BLUE; } )
        document.querySelectorAll( "p" ).forEach( p => { p.style.color = COLOR_WHITE; } )
        document.querySelectorAll( "span" ).forEach( s => { s.style.color = COLOR_WHITE; } )
        document.querySelectorAll( "label" ).forEach( label => { label.style.color = COLOR_DARK_GRAY; } )
        document.querySelectorAll( "span.icon.icon-edit" ).forEach( edit => { edit.style.color = COLOR_BLUE; } )
        document.querySelectorAll( "span.required" ).forEach( required => { required.style.color = COLOR_RED; } )
        document.querySelectorAll( "legend" ).forEach( l => { l.style.color = COLOR_BLUE; } )
        document.querySelectorAll( "td" ).forEach( t => { t.style.color = COLOR_GRAY; } )
        document.querySelectorAll( "th" ).forEach( t => { t.style.color = COLOR_BLUE; } )
        document.querySelectorAll( ".query.selected" ).forEach( q => { q.style.backgroundColor = COLOR_GRAY; } )
    }

    function createRefreshButton() {
        const div = [...document.querySelectorAll(".contextual")].find( d => d.childElementCount === 4 )
        if (!div) return
        const refresh = document.createElement("img")
        refresh.src = REFRESH_ICON
        refresh.className = "icon-refresh"
        refresh.addEventListener("click", () => {
            const url = window.location.href
            const length = url.indexOf("?")
            window.location.href = url.substring(0, length)
        })
        div.append(refresh)
    }

    function css() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = textStyle;
        document.head.appendChild(style);
    }

})();
