// ==UserScript==
// @name         BetterLZT
// @namespace    hasanbet
// @version      v46
// @description  Сделай свой жизнь на LolzTeam проще!
// @author       https://zelenka.guru/lays (openresty)
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @match        https://zelenka.market/*
// @match        https://lolz.market/*
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        unsafeWindow
// @connect      lzt.hasanbek.ru
// @connect      localhost
// @run-at       document-body
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470626/BetterLZT.user.js
// @updateURL https://update.greasyfork.org/scripts/470626/BetterLZT.meta.js
// ==/UserScript==
 
// 5.0.1.1
const
    version         = "5.0 (beta 1)",
    blzt_link_tos   = "https://zelenka.guru/threads/5816508/",
    blzt_link_trust = "https://zelenka.guru/threads/5821466/",
    server          = "http://lzt.hasanbek.ru:8880",
    adlist_w        = ["zelenka.guru/threads/3649746", "http://proxysoxy.com", "zelenka.guru/threads/2770783", "https://t.me/talkthenews", "https://zelenka.guru/threads/5862277/", "zelenka.guru/threads/5802663/", "@UniServBot", "zelenka.guru/threads/5886612", "https://zelenka.guru/threads/5830418/", "zelenka.guru/angeldrainer/", "zelenka.guru/threads/5883557", "zelenka.guru/threads/5720998", "https://zelenka.guru/threads/5488501", "https://zelenka.guru/threads/4871985/", "zelenka.guru/threads/3649746", "zelenka.guru/threads/5402454", "zelenka.guru/threads/2630352", "https://t.me/poseidon_project", "https://zelenka.guru/threads/4826265/", "zelenka.guru/threads/4939541", "zelenka.guru/threads/4073607", "zelenka.guru/threads/5071761/", "https://zelenka.guru/threads/3695705/", "zelenka.guru/members/4177803", "@verif_ads", "verifteam", "SmmPanelUS.com", "lteboost.ru"],
    adlist_l        = ["threads", "members", "lolz.live", "zelenka.guru", "t.me"],
    adlist_white    = ["zelenka.guru/threads/5545248/", "https://zelenka.guru/extasystudio/"];
 
let usercfg,
    adblock,
    nickname,
    userid,
    cache,
    secure,
    hidelike,
    secretph,
    marketblock,
    theme,
    avamarket,
    avablock,
    contestblock,
    uniqstatus,
    reportbtns;
 
(async function() {
    usercfg      = await GM.getValue("usercfg") ? GM.getValue("usercfg") : `{'cfg': {}}`
    adblock     = await GM.getValue("adblock") ? GM.getValue("adblock") : 'null';
    avablock    = await GM.getValue("avablock") ? GM.getValue("avablock") : 'null';
    cache       = await GM.getValue("cache") ? GM.getValue("cache") : 'null';
    secure      = await GM.getValue("secure") ? GM.getValue("secure") : 'not';
    hidelike    = await GM.getValue("hidelike") ? GM.getValue("hidelike") : 'null';
    marketblock = await GM.getValue("marketblock") ? GM.getValue("marketblock") : 'null';
    secretph    = await GM.getValue("secretph") ? GM.getValue("secretph") : 'not';
    theme       = await GM.getValue("theme") ? GM.getValue("theme") : 'null';
    avamarket   = await GM.getValue("avamarket") ? GM.getValue("avamarket") : 'null';
    uniqstatus  = await GM.getValue("uniqstatus") ? GM.getValue("uniqstatus") : 'null';
    contestblock= await GM.getValue("contestblock") ? GM.getValue("contestblock") : 'null';
    reportbtns   = await GM.getValue("reportbtns") ? GM.getValue("reportbtns") : 'null';
    window.addEventListener("DOMContentLoaded",async (event) => {
        profileRender();
        usernames();
        themeRender();
        renderFunctions();
        userid   = document.querySelector("input[name=_xfToken").value.split(",")[0];
        nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
        cacheSync();
        marketRender();
        threadRender();
        checkupdate();
    })
    setInterval(async () => {
        adBlockDaemon();
        daemon();
    }, 0);
    setInterval(usernames, 500);
 
})();
 
async function threadRender() {
 
    if (!window.location.pathname.includes('threads')) {return;}
    // Быстрый репорт, спасибо Jack'у
    const buttons = {
        "Флуд / Оффтоп / Спам / Бесполезная тема": {
            name: 'Флуд',
        },
        "Создание темы не в соответствующем разделе": {
            name: 'Неверный раздел',
        },
        "Неправильное оформление темы": {
            name: 'Неверное оформление',
        },
    }
    const _xfToken = document.querySelector('input[name="_xfToken"]').value;
 
    async function postData(url = '', formData) {
        return await fetch(url, { method: 'POST', body: formData });
    }
 
    function addButtonToPosts() {
        const blocks = document.querySelectorAll('#messageList > li');
        for(let block of blocks) {
            if (block.querySelector(".custom-button")) {
                continue;
            }
 
            for(let key in buttons) {
                let name = buttons[key].name;
                let message = buttons[key].message;
                let span = document.createElement('span');
                span.innerText = name;
                span.className = "custom-button";
                span.setAttribute('style', 'font-weight: bold; padding: 3px 10px; background: #218e5d; border-radius: 50px; margin-right: 5px; cursor: pointer;')
                span.onclick = function() {
                    if(!confirm('Вы действительно хотите отправить жалобу?')) return false;
                    let formData = new FormData();
                    formData.append("message", key);
                    formData.append("is_common_reason", 1);
                    formData.append("_xfToken", _xfToken);
                    formData.append("_xfNoRedirect", 1);
                    formData.append("_xfToken", _xfToken);
                    formData.append("redirect", window.location.href);
                    postData('posts/' + block.id.split('-')[1] +'/report', formData);
                    XenForo.alert('Жалоба отправлена', '', 5000);
                }
                if(block.querySelector('.publicControls')) block.querySelector('.publicControls').prepend(span);
            }
        }
    }
 
 
    if (await reportbtns == 'on') {
        addButtonToPosts();
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    addButtonToPosts();
                }
            });
        });
        observer.observe(document.getElementById('messageList'), { childList: true });
    }
 
}
 
async function daemon() {
 
    let nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    if (document.querySelector("input[name=secret_answer]:not(.completed)") && await secretph != 'null') {
        document.querySelector("input[name=secret_answer]:not(.completed)").value = await secretph;
        document.querySelector("input[name=secret_answer]:not(.completed)").classList.add("completed")
    }
 
    // Сканирование bb-кодов в треде (они должны быть самыми первыми)
    if (document.location.pathname.includes('threads') && document.querySelector("blockquote")) {
        if (document.querySelector("blockquote").innerHTML.trim().includes("betterfast")) return;
    }
    return;
}
 
async function themeRender() {
 
    let usernickt = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    let data = await JSON.parse(await cache);
    data = data.users[usernickt];
    if (data) {
        if (data.profilebg != 'null') {
            if (!document.querySelector(".avatarScaler")) {
                document.querySelector("body").style = `
                background-size: cover;
                background-position: center;
                background-attachment: fixed;
                background-repeat: no-repeat;
                background-image: linear-gradient(rgba(54, 54, 54, 0.85), rgba(54, 54, 54, 0.85)), url('${data.profilebg}')`
            }
        }
    }
 
    // акцент профиля
    // .messageSimple .secondaryContent .darkBackground .tabs .simpleRedactor .pageNavLinkGroup
    if (data && data.maincolor) {
            if (!document.querySelector(".avatarScaler")) {
                styles = `#header, .messageSimple, .discussionList, .sidebar .sidebarWrapper, .secondaryContent, .darkBackground, .tabs, .simpleRedactor, .pageNavLinkGroup {background: ${data.maincolor};} .page_top {border-bottom: 0;} .counts_module {border-top: 0;}`
                let styleSheet = document.createElement("style")
                styleSheet.innerText = styles;
                document.head.appendChild(styleSheet);
            }
    }
 
    if(await theme != 'null') {
        var link = document.createElement( "link" );
        link.href = "https://lzt.hasanbek.ru/better/css/" + await theme + ".css";
        link.type = "text/css";
        link.rel = "stylesheet";
        document.getElementsByTagName( "head" )[0].appendChild( link );
    }
}
 
async function profileRender() {
    if (!document.querySelector(".avatarScaler")) return false;
    // ид юзера
    const id = /market\/user\/(\d+)\/items/.exec(document.querySelector('.userContentLinks .button[href^="market/"]').href)[1];
    idhtml = document.createElement("div");
    idhtml.innerHTML = `<div class="clear_fix profile_info_row"><div class="label fl_l">ID пользователя:</div><div class="labeled">${id}<span data-phr="ID скопирован в буфер обмена" onclick="Clipboard.copy(${id}, this)" class="copyButton Tooltip" title="" data-cachedtitle="Скопировать ID" tabindex="0"><i class="far fa-clone" aria-hidden="true"></i>
    </span></div></div>`;
    document.querySelector(".profile_info_row").prepend(idhtml)
 
    // фон профиля
 
    let usernickt = document.querySelector("h1.username span").innerHTML.replace(/ <i.*?>.*?<\/i>/ig,'');
    let data = await JSON.parse(await cache);
    data = data.users[usernickt];
    if (data && data.profilebg) {
            document.querySelector("body").style = `
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
            background-image: linear-gradient(rgba(54, 54, 54, 0.85), rgba(54, 54, 54, 0.85)), url('${data.profilebg}')`;
    }
 
    // акцент профиля
    // .messageSimple .secondaryContent .darkBackground .tabs .simpleRedactor .pageNavLinkGroup
    if (data && data.maincolor) {
            styles = `#header, .messageSimple, .discussionList, .sidebar .sidebarWrapper, .secondaryContent, .darkBackground, .tabs, .simpleRedactor, .pageNavLinkGroup {background: ${data.maincolor};} .page_top {border-bottom: 0;} .counts_module {border-top: 0;}`
            let styleSheet = document.createElement("style")
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
    }
 
    // Скрытие лайков
    if (await hidelike=='on') document.querySelectorAll(".page_counter")[1].remove();
    // TrustFactor
   trustFactor();
}
 
async function trustFactor() {
    let usertrust = 0;
    let user_symps = parseInt(document.querySelector(".page_counter .count").innerHTML.replace(' ', '')),
        user_nick = document.querySelector("h1.username span").innerHTML.replace(/ <i.*?>.*?<\/i>/ig,''),
        user_role = document.querySelector("h1.username span").classList,
        user_insurance = parseInt(document.querySelector('h3.amount').innerHTML.replaceAll(' ','').replace('₽',''));
 
    const depositLevels = [
        { level: 10000, trustVal: 10 },
        { level: 20000, trustVal: 5 },
        { level: 50000, trustVal: 5 },
        { level: 100000, trustVal: 10 },
        { level: 200000, trustVal: 5 },
        { level: 300000, trustVal: 5 },
        { level: 500000, trustVal: 15 },
        { level: 700000, trustVal: 20 }
    ];
    const sympsLevels = [
        { level: 500, trustVal: 10 },
        { level: 1000, trustVal: 15 },
        { level: 1700, trustVal: 10 },
        { level: 3500, trustVal: 5 },
        { level: 5000, trustVal: 10 },
        { level: 7000, trustVal: 15 },
        { level: 10000, trustVal: 10 },
        { level: 20000, trustVal: 10 },
        { level: 30000, trustVal: 15 },
        { level: 40000, trustVal: 5 },
        { level: 50000, trustVal: 5 }
    ];
    const roleLevels = [
        { level: 3, trustVal: 85 },
        { level: 4, trustVal: 25 },
        { level: 30, trustVal: 35 },
        { level: 365, trustVal: 15 },
        { level: 353, trustVal: 40 },
        { level: 12, trustVal: 35 },
        { level: 349, trustVal: 20 },
        { level: 350, trustVal: 40 },
        { level: 354, trustVal: 35 },
        { level: 7, trustVal: 30 },
        { level: 26, trustVal: 1 }
    ];
 
    for (const level of depositLevels) {
        if (user_insurance > level.level) {
            usertrust += level.trustVal;
        }else break;
    }
    for (const level of sympsLevels) {
        if (user_symps > level.level) {
            usertrust += level.trustVal;
        }else break;
    }
    for (const level of roleLevels) {
        if (user_role.contains("banned")) {usertrust = 0; break;}
        if (user_role.contains("style"+level.level)) {
            usertrust += level.trustVal;
        }else break;
    }
 
    if(usertrust > 100) usertrust = 100;
    // переписать
    if (usertrust > 15 && usertrust < 35)
    {
        blzt_trust_text = 'Плохой (1/4)';
        blzt_trust_color = 'redc';
    }
    else if (usertrust >= 35 && usertrust < 65)
    {
        blzt_trust_text = 'Нормальный (2/4)';
        blzt_trust_color = 'mainc';
    }
    else if (usertrust >= 65 && usertrust < 84)
    {
        blzt_trust_text = 'Отличный (3/4)';
        blzt_trust_color = 'mainc';
    }
    else if (usertrust >= 84)
    {
        blzt_trust_text = 'Наивысший(4/4)';
        blzt_trust_color = 'mainc';
    }
    else {
        blzt_trust_text = 'Ужасный (0/4)';
        blzt_trust_color = 'redc';
    }
 
    let blzt_trust = document.querySelector(".insuranceDeposit");
 
    let blzt_trust_render = `
    <br>
    <div class="section insuranceDeposit">
        <div class="secondaryContent">
            <h3>
                <a href="${blzt_link_trust}" class="OverlayTrigger username" style="max-width: 200px; word-wrap: break-word;">
                    Уровень доверия к ${user_nick}
                </a>
            </h3>
 
            <h3 style="margin-bottom: 0px; font-size: 18px !important;" class="amount ${blzt_trust_color}" title="${usertrust}">
            ${blzt_trust_text}
            </h3>
            <div style="margin-top: 15px;  display: flex; gap: 5px;">
                <a class="button leftButton primary" onclick="goodTrust(${usertrust})">👍</a>
                <a class="button rightButton primary"  onclick="badTrust(${usertrust})">👎</a>
            </div>
        </div>
    </div>`;
 
    let blzt_trust_block = document.createElement("div");
        blzt_trust_block.innerHTML = blzt_trust_render;
 
    blzt_trust.append(blzt_trust_block);
    console.log(`[BetterLZT] Фактор доверия ${user_nick} = ${usertrust} (${blzt_trust_text})`)
}
function badTrust(trust) {
    let html = `
    <p>Почему вы считаете, что рейтинг завышен? Выберите один из вариантов (Кликните)</p>
    <div>
        <a class="container" style="color: rgb(34,142,93);" onclick="commitVote('scam', ${trust}, '-4points')">
            Пользователь занимался/занимается скамом, и это доказано
        </a>
        <a class="container" style="color: rgb(34,142,93);" onclick="commitVote('toxic', ${trust}, '-4points')">
            Этот пользователь оскорбил меня/другого человека без оснований
        </a>
        <a class="container" style="color: rgb(34,142,93);" onclick="commitVote('reporter', ${trust}, '-4points')">
            Этот пользователь занимается "Абузом жалоб"
        </a>
    </div>
    <p>Спасибо за Ваш вклад в BetterLZT</p>
    `;
    XenForo.alert(html, "BetterLZT > Фактор доверия");
}
 
function goodTrust(trust) {
    let html = `
    <p>Почему вы считаете, что рейтинг занижен? Выберите один из вариантов (Кликните)</p>
    <div>
        <a class="container" style="color: rgb(34,142,93);" onclick="commitVote('goodseller', ${trust}, '+3points')">
            Пользователь занимается торговлей на маркете/форуме и имеет более 90% положительных отзывов
        </a>
        <a class="container" style="color: rgb(34,142,93);" onclick="commitVote('helper', ${trust}, '+3points')">
            Этот пользователь помог мне (финансово/морально/физически)
        </a>
        <a class="container" style="color: rgb(34,142,93);" onclick="commitVote('inovator', ${trust}, '+3points')">
            Этот пользователь принес форуму что-то новое (Предложил функционал, как пример)
        </a>
    </div>
    <p>Спасибо за Ваш вклад в BetterLZT</p>
    `;
    XenForo.alert(html, "BetterLZT > Фактор доверия");
}
async function commitVote(reason, trust, type) {
    if (!reason) return XenForo.alert("Укажите комментарий!", 1, 10000);
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    let blzt_puser_likes = parseInt(document.querySelector(".page_counter .count").innerHTML.replace(' ', ''));
    let blzt_puser_nick = document.querySelector("h1.username span"),
        blzt_puser_nick_val = blzt_puser_nick.innerHTML.replace(/ <i.*?>.*?<\/i>/ig,'').replace(/<img.*?>/g,''),
        blzt_puser_role = blzt_puser_nick.classList,
        blzt_puser_deposit = parseInt(document.querySelector('h3.amount').innerHTML.replaceAll(' ','').replace('₽',''));
    if (nickname == blzt_puser_nick_val) {
        return XenForo.alert("Остановись! Саморепорт карается баном в системе фактора доверия!", 1, 10000)
    }
    let response = await request(`${server}/v6/report?user=${nickname}&originuser=${blzt_puser_nick_val}&originurl=${window.location.pathname}&originaction=${type}&origintrust=${trust}&origindeposit=${blzt_puser_deposit}&originlikes=${blzt_puser_likes}&comment=${reason}`)
    if (response  == "200") {
        return XenForo.alert("Успех!", 1, 10000)
    }
    else if (response == "403") {
        return XenForo.alert("Доступ к функционалу ограничен. Свяжитесь с разработчиком", 1, 10000)
    }
    else {
        return XenForo.alert("Ошибка", 1, 10000)
    }
}
 
function request(url) {
    return new Promise((resolve, reject) => GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: response => resolve(response.responseText),
        onerror: error => resolve(error)
    }));
}
 
function getUID() {
    return document.querySelector("input[name=_xfToken").value.split(",")[0];
}
async function uniqDel() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    if (secure == 'null') {
        await setSecure(`${document.querySelector("input[name=_xfToken").value.split(",")[0]+document.querySelector("input[name=_xfToken").value.split(",")[1]}`);
    }
    let req = await request(`${server}/se/del?user=${nickname}&css=${css}&banner=${banner}&bannertxt=${bannertxt}&svgcss=${svgcss}&svg=${svg}`).catch(e => {
        XenForo.alert("Ошибка синхронизации с сервером, попробуйте еще раз", 1, 10000)
    });
    if (await req != '200' && req != '401') {
        XenForo.alert("Ошибка синхронизации с сервером, свяжитесь с разработчиком t.me/hasantigiev or zelenka.guru/lays", 1, 10000)
    }
    if (await req == '401') {
        XenForo.alert("Для вашего профиля не найдены ключи авторизации. Cвяжитесь с разработчиком t.me/hasantigiev or zelenka.guru/lays", 1, 10000)
    }
    if (await req == '200') {
        XenForo.alert("Успех", 1, 10000);
        cacheSync();
        location.reload();
    }
}
async function uniqChange() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    if (secure == 'null') {
        await setSecure(`${document.querySelector("input[name=_xfToken").value.split(",")[0]+document.querySelector("input[name=_xfToken").value.split(",")[1]}`);
    }
    let req = await request(`${server}/v6/change?user=${nickname}`).catch(e => {
        XenForo.alert("Ошибка синхронизации с сервером, попробуйте еще раз", 1, 10000)
    });
    if (await req != '200' && req != '401') {
        XenForo.alert("Ошибка синхронизации с сервером, свяжитесь с разработчиком t.me/hasantigiev or zelenka.guru/lays", 1, 10000)
    }
    if (await req == '401') {
        XenForo.alert("Для вашего профиля не найдены ключи авторизации. Cвяжитесь с разработчиком t.me/hasantigiev or zelenka.guru/lays", 1, 10000)
    }
    if (await req == '200') {
        XenForo.alert("Уник выключен", 1, 10000);
        cacheSync();
    }
    if (await req == '201') {
        XenForo.alert("Уник включен", 1, 10000);
        cacheSync();
    }
}
async function uniqSave() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    localcss = document.getElementsByClassName("UsernameCss")[0].value;
    banner = document.getElementsByClassName("BannerCss")[0].value;
    svgcss = document.getElementsByClassName("BannerCss")[0].value;
    bannertxt = document.querySelector("input[name='banner_text']").value;
    svg = document.querySelector("textarea[name=banner_icon]").value;
    css = encodeURIComponent(localcss.replace(/\n/g, "").replace(/; +/g, ";"));
    banner = encodeURIComponent(banner.replace(/\n/g, "").replace(/; +/g, ";"));
    bannertxt = encodeURIComponent(bannertxt.replace(/\n/g, "").replace(/; +/g, ";"));
    svgcss = encodeURIComponent(svgcss.replace(/\n/g, "").replace(/; +/g, ";"));
    svg = encodeURIComponent(svg)
 
    if (secure == 'null') {
        await setSecure(`${document.querySelector("input[name=_xfToken").value.split(",")[0]+document.querySelector("input[name=_xfToken").value.split(",")[1]}`);
    }
    let req = await request(`${server}/v5/new?user=${nickname}&css=${css}&banner=${banner}&bannertxt=${bannertxt}&svgcss=${svgcss}&svg=${svg}`).catch(e => {
        XenForo.alert("Ошибка синхронизации с сервером, попробуйте еще раз", 1, 10000)
    });
    if (await req != '200' && req != '401') {
        XenForo.alert("Ошибка синхронизации с сервером, свяжитесь с разработчиком t.me/hasantigiev or zelenka.guru/lays", 1, 10000)
    }
    if (await req == '401') {
        XenForo.alert("Для вашего профиля не найдены ключи авторизации. Cвяжитесь с разработчиком t.me/hasantigiev or zelenka.guru/lays", 1, 10000)
    }
    if (await req == '200') {
        XenForo.alert("Уник отправлен на проверку. Обычно это занимает 5-10 минут.", 1, 10000);
        cacheSync();
    }
    document.querySelector("input[type=submit]").click();
}
 
async function usernames() {
    let usernames = document.querySelectorAll(".username span:not(.custom)");
    try {
        for(let e of usernames) parseUsername(e);
    } catch {}
}
 
 
async function checkupdate() {
    try {
        nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
        let response = await request(`${server}/v6/support?ver=${version}&user=${nickname}`).catch(err => {});
        if (response == 'no' || response == 'dis') {
            let waterm = document.createElement('a')
            waterm.style = "position:fixed;bottom:5px;right:5px;opacity:0.5;z-index:99;color:white;font-size: 25px;";
            waterm.innerHTML = "Для обновления BetterLZT кликните сюда";
            waterm.href = "https://greasyfork.org/ru/scripts/470626-betterlzt"
            return document.body.append(waterm);
        }
        if (response == 'newbeta') {
            let waterm = document.createElement('h1')
            waterm.style = "position:fixed;bottom:5px;right:5px;opacity:0.5;z-index:99;color:white;font-size: 25px;";
            waterm.innerHTML = "Вы получили доступ к Beta-версии BetterLZT (t.me/hasantigiev)";
            return document.body.append(waterm);
        }
    } catch (error) {
        console.error("[BetterLZT] Failed to check update: "+error)
    }
 
}
 
async function cacheSync() {
    try {
        nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
        let response = await request(`${server}/v2/sync?user=${nickname}`).catch(err => {});
        if (response != cache && response != '') {
            cache = response;
            await setCache(response);
            console.log('OK')
        }
    } catch (error) {
        console.error("[BetterLZT] Sync error: "+error)
    }
}
 
async function setCache(e) {
    return await GM.setValue('cache', e);
}
 
async function setSecure(e) {
    return await GM.setValue('secure', e);
}
 
 
async function parseUsername(e) {
    let data = await JSON.parse(await cache);
    try {
        if (!data.users[e.innerHTML]) { e.classList.add("custom"); return; }
        data = data.users[e.innerHTML];
        if (data && !e.classList.contains("custom")) {
            if (data.css && data.uniq == "on" && await uniqstatus == 'on') {
                e.style = data.css;
            }
            e.classList.add("custom");
            if (data.status && await uniqstatus == 'on' && data.uniq == "on") {
                switch (data.status) {
                    case "js":
                        e.innerHTML += ` <i title="BetterLZT User" class="fab fa-js-square" style="-webkit-text-fill-color: gold;"></i>`
                        break;
                    case "python":
                        e.innerHTML += ` <i class="fab fa-python" style="-webkit-text-fill-color: gold;"></i>`
                        break;
                    case "server":
                        e.innerHTML += ` <i title="BetterLZT User" class="fa fa-hdd"></i>`
                        break;
                    case "bug":
                        e.innerHTML += ` <i title="BetterLZT User" class="fa fa-bug"></i>`
                        break;
                    case "code":
                        e.innerHTML += ` <i title="BetterLZT User" class="fas fa-code"></i>`
                        break;
                    case "verified":
                        e.innerHTML += ` <i title="BetterLZT User" class="far fa-badge-check"></i>`
                        break;
                    case "gold":
                        e.innerHTML += ` <i title="BetterLZT User" class="fas fa-spinner-third fa-spin" style="--fa-primary-color: #fe6906; --fa-secondary-color: #1a6eff; background: none; -webkit-text-fill-color: gold;"></i>`
                        break;
                    case "silver":
                        e.innerHTML += ` <i title="BetterLZT User" class="fas fa-spinner fa-spin"  style="--fa-primary-color: #c0c0c0; --fa-secondary-color: #1a72ff; background: none; -webkit-text-fill-color: #c0c0c0;"></i>`
                        break;
                    case "beta":
                        e.innerHTML += ` <i title="BetterLZT User" class="fa fa-heartbeat"></i>`
                        break;
                    case "cookie":
                        e.innerHTML += ` <i title="BetterLZT User" class="fas fa-cookie" style="-webkit-text-fill-color: #228e5d;"></i>`
                        break;
                    case "admin":
                        e.innerHTML += ` <i title="BetterLZT User" class="fas fa-wrench" style="-webkit-text-fill-color: rgb(150,68,72);"></i> `
                        break;
                    case "moderate":
                        e.innerHTML += ` <i title="BetterLZT User" class="fas fa-bolt" style="-webkit-text-fill-color: #12470D;"></i> `
                        break;
                    case "smoderate":
                        e.innerHTML += ` <i title="BetterLZT User" class="fas fa-bolt" style="-webkit-text-fill-color: rgb(46,162,74);"></i> `
                        break;
                    case "arbitr":
                        e.innerHTML += ` <i title="BetterLZT User" class="fas fa-gavel" style="-webkit-text-fill-color: rgb(255,154,252);"></i> `
                        break;
                    case "editor":
                        e.innerHTML += ` <i title="BetterLZT User" class="fas fa-pen" style="-webkit-text-fill-color: rgb(0,135,255);"></i> `
                        break;
                    case "designer":
                        e.innerHTML += ` <i title="BetterLZT User" class="fas fa-drafting-compass" style="-webkit-text-fill-color: #5c45ff;"></i>`
                        break;
                    case "designer2":
                        e.innerHTML += ` <i title="BetterLZT User" class="fas fa-drafting-compass" style="background: url('https://i.gifer.com/7HHu.gif');-webkit-background-clip: text;-webkit-text-fill-color: transparent;"></i>`
                        break;
                    case "walking":
                        e.innerHTML += ` <i title="BetterLZT User" class="fas fa-walking"></i>`
                        break;
                    case "usd":
                        e.innerHTML += `<i title="BetterLZT User" class="fas fa-badge-dollar" style="background: url('https://i.gifer.com/7HHu.gif');-webkit-background-clip: text;-webkit-text-fill-color: transparent;"></i>`
                        break;
                    case "custom":
                        e.innerHTML += ` ${data.statusCode}`
                        break;
                    case "bmoder":
                        e.innerHTML += `<i class="far fa-user-cog" title="BetterLZT Moderator" style="-webkit-text-fill-color: #810404;"></i>`;
                        break
                    case "sueta":
                        e.innerHTML += `<img src="https://nztcdn.com/files/310336b3-c10e-4ad1-8fdf-0bbe73835ca1.webp" height="13px" style="margin-left: 2px; margin-right: 1px;">`;
                        break
                    default:
                        e.innerHTML += ` <i title="BetterLZT User" class="fa fa-stars"></i>`
                        break;
                }
            }
        }
        if (e.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.avatarHolder') && data.uniq == "on" && data.svgcss && await uniqstatus == 'on') {
            let svg = document.createElement('div');
            e.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".avatarHolder:not(.custom)")
            svg.classList.add("avatarUserBadges");
            svg.innerHTML = `
            <span style="${data.svgcss}" class="avatarUserBadge  Tooltip ${!data.svg ? 'uniq_default' : ''}" title="${data.bannertxt}" tabindex="0" data-cachedtitle="${data.bannertxt}">
            <div class="customUniqIcon"> ${data.svg ? data.svg : ''} </div>
            </span>`;
            e.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".avatarHolder").prepend(svg)
        }
 
        if (e.parentElement.parentElement.parentElement.parentElement.querySelector(".avatarHolder") && data.uniq == "on" && data.svgcss && await uniqstatus == 'on') {
            let svg = document.createElement('div');
            e.parentElement.parentElement.parentElement.parentElement.querySelector(".avatarHolder:not(.custom)").classList.add("custom")
            svg.classList.add("avatarUserBadges");
            svg.innerHTML = `
            <span style="${data.svgcss}" class="avatarUserBadge  Tooltip ${!data.svg ? 'uniq_default' : ''}" title="${data.bannertxt}" tabindex="0" data-cachedtitle="${data.bannertxt}">
            <div class="customUniqIcon"> ${data.svg ? data.svg : ''} </div>
            </span>`;
            e.parentElement.parentElement.parentElement.parentElement.querySelector(".avatarHolder").prepend(svg)
        }
        if (await uniqstatus == 'on' && data.uniq == "on") {
            if (document.querySelector(".avatarScaler") && data.banner && !document.querySelector(".customBanner") && document.querySelectorAll("h1.username")[0].innerHTML.includes(e.innerHTML)) {
                let banner = document.createElement('em');
                banner.classList.add("userBanner");
                banner.classList.add("customBanner");
                banner.classList.add("wrapped");
                banner.style = data.banner;
                banner.innerHTML = `<span class="before"></span><strong>${data.bannertxt}</strong><span class="after"></span>`;
                document.querySelector(".avatarScaler").append(banner);
            }
        }
    } catch {}
}
 
function setAdblock(e) {
    GM.setValue("adblock", e)
    adblock = e;
    XenForo.alert('AdBlock настроен', 1, 10000)
}
 
function setLike(e) {
    GM.setValue("hidelike", e)
    hidelike = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000)
}
 
function setAva(e) {
    GM.setValue("avamarket", e)
    avamarket = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000)
}
 
function setUniq(e) {
    GM.setValue("uniqstatus", e)
    uniqstatus = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000)
}
 
function setContest(e) {
    GM.setValue("contestblock", e)
    contestblock = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000)
}
 
function setReport(e) {
    GM.setValue("reportbtns", e)
    reportbtns = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000)
}
 
 
function setSecretph(e) {
    GM.setValue("secretph", e)
    hidelike = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000);
}
 
 
 
function setMarketblock(e) {
    GM.setValue("marketblock", e)
    marketblock = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000)
}
 
function setTheme(e) {
    GM.setValue("theme", e)
    marketblock = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000)
}
 
 
function renderFunctions() {
    unsafeWindow.nickname = nickname;
    unsafeWindow.server = server;
    unsafeWindow.cache = cache;
    unsafeWindow.version = version;
    unsafeWindow.adblock = adblock;
    unsafeWindow.hidelike = hidelike;
    unsafeWindow.marketblock = marketblock;
    unsafeWindow.avamarket = avamarket;
    unsafeWindow.secure = secure;
    unsafeWindow.theme = theme;
    unsafeWindow.uniqstatus = uniqstatus
    unsafeWindow.reportbtns = reportbtns
    unsafeWindow.setAdblock = e => setAdblock(e);
    unsafeWindow.setMarketblock = e => setMarketblock(e);
    unsafeWindow.setCache = e => setCache(e);
    unsafeWindow.setSecure = e => setSecure(e);
    unsafeWindow.setSecretph = e => setSecretph(e);
    unsafeWindow.setLike = e => setLike(e);
    unsafeWindow.setTheme = e => setTheme(e);
    unsafeWindow.setAva = e => setAva(e);
    unsafeWindow.setUniq = e => setUniq(e);
    unsafeWindow.setContest = e => setContest(e);
    unsafeWindow.setReport = e => setReport(e);
    unsafeWindow.setGpt = e => setGpt(e);
    unsafeWindow.request = request;
    let torender = [uniqSave, uniqChange, secretSecurity, goodTrust, badTrust, trustFactor, commitVote, SecretSet, ColorSet, BgSet, dialogWindow, cacheSync, EmojiSet, getUID, usernames, parseUsername, cacheSync, BannerStyle, NickStyle];
    let funcs = torender.map(e => e.toString());
    let script = document.createElement('script');
    script.appendChild(document.createTextNode(funcs.join("")));
    document.head.appendChild(script);
    renderSettings();
}
 
function isAd(e) {
    if (adlist_w.some(o => e.innerHTML.toLowerCase().includes(o)) && !adlist_white.some(o => e.innerHTML.toLowerCase().includes(o))) {
        return true;
    }
    return false;
}
 
function isLink(e) {
    if (adlist_l.some(o => e.innerHTML.toLowerCase().includes(o)) && !adlist_white.some(o => e.innerHTML.toLowerCase().includes(o))) {
        return true;
    }
    return false;
}
 
async function adBlockDaemon() {
    if (await contestblock == 'on' && document.querySelector(".messageText.SelectQuoteContainer.ugc") && document.querySelector(".moneyContestWithValue")) {
        document.querySelector(".messageText.SelectQuoteContainer.ugc").remove()
    }
    adblock = await adblock;
    avablock = await avablock;
    if (window.location.pathname == '/' && document.querySelector(".text_Ads") && adblock == 'on') { document.querySelector(".text_Ads").remove(); return;}
    let users = document.querySelectorAll("span.userStatus:not(.blocked)");
 
    // удаление рекламы в алертах
    if (document.querySelector('[data-author="Реклама"]') && adblock == 'on')
    {
        let ads = document.querySelectorAll('[data-author="Реклама"]');
        ads.forEach(function (e){
            e.remove();
        })
	}
	// проверка на рекламу в минипрофиле
 
	if (document.querySelector(".userTitleBlurb h4") && adblock == 'on')
	{
		let e = document.querySelector(".userTitleBlurb h4");
		let img = document.querySelector(".avatarBox span.img");
		if (isAd(e)) {
			e.classList.add("blocked");
			e.innerHTML = "Реклама скрыта";
			img.style.backgroundImage = `url('https://placehold.co/600x600?text=%D0%A0%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%B0%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B0')`;
		}
	}
	if (document.querySelector(".userTitleBlurb h4") && adblock == 'on')
	{
		let e = document.querySelector(".userTitleBlurb h4");
		let img = document.querySelector(".avatarBox span.img");
		if (isLink(e)) {
			e.classList.add("blocked");
			e.innerHTML = "Реклама скрыта";
		}
	}
 
    // Проверка статуса на юзер пейдже
    if (document.querySelector(".current_text:not(.blocked)") && adblock == 'on')
    {
        let e = document.querySelector(".current_text:not(.blocked)");
        let img = document.querySelector(".avatarScaler img");
        if (isAd(e)) {
            e.classList.add("blocked");
            e.innerHTML = "Реклама скрыта";
            img.src = 'https://placehold.co/600x600?text=%D0%A0%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%B0%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B0';
        }
 
        if (isLink(e)) {
            e.classList.add("blocked");
            e.innerHTML = "Реклама скрыта";
        }
 
    }
 
    if (users.length < 1 && adblock != 'on') {return;}
 
    users.forEach(function (e) {
        // проверка на рекламу
        if (isAd(e) && adblock == 'on')
        {
            e.innerHTML = 'Реклама скрыта';
            e.classList.add("blocked");
            // такое говно в будущем стоит переписать =)
            $(e).parent().parent().parent().find(".img")[0].style.backgroundImage = `url('https://placehold.co/600x600?text=%D0%A0%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%B0%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B0')`;
            return;
        }
        if (isLink(e) && adblock == 'on')
        {
            e.innerHTML = 'Реклама скрыта';
            e.classList.add("blocked");
            return;
        }
        return;
    })
}
 
function BannerStyle(type) {
    switch (type) {
        case '1':
            document.getElementsByClassName("BannerCss")[0].value = `border-radius: 6px;background: url('https://media1.giphy.com/media/JtBZm3Getg3dqxK0zP/giphy.gif') center center;text-shadow: 0px 0px 3px #7a00ff, 0px 1px 0px #7a00ff, 1px 2px 0px red, 1px 3px 0px green;color: white`;
            document.getElementsByClassName("UserBannerStyle")[0].style = `border-radius: 6px;background: url('https://media1.giphy.com/media/JtBZm3Getg3dqxK0zP/giphy.gif') center center;text-shadow: 0px 0px 3px #7a00ff, 0px 1px 0px #7a00ff, 1px 2px 0px red, 1px 3px 0px green;color: white`;
            break;
        case '2':
            document.getElementsByClassName("BannerCss")[0].value = `border-radius: 6px;background: url('https://media1.giphy.com/media/3o7522WIg2FkHbCHvO/giphy.gif') center center;text-shadow: 0px 0px 3px #7a00ff, 0px 1px 0px gray, 1px 2px 0px lime, 1px 3px 0px blue;color: white`;
            document.getElementsByClassName("UserBannerStyle")[0].style = `border-radius: 6px;background: url('https://media1.giphy.com/media/3o7522WIg2FkHbCHvO/giphy.gif') center center;text-shadow: 0px 0px 3px #7a00ff, 0px 1px 0px gray, 1px 2px 0px lime, 1px 3px 0px blue;color: white`;
 
        default:
            break;
    }
}
 
function NickStyle(type) {
    switch (type) {
        case '1':
            document.getElementsByClassName("UsernameCss")[0].value = `background: url('https://media3.giphy.com/media/h5XENtRSEjj8tELOXW/giphy.gif');text-shadow: 0 0 5px #ff00f7;-webkit-background-clip: text;-webkit-text-fill-color: transparent`;
            document.getElementsByClassName("UsernameStyle")[0].style = `background: url('https://media3.giphy.com/media/h5XENtRSEjj8tELOXW/giphy.gif');text-shadow: 0 0 5px #ff00f7;-webkit-background-clip: text;-webkit-text-fill-color: transparent`;
            break;
        case '2':
            document.getElementsByClassName("UsernameCss")[0].value = `background: url('https://media4.giphy.com/media/dwaeIbBnF6HBu/giphy.gif');text-shadow: 0 0 5px #ff00f7;-webkit-background-clip: text;-webkit-text-fill-color: transparent`;
            document.getElementsByClassName("UsernameStyle")[0].style = `background: url('https://media4.giphy.com/media/dwaeIbBnF6HBu/giphy.gif');text-shadow: 0 0 5px #ff00f7;-webkit-background-clip: text;-webkit-text-fill-color: transparent`;
 
        default:
            break;
    }
}
 
async function renderSettings() {
 
    // Проверка на нахождение в профиле и наличие кнопки редактирования профиля
    if (document.querySelector(".secondaryContent a.button.block[href='account/personal-details']")) {
        let profileeditbtn = document.createElement('a')
        profileeditbtn.classList.add('block');
        profileeditbtn.classList.add('button');
        profileeditbtn.onclick = function () {
            dialogWindow();
        };
        profileeditbtn.innerHTML = 'Настроить BetterLZT';
        document.querySelector(".topblock .secondaryContent").append(profileeditbtn)
    }
    if(window.location.pathname == "/account/uniq/test" && await uniqstatus == 'on') {
        if (document.querySelector("[name=banner_text]").value == "Lolzteam") document.querySelector("[name=banner_text]").value = "BetterLZT";
        let adduniq = document.createElement("div");
        adduniq.style = "margin-bottom: 25px";
        adduniq.innerHTML = `
        <div class="menu">
 
        <div class="menu-header">
            <h1 class="menu-header-title">Настройки бесплатного "Уника"</h1>
 
        </div>
        <div class="menu-body">
            <a onclick="uniqSave();">Применить уник</a>
            <a onclick="uniqChange();" style="color: red;">Вкл/Выкл бесплатный уник</a>
        </div>
 
    </div><style>
    @keyframes pulse {
        0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 white;
            border-radius: 100%;
            opacity: 0.5;
        }
 
        70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px white;
            border-radius: 100%;
            opacity: 0.5;
        }
 
        100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 white;
            border-radius: 100%;
            opacity: 0.5;
        }
    }
:root {
    --c-text-primary: #edeeef;
    --c-text-secondary: #d4d7e1;
    --c-border-primary: #323232;
    --c-bg-body: #000;
    --c-bg-primary: #1b1d23;
    --c-bg-secondary: #000001;
    --c-bg-button: #343844;
}
 
.menu {
  width: 90%;
  max-width: 320px;
  background-color: var(--c-bg-primary);
  transition: background-color .30s ease;
  border-radius: 15px;
}
 
/* header */
.menu-header {
  padding: 1rem;
}
 
.menu-heaser-title {
  font-size: 1.2rem;
  color: var(--c-text-secondary);
  font-weight: 700;
}
 
/* theme switcher */
.theme-switcher input {
  display: none;
}
 
.theme-switcher {
  position: relative;
  background-color: var(--c-bg-secondary);
  border-radius: 10px;
  display: flex;
  padding: 0 3px;
}
 
.theme-switcher label {
  position: relative;
  z-index: 2;
  width: calc(100% / 3);
  color: var(--c-text-secondary);
}
 
.theme-switcher label span {
  padding: 8px 0;
  display: flex;
  justify-content: center;
  font-weight: 600;
  opacity: 0.8;
}
 
.theme-switcher label span:hover {
  opacity: 1;
  cursor: pointer;
}
 
.theme-switcher .slider {
  position: absolute;
  z-index: 1;
  width: calc((100% - 6px) / 3);
  top: 3px;
  transform: translatex(-110%);
  bottom: 3px;
  border-radius: 8px;
  transition: .30s ease, transform 0.25s ease-out;
  background-color: var(--c-bg-button);
}
 
.theme-switcher input:nth-of-type(1):checked ~ .slider {
  transform: translateX(0);
}
.theme-switcher input:nth-of-type(2):checked ~ .slider {
  transform: translateX(100%);
}
.theme-switcher input:nth-of-type(3):checked ~ .slider {
  transform: translateX(200%);
}
 
/* Menu body */
.menu-body {
  padding: 1rem;
  border-top: 1px solid var(--c-border-primary);
  transition: border-color .30s ease;
}
 
.menu-body a {
  text-decoration: none;
  color: inherit;
  display: flex;
  padding: 0.6rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  transition: .30s ease;
}
 
.menu-body a:hover {
  background-color: var(--c-bg-secondary);
}
 
ion-icon {
  margin-right: 5px;
  font-size: 20px;
  margin-top: 2px;
}</style>
`
        document.getElementsByClassName("ToggleTriggerAnchor")[0].prepend(adduniq);
    }else if(window.location.pathname == "/account/uniq/test" && await uniqstatus != 'on'){
        let adduniq = document.createElement("div");
        adduniq.style = "margin-bottom: 25px";
        adduniq.innerHTML = `
        <div style="background: rgb(54, 54, 54);
            margin: 5px 15px;
            padding: 10px 15px; border-radius: 10px;">
            ⚠️ у вас отключены уники от BetterLZT. Для сохранения бесплатного уника активируйте функцию в настройках
        </div>
        `
        document.querySelector("#UniqPanels").prepend(adduniq)
    }
}
 
 
async function dialogWindow() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim().replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim().replace(" Premium", "").trim();
    let data = await JSON.parse(await cache);
    data = data.users[nickname];
    if (!data) { 
        data = {
            "premium": false
        }
    }
    adblockt = false;
    marketblockt = false;
    hideliket = false;
    hideava = false;
    uniqstatust = false;
    uniqstatust = false;
    contestblockt = false;
    reportbtnst = false;
    if (await reportbtns == 'on') {
        reportbtnst = true;
    }
    if (await adblock == 'on') {
        adblockt = true;
    }
    if (await marketblock == 'on') {
        marketblockt = true;
    }
    if (await hidelike == 'on') {
        hideliket = true;
    }
    if (await avamarket == 'on') {
        hideava = true;
    }
    if (await uniqstatus == 'on') {
        uniqstatust = true;
    }
    if (await contestblock == 'on') {
        contestblockt = true;
    }
 
    let htmlall = `
 
 
    <details style="">
        <summary>Основные<br><span>Реклама, секретный вопрос</span></summary>
        <div>
 
            <div class='btns-l'><input onclick="setUniq('${uniqstatust ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${uniqstatust ? 'checked' : ''} /> Включить уники от BetterLZT</div> <div class='btns-l'><input onclick="setAdblock('${adblockt ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${adblockt ? 'checked' : ''} /> Блокировщик рекламы</div>
            <div class='btns-l'><input onclick="setMarketblock('${marketblockt ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${marketblockt ? 'checked' : ''} /> Скрывать продавцов в ЧС</div> <div class='btns-l'><input onclick="setLike('${hideliket ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${hideliket ? 'checked' : ''} /> Скрывать счетчик лайков в профиле</div>
            <div class='btns-l'><input onclick="setAva('${hideava ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${hideava ? 'checked' : ''} /> Скрывать аватарки на маркете</div> <div class='btns-l'><input onclick="setContest('${contestblockt ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${contestblockt ? 'checked' : ''} /> Скрывать контент в розыгрышах</div>
            <div class='btns-l'><input onclick="setReport('${reportbtnst ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${reportbtnst ? 'checked' : ''} /> Показывать кнопки для быстрой подачи жалоб</div>
            <hr style="border: solid 1px #363636;">
            <p class="main-text" onclick="secretSecurity()">Автоматический ввод секретной фразы: (кликабельно)</p>
 
            <input id="secretph" class="input" placeholder="Введите вашу секретную фразу"> <a onclick="SecretSet()" class="button leftButton primary">Сохранить</a>
 
            </div>
    </details>
 
    <details style="">
        <summary>Выбор иконки у ника<br><span>Для выбора просто кликните на понравившуюся иконку</span></summary>
        <div style="margin-top: -30px">
        <p><b>Бесплатные:</b></p>
        <button onclick="EmojiSet('walking')"><i class="fas fa-walking"></i></button><button onclick="EmojiSet('code')"><i class="fas fa-code"></i></button> <button onclick="EmojiSet('silver')"><i class="fas fa-spinner fa-spin"></i></button>
 
        ${data.premium ? '<p><b>Premium эмодзи</b></p>' : '<p><b>Доступные с Premium:</b></p>' }
        <button ${data.premium ? 'onclick="EmojiSet(`sueta`)"' : ''}"><img src="https://nztcdn.com/files/310336b3-c10e-4ad1-8fdf-0bbe73835ca1.webp" height="18px"></button><button ${data.premium ? 'onclick="EmojiSet(`cookie`)"' : ''}"><i class="fas fa-cookie" style="color: #228e5d;"></i></button><button ${data.premium ? 'onclick="EmojiSet(`gold`)"' : ''}><i title="BetterLZT User" class="fas fa-spinner-third fa-spin"  style="--fa-primary-color: #fe6906; --fa-secondary-color: #1a6eff; background: none; -webkit-text-fill-color: gold;"></i></button><button ${data.premium ? 'onclick="EmojiSet(`js`)"' : ''}"><i class="fab fa-js-square" style="-webkit-text-fill-color: gold;"></i></button><button ${data.premium ? 'onclick="EmojiSet(`python`)"' : ''}"><i class="fab fa-python" style="-webkit-text-fill-color: gold;"></i></button><button ${data.premium ? 'onclick="EmojiSet(`verified`)"' : ''}"><i class="fas fa-badge-check"></i></button>
        <button ${data.premium ? 'onclick="EmojiSet(`admin`)"' : ''}"><i class="fas fa-wrench" style="color: rgb(150,68,72);"></i></button><button ${data.premium ? 'onclick="EmojiSet(`moderate`)"' : ''}"><i class="fas fa-bolt" style="color: #12470D"></i></button><button ${data.premium ? 'onclick="EmojiSet(`smoderate`)"' : ''}"><i class="fas fa-bolt" style="color: rgb(46,162,74);"></i></button><button ${data.premium ? 'onclick="EmojiSet(`arbitr`)"' : ''}"><i class="fas fa-gavel" style="color: rgb(255,154,252);"></i></button><button ${data.premium ? 'onclick="EmojiSet(`editor`)"' : ''}"><i class="fas fa-pen" style="color: rgb(0,135,255);"></i></button><button ${data.premium ? 'onclick="EmojiSet(`designer`)"' : ''}"><i class="fas fa-drafting-compass" style="color: #5c45ff;"></i></button><button ${data.premium ? 'onclick="EmojiSet(`designer2`)"' : ''}"><i class="fas fa-drafting-compass" style="background: url('https://i.gifer.com/7HHu.gif');-webkit-background-clip: text;-webkit-text-fill-color: transparent;"></i></button><button ${data.premium ? 'onclick="EmojiSet(`usd`)"' : ''}"><i class="fas fa-badge-dollar" style="background: url('https://i.gifer.com/7HHu.gif');-webkit-background-clip: text;-webkit-text-fill-color: transparent;"></i></button>
        ${data.premium ? '<a class="button leftButton primary" target="_blank" href="https://hasantigiev.t.me">Установить свою</a> ' : ''}  <a class="button leftButton" onclick="EmojiSet('default')">Установить стандартное</a>
        </div>
    </details>
 
    <details style="">
        <summary>Кастомизация<br></summary>
        <div style="margin-top: -25px">
            <h3 style="display: inline; margin-bottom: 5px;">Фон</h3>
            <span>Данный фон Вы будете видеть на всех страницах форума и маркета.
            Так же, он будет виден посетителям Вашего форума (при использовании расширения)</span>
 
            <input class="input" id="bgurl" placeholder="Ссылка на картинку"> <a onclick="BgSet()" class="button leftButton primary OverlayTrigger">Сохранить</a>
 
            <hr style="border: solid 1px #363636;">
            <h3 style="display: inline; margin-bottom: 5px;">Своя тема (Нужен Premium)</h3>
            <span>Данную тему Вы будете видеть на всех страницах форума и маркета.
            Так же, она будет видна посетителям Вашего форума (при использовании расширения)</span>
 
            <input class="input" id="colorbg" placeholder="цвет в формате rgba()"> <a onclick="ColorSet()" class="button leftButton primary OverlayTrigger">Сохранить</a>
 
 
            </div>
    </details>
 
    <details style="">
        <summary>Готовые темы<br></summary>
        <div style="margin-top: -25px">
            <a class="button leftButton" onclick="setTheme('1')">Amoled</a> <a class="button leftButton" onclick="setTheme('2')">BetterLZT</a>  <a class="button leftButton" onclick="setTheme('3')">Lime</a> <a class="button leftButton" onclick="setTheme('4')">LZT Purple</a> <a class="button leftButton" onclick="setTheme('5')">Lzt Sakura</a>
 
            <a class="button leftButton primary" onclick="setTheme('null')">Отключить</a>
        </div>
    </details>
 
    <details style="">
        <summary>Новости и обновления<br></summary>
        <div style="margin-top: -25px">
        <iframe src="https://lzt.hasanbek.ru/better/exui/hub.php?user=${nickname}&version=${version}" frameborder="0" width="100%" height="500px"></iframe>
        </div>
    </details>
 
    <details style="">
        <summary>Цены на премиум<br></summary>
        <div style="margin-top: -45px">
            <iframe src="https://lzt.hasanbek.ru/better/exui/prem.php?user=${nickname}" frameborder="0" width="100%"></iframe>
            <i>Хочешь поддержать автора? Приобрети премиум =)</i>
            <a class="button leftButton primary" target="_blank" href="https://hasantigiev.t.me">Приобрести Premium</a>
        </div>
    </details>
    `
 
    let html_prem = `
    <iframe src="https://lzt.hasanbek.ru/better/ver.php?user=${nickname}&version=${version}" frameborder="0" width="100%" style="margin-top: -25px;" height="70px"></iframe>
 
    ${htmlall}
    <div style="display: flex;
    width: 598px;
    justify-content: space-between;
    align-items: flex-start;">
    Version ${version}
    <iframe src="https://lzt.hasanbek.ru/better/exui/premium.php?user=${nickname}" frameborder="0" width="360px" style="" height="50px"></iframe>
    </div>
    <a class="button leftButton primary" target="_blank" href="https://hasantigiev.t.me">Приобрести Premium</a> <a class="button leftButton" href="account/uniq/test">Настроить уник</a> <a class="button leftButton" href="https://greasyfork.org/ru/scripts/470626-betterlzt">Обновить расширение</a>
    <style>
    .main-text {
        font-size: 13px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        display: inline;
    }
    .btns-l {
        margin-bottom: 10px;
        margin-right: 10px;
        border-radius: 6px;
        display: inline-block;
        padding: 7px 15px;
        background: #363636;
        justify-content: center;
        align-items: center;
        gap: 12px;
        font-size: 13px;
        font-style: normal;
        font-weight: 600;
    }
    details {
        width: 100%;
        background: #272727;
        border: solid 3px #363636;
        box-shadow: 0 0.1rem 1rem -0.5rem rgba(0, 0, 0, .4);
        border-radius: 8px;
        overflow: hidden;
        margin-top: -25px;
    }
    summary {
        padding: 12px 16px;
        display: block;
        background: #363636;
        position: relative;
        cursor: pointer;
 
        color: #D6D6D6;
        font-family: Open Sans;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
    }
    summary span {
        color: #949494;
        font-size: 13px;
    }
    details span {
        color: #949494;
        font-size: 13px;
    }
    summary:after {
        font-family: "Font Awesome 5 Pro";
        color: rgb(148,148,148);
        content: '\\f077';
        position: absolute;
        left: 97%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(180deg);
        transform-origin: 0.2rem 50%;
        transition: 0.25s transform ease;
    }
    details[open] > summary:after {
        transform: translate(-50%, -50%) rotate(360deg);
    }
    details[open] > div {
        padding: 0px 20px;
        margin-top: -25px;
    }
    details .leftButton {
        margin-right: 10px;
    }
    details button {
        width: 45px;
        height: 45px;
        padding: 5px;
        justify-content: center;
        align-items: center;
        color: rgb(34,142,93);
        border-radius: 6px;
        background: #363636;
        border: none;
        font-size: 25px;
        margin-bottom: 10px;
        margin-right: 10px;
    }
    details button.active {
        border: 1.6px solid #07C682;
        background: linear-gradient(180deg, rgba(7, 198, 130, 0.12) 0%, rgba(7, 198, 130, 0.00) 100%), #363636;
    }
    details input.input{
        width: 77%;
        padding: 6px;
        border-radius: 6px;
        height: 20px;
        background: #303030;
        color: white;
        border: 1px solid rgb(54, 54, 54);
    }
 
    details input[type=checkbox] {
        width: auto;
    }
    details input[type=checkbox]:after {
        border-radius: 4px;
    }
    </style>
    `;
    return  XenForo.alert(
        `${html_prem}`, 'BetterLZT (native) v.'+version
    )
}
 
async function EmojiSet(emoji) {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    request(`${server}/v5/emoji?user=${nickname}&emoji=${emoji}`).catch(e => {
        XenForo.alert("Ошибка синхронизации с сервером, попробуйте еще раз", 1, 10000)
    });
    cacheSync();
    location.reload();
}
 
async function BgSet() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    bg = document.querySelector("#bgurl").value
    request(`${server}/v5/bg?user=${nickname}&bg=${bg}`).catch(e => {
        XenForo.alert("Ошибка синхронизации с сервером, попробуйте еще раз", 1, 10000)
    });
    cacheSync();
    location.reload();
}
 
async function SecretSet() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    secretph = document.querySelector("#secretph").value;
    setSecretph(secretph);
}
 
 
async function ColorSet() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    bg = document.querySelector("#colorbg").value
    request(`${server}/v5/color?user=${nickname}&color=${bg}`).catch(e => {
        XenForo.alert("Ошибка синхронизации с сервером, попробуйте еще раз", 1, 10000)
    });
    cacheSync();
    location.reload();
}
 
async function marketRender() {
    if (document.location.host != "lzt.market") {return false;}
    if(window.location.href.includes('goods/add')) {
        if(document.querySelector(".bbCodeSpoilerContainer")){
            document.querySelector(".bbCodeSpoilerContainer button").click()
        }
    }
 
     if (await marketblock == 'on') {
		alerts = document.querySelectorAll(".itemIgnored");
        alerts.forEach(function (e){
            e.remove();
        })
	}
 
    if(document.querySelector(".sidebarUserAvatar") && await avamarket == 'on') {
        document.querySelector(".sidebarUserAvatar").remove();
    }
}
 
function secretSecurity() {
    return XenForo.alert(`Сторонние расширения имеют доступ к пользовательским настройкам BetterLZT. и могут использовать это в корыстных целях
Если вы используете сторонние расширение от малоизвестных авторов - рекомендуем не пользоваться данной функцией ИЛИ
удалить сторонние расширения.
Имеются вопросы по сторонним расширениям? Свяжитесь со мной - t.me/hasantigiev`, "Безопасность превыше всего!")
}