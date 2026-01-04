// ==UserScript==
// @name            WME MapsFr
// @name:fr         WME MapsFr
// @icon            data:image/png;base64,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
// @description     This script create buttons to permalink page on several Maps.
// @description:fr  Ce script crée des boutons pour vous permettre d'accéder à des cartes externes.
// @version         2025.11.11.001
// @match           https://www.waze.com/*/editor*
// @match           https://www.waze.com/editor*
// @match           https://beta.waze.com/*
// @match           https://www.google.com/?MFR*
// @match           https://adresse.data.gouv.fr/?MFR*
// @connect         https://www.google.com/*
// @grant           none
// @author          TXS
// @namespace       https://greasyfork.org/fr/scripts/438942-wme-mapsfr
// @downloadURL https://update.greasyfork.org/scripts/438942/WME%20MapsFr.user.js
// @updateURL https://update.greasyfork.org/scripts/438942/WME%20MapsFr.meta.js
// ==/UserScript==

/* global $ */

const MapsFr_version = GM_info.script.version, sidepanelName = 'sidepanel-MapsFr', MapsFr_link = GM_info.script.namespace, MapsFr_Icon = GM_info.script.icon;
let gps,mapsUrl,gz,coord,href,addon,userTabs,navTabs,tabContent,newtab,token,setLayer,btnsite;

setTimeout(()=> {
    if (/ban/.test(window.location.href)) { detect_BAN(); }
    else { console.log("Chargement de WME MapsFR"); }
}, 1000);


function MapsFr_bootstrap() {
    if ('undefined' == typeof __RTLM_PAGE_SCOPE_RUN__) {
        (function page_scope_runner() {
            const my_src = "(" + page_scope_runner.caller.toString() + ")();";
            const script = document.createElement('script');
            script.setAttribute("type", "text/javascript");
            script.textContent = "var __RTLM_PAGE_SCOPE_RUN__ = true;\n" + my_src;
            document.body.appendChild(script);
            setTimeout(function() {
                add_buttons();
            }, 4000);
            return; })(); }
}


// Fonction pour créer et afficher la fenêtre de dialogue
function showDialog(message) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'overlayMaps';
        const dialog = document.createElement('div');
        dialog.className = 'dialogMaps';
        const messageText = document.createElement('p');
        messageText.textContent = message;
        dialog.appendChild(messageText);
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.onclick = function() {
            document.body.removeChild(overlay);
            resolve('ok');
        };
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Annuler';
        cancelButton.onclick = function() {
            document.body.removeChild(overlay);
            self.close();
            resolve('cancel');
        };
        dialog.appendChild(okButton);
        dialog.appendChild(cancelButton);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    });
}

const detect_BAN = async () => {
    // Définition des constantes pour l'URL de base et le décalage de zoom pour la variable bbox
    const BASE_URL = "https://data.geopf.fr/geocodage/reverse";
    const ZOOM_OFFSET = 0.0026211;

    // Extraction des paramètres de l'URL après "?MFRban"
    let t = window.location.href.split("?MFRban")[1];
    if (!t) {
        console.error("Coordonnées non disponibles");
        await showDialog("Les coordonnées ne sont pas disponibles.");
        return;
    }

    // Analyse des coordonnées JSON
    let c;
    try {
        c = JSON.parse(t);
    } catch (e) {
        console.error("Erreur d'analyse JSON:", e);
        await showDialog("Erreur lors de l'analyse des coordonnées.");
        return;
    }

    // Construction de l'URL pour les requêtes API
    const url = `${BASE_URL}?lon=${c[0]}&lat=${c[1]}`;
    const options = {
        housenumber: `${url}&index=address&limit=1&returntruegeometry=false&type=housenumber`,
        parcel: `${url}&index=parcel&limit=1&returntruegeometry=false`
    };

    // Fonction pour récupérer les données JSON d'une URL
    const fetchData = async (url) => {
        const response = await fetch(url);
        return response.json();
    };

    try {
        // Récupération parallèle des données d'adresse et de parcelle
        const [addressData, parcelData] = await Promise.all([
            fetchData(options.housenumber),
            fetchData(options.parcel),
        ]);

        // Extraction des données de la parcelle
        const parcel = parcelData.features[0]?.properties.id.slice(0, 5);
        const departmentcode = parcelData.features[0]?.properties.departmentcode;
        const municipalitycode = parcelData.features[0]?.properties.municipalitycode;
        const cityparcel = parcelData.features[0]?.properties.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Extraction et normalisation des données d'adresse
        const { id: address, name, postcode, citycode, city } = addressData.features[0]?.properties || {};
        const finalAddress = address || parcel;
        const finalCitycode = citycode || parcel;
        const finalCity = city ? city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
        const finalName = name || cityparcel;
        const finalPostcode = postcode || departmentcode;

        // Calcul de la bounding box pour la carte
        const bbox = `${c[0]}~${c[1]}~${c[0] + ZOOM_OFFSET}~${c[1] + ZOOM_OFFSET}`;

        // Gestion des cas où aucune adresse n'est trouvée
        if (!addressData.features[0] && (c[3] === 3 || c[3] === 9)) {
            const result = await showDialog("Aucune adresse n'a été détectée.\n\Voulez-vous que la carte soit dézoomée\n\et déplacée au plus proche d'une ville ?");
            if (result === 'cancel') {
                console.log('Opération annulée');
                return; // Arrêter l'exécution si l'utilisateur annule
            }
            // Si l'utilisateur clique sur OK, le script continue
        }

        // Mapping des valeurs de c[3] correspondant aux boutons et leurs les URLs correspondantes
        const urlMap = {
            3: () => `https://adresse.data.gouv.fr/carte-base-adresse-nationale?id=${finalAddress}`,
            6: () => `https://www.viamichelin.fr/?bounds=${bbox}&itinerary=&poiCategories=7&withCaravan=true`,
            9: () => `https://fr.mappy.com/plan#/${finalName} ${finalPostcode}`,
            17: () => `https://www.monterritoire.fr/${finalCitycode}?lat=${c[1]}&lng=${c[0]}&zoom=${c[2]}`,
            18: () => `https://www.monterritoire.fr/${finalAddress}?lat=${c[1]}&lng=${c[0]}&zoom=${c[2]}`,
            22: () => `https://lannuaire.service-public.fr/recherche?whoWhat=&where=${departmentcode}+${cityparcel}`,
            30: () => `https://localiser.laposte.fr/?q=${finalCity}`,
            31: () => `https://wiiiz.fr/portal/#/search?address=${cityparcel}&lat=${c[1]}&lng=${c[0]}&type=neighborhood`,
            32: () => `https://chargemap.com/fr-fr/cities/${finalCity}-FR`
        };

        // Sélection de l'URL appropriée en fonction de c[3] les boutons
        const mapsUrl = urlMap[c[3]] ? urlMap[c[3]]() : null;
        if (!mapsUrl) {
            console.error("Valeur inconnue de c[3]:", c[3]);
            await showDialog("Erreur : URL non trouvée pour cette action.");
        } else {
            // Ouverture de l'URL dans la fenêtre courante
            window.open(mapsUrl, '_self');
        }

    } catch (error) {
        // Gestion des erreurs lors de la récupération des données
        console.error("Erreur lors de la récupération des données:", error);
        await showDialog("Erreur lors de la récupération des données. Veuillez réessayer.");
    }
};



// Extrait une valeur spécifique d'une chaîne de requête URL
function getQueryString(link, name) {
    let pos = link.indexOf( name ) + name.length;
    let len = link.substr(pos).indexOf('&');
    if (-1 == len) len = link.substr(pos).length;
    return parseFloat(link.substr(pos,len)); }

// Récupère les coordonnées GPS et le niveau de zoom à partir de l'URL de la page
function getGps(z) {
    let href = document.getElementsByClassName('permalink')[0].href;
    let lon = getQueryString(href, 'lon=');
    let lat = getQueryString(href, 'lat=');
    let zoom = parseInt(getQueryString(href, 'zoomLevel=')) + z;
    return {lon, lat, zoom}; }

// Adapte un niveau de zoom Google Earth.
function GoogleEarthZoom(gz) {
    const zoomMap = {
        14: 7000,
        15: 3500,
        16: 1250,
        17: 800,
        18: 350,
        19: 250,
        20: 200
    };
    return zoomMap[gz] || 1250;
}

//

function add_buttons() {

    let btn1 = $('<button class="btnMaps" title="Google Map" style="background-color:#459BF7">Google</button>');
    btn1.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.com/maps/@${lat},${lon},${zoom}z`;
        window.open(mapsUrl,'_blank');
    });
    let btn2 = $('<button class="btnMaps" title="Cartes Géoportail" style="background-color:#CBFA78" >Géoportail</button>');
    btn2.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        setLayer = 'l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1::GEOPORTAIL:OGC:WMTS(1)&l2=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&permalink=yes';
        mapsUrl = `https://www.geoportail.gouv.fr/carte?c=${lon},${lat}&z=${zoom}&${setLayer}`;
        window.open(mapsUrl,'_blank');
    });
    let btn3 = $('<button class="btnMaps" title="Base Adresse Nationale" style="background-color:#E6E4FF">AdresseGouv</button>');
    btn3.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        btnsite = 3;
        mapsUrl = `https://adresse.data.gouv.fr/?MFRban[${lon},${lat},${zoom},${btnsite}]`;
        window.open(mapsUrl,'_blank');
    });
    let btn4 = $('<button class="btnMaps" title="Satellites Pro">SatellitesPro</button>');
    btn4.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://satellites.pro/France_map#${lat},${lon},${zoom}`;
        window.open(mapsUrl,'_blank');
    });
    let btn5 = $('<button class="btnMaps" title="Open Street Map">OpenStreetM</button>');
    btn5.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `http://www.openstreetmap.org/#map=${zoom}/${lat}/${lon}`;
        window.open(mapsUrl,'_blank');
    });
    let btn6 = $('<button class="btnMaps" title="Via Michelin">Michelin</button>');
    btn6.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        btnsite = 6;
        mapsUrl = `https://www.google.com/?MFRban[${lon},${lat},${zoom},${btnsite}]`;
        window.open(mapsUrl,'_blank');
    });
    let btn7 = $('<button class="btnMaps" title="Carte Here WeGo Satellite">Here WeGo</button>');
    btn7.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://wego.here.com/?map=${lat},${lon},${zoom},satellite`;
        window.open(mapsUrl,'_blank');
    });
    let btn8 = $('<button class="btnMaps" title="Mapillary">Mapillary</button>');
    btn8.click(()=>{
        let {lon, lat, zoom} = getGps(-1);
        mapsUrl = `https://www.mapillary.com/app/?lat=${lat}&lng=${lon}&z=${zoom}`;
        window.open(mapsUrl,'_blank');
    });
    let btn9 = $('<button class="btnMaps" title="Mappy Commerces">Mappy</button>');
    btn9.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        btnsite = 9;
        mapsUrl = `https://www.google.com/?MFRban[${lon},${lat},${zoom},${btnsite}]`;
        window.open(mapsUrl,'_blank');
    });
    let btn10 = $('<button class="btnMaps" title="Tomtom MyDrive">Tomtom</button>');
    btn10.click(()=>{
        let {lon, lat, zoom} = getGps(-1);
        mapsUrl = `https://plan.tomtom.com/fr?p=${lat},${lon},${zoom}z`;
        window.open(mapsUrl,'_blank');
    });
    let btn11 = $('<button class="btnMaps" title="Bing Cartes Satellite">Bing</button>');
    btn11.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.bing.com/maps?osid=ef3f0715-2277-4a9d-8706-500556506052&cp=${lat}~${lon}&lvl=${zoom}&sty=h`;
        window.open(mapsUrl,'_blank');
    });

/*
    Site Mapbox
    Autre token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY200aW5xbzh3MDRpNjJpcHpoazY5MzFpdCJ9.lHbcBn_S_e7vw-go05RH6w
    Autre Style = standard - standard-satellite - streets-v12 - outdoors-v12 - light-v11
    dark-v11 - satellite-v9 - satellite-streets-v12 - navigation-day-v1 - navigation-night-v1
*/
    let btn12 = $('<button class="btnMaps" title="Mapbox Streets" style="background-color:#f0c3d9">MapboxStr</button>');
    btn12.click(()=>{
        let {lon, lat, zoom} = getGps(-1);
        token = 'pk.eyJ1IjoibGFicy1zYW5kYm94IiwiYSI6ImNrMTZuanRmZDA2eGQzYmxqZTlnd21qY3EifQ.Q7DM5HqE5QJzDEnCx8BGFw';
        mapsUrl = `https://api.mapbox.com/styles/v1/mapbox/standard.html?title=true&access_token=${token}#${zoom}/${lat}/${lon}`;
        window.open(mapsUrl,'_blank');
    });
    let btn13 = $('<button class="btnMaps" title="Mapbox Satellite" style="background-color:#f0c3d9">MapboxSat</button>');
    btn13.click(()=>{
        let {lon, lat, zoom} = getGps(-1);
        token = 'pk.eyJ1IjoibGFicy1zYW5kYm94IiwiYSI6ImNrMTZuanRmZDA2eGQzYmxqZTlnd21qY3EifQ.Q7DM5HqE5QJzDEnCx8BGFw';
        mapsUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12.html?title=true&access_token=${token}#${zoom}/${lat}/${lon}`;
        window.open(mapsUrl,'_blank');
    });
    let btn18 = $('<button class="btnMaps" title="Mapbox Satellite" style="background-color:#f0c3d9">MapboxNav</button>');
    btn18.click(()=>{
        let {lon, lat, zoom} = getGps(-1);
        token = 'pk.eyJ1IjoibGFicy1zYW5kYm94IiwiYSI6ImNrMTZuanRmZDA2eGQzYmxqZTlnd21qY3EifQ.Q7DM5HqE5QJzDEnCx8BGFw';
        mapsUrl = `https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1.html?title=true&access_token=${token}#${zoom}/${lat}/${lon}`;
        window.open(mapsUrl,'_blank');
    });
    let btn14 = $('<button class="btnMaps" title="Epsg Streets">EpsgStr</button>');
    btn14.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://epsg.io/map#srs=4326&x=${lon}&y=${lat}&z=${zoom}&layer=streets`;
        window.open(mapsUrl,'_blank');
    });
    let btn15 = $('<button class="btnMaps"; title="Map Compare" style="background-color:#e8dfc2">MapCompare</button>');
    btn15.click(()=>{
        let {lon, lat, zoom} = getGps(-1);
        setLayer = 'num=4&mt0=viamichelin-map&mt1=osmfr&mt2=google-satellite&mt3=mapy-base';
        mapsUrl = `https://mc.bbbike.org/mc/?lon=${lon}&lat=${lat}&zoom=${zoom}&${setLayer}`;
        window.open(mapsUrl,'_blank');
    });
    let btn16 = $('<button class="btnMaps" title="Google Earth" style="background-color:#74D0F1">GoogleEarth</button>');
    btn16.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        var gz = GoogleEarthZoom(zoom);
        mapsUrl = `https://earth.google.com/web/@${lat},${lon},35.26224333a,${gz}d,35y,0h,29t,0r`;
        window.open(mapsUrl,'_blank');
    });
    let btn17 = $('<button class="btnMaps" title="Cadastre"style="background-color:#E8B027">Cadastre</button>');
    btn17.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        btnsite = 17;
        mapsUrl = `https://www.google.com/?MFRban[${lon},${lat},${zoom},${btnsite}]`;
        window.open(mapsUrl,'_blank');
    });

//-------------------
    let btn22 = $('<button class="btnMaps" title="Annuaire Service Public" style="background-color:#6A81FF">Mairie</button>');
    btn22.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        btnsite = 22;
        mapsUrl = `https://www.google.com/?MFRban[${lon},${lat},${zoom},${btnsite}]`;
        window.open(mapsUrl,'_blank');
    });
    let btn23 = $('<button class="btnMaps" alt="Apple Street view" title="Apple Street view"><font size="2" style="color:rgb(255,130,130)"></font> Street view</button>');
    btn23.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://lookmap.eu.pythonanywhere.com/#c=${zoom}/${lat}/${lon}/`;
     // mapsUrl = `https://duckduckgo.com/?q=${lat},${lon}&t=h_&iaxm=maps`;
        window.open(mapsUrl,'_blank');
    });
    let btn24 = $('<button class="btnMaps" title="Prix des carburants" style="background-color:#F2FFCD">Prix 🚘⛽️</button>');
    btn24.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://data.opendatasoft.com/explore/dataset/prix-des-carburants-en-france-flux-instantane-v2%40opendatamef/map/?location=${zoom},${lat},${lon}&basemap=jawg.streets`;
        window.open(mapsUrl,'_blank');
    });

    let btn25 = $('<button class="btnMaps" title="Ensoleillement" style="background-color:#fdffb4">Soleil 🏡 ☀️ </button>');
    btn25.click(()=>{
        let {lon, lat, zoom} = getGps(-2);
        mapsUrl = `https://app.shadowmap.org/?lat=${lat}&lng=${lon}&zoom=${zoom}&azimuth=-0&basemap=map&elevation=nextzen&f=29.0&hud=true&polar=0.52158&vq=3`;
        window.open(mapsUrl,'_blank');
    });
        let btn26 = $('<button class="btnMaps" alt="Apple Map Satellite" title="Apple Map Satellite"><font size="2" style="color:rgb(130,130,255)"></font> Satellite</button>');
    btn26.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `http://maps.apple.com/?ll=${lat},${lon}&z=${zoom}&t=h`;
        window.open(mapsUrl,'_blank');
    });
//-------------------
    let btn30 = $('<input class="btnMapsIc" type="image" alt="La Poste" title="La Poste" src="https://upload.wikimedia.org/wikipedia/fr/9/92/La_Poste_logo.png">');
    btn30.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        btnsite = 30;
        mapsUrl = `https://www.google.com/?MFRban[${lon},${lat},${zoom},${btnsite}]`;
        window.open(mapsUrl,'_blank');
    });
    let btn31 = $('<input class="btnMapsIc" type="image" alt="Wiiiz"  title="Carte des bornes de recharge pour voitures électriques" src="https://wiiiz.fr/common/images/svg/logo-wiiiz.svg" >');
    btn31.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        btnsite = 31;
        mapsUrl = `https://www.google.com/?MFRban[${lon},${lat},${zoom},${btnsite}]`;
        window.open(mapsUrl,'_blank');
    });
    let btn32 = $('<input class="btnMapsIc" type="image" alt="Charge Map"  title="Carte des bornes de recharge pour voitures électriques" src="https://chargemap.com/client/chargemap/images/logo-light.svg">');
    btn32.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        btnsite = 32;
        mapsUrl = `https://www.google.com/?MFRban[${lon},${lat},${zoom},${btnsite}]`;
        window.open(mapsUrl,'_blank');
    });
    let btn33 = $('<input class="btnMapsIc" type="image" alt="Izivia"  title="Carte des bornes de recharge pour voitures électriques" src="https://izivia.com/wp-content/uploads/2021/10/logo.png" >');
    btn33.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://izivia.com/carte-bornes-electriques-izivia`;
        window.open(mapsUrl,'_blank');
    });

    addon = document.createElement("section");
    addon.id = sidepanelName; // sidepanel-MapsFr
    addon.className = "tab-pane";
    addon.innerHTML = '<a title='+ MapsFr_link +' target="_blank" href= '+ MapsFr_link + '> <b>Maps Fr</b><style type="text/css">a:link{text-decoration:none}</style> </a><i> - Version du ' + MapsFr_version + '</i><br>';
    userTabs = document.getElementById('user-info');
    navTabs = document.getElementsByClassName('nav-tabs', userTabs)[0];
    tabContent = document.getElementsByClassName('tab-content', userTabs)[0];
    newtab = document.createElement('li');
    newtab.innerHTML = '<a data-toggle="tab" title="Maps France" href="#sidepanel-MapsFr">\&#127467;&#127479;</a>';
    navTabs.appendChild(newtab);
    tabContent.appendChild(addon);

const btnspanel = "#"+ sidepanelName; //#sidepanel-MapsFr
    $(btnspanel).append('<hr>');
    $(btnspanel).append(btn1, btn2, btn3, "<br>");
    $(btnspanel).append(btn4, btn5, btn6, "<br>");
    $(btnspanel).append(btn7, btn8, btn9, "<br>");
    $(btnspanel).append(btn10, btn11, btn14, "<br>");
    $(btnspanel).append(btn13, btn12, btn18, "<br>");
    $(btnspanel).append(btn16, btn17, btn22, "<br>");
    $(btnspanel).append(btn23, btn26, btn15, "<br>");
    $(btnspanel).append(btn24, btn25, "<br>");
    $(btnspanel).append('<hr>');
    $(btnspanel).append(btn30);
    $(btnspanel).append('<hr>');
    $(btnspanel).append(btn31, btn32, btn33);

}

MapsFr_bootstrap();

// CSS INJECTION
(()=> {
    let mapsCss =
        `
         #Apple {
              background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" opacity=".569" style="margin-bottom: -2px"> <g> <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"></path> <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"></path></g></svg>');
              background-repeat: no-repeat;
  	          background-position: left 15px bottom 4px;
           }

          .btnMaps {
              width: 95px;
              height: 24px;
              padding: 1px;
              font-size: 70%;
              border-radius: 6px;
              border: 1px solid #C4C4C4;
              background-color: #E7E7E7;
              font-family: "Arial Bold", Helvetica, sans-serif;
              font-weight: bold;
              -webkit-transform: scale(1);
              transform: scale(1);
              -webkit-transition: .3s ease-in-out;
              transition: .3s ease-in-out;
              position: relative;
              z-index: 1;
          }

          .btnMaps:hover {
              -webkit-transform: scale(1.1);
              transform: scale(1.15);
              z-index: 2;
          }

          .btnShape {
              width: 95px;
              height: 24px;
              padding: 1px;
              font-size: 70%;
              border-radius: 6px;
              border: 1px solid #C4C4C4;
              background-color: #E5413C;
              background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 30 20" xml:space="preserve" height="10" width="20" ><g style="fill:midnightblue" > <path d="M0 0 L0 20 L10 20 L10 0 Z" /></g> <g fill="white"><path d="M10 0 L10 20 L20 20 L20 0 Z" /></g> <g fill="red" ><path d="M20 0 L20 20 L30 20 L30 0 Z" /></g></svg>');
              background-repeat: no-repeat;
              background-position: left 10px bottom 5px;
              font-family: "Arial Bold", Helvetica, sans-serif;
              font-weight: bold;
              -webkit-transform: scale(1);
              transform: scale(1);
              -webkit-transition: .3s ease-in-out;
              transition: .3s ease-in-out;
              position: relative;
              z-index: 1;
          }

          .btnShape:hover {
              -webkit-transform: scale(1.1);
              transform: scale(1.15);
              z-index: 2;
          }

          .btnMapsIc {
              width: 80px;
              height: 35px;
              padding: 5px;
              border-radius: 6px;
              border: 1px solid #C4C4C4;
              background-color: #E7E7E7;
              -webkit-transform: scale(1);
              transform: scale(1);
              -webkit-transition: .3s ease-in-out;
              transition: .3s ease-in-out;
              position: relative;
              z-index: 1;
          }

          .btnMapsIc:hover {
              -webkit-transform: scale(1.1);
              transform: scale(1.15);
              z-index: 2;
          }


          .overlayMaps {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.6);
              z-index: 1000;
           }
           .dialogMaps {
              position: absolute;
              top: 20%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: #729be5;
              font-family: Arial, sans-serif;
              font-weight: bold;
              color: rgb(0, 0, 0);
              padding: 15px;
              border-radius: 8px;
              border-color: red;
              border-style: solid;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
              width: auto;
              text-align: center;
              white-space: pre-line;
              align-items: center;
              justify-content: center;

           }
           .dialogMaps p {
              margin-bottom: 15px;
           }
           .dialogMaps button {
              margin: 5px;
              padding: 10px 15px;
              border: none;
              border-radius: 5px;
              color: rgb(37, 37, 37);
              background-color: #ffffff;
              cursor: pointer;

           }
           .dialogMaps button:hover {
              background-color: #f0f0f0;
           }

                  `;

    let style = document.createElement('style');
    style.type = 'text/css';
    (style.styleSheet) ? style.styleSheet.cssText = mapsCss : style.innerHTML = mapsCss; // IE or Other browsers

    document.getElementsByTagName("head")[0].appendChild( style );
})();
