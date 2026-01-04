// ==UserScript==
// @name         Unsplash Remove Ads
// @namespace    https://www.iplaysoft.com
// @description  Unsplash Ads
// @version      0.33
// @author       X
// @match        https://unsplash.com/*
// @require      https://cdn.staticfile.org/jquery/3.6.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unsplash.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/458922/Unsplash%20Remove%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/458922/Unsplash%20Remove%20Ads.meta.js
// ==/UserScript==

/* globals $ */

function removeAdsBlock(){
    $($("div[data-test*='AffiliatesGrid-Content']").get(0)).parent().hide();
    //$($("div[data-test*='AffiliatesGrid-Content']").get(0)).parent().parent().hide();
}

function removeAdsInsideList(targetDiv){

    removeAdsBlock();

    if(targetDiv.nodeName=="DIV" ||targetDiv.nodeName=="div"){
        var fig=$(targetDiv).find("figure[itemprop*='image']");

        if(fig.length>0){
            //console.log($(fig).find("a:contains('Unlock')").length);

            //console.log(fig[i]);
            //var ads=$(fig.get()).find("div:contains('Unsplash+')");
            var ads=$(fig.get()).find("a:contains('Unlock')");
            if(ads.length>0){
                // console.log(ads);
                $(ads.get()).parentsUntil("figure").hide();
                //console.log(ads.get());
            }
            //}
            //console.log($(fig).find("a"));
            //var ads=$(fig).find("img");
            //var ads=$(fig.get()).find("div:textEquals('Unsplash+')")
            //var ads=$(fig.get()).find("div:textEquals('Unsplash\+')")
            //if(ads.length>0){
            // console.log(ads);
            //}
        }

        var data_ad=$(targetDiv).find("div[data-ad*='true']");
        if(data_ad.length>0){
            $(data_ad.get()).hide()
            //console.log(data_ad.get());
        }
    }
}

function scrollRemoveAds(){
    var targetDiv=$("div[data-test*='masonry-grid-count-three']").parent().get(0);
    removeAdsInsideList(targetDiv);
}


(function() {
    'use strict';
    $(document).ready(function(){

        removeAdsBlock();

        $("div[data-test*='masonry-grid-count-three']").parent().on('DOMSubtreeModified', function(e) {
           removeAdsInsideList(e.target);
        });

        $(window).scroll(function(){
            scrollRemoveAds();
        });

    });
})();