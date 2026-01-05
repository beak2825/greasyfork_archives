// ==UserScript==
// @name         Project Endor (Zoltar) Temporary Fix
// @namespace    https://greasyfork.org/en/users/12709
// @version      1.0.03.09
// @description  easy clicks  for zoltars
// @author       feihtality
// @match        https://www.google.com/evaluation/endor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18211/Project%20Endor%20%28Zoltar%29%20Temporary%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/18211/Project%20Endor%20%28Zoltar%29%20Temporary%20Fix.meta.js
// ==/UserScript==
/*jshint esnext:true*/

var gCarDealer = false;
var gUsedCarDealer = false;
var gDentist = false;

(function() {

	setTimeout( function() {
		var _p = document.querySelector('p');
		if (!/previewand/.test(document.referrer) && _p && /An error occurred/.test(_p.textContent)) document.location.reload();
		if (!/In this HIT we will ask you some questions/.test(document.querySelector('.question-container').textContent)) return;
		if (/Please check whether it's a website for a new car dealer in US/.test(document.getElementsByClassName('question-content')[1].textContent)) gCarDealer=true;
		if (/Includes dental, orthodontic, and oral surgery professionals/.test(document.getElementsByClassName('question-content')[1].textContent)) gDentist=true;
		if (/Business Category: Used Car Dealer/.test(document.getElementsByClassName('question-content')[1].textContent)) gUsedCarDealer=true;

		function make(tag) { return document.createElement(tag); }
		function get(val) { return document.querySelector('[value="'+val+'"]'); }
		function getID(theID) { return document.getElementById(theID); }
		function get2(val) { return document.querySelector(`[ng-true-value="'${val}'"]`); }
		function get3(val) { return document.querySelector('[aria-label="' + val + '"]'); }

		var div = document.body.appendChild(make('DIV')),
			p1 = div.appendChild(make('P')), p2 = div.appendChild(make('P')), p3 = div.appendChild(make('P')),
			p4 = div.appendChild(make('P')), p5 = div.appendChild(make('p')), p6 = div.appendChild(make('P'));
        if (gCarDealer) {
            var panel = {
                    p1: {
                        node: p1, options: {radio: true},
                        "Auto Dealer" :    { controller: make('BUTTON'), target: 'YES', type: "radio" },
                        "NOT Auto Franchise Dealer" : { controller: make('BUTTON'), target: 'NO', type: "radio" },
                        "Not Available" :     { controller: make('BUTTON'), target: 'NO', type: "checkbox" },
                    },
                    p2: {
                        node: p2, options: {radio: true},
                    },
                    p3: {
                        node: p3, options: {radio: true},
                    },
                    p4: {
                        node: p4, options: {radio: false},
                    },
                    p5: {
                        node: p5, options: {radio: true},
                    },
                    p6: {
                        node: p6, options: {radio: true},
                        SUBMIT : { controller: make('BUTTON'), target: 'submit', type: "submit" },
                    }
                };
        } else if (gDentist) {
            var panel = {
                    p1: {
                        node: p1, options: {radio: true},
                        "Dentist" :    { controller: make('BUTTON'), target: 'YES', type: "radio" },
                        "NOT Dentist" : { controller: make('BUTTON'), target: 'NO', type: "radio" },
                        "Not Available" :     { controller: make('BUTTON'), target: 'NO', type: "checkbox" },
                    },
                    p2: {
                        node: p2, options: {radio: true},
                    },
                    p3: {
                        node: p3, options: {radio: true},
                    },
                    p4: {
                        node: p4, options: {radio: false},
                    },
                    p5: {
                        node: p5, options: {radio: true},
                    },
                    p6: {
                        node: p6, options: {radio: true},
                        SUBMIT : { controller: make('BUTTON'), target: 'submit', type: "submit" },
                    }
                };
        } else if (gUsedCarDealer) {
            var panel = {
                    p1: {
                        node: p1, options: {radio: true},
                        "Used Car Dealer" :    { controller: make('BUTTON'), target: 'YES', type: "radio" },
                        "NOT Used Car Dealer" : { controller: make('BUTTON'), target: 'NO', type: "radio" },
                        "Not Available" :     { controller: make('BUTTON'), target: 'NO', type: "checkbox" },
                    },
                    p2: {
                        node: p2, options: {radio: false},
                        Acura : { controller: make('BUTTON'), target: 'Acura', type: "checkbox1" },
                        "Alfa Romeo" : { controller: make('BUTTON'), target: 'Alfa Romeo', type: "checkbox1" },
                        "Aston Martin" : { controller: make('BUTTON'), target: 'Aston Martin', type: "checkbox1" },
                        Audi : { controller: make('BUTTON'), target: 'Audi', type: "checkbox1" },
                        Bentley : { controller: make('BUTTON'), target: 'Bentley', type: "checkbox1" },
                        BMW : { controller: make('BUTTON'), target: 'BMW', type: "checkbox1" },
                        Buick : { controller: make('BUTTON'), target: 'Buick', type: "checkbox1" },
                        Cadillac : { controller: make('BUTTON'), target: 'Cadillac', type: "checkbox1" },
                        "Chevrolet" : { controller: make('BUTTON'), target: 'Chevrolet', type: "checkbox1" },
                        Chrysler : { controller: make('BUTTON'), target: 'Chrysler', type: "checkbox1" },
                        Dodge : { controller: make('BUTTON'), target: 'Dodge', type: "checkbox1" },
                        Ferrari : { controller: make('BUTTON'), target: 'Ferrari', type: "checkbox1" },
                        Fiat : { controller: make('BUTTON'), target: 'Fiat', type: "checkbox1" },
                        "Ford" : { controller: make('BUTTON'), target: 'Ford', type: "checkbox1" },
                        GMC : { controller: make('BUTTON'), target: 'GMC', type: "checkbox1" },
                        Holden : { controller: make('BUTTON'), target: 'Holden', type: "checkbox1" },
                        Honda : { controller: make('BUTTON'), target: 'Honda', type: "checkbox1" },
                        Hyundai : { controller: make('BUTTON'), target: 'Hyundai', type: "checkbox1" },
                        Infiniti : { controller: make('BUTTON'), target: 'Infiniti', type: "checkbox1" },
                        Isuzu : { controller: make('BUTTON'), target: 'Isuzu', type: "checkbox1" },
                        Jaguar : { controller: make('BUTTON'), target: 'Jaguar', type: "checkbox1" },
                        Jeep : { controller: make('BUTTON'), target: 'Jeep', type: "checkbox1" },
                        Kia : { controller: make('BUTTON'), target: 'Kia', type: "checkbox1" },
                        Lamborghini : { controller: make('BUTTON'), target: 'Lamborghini', type: "checkbox1" },
                        "Land Rover" : { controller: make('BUTTON'), target: 'Land Rover', type: "checkbox1" },
                        Lexus : { controller: make('BUTTON'), target: 'Lexus', type: "checkbox1" },
                        Lincoln : { controller: make('BUTTON'), target: 'Lincoln', type: "checkbox1" },
                        Lotus : { controller: make('BUTTON'), target: 'Lotus', type: "checkbox1" },
                        Maserati : { controller: make('BUTTON'), target: 'Maserati', type: "checkbox1" },
                        Mazda : { controller: make('BUTTON'), target: 'Mazda', type: "checkbox1" },
                        McLaren : { controller: make('BUTTON'), target: 'McLaren', type: "checkbox1" },
                        "Mercedes-Benz" : { controller: make('BUTTON'), target: 'Mercedes-Benz', type: "checkbox1" },
                        MINI : { controller: make('BUTTON'), target: 'MINI', type: "checkbox1" },
                        Mitsubishi : { controller: make('BUTTON'), target: 'Mitsubishi', type: "checkbox1" },
                        Nissan : { controller: make('BUTTON'), target: 'Nissan', type: "checkbox1" },
                        Pagani : { controller: make('BUTTON'), target: 'Pagani', type: "checkbox1" },
                        Peugeot : { controller: make('BUTTON'), target: 'Peugeot', type: "checkbox1" },
                        Porsche : { controller: make('BUTTON'), target: 'Porsche', type: "checkbox1" },
                        Ram : { controller: make('BUTTON'), target: 'Ram', type: "checkbox1" },
                        "Rolls-Royce" : { controller: make('BUTTON'), target: 'Rolls-Royce', type: "checkbox1" },
                        Scion : { controller: make('BUTTON'), target: 'Scion', type: "checkbox1" },
                        Smart : { controller: make('BUTTON'), target: 'Smart', type: "checkbox1" },
                        Subaru : { controller: make('BUTTON'), target: 'Subaru', type: "checkbox1" },
                        Toyota : { controller: make('BUTTON'), target: 'Toyota', type: "checkbox1" },
                        Volkswagen : { controller: make('BUTTON'), target: 'Volkswagen', type: "checkbox1" },
                        Volvo : { controller: make('BUTTON'), target: 'Volvo', type: "checkbox1" }
                    },
                    p3: {
                        node: p3, options: {radio: true},
                    },
                    p4: {
                        node: p4, options: {radio: false},
                    },
                    p5: {
                        node: p5, options: {radio: true},
                    },
                    p6: {
                        node: p6, options: {radio: true},
                        SUBMIT : { controller: make('BUTTON'), target: 'submit', type: "submit" },
                    }
                };
        } else {
            var panel = {
                    p1: {
                        node: p1, options: {radio: true},
                        goods :    { controller: make('BUTTON'), target: 'GOODS', type: "radio" },
                        services : { controller: make('BUTTON'), target: 'SERVICES', type: "radio" },
                        both :     { controller: make('BUTTON'), target: 'BOTH', type: "radio" },
                    },
                    p2: {
                        node: p2, options: {radio: true},
                        provider : { controller: make('BUTTON'), target: 'DIRECT_PROVIDER', type: "radio" },
                        retailer : { controller: make('BUTTON'), target: 'RETAILER', type: "radio" },
                        referral : { controller: make('BUTTON'), target: 'REFERRAL_AGGREGATOR', type: "radio" },
                        search :   { controller: make('BUTTON'), target: 'SEARCH_ENGINE', type: "radio" },
                        market :   { controller: make('BUTTON'), target: 'MARKETPLACE', type: "radio" },
                        deals :    { controller: make('BUTTON'), target: 'DEALS_PROVIDER', type: "radio" },
                        content :  { controller: make('BUTTON'), target: 'CONTENT_PUBLISHER', type: "radio" },
                    },
                    p3: {
                        node: p3, options: {radio: true},
                        physnone :           { controller: make('BUTTON'), target: 'NONE', type: "radio" },
                        single :             { controller: make('BUTTON'), target: 'LOCAL_SINGLETON', type: "radio" },
                        singleRegionBranch : { controller: make('button'), target: 'SINGLE_REGION_BRANCHES', type: "radio" },
                        multiRegionBranch :  { controller: make('button'), target: 'MULTIPLE_REGION_BRANCHES', type: "radio" },
                    },
                    p4: {
                        node: p4, options: {radio: false},
                        virtual: { controller: make('button'), target: 'VIRTUAL', type: "checkbox" },
                        custLoc: { controller: make('button'), target: 'CUSTOMER_LOCATION', type: "checkbox" },
                        busiLoc: { controller: make('button'), target: 'BUSINESS_LOCATION', type: "checkbox" },
                    },
                    p5: {
                        node: p5, options: {radio: true},
                        direct :     { controller: make('BUTTON'), target: 'DIRECT', type: "radio" },
                        both   :     { controller: make('BUTTON'), target: 'radio_16', type: "radioID" },
                        indirect :   { controller: make('BUTTON'), target: 'INDIRECT', type: "radio" },
                    },
                    p6: {
                        node: p6, options: {radio: true},
                        SUBMIT : { controller: make('BUTTON'), target: 'submit', type: "submit" },
                    }
                };
        }
		div.style.cssText = "z-index:10; position:fixed; top:10%;right:50%; background:#eee; opacity:0.9; transform:translateX(50%);";
		div.className = 'zoltarpanel';

		var css = document.head.appendChild(document.createElement('STYLE'));
		css.innerHTML = '.zoltarpanel p {margin:5px}';

		function sel(group, item) { 
			item.controller.onclick = () => { 
				var prev = group.node.querySelector('[style]');
				if (prev && group.options.radio == true) prev.style.background = '';
				if (item.type=="radio") get(item.target).click();
				else if (item.type=="checkbox") get2(item.target).click();
				else if (item.type=="checkbox1") {
					get("YES").click();
					get3(item.target).click();
				} else if (item.type=="radioID") getID(item.target).click();
				else if (item.type=="submit") document.querySelector('input[type=submit]').click();
				if (group.options.radio == false) item.controller.style.background = (item.controller.style.background.indexOf('lightgreen') != -1) ? '' : 'lightgreen';
				else item.controller.style.background = 'lightgreen';
				if (item.type=="radio") scroller(get(item.target));
				else if (item.type=="checkbox") scroller(get2(item.target));
				else if (item.type=="checkbox1") scroller(get3(item.target));
				else if (item.type=="radioID") scroller(getID(item.target));
				else if (item.type=="submit") scroller(document.querySelector('input[type=submit]'));
			};
		}
		function scroller(loc, dt) {
			var getPos = function(el) { var offset = 0; while(el) { offset += el.offsetTop; el = el.offsetParent; } return offset; },
				target = getPos(loc),
				pos = window.scrollY,
				dpos = Math.ceil((target-pos)/3);
			dt = dt ? dt-1 : 25;
			if (target === pos || dpos === 0 || dt === 0) return;
			window.scrollBy(0,dpos);
			setTimeout( () => scroller(loc, dt), dt);
		}

		for (var j of Object.keys(panel)) {
			for (var k of Object.keys(panel[j])) {
				if (k === 'node' || k === 'options') continue;
				panel[j].node.appendChild(panel[j][k].controller);
				panel[j][k].controller.textContent = k;
				sel(panel[j], panel[j][k]);
			}
		}
	}, 903);
})();