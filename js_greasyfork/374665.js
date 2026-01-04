// ==UserScript==
// @name     CGI_PSATimeHelper
// @version  1.4
// @include  https://psa-fs.ent.cgi.com/*
// @author   AGRE (Arthur GREGOIRE)
// @description:fr Script CGI pour PSATime
// @namespace https://greasyfork.org/users/227630
// @description Script CGI pour PSATime
// @downloadURL https://update.greasyfork.org/scripts/374665/CGI_PSATimeHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/374665/CGI_PSATimeHelper.meta.js
// ==/UserScript==
var modaliteHoraire;
var emplacement;
var tempsDePause;
var targetNode = document.body;
var config =
{
    attributeOldValue: true,
    characterData: true,
    attributes: true,
    childList: true,
    subtree: true
};

var observer = new MutationObserver(function (mutations) 
{
    main(modaliteHoraire);
});

observer.observe(targetNode, config);

function main(modaliteHoraire) 
{
    if (frames[0].document.getElementById("TIME1$0") != null || frames[0].document.getElementById("TIME2$0") != null || frames[0].document.getElementById("TIME3$0") != null || frames[0].document.getElementById("TIME4$0") != null || frames[0].document.getElementById("TIME5$0") != null || frames[0].document.getElementById("TIME6$0") != null || frames[0].document.getElementById("TIME7$0") != null) 
    {
        modaliteHoraire = sessionStorage.getItem("modaliteHoraire");

        if (modaliteHoraire == null) 
        {
            modaliteHoraire = prompt("Quelle est votre modalité horaire ?", "7.4");

            if (modaliteHoraire.includes(",") == true) 
            {
                modaliteHoraire = modaliteHoraire.replace(",", ".");
            }
            sessionStorage.setItem("modaliteHoraire", modaliteHoraire);
        }

        var nombre_de_ligne = frames[0].document.querySelectorAll('[id^=trEX_TIME_DTL]').length;
        var ligneTraite;

        if (frames[1] != undefined && frames[1].document.getElementById("PTSRCHRESULTS") != null && frames[1].document.getElementById("PTSRCHRESULTS").rows != null) 
        {
            getLibelle();
        }

        var listeProjet = JSON.parse(sessionStorage.getItem("listeProjet"));
        if (listeProjet != null) 
        {
            LibelleTooltip(listeProjet, nombre_de_ligne);
        }

        activiteProjet(nombre_de_ligne);

        for (ligneTraite = 0; ligneTraite < nombre_de_ligne; ligneTraite++) 
        {
            var Jour1 = "TIME1$" + ligneTraite;
            var Jour2 = "TIME2$" + ligneTraite;
            var Jour3 = "TIME3$" + ligneTraite;
            var Jour4 = "TIME4$" + ligneTraite;
            var Jour5 = "TIME5$" + ligneTraite;
            var Jour6 = "TIME6$" + ligneTraite;
            var Jour7 = "TIME7$" + ligneTraite;
            onchangelist(Jour1, modaliteHoraire);
            onchangelist(Jour2, modaliteHoraire);
            onchangelist(Jour3, modaliteHoraire);
            onchangelist(Jour4, modaliteHoraire);
            onchangelist(Jour5, modaliteHoraire);
            onchangelist(Jour6, modaliteHoraire);
            onchangelist(Jour7, modaliteHoraire);
        }
        paramHeuresInternes(modaliteHoraire);
    }
    if (frames[1].document.getElementById("UC_DAILYREST1$0") != null) 
    {
        emplacement = sessionStorage.getItem("emplacement");
        if (emplacement == null) 
        {
            do
            {
                emplacement = prompt("Où avez-vous majoritairement travaillé cette semaine ? \nÉcrire 'CGI','Client','NA' ou 'Home'. \nSensible à la casse.", "CGI");
            }
            while (emplacement != "CGI" && emplacement != "Client" && emplacement != "NA" && emplacement != "Home")

            sessionStorage.setItem("emplacement", emplacement);
        }

        tempsDePause = sessionStorage.getItem("tempsDePause");
        if (tempsDePause == null) 
        {
            do
            {
                tempsDePause = prompt("Combien de temps ont duré vos pauses déjeuners ?", "1,5");
            }
            while (tempsDePause == null)
            if (tempsDePause.includes(".") == true) 
            {
                tempsDePause = tempsDePause.replace(".", ",");
            }
            sessionStorage.setItem("tempsDePause", tempsDePause);
        }
        completeInfosAdd();
    }
}

function activiteProjet(nombre_de_ligne)
{
    for (ligneTraite = 0; ligneTraite < nombre_de_ligne; ligneTraite++)
    {
        if (frames[0].document.getElementById("PROJECT_CODE$" + ligneTraite).value != null && frames[0].document.getElementById("PROJECT_CODE$" + ligneTraite).value != "")
        {
            if (frames[0].document.getElementById("ACTIVITY_CODE$" + ligneTraite).value == "" || frames[0].document.getElementById("ACTIVITY_CODE$" + ligneTraite).value == null)
            {
                frames[0].document.getElementById("ACTIVITY_CODE$" + ligneTraite).value = "PROJET";
                frames[0].document.getElementById("ACTIVITY_CODE$" + ligneTraite).onchange();
            }
        }
    }
}

function LibelleTooltip(listeProjet, nombre_de_ligne)
{
    if (listeProjet != null) 
    {
        for (ligneTraite = 0; ligneTraite < nombre_de_ligne; ligneTraite++)
        {
            var idProjetMain = frames[0].document.getElementById("PROJECT_CODE$" + ligneTraite).value;
            if (idProjetMain != null)
            {
                var libelleProjet = listeProjet[idProjetMain];
                if (libelleProjet != null)
                {
                    frames[0].document.getElementById("PROJECT_CODE$" + ligneTraite).title = libelleProjet;
                }
            }
        }
    }
}

function paramHeuresInternes(modaliteHoraire)
{
    if (frames[0].document.getElementById("POL_TIME2$0") != null)
    {
        var L1C1 = "POL_TIME2$0";
        var L1C2 = "POL_TIME3$0";
        var L1C3 = "POL_TIME4$0";
        var L1C4 = "POL_TIME5$0";
        var L1C5 = "POL_TIME6$0";

        var L2C1 = "POL_TIME2$1";
        var L2C2 = "POL_TIME3$1";
        var L2C3 = "POL_TIME4$1";
        var L2C4 = "POL_TIME5$1";
        var L2C5 = "POL_TIME6$1";

        var L3C1 = "POL_TIME2$2";
        var L3C2 = "POL_TIME3$2";
        var L3C3 = "POL_TIME4$2";
        var L3C4 = "POL_TIME5$2";
        var L3C5 = "POL_TIME6$2";

        var L4C1 = "POL_TIME2$3";
        var L4C2 = "POL_TIME3$3";
        var L4C3 = "POL_TIME4$3";
        var L4C4 = "POL_TIME5$3";
        var L4C5 = "POL_TIME6$3";

        var L5C1 = "POL_TIME2$4";
        var L5C2 = "POL_TIME3$4";
        var L5C3 = "POL_TIME4$4";
        var L5C4 = "POL_TIME5$4";
        var L5C5 = "POL_TIME6$4";

        onchangelist(L1C1, modaliteHoraire);
        onchangelist(L1C2, modaliteHoraire);
        onchangelist(L1C3, modaliteHoraire);
        onchangelist(L1C4, modaliteHoraire);
        onchangelist(L1C5, modaliteHoraire);

        onchangelist(L2C1, modaliteHoraire);
        onchangelist(L2C2, modaliteHoraire);
        onchangelist(L2C3, modaliteHoraire);
        onchangelist(L2C4, modaliteHoraire);
        onchangelist(L2C5, modaliteHoraire);

        onchangelist(L3C1, modaliteHoraire);
        onchangelist(L3C2, modaliteHoraire);
        onchangelist(L3C3, modaliteHoraire);
        onchangelist(L3C4, modaliteHoraire);
        onchangelist(L3C5, modaliteHoraire);

        onchangelist(L4C1, modaliteHoraire);
        onchangelist(L4C2, modaliteHoraire);
        onchangelist(L4C3, modaliteHoraire);
        onchangelist(L4C4, modaliteHoraire);
        onchangelist(L4C5, modaliteHoraire);

        onchangelist(L5C1, modaliteHoraire);
        onchangelist(L5C2, modaliteHoraire);
        onchangelist(L5C3, modaliteHoraire);
        onchangelist(L5C4, modaliteHoraire);
        onchangelist(L5C5, modaliteHoraire);
    }
}

function getLibelle() 
{
    var noTotalLigne = frames[1].document.getElementById("PTSRCHRESULTS").rows.length;
    var listeProjet = {};
    var noLigne;

    for (noLigne = 1; noLigne < noTotalLigne; noLigne++) 
    {
        var idProjet = frames[1].document.getElementById("PTSRCHRESULTS").rows[noLigne].firstElementChild.firstChild.innerText;
        var libelle = frames[1].document.getElementById("PTSRCHRESULTS").rows[noLigne].lastElementChild.firstChild.innerText;
        if (idProjet != null && libelle != null)
        {
            listeProjet[idProjet] = libelle;
        }
    }
    sessionStorage.setItem("listeProjet", JSON.stringify(listeProjet));
}

function onchangelist(id, modaliteHoraire) 
{
    if (frames[0].document.getElementById(id) != null) 
    {
        var value = frames[0].document.getElementById(id);
        value.addEventListener("change", function () 
        {
            traitement(id, modaliteHoraire)
        });
    }
}

function traitement(id, modaliteHoraire) 
{
    var valeurInput = frames[0].document.getElementById(id).value;
    if (valeurInput != null && valeurInput != "")
    {
        var nouvelleValeur = RemplacementPointVirgule_remplacementDureeTravail(valeurInput, modaliteHoraire);
        frames[0].document.getElementById(id).value = nouvelleValeur;
    }
}

function RemplacementPointVirgule_remplacementDureeTravail(jour, modaliteHoraire) 
{
    modaliteHoraire = parseFloat(modaliteHoraire);
    if (jour.includes(",") == true) 
    {
        jour = jour.replace(",", ".");
    }
    var value = parseFloat(jour);

    if (value == 0.1) 
    {
        value = value * modaliteHoraire;
    }

    if (value == 0.2) 
    {
        value = value * modaliteHoraire;
    }

    if (value == 0.3) 
    {
        value = value * modaliteHoraire;
    }

    if (value == 0.4) 
    {
        value = value * modaliteHoraire;
    }

    if (value == 0.5) 
    {
        value = value * modaliteHoraire;
    }

    if (value == 0.6) 
    {
        value = value * modaliteHoraire;
    }

    if (value == 0.7) 
    {
        value = value * modaliteHoraire;
    }

    if (value == 0.8) 
    {
        value = value * modaliteHoraire;
    }

    if (value == 0.9) 
    {
        value = value * modaliteHoraire;
    }

    if (value == 1) 
    {
        value = value * modaliteHoraire;
    }

    value = value.toFixed(2);
    if (value.includes(".") == true) 
    {
        value = value.replace(".", ",");
    }

    return value;
}

function completeInfosAdd() 
{
    var emplacementValue = "";
    emplacement = sessionStorage.getItem("emplacement");
    tempsDePause = sessionStorage.getItem("tempsDePause");

    if (emplacement == "CGI")
    {
        emplacementValue = "O";
    }
    else if (emplacement == "NA")
    {
        emplacementValue = "NA";
    }
    else if (emplacement == "Client")
    {
        emplacementValue = "C";
    }
    else if (emplacement == "Home")
    {
        emplacementValue = "T";
    }

    if (frames[1].document.getElementById("UC_DAILYREST1$0").value == "")
    {
        frames[1].document.getElementById("UC_DAILYREST1$0").value = "NA";
        frames[1].document.getElementById("UC_DAILYREST1$0").onchange();
        frames[1].document.getElementById("UC_DAILYREST1$1").value = "NA";
        frames[1].document.getElementById("UC_DAILYREST1$1").onchange();
        frames[1].document.getElementById("UC_DAILYREST1$2").value = "NA";
        frames[1].document.getElementById("UC_DAILYREST1$2").onchange();
    }

    if (frames[1].document.getElementById("UC_DAILYREST2$0").value == "")
    {
        frames[1].document.getElementById("UC_DAILYREST2$0").value = "Y";
        frames[1].document.getElementById("UC_DAILYREST2$0").onchange();
        frames[1].document.getElementById("UC_DAILYREST2$1").value = "Y";
        frames[1].document.getElementById("UC_DAILYREST2$1").onchange();
        frames[1].document.getElementById("UC_DAILYREST2$2").value = "Y";
        frames[1].document.getElementById("UC_DAILYREST2$2").onchange();
        frames[1].document.getElementById("UC_TIME_LIN_WRK_UC_DAILYREST12$0").value = tempsDePause;
        frames[1].document.getElementById("UC_TIME_LIN_WRK_UC_DAILYREST12$0").onchange();
    }

    if (frames[1].document.getElementById("UC_DAILYREST3$0").value == "")
    {
        frames[1].document.getElementById("UC_DAILYREST3$0").value = "Y";
        frames[1].document.getElementById("UC_DAILYREST3$0").onchange();
        frames[1].document.getElementById("UC_DAILYREST3$1").value = "Y";
        frames[1].document.getElementById("UC_DAILYREST3$1").onchange();
        frames[1].document.getElementById("UC_DAILYREST3$2").value = "Y";
        frames[1].document.getElementById("UC_DAILYREST3$2").onchange();
        frames[1].document.getElementById("UC_TIME_LIN_WRK_UC_DAILYREST13$0").value = tempsDePause;
        frames[1].document.getElementById("UC_TIME_LIN_WRK_UC_DAILYREST13$0").onchange();
    }

    if (frames[1].document.getElementById("UC_DAILYREST4$0").value == "")
    {
        frames[1].document.getElementById("UC_DAILYREST4$0").value = "Y";
        frames[1].document.getElementById("UC_DAILYREST4$0").onchange();
        frames[1].document.getElementById("UC_DAILYREST4$1").value = "Y";
        frames[1].document.getElementById("UC_DAILYREST4$1").onchange();
        frames[1].document.getElementById("UC_DAILYREST4$2").value = "Y";
        frames[1].document.getElementById("UC_DAILYREST4$2").onchange();
        frames[1].document.getElementById("UC_TIME_LIN_WRK_UC_DAILYREST14$0").value = tempsDePause;
        frames[1].document.getElementById("UC_TIME_LIN_WRK_UC_DAILYREST14$0").onchange();
    }

    if (frames[1].document.getElementById("UC_DAILYREST5$0").value == "")
    {
        frames[1].document.getElementById("UC_DAILYREST5$0").value = "Y";
        frames[1].document.getElementById("UC_DAILYREST5$0").onchange();
        frames[1].document.getElementById("UC_DAILYREST5$1").value = "Y";
        frames[1].document.getElementById("UC_DAILYREST5$1").onchange();
        frames[1].document.getElementById("UC_DAILYREST5$2").value = "Y";
        frames[1].document.getElementById("UC_DAILYREST5$2").onchange();
        frames[1].document.getElementById("UC_TIME_LIN_WRK_UC_DAILYREST15$0").value = tempsDePause;
        frames[1].document.getElementById("UC_TIME_LIN_WRK_UC_DAILYREST15$0").onchange();
    }

    if (frames[1].document.getElementById("UC_DAILYREST6$0").value == "")
    {
        frames[1].document.getElementById("UC_DAILYREST6$0").value = "Y";
        frames[1].document.getElementById("UC_DAILYREST6$0").onchange();
        frames[1].document.getElementById("UC_DAILYREST6$1").value = "Y";
        frames[1].document.getElementById("UC_DAILYREST6$1").onchange();
        frames[1].document.getElementById("UC_DAILYREST6$2").value = "Y";
        frames[1].document.getElementById("UC_DAILYREST6$2").onchange();
        frames[1].document.getElementById("UC_TIME_LIN_WRK_UC_DAILYREST16$0").value = tempsDePause;
        frames[1].document.getElementById("UC_TIME_LIN_WRK_UC_DAILYREST16$0").onchange();
    }

    if (frames[1].document.getElementById("UC_DAILYREST7$0").value == "")
    {
        frames[1].document.getElementById("UC_DAILYREST7$0").value = "NA";
        frames[1].document.getElementById("UC_DAILYREST7$0").onchange();
        frames[1].document.getElementById("UC_DAILYREST7$1").value = "NA";
        frames[1].document.getElementById("UC_DAILYREST7$1").onchange();
        frames[1].document.getElementById("UC_DAILYREST7$2").value = "NA";
        frames[1].document.getElementById("UC_DAILYREST7$2").onchange();
    }

    if (frames[1].document.getElementById("UC_LOCATION_A2$0").value == "")
    {
        frames[1].document.getElementById("UC_LOCATION_A2$0").value = emplacementValue;
        frames[1].document.getElementById("UC_LOCATION_A2$0").onchange();
    }

    if (frames[1].document.getElementById("UC_LOCATION_A3$0").value == "")
    {
        frames[1].document.getElementById("UC_LOCATION_A3$0").value = emplacementValue;
        frames[1].document.getElementById("UC_LOCATION_A3$0").onchange();
    }

    if (frames[1].document.getElementById("UC_LOCATION_A4$0").value == "")
    {
        frames[1].document.getElementById("UC_LOCATION_A4$0").value = emplacementValue;
        frames[1].document.getElementById("UC_LOCATION_A4$0").onchange();
    }

    if (frames[1].document.getElementById("UC_LOCATION_A5$0").value == "")
    {
        frames[1].document.getElementById("UC_LOCATION_A5$0").value = emplacementValue;
        frames[1].document.getElementById("UC_LOCATION_A5$0").onchange();
    }

    if (frames[1].document.getElementById("UC_LOCATION_A6$0").value == "")
    {
        frames[1].document.getElementById("UC_LOCATION_A6$0").value = emplacementValue;
        frames[1].document.getElementById("UC_LOCATION_A6$0").onchange();
    }

    if (frames[1].document.getElementById("UC_LOCATION_A2$1").value == "")
    {
        frames[1].document.getElementById("UC_LOCATION_A2$1").value = emplacementValue;
        frames[1].document.getElementById("UC_LOCATION_A2$1").onchange();
    }

    if (frames[1].document.getElementById("UC_LOCATION_A3$1").value == "")
    {
        frames[1].document.getElementById("UC_LOCATION_A3$1").value = emplacementValue;
        frames[1].document.getElementById("UC_LOCATION_A3$1").onchange();
    }

    if (frames[1].document.getElementById("UC_LOCATION_A4$1").value == "")
    {
        frames[1].document.getElementById("UC_LOCATION_A4$1").value = emplacementValue;
        frames[1].document.getElementById("UC_LOCATION_A4$1").onchange();
    }

    if (frames[1].document.getElementById("UC_LOCATION_A5$1").value == "")
    {
        frames[1].document.getElementById("UC_LOCATION_A5$1").value = emplacementValue;
        frames[1].document.getElementById("UC_LOCATION_A5$1").onchange();
    }

    if (frames[1].document.getElementById("UC_LOCATION_A5$1").value == "")
    {
        frames[1].document.getElementById("UC_LOCATION_A5$1").value = emplacementValue;
        frames[1].document.getElementById("UC_LOCATION_A5$1").onchange();
    }

    if (frames[1].document.getElementById("UC_LOCATION_A6$1").value == "")
    {
        frames[1].document.getElementById("UC_LOCATION_A6$1").value = emplacementValue;
        frames[1].document.getElementById("UC_LOCATION_A6$1").onchange();
    }
}