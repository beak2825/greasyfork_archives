// ==UserScript==
// @name         cgcom-interno.vuds-omc.es website scraper
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Scrapes the website in csv format
// @author       You
// @match        https://cgcom-interno.cgcom.es/RegistroMedicos/PUBBusquedaPublica_busqueda.action
// @downloadURL https://update.greasyfork.org/scripts/527179/cgcom-internovuds-omces%20website%20scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/527179/cgcom-internovuds-omces%20website%20scraper.meta.js
// ==/UserScript==

function parseTab() {
    return new Promise((resolve) => {
        var checkExist = setInterval(() => {
            if($("[id^=tabBusqueda_] > table > tbody > tr > td:last-child").length) {
                clearInterval(checkExist);

                var row = "";

                $("[id^=tabBusqueda_] > table > tbody > tr > td:last-child").each(function() {
                    // This accounts for multiple items in a field (i.e. Specialties)
                    row += '"' + this.innerHTML.trim().replace(/(<br>)+/g, ";").replace(/;$/, "").replace(/<!--(.)+-->/g, '').replace(/"/g, "").trim() + '",';
                });

                // Sometimes there's an extra field in the table, so add it as blank if it doesn't exist
                if($("[id^=tabBusqueda_] > table > tbody > tr > td:last-child").length === 6) {
                    row += '""';
                }
                else {
                    row = row.substring(0, row.length - 1);
                }

                // Close the tab
                $("[id^=botonCerrar_tabBusqueda_]").click();

                resolve(row);
            }
        }, 100); // check every 100ms
    });
}

function waitLoading() {
    return new Promise((resolve) => {
        var checkExist = setInterval(() => {
            if(!$(".blockUI").length) {
                clearInterval(checkExist);

                resolve();
            }
        }, 100); // check every 100ms
    });
}

function downloadResultSet(resultSet, provIndex) {
    return new Promise((resolve) => {
        var results = ['"Colegiado","Nombre","Provincia","Especialidad","Estado","DireccionTrabajo","ValidaciónPeriódicaColegiación"'];

        results = results.concat(resultSet);

        let csvContent = "";
        results.forEach(function(line){
            var lines = line.split(',');
            lines[6] = lines[6].replace(/[\n]/g, ";");
            line = lines.join(',');
            var cleaned = line.replace(/[\n\t]/g, " ").replace(/[ ]+/g, " ");
            csvContent += cleaned + "\r\n";
        });

        // Need to create a Blob because of size of content
        var blob = new Blob([csvContent], {encoding:"UTF-8", type:"text/plain;charset=UTF-8"});
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = `cgcom_raw_${provIndex}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        results = [];

        resolve();
    });
}

// Ripped from original website to remove the setTimeout capatcha refresh
var myBuscar = function myBuscar() {
    $("#numeroColegiadoDetalle").val(null);
    $("#pagina").val(1);

    var idForm = "formBuscarColegiados";
    var action = "PUBBusquedaPublica_busqueda_ajax.action";
    var idCapaContenido = "resultadoBusquedaColegiados";
    enviarFormAjax(idForm, action, idCapaContenido, true);
    //setTimeout(function(){$("#recalcularImg").attr("src",$("#contextUrl").val()+"/Captcha.png?"+Date.now());},500);
    //console.log($("#contextUrl").val()+"/Captcha.png?"+Date.now());
};

function initializeForm() {
    $("#busquedaPublicaColegiadoBuscar").removeAttr('onclick').bind( "click", myBuscar);

    $("#contenidoPublico")
        .before("<span class='wrapAll' id='idProvidences' style='margin-left: 5px;'></span>")
        .before("<span class='wrapAll' id='idPages' style='margin-left: 20px;'></span>")
        .before("<span class='wrapAll' id='idResults' style='margin-left: 20px;'></span><br class='wrapAll'>")
        .before("<span class='wrapAll'>Province Scrape Range.... Start</span><input id='txtStartProvIndex' class='wrapAll' style='margin-right: 10px;' type='text'><span class='wrapAll'>End</span><input id='txtEndProvIndex' class='wrapAll' type='text'><br class='wrapAll'>")
        .before("<span class='wrapAll'>Start at Page:</span><input id='txtStartPage' class='wrapAll' style='margin-right: 10px;' type='text'>")
        .before("<span class='wrapAll'>End at Page:</span><input id='txtEndPage' class='wrapAll' style='margin-right: 10px;' type='text'>");

    $( ".wrapAll" ).wrapAll( "<div style='position: absolute; right: 100px; top: 100px;' />");

    $("#comboProvincia").children().eq(1).attr('selected', true);

    $("#txtStartProvIndex").change(() => {
        $("#comboProvincia").children().eq($("#txtStartProvIndex").val()).attr('selected', true);
    });
}

(() => {
    'use strict';

    initializeForm();

    $("#txtStartProvIndex").val(1);
    $("#txtEndProvIndex").val($("#comboProvincia").children().length);
    $("#txtStartPage").val("1");

    // Set default values
    $("#Nombre").val("%");
    $("#Apellido1").val("%");

    $("#codigoCaptcha").focus();

    var firstRun = true;

    $("#busquedaPublicaColegiadoBuscar").click(async () => {
        await waitLoading();

        var provIndex = parseInt($("#txtStartProvIndex").val() || 1);
        var provStopIndex = parseInt($("#txtEndProvIndex").val() || $("#comboProvincia").children().length);

        // This code is only ran once
        if(firstRun) {
            // Set the page
            document.getElementById('formBuscarColegiados').pagina.value = parseInt($("#txtStartPage").val());
            buscarPagina();

            await waitLoading();

            firstRun = false;
        }


        if(provIndex <= provStopIndex) {
            var pagesLeft = true;
            var results = [];

            do {

                var providencesLeft = provStopIndex - provIndex;

                $("#idProvidences").text("Provinces left: " + providencesLeft);
                $("#idPages").text("Pages: " + $(".this-page").text() + " / " + $("a.enlacePaginacion:nth-last-child(2)").text());

                var images = $("table.resultados > tbody  > tr > td:last-child > img");

                for(var i = 0; i < images.length; i++) {
                    if($(images[i]).parent().siblings(':first').text() === '') {
                        // Skip blank ids which cause errors
                        continue;
                    }

                    $(images[i]).click();

                    var row = await parseTab();

                    results.push(row);

                    var resultString = "Records Collected: " + results.length;

                    $("#idResults").text(resultString);

                 //   console.log(row);
                };

                images = null;

                if($("a.enlacePaginacion:last").text() === "Siguiente" && ( $("#txtEndPage").val() === "" || $(".this-page").text() != $("#txtEndPage").val() ) ) {
                    // Go to the next page
                    pagesLeft = true;
                    $("a.enlacePaginacion:last")[0].click();
                    await waitLoading();
                }
                else {
                    pagesLeft = false;
                }
            } while (pagesLeft);

            // Download the results
            await downloadResultSet(results, provIndex);

            // Current result set has finished
            provIndex += 1;

            results = [];

            if(provIndex <= provStopIndex) {
                $("#txtStartProvIndex").val(provIndex);
                $("#comboProvincia").children().eq(provIndex).attr('selected', true);
                $("#busquedaPublicaColegiadoBuscar").click();

                await waitLoading();
            }
       }
    });

})();


