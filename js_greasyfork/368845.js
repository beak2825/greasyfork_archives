// ==UserScript==
// @name     HLN Kwaliteitsdebat
// @include  https://*.hln.be/*
// @require  https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @icon     https://www.google.com/s2/favicons?sz=64&domain=hln.be
// @grant    GM_addStyle
// @version 0.0.1.20201024224408
// @namespace https://greasyfork.org/users/188872
// @description Script dat de Kwaliteit (met hoofdletter 'K') voorop plaatst in de commentaren op de website van de Belgische krant "Het Laatste Nieuws".
// @downloadURL https://update.greasyfork.org/scripts/368845/HLN%20Kwaliteitsdebat.user.js
// @updateURL https://update.greasyfork.org/scripts/368845/HLN%20Kwaliteitsdebat.meta.js
// ==/UserScript==

var nbComments = 43;

function replaceComments (jNode)
{
    var comment;
    if (commentIndex == nbComments-1) commentIndex = 0;
    switch (commentNumbers[commentIndex])
    {
        case 0: comment = "Wop wop wop wop wobbeldebob."; break;
        case 1: comment = "Dibbel dibbel drabbel drammel"; break;
        case 2: comment = "Boeboboeboboeboboebobbobobobobobob!"; break;
        case 3: comment = "Derp derp derp durp do buddel bum bum bum."; break;
        case 4: comment = "Wobbel!"; break;
        case 5: comment = "Derp DERP!"; break;
        case 6: comment = "DERP DA TIDDELIE DIRPIE DIRPIE DOM."; break;
        case 7: comment = "BLORK BLORK BLORK BLORK BLORK. BLORK!"; break;
        case 8: comment = "Rabbel rabbel rabbel rabbel rabbel rabbel rabbel rabbel rabbel rabbel rabbel rabbel"; break;
        case 9: comment = "IK BEN AKKOORD MET JAAK VAN DE VIJVER"; break;
        case 10: comment = "haal er nog wat meer binnen allemaal trug den boot op"; break;
        case 11: comment = "Mogt migrasie nooit plaatsgegrepen hebben was veel miserie gespaart."; break;
        case 12: comment = "allemaal een pot nat zakkenvullers!"; break;
        case 13: comment = "Afschaffen en opdoeken."; break;
        case 14: comment = "En wy maar betalen voor ons klyn pensjoentje!"; break;
        case 15: comment = "WAAR ZIJN NU DE LINKSE RATTEN HET BLIJFT STIL AAN DE overkant"; break;
        case 16: comment = "nieuwe belg"; break;
        case 17: comment = "een werkombekwame nieuwe belg"; break;
        case 18: comment = "Welkom in Absurdistan."; break;
        case 19: comment = "Laten we ook nog zijn nonkel moeder, bompa vader en neven en nichtjes naar hier halen in het kader van de gezinshereniging."; break;
        case 20: comment = "Het betreft hier waarschijnlijk een verwarde jongeman."; break;
        case 21: comment = "BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA BARA"; break;
        case 22: comment = "boroboroboroboroboroboroboroboroboroboroboroboroboroboroboroboroboroboroboroboro. Boro!"; break;
        case 23: comment = "bo bo bo bo bo bo bo bo bo bo bo bo bo"; break;
        case 24: comment = "komt er dan geen eind aan het gegraai in de vetpotten van de wet straat"; break;
        case 25: comment = "laat de rechtse rakkers het nu maar eens uitleggen"; break;
        case 26: comment = "Het is de liefdesbaby van Donaat Deriemaeker en Edwin Ysebaert."; break;
        case 27: comment = "JA HALLO DIE mag mijne zolder ook eens komen afstoffen."; break;
        case 28: comment = "OPKUISEN"; break;
        case 29: comment = "Den duits Zou Moeten Terug Keren Hy! Gaf De Mensen Ten Minste Werk."; break;
        case 30: comment = "Nog net de rug van Poetin wassen voor het slapengaan"; break;
        case 31: comment = "de wet geld voor iedereen"; break;
        case 32: comment = "hy zal zijn kostuum wel naar de stomery brengen met zyn blinkende bmw"; break;
        case 33: comment = "... met óns geld!"; break;
        case 34: comment = "Arm België."; break;
        case 35: comment = "de POT verwijd de ketel"; break;
        case 36: comment = "Voor één keer heeft hy gelyk."; break;
        case 37: comment = "In Apeland zijn de bannannefretter's koning."; break;
        case 38: comment = "En toen gingen de paraplu's één voor één open."; break;
        case 39: comment = "Met de grovve borstel er door enbuiten kieper en."; break;
        case 40: comment = "Wie met water in de kelder zit met ratten op zolder."; break;
        case 41: comment = "Buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel buddel!"; break;
        case 42: comment = "De natie moet splitsen in de confederatsie gedaan met melk en honing naar het Zuiden sturen"; break;
    }

    jNode.html(comment);
    commentIndex += 1;
}

function replaceAuthor ()
{
    var authors = document.getElementsByClassName("comments__list-item__author");
    if (authors.length > 0) authors[authors.length-1].innerHTML = "JAAK VAN DE VIJVER";
}

function Randoms(c, l, h)
{
    var count = c,
        min = l,
        max = h,
        nums = {},
        r, len = 0;

    if (max - min < count) count = max - min;

    var getRand = function()
    {
        return Math.floor(Math.random() * (max - min) + min);
    },
    check = function(a)
    {
        return nums[a];
    },
    add = function(a)
    {
        nums[a] = 1;
        commentNumbers.push(a);
        len++;
    };

    (function init()
     {
        if (len == 0) r = getRand();
        else while (check(r = getRand()));
        add(r);

        if (len < count) init();
    })();

    this.get = function()
    {
        return commentNumbers;
    };
}

function waitForKeyElements (selectorTxt, actionFunction, bWaitOnce, iframeSelector)
{
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
    else targetNodes = $(iframeSelector).contents().find (selectorTxt);
    if (targetNodes && targetNodes.length > 0)
    {
        btargetsFound = true;
        targetNodes.each ( function ()
        {
            var jThis = $(this);
            var alreadyFound = jThis.data ('alreadyFound') || false;
            if (!alreadyFound)
            {
                var cancelFound = actionFunction (jThis);
                if (cancelFound) btargetsFound = false;
                else jThis.data ('alreadyFound', true);
            }
        } );
    }
    else
    {
        btargetsFound = false;
    }

    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

    if (btargetsFound && bWaitOnce && timeControl)
    {
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else
    {
        if (!timeControl)
        {
            timeControl = setInterval (function()
            {
                 waitForKeyElements (selectorTxt, actionFunction, bWaitOnce, iframeSelector);
            }, 300);
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}

var commentIndex = 0;
var commentNumbers = [];
var commentPar = "div.comments__list-item__body";
Randoms(nbComments, 0, nbComments);
replaceAuthor();
//if (window.location.hostname == "m.hln.be") commentPar = "p.comment__message";
waitForKeyElements (commentPar, replaceComments);
