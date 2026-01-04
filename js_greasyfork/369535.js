// ==UserScript==
// @name        xvideos filterer
// @namespace   http://uhighiuhhreguhregregje.org
// @include     http://*.xvideos.com/*
// @include     http://xvideos.com/*
// @include     https://*.xvideos.com/*
// @include     https://xvideos.com/*
// @version     1.3
// @grant       none
// @description Filter out users or videos based on keywords or names
// @downloadURL https://update.greasyfork.org/scripts/369535/xvideos%20filterer.user.js
// @updateURL https://update.greasyfork.org/scripts/369535/xvideos%20filterer.meta.js
// ==/UserScript==


var namelist = new Array("Faggots", "Pornloverx", "Abusing Her", "Angelbuzz", "Lunarrosecrow", "Old Spunkers", "Legal Porno", "Sara Jay", "Throatpukeaddict92", "Shemale20", "Older Woman Fun", "Martoni", "Pervcity", "Cuties Galore", "Slanglongwood", "Bigjov1991", "Onlyoneme24", "Sissytanner", "Qonupevil", "Hollboobs94", "Oddfuturewolfgang", "Fuckupayme2014", "Hardcorehunter", "Thewhiteghetto", "Bignina27", "Amazingly1", "Saranudetee830", "Penny1994", "Thirstybro Quench", "Tiggerdodson", "Southgirls", "Indgnato", "Jamie-black", "Derfgrmn31", "Wicked Sexy Melanie", "Porncucumber", "Carlita Sanz", "Zoe Zane", "Taytay727", "Juhni", "Katavery", "Eagerlymadalyn", "Bredogg", "Tommyx33", "Milf In Love", "Jrocdaprince", "Vikings Of Porn", "Edwinan25", "Tsujikazuki", "Personaking", "KG Tatted 214", "Miniairmac", "Wesley-gta", "Mbolo105", "Blackinseeds", "Herowill", "Mirandastone", "Porn Pros", "Blackjrxiii", "Blackdongs", "Littlesanju143", "Sexiesposa", "Sandeep141981", "Privateblack", "21Sextreme", "Bigredvick", "Galindoj", "Matures HD", "Grandma Friends", "Sandeep141981", "Drfatt", "Frankiebank", "Pure Mature", "Frankiebank", "Lusty Grandmas", "Grandma", "Grandpa", "Grandpas Fuck Teens", "Johnnyboy", "Miss Brat Perversions", "Dcups", "Bigblackck", "Grbch849", "Mmm 100", "Sexy Hub", "Hornypavel", "Priapo69pipi", "Lorrenz777", "Chubby Cam Show Babe", "Takkan123456789", "Wankz", "Puba", "TugPass", "Facesittingbutts", "Juje43", "Mature Nl", "Jack Off To Me", "Bbc Brandon233", "Anal Penetrator", "Danielleo", "Sylse", "Danf", "Kahinomohino", "Teikoku", "Cutepixxx", "Jackpot", "Hornyguyau", "Rang3d", "Ignitionfaygo", "Saohk1", "Sharptiger", "Wowfucker46h", "Dig73", "Dester555", "Ciurybury", "Mrblackcock007", "Lonzen", "Edjr80", "Diceler1983", "Bonitaa80", "Aqa1234564", "Arqwe2cr52247", "Whitegirlemily", "Rebecca", "Jomeflaco", "Busines", "Spanker75", "Mr Siren", "Swamphing53", "Jmaup", "Freaknasty2", "Legal Porno", "Thisguypumpz", "All Ass April", "Chick Pass", "Bussin-in-your-mouth", "MMV", "Bhadiekush", "Sk33t", "Dickherwell", "Blackbonanzaa", "Topfreex", "Homiwaltx7", "Edjr80", "Longpipe336", "Arica-goin-dumb", "Chicuaca", "Justice09", "Facials25", "Roddpowers", "Melindax1", "Loncoleche", "Penitrater00069", "Cesancha159", "Inranla", "Hey Milf", "Lifeofpablo2", "Ravenrith", "Pisser Ca", "Ravenrith", "Blowjobfan1993", "Xxxrooster", "Flightrisk66", "Trazcy Kush", "Phillycheesesteak215", "Sheenaq25", "Hot-roxanne", "Longnydick", "Tamaras25", "Pussylovin33", "Legendarypipegame", "Isabellab24", "Seedsippers", "Ponnuponnu", "Sex Mission", "My Wife Luna", "Tefhun", "Zobonuzu740", "Josh111222", "Rosical24", "Charlee Chase", "Msnovember", "Marleyvom", "Wrektit", "King-slayer-8728", "Flixxxman", "Yandelsantos", "Mary--24", "Scrappersupernova", "Sexsaoyweb", "Heather-from-denver", "Dannypatrickcarter67", "Atheoga", "Drew5431", "Chicago-mia", "Frisco-anna", "Bubalikescake", "Creekside33", "Sozio18", "More Free Porn", "Xbestofpornx", "Throatpieworld", "Reczek95", "Tinylatina", "Keim92", "Tthroat", "Headluver12", "Ressetty", "Sex Feene Ya Bish", "Userrest", "Me15092534", "Citiboi23", "Draenei Slut", "Hell0everyone", "J-o-c-e", "Thug-nasty-entertainment", "Bigkddick", "Beryozkina", "Panxhoss", "Sesiptafe1987", "Johnjbrabo", "John01777", "Nashnice", "NiaMilkMarie", "Jnr-playlikeplay", "Maison0000", "Crashie-j", "Rick Nasty Xxx", "Hheinterracial", "Muellermeyer123", "Big Dick Fla Beach Boy", "Slutwifeclub", "Woebegonetheory", "Adam Theresa", "Doris-babe", "Brutal Dildos", "Silent69", "Khakash", "Blackchild8517", "Thegodofsex11", "Love8bbw", "Patricia-ms", "Shortitnow", "Bklynman", "Hotdude444", "Karolina Rus", "Jiscmanu", "Subaugusta", "Lucesita De Ica", "Manisha Bhati", "Dobleproposito1234", "ArtXhibitor", "Leggings Hub", "Chocstixcpl", "Danishpissboy", "Johnte5rgambinox", "Majkenh", "Anonbroskis", "Xbetweenbreathsx", "Carloalbertotanana", "Tomjutlnsr4", "Ricanpadres", "Jasonblackbow", "Master-mark", "T0nykach71", "Af111", "Stl Strokin", "Dannieabn", "Tyshullieve", "X6bianca", "Jon357t", "Stanmaimframe", "Eddypinkram", "Mrcopyalot", "Angryexiled", "Housewife Kelly", "Blkkenny", "Mom Pov", "Rajxc8n5c5lo4", "Exxxecuter", "Priyapornstar", "Karasputin", "Evoeviltwin", "Onlycougars Com", "Wamimadacec", "Carolbaker", "Chris1la", "Mastronzo", "Mahesh1992", "See-hot-sluts-at-honeycams-dot-xyz", "Miquelpablo", "XEmpire Official", "Evelynbaku", "Naomi1", "Wichsmann", "Mrlover66", "Ferfabre", "Lipjobme", "Hddujbxujkjnnh", "Power Pisser", "Cumboy19581", "Salmonloves", "Bigfatbreastandasses", "Asshugger", "Bakerchef", "Lucky1191", "Shiny Cock Films", "Kato0607", "Muncie7689", "Frankyla", "Ypg239", "Dogfart Network", "Blacks On Blondes", "Velma Voodoo", "Thataverageplayer", "Mike44m", "Santanangel", "Perseids336", "Mrbustanut21", "Joe Iz Bakk", "Jaykun7", "Katamaran1000", "Bootyass Girl", "Dick Sucking Lips And Facials", "LilKiwwiMonster", "Swallowed", "My18teenscom", "Thesatman", "Ximezu", "Xcafeconlechex", "Soggybottom19", "They Love MzBoutit", "Bizofenokip", "Frankcasablancas", "Daddyg73", "Smeklinis", "Ethicalmum", "Pissdaddyf", "Bigomar", "Peterp0rn69", "Blackviper007", "Angelina Castro", "Bbw Lover Milf", "Matureslut3", "Sierranrushing90", "Plumper Pass", "Oldje", "Erotikvonnebenan", "Distretto Italia", "Anal Beauty", "Sanantoniotx27", "Mwahnbang", "Trekk9", "Ms Paris Rose", "Ca Head Queen", "Bigassdoll", "Throatlover2000", "Freaknasty1", "Magicman1212", "Freak Mob Media", "Candylocx", "Black Please", "Blahwa", "Mis Vilmas", "Hard Fucker 1984", "Iamateursxxx", "Kingmojo58", "Synthsexer", "Monsters Of Cock", "Blowfessionals", "Kion43rd", "Tommygunnz213", "Caras92", "Black Star Ent.", "Sexyinslipsmembers", "Rhino-24", "Upncomingpornqwn", "Buff Boi", "Sicflics", "Reggae Tonera 666", "Cwedcam", "Oliveramante", "Gdkfngwldnhdldb", "Buggotabigdick", "Daslhotiasht", "Go-deeper7", "SexyDejaVoo", "Watermelon Butt", "Martinchopasivo", "Spycam Babes", "Happy-ninja", "Phatdick919", "Jimmiwow", "Veroki", "Sorexxx", "Pascals Subsluts", "Sweetie Sully", "Edien26", "Hubble-hobble", "J19951020", "Larvatus", "Claudiazorra", "Martinspedia", "Real Sex Pass", "Phunbutts", "Headchanger", "Ballbusting Pornstars", "Hotdiab", "Banheiraorj", "EXPOSED", "Andy Star German", "Mybigcock1963", "Lexingtonluthorking", "Cavicornio719", "Bruce And Morgan", "Anal Vids Trailers", "Mj5556", "Gassybulbuli", "Vipissy");
var tagslist = new Array("gay", "homosexual", "plate", "shitty", "tranny", "kicking", "in balls", "shemale", "retarted", "torture", "murdered", "obese", "diarrhea", "tranny", "shit", "ruined", "needle", "needles", "torture", "spike", "sneeze", "sneezing", "shitting", "queef", "queefing", "grandma", "diseased", "disease", "fart", "farts", "anale", "diaper", "hentai", "puking", "shemales", "executed", "twinks", "execute", "granny", "grannys", "grandpa", "fishbone", "scat", "nasty", "slashed", "cutting", "cuts", "abortion", "isis", "scatlover", "preggo", "burning", "birth", "beheading", "maggot", "maggots", "magot", "shity", "behead", "vomitting", "vomiting", "smut", "beaten", "beating", "constipated", "choked", "feces", "pooping", "pooped", "hanging", "hanged", "fecal", "doughnuts", "vampiress", "kills", "killing", "puke", "pukes", "seizure", "shits", "vomits", "vomit", "ransom", "kidnapped", "hostage", "preggo", "killed", "stabbed", "horrible", "bloody", "dead", "anal", "pregnant", "scat", "baby", "shit", "poop", "crap", "fisting", "shooting", "stabbing", "shitting", "crapping", "snuf", "snuff", "robber", "turd", "shot", "robbery", "diapered", "stretching", "sliced", "fist", "fisting", "shots", "horrific", "horriffic", "injury", "fishes", "hits truck", "hits card", "bus hits", "runs over", "crushed", "injured", "horror", "gunshot", "gunshots", "slitting", "poltergeist", "asphixiated", "pitbull", "strangled", "broomhandle", "dismembered", "broomhandle", "plunger", "dismember", "vivisect", "open chest", "wound", "chest wound", "to death", "asphixiate", "abducted", "hanging", "gaping", "criminals", "shemaale", "dead", "toilet", "explosion", "explode", "explodes", "seagal", "exploding", "suitcase", "torched", "corpse", "cannibal", "canibal", "unlucky", "terror", "roast", "roasting", "toasty", "splitting", "fight", "clown", "circus", "midget", "sick", "ghost", "asphyxia", "pooping", "drowned", "drowns" ,"asphyxiate", "halloween", "wreck", "wrecked", "chokes", "brown", "guy eating", "survival", "face of war", "clamped", "simpleton", "suffocating", "clothespins", "tased", "hung up", "corngirl", "corncob", "knife", "corn", "fisted", "huge ass", "lactating", "corn girl", "meaty", "hand caught", "machine", "butthole", "anally destroyed", "anally", "pussy drill", "pussydrill", "a fish", "painal", "blown off", "blown up", "prostate", "poopy", "shemales", "buttfuck", "mommy", "analyzed", "assriding", "anal-porn", "ass-fucking", "ass-fuck", "assfuck", "assfucking","analporn", "punching", "kicking", "mom", "puke", "horse");
var tlcond = tagslist.join(" ");
var nlcond = namelist.join(" ");




function xpath(doc, xpath) {
	return doc.evaluate(xpath, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    }

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

var newAllDivs = xpath(document, "//div[@id='content']/div/div[starts-with(@id,'video_')]/div[@class='thumb-under']/p/a");
var allNameDivs = xpath(document, "//div[@id='content']/div/div[starts-with(@id,'video_')]/div[@class='thumb-under']/p[@class='metadata']/span/a/span");

for (var x=0;x<newAllDivs.snapshotLength;x++) {
	var text = newAllDivs.snapshotItem(x).textContent;
	var allWords = text.split(" ");
	var applied = 0;
	for (var z=0; z<allWords.length; z++) {
    for (var x1=0; x1<tagslist.length; x1++) {
			var w1 = new RegExp('\b'+escapeRegExp(tagslist[x1])+'\b','gmi');
		  //var w2 = new RegExp(escapeRegExp(tagslist[x1])+' ','gmi');
		  var w3 = new RegExp(' '+escapeRegExp(tagslist[x1])+' ','gmi');
			var w4 = new RegExp('^'+escapeRegExp(tagslist[x1])+' ','gmi');
			var w5 = new RegExp(' '+escapeRegExp(tagslist[x1])+'$','gmi');
	  	if (text.match(w1) || text.match(w3) || text.match(w4) || text.match(w5)) {
			 newAllDivs.snapshotItem(x).parentNode.parentNode.parentNode.setAttribute("style", "display:none!important;visibility:hidden!important;");
			 applied=1;
			 break;
		  }
		 }
		if (applied==1) {
		 break;
		}
	
  }
}


var newds = document.getElementById("content").getElementsByTagName("div");
for (var x in newds) {
	if (newds[x].id && newds[x].id.match(/video_/)) {
		var newSp = newds[x].getElementsByTagName("span");
		for (var xx in newSp) {
			if (newSp[xx].className && newSp[xx].className.match(/name/)) {
				var t = newSp[xx].textContent;
				if (nlcond.indexOf(t)!=-1) {
					newds[x].setAttribute("style", "display:none!important;visibility:hidden!important;");
				}
			}
		}
	}
}

