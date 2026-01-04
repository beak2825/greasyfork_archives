// ==UserScript==
// @name         MasonOhioSchools.Schoology Style customizer!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Customizes Mason Ohio Schools Schoology website to your tastes using custom CSS!
// @author       You
// @match        https://masonohioschools.schoology.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/416740/MasonOhioSchoolsSchoology%20Style%20customizer%21.user.js
// @updateURL https://update.greasyfork.org/scripts/416740/MasonOhioSchoolsSchoology%20Style%20customizer%21.meta.js
// ==/UserScript==


//Hey everyone! This script is meant to change styles and images on masonohioschools.schoology.com to be as terrible as possible.
(function() {
    'use strict';
    //The styles
    GM_addStyle(`

		* { /* EVERYTHING */
			font-family: "Comic Sans MS", "Comic Sans", cursive !important;
			font-size: 40px; /*not important for that terrible look */
			background-color: inherit !important;
		}
		body { /*the body */
			background-color: #f52525 !important;
		}

		span { /* span tags */

		}

		#wrapper { /*the main content outer */
			background-color: #63f2ff !important;
		}
		#main-inner { /* inner main content */
			background-color: #abcdef !important;
		}
		header { /*the navbar */
			background-color: #25f536 !important;
		}

		._1SIMq._2kpZl._3OAXJ { /* the individual buttons on navbar */
			background-color: #fcba03 !important;
			border-radius: 30px !important;
		}
		._2JX1Q._1LY8n._2SVA_ { /* The mason ohio schools image on navbar*/
			background-image: none !important;
			background-color: #25f536 !important;
		}

		.Card-card-image-uV6Bu { /* the course images on the course tab */
			background-image: url("https://bloximages.chicago2.vip.townnews.com/siouxcityjournal.com/content/tncms/assets/v3/editorial/d/88/d88d97b0-6c3a-11e0-8939-001cc4c002e0/4db0662597782.image.jpg") !important;
		}

		._1tpub { /*the class for display: flex */
			display: flex !important;
		}

		ul { /* unordered lists */
			display: flex !important;
		}
	`);
    //The things you cant change with CSS(images and stuff)
    window.onload = function() {
		//replaces all images with trump by iterating through each one and changing the src attribute manually
		var imgs = document.querySelectorAll("img");
		imgs.forEach(function(val){
			val.src = "https://bloximages.chicago2.vip.townnews.com/siouxcityjournal.com/content/tncms/assets/v3/editorial/d/88/d88d97b0-6c3a-11e0-8939-001cc4c002e0/4db0662597782.image.jpg";
		});
    }
})();