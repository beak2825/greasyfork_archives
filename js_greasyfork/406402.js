// ==UserScript==
// @name         Synergism Auto Ants
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Automatically run and sacrifice ants
// @author       cjmanca
// @match        https://game320578.konggames.com/gamez/0032/0578/live/index.html*
// @grant        none
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @require https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/406402/Synergism%20Auto%20Ants.user.js
// @updateURL https://update.greasyfork.org/scripts/406402/Synergism%20Auto%20Ants.meta.js
// ==/UserScript==

/* globals $, jQuery, Cookies, player, buyParticleBuilding, buyAntProducers, buyAntUpgrade, buyResearch
calculateAntSacrificeELO, divineBlessing3, antELO, bonusant11, antUpgradeBaseCost, antUpgradeCostIncreases, Decimal, format, cardinals, effectiveELO, auto, resetAnts, updateTalismanInventory */

(function() {
    'use strict';

	var autoSac = Cookies.get('autoSac') == "true" ? true : false;

	if (autoSac === undefined)
	{
		autoSac = false;
	}

	var sacPercent = 0;

    var highestSacPercent = 0;
    var highestSacTime = 1;
    var lastHighestSacPercent = 0;
    var lastHighestSacTime = 1;
    var previousHighestSacPercent = 0;
    var previousHighestSacTime = 1;

    var antSacrificeRunStatsTable1 = null;
    var antSacrificeRunStatsTable2 = null;
    var antSacrificeRunStatsTable3 = null;
    var antSacrificeRunStatsTable4 = null;
    var antSacrificeRunStatsTable5 = null;
    var antSacrificeRunStatsTable6 = null;
    var antSacrificeTable = null;

	window.sacrificeAnts = sacrificeAnts_local;

    setInterval(function(){


        try
        {
			var savedBuyAmount = player.particlebuyamount;
			player.particlebuyamount = 1;

			while (player.fifthCostParticles.times(10).lessThanOrEqualTo(player.reincarnationPoints))
			{
            	buyParticleBuilding('fifth');
			}
			while (player.fourthCostParticles.times(10).lessThanOrEqualTo(player.reincarnationPoints))
			{
            	buyParticleBuilding('fourth');
			}
			while (player.thirdCostParticles.times(10).lessThanOrEqualTo(player.reincarnationPoints))
			{
            	buyParticleBuilding('third');
			}
			while (player.secondCostParticles.times(10).lessThanOrEqualTo(player.reincarnationPoints))
			{
            	buyParticleBuilding('second');
			}
			while (player.firstCostParticles.times(10).lessThanOrEqualTo(player.reincarnationPoints))
			{
            	buyParticleBuilding('first');
			}

			player.particlebuyamount = savedBuyAmount;

            if (player.eighthOwnedAnts < 1)
            {
                buyAntProducers('eighth','Ants','1e300',8)
            }
            if (player.seventhOwnedAnts < 1)
            {
                buyAntProducers('seventh','Ants','1e100',7)
            }
            if (player.sixthOwnedAnts < 1)
            {
                buyAntProducers('sixth','Ants','1e36',6)
            }
            if (player.fifthOwnedAnts < 1)
            {
                buyAntProducers('fifth','Ants','1e12',5)
            }
            if (player.fourthOwnedAnts < 1)
            {
                buyAntProducers('fourth','Ants','10000',4)
            }
            if (player.thirdOwnedAnts < 1)
            {
                buyAntProducers('third','Ants','100',3)
            }
            if (player.secondOwnedAnts < 1)
            {
                buyAntProducers('second','Ants','3',2)
            }
            if (player.firstOwnedAnts < 1)
            {
                buyAntProducers('first','Ants','1e1200',1)
            }

            buyAntUpgrade_local('100',false,1)
            buyAntUpgrade_local('100',false,2)
            buyAntUpgrade_local('1000',false,3)
            buyAntUpgrade_local('1000',false,4)
            buyAntUpgrade_local('1e5',false,5)
            buyAntUpgrade_local('1e6',false,6)
            buyAntUpgrade_local('1e8',false,7)
            buyAntUpgrade_local('1e11',false,8)
            buyAntUpgrade_local('1e15',false,9)
            buyAntUpgrade_local('1e20',false,10)
            buyAntUpgrade_local('1e40',false,11)
            buyAntUpgrade_local('1e100',false,12)





            buyAntProducers('eighth','Ants','1e300',8)
            buyAntProducers('seventh','Ants','1e100',7)
            buyAntProducers('sixth','Ants','1e36',6)
            buyAntProducers('fifth','Ants','1e12',5)
            buyAntProducers('fourth','Ants','10000',4)
            buyAntProducers('third','Ants','100',3)
            buyAntProducers('second','Ants','3',2)
            buyAntProducers('first','Ants','1e1200',1)


            if (player.antPoints.greaterThanOrEqualTo("1e41"))
            {
				calcSacPercent();

                if (sacPercent/player.antSacrificeTimer > highestSacPercent/highestSacTime)
                {
                    highestSacPercent = sacPercent;
                    highestSacTime = player.antSacrificeTimer;
                }


				if (autoSac && sacPercent >= highestSacPercent)
				{
					if (player.toggles[cardinals[26]] && player.resettoggle3 == 2)
					{

						if (player.antSacrificeTimer - highestSacTime >= 1 && player.reincarnationcounter <= player.reincarnationamount - highestSacTime + 120 && player.reincarnationcounter >= 60)
						{
							sacrificeAnts_local();
						}

						if (player.antSacrificeTimer >= 900 && player.reincarnationcounter <= player.reincarnationamount - 900 + 120 && player.reincarnationcounter >= 60)
						{
							//sacrificeAnts_local();
						}
					}
					else
					{
						if (player.antSacrificeTimer - highestSacTime >= 1 && player.reincarnationcounter >= 60)
						{
							sacrificeAnts_local();
						}

						if (player.antSacrificeTimer >= 900 && player.reincarnationcounter > 60)
						{
							//sacrificeAnts_local();
						}
					}
				}

            }

            updateDisplay();

        }
        catch (err)
        {
        }

    }, 100);





	function calcSacPercent()
	{

		calculateAntSacrificeELO();
		let mult = 1;
		mult *= (1 + 2 * (1 - Math.pow(2, -(player.antUpgrades[11] + bonusant11)/125)))
		mult *= (1 + player.researches[103]/50)
		mult *= (1 + player.researches[104]/50)
		if(player.achievements[132] == 1){mult *= 1.25}
		if(player.achievements[137] == 1){mult *= 1.25}
		mult *= divineBlessing3
		mult *= (1 + 1/50 * player.challengecompletions.ten)
		mult *= (1 + 1/100 * player.researches[122])
		mult *= (1 + 1/10 * player.upgrades[79])
		mult *= (1 + 0.09 * player.upgrades[40])

		let timeMultiplier = Math.min(1, Math.pow(player.antSacrificeTimer / 900, 2)) * Math.max(1, Math.pow(player.antSacrificeTimer/900, 0.75));

		sacPercent = Math.pow(1 + (player.antSacrificePoints + antELO * timeMultiplier * mult)/5000, 2) / Math.pow(1 + player.antSacrificePoints/5000, 2) - 1;

	}


    function updateDisplay()
    {
		// cache element references
        if (antSacrificeTable == null || antSacrificeRunStatsTable1 == null || antSacrificeRunStatsTable2 == null || antSacrificeRunStatsTable3 == null || antSacrificeRunStatsTable4 == null
		   || antSacrificeTable.length == 0 || antSacrificeRunStatsTable1.length == 0 || antSacrificeRunStatsTable2.length == 0 || antSacrificeRunStatsTable3.length == 0 || antSacrificeRunStatsTable4.length == 0)
        {
            antSacrificeRunStatsTable1 = $("#antSacrificeRunStatsTable1");
            antSacrificeRunStatsTable2 = $("#antSacrificeRunStatsTable2");
            antSacrificeRunStatsTable3 = $("#antSacrificeRunStatsTable3");
            antSacrificeRunStatsTable4 = $("#antSacrificeRunStatsTable4");
            antSacrificeRunStatsTable5 = $("#antSacrificeRunStatsTable5");
            antSacrificeRunStatsTable6 = $("#antSacrificeRunStatsTable6");
            antSacrificeTable = $("#antSacrificeTable");
        }

		if (antSacrificeRunStatsTable1.length == 0)
		{
			// Verify that our table entries have already been added
			if (antSacrificeTable.length > 0)
			{
				antSacrificeTable.append('<tr> <td style="color: white;">Cur.Best/s&nbsp;%:</td> <td id="antSacrificeRunStatsTable1" style="color: limegreen;"></td></tr>');
				antSacrificeTable.append('<tr style="display: none"> <td style="color: white;">Cur.Best&nbsp;Time:</td> <td id="antSacrificeRunStatsTable2" style="color: limegreen;"></td></tr>');
				antSacrificeTable.append('<tr style="display: none"> <td style="color: white;">Prev.Best/s&nbsp;%:</td> <td id="antSacrificeRunStatsTable3" style="color: limegreen;"></td></tr>');
				antSacrificeTable.append('<tr style="display: none"> <td style="color: white;">Prev.Best&nbsp;Time:</td> <td id="antSacrificeRunStatsTable4" style="color: limegreen;"></td></tr>');
				antSacrificeTable.append('<tr> <td style="color: white;">Last.Best/s&nbsp;%:</td> <td id="antSacrificeRunStatsTable5" style="color: limegreen;"></td></tr>');
				antSacrificeTable.append('<tr style="display: none"> <td style="color: white;">Last.Best&nbsp;Time:</td> <td id="antSacrificeRunStatsTable6" style="color: limegreen;"></td></tr>');
				antSacrificeTable.append('<tr> <td style="color: white;">Auto&nbsp;Sacrifice:</td> <td><input type="checkbox" id="antAutoSacrifice"/></td></tr>');

				antSacrificeRunStatsTable1 = $("#antSacrificeRunStatsTable1");
				antSacrificeRunStatsTable2 = $("#antSacrificeRunStatsTable2");
				antSacrificeRunStatsTable3 = $("#antSacrificeRunStatsTable3");
				antSacrificeRunStatsTable4 = $("#antSacrificeRunStatsTable4");
				antSacrificeRunStatsTable5 = $("#antSacrificeRunStatsTable5");
				antSacrificeRunStatsTable6 = $("#antSacrificeRunStatsTable6");

				$("#antAutoSacrifice").prop("checked", autoSac);

				$("#antAutoSacrifice").change(function() {
					autoSac = this.checked;
					Cookies.set("autoSac", autoSac);
				});
			}
		}

		antSacrificeRunStatsTable1.text(format((highestSacPercent)*100, 2) + "%");
		antSacrificeRunStatsTable2.text(format(highestSacTime));
		antSacrificeRunStatsTable3.text(format((previousHighestSacPercent)*100, 2) + "%");
		antSacrificeRunStatsTable4.text(format(previousHighestSacTime));
		antSacrificeRunStatsTable5.text(format((lastHighestSacPercent)*100, 2) + "%");
		antSacrificeRunStatsTable6.text(format(lastHighestSacTime));

    }


    function buyAntUpgrade_local(originalCost,auto,i)
    {


        if (player.antPoints.greaterThanOrEqualTo(Decimal.pow(antUpgradeCostIncreases[i], player.antUpgrades[i]).times(antUpgradeBaseCost[i])))
        {
            buyAntUpgrade(originalCost,auto,i);
        }

    }




    function sacrificeAnts_local(){

		lastHighestSacPercent = highestSacPercent;
		lastHighestSacTime = highestSacTime;

		if (highestSacPercent/highestSacTime > previousHighestSacPercent/previousHighestSacTime)
		{
			previousHighestSacPercent = highestSacPercent;
			previousHighestSacTime = highestSacTime;
		}
		highestSacPercent = 0;
		highestSacTime = 1;


		let p = true
		let timeMultiplier = Math.min(1, Math.pow(player.antSacrificeTimer / 900, 2)) * Math.max(1, Math.pow(player.antSacrificeTimer/900, 0.92))
		let mult = 1;
		mult *= (1 + 2 * (1 - Math.pow(2, -(player.antUpgrades[11] + bonusant11)/125)));
		mult *= (1 + player.researches[103]/50)
		mult *= (1 + player.researches[104]/50)
		if(player.achievements[132] == 1){mult *= 1.25}
		if(player.achievements[137] == 1){mult *= 1.25}
		mult *= divineBlessing3
		mult *= (1 + 1/50 * player.challengecompletions.ten)
		mult *= (1 + 1/200 * player.researches[122])
		mult *= (1 + 1/10 * player.upgrades[79])
		mult *= (1 + 0.09 * player.upgrades[40])

		if (player.antPoints.greaterThanOrEqualTo("1e41")){
			calculateAntSacrificeELO();
			player.antSacrificePoints += (effectiveELO * timeMultiplier * mult)
			player.runeshards += (player.offeringpersecond * 0.15 * effectiveELO * timeMultiplier * mult);
			player.researchPoints += (player.maxobtainiumpersecond * 0.24 * effectiveELO * timeMultiplier * mult);

			if(player.challengecompletions.nine > 0.5){
				if(antELO > 500){player.talismanShards += Math.floor((timeMultiplier * mult * Math.pow(1/4 * (effectiveELO - 500),2)))}
				if(antELO > 750){player.commonFragments += Math.floor((timeMultiplier * mult * Math.pow(1/9 * (effectiveELO - 750),1.83)))}
				if(antELO > 1000){player.uncommonFragments += Math.floor((timeMultiplier * mult * Math.pow(1/16 * (effectiveELO - 1000),1.66)))}
				if(antELO > 1500){player.rareFragments += Math.floor((timeMultiplier * mult * Math.pow(1/25 * (effectiveELO - 1500),1.5)))}
				if(antELO > 2000){player.epicFragments += Math.floor((timeMultiplier * mult * Math.pow(1/36 * (effectiveELO - 2000),1.33)))}
				if(antELO > 3000){player.legendaryFragments += Math.floor((timeMultiplier * mult * Math.pow(1/49 * (effectiveELO - 3000),1.16)))}
				if(antELO > 5000){player.mythicalFragments += Math.floor((timeMultiplier * mult * Math.pow(1/64 * (effectiveELO - 4150),1)))}
			}
			resetAnts();
			player.antSacrificeTimer = 0;
			updateTalismanInventory();
			if(player.autoResearch > 0 && player.autoResearchToggle){buyResearch(player.autoResearch,true)}
			calculateAntSacrificeELO();
		}
	}
})();



