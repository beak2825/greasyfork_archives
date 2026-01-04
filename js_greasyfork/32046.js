// ==UserScript==
// @name         Shop Wizard Gallery Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reports usernames which have a certain item in their gallery.
// @author       AyBeCee (clraik)
// @match        http://www.neopets.com/market.phtml*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32046/Shop%20Wizard%20Gallery%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/32046/Shop%20Wizard%20Gallery%20Search.meta.js
// ==/UserScript==


if(document.URL.indexOf("?type=wizard") != -1) {
    var ItemName = "Jelly Chia Plushie";

    var SearchText = document.getElementsByClassName("content")[0].getElementsByClassName("contentModule")[0].getElementsByClassName("contentModuleTable")[0].getElementsByClassName("contentModuleContent")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].getElementsByTagName("table")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].getElementsByTagName("input")[0];
    SearchText.value = ItemName;
    var AreaGallery = document.getElementsByClassName("content")[0].getElementsByClassName("contentModule")[0].getElementsByClassName("contentModuleTable")[0].getElementsByClassName("contentModuleContent")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].getElementsByTagName("table")[0].getElementsByTagName("tr")[1].getElementsByTagName("td")[1].getElementsByTagName("input")[1];
    AreaGallery.checked = true;
    var SearchIdentical = document.getElementsByClassName("content")[0].getElementsByClassName("contentModule")[0].getElementsByClassName("contentModuleTable")[0].getElementsByClassName("contentModuleContent")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].getElementsByTagName("table")[0].getElementsByTagName("tr")[2].getElementsByTagName("td")[1].getElementsByTagName("select")[0];
    SearchIdentical.value = "exact";
    var ButtonSearch = document.getElementsByClassName("content")[0].getElementsByClassName("contentModule")[0].getElementsByClassName("contentModuleTable")[0].getElementsByTagName("div")[0].getElementsByTagName("div")[0].getElementsByTagName("input")[0];

    var ShowFrame = document.getElementsByClassName("content")[0].getElementsByTagName("div")[2].getElementsByTagName("div")[4];
    ShowFrame.style.margin = "0";
    ShowFrame.style.width = "635px";
    ShowFrame.innerHTML = '<iframe style="width: 100%; height: 300px" name="InFrame" id="InFrame"></iframe>';
    var Fooooot = document.getElementsByClassName("footer")[0];
    Fooooot.innerHTML = '<base target="InFrame">';
}

$('#InFrame').ready(function(){
    if(document.body.innerText.indexOf("Searching for") !== -1){
        $('#ban').remove();
        $('#header').remove();
        $('#footer').remove();
        $('#pushdown_banner_btf').remove();
        $('.sidebar').remove();
        document.getElementsByClassName("content")[0].getElementsByTagName("div")[0].style.display = "none";
        document.getElementsByClassName("content")[0].getElementsByTagName("div")[2].getElementsByClassName("medText")[0].style.display = "none";
        document.getElementsByClassName("content")[0].getElementsByTagName("div")[2].getElementsByTagName("b")[2].style.display = "none";
        document.getElementsByClassName("content")[0].getElementsByTagName("div")[2].getElementsByTagName("table")[0].style.display = "none";
        document.getElementsByClassName("content")[0].getElementsByTagName("div")[2].getElementsByTagName("center")[0].style.display = "none";

        var removeText = document.getElementsByClassName("content")[0].getElementsByTagName("div")[2];
        removeText.style.width = "100%";
        removeText.id = "removeText2";

        $('#removeText2').find('b:contains("Shop Wizard")').remove();
        $('#removeText2').find('br').remove();

        $("#removeText2").contents().filter(function () {
            return this.nodeType === 3;
        }).remove();

        var headerAlt = document.getElementsByClassName('contentModuleHeaderAlt');
        for (var headerAlt2=0;headerAlt2<headerAlt.length; headerAlt2++) {
            headerAlt[headerAlt2].style.display = "none";
        }

        var JuicyBit = document.getElementsByClassName("content")[0].getElementsByTagName("div")[2].getElementsByTagName("table")[1];
        JuicyBit.id = "JuicyBit2";

        $("#JuicyBit2").css({
            "width": "100%",
        });
        $("#JuicyBit2 tr").css({
            "display": "block",
        });
        $("#JuicyBit2 td:nth-child(2),#JuicyBit2 td:nth-child(3),#JuicyBit2 td:nth-child(4)").css({
            "display": "none"
        });
        $("#main").css({
            "border": "0",
            "margin": "0",
            "width": "100%",
        });
        $("#content").css({
            "width": "100%"
        });
        $(".content").css({
            "padding": "0",
        });
    }
});