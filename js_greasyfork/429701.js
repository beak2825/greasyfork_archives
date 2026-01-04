// ==UserScript==
// @name         Omen检查帐号状态
// @namespace    https://greasyfork.org/users/101223
// @version      0.2.1
// @description  检查Omen帐号是否被封禁
// @author       Splash
// @match        https://login3.id.hp.com/login3/error
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      oauth.hpbp.io
// @connect      www.hpgamestream.com
// @connect      rpc-prod.versussystems.com
// @connect      api.hpbp.io
// @downloadURL https://update.greasyfork.org/scripts/429701/Omen%E6%A3%80%E6%9F%A5%E5%B8%90%E5%8F%B7%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/429701/Omen%E6%A3%80%E6%9F%A5%E5%B8%90%E5%8F%B7%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let observer = new MutationObserver(function (mutations) {
        for (let i = 0; i < mutations.length; i++) {
            for (let j = 0; j < mutations[i].addedNodes.length; j++) {
                let messageNode = mutations[i].addedNodes[j].querySelector('#message');
                if (!messageNode)
                    continue;
                this.disconnect();
                this.disconnected = true;
                run();
                break;
            }
            if (this.disconnected)
                break;
        }
    });
    observer.observe(document.getElementById('root'), {
        subtree: true,
        childList: true
    });
    function run() {
        const clientId = '130d43f1-bb22-4a9c-ba48-d5743e84d113',
        applicationId = '6589915c-6aa7-4f1b-9ef5-32fa2220c844';
        let authData = {};
        GM_addStyle(`.error-request-id{
            color: #66bbff;
            font-family: 'Microsoft YaHei','sans-serif';
            line-height: 30px;
        }`);
        document.querySelector('#message').innerHTML = '<a href="javascript:;">点击登录</a><br/><p style="font-size:12px;line-height:16px;color:red;">（PS：不排除此检测会对帐号产生副作用的可能性，请在帐号无法正常使用时再进行检测！）</p>';
        document.querySelector('#message a').onclick = function () {
            document.querySelector('.error-request-id').innerHTML = '';
            window.open(`https://oauth.hpbp.io/oauth/v1/auth?response_type=code&client_id=${clientId}&redirect_uri=http://localhost:9081/login&scope=email+profile+offline_access+openid+user.profile.write+user.profile.username+user.profile.read&state=G5g495-R4cEE${Math.random() * 100000}&max_age=28800&acr_values=urn:hpbp:hpid&prompt=consent`);
            window.onfocus = function () {
                window.onfocus = null;
                checkAccount(window.prompt('请输入以“http://localhost:9081/login”开头的链接：'));
            }
        };
        function xhr(options, retryTimes = 5) {
            let options_ = JSON.parse(JSON.stringify(options));
            return new Promise((resolve, reject) => {
                options_.onload = resolve;
                options_.onerror = options_.ontimeout = function (resp) {
                    if (--retryTimes <= 0) {
                        reject(resp);
                    } else {
                        return xhr(options, retryTimes).then(resolve, reject);
                    }
                };
                GM_xmlhttpRequest(options_);
            });
        }
        function log(str) {
            let node = document.createElement('p');
            node.innerText = str;
            document.querySelector('.error-request-id').append(node);
        }
        function cleanHeaders(headers) {
            ['Accept-Encoding', 'Connection', 'Sec-Fetch-Dest', 'Sec-Fetch-Mode', 'Sec-Fetch-Site', 'DNT', 'User-Agent', 'Content-Type', 'Accept'].forEach(header => {
                if (!headers[header])
                    headers[header] = '';
            });
            return headers;
        }
        function checkAccount(url) {
            if (!url || url == '') {
                log('未获取到url!');
                return;
            }
            let code = getCode(url);
            if (!code) {
                log('未获取到code!');
                return;
            }
            getAccessToken(code);
        }
        function getCode(url) {
            let result = url.match(/[&?]code=([^&#]+)/);
            if (result && result.length > 1)
                return result[1];
            return;
        }
        function getAccessToken(code) {
            log('[getAccessToken] 请求中...');
            xhr({
                method: 'post',
                url: 'https://oauth.hpbp.io/oauth/v1/token',
                responseType: 'json',
                headers: cleanHeaders({
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'User-Agent': 'OGH-UL-1.0.112.0',
                    'Except': '100-continue'
                }),
                data: `grant_type=authorization_code&code=${code}&client_id=${encodeURIComponent(clientId)}&redirect_uri=http%3A%2F%2Flocalhost%3A9081%2Flogin`
            }).then(resp => {
                let response = resp.response;
                if (!response.access_token) {
                    log('[getAccessToken] 非预期结果！');
                    console.log('非预期结果！', resp);
                    return;
                }
                authData.accessToken = response.access_token;
                getUserInfo();
            }, resp => {
                log('[getAccessToken] 获取token失败！');
                console.error('获取token失败！', resp);
            });
        }
        function getUserInfo() {
            log('[getUserInfo] 请求中...');
            xhr({
                method: 'get',
                url: 'https://api.hpbp.io/user/v1/users/me',
                responseType: 'json',
                headers: cleanHeaders({
                    'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authData.accessToken}`,
                    'X-HPBP-Tenant-ID': 'omencc-prod'
                })
            }).then(resp => {
                let response = resp.response;
                // 不需要这些信息，暂时保留
                if (!response.birth_date || !response.email) {
                    log('[getUserInfo] 非预期结果！(1)');
                    console.log('非预期结果！', resp);
                    return;
                }
                authData.birth_date = response.birth_date;
                authData.email = response.email;
                xhr({
                    method: 'get',
                    url: 'https://www.hpgamestream.com/gamestream/api/session/userInfo',
                    responseType: 'json',
                    headers: cleanHeaders({
                        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${authData.accessToken}`,
                        'Version': '2'
                    })
                }).then(resp => {
                    let response = resp.response;
                    if (!response.user_id) {
                        log('[getUserInfo] 非预期结果！(2)');
                        console.log('非预期结果！', resp);
                        return;
                    }
                    authData.user_id = response.user_id;
                    getTemporaryToken();
                }, resp => {
                    log('[getUserInfo] 获取userInfo失败！(2)');
                    console.error('获取userInfo失败！', resp);
                });
            }, resp => {
                log('[getUserInfo] 获取userInfo失败！(1)');
                console.error('获取userInfo失败！', resp);
            });
        }

        function getTemporaryToken() {
            log('[getTemporaryToken] 请求中...');
            xhr({
                method: 'get',
                url: `https://www.hpgamestream.com/api/thirdParty/session/temporaryToken?applicationId=${applicationId}`,
                responseType: 'json',
                headers: cleanHeaders({
                    'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authData.accessToken}`,
                    'Isen-Id': authData.user_id,
                    'Version': '1'
                    //还应有DeviceId，暂不增加
                })
            }).then(resp => {
                let response = resp.response;
                if (!response.token) {
                    log('[getTemporaryToken] 非预期结果！');
                    console.log('非预期结果！', resp);
                    return;
                }
                authData.temporaryToken = response.token;
                handShake();
            }, resp => {
                log('[getTemporaryToken] 获取temporaryToken失败！');
                console.error('获取temporaryToken失败！', resp);
            });
        }
        function handShake() {
            log('[handShake] 请求中...');
            let postData = JSON.stringify({
                'jsonrpc': '2.0',
                'id': applicationId,
                'method': 'mobile.accounts.v1.handshake',
                'params': {
                    'applicationId': applicationId,
                    'sdk': 'custom01',
                    'sdkVersion': '3.0.0',
                    'userToken': authData.temporaryToken
                }
            });
            xhr({
                method: 'post',
                url: 'https://rpc-prod.versussystems.com/rpc',
                responseType: 'json',
                headers: cleanHeaders({
                    'Accept-Encoding': 'gzip, deflate',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Connection': 'Keep-Alive',
                    'Cache-Control': 'no-cache'
                }),
                data: postData
            }).then(resp => {
                let response = resp.response;
                if (!response.result || !response.result.token || !(response.result.players && response.result.players.length && response.result.players[0].externalPlayerId)) {
                    log('[handShake] 非预期结果！');
                    console.log('非预期结果！', resp);
                    return;
                }
                authData.token = response.result.token;
                authData.externalPlayerId = response.result.players[0].externalPlayerId;
                start();
            }, resp => {
                log('[handShake] handShake失败！');
                console.error('handShake失败！', resp);
            });
        }
        function start() {
            log('检查帐号状态...');
            let postData = JSON.stringify({
                'jsonrpc': '2.0',
                'id': applicationId,
                'method': 'mobile.sessions.v2.start',
                'params': {
                    'accountToken': authData.token,
                    'applicationId': applicationId,
                    'externalPlayerId': authData.externalPlayerId,
                    'eventNames': [
                        'Launch OMEN Command Center',
                        'Use OMEN Command Center',
                        'OMEN Command Center Macro Created',
                        'OMEN Command Center Macro Assigned',
                        'Mindframe Adjust Cooling Option',
                        'Connect 2 different OMEN accessories to your PC at the same time',
                        'Use Omen Reactor',
                        'Use Omen Photon',
                        'Launch Game From GameLauncher',
                        'Image like From ImageGallery',
                        'Set as background From ImageGallery',
                        'Download image From ImageGallery',
                        'CLAIM:PRIZE',
                        'overwatch',
                        'heroesofthestorm',
                        'heroesofthestorm_x64',
                        'FortniteClient-Win64-Shipping',
                        'FortniteClient-Win64-Shipping_BE',
                        'thedivision',
                        'thedivision2',
                        'TslGame',
                        'r5apex',
                        'csgo',
                        'League of Legends',
                        'dota2',
                        'smite',
                        'AoE2DE_s',
                        'AoK HD',
                        'AoE2DE',
                        'sc2',
                        's2_x64',
                        'RelicCoH2',
                        'acodyssey',
                        'wow',
                        'wow64',
                        'wow_classic',
                        'wowclassic',
                        'Spotify',
                        'Europa_client',
                        'hearthstone',
                        'hl2',
                        'GolfIt-Win64-Shipping',
                        'GolfIt',
                        'Deceit',
                        '7DaysToDie',
                        'DoomEternal_temp',
                        'starwarsjedifallenorder',
                        'Minecraft.Windows',
                        'net.minecraft.client.main.Main',
                        'DeadByDaylight-Win64-Shipping',
                        '4DF9E0F8.Netflix',
                        'HuluLLC.HuluPlus',
                        'PathOfExileSteam',
                        'PathOfExile_x64Steam',
                        'aces',
                        'modernwarfare',
                        'RocketLeague',
                        'NBA2K20',
                        'StreetFighterV',
                        'RED-Win64-Shipping',
                        'Gears5',
                        'fifa20',
                        'MCC-Win64-Shipping',
                        'MCC-Win64-Shipping-WinStore',
                        'RainbowSix',
                        'RainbowSix_BE',
                        'RainbowSix_Vulkan',
                        'upc',
                        'ROBLOXCORPORATION.ROBLOX',
                        'RobloxPlayerBeta',
                        'VERSUS_GAME_API_TEAMFIGHT_TACTICS_GOLD_LEFT',
                        'VERSUS_GAME_API_TEAMFIGHT_TACTICS_TIME_ELIMINATED',
                        'VERSUS_GAME_API_TEAMFIGHT_TACTICS_THIRD_PLACE_OR_HIGHER',
                        'VERSUS_GAME_API_TEAMFIGHT_TACTICS_SECOND_PLACE_OR_HIGHER',
                        'VERSUS_GAME_API_TEAMFIGHT_TACTICS_PLAYERS_ELIMINATED',
                        'VERSUS_GAME_API_TEAMFIGHT_TACTICS_TOTAL_DAMAGE_TO_PLAYERS',
                        'MonsterHunterWorld',
                        'Warframe.x64',
                        'lor',
                        'valorant-Win64-shipping',
                        'valorant',
                        'crossfire',
                        'Paladins',
                        'trove',
                        'rift_64',
                        'rift_x64',
                        'archeage',
                        'ironsight',
                        'Game',
                        'Game.bin',
                        'glyph_twinsaga',
                        'glyph_aurakingdom',
                        'glyph_shaiya',
                        'Solitaire',
                        'THPS12',
                        'avengers',
                        'Fallguys_client_game',
                        'GameApp',
                        'fifazf',
                        'NBA2KOL2',
                        'destiny2',
                        'Among Us',
                        'MapleStory',
                        'ACValhalla',
                        'FreeStyle',
                        'KartRider',
                        'BlackOpsColdWar',
                        'Cyberpunk2077',
                        'Hades',
                        'RustClient',
                        'GenshinImpact',
                        'EscapeFromTarkov',
                        'EscapeFromTarkov_BE',
                        'RDR2',
                        'CivilizationVI',
                        'valheim',
                        'ffxiv_dx11',
                        'AD2F1837.OMENSpectate',
                        'castle',
                        'Gang Beasts',
                        'SpeedRunners',
                        'Overcooked2',
                        'Overcooked All You Can Eat',
                        'Brawlhalla',
                        'stellaris',
                        'TaleWorlds.MountAndBlade.Launcher',
                        'eu4',
                        'eso64',
                        'WorldOfWarships64',
                        'Spellbreak'
                    ],
                    'location': {
                        'latitude': '39.95' + Math.floor(Math.random() * 10000),
                        'longitude': '116.40' + Math.floor(Math.random() * 10000)
                    },
                    'sdk': 'custom01',
                    'sdkVersion': '3.0.0',
                    'appDefaultLanguage': 'en',
                    'userPreferredLanguage': 'zh-cn'
                }
            });
            xhr({
                method: 'post',
                url: 'https://rpc-prod.versussystems.com/rpc',
                responseType: 'json',
                headers: cleanHeaders({
                    'Accept-Encoding': 'gzip, deflate',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Connection': 'Keep-Alive',
                    'Cache-Control': 'no-cache'
                }),
                data: postData
            }).then(resp => {
                let response = resp.response;
                if (response.error) {
                    if (response.error.code) {
                        if (response.error.code == '605') {
                            log('[帐号可能已被禁用] ' + response.error.message);
                            return;
                        }
                    }
                    log('非预期结果，请参考以下信息进行判断：');
                    log(JSON.stringify(response));
                    console.log(resp);
                } else {
                    log('帐号可能正常！（仅作参考）');
                    console.log(resp);
                }
            }, resp => {
                log('请求失败！');
                console.error('请求失败！', resp);
            });
        }
    }
})();