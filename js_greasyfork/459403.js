// ==UserScript==
// @name         Dark mode for Tilda (beta)
// @namespace    https://bocmanbarada.ru/codes
// @version      0.5
// @description  Темная тема для конструктора Tilda!
// @author       bocmanbarada
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAEAQAAAA5p3UDAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAAAqo0jMgAAAAlwSFlzAAAAYAAAAGAA8GtCzwAAAAd0SU1FB+cCAxIlMQlv2tcAAA1tSURBVHja7Z1rbBRVFMfP3bYUBQwgYGhjeBRKkUeFigi00EhCAi2agiBQiPhBg1FaKsZoQiGACIkGEBKwhNCIRoGGL8hDPiAKKLSFKI8Igg8eKhrSUsQuULr374dLu52dmd3Z2Zm5u535JYR0dmbuOeeeuXPnPs4h8vDw8PDw8PDw8PBwF0y2ADIA8vOJ5s8nDB8urHD6NKGykvmOHJEtm4eNgKekANu2QZetW8GTk2XL6WETwMaNiMi6dbLl9LABYMgQIBCI7ADNzUBWlmx5ncInWwDnmDGDyGdA36QkopkzZUvrFC5ygMxM4+cOGiRbWqdwjwMgNdX4uR07yhbXKdzjAB6aeA7gcjwHcDmeA7gczwFcjucALsdzAJfjOYDLsX3mC0hLI8yZQ2zYMHHg7Flin3/O2F9/OatqXZ3hU9mNG87KRgSkpxNmz5ZvJ0uVKi0F/H71hIvfD5SWOivLSy9Fngh6AJ8711nZFi0C7tzRtBMvKXFSFguVKi2NbOnVq52T5+GHgWvXIst05Qrw0EPOybV6dWSZFi50Sh6LlEpP137yJTsBz8sLL5ffD4wb55ydjFR+i1y9ezsllwWKLV5suLl1vCUYORKoqVHLUF0NjBjhnBxGK7+FsjKnZLNAuU8+iU45Z52AiAh86FCguFj8GzLEWftEW/kAUFnppIwxKmjGAQDwDz+ULbv9tnnvPVO2wbZtsmWPQsloXwHyWgJn7WLmyW8hoV4BaWnGO4FaLF8uWwfrbbJihXl7NDba1Qm0bV+A+M5fv97s1USFhYzt3x+zHDwzk2j0aGJZWWJZ2MCBhC5diHXrRtSpkzirsZFw8yax27eJLl0iuniRcP48UXU18126FLsMhYXEvvzS/B1KShjbuDFWORwnpiaPnzhhrsyOHcFnzAC2bzf23R+Jq1dFn2b6dPAolpW1lYnX1povP8FfieadgHOge3fj5eTkABUVwM2bsVe6HvX1wMcfAzk5huXiPXoIXVxY+cHKMesEkdfng48fD3z1lX2VrseBA+C5uZF1HzzY1ZUfNES0ThC+BQAfONDSiud9+oDn5gJz5gCrVoEfOgTcuhX5uv37gYwMfTnNtADtrPLNOUF1tbZBU1OB5cu1J0/Moy1vUhKQnw+sXx++P3HnDrBsmV4fIbo+QDut/KBRjTgB58CUKeprMzKAkyetrPhwDqAsOykJmDYN+PprfbFra4H+/VXX8qlTvcpXGHP5cv1mkXOgvFxtxBdeMNQk2+QASvnHjQOOHtW+U0MDMG2a+prycv3SOW+PYx8RjDhlipiAaXEEzsXfWk9+WZn5nrT1DhCUa/p04Pp19d0CAa31DkBBgZiIaqMzP3ECmDxZdn1IA+jeHRg0SKvDBzAW2/CpvQ4gZHz0UeCLL7Qf7PffBxhTX9Oic7dusu0f1wBr1jhR+bE4QFDWV18Fmpq0nEC2HRMS0ew7hzUy5+drD0Q5u/wt4REdPnvf+XY4gJD9qaeAujrl3QMBoKhItl0TAvGp19DgZOVb6QBERODZ2Wodbt4E+vWTbd+4Rgzy2POd76QDELW8Du7dUxTCa2vBO3SQbee4RYwPyMEefRYsUJe0dKlsO8cl4AMGWD2865QDgHfuDBw5AqxYofoNO3YoS/L7tUYLXY+cGT2rHKBXr+AKqNdeU+rVvTvwxx/K0vbulW3vuEJM6colZh1QXCy+XJqawEeNUv42a5aqQANTya4BOHgw0R1A6LFunbjbhQsICTQFfPutssR9+2TbPS4QK3nkY4kuPDUVOH0aAMAfxCFu1XPMGGWJnDu5ESVuEcu45GOZPrxnT2DCBG1djxxRlrppk2z7SwXo2NHeNXzOO4BSt65dFcdU6wLq6swuNG0XiNW78YHluuHgQeDWLfDHHgseS0oC/v5bWbJ67YCTyI0QwqZOlVq+rdy+TfTII8Tmz29VlwUCRDt3Ks8rLJQtqTSsWbcfry1AQYG4808/KY7zvDxlyVeuyK4HKYBnZsqudFsdgCcnt84K8mCgavAOHcRWr7boryq2G4mvgNGj5ZVtP8zX3EzUsrVt/Pjg8aYmwvHjyrOfeUaWnIaCRIn98zNnEg0YQEhJiXxFQwOx774jqqpizO/XtpALQrJj5UpidXVEIfsCWXU10cSJwQP6tgA6dSKaMYMwdiyR8qtCE3b/vtjfuGsXY8rXT/Ty85QUkWbFSKYNLa5dA8/L01asqkp2s2/nKyCsXTF/vrL00I5hy3kTJqjnEYwSCAAbNsSUAyl8giWj+P3AyJFq5/rhB9mV3hb7KnvEiNBPPbGsvC2nTqntM2qUNbOjW7eaFDw/3zrz1tSo7//7747WcATsc4AffxQlpKcHj/Xtqyz9t9/U1506ZZlyPNgHCSVMJ/Dll60zw6hR4EOHKo916WKX0eOKVufq1St48PZt5TlKW4h5BHWraRqmX5f6DoAHESstE0I5OeIaB2APKrttJSPEAVioLUJtFSv6danvAMzqZtHZjlb8kJREREQsEDB8idW2D/OKC/MKOHvWWiFC7xfyFLRbOBf/Nza2Hgp94kNbBFhse2biftau0lFv9XZNJ5Dn5gJvvgkEcxYa6gTGFFYmBJ1P8cjCY+vW2Ev3+7UWPrjlM1DbrgY+A5GTE1uktQfwLVvMC8qTk8Uyp+Zmc6VfuaIXe9cNA0Fi3H/BAvDHH1fqbnAgiOfmiiBVZmhuBl+7NtJAUNgfxXh2WRlQUSGGgjMzCQY2NrD6esKxY8R272bszh3tk37+2Q6jxxezZhFt3kysooJowYLWw8jMVAbo07YF8x07BmRlEaZPJzZuHBkJmsWamsT9qqqY78IF2RbQBXzePNlPve0tAD77DADA33hDqfuhQ8rSi4tl14fjiCBP8YP1+qWkgN+4Ie4ejHamPR3s0o0i5t9vCeAAmDxZ3PncOcVx1dfV5csy60By0qjDh+WWbyeDB4v/P/1UcZiFpKbHoUOyJZWGiAMQH1ivW2oq+KRJ4MH1E+KrKnRRqIvjBoiNFPX1sivfagfQyzkEPPecstS6OtnbxaW+Apjv3j2iqiqZMlgN+NNPE9XXg3/wgfrXt99W/r1zJ/M1NcmWWSrtb2vYuXPijsuWKfUMHf3ztoa1IntruGUOgI8+EndTbg4V4e5Ct4V5W8RbUW+cTDwHCL7f795Vbw8vLlaX6Fx6uoRARN1OZAcoLxfNepshX2oJJPnnn8rS9uyRbe+4Q0QHS8wQMUJ+nw/o21d1nO/apSzJCxGjC7BsWaI6gLY+r7+uKogvWSLbznGLGD8/frw9OAD4pEnA/fvKUmpqZH/3xz1A//4JHygSTz6p1qG+XusV4aGBSMxgdjeSXAcQGzpCRzcDAeD552XbNaEwln4+vhwAmDhRO6lFgqV/jxdEvP3EcADdcPFYuVK2HeMakVUrKwu8Rw/Vb2DMKScwL3/PnupPvRZWrdJMGMF79tTT2TWAFxaqlj7z2lpwdcgU8Tqwt08QtfxgDHjxReCff9R3CwS0mn0xWhgaDLumBigokF0fjhI5kbJG0igUFdkZUSwq+XleHvD999p3qq/X6vABS5fql+6ipFGGcwBptgT9+oknxnkHAE9OFgtYvvlG/y7V1Zqjgap1AHq087Rx0SWAUm8pFxXRoYN4mizYNBHBAcQKnmefFUEyQsfz2+L3gy9ZojfIE10OhHbqBJanjkX//sDevZZ5AO/TBzwvD3zuXGDNGvDDh4F//4184Z494TKBeKljTVV+CwaSR2PsWGDfPsscwZi3cOF8Y8ZEls/lyaNjSx9vPK+eCMWyebO9awzr6oBNm6JZySOmg12aPj6mpI/8xAlTZfLUVDGUXFkp9ibGyuXLIlZSUZHZiZzYOq72OgGL/RZ6Si9aRLRundmriQoKGDtwIHY5MjJEHL6sLMKgQcQyMghduxLr2pWoc2dx1n//ERoaiDU0EP3yC9HFi0TnzxNVVzP266+xy1BQIELFMXP2Rmkp823YEKscjgGkp8e2uKP9fRNHHvsIh98PpKXJ1sG4svytt+K1yZNql5jyIJeVyZY/CkW3bzelo+Za+vYFsHKlOQeorLRDHvNRJCOoGf01a9Yw37vv2iOPhoQ8O5to2DBiAOHsWeY7c8aJchkrLweSk4neeccpXR0HWLw4Xpt9sWBDKwjjyZNATo5zNor2dbBokVOyWaBcWprxoVoHKx8TJoTvnPr9TqZzM+4EjY1A795OyWWNcrykJL4qv1MnY4GXr17V29xpj1wGnCAkwkjCACxcqI6G8cCjeUmJs7KEBmYKZ/B58xyVjZeUaLeYjY12V75tA0GtyqF3bxEsKTtbHDl9mmjHDsauX7e7bIUcfMsWYq+8YuzsigrGlDt8nLHT7NnBMLFy7NRuAd+923gLsHu3bHmdQnKIGA/ZeA7gcjwHcDmeA7gczwFcjucALsdzAJfjOYDLcY8DsHv3jJ97965scZ3CPQ5AFy8aPzeO4+x7mAN44gljG0ybm43sR/BIQIANGyLPA6xdK1tOD5sQe/3CJMLiW7bElGw5AbF9OjgeAR8/XqRTHT5crF88c4ZQWcl8R4/Kls3Dw8PDw8PDw8PDw8Ne/geWVbRd2gjc0gAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMi0wM1QxODozNzo0OSswMDowMMV4ffsAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDItMDNUMTg6Mzc6NDkrMDA6MDC0JcVHAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAyLTAzVDE4OjM3OjQ5KzAwOjAw4zDkmAAAAABJRU5ErkJggg==
// @grant        none
// @match        https://tilda.ru/page/*
// @match        https://tilda.ru/domains/*
// @match        https://tilda.ru/projects/*
// @match        https://tilda.cc/page/*
// @match        https://tilda.cc/domains/*
// @match        https://tilda.cc/projects/*
// @exclude      https://store.tilda.cc/*
// @exclude      https://experts.tilda.cc/*
// @exclude      https://members.tilda.cc/*
// @exclude      https://feeds.tildacdn.com/*
// @exclude      https://crm.tilda.cc/*
// @exclude      https://news.tildacdn.com/*
// @exclude      https://upwidget.tildacdn.com/*
// @downloadURL https://update.greasyfork.org/scripts/459403/Dark%20mode%20for%20Tilda%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/459403/Dark%20mode%20for%20Tilda%20%28beta%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

$('head').append(`'
<style>
html, body {
    background: #242424 !important;
}
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background: #fa876b;
    background-clip: padding-box;
    border: 2px solid transparent;
    border-radius: 10px;
}

/* стили для страниц https://tilda.cc/projects/ */
body .td-maincontainer {
    color: #d3d3d3;
}
.td-maincontainer {
    background-color: #242424;
}
.td-project-head {
    background-color: #1a1a1a;
    color: #d3d3d3;
}
.td-project-head a {
    color: #d3d3d3;
}
.td-project-midpanel__site-title a {
    border-bottom-color: #d3d3d3 !important;
}
[onclick^=td__showform__EditFolderSettings] {
    color: #d3d3d3;
}
.td-project-controls__search-input, .td-project-controls__select {
    border: 1px solid rgb(255 255 255 / 10%);
    color: #757575;
}
.td-project-controls__sort::after {
    border-top-color: #757575;
}
.td-project-pages-panel a {
    color: #7c7c7c;
}
.td-project-pages-panel a:hover {
    color: #ff8562;
}
.td-project__chb-indicator {
    border-color: rgb(211 211 211 / 30%);
    border-radius: 3px;
}
.td-project-head-wrapper, .td-page__wrapper, .td-page__img {
    border-color: #444;
}
.td-project-advanced .td-page__td-title-label {
    background: #444444 !important;
}
.td-page__td-title a {
    color: #d3d3d3;
}
.td-page__td-title-edit::before {
    color: #d3d3d3 !important;
}
.td-project-advanced .td-page:hover .td-page__td-title a {
    color: #fff;
}
.td-project-advanced .td-page .td-page__td-title a:hover {
    color: #fa8669;
}
.td-project-uppanel__trash-icon svg {
    fill: #fa8669;
}
.td-project-uppanel__url-icon svg, .td-project-folders svg, .td-project-pages svg, .td-project-pages svg path, .td-project-folders svg path {
    fill: #d3d3d3;
}
.td-page__buttons a {
    color: #d3d3d3;
}
.td-maincontainer .td-maincontainer-bottom svg path {
    stroke: #d3d3d3;
}
.td-maincontainer-bottom a {
    color: #d3d3d3;
}
.td-maincontainer-bottom a:hover {
    color: #ff8562;
}
.td-project-advanced .td-plan .td-plan__button .td-button, .td-project-advanced .td-plan .td-plan__button .td-button:hover {
    color: #fff;
}
.td-gs svg {
    fill: #d3d3d3;
}
.td-project__selectallmenu {
    background-color: #1a1a1a;
}
.td-project__selectallmenu__item:hover {
    color: #ff8562;
}
.td-project__selectallmenu__close::before, .td-project__selectallmenu__close::after {
    background-color: #d3d3d3;
}
.td-sites-grid__item {
    background-color: rgb(52 52 52);
    border: 1px solid rgb(100 69 61);
}
.td-sites-grid__item[data-item-kind="em"] {
    background-color: rgb(39 74 86 / 38%) !important;
}
.td-sites-grid__item:hover {
    background-color: rgb(44 41 38);
}
.td-sites-grid__item a, .td-site__title, .td-site__descr {
    color: #d3d3d3;
}
.td-sites-grid__more {
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='24px' height='24px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3EArtboard%3C/title%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Artboard' fill='%23ffffff' fill-rule='nonzero'%3E%3Cpath d='M11.75,18 C12.7164983,18 13.5,18.7835017 13.5,19.75 C13.5,20.7164983 12.7164983,21.5 11.75,21.5 C10.7835017,21.5 10,20.7164983 10,19.75 C10,18.7835017 10.7835017,18 11.75,18 Z M11.75,10.5 C12.7164983,10.5 13.5,11.2835017 13.5,12.25 C13.5,13.2164983 12.7164983,14 11.75,14 C10.7835017,14 10,13.2164983 10,12.25 C10,11.2835017 10.7835017,10.5 11.75,10.5 Z M11.75,3 C12.7164983,3 13.5,3.78350169 13.5,4.75 C13.5,5.71649831 12.7164983,6.5 11.75,6.5 C10.7835017,6.5 10,5.71649831 10,4.75 C10,3.78350169 10.7835017,3 11.75,3 Z' id='Shape'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.td-site__hr {
    background-color: #4e4e4e;
}
.td-sites-more {
    background-color: #282828;
}
.td-sites-more__header {
    color: rgb(211 211 211 / 50%);
}
.td-sites-more__link:hover {
    background-color: #303030;
}
center a:hover {
    color: #ff8562 !important;
}

/* стили для страниц https://tilda.cc/projects/settings */
.ss-container {
    background-color: #242424;
}
.ss-container__wrapper a, .ss-header-nav__item {
    color: #d3d3d3;
}
.ss-header-nav__img, .jq-checkbox.checkbox-btn, .ss-list-link-forms li a::before, .ss-list-link li a:before {
    filter: invert(1);
}
.ss-wrapper {
    background: rgb(52 52 52);
    border: 1px solid #444444;
}
.ss-menu {
    border: 1px solid #444444;
}
.ss-label {
    color: #999999;
}
.ss-menu-pane__description, .ss-input, .ss-menu-pane__title, .ss-form-group__hint, .ss-list-link-forms li a, .ss-list-link li a {
    color: #d3d3d3;
}
.ss-container__wrapper .ss-form-group__hint a {
    color: #fa633f;
}
.ss-list-link-forms li a:hover:before, .ss-list-link li a:hover:before {
    filter: invert(0);
}
#ss_menu_analytics .ss-btn.ss-btn-white, #ss_menu_seo .ss-btn.ss-btn-white {
    border: 0 !important;
}
.ss-container__wrapper a.ss-btn, .ss-container__wrapper a.ss-button, .ss-container__wrapper a.td-popup-btn, .ss-container__wrapper .ss-menu__item_active a {
    color: #fff;
}
.ss-container__wrapper a.ss-btn-white, .ss-container__wrapper a.btn-default {
    color: #000;
}
.ss-container__wrapper a.ss-btn-white:hover, .ss-container__wrapper a.btn-default:hover {
    color: #fa876b;
}
.ss-menu__item a:hover {
    background: rgb(0 0 0 / 12%);
}
.ss-container__wrapper .ss-menu__item_active a:hover {
    background: #fa876b;
}
.t265-wrapper {
    background: #484848 !important;
}
.ss-tabs__menu {
    border-bottom-color: rgb(255 255 255 / 10%);
}
.ss-tabs__item#ss-tabs__line {
    background: #fa876b;
}

/* стили для страниц https://tilda.cc/page/ */
body {
    color: #d3d3d3;
    background-color: #242424;
}
.recordediticons {
    color: #000;
}
.recordediticons a {
    color: #d3d3d3 !important;
}
#editforms, #editformsxl, .tp-library__body, .tp-shortcuttools__table, .tp-menu__leftdrop-list-folder {
    color: #000;
}
.tp-menu {
    background-color: rgb(34 34 34);
    box-shadow: 0 0 20px rgb(8 8 8 / 40%);
}
.tp-menu__wrapper a {
    color: #d3d3d3;
}
.tp-menu__leftdrop-icon:hover, .tp-menu__rightitems .annexx-publish svg:hover, .tp-menu__item > a:hover {
    background-color: rgb(52 52 52 / 50%) !important;
}
.tp-menu__waves, .tp-menu__leftdrop-icon img, .tp-menu__leftdrop-list-ico-home {
    filter: invert(1);
}
.annexx-open-link-page svg polygon {
    fill: #d3d3d3 !important;
}
.tp-menu__item .caret {
    border-top-color: #d3d3d3;
}
.tp-menu__item > a:hover .caret {
    border-top-color: #f4846b;
}
.tp-menu__item {
    overflow: hidden;
}
.tp-menu__item.dropdown.open {
    overflow: visible;
}
.dropdown-menu {
    background: #303030;
}
.dropdown-menu .tp-menu__item-drop a {
    color: #d3d3d3;
}
.dropdown-menu>li>a:hover, .dropdown-menu>li>a:focus {
    background-color: #262626;
}
.tp-menu__leftdrop-list {
    background-color: rgb(52 52 52);
    overflow-y: auto;
    overflow-x: hidden;
}
.tp-menu__leftdrop-list a {
    color: #fff;
}
.tp-menu__leftdrop-list a:hover {
    color: #f4846b !important;
    background-color: rgb(34 34 34 / 60%) !important;
}
.tp-menu__leftdrop-list-folder {
    color: #d3d3d3;
}
.tp-record-edit-icons-left__dropdown-menu {
    background-color: #303030;
}
.tp-tplswitch-item:hover {
    background-color: #242424;
}
a[href="/projects/"] .tp-menu__item__icon path {
    fill: #d3d3d3;
    stroke: none;
}
.tp-menu__item__icon path {
    stroke: #d3d3d3;
}
.tp-menu__breadcrumbs__item:hover path {
    stroke: #fa876b;
}
.tp-menu__page__dropdown-toggler:hover {
    background-color: rgb(0 0 0 / 20%);
}
.tp-menu__dropdown__arrow::after, .tp-menu__navbar__item .dropdown-toggle::after {
    border-top-color: #d3d3d3;
}
.tp-menu__navbar__item:hover .dropdown-toggle::after {
    border-top-color: #fa876b;
}
.tp-menu__page:hover .tp-menu__breadcrumbs__item_editable {
    filter: invert(1);
}
.tp-menu__navbar__item:hover {
    background-color: rgb(52 52 52 / 50%) !important;
}
.tp-menu__navbar__item:hover .tp-menu__navbar__button, .tp-menu__navbar__item:hover .tp-menu__navbar__button.dropdown-toggle {
    color: #ff8562;
}
</style>'`);

})();