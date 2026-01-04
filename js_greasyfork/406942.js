// ==UserScript==
// @name         Anime1.com Improved Dark Theme +Download Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  finally i can watch my anime AND not kill my eye cells! how convenient! *ublock origin recommended (not tested without)*
// @author       ayunami2000
// @match        http*://www.anime1.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/406942/Anime1com%20Improved%20Dark%20Theme%20%2BDownload%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/406942/Anime1com%20Improved%20Dark%20Theme%20%2BDownload%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.documentElement.style.background="#202020";
    document.documentElement.style.opacity=0;
    window.addEventListener("load",()=>{
        document.documentElement.style="";
        document.documentElement.removeAttribute("style");
    });
    document.addEventListener('DOMContentLoaded',()=>{
        document.head.innerHTML=`
        <style>
          *
          {
            transition:* 125ms ease-in-out;
          }
          html,
          :root,
          body
          {
            background:#202020;
          }
          ul.ongoing-list li.dark a
          {
            color:#cfcfcf!important;
          }
          div.footer,
          div.footer-bg,
          div.episode-s-main,
          div.latest-box.mobile-hide,
          div.seo-box
          {
            background:Transparent!important;
          }
          div.ep-list-ep,
          div.latest-box.mobile-hide,
          div.seo-box
          {
            border:1px solid #5e5e5e!important;
          }
          ul.ab-nav.harrynav li:not(:last-child)
          {
            border-right:1px solid #5e5e5e!important;
          }
          div.player-main div.player-x-buttons div.p-left-buttons a,
          div.player-main div.player-x-buttons div.p-right-buttons div,
          div.player-main div.player-s-buttons,
          div.player-main div.video-nav td a,
          div#ReportDiv.report-b,
          div.add-f,
          div.add-wl,
          div.ep-list-ep,
          div.video-not-playing,
          a.click-older,
          ul.ab-nav.harrynav,
          ul.ab-nav.harrynav li,
          div.latest-box
          {
            background:#333333!important;
            color:#ababab!important;
          }
          div.footer
          {
            position:relative!important;
            bottom:0!important;
            padding-top:54px!important;
          }
          div.footer-bg
          {
            padding-bottom:18px!important;
          }
          div.banner>a.b-reg,
          div.banner>div.b-ad
          {
            display:none;
          }
          div.anime1-home-page,
          div.anime1-home-page>a.home,
          div.player-x-buttons
          {
            z-index:99999!important;
          }
          div#center.center
          {
            position:absolute!important;
            top:72px!important;
            left:0!important;
            right:0!important;
            bottom:0!important;
            height:100%!important; /*---------------------potentially problematic with top navbar----------------*/
          }
          div.banner
          {
            height:36px;
            position:-webkit-sticky!important;
            position:sticky!important;
            top:0!important;
          }
          div.header
          {
            background:Transparent;
            overflow:hidden;
            height:72px!important;
          }
          div.big-menu
          {
            position:absolute;
            width:100%!important;
            top:0;
            left:0!important;
            right:0;
            border:0!important;
            outline:1px solid #333333!important;
          }
          div.player-main div.player-x-buttons,
          div.player-main div.player-s-buttons
          {
            z-index:99999!important;
            background:#202020!important;
          }
          div.big-menu,
          div.big-menu>ul,div.big-menu>ul>li
          {
            z-index:999!important;
            background:#333333!important;
          }
          div.big-menu>ul>li>a:not(:hover),
          div.episode-s-main,
          ul.anime-list *,
          div.latest-box.mobile-hide p.spam,
          div.seo-box,
          div.anime div.detail-left,
          div.anime div.detail-left strong:not(.highlight),
          div.anime div.detail-left a,
          ul.ongoing-list li:not(.dark) a,
          div.ep-text h4
          {
            color:#ababab!important;
          }
        </style>
        `+document.head.innerHTML;
        var theFooter=document.querySelector("div.footer"),
            theFooterData=theFooter.outerHTML;
        theFooter.outerHTML="";
        document.querySelector("div#center.center").innerHTML+=theFooterData;
        if(document.body.innerHTML.includes("jwplayer")){
            var downurl=document.body.innerHTML.replace(/\n/g,"").replace(/ +/g," ").replace(/^.*var v_src = \[ { file: "((\\"|[^"])+)", label: ".*$/,"$1").replace(/\\(.)/g,"$1").replace(/&quot;/g,'"');
            if(downurl.startsWith("http")||downurl.startsWith("//")){
                document.querySelector("div.p-left-buttons").innerHTML+='<a href="" id="downbtn" class="download-btn">Download</a>';
                document.querySelector("a#downbtn.download-btn").href=downurl;
            }else{
                console.log("failed to get download link");
            }
        }
    });
})();