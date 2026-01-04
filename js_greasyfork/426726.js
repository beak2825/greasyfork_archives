// ==UserScript==
// @name         DnD Monster Collector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  DnD Monster Collector description
// @author       You
// @match        https://www.dndbeyond.com/monsters/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/426726/DnD%20Monster%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/426726/DnD%20Monster%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var monster = {};


    //Basic
    monster.id = monster.name = document.querySelector('#content > section > div > div.more-info.details-more-info > div > div.mon-stat-block > div.mon-stat-block__header > div.mon-stat-block__name > a').href.replace("https://www.dndbeyond.com/monsters/","");
    monster.name = document.querySelector('#content > section > div > div.more-info.details-more-info > div > div.mon-stat-block > div.mon-stat-block__header > div.mon-stat-block__name > a').innerText;
    monster.image = document.querySelector('#content > section > div > div.more-info.details-more-info > div > div.image > a > img') ? document.querySelector('#content > section > div > div.more-info.details-more-info > div > div.image > a > img').src : null;
    monster.legendary = document.querySelector('#site-main > header.page-header > div.page-header__primary > div > div.page-heading__suffix > i') ? true : false;
    monster.lair = false;
    monster.pronunciation = document.querySelector('#pronunciation-player > source') ? document.querySelector('#pronunciation-player > source').src : null;
    monster.meta = document.querySelector('#content > section > div > div.more-info.details-more-info > div > div.mon-stat-block > div.mon-stat-block__header > div.mon-stat-block__meta').innerText;
    let metaArr = monster.meta.split(",")[0].split(" ");
    monster.size = metaArr.shift().trim();
    monster.alignament = capitalizehWord(monster.meta.split(",")[1].trim());
    monster.type = capitalize(metaArr.join(" ").trim());

    delete monster.meta;

    //Attributes
    monster.attributes = [];

    var attributes = document.querySelectorAll('#content > section > div > div.more-info.details-more-info > div > div.mon-stat-block > div.mon-stat-block__attributes > div');

    attributes.forEach((element) => {
        let label = element.querySelector('.mon-stat-block__attribute-label');
        let value = element.querySelector('.mon-stat-block__attribute-data-value');
        let extra = element.querySelector('.mon-stat-block__attribute-data-extra');

        let attribute = {
            label: label ? label.innerText : null,
            value: value ? value.innerText : null,
            extra: extra ? extra.innerText.replace("(","").replace(")","") : null
        }

        if(attribute.label == 'Speed'){
            let speedArr = attribute.value.replaceAll(" ft.","").split(", ");
            attribute.value = speedArr.shift();
            attribute.extra = []

            speedArr.forEach((e) => {
                attribute.extra.push(capitalize(e).split(" "));
            })
        }

        monster.attributes.push(attribute);
    })

    //Abilities
    monster.abilities = [];

    var abilities = Array.from(document.querySelector('#content > section > div > div.more-info.details-more-info > div > div.mon-stat-block > div.mon-stat-block__stat-block > div.ability-block').children)

    abilities.forEach((element) => {
        let label = element.querySelector('.ability-block__heading');
        let score = element.querySelector('.ability-block__score');
        let modifier = element.querySelector('.ability-block__modifier');

        let ability = {
            name: label ? label.innerText : null,
            score: score ? score.innerText : null,
            modifier: modifier ? modifier.innerText.replace("(","").replace(")","") : null
        }

        monster.abilities.push(ability);
    })

    //Properties
    monster.properties = [];

    let properties = document.querySelectorAll('#content > section > div > div.more-info.details-more-info > div > div.mon-stat-block > div.mon-stat-block__tidbits div.mon-stat-block__tidbit')

    properties.forEach((element) => {
        let label = element.querySelector('.mon-stat-block__tidbit-label');
        let value = element.querySelector('.mon-stat-block__tidbit-data');

        let property = {
            label: label ? label.innerText : null,
            value: value ? value.innerText : null
        }

        if(property.label == 'Challenge'){
            property.value = property.value.replace(")","").split(" (");
        }
        else{
            if(property.label !== 'Proficiency Bonus'){
                property.value = property.value.split(", ");
            }
        }

        monster.properties.push(property);
    })

    //Description
    monster.descriptions = [];

    let descriptions = document.querySelectorAll('#content > section > div > div.more-info.details-more-info > div > div.mon-stat-block > div.mon-stat-block__description-blocks > div.mon-stat-block__description-block')

    descriptions.forEach((element) => {
        let label = element.querySelector('.mon-stat-block__description-block-heading');
        let value = element.querySelector('.mon-stat-block__description-block-content');

        let description = {
            label: label ? label.innerText : null,
            value: value ? value.innerHTML : null
        }

        monster.descriptions.push(description);
    })


    //More Info
    monster.more = [];

    let more = document.querySelectorAll('#content > section > div > div.more-info.details-more-info > div > div.more-info-content div.mon-details__description-block-content');

    more.forEach((element) => {
        monster.more.push(element.innerHTML);
        if(element.innerHTML.includes("<h4>Lair Actions</h4>")){
            monster.lair = true;
        }
    })

    //Environment
    monster.environments = [];

    let environments = document.querySelectorAll('#content > section > div > div.more-info.details-more-info > div > footer > p.tags.environment-tags span.environment-tag');

    environments.forEach((element) => {
            monster.environments.push(capitalizehWord(element.innerText));
    })

    //Tags
    monster.tags = [];

    let tags = document.querySelectorAll('#content > section > div > div.more-info.details-more-info > div > footer > p.tags.monster-tags span.monster-tag');

    tags.forEach((element) => {
            monster.tags.push(capitalizehWord(element.innerText));
    })


    //Source
    monster.source = document.querySelector('#content > section > div > div.more-info.details-more-info > div > footer > p.source.monster-source') ? document.querySelector('#content > section > div > div.more-info.details-more-info > div > footer > p.source.monster-source').innerText.split(" , ") : null;



    //SEND RESULT

    //console.log(JSON.stringify(monster,null,2));
    console.log(monster);


    GM_xmlhttpRequest ( {
        method:     'POST',
        url:        'http://joxpc.ddns.net/dnd/',
        data:       JSON.stringify({type:"monster", data:monster}),
        onload:     function (responseDetails) {
            // DO ALL RESPONSE PROCESSING HERE...
            //console.log(responseDetails, responseDetails.responseText);
            alert(responseDetails.responseText);
        }
    });



    //HELPER FUNCTIONS
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    }

    function capitalizehWord(words) {
        let separateWord = words.toLowerCase().split(' ');
        for (let i = 0; i < separateWord.length; i++) {
            separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
                separateWord[i].substring(1);
        }
        return separateWord.join(' ');
    }
})();