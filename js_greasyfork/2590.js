// ==UserScript==
// @name       DripStat DropOut
// @namespace	anonycat
// @version    0.12.260
// @description  Calculates stats in DripStat, and provides a control panel for automation.
// @match      https://dripstat.com/game/
// @grant      none
// @downloadURL https://update.greasyfork.org/scripts/2590/DripStat%20DropOut.user.js
// @updateURL https://update.greasyfork.org/scripts/2590/DripStat%20DropOut.meta.js
// ==/UserScript==

//Throttle auto purchases to one every 3 seconds, to minimize risk of desyncs with the server
var lastBuy = 0;

//Track how many manual clicks have been made by second over the last 60 seconds
var clickHistory = [];
while (lastBuy < 60)
	{clickHistory[lastBuy++] = 0;}

//Convert upgrade indices to their order in the shop
var upgIndex = [1,1,1,1,1,1,1,1,1,1,1];

var knownPrice = [0,0,0,0,0,0,0,0,0,0,0];
var lastbytes = 0;

var cache=[0,0,0,0,0,0];
var first = 1;
var sec = 0;

//Keep track of how often the cup is being clicked (this doesn't clobber its existing onClick function)
$('#btn-addMem').click(function (e) {
	if (e.preventDefault(), document.hasFocus() && gameInited)
		if (localStats.byteCount < localStats.memoryCapacity)
			if (clickHistory[0] <= 19)
				clickHistory[0]++;
})

function byteConvert(val)
{
	if(val < 1000)
		return +val.toFixed(2)+" B";
	else
		return NumUtils.byteConvert(val,2);
}

function byteConvert2(val)
{
	if(val < 1000)
		return val.toFixed(0)+" B";
	else
		return NumUtils.byteConvert(val,2);
}

function loop()
{
	if(typeof(localStats) == "undefined")
		return;
	
	var powerupCounter = 1;
	var newPurchase = 0;
	var mult = 0;
	var multm = 0;
	var bpc = CoffeeCup.calcBytesPerClick();
	var bpcBoosts = localStats.powerUps[0].purchasedUpgrades.length;
	
	if(first)
	{
		first=0;
		init();
	}
	else
	{		
       //Check for any changes in the control panel and save the new values if found.
		if(localStats.dropout.autoBuy != cache[0])
		{
			cache[0]=localStats.dropout.autoBuy;
			GM_setValue("ab",cache[0]+1);
		}
		if(localStats.dropout.autoClick != cache[1])
		{
			cache[1]=localStats.dropout.autoClick;
			GM_setValue("ac",cache[1]+1);
		}
		if(localStats.dropout.autoDrip != cache[2])
		{
			cache[2]=localStats.dropout.autoDrip;
			GM_setValue("ad",cache[2]+1);
		}
		if(localStats.dropout.clickRate != cache[3])
		{
			cache[3]=localStats.dropout.clickRate;
			GM_setValue("cr",cache[3]+1);
		}
		if(localStats.dropout.cupmultl != cache[4])
		{
			cache[4]=localStats.dropout.cupmultl;
			GM_setValue("ml",cache[4]+1);
		}
		if(localStats.dropout.cupmultm != cache[5])
		{
			cache[5]=localStats.dropout.cupmultm;
			GM_setValue("mm",cache[5]+1);
		}
		if(localStats.dropout.clickToggle != cache[6])
		{
			cache[6]=localStats.dropout.clickToggle;
			GM_setValue("rt",cache[6]+1);
		}
		if(localStats.dropout.clickToggleOn != cache[7])
		{
			cache[7]=localStats.dropout.clickToggleOn;
			GM_setValue("rton",cache[7]+1);
		}
		if(localStats.dropout.clickToggleOff != cache[8])
		{
			cache[8]=localStats.dropout.clickToggleOff;
			GM_setValue("rtoff",cache[8]+1);
		}
	}
	
	var avg10 = 0;
	var avg60 = 0;
	for(var a = 0; a < 60; a++)
	{
		avg60 += clickHistory[a];
		if(a<10)
			avg10 += clickHistory[a];
	}
	clickHistory.pop();
	clickHistory.unshift(0);
	
	avg10 /= 10;
	avg60 /= 60;
	sec++;
	
	if (sec == 60)
	{
		
		//reload if we have a blank page
		if($("#powerupstore").length == 0)
			window.location.reload(false);
		else
		{
			sec = 0;
			if(localStats.dropout.autoClick)
			{
				if(localStats.dropout.clickToggle && Math.random()*100<localStats.dropout.clickToggleOff)
				{
					localStats.dropout.autoClick = 0;
					localStats.dropout.updatehud(2);
				}
			}
			else 
			{
				if(localStats.dropout.clickToggle && Math.random()*100<localStats.dropout.clickToggleOn)
				{
					localStats.dropout.autoClick = 1;
					localStats.dropout.updatehud(2);
				}
			}
		}
	}
	
	lastbytes = localStats.byteCount;
	
	if (localStats.dropout.autoClick)
	{
		multm = localStats.dropout.cupmultm;
		mult = Math.min(20-clickHistory[1],Math.floor(Math.random()*(2 * multm - localStats.dropout.cupmultl)+localStats.dropout.cupmultl));
        
		if(mult)
			localStats.byteCount += bpc * mult;
        
		if(localStats.byteCount >= localStats.memoryCapacity)
			localStats.byteCount = localStats.memoryCapacity;
	}
	
	var bps = bpc * localStats.dropout.clickRate * (avg60 + multm) + localStats.bps;
    
	//Upgrades aren't necessarily in order, so untangle their order first
	$(".upgcontainer").each(function(upg) {
		if(this.children[0].className == "item")
		{
			var pos = Number(this.children[0].style.backgroundPosition.split(' ')[1].split('px')[0]) / -50;
			upgIndex[pos] = upg+1;
			if($(this).find('.upgROI').length==0)
			{
				$(this).append("<div class='upgROI'></div>");
				newPurchase = 1;
			}
		}
	})
    
	var data = Array();
	var upgdata = [1,1,1,1,1,1,1,1,1,1,1];
	var min = 1e+38;
	var bytesNeeded=0;
	var minObj = {};
	localStats.powerUps.slice(0).forEach(function(powerUp) {
		powerUp.position = "pu"+powerupCounter;
           
		var hasUpgrade = false;
		
		//Don't calculate ROI on upgrades that have zero powerups fueling them
		if(powerUp.count)
		powerUp.upgrades.forEach(function(upgrade) {
			if(hasUpgrade)
				return;
			hasUpgrade = true;
			upgrade.position = "upg"+upgIndex[powerupCounter-1];
			
			//Let's see which upgrade provides the biggest bang for the buck
			//(computed as "time taken before this upgrade will recoup its own cost").
			
			//If the price is so high that the current buffer can't possibly hold enough
			//(even if we cashed out for more space right now),
			//the "real" price includes what it takes to earn that extra buffer space.
			
			//If there's an object we can afford right now,
			//which will pay itself back in 2 hours,
			//and another object that would nominally pay itself back in 1h50m,
			//except that we can't afford it for 20 more minutes,
			//we should account for that in the time before recouping.
			//Add the time spent waiting to accrue sufficient funds.
			
			//Oh, and if we need 100MB for something, but can only hold 80MB
			//(with 70MB of it filled already), we can't just drip 20MB and keep the rest.
			//We have to drip everything at once, shooting all the way to 150MB.
			//Thus we can't make any progress on affording the item until a drip,
			//and then it costs a full additional 100MB after starting from scratch.

			if(upgrade.price > localStats.byteCount + localStats.memoryCapacity)
				bytesNeeded = 2 * upgrade.price - (localStats.memoryCapacity + localStats.byteCount);
			else if(upgrade.price > localStats.memoryCapacity)
				bytesNeeded = upgrade.price;
			else if(upgrade.price > localStats.byteCount)
				bytesNeeded = upgrade.price - localStats.byteCount;
			else
				bytesNeeded = 0;
			
			//Cursor upgrades boost clicking too, so if autoclicks are on, take the rate
			//and overall BPS into account when determining its value.
			if(powerupCounter == 1)
				upgrade.value = upgrade.price/((powerUp.totalBps * (1 + localStats.dropout.clickRate * (avg60 + multm) * bpcBoosts * 0.1) + localStats.dropout.clickRate * (avg60 + multm) * bpc) / 10) + bytesNeeded / bps;
			else
				upgrade.value = upgrade.price/(powerUp.totalBps * (0.1 + localStats.dropout.clickRate * (avg60 + multm) * bpcBoosts * 0.01)) + bytesNeeded / bps;
			
			min = Math.min(min, upgrade.value);
			if(upgrade.value == min)
				minObj = upgrade;
 
			upgdata[upgIndex[powerupCounter-1]-1]=upgrade.value;
		});
				
		powerupCounter++;
		
		//Same procedure on the main power-ups themselves.
		
		if(powerUp.currentPrice > localStats.byteCount + localStats.memoryCapacity)
			bytesNeeded = 2 * powerUp.currentPrice - (localStats.memoryCapacity + localStats.byteCount);
		else if(powerUp.currentPrice > localStats.memoryCapacity)
			bytesNeeded = powerUp.currentPrice;
		else if(powerUp.currentPrice > localStats.byteCount)
			bytesNeeded = powerUp.currentPrice - localStats.byteCount;
		else
			bytesNeeded = 0;
		
		powerUp.value = powerUp.currentPrice/(powerUp.currentBps * (1 + localStats.dropout.clickRate * (avg60 + multm) * bpcBoosts * 0.1)) + bytesNeeded / Math.max(1,bps);
            
		data.push(powerUp.value);
 
		if(!(springPowerup.isLocked && powerUp.name == "Spring Framework"))
		{
			min = Math.min(min, powerUp.value);
			if(powerUp.value == min)
				minObj = powerUp;
		}
 
	});
       
	$('.storeItem, .upgcontainer').css('background-color', '');
       
	var selector = minObj.position;
	$("#"+selector).css('background-color', '#B2EDED');
 
	$('.storeItem').each(function(index){
		if($(this).find('.storeROI').length==0)
		{
			$(this).html("<div class='storeItemAmount'>"+localStats.powerUps[index].count+"</div>"
			+"<div class='storeItemName'>"+localStats.powerUps[index].name+"</div>"
			+"<div class='storePriceRow'>"
			+"<div class='storePrice'>"+byteConvert2(localStats.powerUps[index].currentPrice)+"</div>"
			+"<div class='storeROI'>("+String(data[index]).toHHMMSS()+")</div></div>"
			+"<div class='powerup-one'>"+byteConvert(localStats.powerUps[index].currentBps)+"ps each</div>"
			+"<div class='powerup-all'>"+byteConvert2(localStats.powerUps[index].totalBps)+"ps total</div>"
			+"<div class='powerup-pct'>"+(100 * localStats.powerUps[index].totalBps / localStats.bps).toFixed(3)+"%</div>");
			newPurchase = 1;
		}
		if(knownPrice[index] != localStats.powerUps[index].currentPrice)
		{
			knownPrice[index] = localStats.powerUps[index].currentPrice;
			newPurchase = 1;
		}
	});
	if(newPurchase)
		$('.storeItem').each(function(index){
			$(this).find('.powerup-one').html(byteConvert(localStats.powerUps[index].currentBps)+'ps each');
			$(this).find('.powerup-all').html(byteConvert2(localStats.powerUps[index].totalBps)+'ps total');
			$(this).find('.powerup-pct').html((100 * localStats.powerUps[index].totalBps / localStats.bps).toFixed(3)+'%');
		});
	$('.upgROI').each(function(index){
		$(this).html(String(upgdata[index]).toHHMMSS());
	});
	$('.storeROI').each(function(index){
		$(this).html("("+String(data[index]).toHHMMSS()+")");
	});
       
	var label = minObj.name;
	
	if(minObj.powerup) //Is our best deal an upgrade or a powerup? They use different syntax.
	{
		label = "<span style='color:#F00'>"+label+"</span>";
		var price = minObj.price;
	}
	else
		var price = minObj.currentPrice;
	
	var limitTime = Number((localStats.memoryCapacity - localStats.byteCount)/bps).toFixed(0);
	var limitstr = "";
	
	if ((localStats.dropout.autoDrip==1 || (localStats.dropout.autoDrip==2 && (localStats.dropout.autoBuy==0 || price >= localStats.memoryCapacity))) && localStats.byteCount == localStats.memoryCapacity)
		dripper.dripGlobal();
   
	if(price > localStats.byteCount + localStats.memoryCapacity)
	{
		var time = Number((2 * price - (localStats.memoryCapacity + localStats.byteCount))/bps).toFixed(0);
		if(localStats.memoryCapacity==localStats.byteCount)
			limitstr = " (Drip NOW!)";
	}
	else if(price > localStats.memoryCapacity)
	{
		var time = Number(price/bps).toFixed(0);
		limitstr = " (Drip NOW!)";
		if(localStats.dropout.autoDrip >= 2)
			dripper.dripGlobal();
	}
	else
		var time = Number((price - localStats.byteCount)/bps).toFixed(0);
	
	//Now to fill the control panel.
   
	$("#next-purchase-label").html("Next purchase: <strong>"+label+"</strong>");
	$("#next-purchase-payback").html("Pays for itself in "+String(minObj.value).toHHMMSS());
	
	if(time <= 0)
		$("#next-purchase-time").html("Affordable now");
	else
		$("#next-purchase-time").html("Affordable in "+String(time).toHHMMSS()+limitstr);
	
	if(limitTime <= 0)
		$("#max-space-label").html("Capacity is maxed out!");
	else
		$("#max-space-label").html("Capacity maxes out in "+String(limitTime).toHHMMSS());
	
	$("#click-rate-10").html(String(avg10.toFixed(1)));
	$("#click-rate-60").html(String(avg60.toFixed(1)));
	
	if(localStats.dropout.autoBuy && price<=lastbytes && lastBuy >= 3)
	{
		minObj.buy(localStats);
		lastBuy = 0;
	}
	else if (lastBuy < 3)
		lastBuy += 1;
	
	if(springPowerup.isLocked && mine.beanCount > 0 && gameInited && loggedIn && localStats.byteCount > 0)
	{
		if($('.vex').length)
			vex.closeAll();
		Mine.onGrab();
	}
	
	if($("#networkError")[0].style['cssText'] == "display: block;")
		window.location.reload(false);
}

function init()
{
	localStats.dropout = new Object;
	//Should powerups and upgrades be automatically purchased as they become affordable?
	//(As of level 5, also includes facilities for grabbing spring beans that appear)
	localStats.dropout.autoBuy = GM_getValue("ab",1)-1;
	//Should the BPS rate be increased to simulate automatic cup clicks?
	localStats.dropout.autoClick = GM_getValue("ac",1)-1;
	//Should memory automatically be dripped?
	//0 = no auto-drip, 1 = auto-drip when buffer is full, 2 = auto-drip as needed to create enough space to pay for upgrades
	localStats.dropout.autoDrip = GM_getValue("ad",1)-1;

	//Should we take manual clicks into account when figuring out the payback rate of powerups?
	localStats.dropout.clickRate = GM_getValue("cr",2)-1;
	
	//Should auto-click randomly toggle itself on and off?
	localStats.dropout.clickToggle = GM_getValue("rt",1)-1;
	//Odds of randomly changing off->on
	localStats.dropout.clickToggleOn = GM_getValue("rton",2)-1;
	//Odds of randomly changing on->off
	localStats.dropout.clickToggleOff = GM_getValue("rtoff",51)-1;

	//If autoclicking is enabled, each second will pick a random multiplier and count off that many cup clicks.
	//A multiplier of 0 means no clicking, only natural BPS intake.
	//Multipliers greater than 20 are rejected by the server, so we won't ever generate such a thing here.
	
	//Lowest possible multiplier to select
	localStats.dropout.cupmultl = GM_getValue("ml",1)-1;
	//Average multiplier
	localStats.dropout.cupmultm = GM_getValue("mm",6)-1;
	//There is no variable for the highest multiplier; it's automatically figured as 2*Middle - Low (but capped at 20).
	
	//zero-valued options don't always store correctly...solution, store X+1!
	cache=[localStats.dropout.autoBuy, localStats.dropout.autoClick, localStats.dropout.autoDrip, localStats.dropout.clickRate, localStats.dropout.cupmultl, localStats.dropout.cupmultm, localStats.dropout.clickToggle, localStats.dropout.clickToggleOn, localStats.dropout.clickToggleOff];
	GM_setValue("ab",cache[0]+1);
	GM_setValue("ac",cache[1]+1);
	GM_setValue("ad",cache[2]+1);
	GM_setValue("cr",cache[3]+1);
	GM_setValue("ml",cache[4]+1);
	GM_setValue("mm",cache[5]+1);
	GM_setValue("rt",cache[6]+1);
	GM_setValue("rton",cache[7]+1);
	GM_setValue("rtoff",cache[8]+1);
		
	//string (int) seconds to formatted time
	String.prototype.toHHMMSS = function () {
		var seconds = parseInt(this, 10); // don't forget the second param
		if(seconds <= 0)
			return "no time";
		
		var days   = Math.floor(seconds / 86400);
		seconds -= days*86400;
		var hours   = Math.floor(seconds / 3600);
		seconds -= hours*3600;
		var minutes = Math.floor(seconds / 60);
		seconds -= minutes*60;
		
		if (hours   < 10 && days) {hours   = "0"+hours;}
		if (minutes < 10 && hours) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
       
		//NOTE: this output contains zero-width spaces before each colon, mostly to fit in upgrade boxes
		if(days)
			return days+"d "+hours+"​:"+minutes+"​:"+seconds;
		else if(hours)
			return hours+"​:"+minutes+"​:"+seconds;
		else
			return minutes+"​:"+seconds;
	}
		
	//function to update the control panel
	localStats.dropout.updatehud = function(type) {
		if(type & 1)
		{
			if(this.autoBuy)
			{
				$(".apn").css('background-color', '');
				$(".apy").css('background-color', '#AFA');
			}
			else
			{
				$(".apy").css('background-color', '');
				$(".apn").css('background-color', '#FAA');
			}
		}
		if(type & 2)
		{
			if(this.autoClick)
			{
				$(".acn").css('background-color', '');
				$(".acy").css('background-color', '#AFA');
			}
			else
			{
				$(".acy").css('background-color', '');
				$(".acn").css('background-color', '#FAA');
			}
		}
		if(type & 4)
		{
			if(this.autoDrip==2)
			{
				$(".drip0").css('background-color', '');
				$(".drip1").css('background-color', '');
				$(".drip2").css('background-color', '#AFA');
			}
			else if(this.autoDrip)
			{
				$(".drip2").css('background-color', '');
				$(".drip0").css('background-color', '');
				$(".drip1").css('background-color', '#AAF');
			}
			else
			{
				$(".drip2").css('background-color', '');
				$(".drip1").css('background-color', '');
				$(".drip0").css('background-color', '#FAA');
			}
		}
		if(type & 8)
		{
			if(this.clickRate)
			{
				$(".crn").css('background-color', '');
				$(".cry").css('background-color', '#AFA');
			}
			else
			{
				$(".cry").css('background-color', '');
				$(".crn").css('background-color', '#FAA');
			}
		}
		if(type & 16)
			$("#multl").html("Min. Rate: "+String(this.cupmultl));
		if(type & 32)
			$("#multm").html("Avg. Rate: "+String(this.cupmultm));
		if(type & 64)
		{
			if(this.clickToggle)
			{
				$(".rtn").css('background-color', '');
				$(".rty").css('background-color', '#AFA');
			}
			else
			{
				$(".rty").css('background-color', '');
				$(".rtn").css('background-color', '#FAA');
			}
		}
		if(type & 128)
			$("#rton").html(String(this.clickToggleOn)+"%");
		if(type & 256)
			$("#rtoff").html(String(this.clickToggleOff)+"%");
	}
   
	//Create the control panel with divs
	$('#bpsChartContainer').parent().append("<table style='width:100%; height:105px; line-height:1.3; border-collapse: collapse'><tr>"
									+"<td rowspan=2 style='width:33%; border: 2px solid black'><div id='next-purchase-container'></div></td>"
									+"<td colspan=2 style='width:12%; height:35px; border: 2px solid black; border-bottom: none' class='apy apn' onclick='localStats.dropout.autoBuy = 1 - localStats.dropout.autoBuy; localStats.dropout.updatehud(1)'>Auto Buy</td>"
									+"<td colspan=3 style='width:18%; border: 2px solid black; border-bottom: none' class='drip0 drip1 drip2' onclick='localStats.dropout.autoDrip = (1 + localStats.dropout.autoDrip) % 3; localStats.dropout.updatehud(4)'>Auto Drip</td>"
									+"<td colspan=2 style='width:12%; border: 2px solid black; border-bottom: none' class='acy acn' onclick='localStats.dropout.autoClick = 1 - localStats.dropout.autoClick; localStats.dropout.updatehud(2)'>Auto Click</td>"
									+"<td style='width:15%; border: 2px solid black; border-right:1px solid black'> Auto Click <div id='multl'></div></td>"
									+"<td style='width:5%; border-top: 2px solid black; border-bottom: 2px solid black; background-color: #AFA' onclick='localStats.dropout.cupmultl = Math.min(localStats.dropout.cupmultl + 1, localStats.dropout.cupmultm); localStats.dropout.updatehud(16)'> + </td>"
									+"<td style='width:5%; border: 2px solid black; border-left: 1px solid black; background-color: #FAA' onclick='localStats.dropout.cupmultl = Math.max(localStats.dropout.cupmultl - 1, 0); localStats.dropout.updatehud(16)'> - </td></tr>"
									+"<tr><td style='width:6%; height:35px; border: 2px solid black; border-top: 1px solid black' class='apn' onclick='localStats.dropout.autoBuy = 0; localStats.dropout.updatehud(1)'> Off </td>"
									+"<td style='width:6%; border: 2px solid black; border-top: 1px solid black' class='apy' onclick='localStats.dropout.autoBuy = 1; localStats.dropout.updatehud(1)'> On </td>"
									+"<td style='width:6%; border: 2px solid black; border-top: 1px solid black' class='drip0' onclick='localStats.dropout.autoDrip = 0; localStats.dropout.updatehud(4)'> Never </td>"
									+"<td style='width:6%; border: 2px solid black; border-top: 1px solid black' class='drip1' onclick='localStats.dropout.autoDrip = 1; localStats.dropout.updatehud(4)'> At <br /> Limit </td>"
									+"<td style='width:6%; border: 2px solid black; border-top: 1px solid black' class='drip2' onclick='localStats.dropout.autoDrip = 2; localStats.dropout.updatehud(4)'> For <br /> Costs </td>"
									+"<td style='width:5.5%; border: 2px solid black; border-top: 1px solid black' class='acn' onclick='localStats.dropout.autoClick = 0; localStats.dropout.updatehud(2)'> Off </td>"
									+"<td style='width:5.5%; border: 2px solid black; border-top: 1px solid black' class='acy' onclick='localStats.dropout.autoClick = 1; localStats.dropout.updatehud(2)'> On </td>"
									+"<td style='width:16%; border: 2px solid black; border-right:1px solid black'> Auto Click <div id='multm'></div></td>"
									+"<td style='width:5%; border-top: 2px solid black; border-bottom: 2px solid black; background-color: #AFA' onclick='localStats.dropout.cupmultm = Math.min(localStats.dropout.cupmultm + 1, 20); localStats.dropout.updatehud(32)'> + </td>"
									+"<td style='width:5%; border: 2px solid black; border-left: 1px solid black; background-color: #FAA' onclick='localStats.dropout.cupmultm = Math.max(localStats.dropout.cupmultm - 1, localStats.dropout.cupmultl); localStats.dropout.updatehud(32)'> - </td></tr>"
									+"<tr><td colspan=2 style='height:35px; border: 2px solid black; border-right: none'> Average Click Rate per second - Last 10s: </td>"
									+"<td style='border: 2px solid black; border-left: none'><strong><div id='click-rate-10'></div></strong></td>"
									+"<td colspan=2 style='border: 2px solid black; border-right: none'> Last 60s: </td>"
									+"<td style='border: 2px solid black; border-left: none'><strong><div id='click-rate-60'></div></strong></td>"
									+"<td colspan=3 style='border: 2px solid black; border-right: none' class='rty rtn' onclick='localStats.dropout.clickToggle = 1 - localStats.dropout.clickToggle; localStats.dropout.updatehud(64)'> Randomly toggle Auto Click? </td>"
									+"<td style='border: 2px solid black; border-left: 1px solid black; border-right: 1px solid black' class='rty' onclick='localStats.dropout.clickToggle = 1; localStats.dropout.updatehud(64)'> Yes </td>"
									+"<td style='border: 2px solid black; border-left: none' class='rtn' onclick='localStats.dropout.clickToggle = 0; localStats.dropout.updatehud(64)'> No </td></tr>"
									+"<tr><td style='height:35px; border: 2px solid black; border-right: none' class='cry crn' onclick='localStats.dropout.clickRate = 1 - localStats.dropout.clickRate; localStats.dropout.updatehud(8)'> Take click rate into account? </td>"
									+"<td style='border: 2px solid black; border-left: 1px solid black; border-right: 1px solid black' class='cry' onclick='localStats.dropout.clickRate = 1; localStats.dropout.updatehud(8)'> Yes </td>"
									+"<td style='border: 2px solid black; border-left: none' class='crn' onclick='localStats.dropout.clickRate = 0; localStats.dropout.updatehud(8)'> No </td>"
									+"<td colspan=3 style='border: 2px solid black; border-right:1px solid black'> Odds to Enable: <strong><div id='rton'></div></strong></td>"
									+"<td style='border-top: 2px solid black; border-bottom: 2px solid black; background-color: #AFA' onclick='localStats.dropout.clickToggleOn = Math.min(localStats.dropout.clickToggleOn + 1, 100); localStats.dropout.updatehud(128)'> + </td>"
									+"<td style='border: 2px solid black; border-left: 1px solid black; background-color: #FAA' onclick='localStats.dropout.clickToggleOn = Math.max(localStats.dropout.clickToggleOn - 1, 0); localStats.dropout.updatehud(128)'> - </td>"
									+"<td style='border: 2px solid black; border-right:1px solid black'> Odds to Disable: <strong><div id='rtoff'></div></strong></td>"
									+"<td style='border-top: 2px solid black; border-bottom: 2px solid black; background-color: #AFA' onclick='localStats.dropout.clickToggleOff = Math.min(localStats.dropout.clickToggleOff + 1, 100); localStats.dropout.updatehud(256)'> + </td>"
									+"<td style='border: 2px solid black; border-left: 1px solid black; background-color: #FAA' onclick='localStats.dropout.clickToggleOff = Math.max(localStats.dropout.clickToggleOff - 1, 0); localStats.dropout.updatehud(256)'> - </td></tr></table>");
	$("#next-purchase-container").html("<div id='next-purchase-label'></div><div id='next-purchase-payback'></div><div id='next-purchase-time'></div><div id='max-space-label'></div>");
	
	$("head").append("<style id='tweaks'></style>");
	$("#tweaks").text('.navbar {max-height: 50px}'
	+'#upgrades .item {height: 50px}'
	+'#bpsChartContainer {padding-bottom: 2px}'
	+'#upgrades {height: 85px; line-height: 1.2}'
	+'#upgrades .upgcontainer {height: 85px; overflow-y: hidden}'
	+'#upgrades .upgROI {font-weight: bolder; text-align: center; color:#F00}'
	+'.storeItem {position: relative;}'
	+'.storeItemName {font-size: 130%}'
	+'.storeItemAmount {font-size: 200%; line-height: 1.25}'
	+'.storePriceRow {display: table}'
	+'.storeROI {display: table-cell; padding-left: 4px; font-size: 0.9em; font-weight: bolder; color: #F00}'
	+'.powerup-one {position: absolute; text-align: right; font-weight: bolder; font-size: 130%; top: 1px; right: 67px}'
	+'.powerup-all {position: absolute; text-align: right; font-weight: bolder; font-size: 130%; top: 26px; right: 70px; color: #BD511E}'
	+'.powerup-pct {position: absolute; text-align: right; font-weight: bolder; top: 30px; right: 4px; color: #F00; opacity: 0.6}');
	
	localStats.dropout.updatehud(511);
}

//Reimplementing these functions at the script level, because otherwise we lose "@grant none" and its scoping.
//Code snippets courtesy of Anthony Lieuallen.
const __GM_STORAGE_PREFIX = [
    '', GM_info.script.namespace, GM_info.script.name, ''].join('***');

function GM_getValue(aKey, aDefault) {
  'use strict';
  let val = localStorage.getItem(__GM_STORAGE_PREFIX + aKey)
  if (null === val && 'undefined' != typeof aDefault) return aDefault;
  return val;
}

function GM_setValue(aKey, aVal) {
  'use strict';
  localStorage.setItem(__GM_STORAGE_PREFIX + aKey, aVal);
}

setInterval(function(){loop();}, 1000);
