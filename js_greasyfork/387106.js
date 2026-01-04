// ==UserScript==
// @name         Get_Dcard_Sex_Resource
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  取得Dcard所有評論裡需要密碼的影片、圖片連結
// @author       You
// @include    https://www.dcard.tw/f/sex*
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
//@run-at  document-end
//@require https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387106/Get_Dcard_Sex_Resource.user.js
// @updateURL https://update.greasyfork.org/scripts/387106/Get_Dcard_Sex_Resource.meta.js
// ==/UserScript==

(function() {
    'use strict';


    //waitForKeyElements ("[class^=RegulationModal_container]", RemoveValidateAgeDiv);
    waitForKeyElements ("[class^=PostPage_content]", Main);

})();


function RemoveValidateAgeDiv(){
    console.log("remove dev");
  $("[class^=RegulationModal_container]").closest('[class^=Modal_modal]').remove();
    $('html, body').css('overflowY', 'auto');
}

//程式主要進入點
function Main(){
     var postId = GetPostIdbyUrl();
    var sexResourceUrls = FindResourceInMainContent(postId);
    sexResourceUrls = sexResourceUrls.concat(FindResourceInComment());
    console.log("All match urls:"+sexResourceUrls.join(','));

}

function GetPostIdbyUrl(){
    var url = window.location.href;
    var postId = 0;
    //取得文章編號
    var MatchPostId = /https:\/\/www\.dcard\.tw\/f\/(\w+)\/p\/(\d+).*/g;
    var Match = MatchPostId.exec(url);
    if(Match)
        postId = Match[2];
    return postId;
}

function FindResourceInComment(postId){
         var sexResourceUrls = [];

    //取得所有評論
    $.getJSON('https://www.dcard.tw/_api/posts/'+postId+'/comments', function(comments) {
        comments.forEach(function(comment, index) {

            if(comment.anonymous && comment.gender == "F"){
                var content = comment.content;
               console.log(comment.content);
                sexResourceUrls = sexResourceUrls.concat(MatchUrlInContent(content));
            }

        });//end of data foreach
    });//end of getJSON

    return sexResourceUrls;
}

function FindResourceInMainContent(){
    var content = $("[class^=Post_content]").html();
    return MatchUrlInContent(content);
}

function MatchUrlInContent(content){
    var Urls = [];
    var MatchVimeo = /https:\/\/player\.vimeo\.com\/video\/\d+/gm;
    var matches;
    console.log(content);
    while (matches = MatchVimeo.exec(content)) {
        console.log(matches);
        Urls.push(matches[1]);
    }

    var MatchPpt = /https:\/\/ppt\.cc\/\w+/gm;
    while (matches = MatchPpt.exec(content)) {
        console.log(matches);
        Urls.push(matches[1]);
    }

    return Urls;
}