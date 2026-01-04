// ==UserScript==
// @name			Hentai Heroes Export Harem Data
// @namespace		https://sleazyfork.org/fr/scripts/497462-hentai-heroes-export-harem-data
// @description		Export Harem Data from the Hentai Heroes game.
// @version			0.3
// @match           https://*.hentaiheroes.com/*
// @match           https://*.haremheroes.com/*
// @match           https://*.gayharem.com/*
// @match           https://*.comixharem.com/*
// @match           https://*.hornyheroes.com/*
// @match           https://*.pornstarharem.com/*
// @match           https://*.transpornstarharem.com/*
// @match           https://*.gaypornstarharem.com/*
// @match           https://*.mangarpg.com/*
// @run-at          document-idle
// @grant			none
// @author			Tom208
// @license			MIT
// @downloadURL https://update.greasyfork.org/scripts/497462/Hentai%20Heroes%20Export%20Harem%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/497462/Hentai%20Heroes%20Export%20Harem%20Data.meta.js
// ==/UserScript==

// Define jQuery
var $ = window.jQuery;
if ($ == undefined) {
    console.log("Hentai Heroes++ (OCD) Season version WARNING: No jQuery found. Probably an error page. Ending the script here")
    return;
}

// Define CSS
var sheet = (function() {
    let style = document.createElement('style');
    document.head.appendChild(style);
    return style.sheet;
})();

var currentPage = window.location.pathname;
const pageLang = $('html')[0].lang.substring(0,2);
const mediaMobile = '@media only screen and (max-width: 1025px)';
const mediaDesktop = '@media only screen and (min-width: 1026px)';

// Thousand spacing
function nThousand(x) {
    if(typeof x != 'number') {
        return 0;
    }
    switch(pageLang){ //atm this shows the numbers equal to the game
        case 'ja':
        case 'en': return x.toLocaleString("en")
        default: return x.toLocaleString("fr")
    }
}

const RARITIES = {
    starting: 'Fille de départ',
    common: 'Commune',
    rare: 'Rare',
    epic: 'Epique',
    legendary: 'Légendaire',
    mythic: 'Mythique'
};

const ELEMENTS = {
    darkness: 'Dominatrice',
    light: 'Soumise',
    psychic: 'Voyeuse',
    fire: 'Excentrique',
    nature: 'Exhibitionniste',
    stone: 'Physique',
    sun: 'Joueuse',
    water: 'Sensuelle'
}

const CLASSES = {
    1: 'Hardcore',
    2: 'Charme',
    3: 'Savoir-Faire'
}

const POSITIONS = {
    1: 'Levrette',
    2: 'Néophyte',
    3: 'Missionnaire',
    4: 'Sodomie',
    5: '69',
    6: 'Chaise longue',
    7: 'Tendre amant',
    8: 'Mystérieuse entrevue',
    9: 'Brouette thaïlandaise',
    10: 'Union suspendue',
    11: 'Pilon',
    12: 'Petit pont'
}

if (currentPage.includes('/edit-team')) {
    let export_btn = $('<button id="export_harem_btn" class="square_blue_btn" type="button" style="position: absolute; right: 225px; height: 26px; width: 84px; color: #fff;">Export</button>');
    export_btn.click( () => {exportHaremData();});
    setTimeout(() => {$('.change-team-panel .panel-body').before(export_btn)}, 250);

    sheet.insertRule(`${mediaDesktop} {`
                     + '#export_harem_btn {'
                     + 'top: 82px;}}'
                    );

    sheet.insertRule(`${mediaMobile} {`
                     + '#export_harem_btn {'
                     + 'top: 105px;}}'
                    );

    sheet.insertRule('.change-team-panel .panel-title {'
                     + 'position: relative;'
                     + 'top: -10px;}'
                    );
}
else if (currentPage.includes('/waifu')) {
    let export_btn = $('<button class="square_blue_btn" type="button" style="position: relative; top: -42px; left: -96px; width: 84px; color: #fff;">Export</button>');
    export_btn.click( () => {exportHaremData();});
    setTimeout(() => {$('#filter_girls').after(export_btn)}, 250);
}

function exportHaremData() {
    const haremData = currentPage.includes('/waifu') ? window.girls_data_list : window.availableGirls;

    let header = [
        'ID',
        'Nom',
        'Rareté',
        'Elément',
        'Classe',
        'Position',
        'XP',
        'Niv.',
        'Cat. affect.',
        'Niv. affect.',
        'Revenu max',
        'Revenu horaire',
        'Durée',
        'Date recrutement',
    ];

    let content = [header];

    haremData.forEach((girl) => {
        const id = girl.id_girl;
        const name = girl.name;
        const rarity = RARITIES[girl.rarity];
        const element = ELEMENTS[girl.element];
        const girl_class = CLASSES[girl.class];
        const position = POSITIONS[girl.figure];
        const xp = nThousand(girl.xp);
        const lvl = girl.level;
        const aff_cat = girl.nb_grades + '*';
        const aff_lvl = girl.graded + '*';
        const salary = nThousand(girl.salary);
        const salary_per_hour = nThousand(parseInt(girl.salary_per_hour, 10));
        //const recruit_date = girl.date_added.split(' ')[0];
        const recruit_date = girl.date_added;

        let salary_timer = 0;
        if (girl.salary_timer < 60) {
            salary_timer = (girl.salary_timer.toString().length == 2) ? `0:${girl.salary_timer}` : `0:0${girl.salary_timer}`;
        }
        else {
            let hours = parseInt(girl.salary_timer/60);
            let minutes = (girl.salary_timer/60 - hours)*60;
            salary_timer = (minutes.toString().length == 2) ? `${hours}:${minutes}` : `${hours}:0${minutes}`;
        }
        
        content.push([
            id,
            name,
            rarity,
            element,
            girl_class,
            position,
            xp,
            lvl,
            aff_cat,
            aff_lvl,
            salary,
            salary_per_hour,
            salary_timer,
            recruit_date
        ]);
    });

    // https://stackoverflow.com/questions/13405129/javascriptcreateandsavefile
    // Function to download data to a file
    function download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others than IE10+
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    content = Array.from(content, e => e.join('\t') );
    download(content.join('\n'), 'harem.csv', 'text/csv' );
}