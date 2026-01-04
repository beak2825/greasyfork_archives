// ==UserScript==
// @name        Wikiwand Enhancer
// @namespace   https://greasyfork.org/en/users/830433-vintprox
// @description Userscript that fixes the five-minute shit that Wikiwand couldn't fix on its website. Seriously, just don't sit on Wikiwand, it's that terrible.
// @version     1.0
// @icon        https://wikiwand-19431.kxcdn.com/img/wikiwand_icon_apple.png
// @license     WTFPL
// @homepageURL https://addons.mozilla.org/en-US/firefox/addon/modern-for-wikipedia/
// @author      vintprox
// @match       https://*wikiwand.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/443948/Wikiwand%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/443948/Wikiwand%20Enhancer.meta.js
// ==/UserScript==

(function() {
  const style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(`
    /* Was it so hard to not mess up the dark theme? */
    body.dark #main_menu {
      background-color: #615a5f80;
    }
    body.dark #main_menu.navbar_opaque {
      background-color: #615a5f;
    }

    /* Uncalled branding. */
    #main_menu > li.article_btn {
      display: none;
    }

    /* Do you want to "upgrade" your plan? But seriously, what a dull naming. It seems as if they just took someone else's template and stretched a wikipedia on it!
    Also, you don't really want this annoying button. */
    #main_menu > li.upgrade_btn,
    #main_menu .menu_line {
      display: none;
    }

    /* It's a shame that we have a circus of colors in the main menu, of all places. These should have been monochromatic. */
    body.dark #main_menu > li > i {
      filter: contrast(0%) brightness(160%);
    }
    body.dark #main_menu > li:hover > i,
    body.dark #main_menu > li:active > i {
      filter: contrast(0%) brightness(220%);
    }
    body.light #main_menu > li > i {
      filter: contrast(0%) brightness(80%);
    }
    body.light #main_menu > li:hover > i,
    body.light #main_menu > li:active > i {
      filter: contrast(0%) brightness(0%);
    }

    /* You don't really need to be reminded to tell friends about Wikiwand. It's way too green. */
    .footer_invite_wrapper .invite_box {
      display: none;
    }

    /* If this shit was open source, I would already bring some sense to it. What the heck is with these uncentered labels? */
    .infobox-image,
    .infobox-full-data {
      text-align: center;
    }

    /* Mx. Fancy Pants thought that you would appreciate this Pinterest button. Let's be real: who uses this bullshit today? */
    #cover_image .pin_btn {
      display: none;
    }

    /*
    THERE ARE MORE PRESSING ISSUES WITH WIKIWAND.
    IT DOESN'T RESPECT PRIVACY AND IT'S TOO GREEN.
    GIVE PROPER EXTENSIONS A TRY TO MODERNIZE THE LOOK OF WIKIPEDIA, NOT THIS GARBAGE.
    */
  `));
  document.body.appendChild(style);
})();
