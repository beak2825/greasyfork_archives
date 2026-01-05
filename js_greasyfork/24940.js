// ==UserScript==
// @name         SteamGifts - User info
// @namespace    RoWoSoft.com
// @version      1.0
// @description  Show extra info of the user (Like Contributor Level, Gift ratio) and keep the header always on top when scrolling
// @author       RoWo Soft
// @match        https://www.steamgifts.com/
// @match        https://www.steamgifts.com/giveaways/search*
// @match        https://www.steamgifts.com/giveaways/search?type=wishlist*
// @match        https://www.steamgifts.com/giveaways/search?type=recommended*
// @match        https://www.steamgifts.com/giveaways/search?type=group*
// @match        https://www.steamgifts.com/giveaways/search?type=new*
// @icon         https://cdn.steamgifts.com/img/favicon.ico
// @copyright    2016+, RoWoSoft.com
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/24940/SteamGifts%20-%20User%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/24940/SteamGifts%20-%20User%20info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".giveaway__username").each(function( ) {
        getReference( this );
    });

    var link_string = '<a href="#" onclick="return false;" class="short-enter-leave-link"><i class="fa"></i> <span></span></a>';
    var vote_all_string = '<button id="vote_all" href="#" onclick="return false;"><i class="fa fa-plus"></i> Run</button>';
    var sort_string = '<button id="sort" onclick="return false;">Sort</button>';
    //var gamesArray;

    var giveaways = $('.giveaway__row-inner-wrap');
    var vote_all_button = $(vote_all_string);
    $('.page__heading div').after(vote_all_button);
    var sort_button = $(sort_string);
    $('.pinned-giveaways__outer-wrap').before(sort_button);

    var result = "Hand of Fate,Tamriel,Tempest,Oxenfree,RimWorld,Stonehearth,Parkitect,Battleborn,The Culling,Stellaris,Pillars of Eternity,ARK: Survival Evolved,";
    result = result + "3: Wild Hunt,Golf With Your Friends,Roguelands,ShellShock Live,Banished,Apollo4x,Foosball,Evoland,X3,Endless Legend,Windward,Saints Row,Age of Mythology,";
    result = result + "Colonies Online,Watch_Dogs,StarDrive,Ziggurat,Original Sin,Mortal Kombat,Heroes of Might,Command & Conquer,Euro Truck Simulator,";
    result = result + "Injustice: Gods Among Us Ultimate Edition,Age of Wonders III,batman,Verdun,Sonic,Starbound,Costume Quest,of orcs and men,Grand Theft Auto,Castle Story,";
    result = result + "Sid Meier's Civilization,The Binding of Isaac: Rebirth,Two Worlds II,Gish,Delver,Interplanetary,Ori and the Blind Forest,Men of War,Supreme Commander,";
    result = result + "Dying light,Vessel,FortressCraft,Pripyat,Killing Floor,Magicite,Prince of Persia,Battlefield,QUAKE,Star Ruler,Worms,Soccer Rage,Prepare To Die,";
    result = result + "Dead Island,Dwelvers,Medal of Honor,Borderlands,Call of Duty,Kerbal Space Program,Conflicks,Modular Vehicle Combat,Blood Bowl,Xenonauts,Gang Beasts,";
    result = result + "Fallout 4,Plastiland,Toybox Turbos,Full Bore,Telltale,Carmageddon";

    var wantedArray = result.split( ",");

    var bool = true;

    giveaways.each(function (idx, elem) {
        var j = $(elem);

        var ratio = j.find("#userLevel").text();
        var level = ratio.split("Level: ")[1];

        if(level<1.00){
            return;
        }

        var href = $(j.find('.giveaway__heading__name')).attr('href');
        var details = j.find('.giveaway__heading__thin').text();

        var detailsMatch = details.match(/(\(([0-9]*)\sCopies\))?\s?\(([0-9]*)P\)/);

        var copies = detailsMatch[2] === undefined ? 1 : detailsMatch[2];
        var cost = detailsMatch[3];

        var entry = j.find('.giveaway__links').find('span').text();
        var entries = entry.split(" entries")[0].replace(",","");

        if (entries == '0')
            entries = 1;

        var time = j.find('.giveaway__columns').find('span:first').attr('data-timestamp');
        var now = Math.round(Date.now() / 1000);
        var diff = time - now;

        var name = j.find('.giveaway__heading__name').text();
        var score = (copies * cost) / ((diff / 60) * entries) * 20000000;

        for(var x=0; x<wantedArray.length;x++){
            if(wantedArray[x].includes(name)){
                score = score + 999999;
            }
        }

        var l = $(link_string);
        l.attr('data-link', href);
        l.attr('data-cost', cost);
        l.attr('data-copies', copies);
        score = Math.round( score );
        j.after(' (<span id="score">' + score + '</span> <span id="diff">' + diff + '</span>)');
        l.attr('data-score', score);
        var faded = j.hasClass('is-faded');
        l.find('span').text(faded ? 'Leave' : 'Enter');

        l.addClass(faded ? 'leave' : '');
        l.find('.fa').addClass(faded ? 'fa-minus' : 'fa-plus');

        j.find('.giveaway__links').append(l);

    });

    var links = $('.short-enter-leave-link');

    links.click(function (e) {
        var elem = $(this);

        var url = elem.attr('data-link');

        $.ajax(url, {
            complete: function (data, code) {
                var f = $(data.responseText).find('div[data-do="entry_insert"], div[data-do="entry_delete"]').closest('form').serializeArray();

                var wasLeave = elem.hasClass('leave');
                f[1].value = wasLeave ? "entry_delete" : "entry_insert";

                $.ajax('/ajax.php', {
                    data: f,
                    method: 'POST',
                    complete: function (data1, code1) {
                        if(data1.responseText === "") return;

                        var d = JSON.parse(data1.responseText);
                        if(d.type === "success")
                        {
                            elem.toggleClass('leave');
                            elem.closest('.giveaway__row-inner-wrap').toggleClass("is-faded");
                            elem.find('span').text(elem.hasClass('leave') ? 'Leave' : 'Enter');
                            elem.find('.fa').removeClass('fa-plus fa-minus').addClass(elem.hasClass('leave') ? 'fa-minus' : 'fa-plus');
                            $('.nav__points').text(d.points);
                        }
                    }
                });
            }
        });
    });

    $('#sort').click(function () {
        var games = $('.giveaway__row-outer-wrap');
        var sortedGames = games.toArray().sort(function(a, b) {
            var ac = parseInt($(a).find('#score').text( ));
            var bc = parseInt($(b).find('#score').text( ));

            if(ac > bc) {
                return -1;
            }
            else if(ac === bc) {
                return 0;
            }
            else {
                return 1;
            }
        });

        for(var i = 0; i <sortedGames.length; i++){
            var j = $(sortedGames[i]);
            j.find('.giveaway__heading__name').text();
            //$(j.find('.giveaway__heading__name')).attr('href');
            $('.pinned-giveaways__outer-wrap').before(sortedGames[i]);
            //$('.page__heading').after(games[i]);
        }
    });


    $('#vote_all').click(function () {

        var elements = links.not('.leave')
        .toArray()
        .sort(function(a, b) {
            var ac = parseInt($(a).attr('data-score'));
            var bc = parseInt($(b).attr('data-score'));

            if(ac > bc) {
                return -1;
            }
            else if(ac === bc) {
                return 0;
            }
            else {
                return 1;
            }
        });
        elements[0].click();
    });

    $('.pinned-giveaways__button').click( );
    $('#sort').click( );
})();

$(window).scroll(function(){
    $('header').css('position','fixed').css('top','0').css('width','100%').css('z-index','10');
});

function getReference( that ){

    $.get("https://www.steamgifts.com" + $( that ).attr("href"), function(data) {

        var userLevel = $(".fa-circle", data).first().parent().attr("title");
        if (userLevel === undefined)
            userLevel = 0.0;

        var won = $( "div.featured__table__row__right:eq(5)", data ).text().split(" ")[0];
        //alert(won);
        var sent = $( "div.featured__table__row__right:eq(6)", data ).text().split(" ")[0].replace("," , "");
        //alert(sent);
        //alert("Ratio: " + won + "/" + sent);
        if (sent > 0 ){
            if(won>0){
                var ratio = Math.round(sent / won * 100) / 100;
                $( that ).after(' (<span id="userLevel">Level: ' + userLevel + '</span><span id="ratio"> Ratio: ' + ratio + '</span>)');
            }
            else{
                $( that ).after(' (<span id="userLevel">Level: ' + userLevel + '</span><span id="ratio"> Ratio: ∞ </span>)');
            }
            //$( that ).after(' (<span id="userLevel">Level: ' + userLevel + '</span>' + ' Won: ' + won + ' Sent: ' + sent + '<span id="ratio"> Ratio: ' + ratio + '</span>)');
        }
        else{
            $( that ).after(' (<span id="userLevel">Level: ' + userLevel + '</span><span id="ratio"> Ratio: 0.00</span>)');
        }
    });
}