// ==UserScript==
// @name         LZT Music Streaming
// @namespace    https://greasyfork.org/ru/users/1142494-llimonix
// @version      1.3.3
// @description  Трансляция музыки с ВК и ЯМ в статус профилея Lolzteam
// @author       llimonix
// @match        https://music.yandex.ru/*
// @match        https://lolz.live/*
// @match        https://vk.com/*
// @match        https://music.youtube.com/*
// @match        https://developer.spotify.com/dashboard/create?type=LZTMS
// @match        https://soundcloud.com/*
// @icon         https://cdn-icons-png.flaticon.com/512/3845/3845874.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/475615/LZT%20Music%20Streaming.user.js
// @updateURL https://update.greasyfork.org/scripts/475615/LZT%20Music%20Streaming.meta.js
// ==/UserScript==
(function() {
    document.addEventListener("DOMContentLoaded", () => {
        function LZTMSgenerateRandomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';

            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                result += characters.charAt(randomIndex);
            }
            return result;
        }

        function LZTMSupdateStatusLive(LZTMSstatusLive) {
            var LZTMSliveStatusEdit = document.querySelector('[data-edit-url="account/status-update"]');
            if (LZTMSliveStatusEdit) {
                LZTMSliveStatusEdit.textContent = LZTMSstatusLive
            }
        }

        function LZTMSupdateStatus() {
            var LZTMSartist = GM_getValue('LZTMSartist', "false")
            var LZTMStrack = GM_getValue('LZTMStrack', "false")
            var LZTMScustom_title = GM_getValue('LZTMSdefaultStatus', '')
            GM_setValue('LZTMSready_track', "false");
            if (GM_getValue('LZTMSdefaultSet', "false") == "false") {
                LZTMScustom_title = '♫ ' + LZTMSartist + ' - ' + LZTMStrack
                while (LZTMScustom_title.length > 50) {
                    console.log(LZTMScustom_title);
                    console.log(LZTMSartist);
                    if (LZTMSartist.split(", ").length > 1) {
                        var LZTMSartist_list = LZTMSartist.split(", ").slice(0, -1);
                        var LZTMSartist_slice = "";
                        LZTMSartist_list.forEach(function(element) {
                            LZTMSartist_slice += element + ', ';
                        });
                        LZTMSartist_slice = LZTMSartist_slice.slice(0, -2);
                        LZTMScustom_title = '♫ ' + LZTMSartist_slice + ' - ' + LZTMStrack
                    } else {
                        LZTMScustom_title = LZTMScustom_title.slice(0, 47) + "...";
                    }
                }
            }
            XenForo.ajax('https://lolz.live/account/status-update', {
                custom_title: LZTMScustom_title
            }).then(function(data) {
                if (GM_getValue('LZTMSdefaultSet', "false") == "false") {
                    GM_setValue('LZTMSstatus_track', `♫ ${LZTMSartist} - ${LZTMStrack}`);
                    LZTMSupdateStatusLive(LZTMScustom_title);
                } else {
                    GM_setValue('LZTMSstatus_track', GM_getValue('LZTMSdefaultStatus', ''));
                    LZTMSupdateStatusLive(GM_getValue('LZTMSdefaultStatus', ''));
                }
            })

        }

        function LZTMSexecuteScriptYM(LZTMSrandomStringYM, LZTMSintervalYM) {
            if (GM_getValue('LZTMSintervalYM', '0') != LZTMSrandomStringYM) {
                clearInterval(LZTMSintervalYM)
            }
            var LZTMSartistElement = document.querySelectorAll('.d-artists.d-artists__expanded a.d-link.deco-link');
            var LZTMStrackElement = document.querySelector('.track__name-innerwrap a.d-link.deco-link.track__title');
            var LZTMSpauseElement = document.querySelector('.player-controls .player-controls__btn_pause');

            if (LZTMSpauseElement == null) {
                GM_setValue('LZTMSdefaultSet', "true");
            } else {
                GM_setValue('LZTMSdefaultSet', "false");
            }

            if (LZTMSartistElement && LZTMStrackElement) {
                var LZTMSartist = '';
                LZTMSartistElement.forEach(function(element) {
                    LZTMSartist += element.textContent + ', ';
                });
                LZTMSartist = LZTMSartist.slice(0, -2);

                var LZTMStrack = LZTMStrackElement.textContent;
                GM_setValue('LZTMSartist', LZTMSartist);
                GM_setValue('LZTMStrack', LZTMStrack);
                GM_setValue('LZTMSready_track', "true");
            }

            if(GM_getValue('LZTMSactiveService', 0) !== 'ym') {
                clearInterval(LZTMSintervalYM);
            }
        }

        function LZTMSexecuteScriptVK(LZTMSrandomStringVK, LZTMSintervalVK) {
            if (GM_getValue('LZTMSintervalVK', '0') != LZTMSrandomStringVK) {
                clearInterval(LZTMSintervalVK)
            }
            var LZTMSplayerElement = document.querySelector('.top_audio_player.top_audio_player_enabled');
            if (LZTMSplayerElement) {
                var LZTMSartistElement = document.querySelector('.top_audio_player_title');
                var LZTMStrackElement = document.querySelector('.top_audio_player_title');
                var LZTMSpauseElement = document.querySelector('.top_audio_player_playing');

                if (LZTMSpauseElement == null) {
                    GM_setValue('LZTMSdefaultSet', "true");
                } else {
                    GM_setValue('LZTMSdefaultSet', "false");
                }

                if (LZTMSartistElement && LZTMStrackElement) {
                    var LZTMSartist = (LZTMSartistElement.textContent).split(' — ')[0];
                    var LZTMStrack = (LZTMStrackElement.textContent).split(' — ')[1];
                    GM_setValue('LZTMSartist', LZTMSartist);
                    GM_setValue('LZTMStrack', LZTMStrack);
                    GM_setValue('LZTMSready_track', "true");
                }
            }
            if(GM_getValue('LZTMSactiveService', 0) !== 'vk') {
                clearInterval(LZTMSintervalVK);
            }
        }

        function LZTMSexecuteScriptYTM(LZTMSrandomStringYTM, LZTMSintervalYTM) {
            if (GM_getValue('LZTMSintervalYTM', '0') != LZTMSrandomStringYTM) {
                clearInterval(LZTMSintervalYTM)
            }
            var LZTMSplayerElement = document.querySelector('[slot="player-bar"]')
            if (LZTMSplayerElement) {
                var LZTMSartistElement = document.querySelectorAll('.ytmusic-player-bar .yt-simple-endpoint');
                var LZTMStrackElement = document.querySelector('.ytmusic-player-bar .ytmusic-player-bar.title');
                var LZTMSpauseElement = document.querySelector('.ytmusic-player-bar .ytmusic-player-bar .play-pause-button #icon path');

                if (LZTMSpauseElement) {
                    if (LZTMSpauseElement.getAttribute('d') == "M6,4l12,8L6,20V4z") {
                        GM_setValue('LZTMSdefaultSet', "true");
                    } else {
                        GM_setValue('LZTMSdefaultSet', "false");
                    }
                } else {
                    GM_setValue('LZTMSdefaultSet', "true");
                }

                if (LZTMSartistElement && LZTMStrackElement) {
                    var LZTMSartist = '';
                    LZTMSartistElement.forEach(function(element) {
                        if (element.getAttribute('href').startsWith('channel')) {
                            LZTMSartist += element.textContent + ', ';
                        };
                    });
                    LZTMSartist = LZTMSartist.slice(0, -2);
                    var LZTMStrack = LZTMStrackElement.textContent
                    GM_setValue('LZTMSartist', LZTMSartist);
                    GM_setValue('LZTMStrack', LZTMStrack);
                    GM_setValue('LZTMSready_track', "true");
                }
            }
            if(GM_getValue('LZTMSactiveService', 0) !== 'ytm') {
                clearInterval(LZTMSintervalYTM);
            }
        }

        function LZTMSexecuteScriptSCD(LZTMSrandomStringSCD, LZTMSintervalSCD) {
            console.log(321);
            if (GM_getValue('LZTMSintervalSCD', '0') != LZTMSrandomStringSCD) {
                clearInterval(LZTMSintervalSCD)
            }
            var LZTMSplayerElement = document.querySelector('.playControls__elements')
            if (LZTMSplayerElement) {
                var LZTMSartistElement = document.querySelector('a.playbackSoundBadge__lightLink').textContent;
                var LZTMStrackElement = document.querySelector("a.playbackSoundBadge__titleLink span[aria-hidden='true']").textContent;
                var LZTMSpauseElement = document.querySelector('button.playControl');
                console.log(LZTMSartistElement);
                console.log(LZTMStrackElement);
                console.log(LZTMSpauseElement);

                if (LZTMSpauseElement.classList.contains('playing')) {
                    GM_setValue('LZTMSdefaultSet', "false");
                } else {
                    GM_setValue('LZTMSdefaultSet', "true");
                }

                if (LZTMSartistElement && LZTMStrackElement) {
                    var LZTMSartist = LZTMSartistElement;
                    var LZTMStrack = LZTMStrackElement;
                    GM_setValue('LZTMSartist', LZTMSartist);
                    GM_setValue('LZTMStrack', LZTMStrack);
                    GM_setValue('LZTMSready_track', "true");
                }
            }
            if(GM_getValue('LZTMSactiveService', 0) !== 'scd') {
                clearInterval(LZTMSintervalSCD);
            }
        }

        function LZTMSexecuteScriptSpotify(LZTMSrandomStringSpotify, LZTMSintervalSpotify) {
            if (GM_getValue('LZTMSintervalSpotify', '0') != LZTMSrandomStringSpotify) {
                clearInterval(LZTMSintervalSpotify)
            }
            if (GM_getValue('LZTMScodespotifyAPI', "ready") == "ready" || GM_getValue('LZTMScodespotifyAPI', "ready") == "") {
                XenForo.alert('Ошибка: не указан API токен Spotify!', 1, 5000)
                GM_setValue('LZTMSdefaultSet', "true");
                clearInterval(LZTMSintervalSpotify);
            } else {
                fetch('https://api.spotify.com/v1/me/player', {
                    headers: {
                        'Authorization': `Bearer ${GM_getValue('LZTMScodespotifyAPI', "ready")}`
                    }
                })
                    .then(response => {
                    if (response.status == 200) {
                        return response.json();
                    } else if (response.status == 401) {
                        var data = new URLSearchParams({
                            'grant_type': 'refresh_token',
                            'refresh_token': GM_getValue('LZTMSrefreshTokenSpotify', '')
                        });
                        var basicAuth = btoa(`${GM_getValue('LZTMSclientIDspotify', '')}:${GM_getValue('LZTMSclientSecretspotify', '')}`);
                        var requestOptions = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': `Basic ${basicAuth}`,
                            },
                            body: data,
                        };
                        return fetch("https://accounts.spotify.com/api/token", requestOptions)
                            .then(response => response.json())
                            .then(token_data => {
                            var access_token = token_data.access_token;
                            var refresh_token = token_data.refresh_token || '';
                            GM_setValue('LZTMScodespotifyAPI', access_token);
                            if (refresh_token != '') {
                                GM_setValue('LZTMSrefreshTokenSpotify', refresh_token);
                            }
                            return null;
                        });
                    } else if (response.status == 204) {
                        clearInterval(LZTMSintervalSpotify);
                        return null;
                    } else {
                        XenForo.alert('Ошибка: Spotify выдал ошибку!', 1, 5000)
                        return null;
                    }
                })
                    .then(data => {
                    if (data != null) {
                        var LSTMSpaused = data.is_playing;
                        if (LSTMSpaused == false) {
                            GM_setValue('LZTMSdefaultSet', "true");
                        } else {
                            var LZTMStrack = data.item.name;
                            var LZTMSartistMAP = data.item.artists;
                            var LZTMSartist = LZTMSartistMAP.map(artist => artist.name).join(', ');
                            GM_setValue('LZTMSartist', LZTMSartist);
                            GM_setValue('LZTMStrack', LZTMStrack);
                            GM_setValue('LZTMSready_track', "true");
                            GM_setValue('LZTMSdefaultSet', "false");
                            if (GM_getValue('LZTMSactiveService', 0) !== 'spotify') {
                                clearInterval(LZTMSintervalSpotify);
                            }
                        }
                    }
                })
                    .catch(error => {
                    XenForo.alert('Ошибка: не удалось получить и сохранить Ваш токен!', 1, 10000);
                    console.error(`Error: ${error}`);
                });

            }
        }

        function LZTMSexecuteScriptLFM(LZTMSrandomStringLFM, LZTMSintervalLFM) {
            if (GM_getValue('LZTMSintervalLFM', '0') != LZTMSrandomStringLFM) {
                clearInterval(LZTMSintervalLFM)
            }
            if (GM_getValue('LZTMSlastfmAPI', "ready") == "ready" || GM_getValue('LZTMSlastfmNAME', "ready") == "") {
                XenForo.alert('Ошибка: не указан API Key или имя сервиса Last.fm!', 1, 5000)
                clearInterval(LZTMSintervalLFM);
            } else {
                fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${GM_getValue('LZTMSlastfmNAME', '')}&api_key=${GM_getValue('LZTMSlastfmAPI', '')}&format=json&limit=1`, {})
                    .then(response => {
                    if (response.status == 200) {
                        return response.json();
                    } else if (response.status == 403) {
                        XenForo.alert('Ошибка: некорректно указан API Key сервиса Last.fm или возникла другая ошибка!!', 1, 5000)
                        GM_setValue('LZTMSdefaultSet', "true");
                        clearInterval(LZTMSintervalLFM);
                        return null;
                    } else if (response.status == 404) {
                        XenForo.alert('Ошибка: некорректно указано имя пользователя сервиса Last.fm или возникла другая ошибка!', 1, 5000)
                        GM_setValue('LZTMSdefaultSet', "true");
                        clearInterval(LZTMSintervalLFM);
                        return null;
                    } else {
                        XenForo.alert('Ошибка: Last.fm выдал ошибку!', 1, 5000)
                        clearInterval(LZTMSintervalSpotify);
                        return null;
                    }
                })
                    .then(data => {
                    if (data != null) {
                        if (data.recenttracks && data.recenttracks.track[0]['@attr']) {
                            var LZTMStrack = data.recenttracks.track[0].name;
                            var LZTMSartist = data.recenttracks.track[0].artist["#text"];
                            /* var LZTMSartist = LZTMSartistMAP.map(artist => artist.name).join(', '); */
                            GM_setValue('LZTMSartist', LZTMSartist);
                            GM_setValue('LZTMStrack', LZTMStrack);
                            GM_setValue('LZTMSready_track', "true");
                            GM_setValue('LZTMSdefaultSet', "false");
                            if (GM_getValue('LZTMSactiveService', 0) !== 'lfm') {
                                clearInterval(LZTMSintervalLFM);
                            }
                        } else {
                            GM_setValue('LZTMSdefaultSet', "true");
                        }
                    }
                })
                    .catch(error => {
                    XenForo.alert('Ошибка: Last.fm выдал ошибку!', 1, 10000);
                    console.error(`Error: ${error}`);
                    GM_setValue('LZTMSdefaultSet', "true");
                    clearInterval(LZTMSintervalLFM);
                });

            }
        }


        function LZTMSexecuteScriptLolz(LZTMSrandomStringLOLZ, LZTMSintervalLOLZ) {
            if (GM_getValue('LZTMSintervalLOLZ', '0') != LZTMSrandomStringLOLZ) {
                clearInterval(LZTMSintervalLOLZ)
            }

            if (GM_getValue('LZTMSready_track', "false") == "true") {
                var LZTMSstatus = GM_getValue('LZTMSstatus_track', "false")
                var LZTMSstatus_req
                if (GM_getValue('LZTMSdefaultSet', "false") == "false") {
                    LZTMSstatus_req = '♫ ' + GM_getValue('LZTMSartist', "false") + ' - ' + GM_getValue('LZTMStrack', "false")
                } else {
                    LZTMSstatus_req = GM_getValue('LZTMSdefaultStatus', '')
                }
                GM_setValue('LZTMScountDefault', 0);
                if (LZTMSstatus != LZTMSstatus_req) {
                    LZTMSupdateStatus();
                } else {
                    GM_setValue('LZTMSready_track', "false");
                }
            } else {
                GM_setValue('LZTMScountDefault', GM_getValue('LZTMScountDefault', 0) + 1);
                if (GM_getValue('LZTMScountDefault', 0) > 10 && (GM_getValue('LZTMSdefaultSet', "false") == "false" || GM_getValue('LZTMSdefaultStatus', '') != GM_getValue('LZTMSstatus_track', ''))) {
                    GM_setValue('LZTMScountDefault', 1);
                    GM_setValue('LZTMSdefaultSet', "true");
                    GM_setValue('LZTMSready_track', "true");
                } else if (GM_getValue('LZTMScountDefault', 0) > 10 && GM_getValue('LZTMSdefaultSet', "false") == "true") {
                    GM_setValue('LZTMScountDefault', 1);
                }
            }

        }


        if (window.location.href.startsWith('https://music.yandex.ru/') && !window.location.href.startsWith('https://music.yandex.ru/api/')) {
            if (GM_getValue('LZTMSactiveStatus', "notchecked") == "checked") {
                if (GM_getValue('LZTMSactiveService', 0) === 'ym') {
                    var LZTMSrandomStringYM = LZTMSgenerateRandomString(10);
                    GM_setValue('LZTMSintervalYM', LZTMSrandomStringYM)
                    var LZTMSintervalYM = setInterval(function() {
                        LZTMSexecuteScriptYM(LZTMSrandomStringYM, LZTMSintervalYM)}, 3000);

                }
            }
        }

        if (window.location.href.startsWith('https://vk.com/')) {
            if (GM_getValue('LZTMSactiveStatus', "notchecked") == "checked") {
                if (GM_getValue('LZTMSactiveService', 0) === 'vk') {
                    var LZTMSrandomStringVK = LZTMSgenerateRandomString(10);
                    GM_setValue('LZTMSintervalVK', LZTMSrandomStringVK)
                    var LZTMSintervalVK = setInterval(function() {
                        LZTMSexecuteScriptVK(LZTMSrandomStringVK, LZTMSintervalVK)}, 3000);

                }
            }
        }

        if (window.location.href.startsWith('https://soundcloud.com/')) {
            console.log(123);
            if (GM_getValue('LZTMSactiveStatus', "notchecked") == "checked") {
                if (GM_getValue('LZTMSactiveService', 0) === 'scd') {
                    var LZTMSrandomStringSCD = LZTMSgenerateRandomString(10);
                    GM_setValue('LZTMSintervalSCD', LZTMSrandomStringSCD)
                    var LZTMSintervalSCD = setInterval(function() {
                        LZTMSexecuteScriptSCD(LZTMSrandomStringSCD, LZTMSintervalSCD)}, 3000);

                }
            }
        }

        if (window.location.href.startsWith('https://music.youtube.com/')) {
            if (GM_getValue('LZTMSactiveStatus', "notchecked") == "checked") {
                if (GM_getValue('LZTMSactiveService', 0) === 'ytm') {
                    var LZTMSrandomStringYTM = LZTMSgenerateRandomString(10);
                    GM_setValue('LZTMSintervalYTM', LZTMSrandomStringYTM)
                    var LZTMSintervalYTM = setInterval(function() {
                        LZTMSexecuteScriptYTM(LZTMSrandomStringYTM, LZTMSintervalYTM)}, 3000);

                }
            }
        }

        if (GM_getValue('LZTMSactiveService', 0) === 'spotify') {
            if (GM_getValue('LZTMSactiveStatus', "notchecked") == "checked") {
                var LZTMSrandomStringSpotify = LZTMSgenerateRandomString(10);
                GM_setValue('LZTMSintervalSpotify', LZTMSrandomStringSpotify)
                var LZTMSintervalSpotify= setInterval(function() {
                    LZTMSexecuteScriptSpotify(LZTMSrandomStringSpotify, LZTMSintervalSpotify)}, 5000);
            }
        }

        if (GM_getValue('LZTMSactiveService', 0) === 'lfm') {
            if (GM_getValue('LZTMSactiveStatus', "notchecked") == "checked") {
                var LZTMSrandomStringLFM = LZTMSgenerateRandomString(10);
                GM_setValue('LZTMSintervalLFM', LZTMSrandomStringLFM)
                var LZTMSintervalLFM = setInterval(function() {
                    LZTMSexecuteScriptLFM(LZTMSrandomStringLFM, LZTMSintervalLFM)}, 5000);
            }
        }

        if (window.location.href.startsWith('https://developer.spotify.com/dashboard/create?type=LZTMS')) {
            var LZTMSselectore
            function MusicStreamingMenu() {
                if (document.querySelector('input[id="name"]')) {
                    LZTMSselectore = document.querySelector('input[id="name"]');
                    LZTMSselectore.value = "LZT Music Streaming";
                    LZTMSselectore.blur();
                    LZTMSselectore = document.querySelector('textarea[id="description"]');
                    LZTMSselectore.value = "Транслируем музыку в статус профиля LOLZTEAM, играющую в Spotify";
                    LZTMSselectore.blur();
                    LZTMSselectore = document.querySelector('input[id="website"]')
                    LZTMSselectore.value = "https://github.com/llimonix";
                    LZTMSselectore.blur();
                    LZTMSselectore = document.querySelector('input[id="newRedirectUri"]')
                    LZTMSselectore.value = "https://lolz.live/threads/5846703/";
                    LZTMSselectore.blur();
                    if (document.querySelector('input[id="termsAccepted"]').checked == false) {
                        document.querySelector('label[for="termsAccepted"] > span:nth-child(1)').click();
                        return true
                    }
                    return false
                }
            }
            var LZTMSintervalSpotifyDeveloper = setInterval(function() {
                var LZTMSintervalSpotifyStatus = MusicStreamingMenu();
                if (LZTMSintervalSpotifyStatus == true) {
                    clearInterval(LZTMSintervalSpotifyDeveloper);
                }
            }, 500);
        }

        if (window.location.href.startsWith('https://lolz.live/')) {
            function MusicStreamingMenu() {
                document.querySelectorAll('div.modal.fade').forEach(el => el.remove());
                var LZTMSmodalBackdrops = document.querySelectorAll('div.modal-backdrop');
                var LSTMScodeSpotifyAPI = GM_getValue('LZTMScodespotifyAPI', "");
                if (LZTMSmodalBackdrops.length > 0) {
                    LZTMSmodalBackdrops[LZTMSmodalBackdrops.length - 1].remove();
                }
                var LZTMSdefaultStatus = GM_getValue('LZTMSdefaultStatus', '');
                var LZTMScontentMenu = `<h3 class="textHeading" style="margin-left: 30px;">Музыкальный сервис</h3><li style="margin-left: 30px;"><input type="checkbox" id="lzt_music_active"><label for="lzt_music_active">Включить трансляцию музыки в статус</label></li><ul style="display: flex; flex-direction: column; padding-bottom: 10px; margin-left: 50px;"><li style="list-style-type: none;"><label for="lzt_musicStreaming_vk"><input type="radio" name="lzt_music_service" id="lzt_musicStreaming_vk" value="vk"> ВК Музыка</label></li><li style="list-style-type: none;"><label for="lzt_musicStreaming_ym"><input type="radio" name="lzt_music_service" id="lzt_musicStreaming_ym" value="ym"> Яндекс.Музыка</label></li><li style="list-style-type: none;"><label for="lzt_musicStreaming_ytm"><input type="radio" name="lzt_music_service" id="lzt_musicStreaming_ytm" value="ytm"> Youtube Music</label></li><li style="list-style-type: none;"><label for="lzt_musicStreaming_spotify"><input type="radio" name="lzt_music_service" id="lzt_musicStreaming_spotify" value="spotify"> Spotify</label></li><li style="list-style-type: none;"><label for="lzt_musicStreaming_lastfm"><input type="radio" name="lzt_music_service" id="lzt_musicStreaming_lastfm" value="lfm"> Last.fm</label></li><li style="list-style-type: none;"><label for="lzt_musicStreaming_scd"><input type="radio" name="lzt_music_service" id="lzt_musicStreaming_scd" value="scd"> Soundcloud</label></li></ul><h3 class="textHeading" style="margin-left: 30px;">Настройки</h3><dl style="margin-left: 30px;  margin-right: 30px"><div style="display: flex;align-items: center;"><dt style=""><label>Статус по умолчанию:</label></dt><dd style="flex: 1"><input class="textCtrl" id="lzt_music_defaultstatus" value="${LZTMSdefaultStatus}" placeholder="..." style="width: 100%;"></dd></div>
    <p style="color: #626262; margin-bottom: 0px">Статус, который будет отображаться когда музыка на паузе или музыкальный сервис неактивен</p><div class="LZTMSinputSpotifyAPI" style="display: none; margin-top: 15px"><div style="display: flex;align-items: center;padding-bottom: 15px;"><dt><label>Spotify API:</label></dt><dd style="flex: 1;"><div class="inputRelative"><div class="inputRelative"><input type="password" class="textCtrl" id="lzt_music_spotifyAPI" value="${LSTMScodeSpotifyAPI}" placeholder="..." style="width: 100%"></div></div></dd><button style="margin-left: 10px" class="button" id="lzt_music_get_spotifyAPI">Получить токен</button></div><div style="margin-left: -15px; display: flex;align-items: center; padding-bottom: 15px"><dd style="flex: 1;"><div class="inputRelative"><input type="password" class="textCtrl" id="lzt_music_spotifyClientID" value="${GM_getValue('LZTMSclientIDspotify', '')}" placeholder="Client ID" style="width: 100%" aria-autocomplete="list"></div></dd><dd style="flex: 1;"><div class="inputRelative"><input type="password" class="textCtrl" id="lzt_music_spotifyClientSecret" value="${GM_getValue('LZTMSclientSecretspotify', '')}" placeholder="Client secret" style="width: 100%"></div></dd></div><p style="color: #626262; margin-bottom: 0px">Перед нажатием кнопки «Получить токен» авторизуйтесь в Spotify и подтвердите почту (<a href="https://lolz.live/threads/5846703/" style="color: #626262">ИНСТРУКЦИЯ</a>)</p></div>
<div class="LZTMSinputLastFMAPI" style="display: none"><div style="display: flex;align-items: center;padding-bottom: 15px;"><dt><label>Last.fm API:</label></dt><dd style="flex: 1;"><div class="inputRelative"><div class="inputRelative"><input type="password" class="textCtrl" id="lzt_music_lastfmAPI" value="${GM_getValue('LZTMSlastfmAPI', '')}" placeholder="API Key" style="width: 100%"></div></div></dd><button style="margin-left: 10px" class="button" id="lzt_music_get_lastfmAPI">Получить ключ</button></div><div style="display: flex;align-items: center;padding-bottom: 15px;"><dt><label>Last.fm имя пользователя в профиле:</label></dt><dd style="flex: 1;"><div class="inputRelative"><div class="inputRelative"><input class="textCtrl" id="lzt_music_lastNAME" value="${GM_getValue('LZTMSlastfmNAME', '')}" placeholder="..." style="width: 100%"></div></div></dd></div><p style="color: #626262">Last.fm позволяет подключить к себе такие сервисы как Spotify, YouTube, Tidal, Deezer и другие. Ознакомьтесь со списком www.last.fm/ru/about/trackmymusic</p></div><div class="LZTMSinputYMAPI" style="display: flex;align-items: center;"><dt><label>Яндекс.Музыка API (скоро):</label></dt><dd style="flex: 1;"><input disabled="" class="textCtrl" id="lzt_music_ymAPI" placeholder="Скоро..." style="width: 100%;"></dd></div>
</dl>
<div style="display: flex;padding-top: 30px;flex-direction: column;">
  <div style="flex: 1;display: flex;justify-content: space-evenly;">
    <button class="button" id="lzt_music_cache_reset" style="margin-bottom: 10px;flex: 1;margin-right: 5px;">Очистить кеш</button>
    <a href="https://greasyfork.org/ru/scripts/475615-lzt-music-streaming" class="button" id="lzt_music_update_extension" style="margin-bottom: 10px;flex: 1; margin-left: 5px;">Обновление</a><button class="button" id="lzt_music_debug" style="margin-bottom: 10px;flex: 0.2;margin-left: 10px; display: none">Debug</button>
  </div>
  <button class="button primary close OverlayCloser" id="lzt_music_save">Сохранить</button>
</div>`;
                XenForo.alert(LZTMScontentMenu, 'LZT Music Streaming');
                document.querySelector('.xenOverlay h2.heading').style.cssText = 'text-align: center; padding: 16px; font-size: 20px; font-weight: bold;';
                /* document.getElementById("lzt_music_spotifyAPI").style.paddingRight = "35px";
                document.getElementById("lzt_music_spotifyClientSecret").style.paddingRight = "35px";
                document.getElementById("lzt_music_spotifyClientID").style.paddingRight = "35px"; */
                document.getElementById("lzt_music_save").addEventListener("click", function() {
                    MusicStreamingSave();
                });
                document.getElementById("lzt_music_cache_reset").addEventListener("click", function() {
                    MusicStreamingCacheReset();
                });
                document.getElementById("lzt_music_get_spotifyAPI").addEventListener("click", function() {
                    MusicStreamingSpotifyAPICode();
                });
                document.getElementById("lzt_music_get_lastfmAPI").addEventListener("click", function() {
                    window.open('https://www.last.fm/api/account/create/', '_blank');
                });
                document.getElementById("lzt_music_debug").addEventListener("click", function() {
                    MusicStreamingDebug();
                });
                if (GM_getValue('LZTMSactiveStatus', "notchecked") === 'checked') {
                    document.getElementById("lzt_music_active").checked = true;
                }
                if (GM_getValue('LZTMSactiveService', 0) === 'vk') {
                    document.getElementById("lzt_musicStreaming_vk").checked = true;
                } else if (GM_getValue('LZTMSactiveService', 0) === 'ym') {
                    document.getElementById("lzt_musicStreaming_ym").checked = true;
                } else if (GM_getValue('LZTMSactiveService', 0) === 'ytm') {
                    document.getElementById("lzt_musicStreaming_ytm").checked = true;
                } else if (GM_getValue('LZTMSactiveService', 0) === 'spotify') {
                    document.getElementById("lzt_musicStreaming_spotify").checked = true;
                    document.querySelector('.LZTMSinputSpotifyAPI').style.display = 'block';
                } else if (GM_getValue('LZTMSactiveService', 0) === 'lfm') {
                    document.getElementById("lzt_musicStreaming_lastfm").checked = true;
                    document.querySelector('.LZTMSinputLastFMAPI').style.display = 'block';
                } else if (GM_getValue('LZTMSactiveService', 0) === 'scd') {
                    document.getElementById("lzt_musicStreaming_scd").checked = true;
                } else {
                    document.getElementById("lzt_musicStreaming_vk").checked = false;
                    document.getElementById("lzt_musicStreaming_ym").checked = false;
                    document.getElementById("lzt_musicStreaming_ytm").checked = false;
                    document.getElementById("lzt_musicStreaming_spotify").checked = false;
                    document.getElementById("lzt_musicStreaming_lastfm").checked = false;
                    document.getElementById("lzt_musicStreaming_scd").checked = false;
                }

                for (var i = 0; i < document.querySelectorAll('input[name="lzt_music_service"]').length; i++) {
                    document.querySelectorAll('input[name="lzt_music_service"]')[i].addEventListener('change', function() {
                        if (this.value === 'lfm') {
                            document.querySelector('.LZTMSinputLastFMAPI').style.display = 'block';
                            document.querySelector('.LZTMSinputSpotifyAPI').style.display = 'none';
                        } else if (this.value === 'spotify') {
                            document.querySelector('.LZTMSinputSpotifyAPI').style.display = 'block';
                            document.querySelector('.LZTMSinputLastFMAPI').style.display = 'none';
                        } else {
                            document.querySelector('.LZTMSinputLastFMAPI').style.display = 'none';
                            document.querySelector('.LZTMSinputSpotifyAPI').style.display = 'none';
                        }
                    });
                }
            }
            function MusicStreamingDebug() {
                var LZTMSDebugMenu = `<h3 class="textHeading" style="margin-left: 30px;">Значения переменных</h3><p style="margin-left: 30px;">LZTMSready_track: ${GM_getValue('LZTMSready_track', false)}<br>LZTMSdefaultSet: ${GM_getValue('LZTMSdefaultSet', false)}<br>LZTMSartist: ${GM_getValue('LZTMSartist', false)}<br>LZTMStrack: ${GM_getValue('LZTMStrack', false)}<br>LZTMScountDefault: ${GM_getValue('LZTMScountDefault', false)}<br>LZTMSrandomStringYM: ${GM_getValue('LZTMSrandomStringYM', false)}<br>LZTMSrandomStringVK: ${GM_getValue('LZTMSrandomStringVK', false)}<br>LZTMSrandomStringYTM: ${GM_getValue('LZTMSrandomStringYTM', false)}<br>LZTMSrandomStringSpotify: ${GM_getValue('LZTMSrandomStringSpotify', false)}<br>LZTMSdefaultStatus: ${GM_getValue('LZTMSdefaultStatus', false)}</p>`
                XenForo.alert(LZTMSDebugMenu, 'LZT Music Streaming Debug')
            }
            function MusicStreamingSpotifyAPICode() {
                if (document.getElementById('lzt_music_spotifyClientID').value) {
                    GM_setValue('LZTMSclientIDspotify', document.getElementById('lzt_music_spotifyClientID').value)
                }
                if (document.getElementById('lzt_music_spotifyClientSecret').value) {
                    GM_setValue('LZTMSclientSecretspotify', document.getElementById('lzt_music_spotifyClientSecret').value)
                }
                if (GM_getValue('LZTMSclientIDspotify', '') == '' || GM_getValue('LZTMSclientSecretspotify', '') == '') {
                    XenForo.alert('Ошибка: укажите Client ID и Client Secret', 1, 5000);
                    window.open('https://developer.spotify.com/dashboard/create?type=LZTMS', '_blank');
                } else {
                    var LZTMSauthUrlSpotify = 'https://accounts.spotify.com/authorize?' +
                        'response_type=code' +
                        '&client_id=' + encodeURIComponent(GM_getValue('LZTMSclientIDspotify', false)) +
                        '&scope=' + encodeURIComponent("user-read-playback-state") +
                        '&redirect_uri=' + encodeURIComponent("https://lolz.live/threads/5846703/") +
                        '&state=' + encodeURIComponent(LZTMSgenerateRandomString(16));
                    window.open(LZTMSauthUrlSpotify, '_blank');
                    var LZTMScodespotifyAPI = GM_getValue('LZTMScodespotifyAPI', "ready")
                    var LZTMSintervalAPISPOTIFY = setInterval(function() {
                        if (GM_getValue('LZTMScodespotifyAPI', "ready") != LZTMScodespotifyAPI) {
                            var lzt_music_spotifyAPI = document.getElementById("lzt_music_spotifyAPI");
                            lzt_music_spotifyAPI.value = GM_getValue('LZTMScodespotifyAPI', "ready");
                            XenForo.alert('Успешно: Ваш токен был сохранен и добавлен в поле!', 1, 10000)
                            clearInterval(LZTMSintervalAPISPOTIFY);
                        }}, 1000);
                }
            }
            if (window.location.href.startsWith('https://lolz.live/threads/5846703/?code=')) {
                function LZTMSgetParameterFromUrl(parameterName) {
                    var LZTMSurlParamsSpotifeAPI = new URLSearchParams(window.location.search);
                    return LZTMSurlParamsSpotifeAPI.get(parameterName);
                }

                var LZTMScode = LZTMSgetParameterFromUrl('code');
                var data = new URLSearchParams({
                    'grant_type': 'authorization_code',
                    'code': LZTMScode,
                    'redirect_uri': "https://lolz.live/threads/5846703/"
                });
                var basicAuth = btoa(`${GM_getValue('LZTMSclientIDspotify', '')}:${GM_getValue('LZTMSclientSecretspotify', '')}`);
                var requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${basicAuth}`,
                    },
                    body: data,
                };
                fetch("https://accounts.spotify.com/api/token", requestOptions)
                    .then(response => response.json())
                    .then(token_data => {
                    var access_token = token_data.access_token;
                    var refresh_token = token_data.refresh_token || '';
                    XenForo.alert('Успешно: Ваш токен был сохранен и добавлен в поле на странице с меню!', 1, 10000);
                    GM_setValue('LZTMScodespotifyAPI', access_token);
                    if (refresh_token != '') {
                        GM_setValue('LZTMSrefreshTokenSpotify', refresh_token);
                    }
                    return
                }).catch(error => {
                    XenForo.alert('Ошибка: не удалось получить и сохранить Ваш токен!', 1, 10000)
                    console.error(`Error: ${error}`);
                });
            }

            function MusicStreamingSave() {
                var LZTMSactiveStatus = document.getElementById("lzt_music_active");
                var LZTMSactiveService = document.getElementsByName("lzt_music_service");
                var LZTMSdefaultStatus = document.getElementById('lzt_music_defaultstatus').value;
                GM_setValue('LZTMSdefaultStatus', LZTMSdefaultStatus);
                GM_setValue('LZTMSclientIDspotify', document.getElementById('lzt_music_spotifyClientID').value)
                GM_setValue('LZTMSclientSecretspotify', document.getElementById('lzt_music_spotifyClientSecret').value)
                GM_setValue('LZTMScodespotifyAPI', document.getElementById('lzt_music_spotifyAPI').value)
                GM_setValue('LZTMSlastfmAPI', document.getElementById('lzt_music_lastfmAPI').value)
                GM_setValue('LZTMSlastfmNAME', document.getElementById('lzt_music_lastNAME').value)
                if (LZTMSactiveStatus.checked) {
                    if (LZTMSactiveService[0].checked) {
                        GM_setValue('LZTMSactiveService', 'vk');
                    } else if (LZTMSactiveService[1].checked) {
                        GM_setValue('LZTMSactiveService', 'ym');
                    } else if (LZTMSactiveService[2].checked) {
                        GM_setValue('LZTMSactiveService', 'ytm');
                    } else if (LZTMSactiveService[3].checked) {
                        GM_setValue('LZTMSactiveService', 'spotify');
                    } else if (LZTMSactiveService[4].checked) {
                        if (document.getElementById('lzt_music_lastfmAPI').value == "" || document.getElementById('lzt_music_lastNAME').value == "") {
                            XenForo.alert('Ошибка: укажите API Key или имя профиля сервиса Last.fm', 1, 5000)
                            return
                        } else {
                            GM_setValue('LZTMSactiveService', 'lfm');
                        }
                    } else if (LZTMSactiveService[5].checked) {
                        GM_setValue('LZTMSactiveService', 'scd');
                    } else {
                        XenForo.alert('Ошибка: выберите музыкальный сервис', 1, 5000)
                        return
                    }
                }
                if (LZTMSactiveStatus.checked) {
                    GM_setValue('LZTMSactiveStatus', 'checked');
                } else {
                    GM_setValue('LZTMSactiveStatus', 'notchecked');
                }
                XenForo.alert('Успешно: параметры сохранены', 1, 5000);
            }
            function MusicStreamingCacheReset() {
                GM_deleteValue('LZTMSready_track');
                GM_deleteValue('LZTMSdefaultSet');
                GM_deleteValue('LZTMSartist');
                GM_deleteValue('LZTMStrack');
                GM_deleteValue('LZTMScountDefault');
                GM_deleteValue('LZTMSrandomStringYM');
                GM_deleteValue('LZTMSrandomStringVK');
                GM_deleteValue('LZTMSrandomStringYTM');
                GM_deleteValue('LZTMSrandomStringSpotify');
                GM_deleteValue('LZTMSlastfmAPI');
                GM_deleteValue('LZTMSlastfmNAME');
                XenForo.alert('Успешно: кеш музыкальных сервисов сброшен', 1, 5000)
            }
            console.log(GM_getValue('LZTMSactiveService', ''));
            var accountMenu = document.querySelector('div#AccountMenu div.manageItems');
            if (accountMenu) {
                var newMenuItem = `<a class="manageItem" id="MusicStreamingMenu">
                <div class="SvgIcon duotone">
                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 19C9 20.1046 7.65685 21 6 21C4.34315 21 3 20.1046 3 19C3 17.8954 4.34315 17 6 17C7.65685 17 9 17.8954 9 19ZM9 19V5L21 3V17M21 17C21 18.1046 19.6569 19 18 19C16.3431 19 15 18.1046 15 17C15 15.8954 16.3431 15 18 15C19.6569 15 21 15.8954 21 17ZM9 9L21 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </div>
               <span>Music Streaming</span>
               </a>`;
                accountMenu.insertAdjacentHTML("beforeend", newMenuItem);
            }
            document.getElementById("MusicStreamingMenu").addEventListener("click", function() {
                MusicStreamingMenu();
            });

            if (GM_getValue('LZTMSactiveStatus', "notchecked") === 'checked') {
                var LZTMSrandomStringLOLZ = LZTMSgenerateRandomString(10);
                GM_setValue('LZTMSintervalLOLZ', LZTMSrandomStringLOLZ)
                var LZTMSintervalLOLZ = setInterval(function() {
                    LZTMSexecuteScriptLolz(LZTMSrandomStringLOLZ, LZTMSintervalLOLZ)}, 1000);
            }
        }
    });
})();