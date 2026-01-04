// ==UserScript==
// @name                YouTube Avatar Decorations
// @name:tr             YouTube Avatar Dekorasyonları
// @name:de             YouTube-Avatar-Dekorationen
// @name:ru             Украшения для аватаров YouTube
// @name:es             Decoraciones de avatares de YouTube
// @name:zh-CN          YouTube 头像装饰
// @name:hi             यूट्यूब अवतार सजावट
// @name:fr             Décorations d'avatar YouTube
// @name:pt             Decorações de avatar do YouTube
// @name:ja             YouTube アバターのデコレーション
// @name:ko             YouTube 아바타 장식
// @name:ta             YouTube அவதார் அலங்காரங்கள்
// @name:hr             Dekoracije YouTube avatara
// @name:it             Decorazioni per avatar di YouTube
// @name:id             Dekorasi Avatar YouTube
// @name:tk             YouTube Awatar bezegleri
// @name:az             YouTube Avatar Dekorasiyaları
// @license             MIT
// @namespace           http://tampermonkey.net/
// @version             1.5
// @description         YouTube Avatars enhances the visual experience on YouTube by allowing users to customize their avatars on both channel and video pages.
// @description:tr      YouTube Avatarları, kullanıcıların hem kanal hem de video sayfalarında avatarlarını özelleştirmelerine olanak tanıyarak YouTube'daki görsel deneyimi geliştirir.
// @description:de      YouTube-Avatare verbessern das visuelle Erlebnis auf YouTube, indem sie es Benutzern ermöglichen, ihre Avatare sowohl auf Kanal- als auch auf Videoseiten anzupassen.
// @description:ru      Аватары YouTube улучшают визуальное восприятие YouTube, позволяя пользователям настраивать свои аватары как на страницах канала, так и на страницах видео.
// @description:es      YouTube Avatars mejora la experiencia visual en YouTube al permitir a los usuarios personalizar sus avatares tanto en el canal como en las páginas de video.
// @description:zh-CN   YouTube Avatars 允许用户在频道和视频页面上自定义自己的头像，从而增强了 YouTube 上的视觉体验。
// @description:hi      YouTube अवतार उपयोगकर्ताओं को चैनल और वीडियो पेज दोनों पर अपने अवतारों को अनुकूलित करने की अनुमति देकर YouTube पर दृश्य अनुभव को बढ़ाता है।
// @description:fr      YouTube Avatars améliore l'expérience visuelle sur YouTube en permettant aux utilisateurs de personnaliser leurs avatars sur les pages de la chaîne et des vidéos.
// @description:pt      Os Avatares do YouTube aprimoram a experiência visual no YouTube, permitindo que os usuários personalizem seus avatares nas páginas do canal e do vídeo.
// @description:ja      YouTube アバターは、ユーザーがチャンネルとビデオ ページの両方でアバターをカスタマイズできるようにすることで、YouTube でのビジュアル エクスペリエンスを強化します。
// @description:ko      YouTube 아바타는 사용자가 채널과 동영상 페이지 모두에서 아바타를 맞춤설정할 수 있도록 하여 YouTube의 시각적 경험을 향상시킵니다.
// @description:ta      சேனல் மற்றும் வீடியோ பக்கங்களில் பயனர்கள் தங்கள் அவதாரங்களைத் தனிப்பயனாக்க அனுமதிப்பதன் மூலம் YouTube அவதாரங்கள் YouTube இல் காட்சி அனுபவத்தை மேம்படுத்துகிறது.
// @description:hr      YouTube Avatari poboljšavaju vizualno iskustvo na YouTubeu dopuštajući korisnicima da prilagode svoje avatare na stranicama kanala i videozapisa.
// @description:it      Gli avatar di YouTube migliorano l'esperienza visiva su YouTube consentendo agli utenti di personalizzare i propri avatar sia sul canale che sulle pagine video.
// @description:id      Avatar YouTube meningkatkan pengalaman visual di YouTube dengan memungkinkan pengguna menyesuaikan avatar mereka di saluran dan laman video.
// @description:tk      “YouTube Avatars”, ulanyjylara awatarlaryny iki kanalda we wideo sahypalarynda sazlamaga mümkinçilik bermek bilen, YouTube-da görüş tejribesini ýokarlandyrýar.
// @description:az      YouTube Avatarları istifadəçilərə həm kanal, həm də video səhifələrində öz avatarlarını fərdiləşdirməyə imkan verməklə YouTube-da vizual təcrübəni artırır.
// @author              Phaticusthiccy
// @icon                https://i.hizliresim.com/723p62n.png
// @match               https://www.youtube.com/*
// @supportURL          https://github.com/phaticusthiccy/YoutubeAvatars/issues/new
// @homepageURL         https://github.com/phaticusthiccy/YoutubeAvatars
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/503107/YouTube%20Avatar%20Decorations.user.js
// @updateURL https://update.greasyfork.org/scripts/503107/YouTube%20Avatar%20Decorations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const avatarCategories = {
        "General": [
            { name: "Glitch", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_e90ebc0114e7bdc30353c8b11953ea41.png?size=96&passthrough=true" },
            { name: "Cybernetics", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_c6b3bc1dc49e5b284dca0b6437831004.png?size=96&passthrough=true" },
            { name: "Golden Crown", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_65db91cee351e36150a2b506b26eba71.png?size=96&passthrough=true" },
            { name: "Evil Crown", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_d1ea7b8650bf3d64a03304c2ceb7d089.png?size=96&passthrough=true" },
            { name: "Color Wave", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_49c479e15533fb4c02eb320c9c137433.png?size=96&passthrough=true" },
            { name: "Oasis", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_f740031cc97d1b7eb73c0d0ac1dd09f3.png?size=96&passthrough=true" },
            { name: "Rainy Mood", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_e8c11f139e55dac538cdaafb3caa2317.png?size=96&passthrough=true" },
            { name: "Doodle", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_5873ecaa76fb549654b40095293f902e.png?size=96&passthrough=true" },
            { name: "Green Smoke", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_10b9f886b513b77ccdd67c8784f1a496.png?size=96&passthrough=true" },
            { name: "Victory", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/Animation-1723308469539-ezgif.com-optipng.png", scale: 1.21 },
            { name: "Strings", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/strings.png", scale: 1.5 },
            { name: "Sketch Hat", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/hat.png" },
            { name: "Robin Hood Hat", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/robin_hood.png?raw=true" },
            { name: "Devil Horns", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/devil_horn.png" },
            { name: "Light Bulbs", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_88f42fb7360d8224a670a50c3496f315.png?size=96&passthrough=true" },
        ],
        "Valentine": [
            { name: "Angel", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_c86b11a49bb8057ce9c974a6f7ad658a.png?size=96&passthrough=true" },
            { name: "In Love", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_7f44d538ec830f479605f7bf8720afda.png?size=96&passthrough=true" },
            { name: "Hearts", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_3e1fc3c7ee2e34e8176f4737427e8f4f.png?size=96&passthrough=true" },
            { name: "Sakura", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_13913a00bd9990ab4102a3bf069f0f3f.png?size=96&passthrough=true" },
            { name: "Sakura Warrior", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_7cf09c7e78d6eb35ae354acc1d5cc676.png?size=96&passthrough=true" },
            { name: "Fallen Leaves", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_7fecc9d20cbbf54644c9a532f7db4664.png?size=96&passthrough=true", left: "-1.8px" },
            { name: "Heart Lamps (Blue)", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_42cc3fe7133523096466102e7a222003.png?size=96&passthrough=true" },
            { name: "Heart Lamps (Red)", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_63a69109db554a66764cbe61c6e556ef.png?size=96&passthrough=true" },
            { name: "Fluffy Teddy Bear", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_555ad9b90a13534180b9274d013e3651.png?size=96&passthrough=true" },
            { name: "Heart Ring", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_a1c0581971d4a296908829289fea2c47.png?size=96&passthrough=true", scale: 1.09 },

        ],
        "Animals": [
            { name: "Cat Ears", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_c3cffc19e9784f7d0b005eecdf1b566e.png?size=96&passthrough=true" },
            { name: "Sleepy Cat", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_77b7b6a740a9451e1ef39c0252154ef8.png?size=96&passthrough=true" },
            { name: "Blob Cat", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/blobcat.gif" },
            { name: "Space Whale", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/spcae_whale.gif", scale: 1.03 },
        ],
        "Anime": [
            { name: "Flying Hearts", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_8ffa2ba9bff18e96b76c2e66fd0d7fa3.png?size=96&passthrough=true" },
            { name: "Ki Energy", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_f3af281c65cf0cf590e9e1f59e9c6cf6.png?size=96&passthrough=true" },
            { name: "Gushing Energy", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_c7e1751e8122f1b475cb3006966fb28c.png?size=96&passthrough=true" },
            { name: "Shocked", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_b98e8b204d59882fb7f9f7c86922c0bf.png?size=96&passthrough=true" },
            { name: 'Anger', url: 'https://cdn.discordapp.com/avatar-decoration-presets/a_3c97a2d37f433a7913a1c7b7a735d000.png?size=96&passthrough=true' },
            { name: "Starts", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_d72066b8cecbadd9fc951913ebcc384f.png?size=96&passthrough=true" },
            { name: "Soul", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_c3c09bd122898be35093d0d59850f627.png?size=96&passthrough=true" },
            { name: "Cute Radish", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_89cd445201a0c6c64d46876503d0e90e.png?size=96&passthrough=true" },
            { name: "Sweat Drops", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_55c9d0354290afa8b7fe47ea9bd7dbcf.png?size=96&passthrough=true" },
            { name: "Cat Hat", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/cat_hat.png?raw=true" },
        ],
        "Nature": [
            { name: "Flower Clouds", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_d9ff5ff133ed9176895a4a2b5e58f1b8.png?size=96&passthrough=true" },
            { name: "Rainbow", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_bba669bfb28f492b64852e00fde4989d.png?size=96&passthrough=true" },
            { name: "Patrick the Starfish", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_0f7fa66bc185c858f92a7918ea4dd47a.png?size=96&passthrough=true" },
            { name: "Gary the Snail", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_4db5b8518672197225c69fe72f07a945.png?size=96&passthrough=true" },
            { name: "Wind", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_554b7c34f7b6c709f19535aacb128e7b.png?size=96&passthrough=true" },
            { name: "Water", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_250640ab00a8837a1d56f35879138177.png?size=96&passthrough=true" },
            { name: "Butterfly", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_4cd9ae5a8d103c219eacd3674d7730cd.png?size=96&passthrough=true" },
            { name: "Lightening", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_365eed4178528fe8293c4212e8e2d5cb.png?size=96&passthrough=true" },
            { name: "Constellations", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_8552f9857793aed0cf816f370e2df3be.png?size=96&passthrough=true" },
            { name: "Blackhole", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_6d16b27d9415cafe3b289053644337c4.png?size=96&passthrough=true" },
            { name: "UFO", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_6fdbddb6229453eac3bbb212edf5cd1c.png?size=96&passthrough=true" },
            { name: "Neon Star", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/rotating_star.png?raw=true" },
            { name: "Daisy Ring", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/daisy_ring.png?raw=true" },
            { name: "Fire", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/circle_fire.gif?raw=true", scale: 1.7 },
            { name: "Roses", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/roses.gif?raw=true" },
            { name: "Fluid Silver", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/fluid_silver.gif?raw=true", scale: 1.21 },
            { name: "Acid", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/acid.webp?raw=true", scale: 1.45, top: "10px", left: "-2.5px", videoTop: "-5.7px", videoLeft: "-10.9px", videoScale: 1.3 },
            { name: "Falling Star", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/falling%20star.gif", scale: 1.45, top: "-5px", left: "-5px", videoTop: "-11px", videoLeft: "-10.9px", videoScale: 1.3 },
            { name: "Space Helmet", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_bb31faaec1be1ef5ff32dcdc5f37efbf.png?size=96&passthrough=true" },
            { name: "Snow Globe", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_85a8f9ca60cb4328378270a7f13ed7fd.png?size=96&passthrough=true" },
        ],
        "Mystic": [
            { name: "Spirit Sparks", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_1005898c6acf56a9ac5010baf444f6fd.png?size=96&passthrough=true" },
            { name: "Skull Medallion", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_9d67a1cbf81fe7197c871e94f619b04b.png?size=96&passthrough=true" },
            { name: "The Wand", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_db9baf0ba7cf449d2b027c06309dbe8d.png?size=96&passthrough=true" },
            { name: "Fairies", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_fe3c76cac2adf426832a7e495e8329d3.png?size=96&passthrough=true" },
            { name: "Blue Yonder", url: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/917950/9155ed2050954e8bd0e74f0f0dcfa0e96b37ec34.png" },
            { name: "Sparkles", url: "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/1192640/6b555763a9ff0815cff7d45480f03ff4d1ca4ab3.png" },
            { name: "Divination", url: "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/2271980/2727a0bbab23f6ecc60b86b2f4946bd31d986165.png" },
            { name: "Energy Ball", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/energy_ball.png" },
            { name: "Eyes", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/eyes.png?raw=true" },
            { name: "Devil", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/devil.png?raw=true" },
            { name: "Shining Star", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/final_light.png?raw=true" },
            { name: "Aetheria", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/aetheria2.gif?raw=true", scale: 1.4, videoScale: 1.2 },
            { name: "Shining Star 2", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/stars2.gif?raw=true" },
        ],
        "Games": [
            { name: "Valorant - Viper", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_62cd9d7c0031a7c1eb5ad5cc96992189.png?size=96&passthrough=true" },
            { name: "Valorant - Death", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_09de63526a45be1ddac70e84718ee04a.png?size=96&passthrough=true" },
            { name: "Valorant - Yoru", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_da532f804b47f1681006c2996eb07b2a.png?size=96&passthrough=true" },
            { name: "Valorant - Cypher", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_b1efe77f379c6c9c6e47e6b6299d5a7d.png?size=96&passthrough=true" },
            { name: "Valorant - Clove", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_98555e40cc6802bd3a4fed906af1d992.png?size=96&passthrough=true" },
            { name: "Valorant - Omen", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_c45abe8c7585fdb41b8d8d4d666f1588.png?size=96&passthrough=true" },
            { name: "Valorant - Reyna", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_a87e3efa4de2956331831681231ce63b.png?size=96&passthrough=true" },
            { name: "Valorant - Jett", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_904b1989077c91fca1168d39bfcaa0a4.png?size=96&passthrough=true" },
            { name: "Palworld - Chillet", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_48b8411feb1e80a69048fc65b3275b75.png?size=96&passthrough=true" },
            { name: "Palworld - Cattiva", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_d260c70fa8f38c499fa452c3cbdc5a0c.png?size=96&passthrough=true" },
            { name: "Palworld - Lamball", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_949a575b693c81ced8f56a7579d0969f.png?size=96&passthrough=true" },
            { name: "Palworld - Depresso", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_b7e2813fb97fe05b0f9f29a1bb7fde41.png?size=96&passthrough=true" },
            { name: "Palworld - Selyne", url: "https://cdn.discordapp.com/avatar-decoration-presets/a_0830085f29712a6f3a23a123302050b4.png?size=96&passthrough=true" },
            { name: "Starfield - Grav Wave", url: "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/1716740/ff0e84c4996b1c9cb299ba2ab1c6454c5d129b49.png" },
            { name: "Genshin - Little Matron", url: "https://upload-os-bbs.hoyolab.com/upload/2024/07/22/d070e73b57eebc782658856f83400c0f_4985728381431752077.webp?x-oss-process=image/auto-orient,0/interlace,1/format,webp/quality,q_70" },
            { name: "Genshin - Lumine", url: "https://fastcdn.hoyoverse.com/static-resource-v2/2024/04/10/e0c33a668dfe55c3d28c153fd26d2566_7549684827555419407.webp?x-oss-process=image/auto-orient,0/interlace,1/format,webp/quality,q_70" },
            { name: "Honkai - Zhu Yuan", url: "https://upload-os-bbs.hoyolab.com/upload/2024/07/23/1b34e54ec5ac3fbe67c079dd29c5f632_5221289561156079104.webp?x-oss-process=image/auto-orient,0/interlace,1/format,webp/quality,q_70" },
            { name: "Honkai - Ellen", url: "https://upload-os-bbs.hoyolab.com/upload/2024/07/04/98126629588606c7ed379693c30b8c6c_1697937515325313185.webp?x-oss-process=image/auto-orient,0/interlace,1/format,webp/quality,q_70" },
            { name: "Minecraft - Cave", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/mc_cave.gif", scale: 1.08 },
        ],
        "Static Frames": [
            { name: "Neon 1", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/static1.png" },
            { name: "Neon 2", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/static2.png", scale: 1.21 },
            { name: "Neon 3", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/static3.png", top: "5px", scale: 1.1, onlyChannel: true, videoTop: "-8px" },
            { name: "DTCQ", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/static5.png", top: "5px", scale: 1.1, onlyChannel: true, videoTop: "-8px" },
            { name: "Lilith", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/static6.png" },
            { name: "Valentine", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/static7.png", scale: 1.1 },
            { name: "Jellyfish", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/jelly.png" },
            { name: "Burger", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/burger.png", scale: 1.19, dontScaleVideos: true },
            { name: "Glitch 1", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/glitch.png", scale: 1.3 },
            { name: "Glitch 2", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/glitch2.png", scale: 1.3 },
            { name: "Cute Doodles", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/cute_doodles.png", scale: 1.4 },
            { name: "Love Letter", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/love_letter.png", scale: 1.4 },
            { name: "Pink Ribbon", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/ribbon.png", scale: 1.1 },
            { name: "Arrival Movie 1", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/arrival.png", scale: 1.2, onlyChannel: true, top: "4px", left: "4px", darkMode: true },
            { name: "Arrival Movie 2", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/arrival2.png", scale: 1.1, onlyChannel: true, top: "7px", darkMode: true },
            { name: "Arrival Movie 3", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/arrival3.png", scale: 1.2, left: "5px", darkMode: true },
            { name: "Valentine 2", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/val2.png", scale: 1.1 },
            { name: "Halloween", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/halloween.png", scale: 1.1 },
            { name: "Halloween 2", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/halloween2.png", scale: 1.1 },
            { name: "Valentine 3", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/val3.png", scale: 1.1 },
            { name: "Pink Sea", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/pink_sea.gif", scale: 1.21 },
            { name: "Saturn", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/saturn.png", scale: 1.5 },
            { name: "Ghost Cat", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/ghost_cat.gif" },
            { name: "Fantasy Nature", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/fantasy_nature.png" },
            { name: "Fantasy Fire", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/fantasy_fire.png" },
            { name: "Fantasy Sea", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/fantasy_sea.png" },
            { name: "Fantasy Dark", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/fantasy_dark.png" },
            { name: "Dark Cat", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/dark_cat.png", top: "5px", scale: 1.1 },
            { name: "Headset", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/headset.png" },
            { name: "Detective", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/detective.png", scale: 1.1 },
            { name: "Lying Figures", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/lying_figures.png?raw=true", top: "-2px", scale: 1.03 },
            { name: "Unicorn", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/unicorn.png?raw=true" },
            { name: "Panda", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/panda.png?raw=true", top: "-3px" },
            { name: "LGBT Transsexual", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/lgbt_trans.png", scale: 0.9 },
            { name: "LGBT Lesbian", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/lgnt_les.png", scale: 1.04 },
            { name: "LGBT Femboy", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/lgbt_femboy.png", scale: 0.9 },
            { name: "LGBT Non-Binary", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/lgbt_nonb.png", scale: 0.9 },
            { name: "LGBT Pride", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/lgbt_pride.png", scale: 0.9 },
            { name: "LGBT Gay", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/lgbt_gay.png", scale: 0.9 },
        ],
        "AI Static": [
            { name: "AI Flowers", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/flowers.png", videoLeft: "-11.3px", left: "-6px", scale:1.12 },
            { name: "Pikachu", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/pikachu.png", scale: 1.21, left: "-2px" },
        ],
        "Experimental": [
            { name: "Valorant - Clove HQ", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/clove_2.gif", top: "-10px" },
            { name: "Magic HQ", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/magic.gif", top: "-12px", scale: 1.3 },
            { name: "Cute Anime", url: "https://raw.githubusercontent.com/phaticusthiccy/phaticusthiccy/main/youtube_animated_avatars/cute_anime.gif", top: "-8px", scale: 1.4, left: "-8px", videoTop: "-11.2px" },
        ]
    };

    for (let _category in avatarCategories) {
        avatarCategories[_category].sort((a, b) => a.name.localeCompare(b.name));
    }

    let selectedAvatarUrl = localStorage.getItem('selectedAvatar') || '';
    let selectedCategory = ""

    function saveSelectedAvatar(url, category) {
        localStorage.setItem('selectedAvatar', url);
        localStorage.setItem('selectedMenu', category);
        selectedAvatarUrl = url;
        selectedCategory = category;
    }

    function getSelectedAvatar() {
        return localStorage.getItem('selectedAvatar') || '';
    }

    function getSelectedMenu() {
        return localStorage.getItem('selectedMenu');
    }

    function categoryContainsSelectedAvatar(category, selectedAvatar) {
        return avatarCategories[category].some(avatar => avatar.url === selectedAvatar);
    }

    function isValidUrl() {
        const currentUrl = document.location.href.split(".com/")[1];
        return currentUrl.startsWith("@") || currentUrl.startsWith("watch") || currentUrl.startsWith("c/") || currentUrl.startsWith("channel/");
    }

    function isChannel() {
        const currentUrl = document.location.href.split(".com/")[1];
        return currentUrl.startsWith("@") || currentUrl.startsWith("c/") || currentUrl.startsWith("channel/");
    }

    function isYouTubeDarkMode() {
        try {
            function isDarkColor(color) {
                const rgb = color.match(/\d+/g);
                if (rgb) {
                    const [r, g, b] = rgb.map(Number);
                    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                    return brightness < 128;
                }
                return false;
            }

            const appContainer = document.querySelector('ytd-app');
            if (appContainer) {
                const bgColor = window.getComputedStyle(appContainer).backgroundColor;
                return isDarkColor(bgColor);
            }

            const bodyBgColor = window.getComputedStyle(document.body).backgroundColor;
            return isDarkColor(bodyBgColor);
        } catch {
            return false
        }
    }

    var searchTerm = ""

    function createMenu(idName = "") {
        /*if (document.getElementById('avatar-menu2')) {
            return;
        }*/

        var menu;
        if (document.getElementById('avatar-menu2')) {
            menu = document.getElementById('avatar-menu2')
            return menu
        } else {
            menu = document.createElement('div');
        };

        menu.id = idName == "" ? 'avatar-menu' : idName;
        menu.style.position = 'absolute';
        menu.style.backgroundColor = '#fff';
        menu.style.border = '1px solid #ccc';
        menu.style.padding = '23px';
        menu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        menu.style.borderRadius = '8px';
        menu.style.zIndex = '9999';
        menu.style.display = 'none';
        menu.style.transition = 'opacity 0.3s ease';
        menu.style.opacity = '0';
        menu.style.maxHeight = '500px';
        menu.style.overflowY = 'auto';
        menu.style.overflowX = 'hidden';
        menu.style.minWidth = '250px';
        menu.style.fontSize = '14px';
        menu.style.userSelect = 'none';


        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search Effect...';
        searchInput.style.width = '100%';
        searchInput.style.padding = '10px';
        searchInput.style.marginBottom = '10px';
        searchInput.style.minWidth = '250px';
        searchInput.style.border = 'none';
        searchInput.style.outline = 'none';
        searchInput.style.boxShadow = 'none';

        searchInput.addEventListener('focus', () => {
            searchInput.style.border = 'none';
            searchInput.style.outline = 'none';
            searchInput.style.boxShadow = 'none';
        });

        searchInput.addEventListener('blur', () => {
            searchInput.style.border = 'none';
            searchInput.style.outline = 'none';
            searchInput.style.boxShadow = 'none';
        });


        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            menu.querySelectorAll('div > div > div').forEach((item) => {
                if (searchTerm === '') {
                    item.style.display = '';
                    item.parentElement.style.display = 'none';
                    item.parentElement.parentElement.style.display = 'block';
                    //item.parentElement.parentElement.children[1].style.display = 'none';
                } else if (item.textContent.toLowerCase().includes(searchTerm)) {
                    item.style.display = "block"
                    item.parentElement.style.display = 'block';
                    item.parentElement.parentElement.style.display = 'block';
                    item.parentElement.parentElement.children[1].style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        menu.insertBefore(searchInput, menu.firstChild);

        const selectedAvatar = getSelectedAvatar();
        const selectedCategory = getSelectedMenu();

        for (const [category, avatars] of Object.entries(avatarCategories)) {
            const categoryDiv = document.createElement('div');
            categoryDiv.style.marginBottom = '15px';

            const categoryTitle = document.createElement('div');
            categoryTitle.textContent = category;
            categoryTitle.style.fontWeight = 'bold';
            categoryTitle.style.marginBottom = '8px';
            categoryTitle.style.cursor = 'pointer';
            categoryTitle.style.padding = '8px';
            categoryTitle.style.backgroundColor = '#f0f0f0';
            categoryTitle.style.borderRadius = '4px';


            if (categoryContainsSelectedAvatar(category, selectedAvatar) == true) {
                categoryTitle.style.color = '#369626';
            }

            const avatarList = document.createElement('div');
            avatarList.style.display = 'none';
            avatarList.style.paddingLeft = '15px';

            categoryTitle.addEventListener('click', (event) => {
                avatarList.style.display = avatarList.style.display === 'none' ? 'block' : 'none';
                event.stopPropagation();
            });

            avatars.forEach(avatar => {
                const item = document.createElement('div');
                item.style.padding = '10px';
                item.style.cursor = 'pointer';
                item.style.borderBottom = '1px solid #eee';
                item.style.transition = 'background-color 0.2s';
                item.style.display = 'flex';
                item.style.alignItems = 'center';
                item.style.position = 'relative';

                const avatarName = document.createElement('span');
                avatarName.textContent = avatar.name;
                avatarName.style.flexGrow = '1';


                const previewImg = document.createElement('img');
                previewImg.style.width = '30px';
                previewImg.style.height = '30px';
                previewImg.style.marginLeft = '20px';
                previewImg.style.marginRight = '25px';
                previewImg.style.display = 'none';
                previewImg.style.position = 'absolute';
                previewImg.style.right = '0';
                previewImg.style.top = '50%';
                previewImg.style.transform = 'translateY(-50%)';

                item.appendChild(avatarName);
                item.appendChild(previewImg);

                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = '#f5f5f5';
                    item.style.transform = 'scale(1.2)';
                    item.style.transition = 'transform 0.2s ease';
                    item.style.zIndex = '100';
                    previewImg.style.display = 'block';

                    if (!previewImg.src) {
                        previewImg.src = avatar.url;
                    }
                    previewImg.style.display = 'block';

                });
                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = '#fff';
                    item.style.transform = 'scale(1)';
                    item.style.transition = 'transform 0.2s ease';
                    item.style.zIndex = '0';
                    previewImg.style.display = 'none';
                });

                item.addEventListener('click', () => {

                    var selectedAvatar2 = avatar.url
                    var selectedCategory2 = findCategoryByUrl(selectedAvatar2, avatarCategories)

                    if (selectedAvatar2 && selectedCategory2) {
                        var effectName = document.querySelector("#selectedEffectName")
                        if (effectName) {
                            let findAvatarName = avatarCategories[selectedCategory2].find((avatar3) => avatar3.url == selectedAvatar2)
                            effectName.textContent = `${selectedCategory2} • ${findAvatarName.name}`
                        } else {
                            let selectedAvatarInfo = document.createElement('div');
                            selectedAvatarInfo.style.fontWeight = 'bold';
                            selectedAvatarInfo.style.marginBottom = '10px';
                            selectedAvatarInfo.style.textAlign = "center"
                            selectedAvatarInfo.style.color = "#369626"
                            selectedAvatarInfo.id = "selectedEffectName"
                            let findAvatarName = avatarCategories[selectedCategory2].find((avatar3) => avatar3.url == selectedAvatar2)
                            selectedAvatarInfo.textContent = `${selectedCategory2} • ${findAvatarName.name}`
                            menu.insertBefore(selectedAvatarInfo, menu.firstChild);
                        }
                    }

                    applyAvatar(avatar.url);
                    saveSelectedAvatar(avatar.url, category);
                    updateMenu(menu);
                    //menu.style.opacity = '0';
                    //setTimeout(() => menu.style.display = 'none', 300);
                });
                item.addEventListener('mouseover', () => {
                    item.style.backgroundColor = '#f5f5f5';
                });
                item.addEventListener('mouseout', () => {
                    item.style.backgroundColor = '#fff';
                });
                avatarList.appendChild(item);
            });

            categoryDiv.appendChild(categoryTitle);
            categoryDiv.appendChild(avatarList);
            menu.appendChild(categoryDiv);
        }

        const removeItem = document.createElement('div');
        removeItem.style.padding = '10px';
        removeItem.style.cursor = 'pointer';
        removeItem.style.borderTop = '1px solid #eee';
        removeItem.style.color = '#ff4d4d';
        removeItem.style.fontWeight = 'bold';
        removeItem.textContent = 'Remove';
        removeItem.style.textAlign = "center"
        removeItem.addEventListener('click', () => {
            var effectName = document.querySelector("#selectedEffectName")
            if (effectName) effectName.remove()
            removeAvatar();
            saveSelectedAvatar('', '');
            updateMenu(menu);
            menu.style.opacity = '0';
            setTimeout(() => menu.style.display = 'none', 300);
        });
        removeItem.addEventListener('mouseover', () => {
            removeItem.style.backgroundColor = '#f5f5f5';
        });
        removeItem.addEventListener('mouseout', () => {
            removeItem.style.backgroundColor = '#fff';
        });
        menu.appendChild(removeItem);

        removeItem.addEventListener('mouseenter', () => {
            removeItem.style.backgroundColor = '#f5f5f5';
            removeItem.style.transform = 'scale(1.2)';
            removeItem.style.transition = 'transform 0.2s ease';
            removeItem.style.zIndex = '100';
        });
        removeItem.addEventListener('mouseleave', () => {
            removeItem.style.backgroundColor = '#fff';
            removeItem.style.transform = 'scale(1)';
            removeItem.style.transition = 'transform 0.2s ease';
            removeItem.style.zIndex = '0';
        });

        document.body.appendChild(menu);

        document.addEventListener('click', (event) => {
            if (menu.style.display === 'block' && !menu.contains(event.target) && event.target.id !== 'avatar-icon') {
                menu.style.opacity = '0';
                setTimeout(() => menu.style.display = 'none', 300);
            }
        });

        try {
            if (selectedAvatar && selectedCategory) {
                const selectedAvatarInfo = document.createElement('div');
                selectedAvatarInfo.style.fontWeight = 'bold';
                selectedAvatarInfo.style.marginBottom = '10px';
                selectedAvatarInfo.style.textAlign = "center"
                selectedAvatarInfo.style.color = "#369626"
                selectedAvatarInfo.id = "selectedEffectName"
                var findAvatarName = avatarCategories[selectedCategory].find((avatar) => avatar.url == selectedAvatar)
                selectedAvatarInfo.textContent = `${selectedCategory} • ${findAvatarName.name}`;
                menu.insertBefore(selectedAvatarInfo, menu.firstChild);
            }
        } catch {}

        return menu;
    }

    function updateMenu(menu) {
        const selectedAvatar = getSelectedAvatar();
        menu.querySelectorAll('div > div').forEach((item) => {
            if (item.style.padding === '8px') {
                item.style.color = '';
            }
        });
    }

    function findCategoryByUrl(url, avatarCategories) {
        for (let category in avatarCategories) {
            for (let item of avatarCategories[category]) {
                if (item.url === url) {
                    return category;
                }
            }
        }
        return null;
    }

    function applyAvatar(url) {
        if (!isValidUrl() || !url) return;

        if (isChannel()) {
            applyChannelAvatar(url);
        } else {
            applyVideoAvatar(url);
        }
    }

    function applyChannelAvatar(url) {
        const avatarShape = document.querySelector('yt-avatar-shape');
        const findAvatarByURL = (url) => {
            for (const category in avatarCategories) {
                const avatar = avatarCategories[category].find((avatar) => avatar.url === url);
                if (avatar) return avatar;
            }
            return {};
        };
        if (avatarShape) {

            var channelFind = findAvatarByURL(url)
            var channelTop = channelFind.top == undefined ? "0" : String(channelFind.top);
            var channelScale = channelFind.scale == undefined ? 'none' : String(channelFind.scale);
            var channelFilter = channelFind.darkMode == true ? isYouTubeDarkMode() == true ? "invert(1)" : "none" : "none"
            var channelLeft = channelFind.left == undefined ? '0' : String(channelFind.left);

            let gifWrapper = avatarShape.querySelector('#gif-wrapper');
            if (!gifWrapper) {
                gifWrapper = document.createElement('div');
                gifWrapper.id = 'gif-wrapper';
                gifWrapper.style.position = 'absolute';
                gifWrapper.style.width = '160px';
                gifWrapper.style.height = '160px';
                gifWrapper.style.zIndex = '10';
                gifWrapper.style.scale = '1.21';

                const gifElement = document.createElement('img');
                gifElement.id = 'gif-element';
                gifElement.style.position = 'absolute';
                gifElement.style.top = channelTop
                gifElement.style.left = channelLeft
                gifElement.style.width = '100%';
                gifElement.style.height = '100%';
                gifElement.style.zIndex = '10';
                gifElement.style.scale = channelScale
                gifElement.style.filter = channelFilter

                gifWrapper.appendChild(gifElement);
                avatarShape.insertBefore(gifWrapper, avatarShape.firstChild);
            }
            const gifElement = gifWrapper.querySelector('#gif-element');
            if (gifElement.src !== url) {
                gifElement.src = url;
                gifElement.style.scale = channelScale
                gifElement.style.top = channelTop
                gifElement.style.filter = channelFilter
                gifElement.style.left = channelLeft
            }
        }
    }

    function applyVideoAvatar(url) {
        const findAvatarByURL = (url) => {
            for (const category in avatarCategories) {
                const avatar = avatarCategories[category].find((avatar) => avatar.url === url);
                if (avatar) return avatar;
            }
            return {};
        };
        const avatar = document.querySelector('#avatar');

        var objectAvatar = findAvatarByURL(url)
        var videoTop = objectAvatar.videoTop == undefined ? objectAvatar.top == undefined ? "-10px" : objectAvatar.onlyChannel == true ? objectAvatar.videoTop == undefined ? "-10px" : objectAvatar.videoTop : String(objectAvatar.top) : objectAvatar.videoTop;
        var videoScale = objectAvatar.videoScale == undefined ? objectAvatar.scale == undefined ? 'none' : objectAvatar.dontScaleVideos == true ? 'none' : String(objectAvatar.scale) : String(objectAvatar.videoScale);
        var videoFilter = objectAvatar.darkMode == true ? isYouTubeDarkMode() == true ? "invert(1)" : "none" : "none"
        var videoLeft = objectAvatar.videoLeft == undefined ? '-10px' : String(objectAvatar.videoLeft);

        if (avatar) {
            let uploadInfo = document.querySelector('#upload-info');
            if (uploadInfo) {
                uploadInfo.style.position = 'relative';
                uploadInfo.style.left = '10px';
            }

            let gifWrapper = document.querySelector('#gif-wrapper');
            if (!gifWrapper) {
                gifWrapper = document.createElement('div');
                gifWrapper.id = 'gif-wrapper';
                gifWrapper.style.position = 'relative';
                gifWrapper.style.width = '40px';
                gifWrapper.style.height = '40px';
                gifWrapper.style.zIndex = '10';

                let gifElement = document.createElement('img');
                gifElement.id = 'gif-element';
                gifElement.style.position = 'absolute';
                gifElement.style.left = videoLeft
                gifElement.style.width = '60px';
                gifElement.style.height = '60px';
                gifElement.style.zIndex = '10';
                gifElement.style.scale = videoScale
                gifElement.style.top = videoTop
                gifElement.style.filter = videoFilter

                gifWrapper.appendChild(gifElement);
                avatar.parentElement.insertBefore(gifWrapper, avatar);
                gifWrapper.appendChild(avatar);
            }
            let gifElement = document.querySelector('#gif-element');
            if (gifElement.src !== url) {
                gifElement.src = url;
                gifElement.style.scale = videoScale
                gifElement.style.top = videoTop
                gifElement.style.filter = videoFilter
                gifElement.style.left = videoLeft
            }
        }

        const avatar2 = document.querySelector('a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer #avatar');
        if (avatar2) {
            let uploadInfo = document.querySelector('#upload-info');
            if (uploadInfo) {
                uploadInfo.style.position = 'relative';
                uploadInfo.style.left = '10px';
            }

            let gifWrapper = document.querySelector('#gif-wrapper');
            if (!gifWrapper) {
                gifWrapper = document.createElement('div');
                gifWrapper.id = 'gif-wrapper';
                gifWrapper.style.position = 'relative';
                gifWrapper.style.width = '40px';
                gifWrapper.style.height = '40px';
                gifWrapper.style.zIndex = '10';

                let gifElement = document.createElement('img');
                gifElement.id = 'gif-element';
                gifElement.style.position = 'absolute';
                gifElement.style.left = videoLeft
                gifElement.style.width = '60px';
                gifElement.style.height = '60px';
                gifElement.style.zIndex = '10';
                gifElement.style.scale = videoScale
                gifElement.style.top = videoTop
                gifElement.style.filter = videoFilter

                gifWrapper.appendChild(gifElement);
                avatar2.parentElement.insertBefore(gifWrapper, avatar2);
                gifWrapper.appendChild(avatar2);
            }
            let gifElement = document.querySelector('#gif-element');
            if (gifElement.src !== url) {
                gifElement.src = url;
                gifElement.style.scale = videoScale
                gifElement.style.top = videoTop
                gifElement.style.filter = videoFilter
                gifElement.style.left = videoLeft
            }
        }

        const avatar3 = document.querySelector("ytd-watch-flexy a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer #avatar")
        if (avatar3) {
            let uploadInfo = document.querySelector('#upload-info');
            if (uploadInfo) {
                uploadInfo.style.position = 'relative';
                uploadInfo.style.left = '10px';
            }

            let gifWrapper = document.querySelector('#gif-wrapper');
            if (!gifWrapper) {
                gifWrapper = document.createElement('div');
                gifWrapper.id = 'gif-wrapper';
                gifWrapper.style.position = 'relative';
                gifWrapper.style.width = '40px';
                gifWrapper.style.height = '40px';
                gifWrapper.style.zIndex = '10';

                let gifElement = document.createElement('img');
                gifElement.id = 'gif-element';
                gifElement.style.position = 'absolute';
                gifElement.style.left = videoLeft
                gifElement.style.width = '60px';
                gifElement.style.height = '60px';
                gifElement.style.zIndex = '10';
                gifElement.style.scale = videoScale
                gifElement.style.top = videoTop
                gifElement.style.filter = videoFilter

                gifWrapper.appendChild(gifElement);
                avatar3.parentElement.insertBefore(gifWrapper, avatar3);
                gifWrapper.appendChild(avatar3);
            }
            let gifElement = document.querySelector('#gif-element');
            if (gifElement.src !== url) {
                gifElement.src = url;
                gifElement.style.scale = videoScale
                gifElement.style.top = videoTop
                gifElement.style.filter = videoFilter
                gifElement.style.left = videoLeft
            }
        }
    }

    function removeAvatar() {
        if (isChannel()) {
            const gifWrapper = document.querySelector('yt-avatar-shape #gif-wrapper');
            if (gifWrapper) {
                gifWrapper.remove();
            }
        } else {
            const gifWrapper = document.querySelector('#gif-wrapper');
            if (gifWrapper) {
                const uploadInfo = document.querySelector('#upload-info');
                if (uploadInfo) {
                    uploadInfo.style.position = 'relative';
                    uploadInfo.style.left = '0px';
                }
                const avatar = gifWrapper.querySelector('#avatar');
                gifWrapper.parentElement.insertBefore(avatar, gifWrapper);
                gifWrapper.remove();
            }
        }
    }

    function addIcon() {
        const topBar = document.querySelector('ytd-topbar-menu-button-renderer');
        if (topBar && !document.querySelector('#avatar-icon')) {
            const iconWrapper = document.createElement('div');
            iconWrapper.style.display = 'flex';
            iconWrapper.style.alignItems = 'center';

            const icon = document.createElement('img');
            icon.id = 'avatar-icon';
            icon.src = 'https://cdn.iconscout.com/icon/free/png-512/free-settings-2856913-2377697.png?f=webp&w=256';
            icon.style.width = '24px';
            icon.style.height = '24px';
            icon.style.cursor = 'pointer';
            icon.style.marginRight = '10px';
            icon.style.userSelect = 'none';

            icon.addEventListener('click', () => {
                const menu = createMenu("avatar-menu2");
                function showToast(message) {
                    const toast = document.createElement('div');
                    toast.textContent = message;
                    toast.style.position = 'fixed';
                    toast.style["font-size"] = "larger";
                    toast.style.top = '60px';
                    toast.style.right = '20px';
                    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    toast.style.color = 'white';
                    toast.style.padding = '10px 20px';
                    toast.style.borderRadius = '5px';
                    toast.style.zIndex = '9999';
                    toast.style.transition = 'opacity 0.5s';

                    document.body.appendChild(toast);

                    setTimeout(() => {
                        toast.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(toast);
                        }, 500);
                    }, 3000);
                }

                if (!isValidUrl()) {
                    showToast("You can only use this while watching a video or on a channel page");
                    return;
                }

                if (menu.style.display === 'none') {
                    updateMenu(menu);
                    menu.style.display = 'block';
                    setTimeout(() => menu.style.opacity = '1', 0);
                    const rect = icon.getBoundingClientRect();

                    const topOffset = rect.bottom + window.scrollY + (rect.height * 1.25);
                    const leftOffset = rect.left + window.scrollX - (rect.width * 0.5);

                    menu.style.top = topOffset + "px"
                    menu.style.left = `82%`;
                } else {
                    menu.style.opacity = '0';
                    setTimeout(() => menu.style.display = 'none', 300);
                }
            });

            iconWrapper.appendChild(icon);
            topBar.parentElement.insertBefore(iconWrapper, topBar);
        }
    }

    function applyStoredAvatar() {
        const selectedAvatar = getSelectedAvatar();
        if (selectedAvatar) {
            applyAvatar(selectedAvatar);
        }
    }

    function keepAlive() {
        setInterval(() => {
            addIcon();
            //createMenu();
        }, 2000)
    }

    function checkForTopBar() {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector('ytd-topbar-menu-button-renderer')) {
                addIcon();
                applyStoredAvatar();
                obs.disconnect();
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    function checkForChannelAvatar() {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector('yt-avatar-shape')) {
                applyStoredAvatar();
                obs.disconnect();
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    function observeUrlChange() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                onUrlChange();
            }
        }).observe(document, { subtree: true, childList: true });
    }

    function onUrlChange() {
        if (!isValidUrl()) return;
        if (document.location.href.includes("index=") || document.location.href.includes("list=")) {
            true;
        } else {
            location.reload(true);
        }
        const selectedAvatar = getSelectedAvatar();
        if (selectedAvatar) {
            applyAvatar(selectedAvatar);
        }
    }

    function init() {
        checkForTopBar();
        const selectedAvatar = getSelectedAvatar();
        if (selectedAvatar) {
            checkForChannelAvatar();
        }
        observeUrlChange();
        keepAlive();
    }

    function checkAndApplyChannelAvatar() {
        if (!isValidUrl()) return;
        const selectedAvatar = getSelectedAvatar();
        if (selectedAvatar) {
            if (isChannel()) {
                const avatarShape = document.querySelector('yt-avatar-shape');
                if (avatarShape) {
                    const gifElement = avatarShape.querySelector('#gif-element');
                    if (!gifElement) {
                        applyChannelAvatar(selectedAvatar);
                    }
                }
            } else {
                applyVideoAvatar(selectedAvatar);
            }
        }
    }

    //setInterval(checkAndApplyChannelAvatar, 500);
    init();
    window.addEventListener('load', init);
})();
