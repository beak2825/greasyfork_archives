// ==UserScript==
// @name         9gag dark mode
// @namespace    http://javalatte.xyz/
// @version      0.1.6
// @description  Dark mode for 9gag
// @author       JavaLatte
// @match        https://9gag.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370861/9gag%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/370861/9gag%20dark%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('9gag dark mode');

    // style
    addStyle (`
         .section-sidebar .nav .label,section#list-view-2 h1,.featured-tag a,section.block-feature-cover .info-container h3,.profile-header header h2,section#list-view-2 .activity-text a, section#settings h2,.field label,section#signup h2,section.modal a.btn-close,section.modal header h3,section.modal header p,section.modal.upload .source.file p,section#individual-post header h1,.post-text-container p,.CS3 .tab-bar h3,.CS3 .tab-bar ul.tab li.active a,.CS3 span {
             color: #fff;
         }
         section.modal.upload .source.file:hover p{
             color: #000;
         }
         .section-sidebar .nav li.selected .label{
             background-color: rgba(140, 140, 140, 0.38);
             font-weight: bold
         }
         .section-sidebar .icon, .section-sidebar .nav .thumbnail,section.modal a.btn-close, section.modal.upload .source.file:after, section.modal.upload .wrapper .source{
             background-color: #fff;
         }
         section.modal.upload .wrapper:hover .source, section.modal.upload .wrapper .tooltip{
             background-color: #afafaf;
         }
         .featured-tag a{
             background-color: rgba(140, 140, 140, 0.38);
         }
         .post-afterbar-a.in-post-top,.CS3, section#signup, section.modal{
             background-color: #1b1b1b;
         }
         section.modal{
             border:1px solid #999;
         }
         .post-afterbar-meta{
             border-top: unset;
         }
         .CS3 .comment-entry .info .username, .CS3 .comment-entry .info .status, .CS3 .comment-entry .info .badge, .CS3 .comment-entry .info .points, .CS3 .comment-entry .info .time, .CS3 .comment-entry .payload .content, .CS3 .comment-section-title h3{
             color: #fff;
         }
         .CS3 .comment-entry .info .points{
            color: #999 !important;
         }


         .CS3 a.menu-trigger.selected, .CS3 a.menu-trigger:hover {
            color: #fff;
         }
         .CS3 .comment-entry.indent-1:hover ~  .CS3 a.menu-trigger{
            color: #fff;
         }
         .CS3 .comment-entry.indent-1:hover ~  .CS3 .comment-entry.indent-1 .extra-menu{
            background-color: #fff !important;
         }


         .profile-header header h1 {
            color: #fff;
         }
         .profile .tab-bar ul.menu a.selected{
            color: #fff;
            border-bottom: 2px solid #fff;
         }
         .background-black{
            background-color: #1b1b1b;
         }
         .CS3 span.drop{
            background-color: white !important;
            color: white !important;
         }
      `);

    var body = document.getElementsByTagName('body')[0];
    body.setAttribute("class",'background-black');

    function addStyle(css) {
      var style = document.createElement('style');
      style.textContent = css;
      document.documentElement.appendChild(style);
      return style;
    };
})();