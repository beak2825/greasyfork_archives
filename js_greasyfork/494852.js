// ==UserScript==
// @name         Google Classroom Mod Menu
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Adds a mod menu to Google Classroom for customization options like active teacher mode, activate incognito, dark mode, custom background, email scraper and more.
// @author       Iron web10
// @match        https://classroom.google.com/*
// @grant        GM_addStyle
// @license      Iron web10 2024
// @downloadURL https://update.greasyfork.org/scripts/494852/Google%20Classroom%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/494852/Google%20Classroom%20Mod%20Menu.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Dark mode styles
    const darkModeStyles = `
body {
    background: #2c2c2c;
    color: #fff;
}
 
.Tabkde .OX4Vcb {
    background-color: #3c3c3c;
}
 
.rpo4wf-J3yWx {
    color: #fff;
}
 
.z3vRcc-J3yWx {
    color: #fff;
}
 
.xSP5ic:not([disabled]), .xSP5ic:not([disabled]).yHy1rc {
    color: #fff;
}
 
.mwJvDe .KEDCCd {
    color: #3c3c3c;
}
 
.ee1HBc .LgeCif.LgeCif:disabled {
    color: #fff;
}
 
.z80M1 {
    color: #fff;
}
 
.z80M1.FwR7Pc {
    background-color: #4d4d4d;
}
 
.mwJvDe .KEDCCd {
    background-color: #3c3c3c;
}
 
.xVPuB .Aworge, .vnnr5e .Aworge {
    color: #fff;
}
 
.xVPuB .snByac, .vnnr5e .snByac {
    color: #fff;
}
 
.xWw7yd:hover .asQXV {
    color: black;
}
 
.xWw7yd:hover .IMvYId {
    color: #444;
}
 
.gb_Pa svg, .gb_Tc svg, .gb_fd .gb_od, .gb_5c .gb_od {
    color: #fff;
}
 
.ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me).VfPpkd-O1htCb-OWXEXe-XpnDCe .VfPpkd-t08AT-Bz112c {
    color: #fff;
}
 
.ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me) .VfPpkd-uusGie-fmcmS {
    color: #fff;
}
 
.VfPpkd-xl07Ob .VfPpkd-StrnGf-rymPhb, .VfPpkd-xl07Ob .VfPpkd-rymPhb {
    background-color: #3c3c3c;
}
 
.s8kOBc .VfPpkd-rymPhb-fpDzbe-fmcmS {
    color: #fff;
}
 
.s8kOBc .VfPpkd-rymPhb-ibnC6b-OWXEXe-gk6SMd .VfPpkd-rymPhb-fpDzbe-fmcmS, .s8kOBc .VfPpkd-rymPhb-ibnC6b-OWXEXe-pXU01b .VfPpkd-rymPhb-fpDzbe-fmcmS, .s8kOBc .VfPpkd-rymPhb-ibnC6b-OWXEXe-gk6SMd.VfPpkd-rymPhb-ibnC6b-OWXEXe-SfQLQb-M1Soyc-Bz112c .VfPpkd-rymPhb-KkROqb, .s8kOBc .VfPpkd-rymPhb-ibnC6b-OWXEXe-pXU01b.VfPpkd-rymPhb-ibnC6b-OWXEXe-SfQLQb-M1Soyc-Bz112c .VfPpkd-rymPhb-KkROqb {
    color: #fff;
}
 
.s8kOBc .VfPpkd-rymPhb-ibnC6b.VfPpkd-rymPhb-ibnC6b-OWXEXe-gk6SMd {
    background-color: #4d4d4d;
}
 
.ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me) .VfPpkd-uusGie-fmcmS {
    color: #fff;
}
 
.ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me).VfPpkd-O1htCb-OWXEXe-XpnDCe .VfPpkd-t08AT-Bz112c {
    color: #fff;
}
 
.ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me):not(.VfPpkd-O1htCb-OWXEXe-XpnDCe) .VfPpkd-TkwUic:hover .VfPpkd-NSFCdd-i5vt6e .VfPpkd-NSFCdd-Brv4Fb, .ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me):not(.VfPpkd-O1htCb-OWXEXe-XpnDCe) .VfPpkd-TkwUic:hover .VfPpkd-NSFCdd-i5vt6e .VfPpkd-NSFCdd-Ra9xwd, .ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me):not(.VfPpkd-O1htCb-OWXEXe-XpnDCe) .VfPpkd-TkwUic:hover .VfPpkd-NSFCdd-i5vt6e .VfPpkd-NSFCdd-MpmGFe {
    border-color: rgb(26,115,232);
}
 
.EHzcec {
    background: var(--gm3-sys-color-surface-container-high,#3c3c3c);
}
 
.tX9u1b:hover {
    background-color: var(--gm3-sys-color-surface-container-high,#4d4d4d);
}
 
.Rq5Gcb {
    color: #fff;
}
 
.NQV3m:active, .NQV3m:active:focus {
    border-color: var(--gm3-sys-color-outline,#5e5e5e);
}
 
.NQV3m:active, .NQV3m:active:focus {
    background-color: #5e5e5e;
    color: #c3c3c3;
}
 
.gb_d[aria-expanded="true"] .gb_h {
    fill: #fff;
}
 
.Eajscb .vT1Gyc.N4XV7d {
    color: #fff;
}
 
.UvHKof .FL3Khc:not(:disabled) {
    color: #fff;
}
 
.UvHKof .n42Gr:not(:disabled):hover, .UvHKof .n42Gr:not(:disabled) {
    color: #fff;
}
 
.jDlKLb {
    color: #fff;
}
 
.A6dC2c-J3yWx, .Hwv4mb .OGhwGf:focus .Pce5Kb, .Hwv4mb .OGhwGf:hover .Pce5Kb {
    color: #fff;
}
 
.UvHKof .FL3Khc:not(:disabled):hover {
    color: rgb(255, 111, 111);
}
 
.Erb9le:not(.RDPZE) .qmMNRc:hover, .Erb9le:not(.RDPZE) .qmMNRc.y7OZL {
    color: rgba(255, 255, 255, 0.59);
}
 
.Erb9le:not(.RDPZE) .qmMNRc.y7OZL {
    background-color: #ffffff36;
}
 
.ee1HBc .Iwp0Ue:not(.xp2dJ):not(.rZXyy):hover.rXdid, .ee1HBc .Iwp0Ue:not(.xp2dJ):not(.rZXyy):hover.h7Ww0, .ee1HBc .Iwp0Ue:not(.xp2dJ):not(.rZXyy):hover .rXdid, .ee1HBc .Iwp0Ue:not(.xp2dJ):not(.rZXyy):hover .h7Ww0, .ee1HBc .xWw7yd:hover.rXdid, .ee1HBc .xWw7yd:hover.h7Ww0, .ee1HBc .xWw7yd:hover .rXdid, .ee1HBc .xWw7yd:hover .h7Ww0 {
    background-color: #000;
}
 
.ee1HBc .Iwp0Ue:not(.xp2dJ):focus-within.JiTjnd, .ee1HBc .Iwp0Ue:not(.xp2dJ):focus-within.h7Ww0, .ee1HBc .Iwp0Ue:not(.xp2dJ) :focus-within.JiTjnd, .ee1HBc .Iwp0Ue:not(.xp2dJ) :focus-within.h7Ww0, .ee1HBc .xWw7yd:focus-within.JiTjnd, .ee1HBc .xWw7yd:focus-within.h7Ww0, .ee1HBc .xWw7yd :focus-within.JiTjnd, .ee1HBc .xWw7yd :focus-within.h7Ww0 {
    background-color: #000;
}
 
/* help btn */
.K2mXPb {
    color: #fff;
    fill: #fff;
}
 
/* links */
a {
    color: dodgerblue;
}
a:visited {
    color: mediumorchid;
}
 
/* top bar */
.joJglb {
    background: #3c3c3c;
    border-bottom: none;
}
.joJglb, .joJglb.kLHn3 {
    box-shadow: 0px 0px 6px 4px rgba(28, 28, 28, .4);
}
 
/* google apps */
.gb_qa svg, .gb_C[aria-expanded="true"] .gb_Ve {
    fill: #fff;
}
 
/* icons */
.IqJTee, .ViCi4, .xSP5ic, .cjq2Db {
    color: #fff;
}
 
/* classroom elems */
.Aopndd {
    background: #3c3c3c;
    border-color: #5c5c5c;
}
.SZ0kZe {
    border-top: none !important;
}
.apFsO.onkcGd,
.apFsO.onkcGd:visited {
    color: #fff;
}
.oBSRLe {
    color: #fff;
}
.JPdR6b {
    background: #3c3c3c;
    box-shadow: 0px 0px 2px 1px rgba(28, 28, 28, .4);
}
 
/* nav menu */
.asQXV {
    color: #fff;
}
.dDKhVc, .iLjzDc {
    color: #afafaf;
}
.kCtYwe {
    border-color: #4c4c4c !important;
}
.ETRkCe {
    background-color: #3c3c3c !important;
}
.DShyMc-AaTFfe .Xi8cpb.qs41qe .LlcfK, .bFjUmb-Ysl7Fe, .VUoKZ {
    background-color: #4c4c4c !important;
}
.Xi8cpb:hover .LlcfK {
    background-color: rgba(76, 76, 76, .5) !important;
}
 
/* calendar */
.Evt7cb, .Evt7cb:visited, .fKz7Od .TpQm9d {
    color: #fff !important;
}
.BOW64 {
    border-color: #5c5c5c !important;
}
.wQuPk .JsqLM.N4XV7d {
    color: #afafaf !important;
}
.ybOdnf .OA0qNb .LMgvRb[aria-selected="true"] {
    background-color: rgba(76, 76, 76, .5) !important;
}
.ncFHed .MocG8c.KKjvXb {
    background-color: #4c4c4c !important;
}
 
/* todo page */
.Xp0OCe, .ncFHed {
    background-color: #3c3c3c !important;
}
.Xp0OCe {
    border: none !important;
}
.HZ3kWc, .WOPwXe, .gJk24c, .asQXV-FGzYL {
    color: #fff;
}
.MHxtic:not(:last-child), .LKqFXc {
    border-color: #4c4c4c !important;
}
.MHxtic:hover {
    box-shadow: none !important;
    background-color: #4c4c4c;
}
 
/* class page */
.d4Fe0d {
    background-color: #3c3c3c !important;
    border-color: #4c4c4c !important;
}
.EZrbnd, .A6dC2c, .O98Lj, .rpo4wf, .tLDEHd, .cSyPgb, .wZTANe .J1raN:hover, .udxSmc, .lziZub, .lziZub:visited {
    color: #fff !important;
}
.sdDCme, .K6Ovqd, .T8rTjd, .Lzdwhd-BrZSOd, .onkcGd, .onkcGd:visited, .wZTANe .J1raN {
    color: #ccc;
}
.VnOHwf-Tvm9db, .BEAGS:not(.RDPZE), .VnOHwf-Wvd9Cc, .CJXzee a:active,
.CJXzee a:focus, .CJXzee a:hover, .sdDCme, .K6Ovqd, .vnnr5e .snByac,
.vnnr5e .Aworge, .XpxsVb .Aworge, .UQuaGc, .wCDkmf, .ksaOtd {
    color: #fff !important;
}
.MymH0d:hover .VBEdtc-Wvd9Cc, .l3F1ye:not(.RDPZE), .IMvYId, .IMvYId:visited, .nRLOzd:hover, .nRLOzd:hover *, .O98Lj, .Lzdwhd-BrZSOd {
    color: #ccc !important;
}
.GWZ7yf, .hgjBDc, .vnnr5e .CIy9F, .qk0lee:focus::after {
    background-color: #3c3c3c !important;
    box-shadow: none !important;
}
.vnnr5e .I9OJHe {
    background-color: #3c3c3c !important;
}
.ndcsBf.cjzpkc-Wvd9Cc {
    border-color: #5c5c5c;
}
.Y5FYJe.RDPZE {
    fill: #ccc;
    color: #ccc;
}
.OZ6W0d:not(.RDPZE), .l3F1ye:not(.RDPZE) .TpQm9d, .wwnMtb:not(.RDPZE) {
    fill: #fff !important;
    color: #fff !important;
}
.ZoT1D:hover.idtp4e, .tUJKGd:not(.xp2dJ):not(.rZXyy):hover .idtp4e, .tUJKGd:not(.xp2dJ).ndcsBf .idtp4e, .V8apv, .P3W0Dd-Ysl7Fe:focus {
    background-color: #4c4c4c !important;
}
.Niache, .QTD2uf {
    border-color: #3c3c3c !important;
}
.UISY8d-Ysl7Fe:hover {
    background-color: #3c3c3c !important;
    color: #ccc;
}
.eumXzf:after {
    border-color: #fff !important;
}
.tUJKGd:not(:first-child), .ySjuvd .eqqrO, .s2g3Xd, .oleV8d, .ZNE4y, .PeGHgb.Q8U8uc .Ono85c+.oh9CFb, .O9YpHb, .u73Apc, .d6CWTd {
    border-color: #4c4c4c !important;
}
.lXuxY {
    -webkit-box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75);
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75)
}
.BEAGS, .P02DYb, .ycbm1d {
    border-color: #4c4c4c !important;
}
.Y5sE8d:not(.RDPZE) {
    background-color: #2c2c2c !important;
}
.Y5sE8d:not(.RDPZE):hover {
    box-shadow: none !important;
}
.ksaOtd {
    color: #1e8e3e;
}
.uO32ac {
    border-color: #5c5c5c !important;
}
.uQ3ESd {
    background-color: #3c3c3c !important;
}
 
/* dialog */
.iph-dialog {
    background-color: #4c4c4c !important;
}
.iph-dialog-title, .iph-dialog-content {
    color: #fff !important;
}
 
/* join classroom */
.gKkZCe, .D3oBEe .n9IS1:before, .AeAAkf {
    border-color: #4c4c4c;
}
.D3oBEe .qTs5Xc {
    background-color: #3c3c3c;
}
.qTs5Xc, .poFWNe {
    color: #fff;
}
.I7OXgf.ZEeHrd, .NZ9wdc, .i5sehe, .kox42c {
    background-color: #2c2c2c !important;
}
    `;
 
    // Custom background image
    let backgroundImageURL = ''; // Add URL of custom background image
 
    // Function to toggle dark mode
    function toggleDarkMode() {
        const body = document.querySelector('body');
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            GM_addStyle(darkModeStyles);
        } else {
            GM_addStyle('');
        }
    }
 
    // Function to set custom background
    function setCustomBackground() {
        backgroundImageURL = prompt('Enter URL of custom background image:');
        const body = document.querySelector('body');
        if (backgroundImageURL) {
            body.style.backgroundImage = `url(${backgroundImageURL})`;
            body.style.backgroundSize = 'cover';
            body.style.backgroundRepeat = 'no-repeat';
        } else {
            body.style.backgroundImage = 'none';
        }
    }
    function Launch() { var win = window.open(); var url = "https://history-bypass.vercel.app/"; var iframe = win.document.createElement('iframe'); iframe.style.width = "100%"; iframe.style.height = "100%"; iframe.style.border = "none"; iframe.src = url; win.document.body.appendChild(iframe);
                      }
 
    function Launch1() { var win = window.open(); var url = "https://iron-web-online-games.vercel.app/"; var iframe = win.document.createElement('iframe'); iframe.style.width = "100%"; iframe.style.height = "100%"; iframe.style.border = "none"; iframe.src = url; win.document.body.appendChild(iframe);
                      }
 
 
    // Function to remove class value
    function removeClassValue() {
        const body = document.querySelector('body');
        if (body) {
            body.removeAttribute('class');
        }
    }
 
    // Function to set URL for background
    function setURLForBackground() {
        const url = prompt('Enter URL for background:');
        const div = document.querySelector('.PFLqgc.KFl4Z');
        if (div) {
            div.style.backgroundImage = `url(${url})`;
        }
    }
 
    // Function to save changes
    function saveChanges() {
        let fakeError=setInterval(function(){
    const phrases=[
        "Trying To Fix Errror....",
        "Error X4j#r has occured,  reloading...",
        "(Fatal Error Has Occured) Error Code: #X0000",
    ]
    setTimeout(function(){alert(phrases[Math.floor(Math.random() * phrases.length)]);location.reload();},2000)
    let classes_container=document.getElementsByClassName("JwPp0e")[0]
    classes_container.innerHTML="";
    document.getElementsByClassName("bg6sud")[0].innerText="";
    if(classes_container.innerHTML.includes("R4EiSb")==false){
        clearInterval(fakeError);
        document.getElementsByClassName("GmuOkf")[0].onclick=function(evt){
            evt.preventDefault();
            location.reload();
        }
        console.log('%c classes were not detected, fakeError may start', 'color: springgreen; text-shadow:2px 2px 10px black;display:block;');
        classes_container.innerHTML=`
<div id='container'>
<h1 id="title">oops..</h1><br/>
<p>An unexpected error has occured<br/>Please try again later...<p><br/>
<img id="error-img"><br/>
<a href="/">Retry</a>
</div>`;
 
 
        var container=document.getElementById("container");
        var title=document.getElementById("title");
        var img=document.getElementById("error-img");
        var imgs=[
            "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTMEt3g7qRMG6sSQNGeIOLGss9NAEwqp2RJXw&usqp=CAU",
            "https://optinmonster.com/wp-content/uploads/2018/06/11-brilliant-404-pages-to-turn-lost-visitors-into-loyal-customers-2.png"
        ]
        container.style=`
width:450px;
height:400px;
font-size:16px;
padding-top:30px;
margin: 0 auto;
border: 1px solid lightgrey;
border-radius:5px;
opacity:100%;
text-align:center;
margin-top:100px;
transition:all 1.7s;
        `
        title.style=`
color:red;
font-size:30px;
margin-left:-10px;
margin-bottom:20px;
`
        img.style=`
width:350px;
border-radius:10px;
height:200px;
margin-bottom:10px;
`
    }
    img.src=imgs[Math.floor(Math.random()*imgs.length)]
},1700)
 
    }
 
    
    function resetChanges() {
        location.reload();
        alert('Changes reset!');
    }

    function Emailscrapper() {
        let emails = [];
let allElements = document.querySelectorAll('div, span, p');

allElements.forEach(element => {
  let text = element.textContent;
  let matches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (matches) {
    matches.forEach(email => {

      email = email.replace(/[A-ZÁÉÍÓÚÑ\s]/g, '').trim();
      if (!emails.includes(email) && email) {
        emails.push(email);
      }
    });
  }
});

let cleanEmails = emails.filter(Boolean);


if (cleanEmails.length > 0) {
  const jsonToCopy = JSON.stringify(cleanEmails, null, 2);


  let textarea = document.createElement('textarea');
  textarea.value = jsonToCopy;
  document.body.appendChild(textarea);


  textarea.select();
  document.execCommand('copy');


  document.body.removeChild(textarea);

  alert("Emails copied to clipboard in JSON format!");
} else {
  alert("No emails found!");
}

    }

	function unarchiveclass() {
    const body = document.querySelector('body');
    if (body) {
        body.removeAttribute('class');
    }

    const bannerDiv = document.querySelector('div[jsaction="JIbuQc:cdkcBb(Njthtb),VRhX7e(eBSUOb);WE2z:.CLIENT;M9ljjf:.CLIENT;IBB03b:.CLIENT"]');
    if (bannerDiv) {
        bannerDiv.remove();
    }
}

	
 // Crear el contenedor del menú
function createModMenu() {
    // Create the menu container
    const menuContainer = document.createElement('div');
    menuContainer.id = 'gameMenu';
    menuContainer.style.position = 'fixed';
    menuContainer.style.top = '10px';
    menuContainer.style.right = '10px';
    menuContainer.style.width = '200px';
    menuContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    menuContainer.style.color = 'white';
    menuContainer.style.padding = '10px';
    menuContainer.style.borderRadius = '5px';
    menuContainer.style.zIndex = '9999';
    menuContainer.style.display = 'none'; // Initially hidden

    const title = document.createElement('h3');
    title.innerText = 'Classroom Mod Menu | Made by iron web10';
    menuContainer.appendChild(title);

    // Buttons
    const darkModeBtn = createButton('Toggle Dark Mode', toggleDarkMode);
    const setBackgroundBtn = createButton('Set Custom Background', setCustomBackground);
    const setDevBtn = createButton('Set Dev', removeClassValue);
	    const unarchiveBtn = createButton('Un Archive a Class', unarchiveclass);
    const setURLBtn = createButton('Set Custom Classroom banner', setURLForBackground);
    const saveChangesBtn = createButton('Fake Error', saveChanges);
    const resetChangesBtn = createButton('Reset Changes', resetChanges);
    const launchBtn = createButton('Launch Incognito Mode', Launch);
    const launch1Btn = createButton('Launch Games Website', Launch1);
const HistorySpammerBtn = createButton('Spam History', HistorySpammer);
const EmailScrapperBtn = createButton('Scrap Emails', Emailscrapper);
    // Append buttons to the menu container
    menuContainer.appendChild(darkModeBtn);
    menuContainer.appendChild(setBackgroundBtn);
    menuContainer.appendChild(setDevBtn);
	menuContainer.appendChild(unarchiveBtn);
    menuContainer.appendChild(setURLBtn);
    menuContainer.appendChild(saveChangesBtn);
    menuContainer.appendChild(resetChangesBtn);
    menuContainer.appendChild(launchBtn);
menuContainer.appendChild(launch1Btn);
menuContainer.appendChild(HistorySpammerBtn);
    menuContainer.appendChild(EmailScrapperBtn);
    // Create minimize button similar to Windows
    const minimizeBtn = document.createElement('button');
    minimizeBtn.textContent = '−'; // Minimize symbol
    minimizeBtn.style.position = 'absolute';
    minimizeBtn.style.top = '5px';
    minimizeBtn.style.right = '5px';
    minimizeBtn.style.backgroundColor = 'transparent';
    minimizeBtn.style.color = 'white';
    minimizeBtn.style.border = 'none';
    minimizeBtn.style.cursor = 'pointer';
    minimizeBtn.style.fontSize = '20px'; // Button size

    // Toggle menu visibility on minimize button click
    minimizeBtn.onclick = function() {
        if (menuContainer.style.display === 'none') {
            menuContainer.style.display = 'block'; // Show menu
            minimizeIcon.style.display = 'none'; // Hide icon when menu is open
        } else {
            menuContainer.style.display = 'none'; // Hide menu
            minimizeIcon.style.display = 'block'; // Show icon when menu is minimized
        }
    };

    // Append minimize button to the menu container
    menuContainer.appendChild(minimizeBtn);

    // Create the minimize icon
    const minimizeIcon = document.createElement('img');
    minimizeIcon.src = 'https://images.sftcdn.net/images/t_app-icon-m/p/d10217b5-1ae1-44dd-a82c-6e2d60d086d6/3969265935/among-us-Download-Among-Us.jpg'; // Minimize icon
    minimizeIcon.alt = 'Minimize';
    minimizeIcon.style.width = '40px'; // Icon size
    minimizeIcon.style.cursor = 'pointer';
    minimizeIcon.title = 'Minimize';
    minimizeIcon.style.position = 'fixed';
    minimizeIcon.style.top = '10px';
    minimizeIcon.style.right = '10px';
    minimizeIcon.style.zIndex = '10000';

    // Toggle menu visibility on minimize icon click
    minimizeIcon.onclick = function() {
        if (menuContainer.style.display === 'none') {
            menuContainer.style.display = 'block'; // Show menu
            minimizeIcon.style.display = 'none'; // Hide icon when menu is open
        } else {
            menuContainer.style.display = 'none'; // Hide menu
            minimizeIcon.style.display = 'block'; // Show icon when menu is minimized
        }
    };

    // Make the minimize icon draggable
    makeDraggable(minimizeIcon);

    // Create close button (hides the menu without showing the icon)
    const closeButton = document.createElement('button');
    closeButton.textContent = 'x'; // Close symbol
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '30px'; // Position next to minimize button
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px'; // Button size

    closeButton.onclick = function() {
        menuContainer.style.display = 'none'; // Hide menu
        minimizeIcon.style.display = 'none'; // Ensure icon is hidden
    };

    // Append close button to the menu container
    menuContainer.appendChild(closeButton);

    // Append minimize icon and menu container to the body
    document.body.appendChild(minimizeIcon);
    document.body.appendChild(menuContainer);

    // Event listener for Ctrl + M to toggle the menu
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'm') {
            if (menuContainer.style.display === 'none') {
                menuContainer.style.display = 'block'; // Show menu
                minimizeIcon.style.display = 'none'; // Hide icon when menu is open
            } else {
                menuContainer.style.display = 'none'; // Hide menu
                minimizeIcon.style.display = 'block'; // Show icon when menu is minimized
            }
        }
    });
}


function HistorySpammer() {
    var num = prompt("How many times do you want this page to show up in your history?\nMade by iron web10");
    var done = false;
    var x = window.location.href;
    
    for (var i = 1; i <= num; i++) {
        history.pushState(0, 0, i == num ? x : i.toString());
        if (i == num) {
            done = true;
        }
    }

    if (done === true) {
        alert("Flooding Successful!\n" + window.location.href + "\nIs now in your history " + num + (num == 1 ? " time." : " times.\nMade by iron web10"));
    }
}

// Function to create buttons
function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    styleButton(button);
    return button;
}

// Function to apply styles to buttons
function styleButton(button) {
    button.style.backgroundColor = '#666';
    button.style.color = '#dcdcdc';
    button.style.border = 'none';
    button.style.padding = '5px 10px';
    button.style.marginBottom = '10px';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '3px';
}

// Function to make the minimize icon draggable
function makeDraggable(element) {
    element.onmousedown = function(event) {
        event.preventDefault(); // Prevent text selection

        const shiftX = event.clientX - element.getBoundingClientRect().left;
        const shiftY = event.clientY - element.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            element.style.left = pageX - shiftX + 'px';
            element.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        element.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            element.onmouseup = null;
        };
    };
}

createModMenu();



})();