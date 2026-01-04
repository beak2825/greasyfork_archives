// ==UserScript==
// @name         PAHE New Design
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A redesign for Pahe without the unnecessary scrolling
// @author       Stello
// @match        https://pahe.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383726/PAHE%20New%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/383726/PAHE%20New%20Design.meta.js
// ==/UserScript==

(function() {
    'use strict';
//Styling constants (i know, i should probably be using const, thus the v1)
let width100 = " width: 100%;";
let width60 = " width: 60%;";
let width40 = " width: 40%;";
let width100p = " width: 100px;";
let full_height = " height: 100%;";
let hide = " display: none;";
let col = " flex-direction: column;";
let row = " flex-direction: row;";
let row_r = " flex-direction: row-reverse;";
let flex = " display: flex;";
let inflex = " display: inline-flex;";
let image_width = " width: 180px;";
let order_1 = " order: -1;";
let order1 = " order: 1;";
let order2 = " order: 2;";
let margin5 = " margin: 5px;";
let margin0 = " margin: 0px;";
let mt0 = " margin-top: 0px;";
let font_larger = " font-size: larger;";
let wrap = " flex-wrap: wrap;";
let text_align_center = " text-align: center;";
let jcenter = " justify-content: center;";
let j_space_between = " justify-content: space-between;";

let wrapper_style = inflex+full_height+width100+col;
let inner_wrapper_style = inflex+col+width100;
let main_content_style = inflex+col+width100;
let text_html_widget_10_style = hide;

//Animation constants
let a_width100 ="this.style.width='100px'";
let a_width100_undo ="this.style.width=''";

function newWidth(_width){
    return "this.style.width='"+_width+"px'";
}

function changeStyling(element, attributeValue){
    element && element.setAttribute("style", attributeValue);
}

function changeHover(element){
    element && element.setAttribute("onMouseOver", newWidth(element.getBoundingClientRect().width*1.2));
    element && element.setAttribute("onMouseOut", a_width100_undo);
}

let PAHE_logo = document.querySelector("#theme-header > div.header-content > div.logo");
let top_header = document.querySelector("#top-nav")
top_header.appendChild(PAHE_logo);

changeStyling(document.querySelector("#top-nav > div.logo > h1 > a > img"),width100p+full_height);
changeStyling(document.querySelector("#top-nav > div.logo > h1 > a"),flex);
changeStyling(document.querySelector("#top-nav > div.logo"),margin0);
changeStyling(document.querySelector("#top-nav > div.container"),margin0);
changeStyling(top_header, flex+row_r+j_space_between);
changeStyling(document.querySelector("#theme-header > div.header-content"),hide);

changeStyling(document.querySelector("#main-nav"),hide);
changeStyling(document.querySelector("#top-nav > div.logo > h2 > a"),flex);
changeStyling(document.querySelector("#top-nav > div.logo > h2 > a > img"),full_height+width100p);

changeHover(document.querySelector("#main-content > div.content > section.cat-box.pic-box.tie-cat-254.clear.pic-grid > div > ul > li:nth-child(7) > div"));

changeStyling(document.getElementById("wrapper"), wrapper_style);
changeStyling(document.getElementsByClassName("inner-wrapper")[0], inner_wrapper_style);
changeStyling(document.getElementById("main-content"), main_content_style);
changeStyling(document.getElementById("text-html-widget-10"), text_html_widget_10_style);
changeStyling(document.querySelector("#sidebar"), text_html_widget_10_style);
changeStyling(document.querySelector("#main-content > div.content"), width100);
changeStyling(document.querySelector("#main-content > div.content > section.cat-box.pic-box.tie-cat-254.clear.pic-grid > div > ul"), flex);
changeStyling(document.querySelector("#theme-header"), width100);
changeStyling(document.querySelector("#main-content > div.content > section.cat-box.recent-box.recent-blog > div"), flex+wrap+j_space_between);
changeStyling(document.querySelector("#top-nav > div > div.top-menu"), hide);
changeStyling(document.querySelector("#top-nav > div > div.social-icons"),hide);

changeStyling(document.querySelector("#comments"), hide);
changeStyling(document.querySelector("#the-post > div > div.entry > p:nth-child(2)"), hide);
changeStyling(document.querySelector("#the-post > div > div.entry"), flex+wrap);
changeStyling(document.querySelector("#the-post > div > div.entry > div.imdbwp.imdbwp--movie.dark"), width60+order_1);
changeStyling(document.querySelector("#the-post > div > div.entry > div.nf-post-footer"), hide);
changeStyling(document.querySelector("#wp_rp_first"),order_1+flex+jcenter+width40);
changeStyling(document.querySelector("#wp_rp_first > div > h3"),mt0);
changeStyling(document.querySelector("#the-post > div > div.entry > div.post-meta"),width100);
changeStyling(document.querySelector("#crumbs"),hide);
//changeStyling(,);

changeStyling(document.querySelector("menu-main-menu > li.menu-item-635"), hide);

let articles = document.getElementsByClassName("item-list");
var index;
for(index = 0; index < articles.length; ++index){
    changeStyling(articles[index],image_width+flex+col);
    changeStyling(articles[index].querySelector("div.entry"),hide);
    changeStyling(articles[index].querySelector("p"),hide);
    changeStyling(articles[index].querySelector("div.post-thumbnail"),order1+margin5);
    changeStyling(articles[index].querySelector("h2"),order2+font_larger+inflex+text_align_center);
}

//Hides all UTB Buttons
let UTB = document.getElementsByClassName("green");
var j;
for(j = 0; j < UTB.length; ++j){
    changeStyling(UTB[j],hide);
}

//Hides all OL buttons
let OL = document.getElementsByClassName("blue");
var i;
for(i = 0; i < OL.length; ++i){
    changeStyling(OL[i],hide);
}
})();