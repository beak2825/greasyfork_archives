// ==UserScript==
// @name         MUSIC SIEU CHILL      
// @namespace    http://tampermonkey.net/
// @version      5,6  (beta test )
// @description  Press "tab" or "]" for Menu 1 , press "[" or "`" for Menu 2
// @author       XUAN & taochsgamedekiemgai2207 (  cre: Zick & Ano master and RektByMateX)
// @match              *://*.sploop.io/*
// @match              *://*.*/*
// @match              *://*.moomoo.io/*
// @match              *://*.gemini.google.com/*
// @match              *://*.www.crazygames.com/*
// @match              *://*.youtube.com/*
// @match              *://*.extension/*
// @match              *://translate.google.com/*
// @match              *://translate.google.cn/*
// @match              *://*.edge/*
// @match              *://starve.io/*
// @match              *://moomoo.io/*
// @match              *://sandbox.moomoo.io/*
// @match              *://dev.moomoo.io/*
// @match              *://*.moomoo.io/*
// @match              *://surviv.io/*
// @match              *://agar.io/*
// @match              *://slither.io/*
// @match              *://diep.io/*
// @match              *://deeeep.io/*
// @match              *://evowars.io/*
// @match              *://zombs.io/*
// @match              *://paper-io.com/*
// @match              *://skribbl.io/*
// @require            http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/6.0.2/signalr.min.js
// @match              https://forms.office.com/Pages/ResponsePage.aspx?*
// @match              https://shub.edu.vn/*
// @match              https://azota.vn/*
// @match              https://quilgo.com/*
// @match              https://docs.google.com/forms/*
// @match              *://agar.io/*
// @match              *://sploop.io/*
// @match              *://mineenergy.fun/*
// @match              *://sandbox.moomoo.io/*
// @match              *://starve.io/*
// @match              *://taming.io/*
// @match              *://arras.io/*
// @match              *://*.www.bing.com/*
// @match              https://cn.bing.com/*
// @match              https://www.bing.com/*
// @match              *://*.bing.com/*
// @match             *://*/*
// @match              https://chat.openai.com/chat
// @match              https://www.google.com/*
// @match              https://duckduckgo.com/*
// @match              https://www.so.com/s*
// @match              *://m.so.com/s*
// @match              *://www.baidu.com/s*
// @match              https://www.baidu.com/*
// @match              https://m.baidu.com/*
// @match              *://baidu.com/s*
// @match              *://yandex.ru/search*
// @match              *://yandex.com/search*
// @match              https://search.ecnu.cf/search*
// @match              https://search.aust.cf/search*
// @match              https://search.*.cf/search*
// @match              https://*        .cf:*/*
// @match              *://gooo.azurewebsites.net/*
// @match              https://fsoufsou.com/search*
// @match              https://www.google.com.hk/*
// @match              *://www.sogou.com/*
// @match              *://m.sogou.com/*
// @match              *://wap.sogou.com/*
// @match              *://*.tiangong.cn/*
// @match              *://www.bilibili.com/video/*
// @match              *://blog.csdn.net/*/article/details/*
// @match              *://chatglm.cn/*
// @match              *://*.chatgpt.com/*
// @match              *://starve.io/*
// @match              *://classroom.google.com/*
// @match              *://*.moomoo.io/*
// @match              *://moomoo.io/*
// @match              *://sandbox.moomoo.io/*
// @match              *://www.google.com/recaptcha/api2/*
// @match              *://diep.io/*
// @match              *://www.baidu.com/*
// @match              *://baidu.com/*
// @match              *://m.baidu.com/*
// @match              *://*.greasyfork.org/*
// @match              *://*.google.com/*
// @match              *://*.azota.vn/*
// @match              *://*.chess.com/*
// @match              *://*.google.com.vn/*
// @match              *://*.poki.com/*
// @match              *://*.yahoo.com/*
// @match              *://*.search.yahoo.com/*
// @match              *://*.roblox.com/*
// @match              *://*.battledudes.io/*
// @match              *://*.taming.io/*
// @match              *://*.starblast.io/*
// @match              *://www.baidu.com/*
// @match              *://ipv6.baidu.com/*
// @match              *://image.baidu.com/search*
// @match              *://kaifa.baidu.com/searchPage*
// @match              *://*.bing.com/*search*
// @match              *://duckduckgo.com/*
// @match              *://*.sogou.com/*
// @match              *://www.qwant.com/?*
// @match              *://www.so.com/s*
// @match              *://image.so.com/*
// @match              *://so.toutiao.com/search*
// @match              *://yandex.com/*search*
// @match              *://yandex.ru/*search*
// @match              *://www.ecosia.org/*
// @match              *://*.search.yahoo.com/search*
// @match              *://*.images.search.yahoo.com/search*
// @match              *://you.com/search*
// @match              *://www.startpage.com/*
// @match              *://search.brave.com/*
// @match              *://yep.com/*
// @match              *://swisscows.com/*
// @match              *://search.inetol.net/search*
// @match              *://*.google.com/search*
// @match              *://*.google.ad/search*
// @match              *://*.google.ae/search*
// @match              *://*.google.com.af/search*
// @match              *://*.google.com.ag/search*
// @match              *://*.google.com.ai/search*
// @match              *://*.google.al/search*
// @match              *://*.google.am/search*
// @match              *://*.google.co.ao/search*
// @match              *://*.google.com.ar/search*
// @match              *://*.google.as/search*
// @match              *://*.google.at/search*
// @match              *://*.google.com.au/search*
// @match              *://*.google.az/search*
// @match              *://*.google.ba/search*
// @match              *://*.google.com.bd/search*
// @match              *://*.google.be/search*
// @match              *://*.google.bf/search*
// @match              *://*.google.bg/search*
// @match              *://*.google.com.bh/search*
// @match              *://*.google.bi/search*
// @match              *://*.google.bj/search*
// @match              *://*.google.com.bn/search*
// @match              *://*.google.com.bo/search*
// @match              *://*.google.com.br/search*
// @match              *://*.google.bs/search*
// @match              *://*.google.bt/search*
// @match              *://*.google.co.bw/search*
// @match              *://*.google.by/search*
// @match              *://*.google.com.bz/search*
// @match              *://*.google.ca/search*
// @match              *://*.google.cd/search*
// @match              *://*.google.cf/search*
// @match              *://*.google.cg/search*
// @match              *://*.google.ch/search*
// @match              *://*.google.ci/search*
// @match              *://*.google.co.ck/search*
// @match              *://*.google.cl/search*
// @match              *://*.google.cm/search*
// @match              *://*.google.cn/search*
// @match              *://*.google.com.co/search*
// @match              *://*.google.co.cr/search*
// @match              *://*.google.com.cu/search*
// @match              *://*.google.cv/search*
// @match              *://*.google.com.cy/search*
// @match              *://*.google.cz/search*
// @match              *://*.google.de/search*
// @match              *://*.google.dj/search*
// @match              *://*.google.dk/search*
// @match              *://*.google.dm/search*
// @match              *://*.google.com.do/search*
// @match              *://*.google.dz/search*
// @match              *://*.google.com.ec/search*
// @match              *://*.google.ee/search*
// @match              *://*.google.com.eg/search*
// @match              *://*.google.es/search*
// @match              *://*.google.com.et/search*
// @match              *://*.google.fi/search*
// @match              *://*.google.com.fj/search*
// @match              *://*.google.fm/search*
// @match              *://*.google.fr/search*
// @match              *://*.google.ga/search*
// @match              *://*.google.ge/search*
// @match              *://*.google.gg/search*
// @match              *://*.google.com.gh/search*
// @match              *://*.google.com.gi/search*
// @match              *://*.google.gl/search*
// @match              *://*.google.gm/search*
// @match              *://*.google.gr/search*
// @match              *://*.google.com.gt/search*
// @match              *://*.google.gy/search*
// @match              *://*.google.hk/search*
// @match              *://*.google.com.hk/search*
// @match              *://*.google.hn/search*
// @match              *://*.google.hr/search*
// @match              *://*.google.ht/search*
// @match              *://*.google.hu/search*
// @match              *://*.google.co.id/search*
// @match              *://*.google.ie/search*
// @match              *://*.google.co.il/search*
// @match              *://*.google.im/search*
// @match              *://*.google.co.in/search*
// @match              *://*.google.iq/search*
// @match              *://*.google.is/search*
// @match              *://*.google.it/search*
// @match              *://*.google.je/search*
// @match              *://*.google.com.jm/search*
// @match              *://*.google.jo/search*
// @match              *://*.google.jp/search*
// @match              *://*.google.co.jp/search*
// @match              *://*.google.co.ke/search*
// @match              *://*.google.com.kh/search*
// @match              *://*.google.ki/search*
// @match              *://*.google.kg/search*
// @match              *://*.google.co.kr/search*
// @match              *://*.google.com.kw/search*
// @match              *://*.google.kz/search*
// @match              *://*.google.la/search*
// @match              *://*.google.com.lb/search*
// @match              *://*.google.li/search*
// @match              *://*.google.lk/search*
// @match              *://*.google.co.ls/search*
// @match              *://*.google.lt/search*
// @match              *://*.google.lu/search*
// @match              *://*.google.lv/search*
// @match              *://*.google.com.ly/search*
// @match              *://*.google.co.ma/search*
// @match              *://*.google.md/search*
// @match              *://*.google.me/search*
// @match              *://*.google.mg/search*
// @match              *://*.google.mk/search*
// @match              *://*.google.ml/search*
// @match              *://*.google.com.mm/search*
// @match              *://*.google.mn/search*
// @match              *://*.google.ms/search*
// @match              *://*.google.com.mt/search*
// @match              *://*.google.mu/search*
// @match              *://*.google.mv/search*
// @match              *://*.google.mw/search*
// @match              *://*.google.com.mx/search*
// @match              *://*.google.com.my/search*
// @match              *://*.google.co.mz/search*
// @match              *://*.google.com.na/search*
// @match              *://*.google.com.ng/search*
// @match              *://*.google.com.ni/search*
// @match              *://*.google.ne/search*
// @match              *://*.google.nl/search*
// @match              *://*.google.no/search*
// @match              *://*.google.com.np/search*
// @match              *://*.google.nr/search*
// @match              *://*.google.nu/search*
// @match              *://*.google.co.nz/search*
// @match              *://*.google.com.om/search*
// @match              *://*.google.com.pa/search*
// @match              *://*.google.com.pe/search*
// @match              *://*.google.com.pg/search*
// @match              *://*.google.com.ph/search*
// @match              *://*.google.com.pk/search*
// @match              *://*.google.pl/search*
// @match              *://*.google.pn/search*
// @match              *://*.google.com.pr/search*
// @match              *://*.google.ps/search*
// @match              *://*.google.pt/search*
// @match              *://*.google.com.py/search*
// @match              *://*.google.com.qa/search*
// @match              *://*.google.ro/search*
// @match              *://*.google.ru/search*
// @match              *://*.google.rw/search*
// @match              *://*.google.com.sa/search*
// @match              *://*.google.com.sb/search*
// @match              *://*.google.sc/search*
// @match              *://*.google.se/search*
// @match              *://*.google.com.sg/search*
// @match              *://*.google.sh/search*
// @match              *://*.google.si/search*
// @match              *://*.google.sk/search*
// @match              *://*.google.com.sl/search*
// @match              *://*.google.sn/search*
// @match              *://*.google.so/search*
// @match              *://*.google.sm/search*
// @match              *://*.google.sr/search*
// @match              *://*.google.st/search*
// @match              *://*.google.com.sv/search*
// @match              *://*.google.td/search*
// @match              *://*.google.tg/search*
// @match              *://*.google.co.th/search*
// @match              *://*.google.com.tj/search*
// @match              *://*.google.tl/search*
// @match              *://*.google.tm/search*
// @match              *://*.google.tn/search*
// @match              *://*.google.to/search*
// @match              *://*.google.com.tr/search*
// @match              *://*.google.tt/search*
// @match              *://*.google.com.tw/search*
// @match              *://*.google.co.tz/search*
// @match              *://*.google.com.ua/search*
// @match              *://*.google.co.ug/search*
// @match              *://*.google.co.uk/search*
// @match              *://*.google.com.uy/search*
// @match              *://*.google.co.uz/search*
// @match              *://*.google.com.vc/search*
// @match              *://*.google.co.ve/search*
// @match              *://*.google.vg/search*
// @match              *://*.google.co.vi/search*
// @match              *://*.google.com.vn/search*
// @match              *://*.google.vu/search*
// @match              *://*.google.ws/search*
// @match              *://*.google.rs/search*
// @match              *://*.google.co.za/search*
// @match              *://*.google.co.zm/search*
// @match              *://*.google.co.zw/search*
// @match              *://*.google.cat/search*
// @match              *://*.yahoo/*
// @match              *://*./*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524482/MUSIC%20SIEU%20CHILL.user.js
// @updateURL https://update.greasyfork.org/scripts/524482/MUSIC%20SIEU%20CHILL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the music menu container
    const musicMenuContainer = document.createElement('div');
    musicMenuContainer.id = 'musicMenuContainer';
    musicMenuContainer.style.position = 'absolute';
    musicMenuContainer.style.top = '0';
    musicMenuContainer.style.left = '0';
    musicMenuContainer.style.width = '250px';
    musicMenuContainer.style.maxHeight = '100vh';
    musicMenuContainer.style.overflowY = 'auto';
    musicMenuContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.51)';
    musicMenuContainer.style.color = '#fff';
    musicMenuContainer.style.borderRadius = '10px';
    musicMenuContainer.style.padding = '20px';
    musicMenuContainer.style.zIndex = '9999';
    musicMenuContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0,5)';
    musicMenuContainer.style.display = 'none'; // Initially hidden

    // Title for music menu
    const musicTitle = document.createElement('h2');
    musicTitle.textContent = ' bấm nút " tab hoạc ] " để mở hoạc tắt menu , bấm "[ hay ` " để mở menu số 2';
    musicTitle.style.textAlign = 'center';
    musicMenuContainer.appendChild(musicTitle);

    // Volume control
    const volumeLabel = document.createElement('label');
    volumeLabel.textContent = 'âm thanh:';
    musicMenuContainer.appendChild(volumeLabel);

    const volumeSlider = createSlider(0, 100, 50);
    volumeSlider.addEventListener('input', () => {
        const volume = volumeSlider.value / 100;
        player.setVolume(volume * 100);
    });
    musicMenuContainer.appendChild(volumeSlider);

    // Mute/Unmute button
    const muteButton = createButton('tắt tiếng', 'rgba(255, 165, 0, 0.5)');
    let isMuted = false;
    muteButton.addEventListener('click', () => {
        isMuted = !isMuted;
        player.setVolume(isMuted ? 0 : volumeSlider.value);
        muteButton.textContent = isMuted ? 'mở tiếng' : 'tắt tiếng';
    });
    musicMenuContainer.appendChild(muteButton);

    // Playback speed control
    const speedLabel = document.createElement('label');
    speedLabel.textContent = 'tốc độ nhạc:';
    musicMenuContainer.appendChild(speedLabel);

    const speedSelect = createSelect([0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9, 2,3,4,5,6,7,8,9,10,100,1000,10000,1000000,1000000], 'x');
    speedSelect.addEventListener('change', () => {
        player.setPlaybackRate(parseFloat(speedSelect.value));
    });
    musicMenuContainer.appendChild(speedSelect);

    // Track progress bar
    const progressContainer = document.createElement('div');
    const progressBar = document.createElement('input');
    progressBar.type = 'range';
    progressBar.min = '0';
    progressBar.max = '100';
    progressBar.value = '0';
    progressBar.style.width = '100%';
    progressBar.style.marginBottom = '10px';
    progressBar.disabled = true;

    progressBar.addEventListener('input', () => {
        const time = (progressBar.value / 100) * player.getDuration();
        player.seekTo(time);
    });

    progressContainer.appendChild(progressBar);
    musicMenuContainer.appendChild(progressContainer);

    // Song duration display
    const durationDisplay = document.createElement('div');
    durationDisplay.textContent = 'thời gian: 0:00 / 0:00';
    durationDisplay.style.textAlign = 'center';
    musicMenuContainer.appendChild(durationDisplay);

    // List of music genres and their YouTube links
      const musicList = [
        { name: 'chill', url: 'https://www.youtube.com/watch?v=PifAHkKlP8E&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=115&ab_channel=%F0%9D%9A%85%F0%9D%9A%92%F0%9D%9A%98%F0%9D%9A%95%F0%9D%9A%8E%F0%9D%9A%9D%F0%9D%9A%9D%F0%9D%9A%8E' },
        { name: 'The Right Path', url: 'https://www.youtube.com/watch?v=o_Figo57l8s&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=114&ab_channel=KainRecordings' },
        { name: 'Glass Animals', url: 'https://www.youtube.com/watch?v=6APgzehjAQM&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=113' },
        { name: 'chill 2', url: 'https://www.youtube.com/watch?v=LAMNfW9v2t0&list=PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph' },
        { name: 'chill 3', url: 'https://www.youtube.com/watch?v=AQbvCfRCFvg&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=111&pp=gAQBiAQB8AUB' },
        { name: 'Darkside', url: 'https://www.youtube.com/watch?v=AIikYWUbAB0&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=110' },
        { name: 'lovely', url: 'https://www.youtube.com/watch?v=0Ghcjygr66g&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=106' },
        { name: 'chill 4', url: 'https://www.youtube.com/watch?v=5yaTVGSXAMc&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=103' },
        { name: 'chill 5', url: 'https://www.youtube.com/watch?v=Y6AiKryrDyk&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=104&pp=gAQBiAQB8AUB' },
        { name: 'I Want You to Know', url: 'https://www.youtube.com/watch?v=iwPEPqNerPY&ab_channel=BeatPanda' },
        { name: 'Tháng Năm Không Quên', url: 'https://www.youtube.com/watch?v=g3s-OdZazbQ&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=102' },
        { name: 'Bài Hát Liên Quân', url: 'https://www.youtube.com/watch?v=CxXN5DmI9s4&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=101' },
        { name: 'DDTank - Tết Nhà Bà Hoan Parody ', url: 'https://www.youtube.com/watch?v=NRRs9HyfNMc&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=95' },
        { name: 'Legendary', url: 'https://www.youtube.com/watch?v=cTlshvPrIZo&list=RDQMBlegB1oalTw&index=19' },
        { name: 'ĐẾ VƯƠNG', url: 'https://www.youtube.com/watch?v=qkPgUgkQE4Y&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=93' },
        { name: 'Lost Sky', url: 'https://www.youtube.com/watch?v=L7kF4MXXCoA&list=RDQMBlegB1oalTw&index=21' },
        { name: 'Tướng Quân ', url: 'https://www.youtube.com/watch?v=U-hAhjg56HU&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=92' },
        { name: 'candyland', url: 'https://www.youtube.com/watch?v=IhchfhxvPKI&ab_channel=Tobu' },
        { name: 'Vicetone - Nevada', url: 'https://www.youtube.com/watch?v=AnMhdn0wJ4I&list=RDQMBlegB1oalTw&index=25' },
        { name: 'Believer ', url: 'https://www.youtube.com/watch?v=FXqp9WiFWzc&list=RDQMBlegB1oalTw&index=17' },
        { name: 'On & On', url: 'https://www.youtube.com/watch?v=XsZZQPKLChY&list=RDQMBlegB1oalTw&index=15' },
        { name: '💋💜Nevada💜💋', url: 'https://www.youtube.com/watch?v=bLrOTFDU2ZI&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=109&ab_channel=Detective.J' },
        { name: 'Legends Never Die', url: 'https://www.youtube.com/watch?v=r6zIGXun57U&list=RDQMBlegB1oalTw&index=3' },
        { name: 'nevada', url: 'https://www.youtube.com/watch?v=2jzxIOCYzEM&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=108&ab_channel=Jarctix' },
        { name: 'chill 6', url: 'https://www.youtube.com/watch?v=ZzbYaDHkObY&list=RDQMBlegB1oalTw&index=5' },
        { name: 'chill 7', url: 'https://www.youtube.com/watch?v=9pO-Cuq7R1Y&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=91&ab_channel=%23phuongmusic.' },
        { name: 'chill 8', url: 'https://www.youtube.com/watch?v=o85fLo47FUE&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=90&pp=gAQBiAQB8AUB' },
        { name: 'chill 9', url: 'https://www.youtube.com/watch?v=NHDKk1QyfhM&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=89&pp=gAQBiAQB8AUB' },
        { name: 'chill 10', url: 'https://www.youtube.com/watch?v=WKtJ7tVgxxs&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=88&pp=gAQBiAQB8AUB' },
        { name: 'chill 11', url: 'https://www.youtube.com/watch?v=kkRqgK6GOWs&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=86&pp=gAQBiAQB8AUB' },
        { name: 'chill 12', url: 'https://www.youtube.com/watch?v=kkRqgK6GOWs&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=86&pp=gAQBiAQB8AUB' },
        { name: 'chill 13', url: 'https://www.youtube.com/watch?v=xZhkxpwkYiA&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=84&pp=gAQBiAQB8AUB' },
        { name: 'chill 14', url: 'https://www.youtube.com/watch?v=_0FI0jVeNUQ&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=83&pp=gAQBiAQB8AUB' },
        { name: 'chill 15', url: 'https://www.youtube.com/watch?v=w35LzCA0YLY&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=82&pp=gAQBiAQB8AUB' },
        { name: 'chill 16', url: 'https://www.youtube.com/watch?v=40EAqsXibhM&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=81&pp=gAQBiAQB8AUB' },
        { name: 'chill 17', url: 'https://www.youtube.com/watch?v=J4L-1FLXVLM&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=80&pp=gAQBiAQB8AUB' },
        { name: 'chill 18', url: 'https://www.youtube.com/watch?v=_7G-E0N9D0w&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=79&pp=gAQBiAQB8AUB' },
        { name: 'chill 19', url: 'https://www.youtube.com/watch?v=-my-C09BdPc&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=77&pp=gAQBiAQB8AUB' },
        { name: 'chill 20', url: 'https://www.youtube.com/watch?v=bb5ucM01Em0&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=76&pp=gAQBiAQB8AUB' },
        { name: 'chill 21', url: 'https://www.youtube.com/watch?v=7ld_7tRuasg&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=75&pp=gAQBiAQB8AUB' },
        { name: 'chill 22', url: 'https://www.youtube.com/watch?v=b0vf8CAh82c&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=73&pp=gAQBiAQB8AUB' },
        { name: 'chill 23', url: 'https://www.youtube.com/watch?v=ocfOBZSOwGc&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=72&pp=gAQBiAQB8AUB' },
        { name: 'chill 24', url: 'https://www.youtube.com/watch?v=caf7T4AubSE&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=71&pp=gAQBiAQB8AUB' },
        { name: 'chill 25', url: 'https://www.youtube.com/watch?v=ZhGWQuqE758&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=65&pp=gAQBiAQB8AUB' },
        { name: 'chill 26', url: 'https://www.youtube.com/watch?v=h3aWuBzimTk&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=66&pp=gAQBiAQB8AUB' },
        { name: 'chill 27', url: 'https://www.youtube.com/watch?v=RKF4Tn7P-MQ&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=63&pp=gAQBiAQB8AUB' },
        { name: 'chill 28', url: 'https://www.youtube.com/watch?v=7bLDnULTyaA&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=61&pp=gAQBiAQB8AUB' },
        { name: 'Run Free', url: 'https://www.youtube.com/watch?v=o3KXwe-7A-I&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=60&ab_channel=ATLAST' },
        { name: 'Shadow Of The Sun', url: 'https://www.youtube.com/watch?v=HsM9VucuCtw&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=59&ab_channel=AZURA' },
        { name: 'Cưới Thôi', url: 'https://www.youtube.com/watch?v=JOWqEpONn9w&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=58' },
        { name: 'Ấn Nút Nhớ Thả Giấc Mơ', url: 'https://www.youtube.com/watch?v=sSljdfttEl8&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=58&ab_channel=N26Music%E2%99%AA' },
        { name: 'huan BACK HOME', url: 'https://www.youtube.com/watch?v=8Tx36l5MGxg&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=55&pp=gAQBiAQB8AUB' },
        { name: 'WAY BACK HOME', url: 'https://www.youtube.com/watch?v=1kehqCLudyg&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=54&pp=gAQBiAQB8AUB' },
        { name: 'THAT GIRL', url: 'https://www.youtube.com/watch?v=OUtbNopS4xU&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=53&pp=gAQBiAQB8AUB' },
        { name: 'PRETTY GIRL', url: 'https://www.youtube.com/watch?v=ptIXwyxf7XQ&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=52&pp=gAQBiAQB8AUB' },
        { name: 'DREAM-SAVE ME', url: 'https://www.youtube.com/watch?v=rREz6DYDXng&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=48&pp=gAQBiAQB8AUB' },
        { name: 'ALAN- PLAY', url: 'https://www.youtube.com/watch?v=YQRHrco73g4&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=44&pp=gAQBiAQB8AUB' },
        { name: 'NHAC REVIEW PHIM', url: 'https://www.youtube.com/watch?v=ialVTirpQ5Q&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=43&pp=gAQBiAQB8AUB' },
        { name: 'LOVE IS GONE', url: 'https://www.youtube.com/watch?v=c6SZy7miyaY&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=42&pp=gAQBiAQB8AUB' },
        { name: 'MONODY', url: 'https://www.youtube.com/watch?v=1MZR0BEniIY&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=36&pp=gAQBiAQB8AUB' },
        { name: 'STEORT HEAL', url: 'https://www.youtube.com/watch?v=Y1pq2oLXbTQ&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=33&pp=gAQBiAQB8AUB' },
        { name: 'CLOSE THE SUN', url: 'https://www.youtube.com/watch?v=VyXm3GTdNf0' },
        { name: 'PSYCHO', url: 'https://www.youtube.com/watch?v=YvLRu5vcr68' },
        { name: 'Yami', url: 'https://www.youtube.com/watch?v=eTgxYFXP1hc&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=14&ab_channel=C%C3%A0Chua' },
        { name: 'RETUNR', url: 'https://www.youtube.com/watch?v=m4Hg_JMtJqI&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=15&pp=gAQBiAQB8AUB' },
        { name: 'TOP EDM', url: 'https://www.youtube.com/watch?v=xlTZywrfO7E&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=17&pp=gAQBiAQB8AUB' },
        { name: 'HIS THEME', url: 'https://www.youtube.com/watch?v=qOpsp9bJFP4&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=12&pp=gAQBiAQB8AUB' },
        { name: 'CHILL 29', url: 'https://www.youtube.com/watch?v=ybgvaC4rfAE&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&ab_channel=%F0%9D%90%92%F0%9D%90%9A%F0%9D%90%9D%F0%9D%90%82%F0%9D%90%A1%F0%9D%90%A2%F0%9D%90%A5%F0%9D%90%A5-%F0%9D%90%94%F0%9D%90%92%F0%9D%90%94%F0%9D%90%8A' },
        { name: 'CHILL 30', url: 'https://www.youtube.com/watch?v=-GDI6oT6Jp8&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=2&pp=gAQBiAQB8AUB' },
        { name: 'CHILL 31', url: 'https://www.youtube.com/watch?v=6LW7tcryoXs&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=3&pp=gAQBiAQB8AUB' },
        { name: 'CHILL 32', url: 'https://www.youtube.com/watch?v=6LW7tcryoXs&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=3&pp=gAQBiAQB8AUB' },
        { name: 'CHILL 33', url: 'https://www.youtube.com/watch?v=6I5gYHn-QOk&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=4&pp=gAQBiAQB8AUB' },
        { name: 'CHILL 34', url: 'https://www.youtube.com/watch?v=5sG4k7rj6MY&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=5&pp=gAQBiAQB8AUB' },
        { name: 'CHILL 35', url: 'https://www.youtube.com/watch?v=0wsMSc5hDQg&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=6&pp=gAQBiAQB8AUB' },
        { name: 'CHILL 36', url: 'https://www.youtube.com/watch?v=5TZ33vy_v5w&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=7&pp=gAQBiAQB8AUB' },
        { name: 'CHILL 37', url: 'https://www.youtube.com/watch?v=5TZ33vy_v5w&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=7&pp=gAQBiAQB8AUB' },
        { name: 'CHILL 38', url: 'https://www.youtube.com/watch?v=gfsUC3F8pYA&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=8&pp=gAQBiAQB8AUB' },
        { name: 'CHILL 39', url: 'https://www.youtube.com/watch?v=gfsUC3F8pYA&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=8&pp=gAQBiAQB8AUB' },
        { name: 'CHILL 40', url: 'https://www.youtube.com/watch?v=zFx0o4epvPA&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=9&pp=gAQBiAQB8AUB' },
        { name: 'intro ( real love )', url: 'https://www.youtube.com/watch?v=66nH4dXp_-o' },
        { name: 'in the end', url: 'https://www.youtube.com/watch?v=WNeLUngb-Xg' },
        { name: '花火が瞬く夜に', url: 'https://www.youtube.com/watch?v=xZ5Rrrul7h8' },
        { name: 'Melancholy', url: 'https://www.youtube.com/watch?v=RxglYGHuqFc' },
        { name: '只要和你 坐着不说话也觉得浪漫', url: 'https://www.youtube.com/watch?v=DzbesIaB3Y0' },
        { name: 'windy hill', url: 'https://www.youtube.com/watch?v=qV97ux4NA28&pp=ygUKd2luZHkgaGlsbA%3D%3D' },
        { name: '海底 của 一支榴莲', url: 'https://www.youtube.com/watch?v=v5gK8np-OTA' },
        { name: '下辈子还要和你成个家', url: 'https://www.youtube.com/watch?v=6CMITr9dTws' },
        { name: 'past lives', url: 'https://www.youtube.com/watch?v=iNa1n6Gch7E' },
        { name: 'lovely', url: 'https://www.youtube.com/watch?v=8VLXHyHRXjc&pp=ygUGbG92ZWx5' },
        { name: '送给未来的你', url: 'https://www.youtube.com/watch?v=iQfIcgA8qHg' },
        { name: '刚好遇见你 sieu hay', url: 'https://www.youtube.com/watch?v=aEhq4WxBYqM' },
        { name: 'ALAN 2', url: 'https://www.youtube.com/watch?v=jlQ2hs0EANo' },
        { name: 'top chil tq', url: 'https://www.youtube.com/watch?v=2EmGToTikIY' },
        { name: 'My Sunset', url: 'https://www.youtube.com/watch?v=GpkHJlyV7TQ' },
        { name: 'Nụ Cười Của Cô Ấy', url: 'https://www.youtube.com/watch?v=wvkGE4mtTB0' },
        { name: 'Lifeline', url: 'https://www.youtube.com/watch?v=rWTmSHXVfCM' },
        { name: 'dancing with your ghost', url: 'https://www.youtube.com/watch?v=emm0uGDGg2o' },
        { name: 'shape of you', url: 'https://www.youtube.com/watch?v=Ksin3zNXvzo' },
        { name: 'seasons', url: 'https://www.youtube.com/watch?v=Ymts4ldfPws' },
        { name: 'L.I.F.E', url: 'https://www.youtube.com/watch?v=_tSWg-KOslM' },
        { name: 'summersong', url: 'https://www.youtube.com/watch?v=HoCw_gaCHXE' },
        { name: '芒种" (Mang Chủng)', url: 'https://www.youtube.com/watch?v=vgbrIy08e2w' },
        { name: 'china-X', url: 'https://www.youtube.com/watch?v=qgVXS8l5smo' },
        { name: 'breathe', url: 'https://www.youtube.com/watch?v=KbT-qpE3Kl4' },
        { name: 'dynasty', url: 'https://www.youtube.com/watch?v=5OESzopq3dE' },
        { name: 'Giày Cao Gót Màu Đỏ', url: 'https://www.youtube.com/watch?v=NygnIPFch-M' },
        { name: '20 EDM tq', url: 'https://www.youtube.com/watch?v=IAMbG8OiExU' },
        { name: 'top nhac', url: 'https://www.youtube.com/watch?v=u5WZnV3AoA4' },
        { name: 'Closer', url: 'https://www.youtube.com/watch?v=PT2_F-1esPk&ab_channel=ChainsmokersVEVO' },
        { name: 'dusk till dawn', url: 'https://www.youtube.com/watch?v=p-eS-_olx9M&ab_channel=7clouds' },
        { name: 'Mood ', url: 'https://www.youtube.com/watch?v=f1J4dRTMy9A&ab_channel=7clouds' },
        { name: 'royalty', url: 'https://www.youtube.com/watch?v=oOi3oJmfz4o&ab_channel=7clouds' },
        { name: 'Nova', url: 'https://www.youtube.com/watch?v=Rq-0NxKUR-Y&ab_channel=SrMichi' },
        { name: 'Fight', url: 'https://www.youtube.com/watch?v=EVpm3pHYaV4&ab_channel=BeatBrothers' },
        { name: 'First Date', url: 'https://www.youtube.com/watch?v=AVK0BIVqLLc&ab_channel=frad' },
        { name: 'Vacation', url: 'https://www.youtube.com/watch?v=TidRG-baYi8&ab_channel=Nh%E1%BA%ADtH%E1%BA%A3oTr%E1%BA%A7n' },
        { name: 'anh thanh niên', url: 'https://www.youtube.com/watch?v=HPL74s4VPdk&pp=ygUPYW5oIHRoYW5oIG5pw6pu' },
        { name: 'kẹo bông ngòn ', url: 'https://www.youtube.com/watch?v=sHa5nQO3jwA&ab_channel=H2KMusic' },
        { name: 'Mây x Gió', url: 'https://www.youtube.com/watch?v=0A6hCfFZVj4&ab_channel=DuzmeMusic' },
        { name: 'spectre', url: 'https://www.youtube.com/watch?v=wJnBTPUQS5A' },
        { name: 'alone', url: 'https://www.youtube.com/watch?v=1-xGerv5FOk' },
        { name: 'faded', url: 'https://www.youtube.com/watch?v=60ItHLz5WEA' },
        { name: 'chill 41', url: 'https://www.youtube.com/watch?v=4vayrx6PFCQ&ab_channel=AGNES%F0%9F%94%A5' },
        { name: 'chill 42', url: 'https://www.youtube.com/watch?v=icxO53ZyK7A' },
        { name: 'chill 43', url: 'https://www.youtube.com/watch?v=AQbvCfRCFvg' },
        { name: 'On my way', url: 'https://www.youtube.com/watch?v=ETqXUBFZpkE&ab_channel=LOFI_LINES' },
        { name: 'Nothin On Me', url: 'https://www.youtube.com/watch?v=qmbB3uR92j8&ab_channel=H%E1%BB%A7Mu%E1%BB%91iM%E1%BA%B7n' },
        { name: 'PIXELS', url: 'https://www.youtube.com/watch?v=EUyQgyzpAbE&ab_channel=brianjcb' },
        { name: 'Nothing on you', url: 'https://www.youtube.com/watch?v=U573mlR4rYw&ab_channel=DuskMusicASIA' },
        { name: 'So Far Away ', url: 'https://www.youtube.com/watch?v=rA0jSPEoyk4&ab_channel=ITMMUSIC' },
        { name: 'sold out', url: 'https://www.youtube.com/watch?v=clKvFcl0zwo&ab_channel=LyricsMusic' },
        { name: 'the way still love you', url: 'https://www.youtube.com/watch?v=MsBEu1iWsF4&ab_channel=TopTikTok' },
        { name: 'Phonecert mashup', url: 'https://www.youtube.com/watch?v=3onAOL9dY1o&list=LL&index=2&ab_channel=RemixTV' },
        { name: 'top tq sieu chill', url: 'https://www.youtube.com/watch?v=TmRvke5Ue-k&ab_channel=Tr.T.Kh%C3%A1nhHuy%E1%BB%81n' },
        { name: 'Reverse溯 (版钢琴', url: 'https://www.youtube.com/watch?v=v7xRVTXWkbU&ab_channel=HyQMusic%E3%83%84' },
        { name: 'DEATH BED', url: 'https://www.youtube.com/watch?v=jJPMnTXl63E&list=PLB8Tk-JabtWed_6pE4H7yqctxbntnjwEe&index=10&pp=gAQBiAQB8AUB' }
    ];


    let currentPlayingID = null;
    let currentButton = null;

    // Initialize music list
    const musicItemContainer = document.createElement('div');
    musicList.forEach(music => addMusicButton(music));
    musicMenuContainer.appendChild(musicItemContainer);
    document.body.appendChild(musicMenuContainer);

    function addMusicButton(music) {
        const musicItem = document.createElement('div');
        musicItem.style.display = 'flex';
        musicItem.style.alignItems = 'center';
        musicItem.style.marginBottom = '10px';

        const musicButton = createButton(music.name + ' (nghe thử xem)', 'rgba(0, 255, 255, 0.5)');

        musicButton.addEventListener('click', () => {
            playMusic(music, musicButton);
        });

        musicItem.appendChild(musicButton);
        musicItemContainer.appendChild(musicItem);
    }

    // Play the selected music
    function playMusic(music, musicButton) {
        if (currentPlayingID && currentButton) {
            player.stopVideo();
            currentButton.textContent = currentButton.textContent.replace(' (Playing)', ' (Play)');
            currentButton.style.color = '#fff'; // Reset color
        }
        const videoID = extractVideoID(music.url);
        if (videoID) {
            player.loadVideoById(videoID);
            player.playVideo();
            currentPlayingID = videoID;
            currentButton = musicButton;
            musicButton.textContent = music.name + ' (Chill nào)';
            musicButton.style.color = 'lightgreen'; // Change color to light green when playing
        }
    }

    // Create buttons for volume, speed, etc.
    function createButton(text, bgColor) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.width = '100%';
        button.style.padding = '10px';
        button.style.backgroundColor = bgColor;
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = bgColor;
        });

        return button;
    }

    // Create a slider
    function createSlider(min, max, defaultValue) {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = defaultValue;
        slider.style.width = '100%';
        slider.style.marginBottom = '10px';
        return slider;
    }

    // Create a select dropdown
    function createSelect(options, suffix) {
        const select = document.createElement('select');
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = `${option}${suffix}`;
            select.appendChild(opt);
        });
        select.style.width = '100%';
        return select;
    }

    // Create Pause/Play Button
    const pauseButton = createButton('TẠM DỪNG', 'rgba(0, 255, 0, 0.5)');
    pauseButton.addEventListener('click', () => {
        if (currentPlayingID) {
            const state = player.getPlayerState();
            if (state === YT.PlayerState.PLAYING) {
                player.pauseVideo();
                pauseButton.textContent = 'BẮT ĐẦU '; // Change to play
            } else {
                player.playVideo();
                pauseButton.textContent = 'TẠM DỪNG'; // Change to pause
            }
        }
    });
    musicMenuContainer.appendChild(pauseButton);

    // Create Random Play Button
    const randomPlayButton = createButton('ngẫu nhiên BÀI NHẠC', 'rgba(255, 0, 255, 0.5)');
    randomPlayButton.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * musicList.length);
        playMusic(musicList[randomIndex], randomPlayButton);
    });
    musicMenuContainer.appendChild(randomPlayButton);

    // Create Stop Music button
    const stopButton = createButton('Dừng nhạc', 'rgba(255, 0, 0, 0.5)');
    stopButton.addEventListener('click', () => {
        if (currentPlayingID) {
            player.stopVideo();
            currentPlayingID = null;
            if (currentButton) {
                currentButton.textContent = currentButton.textContent.replace(' (Playing)', ' (Play)');
                currentButton.style.color = '#fff'; // Reset color
            }
        }
    });
    musicMenuContainer.appendChild(stopButton);

    // Create an invisible player container
    const playerContainer = document.createElement('div');
    playerContainer.id = 'musicPlayer';
    playerContainer.style.position = 'fixed';
    playerContainer.style.bottom = '0';
    playerContainer.style.right = '0';
    playerContainer.style.width = '0';
    playerContainer.style.height = '0';
    document.body.appendChild(playerContainer);

    // Load YouTube IFrame Player API
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Create YouTube player
    let player;
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('musicPlayer', {
            height: '0',
            width: '0',
            videoId: '',
            playerVars: { 'autoplay': 1, 'controls': 0, 'mute': 0 },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    function onPlayerReady(event) {
        console.log('YouTube Player is ready');
    }

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            updateDurationDisplay();
            setInterval(updateProgressBar, 1000);
        }
    }

    // Update duration display and progress bar
    function updateDurationDisplay() {
        const duration = player.getDuration();
        durationDisplay.textContent = `Duration: ${formatTime(player.getCurrentTime())} / ${formatTime(duration)}`;
        progressBar.max = duration;
    }

    // Update progress bar
    function updateProgressBar() {
        if (player && currentPlayingID) {
            progressBar.value = player.getCurrentTime();
            updateDurationDisplay();
        }
    }

    // Format time in MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
    }

    // Function to extract video ID from YouTube URL
    function extractVideoID(url) {
        const videoIDMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return videoIDMatch ? videoIDMatch[1] : null;
    }

    // Hide music menu with Esc key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            musicMenuContainer.style.display = musicMenuContainer.style.display === 'block' ? 'none' : 'block';
        }
        if (event.key === ']') {
            musicMenuContainer.style.display = musicMenuContainer.style.display === 'block' ? 'none' : 'block';
        }
        if (event.key === '') { // Space for play/pause
            pauseButton.click();
        }
        if (event.key === '') { // '' key to stop
            stopButton.click();
        }
    });

    // Show the music menu initially (optional)
    musicMenuContainer.style.display = 'block';

})();
(function () {
    'use strict';

    const menu = document.createElement('div');
    menu.id = 'music-menu';
    menu.style.position = 'fixed';
    menu.style.top = '0';
    menu.style.right = '-300px';
    menu.style.width = '250px';
    menu.style.height = '100%';
    menu.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    menu.style.color = '#fff';
    menu.style.fontFamily = 'Arial, sans-serif';
    menu.style.padding = '20px';
    menu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    menu.style.transition = 'right 0.5s ease';
    menu.style.zIndex = '10000';
    menu.innerHTML = `
        <h2 style="text-align: center;" id="music-menu-title">Hudební menu</h2>
        <label for="music-url" id="music-url-label">URL písničky (YouTube):</label>
        <input id="music-url" type="text" style="width: 100%; margin-bottom: 10px; padding: 5px;" placeholder="cho link ytb vào đây....">
        <label for="start-time" id="start-time-label">Start Time Seconds...):</label>
        <input id="start-time" type="number" style="width: 100%; margin-bottom: 10px; padding: 5px;" placeholder="giây...">
        <button id="play-music" style="width: 100%; padding: 10px; margin-bottom: 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer; font-size: 16px; font-weight: bold; border-radius: 5px;">Přehrát písničku</button>
        <button id="start-video" style="width: 100%; padding: 10px; margin-bottom: 10px; background-color: #2196F3; color: white; border: none; cursor: pointer; font-size: 16px; font-weight: bold; border-radius: 5px;">START VIDEO</button>
        <button id="stop-music" style="width: 100%; padding: 10px; background-color: #f44336; color: white; border: none; cursor: pointer; font-size: 16px; font-weight: bold; border-radius: 5px;">Zastavit</button>
        <div id="video-container" style="margin-top: 20px; display: none;">
            <iframe id="video-frame" width="100%" height="200" style="border: none;" src="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div id="player" style="margin-top: 20px; display: none;"></div>
        <div id="warning" style="margin-top: 20px; color: red; font-weight: bold;">
            <p id="adblock-warning">POUŽITÍ ADBLOCKU VEDE K NEFUNKČNOSTI VYPNITE HO</p>
            <label for="language-select" style="color: white;">Language:</label>
            <select id="language-select" style="width: 100%; padding: 5px;">
                <option value="cz">Čeština</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
                <option value="vi">Tiếng Việt</option>
                <option value="ar">العربية</option>
            </select>
        </div>
        <div style="margin-top: 20px; text-align: center; font-weight: bold; color: #FFEB3B;">
            Script By <a href="https://www.youtube.com/@RektByMateX" target="_blank" style="color: #FF4081; font-weight: bold; text-decoration: underline;">RektByMateX</a>
        </div>
        <div style="margin-top: 20px; text-align: center; font-weight: bold; color: #FFEB2B;">
           truy cập nhanh (quick access)
        </div>
        <div style="margin-top: 20px; text-align: center; font-weight: bold; color: #FFEB3B;">
            1 <a href="https://www.youtube.com" target="_blank" style="color: #FF4081; font-weight: bold; text-decoration: underline;">youtube</a>
        </div>
        <div style="margin-top: 20px; text-align: center; font-weight: bold; color: #FFEB3B;">
            2 <a href="https://translate.google.com" target="_blank" style="color: #FF4081; font-weight: bold; text-decoration: underline;">translate.google</a>
        </div>
        <div style="margin-top: 20px; text-align: center; font-weight: bold; color: #FFEB3B;">
            3 <a href="https://facebook.com" target="_blank" style="color: #FF4081; font-weight: bold; text-decoration: underline;">facebook</a>
        </div>
        <div style="margin-top: 20px; text-align: center; font-weight: bold; color: #FFEB3B;">
            4 <a href="https://discord.com/channels/@me" target="_blank" style="color: #FF4081; font-weight: bold; text-decoration: underline;">discord</a>
        </div>
        <div style="margin-top: 20px; text-align: center; font-weight: bold; color: #FFEB3B;">
            5 <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" target="_blank" style="color: #FF4081; font-weight: bold; text-decoration: underline;">hmmmmmm</a>
        </div>
    `;
    document.body.appendChild(menu);

    let menuVisible = false;
    function toggleMenu() {
        menu.style.right = menuVisible ? '-300px' : '0';
        menuVisible = !menuVisible;
        console.log('Menu visible:', menuVisible);  // Debugging line
    }

    let player;
    function createYouTubePlayer(videoId, startTime) {
        if (!player) {
            player = new YT.Player('player', {
                height: '0',
                width: '0',
                videoId: videoId,
                playerVars: { autoplay: 1, start: startTime },
                events: {
                    onReady: (event) => {
                        event.target.playVideo();
                    }
                }
            });
        } else {
            player.loadVideoById(videoId, startTime);
        }
    }

    function stopYouTubePlayer() {
        if (player) {
            player.stopVideo();
        }
        const iframe = document.getElementById('video-frame');
        iframe.src = '';
        document.getElementById('player').style.display = 'none';
        document.getElementById('video-container').style.display = 'none';
    }

    document.getElementById('play-music').addEventListener('click', () => {
        const url = document.getElementById('music-url').value;
        const startTime = parseInt(document.getElementById('start-time').value) || 0;
        const videoId = extractYouTubeVideoId(url);
        if (videoId) {
            createYouTubePlayer(videoId, startTime);
            document.getElementById('player').style.display = 'block';
            document.getElementById('video-container').style.display = 'none';
        } else {
            alert('Neplatný YouTube odkaz.');
        }
    });

    document.getElementById('start-video').addEventListener('click', () => {
        const url = document.getElementById('music-url').value;
        const startTime = parseInt(document.getElementById('start-time').value) || 0;
        const videoId = extractYouTubeVideoId(url);
        if (videoId) {
            const iframe = document.getElementById('video-frame');
            iframe.src = `https://www.youtube.com/embed/${videoId}?start=${startTime}&autoplay=1`;
            document.getElementById('video-container').style.display = 'block';
            document.getElementById('player').style.display = 'none';
        } else {
            alert('Neplatný YouTube odkaz.');
        }
    });

    document.getElementById('stop-music').addEventListener('click', () => {
        stopYouTubePlayer();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === '[') {
            toggleMenu();
        }
        if (e.key.toLowerCase() === '`') {
            toggleMenu();
        }
    });

    function extractYouTubeVideoId(url) {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    }

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);

    document.getElementById('language-select').addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });

    function changeLanguage(language) {
        const translations = {
            cz: {
                'music-menu-title': 'Hudební menu',
                'music-url-label': 'URL písničky (YouTube):',
                'start-time-label': 'Začátek (sekundy):',
                'play-music': 'Přehrát písničku',
                'start-video': 'Spustit Video',
                'stop-music': 'Zastavit',
                'adblock-warning': 'POUŽITÍ ADBLOCKU VEDE K NEFUNKČNOSTI VYPNITE HO',
                'language-btn': 'Vyberte jazyk'
            },
            en: {
                'music-menu-title': 'Music Menu',
                'music-url-label': 'Song URL (YouTube):',
                'start-time-label': 'Start time (seconds):',
                'play-music': 'Play Song',
                'start-video': 'START VIDEO',
                'stop-music': 'Stop',
                'adblock-warning': 'USING ADBLOCK CAUSES FAILURE, PLEASE DISABLE IT',
                'language-btn': 'Languages'
            },
            ru: {
                'music-menu-title': 'Музыкальное меню',
                'music-url-label': 'URL песни (YouTube):',
                'start-time-label': 'Время начала (секунды):',
                'play-music': 'Воспроизвести песню',
                'start-video': 'Запустить видео',
                'stop-music': 'Остановить',
                'adblock-warning': 'Использование Adblock вызывает сбой, пожалуйста, отключите его',
                'language-btn': 'Языки'
            },
            vi: {
                'music-menu-title': 'Menu Nhạc',
                'music-url-label': 'URL bài hát (YouTube):',
                'start-time-label': 'Thời gian bắt đầu (giây):',
                'play-music': 'Phát bài hát',
                'start-video': 'Bắt đầu Video',
                'stop-music': 'Dừng',
                'adblock-warning': 'SỬ DỤNG ADBLOCK GÂY LỖI, VUI LÒNG TẮT NÓ',
                'language-btn': 'Ngôn ngữ'
            },
            ar: {
                'music-menu-title': 'قائمة الموسيقى',
                'music-url-label': 'رابط الأغنية (YouTube):',
                'start-time-label': 'وقت البداية (ثواني):',
                'play-music': 'تشغيل الأغنية',
                'start-video': 'تشغيل الفيديو',
                'stop-music': 'إيقاف',
                'adblock-warning': 'استخدام Adblock يؤدي إلى عطل ، يرجى تعطيله',
                'language-btn': 'اللغات'
            }
        };

        const text = translations[language] || translations.en;
        document.getElementById('music-menu-title').textContent = text['music-menu-title'];
        document.getElementById('music-url-label').textContent = text['music-url-label'];
        document.getElementById('start-time-label').textContent = text['start-time-label'];
        document.getElementById('play-music').textContent = text['play-music'];
        document.getElementById('start-video').textContent = text['start-video'];
        document.getElementById('stop-music').textContent = text['stop-music'];
        document.getElementById('adblock-warning').textContent = text['adblock-warning'];
        document.getElementById('language-btn').textContent = text['language-btn'];
    }
})();
(function () {
    'use strict'
    const POLL_INTERVAL = 1000
    const HUE_RANGE = 120 // Hue range for the gradient (green to red or red to green)
    const SATURATION = '80%'
    const LIGHTNESS = '88%'
    function applyGradientToColumn(table, column) {
        const rowCount = table.rows.length
        Array.from(table.rows).forEach((row, index) => {
            const cell = row.cells[column]
            if (!cell) return
            // Calculate a hue based on the row index (no need to rely on cell content)
            const hue = (index / (rowCount - 1)) * HUE_RANGE
            // Apply the gradient color to the cell
            cell.style.backgroundColor = `hsl(${HUE_RANGE - hue}, ${SATURATION}, ${LIGHTNESS})`
        })
    }
    function initializeTable(table) {
        if (table.hasAttribute('data-gradient-initialized')) return
        table.setAttribute('data-gradient-initialized', 'true')
        const columnCount = table.rows[0]?.cells.length || 0
        for (let col = 0; col < columnCount; col++) {
            applyGradientToColumn(table, col)
        }
    }
    function initializeTables() {
        document.querySelectorAll('table:not([data-gradient-initialized])').forEach(initializeTable)
    }
    // Initial call and setup interval to handle dynamically loaded tables
    initializeTables()
    setInterval(initializeTables, POLL_INTERVAL)
})();
(function () {
    'use strict';
  function getOverlapScore(el) {
    var rect = el.getBoundingClientRect();
    return (
      Math.min(
        rect.bottom,
        window.innerHeight || document.documentElement.clientHeight
      ) - Math.max(0, rect.top)
    );
  }

  function getVideoIdFromVideoElement(video) {
    try {
      for (let k in video.parentElement) {
        if (k.startsWith("__reactProps")) {
          return video.parentElement[k].children.props.videoFBID;
        }
      }
    } catch (e) {
      return null;
    }
  }

  async function getWatchingVideoId() {
    let allVideos = Array.from(document.querySelectorAll("video"));
    let result = [];

    for (let video of allVideos) {
      let videoId = getVideoIdFromVideoElement(video);
      if (videoId) {
        result.push({
          videoId,
          overlapScore: getOverlapScore(video),
          playing: !!(
            video.currentTime > 0 &&
            !video.paused &&
            !video.ended &&
            video.readyState > 2
          ),
        });
      }
    }

    // if there is playing video => return that
    let playingVideo = result.find((_) => _.playing);
    if (playingVideo) return [playingVideo.videoId];

    // else return all videos in-viewport
    return result
      .filter((_) => _.videoId && (_.overlapScore > 0 || _.playing))
      .sort((a, b) => b.overlapScore - a.overlapScore)
      .map((_) => _.videoId);
  }

  async function getVideoUrlFromVideoId(videoId) {
    let dtsg = await getDtsg();
    try {
      return await getLinkFbVideo2(videoId, dtsg);
    } catch (e) {
      return await getLinkFbVideo1(videoId, dtsg);
    }
  }

  async function getLinkFbVideo2(videoId, dtsg) {
    let res = await fetch(
      "https://www.facebook.com/video/video_data_async/?video_id=" + videoId,
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: stringifyVariables({
          __a: "1",
          fb_dtsg: dtsg,
        }),
      }
    );

    let text = await res.text();
    text = text.replace("for (;;);", "");
    let json = JSON.parse(text);

    const { hd_src, hd_src_no_ratelimit, sd_src, sd_src_no_ratelimit } =
      json?.payload || {};

    return hd_src_no_ratelimit || hd_src || sd_src_no_ratelimit || sd_src;
  }

  async function getLinkFbVideo1(videoId, dtsg) {
    let res = await fetchGraphQl("5279476072161634", {
      UFI2CommentsProvider_commentsKey: "CometTahoeSidePaneQuery",
      caller: "CHANNEL_VIEW_FROM_PAGE_TIMELINE",
      displayCommentsContextEnableComment: null,
      displayCommentsContextIsAdPreview: null,
      displayCommentsContextIsAggregatedShare: null,
      displayCommentsContextIsStorySet: null,
      displayCommentsFeedbackContext: null,
      feedbackSource: 41,
      feedLocation: "TAHOE",
      focusCommentID: null,
      privacySelectorRenderLocation: "COMET_STREAM",
      renderLocation: "video_channel",
      scale: 1,
      streamChainingSection: !1,
      useDefaultActor: !1,
      videoChainingContext: null,
      videoID: videoId,
    }, dtsg);
    let text = await res.text();

    let a = JSON.parse(text.split("\n")[0]),
      link = a.data.video.playable_url_quality_hd || a.data.video.playable_url;

    return link;
  }

  function fetchGraphQl(doc_id, variables, dtsg) {
    return fetch("https://www.facebook.com/api/graphql/", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: stringifyVariables({
        doc_id: doc_id,
        variables: JSON.stringify(variables),
        fb_dtsg: dtsg,
        server_timestamps: !0,
      }),
    });
  }

  function stringifyVariables(d, e) {
    let f = [],
      a;
    for (a in d)
      if (d.hasOwnProperty(a)) {
        let g = e ? e + "[" + a + "]" : a,
          b = d[a];
        f.push(
          null !== b && "object" == typeof b
            ? stringifyVariables(b, g)
            : encodeURIComponent(g) + "=" + encodeURIComponent(b)
        );
      }
    return f.join("&");
  }

  async function getDtsg() {
    return require("DTSGInitialData").token;
  }

  function downloadURL(url, name) {
    var link = document.createElement("a");
    link.target = "_blank";
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function downloadWatchingVideo() {
    try {
      let listVideoId = await getWatchingVideoId();
      if (!listVideoId?.length > 0) throw Error("No video found in the page");

      console.log(listVideoId)

      for (let videoId of listVideoId) {
        let videoUrl = await getVideoUrlFromVideoId(videoId);
        if (videoUrl) downloadURL(videoUrl, "fb_video.mp4");
      }
    } catch (e) {
      alert("ERROR: " + e);
    }
  }

  function resisterMenuCommand() {
    GM_registerMenuCommand("Download watching video", downloadWatchingVideo);
  }

  resisterMenuCommand();
})();
