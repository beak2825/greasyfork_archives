// ==UserScript==
// @name rktwrds
// @namespace rktwrds
// @description Replaces ordinary words with rktwrds. Based on panicsteve's cloud-to-butt extension.
// @match *://*/*
// @version 1.0.2
// @license WTFPL
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/456335/rktwrds.user.js
// @updateURL https://update.greasyfork.org/scripts/456335/rktwrds.meta.js
// ==/UserScript==
(function() {

    function walk(node) 
    {
        // I stole this function from here:
        // http://is.gd/mwZp7E
    
        var child, next;
    
        switch ( node.nodeType )  
        {
            case 1:  // Element
            case 9:  // Document
            case 11: // Document fragment
                child = node.firstChild;
                while ( child ) 
                {
                    next = child.nextSibling;
                    walk(child);
                    child = next;
                }
                break;
    
            case 3: // Text node
                handleText(node);
                break;
        }
    }
    
    function handleText(textNode)
    {
        var v = textNode.nodeValue;
    
        v = v.replace(/\bsocke\b/gi, "Socko");
        v = v.replace(/\bsocken\b/gi, "Sockos");
        v = v.replace(/\bannähernd\b|\bca\.|\bcirca\b|\bungefähr\b/g, "roundabout");
        v = v.replace(/\bAnnähernd\b|\bUngefähr\b/g, "Roundabout");
        v = v.replace(/\b(seh(?!r)|schau(?!spiel))/g, "guck");
        v = v.replace(/\b(Seh(?!r)|Schau(?!spiel))/g, "Guck");
        v = v.replace(/\b(check|kapier|versteh)/g, "raff");
        v = v.replace(/\b(Check|Kapier|Versteh)/g, "Raff");
        v = v.replace(/((?<!Gra)ficks?|beischlaf)/g, "bums");
        v = v.replace(/\b(?<!wunder,\s?|-)wunderschön\b/g, "wunder-wunderschön");
        v = v.replace(/\b(?<!Wunder,\s?|-)Wunderschön\b/g, "Wunder-wunderschön");
        v = v.replace(/\b(kacke|schei(ß|ss)e|schlecht)\b/g, "nice");
        v = v.replace(/\b(die\sSendung|das\sFormat|das\sV(O|o)D)\b/g, "das Item");
        v = v.replace(/\b(Die\sSendung|Das\sFormat|Das\sV(O|o)D)\b/g, "Das Item");
        v = v.replace(/\b(Sendungen|Formate|V(O|o)D(S|s))\b/g, "Items");
        v = v.replace(/\bbock\b/gi, "B.O.C.K");
        v = v.replace(/\b(?<!k?eine\s)(Lust|Spaß)/g, "Bock");
        v = v.replace(/\bJerk\b/gi, "Jörg");
        v = v.replace(/\bKritiker\b/g, "Hater");
        v = v.replace(/\b(?<![nre]\s)Kritik\b/g, "Hate");
        v = v.replace(/\bdie\sKritik\b/g, "der Hate");
        v = v.replace(/\b((?<!Oktopoden.?)Schurke|Halunke)\b/gi, "Oktopodenschurke");
        v = v.replace(/bohnen\b/g, "böhnchen");
        v = v.replace(/\bBohnen/g, "Böhnchen");
        v = v.replace(/\bTalente\b/g, "Talents");
        v = v.replace(/\b(Dienst|Geschäfts)reise/gi, "Workation");
        v = v.replace(/\bWasser(versorger|lieferant)/gi, "Hydrationspartner");
        v = v.replace(/\b(piss|urinier)/gi, "wutpiss");
        v = v.replace(/\bPunkt\.(?!\s?Isso)/gi, "Punkt. Isso.");
        v = v.replace(/\bIst\s(halt\s)?so\b/g, "Isso");
        v = v.replace(/\bSpace\b/g, "Speiß");
        v = v.replace(/\bS[\.]?P[\.]?A[\.]?C[\.]?E[\.]?\b/g, "S.P.E.I.ß");
        v = v.replace(/\bP(en)?.?(&|and).?P(aper)?\b/g, "Rollenspielexperiment");
        v = v.replace(/\bDienstag\b/gi, "Deanstag");
        v = v.replace(/\bDonnerstag\b/gi, "Donniestag");
        v = v.replace(/B\.?E\.?A?\.?N\.?S\.?/g, "BESN");
        v = v.replace(/\bCirclejerk\b/gi, "Zirkel Jörg");
        v = v.replace(/\bLet('|’|‘)?s(\s|\-)?(P|p)lay(s)?\b/g, "Let’s Playsen");
        v = v.replace(/\blet('|’|‘)?s(\s|\-)?play(s)?\b/g, "let’s playsen");
        v = v.replace(/\b(Ede|Etienne|Edd(ie|y))\b/gi, "Bübchen");
        v = v.replace(/\bSimon\sKrätschmer\b/gi, "Gaming-Legende Simon Krätschmer");
        v = v.replace(/\bSimon(?!\s[A-Z])/g, "MON");
        v = v.replace(/\bKindern?\b/gi, "Lütten");
        v = v.replace(/\bBann\b/gi, "1000-Jahre-Bann");
        v = v.replace(/\bGregor(?!\s?\(?ist\sGrieche\)?)\b/gi, "Gregor (ist Grieche)");
        v = v.replace(/\b(reden|sprechen)\b/g, "schnacken");
        v = v.replace(/\b(auf Malle|auf Mallorca)\b/gi, "Schöööön auf Malle");
        v = v.replace(/\b(Abteilung(en)?|Bereich(e)?)\b/gi, "Gewerke");
        v = v.replace(/\b(?<![a-z]\s)(beruhig dich|nicht aufregen|ganz ruhig|chill mal)\b/gi, "mach dich mal locker, du Affe ey!");
        v = v.replace(/\b(prost|cheers|prosit)\b/gi, "Jámas");
        v = v.replace(/\bBonus/g, "Bohnus");
    
        textNode.nodeValue = v;
    }

    walk(document.getElementsByTagName('body')[0]);
    walk(document.getElementsByTagName('title')[0]);
}());