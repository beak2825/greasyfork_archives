// ==UserScript==
// @name       ShareThis HIT Helper
// @namespace  http://ericfraze.com
// @version    0.2
// @description  (mTurk) Opens the links in a ShareThis hit in iFrames.
// @include    https://s3.amazonaws.com/mturk_bulk/hits/*
// @include    https://www.mturkcontent.com/dynamic/hit*
// @copyright  2014+, Eric Fraze
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5137/ShareThis%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/5137/ShareThis%20HIT%20Helper.meta.js
// ==/UserScript==

 $(document).ready(function() {
        $('section fieldset span a').filter(function(index) {
            $(this).css('display','block');
            $(this).css('width','100%');
            $(this).after("<iframe sandbox='allow-same-origin allow-scripts allow-forms' class = 'sharethishithelper' src='" + $(this).prop('href')+ "'></iframe>");
            $(".sharethishithelper").css('width','100%');
            $(".sharethishithelper").css('height','500px');
            return false;
        });
});