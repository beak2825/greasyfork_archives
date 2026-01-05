// ==UserScript==
// @name         MyDealz User Info
// @namespace    http://www.mydealz.de/profile/richi2k
// @version      0.1
// @description  Adds extended user information (online status, nr of comments/deals/...) below each comment on mydealz.de 
// @author       richi2k
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @match        http://www.mydealz.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22378/MyDealz%20User%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/22378/MyDealz%20User%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var userProfileArray = [];
    
    $(".avatar-link").each(function(){ 
        
        var username = $(this).text().trim();
        var endpoint = $(this).attr("href") + "?user_details=1" ;
        
        var possibleUserInfoElId = "#" + username + "-md-userinfo"; // may be relevant in next releases
        var possibleUserInfoEl = $(possibleUserInfoElId);
        
        if(jQuery.inArray( username, userProfileArray ) === -1)
        {
            userProfileArray.push(username);
            $.ajax({
                url: endpoint,
                type: "GET",
                dataType: "json",
                success: function (data) {

                        var tmpEl = $('<div />', {id:possibleUserInfoElId}).append( data.data.content );//;
                        
                        var imgAvatarElement = tmpEl.find("img.avatar-image");
                        var imgAvatarSrc = imgAvatarElement.attr("src");
                    
                        $('.avatar-image--comment[data-popover*="'+username+'"]').each(function(){
                            var onlineStatus = tmpEl.find(".profile-name").siblings("span").clone().css({"display" : "inline", "text-align" : "center", "margin": "2px"});
                            var profileDate = tmpEl.find(".profile-date").clone().css({"display" : "inline", "text-align" : "right", "margin": "2px"});
                            
                            var profileStateUl = $("<ul />").css({"background":"#f5f6ff","display":"block","margin": "0.2em 2em 1.42857em 10em","padding" : "2px"});
                            
                            var liCss = {"margin":"3px 5px","display":"inline-block"};
                            
                            var nrOfComments = tmpEl.find(".profile-stat-item:contains('Kommentare')").clone().css(liCss);
                            var nrOfActiveDeals = tmpEl.find(".profile-stat-item:contains('Aktive Deals')").clone().css(liCss);
                            var nrOfSubscriptions = tmpEl.find(".profile-stat-item:contains('Abonnements')").clone().css(liCss);
                            var nrOfPostedDeals = tmpEl.find(".profile-stat-item:contains('Gemeldete Deals')").clone().css(liCss);
                            
                            var liUsername = $("<li />").text(username + " ist ").css(liCss);
                            var liOnlineStatus = $("<li />").append(onlineStatus).css(liCss);
                            var liProfileDate = $("<li />").append(profileDate).css(liCss);
                            
                            profileStateUl.append(liUsername).append(liOnlineStatus).append(liProfileDate).append(nrOfComments).append(nrOfActiveDeals).append(nrOfSubscriptions).append(nrOfPostedDeals);
                            
                            var profileStateLi = $("<li />").append(profileStateUl).addClass("comments-item comments-item--active section--padded--narrow").css({"margin":"0","padding":"0"});
                           
                            $("li.section--divided").css( "border-bottom","none" );
                            $(this).closest(".comments-item").after(profileStateLi);
                                
                        });

                    
                }
            });
        }
    });
    
})();