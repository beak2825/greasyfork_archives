// ==UserScript==
// @name         Hentai Heroes image viewer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows you to display any stage image of any harem girl, owned ones or not. Works also in event display and Places of Power. Includes zoom-in feature to display full-size girl images gallery (lightbox).
// @author       randomfapper34
// @match        http*://nutaku.haremheroes.com/*
// @match        http*://*.hentaiheroes.com/*
// @match        http*://*.gayharem.com/*
// @match        http*://*.comixharem.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/402066/Hentai%20Heroes%20image%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/402066/Hentai%20Heroes%20image%20viewer.meta.js
// ==/UserScript==

// gayharem image link head:    gh1
// hentaiharem image link head: hh2
// comixharem image link head:  ch

var $ = window.jQuery;
var haremHead = (function() {
    var haremType = ($('body#hh_gay').length > 0) ?
                    'gh1' :
                    ($('body#hh_comix').length > 0) ? 'ch' : 'hh2';
    return 'https://' + haremType;
})();
var wikiLink = (function() {
    var haremType = ($('body#hh_gay').length > 0) ?
                    'harem-battle.club/wiki/Gay-Harem/GH:' :
                    ($('body#hh_comix').length > 0) ? '' : 'harem-battle.club/wiki/Harem-Heroes/HH:';
    return haremType;
})();
var CurrentPage = window.location.pathname;
var sheet = (function() {
	var style = document.createElement('style');
	document.head.appendChild(style);
	return style.sheet;
})();
var imageExt = '-1200x.webp'; //old ext: '.png';
var icoExt = '-300x.webp';

$(document).ready(function() {
    //include lightbox css
    $(document.head).append(
        '<link href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.css" rel="stylesheet" type="text/css">'
    );
    //define own css
    defineCss();
});

// current page: Activities (PoP)
if (CurrentPage.indexOf('activities') != -1)
{
    if ($('.pop_list').css('display') != 'none') return;

    setTimeout(async function () {
        var popElement = $('#activities #pop.canvas');
        var popImage = popElement.find('.pop_left_part img');
        var popRewardInfo = popElement.find('.pop_rewards_display.reward_wrap').attr('data-reward-display');
        var popImageIcon = popElement.find('.pop_rewards_display .shards_girl_ico img');
        //if girl is won, there is no shards data in popRewardInfo, and therefore no id. Use regex to get girl id from image link?
        var jsonReward = JSON.parse(popRewardInfo);
        if (!jsonReward.hasOwnProperty('shards')) return;
        var girlInfo = jsonReward.shards[0];
        var girlId = girlInfo.id_girl;
        var girlGrades = girlInfo.graded2.split('<g').length - 1;

        //check for image existance with high grades (always work no matter the webpage display chages)
        if (girlGrades == 0) {
            girlGrades = 5;
            var checkImageLink = haremHead + '.hh-content.com/pictures/girls/' + girlId + '/ava5' + imageExt;
            if (await checkUrlResponse(checkImageLink) === false) girlGrades = 3;
        }

        //create diamonds on the top part
        popElement.find('.diamond-bar').remove();
        var allDiamonds = '';
        for (var i = 0; i <= girlGrades; i++) {
            var diamondToAdd = '<div class="diamond unlocked" grade="' + i + '"></div>';
            allDiamonds += diamondToAdd;
        }
        popImage.before('<div class="diamond-bar-container"><div class="diamond-bar">' + allDiamonds + '</div></div>');

        //connect diamonds to image links
        var allLinks = popElement.find('.diamond');
        var linksArray = [];
        for (i = 0; i <= girlGrades; i++) {
            var imgLink = haremHead + '.hh-content.com/pictures/girls/' + girlId + '/ava' + i + imageExt;
            var icoLink = haremHead + '.hh-content.com/pictures/girls/' + girlId + '/ico' + i + icoExt;
            linksArray.push(imgLink);
            $(allLinks.get(i)).attr("link", imgLink);
            $(allLinks.get(i)).attr("icoLink", icoLink);
        }

        $( ".pop_left_part .diamond-bar .diamond" ).on('mouseenter', function() {
            var girlAvatarLink = $(this).attr('link');
            var girlIconLink = $(this).attr('icoLink');
            popImage.attr('src', girlAvatarLink);
            popImageIcon.attr('src', girlIconLink);
        });

        //create zooming event
        $(popImage).removeData('allImages');
        $(popImage).data('allImages', linksArray);
        $(popImage).on('mouseup', zoomIntoImage);
    }, 50);
}

// current page: Event box
if (CurrentPage.indexOf('event') != -1)
{
    var eventGirlElementSelector = ".nc-event-list-rewards-container .nc-event-list-reward-container"
    var rewardBox = ".nc-event-reward-container.selected ";
    var eventGirlImageSelector = ".canvas " + rewardBox + " .nc-event-reward-preview";
    var eventGirlInfoSelector = ".canvas " + rewardBox + " .nc-event-reward-info";

    setTimeout(function () {
        $(eventGirlElementSelector + ".selected").click();
    }, 50);

    $(eventGirlElementSelector).on('click', function() {
        setTimeout(async function () {
            var girlImageDiv = $(eventGirlImageSelector);
            var girlInfoDiv = $(eventGirlInfoSelector);
            var girlInfo = girlInfoDiv.find('.new_girl_info .girl_tooltip_grade');
            var girlGrades = girlInfo.find('g').length;
            var girlIconImage = $(".nc-event-list-rewards-container > .nc-event-list-reward-container.selected img");
            var girlImage = girlImageDiv.children('img');
            girlImageDiv.find('.diamond-bar').remove();

            //find girl id from image src
            var girlImageSrc = girlImage.attr('src');
            var startPosition = girlImageSrc.indexOf('pictures/girls/') + 'pictures/girls/'.length;
            var girlIdStr = girlImageSrc.substring(startPosition, girlImageSrc.lastIndexOf('/ava'));
            if (isNaN(girlIdStr))
                return;
            var girlId = parseInt(girlIdStr);

            //check for image existance with high grades (always work no matter the webpage display chages)
            if (girlGrades == 0) {
                girlGrades = 5;
                var checkImageLink = haremHead + '.hh-content.com/pictures/girls/' + girlId + '/ava' + girlGrades + imageExt;
                if (await checkUrlResponse(checkImageLink) === false) girlGrades = 3;
            }

            //create diamonds on the top part
            var allDiamonds = '';
            for (var i = 0; i <= girlGrades; i++) {
                var diamondToAdd = '<div class="diamond unlocked" grade="' + i + '"></div>';
                allDiamonds += diamondToAdd;
            }
            girlImage.before('<div class="diamond-bar">' + allDiamonds + '</div>');

            //connect diamonds to image links
            var allLinks = girlImageDiv.find('.diamond');
            var linksArray = [];
            for (i = 0; i <= girlGrades; i++) {
                var imgLink = haremHead + '.hh-content.com/pictures/girls/' + girlId + '/ava' + i + imageExt;
                var icoLink = haremHead + '.hh-content.com/pictures/girls/' + girlId + '/ico' + i + icoExt;
                linksArray.push(imgLink);
                $(allLinks.get(i)).attr("link", imgLink);
                $(allLinks.get(i)).attr("icoLink", icoLink);
            }

            $( rewardBox + " .diamond-bar .diamond" ).on('mouseenter', function() {
                var girlAvatarLink = $(this).attr('link');
                var girlIconLink = $(this).attr('icoLink');
                girlImage.attr('src', girlAvatarLink);
                girlIconImage.attr('src', girlIconLink);
            });

            //create zooming event
            $(girlImage).removeData('allImages');
            $(girlImage).data('allImages', linksArray);
            $(girlImage).off('mouseup', zoomIntoImage);
            $(girlImage).on('mouseup', zoomIntoImage);
        }, 10);
    });
}

// current page: Harem
if (CurrentPage.indexOf('harem') != -1)
{
    var callback = function(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.outerHTML) {
                        node.addEventListener('click', onGirlClick, false);
                    }
                });
            }
        }
    };

    const targetNode = document.querySelector('#harem_left div.girls_list');
    const config = { childList: true };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    $( ".girls_list div[id_girl]" ).on('click', onGirlClick);

    function onGirlClick(event) {
        var girlId = $(this).children('[girl]').attr('girl');
        var girlGrades = $(this).find('.graded').children().length;
        var girlName = $(this).find('div.right h4')[0].innerText;
        updateInfo(girlId, girlGrades, girlName);
    }

    setTimeout(function () {
        //update view of girl currently selected when loading the harem
        $("#harem_left div.girls_list div[girl].opened").click();
    }, 200);

    function updateInfo(girlId, girlGrades, girlName)
    {
        setTimeout(function () {
            var haremRight = $('#harem_right');
            haremRight.children('[girl]').each( function() {
                if (girlId == 0) girlId = $(this).attr('girl');

                var notOwned = $(this).children('.missing_girl');
                var girlImageDiv = $(this).find('.avatar-box');
                var girlIconDiv = $("#harem_left div.girls_list div[girl].opened div.left img");

                if (notOwned.length > 0) {
                    //create diamonds on the bottom part
                    var allDiamonds = '';
                    for (var i = 0; i <= girlGrades; i++) {
                        var diamondToAdd = '<div class="diamond locked" grade="' + i + '"></div>';
                        allDiamonds += diamondToAdd;
                    }

                    $(this).find('.middle_part').css('margin', '0');
                    $(this).find('.dialog-box').after('<h3>' + girlName + '</h3>');
                    $(this).find('img.avatar').wrap('<div class="avatar-box"></div>');
                    $(this).find('.avatar-box').css('margin-top', '23px');
                    $(this).find('.avatar-box').after('<div class="diamond-bar">' + allDiamonds + '</div>');
                }

                //update for any girl (owned or not)
                var wikiBase = wikiLink;
                if (wikiBase != '') {
                    $(this).find('h3').wrap('<div class="WikiLink"></div>').wrap('<a href="https://' + wikiBase + girlName + '" target="_blank"></a>');
                }
                var allLinks = $(this).find('.diamond');
                var linksArray = [];
                for (i = 0; i <= girlGrades; i++) {
                    var imgLink = haremHead + '.hh-content.com/pictures/girls/' + girlId + '/ava' + i + imageExt;
                    var icoLink = haremHead + '.hh-content.com/pictures/girls/' + girlId + '/ico' + i + icoExt;
                    linksArray.push(imgLink);
                    $(allLinks.get(i)).attr("link", imgLink);
                    $(allLinks.get(i)).attr("icoLink", icoLink);
                }
                $('.avatar-box img.avatar').removeData('allImages');
                $('.avatar-box img.avatar').data('allImages', linksArray);
                if (notOwned) $('.avatar-box img.avatar').attr('src', linksArray[0]);

                $('.variation_block .big_border').on('click', function() {
                    var girlId = $(this).children('[girl]').attr('girl');
                    var girlGrades = $(this).find('.graded').children().length;
                    setTimeout(function() {
                        updateInfo(girlId, girlGrades, girlName);
                    }, 50);
                });

                $( ".diamond-bar .diamond" ).on('mouseenter', function() {
                    var mainParent = $(this).closest('.middle_part');
                    var girlAvatar = mainParent.find('img.avatar');
                    var girlAvatarLink = $(this).attr('link');
                    var girlIconLink = $(this).attr('icoLink');
                    girlIconDiv.attr('src', girlIconLink);
                    girlAvatar.attr('src', girlAvatarLink);
                });

                $('.avatar-box img.avatar').on('mouseup', zoomIntoImage);
            });
        }, 0);
    }
}

//zoom into image with lightbox, event only on left click
function zoomIntoImage(e)
{
    if (e.which != 1) return;

    var linksArray = $(this).data('allImages');
    var girlAvatarLink = $(this).attr('src');
    var indexOfQuestion = girlAvatarLink.lastIndexOf('?');
    if (indexOfQuestion >= 0) girlAvatarLink = girlAvatarLink.slice(0, indexOfQuestion);
    var indexOfCurrent = linksArray.indexOf(girlAvatarLink);

    var allImages = [];
    for (var i = 0; i < linksArray.length; i++) {
        allImages.push({
            src  : linksArray[i].toString(),
            type : 'image',
            opts : {
                caption : i == 0 ? 'Default' : 'Stage ' + i
            }
        });
    }

    $.fancybox.open(allImages, {
        loop : true,
        keyboard: true,
        transitionEffect: "tube"
    }, indexOfCurrent);
}

//checks for any errors in url (like image 404)
async function checkUrlResponse(url)
{
    let result = false;

    await fetch(url.toString())
    .then(function(response) {
        if (response.status >= 200 && response.status <= 299) {
            return response;
        } else {
            throw Error(response.statusText);
        }
    }).then(function(response) {
        result = true;
    }).catch(function(error) {
    });

    return result;
}

function defineCss()
{
    sheet.insertRule('#harem_left div[girl]>.left>img, #harem_right>div[girl] .middle_part div.avatar-box img.avatar, #shops #girls_list .g1 .girl-ico>img {'
                     + 'image-rendering: initial; }');

    sheet.insertRule('#harem_right .WikiLink a {'
                     + 'text-decoration: none; }');

    sheet.insertRule('#harem_right .diamond-bar {'
                     + 'margin-top: 4px; }');

    sheet.insertRule('.rewards-stats .diamond-bar {'
                     + 'position: static;'
                     + 'justify-content: center;'
                     + 'margin-top: 42px;'
                     + 'margin-bottom: -40px; }');

    sheet.insertRule('.generic-girl-image .diamond-bar, .nc-event-reward-preview .diamond-bar {'
                     + 'justify-content: center;'
                     + 'z-index: 1;'
                     + 'width: 100%; }');

    sheet.insertRule('.rewards-stats .avatars-drawn-bottom-part .diamond-bar {'
                     + 'margin-top: 275px; }');

    sheet.insertRule('.rewards-stats .avatars-drawn-bottom-part img {'
                     + 'margin-top: -275px; }');

    sheet.insertRule('.nc-event-reward-preview .diamond-bar {'
                     + 'margin-top: -25px; }');

    sheet.insertRule('.rewards-stats .diamond-bar .diamond.unlocked, .pop_left_part .diamond-bar .diamond.unlocked, .generic-girl-image .diamond-bar .diamond.unlocked {'
                     + 'cursor: default; }');

    sheet.insertRule('.pop_left_part .diamond-bar-container {'
                     + 'z-index: 5;'
                     + 'position: absolute; }');

    sheet.insertRule('.pop_left_part .diamond-bar {'
                     + 'position: relative;'
                     + 'left: 50%; }');

    sheet.insertRule('#harem_right .diamond-bar .diamond:hover, .rewards-stats .diamond-bar .diamond:hover, .pop_left_part .diamond-bar .diamond:hover, .generic-girl-image .diamond-bar .diamond:hover, .nc-event-reward-preview .diamond-bar .diamond:hover {'
                     + 'border: 2px solid #FE00FE; }');

    sheet.insertRule('.avatar-box img, .event-widget.special-fullscreen-view .widget .rewards-stats .reward img, .generic-girl-image img, .nc-event-reward-preview img {'
                     + 'cursor: zoom-in; }');

    sheet.insertRule('#pop.canvas .pop_left_part img.pop_left_fade_page {'
                     + 'margin-bottom: 10px;'
                     + 'cursor: zoom-in; }');
}