// ==UserScript==
// @name         WME Add Uturns from node
// @version      0.1
// @description  Add uturns from node
// @author       ixxvivxxi
// @include      https://www.waze.com/editor/*
// @include      https://www.waze.com/*/editor/*
// @include      https://editor-beta.waze.com/editor/*
// @include      https://editor-beta.waze.com/*/editor/*
// @grant        none
// @namespace    https://greasyfork.org/ru/scripts/16950-wme-add-uturns-from-node

// @downloadURL https://update.greasyfork.org/scripts/16950/WME%20Add%20Uturns%20from%20node.user.js
// @updateURL https://update.greasyfork.org/scripts/16950/WME%20Add%20Uturns%20from%20node.meta.js
// ==/UserScript==

function Uturns_bootstrap()
{
	var bGreasemonkeyServiceDefined = false;

	try
	{
		if ("object" === typeof Components.interfaces.gmIGreasemonkeyService)
		{
			bGreasemonkeyServiceDefined = true;
		}
	}
	catch (err)
	{
		//Ignore.
	}
	if ( "undefined" === typeof unsafeWindow  ||  ! bGreasemonkeyServiceDefined)
	{
		unsafeWindow    = ( function ()
		{
			var dummyElem   = document.createElement('p');
			dummyElem.setAttribute ('onclick', 'return window;');
			return dummyElem.onclick ();
		} ) ();
	}
	/* begin running the code! */
	setTimeout(startUturns,999);
}
function startUturns() {

    Waze.selectionManager.events.register("selectionchanged", null, showButton);
    var wazeActionModifyConnection= require("Waze/Action/ModifyConnection")
  

    function showButton() {
        if(Waze.selectionManager.selectedItems.length == 0 || Waze.selectionManager.selectedItems.length > 1) return;
        if(Waze.selectionManager.selectedItems[0].model.type == "node") {

           $('.side-panel-section:first-child').append('<button id="addUturns" class="btn btn-default">add uturns</button>');
        }

    }

  $('#sidebar').on('click', '#addUturns', function(event) {
      var node = Waze.selectionManager.selectedItems[0].model;
      var segIDs = node.attributes.segIDs;
      
      for (var i = 0; i < segIDs.length; i++) {
          var segment = Waze.model.segments.objects[segIDs[i]];
          
          if (segment.attributes.fromNodeID == node.attributes.id) {
              console.log('А', segment.attributes.id);
              
              segment.attributes.fromConnections[segment.attributes.id] = true;
              Waze.model.actionManager.add(new wazeActionModifyConnection(segment.attributes.id, segment.getFromNode(), segment.attributes.id,segment.getFromNode()));
          } else {
              console.log('B', segment.attributes.id);
              segment.attributes.toConnections[segment.attributes.id] = true;
              Waze.model.actionManager.add(new wazeActionModifyConnection(segment.attributes.id, segment.getToNode(), segment.attributes.id, segment.getToNode()));
          }

      }

  });


}

Uturns_bootstrap();
