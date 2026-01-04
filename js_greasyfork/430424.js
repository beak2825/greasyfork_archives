// ==UserScript==
// @name         [MR] Popmundo Utilities
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Some gameplay improvements and shorcuts for popmundo.
// @author       Serhat Yücel A.K.A Matt Revolve (1736266)
// @match        https://*.popmundo.com/*
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js

// @downloadURL https://update.greasyfork.org/scripts/430424/%5BMR%5D%20Popmundo%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/430424/%5BMR%5D%20Popmundo%20Utilities.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location.href;
    const orig = window.location.origin;

    progressBarPercentages();
    controlPhoneCall();
    const blocked_char_list = ["3513487"];

    if(url.includes("/Locale/ItemsEquipment")){
        showHideOnlyYourItemsPrepare();
    }else if(url.includes("/Interact/Phone")) {
        //mobilePhoneCallAutoChosenCombo();
    }else if(url.includes("/Character/OfferItem")) {
        hideOfferedItem();
    }else if(url.includes("/City") && $("#ctl00_cphLeftColumn_ctl00_lnkAirport").length > 0) {
        addCityShortcuts();
    }else if(url.includes("/Character/Relations/") && $("#mnuToolTipImproveCharacter").length != 0) {
        //relationLinkToPhoneCall();
        makePhoneCalls();
    }else if(url.includes("/Character/Diary/")) {
        //countKilledZombies();
    }else if(url.includes("/Character/Items")) {
        inventoryUtility();
    }else if(url.includes("/Forum/Popmundo.aspx/Thread/")) {
        bbcodeGenerator();
    }

    function bbcodeGenerator() {
        $(".forumMessageHeader a:first-child").each(function() {
            const charName = $(this).text().trim();
            const charid = $(this).attr("href").split("/").slice(-1)[0].trim();
            $(this).before(`<img src="/Static/Icons/TinyHide_White.png" class="mr_bbcode" data="[charid=${charid} name=${charName}]">`);
            //$(this).before(`<img src="/Static/Icons/TinyHide_White.png" class="mr_bbcode" data="!sonuç ${charid}">`);
        });

        $(".mr_bbcode").on('click',function() {
            const str = $(this).attr("data");
            const el = document.createElement('textarea');
            el.value = str;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        });
    }

    function inventoryUtility() {
        if($("#ctl00_cphLeftColumn_ctl00_chkThrowAwaySelItems").length > 0) {
            $("#ctl00_cphLeftColumn_ctl00_chkThrowAwaySelItems").click();
        }
    }

    function countKilledZombies() {
        var zombieCount = 0;
        $(".diaryExtraspace li").each(function() {
            let diaryText = $(this).text().trim();

            if(diaryText.length < 100) {
               if(diaryText.includes("zombiyi cehenneme geri gönderdim!")){
                   console.log(diaryText);
                   diaryText = diaryText.replace(" zombiyi cehenneme geri gönderdim!","").trim();
                   diaryText = diaryText.replace("BOOM! El bombasıyla ","").trim();
                   zombieCount += parseInt(diaryText.trim());
               }else if(diaryText.includes("Stormswinger enerjimi biraz tazeledi")) {
                   console.log(diaryText);
                   diaryText = diaryText.replace("Stormswinger enerjimi biraz tazeledi ve ","");
                   diaryText = diaryText.replace(" zombiyi katletmemden memnun görünüyor.","");
                   zombieCount += parseInt(diaryText.trim());

               }
            }

        });


        console.log(zombieCount);
    }

    function showHideOnlyYourItemsPrepare() {
        if(localStorage.getItem("ONLY_YOUR_ITEMS") == null) {
            localStorage.setItem("ONLY_YOUR_ITEMS", 0);
        }

        $("#checkedlist").before('<a href="#" style="display:block; margin-bottom:15px;" id="showHideOnlyYourItems">Alınabilecek Eşyaları Göster/Gizle</a>');
        showHideOnlyYourItems();

        $("#showHideOnlyYourItems").on('click', function() {
            if(localStorage.getItem("ONLY_YOUR_ITEMS") == 1){
                localStorage.setItem("ONLY_YOUR_ITEMS", 0);
            }else {
                localStorage.setItem("ONLY_YOUR_ITEMS", 1);
            }

            showHideOnlyYourItems();
        });

    }


    function showHideOnlyYourItems() {

        $("#checkedlist tr:not(:first-child)").each(function() {
            if(localStorage.getItem("ONLY_YOUR_ITEMS") == 1) {
                if($(this).find("td:first").find("input").length < 2 && $(this).attr("class") != "group") {
                    $(this).hide();
                }
            }else {
                $(this).show();
            }
        });
    }


    function progressBarPercentages() {

        let classNames  = [{"class": ".progressBar", "child": null},
                           {"class": ".greenProgressBar", "child": null},
                           {"class": ".blueProgressBar", "child": null},
                           {"class": ".plusMinusBar", "child": ".negholder"}];

        classNames.forEach(function(element) {
            $(element.class).each(function() {
                let percent = $(this).attr("title");
                if(percent.includes(' ')){
                    percent = percent.split(' ').slice(-1)[0] ;
                }

                if(element.child == null) {
                    $(this).prepend('<div style="float: left; font-size: 9px;">'+percent+'</div>');
                }else{
                    $(this).find(element.child).prepend('<div style="float: left; font-size: 9px;">'+percent+'</div>');
                }

            });
        });
    }

    function mobilePhoneCallAutoChosenCombo(type = -1) {
        if($("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes").length > 0 && url.includes("/Interact/Phone/")) {
            if(type == 1){
                $("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes").val("24"); // Geriye naber demek kaldı...
            }else if($("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes option[value='165']").length > 0) { //Aşk meşk varsa onu seç.
                $("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes").val("165");
            }else if($("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes option[value='73']").length > 0) { //Telefonda yaz varsa o da olur
                $("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes").val("73");
            }else{
                $("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes").val("24"); // Geriye naber demek kaldı...
            }
            

        }
    }

    function hideOfferedItem() {
        console.log(localStorage.getItem("MR_HIDE_OFFERRED_ITEM_CHCKBOX"));
        if(localStorage.getItem("MR_HIDE_OFFERRED_ITEM_CHCKBOX") == null) {
            localStorage.setItem("MR_HIDE_OFFERRED_ITEM_CHCKBOX", 0);
        }

        var offerredItemList = {"offred_item_list": []};

        if(localStorage.getItem("MR_HIDE_OFFERRED_ITEM_LIST") == null) {
            localStorage.setItem("MR_HIDE_OFFERRED_ITEM_LIST", JSON.stringify(offerredItemList));
        }else{
            offerredItemList = JSON.parse(localStorage.getItem("MR_HIDE_OFFERRED_ITEM_LIST"));
            console.log(offerredItemList);
        }

        var checked = localStorage.getItem("MR_HIDE_OFFERRED_ITEM_CHCKBOX") == 1 ? 'checked' : '';

        $("#ctl00_cphLeftColumn_ctl00_chkDelivery").parent().before("<p><input id='mr_hideoffere_item_checkbox' type='checkbox' "+checked+"><label for='mr_hideoffere_item_checkbox'>Teklif edince listeden kaldır</label></p>");

        $("#ctl00_cphLeftColumn_ctl00_ddlItem > option").each(function() {
            if(offerredItemList.offred_item_list.includes($(this).val()) && localStorage.getItem("MR_HIDE_OFFERRED_ITEM_CHCKBOX") == 1){
                $(this).remove();
            }
        });


        $("#mr_hideoffere_item_checkbox").change(function() {
            if(this.checked) {
                localStorage.setItem("MR_HIDE_OFFERRED_ITEM_CHCKBOX", 1);
            }else{
                localStorage.setItem("MR_HIDE_OFFERRED_ITEM_CHCKBOX", 0);
            }
        });

        $("#ctl00_cphLeftColumn_ctl00_btnGive").on('click', function() {
            if(localStorage.getItem("MR_HIDE_OFFERRED_ITEM_CHCKBOX") == 1){
                var itemId = $("#ctl00_cphLeftColumn_ctl00_ddlItem").val();
                var offeredItemList = JSON.parse(localStorage.getItem("MR_HIDE_OFFERRED_ITEM_LIST"));
                offeredItemList.offred_item_list.push(itemId);
                localStorage.setItem("MR_HIDE_OFFERRED_ITEM_LIST", JSON.stringify(offeredItemList));

            }
        });



    }

    function getCityProps(cityId) {
        var props =  {
            "8": { home:3161145, path: {place: 49089, name: "Breskens", duration:90 } },
            "35": { home:3198434, path: {place: 249590, name: "Hatay", duration:65 } },
            "61": { home:3263617, path: {place: "", name: "", duration:"" } },
            "58": { home:3230603, path: {place: "", name: "", duration:"" } },
            "9": { home:3159414, path: {place: 49090, name: "Costa Brava", duration:20 } },
            "36": { home:3218479, path: {place: 282985, name: "Srebrno", duration:95 } },
            "7": { home:3231072, path: {place: 233224, name: "Schliemann's Zimmer", duration:10 } },
            "33": { home:2965425, path: {place: 188643, name: "Blankenberge", duration: 95 } },
            "46": { home:3198948, path: {place: 773546, name: "Constanţa", duration:95 } },
            "42": { home:3231282, path: {place: 653963, name: "Tisza", duration:90 } },
            "17": { home:3161537, path: {place: 49095, name: "La Pampa", duration:90 } },
            "55": { home:3222289, path: {place: "", name: "", duration:"" } },
            "29": { home:3220722, path: {place: 131991, name: "Korcula", duration:95 } },
            "27": { home:3205233, path: {place: 182793, name: "Öğretmenin evi (Girmeden Biftek Yiyin!!)", duration:5 } },
            "19": { home:3237480, path: {place: 49097, name: "Pyhäjärvi", duration:95 } },
            "30": { home:3160535, path: {place: 137942, name: "Gala Gölü", duration:90 } },
            "47": { home:3204448, path: {place: 782567, name: "Urla", duration:90 } },
            "51": { home:3202857, path: {place: 1845324, name: "St Lucia", duration:90 } },
            "56": { home:3187003, path: {place: "", name: "", duration:"" } },
            "22": { home:3204935, path: {place: 67582, name: "Gilleleje", duration:95 } },
            "5": { home:3161774, path: {place: 234234, name: "Herman's Palace", duration:5 } },
            "14": { home:3196672, path: {place: 49198, name: "Santa Monica Beach", duration:20 } },
            "24": { home:3162492, path: {place: 103128, name: "La Rioja", duration:50 } },
            "54": { home:3188092, path: {place: "", name: "", duration:"" } },
            "10": { home:3198312, path: {place: 49091, name: "Niney Mile Beach", duration:50 } },
            "32": { home:3218344, path: {place: 170268, name: "Acapulco", duration:90 } },
            "52": { home:3218697, path: {place: 1886305, name: "Lago di Garda", duration:95 } },
            "38": { home:3198981, path: {place: 358359, name: "St Lawrence River", duration:95 } },
            "18": { home:3204377, path: {place: 49096, name: "Волга", duration:120 } },
            "11": { home:3245177, path: {place: 76469, name: "Little house on the Prairie", duration:10 } },
            "6": { home:2986433, path: {place: 49087, name: "Cape Cod", duration: 95 } },
            "20": { home:3162065, path: {place: 49098, name: "Charente", duration:65 } },
            "31": { home:2986566, path: {place: 140964, name: "Costa Verde", duration:20 } },
            "25": { home:3199641, path: {place: 104742, name: "Ipanema", duration:20 } },
            "23": { home:3181531, path: {place: 72404, name: "Ostia Lido", duration:50 } },
            "21": { home:3262551, path: {place: 53596, name: "Guarujá", duration:90 } },
            "49": { home:3177850, path: {place: 1174002, name: "Pliva", duration:95 } },
            "50": { home:3023079, path: {place: 1349118, name: "Elliott Bay Park", duration:20 } },
            "39": { home:3222154, path: {place: 473018, name: "Sentosa", duration:36 } },
            "53": { home:3201807, path: {place: "", name: "", duration:"" } },
            "1": { home:3160405, path: {place: 49044, name: "Årsta Havsbad", duration:90 } },
            "45": { home:3255714, path: {place: 670043, name: "Putuo Shan", duration:90 } },
            "60": { home:3200260, path: {place: "", name: "", duration:"" } },
            "34": { home:3222559, path: {place: 195084, name: "Pirita", duration:15 } },
            "62": { home:3227018, path: {place: "", name: "", duration:"" } },
            "16": { home:3268245, path: {place: 49094, name: "Sunnyside", duration:15 } },
            "26": { home:3203190, path: {place: 106202, name: "Telegrafbukta", duration:15 } },
            "48": { home:3231449, path: {place: 847919, name: "Wielkopolskie", duration:100 } },
            "28": { home:3220498 , path: {place: 122919, name: "Merkys", duration:90 } }
        };

        return props[cityId];
    }

    function addCityShortcuts() {
        var cityId = $("#ctl00_cphRightColumn_ctl01_ddlCities").val();
        var cityProps = getCityProps(cityId);

        var homeId = cityProps.home;
        var html = `<tr>
            <td>Duş Evi:</td>
            <td><a href="/World/Popmundo.aspx/Locale/${homeId}">Duş Evi</a></td>
            <td class="right"><a title="Duş evine git" class="icon" href="/World/Popmundo.aspx/Locale/MoveToLocale/${homeId}"><img title="Duş evi adlı mekâna git" src="../../../Static/Icons/movetolocale.png" alt="" style="border-width:0px;"></a></td>
        </tr>`;

        if(cityProps.path.place != ""){
            html += `<tr>
            <td>Patika:</td>
            <td><a href="/World/Popmundo.aspx/Locale/ItemsEquipment/${cityProps.path.place}">Patika</a> (${cityProps.path.name}) (${cityProps.path.duration} Dakika)</td>
            <td class="right"><a title="Patika mekanına git" class="icon" href="/World/Popmundo.aspx/Locale/MoveToLocale/${cityProps.path.place}"><img title="Patika mekanına git" src="../../../Static/Icons/movetolocale.png" alt="" style="border-width:0px;"></a></td>
        </tr>`;
        }

        $("#ctl00_cphLeftColumn_ctl00_lnkAirport").parent().parent().parent().append(html);

    }

    function relationLinkToPhoneCall() {
        $(".data tbody > tr").each(function() {
            var charId = $(this).children().eq(0).find("a").attr("href").split("/").slice(-1)[0];
            var isCharInSameCity = $(this).children().eq(0).find("a").html().includes("<strong>");

            if(!isCharInSameCity) {
                $(this).children().eq(0).find("a").attr("href","/World/Popmundo.aspx/Interact/Phone/"+charId);
            }

           });
    }

    function makePhoneCalls() {
        $(".data").before(`
        <p>
        <select id="mr_phone_call_combo" class="round">
		<option selected="selected" value="0">Romantik Öncelikli</option>
		<option value="1">Naber Demek İçin Ara</option>
	</select>
        <button id="mr_make_phone_call" style="margin:15px 0"><i class="fas fa-mobile-alt"></i> Uzaktaki Herkesi Ara</button>
    </p>
        `);

        $("#mr_make_phone_call").click(function () {
            var peopleToCall = {run: 1, call_type: $("#mr_phone_call_combo").val(), last_called: 0, contacts: [] };
            $(".data tbody > tr").each(function() {
                var charId = $(this).children().eq(0).find("a").attr("href").split("/").slice(-1)[0];
                var isCharInSameCity = $(this).children().eq(0).find("a").html().includes("<strong>");

                if(!isCharInSameCity) {
                    if(!blocked_char_list.includes(charId)){
                        peopleToCall.contacts.push(charId);
                    }
                }

            });
            localStorage.setItem("MR_PHONE_CALL", JSON.stringify(peopleToCall));
        });
    }

    function controlPhoneCall() {
        var peopleToCall = localStorage.getItem("MR_PHONE_CALL");
        if(peopleToCall && peopleToCall != "null") {
            peopleToCall = JSON.parse(peopleToCall);


            if(peopleToCall.run == 1) {
                var targetCharId = peopleToCall.contacts[peopleToCall.last_called];

                if(!url.includes("/World/Popmundo.aspx/Interact/Phone/"+targetCharId)){
                    window.location.href = window.location.origin + "/World/Popmundo.aspx/Interact/Phone/"+targetCharId;
                }else{
                    if(peopleToCall.last_called == peopleToCall.contacts.length - 1) {
                        peopleToCall.run = 0;
                    }else{
                        peopleToCall.last_called = peopleToCall.last_called + 1;
                    }

                    if($("#ctl00_cphTopColumn_ctl00_btnInteract").length > 0) {
                        mobilePhoneCallAutoChosenCombo(peopleToCall.call_type);
                        $("#ctl00_cphTopColumn_ctl00_btnInteract").click();
                    }else{
                        targetCharId = peopleToCall.contacts[peopleToCall.last_called];
                        window.location.href = window.location.origin + "/World/Popmundo.aspx/Interact/Phone/"+targetCharId;
                    }
                }

            }
            localStorage.setItem("MR_PHONE_CALL", JSON.stringify(peopleToCall));
        }


    }

})();
