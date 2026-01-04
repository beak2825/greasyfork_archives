// ==UserScript==
// @name         Premium Overviews
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  try to take over the world!
// @author       AlegreVida
// @match        https://s46-tr.ikariam.gameforge.com/?view=city*
// @match        https://s46-tr.ikariam.gameforge.com/?view=island*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415691/Premium%20Overviews.user.js
// @updateURL https://update.greasyfork.org/scripts/415691/Premium%20Overviews.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fnc_BuildingsTableListener(){

        function fnc_BuildingsTable(){
            if($('#js_tab_premiumTradeAdvisorBuildings').hasClass('selected')){

                //var city = {name:"", id:"", link:"", buildings:(new Array(30)) };
                //var building = {lvl:0, status:0, link:""};

                var cities = new Array($('.table01:first tr').length-1);
                var cityPNG = 'skin/layout/city.png';

                var buildingCounter = 0;

                var allBuildings = new Array(30);
                for (var x = 1; x <= $('#buildingsOverview .table01').length; x++){
                    for (var y = 2; y <= $('#buildingsOverview .table01:nth-of-type('+x+') tr.headingrow th').length; y++){
                        var th = $('#buildingsOverview .table01:nth-of-type('+x+') tr.headingrow th:nth-of-type(' + y + ')');
                        allBuildings[buildingCounter] = { title:$(th).attr('title'), src:$(th).find('img').attr('src') };
                        buildingCounter = buildingCounter + 1;
                    }
                }

                console.log("Length of AllBuildings: " + allBuildings.length);

                buildingCounter = 0;

                for(var a = 2; a <= $('#buildingsOverview .table01:first tr').length; a++){
                    var link = $('#buildingsOverview .table01:first tr:nth-of-type(' + a + ') a');
                    var href = $('#buildingsOverview .table01:first tr:nth-of-type(' + a + ') a').attr('href');
                    var city = {
                        name:link.text(),
                        link:href,
                        id:href.slice(href.lastIndexOf('=')+1, href.length),
                        buildings:new Array(30)
                    };
                    cities[a-2] = city;
                }

                for(var i = 1; i <= $('#buildingsOverview .table01').length; i++){
                    var table = $('#buildingsOverview .table01:nth-of-type(' + i + ')');
                    for(var j = 2; j <= $(table).find('tr').length; j++){
                        var row = $(table).find('tr:nth-of-type(' + j + ')');
                        for(var k = 1; k <= $(row).find('td').length; k++){
                            var td = $(row).find('td:nth-of-type(' + k + ')');
                            var buildingLink = $(row).find('td:nth-of-type(' + k + ') a');
                            var flag = $(buildingLink).length > 0 ? true : false;
                            var build = {
                                lvl: flag ? $(buildingLink).text() : "-",
                                link: flag ? $(buildingLink).attr('href') : null,
                                status:0
                            };



                            if($(td).find('div.upgrade').length > 0){
                                build.status = 1;
                            }else if($(td).find('div.upgradeList').length > 0){
                                build.status = 2;
                            }

                            cities[j-2].buildings[(i-1)*5 + k-1] = build;
                        };
                    };
                }

                //var upgradeHTML = '<td class="building"><div class="upgradeList"><a href="?view=city&dialog=' + keyword + '&cityId=' + cityId + '" class">' + cityLvl + '<span>' + timeText + '</span></a></div></td>';
                //var upgradeListHTML = '<td class="building"><div class="upgrade"><a href="?view=city&dialog=' + keyword + '&cityId=' + cityId + '">' + cityLvl + '<span>' + timeText + '</span></a></div></td>';


                while($('#buildingsOverview .content .table01').length > 1){
                    $('#buildingsOverview .content .table01:last').remove();
                }

                while($('#buildingsOverview .content .table01 tr:first th').length > 1){
                    $('#buildingsOverview .content .table01 tr:first th:last').remove();
                }

                for(var i2 = 2; i2 <= $('#buildingsOverview .content .table01 tr').length; i2++){
                    while($('#buildingsOverview .content .table01 tr:nth-of-type(' + i2 + ') td').length > 0){
                        $('#buildingsOverview .content .table01 tr:nth-of-type(' + i2 + ') td:last').remove();
                    }
                }


                var z = 0;
                while(z <= 29){
                    $('#buildingsOverview .content .table01:first tr:nth-of-type(1)').append('<th class="building" title="' + allBuildings[z].title + '"><img width="28px" src="' + allBuildings[z].src + '" alt="' + allBuildings[z].title + '" title="' + allBuildings[z].title + '"></th>');
                    z++;
                }

                for(var w = 2; w <= $('#buildingsOverview .content:first .table01:first tbody tr').length; w++){
                    var v = 0;
                    while(v <= 29){
                        if(cities[w-2].buildings[v].status == 0){
                            if(cities[w-2].buildings[v].link == null){
                                $('#buildingsOverview .content:first .table01:first tr:nth-of-type(' + w + ')').append('<td class="building">-</td>');
                            }else{
                                $('#buildingsOverview .content:first .table01:first tr:nth-of-type(' + w + ')').append('<td class="building"><a href="' + cities[w-2].buildings[v].link + '" title="' + cities[w-2].buildings[v].name + '">'+ cities[w-2].buildings[v].lvl +'</a></td>');
                            }
                        }else if(cities[w-2].buildings[v].status == 1){
                            $('#buildingsOverview .content:first .table01:first tr:nth-of-type(' + w + ')').append('<td class="building"><div class="upgrade"><a href="' + cities[w-2].buildings[v].link + '">' + cities[w-2].buildings[v].lvl + '</a></div></td>');
                        }else if(cities[w-2].buildings[v].status == 2){
                            $('#buildingsOverview .content:first .table01:first tr:nth-of-type(' + w + ')').append('<td class="building"><div class="upgradeList"><a href="' + cities[w-2].buildings[v].link + '">' + cities[w-2].buildings[v].lvl + '</a></div></td>');
                        }
                        v = v+1;
                    }
                }

                $('#premiumTradeAdvisorBuildings').css("width", "auto");
                $('.mainContentScroll:first').css("width", "auto");
                $('#buildingsOverview').css("width", "auto");
                $('#premiumTradeAdvisorBuildings>div.mainHeader').css("background-position-x", "center");
                $('.mainContentScroll:first').css("height", "");
                $('#premiumTradeAdvisorBuildings_c').css("left", "75px");
                $('#premiumTradeAdvisorBuildings_c').css("top", "250px");
                $('#premiumTradeAdvisorBuildings_c').css("right", "auto");
                $('#premiumTradeAdvisorBuildings_c').css("z-index", "98");

                $('#premiumTradeAdvisorBuildings ul.tabmenu').css("width", "100%");

                $('#js_backlinkButton').css("left", "880px");
                $('#premiumTradeAdvisorBuildings div.close').css("left", "900px");
                //$('#buildingsOverview .content').append('<table class="table01"><tbody></tbody></table>');

                $('#premiumTradeAdvisorBuildings>div.mainContentScroll>div.mainContent>div.center').remove();
                //$('#premiumTradeAdvisor>div.mainContentScroll>div.mainContent>div.center').remove();

                for(var zz = 2; zz <= $('#buildingsOverview .content:first .table01:first tr.headingrow th').length; zz++){
                    //$('#buildingsOverview .content:first .table01:first tr.headingrow th:nth-of-type('+zz+') img').css("width", "30px");
                }

            }
        };

        $('buildingsOverview .table01:nth-of-type(2) tr:nth-of-type(8) td:nth-of-type(4) .upgrade').text();

        var params_BuildingsTable = {
            id: 'premiumTradeAdvisorBuildings',
            parent: document.querySelector('body'),
            recursive: false,
            done: function() {
                fnc_BuildingsTable();
            }
        };

        new MutationObserver(function(mutations) {
            params_BuildingsTable.done();
        }).observe(params_BuildingsTable.parent || document, {
            childList: true
        });
    };
    fnc_BuildingsTableListener();


    function fnc_ResourceOverview(){
        function ResourceOverview(){
            if($('#js_ResourceOverviewTypeSelectionContainer a').css("background") == 'rgba(0, 0, 0, 0) url("https://s46-tr.ikariam.gameforge.com/skin/resources/icon_worldmap_wine.png") no-repeat scroll 5% 50% / auto padding-box border-box'){
                var rowLength = $('#resourceOverview>div.content>table.overview tr').length;
                var wineIdArray = [];
                var notWineIdArray = [];

                for(var k = 2; k < rowLength; k++){
                    if($('#resourceOverview>div.content>table.overview tr:nth-of-type(' + k + ') td:nth-of-type(3)').text() == "-"){
                        notWineIdArray.push(k);
                    }else{
                        wineIdArray.push(k);
                    }
                }

                var wine = getTotalWineInCities(wineIdArray);
                var obj = createObj(notWineIdArray);
                var totalConsumption = totalConsump(obj);

                var flag = true;
                var coef = 5;
                while(flag){
                    obj = calculateNeeds(obj, coef);
                    if(getTotalNeeds(obj) < wine){
                        coef += 5;
                    }else{
                        flag = false;
                    }
                }
                coef -= 5;
                obj = calculateNeeds(obj, coef);
                updateNeedsVisually(obj);
            }
        };

        function createObj(arr){
            var obj = [];
            for(var i = 0; i < arr.length; i++){
            var cityId = arr[i];
            obj[i] = {wineInCity:parseInt($('#resourceOverview>div.content>table.overview tr:nth-of-type(' + cityId + ') td:nth-of-type(2)').text().replace(",", "")),
                      consumption:parseInt($('#resourceOverview>div.content>table.overview tr:nth-of-type(' + cityId + ') td:nth-of-type(7)').text().split("/")[0]),
                      cityName:$('#resourceOverview>div.content>table.overview tr:nth-of-type(' + cityId + ') td:nth-of-type(1)').text().split(" ")[0],
                      needed:0,
                      id:cityId};
            }
            return obj;
        }
        function getTotalWineInCities(arr){
            var wine = 0;
            for(var id of arr){
                wine += parseInt($('#resourceOverview>div.content>table.overview tr:nth-of-type(' + id + ') td:nth-of-type(2)').text().replace(",", ""));
            }
            return wine;
        }
        function totalConsump(obj){
            var totalConsumption = 0;
            for (var city of obj){
                totalConsumption += city.consuption;
            }
            return totalConsumption;
        }
        function updateNeedsVisually(obj){
            for (var city of obj){
                var id = city.id;
                var name = city.cityName;
                var need = ikaNumberStyle(city.needed, false);
               $('#resourceOverview>div.content>table.overview tr:nth-of-type(' + id + ') td:nth-of-type(1)').html(name + " " + "<span style='color:green'>(" + need + ")</span>");
            }
        }
        function calculateNeeds(obj, coef){
            var hour = (obj[0].wineInCity + obj[0].consumption*coef) / obj[0].consumption;
            for(var i = 0; i < obj.length; i++){
                obj[i].needed = Math.floor(obj[i].consumption*hour-obj[i].wineInCity);
            }
            return obj;
        }
        function getTotalNeeds(obj){
            var totalNeeded = 0;
            for (var city of obj){
                totalNeeded += city.needed;
            }
            return totalNeeded;
        }
        function ikaNumberStyle(num, withPlus){
            var isMinus = (num < 0);
            num = Math.abs(num) + "";
            if(num.length > 6){
                num = num.substring(0, num.length-6) + "," + num.substring(num.length-6, num.length-3) + "," + num.substring(num.length-3, num.length);
            }else if(num.length > 3){
                num = num.substring(0, num.length-3) + "," + num.substring(num.length-3, num.length);
            }
            return (isMinus ? "-" + num : ((withPlus) ? "+" : "") + num);
        };

        var params_Yyy = {
            id: 'premiumTradeAdvisor',
            parent: document.querySelector('body'),
            recursive: false,
            done: function() {
                ResourceOverview();
            }
        };

        new MutationObserver(function(mutations) {
            params_Yyy.done();
        }).observe(params_Yyy.parent || document, {
            childList: true
        });
    };
    fnc_ResourceOverview();
})();