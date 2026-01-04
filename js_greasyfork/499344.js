// ==UserScript==
// @name         UIflix for Uflix
// @namespace    https://klash.dev/
// @version      1.2.0
// @description  Much improved UI for Uflix.
// @author       GavinGoGaming
// @match        https://uflix.cc/*
// @license      GPL-2.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uflix.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499344/UIflix%20for%20Uflix.user.js
// @updateURL https://update.greasyfork.org/scripts/499344/UIflix%20for%20Uflix.meta.js
// ==/UserScript==

(function() {
    var playButtons = {
        sPlayer: ()=>{
            document.querySelector("#ve-iframe").contentWindow.document.querySelector('.play-btn').click()
        },
        btnX: ()=>{
            // Cross origin wont allow this.
            // Dealing with uflix (and embedded site) anti-devtools sucks.
            // If someone figures it out, the btnX play button is in:
            // iframe#ve-iframe > iframe#ve-iframe > #content > .playbtnx
            // Sadly, iframe 2 is from 2embed.cc so its cross origin.
        },
     }
    function format(number){
        return number.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });
    }
    const isEpisode = location.pathname.includes('/episode/');
    var show;
    var linkData;
    var episodes;
    if (isEpisode) {
        show = location.pathname.substr('/episode/'.length).split('/')[0];
        linkData = {
            episode: parseInt(location.pathname.substr('/episode/'.length).split('/')[1].substr(4,5)),
            season: parseInt(location.pathname.substr('/episode/'.length).split('/')[1].substr(1,3))
        }
        episodes = {
            current: `S${format(linkData.season)}E${format(linkData.episode)}`,
            back: `S${format(linkData.season)}E${format(linkData.episode-1)}`,
            next: `S${format(linkData.season)}E${format(linkData.episode+1)}`
        };
    }
    const streams = document.querySelector('.card-stream');
    const nav = document.querySelector("body > div.container > div > div > div.col-lg-auto");
    const head = document.head;
    const body = document.body;
    function theatreMode() {
        nav.style.left="-5px";
        nav.style.top="3rem";
        nav.style.position = "absolute";
        nav.style.background = "#111";
        nav.style.borderRadius="0px 25px 25px 0px";
        nav.style.maxWidth = `${((document.body.clientWidth-1600)/2)-2}px`;
        nav.style.padding="40px 40px 40px 6px";
        nav.querySelector('.w-lg-250').className="";
        body.appendChild(nav);
    }
    function undoTheaterMode() {
        const newPar = document.querySelector('.layout-app > .row');
        nav.style = "";
        nav.querySelector('div').className="w-lg-250";
        newPar.insertAdjacentElement('afterbegin',nav);
    }
    head.insertAdjacentHTML('beforeend', `<link href="https://site-assets.fontawesome.com/releases/v6.5.0/css/all.css" rel="stylesheet" />`);
    for (const child of streams.children) {
        child.innerHTML = child.innerHTML.replace('Stream #','<i class="fa-solid fa-server"></i> ');
    }
    streams.insertAdjacentHTML('beforebegin', `
${isEpisode ? `<div class="card-stream mt-2">
    <a href="/episode/${show}/${episodes.back}" class="btn btn-stream btn-ghost btn-sm me-1" role="button">Last (E${format(linkData.episode-1)})</a>
    <a class="btn btn-stream btn-ghost btn-sm me-1 active" role="button">S${format(linkData.season)}E${format(linkData.episode)}</a>
    <a href="/episode/${show}/${episodes.next}" class="btn btn-stream btn-ghost btn-sm me-1" role="button">Next (E${format(linkData.episode+1)})</a>
</div>` : ``}
<div class="card-stream mt-2">
    <a class="btn btn-ghost btn-sm me-1 uiflix-autoplay disabled" disabled role="button">Autoplay (Soon)</a>
    <a class="btn btn-ghost btn-sm me-1 uiflix-autoskip" role="button">Skip First <i class="fa-solid fa-play"></i> Button (${window.localStorage.uifskipfirst=="true"?'On':'Off'})</a>
    <a class="btn btn-ghost btn-sm me-1 uiflix-tmode" role="button">Theater Mode <i class="fa-solid fa-film"></i> (${window.localStorage.uifTheatre=="true"?'On':'Off'})</a>
</div>
<div class="card-stream mt-2">
    <input type="color" style="outline: none; background: none; padding: 0; border-radius: 10px; width: 28px; border: none; margin: 5px;" colorpick-skip="1" class="uiflix-color-bg" value="#3568D3">Background</input>
    <input type="color" style="outline: none; background: none; padding: 0; border-radius: 10px; width: 28px; border: none; margin: 5px;" class="uiflix-color-primary" colorpick-skip="1" value="#3568D3">Primary</input>
    <button style="outline: none; background: #1e1e23; color:white; padding: 0; border-radius: 10px; border: none; margin: 5px;" class="uiflix-color-reset"><i class="fa-solid fa-refresh"></i> Reset</button>
</div>`);

    const autoskip = document.querySelector('.uiflix-autoskip');
    const tmode = document.querySelector('.uiflix-tmode');
    const colors = {
        bg: document.querySelector('.uiflix-color-bg'),
        theme: document.querySelector('.uiflix-color-primary'),
        reset: document.querySelector('.uiflix-color-reset')
    };
    const setProp = (varname, prop) => document.documentElement.style.setProperty('--'+varname, prop);
    autoskip.addEventListener('click',()=>{
        window.localStorage.uifskipfirst = (window.localStorage.uifskipfirst ? (window.localStorage.uifskipfirst=="true"?"false":'true') : true);
        autoskip.innerHTML = `Skip First <i class="fa-solid fa-play"></i> Button (${window.localStorage.uifskipfirst=="true"?'On':'Off'})`;
    });
    tmode.addEventListener('click',()=>{
        window.localStorage.uifTheatre = (window.localStorage.uifTheatre ? (window.localStorage.uifTheatre=="true"?"false":'true') : true);
        tmode.innerHTML = `Theater Mode <i class="fa-solid fa-film"></i> (${window.localStorage.uifTheatre=="true"?'On':'Off'})`;
        if(window.localStorage.uifTheatre=="true") {theatreMode();} else {undoTheaterMode();}
    });
    document.querySelector("#ve-iframe").onload = (()=>{
        if(window.localStorage.uifskipfirst && window.localStorage.uifskipfirst == "true") {
            playButtons.sPlayer();
        }
    });
    colors.bg.onchange = () => {
        setProp('background', colors.bg.value);
        window.localStorage.uifColorBG = colors.bg.value;
    };
    colors.theme.onchange = () => {
        setProp('theme-color', colors.theme.value);
        window.localStorage.uifColorTheme = colors.theme.value;
    };
    colors.reset.onclick = () => {
        setProp('theme-color', '#3568D3');
        setProp('background', '#3568D3');
        colors.bg.value = '#3568D3';
        colors.theme.value = '#3568D3';
        window.localStorage.uifColorTheme = '#3568D3';
        window.localStorage.uifColorBG = '#3568D3';
    };
    document.body.onload = ()=>{
        document.querySelector('.layout-section > center').style.display="none";
        if(window.localStorage.uifTheatre && window.localStorage.uifTheatre == "true") {
            theatreMode();
        }
        if(window.localStorage.uifColorTheme) {
            colors.theme.value = window.localStorage.uifColorTheme;
            setProp('theme-color', window.localStorage.uifColorTheme);
        }
        if(window.localStorage.uifColorBG) {
            colors.bg.value = window.localStorage.uifColorBG;
            setProp('background', window.localStorage.uifColorBG);
        }
    };
})();