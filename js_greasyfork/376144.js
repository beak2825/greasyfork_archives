// ==UserScript==
// @name        Xmas Town (old script) 2018
// @namespace   mafia.christmas
// @author      Mafia[610357]
// @description Notification for items near you in christmas town map
// @include     *.torn.com/christmas_town.php
// @version     2018.1.1
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/376144/Xmas%20Town%20%28old%20script%29%202018.user.js
// @updateURL https://update.greasyfork.org/scripts/376144/Xmas%20Town%20%28old%20script%29%202018.meta.js
// ==/UserScript==

'use strict';

this.$ = this.jQuery = jQuery.noConflict(true);

// global CSS
GM_addStyle(`
.pulse {
display: block;
width: 30px !important;
height: 30px !important;
border-radius: 50%;
background: #ffec02;
cursor: pointer;
z-index: 111;
box-shadow: 0 0 0 rgba(204,169,44, 0.4);
animation: pulse 2s infinite;
}
.pulse:hover {
animation: none;
}

@-webkit-keyframes pulse {
0% {
-webkit-box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
background: red;
}
70% {
-webkit-box-shadow: 0 0 0 10px rgba(204,169,44, 0);
background: yellow;
}
100% {
-webkit-box-shadow: 0 0 0 0 rgba(204,169,44, 0);
background: blue;
}
}
@keyframes pulse {
0% {
-moz-box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
background: red;
}
70% {
-moz-box-shadow: 0 0 0 10px rgba(204,169,44, 0);
box-shadow: 0 0 0 10px rgba(204,169,44, 0);
background: yellow;
}
100% {
-moz-box-shadow: 0 0 0 0 rgba(204,169,44, 0);
box-shadow: 0 0 0 0 rgba(204,169,44, 0);
background: blue;
}
}

div#cmasnoti ul li { padding-bottom: 12px; }`
           );

var itemImg = [
    "chests-1",
    "chests-2",
    "chests-3",
    "chests-4",
    "keys-91",
    "keys-92",
    "keys-93",
    "180",
    "638",
    "550",
    "551",
    "552",
    "554",
    "553",
    "555",
    "530",
    "527",
    "210",
    "529",
    "556",
    "528"
];

var itemName = [
    "Wooden Chest",
    "Bronze Chest",
    "Silver Chest",
    "Golden Chest",
    "Bronze Key",
    "Silver Key",
    "Golden Key",
    "Bottle of Beer",
    "Bottle of Christmas Cocktail",
    "Bottle of Kandy Kane",
    "Bottle of Minty Mayhem",
    "Bottle of Mistletoe Madness",
    "Can of Rockstar Rudolph",
    "Can of Santa Shooters",
    "Can of X-MASS",
    "Can of Munster",
    "Bag of Candy Kisses",
    "Bag of Chocolate Kisses",
    "Bag of Chocolate Truffles",
    "Bag of Reindeer Droppings",
    "Bag of Tootsie Rolls"
];

function getItemName(src) {
    arr = src.split("/");
    if(arr[3] == "christmas_town") {
        id = arr[5].replace(".png", "");
    }
    else {
        id = arr[3];
    }

    return itemImg.indexOf(id) != -1 ? itemName[itemImg.indexOf(id)] : "";
}


function getPos(x,y) {
    var myPos = $("span[class^='position']").text().split(",");
    var myX = parseInt(myPos[0]);
    var myY = parseInt(myPos[1]);
    var mycordX = parseInt($(".ct-user:last-child").css("transform").split(",")[4]);
    var mycordY = parseInt($(".ct-user:last-child").css("transform").split(",")[5]);

    diffX = mycordX - parseInt(x);
    diffY = mycordY - parseInt(y);

    convX = Math.round(diffX) / 30;
    convY = Math.round(diffY) / 30;

    posX = parseInt(myX - convX);
    posY = parseInt(myY + convY);

    return posX + "," + posY;

}

function cmasNotification() {

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i].className === 'world ') {
                    var observer2 = new MutationObserver(function(mutations) {


                        if($("div#world").attr('class') == "world ")
                        {


                            var totalItems = $("div.items-layer div.ct-item").length;
                            var totalNPC = $(".npc").length;

                            if(totalItems > 0 && !$("#cmasnoti").is(":visible")){
                                $("#cmasnoti").slideDown(1000);
                            }
                            else if(totalNPC > 0 && !$("#cmasnoti").is(":visible")){
                                $("#cmasnoti span").text('OoPpss !!');
                                $("#cmasnoti").slideDown(1000);
                            }
                            else if(totalItems == 0 && totalNPC == 0) {
                                $("#cmasnoti").slideUp(1000);
                            }

                            setTimeout(() => {
                                $("#cmasnoti ul").empty();
                                var strItem = "";
                                $.each($("div.items-layer div.ct-item"), function() {
                                    $(this).addClass('pulse');
                                    src = $(this).find("img").attr("src");
                                    x = parseInt($(this).css("left"));
                                    y = parseInt($(this).css("top"));
                                    pos = getPos(x,y);
                                    strItem += "<li>You found <strong>" + getItemName(src) + "</strong> [" + $(this).html().replace("position: absolute;", "").replace("max-height: 30px;", "max-height: 22px;").replace("margin: auto;", "margin: -2px 0px;").replace("img", "img alt='"+getItemName(src)+"' title='"+getItemName(src)+"'") + "] at <strong>" + pos + "</strong></li>";
                                });


                                $.each($(".npc"), function() {
                                    x = parseInt($(this).css("transform").split(",")[4]);
                                    y = parseInt($(this).css("transform").split(",")[5]);
                                    pos = getPos(x,y);
                                    npc = $(this).html().replace('class="img-wrap"', 'style="float:left;margin-top:-12px;"');
                                    if(npc.search("santa") != -1) {
                                        strItem += "<li>" + npc + " is around you. Catch him near <strong>" + pos + "</strong></li>";
                                    }
                                    if(npc.search("grinch") != -1) {
                                        strItem += "<li> " + npc + " is around you at <strong>" + pos + "</strong>. <strong>RUN AWAY !!</strong> before he catch you to steal your items. </li>";
                                    }
                                });

                                if(totalNPC > 0 || totalItems > 0) {
                                    $("#cmasnoti span").text('OoPpss !!');
                                    $("#cmasnoti ul").append(strItem);
                                }

                            }, 500);
                        }

                    });
                    var observerTarget2 = $("div#world")[0];
                    var observerConfig2 = { attributes:true, childList: false, characterData: false, subtree: false };
                    observer2.observe(observerTarget2, observerConfig2);


                    $("#cmasnoti ul").empty();
                    var totalItems = $("div.items-layer div.ct-item").length;
                    var totalNPC = $(".npc").length;

                    if(totalItems > 0 && !$("#cmasnoti").is(":visible")){
                        $("#cmasnoti").slideDown(1000);
                    }
                    else if(totalNPC > 0 && !$("#cmasnoti").is(":visible")){
                        $("#cmasnoti span").text('OoPpss !!');
                        $("#cmasnoti").slideDown(1000);
                    }
                    else if(totalItems == 0 && totalNPC == 0) {
                        $("#cmasnoti").slideUp(1000);
                    }

                    var strItem = "";
                    $.each($("div.items-layer div.ct-item"), function() {
                        $(this).addClass('pulse');
                        src = $(this).find("img").attr("src");
                        x = parseInt($(this).css("left"));
                        y = parseInt($(this).css("top"));
                        pos = getPos(x,y);
                        strItem += "<li>You found <strong>" + getItemName(src) + "</strong> [" + $(this).html().replace("position: absolute;", "").replace("max-height: 30px;", "max-height: 22px;").replace("margin: auto;", "margin: -2px 0px;").replace("img", "img alt='"+getItemName(src)+"' title='"+getItemName(src)+"'") + "] at <strong>" + pos + "</strong></li>";
                    });

                    $.each($(".npc"), function() {
                        x = parseInt($(this).css("transform").split(",")[4]);
                        y = parseInt($(this).css("transform").split(",")[5]);
                        pos = getPos(x,y);
                        npc = $(this).html().replace('class="img-wrap"', 'style="float:left;margin-top:-12px;"');
                        if(npc.search("santa") != -1) {
                            strItem += "<li>" + npc + " is around you. Catch him near <strong>" + pos + "</strong></li>";
                        }
                        if(npc.search("grinch") != -1) {
                            strItem += "<li> " + npc + " is around you at <strong>" + pos + "</strong>. <strong>RUN AWAY !!</strong> before he catch you to steal your items. </li>";
                        }
                    });

                    if(totalNPC > 0 || totalItems > 0) {
                        $("#cmasnoti span").text('OoPpss !!');
                        $("#cmasnoti ul").append(strItem);
                    }



                    var games = `<b>Christmas Wreath</b> : 147,53<br/><b>Gingerbread Man</b> : 91,55<br/><b>Hang Man</b> : 119,81<br/><b>Pot (PvP)</b> : 104,67<br/><b>Present Pick</b> : 112,55<br/><b>Santa Claws</b> : 137,79<br/><b>Snowball Shooter</b> : 87,52<br/><b>Word Fixer</b> : 99,54`;
                    var shop = `<b>Beer Shop</b> : 109,68<br/><b>Candy Shop</b> : 147,67<br/><b>Gift Shop</b> : 124,67`;

                    $(".links-header").after(`<a class="new-thread t-clear h c-pointer  line-h24 right " href="#" title="${games}" style="padding-right: 20px;">
<span class="icon-wrap">
<i class="black-star-icon"></i>
</span>
<span id="new-thread">Games</span>
</a>`);
                    $(".links-header").after(`<a class="new-thread t-clear h c-pointer  line-h24 right " href="#" title="${shop}">
<span class="icon-wrap">
<i class="black-star-icon"></i>
</span>
<span id="new-thread">Shops</span>
</a>`);

                    observer.disconnect();
                    break;
                }
            }
        });
    });

    // start listening for changes
    var observerTarget = $("#christmastownroot")[0];
    var observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
    observer.observe(observerTarget, observerConfig);
}


$('div.content-wrapper').prepend(`<div id='cmasnoti' class="m-top10" style="display:none;">
<div class="title-green top-round" role="heading" aria-level="5">
<i class="ct-christmastown-icon"></i>
<span></span>
</div>
<div class="bottom-round cont-gray p10">
<p></p>
<ul></ul>
</div>
<!--div class="clear"></div-->
<hr class="page-head-delimiter m-top10">
</div>`);


if (location.href.indexOf('torn.com/christmas_town.php') !== -1) {
    cmasNotification();
}