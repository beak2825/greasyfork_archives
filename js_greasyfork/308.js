// ==UserScript==
// @name            Reddit visited link remover
// @version         0.9.5
// @namespace       sxxe@gmx.de
// @description     hides links you already visited on reddit and offers keyboard navigatin
// @include         *.reddit.com/*
// @exclude         *.reddit.com/r/*/comments/*
// @exclude         *.reddit.com/user/*
// @exclude         *.reddit.com/message/*
// @exclude         *.reddit.com/reddits/*
// @exclude         *.reddit.com/prefs/*
// @require         http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/308/Reddit%20visited%20link%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/308/Reddit%20visited%20link%20remover.meta.js
// ==/UserScript==

// Keyboard Shortcuts:
//
// - h: Open next unread post in new tab
// - j: Jump to next unread post and mark it as read (+minimize)
// - shift + j: Jump to next post (even minimized)
// - k: Jump to previous unread post and mark it as read (+minimize)
// - shift + k: Jump to previous post (even minimized)
//
// - l: Open comments of active post
// - u: up vote active post
// - m: down vote active post
//

var cached_links_time = 60*60*24*2; // Two days - how long should visited links be saved
var cached_links_count = 1000; // Only save this amount of links (due to performance reasons)
var fade_time = 750; // time it takes until the visited link is completely invisible
var show_footer = true; // show how many links are currently cached at the buttom of reddit.com
var toggle_links_button = true; // show button to show / hide links (hide_links has to be true)
var hide_links = false; // removes links completely (after the next page reload)
var add_manual_hide_link = true; // adds a link to the frontpage to manually hide posts
var activate_popup = false; // activate popup functionality

// ----------------------------------------------------------

// Add config style
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('.rvlr_marker { color: #FFF !important; background-color: #FF4500; border-radius: 50%; text-align: center !important; padding: 2px; }');

if (toggle_links_button && hide_links) {
    $("body").append ('<center><div id="show_links" class="show_links"><button>Toggle links</button></div> <br></center>');
}

if (add_manual_hide_link) {
    $('ul.flat-list.buttons').append('<li><a class="manHideLink" href="#">mark as read</a></li>');
}

var stateMachine;
window.addEventListener ("load", function () {

        stateMachine = new GM_LinkTrack();

        if (show_footer) {
            var numLinks    = stateMachine.GetVisitedLinkCount();
            $("body").append ('<center><p>' + numLinks + ' links cached. (max '+ cached_links_count + ')</p><br></center>');
        }

    },
    false
);

var activeElement;
document.addEventListener("keypress", function(e) {

    if(!e) e=window.event;

    var isShift = e.shiftKey;

    var key = e.which;

    //console.log('key: '+key+' isShift: '+isShift);

    // http://www.w3schools.com/jsref/event_key_which.asp

    if ((key == 106) || (key == 74)) { // j key
        // shrink next unshrinked link
        var element;
        if (isShift){
            element = getElementAfterActive();
        } else {
            element = getCorrectElement();
        }
        //console.log("element: " + element + "e0: " + element[0]);
        if ( typeof element === "undefined" ) {
            nextPage();
        } else if ( typeof element[0] === "undefined" ) {
            nextPage();
        }

        stateMachine.LinkIsNewPub(element);
        setActiveElement(element);

    } else if (key == 104) { // h key
        // pop disable, open link in new tab
        var element = getCorrectElement();
        stateMachine.LinkIsNewPub(element);
        setActiveElement(element);
        openLink(element);

    } else if ((key == 107) || (key == 75)) { // k key
        // open previous link in popup

        var element;
        if (isShift){
            element = getElementBeforeActive();
        } else {
            element = getPrevUnreadLink();
        }

        if(element.length === 0) {
            return 0;
        }

        stateMachine.LinkIsNewPub(element);
        setActiveElement(element);

    } else if (key == 117) { // u key
        // up vote active post
        upVote(getActiveElement());
    } else if (key == 109) { // m key
        // down vote active post
        downVote(getActiveElement());
    }  else if (key == 108) { // l key
        // open comments of active post
        openLinkComments(getActiveElement());
    }

}, true);

function setActiveElement(elm) {
    resetActiveElement();
    activeElement = elm;
    activeElement.addClass('rvlr_active');
    activeElement.closest('div.thing:visible:not(.promoted)').find(".rank").addClass('rvlr_marker');
}

function resetActiveElement() {
    if (activeElement) {
        activeElement.removeClass('rvlr_active');
        activeElement.closest('div.thing:visible:not(.promoted)').find(".rank").removeClass('rvlr_marker');
    };
}

function getActiveElement() {
    return activeElement;
}

function isActiveElement(elm) {
    if (elm.hasClass('rvlr_active')) {
        return true;
    }
    return false;
}

function getCorrectElement() {
    var element;

    var aElement = getActiveElement();
    if (typeof aElement !== "undefined") {
        element = getNextUnreadLink();
    }

    if (typeof element === "undefined") {
        element = getFirstUnreadLink();
    }

    return element;
}


function nextPage() {
    $('a[rel*=next]')[0].click();
}

function getNextUnreadLink() {

    var element = getActiveElement();
    if (typeof element !== "undefined") {
        var elem = element.closest('div.thing:not(.promoted)').nextAll('div.thing:not(.shrinked):not(.promoted)').eq(0).find('a.title');
        return elem;
    }
    return 0;
}

function getPrevUnreadLink() {

    var element = getActiveElement();
    if (typeof element !== "undefined") {
        var elem = element.closest('div.thing:not(.promoted)').prevAll('div.thing:not(.shrinked):not(.promoted)').eq(0).find('a.title');
        console.log(elem);
        return elem;
    }
    return 0;
}

function getFirstUnreadLink() {
    var currentElement;
    $('#siteTable a.title').each(function() {
        if ( ($(this).closest('div.thing').hasClass('promoted') === false) && ($(this).closest('div.thing').hasClass('shrinked') === false) && ($(this).closest('div.thing').is(":hidden") === false) )  {
            currentElement = $(this);
            return false;
        }
    });
    //console.log(currentElement);
    return currentElement;
}

function getLastShrinkedLink() {
    var element;
    $('#siteTable a.title').each(function() {
        if ( ($(this).closest('div.thing').hasClass('promoted') === false) && ($(this).closest('div.thing').hasClass('shrinked') === true) && ($(this).closest('div.thing').is(":hidden") === false) )  {
            element = $(this);
        }
    });
    return element;
}

function getElementBeforeActive() {
    var element;

    element = $('.rvlr_active').closest('div.thing:not(.promoted)').prevAll('div.thing:visible:not(.promoted)').eq(0).find('a.title');

    return element;
}

function getElementAfterActive() {
    var element;

    element = $('.rvlr_active').closest('div.thing:not(.promoted)').nextAll('div.thing:visible:not(.promoted)').eq(0).find('a.title');

    return element;
}

function openLink(elm) {
    var href = elm.attr('href');
    window.open(href, '_blank');
}

function getYoutubeId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 0;
    }
}

function openLinkComments(elm) {
    var href = elm.closest('div.thing:not(.promoted)').find("a.comments").attr('href');
    //window.location = href;
    window.open(href, '_blank');
}

function upVote(elm) {
    elm.closest('div.thing:not(.promoted)').find("div.up, div.upmod").click();
}

function downVote(elm) {
    elm.closest('div.thing:not(.promoted)').find("div.down, div.downmod").click();
}

function GM_LinkTrack () {
    var visitedLinkArry = [];
    var numVisitedLinks = 0;
    var link_count = 0;
    var current_timestamp = new Date().getTime();

    var sortedLocalStorage = SortLocalStorage();

    // Get visited link-list from storage.
    for (var J = sortedLocalStorage.length - 1;  J >= 0;  --J) {

        var item = sortedLocalStorage[J];

        var four_weeks = cached_links_time*1000;

        // Get saved links
        if (/^Visited_\d+.*/i.test (item) ) {

            var regex = /^Visited_(\d+).*/;
            var old_timestamp = regex.exec(item)[1];

            var regex2 = /^Visited_\d+_(.*)/;
            var value = regex2.exec(item)[1];

            var regex3 = /^(Visited_\d+)_.*/;
            var itemName = regex3.exec(item)[1];

            //console.log(numVisitedLinks + " " + item+ " t: " + old_timestamp + " v: " + value + " n: " + itemName);

            if (value == '#') {
                localStorage.removeItem (itemName);
                break;
            }

            if (link_count >= cached_links_count) {
                localStorage.removeItem (itemName);
                //console.log(numVisitedLinks + " " + value + "t: " + timeConverter(old_timestamp));
                link_count--;
            }
            link_count++;

            // check link age
            if ( (current_timestamp - old_timestamp) < four_weeks ) {
                visitedLinkArry.push (value);
                numVisitedLinks++;

                //console.log(numVisitedLinks + " " + localStorage[itemName] + " t: " +old_timestamp[1]);

                if (hide_links) {
                    $('a[href*="' + value + '"]').closest('div.thing:not(.promoted)').fadeOut(fade_time);
                } else {
                    //$('a[href="' + localStorage[itemName] + '"]').closest('div').fadeOut(fade_time);
                    shrinkLinks($('a[href*="' + value + '"]'));
                }

            } else {
                // too old, remove from storage
                localStorage.removeItem (itemName);
            }
        }
    }

    function SortLocalStorage() {

        var localStorageArray = [];

        if(localStorage.length > 0) {
            for (var i=0; i<localStorage.length; i++){
                localStorageArray[i] = localStorage.key(i)+ "_" +localStorage.getItem(localStorage.key(i));
            }
        }

        return localStorageArray.sort();
    }

    function timeConverter(UNIX_timestamp) {
     var a = new Date(UNIX_timestamp*1000);
     var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
         var year = a.getFullYear();
         var month = months[a.getMonth()];
         var date = a.getDate();
         var hour = a.getHours();
         var min = a.getMinutes();
         var sec = a.getSeconds();
         var time = date+','+month+' '+year+' '+hour+':'+min+':'+sec ;
         return time;
    }

    function ShowLinks () {
        for (var J = localStorage.length - 1;  J >= 0;  --J) {
            var itemName    = localStorage.key (J);

            // Get saved links
            if (/^Visited_\d+$/i.test (itemName) ) {
                $('a[href="' + localStorage[itemName] + '"]').closest('div.thing:not(.promoted)').fadeToggle(fade_time);
            }
        }
    }

    this.LinkIsNewPub = function (linkObj) {
        LinkIsNew(linkObj);
    };

    function LinkIsNew (linkObj) {
        var href = linkObj.attr('href');

        href = href.replace(/^(http|https)\:\/\//g, '');       

        if (visitedLinkArry.indexOf (href) == -1) {
            visitedLinkArry.push (href);
        
            var timestamp = new Date().getTime();

            var itemName    = 'Visited_' + timestamp;
            localStorage.setItem (itemName, href);
            numVisitedLinks++;
            
            // Hide links imideately after klicked. Makes it impossible to see commenst afterward.
            //$('a[href="' + href + '"]').closest('div').fadeOut(fade_time);
        }
        centerView(linkObj);
        shrinkLinks(linkObj);
        setActiveElement(linkObj);

        return true;
    }

    function shrinkLinks (linkObj) {

        // Alter the look of clicked links imideately
        var mainLinkElement = linkObj.closest('div.thing:not(.promoted)');

        // Remove elements that are nor needed in the smll view
        mainLinkElement.find('p.tagline').remove();
        mainLinkElement.find('a.thumbnail').css({'opacity': '0', 'width': '0px'});
        mainLinkElement.find('a.thumbnail').hide(fade_time, function () {
            $(this).remove();
        });
        mainLinkElement.find('span.domain').remove();
        mainLinkElement.find('div.expando-button').remove();
        mainLinkElement.find('li a.manHideLink').remove();
        mainLinkElement.find('span.linkflairlabel').remove();

        // Realign elements for the small view
        var animObj = {"queue": false, "duration": fade_time};

        mainLinkElement.find('a.title').animate({'font-size': '9px', 'margin': '0px'}, animObj);
        mainLinkElement.find('p.title').css({'float': 'left', 'margin-left': '10px', 'font-size': '9px', 'font-weight': 'normal', 'margin-top': '4px', 'text-overflow': 'ellipsis', 'max-width': '300px', 'white-space': 'nowrap', 'overflow': 'hidden'});

        mainLinkElement.find('ul.flat-list.buttons').animate({'margin-left': '10px', 'font-size': '9px', 'margin-top': '0px'}, animObj);
        mainLinkElement.find('span.rank').animate({'margin-top': '1px', 'font-size': '10px'}, animObj);

        mainLinkElement.find('div.midcol').css("cssText", "width: 110px !important;"); //jquery hack to apply important
        mainLinkElement.find('div.midcol').css({'margin-top': '0px', 'margin-bottom': '0px', 'height': 'unset'});
        mainLinkElement.find('div.arrow').css({'float': 'left'});

        mainLinkElement.find('div.score').css({'float': 'left'});
        mainLinkElement.find('div.score').animate({'font-size': '10px', 'padding-left': '10px', 'padding-right': '10px', 'margin-top': '3px', 'width': '30px'}, animObj);
        mainLinkElement.find('div.entry').css({'padding': '0px'});

        //main div
        mainLinkElement.css({'padding': '0px'});
        mainLinkElement.css({'padding-left': '10px', 'opacity': '0.4', 'margin': '4px'});
        //mainLinkElement.find('p.tagline').css({'float': 'right'});
        mainLinkElement.addClass('shrinked');

        return true;
    }

    this.GetVisitedLinkCount = function () {
        return numVisitedLinks;
    };

    function centerView(elm) {

        var offsetTop = $(elm).offset().top;
        var newTopPos = offsetTop - $(window).scrollTop();
        var elemLimitPos = $(window).height() / 2;

        //console.log("offsetTop: " + offsetTop);
        //console.log("newTopPos: " + newTopPos);        
        //console.log("elemLimitPos: " + elemLimitPos);

        if ( newTopPos > elemLimitPos ) {
            $('html,body').animate({
                scrollTop: offsetTop - 50
            }, 800);
        }
    }

    $('a.title').click(function() {
        LinkIsNew($(this));
    });
 
    $('#hidesidebar').click(function(event) {
        event.preventDefault();

        $(".side").toggle();
    });

    if (toggle_links_button && hide_links) {
        $('#show_links button').click (function() {
            ShowLinks();
        });
    }

    if (add_manual_hide_link) {
        $('a.manHideLink').click (function(event) {
            event.preventDefault();
            var $titleLink = $(this).closest('div.thing:not(.promoted)').find('a.title');

            LinkIsNew($titleLink);
        });
    }
}
