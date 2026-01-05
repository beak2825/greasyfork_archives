// ==UserScript==
// @name         Product auto-select.local1
// @version      5.5
// @description  auto-select products in CIAT
// @author       Yan
// @include      http*://*pvs.j*.net/jss-ciat/app/pr-detail*
// @include      http*://*pvs.j*.net/jss-ciat/app/searchPrProductPlatform*
// @include      https://gnats.juniper.net*
// @include      https://casemanager.juniper.net*
// @grant        none
// @namespace    www.ciat.com
// @downloadURL https://update.greasyfork.org/scripts/10373/Product%20auto-selectlocal1.user.js
// @updateURL https://update.greasyfork.org/scripts/10373/Product%20auto-selectlocal1.meta.js
// ==/UserScript==


EXs = {162:"EX2200",147:"EX2500", 603675:"EX430024P",188:"EX455032T",603688:"EX455032TAFO",258:"EX2200-12T-2G",111:"EX2200-24P-4G",603616:"EX2200-24P-4G-TAA",101:"EX2200-24T-4G",603615:"EX2200-24T-4G-DC",603617:"EX2200-24T-4G-TAA",105:"EX2200-48P-4G",603618:"EX2200-48P-4G-TAA",103:"EX2200-48T-4G",603619:"EX2200-48T-4G-TAA",168:"EX2200-C",196:"EX220012P2G",251:"EX220024TDC4G",212:"EX2200C12P2G",192:"EX2200C12T2G",163:"EX3200",19:"EX3200-24P",603620:"EX3200-24P-TAA",18:"EX3200-24T",104:"EX3200-24T-DC",21:"EX3200-48P",603622:"EX3200-48P-TAA",20:"EX3200-48T",106:"EX3200-48T-DC",603621:"EX3200-48T-TAA",170:"EX3300",249:"EX330024P",217:"EX330024T",603605:"EX330024TDC",197:"EX330048P",257:"EX330048T",232:"EX330048TBF",161:"EX4200",22:"EX4200-24F",156:"EX4200-24F-DC",603627:"EX4200-24F-TAA",24:"EX4200-24P",144:"EX4200-24P-DC",603624:"EX4200-24P-TAA",107:"EX4200-24PX",23:"EX4200-24T",143:"EX4200-24T-DC",603623:"EX4200-24T-TAA",145:"EX4200-48F-DC",26:"EX4200-48P",146:"EX4200-48P-DC",603626:"EX4200-48P-TAA",108:"EX4200-48PX",25:"EX4200-48T",148:"EX4200-48T-DC",603625:"EX4200-48T-TAA",603638:"EX4300-24T",603639:"EX4300-48P",164:"EX4500",195:"EX4500-40F",109:"EX4500-40F-BF",110:"EX4500-40F-BF-C",603640:"EX4500-40F-DC-C",112:"EX4500-40F-FB",113:"EX4500-40F-FB-C",114:"EX4500-40F-VC1-BF",115:"EX4500-40F-VC1-DC",116:"EX4500-40F-VC1-FB",187:"EX4550",229:"EX455032F",603636:"EX455032FAFO",180:"EX6200-48P",179:"EX6200-48T",169:"EX6210",47:"EX8200",165:"EX8200-40XS-ES",48:"EX8200-48F",172:"EX8200-48F-ES",49:"EX8200-48T",173:"EX8200-48T-ES",50:"EX8200-8XS",174:"EX8200-8XS-ES",27:"EX8208",149:"EX8216",270:"EX9200",271:"EX9204",603599:"EX9208",269:"EX9214",272:"EX9808",603653:"EX455032FAFI",603706:"EX4600",603707:"EX4600-40F",603695:"EX9216",603676:"EX430048T",603674:"EX430032F",603682:"EX4300",603683:"EX4200-VC"};
Dual_RE = {603691:"vmx",92:"T1600",69:"T320",166:"T4000",78:"T640",93:"TX-Matrix",142:"TX-Matrix-Plus",224:"TXP",215:"PTX5000",240:"PTX9000",603690:"PTX3000",32:"MX240",33:"MX480",34:"MX960",211:"MX2010",603677:"MX2020",15:"M10i",17:"M120",30:"M160",16:"M20",31:"M320",29:"M40e",270:"EX9200",271:"EX9204",603599:"EX9208",269:"EX9214",272:"EX9808",603695:"EX9216"};
Trio = {102:"MX10",603602:"MX80P",216:"MX10T",119:"MX40",250:"MX40-T",117:"MX5",219:"MX5T",160:"MX80",118:"MX80-48T",263:"MX80-T",32:"MX240",33:"MX480",34:"MX960",211:"MX2010",603677:"MX2020",166:"T4000",603685:"MX104"};
RtA = {92:"T1600",603685:"MX104",603602:"MX80P",69:"T320",166:"T4000",78:"T640",93:"TX-Matrix",142:"TX-Matrix-Plus",224:"TXP",239:"VJX1000",603691:"vmx",603690:"PTX3000",215:"PTX5000",240:"PTX9000",14:"M10",15:"M10i",17:"M120",30:"M160",16:"M20",31:"M320",28:"M40",29:"M40e",12:"M5",13:"M7i",102:"MX10",216:"MX10T",119:"MX40",250:"MX40-T",117:"MX5",219:"MX5T",160:"MX80",118:"MX80-48T",263:"MX80-T",32:"MX240",33:"MX480",34:"MX960",211:"MX2010",603677:"MX2020"};
SRX_HE = {121:"SRX-3400",122:"SRX-3600",95:"SRX-1400",123:"SRX-5600",124:"SRX-5800",603692:"SRX-5400",604188:"SRX1500"};
SRX_LE = {1:"SRX-100",605235:"SRX300",605231:"SRX320",605232:"SRX340",605234:"SRX345",226:"SRX240B",603702:"SRX220H2-POE",175:"SRX-110",603672:"SRX100H2",2:"SRX-210",157:"SRX-210-MGW",98:"SRX-220",96:"SRX-220-MGW",97:"SRX-220H",3:"SRX-240",158:"SRX-240-MGW",176:"SRX-550",35:"SRX-650",210:"SRX100B",207:"SRX100H",206:"SRX100HM",603607:"SRX110H-VB",603659:"SRX110H2-VA",603660:"SRX110H2-VB",243:"SRX110HVA",203:"SRX210B",241:"SRX210BE",220:"SRX210H",194:"SRX210HE",603661:"SRX210HE2",204:"SRX210HEPOE",260:"SRX210HPM",209:"SRX210HPOE",603662:"SRX220H2",198:"SRX220HPOE",603608:"SRX240B2",193:"SRX240H",603611:"SRX240H-POE-TAA",603610:"SRX240H-TAA",259:"SRX240H2",603609:"SRX240H2-DC",603606:"SRX240H2POE",246:"SRX240HDC",222:"SRX240HPOE",603612:"SRX550-645AP",603613:"SRX550-645DP",603614:"SRX650-BASE-SRE6-645AP",603630:"SRX650-BASE-SRE6-645DP"};
Product_window = /.*pvs.j.*\.net\/jss-ciat\/app\/.*productPlatformType.ciat-product&KeepThis=true&/i;
Platform_window= /.*pvs.j.*\.net\/jss-ciat\/app\/.*productPlatformType.ciat-platform&KeepThis=true&/i;
Sftree = /.*pvs\.j.*.net\/jss-ciat\/app\/softwareTree.*/i;
Gnats_site = /^https:\/\/gnats.juniper.net.*/i;
Top_window = /^http.*:\/\/.*pvs.j.*.net\/jss-ciat\/app\/pr-detail.*/i;
Case_manager = /^https:\/\/casemanager.juniper.net.*/i
Cur_win = window.location.href;

if (Product_window.test(Cur_win)) {
	addpr = document.getElementsByName("submitProductPlatform")[0];
	addpr.style.cssText ="background-color: rgb(92, 184, 92); border-color: rgb(76, 174, 76); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px;";
	Product = document.getElementsByName("productPlatformSearchSelected");
	addpr.value = "Submit";
	function check_EX() {
		for (var i=0, len=Product.length; i<len; i++) {
			if (Product[i].value in EXs) Product[i].checked = true;
		}
	}
	function check_Dual_RE() {
		for (var i=0, len=Product.length; i<len; i++) {
			if (Product[i].value in Dual_RE) Product[i].checked = true;
		}
	}
	function check_Trio() {
		for (var i=0, len=Product.length; i<len; i++) {
			if (Product[i].value in Trio) Product[i].checked = true;
		}
	}
	function check_Routing_ALL() {
		for (var i=0, len=Product.length; i<len; i++) {
			if (Product[i].value in RtA) Product[i].checked = true;
		}
	}
	function check_SRX_HE() {
		for (var i=0, len=Product.length; i<len; i++) {
			if (Product[i].value in SRX_HE) Product[i].checked = true;
		}
	}
	function check_SRX_LE() {
		for (var i=0, len=Product.length; i<len; i++) {
			if (Product[i].value in SRX_LE) Product[i].checked = true;
		}
	}
	function rm_all() {
		for (var i=0, len=Product.length; i<len; i++) {
			Product[i].checked = false;
		}
	}    

	//add RtA (routing-all) button
	bun_RtA = document.createElement("input");
	bun_RtA.type = "button";
	bun_RtA.value = "Routing";
	bun_RtA.name = 'All Routing Product';
	bun_RtA.setAttribute("class","button");
	bun_RtA.onclick = check_Routing_ALL;
	addpr.parentNode.appendChild(bun_RtA);

	//add Trio button
	bun_Trio = document.createElement("input");
	bun_Trio.type = "button";
	bun_Trio.value = "Trio";
	bun_Trio.name = 'Trio-chipset Product';
	bun_Trio.setAttribute("class","button");
	bun_Trio.onclick = check_Trio;
	addpr.parentNode.appendChild(bun_Trio);

	//add EX button
	bun_ex = document.createElement("input");
	bun_ex.type = "button";
	bun_ex.value = "EX";
	bun_ex.name = 'All EX product';
	bun_ex.setAttribute("class","button");
	bun_ex.style.width = "30px";
	bun_ex.onclick = check_EX;
	addpr.parentNode.appendChild(bun_ex);

	//add Dual_RE button
	bun_Dual_RE = document.createElement("input");
	bun_Dual_RE.type = "button";
	bun_Dual_RE.value = "Dual_RE";
	bun_Dual_RE.name = 'All Dual_RE product';
	bun_Dual_RE.setAttribute("class","button");
	bun_Dual_RE.onclick = check_Dual_RE;
	addpr.parentNode.appendChild(bun_Dual_RE);

	//add SRX_HE button
	bun_SRX_HE = document.createElement("input");
	bun_SRX_HE.type = "button";
	bun_SRX_HE.value = "SRX_HE";
	bun_SRX_HE.name = 'All SRX High End product';
	bun_SRX_HE.setAttribute("class","button");
	bun_SRX_HE.onclick = check_SRX_HE;
	addpr.parentNode.appendChild(bun_SRX_HE);

	//add SRX_LE button
	bun_SRX_LE = document.createElement("input");
	bun_SRX_LE.type = "button";
	bun_SRX_LE.value = "SRX_LE";
	bun_SRX_LE.name = 'All SRX Low End product';
	bun_SRX_LE.setAttribute("class","button");
	bun_SRX_LE.onclick = check_SRX_LE;
	addpr.parentNode.appendChild(bun_SRX_LE);

	//remove all button
	bun_rm_all = document.createElement("input");
	bun_rm_all.type = "button";
	bun_rm_all.style.cssText ="background-color: rgb(153, 51, 255); border-color: rgb(76, 174, 76); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px;";
	bun_rm_all.value = "RM_ALL";
	bun_rm_all.name = 'remove all';
	bun_rm_all.setAttribute("class","button");
	bun_rm_all.onclick = rm_all;
	addpr.parentNode.appendChild(bun_rm_all);
}

else if (Gnats_site.test(Cur_win)){
	// jquery highlight

	jQuery.extend({
		highlight: function (node, re, nodeName, className) {
			if (node.nodeType === 3) {
				var match = node.data.match(re);
				if (match) {
					var highlight = document.createElement(nodeName || 'span');
					highlight.className = className || 'highlight';
					var wordNode = node.splitText(match.index);
					wordNode.splitText(match[0].length);
					var wordClone = wordNode.cloneNode(true);
					highlight.appendChild(wordClone);
					wordNode.parentNode.replaceChild(highlight, wordNode);
					return 1; //skip added node in parent
				}
			} else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
					   !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
					   !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
				for (var i = 0; i < node.childNodes.length; i++) {
					i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
				}
			}
			return 0;
		}
	});
	jQuery.fn.unhighlight = function (options) {
		var settings = { className: 'highlight', element: 'span' };
		jQuery.extend(settings, options);

		return this.find(settings.element + "." + settings.className).each(function () {
			var parent = this.parentNode;
			parent.replaceChild(this.firstChild, this);
			parent.normalize();
		}).end();
	};

	jQuery.fn.highlight = function (words, options) {
		var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
		jQuery.extend(settings, options);

		if (words.constructor === String) {
			words = [words];
		}
		words = jQuery.grep(words, function(word, i){
			return word != '';
		});
		words = jQuery.map(words, function(word, i) {
			return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
		});
		if (words.length == 0) { return this; };

		var flag = settings.caseSensitive ? "" : "i";
		var pattern = "(" + words.join("|") + ")";
		if (settings.wordsOnly) {
			pattern = "\\b" + pattern + "\\b";
		}
		var re = new RegExp(pattern, flag);

		return this.each(function () {
			jQuery.highlight(this, re, settings.element, settings.className);
		});
	};


	function addGlobalStyle(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}
	function on_mouse_down(event) {
		mouse_down_x = event.clientX;
		mouse_down_y = event.clientY;
	}
	function on_mouse_up(event) {
		if(event.button == 2) {
			return;
		}
		clientX = event.clientX;
		move =  mouse_down_x - clientX;
		if ( move > 2 ) {
			var sText = document.selection == undefined ? document.getSelection().toString():document.selection.createRange().text;
			if (sText.length > 40) 
				return;
			$("fieldset#content_fieldset").highlight(sText);
			//console.log(sText);
		}      
		else $("fieldset#content_fieldset").unhighlight();
	}
	//$(document).ready(function(){
	addGlobalStyle('.highlight { background-color: #FFFF88;}');
	document.addEventListener("mouseup", on_mouse_up, true);
	document.addEventListener("mousedown", on_mouse_down, true);
	$('#frame1').prependTo('#view_headerContent > div:first');
	$('.banner').remove();
	$('#header').hide();
	$('#link_container')[0].style.marginTop = '106px';
	$('#field_container')[0].style.marginTop = '137px';
	document.getElementsByClassName('fixed_chevrons padding_top_35')[0].style.removeProperty('padding-top');
	document.getElementById('header_inner_cover').remove();
	document.getElementsByClassName('fixed_chevrons')[0].style.cssText += 'padding-top: 5px';
	$('#name_0_last-modified').remove();
	$('#name_0_arrival-date').remove();
	$('#div_arrival-date').parent()[0].style.removeProperty('width');
	document.getElementById('link_container').style.paddingBottom = '0px';
	arrd = $('#val_arrival-date').text();
	lrrd = $('#val_last-modified').text();
	$('#tab_fixed > ul > li')[11].remove();
	arrd = "Arrival    Date" + arrd;
	lrrd =  "Last-Modified" +lrrd;
	$('#val_arrival-date').text(arrd);
	$('#val_last-modified').text(lrrd);
	//})
}
/*
else if (Top_window.test(Cur_win)) {
    (function injectJs() {
        var scr = document.createElement('script');
        scr.type="text/javascript";
        //scr.src="https://openuserjs.org/src/libs/vlan1/CIAT.js",
        //scr.src="https://junipernetworks.sharepoint.com/teams/as/gsat/ASFE/docs/Knowledge%20Sharing/CIAT_script/1-abc.js";        
        scr.src="https://greasyfork.org/scripts/7967-mytest/code/mytest.js";
        document.getElementsByTagName('head')[0].appendChild(scr);
    })()
}
*/
else if ( Case_manager.test(Cur_win)) {
	document.getElementById('headerContainer').remove()
}
