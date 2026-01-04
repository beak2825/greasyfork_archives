// ==UserScript==
// @name     FMO Taktik Manager
// @description Erlaubt das Speichern und Laden von Taktiken in FMO.
// @namespace Swtrse
// @version  1
// @grant    none
// @run-at	 document-idle
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include  https://www.fussballmanager-online.net/earth/formation_tactic.tm*
// @include  https://www.fussballmanager-online.net/earth/formation_tactic_predefined.tm*
// @downloadURL https://update.greasyfork.org/scripts/39865/FMO%20Taktik%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/39865/FMO%20Taktik%20Manager.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

function saveSettings(i)
{
  var variableIncejtion = window.wrappedJSObject;
  var swtrse_predefinedTactics = variableIncejtion['predefined_tactics'];
  var saveString = "";
  for(var m in swtrse_predefinedTactics) //FUNKTIONIERT ZUM AUSLESEN
  {
    var predefinedTactic = swtrse_predefinedTactics[m];
    saveString += predefinedTactic.match_time + "|";
    saveString += predefinedTactic.lead_appliable + "|";
    saveString += predefinedTactic.tie_appliable + "|" + predefinedTactic.behind_appliable;
    for(var k in predefinedTactic.option_pairs)
    {
      var my_option_pair = predefinedTactic.option_pairs[k];
      saveString = saveString  + "|" + my_option_pair.name + "|" + my_option_pair.value;
    }
    saveString += "@";
  }
  var tkey = "tactic_" + i; 
  localStorage.setItem(tkey, saveString);
  //alert(saveString);
}

function loadSettings(i)
{
  var variableIncejtion = window.wrappedJSObject;
  var ChosenOption = variableIncejtion['ChosenOption'];
  var PredefinedTactic = variableIncejtion['PredefinedTactic'];
  var swtrse_predefined_tactics = variableIncejtion['predefined_tactics'];
  var offer_options_to_select = variableIncejtion['offer_options_to_select'];
  var pickup_predefined_tactic_option = variableIncejtion['pickup_predefined_tactic_option'];
  var switch_options_layer = variableIncejtion['switch_options_layer'];
	//  alert("LoadSettings");
  var tkey = "tactic_" + i;
  var loadString = localStorage.getItem(tkey);
  //alert(loadString);
  var toptions = loadString.split("@");
  for(var optIndex in toptions)
  {
    if(optIndex < 6)
    {
    	var optValue = toptions[optIndex];
      var detailValues = optValue.split("|");
      var matchTime = detailValues[0];
      var leadAppliable = detailValues[1];
      var tieAppliable = detailValues[2];
      var behindApplioable = detailValues[3];
      var my_predefined_options = new Array();
      
      eval("select_object = document.predefined_tactic_changes_form.record_" + optIndex + "_time;");
			for (var i = 0; i < select_object.length; i++) {
				if (select_object.options[i].value == matchTime){
					select_object.options[i].selected = true;
					break;
				}
			}
      eval("document.predefined_tactic_changes_form.record_" + optIndex + "_lead_appliable.checked=" + leadAppliable + ";");
      eval("document.predefined_tactic_changes_form.record_" + optIndex + "_tie_appliable.checked=" + tieAppliable + ";");
      eval("document.predefined_tactic_changes_form.record_" + optIndex + "_behind_appliable.checked=" + behindApplioable + ";");
      offer_options_to_select(optIndex);
      pickup_predefined_tactic_option(detailValues[4], detailValues[5], true);
      pickup_predefined_tactic_option(detailValues[6], detailValues[7], true);
      pickup_predefined_tactic_option(detailValues[8], detailValues[9], true);
      pickup_predefined_tactic_option(detailValues[10], detailValues[11], true);
      pickup_predefined_tactic_option(detailValues[12], detailValues[13], true);
      pickup_predefined_tactic_option(detailValues[14], detailValues[15], true);
      switch_options_layer(false);
//    	alert(optValue);
    }
  }
}

var htmlBlock = `
  <table>
		<tbody>
			<tr>
				<td style="text-align:center; border-right: 0px solid red;">
					<input id="gm_load1" class="submit_v3" style="text-align:center;margin:4px 0 0 0;" value="1. Taktik laden"/>
  			</td>
				<td style="text-align:center; border-right: 0px solid red;">
					<input id="gm_save1" class="submit_v3" style="text-align:center;margin:4px 0 0 0;" value="1. Taktik speichern"/>
  			</td>
			</tr>
			<tr>
 				<td style="text-align:center; border-right: 0px solid red;">
					<input id="gm_load2" class="submit_v3" style="text-align:center;margin:0;" value="2. Taktik laden"/>
  			</td>
				<td style="text-align:center; border-right: 0px solid red;">
					<input id="gm_save2" class="submit_v3" style="text-align:center;margin:0;" value="2. Taktik speichern"/>
  			</td>
  		</tr>
 			<tr>
				<td style="text-align:center; border-right: 0px solid red;">
					<input id="gm_load3" class="submit_v3" style="text-align:center;margin:0;" value="3. Taktik laden"/>
  			</td>
				<td style="text-align:center; border-right: 0px solid red;">
					<input id="gm_save3" class="submit_v3" style="text-align:center;margin:0;" value="3. Taktik speichern"/>
  			</td>
  		</tr>
  	</tbody>
  </table>
`;

$(".tabmat").after(htmlBlock);
$("#gm_save1").on("click", function(){ saveSettings(1); });
$("#gm_save2").on("click", function(){ saveSettings(2); });
$("#gm_save3").on("click", function(){ saveSettings(3); });
$("#gm_load1").on("click", function(){ loadSettings(1); });
$("#gm_load2").on("click", function(){ loadSettings(2); });
$("#gm_load3").on("click", function(){ loadSettings(3); });