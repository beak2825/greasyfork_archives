// ==UserScript==
// @name           Planets.nu - improved Planet List View
// @description    Miscellaneous Improvements to the Planet List View
// @include        http://planets.nu/home
// @include        http://play.planets.nu/*
// @include        http://planets.nu/*
// @include	   http://test.planets.nu/*
// @version 0.51
// @namespace https://greasyfork.org/users/2860
// @downloadURL https://update.greasyfork.org/scripts/16010/Planetsnu%20-%20improved%20Planet%20List%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/16010/Planetsnu%20-%20improved%20Planet%20List%20View.meta.js
// ==/UserScript==
// 0.1 - Includes warnings about unhappiness levels on the planet, dangerous planetary fc's, show how close planets are to producing SBs, What's Interesting View to highlight problems
// 0.2 - Planets at dangerous temperatures are flagged in red or blue (hot/cold). New Notes Tab
// 0.3 - Added Production View
// 0.4 - Made headers more understandable (I hope). Added ground (not surface) mineral totals in tooltips
// 0.5 - Adds compatibility with new Horwasp view
// 0.51 - Fixed bug in Production View
function wrapper () { // wrapper for injection
oldShowPlanets =  vgapDashboard.prototype.showPlanets;


vgapDashboard.prototype.showPlanets = function (view) {

	vgap.playSound("button");

        vgap.closeSecond();
        this.content.empty();

        //filter messages
        var html = "";

        if (!view)
            view = 0;

        var filterMenu = $("<ul class='FilterMenu'></ul>").appendTo(this.content);
        $("<li " + (view == 0 ? "class='SelectedFilter'" : "") + ">Colony View</li>").tclick(function() { vgap.dash.showPlanets(0); }).appendTo(filterMenu);
        $("<li " + (view == 1 ? "class='SelectedFilter'" : "") + ">Resource View</li>").tclick(function() { vgap.dash.showPlanets(1); }).appendTo(filterMenu);
	  if (vgap.player.raceid == 12)
            $("<li " + (view == 2 ? "class='SelectedFilter'" : "") + ">Ship Building</li>").tclick(function () { vgap.dash.showPlanets(12); }).appendTo(filterMenu);
		$("<li " + (view == 2 ? "class='SelectedFilter'" : "") + ">Notes View</li>").tclick(function() { vgap.dash.showPlanets(2); }).appendTo(filterMenu);
		$("<li " + (view == 3 ? "class='SelectedFilter'" : "") + ">Production View</li>").tclick(function() { vgap.dash.showPlanets(3); }).appendTo(filterMenu);
		$("<li " + (view == 5 ? "class='SelectedFilter'" : "") + ">What's Interesting</li>").tclick(function() { vgap.dash.showPlanets(5); }).appendTo(filterMenu);
		
        //loop through all planets and show the ones owned by this player
        html = "<div class='DashPane' style='height:" + ($("#DashboardContent").height() - 70) + "px;'>";

        html += "<table id='PlanetTable' align='left' class='CleanTable' border='0' width='100%' style='cursor:pointer;'><thead>";
        html += "<th></th><th align='left'>Id</th><th align='left'>Name</th>";
        if (view == 1)
            html += "<th title='Megacredits' align='left'>MC</th><th title='Supplies' align='left'>S</th><th title='Neutronium' align='left'>N</th><th title='Duranium' align='left'>D</th><th title='Tritanium' align='left'>T</th><th title='Molybdenum' align='left'>M</th><th title='Ground Neutronium (unmined)' align='left'>GN</th><th title='Ground Duranium (unmined)' align='left'>GD</th><th title='Ground Tritanium (unmined)' align='left'>GT</th><th title='Ground Molybdenum (unmined)' align='left'>GM</th><th title='Neutronium Density' align='left'>DN</th><th title='Duranium Density' align='left'>DD</th><th title='Tritanium Density' align='left'>DT</th><th title='Molybdenum Density' align='left'>DM</th>";
        if ((view == 0)||(view==5))
            html += "<th title='Starbase' align='left'>SB</th><th align='left' class=\"{sorter: 'text'}\">FC</th><th title='Temperature' align='left'>T</th><th title='Colonists' align='left'>Cols</th><th title='Colonist Tax Rate' align='left'>Tx</th><th title='Colonist Happiness' align='left'>Hp</th><th title='Colonist Happiness Change' align='left'>+/-</th><th title='Natives' align='left'>Natives</th><th title='Native Government' align='left'>Gov</th><th title='Native Population' align='left'>Pop</th><th title='Native Tax Rate' align='left'>Tx</th><th title='Native Happiness' align='left'>Hp</th><th title='Native Happiness Change' align='left'>+/-</th><th title='Ready Checkbox Status' align='left'>R</th>";
		if (view==2)
			html += "<th title='Starbase' align='left'>SB</th><th align='left' class=\"{sorter: 'text'}\">FC</th><th title='Colonists' align='left'>Cols</th><th title='Natives' align='left'>Natives</th><th title='Native Population' align='left'>Pop</th><th title='Notes' align='left'>Notes</th><th title='Ready Checkbox Status' align='left'>R</th>";
		if (view==3)
			html += "<th title='Starbase' align='left'>SB</th><th title='Total MC Generated per Turn' align='left'>MC/T</th><th title='Total Supplies Generated per Turn' align='left'>Supplies/T</th><th title='Total Supplies + MC Generated per Turn' align='left'>S+MC/T</th><th title='Neutronium Produced per Turn' align='left'>Neut/T</th><th title='Duranium Produced per Turn' align='left'>Dur/T</th><th title='Tritanium Produced per Turn' align='left'>Tri/T</th><th title='Molybdenum Produced per Turn' align='left'>Moly/T</th><th title='Ready Checkbox Status' align='left'>R</th>";
        if (view == 12)
            html += "<th title='Hull Image' align='left'></th><th title='Hull' align='left'>Hull</th><th title='Cargo' align='left'>Cargo</th><th title='Speed' align='left'>Speed</th><th title='Target' align='left'>Target</th><th title='Accelerator' align='left'>Accelerator</th>";

        html += "</thead><tbody id='PlanetRows'></tbody></table></div>";

        this.pane = $(html).appendTo(this.content);

        for (var i = 0; i < vgap.myplanets.length; i++) {
            var planet = vgap.myplanets[i];
            //var base = vgap.getStarbase(planet.id) != null ? "X" : "";
			var base;
			var show=0; //for what's interesting view
            var temphtml="";
			temphtml += "<tr class='RowSelect'><td><img class='TinyIcon' src='" + planet.img + "'/></td><td>" + planet.id + "</td><td>" + planet.name + "</td>";
            if (view == 1)
                temphtml += "<td>" + planet.megacredits + "</td><td>" + planet.supplies + "</td><td>" + planet.neutronium + "</td><td>" + planet.duranium + "</td><td>" + planet.tritanium + "</td><td>" + planet.molybdenum + "</td><td>" + planet.groundneutronium + "</td><td>" + planet.groundduranium + "</td><td>" + planet.groundtritanium + "</td><td>" + planet.groundmolybdenum + "</td><td>" + planet.densityneutronium + "</td><td>" + planet.densityduranium + "</td><td>" + planet.densitytritanium + "</td><td>" + planet.densitymolybdenum + "</td></tr>";
            if (view ==2)
			{
				if (vgap.getStarbase(planet.id) != null)
						temphtml += "<td style='color:white' title='Planet has SB'>" + "X" + "</td>";
				else 
						temphtml += "<td>" + "" + "</td>";
				temphtml += "<td>" + planet.friendlycode + "</td><td>" + planet.clans * 100 + "</td>";
				
				if (planet.nativeclans > 0)
					temphtml += "<td>" + planet.nativeracename + "</td><td>" + planet.nativeclans * 100 + "</td>";
				else
					temphtml += "<td></td><td></td>";
				
				var note = vgap.getNote(planet.id, 1);
                    if (note != null) 
                        temphtml += '<td>' + note.body.replace(/\n/g, "<br/>") + '</td>';
                    else 
                        temphtml += '<td></td>';
					 temphtml += "<td>" + (planet.readystatus > 0 ? (planet.readystatus == 1 ? "-" : "+") : "") + "</td></tr>";
			}
					if (view == 12) {
                if (planet.podhullid > 0) {
                    var hull = vgap.getHull(planet.podhullid);
                    var targettext = "Deep Space";
                    if (planet.target)
                        targettext = planet.target.id + ": " + planet.target.name;
                    targettext += " (" + planet.targetx + ", " + planet.targety + ")";
                    html += "<td><img class='TinyIcon' src='" + hullImg(planet.podhullid) + "'/></td><td>" + hull.name + "</td>";
                    if (nu.isHullPod(planet.podhullid)) {
                        html += "<td>" + planet.podcargo + " / " + hull.cargo + "</td><td>" + planet.podspeed + "</td><td>" + targettext + "</td>";
                        if (planet.builtdefense > 0) { //accelerator target
                            var acc = vgap.getShip(planet.builtdefense);
                            html += "<td>" + acc.id + " (" + acc.x + ", " + acc.y + ")</td>";
                        }
                        else
                            html += "<td/>";
                    }
                    else
                        html += "<td/><td/><td/><td/>";
                }
                else
                    html += "<td/><td/><td/><td/><td/><td/>";
                html += "</tr>";
            }
					
			if (view == 3)
			{
					if (vgap.getStarbase(planet.id) != null)
							temphtml += "<td style='color:white' title='Planet has SB'>" + "X" + "</td>";
					else 
							temphtml += "<td>" + "" + "</td>";
					var SuppliesTotal=planet.factories;
	//--------------------------MC Produced-----------------------------------				
				var colTax = MyColTaxAmount(planet);
				var nativeTax = myNativeTaxAmount(planet);

				temphtml += "<td>" + (colTax+nativeTax) + "</td>";
	//--------------------------MC Produced-----------------------------------		
	//--------------------------Supplies Produced-----------------------------------				
					if (planet.nativeracename=="Bovinoid")
					{
						var BovSupplies=Math.floor(planet.nativeclans/100);
						SuppliesTotal=((planet.clans>BovSupplies)?BovSupplies:planet.clans)+planet.factories;
					}
					temphtml += "<td>" + SuppliesTotal + "</td>";
	//--------------------------Supplies Produced-----------------------------------	
					temphtml += "<td>" + (SuppliesTotal+colTax+nativeTax) + "</td>";
		var neutRate=0;
		var durRate=0;
		var tritRate=0;
		var molyRate=0;
		if (planet.mines>0)
		{
				var neutText=vgap.miningText(planet, planet.groundneutronium, planet.densityneutronium, planet.mines);
				var durText=vgap.miningText(planet, planet.groundduranium, planet.densityduranium, planet.mines);
				var tritText=vgap.miningText(planet, planet.groundtritanium, planet.densitytritanium, planet.mines);
				var molyText=vgap.miningText(planet, planet.groundmolybdenum, planet.densitymolybdenum, planet.mines);
				neutRate=neutText.slice(7,-5);
				durRate=durText.slice(7,-5);
				tritRate=tritText.slice(7,-5);
				molyRate=molyText.slice(7,-5);
		}
			if (planet.groundneutronium==neutRate && neutRate<6)
				temphtml += "<td style='color:grey' title='mining at subsistence level. Ground minerals " + planet.groundneutronium +"'>" + neutRate + "</td>";
			else if (planet.groundneutronium<(neutRate*2))
				{	
					temphtml += "<td style='color:red' title='only 1 turn left of full mining at this rate. Ground minerals " + planet.groundneutronium +"'>" + neutRate + "</td>";
					show=1;
				}
			else if (planet.groundneutronium<(neutRate*5))
						temphtml += "<td style='color:yellow' title='only 5 turn left of mining at this rate. Ground minerals " + planet.groundneutronium +"'>" + neutRate + "</td>";
			else		temphtml += "<td title='Ground minerals " + planet.groundneutronium +"'>" + neutRate + "</td>";

			if (planet.groundduranium==durRate && durRate<6)
				temphtml += "<td style='color:grey' title='mining at subsistence level. Ground minerals " + planet.groundduranium +"'>" + durRate + "</td>";
			else if (planet.groundduranium<(durRate*2))
				{
					temphtml += "<td style='color:red' title='only 1 turn left of full mining at this rate. Ground minerals " + planet.groundduranium +"'>" + durRate + "</td>";
					show=1;				
				}
			else if (planet.groundduranium<(durRate*5))
					temphtml += "<td style='color:yellow' title='only 5 turn left of mining at this rate. Ground minerals " + planet.groundduranium +"'>" + durRate + "</td>";
			else	temphtml += "<td title='Ground minerals " + planet.groundduranium +"'>" + durRate + "</td>";

			if (planet.groundtritanium==tritRate && tritRate<6)
				temphtml += "<td style='color:grey' title='mining at subsistence level. Ground minerals " + planet.groundtritanium +"'>" + tritRate + "</td>";
			else if (planet.groundtritanium<(tritRate*2))	
				{
					temphtml += "<td style='color:red' title='only 1 turn left of full mining at this rate. Ground minerals " + planet.groundtritanium +"'>" + tritRate + "</td>";
					show=1;
				}
			else if (planet.groundtritanium<(tritRate*5))
					temphtml += "<td style='color:yellow' title='only 5 turn left of mining at this rate. Ground minerals " + planet.groundtritanium +"'>" + tritRate + "</td>";
			else			temphtml += "<td title='Ground minerals " + planet.groundtritanium +"'>" + tritRate + "</td>";

			if (planet.groundmolybdenum==molyRate && molyRate<6)
				temphtml += "<td style='color:grey' title='mining at subsistence level. Ground minerals " + planet.groundmolybdenum +"'>" + molyRate + "</td>";
			else if (planet.groundmolybdenum<(molyRate*2))
				{
					temphtml += "<td style='color:red' title='only 1 turn left of full mining at this rate. Ground minerals " + planet.groundmolybdenum +"'>" + molyRate + "</td>";
					show=1;
				}
			else if (planet.groundmolybdenum<(molyRate*5))
					temphtml += "<td style='color:yellow' title='only 5 turn left of mining at this rate. Ground minerals " + planet.groundmolybdenum +"'>" + molyRate + "</td>";
			else	temphtml += "<td title='Ground minerals " + planet.groundmolybdenum +"'>" + molyRate + "</td>";

				temphtml += "<td>" + (planet.readystatus > 0 ? (planet.readystatus == 1 ? "-" : "+") : "") + "</td></tr>";
			}
		   if ((view == 0)||(view==5)) {
				//-------------------Star Base-------------------------
				if (vgap.getStarbase(planet.id) != null)
						temphtml += "<td style='color:white' title='Planet has SB'>" + "X" + "</td>";
				else 
					{
					var count=5;
					if ((planet.megacredits+planet.supplies)>=900) count--;
					if (planet.duranium>=120) count--;
					if (planet.tritanium>=402) count--;
					if (planet.molybdenum>=340) count--;
					if (count==1)
					{
						temphtml += "<td style='color:green' title='Planet has resources to produce SB'>" + "*" + "</td>";
						show=1;
					}
					else if (count==2)
						temphtml += "<td style='color:yellow' title='Planet is missing only one resource to produce SB'>" + "*" + "</td>";
					else if (count==3)
						temphtml += "<td style='color:red' title='Planet is missing only two resources to produce SB'>" + "*" + "</td>";
					else 
						temphtml += "<td>" + "" + "</td>";
					}
				//-------------------Star Base-------------------------
				//-------------------Dangerous FCs---------------------
				
				if (((planet.friendlycode.charAt(0)=='m') || (planet.friendlycode.charAt(0)=='M')) && ((planet.friendlycode.charAt(1)=='f') || (planet.friendlycode.charAt(1)=='F')))
					{
						temphtml += "<td style='color:red' title='WARNING: MFx Friendly Code set. This can leave minefield vulnerable to enemies'>" + planet.friendlycode + "</td>";
						show=1;
					}
				else if  (((planet.friendlycode.charAt(0)=='b') || (planet.friendlycode.charAt(0)=='B')) && ((planet.friendlycode.charAt(1)=='u') || (planet.friendlycode.charAt(1)=='U')) && ((planet.friendlycode.charAt(2)=='m') || (planet.friendlycode.charAt(2)=='M')))
					{
						temphtml += "<td style='color:yellow' title='WARNING: BUM Friendly Code set. This will beam up money to all ships in orbit'>" + planet.friendlycode + "</td>";
						show=1;
					}
				else 
					temphtml += "<td>" + planet.friendlycode + "</td>";
				//-------------------Dangerous FCs---------------------
			    //-------------------Dangerous Temps-------------------
				if (planet.temp<15)	temphtml += "<td style='color:aqua' title='Planet is Arctic temperature'>" + planet.temp + "</td>";
				else if (planet.temp>84)	temphtml += "<td style='color:red' title='Planet is Desert temperature'>" + planet.temp + "</td>";
				else  temphtml += "<td>" + planet.temp + "</td>";
				//-------------------Dangerous Temps-------------------
				temphtml +="<td>" + planet.clans * 100 + "</td><td>" + planet.colonisttaxrate + "</td>";
				//-------------------Unhappy Colonists---------------------
				if (((planet.colonisthappypoints<70)&&(planet.colhappychange < 0)) || (planet.colonisthappypoints<40)) show=1;
				if (planet.colonisthappypoints<40)
					temphtml += "<td style='color:red' title='Colonists are destroying the planet!'>" + planet.colonisthappypoints + "</td>";
				else if (planet.colonisthappypoints<70)
					temphtml += "<td style='color:yellow' title='Colonists are getting dangerously unhappy, and will no longer grow in population'>" + planet.colonisthappypoints + "</td>";
				else
				//-------------------Unhappy Colonists---------------------	
					temphtml += "<td>" + planet.colonisthappypoints + "</td>";
				temphtml += "<td" + (planet.colhappychange < 0 ? " class='WarnText' " : "") + ">" + planet.colhappychange + "</td>";
                if (planet.nativeclans > 0)
				{
					temphtml += "<td>" + planet.nativeracename + "</td><td>" + planet.nativegovernmentname + "</td><td>" + planet.nativeclans * 100 + "</td><td>" + planet.nativetaxrate + "</td>";
					//-------------------Unhappy Natives---------------------	
					if (((planet.nativehappypoints<70)&&(planet.nativehappychange<0)) || (planet.nativehappypoints<40)) show=1;
					if (planet.nativehappypoints<40)
						temphtml += "<td style='color:red' title='Natives are destroying the planet!'>" + planet.nativehappypoints + "</td>";
					if (planet.nativehappypoints<70)
						temphtml += "<td style='color:yellow' title='Natives are getting dangerously unhappy, and will no longer grow in population'>" + planet.nativehappypoints + "</td>";
					else
					//-------------------Unhappy Natives---------------------	
						temphtml += "<td>" + planet.nativehappypoints + "</td>";
					temphtml += "<td" + (planet.nativehappychange < 0 ? " class='WarnText' " : "") + ">" + planet.nativehappychange + "</td>";

				}
				else
                    temphtml += "<td></td><td></td><td></td><td></td><td></td><td></td>";
                temphtml += "<td>" + (planet.readystatus > 0 ? (planet.readystatus == 1 ? "-" : "+") : "") + "</td></tr>";
            }
			if ((view!=5)||(show==1))
			{
				var select = function(id) { return function() { vgap.map.selectPlanet(id); }; };
				$(temphtml).click(select(planet.id)).appendTo("#PlanetRows");
			}
        }
        
        //this.content.fadeIn();
        $("#PlanetTable").tablesorter();
        this.pane.jScrollPane();

        // vgap.action added for the assistant (Alex):
        vgap.CurrentView = "showPlanets";
        vgap.showPlanetsViewed = 1;
};

    myNativeTaxAmount= function (planet) {

        //amorph none
        if (planet.nativetype == 5)
            return 0;

        //cyborg max 20%
        var nativetaxrate = planet.nativetaxrate;
        var player = vgap.getPlayer(planet.ownerid);
        if (player != null) {
            if (player.raceid == 6 && nativetaxrate > 20)
                nativetaxrate = 20;
        }

        var val = Math.round(nativetaxrate * planet.nativetaxvalue / 100 * planet.nativeclans / 1000);

        if (val > planet.clans)
            val = planet.clans;

        //player tax rate (fed bonus)
        var taxbonus = 1;
        if (vgap.advActive(2))
            taxbonus = 2;
        val = val * taxbonus;

        //insectoid bonus
        if (planet.nativetype == 6)
            val = val * 2;

        if (val > 5000)
            val = 5000;

        return val;
    };	
	 MyColTaxAmount= function (planet) {
			var colTax = Math.round(planet.colonisttaxrate * planet.clans / 1000);
				//player tax rate (fed bonus)
				var taxbonus = 1;
				if (vgap.advActive(2))
					taxbonus = 2;
				colTax = colTax * taxbonus;

				if (colTax > 5000)
					colTax = 5000;
		return (colTax)
		};
	
} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);