// ==UserScript==
// @name        AntiSmejd
// @description Na zpravodajských webech nahradí jména politických šmejdů přiléhavějším označením. Skript slouží pouze k pobavení :-)
// @namespace   https://humor.a.syn
// @namespace   Humor & syn
// @license     MIT; https://opensource.org/licenses/MIT
// @require     https://code.jquery.com/jquery-3.6.3.slim.min.js
// @version     0.5
// @match       https://*.a2larm.cz/*
// @match       https://*.ahaonline.cz/*
// @match       https://*.aktualne.cz/*
// @match       https://*.blesk.cz/*
// @match       https://*.blisty.cz/*
// @match       https://*.ceskenoviny.cz/*
// @match       https://*.ceskatelevize.cz/*
// @match       https://*.ctidoma.cz/*
// @match       https://*.denik.cz/*
// @match       https://*.denikn.cz/*
// @match       https://*.denikplus.cz/*
// @match       https://*.denikreferendum.cz/*
// @match       https://*.e15.cz/*
// @match       https://*.echo24.cz/*
// @match       https://*.euro.cz/*
// @match       https://*.eurozpravy.cz/*
// @match       https://*.expres.cz/*
// @match       https://*.extra.cz/*
// @match       https://*.extrastory.cz/*
// @match       https://*.forum24.cz/*
// @match       https://*.g.cz/*
// @match       https://*.globe24.cz/*
// @match       https://*.halonoviny.cz/*
// @match       https://*.hlidacipes.org/*
// @match       https://*.hn.cz/*
// @match       https://*.idnes.cz/*
// @match       https://*.info.cz/*
// @match       https://*.instory.cz/*1
// @match       https://*.iprima.cz/*
// @match       https://*.irozhlas.cz/*
// @match       https://*.krajskelisty.cz/*
// @match       https://*.lidovky.cz/*
// @match       https://*.literarky.cz/*
// @match       https://*.metro.cz/*
// @match       https://*.nasregion.cz/*
// @match       https://*.neovlivni.cz/*
// @match       https://*.novinky.cz/*
// @match       https://*.parlamentnilisty.cz/*
// @match       https://*.prahain.cz/*
// @match       https://*.prvnizpravy.cz/*
// @match       https://*.reflex.cz/*
// @match       https://*.reportermagazin.cz/*
// @match       https://*.respekt.cz/*
// @match       https://*.seznamzpravy.cz/*
// @match       https://*.stars24.cz/*
// @match       https://*.super.cz/*
// @match       https://*.tiscali.cz/*
// @match       https://*.tyden.cz/*
// @downloadURL https://update.greasyfork.org/scripts/458353/AntiSmejd.user.js
// @updateURL https://update.greasyfork.org/scripts/458353/AntiSmejd.meta.js
// ==/UserScript==

const $ = this.jQuery = jQuery.noConflict(true); // eslint-disable-line
const body = $('body');

class PolitickySmejd {
    regexAll = null;
    map = [];

    guessCase(text) { return -1; }

    replaceInString(text) {
        let newText = '';
        let pos = 0;
        let matches = text.match(this.regexAll)?? [];
    
        for (let smejd of matches) {
            let id = this.guessCase(smejd);

            if (id > 0) {
                let replacement = this.map[id];

                if (smejd.match(/\s+o\s+/gim)) replacement = ' o ' + replacement;

                let start = text.indexOf(smejd, pos);
        
                newText += text.substring(pos, start) + '<i>' + replacement + '</i>';
        
                pos = start + smejd.length;
            }
        }
 
        newText += text.substring(pos);
    
        return newText;
    }
}

class Babis extends PolitickySmejd {
    constructor() {
        super();

        this.regexAll = /(?:\s+o\s+)?(?:A\.|Andrej(?:em|e|i|ovi)?\s+)?Babiš(?!ová|ové)(?:ových|ovými|ovým|ovou|ovy|ova|ově|ovo|ovu|ův|em|e|i|ovi)?/gm;

        this.map[10] = 'Estébákových';
        this.map[11] = 'Estébákovými';
        this.map[12] = 'Estébákovým';
        this.map[13] = 'Estébákovou';
        this.map[14] = 'Estébákova';
        this.map[15] = 'Estébákově';
        this.map[16] = 'Estébákovo';
        this.map[17] = 'Estébákovu';
        this.map[18] = 'Estébákovy';
        this.map[19] = 'Estébákův';

        this.map[1]  = 'Prolhaný estébák';
        this.map[24] = 'Prolhaného estébáka';
        this.map[3]  = 'Prolhanému estébákovi';
        this.map[5]  = 'Prolhaný estébáku';
        this.map[6]  = 'Prolhaném estébákovi';
        this.map[7]  = 'Prolhaným estébákem';
    }

    guessCase(text) {
        if (text.match(/Babišových/gim)) return 10;
        if (text.match(/Babišovými/gim)) return 11;
        if (text.match(/Babišovým/gim)) return 12;
        if (text.match(/Babišovou/gim)) return 13;
        if (text.match(/Babišova/gim)) return 14;
        if (text.match(/Babišově/gim)) return 15;
        if (text.match(/Babišovo/gim)) return 16;
        if (text.match(/Babišovu/gim)) return 17;
        if (text.match(/Babišovy/gim)) return 18;
        if (text.match(/Babišův/gim)) return 19;

        if (text.match(/(A\.|Andrejem\s+)?Babišem/gim)) return 7;
        if (text.match(/\s+o\s+(A\.|Andrej(i|ovi)\s+)?Babišovi/gim)) return 6;
        if (text.match(/(A\.|Andrej(i|ovi)\s+)?Babišovi/gim)) return 3;
        if (text.match(/(A\.|Andreje\s+)?Babiše/gim)) return 24;
        if (text.match(/(A\.|Andreji\s+)?Babiši/gim)) return 5;
        if (text.match(/(A\.|Andrej\s+)?Babiš(?!ová|ové)/gim)) return 1;

        return -1;
    }
}

class Zeman extends PolitickySmejd {
    constructor() {
        super();

        this.regexAll = /(?:\s+o\s+)?(?:M\.|Miloš(?:em|e|i|ovi)?\s+)?Zeman(?!ová|ové)(?:ových|ovými|ovým|ovou|ova|ově|ovo|ovu|ovy|ův|a|em|e|ovi)?/gm;

        this.map[10] = 'Hulvátových';
        this.map[11] = 'Hulvátovými';
        this.map[12] = 'Hulvátovým';
        this.map[13] = 'Hulvátovou';
        this.map[14] = 'Hulvátova';
        this.map[15] = 'Hulvátově';
        this.map[16] = 'Hulvátovo';
        this.map[17] = 'Hulvátovu';
        this.map[18] = 'Hulvátovy';
        this.map[19] = 'Hulvátův';

        this.map[1]  = 'Samolibý hulvát';
        this.map[24] = 'Samolibého hulváta';
        this.map[3]  = 'Samolibému hulvátovi';
        this.map[5]  = 'Samolibý hulváte';
        this.map[6]  = 'Samolibém hulvátovi';
        this.map[7]  = 'Samolibým hulvátem';
    }

    guessCase(text) {
        if (text.match(/Zemanových/gim)) return 10;
        if (text.match(/Zemanovými/gim)) return 11;
        if (text.match(/Zemanovým/gim)) return 12;
        if (text.match(/Zemanovou/gim)) return 13;
        if (text.match(/Zemanova/gim)) return 14;
        if (text.match(/Zemanově/gim)) return 15;
        if (text.match(/Zemanovo/gim)) return 16;
        if (text.match(/Zemanovu/gim)) return 17;
        if (text.match(/Zemanovy/gim)) return 18;
        if (text.match(/Zemanův/gim)) return 19;

        if (text.match(/(M\.|Milošem\s+)?Zemanem/gim)) return 7;
        if (text.match(/\s+o\s+(M\.|Miloš(i|ovi)\s+)?Zemanovi/gim)) return 6;
        if (text.match(/(M\.|Miloš(i|ovi)\s+)?Zemanovi/gim)) return 3;
        if (text.match(/(M\.|Miloše\s+)?Zemana/gim)) return 24;
        if (text.match(/(M\.|Miloši\s+)?Zemane/gim)) return 5;
        if (text.match(/(M\.|Miloš\s+)?Zeman(?!ová|ové)/gim)) return 1;

        return -1;
    }
}

class Havlicek extends PolitickySmejd {
    constructor() {
        super();

        this.regexAll = /(?:\s+o\s+)?(?:K\.|Kar(?:lem|el|le|lu|la|lovi)?\s+)?Havlíče?k(?!ová|ové)(?:ových|ovými|ovým|ovou|ova|ově|ovo|ovy|ův|em|a|u|ovi)?/gm;

        this.map[10] = 'Pejsánkových';
        this.map[11] = 'Pejsánkovými';
        this.map[12] = 'Pejsánkovým';
        this.map[13] = 'Pejsánkovou';
        this.map[14] = 'Pejsánkova';
        this.map[15] = 'Pejsánkově';
        this.map[16] = 'Pejsánkovo';
        this.map[17] = 'Pejsánkovy';
        this.map[18] = 'Pejsánkův';

        this.map[1]  = 'Andrejův pejsánek';
        this.map[24] = 'Andrejova pejsánka';
        this.map[3]  = 'Andrejovu pejsánkovi';
        this.map[5]  = 'Andrejův pejsánku';
        this.map[6]  = 'Andrejovu pejsánkovi';
        this.map[7]  = 'Andrejovým pejsánkem';
    }

    guessCase(text) {
        if (text.match(/Havlíčkových/gim)) return 10;
        if (text.match(/Havlíčkovými/gim)) return 11;
        if (text.match(/Havlíčkovým/gim)) return 12;
        if (text.match(/Havlíčkovou/gim)) return 13;
        if (text.match(/Havlíčkova/gim)) return 14;
        if (text.match(/Havlíčkově/gim)) return 15;
        if (text.match(/Havlíčkovo/gim)) return 16;
        if (text.match(/Havlíčkovy/gim)) return 17;
        if (text.match(/Havlíčkův/gim)) return 18;

        if (text.match(/(K\.|Karlem\s+)?Havlíčkem/gim)) return 7;
        if (text.match(/\s+o\s+(A\.|Karl(u|ovi)\s+)?Havlíčkovi/gim)) return 6;
        if (text.match(/(K\.|Karl(u|ovi)\s+)?Havlíčkovi/gim)) return 3;
        if (text.match(/(K\.|Karla\s+)?Havlíčka/gim)) return 24;
        if (text.match(/(K\.|Karle\s+)?Havlíčku/gim)) return 5;
        if (text.match(/(K\.|Karel\s+)?Havlíček/gim)) return 1;

        return -1;
    }
}

class Schillerova extends PolitickySmejd {
    constructor() {
        super();

        this.regexAll = /(?:\s+o\s+)?(?:A\.|Alen(?:ou|y|ě|u|a|o)?\s+)?Schillerov(?:ou|é|á)?/gm;

        this.map[1]  = 'Andrejova modelka';
        this.map[24] = 'Andrejovy modelky';
        this.map[3]  = 'Andrejově modelce';
        this.map[5]  = 'Andrejova modelko';
        this.map[6]  = 'Andrejově modelce';
        this.map[7]  = 'Andrejovou modelkou';
    }

    guessCase(text) {
        // TODO lze jednoduše rozlišit "nápad Schillerové" od "řekl Schillerové"?
        if (text.match(/(A\.|Alenou\s+)?Schillerovou/gim)) return 7;
        if (text.match(/\s+o\s+(A\.|Aleně\s+)?Schillerové/gim)) return 6;
        if (text.match(/(A\.|Aleně\s+)?Schillerové/gim)) return 3;
        if (text.match(/(A\.|Aleny\s+)?Schillerové/gim)) return 24;
        if (text.match(/(A\.|Alena\s+)?Schillerová/gim)) return 1;
        if (text.match(/(A\.|Aleno\s+)?Schillerová/gim)) return 5;

        return -1;
    }
}

const babis = new Babis();
const zeman = new Zeman();
const havlicek = new Havlicek();
const schillerova = new Schillerova();

const smejdiRegex = /Babiš|Zeman|Havlíče?k|Schillerov/gim;

function replaceInPage() {
    body.find('*').contents().filter(function() { 
        return this.nodeType == 3 && this.nodeValue.match(smejdiRegex);
    }).each(function() {
        let text = this.nodeValue;

        text = babis.replaceInString(text);
        text = zeman.replaceInString(text);
        text = havlicek.replaceInString(text);
        text = schillerova.replaceInString(text);

        $(this).replaceWith(text);
    });
}

$(document).ready(function() {
    replaceInPage();

    const observer = new MutationObserver(function(mutations, observer) {
        observer.disconnect();

        replaceInPage();

        observer.observe(body[0], { childList: true, subtree: true });
    });

    observer.observe(body[0], { childList: true, subtree: true });
});