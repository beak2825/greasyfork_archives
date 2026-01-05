// ==UserScript==
// @name         Classic Forum for Plex
// @namespace    forums.plex.tv
// @version      0.8
// @description  The JavaScript portion of the skin. Find the CSS portion at https://userstyles.org/styles/117161/classic-forum-for-plex
// @author       Justin Vanderhooft
// @match        forums.plex.tv/*
// @grant        none
// @downlodURL   https://greasyfork.org/scripts/11407-classic-forum-for-plex/code/Classic%20Forum%20for%20Plex.user.js
// @downloadURL https://update.greasyfork.org/scripts/11407/Classic%20Forum%20for%20Plex.user.js
// @updateURL https://update.greasyfork.org/scripts/11407/Classic%20Forum%20for%20Plex.meta.js
// ==/UserScript==

//Variables used by everything
var localstorage = window['localStorage'];
var placeholderImg = 'http://res.cloudinary.com/dnf4z4krv/image/upload/c_scale,w_48/v1438946227/plex-logo_hpqjpc.jpg';
var undefinedImg = 'http://';
setCustomClasses();
layoutDiscussionDOM();
layoutCategoryDOM();
buildCache();

/*var commentElements = document.getElementsByClassName('Item ItemComment Online');
for(var i = 0; i < commentElements.length; i++)
{
    var authorElements = commentElements[i].getElementsByClassName('Author');
    for(var j = 0; j < authorElements.length; j++) {
        $("<span class=\"MItem CustSkin-OnlineStatus\">Online</span>").appendTo(authorElements[j]);
    }
}*/

function setCustomClasses() {
    var script = document.getElementsByClassName('ItemDiscussion');
    var discussionElements = document.getElementsByClassName('ItemDiscussion');
    for(var i = 0; i < discussionElements.length; i++) {
        var photo = discussionElements[i].getElementsByClassName('IndexPhoto PhotoWrap')[0];

        $(photo).addClass('CustSkin-Remove');
    }

}

function layoutDiscussionDOM() {
    if(document.location.pathname.startsWith('/categories/',0)) {
        var discussionElements = document.getElementsByClassName('ItemDiscussion');
        for(var i = 0; i < discussionElements.length; i++) {
            var title = discussionElements[i].getElementsByClassName('Title')[0];
            var photo = discussionElements[i].getElementsByClassName('IndexPhoto PhotoWrap')[0];
            var options = discussionElements[i].getElementsByClassName('Options')[0];
            var answeredTag = discussionElements[i].getElementsByClassName('Tag QnA-Tag-Accepted')[0];
            var answerTag = discussionElements[i].getElementsByClassName('Tag QnA-Tag-Answered')[0];
            var questionTag = discussionElements[i].getElementsByClassName('Tag QnA-Tag-Question')[0];
            var announcementTag = discussionElements[i].getElementsByClassName('Tag Tag-Announcement')[0]; 
            var closedTag = discussionElements[i].getElementsByClassName('Tag Tag-Closed')[0];
            var author = discussionElements[i].getElementsByClassName('MItem DiscussionAuthor')[0];
            var viewCount = discussionElements[i].getElementsByClassName('MItem ViewCount')[0];
            var commentCount = discussionElements[i].getElementsByClassName('MItem CommentCount')[0];
            var discussionScore = discussionElements[i].getElementsByClassName('MItem DiscussionScore')[0];
            var lastComment = discussionElements[i].getElementsByClassName('MItem LastCommentBy')[0];
            var lastCommentDate = discussionElements[i].getElementsByClassName('MItem LastCommentDate')[0];
            var hasNewComment = discussionElements[i].getElementsByClassName('HasNew NewCommentCount')[0];
            var itemContent = discussionElements[i].getElementsByClassName('ItemContent')[0];

            $("<div class=\".col-md-8 Meta CustSkin-LeftDiscussionColumn\"></div>").appendTo(discussionElements[i]);
            $("<div class=\".col-md-4 Meta CustSkin-RightDiscussionColumn\"></div>").appendTo(discussionElements[i]);

            var leftCol = discussionElements[i].getElementsByClassName('CustSkin-LeftDiscussionColumn')[0];
            var rightCol = discussionElements[i].getElementsByClassName('CustSkin-RightDiscussionColumn')[0];



            $(photo).appendTo(leftCol);
            $(options).appendTo(rightCol);

            try {   
                var username = lastComment.getElementsByTagName('a')[0].text
                var image = localstorage[username];
                if(image == undefined) {
                    addImageToCache(username);
                    $("<a title="+username+ " href=\"/profile/"+username+"\" class=\"Index Photo PhotoWrap CustSkin-PhotoWrap Online\"><img src=\"http://res.cloudinary.com/dnf4z4krv/image/upload/c_scale,w_48/v1438946227/plex-logo_hpqjpc.jpg\" alt=\""+username+"\" class=\"ProfilePhoto CustSkin-ProfilePhoto CustSkin-DefaultProfilePhoto ProfilePhotoMedium\"></a>").appendTo(rightCol);
                    console.log("no image for this user displaying default instead: " + username);   
                } else {
                    $("<a title="+username+ " href=\"/profile/"+username+"\" class=\"Index Photo PhotoWrap CustSkin-PhotoWrap Online\"><img src=\""+localstorage[username]+"\" alt=\""+username+"\" class=\"ProfilePhoto CustSkin-ProfilePhoto ProfilePhotoMedium\"></a>").appendTo(rightCol);
                }
            } catch (e) {

            }

            $("<div class=\"ItemContent Discussion CustSkin-ItemContent\"><\div>").appendTo(leftCol);
            $("<div class=\"ItemContent Discussion CustSkin-ItemContent\"><\div>").appendTo(rightCol);

            var leftDiscussionDiv = leftCol.getElementsByClassName('ItemContent Discussion')[0];
            var rightDiscussionDiv = rightCol.getElementsByClassName('ItemContent Discussion')[0];

            $(title).appendTo(leftDiscussionDiv);

            $("<div class=\"Meta Meta-Discussion\"><\div>").appendTo(leftDiscussionDiv);
            $("<div class=\"Meta Meta-Discussion CustSkin-LatestCommenter\"><\div>").appendTo(rightDiscussionDiv);

            var leftMetaDiv = leftDiscussionDiv.getElementsByClassName('Meta Meta-Discussion')[0];
            var rightMetaDiv = rightDiscussionDiv.getElementsByClassName('Meta Meta-Discussion')[0];

            $(answeredTag).addClass('CustSkin-Tag').appendTo(leftMetaDiv);
            $(answerTag).addClass('CustSkin-Tag').appendTo(leftMetaDiv);
            $(questionTag).addClass('CustSkin-Tag').appendTo(leftMetaDiv);
            $(announcementTag).addClass('CustSkin-Tag').appendTo(leftMetaDiv);
            $(closedTag).addClass('CustSkin-Tag').appendTo(leftMetaDiv);
            $(hasNewComment).addClass('CustSkin-Tag').appendTo(leftMetaDiv);
            $(author).appendTo(leftMetaDiv);
            $(viewCount).appendTo(leftMetaDiv);
            $(commentCount).appendTo(leftMetaDiv);
            $(discussionScore).appendTo(leftMetaDiv);
            $(lastComment).appendTo(rightMetaDiv);
            $(lastCommentDate).appendTo(rightMetaDiv);
            $(itemContent).remove();

        }
    }
}

function layoutCategoryDOM() {
    if(document.location.pathname == '/' || document.location.pathname == '/categories') {
        var categoryElements = document.getElementsByClassName('Item');
        for(var i = 0; i < categoryElements.length; i++) {
            if(!$(categoryElements[i]).hasClass('CategoryHeading')) {
                var category =  categoryElements[i].getElementsByClassName('CustSkin-LeftDiscussionColumn')[0];

                var title = categoryElements[i].getElementsByClassName('TitleWrap')[0];       
                var options = categoryElements[i].getElementsByClassName('Options')[0];
                var categoryDescription = categoryElements[i].getElementsByClassName('CategoryDescription')[0];
                var lastDiscussionTitle = categoryElements[i].getElementsByClassName('MItem LastDiscussionTitle')[0];
                var lastCommentDate = categoryElements[i].getElementsByClassName('MItem LastCommentDate')[0];

                var meta = categoryElements[i].getElementsByClassName('Meta')[0];
                var itemContent = categoryElements[i].getElementsByClassName('ItemContent')[0];



                $("<div class=\".col-md-8 Meta CustSkin-LeftDiscussionColumn\"></div>").appendTo(categoryElements[i]);
                $("<div class=\".col-md-4 Meta CustSkin-RightDiscussionColumn\"></div>").appendTo(categoryElements[i]);

                var leftCol = categoryElements[i].getElementsByClassName('CustSkin-LeftDiscussionColumn')[0];
                var rightCol = categoryElements[i].getElementsByClassName('CustSkin-RightDiscussionColumn')[0];

                $(options).appendTo(rightCol);

                try {   

                    var username = lastDiscussionTitle.getElementsByTagName('a')[1].text
                    var image = localstorage[username];
                    if(image == undefined) {
                        addImageToCache(username);
                        $("<a title="+username+ " href=\"/profile/"+username+"\" class=\"Index Photo PhotoWrap CustSkin-PhotoWrap Online\"><img src=\"http://res.cloudinary.com/dnf4z4krv/image/upload/c_scale,w_48/v1438946227/plex-logo_hpqjpc.jpg\" alt=\""+username+"\" class=\"ProfilePhoto CustSkin-ProfilePhoto CustSkin-DefaultProfilePhoto ProfilePhotoMedium\"></a>").appendTo(rightCol);
                        console.log("no image for this user displaying default instead: " + username);                         
                    } else {
                        $("<a title="+username+ " href=\"/profile/"+username+"\" class=\"Index Photo PhotoWrap CustSkin-PhotoWrap Online\"><img src=\""+localstorage[username]+"\" alt=\""+username+"\" class=\"ProfilePhoto CustSkin-ProfilePhoto ProfilePhotoMedium\"></a>").appendTo(rightCol);
                    }
                } catch (e) {

                }

                $("<div class=\"ItemContent Category CustSkin-ItemContent\"><\div>").appendTo(leftCol);
                $("<div class=\"ItemContent Category CustSkin-ItemContent\"><\div>").appendTo(rightCol);

                var leftDiscussionDiv = leftCol.getElementsByClassName('ItemContent Category')[0];
                var rightDiscussionDiv = rightCol.getElementsByClassName('ItemContent Category')[0];

                $(title).appendTo(leftDiscussionDiv);
                $(categoryDescription).appendTo(leftDiscussionDiv);

                $("<div class=\"Meta CustSkin-LatestCommenter\"><\div>").appendTo(rightDiscussionDiv);
                var rightMetaDiv = rightDiscussionDiv.getElementsByClassName('Meta')[0];


                //This fails on the NAS section
                try {
                    var lastCommentUser = lastDiscussionTitle.getElementsByTagName('a')[1];
                    /*Title of last thread*/
                    $(lastDiscussionTitle.getElementsByTagName('a')[0]).appendTo(rightMetaDiv);
                    $(lastDiscussionTitle).remove();
                } catch(e) {
                    //Do nothing   
                }
                $(lastCommentDate).addClass('CustSkin-Username');
                lastCommentUser.text = lastCommentUser.text + " ";
                $(lastCommentUser).prependTo(lastCommentDate);
                $(lastCommentDate).appendTo(rightMetaDiv);
                $(meta).appendTo(leftDiscussionDiv);
                $(itemContent).remove();

            }
        }
    }
}

function buildCache() {
    //Setup local storage so we can store a map of usernames and avatars
    var profilePhotos = document.getElementsByClassName('ProfilePhoto ProfilePhotoMedium');
    for(var i = 0; i < profilePhotos.length; i++) {
        if(!$(profilePhotos[i]).hasClass('CustSkin-ProfilePhoto')) {
            var imgUrl = profilePhotos[i].src;
            var username = profilePhotos[i].alt;
            localstorage[username] = imgUrl;
        }
    }
    //cleanCache();
    console.log("There are " + localstorage.length + " urls cached");
}

function cleanCache() {
    for(var i = 0; i < localstorage.length; i++) {
        if (localstorage[localstorage.key(i)] == placeholderImg || localstorage[localstorage.key(i)] == undefinedImg) {
            localstorage.removeItem(localstorage.key(i));
        }
    }
}

function addImageToCache(username){
    $.get("https://forums.plex.tv/profile/" + username, function( page ) {
        console.log("/profile/" + username);
        var profilePhotos = $.parseHTML(page);
        var imgSrc = $(profilePhotos);
        imgSrc = $(imgSrc).find('.ProfilePhotoLarge').attr('src');
        console.log(imgSrc);
        localstorage[username] = imgSrc;
    },'html');

    console.log("Added " + username + "'s image to the cache");
}

