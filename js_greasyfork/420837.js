// ==UserScript==
// @name         IdleScape - Chat.0 Beta
// @namespace    D4IS
// @version      1.2
// @description  Better chat for IdleScape
// @author       D4M4G3X
// @match        *://*.idlescape.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/420837/IdleScape%20-%20Chat0%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/420837/IdleScape%20-%20Chat0%20Beta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* INITIATE APPLICATION */
    let lib = {};
    let app = {};
    let initInterval = setInterval(()=> {
        if (window.D4IS) {
            clearInterval(initInterval);
            lib = window.D4IS.init('chat.0', '1.2');
            app = lib["chat.0"];
            lib.app.setUpdateLocation($('.chat-tab-private'));
            main();
        }
    }, 100);
    function main() {
        /* SET DEFAULT VALUES */
        app.chatHeight = 250;

        /* RUN MAIN INTERVAL */
        let mainInterval = setInterval(()=> {
            if (app.ready && $('.status-bar').length) {
                if(!app.setup) {
                    app.setup = true;
                    if (lib.general.getStorage('ChatHeight')) {
                        app.chatHeight = parseInt(lib.general.getStorage('ChatHeight'));
                    }
                    $('.play-area-chat-container').css('flex', '0 0 '+app.chatHeight+'px');
                }
                setupChannels();
            }
        }, 1000);

        /* QUICK INTERVAL */
        let checkInterval = setInterval(()=> {
            if (app.ready && $('.status-bar').length) {
                checkUsernames();
                checkPrivates();
                checkCommands();
                checkMessageCount();
                whoisPopup();
            }
        }, 100);

        /* UPDATE INTERVAL */
        let updateInterval = setInterval(()=> {
            if (app.ready && $('.status-bar').length) {

            }
        }, 5 * 60 * 1000);

        function checkCommands() {
            $('.chat-message-system').each(function() {
                if (~$(this).text().indexOf('Unknown command:')) {
                    let cmd = $(this).text().split(' ')[2];
                    if (lib.app.commands) {
                        if (lib.app.commands[cmd]) {
                            lib.app.commands[cmd]();
                            $(this).remove();
                        }
                    }
                }
            });
        }

        function checkUsernames() {
            $('.message-username:not(.user-cloned)').each(function() {
                $(this).addClass('user-cloned');
                let $user = $('<div>', {
                    'class': $(this).attr('class') + ' user-menu'
                }).html($(this).html());
                $user.insertAfter($(this));
                $user.click(function(e) {
                    openPopup($(this), e.pageX);
                });
                $(this).addClass('user-original');
                $(this).hide();
            });
        }

        function gotoTab(tab, first = false) {
            $('.chat-tab').removeClass('selected-tab');
            $('.chat-tab-'+tab.toLowerCase()).addClass('selected-tab');
            $('.chat-interface-container').hide();
            $('.chat-interface-container.'+tab.toLowerCase()).show();
            if(first) {
                $('.chat-interface-container.'+tab.toLowerCase()).find('.chat-tabs > div:first-child').click();
            }
        }

        function whoisPopup() {
            $('.chat-message-system:not(.chat0-done').each(function() {
                let $that = $(this);
                if (~$that.text().indexOf('total level')) {
                    $that.addClass('chat0-done');
                    let skills = ['mining', 'foraging', 'fishing', 'farming', 'smithing', 'crafting', 'cooking', 'constitution', 'attack', 'strength', 'defense', 'runecrafting', 'enchanting'];
                    let user = $that.text().split('[SYSTEM]: ')[1].split(' ')[0];
                    let league = $that.text().split('playing in ')[1].split('.')[0];
                    let level = {};

                    let $html = $('<div>');
                    let $wrap = $('<div>', {
                        'class': 'chat0-whois-level-wrap'
                    }).appendTo($html);

                    $.each(skills, function(k, skill) {
                        if (~$that.text().indexOf(lib.general.ucfirst(skill)+' Level: ')) {
                            level[skill] = $that.html().split(lib.general.ucfirst(skill)+' Level: ')[1].split('<br>')[0];
                            if(~level[skill].indexOf('+')) {
                                level[skill] = level[skill].replace('(', '<span style="color: #7cd6ff">(');
                                level[skill] = level[skill].replace(')', ')</span>');
                            }
                            let $level = $('<div>', {
                                'class': 'chat0-whois-level'
                            }).appendTo($wrap);
                            let $icon = $('<img>', {
                                'class': 'dialog-icon chat0-whois-level-icon'
                            }).attr({
                                'src': lib.game.getSkillIcon(skill)
                            }).appendTo($level);
                            let $text = $('<span>', {
                                'class': 'dialog-text-big chat0-whois-level-text'
                            }).html(lib.general.ucfirst(skill)+': '+level[skill]).appendTo($level);
                        }
                    });
                    let $titlewrap = $('<div>');

                    let $title = $('<div>', {
                        'class': 'chat0-whois-title'
                    }).appendTo($titlewrap);

                    let $text = $('<span>', {
                        'class': 'dialog-text-big chat0-whois-title-text'
                    }).text(user).appendTo($title);

                    let $icon = $('<img>', {
                        'class': 'dialog-icon chat0-whois-title-icon'
                    }).attr({
                        'src': lib.game.getLeagueIcon(league.split(' ')[0].toLowerCase())
                    }).appendTo($title);

                    lib.game.dialog({
                        'title': $titlewrap.html(),
                        'text': $html.html(),
                        'class': 'chat0-whois',
                        'type': 'close',
                    });
                    $that.parent().remove();
                }
            });
        }

        function openPopup($obj, posX) {
            if (lib.user.getName() == $obj.text()) { return false; }
            $('.chat-user-options').remove();
            let pos = $obj.offset();
            let $popup = $('<div>', {
                'class': 'chat-user-options'
            }).appendTo($('body'));

            popupButton('Whisper', function() {
                $obj.parent().find('.user-original').click();
                gotoTab('private');
            }).appendTo($popup);

            popupButton('Whois', function() {
                $obj.parents('.chat-message-container').find('input').val('/whois ' + $obj.text());
                $obj.parents('.chat-message-container').find('input').focus();
            }).appendTo($popup);

            popupButton('Throw', function() {
                $obj.parents('.chat-message-container').find('input').val('/throw ' + $obj.text());
                $obj.parents('.chat-message-container').find('input').focus();
                var press = $.Event("keypress");
                press.which = 75;
                $obj.parents('.chat-message-container').find('input').trigger(press);
            }).appendTo($popup);

            popupButton('Block', function() {
                $obj.parents('.chat-message-container').find('input').val('/block ' + $obj.text());
                $obj.parents('.chat-message-container').find('input').focus();
            }).appendTo($popup);

            popupButton('Close').appendTo($popup);

            $popup.css({
                'left': posX - 45,
                'top': pos.top - ($popup.height() + 10)
            });
        }

        function popupButton(text, cb = function(){}) {
            let $btn = $('<div>', {
                'class': 'nav-tab no-select chat-user-option-' + text.toLowerCase()
            }).text(text);
            $btn.hover(function() {
                $(this).addClass('selected-tab');
            }, function() {
                $(this).removeClass('selected-tab');
            });
            $btn.click(function() {
                $(this).parent().remove();
                cb();
            });
            return $btn;
        }

        function setupChannels() {
            if(!$('.chat-tab-wrap').length) {
                let $tabWrap = $('<ul>', {
                    'class': 'chat-tab-wrap'
                }).insertAfter($('.chat-buttons'));
                $tabWrap.css({
                    'display': 'flex',
                    'margin': '0',
                    'background':'#2a343e',
                    'border': '1px solid #222'
                });
                addChatTab('Public').appendTo($tabWrap);
                addChatTab('Private').appendTo($tabWrap);

                $('.chat-buttons').remove();

                let $options = $('<div>', {
                    'class': 'chat-option-wrap'
                }).appendTo($tabWrap);

                let $option = [];
                $option[0] = $('<div>', {
                    'class': 'chat-button chat-option noselect'
                }).text('▲');
                $option[0].click(function() {
                    if (app.chatHeight < 550) {
                        app.chatHeight += 100;
                        lib.general.setStorage('ChatHeight', app.chatHeight);
                        $('.play-area-chat-container').css('flex', '0 0 '+app.chatHeight+'px');
                    }
                });
                $option[1] = $('<div>', {
                    'class': 'chat-button chat-option noselect'
                }).text('▼');
                $option[1].click(function() {
                    if (app.chatHeight > 150) {
                        app.chatHeight -= 100;
                        lib.general.setStorage('ChatHeight', app.chatHeight);
                        $('.play-area-chat-container').css('flex', '0 0 '+app.chatHeight+'px');
                    }
                });

                $option[2] = $('<div>', {
                    'class': 'chat-button chat-option noselect'
                }).text('-');
                $option[2].click(function() {
                    $.each($option, function() {
                        $(this).hide();
                    });
                    $option[3].show();
                    $('.play-area-chat-container').css('flex', '0 0 31px');
                });

                $option[3] = $('<div>', {
                    'class': 'chat-button chat-option noselect'
                }).text('+').hide();
                $option[3].click(function() {
                    $.each($option, function() {
                        $(this).show();
                    });
                    $(this).hide();
                    $('.play-area-chat-container').css('flex', '0 0 '+app.chatHeight+'px');
                });

                $.each($option, function() {
                    $(this).appendTo($options);
                });
            }

            if(!$('.chat-interface-container.private').length) {
                $('.chat-message-container-box').css({
                    'background': '#222323',
                });
                let $publicChat = $('.chat-interface-container');
                let $privateChat = $publicChat.clone();
                $publicChat.addClass('public');
                $privateChat.addClass('private').insertAfter($publicChat);
                $privateChat.find('.chat-tab-channel').remove();
                $privateChat.find('.chat-message-container').remove();
                $privateChat.find('.chat-functions-item').remove();
                $privateChat.hide();
            }
        }

        function checkPrivates() {
            $('.chat-interface-container.public').find('.chat-tabs > div:not(.closed)').each(function() {
                if ($(this).hasClass('chat-tab-whisper')) {
                    let $publicChat = $('.chat-interface-container.public');
                    let $privateChat = $('.chat-interface-container.private');
                    let $whisperTab = $(this);
                    let $chatBox = $publicChat.find('.chat-message-container-box > .chat-message-container:last-child');

                    $whisperTab.addClass('whisper-'+$(this).text().split(' ')[1]);
                    $whisperTab.appendTo($privateChat.find('.chat-tabs'));
                    $whisperTab.find('a').hide();

                    $chatBox.addClass('chatBox-'+$(this).text().split(' ')[1]);
                    $chatBox.appendTo($privateChat.find('.chat-message-container-box'));
                }
            });
        }

        function checkMessageCount() {
            let tabs = ['public', 'private']
            $.each(tabs, function(k, tab) {
                let count = 0;
                $('.chat-interface-container.' + tab).find('.chat-tabs > div').each(function() {
                    if (~$(this).text().indexOf('(') && ~$(this).text().indexOf(')')) {
                        count +=  parseInt($(this).text().split('(')[1].split(')')[0]);
                    }
                });
                $('.chat-tab-'+tab).find('span').text('('+count+')');
            })
        }

        function addChatTab(label) {
            let $chatTab = $('<li>', {
                'class': 'nav-tab chat-tab chat-tab-' + label.toLowerCase()
            }).html(label+' <span>(0)</span>');
            if (label === 'Public') {
                $chatTab.addClass('selected-tab');
            }
            $chatTab.click(function() {
                gotoTab(label, true);
            });
            return $chatTab;
        }
    }
})();

function includeJS(file) {
    var script  = document.createElement('script');
    script.src  = file;
    script.type = 'text/javascript';
    script.defer = false;

    document.getElementsByTagName('head').item(0).appendChild(script);
}

function includeCSS(file) {
    var style  = document.createElement('link');
    style.rel  = 'stylesheet';
    style.href  = file;
    style.type = 'text/css';

    document.getElementsByTagName('head').item(0).appendChild(style);
}

if (typeof window.D4IS_JS == 'undefined') {
    window.D4IS_JS = true;
    includeJS('https://digimol.net/idlescape/assets/js/lib.js');
}


if (typeof window.D4IS_CSS == 'undefined') {
    window.D4IS_CSS = true;
    includeCSS('https://digimol.net/idlescape/assets/css/game.css');
}