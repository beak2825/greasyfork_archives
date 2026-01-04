// ==UserScript==
// @name        Validateur de présence
// @namespace   Violentmonkey Scripts
// @match       https://www.leonard-de-vinci.net/student/presences/*
// @match       https://www.leonard-de-vinci.net/
// @grant       none
// @version     1.8.4
// @require https://cdn.jsdelivr.net/gh/jpillora/notifyjs@e3da96e3a10a6ecfedb850e0ccc8481232a4fdff/dist/notify.js
// @author      nopeee, loliprane
// @description Script qui permet la validation automatique de votre présence sur le portail du cluster Léonard de Vinci à La Défense sur le site leonard-de-vinci.net
// @license      MIT
// @name:en Validateur de présence
// @description:en Script qui permet la validation automatique de votre présence sur le portail du cluster Léonard de Vinci à La Défense sur le site leonard-de-vinci.net
// @downloadURL https://update.greasyfork.org/scripts/454978/Validateur%20de%20pr%C3%A9sence.user.js
// @updateURL https://update.greasyfork.org/scripts/454978/Validateur%20de%20pr%C3%A9sence.meta.js
// ==/UserScript==

const eduMail = "prénom.nom@edu.devinci.fr"; //Entrez votre e-mail ici

var updateTitle = (str) => {
    document.title = !(str) ? "LDV Online" : str + " - LDV Online"
}

var waitAndExecute = function(func, waitingTime) { //Comme un setTimeout mais lance le timer si besoin
    if (func.toString().includes("location.reload()") || func.toString().includes("watchTime()")) {
        var startTime = aTime()
        var timeLeftBeforeReload = waitingTime / 60000
        updateTimer(timeLeftBeforeReload);
        setInterval(function() {
          var timeDifferenceInMin = ((Number(aTime().split(":")[0]*60) +Number(aTime().split(":")[1]))-(Number(startTime.split(":")[0]*60) +Number(startTime.split(":")[1])))
          updateTimer(timeLeftBeforeReload-timeDifferenceInMin);
        }, 60000)
    }
    return setTimeout(func, waitingTime);
}

var updateTimer = function(nextTime) { // met à jour le timer
  window.onfocus = function ()  {updateTimer(nextTime)}
    var timer = document.getElementById("reloadTimer")

    if (!timer) return initializeTimer(nextTime)
    if (nextTime<0) return location.reload()
    if (nextTime < 1) return timer.text = "Rechargement imminent !  "
    timer.text = "Rechargement dans " + nextTime + " minutes  "

}

var initializeTimer = function(nTime) { //initialise le timer
    var btn = document.createElement("a");
    btn.class = ""
    btn.innerHTML = "Reloading planned, but the timer won't be updated :/";
    btn.id = "reloadTimer"
    var bandeau = document.getElementsByClassName("breadcrumb no_margin").item(0)
    bandeau = bandeau.children[bandeau.children.length - 1]
    bandeau.appendChild(btn)
    bandeau.insertBefore(btn, bandeau.children[0])
    var spaces = document.createElement("spaces")
    spaces.innerText = " "
    var timer = document.getElementById("reloadTimer")
    timer.append(spaces)
    return updateTimer(nTime)
}

var findOpenedCourse = function(lignesTableau) { // essaie de trouver un cours ouvert
    state = null
    lignesTableau.forEach((ligne) => {
        if (!!(state)) {
            return
        }
        var dates = ligne.children[0].textContent.split("-")
        if (!isNaN(dates[0].trim().replace(":", ""))) {
            if (diffTime(dates[0]) <= 0 && diffTime(dates[1]) >= 0) {
                console.log("Found course we should be in :" + ligne)
                state = "foundCurrentCouse"
                return ligne.children[3].children[0].click()
            }
            if (90 < diffTime(dates[0]) + diffTime(dates[1])) {
                state = "foundNextCourse"
                return findNextCourse(ligne)
            }
        }
    })

    if (!(state)) {
        $.notify("Aucun cours restant trouvé pour aujourd'hui !");
        updateTitle(`Journée terminée`)
        return waitAndExecute(function() {
            location.reload();
        }, (diffTime("23:59") + 2) * 1000 * 60); //reloads for next day
    }
    return;
};

var findNextCourse = function(nc) { //cherche le prochain cours
    if (!!nc) {
        var nDate = nc.children[0].textContent.split("-")[0].trim().replace("h", ":");
        var nTime = diffTime(nDate);
        if (nTime >= 0) {
            if (nTime == 0) {
                nTime = 0.2
            }
            updateTitle(`Prochain Cours: ${nDate}`)
            $.notify(`(${aTime()}) La page sera rechargée dans ${nTime} minutes pour le prochain cours`, {
                autoHide: false,
                className: "info"
            });
            return waitAndExecute(function() {
                location.reload();
            }, nTime * 1000 * 60); //recharge la page à l'horaire du cours suivant
        }
    }
};

var validatePresence = function(checkAppel) { //Appuie sur le bouton valider la présence s'il existe
    if (!checkAppel) {
        if (/[0-9]+$/.test(location.href)) {
            if (!(document.getElementsByClassName("alert alert-success").length)) {
                if (timeLeftInClass() < 0) {
                    location.href = "https://www.leonard-de-vinci.net/student/presences/"
                }
                updateTitle("Appel pas encore ouvert")
                $.notify("Rechargement dans 15s", "warn"); //recharge si le bouton est pas trouvé
                return waitAndExecute(function() {
                    location.reload();
                }, 30000);
            } else {

                var notification = new Notification('Validateur de présence', {
                    icon: 'https://www.leonard-de-vinci.net/images/esilv_28.png',
                    body: 'Présence confirmée. Renvoi vers les cours prévu quand le cours actuel sera fini.',
                }); //Vous envoie une notification si vous les avez autorisées
                notification.onclick = function() {
                    window.focus();
                };
                watchTime();
                $.notify(`(${aTime()}) Présence validée`, {
                    autoHide: false,
                    className: "success"
                });
                updateTitle(`Présence validée`)
                return;
            }
        } else {
            return;
        }
    }
    return checkAppel.click();
};

var watchTime = function() { //Quitte la page du cours actuel quand il est terminé

    var ch = timeLeftInClass()
    $.notify(`(${aTime()}) Rechargement prévu pour dans ${ch} minutes`, {
        className: "success"
    });
    if (ch > 0) {
        return waitAndExecute(function() {
            watchTime();
        }, ch * 1000 * 60); //recharge quand le cours actuel est fini
    } else {
        return goBack();
    }
};

var goBack = function() { //evidemment ca va en arrière
    $.notify(`(${aTime()}) Retour à la page des présences car le cours actuel est terminé`, {
        autoHide: false,
        className: "success"
    });
    return window.history.go(-1);
};

var aTime = function() { //récupère le temps hh:mm
    var test2 = new Date();
//    test2 = new Date(+test2 - test2.getTimezoneOffset() + 3600000) //enlevez les commentaires si votre fuseau horaire est mal détécté
    if (test2.getHours().toString().length == 1) {
        var a = "0" + test2.getHours().toString();
    } else {
        var a = test2.getHours();
    }
    if (test2.getMinutes().toString().length == 1) {
        var b = "0" + test2.getMinutes().toString();
    } else {
        var b = test2.getMinutes();
    }
    return a + ":" + b;
};

var diffTime = function(timea) { // calcule la diff entre le temps timea et l'heure actuelle, retour en minutes
    var ot = timea.split(":");
    var t = aTime().split(":");
    return Number(ot[0]) * 60 + Number(ot[1]) - Number(t[0]) * 60 - Number(t[1]);
};

var timeLeftInClass = () => {
    var classTable = document.querySelectorAll("tbody");
    var temps = classTable[0].children[0].children[1].textContent.split("-")[1].trim().replace("h", ":");
    var ch = diffTime(temps);
    return ch + 1
}

var isLoginPage = false;
[...document.scripts].forEach((script) => {
  if (script.src.includes("login.js")) {
    isLoginPage = true;
  }
})
if (isLoginPage) { // Entre l'e-mail automatiquement  //vous login automatiquement si vous avez été déconnecté
    if (eduMail.includes("prénom") || eduMail == "@edu.devinci.fr") {
        $.notify("Configurez votre e-mail dans le script (Extensions -> ViolentMonkey, Tampermonkey ou Greasemonkey -> trouvez le script validateur de présence -> trouvez le bouton modifier -> modifiez la ligne corrsepondante)", {
            autoHide: false
        })
    } else {
      document.querySelector("#login").value = eduMail;
      document.querySelector("#btn_next").click();
    }
} else if (document.referrer == "https://adfs.devinci.fr/") { // Si on arrive sur la page principale et qu'on vient de se connecter
    document.querySelector("div a[class='']").click(); // On part vers les présences
} else if (location.href.startsWith("https://www.leonard-de-vinci.net/student/presences/")) { //traite les présences

    console.log(aTime() + " running presence script beacause global presences tab was detected")

    // var onAirClass = [...document.getElementsByClassName("warning")];
    var validateButton = document.getElementById("set-presence");
    var table = document.querySelectorAll("tr")

    if (/[0-9]+$/.test(location.href)) {
        validatePresence(validateButton);
    } else {
        findOpenedCourse(table);
    }
}