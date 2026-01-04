// ==UserScript==
// @name        Triborn - UI Improvements
// @namespace   triborn-ui
// @description UI Improvements / fixes for Triborn - https://www.triborn.net/
// @author      redwing
// @include     https://www.triborn.net/staging/public/game*
// @grant       none
// @version     1.0.3
// @downloadURL https://update.greasyfork.org/scripts/373527/Triborn%20-%20UI%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/373527/Triborn%20-%20UI%20Improvements.meta.js
// ==/UserScript==

// Refresh icon from https://www.iconfinder.com/icons/132187/refresh_icon, by Aha-Soft.
// Icon license: Creative Commons (Attribution 3.0 Unported) (https://creativecommons.org/licenses/by/3.0/) 

var $ = unsafeWindow.jQuery;

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function fixGuildPopup() {
    while (true) {
        unsafeWindow.refreshGame = function (f) {
            $.get('game', function(data) {
                data = data.replace('<audio id="audio" src="https://www.triborn.net/staging/public/sounds/" autostart="false" ></audio>', '');
                var h = $(data);
                var ids = ['#paper-doll','#inventory','#system','#msg','#player_list','#scores','#skills'];
                for (x in ids) {
                    $(ids[x]).html(h.find(ids[x]).html());
                }
                unsafeWindow.refreshBindings();
                if (f) f();
            });
        };
        await sleep(1000);
    }
}

async function fixEventBindings() {
    while (true) {
        unsafeWindow.refreshBindings = function () {
            $('a.action').off('click').click(function () {
                var action = $(this).attr('action');
                $.post('game/action/initiate', {'action': action, 'params': ''}).done(function (json) {
                    if (!verifyJson(json)) {
                        return;
                    }
                    timer(json.timer, json.token, json.doing, json.much);
                    repeat = function () {
                        $.post('game/action/complete', {'action': action, 'token': json.token}).done(function (completeJson) {
                            completeActionMessage = completeJson.message;
                            refreshGame(function () {
                                $('a[action=' + action + ']').click();
                                $('a.action').off();

                            });

                        });
                    };
                });
            });
            $('a.inv_action').off('click').click(function () {
                var action = $(this).attr('action');
                $.post('game/action/initiate', {'action': action, 'params': ''}).done(function (json) {
                    if (!verifyJson(json)) {
                        return;
                    }
                    invtimer(json.timer, json.token, json.doing, json.much);
                    repeat = function () {
                        $.post('game/action/complete', {'action': action, 'token': json.token}).done(function (completeJson) {
                            completeActionMessage = completeJson.message;
                            refreshGameInvasion(function () {
                                $('a[action=' + action + ']').click();
                                $('a.inv_action').off();

                            });

                        });
                    };
                });
            });
            $('a.fight').off('click').click(function () {
                var action = $(this).attr('action');
                $.post('game/action/initiate', {'action': action, 'params': ''}).done(function (json) {
                    if (!verifyJson(json)) {
                        return;
                    }
                    fighttimer(json.timer, json.token, json.doing, json.much);
                    repeat = function () {
                        $.post('game/action/complete', {'action': action, 'token': json.token}).done(function (completeJson) {
                            completeActionMessage = completeJson.message;
                            refreshGame(function () {
                                $('a[action=' + action + ']').click();
                                $('a.fight').off();
                            });

                        });
                    };
                });
            });
            $('a.inv_fight').off('click').click(function () {
                var action = $(this).attr('action');
                $.post('game/action/initiate', {'action': action, 'params': ''}).done(function (json) {
                    if (!verifyJson(json)) {
                        return;
                    }
                    fighttimer(json.timer, json.token, json.doing, json.much);
                    repeat = function () {
                        $.post('game/action/complete', {'action': action, 'token': json.token}).done(function (completeJson) {
                            completeActionMessage = completeJson.message;
                            refreshGame(function () {
                                $('a[action=' + action + ']').click();
                                $('a.inv_fight').off();
                            });

                        });
                    };
                });
            });
            $('#location-navigation a.location, .location-navigation').off('click').click(function (event) {
                $.post('game/action/initiate', {'action': 'Navigation', 'params': {'location': $(this).attr('value')}})
                    .done(function (json) {
                        if (!verifyJson(json)) {
                            return;
                        }
                        navtimer(json.timer, json.token, json.doing, json.much);
                        repeat = function () {
                            $.post('game/action/complete', {
                                'action': 'Navigation',
                                'token': json.token
                            }).done(function (completeJson) {
                                completeActionMessage = completeJson.message;
                                $('#active_timer').hide();
                                $('#food').hide();
                                $('#playerhp').hide();

                                refreshGameNav();
                            });
                        };
                    });
            });
            $('#location-sailing a.location, .location-sailing').off('click').click(function (event) {
                $.post('game/action/initiate', {'action': 'Sailing', 'params': {'location': $(this).attr('value')}})
                    .done(function (json) {
                        if (!verifyJson(json)) {
                            return;
                        }
                        sailtimer(json.timer, json.token, json.doing, json.much);
                        repeat = function () {
                            $.post('game/action/complete', {
                                'action': 'Sailing',
                                'token': json.token
                            }).done(function (completeJson) {
                                completeActionMessage = completeJson.message;
                                $('#active_timer').hide();
                                $('#food').hide();
                                $('#playerhp').hide();

                                refreshGameNav();
                            });
                        };
                    });
            });

            $('.inv-slot').each(function (e) {
                $(this).find('img').off('click').click(function () {
                    $('.item-menu').not($(this).parent().find('.item-menu')).hide();
                    $(this).parent().find('.item-menu').toggle();
                });
            });

            $('.item-move-link').off('click').click(function () {
                var slot = $(this).attr('slot');
                var key = $(this).attr('key');
                var skill = $(this).attr('skill');


                $.post('game/action/initiate', {
                    'action': 'ItemWield',
                    'params': {'slot': slot, 'key': key, 'skill': skill}
                }).done(function (json) {
                    if (!verifyJson(json)) {
                        return;
                    }

                    refreshGame(null);
                });
            });
            $('.item-move-eat').off('click').click(function () {
                var slot = $(this).attr('slot');
                var key = $(this).attr('key');
                var skill = $(this).attr('skill');
                var name = $(this).attr('name');
                var much = prompt("How many " + name + " would you like to eat?", "");

                $.post('game/action/initiate', {
                    'action': 'ItemWield',
                    'params': {'slot': slot, 'key': key, 'skill': skill, 'much': much}
                }).done(function (json) {
                    if (!verifyJson(json)) {
                        return;
                    }

                    refreshGame(null);
                });
            });
            $('.item-remove').off('click').click(function () {
                var slot = $(this).attr('slot');
                var key = $(this).attr('key');
                var name = $(this).attr('name');


                $.post('game/action/initiate', {'action': 'ItemRemove', 'params': {'name': name}}).done(function (json) {
                    if (!verifyJson(json)) {
                        return;
                    }

                    refreshGame(null);
                });
            });


            $('.open-messages').off('click').click(function () {
                var player_id = $(this).attr('player_id');
                playerMessages(player_id);
            });


            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            $('.open-shop').off('click').click(function () {
                var name = $(this).attr('name');
                popupShop(name);
            });
            $('.open-stable').off('click').click(function () {
                var name = $(this).attr('name');
                popupShop(name);
            });
            $('.open-stats').off('click').click(function () {
                var name = $(this).attr('name');
                popupStats(name);
            });

            $('.player-guild').off('click').click(function () {
                var name = $(this).attr('name');
                popupPlayerGuild(name);
            });
            $('.open-market').off('click').click(function () {
                var name = $(this).attr('name');
                popupMarket(name);
            });
            $('.open-guild-menu').off('click').click(function () {
                var guild = $(this).attr('guild');
                popupGuildMenu(guild);
            });

            $('.open-phouse').off('click').click(function () {
                var town = $(this).attr('town');
                popupPHouse(town);
            });
            $('.chat_settings').off('click').click(function () {
                var user = $(this).attr('user');
                popupCSettings(user);
            });
            $('.open-npc').off('click').click(function () {
                var name = $(this).attr('name');
                popupNPC(name);
            });
            $('.open-boost').off('click').click(function () {
                var name = $(this).attr('name');
                popupBoosts(name);
            });
            $('.events').off('click').click(function () {
                var name = $(this).attr('name');
                popupEvents(name);
            });
            $('.open-mp').off('click').click(function () {
                var name = $(this).attr('name');
                popupMP(name);
            });
            $('.player-cast').off('click').click(function () {
                var name = $(this).attr('name');
                popupPlayerCast(name);
            });
            $('.tickets').off('click').click(function () {
                var player_id = $(this).attr('player_id');
                openTickets(player_id);
            });
            $('.player_stats').off('click').click(function () {
                var player_id = $(this).attr('player_id');
                openPStats(player_id);
            });
            $('.trade').off('click').click(function () {
                var to_name = $(this).attr('to_name');
                startTrade(to_name);
            });
            $('.force-bot').off('click').click(function () {
                var player_id = $(this).attr('player_id');
                forceBot(player_id);
            });
            $('.char_guild').off('click').click(function () {
                popupPlayerGuild();
            });
            $('.trick').off('click').click(function () {
                var town = $(this).attr('town');
                popupTrick(town);
            });
        };
        await sleep(1000);
    }
}

async function updateHealth() {
    $('#health').load('# #health');
}

async function fixFightTimer() {
    while (true) {
        unsafeWindow.fighttimer = function (seconds, token, doing, much) {
            cancelled = false;

            var check = function () {
                if (cancelled) {
                    $('#fight_timer').hide();
                    $('#fight_text').hide();
                    $('#active_text').hide();
                    $('#action').show();
                    $('#events').show();

                    $('#fight_active_text').hide();

                    $('#food').hide();
                    $('#playerhp').hide();
                    $('#combat').hide();
                    $('#console-table').show();
                } else if (seconds > 0) {
                    if (seconds % 4 == 0)
                        updateHealth();
                    $('#playerhp').show();
                    $('#food').show();
                    $('#fight_timer').show().html('<a href="javascript:cancelAction(\'' + token + '\')">' + seconds + '</a><br><p id="workinfo">');
                    $('#timer-tab').show().html(''+ seconds +' - Triborn');
                    $('#fight_text').show();
                    $('#combat').show();
                    $('#console-table').hide();
                    seconds--;
                    setTimeout(check, 1000);
                } else {
                    $('#playerhp').show();
                    $('#food').show();
                    $('#fight_active_text').show().html(much);
                    $('#combat').show();
                    $('#console-table').hide();
                    $('#fight_text').prepend('<span style="background-color: black;">' + completeActionMessage + '</span><br>');

                    if (repeat) repeat();
                }

            };

            setTimeout(check, 1000);
        };
        await sleep(1000);
    }
}

async function fixCancelAction() {
    while (true) {
        unsafeWindow.cancelAction = function (token) {
            unsafeWindow.repeat = null;
            $.post('game/action/cancel', {'token': token}).done(function(data){
                $('#active').hide();
                $('#food').hide();
                $('#playerhp').hide();
                unsafeWindow.cancelled = true;
                refreshGame();
            });
        };
        await sleep(1000);
    }
}

async function injectRefreshButton() {
    while (true) {
        if (!$('#ui-refresh').is(':visible'))
            $('#system p + p').css('margin-left', '15%').append('<a id="ui-refresh"><img title="Refresh" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4goWEiYb/oM9HQAABPlJREFUSMeVVVtsVEUY/ubcL7tn26VXWukF2tKCwVKgxhptghKVKMY3X0x4wEQTE6PGBAq13CIoKl4eSIwajQ8mJkYlJoggGCMmIk2oEmiR0iJ0e9nt7p7ds+ecPTNnfCgSkNLWL/kzyTcz/5d/5r8QzIPGrWqzLApvEkKe4ODvDV5wX8KXYFggxNnIZS/Amv4NwfLt2oPlJdGvu1YsW9tWXw0RkKF7R5InaWahAsJs5F/vw17RZz5TUWodX9faWNvRthS1lWWQFEWSoQr4H5j18N07zc1VsehHXSubhNaGGgiEgHMOy1CTT9/fku070S0tVID8l+jYa20sj0Y+bG+qq66tXATOOQghcLwiriUzcDyPO54P36fMLRYTnkcPnng58faCBR45WJla3VIfL41GwCgFEWaClEQJRCDgAERRBCAg73lIJNP4eyqdtHPejpOvJA7NK7D50yZeV1UGRikEQbghQAiBQAjIdQMhEEURiqLAKzIMXR3HlanUoR9fTDw3ZxY1rlf6TEUCYyGCgIIGFJRSMMZAKUNAKRhlYJQhKAbwPR/gIcpLomCcd1j3CfroUefYHQWi9/L1juPUadLMFg1mnNsFDxPpHOy8i3zBm+FDhpCFKBaLYJTCVDWSd/06qwv9Y8e90dsE2repj0ISTDfAYL7g3CMhhEAIGAuRK7gYS+cyU3n3l1TeSU5k89G0U1CCgBIRHDQIQDgHA485rpcd/cE9AgC3pJusSQdkzhuTTq6iKOsDTj57oLbcJ5ZuIggoioxecRz27B/7vGEA6OgzVmcK3u6krWyotkzJMkIgYABQPmsd6LLYXFmiazErcvTsXvdgnoWbRia9qfFUFq7vIaQhiCSsXLPdSK3tMbJBMXz8915nY9rxnxpNZSenszZcp4CQUjKrgKrIUlnMxGJL7Vy3J/LVuf3+YT9gDyVsempsOoDn47wsoKYkIsSXLjasRYbwWvt247v+XYXDTsh3j2WdnO16CCj1//V5yxOJkoxIJApZlokiuZvU18WEG4Tv8DD38Jk+FAAIa3YaWyRJQsw0ENFUkpi2HxN6jJEzvfmGjh16q19kz/vgF2etgw3vVmVWNdTEmO8CAOyCj6l8gduOV/QpTYWcnJMEUmGp8qqGihg45wDnmMzYuJb1bS6K+13HV32GTy7s80Zuy6Ka9Xp11NA7y0tj4GEIQ9cQjxikzDKlRREzaunq0ripVamqgqiuQRQlCIIAK2LCkAQ157oPcAjfDOwpfD9rBC2vItpYW/Nne1P9kqgmw/M8cM5nDBw8vGm9zoc8BDjAOYfr+xgYSRR/7smps37y4BvIOdl899nhq+Mpx0PUisE0TWiqBlXRbqyqql43DbqqQ1U1KIqKeEkpNO3Wdn5bJY+e8DPxLvXzdD7flnGcZbKkENM0oSoKREmEJElQZQWCIEASRYiiBEkUoWk6hicmeSJt/3T1uP/ZHZvdzejcH6+NqNrHuqJ06opkKrIkRHQdUUMjNfFScB4CAIqU4dzlUX4pkfr21NbUk3N20zuhrw8C2rqNou415wJ2pq3uLoTgyDkOBoZH+cVr4xdP92Rb5m3X803A7reqtyxfsvjQqsZ6TNs2Tg9d4lcmkoP9vXYbAL6gkTkXGAtZJpfH5bEEfj0/xC8lJr/o77Vb67ahakETbb4R27xVaSGieAwgCud819Be94O5LvwDsEhfkjDhstcAAAAASUVORK5CYII="/></a>').click(() => refreshGame(null));
        await sleep(1000);
    }
}

function main() {
    fixGuildPopup();
    fixEventBindings();
    fixFightTimer();
    fixCancelAction();
    injectRefreshButton();
}

$(window).on("load", main);