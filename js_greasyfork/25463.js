// ==UserScript==
// @name			SINGULARITY'S Cross beam
// @description		Allows a ship to beam from planet to foreign ship directly
// @author			Singularity
// @include			http://planets.nu/home
// @include			http://planets.nu/games/*
// @include			http://*.planets.nu/*
// @include			http://planets.nu/*
// @version			0.5
// @namespace https://greasyfork.org/users/15085
// @downloadURL https://update.greasyfork.org/scripts/25463/SINGULARITY%27S%20Cross%20beam.user.js
// @updateURL https://update.greasyfork.org/scripts/25463/SINGULARITY%27S%20Cross%20beam.meta.js
// ==/UserScript==

//History

//v0.1    Experimental Cross beam app. Works for NDTMSC. Button is buggy.
//v0.2    Fixed bug: Ships in deep space could not open shipscreen.
//v0.3    Fixed bug: Now correctly targets foreign ships, not just highest ID foreign ship.
//        Added: "Changed Target" warning added. Cargo in old beam now dropped to surface.
//        Updated: crossBeamTarget() now more consistant with other code
//v0.3.1  Updated: lets you overload target cargo bay to destroy cargo
//v0.3.2  Updated: lets you overload target fuel tank to destroy fuel
//v0.4    Optimised transfer() code
//v0.5    Horwasp fixes


//To-do:
//Toggle overload beam on/off??


function wrapper () { // wrapper for injection

	if (vgap.version < 3) {
		console.log("Cross beam needs Nu version 3 or above");
		return;
	}//if


	//Can't beam cargo to Horwasp ships/pods
	var horwaspHulls = [115, 117, 118, 119, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211];


	var plugin = {
		draw: function() {

			//check for possible crossbeam
			if (vgap.shipScreenOpen && !$("#CrossBeamButton").length) {

				var ships= vgap.shipScreen.ships;
				var planet= vgap.shipScreen.planet;
				var me= vgap.player.id;


				//are we over one of my planets with other ships?
				if (!defined(planet) || planet.ownerid !== me || ships.length===1)
					return;


				//check for valid foreign targets
				for (var i = 0; i < ships.length; i+=1) {
					var ship= ships[i];

					//exclude my ships
					if (ship.ownerid === me)
						continue;


					//exclude Horwasp hulls
					var validTarget= true;
					for (var wasp=0; wasp<horwaspHulls.length; wasp+=1) {
						var waspHull= horwaspHulls[wasp];

						if (ship.hullid === waspHull) {
							validTarget= false;
							break;
						}//if

					}//for
					if (!validTarget)
						continue;


					//add cross beam button
					var html = '<input name="CrossBeamButton" id="CrossBeamButton" type="button" class="SepButton" value="Cross Beam">';
					$('#ShipCargo').append(html);
					$('#CrossBeamButton').click( function(event) { crossBeamTarget(); } );
					return; 

				}//for

			}//if

		},//draw

	};//plugin


	function crossBeamTarget () {

		var viaShip= vgap.shipScreen.ship;
		var ships= vgap.shipScreen.ships;
		var fromPlanet= vgap.shipScreen.planet;
		var me= vgap.player.id;

		vgap.more.empty();

		$("<div id='SelectLocation'><h1>" + nu.t.selecttransfertarget + "</h1></div>").appendTo(vgap.more);
		vgap.transferScreen.onchange = function () {

			vgap.shipScreen.screen.refresh();
			vgap.loadWaypoints();
			vgap.map.draw();
		};


		var count= 0;
		var toShip= null; //keep track of the last foreign ship in case we only have one

		for (var i = 0; i < ships.length; i+=1) {
			var ship= ships[i];

			//ignore my ships
			if (ship.ownerid === me)
				continue;


			//ignore Horwasp hulls
			var validTarget= true;
			for (var wasp=0; wasp<horwaspHulls.length; wasp+=1) {
				var waspHull= horwaspHulls[wasp];

				if (ship.hullid === waspHull) {
					validTarget= false;
					break;
				}//if

			}//for
			if (!validTarget)
				continue;


			//add ship to list of possible targets
			count+=1;
			toShip= ship;

			var select = function (viaShipID, toShipID, fromPlanetID) {
				return function () {    crossBeam(viaShipID, toShipID, fromPlanetID);    };
			};

			$(shtml.shipTransferView(ships[i])).tclick(select(viaShip.id, toShip.id, fromPlanet.id)).appendTo("#SelectLocation");

		}//for

		shtml.moreBack();

		if (count === 1) {
			crossBeam(viaShip.id, toShip.id, fromPlanet.id);
			return;
		}//if


		vgap.showMore(340);
		if ($("#SelectLocation").height() > ($(window).height() - 100))
			$("#SelectLocation").height($(window).height() - 100);

		$("#SelectLocation").jScrollPane();

		vgap.action();
	}//crossBeamTarget




	function crossBeam(viaShipID, toShipID, fromPlanetID) {

		var viaShip= vgap.getShip(viaShipID);
		var toShip= vgap.getShip(toShipID);
		var fromPlanet = vgap.getPlanet(fromPlanetID);
		var hulldata= vgap.getHull(toShip.hullid);
		var rightCargo= hulldata.cargo;
		var rightFueltank= hulldata.fueltank;
		

		//check for warning
		var warning= "";
		var beamInProgress= (sumCargoBeam(viaShip) || viaShip.transferneutronium);

		if (beamInProgress && (viaShip.transfertargetid != toShipID || viaShip.transfertargettype != 2)) {

			//give warning
			warning =  "<br/>Warning: You have changed transfer target.&nbsp";
			warning += "You can only transfer to one foreign ship or planet per turn, or jettison.&nbsp";
			warning += "Any jettison or transfer you were doing to another foreign ship or planet has been cancelled.<br/>";

			//cancel old beam transfer by dropping cargo to the surface
			fromPlanet.neutronium+= viaShip.transferneutronium;
			fromPlanet.duranium+= viaShip.transferduranium;
			fromPlanet.tritanium+= viaShip.transfertritanium;
			fromPlanet.molybdenum+= viaShip.transfermolybdenum;
			fromPlanet.supplies+= viaShip.transfersupplies;
			fromPlanet.clans+= viaShip.transferclans;

			viaShip.transferneutronium= 0;
			viaShip.transferduranium= 0;
			viaShip.transfertritanium= 0;
			viaShip.transfermolybdenum= 0;
			viaShip.transfersupplies= 0;
			viaShip.transferclans= 0;
		}//if


		//initiate new transfer
		viaShip.transfertargettype= 2;
		viaShip.transfertargetid= toShip.id;
		viaShip.changed= 1;
		toShip.changed= 1;
		fromPlanet.changed= 1;


		//make screen
		var html = "<div id='TransferScreen'>";
		html += "<h1>Cross beam</h1>";
		html += "<table width='100%' class='TransferTitle'><tr><td>" + fromPlanet.id + ": " + fromPlanet.name + "</td>";
		html += "<td style='padding: 0 0 0 20px;text-align:right;'>" + toShip.id + ": " + toShip.name + "</td></tr></table>";
		
		html += "<table width='100%'>";
		html += "<tr><td>Neutronium: </td><td class='TransferVal'>" + fromPlanet.neutronium + "</td>";
		html += "<td></td><td><div id='NeutroniumTransfer'></div></td><td class='TransferVal'>" + viaShip.transferneutronium + "</td>";
		html += "<td class='valsup'>/" + rightFueltank + "</td></tr>";

		html += "<tr><td>Duranium: </td><td class='TransferVal'>" + fromPlanet.duranium + "</td>";
		html += "<td></td><td><div id='DuraniumTransfer'></div></td>";
		html += "<td class='TransferVal'>" + viaShip.transferduranium + "</td><td class='valsup'></td></tr>";

		html += "<tr><td>Tritanium: </td><td class='TransferVal'>" + fromPlanet.tritanium + "</td>";
		html += "<td></td><td><div id='TritaniumTransfer'></div></td>";
		html += "<td class='TransferVal'>" + viaShip.transfertritanium + "</td><td class='valsup'></td></tr>";


		html += "<tr><td>Molybdenum: </td><td class='TransferVal'>" + fromPlanet.molybdenum + "</td>";
		html += "<td></td><td><div id='MolybdenumTransfer'></div></td>";
		html += "<td class='TransferVal'>" + viaShip.transfermolybdenum + "</td><td class='valsup'></td></tr>";

		if (vgap.player.raceid !== 12) {
			html += "<tr><td>Supplies: </td><td class='TransferVal'>" + fromPlanet.supplies + "</td>";
			html += "<td></td><td><div id='SuppliesTransfer'></div></td>";
			html += "<td class='TransferVal'>" + viaShip.transfersupplies + "</td><td class='valsup'></td></tr>";
		}//if

		html += "<tr><td>Clans: </td><td class='TransferVal'>" + fromPlanet.clans + "</td>";
		html += "<td></td><td><div id='ClansTransfer'></div></td>";
		html += "<td class='TransferVal'>" + viaShip.transferclans + "</td><td class='valsup'></td></tr>";

		html += "<tr><td></td><td></td><td></td>";
		html += "<td class='TransferTotalText'>Total:</td><td class='TransferVal'>" + sumCargoBeam(viaShip) + "</td>";
		html += "<td class='valsup'>/" + rightCargo + "</td></tr>";
		html += "</table>";
		
		html += "<div class='NeutralText'>" + warning + "</div>";
		html += "</div>";


		vgap.more.empty();
		$(html).appendTo(vgap.more);

		$("<a class='MoreBack'>OK</a>").tclick(function () {
			vgap.loadWaypoints();
			vgap.map.draw();
			vgap.closeMore();
			return false;
		}).appendTo(vgap.more);


		$("#NeutroniumTransfer").leftRight(function (change) { transfer("neutronium", change, viaShip, toShip, fromPlanet); }, 1000);
		$("#DuraniumTransfer").leftRight(function (change) { transfer("duranium", change, viaShip, toShip, fromPlanet); }, 1000);
		$("#TritaniumTransfer").leftRight(function (change) { transfer("tritanium", change, viaShip, toShip, fromPlanet); }, 1000);
		$("#MolybdenumTransfer").leftRight(function (change) { transfer("molybdenum", change, viaShip, toShip, fromPlanet); }, 1000);
		$("#SuppliesTransfer").leftRight(function (change) { transfer("supplies", change, viaShip, toShip, fromPlanet); }, 1000);
		$("#ClansTransfer").leftRight(function (change) { transfer("clans", change, viaShip, toShip, fromPlanet); }, 1000);

		vgap.showMore(580);
		vgap.save();
	}//crossBeam




	function transfer(type, change, viaShip, toShip, fromPlanet) {

		var transferType= "transfer"+type;

		//planet to ship: maximum is what is on surface
		if (change > 0 && fromPlanet[type] < change)
			change = fromPlanet[type];

		//ship to planet: maximum is what is on ship
		if (change < 0 && viaShip[transferType] < Math.abs(change))
			change = -1 * viaShip[transferType];

		/*
		//dont beam more than receiving ship can hold
		if (type==="neutronium") {
			var toShipfueltank= vgap.getHull(toShip.hullid).fueltank;
			if (change + viaShip[transferType] > toShipfueltank)
				change= toShipfueltank- viaShip[transferType];

		} else
			change = checkTotalRight(change, viaShip, toShip);
		*/

		//make it so!
		fromPlanet[type] -= change;
		viaShip[transferType] += change;
		crossBeam(viaShip.id, toShip.id, fromPlanet.id);

	}//transfer



	function checkTotalRight (change, viaShip, toShip) {

		var totalCargo= sumCargoBeam(viaShip);
		var cargoSize= vgap.getHull(toShip.hullid).cargo;

		if ((totalCargo + change) > cargoSize)
			change= cargoSize - totalCargo;

		return change;
	}//checkTotalRight



	function sumCargoBeam(ship) {
		//add up cargo in transfer beam

		var total= 0;
		total+= ship.transferduranium;
		total+= ship.transfertritanium;
		total+= ship.transfermolybdenum;
		total+= ship.transfersupplies;
		total+= ship.transferclans;
		total+= ship.transferammo;

		return total;
	}//sumCargoBeam


	function isNull(variable) {
		if(variable === null && typeof variable === "object")
			return true;
		else
			return false;
	}//isNull


	function defined(variable) {
		if (typeof variable !== 'undefined')
			return true;
		else
			return false;
	}//defined


	// register your plugin with Nu
	vgap.registerPlugin(plugin, "Cross beam");


} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";
document.body.appendChild(script);