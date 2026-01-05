// ==UserScript==
// @name        heavyr make lookable
// @namespace   http://98wugwh98hwht9tghw9gjreg
// @include     http://*.heavy-r.com/*
// @include     http://heavy-r.com/*
// @include     https://*.heavy-r.com/*
// @include     https://heavy-r.com/*
// @description Hide disgusting shit from heavy-r.com porn video site with css. Match based on keyword keyphrase list. Make heavy-r readable lookable and viewable.
// @version     1.4.1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/26369/heavyr%20make%20lookable.user.js
// @updateURL https://update.greasyfork.org/scripts/26369/heavyr%20make%20lookable.meta.js
// ==/UserScript==

var tagslist = new Array("gay", "homosexual", "plate", "shitty", "tranny", "kicking", "in balls", "shemale", "retarted", "torture", "brains", "brain", "death", "Machete", "masacre", "murdered", "obese", "diarrhea", "tranny", "shit", "ruined", "needle", "needles", "torture", "spike", "sneeze", "sneezing", "shitting", "queef", "queefing", "grandma", "diseased", "disease", "fart", "farts", "anale", "diaper", "hentai", "puking", "shemales", "executed", "twinks", "execute", "granny", "grannys", "grandpa", "fishbone", "scat", "nasty", "slashed", "cutting", "cuts", "abortion", "isis", "scatlover", "preggo", "burning", "birth", "beheading", "maggot", "maggots", "magot", "shity", "behead", "vomitting", "vomiting", "smut", "beaten", "beating", "constipated", "choked", "feces", "pooping", "pooped", "hanging", "hanged", "fecal", "doughnuts", "vampiress", "kills", "killing", "puke", "pukes", "seizure", "shits", "vomits", "vomit", "ransom", "kidnapped", "hostage", "preggo", "killed", "stabbed", "horrible", "bloody", "dead", "anal", "pregnant", "scat", "baby", "shit", "poop", "crap", "fisting", "shooting", "stabbing", "shitting", "crapping", "snuf", "snuff", "slit", "robber", "turd", "shot", "robbery", "diapered", "stretching", "sliced", "fist", "fisting", "shots", "horrific", "horriffic", "injury", "fishes", "hits truck", "hits card", "bus hits", "runs over", "crushed", "injured", "horror", "gunshot", "gunshots", "slitting", "poltergeist", "asphixiated", "pitbull", "strangled", "broomhandle", "dismembered", "broomhandle", "plunger", "dismember", "vivisect", "open chest", "wound", "chest wound", "to death", "asphixiate", "abducted", "hanging", "gaping", "criminals", "shemaale", "dead", "toilet", "explosion", "explode", "explodes", "seagal", "exploding", "suitcase", "torched", "corpse", "cannibal", "canibal", "unlucky", "terror", "roast", "roasting", "toasty", "splitting", "fight", "clown", "circus", "midget", "sick", "ghost", "asphyxia", "pooping", "drowned", "drowns" ,"asphyxiate", "halloween", "wreck", "wrecked", "chokes", "brown", "guy eating", "survival", "face of war", "clamped", "simpleton", "suffocating", "clothespins", "tased", "hung up", "corngirl", "corncob", "knife", "corn", "fisted", "huge ass", "lactating", "corn girl", "meaty", "hand caught", "machine", "butthole", "anally destroyed", "anally", "pussy drill", "pussydrill", "a fish", "painal", "blown off", "blown up", "prostate", "poopy", "shemales", "buttfuck", "nasal", "menstruating", "drown", "oldest", "fractured", "poison", "poisoned", "downer", "fracture", "smashing", "train", "worms", "worm", "maggot", "necrophilia", "maggots", "snake", "plane crash", "dangling", "anus", "farting", "dude sucks", "tortured", "fatty", "stabs", "bleeding", "rabbit", "jumper", "shitface", "ATM", "burial", "pain", "blood", "cannibal", "necro", "corporal punishment", "cracked", "cannilbalist", "cannilbalism", "breath", "snails", "slugs", "gore", "slaughtered", "dump", "enema", "morgue", "decapitate", "decapitated", "stangled", "crash", "crashes", "crashed", "suicide", "scissors", "chainsaw", "slices", "horse", "cut", "disgusting", "strangulation", "Defecating", "strangle", "crater", "stinky pile", "stinky", "stinkhole", "choko", "poops", "fat guy", "banana", "bananna", "bannana", "bannanna", "anorexic", "food", "shitted", "shits", "scats", "scatter", "scatted", "shitter", "stepping on", "murder", "tentacles", "whale", "deadly", "dead", "legless", "amputee", "hangs", "hung", "blood", "stab", "ugly", "trampling", "butcher", "butchered", "abcess", "twitching", "twiching", "scab", "surgery", "abscess", "surgeon", "burned", "disease", "decapitate", "decapitation", "strike", "strikes", "staples", "stapling", "hammering", "strung", "chopped", "axxed", "machette", "chop", "suicida");
var nlcond = tagslist.join(" ");
var applyIt = 0;
var emptyA = new Array();
function xpath(doc, xpath) {
	return doc.evaluate(xpath, doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    }

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function checkEm(allWords, TText, runtype) {
	//var newText = '';
	var applyIt = 0;
	for (var z=0; z<allWords.length; z++) {
		
		for (var x1=0; x1<tagslist.length; x1++) {
			var w1 = new RegExp('\b'+escapeRegExp(tagslist[x1])+'\b','gmi');
		  //var w2 = new RegExp(escapeRegExp(tagslist[x1])+' ','gmi');
		  var w3 = new RegExp(' '+escapeRegExp(tagslist[x1])+' ','gmi');
			var w4 = new RegExp('^'+escapeRegExp(tagslist[x1])+' ','gmi');
			var w5 = new RegExp(' '+escapeRegExp(tagslist[x1])+'$','gmi');
			if (TText.match(w1) || TText.match(w3) || TText.match(w4) || TText.match(w5)) {
				applyIt=1;
			 break;
			}
		 }
		if (applyIt==1) {
			return "go";
		 break;
		}
  }
	return "no";
}

if (location.href.indexOf("recent")!=-1) {
   var smalls = document.getElementsByTagName("small");
		for (var f=0;f<smalls.length;f++) {
			emptyA = [];
			var TWords = "";
			var fa = smalls[f].getElementsByTagName("a");
			for (var ff=0; ff<fa.length; ff++){
			  TWords+=fa[ff].textContent+" ";
				emptyA.push(fa[ff].textContent);
			}
		var testIt = checkEm(emptyA, TWords);
	  if (testIt=="go") {
  		 smalls[f].parentNode.parentNode.parentNode.parentNode.parentNode.setAttribute("style", "display:none!important;visibility:hidden!important;");
			 applyIt = 0;
		 }
		}
  }

else {
 var newAllDivs = xpath(document, "//div[contains(@class,'col')]/div/div[contains(@class,'row')]/div/h4[contains(@class,'title')]");

 for (var x=0;x<newAllDivs.snapshotLength;x++) {
	
	var text = newAllDivs.snapshotItem(x).textContent;
	var allWords = text.split(" ");
	var testIt = checkEm(allWords, text);
	 if (testIt=="go") {
	  newAllDivs.snapshotItem(x).parentNode.parentNode.parentNode.setAttribute("style", "display:none!important;visibility:hidden!important;");
		applyIt = 0;
  }
}
}
