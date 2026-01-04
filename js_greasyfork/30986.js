// ==UserScript==
// @name         chatft
// @description  makes chat great
// @author       foxie
// @match        https://epicmafia.com/lobby
// @match        https://epicmafia.com/game/*
// @version 0.0.1.20170703170532
// @namespace https://greasyfork.org/users/4723
// @downloadURL https://update.greasyfork.org/scripts/30986/chatft.user.js
// @updateURL https://update.greasyfork.org/scripts/30986/chatft.meta.js
// ==/UserScript==

const VALID_IMG=".bmp.gif.jpeg.jpg.png.svg.tiff";
const EM_OATS={
	angel: "http://i.imgur.com/vmBnXfBh.png",
	arrgh: "http://i.imgur.com/yWRnfdWh.png",
	bird: "http://i.imgur.com/q99FCfN.gif",
	blush: "http://i.imgur.com/vUyEPUPh.png",
	buffufu: "http://i.imgur.com/VHsQvSlh.png",
	bulbasaur: "/uploads/emotes/1771_original.gif",
	charlotte: "http://i.imgur.com/i3hauTe.gif",
	chefufu: "http://i.imgur.com/nl1GQIkh.png",
	chill: "http://i.imgur.com/aI5U9aY.gif",
	coffufu: "http://i.imgur.com/5VRMdrqh.png",
	cryfox: "/uploads/emotes/18407_original.gif",
	cryfu: "http://i.imgur.com/fhR3Gulh.png",
	cthfulfu: "http://i.imgur.com/6ueysCDh.png",
	dalek: "http://i.imgur.com/W325y1s.gif",
	dikdik: "http://i.imgur.com/Dj8FRrp.png",
	ditto: "http://i.imgur.com/LwwqEU2.gif",
	eful: "http://i.imgur.com/WGExCALh.png",
	feels: "http://i.imgur.com/1UqALYB.gif",
	flufu: "http://i.imgur.com/EA3HECZh.png",
	fufixit: "http://i.imgur.com/SKUyzs1h.png",
	fuflex: "http://i.imgur.com/YDwbjQVh.png",
	fuflower: "http://i.imgur.com/I4zw3iMh.png",
	fufool: "http://i.imgur.com/e0uk1ddh.png",
	fufruit: "http://i.imgur.com/6yBMrqAh.png",
	fufu: "http://i.imgur.com/cmsntv2h.png",
	fufuf: "http://i.imgur.com/4h8NEEKh.png",
	fufull: "http://i.imgur.com/1CYf6dz.png",
	fufunky: "http://i.imgur.com/7aNzKPjh.png",
	fufuroll: "http://i.imgur.com/R2Ll0jL.gif",
	fufuu: "http://i.imgur.com/qXk1mb0h.png",
	fufuzela: "http://i.imgur.com/fyH1ZBoh.png",
	fuuf: "http://i.imgur.com/vp9LsSbh.png",
	gaws: "http://i.imgur.com/NIennRF.gif",
	gay: "http://i.imgur.com/ILvlbCc.gif",
	glad: "http://i.imgur.com/rbeyeW8h.png",
	gorf: "http://i.imgur.com/PkMTk1g.gif",
	hamtaro: "http://i.imgur.com/ZE2xLAL.gif",
	isay: "http://i.imgur.com/2GpbA1G.gif",
	kappa: "http://i.imgur.com/FyOZi55.gif",
	knifufu: "http://i.imgur.com/905e8hI.gif",
	kungfufu: "http://i.imgur.com/aMyCgYZh.png",
	leafufu: "http://i.imgur.com/8kRR9Dgh.png",
	lick: "http://i.imgur.com/9cmjMER.gif",
	licky: "http://i.imgur.com/PF9fOmc.gif",
	lub: "http://i.imgur.com/hCsYezmh.png",
	michael: "http://i.imgur.com/o5pnGish.png",
	nerdfufu: "http://i.imgur.com/Fk0YGAXh.png",
	mudkip: "http://img.pokemondb.net/sprites/black-white/anim/normal/mudkip.gif",
	ohno: "http://i.imgur.com/NEHVkJUh.png",
	omg: "http://i.imgur.com/8d9wCyyh.png",
	pikachu: "http://img.pokemondb.net/sprites/black-white/anim/normal/pikachu.gif",
	pikasnooze: "/uploads/emotes/1608_original.gif",
	pengfufu: "http://i.imgur.com/LGXq6Kbh.png",
	pepe: "http://i.imgur.com/ejJtTvC.gif",
	poutyfufu: "http://i.imgur.com/Fvn5nBPh.png",
	rainfu: "http://i.imgur.com/2XtLgsWh.png",
	roadkill: "http://i.imgur.com/G6VFBZfh.png",
	seedot: "http://i.imgur.com/DlZPUkW.gif",
	shyfox: "/uploads/emotes/18367_original.gif",
	sleepy: "http://i.imgur.com/7HegR95h.png",
	snoop: "http://i.imgur.com/F5HViqt.gif",
	squirtle: "http://i.imgur.com/w9zD7yu.gif",
	swag: "http://i.imgur.com/6uOsLKH.gif",
	tofufu: "http://i.imgur.com/XSR8Ceeh.png",
	uffu: "http://i.imgur.com/JfMlPzAh.png",
	ufuf: "http://i.imgur.com/ZbFG7JMh.png",
	ufufu: "http://i.imgur.com/yf55yezh.png",
	waifufu: "http://i.imgur.com/FfwoAACh.png",
	wat: "http://i.imgur.com/m9bboaI.png",
	weed: "http://i.imgur.com/G5EYfSL.png",
	whimsicott: "http://img.pokemondb.net/sprites/black-white/anim/normal/whimsicott.gif",
	wink: "http://i.imgur.com/ChIkWIr.png",
	wwybwds: "http://i.imgur.com/B1q0Y3b.png"
	};
const EMOJI_REGEX=/([\u2300-\u24ff]|[\u25a0-\u27bf]|[\u2800-\u28ff]|[\u2b00-\u2bff]|\ud83c[\udc00-\udfff]|\ud83d[\udc00-\udeff]|\ud83e[\udd00-\uddff])/g;
const EMOJI_LIST=[[128512, 128513, 128514, 129315, 128515, 128516, 128517, 128518, 128521, 128522, 128523, 128526, 128525, 128536, 128535, 128537, 128538, 9786, 128578, 129303, 129300, 128528, 128529, 128566, 128580, 128527, 128547, 128549, 128558, 129296, 128559, 128554, 128555, 128564, 128524, 128539, 128540, 128541, 129316, 128530, 128531, 128532, 128533, 128579, 129297, 128562, 9785, 128577, 128534, 128542, 128543, 128548, 128546, 128557, 128550, 128551, 128552, 128553, 128556, 128560, 128561, 128563, 128565, 128545, 128544, 128567, 129298, 129301, 129314, 129319, 128519, 129312, 129313, 129317, 129299, 128520, 128127, 128121, 128122, 128128, 9760, 128123, 128125, 128126, 129302, 128169], [128118, 128102, 128103, 128104, 128105, 128116, 128117, 128110, 128373, 128130, 128119, 129332, 128120, 128115, 128114, 128113, 129333, 128112, 128124, 127877, 129334, 128589, 128590, 128581, 128582, 128129, 128587, 129318, 129335, 128134, 128135, 129328, 128583, 128694, 127939, 128131, 128378, 128111, 128704, 128716, 128372, 128483, 128100, 128101, 129338, 127943, 9975, 127938, 127948, 127940, 128675, 127946, 9977, 127947, 128692, 128693, 127950, 127949, 129336, 129340, 129341, 129342, 129337, 128107, 128108, 128109, 128143, 128145, 128106], [129331, 128170, 128072, 128073, 9757, 128070, 128405, 128071, 9996, 129310, 128406, 129304, 129305, 128400, 9995, 128076, 128077, 128078, 9994, 128074, 129307, 129308, 129306, 128075, 9997, 128079, 128080, 128588, 128591, 129309, 128133, 128066, 128067, 128099, 128064, 128065, 128069, 128068, 128139, 128152, 10084, 128147, 128148, 128149, 128150, 128151, 128153, 128154, 128155, 128156, 128420, 128157, 128158, 128159, 10083, 128140, 128164, 128162, 128163, 128165, 128166, 128168, 128171, 128172, 128488, 128495, 128173, 128371, 128083, 128374, 128084, 128085, 128086, 128087, 128088, 128089, 128090, 128091, 128092, 128093, 128717, 127890, 128094, 128095, 128096, 128097, 128098, 128081, 128082, 127913, 127891, 9937, 128255, 128132, 128141, 128142], [128584, 128585, 128586, 128570, 128568, 128569, 128571, 128572, 128573, 128576, 128575, 128574, 128053, 128018, 129421, 128054, 128021, 128041, 128058, 129418, 128049, 128008, 129409, 128047, 128005, 128006, 128052, 128014, 129412, 129420, 128046, 128002, 128003, 128004, 128055, 128022, 128023, 128061, 128015, 128017, 128016, 128042, 128043, 128024, 129423, 128045, 128001, 128000, 128057, 128048, 128007, 128063, 129415, 128059, 128040, 128060, 128062, 129411, 128020, 128019, 128035, 128036, 128037, 128038, 128039, 128330, 129413, 129414, 129417, 128056, 128010, 128034, 129422, 128013, 128050, 128009, 128051, 128011, 128044, 128031, 128032, 128033, 129416, 128025, 128026, 129408, 129424, 129425, 128012, 129419, 128027, 128028, 128029, 128030, 128375, 128376, 129410], [128144, 127800, 128174, 127989, 127801, 129344, 127802, 127803, 127804, 127799, 127793, 127794, 127795, 127796, 127797, 127806, 127807, 9752, 127808, 127809, 127810, 127811, 127815, 127816, 127817, 127818, 127819, 127820, 127821, 127822, 127823, 127824, 127825, 127826, 127827, 129373, 127813, 129361, 127814, 129364, 129365, 127805, 127798, 129362, 127812, 129372, 127792, 127838, 129360, 129366, 129374, 129472, 127830, 127831, 129363, 127828, 127839, 127829, 127789, 127790, 127791, 129369, 129370, 127859, 129368, 127858, 129367, 127871, 127857, 127832, 127833, 127834, 127835, 127836, 127837, 127840, 127842, 127843, 127844, 127845, 127841, 127846, 127847, 127848, 127849, 127850, 127874, 127856, 127851, 127852, 127853, 127854, 127855, 127868, 129371, 9749, 127861, 127862, 127870, 127863, 127864, 127865, 127866, 127867, 129346, 129347, 127869, 127860, 129348, 128298, 127994], [127757, 127758, 127759, 127760, 128506, 128510, 127956, 9968, 127755, 128507, 127957, 127958, 127964, 127965, 127966, 127967, 127963, 127959, 127960, 127961, 127962, 127968, 127969, 127970, 127971, 127972, 127973, 127974, 127976, 127977, 127978, 127979, 127980, 127981, 127983, 127984, 128146, 128508, 128509, 9962, 128332, 128333, 9961, 128331, 9970, 9978, 127745, 127747, 127748, 127749, 127750, 127751, 127753, 9832, 127756, 127904, 127905, 127906, 128136, 127914, 127917, 128444, 127912, 127920, 128642, 128643, 128644, 128645, 128646, 128647, 128648, 128649, 128650, 128669, 128670, 128651, 128652, 128653, 128654, 128656, 128657, 128658, 128659, 128660, 128661, 128662, 128663, 128664, 128665, 128666, 128667, 128668, 128690, 128756, 128757, 128655, 128739, 128740, 9981, 128680, 128677, 128678, 128679, 128721, 9875, 9973, 128758, 128676, 128755, 9972, 128741, 128674, 9992, 128745, 128747, 128748, 128186, 128641, 128671, 128672, 128673, 128752, 128640, 128718, 128682, 128719, 128715, 128701, 128703, 128705, 8987, 9203, 8986, 9200, 9201, 9202, 128368, 128347, 128359, 128336, 128348, 128337, 128349, 128338, 128350, 128339, 128351, 128340, 128352, 128341, 128353, 128342, 128354, 128343, 128355, 128344, 128356, 128345, 128357, 128346, 128358], [127761, 127762, 127763, 127764, 127765, 127766, 127767, 127768, 127769, 127770, 127771, 127772, 127777, 9728, 127773, 127774, 11088, 127775, 127776, 9729, 9925, 9928, 127780, 127781, 127782, 127783, 127784, 127785, 127786, 127787, 127788, 127744, 127752, 127746, 9730, 9748, 9969, 9889, 10052, 9731, 9924, 9732, 128293, 128167, 127754, 127875, 127876, 127878, 127879, 10024, 127880, 127881, 127882, 127883, 127885, 127886, 127887, 127888, 127889, 127872, 127873, 127895, 127903, 127915, 127894, 127942, 127941, 129351, 129352, 129353, 9917, 9918, 127936, 127952, 127944, 127945, 127934, 127921, 127923, 127951, 127953, 127954, 127955, 127992, 129354, 129355, 129349, 127919, 9971, 9976, 127907, 127933, 127935, 127918, 128377, 127922, 9824, 9829, 9830, 9827, 127183, 126980, 127924], [128263, 128264, 128265, 128266, 128226, 128227, 128239, 128276, 128277, 127932, 127925, 127926, 127897, 127898, 127899, 127908, 127911, 128251, 127927, 127928, 127929, 127930, 127931, 129345, 128241, 128242, 9742, 128222, 128223, 128224, 128267, 128268, 128187, 128421, 128424, 9000, 128433, 128434, 128189, 128190, 128191, 128192, 127909, 127902, 128253, 127916, 128250, 128247, 128248, 128249, 128252, 128269, 128270, 128300, 128301, 128225, 128367, 128161, 128294, 127982, 128212, 128213, 128214, 128215, 128216, 128217, 128218, 128211, 128210, 128195, 128220, 128196, 128240, 128478, 128209, 128278, 127991, 128176, 128180, 128181, 128182, 128183, 128184, 128179, 128185, 128177, 128178, 9993, 128231, 128232, 128233, 128228, 128229, 128230, 128235, 128234, 128236, 128237, 128238, 128499, 9999, 10002, 128395, 128394, 128396, 128397, 128221, 128188, 128193, 128194, 128450, 128197, 128198, 128466, 128467, 128199, 128200, 128201, 128202, 128203, 128204, 128205, 128206, 128391, 128207, 128208, 9986, 128451, 128452, 128465, 128274, 128275, 128271, 128272, 128273, 128477, 128296, 9935, 9874, 128736, 128481, 9876, 128299, 127993, 128737, 128295, 128297, 9881, 128476, 9879, 9878, 128279, 9939, 128137, 128138, 128684, 9904, 9905, 128511, 128738, 128302, 128722], [127975, 128686, 128688, 9855, 128697, 128698, 128699, 128700, 128702, 128706, 128707, 128708, 128709, 9888, 128696, 9940, 128683, 128691, 128685, 128687, 128689, 128695, 128245, 128286, 9762, 9763, 11014, 8599, 10145, 8600, 11015, 8601, 11013, 8598, 8597, 8596, 8617, 8618, 10548, 10549, 128259, 128260, 128281, 128282, 128283, 128284, 128285, 128720, 9883, 128329, 10017, 9784, 9775, 10013, 9766, 9770, 9774, 128334, 128303, 9800, 9801, 9802, 9803, 9804, 9805, 9806, 9807, 9808, 9809, 9810, 9811, 9934, 128256, 128257, 128258, 9654, 9193, 9197, 9199, 9664, 9194, 9198, 128316, 9195, 128317, 9196, 9208, 9209, 9210, 127910, 128261, 128262, 128246, 128243, 128244, 9877, 9851, 9884, 128305, 128219, 128304, 11093, 9989, 9745, 10004, 10006, 10060, 10062, 10133, 10134, 10135, 10160, 10175, 12349, 10035, 10036, 10055, 8252, 8265, 10067, 10068, 10069, 10071, 12336, 169, 174, 8482, 128287, 128175, 128288, 128289, 128290, 128291, 128292, 127344, 127374, 127345, 127377, 127378, 127379, 8505, 127380, 9410, 127381, 127382, 127358, 127383, 127359, 127384, 127385, 127386, 127489, 127490, 127543, 127542, 127535, 127568, 127545, 127514, 127538, 127569, 127544, 127540, 127539, 12951, 12953, 127546, 127541, 9642, 9643, 9723, 9724, 9725, 9726, 11035, 11036, 128310, 128311, 128312, 128313, 128314, 128315, 128160, 128280, 128306, 128307, 9898, 9899, 128308, 128309, 127937, 128681, 127884, 127988, 127987]];

function firstId() {
	for(var i=0, node; i<arguments.length; i++) {
		if(node=document.getElementById(arguments[i])) {
			return node;
			}
		}
	}

void function() {
	var	style=document.createElement("style");
	style.type="text/css";
	style.textContent=`
		.emoji {
			font-size: 1.5em;
			font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Android Emoji";
			}
		.fullwidth {
			max-width: 100%;
			}
		.custom-emote {
			max-width: 25px;
			max-height: 25px;
			}
		#lobbychat.expanded #window {
			height: auto !important;
			}
		#lobbychat.expanded #window_i {
			height: 400px !important;
			}
		#lobbychat.expanded #chatbar {
			position: initial !important;
			}
		#emojinav {
			display: inline-block;
			margin: 1em;
			}
		#emojinav a {
			filter: grayscale(1);
			}
		#emojinav a:hover {
			filter: none;
			}
		#emojibox span {
			cursor: pointer;
			width: 1em;
			height: 1em;
			margin: 0.2em;
			font-size: 1.5em;
			display: inline-block;
			}
		#emojibox span:hover {
			transform: scale(1.3);
			}
		`;
	document.head.appendChild(style);
	}();

void function() {
	var	lobby=false;
	var	loaded=false;
	var	buttons=firstId("speak");
	function makeToggle(title, icon, listener, toggle) {
		var	node=document.createElement("a");
		if(lobby) {
			node.className="chat_toggle rt tt";
			node.dataset.title=title;
			}
		else {
			node.title=title;
			}
		node.appendChild(
			document.createElement("i")
			).className=icon;
		node.addEventListener("click", listener);
		if(toggle) {
			node.click();
			}
		return node;
		}
	if(location.pathname==="/lobby") {
		lobby=true;
		buttons=document.querySelector("#lobbychat .separator");
		buttons.appendChild(
			makeToggle(
				"Expand chat",
				"icon-plus",
				function(event) {
					localStorage.expand_chat=this.classList.toggle("sel");
					firstId("lobbychat").classList.toggle("expanded");
					},
				localStorage.expand_chat==="true"
				)
			);
		}
	buttons.appendChild(
		makeToggle(
			"Enable formatting",
			"icon-font",
			function(event) {
				localStorage.chat_format=this.classList.toggle("sel");
				},
			localStorage.chat_format!=="false"
			)
		);
	buttons.appendChild(
		makeToggle(
			"Show emojis",
			"icon-github-alt",
			function(event) {
				this.classList.toggle("sel");
				firstId("emojibox").classList.toggle("hide");
				}
			)
		);
	}();

void function() {
	var	page=1;
	function event_page(event) {
		firstId(`emojilist-${page}`).classList.add("hide");
		page=this.dataset.page;
		firstId(`emojilist-${page}`).classList.remove("hide");
		}
	function event_emoji(event) {
		var	input=firstId("chatbar", "typebox")
		input.value+=this.textContent;
		input.dispatchEvent(
			new Event("change")
			);
		input.focus();
		}
	var	emobox=document.createElement("div");
	emobox.id="emojibox";
	emobox.className="hide";
	var	emonav=document.createElement("div");
	emonav.id="emojinav";
	emonav.textContent="Jump to... ";
	emobox.appendChild(emonav);
	emobox.appendChild(
		document.createElement("br")
		);
	EMOJI_LIST.forEach(function(list, i) {
		var	link=document.createElement("a");
		link.dataset.page=i+1;
		link.textContent=String.fromCodePoint(list[0]);
		link.addEventListener("click", event_page);
		emonav.appendChild(link);
		var	table=document.createElement("div");
		table.id=`emojilist-${i+1}`;
		if(i > 0) {
			table.className="hide";
			}
		list.forEach(function(code) {
			var	emoji=document.createElement("span");
			emoji.className="emoji";
			emoji.textContent=String.fromCodePoint(code);
			emoji.addEventListener("click", event_emoji);
			table.appendChild(emoji)
			});
		emobox.appendChild(table);
		});
	firstId("lobbychat", "screen").appendChild(emobox);
	}();

new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		mutation.addedNodes.forEach(function(node) {
			if(node.nodeType===HTMLElement.ELEMENT_NODE && node.classList.contains("talk")) {
				node=node.querySelector(".msg, .msg_wrapper") || node;
				if(node.textContent.substring(0, 4)==="$img") {
					var	src=node.textContent.match(/(\w+:\/\/[^\s\?#]+)/);
					if(src && ~VALID_IMG.indexOf(src[0].replace(/.+(\.\w+)/, "$1"))) {
						var	link=document.createElement("a");
						var	image=document.createElement("img");
						image.src=src[0];
						image.className="fullwidth";
						link.href=src[0];
						link.appendChild(image);
						node.parentNode.append(
							document.createElement("br"),
							link
							);
						}
					}
				if(localStorage.chat_format!=="false") {
					node.innerHTML=node.innerHTML
						.replace(/(^|\s)\*\*(.+?)\*\*/g, "$1<b>$2</b>")
						.replace(/(^|\s)\*(.+?)\*/g, "$1<i>$2</i>")
						.replace(/(^|\s)__(.+?)__/g, "$1<u>$2</u>")
						.replace(/(^|\s)~~(.+?)~~/g, "$1<s>$2</s>")
						.replace(/(^|\s)(\w+:\/\/\S+)/g, "$1<a href='$2' target='_blank'>$2</a>")
						.replace(EMOJI_REGEX, "<span class='emoji'>$1</span>");
					}
				}
			});
		});
	}).observe(
	firstId("window_i", "window"), {
		childList: true
		}
	);

window.addEventListener("load", function(event) {
	var	emotes=unsafeWindow.lobby_emotes || unsafeWindow.lobbyinfo;
	if(emotes) {
		if(emotes.emotes) {
			emotes=emotes.emotes;
			}
		for(var key in EM_OATS) {
			if(!emotes[":"+key+":"]) {
				emotes[":"+key+":"]=EM_OATS[key];
				}
			}
		}
	});

window.addEventListener("keydown", function(event) {
	if(!event.ctrlKey && event.target.value===undefined) {
		firstId("chatbar", "typebox").focus();
		}
	});