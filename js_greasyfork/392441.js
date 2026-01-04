// ==UserScript==
// @name         WME Persian Character Helper
// @namespace    https://www.waze.com/user/editor/B4ckTrace
// @version      1.1
// @description  Helps in writing Persian characters
// @author       B4ckTrace
// @include      https://www.waze.com/*/editor*
// @include      https://www.waze.com/editor*
// @include      https://beta.waze.com/*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392441/WME%20Persian%20Character%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/392441/WME%20Persian%20Character%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
	function bootstrap(tries) {
        tries = tries || 1;

        if (W &&
			W.map &&
            W.model &&
			W.loginManager.user &&
            $
			) {
            init();
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    function init()
    {
        console.log("*** WME Persian Character Helper initialized ***");

		W.selectionManager.events.register("selectionchanged", null, Helper);
		// Action on zoom end
		W.map.events.register("zoomend", null, Helper);
	}

	function Helper()
	{
		var SelectedItem = Waze.selectionManager.getSelectedFeatures();
		if (SelectedItem.length == 1) // Check only one segment is selected
		{
			switch (SelectedItem[0].model.type)
			{
				case 'segment':
				break;

				case 'venue':
					var name_box = document.getElementsByName("name")[0];
					var aliases_view = document.getElementsByClassName("aliases-view")[0];
					var myEle = document.getElementById("name_box_btn");
					if(myEle){
						break;
					}

					name_box.style.display = "inline-block";
					name_box.style.width = "93%";
					var btn = document.createElement("DIV");
					btn.innerHTML = '<i class="fa fa-keyboard-o" style="cursor: pointer;"></i>';
					btn.style.display = "inline-block";
					btn.id = "name_box_btn";
					btn.onclick = Sanitize;
					// btn.setAttribute("onclick", "Sanitize("+name_box+");");

					aliases_view.parentNode.insertBefore(btn, aliases_view);

					break;
			}
		}
	}
	function cleanUp(str)
	{
		return str
			.replace(/0/g,"۰")
			.replace(/1/g,"۱")
			.replace(/2/g,"۲")
			.replace(/3/g,"۳")
			.replace(/4/g,"۴")
			.replace(/٤/g,"۴") // Arabic
			.replace(/5/g,"۵")
			.replace(/٥/g,"۵") // Arabic
			.replace(/6/g,"۶")
			.replace(/7/g,"۷")
			.replace(/8/g,"۸")
			.replace(/9/g,"۹")
	}
	function Sanitize()
	{
		var name_box = document.getElementsByName("name")[0];
		var name = name_box.value;
		var sanitized_value = cleanUp(name);
		if (name == sanitized_value)
			return;
		name_box.value = sanitized_value;
		let obj = WazeWrap.getSelectedFeatures()[0].model;
		var WazeActionUpdateObject = require("Waze/Action/UpdateObject");
		W.model.actionManager.add(new WazeActionUpdateObject(obj, {name: sanitized_value}));
	}

	bootstrap();
})();