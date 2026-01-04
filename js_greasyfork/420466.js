// ==UserScript==
// @name         Netgamers.it - Super Hide That!
// @namespace    Netgamers.it
// @version      1.3.3
// @description  Hide Topics and User's Content on demand.
// @author       Crius
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @match        http*://*netgamers.it/forumdisplay.php*
// @match        http*://*netgamers.it/member.php*
// @match        http*://*netgamers.it/showthread.php*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @resource     JQUERYUI_CSS https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/js/fontawesome.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/js/solid.min.js
// @downloadURL https://update.greasyfork.org/scripts/420466/Netgamersit%20-%20Super%20Hide%20That%21.user.js
// @updateURL https://update.greasyfork.org/scripts/420466/Netgamersit%20-%20Super%20Hide%20That%21.meta.js
// ==/UserScript==

/* eslint-env jquery */
'use strict';

let showHiddenTopics = false;

// Style Helper
const addGlobalStyle = (css) => {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// Custom Styles
addGlobalStyle('.show-hidden-topics-container { padding-left: 1em; cursor: pointer; }')
addGlobalStyle('.hide-topic-container { text-align:center; cursor: pointer;}');
addGlobalStyle('.hide-user-topic-container { text-align: center; cursor: pointer; }');
addGlobalStyle('.show-hidden-users-container { padding-top: 1em; text-align: center; cursor: pointer; }');

// MAIN

$(document).ready(() => {
    const currentPage = window.location.href;
    const jqueryUI = GM_getResourceText("JQUERYUI_CSS"); GM_addStyle(jqueryUI);
    if (currentPage.match(/(forumdisplay.php)/)) {
        console.log('Super Hide That! - Forum Page Detected');
        hideTopics();
        hideUserTopics();
        addHideTopic();
        addShowHiddentTopics();
    }
    if (currentPage.match(/(showthread.php)/)) {
        console.log('Super Hide That! - Topic Page Detected');
        hideUserPosts();
        hideIgnoredUserPosts();
        hideIgnoredUserQuotedPosts();
    }
    if (currentPage.match(/(member.php)/)) {
        console.log('Super Hide That! - User Page Detected');
        addHideUserContent();
        addShowHiddenUsers();
    }
});

// LISTENERS

$(document).on('click', '[id*="hide-topic-"]', function() {
    console.log('Super Hide That! - Hide Topic ' + this.id.match(/\d+/));
    try {
        if (saveTopicIdToStorage(this.id.match(/\d+/))) {
            $(this).parent().parent().parent().hide();
        }
    } catch (err) {
        console.error(err);
    }
});

$(document).on('click', '[id*="hide-user-"]', function() {
    const username = this.id.match(/hide-user-(.*)/)[1].trim();
    console.log('Super Hide That! - Hide User ' + username);
    try {
        const userIdsFromStorage = loadUserIdsFromStorage();
        if (!userIdsFromStorage.includes(username)) {
            if (addUserIdToStorage(username)) {
                $('#' + this.id).text("This User's Content is being hidden");
            }
        } else {
            if (delUserIdToStorage(username)) {
                $('#' + this.id).text("This User's Content is visible again");
            }
        }
    } catch (err) {
        console.error(err);
    }
});

$(document).on('click', '.show-hidden-users-link', function() {
    console.log('Super Hide That! - Showing Hidden Users');
    try {
        const userIdsFromStorage = loadUserIdsFromStorage();
        $('#hidden-users-dialog').empty();
        $('#hidden-users-dialog').append('<p>Users in the hide list:');
        $('#hidden-users-dialog').append('<ul>');
        userIdsFromStorage.forEach(user => {
            $('#hidden-users-dialog').append('<li>'+ user +'</li>');
        });
        $('#hidden-users-dialog').append('</ul>');
        $('#hidden-users-dialog').append('<p>Use the <a href="/search.php" target="_blank">forum search</a> to access their profile and manage the content\'s visibility</p>');
        $('#hidden-users-dialog').dialog( "open" );
    } catch (err) {
        console.error(err);
    }
});

$(document).on('click', '#manage-hidden-topics', function() {
    try {
        if (!showHiddenTopics) {
            console.log('Super Hide That! - Showing all topics');
            $('#threadslist > tbody > tr').each(function() {
                $(this).show();
            });
            $('.tcat').children().last().children().children().text('(Hide "Hidden Topics")');
        } else {
            console.log('Super Hide That! - Hiding requested topics');
            hideTopics();
            hideUserTopics();
            hideIgnoredUserPosts();
            $('.tcat').children().last().children().children().text('(Show "Hidden Topics")');
        }
        showHiddenTopics = !showHiddenTopics;
    } catch (err) {
        console.error(err);
    }
});

// HIDING LOGIC

function hideUserTopics() {
    //Load Hidden User Ids from storage
    let hiddenUserIds = loadUserIdsFromStorage();
    // Check loaded topics to hide
    $('[id*="td_threadtitle_"]').each( function() {
        const username = $(this).children().last().text().trim();
        if (hiddenUserIds.includes(username)) {
            $(this).parent().hide();
        }
    });
}

function hideUserPosts() {
    //Load Hidden User Ids from storage
    let hiddenUserIds = loadUserIdsFromStorage();
    // Check loaded topics to hide
    $('.bigusername').each( function() {
        const username = $(this).text().trim();
        if (hiddenUserIds.includes(username)) {
            $(this).parent().parent().parent().parent().parent().parent().hide();
        }
    });
}

function hideIgnoredUserPosts() {
    //Load Hidden User Ids from storage
    let hiddenUserIds = loadUserIdsFromStorage();
    // Check loaded topics to hide
     $('a[href="profile.php?do=ignorelist"]').parent().parent().children().each( function() {
        const username = $(this).text();
         hiddenUserIds.forEach(userId => {
             if (username.match(userId)) {
                 $(this).parent().parent().parent().parent().parent().hide()
             }
         });
    });
}

function hideIgnoredUserQuotedPosts() {
    //Load Hidden User Ids from storage
    let hiddenUserIds = loadUserIdsFromStorage();
    const quotes = $('td.alt2[style="border:1px inset"]');
    $(quotes).children().each((index, el) => {
        // Check against the ignored list
        if ( hiddenUserIds.includes($(el).children('strong').text().trim()) ) {
            // Replace name and quoted message
            $(el).html('Originally Posted by <strong>Someone</strong> <img src="/images/buttons/viewpost.gif">')
            $($(quotes).children().get(index + 1)).html('Nope, super hidden that! You\'re welcome!');
        }
    });
}

function hideTopics() {
    //Load Hidden Topic Ids from storage
    let hiddenTopicIds = loadTopicIdsFromStorage();
    // Check loaded topics to hide
    $('[id*="td_threadstatusicon_"]').each(function() {
        const topicId= this.id.match(/\d+/)[0];
        if (hiddenTopicIds.includes(topicId)) {
            $(this).parent().hide();
        }
    });
}

// UI MODIFICATIONS

function addHideTopic() {
    // Create icons to hide topics for the remaining ones
    $('[id*="td_threadstatusicon_"]').append('<div class="hide-topic-container"><a class="hide-topic-link"><i class="fas fa-eye-slash"></i></a></div>');
    // Pass topic ID to build unique identifier for the new icon
    $('[id*="td_threadstatusicon_"]').each(function() {
        $('.hide-topic-link', this).attr('id','hide-topic-' + this.id.match(/\d+/));
    });
}

function addShowHiddentTopics() {
    $('.tcat').children().append('<span class="show-hidden-topics-container"><a id="manage-hidden-topics" class="show-hidden-topics-link">(Show "Hidden Topics")</a></span>');
}

function addHideUserContent() {
    const username = $('#username_box').children().first().children().first().text() || $('#username_box').children().first().text().trim();
    const userIdsFromStorage = loadUserIdsFromStorage();
    if (!userIdsFromStorage.includes(username)) {
        $('#main_userinfo').append('<div class="hide-user-topic-container"><a class="hide-user-link">Hide Content created by this user</a></div>');
        $('.hide-user-link').attr('id','hide-user-' + username);
    } else {
        $('#main_userinfo').append('<div class="hide-user-topic-container"><a class="hide-user-link">This User\'s Content is already being hidden</a></div>');
        $('.hide-user-link').attr('id','hide-user-' + username);
    }
}

function addShowHiddenUsers() {
    $('#main_userinfo').append('<div class="show-hidden-users-container"><a class="show-hidden-users-link">Show Hidden Users</a></div>');
    $('#main_userinfo').append('<div id="hidden-users-dialog" title="Hidden Users"></div>');
    $('#hidden-users-dialog').dialog({
      create: function(event, ui) {
      let widget = $(this).dialog("widget");
      $(".ui-dialog-titlebar-close span", widget)
          .removeClass("ui-icon-closethick")
          .addClass("fas fa-times");
      },
      autoOpen: false,
      modal: true,
      show: {
        effect: 'blind',
        duration: 150
      },
      hide: {
        effect: 'blind',
        duration: 150
      }
    });
}

// LOCALSTORAGE MANAGEMENT

function saveTopicIdToStorage(topicId) {
    try {
        let hiddenTopicIds = loadTopicIdsFromStorage();
        hiddenTopicIds.push(topicId[0]);
        localStorage.setItem('hiddenTopicIds', JSON.stringify(hiddenTopicIds))
        return true;
    } catch (err) {
        throw err;
    }
}

function loadTopicIdsFromStorage() {
    const Ids = JSON.parse(localStorage.getItem('hiddenTopicIds'))
    return Ids ? Ids : [];
}

function addUserIdToStorage(username) {
    try {
        let hiddenUserIds = loadUserIdsFromStorage();
        hiddenUserIds.push(username);
        localStorage.setItem('hiddenUserIds', JSON.stringify(hiddenUserIds))
        return true;
    } catch (err) {
        throw err;
    }
}

function delUserIdToStorage(username) {
    try {
        let hiddenUserIds = loadUserIdsFromStorage();
        const deleteIndex = hiddenUserIds.findIndex(u => u === username);
        if (deleteIndex !== -1) {
            hiddenUserIds.splice(deleteIndex, 1);
            localStorage.setItem('hiddenUserIds', JSON.stringify(hiddenUserIds))
        }
        return true;
    } catch (err) {
        throw err;
    }
}

function loadUserIdsFromStorage() {
    const Ids = JSON.parse(localStorage.getItem('hiddenUserIds'))
    return Ids ? Ids : [];
}
