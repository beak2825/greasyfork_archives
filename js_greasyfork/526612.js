// ==UserScript==
// @name          104 企業大師：夜間模式
// @namespace     https://github.com/HayaoGai
// @version       0.0.1
// @description   夜間模式
// @author        Hayao-Gai
// @match         https://pro.104.com.tw/*
// @icon          https://blog.104.com.tw/wp-content/uploads/2020/08/cropped-104logo-orange.png
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/526612/104%20%E4%BC%81%E6%A5%AD%E5%A4%A7%E5%B8%AB%EF%BC%9A%E5%A4%9C%E9%96%93%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/526612/104%20%E4%BC%81%E6%A5%AD%E5%A4%A7%E5%B8%AB%EF%BC%9A%E5%A4%9C%E9%96%93%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    "use strict"

    const DARK1 = "#1C1C21"
    const DARK2 = "#262626"
    const DARK3 = "#333333"
    const DARK4 = "#696969D1"
    const YELLOW1 = "#D1AF60"
    const YELLOW2 = "#573F19"
    const GREEN = "#1D5228"
    const RED = "#CE625B"
    const BLUE1 = "#3A8C92"
    const BLUE2 = "#92BCFF"
    const WHITE1 = "#BFBFBF"

    function main () {
        const background1 = document.querySelector( "#PRO-header" )
        const background2 = document.querySelector( "#PSC-header" )
        const background3 = document.querySelector( "#PSC2" )
        const background4 = document.querySelector( ".Calendar-header" )
        const background5 = document.querySelector( ".week-title" )
        const background6 = document.querySelector( ".Calendar" )
        const background7 = document.querySelector( ".mode-control" )
        const background8 = document.querySelectorAll( ".PSC-HomeWidget" )
        const background9 = document.querySelectorAll( ".flatpickr-weekdaycontainer" )
        const background10 = document.querySelectorAll( ".-body" )
        const background11 = document.querySelectorAll( ".PSC-ClockIn-root" )
        const text1 = document.querySelector( "#companyName" )
        const text2 = document.querySelector( ".range-view" )
        const text3 = document.querySelectorAll( ".title" )
        const text4 = document.querySelectorAll( ".date-panel-text" )
        const button1 = document.querySelectorAll( ".btn-ghost" )
        const button2 = document.querySelectorAll( ".btn-gray" )
        const button3 = document.querySelectorAll( ".btn-lg" )
        const button4 = document.querySelectorAll( ".formItem" )
        const days = document.querySelector( ".days" )
        const dates = days ? [ ...days.children ] : []
        const notices = document.querySelectorAll( ".notice" )
        const oks = document.querySelectorAll( ".ok" )
        const notoks = document.querySelectorAll(".punch.abnormal")
        const festivals = document.querySelectorAll( ".festival" )
        const restDays = document.querySelectorAll( ".restDay" )
        const clockIns = document.querySelectorAll( ".clockIn" )
        background1 && ( background1.style.background = DARK1 )
        background2 && ( background2.style.background = YELLOW1 )
        background3 && ( background3.style.background = DARK1 )
        background4 && ( background4.style.background = DARK1 )
        background5 && ( background5.style.background = YELLOW2 )
        background6 && ( background6.style.background = DARK1 ) && ( background6.style.borderColor = DARK1 )
        background7 && ( background7.style.borderColor = DARK1 )
        background8.forEach( background => {
            background.style.background = DARK1
            background.style.borderColor = DARK3
        } )
        background9.forEach( background => { background.style.background = DARK1 } )
        background10.forEach( background => { background.style.borderColor = DARK3 } )
        background11.forEach( background => { background.style.opacity = "0.8" } )
        text1 && ( text1.style.color = WHITE1 )
        text2 && ( text2.style.color = WHITE1 )
        text3.forEach( text => { text.style.color = WHITE1 } )
        text4.forEach( text => {
            text.style.background = DARK3
            text.style.color = WHITE1
        } )
        button1.forEach( button => {
            button.style.background = DARK2
            button.style.color = WHITE1
        } )
        button2.forEach( button => {
            button.style.background = DARK2
            button.style.color = WHITE1
        } )
        button3.forEach( button => {
            button.style.background = DARK4
            button.style.color = BLUE2
        } )
        button4.forEach( button => {
            button.style.background = DARK2
            button.style.color = WHITE1
        } )
        days && ( days.style.borderColor = DARK1 )
        dates.forEach( date => {
            date.style.background = DARK1
            date.style.borderColor = DARK3
        } )
        notices.forEach( notice => {
            notice.style.background = YELLOW2
            notice.style.color = WHITE1
        } )
        oks.forEach( ok => {
            ok.style.background = GREEN
            ok.style.border = DARK1
        } )
        notoks.forEach( notok => {
            notok.style.background = RED
            notok.style.border = DARK1
        } )
        festivals.forEach( festival => {
            festival.style.background = BLUE1
            festival.style.border = DARK1
        } )
        restDays.forEach( restDay => {
            restDay.style.background = DARK2
            restDay.style.borderColor = DARK1
            restDay.style.color = WHITE1
        } )
        clockIns.forEach( clockIn => {
            clockIn.style.background = DARK2
            clockIn.style.border = DARK1
            clockIn.style.color = BLUE2
        } )
    }

    for ( let i = 0; i < 10; i++ ) setTimeout( main, 500 * i )
})()