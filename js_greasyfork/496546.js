// ==UserScript==
// @name         All I see is hololive
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Replace specific avatar links, user link text, and remove specific spans on bgm.tv
// @author       Mikuorz
// @match        *://bgm.tv/group/*
// @match        *://bangumi.tv/group/*
// @match        *://bgm.tv/rakuen/topic/*
// @match        *://bangumi.tv/rakuen/topic/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496546/All%20I%20see%20is%20hololive.user.js
// @updateURL https://update.greasyfork.org/scripts/496546/All%20I%20see%20is%20hololive.meta.js
// ==/UserScript==




(function() {
    'use strict';

    var virtualUsers = [
        { link: "https://s2.loli.net/2024/05/19/QXFx5R43IqwyaDv.png", name: "湊あくあ" },
        { link: "https://s2.loli.net/2024/05/19/x4ZMPqQiXyD3B5p.png", name: "赤井はあと" },
        { link: "https://s2.loli.net/2024/05/19/EBQOodh64zlApig.png", name: "Aki Rosenthal" },
        { link: "https://s2.loli.net/2024/05/19/UHkBLAmVIYWeFMC.png", name: "戌神ころね" },
        { link: "https://s2.loli.net/2024/05/19/aglJOALtjfZSwPx.png", name: "AZKi" },
        { link: "https://s2.loli.net/2024/05/19/rujKLptJwHPgqZM.png", name: "星街すいせい" },
        { link: "https://s2.loli.net/2024/05/19/M7SD51sbFBPZeIq.png", name: "猫又おかゆ" },
        { link: "https://s2.loli.net/2024/05/19/VizyHGD4S7WKM82.png", name: "大空スバル" },
        { link: "https://s2.loli.net/2024/05/19/BuoWO6elLy1FkX4.png", name: "夏色まつり" },
        { link: "https://s2.loli.net/2024/05/19/1b3wZajy8zcN5uM.png", name: "大神ミオ" },
        { link: "https://s2.loli.net/2024/05/19/fOyNdF864JnAcEB.png", name: "ロボ子さん" },
        { link: "https://s2.loli.net/2024/05/19/rxKoTjV9puGyXkm.png", name: "百鬼あやめ" },
        { link: "https://s2.loli.net/2024/05/19/aIPNJVZlro1pS64.png", name: "ときのそら" },
        { link: "https://s2.loli.net/2024/05/19/UdiXSo2aY4Tx9w7.png", name: "紫咲シオン" },
        { link: "https://s2.loli.net/2024/05/19/k6Wc4PtEUXRslgO.png", name: "白上フブキ" },
        { link: "https://s2.loli.net/2024/05/19/riefxLj8vPsKzOU.png", name: "さくらみこ" },
        { link: "https://s2.loli.net/2024/05/19/RYmXUGj8qibLpDo.png", name: "兎田ぺこら" },
        { link: "https://s2.loli.net/2024/05/19/TijyO91mE8eGxsd.png", name: "癒月ちょこ" },
        { link: "https://s2.loli.net/2024/05/19/fvXmT7QAzGM3Rts.png", name: "宝鐘マリン" },
        { link: "https://s2.loli.net/2024/05/19/uwO8vxbCeD2LStj.png", name: "天音かなた" },
        { link: "https://s2.loli.net/2024/05/19/1EaVnoySwKWNlbI.png", name: "風真いろは" },
        { link: "https://s2.loli.net/2024/05/19/Gp5kdsRlw2uzNca.png", name: "姫森ルーナ" },
        { link: "https://s2.loli.net/2024/05/19/bjAfgoPRCO2uYWm.png", name: "博衣こより" },
        { link: "https://s2.loli.net/2024/05/19/hKGHLiDW2dqQsFU.png", name: "La-Darknesss" },
        { link: "https://s2.loli.net/2024/05/19/2HC4lJQ7SObwfBq.png", name: "不知火フレア" },
        { link: "https://s2.loli.net/2024/05/19/iPKNlX6C4oI15sA.png", name: "桃鈴ねね" },
        { link: "https://s2.loli.net/2024/05/19/hgpKBtsyJoaRViT.png", name: "尾丸ポルカ" },
        { link: "https://s2.loli.net/2024/05/19/cFlQZNb2qf1Cpsr.png", name: "沙花叉クロヱ" },
        { link: "https://s2.loli.net/2024/05/19/FdEnzy3MiSgVxku.png", name: "鷹嶺ルイ" },
        { link: "https://s2.loli.net/2024/05/19/qyvUwCZxk6rH92n.png", name: "常闇トワ" },
        { link: "https://s2.loli.net/2024/05/19/J9j3eSbDmCiq4Ia.png", name: "獅白ぼたん" },
        { link: "https://s2.loli.net/2024/05/19/i2jQGOreMypLFWJ.png", name: "白銀ノエル" },
        { link: "https://s2.loli.net/2024/05/19/Le9rPIQUzAkuFxh.png", name: "角巻わため" },
        { link: "https://s2.loli.net/2024/05/19/9WQfMuBvalXPnbE.png", name: "雪花ラミィ" },
        { link: "https://s2.loli.net/2024/05/19/gxEWQCr58HKdkns.png", name: "Fuwawa Abyssgard" },
        { link: "https://s2.loli.net/2024/05/19/dULMv9QwYK2fJb1.png", name: "Gawr Gura" },
        { link: "https://s2.loli.net/2024/05/19/JeE7PXKhfmabLxk.png", name: "Koseki Bijou" },
        { link: "https://s2.loli.net/2024/05/19/NP4R6srzMmpbaow.png", name: "Ceres Fauna" },
        { link: "https://s2.loli.net/2024/05/19/TMhRPv8VFXQ9Zg1.png", name: "Hakos Baelz" },
        { link: "https://s2.loli.net/2024/05/19/5KyA8LJTz7rFBR1.png", name: "IRyS" },
        { link: "https://s2.loli.net/2024/05/19/jKWwdoGOxSiuchX.png", name: "Mori Calliope" },
        { link: "https://s2.loli.net/2024/05/19/TcwPsBg4qjdvEri.png", name: "Mococo Abyssgard" },
        { link: "https://s2.loli.net/2024/05/19/Ze1rBcOC7Dvp9RF.png", name: "Nerissa Ravencroft" },
        { link: "https://s2.loli.net/2024/05/19/cgi4qAOSWdpP2aY.png", name: "Ouro Kronii" },
        { link: "https://s2.loli.net/2024/05/19/cMGh1ZR6mDrluO7.png", name: "Nanashi Mumei" },
        { link: "https://s2.loli.net/2024/05/19/SNmI34qpLR5brQ1.png", name: "Ninomae Ina'nis" },
        { link: "https://s2.loli.net/2024/05/19/CiKD9wmVrsWb4cB.png", name: "Watson Amelia" },
        { link: "https://s2.loli.net/2024/05/19/udm1A7S4Ln25Wsi.png", name: "Shiori Novella" },
        { link: "https://s2.loli.net/2024/05/19/5nvS4XPIwjqAWVb.png", name: "Takanashi Kiara" }
    ];


    var elements = document.querySelectorAll('.sign.tip_j');

    elements.forEach(function(element) {
        element.innerHTML = '';
    });

    var matchedUsers = {};

    var userElements = document.querySelectorAll('.avatarNeue');

    userElements.forEach(function(userElement) {
        var userNameElement = userElement.parentNode.nextElementSibling.querySelector('.l');
        if (userNameElement) {
            var userName = userNameElement.textContent.trim();

            if (matchedUsers.hasOwnProperty(userName)) {
                var matchedUser = matchedUsers[userName];
                userElement.style.backgroundImage = 'url("' + matchedUser.link + '")';
                userNameElement.textContent = matchedUser.name;
                userNameElement.href = matchedUser.link;
            } else {
                var randomIndex = Math.floor(Math.random() * virtualUsers.length);
                var selectedUser = virtualUsers[randomIndex];

                userElement.style.backgroundImage = 'url("' + selectedUser.link + '")';
                userNameElement.textContent = selectedUser.name;
                userNameElement.href = selectedUser.link;

                matchedUsers[userName] = { link: selectedUser.link, name: selectedUser.name };
            }
        }
    });
})();