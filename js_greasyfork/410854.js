// ==UserScript==
// @name         Pronote Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.5.5
// @description  Un thème sombre pour Pronote avec quelques petites améliorations
// @author       Dood Corp.
// @match        https://*/pronote*.html*
// @match        https://*.pronote.toutatice.fr/pronote/*.html*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://cdn.drawception.com/drawings/1005959/Kxtt6kLMgv.png
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/410854/Pronote%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/410854/Pronote%20Dark%20Mode.meta.js
// ==/UserScript==

var customThemes = {
    "BASE": {
        "colorMain": "#232325",
        "colorMenu": "#46484d",
        "colorMenuBis": "#626469",
        "colorWidget": "#303030",
        "colorTitles": "#a6b5b5",
        "colorSubMenu": "#a2a0a0",
        "backgroundUrl": 'url("https://wallpaperaccess.com/full/1811424.png")',
        "colorAccent": "#b7b7b7",
        "texteBaseColor": "#d2d2d2",
        "badConnectionBackground": 'linear-gradient(135deg, #252525 25%, transparent 25%), linear-gradient(225deg, #252525 25%, transparent 25%), linear-gradient(45deg, #252525 25%, transparent 25%), linear-gradient(315deg, #252525 25%, #000000 25%)',
    },
    "IKEA": {
        "colorMain": "#002565",
        "colorMenu": "#00338b",
        "colorMenuBis": "#0046be",
        "colorWidget": "#ac9729",
        "colorTitles": "#000000",
        "colorSubMenu": "#0358ea",
        "backgroundUrl": 'url("https://wallpaperaccess.com/full/1491613.jpg")',
        "colorAccent": "#c9ac13",
        "theme-foncee": "#c9ac13",
        "texteBaseColor": "white",
        "badConnectionBackground": 'linear-gradient(135deg, #FFDA1A 25%, transparent 25%), linear-gradient(225deg, #FFDA1A 25%, transparent 25%), linear-gradient(45deg, #FFDA1A 25%, transparent 25%), linear-gradient(315deg, #FFDA1A 25%, #0051BA 25%)'
    },
    "BRIGHT": {
        "colorMain": "#242582",
        "colorMenu": "#2F2FA2",
        "colorMenuBis": "#5050a4",
        "colorWidget": "#823d6e",
        "colorTitles": "#553D67",
        "colorSubMenu": "#5858b4",
        "backgroundUrl": 'url("https://img3.wallspic.com/originals/9/5/9/3/6/163959-lumiere-blue-purple-violette-magenta-1920x1080.jpg")',
        "colorAccent": "#c9002d",
        "theme-foncee": "#c9002d",
        "texteBaseColor": "#ffffff",
        "badConnectionBackground": 'repeating-radial-gradient( circle at 0 0, transparent 0, #242582 10px ), repeating-linear-gradient( #823d6e55, #823d6e )',
    },
    "FRESH": {
        "colorMain": "#05386B",
        "colorMenu": "#379683",
        "colorMenuBis": "#34ae6b",
        "colorWidget": "#379683",
        "colorTitles": "#000000",
        "colorSubMenu": "#004301",
        "backgroundUrl": 'url("https://wallpapercave.com/wp/wp2469518.jpg")',
        "colorAccent": "#0e331e",
        "theme-foncee": "#5CDB95",
        "texteBaseColor": "#000000",
        "badConnectionBackground": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='88' height='24' viewBox='0 0 88 24'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='autumn' fill='%23379683' fill-opacity='0.59'%3E%3Cpath d='M10 0l30 15 2 1V2.18A10 10 0 0 0 41.76 0H39.7a8 8 0 0 1 .3 2.18v10.58L14.47 0H10zm31.76 24a10 10 0 0 0-5.29-6.76L4 1 2 0v13.82a10 10 0 0 0 5.53 8.94L10 24h4.47l-6.05-3.02A8 8 0 0 1 4 13.82V3.24l31.58 15.78A8 8 0 0 1 39.7 24h2.06zM78 24l2.47-1.24A10 10 0 0 0 86 13.82V0l-2 1-32.47 16.24A10 10 0 0 0 46.24 24h2.06a8 8 0 0 1 4.12-4.98L84 3.24v10.58a8 8 0 0 1-4.42 7.16L73.53 24H78zm0-24L48 15l-2 1V2.18A10 10 0 0 1 46.24 0h2.06a8 8 0 0 0-.3 2.18v10.58L73.53 0H78z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    },
    "BLACKRED": {
        "colorMain": "#0b090a",
        "colorMenu": "#432424",
        "colorMenuBis": "#a4161a",
        "colorWidget": "#836866",
        "colorTitles": "#ba181b",
        "colorSubMenu": "#c42526",
        "backgroundUrl": 'url("https://cutewallpaper.org/21/red-and-black-wallpaper-4k/Material-Design-Dark-Red-Black-HD-Abstract-4k-Wallpapers-.jpg")',
        "colorAccent": "#e1080b",
        "theme-foncee": "#e5383b",
        "texteBaseColor": "#ffffff",
        "badConnectionBackground": `linear-gradient(135deg, #252525 25%, transparent 25%), linear-gradient(225deg, #252525 25%, transparent 25%), linear-gradient(45deg, #252525 25%, transparent 25%), linear-gradient(315deg, #252525 25%, #412424 25%)`
    }, 
    "NEON RIDER": {
        "colorMain": "#63074f",
        "colorMenu": "#ce0587",
        "colorMenuBis": "#b30074",
        "colorWidget": "#7ab1b4",
        "colorTitles": "#000000",
        "colorSubMenu": "#c20b7e",
        "backgroundUrl": 'url("https://cdnb.artstation.com/p/assets/images/images/017/038/695/large/tomas-taktikotikovich-neon-rider.jpg?1554395559")',
        "colorAccent": "#00faff",
        "theme-foncee": "#00faff",
        "texteBaseColor": "#006dab",
        "badConnectionBackground": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%2375AEB4' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%2300FAFF'%3E%3Ccircle cx='769' cy='229' r='9'/%3E%3Ccircle cx='539' cy='269' r='9'/%3E%3Ccircle cx='603' cy='493' r='9'/%3E%3Ccircle cx='731' cy='737' r='9'/%3E%3Ccircle cx='520' cy='660' r='9'/%3E%3Ccircle cx='309' cy='538' r='9'/%3E%3Ccircle cx='295' cy='764' r='9'/%3E%3Ccircle cx='40' cy='599' r='9'/%3E%3Ccircle cx='102' cy='382' r='9'/%3E%3Ccircle cx='127' cy='80' r='9'/%3E%3Ccircle cx='370' cy='105' r='9'/%3E%3Ccircle cx='578' cy='42' r='9'/%3E%3Ccircle cx='237' cy='261' r='9'/%3E%3Ccircle cx='390' cy='382' r='9'/%3E%3C/g%3E%3C/svg%3E")`
    }
}

var customJS = document.createElement('script');
customJS.type = "text/javascript"
customJS.innerHTML += `

function previousValue(el) {
    return el.previousElementSibling.value
}
function store(name, value) {
    if (name == "tryLimit" || name == "tryTiming") {
        if (value < 20 || value === null) {
            return false
        }
    }
    let tmp = JSON.parse(localStorage.getItem("pronoteDarkModeOptions"));
    tmp[name] = value;
    localStorage.setItem("pronoteDarkModeOptions", JSON.stringify(tmp));
}

function changeName(name) {
    document.getElementsByClassName("ibe_util_texte ibe_actif").item(0).innerText = name
}

function changeImage(url) {
    document.getElementsByClassName("ibe_util_photo ibe_actif").item(0).firstElementChild.src = url
}

function changeBackground(url) {
    if (!JSON.parse(localStorage.getItem("pronoteDarkModeOptions"))["badConnection"]) {
        document.querySelectorAll('[role="main"]')[0].style.backgroundImage = "url('" + url + "') !Important"
    }
}

function changeStyle(tochange, val) {
    if (tochange == "badConnectionBackground") {
        tochange = "backgroundUrl"
    }
    if (val.includes("http") && !val.includes("url(")) {
        val = 'url("' + val + '")'
    }
    document.documentElement.style.setProperty('--' + tochange, val);
}

var customThemes = ${JSON.stringify(customThemes)}

function changeCustomTheme(the) {
    let bckgrnd = getLocalStorageValue("badConnection") ? "badConnectionBackground" : "backgroundUrl"
    let names = ["colorMain", "colorMenu", "colorMenuBis", "colorWidget", "colorTitles", "colorSubMenu", bckgrnd, "colorAccent", "texteBaseColor"]
    names.forEach(el => {
        if (customThemes[the][el] != "" && customThemes[the][el] != undefined) {
            changeStyle(el, customThemes[the][el])
        } else if (customThemes[the][el] == undefined) {
            changeStyle(el, customThemes["BASE"][el])
        }
    })

    if (customThemes[the]["theme-foncee"] != undefined) {
        changeOverallTheme("theme-foncee", customThemes[the]["theme-foncee"])
    }
    let customTheme = getLocalStorageValue("customAccentColor")
    if (customTheme != "" && customTheme != undefined) {
        changeOverallTheme("theme-foncee", customTheme)
    }

    if (customThemes[the]["customCSS"] != undefined) {
        customThemes[the]["customCSS"].split("%sep%").forEach(element => {
            eval(element)
        });
    }

    if (getLocalStorageValue("backgroundUrl") != "" && getLocalStorageValue("backgroundUrl") != undefined) {
        changeStyle("backgroundUrl", getLocalStorageValue("backgroundUrl"))
    }
    
    store("loadedTheme", the)
}

function changeOverallTheme(the, val) {
    store("customAccentColor", val)
    if (document.getElementById("accentColorPicker") != null) {
        document.getElementById("accentColorPicker").value = JSON.parse(localStorage.getItem("pronoteDarkModeOptions"))["customAccentColor"]
    }
    document.querySelector("#div").style.setProperty("--" + the, val)
}

function getCurrentTheme() {
    document.querySelector("#div").classList.forEach(element => {
        if(element.includes("Theme")) {
            return element
        }
    });
}

function exportConfiguration() {
    let tmp = {} 
    let names = ["colorMain", "colorMenu", "colorMenuBis", "colorWidget", "colorTitles", "colorSubMenu", "backgroundUrl", "colorAccent", "theme-foncee", "texteBaseColor"]
    names.forEach(el => {
        switch (el) {
            case "theme-foncee":
                tmp[el] = document.querySelector("#div").style.getPropertyValue("--" + el)
                break;
            default :
                tmp[el] = document.documentElement.style.getPropertyValue("--" + el)

        }
    })

    return tmp
}

function getLocalStorageValue(key) {
    return JSON.parse(localStorage.getItem("pronoteDarkModeOptions"))[key]
}

function deleteLocalStorage(key) {
    let tmp = JSON.parse(localStorage.getItem("pronoteDarkModeOptions"))
    tmp[key] = ""
    localStorage.setItem("pronoteDarkModeOptions", JSON.stringify(tmp))
    changeCustomTheme(tmp["loadedTheme"])
}
`

function isInStorage(key, val) {
    if (getLocalStorageValue(key) == null) {
        let tmp = JSON.parse(localStorage.getItem("pronoteDarkModeOptions"));
        tmp.key = val;
        localStorage.setItem("pronoteDarkModeOptions", JSON.stringify(tmp));
    }
}

document.getElementsByTagName('head')[0].appendChild(customJS);

if (localStorage.getItem("pronoteDarkModeOptions") == undefined) {
    localStorage.setItem("pronoteDarkModeOptions", JSON.stringify({
        backgroundUrl: undefined,
        tryTiming: 100,
        tryLimit: 100,
        profilePic: undefined,
        badConnection: false,
        loadedTheme: "BASE",
        name: undefined,
        keep: true
    }))
}

var meta = document.createElement('meta');
meta.httpEquiv = 'Content-Security-Policy';
meta.content = 'upgrade-insecure-requests';
document.getElementsByTagName('head')[0].appendChild(meta);

var tryLimit = localStorage['tryLimit'] || 100 //since I modified the page detecting, I was able to remove the errors in the console so you can set it as high as you want
var tryTiming = localStorage['tryTiming'] || 100 //Change this line to the amount of time between two attempts. A low number will spam the console (if you use a low one and the page is not detected, up the tryLimit), a high one will cause a delay between the load of the page and the detectiong (it's in ms).

var tries = 0 //shuffled the code a bit around here, since new load detection
function checkLoadHome() { //Check if home page is loaded
    if (tries >= tryLimit) { //stop the attempts after a number of failed tries
        clearInterval(counter); //stop the counter
        console.log("failed to load homepage, retrying stopped")
    } else {
        if (document.querySelector(".objetbandeauentete_global") != null) { //detect if homepage is created
            console.log("home page loaded successfully after " + (tries * tryTiming) / 1000 + " s (try " + tries + ")");
            launchJS();
            clearInterval(counter); //stop both counters
            clearInterval(counterBis);
        }
        tries++
    }
}

var counter = setInterval(function() { checkLoadHome() }, tryTiming); //since checkLoadHome is a defined function (unlike the login one), this is needed to fire it at launch

var loginTries = 0
var counterBis = setInterval(function() {
    loginTries++
    if (loginTries >= tryLimit) {
        console.log("failed to detect login page, retrying stopped");
        clearInterval(counterBis);
    } else {
        if (document.querySelector("#id_42 > div.InlineBlock.Texte10") != null) { //detect if homepage is fully loaded (when using autologin)
            var loginBtn = document.querySelector("#id_39");
            console.log("Login page loaded successfully after " + (loginTries * tryTiming) / 1000 + " s (try " + (loginTries + 1) + ")")
            clearInterval(counter);
            clearInterval(counterBis);
            var loginImage = document.getElementById("id_44");
            loginImage.remove();
            loginBtn.addEventListener('click', function a() { tries = 0;
                clearInterval(counter);
                counter = setInterval(function() { checkLoadHome() }, tryTiming); }, false); //fire checkLoadHome at click on the "connect" button
            document.addEventListener('keydown', function a() { if (event.keyCode === 13) { if (loginBtn == null || !loginBtn.disabled) { tries = 0;
                        clearInterval(counter);
                        counter = setInterval(function() { checkLoadHome() }, tryTiming); } }; }, false); //fire checkLoadHome when hitting Enter
        }
    }
}, tryTiming);

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}


function launchJS() {
    var globalMenu = $("span:contains('Accueil')").parents("div[class^='menu']")[0]

    changeCustomTheme(getLocalStorageValue("loadedTheme"))
    

    if (document.getElementById('optionBouton') == null) {
        var optionBtn = document.createElement("li");
        optionBtn.className = "item-menu_niveau0 is-collapse";
        optionBtn.tabIndex = 0;
        optionBtn.role = "menuitem";
        optionBtn.id = "optionBouton"
        optionBtn.innerHTML = '<div id="GInterface.Instances[0].Instances[1]_Combo6" aria-haspopup="true" aria-level="0" aria-atomic="true" aria-describedby="id_27" style="" class="label-menu_niveau0">Options</div>'
        optionBtn.addEventListener("click", function a() {
            document.querySelectorAll(".item-selected").forEach(element => {
                element.classList.remove("item-selected")
            });
            optionBtn.classList.add("item-selected")
            createOptions();
        }, false);
        globalMenu.appendChild(optionBtn);

        function createOptions() {
            if (document.getElementById("optionWrapper") == null) {
                $('#GInterface\\.Instances\\[2\\]').empty();
            }

            $(".objetBandeauEntete_thirdmenu").hide();
            $('.objetBandeauEntete_secondmenu').hide();

            addOptionHTML();

            if(getLocalStorageValue("customAccentColor") != "" && getLocalStorageValue("customAccentColor") != undefined) {
                changeOverallTheme("theme-foncee", getLocalStorageValue("customAccentColor"))
            }

            document.getElementById("keepCheck").checked = getLocalStorageValue("keep")

            document.getElementById("badConnection").checked = getLocalStorageValue("badConnection")

            document.getElementById("optionsName").placeholder = getLocalStorageValue("name") || document.getElementsByClassName("ibe_util_texte ibe_actif").item(0).innerText || ""
            document.getElementById("optionsBackgroundUrl").value = getLocalStorageValue("backgroundUrl") || ""
        }
    }

    document.body.classList.add('AvecMenuContextuel') //I found that elements with this class are accepting right click


    changeNameStartup();

    function changeNameStartup() {
        if (getLocalStorageValue("keep") && getLocalStorageValue("name") != undefined && getLocalStorageValue("name") != "") { //only change the image/name if the "keep" var is set to true
            document.getElementsByClassName("ibe_util_texte ibe_actif").item(0).innerText = getLocalStorageValue("name");
            if (getLocalStorageValue("profilePic") != undefined && getLocalStorageValue("profilePic") != "") {
                document.getElementsByClassName("ibe_util_photo ibe_actif").item(0).firstElementChild.src = getLocalStorageValue("profilePic");
            }
        }
    }

    console.log(document.getElementsByClassName("home"))
    document.getElementsByClassName("home")[0].addEventListener("click", function() {
        console.log("ee")
        addLinks()
    })

    addLinks()



    launchCSS()
    console.log("JS & CSS were successfully loaded");
}

var cssLoad = 0

function addGlobalStyle(css) { //Apply the CSS
    cssLoad++
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function getLocalStorageValue(key) {
    let t = JSON.parse(localStorage.getItem("pronoteDarkModeOptions"))
    return JSON.parse(localStorage.getItem("pronoteDarkModeOptions"))[key]
}

function addLinks() {
    var devoirsTimeOut = window.setTimeout(() => {
        if (document.getElementsByClassName("descriptif").length != 0) {
            window.clearTimeout(devoirsTimeOut)
            var devoirArray = document.getElementsByClassName('descriptif');
            for (var i = 0; i < devoirArray.length; i++) {
                var splitCurrentDevoir = devoirArray[i].firstElementChild.innerText.match(/(https?:\/\/[^\s]+)/g)
                if (splitCurrentDevoir != null) {
                    for (var j = 0; j < splitCurrentDevoir.length; j++) {
                        devoirArray[i].firstElementChild.innerHTML = devoirArray[i].firstElementChild.innerHTML.replace(splitCurrentDevoir[j], "[Link]".link(splitCurrentDevoir[j]))
                    }
                }
                devoirArray[i].classList.add("Texte10")
            }
        }
    }, 500)
}

localStorage.setItem("etatAffichageFooter_3", true); //Get rid of the useless footer

addGlobalStyle(`
@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

a.LienLouvre {
    display: none !important;
}

#div {
    background-image: var(--loadingScreenUrl) !important;
    ${getLocalStorageValue("badConnection") ? `background-size: 400% 400%;
    animation: gradient 10s ease infinite;` : ""}
}
`)
if (!getLocalStorageValue("badConnection")) {
        changeStyle("loadingScreenUrl", 'url("https://s3-eu-west-1.amazonaws.com/sales-i-wordpress/wp-content/uploads/2015/12/17112848/black-background.jpg")')
} else {
        changeStyle("loadingScreenUrl", `linear-gradient(-45deg, #81412e, #982853, #1c7a9c, #1a9f80)`)
}

function launchCSS() {
    let bckgrdnCSS = ""
    if (JSON.parse(localStorage.getItem("pronoteDarkModeOptions"))["badConnection"]) {
        switch (JSON.parse(localStorage.getItem("pronoteDarkModeOptions"))["loadedTheme"]) {
            case "BRIGHT" : 
                bckgrdnCSS = `background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position: 0 0;
                background-color: #242582`
                break;
            case "FRESH": 
                bckgrdnCSS = `background-color: #05386b;
                background-position: 0 0;
                background-size: auto;`
                break;
            case "NEON RIDER":
                bckgrdnCSS = `
                background-color: #63074F;
                background-size: auto;`
                break;
            default :
                bckgrdnCSS = `background-color: #000000;
                opacity: 1;
                background-position:  34px 0, 34px 0, 0 0, 0 0;
                background-size: 68px 68px;
                background-repeat: repeat;`
                break;
        }
    } else {
        bckgrdnCSS = `background-repeat: no-repeat;
        background-size: cover;`
    }
addGlobalStyle(`
span.titre-matiere{
    color: var(--colorSubMenu) !IMPORTANT
}

.dotty, .interface_affV_client {
    transition: background-image 0.3s ease-in-out;
    background-image: var(--backgroundUrl) !important;
    ${bckgrdnCSS} 
}

a {
    color: var(--theme-sombre-scalePlus60) !important;
}

.liste-nested > li > h4 {
    color: #a478d4 !important;
}

h4, fieldset, td.AlignementMilieu, a > span:not(.InlineBlock), legend.Texte10.Legende, td.AlignementDroit.AlignementHaut {
    color: #fff !important;
}

legend > div > div.jiehint.ie-ellipsis {
    background-color: #fff;
}

::-webkit-scrollbar {
    display: none; !important;
} /*get rid of the useless scrollbar*/

.widget:not(#optionWrapper), fieldset, legend.Texte10.Legende, td.AlignementDroit.AlignementHaut, .AvecSelectionTexte.utilMess_visu_message.AvecMain > legend > div.Gras > div.jiehint.ie-ellipsis{
    background-color: var(--colorWidget) !important;
}

.widget {
    margin-bottom: 0 !important
}

widget.travailafaire h3, .widget.ressourcepedagogique h3 {
    background-color: #ebdbff;
    border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
    padding: 0.3rem !important;
}

.widget, .AlignementDroit.PetitEspaceDroit, #id_114 > ul > li:nth-child(1) > ul > li:nth-child(2) > div > div.descriptif.done, .objetBandeauEntete_secondmenu .objetBandeauEntete_fullsize .precedenteConnexion  {
    color: #f0f0f0 !important;
}

.widget.travailafaire .content-container > div[id^=id_] .liste-nested .sub-liste li .liste-docs a, .widget.travailafaire .content-container > div[id^=id_] .liste-groups .sub-liste li .liste-docs a, .widget.travailafaire .content-container > div[id^=id_] .liste-ressources .sub-liste li .liste-docs a {
    color: #ebdbff !important;
}

.widget.ressourcepedagogique .content-container > div[id^=id_] li .file-name, .widget.ressourcepedagogique .content-container > div[id^=id_] li .file-contain.icon::before {
    color: #ebdbff !important;
}

.as-input.actif.ie-ellipsis {
    color: var(--colorWidget) !important;
}

.as-button {
    background-color: #b5bbbb !important;
}

.EspaceIndex #div > .interface_affV > div.interface_affV_client.no-tactile {
    overflow: auto !important;
}

.ibp-bloc-left, .host-france-container, .knowledge-container, .footer-toggler, .ibe_gauche, .Image_Logo_PronoteBarreHaut, .icon_uniF2C3 {
    display:none !important;
} /*get rid of the useless images*/

.ObjetBandeauPied {
    transform: translateY(-5px) !important;
} /*set the footer a little bit higher because there is a gab between the main background and the end of the page*/

.ObjetBandeauEspace, .item-menu_niveau0:hover, .item-menu_niveau0.focused-in, .item-menu_niveau0.item-selected {
    background-color: var(--colorMain) !important;
    color: #eef0f5 !important;
}

.ibe_centre {
    position: fixed !important;
} /*set the name in the navbar fixed so it doesn't change place when showing the custom div*/

.item-menu_niveau0, .label-submenu {
    color: var(--colorAccent) !important;
}

.objetBandeauEntete_secondmenu {
    background-color: #757575 !important;
}

.objetBandeauEntete_secondmenu, .menu-principal_niveau1, .EtiquetteCours {
    background-color : var(--colorMenuBis) !important
}

.objetbandeauentete_global, .objetBandeauEntete_thirdmenu {
    background-color: var(--colorSubMenu) !important;
}

.item-menu_niveau1.selected, .ObjetMenuContexutel {
    background-color: var(--colorMenu) !important
}

::placeholder {
    color: #5d5e61 !important
}

#id_137fond {
    background-color: #707070 !important;
}

.widget .content-container > div[id^=id_] .liste-nested h5, .widget .content-container > div[id^=id_] .liste-groups h5, .widget .content-container > div[id^=id_] .liste-ressources h5, .underline {
    color: var(--colorTitles) !important
}

.Texte10:not(.c_7):not(.ieBoutonDefautSansImage):not(.Calendrier_Jour):not(.Calendrier_Mois):not(#breadcrumbBandeauPerso):not(.EspaceGauche.EspaceDroit) {
    color: var(--texteBaseColor) !important
}

.Fenetre_Cadre {
    background-color: #cccccc !important
}

.Calendrier_Jour_Selection {
    background-color: #626262 !important
}

liste_contenu_cellule_contenu, .divCellule, .liste_gridTitre_cel {
    background-color: #5c5c5c;
    color: #cdcdd8 !important
}

.MaClasseBordure, .CarteCompteZoneGenerique {
    border-radius: 0 4px 0 4px !important;
}

#id_95 {
    user-select:none !important
}

#conteneur-page > div > div.jspPane > div > div:nth-child(1), #conteneur-page > div > div.jspPane > div > div:nth-child(2), #conteneur-page > div > div.jspPane > div > div:nth-child(3), #conteneur-page > div > div.jspPane > div > div:nth-child(4), #conteneur-page > div > div.jspPane > div > div:nth-child(5) {
    background-color: #7f7f7f !important;
}

.ObjetTimeline_classScrollPanel {
    border-left: 1px solid #1E1414 !important;
    border-right: 1px solid #1E1414;
    border-bottom: 1px solid #1E1414 !important;
}

#conteneur-page > div > div.jspPane > div > div:nth-child(1) > div.PetitEspaceHaut {
    border-top: 1px solid #1E1414 !important;
}

#id_174 {
    background-color: #a2a0a0  !important
}

.EtiquetteCours, .AlignementMilieu.Insecable {
    color: #f0f0f0 !important;
}

.liste_zoneFils {
    border-top: 4px solid #C5C5C5 !important;
    border-bottom: 4px solid #C5C5C5 !important;
    border-left: 4px solid #C5C5C5 !important;
    order-right: 4px solid #C5C5C5 !important;
    backdrop-filter: blur(7px);
}

.objetbandeauentete_global, .objetBandeauEntete_menu:not(.ongletLudique) {
    background-color: var(--colorMenu) !important;
}

.wrapperOptionDiv {
    width: 100%;
    padding: 4rem;
    max-width: 100%;
    display: inline-block;
}

.mainOptionDiv {
    margin-top: 4rem;
    margin-left: 6rem;
    margin-right: 6rem;
    padding: 2rem;
    height: auto;
    min-height: 25%;
    display: inline-block;
    width: 35%;
    vertical-align: top;
}

.previewColor {
    width: 20px;
    height: 10px;
    display: inline-block;
    border: 1px solid grey;
    transform: translateY(2px)
}

.customThemeName {
    margin: 5px;
}
`);
}

function addOptionHTML() {
    $('#GInterface\\.Instances\\[2\\]').html(`
        <div class="wrapperOptionDiv widget dotty widget-global-container" id="optionWrapper" style="height: 100%;">

            <div class="mainOptionDiv Texte10 ArrondisBloc widget" id="optionTextDiv">
                <h3 style="font-size: 2rem; text-align: center; margin-top: 1rem;">Options générales</h3>

                <p style="display: inline-block;">Changement du prénom / nom : </p>
                <input type="text" id="optionsName" style="display: inline-block; margin-left: 1.7rem; width: 30%;" oninput="changeName(this.value);">
                <input type="button" style="margin-left: 1rem;" value="Stocker" onclick="store('name', previousValue(this))">
                <br>

                <p style="display: inline-block;">Changement de l'image de profil : </p>
                <input type="text" style="display: inline-block; margin-left: 1rem; width: 30%;" oninput="changeImage(this.value)">
                <input type="button" style="margin-left: 1rem;" value="Stocker" onclick="store('profilePic', previousValue(this))">
                <input type="button" style="margin-left: 1rem;" value="Supprimer" onclick="deleteLocalStorage('profilePic')">
                <br>

                <p style="display: inline-block;">Activer le mode mauvaise connection</p>
                <input type="checkbox" id="badConnection" style="margin-left: 3rem; transform: translateY(0.3rem);" oninput="store('badConnection', this.checked);">
                <br>

                <p style="display: inline-block;">Changement de l'image de fond : </p>
                <input type="text" id="optionsBackgroundUrl" style="display: inline-block; margin-left: 1.4rem; width: 30%;" oninput="changeStyle('backgroundUrl', this.value, true)">
                <input type="button" style="margin-left: 1rem;" value="Stocker" onclick="store('backgroundUrl', previousValue(this))">
                <input type="button" style="margin-left: 1rem;" value="Supprimer" onclick="deleteLocalStorage('backgroundUrl')">
                <br>

                <p style="display: inline-block;">Conserver les changements</p>
                <input type="checkbox" id="keepCheck"style="margin-left: 8.3rem; transform: translateY(0.3rem);" oninput="store('keep', this.checked)">
                <br>

                <p style="display: inline-block;">Délai entre les essais de détection : </p>
                <input type="number" style="display: inline-block; margin-left: 0.8rem; width: 20%;" placeholder="100">
                <input type="button" style="display: inline-block; margin-left: 1rem, width: 15%" value="Stocker" onclick="store('tryTiming', this.previousElementSibling.value)">
                <br>

                <p style="display: inline-block;">Quantité d'essais de détection : </p>
                <input type="number" style="display: inline-block; margin-left: 2.7rem; width: 20%;" placeholder="100">
                <input type="button" style="display: inline-block; margin-left: 1rem, width: 15%" value="Stocker" onclick="store('tryLimit', this.previousElementSibling.value)">
                <br>

                <p style="display: inline-block;">Couleur d'accentuation : </p>
                <input id="accentColorPicker" type="color" style="display: inline-block; margin-left: 2.7rem; width: 20%;" oninput="store('customAccentColor', this.value), changeOverallTheme('theme-foncee', this.value)">
                <input type="button" style="display: inline-block; margin-left: 1rem, width: 15%" value="Supprimer" onclick="deleteLocalStorage('customAccentColor')">
                <br>
            </div>

            <!--<div class="mainOptionDiv Texte10 ArrondisBloc widget" id="optionColorDiv">
                <h3 style="font-size: 2rem; text-align: center; margin-top: 1rem;">Customisation des couleurs</h3>

                <p style="display: inline-block;">Couleur du bandeau principal</p>
                <input type="color" id="colorMain" style="display: inline-block; margin-left: 1.7rem; width: 30%;" oninput="changeStyle('colorMain', this.value);">
                <input type="button" style="margin-left: 1rem;" value="Stocker" onclick="store('colorMain', previousValue(this))">
                <br>

                <p style="display: inline-block;">Couleur du menu</p>
                <input type="color" id="colorMenu" style="display: inline-block; margin-left: 1.7rem; width: 30%;" oninput="changeStyle('colorMenu', this.value);">
                <input type="button" style="margin-left: 1rem;" value="Stocker" onclick="store('colorMenu', previousValue(this))">
                <br>

                <p style="display: inline-block;">Couleur du sous-menu</p>
                <input type="color" id="colorMenuBis" style="display: inline-block; margin-left: 1.7rem; width: 30%;" oninput="changeStyle('colorMenuBis', this.value);">
                <input type="button" style="margin-left: 1rem;" value="Stocker" onclick="store('colorMenuBis', previousValue(this))">
                <br>

                <p style="display: inline-block;">Couleur du sous-sous-menu</p>
                <input type="color" id="colorSubMenu" style="display: inline-block; margin-left: 1.7rem; width: 30%;" oninput="'colorSubMenu', changeStyle('colorSubMenu', this.value);">
                <input type="button" style="margin-left: 1rem;" value="Stocker" onclick="store('colorSubMenu', previousValue(this))">
                <br>

                <p style="display: inline-block;">Couleur principale de la page d'accueil</p>
                <input type="color" id="colorWidget" style="display: inline-block; margin-left: 1.7rem; width: 30%;" oninput="'colorWidget', changeStyle('colorWidget', this.value);">
                <input type="button" style="margin-left: 1rem;" value="Stocker" onclick="store('colorWidget', previousValue(this))">
                <br>

                <p style="display: inline-block;">Couleur des titres</p>
                <input type="color" id="colorTitles" style="display: inline-block; margin-left: 1.7rem; width: 30%;" oninput="'colorTitles', changeStyle('colorTitle', this.value);">
                <input type="button" style="margin-left: 1rem;" value="Stocker" onclick="store('colorTitles', previousValue(this))">
                <br>

                <input type="button" style="margin-left: 1rem;" value="Réinitialiser les couleurs" onclick="changeCustomTheme('BASE');">
                <br>

            </div>-->

            <div class="mainOptionDiv Texte10 ArrondisBloc widget" id="optionThemeDiv">
            <h3 style="font-size: 2rem; text-align: center; margin-top: 1rem;">Thèmes</h3>
                <div>
                    <p style="display: inline-block;" class="customThemeName">Chill Purple : </p>
                    <div class="previewColor" style="background-color:#242582"></div>
                    <div class="previewColor" style="background-color:#2F2FA2"></div>
                    <div class="previewColor" style="background-color:#5050a4"></div>
                    <div class="previewColor" style="background-color:#823d6e"></div>
                    <div class="previewColor" style="background-color:#c9002d"></div>
                    <input type="button" style="margin-left: 1rem;" value="Appliquer" onclick="changeCustomTheme('BRIGHT')">
                </div>
                <div>
                    <p style="display: inline-block;" class="customThemeName">Fresh Green : </p>
                    <div class="previewColor" style="background-color:#05386B"></div>
                    <div class="previewColor" style="background-color:#0e331e"></div>
                    <div class="previewColor" style="background-color:#004301"></div>
                    <div class="previewColor" style="background-color:#379683"></div>
                    <div class="previewColor" style="background-color:#34ae6b"></div>
                    <input type="button" style="margin-left: 1rem;" value="Appliquer" onclick="changeCustomTheme('FRESH')">
                </div>
                <div>
                    <p style="display: inline-block;" class="customThemeName">IKEA : </p>
                    <div class="previewColor" style="background-color:#002565"></div>
                    <div class="previewColor" style="background-color:#00338b"></div>
                    <div class="previewColor" style="background-color:#0046be"></div>
                    <div class="previewColor" style="background-color:#0358ea"></div>
                    <div class="previewColor" style="background-color:#ac9729"></div>
                    <input type="button" style="margin-left: 1rem;" value="Appliquer" onclick="changeCustomTheme('IKEA')">
                </div>
                <div>
                    <p style="display: inline-block;" class="customThemeName">Black & Red : </p>
                    <div class="previewColor" style="background-color:#0b090a"></div>
                    <div class="previewColor" style="background-color:#432424"></div>
                    <div class="previewColor" style="background-color:#626469"></div>
                    <div class="previewColor" style="background-color:#a4161a"></div>
                    <div class="previewColor" style="background-color:#e1080b"></div>
                    <input type="button" style="margin-left: 1rem;" value="Appliquer" onclick="changeCustomTheme('BLACKRED')">
                </div>
                <div>
                    <p style="display: inline-block;" class="customThemeName">Défaut : </p>
                    <div class="previewColor" style="background-color:#232325"></div>
                    <div class="previewColor" style="background-color:#303030"></div>
                    <div class="previewColor" style="background-color:#a2a0a0"></div>
                    <div class="previewColor" style="background-color:#ba181b"></div>
                    <div class="previewColor" style="background-color:#46484d"></div>
                    <input type="button" style="margin-left: 1rem;" value="Appliquer" onclick="changeCustomTheme('BASE')">
                </div>
                <div>
                    <p style="display: inline-block;" class="customThemeName">Neon rider : </p>
                    <div class="previewColor" style="background-color:#63074f"></div>
                    <div class="previewColor" style="background-color:#c20b7e"></div>
                    <div class="previewColor" style="background-color:#ce0587"></div>
                    <div class="previewColor" style="background-color:#00faff"></div>
                    <div class="previewColor" style="background-color:#3566e0"></div>
                    <input type="button" style="margin-left: 1rem;" value="Appliquer" onclick="changeCustomTheme('NEON RIDER')">
                </div>
            </div>
        </div>
    `)
}