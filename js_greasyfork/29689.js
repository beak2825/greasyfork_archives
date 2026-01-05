// ==UserScript==
// @name         Patreon Writers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Improving readability of author's post for writers
// @author       mirba
// @include  	*.patreon.com/*
// @include  	*.patreon.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29689/Patreon%20Writers.user.js
// @updateURL https://update.greasyfork.org/scripts/29689/Patreon%20Writers.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.bzHTlY{height: 3rem;}');
addGlobalStyle('._2ED-components-FeaturedTag--dragIconColumn, _1yv-components-FeaturedTag--deleteIconColumn{ flex-basis: 0.5rem;}');


addGlobalStyle('.last-md{display:none;}.col-lg-3{-ms-flex-preferred-size: 17%;flex-basis: 17%; max-width: 17%;} .col-lg-6 { -ms-flex-preferred-size: 80%;flex-basis: 80%; max-width: 80%;}');
addGlobalStyle('._9dI-components-Post--postFooter {display:none;}'); //, ._1CB-components-Comment--wrapper
addGlobalStyle('._3jG-components-Post--title{    font-size: 0.9rem;} .stackable {margin-bottom:0.1rem;} ._28H-components-Post--cardBodyContainer{ margin: 0.1rem 0 0; padding: 0 0.1rem 0.1rem;}');
addGlobalStyle('._72u-components-Post-PostHeader--patronCount{display:none;}.DGe-components-Post-PostHeader--timestampLink{font-size: 0.6rem;}');

addGlobalStyle('._2q0-components-Post-PostHeader--fullName{font-size: 0.7rem;} ');
addGlobalStyle('._1Qi-components-Post-PostHeader--postInfoRow { line-height: 0.8rem; vertical-align: top; margin-top: 0rem;} ');
addGlobalStyle('._3jv-components-Avatar--sm {width: 1rem;min-width: 1rem; height: 1rem;}');
addGlobalStyle('.nRE-components-Post-PostHeader--authorAvatar{margin-right: 0.2rem;}._1VS-components-Post-PostHeader--authorInfoContainer{margin: 0.1rem;}');