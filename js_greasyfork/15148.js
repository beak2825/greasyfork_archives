// ==UserScript==
// @name         Dangers of Fracking performance booster
// @namespace    http://richardhunter.co.uk/
// @version      0.10
// @description  Will improve the run-time performance of dangersoffracking.com site
// @author       Richard Hunter
// @match        http://www.dangersoffracking.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15148/Dangers%20of%20Fracking%20performance%20booster.user.js
// @updateURL https://update.greasyfork.org/scripts/15148/Dangers%20of%20Fracking%20performance%20booster.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//  unbind existing scroll handlers, effectively disabling existing scripts
$(window).off('scroll');

/*FRACKING JS - Linda Dong */
/* refactored December 2015 by Richard Hunter, blog.richardhunter.co.uk */

/*Icon Collection*/



$(function () {

	var css = [
		'article {	display : block !important; transition : 0.5s linear opacity; opacity : 0 !important; }\n',
		'article#footer { opacity : 1 !important; }\n',
		'article.fade-in { opacity : 0.8 !important; }\n'
	].join('');

	if (typeof GM_addStyle != "undefined") {
		GM_addStyle(css);
	} else if (typeof PRO_addStyle != "undefined") {
		PRO_addStyle(css);
	} else if (typeof addStyle != "undefined") {
		addStyle(css);
	} else {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		var heads = document.getElementsByTagName("head");
		if (heads.length > 0) {
			heads[0].appendChild(node);
		} else {
			// no head yet, stick it wherever
			document.documentElement.appendChild(node);
		}
	}

	var scrollTop, windowHeight;

	//  true if scroll handler has requested RAF
	var scroll = false;

	var $toxin = $("#toxin");
	var $gas = $("#gas");
	var $iconTruck = $("#icontruck");
	var $iconWater = $("#iconwater");
	var $iconToxic = $("#icontoxic");
	var $iconFluid = $("#iconfluid");
	var $iconFluid2 = $("#iconfluid2");
	var $iconMethane = $("#iconmethane");
	var $iconNoWater = $("#iconnowater");
	var $iconHealth = $("#iconhealth");
	var $iconAir = $("#iconair");
	var $iconGas = $("#icongas");
	var $cloud1 = $("#cloud1");
	var $cloud2 = $("#cloud2");
	var $cloud3 = $("#cloud3");
	var $cloud4 = $("#cloud4");
	var $cloud5 = $("#cloud5");
	var $cloud6 = $("#cloud6");
	var $cloud7 = $("#cloud7");
	var $cloud8 = $("#cloud8");
	var $cloud9 = $("#cloud9");


	var $cloudA = $("#clouda");
	var $cloudB = $("#cloudb");
	var $cloudC = $("#cloudc");
	var $cloudC2 = $("#cloudc2");

	var $cloudD = $("#cloudd");
	var $cloudE = $("#cloude");
	var $cloudF = $("#cloudf");

	var $house = $("#house");
	var $house2 = $("#house2");
	var $house3 = $("#house3");

	var $bubbles = $("#bubbles");
	var $bubbles2 = $("#bubbles2");
	var $bubbles3 = $("#bubbles3");
	var $bubbles4 = $("#bubbles4");

	var $drop = $("#drop");
	var $meter = $("#meter");
	var $hill = $('#hill');
	var $mrTruck = $("#mrtruck");
	var $targetTruck = $('#targettruck');
	var $targetTruck2 = $('#targettruck2');
	var $road = $('#road');
	var $targetChemical = $('#targetchemical');
	var $pit1 = $('#pit1');
	var $tox2 = $('#tox2');
	var $trigger1 = $('#trigger1');
	var $trigger2 = $('#trigger2');
	var $trigger3 = $('#trigger3');
	var $pipe = $('#pipe');
	var $pipeCurve = $('#pipecurve');
	var $cityPipe = $('#citypipe');
	var $ground3 = $('#ground3');
	var $chemicalTrigger = $('#chemicaltrigger');

	var $redMessage = $('#red');
	var $textTrucksMessage = $('#texttrucks');
	var $textTrucks2Message = $('#texttrucks2');
	var $chemicals2WrapperMessage = $('#chemicals2wrapper');
	var $chemicalsMessage = $('#chemicals');
	var $chemicals2Message = $('#chemicals2');
	var $chemicals3Message = $('#chemicals3');
 	var $chemicals4Message = $('#chemicals4');
	var $descriptionMessage = $('#description');
	var $vocMessage = $('#voc');
	var $recoveredMessage = $('#recovered');
	var $methaneMessage = $('#methane');
	var $methane2Message = $('#methane2');
	var $cityWaterMessage = $('#citywater');
	var $cracksMessage = $('#cracks');
	var $cracks3Message = $('#cracks3');
	var $mathMessage = $('#math');

	var roadScrolledIntoView,
			pipeScrolledIntoView,
			cloud6ScrolledIntoView,
			hillScrolledIntoView,
			targetTruckScrolledIntoView,
			ground3ScrolledIntoView,
			trigger1ScrolledIntoView,
			trigger2ScrolledIntoView,
			pipeCurveScrolledIntoView,
			meterScrolledIntoView,
			trigger3ScrolledIntoView,
			tox2ScrolledIntoView ,
			cityPipeScrolledIntoView,
			pit1ScrolledIntoView,
			cloudFScrolledIntoView,
			targetTruck2ScrolledIntoView,
			targetChemicalScrolledIntoView,
			chemicalTriggerScrolledIntoView;

	$(window).scroll(scrollHandler);

	function scrollHandler() {
		scroll = true;
	}

	window.requestAnimationFrame(raf);

	function raf() {
		window.requestAnimationFrame(raf);
		if(scroll) {
			scroll = false;
			update();
		}
	}

	function update() {

		// cache scroll top and height calls
		scrollTop = $(window).scrollTop();
		var st = window.scrollY;
		windowHeight = $(window).height();

		roadScrolledIntoView = isScrolledIntoView($road, windowHeight, scrollTop);
		pipeScrolledIntoView = isScrolledIntoView($pipe, windowHeight, scrollTop);
		cloud6ScrolledIntoView = isScrolledIntoView($cloud6, windowHeight, scrollTop);
		hillScrolledIntoView = isScrolledIntoView($hill, windowHeight, scrollTop);
		targetTruckScrolledIntoView = isScrolledIntoView($targetTruck, windowHeight, scrollTop);
		targetTruck2ScrolledIntoView = isScrolledIntoView($targetTruck2, windowHeight, scrollTop);
		targetChemicalScrolledIntoView = isScrolledIntoView($targetChemical, windowHeight, scrollTop);
		chemicalTriggerScrolledIntoView = isScrolledIntoView($chemicalTrigger, windowHeight, scrollTop);
		ground3ScrolledIntoView = isScrolledIntoView($ground3, windowHeight, scrollTop);
		trigger1ScrolledIntoView = isScrolledIntoView($trigger1, windowHeight, scrollTop);
		trigger2ScrolledIntoView = isScrolledIntoView($trigger2, scrollTop);
		pipeCurveScrolledIntoView = isScrolledIntoView($pipeCurve, windowHeight, scrollTop);
		meterScrolledIntoView = isScrolledIntoView($meter, windowHeight, scrollTop);
		trigger3ScrolledIntoView = isScrolledIntoView($trigger3, windowHeight, scrollTop);
		tox2ScrolledIntoView = isScrolledIntoView($tox2, windowHeight, scrollTop);
		cityPipeScrolledIntoView = isScrolledIntoView($cityPipe, windowHeight, scrollTop);
		pit1ScrolledIntoView  = isScrolledIntoView($pit1, windowHeight, scrollTop);
		cloudFScrolledIntoView = isScrolledIntoView($cloudF, windowHeight, scrollTop);

		/*Droplet*/
		if (scrollTop > 7500) {
			setPosition($toxin, "fixed");
			setTop($toxin, 460);
		} else {
			setPosition($toxin, "absolute");
			setTop($toxin, 7500);
		}
		if (scrollTop > 15200) {
			setPosition($gas, "fixed");
			setTop($gas, 335);
		} else {
			setPosition($gas, "absolute");
			setTop($gas, 15180);
		}

		/* Tokens */
		if (scrollTop > 3850) {
			setPosition($iconTruck, "fixed");
			setTop($iconTruck, 0);
			setOpacity($iconTruck, "1");
		} else {
			setPosition($iconTruck, "absolute");
			setTop($iconTruck, 3850);
			setOpacity($iconTruck, "0.4");
		}
		if (scrollTop > 4720) {
			setPosition($iconWater, "fixed");
			setTop($iconWater, 0);
			setOpacity($iconWater,"1");
		} else {
			setPosition($iconWater, "absolute");
			setTop($iconWater, 4720);
			setOpacity($iconWater, "0.4");
		}
		if (scrollTop > 7610) {
			setPosition($iconToxic, "fixed");
			setTop($iconToxic, 0);
			setOpacity($iconToxic, "1");
		} else {
			setPosition($iconToxic, "absolute");
			setTop($iconToxic, 7610);
			setOpacity($iconToxic, "0.4");
		}
		if (scrollTop > 6250) {
			setPosition($iconFluid2, "fixed");
			setTop($iconFluid2, 0);
			setOpacity($iconFluid2, "1");
		} else {
			setPosition($iconFluid2, "absolute");
			setTop($iconFluid2, 6250);
			setOpacity($iconFluid2, "0.4");
		}
		if (scrollTop > 17100) {
			setPosition($iconMethane, "fixed");
			setTop($iconMethane, 0);
			setOpacity($iconMethane,"1");
		} else {
			setPosition($iconMethane, "absolute");
			setTop($iconMethane, 17100);
			setOpacity($iconMethane,"0.4");
		}
		if (scrollTop > 18640) {
			setPosition($iconNoWater, "fixed");
			setTop($iconNoWater, 0);
			setOpacity($iconNoWater, "1");
		} else {
			setPosition($iconNoWater, "absolute");
			setTop($iconNoWater, 18640);
			setOpacity($iconNoWater, "0.4");
		}
		if (scrollTop > 18640) {
			setPosition($iconHealth, "fixed");
			setTop($iconHealth, 0);
			setOpacity($iconHealth, "1");
		} else {
			setPosition($iconHealth, "absolute");
			setTop($iconHealth, 18640);
			setOpacity($iconHealth, "0.4");
		}
		if (scrollTop > 20600) {
			setPosition($iconFluid, "fixed");
			setTop($iconFluid, 0);
			setOpacity($iconFluid, "1");
		} else {
			setPosition($iconFluid, "absolute");
			setTop($iconFluid, 20600);
			setOpacity($iconFluid, "0.4");
		}
		if (scrollTop > 21600) {
			setPosition($iconAir, "fixed");
			setTop($iconAir, 0);
			setOpacity($iconAir, "1");
		} else {
			setPosition($iconAir, "absolute");
			setTop($iconAir, 21600);
			setOpacity($iconAir, "0.4");
		}
		if (scrollTop > 22320) {
			setPosition($iconGas, "fixed");
			setTop($iconGas, 0);
			setOpacity($iconGas,"1");
		} else {
			setPosition($iconGas, "absolute");
			setTop($iconGas, 22320);
			setOpacity($iconGas,"1");
		}

		/*Clouds*/
		setTop($cloud1, 350 - scrollTop * 1.3 );
		setTop($cloud2, 500 - scrollTop * 1.5 );
		setTop($cloud3, 590 - scrollTop * 0.2);
		setTop($cloud4, 420 - scrollTop * 0.5);
		setTop($cloud5, 775 - scrollTop * 1.7);
		setTop($cloud6, 1550 - scrollTop * 0.6);
		setTop($cloud7, 1050 - scrollTop * 0.4);
		setTop($cloud8, 1800 - scrollTop * 1.);
		setTop($cloud9, 2500 - scrollTop * 1.1);

		setTop($house, 4500 - scrollTop * 1.1 );
		setTop($house2, 7000 - scrollTop * 1.1);
		setTop($house3, 8600 - scrollTop * 1.1 );

		setTop($cloudA, 3400 - scrollTop * 0.4 );
		setTop($cloudB, 9400 - scrollTop * 1.3 );
		setTop($cloudC, 2500 - scrollTop * 0.3 );
		setTop($cloudC2, 10500 - scrollTop * 1.3 );

		setTop($bubbles, 10400 - scrollTop * 0.6);
		setTop($bubbles2, 5200 - scrollTop * 0.3);
		setTop($bubbles3, 6100 - scrollTop * 0.3 );
		setTop($bubbles4, 15900 - scrollTop * 0.9);
		/*Aquifer*/

		setTop($cloudD, 7200 - scrollTop * 0.3);
		setTop($cloudE, 22200 - scrollTop * 1.0);
		setTop($cloudF, 17400 - scrollTop * 0.8);

		if(roadScrolledIntoView) {
			setDisplay($drop, 'none');
		} else {
			setDisplay($drop, 'block');
		}

		if(pipeScrolledIntoView){
			setDisplay($mrTruck, 'none');
		} else {
			setDisplay($mrTruck, 'block');
		}

		if(pipeScrolledIntoView) {
			setTransform($meter, "rotate(0deg)");
		} else {
			setTransform($meter, "rotate(-180deg)");
		}

		if(cloud6ScrolledIntoView) {
			fadeIn($descriptionMessage);
		} else {
			fadeOut($descriptionMessage);
		}

		if(hillScrolledIntoView) {
			fadeIn($redMessage);
		} else {
			fadeOut($redMessage);
		}

		if(targetTruckScrolledIntoView) {
			fadeIn($textTrucksMessage);
		} else {
			fadeOut($textTrucksMessage);
		}

		if(targetTruck2ScrolledIntoView) {
			fadeIn($textTrucks2Message);
		} else {
			fadeOut($textTrucks2Message);
		}

		if(targetChemicalScrolledIntoView) {
			fadeIn($chemicalsMessage);
		} else {
			fadeOut($chemicalsMessage);
		}

		if(chemicalTriggerScrolledIntoView) {
			fadeIn($chemicals2Message);
		} else {
			fadeOut($chemicals2Message);
		}

		if(pipeScrolledIntoView) {
			fadeIn($chemicals2WrapperMessage);
		} else {
			fadeOut($chemicals2WrapperMessage);
		}

		if(ground3ScrolledIntoView) {
			fadeIn($chemicals3Message);
		} else {
			fadeOut($chemicals3Message);
		}

		if(trigger1ScrolledIntoView) {
			fadeIn($chemicals4Message);
		} else {
			fadeOut($chemicals4Message);
		}

		if(trigger2ScrolledIntoView) {
			fadeIn($mathMessage);
		} else {
			fadeOut($mathMessage);
		}

		if(pipeCurveScrolledIntoView) {
			fadeIn($methaneMessage);
		} else {
			fadeOut($methaneMessage);
		}

		if(meterScrolledIntoView) {
			fadeIn($cracksMessage);
		} else {
			fadeOut($cracksMessage);
		}

		if(trigger3ScrolledIntoView) {
			fadeIn($cracks3Message);
		} else {
			fadeOut($cracks3Message);
		}

		if(tox2ScrolledIntoView) {
			fadeIn($methane2Message);
		} else {
			fadeOut($methane2Message);
		}

		if(cityPipeScrolledIntoView) {
			fadeIn($cityWaterMessage);
		} else {
			fadeOut($cityWaterMessage);
		}

		if(pit1ScrolledIntoView){
			fadeIn($recoveredMessage);
		} else {
			fadeOut($recoveredMessage);
		}

		if(cloudFScrolledIntoView) {
			fadeIn($vocMessage);
		} else {
			fadeIn($vocMessage);
		}
	}

	function fadeIn($el) {
		$el[0].classList.add('fade-in');
	}
	function fadeOut($el) {
		$el[0].classList.remove('fade-in');
	}

	function setDisplay($el, display) {
		$el[0].style.display = display;
	}

	function setPosition($el, position) {
		$el[0].style.position = position;
	}

	function setTop($el, top) {
		$el[0].style.top = top + "px";
	}

	function setOpacity($el, opacity) {
		$el[0].style.opacity = opacity;
	}

	function setTransform($el) {
		$el[0].style['webkit-transform'] = "rotate(0deg)";
	}

	function isScrolledIntoView($elem, windowHeight, scrollTop) {
		var docViewTop = scrollTop;
		var docViewBottom = docViewTop + windowHeight;

		var elemTop = $elem.offset().top;
		var elemBottom = elemTop + $elem.height();

		return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
	}
});







