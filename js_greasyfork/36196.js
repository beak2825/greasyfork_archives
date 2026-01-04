
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
// ==UserScript==
// @name        Dont Use AdBlock - Killer
// @namespace   MegaByteGreaseMonkeyDUABK
// @description Removes the "Dont use Ad Blocker" Messages on some sites
// @include     http*://*tempostorm.com/*
// @include     http*://*agar.io/*
// @include     http*://*gaver.io*
// @include     http*://*gota.io*
// @include     http*://*chip.de/*
// @include     http*://*3dchip.de/*
// @include     http*://*golem.de/*
// @include     http*://*heise.de/*
// @include     http*://*msn.com/*
// @include     http*://*wetter.com/*
// @include     http*://*pastebin.com/*
// @include     http*://*salamisound.de/*
// @include     http*://*crodict.de/*
// @include     http*://*pcwelt.de/*
// @include     http*://*tropicraft.net/dl/?l=*
// @include     http*://*minecraft-forum.net/v/file/*
// @include     http*://*gottabemobile.com/*
// @include     http*://*prosiebenmaxx.at/*
// @include     http*://*mobilesringtones.com/*
// @version     3.5.1
// @grant    	GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/36196/Dont%20Use%20AdBlock%20-%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/36196/Dont%20Use%20AdBlock%20-%20Killer.meta.js
// ==/UserScript==


	if(!('includes' in String.prototype)) {
       		String.prototype.includes = function(str, startIndex) {
                	return -1 !== String.prototype.indexOf.call(this, str, startIndex);
       		};
 	}

	var data = {
		"tempostorm.com" 		: ".ad, .ad-wrap, .adblock",
		"agar.io"        		: "#adbg, [data-itr*=ad]",
		"chip.de"        		: "#ads, #adunit, .adsbygoogle, [id*=contentad]",
		"3dchip.de"        		: "img[src*=werbung], img[src*=banner]",
		"golem.de"        		: ".adsbygoogle",
		"heise.de"        		: ".ad_us",
		"msn.com"        		: "[id*=taboola]",
		"wetter.com"        	: "[id*=adform-adbox], .adform-adbox, #banner, .adsContainer, .lkIqES, [id*=ad-], #VJIlqro.RlzwrKHa, #NLKiiz.EsZrDeXPRZ, #naFsCzMmuw.APiOHcXTO, #content_wide div:first-child, #XEVINd, .ad-wrapper, [id*=ad_target], .contilla579dd4d8Box, [id*=adslot], .contentteaserBox.wideTeaser",
		"pastebin.com"        	: "#notice, [id*=abrpm], .banner_728",
		"salamisound.de"        : "#header_0_warning, .header_0_warning",
		"crodict.de"        	: "#context .box:nth-of-type(2)",
		"pcwelt.de"        		: "#header ~ div:nth-of-type(1), #header ~ div:nth-of-type(2), #header ~ div:nth-of-type(3)",
		"tropicraft.net"        : "center h2, center ins",
		"minecraft-forum.net"	: ".download-panel #ImageAndButton",
		"gottabemobile.com"	    : "center i",
		"prosiebenmaxx.at"	    : "#main > div:first-child, [id*=ad-performance], .ad, #main > div:nth-of-type(6)",
		"mobilesringtones.com"  : ".site-usage-warning"
	};

	var site = window.location.href || document.URL;
		
	for(var url in data) {
		if(site.includes(url)) {
			remove = data[url];
			break;
		}
	}
				
	if(typeof remove !== "undefined") {
		GM_addStyle(
			remove + " {										\
				display: none !important;						\
				visibility: hidden !important;					\
				width: 0px !important;							\
				height: 0px !important;							\
			}"										
		);
		console.info("Dont Use AdBlock - Killer was active [Identification: " + remove + "].");
	}