// ==UserScript==
// @name         TBT
// @namespace    https://github.com/runisco
// @version      2.4.1
// @supportURL   https://github.com/Runisco/TBT/issues
// @description  Resizes the thumbnails to make them easier to see
// @author       Runisco
// @match        https://simpcity.su/*
// @match        https://simpcity.su/search/*
// @match        https://simpcity.su/search-forums/trending/
// @match        https://simpcity.su/whats-new/*
// @match        https://simpcity.su/tags/*
// @exclude      https://simpcity.su/forums/helping-the-community.35/
// @match        https://simpcity.cr/*
// @match        https://simpcity.cr/search/*
// @match        https://simpcity.cr/search-forums/trending/
// @match        https://simpcity.cr/whats-new/*
// @exclude      https://simpcity.cr/forums/helping-the-community.35/
// @icon         data:image/png;base64,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
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/518850/TBT.user.js
// @updateURL https://update.greasyfork.org/scripts/518850/TBT.meta.js
// ==/UserScript==

/* globals $, GM_config */

var debug = true

var iconData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAPZJREFUWEftlrENwjAQRb8bWppzSQcN9AwArAEVHQPQUdAxAAuQNYCGGWABRJWrYIBDQbYUgiESSpzm0sa+e3r37cSg4cc03B8KoAbUgBowzLwHMC65kB4AFiLSM8YsAbQC619riCjJ3jHzGUC/pO7tYwQOaJgv5oukabp2ACcimuSLu4ad0L4cUBvAjIiOfm9lAL/gogKISGKtnRfVO0P1GXANQESD0NyrBgiFMOt7iQUQCqE/TYdiQKNkgJmnALYA7sWkxwIYAdi5+b8dtVgA3sA1lIOqQ/jtIuqKyMZau6r7GJZexX8DxP5J1c+xGlADaqBxA0+67ujJ2qrzbQAAAABJRU5ErkJggg=='
var menuIcon = $('<a href="#" id="tbtConfig" class="p-navgroup-link u-ripple p-navgroup-link--iconic p-navgroup-link--conversations js-badge--conversations badgeContainer rippleButton"><img width="23" height="5" src="' + iconData + '"></img></a>')
menuIcon.insertAfter($('.p-navgroup-link--alerts'))
$('#tbtConfig').click(function(e){
    e.preventDefault();
    GM_config.open();
})

GM_config.init(
    {
        'id': 'TBThumbnailResize',
        'title': 'TBThumbnailResize Config',
        'fields':
        {
            'tbtThumbnailEnable':
            {
                'section': 'Features',
                'label': 'Enable thumbnail resize',
                'type': 'checkbox',
                'title': 'Check to enable thumbnail resize',
                'default': false
            },
            'tbtGenreSelection':
            {
                'type': 'checkbox',
                'label': 'Genre shortcuts',
                'title': 'Check to enable the genre shortcuts',
                'default': false
            },
            'tbtWidth':
            {
                'section': 'Image Size',
                'label': 'Width',
                'labelPos': 'Left',
                'type': 'int',
                'default': 300
            },
            'tbtHeight':
            {
                'label': 'Height',
                'type': 'int',
                'default': 200
            },
            'resizeDefault':
            {
                'label': 'Resize default',
                'type': 'checkbox',
                'title': 'Should default thumbnails (no image) be resized to keep titles flush with eachother?',
                'default': true
            },

        },
        'events': // Callback functions object
        {
            'save': function() {reloadOptionsOnSave()},
            'open': function(){
                var config_ui = this.frame;
                config_ui.style.height = '30%';
                config_ui.style.margin = 'auto';
                config_ui.style.width = '20%';
                config_ui.style.left = '40%';
            }
        },
        'css':'#TBThumbnailResize_field_tbtWidth{width: 10%} #TBThumbnailResize_field_tbtHeight{width: 10%}'
    });

function resizeThumbnails(reset=false){
    let newWidth = GM_config.get('tbtWidth');
    let newHeight = GM_config.get('tbtHeight');
    let resizeDefault = GM_config.get('resizeDefault');
    //console.log("newWidth: " + newWidth)
    //console.log("newHeight: " + newHeight)
    //console.log("reset default? :" + GM_config.get('resizeDefault'))
    var regular = true
    var blockbody = false
    var structitemcontainer = false

    if (['/trending/'].some(v => String(window.location.href).includes(v)) && !['/search-forums/'].some(v => String(window.location.href).includes(v))){
        regular = false
        if (debug){console.log("resizeThumbnails func: alternate page type found. regular set to false, jumping.")}
    } else if (["/whats-new/posts/", "/watched/", "/find-threads/", "/search-forums/"].some(v => String(window.location.href).includes(v))){
        regular = false
        structitemcontainer = true
        if (debug){console.log("resizeThumbnails func: structitemcontainer page type found. structitemcontainer set to true, jumping.")}
    }else if (["/search/", "/whats-new/", "/tags/"].some(v => String(window.location.href).includes(v))){
        regular = false
        blockbody = true
        if (debug){console.log("resizeThumbnails func: blockbody page type found. blockbody set to true, jumping.")}
    }
    // if (debug){console.log("Regular: " + regular + "\nSearch: " + search)}

    if (regular){
        $('.js-threadList').find('a.dcThumbnail').each(function(index){
            if (debug){console.log("resizeThumnails func: Attempted to go through each a.dcThumbnail in .js-threadList")}
            let thumbUrl = $(this).find('img').attr('style')
            if(reset){
                $(this).parent().parent().attr('style','width: calc(75px + 19px); height: calc(50px + 5px);')
                $(this).attr('style','width: 75px; height: 50px; border-radius: 4px')
            }else if(!thumbUrl.includes('-Default-Thumbnail.png')){
                $(this).parent().parent().attr('style','width: calc(' + newWidth + 'px + 19px); height: calc(' + newHeight + 'px + 5px);')
                $(this).attr('style','width: ' + newWidth + 'px; height: ' + newHeight + 'px; border-radius: 4px')
            } else {
                if (resizeDefault){
                    $(this).parent().parent().attr('style','width: calc(' + newWidth + 'px + 19px); height: calc(50px + 5px);')
                    $(this).attr('style','width: ' + newWidth + 'px; height: 50; border-radius: 4px')
                } else {
                    $(this).parent().parent().attr('style','width: calc(75px + 19px); height: calc(50px + 5px);')
                    $(this).attr('style','width: 75px; height: 50; border-radius: 4px')
                }
            }
            //
            // Below code is before the migration after crash in july 2024, saved just in case.
            //

            // $('.js-threadList').find('a.DC_ThreadThumbnail_image').each(function(index){
            //     let thumbUrl = $(this).find('img').attr('style')
            //     console.log(thumbUrl)
            //     if(reset){
            //         $(this).attr('style','width: 75px; height: 50px;')
            //     }else if(!thumbUrl.includes('-Default-Thumbnail.png')){
            //         $(this).attr('style','width: ' + newWidth + 'px; height: ' + newHeight + 'px;')
            //     } else {
            //         if (resizeDefault){
            //             $(this).attr('style','width: ' + newWidth + 'px; height: 50;')
            //         } else {
            //             $(this).attr('style','width: 75px; height: 50;')
            //         }
            //     }
            // });
        });
    } else if(structitemcontainer){
        if (debug){console.log("resizeThumnails func: Landed inside alternate method")}
        $('.structItemContainer').find('a.dcThumbnail').each(function(index){
            let thumbUrl = $(this).find('img').attr('style')
            if(reset){
                $(this).parent().parent().attr('style','width: calc(75px + 19px); height: calc(50px + 5px);')
                $(this).attr('style','width: 75px; height: 50px; border-radius: 4px')
            }else if(!thumbUrl.includes('-Default-Thumbnail.png')){
                $(this).parent().parent().attr('style','width: calc(' + newWidth + 'px + 19px); height: calc(' + newHeight + 'px + 5px);')
                $(this).attr('style','width: ' + newWidth + 'px; height: ' + newHeight + 'px; border-radius: 4px')
            } else {
                if (resizeDefault){
                    $(this).parent().parent().attr('style','width: calc(' + newWidth + 'px + 19px); height: calc(50px + 5px);')
                    $(this).attr('style','width: ' + newWidth + 'px; height: 50; border-radius: 4px')
                } else {
                    $(this).parent().parent().attr('style','width: calc(75px + 19px); height: calc(50px + 5px);')
                    $(this).attr('style','width: 75px; height: 50; border-radius: 4px')
                }
            }
        });

    } else if(blockbody){
        if (debug){console.log("resizeThumnails func: Landed inside search method")}
        $('.block-body').find('a.dcThumbnail').each(function(index){
            let thumbUrl = $(this).find('img').attr('style')
            if(reset){
                $(this).parent().parent().attr('style','width: calc(75px + 19px); height: calc(50px + 5px);')
                $(this).attr('style','width: 75px; height: 50px; border-radius: 4px')
            }else if(!thumbUrl.includes('-Default-Thumbnail.png')){
                $(this).parent().parent().attr('style','width: calc(' + newWidth + 'px + 19px); height: calc(' + newHeight + 'px + 5px);')
                $(this).attr('style','width: ' + newWidth + 'px; height: ' + newHeight + 'px; border-radius: 4px')
            } else {
                if (resizeDefault){
                    $(this).parent().parent().attr('style','width: calc(' + newWidth + 'px + 19px); height: calc(50px + 5px);')
                    $(this).attr('style','width: ' + newWidth + 'px; height: 50; border-radius: 4px')
                } else {
                    $(this).parent().parent().attr('style','width: calc(75px + 19px); height: calc(50px + 5px);')
                    $(this).attr('style','width: 75px; height: 50; border-radius: 4px')
                }
            }
        });
    }



    if (['whats-new', 'watched/threads'].some(v => String(window.location.href).includes(v))){
        $('.structItemContainer').find('a.avatar.DC_ThreadThumbnail_image ').each(function(index){
            let thumbUrl = $(this).find('img').attr('style')
            if(reset){
                $(this).attr('style','width: 75px; height: 50px;')
            }else if(!thumbUrl.includes('-Default-Thumbnail.png')){
                $(this).attr('style','width: ' + newWidth + 'px; height: ' + newHeight + 'px;')
            } else {
                if (resizeDefault){
                    $(this).attr('style','width: ' + newWidth + 'px; height: 50;')
                } else {
                    $(this).attr('style','width: 75px; height: 50;')
                }
            };
        });
    };
}


function genreSelection(reset=false){
    var entryPoint = $("[data-widget-definition='members_online']")
    var genreBlock = $(`
<div class="block" id="genreSelection" data-widget-section="genreBlock" data-widget-id="117" data-widget-key="forum_overview_select_genre" data-widget-definition="genre_selection">
<div class="block-container">
<h3 class="block-minorHeader">Select Genre</h3>
<div class="block-body">
<div class="block-row block-row--minor">
<ul class="listInline listInline--comma">


<li><a href="?prefix_id[0]=3" class="labelLink" rel="nofollow"><span class="label label--onlyfans" dir="auto">Onlyfans</span></a></li>
<li><a href="?prefix_id[0]=39" class="labelLink" rel="nofollow"><span class="label label--fansly" dir="auto">Fansly</span></a></li>
<li><a href="?prefix_id[0]=12" class="labelLink" rel="nofollow"><span class="label label--asian" dir="auto">Asian</span></a></li>
<li><a href="?prefix_id[0]=13" class="labelLink" rel="nofollow"><span class="label label--thicc" dir="auto">T.H.I.C.C</span></a></li>
<li><a href="?prefix_id[0]=14" class="labelLink" rel="nofollow"><span class="label label--teen" dir="auto">Teen</span></a></li>
<li><a href="?prefix_id[0]=15" class="labelLink" rel="nofollow"><span class="label label--brazil" dir="auto">Brazil</span></a></li>
<li><a href="?prefix_id[0]=16" class="labelLink" rel="nofollow"><span class="label label--celeb" dir="auto">Celeb</span></a></li>
<li><a href="?prefix_id[0]=18" class="labelLink" rel="nofollow"><span class="label label--cosplay" dir="auto">Cosplay</span></a></li>
<li><a href="?prefix_id[0]=19" class="labelLink" rel="nofollow"><span class="label label--trans" dir="auto">Trans</span></a></li>
<li><a href="?prefix_id[0]=43" class="labelLink" rel="nofollow"><span class="label label--bbw" dir="auto">BBW</span></a></li>
<li><a href="?prefix_id[0]=44" class="labelLink" rel="nofollow"><span class="label label--asmr" dir="auto">ASMR</span></a></li>
<li><a href="?prefix_id[0]=46" class="labelLink" rel="nofollow"><span class="label label--milf" dir="auto">MILF</span></a></li>
<li><a href="?prefix_id[0]=47" class="labelLink" rel="nofollow"><span class="label label--petite" dir="auto">Petite</span></a></li>
<li><a href="?prefix_id[0]=48" class="labelLink" rel="nofollow"><span class="label label--feet" dir="auto">Feet</span></a></li>
<li><a href="?prefix_id[0]=49" class="labelLink" rel="nofollow"><span class="label label--latina" dir="auto">Latina</span></a></li>
<li><a href="?prefix_id[0]=50" class="labelLink" rel="nofollow"><span class="label label--ebony" dir="auto">Ebony</span></a></li>
<li><a href="?prefix_id[0]=86" class="labelLink" rel="nofollow"><span class="label label--indian" dir="auto">Indian</span></a></li>
<li><a href="?prefix_id[0]=87" class="labelLink" rel="nofollow"><span class="label label--ftm" dir="auto">FtM</span></a></li>

</ul>
</div>
</div>
</div>
</div>`)
    if (reset){
        $('#genreSelection').remove()
    } else {
        genreBlock.insertAfter(entryPoint)
    };
}

function reloadOptionsOnSave(){
    if(GM_config.get('tbtThumbnailEnable')){
        resizeThumbnails();
    } else {
        resizeThumbnails(true);
    };
    if(GM_config.get('tbtGenreSelection')){
        genreSelection();
    } else {
        genreSelection(true);
    };
}

$(document).ready(function(){
    if (debug){console.log("Main document ready")}
    if(GM_config.get('tbtThumbnailEnable')){
        resizeThumbnails()
        if (debug){console.log("main document ready: attempted resize on thumnails")}
    }
    if(GM_config.get('tbtGenreSelection')){
        genreSelection()
        if (debug){console.log("main document ready: added genre selection box")}
    }
})
