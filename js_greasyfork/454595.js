// ==UserScript==
// @name         shareBuildings
// @version      1.1.3
// @description  automatically releases hospitals and cells in the alliance
// @author       DrTraxx and translated by Mibzzer15
// @match        https://www.missionchief.com/
// @grant        none
// @namespace https://greasyfork.org/users/981346
// @downloadURL https://update.greasyfork.org/scripts/454595/shareBuildings.user.js
// @updateURL https://update.greasyfork.org/scripts/454595/shareBuildings.meta.js
// ==/UserScript==
/* global $, user_id, I18n */

(async function () {
  'use strict';

  var aBuildings = [];
  var beds = [];
  var cells = [];

  async function loadApi() {

    aBuildings = await $.getJSON('/api/buildings');

    for (var i in aBuildings) {
      var e = aBuildings[i];
      if (e.building_type === 2) beds.push(e);
      if (e.building_type === 5 || e.building_type === 10) cells.push(e);
    }

    console.debug("aBuildings", aBuildings);
    console.debug("beds", beds);
    console.debug("cells", cells);
  }

  $("body")
    .prepend(`<div class="modal fade bd-example-modal-lg" id="shBuModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&#x274C;</span>
                          </button>
                          <h3 class="modal-title"><center>release buildings</center></h3>
                        </div>
                          <div class="modal-body" id="shBuModalBody">
                            <div class="form-check hidden">
                              <input class="form-check-input" type="checkbox" value="" id="shBuCheckShare">
                              <label class="form-check-label" for="shBuCheckShare">
                                release buildings
                              </label>
                            </div>
                            <select class="custom-select hidden" id="shBuSelPercentage" style="width:15em">
                              <option selected value="0">0 Percent</option>
                              <option value="1">10 Percent</option>
                              <option value="2">20 Percent</option>
                              <option value="3">30 Percent</option>
                              <option value="4">40 Percent</option>
                              <option value="5">50 Percent</option>
                            </select>
                            <br>
                            <br>
                            <div class="btn-group">
                              <a class="btn btn-primary" id="shBuShareCells">police stations</a>
                              <a class="btn btn-primary" id="shBuShareHospitals">hospitals</a>
                            </div>
                            <br>
                            <br>
                            <div class="hidden" id="shBuDivHospitals">
                              <h4>Hospitals:</h4>
                              <div class="progress">
                                <div class="progress-bar bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" id="shBuPrgsBeds"></div>
                              </div>
                            </div>
                            <div class="hidden" id="shBuDivCells">
                              <h4>police stations:</h4>
                              <div class="progress">
                                <div class="progress-bar bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" id="shBuPrgsCells"></div>
                              </div>
                            </div>
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Conclude</button>
                            <div class="pull-left">v ${GM_info.script.version}</div>
                          </div>
                    </div>
                  </div>`);

  $("ul .dropdown-menu[aria-labelledby='menu_profile'] >> a[href='/missionSpeed']")
    .parent()
    .after(`<li role="presentation"><a data-toggle="modal" data-target="#shBuModal" id="shBuOpenModal" style="cursor:pointer"><span class="glyphicon glyphicon-ok-sign"></span> release buildings</a></li>`);

  async function shareBuildings(array, modalElement) {
    var count = 0;

    for (var i in array) {
      count++;
      var percent = Math.round(count / array.length * 100);
      var e = array[i];
      modalElement
        .attr("aria-valuenow", count)
        .css({ "width": percent + "%" })
        .text(count + " / " + array.length.toLocaleString());
      if ($("#shBuCheckShare")[0].checked) {
        if (!e.is_alliance_shared) {
          await $.get("/buildings/" + e.id + "/alliance");
          //e.is_alliance_shared = true;
          aBuildings.filter((obj) => e.id === obj.id)[0].is_alliance_shared = true;
        }
        await $.get("/buildings/" + e.id + "/alliance_costs/" + $("#shBuSelPercentage").val());
      } else {
        if (e.is_alliance_shared) {
          await $.get("/buildings/" + e.id + "/alliance");
          //e.is_alliance_shared = false;
          aBuildings.filter((obj) => e.id === obj.id)[0].is_alliance_shared = false;
        }
      }
    }
  }

  $("body").on("click", "#shBuOpenModal", async function () {
    if (!$("#shBuCheckShare").parent().hasClass("hidden")) $("#shBuCheckShare").parent().addClass("hidden");
    beds.length = 0;
    cells.length = 0;
    await loadApi();
    $("#shBuPrgsBeds").attr("aria-valuemax", beds.length);
    $("#shBuPrgsCells").attr("aria-valuemax", cells.length);
    $("#shBuCheckShare").parent().removeClass("hidden");
  });

  $("body").on("click", "#shBuShareHospitals", function () {
    $("#shBuDivHospitals").removeClass("hidden");
    $("#shBuPrgsBeds")
      .attr("aria-valuenow", 0)
      .css({ "width": "0%" })
      .text("0 / " + beds.length.toLocaleString());
    shareBuildings(beds, $("#shBuPrgsBeds"));
  });

  $("body").on("click", "#shBuShareCells", function () {
    $("#shBuDivCells").removeClass("hidden");
    $("#shBuPrgsCells")
      .attr("aria-valuenow", 0)
      .css({ "width": "0%" })
      .text("0 / " + cells.length.toLocaleString());
    shareBuildings(cells, $("#shBuPrgsCells"));
  });

  $("body").on("click", "#shBuCheckShare", function () {
    if ($("#shBuCheckShare")[0].checked) {
      $("#shBuSelPercentage").removeClass("hidden");
    } else {
      $("#shBuSelPercentage").addClass("hidden");
    }
  });


})();
