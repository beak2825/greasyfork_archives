// ==UserScript==
// @name         Google Photos dark theme
// @namespace    http://tampermonkey.net/
// @version      0.9.7
// @description  A darker look
// @author       https://greasyfork.org/en/users/810921-guywmustang
// @match        https://photos.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/431729/Google%20Photos%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/431729/Google%20Photos%20dark%20theme.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addInitialStyle() {
        console.log("addInitialStyle");

        GM_addStyle(`
            /* top bar */
            .fXq1Rc .QtDoYb, .QtDoYb {
            background-color: black;
            }

            /* Settings page */
            .P0eWkf, .rvEjke, .IGdgBf {
              color: var(--white-text);
            }

            /* background for main page & side bar */
            body, .wDSX5e, .RSjvib, .yDSiEe.uGCjIb.zcLWac.eejsDc.TWmIyd {
              background-color: var(--darkgray);
            }

            /* album page background */
            .B6Rt6d {
            background-color: #252525;
            }

            /* album page text color and background */
            textarea.ajQY2.v3oaBb {
            background-color: #252525;
            color: #dddddd;
            }

            /* Search bar coloring */
            /*.Aul2T, .Aul2T.qs41qe, .cI2tlc .tWfTvb .jBmls {
                background: #444444;
            }*/

            /* Side bar icon color */
            .oUj9s .v1262d {
            color: rgb(167 167 167);
            }

        `);
    }

    function addStyle() {

        console.log("addStyle() called");

        GM_addStyle(`
            :root {
                --darkgray: #252525;
                --white-text: #dddddd;
                --sub-text: #888888;
                --hover-color: #F1F3F4;
                --light-gray: #dfdfdf;
                --dark-popout: #101010;
            }

            /* top bar */
            .fXq1Rc .QtDoYb, .QtDoYb {
              background-color: var(--darkgray);
            }

            /* Settings page */
            .P0eWkf, .rvEjke, .IGdgBf {
              color: var(--white-text);
            }

            /* background for main page & side bar */
            body, .wDSX5e, .RSjvib, .yDSiEe.uGCjIb.zcLWac.eejsDc.TWmIyd {
                background-color: var(--dark-popout);
            }

            /* top bar border bottom color */
            .fXq1Rc .QtDoYb {
              border-bottom: 1px solid rgb(66,66,66);
            }

            /* "Photos" text color */
            .EIug8e {
              color: var(--light-gray);
            }

            /* background color for the "popout" color */
            .HnzzId, .uGCjIb {
              background-color: var(--darkgray);
            }

            /* Search bar coloring */
            /*.Aul2T, .Aul2T.qs41qe, .cI2tlc .tWfTvb .jBmls, .LAL5ie .ZAGvjd {
                background: #444444;
                color: var(--white-text);
            }*/
            /* End search bar coloring */

            /* Side & top bar icon coloring */
            .oUj9s .v1262d, .G6iPcb .v1262d, .gb_qa.gb_Ka svg {
              color: rgb(167 167 167);
              fill: rgb(167, 167, 167);
            }

            /* Side bar storage sub-text color */
            .nXkqdd {
              color: var(--sub-text);
            }

            /* Side bar "Get more storage" button */
            .z3RRjd:not(:disabled) {
              color: var(--sub-text);
            }

            .z3RRjd:not(:disabled):hover {
              color: var(--white-text);
            }

            /* Main page font color */
            .xA0gfb, .G7ubtf, .RLo1Hf, .HksvWb, .xA0gfb {
              color: var(--white-text);
            }

            /* Main page location/date font color */
            .LzExud, .LzExud:visited, .LzExud.aJDEse, .KU6qyf {
              color: var(--sub-text);
            }

            .LzExud:hover {
              color: var(--white-text);
            }

            /* background color on search page */
            c-wiz.B6Rt6d.zcLWac.eejsDc.G9Yhnf, div.eReC4e.FbgB9 {
              background-color: var(--darkgray);
            }

            /* font color on search page */
            div.ZEmz6b, h2.ZEmz6b, .OgirMe, .hsohWb, div.hsohWb, .ApP0z, div.dykGZb, div.avzd9e, div.R1QzSc.ecU3Ec > div, div.HEHjMc {
              color: var(--white-text);
            }

            /* Side bar text color */
            .RSjvib .ylKyWb {
            color: var(--white-text);
            }

            /* explore page - bottom links formatting */
            .QkA5Vc:not(:disabled) {
              color: var(--white-text);
            }
            .QkA5Vc:not(:disabled):hover {
              color: var(--hover-color);
              background: rgba(52,52,52,.31);
            }

            /* Info page popout - start */
            .fzyONc.QtVoBc .Q77Pt,
            /* Info text label */
            .IMbeAf,
            /* Info page - details */
            .R9U8ab,
            /* Info page - category labels */
            .wiOkb,
            div.AJM7gb {
              color: var(--white-text);
              background-color: var(--darkgray);
            }

            /* Info page - sub text */
            .oBMhZb, .nAfFgf {
              color: var(--sub-text);
            }

            /* Info page popout - end */

            /* album name colors */
            .RSjvib .oUj9s > * {
              color: var(--white-text);
            }

            /* albums toggle buttons, 'most recent photo' filter */
            .JY6MEf .uoC0bf-TfeOUb-V67aGc, .Sn08je .sYyz6c {
              color: var(--white-text);
            }

            /* selected 'tab' colors non-hover */
            .uprWmb .v1262d, .uprWmb .HksvWb {
              color: var(--white-text);
              /*background: rgba(79,79,79,.56);*/
            }
            /* selected main 'tab' icon color on hover */
            .uprWmb:hover .v1262d, .uprWmb:hover .HksvWb {
              color: var(--white-text);
            }

            /* Promo bar styling start */
            .oKzLoc {
              background-color: rgb(79, 79, 79);
              color: var(--white-text);
            }
            /* Promo bar styling end */

            /* Memory left/right buttons */
            .yhB1zd {
              background-color: var(--darkgray);
              color: var(--white-text);
            }
            .yhB1zd:hover {
              background-color: rgb(150, 150, 150);
              color: var(--hover-color);
            }

            /* album name hover colors */
            div.eXOZff:hover, .oUj9s:hover .HksvWb,
            .HksvWb:hover, .QnmYd:hover .HEHjMc {
              color: var(--white-text);
            }

            /* album name hover background */
            .RSjvib .uprWmb,
            .RSjvib .oUj9s:hover {
              background: rgba(79,79,79,.56);
            }

            /* View all link on search page */
            div.dykGZb span {
                color: var(--light-gray);
            }

            /* Text color on sharing page */
            div.I7yCae, div.DNAsC.A1fzDc.bSAKfb a {
                color: var(--light-gray);
            }

            a.DOAbib:hover {
                background-color: yellow;
            }

            /* Album page styles */
            div.gN5aAe {
                background-color: var(--darkgray);
            }

            /* Album page button (like: My albums) font style */
            span[jsname='XPtOyb'] {
              color: var(--light-gray) !important;
            }

            /* 'My Albums' hovering color override */
            .JY6MEf:not(.uoC0bf-XPtOyb-OWXEXe-OWB6Me) .uoC0bf-jPmIDe-OWXEXe-ssJRIf-hXIJHe:hover .uoC0bf-TfeOUb-V67aGc {
              color: var(--light-gray) !important;
            }

            /* Album name style */
            .kmqzh .tL9Q4c {
              color: var(--white-text);
              background-color: var(--darkgray);
            }

            div.mfQCMe, div.UV4Xae {
            color: var(--white-text);
            }

            /* album page background */
            .B6Rt6d {
            background-color: var(--darkgray);
            }

            /* album page text color and background */
            textarea.ajQY2.v3oaBb {
            background-color: var(--darkgray);
            color: var(--white-text);
            }

            /* album page date text */
            .WMnOad {
              color: var(--white-text);
            }

            /* Album page top bar (when scrolled down) */
            .QtDoYb.CWVNI {
              background-color: var(--darkgray);
            }

            /* sharing page for a contact */
            div.wqSOMc, div.ZLAKfe, div.RSjvib.eejsDc {
              background-color: var(--darkgray);
              color: var(--white-text);
            }

            /* photo sharing page title */
            .cL5NYb {
              color: var(--white-text);
            }

            /* sharing action buttons */
            .LjDxcd:hover:not(:disabled) {
              color: var(--light-gray);
            }

            .cb51zc .NXvGIf, div.jvwUve, div.QtDoYb.MJvped.K7sKBc {
              color: var(--white-text);
            }

            /* favorites - order photos button text */
            .sYyz6c {
              color: var(--white-text);
            }
            .sYyz6c:hover {
              color: var(--hover-color);
            }

            /* Updates page */
            /* date text*/
            .elYLmf {
              color: var(--white-text);
            }
            /* update text */
            .xGvEn {
              color: var(--white-text);
            }
            /* 'view album' text color */
            .oFJeZc:not(:disabled), .ksBjEc:not(:disabled) {
              color: var(--light-gray);
            }
            /* -- end updates page -- */

            /* 'print store' page */
            div.JOuV0d, .eReC4e, .ZM9jAb, .OgirMe {
              color: var(--white-text);
              background-color: var(--darkgray);
            }

            /* 'shop now' button */
            .sYyz6c {
              color: var(--darkgray);
            }

            /* past orders text */
            .bt7qE, .EVhzbe {
              color: var(--white-text);
            }

            /* -- end print store page */
        ` );
    }

    var oldHref = document.location.href;

    window.onload = function() {
        console.log("window loaded");

        var
             bodyList = document.querySelector("body")

            ,observer = new MutationObserver(function(mutations) {

                mutations.forEach(function(mutation) {

                    if (oldHref != document.location.href) {

                        oldHref = document.location.href;

                        /* Changed ! your code here */
                        setTimeout(addStyle, 250);

                    }

                });

            });

        var config = {
            childList: true,
            subtree: true
        };

        observer.observe(bodyList, config);

    };

    // Attach initial background colors to get a dark mode at initial load
    addInitialStyle();

    // finally once the page is loaded, apply the full dark style
    window.onload = function() { addStyle(); }

})();