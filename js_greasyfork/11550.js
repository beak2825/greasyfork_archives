// ==UserScript==
// @name       TipidPColor
// @namespace   1a004cac1b5d07d47bf96329db466117
// @version    1.3.8
// @date       05-18-2017
// @author      mac9erd
// @description  Change the color of navigation bar, alert box, and many more
// @match      https://*.tipidpc.com/*
// @match      http://*.tipidcp.com/*
// @copyright  mac9erd 2014
// @grant      GM_addStyle
// @grant      GM_getValue
// @grant      GM_setValue
// @license    GPLv3
// @run-at     document-start
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require     https://greasyfork.org/scripts/11549-mousetrapv1-5-3/code/mousetrapv153.js
// @downloadURL https://update.greasyfork.org/scripts/11550/TipidPColor.user.js
// @updateURL https://update.greasyfork.org/scripts/11550/TipidPColor.meta.js
// ==/UserScript==

$(document).ready(function () {

    checkSavedSettings();

    var ver = '1.3.8';
    var build = '051817-1';
    var page = String(location).split('/')[3].split('.php')[0];
    var siteLogoValue = GM_getValue('HideSiteLogo');
    var forumPostValue = GM_getValue('forumPostFontSize');
    var siteThemesValue = GM_getValue('siteThemes');
    var buddiesValue = GM_getValue('offBuddies');
    var fullWidthValue = GM_getValue('fullBrowserWidth');
    var notifValue = GM_getValue('PopNotif');
    var flaggedTopicValue = GM_getValue('ForumTopic');
    var newPostValue = GM_getValue('LastPost');
    var tpcOpt = 0;

    optionsWindow();
    setSavedSettings();
    prevNext();
    addNewPostID();
    announcementHide();
    tcpWarning();

    function optionsWindow() {

        var globalCSS = '<style>body{margin:0 auto;padding:0;background:#303030;width:100%}#container{margin: 0 auto;padding: 0 15px;background:#303030;}p.caption{margin: 10px;padding: 0;}#nav{padding: 15px 0 15px 10px;}#textNum{text-align: center;padding: 0;margin: 0;}div#notifications {z-index: 11;}input[type="button"] {border: none;cursor: pointer;padding: 5px 20px;font-weight: bold;}input[type="submit"] {border: none;cursor: pointer;padding: 5px 25px;font-weight: bold;}.announcement{position: fixed;bottom: 15px;right: 0;}</style>';

        var customCSS = '<style>.modal-container{font-size:15px!important;position:fixed;font-family:Arial,Helvetica,sans-serif;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,.8);z-index:10;opacity:0;-webkit-transition:opacity 400ms ease-in;-moz-transition:opacity 400ms ease-in;transition:opacity 400ms ease-in;pointer-events:none}.modal-container:target{opacity:1;pointer-events:auto}.modal-dialog{width:510px;position:relative;margin:10% auto;padding:1px;border-radius:5px;background:#fff}.modal-header{background:#8bc34a;color:#fff;padding:5px;border-top-left-radius:5px;border-top-right-radius:5px}.modal-header h1{font-size:12px;padding-left:5px}.modal-body{height:300px;padding:20px 10px 0;border-bottom:1px solid #eee}.modal-footer{text-align:right;padding:5px 5px 5px 0}.modal-footer a#refresh,.modal-header a{color:#fff!Important}.version{color:#9e9e9e;font-size:10px;text-decoration:none;position:absolute;left:15px;bottom:15px}.btn-cancel,.btn-save{text-decoration:none!Important;display:inline-block;font-size:14px;padding:8px 15px;text-align:center;min-width:60px;position:relative;transition:color .1s ease}.btn-save{background:#8bc34a;border:1px solid #8bc34a;border-radius:3px;color:#fff!Important}.btn-save:hover{background:#7cb342;border:1px solid #7cb342;border-radius:3px;color:#fff}.btn-cancel{background:#e0e0e0;border:1px solid #e0e0e0;border-radius:3px;color:#424242!Important}.btn-cancel:hover{background:#bdbdbd;border:1px solid #bdbdbd;border-radius:3px;color:#fff}.btn-close{color:#fff!Important;font-size:20px;text-decoration:none!Important;position:absolute;right:15px;top:10px}table,tr{border-style:none}table th.title{width:300px;text-align:left}p.note{color:red;padding:0 0 20px;margin:18px auto;font-size:12px;text-align:center}.scrollup{width:21px;height:21px;text-indent:-9999px;z-index:9999;opacity:.5;position:fixed;bottom:40px;right:20px;display:none;background:url(https://raw.githubusercontent.com/macsabile/TipidPColor/master/src/img/scrollUp.png) no-repeat}.scrollup:hover{opacity:1}</style>';

        var settingDialog = '<div id="tpcolorOptions" class="modal-container"> <div class="modal-dialog"> <div class="modal-header"> <h1>TipidPColor Options</h1> <a href="#close" class="btn-close" aria-hidden="true">×</a> </div><div class="modal-body"> <table> <tr> <th class="title"></th> <th class=""></th> </tr><tr> <td>Hide site logo</td><td> <label> <input type="radio" name="siteLogo" class="rdHideSiteLogo" id="rdHideSiteLogoYes" value="yes">Yes</label> <label> <input type="radio" name="siteLogo" class="rdHideSiteLogo" id="rdHideSiteLogoNo" value="no">No</label> </td></tr><tr> <td>Hide offline buddies</td><td> <label> <input type="radio" name="myBuddies" class="rdHideOffline" id="rdHideOfflineYes" value="yes">Yes</label> <label> <input type="radio" name="myBuddies" class="rdHideOffline" id="rdHideOfflineNo" value="no">No</label> </td></tr><tr> <td>Full Browser Width</td><td> <label> <input type="radio" name="mFullwidth" class="rdFullwidth" id="rdFullwidthYes" value="yes">Yes</label> <label> <input type="radio" name="mFullwidth" class="rdFullwidth" id="rdFullwidthNo" value="no">No</label> </td></tr> <tr><td>Disable Pop-up Notification</td><td><label><input type="radio" name="mNotif" class="rdPopNotif" id="rdPopNotifYes" value="yes">Yes</label><label><input type="radio" name="mNotif" class="rdPopNotif" id="rdPopNotifNo" value="no">No</label></td></tr> <tr><td>Open flagged links in a new tab (Forum Bookmarks)</td><td><label><input type="radio" name="mUpdatedTopic" class="rdForumTopic" id="rdForumTopicYes" value="yes">Yes</label><label><input type="radio" name="mUpdatedTopic" class="rdForumTopic" id="rdForumTopicNo" value="no">No</label></td></tr> <tr><td>and go to new/last post</td><td><label><input type="radio" name="mNewPost" class="rdLastPost" id="rdLastPostYes" value="yes">Yes</label><label><input type="radio" name="mNewPost" class="rdLastPost" id="rdLastPostNo" value="no">No</label></td></tr> <tr><td>Forum post font-size</td><td> <label> <input type="radio" name="fontSize" class="rdForumPostSize" id="rdForumPostSizeDefault" value="deafault">default</label> <label> <input type="radio" name="fontSize" class="rdForumPostSize" id="rdForumPostSize15px" value="15">15px</label> <label> <input type="radio" name="fontSize" class="rdForumPostSize" id="rdForumPostSize17px" value="17">17px</label> </td></tr><tr> <td> <br></td><td> </td></tr><tr> <td>Themes</td><td> <label> <input type="radio" name="selectThemes" class="rdSiteThemes" id="rdSiteThemesDefault" value="default">Default</label> <br><label> <input type="radio" name="selectThemes" class="rdSiteThemes" id="rdSiteThemesLight" value="light-green">Light-green</label> <br><label> <input type="radio" name="selectThemes" class="rdSiteThemes" id="rdSiteThemesNight" value="night">Dark</label> </td></tr></table> <p class="note">Changes are saved immediately and applied on next page load.</p> </div><div class="modal-footer"> <a href="https://greasyfork.org/en/scripts/11550-tipidpcolor" title="Check for updates" target="_blank"><span class="version">' + ver + ' build '+ build +'</span></a> <a href="" id="refresh" class="btn-save">Refresh</a> </div></div></div><a href="#" class="scrollup" title="Scroll to Top">Scroll to Top</a>';

        var dialogTrigger = '<a class="cta" href="#tpcolorOptions">TipidPColor Options</a>';


        $('head').append(globalCSS);
        $('head').append(customCSS);
        $('body').append(settingDialog);

        var topLink = $("#left a[href^='newitem.php']");
        if (topLink.length > 0) {
            $("<div />").append(dialogTrigger).insertAfter(topLink.parent());
        } else $("<div />").append(dialogTrigger).insertAfter("#left a[href^='signup.php']");
    }

    function checkSavedSettings() {
        if (GM_getValue('HideSiteLogo', -5) == -5) GM_setValue('HideSiteLogo', '0');
       if (GM_getValue('offBuddies', -5) == -5) GM_setValue('offBuddies', '0');
        if (GM_getValue('forumPostFontSize', -5) == -5) GM_setValue('forumPostFontSize', '0');
        if (GM_getValue('siteThemes', -5) == -5) GM_setValue('siteThemes', '1');
        if (GM_getValue('fullBrowserWidth', -5) == -5) GM_setValue('fullBrowserWidth', '0');
        if (GM_getValue('PopNotif', -5) == -5) GM_setValue('PopNotif', '0');
        if (GM_getValue('ForumTopic', -5) == -5) GM_setValue('ForumTopic', '0');
        if (GM_getValue('LastPost', -5) == -5) GM_setValue('LastPost', '0');
    }

    function setSavedSettings() {
        //show/hide site logo
        if (siteLogoValue == '1') {
            selectID('#rdHideSiteLogoYes');
            $("#logo").remove();
            $("#banner_top").remove();
            $("<div />").append('<a class="cta" href="/">Home</a>').insertBefore("#left a[href^='forums.php']");
        } else selectID('#rdHideSiteLogoNo');

        //show/hide offline buddies
        if (buddiesValue == '1') {
            selectID('#rdHideOfflineYes');
            $(".offline").remove();
        } else selectID('#rdHideOfflineNo');

        //enable/disable pop-up notifications
        if (notifValue == '1') {
            selectID('#rdPopNotifYes');
            GM_addStyle("div#notifications{display:none !Important;}");
        } else selectID('#rdPopNotifNo');

       //change forum post font-size
        if (forumPostValue == '1') {
            selectID('#rdForumPostSize15px');
            GM_addStyle("div.postcontent {font-size: 15px;}");
        } else if (forumPostValue == '2') {
            selectID('#rdForumPostSize17px');
            GM_addStyle("div.postcontent {font-size: 17px;}");
        } else {
            selectID('#rdForumPostSizeDefault');
        }

        //enable/disable flagged links in new tab
        if (flaggedTopicValue == '1') {
            selectID('#rdForumTopicYes');
            if (page == "forumbookmarks") {
                var target="#newpost";
                $('.flagged a').attr('target', '_blank');
                $('.flagged a').attr('onClick', 'setTimeout("location.reload();", 3000);');
            }
        } else selectID('#rdForumTopicNo');

        //go to new/last post
        if (newPostValue == '1') {
            selectID('#rdLastPostYes');
            if (page == "forumbookmarks") {
                var newPost="#newpost";
                $('.flagged a').attr('href', function(i, currentAttribute){
                    return currentAttribute + newPost;
                });
            }
        } else selectID('#rdLastPostNo');

        //change themes
        if (siteThemesValue == '1') {
            selectID('#rdSiteThemesLight');
            chooseTheme('light-green');
        } else if (siteThemesValue == '2') {
            selectID('#rdSiteThemesNight');
            chooseTheme('night');
        } else selectID('#rdSiteThemesDefault');

        //enable/disable Full Browser Width
        if (fullWidthValue == '1') {
            selectID('#rdFullwidthYes');
            if(siteThemesValue == '2') GM_addStyle("body,#layout{background:#455a64;}#container{background:#455a64;max-width:100%;padding:0;}");
            else GM_addStyle("body,#layout{background:#fcfcfc;}#container{background:#fcfcfc;max-width:100%;padding:0;}");
        } else selectID('#rdFullwidthNo');

        $(".note").hide();
    }

    function selectID(id) {
        $(id).attr('checked', true);
        //GM_log(id);
    }

    function selectionChange() {
        $(".note").show();
        setTimeout('$(".note").hide();', 5000);
    }
    
    function announcementHide() {
        $(".announcement").show();
        setTimeout('$(".announcement").fadeOut();', 5000);
    }
    
    function tcpWarning() {
        if(window.location.href.indexOf("tipidcp") > -1) {
            GM_addStyle('.modal-header {background: #e51c23;');
            $('.modal-header h1').html('&#9888; TipidCP.com is not 100% supported of this script.');
        }
        else {
            //do nothing
        }
    }

    function getUnreadCount() {
        setTimeout(getUnread, 2000);
    }

    function getUnread() {
        var post = $('#forum-bookmarks-ticker').text();
        var title = $('title').text();
        if (post) {
            $('title').html('' + post + ' ' + title + '');
        }
    }

    $('#refresh').click(function () {
        location.reload();
    });

    $('.rdHideSiteLogo').change(function () {
        var val = $("input[name=siteLogo]:checked").val();
        selectionChange();
        if (val == 'yes') GM_setValue('HideSiteLogo', '1');
        else GM_setValue('HideSiteLogo', '0');
    });

    $('.rdHideOffline').change(function () {
        var val = $("input[name=myBuddies]:checked").val();
        selectionChange();
        if (val == 'yes') GM_setValue('offBuddies', '1');
        else GM_setValue('offBuddies', '0');
    });

    $('.rdPopNotif').change(function () {
        var val = $("input[name=mNotif]:checked").val();
        selectionChange();
        if (val == 'yes') GM_setValue('PopNotif', '1');
        else GM_setValue('PopNotif', '0');
    });

    $('.rdForumTopic').change(function () {
        var val = $("input[name=mUpdatedTopic]:checked").val();
        selectionChange();
        if (val == 'yes') GM_setValue('ForumTopic', '1');
        else GM_setValue('ForumTopic', '0');
    });

    $('.rdLastPost').change(function () {
        var val = $("input[name=mNewPost]:checked").val();
        selectionChange();
        if (val == 'yes') GM_setValue('LastPost', '1');
        else GM_setValue('LastPost', '0');
    });

    $('.rdForumPostSize').change(function () {
        var val = $("input[name=fontSize]:checked").val();
        selectionChange();
        if (val == '15') GM_setValue('forumPostFontSize', '1');
        else if (val == '17') GM_setValue('forumPostFontSize', '2');
        else GM_setValue('forumPostFontSize', '0');
    });

    $('.rdSiteThemes').change(function () {
        var val = $("input[name=selectThemes]:checked").val();
        selectionChange();
        if (val == 'light-green') GM_setValue('siteThemes', '1');
        else if (val == 'night') GM_setValue('siteThemes', '2');
        else GM_setValue('siteThemes', '0');
    });

    $('.rdFullwidth').change(function () {
        var val = $("input[name=mFullwidth]:checked").val();
        selectionChange();
        if (val == 'yes') GM_setValue('fullBrowserWidth', '1');
        else GM_setValue('fullBrowserWidth', '0');
    });

    function chooseTheme(name) {
        if (name == "light-green") {
            GM_addStyle("a.cta:link, a.cta:visited, a.cta:hover, a.cta:active{background: #8BC34A;}.announcement{border: 1px solid #FEA02C;color: #FEA02C;}h3.wintitle{color:#fff;background: #8BC34A;}#bookmarks-manager li.flagged {background: rgba(139, 195, 74, 0.23);color: rgba(255, 102, 0, 0.75);border: 1px solid #8bc34a;}img{max-width:100%}a:link{color:#259b24}#nav a:hover,a:hover{color:#0d5302;text-decoration:none}div#notifications{background:#f36c60;border:1px solid #f36c60;color:#fff}ul.forumtopics h4 a,ul.forumtopics h4 a:visited{color:green}span.pageBorder{border:1px solid #a7a7a7;padding:2px}#banner_big,#layout #left,#layout #right,#nav{border:0}h2.forumsection a,h2.forumsection a:visited{color:#428EFF}h1.topictitle{font-size:14px;color:#428EFF}#nav{font-size:medium}.flagged td,.new td{background:#B9DFBA;color:#fff;border:1px solid #27ae60}.premium{background:#E7EEFF;color:#F72A2A;border:1px solid #5A88FF}a,a:visited{color:#0d5302}.even a:visited,.odd a:visited,table.itemlist a:link{color:green}");
        } else if (name == "night") {
            GM_addStyle("a.cta:link, a.cta:visited, a.cta:hover, a.cta:active{background: #009688;}h2.usergroup{color:#f0f0f0;}p.usermeta{color:#666665;}.location{color:#F2E48F;}.announcement{border: 1px solid #FEE8A1;color: #FEE48F;}#frontlist strong {color: #F8ECCE;}.side-module label{color: #fff;}a,a:hover,a:visited{text-decoration:none}#bookmarks-manager li.flagged {background: #4db6ac;color: #E6E48F;border: 1px solid #4db6ac;}li.normal {background: #455A64 !IMPORTANT;}ul.forumtopics h4 a, ul.forumtopics h4 a:visited, h2.forumsection a, h2.forumsection a:visited{color: #4db6ac;}img{max-width:100%}blockquote a{color:#D82945}div.normalbox{color:#000}p.itemmeta{background:#224044;border:none}#banner_big,#layout #left,#layout #right,#nav{border:0}ul.catlist td.catprice{color:#F4F4F4}h1.itemname,h2.itemprice{color:#fff}#nav{background:#263238;font-size:medium}#banner_big,#layout{background:#455a64}div#notifications{background:#4db6ac;border:1px solid #4db6ac;color:#fff}div.window,div.window.itembrowser,td.window{background:#455a64;color:#fff;border:1px solid #999;}a.cta.forum{background: #009688;}h3.wintitle{color:#fff;background: #009688;}div.postcontent,ul.posts li{background:#455a64;color:#fff}ul.posts li{border:1px solid #999;}blockquote{border:0;background:#b0bec5;color:#000;font-style:italic}div.postcontent{border-left:0;border-right:0;border-bottom:0}h1.topictitle{color:#fff}a,a:visited{color:#cfd8dc}.flagged td a,.new td a,a:hover{color:#fff}.flagged td a:hover,.new td a:hover{color:#cfd8dc}.flagged td,.new td{background:#4db6ac;border:1px solid #009688}.odd,.odd td{border:1px solid #999;background:#78909c}.odd a,.odd td a{color:#fff!Important}.odd a:hover,.odd td a:hover{color:#cfd8dc!Important}.even,.even td{background:#455a64;border:1px solid #999}.even a,.even td a{color:#fff!Important}.even a:hover,.even td a:hover{color:#cfd8dc!Important}#announcement{background:#b2dfdb}#announcement a{color:green}.premium{background:#cfd8dc;border:1px solid #009688}.btn-save,.btn-save:hover{border:1px solid #607d8b}.btn-save,.modal-header{background:#263238}.premium a{color:#009688}.premium a:hover{color:#607d8b}.btn-save:hover{background:#607d8b}span,td,td p{color:#fff}.modal-container td,table.pager td a{color:#000}table.pager td a:hover{color:#259b24}");
        } else {
            //do nothing
        }
    }

    function addNewPostID() {
        if (page == "viewtopic") {
            $("li:last-child p.postmeta").attr("id","newpost");
        }
    }

    //add keyboard shortcut 'Left/Right arrow' - to previous page and next page in forum topic/item search results
    //replace 'Start a Topic', 'Prev' and 'Next' button with a link
    //remove 'Go' button
    function prevNext() {
        inPage = $('.pager tbody tr td');
        prev = inPage.find('input[value="Prev"]');
        next = inPage.find('input[value="Next"]');
        newTopic = inPage.find('input[value="Start a Topic"]');
        goForum = inPage.find('input[value="Go"]');

        prev.each(function () {
            if (!$(this).is(':disabled')) {
                var url = /^document\.location\.href\=\'(.*)\'/.exec($(this).attr('onclick'))[1];
                var link = $('<a/>').prop('href', url).text('Prev');
                $(this).replaceWith(link);
                Mousetrap.bind('left', function () {
                    if (url) {
                        window.location = url;
                    }
                });
            } else $(this).remove();
        });
        next.each(function () {
            if (!$(this).is(':disabled')) {
                var url = /^document\.location\.href\=\'(.*)\'/.exec($(this).attr('onclick'))[1];
                var link = $('<a/>').prop('href', url).text('Next');
                $(this).replaceWith(link);
                Mousetrap.bind('right', function () {
                    if (url) {
                        window.location = url;
                    }
                });
            } else $(this).remove();
        });

        newTopic.each(function () {
            var url = /^document\.location\.href\=\'(.*)\'/.exec($(this).attr('onclick'))[1];
            var link = $('<a/>').prop('href', url).text('Create New Topic');
            $(this).replaceWith(link);
        });

        goForum.each(function () {
            $(this).remove();
        });
    }

    //add scroll to top
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });

    $('.scrollup').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });

    //add keyboard shortcut 'Esc' - Close TipidPColor Options
    Mousetrap.bind('esc', function () {
        window.location = "#close";
        tpcOpt = 0;
    });

    //add keyboard shortcut 'F8' - Open/Close TipidPColor Options
    Mousetrap.bind('f8', function () {
        if (tpcOpt === 0) {
            window.location = "#tpcolorOptions";
            tpcOpt = 1;
        } else {
            window.location = "#close";
            tpcOpt = 0;
        }
    });

    //add keyboard shortcut 'F9' - Item Manager
    Mousetrap.bind('f9', function () {
        window.location = "itemmanager.php";
    });

    //add keyboard shortcut 'F10' - Forum Bookmarks
    Mousetrap.bind('f10', function () {
        window.location = "forumbookmarks.php";
    });
});
