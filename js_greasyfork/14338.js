// ==UserScript==
// @name         Xamvl Notification
// @version      1.0.0.2
// @description  Tính năng: Gửi thông báo tới người được quote, thông báo khi có bài mới trong chủ đề đánh dấu, khi người khác quote bài, và kèm theo âm báo.
// @author       idmtrialreset, tungtien
// @namespace    https://greasyfork.org/vi/users/21499-tungtien

// @grant        GM_getResourceURL
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow

// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require      http://code.jquery.com/ui/1.11.2/jquery-ui.js
// @resource     soundURL http://idmresettrial.cf/vozNotification/sound.mp3
// @resource     logoURL http://i.imgur.com/LPCR5ej.png 
// @icon         http://i.imgur.com/LPCR5ej.png

// @include      /^http?://xamvl\.com/.*$/
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/14338/Xamvl%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/14338/Xamvl%20Notification.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
// Do not run on frames or iframes
if (window.top !== window.self) {
    return;
}
noNewPMconfirm = '<script>function confirm(str) {return 0;} </script>';
$('head').append(noNewPMconfirm);

document.addEventListener('DOMContentLoaded', function() {

    var username = $('body').find('strong:contains("Welcome") a').html();
    var str_array_1to20 = '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]';

    if (username.length) {

        //reset_factory();

        var userid = $('body').find('strong:contains("Welcome") a').attr('href').match(/[0-9]+/)[0];
        var sQuery = (parseInt(GM_getValue("optHashtag", 0)) === 1) ? ("#notify" + userid) : username;

        var DB_postID = parseInt(GM_getValue('DB_postID', 0));

        add_SettingMenu();
        add_style();

        sync_last20viewedQuotes();
        QuoteViewMonitor();
        getUserNotifications();
        QuoteSearch();
        clickThreadTitleGoUnread();
        waitSendQuoteMsg();
        detectQuoteMsg();

        $('a[href^="login.php?do=logout"]').click(function() {
            window.location.href = $(this).attr('href');
        });

    }

    function clickThreadTitleGoUnread() {
        var url = /(subscription|usercp|forumdisplay)\.php/i;
        if (url.test(window.location.href) === true && parseInt(GM_getValue('optGoUnread', '1'))) {
            $('a[id^="thread_title_"]').each(function() {
                $(this).attr('href', $(this).attr('href') + '&goto=newpost');
            });
        }
    }

    function getUserNotifications() {
        var newPM = [];
        var newThread = [];
        $.ajax({
            url: 'http://xamvl.com/usercp.php',
            type: 'GET',
            cache: false,
            success: function(data) {
                newPM.last = GM_getValue('newPrivateMessages', '');
                newPM.title = $(data).find('a[href^="private.php?do=showpm&pmid="]:first strong').text();
                newPM.url = $(data).find('a[href^="private.php?do=showpm&pmid="]:first').attr('href');
                newPM.pmid = (newPM.title.length) ? parseInt(newPM.url.match(/pmid=([0-9]+)/)[1]) : 0;
                newThread.last = GM_getValue('newSubscribedThreads', '');
                newThread.title = $(data).find('a[id^="thread_title_"]:first').text();
                newThread.url = $(data).find('a[id^="thread_title_"]:first').attr('href') + '&goto=newpost';
                var sound = 0;
                if (newPM.title.length) {
                    sound = (newPM.pmid !== newPM.last) ? 1 : 0;
                    var divID = '#newPrivateMessages';
                    if (newPM.title.indexOf('Bạn được nhắc đến ở thread:') === 0 && (/\[post=[0-9]+\]/).test(newPM.title)) {
                        var postID = parseInt(newPM.title.match(/\[post=([0-9]+)\]/)[1]);
                        if (wasThisQuoteViewed(postID) && false) {
                            divID = null;
                            deleteMsg(newPM.pmid);
                        } else {
                            divID = '#newQuote';
                        }
                    }
                    if (divID !== null) {
                        var showOK = showMsg(divID, [newPM.url, newPM.title], 0, sound);
                        if (showOK === 0) newPM.pmid += '/notAlerted';
                    }
                }
                if (newThread.title.length) {
                    sound = (newThread.title !== newThread.last) ? 1 : 0;
                    var showOK = showMsg('#newSubscribedThreads', [newThread.url, newThread.title], 0, sound);
                    if (showOK === 0) newThread.title += '/notAlerted';
                }
                GM_setValue('newPrivateMessages', newPM.pmid);
                GM_setValue('newSubscribedThreads', newThread.title);
            }
        });
        setTimeout(function() {
            getUserNotifications();
        }, 60000);
    }

    function waitSendQuoteMsg() {
        var firstClickSubmit = 1;

        $('form[name="vbform"],form#message_form').submit(function(event) {

            var clicked = $('input[type="submit"]:focus');
            var postMsg = $('form[name="vbform"] textarea').val();
            var optSendQuoteMsg = (parseInt(GM_getValue('optSendQuoteMsg', '1')) === 1);
            var optHideIMG = (parseInt(GM_getValue('optHideIMG', '1')) === 1);

            if (clicked.attr('name') === 'sbutton') {

                if (window.location.href.indexOf('http://xamvl.com/private.php') === -1) {

                    if (optSendQuoteMsg || optHideIMG) {

                        var sendTo = [];
                        var quoteTag = /(\[QUOTE=|@)([^;:]+)[;:]/gi;
                        var quotePerson = quoteTag.exec(postMsg);

                        var quoteTags = /\[quote[^]*?\[\/quote\]/gi;
                        var quoteHaveImg = quoteTags.test(postMsg);

                        while (quotePerson !== null) {
                            if (sendTo.indexOf(quotePerson[2]) === -1) {
                                sendTo.push(quotePerson[2]);
                            }
                            quotePerson = quoteTag.exec(postMsg);
                        }

                        if (sendTo.length || quoteHaveImg) {

                            if (firstClickSubmit) {
                                event.preventDefault();

                                var html = '<div id="beforeSubmit" style="display:none; margin-top:10px"></div>';
                                clicked.parent().parent().append(html);

                                if (quoteHaveImg && optHideIMG) {
                                    $('#beforeSubmit').append('<span>Không hiện ảnh trong trích dẫn: </span>');
                                    $('#beforeSubmit').append('<input type="checkbox" name="hideIMG" checked>');
                                    $('#beforeSubmit').append('<br>');
                                }

                                if (sendTo.length && optSendQuoteMsg) {
                                    $('#beforeSubmit').append('<span>Gửi thông báo quote bài tới: </span>');
                                    $('#beforeSubmit').append('');

                                    var autoCheck = (parseInt(GM_getValue('optQuotedChecked', '0')) === 1) ? " checked" : "";
                                    $.each(sendTo, function(index, value) {
                                        $('#beforeSubmit').append('<label for="' + value + '"><input type="checkbox" name="sendTo[]" id="' + value + '" value="' + value + '"' + autoCheck + '>' + value + '</label> ');
                                    });
                                }

                                $('#beforeSubmit').show('blind', 200);
                                firstClickSubmit = 0;

                            } else {

                                var hideIMGchecked = $('input[name="hideIMG"]:checked');
                                var sendToChecked = $('input[name="sendTo[]"]:checked');

                                if (sendToChecked.length) {
                                    var sendTo = [];
                                    sendToChecked.each(function() {
                                        sendTo.push($(this).attr('value'));
                                    });
                                    GM_setValue('prepareQuoteMsg', sendTo.join(';'));
                                }

                                // remove [img] inside [quote]
                                if (hideIMGchecked.length) {
                                    quoteTags = postMsg.match(quoteTags);
                                    $.each(quoteTags, function(i, quoteTag) {
                                        var quoteTag0 = quoteTag;
                                        quoteTag = quoteTag.replace(/\[img\]/gi, '\n').replace(/\[\/img\]/gi, ' (ảnh)\n');
                                        postMsg = postMsg.replace(quoteTag0, quoteTag);
                                    });
                                }

                                // insert hashtag
                                if (parseInt(GM_getValue("optHashtag", 0)) === 1) {
                                    var hashtagBBcode = new RegExp('(\n)*\\[COLOR="Gray"\\]' + sQuery + '\\[\\/COLOR\\]', 'gi');
                                    if (hashtagBBcode.test(postMsg)) {
                                        postMsg = postMsg.replace(hashtagBBcode, '');
                                    }
                                    postMsg += '\n[COLOR="Gray"]' + sQuery + '[/COLOR]';
                                }

                                // update text editor before submiting
                                $('form[name="vbform"] textarea').val(postMsg);

                            }
                        }

                    }

                } else {
                    // when clicking submit button at private.php page
                    var lastSendMsg = new Date().getTime();
                    GM_setValue('lastSendMsg', lastSendMsg);
                }
            }
            return;
        });

        if (GM_getValue('prepareQuoteMsg', null) !== null) {
            if ($('td.tcat:contains("The following errors occurred with your submission:")').length === 0) {
                var post = window.location.href.match(/post([0-9]+)/)[1];
                var title = 'Bạn được nhắc đến ở thread: ' + $('td[class="navbar"] strong').text() + '[post=' + post + ']';
                var msg = '[B]Xem chi tiết: ' + 'http://xamvl.com/showthread.php?p=' + post + '#post' + post + '[/B]';
                msg += '\n__________________';
                msg += '\n[I]Đây là thông báo tự động tạo bởi [URL="http://bit.ly/vozNotification"]vozNotification[/URL]. Xin vui lòng không reply lại tin này -.-[/I]';
                var QuoteMsgList = JSON.parse(GM_getValue('QuoteMsgList', '[]'));
                QuoteMsgList.push({
                    sendTo: GM_getValue('prepareQuoteMsg'),
                    title: title,
                    msg: msg
                });
                GM_setValue('QuoteMsgList', JSON.stringify(QuoteMsgList));
            }
            GM_setValue('prepareQuoteMsg', null);
        }
        if (JSON.parse(GM_getValue('QuoteMsgList', '[]')).length) {
            processQuoteMsgList();
        }
    }

    function processQuoteMsgList() {
        if (JSON.parse(GM_getValue('QuoteMsgList', '[]')).length) {
            var lastSendMsg = GM_getValue('lastSendMsg', 0);
            var now = new Date().getTime();
            var QuoteMsgList = JSON.parse(GM_getValue('QuoteMsgList'));
            var sendMe = QuoteMsgList[0];
            if ((now - lastSendMsg) > 60000) {
                sendMsg(sendMe.sendTo, sendMe.title, sendMe.msg);
                QuoteMsgList.splice(0, 1);
                GM_setValue('QuoteMsgList', JSON.stringify(QuoteMsgList));
                setTimeout(function() {
                    processQuoteMsgList();
                }, 60000);
            } else {
                var wait = (60000 - (now - lastSendMsg));
                showMsg('#otherMsg', 'Đang đợi gửi thông báo quote...', wait, 0);
                setTimeout(function() {
                    processQuoteMsgList();
                }, wait);
            }
        }
    }

    function detectQuoteMsg() {
        $('a[href^="private.php?do=showpm&pmid"]:contains("Bạn được nhắc đến ở thread:")').each(function() {
            var filter = /\[post=([0-9]+)\]/;
            if (filter.test($(this).html())) {
                var postID = $(this).html().match(filter)[1];
                $(this).html($(this).html().replace(filter, ''));
                $(this).attr('href', $(this).attr('href') + '&post=' + postID);
            }
        });
        $('#vozNotification a, a[href^="private.php"][href*="post="]').click(function(e) {
            e.preventDefault();
            var url = $(this).attr('href');
            if (url.indexOf('private.php') === 0) {
                if (url.indexOf('post=') !== -1) {
                    var pmid = $(this).attr('href').match(/pmid=([0-9]+)/)[1];
                    var postID = url.match(/post=([0-9]+)/)[1];
                    var url = 'showthread.php?p=' + postID + '#post' + postID;
                    deleteMsg(pmid);
                }
            } else {
                if ($(this).html().indexOf('Bạn được nhắc đến ở thread: ') === 0) {
                    var last20quotes = JSON.parse(GM_getValue('last20quotes', '[]'));
                    last20quotes[0].unRead = -1;
                    GM_setValue('last20quotes', JSON.stringify(last20quotes));
                }
            }
            $(this).parent().parent().hide('slide', {
                direction: 'right'
            }, function() {
                window.location.href = url;
            });
        });
    }

    function deleteMsg(pmid) {
        var data = {
            do: 'managepm',
            dowhat: 'delete',
            securitytoken: unsafeWindow.SECURITYTOKEN
        };
        data['pm[' + pmid + ']'] = true;
        $.ajax({
            type: 'POST',
            url: 'http://xamvl.com/private.php?do=managepm&amp;dowhat=delete&amp;pmid=' + pmid,
            data: data,
            success: function() {}
        });
    }

    function sendMsg(sendTo, title, msg) {
        GM_xmlhttpRequest({
          method: "POST",
          url: "http://xamvl.com/private.php?do=insertpm&pmid=",
          data: "recipients=" + sendTo + '&title=' + title + '&message=' + msg + '&savecopy=0&signature=0&parseurl=1&securitytoken=' + unsafeWindow.SECURITYTOKEN + '&do=insertpm&sbutton=Submit+Message',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          onload: function(data) {
                    var lastSendMsg = new Date().getTime();
                    GM_setValue('lastSendMsg', lastSendMsg);
                    var msg = $(data).find('.tcat:contains("The following errors occurred with your submission:")').length ? "Không thể gửi thông báo" : "Đã gửi thông báo cho người được quote biết";
                    showMsg('#otherMsg', msg, 2000, 0);
                }
        });
    }

    function showMsg(id, str, hide, withSound) {
        if ($('#vozNotification').length === 0) {
            $('body').append('<div id="vozNotification"><div id="sound"></div></div>');
            $('#vozNotification').append('<div class="floatRight"><div class="showMsg" id="newPrivateMessages"></div></div>');
            $('#vozNotification').append('<div class="floatRight"><div class="showMsg" id="newQuote"></div></div>');
            $('#vozNotification').append('<div class="floatRight"><div class="showMsg" id="newSubscribedThreads"></div></div>');
            $('#vozNotification').append('<div class="floatRight"><div class="showMsg" id="otherMsg"></div></div>');
        }
        if ($('#vozNotification ' + id).css('display') === 'none') {
            if (id === '#otherMsg') {
                $(id).html(str);
            } else {
                var logoURL = GM_getResourceURL('logoURL');
                var info = '<div id="logoWrapper" class="vozNotification"><a id="tinmoi" href="usercp.php"><img id="logo" class="vozNotification" src="' + logoURL + '"></a></div>';
                var accesskey = {
                    '#newPrivateMessages': 'm',
                    '#newQuote': 'q',
                    '#newSubscribedThreads': 't'
                };
                $(id).html(info + '<div id="titleWrapper" class="vozNotification"><a accesskey="' + accesskey[id] + '" href="' + str[0] + '">' + str[1] + '</a></div>');
            }
            if (withSound && parseInt(GM_getValue('optSound', '1'))) {
                var soundURL = GM_getResourceURL('soundURL');
                $('#sound').html('<audio autoplay><source src="' + ((typeof(window.chrome) !== 'undefined') ? 'data:audio/mpeg;base64,' : '') + soundURL + '" type="audio/mpeg" /></audio>');
            }
            $(id).effect('slide', {
                direction: 'right'
            }, function() {
                detectQuoteMsg();
                if (hide > 0) {
                    setTimeout(function() {
                        $(id).hide('slide', {
                            direction: 'right'
                        });
                    }, hide);
                }
            });

            // Notify on document's title
            if (parseInt(GM_getValue('optNotifyTitle', '1'))) {
                $('head').append('<link rel="icon" href="http://i.imgur.com/LPCR5ej.png" type="image/png">');
               
                $(window).on("beforeunload", function() {
                    $('head').append('<link rel="icon" href="/favicon.ico" type="image/ico">');
                    return undefined;
                });
            }
            return 1;
        } else {
            return 0;
        }
    }

    function add_SettingMenu() {
        var thongbao = $('td.vbmenu_control a[href="faq.php"]');
        thongbao.attr('id', 'thongbao');
        thongbao.attr('rel', 'thongbao');
        thongbao.html('Thông báo');
        var html = '<div class="vbmenu_popup" id="thongbao_menu" style="display:none;margin-top:3px" align="left">';
        html += '<table cellpadding="4" cellspacing="1" border="0" style="min-width:200px;">';
        html += '<tr><td class="thead">Tùy chọn vozNotification</td></tr>';
        html += '<tr>';
        html += '<td class="vbmenu_option" title="nohilite">Dùng hashtag để nhận thông báo quote:&nbsp;<div style="float:right;"><input type="radio" name="optHashtag" id="optHashtag1" value=1 /><label for="optHashtag1">bật</label><input type="radio" id="optHashtag0" name="optHashtag" value=0 /><label for="optHashtag0">tắt</label></div></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td class="vbmenu_option" title="nohilite">Âm báo:&nbsp;<div style="float:right;"><input type="radio" name="optSound" id="optSound1" value=1 /><label for="optSound1">bật</label><input type="radio" id="optSound0" name="optSound" value=0 /><label for="optSound0">tắt</label></div></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td class="vbmenu_option" title="nohilite">Thông báo ở thanh tiêu đề:&nbsp;<div style="float:right;"><input type="radio" name="optNotifyTitle" id="optSound1" value=1 /><label for="optNotifyTitle1">bật</label><input type="radio" id="optNotifyTitle0" name="optNotifyTitle" value=0 /><label for="optNotifyTitle0">tắt</label></div></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td class="vbmenu_option" title="nohilite">Gửi thông báo quote bài:&nbsp;<div style="float:right;"><input type="radio" name="optSendQuoteMsg" id="optSendQuoteMsg1" value=1 /><label for="optSendQuoteMsg1">bật</label><input type="radio" name="optSendQuoteMsg" id="optSendQuoteMsg0" value=0 /><label for="optSendQuoteMsg0">tắt</label></div></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td class="vbmenu_option" title="nohilite">Không hiện ảnh trong trích dẫn:&nbsp;<div style="float:right;"><input type="radio" name="optHideIMG" id="optHideIMG1" value=1 /><label for="optHideIMG1">bật</label><input type="radio" name="optHideIMG" id="optHideIMG0" value=0 /><label for="optHideIMG0">tắt</label></div></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td class="vbmenu_option" title="nohilite">Đến bài chưa đọc đầu tiên khi click tiêu đề:&nbsp;<div style="float:right;"><input type="radio" name="optGoUnread" id="optGoUnread1" value=1 /><label for="optGoUnread1">bật</label><input type="radio" name="optGoUnread" id="optGoUnread0" value=0 /><label for="optGoUnread0">tắt</label></div></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td class="vbmenu_option" title="nohilite">Đồng bộ thông báo quote tới post ID:&nbsp;<div style="float:right;"><input class="bginput" id="txtDB_postID" size="10" type="text"><input id="btn_set_DB_postID" class="button" value="OK" type="button">&nbsp;<input id="btn_about_DB_postID" class="button" value="?" type="button"></div></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td class="vbmenu_option" title="nohilite"><div style="float:right;">Tự tích vào người được quote:&nbsp;<input type="radio" name="optQuotedChecked" id="optQuotedChecked1" value=1 /><label for="optQuotedChecked1">bật</label><input type="radio" name="optQuotedChecked" id="optQuotedChecked0" value=0 /><label for="optQuotedChecked0">tắt</label></div>' +
            '<div style="float:right;">Max-width của thông báo:&nbsp;<input class="bginput" id="txtNotifyWidth" size="10" type="text"><input id="btn_set_NotifyWidth" class="button" value="OK" type="button">&nbsp;</div></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td class="vbmenu_option" title="nohilite"><div id="reset_factory">Khôi phục cài đặt gốc</div></td>';
        html += '</tr>';
        html += '</table>';
        html += '</div>';
        $('body').append(html);
        thongbao.parent().append('<script type="text/javascript"> vbmenu_register("thongbao"); </script>');
        $('#thongbao_menu input[name^="opt"]').each(function() {
            value0 = ($(this).attr('name') === "optHashtag" || $(this).attr('name') === "optQuotedChecked") ? 0 : 1;
            $(this).filter('[value=' + GM_getValue($(this).attr('name'), value0) + ']').attr('checked', '1');
        });
        $('#thongbao_menu input[name^="opt"]').click(function() {
            GM_setValue($(this).attr('name'), $(this).val());
        });
        $('#thongbao_menu #btn_set_DB_postID').click(function() {
            GM_setValue('DB_postID', $('#txtDB_postID').val());
            alert('Thông báo quote sẽ được đồng bộ vào post ID ' + $('#txtDB_postID').val());
            location.reload();
        });
        $('#thongbao_menu #btn_about_DB_postID').click(function() {
            var DB_post = GM_getValue('DB_postID', 0);
            if (DB_post > 0) window.open('http://xamvl.com/showpost.php?p=' + DB_post);
            else alert('Nhập 1 postID của bạn để thực hiện đồng bộ qua post này.\nNội dung post đó sẽ bị xóa.');
        });
        $('#thongbao_menu input[id="txtDB_postID"]').val(GM_getValue('DB_postID', 0));
        $('#reset_factory').click(function() {
            reset_factory();
        });
        $('#thongbao_menu input[id^="optHashtag"]').click(function() {
            GM_setValue('last20quotes', '[]');
            location.reload();
        });

        $('#thongbao_menu #btn_set_NotifyWidth').click(function() {
            GM_setValue('NotifyWidth', $('#txtNotifyWidth').val());
            location.reload();
        });
        $('#thongbao_menu input[id="txtNotifyWidth"]').val(GM_getValue('NotifyWidth', 300));

    }

    function add_style() {
        $('head').append('<style>' +
            '#vozNotification {float:right; position:fixed; top:0px; right:20px; font-weight:normal; cursor:pointer;}' +
            '.showMsg {display:none; padding: 5px; margin: 5px; background:rgba(0,0,0,0.7); border: 2px solid rgba(0,0,0,0); border-radius: 10px}' +
            '.showMsg a:link, .showMsg a:hover, .showMsg a:visited {font-weight:bold; color: #fff; outline: none;}' +
            '.floatRight {clear:both; float:right}' +
            'a#tinmoi, a#tinmoi:hover, a#tinmoi:visited {color: #ff3300}' +
            '#reset_factory {color: #FF0000;}' +
            '#logo.vozNotification {width:35px;}' +
            '#logoWrapper.vozNotification {display:inline-block; vertical-align:middle; width:40px}' +
            '#titleWrapper.vozNotification {display:inline-block; vertical-align:middle; max-width:' + GM_getValue('NotifyWidth', 300) + 'px}' +
            '</style>');
    }

    function QuoteSearch(retry) {
        if (GM_getValue('last20quotes', '[]') !== '[]') {
            var last20quotes = JSON.parse(GM_getValue('last20quotes', '[]'));
            if (wasThisQuoteViewed(last20quotes[0].postID)) {
                last20quotes[0].unRead = -1;
            }
            if (last20quotes[0].unRead === -1) {
                last20quotes.splice(0, 1);
                GM_setValue('last20quotes', JSON.stringify(last20quotes));
                QuoteSearch(retry);
            } else {
                var showMe = last20quotes[0];
                showMe.title = 'Bạn được nhắc đến ở thread: ' + showMe.threadTitle;
                showMe.url = 'http://xamvl.com/showthread.php?p=' + showMe.postID + '#post' + showMe.postID + '&newQuoteClicked';
                showMsg('#newQuote', [
                    showMe.url,
                    showMe.title
                ], 0, showMe.unRead);

                if (last20quotes[0].unRead === 1) {
                    last20quotes[0].unRead = 0;
                    GM_setValue('last20quotes', JSON.stringify(last20quotes));
                }

            }
        } else {
            if (typeof(retry) === 'undefined') var retry = 5;
            retry -= 1;
            if (retry < 0) {
                // wait a minute to retry
                setTimeout(function() {
                    QuoteSearch();
                }, 60000);
            } else {
                $.ajax({
                    url: 'search.php?do=process',
                    type: 'POST',
                    data: {
                        s: '',
                        securitytoken: unsafeWindow.SECURITYTOKEN,
                        do: 'process',
                        searchthreadid: '',
                        query: sQuery,
                        titleonly: 0,
                        searchuser: '',
                        starteronly: 0,
                        exactname: 1,
                        'prefixchoice[]': '',
                        replyless: 0,
                        replylimit: 0,
                        searchdate: 0,
                        beforeafter: 'after',
                        sortby: 'lastpost',
                        order: 'descending',
                        showposts: 1,
                        'forumchoice[]': 0,
                        childforums: 1,
                        dosearch: 'Search Now',
                        saveprefs: 1
                    },
                    success: function(data) {
                        var foundQuote = $(data).find('span.smallfont:contains("Showing results")').length ? 1 : 0;
                        if (foundQuote === 0) {
                            setTimeout(function() {
                                QuoteSearch(retry);
                            }, 5000);
                        } else {
                            // connected successfully
                            var quoteDetect = $(data).find('div.smallfont:contains("Posted By")').filter(':not(:contains("' + username + '"))');
                            if (quoteDetect.length) {
                                var quotes = quoteDetect.parent().parent().parent().parent();
                                var last20quotes = [];

                                $.each(quotes, function(index, quote) {
                                    var quote = $(quote);
                                    var threadTitle = quote.find('a strong').text();
                                    var postID = parseInt(quote.find('em a').attr('href').match(/#post([0-9]+)/)[1]);

                                    if (!wasThisQuoteViewed(postID)) {
                                        last20quotes[last20quotes.length] = {
                                            threadTitle: threadTitle,
                                            postID: postID,
                                            unRead: 1
                                        };
                                    }
                                });

                                if (last20quotes.length) {

                                    // first time run
                                    if (GM_getValue('last20viewedQuotes', str_array_1to20) === str_array_1to20) {

                                        console.log('vozNotification: the first time run');

                                        var last20viewedQuotes = [];

                                        for (var i = 1; i < last20quotes.length; i++) {
                                            last20viewedQuotes[last20viewedQuotes.length] = last20quotes[last20quotes.length - i].postID;
                                        }

                                        var tmp = last20viewedQuotes.length;
                                        for (var i = 20; i > tmp; i--) {
                                            last20viewedQuotes.splice(0, 0, i);
                                        }

                                        GM_setValue('last20viewedQuotes', JSON.stringify(last20viewedQuotes));
                                        GM_setValue('resetting', 0);
                                        QuoteViewMonitor();
                                    }

                                    last20quotes.reverse();
                                    GM_setValue('last20quotes', JSON.stringify(last20quotes));

                                }
                                retry = (retry > 1) ? 0 : retry;
                                setTimeout(function() {
                                    QuoteSearch(retry);
                                }, 5000);
                            }
                        }
                    }
                });
            }
        }
    }
    // end QuoteSearch()

    function QuoteViewMonitor() {

        var last20viewedQuotes = JSON.parse(GM_getValue('last20viewedQuotes', str_array_1to20));
        var update_me = 0;
        var postHaveQuote = $('div[id^="post_message_"]:contains("' + sQuery + '")');
        var newQuoteClicked = (location.href.indexOf('&newQuoteClicked') !== -1);

        if (postHaveQuote.length || newQuoteClicked) {
            postHaveQuote.each(function() {
                var postID = parseInt($(this).attr('id').match(/[0-9]+/));
                var postBy = $('div[id="postmenu_' + postID + '"] a.bigusername').html();
                if ((postID > last20viewedQuotes[0]) && (last20viewedQuotes.indexOf(postID) === -1) && (postBy !== username)) {
                    last20viewedQuotes.splice(0, 1, postID);
                    last20viewedQuotes.sort(function(a, b) {
                        return a - b;
                    });
                    update_me = 1;
                }
            });
        }
        // in case post was deleted
        if (newQuoteClicked) {
            var postID = parseInt(location.href.match(/[0-9]+/));
            if ((postID > last20viewedQuotes[0]) && (last20viewedQuotes.indexOf(postID) === -1)) {
                last20viewedQuotes.splice(0, 1, postID);
                last20viewedQuotes.sort(function(a, b) {
                    return a - b;
                });
                update_me = 1;
            }
        }

        if (update_me && (GM_getValue('resetting', 0) === 0)) {
            GM_setValue('last20viewedQuotes', JSON.stringify(last20viewedQuotes));
            update_last20viewedQuotes_to_server();
        }

    }

    function wasThisQuoteViewed(id) {
        var last20viewedQuotes = JSON.parse(GM_getValue('last20viewedQuotes', str_array_1to20));
        return (last20viewedQuotes.indexOf(id) !== -1 || id < last20viewedQuotes[0]) ? 1 : 0;
    }

    function update_last20viewedQuotes_to_server() {
        if (DB_postID > 0) {
            var code = GM_getValue('last20viewedQuotes', str_array_1to20);
            GM_setValue('last20quotes', '[]');
            $.ajax({
                url: 'editpost.php?do=updatepost&p=' + DB_postID,
                type: 'POST',
                data: {
                    message: '[code]' + 'vozNotification.last20viewedQuotes=' + code + '[/code]',
                    'do': 'updatepost',
                    p: DB_postID,
                    securitytoken: unsafeWindow.SECURITYTOKEN
                },
                success: function() {
                    console.log('update_last20viewedQuotes_to_server(): sent ', code);
                }
            });
        }
    }

    function sync_last20viewedQuotes() {
        console.log('sync_last20viewedQuotes(): last20viewedQuotes ', GM_getValue('last20viewedQuotes', str_array_1to20));
        if (DB_postID > 0) {
            $.ajax({
                url: 'showpost.php?p=' + DB_postID,
                type: 'GET',
                cache: false,
                success: function(server_value) {
                    var server_value = $(server_value).find('#post_message_' + DB_postID).html();
                    server_value = server_value.match(/last20viewedQuotes\=(\[[^\]]*\])/);
                    server_value = (server_value === null) ? [] : server_value;
                    if (server_value.length === 2) {
                        server_value = JSON.parse(server_value[1]);
                        var last20viewedQuotes = JSON.parse(GM_getValue('last20viewedQuotes', str_array_1to20));
                        var update_me = [0, 0];
                        $.each(server_value, function(i, val) {
                            var postID = val;
                            if ((postID > last20viewedQuotes[0]) && (last20viewedQuotes.indexOf(postID) === -1)) {
                                last20viewedQuotes.splice(0, 1, postID);
                                last20viewedQuotes.sort(function(a, b) {
                                    return a - b;
                                });
                                update_me[0] = 1;
                            }
                        });
                        for (var i = 0; i < last20viewedQuotes.length; i++) {
                            if (last20viewedQuotes[i] === server_value[i]) update_me[1]++;
                        }
                        update_me = update_me[0] || (update_me[1] !== last20viewedQuotes.length);
                        if (update_me) {
                            GM_setValue('last20viewedQuotes', JSON.stringify(last20viewedQuotes));
                            update_last20viewedQuotes_to_server();
                        }
                    } else {
                        update_last20viewedQuotes_to_server();
                    }
                }
            });
        }
    }

    function reset_factory() {

        var keys = GM_listValues();
        for (var i = 0; i < keys.length; i++) {
            GM_deleteValue(keys[i]);
        }
        GM_setValue('resetting', 1);
        console.log('reset_factory(): done');
        location.reload();
    }

});