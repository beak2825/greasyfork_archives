// ==UserScript==
// @name         destroyVehicles
// @version      1.0.2
// @description  send selected vehicles to the scrap heap
// @author       DrTraxx and translate by Mibzzer15
// @match        https://*www.missionchief.com/buildings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @grant        none
// @namespace https://greasyfork.org/users/981346
// @downloadURL https://update.greasyfork.org/scripts/454594/destroyVehicles.user.js
// @updateURL https://update.greasyfork.org/scripts/454594/destroyVehicles.meta.js
// ==/UserScript==
/* global $ */

(function () {
    'use strict';

    const arrDestroyVehicles = [],
        tableVehicleRows = $("#vehicle_table > tbody > tr");

    $("a[href*='/vehicles/new']:first").after(`<a class="btn btn-xs btn-danger" id="dump_vehicles">scrap selected vehicles</a>`);

    $("#vehicle_table > thead > tr")
        .append(`<th data-column="4" class="tablesorter-header sorter-false tablesorter-headerUnSorted" tabindex="0" scope="col" role="columnheader" aria-disabled="true" unselectable="on" style="user-select: none;" aria-sort="none">
                   <div class="tablesorter-header-inner">destroy</div>
                 </th>`);

    for (var i = 0; i < tableVehicleRows.length; i++) {
        const v = tableVehicleRows[i],
            vehicleId = +$(v).children("td[sortvalue]")[0].firstElementChild.attributes.href.value.replace(/\D+/g, "");

        $(v).append(`<td class="mark_vehicle" style="cursor:pointer;">
                       <input type="checkbox" class="form-check-input" id="check_${ vehicleId }">
      
                     </td>`);
    }

    $("body").on("click", ".mark_vehicle", function () {
        const vehicleId = +$(this).children("input").attr("id").replace(/\D+/g, ""),
            index = arrDestroyVehicles.indexOf(vehicleId);
        if (index === -1) {
            arrDestroyVehicles.push(vehicleId);
            $(`#check_${ vehicleId }`)[0].checked = true;
        } else {
            arrDestroyVehicles.splice(index, 1);
            $(`#check_${ vehicleId }`)[0].checked = false;
        }
    });

    $("body").on("click", "#dump_vehicles", async function () {
        if (arrDestroyVehicles.length === 0) {
            alert("You have to select vehicles to scrap!");
            return;
        }
        if (confirm(`Do you want the ${ arrDestroyVehicles.length } Do you really scrap vehicles?`) === true) {
            for (var p in arrDestroyVehicles) {
                const kernschrott = arrDestroyVehicles[p];
                $("#dump_vehicles").text(`Scrap vehicle ${ +p + 1 } von ${ arrDestroyVehicles.length }!`);
                await $.post(`/vehicles/${ kernschrott }`, { "_method": "delete", "authenticity_token": $("meta[name=csrf-token]").attr("content") });
            }
            window.location.reload();
        }
    });

})();
