// ==UserScript==
// @name         Trello styles by chapaev.css
// @namespace    https://openuserjs.org/install/vasilychapaev/Trello_styles_by_chapaev.css.user.js
// @version      0.2
// @description  show label titles, minifi card elements to one row, card wider, no checklist strike
// @author       Vasily Chapaev, vasilychapaev@gmail.com
// @match        https://trello.com/*
// @downloadURL https://update.greasyfork.org/scripts/16061/Trello%20styles%20by%20chapaevcss.user.js
// @updateURL https://update.greasyfork.org/scripts/16061/Trello%20styles%20by%20chapaevcss.meta.js
// ==/UserScript==

var css = `
/* labels title - show */
.list-card-labels .card-label {
    font-weight: normal;
    font-size: 10px;
    height: 12px !important;
    line-height: 10px !important;
    padding: 0 3px;
    margin: 0 3px 0 0;
    text-shadow: none;
    width: auto;
    max-width: 50px;
}

/* labels + title + icons - one row = mini UI */
.list-card-labels {
    float: left;
    margin: 3px 0;
}
.list-card-title {display: inline;}

/* checklist count - green>gray */
.badge.is-complete {background-color: #EDEFF0;}

/* card - wider */
.window {width: 830px;}
.window-main-col {width: 646px;}

/* card - "edit" link hide */
.card-detail-item-header, .card-detail-item-header-edit {display: none;}

/* checklist - strike remove */
.checklist-item-state-complete .checklist-item-details-text {text-decoration: none;}
}
`;


insertCss(css);


function insertCss( code ) {
    var style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
        // IE
        style.styleSheet.cssText = code;
    } else {
        // Other browsers
        style.innerHTML = code;
    }

    document.getElementsByTagName("head")[0].appendChild( style );
}
