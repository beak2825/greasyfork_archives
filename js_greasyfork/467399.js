// ==UserScript==
// @name         Synoptic Design 外掛
// @namespace    https://gsrcg.com
// @version      0.1
// @description  Synoptic Plugin
// @author       Wei
// @match        https://synoptic.design/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=synoptic.design
// @grant        none
// @resource     customCSS https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css
// @require      https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/467399/Synoptic%20Design%20%E5%A4%96%E6%8E%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/467399/Synoptic%20Design%20%E5%A4%96%E6%8E%9B.meta.js
// ==/UserScript==


(function() {
  var divApp = $(`
    <div id="myPlan" style="position: relative;height: auto;display: flex;justify-content: space-between;">
      <div class="form-group">
        <label for="factory">廠區：</label> <br/>
        <select class="form-control" id="factory">
          <option>1100</option>
          <option>1200</option>
          <option>1300</option>
        </select>
      </div>
      <div class="form-group">
        <label for="building">棟別：</label>
        <input type="text" class="form-control txt" id="building" name="building">
      </div>

      <div class="form-group">
        <label for="floor">樓層：</label>
        <input type="text" class="form-control txt" id="floor" name="floor">
      </div>

      <div class="form-group">
        <label for="area">AREA：</label>
        <input type="text" class="form-control txt" id="area" name="area">
      </div>

      <div class="form-group">
        <label for="area">ZONE：</label>
        <input type="text" class="form-control txt" id="zone" name="zone">
      </div>
      <button
        @click="applyValues"
        type="submit"
        class="btn btn-primary"
        style="width: 130px;
	  		height: 30px;
  			display: flex;
  			align-items: center;
  			justify-content: center;"
       >帶入</button>
       <button
        @click="clearValues"
        type="submit"
        class="btn btn-primary"
        style="width: 130px;
	  		height: 30px;
  			display: flex;
  			align-items: center;
  			justify-content: center;"
       >清除</button>
  </div>`);


  $(".description").append(divApp);

  var app = new Vue({
    el: "#myPlan",
    data: {},
    methods: {
      applyValues: function() {
        var factory = $("#factory").val();
        var building = $("#building").val();
        var floor = $("#floor").val();
        var area = $("#area").val();
        var zone = $("#zone").val();

        var txt = `${factory}${building}${floor}${area}${zone}`;

        $('#shapes > aside > div > input.title.txt').each((idx, item)=> {
            if ($(item).val() === "") {
              $(item).val(txt);
            }
        })
      },
      clearValues: function() {
        $("#factory").val("");
        $("#building").val("");
        $("#floor").val("");
        $("#area").val("");
        $("#zone").val("");
      }
    }
  });
})();
