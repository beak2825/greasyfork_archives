// ==UserScript==
// @name         ResetEra Live Thread
// @namespace    http://madjoki.com
// @version      4.0.15
// @description  Update threads without refreshing
// @author       Madjoki
// @match        https://metacouncil.com/threads/*
// @match        https://www.resetera.com/threads/*
// @match        https://bbs.io-tech.fi/threads/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/favico.js/0.3.10/favico.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34580/ResetEra%20Live%20Thread.user.js
// @updateURL https://update.greasyfork.org/scripts/34580/ResetEra%20Live%20Thread.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let favicon;

    // This is to disable scrolldown behaviour when XenForo insert "new messages" box.
    const original = XF.Message.insertMessages;

    XF.Message.insertMessages = function (dataHtml, $container, ascending, onInsert)
    {
        console.log(dataHtml, $container, ascending, onInsert);

        if (dataHtml.content.indexOf('js-newMessagesIndicator') > -1)
            return;

        original(dataHtml, $container, ascending, onInsert);
    }

    var favIconUpdate = function (count) {
        favicon.badge(count);
        favicon.badge(count);
    }

    if (window.location.host === 'www.resetera.com') {
        // Chrome Fix
        //let icon = $('link[rel*=icon]').first().clone();
        //$('link[rel*=icon]').remove();
        //$('head').append(icon);

        favicon = new Favico({
            animation: 'none',
            fontFamily: 'FontAwesome',
            fontStyle: 'normal'
        });

    }
    else {
        favicon = new Favico({
            animation: 'none',
            fontFamily: 'FontAwesome',
            fontStyle: 'normal'
        });
    }

    favIconUpdate();

    var timeoptions = [
        {
            name: "5s",
            value: 5,
        },
        {
            name: "10s",
            value: 10,
        },
        {
            name: "15s",
            value: 15,
        },
        {
            name: "30s",
            value: 30,
        },
        {
            name: "1m",
            value: 60,
        },
        {
            name: "2m",
            value: 120,
        },
    ];

    let defaults = {
        timer: 5,
        enabledByDefault: false,
    };

    let threadID = $('html').data('content-key');
    let userSettings = {}
    let threadSettings = {}
    let recentErrors = 0;
    let countNewMessages = 0;
    let updating = false;
    let enabled = false;
    let paused = false;
    let currentTimer = 120;
    let hasFocus = true;

    // Read Global Settings
    let settingsJson = localStorage.getItem("livethreadSettings");

    if (settingsJson !== null)
        userSettings = JSON.parse(settingsJson) || {};

    // Read Thread Settings
    let threadJson = localStorage.getItem("livethread_" + threadID);

    if (threadJson !== null)
        threadSettings = JSON.parse(threadJson) || {};

    let currentSettings = {}

    function updateSettings() {
        currentSettings = {
            ...defaults,
            ...userSettings,
            ...threadSettings
        }

        if (!("enabled" in currentSettings))
            currentSettings.enabled = currentSettings.enabledByDefault;

        if (!currentSettings.timer || currentSettings.timer < 0)
            currentSettings.enabled = false;

        enabled = currentSettings.enabled;
        paused = !enabled;
    }

    updateSettings();
    currentTimer = currentSettings.timer;

    function getPages(dom) {
        return {
            current: parseInt(dom.find('li.pageNav-page--current').first().text(), 10) || 0,
            next: parseInt(dom.find('.pageNav-page.pageNav-page--later').first().text()) || parseInt(dom.find('.pageNav-page').last().text()) || 0,
            last: parseInt(dom.find('.pageNav-page').last().text()) || 0
        };
    }

    function updateFavIcon() {
        if (countNewMessages > 0) {
            favIconUpdate(countNewMessages);
        }
        else if (currentSettings.enabled && !paused) {
            favIconUpdate('');
        }
        else {
            favIconUpdate(0);
        }
    }

    function addoptions(el, values) {

        $(el).find("option").remove();

        $(values).each(function (i, o) {
            $(el).append($("<option>", {text: o.name, value: o.value}));
        })
    }

    // CSS
    $('body').append(`<style>
    #livethreadPanel {
        display: none;
        text-align: center;
    }
    #livethreadPanel ul {
        display: inline-block;
        margin-bottom: 15px;
    }
    #livethreadPanel ul li {
        display: block;
        text-align: left;
    }
    #updateTime {
        margin-left: 5px;
        padding: 0px;
    }
    #updateTimeDefault {
        margin-left: 5px;
        padding: 0px;
    }
    body.darktheme #livethreadPanel ul {
       color: #8e50be;   /*dark theme only*/
    }
    .livethreadStatus {
        text-align: center;
    }
    .liveThread_enabled .globalAction {
        display: none !important;
    }
    .liveThreadControls a {
        padding: 5px;
    }
</style>`);

    function getTimeOfLastMessage()
    {
        return $('article.message time').last().data('time');
    }

    function getPageUrl(page)
    {
        $('meta[property="og:url"]').attr('content') + `page-${page}`;
    }

    // Get date of last message
    var $lastDate = $('input[name="last_date"]');
    var $container = $('.js-replyNewMessageContainer');
    var pages = getPages($('body'));
    var lastPageWithData = pages.current;

    // If zero messages, it's non thread page like reply page
    if ($('article.message').length === 0)
        return;

    // Pause if this isn't last page
    if (pages.current !== pages.last)
        paused = true;

    // Create Control Panel
    var controlsContainer = $('<div>', { class: 'block-outer-opposite liveThreadControls' });

    var statusText = $('<a>', { href: '#', class: 'livethreadStatus livethreadRefresh postsRemaining' });
    var startPauseBtn = $('<a>', { href: '#', class: 'livethreadStartPause' }).append($('<i>', { class: 'fa' }));
    var settingsBtn = $('<a>', { href: '#', class: 'livethreadSettings' }).append($('<i>', { class: 'fa fa-cog' }));
    var refreshBtn = $('<a>', { href: '#', class: 'livethreadRefresh' }).append($('<i>', { class: 'fa fa-refresh' }));

    controlsContainer.append(statusText);
    controlsContainer.append(startPauseBtn);
    controlsContainer.append(refreshBtn);
    controlsContainer.append(settingsBtn);

    $('.block-outer.block-outer--after').append(controlsContainer);

    // Build Settings
    $('.block-outer.block-outer--after').last().after('\
<div id="livethreadPanel" class="DiscussionListOptions secondaryContent">\
    <h2 class="heading h1">This Thread</h2>\
    <ul>\
       <li><label for="updateTime">Update Speed:</label> <select id="updateTime" class="textCtrl"></select></li>\
    </ul>\
    <h2 class="heading h1">Global Settings</h2>\
    <ul>\
			<li style="display: none"><label><input type="checkbox" id="liveThread_remember" value="1"> Remember New Threads by Default</label></li>\
			<li><label><input type="checkbox" id="liveThread_enableByDefault" value="1"> Enable By Default</label></li>\
			<li><label>Default Update Speed: <select id="updateTimeDefault" class="textCtrl"></select></label></li>\
			<li style="display: none"><label><input type="checkbox" id="liveThread_debug" value="1"> Log Debug Data to Console (only for testing)</label></li>\
    </ul>\
</div>');

    function saveSettings()
	{
        localStorage.setItem("livethread_" + threadID, JSON.stringify(threadSettings));
        localStorage.setItem("livethreadSettings", JSON.stringify(userSettings));

        updateForm();
	}

    $('#liveThread_enableByDefault').change(function () {
        userSettings.enabledByDefault = $('#liveThread_enableByDefault').is(':checked');
        saveSettings();
    });

    $('#liveThread_messageMarkers').change(function () {
        userSettings.useNewMessageMarker = $('#liveThread_messageMarkers').is(':checked');
        saveSettings();
    });

    $('#liveThread_remember').change(function () {
        userSettings.rememberThreads = $('#liveThread_remember').is(':checked');
        saveSettings();
    });

    $('#liveThread_debug').change(function () {
        userSettings.enableDebug = $('#liveThread_debug').is(':checked');
        saveSettings();
    });

    $('#updateTime').change(function () {
        const time = parseInt($('#updateTime').val());
        if (time)
            threadSettings.timer = parseInt(time);
        else
            delete threadSettings.timer;

		saveSettings();
    });

    $('#updateTimeDefault').change(function () {
        userSettings.timer = parseInt($('#updateTimeDefault').val());
		saveSettings();
    });

    // Control Panel
    function updateForm()
    {
        addoptions($("#updateTime"), [{
            name: "Default",
            value: 0,
        }, {
            name: "Disabled",
            value: -1,
        }, ...timeoptions]);
        addoptions($("#updateTimeDefault"), timeoptions);

        $("#updateTime option[value='" + threadSettings.timer + "']").attr("selected", true);
        $("#updateTimeDefault option[value='" + userSettings.timer + "']").attr("selected", true);

        $("#liveThread_remember").attr("checked", userSettings.rememberThreads);
        //$("#liveThread_messageMarkers").attr("checked", userSettings.useNewMessageMarker);
        $("#liveThread_enableByDefault").attr("checked", userSettings.enabledByDefault);
        //$('#liveThread_currentRemember').attr("checked", isRememberedThread);
        //$("#liveThread_debug").attr("checked", globalSettings.enableDebug);
    }

    updateForm();

    function insertMessagesAlternative(data) {
        console.log(data);

        var html = $.parseHTML(data.html.content);
        var $html = $(html);

        var pagesNew = getPages($html);

        if (pagesNew.current !== pages.current)
        {
            console.log("page changed", pagesNew, pages);

            pages = pagesNew;
            lastPageWithData = pages.current;

            history.pushState({}, "", `page-${pages.current}`);

            var $navNew = $html.find('.pageNavWrapper').first();
            $('.pageNavWrapper').html($navNew.html());
        }

        $html.find('article.message').each(function () {
            insertMessage($(this), $container, true);
        });

        updateFavIcon();

        updating = false;
    }

    function insertMessages(data) {

        if (data.message)
        {
            recentErrors++;
            return;
        }

        if (data.lastDate)
            $lastDate.val(data.lastDate);

        recentErrors = 0;

        if (data.html) {
            XF.setupHtmlInsert(data.html, function ($html, container, onComplete, onInsert) {
                // TODO: Check if DIV is there and load additional messages automatically
                var div = $html.children('div');

                if (div.length)
                {
                    console.log(div);
                }

                $html.each(function () {

                    if (!this.tagName) {
                        return;
                    }

                    if (this.tagName === 'DIV') {
                        console.log(this);

                        var $msg = $(this);

                        // TEMP
                        $container.append(this);
                    }

                    insertMessage($(this), $container, true);
                });

                if (onInsert) {
                    onInsert($html);
                }

                updateFavIcon();
                updating = false;
            });
        }
    }

    function insertMessage($message, $container, ascending) {
        if (!$message.data('author')) // Fix for empty messages
            return;

        // post-15795528
        var id = $message.attr('id');

        var $msg = $(`#${id}`);

        if ($msg.length)
        {
            console.log(`not inserting ${id}, already in page`);
            // TODO: update
            return;
        }

        countNewMessages++;

        var $firstChild = $container.children().first();

        //$message.hide();

        if ($firstChild.is('form') && !ascending) {
            $message.insertAfter($firstChild);
        }
        else if (!ascending) {
            $container.prepend($message);
        }
        else {
            $container.append($message);
        }

        //$message.xfFadeDown();
        $message.addClass('livethread_unread');

        XF.activate($message);
    }

    function loadMessages() {
        if (updating)
            return;

        if (lastPageWithData !== pages.last)
            loadMessagesAlternative();
        else
            loadMessagesFast();

        updating = true;
    }

    // Use api to get messages
    function loadMessagesFast() {
        XF.ajax('GET', 'new-posts', { after: getTimeOfLastMessage() }, insertMessages).always(function () { updating = false }, {useError: false});
        updateControls();
    }

    function loadMessagesAlternative() {
        const page = pages.next || pages.current;

        XF.ajax('GET', `page-${page}`, insertMessagesAlternative).always(function () { updating = false }, {useError: false});
    }

    function timer() {
        if (paused || !enabled)
            return;

        currentTimer--;

        // Delay if there's recent errors
        var errorDelay = 10000 * Math.min(5, recentErrors);

        if (currentTimer === 0) {
            loadMessages();
            currentTimer = currentSettings.timer + errorDelay;
        }

        updateControls();
    }

    function getStatusText() {
        var status = "";

        if (updating)
            status += "Updating";
        else if (currentTimer && !paused && enabled) {
            status += "Next Update In " + currentTimer + " seconds";

            //if (countNewLast > 0)
            //    status += " - " + countNewLast + " New Messages!";
        }
        else
            status = "Disabled";

        return status;
    }

    function updateControls() {
        $(".livethreadStartPause i").toggleClass('fa-pause', !paused);
        $(".livethreadStartPause i").toggleClass('fa-play', paused);
        $(".livethreadRefresh i").toggleClass('fa-spin', updating);

        $(".livethreadStatus").text(getStatusText());

        $('body').toggleClass('liveThread_enabled', !paused);
    }

    function isvisible($ele) {
        var lBound = $(window).scrollTop(),
            uBound = lBound + $(window).height(),
            top = $ele.offset().top,
            bottom = top + $ele.outerHeight(true);

        return (top > lBound && top < uBound) || (bottom > lBound && bottom < uBound) || (lBound >= top && lBound <= bottom) || (uBound >= top && uBound <= bottom);
    }

    function handleScroll() {
        $('.livethread_unread').each(function (i, el) {
            var $el = $(el);

            if (isvisible($el)) {
                $el.removeClass('livethread_unread');
                $el.prevAll('.livethread_unread').removeClass('livethread_unread');
            }
        });

        countNewMessages = $('.livethread_unread').length;
        updateFavIcon();
    }

    $(window).scroll(function () {
        handleScroll();
    });

    $(window).focus(function () {
        handleScroll();
        hasFocus = true;
    });

    $(window).focusout(function () {
        handleScroll();
        hasFocus = false;
    });

    updateControls();

    setInterval(timer, 1000);

    $('.livethreadRefresh').click(function (event) {
        event.preventDefault();
        loadMessages();
    });

     $('.livethreadStartPause').click(function (event) {
        event.preventDefault();
        enabled = true;
        paused = !paused;
        updateControls();
    });

    $('.livethreadSettings').click(function (event) {
        event.preventDefault();
        $('#livethreadPanel').toggle();
        //$('#livethreadPanel').scrollintoview();
    });

})();