// ==UserScript==
// @name PH | Excluded Usernames 2 CSS
// @namespace https://greasyfork.org/en/users/759797-lego-savant
// @version 2.7
// @description CSS STYLES
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/473990/PH%20%7C%20Excluded%20Usernames%202%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/473990/PH%20%7C%20Excluded%20Usernames%202%20CSS.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `




@document url-prefix("https://www.pornhub.com/view_video.php") {

.adContainer, .middleVideoAdContainer, .topAdContainter {
    display: none !important;
}

}


@document url-prefix("https://www.pornhub.com/gay/video") {

	.videoBox {
		border-bottom: 2px solid transparent;
		background: rgba(51, 51, 51, 0.8);
	}



    .fave-button {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 40px;
        height: 40px;
        display: block;
        z-index: 100;
        opacity: .5;
    }

    .faveUser {
        fill: unset;
        stroke: #F9DB2B;
        stroke-width: 8;
    }

    .favedUser {
        background: rgba(184, 222, 166, 0.49);
    }

    .favedUser .faveUser {
        fill: #F9DB2B !important;
    }





    .time {
        font-weight: 700;
    }

    .underOne .time {
        color: #904340;
    }
    .superShort .time {
        color: #f2923a;
    }
    .short .time {
        color: #f2c65f;
    }
    .decent .time {
        color: #b9d577;
    }
    .long .time {
        color: #62b7c7;
    }


    .underOne {
        border-bottom-color: #904340 !important;
    }
    .superShort {
        border-bottom-color: #f2923a !important;
    }
    .short {
        border-bottom-color: #f2c65f !important;
    }
    .decent {
        border-bottom-color: #b9d577 !important;
    }
    .long {
        border-bottom-color: #62b7c7 !important;
    }




}`;
if (location.href.startsWith("https://www.pornhub.com/view_video.php")) {
  css += `

  .adContainer, .middleVideoAdContainer, .topAdContainter {
      display: none !important;
  }

  `;
}
if (location.href.startsWith("https://www.pornhub.com/gay/video")) {
		css += `

			.videoBox {
				border-bottom: 2px solid transparent;
				background: rgba(51, 51, 51, 0.8);
			}



		    .fave-button {
		        position: absolute;
		        bottom: 0;
		        right: 0;
		        width: 40px;
		        height: 40px;
		        display: block;
		        z-index: 100;
		        opacity: .5;
		    }

		    .faveUser {
		        fill: unset;
		        stroke: #F9DB2B;
		        stroke-width: 8;
		    }

		    .favedUser {
		        background: rgba(184, 222, 166, 0.49);
		    }

		    .favedUser .faveUser {
		        fill: #F9DB2B !important;
		    }





		    .time {
		        font-weight: 700;
		    }

		    .underOne .time {
		        color: #904340;
		    }
		    .superShort .time {
		        color: #f2923a;
		    }
		    .short .time {
		        color: #f2c65f;
		    }
		    .decent .time {
		        color: #b9d577;
		    }
		    .long .time {
		        color: #62b7c7;
		    }


		    .underOne {
		        border-bottom-color: #904340 !important;
		    }
		    .superShort {
		        border-bottom-color: #f2923a !important;
		    }
		    .short {
		        border-bottom-color: #f2c65f !important;
		    }
		    .decent {
		        border-bottom-color: #b9d577 !important;
		    }
		    .long {
		        border-bottom-color: #62b7c7 !important;
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
