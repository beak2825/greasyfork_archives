// ==UserScript==
// @name Just Dance Now Modern
// @namespace Pakar
// @version 130523.1.5.62
// @description An rebranded Just Dance Now Style
// @author Pakar
// @grant GM_addStyle
// @run-at document-start
// @match *://*.justdancenow.com/*
// @downloadURL https://update.greasyfork.org/scripts/433447/Just%20Dance%20Now%20Modern.user.js
// @updateURL https://update.greasyfork.org/scripts/433447/Just%20Dance%20Now%20Modern.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "justdancenow.com" || location.hostname.endsWith(".justdancenow.com"))) {
  css += `
      :root {
          --pictobeat-color: #fff;
          --test: #212121/*#coverflow, #players::before'*/
      }
      @font-face {
          font-family: "Just Dance";
          src: url('https://cdn.glitch.global/7781ee26-c563-4365-b245-ceb83156a174/Brother1816-Medium.ttf?v=1665251090937');
      }
      @font-face {
          font-family: "OpenSans Regular";
          src: url('https://cdn.glitch.global/7781ee26-c563-4365-b245-ceb83156a174/Brother1816-Regular.ttf?v=1665251058297') format('tff');
      }
      .footer,
      .footer .copyright,
      nav,
      .footer__ubi-logo,
      .footer .menu,
      h1.landing-text__title,
      .logo__inner,
      h2.landing-text__subtitle,
      .side-nav,
      .landing-button::before,
      .section.availability,
      .section--vertical-content,
      .section#how-it-works,
      section#explore,
      .menu__head,
      .main::before,
      .menu__legal,
      .landing__video,
      .info-panel,
      #afterdance #players,
      #afterdance.transition-in #crown-container,
      .room-info__patch,
      #afterdance .results .highScore.show,
      .landing-patch,
      .landing-circle,
      .landing-arrow,
      .dr-landing__icon-wrapper,
      .landing-button.visible,
      html.ftue ul.tabs::after,
      html.ftue .playlist-grid .playlist::before,
      html.ftue .playlist-grid .playlist::after,
      #just-dance-now .tutorial img,
      .danceroom__qr-code-wrapper,
      #just-dance-now .danceroom__label,
      .toggle::after,
      .state-songselection .dancercard .player-exp,
      .state-songselection .dancercard .player-flag,
      .state-songselection #players .player .controller-coins,
      #players::before,
      .title-container .artist,
      .connect-phone-info,
      .modal__container::after,
      .song-grid .song__difficulty,
      .item::after,
      .connect-phone-info--clickable .connect-phone-info__text::before,
      .tabs--connect,
      ul.tabs li.selected::before,
      #racetrack .platform,
      #crown-container .crown,
      .highscore-display::after,
      .vip .account,
      .song-action__button::after,
      #just-dance-now .tutorial::after,
      .song-grid--details .song-grid--titleDetails .song-grid--duration,
      #just-dance-now .tutorial::after,
      .tutorial__image,
      .state-tutorial .grid-container,
      .coach-selection::after,
      .state-coachselection #just-dance-now .views::before,
      .state-dance #just-dance-now .views::before,
      .video-preview--visible::after,
      .playlist-img-container .playlist-title-details{
          display: none !important;
      }
      .exit-btn--animate {
          display: block!important;
          visibility: visible!important;
      }
      .dr-landing .init-spinner__spinner {
          fill: #fff;
      }
      .fullscreen-spinner {
      background: #1d124091!important;
  }
      .fullscreen-spinner .spinner, .video-preview::after{
          fill: #1110!important;
          background-image: url(https://raw.githubusercontent.com/ibratabian17/JDNAssets/JDNModern/1671596110099.png);
          background-size: 100%;
          animation: spin 0.65s linear 0s normal none infinite;
      }
      .dr-landing__room-number {
          font-size: 25vh
      }
      .dr-landing {
          top: 71vh;
          position: absolute
      }

      #coverflow,
      #just-dance-now .tutorial {
          padding-top: 0rem!important;
      }
      .main-header {
          position: relative;
          width: 100%;
          height: 7rem;
          background-image: none;
          background-repeat: no-repeat;
          background-size: cover;
      }
      .main-header:after {
          content: "Just Dance Now Modern | Pre-Beta 1.56 \\A Use JDNaCore For Better Experience!";
          top: 0%;
          left: 0%;
          width: 47vw;
          height: 5vh;
          position: absolute;
          margin-left: 50vw;
          margin-top: 4vh;
          font-size: 1rem;
          letter-spacing: 0.03em;
          text-align: right;
          white-space: pre-wrap;
      }
      .anucore-hui .main-header:after {
          content: "Just Dance Now Modern | Pre-Beta 1.56 ";
      }
      .main-header:before {
          content: "Use Phone To Open The Game";
          top: 87vh;
          left: 0%;
          width: 47vw;
          height: 5vh;
          position: absolute;
          margin-left: 50vw;
          margin-top: 4vh;
          font-size: 1rem;
          letter-spacing: 0.03em;
          text-align: right;
      }
      .dr-landing {
          color: #fff;
      }
      .dr-landing::before {
          background: none;
      }
      .main,
      #play,
      .init-spinner--splash {
          background: linear-gradient(180deg, #000000d4 0%, rgba(0, 0, 0, 0) 52.94%, #000000cf 100%), url(https://cdn.discordapp.com/attachments/878359711324463104/1032013855594917969/45563452348572437578342573427853.png);
          background-position: center;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          image-rendering: high-quality !important;
      }

      .spinner {
          fill: #fff0!important
      }
      .connect-phone-info--visible {
          display: flex!important
      }


      .danceroom__number {
          text-shadow: 0px 0px 2px white;
          z-index: 0;
          font-size: 0.3em!important;
          text-align: center;
          line-height: 0.3rem;
          font-family: "Just Dance";
          letter-spacing: 1px;
      }
      #settings {
          height: 6%;
          top: .1rem;
          right: .1rem;
      }
      .state-dance #settings,
      .state-dance #room-info {
          opacity: 0;
          transition: opacity .9s;
      }
      .state-dance #settings:hover,
      .state-dance #room-info:hover {
          opacity: 1;
          transition: opacity .1s;
      }
      .coverflow--container {
          box-shadow: -6px 6px 9px #908f8f5e;
      }
      .modal {
          width: 83%;
          height: 100%;
          border-radius: 1em!important
      }

      .modal::before {
          content: '';
          background-color: black;
          width: 200%;
      }
      #settings::before {
          content: '';
          height: 100%;
          width: 100%;
          position: absolute;
          border: 0.02rem solid #8c8c8c70!important;
          border-radius: .1rem;
          color: #110920;
          background: #110920;
          opacity: 1;
          z-index: 2222;
      }
      .toggle {
          background: none;
          transform: scale(0.8);
          top: -3%;
      }
      .danceroom {
          background: #110920;
          border: 0.02rem solid #8c8c8c70;
          border-radius: .1rem;
          color: #212121;
          width: 1.1rem;
      }

      /*ADMIN MENU*/
      #admin-menu .menu__body {
          border-radius: 1em;
          background-color: #110920;
          position: relative;
      }
      #admin-menu {
          width: 3.4rem;
          height: 4.3rem;
          top: 3em;
          left: -2.67rem
      }

      /*SONG SELECTION*/
      .coverflow--container {
          background: none;
          box-shadow: -6px 6px 9px #908f8f00;
      }
      #just-dance-now .views,
      .coach-selection__list::before {
          background-image: url(https://raw.githubusercontent.com/ibratabian17/JDNAssets/JDNModern/images/Dw0eAxks.png), linear-gradient(20deg, #260a39, #0c0623, #0c0623, #1b1864);
          background-position: 30%, center;
          background-size: 50%, 100%
      }
      .coach-selection__list::after {
          background-image: url(https://raw.githubusercontent.com/ibratabian17/JDNAssets/JDNModern/images/EXsN0kn.png), url(https://raw.githubusercontent.com/ibratabian17/JDNAssets/JDNModern/images/QyP0S2sAU.png);

          background-position: center;
          animation: AnimateCosmos2 60s linear infinite;
      }
      #just-dance-now .views::before {
          content: '';
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          background-position: center;
          background-image: url(https://raw.githubusercontent.com/ibratabian17/JDNAssets/JDNModern/images/EXsN0kn.png), url(https://raw.githubusercontent.com/ibratabian17/JDNAssets/JDNModern/images/QyP0S2sAU.png);
          animation: AnimateCosmos2 60s linear infinite;
      }
      #coverflow {
          display: block!important;
          opacity: 1!important;
      }
      .state-songselection .connect-phone-info {
          width: 19.3%;
          height: 7%;
          font-size: .16em;
          color: #e8e8e8;
          background: #110920;
          border: 0.02rem solid #8c8c8c70;
          border-radius: .1rem;
          top: .5rem;
          left: 8.18rem;
      }
      .state-songselection #players .player.controller {
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
      }
      .state-songselection #players {
          left: 7.43rem;
          top: .06rem;
      }
      .state-songselection #players .player {
          opacity: 0;
      }
      .state-songselection .dancercard .player-color {
          overflow: visible;
          width: 1.3em!important;
          left: 0.16em!important;
          top: 0.6em;
          height: 1.3em!important;
      }
      .state-songselection .dancercard .player-color::before {
          content: '';
          position: absolute;
          left: -0.2em;
          top: -0.06em;
          width: 1.96rem!important;
          height: .348rem;
          border: 0.02rem solid #8c8c8c70!important;
          border-radius: .1rem;
          color: #e8e8e8e8;
          background: #110920!important;
          z-index: -1;
      }
      .state-songselection .dancercard .player-name {
          top: .25rem;
          left: 6em !important;
          width: 95.5% !important;
          text-align: left !important;
          text-shadow: 0px 0px #0000 !important;
          font-family: Just Dance;
          color: #e8e8e8;
      }
      .state-songselection .dancercard .avatar-wrapper {
          width: 51%;
          position: absolute;
          z-index: 22;
          top: .4em;
          left: 0.36em;
      }
      #room-info {
          background: #fff0;
          left: 8.1rem;
          width: 1.4rem;
          height: 0;
          overflow: visible!important;
          cursor: pointer!important
      }
      .state-songselection #section-tabs {
          width: 1.1rem;
          right: -7rem;
          z-index: 99;
      }
      ul.tabs li .tabs--icon {
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
          height: 0.2rem!important;
          width: 0.2rem!important;
          margin: 0!important;
          bottom: .4em;
          left: .3em;
          position: absolute;
      }
      #section-playlist:has(.playlist-container[style*="block"]) .playlist-img-container {
      display: block!important;
          width: 110%;
          height: 117%;
          left: -0.3em;
          top: -0.3em;
          
  }
      .playlist-img-container .playlist--banner__selected img {
      object-fit: cover;
          filter: blur(0.1em);
              opacity: 0.2;
          pointer-events: none
  }
      .grid-container {
      overflow: visible;
  }
      .playlist-img-container .playlist--banner__selected {
      width: 100%;
      height: 100%;
      margin: 0;
  }
      
      ul.tabs li .tabs--text {
          margin-top: 0;
          bottom: .6em;
          left: 2.4em;
          position: absolute;
      }
      ul.tabs li {
          margin-bottom: .3em;
          height: 1.8em;
          top: .8em;
          border: 0.02rem solid #8c8c8c70!important;
          border-radius: .1rem;
          color: #aaa;
          background: #110920!important;
      }
      .section-grid-trainer {
          top: 1em;
      }

      .state-songselection #coverflow {
          height: 5.78rem;
          padding-top: 0rem;
      }
      .item-container {
          width: 9999rem!important;
          height: 0%!important;
      }
      .item-container,
      .song--details {
          scroll-snap-type: x mandatory !important
      }

      .item-selected {
          scroll-snap-align: center !important; opacity: 1!important;
      }
      .grid-container .item-container .item {
          opacity: 0.7;
      }
      .songlist-grid,
      .song-grid {
          position: relative;
          top: 3.4rem!important;
          z-index: 999;
          overflow-y: visible;
          overflow-x: hidden
      }
      .song-grid--details {
          height: 0.62rem;
          top: 0.8em;
      }
      #section-songlist .song-grid--details {
          left: .2rem
      }
      #section-playlist .song-grid--details {
          left: .6rem
      }
      .song-grid--details .song-grid--close {
          background-color: #4e2cdb;
          left: -.4rem;
      }
      .state-songselection #preview {
          right: 5.5rem;
      }
      .grid-container .item-container .item {
          width: 2.2rem;
          height: 1.27rem;
      }
      .grid-container .item-container .song__decoration {
          height: 100%;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          float: left;
      }
      .item .song__cover {
          object-fit: cover;
          object-position: 50% 20%;
          height: 100%!important;
      }
      .item {
          transform: scale(0.9);
          padding: 0;
          border: 0.03rem solid #fff0;
          margin: 0rem!important;
      }
      .item-selected {
          border: 0.03rem solid #fff;
          border-radius: 0.5em;
      }
      .grid-container .item-container .item.item-selected .song__cover {
          border: 0px solid;
          border-radius: 0!important;
      }
      .grid-container .item-container .item:hover .song__cover,
      .grid-container .item-container .item.item-selected .song__cover {
          padding: 0%;
      }
      .item .song__decoration::before {
          content: '';
          width: 100%;
          height: 100%;
          position: absolute;
          background-image: linear-gradient(to top, #000c, #0000 50%);
          animation: none;
          z-index: 1;
          background-size: contain!important;
          background-position: center!important;
      }
      .item .song__decoration::after {
          content: '';
          width: 100%;
          height: 100%;
          position: absolute;
          transform: none;
          top: 0;
          left: 0;
          animation: none;
          z-index: 3;
          background-image: linear-gradient(to top, #0000, #0000);
          background-size: cover!important;
          background-position: center!important;
      }
      .item .song__cover::after {
          content: '';
          width: 100%;
          height: 100%;
          position: absolute;
          background-image: linear-gradient(to top, #0000, #0000);
          background-size: contain!important;
          background-position: center!important;
      }

      .item .song__decoration {
          content: '';
          width: 100%;
          height: 100%;
      }
      .grid-container .item-container .title-container {
          position: absolute;
          height: 100%;
          width: 100%;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          z-index: 2;
          top: 0;
          padding: 2%;
      }

      .song--details {
          width: 100%;
      }
      .songlist-container {
          overflow: visible;
      }
      .song-grid--details .song-grid--titleDetails {
          width: 8.9rem;
          height: 100%;
          position: absolute;
          color: #fff;
          border-bottom: 0px solid #cecccc;
          font-family: "OpenSans Regular";
          letter-spacing: -1px;
          bottom: 2%!important;
      }
      #preview .song-details {
          height: 2.2rem;
          width: 5rem;
          background-image: none;
          top: 1.1rem;
          left: 5.67rem;
          padding: 0.1rem 0.0rem 0.0rem 0.5rem;
          text-align: right;
          transition: opacity .8s;
      }
      .song__infos {
          transition: opacity .2s ease-out;
      }
      .song__infos--hide {
          opacity: 0;
          transition: opacity .2s ease-out;
      }
      .song__infos--hide .song-detail__text {
          transform: translateX(-50%)!important
      }
      .song-detail__text {
          transform: translateX(0%)!important
      }
      #preview .song-details h2,
      #preview .song-details h3 {
          text-shadow: 0.03em 0.03em 0.01em #21212199;
          padding: 0em 0.15rem!important;
          color: #f0f0f0;
      }
      #preview .song-details h2 {
          font-weight: 800!important;
          font-family: "OpenSans Regular";
          font-size: .2em;
      }
      #preview .song-details h3 {
          width: max-content;
          float: right;
          margin-top: 9.6em;
          margin-right: 0.03rem;
          text-align: right;
          border: solid #ffe8e836 .17em;
          border-radius: 0.46em;
          color: #fff;
          background: #110920;
      }
      .song__reward {
          width: 0.7rem;
          height: 0.7rem;
          margin-top: -0.02rem;
          position: absolute;
          top: 0.3em;
          right: 3.8rem;
      }
      .score__number {
          top: -62%;
          font-family: "Just Dance", "OpenSans Regular", "Impact", "Arial Bold", Gadget, sans-serif;
          position: relative;
          padding: 0 0.1rem;
          overflow: hidden;
      }
      .score__stars {
          left: 10%;
      }
      .song-cover--hi-res {
          width: 10.28rem;
          height: 3.4rem;
          left: -.65rem;
          top: -.69rem;
          background-size: cover;
          background-position: 50%;
          z-index: -111;
          transition: background .2s;
          background-color: #0000;
          border: none;
      }
      .state-songselection .song-cover--hi-res {
          background: none;
      }
      #preview .song-preview {
          z-index: -1;
      }
      .song-grid::before {
          width: 100%;
          height: 2.18rem;
          content: '';
          position: absolute;
          top: -0.1rem;
          padding: 0rem .1rem;
          border-top: 0.0123rem solid #8c8c8c70;
      }
      .state-songselection #preview .left-pane .video-preview {
          width: 5.4rem;
          height: 3.1rem;
          left: -.32rem;
          top: -.39rem;
          background: #0000;
          overflow: visible;
          opacity: 1!important;
          display: block!important;
          visibility: visible!important
      }
          #preview .left-pane .video-preview::after {
          content: '';
          width: 0.6rem;
          height: 0.6rem;
          left:40%;
          top: 40%;
              position: absolute;
              z-index: 3;
      }
      #preview .left-pane .video-preview::before {
          content: '';
          position: absolute;
          width: 102%;
          height: 100%;
          left: -1%;
          -webkit-mask: linear-gradient(to right, #000 70%, #0000 96%);
          transition: .3s opacity;
          background: #0c0623;
          z-index: 3;
      }
      .video-preview__video {
          width: 102%;
          object-fit: cover;
          object-position: -0.2em center;
          -webkit-mask: linear-gradient(to right, #000 70%, #0000 96%);
          transition: .3s opacity;
      }
      .state-songselection #preview .left-pane .song-cover--hi-res::before,
      .state-songselection #preview .left-pane:hover .video-preview--visible .video-preview__video,
      .dancerOfWeek-container, .state-songselection #preview  .video-preview--visible::before {
          opacity: 0;
      }
      .song-preview .song__difficulty {
      top: 2.85rem;
          right: -3.5rem;
      border-radius: 0.07em;
      width: 0.4rem;
          padding: 0.001em;
      height: 0.22rem;
      text-align: right;
          background: #0000;
          border: 0.019em solid #3a3259;
  }
      .song-preview .song__difficulty .song__difficulty--level {
      height: 75%;
      width: 0.0365rem;
      top: -0.725rem;
      left: -0.26rem;
          filter: saturate(0%) brightness(120%);
          transition: .1s all;
  }
      .song-preview .song__difficulty::after {
      content: "Difficulty: " attr(data-text);
      color: #fff;
     text-align: right!important;
          left: -2.1rem;
          width: 2rem;
          height: 1em;
          font-size: 0.12rem;
          
  }
      .state-songselection #preview .left-pane:hover .song-cover--hi-res::before {
          opacity: 1;
      }
      .song-cover--hi-res::before {
          width: 3.95rem;
          height: 2.22rem;
          content: '';
          top: 1.2rem;
          left: 0.64rem;
          position: absolute;
          background-size: contain;
          background-position: bottom;
          background-repeat: no-repeat;
          z-index: 999;
          transform: scale3d(1.2, 1.2, 1);
          transform-origin: bottom;
          transition: background .2s;
          -webkit-mask: linear-gradient(180deg, #000 95%, #0000 100%) !important;
      }
      .song-cover--hi-res::after {
          width: 1.91rem;
          height: 1.42rem;
          content: '';
          top: 1.4rem;
          right: 0.2rem;
          position: absolute;
          padding: 0 0.02rem 1.2rem 0;
          padding: 1.2rem 0.02rem 0 0;
          border-radius: .07rem;
          font-size: 0.15em;
          color: #d7d7d796;
          transition: background .2s;
          transition-delay: .1s;
          justify-content: center;
          text-align: right;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center 0;
      }
      .state-songselection .song-cover--low-res {
          width: 10.32rem;
          height: 5.8rem;
          left: -.65rem;
          top: -.69rem;
          content: '';
          color: #ffffff12;
          -webkit-mask: linear-gradient(transparent 40%, rgba(0, 0, 0, .99));
          position: absolute;
          padding: 0rem .1rem;
          border-radius: .1rem;
          transition: background .2s;
          background: #ffffff0d!important;
      }
      .song-action__button {
          background: #11092066;
          height: 100%;
          width: 100%;
          font-size: .14em;
          text-align: right;
          padding: 0 1em 0.1em 0em;
          border-radius: 0.07rem;
          color: #e8e8e8
      }
      .song-action__button::before {
          height: 100%;
          animation: none;
          top: 0em;
          background: url(https://raw.githubusercontent.com/ibratabian17/JDNAssets/JDNModern/images/0iewDeL.png);
          background-size: 90%;
          background-position: center;
          transform: none;
          filter: brightness(9000%) grayscale(100%);
      }
      .song-action {
          height: 0.22rem;
          width: 0.9em;
          top: 0.2em;
          left: 8.53em;
      }
      .song-grid {
          padding-top: 0rem;
          overflow: visible!important;
      }
      .coverflow--container {
          width: 100%;
          top: -5.91rem;
          overflow: visible!important;
      }
      .dancerOfWeek-container {
          color: #212121;
          background: #110920!important;
          border: 0.03rem solid #ffffff38;
          width: 2rem;
          height: 1.2rem;
          border-radius: 14px;
          padding: 0.05rem;
          font-family: "OpenSans Regular";
          position: absolute;
          z-index: 1;
          top: -5em;
          left: 7.45rem;
      }
      .dancerOfWeek--title span {
          background: #fff0;
      }
      .dancerOfWeek--title {
          top: .27em;
          font-size: .7em;
          color: #FAFAFA;
          font-family: Just Dance
      }
      .highscore-display {
          text-shadow: 0.03em 0.03em 0.01em #21212199;
          color: #f0f0f0;
          background-color: #0000!important;
          left: 3.56rem;
          top: .5rem;
          font-size: 0.25em
      }
      .score__stars {
          transform: scale(1.2);
          top: 12%;
          left: 7%;
      }
      .dancerOfWeek--data .owner-name span {
          color: #d5d5d5!important;
          background: #0000;
          font-size: 1.17em;
          text-align: left!important;
      }
      .dancerOfWeek--data .owner-name {
          top: 1.9em;
          width: 123%;
          text-align: left;
      }
      .dancerOfWeek--data .score__stars[data-stars="1"],
      .dancerOfWeek--data .score__stars[data-stars="2"],
      .dancerOfWeek--data .score__stars[data-stars="3"],
      .dancerOfWeek--data .score__stars[data-stars="4"],
      .dancerOfWeek--data .score__stars[data-stars="5"] {
          left: 0.07rem!important;
          top: 1.58em;
      }
      .dancerOfWeek .dancerOfWeek--avatar {
          top: 18%!important;
          left: -.4em;
          position: absolute!important;
      }
      .dancerOfWeek .dancerOfWeek--data {
          left: 2.6em;
      }
      .dancerOfWeek .dancerOfWeek--misc {
          top: 1.6em;
          left: -1.06em;
          position: absolute;
      }
      .dancerOfWeek--data .score__number {
          color: #9b9b9b;
          font-size: 0.12rem;
          text-align: left;
          top: 4.81em;
          left: 3em;
      }
      .state-songselection .pre-beat.odd .song-cover--low-res {
          animation: bright .3s;
      }
      .state-songselection .pre-beat.even .song-cover--hi-res::before {
          animation: PCoach .3s;
      }
      .state-songselection .pre-beat.odd .song-cover--hi-res::before {
          animation: PCoach2 .3s;
      }
      @-webkit-keyframes bright {
          0% {
              filter: brightness(100%);
          }
          20% {
              filter: brightness(105%);
          }
          100% {
              filter: brightness(100%);
          }
      }
      @-webkit-keyframes PCoach {
          0% {
              transform: scale3d(1.2, 1.2, 1)
          }
          20% {
              transform: scale3d(1.17, 1.17, 1.1);
              filter: brightness(120%)
          }
          100% {
              transform: scale3d(1.2, 1.2, 1)
          }
      }
      @-webkit-keyframes PCoach2 {
          0% {
              transform: scale3d(1.2, 1.2, 1)
          }
          20% {
              transform: scale3d(1.19, 1.19, 1.1)
          }
          100% {
              transform: scale3d(1.2, 1.2, 1)
          }
      }
      @-webkit-keyframes PBack {
          0% {
              background-size: 118%;
              filter: hue-rotate(140deg);
          }
          20% {
              background-size: 123%;
              filter: hue-rotate(140deg) brightness(105%);
          }
          100% {
              background-size: 118%;
              filter: hue-rotate(140deg);
          }
      }
      @keyframes gotop {
          0% {
              padding-top: 0.1rem;
          }
          100% {
              padding-top: 0.0rem;
          }
      }

      /* TRANSITION */
      .state-tutorial #coverflow,
      .state-tutorial #preview,
      .state-tutorial .coverflow--container,
      .state-tutorial #preview .song-preview,
      .state-dance #coverflow {
          display: block!important;
          opacity: 1!important;
          transition: 1s all;
      }
      .state-tutorial #coverflow,
      .state-dance #coverflow {
          background: none!important;
          position: absolute;
      }
      .state-tutorial #preview {
          top: 60%
      }
      #just-dance-now .tutorial {
          background: none!important
      }
      .state-tutorial .song-cover--hi-res {
          width: 7.52rem;
          height: 3.4rem;
          left: -4.5rem;
          top: 2.5rem;
          background-size: cover;
          background-position: center;
          z-index: -111;
          transition: background .2s;
          transition-delay: .2s;
          background-color: #000;
          transform: scale(0.9);
          transform-origin: bottom;
          animation: FadeIn 0.5s !important;
          -webkit-mask: none;
      }
      .state-tutorial .song-cover--hi-res::before {
          width: 100%;
          height: 100%;
          opacity: 1!important;
          top: 0%;
          left: 0%;
      }
      .state-tutorial .song-cover--hi-res::after,
      .song-cover--low-res {
          display: none
      }
      #dance-transition .dt2,
      #dance-transition .dt3,
      #dance-transition .dt4,
      #dance-transition .dt5,
      #dance-transition .dt6,
      #dance-transition .dt7,
      #dance-transition .dt8 #dance-transition {
          z-index: 9999999999999999999;
          background-image: none !important;
          background-color: #fff
      }

      #dance-transition .dt1 {
          top: 0!important;
          background-image: none !important;
          background-color: #0c0623
      }

      #dance-transition .dt,
      #dance-transition .dt-row,
      #dance-transition.animate .dt,
      #dance-transition.animate .dt-row,
      #dance-transition.animate.out .dt,
      #dance-transition.animate.out .dt-row {
          background-position: center!important;
          margin-top: 0!important;
          margin-bottom: 0;
          margin-left: 0;
          width: 100%;
          height: 100%;
          background-size: cover!important;
          -webkit-transform: none!important;
          transform: none!important;
          background-repeat: no-repeat!important;
          background-image: none !important;
          background-color: #fff0 !important
      }

      #dance-transition.in .dt,
      #dance-transition.in .dt-row {
          -webkit-transition-property: opacity!important;
          transition-property: opacity!important;
          background-image: none !important;
          background-color: #0c0623 !important
      }

      #dance-transition::before,
      #just-dance-now .tutorial::before {
          background-image: linear-gradient(85deg, #4e84ff 20%, #4e2cdb 100%);
          background-size: 140%!important;
          top: 45%;
          left: 37%;
          width: 25%;
          height: 10%;
          z-index: 1;
          border-radius: 0.1em;
          background-color: #fff0 !important
      }

      #dance-transition.in::before,
      #just-dance-now .tutorial::before {
          animation: FadeIn 2s, Mada 2s infinite linear!important;
          opacity: 1 !important;
          transition: opacity 0.8s, background 1s;
      }

      #dance-transition.out::before {
          animation: FadeOut 0.8s !important;
          transition: opacity 0.5s, background 1s;
      }


      #dance-transition.animate.out::before,
      #dance-transition.animate.out .dt-row {
          transition-timing-function: ease-in;
      }
      @keyframes FadeIn {
          0% {
              opacity: 0 !important
          }

          100% {
              opacity: 1 !important
          }
      }
      @keyframes Mada {
          0% {
              filter: hue-rotate(0deg);
          }

          100% {
              filter: hue-rotate(360deg);
          }
      }

      @keyframes FadeOut {
          0% {
              opacity: 1
          }

          100% {
              opacity: 0
          }
      }
      @keyframes animateShowCoach {
          0% {
              opacity: 0;
          }
          40% {
              opacity: 1;
              transform: translateX(0.2em);
          }
          70% {
              opacity: 1;
              transform: translateX(0.0em);
          }
      }
      @keyframes AnimateCosmos2 {
          0% {
              background-size: 90%, 80%;
              opacity: 0;
          }
          10%,
          90% {
              opacity: 0.7;
          }
          100% {
              background-size: 120%, 110%;
              opacity: 0;
          }
      }



      .racetrack-fill-players {
          border-radius: 0.05rem;
          width: 25%!important;
          background-image: linear-gradient(85deg, #4e84ff00 20%, #00000038 100%);
          transition: .2s ease-in transform !important;
          background-size: 100%;
      }
      .anucore-rcplus .racetrack-fill-players {
          transform-origin: bottom;
          transform: scaleY(var(--ReducedPst))!important;
          border-radius: 0.15rem 0.15rem 0 0;
      }
      #racetrack-fill-p2 {
          left: 25%!important;
      }
      #racetrack-fill-p3 {
          left: 50%!important;
      }
      #racetrack-fill-p4 {
          left: 75%!important;
      }
      .progress-background {
          background: #0000000c;
          background-size: 0% 320%!important;
          background-position: center;
          -webkit-mask-image: linear-gradient(0deg, rgba(0, 0, 0, .48) 57%, #f000 85%) !important;
      }

      
      #goldmove .layer.layer-1 {
          background-image: url(https://imgur.com/hZvwBAd.png);
      }

      #goldmove .layer.layer-2 {
          background-image: url(https://imgur.com/KEttRaP.png);
      }

      #goldmove .layer.layer-3 {
          background-image: url(https://imgur.com/m1EzLkZ.png), url(https://imgur.com/m1EzLkZ.png);
      }
      #goldmove {
          z-index: -1;
      }
      #lyrics {
          font-size: 0.169rem;
          left: 4.7%;
          font-family: "Just Dance";
          font-weight: 100!important;
      }
      #lyrics:before {
          content: "";
          position: absolute;
          width: 3.2rem;
          height: 0.9rem;
          bottom: -0.67rem!important;
          left: -12%;
          background: #00000059;
          filter: blur(0.28rem);
          border-radius: 0em;
      }
      #lyrics .fragment {
          font-weight: 100!important;
          -webkit-text-stroke: 0.035em #111;
          text-shadow: 0px 0px 0px #0000!important;
          
      }
      #lyrics .fragment .fill {
          -webkit-text-stroke: 0.025em #111;
          transition-timing-function: linear!important
      }
      #lyrics .line.current .fill {
          animation: gotop ease-out .2s .01s!important;
      }
      #lyrics .line.current,
      #lyrics .line.previous {
          color: #d9d9d9;
          margin-top: -0.0% !important;
          opacity: 1;
      }
      #lyrics .line {
          color: #d9d9d9;
          margin-top: 0.9% !important;
          opacity: 0.87;
          -webkit-animation: nextLineInf 0.16s linear;
          animation: nextLineInf 0.165s ease-out!important;
      }
      #lyrics .line.current {
          transform: translatey(-5%);
          transition: .162s all ease-out, .1s color !important;
          opacity: 1;
      }


      #lyrics .line.previous {
          transform: translatey(-5%) !important;
          transition: .05s opacity !important;
          transition-delay: .05s!important;
          opacity: .0;
      }
      @-webkit-keyframes nextLineInf {
          0%,
          20% {
              opacity: 0;
              -webkit-transform: perspective(0px) translateY(2.05em) rotateX(0deg);
              transform: perspective(0px) translateY(2.05em) rotateX(0deg);
          }
          100% {
              opacity: 1;
              -webkit-transform: translateY(1em) perspective(0px) rotateX(0deg);
              transform: translateY(1em) perspective(0px) rotateX(0deg);
          }
      }
      @keyframes nextLineInf {
          0%,
          20%{
              -webkit-transform: perspective(0px) translateY(2.15em) rotateX(0deg);
              transform: perspective(0px) translateY(2.15em) rotateX(0deg);
          }
          100% {
              opacity: 1;
              -webkit-transform: translateY(1em) perspective(0px) rotateX(0deg);
              transform: translateY(1em) perspective(0px) rotateX(0deg);
          }
      }
      @keyframes bounceP {
          0% {
              opacity: 0;
              -webkit-transform: scale3d(1, 1, 1);
              transform: scale3d(1, 1, 1)
          }
          15% {
              opacity: 1;
              -webkit-transform: scale3d(0.8, 0.8, 1);
              transform: scale3d(0.9, 0.9, 0.9)
          }
          24% {
              -webkit-transform: scale3d(1, 1, 1);
              transform: scale3d(1, 1, 1)
          }

          30% {
              opacity: 1;
              -webkit-transform: scale3d(0.8, 0.8, 1);
              transform: scale3d(0.8, 0.8, 0.8)
          }

          43% {
              opacity: 1;
              -webkit-transform: scale3d(0.95, 0.95, 1);
              transform: scale3d(0.95, 0.95, 1)
          }
          100% {
              opacity: 1;
              -webkit-transform: scale3d(1, 1, 1);
              transform: scale3d(1, 1, 1)
          }
      }
      #racetrack .star3,
      #racetrack .star2,
      #racetrack .star1 {
          margin-bottom: -2%;
      }

      #racetrack .star3 {
          bottom: 40%;
      }

      #racetrack .star2 {
          bottom: 24%;
      }

      #racetrack .star1 {
          bottom: 8%;
      }

      #beat .particle-system {
          display: none;
      }
      #beat {
          width: 0.86rem!important;
          height: 5% !important;
          bottom: -2.7% !important;
          left: -.86rem;
          background-color: #fff;
          /* background: linear-gradient(90deg,#000 50%, #fff, #000 51%); */
          border-radius: 20rem;
          -webkit-mask-position: center !important;
          border-bottom: none;
          opacity: 1!important;
          visibility: visible!important;
          display: block!important;
      }
          #pictos::after {
              content: '';
          width: 0.86rem!important;
          height: 1.1em !important;
          bottom: -2.7% !important;
          left: -.86rem;
          background-image: linear-gradient(to bottom, #0000, #fff6, #fff);
          /* background: linear-gradient(90deg,#000 50%, #fff, #000 51%); */
          -webkit-mask-position: center !important;
          border-bottom: none;
          opacity: 0.2;
          transform: scale(0.95);
          visibility: visible!important;
          display: block!important;
              position: absolute;
      }
      
      .hud.even #pictos:after {
          animation: lie 0.25s;
      }

      html:not(.ipad) .hud.beat > #pictos > #beat {
          -webkit-animation-name: BeatCoach !important;
          animation-name: BeatCoach !important;
      }
      #pictos {
          border-bottom: solid 0.019rem rgba(255, 255, 255, .55);
          box-shadow: 2px 4px 2px 0px rgba(0, 0, 0, 0);
          font-size: 1.13rem; /*fix pictosbar broken on 1080p device*/
      }

      .hud.odd .player:nth-child(1) .dancercard .avatar,
      .hud.odd .player:nth-child(3) .dancercard .avatar,
      .hud.even .player:nth-child(2) .dancercard .avatar,
      .hud.even .player:nth-child(4) .dancercard .avatar {
          animation: pictosa .3s !important;
      }
      .hud .dancercard .player-color{
          animation: none!important;
      }
          .hud.even .player:nth-child(1) .dancercard .player-color,
      .hud.even .player:nth-child(3) .dancercard  .player-color,
      .hud.odd .player:nth-child(2) .dancercard  .player-color,
      .hud.odd .player:nth-child(4) .dancercard  .player-color {
          animation: pictosabkg .3s !important;
      }
      .hud.beat #pictos {
          transition: .2s all !important;
      }
      html.androidApp #beat {
          display: none!important;
      }
      .hud.beat #pictos {
          border-bottom: solid 0.019rem rgba(255, 255, 255, .55)!important;
          box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, .09)!important;
      }
      .hud #beat {
          opacity: 0;
      }
      .hud.beat #beat {
          opacity: 0;
      }
      .picto {
          background: linear-gradient(90deg, #323234 49%, #ffffff 50%, #323234 51%);
      }
      #pictos {
          width: 31% !important;
          top: 70.8% !important;
          transform-origin: bottom!important;
          transform: scaleY(1.01);
          font-size: 1.1rem;
      }
      @keyframes testa {
          0% {
              transform: scaleY(1);
          }
          3% {
              transform: scaleY(0.98);
          }

          19% {
              transform: scaleY(1.01);
          }
          100% {
              transform: scaleY(1);
          }
      }

      .hud.even #pictos {
          transform: scaleY(1.01);
      }
      #pictos {
          right: -0.5rem;
      }
      #pictos.multi-coach {
          right: 0.03rem;
      }

      .picto {
          left: -1.11rem !important;
          margin-bottom: 0.02em !important;
      }
      .picto.hiding {
             transition: .4s linear all,.35s ease-out opacity, .76s ease-out transform!important;}

      .multi-coach .picto {
          left: -1.392rem !important;
      }

      @keyframes BeatCoach {
          100% {
              opacity: 1!important;
              transform: scale3d(1., 1, 1);
          }
          10% {
              opacity: 1!important;
              transform: scale3d(1.12, 1, 1);
          }
          0% {
              opacity: 1!important;
              transform: scale3d(1., 1, 1);
          }
      }
      @keyframes BeatCoach2 {
          100% {
              opacity: 1!important;
              transform: scale3d(1., 1, 1);
          }
          10% {
              opacity: 1!important;
              transform: scale3d(1.12, 1, 1);
          }
          0% {
              opacity: 1!important;
              transform: scale3d(1., 1, 1);
          }
      }
      @keyframes lie {
          100% {
              opacity: 0.2;
          }
          10% {
              opacity: 1;
          }
          0% {
              opacity: 0.2
          }
      }
      @keyframes pictosa {
          0%,
          0% {
              transform: scale3d(1, 1, 1);
          }
          12% {
              transform: scale3d(.90, .90, 1) rotate(3deg);
          }
          100% {
              transform: scale3d(1, 1, 1);
          }
      }
          @keyframes pictosabkg {
          0%,
          0% {
              filter: brightness(100%);

          }
          12% {
              filter: brightness(130%)
          }
          100% {
              filter: brightness(100%)
          }
      }
      #racetrack {
          top: 20% !important;
          transform-origin: bottom;
      }
      #racetrack.superstar,
      #racetrack.megastar {
          animation: bounceP .7s!important;
      }
      #racetrack .progress-bar {
          right: -28%;
          width: 48%;
      }

      #racetrack.animate .platform {
          display: none;
      }
      #racetrack .star {
          left: 0.14rem;
          width: 0.55rem;
          height: 0.55rem;
          transform: none;
      }
      @keyframes racetrack-star-beat1 {
          20% {
              transform: scale(1.2)
          }
          0%,
          100% {
              transform: scale(1)
          }
      }
      .hud.beat > #racetrack.animate .star:not(.no-beat) {
          animation: racetrack-star-beat1 0.3s
      }
      .hud.beat.odd > #racetrack.animate .star1:not(.no-beat),
      .hud.beat.odd > #racetrack.animate .star3:not(.no-beat),
      .hud.beat.odd > #racetrack.animate .star5:not(.no-beat),
      .hud.beat.even > #racetrack.animate .star2:not(.no-beat),
      .hud.beat.even > #racetrack.animate .star4:not(.no-beat) {
          -webkit-animation: none;
          animation: none;
      }
      #racetrack {
          top: 18.3%;
          left: 0%;
          width: 7.0%;
          height: 58.2%;
      }


      @keyframes racetrack-star-beat {
          0% {
              transform: scale(0.8) rotate(11deg)!important
          }
          25% {
              transform: scale(0.9) rotate(11deg)!important
          }
          100% {
              transform: scale(0.8) rotate(11deg)!important
          }
      }

      @keyframes newStar {
          0% { opacity: 0; transform: scale(0.8) rotate(15deg);
          }
          32% { opacity: 1; transform: scale(1.25) rotate(15deg);
          }
          79% { opacity: 1; transform: scale(1.25) rotate(375deg);
          }
          100% { opacity: 1; transform: scale(0.8) rotate(375deg);
          }
      }
      .racetrack-empty {
          transition: none!important;
      }

      /*COACH SELECTION*/
      .coach-selection__bgImg {
          background: #212121;
          width: 102.3%;
          height: 126.8%;
          top: -24.4%;
          right: -1.1%;
          border-radius: .0rem;
          z-index: -2
      }
      .coach-selection__list::before,
      .coach-selection__list::after {
          content: '';
          width: 103%;
          height: 192%;
          position: absolute;
          left: -0.12rem;
          top: -2.1rem;
      }
      .coach-selection__list {
          z-index: -1;
          transform-style: preserve-3d;
          perspective: 800em;
          perspective-origin: left;
      }
      .coach::before {
          width: 84%;
          height: 91%;
          right: 0.08rem;
          top: -0.23rem;
          background: none;
          border-radius: 0.2em;
          box-shadow: 0px -2.8em 0.5em #006aff42, 0px 2.8em 0.5em #006aff42;
          border: solid 0.05em #fff;
          outline: 0.07em solid #006aff;
          transition: .3s all;
      }
      .coach:has(.coach__histogram .coach__player-list)::before {
          box-shadow: 0px -2.8em 0.5em #8b00ff42, 0px 2.8em 0.5em #8b00ff42;
          border: solid 0.05em #fff;
          outline: solid 0.1em #8b00ff;
      }

      .coach-selection__list--1::before,
      .coach-selection__list--1::after {
          -webkit-mask-image: url(https://raw.githubusercontent.com/ibratabian17/JDNAssets/JDNModern/coach1.png)!important;
          -webkit-mask-size: 100% 100%;
      }
      .coach-selection__list--2::before,
      .coach-selection__list--2::after {
          -webkit-mask-image: url(https://raw.githubusercontent.com/ibratabian17/JDNAssets/JDNModern/coach2.png)!important;
          -webkit-mask-size: 100% 100%;
      }
      .coach-selection__list--3::before,
      .coach-selection__list--3::after {
          -webkit-mask-image: url(https://raw.githubusercontent.com/ibratabian17/JDNAssets/JDNModern/coach3.png)!important;
          -webkit-mask-size: 100% 100%;
      }
      .coach-selection__list--4::before,
      .coach-selection__list--4::after {
          -webkit-mask-image: url(https://raw.githubusercontent.com/ibratabian17/JDNAssets/JDNModern/coach4.png)!important;
          -webkit-mask-size: 100% 100%;
      }
      .coach-selection__list--3 .coach[data-id="1"]::before,
      .coach-selection__list--4 .coach[data-id="1"]::before {
          transform: perspective(29em) rotateY(45deg) scale3d(1.46, 1.06, 2);
      }
      .coach-selection__list--3 .coach[data-id="3"]::before,
      .coach-selection__list--4 .coach[data-id="4"]::before {
          transform: perspective(29em) rotateY(-45deg) scale3d(1.46, 1.06, 2);
      }

      .coach-selection__bgImg img {
          height: 100%;
          width: 100%;
          object-fit: cover;
      }

      .coach-selection__back {
          background-color: #110920;
          top: 90.5%;
          right: 18%;
      }

      .coach__names-list {
          z-index: 2!important;
          right: 0.36rem;
      }

      .state-coachselection [data-id="2"] {
          z-index: 3!important;
      }
      .state-coachselection [data-id="3"] {
          z-index: 2!important;
      }
      .state-coachselection [data-id="4"] {
          z-index: 1!important;
      }
      .state-coachselection [data-id="1"] {
          z-index: 4!important;
      }

      .coach-selection__button {
          background: linear-gradient(to top, #91001e, #ff0064);
          border: 0.2em solid #fff;
          border-radius: 0.4em;
      }
      .coach-selection__button::after,
      .coach-selection__button::before {
          display: none
      }


      #coverflow,
      #players::before {
          background: transparent/*#9000FF*/
          !important;
      }

      .state-coachselection #players {
          display: none;
      }

      .state-coachselection .song-cover {
          display: initial;
          visibility: visible;
          z-index: 9999!important;
          right: 6.65rem;
          top: -0.7rem;
          height: 34%;
          width: 34%
      }
      .state-coachselection #coverflow {
          padding-top: 1.1rem!important
      }
      .state-coachselection #coverflow .coverflow--container {
          height: 80rem!important;
          top: -1.07rem;
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
          z-index: 99999999999 !important;
          background: none !important;
          pointer-events: none !important;
      }

      .state-coachselection #preview .song-details,
      .state-coachselection #section-songlist,
      .state-coachselection .grid-container,
      .state-coachselection .video-preview--visible,
      .state-coachselection #preview .right-pane,
      .state-coachselection .song-cover--hi-res,
      .state-coachselection .highscore-display {
          display: none!important;
          visibility: hidden !important;
          opacity: 0 !important;
          z-index: -99999999999 !important;
      }


      .coach__player-list::before {
          transform: rotate(0deg);
          border-radius: 6%;
      }

      .state-coachselection [data-id="1"] .coach__img,
      .state-coachselection [data-id="3"] .coach__img {
          animation: CoachBeat3 var(--preview-duration) infinite alternate-reverse!important;
          transform-origin: bottom;
          top: -.2rem;
      }

      .state-coachselection [data-id="2"] .coach__img,
      .state-coachselection [data-id="4"] .coach__img {
          animation: CoachBeat3 var(--preview-duration) infinite alternate;
          transform-origin: bottom;
          top: -.2rem;
      }

      .coach-selection {
          -webkit-animation: fadeopda 0.9s;
          animation: fadeopda 0.9s;
      }

      @keyframes fadeopda {
          0% {
              transform: scale(1.05);
              opacity: 0;
          }
          55% {
              opacity: 1;
          }
          100% {
              filter: brightness(100%);
          }
      }

      .coach__names-list {
          top: -6%;
          left: 0.5%;
          transform: scale(0.85);
          width: 130%;
          height: 130%;
      }

      .coach__player-list {
          padding: 0.06rem 0.0rem 0.0rem 0.08rem;
          width: 1.5rem;
          height: 0.43rem;
          opacity: 1;
          color: #fff;
          background: #110920;
          font-weight: bolder;
          font-size: 0.96em;
          transition: all .3s
      }
      .coach__player-list::after {
          content: 'Just Dancer';
          color: #ffffff73;
          top: 1.8em;
          position: absolute;
          left: 0.4em;
          font-weight: normal;
          font-size: 0.91em;
      }
      .coach__img {
          width: auto;
          height: 90%;
          top: 0rem;
          left: -0.37rem;
      }
      .state-coachselection [data-id="1"],
      .state-coachselection [data-id="2"],
      .state-coachselection [data-id="3"],
      .state-coachselection [data-id="4"] {
          margin-left: 4%;
          margin-right: 4%;
          left: -0%;
          top: -10%;
          transform: scale(1.15);
      }



      .state-coachselection__list {
          animation: none !important;
      }

      .coach-selection__title {
          text-shadow: 1px 1px #000000c4;
      }
      .coach-selection__details .coach-selection__details-song {
          font-weight: bold;
          font-size: 0.185rem;
          padding: 0.3em 0 0.03rem 0.025rem;
      }

      .state-coachselection .song-cover--low-res {
          visibility: visible;
          display: inline;
          position: absolute;
          opacity: 1 !important;
          z-index: 99999999999999999999 !important;
          top: 4rem;
          left: -5.61rem;
          transform: scale(1.05);
          border-radius: .07em;
      }
      .coach-selection__details {
          width: 3.62em!important;
          top: 3.7rem;
          text-align: left;
          color: #fff;
          background: #11092000;
          border: 0.02rem solid #8c8c8c00;
          padding-left: 8%;
          height: 18%;
          left: 0.1em;
          transform: scale(1.05);
          border-radius: .12em;
      }

      .coach-selection__title {
          color: #ffffff;
          top: -3%;
      }

      @keyframes CoachBeat3 {
          0% {
              filter: brightness(120%);
              transform: scale3d(0.98, 0.98, 1.0)
          }

          14% {
              filter: brightness(100%);
              transform: scale3d(1.0, 1.0, 1.0)
          }
      }
      #players .star.star-1,
      #players .star.star-2,
      #players .star.star-3,
      #players .star.star-4,
      #players .star.star-5 {
          width: 0.4rem;
          height: 0.4rem;
          margin: 0 -0.10rem;
      }
      .player-master .player-master--icon {
          display: none;
      }
      .state-dance .dancercard .player-flag,
      .state-dance .dancercard .player-exp.player-exp-normal,
      .state-dance .connect-phone-info--visible {
          display: none;
      }
      .avatar-wrapper .avatar {
          right: 30%;
      }

      .dancercard .player-name {
          top: -3.5%;
          left: 0% !important;
          width: 95.5% !important;
          text-align: center !important;
          text-shadow: none !important;
          font-family: Just Dance;
          transform: scale(1.6) !important
      }
      .state-dance .controller .dancercard .player-name em {
          max-width: 2.1rem;
      }
      .state-dance .dancercard .player-name {
          background: rgba(255, 255, 255, 0);
          -webkit-mask: linear-gradient(90deg, rgba(255, 255, 255, 0) 22%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 1) 45%, rgba(0, 0, 0, 1) 75%, rgba(255, 255, 255, 0) 84%)!important;
          left: -1%!important;
          bottom: 29%!important;
      }
      .dancercard .player-name em {
          text-shadow: 0px 0px 1px #000000 !important;
          font-family: "Just Dance"!important;
          overflow: visible!important;
          text-align: center !important;
      }
      .dancercard {
          margin-right: 110% !important;
      }
      .dancercard .player-color {
          border-radius: 8px 8px 8px 8px;
          width: 82%!important;
          height: 24%;
          top: 40%;
          margin-left: 9.6%;
          left: -1.5%;
      }
      .state-dance .dancercard .player-color {
          -webkit-mask-image: linear-gradient(to bottom, #000000c4, #00000017 80%, #0000)!important;
          transform: skew(8deg);
          border-radius: 8px 8px 8px 8px;
          width: 60%!important;
          height: 0.91rem;
          top: -0.45rem;
          margin-left: 9.6%;
          left: 8%;
          z-index: -88;
      }
      .state-dance #players {
          width: 120% !important;
          left: -2% !important;
          top: -2.0%;
      }
      .crown {
          top: 17% !important;
          left: -0% !important;
          transform: scale(1.5) rotate(-10deg) !important
      }
      .crown::before {
          background-image: url(https://raw.githubusercontent.com/ibratabian17/JDNAssets/JDNModern/images/pH3xc9A.png)!important;
      }
      .crown {
          background-image: url(https://raw.githubusercontent.com/ibratabian17/JDNAssets/JDNModern/images/pH3xc9A.png)!important;
      }
      #players .crown::before {
          -webkit-animation: CrownZoom 5s infinite !important;
          animation: Corona 5s infinite alternate;
          background-image: url(https://raw.githubusercontent.com/ibratabian17/JDNAssets/JDNModern/images/pH3xc9A.png)!important;
          background-color: transparent!important;
          border: none;
      }
      .blue .player-color,
      .racetrack-fill-players.blue,
      #afterdance .blue .color {
          background-color: #4e2cdb!important;
          background-image: linear-gradient(#1c8ae9, #192895);
      }


      .red .player-color,
      .racetrack-fill-players.red,
      #afterdance .red .color {
          background-color: #ff7824!important;
          background-image: linear-gradient(#ebb21b, #e34900);
      }


      .green .player-color,
      .racetrack-fill-players.green,
      #afterdance .green .color {
          background-color: #65d81a!important;
          background-image: linear-gradient(#77ec00, #008422);
      }


      .purple .player-color,
      .racetrack-fill-players.purple,
      #afterdance .purple .color {
          background-color: #83099a!important;
          background-image: linear-gradient(#ba01fd, #800077);
      }


      .pink .player-color,
      .racetrack-fill-players.pink,
      #afterdance .pink .color {
          background-color: #ff01a5!important;
          background-image: linear-gradient(#e410a7, #ca006e);
      }


      .aqua .player-color,
      .racetrack-fill-players.aqua,
      #afterdance .aqua .color {
          background-color: #4adea8!important;
          background-image: linear-gradient(#1fe7e9, #22b4f4);
      }
      /*----------HUD----------*/
      #players .feedback-badgold {
          animation: ParticlePerfect 0.5s ease-out !important;
          width: 60%;
          height: 60%;
          left: 16%;
          top: 49%;
      }

      #players .feedback-bad {
          animation: ParticlePerfect 0.5s ease-out !important;
          width: 70%;
          height: 70%;
          left: 16%;
          top: 49%;
      }
      #players .feedback {
          height: 100%;
          top: 0.9em;
          background-position: center;
          transition: .2s background !important;
      }
      #players .feedback-none {
          background-position: center;
          background-image: radial-gradient(at top, #f000 0%, #0000 76%);
          transition: .2s background !important;
      }
      .feedback-perfect:after {
          content: "";
          position: absolute;
          width: 300%;
          height: 130%;
          top: -10%;
          left: -99%;
          background-image: url(https://imgur.com/VyCwYpU.png);
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 1;
          animation: feedlabel .7s!important
      }
      .feedback-good:after {
          content: "";
          position: absolute;
          width: 300%;
          height: 130%;
          top: -10%;
          left: -99%;
          background-image: url(https://imgur.com/pQaUCXJ.png);
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 1;
          animation: feedlabel .7s!important
      }
  .hud.odd #players.animate .player:nth-child(1) .feedback,
      .hud.odd #players.animate .player:nth-child(3) .feedback,
      .hud.even #players.animate .player:nth-child(2) .feedback
      .hud.even #players.animate .player:nth-child(4) .feedback{
      -webkit-animation: feedlabel2 1s;
      animation: feedlabel2 1s;
  }
      .feedback-ok:after {
          content: "";
          position: absolute;
          width: 200%;
          height: 130%;
          top: -10%;
          left: -49%;
          background-image: radial-gradient(#6e21d7d6 10%, #0000 20%);
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 1;
          animation: feedlabel .7s!important
      }
      .feedback-yeah:after {
          content: "";
          position: absolute;
          width: 300%;
          height: 130%;
          top: -10%;
          left: -99%;
          background-image: url(https://imgur.com/VyCwYpU.png), radial-gradient(#37ca1b69 0%, #0000 50%);
          background-size: 60%, contain;
          background-position: center;
          background-repeat: no-repeat;
          filter: brightness(180%) hue-rotate(330deg);
          opacity: 1;
          animation: feedlabel .7s!important
      }
      #players .feedback {
          background-image: none!important;
          overflow: visible!important;
      }

      #players .feedback-yeah {
          overflow: visible !important;
      }
      #players .stars {
          top: 62% !important;
          transform: scale(0.75);
          left: -26%;
      }
      /*----------HUD----------*/
      #players .player .controller-coins {
          bottom: 20%;
      }
      .hud.beat #players .feedback-label {
          background-repeat: no-repeat;
          background-image: url(https://raw.githubusercontent.com/ibratabian17/JDNAssets/JDNModern/images/QyGm2AS.png);
          animation: feedlabel .7s!important
      }
      .hud.beat #players .feedlabel-perfect,
      .hud.beat #players .feedlabel::after {
          animation: feedlabelP .7s!important
      }

      #players .feedback-badgold {
          width: 60%;
          height: 60%;
          left: 16%;
          top: 49%;
      }

      #players .feedlabel-bad {
          width: 70%;
          height: 70%;
          left: 16%;
          top: 49%;
      }

      #players .feedlabel-ok {
          width: 55%;
          height: 55%;
          left: 23.6%;
          top: 52%;
      }

      #players .feedlabel-good {
          width: 55%;
          height: 55%;
          left: 23.1%;
          top: 52%;
      }

      #players .feedlabel-perfect {
          width: 100%;
          height: 100%;
          top: 42%;
      }

      #players .feedlabel-yeah {
          width: 100%;
          height: 100%;
          left: -3%;
          top: 18%;
      }
      @keyframes NewFeedback2 {
          0% {
              opacity: 1;
              -webkit-filter: brightness(350%);
              filter: brightness(350%);
              -webkit-transform: scale(0.7);
              transform: scale(0.7);
          }
          70% {
              opacity: .3;
              -webkit-filter: brightness(150%);
              filter: brightness(150%);
          }
          100% {
              opacity: 0;
              -webkit-transform: scale(1.02);
              transform: scale(1.02);
              -webkit-filter: brightness(100%);
              filter: brightness(100%);
          }
      }
      @keyframes NewFeedback5 {
          0% {
              opacity: 1;
              -webkit-filter: brightness(150%);
              filter: brightness(150%);
              -webkit-transform: scale(0.7);
              transform: scale(0.7);
          }
          100% {
              opacity: 0;
              -webkit-transform: scale(1.02);
              transform: scale(1.02);
              -webkit-filter: brightness(100%);
              filter: brightness(100%);
          }
      }
      @keyframes NewFeedback {
          0% {
              opacity: 1;
              -webkit-filter: brightness(160%);
              filter: brightness(160%);
              -webkit-transform: scale(1.0);
              transform: scale(1.0);
          }

          100% {
              opacity: 0;
              -webkit-transform: scale(1.2);
              transform: scale(1.2);
              -webkit-filter: brightness(100%);
              filter: brightness(100%);
          }
      }
      @keyframes NewFeedback4 {
          0% {
              opacity: .5;
              transform: translateY(0%) translateX(0%);
          }

          20% {
              opacity: .3;
              transform: translateY(0%) translateX(-0%) scale(1.0);
          }
          50% {
              opacity: .9;
              transform: translateY(18%) translateX(-0%) scale(1.2);
          }

          100% {
              opacity: 0;

              transform: translateY(15%) translateX(5%) scale(1.2);
          }
      }
      @keyframes feedback {
          0% {
              opacity: 0;
              transform: scale3d(0.2, 1.2, 0.96)
          }
          10% {
              opacity: 1;
              -webkit-transform: scale3d(1, 1.2, 1);
              transform: scale3d(1.2, 1.2, 1)
          }
          100% {
              opacity: 0;
              -webkit-transform: scale3d(1, 1.2, 1);
              transform: scale3d(1, 1.2, 0.96)
          }
      }

      @keyframes feedlabelP {
          0% {
              opacity: 0;
              -webkit-transform: scale3d(1, 1, 1);
              transform: scale3d(1, 1, 1)
          }
          15% {
              opacity: 1;
              -webkit-transform: scale3d(0.8, 0.8, 1);
              transform: scale3d(1.2, 1.2, 1.2)
          }
          24% {
              -webkit-transform: scale3d(1, 1, 1);
              transform: scale3d(1, 1, 1)
          }

          30% {
              opacity: 1;
              -webkit-transform: scale3d(0.8, 0.8, 1);
              transform: scale3d(1.1, 1.1, 1.1)
          }

          43% {
              opacity: 1;
              -webkit-transform: translate3d(0, 0, 0);
              transform: translate3d(0, 0, 0)
          }
          100% {
              opacity: 0;
              -webkit-transform: translate3d(0, 5px, 0) scale3d(0.95, 0.95, 1);
              transform: translate3d(0, 0, 0) scale3d(0.95, 0.95, 1)
          }
      }
      @keyframes feedlabel {
          0% {
              opacity: 0;
              -webkit-transform: scale3d(1, 1, 1);
              transform: scale3d(1, 1, 1)
          }
          15% {
              opacity: 1;
              -webkit-transform: scale3d(0.8, 0.8, 1);
              transform: scale3d(1.2, 1.2, 1.2)
          }
          26% {
              -webkit-transform: scale3d(1.1, 1.1, 1.1);
              transform: scale3d(1.1, 1.1, 1.1)
          }
          50% {
              opacity: 1;
          }
          100% {
              opacity: 0;
              -webkit-transform: translate3d(0, 5px, 0) scale3d(0.95, 0.95, 1);
              transform: translate3d(0, 0, 0) scale3d(0.95, 0.95, 1)
          }
      }
          @keyframes feedlabel2 {
          0% {
              opacity: 0;
              -webkit-transform: scale3d(1, 1, 1) rotate(180deg) translateY(-10%);
              transform: scale3d(1, 1, 1)  rotate(180deg) translateY(-10%);
          }
          15% {
              opacity: 1;
              -webkit-transform: scale3d(0.8, 0.8, 1);
              transform: scale3d(1.2, 1.2, 1.2)  rotate(180deg) translateY(-10%);
          } 
          26% {
              -webkit-transform: scale3d(1.1, 1.1, 1.1);
              transform: scale3d(1.1, 1.1, 1.1)  rotate(180deg) translateY(-10%);
          }
          50% {
              opacity: 1;
          }
          100% {
              opacity: 0;
              -webkit-transform: translate3d(0, 5px, 0) scale3d(0.95, 0.95, 1)rotate(180deg) translateY(-10%);
              transform: translate3d(0, 0, 0) scale3d(0.95, 0.95, 1) rotate(180deg)  translateY(-10%)
          }
      }

      /*afterdance*/
      #afterdance::before {
          background-color: #0000;
      }
      #afterdance .avatarFlag {
          width: 0.6rem;
          height: 100%;
          float: left;
          position: relative;
          margin: 0 auto;
      }
      .exit-btn--play-again {
          left: 8.0rem;
      }
      #afterdance .player-content {
          float: left;
          width: 72%;
          height: 0.4rem;
          background: none;
          border-radius: 12px;
          padding: 0.05rem 0.15rem 0.05rem 0.1rem;
          margin: 0.065rem 0 0 -0.03rem;
          position: relative;
      }

      #afterdance .img--afterDance {
          width: .95rem;
          height: 0.9rem;
          top: 4.7rem;
          left: 0rem;
          z-index: 0;
          position: absolute;
          margin: 2% 2% 2% 2%;
      }

      #afterdance .img--afterDance .coach {
          width: 70%;
          height: 70%;
          border-radius: 10%;
      }

      #afterdance .song-info {
          position: absolute;
          color: #212121;
          width: 3rem;
          right: -3rem;
          bottom: 0.5rem;
      }

      #afterdance .players {
          width: 11.5rem;
          right: 40%;
          top: -10%;
          max-height: 100%;
      }
      #afterdance .img--afterDance::before {
          content: "";
          position: absolute;
          display: block;
          top: -4.85rem;
          height: 5.65em;
          left: -0.1rem;
          width: 10.1em;
          transform: scale(1);
          border-radius: 0.05rem;
          z-index: -99999999999 !important;
      }
      #afterdance {
          height: 100%;
          margin: 0 0 0 0;
          padding: 1rem 0.1rem 0.15rem 0.1rem;
          background: #6500ff00
      }
      #afterdance::after {
          content: 'CONGRATULATIONS!';
          transition: opacity 3s linear;
          letter-spacing: -.02rem;
          font-size: 30%;
          text-align: left;
          position: absolute;
          display: block;
          width: 43%;
          left: -2.9%;
          height: 9%;
          top: 4%;
          padding: 1% 2% .9% 8%;
          background: #6500ff00;
          border-radius: 10px;
      }
      exit-btn--continue,
      .exit-btn--continue {
          border-radius: 40px;
          padding: 1% 0% 0% 0%;
          width: 16%;
          height: 7%;
          background: #6500ff!important;
          color: #fff;
      }
      #afterdance .results .player .score.superstar::after,
      #afterdance .results .player .score.megastar::after {
          filter: drop-shadow(1px 1px 1px #000);
          top: .24rem;
          left: 1.92rem;
          transform: scale(1.2);
      }
      .exit-btn--play-again {
          border-radius: 40px;
          padding: 1% 0% 0% 0%;
          width: 16%;
          left: 80%;
          height: 7%;
          bottom: 12%;
          background: #70f!important;
          color: #fff;
      }
      .exit-btn--continue::before,
      .exit-btn--play-again::before {
          display: none;
      }
      #afterdance .color {
          left: -.1%;
          width: 100%;
          height: 0.5rem;
          z-index: -1!important;
          position: absolute;
          text-align: left!important;
          padding: 0 0 0 2%
      }
      #afterdance .player:nth-child(1) .color {
          left: -.1%;
          height: 3.19rem;
      }
      #afterdance .player:nth-child(1) {
          position: absolute;
          width: 2.9rem;
          height: 2rem;
          left: -3.4rem;
      }
      #afterdance .player-solo .player:nth-child(1) {
          position: absolute;
          width: 2.9rem;
          height: 2rem;
          left: 3.2rem;
          top: 0;
      }
      #afterdance .player.player:nth-child(1) .player-content .score {
          font-size: 28%;
          width: 100%;
          height: 100%;
          display: block;
          position: absolute;
          top: 2.7rem!important;
          right: .0rem;
      }
      #afterdance .player:nth-child(1) .player-content {
          width: 100%;
          position: relative;
      }
      #afterdance .player:nth-child(1) .name {
          width: 100%;
          text-align: center;
          font-family: "Just Dance";
      }
      #afterdance .player:nth-child(1) .avatarFlag .avatar-wrapper {
          width: 2rem;
          height: 2rem;
          display: block;
          display: flex;
          margin: 0
      }
      #afterdance .player:nth-child(1) .avatar-wrapper .avatar {
          transform: translate(50%, 25%);
      }
      #afterdance .player {
          position: relative;
      }
      .scrollContainer {
          position: relative;
          width: 6rem;
          right: -3.4rem;
      }
      .scrollArea {
          overflow: hidden;
          height: 3.2rem;
      }
      #afterdance .player-content,
      #afterdance .avatarFlag {
          left: 4%;
      }
      #afterdance .player-content .name {
          color: #fff!important;
      }
      .state-afterdance #coverflow {
          z-index: -20!important;
          position: absolute;
      }
      .state-afterdance #players {
          display: none;
      }
  `;
}
if ((location.hostname === "justdancenow.com" || location.hostname.endsWith(".justdancenow.com"))) {
  css += `
      .ThereforeIAm::after {
          background-image: url(https://vignette.wikia.nocookie.net/justdance/images/1/1e/Thereforeiam_Title.png)
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
