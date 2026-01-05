/* global $: true */
/* global waitForKeyElements: true */
/* global GM_xmlhttpRequest: true */
/* global unsafeWindow: true */
// jshint newcap:false
// jshint multistr:true

// ==UserScript==
// @name        Geocaching.com
// @namespace   GeocachingWebsiteScript
// @description Adds links and data to Geocaching.com to make it more user friendly
// @include     http://www.geocaching.com/*
// @include     https://www.geocaching.com/*
// @version     1.0.5
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @connect     maps.googleapis.com
// @grant       GM_xmlhttpRequest
// @license     The MIT License (MIT)
// @downloadURL https://update.greasyfork.org/scripts/18020/Geocachingcom.user.js
// @updateURL https://update.greasyfork.org/scripts/18020/Geocachingcom.meta.js
// ==/UserScript==


(function() {

    'use strict';

    var pgcUrl = 'http://project-gc.com/',
        pgcApiUrl = pgcUrl + 'api/gm/v1/',
        externalLinkIcon = 'http://maxcdn.project-gc.com/images/external_small.png',
        galleryLinkIcon = 'http://maxcdn.project-gc.com/images/pictures_16.png',
        mapLinkIcon = 'http://maxcdn.project-gc.com/images/map_app_16.png',
        latestLogs = [],
        latestLogsAlert = false,
        path = window.location.pathname;

    // Don't run the script for iframes
    if (window.top == window.self) {
        MainFunction();
    }

    function MainFunction() {
        RemoveAdsFromPage();
        Router();
    }

    function RemoveAdsFromPage() {
        $('.DownTime').remove();
        $('#ctl00_uxBanManWidget').remove();
        $('#ctl00_ContentBody_uxBanManWidget').remove();
        $('.sidebar-ad').remove();
    }

    function Router() {
        if (path.match(/^\/geocache\/.*/) !== null) {
            Page_CachePage();
        } else if (path.match(/^\/seek\/cache_details\.aspx.*/) !== null) {
            Page_CachePage();
        } else if (path.match(/^\/seek\/cache_logbook\.aspx.*/) !== null) {
            Page_Logbook();
        } else if (path.match(/^\/seek\/log\.aspx.*/) !== null) {
            Page_NewLog();
        } else if (path.match(/^\/track\/log\.aspx.*/) !== null) {
            Page_NewTrackableLog();
        }
    }

    function getGcCodeFromPage() {
        return $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').html();
    }

    function getGccomUsername(){
        var gccomUsername = null;
        if ($('#ctl00_uxLoginStatus_divSignedIn ul.logged-in-user').length) {
            gccomUsername = $('#ctl00_uxLoginStatus_divSignedIn ul.logged-in-user .li-user-info span').html();
        } else if ($('ul.profile-panel-menu').length) {
            gccomUsername = $('ul.profile-panel-menu .li-user-info span:nth-child(2)').text();
        } else if ($('#uxLoginStatus_divSignedIn ul.logged-in-user li.li-user span.li-user-info span').first().text().length) {
            gccomUsername = $('#uxLoginStatus_divSignedIn ul.logged-in-user li.li-user span.li-user-info span').first().text();
        }
        return gccomUsername;
    }

    function MetersToFeet(meters) {
        return Math.round(meters * 3.28084);
    }

    function FormatDistance(distance) {
        distance = parseInt(distance, 10);
        distance = distance.toLocaleString();
        return distance;
    }

    function getCoordinates() {
        return $('#ctl00_ContentBody_MapLinks_MapLinks li a').attr('href');
    }

    function getLatitude(coordinates) {
        return coordinates.replace(/.*lat=([^&]*)&lng=.*/, "$1");
    }

    function getLongitude(coordinates) {
        return coordinates.replace(/.*&lng=(.*)$/, "$1");
    }

    function getGeocachingMapURL(latitude, longitude) {
        return 'https://www.geocaching.com/map/default.aspx?lat='+latitude+'&lng='+longitude+'&z=16';
    }

    function getGoogleMapURL(latitude, longitude) {
        return 'http://maps.google.com/maps?q='+latitude+','+longitude;
    }

    function getGoogleMapStreetViewURL(latitude, longitude) {
        return getGoogleMapURL(latitude,longitude) + "&layer=c&cbll=" + latitude + ',' + longitude + '&cbp=11,0,0,0,0';
    }

    function getBingBirdsEyeViewURL(latitude, longitude) {
        return "http://bing.com/maps/default.aspx?cp="+latitude+"~"+longitude+"&style=o&lvl=20";
    }

    function addOtherInfoDiv(username,latitude,longitude) {
        var ownerName = $('#ctl00_ContentBody_mcd1 a').html();
        var ownerProfile = $('#ctl00_ContentBody_mcd1 a').attr('href');
        var ownerProfileGCLink = '<a href="' + pgcUrl + 'ProfileStats/' + encodeURIComponent(ownerName) + '" target="_blank"><img src="' + externalLinkIcon + '" title="PGC Profile Stats"></a>';

        var result = "<div id='otherInfo'>";

        result += 'Ver a cache no <a href=' + getGeocachingMapURL(latitude,longitude) + " target='_blank'>Mapa Geocaching</a>";
        result += ', no <a href=' + getGoogleMapURL(latitude,longitude) + " target='_blank'>Google Maps</a>";
        result += ', no <a href=' + getGoogleMapStreetViewURL(latitude,longitude) + " target='_blank'>Street View</a>";
        result += ', no <a href=' + getBingBirdsEyeViewURL(latitude,longitude) + " target='_blank'>Bird's eye View</a>";

        var urlOwnerCaches = "<a href='https://www.geocaching.com/play/search?origin=Portugal&ot=2&g=159&types=2,3,8,137,5,11,1858,4,9,3773&owner[0]="+ownerName+"&sort=PlaceDate&asc=False' target='_blank'>todas as geocaches</a>";
        result += "<br>Pesquisar <a href='" + ownerProfile + "' target='_blank'>"+ ownerName + "</a> " + ownerProfileGCLink + urlOwnerCaches;

        var urlOwnerActiveCaches = "<a href='https://www.geocaching.com/play/search?origin=Portugal&ot=2&g=159&types=2,3,8,137,5,11,1858,4,9,3773&owner[0]="+ownerName+"&e=1&sort=PlaceDate&asc=False' target='_blank'>apenas as activas</a>";
        result += ', ' + urlOwnerActiveCaches;

        var urlOwnerNotFoundByMe = "<a href='https://www.geocaching.com/play/search?nfb[0]="+username+"&owner[0]="+ownerName+"&f=2' target='_blank'>as que ainda não encontrei</a>";
        result += ', ' + urlOwnerNotFoundByMe + "<br><br>";


        var logUrl = $('#ctl00_ContentBody_GeoNav_logButton').attr('href');
        var logText = $('#ctl00_ContentBody_GeoNav_logText').html();
        var found = false;
        var mainPage = $('#divContentMain').html();
        var cacheDisabledText = "Esta geocache está temporariamente indisponível. Leia os registos mais recentes";
        var cacheArchivedText = "Esta Geocache está arquivada, mas está disponível para visualização por motivos de arquivo";
        if (document.title.includes('Event')){
            if (typeof logText !== 'undefined') {
                found = logText.includes('Participei');
            }
            if(!found){
                result += "<a href='"+logUrl+"&logType=10' class='btn btn-primary' style='display: inline; margin-right:10px; border-radius:5px;'>Participei</a>";
                result += "<a href='"+logUrl+"&logType=9' class='btn' style='display: inline; margin-right:10px; border-radius:10px; color:green;'>Irei participar</a>";
            }
            result += "<a href='"+logUrl+"&logType=4' class='btn' style='display: inline; margin-right:10px; border-radius:10px; color:grey;'>Escrever nota</a>";
        } else {
            if (typeof logText !== 'undefined') {
                found = logText.includes('Encontrada');
                if (logText.includes('Não Encontrada')){
                    found = false;
                }
            }
            if(!found){
                result += "<a href='"+logUrl+"&logType=2' class='btn btn-primary' style='display: inline; margin-right:10px; border-radius:5px;'>Encontrada</a>";
                result += "<a href='"+logUrl+"&logType=3' class='btn' style='display: inline; margin-right:10px; border-radius:10px; color:#2A93D3;'>Não encontrada</a>";
            }
            result += "<a href='"+logUrl+"&logType=4' class='btn' style='display: inline; margin-right:10px; border-radius:10px; color:grey;'>Escrever nota</a>";
            if(!mainPage.includes(cacheDisabledText)){
                if(!mainPage.includes(cacheArchivedText)){
                    result += "<a href='"+logUrl+"&logType=45' class='btn' style='display: inline; margin-right:10px; border-radius:10px; color:brown;'>Manutenção</a>";
                }
            }

            if(!mainPage.includes(cacheArchivedText)){
                result += "<a href='"+logUrl+"&logType=7' class='btn' style='display: inline; margin-right:10px; border-radius:10px; color:#667343;'>Arquivar</a>";
            }
        }

        $('#ctl00_ContentBody_CacheInformationTable').append(result + "</div>");
    }

    function correctComboValues(){
        var xpto = $('#ctl00_ContentBody_LogBookPanel1_ddLogType').html();
        xpto = xpto.replace("Found it", "Encontrada");
        xpto = xpto.replace("Didn't find it", "Não encontrada");
        xpto = xpto.replace("Write note", "Escrever uma nota");
        xpto = xpto.replace("Will Attend", "Irei participar");
        xpto = xpto.replace("Attended", "Participei");
        xpto = xpto.replace("Needs Archived", "Pedido de arquivamento");
        xpto = xpto.replace("Needs Maintenance", "Pedido de manutenção");
        xpto = xpto.replace("Archive", "Arquivar");
        xpto = xpto.replace("Temporarily Disable Listing", "Desativar");
        xpto = xpto.replace("Update Coordinates", "Atualizar coordenadas");
        xpto = xpto.replace("Owner Maintenance", "Manutenção efetuada");
        xpto = xpto.replace("Discovered It", "Descobrir trackable");
        xpto = xpto.replace("Grab it from current holder", "Apanhar trackable de");
        xpto = xpto.replace("Grab it from somewhere else", "Apanhar trackable de outro lugar");
        xpto = xpto.replace("Retrieve from", "Apanhar trackable da cache:");
        $('#ctl00_ContentBody_LogBookPanel1_ddLogType').html(xpto);
    }

    function tidyTheWeb(){
        //$('#lnkMessageOwner').html('');
        $('#ctl00_divContentMain p.Clear').css('margin', '0');
        $('div.Note.PersonalCacheNote').css('margin', '0');
        //$('h3.CacheDescriptionHeader').remove();
        $('#ctl00_ContentBody_EncryptionKey').remove();
        $('#div_hint').css('margin-bottom', '25px');
        $('.CacheInformationTable .LocationData').css('border-bottom', '0');
    }

    // Make it easier to copy the gccode
    function makeCopyFriendly(){
        var gcCode = getGcCodeFromPage();
        $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoLinkPanel').
        html('<div style="margin-right: 15px; margin-bottom: 10px;"><p id="ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode" style="font-size: 125%; margin-bottom: 0">' + gcCode + '</p>' +
             '<input size="25" type="text" value="http://coord.info/' + encodeURIComponent(gcCode) + '" onclick="this.setSelectionRange(0, this.value.length);"></div>');
        $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoLinkPanel').css('font-weight', 'inherit').css('margin-right', '39px');
        $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoLinkPanel div').css('margin', '0 0 5px 0');
        $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoLinkPanel div p').css('font-weight', 'bold');
    }

    function removeUTMCoordinates(){
        $('#ctl00_ContentBody_LocationSubPanel').html('');

        // And move the "N 248.3 km from your home location"
        //$('#ctl00_ContentBody_LocationSubPanel').after($('#lblDistFromHome'));
    }

    function resolveCoordinatesIntoAnAddress(latitude, longitude){
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=false';

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                var result = JSON.parse(response.responseText);
                if (result.status !== 'OK') {
                    return false;
                }
                var formattedAddress = result.results[0].formatted_address;
                $('#ctl00_ContentBody_LocationSubPanel').append(formattedAddress + '<br />');
            }
        });

    }

    function Page_CachePage() {
        var username = getGccomUsername();
        var coordinates = getCoordinates();
        var latitude = getLatitude(coordinates);
        var longitude = getLongitude(coordinates);

        // Since everything in the logbook is ajax, we need to wait for the elements
        waitForKeyElements('#cache_logs_table tr', Logbook);

        tidyTheWeb();
        makeCopyFriendly();
        addPgcLiveMap(latitude,longitude);
        //addTranslationTable();

        // Add other info
        addOtherInfoDiv(username,latitude,longitude);

        // Remove the UTM coordinates
        removeUTMCoordinates();

        // Remove disclaimer
        //$('#ctl00_divContentMain div.span-17 div.Note.Disclaimer').remove();
        $('#divContentMain div.Note.Disclaimer').remove();

        // Resolve the coordinates into an address
        resolveCoordinatesIntoAnAddress(latitude, longitude);

        // Add number of finds per type to the top
        addNumberOfFindsPerType();

        // Add map links for each bookmarklist
        addMapLinksForEachBookmarkList();

        // Decrypt the hint
        unsafeWindow.dht();

    }

    function addNumberOfFindsPerType(){
        if (typeof $('#ctl00_ContentBody_lblFindCounts').html() !== 'undefined') {
            $('#ctl00_ContentBody_CacheInformationTable').before('<div>' + $('#ctl00_ContentBody_lblFindCounts').html() + '</div>');
        }
    }

    function addMapLinksForEachBookmarkList(){
        var url = '';
        $('ul.BookmarkList li').each(function() {
            var guid = $(this).children(':nth-child(1)').attr('href').replace(/.*\?guid=(.*)/, "$1");
            var owner = $(this).children(':nth-child(3)').text();

            // Add the map link
            url = 'http://project-gc.com/Tools/MapBookmarklist?owner_name=' + encodeURIComponent(owner) + '&guid=' + encodeURIComponent(guid);
            $(this).children(':nth-child(1)').append('&nbsp;<a href="' + url + '" target="_blank"><img src="' + mapLinkIcon + '" title="Map with Project-GC"></a>');

            // Add profile stats link to the owner
            url = 'http://project-gc.com/ProfileStats/' + encodeURIComponent(owner);
            $(this).children(':nth-child(3)').append('&nbsp;<a href="' + url + '" target="_blank"><img src="' + externalLinkIcon + '" title="Project-GC Profile stats"></a>');
        });

    }

    function Page_Logbook() {
        // Since everything in the logbook is ajax, we need to wait for the elements
        waitForKeyElements('#AllLogs tr', Logbook);
        waitForKeyElements('#PersonalLogs tr', Logbook);
        waitForKeyElements('#FriendLogs tr', Logbook);
    }

    function Page_NewTrackableLog() {
        correctComboValues();
        if($('#ctl00_ContentBody_lbHeading').html()!='Efectuar um registo'){
            // do nothing
        }
        else
        {
            hideDivAdvancedOptions();
            selectTypeLogDiscoveredIt();
        }
    }

    function Page_NewLog() {
        correctComboValues();
        if($('#ctl00_ContentBody_lbHeading').html()!='Efectuar um registo'){
            // do nothing
        }
        else
        {
            hideDivAdvancedOptions();
            autoCompleteLogText();
        }
    }

    function automaticTextForLog(){
        var cachesCount = $('.cache-count').html();
        if(cachesCount !== null){
            cachesCount = cachesCount.substring(0,cachesCount.indexOf(' '));
            cachesCount++;
        } else cachesCount = "--";

        var elem = $("#ctl00_ContentBody_LogBookPanel1_ddLogType").val();
        var txt = null;

        if (elem == '2'){  //found
            txt = "**#"+cachesCount+"**\n\nCache encontrada na companhia de...\nObrigado ao owner pela cache e partilha do local ;-)\n\n**TFTC!**";
            selectAllTrackablesVisited();
        } else if (elem == '3'){  //not found
            txt = "#--\n\nEsta não quis aparecer :(\nFica para uma próxima oportunidade!";
            selectAllTrackablesVisited();
        } else if (elem == '9'){  //will attend
            txt = "Na agenda, mais perto da data confirmo ;)";
        } else if (elem == '10'){  //attended
            txt = "**#"+cachesCount+"**\n\nMais um momento de convívio onde falámos deste nosso hobby e partilhámos alguns TB's!\nObrigado ao owner pela iniciativa e até ao próximo evento ;-)\n\n**TFTE!**";
            selectAllTrackablesVisited();
        }

        if(txt!==null){
            $('#ctl00_ContentBody_LogBookPanel1_uxLogInfo').text(txt);
        }
    }

    function autoCompleteLogText(){
        automaticTextForLog();

        $("#ctl00_ContentBody_LogBookPanel1_ddLogType").change(function(){
            automaticTextForLog();
        });

    }

    function selectTypeLogDiscoveredIt(){
        var elem = document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType');
        elem.value = '48';
    }

    function selectAllTrackablesVisited(){
        var elem = document.getElementById('aAllVisited');
        if(elem !== null){
            elem.click();
        }
    }

    function hideDivAdvancedOptions(){
        $("#divAdvancedOptions").remove();
    }

    function addProfileStatsForUser(jNode) {
        var profileNameElm = $(jNode).find('p.logOwnerProfileName strong a');
        var profileName = profileNameElm.html();

        if (typeof profileName !== 'undefined') {
            profileName = profileNameElm.append('<a href="' + pgcUrl + 'ProfileStats/' + encodeURIComponent(profileName) + '" target="_blank"><img src="' + externalLinkIcon + '" title="PGC Profile Stats"></a>');
        }
    }

    function Logbook(jNode) {
        // Add Profile stats after each user
        addProfileStatsForUser(jNode);

        // Save to latest logs
        if (latestLogs.length < 5) {
            var node = $(jNode).find('div.HalfLeft.LogType strong img[src]'),
                logType = {};

            if (node.length === 0)
                return false;

            logType = {
                'src': node.attr('src'),
                'alt': node.attr('alt'),
                'title': node.attr('title')
            };

            logType.id = +logType.src.replace(/.*logtypes\/(\d+)\.png/, "$1");

            // First entry is undefined, due to ajax
            if (logType.src) {
                latestLogs.push('<img src="' + logType.src + '" alt="' + logType.alt + '" title="' + logType.title + '" style="margin-bottom: -4px; margin-right: 1px;">');
                // 2 = found, 3 = dnf, 4 = note, 5 = archive, 22 = disable, 24 = publish, 45 = nm, 46 = owner maintenance, 68 = reviewer note
                if ($.inArray(logType.id, [3, 5, 22, 45, 68]) !== -1) {
                    latestLogsAlert = true;
                }
            }

            // Show latest logs
            // TODO : Fix this code => latestLogs.length === 5 but it's < 5 higher...
            if (latestLogs.length === 5) {
                var images = latestLogs.join('');

                $('#ctl00_ContentBody_size p').removeClass('AlignCenter').addClass('NoBottomSpacing');

                if (latestLogsAlert) {
                    $('#ctl00_ContentBody_size').append('<p class="NoBottomSpacing OldWarning"><strong>Latest logs:</strong> <span>' + images + '</span></p>');
                } else {
                    $('#ctl00_ContentBody_size').append('<p class="NoBottomSpacing">Latest logs: <span>' + images + '</span></p>');
                }
            }

        }

    }


    //add live map
    function addPgcLiveMap(latitude,longitude){
        var mapUrl = pgcUrl + 'LiveMap/#c=' + latitude + ',' + longitude + ';z=14';

        $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoLinkPanel').append(
            '<div style="margin-bottom: 10px;"><a target="_blank" href="' + mapUrl + '">Live map do Project-GC</a></div>'
        );
    }


    //TODO - add map compare links
    function addPgcMapLinks(username,latitude,longitude){
        var max_distance = 3;
        var playerToCompare = 'player1';

        var mapUrl = pgcUrl + 'Tools/MapCompare/?profile_name='+username+'&profile_name2='+playerToCompare+'&' +
            'nonefound=on&onefound=on&ownfound=on&location=' + latitude + ',' + longitude + '&max_distance=4&' +
            'type%5B%5D=Earthcache&type%5B%5D=GPS+Adventures+Exhibit&type%5B%5D=Groundspeak+Block+Party&type%5B%5D=Groundspeak+HQ&type%5B%5D=Groundspeak+Lost+and+Found+Celebration&type%5B%5D=Letterbox+Hybrid&type%5B%5D=Locationless+%28Reverse%29+Cache&type%5B%5D=Lost+and+Found+Event+Cache&type%5B%5D=Multi-cache&type%5B%5D=Project+APE+Cache&type%5B%5D=Traditional+Cache&type%5B%5D=Unknown+Cache&type%5B%5D=Virtual+Cache&type%5B%5D=Webcam+Cache&type%5B%5D=Wherigo+Cache&submit=Filter';
        $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoLinkPanel').append(
            '<div style="margin-bottom: 8px;"><a target="_blank" href="' + mapUrl + '">Map Compare with '+playerToCompare+'</a></div>'
        );

        playerToCompare = 'player2';
        mapUrl = pgcUrl + 'Tools/MapCompare/?profile_name='+username+'&profile_name2='+playerToCompare+'&' +
            'nonefound=on&onefound=on&ownfound=on&location=' + latitude + ',' + longitude + '&max_distance=4&' +
            'type%5B%5D=Earthcache&type%5B%5D=GPS+Adventures+Exhibit&type%5B%5D=Groundspeak+Block+Party&type%5B%5D=Groundspeak+HQ&type%5B%5D=Groundspeak+Lost+and+Found+Celebration&type%5B%5D=Letterbox+Hybrid&type%5B%5D=Locationless+%28Reverse%29+Cache&type%5B%5D=Lost+and+Found+Event+Cache&type%5B%5D=Multi-cache&type%5B%5D=Project+APE+Cache&type%5B%5D=Traditional+Cache&type%5B%5D=Unknown+Cache&type%5B%5D=Virtual+Cache&type%5B%5D=Webcam+Cache&type%5B%5D=Wherigo+Cache&submit=Filter';
        $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoLinkPanel').append(
            '<div style="margin-bottom: 8px;"><a target="_blank" href="' + mapUrl + '">Map Compare with '+playerToCompare+'</a></div>'
        );

        playerToCompare = 'player3';
        mapUrl = pgcUrl + 'Tools/MapCompare/?profile_name='+username+'&profile_name2='+playerToCompare+'&' +
            'nonefound=on&onefound=on&ownfound=on&location=' + latitude + ',' + longitude + '&max_distance=4&' +
            'type%5B%5D=Earthcache&type%5B%5D=GPS+Adventures+Exhibit&type%5B%5D=Groundspeak+Block+Party&type%5B%5D=Groundspeak+HQ&type%5B%5D=Groundspeak+Lost+and+Found+Celebration&type%5B%5D=Letterbox+Hybrid&type%5B%5D=Locationless+%28Reverse%29+Cache&type%5B%5D=Lost+and+Found+Event+Cache&type%5B%5D=Multi-cache&type%5B%5D=Project+APE+Cache&type%5B%5D=Traditional+Cache&type%5B%5D=Unknown+Cache&type%5B%5D=Virtual+Cache&type%5B%5D=Webcam+Cache&type%5B%5D=Wherigo+Cache&submit=Filter';
        $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoLinkPanel').append(
            '<div style="margin-bottom: 8px;"><a target="_blank" href="' + mapUrl + '">Map Compare with '+playerToCompare+'</a></div>'
        );

    }


    //TODO - work in progress
    function addTranslationTable(){
        var gcCode = getGcCodeFromPage();
        var text = "<table cellspacing='1' cellpadding='2' bgcolor='blue' border='0' style='border-spacing: 1px;table-layout: auto;'><tbody><tr><td bgcolor='#EFF4F9' style='padding: 2px; width: inherit;'><strong style='max-width: 670px;'>Translation</strong><div style='display: none; max-width: 670px;'>[This translation box was created by geo-amd. You are free to use it in your own cache pages.]</div></td><td bgcolor='#FFFFFF' style='padding: 2px; width: inherit;'>";
        text += "<a target='_blank' href='http://translate.google.com/translate?langpair=en|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/uk_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=es|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/es_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=de|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/de_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=fr|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/fr_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=it|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/it_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=el|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/gr_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=sv|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/se_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=no|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/no_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=fi|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/fi_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=nl|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/nl_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=da|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/dk_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=ru|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/ru_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=zh|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/cn_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=ar|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/sa_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=hi|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/in_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=ja|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/ja_flag.png' border='0' width='20' class='InsideTable'></a> <a target='_blank' href='http://translate.google.com/translate?langpair=ko|pt&amp;u=http://coord.info/"+gcCode+"' style='max-width: 670px;'><img src='http://www.google.com/images/flags/kr_flag.png' border='0' width='20' class='InsideTable'></a></td></tr></tbody></table>";  
        $('#ctl00_ContentBody_LongDescription').prepend(text);
    }


}());