// ==UserScript==
// @name        IPT BannerFix
// @description IPT BannerFix - Fixes the ridiculously large IPT Banner Section to a reasonable size.
// @include     *iptorrents.com/*
// @include     *ipt.lol/*
// @include     *ipt.cool/*
// @include     *ipt.world/*
// @include     *ip.findnemo.net/*
// @include     *ip.getcrazy.me/*
// @include     *ip.venom.global/*
// @include     *ip.workisboring.net/*
// @version     1.1
// @grant       none
// @namespace https://greasyfork.org/users/64132
// @downloadURL https://update.greasyfork.org/scripts/33365/IPT%20BannerFix.user.js
// @updateURL https://update.greasyfork.org/scripts/33365/IPT%20BannerFix.meta.js
// ==/UserScript==


//CLEANUP
//Slim Down the Banner
document.querySelector('.bannerPlaceholder').remove();
document.querySelector('#iptStart .banner').style = 'background-color: black; height: 95px';
// Fixing the new Mouseover hiding crap on the top rows  ---  not the best way of doing this but works for now
document.querySelector('.topRow').style = 'opacity: 1; height: 25px; top: 0px;';
document.querySelector('.stats').style = 'opacity: 1; height: 65px; top: 30px';
document.querySelector('.ql').style = 'opacity: 1; height: 55px';

//Remove Top Torrents Section
document.getElementById('toggleTopA').remove();

//Remove Bullshit (Donation) Announces over Categories
document.querySelector('#body > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > h1:nth-child(1)').remove();
document.querySelector('#body > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > h1:nth-child(2)').remove();
document.querySelector('#body > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > b:nth-child(1)').remove();
document.querySelector('#body > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > b:nth-child(1)').remove();
document.querySelector('#body > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > iframe:nth-child(4)').remove();
document.querySelector('#body > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > b:nth-child(1)').remove();
document.querySelector('#body > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > b:nth-child(4)').remove();