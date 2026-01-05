// ==UserScript==
// @name         Mirkoukrywacz
// @namespace    wykophidepost
// @version      1.0.4
// @description  Skrypt dodający na Mikroblogu Wykop.pl przycisk pozwalający na ukrywanie wpisów.
// @author       zranoI
// @include      /^https?:\/\/.*wykop\.pl\/mikroblog.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19459/Mirkoukrywacz.user.js
// @updateURL https://update.greasyfork.org/scripts/19459/Mirkoukrywacz.meta.js
// ==/UserScript==


function getCookie(name) {
    if (document.cookie.length <= 0) {
        return "";
    }

    var start = document.cookie.indexOf(name + "=");
    if (start === -1) {
        return "";
    }

    start += name.length + 1;
    var end = document.cookie.indexOf(";", start);
    if (end === -1) {
        end = document.cookie.length;
    }
    return unescape(document.cookie.substring(start, end));
}

function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }

    document.cookie = name + "=" + value + expires + "; path=/";
}

function isListEmpty(list) {
    var listIsEmpty = true;
    $.each(list, function (index, value) {
        if (value !== "") {
            listIsEmpty = false;
            return;
        }
    });
    return listIsEmpty;
}

function createUnhideListItemCode(postId) {
    var htmlCode = '<li id="unhide-list-item-' + postId + '"><b>';

    htmlCode += '<a style="width: 65%; display: inline-block; border-bottom: none !important;" href="http://www.wykop.pl/wpis/' + postId + '">' + postId + '</a>';
    htmlCode += '<a style="text-align: right; width: 35%; display: inline-block; border-bottom: none !important; cursor: pointer;" id="unhide-post-' + postId + '">usuń</a>';

    htmlCode += '</b></li>';
    return htmlCode;
}

function createUnhideMenu(unhideAllId) {
    var htmlCode = '<div id="unhide-menu-dropdown" class="dropdown m-hide" style="margin-left: -40px; width: 200px; display: none;"><div><ul>';

    htmlCode += '<li><a style="text-align: center; cursor: pointer;" id="' + unhideAllId + '">Wyczyść ukryte</a></li>';
    htmlCode += '<li><a style="text-align: center; cursor: pointer;" href="http://www.wykop.pl/dodatki/pokaz/867">O skrypcie</a></li>';
    htmlCode += '</ul>';

    htmlCode += '<ul id="unhide-menu-list" style="max-height: 200px;">';

    var hiddenIdsWithDates = getCookie("hidden_ids").split(",");
    if (isListEmpty(hiddenIdsWithDates)) {
        hiddenIdsWithDates = [];
    }

    hiddenIds = getHiddenIdsFromCookieList(hiddenIdsWithDates);

    $.each(hiddenIds, function (key, value) {
        htmlCode += createUnhideListItemCode(value);
    });

    htmlCode += '</ul></div></div>';

    var unhideMenu = $(htmlCode);

    unhideMenu.hover(function () {
        clearTimeout(window.hovertimeout);
    }, function () {
        window.hovertimeout = setTimeout(function () {
            unhideMenu.hide();
        }, 500);
    });

    return unhideMenu;
}

function removeUnhideButtonsForId(postId) {
    if ($("#unhide-menu-list li:last-child").attr('id') === "unhide-list-item-" + postId) {
        window.hovertimeout = setTimeout(function () {
            $("#unhide-menu-dropdown").hide();
        }, 500);
    }

    $("#unhide-list-item-" + postId).remove();
    $("#undo-button-" + postId).remove();
}

function unhidePostWithId(id) {
    var post = $("div.dC[data-id=" + id + "]").parent();
    post.css("display", "");
}

function unhideAll() {
    var hiddenIdsWithDates = getCookie("hidden_ids").split(",");

    if (isListEmpty(hiddenIdsWithDates)) {
        hiddenIdsWithDates = [];
    }

    hiddenIds = getHiddenIdsFromCookieList(hiddenIdsWithDates);

    $.each(hiddenIds, function (key, value) {
        unhidePostWithId(value);
        removeUnhideButtonsForId(value);
    });

    createCookie("hidden_ids", "", 1);
}

function unhidePost(postId) {
    unhidePostWithId(postId);

    var hiddenIdsWithDates = getCookie("hidden_ids").split(",");

    if (isListEmpty(hiddenIdsWithDates)) {
        hiddenIdsWithDates = [];
    }
    
    var hiddenIds = getHiddenIdsFromCookieList(hiddenIdsWithDates);
    var postIdAndDate = "";
    
    $.each(hiddenIdsWithDates, function(index, value) {
        if (value.startsWith(postId)) {
            postIdAndDate = value;
            return false;
        }
    });

    hiddenIdsWithDates.splice(hiddenIdsWithDates.indexOf(postIdAndDate), 1);
    createCookie("hidden_ids", hiddenIdsWithDates.join(","), 1);
}

function addUnhideMenuButtonClickHandler(button) {
    button.click(function () {
        var postId = /unhide\-post\-(\d+)/.exec($(this).attr('id'))[1];
        unhidePost(postId);
        removeUnhideButtonsForId(postId);
    });
}

function addMainScriptButton() {
    var listItem = $('<li>');
    var button = $('<a style="cursor: pointer;">Mirkoukrywacz</a>');

    var unhideAllId = "unhide-all-button";
    var unhideMenu = createUnhideMenu(unhideAllId);

    button.click(function () {
        unhideMenu.show();
    });

    button.hover(function () {
        clearTimeout(window.hovertimeout);
    }, function () {
        window.hovertimeout = setTimeout(function () {
            unhideMenu.hide();
        }, 500);
    });

    listItem.append(button);
    listItem.append(unhideMenu);

    $("ul.mainnav").children().last().after(listItem);

    $("#unhide-all-button").click(unhideAll);
    $("a[id^=unhide-post]").each(function () {
        addUnhideMenuButtonClickHandler($(this));
    });
}

function addUndoButtonClickHandler(button, postId, post) {
    button.remove();
    $("#unhide-list-item-" + postId).remove();

    var hiddenIdsWithDates = getCookie("hidden_ids").split(",");

    if (isListEmpty(hiddenIdsWithDates)) {
        hiddenIdsWithDates = [];
    }

    hiddenIdsWithDates.splice(hiddenIdsWithDates.indexOf(postId), 1);
    post.css("display", "");
    createCookie("hidden_ids", hiddenIdsWithDates.join(","), 1);
}

function getHiddenIdsFromCookieList(hiddenIdsWithDates) {
    var hiddenIds = [];

    $.each(hiddenIdsWithDates, function(index, value) {
        hiddenIds.push(value.split("|")[0]);
    });

    return hiddenIds;
}

function hideButtonClickHandler(postId, addUndo) {
    triggerLazyLoad();

    var post = $("div.dC[data-id=" + postId + "]").parent();
    
    if (addUndo) {
        var undoButton = $('<li id="undo-button-' + postId + '" style="width: 100%;" class="button">Cofnij ukrycie</li>');

        undoButton.click(function() {
            addUndoButtonClickHandler($(this), postId, post);
        });

        post.after(undoButton);
    } else {
        $('html, body').animate({
            scrollTop: post.offset().top - 50
        }, 0);
    }
    
    post.css("display", "none");

    $("#unhide-menu-list").append($(createUnhideListItemCode(postId)));
    addUnhideMenuButtonClickHandler($("#unhide-post-" + postId));

    var hiddenIdsWithDates = getCookie("hidden_ids").split(",");

    if (isListEmpty(hiddenIdsWithDates)) {
        hiddenIdsWithDates = [];
    }

    var hiddenIds = getHiddenIdsFromCookieList(hiddenIdsWithDates);

    if (hiddenIds.indexOf(postId) === -1) {
        hiddenIdsWithDates.push([postId, Date.now() / 1000 / 60 / 60 / 24].join("|"));
    }

    createCookie("hidden_ids", hiddenIdsWithDates.join(","), 1);
}

function addTopHideButtons() {
    $(".entry.iC > div.dC").each(function () {
        var postId = $(this).attr("data-id");
        
        var topButton = $('<button class="button mikro" style="margin-left: 5px;">Ukryj wpis</button>');

        topButton.click(function () {
            return hideButtonClickHandler(postId, true);
        });

        $(this).find("div > .author.ellipsis").children().eq(2).after(topButton);
    });
}

function addBottomHideButton(postBodyDiv) {
    var bottomButton = $('<button class="button mikro" style="margin-left: 10px; margin-bottom: 10px;">Ukryj wpis</button>');
    bottomButton.click(function () {
        return hideButtonClickHandler(postBodyDiv.attr("data-id"), false);
    });
    postBodyDiv.siblings().last().after(bottomButton);
}

function triggerLazyLoad() {
    $("img").each(function() {
        $(this).attr("src", $(this).attr("data-original"));
    });
}

function removeOldCookieElements(hiddenIdsWithDates) {
    var newHiddenIdsWithDates = [];
    $.each(hiddenIdsWithDates, function (index, value) {
        var date = value.split("|")[1];
        if (Date.now() / 1000 / 60 / 60 / 24 - date < 1) {
            newHiddenIdsWithDates.push(value);
        }
    });

    return newHiddenIdsWithDates;
}

function addShowMoreCommentsClickHandler() {
    $("p.more > a").click(function() {
        addBottomHideButton($(this).parent().parent().siblings().eq(0));
    });
}

$(document).ready(function () {
    var hiddenIdsWithDates = getCookie("hidden_ids").split(",");

    hiddenIdsWithDates = removeOldCookieElements(hiddenIdsWithDates);
    createCookie(createCookie("hidden_ids", hiddenIdsWithDates, 1));

    if (hiddenIdsWithDates.indexOf("") === -1) {
        var hiddenIds = getHiddenIdsFromCookieList(hiddenIdsWithDates);

        $.each(hiddenIds, function (index, value) {
            $("div.dC[data-id=" + value + "]").parent().css("display", "none");
        });
    }

    triggerLazyLoad();

    addMainScriptButton();
    addTopHideButtons();
    addShowMoreCommentsClickHandler();
});