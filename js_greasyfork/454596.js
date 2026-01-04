// ==UserScript==
// @name         staff assistant
// @version      1.4.5
// @description  Select advertising phases and personnel target in the building overview
// @author       DrTraxx and translated by Mibzzer15
// @match        https://*www.missionchief.com/buildings/*
// @grant        none
// @namespace https://greasyfork.org/users/981346
// @downloadURL https://update.greasyfork.org/scripts/454596/staff%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/454596/staff%20assistant.meta.js
// ==/UserScript==
/* global $, user_premium */

(async function() {
        'use strict';

        var buildingId = window.location.pathname.replace(/\D+/g, '');
        var hireStart = `<div class="alert fade in alert-success "><button class="close" data-dismiss="alert" type="button">×</button>The recruitment phase has started.</div>`;
        var hireEnd = `<div class="alert fade in alert-success "><button class="close" data-dismiss="alert" type="button">×</button>The recruitment phase has ended.</div>`;
        var hire = false;
        var cssHide = { "display": "none" };
        var cssShow = { "display": "inline" };
        var building = await $.getJSON("/api/buildings/" + buildingId);
        var noPersonalBuildings = [1, 2, 4, 7, 9, 10, 19, 24];

        if (building.hiring_automatic === true || building.hiring_phase > 0) hire = true;
        if (noPersonalBuildings.includes(building.building_type)) return false;
        $(".breadcrumb")
            .append(`<div class="btn-group input-group pull-right" style="right:15em">
                   <a id="hire_do_1" class="btn btn-default btn-xs" style="display:${ !hire ? `inline` : `none` }">1 Day</a>
                   <a id="hire_do_2" class="btn btn-default btn-xs" style="display:${ !hire ? `inline` : `none` }">2 Days</a>
                   <a id="hire_do_3" class="btn btn-default btn-xs" style="display:${ !hire ? `inline` : `none` }">3 Days</a>
                   <a id="hire_do_0" class="btn btn-danger btn-xs" style="display:${ hire ? `inline` : `none` }">cancel the setting phase</a>
                   <a id="hire_do_automatic" class="btn btn-default btn-xs" style="display:${ user_premium && !hire ? `inline` : `none` }">automatically</a>
                   <input class="numeric integer optional form-control" type="number" value="${ building.personal_count_target }" id="setPersonal" style="width:5em;height:22px">
                   <a id="savePersonal" class="btn btn-success btn-xs">Save</a>
                 </div>`);

    $("body").on("click", "#hire_do_1", async function () {
        await $.get(`/buildings/${ buildingId }/hire_do/1`);
        $('h1').parent().before(hireStart);
        $('#hire_do_1').css(cssHide);
        $('#hire_do_2').css(cssHide);
        $('#hire_do_3').css(cssHide);
        $('#hire_do_automatic').css(cssHide);
        $('#hire_do_0').css(cssShow);
    });

    $("body").on("click", "#hire_do_2", async function () {
        await $.get(`/buildings/${ buildingId }/hire_do/2`);
        $('h1').parent().before(hireStart);
        $('#hire_do_1').css(cssHide);
        $('#hire_do_2').css(cssHide);
        $('#hire_do_3').css(cssHide);
        $('#hire_do_automatic').css(cssHide);
        $('#hire_do_0').css(cssShow);
    });

    $("body").on("click", "#hire_do_3", async function () {
        await $.get(`/buildings/${ buildingId }/hire_do/3`);
        $('h1').parent().before(hireStart);
        $('#hire_do_1').css(cssHide);
        $('#hire_do_2').css(cssHide);
        $('#hire_do_3').css(cssHide);
        $('#hire_do_automatic').css(cssHide);
        $('#hire_do_0').css(cssShow);
    });

    $("body").on("click", "#hire_do_automatic", async function () {
        await $.get(`/buildings/${ buildingId }/hire_do/automatic`);
        $('h1').parent().before(hireStart);
        $('#hire_do_1').css(cssHide);
        $('#hire_do_2').css(cssHide);
        $('#hire_do_3').css(cssHide);
        $('#hire_do_automatic').css(cssHide);
        $('#hire_do_0').css(cssShow);
    });

    $("body").on("click", "#hire_do_0", async function () {
        $.get(`/buildings/${ buildingId }/hire_do/0`);
        $('h1').parent().before(hireEnd);
        $('#hire_do_1').css(cssShow);
        $('#hire_do_2').css(cssShow);
        $('#hire_do_3').css(cssShow);
        $('#hire_do_automatic').css(cssShow);
        $('#hire_do_0').css(cssHide);
    });

    $("body").on("click", "#savePersonal", async function () {
        var value = $('#setPersonal').val();
        if (!value || value < 0 || value > 300) alert("Please enter a number between 0 and 300.");
        else {
            await $.post('/buildings/' + buildingId + '?personal_count_target_only=1', { "building": { "personal_count_target": value }, "_method": "put", "authenticity_token": $("meta[name=csrf-token]").attr("content") });
        }
        window.location.reload();
    });

})();
