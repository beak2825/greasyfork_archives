// ==UserScript==
// @name			SINGULARITY'S Ship info
// @description		Adds transfer target, crew xp and hull mass to ship screen
// @author			(c) Singularity 2015
// @include			http://planets.nu/home
// @include			http://planets.nu/games/*
// @include			http://*.planets.nu/*
// @include			http://planets.nu/*
// @version			0.4.1
// @history         0.1 displayed crew xp
// @history         0.2 added ship mass
// @history         0.3 added beam transfer targets (foreign ships/planets)
// @history         0.4 renamed "Beam Transfer" to "Transfer". Added transfer detail. Added user settings.
// @history         0.4.1 Bug fix: dont show info on surveyShip (if shipScreen is also open)

// @namespace       https://greasyfork.org/en/users/15085-singularity
// @downloadURL https://update.greasyfork.org/scripts/12300/SINGULARITY%27S%20Ship%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/12300/SINGULARITY%27S%20Ship%20info.meta.js
// ==/UserScript==


function wrapper () { // wrapper for injection

	if (vgap.version < 3) {
		console.log("Ship Info needs Nu version 3 or above");
		return;
	}

	//User settings
	var showCrewXP = true;
	var showHullMass = true;
	var showTransfer = true;
	var showTransferDetail = true;     //set if you want "N0 D0 T0 M0 S0 C0" type detail added to transfers

	
	//plugin code
	var plugin = {
		
		draw: function() {

			try {
				//Try adding Ship info to the shipscreen. Briefly throws an exception during time machine use.

				if (vgap.shipScreenOpen) {
					var ship= vgap.shipScreen.ship;

					//Add crew experience
					if (showCrewXP)
						$('#ShipStatus td:contains("Crew:")').text('Crew: ('+ship.experience+' xp)');

					//Add hull mass
					if (showHullMass)
						$('#ShipStatus td:contains("Damage:")').text('Damage: ('+vgap.shipScreen.hull.mass+' kt)');

					//Add foreign transfer target
					if (showTransfer) {
						if ($('#TransferInfo').length === 0) //add TransferInfo html
							$('#ShipCargo').append("<br><div id='TransferInfo'></div><div id='TransferInfo2'></div>");

						//Update the TransferInfo
						var xferType= ship.transfertargettype;
						var xferID= ship.transfertargetid;
						var xferInProgress= CheckForXfers(ship);

						var xferText= "Transfer: None";

						if (xferType === 1 && xferInProgress)  //beaming to foreign planet
							xferText= "Transfer to Planet ("+vgap.getPlanet(xferID).name+")";

						if (xferType === 2 && xferInProgress) //beaming to foreign ship
							xferText= "Transfer to Ship ("+xferID+": "+vgap.getShip(xferID).name+")";

						$('#TransferInfo').text(xferText);

						//Add transfer detail
						if (showTransferDetail && xferType>0 && xferInProgress) {
							var xferText2=">";
							if (ship.transferneutronium>0) xferText2+= "N"+ship.transferneutronium+" ";
							if (ship.transferduranium>0) xferText2+= "D"+ship.transferduranium+" ";
							if (ship.transfertritanium>0) xferText2+= "T"+ship.transfertritanium+" ";
							if (ship.transfermolybdenum>0) xferText2+= "M"+ship.transfermolybdenum+" ";
							if (ship.transfersupplies>0) xferText2+= "S"+ship.transfersupplies+" ";
							if (ship.transferclans>0) xferText2+= "C"+ship.transferclans;

							$('#TransferInfo2').text(xferText2);
						}//if showTransferDetail
						
					}// if showTransfer

				} //if ShipScreen open
			} //try
			catch(err) {
				console.log("exception in Ship Info draw()");
			}//catch

		}, //draw

	}; //plugin

	
	function CheckForXfers(ship) {
		if (ship.transferammo === 0 &&
			ship.transfersupplies === 0 &&
			ship.transferclans === 0 &&
			ship.transferneutronium === 0 &&
			ship.transferduranium === 0 &&
			ship.transfertritanium === 0 &&
			ship.transfermolybdenum === 0) return false;

		return true;
	} //CheckForXfers


	// register your plugin with NU
	vgap.registerPlugin(plugin, "ShipInfo");


} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);    