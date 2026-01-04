// ==UserScript==
// @name         LinkedIn Injection
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Data Injection
// @author       You
// @match        https://www.linkedin.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/387508/LinkedIn%20Injection.user.js
// @updateURL https://update.greasyfork.org/scripts/387508/LinkedIn%20Injection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = window.$;

    function checkExists(selector, cb){
        let timer = setInterval(function() {
            if ($(selector).length) {
                clearInterval(timer);
                return cb();
            }
        }, 100);
    };

    function dataInjection(template, cb){
        let profileName = $(".pv-top-card-v3 ul.pv-top-card-v3--list:first li:first").text().replace(/\s+/g,' ').trim();
        let firstName = profileName.split(' ')[0];
        let lastName = profileName.split(' ')[1];
        let profileHeadline = $(".pv-top-card-v3 h2").text().replace(/\s+/g,' ').trim();
        let companyName = $(".pv-top-card-v3--experience-list-item:first span").text().replace(/\s+/g,' ').replace('"','').trim();

        let hasClearPosition = true;
        let positionTitle = null;
        if(profileHeadline.includes(" at ")){
            positionTitle=profileHeadline.split(" at ")[0];
        }else if(profileHeadline.includes(" chez ")){
            positionTitle=profileHeadline.split(" chez ")[0];
        }else if(profileHeadline.includes(" @ ")){
            positionTitle=profileHeadline.split(" @ ")[0];
        }else if(profileHeadline.includes(" - ")){
            positionTitle=profileHeadline.split(" - ")[0];
        }else{
            hasClearPosition = false;
        }

        template = template.replace(/\{\{firstName\}\}/g, firstName);
        template = template.replace(/\{\{lastName\}\}/g, lastName);
        template = template.replace(/\{\{companyName\}\}/g, companyName);

        if(hasClearPosition){
            template = template.replace(/\{\{positionTitle\}\}/g, positionTitle);
            template = template.replace(/\[PT\]/g, "");
            template = template.replace(/\[\/PT\]/g, "");
        }else{
            template = template.replace(/\[PT\].*\[\/PT\]/g, "");
        }

        return cb(template);
    }

    const templates = {
        "fr-v1":`Bonjour {{firstName}},

Ravi de partager nos réseaux. Je me permets de vous contacter rapidement.

J'ai monté Steerio, une solution digitale qui utilise les feedbacks des équipes et la data (people analytics) pour booster la performance de vos collaborateurs et leur expérience de travail : www.steerio.co

Nous accompagnons un portefeuille de clients variés sur leurs objectifs de transformation et d'excellence opérationnelle et pouvons apporter une forte valeur ajoutée à Steerio.

Est-ce que vous seriez intéressé pour que l'on échange rapidement et que je vous présente plus précisément ce que l'on fait ?

D'avance merci pour votre temps,

Bonne journée`,
    };

    setInterval(function(){
        if($('.fake-button').length===0 && $("button.pv-s-profile-actions--message").length>0){
            let button = $("button.pv-s-profile-actions--message");
            for(const templateName in templates){
                let newButton = button.clone();
                newButton.text(templateName);
                newButton.addClass('fake-button');
                newButton.data('templatename', templateName);
                button.before(newButton);
            }
        }
    },500);

    $(document).on('click', '.fake-button', function(e){
        let templateName = $(e.currentTarget).data('templatename');
        if(templateName in templates){
            let text = templates[templateName];
            dataInjection(text, function(text){
                var $temp = $("<textarea>");
                $("body").append($temp);
                $temp.val(text).select();
                document.execCommand("copy");
            });
        }
    });

})();

