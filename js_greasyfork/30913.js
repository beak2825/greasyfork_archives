// ==UserScript==
// @name        Torn War Helper
// @namespace   Jebster.Torn.WarHelper
// @author      Jeggy
// @description -------
// @include     *.torn.com/factions.php?step=your
// @version     0.0.1
// @downloadURL https://update.greasyfork.org/scripts/30913/Torn%20War%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/30913/Torn%20War%20Helper.meta.js
// ==/UserScript==
// debugger;

const $DATA = {};
let $FILTER = {
    level: {
        min: 20,
        max: 55,
    },
    statuses: ['Okay'],
};
const $FACTIONS = [];
let $MAIN = null;

(function() {
    'use strict';

    waitUntilLoaded();
})();


function waitUntilLoaded(found) {
    if(found){isLoaded(); return;}
    setTimeout(() => waitUntilLoaded($('.faction-respect-wars-wp').length > 0), 2);
}

function isLoaded() {
    $MAIN = $('.faction-respect-wars-wp');
    $MAIN.find('.f-war-list > li.not-member').each((index, item) => {
        $FACTIONS.push(generateFactionObject(item));
        $(item).hide();
    });
    generateView();
}

function clearView() {
    $MAIN.find('li.inactive').each((index, item) => item.remove());
    $MAIN.find('.f-war-list > .descriptions').hide();
    $MAIN.find('.j-view').remove();
}

function generateView() {
    clearView();
    $MAIN.append('<div class="j-view"><ul class="f-war-list war-old j-list"></ul></div>');

    prependHeader();

    // Add factions to view
    $FACTIONS.forEach(faction => {
        $MAIN.find('.j-list').append('<div class="viewport"><div class="overview"><ul class="j-f-'+faction.id+' member-list bottom-round t-blue-cont h"></ul></div></div>');
        $MAIN.find('.j-f-'+faction.id).append(faction.header);

        // Add filtered members to view
        filter(faction.members).forEach(member => {
            $MAIN.find('.j-f-'+faction.id).append(member.element);
        });
    });
}

function prependHeader() {
    $MAIN.find('.j-view').prepend(`
<div>
Min level: <input id="j-filter-min" type="number" min=0 max=100 value=${$FILTER.level.min} />
Max level: <input id="j-filter-max" type="number" min=0 max=100 value=${$FILTER.level.max} />
<br />
Status:&nbsp;
Okay <input id="j-filter-ok" type="checkbox" ${$FILTER.statuses.indexOf('Okay') > -1 ? 'checked' : ''} />
Hospital <input id="j-filter-hosp" type="checkbox" ${$FILTER.statuses.indexOf('Hospital') > -1 ? 'checked' : ''} />
Traveling <input id="j-filter-travel" type="checkbox" ${$FILTER.statuses.indexOf('Traveling') > -1 ? 'checked' : ''} />
<br />
<button id="j-save-filter">Save filter</button>
</div>
`);

    $(document).find('#j-save-filter').unbind().on('click', () => {
        const ignores = [];
        if ($('#j-filter-ok').is(':checked')) ignores.push('Okay');
        if ($('#j-filter-hosp').is(':checked')) ignores.push('Hospital');
        if ($('#j-filter-travel').is(':checked')) ignores.push('Traveling');
        $FILTER = {
            level: {
                min: $('#j-filter-min').val(),
                max: $('#j-filter-max').val(),
            },
            statuses: ignores,
        };
        generateView();
    });
    prependLoadButton();
}

function prependLoadButton() {
    let loaded = 0;
    $FACTIONS.forEach(f => loaded += f.loaded ? 1 : 0);
    if (loaded === $FACTIONS.length) return;

    const loadButton = '<button id="j-load-btn">'+loaded+' out of '+$FACTIONS.length+' are loaded</button>';
    $MAIN.find('.j-view').prepend(loadButton);

    $(document).find('#j-load-btn').unbind().on('click', () => {
        $MAIN.find('.j-view > #j-load-btn').prop('disabled', true);
        for(var i = 0; i < $FACTIONS.length; i++){
            const faction = $FACTIONS[i];
            if(faction.loaded) continue;
            faction.load(faction);
            break;
        }
    });
}

function test(a){
    console.log('test: '+a);
}

function filter(members) {
    const filtered = [];
    members.forEach(member => {
        if($FILTER.level.min > member.level) return;
        if($FILTER.level.max < member.level) return;
        if(!$FILTER.statuses.some(ignore => ignore === member.status)) return;
        filtered.push(member);
    });
    return filtered;
}


// TODO: use class instead
function generateFactionObject(item) {
    /** Properties **/
    const element = $(item).find('.status-wrap');
    const name = $(element).find('.info > .name > a').text();
    const url = $(element).find('.info > .name > a').attr('href');
    const id = url.substr(url.indexOf('ID=')+3);
    const progress = $(element).find('.info > .status > .wai').text().split('(')[1].slice(0, -2);
    const respect = $(element).find('.info > .status > .t-red').text();
    const members = [];

    /** Functions **/
    const load = (faction) => {
        $(faction.element).find('.status-wrap').click();
        const loaded = (members) => {
            $(members).each((index, item) => {
                faction.members.push(generateMemberObject(item));
            });
            faction.header = $MAIN.find('.descriptions > .status-desc').clone();
            faction.loaded = true;
            generateView();
        };
        const wait = () => {
            setTimeout(() => {
                const check = $MAIN.find('.f-war-list > li.descriptions > .viewport > .overview > ul.member-list > li');
                _ = check.length > 0 ? loaded(check) : wait();
            }, 5);
        };
        wait();
    };

    return {
        element: item,
        id,
        name,
        url,
        progress,
        respect,
        members,
        load,
        loaded: false,
    };
}

function generateMemberObject(element) {
    const level = $(element).find('.lvl').contents().text().trim().substr(10).trim();
    const status = $(element).find('.status > span').text();

    /** functions **/
    const attack = (member) => window.location = $(member.element).find('.act-cont > a').attr('href');
    return {
        element,
        level,
        status,
        attack,
    };
}










