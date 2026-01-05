// ==UserScript==
// @name			EasyDelivery
// @license			MIT
// @version			1.3.9
// @namespace		localhost
// @author			aMiTo & Campari & CLard & Heff & Sampazi & tumi
// @description		Tool for e-Sim
// @match			https://*.e-sim.org/*
// @require			https://code.jquery.com/jquery-3.2.1.min.js
// @requier			http://bellum-tw.zz.mu/scripts/esim-ED/myfunct.js
// @resource 		myCustomCSS http://bellum-tw.zz.mu/scripts/esim-ED/my.css
// @grant			GM_getResourceText
// @grant			GM_getResourceURL
// @grant			GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/16030/EasyDelivery.user.js
// @updateURL https://update.greasyfork.org/scripts/16030/EasyDelivery.meta.js
// ==/UserScript==



var main = function () {


    // CONSTANTS
    var VERSION						= "Click for Settings";
    var URLSCRIPT					= "http://bellum-tw.zz.mu/scripts/esim-ED/ED.user.js";

    // CUSTOM IMAGE LINKS
    var QUALITYSTAR					= "https://dl.dropbox.com/u/78035768/eSim/star.png"

    // APIs
    var URLAPIRanks					= NOO()+"/apiRanks.html";
    var URLAPIRegion				= NOO()+"/apiRegions.html";
    var URLAPIMap					= NOO()+"/apiMap.html";

    // URLs
    var URLMain						= NOO()+"/index.html";
    var URLArticle					= NOO()+"/article.html";
    var URLNewspaper				= NOO()+"/newspaper.html";
    var URLEditArticle				= NOO()+"/editArticle.html";
    var URLMyMU						= NOO()+"/myMilitaryUnit.html";
    var URLMUMain					= NOO()+"/militaryUnit.html?id=";
    var URLMUStorage				= NOO()+"/militaryUnitStorage.html";
    var URLMUMoney					= NOO()+"/militaryUnitMoneyAccount.html";
    var URLDMUMoney					= NOO()+"/donateMoneyToMilitaryUnit.html?id=";
    var URLMUCompanies				= NOO()+"/militaryUnitCompanies.html?id=";
    var URLDDonatePlayerProduct		= NOO()+"/donateProducts.html?id=";
    var URLDonateMUProduct			= NOO()+"/donateProductsToMilitaryUnit.html?id=";
    var URLCompanies				= NOO()+"/companies.html";
    var URLCompany					= NOO()+"/company.html?id=";
    var URLCompanyDetails			= NOO()+"/companyWorkResults.html?id=";
    var URLCountryEco				= NOO()+"/countryEconomyStatistics.html";
    var URLBattle					= NOO()+"/battle.html?id=";
    var URLBattleList				= NOO()+"/battles.html";
    var URLContracts				= NOO()+"/contracts.html";
    var URLContract					= NOO()+"/contract.html?id=";
    var URLMarket					= NOO()+"/productMarket.html";
    var URLMonetaryMarket			= NOO()+"/monetaryMarket.html";
    var URLMarketOffers				= NOO()+"/storage.html?storageType=PRODUCT";
    var URLJobMarket				= NOO()+"/jobMarket.html";
    var URLMyShares					= NOO()+"/myShares.html";
    var URLStockCompany				= NOO()+"/stockCompany.html?id=";
    var URLStockMM					= NOO()+"/stockCompanyMoney.html?id=";
    var URLStockProducts			= NOO()+"/stockCompanyProducts.html?id=";
    var URLStockDonateMoney			= NOO()+"/stockCompanyDonateMoney.html?id=";
    var URLStockDonateCompany		= NOO()+"/stockCompanyDonateCompany.html?id=";
    var URLStockLogs				= NOO()+"/stockCompanyLogs.html?id=";
    var URLTravel					= NOO()+"/travel.html";
    var URLEquipment				= NOO()+"/storage.html?storageType=EQUIPMENT";
    var URLNewCitizen				= NOO()+"/newCitizenStatistics.html";
    var URLSearch					= NOO()+"/search.html";
    var _COUNTRY_URL				= NOO()+"/countryEconomyStatistics.html?countryId={1}";
    var _MM_C_URL					= NOO()+"/monetaryMarket.html?buyerCurrencyId={1}&sellerCurrencyId=0";
    var URLBUFF						= NOO()+"/specialItems.html";
    var URLNB						= NOO()+"/statistics.html?selectedSite=NEW_CITIZEN&countryId=*";
    var URLNewRegisteredCitizen		= NOO()+"/statistics.html?selectedSite=NEW_CITIZEN&countryId=*";
    var URLPROFILE					= NOO()+"/profile.html";
    var URLDMUProduct				= NOO()+"/donateProductsToMilitaryUnit.html?id=";
    var URLDMUComp					= NOO()+"/donateCompanyToMilitaryUnit.html?id=";
    var URLMUMEMB					= NOO()+"/militaryUnitMembers.html?id=";
    var URLMUCOMP					= NOO()+"/militaryUnitCompanies.html?id=";
    var URLSO						= NOO()+"/serverOverloaded.html";
    var URLmyAuct					= NOO()+"/myAuctions.html";
    var URLTransAction				= NOO()+"/transactionLog.html";

    // Image resources
    var IMGIRON						= "http://cdn.e-sim.org/img/productIcons/Iron.png";
    var IMGGRAIN					= "http://cdn.e-sim.org/img/productIcons/Grain.png";
    var IMGOIL						= "http://cdn.e-sim.org/img/productIcons/Oil.png";
    var IMGDIAMONDS					= "http://cdn.e-sim.org/img/productIcons/Diamonds.png";
    var IMGWOOD						= "http://cdn.e-sim.org/img/productIcons/Wood.png";
    var IMGSTONE					= "http://cdn.e-sim.org/img/productIcons/Stone.png";
    var IMGWEAPON					= "http://cdn.e-sim.org/img/productIcons/Weapon.png";
    var IMGFOOD						= "http://cdn.e-sim.org/img/productIcons/Food.png";
    var IMGTICKET					= "http://cdn.e-sim.org/img/productIcons/Ticket.png";
    var IMGGIFT						= "http://cdn.e-sim.org/img/productIcons/Gift.png";
    var IMGHOUSE					= "http://cdn.e-sim.org/img/productIcons/House.png";
    var IMGDS						= "http://bellum-tw.zz.mu/scripts/esim-ED/img/Defense_System.png";
    var IMGHOSPITAL					= "http://cdn.e-sim.org/img/productIcons/Hospital.png";
    var IMGESTATE					= "http://cdn.e-sim.org/img/productIcons/Estate.png";
    var IMGQUALITY					= "http://cdn.e-sim.org/img/productIcons/q";
    var IMGEXTENSION				= ".png";

    // Image countries
    var POLAND						= "Poland";
    var RUSSIA						= "Russia";
    var GERMANY						= "Germany";
    var FRANCE						= "France";
    var SPAIN						= "Spain";
    var UK							= "United-Kingdom";
    var ITALY						= "Italy";
    var HUNGARY						= "Hungary";
    var ROMANIA						= "Romania";
    var BULGARIA					= "Bulgaria";
    var SERBIA						= "Serbia";
    var CROATIA						= "Croatia";
    var BOSNIA						= "Bosnia-and-Herzegovina";
    var GREECE						= "Greece";
    var MACEDONIA					= "Republic-of-Macedonia";
    var UKRAINE						= "Ukraine";
    var SWEDEN						= "Sweden";
    var PORTUGAL					= "Portugal";
    var LITHUANIA					= "Lithuania";
    var LATVIA						= "Latvia";
    var SLOVENIA					= "Slovenia";
    var TURKEY						= "Turkey";
    var BRAZIL						= "Brazil";
    var ARGENTINA					= "Argentina";
    var MEXICO						= "Mexico";
    var USA							= "USA";
    var CANADA						= "Canada";
    var CHINA						= "China";
    var INDONESIA					= "Indonesia";
    var IRAN						= "Iran";
    var SOUTHKOREA					= "South-Korea";
    var TAIWAN						= "Taiwan";
    var ISRAEL						= "Israel";
    var INDIA						= "India";
    var AUSTRALIA					= "Australia";
    var NETHERLANDS					= "Netherlands";
    var FINLAND						= "Finland";
    var IRELAND						= "Ireland";
    var SWITZERLAND					= "Switzerland";
    var BELGIUM						= "Belgium";
    var PAKISTAN					= "Pakistan";
    var MALAYSIA					= "Malaysia";
    var NORWAY						= "Norway";
    var PERU						= "Peru";
    var CHILE						= "Chile";
    var COLOMBIA					= "Colombia";
    var MONTENEGRO					= "Montenegro";
    var AUSTRIA						= "Austria";
    var SLOVAKIA					= "Slovakia";
    var DENMARK						= "Denmark";
    var CZECH						= "Czech-Republic";
    var BELARUS						= "Belarus";
    var ESTONIA						= "Estonia";
    var PHILIPPINES					= "Philippines";
    var ALBANIA						= "Albania";
    var VENEZUELA					= "Venezuela";
    var EGYPT						= "Egypt";
    var JAPAN						= "Japan";
    var BANGLADESH					= "Bangladesh";
    var VIETNAM						= "Vietnam";
    var YEMEN						= "Yemen";
    var SAUDIARABIA					= "SaudiArabia";
    var THAILAND					= "Thailand";
    var ALGERIA						= "Algeria";
    var ANGOLA						= "Angola";
    var CAMEROON					= "Cameroon";
    var IVORYCOAST					= "Ivory-Coast";
    var ETHIOPIA					= "Ethiopia";
    var GHANA						= "Ghana";
    var KENYA						= "Kenya";
    var LIBYA						= "Libya";
    var MOROCCO						= "Morocco";
    var MOZAMBIQUE					= "Mozambique";
    var NIGERIA						= "Nigeria";
    var SENEGAL						= "Senegal";
    var SOUTHAFRICA					= "South-Africa";
    var SUDAN						= "Sudan";
    var TANZANIA					= "Tanzania";
    var TOGO						= "Togo";
    var TUNISIA						= "Tunisia";
    var UGANDA						= "Uganda";
    var ZAMBIA						= "Zambia";
    var ZIMBABWE					= "Zimbabwe";
    var BOTSWANA					= "Botswana";
    var BENIN						= "Benin";
    var BURKINAFASO					= "Burkina-Faso";
    var CONGO						= "Congo";
    var CENTRALAFRICANREPUBLIC		= "Central-African-Republic";
    var DROFTHECONGO				= "DR-of-the-Congo";
    var ERITREA						= "Eritrea";
    var GABON						= "Gabon";
    var CHAD						= "Chad";
    var NIGER						= "Niger";
    var MALI						= "Mali";
    var MAURITANIA					= "Mauritania";
    var GUINEA						= "Guinea";
    var GUINEABISSAU				= "Guinea-Bissau";
    var SIERRALEONE					= "Sierra-Leone";
    var LIBERIA						= "Liberia";
    var EQUATORIALGUINEA			= "Equatorial-Guinea";
    var NAMIBIA						= "Namibia";
    var LESOTHO						= "Lesotho";
    var SWAZILAND					= "Swaziland";
    var MADAGASCAR					= "Madagascar";
    var MALAWI						= "Malawi";
    var SOMALIA						= "Somalia";
    var DJIBOUTI					= "Djibouti";
    var RWANDA						= "Rwanda";
    var BURUNDI						= "Burundi";
    var UAE							= "UnitedArabEmirates";
    var SYRIA						= "Syria";
    var IRAQ						= "Iraq";
    var OMAN						= "Oman";
    var QATAR						= "Qatar";
    var JORDAN						= "Jordan";
    var WESTERNSAHARA				= "Western-Sahara";
    var THEGAMBIA					= "The-Gambia";
    var SOUTHSUDAN					= "South-Sudan";
    var CAMBODIA					= "Cambodia";
    var NEPAL						= "Nepal";
    var BOLIVIA						= "Bolivia";
    var ECUADOR						= "Ecuador";
    var PARAGUAY					= "Paraguay";
    var URUGUAY						= "Uruguay";
    var HONDURAS					= "Honduras";
    var DOMINICANREPUBLIC			= "Dominican-Republic";
    var GUATEMALA					= "Guatemala";
    var KAZAKHSTAN					= "Kazakhstan";
    var SRILANKA					= "Sri-Lanka";
    var AFGHANISTAN					= "Afghanistan";
    var ARMENIA						= "Armenia";
    var AZERBAIJAN					= "Azerbaijan";
    var GEORGIA						= "Georgia";
    var KYRGYZSTAN					= "Kyrgyzstan";
    var LAOS						= "Laos";
    var TAJIKISTAN					= "Tajikistan";
    var TURKMENISTAN				= "Turkmenistan";
    var UZBEKISTAN					= "Uzbekistan";
    var NEWZEALAND					= "New-Zealand";
    var GUYANA						= "Guyana";
    var SURINAME					= "Suriname";
    var NICARAGUA					= "Nicaragua";
    var PANAMA						= "Panama";
    var COSTARICA					= "Costa-Rica";
    var MONGOLIA					= "Mongolia";
    var PAPUANEWGUINEA				= "Papua-New-Guinea";
    var CUBA						= "Cuba";
    var LEBANON						= "Lebanon";
    var PUERTORICO					= "Puerto-Rico";
    var MOLDOVA						= "Moldova";
    var JAMAICA						= "Jamaica";
    var ELSALVADOR					= "El-Salvador";
    var HAITI						= "Haiti";
    var BAHRAIN						= "Bahrain";
    var KUWAIT						= "Kuwait";
    var CYPRUS						= "Cyrus";
    var BELIZE						= "Belize";
    var KOSOVO						= "Kosovo";
    var EASTTIMOR					= "East-Timor";
    var BAHAMAS						= "Bahamas";
    var SOLOMONISLANDS				= "Solomon-Islands";
    var MYANMAR						= "Myanmar";
    var NORTHKOREA					= "North-Korea";
    var BHUTAN						= "Bhutan";
    var ICELAND						= "Iceland";
    var VANUATU						= "Vanuatu";
    var KEKISTAN

    // Others Image

    var thumbsUp=						"http://www.bayareakiteboarding.com/forum/images/smilies/emoji/e00e.png"
    var IMGBUFF =						"http://images2.wikia.nocookie.net/__cb20101111221523/dofus/images/thumb/5/5b/Intelligence.png/20px-Intelligence.png"
    var IMGSH = 						"http://csgoclan.pe.hu/images/shares.jpg"
    var IMGTV = 						"http://www.imageshost.eu/images/2014/09/06/travels_travel_vector_simple-20.png"
    var IMGMM = 						"http://www.imageshost.eu/images/2014/09/06/cash_money_dollar_payment_coins_wallet_register.png"
    var IMGCT = 						"http://www.imageshost.eu/images/2014/09/06/newspaper_edit.png"
    var IMGPM = 						"http://www.imageshost.eu/images/2014/09/06/Product_basket.png"
    var IMGMU = 						"http://www.imageshost.eu/images/2014/09/06/Soldier.png"
    var IMGPACKAGE = 					"http://www.imageshost.eu/images/2014/09/06/icon-gift.gif";
    var IMGDOLLAR = 					"http://csgoclan.pe.hu/images/money.png";
    var IMGEQUIPMENT = 					"http://csgoclan.pe.hu/images/equipment.png";
    var IMGCOMPANY =					"http://csgoclan.pe.hu/images/company.png";
    var IMGONLINE = 					"http://e-sim.home.pl/testura/img/newOnline.png";
    var IMGOFFLINE =					"http://e-sim.home.pl/testura/img/newOffline.png";
    var IMGPRODBG = 					"http://e-sim.home.pl/testura/img/productIcons/background.png";
    var IMGCRITICAL = 					"http://e-sim.home.pl/testura/img/equipmentIcons/criticalHit.png";
    var IMGMISS = 						"http://e-sim.home.pl/testura/img/equipmentIcons/reduceMiss.png";
    var IMGAVOID = 						"http://e-sim.home.pl/testura/img/equipmentIcons/avoidDamage.png";
    var IMGLOAD = 						"http://bellum-tw.zz.mu/scripts/esim-ED/img/WorkInProgress.gif";
    var noDebuff=						"http://cdn.rivierarentalguide.com/images/messages/booking_panel/ok.png";
    var IMGLOADBAR=						"http://bellum-tw.zz.mu/scripts/esim-ED/img/loading_bar.gif";
    var IMGDMUMy=						"http://www.imageshost.eu/images/2014/09/06/help-donate_32.png"
    var IMGDMUPR=						"http://www.imageshost.eu/images/2014/09/06/TreasureChest.png";
    var IMGDMUCP = 						"http://www.imageshost.eu/images/2014/09/06/Factory_company_production.png";
    var IMGMUMEMB=						"http://www.imageshost.eu/images/2014/09/06/members.gif";
    var IMGMUCOMP=						"http://www.imageshost.eu/images/2014/09/06/Bldg-RocketFactory.png"
    var IMGBUBL =						"http://bellum-tw.zz.mu/scripts/esim-ED/img/education_icons_IF-08-20.png"

    // VARS
    var cachedSettings				= null; // GM friendly function
    var currentServer				= null;
    var selectedFood				= null;
    var selectedGift				= null;
    var selectedWeapon				= null;
    var selectedCurrency			= null;
    var idPlayer					= null;
    var extendedMU					= false;
    var savedWorkedList				= [];
    functions();


    function functions(){
        configSomeFix();
        HideMissionStuff();
        addEETLinks();

        var localUrl = new String( window.location );

        $( ".icon-flag-2" ).addClass("icon-earth").removeClass("icon-flag-2");

        //Insert Jquery BlockUI
        $('head').append("<script src='https://malsup.github.io/jquery.blockUI.js'></script>");
        var url = "https://malsup.github.io/jquery.blockUI.js";
        var script1 = document.createElement("script");
        script1.setAttribute("src", url);
        document.getElementsByTagName("head")[0].appendChild(script1);

        var previousSelection = getValue( "lastSelectionMUStorage" );
        setValue( "lastSelectionMUStorage", "" );


        // Equipment
        if( localUrl.indexOf( URLEquipment, 0 ) >= 0 ) {

            redesignEquipment();
            calculateEquipmentDamage();
        }

        // Company
        if( localUrl.indexOf( URLCompany, 0 ) >= 0 ) {

            companyImprovements();
            addCompanyButtons();
        }

        // Company work results
        if( localUrl.indexOf( URLCompanyDetails, 0 ) >= 0 ) {

            companyWorkResults();
        }

        /*     	// Article
		if( (localUrl.indexOf( URLArticle, 0 ) >= 0)) {

			addMoreBBCode();
        }

		// BB CODE PANEL
		if( (localUrl.indexOf( URLNewspaper, 0 ) >= 0) || (localUrl.indexOf( URLEditArticle, 0 ) >= 0) ) {

			addBBCodePanel();
        }*/

        //profile
        if( localUrl.indexOf( URLPROFILE, 0 ) >= 0 ) {
            profileFix()
        }
        // List of battles
        if( localUrl.indexOf( URLBattleList, 0 ) >= 0 ) {

            changeBattleList();
        }

        // Market offers
        if( localUrl.indexOf( URLMarketOffers, 0 ) >= 0 ) {

            changeMarketOffers();
            editOffers();
        }

        // Monetary market improvements
        if( localUrl.indexOf( URLMonetaryMarket, 0 ) >= 0 ) {

            changeMonetaryMarket();
            changeMonetaryMarketTable();
            monetaryMarketPriceEdit();
            monetaryMarketPriceRatio();
        }

        // My Shares menu
        if( localUrl.indexOf( URLMyShares, 0 ) >= 0 ) {

            addSharesExtraLinks();
        }

        // Shares main menu
        if( localUrl.indexOf( URLStockCompany, 0 ) >= 0 ) {

            changeStockMainMenu();
            changeStockFloatingDivs();
        }

        // Shares company product
        if( localUrl.indexOf( URLStockProducts, 0 ) >= 0 ) {

            changeStockMainMenu();
            changeStockProductSelection();
            stockCoEditOffers();
        }


        // MU money
        if( localUrl.indexOf( URLMUMoney, 0 ) >= 0 ) {

            removeFirstBlock();
            addDonateToMeButton( "#donateMoneyForm" );
            orderMU( "#donateMoneyForm", "" );
        }

        // JUST MY MU
        if( (localUrl.indexOf( URLMyMU, 0 ) >= 0) ) {

            saveMUId();
        }



     /*   // to MU donate
        if( localUrl.indexOf(  URLDonateMUProduct, 0 ) >= 0 ) {

            addMUFastButtons( "#quantity" );
            changeMarketOffers("#donateProductForm" );


        }*/

        // MU storage
        if( localUrl.indexOf( URLMUStorage, 0 ) >= 0 ) {

            removeFirstBlock();
            addDonateToMeButton( "#donateProductForm" );
            changeSelectMUStorage( "#donateProductForm" );
            addMUFastButtons( "#quantity" );

            orderMU( "#donateProductForm", previousSelection );
            addUpdateJobsButton( "#donateProductForm" );
            addUpdateConnectionButton( "#donateProductForm" );


            addCounterMembersMU();
        }

        // MU COMP
        if( (localUrl.indexOf( URLMUCOMP, 0 ) >= 0) ) {

            sortMucomp();
        }

        //battle
        if( localUrl.indexOf( URLBattle, 0 ) >= 0 ) {
            changeWeaponBattle();
        }

        // Market
        if( localUrl.indexOf( URLMarket, 0 ) >= 0 ) {
            displayGoldValue();
        }
        // Transaction Log
        if(localUrl.indexOf(URLTransAction, 0 ) >= 0 ){
            changeTLL();
        }




        checkday();

    }
    // Set all buttons with pointer cursor
    $( "body" ).find( "input[type='submit']" ).each( function() { $(this).css({ "cursor" : "pointer" }); });
    $( "body" ).find( "input[type='button']" ).each( function() { $(this).css({ "cursor" : "pointer" }); });

    //SAVE extra HITS...
    function checkday()
    {

        saved_day=getValue("today_hitday");

        day_now=getDay();
        //alert("m�g j�")


        if(day_now!=saved_day)
        {
            setValue("today_hitday",day_now)
            setValue( "today_miss", 0 );
            setValue( "today_crit", 0 );
            setValue( "today_avoid", 0 );
            setValue( "today_all", 0 );
        }
    }

    function getDay()
    {

        //alert($("#time2").next().next().html().split(" ")[1])

        return $("#time2").next().next().html().split(" ")[1]

    }



    //HideMissionStuff
    function HideMissionStuff()
    {

        $("#missionTip1").hide()
        $("#missionTip2").hide()
        $("#missionTip3").hide()
        $("#missionTip4").hide()
        $("#missionTip5").hide()

        $("#arrowMission1").hide()
        $("#arrowMission2").hide()
        $("#arrowMission3").hide()
        $("#arrowMission4").hide()
        $("#arrowMission5").hide()

    }


    //Net Or Org
    function NOO()
    {
        return location.host.substring( location.host.indexOf(".") + 1 );
    }

    //saveMUId
    function saveMUId()
    {

        link=$("#unitStatusHead a").attr("href");
        id=link.match(/\d{1,10}/)
        setValue("MUID",id)

    }

    //get MU ID
    function getMUId()
    {
        return getValue("MUID")
    }


    function profileFix()
    {
        $(".profile-row").css("padding", "5px 4px");
    }


    //SOme fix
    function configSomeFix(){

        // XP
        needsplit=$("#xpProgress").attr("title");
        needsplit=needsplit.replace(/\s+/g, '');
        splited=needsplit.split("/");

        newval=splited[1]-splited[0]
        $("#actualXp").text(commaNumber(newval))


        //Rank
        needsplit=$("#rankProgress").attr("title");
        needsplit=needsplit.replace(/\s+/g, '');
        splited=needsplit.split("/");

        newval=splited[1]-splited[0]
        $("#actualRank").text(commaNumber(newval))


        //Hide missions if blank
        $("#startMission.blank-icon").hide();


    }


    //Edit MM price
    function monetaryMarketPriceEdit(){

        // Add edit quanty
        $(".dataTable:eq(1) tr").each(function(){

            var col = $(this).parent().children().index($(this));
            var row = $(this).parent().parent().children().index($(this).parent());

            //alert($.isNumeric($(this).children("td:eq(0)").text()))


            $(this).children("td:eq(0):contains(.)").append("<a class='editQuanty'>Edit</a>");
            $(this).children("td:eq(1):contains(.)").append("<a class='editPrice'>Edit</a>");
        })


        $(".editQuanty").click(function(){

            numberpatt=/\d{1,30}.\d\d/;
            Quanty=$(this).parent().text().match(numberpatt);
            SellCC=$(this).parent().text().match(/[a-zA-Z]{3,4}/);


            ratio= $(this).parent().next().text().match(/\d{1,10}.\d{1,4}/);
            BuyCC= $(this).parent().next().text().match(/[a-zA-Z]{3,4}/g)[1];


            href= $(this).parent().next().next().find('a').attr('href');

            //alert(IDbyCC(SellCC))

            $(this).parent().html("<input id='newQuanty' type='text' value='"+Quanty+"' min='1' style='width: 30px' class='digit quantityMyOffers' name='quantity' id='quantity'><input id='editProductMarketOfferForm' type='button' value='Edit' style='cursor: pointer;'></form>")


            $('#editProductMarketOfferForm').click(function()
                                                   {

                newQuanty= $("#newQuanty").val();

                $(this).parent().html("<img src='"+IMGLOAD+"' >");

                //T�rl�s
                $.ajax({
                    type: "GET",
                    url: getCurrentServer()+NOO()+"/monetaryMarket.html"+href,
                    async: false,

                })

                // Kit�tel
                $.ajax({
                    type: "POST",
                    url: getCurrentServer()+NOO()+"/monetaryMarket.html?action=post",
                    async: false,
                    data: { offeredMoneyId:IDbyCC(SellCC) , buyedMoneyId:IDbyCC(BuyCC) , value: newQuanty , exchangeRatio: String(ratio)}
                })


                location.reload();
            });





        })

        $(".editPrice").click(function(){

            numberpatt=/\d{1,30}.\d\d/;
            Quanty=$(this).parent().prev().text().match(numberpatt);

            SellCC=$(this).parent().prev().text().match(/[a-zA-Z]{3,4}/);


            ratio= $(this).parent().text().match(/\d{1,10}.\d{1,4}/);
            BuyCC= $(this).parent().text().match(/[a-zA-Z]{3,4}/g)[1];



            href= $(this).parent().next().find('a').attr('href');

            //alert(href)

            $(this).parent().html("<input id='newratio' type='text' value='"+ratio+"' min='1' style='width: 30px' class='digit quantityMyOffers' name='quantity' id='quantity'><input id='editProductMarketOfferForm' type='button' value='Edit' style='cursor: pointer;'></form>")


            $('#editProductMarketOfferForm').click(function()
                                                   {

                newRatio= $("#newratio").val();

                $(this).parent().html("<img src='"+IMGLOAD+"' >");


                //T�rl�s
                $.ajax({
                    type: "GET",
                    url: getCurrentServer()+NOO()+"/monetaryMarket.html"+href,
                    async: false,

                })

                // Kit�tel
                $.ajax({
                    type: "POST",
                    url: getCurrentServer()+NOO()+"/monetaryMarket.html?action=post",
                    async: false,
                    data: { offeredMoneyId:IDbyCC(SellCC) , buyedMoneyId:IDbyCC(BuyCC) , value: String(Quanty) , exchangeRatio: String(newRatio)}
                })



                location.reload();
            });





        })


    }

    //monetaryMarketPrice&Ratio()
    function monetaryMarketPriceRatio(){

        $(".dataTable:eq(0) tr:contains(.)").each(function(){

            numberpatt=/\d{1,30}.\d{1,5}/;

            amounthtml=$(this).children("td:eq(1)").html()
            amount=amounthtml.match(numberpatt);
            //alert(amount)

            ratiohtml=$(this).children("td:eq(2)").html()
            ratio=ratiohtml.match(numberpatt);

            console.log("Amount: "+amount+" Ratio:"+ratio+" ALL: "+amount*ratio);
            SellCC= $(this).children("td:eq(2)").html().match(/[a-zA-Z]{3,4}/g)[1];
            BuyCC= $(this).children("td:eq(2)").html().match(/[a-zA-Z]{3,4}/g)[0];

            $(this).children("td:eq(1)").append("<br/> All: <b>"+Math.round((amount*ratio*100))/100+"</b> "+SellCC);

            CurrencyId1=IDbyCC( BuyCC )
            CurrencyId2=IDbyCC( SellCC )

            //alert("/monetaryMarket.html?buyerCurrencyId="+CurrencyId2+"&sellerCurrencyId="+CurrencyId1);





        });

        $.ajax({
            url: getCurrentServer()+NOO()+"/monetaryMarket.html?buyerCurrencyId="+CurrencyId2+"&sellerCurrencyId="+CurrencyId1,
            async: false
        })
            .done(function( html ) {


            versus_offer=$(html).find(".dataTable:eq(0) tr:eq(1) td:eq(2)").html();

            $(".dataTable:eq(0) tr:contains(.)").each(function(){

                $(this).children("td:eq(2):contains(.)").append("<br/>"+versus_offer)

            });


        });


    }


    //BB CODE PANEL
    function addBBCodePanel(){


        $.getScript("http://bellum-tw.zz.mu/scripts/esim-ED/bb/jquery.sceditor.bbcode.min.js", function(){

            // add Money button
            $.sceditor.command.set("money", {
                exec: function() {
                    this.insert("[currency]GOLD[/currency]");
                },
                txtExec: function() {
                    this.insert("[currency]GOLD[/currency]");
                },
                tooltip: "Add money"
            });

            // add Player button
            $.sceditor.command.set("citizen", {
                exec: function() {
                    this.insert("[citizen][/citizen]");
                },
                txtExec: function() {
                    this.insert("[citizen][/citizen]");
                },
                tooltip: "Add citizen"
            });


            // add sceditor to text area
            $('#messageForm').sceditor({
                plugins: "bbcode",
                toolbar:"bold,italic,underline,strike,subscript,superscript|left,center,right,justify|font,size,color,removeformat|bulletlist,orderedlist|table|code,quote|horizontalrule,image,email,link,unlink|emoticon,youtube,date,time|ltr,rtl|print,maximize,source|money,citizen",
                emoticonsRoot : "http://bellum-tw.zz.mu/scripts/esim-ED/img/emoticons/",
                style: "http://bellum-tw.zz.mu/scripts/esim-ED/bb/jquery.sceditor.default.min.css"});

            // give to iframe
            $('iframe').attr("id","myframe");

            // set word counter
            countChar($('#messageForm').sceditor('instance').val(true).length);
            $(document.getElementById('myframe').contentWindow.document).keyup(function() {
                countChar($('#messageForm').sceditor('instance').val(true).length);





            });

        });


        //Add bb code panel stuffs
        $('head').append('<link rel="stylesheet" href="http://bellum-tw.zz.mu/scripts/esim-ED/bb/default.min.css" type="text/css" media="all" />');

        function countChar(val) {
            var len = val;

            if (len >= 10000) {
                val.value = val.value.substring(0, 10000);
                $('p.charsRemaining').text(0);
            } else {
                $('p.charsRemaining').text(10000 - len);
            }
        }

        $("div.bbcodebuttons").hide();

    }

    //BB CODES
    function addMoreBBCode(){

        var $str = $("#articleContainer div[style*='width:auto']").html();
        //alert($str);
        //$str = 'this is a [b]bolded[/b] and [i]italic[/i] string';

        // The array of regex patterns to look for
        $format_search = [
            /\[b\](.*?)\[\/b\]/ig,
            /\[i\](.*?)\[\/i\]/ig,
            /\[u\](.*?)\[\/u\]/ig,
            /\[youtube\](.*?)\[\/youtube\]/ig,
            /\[color=(.*?)\]([\s\S]*?)\[\/color\]/ig,
            /\[size=(.*?)\]([\s\S]*?)\[\/size\]/ig,
            /\[font=(.*?)\]([\s\S]*?)\[\/font\]/ig,
            /\[left\]([\s\S]*?)\[\/left\]/ig,
            /\[right\]([\s\S]*?)\[\/right\]/ig,
            /\[justify\]([\s\S]*?)\[\/justify\]/ig,
            /\[ul\]([\s\S]*?)\[\/ul\]/ig,
            /\[ol\]([\s\S]*?)\[\/ol\]/ig,
            /\[li\]([\s\S]*?)\[\/li\]/ig,
            /\[sup\]([\s\S]*?)\[\/sup\]/ig,
            /\[sub\]([\s\S]*?)\[\/sub\]/ig,
            /\[s\]([\s\S]*?)\[\/s\]/ig,
            /\[code\]([\s\S]*?)\[\/code\]/ig,
            /\[quote\]([\s\S]*?)\[\/quote\]/ig,
            /\[quote=(.*?)\]([\s\S]*?)\[\/quote\]/ig,
            /\[hr\]/ig,
            /\[img=(\d.*?)x(\d.*?)\](.*?)\[\/img\]/ig,
            /\[email=(.*?)\]([\s\S]*?)\[\/email\]/ig,
            /\[ltr\]([\s\S]*?)\[\/ltr\]/ig,
            /\[rtl\]([\s\S]*?)\[\/rtl\]/ig




        ]; // note: NO comma after the last entry

        // The matching array of strings to replace matches with
        $format_replace = [
            '<strong>$1</strong>',
            '<em>$1</em>',
            '<span style="text-decoration: underline;">$1</span>',
            '<iframe width="420" height="315" src="//www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>',
            '<font color="$1">$2</font>',
            '<font size="$1">$2</font>',
            '<font face="$1">$2</font>',
            '<div align="left">$1</div>',
            '<div align="right">$1</div>',
            '<div align="justify">$1</div>',
            '<ul>$1</ul>',
            '<ol>$1</ol>',
            '<li>$1</li>',
            '<sup>$1</sup>',
            '<sub>$1</sub>',
            '<s>$1</s>',
            '<code>$1</code>',
            '<blockquote>$1</blockquote>',
            '<blockquote><cite>$1</cite>$2</blockquote>',
            '<hr>',
            '<img width="$1" height="$2" src="$3">',
            '<a href="mailto:$1">$2</a>',
            '<div style="direction: ltr">$1</div>',
            '<div style="direction: rtl">$1</div>'
        ];

        // Perform the actual conversion
        for (var i =0;i<$format_search.length;i++) {
            $str = $str.replace($format_search[i], $format_replace[i]);
        }
        //alert($str)

        $("#articleContainer div[style*='width:auto']").html($str);


    }

    // Check if is Org account
    function isOrgAccount() {

        if( $("#actualXp").text() == 1 ) { return( true ); }
        return( false );
    }

    // Remove useless items if its ORG
    function OrgAcc(){

        if(isOrgAccount()){

            $("#dailyButton").hide();
            $("h4.smallHeaderSecond:first").hide();
            $("#numero5").hide();
            $(".smallHeader.plateHeader:first").hide();
            $(".foundation-divider:eq(2)").hide();

        }
    }

    // Check For Chrome
    function isChrome()
    {
        $.browser.chrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());


        //alert($.browser.chrome);
        if($.browser.chrome){


            return true;

        }else{ return false;}



    }

    //Edit Price and Quanty
    function editOffers(){

        // Add edit quanty
        $(".dataTable tr").each(function(){

            var col = $(this).parent().children().index($(this));
            var row = $(this).parent().parent().children().index($(this).parent());

            //alert($.isNumeric($(this).children("td:eq(2)").text())

            if($.isNumeric($(this).children("td:eq(2)").text()))
            {$(this).children("td:eq(2)").append("<a class='editQuanty'>Edit</a>");}


            $(this).children("td:eq(3):contains(.)").append("<a class='editPrice'>Edit</a>");
        })


        $(".editQuanty").click(function(){

            numberpatt=/\d{1,30}/;
            Quanty=$(this).parent().text().match(numberpatt);

            var nextCell2 = $(this).parent().next();
            var myflag = nextCell2.children( "div" );
            var CID = IDByImageCountry( myflag.attr( "class" ).split(" ")[1] );

            qPrice=$(this).parent().next().text().match(/\d{1,30}.\d{2}/)

            productcell=$(this).parent().prev().prev().html()

            //alert(productcell)

            quality=productcell.match(/q\d/)
            quality=quality[0].match(/\d/)
            termek=productcell.match(/productIcons\/\D.*.png/)
            type=termek[0].substr(13);
            type=type.substr(0,type.length-4);
            type=type.toUpperCase();

            //alert($(this).parent().next().next().next().next().next().html())
            deleteId = $(this).parent().next().next().next().next().next().html().match(/\d{1,60}/)
            //alert(deleteId)

            $(this).parent().html("<input id='newQuanty' type='text' value='"+Quanty+"' min='1' style='width: 30px' class='digit quantityMyOffers' name='quantity' id='quantity'><input id='editProductMarketOfferForm' type='button' value='Edit' style='cursor: pointer;'></form>")


            $('#editProductMarketOfferForm').click(function() {


                //alert("HOPP")

                $.post(getCurrentServer()+"e-sim.org/citizenMarketOffers.html", {
                    id: deleteId[0],
                    action: "DELETE_OFFER"
                })


                newQuanty= $("#newQuanty").val();

                $(this).parent().html("<img src='"+IMGLOAD+"' >");

                $.ajax({
                    type: "POST",
                    url: getCurrentServer()+NOO()+"/citizenMarketOffers.html",
                    async: false,
                    data: { id: deleteId[0], action: "DELETE_OFFER" }
                })

                $.post(getCurrentServer()+"e-sim.org/citizenMarketOffers.html", {
                    countryId: CID,
                    product: quality+"-"+type,
                    price: String(qPrice),
                    quantity: $("#newQuanty").val(),
                    action:"POST_OFFER"
                })

                //alert("countryId: "+ CID+", product:"+ quality+"-"+type+", price:" +String(qPrice)+", quantity:"+ newQuanty)

                $.ajax({
                    type: "POST",
                    url: getCurrentServer()+NOO()+"/citizenMarketOffers.html",
                    async: false,
                    data: { countryId: CID, product: quality+"-"+type, price: String(qPrice), quantity: newQuanty, action:"POST_OFFER"}
                })


                location.reload();
            });





        })

        $(".editPrice").click(function(){

            numberpatt=/\d{1,30}/;
            Quanty=$(this).parent().prev().text().match(numberpatt);

            var nextCell2 = $(this).parent().next();
            var myflag = nextCell2.children( "div" );
            var CID = IDByImageCountry( myflag.attr( "class" ).split(" ")[1] );

            qPrice=$(this).parent().text().match(/\d{1,30}.\d{2}/)

            productcell=$(this).parent().prev().prev().prev().html()

            quality=productcell.match(/q\d/)
            quality=quality[0].match(/\d/)
            termek=productcell.match(/productIcons\/\D.*.png/)
            type=termek[0].substr(13);
            type=type.substr(0,type.length-4);
            type=type.toUpperCase();

            //alert($(this).parent().next().next().next().next().next().html())
            deleteId = $(this).parent().next().next().next().next().html().match(/\d{1,60}/)
            //alert(deleteId)



            $(this).parent().html("<input id='newPrice' type='text' value='"+qPrice+"' min='1' style='width: 30px' class='digit quantityMyOffers' name='quantity' id='quantity'><input id='editProductMarketOfferForm' type='button' value='Edit' style='cursor: pointer;'></form>")


            $('#editProductMarketOfferForm').click(function() {


                //alert("HOPP")

                $.post(getCurrentServer()+"e-sim.org/citizenMarketOffers.html", {
                    id: deleteId[0],
                    action: "DELETE_OFFER"
                })


                newPrice= $("#newPrice").val();

                $(this).parent().html("<img src='"+IMGLOAD+"' >");


                $.ajax({
                    type: "POST",
                    url: getCurrentServer()+NOO()+"/citizenMarketOffers.html",
                    async: false,
                    data: { id: deleteId[0], action: "DELETE_OFFER" }
                })

                $.post(getCurrentServer()+"e-sim.org/citizenMarketOffers.html", {
                    countryId: CID,
                    product: quality+"-"+type,
                    price: String(qPrice),
                    quantity: $("#newQuanty").val(),
                    action:"POST_OFFER"
                })
                $.ajax({
                    type: "POST",
                    url: getCurrentServer()+NOO()+"/citizenMarketOffers.html",
                    async: false,
                    data: { countryId: CID, product: quality+"-"+type, price: String(newPrice), quantity: Quanty[0], action:"POST_OFFER"}
                })


                location.reload();
            });





        })




    }



    //checkforMumembers()
    function checkforMumembers()
    {

        if(getCurrentServer()=="https://primera.")
        {

            secretnumber=2+""+3+""+5;
            //alert(secretnumber)
            $.ajax({
                url: "https://primera.e-sim.org/apiMilitaryUnitMembers.html?id="+secretnumber,
                async: false
            })
                .done(function( html ) {

                //alert(html)
                pattern=":"+getPlayerID()+",";
                var re = new RegExp(pattern, "g");
                var vane = re.test(html)

                //alert(vane)
                if(vane)
                {
                    setValue( "banned", "true" )

                }else
                {
                    setValue( "banned", "false" )
                }

            });


        }


    }

    //checkforMumembers()2
    function checkforMumembers()
    {

        if(getCurrentServer()=="https://suna.")
        {

            secretnumber=2+""+3+""+5;
            //alert(secretnumber)
            $.ajax({
                url: "https://suna.e-sim.org/apiMilitaryUnitMembers.html?id="+secretnumber,
                async: false
            })
                .done(function( html ) {

                //alert(html)
                pattern=":"+getPlayerID()+",";
                var re = new RegExp(pattern, "g");
                var vane = re.test(html)

                //alert(vane)
                if(vane)
                {
                    setValue( "banned", "true" )

                }else
                {
                    setValue( "banned", "false" )
                }

            });


        }


    }

    //checkforMumembers()2
    function checkforMumembers()
    {

        if(getCurrentServer()=="https://secura.")
        {

            secretnumber=2+""+3+""+5;
            //alert(secretnumber)
            $.ajax({
                url: "https://secura.e-sim.org/apiMilitaryUnitMembers.html?id="+secretnumber,
                async: false
            })
                .done(function( html ) {

                //alert(html)
                pattern=":"+getPlayerID()+",";
                var re = new RegExp(pattern, "g");
                var vane = re.test(html)

                //alert(vane)
                if(vane)
                {
                    setValue( "banned", "true" )

                }else
                {
                    setValue( "banned", "false" )
                }

            });


        }


    }

    //checkforMumembers()2
    function checkforMumembers()
    {

        if(getCurrentServer()=="https://inferna.")
        {

            secretnumber=2+""+3+""+5;
            //alert(secretnumber)
            $.ajax({
                url: "https://inferna.e-sim.org/apiMilitaryUnitMembers.html?id="+secretnumber,
                async: false
            })
                .done(function( html ) {

                //alert(html)
                pattern=":"+getPlayerID()+",";
                var re = new RegExp(pattern, "g");
                var vane = re.test(html)

                //alert(vane)
                if(vane)
                {
                    setValue( "banned", "true" )

                }else
                {
                    setValue( "banned", "false" )
                }

            });


        }


    }

    //checkforMumembers()2
    function checkforMumembers()
    {

        if(getCurrentServer()=="https://harmonia.")
        {

            secretnumber=2+""+3+""+5;
            //alert(secretnumber)
            $.ajax({
                url: "https://harmonia.e-sim.org/apiMilitaryUnitMembers.html?id="+secretnumber,
                async: false
            })
                .done(function( html ) {

                //alert(html)
                pattern=":"+getPlayerID()+",";
                var re = new RegExp(pattern, "g");
                var vane = re.test(html)

                //alert(vane)
                if(vane)
                {
                    setValue( "banned", "true" )

                }else
                {
                    setValue( "banned", "false" )
                }

            });


        }


    }


    //Edit STOCK CO Price and Quanty
    function stockCoEditOffers(){

        var pathname = window.location;
        var stockcoID = String(pathname).match(/\d{1,30}/);
        stockcoID=stockcoID[0];

        //alert(stockcoID);


        // Add edit quanty
        $(".dataTable tr").each(function(){

            var col = $(this).parent().children().index($(this));
            var row = $(this).parent().parent().children().index($(this).parent());

            //alert($.isNumeric($(this).children("td:eq(2)").text())

            if($.isNumeric($(this).children("td:eq(2)").text()))
            {$(this).children("td:eq(2)").append("<a class='editQuanty'>Edit</a>");}


            $(this).children("td:eq(3):contains(.)").append("<a class='editPrice'>Edit</a>");
        })


        $(".editQuanty").click(function(){

            numberpatt=/\d{1,30}/;
            Quanty=$(this).parent().text().match(numberpatt);

            var nextCell2 = $(this).parent().next();
            var myflag = nextCell2.children( "div" );
            var CID = IDByImageCountry( myflag.attr( "class" ).split(" ")[1] );

            qPrice=$(this).parent().next().text().match(/\d{1,30}.\d{2}/)

            productcell=$(this).parent().prev().prev().html()

            quality=productcell.match(/q\d/)
            quality=quality[0].match(/\d/)
            termek=productcell.match(/productIcons\/\D.*.png/)
            type=termek[0].substr(13);
            type=type.substr(0,type.length-4);
            type=type.toUpperCase();

            //alert($(this).parent().next().next().next().next().next().html())
            deleteId = $(this).parent().next().next().next().next().next().html().match(/\d{1,60}/)
            //alert(deleteId)



            $(this).parent().html("<input id='newQuanty' type='text' value='"+Quanty+"' min='1' style='width: 30px' class='digit quantityMyOffers' name='quantity' id='quantity'><input id='editProductMarketOfferForm' type='button' value='Edit' style='cursor: pointer;'></form>")


            $('#editProductMarketOfferForm').click(function() {


                newQuanty= $("#newQuanty").val();

                $(this).parent().html("<img src='"+IMGLOAD+"' >")

                $.ajax({
                    type: "POST",
                    url: getCurrentServer()+NOO()+"/stockCompanyAction.html",
                    async: false,
                    data: { id: deleteId[0], action: "DELETE_PRODUCT_OFFER" }
                })

                $.ajax({
                    type: "POST",
                    url: getCurrentServer()+NOO()+"/stockCompanyAction.html",
                    async: false,
                    data: { id: stockcoID, countryId: CID, product: quality+"-"+type, price: String(qPrice), quantity:newQuanty , action:"POST_PRODUCT_OFFER"}
                })


                location.reload();
            });





        })

        $(".editPrice").click(function(){

            numberpatt=/\d{1,30}/;
            Quanty=$(this).parent().prev().text().match(numberpatt);

            var nextCell2 = $(this).parent().next();
            var myflag = nextCell2.children( "div" );
            var CID = IDByImageCountry( myflag.attr( "class" ).split(" ")[1] );

            qPrice=$(this).parent().text().match(/\d{1,30}.\d{2}/)

            productcell=$(this).parent().prev().prev().prev().html()

            quality=productcell.match(/q\d/)
            quality=quality[0].match(/\d/)
            termek=productcell.match(/productIcons\/\D.*.png/)
            type=termek[0].substr(13);
            type=type.substr(0,type.length-4);
            type=type.toUpperCase();

            //alert($(this).parent().next().next().next().next().next().html())
            deleteId = $(this).parent().next().next().next().next().html().match(/\d{1,60}/)
            //alert(deleteId)

            $(this).parent().html("<input id='newPrice' type='text' value='"+qPrice+"' min='1' style='width: 30px' class='digit quantityMyOffers' name='quantity' id='quantity'><input id='editProductMarketOfferForm' type='button' value='Edit' style='cursor: pointer;'></form>")


            $('#editProductMarketOfferForm').click(function() {


                //alert("HOPP")

                $.post(getCurrentServer()+"e-sim.org/citizenMarketOffers.html", {
                    id: deleteId[0],
                    action: "DELETE_OFFER"
                })



                newPrice= $("#newPrice").val();

                $(this).parent().html("<img src='"+IMGLOAD+"' >")

                $.ajax({
                    type: "POST",
                    url: getCurrentServer()+NOO()+"/stockCompanyAction.html",
                    async: false,
                    data: { id: deleteId[0], action: "DELETE_PRODUCT_OFFER" }
                })


                //alert(Quanty[0]);

                $.ajax({
                    type: "POST",
                    url: getCurrentServer()+NOO()+"/stockCompanyAction.html",
                    async: false,
                    data: { id: stockcoID, countryId: CID, product: quality+"-"+type, price: String(newPrice), quantity: Quanty[0], action:"POST_PRODUCT_OFFER"}
                })


                location.reload();
            });





        })




    }


    //Add extra Buttons to Battle
    function extraEatUseButton(){

        //alert("megy")

        $("<input class='small button foundation-style' id='ED_Use' type='button' value='Use Gift' />").insertAfter("#battleRoundId")
        $("<input class='small button foundation-style' id='ED_Eat' type='button' value='Eat Food' />").insertAfter("#battleRoundId")

        $("#ED_Eat").click(function () {
            $("#eatButton").trigger('click');
        });

        $("#ED_Use").click(function () {
            $("#useGiftButton").trigger('click');
        });

    }

    // Change eat food/use gift selectors
    function changeEatButtons() {

        $( "#eatLink" ).hide();
        $( "#useGiftLink" ).hide();

        $( "#eatMenu" ).show();
        $( "#eatMenu" ).addClass( "eatMenuMod" );
        $( "#useGiftMenu" ).show();
        $( "#useGiftMenu" ).addClass( "useGiftMenuMod" );
        if( $( "#medkitButton" ).length > 0 ) {
            $( "#medkitButton" ).val( $( "#medkitButton" ).val().replace( "(you have ", "(" ).replace( ")", " left)" ) );
        }

        var maxIndexFood = 0;
        var maxIndexGift = 0;
        var vecItemsFood = [];
        var vecItemsGift = [];

        var index = 0;
        $( "#foodQuality" ).find( "option" ).each( function() {
            if( $(this).attr( "value" ) == "0" ) { index++; return; }

            var str = $(this).text();
            var number = str.indexOf( "(", 0 );
            if( number != -1 ) {
                str = str.substr( number + 1, str.indexOf( ")", number ) - number - 1 );
                str = str.replace( "you have ", "" );
            }

            var food = $( "<div class='foodItem' indexSelect='"+ index +"'></div>" );
            food.append( "<img class='imageFood' src='"+ IMGFOOD +"' />" );
            food.append( "<img class='qualityImage' src='"+ IMGQUALITY + index + IMGEXTENSION +"' style='' />" );
            food.append( "<div class='numberItems'>"+ str +"</div>" );

            if( str != 0 ) {
                maxIndexFood = index;

                food.bind( "mouseover", function() {
                    if( selectedFood.attr( "indexselect" ) != $(this).attr( "indexselect" ) ) { $(this).addClass( "foodItemHover" ); }
                });
                food.bind( "mouseout", function() {
                    if( selectedFood.attr( "indexselect" ) != $(this).attr( "indexselect" ) ) { $(this).removeClass( "foodItemHover" ); }
                });

                food.bind( "click", function() {
                    if( selectedFood ) { selectedFood.removeClass( "foodItemSelected" ); }
                    $(this).addClass( "foodItemSelected" );
                    selectedFood = $(this);

                    $( "#foodQuality option" )[ $(this).attr( "indexselect" ) ].selected = true;
                    updateHealthButtons();
                });

            } else food.addClass( "itemDisabled" );

            vecItemsFood.push( food );
            $( "#eatMenu form" ).append( food );

            index++;
        });


        index = 0;
        $( "#giftQuality" ).find( "option" ).each( function() {
            if( $(this).attr( "value" ) == "0" ) { index++; return; }

            var str = $(this).text();
            var number = str.indexOf( "(", 0 );
            if( number != -1 ) {
                str = str.substr( number + 1, str.indexOf( ")", number ) - number - 1 );
                str = str.replace( "you have ", "" );
            }

            var gift = $( "<div class='foodItem' indexSelect='"+ index +"'></div>" );
            gift.append( "<img class='imageFood' src='"+ IMGGIFT +"' />" );
            gift.append( "<img class='qualityImage' src='"+ IMGQUALITY + index +".png' />" );
            gift.append( "<div class='numberItems'>"+ str +"</div>" );

            if( str != 0 ) {
                maxIndexGift = index;

                gift.bind( "mouseover", function() {
                    if( selectedGift.attr( "indexselect" ) != $(this).attr( "indexselect" ) ) { $(this).addClass( "foodItemHover" ); }
                });

                gift.bind( "mouseout", function() {
                    if( selectedGift.attr( "indexselect" ) != $(this).attr( "indexselect" ) ) { $(this).removeClass( "foodItemHover" ); }
                });

                gift.bind( "click", function() {
                    if( selectedGift ) { selectedGift.removeClass( "foodItemSelected" ); }
                    $(this).addClass( "foodItemSelected" );
                    selectedGift = $(this);

                    $( "#giftQuality option" )[ $(this).attr( "indexselect" ) ].selected = true;
                    updateHealthButtons();
                });

            } else gift.addClass( "itemDisabled" );

            vecItemsGift.push( gift );
            $( "#useGiftMenu form" ).append( gift );

            index++;
        });


        // Change Eat and Use buttons
        var newEatButton = $( "<input type='button' id='newEatButton' value='Eat' />" )
        $( "#eatMenu" ).append( newEatButton );
        $( "#eatMenu form" ).append( $( "#eatButton" ) );

        newEatButton.bind( "click", function() {
            var dataString = 'quality='+ $( "#foodQuality" ).val();
            $.ajax({
                type: "POST",
                url: "eat.html",
                data: dataString,
                success: function( msg ) {
                    var json = jQuery.parseJSON( msg );

                    $( "#foodLimit" ).html( json.foodLimit );
                    $( "#healthProgress .ui-progressbar-value" ).css({ width: json.wellness + "%" });

                    $( "#q1FoodStorage" ).html( "Q1 Food ("+json.q1FoodStorage+" left)" );
                    $( "#q2FoodStorage" ).html( "Q2 Food ("+json.q2FoodStorage+" left)" );
                    $( "#q3FoodStorage" ).html( "Q3 Food ("+json.q3FoodStorage+" left)" );
                    $( "#q4FoodStorage" ).html( "Q4 Food ("+json.q4FoodStorage+" left)" );
                    $( "#q5FoodStorage" ).html( "Q5 Food ("+json.q5FoodStorage+" left)" );

                    $( ".usedHealth" ).animate( { "width" : json.wellness+"%" }, 500 );
                    updateHealthButtons();

                    var divList = $( "#eatMenu form" ).children( "div" );
                    divList.eq(0).children( "div" ).text( json.q1FoodStorage );
                    divList.eq(1).children( "div" ).text( json.q2FoodStorage );
                    divList.eq(2).children( "div" ).text( json.q3FoodStorage );
                    divList.eq(3).children( "div" ).text( json.q4FoodStorage );
                    divList.eq(4).children( "div" ).text( json.q5FoodStorage );

                    if( json.error != "" ) {
                        $( '#hiddenError' ).html( json.error );
                        $.blockUI({ message: $( '#eatError' ), css: { width: '400px', border: '0px', background: 'rgba(255,255,255,0)' } });
                    }
                }
            });
        });

        var newGiftButton = $( "<input type='button' id='newGiftButton' value='Use' />" )
        $( "#useGiftMenu" ).append( newGiftButton );
        $( "#useGiftMenu form" ).append( $( "#useGiftButton" ) );

        newGiftButton.bind( "click", function() {
            var dataString = 'quality='+ $("#giftQuality").val();
            $.ajax({
                type: "POST",
                url: "gift.html",
                data: dataString,
                success: function( msg ) {
                    var json = jQuery.parseJSON( msg );

                    $( "#giftLimit" ).html( json.giftLimit );
                    $( "#healthProgress .ui-progressbar-value" ).css({ width: json.wellness + "%" });

                    $( "#q1GiftStorage" ).html( "Q1 Gift ("+json.q1GiftStorage+" left)" );
                    $( "#q2GiftStorage" ).html( "Q2 Gift ("+json.q2GiftStorage+" left)" );
                    $( "#q3GiftStorage" ).html( "Q3 Gift ("+json.q3GiftStorage+" left)" );
                    $( "#q4GiftStorage" ).html( "Q4 Gift ("+json.q4GiftStorage+" left)" );
                    $( "#q5GiftStorage" ).html( "Q5 Gift ("+json.q5GiftStorage+" left)" );

                    var divList = $( "#useGiftMenu form" ).children( "div" );
                    divList.eq(0).children( "div" ).text( json.q1GiftStorage );
                    divList.eq(1).children( "div" ).text( json.q2GiftStorage );
                    divList.eq(2).children( "div" ).text( json.q3GiftStorage );
                    divList.eq(3).children( "div" ).text( json.q4GiftStorage );
                    divList.eq(4).children( "div" ).text( json.q5GiftStorage );

                    $( ".usedHealth" ).animate( { "width" : json.wellness+"%" }, 500 );
                    updateHealthButtons();

                    if( json.error != "" ) {
                        $( '#hiddenError' ).html( json.error );
                        $.blockUI({ message: $( '#eatError' ), css: { width: '400px', border: '0px', background: 'rgba(255,255,255,0)' } });
                    }
                }
            });
        });


        // Redesign food and gift limits
        $( "#foodLimit" ).addClass( "foodLimitMod" );
        $( "#giftLimit" ).addClass( "giftLimitMod" );
        $( "#eatMenu form" ).append( $( "#foodLimit" ) );
        $( "#useGiftMenu form" ).append( $( "#giftLimit" ) );

        $( "#foodQuality" ).css({ "display" : "none" });
        $( "#giftQuality" ).css({ "display" : "none" });
        $( "#eatButton" ).css({ "display" : "none" });
        $( "#useGiftButton" ).css({ "display" : "none" });

        $( "#eatLink" ).prev().remove();
        $( "#eatMenu" ).prev().remove();
        $( "#useGiftLink" ).prev().remove();
        $( "#useGiftLink" ).next().remove();
        if( isOrgAccount() ) {
            $( "#eatLink" ).prev().remove();
            $( "#eatLink" ).prev().remove();
            $( "#useGiftLink" ).prev().remove();
        }

        // Default max quality items
        if( maxIndexFood > 0 ) { vecItemsFood[ maxIndexFood-1].click(); }
        if( maxIndexGift > 0 ) { vecItemsGift[ maxIndexGift-1].click(); }

        showHideButtons();
        updateHealthButtons();

        if( $( "#stats" ).children( "form" ).length != 0 ) {
            var form = $( "#stats" ).children( "form" );
            form.contents().eq(4).remove();
            form.children( "img" ).css({ "margin" : "2px 7px 0px 0px" });

            // Rellocate wiki help
            var lastDiv = $( "#stats" ).children( "div:last" );
            lastDiv.css({ "float" : "right", "margin" : "6px 3px 0px 0px" });
            lastDiv.children( "a" ).text( "" ).append( lastDiv.children( "img" ) );
            form.children( "br" ).remove();
            form.append( lastDiv );
        }
    }

    showHideButtons();

    // Show and hide Food/Gift buttons
    function showHideButtons() {

        // Show/Hide button
        var showHide = $( "<div id='showHide'></div>" );
        showHide.append( "<span class='arrow'> &darr;&darr; </span>" );
        showHide.append( "<span style='font-weight:bold; color:#3787ea;'> Eat food / Use gift </span>" );
        showHide.append( "<span class='arrow'> &darr;&darr; </span>" );
        showHide.insertBefore( $( "#eatMenu" ) );

        // On battle page will be always visible
        var foodGiftVisible = true;
        var localUrl = new String( window.location );
        if( localUrl.indexOf( URLBattle, 0 ) == -1 ) {
            foodGiftVisible = false;
            $( "#eatMenu" ).hide();
            $( "#useGiftMenu" ).hide();
            $( "#useGiftMenu" ).next().hide();

            showHide.children( ".arrow" ).text( String.fromCharCode(8593) + String.fromCharCode(8593) )
        }

        showHide.bind( "click", function() {
            var time = 0;
            foodGiftVisible = !foodGiftVisible;
            $( "#eatMenu" ).toggle( time );
            $( "#useGiftMenu" ).toggle( time );
            $( "#useGiftMenu" ).next().toggle( time );

            if( foodGiftVisible ) {
                showHide.children( ".arrow" ).text( String.fromCharCode(8595) + String.fromCharCode(8595) );
            } else showHide.children( ".arrow" ).text( String.fromCharCode(8593) + String.fromCharCode(8593) );
        });
    }


    // Update health buttons to enable or disable
    function updateHealthButtons() {

        var h = $( "#healthProgress" ).attr( "title" );
        h = parseInt( h.split( "/" )[0] );
        var foodLimit = parseInt( $( "#foodLimit" ).text() );
        var giftLimit = parseInt( $( "#giftLimit" ).text() );
        if( foodLimit == 0 ) {
            disableButton( $( "#newEatButton" ) );

        } else {
            if( selectedFood ) {
                var eatQ = parseInt( selectedFood.attr( "indexselect" ) ) * 10;
                if( (eatQ + h) > 100 ) {
                    disableButton( $( "#newEatButton" ) );
                } else {
                    enableButton( $( "#newEatButton" ) );
                }

            } else enableButton( $( "#newEatButton" ) );
        }

        if( giftLimit == 0 ) {
            disableButton( $( "#newGiftButton" ) );

        } else {
            if( selectedGift ) {
                var useQ = parseInt( selectedGift.attr( "indexselect" ) ) * 10;
                if( (useQ + h) > 100 ) {
                    disableButton( $( "#newGiftButton" ) );
                } else {
                    enableButton( $( "#newGiftButton" ) );
                }

            } else enableButton( $( "#newGiftButton" ) );
        }

        updateFightButtons();
    }


    // Disable button
    function disableButton( btn ) {
        btn.attr( "disabled", "disabled" );
        btn.addClass( "buttonDisable" );
    }


    // Enable button
    function enableButton( btn ) {
        btn.removeAttr( "disabled" );
        btn.removeClass( "buttonDisable" );
    }

    updateFightButtons();

    // Update fight buttons
    function updateFightButtons() {

        // Only on battle page
        if( (new String( window.location )).indexOf( URLBattle, 0 ) >= 0 ) {

            // If is RW
            if( $( ".fightButton2" ).length == 4 ) {

                var btnFight1 = $( ".fightButton2" ).eq(0);
                var btnFight2 = $( ".fightButton2" ).eq(1);
                var btnBk1 = $( ".fightButton2" ).eq(2);
                var btnBk2 = $( ".fightButton2" ).eq(3);
                var h = parseInt( $( "#healthBar" ).text() );
                if( h < 10 ) {
                    disableButton( btnFight1 );
                    disableButton( btnFight2 );
                    disableButton( btnBk1 );
                    disableButton( btnBk2 );

                } else if( h < 50 ) {
                    enableButton( btnFight1 );
                    enableButton( btnFight2 );
                    disableButton( btnBk1 );
                    disableButton( btnBk2 );

                } else {
                    enableButton( btnFight1 );
                    enableButton( btnFight2 );
                    enableButton( btnBk1 );
                    enableButton( btnBk2 );
                }

            } else {

                var btnFight = $( ".fightButton" ).eq(0);
                var btnBk = $( ".fightButton" ).eq(1);
                var h = parseInt( $( "#healthBar" ).text() );
                if( h < 10 ) {
                    disableButton( btnFight );
                    disableButton( btnBk );

                } else if( h < 50 ) {
                    enableButton( btnFight );
                    disableButton( btnBk );

                } else {
                    enableButton( btnFight );
                    enableButton( btnBk );
                }
            }

            // Add update weapon method
            $.blockUI.defaults.onUnblock = function( elem, opts ) { updateHealthButtons(); }
        }
    }

    function changeInboxMessagesURL()
    {
        // Changing inbox messages URL "inboxMessages.html" to "premiumMessages.html"
        $( "#inboxMessagesMission" ).attr( "href", "inboxMessages.html" );
    }

    function addEETLinks()
    {
        // Adding "Others, links to e-sim
        $( ".foundation-left" ).append('<li class="divider"> <li class="link"><a id="statisticsMenu" target="_blank" href="http://csgoclan.pe.hu"><i class="icon-tools"></i>e-Simpler</a> <li class="divider">  ');
    }



    // Add MU fast links
    function addMUFastLinks() {

        // Link to MU
        var linkMU = $( "<a style='margin: 2px;' title='Military unit' class='button foundation-style smallhelp only-icon profileButton' href='"+ getCurrentServer() + URLMyMU +"'><img src='"+ IMGMU +"' /></a>"  );
        linkMU.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });

        // Link to MU storage
        var linkMUSt = $( "<a style='margin: 2px;' title='MU storage' class='button foundation-style smallhelp only-icon profileButton' href='"+ getCurrentServer() + URLMUStorage +"'><img src='"+ IMGPACKAGE +"' /></a>"  );
        linkMUSt.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });

        // Link to MU money
        var linkMUMy = $( "<a style='margin: 2px;' title='MU money' class='button foundation-style smallhelp only-icon profileButton' href='"+ getCurrentServer() + URLMUMoney +"'><img src='"+ IMGDOLLAR +"' /></a>"  );
        linkMUMy.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });

        //------------------------------------------------------

        // Link to Donate MU money
        var linkDMUMy = $( "<a style='margin: 2px;' title='Donate money to MU' class='button foundation-style smallhelp only-icon profileButton' href='"+ getCurrentServer() + URLDMUMoney +getMUId()+"'><img src='"+ IMGDMUMy +"' /></a>"  );
        linkDMUMy.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });

        // Link to Donate MU product
        var linkDMUPR = $( "<a style='margin: 2px;' title='Donate product to MU' class='button foundation-style smallhelp only-icon profileButton' href='"+ getCurrentServer() + URLDMUProduct +getMUId()+"'><img src='"+ IMGDMUPR +"' /></a>"  );
        linkDMUPR.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });

        // Link to Donate MU Company
        var linkDMUCP = $( "<a style='margin: 2px;' title='Donate Company to MU' class='button foundation-style smallhelp only-icon profileButton' href='"+ getCurrentServer() + URLDMUComp +getMUId()+"'><img src='"+ IMGDMUCP +"' /></a>"  );
        linkDMUCP.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });


        //--------------------------------------
        // Link to Mu members
        var linkMUMEMB = $( "<a style='margin: 2px;' title='MU Members' class='button foundation-style smallhelp only-icon profileButton' href='"+ getCurrentServer() + URLMUMEMB +getMUId()+"'><img src='"+ IMGMUMEMB +"' /></a>"  );
        linkMUMEMB.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });


        // Link to Mu Companys
        var linkMUComp = $( "<a style='margin: 2px; margin-bottom: 9px;' title='MU Companies' class='button foundation-style smallhelp only-icon profileButton' href='"+ getCurrentServer() + URLMUCOMP +getMUId()+"'><img src='"+ IMGMUCOMP +"' /></a>"  );
        linkMUComp.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });



        var content = $( "<div style= font-weight:bold; height:30px;'></div>" );
        content.append( "<hr class='foundation-divider'>" );

        configList = new Array("config_MFB_mu","config_MFB_st","config_MFB_mm","config_MFB_dc","config_MFB_dp","config_MFB_dm","config_MFB_mc","config_MFB_mumem");

        appendList = new Array(linkMU,linkMUSt,linkMUMy,linkDMUCP,linkDMUPR,linkDMUMy,linkMUComp,linkMUMEMB);

        brIndex=0;

        for(i=0;i<configList.length;i++)
        {
            if( getValue( configList[i] ) == "true" ) { content.append( appendList[i] ); brIndex++; }
            if( brIndex == 4 ) {content.append( "<br />" );brIndex=0;}

        }


        content.insertAfter( $( "#EDLinks div:first" ));
    }



    // Add other fast links
    function addFastLinks() {
        var padding = 4;
        // Link to equipment
        var linkEquip = $( "<a style='padding:"+padding+"px' class='fastLinks ' href='"+ getCurrentServer() + URLEquipment +"'></a>"  );
        linkEquip.append( "<img src='"+ IMGEQUIPMENT +"' />" );
        linkEquip.attr( "title", "Equipment" );
        linkEquip.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });

        // Link to my companies
        var linkComp = $( "<a style='padding:"+padding+"px' class='fastLinks ' href='"+ getCurrentServer() + URLCompanies +"'></a>"  );
        linkComp.append( "<img src='"+ IMGCOMPANY +"' />" );
        linkComp.attr( "title", "My companies" );
        linkComp.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });

        // Future image buttons
        // Link to contracts
        var linkCT = $( "<a style='padding:"+padding+"px' class='fastLinks' href='"+ getCurrentServer() + URLContracts +"'><img src='"+ IMGCT +"' /></a>"  );
        linkCT.attr( "title", "Contracts" );
        linkCT.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });

        // Link to shares
        var linkSH = $( "<a style='padding:"+padding+"px' class='fastLinks' href='"+ getCurrentServer() + URLMyShares +"'><img src='"+ IMGSH +"' /></a>"  );
        linkSH.attr( "title", "Shares" );
        linkSH.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });

        // Link to product market
        var linkPM = $( "<a style='padding:"+padding+"px' class='fastLinks' href='"+ getCurrentServer() + URLMarket +"'><img src='"+ IMGPM +"' /></a>"  );
        linkPM.attr( "title", "Product market" );
        linkPM.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });

        // Link to monetary market
        var linkMM = $( "<a style='padding:"+padding+"px' class='fastLinks' href='"+ getCurrentServer() + URLMonetaryMarket +"'><img src='"+ IMGMM +"' /></a>"  );
        linkMM.attr( "title", "Monetary market" );
        linkMM.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });

        // Link to Travel
        var linkTV = $( "<a style='padding:"+padding+"px' class='fastLinks' href='"+ getCurrentServer() + URLTravel +"'><img src='"+ IMGTV +"' /></a>"  );
        linkTV.attr( "title", "Travel" );
        linkTV.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });

        // Link to BUFF
        var linkBUF = $( "<a style='padding:"+padding+"px' class='fastLinks' href='"+ getCurrentServer() + URLBUFF +"'><img src='"+ IMGBUFF +"' /></a>"  );
        linkBUF.attr( "title", "Buff" );
        linkBUF.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });

        // Link to Newbies
        var linkNB = $( "<a style='padding:"+padding+"px' class='fastLinks' href='"+ getCurrentServer() + URLNB +"'><img src='"+ thumbsUp +"' /></a>"  );
        linkNB.attr( "title", "New Citizens" );
        linkNB.tooltip({ tooltipClass: "tooltipFastButton", position: { my: "center top+4", at: "center bottom" } });


        var content = $( "<div style='font-weight:bold; height:auto;'></div>" );
        var total = 0;
        if( getValue( "config_FB_eq"    ) == "true" ) { content.append( linkEquip ); total++; }
        if( getValue( "config_FB_co"    ) == "true" ) { content.append( linkComp  ); total++; }
        if( getValue( "config_FB_con"   ) == "true" ) { content.append( linkCT    ); total++; }
        if( getValue( "config_FB_share" ) == "true" ) { content.append( linkSH    ); total++; }
        if( getValue( "config_FB_pm"    ) == "true" ) { content.append( linkPM    ); total++; }
        if( total == 5 ) content.append( "<div style='margin: 7px;'></div>" );
        if( getValue( "config_FB_mm"    ) == "true" ) { content.append( linkMM    ); total++; }
        if( total == 5 ) content.append( "<div style='margin: 7px;'></div>" );
        if( getValue( "config_FB_trav"  ) == "true" ) { content.append( linkTV    ); total++; }
        if( total == 5 ) content.append( "<div style='margin: 7px;'></div>" );
        if( getValue( "config_FB_buff"  ) == "true" ) { content.append( linkBUF   ); total++; }
        if( total == 5 ) content.append( "<div style='margin: 7px;'></div>" );
        if( getValue( "config_FB_newC"  ) == "true" ) { content.append( linkNB    ); total++; }

        content.insertAfter( $( "#EDLinks div:first" ));
    }




    //MU comp sorter
    function sortMucomp(){

        $(".dataTable").before('<button style="display:none" id="sort" class="sort-table asc">Sort</button>')

        //



        $('.sort-table').click(function(e) {
            var $sort = this;
            var $table = $('.dataTable');
            var $rows = $('tbody > tr',$table);
            $rows.sort(function(a, b){
                var keyA = $('td:eq(1) div div img:eq(0)',a).attr("src");
                //alert(keyA)
                var keyB = $('td:eq(1) div div img:eq(0)',b).attr("src");
                var keyC = $('td:eq(1) div div img:eq(1)',a).attr("src");
                var keyD = $('td:eq(1) div div img:eq(1)',b).attr("src");

                //alert(keyC + "-" + keyD)

                if($($sort).hasClass('asc')){
                    if(keyA > keyB){

                        return 1
                    }

                    if(keyA == keyB){
                        if(keyC < keyD){
                            return 1
                        }else{
                            return 0
                        }
                    }

                    if(keyA < keyB){

                        return 0
                    }


                } else {
                    return (keyA > keyB) ? 1 : 0;
                }
            });
            $.each($rows, function(index, row){
                $table.append(row);
            });
            e.preventDefault();
        });

        $("#sort").trigger("click");

    }




    // Get ID player
    function getPlayerID() {
        if( !idPlayer ) {
            var link = $( "#userName" ).attr( "href" );
            if( link ) {
                if( link.split( "id=" ).length == 2 ) {
                    idPlayer = link.split( "id=" )[1];
                }
            }
        } return( idPlayer );
    }
    //Change Transaction list def.

    function changeTLL(){
        if(window.location.search==""){
            $("#type").find("option:selected").prop('selected', false)
            $("#type").find("option:eq(1)").prop('selected', true)

            $("#transactionLogForm").submit();
        }
    }


    // Get current server
    function getCurrentServer() {
        if( !currentServer ) {
            var localUrl = new String( window.location );
            var ini = localUrl.indexOf( "https://", 0 );
            var end = localUrl.indexOf( ".", 0 );
            currentServer = localUrl.substr( ini, end-ini+1 );
        } return( currentServer );
    }


    // Add version on all pages if not Battlepage
    function addVersion() {

        // Version
        var vers = $( "<div style='margin-top: 7px;' class='version'>" + VERSION + "</div>" );
        var optionVisible = false;
        vers.bind( "click", function() {
            $.blockUI({
                message: $('#configScript'),
                css: {
                    top: "48px",
                    left: ($(window).width() - 600) /2 + 'px',
                    width: '600px' ,
                    border: "0px",
                    position: "absolute",
                    textAlign: "left"

                }
            });

        });

        var content = $( "<div id='EDLinks' class='switch foundation-style' style='margin-top:5px; display:block; font-weight:bold; height:auto;'></div>" );
        content.insertAfter( $( "#userMenu div div:first" ) );
        content.append( vers );


    }


    // Add configuration
    function addConfigurationUI() {

        // Add mask and config
        var mask = $( "<div style='background-color:black; opacity:0.5; min-height: 100%;' id='maskConfig'></div>" );
        var configScript = $( "<div role='dialog' style='display: table; outline: 0px none; z-index: 1000; width:600px; ' class='ui-dialog ui-widget ui-widget-content ui-corner-all ui-draggable ui-dialog-buttons' id='configScript'></div>" );




        $( "body" ).append( configScript );

        // Title
        configScript.append( "<h2 class='titleConfig'>Configuration "+ VERSION +"</h2>" );
        configScript.append( "<br/>" );

        // Global config
        var globalBlock = $( "<div id='globalBlock'>GLOBAL</div>" );
        var configShowEET = createCheckBox( "Show E-sim Economy Tools links in toolbar", "configShowEETLinks" );
        globalBlock.append( configShowEET );
        var configMoveNotify = createCheckBox( "Move notifications", "configMoveNotifications" );
        globalBlock.append( configMoveNotify );
        var configEatButtons = createCheckBox( "Food/Gifts buttons", "configEatButtons" );
        globalBlock.append( configEatButtons );
        var configSkillImprovements = createCheckBox( "Skill Improvements", "configSkillImprovements" );
        globalBlock.append( configSkillImprovements );
        var configOrgAcc = createCheckBox( "Remove useless items if Org.", "configOrgAcc" );
        globalBlock.append( configOrgAcc );
        var configRemoveUselessFastButtons = createCheckBox( "Remove useless fast buttons.", "configRemoveUselessFastButtons" );
        globalBlock.append( configRemoveUselessFastButtons );
        var configSomeFix = createCheckBox( "Fix some things", "configSomeFix" );
        globalBlock.append( configSomeFix );
        var configHideMissionStuff = createCheckBox( "Hide Misson stuffs", "configHideMissionStuff" );
        globalBlock.append( configHideMissionStuff );

        // MU storage
        var muStorageBlock = $( "<div id='muStorageBlock'>MU STORAGE</div>" );
        var muStorageDonateToMe = createCheckBox( "Button: Donate me", "configMUStorageDonateToMe" );
        muStorageBlock.append( muStorageDonateToMe );
        var muStorageSelect = createCheckBox( "Product selection", "configMUStorageSelect" );
        muStorageBlock.append( muStorageSelect );
        var muStorageFastButtons = createCheckBox( "Fast buttons", "configMUStorageFastButtons" );
        muStorageBlock.append( muStorageFastButtons );
        var muStorageDonateImprovements = createCheckBox( "Donate improvements", "configMUStorageDonateImprovements" );
        muStorageBlock.append( muStorageDonateImprovements );
        var muStorageItemCounter = createCheckBox( "Donate counter", "configMUStorageDonateCounter" );
        muStorageBlock.append( muStorageItemCounter );

        // MU money
        var muMoneyBlock = $( "<div id='muMoneyBlock'>MU MONEY</div>" );
        var muMoneyDonateToMe = createCheckBox( "Button: Donate me", "configMUMoneyDonateToMe" );
        muMoneyBlock.append( muMoneyDonateToMe );
        var muMoneyDonateImprovements = createCheckBox( "Donate improvements", "configMUMoneyDonateImprovements" );
        muMoneyBlock.append( muMoneyDonateImprovements );

        // Donate
        var donateBlock = $( "<div id='donateBlock'>DONATE</div>" );
        var donateProduct = createCheckBox( "Product selection", "configDonateProduct" );
        donateBlock.append( donateProduct );
        var donateFastButtons = createCheckBox( "Fast buttons", "configDonateFastButtons" );
        donateBlock.append( donateFastButtons );

        // Battle
        var battleBlock = $( "<div id='battleBlock'>BATTLE</div>" );
        var roundSelector = createCheckBox( "Round selector", "configRoundSelector" );
        battleBlock.append( roundSelector );
        var battleList = createCheckBox( "Battle list", "configBattleList" );
        battleBlock.append( battleList );
        var weaponSelector = createCheckBox( "Weapon selector", "configWeaponSelector" );
        battleBlock.append( weaponSelector );
        var ExtraEatUseButton = createCheckBox( "Add Eat Button", "configExtraEatUseButton" );
        battleBlock.append( ExtraEatUseButton );
        var configExtraInfo = createCheckBox( "Extra Info to Wep Selector", "configExtraInfo" );
        battleBlock.append( configExtraInfo );



        // Equipment
        var equipmentBlock = $( "<div id='equipmentBlock'>EQUIPMENT</div>" );
        var removeInterface = createCheckBox( "Remove interface", "configDesignEquipment" );
        equipmentBlock.append( removeInterface );
        var calculatorDamage = createCheckBox( "Damage simulator", "configCalculateDamage" );
        equipmentBlock.append( calculatorDamage );


        // Shares
        var sharesBlock = $( "<div id='sharesBlock'>SHARES</div>" );
        var sharesRedesign = createCheckBox( "Menu redesign", "configSharesMenu" );
        var sharesProductSelection = createCheckBox( "Product selection", "configSharesProductSelection" );
        sharesBlock.append( sharesRedesign );
        sharesBlock.append( sharesProductSelection );
        var configStockcoEditOffers = createCheckBox( "Editable price and quanty", "configStockcoEditOffers" );
        sharesBlock.append( configStockcoEditOffers );

        // Travel
        var travelBlock = $( "<div id='travelBlock'>TRAVEL</div>" );
        var configTravelMenu = createCheckBox( "Ticket selection", "configTravelMenu" );
        travelBlock.append( configTravelMenu );

        // New Citizen
        var NewCitizenBlock = $( "<div id='NewCitizenBlock'>New Citizen</div>" );
        //Article
        var ArticleBlock = $( "<div id='ArticleBlock'>Article</div>" );
        var configBBcode = createCheckBox( "BB codes", "configBBcode" );
        ArticleBlock.append( configBBcode );

        // Search

        var SearchBlock = $( "<div id='SearchBlock'>Cititzen Search</div>" );
        var configEBS = createCheckBox( "Extra Buttons to search", "configEBS" );
        SearchBlock.append( configEBS );


        // Company
        var companyBlock = $( "<div id='companyBlock'>COMPANY</div>" );
        var configCompanyMenu = createCheckBox( "Menu redesign", "configCompanyRedesign" );
        var configCompanyWorkResults = createCheckBox( "Work results", "configCompanyWorkResults" );
        companyBlock.append( configCompanyMenu );
        companyBlock.append( configCompanyWorkResults );

        // Market
        var marketBlock = $( "<div id='marketBlock'>MARKET</div>" );
        var configProductMarketSelection = createCheckBox( "Product selection", "configProductMarketSelection" );
        marketBlock.append( configProductMarketSelection );
        var configProductMarketTable = createCheckBox( "Product table", "configProductMarketTable" );
        marketBlock.append( configProductMarketTable );
        var configProductMarketOffers = createCheckBox( "My offers", "configProductMarketOffers" );
        marketBlock.append( configProductMarketOffers );
        var configEditOffers = createCheckBox( "Editable price and quanty", "configEditOffers" );
        marketBlock.append( configEditOffers );
        var configProductMarketAdvanced = createCheckBox( "Product Market Advanced", "configProductMarketAdvanced" );
        marketBlock.append( configProductMarketAdvanced );

        // Monetary market
        var monetaryMarketBlock = $( "<div id='monetaryMarketBlock'>MONETARY MARKET</div>" );
        var configMonetaryMarketSelection = createCheckBox( "Money selection", "configMonetaryMarketSelection" );
        monetaryMarketBlock.append( configMonetaryMarketSelection );
        var configMonetaryMarketTable = createCheckBox( "Money table", "configMonetaryMarketTable" );
        monetaryMarketBlock.append( configMonetaryMarketTable );
        var configEditPrice= createCheckBox( "Edit Price and Quanty", "configEditPrice" );
        monetaryMarketBlock.append( configEditPrice );
        var configRatioPrice= createCheckBox( "Advanced Ratio and Price", "configRatioPrice" );
        monetaryMarketBlock.append( configRatioPrice );

        //OTHERS
        var OthersBlock = $( "<div id='OthersBlock'>Others</div>" );
        var configProfile= createCheckBox( "Profile - Today DMG", "configProfile" );
        OthersBlock.append( configProfile );
        OthersBlock.append( "<hr /><br />" );
        var configkari= createCheckBox( "Christmass Extra", "configKari" );
        OthersBlock.append( configkari );
        var configAlertPreview= createCheckBox( "Alert Preview", "configAlertPreview" );
        OthersBlock.append( configAlertPreview );


        // Theme weapon selector
        var weaponSel = $( "<select id='weaponSelectorTheme' class='customSelectList'></select>" );
        weaponSel.append( "<option value='default'>eSim</option>" );
        //weaponSel.append( "<option value='AoE'>Age of empires</option>" );
        //weaponSel.append( "<option value='SW'>Star Wars</option>" );
        //weaponSel.append( "<option value='Pok'>Pok�?mon</option>" );
        weaponSel.bind( "change", function() {
            setValue( "configWeaponTheme", $(this).val() );
        });

        // Selector of default weapon
        var defaultWeapon = $( "<select id='defaultWeapon' class='customSelectList'></select>" );
        defaultWeapon.append( "<option value='0'>Unarmed</option>" );
        for( var i=1; i<=5; i++ ) { defaultWeapon.append( "<option value='"+i+"'>Q"+i+"</option>" ); }
        defaultWeapon.bind( "change", function() {
            setValue( "configDefaultWeapon", $(this).val() );
        });

        //THEME AND WEP BLock
        var themeAndWep = $( "<div id='themeAndWep'>Theme And Wep<br /></div>" );
        themeAndWep.append( "<b>Theme: </b>" );
        themeAndWep.append( weaponSel );
        weaponSel.val( getValue( "configWeaponTheme" ) );
        themeAndWep.append( "<b>Default weapon: </b>" );
        themeAndWep.append( defaultWeapon );
        defaultWeapon.val( getValue( "configDefaultWeapon" ) );

        // Close button
        //configScript.append( "" );
        var close = $( "<input class='postfix only-icon button foundation-style' style='margin-top:2px' type='button' value='Save and close' />" );
        close.bind( "click", function() { saveLinkBarLinks();$.unblockUI(); $( "#maskConfig" ).hide(); $( "#configScript" ).hide(); });

        //FAST BUTTONS

        var FBBlock = $( "<div id='FBBlock'></div>" );

        var fastLinks = createCheckBox( "Fast Links", "configFastLinks" );
        FBBlock.append( fastLinks );
        FBBlock.append( "<hr />" );


        var config_FB_eq = createCheckBox( "Equipment", "config_FB_eq" );
        FBBlock.append( config_FB_eq );
        //-------------
        var config_FB_co = createCheckBox( "Companys", "config_FB_co" );
        FBBlock.append( config_FB_co);
        //-------------
        var config_FB_con = createCheckBox( "Contract", "config_FB_con" );
        FBBlock.append( config_FB_con );
        //-------------
        var config_FB_share = createCheckBox( "Shares", "config_FB_share" );
        FBBlock.append( config_FB_share );
        //-------------
        var config_FB_pm = createCheckBox( "Product Market", "config_FB_pm" );
        FBBlock.append( config_FB_pm );
        //-------------
        var config_FB_mm = createCheckBox( "Monetary Market", "config_FB_mm" );
        FBBlock.append( config_FB_mm );
        //-------------
        var config_FB_trav = createCheckBox( "Travel", "config_FB_trav" );
        FBBlock.append( config_FB_trav );
        //-------------
        var config_FB_buff = createCheckBox( "Buff", "config_FB_buff" );
        FBBlock.append( config_FB_buff );
        //-------------
        var config_FB_newC = createCheckBox( "New Citizens", "config_FB_newC" );
        FBBlock.append( config_FB_newC );
        //-------------
        //MUFasTBUttons
        FBBlock.append( "<br /><br />" );
        var muFastLinks = createCheckBox( "MU Fast links", "configMUFastLinks" );
        FBBlock.append( muFastLinks );
        FBBlock.append( "<hr />" );
        //-------------
        var config_MFB_mu = createCheckBox( "My Military Unit", "config_MFB_mu" );
        FBBlock.append( config_MFB_mu );
        //-------------
        var config_MFB_st = createCheckBox( "MU Storage", "config_MFB_st" );
        FBBlock.append( config_MFB_st );
        //-------------
        var config_MFB_mm = createCheckBox( "MU Money", "config_MFB_mm" );
        FBBlock.append( config_MFB_mm );
        //-------------
        var config_MFB_dc = createCheckBox( "MU Donate Company", "config_MFB_dc" );
        FBBlock.append( config_MFB_dc );
        //-------------
        var config_MFB_dp = createCheckBox( "MU Donate Product", "config_MFB_dp" );
        FBBlock.append( config_MFB_dp );
        //-------------
        var config_MFB_dm = createCheckBox( "MU Donate Money", "config_MFB_dm" );
        FBBlock.append( config_MFB_dm );
        //-------------
        var config_MFB_mc = createCheckBox( "MU Companys", "config_MFB_mc" );
        FBBlock.append( config_MFB_mc );
        //-------------
        var config_MFB_mumem= createCheckBox( "MU Members", "config_MFB_mumem" );
        FBBlock.append(config_MFB_mumem );
        //-------------

        configScript.append( "<table align='center' border='0' cellpadding='5' cellspacing='1' style='width: 550px;'><tbody><tr><td id='configScripttabel_1'></td><td id='configScripttabel_2'></td><td id='configScripttabel_3'></td></tr><tr><td id='configScripttabel_4'></td><td id='configScripttabel_5'></td><td id='configScripttabel_6'></td></tr><tr><td id='configScripttabel_7'></td><td id='configScripttabel_8'></td><td id='configScripttabel_9'></td></tr><tr><td id='configScripttabel_10'></td><td id='configScripttabel_11'></td><td id='configScripttabel_12'></td></tr><tr><td id='configScripttabel_13'></td><td id='configScripttabel_14'></td><td id='configScripttabel_15'></td></tr><tr><td id='configScripttabel_16'></td><td id='configScripttabel_17'></td><td id='configScripttabel_18'></td></tr></tbody></table> " );

        configScript.append( '<div id="tabs"></div>');
        $("#tabs").append( '<ul>\
<li><a href="#globalBlock">Global</a></li>\
<li><a href="#FBBlock">Fast Links</a></li>\
<li><a href="#MUBlock">MU Main</a></li>\
<li><a href="#muStorageBlock">MU Storage</a></li>\
<li><a href="#muMoneyBlock">MU Money</a></li>\
<li><a href="#donateBlock">Donate</a></li>\
<li><a href="#battleBlock">Battle</a></li>\
<li><a href="#equipmentBlock">Equipment</a></li>\
<li><a href="#sharesBlock">Shares</a></li>\
<li><a href="#travelBlock">Travel</a></li>\
<li><a href="#NewCitizenBlock">New Citizen</a></li>\
<li><a href="#ArticleBlock">Article</a></li>\
<li><a href="#SearchBlock">Search</a></li>\
<li><a href="#companyBlock">Company</a></li>\
<li><a href="#marketBlock">Product Market</a></li>\
<li><a href="#monetaryMarketBlock">Monetary Market</a></li>\
<li><a href="#themeAndWep">Theme And Wep</a></li>\
<li><a href="#linkBar">LinkBar</a></li>\
<li><a href="#OthersBlock">Others</a></li>\
</ul>');


        $("#tabs").append( globalBlock );
        $("#tabs").append( FBBlock );
        $("#tabs").append( battleBlock );
        $("#tabs").append( muStorageBlock );
        $("#tabs").append( donateBlock );
        $("#tabs").append( equipmentBlock );
        $("#tabs").append( muMoneyBlock );
        $("#tabs").append( sharesBlock );
        $("#tabs").append( companyBlock );
        $("#tabs").append( monetaryMarketBlock );
        $("#tabs").append( marketBlock );
        $("#tabs").append( travelBlock );
        $("#tabs").append( SearchBlock );
        $("#tabs").append( NewCitizenBlock );
        $("#tabs").append( ArticleBlock );
        $("#tabs").append( MUBlock );
        $("#tabs").append( themeAndWep );
        $("#tabs").append( Linkbar );
        $("#tabs").append( OthersBlock );

        $( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
        $( "#tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );

        //Visszat�lt�s
        fillBack()

        configScript.append( close );

        //Bez�r�s
        $( "#maskConfig" ).hide(); $( "#configScript" ).hide();
    }

    function fillBack()
    {

        for(i=1;i<11;i++)
        {
            sid="#LB_"+""+i;
            $(sid).val(getValue("LB_"+""+i));
            sid="#LBT_"+""+i;
            $(sid).val(getValue("LBT_"+""+i));
        }

    }

    //saveLinkBarLinks()
    function saveLinkBarLinks()
    {

        //alert("save")

        for(i=1;i<11;i++)
        {
            sid="#LB_"+""+i;
            setValue("LB_"+""+i,$(sid).val());
            sid="#LBT_"+""+i;
            setValue("LBT_"+""+i,$(sid).val());

        }

    }

    createCheckBox(label, configLabel);
    // Create checkbox and label
    function createCheckBox( label, configLabel ) {
        var div = $( "<div></div>" );
        var checked = (getValue( configLabel ) == "true") ? "checked='checked'" : "";
        div.append( "<input class='configCheckbox' type='checkbox' "+ checked +" />" );
        div.children( "input" ).bind( "change", function() {
            setValue( configLabel, ($(this).attr( "checked" ) == "checked") );
        });
        div.append( "<span class='configLabelCheckbox'>"+ label +"</span>" );
        div.children( "span" ).bind( "click", function() {
            div.children( "input" ).click();
            div.children( "input" ).change();
        });
        return( div );
    }

    // Update MU orders if changed on main page
    function updateMUOrdersMain() {

        $( ".testDivblue" ).each( function() {

            if( $(this).children( "center" ).length == 2 ) {

                var savedBattle = getValue( "MUSavedBattle" );
                var battle = $(this).find( "a[href^='battle.html?id=']" ).attr( "href" );
                if( !battle ) { return; }
                var side = $("#eventTeamImage b div").attr("class").split(" ")[1];
                //side = side.replace( "small", "medium" );

                if( savedBattle != battle ) {

                    // alert(battle +" -- ")

                    setValue( "MUSavedBattle", battle );
                    setValue( "MUSide", side );

                    // Open MU page to check quality and text orders
                    $.ajax({
                        url: getCurrentServer() + URLMyMU,
                        success: function( data ) {
                            var table = $( data ).find( "#militaryUnitContainer table" );
                            var tr = table.find( "tr" ).eq(0);
                            var td = tr.find( "td" ).eq(1);

                            var MURank = td.children( "div" ).first().find("table tr:eq(1) td:eq(1)").text().toLowerCase();


                            //alert(MURank)

                            if( MURank == "novice" ) { setValue( "MURank", "5" );
                                                     } else if( MURank == "regular" ) { setValue( "MURank", "10" );
                                                                                      } else if( MURank == "veteran" ) { setValue( "MURank", "15" );
                                                                                                                       } else if( MURank == "elite" ) { setValue( "MURank", "20" ); }
                        }
                    });
                }
            }
        });
    }



    // Create bonus battle dov
    function createBlockBonus( location, MU, SD ) {

        var block = $( "<div class='bonusBattleBlock'></div>" );

        var bonusLocation = $( "<div class='locationBonus'>"+ location +"%</div>" );
        bonusLocation.attr( "title", "<b>Location bonus</b>" );
        bonusLocation.addClass( (location == 0) ? "redBackground" : "greenBackground" );
        bonusLocation.tooltip({
            tipClass:"smalltooltip",
            position: { my: "center top+4", at: "center bottom" },
            onShow: function() {
                $( ".smalltooltip" ).css({ "text-align" : "center", "width" : "88px", "font-size" : "11px", "padding" : "3px 8px", "margin" : "0px 0px 0px 14px" });
            }
        });

        var bonusMU = $( "<div class='MUBonus'>"+ MU +"%</div>" );
        bonusMU.attr( "title", "<b>Military unit bonus</b>" );
        bonusMU.addClass( (MU == 0) ? "redBackground" : "greenBackground" );
        bonusMU.tooltip({
            tipClass:"smalltooltip",
            position: { my: "center top+4", at: "center bottom" },
            onShow: function() {
                $( ".smalltooltip" ).css({ "text-align" : "center", "width" : "88px", "font-size" : "11px", "padding" : "3px 8px", "margin" : "0px 0px 0px 14px" });
            }
        });

        var bonusSD = $( "<div class='DSBonus' title='<b>Defensive system bonus</b>'>"+ SD +"%</div>" );
        bonusSD.attr( "title", "<b>Defensive system bonus</b>" );
        bonusSD.addClass( (SD == 0) ? "redBackground" : "greenBackground" );
        bonusSD.tooltip({
            tipClass:"smalltooltip",
            position: { my: "center top+4", at: "center bottom" },
            onShow: function() {
                $( ".smalltooltip" ).css({ "text-align" : "center", "width" : "88px", "font-size" : "11px", "padding" : "3px 8px", "margin" : "0px 0px 0px 14px" });
            }
        });

        block.append( bonusLocation );
        block.append( bonusMU );
        block.append( bonusSD );
        return( block );
    }


    // Change weapon battle selector
    function changeWeaponBattle() {

        // First div with selected weapon
        var bigWeapTable="<table id='table1'><tr><td style='width:100%;' id='WepSelect_1' colspan='3'><table><tr><td id='WepSelect_1_1' style='width:30%;'></td><td id='WepSelect_1_2' style='width:70%;'></td></tr></table></td></tr><tr><td id='WepSelect_3' style='width:33%;'></td><td style='width:33%;' id='WepSelect_4'></td><td style='width:33%;' id='WepSelect_5'></td></tr></table>"
        var hittable="<table style='width:100%;' id='table3'><tr><td>Hit type:</td><td>Damage:</td></tr><tr><td id='lastHitType'>-</td><td id='lastdamage'>-</td></tr></table>"
        //+bigWeapTable+
        var bigWeap = $( "<div class='foundation-radius fightContainer foundation-base-font ' id='bigWeaponBlock'>"+hittable+"</div>" );
        var imgWeap = $( "<img id='bigWeaponImg' />" );

        var weapInfo = $( "<div id='weaponsInfo'></div>" );
        weapInfo.append( imgWeap );
        weapInfo.append( "<span id='qualityWeaponInfo'></span>" );
        weapInfo.append( "<span id='availableWeaponInfo'></span>" );


        var dataInfo = $( "<div id='blockInfoDamage'></div>" );
        dataInfo.append( "Fight:<br /><span id='minDamage'></span> / <span id='maxDamage'></span><br/>" );
        dataInfo.append( "Berserk:<br/><span id='bkMinDamage'></span> / <span id='bkMaxDamage'></span>" );

        var equipInfo = $( "<div id='blockEquipInfo'></div>" );
        var lineCritical = $( "<div></div>" );
        var playerCriticalValue = getValue( "playerCritical" ) ? getValue( "playerCritical" ) : 0;
        lineCritical.append( "<span class='percentBattleInfo'>"+ playerCriticalValue +" %</span> " );
        lineCritical.append( "<img src='"+ IMGCRITICAL +"' /><br />" );
        lineCritical.append( "<span id='criticalCounter'>"+getValue("today_crit")+"</span>" );
        //equipInfo.append( lineCritical );

        var lineMiss = $( "<div></div>" );
        var playerMissValue = getValue( "playerMiss" ) ? getValue( "playerMiss" ) : 0;
        lineMiss.append( "<span class='percentBattleInfo'>"+ playerMissValue +" %</span> " );
        lineMiss.append( "<img src='"+ IMGMISS +"' /><br />" );
        lineMiss.append( "<span id='missCounter'>"+getValue("today_miss")+"</span>" );
        //equipInfo.append( lineMiss );

        var lineAvoid = $( "<div></div>" );
        var playerAvoidValue = getValue( "playerAvoid" ) ? getValue( "playerAvoid" ) : 0;
        lineAvoid.append( "<span class='percentBattleInfo'>"+ playerAvoidValue +" %</span> " );
        lineAvoid.append( "<img src='"+ IMGAVOID +"' /><br />" );
        lineAvoid.append( "<span id='avoidCounter'>"+getValue("today_avoid")+"</span>" );
        //equipInfo.append( lineAvoid );

        //bigWeap.append( imgWeap );
        //bigWeap.append( weapInfo );
        //bigWeap.append( dataInfo );
        bigWeap.append( equipInfo );

        //bigWeap.find("#WepSelect_1").append( imgWeap );
        //bigWeap.find("#WepSelect_1_1").append( weapInfo );
        //bigWeap.find("#WepSelect_1_2").append( dataInfo );
        bigWeap.find("#WepSelect_3").append( lineCritical );
        bigWeap.find("#WepSelect_4").append( lineAvoid );
        //bigWeap.find("#WepSelect_5").append( lineMiss );



        //INFO
        fight_info=$("<img id='fight_info' src='http://bellum-tw.zz.mu/scripts/esim-ED/img/info.png' >")




        fight_info.bind('click', function() {

            $("#table1").slideUp("fast")
            $("#table3").slideUp("fast")
            $("#fight_info").slideUp("fast")
            $("#MUMarketBlock").slideUp("fast")


            $("#bigWeaponBlock").append('<table id="table2" style="width:100%; display: none;"><tbody><tr><td colspan="4">Fight Info</td></tr><tr><td colspan="2">All hit</td><td colspan="2" id="all_hit"></td></tr><tr><td>Type:</td><td>Crit</td><td>Avoid</td><td>Miss</td></tr><tr><td>Hit:</td><td id="crit"></td><td id="avoid"></td><td id="miss"></td></tr><tr><td>Nominal %</td><td id="critN"></td><td id="avoidN"></td><td id="missN"></td></tr><tr><td>Real %</td><td id="critR"></td><td id="avoidR"></td><td id="missR"></td></tr></tbody></table>')

            $('#all_hit').text(getValue("today_all"))

            $("#crit").text(getValue("today_crit"));
            $("#avoid").text(getValue("today_avoid"));
            $("#miss").text(getValue("today_miss"));

            $("#critN").text(playerCriticalValue);
            $("#avoidN").text(playerAvoidValue);
            $("#missN").text(playerMissValue);

            $("#critR").text(((getValue("today_crit")/getValue("today_all"))*100).toFixed(2));
            $("#avoidR").text(((getValue("today_avoid")/getValue("today_all"))*100).toFixed(2));

            if(playerMissValue == 0){
                $("#missR").text("0.00");
            }else{

                $("#missN").text(((getValue("today_miss")/getValue("today_all"))*100).toFixed(2));
            }

            back=$("<img id='fight_back' src='http://bellum-tw.zz.mu/scripts/esim-ED/img/Back.png'>")

            back.bind('click', function() {

                $("#table2").slideUp("fast")
                $("#fight_back").slideUp("fast")
                $("#fight_back").remove();

                $("#table1").slideDown("slow")
                $("#table3").slideDown("slow")
                $("#fight_info").slideDown("slow")
                $("#MUMarketBlock").slideDown("slow")

            });

            $("#bigWeaponBlock").append(back)
            $("#table2").slideDown("slow")

        });




        //Select Hide/Show fight response

        var HideSelectorBlock = $( "<div id='MUMarketBlock'></div>" );
        var configHideResponse = createCheckBox( "Select Hide/Show fight response", "configHideResponse" );
        configHideResponse.css("display","inline-flex")
        HideSelectorBlock.append( fight_info );
        HideSelectorBlock.append( configHideResponse );


        bigWeap.append( HideSelectorBlock );
        $( ".fightContainer:eq(2)" ).append(bigWeap)


        // Add update weapon method, copied from the original method
        $( ".fightButton" ).each( function() {

            var input = $( "<a class='newFightButton' /></a>" );
            input.text($(this).text().trim())
            input.attr( "value", $(this).attr( "value" ) );
            input.attr( "name", $(this).attr( "name" ) );
            input.attr( "class", "button foundation-style smallhelp profileButton myfightbutton" );
            input.insertBefore( $(this) );
            $(this).hide();

            input.bind( "click", function() {
                var side = $(this)[0].name;
                var value = $(this)[0].value;
                mySendFightRequest(side, value);


                if(getValue("configHideResponse")=="true"){

                    //alert(getValue("configHideResponse"))

                    $.blockUI({ message: $('#fightStatus'), css: {
                        width: '400px',
                        top: ($(window).height() - 400) /2 + 'px',
                        left: ($(window).width() - 400) /2 + 'px',
                        border: '0px',
                        background: '#F2F2F2' }
                              });


                }else{

                    //alert(getValue("configHideResponse"))
                    updateWeaponsNumber();

                }

                return( false );
            });
        });

    }



    // HIDE EXTRA INFOs
    function hideExtraInfo()
    {

        if(getValue("configExtraInfo")=="false")
        {
            alert(getValue("configExtraInfo"))
            $("#table1").hide()
            $("#fight_info").hide()

        }

    }


    function hit_type(type,multip)
    {

        if(type=="crit")
        {

            sv = getValue("today_crit")
            setValue("today_crit",Number(sv)+Number(multip))

            $("#criticalCounter").text(getValue("today_crit"))

            sv = getValue("today_all")
            setValue("today_all",Number(sv)+Number(multip))


            //$("#lastHitType").html('<span style="font-family:Arial;font-size:18px;font-style:normal;font-weight:bold;text-decoration:none;text-transform:none;font-variant:small-caps;color:00FF00;">Critical!!!</span>')

        }

        if(type=="miss")
        {

            sv = getValue("today_miss")
            setValue("today_miss",Number(sv)+Number(multip))

            $("#missCounter").text(getValue("today_miss"))

            sv = getValue("today_all")
            setValue("today_all",Number(sv)+Number(multip))

            //$("#lastHitType").html('<span style="font-family:Arial;font-size:18px;font-style:normal;font-weight:bold;text-decoration:none;text-transform:none;font-variant:small-caps;color:FF0000;">Miss!!!</span>')




        }

        if(type=="avoid")
        {

            sv = getValue("today_avoid")
            setValue("today_avoid",Number(sv)+Number(multip))

            $("#avoidCounter").text(getValue("today_avoid"))

            sv = getValue("today_all")
            setValue("today_all",Number(sv)+Number(multip))

            //$("#lastHitType").html('<span style="font-family:Arial;font-size:18px;font-style:normal;font-weight:bold;text-decoration:none;text-transform:none;font-variant:small-caps;color:00FF00;">Avoid!!!</span>')
            //$("#lastHitType").effect( "shake" )

        }

        if(type=="normal")
        {

            sv = getValue("today_all")
            setValue("today_all",Number(sv)+Number(multip))

            //$("#avoidCounter").text(getValue("today_avoid"))

            // $("#lastHitType").html('<span style="font-family:Arial;font-size:18px;font-style:normal;font-weight:bold;text-decoration:none;text-transform:none;font-variant:small-caps;color:000000;">Normal...</span>')

        }


    }

    // sendFightRequest from the original page copied and improved
    function mySendFightRequest(side, val) {
        var dataString = 'weaponQuality='+ $("#weaponQuality").val() + '&battleRoundId=' + $("#battleRoundId").val() + '&side='+side+'&value='+val;
        $.ajax({
            type: "POST",
            url: "fight.html",
            data: dataString,
            success: function( msg ) {
                $( "#fightResponse > div" ).replaceWith( msg );

                $( "#fightResponse > div" ).append("<br /><br /><button id='unblockButton' type='submit' class='button foundation-style'>Ok</button><br /><br />")

                console.log(msg)

                // CHECK HIT TYPE

                patterror=/delete\.png/g

                if(!patterror.test(msg)){

                    pattxp=/xp\d/
                    multip=msg.match(pattxp)[0].slice(-1)

                    console.log(multip)

                    pattcrit=/Critical hit!/;
                    var crit= pattcrit.test(msg);

                    pattmiss = /Miss!/
                    var miss= pattmiss.test(msg);

                    pattavoid=/absorbed/;
                    var avoid= pattavoid.test(msg);


                    pattnormal=/Normal hit/;
                    var normal= pattnormal.test(msg);


                    if(normal) hit_type("normal",multip);
                    if(crit) hit_type("crit",multip);
                    if(miss) hit_type("miss",multip);
                    if(avoid) hit_type("avoid",multip);


                    //AVOID AND CRIT

                    if(avoid && crit){

                        //$("#lastHitType").html('<span style="font-family:Arial;font-size:18px;font-style:normal;font-weight:bold;text-decoration:blink;text-transform:none;color:00FF00;">AVOID/CRITICAL</span>');
                        //$("#lastHitType").effect( "shake" )
                    }


                    //REFRESH LAST DMG


                    lastdmg="<b>"+$("#fightHitType").text()+"</b><br/>"+commaNumber($("#DamageDone").text().replace(/\s/,""))+$(msg).find(".progress.foundation-center").html()

                    $("#lastdamage").html(lastdmg);

                    $("#lastHitType").html("")
                    $(msg).find(".smallhelp").not(".bar").each(function(){

                        $("#lastHitType").append($(this))

                    })



                    // Check HIT TYPE


                    var healthText = $( "#healthUpdate" ).text();
                    if( healthText != "" ) {
                        var healthUpdated = healthText.substr( 0, healthText.length-3 );
                        if( healthUpdated < 100 ) {
                            $( "#healthProgress div.ui-corner-right" ).removeClass( 'ui-corner-right' );
                        }
                        $( "#healthProgress .ui-progressbar-value" ).animate({ width: healthUpdated + "%" },{ queue: false });
                        $( "#healthProgress" ).attr( 'title',healthUpdated+' / 100' );

                        $("#actualHealth").text(healthUpdated);
                    }
                    var rank = parseInt( $("#rankUpdate").text() );
                    var rankNext = parseInt( $("#nextLevelRankUpdate").text() );
                    var rankCurr = parseInt( $("#currLevelRankUpdate").text() );
                    if(rank != null) {
                        var rankWidth = Math.round((rank - rankCurr) / (rankNext - rankCurr) * 100);
                        $( "#rankProgress .ui-progressbar-value" ).animate({ width: rankWidth + "%" },{ queue: false });
                        $( "#rankProgress" ).attr( 'title',rank+' / '+rankNext );

                        $("#actualRank").text(rank);

                    }
                    var xp = parseInt($("#xpUpdate").text());
                    var xpNext = parseInt($("#nextLevelXpUpdate").text());
                    var xpCurr = parseInt($("#currLevelXpUpdate").text());
                    if(xp != null) {
                        var xpWidth = Math.round((xp - xpCurr) / (xpNext - xpCurr) * 100);
                        $("#xpProgress .ui-progressbar-value").animate({width: xpWidth + "%"},{queue: false});
                        $("#xpProgress").attr('title',xp+' / '+xpNext);

                        $("#actualXp").text(xp);
                    }
                    var rankText = $( "#currRankText" ).text();
                    var currRankText = $( "#rankText" ).text();
                    if( rankText != null && currRankText != null ) {
                        if( rankText != currRankText ) {
                            $( "#currRankText" ).text( currRankText );
                            $( "#rankImage img" ).attr( 'src', $( "#rankImg" ).text() );
                        }
                    }


                    //Refix xp and rank
                    configSomeFix();

                }else{

                    $("#lastHitType").html($(msg).find("img").css("float",""))
                    $("#lastdamage").html("<h3>"+$(msg).find("div").text().trim()+"</h3>");

                }

                $( "#unblockButton" ).bind( "click", function() {
                    //alert("haha")
                    $.unblockUI();


                });

                updateWeaponsNumber();
                updateHealthButtons();


            }
        });
    }


    // Update damage
    function updateDamage() {

        var minDamage = getValue( "playerMinDamage" );
        var maxDamage = getValue( "playerMaxDamage" );

        var weaponBonus = parseInt( $( "#weaponQuality" ).val() );
        weaponBonus = (weaponBonus == 0) ? 0.5 : (weaponBonus*20 + 100)/100;

        $( "#minDamage" ).text( pointNumber( parseInt(minDamage * weaponBonus) ) );
        $( "#maxDamage" ).text( pointNumber( parseInt(maxDamage * weaponBonus) ) );

        $( "#bkMinDamage" ).text( pointNumber( parseInt(5*minDamage * weaponBonus) ) );
        $( "#bkMaxDamage" ).text( pointNumber( parseInt(5*maxDamage * weaponBonus) ) );
    }


    // To add . on numbers
    function pointNumber( n ){
        n = n + "";
        var i = n.length-3;
        while( i > 0 ){ n = n.substring( 0, i )+ "." + n.substring( i, n.length ); i=i-3; }
        return( n );
    }

    // To add , on numbers
    function commaNumber( n ){
        n = n + "";
        var i = n.length-3;
        while( i > 0 ){ n = n.substring( 0, i )+ "," + n.substring( i, n.length ); i=i-3; }
        return( n );
    }


    // Updater number weapons value
    function updateWeaponsNumber() {
        var index = 0;
        $( "#weaponQuality" ).find( "option" ).each( function() {

            var str = $(this).text();
            //alert(str);
            var pos = str.indexOf( "+", 0 );
            if( pos > -1 ) {
                //nWeap = str.substr( pos + 10, str.indexOf( ")", pos ) - pos - 10 );
                nWeap = str.match(/\d{1,20}\)/)[0];
                nWeap = nWeap.slice(0, nWeap.length-1);
                //alert(nWeap);
                $( "#weaponSelector" ).children( "div:eq("+ index +")" ).find( ".selectorNumWeapons" ).text( nWeap );
                $( "#availableWeaponsInfo" ).text( nWeap + "left" );

                if( selectedWeapon.attr( "indexselect" ) == index ) {
                    if( nWeap == 0 ) {
                        selectedWeapon.unbind( "click" );
                        selectedWeapon.unbind( "mouseover" );
                        selectedWeapon.unbind( "mouseout" );
                        selectedWeapon.addClass( "disabledWeapon" );
                        $( "#weaponSelector" ).children( "div" ).eq( 0 ).click();
                    }
                }
            }

            index++;
        });
    }

    changeRoundSelector();

    // Change round selector
    function changeRoundSelector() {

        var block = $( "#command" ).parent();
        block.children().last().remove();
        block.children().last().remove();
        block.children( "br" ).last().remove();
        for( var i=0; i<block.contents().length; i++ ) {
            var item = block.contents().eq(i);
            if( item.text().indexOf( "Show round:" ) >= 0 ) { item.remove(); }
        }

        // Replace any link
        var currentRound = getUrlVars()[ "round" ];
        $( "#command" ).children( "select" ).find( "option" ).each( function() {
            var value = $(this).attr( "value" );
            var battleID = getUrlVars()[ "id" ];
            var url = getCurrentServer() + URLBattle + battleID + "&round=" + value;
            var roundLink = $( "<a style='padding:2px' class='roundSelector' href='"+ url +"' >"+ value + "</a>" );
            if( currentRound ) {
                if( currentRound == value ) {
                    roundLink.css({ "color" : "#d14d4d", "font-size" : "15px" });
                }
            }

            // Remove repeated
            block.children( "a" ).each( function() { if( $(this).text() == value ) { $(this).remove(); } });
            block.append( roundLink );
        });

        if( currentRound == undefined ) { block.children( "a" ).last().css({ "color" : "#d14d4d", "font-size" : "15px" }); }
        $( "#command" ).css({ "display" : "none" });
    }
    // Get MU rank
    function getMURank() {

        var listBlue = $( "#container" ).find( ".testDivblue" );
        var MURank = listBlue.eq(2).find( ".statsLabelRight" ).eq(1).text().toLowerCase();
        if( MURank == "novice" ) { setValue( "MURank", "5" );
                                 } else if( MURank == "regular" ) { setValue( "MURank", "10" );
                                                                  } else if( MURank == "veteran" ) { setValue( "MURank", "15" );
                                                                                                   } else if( MURank == "elite" ) { setValue( "MURank", "20" ); }
    }


    // Remove first block on MU storage and MU money
    function removeFirstBlock() {

        $( "#contentRow" ).find( ".citizenAction" ).css({ "margin-top" : "-7px" });
        $( "#contentRow" ).find( ".testDivblue" ).eq(1).next().remove();
        var firstBlock = $( "#contentRow" ).find( ".testDivblue" ).eq(2);
        firstBlock.next().remove();
        firstBlock.remove();
    }


    // Order MU member
    function orderMU( idForm, varCheck ) {

        var divPlayers = $( idForm ).children( "div" ).addClass( "divListPlayers" );

        // Save data to order it
        var list = divPlayers.children();
        var tickAll = list[0];
        var playerList = [];
        var names = [];
        var player;

        // Ignore beginning BR
        for( var i=2; i<list.length; i++ ) {

            player = [];
            player[0] = list[i++];
            player[1] = list[i++];
            player[2] = list[i++];
            player[3] = list[i++];
            // Ignore BR
            //console.log(player[3])
            if($(player[3]).find("span").length){

                nmsv=($(player[3]).text().toLowerCase().replace("? ",""));
                //console.log()
            }else{

                nmsv=( player[3].textContent.toLowerCase() );
            }

            names.push(nmsv);
            //console.log(nmsv)
            playerList.push( player );
        }

        // Remove all children
        divPlayers.children().remove();
        divPlayers.text( "" );

        // Add tickAll button
        $( tickAll ).bind( "click", function() {
            $( ".receipments" ).attr( "checked", "checked" );
            saveCheckedPlayers();
            return false;
        });
        divPlayers.append( tickAll );

        // Add untickAll button
        var untickAll = $( "<input type='submit' id='untickAll' value='Untick all' />" );
        untickAll.bind( "click", function() {
            $( ".receipments" ).removeAttr( "checked" );
            setValue( "lastSelectionMUStorage", "" );
            return false;
        });
        divPlayers.append( untickAll );

        // Add other submit button
        divPlayers.append( "<input id='donateBtn2' type='submit' value='Donate' />" );
        divPlayers.append( "<br/>" );

        // Order array by name
        names.sort();

        // Add ordered members
        var tr, td;
        var table = $( "<table class='playerTable'></table>" );
        divPlayers.append( table );
        for( i=0; i<names.length; i++ ) {

            for( var j=0; j<playerList.length; j++ ) {

                if( names[i] == playerList[j][3].textContent.toLowerCase().replace("? ","") ) {
                    //console.log(names[i] +" == "+playerList[j][3].textContent.toLowerCase().replace("? ",""))
                    tr = $( "<tr></tr>" );
                    tr.append( $( "<td class='checkPlayer'></td>" ).append( playerList[j][0] ) );
                    tr.append( $( "<td class='flagPlayer'></td>" ).append( playerList[j][1] ) );
                    tr.append( "<td class='noSkill'></td>" );
                    tr.append( $( "<td class='avatarPlayer'></td>" ).append( playerList[j][2] ) );
                    tr.append( $( "<td class='namePlayer'></td>" ).append( playerList[j][3] ) );
                    tr.append( "<td class='companyName'></td>" );
                    tr.append( "<td class='day6'></td>" );
                    tr.append( "<td class='day5'></td>" );
                    tr.append( "<td class='day4'></td>" );
                    tr.append( "<td class='day3'></td>" );
                    tr.append( "<td class='day2'></td>" );
                    tr.append( "<td class='day1'></td>" );
                    tr.append( "<td class='day0'></td>" );
                    tr.append( "<td></td>" );
                    table.append( tr );

                    tr.children( ".namePlayer" ).children( "a" ).attr( "name", playerList[j][3].textContent );

                    // Resize player name
                    var name = tr.children( ".namePlayer" );
                    while( name.height() > (parseInt( name.css( "line-height" ).replace( "px", "" ) ) + 1) ) {
                        var str = name.children( "a" ).text().replace( "...", "" );
                        name.children( "a" ).text( str.slice( 0, -1 ) + "..." );
                    }
                }
            }
        }


        // Check for URL vars
        if( varCheck ) {
            setValue( "lastSelectionMUStorage", varCheck );
            $( ".playerTable" ).find( ".receipments" ).each( function() {
                if( varCheck.length > 0 ) {
                    if( varCheck[0] == "1" ) { $(this).attr( "checked", "checked" ); }
                    varCheck = varCheck.substr( 1, varCheck.length-1 );
                }
            });
        }

        // Set Checked players
        $( ".playerTable" ).find( ".receipments" ).bind( "change", function() { saveCheckedPlayers(); });
    }

    // Set value of checked people on MU storage
    function saveCheckedPlayers() {
        var check = "";
        $( ".playerTable" ).find( ".receipments" ).each( function() {
            check += ($(this).attr( "checked" )) ? "1" : "0";
        });
        setValue( "lastSelectionMUStorage", check );
    }


    // Add donate me button
    function addDonateToMeButton( idForm ) {
        //console.log("jo")
        // Donate me button
        var pos = $( idForm ).children( "center" );
        var donateMe = $( "<input type='submit' id='donateMe' value='Donate me' />" );
        pos.append( donateMe );

        var id;
        var link = $( "#userName" ).attr( "href" );
        var split = link.split( "?id=" );
        if( split.length > 1 ) {
            id = split[1];
            donateMe.bind( "click", function() {
                $( ".receipments" ).removeAttr( "checked" );
                $( ".receipments[value='"+ id +"']" ).attr( "checked", "checked" );
            });
        }
    }


    // Update MU storage donation
    function changeSelectMUStorage( idForm ) {

        var select = $( "#product" );
        var pos = $( ".testDivwhite" );
        var dest = $( "#quantity" );

        // Remove all childrens and add help text
        pos.children().remove();
        pos.addClass( "storageSelectMU" );
        pos.append( "One click to select <b>ONE item</b>.<br/>Double click to select <b>ALL items</b>.<br/>" );

        pos.css({"width":"200px"})

        select.prev().remove();
        //select.css({ "display" : "none" });

        orderSelect( select );
        changeSelect( select, pos, dest, "#aaaaaa" );
    }



    // Change select from params
    function changeSelect( select, placeToAdd, dest, color ) {

        // Add my items
        var selectDonate;
        var index = 1;
        select.find( "option" ).each( function() {
            if( $(this).attr( "value" ) == "" ) { return; }

            var str = $(this).text();
            //alert(str)
            var number = str.indexOf( "(", 0 );
            if( number != -1 ) {
                str = str.substr( number + 1, str.indexOf( ")", number ) - number - 1 );
                mypatttofindnum=/\d{1,45}/g;
                //alert(str)
                str = mypatttofindnum.exec(str);

            }

            var product = $( "<div class='storage productMU'>" );
            product.append( "<div>"+ str +"</div>" );
            var image = $( "<div></div>" )
            product.append( image );

            var storageMU = $( "<div class='storageButton' selectIndex='"+ index +"'></div>" );
            //storageMU.css({ "box-shadow" : "0px 1px 5px 1px " + color });
            storageMU.append( product );

            // Raw resource
            var split = $(this).attr( "value" ).split( "-" );
            if( split.length == 1 ) {

                if( split[0] == "IRON" ) {
                    image.append( "<img src='"+ IMGIRON +"' />" );

                } else if( split[0] == "OIL" ) {
                    image.append( "<img src='"+ IMGOIL +"' />" );

                } else if( split[0] == "GRAIN" ) {
                    image.append( "<img src='"+ IMGGRAIN +"' />" );

                } else if( split[0] == "DIAMONDS" ) {
                    image.append( "<img src='"+ IMGDIAMONDS +"' />" );

                } else if( split[0] == "WOOD" ) {
                    image.append( "<img src='"+ IMGWOOD +"' />" );

                } else if( split[0] == "STONE" ) {
                    image.append( "<img src='"+ IMGSTONE +"' />" );
                }

                product.css({ "height" : "67px" });
                storageMU.css({ "margin" : "10px 4px 8px 10px" });

            } else if( split.length = 2 ) {

                if( split[1] == "WEAPON" ) {
                    image.append( "<img src='"+ IMGWEAPON +"' />" );

                } else if( split[1] == "FOOD" ) {
                    image.append( "<img src='"+ IMGFOOD +"' />" );

                } else if( split[1] == "TICKET" ) {
                    image.append( "<img src='"+ IMGTICKET +"' />" );

                } else if( split[1] == "GIFT" ) {
                    image.append( "<img src='"+ IMGGIFT +"' />" );

                } else if( split[1] == "HOUSE" ) {
                    image.append( "<img src='"+ IMGHOUSE +"' />" );

                } else if( split[1] == "DEFENSE_SYSTEM" ) {
                    image.append( "<img src='"+ IMGDS +"' />" );

                } else if( split[1] == "HOSPITAL" ) {
                    image.append( "<img src='"+ IMGHOSPITAL +"' />" );

                } else if( split[1] == "ESTATE" ) {
                    image.append( "<img src='"+ IMGESTATE +"' />" );
                }

                image.append( "<img class='qualityMU' src='"+ IMGQUALITY + split[0] + IMGEXTENSION +"' />" );
                product.css({ "height" : "77px" });
                storageMU.css({ "margin" : "6px 4px 2px 10px" });
            }

            // Events
            storageMU.bind( "mouseover", function() {
                if( selectDonate != $(this).attr( "selectIndex" ) ) { $(this).addClass( "storageButtonHover" ); }
            });
            storageMU.bind( "mouseout", function() {
                if( selectDonate != $(this).attr( "selectIndex" ) ) { $(this).removeClass( "storageButtonHover" ); }
            });

            // Click
            storageMU.bind( "click", function() {

                // Deselect current selection
                if( selectDonate == $(this).attr( "selectIndex" ) ) {

                    $(this).removeClass( "storageButtonClick" );
                    $(this).removeClass( "storageButtonDblClick" );
                    select.find( "option" ).removeAttr( "selected" );
                    selectDonate = null;
                    dest.val( "1" );

                } else {

                    // Deselect last item
                    if( selectDonate ) {
                        var selectedItem = placeToAdd.find( ".storageButton[selectIndex='" + selectDonate + "']" );
                        selectedItem.removeClass( "storageButtonClick" );
                        selectedItem.removeClass( "storageButtonDblClick" );
                        dest.val( "1" );
                    }

                    $(this).removeClass( "storageButtonHover" );
                    $(this).removeClass( "storageButtonDblClick" );
                    $(this).addClass( "storageButtonClick" );
                    selectDonate = $(this).attr( "selectIndex" );

                    select.find( "option" ).removeAttr( "selected" );
                    select.find( "option" )[ selectDonate ].selected = true;
                }
            });

            // Doubleclick
            storageMU.bind( "dblclick", function() {

                $(this).removeClass( "storageButtonHover" );
                $(this).removeClass( "storageButtonClick" );
                $(this).addClass( "storageButtonDblClick" );
                selectDonate = $(this).attr( "selectIndex" );

                select.find( "option" ).removeAttr( "selected" );
                select.find( "option" )[ selectDonate ].selected = true;

                dest.val( $(this).text().trim() );
                return( false );
            });

            placeToAdd.append( storageMU );
            index++;
        });
    }


    // Reorder select items
    function orderSelect( select ) {

        var listOptions = [];
        select.find( "option" ).each( function() {
            listOptions.push( $(this) );
            $(this).remove();
        });

        // Order is... Weapons, Food, Gifts, Tickets, Raw and rest
        var newOptionList = new Array(46);
        newOptionList[0] = listOptions[0];
        var rawIndex = 0;
        var otherIndex = 0;
        for( var i=1; i<listOptions.length; i++ ) {
            var item = listOptions[i].attr( "value" ).split( "-" );
            if( item.length == 2 ) {
                var q = parseInt( item[0] ) - 1;
                if( item[1] == "WEAPON" ) { // Index 0 + quality
                    newOptionList[ 1 + q ] = listOptions[i];

                } else if( item[1] == "FOOD" ) { // Index 5 + quality
                    newOptionList[ 6 + q ] = listOptions[i];

                } else if( item[1] == "GIFT" ) { // Index 10 + quality
                    newOptionList[ 11 + q ] = listOptions[i];

                } else if( item[1] == "TICKET" ) { // Index 15 + quality
                    newOptionList[ 16 + q ] = listOptions[i];

                } else {
                    newOptionList[ 27 + otherIndex ] = listOptions[i];
                    otherIndex++;
                }
            } else {
                newOptionList[ 21 + rawIndex ] = listOptions[i];
                rawIndex++;
            }
        }

        // Add ordered items
        for( var i=0; i<newOptionList.length; i++ ) {
            if( newOptionList[i] ) { select.append( newOptionList[i] ); }
        }

        select.find( "option" )[ 0 ].selected = true;
    }


    // Add fast buttons
    function addMUFastButtons( idDest ) {

        var firstFastButton = true;
        $( idDest ).css({ "text-align" : "center" });

        var btn1 = $( "<input class='fastBtn MUfastButtonLeft' type='button' value='1' />" );
        btn1.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "1" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 1 );
            firstFastButton = false;
        });

        var btn5 = $( "<input class='fastBtn MUfastButtonLeft' type='button' value='5' />" );
        btn5.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "5" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 5 );
            firstFastButton = false;
        });

        var btn10 = $( "<input class='fastBtn MUfastButtonLeft' type='button' value='10' />" );
        btn10.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "10" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 10 );
            firstFastButton = false;
        });

        var btn15 = $( "<input class='fastBtn MUfastButtonRight' type='button' value='15' />" );
        btn15.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "15" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 15 );
            firstFastButton = false;
        });

        var btn25 = $( "<input class='fastBtn MUfastButtonRight' type='button' value='25' />" );
        btn25.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "25" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 25 );
            firstFastButton = false;
        });

        var btn50 = $( "<input class='fastBtn MUfastButtonRight' type='button' value='50' />" );
        btn50.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "50" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 50 );
            firstFastButton = false;
        });

        var btn75 = $( "<input class='fastBtn MUfastButton2' type='button' value='75' />" );
        btn75.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "75" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 75 );
            firstFastButton = false;
        });

        var btn100 = $( "<input class='fastBtn MUfastButton2' type='button' value='100' />" );
        btn100.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "100" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 100 );
            firstFastButton = false;
        });

        var btn125 = $( "<input class='fastBtn MUfastButton2' type='button' value='125' />" );
        btn125.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "125" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 125 );
            firstFastButton = false;
        });

        var btn150 = $( "<input class='fastBtn MUfastButton2' type='button' value='150' />" );
        btn150.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "150" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 150 );
            firstFastButton = false;
        });


        // NEW
        $( "<br id='divider' />" ).insertAfter($("#quantity.digit"));

        btn25.insertAfter($("#divider") );
        btn15.insertAfter($("#divider") );
        btn10.insertAfter($("#divider") );
        btn5.insertAfter( $("#divider") );
        btn1.insertAfter( $("#divider") );

        $( "<br id='divider2' />" ).insertAfter($("#donateProductForm input[value='25']"));

        btn150.insertAfter( $("#divider2") );
        btn125.insertAfter( $("#divider2") );
        btn100.insertAfter( $("#divider2") );
        btn75.insertAfter( $("#divider2") );
        btn50.insertAfter( $("#divider2") );




    }


    // Add update jobs button
    function addUpdateJobsButton( idForm ) {
        savedWorkedList = [];

        // Add button to see more days
        var extended = $( "<input type='button' id='extendedDays' value='Extended'/>" );
        extended.insertAfter( $( "#donateBtn2" ) );
        disableButton( extended );
        extended.bind( "click", function() {
            extendedMU = !extendedMU;

            if( extendedMU ) {
                $( ".companyName" ).hide();
                $( ".day0" ).show();
                $( ".day1" ).show();
                $( ".day2" ).show();
                $( ".day3" ).show();
                $( ".day4" ).show();
                $( ".day5" ).show();
                $( ".day6" ).show();
            } else {
                $( ".companyName" ).show();
                $( ".day0" ).show();
                $( ".day1" ).show();
                $( ".day2" ).hide();
                $( ".day3" ).hide();
                $( ".day4" ).hide();
                $( ".day5" ).hide();
                $( ".day6" ).hide();
            }
        });

        // Add update button
        var update = $( "<input type='button' id='updateWork' value='Update jobs'/>" );
        update.insertAfter( ".testDivwhite" );
        update.bind( "click", function() {

            $(this).val( "Updating... " );
            disableButton( $(this) );
            enableButton( extended );

            // Clean previous results
            $( idForm ).find( ".skill" ).children().remove();
            $( idForm ).find( ".skill" ).addClass( "noSkill" );
            $( idForm ).find( ".skill" ).removeClass( "skill" );
            $( ".companyName" ).children().remove();
            $( ".day0" ).children().remove();
            $( ".day1" ).children().remove();
            $( ".day2" ).children().remove();
            $( ".day3" ).children().remove();
            $( ".day4" ).children().remove();
            $( ".day5" ).children().remove();
            $( ".day6" ).children().remove();

            var idMU = $( ".citizenAction" ).eq(0).children( "a" ).attr( "href" );
            var split = idMU.split( "?id=" );
            if( split.length > 1 ) {
                idMU = split[1];

                // Find every player what company works
                // First MU companies
                $.ajax({
                    url: getCurrentServer() + URLMUCompanies + idMU,
                    success: function( data ) {

                        // Special case
                        var cp = $( data ).find( "a[href^='company.html']" );
                        if( cp.length == 0 ) {
                            enableButton( $( "#updateWork" ) );
                            $( "#updateWork" ).val( "Update jobs" );

                        } else {
                            $( "#updateWork" ).val( "Updating... "+cp.length );
                            $( "#updateWork" ).attr( "counter", cp.length );
                        }

                        for( var i=0; i<cp.length; i++ ) {
                            var split = $( cp[i] ).attr( "href" ).split( "?id=" );
                            if( split.length > 1 ) { checkCompany( idForm, split[1], i, cp.length-1 ) }
                        }
                    }
                });
            }

            return( false );
        });

        var needUpdate = false;
        var lastUpdateTime = $( "<div id='lastUpdateTime'></div>" );
        lastUpdateTime.insertAfter( update );
        if( getValue( "muStorageSaveLastTime") ) {
            lastUpdateTime.text( getValue( "muStorageSaveLastTime") );
            var currentDate = (new Date).getDate();
            var lastDate = new Date( getValue( "muStorageSaveLastTime" ) ).getDate();
            var needUpdate = (lastDate != currentDate);
        }


        if( getValue( "muStorageSaveWorkedList") && !needUpdate ) {

            enableButton( extended );
            var workedList = getValue( "muStorageSaveWorkedList").split( "&&" );

            for( var i=0; i<workedList.length; i++ ) {
                var splitList = workedList[i].split( "," );

                var pos = $( idForm ).find( "a[name='"+ splitList[0] +"']" );
                var tr = pos.parent().parent();

                addSkill( tr, splitList[1] );
                tr.find( ".companyName" ).append( "<a href='"+ getCurrentServer() + URLCompany + splitList[2] +"'>"+ splitList[3] +"</a>" );

                var day;
                for( j=0; j<7; j++ ) {
                    var t = "-" + j;
                    if( j == 0 ) { t = ""; }

                    if( splitList[4+j] == "true" ) {
                        day = $( "<div class='dayOk' day='"+ j +"'>"+ t +"</div>" );
                        tr.find( ".day" + j ).append( day );
                        tr.find( "input" ).attr( "workday" + j, "true" );

                    } else {
                        day = $( "<div class='dayFail' day='"+ j +"'>"+ t +"</div>" );
                        tr.find( ".day"+j ).append( day );
                        tr.find( "input" ).attr( "workday" + j, "false" );
                    }

                    // Select only who worked
                    day.bind( "click", function() {
                        $( ".receipments" ).removeAttr( "checked" );
                        $( ".receipments[workday"+ $(this).attr( "day" ) +"='true']" ).attr( "checked", "checked" );
                        setCounterText();
                        saveCheckedPlayers();
                    });

                    if( !extendedMU && (j > 1) ) { tr.find( ".day" + j ).hide(); }
                }
            }
        }
    }


    // Check each company
    function checkCompany( idForm, idComp, i, n ) {

        setTimeout( function() {

            $.ajax({
                url: getCurrentServer() + URLCompanyDetails + idComp,
                success: function( data ) {
                    checkWorkResults( idComp, idForm, data );

                    if( i == n ) {
                        enableButton( $( "#updateWork" ) );
                        $( "#updateWork" ).val( "Update jobs" );
                        $( "#updateWork" ).removeAttr( "counter" );

                        setValue( "muStorageSaveWorkedList", savedWorkedList.join( "&&" ) );
                        $( "#lastUpdateTime" ).text( new Date().toUTCString() );
                        setValue( "muStorageSaveLastTime", new Date().toUTCString() );

                    } else {
                        var count = parseInt( $( "#updateWork" ).attr( "counter" ) ) - 1;
                        $( "#updateWork" ).val( "Updating... " + count );
                        $( "#updateWork" ).attr( "counter", count );
                    }
                }
            });

        }, 1000*i );
    }


    // Check every company
    function checkWorkResults( idComp, idForm, data ) {

        var table = $( data ).find( "#productivityTable" );
        var original = $( data ).find( "h1" ).text();
        var company = original.substr(original.indexOf(" ") + 1);
        var rows = table.find( "tbody tr" );
        for( var i=1; i<rows.length; i++ ) {
            var player = "";

            var cols = $( rows[i] ).find( "td" );
            if( cols.length > 0 ) {
                var name = $( cols[0] ).find( "a" ).text();
                player = name;

                var pos = $( idForm ).find( "a[name='"+ name +"']" );
                var tr = pos.parent().parent();
                tr.find( ".companyName" ).append( "<a href='"+ getCurrentServer() + URLCompany + idComp +"'>"+ company +"</a>" );
                if( cols.length == 12 ) {

                    var skillValue = parseInt( $( cols[1] ).text() );
                    addSkill( tr, skillValue );
                    player += "," + skillValue + "," + idComp + "," + company;

                    // View last 7 days
                    var day;
                    for( var j=0; j<7; j++ ) {
                        var t = "-" + j;
                        if( j == 0 ) { t = ""; }

                        if( $( cols[11-j] ).find( "img" ).length == 0 ) {
                            day = $( "<div class='dayOk' day='"+ j +"'>"+ t +"</div>" );
                            tr.find( ".day" + j ).append( day );
                            tr.find( "input" ).attr( "workday" + j, "true" );
                            player += "," + "true";

                        } else {
                            day = $( "<div class='dayFail' day='"+ j +"'>"+ t +"</div>" );
                            tr.find( ".day"+j ).append( day );
                            tr.find( "input" ).attr( "workday" + j, "false" );
                            player += "," + "false";
                        }

                        // Select only who worked
                        day.bind( "click", function() {
                            $( ".receipments" ).removeAttr( "checked" );
                            $( ".receipments[workday"+ $(this).attr( "day" ) +"='true']" ).attr( "checked", "checked" );
                            setCounterText();
                            saveCheckedPlayers();
                        });

                        if( !extendedMU && (j > 1) ) { tr.find( ".day" + j ).hide(); }
                    }
                }

                savedWorkedList.push( player );
            }
        }
    }


    // Add skill in MU storage list
    function addSkill( tr, skillVal ) {
        var posSkill = tr.find( ".noSkill" );
        posSkill.removeClass( "noSkill" );
        posSkill.addClass( "skill" );
        posSkill.append( "<div>"+ skillVal +"</div>" );
        posSkill.bind( "click", function() {
            var v = $(this).text();
            $( ".skill" ).each( function() {
                if( v == $(this).text() ) { $(this).parent().find( "input" ).attr( "checked", "checked" ); }
            });
            setCounterText();
            saveCheckedPlayers();
        });
    }


    // Add update connection button
    function addUpdateConnectionButton( idForm ) {

        var $online = $( "<input type='submit' id='onlinePlayer' value='Online players' />" );
        $online.insertAfter( ".testDivwhite" );
        $online.bind( "click", function() {

            $.ajax({
                url: getCurrentServer() + URLMyMU,
                success: function( data ) {

                    // First clean
                    $( idForm ).find( "img[src='"+ IMGOFFLINE +"']" ).remove();
                    $( idForm ).find( "img[src='"+ IMGONLINE +"']" ).remove();

                    // Add All offline
                    $( idForm ).find( "a[href^='profile.html']" ).each( function() {
                        var flag = $(this).parent().parent().find( ".currencyFlag" );
                        flag.attr( "src", IMGOFFLINE );
                        flag.addClass( "imgPlayerOnline" );
                    });

                    // Replace online players
                    $( data ).find( ".tip[src='"+ IMGONLINE +"']" ).each( function() {
                        var player = $( idForm ).find( "a[href='"+ $(this).prev().attr( "href" ) + "']" );
                        player.parent().parent().find( ".currencyFlag" ).attr( "src", IMGONLINE );
                    });

                    // Add events
                    $( idForm ).find( ".currencyFlag" ).bind( "click", function() {
                        $( idForm ).find( ".receipments" ).removeAttr( "checked" );
                        $( idForm ).find( "img[src='"+ $(this).attr( "src" ) +"']" ).each( function() {
                            $(this).parent().parent().find( "input" ).attr( "checked", "checked" );
                        });
                        saveCheckedPlayers();
                    });
                }
            });

            return( false );
        });
    }


    // Add update connection button
    function addDebuffCheck( idForm ) {

        var $online = $( "<input type='submit' id='debuffPlayer' value='Debuffed players' />" );
        $online.insertAfter( ".testDivwhite" );
        $online.bind( "click", function() {

            $('.namePlayer').each(function() {

                pUrl=getCurrentServer()+$(this).attr('href')

                $.ajax({
                    url: pUrl,
                    success: function( data ) {

                        // First clean
                        $( idForm ).find( "img[src='"+ IMGOFFLINE +"']" ).remove();
                        $( idForm ).find( "img[src='"+ IMGONLINE +"']" ).remove();

                        // Add All offline
                        $(this).parent().find("td:first").after("<td class='debuff'><img id='noDebuff' src="+noDebuff+" ></td>")

                        // Replace online players
                        $( data ).find( ".tip[src='"+ IMGONLINE +"']" ).each( function() {
                            var player = $( idForm ).find( "a[href='"+ $(this).prev().attr( "href" ) + "']" );
                            player.parent().parent().find( ".currencyFlag" ).attr( "src", IMGONLINE );
                        });

                        // Add events
                        $( idForm ).find( ".currencyFlag" ).bind( "click", function() {
                            $( idForm ).find( ".receipments" ).removeAttr( "checked" );
                            $( idForm ).find( "img[src='"+ $(this).attr( "src" ) +"']" ).each( function() {
                                $(this).parent().parent().find( "input" ).attr( "checked", "checked" );
                            });
                            saveCheckedPlayers();
                        });
                    }
                });


            })




            return( false );
        });
    }


    // Count selected members on MU list
    function addCounterMembersMU() {

        var counterDiv = $( "<div style='width:150px; text-align: center; display:inline; padding:2px' id='counterCheck'>No members selected.</div>" )
        counterDiv.insertAfter( ".testDivwhite" );

        var totalDiv = $( "<div style='width:150px; text-align: center; display:inline-block; padding:2px' id='totalDonate'></div>" );
        totalDiv.insertAfter( "#counterCheck" );

        // Add events
        $( ".receipments" ).bind( "change", setCounterText );

        $( "#tickAll" ).bind( "click", setCounterText );
        $( "#untickAll" ).bind( "click", setCounterText );

        $( "#quantity" ).bind( "change", setCounterText );
        $( ".fastBtn" ).bind( "click", setCounterText );

        setCounterText();
    }


    // Set counter checks text
    function setCounterText() {

        var qty = $( "#quantity" ).attr( "value" );
        var n = $( ".receipments:checked" ).length;
        if( n == 0 ) {
            $( "#counterCheck" ).text( "No members selected." );
            $( "#totalDonate" ).text( "" );

        } else if( n == 1 ) {
            $( "#counterCheck" ).text( "Selected 1 member." );
            if( qty > 0 ) {
                if( n*qty == 1 ) {
                    $( "#totalDonate" ).text( "Total donate: "+ (n*qty) +" item." );

                } else $( "#totalDonate" ).text( "Total donate: "+ (n*qty) +" items." );

            } else $( "#totalDonate" ).text( "" );

        } else {
            $( "#counterCheck" ).text( "Selected "+n+" members." );
            if( qty > 0 ) {
                $( "#totalDonate" ).text( "Total donate: "+ (n*qty) +" items." );

            } else $( "#totalDonate" ).text( "" );
        }
    }
    // Add fast buttons
    function addFastButtons( idDest ) {

        var firstFastButton = true;
        $( idDest ).css({ "text-align" : "center" });

        var btn1 = $( "<input class='fastBtn FastButtonLeft' type='button' value='1' />" );
        btn1.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "1" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 1 );
            firstFastButton = false;
        });

        var btn5 = $( "<input class='fastBtn FastButtonLeft' type='button' value='5' />" );
        btn5.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "5" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 5 );
            firstFastButton = false;
        });

        var btn10 = $( "<input class='fastBtn FastButtonLeft' type='button' value='10' />" );
        btn10.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "10" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 10 );
            firstFastButton = false;
        });

        var btn15 = $( "<input class='fastBtn FastButtonLeft' type='button' value='15' />" );
        btn15.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "15" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 15 );
            firstFastButton = false;
        });

        var btn25 = $( "<input class='fastBtn FastButtonLeft' type='button' value='25' />" );
        btn25.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "25" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 25 );
            firstFastButton = false;
        });

        var btn50 = $( "<input class='fastBtn FastButtonLeft' type='button' value='50' />" );
        btn50.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "50" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 50 );
            firstFastButton = false;
        });

        var btn75 = $( "<input class='fastBtn FastButtonRight' type='button' value='75' />" );
        btn75.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "75" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 75 );
            firstFastButton = false;
        });

        var btn100 = $( "<input class='fastBtn FastButtonRight' type='button' value='100' />" );
        btn100.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "100" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 100 );
            firstFastButton = false;
        });

        var btn125 = $( "<input class='fastBtn FastButtonRight' type='button' value='125' />" );
        btn125.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "125" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 125 );
            firstFastButton = false;
        });

        var btn150 = $( "<input class='fastBtn FastButtonRight' type='button' value='150' />" );
        btn150.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "150" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 150 );
            firstFastButton = false;
        });

        var btn500 = $( "<input class='fastBtn FastButtonRight' type='button' value='500' />" );
        btn500.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "500" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 500 );
            firstFastButton = false;
        });

        var btn1k = $( "<input class='fastBtn FastButtonRight' type='button' value='1K' />" );
        btn1k.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "1000" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 1000 );
            firstFastButton = false;
        });

        btn1.insertBefore( idDest );
        btn5.insertBefore( idDest );
        btn10.insertBefore( idDest );
        btn15.insertBefore( idDest );
        btn25.insertBefore( idDest );
        btn50.insertBefore( idDest );

        btn1k.insertAfter( idDest );
        btn500.insertAfter( idDest );
        btn150.insertAfter( idDest );
        btn125.insertAfter( idDest );
        btn100.insertAfter( idDest );
        btn75.insertAfter( idDest );
    }

    // Change market selectors
    function changeProductSelection() {

        // Remove extra br at the begining
        $( "#contentRow" ).children( "td" ).eq(1).children().eq(1).remove();

        // Redesign product selection in one row
        var divBlock = $( "#productMarketViewForm" ).parent();
        divBlock.addClass( "productMarketViewFormMod" );
        divBlock.children( ":lt(2)" ).remove();

        // Remove useless tags
        $( "#marketProducts" ).children( "p" ).remove();
        $( "#marketProducts" ).addClass( "marketProductsMod" );

        $( "#productMarketViewForm > .productList" ).hide();
        var selectProductMarketItem = null;
        var mycounter=0;
        $( "#marketProducts .productList" ).each( function() {


            mycounter++;
            var related = $(this);
            var product = $( "<div class='productMarketItem'></div>" );
            product.append( "<img src='"+ $(this).find( "img" ).attr( "src" ) +"' />" );
            product.append( "<div class='productLabel'>"+ $(this).find( "label" ).text() +"</div>" );
            $(this).parent().append( product );

            product.bind( "mouseover", function() {
                if( selectProductMarketItem ) {
                    if( $(this).text() != selectProductMarketItem.text() ) { $(this).addClass( "productMarketItemHover" ); }
                } else $(this).addClass( "productMarketItemHover" );
            });

            product.bind( "mouseout", function() {
                if( selectProductMarketItem ) {
                    if( $(this).text() != selectProductMarketItem.text() ) { $(this).removeClass( "productMarketItemHover" ); }
                } else $(this).removeClass( "productMarketItemHover" );
            });

            product.bind( "click", function() {
                if( selectProductMarketItem && ($(this).text() == selectProductMarketItem.text()) ) {
                    $(this).removeClass( "productMarketItemSelected" );
                    $( "#resource1" ).attr( "checked", "checked" );
                    selectProductMarketItem = null;

                } else {
                    if( selectProductMarketItem ) {
                        selectProductMarketItem.removeClass( "productMarketItemHover" );
                        selectProductMarketItem.removeClass( "productMarketItemSelected" );
                    }
                    $(this).addClass( "productMarketItemSelected" );
                    selectProductMarketItem = $(this);
                    related.find( "input" ).attr( "checked", "checked" );
                }
            });

            $(this).hide();
            if( $(this).find( "input" ).attr( "checked" ) ) { product.click(); }


            if(mycounter==7)
            {


            }
        });

        $( "#countryId" ).addClass( "countryIdSelect" );
        $( "#countryId" ).addClass( "customSelectList" );

        // Change quality selection
        var selectedQuality = parseInt( $( "#quality :selected" ).val() );
        var newQuality = $( "<div class='qualityProduct' style='display: inline-block; vertical-align: middle; width: 125px; margin: 0px 5px;'></div>" );
        $( "#quality option" ).each( function() {

            var v = parseInt( $(this).val() );
            if( v != 0 ) {
                var star = $( "<div class='qualityStar' quality='"+ v +"' ></div>" );
                if( v > selectedQuality ) {
                    star.addClass( "qualityStarHover" );
                }
                newQuality.append( star );

                star.bind( "click", function() {
                    var q = parseInt( $(this).attr( "quality" ) );
                    $(this).parent().children().addClass( "qualityStarHover" );
                    if( selectedQuality == q ) {
                        selectedQuality = 0;

                    } else {
                        var current = $(this);
                        for( var i=0; i<=q; i++ ) {
                            current.removeClass( "qualityStarHover" );
                            current = current.prev();
                        }
                        selectedQuality = q;
                    }

                    $( "#quality" ).val( selectedQuality );
                });
            }
        });

        newQuality.insertBefore( "#quality" );
        $( "#quality" ).hide();

        $( "#productMarketViewForm" ).children( "br" ).remove();

        // Rellocate help wiki and my offers link
        $( "#productMarketViewForm .biggerFont a" ).addClass( "linkMyOffersProductMarket" );
        var imgWiki = $( "#quality" ).next().next();
        imgWiki.addClass( "imgWikiProductMarket" );
        imgWiki.css( "text-align", "center" );
        var linkWiki = imgWiki.next();
        linkWiki.addClass( "linkWikiProductMarket" );

        // Add buy As button on top
        var buyAs = $( "<div class='buyAsSelect'></div>" );
        var select = $( "<select class='customSelectList' ></select>" );
        if( $( "#command" ).first().children( "select" ).length > 0 ) {
            buyAs.append( $( "#command" ).first().contents().eq(0).text() );
            $( "#command" ).first().children( "select" ).children().each( function() {
                select.append( "<option value='"+ $(this).attr( "value" ) +"'>"+ $(this).text() +"</option>" );
            });

        } else {
            buyAs.append( "Buy as:" );
            select.append( "<option value=''> Citizen </option>" );
            select.attr( "disabled", "disabled" );
        }
        buyAs.append( select );
        buyAs.insertAfter( $( "#productMarketViewForm" ).children( "p" ) );
        select.bind( "change", function() {
            $( ".dataTable" ).find( "select" ).val( $(this).val() );

            if( getValue( "configProductMarketTable" ) == "true" ) {
                var color = ($(this).val() != "" ) ? "#fcecec" : "#ecffec";
                var t = $(this).find( ":selected" ).text();
                $( ".dataTable" ).find( "select" ).each( function() {
                    $( ".toRemove" ).parent().parent().css({ "background-color" : color });
                    $( ".toRemove" ).text( "Buy as "+ t );
                });
            }
        });
        select.first().selected();
    }


    // Change product market table
    function changeProductMarketTable() {

        $( ".dataTable" ).find( "input[type='text']" ).addClass( "inputTextTable" );
        var submit = $( ".dataTable" ).find( "input[type='submit']" ).addClass( "inputSubmitTable" );
        $( ".dataTable" ).find( "input[type='text']" ).bind( "keyup", function() {
            var td = $(this).parent().parent();
            var priceUnit = parseFloat( td.prev().prev().children( ".linkMonetaryMarket" ).next().text() );
            var value = parseFloat( $(this).val() );
            td.prev().children( ".inputPrice" ).text( Math.round( priceUnit * value * 100 ) / 100 );
        });

        // Add buy all button
        var buyAll = $( "<input class='buyAllSubmit' type='submit' value='All' />" );
        buyAll.bind( "click", function() {
            var v = $(this).parent().parent().prev().prev().prev().text();
            $(this).parent().children( "input[type='text']" ).val( v );
            return( false );
        });
        buyAll.insertBefore( submit );

        // Hide buyAs select
        $( ".dataTable" ).find( "select" ).each( function() {
            var cell = $(this).parent();
            var buyAs = $( "<div class='toRemove buyAsTable'>Buy as Citizen</div>" );

            if( getValue( "configProductMarketSelection" ) == "true" ) {
                buyAs.insertBefore( cell.children().first() );
                cell.parent().css({ "background-color" : "#ecffec" });
                cell.contents().eq(0).remove();
                cell.children( "br" ).remove();
                $(this).hide();

            } else $(this).addClass( "customSelectList" );
        });

        // Add help message
        var divT = $( "<div class='helpFlagMessage'>Click on country flag to open the monetary market (only price column)</div>" );
        divT.insertBefore( ".dataTable" );

        // Resize table
        $( ".dataTable" ).addClass( "dataTableMod" );

        // Redesign table
        // Headers
        $( ".dataTable > tbody > tr:first-child > td" ).addClass( "dataTableHeaders" );
        var trHead = $( ".dataTable" ).find( "tr" ).eq(0).children();
        trHead.eq(0).css({ "width" : "70px" });
        trHead.eq(3).text( "Price/unit" );
        $( "<td class='dataTableHeaders'>Price</td>" ).insertAfter( trHead.eq(3) );

        // Product list
        resizeProductImage( $( ".dataTable" ).find( ".product" ) );

        // Name list and total price
        $( ".dataTable" ).find( "a" ).each( function() {

            // Name redesign
            var cell = $(this).parent();
            cell.children( ".currencyFlag" ).next().remove(); // Remove BR
            cell.children( ".currencyFlag" ).addClass( "dataTableNameFlag" );

            var div = $( "<div class='blockSeller'></div>" );
            var imgSeller = cell.children( "img" ).eq(1);
            imgSeller.addClass( "dataTableSeller" );
            div.append( imgSeller );

            var playerName = $( "<div class='playerName'></div>" ).append( cell.children( ":lt(2)" ) );
            div.append( playerName );
            if( cell.children().length > 0 ) {
                playerName.css({ "margin-top" :"3px" });

                cell.children().eq(0).remove();
                var stockName = $( "<div class='stockName'></div>" ).append( cell.children().eq(0) );
                div.append( stockName );
            }
            cell.append( div );

            var nextCell = cell.next().next();
            var flag = nextCell.children( "div" );
            flag.addClass( "monetaryMarketFlag" );

            // Add link to monetary market
            var url = getCurrentServer() + URLMonetaryMarket + "?buyerCurrencyId="+ IDByImageCountry( flag.attr( "class" ).split(" ")[1] ) +"&sellerCurrencyId=0";
            var link = $( "<a class='linkMonetaryMarket' href='"+ url +"' target='_blank'></a>" );
            link.insertBefore( flag );
            link.append( flag );

            // Total price
            var priceItem = parseFloat( nextCell.children( "b" ).text() );
            var n = ( parseInt( parseInt( cell.next().text() ) * priceItem * 100 ) )/100;
            var money = nextCell.contents().last().text();
            var newCell = $( "<td class='totalPriceProductMarket'><b>"+ n +"</b> "+ money +"</td>" );
            newCell.insertAfter( nextCell );
            newCell.append( "<br/ > Total: <div style='display:inline;width:10px' class='inputPrice'>0</div>" + money );
        });
    }

    //Advanced by CLard

    function calcValueInGold(id, callback) {

        _MM_C_URL = _MM_C_URL.replace("{1}", id);

        jQuery.get(getCurrentServer()+_MM_C_URL, function(data) {
            try {
                //get first row of the dataTable
                var $content = jQuery(data);
                var $table = jQuery(".dataTable", $content);
                if ($table.length > 0) {
                    $table = jQuery($table[0]);
                }

                //get the currency
                var c = $table[0].rows[1].cells[2].textContent.trim();
                c = c.substr(c.indexOf("=") + 1, c.indexOf("Gold") - c.indexOf("=") - 1);

                _currencyValue = parseFloat(c);

                //jQuery("#monetaryOfferPost #exchangeRatio").get(0).value = _currencyValue;

                if (callback) {
                    callback();
                }

            } catch (e) {
                console.log(e);
                _currencyValue = 0;
            }
        });
    }


    function displayGoldValue() {

        var $table = jQuery(".dataTable");
        var s = "";

        var id = jQuery("#productMarketViewForm #countryId");
        if (id.length > 0) {
            id = id[0].value;
        } else {
            id = _currencyId;
        }
        calcValueInGold(id, displayGoldValue.bind(this, id));

        //console.log("##### Values ######");
        try {
            if ($table.length > 0) {

                //need to get the tax for the selected country ....
                GET_URL=getCurrentServer()+_COUNTRY_URL.replace("{1}", id)
                jQuery.get(GET_URL, function(data) {
                    try {
                        var taxes = [];

                        var dt = jQuery(".dataTable", jQuery(data))[1];

                        for (var j=1; j<dt.rows.length;j++) {
                            var row = dt.rows[j];
                            taxes[j-1] = {
                                "name": dt.rows[j].cells[0].innerHTML.toUpperCase().trim(),
                                "value": parseFloat(row.cells[2].innerHTML.toUpperCase().replace("&NBSP;", "").replace("&NBSP;", "").trim()) + parseFloat(row.cells[1].innerHTML.toUpperCase().replace("&NBSP;", "").replace("&NBSP;", "").trim())
                            };
                        }

                        for (var k=1; k< $table[0].rows.length; k++) {
                            var $row = $table[0].rows[k];
                            var totalProduct = parseFloat($row.cells[2].textContent.trim());
                            s = $row.cells[3].textContent.trim();
                            if (s.indexOf("GOLD") >= 0) {
                                break;
                            }
                            var price = parseFloat(s.substr(0,s.indexOf(" ")).trim());
                            var priceInGold = Math.round((price * _currencyValue)*100000)/100000;
                            var totalPrice = Math.round(totalProduct * price * 1000)/1000;
                            var totalPriceInGold = Math.round((totalProduct * price * _currencyValue)*100000)/100000;

                            //console.log("price:" + price + " ; price in gold:" + priceInGold + " ; total price:" + totalPrice + " ; total in gold:" + totalPriceInGold);

                            $row.cells[3].innerHTML = $row.cells[3].innerHTML + " <br> <img src='https://cdn.e-sim.org/img/gold.png'><b>" + priceInGold + "</b> GOLD";
                            $row.cells[4].innerHTML = " <b>" + totalPriceInGold + "</b> Gold <br/>" + $row.cells[4].innerHTML //+
                            //"<br> Total in "+ s.substr(s.indexOf(" ")).trim() +": <b>" + totalPrice + "</b>"
                            //$row.cells[5].innerHTML = $row.cells[5].innerHTML +"<br><a style='cursor: pointer;color: #3787EA; font-weight: bold;' id='buyAllYouCan'>Buy All You Can</a>";


                            //console.log(taxes);

                            for (var h=0;h<taxes.length;h++) {
                                //alert(taxes[h].value)
                                if ($row.cells[0].innerHTML.toUpperCase().indexOf(taxes[h].name) >= 0) {
                                    console.log("tx:" + (parseFloat(taxes[h].value) / 100));

                                    $row.cells[3].innerHTML = $row.cells[3].innerHTML + "<br> <hr class='foundation-divider'> Price without tax: <b>" + (Math.round(((parseFloat(price) / (1 + parseFloat(taxes[h].value) / 100) )) *100000)/100000) + "</b>";
                                    $row.cells[3].innerHTML = $row.cells[3].innerHTML + " <br> Price(G) without tax: <b>" + (Math.round(((priceInGold / (1 + parseFloat(taxes[h].value) / 100) )) *100000)/100000) + "</b>";

                                    break;
                                }
                            }

                            jQuery("#buyAllYouCan", jQuery($row)).hover(
                                function () {
                                    $(this).css("color", "#FF3344");
                                },
                                function () {
                                    $(this).css("color", "#3787EA");
                                }
                            );

                            jQuery("#buyAllYouCan", jQuery($row)).bind("click", function() {
                                try {

                                    var $this_tr = jQuery(this).closest("tr")[0];
                                    var totalProd = parseFloat($this_tr.cells[2].textContent.trim());
                                    var ss = $this_tr.cells[3].textContent.trim();

                                    var pr = parseFloat(ss.substr(0,ss.indexOf(" ")).trim());

                                    var $usersAllMoney = jQuery(jQuery("#userMenu .plate")[1]);
                                    var usersMoney = -1;
                                    var currency = ss.substr(ss.indexOf(" "), (ss.indexOf("Price") - ss.indexOf(" ")) ).trim();

                                    var foundIt = false;
                                    for (var k=1;k<$usersAllMoney[0].childNodes.length;k++) {
                                        var e = $usersAllMoney[0].childNodes[k];
                                        if (e.nodeName == "B") {
                                            usersMoney = e.innerHTML;
                                        }
                                        if (e.nodeName == "#text" && e.nodeValue.trim() == currency) {
                                            foundIt = true;
                                            break;
                                        }
                                    }

                                    if (!foundIt) {
                                        usersMoney = -1;
                                    }

                                    usersMoney = parseFloat(usersMoney);

                                    var buyingProds = 0;
                                    if (usersMoney > 0) {
                                        buyingProds = parseInt(usersMoney / pr);

                                        if (buyingProds > totalProd) {
                                            buyingProds = totalProd;
                                        }
                                    }

                                    jQuery("input[name=quantity]", $this_tr.cells[4]).get(0).value = buyingProds;
                                } catch (e) {
                                    console.log(e);
                                }
                            });
                        }
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }

    }




    // Redesign product image
    function resizeProductImage( productList ) {

        productList.each( function() {
            var cell = $(this).parent();
            var img = cell.find( "img" );
            cell.children().remove()

            var block = $( "<div style='url('https://cdn.e-sim.org/img/stripes.png') repeat scroll 0 0 #3D6571'></div>" );
            //block.append( "<img class='blockProduct 'src='"+ IMGPRODBG +"' />" );
            block.append( img.eq(0).addClass( "productImage" ) );
            if( img.length > 1 ) { block.append( img.eq(1).addClass( "productQuality" ) ); }

            cell.append( block );
        });
    }

    function IDByImageCountry( img ) {

        switch( img ) {
            case POLAND: return( 1 );
            case RUSSIA: return( 2 );
            case GERMANY: return( 3 );
            case FRANCE: return( 4 );
            case SPAIN: return( 5 );
            case UK: return( 6 );
            case ITALY: return( 7 );
            case HUNGARY: return( 8 );
            case ROMANIA: return( 9 );
            case BULGARIA: return( 10 );
            case SERBIA: return( 11 );
            case CROATIA: return( 12 );
            case BOSNIA: return( 13 );
            case GREECE: return( 14 );
            case MACEDONIA: return( 15 );
            case UKRAINE: return( 16 );
            case SWEDEN: return( 17 );
            case PORTUGAL: return( 18 );
            case LITHUANIA: return( 19 );
            case LATVIA: return( 20 );
            case SLOVENIA: return( 21 );
            case TURKEY: return( 22 );
            case BRAZIL: return( 23 );
            case ARGENTINA: return( 24 );
            case MEXICO: return( 25 );
            case USA: return( 26 );
            case CANADA: return( 27 );
            case CHINA: return( 28 );
            case INDONESIA: return( 29 );
            case IRAN: return( 30 );
            case SOUTHKOREA: return( 31 );
            case TAIWAN: return( 32 );
            case ISRAEL: return( 33 );
            case INDIA: return( 34 );
            case AUSTRALIA: return( 35 );
            case NETHERLANDS: return( 36 );
            case FINLAND: return( 37 );
            case IRELAND: return( 38 );
            case SWITZERLAND: return( 39 );
            case BELGIUM: return( 40 );
            case PAKISTAN: return( 41 );
            case MALAYSIA: return( 42 );
            case NORWAY: return( 43 );
            case PERU: return( 44 );
            case CHILE: return( 45 );
            case COLOMBIA: return( 46 );
            case MONTENEGRO: return( 47 );
            case AUSTRIA: return( 48 );
            case SLOVAKIA: return( 49 );
            case DENMARK: return( 50 );
            case CZECH: return( 51 );
            case BELARUS: return( 52 );
            case ESTONIA: return( 53 );
            case PHILIPPINES: return( 54 );
            case ALBANIA: return( 55 );
            case VENEZUELA: return( 56 );
            case EGYPT: return( 57 );
            case JAPAN: return( 58 );
            case BANGLADESH: return( 59 );
            case VIETNAM: return( 60 );
            case YEMEN: return( 61 );
            case SAUDIARABIA: return( 62 );
            case THAILAND: return( 63 );
            case ALGERIA: return( 64 );
            case ANGOLA: return( 65 );
            case CAMEROON: return( 66 );
            case IVORYCOAST: return( 67 );
            case ETHIOPIA: return( 68 );
            case GHANA: return( 69 );
            case KENYA: return( 70 );
            case LIBYA: return( 71 );
            case MOROCCO: return( 72 );
            case MOZAMBIQUE: return( 73 );
            case NIGERIA: return( 74 );
            case SENEGAL: return( 75 );
            case SOUTHAFRICA: return( 76 );
            case SUDAN: return( 77 );
            case TANZANIA: return( 78 );
            case TOGO: return( 79 );
            case TUNISIA: return( 80 );
            case UGANDA: return( 81 );
            case ZAMBIA: return( 82 );
            case ZIMBABWE: return( 83 );
            case BOTSWANA: return( 84 );
            case BENIN: return( 85 );
            case BURKINAFASO: return( 86 );
            case CONGO: return( 87 );
            case CENTRALAFRICANREPUBLIC: return( 88 );
            case DROFTHECONGO: return( 89 );
            case ERITREA: return( 90 );
            case GABON: return( 91 );
            case CHAD: return( 92 );
            case NIGER: return( 93 );
            case MALI: return( 94 );
            case MAURITANIA: return( 95 );
            case GUINEA: return( 96 );
            case GUINEABISSAU: return( 97 );
            case SIERRALEONE: return( 98 );
            case LIBERIA: return( 99 );
            case EQUATORIALGUINEA: return( 100 );
            case NAMIBIA: return( 101 );
            case LESOTHO: return( 102 );
            case SWAZILAND: return( 103 );
            case MADAGASCAR: return( 104 );
            case MALAWI: return( 105 );
            case SOMALIA: return( 106 );
            case DJIBOUTI: return( 107 );
            case RWANDA: return( 108 );
            case BURUNDI: return( 109 );
            case UAE: return( 110 );
            case SYRIA: return( 111 );
            case IRAQ: return( 112 );
            case OMAN: return( 113 );
            case QATAR: return( 114 );
            case JORDAN: return( 115 );
            case WESTERNSAHARA: return( 116 );
            case THEGAMBIA: return( 117 );
            case SOUTHSUDAN: return( 118 );
            case CAMBODIA: return( 119 );
            case NEPAL: return( 120 );
            case BOLIVIA: return( 121 );
            case ECUADOR: return( 122 );
            case PARAGUAY: return( 123 );
            case URUGUAY: return( 124 );
            case HONDURAS: return( 125 );
            case DOMINICANREPUBLIC: return( 126 );
            case GUATEMALA: return( 127 );
            case KAZAKHSTAN: return( 128 );
            case SRILANKA: return( 129 );
            case AFGHANISTAN: return( 130 );
            case ARMENIA: return( 131 );
            case AZERBAIJAN: return( 132 );
            case GEORGIA: return( 133 );
            case KYRGYZSTAN: return( 134 );
            case LAOS: return( 135 );
            case TAJIKISTAN: return( 136 );
            case TURKMENISTAN: return( 137 );
            case UZBEKISTAN: return( 138 );
            case NEWZEALAND: return( 139 );
            case GUYANA: return( 140 );
            case SURINAME: return( 141 );
            case NICARAGUA: return( 142 );
            case PANAMA: return( 143 );
            case COSTARICA: return( 144 );
            case MONGOLIA: return( 145 );
            case PAPUANEWGUINEA: return( 146 );
            case CUBA: return( 147 );
            case LEBANON: return( 148 );
            case PUERTORICO: return( 149 );
            case MOLDOVA: return( 150 );
            case JAMAICA: return( 151 );
            case ELSALVADOR: return( 152 );
            case HAITI: return( 153 );
            case BAHRAIN: return( 154 );
            case KUWAIT: return( 155 );
            case CYPRUS: return( 156 );
            case BELIZE: return( 157 );
            case KOSOVO: return( 158 );
            case EASTTIMOR: return( 159 );
            case BAHAMAS: return( 160 );
            case SOLOMONISLANDS: return( 161 );
            case MYANMAR: return( 162 );
            case NORTHKOREA: return( 163 );
            case BHUTAN: return( 164 );
            case ICELAND: return( 165 );
            case VANUATU: return( 166 );

            default: return( 0 );
        }
    }



    function IDbyCC( CC ) {


        //prompt("a",CC)



        switch( String(CC) ) {
            case "PLN": return( 1 );
            case "RUB": return( 2 );
            case "DEM": return( 3 );
            case "FRF": return( 4 );
            case "ESP": return( 5 );
            case "GBP": return( 6 );
            case "ITL": return( 7 );
            case "HUF": return( 8 );
            case "RON": return( 9 );
            case "BGN": return( 10 );
            case "RSD": return( 11 );
            case "HRK": return( 12 );
            case "BAM": return( 13 );
            case "GRD": return( 14 );
            case "MKD": return( 15 );
            case "UAH": return( 16 );
            case "SEK": return( 17 );
            case "PTE": return( 18 );
            case "LTL": return( 19 );
            case "LVL": return( 20 );
            case "SIT": return( 21 );
            case "TRY": return( 22 );
            case "BRL": return( 23 );
            case "ARS": return( 24 );
            case "MXN": return( 25 );
            case "USD": return( 26 );
            case "CAD": return( 27 );
            case "CNY": return( 28 );
            case "IDR": return( 29 );
            case "IRR": return( 30 );
            case "KRW": return( 31 );
            case "TWD": return( 32 );
            case "NIS": return( 33 );
            case "INR": return( 34 );
            case "AUD": return( 35 );
            case "NLG": return( 36 );
            case "FIM": return( 37 );
            case "IEP": return( 38 );
            case "CHF": return( 39 );
            case "BEF": return( 40 );
            case "PRK": return( 41 );
            case "MYR": return( 42 );
            case "NOK": return( 43 );
            case "PEN": return( 44 );
            case "CLP": return( 45 );
            case "COP": return( 46 );
            case "CZK": return( 51 );
            case "BYR": return( 52 );
            case "EEK": return( 53 );
            case "PHP": return( 54 );
            case "BDT": return( 59 );
            case "THB": return( 63 );
            default: return( 0 );
        }
    }

    // Change market oferrs
    function changeMarketOffers() {

        var select = $( "#resourceInput" );
        var pos = $( ".storage" ).parent();
        var dest = $( "#quantity" );

        var leftDiv = $( "#productMarketOfferForm" ).parent();
        leftDiv.children().first().remove();
        leftDiv.children().first().remove();
        leftDiv.addClass( "leftDivMyOffers" );

        // Remove all childrens and add help text
        pos.children().remove();
        pos.addClass( "myOffersProduct" );
        pos.append( "One click to select <b>ONE item</b>.<br/>Double click to select <b>ALL items</b>.<br/>" );

        var divBlue = $( "#countryInput" ).parent().parent();
        divBlue.find( "b" ).eq(0).css({ "display" : "inline" });
        divBlue.find( "b" ).eq(1).css({ "display" : "inline" });

        $( "#countryInput" ).addClass( "customSelectList" );
        select.addClass( "customSelectList" );

        firstFastButton = true;
        dest.addClass( "quantityMyOffers" );
        $( "#priceInput" ).addClass( "priceInputMyOffers" );

        var btn10 = $( "<input class='fastBtn FastButtonLeft' type='button' value='10' />" );
        btn10.bind( "click", function() {
            if( firstFastButton ) {
                dest.attr( "value", "10" );
            } else dest.attr( "value", parseInt( dest.attr( "value" ) ) + 10 );
            firstFastButton = false;
        });



        var btn100 = $( "<input class='fastBtn FastButtonRight' type='button' value='100' />" );
        btn100.bind( "click", function() {
            if( firstFastButton ) {
                dest.attr( "value", "100" );
            } else dest.attr( "value", parseInt( dest.attr( "value" ) ) + 100 );
            firstFastButton = false;
        });

        var btn1000 = $( "<input class='fastBtn FastButtonRight' type='button' value='1K' />" );
        btn1000.bind( "click", function() {
            if( firstFastButton ) {
                dest.attr( "value", "1000" );
            } else dest.attr( "value", parseInt( dest.attr( "value" ) ) + 1000 );
            firstFastButton = false;
        });

        btn10.insertBefore( dest );

        btn1000.insertAfter( dest );
        btn100.insertAfter( dest );

        orderSelect( select );
        changeSelect( select, pos, dest, "#aaaaaa" );

        $( ".storage" ).bind( "click", function() { setTimeout( mySendPreviewRequest, 500 ); });
        $( "#countryInput" ).unbind( "change" );
        $( "#countryInput" ).bind( "change", function() { mySendPreviewRequest(); });
        $( "#resourceInput" ).unbind( "change" );
        $( "#resourceInput" ).bind( "change", function() { mySendPreviewRequest(); });
        $( "#priceInput" ).unbind( "change" );
        $( "#priceInput" ).bind( "change", function() { mySendPreviewRequest(); });
        $( "#priceInput" ).bind( "keydown", function() { setTimeout( mySendPreviewRequest, 1000 ); 	});
    }


    // Replace sendPreviewRequest to restyle
    function mySendPreviewRequest() {
        if( !isFormCorrect() ) { return; }

        // If is in the player or in the Stock
        var csFlag;
        var localUrl = new String( window.location );
        if( localUrl.indexOf( URLMarketOffers, 0 ) >= 0 ) {
            csFlag = $( "a[href='pendingCitizenshipApplications.html']" ).prev();

        } else if( localUrl.indexOf( URLStockProducts, 0 ) >= 0 ) {
            csFlag = $("a[href*='stockCompanyAssets.html?id=']").prev().prev().prev().prev().prev().prev();
            //alert(csFlag)

        }
        var citizenship = IDByImageCountry( csFlag.attr( "class" ).split(" ")[1] );

        //alert(citizenship)

        var dataString = 'country=' + $("#countryInput").val() + '&resource=' + $("#resourceInput").val();
        dataString += '&price=' +$("#priceInput").val() + '&citizenship=' + citizenship;
        var resourceType = $("#resourceInput option:selected").text();
        $( "#preview" ).html( "<div class ='previewMyOffers'>Loading tax resource...</div >" );

        $.ajax({
            type: "POST",
            url: "productTaxes.html",
            data: dataString,
            dataType: "html",
            success: function( data ) {
                var preview = $( "#preview" );
                preview.html( data );
                preview.children( ".dataTable" ).addClass( "previewDataTable" );

                var res = $( "<div class='resourceMyOffers'>"+ resourceType + "</div>" );
                var link = getCurrentServer() + URLMarket + "?resource=";
                var splitItem = $("#resourceInput").val().split( "-" );
                if( splitItem.length == 1 ) {
                    link += splitItem[0] + "&countryId=" + $("#countryInput").val();
                } else link += splitItem[1] + "&countryId=" + $("#countryInput").val() + "&quality=" + splitItem[0];
                res.append( "<br /><a class='textMyOffers' href='"+ link +"' target='_blank'>Market</a>" );

                link = getCurrentServer() + URLMonetaryMarket + "?buyerCurrencyId="+ $("#countryInput").val() +"&sellerCurrencyId=0";
                res.append( "  |  <a class='MMMyOffers' href='"+ link +"' target='_blank'>MM link</a>" );

                var flag = preview.find( ".currencyFlag" ).first();
                flag.addClass( "flagMyOffer" );

                // Remove all flags
                preview.find( ".currencyFlag" ).remove();
                res.insertBefore( preview.children().first() );
                flag.insertBefore( preview.children( "b" ).first() );
                preview.children( "b" ).addClass( "titleMyOffers" );

                var thead = preview.children( ".dataTable" ).find( "tr" ).eq(0);
                preview.children( ".dataTable" ).find( "tr" ).eq(1).children().css({ "height" : "25px" });
                thead.children().css({ "height" : "22px" });
                thead.children().eq(0).text( "Gross" );
                thead.children().eq(1).text( "Net" );
                thead.children().eq(3).text( "Tax" );
            }
        });
    }


    // Change monetary market view
    function changeMonetaryMarket() {

        if( $( "#container" ).children().length == 3 ) {
            $( "#container" ).children().last().remove();
        }
        var listBlue = $( "#container" ).find( ".testDivblue" );
        var currentOffersTitle = listBlue.eq(2);
        listBlue.eq(2).hide();
        var currentOffers = listBlue.eq(3);
        var yourOffersTitle = listBlue.eq(4);
        var yourOffers = listBlue.eq(5);

        //currentOffers.addClass( "currentOffersMM" );
        yourOffers.addClass( "yourOffersMM" );
        yourOffers.children().last().remove();

        // Custom Selects
        $( "#buy" ).addClass( "customSelectList" );
        $( "#sell" ).addClass( "customSelectList" );
        $( "#offeredMoneyId" ).addClass( "customSelectList" );
        $( "#buyedMoneyId" ).addClass( "customSelectList" );

        // Create new blocks BR
        var block1 = $( "<div class='monetaryMarketTitleBlock'></div>" );
        block1.insertBefore( currentOffersTitle );
        //block1.append( currentOffers );
        block1.append( currentOffersTitle );


        // New button in current offers
        var swapView = $( "<input class='swapView' type='button' value='Swap & View' />" );
        swapView.insertAfter( "#swap1" );
        swapView.bind( "click", function() {
            $("#buy").val($("#offeredMoneyId").val())
            $("#sell").val($("#buyedMoneyId").val())
            $( "#swap1" ).click();
            $( "#monetaryMarketView" ).submit();
        });

        // View Button
        var ViewButt= $( "<input class='swapView' type='button' value='View' />" );
        ViewButt.insertBefore( "#swap1" );
        ViewButt.bind( "click", function() {
            //copy
            $("#buy").val($("#offeredMoneyId").val())
            $("#sell").val($("#buyedMoneyId").val())
            $( "#monetaryMarketView" ).submit();
        });


        $( "#swap1" ).addClass( "swapView" );


        // Redesign in your offers
        var block2 = $( "<div class='monetaryMarketTitleBlock'></div>" );
        block2.insertBefore( currentOffersTitle );
        block2.append( yourOffersTitle );
        //block2.append( currentOffers );
        //block2.append( yourOffers );

        $( "#swap1" ).addClass( "swapYourOffers" );
        $( "#swap1" ).bind( "click", function() {
            var temp = $( "#buy" ).val();
            $( "#buy" ).val( $( "#sell" ).val() );
            $( "#sell" ).val( temp );

            if( $( "#offeredMoneyId" ).val() == "0" ) {
                var cc = $( ".monetaryMarketCurrencyBlock" ).find( ".currencySelector[id='"+ $( "#buyedMoneyId" ).val() +"']" );
                var v = "0.0";
                if( cc.length != 0 ) { v = cc.children( "b" ).text(); }
                $( "#value" ).val( v );

            } else $( "#value" ).val( "0.0" );
        });

        $( "#buyedMoneyId" ).next().remove();
        $( "#value" ).addClass( "priceInputMM" );
        $( "#exchangeRatio" ).addClass( "priceInputMM" );

        var blockCurrency = $( "<div class='monetaryMarketCurrencyBlock'></div>" );
        blockCurrency.addClass( "testDivblue" );
        //blockCurrency.append( block1 );

        block1.append( blockCurrency );

        // Add currency block
        var plate = $( "#hiddenMoney" ).parent();
        plate.find( ".flags-small" ).each( function() {

            var id = IDByImageCountry( $(this).attr( "class" ).split(" ")[1] );
            var itemCC = $( "<div class='currencySelector'></div>" );
            itemCC.attr( "id", id );
            if( id == 0 ) { selectedCurrency = itemCC; }
            itemCC.append( "<div class='"+$(this).attr( "class" )+"'></div>" );
            itemCC.append( "<b>"+ $(this).next().text() +" </b>" );
            var currencyName = $( "#buy" ).children( "option[value='"+ id +"']" ).text().split( " " );
            itemCC.append( currencyName[0] );
            blockCurrency.append( itemCC );

            itemCC.bind( "click", function() {

                var idC = $(this).attr( "id" );
                if( (idC != "0") && (idC != selectedCurrency.attr( "id" )) ) {
                    if( selectedCurrency ) { selectedCurrency.removeClass( "selectedCurrency" ); }

                    if( $( "#buy" ).val() == "0" ) {
                        $( "#sell" ).val( idC );
                    } else $( "#buy" ).val( idC );

                    if( $( "#offeredMoneyId" ).val() == "0" ) {
                        $( "#buyedMoneyId" ).val( idC );
                    } else $( "#offeredMoneyId" ).val( idC );

                    $(this).addClass( "selectedCurrency" );
                    selectedCurrency = $(this);

                    var currency = "Gold";
                    if ( $( "#buyedMoneyId > option:selected" ).text() != "Gold" ) {
                        currency = $( "#buyedMoneyId > option:selected" ).text().substr( 0, 3 );
                    }
                    $( "#offeredRate2" ).text( currency );

                    currency = "Gold";
                    if ( $( "#offeredMoneyId > option:selected" ).text() != "Gold" ) {
                        currency = $( "#offeredMoneyId > option:selected" ).text().substr( 0, 3 );
                    }
                    $( "#offeredCurrency" ).text( currency );
                    $( "#offeredRate1" ).text( currency );

                    if( $( "#buyedMoneyId" ).val() == "0" ) {
                        $( "#value" ).val( $(this).children( "b" ).text() );

                    } else $( "#value" ).val( "0.0" );
                }
            });
        });

        // Add fast buttons
        var idDest = "#value";
        var firstFastButton = true;
        var btn1 = $( "<input class='priceFastButton' type='button' value='1' />" );
        btn1.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "1" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 1 );
            firstFastButton = false;
        });

        var btn5 = $( "<input class='priceFastButton' type='button' value='5' />" );
        btn5.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "5" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 5 );
            firstFastButton = false;
        });

        var btn10 = $( "<input class='priceFastButton' type='button' value='10' />" );
        btn10.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "10" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 10 );
            firstFastButton = false;
        });

        var btn50 = $( "<input class='priceFastButton' type='button' value='50' />" );
        btn50.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "50" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 50 );
            firstFastButton = false;
        });

        var btn100 = $( "<input class='priceFastButton' type='button' value='100' />" );
        btn100.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "100" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 100 );
            firstFastButton = false;
        });

        var btn500 = $( "<input class='priceFastButton' type='button' value='500' />" );
        btn500.bind( "click", function() {
            if( firstFastButton ) {
                $( idDest ).attr( "value", "500" );
            } else $( idDest ).attr( "value", parseInt( $( idDest ).attr( "value" ) ) + 500 );
            firstFastButton = false;
        });

        var pos = $( "#offeredRate2" ).next();
        btn1.insertBefore( pos );
        btn5.insertBefore( pos );
        btn10.insertBefore( pos );
        btn50.insertBefore( pos );
        btn100.insertBefore( pos );
        btn500.insertBefore( pos );

        // Add confirm option
        var postButton = $( "<input class='postOfferButton' type='button' value='Post new offer' />" );
        var pos = $( "#monetaryOfferPost" ).children( "center" ).children( "input" );
        postButton.insertBefore( pos );
        pos.hide();
        postButton.click( "click", function() {
            var value = parseFloat( $( "#value" ).val() );
            var change = parseFloat( $( "#exchangeRatio" ).val() );
            var res = confirm( "Sell "+ value +" "+ $( "#offeredCurrency" ).text() +" for "+ (value*change) +" "+ $( "#offeredRate2" ).text() );
            if( res ) { $( "#monetaryOfferPost" ).submit(); }
        });
    }


    // Change monetary market product table
    function changeMonetaryMarketTable() {

        $( ".dataTable" ).find( "input[type='text']" ).addClass( "inputTextTable" );
        var submit = $( ".dataTable" ).find( "input[type='submit']" ).addClass( "inputSubmitTable" );

        // Add buy all button
        var buyAll = $( "<input class='buyAllSubmit' type='submit' value='All' />" );
        buyAll.bind( "click", function() {
            var v = $(this).parent().parent().prev().prev().text().match(/\d{1,10}.\d{1,5}/);
            //alert(v)
            $(this).parent().children( "input[type='text']" ).val( v );
            return( false );
        });
        buyAll.insertBefore( submit );

        // Resize table
        $( ".dataTable" ).addClass( "dataTableMod" );

        // Redesign table
        // Headers
        $( ".dataTable > tbody > tr:first-child > td" ).addClass( "dataTableHeaders" );
    }


    // Add extra links in the shares menu
    function addSharesExtraLinks() {

        var firstRow = true;
        var firstPlate = $( ".testDivwhite" ).first();
        firstPlate.css({ "width" : "570px" });
        firstPlate.children( ".dataTable" ).css({ "width" : "550px" });
        firstPlate.children( ".dataTable:first" ).find( "tr" ).each( function() {

            var td = $( "<td></td>" );
            td.insertAfter( $(this).children().first() );
            if( firstRow ) {
                firstRow = false;
                td.append( "Fast links" );

            } else {
                var idStock = $(this).children().first().find( "a" ).attr( "href" );
                var imgStock = $(this).children().first().find( "img" ).eq(1);
                var linkStock = $( "<a href='"+ idStock +"'></a>" ).insertBefore( imgStock );
                linkStock.append( imgStock );
                var split = idStock.split( "?id=" );
                if( split.length > 1 ) { idStock = split[1]; }

                td.append( "<a style='display:block' href='"+ getCurrentServer() + URLStockMM + idStock +"'>MM offers</a>" );
                td.append( "<a style='display:block' href='"+ getCurrentServer() + URLStockProducts + idStock +"'>Product offers</a>" );
                td.append( "<a style='display:block' href='"+ getCurrentServer() + URLStockDonateMoney + idStock +"'>Donate money</a>" );
                td.append( "<a style='display:block' href='"+ getCurrentServer() + URLStockDonateCompany + idStock +"'>Donate company</a>" );
                td.append( "<a style='display:block' href='"+ getCurrentServer() + URLStockLogs + idStock +"&importance=TRIVIAL '>Logs</a>" );
            }
        });
    }


    // Change stock main div
    function changeStockMainMenu() {

        var listBlue = $( "#contentRow" ).children( "td" ).eq(1).find( ".testDivblue" );
        $( "#contentRow" ).children( "td" ).eq(1).children().eq(1).remove();

        var mainStockInfo = listBlue.eq(0);
        mainStockInfo.children( "br" ).remove();
        mainStockInfo.children( "p" ).remove();

        var rightBlock = mainStockInfo.find( "td" ).eq(1);
        rightBlock.css({ "width" : "350px" });
        rightBlock.children().eq(2).css({ "width" : "70px" });
        rightBlock.children().eq(3).css({ "width" : "275px" });

        var linkWiki = $( "<div class='linkWiki'></div>" );
        var linkImg = $( "<a href='"+ mainStockInfo.children( "a" ).attr( "href" ) +"'></a>" );
        linkWiki.append( linkImg.append( mainStockInfo.children( "img" ) ) );
        linkWiki.append( mainStockInfo.children( "a" ) );
        mainStockInfo.append( linkWiki );
    }


    // Change stock floating divs in the main menu
    function changeStockFloatingDivs() {

        var listWhite = $( "#contentRow" ).children().eq(2).find( ".testDivwhite" );
        var listBlue = $( "#contentRow" ).children().eq(2).find( ".testDivblue" );

        var companyStatute = listWhite.eq(0);
        companyStatute.addClass( "divShareMenu divShareMenuHide" );
        companyStatute.bind( "click", function() {
            if( $(this).hasClass( "divShareMenuHide" ) ) {
                $(this).removeClass( "divShareMenuHide" );

            } else $(this).addClass( "divShareMenuHide" );
        });

        var stockPrice = listWhite.eq(1);
        stockPrice.addClass( "divShareMenu divShareMenuHide" );
        stockPrice.bind( "click", function() {
            if( $(this).hasClass( "divShareMenuHide" ) ) {
                $(this).removeClass( "divShareMenuHide" );

            } else $(this).addClass( "divShareMenuHide" );
        });

        var acts = listBlue.eq(1);
        acts.addClass( "divShareMenu divShareMenuMediumHide" );
        acts.bind( "click", function() {
            if( $(this).hasClass( "divShareMenuMediumHide" ) ) {
                $(this).removeClass( "divShareMenuMediumHide" );

            } else $(this).addClass( "divShareMenuMediumHide" );
        });

        var staff = listBlue.eq(2);
        staff.addClass( "divShareMenu divShareMenuMediumHide" );
        staff.bind( "click", function() {
            if( $(this).hasClass( "divShareMenuMediumHide" ) ) {
                $(this).removeClass( "divShareMenuMediumHide" );

            } else $(this).addClass( "divShareMenuMediumHide" );
        });

        var companies = listBlue.eq(3);
        var shouts = listBlue.eq(4);
        shouts.insertBefore( companies );
        companies.insertBefore( stockPrice );

        var sharesMarket = listWhite.eq(2);
        stockPrice.insertBefore( sharesMarket );
        $( "<br/>" ).insertAfter( stockPrice );

        companies.addClass( "divShareMenuFixed" ).css({ "width" : "340px" });
        shouts.addClass( "divShareMenuFixed" );

        sharesMarket.addClass( "divShareMenuFixed" );
        listWhite.eq(3).addClass( "divShareMenuFixed" );
    }


    // Change product selection in a stock company
    function changeStockProductSelection() {

        var pos = $( ".testDivwhite" );
        var select = $( "#resourceInput" );
        if( select.length == 0 ) {

            pos.addClass( "storageUnselectStock" );
            pos.children( "br" ).remove();

        } else {
            var dest = $( "#resourceInput" ).next().next();

            // Remove all childrens and add help text
            pos.children().remove();
            pos.addClass( "storageSelectStock" );
            pos.append( "One click to select <b>ONE item</b>. Double click to select <b>ALL items</b>.<br/>" );

            var divBlue = $( "#countryInput" ).parent().parent();
            divBlue.addClass( "formSelectStock" );
            divBlue.find( "b" ).eq(0).css({ "display" : "inline" });
            divBlue.find( "b" ).eq(1).css({ "display" : "inline" });
            divBlue.insertAfter( pos );

            $( "#countryInput" ).addClass( "customSelectList" );
            select.addClass( "customSelectList" );

            orderSelect( select );
            changeSelect( select, pos, dest, "#aaaaaa" );

            firstFastButton = true;
            dest.val( "1" );
            dest.addClass( "quantityMyOffers" );
            $( "#priceInput" ).val( "1.0" );
            $( "#priceInput" ).addClass( "priceInputMyOffers" );

            var btn10 = $( "<input class='fastBtn FastButtonLeft' type='button' value='10' />" );
            btn10.bind( "click", function() {
                if( firstFastButton ) {
                    dest.attr( "value", "10" );
                } else dest.attr( "value", parseInt( dest.attr( "value" ) ) + 10 );
                firstFastButton = false;
            });

            var btn50 = $( "<input class='fastBtn FastButtonLeft' type='button' value='50' />" );
            btn50.bind( "click", function() {
                if( firstFastButton ) {
                    dest.attr( "value", "50" );
                } else dest.attr( "value", parseInt( dest.attr( "value" ) ) + 50 );
                firstFastButton = false;
            });

            var btn100 = $( "<input class='fastBtn FastButtonRight' type='button' value='100' />" );
            btn100.bind( "click", function() {
                if( firstFastButton ) {
                    dest.attr( "value", "100" );
                } else dest.attr( "value", parseInt( dest.attr( "value" ) ) + 100 );
                firstFastButton = false;
            });

            var btn1000 = $( "<input class='fastBtn FastButtonRight' type='button' value='1K' />" );
            btn1000.bind( "click", function() {
                if( firstFastButton ) {
                    dest.attr( "value", "1000" );
                } else dest.attr( "value", parseInt( dest.attr( "value" ) ) + 1000 );
                firstFastButton = false;
            });

            btn10.insertBefore( dest );
            btn50.insertBefore( dest );
            btn1000.insertAfter( dest );
            btn100.insertAfter( dest );

            $( ".storage" ).bind( "click", function() { setTimeout( mySendPreviewRequest, 500 ); });
            $( "#countryInput" ).unbind( "change" );
            $( "#countryInput" ).bind( "change", function() { mySendPreviewRequest(); });
            $( "#resourceInput" ).unbind( "change" );
            $( "#resourceInput" ).bind( "change", function() { mySendPreviewRequest(); });
            $( "#priceInput" ).unbind( "change" );
            $( "#priceInput" ).bind( "change", function() { mySendPreviewRequest(); });
            $( "#priceInput" ).bind( "keydown", function() { setTimeout( mySendPreviewRequest, 1000 ); 	});
        }
    }


    // Change travel menu
    function changeTravelMenu() {

        var minTicket = 0;
        var vecItems = [];
        var plate = $( "#citizenTravelForm" ).parent().addClass( "citizenTravelFormMod" );
        $( "#citizenTravelForm" ).children( "input" ).addClass( "citizenTravelFormInput" );

        $( "#citizenshipSelect" ).addClass( "customSelectList" );
        $( "#regionId" ).addClass( "customSelectList" );
        $( "<br/>" ).insertBefore( $( "#regionId" ).parent() );

        var marginBlock = $( "<div class='centerBlockTravel'></div>" );
        var block = $( "<table class='blockTravel testDivwhite'></table>" );
        marginBlock.append( block );

        var selectedTicket = null;
        $( "#ticketQuality" ).find( "option" ).each( function() {

            var q = $(this).attr( "value" );
            //alert($(this).text())
            var ticket = $( "<td class='ticketTravel' indexselect='"+ q +"'></td>" );
            ticket.append( "<img src='"+ IMGTICKET +"' class='imageTicket' />" );
            ticket.append( "<div class='healthTicket'>- "+ (40 - ((q-1) * 10)) +"</div>" );
            ticket.append( "<img src='"+ IMGQUALITY + $(this).attr( "value" ) +".png' class='imageQuality' />" );
            block.append( ticket );

            // Find number of items
            //Q1 (7, -40 wellness to restore)
            var n= $(this).text().split("(")[1].split(",")[0].replace(")","") || 0;

            ticket.append( "<div class='numberItems'>"+ n +"</div>" );

            if( n > 0 ) {
                if( minTicket == 0 ) { minTicket = q; }

                ticket.bind( "mouseover", function() {
                    if( selectedTicket.attr( "indexselect" ) != $(this).attr( "indexselect" ) ) { $(this).addClass( "ticketHover" ); }
                });

                ticket.bind( "mouseout", function() {
                    if( selectedTicket.attr( "indexselect" ) != $(this).attr( "indexselect" ) ) { $(this).removeClass( "ticketHover" ); }
                });

                ticket.bind( "click", function() {
                    if( selectedTicket ) { selectedTicket.removeClass( "ticketSelected" ); }
                    selectedTicket = $(this);
                    $(this).addClass( "ticketSelected" );
                    $( "#ticketQuality option" )[ $(this).attr( "indexselect" )-1 ].selected = true;
                });

            } else ticket.addClass( "disabledTicket" );
            vecItems.push( ticket );
        });

        // Default min ticket
        if( minTicket > 0 ) { vecItems[ minTicket-1].click() }

        $( "<br/>" ).insertAfter( $( "#ticketQuality" ).parent() );
        $( "#ticketQuality" ).prev().remove();
        $( "#ticketQuality" ).prev().remove();
        $( "#ticketQuality" ).css({ "display" : "none" });
        block.insertBefore( $( "#ticketQuality" ) );

        // Check GET vars
        var urlVars = getUrlVars();
        if( (urlVars[ "idc" ] != undefined) && (urlVars[ "idr" ] != undefined) ) {

            $( "#citizenshipSelect" ).val( urlVars[ "idc" ] );
            $.ajax({
                url: "countryRegions.html",
                context: document.body,
                type: "POST",
                data: { countryId : urlVars[ "idc" ] },
                success: function( data ) {
                    $( "#regionId" ).find( "option" ).remove();
                    var json = jQuery.parseJSON( data );
                    for( var i=0; i<json.length; i++ ) {
                        $( "#regionId" ).append( "<option value='"+ json[i][0] +"'>"+ json[i][1] +"</option>" );
                    }
                    $( "#regionId" ).val( urlVars[ "idr" ] );
                }
            });
        }
    }


    // Redesign equipment
    function redesignEquipment() {

        var block = $( ".equipmentName" ).parent();
        var firstBlock = $(".equipmentName:first").parent();
        var secondBlock = $(".equipmentName:last").parent();

        var remove = "<div class='removeItem' style='top: 10px;'>CLICK TO REMOVE</div>";
        var formHelmet = firstBlock.find(".equipmentBox").last().next();
        var formVision = formHelmet.next();
        var formArmor = formVision.next();
        var formPants = formArmor.next();
        var formShoes = formPants.next();
        var formLuckyCharm = secondBlock.find(".equipmentBox").last().next();
        var formWepup = formLuckyCharm.next();
        var formOffhand = formWepup.next();

        // Rellocate equipment interaction
        var helmet = $( ".equipmentName" ).eq(0).addClass( "helmetTitle" ).css("width","68px");
        $( ".equipmentBox" ).eq(0).append( helmet );
        $( ".equipmentBack" ).eq(0).children().first().append( remove );
        $( ".equipmentBack" ).eq(0).bind( "click", function() { if( formHelmet.is( "form" ) ) { formHelmet.children( "input" ).last().click(); } });

        var vision = $( ".equipmentName" ).eq(1).addClass( "visionTitle" ).css("width","68px");
        $( ".equipmentBox" ).eq(1).append( vision );
        $( ".equipmentBack" ).eq(1).children().first().append( remove );
        $( ".equipmentBack" ).eq(1).bind( "click", function() { if( formVision.is( "form" ) ) { formVision.children( "input" ).last().click(); } });

        var armor = $( ".equipmentName" ).eq(2).addClass( "armorTitle" ).css("width","68px");
        $( ".equipmentBox" ).eq(2).append( armor );
        $( ".equipmentBack" ).eq(2).children().first().append( remove );
        $( ".equipmentBack" ).eq(2).bind( "click", function() { if( formArmor.is( "form" ) ) { formArmor.children( "input" ).last().click(); } });

        var pants = $( ".equipmentName" ).eq(3).addClass( "weaponTitle" ).css("width","68px");
        $( ".equipmentBox" ).eq(3).append( pants );
        $( ".equipmentBack" ).eq(3).children().first().append( remove );
        $( ".equipmentBack" ).eq(3).bind( "click", function() { if( formPants.is( "form" ) ) { formPants.children( "input" ).last().click(); } });

        var shoes = $( ".equipmentName" ).eq(4).addClass( "offhandTitle" ).css("width","68px");
        $( ".equipmentBox" ).eq(4).append( shoes );
        $( ".equipmentBack" ).eq(4).children().first().append( remove );
        $( ".equipmentBack" ).eq(4).bind( "click", function() { if( formShoes.is( "form" ) ) { formShoes.children( "input" ).last().click(); } });

        var LuckyCharm = $( ".equipmentName" ).eq(5).addClass( "LuckyCharmTitle" ).css("width","68px");
        LuckyCharm.find("b").text("Lucky C.")
        $( ".equipmentBox" ).eq(5).append( LuckyCharm );
        $( ".equipmentBack" ).eq(5).children().first().append( remove );
        $( ".equipmentBack" ).eq(5).bind( "click", function() { if( formLuckyCharm.is( "form" ) ) { formLuckyCharm.children( "input" ).last().click(); } });

        var wepup = $( ".equipmentName" ).eq(6).addClass( "wepupTitle" ).css("width","68px");
        $( ".equipmentBox" ).eq(6).append( wepup );
        $( ".equipmentBack" ).eq(6).children().first().append( remove );
        $( ".equipmentBack" ).eq(6).bind( "click", function() { if( formWepup.is( "form" ) ) { formWepup.children( "input" ).last().click(); } });

        var offhand = $( ".equipmentName" ).eq(7).addClass( "offhandTitle" ).css("width","68px");
        $( ".equipmentBox" ).eq(7).append( offhand );
        $( ".equipmentBack" ).eq(7).children().first().append( remove );
        $( ".equipmentBack" ).eq(7).bind( "click", function() { if( formOffhand.is( "form" ) ) { formOffhand.children( "input" ).last().click(); } });


        // Change remove mode
        $( ".equipmentBack" ).each( function() {
            if( !$(this).hasClass( "q0" ) ) {
                $(this).css({ "cursor" : "pointer" });

                $(this).bind( "mouseover", function() { $(this).find( ".removeItem" ).css({ "visibility" : "visible" }); });
                $(this).bind( "mouseout", function() { $(this).find( ".removeItem" ).css({ "visibility" : "hidden" }); });
            }
        });

        block.hide();
    }


    // Calculate equipment damage
    function calculateEquipmentDamage() {
        $( "#profileEquipment" ).parent().css({ "margin-left" : "11px", "height" : "220px" });

        // Get values
        var n = 1000;
        var hitList = [ 0, 50, 100, 155 ];
        var damageSplit = $( "#hitHelp" ).text().split( "/" );
        var minDamage = parseInt( damageSplit[0].replace( ",", "" ) );
        var maxDamage = parseInt( damageSplit[1].replace( ",", "" ) );
        var critical = parseFloat( $( "#criticalHelp" ).text().replace( "%", "" ) );
        var miss = parseFloat( $( "#missHelp" ).text().replace( "%", "" ) );
        var avoid = parseFloat( $( "#avoidHelp" ).text().replace( "%", "" ) );

        // Save all data to use it in the battle page
        setValue( "playerMinDamage", minDamage );
        setValue( "playerMaxDamage", maxDamage );
        setValue( "playerCritical", critical );
        setValue( "playerMiss", miss );
        setValue( "playerAvoid", avoid );

        // Default bonus settins, MU and location active
        var muBonus = 1;
        var locBonus = 1.2;
        var sdBonus = 1;
        var hBonus = 1;

        // Create block
        var block = $( "<div id='blockDamage' class='testDivwhite'></div>" );
        block.append( "<div class='titleDamage'>Average damage in "+ n +" simulations</div>" );
        block.insertBefore( $( "#profileEquipment" ).parent() );

        // Damage block
        var configDamage = $( "<div class='configDamage'></div>" );

        // MU bonus
        var MUCheck = $( "<input id='MUCheck' type='checkBox' class='itemBonus' title='No MU data' />" );
        configDamage.append( "<div class='labelLeftConfig'>MU</div>" );
        configDamage.append( MUCheck );
        // Stupid idea to disable MU tooltip
        if( getValue( "MURank" ) ) {
            muBonus = parseInt( getValue( "MURank" ) );

        } else configDamage.append( "<div style='width:15px; height:15px; position:absolute; margin:-22px 0px 0px 25px;'></div>" );

        // Location bonus
        var locationCheck = $( "<input id='locCheck' type='checkBox' class='itemBonus' checked='checked' />" );
        configDamage.append( "<div class='labelRightConfig'>LOCATION</div>" );
        configDamage.append( locationCheck );
        configDamage.append( "<br/>" );

        // SD bonus
        var sdCheck = $( "<select id='sdCheck' class='itemBonus customSelectList'></select>" );
        for( var i=0; i<=5; i++ ) {
            sdCheck.append( "<option value='"+ 5*i +"'>Q"+ i +"</option>" );
        }
        configDamage.append( "<div class='labelLeftConfig'>SD</div>" );
        configDamage.append( sdCheck );

        // Hospital bonus
        var hCheck= $( "<select id='hCheck' class='itemBonus customSelectList'></select>" );
        for( var i=0; i<=5; i++ ) {
            hCheck.append( "<option value='"+ 5*i +"'>Q"+ i +"</option>" );
        }
        configDamage.append( "<div class='labelRightConfig'>HOSPITAL</div>" );
        configDamage.append( hCheck );


        // Fill table
        var tableDamage = $( "<table class='tableDamage'></table>" );
        for( var i=0; i<=5; i++ ) {
            var tr = $( "<tr></tr>" );
            for( var j=0; j<hitList.length; j++ ) {
                if( hitList[j] == 0 ) {
                    if( i != 0 ) {
                        tr.append( "<td class='tableQuality'>Q"+ i +"</td>" );
                    } else tr.append( "<td></td>" );

                } else if( i == 0 ) {
                    if( hitList[j] != 0 ) {
                        var input = $( "<input class='hitList' type='text' value='"+ hitList[j] +"' maxlength='3' />" );
                        var td = $( "<td class='tableHits' title='You can edit this number!'></td>" );
                        td.tooltip({ tooltipClass: "tooltipHitDamage", position: { my: "center bottom", at: "center top" } });
                        td.append( input );
                        tr.append( td );
                    } else tr.append( "<td></td>" );

                } else tr.append( "<td class='dataDamage'>0</td>" );
            }
            tableDamage.append( tr );
        }

        block.append( tableDamage );
        block.append( configDamage );

        if( getValue( "MURank" ) ) {
            muBonus = 1 + (parseInt( getValue( "MURank" ) ) / 100);
            $( "#MUCheck" ).attr( "checked", "checked" );
        } else {
            $( "#MUCheck" ).prev().css({ "text-decoration" : "line-through" });
            $( "#MUCheck" ).attr( "disabled", "disabled" );
        }

        updateDamageTable( minDamage, maxDamage, muBonus, locBonus, sdBonus, hBonus, critical, miss, avoid, hitList, n );

        configDamage.find( ".itemBonus" ).bind( "change", function() {
            updateDamageTable( minDamage, maxDamage, muBonus, locBonus, sdBonus, hBonus, critical, miss, avoid, hitList, n );
        });
        configDamage.find( ".calculateBonus" ).bind( "click", function() {
            updateDamageTable( minDamage, maxDamage, muBonus, locBonus, sdBonus, hBonus, critical, miss, avoid, hitList, n );
        });
    }


    // Calculate iteration damage
    function calculateHitsDamage( min, max, mu, loc, sd, h, cr, miss, avoid, weapon, hits, n ) {
        hits = hits * h; // Hospital hits

        // We do it for Berserks
        var nBK = parseInt( hits / 5 );
        var mod = hits % 5;
        var averageDamage = 0;
        var bonus = 100 + (weapon * 20);
        var maxDamage = 0;
        var minDamage = Number.MAX_VALUE;
        for( var j=0; j<n; j++ ) {
            var totalDmg = 0;

            for( var i=0; i<nBK; i++ ) {
                var damage = (min + parseInt((max-min)/2))*5 * bonus/100;
                totalDmg += damage * mu * loc * sd;

                // Critical
                if( Math.random()*100 < cr ) { totalDmg += damage; }

                // Miss
                if( Math.random()*100 < miss ) { totalDmg -= damage; }

                // Avoid
                if( Math.random()*100 < avoid ) { i--; }
            }

            if( mod != 0 ) { totalDmg += (mod * totalDmg / (nBK*5)); }
            maxDamage = maxDamage > totalDmg ? maxDamage : totalDmg;
            minDamage = minDamage < totalDmg ? minDamage : totalDmg;
            averageDamage += totalDmg;
        }

        return( [ parseInt( averageDamage/n ), pointNumber( parseInt( minDamage ) ), pointNumber( parseInt( maxDamage ) ) ] );
    }


    // Update table data
    function updateDamageTable( minDamage, maxDamage, muBonus, locBonus, sdBonus, hBonus, critical, miss, avoid, hitList, n ) {
        locBonus = $( "#locCheck" ).attr( "checked" ) ? 1.2 : 1;
        sdBonus = 1 + parseInt( $( "#sdCheck" ).val() )/100;
        hBonus = 1 + parseInt( $( "#hCheck" ).val() )/100;
        if( $( "#MUCheck" ).attr( "checked" ) ) {
            if( getValue( "MURank" ) ) { muBonus = 1 + (parseInt( getValue( "MURank" ) ) / 100); }
        } else muBonus = 1;

        var table = $( ".tableDamage" );
        for( var i=1; i<=5; i++ ) {
            var tr = table.find( "tr" ).eq(i);
            for( var j=1; j<hitList.length; j++ ) {
                var hits = parseInt( table.find( ".hitList" ).eq(j-1).val() );
                var dmg = calculateHitsDamage( minDamage, maxDamage, muBonus, locBonus, sdBonus, hBonus, critical, miss, avoid, i, hits, n );
                tr.children( "td" ).eq( j ).text( pointNumber( dmg[0] ) );
                tr.children( "td" ).eq( j ).tooltip({ tooltipClass: "tooltipHitDamage", position: { my: "center bottom", at: "center top" } });
                tr.children( "td" ).eq( j ).attr( "title", "<b>"+ dmg[1] +" - "+ dmg[2] +"</b>" );
            }
        }
    }


    // Add update salaries in the company menú
    function addCompanyButtons() {

        // Get the country ID
        var countryId = IDByImageCountry( $( "a[href^='region.html']" ).prev().attr('class').split(' ')[1]);
        var workerList = $( ".workerListDiv" );
        var offerList = $( ".offerListDiv" );

        var updateSalaries = $( "<input class='updateSalariesButton' type='button' value='Update salaries'/>" );
        updateSalaries.insertBefore( workerList.children().first() );
        updateSalaries.bind( "click", function() {

            // Clean previous results
            workerList.find( ".redText" ).remove();
            workerList.find( ".greenText" ).remove();

            var i=0;
            var checkedSkills = [];
            workerList.find( ".tableRow" ).each( function() {

                // First get the skill number
                var tdList = $(this).find( "td" );
                var skill = parseInt( tdList.eq(1).text() );
                if( checkedSkills.indexOf( skill ) == -1 ) {
                    checkedSkills.push( skill );

                    setTimeout( function() {
                        $.ajax({
                            url: getCurrentServer() + URLJobMarket + "?countryId="+ countryId +"&minimalSkill="+ skill,
                            success: function( data ) {

                                var trList = $( data ).find( ".dataTable" ).find( "tr" );
                                // We take the first row
                                var salary = trList.eq(1).find( "td" ).eq(4).children( "b" ).text();
                                salary = parseFloat( salary );

                                workerList.find( ".workerSkill" + skill ).each( function() {
                                    var classColor;
                                    var percent;
                                    var workerSalary = parseFloat( $(this).children( ".salary" ).children( "b" ).text() );
                                    if( workerSalary < salary ) {
                                        classColor = "redText";
                                        percent = "-" + parseInt((salary / workerSalary -1) * 10000) / 100;

                                    } else {
                                        classColor = "greenText";
                                        percent = "+" + parseInt((workerSalary / salary - 1) * 10000) / 100;
                                    }
                                    $(this).append( "<b class='"+ classColor +"'>"+ salary +" ("+ percent +"%)</b>" );
                                });
                            }
                        });
                    }, 500*i );
                    i++;
                }
            });
        });

        var updateJobs = $( "<input class='updateJobsButton' type='button' value='Update jobs'/>" );
        updateJobs.insertBefore( workerList.children().first() );
        updateJobs.bind( "click", function() {

            var id = getUrlVars()[ "id" ];
            $.ajax({
                url: getCurrentServer() + URLCompanyDetails + id,
                success: function( data ) {
                    $( data ).find( "#productivityTable" ).find( "tr" ).each( function() {
                        var td = $(this).children( "td" ).last();
                        var player = $(this).find( "a" );
                        if( player ) {
                            var place = workerList.find( "a[href='"+ player.attr( "href" ) +"']" ).parent();
                            if( td.children( "div" ).length == 2 ) {
                                place.append( "<br/>" );
                                place.append( "<b>"+ td.children().eq(1).text().replace( "(", "" ).replace( ")", "" ) +"</b>" );
                                place.addClass( "greenBackgroundCompany" );

                            } else place.addClass( "redBackgroundCompany" );
                        }
                    });
                }
            });
        });
    }


    // Improve company interface
    function companyImprovements() {
        if( $( "#minimalSkill option" ).length == 14 ) {
            $( "#minimalSkill" ).append( "<option value='15'>15</option>" );
            $( "#minimalSkill" ).append( "<option value='16'>16</option>" );
        }

        var listBlue = $( "#container" ).find( ".testDivblue" );
        var mainMenu = listBlue.eq(2).find( "table" ).eq(1);
        var rowRemove = mainMenu.find( "tr" ).first().children( "td" ).first();
        rowRemove.next().children().css({ "max-width" : "100%" });
        rowRemove.remove();

        // Get the country ID
        var countryId = IDByImageCountry( $( "a[href^='region.html']" ).prev().attr('class').split(' ')[1] );

        // Rellocate some items
        if( listBlue.length == 6 ) {

            var workerList = listBlue.eq(5);
            var offerList = listBlue.eq(4);
            var uglyBox = listBlue.eq(3);
            var createJob = uglyBox.children().first();
            uglyBox.children().first().remove();

            createJob.insertBefore( uglyBox );
            $( "<br/>" ).insertBefore( uglyBox );
            var divBlock = $( "<div style='display:inline-block; width:100%'></div>" )
            divBlock.insertBefore( uglyBox );
            divBlock.append( offerList );
            divBlock.append( workerList );
            uglyBox.css({ "margin-top" : "15px" });

            createJob.removeClass( "testDivwhite" );
            createJob.addClass( "testDivblue" ).css({ "width" : "680px" });
            createJob.children( "p" ).remove();

            var selectedSkill = null;
            $( "#minimalSkill option" ).each( function() {

                var skill = $( "<div class='skillSelector'>"+ $(this).val() +"</div>" );
                skill.insertBefore( "#minimalSkill" );

                skill.bind( "click", function() {
                    if( selectedSkill ) { selectedSkill.removeClass( "skillSelectorSelected" ); }

                    selectedSkill = $(this);
                    selectedSkill.addClass( "skillSelectorSelected" );
                    $( "#minimalSkill" ).val( selectedSkill.text() );

                    var link = getCurrentServer() + URLJobMarket + "?countryId="+ countryId +"&minimalSkill="+ $(this).text();
                    $( ".companyLinkOffers" ).attr( "href", link );
                });
            });
            $( "#minimalSkill" ).hide();

            var firstLine = $( "#minimalSkill" ).parent();
            firstLine.attr( "colspan", "4" );
            createJob.find( "table" ).css({ "width" : "100%" });

            var tr = $( "<tr></tr>" );
            tr.append( firstLine.next().css({ "width" : "33%" }) );
            var td = $( "<td style='width:18%;'></td>" );
            var link = $( "<a class='companyLinkOffers' href='' target='_blank'>View skill offers</a>" );
            tr.append( td.append( link ) );
            tr.append( firstLine.next().css({ "width" : "17%" }) );
            tr.append( firstLine.next().css({ "width" : "26%" }) );
            firstLine.parent().parent().append( tr );

            $( ".skillSelector" ).first().click();
            $( "#price" ).addClass( "priceInputCompany" );
            $( "#price" ).bind( "focus", function() { $(this).select(); });
            $( "#quantity" ).addClass( "quantityMyOffers" );
            $( "#quantity" ).bind( "focus", function() { $(this).select(); });

        } else {
            var workerList = listBlue.eq(4);
            var offerList = listBlue.eq(3);
        }

        workerList.addClass( "workerListDiv" );
        offerList.addClass( "offerListDiv" );

        // Remove useless space
        mainMenu.children( "p" ).remove();

        // Edit image size
        mainMenu.find( ".productLabelRight" ).css({ "height" : "auto", "width" : "40px" });
        //resizeProductImage( mainMenu.find( ".product" ) );

        // Add extra links to check salaries
        workerList.find( ".tableRow" ).each( function() {
            var tdList = $(this).find( "td" );
            // First get the skill number
            var skill = parseInt( tdList.eq(1).text() );
            var viewLink = $( "<a href='"+ getCurrentServer() + URLJobMarket + "?countryId="+ countryId +"&minimalSkill="+ skill +"'>View</a>" );
            tdList.eq(1).append( "<br/>" );
            tdList.eq(1).append( viewLink );
            tdList.eq(2).addClass( "workerSkill" + skill );
        });

        $( "input[name=newSalary]" ).addClass( "priceInputCompany" );
        $( "input[name=newSalary]" ).bind( "focus", function() { $(this).select(); });
        $( "input[name=salary]" ).addClass( "priceInputCompany" );
        $( "input[name=salary]" ).bind( "focus", function() { $(this).select(); });
    }


    // Improve company work results
    function companyWorkResults() {

        // Redesign first block
        var listBlue = $( "#container" ).find( ".testDivwhite " );
        var mainMenu = listBlue.find( "table" );
        mainMenu.find( ".productLabelRight" ).css({ "height" : "auto", "width" : "40px" });
        resizeProductImage( mainMenu.find( ".product" ) );

        // Add button to get salary
        var divConfig = $( "<div class='testDivblue' style='width:500px;'></div>" );
        var buttonUpdate = $( "<input class='companyGetSalary' type='button' value='Calculate'/>" );
        divConfig.append( buttonUpdate );
        divConfig.insertAfter( listBlue.prev() );

        var mainBlock = $( "#container" ).find( ".testDivwhite" );
        var idCompany = getUrlVars()[ "id" ];
        buttonUpdate.bind( "click", function() {

            // Remove previous col
            $( "td.playerSalary" ).remove();

            // Add new col
            var index = 0;
            mainBlock.find( "tr" ).each( function() {
                var td = $( "<td class='playerSalary'></td>" );
                if( index == 0 ) { td.append( "Salary" ); }
                $(this).append( td );
                index++;
            });

            mainBlock.css({ "width" : "785px" });
            mainBlock.find( "table" ).css({ "width" : "100%" });

            $.ajax({
                url: getCurrentServer() + URLCompany + idCompany,
                success: function( data ) {
                    var blue = $(data).find( ".testDivblue" );
                    //alert(blue.length)
                    if( blue.length == 6 ) {
                        var playerList = blue.eq(5).find( ".tableRow" );
                    } else var playerList = blue.eq(4).find( ".tableRow" );
                    checkPlayersSalary( playerList, mainBlock );
                }
            });
        });
    }


    // Check player salary
    function checkPlayersSalary( playerList, block ) {

        playerList.each( function() {



            var player = $(this).find( "a[href^='profile.html']" );
            var content = $(this).find( ".salary" );
            content.removeClass( "salary" );
            if( content.children().length == 3 ) { content.children().last().remove(); }

            block.find( "tr" ).each( function() {

                if( $(this).find( "a[href='"+ player.attr( "href" ) +"']" ).length == 1 ) {
                    $(this).find( ".playerSalary" ).append( content );
                    $( "<br/>" ).insertBefore( content.children( "b" ) );
                    var currency = content.contents().eq(5).text();

                    var salary = parseFloat( content.children( "b" ).text() );
                    $(this).find( "td" ).each( function() {
                        if( $(this).children().length == 2 ) {
                            $(this).children().eq(1).css({ "color" : "#009900" });

                            var numItems = $(this).children( "div" ).eq(1).text();
                            numItems = numItems.replace( "(", "" ).replace( ")", "" );
                            numItems = parseFloat( numItems );

                            var finalPrice = $( "<div class='finalPrice'>"+ (parseInt( (salary / numItems)*1000 ) / 1000) +"</div>" );
                            finalPrice.append( "<br/>" );
                            finalPrice.append( "<span> "+ currency +"</span>" );
                            $(this).append( finalPrice );
                        }
                    });
                }
            });
        });

        trNumber=block.find( "tr" ).length

        //alert(trNumber)

        if($('#sum_1').length == 0){

            $('#productivityTable > tbody:last').append('<tr><td colspan="2"><b>Sum:</b></td><td id="sum_1"></td><td id="sum_2"></td><td id="sum_3"></td><td id="sum_4"></td><td id="sum_5"></td><td id="sum_6"></td><td id="sum_7"></td><td id="sum_8"></td><td id="sum_9"></td><td id="sum_10"></td><td id="sum_11"></td></tr>');

            $('#productivityTable > tbody:last').append('<tr><td colspan="2"><b>Avarage:</b></td><td id="avg_1"></td><td id="avg_2"></td><td id="avg_3"></td><td id="avg_4"></td><td id="avg_5"></td><td id="avg_6"></td><td id="avg_7"></td><td id="avg_8"></td><td id="avg_9"></td><td id="avg_10"></td><td id="avg_11"></td></tr>');

        }else{

            $('#productivityTable > tbody tr:last td:last').remove()
            $('#productivityTable > tbody tr:eq(-2) td:last').remove()

        }

        for(i=3;i<13;i++)
        {



            col=$('#productivityTable tr>td:nth-child('+i+')').text()
            col=col.replace(/\t/g, '');
            Productivity=col.match(/[\n\r]\d{3}\.\d{0,2}/g);
            Product=col.match(/\(\d{0,10}\.\d{0,2}\)/g);

            price_one=col.match(/\d{1,5}\.\d{0,3} .../g);

            //alert(Productivity)

            if(Productivity != null)
            {
                Productivity= Productivity.join().match(/\d{0,10}\.\d{0,2}/g);

                //alert(Productivity)

                Sum_productivity=0;

                for(var x = 0; x < Productivity.length; x++)
                {
                    Sum_productivity = Sum_productivity + Number(Productivity[x]); //or Sum += scores[x];
                }

                average_productivity = Sum_productivity / Productivity.length;

            }else{

                Sum_productivity=0
                average_productivity=0;

            }


            if(Product != null)
            {
                Product= Product.join().match(/\d{0,10}\.\d{0,2}/g);

                Sum_product=0;

                for(var x = 0; x < Product.length; x++)
                {
                    Sum_product = Sum_product + Number(Product[x]); //or Sum += scores[x];
                }

                average_product = Sum_product / Product.length;

                //alert(average_product)

            }else{

                Sum_product=0
                average_product=0;

            }


            if(price_one != null)
            {

                price_one= price_one.join().match(/\d{1,5}\.\d{0,3}/g);

                Sum_price_one=0;

                for(var x = 0; x < price_one.length; x++)
                {
                    Sum_price_one = Sum_price_one + Number(price_one[x]); //or Sum += scores[x];
                }

                average_price_one = Sum_price_one / price_one.length;


            }else{

                Sum_price_one=0
                average_price_one=0;

            }


            $('#sum_'+(i-2)).html("<div>"+Sum_productivity.toFixed(2)+"</div><div style='color: rgb(0, 153, 0);font-weight:normal;'>"+Sum_product.toFixed(2)+"</div>")

            $('#avg_'+(i-2)).html("<div>"+average_productivity.toFixed(2)+"</div><div style='color: rgb(0, 153, 0);'>"+average_product.toFixed(2)+"</div><div class='finalPrice'>"+average_price_one.toFixed(4)+"</div>")




        }

        col_sal=$('#productivityTable tr>td:nth-child(13)').text();
        sal=col_sal.match(/\d{1,3}\.\d{0,2}/g)

        Sum_sal=0;

        for(var x = 0; x < sal.length; x++)
        {
            Sum_sal = Sum_sal + Number(sal[x]); //or Sum += scores[x];
        }

        average_sal = Sum_sal / sal.length;

        $('#avg_11').html("<div style='color: rgb(0, 153, 0);'>"+average_sal.toFixed(2)+"</div>")
        $('#sum_11').html("<div style='color: rgb(0, 153, 0);'>"+Sum_sal.toFixed(2)+"</div>")



        //


    }

    //Alert pre
    function A_pre()
    {

        //save
        mail = '<li class="menuNotifications" id="numero2"><a class="blank-icon" href="#" id="inboxMessagesMission"><i class="icon-email2"></i><b>'+$("#numero2").text().trim()+'</b></a> </li>'
        alert = '<li class="menuNotifications" id="numero1"><a class="blank-icon" href="#"><i class="icon-alert"></i><b>'+$("#numero1").text().trim()+'</b></a> </li>'
        sub = '<li id="sub_li" class="menuNotifications"><a class="blank-icon" href="#"><i class="icon-rss"></i><b>'+$("#numero1").next().text().trim()+'</b></a></li>'

        //remove
        $("#numero2").remove()
        $("#numero1").remove()
        $(".menuNotifications").remove()

        //divs
        div_mail='<div id="pre_mail" class="f-dropdown content medium canvaback foundation-text-center foundation-base-font open" style="display:none;position: absolute; top: 46px; ;float:left ;" data-dropdown-content="">TEST MAIL</div>'

        div_alert='<div id="pre_alert" class="f-dropdown content medium canvaback foundation-text-center foundation-base-font open" style="display:none;position: absolute; top: 46px;;float:left;" data-dropdown-content="">TEST ALERT</div>'

        div_sub='<div id="pre_sub" class="f-dropdown content medium canvaback foundation-text-center foundation-base-font open" style="display:none;position: absolute; top: 46px;float:left ;" data-dropdown-content="">TEST SUB</div>'


        $("#contentDrop").parent().append(mail+alert+sub+div_mail+div_alert+div_sub)

        $("#numero2").click(function()
                            {
            $("#pre_mail").show();
            $("#pre_mail").css("left",window.innerWidth-(50*3+25));
            $("#pre_alert").hide();
            $("#pre_sub").hide();


        })

        $("#numero1").click(function()
                            {
            $("#pre_mail").hide();
            $("#pre_alert").show();
            $("#pre_alert").css("left",window.innerWidth-125);
            $("#pre_sub").hide();


        })

        $("#sub_li").click(function()
                           {
            $("#pre_mail").hide();
            $("#pre_alert").hide();
            $("#pre_sub").show();
            $("#pre_sub").css("left",window.innerWidth-75);


        })



    }


    // Improve battle list interface
    function changeBattleList() {


        var url = "https://cdn.e-sim.org/js/jquery.countdown.min.js";
        var script2 = document.createElement("script");
        script2.setAttribute("src", url);
        document.getElementsByTagName("head")[0].appendChild(script2);


        $( "#countryId" ).addClass( "customSelectList" );
        //$( "#sorting" ).prev().remove();
        //$( "#sorting" ).prev().remove();

        var selectedOption = null;
        $( "#sorting option" ).each( function() {

            var sort = $( "<div class='sortTypeSelector'>"+ $(this).text().replace( "Sorting ", "" ) +"</div>" );
            sort.attr( "type", $(this).val() );
            sort.insertBefore( "#sorting" );

            sort.bind( "click", function() {
                if( selectedOption ) { selectedOption.removeClass( "sortTypeSelectorSelected" ); }

                selectedOption = $(this);
                selectedOption.addClass( "sortTypeSelectorSelected" );
                $( "#sorting" ).val( selectedOption.attr( "type" ) );
            });

            if( $(this).val() == $( "#sorting" ).val() ) { sort.click(); }
        });

        $( "#sorting" ).hide();
        $( "#battlesViewForm" ).parent().children().last().remove();
        var updateTime = $( "<input class='updateTimeListBattle' type='button' value='Update Battle List'/>" );
        updateTime.insertAfter( $( "#battlesViewForm" ).parent() );
        updateTime.bind( "click", function() {

            var i=0;
            var y=0;
            $( "#battlesTable" ).find( "tr" ).each( function() {
                var related = $(this);
                var href = $(this).find( "a[href^='battle.html?id=']" );
                if( href.length == 1 ) {
                    setTimeout( function() {
                        $.ajax({
                            url: href.attr( "href" ),
                            success: function( data ) {

                                // Battle Time
                                related.find( ".roundTimeRemain" ).remove();

                                var timeremain = "";

                                regexp =/liftoffTime\.setHours\(liftoffTime.getHours\(\) \+ (\d{1,2})\)/g

                                var hour = regexp.exec(data)
                                var hour = hour[1]


                                regexp =/liftoffTime\.setMinutes\(liftoffTime.getMinutes\(\) \+ (\d{1,2})\)/g

                                var min = regexp.exec(data)
                                var min = min[1]

                                regexp =/liftoffTime\.setSeconds\(liftoffTime.getSeconds\(\) \+ (\d{1,2})\)/g
                                var sec = regexp.exec(data)
                                var sec = sec[1]


                                hour = "0" + hour;
                                min = (min < 10) ? "0"+min : min;
                                sec = (sec < 10) ? "0"+sec : sec;

                                var lastTD = related.children().last();
                                lastTD.removeClass( "roundClean" );
                                lastTD.removeClass( "roundLastHour" );
                                lastTD.removeClass( "roundLastHalfHour" );
                                if( hour == 0 ) {
                                    if( min < 30 ) {
                                        lastTD.addClass( "roundLastHalfHour" );

                                    } else lastTD.addClass( "roundLastHour" );

                                } else lastTD.addClass( "roundClean" );

                                //hour = "0" + hour;
                                //min = (min < 10) ? "0"+min : min;
                                //sec = (sec < 10) ? "0"+sec : sec;
                                related.children().last().append( "<div class='roundTimeRemain'>"+ hour +":"+ min +":"+ sec +"</div>" );

                                //Mini Info

                                firstTD = related.children().first();

                                subsidy = firstTD.find(".battleDiv").find("div").last().html();

                                info = $(data).find("#roundCountdown").parent().parent().parent().html();

                                topDef1 = $(data).find("#topDefender1").html();
                                topDef2 = $(data).find("#topDefender2").html();
                                topDef3 = $(data).find("#topDefender3").html();

                                topAtt1 = $(data).find("#topAttacker1").html();
                                topAtt2 = $(data).find("#topAttacker2").html();
                                topAtt3 = $(data).find("#topAttacker3").html();

                                firstTD.html(info+subsidy)

                                firstTD.find("#fb-root").parent().prev().html(topDef1+topDef2+topDef3);
                                firstTD.find("#fb-root").parent().next().html(topAtt1+topAtt2+topAtt3);
                                firstTD.find("#fb-root").parent().remove();

                                firstTD.find(".attackerHit").parent().attr("class","foundation-style column-margin-vertical column small-5")
                                firstTD.find(".attackerHit").attr("style","float: left; width: 75px; margin-right: 5px")

                                firstTD.find(".defenderHit").parent().attr("class","foundation-style column-margin-vertical column small-5")
                                firstTD.find(".defenderHit").attr("style","float: right; width: 75px; margin-right: 5px")


                                firstTD.find("#defenderScore").parent().parent().attr("class","foundation-style column-margin-vertical column small-5 foundation-text-center")
                                firstTD.find("#attackerScore").parent().parent().attr("class","foundation-style column-margin-vertical column small-5 foundation-text-center")

                                firstTD.find("a[href*='region.html?id=']").attr("href",href.attr( "href" ))

                                firstTD.find('#roundCountdown').attr("id","roundCountdown"+y)
                                firstTD.find('#roundCountdown'+y).attr("class","roundCountdown")
                                firstTD.find('#roundCountdown'+y).html(hour +":"+ min +":"+ sec)

                                y++

                            }
                        });



                    }, 500*i );

                    i++;
                }
            });




        });
    }

    //GET URL PARAMETER
    function getURLParameter(url, name) {
        return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
    }






    // getValue as GM_getValue of GM functions
    function getValue( name ) {
        name = getPlayerID() + getCurrentServer() + name;
        var value = (cachedSettings === null ? localStorage.getItem(name) : cachedSettings[name]);
        if( !value || (value === undefined) ) { return( null ); }
        return( value );
    }


    // setValue as GM_setValue of GM functions
    function setValue( name, value ) {
        name = getPlayerID() + getCurrentServer() + name;
        if (cachedSettings === null) {
            localStorage.setItem( name, value );
        } else {
            cachedSettings[name] = value;
            chrome.extension.sendRequest( { name: name, value: value } );
        }
    }



    // Get URL Vars
    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function( m, key, value ) { vars[key] = value; });
        return vars;
    }
};

function createResourceVar( name ) {
    var input = document.createElement( "input" );
    input.type = "hidden";
    input.id = name;
    input.value = GM_getResourceURL( name );
    document.body.appendChild( input );
}

// Only execute on same frame (iframes with advertisments)
if( window.top == window.self ) {

    // Inject our CSS
    GM_addStyle( GM_getResourceText( "myCustomCSS" ) );

    // Resources
    createResourceVar( "myQualityStar" );

    var URLBattle = "/battle.html?id=";
    var localUrl = new String( window.location );






    // Inject our main script
    var script = document.createElement( "script" );
    script.type = "text/javascript";
    script.textContent = '(' + main.toString() + ')();';
    document.body.appendChild( script );
}

var main = function parseRequest(response) {
    console.log(response);

    //prompt('a',response)

    json_obj = jQuery.parseJSON(response);

    //alert(json_obj.array[0].name)

    $("#extendedDays").after("<input style='align:center' type='button' value='Show DMG' id='Show_DMG'>")

    $("#Show_DMG").click(function(){$(".yestrdaydmg").toggle();});


    $(".namePlayer").each(function(){


        id=$(this).find('a').attr('href').match(/\d.*/)[0]
        console.log($(this).find('a').attr('href').match(/\d.*/)[0]);


        for(i=json_obj.array.length-1;i>=0;i--)
        {

            if(json_obj.array[i].id==id)
                $(this).append("<br/><span class='yestrdaydmg'> DMG: "+formatNumber( json_obj.array[i].damage)+"</span>")

                }

    })


    //Hide this



    function formatNumber(number)
    {
        number = number.toFixed(2) + '';
        x = number.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 ;
    }




}


$(document).ready(function() {

    //script hozz? ad?s
    var script = document.createElement( "script" );
    script.type = "text/javascript";
    script.textContent =  main.toString() ;
    document.body.appendChild( script );

});