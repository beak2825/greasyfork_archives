// ==UserScript==
// @name         Reddit Fix
// @namespace    http://tampermonkey.net/
// @version      1.9.8
// @description  Hide subreddits, remove promoted links, see full image actually shows the full image, html5 video player, remove background effects, copy video adress
// @author       Bum
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        https://www.reddit.com/*
// @match        https://new.reddit.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/404497/Reddit%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/404497/Reddit%20Fix.meta.js
// ==/UserScript==

var holdTopicsInMemory = "false";
var commentEffects = "false";
var originalBehavior = "false";
var topicLimitInDom = 70;
var lastScrollTop = 0;
var scrollTopWhenREmoved = -1;
var menuButtonWasAdded = false;
var subsToHide = "";
var removeBorderRadius = false;
var hideRecentSection = false;
var customFeedState = "open";
var hidePromotedlinks = true;

var lastTopicRemovedTime =  new Date().getTime();

if (localStorage.getItem("removeBorderRadius") != null) {
    removeBorderRadius = localStorage.getItem("removeBorderRadius");
}
if (localStorage.getItem("holdTopicsInMemory") != null) {
    holdTopicsInMemory = localStorage.getItem("holdTopicsInMemory");
}

if (localStorage.getItem("commentEffects") != null) {
    commentEffects = localStorage.getItem("commentEffects");
}

if (localStorage.getItem("originalBehavior") != null) {
    originalBehavior = localStorage.getItem("originalBehavior");
}
if (localStorage.getItem("subsToHide") != null) {
    subsToHide = localStorage.getItem("subsToHide");
}
if (localStorage.getItem("hidePromotedlinks") != null) {
    hidePromotedlinks = localStorage.getItem("hidePromotedlinks");
}

if (localStorage.getItem("hideRecentSection") != null){
    hideRecentSection = localStorage.getItem("hideRecentSection");
}
if (localStorage.getItem("customFeedState") != null){
    customFeedState = localStorage.getItem("customFeedState");
}


var topicsInMemory = [];
var isAPop = false;
var maxOffset = 0;

(function() {
    'use strict';
    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyle") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyle";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    function RemoveCssRule(css) {
        const style = document.getElementById("GM_addStyle") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyle";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        for (var i=0; i<sheet.cssRules.length; i++) {
            if (sheet.cssRules[i].selectorText == css) {
                sheet.deleteRule (i);
            }
        }
    }
    fRemoveBorderRadius(removeBorderRadius);
    fHideRecentSection(hideRecentSection);

    fRemovePromoted(hidePromotedlinks);

    HideAllSubs();
    if (commentEffects == "false")
    {
        GM_addStyle ( 'img[src*="flame"]{display:none;}' );
        GM_addStyle ( 'div[aria-role="presentation"]{box-shadow:none !important;background : transparent !important;}' );
    }
    GM_addStyle ( '.wwHbgRV0ZXGp5CHHlpo5u{display:block !important;}' );
    GM_addStyle ( '._1Q2mF3u7v9hBVu_4bkC7R4{display:block !important;}' );
    GM_addStyle ( '._3hUbl08LBz2mbXjy0iYhOS,._3b8u2OJXaSDdBWoRB7zUoK {height: 50px !important;width: 100% !important; bottom: 0 !important;}' );


    GM_addStyle ( '._3UEq__yL-82zX4EyuluREz,.gUpEQXQu8G8UvISmBIPsj,._1RZSSlyqzokrcxh0ESwE2e{display:none !important;}' );
    GM_addStyle ( '.vLH0XV-l8Y4mNGUvw4HHy{display:none !important;}' );
    GM_addStyle ( '.eI6Ep6BNFA5DZjPWNVb4,._2XQ3ZY6qCbEm9_WtvLLFru{display:none !important;}' );

    //POPUP
    GM_addStyle('.fixmodal {position:fixed;background-color:rgba(0, 0, 0, 0.5);height:100%;width:100%;top:0;left:0;display:none; z-index: 1000;}');
    GM_addStyle('#fixPopup {padding:5px;text-align:center;}');
    GM_addStyle('.fixmodalWrap {margin: 50px auto; position:relative;width: fit-content;} ');
    var maxWidthPop = window.screen.height - 200;
    GM_addStyle('#fixPopup img {max-height:'+maxWidthPop+'px;}');
    GM_addStyle('._2f5uYHvlfzs2DngQsiCdvB {height: 50px !important;width: 100% !important; position: relative !important; bottom: 50px !important;}');
    GM_addStyle('.videoFixIcon {margin: 50px auto; background: url("https://www.pngall.com/white-play-png")} ');
    GM_addStyle('.expandDivCaption {padding: 5px!important; white-space: pre-wrap !important;max-height: max-content !important; display: inline-block !important; overflow-wrap: break-word !important;} ');
    GM_addStyle('.expandSpanCaption{height: auto !important; position: absolute !important; bottom: 0;} ');
    GM_addStyle('.expandDisableClick{pointer-events: none; } ');
    GM_addStyle('.expandEnableClick{pointer-events: auto; !important; } ');
    GM_addStyle('.expandGarbageRedditCaptions{position:relative !important; } ');


    window.addEventListener('scroll', throttle(callback, 300));

    function throttle(fn, wait) {
        var time = Date.now();
        return function() {
            if ((time + wait - Date.now()) < 0) {
                fn();
                time = Date.now();
            }
        }
    }

    function getMenuItem(id, display)
    {
        return '<a class="M2Hk_S2yvXpsNPfZMBMur customRedditFixMenu" id = "'+id+'" ><div class="_1lwNBHmCQJObvqs1fXKSYR" style="margin-right: 0px;">'+display+'</div></a>';
    }

    function getCheckBoxItem(checked, id, display){

        if (checked == 'true' || checked == true)
            return '  <span style="width: 100%;"><input type="checkbox" checked id="'+ id +'" name="'+display+'" /> ' + display + '</span>';
        else
            return '<span style="width: 100%;"><input type="checkbox" id="'+ id +'" name="'+display+'" /> ' + display + '</span>';
    }

    function RemoveMenu(){
        $("#redditFixReloadAll").remove();
        $("#redditFixReload25").remove();
    }
    function AddMenu(){
        var menu = $("._2pUO1Sfe7WlIHvq6goN3Pz");
        if (menu.find(".customRedditFixMenu").length > 0 )
            return;
        menu.append(getMenuItem('redditFixReloadAll', 'Reload All'));
        $("#redditFixReloadAll").click(function(){
            for (var i = topicsInMemory.length - 1; i >= 0; --i) {
                var el = topicsInMemory.pop(i);
                $(".rpBJOHq2PR60pnwJlUyP0").prepend(el);
            }
            maxOffset = $(document).height();
        });
        menu.append(getMenuItem('redditFixReload25', 'Reload 25'));
        $("#redditFixReload25").click(function(){
            var reloadTill = topicsInMemory.length;
            if (reloadTill > 25)
                reloadTill = 25;
            for (var i = 0; i < 25; ++i) {
                var el = topicsInMemory.pop(i);
                $(".rpBJOHq2PR60pnwJlUyP0").prepend(el);
            }
            maxOffset = $(document).height();
        });
    }
    
    

    function attachCustomFeed(){
        let isReady = $('[aria-controls="multireddits_section"]').length > 0;
        if (!isReady) {
            setTimeout(attachCustomFeed, 300);
            return;
        }

        let customFeed = $('[aria-controls="multireddits_section"]').closest("faceplate-expandable-section-helper");
        customFeed.bind("click",function(){
            if ($(this).is("[open]"))
            {
                customFeedState = "open";
                localStorage.setItem("customFeedState", "open");
            }
            else{
                localStorage.setItem("customFeedState", "");
                customFeedState = "";
            }
        });
        if (customFeedState == "")
            customFeed.removeAttr("open");
    }

    function attachObserver(){
        let isReady = $(".subgrid-container").length > 0;
        if (!isReady || $(".observerIsAttached").length == 1 ) {
            setTimeout(attachObserver, 300);
            return;
        }
        HideAllSubs();
        $(".subgrid-container").addClass("observerIsAttached");
        var config = { attributes: false, childList: true, subtree: true };
        var targetNodeRoot = $(".subgrid-container").first().get(0);
        var configRoot = { attributes: false, childList: true, subtree: true };

        var callbackRoot = function(mutationsList, observer) {
            for(var mutation of mutationsList) {
                mutation.addedNodes.forEach(function(node) {

                    if ($(node).find("article.w-full")){
                        HideAllSubs();
                    }
                    // Not needed anymore, it's not virtualized by reddit so dom fixed

                    // var currentTime = new Date().getTime();
                    // var time = currentTime - lastTopicRemovedTime;
                    //                     if ($(node).find("article.w-full")){
                    //                         if ($("article.w-full").length > topicLimitInDom){
                    //                             let newHeight = $(window).scrollTop();
                    //                             $("article.w-full").slice(0,49).each(function(){
                    //                                 var currElHeight = 0;
                    //                                 if ($(this).attr("style") != ""){
                    //                                     var el = $(this);
                    //                                     if (holdTopicsInMemory)
                    //                                         topicsInMemory.push(el);
                    //                                     currElHeight = el.height();

                    //                                     if(el.find(".promotedlink")){
                    //                                     }
                    //                                     else{
                    //                                         if (currElHeight == 0){
                    //                                             currElHeight = currElHeight + 500;
                    //                                         }
                    //                                     }
                    //                                     console.log("removed:" + el);
                    //                                     el.remove();
                    //                                     newHeight = newHeight - currElHeight;
                    //                                     currElHeight = 0;
                    //                                 }
                    //                                 lastTopicRemovedTime = new Date().getTime();
                    //                                 scrollTopWhenREmoved = lastScrollTop+10000;
                    //                             });
                    //                             $(window).scrollTop(newHeight);
                    //                         }
                    //                     }
                });
            }
        };


        var observerroot = new MutationObserver(callbackRoot);
        observerroot.observe(targetNodeRoot, config);
    }

    function fadeOutThePicture(){
        $(".fixmodal").fadeOut("fast");
        document.removeEventListener("click", fadeOutThePicture);
    }

    function doSomething() {
        attachObserver();
    }

    let currentUrl = location.href;

    setInterval(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            doSomething();
        }
    }, 500);

    $(document).on("mousedown", "._15nNdGlBIgryHV04IfAfpA", function(e) {

        $(this).parent().toggleClass( "expandSpanCaption" );
        $(this).toggleClass( "expandDivCaption" );

        if ($(".DraftEditor-root").length > 0){
            $(this).parent().toggleClass("expandGarbageRedditCaptions");
        }

        //If anyone ever find how to stop this fucking propagation send me a dm like fuck none of this shit work on this element...
        e.stopPropagation();
        e.preventDefault();
        e.cancelBubble = true;
        e.stopImmediatePropagation();
        return false
    });
    var control = false;
    $("img").on('keyup keydown', function(e) {
        control = e.ctrlKey;
    });

    $('img').on('click', function() {
        if (control) {
            e.stopPropagation();
            e.preventDefault();
            e.cancelBubble = true;
            e.stopImmediatePropagation();
            return false
        }
    });



    $(document).on("mousedown", "._3b8u2OJXaSDdBWoRB7zUoK,._3hUbl08LBz2mbXjy0iYhOS,._2f5uYHvlfzs2DngQsiCdvB", function(e) {

        $(".fixmodal").fadeIn("fast");
        $("#fixPopup img").remove();
        $("#fixPopup iframe").remove();
        var closestIframe = $(this).parent().find("iframe");
        if (closestIframe.length > 0){
            var clonedIframe = closestIframe.clone()
            clonedIframe.appendTo("#fixPopup");
            clonedIframe.css({'width': '800px', 'max-height':maxWidthPop + 'px'});
        }
        else{
            var imgSrc = $(this).parent().find("img").attr("src");
            $('<img src="'+imgSrc+'" alt="image3" />').appendTo("#fixPopup");
        }

        setTimeout(() => {document.addEventListener("click", fadeOutThePicture);}, 100);
        e.stopPropagation();
        e.preventDefault();
        e.cancelBubble = true;
        e.stopImmediatePropagation();
        return false
    });
    attachObserver();
    attachCustomFeed();

    function callback() {
        if (originalBehavior == "true")
            return;
        if (holdTopicsInMemory == "true")
            AddMenu();
        var st = $(document).scrollTop();
        if (st > maxOffset)
        {
            lastScrollTop = st;
            maxOffset = 0;
        }
    }
    $("body").append('<div class="fixmodal"> <div class="fixmodalWrap"><div id="fixPopup"></div> </div></div>');

    //#####Custom menu for unbluring
    GM_addStyle(`
.container__menu {
                /* Absolute position */
                position: absolute;

                /* Reset */
                list-style: none;
                margin: 0;
                padding: 0;
                display: none;

                /* Misc */
                border: 1px solid #cbd5e0;
                border-radius: 0.25rem;
                background-color: #f7fafc;
            }
`);


    GM_addStyle(`
    .open {
    display: block;
    z-index: 9999;
}
`);

    GM_addStyle(`
.container__item {
                padding: 0.5rem 1rem;
                white-space: nowrap;
                cursor: pointer;
    color: black;
            }
`);

    GM_addStyle(`
 .container__item:hover {
                background-color: #bee3f8;
            }
`);

    GM_addStyle(`
.container__divider {
                border-bottom: 1px solid #cbd5e0;
                height: 1px;
            }
`);
    $("body").append(`
    <ul id="redditfixShowImage" class="container__menu">
                    <li class="container__item">Show Image</li>
                </ul>
                `);

    var cntxtMn = $("#redditfixShowImage");
    var mouseX;
    var mouseY;
    var currentTarget = null;

    $(document).mousemove(function(e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
    });
    $(document).on("mousedown", function(e){
        if ($(event.target).is('img')){

            $(this).on('contextmenu', displayContextMenu)
            function displayContextMenu(e) {
                (cntxtMn.hasClass("open")) ? cntxtMn.removeClass("open") : false;

                if ($(e.target).attr("src").toUpperCase().indexOf("BLUR=") >=0)
                {
                    cntxtMn.css({'top':mouseY,'left':mouseX}).addClass("open");
                    e.preventDefault();
                    currentTarget = e.target;
                    return;
                }

            }
            cntxtMn.click(function(e) {
                e.stopPropagation();
            });

            $(document).click(function() {
                (cntxtMn.hasClass("open")) ? cntxtMn.removeClass("open") : false;
            });

            $(".container__item").click(function(){
                var src =  $(currentTarget).attr('src');
                var myRegexp = /^.*\/(.*)\.?(.*)?\?/g;
                var match = myRegexp.exec(src);
                if (src.toUpperCase().indexOf("EXTERNAL") >= 0){

                    var closestOutBound = $(currentTarget).parents(".STit0dLageRsa2yR4te_b").parent().find(".styled-outbound-link");
                    $(currentTarget).attr("src",closestOutBound.attr("href"));
                }
                else{
                    $(currentTarget).attr("src","https://i.redd.it/" + match[1]);
                }
                $(currentTarget).attr("style","filter:none; width: auto; height: 100%;");
                cntxtMn.removeClass("open");
            });
        }
    });





    function AddTheMenu(){
        var menuButton = `
    <div class="Layout-sc-nxg1ff-0 jA-dUUY"><div class="Layout-sc-nxg1ff-0 dDnLci">
    <div class="Layout-sc-nxg1ff-0 bYXYej">
    <div class="InjectLayout-sc-588ddc-0 iETGeJ">
    <button class="ScCoreButton-sc-1qn4ixc-0 enhanceButton jGqsfG ScButtonIcon-sc-o7ndmn-0 fNzXyu"  style="
    background: url(https://i.imgur.com/kWu713g.png);
    background-size: 22px;
    z-index:999;
    background-repeat: no-repeat;
    background-position: center; width: 25px;
    height: 25px; top: 60px; right: 60px; position:fixed;" ></button>
  </div>
  </div>
  <div aria-label="Whispers" role="button" data-click-out-id="threads-box" data-a-target="threads-box-closed" class="Layout-sc-nxg1ff-0 emWtQg InjectLayout-sc-588ddc-0 kgrtoC whispers-threads-box__container"></div></div></div>

    `;

        var enhanceSettings = `
    <div class="enhancecontainer" style="display:none;">

    </div>
    `;




        $("body").append(enhanceSettings);
        $(".enhancecontainer").append('<div class="tw-border-t tw-mg-t-1 tw-mg-x-05 tw-pd-b-1 customEnhanceMenu"" ></div><div class="tw-mg-y-05 tw-pd-x-05" style="width: 100%;"><p class="tw-c-text-alt-2 tw-font-size-6 tw-strong tw-upcase" style="color: var(--color-text-alt-2)!important;    font-size: var(--font-size-6)!important;    font-weight: 600!important;    text-transform: uppercase!important;">Reddit enhance</p></div>');


        $(".enhancecontainer").append(getCheckBoxItem(commentEffects, "redditFixCheckBoxBackground", "Remove comment effects"));
        $("#redditFixCheckBoxBackground").click(function(){
            var btnBackgroundsChecked = $(this);
            if (btnBackgroundsChecked.prop('checked')){
                btnBackgroundsChecked.removeClass("_1L5kUnhRYhUJ4TkMbOTKkI");
                localStorage.setItem("commentEffects", false);
                commentEffects = "false";
            }
            else{
                btnBackgroundsChecked.addClass("_1L5kUnhRYhUJ4TkMbOTKkI");
                localStorage.setItem("commentEffects", true);
                commentEffects = "true";
            }
        });

        $(".enhancecontainer").append(getCheckBoxItem(holdTopicsInMemory, "fixRedditKeepTopicsInMemory", "Save topics in ram"));
        $("#fixRedditKeepTopicsInMemory").click(function(){
            var btnTopicsChecked = $(this);
            if (btnTopicsChecked.prop('checked')){
                localStorage.setItem("holdTopicsInMemory", true);
                holdTopicsInMemory = "true";
                AddMenu();
            }
            else{
                localStorage.setItem("holdTopicsInMemory", false);
                holdTopicsInMemory = "false";
                RemoveMenu();
            }
        });
        $(".enhancecontainer").append(getCheckBoxItem(originalBehavior, "fixRedditoriginalBehavior", "Original behavior"));
        $("#fixRedditoriginalBehavior").click(function(){
            var btnTopicsChecked = $(this);
            if (btnTopicsChecked.prop('checked')){
                localStorage.setItem("originalBehavior", true);
                originalBehavior = "true";
            }
            else{
                btnTopicsChecked.addClass("_1L5kUnhRYhUJ4TkMbOTKkI");
                localStorage.setItem("originalBehavior", false);
                originalBehavior = "false";
            }
        });

        $(".enhancecontainer").append(getCheckBoxItem(hidePromotedlinks, "fixhidePromotedlinks", "Hide promoted links"));
        $("#fixhidePromotedlinks").click(function(){
            var btnTopicsChecked = $(this);
            if (btnTopicsChecked.prop('checked')){
                localStorage.setItem("hidePromotedlinks", true);
                fRemovePromoted(true);
                hidePromotedlinks = "true";
            }
            else{
                btnTopicsChecked.addClass("_1L5kUnhRYhUJ4TkMbOTKkI");
                localStorage.setItem("hidePromotedlinks", false);
                fRemovePromoted(false);
                hidePromotedlinks = "false";
            }
        });

        $(".enhancecontainer").append(getCheckBoxItem(removeBorderRadius, "fixremoveBorderRadius", "Remove border radius"));
        $("#fixremoveBorderRadius").click(function(){
            var btnTopicsChecked = $(this);
            if (btnTopicsChecked.prop('checked')){
                localStorage.setItem("removeBorderRadius", true);
                fRemoveBorderRadius(true);
                removeBorderRadius = "true";
            }
            else{
                btnTopicsChecked.addClass("_1L5kUnhRYhUJ4TkMbOTKkI");
                localStorage.setItem("removeBorderRadius", false);
                fRemoveBorderRadius(false);
                removeBorderRadius = "false";
            }
        });


        $(".enhancecontainer").append(getCheckBoxItem(hideRecentSection, "fixHideRecentSection", "Hide recent section"));
        $("#fixHideRecentSection").click(function(){
            var btnTopicsChecked = $(this);
            if (btnTopicsChecked.prop('checked')){
                localStorage.setItem("hideRecentSection", true);
                fHideRecentSection(true);
            }
            else{
                localStorage.setItem("hideRecentSection", false);
                fHideRecentSection(false);
            }
        });


        $(".enhancecontainer").append('<span style="margin-top: 10px;">Hide subreddit from appearing in feed. If you remove subs you have to restart. If you add just click save, no need to restart.</span>');
        $(".enhancecontainer").append(`
        <textarea id="fixHideSubreddits" name="fixHideSubreddits" rows="3" cols="40" style = "flex:1">`+subsToHide+`</textarea>
        `);

        $(".enhancecontainer").append(" <button type='button' id='fixSaveSubredditsHidden' style = 'background:darkgreen; flex: 2'>Save</button> ");

        $(".enhancecontainer").append(`<div class="tw-border-t tw-mg-t-1 tw-mg-x-05 tw-pd-b-1 customEnhanceMenu"" ></div><div class="tw-mg-y-05 tw-pd-x-05" style="width: 100%;"><p class="tw-c-text-alt-2 tw-font-size-6 tw-strong tw-upcase"

style="color: var(--color-text-alt-2)!important;
    font-size: smaller;line-height: 1.4;
    margin-top: 6px;">Any subreddit containing this word will be hidden from your feed. This is Case Sensitive. Write the exact subreddit name if you only target that subreddit. Use ; to separate keywords. Example: funny;tiktok;celebrity</p></div>`);

        $("body").append(menuButton);

        $(".enhanceButton").click(function(){
            $(".enhancecontainer").toggle();
        });

        $("#fixSaveSubredditsHidden").click(function(){
            subsToHide = $("#fixHideSubreddits").val();
            localStorage.setItem("subsToHide", subsToHide);
            HideAllSubs();
        });
        //rgba(25, 25, 25, 0.75);




    }

    function fRemovePromoted(hide){
        if (hide == "true" || hide == true)
            GM_addStyle('.promotedlink{display: none !important;}');
        else
            RemoveCssRule('.promotedlink');
    }

    function fHideRecentSection(hide){
        if (hide == "true" || hide == true)
            GM_addStyle('reddit-recent-pages{display: none !important;}');
        else
            RemoveCssRule('reddit-recent-pages');
    }

    function fRemoveBorderRadius(remove){
        if (remove == "true" || remove == true)
            GM_addStyle('*:not(.shreddit-subreddit-icon__icon){border-radius: 0 !important;}');
        else
            RemoveCssRule(':not(.shreddit-subreddit-icon__icon)');
    }
    function HideAllSubs(){

        var subsToHideArray = subsToHide.split(";");
        let i = 0;
        while (i < subsToHideArray.length) {
            let tobeRemoved = $("a[href*='"+ subsToHideArray[i] + "']").closest("article");
            $(tobeRemoved).closest("hr").remove();
            $(tobeRemoved).remove();
            i++;
        }
        //   alert( );
    }

    AddTheMenu();
    GM_addStyle('.enhanceButton:hover{    background-color:var(--color-background-button-text-hover) !important;}');
    GM_addStyle(`
    .enhancecontainer {
display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background: #393939;
    padding: 10px;
    width: 200px;
    position: fixed;
    right: 100px;
    z-index: 100;
    margin-top: 66px;
    width: 500px;
    height: auto;
    top: 0;
}
    `);

    GM_addStyle(`
    input.enhancCheck[type=checkbox] + label {
  display: block;
    cursor: pointer;
    height: fit-content;
    flex: 1 0 35%;
    margin-top: 5px;
}
`);
    GM_addStyle(`
    input.enhancCheck[type=checkbox] {
  display: none;
}`);
    GM_addStyle(`
    ._1L5kUnhRYhUJ4TkMbOTKkI{
    background: green !important;
    }

    `)

    GM_addStyle(`
    #redditFixCheckBoxBackground,#fixRedditKeepTopicsInMemory,#fixRedditoriginalBehavior{
    background: red;
    }

    `)
    GM_addStyle(` input.enhancCheck[type=checkbox] + label:before {
  content: "\\2714";
  border: 0.1em solid #fff;
  border-radius: 0.2em;
  display: inline-block;
  width: 1em;
  height: 1em;
  padding-left: 0.2em;
  padding-bottom: 0.3em;
  margin-right: 0.2em;
  vertical-align: bottom;
  color: transparent;
}`);
    GM_addStyle(`input.enhancCheck[type=checkbox]:checked + label:before {
  background-color: #ED820A;
  border-color:white;
  color: #fff;
}`);
})();










