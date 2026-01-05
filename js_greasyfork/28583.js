// ==UserScript==
// @name         The Xthor Connection
// @namespace    http://tampermonkey.net/
// @version      1.7.0
// @description  try to take over the world!
// @author       Mystere
// @match        https://xthor.bz/gang.php?id=*
// @match        https://xthor.bz/browse.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28583/The%20Xthor%20Connection.user.js
// @updateURL https://update.greasyfork.org/scripts/28583/The%20Xthor%20Connection.meta.js
// ==/UserScript==
(function() {
    var maxTime = $.cookie("conf_gang_maximal_time") || 3;
    var minTime = $.cookie("conf_gang_minimal_time") || 1;
    var maxPrice = $.cookie("conf_gang_maximal_price") || 999999999;
    var revenuMin = $.cookie("conf_gang_minimal_revenu") || 0;
    var maxPrixParDolars = $.cookie("conf_gang_MPPD") || 999999999;
    var pourcentageGang = 0.25;

    console.log(maxTime);
    console.log(minTime);
    console.log(maxPrice);
    console.log(revenuMin);

    //initialisation

    var GANG_REGEX = /^https:\/\/xthor\.bz\/gang\.php\?id=\d.*/i;
    var GANG_URL = '#ancri > div > table:nth-child(10)';

    var LISTE_REGEX = /https:\/\/xthor\.bz\/browse\.php.*/i;
    var LISTE_URL = '#ancri > div > div.article > table:nth-child(10)';

    var startUrl = (GANG_REGEX.test(window.location.href) ? GANG_URL : LISTE_URL);

    start();

    function start(){
        $("body").append("<div style='text-align:center;position:fixed;top:50%;left:calc(50% - 100px);z-index:999;width:200px;background-color:gray;display:none;' id='conf_gang_popup'>Revenu Minimal : <input value='"+$.cookie("conf_gang_minimal_revenu")+"'style='max-width:180px'type='number' id='conf_gang_minimal_revenu' name='howmuch'><br>Temps Minimal : <input value='"+$.cookie("conf_gang_minimal_time")+"'style='max-width:180px'type='number' id='conf_gang_minimal_time' name='howmuch'><br>Temps Maximal : <input value='"+$.cookie("conf_gang_maximal_time")+"'style='max-width:180px'type='number' id='conf_gang_maximal_time'name='howmuch'><br>Prix Maximal : <input value='"+$.cookie("conf_gang_maximal_price")+"'style='max-width:180px'type='number' id='conf_gang_maximal_price' name='howmuch'>ratio max : <input value='"+$.cookie("conf_gang_MPPD")+"'style='max-width:180px'type='number' id='conf_gang_MPPD' name='howmuch'></div>");
        $("#navbar-stats > div > div").append("<span class='separator'>&nbsp;|&nbsp;</span><spanv style='color:green;' id='conf_gang'>Configuration Gang</span>");
        $(startUrl + '> tbody > tr:first').append("<td colspan='3' style='border: 1px solid #222;background-color: rgba(24,24,24, 0.8);' align='center'><div><i id='majRevenu' class='fa fa-money fa-3'></i>Gang<i id='majAllPrix' class='fa fa-money fa-3'></i>");
        $(startUrl + '> tbody > tr:not(:first)').each(function() {
            $(this).append("<td class='revenu' style='border:1px solid #333333; border-bottom:1px solid #080808;background-color: rgba(45, 45, 45, 0.8);'></td>");
            $(this).append("<td class='prixParDolars' style='border:1px solid #333333; border-bottom:1px solid #080808;background-color: rgba(45, 45, 45, 0.8);'></td>");
            $(this).append("<td class='prix' style='border:1px solid #333333; border-bottom:1px solid #080808;background-color: rgba(45, 45, 45, 0.8);'></td>");
        });

        for (var i = 0; i <= $(".icarousel").children().length-2; i++) {
            lui = $("#icarousel").children()[i];
            $(lui).append("<br><select><option value='0'>0</option><option value='1'>1'000'000</option><option value='5'>5'000'000</option><option value='10'>10'000'000</option><option value='100'>100'000'000</option></select>");
            $(lui).css("height","170px");
        }
        $("#ancri > div > div.layer.colheadd").append("<span id='sendMoney'>Send</span>");


        $(".trtor > td[colspan=12]").parent().remove();

        $(startUrl).attr("style", "min-width: 100%;");
        $("#majRevenu").click (getRevenuListe);
        $("#majAllPrix").click (update);
        $("#conf_gang").click (conf_gang);
        $("#sendMoney").click (sendMoney);

        if (!/https:\/\/xthor\.bz\/gang\.php\?id=12.*/.test(window.location.toString())){
            getAllRevenu();
            getAllKnownPrice();
            changePage();
        }
    }

    function update(){
        showAll();
        getAllRevenu();
        getAllKnownPrice();
        getAllPrice();
    }

    function sendMoney(){
        var nombreTotal = 0;
        for (var i = 0; i <= $(".icarousel").children().length-2; i++) {
            nombre = parseInt($($(".icarousel").children()[i]).find("select :selected").val());
            userID = $($(".icarousel").children()[i]).find("span > a").attr("href").replace("https://xthor.bz/userdetails.php?id=","");
            console.log(userID);
            if ( userID != null){
                for ( var j = 0; j < nombre;j++){
                    (function(){
                        var USERID = userID;
                        var J = j;
                        var NOMBRETOTAL = nombreTotal;
                        setTimeout(function(){
                            $.post("https://xthor.bz/userdetails.php?id="+USERID, {"bonusgift":1000000.0,"submit":"Donner"});
                            // console.log(USERID + "  " + J);
                        },200*(J+1)+(NOMBRETOTAL*200));
                    })();
                }
            }
            nombreTotal += nombre;
        }
    }

    function getAllPrice(){
        for (var i = 1, j = 0; i <= $(".trtor").length-1; i++) {
            var lui = $($(".trtor")[i]);
            torrentID = getTorrentID(lui);
            if (!isHide(lui)){
                if (window.localStorage.getItem(torrentID) == null){
                    (function() {
                        var LUI = lui;
                        setTimeout(function(){
                            getPrice(LUI);
                        },Math.floor(Math.random() * (maxTime*1000 - minTime*1000) + minTime*1000) * j++ );
                    })();
                }
            }
        }
    }

    function showAll(){
        for (var i = 1; i <= $(".trtor").length-1; i++) {
            var lui = $($(".trtor")[i]);
            $(lui).attr("style","");
        }
    }

    function hide_useless(lui){
        $(lui).attr('style', 'display:none;');
        console.log(lui);
    }

    function getTorrentID(lui){
        return $(lui).find('td:nth-child(7) > a').attr("href").replace("snatches_xbt.php?id=","");
    }

    function isHide(lui){
        return ($(lui).attr("style") == "display:none;");
    }

    function isAllHide(){
        result = true;
        for (var i = 1, j = 0; i <= $(".trtor").parent().children("tr").length-1; i++) {
            var lui = $($(".trtor").parent().children("tr")[i]);
            if (!isHide(lui)){
                result = false;
                break;
            }
        }
        return result;
    }

    function changePage(){
        if(isAllHide()){
            nextPage = $("td.pager:last-child > a").attr("href");
            if (nextPage != null){
                setTimeout(function(){
                    window.location.replace(nextPage);
                },(Math.floor(Math.random() * (maxTime*1000 - minTime*1000) + minTime*1000)));
            }
        }
    }

    function buy(){
        isNew = ($(this).find(".prix").children().attr("class") == "new");
        console.log(isNew);
        $(this).unbind();
        if(isNew){
            $.get("https://xthor.bz/gang.php?tid="+getTorrentID(this));
            hide_useless(this);
        }
        else {
            getPrice(this);
        }
    }
    function showPrice(lui,price,newPrice){
        if (newPrice){
            $(lui).find('.prix').html('<div class="new" style="text-align:center;min-width:60px;color:green;">'+price+'</div>');
        } else {
            $(lui).find('.prix').html('<div class="cache" style="text-align:center;min-width:60px;color:yellow;">'+price+'</div>');
        }
        revenu = parseInt($(lui).find('.revenu > div').text());
        prixParDolars = (price/revenu).toFixed(1);

        if (prixParDolars <= maxPrixParDolars){
        $(lui).find('.prixParDolars').html('<div style="color:DodgerBlue;text-align:center;min-width:60px;">'+(price/revenu).toFixed(1)+'</div>');
        }else{
            hide_useless(lui);
        }
        $(lui).click(buy);
    }

    function showRevenu(lui,revenu){
        $(lui).find('.revenu').html('<div style="color:green;text-align:center;min-width:60px;">'+revenu+'</div>');
    }

    function getPrice(lui){
        torrentID = getTorrentID(lui);
        $.ajax({
            url: "details.php?id="+torrentID,
            context: document.body,
            async : true,
            success: function(result){
                doc = document.implementation.createHTMLDocument("");
                doc.write(result);
                result = parseInt($($(doc).find("a[title='Racheter ce torrent']")).text().trim().slice(0,-1));
                window.localStorage.setItem(torrentID,result);
                if ( maxPrice >= result){
                    showPrice(lui,result,true);
                } else {
                    hide_useless(lui);
                }
            }
        });
    }

    function getRevenu(lui){
        cat = parseInt($($(lui).find('td:nth-child(1) > a')).attr("href").replace(/\D/g, ''));
        seeder = parseInt($($(lui).find('td:nth-child(8) > b > a > font')).text());
        revenu = (window.localStorage.getItem("cat"+cat) * (isNaN(seeder) ? 0 : seeder) * pourcentageGang).toFixed(1);
        if (parseInt(revenuMin) <= parseInt(revenu)){
            showRevenu(lui,revenu);
        } else {
            hide_useless(lui);
        }
    }

    function getAllRevenu(){
        for (var i = 1, j = 0; i <= $(".trtor").length-1; i++) {
            var lui = $($(".trtor")[i]);
            getRevenu(lui);
        }
    }

    function getAllKnownPrice(){
        for (var i = 1, j = 0; i <= $(".trtor").length-1; i++) {
            var lui = $($(".trtor")[i]);
            torrentID = getTorrentID(lui);
            price = parseInt(window.localStorage.getItem(torrentID));
            if (!isNaN(price)){
                if ( maxPrice >= price){
                    showPrice(lui,price,false);
                } else {
                    hide_useless(lui);
                }
            }
        }
    }


    function conf_gang(){
        $.cookie("conf_gang_minimal_revenu", $("#conf_gang_minimal_revenu").attr("value") , {expires: new Date(2020, 10, 29, 11, 0, 0), secure: true});
        $.cookie("conf_gang_minimal_time", $("#conf_gang_minimal_time").attr("value") , {expires: new Date(2020, 10, 29, 11, 0, 0), secure: true});
        $.cookie("conf_gang_maximal_time", $("#conf_gang_maximal_time").attr("value") , {expires: new Date(2020, 10, 29, 11, 0, 0), secure: true});
        $.cookie("conf_gang_maximal_price", $("#conf_gang_maximal_price").attr("value") , {expires: new Date(2020, 10, 29, 11, 0, 0), secure: true});
        $.cookie("conf_gang_MPPD", $("#conf_gang_MPPD").attr("value") , {expires: new Date(2020, 10, 29, 11, 0, 0), secure: true});
        
        $("#conf_gang_popup").toggle();
    }

    function getRevenuListe() {
        $.ajax({
            url: "shop.php?&stats",
            context: document.body,
            async : true,
            success: function(result){
                doc = document.implementation.createHTMLDocument("");
                doc.write(result);
                for (var i = 0; i <=52 ; i++) {
                    cat = $($(doc).find("#ancri > div > table > tbody > tr:nth-child(" + i + ") > td:nth-child(1)")).text();
                    dolars = parseFloat($($(doc).find("#ancri > div > table > tbody > tr:nth-child(" + i + ") > td:nth-child(3)")).text().replace("$",""));
                    window.localStorage.setItem("cat" + cat,dolars);
                    console.log(cat + " " + dolars);
                }
            }
        });
    }
})();
