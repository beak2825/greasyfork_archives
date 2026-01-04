// ==UserScript==
// @name         RW toolkit
// @version      2025.06.26
// @description  Toolkit for WP websites
// @exclude      *://trackers.pilotsystems.net/*
// @match        *://*/*
// @author       Marshkalk
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @namespace https://greasyfork.org/users/1292059
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/493242/RW%20toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/493242/RW%20toolkit.meta.js
// ==/UserScript==

// Votre collection d'objets avec les environnements prod et preprod
const urls = [
    { prod: "https://www.1001cocktails.com/", prodBO: "https://www.1001cocktails.com/wp-admin", preprod: "https://1001cocktails.pp.webpick.info/", preprodBO: "https://1001cocktails.pp.webpick.info/wp-admin", name: "1001cocktails" },
    { prod: "https://www.supersoluce.com/actualites/", prodBO: "https://www.supersoluce.com/actualites/wp-admin", preprod: "https://www.actu-supersoluce.pp.webpick.info/", preprodBO: "https://www.actu-supersoluce.pp.webpick.info/wp-admin", name: "Actu SuperSoluce" },
    { prod: "https://astro.nextplz.fr/", prodBO: "https://astro.nextplz.fr/wp-admin", preprod: "https://astro.pp.webpick.info/", preprodBO: "https://astro.pp.webpick.info/wp-admin", name: "Astro" },
    { prod: "https://www.aufeminin.com/", prodBO: "https://www.aufeminin.com/wp-admin", preprod: "https://aufeminin.preprod.webpick.info/", preprodBO: "https://aufeminin.preprod.webpick.info/wp-admin", name: "Au Feminin" },
    { prod: "https://www.autojournal.fr/", prodBO: "https://www.autojournal.fr/wp-admin", preprod: "https://autojournal.pp.webpick.info/", preprodBO: "https://autojournal.pp.webpick.info/wp-admin", name: "Autojournal" },
    { prod: "https://www.autoplus.fr/", prodBO: "https://www.autoplus.fr/wp-admin", preprod: "https://autoplus.pp.webpick.info/", preprodBO: "https://autoplus.pp.webpick.info/wp-admin", name: "Autoplus" },
    { prod: "https://www.beaute-test.com/mag/", prodBO: "https://www.beaute-test.com/mag/wp-admin", preprod: "https://btmag.pp.webpick.info/", preprodBO: "https://btmag.pp.webpick.info/wp-admin", name: "Beaute Test / BT Magazine" },
    { prod: "https://www.bibamagazine.fr/", prodBO: "https://www.bibamagazine.fr/wp-admin", preprod: "https://biba-v2.pp.webpick.info/", preprodBO: "https://biba-v2.pp.webpick.info/wp-admin", name: "Biba" },
    { prod: "https://www.bienalacampagne.fr/", prodBO: "https://www.bienalacampagne.fr/wp-admin", preprod: "https://bienalacampagne.pp.webpick.info/", preprodBO: "https://bienalacampagne.pp.webpick.info/wp-admin", name: "Bien a la Compagne" },
    { prod: "https://www.closermag.fr/", prodBO: "https://www.closermag.fr/wp-admin", preprod: "https://closermag.pp.webpick.info/", preprodBO: "https://closermag.pp.webpick.info/wp-admin", name: "Closer" },
    { prod: "https://www.cnetfrance.fr/", prodBO: "https://www.cnetfrance.fr/wp-admin", preprod: "https://cnet.pp.webpick.info/", preprodBO: "https://cnet.pp.webpick.info/wp-admin", name: "Cnet" },
    { prod: "https://www.diapasonmag.fr/", prodBO: "https://www.diapasonmag.fr/wp-admin", preprod: "https://diapason.pp.webpick.info/", preprodBO: "https://diapason.pp.webpick.info/wp-admin", name: "Diapason Mag" },
    { prod: "https://www.doctissimo.fr/", prodBO: "https://www.doctissimo.fr/wp-admin", preprod: "https://docti.pp.webpick.info/", preprodBO: "https://docti.pp.webpick.info/wp-admin", name: "Doctissimo" },
    { prod: "https://www.dzfoot.com/", prodBO: "https://www.dzfoot.com/wp-admin", preprod: "https://dzfoot.pp.webpick.info/", preprodBO: "https://dzfoot.pp.webpick.info/wp-admin", name: "DZfoot" },
    { prod: "https://www.eclypsia.com/", prodBO: "https://www.eclypsia.com/wp-admin", preprod: "https://eclypsia.pp.webpick.info/", preprodBO: "https://eclypsia.pp.webpick.info/wp-admin", name: "Eclypsia" },
    { prod: "https://www.elleadore.com/", prodBO: "https://www.elleadore.com/wp-admin", preprod: "https://elleadore.pp.webpick.info/", preprodBO: "https://elleadore.pp.webpick.info/wp-admin", name: "Elle Adore" },
    { prod: "https://www.entrenous.fr/", prodBO: "https://www.entrenous.fr/wp-admin", preprod: "https://entrenous.pp.webpick.info/", preprodBO: "https://entrenous.pp.webpick.info/wp-admin", name: "Entre Nous" },
    { prod: "https://f1i.autojournal.fr/", prodBO: "https://f1i.autojournal.fr/wp-admin", preprod: "https://f1i.pp.webpick.info/", preprodBO: "https://f1i.pp.webpick.info/wp-admin", name: "F1i " },
    { prod: "https://www.football365.fr/", prodBO: "https://www.football365.fr/wp-admin", preprod: "https://foot365pp.sport365.fr/", preprodBO: "https://foot365pp.sport365.fr/wp-admin", name: "Foot 365" },
    { prod: "https://www.football.fr/", prodBO: "https://www.football.fr/wp-admin", preprod: "https://footballpp.sport365.fr/", preprodBO: "https://footballpp.sport365.fr/wp-admin", name: "Football" },
    { prod: "https://gourmand.viepratique.fr/", prodBO: "https://gourmand.viepratique.fr/wp-admin", preprod: "https://gourmand.pp.webpick.info/", preprodBO: "https://gourmand.pp.webpick.info/wp-admin", name: "Gourmand" },
    { prod: "https://www.grazia.fr/", prodBO: "https://www.grazia.fr/wp-admin", preprod: "https://grazia-v2.pp.webpick.info/", preprodBO: "https://grazia-v2.pp.webpick.info/wp-admin", name: "Grazia" },
    { prod: "https://club.grazia.fr", prodBO: "https://club.grazia.frwp-admin", preprod: "https://graziaclubvip.pp.webpick.info/", preprodBO: "https://graziaclubvip.pp.webpick.info/wp-admin", name: "Grazia Club VIP" },
    { prod: "https://homeophyto.topsante.com/", prodBO: "https://homeophyto.topsante.com/wp-admin", preprod: "https://homeophyto.pp.webpick.info/", preprodBO: "https://homeophyto.pp.webpick.info/wp-admin", name: "Homeophyto" },
    { prod: "https://www.lacremedugaming.fr/", prodBO: "https://www.lacremedugaming.fr/wp-admin", preprod: "https://creme-gaming-v2.pp.webpick.info/", preprodBO: "https://creme-gaming-v2.pp.webpick.info/wp-admin", name: "La Creme de Gaming" },
    { prod: "https://www.lechasseurfrancais.com/", prodBO: "https://www.lechasseurfrancais.com/wp-admin", preprod: "https://lcf.pp.webpick.info/", preprodBO: "https://lcf.pp.webpick.info/wp-admin", name: "Le Chasseur Francais" },
    { prod: "https://www.lejournaldelamaison.fr/", prodBO: "https://www.lejournaldelamaison.fr/wp-admin", preprod: "https://deco.pp.webpick.info/", preprodBO: "https://deco.pp.webpick.info/wp-admin", name: "Le Journal de la Maison" },
    { prod: "https://www.mamaisonsure.fr/", prodBO: "https://www.mamaisonsure.fr/wp-admin", preprod: "https://verisure.pp.webpick.info/", preprodBO: "https://verisure.pp.webpick.info/wp-admin", name: "Ma Maison Sure" },
    { prod: "https://www.maison-travaux.fr/", prodBO: "https://www.maison-travaux.fr/wp-admin", preprod: "https://maison-travaux.pp.webpick.info/", preprodBO: "https://maison-travaux.pp.webpick.info/wp-admin", name: "Maison & Travaux" },
    { prod: "https://pro.maison-travaux.fr/", prodBO: "https://pro.maison-travaux.fr/wp-admin", preprod: "https://mtpro.pp.webpick.info/", preprodBO: "https://mtpro.pp.webpick.info/wp-admin", name: "Maison & Travaux Pro" },
    { prod: "https://www.mariefrance.fr/", prodBO: "https://www.mariefrance.fr/wp-admin", preprod: "https://mariefrance.pp.webpick.info/", preprodBO: "https://mariefrance.pp.webpick.info/wp-admin", name: "Marie France" },
    { prod: "https://www.melty.fr/", prodBO: "https://www.melty.fr/wp-admin", preprod: "https://meltyfr-v2.pp.webpick.info/", preprodBO: "https://meltyfr-v2.pp.webpick.info/wp-admin", name: "Melty" },
    { prod: "https://www.modesettravaux.fr/", prodBO: "https://www.modesettravaux.fr/wp-admin", preprod: "https://modesettravaux.pp.webpick.info/", preprodBO: "https://modesettravaux.pp.webpick.info/wp-admin", name: "Mode et travaux" },
    { prod: "https://www.moncointoilettes.fr/", prodBO: "https://www.moncointoilettes.fr/wp-admin", preprod: "https://geberit.pp.webpick.info/", preprodBO: "https://geberit.pp.webpick.info/wp-admin", name: "Mon Coin Toilettes" },
    { prod: "https://monjardinmamaison.maison-travaux.fr/", prodBO: "https://monjardinmamaison.maison-travaux.fr/wp-admin", preprod: "https://mjmm.pp.webpick.info/", preprodBO: "https://mjmm.pp.webpick.info/wp-admin", name: "Mon Jardin Ma Maison" },
    { prod: "https://www.netmums.com/", prodBO: "https://www.netmums.com/wp-admin", preprod: "https://netmums.pp.webpick.info/", preprodBO: "https://netmums.pp.webpick.info/wp-admin", name: "Netmums" },
    { prod: "https://www.nextplz.fr/", prodBO: "https://www.nextplz.fr/wp-admin", preprod: "https://nextplz.pp.webpick.info/", preprodBO: "https://nextplz.pp.webpick.info/wp-admin", name: "NextPlz" },
    { prod: "https://paroledemamans.com/", prodBO: "https://paroledemamans.com/wp-admin", preprod: "https://paroledemamans.pp.webpick.info/", preprodBO: "https://paroledemamans.pp.webpick.info/wp-admin", name: "Parole de mamans" },
    { prod: "https://www.peaches.fr/", prodBO: "https://www.peaches.fr/wp-admin", preprod: "https://peaches.pp.webpick.info/", preprodBO: "https://peaches.pp.webpick.info/wp-admin", name: "Peaches" },
    { prod: "https://www.pensonsdemain.fr/", prodBO: "https://www.pensonsdemain.fr/wp-admin", preprod: "https://resgreen.pp.webpick.info/", preprodBO: "https://resgreen.pp.webpick.info/wp-admin", name: "Pensons Demain" },
    { prod: "https://www.gamme-doctissimo-parapharmacie.fr/", prodBO: "https://www.gamme-doctissimo-parapharmacie.fr/wp-admin", preprod: "http://doctissimo.pp.webpick.info/", preprodBO: "http://doctissimo.pp.webpick.info/wp-admin", name: "Pharmacie Doctissimo" },
    { prod: "https://www.pierrotlefoot.com/", prodBO: "https://www.pierrotlefoot.com/wp-admin", preprod: "https://pierrotpp.sport365.fr/", preprodBO: "https://pierrotpp.sport365.fr/wp-admin", name: "Pierrot" },
    { prod: "https://www.pleinevie.fr/", prodBO: "https://www.pleinevie.fr/wp-admin", preprod: "https://www.pleinevie.pp.webpick.info/", preprodBO: "https://www.pleinevie.pp.webpick.info/wp-admin", name: "Plein Vie" },
    { prod: "https://www.psychologies.com/", prodBO: "https://www.psychologies.com/wp-admin", preprod: "https://psycho-v2.pp.webpick.info/", preprodBO: "https://psycho-v2.pp.webpick.info/wp-admin", name: "Psychologies" },
    { prod: "https://www.reponsesphoto.fr/", prodBO: "https://www.reponsesphoto.fr/wp-admin", preprod: "https://reponses-photo.pp.webpick.info/", preprodBO: "https://reponses-photo.pp.webpick.info/wp-admin", name: "Reponses Photo" },
    { prod: "https://www.rugby365.fr/", prodBO: "https://www.rugby365.fr/wp-admin", name: "Rugby 365" },
    { prod: "https://www.revedecombles.fr/", prodBO: "https://www.revedecombles.fr/wp-admin", preprod: "https://revedecombles.pp.webpick.info/", preprodBO: "https://revedecombles.pp.webpick.info/wp-admin", name: "Rêve de Combles" },
    { prod: "https://www.science-et-vie.com/", prodBO: "https://www.science-et-vie.com/wp-admin", preprod: "https://scienceetvie.pp.webpick.info/", preprodBO: "https://scienceetvie.pp.webpick.info/wp-admin", name: "Science et Vie" },
    { prod: "https://www.sport365.fr/", prodBO: "https://www.sport365.fr/wp-admin", name: "Sport 365" },
    { prod: "https://www.sportauto.fr/", prodBO: "https://www.sportauto.fr/wp-admin", preprod: "https://sportauto.pp.webpick.info/", preprodBO: "https://sportauto.pp.webpick.info/wp-admin", name: "SportAuto" },
    { prod: "https://www.sports.fr/", prodBO: "https://www.sports.fr/wp-admin", preprod: "https://sportspp.sport365.fr/", preprodBO: "https://sportspp.sport365.fr/wp-admin", name: "Sports" },
    { prod: "https://www.tanin.fr/", prodBO: "https://www.tanin.fr/wp-admin", preprod: "https://tanin-v2.pp.webpick.info/", preprodBO: "https://tanin-v2.pp.webpick.info/wp-admin", name: "Tanin" },
    { prod: "https://www.telepoche.fr/", prodBO: "https://www.telepoche.fr/wp-admin", preprod: "https://telepoche.pp.webpick.info/", preprodBO: "https://telepoche.pp.webpick.info/wp-admin", name: "Tele Poche" },
    { prod: "https://www.telestar.fr/", prodBO: "https://www.telestar.fr/wp-admin", preprod: "https://telestar-v2.pp.webpick.info/", preprodBO: "https://telestar-v2.pp.webpick.info/wp-admin", name: "TeleStar" },
    { prod: "https://tendances.mariefrance.fr/", prodBO: "https://tendances.mariefrance.fr/wp-admin", preprod: "https://tendancesmf.pp.webpick.info/", preprodBO: "https://tendancesmf.pp.webpick.info/wp-admin", name: "Tendance Marie France" },
    { prod: "https://www.topsante.com/", prodBO: "https://www.topsante.com/wp-admin", preprod: "https://topsante.pp.webpick.info/", preprodBO: "https://topsante.pp.webpick.info/wp-admin", name: "TopSante" },
    { prod: "https://www.union.fr/", prodBO: "https://www.union.fr/wp-admin", preprod: "N/A", preprodBO: "N/Awp-admin", name: "Union" },
    { prod: "https://www.viepratique.fr/", prodBO: "https://www.viepratique.fr/wp-admin", preprod: "https://feminin.pp.webpick.info/", preprodBO: "https://feminin.pp.webpick.info/wp-admin", name: "Vie Pratique Feminin" },
    { prod: "https://www.europe2.fr/", prodBO: "https://www.europe2.fr/wp-admin", preprod: "https://europe2.pp.webpick.info/", preprodBO: "https://europe2.pp.webpick.info/wp-admin", name: "Virgin Radio" },
    { prod: "https://www.zdnet.fr/", prodBO: "https://www.zdnet.fr/wp-admin", preprod: "https://zdnet.pp.webpick.info/", preprodBO: "https://zdnet.pp.webpick.info/wp-admin", name: "Zdnet" },
];

const ignore_query_param = [
    's',
    'p',
]

let style = document.createElement('style');
style.innerHTML = `
    #tools a::after {
        content: "|";
        margin: 0 5px;
    }

    #content-box {
        font-family: sans-serif;
    }

    #content-box h1 {
        font-size: 24px;
        line-height: 40px;
        padding: 0 0 15px 0;
    }

    #content-box h2 {
        font-size: 20px;
        line-height: 30px;
        padding: 10px 0;
    }

    #content-box p, #content-box li {
        font-size: 12px;
        line-height: 15px;
        padding: 5px 0;
    }

    #options li {
        font-family: sans-serif;
        font-size: 16px;
    }

    .ad-slot-overlay {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        font-size: 12px;
        padding: 6px 8px;
        z-index: 9999;
        font-family: monospace;
        width: max-content;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }

    .ad-slot-overlay p {
        color: white;
        font-size: 12px;
        font-family: monospace;
    }
`;

// Ajouter l'élément <style> au <head>
if (window.top === window.self) {
  document.head.appendChild(style);
}

function insert(li, ti, type, elem) {
    var liDiv = document.createElement('div');

    // Appliquer le style CSS
    liDiv.style.display = "inline-block";
    liDiv.style.verticalAlign = 'top';
    liDiv.style.margin = '5px 10px';
    liDiv.id = type;

    elem.appendChild(liDiv); // Assurez-vous que `newDiv` est défini quelque part dans votre code

    // Création du titre pour la liste
    var title = document.createElement('h2');
    title.textContent = ti;
    liDiv.appendChild(title);

    // Création du champ de recherche
    var searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('placeholder', 'Recherche...');
    sessionStorage_getItem(type) ? searchInput.setAttribute('value', sessionStorage_getItem(type)): false;
    searchInput.style.marginBottom = '10px';
    searchInput.style.display = "block";
    liDiv.appendChild(searchInput);

    // Création du bouton de recherche
    var searchButton = document.createElement('button');
    searchButton.textContent = 'Rechercher';
    searchButton.style.display = 'none'
    liDiv.appendChild(searchButton);

    var listDiv = document.createElement('div');
    liDiv.appendChild(listDiv);

    // Création de la liste
    var list = document.createElement('ul');
    list.id = 'listContainer'; // Ajouter un identifiant pour manipuler la liste plus facilement

    Object.entries(li).forEach(function([key, value]) {
        var newValue
        switch (type) {
            case "omep":
                if (window.rw_toolkit.omep_update[key] == 1 ) {
                    value = false;
                    newValue = true;
                } else if (window.rw_toolkit.omep_update[key] == 0 ) {
                    value = true;
                    newValue = false;
                }
                break;
        }

        var listItem = document.createElement('li');
        var f_text = type === "templates" ? value : key;
        var f_value = type === "templates" ? false : value;

        listItem.textContent = `${f_text} : `;
        listItem.style.padding = "2px";

        var button = document.createElement('button');
        button.id = key; // Assurez-vous que 'key' est défini
        button.setAttribute("data-type", type); // Assurez-vous que 'type' est défini
        button.setAttribute("data-key", f_text);
        button.setAttribute("data-value", f_value);
        button.style.padding = "2px 5px";
        button.style.width = "fit-content";
        if (newValue === false | newValue === true) {
            button.textContent = newValue ? 'True' : 'False';
            button.setAttribute('data-new-value', newValue);
            button.style.backgroundColor = newValue ? '#33FF96' : '#FF5733';
        } else {
            button.textContent = f_value ? 'True' : 'False';
            button.style.backgroundColor = f_value ? '#33FF96' : '#FF5733';
        }

        button.onclick = function() {
            handleClick(this);
            urlUpdate();
        };

        listItem.appendChild(button);

        if (type === "partners") {
            // console.log(key + " : " + site_config_js.conditioned_partners);
            if (site_config_js.conditioned_partners && typeof site_config_js.conditioned_partners !== 'undefined' && site_config_js.conditioned_partners.includes(key)) { //config.conditioned_partners.includes(key) ou key === "opti_digital"
                var cond = document.createElement('div');
                cond.style.padding = "2px 5px";
                cond.textContent = "Conditionné";
                cond.style.width = "fit-content";
                cond.style.display = "inline-block";
                cond.style.color = "#650000";
                cond.style.margin = "0 5px";
                cond.style.border = "1px solid #650000";

                listItem.appendChild(cond);
            }
        }

        list.appendChild(listItem);
    });

    // Ajout de la liste à la div
    listDiv.appendChild(list);

    filterList();

    // Fonction de filtrage des éléments de la liste
    function filterList() {
        var filterText = searchInput.value.toLowerCase();
        sessionStorage_storeItem(type ,filterText);
        var liItems = list.getElementsByTagName('li');
        Array.from(liItems).forEach(function(item) {
            var text = item.textContent.toLowerCase();
            if (text.includes(filterText)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Écouteur d'événement sur le champ de recherche pour filtrer en temps réel
    searchInput.addEventListener('input', filterList);
}

function convertKeysToLowercase(obj) {
    const lowerObj = {};
    Object.keys(obj).forEach(key => {
        lowerObj[key.toLowerCase()] = obj[key];
    });
    return lowerObj;
}

function orderObj(obj) {
    const orderedObj = {};
    Object.keys(obj).sort().forEach(key => {
        orderedObj[key] = obj[key];
    });
    return orderedObj;
}

function handleClick(button) {
    // Récupérer les valeurs des attributs data-type, data-key, et data-value
    var dataType = button.getAttribute('data-type');
    var dataKey = button.getAttribute('data-key');
    var dataValue = (button.getAttribute('data-value') === "true");
    var newDataValue = button.getAttribute('data-new-value') !== null ? (button.getAttribute('data-new-value') === "true") : null;

    // Définir un nouvel attribut data-new-value sur le bouton (exemple de combinaison des valeurs)
    if (newDataValue === null) {
        newDataValue = !dataValue;
    } else {
        newDataValue = !newDataValue;
    }

    // Traitement des attributs récupérés (exemple d'affichage dans la console)
    // console.log("Type:", dataType, "| Key:", dataKey, "| Value:", dataValue, "| newValue:", newDataValue, "| check:", newDataValue != dataValue);

    button.textContent = newDataValue ? 'True' : 'False';
    button.style.backgroundColor = newDataValue ? '#33FF96' : '#FF5733';
    button.setAttribute('data-new-value', newDataValue);

    // Afficher le nouvel attribut data-new-value
    //console.log("Nouvelle valeur:", button.getAttribute('data-new-value'));

    switch (dataType) {
        case "omeps":
            if (newDataValue != dataValue) {
                window.rw_toolkit.omep_update[dataKey] = newDataValue ? 1 : 0;
            } else {
                delete window.rw_toolkit.omep_update[dataKey];
            }
            break;
        case "partners":
            if (newDataValue != dataValue) {
                newDataValue ? window.rw_toolkit.partners.enable.push(dataKey) : window.rw_toolkit.partners.disable.push(dataKey)
            } else {
                newDataValue ? window.rw_toolkit.partners.enable.push(dataKey) : window.rw_toolkit.partners.disable.push(dataKey)
            }
            newDataValue ? delete_array_value(window.rw_toolkit.partners.disable, dataKey) : delete_array_value(window.rw_toolkit.partners.enable, dataKey)
            break;
    }
}

function setDisabledCache() {
    window.rw_toolkit.ts = Date.now();
    urlUpdate();
    const new_url = ajouterOuMettreAJourQueryStringDansUrl(window.location.href);
    //console.log(new_url);
    redirect(new_url);
}

function unsetDisabledCache() {
    window.rw_toolkit.ts = null;
    urlUpdate();
    const new_url = ajouterOuMettreAJourQueryStringDansUrl(window.location.href);
    redirect(new_url);
}

function delete_array_value(array, value) {
    let index = array.indexOf(value)
    if (index > -1) {
        array.splice(index, 1);
    }
}


// Fonction pour construire la partie query string à partir des objets
function construireQueryString() {
    // Assurez-vous que window.rw_toolkit.partners et window.rw_toolkit.omep_update existent
    if (!window.rw_toolkit.partners || !window.rw_toolkit.omep_update) {
        console.warn('Les objets nécessaires ne sont pas définis.');
        return '';
    }

    const partiesActives = window.rw_toolkit.partners.enable.join(',');
    const partiesDesactives = window.rw_toolkit.partners.disable.join(',');
    const omepUpdates = Object.entries(window.rw_toolkit.omep_update)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

    const elements = []

    if (partiesActives) {
        elements.push(`active_partners=${partiesActives}`);
    }
    if (partiesDesactives) {
        elements.push(`desactive_partners=${partiesDesactives}`);
    }
    if (omepUpdates) {
        elements.push(omepUpdates);
    }
    if (window.rw_toolkit.ts) {
        elements.push(`disable_cache=${window.rw_toolkit.ts}&newcdn=${window.rw_toolkit.ts}`);
    }

    var qs = elements.join('&');
    // Construire la chaîne de requête complète
    return qs;
}

// Fonction pour ajouter la query string aux URLs au clic
function ajouterOuMettreAJourQueryStringDansUrl(url) {
    const queryString = construireQueryString();
    let fullURL = createFullUrl(url);
    let urlObjet = new URL(fullURL);
    if (queryString != "") {
        let originalUrl = urlObjet.origin + urlObjet.pathname + "?" + queryString
        // console.log("url_change from " + fullURL + " to " + originalUrl);
        return originalUrl.toString();
    } else {
        let originalUrl = urlObjet.origin + urlObjet.pathname;
        // console.log("url_change from " + fullURL + " to " + originalUrl);
        return originalUrl;
    }
}

function urlUpdate() {
    document.querySelectorAll('a[href]').forEach(link => {
        if(!link.href.includes("/wp-admin") && link.href.includes(window.location.host)) {
            link.href = ajouterOuMettreAJourQueryStringDansUrl(link.href);
        }
    });

    document.querySelectorAll('[data-ref]').forEach(elem => {
        var currentParamString = elem.getAttribute('data-ref');
        if(!currentParamString.includes("/wp-admin") && currentParamString.includes(window.location.host)) {
            elem.setAttribute('data-ref', ajouterOuMettreAJourQueryStringDansUrl(currentParamString));
        }
    });
}

function purgeURL() {
    const purge_url = window.location.origin + "/purge" + window.location.pathname;
    return purge_url;
}

function redirect(url) {
    // Redirect the browser to another URL
    window.location.href = url;
}

function redirectIfPurge(delay) {
    // Vérifier si l'URL actuelle contient '/purge/'
    if (window.location.href.includes('/purge/')) {
        // Utiliser setTimeout pour retarder la redirection
        setTimeout(function() {
            window.location.href = window.location.href.replace('/purge/', '/');
        }, delay);
    }
}

function createFullUrl(relativeUrl) {
    // Vérifie si le relativeUrl commence par '//'
    if (relativeUrl.startsWith('//')) {
        return 'https:' + relativeUrl;
    }
    if (!relativeUrl.includes(window.location.host)) {
        return window.location.href + relativeUrl;
    }
    return relativeUrl;
}

function open_url(url) {
    window.rw_toolkit.open(url, '_blank');
};

function getURL(urls) {
    const currentDomain = new URL(window.location.href).origin;

    for (const entry of urls) {
        let prodDomain = null;
        let preprodDomain = null;

        try {
            if (entry.prod) prodDomain = new URL(entry.prod).origin;
        } catch (e) {}

        try {
            if (entry.preprod) preprodDomain = new URL(entry.preprod).origin;
        } catch (e) {}

        if (prodDomain === currentDomain || preprodDomain === currentDomain) {
            return entry;
        }
    }

    return null;
}

function localStorage_storeItem(key, value) {
    localStorage.setItem(key, value);
    console.log(`L'élément avec la clé "${key}" a été stocké avec la valeur "${value}".`);
}

function localStorage_getItem(key) {
    const value = localStorage.getItem(key);
    if (value) {
        console.log(`La valeur de l'élément avec la clé "${key}" est "${value}".`);
        return value;
    } else {
        console.log(`Aucun élément trouvé avec la clé "${key}".`);
        return null;
    }
}

function sessionStorage_storeItem(key, value) {
    sessionStorage.setItem(key, value);
    //console.log(`L'élément avec la clé "${key}" a été stocké avec la valeur "${value}".`);
}

function sessionStorage_getItem(key) {
    const value = sessionStorage.getItem(key);
    if (value) {
        // console.log(`La valeur de l'élément avec la clé "${key}" est "${value}".`);
        return value;
    } else {
        // console.log(`Aucun élément trouvé avec la clé "${key}".`);
        return null;
    }
}

function cleanJsLikeObjectString(jsString) {
  return jsString
    .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // clés sans guillemets
    .replace(/'([^']*?)'/g, (_, val) => `"${val.replace(/"/g, '\\"')}"`); // valeurs entre apostrophes
}

function decodeHTMLEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

function check_wprocket() {
    // Créer un tableau pour stocker les scripts
    const rocketloaded_scripts = [];

    // Obtenir tous les scripts sur la page
    const scripts = document.getElementsByTagName('script');

    // Parcourir les scripts pour trouver ceux de type rocketlazyloadscript
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].type === 'rocketlazyloadscript') {
            // Créer un objet pour stocker les attributs et le contenu du script
            const scriptData = {
                'data-rocket-src': scripts[i].getAttribute('data-rocket-src') || null,
                'data-rocketid': scripts[i].getAttribute('data-rocketid') || null,
                'content': decodeHTMLEntities(scripts[i].innerHTML.trim()) || null
            };

            // Ajouter l'objet au tableau
            rocketloaded_scripts.push(scriptData);
        }
    }
    return rocketloaded_scripts;
}

// Fonction pour ajouter ou modifier un paramètre de requête dans une URL
function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
}


// Fonction pour récupérer la valeur d'un paramètre de requête dans une URL
function getQueryParam(url, param) {
    var queryString = url.split('?')[1];
    if (!queryString) return null;

    var params = new URLSearchParams(queryString);
    return params.get(param);
}

// Déclare linksTable globalement pour qu'elle soit accessible en dehors de la requête AJAX
var linksTable = [];

// Fonction pour insérer la liste des règles dans la page
function insertRulesList(linksTable, elem) {
    // Crée une nouvelle div avec l'ID 'rules'
    var rulesDiv = document.createElement('div');
    rulesDiv.id = 'rules';
    rulesDiv.style.display = "inline-block";
    rulesDiv.style.verticalAlign = 'top';
    rulesDiv.style.margin = '5px 10px';
    elem.appendChild(rulesDiv);

    var title = document.createElement('h2');
    title.textContent = "Règles d'Affichage";
    title.style.margin = '0 0 30px 0';
    rulesDiv.appendChild(title);

    // Vérifie si linksTable n'est pas vide
    if (linksTable.length > 0) {
        // Crée un élément <ul> pour la liste des règles
        var ulElement = document.createElement('ul');

        // Parcourt chaque élément de linksTable et crée une entrée <li>
        linksTable.forEach(function(item) {
            var liElement = document.createElement('li');
            liElement.innerHTML = `Règle n°${item.id} : ${item.link}`;
            ulElement.appendChild(liElement); // Ajoute l'entrée <li> à la liste
        });

        // Insère la liste dans la div rules
        rulesDiv.appendChild(ulElement);

        // Insère la div rules dans la div lists

    } else {
        var p = document.createElement('p');
        p.textContent = "Pas de règles d'affichage identifiées";
        rulesDiv.appendChild(p);
    }
}

function refresh_adstack(container) {
    container.innerHTML = "";
    // Check de la stack pub activée
    const all_scripts = document.querySelectorAll('script');
    const pubstack_found = Array.from(all_scripts).some(script => script.src.includes("https://boot.pbstck.com/v1/adm"));

    if(typeof actirisePlugin !== 'undefined'&& actirisePlugin){
        // Création de la div principale
        const actirise = document.createElement('div');
        actirise.id = 'actiriseplugin';

        container.appendChild(actirise);

        // Ajout du titre
        const actiriseplugin_title = document.createElement('h1');
        actiriseplugin_title.textContent = 'Actirise';
        container.appendChild(actiriseplugin_title);

        const actiriseoptions_title = document.createElement('h2');
        actiriseoptions_title.textContent = 'Plugin Options';
        container.appendChild(actiriseoptions_title);

        // Ajout des champs pour chaque clé/valeur
        Object.entries(actirisePlugin).forEach(([key, value]) => {
            const wrapper = document.createElement('div');
            if (typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([k, v]) => {
                    const elem = document.createElement('p');
                    elem.innerHTML = '<b>' + key + ' -> ' + k + ':</b> ' + v;
                    elem.htmlFor = key;
                    wrapper.appendChild(elem);
                })
            } else {
                const label = document.createElement('p');
                label.innerHTML = '<b>' + key + ':</b> ' + value;
                label.htmlFor = key;
                wrapper.appendChild(label);
            }
            container.appendChild(wrapper);
        });

        if(window._hbdbrk[0][1]){
            // Ajout du titre
            const customvalue_title = document.createElement('h2');
            customvalue_title.textContent = 'Custom Values';
            container.appendChild(customvalue_title);

            // Ajout des champs pour chaque clé/valeur
            Object.entries(window._hbdbrk[0][1]).forEach(([key, value]) => {
                const wrapper = document.createElement('div');

                const label = document.createElement('p');
                label.innerHTML = '<b>' + key + ':</b> ' + value;
                label.htmlFor = key;

                wrapper.appendChild(label);
                container.appendChild(wrapper);
            });
        }
    } else if(pubstack_found) {
        // Création de la div principale
        const pubstackadm = document.createElement('div');
        pubstackadm.id = 'pubstackadm';

        container.appendChild(pubstackadm);

        // Ajout du titre
        const pubstackadm_title = document.createElement('h1');
        pubstackadm_title.textContent = 'Pubstack';
        container.appendChild(pubstackadm_title);

        const pubstack_context_title = document.createElement('h2');
        pubstack_context_title.textContent = 'Stack Options';
        container.appendChild(pubstack_context_title);

        document.querySelectorAll('meta[name^="pbstck"]').forEach(meta => {
            const pbstck_key = meta.getAttribute('name');
            const pbstck_value = meta.getAttribute('content');

            const p = document.createElement('p');
            p.innerHTML = `<b>${pbstck_key} :</b> ${pbstck_value}`;
            container.appendChild(p);
        });

        const pubstack_ad_title = document.createElement('h2');
        pubstack_ad_title.textContent = 'Ad Options';
        container.appendChild(pubstack_ad_title);

        document.querySelectorAll('meta[name^="ad:"]').forEach(meta => {
            const pbstck_key = meta.getAttribute('name');
            const pbstck_value = meta.getAttribute('content');
            //const pbstck_tronc_value = (pbstck_value.length > 100) ? pbstck_value.slice(0, 50).concat("...")  : pbstck_value;

            const p = document.createElement('p');
            p.innerHTML = `<b>${pbstck_key} :</b> ${pbstck_value}`;
            p.style.wordWrap = "break-word";
            container.appendChild(p);
        });
    } else {
        const p = document.createElement('p');
        p.innerHTML = `Pas de stack reconnue`;
        container.appendChild(p);
    }
}

function viously_extract() {

    window.rw_toolkit.viously = window.rw_toolkit.viously || {};

    // Chercher une div avec une classe commençant par "vsly-"
    const div = document.querySelector("div[class^='vsly-']");
    if (div) {
        const vastBoosterRaw = div.getAttribute("data-vast-booster-custom-macro") || div.getAttribute("data-vast-adserving-custom-macro") || div.getAttribute("data-vast-primary-custom-macro");
        // Supprimer "&cust_params=" s'il est présent
        const cleanedParams = vastBoosterRaw.replace(/^&cust_params=/, "");

        // Décoder l'URL
        const vastBoosterDecoded = decodeURIComponent(cleanedParams);

        // Transformer en objet clé-valeur
        const vastBoosterParams = Object.fromEntries(
            vastBoosterDecoded.split("&").map(param => param.split("=").map(decodeURIComponent))
        );

        window.rw_toolkit.viously.div = {
            playlist: div.getAttribute("id"),
            template: div.getAttribute("data-template"),
            cust_params: vastBoosterParams,
            vastBooster: div.getAttribute("data-vast-booster-custom-macro") ? true : false,
            vastAdServing: div.getAttribute("data-vast-adserving-custom-macro") ? true : false,
            vastPrimary: div.getAttribute("data-vast-primary-custom-macro") ? true : false,
        }
    }

    // Chercher un script avec un src spécifique
    const script = document.querySelector("script[src='https://cdn.viously.com/js/sdk/boot.js']");
    if (script) {
        window.rw_toolkit.viously.script = {
            type: script.getAttribute("type"),
            id: script.getAttribute("id"),
            async: script.hasAttribute("async"),
            defer: script.hasAttribute("defer"),
            data_rocketId: script.getAttribute("data-rocketId") ?? false,
        }
    }
}

function refresh_viously(container) {
    if(window.rw_toolkit.viously && Object.keys(window.rw_toolkit.viously).length > 0) {
        container.innerHTML = "";
        if(window.rw_toolkit.viously.script) {
            const viously_script_title = document.createElement('h2');
            viously_script_title.textContent = 'Script';
            container.appendChild(viously_script_title);

            Object.entries(window.rw_toolkit.viously.script).forEach(([key, value]) => {
                const p = document.createElement("p");
                p.innerHTML = `<b>${key}</b>: ${value}`;
                container.appendChild(p);
            });
        }

        if(window.rw_toolkit.viously.div) {
            const viously_div_title = document.createElement('h2');
            viously_div_title.textContent = 'Div';
            container.appendChild(viously_div_title);

            Object.entries(window.rw_toolkit.viously.div).forEach(([key, value]) => {
                if(key === "cust_params") {
                    Object.entries(window.rw_toolkit.viously.div.cust_params).forEach(([k, v]) => {
                        if(k != "") {
                            const p = document.createElement("p");
                            p.innerHTML = `<b>cust_params => ${k}:</b> ${v}`;
                            container.appendChild(p);
                        }
                    })
                } else {
                    const p = document.createElement("p");
                    p.innerHTML = `<b>${key}</b>: ${value}`;
                    container.appendChild(p);
                }
            });
        }
    }
}

function taboola_extract() {
    // Récupérer tous les éléments <script> de la page
    const scripts = document.getElementsByTagName('script');

    // Objet pour stocker les résultats
    const taboola_rw = {};

    // Fonction pour extraire le nom de la fonction principale
    function getFunctionName(scriptContent) {
        const functionNameRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/;
        const match = scriptContent.match(functionNameRegex);
        return match ? match[1] : 'anonymous';  // Si une fonction est trouvée, retourne son nom, sinon "anonymous"
    }

    // Fonction pour analyser le contenu du script et extraire les appels à _taboola.push
    function extractTaboolaPushData(scriptContent, scriptIndex, script) {
        const regex = /_taboola\.push\(([^)]+)\);/g;
        let match;
        const functionName = getFunctionName(scriptContent);  // Obtenir le nom de la fonction principale

        while ((match = regex.exec(scriptContent)) !== null) {
            let raw = match[1].trim();
            raw = cleanJsLikeObjectString(raw);

            let baseParams = {};
            try {
                baseParams = JSON.parse(raw);
            } catch (e) {
                console.error("Erreur de parsing JSON :", e, raw);
            }

            let params = {
                ...baseParams,
                async: script?.hasAttribute("async") ?? false,
                defer: script?.hasAttribute("defer") ?? false,
                data_rocketId: script?.getAttribute("data-rocketId") ?? false
            };

            params = JSON.stringify(params);

            console.log("Raw extrait :", raw);
            console.log("Params finaux :", params);


            // Créer un tableau si la clé n'existe pas, puis pousser l'objet dans le tableau
            taboola_rw[functionName] = taboola_rw[functionName] || [];
            taboola_rw[functionName].push({
                functionName: functionName,
                parameters: params
            });
        }
    }

    // Parcourir tous les scripts et vérifier ceux qui contiennent _taboola.push
    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];

        if (script.textContent.includes('_taboola.push')) {
            extractTaboolaPushData(script.textContent, i, script);
        }
    }

    // Fonction pour transformer un seul objet
    function transformObject(obj) {
        let params;
        try {
            // Vérifier si obj.parameters est une chaîne et nécessite un nettoyage
            if (typeof obj.parameters === 'string') {
                let correctedParams = obj.parameters;

                // Vérifier s'il y a des guillemets simples autour des clés ou des valeurs
                if (/'.+?':/.test(correctedParams)) {
                    // Remplacer les guillemets simples par des guillemets doubles autour des clés
                    correctedParams = correctedParams.replace(/(\w+)\s*:/g, '"$1":').replace(/'([^']+)'/g, '"$1"');
                }

                // Vérification si la chaîne est un JSON valide avant de la parser
                try {
                    params = JSON.parse(correctedParams);
                } catch (e) {
                    console.error("Erreur de parsing JSON après correction:", correctedParams);
                    params = {};  // Si le parsing échoue, retourner un objet vide.
                }

            } else {
                // Si obj.parameters est déjà un objet, on l'utilise directement
                params = obj.parameters;
            }
        } catch (e) {
            console.error("Erreur lors de la transformation des paramètres:", obj.parameters);
            params = {};  // Retourne un objet vide en cas d'erreur.
        }
        return { functionName: obj.functionName, ...params };
    }


    // Appliquer la transformation pour chaque clé dans l'objet
    const taboola_rw_obj = Object.keys(taboola_rw).reduce((acc, key) => {
        // Appliquer la transformation à chaque objet du tableau pour chaque clé
        acc[key] = taboola_rw[key].map(transformObject);
        return acc;
    }, {});

    window.rw_toolkit.taboola = window.rw_toolkit.taboola || {};
    // Appliquer la transformation pour chaque clé dans l'objet
    for (let [key, value] of Object.entries(taboola_rw_obj)) {
        window.rw_toolkit.taboola[key] = value[0];
    }
}

function refresh_taboola(container) {
    container.innerHTML = "";
    for (let [key, value] of Object.entries(window.rw_toolkit.taboola)) {
        // Créer un élément h2 pour functionName
        const h2 = document.createElement('h2');
        h2.textContent = value.functionName;
        container.appendChild(h2);

        // Itérer sur les autres clés de "value"
        for (let [k, v] of Object.entries(value)) {
            if (k != "functionName") {
                // Si tu veux aussi ajouter un <p> pour "le reste" des données
                const p = document.createElement('p');
                p.innerHTML = `<b>${k} :</b> ${v}`;
                container.appendChild(p);
            }
        }
    }
}

function seedtag_extract() {
    window.rw_toolkit.seedtag = window.rw_toolkit.seedtag || {};
    // Chercher un script avec un src spécifique
    const script = document.querySelector("script[src*='t.seedtag.com']");
    if (script) {
        window.rw_toolkit.seedtag.script = {
            type: script.getAttribute("type"),
            async: script.hasAttribute("async"),
            defer: script.hasAttribute("defer"),
            data_rocketId: script.getAttribute("data-rocketId") ?? false,
        }
    }
}

function refresh_seedtag(container) {
    container.innerHTML = "";
    if(window.rw_toolkit.seedtag.script) {
        const seedtag_script_title = document.createElement('h2');
        seedtag_script_title.textContent = 'Script';
        container.appendChild(seedtag_script_title);

        Object.entries(window.rw_toolkit.seedtag.script).forEach(([key, value]) => {
            const p = document.createElement("p");
            p.innerHTML = `<b>${key}</b>: ${value}`;
            container.appendChild(p);
        });
    }
}

function refresh_cmp(container) {
    container.innerHTML = "";
    if(typeof didomiState !== 'undefined' && didomiState) {
        const didomi_title = document.createElement('h1');
        didomi_title.textContent = 'Didomi';
        container.appendChild(didomi_title);

        const didomi_global_title = document.createElement('h2');
        didomi_global_title.textContent = 'Global';
        container.appendChild(didomi_global_title);

        const global_notice = {
            "Id": didomiRemoteConfig.notices[0].notice_id,
            "All IAB": didomiRemoteConfig.notices[0].config.app.vendors.iab.all,
            "Platform": didomiRemoteConfig.notices[0].platform,
            "URLs": didomiRemoteConfig.notices[0].targets,
        }

        for (let [k, v] of Object.entries(global_notice)) {
            if (k != "functionName") {
                // Si tu veux aussi ajouter un <p> pour "le reste" des données
                const p = document.createElement('p');
                p.innerHTML = `<b>${k} :</b> ${v}`;
                container.appendChild(p);
            }
        }

        const global_elements = ["didomiRegulationName", "didomiGDPRApplies", "didomiIABConsent"];

        global_elements.forEach(elem => {
            const p = document.createElement("p");
            p.innerHTML = `<b>${elem} :</b> ${didomiState[elem]}`;
            container.appendChild(p);
        });

        const didomi_vendor_title = document.createElement('h2');
        didomi_vendor_title.textContent = 'Vendors';
        container.appendChild(didomi_vendor_title);

        const vendor_elements = ["didomiVendorsConsent", "didomiVendorsConsentDenied", "didomiVendorsConsentUnknown"];

        vendor_elements.forEach(elem => {
            const p = document.createElement("p");
            p.innerHTML = `<b>${elem} :</b> ${didomiState[elem]}`;
            container.appendChild(p);
        });

        const didomi_purpose_title = document.createElement('h2');
        didomi_purpose_title.textContent = 'Purposes';
        container.appendChild(didomi_purpose_title);

        const purpose_elements = ["didomiPurposesConsent", "didomiPurposesConsentDenied", "didomiPurposesConsentUnknown"];

        purpose_elements.forEach(elem => {
            const p = document.createElement("p");
            p.innerHTML = `<b>${elem} :</b> ${didomiState[elem]}`;
            container.appendChild(p);
        });
    } else if(typeof FastCMP !== 'undefined' && FastCMP) {
        const viously_title = document.createElement('h1');
        viously_title.textContent = 'fastCMP';
        container.appendChild(viously_title);

        const fastcmp_global_title = document.createElement('h2');
        fastcmp_global_title.textContent = 'Global';
        container.appendChild(fastcmp_global_title);

        const global_notice = {
            "Id": FastCMP.store.INITIAL_TC_DATA.cmpId,
            "Language": FastCMP.store.INITIAL_TC_DATA.publisherCC,
            "TCF Policy Version": FastCMP.store.INITIAL_TC_DATA.tcfPolicyVersion,
            "Consent String": FastCMP.store.tcData.tcString,
        }

        for (let [k, v] of Object.entries(global_notice)) {
            if (k != "functionName") {
                // Si tu veux aussi ajouter un <p> pour "le reste" des données
                const p = document.createElement('p');
                p.innerHTML = `<b>${k} :</b> ${v}`;
                container.appendChild(p);
            }
        }

        const fastcmp_vendor_title = document.createElement('h2');
        fastcmp_vendor_title.textContent = 'Vendors';
        container.appendChild(fastcmp_vendor_title);

        const vendor_notice = {
            "Consent": Object.keys(FastCMP.store.tcData.vendor.consents).join(", "),
            "Legitimate Interest": Object.keys(FastCMP.store.tcData.vendor.legitimateInterests).join(", "),
            "Custom Vendors": FastCMP.store.tcData.custom.vendors,
        }

        for (let [k, v] of Object.entries(vendor_notice)) {
            if (k != "functionName") {
                // Si tu veux aussi ajouter un <p> pour "le reste" des données
                const p = document.createElement('p');
                p.innerHTML = `<b>${k} :</b> ${v}`;
                container.appendChild(p);
            }
        }

        const fastcmp_purpose_title = document.createElement('h2');
        fastcmp_purpose_title.textContent = 'Purpose';
        container.appendChild(fastcmp_purpose_title);

        const purpose_notice = {
            "Consent": Object.keys(FastCMP.store.tcData.purpose.consents).join(", "),
            "Legitimate Interest": Object.keys(FastCMP.store.tcData.purpose.legitimateInterests).join(", "),
        }

        for (let [k, v] of Object.entries(purpose_notice)) {
            if (k != "functionName") {
                // Si tu veux aussi ajouter un <p> pour "le reste" des données
                const p = document.createElement('p');
                p.innerHTML = `<b>${k} :</b> ${v}`;
                container.appendChild(p);
            }
        }
    } else {
        const p = document.createElement("p");
        p.innerHTML = `Pas de CMP identifiée`;
        container.appendChild(p);
    }
}

function refresh_wprocket(container) {
    container.innerHTML = "";
    const wprocket_title = document.createElement('h2');
    wprocket_title.textContent = 'RocketIds';
    container.appendChild(wprocket_title);

    let countByRocketId = {};

    window.rw_toolkit.rocketlazyloadscript.forEach(item => {
        let rocketId = item["data-rocketid"];

        // Regrouper les cas où data-rocketid est null ou n'existe pas
        if (rocketId === null || rocketId === undefined) {
            rocketId = "others";
        }

        // Incrémenter le compteur pour ce rocketId
        if (countByRocketId[rocketId]) {
            countByRocketId[rocketId]++;
        } else {
            countByRocketId[rocketId] = 1;
        }
    });

    for (let key in countByRocketId) {
        if (countByRocketId.hasOwnProperty(key)) {
            let value = countByRocketId[key];

            // Créer un nouvel élément <p>
            let pElement = document.createElement('p');
            pElement.innerHTML = `<b>${key} :</b> ${value}`;
            container.appendChild(pElement);
        }
    }

    if(rw_toolkit.rocketlazyloadscript.length === 0) {
        let pElement = document.createElement('p');
        pElement.innerHTML = `<p>Aucun script n'est identifié comme impacté par wp-rocket.</p><p>N'hésitez pas à rafraichir la page et attendre un peu avant de bouger votre souris si ce résultat vous étonne.</p><p><b>ATTENTION : NE MARCHE PAS SI VOUS ÊTES CONNECTÉ AU BACK OFFICE !!!</b></p>`;
        container.appendChild(pElement);
    }
}

function refresh_info_page(container) {
    container.innerHTML = "";

    const dataLayer_rw = typeof dataLayerName !== "undefined" ? window[dataLayerName] : (typeof dataLayer !== "undefined" ? dataLayer : (typeof unify_dataSlayer !== "undefined" ? unify_dataSlayer : undefined));
    const dataLayer_name = typeof dataLayerName !== "undefined" ? dataLayerName : (typeof dataLayer !== "undefined" ? "dataLayer" : (typeof unify_dataSlayer !== "undefined" ? "unify_dataSlayer" : undefined));

    if(typeof dataLayer_rw !== 'undefined' && dataLayer_rw) {
        const dataLayer_content_rw = dataLayer_rw.find(item => "content" in item);
        const dataLayer_page_rw = dataLayer_rw.find(item => "page" in item);

        const p = document.createElement('p');
        p.innerHTML = `<b>Datalayer Name :</b> ${dataLayer_name}`;
        container.appendChild(p);

        if(typeof dataLayer_content_rw !== 'undefined') {
            const dataLayer_content_defined_rw = dataLayer_content_rw.content;
            const info_page_content_title = document.createElement('h2');
            info_page_content_title.textContent = 'Content';
            container.appendChild(info_page_content_title);

            for (let [k, v] of Object.entries(dataLayer_content_defined_rw)) {
                if (k != "functionName") {
                    // Si tu veux aussi ajouter un <p> pour "le reste" des données
                    const p = document.createElement('p');
                    p.innerHTML = `<b>${k} :</b> ${v}`;
                    container.appendChild(p);
                }
            }
        }

        if(typeof dataLayer_page_rw !== 'undefined') {
            const dataLayer_page_defined_rw = dataLayer_page_rw.page;
            const info_page_page_title = document.createElement('h2');
            info_page_page_title.textContent = 'Page';
            container.appendChild(info_page_page_title);

            for (let [k, v] of Object.entries(dataLayer_page_defined_rw)) {
                if (k != "functionName") {
                    // Si tu veux aussi ajouter un <p> pour "le reste" des données
                    const p = document.createElement('p');
                    p.innerHTML = `<b>${k} :</b> ${v}`;
                    container.appendChild(p);
                }
            }
        }
    } else {
        const p = document.createElement('p');
        p.innerHTML = `Pas d'informations disponibles pour cette page.`;
        container.appendChild(p);
    }
}

function add_entry_to_menu(list, menu, box, contents) {
    list.forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
        li.style.padding = "10px";
        li.style.listStyle = "none";
        li.style.cursor = "pointer";
        li.addEventListener("mouseover", () => li.style.backgroundColor = "#f1f1f1");
        li.addEventListener("mouseout", () => li.style.backgroundColor = "white");
        li.addEventListener("click", () => {
            // Masquer toutes les divs dans la box
            Array.from(box.children).forEach(div => {
                div.style.display = "none";
            });
            // Afficher uniquement la div correspondante
            // console.log(contents[text]);
            // console.log(document.getElementById(contents[text]));
            document.getElementById(contents[text]).style.display = "block";
            box.style.display = "block";

            switch(text) {
                case "AdStack":
                    refresh_adstack(adstack);
                    break;
                case "Viously":
                    viously_extract();
                    refresh_viously(viously_rw);
                    break
                case "Seedtag":
                    seedtag_extract();
                    refresh_seedtag(seedtag_rw);
                    break;
                case "CMP":
                    refresh_cmp(cmp_rw);
                    break;
                case "WP-Rocket":
                    // refresh_wprocket(rw_wprocket);
                    break;
                case "Info Page":
                    refresh_info_page(info_page);
                    break;
                default:
                    break;
            }
        });
        menu.appendChild(li);
    });
}

function getNetworkCode() {
  const slots = googletag.pubads().getSlots();
  if (slots.length === 0) return null;

  const path = slots[0].getAdUnitPath(); // exemple : "/1234567/homepage/topbanner"
  const match = path.match(/^\/(\d+)/);
  return match ? match[1] : null;
}

function annotateAdSlots() {
    googletag.pubads().getSlots().forEach(slot => {
        const response = slot.getResponseInformation();

        const sizes = slot.getSizes().map(size => {
            if (Array.isArray(size)) {
                return `${size[0]}x${size[1]}`;
            } else if (typeof size === 'object' && size.getWidth) {
                return `${size.getWidth()}x${size.getHeight()}`;
            }
            return size.toString();
        }).join(', ');

        const slotTargeting = {};
        slot.getTargetingKeys().forEach(key => {
            slotTargeting[key] = slot.getTargeting(key);
        });

        const contextTargeting = {};
        googletag.pubads().getTargetingKeys().forEach(key => {
            contextTargeting[key] = googletag.pubads().getTargeting(key);
        });

        const pathParts = slot.getAdUnitPath().split('/').filter(Boolean).join(' > ');
        const id = slot.getSlotElementId();
        const el = document.getElementById(id);
        if (!el) return;

        // Création du tag visible par défaut
        const tag = document.createElement('div');
        tag.className = 'ad-slot-overlay';

        const networkCode = getNetworkCode();
        const defaultInfo = [
            `<strong>path:</strong> ${pathParts}`,
            `<strong>id:</strong> ${id}`,
            `<strong>pos:</strong> ${slotTargeting.pos || 'null'}`,
            `<strong>preprod:</strong> ${slotTargeting.preprod || contextTargeting.preprod ||'null'}`,
            `<strong>sizes:</strong> ${sizes}`,
        ];

        defaultInfo.forEach(text => {
            const p = document.createElement('p');
            p.innerHTML = text;
            p.style.margin = '0';
            tag.appendChild(p);
        });

        // Bouton détails
        const btn = document.createElement('button');
        btn.textContent = '🔍';
        btn.title = 'Voir les détails dans un nouvel onglet';
        btn.style.marginTop = '4px';
        btn.style.fontSize = '12px';
        btn.style.background = '#444';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.style.padding = '2px 6px';
        btn.style.borderRadius = '4px';
        btn.onclick = () => {
            const networkCode = getNetworkCode();
            openSlotInfoInNewTab({ id, path:pathParts, sizes, response, slotTargeting, contextTargeting, networkCode });
        };

        tag.appendChild(btn);
        el.style.position = 'relative';
        //el.appendChild(tag);
        el.parentNode.insertBefore(tag, el);
    });
}

function openSlotInfoInNewTab({ id, path, sizes, response, slotTargeting, contextTargeting, networkCode}) {
    const lines = [
        `<p><strong>path:</strong> ${path}</p>`,
        `<p><strong>id:</strong> ${id}</p>`,
        `<p><strong>pos:</strong> ${slotTargeting.pos || 'null'}</p>`,
        `<p><strong>preprod:</strong> ${slotTargeting.preprod || 'null'}</p>`,
        `<p><strong>sizes:</strong> ${sizes}</p>`,
        ...(response ? [
            `<p><strong>advertiserId:</strong> ${response.advertiserId ?? 'null'}</p>`,
            `<p><strong>dealId:</strong> <a target="_blank" href="https://admanager.google.com/${networkCode}#delivery/order/order_overview/order_id=${response.dealId ?? 'null'}">${response.dealId ?? 'null'}</a></p>`,
            `<p><strong>lineItemId:</strong> <a target="_blank" href="https://admanager.google.com/${networkCode}#delivery/line_item/detail/line_item_id=${response.lineItemId ?? 'null'}">${response.lineItemId ?? 'null'}</a></p>`,
            `<p><strong>campaignId:</strong> <a target="_blank" href="https://admanager.google.com/${networkCode}#creatives/creative/detail/creative_id=${response.campaignId ?? 'null'}">${response.campaignId ?? 'null'}</a></p>`,
            `<p><strong>creativeId:</strong> <a target="_blank" href="https://admanager.google.com/${networkCode}#deals/detail/deal_id=${response.creativeId ?? 'null'}">${response.creativeId ?? 'null'}</a></p>`
        ] : [])
    ];

    const renderTargeting = (title, data) => {
        const keys = Object.keys(data);
        const targetingHtml = keys.length > 0
        ? keys.map(k => `<p><strong>${k}:</strong> ${data[k].join(', ')}</p>`).join('')
        : '<p>(aucun)</p>';
        return `<h1>${title}</h1>${targetingHtml}`;
    };

    const renderResponse = (title, obj, networkCode) => {
        const linkableKeys = {
            campaignId: `https://admanager.google.com/${networkCode}#delivery/order/order_overview/order_id=`,
            lineItemId: `https://admanager.google.com/${networkCode}#delivery/line_item/detail/line_item_id=`,
            creativeId: `https://admanager.google.com/${networkCode}#creatives/creative/detail/creative_id=`,
            dealId: `https://admanager.google.com/${networkCode}#deals/detail/deal_id=`
        };

        const keys = Object.keys(obj || {});
        if (!obj || keys.length === 0) return `<h3>${title}</h3><p>(aucun)</p>`;

        const html = keys.map(key => {
            const val = obj[key] ?? 'null';
            const url = linkableKeys[key] && val !== 'null' ? `${linkableKeys[key]}${val}` : null;
            return `<p><strong>${key}:</strong> ${url ? `<a href="${url}" target="_blank">${val}</a>` : val}</p>`;
        }).join('');

        return `<h3>${title}</h3>${html}`;
    };

    const htmlContent = `
    <html>
      <head>
        <title>Slot Info - ${id}</title>
        <style>
          body {
            font-family: monospace;
            background: #121212;
            color: #eee;
            padding: 20px;
          }
          h2, h3 { margin-top: 20px; }
          button {
            background: #444;
            color: white;
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 4px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <h1>Informations Slot</h1>
        ${lines.join('')}
        ${renderTargeting('Targeting Slot', slotTargeting)}
        ${renderTargeting('Targeting Context', contextTargeting)}
        ${renderResponse('Response', response, networkCode)}
      </body>
    </html>
  `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}

function gam_debug() {
    // Supprimer les anciens overlays
    document.querySelectorAll('.ad-slot-overlay').forEach(el => el.remove());

    if (localStorage.getItem('rw_debug_gam') === 'on') {
        annotateAdSlots();
        googletag.cmd.push(() => {
            if (!window.rw_toolkit.isSlotRenderEndedListenerAttached) {
                googletag.pubads().addEventListener('slotRenderEnded', () => {
                    document.querySelectorAll('.ad-slot-overlay').forEach(el => el.remove());
                    annotateAdSlots();
                });
                window.rw_toolkit.isSlotRenderEndedListenerAttached = true;  // Marquer comme attaché
            }
        });
    }
}

function toggle_gam_debug() {
    if (!localStorage.getItem('rw_debug_gam') || localStorage.getItem('rw_debug_gam') === 'off') {
        localStorage.setItem('rw_debug_gam', 'on');
    } else {
        localStorage.setItem('rw_debug_gam', 'off');
    }

    gam_debug();
}

function waitForGoogletagPubads(interval = 100, timeout = 20000) {
    const startTime = Date.now();

    const check = () => {
        if (window.googletag && typeof googletag.pubads === 'function') {
            gam_debug();
        } else if (Date.now() - startTime < timeout) {
            setTimeout(check, interval);
        } else {
            console.warn("googletag.pubads() n'est pas disponible après le timeout.");
        }
    };

    check();
}

function check_tickets(name) {
    $.ajax({
        url: 'https://trackers.pilotsystems.net/@@tags?tag=vie-pratique-feminin',
        method: 'GET',
        success: function(data) {
            // Créer un DOM temporaire pour parser la réponse
            let tempDom = $('<div>').html(data);

            // Trouver la table
            let table = tempDom.find('table.table').first();

            if (table.length) {
                // Nettoyer : enlever classes, ids, styles
                table.find('*').removeAttr('class id style');
                table.removeAttr('class id style');

                // Insérer dans ta page
                $('#tracker').html(table);
            } else {
                $('#tracker').html('<p>Table non trouvée</p>');
            }
        },
        error: function(xhr, status, error) {
            console.error("Erreur AJAX:", status, error);
            console.error("Statut HTTP:", xhr.status);
            console.error("Réponse serveur:", xhr.responseText);
        }
    });
}


// URL actuelle avec le paramètre debug_partners=1
var urlWithDebug = updateQueryStringParameter(window.location.href, 'debug_partners', '1');

// Création de la requête AJAX
var xhr = new XMLHttpRequest();
xhr.open('GET', urlWithDebug, true);

xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        // La requête a réussi
        var parser = new DOMParser();
        var doc = parser.parseFromString(xhr.responseText, 'text/html'); // Parse le HTML de la réponse

        // Sélectionne tous les éléments <a> dans la réponse
        var allLinks = doc.querySelectorAll('a');

        // Vide linksTable avant de l'utiliser
        linksTable = [];

        // Parcourt chaque élément <a> et extrait les informations
        allLinks.forEach(function(link) {
            var href = link.getAttribute('href');
            if (href) {
                var indexValue = getQueryParam(href, 'index');
                if (indexValue) {
                    linksTable.push({
                        link: link.outerHTML,  // Stocke le outerHTML du lien
                        id: indexValue         // Stocke la valeur du paramètre 'index'
                    });
                }
            }
        });

        // Appel de la fonction pour insérer la liste des règles dans la page
        // const contentBox = document.getElementById("content-box");
        // insertRulesList(linksTable, contentBox);
    } else if (xhr.readyState === 4) {
        // Une erreur est survenue
        console.log('Erreur lors de l\'appel AJAX');
    }
};

xhr.send();

// Fonction d'initialisation
function init(config) {
    window.rw_toolkit = window.rw_toolkit || {};
    window.rw_toolkit.partners = {
        enable: [],
        disable: []
    };
    window.rw_toolkit.omep_update = {};
    window.rw_toolkit.disable_cache = {};
    window.rw_toolkit.newcdn = {};
    window.rw_toolkit.useful_urls = getURL(urls);
    window.rw_toolkit.rocketlazyloadscript = check_wprocket();

    var queryString = window.location.search;

    if (queryString) {
        var params = new URLSearchParams(queryString);

        // Remplir window.rw_toolkit.partners.enable et window.rw_toolkit.partners.disable
        var activePartners = params.get('active_partners');
        var desactivePartners = params.get('desactive_partners');

        if (activePartners) {
            window.rw_toolkit.partners.enable = activePartners.split(',').filter(Boolean); // Supprime les chaînes vides
        }
        if (desactivePartners) {
            window.rw_toolkit.partners.disable = desactivePartners.split(',').filter(Boolean); // Supprime les chaînes vides

            for (const partner of desactivePartners.split(',')) {
                config.partners[partner]=false;
            }
        }

        var disableCache = params.get('disable_cache');
        var newcdn = params.get('newcdn');
        // Remplir window.rw_toolkit.disable_cache et newcdn
        if (disableCache) {
            window.rw_toolkit.ts = disableCache;
        }
        if (newcdn) {
            window.rw_toolkit.ts = newcdn;
        }

        // Remplir window.rw_toolkit.omep_update avec les autres paramètres

        params.forEach((value, key) => {
            console.log("kv : " + key + " = " + value + " => " + (!ignore_query_param.includes(key) && (value === "0" || value === "1")));
            if (!ignore_query_param.includes(key) && (value === "0" || value === "1")) {
                // Exclure les clés spécifiques et les ajouter à window.rw_toolkit.omep_update si elles ne sont pas à exclure
                if (!['active_partners', 'desactive_partners', 'disable_cache', 'newcdn'].includes(key)) {
                    window.rw_toolkit.omep_update[key] = value;
                }
            }
        });
    }

    viously_extract();
    taboola_extract();
    seedtag_extract();
}

// brand safety check, nécessite Actirise : hbdbrk-hbskw=1

// MAIN
// Initialisation
function main() {
    if (typeof site_config_js !== 'undefined' && site_config_js && !window.location.href.includes("wp-admin")) {
        const config = site_config_js;
        init(config);

        // NEW SETUP

        // Crée la div de refresh
        const refresh = document.createElement("div");
        refresh.id = "refresh";
        refresh.style.position = "fixed";
        refresh.style.top = "0";
        refresh.style.right = "105px";
        refresh.style.padding = "5px";
        refresh.style.zIndex = '999999999999';

        // Crée le bouton refresh
        const refresh_button = document.createElement("button");
        refresh_button.id = "refresh-button";
        refresh_button.style.width = '30px';
        refresh_button.style.height = '30px';
        refresh_button.style.padding = "0";
        refresh_button.style.textAlign = "center";
        refresh_button.style.backgroundColor = 'white';
        refresh_button.style.cursor = "pointer";
        refresh_button.style.borderRadius = "5px";

        const refresh_link = document.createElement('a');
        refresh_link.href = window.location.href.split('?')[0];
        refresh_link.innerHTML = '🔃';

        // Création d'un espace d'ajout de params de cache
        const add_cache = document.createElement("div");
        add_cache.id = "add_cache";
        add_cache.style.position = "fixed";
        add_cache.style.top = "0";
        add_cache.style.right = "70px";
        add_cache.style.padding = "5px";
        add_cache.style.zIndex = '999999999999';

        // Crée le bouton d'ajout des params de cache
        const add_cache_button = document.createElement('button');
        add_cache_button.style.width = '30px';
        add_cache_button.style.height = '30px';
        add_cache_button.id = "add_cache_button";
        add_cache_button.textContent = "✅";
        add_cache_button.style.backgroundColor = 'white';
        add_cache_button.style.cursor = "pointer";
        add_cache_button.style.borderRadius = "5px 0";
        add_cache_button.style.padding = "unset";
        add_cache_button.onclick = function() {setDisabledCache(this);};


        // Création d'un espace de suppression de params de cache
        const supp_cache = document.createElement("div");
        supp_cache.id = "supp_cache";
        supp_cache.style.position = "fixed";
        supp_cache.style.top = "0";
        supp_cache.style.right = "40px";
        supp_cache.style.padding = "5px 0";
        supp_cache.style.zIndex = '999999999999';

        // Crée le bouton de suppression des params de cache
        const supp_cache_button = document.createElement('button');
        supp_cache_button.id = "supp_cache_button";
        supp_cache_button.style.width = '30px';
        supp_cache_button.style.height = '30px';
        supp_cache_button.textContent = "❌";
        supp_cache_button.style.backgroundColor = 'white';
        supp_cache_button.style.cursor = "pointer";
        supp_cache_button.style.borderRadius = "5px 0";
        supp_cache_button.style.padding = "unset";
        supp_cache_button.onclick = function() {unsetDisabledCache(this);};

        // Crée la div de setting
        const settings = document.createElement("div");
        settings.id = "settings";
        settings.style.position = "fixed";
        settings.style.top = "0";
        settings.style.right = "0";
        settings.style.padding = "5px";
        settings.style.zIndex = '999999999999';

        // Crée le bouton settings
        const settings_button = document.createElement("button");
        settings_button.id = "settings-button";
        settings_button.style.width = '30px';
        settings_button.style.height = '30px';
        settings_button.style.padding = "0";
        settings_button.style.textAlign = "center";
        settings_button.style.backgroundColor = 'white';
        settings_button.innerHTML = '⚙️';
        settings_button.style.cursor = "pointer";
        settings_button.style.borderRadius = "5px";

        // Crée le menu avec options
        const options = document.createElement("ul");
        options.id = "options";
        options.style.position = "absolute";
        options.style.right = "0";
        options.style.marginTop = "10px";
        options.style.background = "white";
        options.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
        options.style.borderRadius = "5px";
        options.style.display = "none";
        options.style.paddingLeft = "0";
        options.style.marginLeft = "0";

        // Crée la div de contenu
        const contentBox = document.createElement("div");
        contentBox.id = "content-box";
        contentBox.style.position = "fixed";
        contentBox.style.top = "45px";
        contentBox.style.right = "90px";
        contentBox.style.width = "auto";
        contentBox.style.maxWidth = "70%";
        contentBox.style.padding = "10px";
        contentBox.style.overflowY = "scroll";
        contentBox.style.maxHeight = "80vh";
        contentBox.style.background = "white";
        contentBox.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
        contentBox.style.border = "1px solid black";
        contentBox.style.borderRadius = "5px";
        contentBox.style.display = "none";
        contentBox.style.zIndex = '999999999999';
        contentBox.style.wordWrap = "break-word";

        document.body.appendChild(contentBox);

        // Ajoute une option de purge de cache
        const purged_link = purgeURL();
        const purge_button = document.createElement('li');
        purge_button.id = "purge_cache";
        purge_button.textContent = "Purge Cache";
        purge_button.style.padding = "10px";
        purge_button.style.listStyle = "none";
        purge_button.style.cursor = "pointer";
        purge_button.onclick = function() {redirect(purged_link);};
        options.appendChild(purge_button);

        // Ajoute une option de purge de cache
        const gam_debug_button = document.createElement('li');
        gam_debug_button.id = "purge_cache";
        gam_debug_button.textContent = "GAM debug";
        gam_debug_button.style.padding = "10px";
        gam_debug_button.style.listStyle = "none";
        gam_debug_button.style.cursor = "pointer";
        gam_debug_button.onclick = function() {toggle_gam_debug();};
        options.appendChild(gam_debug_button);

        const sep = document.createElement("div");
        sep.className = "settings";
        sep.textContent = "~~~~~~";
        sep.style.textAlign = "center";
        options.appendChild(sep);

        // Contenus spécifiques des options avec des div associées
        const contents = {
            "Partners": "partners",
            "Omeps": "omeps",
            "Rules": "rules",
            "Tools": "tools",
            "AdStack": "adstack",
            "WP-Rocket": "rw_wprocket",
            "Viously": "viously_rw",
            "Taboola": "taboola_rw",
            "Seedtag": "seedtag_rw",
            "CMP": "cmp_rw",
            "Info Page": "info_page",
            "Tracker": "tracker",
        };

        // Ajoute les options de base du menu
        const initial_list = ["Partners", "Omeps", "Rules", "Tools", "AdStack", "CMP", "WP-Rocket", "Info Page", "Tracker"]
        add_entry_to_menu(initial_list, options, contentBox, contents)

        options.appendChild(sep.cloneNode(true));

        // Ajoute les options conditionnelles du menu
        const additional_list = []
        if(window.rw_toolkit.viously && Object.keys(window.rw_toolkit.viously).length > 0) {
            additional_list.push("Viously");
        }
        if(window.rw_toolkit.taboola && Object.keys(window.rw_toolkit.taboola).length > 0) {
            additional_list.push("Taboola");
        }
        if(window.rw_toolkit.seedtag && Object.keys(window.rw_toolkit.seedtag).length > 0) {
            additional_list.push("Seedtag");
        }

        if(additional_list != []) {
            add_entry_to_menu(additional_list, options, contentBox, contents)
        }


        settings_button.addEventListener("click", function () {
            options.style.display = options.style.display === "none" ? "block" : "none";
            if (options.style.display === "none") {
                // Cacher la contentBox et tout son contenu
                contentBox.style.display = "none";
                Array.from(contentBox.children).forEach(div => {
                    div.style.display = "none";
                });
            }
        });

        refresh_button.appendChild(refresh_link);
        refresh.appendChild(refresh_button);
        document.body.appendChild(refresh);

        add_cache.appendChild(add_cache_button);
        document.body.appendChild(add_cache);

        supp_cache.appendChild(supp_cache_button);
        document.body.appendChild(supp_cache);

        settings.appendChild(settings_button);
        settings.appendChild(options);
        document.body.appendChild(settings);

        // Création des éléments de WP-Rocket
        const rw_wprocket = document.createElement('div');
        rw_wprocket.id = "rw_wprocket";
        contentBox.appendChild(rw_wprocket);

        refresh_wprocket(rw_wprocket);

        // Création de l'option adstack
        const adstack = document.createElement('div');
        adstack.id = "adstack";
        contentBox.appendChild(adstack);

        refresh_adstack(adstack);

        // Création de l'option viously
        const viously_rw = document.createElement('div');
        viously_rw.id = "viously_rw";
        contentBox.appendChild(viously_rw);

        refresh_viously(viously_rw);

        // Création de l'option taboola
        const taboola_rw = document.createElement('div');
        taboola_rw.id = "taboola_rw";
        contentBox.appendChild(taboola_rw);

        refresh_taboola(taboola_rw);

        // Création de l'option taboola
        const seedtag_rw = document.createElement('div');
        seedtag_rw.id = "seedtag_rw";
        contentBox.appendChild(seedtag_rw);

        refresh_seedtag(seedtag_rw);

        // Création des éléments de CMP
        const cmp_rw = document.createElement('div');
        cmp_rw.id = "cmp_rw";
        contentBox.appendChild(cmp_rw);

        refresh_cmp(cmp_rw);

        // creation des éléments d'Info Page
        const info_page = document.createElement('div');
        info_page.id = "info_page";
        contentBox.appendChild(info_page);

        refresh_info_page(info_page);

        // creation des éléments d'Info Page
        // const tracker = document.createElement('div');
        // tracker.id = "tracker";
        // contentBox.appendChild(tracker);
        //
        // check_tickets(window.rw_toolkit.useful_urls.name)

        // Création des éléments de Tools
        const links = document.createElement('div');
        links.id = "tools";
        contentBox.appendChild(links);

        const links_title = document.createElement('h1');
        links_title.id = "tools_title";
        links_title.textContent = "Tools";
        links.appendChild(links_title);

        if(window.rw_toolkit.useful_urls) {
            const prod = document.createElement('div');
            prod.style.dysplay = "block";
            links.appendChild(prod);

            const prod_title = document.createElement('h2');
            prod_title.textContent = 'Prod Links';
            prod.appendChild(prod_title);

            const prod_site = document.createElement('a');
            prod_site.id = "prod_site";
            prod_site.textContent = "Prod";
            prod_site.href = window.rw_toolkit.useful_urls.prod;
            prod_site.target = "_blank";
            prod.appendChild(prod_site);

            const prod_BO = document.createElement('a');
            prod_BO.id = "prod_bo";
            prod_BO.textContent = "Prod BO";
            prod_BO.href = window.rw_toolkit.useful_urls.prodBO;
            prod_BO.target = "_blank";
            prod.appendChild(prod_BO);

            const preprod = document.createElement('div');
            prod.style.dysplay = "block";
            links.appendChild(preprod);

            const preprod_title = document.createElement('h2');
            preprod_title.textContent = 'Preprod Links';
            preprod.appendChild(preprod_title);

            const preprod_site = document.createElement('a');
            preprod_site.id = "preprod_site";
            preprod_site.textContent = "Preprod";
            preprod_site.href = window.rw_toolkit.useful_urls.preprod;
            preprod_site.target = "_blank";
            preprod.appendChild(preprod_site);

            const preprod_BO = document.createElement('a');
            preprod_BO.id = "preprod_bo";
            preprod_BO.textContent = "Preprod BO";
            preprod_BO.href = window.rw_toolkit.useful_urls.preprodBO;
            preprod_BO.target = "_blank";
            preprod.appendChild(preprod_BO);
        } else {
            const p = document.createElement('p');
            p.textContent = "Pas d'outils disponibles.";
            links.appendChild(p);
        }

        // Création des éléments de Partners
        const ordered_partners = orderObj(config.partners);
        insert(ordered_partners, 'Liste des partenaires', 'partners', contentBox);

        // Création des éléments de Omeps
        const omeps = config.devs;
        insert(omeps, 'Liste des Omeps', 'omeps', contentBox);

        // Création des éléments de Templates
        const template = config.available_templates;
        //insert(template, 'Liste des Templates', 'templates', 'contentBox');

        // Création des éléments de Rules
        insertRulesList(linksTable, contentBox)

        urlUpdate();
        waitForGoogletagPubads();
    }
}

redirectIfPurge(2000);
let i = 0;
const interval = setInterval(function() {
    if (typeof site_config_js !== 'undefined') {
        clearInterval(interval);
        main()
    } else if (i < 10) {
        console.log("En attente de site_config_js");
        i++;
    }
}, 1000);