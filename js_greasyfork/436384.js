// ==UserScript==
// @name Just Dance Nowastic (Beta Unfinished)
// @namespace https://greasyfork.org/users/774017
// @version 0.1.2021.12.1
// @description Who Loves Just Dance Old Gens?
// @author Pakar
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/436384/Just%20Dance%20Nowastic%20%28Beta%20Unfinished%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436384/Just%20Dance%20Nowastic%20%28Beta%20Unfinished%29.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `@-moz-document domain("justdancenow.com") {


.coverflow--container,
#players::before,
ul.tabs li.selected::before, #afterdance::before, .coach-selection::after, #room-info, .room-info__patch, .room-info__patch::before, .room-info__patch::after{
    background: #0000;
    box-shadow: 0px 6px 12px #908f8f00;
    font-family: 'Just Dance Regular';
}
#coverflow, #afterdance, #just-dance-now {
    background-image: linear-gradient(180deg, rgb(64, 0, 255) 10%, rgb(152, 0, 255) 100%);
    ;
    background-position: center;
    background-size: cover;
}

.grid-container .item-container .item.item-selected .song__cover{
    border: 6px solid #fff;
    padding: 0%;
        -webkit-animation: hotala 1s infinite !important;
    animation: hotala 1s infinite !important;
}
.coverflow--container{
    width: calc(104.3% - 0.0rem);
   top: -106%;
   left: -2.6%;
    transform: scale(1.0);
   padding: none;
    margin: none;
}
#section-tabs {
    bottom: -65%;
    z-index: 1;
}
.playlist-grid{
    left: 8.3%!important
}
#afterdance {
    height: 100%;
    padding: 1.12rem 0.15rem 0.1rem;
    margin: 0;
    position: relative;
    background-repeat: no-repeat;
}
#afterdance.transition-in .coach {
    -webkit-mask-image: radial-gradient(#ffffffa1 9%, #0000 70%);
        -webkit-animation: fadeIne 80s infinite, hota 1.6s infinite !important;
    animation: fadeIne 80s alternate infinite, hota 1.6s infinite !important;
    height: 126%;
    width: 126%;
    opacity: .5;
    top: -23%
}
#afterdance .img--afterDance {
    -webkit-transform: none;
    -ms-transform: none;
    transform: none;
    width: 3.2rem;
    height: 3rem;
    position: absolute;
    top: 1.0rem;
}
.exit-btn--play-again {
    left: 7.5rem;
}
.item-container
{
    width: 50000% !important;
    height: 100% !important;
    transition: none !important;
    background-image: linear-gradient(180deg, rgb(255, 255, 255) 7%, rgb(236, 236, 236) 100%);
    background-size: 100% .6%;
    background-repeat: no-repeat;
    background-position: 0% 32.2%
}
#section-songlist .item-container
{
    width: 50000% !important;
    height: 100% !important;
    transition: none !important;
    background-image: linear-gradient(180deg, rgb(255, 255, 255) 7%, rgb(236, 236, 236) 100%);
    background-size: 100% .6%;
    background-repeat: no-repeat;
    background-position: 0% 31%
}
.grid-container {
    width: 100%;
    height: 158%;
    overflow: hidden;
    position: relative;
}
.grid-container .item-container .item {
    top: 5%;
    width: 1.9rem;
    height: 2rem;
}
.grid-container .item-container .song__decoration {
    height: 78%;
    width: 78%;
    left: 12%;
    
}

.coach-selection__bgImg {
    -webkit-mask-image: radial-gradient(#ffffffa1 9%, #0000 70%);
        -webkit-animation: fadeIne 80s infinite, hota 1s infinite !important;
    animation: fadeIne 80s alternate infinite, hota 1s infinite !important;
    height: 126%;
    width: 100%;
    opacity: .5;
    top: -23%
}
.title-container .caption {
    width: 150%;
    top: -7%;
}
.songGrid .song-grid--details, .song-grid--details, .danceroom__qr-code-wrapper, html.ftue ul.tabs::after, .controller .dancercard .player-master, .dancercard .player-flag, .dancercard .player-exp.player-exp-normal, #preview .menu-splash.hidden, .info-panel, .highscore-display, .song-action, #preview .song-details, .video-preview, #preview .right-pane, .song-cover--low-res, .item .title-container .caption.artist,.state-dance .connect-phone-info__text , .state-dance #room-info, .state-dance .toggle{
    display: none;
}

.item-selected .title-container .caption.artist{
    display: block;
}
.playlist-img-container, .section-grid-trainer {
    display: none!important;

}
#preview{
    z-index: -1!important;
}
#preview.pre-beat.even .song-cover--hi-res {
    -webkit-animation: hota 1s ;
    animation: hota 1s ;
}
#preview.pre-beat.odd .song-cover--hi-res {
    -webkit-animation: hoti 1s ;
    animation: hoti 1s ;
}
.song-cover--hi-res {
    -webkit-mask-image: radial-gradient(#ffffff5c 0%, #0000 70%);
    width: 200%;
    height: 200%;
    right: 126%;
    bottom: -67%
}
.grid-container .item-container .item {
   
}
.grid-container .item-container .item-selected {
    background: radial-gradient(#b3c9ee 0%, #0000 72%);
    background-position: -10% 0%;
    transition: .2s all !important;
   
}
.grid-container .item-container .item-selected  .title-container {
    text-align: center!important;
    font-family: Just Dance!important;
    color: #fff;
    transform: scale(1.19) translateY(7%) translateX(14%);
}
.grid-container .item-container .item  .title-container {
    color: #fff;
}
.title-container .caption {
font-family: Just Dance Regular!important;
}
.item-selected .title-container .caption.title {
font-family: Just Dance!important;
    font-size: 100%;
    transform: scale(1.4)
}
.grid-container .item-container .item-selected .song__decoration{
    transform: scale(1.16);
    top: 1%;
    transform-origin: bottom;
    -webkit-animation: Vave 2s infinite;
    animation: Vave 2s infinite;
}
.song--details {
    margin-top: 1rem;

}
.song-preview{
    border-radius: 8px;
    -webkit-animation: fadeIne 30s infinite;
    animation: fadeIne 30s infinite;
}






html:not(.weak-platform) #racetrack .star[data-visible="true"] {
    
}


#room-info {
    width: 22%;
    height: auto;
    min-height: 0.965rem;
    transition: all 0.4s;
    background: #fff0;
    position: absolute;
    z-index: 1001;
    top: 0;
    left: 0;
}

#players .feedback-perfect::after {


}
.picto
{
  left: -3.2%;
    z-index: -1;
}

.multi-coach .picto
{
  left: -10.1%;
}
#beat
{
  width: 32.2%;
}
.multi-coach #beat
{
  width: 30.4%;
    background-size: 110% 100% !important;
}
#racetrack .progress-background {
    background-repeat: no-repeat;
    background-position: 50% 10%;
    background-size: 190% 130%;
}
#lyrics .line.previous {
    -webkit-transform: perspective(0px) translateY(0em) rotateX(0deg);
    transform: perspective(0px) translateY(0em) rotateX(0deg);
}

#lyrics .line.current {
    transform: translatey(0em) translatex(0%);
    transition: .33s all !important
}

#lyrics .line.previous {
    transform: translatey(0em) translatex(0%) !important;
    transition: .33s all !important
}

.hud.beat > #players .player-stars {
    animation: debde 1s
}
.state-dance #players, .hud.beat > .state-dance #players{
    transform: translateY(-70%)!important;
    transition: .4s all!important;
}
.state-dance .hud.beat > #players {
    transform: translateY(0%)!important;
    transition: .4s all!important;
}
.state-dance .hud.beat > #racetrack {
    transform: translateY(0%)!important;
    transition: .4s all!important;
}
.state-dance #racetrack{
    transform: translateX(-110%)!important;
    transition: .4s all!important;
}
.hud.beat > #pictos {
    animation: hPictos 9s!important;
    animation-fill-mode: forwards;
}
.state-dance #pictos {
    
    transition: .1s all!important;
    right: 110%;
}

#racetrack-fill, .racetrack-fill-players {
    background-image: linear-gradient(90deg, #ffffff6b 0%, rgba(152, 0, 255, 0) 70%);
    filter: drop-shadow(0px -0.016rem 0.016rem rgba(255, 255, 255, .71))!important;
    

}
#racetrack .progress-meters {
      display: flex!important;
  justify-content: center!important;
  align-items: center!important;
}

#crown-container {
    top: 23%
}
#lyrics .line {
    -webkit-animation: nextLineInf 0.3s;
    animation: nextLineInf 0.3s;
    color: #8f8c89;
}

@-webkit-keyframes nextLineInf {
    0%,
    20% {
        opacity: 0;
        -webkit-transform: perspective(0px) translateY(1em) rotateX(0deg);
        transform: perspective(0px) translateY(1em) rotateX(0deg);
    }
    100% {
        opacity: 1;
        -webkit-transform: translateY(1em) perspective(0px) rotateX(0deg);
        transform: translateY(1em) perspective(0px) rotateX(0deg);
    }
}
@-webkit-keyframes fadeIna {
    0%{
        transform: translateX(-100%)
    }
    100% {
        transform: translateX(100%)
    }
}
@-webkit-keyframes fadeIne {
    100%{
        right: -50%
    }
    0% {
        right: 50%
    }
}
@-webkit-keyframes debde {
    0%{
        transform: scale(1.)
    }
    50% {
        transform: scale(.9)
    }
    100% {
        transform: scale(.9)
    }
}

@keyframes nextLineInf {
    0%,
    20% {
        opacity: 0;
        -webkit-transform: perspective(0px) translateY(1em) rotateX(0deg) translatex(0em);
        transform: perspective(0px) translateY(1em) rotateX(0deg) translatex(0em);
    }
    100% {
        opacity: 1;
        -webkit-transform: translateY(1em) perspective(0px) rotateX(0deg) translatex(0em);
        transform: translateY(1em) perspective(0px) rotateX(0deg) translatex(0em);
    }
}
@-webkit-keyframes hota {
    100% {
        transform: scale(1.0);
        filter: brightness(100%)
    }
    30% {
        transform: scale(1.0);
        filter: brightness(100%);
    }
    0% {
        transform: scale(.97);
        filter: brightness(160%)
            
    }
}
@-webkit-keyframes hoti {
        100% {
        filter: brightness(100%);
        transform: scale(1)
    }
    40% {
        filter: brightness(100%);
        transform: scale(1)
    }
    1% {
        transform: scale(1.08);
        filter: brightness(290%)
    }
    0% {
        filter: brightness(100%);
        transform: scale(1)
            
    }
}
@keyframes hPictos {
        100% {
    right: 110%;
    }
    99% {
        right: 0;
    }
    0% {
        right: 0%;
            
    }
}
@-webkit-keyframes Vave {
    100% {
        transform: scale(1.2);
        background-size: 105%!important;
        filter: brightness(100%);
    }
    70% {
        transform: scale(1.2);
        filter: brightness(100%);
        background-size: 105%!important
    }
    51% {
        transform: scale(1.17);
        filter: brightness(120%);
        background-size: 105%!important
    }
    50% {
        transform: scale(1.2);
        background-size: 105%!important;
        filter: brightness(100%);
    }
    20% {
        transform: scale(1.2);
        filter: brightness(100%);
        background-size: 105%!important
    }
    0% {
        transform: scale(1.13);
        filter: brightness(190%);
        background-size: 100%!important
            
    }
    
}
@-webkit-keyframes Vave2 {
    100% {
        transform: scale(1.08);
         background-size: 100%!important;
    }
    50% {
        transform: scale(1.13);
        background-size: 110%!important;
    }
    0% {
        transform: scale(1.08);
        background-size: 100%!important
            
    }
    
}








#players .star.star-1, #players .star.star-2, #players .star.star-3, #players .star.star-4, #players .star.star-5 {
    padding: 0 0;
    margin: 0 -0.142rem;
}
#players .star{
    width: 0.3rem;
    height: 0.3rem;
    margin: 0 -0em;
}
.crown {
    top: 27% !important;
    left: 0% !important;
}
#player {
    left: -2%
}
.state-dance #players {
    width: 120% !important;
    left: -2% !important;
    top: -1.5%
}
.dancercard .avatar-wrapper {
    width: 44%;
    position: absolute;
    z-index: 1;
    top: -100%;
    left: 18%;
}
.dancercard .player-name {
    top: -3.5%;
    left: 0% !important;
    width: 95.5% !important;
    text-align: center !important;
    text-shadow: none !important;
    font-family: Just Dance Bold;
    transform: scale(1.6) !important
}

.state-dance .dancercard .player-name {
    background: rgba(255, 255, 255, 0);
    -webkit-mask: linear-gradient(90deg, rgba(255, 255, 255, 0) 22%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 1) 45%, rgba(0, 0, 0, 1) 75%, rgba(255, 255, 255, 0) 84%)!important;
    left: -1%!important;
    bottom: 8%!important;
}
.dancercard .player-name em {
    text-shadow: 0px 0px 1px #000000 !important;
    font-family: Just Dance!important;
    overflow: visible!important;
    text-align: center !important;
}
.dancercard .player-color {
    -webkit-mask-image: linear-gradient(90deg, rgba(0, 221, 255, 0) 0%, rgba(11, 9, 121, .9) 50%, rgba(0, 221, 255, 0) 100%), radial-gradient(#b3c9ee7a 0%, #0000 82%);
    border-radius: 0px;
    width: 71%!important;
    height: 24%;
    top: 40%;
    margin-left: 9.6%;
    left: 4%;
}
#players .player-stars {
    top: 57%;
}

#players .feedback-bad{
     background-image: radial-gradient(at top,#ff00006b 0%, #0000 76%), linear-gradient(180deg, rgba(108, 0, 255, 0) 0%, rgba(152, 0, 255, 0) 60%);
    background-size: 100%, 30% 100%;
    background-position: center
}
#players .feedback-ok{
     background-image: radial-gradient(at top,#7700ff45 0%, #0000 76%), linear-gradient(180deg, rgb(108, 0, 255, .65) 0%, rgba(152, 0, 255, 0) 60%);
    background-size: 100%, 60% 100%;
    background-position: center
}
#players .feedback-good{
     background-image: radial-gradient(at top,#00ffc66e 0%, #0000 76%), linear-gradient(180deg, rgb(0, 244, 240, .65) 0%, rgba(152, 0, 255, 0) 60%);
    background-size: 100%, 60% 100%;
    background-position: center
}
#players .feedback-perfect{
     background-image: radial-gradient(at top,#39ff00b3 0%, #0000 76%), linear-gradient(180deg, rgba(37, 244, 0, .65) 0%, rgba(152, 0, 255, 0) 60%);
    background-size: 100%, 100% 100%;
    background-position: center
    
}
#players .feedback-yeah{
     background-image: radial-gradient(at top,#fff700b3 0%, #0000 76%), linear-gradient(180deg, rgba(250, 255, 0, .65) 0%, rgba(152, 0, 255, 0) 60%);
    background-size: 100%, 100% 100%;
    background-position: center
    
}
@-webkit-keyframes feedlabela {
        0%{
        opacity: 0.3;
        transform: translateY(0%) scale(0.5)
    }
    10%{
        opacity: 1;
        transform: translateY(0%) scale(1.0)
    }
    100% {
        opacity: 0;
        transform: translateY(10%) scale(1.0)
    }
}
@-webkit-keyframes feedbeka {
    0%{
        opacity: 0.5;
        transform: translateY(-9%)
    }
    10%{
        opacity: 1;
        transform: translateY(0%)
    }
    100% {
        opacity: 0.2;
        transform: translateY(-9%)
    }
}
.hud.beat #players.animate .feedback {
    -webkit-animation: feedbeka .8s;
    animation: feedbeka .8s;
}
.hud.beat #players.animate .feedback-label {
    -webkit-animation: feedlabela .8s;
    animation: feedlabela .8s;
}
}`;
if ((location.hostname === "justdancenow.com" || location.hostname.endsWith(".justdancenow.com"))) {
  css += `


  .coverflow--container,
  #players::before,
  ul.tabs li.selected::before, #afterdance::before, .coach-selection::after, #room-info, .room-info__patch, .room-info__patch::before, .room-info__patch::after{
      background: #0000;
      box-shadow: 0px 6px 12px #908f8f00;
      font-family: 'Just Dance Regular';
  }
  #coverflow, #afterdance, #just-dance-now {
      background-image: linear-gradient(180deg, rgb(64, 0, 255) 10%, rgb(152, 0, 255) 100%);
      ;
      background-position: center;
      background-size: cover;
  }

  .grid-container .item-container .item.item-selected .song__cover{
      border: 6px solid #fff;
      padding: 0%;
          -webkit-animation: hotala 1s infinite !important;
      animation: hotala 1s infinite !important;
  }
  .coverflow--container{
      width: calc(104.3% - 0.0rem);
     top: -106%;
     left: -2.6%;
      transform: scale(1.0);
     padding: none;
      margin: none;
  }
  #section-tabs {
      bottom: -65%;
      z-index: 1;
  }
  .playlist-grid{
      left: 8.3%!important
  }
  #afterdance {
      height: 100%;
      padding: 1.12rem 0.15rem 0.1rem;
      margin: 0;
      position: relative;
      background-repeat: no-repeat;
  }
  #afterdance.transition-in .coach {
      -webkit-mask-image: radial-gradient(#ffffffa1 9%, #0000 70%);
          -webkit-animation: fadeIne 80s infinite, hota 1.6s infinite !important;
      animation: fadeIne 80s alternate infinite, hota 1.6s infinite !important;
      height: 126%;
      width: 126%;
      opacity: .5;
      top: -23%
  }
  #afterdance .img--afterDance {
      -webkit-transform: none;
      -ms-transform: none;
      transform: none;
      width: 3.2rem;
      height: 3rem;
      position: absolute;
      top: 1.0rem;
  }
  .exit-btn--play-again {
      left: 7.5rem;
  }
  .item-container
  {
      width: 50000% !important;
      height: 100% !important;
      transition: none !important;
      background-image: linear-gradient(180deg, rgb(255, 255, 255) 7%, rgb(236, 236, 236) 100%);
      background-size: 100% .6%;
      background-repeat: no-repeat;
      background-position: 0% 32.2%
  }
  #section-songlist .item-container
  {
      width: 50000% !important;
      height: 100% !important;
      transition: none !important;
      background-image: linear-gradient(180deg, rgb(255, 255, 255) 7%, rgb(236, 236, 236) 100%);
      background-size: 100% .6%;
      background-repeat: no-repeat;
      background-position: 0% 31%
  }
  .grid-container {
      width: 100%;
      height: 158%;
      overflow: hidden;
      position: relative;
  }
  .grid-container .item-container .item {
      top: 5%;
      width: 1.9rem;
      height: 2rem;
  }
  .grid-container .item-container .song__decoration {
      height: 78%;
      width: 78%;
      left: 12%;
      
  }

  .coach-selection__bgImg {
      -webkit-mask-image: radial-gradient(#ffffffa1 9%, #0000 70%);
          -webkit-animation: fadeIne 80s infinite, hota 1s infinite !important;
      animation: fadeIne 80s alternate infinite, hota 1s infinite !important;
      height: 126%;
      width: 100%;
      opacity: .5;
      top: -23%
  }
  .title-container .caption {
      width: 150%;
      top: -7%;
  }
  .songGrid .song-grid--details, .song-grid--details, .danceroom__qr-code-wrapper, html.ftue ul.tabs::after, .controller .dancercard .player-master, .dancercard .player-flag, .dancercard .player-exp.player-exp-normal, #preview .menu-splash.hidden, .info-panel, .highscore-display, .song-action, #preview .song-details, .video-preview, #preview .right-pane, .song-cover--low-res, .item .title-container .caption.artist,.state-dance .connect-phone-info__text , .state-dance #room-info, .state-dance .toggle{
      display: none;
  }

  .item-selected .title-container .caption.artist{
      display: block;
  }
  .playlist-img-container, .section-grid-trainer {
      display: none!important;

  }
  #preview{
      z-index: -1!important;
  }
  #preview.pre-beat.even .song-cover--hi-res {
      -webkit-animation: hota 1s ;
      animation: hota 1s ;
  }
  #preview.pre-beat.odd .song-cover--hi-res {
      -webkit-animation: hoti 1s ;
      animation: hoti 1s ;
  }
  .song-cover--hi-res {
      -webkit-mask-image: radial-gradient(#ffffff5c 0%, #0000 70%);
      width: 200%;
      height: 200%;
      right: 126%;
      bottom: -67%
  }
  .grid-container .item-container .item {
     
  }
  .grid-container .item-container .item-selected {
      background: radial-gradient(#b3c9ee 0%, #0000 72%);
      background-position: -10% 0%;
      transition: .2s all !important;
     
  }
  .grid-container .item-container .item-selected  .title-container {
      text-align: center!important;
      font-family: Just Dance!important;
      color: #fff;
      transform: scale(1.19) translateY(7%) translateX(14%);
  }
  .grid-container .item-container .item  .title-container {
      color: #fff;
  }
  .title-container .caption {
  font-family: Just Dance Regular!important;
  }
  .item-selected .title-container .caption.title {
  font-family: Just Dance!important;
      font-size: 100%;
      transform: scale(1.4)
  }
  .grid-container .item-container .item-selected .song__decoration{
      transform: scale(1.16);
      top: 1%;
      transform-origin: bottom;
      -webkit-animation: Vave 2s infinite;
      animation: Vave 2s infinite;
  }
  .song--details {
      margin-top: 1rem;

  }
  .song-preview{
      border-radius: 8px;
      -webkit-animation: fadeIne 30s infinite;
      animation: fadeIne 30s infinite;
  }






  html:not(.weak-platform) #racetrack .star[data-visible="true"] {
      
  }


  #room-info {
      width: 22%;
      height: auto;
      min-height: 0.965rem;
      transition: all 0.4s;
      background: #fff0;
      position: absolute;
      z-index: 1001;
      top: 0;
      left: 0;
  }

  #players .feedback-perfect::after {


  }
  .picto
  {
    left: -3.2%;
      z-index: -1;
  }

  .multi-coach .picto
  {
    left: -10.1%;
  }
  #beat
  {
    width: 32.2%;
  }
  .multi-coach #beat
  {
    width: 30.4%;
      background-size: 110% 100% !important;
  }
  #racetrack .progress-background {
      background-repeat: no-repeat;
      background-position: 50% 10%;
      background-size: 190% 130%;
  }
  #lyrics .line.previous {
      -webkit-transform: perspective(0px) translateY(0em) rotateX(0deg);
      transform: perspective(0px) translateY(0em) rotateX(0deg);
  }

  #lyrics .line.current {
      transform: translatey(0em) translatex(0%);
      transition: .33s all !important
  }

  #lyrics .line.previous {
      transform: translatey(0em) translatex(0%) !important;
      transition: .33s all !important
  }

  .hud.beat > #players .player-stars {
      animation: debde 1s
  }
  .state-dance #players, .hud.beat > .state-dance #players{
      transform: translateY(-70%)!important;
      transition: .4s all!important;
  }
  .state-dance .hud.beat > #players {
      transform: translateY(0%)!important;
      transition: .4s all!important;
  }
  .state-dance .hud.beat > #racetrack {
      transform: translateY(0%)!important;
      transition: .4s all!important;
  }
  .state-dance #racetrack{
      transform: translateX(-110%)!important;
      transition: .4s all!important;
  }
  .hud.beat > #pictos {
      animation: hPictos 9s!important;
      animation-fill-mode: forwards;
  }
  .state-dance #pictos {
      
      transition: .1s all!important;
      right: 110%;
  }

  #racetrack-fill, .racetrack-fill-players {
      background-image: linear-gradient(90deg, #ffffff6b 0%, rgba(152, 0, 255, 0) 70%);
      filter: drop-shadow(0px -0.016rem 0.016rem rgba(255, 255, 255, .71))!important;
      

  }
  #racetrack .progress-meters {
        display: flex!important;
    justify-content: center!important;
    align-items: center!important;
  }

  #crown-container {
      top: 23%
  }
  #lyrics .line {
      -webkit-animation: nextLineInf 0.3s;
      animation: nextLineInf 0.3s;
      color: #8f8c89;
  }

  @-webkit-keyframes nextLineInf {
      0%,
      20% {
          opacity: 0;
          -webkit-transform: perspective(0px) translateY(1em) rotateX(0deg);
          transform: perspective(0px) translateY(1em) rotateX(0deg);
      }
      100% {
          opacity: 1;
          -webkit-transform: translateY(1em) perspective(0px) rotateX(0deg);
          transform: translateY(1em) perspective(0px) rotateX(0deg);
      }
  }
  @-webkit-keyframes fadeIna {
      0%{
          transform: translateX(-100%)
      }
      100% {
          transform: translateX(100%)
      }
  }
  @-webkit-keyframes fadeIne {
      100%{
          right: -50%
      }
      0% {
          right: 50%
      }
  }
  @-webkit-keyframes debde {
      0%{
          transform: scale(1.)
      }
      50% {
          transform: scale(.9)
      }
      100% {
          transform: scale(.9)
      }
  }

  @keyframes nextLineInf {
      0%,
      20% {
          opacity: 0;
          -webkit-transform: perspective(0px) translateY(1em) rotateX(0deg) translatex(0em);
          transform: perspective(0px) translateY(1em) rotateX(0deg) translatex(0em);
      }
      100% {
          opacity: 1;
          -webkit-transform: translateY(1em) perspective(0px) rotateX(0deg) translatex(0em);
          transform: translateY(1em) perspective(0px) rotateX(0deg) translatex(0em);
      }
  }
  @-webkit-keyframes hota {
      100% {
          transform: scale(1.0);
          filter: brightness(100%)
      }
      30% {
          transform: scale(1.0);
          filter: brightness(100%);
      }
      0% {
          transform: scale(.97);
          filter: brightness(160%)
              
      }
  }
  @-webkit-keyframes hoti {
          100% {
          filter: brightness(100%);
          transform: scale(1)
      }
      40% {
          filter: brightness(100%);
          transform: scale(1)
      }
      1% {
          transform: scale(1.08);
          filter: brightness(290%)
      }
      0% {
          filter: brightness(100%);
          transform: scale(1)
              
      }
  }
  @keyframes hPictos {
          100% {
      right: 110%;
      }
      99% {
          right: 0;
      }
      0% {
          right: 0%;
              
      }
  }
  @-webkit-keyframes Vave {
      100% {
          transform: scale(1.2);
          background-size: 105%!important;
          filter: brightness(100%);
      }
      70% {
          transform: scale(1.2);
          filter: brightness(100%);
          background-size: 105%!important
      }
      51% {
          transform: scale(1.17);
          filter: brightness(120%);
          background-size: 105%!important
      }
      50% {
          transform: scale(1.2);
          background-size: 105%!important;
          filter: brightness(100%);
      }
      20% {
          transform: scale(1.2);
          filter: brightness(100%);
          background-size: 105%!important
      }
      0% {
          transform: scale(1.13);
          filter: brightness(190%);
          background-size: 100%!important
              
      }
      
  }
  @-webkit-keyframes Vave2 {
      100% {
          transform: scale(1.08);
           background-size: 100%!important;
      }
      50% {
          transform: scale(1.13);
          background-size: 110%!important;
      }
      0% {
          transform: scale(1.08);
          background-size: 100%!important
              
      }
      
  }








  #players .star.star-1, #players .star.star-2, #players .star.star-3, #players .star.star-4, #players .star.star-5 {
      padding: 0 0;
      margin: 0 -0.142rem;
  }
  #players .star{
      width: 0.3rem;
      height: 0.3rem;
      margin: 0 -0em;
  }
  .crown {
      top: 27% !important;
      left: 0% !important;
  }
  #player {
      left: -2%
  }
  .state-dance #players {
      width: 120% !important;
      left: -2% !important;
      top: -1.5%
  }
  .dancercard .avatar-wrapper {
      width: 44%;
      position: absolute;
      z-index: 1;
      top: -100%;
      left: 18%;
  }
  .dancercard .player-name {
      top: -3.5%;
      left: 0% !important;
      width: 95.5% !important;
      text-align: center !important;
      text-shadow: none !important;
      font-family: Just Dance Bold;
      transform: scale(1.6) !important
  }

  .state-dance .dancercard .player-name {
      background: rgba(255, 255, 255, 0);
      -webkit-mask: linear-gradient(90deg, rgba(255, 255, 255, 0) 22%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 1) 45%, rgba(0, 0, 0, 1) 75%, rgba(255, 255, 255, 0) 84%)!important;
      left: -1%!important;
      bottom: 8%!important;
  }
  .dancercard .player-name em {
      text-shadow: 0px 0px 1px #000000 !important;
      font-family: Just Dance!important;
      overflow: visible!important;
      text-align: center !important;
  }
  .dancercard .player-color {
      -webkit-mask-image: linear-gradient(90deg, rgba(0, 221, 255, 0) 0%, rgba(11, 9, 121, .9) 50%, rgba(0, 221, 255, 0) 100%), radial-gradient(#b3c9ee7a 0%, #0000 82%);
      border-radius: 0px;
      width: 71%!important;
      height: 24%;
      top: 40%;
      margin-left: 9.6%;
      left: 4%;
  }
  #players .player-stars {
      top: 57%;
  }

  #players .feedback-bad{
       background-image: radial-gradient(at top,#ff00006b 0%, #0000 76%), linear-gradient(180deg, rgba(108, 0, 255, 0) 0%, rgba(152, 0, 255, 0) 60%);
      background-size: 100%, 30% 100%;
      background-position: center
  }
  #players .feedback-ok{
       background-image: radial-gradient(at top,#7700ff45 0%, #0000 76%), linear-gradient(180deg, rgb(108, 0, 255, .65) 0%, rgba(152, 0, 255, 0) 60%);
      background-size: 100%, 60% 100%;
      background-position: center
  }
  #players .feedback-good{
       background-image: radial-gradient(at top,#00ffc66e 0%, #0000 76%), linear-gradient(180deg, rgb(0, 244, 240, .65) 0%, rgba(152, 0, 255, 0) 60%);
      background-size: 100%, 60% 100%;
      background-position: center
  }
  #players .feedback-perfect{
       background-image: radial-gradient(at top,#39ff00b3 0%, #0000 76%), linear-gradient(180deg, rgba(37, 244, 0, .65) 0%, rgba(152, 0, 255, 0) 60%);
      background-size: 100%, 100% 100%;
      background-position: center
      
  }
  #players .feedback-yeah{
       background-image: radial-gradient(at top,#fff700b3 0%, #0000 76%), linear-gradient(180deg, rgba(250, 255, 0, .65) 0%, rgba(152, 0, 255, 0) 60%);
      background-size: 100%, 100% 100%;
      background-position: center
      
  }
  @-webkit-keyframes feedlabela {
          0%{
          opacity: 0.3;
          transform: translateY(0%) scale(0.5)
      }
      10%{
          opacity: 1;
          transform: translateY(0%) scale(1.0)
      }
      100% {
          opacity: 0;
          transform: translateY(10%) scale(1.0)
      }
  }
  @-webkit-keyframes feedbeka {
      0%{
          opacity: 0.5;
          transform: translateY(-9%)
      }
      10%{
          opacity: 1;
          transform: translateY(0%)
      }
      100% {
          opacity: 0.2;
          transform: translateY(-9%)
      }
  }
  .hud.beat #players.animate .feedback {
      -webkit-animation: feedbeka .8s;
      animation: feedbeka .8s;
  }
  .hud.beat #players.animate .feedback-label {
      -webkit-animation: feedlabela .8s;
      animation: feedlabela .8s;
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
