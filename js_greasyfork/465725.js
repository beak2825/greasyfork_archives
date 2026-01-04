// ==UserScript==
// @name         BubleRoyal+
// @namespace    Xpedii
// @version      1.3
// @description  BubleRoyal Addon (BetterMenu) (Split)
// @author       Xpedii
// @match        *://bubleroyal.com/*
// @run-at       document-start
// @license      Xpedii
// @downloadURL https://update.greasyfork.org/scripts/465725/BubleRoyal%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/465725/BubleRoyal%2B.meta.js
// ==/UserScript==

let splitInterval = null, splitSwitch = false;
var YourNick = "Xpedii";

document.addEventListener("DOMContentLoaded", function() {
    var statsTitleElement = document.querySelector("#stats > h2 > center");
    statsTitleElement.textContent = "Wyniki";
});
document.addEventListener("DOMContentLoaded", function() {
    var powrotElement = document.querySelector("#powrot");
    powrotElement.style.marginTop = "65px";
    powrotElement.style.width = "90%";
});
document.addEventListener("DOMContentLoaded", function() {
    var statsElement = document.querySelector("#stats");
    statsElement.style.height = "350px";
});
document.addEventListener("DOMContentLoaded", function() {
    var helloDialogElement = document.querySelector("#helloDialog");
    helloDialogElement.style.padding = "5px 15px 20px 15px";
});

function clickPlayButton() {
    var overlaysElement = document.querySelector("#overlays");
    var overlaysDisplay = getComputedStyle(overlaysElement).display;

    if (overlaysDisplay === 'none') {
        var playBtn = document.querySelector("#playBtn");
        playBtn.click();
    }
}

window.addEventListener('load', function() {
    setInterval(clickPlayButton, 10);
});

function funnysplit() {
    var num = 25
    setTimeout(function() {
        goTo(-0.6, 2);
    }, num);
    for(let i = 0; i < 5; i++) {
        setTimeout(function() {
            goTo(-0.6, 2);
        }, num);
        num = num+25
        setTimeout(function() {
            $("body").trigger($.Event("keydown", { keyCode: 32 }));
            $("body").trigger($.Event("keyup", { keyCode: 32 }));
        }, num);
        num = num+25
        setTimeout(function() {
            goTo(0.6, 2);
        }, num);
        num = num+25
        setTimeout(function() {
            $("body").trigger($.Event("keydown", { keyCode: 32 }));
            $("body").trigger($.Event("keyup", { keyCode: 32 }));
        }, num);
    }
}

function keydown(e) {
    const chat = document.querySelector("#chat_textbox");
    if(chat === document.activeElement) return;

    const key = e.key;
    switch(key) {
        case "Shift":
            if(splitSwitch) return;

            splitSwitch = true;
            splitInterval = setInterval(() => {
                $("body").trigger($.Event("keydown", { keyCode: 32 }));
                $("body").trigger($.Event("keyup", { keyCode: 32 }));
            }, 4);
            break;
        case "m":
            funnysplit();
            break;
    }
}

function keyup(e) {
    const chat = document.querySelector("#chat_textbox");
    if(chat === document.activeElement) return;

    const key = e.key;
    switch(key) {
        case "Shift":
            clearInterval(splitInterval);
            splitSwitch = false;
            return;
    }
}
function goTo(x, y) {
    x = window.innerWidth / x; y = window.innerHeight / y;
    $("canvas").trigger($.Event("mousemove", {clientX: x, clientY: y}));
}
document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);
document.addEventListener("DOMContentLoaded", function() {
    var logoElement = document.querySelector("#home > div.form-group > center > h1");
    if (logoElement) {
        logoElement.textContent = YourNick;
    }
    logoElement = document.querySelector("#login > div > center > h1");
    if (logoElement) {
        logoElement.textContent = "Logowanie";
    }
    logoElement = document.querySelector("#load > div.form-group > center > h1");
    if (logoElement) {
        logoElement.textContent = "Ranking";
    }
    logoElement = document.querySelector("#signup > div > center > h1");
    if (logoElement) {
        logoElement.textContent = "Rejestracja";
    }
    logoElement = document.querySelector("#contact > div.form-group > center > h1");
    if (logoElement) {
        logoElement.textContent = "Kontakt";
        element = document.querySelector("#helloDialog");
        element.style.backgroundColor = "#151517";
        element = document.querySelector("#loginNick");
        element.style.backgroundColor = "#262629";
        element.style.border = "0px";
        element = document.querySelector("#loginPassword");
        element.style.backgroundColor = "#262629";
        element.style.border = "0px";
        element = document.querySelector("#loginButton");
        element.style.backgroundColor = "#3d82f6";
        element = document.querySelector("#load_signup");
        element.style.backgroundColor = "#23c55f";
        element = document.querySelector("#nick");
        element.style.backgroundColor = "#262629";
        element = document.querySelector("#gamemode");
        element.style.backgroundColor = "#262629";
        element = document.querySelector("#gamemode");
        element.style.border = "#262629";
        element = document.querySelector("#playBtn");
        element.style.backgroundImage = "url('https://cdn.discordapp.com/attachments/1008318695988285470/1104536547564453951/Play.png')";
        element.style.borderRadius = "5px";
        element = document.querySelector("#spectateBtn");
        element.style.backgroundImage = "url('https://cdn.discordapp.com/attachments/1008318695988285470/1104536548050997289/Spectate.png')";
        element.style.borderRadius = "5px";
        element.style.width = "38%";
        element = document.querySelector("#relo > form > div:nth-child(5) > button.btn-primary.setxbtn");
        element.style.backgroundImage = "url('https://cdn.discordapp.com/attachments/1008318695988285470/1104536547816120330/Settings.png')";
        element.style.borderRadius = "5px";
        element = document.querySelector(".fa.fa-bars");
        element.style.display = "none";
        element = document.querySelector("#gamemode");
        element.style.color = "#999999";
        element = document.querySelector("#home > hr");
        element.style.borderColor = "#5e5e5e";
        const divElement = document.querySelector("#spa > div:nth-child(2)");
        divElement.innerHTML = `
        <span style="color: #a90708; font-family: Arial; font-size: 17px;">Nie udostępniaj swojego hasła innym osobą jeżeli</span><br>
        <span style="color: #a90708; font-family: Arial; font-size: 17px;">chcesz stracić konta. Nie ma darmowych punktów.</span><br>
    `;
    }
    const hrElement = document.createElement("hr");
    const divElement = document.querySelector("#spa > div:nth-child(2)");
    hrElement.style.borderColor = "#5e5e5e";
    divElement.parentNode.insertBefore(hrElement, divElement.nextSibling);
    const textElement1 = document.createElement("span");
    textElement1.style.color = "#999999";
    textElement1.style.fontFamily = "Arial";
    textElement1.style.fontSize = "17px";
    textElement1.textContent = "Używaj myszki do sterowania";
    divElement.parentNode.insertBefore(textElement1, hrElement.nextSibling);
    divElement.parentNode.insertBefore(document.createElement("br"), hrElement.nextSibling);
    const textElement2 = document.createElement("span");
    textElement2.style.color = "#999999";
    textElement2.style.fontFamily = "Arial";
    textElement2.style.fontSize = "17px";
    textElement2.innerHTML = 'Naciśnij <strong>Spacja</strong> do rozdzielania masy';
    divElement.parentNode.insertBefore(textElement2, hrElement.nextSibling);
    divElement.parentNode.insertBefore(document.createElement("br"), hrElement.nextSibling);
    const textElement3 = document.createElement("span");
    textElement3.style.color = "#999999";
    textElement3.style.fontFamily = "Arial";
    textElement3.style.fontSize = "17px";
    textElement3.innerHTML = 'Naciśnij <strong>W, E (auto)</strong>, aby oddać trochę masy';
    divElement.parentNode.insertBefore(textElement3, hrElement.nextSibling);
    divElement.parentNode.insertBefore(document.createElement("br"), hrElement.nextSibling);
    const youtubeButton = document.querySelector("#spa > div.bottomADS > div.button-class.linia.youtube.mono");
    youtubeButton.style.display = "block";
    youtubeButton.style.marginTop = "20px"; // Możesz dostosować wartość przesunięcia według potrzeb
    youtubeButton.style.borderRadius = "5px";
    youtubeButton.style.backgroundColor = "#de1d47";
    youtubeButton.textContent = "Strona";
    youtubeButton.addEventListener("click", function() {
        window.location.href = "https://legacymc.pl";
    });
    const donateButton = document.querySelector("#spa > div.bottomADS > div.button-class.linia.donate.mono");
    donateButton.style.display = "block";
    donateButton.style.marginTop = "20px"; // Możesz dostosować wartość przesunięcia według potrzeb
    donateButton.style.borderRadius = "5px";
    donateButton.style.backgroundColor = "#3070f1";
    donateButton.textContent = "Discord";
    donateButton.addEventListener("click", function() {
        window.location.href = "https://legacymc.pl/dc";
    });
    var element = document.querySelector("#helloDialog > div:nth-child(7)");
    if (element && element.lastChild.nodeType === Node.TEXT_NODE) {
        element.removeChild(element.lastChild);
    }
    var element1 = document.querySelector("#load_home");
    if (element1) {
        element1.addEventListener("mouseover", function() {
            element1.style.borderBottomColor = "#ff8742";
        });

        element1.addEventListener("mouseout", function() {
            element1.style.borderBottomColor = "";
        });
    }

    var element2 = document.querySelector("#load_login");
    if (element2) {
        element2.addEventListener("mouseover", function() {
            element2.style.borderBottomColor = "#59ff40";
        });

        element2.addEventListener("mouseout", function() {
            element2.style.borderBottomColor = "";
        });
    }

    var element3 = document.querySelector("#sp > button");
    if (element3) {
        element3.addEventListener("mouseover", function() {
            element3.style.borderBottomColor = "#3870ff";
        });

        element3.addEventListener("mouseout", function() {
            element3.style.borderBottomColor = "";
        });
    }

    var element4 = document.querySelector("#footer > div:nth-child(4) > button");
    if (element4) {
        element4.addEventListener("mouseover", function() {
            element4.style.borderBottomColor = "#ff2994";
        });

        element4.addEventListener("mouseout", function() {
            element4.style.borderBottomColor = "";
        });
    }
    element.style.borderColor = "#5e5e5e";
    element = document.querySelector("#chbox > div.col-6.col-sm-6.col-md-6.col-lg-6.col-xs-6 > label:nth-child(2)");
    element.style.color = "#999999";
    element.style.fontFamily = "Arial";
    element.style.fontSize = "15px";
    element.textContent = "Ukryj skiny";
    element = document.querySelector("#chbox > div.col-6.col-sm-6.col-md-6.col-lg-6.col-xs-6 > label:nth-child(5)")
    element.style.color = "#999999";
    element.style.fontFamily = "Arial";
    element.style.fontSize = "15px";
    element.textContent = "Ukryj nazwy";
    element = document.querySelector("#chbox > div.col-6.col-sm-6.col-md-6.col-lg-6.col-xs-6 > label:nth-child(8)")
    element.style.color = "#999999";
    element.style.fontFamily = "Arial";
    element.style.fontSize = "15px";
    element.textContent = "Ciemna strona";
    element = document.querySelector("#chbox > div.col-6.col-sm-6.col-md-6.col-lg-6.col-xs-6 > label:nth-child(11)")
    element.style.color = "#999999";
    element.style.fontFamily = "Arial";
    element.style.fontSize = "15px";
    element.textContent = "Pokaż masę innych";
    element = document.querySelector("#chbox > div:nth-child(2) > label:nth-child(2)")
    element.style.color = "#999999";
    element.style.fontFamily = "Arial";
    element.style.fontSize = "15px";
    element.textContent = "Pokaż swoją masę";
    element = document.querySelector("#chbox > div:nth-child(2) > label:nth-child(5)")
    element.style.color = "#999999";
    element.style.fontFamily = "Arial";
    element.style.fontSize = "15px";
    element.textContent = "Bez kolorów";
    element = document.querySelector("#chbox > div:nth-child(2) > label:nth-child(8)")
    element.style.color = "#999999";
    element.style.fontFamily = "Arial";
    element.style.fontSize = "15px";
    element.textContent = "Ukryj czat";
    element = document.querySelector("#chbox > div:nth-child(2) > label:nth-child(11)")
    element.style.color = "#999999";
    element.style.fontFamily = "Arial";
    element.style.fontSize = "15px";
    element.textContent = "Pokaż granice";
    element = document.querySelector("#powrot");
    element.style.backgroundColor = "#3d82f6";
    var Dropdown = document.querySelector("#load_ranking");
    Dropdown.style.backgroundColor = "#171719";
    var list = document.querySelector("#sp > ul");
    var button = document.querySelector("#sp > button");
    if (button) {
        button.innerText = "Ranking";
    }
    var styleTag = document.createElement("style");
    styleTag.innerHTML = "#rankmode { color: #999999; background-color: #262629; border: none; font-size: 18px; border-radius: 5px; }";
    document.head.appendChild(styleTag);
    styleTag = document.createElement("style");
    styleTag.innerHTML = "#rankdata { color: #999999; background-color: #262629; border: none; font-size: 18px; border-radius: 5px; }";
    document.head.appendChild(styleTag);
    element = document.querySelector("#Popup > div > div");
    element.style.backgroundColor = "#151517";
    element = document.querySelector("body");
    element.style.color = "white";
    element = document.querySelector("html");
    element.style.color = "white";
    element = document.querySelector("#nick");
    element.style.color = "#999999";
    element = document.querySelector("#loginNick");
    element.style.color = "#999999";
    element.style.backgroundColor = "#262629";
    element = document.querySelector("#loginPassword");
    element.style.color = "#999999";
    element.style.backgroundColor = "#262629";
    element = document.querySelector("#display_name");
    element.style.color = "#999999";
    element.style.backgroundColor = "#262629";
    element.style.border = "0px";
    element = document.querySelector("#email");
    element.style.color = "#999999";
    element.style.backgroundColor = "#262629";
    element.style.border = "0px";
    element = document.querySelector("#pass");
    element.style.color = "#999999";
    element.style.backgroundColor = "#262629";
    element.style.border = "0px";
    element = document.querySelector("#repass");
    element.style.color = "#999999";
    element.style.backgroundColor = "#262629";
    element.style.border = "0px";
    element = document.querySelector("#SignupButton");
    element.style.backgroundColor = "#23c55e";
    element = document.querySelector("#signup > center > h3");
    element.textContent = "Stwórz konto";
    element = document.querySelector("#signup > center > h3");
    element.textContent = "Stwórz konto";
    element = document.querySelector("#signup > p");
    element.style.textAlign = "center";
    element.textContent = "Pamiętaj aby nie używać tego samego hasła gdzie indziej";
    element = document.querySelector("#login > hr");
    element.style.borderColor = "#5e5e5e";
    element = document.querySelector("#signup > hr");
    element.style.borderColor = "#5e5e5e";
    element = document.querySelector("#load > hr");
    element.style.borderColor = "#5e5e5e";
    element = document.querySelector("#contact > hr");
    element.style.borderColor = "#5e5e5e";
});