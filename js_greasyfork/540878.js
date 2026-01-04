// ==UserScript==
// @name         Visible Bonus
// @version      2.0
// @description  None
// @author       Elvay [3095345]
// @match        https://www.torn.com/loader.php?sid=attackLog&ID=*
// @match        https://www.torn.com/loader.php?sid=attack*
// @namespace https://greasyfork.org/users/1279378
// @downloadURL https://update.greasyfork.org/scripts/540878/Visible%20Bonus.user.js
// @updateURL https://update.greasyfork.org/scripts/540878/Visible%20Bonus.meta.js
// ==/UserScript==

'use strict';

const exclusions = ["damage","miss","reloading"]
function colorByType(type){

    switch(type) {
        case "crit":
            return '#FF0000';
            break;
        case "leave":
        case "hospitalize":
        case "mug":
        case "lose":
            return '#000000'
            break;
        case "grenade":
            return '#FFA500';
            break;
        default:
            return '#0000FF'
    }
}

function prepareBox(sp,m){
    if (sp && m) {
        if(m.querySelector('.bonus_box')) {return}
        const type = sp.className.replace("attacking-events-", "").replace("standart-","").replace("attack-","").replace("critical-hit","crit").replace("-use","");
        const tag = document.createElement('span');
        tag.textContent = `${type}`;
        Object.assign(tag.style, {
            color: '#FFF',
            background: colorByType(tag.textContent),
            display: 'inline-block',
            width: 'fit-content',
            fontSize: '11px',
            borderRadius: '5px',
            padding: '2px 4px',
            fontWeight: 'bold',
            margin: '0',
            textTransform: 'uppercase',
        });
        tag.className = 'bonus_box';

        if(!exclusions.includes(type)){
            m.prepend(tag);
        }
    }

}

function attackLogPage(list){

    list.querySelectorAll('li').forEach(e => {
        const span = e.querySelector('span[class^="attacking-events-"]');
        const msg = e.querySelector('span.message');
        prepareBox(span,msg);
    });
}

function attackPage(list){

    if(!list){return}

    list.querySelectorAll('li').forEach(e => {

        if(e){
            const span = e.querySelector('span[class^="col1"] span[class^="iconWrap"] span[class^="attacking-events-"]');
            const msg = e.querySelector('span[class^="col1"]  span[class^="message"]');
            prepareBox(span,msg);
        }
    });
}



const params = new URLSearchParams(location.search);
const sid = params.get('sid');



if (sid === 'attackLog') {
    const ul = document.querySelector('ul[class^="log-list"]');
    if (ul) attackLogPage(ul);
    setInterval(() => {
        document.querySelectorAll('div.jscroll-added ul.log-list').forEach(attackLogPage);
    }, 1000);
} else if (sid === 'attack') {
    const observer = new MutationObserver((mutations, obs) => {
        const ul = document.querySelector('ul[class^="list__"]');
        if (ul) {
            setInterval(() => attackPage(ul), 1000);
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}