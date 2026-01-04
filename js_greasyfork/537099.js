// ==UserScript==
// @name         GREEN Theme V2.2 :D
// @version      2.2
// @description  treesTheme
// @author       someoneX
// @match        https://*.shellshock.io/*
// @match        https://algebra.best/*
// @match        https://algebra.vip/*
// @match        https://biologyclass.club/*
// @match        https://deadlyegg.com/*
// @match        https://deathegg.world/*
// @match        https://egg.dance/*
// @match        https://eggboy.club/*
// @match        https://eggboy.xyz/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://egghead.institute/*
// @match        https://eggisthenewblack.com/*
// @match        https://eggsarecool.com/*
// @match        https://eggshooter.best/*
// @match        https://geometry.best/*
// @match        https://geometry.monster/*
// @match        https://geometry.pw/*
// @match        https://geometry.report/*
// @match        https://hardboiled.life/*
// @match        https://hardshell.life/*
// @match        https://humanorganising.org/*
// @match        https://mathactivity.xyz/*
// @match        https://mathdrills.info/*
// @match        https://mathdrills.life/*
// @match        https://mathfun.rocks/*
// @match        https://mathgames.world/*
// @match        https://math.international/*
// @match        https://mathlete.fun/*
// @match        https://mathlete.pro/*
// @match        https://overeasy.club/*
// @match        https://scrambled.best/*
// @match        https://scrambled.tech/*
// @match        https://scrambled.today/*
// @match        https://scrambled.us/*
// @match        https://scrambled.world/*
// @match        https://shellsocks.com/*
// @match        https://shellshockers.club/*
// @match        https://shellshockers.site/*
// @match        https://shellshockers.us/*
// @match        https://shellshockers.world/*
// @match        https://shellshockers.xyz/*
// @match        https://softboiled.club/*
// @match        https://urbanegger.com/*
// @match        https://violentegg.club/*
// @match        https://violentegg.fun/*
// @match        https://yolk.best/*
// @match        https://yolk.life/*
// @match        https://yolk.quest/*
// @match        https://yolk.rocks/*
// @match        https://yolk.tech/*
// @match        https://yolk.today/*
// @match        https://zygote.cafe/*
// ==/UserScript==

(function() {
  const css = document.createElement('style');

  document.body.appendChild(css).textContent = `
/*--------------DO NOT EDIT ANYTHING OR IT WILL BE UR PROBLEM--------------------------------------------------*/

    :root {

    --ss-yolk0: #f1c59a;
    --ss-yolk: #147e38;
    --ss-yolk2: #0c2415;
    --ss-red0: #e29092;
    --ss-red: #d15354;
    --ss-red2: #801919;
    --ss-egg-org: #EE2524;
    --ss-red-bright: #EF3C39;
    --ss-pink: #EC008C;
    --ss-pink1: #b9006e;
    --ss-pink-light: #ff3aaf;
    --ss-pink-dark: #a7098c;
    --ss-brown: #0c2415;
    --ss-blue00: #147e38;
    --ss-blue0: #c8edf8;
    --ss-blue1: #0c2415;
    --ss-blue2: #5ebbd900;
    --ss-blue3: #147e38;
    --ss-blue4: #0c2415;
    --ss-blue5: #0c2415;
    --ss-blue6: #76d399;
    --ss-blue7: #76d399;
    --ss-blue8: #147e38;
    --ss-green0: #87ddbb;
    --ss-green1: #76d39900;
    --ss-green2: #046306;
    --ss-box-shadow-2: .15em .15em 0 rgb(12 36 21 / 90%);
    --ss-box-shadow-1:;
    }
    		:root {
			--ss-lightoverlay: url('https://github.com/Amrzzy9/assets/blob/main/imgs/fr-green.jpg?raw=true');
			--ss-popupbackground: url('https://github.com/Amrzzy9/assets/blob/main/imgs/fr-green.jpg?raw=true');
			--ss-me-player-bg: linear-gradient(90deg, #21D566, #115127);
    }

    .main-menu-button svg path:nth-child(1) {
    fill: #147e38 !important;
    }

    .media-item p {
    line-height: 1.3em;
    margin: 0;
    font-size: .78em;
    font-weight: 730;
    }

    .label {
    color: #76d399;
    }

    .media-item {
    color: #147e38;
    }



.egg_icon {
    transform: translate(-1.3px, -.7px);
    content: url(https://i.ibb.co/rG6YXkj4/ezgif-85ee674d73d880.gif);
    scale: 1.5;
    margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
    }

    .ss_smtab {
    color: #147e38;
    background: #0c2415;
    }
    #equip_grid .grid-item:not(.morestuff) {
    background: #0c241580;
    border: var(--ss-common-border-width) solid #0000009c;
    }


    .chw-circular-timer-container-shadow {
      background: rgb(20 126 56);
    }

    #ico-checkmark path {
        fill: #X !important;
    }
        .player-challenges-container {
        width: X%;
        background: rgba(91, 170, 121, 1);
    }

		.is-paused .gameCanvas {
			border-color: #000000;
	}
     .is-paused .pause-ui-element {
    background-color: #147e3847;
    border: var(--ss-common-border-width) solid #0c241582;
    }


        .free-games-logo {
        display: none;
    }
        .free-games-title {
        line-height: 10;
        display: none;
    }

           #maskmiddle {
			background: url('https://i.ibb.co/XXcPZBd/treescope.png') center center no-repeat;
			background-size: contain;
       }
       		.crosshair.normal {
			border: #00C000;
			background: #00C000;
		}

		/* shotty crosshair */
		.shotReticle.border.normal {
			border-color: #00C000;
			border-left: solid transparent !important;
			border-right: solid transparent !important;
		}

		.shotReticle.border.powerful {
			border-color: #ff0000;
			border-left: solid transparent;
			border-right: solid transparent;
		}

		.shotReticle.fill.normal {
			border-color: #00C000;
			border-left: solid transparent !important;
			border-right: solid transparent !important;
		}

		/* hp */
		#healthContainer {
			display: inline-block !important;
		}

		.healthYolk {
			fill: #00C000;
		}

		/* nade range indictor */
		#grenadeThrowContainer {
			background: #ffffff;
		}

		#grenadeThrow {
			background: linear-gradient(0deg, rgba(33, 213, 102, 1), rgba(17, 81, 39, 1)); //*rgba(196, 30, 58, 1), rgba(136, 8, 8, 1), rgba(136, 8, 8, 1), rgba(136, 8, 8, 1), rgba(136, 8, 8, 1), rgba(136, 8, 8, 1), rgba(136, 8, 8, 1));*//
		}


  `;
})();