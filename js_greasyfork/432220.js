// ==UserScript==
// @name         Ogame Utility
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  Utilitarios para ogame.
// @author       Savenzip
// @match        https://*.ogame.gameforge.com/game/index.php?page=*
// @icon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432220/Ogame%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/432220/Ogame%20Utility.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var classImp = "alliance";
    var jsonString = localStorage.getItem('impScript');
    if (jsonString != null)
    {
        classImp = "alliance active";
    }

    $("#menuTable").append('<li><span class="menu_icon" style="cursor:no-drop"><span id="deleteImperio" class="menuImage '+classImp+'"></span></span><a id="verImperio" class="menubutton " href="#" accesskey="" target="_self"><span class="textlabel">Imperio</span></a></li>');
    $("#deleteImperio").click(function(){
        localStorage.removeItem("impScript");
        $("#deleteImperio").removeClass("active");
    });

    var queries = {};
    $.each(document.location.search.substr(1).split('&'),function(c,q){
        var i = q.split('=');
        queries[i[0].toString()] = i[1].toString();
    });
    var _page = queries.page;
    var _component = queries.component;

    if (_page != null && _page == 'ingame'){
        switch(_component)
        {
            case 'supplies':
                calculaSatelites();
                recopilaDatosRecursos();
                break;
            case 'fleetdispatch':
            case 'movement':
                obtieneRecursosVuelo();
                break;
            case 'facilities':
                recopilaDatosInstalaciones();
                break;
        }
    }
    if (_page != null && _page == 'resourceSettings')
    {
        var count = 0;
        var metal8H = 0;
        var cristal8H = 0;
        var deuterio8H = 0;
        $(".summary .undermark span").each(function(){
            //console.log($(this).html().trim());
            switch(count)
            {
                case 0:
                    metal8H = parseInt($(this).html().trim().replaceAll(".","")) * 8;
                    break;
                case 1:
                    cristal8H = parseInt($(this).html().trim().replaceAll(".","")) * 8;
                    break;
                case 2:
                    deuterio8H = parseInt($(this).html().trim().replaceAll(".","")) * 8;
                    break;
            }
            count++;
        });
        $(".listOfResourceSettingsPerPlanet tr:last").after($("<tr><td colspan='2' class='label'><em>Total cada 8 horas:</em></td><td>"+new Intl.NumberFormat("es-CL").format(metal8H)+"</td><td>"+
                                                              new Intl.NumberFormat("es-CL").format(cristal8H)+"</td><td>"+
                                                              new Intl.NumberFormat("es-CL").format(deuterio8H)+"</td><td colspan='2'></td></tr>"));
    }

    $("#verImperio").click(function(){ verImperio(); });

    function calculaSatelites()
    {
        $('#producers li').click(function(){
            //console.log($(this).index());
            var index = $(this).index();
            if (index >= 0 && index <=2)
            {
                //var classes = $(this).attr('class').split(' ')
                var observer = new MutationObserver(function(mutations) {
                    //if ($(".additional_energy_consumption").length) {
                    if ($(".og-loading").attr('style') == "display: none;") {
                        //console.log($('.additional_energy_consumption span').html());
                        //$("#satelite").remove();
                        var costeEnergia = $('.additional_energy_consumption span').html();
                        var energiaActual = $('#resources_energy').html();
                        var temperatura = $(".hightlightPlanet a").attr('title');

                        const indexOfFirst = temperatura.indexOf("De ");
                        const indexOfFirst2 = temperatura.lastIndexOf("°C");
                        temperatura = temperatura.substring(indexOfFirst+3, indexOfFirst2).trim();
                        var tempMin = temperatura.substring(0, temperatura.indexOf("°")-1);
                        var tempMax = temperatura.substring(temperatura.indexOf("a")+2);
                        var solares = ((parseInt(tempMax))+140)/6;
                        var satelites = parseInt(costeEnergia-energiaActual)/solares;


                        //$('.narrow').append('<li><strong>Satélites necesarios:</strong><span class="bonus">'+ satelites +'</span></li>');
                        if (Math.ceil(satelites)>0)
                        {
                            $('.additional_energy_consumption span').append('<span class="bonus"> (SS: '+ Math.ceil(satelites) +')</span>');
                        }

                        observer.disconnect();
                        //We can disconnect observer once the element exist if we dont want observe more changes in the DOM
                    }
                });
                // Start observing
                observer.observe(document.body, { //document.body is node target to observe
                    childList: true, //This is a must have for the observer with subtree
                    subtree: true //Set to true if changes must also be observed in descendants.
                });
            }
            //console.log(clases[clases.length - 1]);
        });
    }

    function obtieneRecursosVuelo()
    {
        var metalTotalRecic = 0;
        var cristalTotalRecic = 0;
        var deuterioTotalRecic = 0;

        var metalTotalTra = 0;
        var cristalTotalTra = 0;
        var deuterioTotalTra = 0;

        var metalTotalAtaq = 0;
        var cristalTotalAtaq = 0;
        var deuterioTotalAtaq = 0;

        var metalTotalExp = 0;
        var cristalTotalExp = 0;
        var deuterioTotalExp = 0;

        $('.eventFleet').each(function(){
            var mision = $(this).attr('data-mission-type');
            if (mision == 8 || mision == 1 || mision == 15)//reciclaje - ataque - expedicion
            {
                var tableRecursos = $(this).children(".icon_movement_reserve").html();
                if (tableRecursos != null)
                {
                    //console.log(tableRecursos);
                    var tableMetal = tableRecursos.substring(tableRecursos.indexOf("Metal:</td>")+11);
                    var tableCristal = tableRecursos.substring(tableRecursos.indexOf("Cristal:</td>")+13);
                    var tableDeuterio = tableRecursos.substring(tableRecursos.indexOf("Deuterio:</td>")+14);
                    var metal = tableMetal.substring(tableMetal.indexOf(">")+1,tableMetal.indexOf("</td>"));
                    var cristal = tableCristal.substring(tableCristal.indexOf(">")+1,tableCristal.indexOf("</td>"));
                    var deuterio = tableDeuterio.substring(tableDeuterio.indexOf(">")+1,tableDeuterio.indexOf("</td>"));
                    if (mision == 8)
                    {
                        metalTotalRecic += parseInt(metal.replaceAll('.',''));
                        cristalTotalRecic += parseInt(cristal.replaceAll('.',''));
                        deuterioTotalRecic += parseInt(deuterio.replaceAll('.',''));
                    }
                    if (mision == 1)
                    {
                        metalTotalAtaq += parseInt(metal.replaceAll('.',''));
                        cristalTotalAtaq += parseInt(cristal.replaceAll('.',''));
                        deuterioTotalAtaq += parseInt(deuterio.replaceAll('.',''));
                    }
                    if (mision == 15)
                    {
                        metalTotalExp += parseInt(metal.replaceAll('.',''));
                        cristalTotalExp += parseInt(cristal.replaceAll('.',''));
                        deuterioTotalExp += parseInt(deuterio.replaceAll('.',''));
                    }
                }
            }
            if (mision == 3)//transporte
            {
                var tableRecursos3 = $(this).children(".icon_movement").html();
                if (tableRecursos3 != null)
                {
                    //console.log(tableRecursos);
                    var tableMetal3 = tableRecursos3.substring(tableRecursos3.indexOf("Metal:</td>")+11);
                    var tableCristal3 = tableRecursos3.substring(tableRecursos3.indexOf("Cristal:</td>")+13);
                    var tableDeuterio3 = tableRecursos3.substring(tableRecursos3.indexOf("Deuterio:</td>")+14);
                    var metal3 = tableMetal3.substring(tableMetal3.indexOf(">")+1,tableMetal3.indexOf("</td>"));
                    var cristal3 = tableCristal3.substring(tableCristal3.indexOf(">")+1,tableCristal3.indexOf("</td>"));
                    var deuterio3 = tableDeuterio3.substring(tableDeuterio3.indexOf(">")+1,tableDeuterio3.indexOf("</td>"));
                    metalTotalTra += parseInt(metal3.replaceAll('.',''));
                    cristalTotalTra += parseInt(cristal3.replaceAll('.',''));
                    deuterioTotalTra += parseInt(deuterio3.replaceAll('.',''));
                }
            }
        });

        var totalMetal = metalTotalRecic + metalTotalTra + metalTotalAtaq + metalTotalExp;
        var totalCristal = cristalTotalRecic + cristalTotalTra + cristalTotalAtaq + cristalTotalExp;
        var totalDeuterio = deuterioTotalRecic + deuterioTotalTra + deuterioTotalAtaq + deuterioTotalExp;

        var tabla = "<table class='list listOfResourceSettingsPerPlanet' style='margin-bottom:15px;'><tbody><tr><th style='width:100px; font-weight: 700; color: #fff;'>Misi&oacute;n</th><th style='width:50px;font-weight: 700; color: #fff;'>Metal</th><th style='width:50px;font-weight: 700; color: #fff;'>Cristal</th><th style='width:50px; font-weight: 700; color: #fff;'>Deuterio</th></tr>"+
            "<tr class='alt'><td>Recolecci&oacute;n</td><td>" + new Intl.NumberFormat("es-CL").format(metalTotalRecic) + "</td><td>" + new Intl.NumberFormat("es-CL").format(cristalTotalRecic) + "</td><td>" + new Intl.NumberFormat("es-CL").format(deuterioTotalRecic) + "</td></tr>"+
            "<tr><td>Transporte</td><td>" + new Intl.NumberFormat("es-CL").format(metalTotalTra) + "</td><td>" + new Intl.NumberFormat("es-CL").format(cristalTotalTra) + "</td><td>" + new Intl.NumberFormat("es-CL").format(deuterioTotalTra) + "</td></tr>"+
            "<tr class='alt'><td>Ataque</td><td>"+ new Intl.NumberFormat("es-CL").format(metalTotalAtaq) +"</td><td>" + new Intl.NumberFormat("es-CL").format(cristalTotalAtaq) + "</td><td>" + new Intl.NumberFormat("es-CL").format(deuterioTotalAtaq) + "</td></tr>"+
            "<tr><td>Expedición</td><td>"+ new Intl.NumberFormat("es-CL").format(metalTotalExp) +"</td><td>" + new Intl.NumberFormat("es-CL").format(cristalTotalExp) + "</td><td>" + new Intl.NumberFormat("es-CL").format(deuterioTotalExp) + "</td></tr>"+
            "<tr class='alt'><td>Total</td><td class='undermark'>"+ new Intl.NumberFormat("es-CL").format(totalMetal) +"</td><td class='undermark'>"+ new Intl.NumberFormat("es-CL").format(totalCristal) +"</td><td class='undermark'>"+ new Intl.NumberFormat("es-CL").format(totalDeuterio) +"</td></tr></tbody></table>";

        $("#fleet1 #inhalt #planet + .fleetStatus").after($("<div class='fleetDetails detailsOpened' style='height: auto;'><div id='slots' class='left'><div class='fleft'>" + tabla + "</div></div></div>"));
        $("#movement #inhalt .fleetStatus").after($("<div class='fleetDetails detailsOpened' style='height: auto;'><div id='slots' class='left'style='left: 7px;'><div class='fleft'>" + tabla + "</div></div></div>"))
    }

    function recopilaDatosRecursos()
    {
        var jsonObj = [];

        var jsonString = localStorage.getItem('impScript');
        if (jsonString != null)
        {
            jsonObj = JSON.parse(jsonString);
        }

        var idplanet = $(".hightlightPlanet").attr("id");
        var coords = $(".hightlightPlanet a .planet-koords").html();
        var resources_metal = $("#resources_metal").html().replaceAll(".","");
        var resources_crystal = $("#resources_crystal").html().replaceAll(".","");
        var resources_deuterium = $("#resources_deuterium").html().replaceAll(".","");
        var minaMetal = $(".icon.sprite.sprite_medium.medium.metalMine span.level").attr("data-value");
        var minaCristal = $(".icon.sprite.sprite_medium.medium.crystalMine span.level").attr("data-value");
        var sintetizadorDeuterio = $(".icon.sprite.sprite_medium.medium.deuteriumSynthesizer span.level").attr("data-value");
        var plantaSolar = $(".icon.sprite.sprite_medium.medium.solarPlant span.level").attr("data-value");
        var plantaFusion = $(".icon.sprite.sprite_medium.medium.fusionPlant span.level").attr("data-value");
        var sateliteSolar = $(".icon.sprite.sprite_medium.medium.solarSatellite span.amount").attr("data-value");
        var metalStorage = $(".icon.sprite.sprite_small.small.metalStorage span.level").attr("data-value");
        var crystalStorage = $(".icon.sprite.sprite_small.small.crystalStorage span.level").attr("data-value");
        var deuteriumStorage = $(".icon.sprite.sprite_small.small.deuteriumStorage span.level").attr("data-value");

        var update = false;
        $(jsonObj).each(function(){
            if (this.idplanet == idplanet)
            {
                this.idplanet = idplanet;
                this.resources_metal = resources_metal;
                this.resources_crystal = resources_crystal;
                this.resources_deuterium = resources_deuterium;
                this.minaMetal = minaMetal;
                this.minaCristal = minaCristal;
                this.sintetizadorDeuterio = sintetizadorDeuterio;
                this.plantaSolar = plantaSolar;
                this.plantaFusion = plantaFusion;
                this.sateliteSolar = sateliteSolar;
                this.metalStorage = metalStorage;
                this.crystalStorage = crystalStorage;
                this.deuteriumStorage = deuteriumStorage;
                update = true;
            }
        });
        if (!update)
        {
            var planet = {}
            planet.idplanet = idplanet;
            planet.coords = coords;
            planet.resources_metal = resources_metal;
            planet.resources_crystal = resources_crystal;
            planet.resources_deuterium = resources_deuterium;
            planet.minaMetal = minaMetal;
            planet.minaCristal = minaCristal;
            planet.sintetizadorDeuterio = sintetizadorDeuterio;
            planet.plantaSolar = plantaSolar;
            planet.plantaFusion = plantaFusion;
            planet.sateliteSolar = sateliteSolar;
            planet.metalStorage = metalStorage;
            planet.crystalStorage = crystalStorage;
            planet.deuteriumStorage = deuteriumStorage;
            jsonObj.push(planet);
        }
        $("#technologies h3").append('<span class="playerstatus online"></span>');
        if (!$("#deleteImperio").hasClass("active"))
        {
            $("#deleteImperio").addClass("active");
        }
        console.log(jsonObj);
        localStorage.setItem('impScript',JSON.stringify(jsonObj));
    }

    function recopilaDatosInstalaciones()
    {
        var jsonObj = [];

        var jsonString = localStorage.getItem('impScript');
        if (jsonString != null)
        {
            jsonObj = JSON.parse(jsonString);
        }

        var idplanet = $(".hightlightPlanet").attr("id");
        var coords = $(".hightlightPlanet a .planet-koords").html();
        var resources_metal = $("#resources_metal").html().replaceAll(".","");
        var resources_crystal = $("#resources_crystal").html().replaceAll(".","");
        var resources_deuterium = $("#resources_deuterium").html().replaceAll(".","");
        var roboticsFactory = $(".icon.sprite.sprite_medium.medium.roboticsFactory span.level").attr("data-value");
        var shipyard = $(".icon.sprite.sprite_medium.medium.shipyard span.level").attr("data-value");
        var researchLaboratory = $(".icon.sprite.sprite_medium.medium.researchLaboratory span.level").attr("data-value");
        var allianceDepot = $(".icon.sprite.sprite_medium.medium.allianceDepot span.level").attr("data-value");
        var missileSilo = $(".icon.sprite.sprite_medium.medium.missileSilo span.level").attr("data-value");
        var naniteFactory = $(".icon.sprite.sprite_medium.medium.naniteFactory span.level").attr("data-value");
        var terraformer = $(".icon.sprite.sprite_medium.medium.terraformer span.level").attr("data-value");
        var repairDock = $(".icon.sprite.sprite_medium.medium.repairDock span.level").attr("data-value");

        var update = false;
        $(jsonObj).each(function(){
            if (this.idplanet == idplanet)
            {
                this.idplanet = idplanet;
                this.resources_metal = resources_metal;
                this.resources_crystal = resources_crystal;
                this.resources_deuterium = resources_deuterium;
                this.roboticsFactory = roboticsFactory;
                this.shipyard = shipyard;
                this.researchLaboratory = researchLaboratory;
                this.allianceDepot = allianceDepot;
                this.missileSilo = missileSilo;
                this.naniteFactory = naniteFactory;
                this.terraformer = terraformer;
                this.repairDock = repairDock;
                update = true;
            }
        });
        if (!update)
        {
            var planet = {}
            planet.idplanet = idplanet;
            planet.coords = coords;
            planet.resources_metal = resources_metal;
            planet.resources_crystal = resources_crystal;
            planet.resources_deuterium = resources_deuterium;
            planet.roboticsFactory = roboticsFactory;
            planet.shipyard = shipyard;
            planet.researchLaboratory = researchLaboratory;
            planet.allianceDepot = allianceDepot;
            planet.missileSilo = missileSilo;
            planet.naniteFactory = naniteFactory;
            planet.terraformer = terraformer;
            planet.repairDock = repairDock;
            jsonObj.push(planet);
        }
        $("#technologies h3").append('<span class="playerstatus online"></span>');
        if (!$("#deleteImperio").hasClass("active"))
        {
            $("#deleteImperio").addClass("active");
        }
        console.log(jsonObj);
        localStorage.setItem('impScript',JSON.stringify(jsonObj));
    }

    function verImperio()
    {
        var jsonObj = [];

        var jsonString = localStorage.getItem('impScript');
        if (jsonString != null)
        {
            jsonObj = JSON.parse(jsonString);
        }
        else
        {
            return;
        }

        var row_coords = "<tr style='text-align:center;color:#fff'><th></th>";
        var row_empty1 = "<tr class='alt'><th>&nbsp;</th>";
        var row_resourcesMetal = "<tr><th>Metal</th>";
        var row_resourcesCrystal = "<tr class='alt'><th>Cristal</th>";
        var row_resourcesDeuterium = "<tr><th>Deuterio</th>";
        var row_empty2 = "<tr class='alt'><th>&nbsp;</th>";
        var row_minaMetal = "<tr><th>Mina de metal</th>";
        var row_minaCristal = "<tr class='alt'><th>Mina de cristal</th>";
        var row_sintetizadorDeuterio = "<tr><th>Sintetizador de deuterio</th>";
        var row_plantaSolar = "<tr class='alt'><th>Planta de energía solar</th>";
        var row_plantaFusion = "<tr><th>Planta de fusión</th>";
        var row_metalStorage = "<tr class='alt'><th>Almacén de metal</th>";
        var row_crystalStorage = "<tr><th>Almacén de cristal</th>";
        var row_deuteriumStorage = "<tr class='alt'><th>Contenedor de deuterio</th>";
        var row_empty3 = "<tr><th>&nbsp;</th>";
        var row_roboticsFactory = "<tr class='alt'><th>Fábrica de robots</th>";
        var row_shipyard = "<tr><th>Hangar</th>";
        var row_researchLaboratory = "<tr class='alt'><th>Laboratorio de investigación</th>";
        var row_allianceDepot = "<tr><th>Depósito de la alianza</th>";
        var row_missileSilo = "<tr class='alt'><th>Silo</th>";
        var row_naniteFactory = "<tr><th>Fábrica de nanobots</th>";
        var row_terraformer = "<tr class='alt'><th>Terraformer</th>";
        var row_repairDock = "<tr><th>Astillero orbital</th>";
        var row_empty4 = "<tr class='alt'><th>&nbsp;</th>";
        var row_sateliteSolares = "<tr><th>Satélite Solar</th>";

        var metalTotal = 0;
        var cristalTotal = 0;
        var deuterioTotal = 0;
        $(jsonObj).sort(sortByProperty("idplanet")).each(function(){
            metalTotal += parseInt(this.resources_metal);
            cristalTotal += parseInt(this.resources_crystal);
            deuterioTotal += parseInt(this.resources_deuterium);
            row_coords += "<td>"+this.coords+"</td>";
            row_empty1 += "<td></td>";
            row_resourcesMetal += "<td>"+new Intl.NumberFormat("es-CL").format(this.resources_metal) +"</td>";
            row_resourcesCrystal += "<td>"+new Intl.NumberFormat("es-CL").format(this.resources_crystal) +"</td>";
            row_resourcesDeuterium += "<td>"+new Intl.NumberFormat("es-CL").format(this.resources_deuterium) +"</td>";
            row_empty2 += "<td></td>";
            row_minaMetal += "<td>"+(this.minaMetal ?? "-")+"</td>";
            row_minaCristal += "<td>"+(this.minaCristal ?? "-")+"</td>";
            row_sintetizadorDeuterio += "<td>"+(this.sintetizadorDeuterio ?? "-")+"</td>";
            row_plantaSolar += "<td>"+(this.plantaSolar ?? "-")+"</td>";
            row_plantaFusion += "<td>"+(this.plantaFusion ?? "-")+"</td>";
            row_metalStorage += "<td>"+(this.metalStorage ?? "-")+"</td>";
            row_crystalStorage += "<td>"+(this.crystalStorage ?? "-")+"</td>";
            row_deuteriumStorage += "<td>"+(this.deuteriumStorage ?? "-")+"</td>";
            row_empty3 += "<td></td>";
            row_roboticsFactory += "<td>"+(this.roboticsFactory ?? "-")+"</td>";
            row_shipyard += "<td>"+(this.shipyard ?? "-")+"</td>";
            row_researchLaboratory += "<td>"+(this.researchLaboratory ?? "-")+"</td>";
            row_allianceDepot += "<td>"+(this.allianceDepot ?? "-")+"</td>";
            row_missileSilo += "<td>"+(this.missileSilo ?? "-")+"</td>";
            row_naniteFactory += "<td>"+(this.naniteFactory ?? "-")+"</td>";
            row_terraformer += "<td>"+(this.terraformer ?? "-")+"</td>";
            row_repairDock += "<td>"+ (this.repairDock ?? "-") +"</td>";
            row_empty4 += "<td></td>";
            row_sateliteSolares += "<td>"+(this.sateliteSolar ?? "-")+"</td>";
        });
        row_coords += "<td>&Sigma;</td></tr>";
        row_empty1 += "<td></td></tr>";
        row_resourcesMetal += "<td class='undermark'>"+new Intl.NumberFormat("es-CL").format(metalTotal) +"</td></tr>";
        row_resourcesCrystal += "<td class='undermark'>"+new Intl.NumberFormat("es-CL").format(cristalTotal) +"</td></tr>";
        row_resourcesDeuterium += "<td class='undermark'>"+new Intl.NumberFormat("es-CL").format(deuterioTotal) +"</td></tr>";
        row_empty2 += "<td></td></tr>";
        row_minaMetal += "<td></td></tr>";
        row_minaCristal += "<td></td></tr>";
        row_sintetizadorDeuterio += "<td></td></tr>";
        row_plantaSolar += "<td></td></tr>";
        row_plantaFusion += "<td></td></tr>";
        row_metalStorage += "<td></td></tr>";
        row_crystalStorage += "<td></td></tr>";
        row_deuteriumStorage += "<td></td></tr>";
        row_empty3 += "<td></td></tr>";
        row_roboticsFactory += "<td></td></tr>";
        row_shipyard += "<td></td></tr>";
        row_researchLaboratory += "<td></td></tr>";
        row_allianceDepot += "<td></td></tr>";
        row_missileSilo += "<td></td></tr>";
        row_naniteFactory += "<td></td></tr>";
        row_terraformer += "<td></td></tr>";
        row_repairDock += "<td></td></tr>";
        row_empty4 += "<td></td></tr>";
        row_sateliteSolares += "<td></td></tr>";

        var table = "<div style='background: transparent url(https://gf1.geo.gfsrv.net/cdn3d/32469184f13227d35e7cb4bdab93ae.gif) no-repeat;height: 30px;'>"+
            "<h2 style='font: bold 18px/22px Verdana,Arial,Helvetica,sans-serif;padding: 3px 0px 0px 40px;color:#fff'>Vista Imperio</h2></div>"+
            "<div class='left' style='overflow-y:auto; background: transparent url(https://gf1.geo.gfsrv.net/cdn03/db530b4ddcbe680361a6f837ce0dd7.gif) repeat-y;'>"+
            "<table id='tablaImperio' style='border-spacing:5px;margin-left:20px;color:grey'><tbody>"+
            row_coords + row_empty1 + row_resourcesMetal + row_resourcesCrystal + row_resourcesDeuterium +row_empty2 +row_minaMetal +row_minaCristal +row_sintetizadorDeuterio + row_plantaSolar+ row_plantaFusion+
            row_metalStorage+row_crystalStorage+row_deuteriumStorage+row_empty3+row_roboticsFactory+row_shipyard+row_researchLaboratory+row_allianceDepot+row_missileSilo+row_naniteFactory+row_terraformer+
            row_repairDock+row_empty4+row_sateliteSolares+
            "</tbody></table></div><div style='background: transparent url(https://gf3.geo.gfsrv.net/cdnbe/04a7b39dc27c29c4c2cadd3fd44ec0.gif) no-repeat;height: 30px;'></div>";
        $("#middle").empty();
        $("#middle").append(table);
        $("#tablaImperio th").css("font-weight","bold");
        $("#tablaImperio th").css("color","#fff");
    }

    function sortByProperty(property)
    {
        return function(a,b)
        {
            if(a[property] > b[property])
                return 1;
            else if(a[property] < b[property])
                return -1;

            return 0;
        }
    }

})();
