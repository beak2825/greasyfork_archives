// ==UserScript==
// @name bluesky 2014 twt
// @namespace rlego
// @version 1.0.1
// @description oldtwitter design immitation, no suggestions!
// @author rlego
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bsky.app/*
// @include /^(?:https://bsky\.app/profile/[A-Za-z0-9]+\.[A-Za-z0-9]+)$/
// @include /^(?:https://bsky.app/profile/[A-Za-z0-9]+\.bsky.social)$/
// @include /^(?:https://bsky.app/profile/[A-Za-z0-9-]+\.com)$/
// @downloadURL https://update.greasyfork.org/scripts/516561/bluesky%202014%20twt.user.js
// @updateURL https://update.greasyfork.org/scripts/516561/bluesky%202014%20twt.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "bsky.app" || location.hostname.endsWith(".bsky.app"))) {
  css += `
      @font-face{font-family:"rosettaicons";src:url("https://abs.twimg.com/a/1486487005/font/rosetta-icons-Regular.eot");src:url("https://abs.twimg.com/a/1486487005/font/rosetta-icons-Regular.eot#iefix") format("embedded-opentype"),url("https://abs.twimg.com/a/1486487005/font/rosetta-icons-Regular.woff") format("woff"),url("https://abs.twimg.com/a/1486487005/font/rosetta-icons-Regular.ttf") format("truetype");font-style:normal;font-weight:normal}.Icon{background:transparent;display:inline-block;font-style:normal;vertical-align:baseline;position:relative}
      .css-146c3p1 {
          color: #292f33;
          font-size: 14px;
          line-height: 18px;
          font-family:"Helvetica Neue",Helvetica,Arial,sans-serif!important;
          letter-spacing:0!important
      }
      html {
          all:inherit;
      }
      div[style*="border-radius: 12px"] {
          border-radius:6px!important
      }
      /*body*/
      body, body[data-scroll-locked] {
          
          overflow-y:scroll!important;
          font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;  
      }
      body:after {
          content:"";
          background:#C0DEED url(https://abs.twimg.com/images/themes/theme1/bg.png) left 40px no-repeat fixed!important;
          width:100%;
          height:100%;
          position:fixed;
          z-index:-1
      }
      /*the newxt few r-14s had .r-2llsf before it*/
      .r-14lw9ot[style="min-height: 100vh;"] > div:first-child {
          margin-top:40px;
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(3) {
          margin-top:54px;
          background:none!important
      }
      .r-14lw9ot[style="min-height: 100vh;"], .r-14lw9ot[style="min-height: 100vh;"] > div:first-child > div > div > div > div, .r-14lw9ot[style="min-height: 100vh;"] > div:first-child > div > div {
          background:none!important;
      }
      /*h2*/
      [style^="font-size: 22px; font-family: -apple-system,"] {
          font: bold 18px/20px "Helvetica Neue",Arial,sans-serif!important;
          color:#333!important;
      }
      /*h3*/
      [style^="font-size: 17px; letter-spacing: 0.25px; font-weight: 700; font-family: -apple-system"] {
          font: bold 14px/1 "Helvetica Neue",Arial,sans-serif!important;
          letter-spacing:0!important;
          color:#333!important;
      }
      #root > div > div > div > div > div > div > div > div > div > div > div .r-2llsf:not([data-testid]) {
          background:rgba(255,255,255,.3);
          width:628px;
          margin:0 auto;
          padding:14px 0;
          min-height:calc(100vh - 42px)
      }
      /*header*/
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) {
          top:0;
          left:0;
          width:100%;
          flex-direction:row;
          margin:0;
          justify-content:center;
          /*2015*/
          border-bottom:1px solid rgba(0,0,0,0.15)!important;
          box-shadow:none;
          height:47px;
          /*2013*/
          box-shadow:0 2px 3px rgba(0,0,0,.25);
          border:none!important;
          background:#252525 url(https://abs.twimg.com/a/1386278595/t1/img/twitter_web_sprite_bgs.png) repeat-x;
          height:40px;
      }
      [style="background-color: rgb(255, 255, 255); border-color: rgb(212, 219, 226);"] a[href^="/profile/"][role="link"] {
          order:2;
          width:auto;
          padding:0;
          margin:7px 15px 0 0;
          /*2013*/
          display:none
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) a[href][data-no-underline="1"] {
          gap:0;
          border-radius:0;
          padding:0 14px 0 4px;
          box-shadow:inset 0 -0px 0px #1b95e0;
          transition:all .15s ease-in-out;
          background:none!important;
          height:100%;
          color:#66757f!important;
          /*2013*/
          box-shadow:none;
          color:#bbb!important;
          text-shadow:0 -1px 1px rgba(0,0,0,.75);
          transition:none;
          padding:0 12px;
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) a[href][data-no-underline="1"]:hover {
          box-shadow:inset 0 -4px 0px #1b95e0;
          color:#1b95e0!important;
          transition:all .15s ease-in-out;
          /*2013*/
          box-shadow:none;
          color:#fff!important;
          transition:none;
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) a[href][data-no-underline="1"]:focus {
          color:#1b95e0!important;
          /*2013*/
          color:#fff!important;
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) a[href][data-no-underline="1"]:has([style*="font-weight: 800; "]) {
          box-shadow:inset 0 -4px 0px #1b95e0;
          border-radius:0!important;
          /*2013*/
          text-shadow: 0 1px 1px rgba(0,0,0,.5);
          box-shadow: inset 0 5px 10px rgba(0,0,0,.5);
          background:#222 url(https://abs.twimg.com/a/1386278595/t1/img/twitter_web_sprite_bgs.png) repeat-x 0 -50px!important;
          color:#fff!important;
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) a[href][data-no-underline="1"] > div {
          font-size:13px!important;
          letter-spacing:0!important;
          font-weight:500!important;
          color:inherit!important;
          margin:0;
          align-items:start;
          /*2013*/
          font-family:"Helvetica Neue",Arial,sans-serif!important;
          font-size:12px!important;
          font-weight:700!important;
      }
      [style="background-color: rgb(255, 255, 255); border-color: rgb(212, 219, 226);"] a[href^="/profile/"][role="link"] > div, [style="background-color: rgb(255, 255, 255); border-color: rgb(212, 219, 226);"] a[href^="/profile/"][role="link"] > div > div {
          width:32px!important;
          height:32px!important;
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) a[href][data-no-underline="1"] > div:first-child {
          /*2013*/
          width:26px
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) a[href][data-no-underline="1"] > div:first-child svg { /*icons*/
          display:none
      }

      a[href^="/profile/"][role="link"] ~ [href] > div:first-child:before {
          width: 23px;
          height: 23px;
          font-size: 21px;
          line-height:21px;
          font-family:"RosettaIcons";
          /*2013*/
          background: url(https://abs.twimg.com/a/1386278595/t1/img/twitter_web_sprite_icons.png);
          width:22px;
          height:21px;
          background-position:0 -50px
      }
      a[href^="/profile/"][role="link"] ~ [href]:hover > div:first-child:before {
          /*2013*/
          background-position-y:-80px
      }
      a[href^="/profile/"][role="link"] ~ [href]:has([style*="font-weight: 800; "]) > div:first-child:before {
          background-position-y:-110px
      }
      a[href^="/profile/"][role="link"] ~ [href="/"] > div:first-child:before {
          content:"\\f053";
          /*2013*/
          content:"";
          background-position-x:0
      }
      a[href^="/profile/"][role="link"] ~ div [href] > div:first-child:before, a[href^="/profile/"][role="link"] ~ a[href="/search"] > div:first-child:before {
          content:"\\f058";
          width: 23px;
          height: 23px;
          font-size: 21px;
          line-height:21px;
          font-family:"RosettaIcons";
          background:none
      }
      a[href^="/profile/"][role="link"] ~ [href="/feeds"] > div:first-child:before {
          content:"\\f052";
          /*2013*/
          content:"";
          background-position-x:-40px
      }
      a[href^="/profile/"][role="link"] ~ [href="/notifications"] > div:first-child:before {
          content:"\\f055";
          /*2013*/
          content:"";
          background-position-x:-80px
      }
      a[href^="/profile/"][role="link"] ~ [href="/messages"] > div:first-child:before {
          content:"\\f054";
          /*2013*/
          content:"";
          background-position:-87px -877px;
      }
      a[href^="/profile/"][role="link"] ~ [href="/messages"]:hover > div:first-child:before,
      a[href^="/profile/"][role="link"] ~ [href="/messages"]:has([style*="font-weight: 800; "]):hover > div:first-child:before {
          /*2013*/
          background-position:-117px -877px;
      }
      a[href^="/profile/"][role="link"] ~ [href="/messages"]:has([style*="font-weight: 800; "]) > div:first-child:before {
          background-position:-87px -877px;
      }
      a[href^="/profile/"][role="link"] ~ [href^="/lists"] > div:first-child:before {
          content:"\\f094";
          /*2013*/
          content:"";
          background-position-x:-260px;
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) a[href^="/profile/"][role="link"] ~ [href^="/profile/"] > div:first-child:before {
          content:"\\f056";
          /*2013*/
          content:"";
          background-position-x:-120px
      }
      a[href^="/profile/"][role="link"] ~ [href="/settings"] > div:first-child:before {
          content:"\\f059";
          /*2013*/
          content:"";
          background-position-x:-160px
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) > div:last-child {
          padding-top:7px!important;
          /*2013*/
          margin-top:5px;
          padding:1px 1px 1px 1px!important;
          background:url(https://abs.twimg.com/a/1386278595/t1/img/twitter_web_sprite_bgs.png) repeat-x 0 -100px;
          border-radius:5px!important;
          height:30px;
          order:2;
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) > div:last-child > button {
          box-sizing:border-box;
          background-color: #1b95e0;
          background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.05));
          background-repeat: no-repeat;
          border: 1px solid transparent;
          border-radius: 4px!important;
          color: #fff;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          line-height: 1;
          position: relative;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.15);
          height:32px;
          margin:0;
          font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
          padding: 0 13px 0 14px!important;
          /*2013*/
          background:#2c77ba url(https://abs.twimg.com/a/1386278595/t1/img/twitter_web_sprite_bgs.png) repeat-x 0 -140px;
          padding: 3px 4px 5px 10px;
          font-size: 12px;
          line-height: 20px;
          border-color:#bbb;
          text-shadow: 0 -1px 1px rgba(0,0,0,.3);
          border-color: #111;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.15);
          height:28px;
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) div:last-child > button:hover {
          background:#1b95e0 linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.15));
          /*2013*/
          border-color:#000;
          background:#2c77ba url(https://abs.twimg.com/a/1386278595/t1/img/twitter_web_sprite_bgs.png) repeat-x 0 -170px;
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) div:last-child > button:active {
          background:#1b95e0 linear-gradient(rgba(0,0,0,0.15),rgba(0,0,0,0.15));
          box-shadow:inset 0 1px 4px rgba(0,0,0,0.3);
          opacity:1!important;
          /*2013*/
          box-shadow:inset 0 2px 4px rgba(0,0,0,.1),0 1px 0 rgba(255,255,255,.5);
          background:#2c77ba url(https://abs.twimg.com/a/1386278595/t1/img/twitter_web_sprite_bgs.png) repeat-x 0 -200px;
  }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) div:last-child > button > div {
          font:inherit!important;
          letter-spacing:0!important;
          color:inherit;
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) div:last-child > button > div svg {
          display:none
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) div:last-child > button > div:last-child {
          /*2013*/
          display:none;
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) div:last-child > button > div:first-child:before {
          content:"\\f029";
          font-size: 24px;
          left: 0;
          margin: 0;
          position: relative;
          top: -2px;
          display: block;
          font-family: "rosettaicons";
          font-weight: normal;
          font-style: normal;
          text-align: center;
          -webkit-font-smoothing: antialiased;
          /*2013*/
          content:"";
          width:22px;
          height:18px;
          background: url(https://abs.twimg.com/a/1386278595/t1/img/twitter_web_sprite_icons.png) -200px -50px;
      }
      /*back arrow*/
      [data-testid="viewHeaderBackOrMenuBtn"] {
          top:8px
      }
      /*2013 exclusive layout*/
       a[href^="/profile/"][role="link"] ~ [href="/messages"], a[href^="/profile/"][role="link"] ~ [href="/settings"] {
          order:1;
          padding:0 8px!important;
      }
      a[href^="/profile/"][role="link"] ~ [href="/messages"]:after, a[href^="/profile/"][role="link"] ~ [href="/settings"]:after {
          content:"";
          height:100%;
          width:2px;
          background: url(https://abs.twimg.com/a/1386278595/t1/img/twitter_web_sprite_icons.png) -240px -50px;
          position:absolute;
          right:2px
      }
      a[href^="/profile/"][role="link"] ~ [href="/messages"] > div:nth-child(2), a[href^="/profile/"][role="link"] ~ [href="/settings"] > div:nth-child(2) {
          /*2013*/
          display:none
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) a[href="/messages"][data-no-underline="1"]:has([style*="font-weight: 800; "]),
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(2) a[href="/settings"][data-no-underline="1"]:has([style*="font-weight: 800; "]) {
          background:none!important;
          box-shadow:none
      }
      a[href^="/profile/"][role="link"] ~ [href="/messages"] {
          margin-left:210px
      }
      /*search*/
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="background-color: rgb(255, 255, 255);"] {
          position:absolute;
          top:-54px;
          right:300px;
          z-index:4;
          width:202px;
          background:none!important;
          pointer-events:all;
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="background-color: rgb(255, 255, 255);"] [style^="z-index: 10;"] {
          display:none
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="background-color: rgb(255, 255, 255);"] input {
          background-color:#ccc!important;
          color:#444!important;
          --placeholderTextColor:#444!important;
          padding:6px 27px 6px 12px!important;
          font-size: 12px!important;
          line-height: 1;
          box-shadow: inset 0 1px 2px rgba(0,0,0,.2);
          transition: all .2s ease-in-out;
          border-radius:13px;
          height:14px;
          box-sizing:content-box;
          margin-top:7px!important;
          z-index:2!important;
          cursor:text!important;
          
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="background-color: rgb(255, 255, 255);"] [style="z-index: 20; padding-right: 4px;"] {
          position:absolute;
          right:18px;
          margin-top:4px
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="background-color: rgb(255, 255, 255);"] [style="z-index: 20; padding-right: 4px;"] > svg {
          background: url("https://abs.twimg.com/a/1386278595/t1/img/twitter_web_sprite_icons.png") -20px -710px;
          width:12px;
          height:14px;
          z-index:55
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="background-color: rgb(255, 255, 255);"] > [style="background-color: rgb(241, 243, 245);"] > button {
          display:none
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(3) {
          overflow:visible;
          touch-action:none;
          pointer-events:none;
      }
      /*feeds*/
      [data-testid="userAvatarImage"], [style="width: 80px; height: 80px; border-radius: 40px;"] {
          border-radius:5px!important
      }
      [style^="position: absolute; inset: 0px; border-width: 1px; border-color: rgb(212, 219, 226); opacity: 0.6; pointer-events: none; border-radius"] {
          display:none!important
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="border-color: rgb(212, 219, 226);"] {
          border-color:rgba(0,0,0,0.1)!important;
          border-width:1px;
          border-radius:6px;
          margin:0;
          pointer-events:all;
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="border-color: rgb(212, 219, 226);"] > div {
          padding: 12px;
          background:none!important;
          background:#f9f9f9!important;
          border-radius:5px;
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="border-color: rgb(212, 219, 226);"] > div:before {
          content:"Followed Feeds";
          font-size:14px;
          color:#333;
          margin-bottom:4px;
          cursor:text;
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="border-color: rgb(212, 219, 226);"] > div > div {
          font-size:12px;
          line-height:20px;
          color:#0084b4;
          padding:0!important;
          text-shadow:0 1px 0 #fff;
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="border-color: rgb(212, 219, 226);"] > div a[href] {
          font:inherit!important;
          letter-spacing:0;
          color:inherit!important;
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="border-color: rgb(212, 219, 226);"] > div > div:last-child {
          margin-top:8px
      }
              /*feedback link*/
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="border-color: rgb(212, 219, 226);"] ~ div {
          color:#999;
          font-size:12px;
          text-shadow:0 1px 0 #fff;
          padding:12px!important;
          border-radius:6px;
          outline:1px solid rgba(0,0,0,0.1);
          background:#f9f9f9;
          margin-top:10px;
          pointer-events:all;
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="border-color: rgb(212, 219, 226);"] ~ div div {
              height:14px;
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="border-color: rgb(212, 219, 226);"] ~ div div:hover {
          color:#555;
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="border-color: rgb(212, 219, 226);"] ~ div a[href] {
          color:inherit!important;
          font:inherit!important;
      }
      
      
      /*FOLLOW*/
      [data-testid="followBtn"] div, [data-testid="unfollowBtn"] div, [role="dialog"] button > div {
          color:inherit!important;
          font:inherit!important;
          letter-spacing:0!important;
          margin:0!important;
      }
      [data-testid="followBtn"] svg, [data-testid="unfollowBtn"] svg {
          display:none
      }
      [data-testid="followBtn"], [data-testid="unfollowBtn"], [role="dialog"] button[style^="flex-direction: row; align-items: center; justify-content: center; background-color: rgb("] {
          overflow: visible;
          padding: 5px 12px!important;
          font-size: 13px;
          font-weight: bold;
          line-height: 18px;
          color: #333!important;
          text-shadow: 0 1px 1px rgba(255,255,255,.5);
          background-color: #ccc;
          background-repeat: no-repeat;
          border: 1px solid #ccc;
          cursor: pointer;
          border-radius: 4px!important;
          box-shadow: 0 1px 0 rgba(255,255,255,.5);
          max-height:30px /*2013*/
      }
      [data-testid="followBtn"], [role="dialog"] button[style^="flex-direction: row; align-items: center; justify-content: center; background-color: rgb(2"] {
          background-color: #ddd!important;
          background-repeat: repeat-x;
          background-image: -webkit-linear-gradient(#fff, #ddd);
          background-image: linear-gradient(#fff, #ddd);
      }
      [data-testid="followBtn"]:hover, [role="dialog"] button[style^="flex-direction: row; align-items: center; justify-content: center; background-color: rgb(2"]:hover {
          background-color: #d8d8d8!important;
          background-image: -webkit-linear-gradient(#f8f8f8, #d8d8d8);
          background-image: linear-gradient(#f8f8f8, #d8d8d8);
          border-color: #bbb;
      }
      [data-testid="followBtn"]:active, [role="dialog"] button[style^="flex-direction: row; align-items: center; justify-content: center; background-color: rgb(2"]:active {
          border-color: #bbb;
          background-image: none;
          box-shadow: inset 0 2px 4px rgba(0,0,0,.1), 0 1px 0 rgba(255,255,255,.5);
      }
      [data-testid="followBtn"] > div:first-child:before {
          content:"\\f179";
          font-family:"RosettaIcons";
          color:#00acee;
          font-size:16px
      }
      [data-testid="unfollowBtn"], [role="dialog"] button[style^="flex-direction: row; align-items: center; justify-content: center; background-color: rgb(1"] {
          padding: 5px 11.99px!important;
          gap:0!important;
          color: #fff!important;
          text-shadow: 0 -1px 1px rgba(0,0,0,.25);
          background-color: #019ad2!important;
          background-repeat: repeat-x;
          background-image: -webkit-linear-gradient(#33bcef, #019ad2);
          background-image: linear-gradient(#33bcef, #019ad2);
          border-color: #057ed0;
          -webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,.1);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.1)
      }
      [data-testid="unfollowBtn"]:hover {
          background-color: #c43c35!important;
          background-repeat: repeat-x;
          background-image: -webkit-linear-gradient(#ee5f5b, #c43c35);
          background-image: linear-gradient(#ee5f5b, #c43c35);
          border-color: #a93730;
          border-bottom-color: #952f2a;
      }
      [data-testid="unfollowBtn"] div {
          color:inherit!important;
          font:inherit!important;
          letter-spacing:0!important
      }
      [data-testid="unfollowBtn"] div:first-child { /*bird container*/
          display:none;
      }
      [data-testid="unfollowBtn"] svg {
          display:none
      }
      button[data-testid="profileHeaderDropdownBtn"] svg {
          display:none
      }
      div button[data-testid="profileHeaderDropdownBtn"], div button[data-testid="suggestedFollowsBtn"], [data-testid="dmBtn"], [data-testid="profileHeaderEditProfileButton"] {
          overflow: visible;
          padding: 5px 12px!important;
          font-size: 13px;
          font-weight: bold;
          line-height: 18px;
          color: #333!important;
          text-shadow: 0 1px 1px rgba(255,255,255,.5);
          border: 1px solid #ccc;
          cursor: pointer;
          border-radius: 4px!important;
          box-shadow: 0 1px 0 rgba(255,255,255,.5);
          max-height:30px /*2013*/;
          background-color: #ddd!important;
          background-image: -webkit-linear-gradient(#fff, #ddd);
          background-image: linear-gradient(#fff, #ddd);
          transition-duration:0ms!important;
      }
      button[data-testid="profileHeaderDropdownBtn"]:hover, button[data-testid="suggestedFollowsBtn"]:hover, [data-testid="dmBtn"]:hover, [data-testid="profileHeaderEditProfileButton"]:hover {
          background-color: #d8d8d8!important;
          background-image: -webkit-linear-gradient(#f8f8f8, #d8d8d8);
          background-image: linear-gradient(#f8f8f8, #d8d8d8);
          border-color: #bbb;
      }
      button[data-testid="profileHeaderDropdownBtn"]:active, button[data-testid="suggestedFollowsBtn"]:active, [data-testid="dmBtn"]:active, [data-testid="profileHeaderEditProfileButton"]:active {
          border-color: #bbb;
          background-image: none;
          box-shadow: inset 0 2px 4px rgba(0,0,0,.1), 0 1px 0 rgba(255,255,255,.5);
          opacity:1!important;
      }
      div button[data-testid="profileHeaderDropdownBtn"] {
          -webkit-font-smoothing: antialiased;
          cursor: pointer;
          font: 400 16px "RosettaIcons";
          display: inline-block;
          min-width: 16px;
          padding-left:6px!important;
          padding-right:6px!important;
          padding-top:3px!important
      }
      button[data-testid="profileHeaderDropdownBtn"]:before {
          content:"\\f124";
          text-indent:2px;
          font-size:18px!important;
      }
      button[data-testid="suggestedFollowsBtn"]:before {
          content:"\\f175";
          font-size:18px!important;
          font-family:"RosettaIcons"
      }
      [data-testid="dmBtn"]:before {
          content:"\\f187";
          text-indent:2px;
          font-size:18px!important;
          font-family:"RosettaIcons"
      }
      [data-testid="dmBtn"] div {
          display:none
      }
      /***likes default / little post**/
      
      button[data-testid="replyBtn"]:before {
          content:"\\f151";
          /*2013*/
          background-position:0 -190px;
          content:"";
          width:12px;
      }
      button[data-testid="replyBtn"]:hover {
          color:rgb(0, 133, 255);
          /*2013*/
          color:inherit;
      }
      button[data-testid="replyBtn"]:after {
          content:"Replies";
          margin-left:3px;
      }
      button[aria-label="Repost or quote post"]:before {
          content:"\\f152";
          /*2013*/
          background-position:-20px -190px;
          content:"";
          width:14px;
      }
      button[aria-label="Repost or quote post"]:is(:hover,:has(.r-5ld2xk)) {
          color:#5c913b;
          /*2013*/
          color:inherit;
      }
      button[aria-label="Repost or quote post"]:after {
          content:"Retweets";
          margin-left:3px;
      }
      button[data-testid="likeBtn"]:before {
          content:"\\f148";
          /*2013*/
          background-position:-40px -190px;
          content:"";
          width:10px;
      }
      button[data-testid="likeBtn"]:is(:hover,:has(.r-84gixx)) {
          color:#ff385b;
          /*2013*/
          color:inherit;
      }
      button[data-testid="likeBtn"]:after {
          content:"Favorites";
          margin-left:3px;
      }
      button[data-testid="shareBtn"]:before {
          content:"\\f051"
      }
      button[data-testid="shareBtn"]:hover {
          color:rgb(0, 133, 255);
          /*2013*/
          color:inherit;
      }

      button[data-testid="postDropdownBtn"]:before {
          content:"\\f150";
          /*2013*/
          background-position:-280px -190px;
          content:"";
          width:15px!important;
      }
      button[data-testid="postDropdownBtn"]:hover {
          color:rgb(0, 133, 255);
          /*2013*/
          color:inherit;
      }
      button[data-testid="postDropdownBtn"]:after {
          content:"More"
      }
      button[data-testid="likeBtn"] .r-84gixx, button[data-testid="likeBtn"]:has(.r-84gixx), button[data-testid="likeBtn"] [style*="color: rgb(236, 72, 153);"] {
          /*2013*/
          color:#ff9b00!important;
      }
      button[aria-label="Repost or quote post"] .r-84gixx, button[aria-label="Repost or quote post"]:has([style="color: rgb(19, 195, 113);"]) {
          /*2013*/
          color:#609928!important;
      }
      
      button[data-testid="likeBtn"]:has(.r-84gixx):before, button[data-testid="likeBtn"]:has([style="color: rgb(19, 195, 113);"]) {
          /*2013*/
          color:#ff9b00!important;
          background-color:#ff9b00!important;
      }
      button[aria-label="Repost or quote post"]:has(.r-84gixx):before, button[aria-label="Repost or quote post"]:has([style="color: rgb(19, 195, 113);"]):before {
          /*2013*/
          color:#609928!important;
          background-color:#609928!important;
      }
      [data-testid^="postThreadItem"] button[data-testid="replyBtn"]:before, [data-testid^="postThreadItem"]  div[aria-label="Repost or quote post"]:before, [data-testid^="postThreadItem"]  button[data-testid="likeBtn"]:before, [data-testid^="postThreadItem"]  button[data-testid="postDropdownBtn"]:before {
          background-position-y:-220px
      }
      [style="flex-direction: row; justify-content: space-between; align-items: center;"] > div:has([data-testid="shareBtn"]) {
          /*2013*/
          display:none
      }
      
      
      /***likes big, all 2013 **/
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] button[data-testid="replyBtn"]:before {
          background-position: 0 -280px;
          width: 18px;
          height:16px;
          margin-top:-2px;
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] div[aria-label="Repost or quote post"]:before {
          background-position: -30px -280px;
          width: 22px;
          height:16px;
          margin-top:-2px;
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] button[data-testid="likeBtn"]:before {
          background-position: -60px -280px;
          width: 16px;
          height:16px;
          margin-top:-2px;
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] button[data-testid="postDropdownBtn"]:before {
          background-position: -180px -280px;
          width: 22px!important;
          height:16px;
          margin-top:-2px;
      }
      
      [style="flex-direction: row; justify-content: space-between; align-items: center;"], [style="flex-direction: row;justify-content: space-between;align-items: center;"] {
          justify-content:initial!important;
          width:100%;
          /*2013*/
          min-height:18px;
          padding-top:1px;
      }
      [style="flex-direction: row; justify-content: space-between; align-items: center;"] > div, [style="flex-direction: row;justify-content: space-between;align-items: center;"] > div {
          min-width:80px;
          align-items:initial!important;
          margin:0!important;
          flex:initial!important;
          /*2013*/
          min-width:0;
          margin-right:11px!important
      }
      [style="flex-direction: row; justify-content: space-between; align-items: center;"] > div > div, [style="flex-direction: row;justify-content: space-between;align-items: center;"] > div > div {
          justify-content:initial!important;
      }
      
      :is([data-testid^="post"],[data-testid^="feedItem"]) button[style*="border-radius: 999px;"] {
          border-radius:0!important;
          background-color:transparent!important;
          flex-direction:row;
          align-items:center;
          gap:0!important;
          padding:0!important;
          color:#8899a6;
          /*2013*/
          color:#999;
          font-size:12px
      }
      div:is([data-testid^="postThreadItem"],[data-testid^="feedItem-"]) button[style*="border-radius: 999px;"]:before {
          -webkit-font-smoothing: antialiased;
          cursor: pointer;
          font: 400 16px "RosettaIcons";
          margin-right: 10px;
          display: inline-block;
          min-width: 16px;
          /*2013*/
          color:#0084b4;
          background-color:#0084b4;
          width:14px;
          min-width:10px;
          height:13px;
          vertical-align: text-top;
          background-image: url('https://abs.twimg.com/a/1386278595/t1/img/twitter_web_sprite_icons.png');
          background-repeat: no-repeat;
          margin-right:5px;
      }
      :is([data-testid^="post"],[data-testid^="feedItem"]) button[style*="border-radius: 999px;"] svg {
          display:none
      }
      :is([data-testid^="post"],[data-testid^="feedItem"]) button[style*="border-radius: 999px;"] > div {
          padding:0!important;
          gap:0!important;
          display:inline!important;
          line-height:15px!important
      }
      div:is([data-testid^="postThreadItem"],[data-testid^="feedItem-"]) button[style*="border-radius: 999px;"] svg ~ div {
          color:inherit!important;
          letter-spacing:0!important;
          font-family:inherit!important;
          font-size:12px!important;
          line-height:normal!important;
      }
      /*2013 tweet count texts*/
      div:is([data-testid^="postThreadItem"],[data-testid^="feedItem-"]) button[style*="border-radius: 999px;"] > div div {
          font-size:12px!important;
          letter-spacing:0!important;
          font-family:inherit!important;
          color:inherit!important;
      }
      /*profile header*/
      [data-testid="profileView"] > div:first-child > div:first-child[style="border-color: rgb(212, 219, 226);"] {
          border:1px solid rgba(0,0,0,.1)!important;
          border-radius:6px;
          margin-bottom:10px;
      }
      [data-testid="profileView"] > div:first-child > div:first-child > div {
          background:#fff!important;
          border-radius:6px;
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] {
          overflow:visible!important;
          padding:0!important;
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] ~ [style="padding: 4px 16px;"] {
          display:none;
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(1) {
          padding:10px!important
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(2) {
          justify-content:center;
          align-items:center;
          position:absolute;
          width:100%;
          left:0;
          top:-156px;
          gap:0!important
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(2) div {
          color:white!important;
          letter-spacing:0!important;
          text-shadow:0 1px 1px rgba(0,0,0,.5);
          cursor:text;
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(2) div[style="background-color: rgb(241, 243, 245); border-radius: 4px; padding: 4px 8px;"] {
          background-color:#019ad2!important
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(2) > div:last-child > div:last-child {
          font-size:18px!important;
          line-height:normal!important;
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(3) {
          position:absolute;
          padding:0!important;
          gap:0!important
      }
      
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(3) > [dir="auto"] {
          padding: 10px 30px 8px 12px;
          border-left: 1px solid #e8e8e8;
          display:block;
          font-size:14px!important;
          color:#333!important;
          text-decoration:none!important;
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(3) > [dir="auto"]:hover {
          color:#55acee!important
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(3) > [dir="auto"] > span {
          display:block;
          letter-spacing:0!important;
          font-size:10px!important;
          color:#999!important;
          text-transform:uppercase;
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(3) > [dir="auto"] > span:nth-last-child(2) {
          font-size:inherit!important;
          color:inherit!important;
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(3) > [dir="auto"]:hover > span {
          text-decoration:none;
          color:inherit!important
      }
      [data-testid="profileHeaderFollowersButton"] {
          border-left:0!important;
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(4) {
          justify-content:center;
          align-items:center;
          position:absolute;
          width:100%;
          left:0;
          top:-102px;
          max-height:102px
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(4) > div {
          color:white!important;
          text-shadow:0 1px 1px rgba(0,0,0,.5);
          font-size:14px!important;
          line-height:18px!important;
          text-align:center;
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(4) > div > span {
          all:inherit!important;
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(5) {
          align-items:center;
          width:100%;
          padding:4px 12px!important;
          border-top:1px solid #e8e8e8;
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(5) > a div:first-child {
          width:24px!important;
          height:24px!important;
          border:0!important;
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(5) > a div[style] > div[style] {
          width:24px!important;
          height:24px!important;
          border:0!important;
      }
      [style="padding: 12px 16px 8px; overflow: hidden;"] > div:nth-child(5) span {
          font:inherit!important
      }
      [data-testid="profileHeaderAviButton"] > div {
          margin:20px auto 6px;
          width:81px!important;
          height:81px!important;
      }
      [data-testid="profileHeaderAviButton"] > div > div {
          width:81px!important;
          height:81px!important;
          border:4px solid #fff;
          cursor:pointer;
      }
      [data-testid="profileHeaderAviButton"] {
          width:100%;
          background:none!important;
          border:0;
          left:0;
          top:0;
      }
      div:has(>[data-testid="profileHeaderAviButton"]) {
          top:00px;
          left:250px
      }
      [data-testid="profileHeaderDisplayName"] {
          font-size: 24px!important;
          font-weight: 700!important;
          line-height: 1;
      }
      [data-expoimage="true"][style="overflow: hidden; width: 100%; height: 150px; background-color: rgb(241, 243, 245);"], [data-testid="userBannerFallback"] {
          height:260px!important;
          border-radius:6px 6px 0 0
      }
      [style="position: relative; height: 150px;"] {
          height:260px!important
      }
      [data-expoimage="true"][style="overflow: hidden; width: 100%; height: 150px; background-color: rgb(241, 243, 245);"]:after {
          content:"";
          position:absolute;
          background:linear-gradient(to bottom,rgba(0,0,0,0) 0,rgba(0,0,0,0.55) 100%);
          height:200px;
          width:100%;
          bottom:0
      }
      /*profile nav*/
      [data-testid="profileView"] > div:first-child > div:first-child[style="border-color: rgb(212, 219, 226);"] ~ [style="border-color: rgb(212, 219, 226);"] {
          border-radius:6px 6px 0 0;
          border:1px solid rgba(0,0,0,.1);
          border-bottom-width:0;
          border-color:rgba(0,0,0,.1)!important;
      }
      [data-testid="profileView"] > div:first-child > div:first-child[style="border-color: rgb(212, 219, 226);"] ~ [style="border-color: rgb(212, 219, 226);"] > div {
          background:#fff!important;
          border-radius:6px 6px 0 0;
      }
      
      
      
      /*SETTING PAGE*/

      [data-testid="settingsScreen"] .r-10sqg0u {
          color:#0084B4;
          background-color: #f9f9f9!important;
          border-top: 1px solid #e8e8e8!important;
          -webkit-box-shadow: inset 0 1px 0 rgba(255,255,255,.25);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.25);
          padding: 8px 12px;
          font-size:14px;
      }
      [data-testid="settingsScreen"] .r-10sqg0u:hover {
          background-color:#fff!important;
          color:#333;
      }
      [data-testid="settingsScreen"] .r-10sqg0u > div {
          font:inherit!important;
          color:inherit!important;
          letter-spacing:0!important;
      }
      [data-testid="settingsScreen"] .r-10sqg0u:not(:nth-child(1)) > div:first-child {
          display:none;
      }
      
      /*TWEET PAGE*/
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] {
          max-width:628px;
          background-color:rgba(255, 255, 255, .3);
          padding:14px;
          border:0!important;
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] > div {
          border-radius:6px!important;
          border:1px solid rgba(0,0,0,.1)!important;
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] > div > div:last-child {
          background-color:#f5f5f5;
          border-radius:5px;
      }
      /*big twt*/
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] {
          border-radius:6px 6px 0 0;
          padding:25px 50px!important;
          background:#fff;
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] > div {
          padding:0 0 15px 0!important;
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] > div:first-child > div:first-child {
          padding:0!important
      }
      [data-testid^="postThreadItem-"] [style="width: 42px; height: 42px;"], [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] [style="width: 42px; height: 42px;"] > div {
          width:48px!important;
          height:48px!important;
      }
      [data-testid^="postThreadItem-"] [style="width: 42px; height: 42px;"] svg {
          width:48px!important;
          height:48px!important;
      }
      [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] > div:first-child div:first-child > .r-1iln25a { /*post author*/
          font-size:18px!important;
          line-height:1.25!important;
          padding-top:2px;
          margin-top:3px;
      }
      [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] .r-1559e4e {
          padding:0;
      }
      [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] div:last-child > .r-1iln25a {
          font-size:14px!important;
          line-height:normal!important;
          color:#999!important;
          font-family:inherit!important;
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] > div[style="padding-bottom: 8px;"] [data-word-wrap] {
          font-family: Georgia, "Times New Roman", serif!important;
          font-size: 22px!important;
          line-height: 28px!important;
          letter-spacing:0!important;
          color:#333!important;
      }
          /*counts*/
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] > div:nth-child(2) > div:nth-child(3) {
          margin:10px 0 0 0;
          padding:0!important;
          gap:0!important;
          border-color:rgba(0,0,0,.1)!important;
          order:1;
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] > div:nth-child(2) > div:nth-child(3) > div {
          margin:0;
          padding:7px 12px;
          color: #999;
          font-size: 10px;
          line-height: 16px;
          text-transform: uppercase;
          border-right:1px solid #e8e8e8
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] > div:nth-child(2) > div:nth-child(3) > div > div {
          font:inherit!important;
          color:inherit!important;
          display:flex;
          flex-direction:column;
          
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] > div:nth-child(2) > div:nth-child(3) > div:first-child {
          padding-left:0;
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] > div:nth-child(2) > div:nth-child(4) {
          /*2013*/
          padding:0
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] > div:nth-child(2) > div:nth-child(3) > div > div > span  {
          font:inherit!important;
          font-weight:700!important;
          color: #333!important;
          font-size: 14px!important;
          
      }
          /*date*/
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] > div:nth-child(2) > div:nth-child(2) {
          order:2;
          margin:10px 0 0 0;
          padding:0!important
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] > div:nth-child(2) > div:nth-child(2) div {
          font:inherit!important;
          color:#999!important;
          font-size:12px!important;
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] > div:nth-child(2) > div:nth-child(2) div > svg {
          display:none
      }
      [style="flex: 1 1 0%; border-left-width: 1px; border-right-width: 1px; border-color: rgb(212, 219, 226);"] [style="border-color: rgb(212, 219, 226);"] [style*="padding-top: 16px;"][data-testid^="postThreadItem-"] > div:nth-child(2) > div:nth-child(2) div > div:before {
          content:"\\f209 ";
          margin-right:3px;
          line-height:1;
          font-family:"RosettaIcons";
      }
      /**small twts reply*/
      /*urs*/
      [aria-label="Compose reply"] {
          padding:10px 50px!important;
          background:#e5f2f7!important;
      }
      [aria-label="Compose reply"] > div:first-child > div:first-child {
          display:none!important;
      }
      [aria-label="Compose reply"] > div {
          background:#fff!important;
          width:100%;
          height:30px;
          line-height:30px;
          border:1px solid rgba(0,0,0,.1);
          border-radius:2px;
          font-size:12px!important;
          letter-spacing:0!important;
          font-family:inherit!important;
          padding-left:6px!important
      }
      /*not urs*/
      [style="border-color: rgb(212, 219, 226); flex-direction: row; padding-right: 6px; padding-left: 6px; border-top-width: 1px;"] {
          border-color:rgba(0,0,0,.1)!important;
      }
      [style="border-color: rgb(212, 219, 226); flex-direction: row; padding-right: 6px; padding-left: 6px; border-top-width: 1px;"] > div > div {
          background:none!important
      }
      /*?*/
      [data-testid^="feedItem"] {
          background:#fff;
      }
      /*notifs*/
      [data-testid="notificationsScreen"] {
          max-width:none
      }
      [data-testid="notificationsScreen"] .r-sa2ff0 {
          background:#fff;
          border-radius:6px;
          min-height:0;
          outline:1px solid rgba(0,0,0,.1);
          margin-top:-1px;
          max-width:598px
      }
      [data-testid="notificationsScreen"] .r-sa2ff0 > div {
          background:none!important;
      }
      /*video player*/
      [data-testid="scrubber"] {
          padding:0!important;
          height:8px!important
      }
      [data-testid="scrubber"] [style="flex: 1 1 0%; display: flex; align-items: center; position: relative; cursor: grab;"] > div[style*="border-radius: 999px;"]:first-child {
          background:#444!important;
      }
      [data-testid="scrubber"] [style="width: 100%; height: 100%; border-radius: 999px; background-color: rgb(255, 255, 255); transform: scale(0.6);"] {
          border-radius:50%!important;
          transform:scale(1)!important;
          background:#999!important
      }
      [data-testid="scrubber"] ~ div {
          padding:0!important
      }
      [data-testid="scrubber"] ~ div > button {
          padding:5px!important
      }
      /*settings tooltip popup menu*/
      [data-radix-popper-content-wrapper] [data-side] > div {
          padding: 4px 0!important;
          margin: 2px 0 0;
          background-color: #fff;
          border-color: #999;
          border-color: rgba(0, 0, 0, .2)!important;
          border-style: solid;
          border-width: 1px;
          border-radius: 4px!important;
          -webkit-box-shadow: 0 5px 10px rgba(0,0,0,.2);
          box-shadow: 0 5px 10px rgba(0,0,0,.2)!important;
          background-clip: padding-box;
          min-width:0!important
      }
      [data-radix-popper-content-wrapper] [data-side] > div > div[data-testid] {
          padding:3px 15px 3px 22px!important;
          font-size:12px;
          line-height:18px;
          color:#333;
          min-height:0!important;
          border-radius:0!important;
      }
      [data-radix-popper-content-wrapper] [data-side] > div > div[data-testid]:hover {
          background-image: -webkit-linear-gradient(top, #2f7eb6 0, #2271a9 100%);
          background-image: linear-gradient(top, #2f7eb6 0, #2271a9 100%);
          color: #fff;
          background-color: #2271a9;
      }
      [data-radix-popper-content-wrapper] [data-side] > div > div[data-testid] > [dir] {
          font:inherit!important;
          color:inherit!important;
          flex:initial!important
      }
      [data-radix-popper-content-wrapper] [data-side] > div > div[data-testid] > div:nth-child(2) {
          display:none
      }
  `;
}
if (new RegExp("^(?:https://bsky\\.app/profile/[A-Za-z0-9]+\\.[A-Za-z0-9]+)\$").test(location.href) || new RegExp("^(?:https://bsky.app/profile/[A-Za-z0-9]+\\.bsky.social)\$").test(location.href) || new RegExp("^(?:https://bsky.app/profile/[A-Za-z0-9-]+\\.com)\$").test(location.href) || location.href.startsWith("https://bsky.app/profile/did:plc:")) {
  css += `
      [data-testid="profileView"] > div:first-child > div:first-child[style="border-color: rgb(212, 219, 226);"] ~ [style="border-color: rgb(212, 219, 226);"] {
          position:absolute;
          left:14px;
          top:14px;
          width:auto;
          border-radius:6px;
          border-bottom-width:1px;
      }
      [data-testid="profileView"] > div:first-child > div:first-child[style="border-color: rgb(212, 219, 226);"] ~ [style="border-color: rgb(212, 219, 226);"] > div {
          width:238px;
          border-radius:6px;
      }
      #root > div > div > div > div > div > div > div > div > div > div > div .r-2llsf:not([data-testid]) {
          padding-left:252px;
          width:880px;
      }
      [data-testid="profilePager-selector"] {
          display:block;
      }
      [data-testid="profilePager-selector"] > div {
          display:block;
          text-shadow:0 1px 0 #fff;
      }
      [data-testid="profilePager-selector"] ~ div {
          display:none;
      }
      [data-testid^="profilePager-selector-"]:first-child, [data-testid^="profilePager-selector-"]:first-child > div {
          border-radius:5px 5px 0 0;
          border-top:0;
      }
      [data-testid^="profilePager-selector-"]:last-child, [data-testid^="profilePager-selector-"]:last-child > div {
          border-radius:0 0 5px 5px;
          border-bottom:0;
      }
      [data-testid^="profilePager-selector-"] {
          background-color: #f9f9f9;
          border-top: 1px solid #e8e8e8;
          -webkit-box-shadow: inset 0 1px 0 rgba(255,255,255,.25);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.25);
          padding: 0;
          color:#226699;
          font-size:14px;
      }
      [data-testid^="profilePager-selector-"] > div {
          padding: 8px 12px;
          border:0;
      }
      [data-testid^="profilePager-selector-"] > div > div {
          color:inherit!important;
          font:inherit!important;
      }
      [data-testid^="profilePager-selector-"] > div[style] {
          color:#000;
          font-weight:bold;
          background:#fff;
      }
      [data-testid^="profilePager-selector-"] > div:hover {
          color:#000;
          background:#fff;
      }
      [data-testid^="profilePager-selector-"] > div:focus {
          text-decoration:underline;
      }
      /*feeds*/
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="border-color: rgb(212, 219, 226);"] {
          left:-755px;
          top:calc(100vh - 294px);
          width:240px;
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="border-color: rgb(212, 219, 226);"] > div {
          width:238px
      }
      [style="padding-top: 20px; padding-bottom: 20px;"] > [style="border-color: rgb(212, 219, 226);"] ~ div {
          left:-754px;
          width:238px;
          top:calc(100vh - 294px);
      }
      /*up arrow*/
      button[aria-label="Load new posts"][style^="position: fixed; left:"] {
          min-width:238px;
          margin-left:-52px;
          border-radius:6px!important;
          border:none;
          outline:1px solid rgba(0,0,0,.1);
          bottom:234px!important;
      }
      /*main profile area*/
      div.r-1ye8kvj[style="border-color: rgb(212, 219, 226);"] {
          border-radius:6px;
          border:1px solid rgba(0,0,0,.1)!important;
          min-height:0;
      }
      div.r-1ye8kvj[style="border-color: rgb(212, 219, 226);"] .css-175oi2r:nth-child(2) [data-testid^="feedItem"], div.r-1ye8kvj[style="border-color: rgb(212, 219, 226);"] [style="min-height: 32px;"] {
          border-radius:5px;
      }
      div.r-1ye8kvj[style="border-color: rgb(212, 219, 226);"] [style="min-height: 32px;"] {
          background:#efefef;
      }
  `;
}
if (location.href === "https://bsky.app/" || location.href === "https://bsky.app/feeds") {
  css += `
      .r-2llsf:not([data-testid]) {
          background:rgba(255,255,255,.3)!important;
          width:628px;
          margin:0 auto;
          padding:14px 0;
          min-height:calc(100vh - 42px);
          margin-top:-7px
      }
      .r-2llsf:not([data-testid]) div.r-13awgt0[style="background-color: rgb(255, 255, 255);"] > div.r-13awgt0[style="background-color: rgb(255, 255, 255);"] {
          margin:0 14px;
      }
      .r-2llsf:not([data-testid]) div.r-13awgt0[style="background-color: rgb(255, 255, 255);"] > div.r-13awgt0[style="background-color: rgb(255, 255, 255);"] [style="border-color: rgb(212, 219, 226);"] {
          outline:1px solid rgba(0,0,0,.1)!important;
          border:0!important;
          border-radius:6px;
          background:#fff
      }
      .r-2llsf:not([data-testid]) div.r-13awgt0[style="background-color: rgb(255, 255, 255);"] > div.r-13awgt0[style="background-color: rgb(255, 255, 255);"] [style="border-color: rgb(212, 219, 226);"] [style^="background-color: rgb(255, 255, 255)"] {
          background:none!important;
      }
      .r-14lw9ot[style="min-height: 100vh;"] > div:nth-child(3) {
          top:0
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
