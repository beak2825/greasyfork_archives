// ==UserScript==
// @name        VCR+
// @author      Psydev
// @copyright   Psydev, 2018
// @license     Lesser Gnu Public License, version 3
// @description For planets.nu - Cleans up VCR name display
// @namespace   psydev/planets.nu
// @include     http://planets.nu/*
// @include     http://play.planets.nu/*
// @include     http://test.planets.nu/*
// @version     0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40392/VCR%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/40392/VCR%2B.meta.js
// ==/UserScript==

vcrSim.prototype.startVCR = function() {

        vgap.playSound("vcr");

        this.container.show();

        var vcr = this.vcr;

        //determine setup
        this.vsPlanet = (vcr.battletype == 1);
        this.hasStarbase = vcr.right.hasstarbase;
        this.battleType = vcr.battletype;
        this.seed = vcr.seed;

        //load left and right images
        this.leftImg.attr("src", hullImg(vcr.left.hullid, vcr.left.beamcount));
        if (!this.vsPlanet)
            this.rightImg.attr("src", hullLeftImg(vcr.right.hullid, vcr.right.beamcount));
        else
            this.rightImg.attr("src", vgap.planetPic(vcr.right.temperature));

        this.leftImg.show();
        this.rightImg.show();

        //show base image if needed
        if (this.vsPlanet && this.hasStarbase)
            this.baseImg.show();
        else
            this.baseImg.hide();

        //Get Top Display Text left vs right (battletitle)
        var lHull = vgap.getHull(vcr.left.hullid);
        var lRace = vgap.getRace(vcr.left.raceid);
        var rRace = vgap.getRace(vcr.right.raceid);
        var rHull = vgap.getHull(vcr.right.hullid);

        var title = "";

/////////////////////////////////////////////////////////////////////
// Empire Qtanker (psydev) #92 Vs Rebel Rush Carrier (jact704) - Badmama-4 #224

		title += "<div>"; // style='background-color:#00AA00'

//names, left and right.
		title += "<div style='float:left'; 'width:10%'; 'padding:20px';>";
		title += lRace.adjective + "<br>" + vgap.players[vcr.leftownerid - 1].username;
		title += "</div>";
		title += "<div style='float:right'; 'width:10%'>";
		title += rRace.adjective + "<br>" + vgap.players[vcr.rightownerid - 1].username;
		title += "</div>";

//ships
	// left ship
		var leftNameLow = vcr.left.name.toLowerCase();
		var leftHullLow = lHull.name.toLowerCase();
		if (leftNameLow != leftHullLow)
			title += lHull.name + " (#" + vcr.left.objectid + ") &quot;" + vcr.left.name + "&quot;";
		else {
			title += lHull.name + " (#" + vcr.left.objectid + ")";
		}
	// vs
		title += "&nbsp; &nbsp; vs &nbsp; &nbsp;";
	// right ship
		if (this.vsPlanet)
			title += vcr.right.name + " (#" + vcr.right.objectid + ")";
		else {
            var rightNameLow = vcr.right.name.toLowerCase();
            var rightHullLow = rHull.name.toLowerCase();
			if (rightNameLow != rightHullLow)
				title += "&quot;" + vcr.right.name + "&quot; " + "(#" + vcr.right.objectid + ") " + rHull.name;
            else {
                title += rHull.name + " (#" + vcr.right.objectid + ")";
            }
        }
	// combat masses
		title += "<br>" + vcr.left.mass + " kt vs " + vcr.right.mass + " kt<br>";

        if (vcr.leftownerid != vgap.player.id && vcr.rightownerid != vgap.player.id)
            title += "<span class='GreatText'>ALLY VCR</span>";

		title += "</div>";

/////////////////////////////////////////////////////////////////////
		this.battleTitle.html(title);

		//set up the combat objects
        this.left = new combatObject();
        this.right = new combatObject();
        this.left.setObject(vcr.left);
        this.right.setObject(vcr.right);

        this.runVisual();
	};

console.log("VCR+ plugin has loaded");
