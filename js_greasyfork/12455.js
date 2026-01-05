// ==UserScript==
// @name         eRepublik Recent Laws
// @version      0.1
// @namespace    erepLaws
// @description  View a list of all laws from the past 24 hours.
// @author       Scarfar
// @match        http://*.erepublik.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12455/eRepublik%20Recent%20Laws.user.js
// @updateURL https://update.greasyfork.org/scripts/12455/eRepublik%20Recent%20Laws.meta.js
// ==/UserScript==

var lawstoexport;
$( document ).ready(function() {
    $( 'body' ).prepend('<div id="lawviewer_viewlaws" style="background-color: grey; text-align: center; color: white; width: 100%;">View Recent Laws</div>');
    var beenClicked = false;
    $( '#lawviewer_viewlaws' ).click(function(){
    {
        if(!beenClicked)
        {
            beenClicked = true;
            var tempCountries = [
                'Albania',
                'Argentina',
                'Armenia',
                'Australia',
                'Austria',
                'Belarus',
                'Belgium',
                'Bolivia',
                'Bosnia-Herzegovina',
                'Brazil',
                'Bulgaria',
                'Canada',
                'Chile',
                'China',
                'Colombia'
            ];
            var Countries = [
                'Albania',
                'Argentina',
                'Armenia',
                'Australia',
                'Austria',
                'Belarus',
                'Belgium',
                'Bolivia',
                'Bosnia-Herzegovina',
                'Brazil',
                'Bulgaria',
                'Canada',
                'Chile',
                'China',
                'Colombia',
                'Croatia',
                'Cuba',
                'Cyprus',
                'Czech-Republic',
                'Denmark',
                'Egypt',
                'Estonia',
                'Finland',
                'France',
                'Georgia',
                'Germany',
                'Greece',
                'Hungary',
                'India',
                'Indonesia',
                'Iran',
                'Ireland',
                'Israel',
                'Italy',
                'Japan',
                'Latvia',
                'Lithuania',
                'Malaysia',
                'Mexico',
                'Montenegro',
                'Netherlands',
                'New-Zealand',
                'Nigeria',
                'North-Korea',
                'Norway',
                'Pakistan',
                'Paraguay',
                'Peru',
                'Philippines',
                'Poland',
                'Portugal',
                'Republic-of-China-Taiwan',
                'Republic-of-Macedonia-FYROM',
                'Republic-of-Moldova',
                'Romania',
                'Russia',
                'Saudi-Arabia',
                'Serbia',
                'Singapore',
                'Slovakia',
                'Slovenia',
                'South-Africa',
                'South-Korea',
                'Spain',
                'Sweden',
                'Switzerland',
                'Thailand',
                'Turkey',
                'Ukraine',
                'United-Arab-Emirates',
                'United-Kingdom',
                'Uruguay',
                'USA',
                'Venezuela'
            ];
            var recentLawsList = [];
            var pagesGot = 0;
            var currentlyRunning = 0;
            $('#lawviewer_viewlaws').html("Loading... because of slow servers this can take a little while, please be paitent. Getting laws from... <span id='countryjustgot'></span>");
            $.each(Countries, function( i, pussy)
                   {
                       $.get("http://www.erepublik.com/en/country-administration/" + pussy + "/1", function(data){
                           console.log(pussy);
                           var tables = $('<div />').append(data).find('tr');
                           var countryClean = $(data).find('#profileholder h1').text().trim();
                           $('#countryjustgot').text(countryClean);
                           tables.each(function( t, ass){
                               var timesel = $( 'td' )[1];
                               var getTime = $(this).children().eq(1).html();
                               var ifhours = getTime.search(/hour|minute/);
                               if(ifhours > 0)
                               {
                                   var lawType = $(this).children().eq(0).text().trim();
                                   var lawTime = $(this).children().eq(1).html().trim();
                                   var lawLink = $(this).children().eq(3).find('a').attr('href');
                                   currentlyRunning++;
                                   $.ajax({
                                       url: lawLink,
                                       method: 'GET',
                                       dataType: "html",
                                       async: true
                                   })
                                   .done(function( data ) {
                                       var lawInfo = $(data).find( 'p.largepadded:eq(1)' ).text();
                                       var timeinmins = lawTime.search("minute");
                                       var numberTime = lawTime.replace(/\D/g,'');
                                       if(timeinmins >= 0)
                                       {
                                           numberTime = numberTime / 100;
                                       }
                                       recentLawsList.push({"country":countryClean, "type":lawType, "time":lawTime, "link":lawLink, 'info':lawInfo, 'numberTime':numberTime});  
                                       $('#countryjustgot').text(countryClean);
                                       currentlyRunning--;
                                   });
                               }
                           });
                       })
                       .done(function(){
                           pagesGot++;
                           console.log(pagesGot);
                           if(pagesGot == Countries.length)
                           {
                               if(currentlyRunning == 0)
                               {
                                   displayResults(recentLawsList);
                               }
                               else
                               {
                                   var titties = setInterval(function(){ if(currentlyRunning == 0){ clearInterval(titties); displayResults(recentLawsList); }}, 500);
                               }
                           }
                       });
                   });
            }
        }
    });
});

function displayResults(recentLawsList)
{
    lawstoexport = recentLawsList;
    console.log(recentLawsList);
    recentLawsList.sort(function(a, b) {
        return parseFloat(a.numberTime) - parseFloat(b.numberTime);
    });
    recentLawsList.sort(compare);
    $('body').html('<div id="recentlawviewer" style="background-color: #424242; color: white; width: 100%;"><table id="recentlawviewertable"></table></div>');
    $('#recentlawviewertable').css({'margin':'auto','font-size':'14px'});
    var lastCountry;
    for(var t = 0; t < recentLawsList.length; t++)
    {
        if(lastCountry != recentLawsList[t].country)
        {
            lastCountry = recentLawsList[t].country;
            $('#recentlawviewertable').append('<tr><td colspan="5" style="color: #0080FF; font-size: 18px; border-bottom: 1px solid #5858FA; padding: 5px 0; margin: 5px 0">' + recentLawsList[t].country + '</td></tr>');
        }
        $('#recentlawviewertable').append('<tr><td><span>Country</span>: ' + recentLawsList[t].country + '</td><td><span>Type</span>: ' + recentLawsList[t].type + '</td><td><a class="lawviewer_link" target="_blank" href="' + recentLawsList[t].link + '">Link</a></td><td><span>Proposed</span>: ' + recentLawsList[t].time + '</td><td><span>Law Info</span>: ' + recentLawsList[t].info + '</td></tr>');
        $('#recentlawviewertable tr td:contains("Natural Enemy")').css({'color':'red'});
    }
    $('#recentlawviewer').append('<div style="margin-top: 20px; padding-bottom: 20px;"><a href="http://www.erepublik.com/" class="lawviewer_link" style="margin-left: 15%; margin-top: 50px;">Return home</a></div>');
    $('#recentlawviewertable td').css({'padding':'2px 8px'});
    $('#recentlawviewertable span').css({'font-size':'15px'});
    $('.lawviewer_link').css({'font-size':'18px','color':'#0080FF','background-color':'#BDBDBD','padding':'0 5px'});
}

function compare1(a,b) {
	if (a.numberTime < b.numberTime)
		return -1;
	if (a.numberTime > b.numberTime)
		return 1;
	return 0;
}

function compare(a,b) {
    if (a.country < b.country)
      return -1;
    if (a.country > b.country)
      return 1;
    return 0;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
    
    