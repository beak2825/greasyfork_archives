
 // Copied from Audiobookbay to add more categories to block
 // ==UserScript==
 // @description Hide Specific Category
 // @name     Hide Category on ABB Sex Scenes
 // @match    http://audiobookbay.nl/*
 // @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
 // @grant    GM_addStyle
 // @version 0.0.1.20180113112641
 // @namespace https://greasyfork.org/users/166367
// @downloadURL https://update.greasyfork.org/scripts/423704/Hide%20Category%20on%20ABB%20Sex%20Scenes.user.js
// @updateURL https://update.greasyfork.org/scripts/423704/Hide%20Category%20on%20ABB%20Sex%20Scenes.meta.js
 // ==/UserScript==
 //- The @grant directive is needed to restore the proper sandbox.
     
 $(".post").has (".postInfo:contains('Sex Scenes')").hide ();

