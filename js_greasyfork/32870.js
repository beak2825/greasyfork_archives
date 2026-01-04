// ==UserScript==
// @name        Facebook Post Deleter
// @namespace   your-friendly-helper
// @description Automatically delete your own FB posts newer than a certain age
// @version     2
// @author      your-friendly-helper
// @require     https://code.jquery.com/jquery-3.2.1.js
// @include     http://*.facebook.com/*/allactivity*
// @include     https://*.facebook.com/*/allactivity*
// @run-at      document-idle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32870/Facebook%20Post%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/32870/Facebook%20Post%20Deleter.meta.js
// ==/UserScript==

/*
 * For jQuery Conflicts.
 */

var observer = new MutationObserver(function (mutations) {
    retrieveEntryInformation();

});
observer.observe(document.querySelector('.uiContextualLayerParent'), {
    subtree: true,
    childList: true,
    attributes: false,
    characterData: false,
    attributeOldValue: false,
    characterDataOldValue: false
});

this.$ = this.jQuery = jQuery.noConflict(true);


// Some system variables
var reTime = new RegExp("timeline_token=.*?%3A.*?%3A.*?%3A(.*?)%3A");
var reAction = new RegExp("action=(.+?)&");
var reDelete = new RegExp("delete");
var reStoryId = new RegExp("story_dom_id=(.+?)&");
var time = 0;
var validActions = [];
var olderThan = 86400000;
var arrAjaxify = [];

function parseTimestamp(x) {


    try {
        time = x.match(reTime)[1];
        time = time + "000";
        time = parseInt(time);
    }
    catch (err) {
        console.log(err);
        console.log("The problem maker is: " + x);
        return 0;
    }

    return time;
}

function parseAction(x) {
    var action = x.match(reAction)[1];
    return action;
}


function injectUI() {
    $('div [class="_2o3t fixed_elem"] div[class="clearfix uiHeaderTop"] ').append('<form> <h2>Choose what to delete</h2> <fieldset><ul><li> <label><input type="checkbox" id="checkbox-likes" name="action" value="likes">Likes</label></li><li><label><input type="checkbox" id="checkbox-comments" name="action" value="comments">Comments</label></li><li> <label><input type="checkbox" id="checkbox-posts" name="action" value="posts">Posts</label></li></ul> </fieldset> </form>');
    $('div [class="_2o3t fixed_elem"] div[class="clearfix uiHeaderTop"] ').append('<h2>Maximum age of the entry?</h2><input id="script-age-input" placeholder="Newer than (days)" type="text" name="script-age-input">');
    $('div [class="_2o3t fixed_elem"] div[class="clearfix uiHeaderTop"] ').append('      <button id="script-delete-button" type="button">Start</button>');

    $("#script-delete-button").bind('click', function () {
        buttonStart();
    });
}

function buttonStart() {
    olderThan = $('#script-age-input').val() * 1000 * 60 * 60 * 24;
    if ($('#checkbox-likes').prop('checked')) {
        validActions.push("unlike");
    }
    if ($('#checkbox-comments').prop('checked')) {
        validActions.push("remove_comment");
    }
    if ($('#checkbox-posts').prop('checked')) {
        validActions.push("delete");
    }

    clickEntries()
        .then(console.log("Process finished"));
}

function clickEntries() {

    var promise = new Promise(function (resolve, reject) {

        //click on the editing button and get the timestamp
        $('body').find('span[class=_-xe]').each(function () {

            console.log(this);

            $(this).click();


        });


        resolve();

    });

    return promise;

}

//Reads the information of the previously clicked entries
function retrieveEntryInformation() {

    $('body').find('a[ajaxify][rel=async-post]').each(function () {

        var ajaxify = $(this).attr('ajaxify');
        var index = arrAjaxify.indexOf(ajaxify);
        if (index > -1) {
            console.log("Ajaxify already in array");
        }
        else {
            console.log("Adding to array: " + ajaxify);
            arrAjaxify.push(ajaxify);
            checkAndDeleteEntry(ajaxify, $(this)).then(console.log("Checked and deleted if necessary"));
        }



    });

}

function parseDeleteTime(ajaxify) {

    try {
        var storyId = ajaxify.match(reStoryId)[1];
        var deleteParent = $("#" + storyId).parent().parent().parent().attr("id");
        if (deleteParent === undefined) {
            return null;
        }

        var date = deleteParent.split("_");
        var year = date[3];
        var month = date[4];
        var finalDate = new Date(year, month-1, 0, 0, 0, 0).getTime();
        return finalDate;
    }

    catch (err) {
        console.log("Cannot parse request because: " + err);
    }

}

// Check if the entry matches the actions (e.g. like, post) which should be deleted and whether or not is old/young enough
function checkAndDeleteEntry(ajaxify, finding) {

    var promise = new Promise(function (resolve, reject) {

        if (reDelete.test(ajaxify)) {

            var index = validActions.indexOf("delete");
            if (index > -1) {

                time = parseDeleteTime(ajaxify);
                if (time > Date.now() - olderThan) {
                    console.log("Entry is new enough");

                    console.log("Now deleting the post");
                    $(finding).children('span').click();

                }
                else {
                    console.log("Nope, that seems to be too old to delete");
                    resolve();
                }

            }

            resolve();

        }

        else{
            time = parseTimestamp(ajaxify);
            if (time > Date.now() - olderThan) {
                console.log("Entry is new enough");
    
                var index = validActions.indexOf(parseAction(ajaxify));
                if (index > -1) {
                    console.log("Now deleting the like or comment");
                    $(finding).children('span').click();
                }
    
            }
        }

        resolve();

    });

    return promise;

}

injectUI();

