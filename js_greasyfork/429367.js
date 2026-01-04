// ==UserScript==
// @name         </> Kurt Mod - Uydu Dengesi
// @namespace    -
// @version      1.2
// @description  !arama
// @author       Kurt
// @match        zombs.io
// @match        http://tc-mod-js.glitch.me/
// @icon         https://cdn.discordapp.com/emojis/853002908924510240.gif?v=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429367/%3C%3E%20Kurt%20Mod%20-%20Uydu%20Dengesi.user.js
// @updateURL https://update.greasyfork.org/scripts/429367/%3C%3E%20Kurt%20Mod%20-%20Uydu%20Dengesi.meta.js
// ==/UserScript==

window.altNames = "";

let sm = document.querySelector("#hud-menu-settings");

sm.style.backgroundColor = "rgba(28, 92, 65, 0.55)";
sm.style.border = "5px solid white";

sm.innerHTML = `
<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css">
<style>
::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 10px;
	background-color: #d3d3d3;
}
::-webkit-scrollbar {
	width: 12px;
    height: 0px;
    border-radius: 10px;
	background-color: #F5F5F5;
}
::-webkit-scrollbar-thumb {
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #6fa890;
}
.tab {
    border-top-left-radius: 35%;
    border-top-right-radius: 35%;
    background-color: #6fa890;
    width: 150px;
    height: 50px;
    border: 4px solid white;
    display: inline-block;
    text-align: center;
    color: black;
}
#addtab {
    background-color: #35594a;
    margin-left: 175px;
    margin-top: -40px;
}
.rmtab {
    background-color: rgba(0, 0, 0, 0);
    border-color: rgba(0, 0, 0, 0);
    font-weight: bold;
}
.btn-fixed {
    display: inline-block;
    height: 25px;
    line-height: 25px;
    padding: 0 12px;
    background: #444;
    color: #eee;
    border: 0;
    font-size: 14px;
    vertical-align: top;
    text-align: center;
    text-decoration: none;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    transition: all 0.15s ease-in-out;
}
.search-bar {
	background-color: #FFF;
	background-image: linear-gradient(to bottom right, rgba(118, 168, 111, 0.85), rgba(111, 168, 158, 0.85), rgba(131, 189, 117, 0.8));
    outline: none;
    border: 2px solid white;
    border-radius: 5px;
    color: white;
    text-shadow: 1.5px 1.5px 1px #41593b;
    font-size: 16px;
    vertical-align: middle;
}
::placeholder {
  color: white;
  text-shadow: 1.5px 1.5px 1px #41593b;
}
* {
   /* font-family: Hammersmith One; */
}
#searchpgs {
    width: 80%;
    height: 25px;
}
</style>
<div id="tabs">
    <div class="tab" id="tab1">
        <p>
            Sekme Menüsü
            <button class="rmtab" id="rmtab1">x</button>
        </p>
    </div>
</div>
<button class="btn" id="addtab">+</button>
<br />
<center>
<button class="btn-fixed search-bar" onclick="window.bfb();"><i class="fa fa-angle-left"></i></button>
<button class="btn-fixed search-bar" onclick="window.bff();"><i class="fa fa-angle-right"></i></button>
<input class="btn-fixed search-bar" style="width: 70%; height: 25px; vertical-align: middle;" type="search" placeholder="Tüm Menü Sayfalarını Ara..." id="searchpgs" />
<button class="btn-fixed search-bar" id="srchbtn"><i class="fa fa-search"></i></button></center>
<hr />
<div id="pageDisp">
</div>
`

let searchpgs = document.getElementById("searchpgs");
let srchbtn = document.getElementById("srchbtn");

searchpgs.addEventListener("keydown", function(e) {
    if(e.keyCode === 13) {
        window.searchTab(this.value);
    };
});

srchbtn.addEventListener("click", function(e) {
    window.searchTab(searchpgs.value);
});

window.focusedTab = 1;

let tabId = 2;
let tabs = document.getElementById("tabs");
let addTab = document.getElementById("addtab");
let addTabRightEffect = 175;
let addTabDownEffect = -40;
let tabsAmt = 1;
let pageDisp = document.getElementById("pageDisp");
let tabsData = [{
    type: "mainMenu",
    html: `
    <h1>Uydu Dengesi</h1>
    <p>Developer: <strong>Pasific</strong></p>
    <p>Çeviri: <strong>Kurt</strong></p>
    <hr />
    <h2>Katagoriler</h3>
    <button class="btn btn-blue" onclick="window.redirectTab('Altlar', 'alts')">Altlar</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Skore', 'score')">Skore</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Dalgalar', 'waves')">Dalgalar</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Atak', 'offense')">Atak</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Savunma', 'defense')">Savunma</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Çeşitli', 'misc')">Çeşitli</button>
    `,
    keywords: []
}, {
    type: "score",
    html: `
    <h1>Skore</h1>
    <hr />
    <button class="btn btn-green" onclick="window.redirectTab('Oyuncu Hilesi', 'playertrick')">Oyuncu Hilesi</button>
    <button class="btn btn-green" onclick="window.redirectTab('Skor İstatistikleri', 'ssts')">Skor İstatistikleri</button>
    `,
    keywords: ["score", "wr", "4player", "4p", "trick", "base"],
    name: "Skore",
    category: true
}, {
    type: "waves",
    html: `
    <h1>Dalgalar</h1>
    <hr />
    <button class="btn btn-green" onclick="window.redirectTab('Altlar', 'alts')">Altlar</button>
    `,
    keywords: ["wave", "wr", "base", "alt", "bot", "clone"],
    name: "Dalgalar",
    category: true
}, {
    type: "alts",
    html: `
    <h1>Alt Sekme Oyuncu</h1>
    <button class="btn btn-green" onclick="window.sendWs();">Oyuncu Gönder</button>
    <input type="text" maxlength="29" placeholder="Oyuncu İsmi" id="BotName" class="btn btn-grey">
    <select id="slctbnv">
    </select>
    <button class="btn btn-green" id="ALTname">İsim Kayıt</button>
    <br />
    <h1 id="nfnlt"># Yapılandırılan Oyuncular: //nlt</h1>
    <p><strong><i class="fa fa-exclamation-circle"></i> Alt'ları kaldırmak hala devam eden bir çalışmadır, bazen çalışmayabilir</strong></p>
    <div id="pches">
    </div>
    <hr />
    <button class="btn btn-green" onclick="window.redirectTab('Oyuncu Hileleri', 'playertrick')">Oyuncu Hileleri</button>
    `,
    keywords: ["alt", "bot", "4p", "trick", "fill", "clone"],
    name: "Altlar",
    cache: ``,
    category: true,
    script: `
let slctbnv = document.getElementById("slctbnv");
slctbnv.innerHTML = window.altNames;
let bn = document.getElementById("BotName");
let an = document.getElementById("ALTname");
slctbnv.onchange = () => {
    bn.value = this.value;
};
an.onclick = () => {
    let bnv = bn.value;
    localStorage.name = bnv;
    window.altNames += '<br><option value="' + bnv + '">' + bnv + '</option>';
    window.focusTab(window.focusedTab, { pche: window.getTabDataByType("alts").cache, nlt: window.nlt });
};
    `
}, {
    type: "offense",
    html: `
    <h1>Atak</h1>
    <hr />
    `,
    keywords: ["raid", "kill", "offense", "offend"],
    name: "Atak",
    category: true
}, {
    type: "defense",
    html: `
    <h1>Savunma</h1>
    <hr />
    <button class="btn btn-green" onclick="window.redirectTab('AFS', 'afs')">AFS</button>
    <button class="btn btn-green" onclick="window.redirectTab('Otomatik Canlandırma', 'arp')">Otomatik Canlandırma</button>
    `,
    keywords: ["defense", "defend", "anti", "rebuild", "re build", "auto rebuild", "autorebuild", "auto", "shield", "fixed shield", "fixedshield", "afs", "arp", "revive", "pet"],
    name: "Savunma",
    category: true
}, {
    type: "playertrick",
    html: `
    <h1>Oyuncu Numaraları</h2>
    <button class="btn" id="tglpt"></button>
    <p><strong><i class="fa fa-info-circle"></i> Mevcut alternatifler için geçerli olacak, onları göndermeyecek</strong></p>
    <hr />
    <h2>İlgili Sayfalar</h2>
    <button class="btn btn-green" onclick="window.redirectTab('Altlar', 'alts')">Altlar</button>
    <button class="btn btn-blue" onclick="window.redirectTab('Skore', 'score')">Skore</button>
    `,
    script: `
    let tglpt = document.getElementById("tglpt");

    if(window.playerTrickToggle) {
        tglpt.classList.add("btn-red");
        tglpt.innerText = "Oyuncu Numarasını Devre Dışı Bırak"
    } else {
        tglpt.classList.add("btn-green");
        tglpt.innerText = "Oyuncu Numarasını Etkinleştir"
    };

    tglpt.addEventListener("click", function() {
        if(this.classList.contains("btn-green")) {
            this.classList.replace("btn-green", "btn-red");
            this.innerText = "Oyuncu Numarasını Devre Dışı Bırak";
        } else {
            this.classList.replace("btn-red", "btn-green");
            this.innerText = "Oyuncu Numarasını Etkinleştir";
        };
        window.togglePlayerTrick();
    });
    `,
    keywords: ["4p", "4player", "trick", "score", "wr", "bot", "alt", "4 player"],
    name: "Player Trick",
    category: false
}, {
    type: "search",
    html: `
    <h1>//sqt</h1>
    <div>
    //rsl
    </div>
    `,
    keywords: []
}, {
    type: "afs",
    html: `
    <h1>Otomatik Düzeltme Kalkanı</h1>
    <button id="afstgl" class="btn"></button>
    <p><strong><i class="fa fa-question-circle"></i> Düşük kalkan sağlığı sorununu düzeltirken otomatik olarak maksimum kalkan katmanına yükseltmeye çalışır</strong></p>
    <hr />
    <h2>İlgili Sayfalar</h2>
    <button class="btn btn-blue" onclick="window.redirectTab('Savunma', 'defense')">Savunma</button>
    `,
    script: `
    let tglpt = document.getElementById("afstgl");

    if(window.afsToggle) {
        tglpt.classList.add("btn-red");
        tglpt.innerText = "AFS Devre Dışı Bırak"
    } else {
        tglpt.classList.add("btn-green");
        tglpt.innerText = "AFS Etkinleştir"
    };

    tglpt.addEventListener("click", function() {
        if(this.classList.contains("btn-green")) {
            this.classList.replace("btn-green", "btn-red");
            this.innerText = "AFS Devre Dışı Bırak";
        } else {
            this.classList.replace("btn-red", "btn-green");
            this.innerText = "AFS Etkinleştir";
        };
        window.toggleAFS();
    });
    `,
    keywords: ["afs", "defense", "shield", "fix"],
    name: "AFS",
    category: false
}, {
    type: "arp",
    html: `
    <h1>Evcil Hayvanları Otomatik Canlandır</h1>
    <button id="arptgl" class="btn"></button>
    <p><strong><i class="fa fa-exclamation-circle"></i> Gecikme yaratabilir</strong></p>
    <hr />
    <h2>İlgili Sayfalar-</h2>
    <button class="btn btn-green" onclick="window.redirectTab('Savunma', 'defense')">Savunma</button>
    `,
    script: `
    let arptgl = document.getElementById("arptgl");

    if(window.arpToggle) {
        arptgl.classList.add("btn-red");
        arptgl.innerText = "Canlandırmayı Devre Dışı Bırak"
    } else {
        arptgl.classList.add("btn-green");
        arptgl.innerText = "Canlandırmayı Etkinleştir"
    };

    arptgl.addEventListener("click", function() {
        if(this.classList.contains("btn-green")) {
            this.classList.replace("btn-green", "btn-red");
            this.innerText = "Canlandırmayı Devre Dışı Bırak";
        } else {
            this.classList.replace("btn-red", "btn-green");
            this.innerText = "Canlandırmayı Etkinleştir";
        };
        window.toggleARP();
    });
    `,
    name: "Otomatik Canlandırma",
    keywords: ["arp", "revive", "pet", "defense"],
    category: false
}, {
    type: "misc",
    html: `
    <h1>Çeşitli</h1>
    `,
    name: "Çeşitli",
    keywords: ["misc", "zoom"],
    category: true
}, {
    type: "ssts",
    html: `
    <h1>Skore İstatistikleri</h1>
    <p id="aspw">Ortalama SPW / Oyuncu: N/A</p>
    `,
    name: "Skore İstatistikleri",
    keywords: ["score", "stat", "analytic"],
    category: false
}];
let currentTabs = [{
    elem: document.getElementById("tab1"),
    type: "mainMenu",
    id: 1,
    ict: 0
}];
let bfTabs = [{ title: "Sekme Menüsü", type: "mainMenu", html: tabsData[0].html }];
let bfIndex = 0;

window.nlt = 0;

//pageDisp.style.overflow = "kaydır";
sm.style.overflow = "scroll";

addTab.style.transition = "margin 300ms";

const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
window.scores = [];

game.network.addRpcHandler("DayCycle", () => {
    window.newScore = game.ui.playerTick.score;
    window.scores.push(window.newScore - window.oldScore)
    window.oldScore = game.ui.playerTick.score;
    let cts = currentTabs[window.focusedTab];
    if(cts) {
        if(cts.type === "ssts") { document.getElementById("aspw").innerText = `Average SPW: ${arrAvg(window.scores)}`; };
    };
});

window.getTabDataByType = type => tabsData.find(i => i.type === type);

const getTabById = id => currentTabs.find(i => i.id === id);

pageDisp.innerHTML = window.getTabDataByType("mainMenu").html;

const hint = (txt, time) => {
    game.ui.components.PopupOverlay.showHint(txt, time);
};

const addRmTabFunctionality = (element, ict) => {
    element.addEventListener("click", function(e) {
        e.stopPropagation();
        this.parentElement.parentElement.remove();
        addTab.style.marginLeft = `${addTabRightEffect -= 150}px`;
        if((tabsAmt--) <= 1) {
            addTab.style.marginTop = `0px`;
        } else {
            addTab.style.marginTop = `-40px`;
        };
        addTab.style.display = "block";

        let ct = document.getElementsByClassName("tab");
        let ctl = ct[ct.length - 1];

        if(ctl) {
            let ctlid = parseInt(ctl.id.replace("tab", ""));
            window.focusTab(ctlid, true);
        };

        currentTabs.splice(ict, 1);

        if(tabsAmt === 0) {
            pageDisp.innerHTML = ``;
        };

        for(let itc of currentTabs) {
            itc.ict = currentTabs.indexOf(itc);
        };
    });
};

const addTabFocusOnClickFunctionality = element => {
    element.addEventListener("click", function(e) {
        let irddt = {};
        let ird = parseInt(this.id.replace("tab", ""));
        try {
            irddt = window.getTabDataByType(currentTabs[ird - 1].type);
        } catch {};
        window.focusTab(ird, { pche: irddt.cache || "", nlt: window.nlt });
        console.log(ird);
    });
};

addRmTabFunctionality(document.getElementById("rmtab1"));
addTabFocusOnClickFunctionality(document.getElementById("tab1"));

window.focusTab = (id, data) => {
    window.focusedTab = id;
    for(let i of currentTabs) {
        if(i.id !== id) {
            i.elem.style.backgroundColor = "#4b806a";
        } else if(i.id === id) {
            i.elem.style.backgroundColor = "#6fa890";
            let tdt = window.getTabDataByType(i.type);

            let vtdth = tdt.html;

            for(let iokvtd in data) {
                vtdth = vtdth.replaceAll(`//${iokvtd}`, data[iokvtd]);
            };

            pageDisp.innerHTML = vtdth;
            if(tdt.script) {
                eval(tdt.script);
            };
        } else {
            i.elem.style.backgroundColor = "#4b806a";
        };
    };
};

window.makeTab = (text, type) => {

    if((tabsAmt + 1) > 3) {
        addTab.style.display = "none";
        return;
    } else { tabsAmt++; };

    let tab = document.createElement("div");
    tab.classList.add("tab");
    tab.innerHTML = `
    <p>
        ${text}
        <button class="rmtab" id="rmtab${tabId}">x</button>
    </p>
    `;
    tab.id = `tab${tabId}`;
    console.log(tab.id);
    tabs.append(tab);

    let elem = document.getElementById(`tab${tabId}`);
    let ctobj = { elem: elem, type: type, id: tabId };

    let ict = currentTabs.length - 1;

    ctobj.ict = ict;

    currentTabs.push(ctobj);

    for(let itc of currentTabs) {
        itc.ict = currentTabs.indexOf(itc);
    };

    console.log(currentTabs);

    let tdt = window.getTabDataByType(type);

    window.focusTab(tabId, { sqt: text, pche: tdt.cache || "" });

    addTab.style.marginLeft = `${addTabRightEffect += 150}px`;

    console.log(`${tabsAmt} tabsAmt`);

    let oldTabId = tabId;
    tabId++;

    if(tabsAmt === 3) {
        addTab.style.display = "none";
    };

    if(tabsAmt >= 1) {
        addTab.style.marginTop = "-40px";
    };

    let currentRmTab = document.getElementById(`rmtab${oldTabId}`);
    addRmTabFunctionality(currentRmTab, ict);
    addTabFocusOnClickFunctionality(document.getElementById(`tab${oldTabId}`));

    bfTabs.push({ title: text, script: tdt.script, html: tdt.html, type: type });

    bfIndex++;

    return ctobj;
};

window.redirectTab = function(text, type) {
    let gd = getTabById(window.focusedTab);
    let gid = gd.elem;
    gid.innerHTML = `
    <p>
        ${text}
        <button class="rmtab" id="rmtab${gid.id}">x</button>
    </p>
    `;
    currentTabs[gd.ict].type = type;
    let tdt = window.getTabDataByType(type);
    pageDisp.innerHTML = tdt.html;

    bfTabs.push({ title: text, script: tdt.script, html: tdt.html, type: type });

    bfIndex++;
    if(tdt.script) {
        eval(tdt.script);
    };
    addRmTabFunctionality(document.getElementById(`rmtab${gid.id}`), gid.ict);

    let idrtd = gd.id;
    let irddt = window.getTabDataByType(currentTabs[idrtd - 1].type);
    window.focusTab(idrtd, { pche: irddt.cache || "", nlt: window.nlt });
};

window.redirectTab2 = function(text, type) {
    let gd = getTabById(window.focusedTab);
    let gid = gd.elem;
    gid.innerHTML = `
    <p>
        ${text}
        <button class="rmtab" id="rmtab${gid.id}">x</button>
    </p>
    `;
    currentTabs[gd.ict].type = type;
    let tdt = window.getTabDataByType(type);
    pageDisp.innerHTML = tdt.html;
    if(tdt.script) {
        eval(tdt.script);
    };
    addRmTabFunctionality(document.getElementById(`rmtab${gid.id}`), gid.ict);

    let idrtd = gd.id;
    let irddt = window.getTabDataByType(currentTabs[idrtd - 1].type);
    window.focusTab(idrtd, { pche: irddt.cache || "", nlt: window.nlt });
};

window.bfRedirect = index => {
    let bfri = bfTabs[index];
    window.redirectTab2(bfri.title, bfri.type);
};

window.bfb = () => {
    let bfim = bfTabs[bfIndex - 1];
    if(bfim) {
        window.bfRedirect(bfIndex---1);
    };
};

window.bff = () => {
    let bfip = bfTabs[bfIndex + 1];
    if(bfip) {
        window.bfRedirect(bfIndex+++1);
    };
};

const qryify = qry => {
    return (qry.length > 2) ? `${qry.slice(0, 2)}...` : qry
};

window.searchTab = function(query) {
    if(getTabById(window.focusedTab)) {
        let gd = getTabById(window.focusedTab);
        let gid = gd.elem;

        let rsl = ``;

        for(let itd of tabsData) {
            for(let itkd of itd.keywords) {
                if(query.toLowerCase().includes(itkd) && !rsl.includes(itd.name)) {
                    rsl += `<button onclick="window.redirectTab('${itd.name}', '${itd.type}')" class="btn btn-${itd.category ? "blue" : "green"}">${itd.name}</button><br />`;
                };
            };
        };

        if(rsl.length === 0) { rsl = `İçin Hiç Sonuç Bulunamadı ${query}`; };

        let data = {
            sqt: `Sonuçlar: ${query}`,
            rsl: rsl
        };

        gid.innerHTML = `
    <p>
        Arama - ${qryify(query)}
        <button class="rmtab" id="rmtab${gid.id}">x</button>
    </p>
    `;
        gid.type = "search";
        let tdt = window.getTabDataByType("search");

        let vtdth = tdt.html;

        for(let iokvtd in data) {
            vtdth = vtdth.replaceAll(`//${iokvtd}`, data[iokvtd]);
        };

        pageDisp.innerHTML = vtdth;

        if(tdt.script) {
            eval(tdt.script);
        };
        addRmTabFunctionality(document.getElementById(`rmtab${gid.id}`), gid.ict);

    } else {
        window.makeTab(`Arama - ${qryify(query)}`, "search");
    };
};

addTab.addEventListener("click", function() {
    window.makeTab("Sekme Menüsü", "mainMenu");
});

let sockets = [];
window.sendWs = () => {
    document.getElementById("nfnlt").innerHTML = `# Oyuncuların: ${window.nlt+++1}`;

    let hc = `
    <div id="rmalt${window.nlt}">
        <br />
        <button class="btn btn-red" onclick="window.rmAlt(${window.nlt});" id="rmaltbtn${window.nlt}"><i class="fa fa-trash"></i> Oyuncunu Kaldır #${window.nlt}</button>
    </div>
    `;

    let iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `http://zombs.io/#/${game.options.serverId}/${game.ui.getPlayerPartyShareKey()}`;
    let ifd = `s${Math.floor(Math.random() * 100000)}`;
    iframe.id = ifd;
    document.body.append(iframe);

    let ifde = document.getElementById(ifd);
    ifde.addEventListener('load', function() {
        this.contentWindow.eval(`
document.querySelector(".hud-intro-play").click();
game.network.addEnterWorldHandler(() => {
    console.log("loaded alt");
    game.network.sendInput({ left: 1, up: 1 });
    game.stop();
});
`);
    });
    let si = sockets.length;
    ifde.rmh = hc;
    ifde.si = si;
    ifde.nli = window.nlt;
    sockets.push(ifde);

    window.getTabDataByType("alts").cache += hc;
    window.focusTab(window.focusedTab, { nlt: window.nlt, pche: window.getTabDataByType("alts").cache });
};

window.rmAlt = num => {
    let sck = sockets[num-1];
    window.nlt--;
    console.log(num);
    sck.remove();

    console.log(sck.nli);

    document.getElementById(`rmalt${sck.nli}`).remove();

    window.getTabDataByType("alts").cache = document.getElementById("pches").innerHTML;

    window.focusTab(window.focusedTab, { nlt: window.nlt, pche: window.window.getTabDataByType ("alts").cache });
};

const kickAll = () => {
    for (let i in game.ui.playerPartyMembers) {
        if (game.ui.playerPartyMembers[i].playerUid == game.ui.playerTick.uid) continue;
        game.network.sendRpc({
            name: "KickParty",
            uid: game.ui.playerPartyMembers[i].playerUid
        });
    };
};

const joinAll = () => {
    sockets.forEach(socket => {
        console.log(socket);
        socket.contentWindow.eval(`
            game.network.sendRpc({
			    name: "JoinPartyByShareKey",
			    partyShareKey: "${game.ui.getPlayerPartyShareKey()}"
		    });
        `);
    });
};



let isDay,
    tickStarted,
    tickToEnd,
    hasKicked = false,
    hasJoined = false;

game.network.addEntityUpdateHandler(tick => {
    if(window.playerTrickToggle) {
        if (!hasKicked) {
            if (tick.tick >= tickStarted + 18 * (1000 / game.world.replicator.msPerTick)) {
                kickAll();
                hasKicked = true;
            };
        };
        if (!hasJoined) {
            if (tick.tick >= tickStarted + 118 * (1000 / game.world.replicator.msPerTick)) {
                joinAll();
                hasJoined = true;
            };
        };
    };
});

game.network.addRpcHandler("DayCycle", e => {
    isDay = !!e.isDay;
    if (!isDay) {
        tickStarted = e.cycleStartTick;
        tickToEnd = e.nightEndTick;
        hasKicked = false;
        hasJoined = false;
    };
});

window.togglePlayerTrick = () => {
    window.playerTrickToggle = !window.playerTrickToggle;
};

let chatSocket = new WebSocket('wss://iGniTioN.eh7644.repl.co/');
const fakeMessage = (name, message) => {
    let chatUi = game.ui.getComponent("Chat");
    var messageElem = chatUi.ui.createElement(`<div class=\"hud-chat-message\"><strong style=\"color:gray;\">${name}</strong>: ${message}</div>`);
    chatUi.messagesElem.appendChild(messageElem);
    chatUi.messagesElem.scrollTop = chatUi.messagesElem.scrollHeight;
};

const chatLog = msg => {
    let chatUi = game.ui.getComponent("Chat");
    var messageElem = chatUi.ui.createElement(`<div class=\"hud-chat-message\"><p style=\"color: orange\">${msg}</p></div>`);
    chatUi.messagesElem.appendChild(messageElem);
    chatUi.messagesElem.scrollTop = chatUi.messagesElem.scrollHeight;
};

chatSocket.onmessage = msg => {
    let parsed = JSON.parse(msg.data);
    switch(parsed.type) {
        case "chat":
            fakeMessage(parsed.name, parsed.message);
            break;
        case "dm":
            fakeMessage(parsed.from, parsed.message);
        case "log":
            chatLog(parsed.content);
            break;
    };
};

window.sendGlobalMsg = (author, content) => {
    chatSocket.send(JSON.stringify({ type: "chat", name: author, message: content }));
};

window.sendDM = (to, content) => {
    chatSocket.send(JSON.stringify({ type: "dm", to: to, content: content }));
};

game.network.addEnterWorldHandler(() => {
    document.querySelector("#hud-chat > input").addEventListener('keypress', function(e) {
        if(e.keyCode === 13) {
            if(this.value.toLowerCase().startsWith('/chat')) {
                window.sendGlobalMsg(game.ui.playerTick.name, this.value.slice(6));
                this.value = "";
            } else if(this.value.toLowerCase().startsWith('/dm')) {
                let args = this.value.split(' ');
                window.sendDM(args[1], this.value.slice(args[1].length + 4));
                this.value = "";
            } else if(this.value.toLowerCase().startsWith('/users')) {
                chatSocket.send(JSON.stringify({ type: "getUsers" }));
                this.value = "";
            };
        };
    });

    setTimeout(() => {
        chatSocket.send(JSON.stringify({ type: "init", username: game.ui.playerTick.name }));
    }, 750);
});

// Sohbet Şu Anda Devre Dışı Olduğu İçin Yorum Yapıldı

const fixShield = () => {
    if(game.world.inWorld) {
        if (game.ui.playerTick.zombieShieldHealth < 85000 && window.afsToggle) {
            game.network.sendRpc({name: "EquipItem", itemName: "ZombieShield", tier:  Game.currentGame.ui.inventory.ZombieShield.tier});
        };
    };
};
game.network.addRpcHandler("DayCycle", fixShield);

window.toggleAFS = function() {
    window.afsToggle = !window.afsToggle;
};

const revive = () => {
    let rae = document.querySelector("a.hud-shop-actions-revive");
    if(rae) {
        rae.click();
    };
};

setInterval(() => {
    if(window.arpToggle) {
        revive();
    };
}, 250);


window.toggleARP = function() {
    window.arpToggle = !window.arpToggle;
};