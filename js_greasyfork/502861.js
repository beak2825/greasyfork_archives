// ==UserScript==
// @name         Ironwood RPG - Pet auto namer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically name your pets with the click of a button!
// @author       Cascade
// @match        https://ironwoodrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ironwoodrpg.com
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502861/Ironwood%20RPG%20-%20Pet%20auto%20namer.user.js
// @updateURL https://update.greasyfork.org/scripts/502861/Ironwood%20RPG%20-%20Pet%20auto%20namer.meta.js
// ==/UserScript==

waitTillLoad(50).then(() => {
    clearInterval(checkit);
    setInterval(checkit, 500);
});

function checkit(){
    if(window.location.href.indexOf("skill/15") == -1) return;
    let q = document.querySelectorAll('modal-component.ng-star-inserted')[0];
    if(q){
        doit(q);
    }
}

function doit(q){
    let heading = q.querySelectorAll('button.heading')[0];
    let alr = document.getElementById('arHBtn');
    if(!heading) return;
    if(!alr){
        let btn = document.createElement('button');

        for (let i = 0, atts = heading.attributes, n = atts.length, arr = []; i < n; i++){
            if(atts[i].nodeName.includes('_ngcontent-')){
                btn.toggleAttribute(atts[i].nodeName);
                break;
            }
        }

        heading.parentElement.parentElement.insertBefore(btn, heading.parentElement.parentElement.lastChild);
        btn.textContent = 'Auto';
        btn.classList.add('petAuto');
        btn.style = 'max-width: 75px !important; padding-left:5px !important;padding-right:5px !important;padding-top:5px !important;padding-bottom:5px !important;margin-left:15px !important;'
        btn.id = 'arHBtn';

        btn.addEventListener('click', () => {
            let species = $('div:contains("Species")').closest('div.row')[0].children[1].textContent;
            let firstLetter = species ? species[0].toUpperCase() : '';

            let hp = parseNum($('div:contains("Health")').closest('div.row').find('div.mono').first().find('span:contains("%")').first().text());
            let atk = parseNum($('div:contains("Attack")').closest('div.row').find('div.mono').first().find('span:contains("%")').first().text());
            let def = parseNum($('div:contains("Defense")').closest('div.row').find('div.mono').first().find('span:contains("%")').first().text());
            console.log(species + ' hp ' + hp + ', atk ' + atk + ', def ' + def);

            let magic = getAttr('Magic Resist');
            let ranged = getAttr('Ranged Evade');
            let melee = getAttr('Melee Block');
            let loot = getAttr('Loot Find');
            let egg = getAttr('Egg Find');
            let hunger = getAttr('Hunger');

            let HPform = formatStat(hp); let ATKform = formatStat(atk); let DEFform = formatStat(def);
            let formatted = "";

            let attributeForm = "";
            if(magic > 0) attributeForm += (" R" + magic);
            if(ranged > 0) attributeForm += (" E" + ranged);
            if(melee > 0) attributeForm += (" B" + melee);
            if(loot > 0) attributeForm += (" L" + loot);
            if(egg > 0) attributeForm += (" F" + egg);
            if(hunger > 0) attributeForm += (" H" + hunger);

            let statsForm = HPform + ATKform + DEFform;
            formatted = firstLetter + statsForm + attributeForm;

            heading.click();
            waitTillLoad(50).then(() => {
                let field = document.querySelectorAll('form > input.ng-pristine.ng-valid')[0];
                field.value = formatted;
                field.dispatchEvent(new Event("input", { bubbles: true }));
            });
        })
    }
}

function getAttr(attributeName){
    let attrCont = $('modal-component').find('div.preview').first().find('div.name:contains("' + attributeName + '")').first()[0];
    if(attrCont)
        return parseNum(attrCont.textContent);
    else return 0;
}
function formatStat(stat){
    return stat >= 100 ? ('0') : (stat >= 90 ? ('9') : (stat >= 80 ? ('8') : (stat >= 70 ? ('7') : (stat >= 60 ? ('6') : (stat >= 50 ? ('5') : (stat >= 40 ? ('4') : (stat >= 30 ? ('3') : (stat >= 20 ? ('2') : (stat >= 10 ? ('1') : 'X')))))))));
}
function parseNum(unparsed){
    if(!unparsed) return 0;
    return Number(unparsed.replace(/\D+/g, ''));
}
function waitTillLoad(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

setTimeout(function() {
    var css = `
        .petAuto {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            height: 40px;
            font-weight: 600;
            letter-spacing: .25px;

          background-color: #1c2f40 !important;
          padding-left:30px !important;
          padding-right:30px !important;
          margin-right: 12px !important;
          margin-left: 0px !important;
          transition: 0.2s ease;
        }
        .petAuto:hover {
          background-color: #65aadb !important;
        }
        `;

    var style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.head.appendChild(style);
}, 500);