// ==UserScript==
// @name          RTU BOT 1.1
// @description   RTU BOT
// @version       1.1
// @namespace     https://tampermonkey.net
// @match         https://rebuildtheuniverse.com
// @downloadURL https://update.greasyfork.org/scripts/23333/RTU%20BOT%2011.user.js
// @updateURL https://update.greasyfork.org/scripts/23333/RTU%20BOT%2011.meta.js
// ==/UserScript==
function mod() {
var GetGreenGlow = function(elemid){

    var iBool = 0;


    if (document.getElementById("tc" + elemid)) {

        var sClassName = document.getElementById("tc" + elemid).className;

        var iPosOfNum = sClassName.search("next_glow");

        if (iPosOfNum > 0) {

            iBool = 1;

        }

    }


    return iBool;

}


var HoleBildUrl = function(elemid){

    var sUrl = null;


    if (elemid >= 0 && elemid <= 74) {


        if (elemid===0) {

            sUrl = "images/quantumfoam.jpg";

        } else {

            sUrl = "images/" + arUnit[elemid-1][11];

        }

    }

    return sUrl;

}


var GetCountForElem = function(elemid){

    var iCount = 0;


    if (document.getElementById("idp" + elemid)) {

        var elemText = document.getElementById("idp" + elemid).textContent;


        var iPosOfNum = elemText.search(":")+2;

        var iLengthOfText = elemText.length;


        iCount = parseInt(elemText.substr(iPosOfNum,iLengthOfText-iPosOfNum));

    }


    return iCount;

}


var autoBuy = function(repeatInterval) {


    var CheckNext = function() {

        for(var k = 74; k >= 0; k--) {

            if (GetGreenGlow(k+1) == 1) {

                tonext(k);

                gritter(toTitleCase(arrayNames[k]), "Next auf " + GetCountForElem(k+1), HoleBildUrl(k),null, null);

                k = -1;

            }

        }

    }


    var CheckNewItems = function() {


        var arrayCount = [GetCountForElem(1),GetCountForElem(2),GetCountForElem(3),GetCountForElem(4),GetCountForElem(5),GetCountForElem(6),GetCountForElem(7),GetCountForElem(8),GetCountForElem(9),GetCountForElem(10)

                          ,GetCountForElem(11),GetCountForElem(12),GetCountForElem(13),GetCountForElem(14),GetCountForElem(15),GetCountForElem(16),GetCountForElem(17),GetCountForElem(18),GetCountForElem(19),GetCountForElem(20)

                          ,GetCountForElem(21),GetCountForElem(22),GetCountForElem(23),GetCountForElem(24),GetCountForElem(25),GetCountForElem(26),GetCountForElem(27),GetCountForElem(28),GetCountForElem(29),GetCountForElem(30)

                          ,GetCountForElem(31),GetCountForElem(32),GetCountForElem(33),GetCountForElem(34),GetCountForElem(35),GetCountForElem(36),GetCountForElem(37),GetCountForElem(38),GetCountForElem(39),GetCountForElem(40)

                          ,GetCountForElem(41),GetCountForElem(42),GetCountForElem(43),GetCountForElem(44),GetCountForElem(45),GetCountForElem(46),GetCountForElem(47),GetCountForElem(48),GetCountForElem(49),GetCountForElem(50)

                          ,GetCountForElem(51),GetCountForElem(52),GetCountForElem(53),GetCountForElem(54),GetCountForElem(55),GetCountForElem(56),GetCountForElem(57),GetCountForElem(58),GetCountForElem(59),GetCountForElem(60)

                          ,GetCountForElem(61),GetCountForElem(62),GetCountForElem(63),GetCountForElem(64),GetCountForElem(65),GetCountForElem(66),GetCountForElem(67),GetCountForElem(68),GetCountForElem(69),GetCountForElem(70)

                          ,GetCountForElem(71),GetCountForElem(72),GetCountForElem(73),GetCountForElem(74),GetCountForElem(75)];


        var MaxLevelProElem = 9;

        var LevelDiffForNext = 5;


        bonusAll();10000


        for(var j = specialsbought; j < 75; j++) {

            specialclick(j);

        }


        for(var i = 75; i >= 1; i--) {

            var a = "tc"+i;

            if(document.getElementById(a)){

                if(document.getElementById(a).style.opacity == 1){


                    if(arrayCount[i-1]<= MaxLevelProElem){

                        calculsclick(i-1);

                        arrayCount[i-1] = ++arrayCount[i-1];

                        gritter(toTitleCase(arrayNames[i-1]), "Von " + (arrayCount[i-1]-1) + " auf " + arrayCount[i-1], HoleBildUrl(i-1), null, null);

                    }

                }

            }

        }


        setTimeout(function(){CheckNext()}, 1000);


    };

    return setInterval(CheckNewItems, repeatInterval);

};

autoBuy(3000);
}
mod()