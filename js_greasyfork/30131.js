// ==UserScript==
// @name  SSC Better like button
// @author el nino
// @namespace el nino
// @description additional "Like button" without reload whole post
// @include *://www.skyscrapercity.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @version 1.5.0
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/30131/SSC%20Better%20like%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/30131/SSC%20Better%20like%20button.meta.js
// ==/UserScript==

var like_active =   'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEKSURBVDhPlZO9isJAFIVHc2dSCKv4Ij6VjZa+gC9gJbgILirapXFZLBSsgijI1tbCvoONP3tuvGK8DsEc+MLMPedMimRMWp9EbkhUle2L2OsjI9uHYms/rmE4AEdwBQdQF9tcnKvLjD3ODH7RScwRkcVgI6amLfi8zQxdc3Ku4THvnASfxzQMHnM1zMOcD1ioYR4WfEBHDfPQMXtra1iclfEO5z/nasmXwKanzHfoJWXWlCjEIFaBLOIfdKR+08raCoydCvrYbZGV2rNwSBmBtSqkWaNclrhf30QlBJeqyCzxgpLEsjXBhUEhSpUj/LavlyhLXaIAxS9mjLWM86lZLBZaQVCQrUfG/AMYwUqdQyMIkwAAAABJRU5ErkJggg==';
var like_inactive = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAETSURBVDhPlZMxjoJQEIafMWJhosYbkFDzCBRQQCChoQMOYeMp9gK2Vu4JrC20NcbCU+wpttHs/sPORhxfiPzJR5j55x8S4Km2tNaW7/sLLl9Enud5FpcPJUkyret6C77BD/gCS7ZVVVVL7pFHM9ssy6aNia0jNC5sSj4Yk3cJw3CkyrJcGcx/bozJI1YKl71o9mFPCw6i2YcDLViLZh/WKs9zjZu7MN7hXhSFbr4Eio0w32HThElBEIzROImBLk5RFI05/qc4jucwrmLQxDVN0znHnoUlMwycRaDNGeEZj5uFv2uCwaMIEkc8YMJj3cI7sRDYtcI7LH49RF1yXXeI4CeB8zLkdj/Ztj1wHGfApUFK/QIPdTjK7ObmHQAAAABJRU5ErkJggg==';


initializeLike();

$(".better-like-active").click(function() {
    var postid = $(this).parent().data("postid");
    sendLike(postid);
    disableLike();
    setTimeout(enableLike,7500);
   
});

function initializeLike(){
    $("<img>", {
        "src": "data:image/png;base64," + like_inactive,
        "class": "better-like-inactive", 
        "style": "display:inline; display: none",
        "width": "16px", "height": "16px"})
        .appendTo(".dbtech-thanks-button-control"),       
    
    $("<img>", {
        "src": "data:image/png;base64," + like_active,
        "class": "better-like-active", 
        "style": "display:inline; cursor: pointer;",
        "width": "16px", "height": "16px"})
        .appendTo(".dbtech-thanks-button-control"),
        
        $(".dbtech-thanks-button-control a").hide();
}

//Disable like buttons for 10 seconds
function disableLike(){
    $('.better-like-active').hide();
    $('.better-like-inactive').show();
}

//Enable like buttons
function enableLike(){
    $('.better-like-inactive').hide();
    $('.better-like-active').show();
}

//Sending like to server 
function sendLike(postid){
    $.ajax({
        type: "POST",
        url: "//www.skyscrapercity.com/thanks.php",
        data: {
            "securitytoken": SECURITYTOKEN,
            "do": "ajax",
            "action": "entry",            
            "varname": "likes",
            "contenttype": "post",
            "p": postid
        }
    }).done(function(data) {
        var tagData = $(data),
            origData = data;
        data = {
            thanksEntries: {},
            //colorOptions: {}
        };
        var singleVals = {
            0: 'entries',
            1: 'actions',
            2: 'error'
        };
        /*
        if (tagData.find('colorOption').length) {
            tagData.find('colorOption').each(function() {
                var tagData2 = $(this);
                if (typeof data.colorOptions[tagData2.attr('varname')] == 'undefined') {
                    data.colorOptions[tagData2.attr('varname')] = {};
                }
                data.colorOptions[tagData2.attr('varname')][tagData2.attr('numclicks')] = {
                    color: tagData2.text(),
                    settings: tagData2.attr('settings')
                };
            });
        }*/
        if (tagData.find('thanksEntry').length) {
            tagData.find('thanksEntry').each(function() {
                data.thanksEntries[$(this).text()] = $(this).attr('numclicks');
            });
        }
        for (var i in singleVals) {
            data[singleVals[i]] = '';
            if (tagData.find(singleVals[i]).length) {
                data[singleVals[i]] = tagData.find(singleVals[i]).text();
            } else if (singleVals[i] != 'error') {
                data['error'] = origData;
            }
        }
        if (data.error) {
            alert(data.error);
            console.error(timeStamp() + "AJAX Error: %s", data.error);
            return true;
        }
        $('#dbtech_thanks_entries_' + postid).html(data.entries);
        //$('#dbtech_thanks_actions_' + postid).html(data.actions);
        

    });    
}
