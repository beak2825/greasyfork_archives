// ==UserScript==
// @name         图寻对局助手
// @namespace    https://greasyfork.org/users/1179204
// @version      0.4.3
// @author       KaKa
// @description  对局中查看对手信息
// @match        *://tuxun.fun/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tuxun.fun
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.4.10/dist/sweetalert2.all.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526545/%E5%9B%BE%E5%AF%BB%E5%AF%B9%E5%B1%80%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/526545/%E5%9B%BE%E5%AF%BB%E5%AF%B9%E5%B1%80%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let avatar, mode, player_infos={}
    let handled_avatars=[]
    let info_popup
    let players_data=JSON.parse(localStorage.getItem('players_data'))
    let players_tags=JSON.parse(localStorage.getItem('players_tags'))
    if(!players_tags)players_tags={}
    if(!players_data)players_data={}

    let infoElement = document.createElement('div');
    infoElement.className = 'ant-notification-notice ant-notification-notice-warning ant-notification-notice-closable';

    const intervalId = setInterval(() => {
        if(window.location.href.includes('replay'))return
        const avatars = [...document.querySelectorAll('[class*="avatarCover"]',...document.querySelectorAll('[class*="tuxunAvatar"]'))]
        const multi_avatars=[...document.querySelectorAll('[class*="ant-avatar ant-avatar-circle ant-avatar-image"]')];
        if (avatars.every(avatar => handled_avatars.includes(avatar)) && multi_avatars.every(avatar => handled_avatars.includes(avatar))) {
            return;
        }

        if (avatars.length>0 ||multi_avatars.length>0) {
            if(window.location.href.includes('solo')||window.location.href.includes('game')||window.location.href.includes('party'))getGameData();

            const getMatchedPlayer = (avatar) => {
                const icon_url = String(avatar.style.backgroundImage || avatar.querySelector('img')?.src);
                return getMatchingPlayerKey(icon_url);
            };

            const handleAvatar = (avatar) => {
                const parentElement = avatar.parentElement;
                if(parentElement.className.includes('maplibregl-marker'))return
                if (parentElement) {
                    parentElement.style.pointerEvents = 'none';
                    avatar.style.pointerEvents = 'auto';
                }

                const showPlayerInfo = (matchedPlayer) => {
                    if (matchedPlayer) {
                        if (player_infos[matchedPlayer]) {
                            showPopup(fillInfo(player_infos[matchedPlayer]), player_infos[matchedPlayer].playerName,player_infos[matchedPlayer].isBan);
                        } else {
                            fetchUserProfile(matchedPlayer).then(data => {
                                showPopup(fillInfo(data), data.playerName,data.isBan);
                            });
                        }
                    }
                };

                const handleMouseEnter = () => {
                    const matchedPlayer = getMatchedPlayer(avatar);
                    showPlayerInfo(matchedPlayer);
                };

                const handleClick = () => {
                    const matchedPlayer = getMatchedPlayer(avatar);
                    if (matchedPlayer) {
                        const scrollPosition = window.scrollY;
                        Swal.close()
                        window.scrollTo(0, scrollPosition);
                        Swal.fire({
                            title: '请输入自定义信息',
                            input: 'text',
                            inputPlaceholder: '',
                            showCancelButton: true,
                            backdrop:null,
                            confirmButtonText: '确认',
                            cancelButtonText: '取消',
                            preConfirm: (inputValue) => {
                                if (!inputValue) {
                                    Swal.showValidationMessage('标签不能为空');
                                    return false;
                                }
                                players_tags[matchedPlayer] = inputValue;
                                localStorage.setItem('players_tags',JSON.stringify(players_tags))
                                return inputValue;
                            }
                        });
                    }
                };

                avatar.addEventListener('mouseenter', handleMouseEnter);
                avatar.addEventListener('mouseleave', () => info_popup.close());
                avatar.addEventListener('click', handleClick);
            };

            avatars.forEach((avatar)=>{
                handled_avatars.push(avatar)
                handleAvatar(avatar)});
            multi_avatars.forEach((avatar)=>{
                handled_avatars.push(avatar)
                handleAvatar(avatar)});
        }

    }, 1000);

    function fillInfo(data){
        const playerInfo = `<h4>${players_tags[data.playerId]||''}</h4>
                            <div style="text-align: left; padding: 15px; margin-left:80px">
                                <div>当前积分: ${data.rating || '无'}</div>
                                <div>当前排位: ${data.rank || '无'}</div>
                                <div>匹配局数: ${data.soloTimes || '0'}</div>
                                <div>胜率: ${(parseFloat(data.soloWin/data.soloTimes)*100).toFixed(2) || ''}%</div>
                                <div>最高连胜: ${data.longestWinningStreak||'0'}</div>
                                <div>上赛季排位: ${data.lastRanking || '无'}</div>
                                <div>历史最高分: ${data.maxRating || '无'}</div>
                           </div>
                            `
        return playerInfo
    }

    function getGameData() {
        const currentHref = window.location.href;

        const parts = currentHref.split('/');
        const gameId = parts[parts.length - 1];

        if (!gameId) {
            console.error('无法从 URL 中提取 gameId');
            return;
        }

        const apiUrl = `https://tuxun.fun/api/v0/tuxun/solo/get?gameId=${gameId}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            mode=data.data.china
            const players=data.data.players
            if(players){
                players.map((player)=>{

                    players_data[player.userId]=player.icon

                })
                localStorage.setItem('players_data',JSON.stringify(players_data))
            }
        })
            .catch(error => {
            console.error('请求失败:', error);
        });
    }

    async function checkBan(id){
       const apiUrl=`https://tuxun.fun/api/v0/tuxun/user/checkBan?userId=${id}`
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`请求失败，状态码: ${response.status}`);
        }
        const data = await response.json();
        if(data.data){
            return data.data
        }
    }
    async function fetchUserProfile(userId) {
        const apiUrl = `https://tuxun.fun/api/v0/tuxun/getProfile?userId=${userId}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`请求失败，状态码: ${response.status}`);
            }

            const data = await response.json();
            if(data.data){
                if(window.location.href.includes('china'))mode=true
                const player_info=mode?data.data.chinaRank:data.data.worldRank
                player_info.playerName=data.data.userAO.userName
                player_info.playerId=data.data.userAO.userId
                player_info.isBan=await checkBan(userId)
                player_infos[userId]=player_info
                return player_info
            }
            return data;
        } catch (error) {
            console.error('请求出错:', error);
        }
    }

    function showPopup(playerInfo, user,isBan) {
        info_popup=Swal.fire({
            title: `${user}`,
            html: playerInfo,
            icon: null,
            width: '360px',
            position: 'center',
            backdrop: null,
            showConfirmButton: false,
            showCloseButton: false,
            customClass: {
                popup: 'swal-popup',
                title: isBan ? 'swal-title' : ''
            },
        });
        setTimeout(() => {
            const popup = document.querySelector('.swal-popup');
            const title = document.querySelector('.swal-title');
            if(title)title.style.color='red'
            if (popup) {
                popup.style.opacity = '0.7';
                popup.style.background = '#000000';
                popup.style.color='#fff'
            }
        }, 10);
    }

    function getMatchingPlayerKey(icon_url) {
        for (const [userId, icon] of Object.entries(players_data)) {

            if (icon_url.includes(icon)) {
                return userId;
            }
        }
        return null;
    }
    function findInputValue(){


        const pageText = document.body.innerText;


        const uidRegex = /uid:\s*(\d+)/i;
        const match = pageText.match(uidRegex);


        if (match && match[1]) {
            return match[1]; // 返回捕获组中的数字部分
        }

        return null;
    }

})();