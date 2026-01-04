// ==UserScript==
// @name         RB Visual Overhaul
// @namespace    http://tampermonkey.net/
// @version      2024-11-25
// @description  replaces old rank icons and adds new ones, brings back the clock, etc.
// @author       Lemniscata
// @match        https://www.rusbionicle.com/*
// @match        https://rusbionicle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rusbionicle.com
// @resource     DEFAULT_CSS https://rusbionicle.com/forumsbio/style.php?&id=8&lang=ru
// @resource     IMPORTED_CSS https://raw.githubusercontent.com/OSP-Scata/RB-Visual-Overhaul/refs/heads/main/dark_theme/cssoverride.css
// @resource     DATABASE https://raw.githubusercontent.com/OSP-Scata/RB-Visual-Overhaul/refs/heads/main/new_ranks/ranks-database.json
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518726/RB%20Visual%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/518726/RB%20Visual%20Overhaul.meta.js
// ==/UserScript==

(async() => {
    'use strict';
    // часы
    var clock = document.createElement('div');
    clock.innerHTML = '<div id="clock"> \
    <center><object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0" width="150" height="150"> \
    <param name="wmode" value="transparent" /> \
	<param name="movie" value="/clock/clockfinal2.swf" /> \
	<param name="quality" value="high" /> \
	<embed src="/clock/clockfinal2.swf" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="150" height="150" wmode="transparent"></embed> \
	</object> \
	</center> \
    </div>';
    document.getElementById('datebar').appendChild(clock);

    // тёмная тема и кнопка для переключения
    const darkTheme = GM_getResourceText("IMPORTED_CSS");
    const lightTheme = GM_getResourceText("DEFAULT_CSS");
    var button = document.createElement("button");
    var header = document.querySelector('#logodesc');
    header.appendChild(button);
    var currentTheme = await GM_getValue("theme");
    var state;
    button.addEventListener('click', toggle);
    if (currentTheme == 'light' || typeof currentTheme == 'undefined') {
        button.innerText = "Тёмная тема";
        state = false;
        button.style.cssText = 'float: right; margin: 20px; background-color: #383a40; color: #dbdee1';
    }
    else if (currentTheme == 'dark') {
        GM_addStyle(darkTheme);
        state = true;
        button.innerText = "Светлая тема";
        button.style.cssText = 'float: right; margin: 20px; background-color: unset; color: unset';
    }
    function toggle(){
        if (!state) {
            GM_addStyle(darkTheme);
            button.innerText = "Светлая тема";
            button.style.cssText = 'float: right; margin: 20px; background-color: unset; color: unset';
            state = true;
            GM_setValue("theme", "dark");
        }
        else {
            GM_addStyle(lightTheme);
            button.innerText = "Тёмная тема";
            button.style.cssText = 'float: right; margin: 20px; background-color: #383a40; color: #dbdee1';
            state = false;
            GM_setValue("theme", "light");
        }
	}

    const data = JSON.parse(GM_getResourceText("DATABASE"));

    // замена рангов
    // в постах...
    var profiles = document.querySelectorAll('td.profile'); // сведения о пользователе в постах
    profiles.forEach((profile) => {
        var postDetails = profile.querySelector('span.postdetails') // тут ищем число сообщений
        var tdPostDetails = profile.querySelector('td.postdetails') // тут название ранга
        if (postDetails && tdPostDetails) {
            var userData = postDetails.querySelectorAll('b');
            if (userData[0].innerText != "Предупреждения:") {
                var numberOfPosts1 = parseInt(userData[1].nextSibling.data) // число постов в темах
                var topicRank = tdPostDetails.innerText;
                if (!topicRank.toLowerCase().includes('администратор') && !topicRank.toLowerCase().includes('модератор') && !topicRank.toLowerCase().includes('узник')) {
                    for (var i = 0; i < data.length; i++) {
                        if (numberOfPosts1 < data[i]['postNumber']) {
                            var rankIcon = profile.querySelector('img[src*="./images/ranks/"]')
                            rankIcon.src = rankIcon.src.replace(rankIcon.src, data[i-1]['rankIcon']);
                            rankIcon.setAttribute("alt", data[i-1]['rankName']);
                            rankIcon.setAttribute("title", data[i-1]['rankName']);
                            profile.querySelector('td.postdetails').innerText = data[i-1]['rankName'];
                            break;
                        }
                        else if (numberOfPosts1 >= data[data.length-1]['postNumber']) {
                            rankIcon = profile.querySelector('img[src*="./images/ranks/"]')
                            rankIcon.src = rankIcon.src.toLowerCase().replace(rankIcon.src, data[i]['rankIcon']);
                            rankIcon.setAttribute("alt", data[i]['rankName']);
                            rankIcon.setAttribute("title", data[i]['rankName']);
                            profile.querySelector('td.postdetails').innerText = data[i-1]['rankName'];
                        }
                    }
                }
            }
        }
    });

    // ...и на странице пользователей
    var row = document.querySelectorAll('tr.row1, tr.row2'); // сведения о пользователе в списке пользователей
    if (row.length == 50) { // потому что на странице 50 пользователей (чтобы не мешало остальному форуму)
        row.forEach((td) => {
            var userDataInUsers = td.querySelectorAll('td.gen');
            var numberOfPosts2 = parseInt(userDataInUsers[1].innerText); // число постов в списке пользователей
            var usersRank = userDataInUsers[2].innerHTML; // ранг в списке пользователей
            var rankText = usersRank.split("\"")[usersRank.split("\"").length-2];
            if ((rankText) && (!rankText.toLowerCase().includes('администратор') && !rankText.toLowerCase().includes('модератор') && !rankText.toLowerCase().includes('узник'))) {
                for (var i = 0; i < data.length; i++) {
                    if (numberOfPosts2 < data[i]['postNumber']) {
                        var rankIcon = td.querySelector('img[src*="./images/ranks/"]')
                        rankIcon.src = rankIcon.src.replace(rankIcon.src, data[i-1]['rankIcon']);
                        rankIcon.setAttribute("alt", data[i-1]['rankName']);
                        rankIcon.setAttribute("title", data[i-1]['rankName']);
                        break;
                    }
                    else if (numberOfPosts2 >= data[data.length-1]['postNumber']) {
                        rankIcon = document.querySelector('img[src*="./images/ranks/"]')
                        rankIcon.src = rankIcon.src.toLowerCase().replace(rankIcon.src, data[i]['rankIcon']);
                        rankIcon.setAttribute("alt", data[i]['rankName']);
                        rankIcon.setAttribute("title", data[i]['rankName']);
                    }
                }
            }
        });
    }
    // ещё и страница профиля...
    var userProfileRank = document.querySelector('td.postdetails'); // ранг в профиле
    var canProfile = userProfileRank ? userProfileRank.innerText : ""; // тест на возможность спарсить ранг (если мы не на странице профиля)
    if (canProfile) {
        userProfileRank = userProfileRank.innerText;
        if (!userProfileRank.toLowerCase().includes('администратор') && !userProfileRank.toLowerCase().includes('модератор') && !userProfileRank.toLowerCase().includes('узник')) {
            var bGen = document.querySelectorAll('b.gen')
            bGen.forEach((tag) => {
            if (!isNaN(parseInt(tag.innerText))) {
                var numberOfPosts3 = parseInt(tag.innerText) // число постов в профиле
                for (var i = 0; i < data.length; i++) {
                    if (numberOfPosts3 < data[i]['postNumber']) {
                        var rankIcon = document.querySelector('img[src*="./images/ranks/"]')
                        rankIcon.src = rankIcon.src.replace(rankIcon.src, data[i-1]['rankIcon']);
                        rankIcon.setAttribute("alt", data[i-1]['rankName']);
                        rankIcon.setAttribute("title", data[i-1]['rankName']);
                        document.querySelector('td.postdetails').innerText = data[i-1]['rankName']
                        break;
                    }
                    else if (numberOfPosts3 >= data[data.length-1]['postNumber']) {
                        rankIcon = document.querySelector('img[src*="./images/ranks/"]')
                        rankIcon.src = rankIcon.src.replace(rankIcon.src, data[i]['rankIcon']);
                        rankIcon.setAttribute("alt", data[i]['rankName']);
                        rankIcon.setAttribute("title", data[i]['rankName']);
                        document.querySelector('td.postdetails').innerText = data[i]['rankName']
                    }
                }
            }
       })
    }
    }
    // иконки онлайн-оффлайн
    document.querySelectorAll('img[src*="whosonline.gif"]').forEach((image) => {
			image.src = image.src.replace('https://rusbionicle.com/forumsbio/styles/subsilver2/theme/images/whosonline.gif', 'https://raw.githubusercontent.com/OSP-Scata/RB-Visual-Overhaul/refs/heads/main/icons/whosonline.png');
        image.src = image.src.replace('https://www.rusbionicle.com/forumsbio/styles/subsilver2/theme/images/whosonline.gif', 'https://raw.githubusercontent.com/OSP-Scata/RB-Visual-Overhaul/refs/heads/main/icons/whosonline.png');
		})
    document.querySelectorAll('img[src*="./styles/subsilver2/imageset/ru/"]').forEach((image) => {
			image.src = image.src.replace('https://rusbionicle.com/forumsbio/styles/subsilver2/imageset/ru/icon_user_offline.gif', 'https://raw.githubusercontent.com/OSP-Scata/RB-Visual-Overhaul/refs/heads/main/icons/icon_user_offline.png');
        image.src = image.src.replace('https://www.rusbionicle.com/forumsbio/styles/subsilver2/imageset/ru/icon_user_offline.gif', 'https://raw.githubusercontent.com/OSP-Scata/RB-Visual-Overhaul/refs/heads/main/icons/icon_user_offline.png');
            image.src = image.src.replace('https://rusbionicle.com/forumsbio/styles/subsilver2/imageset/ru/icon_user_online.gif', 'https://raw.githubusercontent.com/OSP-Scata/RB-Visual-Overhaul/refs/heads/main/icons/icon_user_online.png');
        image.src = image.src.replace('https://www.rusbionicle.com/forumsbio/styles/subsilver2/imageset/ru/icon_user_online.gif', 'https://raw.githubusercontent.com/OSP-Scata/RB-Visual-Overhaul/refs/heads/main/icons/icon_user_online.png');
		})

/*
    // реплейс существующих иконок рангов (старое)
    function updateImagesSrc() {
		document.querySelectorAll('img[src*="./images/ranks/"]').forEach((previewImage) => {
			previewImage.src = previewImage.src.toLowerCase().replace('https://www.rusbionicle.com/forumsbio/images/ranks/', 'https://brickshelf.com/gallery/Roodaka8761/Bionicle/RB-new-ranks/');
		})
	}

	if(document.readyState == 'complete') {
    updateImagesSrc();
} else {
    window.addEventListener('load', updateImagesSrc);
} */
})();
