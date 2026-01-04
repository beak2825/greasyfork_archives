// ==UserScript==
// @name         [AO3] Dee's Color-Coded Tags
// @namespace    https://greasyfork.org/en/users/1138163-dreambones
// @version      0.9
// @description  Highlight work tags based on their content to better sort through works.
// @author       DREAMBONES
// @match        http*://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501686/%5BAO3%5D%20Dee%27s%20Color-Coded%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/501686/%5BAO3%5D%20Dee%27s%20Color-Coded%20Tags.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change the hex values here if you want to change highlight colors! The last colors in the lists are the text colors--colors before that are background color.
    const colorCodes = {
        "Queer": ["linear-gradient(to right, #FF6B9B, #FFB46F, #4EDD7D, #6AA6FF)", "#150c39"],
        "Disability": ["linear-gradient(to right, #FF6B9B, #ffd665, #ffe5cc, #5cd0ff, #4EDD7D)", "#150c39"],
        "Sweet": ["#33c764", "#0d4464"],
        "Romantic": ["#cb4e7e", "#ffe5cc"],
        "Meta": ["#ff744b", "#730e4b"],
        "Warn": ["#702092", "#5cd0ff"]
    }
    const tagRe = {
        "Queer": [/(queer|trans(gender|masc|man|fem|woman)|lgbt)(?!phobi)/, /lesbian|sapphic/, /(^| )(gay|ace|aro|trans|acearo|demi|bi|pan)($| |-curio|!)/, /(?<!mis)gender/,
                  /(homo|bi|pan|omni|a|demi)(-?sexual|-?romantic)/, /homoerotic/, /polyamor/, /t4t/, /(non-?binary)|enby/, /intersex/, /qpr/, /pronoun/, /coming out/, /cross[- ]?dress/],

        "Disability": [/disabled/, /autis/, /plurality|multiplicity/, /paraplegic/, /adhd/, /ocd/, /ptsd/, /neurodiver/, /disorder/, /bulimia/, /amputee/, /has anxiety/, /dyslexi/,
                    /color[- ]?blind/, /schizophren/, /psychosis/, /blind|deaf|mute/, /disability/, /mental (disorder|illness)/],

        "Sweet": [/fluff/, /tenderness/, /funny|comedy|humor|silly/, /friend/, /domestic bliss/, /happy ending/, /(?<!no )comfort/, /slice of life/, /everybody lives/, /heartwarming/,
                 /(?<!\w)hug/, /cuddl|snuggl/, /companionship/, /affection/, /bonding/, /found family/, /bromance/, /good (parent|sibling|brother|sister)/],

        "Romantic": [/pining/, /slow burn/, /yaoi|yuri/, /[^b]romance/, /(established|developing) relationship/, /flirt/, /kiss/, /love confession/, /making out/, /getting together/,
                     /unrequited/, /^(pre-)?slash$/, /love triangle/, /denial of feelings/, /first date/, /one-sided attraction/, /ot[34p]/, /in love/, /to lovers/, /romance/, /courting/],

        "Meta": [/(?<!\w)pov(?!\w)/, /point of view/, /character study/, /world[- ]?building/, /(pre-|post-|during )canon/, /(digital |fan)art/, /illustration/, /inner dialogue|internal monologue/, /drabble/,
                 /crossover/, /missing scene/, /out of character|(?<!\w)ooc(?!\w)/, /unreliable narrator/, /epistolary/, /found footage/, /(alternate universe|(?<!\w)au(?!\w))/, /screenplay\/script format/,
                 /dialogue heavy/, /spoilers/, /one shot/, /limerick|poe(try|m)/, /canon (non-)?compliant/, /choose your own adventure/, /dialogue[- ]only/, /vignette/, /5\+1/, /no dialogue/, /ficlet/,
                /chatfic/, /-centric/, /updates/, /companion piece/, /fix-it/, /role[- ]?(reversal|swap)/, /body[- ]?swap/],

        "Warn": [/angst/, /self[- ](harm|hat|destruct|esteem|confidence)/, /(?<!un)death/, /suicid/, /murder/, /gore/, /slur/, /bigot/, /(homo|trans|xeno|islamo)phobi/, /war crime/, /injur/, /mental health issue/,
                 /hurt no comfort/, /(anxiety|panic) attack/, /bad (ending|future)/, /(sex|rac|able)is/, /stigma/, /police brutality/, /mis(ogyn|andr)/, /tortur/, /dehumaniz/, /rape/, /(bad|neglectful) parent/,
                 /abus(iv)?e/, /(?<!post-)trauma/, /violence/, /non[- ]?con/, /read at your own risk/, /dead dove/, /body horror/, /whump/, /drinking to cope/, /unethical/, /assault/, /underage (drug|drinking)/,
                /depress/, /it gets worse/, /discrim/, /manipulat/, /gaslight/, /incest/, /mourning/, /misgender/, /corpses/]
    }

    const domainRe = /https?:\/\/archiveofourown\.org\/(works|tags|users).*/i;
    if (domainRe.test(document.URL)) {
        const relationships = document.querySelectorAll("li.relationships > a");
        // Highlight relationship tags if they're romantic.
        for (let tag of relationships) {
            if (!/\&/.test(tag.innerText)) {
                tag.style.background = colorCodes.Romantic[0];
                tag.style.color = colorCodes.Romantic[1];
            }
        }
        const freeforms = document.querySelectorAll("li.freeforms > a");
        // Highlight freeform tags if they match.
        for (let tag of freeforms) {
            for (let type in tagRe) {
                for (let re of tagRe[type]) {
                    re = new RegExp(re, "i");
                    if (re.test(tag.innerHTML)) {
                        tag.style.background = colorCodes[type][0];
                        tag.style.color = colorCodes[type][1];
                    }
                }
            }
        }
    }
})();