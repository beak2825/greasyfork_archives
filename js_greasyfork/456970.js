// ==UserScript==
// @name         ANLogoS (AniList Dynamic Colored Logos)
// @namespace    http://tampermonkey.net/
// @website      https://animetopbtns.github.io/website/ANLogoS/
// @version      1.0
// @description  Changes the color of the AniList logo to match profile themes
// @author       WhiteTapeti
// @match        *://*.anilist.co/*
// @icon         https://github.com/animeTopBtns/AniList-dynamic-colored-Logo/blob/main/logox128.gif?raw=true
// @license      MIT
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/456970/ANLogoS%20%28AniList%20Dynamic%20Colored%20Logos%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456970/ANLogoS%20%28AniList%20Dynamic%20Colored%20Logos%29.meta.js
// ==/UserScript==

var ANLogoS = `<svg id="data-v-62eacfff" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" width="50" height="50" viewBox="0 0 172 172"><style xmlns="">
		.characters:not(.mal) &gt; .grid-wrap.mal,
		.characters.mal &gt; .grid-wrap:not(.mal),
		#toggleCharacters {
			display: none;
		}
		.characters.mal #toggleCharacters {
			display: block;
		}
		.hide:not(#nav) {
			display: none !important;
		}
		.toggle {
			border-radius: 3px;
			background: rgb(var(--color-foreground));
			font-size: 1.2rem;
			padding: 3px 6px;
			margin-left: 5px;
		}
		.characters .link,
		.staff .link {
			pointer-events: none;
			cursor: initial !important;
		}
		.characters .link .toggle {
			cursor: pointer;
		}
		.characters .link *,
		.staff .link * {
			pointer-events: all;
		}
		.view-switcher {
			float: right;
		}
		.view-switcher span:hover {
			cursor: pointer;
		}
		.view-switcher span.active {
			color: rgb(var(--color-blue))
		}
		.mal-anilist-link {
			margin-left: 1em;
		}
		.user-social {
			grid-template-columns: 180px auto !important;
		}
	</style>
  <defs>
    <style>
      .ANLogoS-1, .ANLogoS-2 {
        fill-rule: evenodd;
      }

      .ANLogoS-2 {
        fill: #fefefe;
      }
    </style>
  </defs>
  <g>
    <path fill="#3db4f2" d="M111.322,111.157 L111.322,41.029 C111.322,37.010 109.105,34.792 105.086,34.792 L91.365,34.792 C87.346,34.792 85.128,37.010 85.128,41.029 C85.128,41.029 85.128,56.337 85.128,74.333 C85.128,75.271 94.165,79.626 94.401,80.547 C101.286,107.449 95.897,128.980 89.370,129.985 C100.042,130.513 101.216,135.644 93.267,132.138 C94.483,117.784 99.228,117.812 112.869,131.610 C112.986,131.729 115.666,137.351 115.833,137.351 C131.170,137.351 148.050,137.351 148.050,137.351 C152.069,137.351 154.286,135.134 154.286,131.115 L154.286,117.394 C154.286,113.375 152.069,111.157 148.050,111.157 L111.322,111.157 Z" class="ANLogoS-1"/>
    <path d="M54.365,34.792 L18.331,137.351 L46.327,137.351 L52.425,119.611 L82.915,119.611 L88.875,137.351 L116.732,137.351 L80.836,34.792 L54.365,34.792 ZM58.800,96.882 L67.531,68.470 L77.094,96.882 L58.800,96.882 Z" class="ANLogoS-2"/>
  </g>
<style xmlns="http://www.w3.org/1999/xhtml" id="lb3zn0uo.n7">a.external-link.VRV {background-color: #fd0;color: #1B1A26;} a.external-link.VRV:hover {color: #1B1A26;}</style><style xmlns="">.site-theme-dark .nextStream img,
.entry-card .nextStream img,
.site-theme-dark .resumeStream img,
.entry-card .resumeStream img {
  filter: invert(100%);
}
.entry-card .mal-sync-stream {
  position: absolute;
  max-height: 17px !important;
  left: 7px;
  top: -17px;
  background: rgb(var(--color-overlay) 0.8);
  border-radius: 100% 100% 0 0;
}
.entry-card .mal-sync-stream img {
  padding: 5px;
  padding-top: 7px;
}
.entry-card .nextStream,
.entry-card .resumeStream {
  position: absolute;
  max-height: 17px !important;
  right: 7px;
  top: -15px;
  margin-right: 0 !important;
  background: rgb(var(--color-overlay) 0.8);
  border-radius: 100% 100% 0 0;
}
.entry-card .nextStream img,
.entry-card .resumeStream img {
  margin: 5px;
  margin-top: 7px;
}
.mal-sync-ep-pre {
  display: inline-block;
  width: 0;
}

/*# sourceURL=webpack://./src/anilist/style.less */
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hbmlsaXN0L3N0eWxlLmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7RUFJSSxvQkFBQTtBQUNKO0FBR0E7RUFFSSxrQkFBQTtFQUNBLDJCQUFBO0VBQ0EsU0FBQTtFQUNBLFVBQUE7RUFDQSx5Q0FBQTtFQUNBLDRCQUFBO0FBRko7QUFMQTtFQVNNLFlBQUE7RUFDQSxnQkFBQTtBQUROO0FBVEE7O0VBZUksa0JBQUE7RUFDQSwyQkFBQTtFQUNBLFVBQUE7RUFDQSxVQUFBO0VBQ0EsMEJBQUE7RUFDQSx5Q0FBQTtFQUNBLDRCQUFBO0FBRko7QUFuQkE7O0VBdUJNLFdBQUE7RUFDQSxlQUFBO0FBQU47QUFLQTtFQUNFLHFCQUFBO0VBQ0EsUUFBQTtBQUhGIiwic291cmNlc0NvbnRlbnQiOlsiLnNpdGUtdGhlbWUtZGFyayxcbi5lbnRyeS1jYXJkIHtcbiAgLm5leHRTdHJlYW0gaW1nLFxuICAucmVzdW1lU3RyZWFtIGltZyB7XG4gICAgZmlsdGVyOiBpbnZlcnQoMTAwJSk7XG4gIH1cbn1cblxuLmVudHJ5LWNhcmQge1xuICAubWFsLXN5bmMtc3RyZWFtIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbWF4LWhlaWdodDogMTdweCAhaW1wb3J0YW50O1xuICAgIGxlZnQ6IDdweDtcbiAgICB0b3A6IC0xN3B4O1xuICAgIGJhY2tncm91bmQ6IHJnYih2YXIoLS1jb2xvci1vdmVybGF5KSAwLjgpO1xuICAgIGJvcmRlci1yYWRpdXM6IDEwMCUgMTAwJSAwIDA7XG4gICAgaW1nIHtcbiAgICAgIHBhZGRpbmc6IDVweDtcbiAgICAgIHBhZGRpbmctdG9wOiA3cHg7XG4gICAgfVxuICB9XG4gIC5uZXh0U3RyZWFtLFxuICAucmVzdW1lU3RyZWFtIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbWF4LWhlaWdodDogMTdweCAhaW1wb3J0YW50O1xuICAgIHJpZ2h0OiA3cHg7XG4gICAgdG9wOiAtMTVweDtcbiAgICBtYXJnaW4tcmlnaHQ6IDAgIWltcG9ydGFudDtcbiAgICBiYWNrZ3JvdW5kOiByZ2IodmFyKC0tY29sb3Itb3ZlcmxheSkgMC44KTtcbiAgICBib3JkZXItcmFkaXVzOiAxMDAlIDEwMCUgMCAwO1xuICAgIGltZyB7XG4gICAgICBtYXJnaW46IDVweDtcbiAgICAgIG1hcmdpbi10b3A6IDdweDtcbiAgICB9XG4gIH1cbn1cblxuLm1hbC1zeW5jLWVwLXByZSB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgd2lkdGg6IDA7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */</style></svg>`

$("body").append(
  function ChangeEvC() {
    if (window.location.href.indexOf('https://anilist.co/user/') == 0) {
      $(document).ready(function () {
        if ($("img[data-v-62eacfff]").length == true) {
          $('img[data-v-62eacfff]').replaceWith(ANLogoS)
          $('.ANLogoS-1').css({
            fill: 'rgb(' + $('.user-page-unscoped').css('--color-blue') + ')',
          });
          return;
        }
      });
    }
    $(document).ready(function () {
      $('img[data-v-62eacfff]').replaceWith(ANLogoS)
      console.log("d1");
      $(document).click(function () {
        console.log("d2-1");
        if (window.location.href.indexOf('https://anilist.co/user/') == 0) {
          $(".content .container").ready(function () {
            console.log("d2-2");
            $('.ANLogoS-1').css({
              fill: 'rgb(' + $('.user-page-unscoped').css('--color-blue') + ')',
            });
          });
        } else if (window.location.href.indexOf('https://anilist.co/') == 0) {
          console.log("d1-2");
          $('.ANLogoS-1').css({
            fill: '#3db4f2',
          });
        }
      });
    });
    window.addEventListener('popstate', (event) => {
      if (window.location.href.indexOf('https://anilist.co/user/') == 0) {
        $(".content .container").ready(function () {
          console.log("d2-2");
          $('.ANLogoS-1').css({
            fill: 'rgb(' + $('.user-page-unscoped').css('--color-blue') + ')',
          });
        });
      } else if (window.location.href.indexOf('https://anilist.co/') == 0) {
        console.log("d1-2");
        $('.ANLogoS-1').css({
          fill: '#3db4f2',
        });
      }
    });
  }
);
