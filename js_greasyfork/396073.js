// ==UserScript==
// @name         The Xthor Connection @
// @namespace    http://tampermonkey.net/
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js
// @version      1.9.2
// @description  try to take over the world!
// @author       Inconnu
// @run-at       document-idle
// @match        https://xthor.tk/gang.php?id=*
// @match        https://xthor.tk/browse.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396073/The%20Xthor%20Connection%20%40.user.js
// @updateURL https://update.greasyfork.org/scripts/396073/The%20Xthor%20Connection%20%40.meta.js
// ==/UserScript==
(function() {
    migrateCookieSession();
    var GangConf={};
    GangConf["maximal_time"] = null;
    GangConf["minimal_time"] = null;
    GangConf["maximal_price"] = null;
    GangConf["minimal_revenu"] = null;
    GangConf["check_serie"] = null;
    GangConf["hide_serie"] = null;
    GangConf["check_ebook"] = null;
    GangConf["hide_ebook"] = null;
    GangConf["mppd"] = null;
    GangConf["page"] = null;

    GangConf["maximal_time"] = readStringLocalStorage("maximal_time") || 3;
    GangConf["minimal_time"] = readStringLocalStorage("minimal_time") || 1;
    GangConf["maximal_price"] = readStringLocalStorage("maximal_price") || 999999999;
    GangConf["minimal_revenu"] = readStringLocalStorage("minimal_revenu") || 0;
    GangConf["check_serie"] = readStringLocalStorage("check_serie") || "";
    GangConf["hide_serie"] = readStringLocalStorage("hide_serie");
    if (!GangConf["hide_serie"])
    {
        writeLocalStorage("hide_ebook", "14,15,16,17,32,30,34,109");
        GangConf["hide_serie"]= "14,15,16,17,32,30,34,109";
    }
    var list_hideSerie = [];
    if (GangConf["hide_serie"]!="")
    {
        GangConf["hide_serie"]=GangConf["hide_serie"].replace(/\s/g,'');
        list_hideSerie=GangConf["hide_serie"].split(",");
    }

    GangConf["check_ebook"] = readStringLocalStorage("check_ebook") || "";
    GangConf["hide_ebook"] = readStringLocalStorage("hide_ebook");

    if (!GangConf["hide_ebook"])
    {
        writeLocalStorage("hide_ebook", "103,102,116,99,96,24");
        GangConf["hide_ebook"]= "103,102,116,99,96,24";
    }
    var list_hideEbook = [];
    if (GangConf["hide_ebook"]!="")
    {
        GangConf["hide_ebook"]=GangConf["hide_ebook"].replace(/\s/g,'');
        list_hideEbook=GangConf["hide_ebook"].split(",");
    }
    GangConf["mppd"] = readStringLocalStorage("mppd") || 999999999;
    GangConf["page"] = readStringLocalStorage("page") || 0;

    var pourcentageGang = 0.562;
    var CatFLAC=97;
    var CatSerieVF=14;
    var CatSerieVOSTFR=16;

    console.log(GangConf["maximal_time"]);
    console.log(GangConf["minimal_time"]);
    console.log(GangConf["maximal_price"]);
    console.log(GangConf["minimal_revenu"]);

    //initialisation

    var GANG_REGEX = /^https:\/\/xthor\.tk\/gang\.php\?id=\d.*/i;
    var GANG_URL = '#ancri > div > table:nth-child(10)';

    var LISTE_REGEX = /https:\/\/xthor\.tk\/browse\.php.*/i;
    var LISTE_URL = '#ancri > div:nth-child(1) > table:nth-child(19)';


    var startUrl = (GANG_REGEX.test(window.location.href) ? GANG_URL : LISTE_URL);

    start();

    function readStringLocalStorage(name){
        return localStorage.getItem("conf_gang_"+name);
    }

    function readBoolLocalStorage(name){
        return (localStorage.getItem("conf_gang_"+name) == 'true');
    }

    function readListLocalStorage(name){
        value = localStorage.getItem("conf_gang_"+name);
        if (value)
            return value.split(",");
        return;
    }

    function writeLocalStorage(name, value){
        localStorage.setItem("conf_gang_"+name, value);
    }

    function start(){
        $("body").append("<div style='text-align:center;position:fixed;top:25%;left:calc(50% - 100px);z-index:999;width:200px;background-color:gray;display:none;' id='conf_gang_popup'>Revenu Minimal : <input value='"+GangConf["minimal_revenu"]+"'style='max-width:180px'type='number' id='conf_gang_minimal_revenu' name='howmuch'><br>Temps Minimal : <input value='"+GangConf["minimal_time"]+"'style='max-width:180px'type='number' id='conf_gang_minimal_time' name='howmuch'><br>Temps Maximal : <input value='"+GangConf["maximal_time"]+"'style='max-width:180px'type='number' id='conf_gang_maximal_time'name='howmuch'><br>Prix Maximal : <input value='"+GangConf["maximal_price"]+"'style='max-width:180px'type='number' id='conf_gang_maximal_price' name='howmuch'><br>ratio max : <input value='"+GangConf["mppd"]+"'style='max-width:180px'type='number' id='conf_gang_MPPD' name='howmuch'><br>Page auto (1=actif ou 2=actif+gang ou 0=inactif): <input value='"+GangConf["page"]+"'style='max-width:180px'type='number' id='conf_gang_page' name='howmuch'>   <br> Hide Serie VF/VOSTFR: <input "+GangConf["check_serie"]+" id='conf_gang_check_serie' type='checkbox'><input value='"+GangConf["hide_serie"]+"'style='max-width:180px'type='text' id='conf_gang_hide_serie' name='howmuch'>        <br> Hide Ebook: <input "+GangConf["check_ebook"]+" id='conf_gang_check_ebook' type='checkbox'><input value='"+GangConf["hide_ebook"]+"'style='max-width:180px'type='text' id='conf_gang_hide_ebook' name='howmuch'>     <br><span class='separator'>&nbsp;&nbsp;</span><spanv style='color:darkblue;' id='conf_gang_apply'>Apply</span></div>");

        //$("#navbar-stats > div > div").append("<span class='separator'>&nbsp;|&nbsp;</span><spanv style='color:green;' id='conf_gang_view'>Configuration Gang</span>");
        $("#navbar-stats > div > div").prepend("<i class='fa fa-cogs' id='conf_gang_view' style='color:green;' aria-hidden='true'>&nbsp</i><span class='separator'>&nbsp;|&nbsp;</span>&nbsp");
        $(startUrl + '> tbody > tr:first').append("<td colspan='3' style='border: 1px solid #222;background-color: rgba(24,24,24, 0.8);' align='center'><div><i id='majRevenu' class='fa fa-money fa-3'></i>Gang<i id='majAllPrix' class='fa fa-money fa-3'></i>");
        $(startUrl + '> tbody > tr:not(:first)').each(function() {
            $(this).append("<td class='revenu' style='border:1px solid #333333; border-bottom:1px solid #080808;background-color: rgba(45, 45, 45, 0.8);'></td>");
            $(this).append("<td class='prixParDolars' style='border:1px solid #333333; border-bottom:1px solid #080808;background-color: rgba(45, 45, 45, 0.8);'></td>");
            $(this).append("<td class='prix' style='border:1px solid #333333; border-bottom:1px solid #080808;background-color: rgba(45, 45, 45, 0.8);'></td>");
        });


        $(".trtor > td[colspan=12]").parent().remove();

        $(startUrl).attr("style", "min-width: 100%;");
        $("#majRevenu").click (getRevenuListe);
        $("#majAllPrix").click (update);
        $("#conf_gang_apply").click (conf_gang_apply);
        $("#conf_gang_view").click (conf_gang_view);

        if ( !/https:\/\/xthor\.tk\/gang\.php\?id=12.*/.test(window.location.toString())){
            getAllRevenu();
            getAllKnownPrice();

            var url = new URL(window.location.toString());
            var page_param = url.searchParams.get("page");
            if ((GangConf["page"] == "1" || GangConf["page"] == "2") && page_param && page_param!="0")
                changePage();
        }
    }

    function update(){
        showAll();
        getAllRevenu();
        getAllKnownPrice();
        getAllPrice();
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
                        },Math.floor(Math.random() * (GangConf["maximal_time"]*1000 - GangConf["minimal_time"]*1000) + GangConf["minimal_time"]*1000) * j++ );
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
        return $(lui).find('td:nth-child(3) > a').attr("href").replace("details.php?id=","");
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
            if (window.location.toString().indexOf("gang.php")>= 0)
            {
                nextPage = $("#ancri > div > table:nth-child(8) > tbody > tr > td:last-child > a").attr("href");
            }
            else
            {
                nextPage = $("#ancri > div:nth-child(1) > table:nth-child(16) > tbody > tr > td:last-child > a").attr("href");
            }

            if (nextPage != null){
                setTimeout(function(){
                    window.location.replace(nextPage);
                },(Math.floor(Math.random() * (GangConf["maximal_time"]*1000 - GangConf["minimal_time"]*1000) + GangConf["minimal_time"]*1000)));
            }
        }
    }

    function buy(){
        isNew = ($(this).find(".prix").children().attr("class") == "new");
        console.log(isNew);
        $(this).unbind();
        if(isNew){
            $.get("https://xthor.tk/gang.php?tid="+getTorrentID(this));
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
        revenu = parseFloat($(lui).find('.revenu > div').text());
        prixParDolars = (price/revenu).toFixed(1);

        if (parseFloat(prixParDolars) <= parseFloat(GangConf["mppd"])){
        $(lui).find('.prixParDolars').html('<div style="color:DodgerBlue;text-align:center;min-width:60px;">'+(price/revenu).toFixed(1)+'</div>');
        }else if (revenu==0){
            $(lui).find('.prixParDolars').html('<div style="color:DodgerBlue;text-align:center;min-width:60px;">INF</div>');
        }else{
            hide_useless(lui);
        }

        var EventElem = $._data( $(lui).get(0), 'events' );

        //Il n'y a pas d'event
        if (!EventElem)
        {
            $(lui).click(buy);
        }
        /*//Il y a un event, mais ce n'est pas un event click
        else if (!EventElem.click)
        {
            $(lui).click(buy);
        }*/
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
                doc = document.createElement('div');
                doc.innerHTML = result; // This way you have a dom node you can easily manipulate or iterate through
                result = parseFloat($($(doc).find("a[title='Racheter ce torrent']")).text().trim().slice(0,-1).replace(/ +/g, ""));
                window.localStorage.setItem(torrentID,result);
                if ( GangConf["maximal_price"] >= result){
                    showPrice(lui,result,true);
                } else {
                    hide_useless(lui);
                }
            }
        });
    }

    function getRevenu(lui){
        cat = parseInt($($(lui).find('td:nth-child(1) > a')).attr("href").replace(/\D/g, ''));
        seeder = parseInt($($(lui).find('td:nth-child(9) > b > a > font')).text());
        if (!seeder)
            seeder = parseInt($($(lui).find('td:nth-child(9) > font')).text());
        valueCat = window.localStorage.getItem("cat"+cat);

        if ((GangConf["check_serie"]!="" &&  list_hideSerie.indexOf(cat.toString()) >= 0) ||  (GangConf["check_ebook"]!="" &&  list_hideEbook.indexOf(cat.toString()) >= 0 ))
            hide_useless(lui);
        if (!valueCat && cat!=CatFLAC)
        {
            getRevenuListe(false);
            valueCat = window.localStorage.getItem("cat"+cat);
        }

        revenu = (window.localStorage.getItem("cat"+cat) * (isNaN(seeder) ? 0 : seeder) * pourcentageGang).toFixed(1);
        if (parseFloat(GangConf["minimal_revenu"]) <= parseFloat(revenu)){
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
            price = parseFloat(window.localStorage.getItem(torrentID));
            if (!isNaN(price)){
                if ( GangConf["maximal_price"] >= price){
                    showPrice(lui,price,false);
                } else {
                    hide_useless(lui);
                }
            }
        }
    }

    function conf_gang_view(){
        $("#conf_gang_popup").toggle();
    }

    function conf_gang_apply(){

		console.log( $("#conf_gang_minimal_revenu").val());
        writeLocalStorage("minimal_revenu", $("#conf_gang_minimal_revenu").val());

        console.log( $("#conf_gang_minimal_time").val());
        writeLocalStorage("minimal_time", $("#conf_gang_minimal_time").val());

        console.log( $("#conf_gang_maximal_time").val());
        writeLocalStorage("maximal_time", $("#conf_gang_maximal_time").val());

        console.log( $("#conf_gang_maximal_price").val());
        writeLocalStorage("maximal_price", $("#conf_gang_maximal_price").val());

        console.log( $("#conf_gang_MPPD").val());
        writeLocalStorage("mppd", $("#conf_gang_MPPD").val());

        console.log( $("#conf_gang_page").val());
        writeLocalStorage("page", $("#conf_gang_page").val());


        check_serie = $("#conf_gang_check_serie").is(':checked');
        console.log(check_serie);

        if (check_serie)
        {
            writeLocalStorage("check_serie", "checked");
        }
        else
        {
            writeLocalStorage("check_serie", "");
        }

        console.log( $("#conf_gang_hide_serie").val());
        writeLocalStorage("hide_serie", $("#conf_gang_hide_serie").val());


        check_ebook = $("#conf_gang_check_ebook").is(':checked');
        console.log(check_ebook);

        if (check_ebook)
        {
            writeLocalStorage("check_ebook", "checked");
        }
        else
        {
            writeLocalStorage("check_ebook", "");
        }

        console.log( $("#conf_gang_hide_ebook").val());
        writeLocalStorage("hide_ebook", $("#conf_gang_hide_ebook").val());

        $("#conf_gang_popup").toggle();
    }

    function getRevenuListe(async_value=true) {
        $.ajax({
            url: "shop.php?&stats",
            context: document.body,
            async : async_value,
            success: function(result){
                doc = document.createElement('div');
                doc.innerHTML = result; // This way you have a dom node you can easily manipulate or iterate through
                for (var i = 0; i <=61 ; i++) {
                    cat = $($(doc).find("#ancri > div > table:nth-child(10) > tbody > tr:nth-child(" + i + ") > td:nth-child(1)")).text();
                    dolars = parseFloat($($(doc).find("#ancri > div > table:nth-child(10) > tbody > tr:nth-child(" + i + ") > td:nth-child(3)")).text().replace("$",""));
                    window.localStorage.setItem("cat" + cat,dolars);
                    console.log(cat + " " + dolars);
                }
            }
        });
    }

function migrateCookieSession() {
    value_cookie = $.cookie("conf_gang_maximal_time");
    if (value_cookie!=null)
    {
        writeLocalStorage("maximal_time",value_cookie);
        Cookies.remove('conf_gang_maximal_time');
    }

    value_cookie = $.cookie("conf_gang_minimal_time");
    if (value_cookie!=null)
    {
        writeLocalStorage("minimal_time",value_cookie);
        Cookies.remove('conf_gang_minimal_time');
    }

    value_cookie = $.cookie("conf_gang_maximal_price");
    if (value_cookie!=null)
    {
        writeLocalStorage("maximal_price",value_cookie);
        Cookies.remove('conf_gang_maximal_price');
    }

    value_cookie = $.cookie("conf_gang_minimal_revenu");
    if (value_cookie!=null)
    {
        writeLocalStorage("minimal_revenu",value_cookie);
        Cookies.remove('conf_gang_minimal_revenu');
    }

    value_cookie = $.cookie("conf_gang_check_serie");
    if (value_cookie!=null)
    {
        writeLocalStorage("check_serie",value_cookie);
        Cookies.remove('conf_gang_check_serie');
    }

    value_cookie = $.cookie("conf_gang_hide_serie");
    if (value_cookie!=null)
    {
        writeLocalStorage("hide_serie",value_cookie);
        Cookies.remove('conf_gang_hide_serie');
    }

    value_cookie = $.cookie("conf_gang_check_ebook");
    if (value_cookie!=null)
    {
        writeLocalStorage("check_ebook",value_cookie);
        Cookies.remove('conf_gang_check_ebook');
    }

    value_cookie = $.cookie("conf_gang_hide_ebook");
    if (value_cookie!=null)
    {
        writeLocalStorage("hide_ebook",value_cookie);
        Cookies.remove('conf_gang_hide_ebook');
    }

    value_cookie = $.cookie("conf_gang_MPPD");
    if (value_cookie!=null)
    {
        writeLocalStorage("mppd",value_cookie);
        Cookies.remove('conf_gang_MPPD');
    }

    value_cookie = $.cookie("conf_gang_page");
    if (value_cookie!=null)
    {
        writeLocalStorage("page",value_cookie);
        Cookies.remove('conf_gang_page');
    }
}


})();
