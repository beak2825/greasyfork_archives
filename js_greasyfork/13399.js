// ==UserScript==
// @name          Miss Surfersparadise Image Fixer
// @namespace     DoomTay
// @description   Attempts to fix broken images for Miss Surfersparadise by sourcing from a variety of other websites
// @include       http://web.archive.org/web/*/http://award.surpara.com/misssp/*
// @include       http://web.archive.org/web/*/http://event.surpara.com/misssp/*
// @include       http://web.archive.org/web/*/http://town.surpara.com/misssp/*
// @include       http://web.archive.org/web/*/http://ns.sp-net.ne.jp/misssp/*
// @include       https://web.archive.org/web/*/http://award.surpara.com/misssp/*
// @include       https://web.archive.org/web/*/http://event.surpara.com/misssp/*
// @include       https://web.archive.org/web/*/http://town.surpara.com/misssp/*
// @include       https://web.archive.org/web/*/http://ns.sp-net.ne.jp/misssp/*
// @exclude       /\*/
// @exclude       http://web.archive.org/web/*/http://award.surpara.com/misssp/2009/*
// @exclude       https://web.archive.org/web/*/http://award.surpara.com/misssp/2009/*
// @version       1.1.6
// @grant         none

// @downloadURL https://update.greasyfork.org/scripts/13399/Miss%20Surfersparadise%20Image%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/13399/Miss%20Surfersparadise%20Image%20Fixer.meta.js
// ==/UserScript==

var year = window.location.href.substr(window.location.href.lastIndexOf('/misssp/') + 8,4);
var domain = /:\/\/([a-w.-]+)\/mis/.exec(window.location.href)[1];

var pics = document.images;
var numberTrack = 0;
var kawaiiURL = "/web/1im_/http://kawaiiwp.free.fr/kawaiiscreen/miss_surfersparadise_" + year + "/miss_surfersparadise_" + year + "_";
var gaps = [];
	gaps[1999] = [];
	gaps[1999]["11369"] = {url: "089", tag: "kawaii"}; //131
	gaps[1999]["00873"] = {url: "093", tag: "kawaii"}; //137

	gaps[2000] = [];
	gaps[2000]["1601"] = {url: "042", tag: "kawaii"}; //050
	gaps[2000]["23398"] = {url: "066", tag: "kawaii"}; //083
	gaps[2000]["675-2"] = {url: "069", tag: "kawaii"}; //086
	gaps[2000]["8821-2"] = {url: "128", tag: "kawaii"}; //163
	gaps[2000]["7244"] = {url: "153", tag: "kawaii"}; //153
	gaps[2000]["9773"] = {url: "160", tag: "kawaii"}; //205
	gaps[2000]["4034"] = {url: "162", tag: "kawaii"}; //207
	gaps[2000]["17293-2"] = {url: "163", tag: "kawaii"}; //208
	gaps[2000]["4034-2"] = {url: "166", tag: "kawaii"}; //211
	gaps[2000]["8740-2"] = {url: "169", tag: "kawaii"}; //215
	gaps[2000]["a22"] = {url: "174", tag: "kawaii"}; //220
	gaps[2000]["a25"] = {url: "191", tag: "kawaii"}; //248

	gaps[2001] = [];
	gaps[2001]["18862"] = {url: "008", tag: "kawaii"}; //011
	gaps[2001]["28151"] = {url: "011", tag: "kawaii"}; //014
	gaps[2001]["14486"] = {url: "http://www7.plala.or.jp/livery/cg/summer2.jpg", tag: "resize"}; //042
	gaps[2001]["27858-3"] = {url: "055", tag: "kawaii"}; //069
	gaps[2001]["33196"] = {url: "145", tag: "kawaii"}; //177
	gaps[2001]["34630"] = {url: "146", tag: "kawaii"}; //179
	gaps[2001]["27885"] = {url: "147", tag: "kawaii"}; //180
	gaps[2001]["a21"] = {url: "244", tag: "kawaii"}; //302
	gaps[2001]["27858-4"] = {url: "246", tag: "kawaii"}; //304
	gaps[2001]["13300"] = {url: "/web/1im_/http://www.seri.sakura.ne.jp/~svine/bokutenjin/g2/gal0101/gatenchan.jpg", tag: "resize"}; //308

	gaps[2002] = [];
	gaps[2002]["065"] = {url: "/web/20160917083359im_/http://homepage3.nifty.com/tonbidou/cg/02/07.12.jpg", tag: "resize"};
	gaps[2002]["111"] = {url: "http://www.rose.ne.jp/~armaclub/cg/et562.jpg", tag: "resize"};

	gaps[2003] = [];
	gaps[2003]["107"] = {url: "http://www.geocities.co.jp/AnimeComic/2070/kabuwake2/r33.jpg", tag: "notmal"};
	gaps[2003]["175"] = {url: "/web/1im_/http://www.tk2.nmt.ne.jp/~adl0/ILLUST/illust/orijinaru/miss2003.jpg", tag: "resize"};
	gaps[2003]["198"] = {url: "http://www7.plala.or.jp/livery/cg/aya_sw.jpg", tag: "resize"};
	gaps[2003]["206"] = {url: "/web/1im_/http://www3.ocn.ne.jp/~akira.s/c04.jpg", tag: "resize"};
	gaps[2003]["240"] = {url: "http://mio.ciao.jp/original/04.jpg", tag: "normal"};
	gaps[2003]["242"] = {url: "/web/20161016201916im_/http://homepage3.nifty.com/tonbidou/cg/03/030718.jpg", tag: "resize"};
	gaps[2003]["307"] = {url: "http://www10.plala.or.jp/hour/pict/m_takahara.jpg", tag: "resize"};

	gaps[2004] = [];
	gaps[2004]["035"] = {url: "029", tag: "kawaii"};
	gaps[2004]["043"] = {url: "035", tag: "kawaii"};
	gaps[2004]["082"] = {url: "067", tag: "kawaii"};
	gaps[2004]["083"] = {url: "068", tag: "kawaii"};
	gaps[2004]["084"] = {url: "069", tag: "kawaii"};
	gaps[2004]["085"] = {url: "070", tag: "kawaii"};
	gaps[2004]["093"] = {url: "073", tag: "kawaii"};
	gaps[2004]["095"] = {url: "074", tag: "kawaii"};
	gaps[2004]["096"] = {url: "075", tag: "kawaii"};
	gaps[2004]["104"] = {url: "080", tag: "kawaii"};
	gaps[2004]["106"] = {url: "082", tag: "kawaii"};
	gaps[2004]["108"] = {url: "083", tag: "kawaii"};
	gaps[2004]["110"] = {url: "084", tag: "kawaii"};
	gaps[2004]["111"] = {url: "085", tag: "kawaii"};
	gaps[2004]["116"] = {url: "087", tag: "kawaii"};
	gaps[2004]["118"] = {url: "088", tag: "kawaii"};
	gaps[2004]["119"] = {url: "089", tag: "kawaii"};
	gaps[2004]["122"] = {url: "http://satousu.net/sat_cg/cgrm_old/ori06/ori_k_misa02.jpg", tag: "resize"};
	gaps[2004]["124"] = {url: "090", tag: "kawaii"};
	gaps[2004]["125"] = {url: "http://www.din.or.jp/~ttam/image/matuba-s.jpg", tag: "normal"};
	gaps[2004]["127"] = {url: "091", tag: "kawaii"};
	gaps[2004]["128"] = {url: "092", tag: "kawaii"};
	gaps[2004]["129"] = {url: "093", tag: "kawaii"};
	gaps[2004]["130"] = {url: "094", tag: "kawaii"};
	gaps[2004]["131"] = {url: "095", tag: "kawaii"};
	gaps[2004]["136"] = {url: "098", tag: "kawaii"};
	gaps[2004]["137"] = {url: "099", tag: "kawaii"};
	gaps[2004]["139"] = {url: "100", tag: "kawaii"};
	gaps[2004]["141"] = {url: "101", tag: "kawaii"};
	gaps[2004]["143"] = {url: "102", tag: "kawaii"};
	gaps[2004]["145"] = {url: "103", tag: "kawaii"};
	gaps[2004]["146"] = {url: "104", tag: "kawaii"};
	gaps[2004]["149"] = {url: "105", tag: "kawaii"};
	gaps[2004]["151"] = {url: "106", tag: "kawaii"};
	gaps[2004]["152"] = {url: "107", tag: "kawaii"};
	gaps[2004]["153"] = {url: "108", tag: "kawaii"};
	gaps[2004]["154"] = {url: "109", tag: "kawaii"};
	gaps[2004]["156"] = {url: "110", tag: "kawaii"};
	gaps[2004]["157"] = {url: "111", tag: "kawaii"};
	gaps[2004]["158"] = {url: "112", tag: "kawaii"};
	gaps[2004]["160"] = {url: "114", tag: "kawaii"};
	gaps[2004]["161"] = {url: "115", tag: "kawaii"};
	gaps[2004]["164"] = {url: "/web/1im_/http://www.angel-tail.org/gallery/original/cg/sezakikaori_480.jpg", tag: "resize"};
	gaps[2004]["165"] = {url: "117", tag: "kawaii"};
	gaps[2004]["166"] = {url: "118", tag: "kawaii"};
	gaps[2004]["167"] = {url: "119", tag: "kawaii"};
	gaps[2004]["168"] = {url: "http://mio.ciao.jp/original/08.jpg", tag: "normal"};
	gaps[2004]["170"] = {url: "122", tag: "kawaii"};
	gaps[2004]["171"] = {url: "123", tag: "kawaii"};
	gaps[2004]["172"] = {url: "124", tag: "kawaii"};
	gaps[2004]["173"] = {url: "125", tag: "kawaii"};
	gaps[2004]["174"] = {url: "126", tag: "kawaii"};
	gaps[2004]["177"] = {url: "http://www.mb.ccnw.ne.jp/azuki/liaimag/04miss-futaba.jpg", tag: "resize"};
	gaps[2004]["179"] = {url: "128", tag: "kawaii"};
	gaps[2004]["180"] = {url: "129", tag: "kawaii"};
	gaps[2004]["181"] = {url: "130", tag: "kawaii"};
	gaps[2004]["182"] = {url: "131", tag: "kawaii"};
	gaps[2004]["201"] = {url: "141", tag: "kawaii"};
	gaps[2004]["203"] = {url: "143", tag: "kawaii"};
	gaps[2004]["204"] = {url: "144", tag: "kawaii"};
	gaps[2004]["205"] = {url: "145", tag: "kawaii"};
	gaps[2004]["206"] = {url: "/web/1im_/http://unabara.web.infoseek.co.jp/sylvestris-s.jpg", tag: "normal"};
	gaps[2004]["207"] = {url: "147", tag: "kawaii"};
	gaps[2004]["208"] = {url: "148", tag: "kawaii"};
	gaps[2004]["209"] = {url: "149", tag: "kawaii"};
	gaps[2004]["212"] = {url: "151", tag: "kawaii"};
	gaps[2004]["214"] = {url: "153", tag: "kawaii"};
	gaps[2004]["215"] = {url: "154", tag: "kawaii"};
	gaps[2004]["218"] = {url: "155", tag: "kawaii"};
	gaps[2004]["219"] = {url: "156", tag: "kawaii"};
	gaps[2004]["220"] = {url: "157", tag: "kawaii"};
	gaps[2004]["225"] = {url: "161", tag: "kawaii"};
	gaps[2004]["228"] = {url: "162", tag: "kawaii"};
	gaps[2004]["230"] = {url: "163", tag: "kawaii"};
	gaps[2004]["232"] = {url: "165", tag: "kawaii"};
	gaps[2004]["233"] = {url: "166", tag: "kawaii"};
	gaps[2004]["234"] = {url: "167", tag: "kawaii"};
	gaps[2004]["235"] = {url: "168", tag: "kawaii"};
	gaps[2004]["245"] = {url: "http://air.rulez.jp/cg/cut/crusade/layra.jpg", tag: "resize"};
	gaps[2004]["247"] = {url: "174", tag: "kawaii"};
	gaps[2004]["248"] = {url: "175", tag: "kawaii"};
	gaps[2004]["250"] = {url: "176", tag: "kawaii"};
	gaps[2004]["251"] = {url: "177", tag: "kawaii"};
	gaps[2004]["252"] = {url: "178", tag: "kawaii"};
	gaps[2004]["255"] = {url: "181", tag: "kawaii"};
	gaps[2004]["256"] = {url: "182", tag: "kawaii"};
	gaps[2004]["257"] = {url: "183", tag: "kawaii"};
	gaps[2004]["258"] = {url: "184", tag: "kawaii"};
	gaps[2004]["260"] = {url: "185", tag: "kawaii"};
	gaps[2004]["263"] = {url: "187", tag: "kawaii"};
	gaps[2004]["264"] = {url: "188", tag: "kawaii"};
	gaps[2004]["266"] = {url: "189", tag: "kawaii"};
	gaps[2004]["270"] = {url: "192", tag: "kawaii"};
	gaps[2004]["272"] = {url: "194", tag: "kawaii"};
	gaps[2004]["273"] = {url: "195", tag: "kawaii"};
	gaps[2004]["274"] = {url: "196", tag: "kawaii"};
	gaps[2004]["281"] = {url: "200", tag: "kawaii"};
	gaps[2004]["282"] = {url: "201", tag: "kawaii"};
	gaps[2004]["292"] = {url: "207", tag: "kawaii"};
	gaps[2004]["293"] = {url: "208", tag: "kawaii"};
	gaps[2004]["294"] = {url: "209", tag: "kawaii"};
	gaps[2004]["296"] = {url: "210", tag: "kawaii"};
	gaps[2004]["299"] = {url: "212", tag: "kawaii"};
	gaps[2004]["300"] = {url: "213", tag: "kawaii"};
	gaps[2004]["302"] = {url: "214", tag: "kawaii"};
	gaps[2004]["303"] = {url: "215", tag: "kawaii"};
	gaps[2004]["305"] = {url: "216", tag: "kawaii"};
	gaps[2004]["306"] = {url: "217", tag: "kawaii"};
	gaps[2004]["307"] = {url: "218", tag: "kawaii"};
	gaps[2004]["309"] = {url: "219", tag: "kawaii"};
	gaps[2004]["310"] = {url: "/web/20050226112841id_/http://kuu.under.jp/gallery/e/23.jpg", tag: "resize"};
	gaps[2004]["314"] = {url: "220", tag: "kawaii"};
	gaps[2004]["316"] = {url: "221", tag: "kawaii"};
	gaps[2004]["318"] = {url: "222", tag: "kawaii"};
	gaps[2004]["319"] = {url: "223", tag: "kawaii"};

var wallpaperLinks = {};

for(var i = 0; i < pics.length; i++)
{
	//Skip over stuff related to the Wayback Machine toolbar
	if(document.getElementById("wm-ipp") && document.getElementById("wm-ipp").contains(pics[i])) continue;

	if(pics[i].src.includes("2006title"))
	{
		pics[i].src = pics[i].src.replace("award.surpara.com/misssp/img/2006title","town.surpara.com/misssp/img/title");
		continue;
	}

	var entryNumber = pics[i].alt;

	if(year == 2003 && entryNumber == 131) wallpaperLinks[entryNumber] = null;
	else if(pics[i].parentNode.parentNode.parentNode.previousElementSibling && pics[i].parentNode.parentNode.parentNode.previousElementSibling.querySelector("a")) wallpaperLinks[entryNumber] = pics[i].parentNode.parentNode.parentNode.previousElementSibling.querySelector("a");

	if(year == 2002 && entryNumber == 262)
	{
		switchWithResize("http://old.wallcoo.net/cartoon/miss_surfersparadise_2002_02/m01/135262-w.jpg",pics[i]);
		wallpaperLinks[entryNumber].href = "http://old.wallcoo.net/cartoon/miss_surfersparadise_2002_02/m01/135262-w.jpg";
		continue;
	}

	//Bridge some gaps with trustworthy alternatives. This is really only trustworthy when the "bad" image is a "wallpaper" case between two other "wallpaper" cases or when it came from the artist's website, with a few exceptions. Either way it'll prevent waste of resources on what would otherwise be lost causes.
	if(gaps[year] !== undefined && gaps[year][entryNumber] !== undefined)
	{
		if(gaps[year][entryNumber].tag == "kawaii")
		{
			switchWithResize(kawaiiURL + gaps[year][entryNumber].url + ".jpg",pics[i]);
			wallpaperLinks[entryNumber].href = kawaiiURL + gaps[year][entryNumber].url + ".jpg";
		}
		else if(gaps[year][entryNumber].tag == "resize") switchWithResize(gaps[year][entryNumber].url,pics[i]);
		else pics[i].src = gaps[year][entryNumber].url;
		continue;
	}

	testImage(pics[i]);
}

function testImage(pic)
{
	pic.addEventListener("error", replaceImage, true);
	var number = pic.alt;

	if(pic.complete && pic.naturalWidth == 0) replaceImage();

	function replaceImage()
	{
		if(isNaN(parseInt(year)))
		{
			testURLs(["award.surpara.com","event.surpara.com","town.surpara.com","ns.sp-net.ne.jp"],pic.src,false).then(function(response)
			{
				if(response != null)
				{
					pic.src = response;
				}
			});
		}

		if(year < 2007)
		{
			//Image is not fine. Begin testing by testing against other Surpara domains
			var domainSet;

			if(year == 2000 || year == 2003) domainSet = ["event.surpara.com","ns.sp-net.ne.jp"];
			else if(year < 2003 || year == 2006) domainSet = ["event.surpara.com"];
			else if(year == 2004) domainSet = ["award.surpara.com","event.surpara.com","ns.sp-net.ne.jp"];
			else domainSet = ["award.surpara.com","event.surpara.com","town.surpara.com","ns.sp-net.ne.jp"];

			testURLs(domainSet,pic.src,false).then(function(response)
			{
				if(response != null)
				{
					pic.src = response;
					return "complete";
				}
				else if(!isNaN(number))
				{
					//No good. All we can do now is skip over any image that doesn't have a corresponding wallpaper. The image might not always be wrapped in link tags
					if(wallpaperLinks[number] == undefined || isNaN(number)) return null;
					//So it looks like there might be a wallpaper version after all. Let's try to find it.
					var wallURL;
					if(year == 1999) wallURL = "/web/1im_/http://" + domain  + "/misssp/1999/img/" + number + "-2.jpg";
					else if(year <= 2004) wallURL = "/web/1im_/http://" + domain  + "/misssp/" + year + "/img/" + number + "-w.jpg";
					else if(year > 2004) wallURL = "/web/1im_/http://" + domain  + "/misssp/" + year + "/w/" + number + ".jpg";

					return testURLs(["event.surpara.com","ns.sp-net.ne.jp"],wallURL,true);
				}
				else return null;
			}).then(function(wallTest)
			{
				if(wallTest == "complete") return wallTest;
				else if(wallTest != null)
				{
					switchWithResize(wallTest, pic);
					wallpaperLinks[number].href = wallTest;
					if(year >= 2005) pic.parentNode.href = wallTest;
					return null;
				}
				else if(!isNaN(number))
				{
					//Drawing from different subdomains did no good, so we're trying wallcoo and kawaiiwp.free.fr
					if(year > 2004 && year < 2009) return isValid(kawaiiURL + number + ".jpg");
					else return null;
				}
				else return null;
			}).then(function(validTest)
			{
				if(validTest == "complete") return validTest;
				else if(validTest != null)
				{
					switchWithResize(validTest, pic);
					wallpaperLinks[number].href = validTest;
					if(year >= 2005) pic.parentNode.href = validTest;
				}
				return validTest;
			}).then(function()
			{
				//Make sure the page is actually loaded before continuing, as we will look at the pic's naturalWidth to see if we will need to use our last resort
				if(pic.complete) return pic.naturalWidth == 0;
				else return new Promise(function(resolve) {
					pic.addEventListener("load", function() { resolve(pic.naturalWidth == 0) }, true);
				});
			}).then(function(stillDead)
			{
				//It's come all this way. Wallcoo might be our last hope for digging up the missing image. Its naming and sorting conventions have fluctuated throughout the years, so getting what we need from here has been put in its own function.
				if(year < 2005 && stillDead && wallpaperLinks[number]) attemptWallcoo(pic, number);
			}).catch(function(error) { console.log(error); });
		}
		else
		{
			if(year > 2004 && year < 2009)
			{
				isValid(kawaiiURL + number + ".jpg").then(function(validTest)
				{
					if(validTest != null)
					{
						switchWithResize(validTest, pic);
						wallpaperLinks[number].href = validTest;
						if(year >= 2005) pic.parentNode.href = pic.parentNode.href = validTest;
						return;
					}
				}, function(error) { console.log(error); });
			}
		}
	}
}

var tables = document.querySelectorAll("td[background]");
Array.prototype.forEach.call(tables, function(table){
  isValid(table.getAttribute("background")).then(function(value) {
		if(value == null) bgTest(table);
	}, function(error) { console.log(error); });
});

function bgTest(background)
{
	var bg = relativeToAbsolute(background.getAttribute("background"));
	testURLs(["award.surpara.com","event.surpara.com","town.surpara.com","ns.sp-net.ne.jp"],bg,false).then(function(bgTest)
	{
		if(bgTest != null)
		{
			background.setAttribute("background",bgTest);
		}
	});
}

function relativeToAbsolute(relativeURL)
{
	var testLink = document.createElement("A");
	testLink.href = relativeURL;
	return testLink.href;
}

function testURLs(domainSet,URLTemplate,wallCheck)
{
	var testSet = [];
	var promise = new Promise(function(resolve,reject) {
		for(var p = 0; p < domainSet.length; p++)
		{
			if(domain == domainSet[p] && !wallCheck) testSet[p] = Promise.resolve(null);
			else testSet[p] = isValid(URLTemplate.replace(domain,domainSet[p]));
		}
		Promise.all(testSet).then(function(value) {
			resolve(value.find(result => result != null));
		}, function(error) { console.log(error); });
	});
	return promise;
}

function attemptWallcoo(target,number)
{
	function attemptSubstitution(url)
	{
		isValid(url,target).then(function(value)
		{
			if(value != null)
			{
				switchWithResize(value,target);
				wallpaperLinks[number].href = value;
			}
			return;
		}, function(error) { console.log(error); });
	}
	switch(parseInt(year))
	{
		case 2001:
			attemptSubstitution("/web/1im_/http://old.wallcoo.net/cartoon/miss_surfersparadise_2001/m01/" + number + "-w.jpg");
			break;
		case 2002:
			attemptSubstitution("/web/1im_/http://old.wallcoo.net/cartoon/miss_surfersparadise_2002_01/m01/" + number + "-w.jpg");
			break;
		case 2003:
			if(parseInt(number) > 142)
			{
				attemptSubstitution("/web/1im_/http://old.wallcoo.net/cartoon/miss_surfersparadise_2003_02/m01/" + number + "-w.jpg");
			}
			else
			{
				//Factoring in a variable into the for loop helps keep down the number of loops run
				if(numberTrack == 0) numberTrack = parseInt(entryNumber) + 30;
				var numberAttempts = [];
				for(var n = numberTrack; n < 167; n++)
				{
					numberAttempts[n - numberTrack] = isValid("/web/1im_/http://old.wallcoo.net/cartoon/miss_surfersparadise_2003_01/m01/" + n + "_" + number + "-w.jpg");
				}
				Promise.all(numberAttempts).then(function(value) {
					var v = value.findIndex(result => result != null);
					if(v != -1)
					{
						var s = v + numberTrack;
						switchWithResize("/web/1im_/http://old.wallcoo.net/cartoon/miss_surfersparadise_2003_01/m01/" + s + "_" + number + "-w.jpg", target);
						wallpaperLinks[number].href = "/web/1im_/http://old.wallcoo.net/cartoon/miss_surfersparadise_2003_01/m01/" + s + "_" + number + "-w.jpg";
					}
				}, function(error) { console.log(error); });
			}
			break;
		case 2004:
			attemptSubstitution("/web/1im_/http://www.wallcoo.com/cg/miss_surfersparadise_2004/images/[wallcoo_com]_anime_cg_" + number + "-w.jpg");
			break;
		default:
			//This is different from the 2004 case. Note the lack of -w
			attemptSubstitution("/web/1im_/http://www.wallcoo.net/anime/miss_surfersparadise_" + year + "/images/[wallcoo_com]_anime_cg_" + number + ".jpg");
			break;
	}
}

function isValid(url)
{
	var promise = new Promise(function(resolve) {
		var newURL = new XMLHttpRequest();
		newURL.open("HEAD", url, true);
		newURL.onload = function () {
			if(this.status != 404 && this.status != 200) console.log(url, this.status);
			if(!this.getResponseHeader('Content-Type').includes("text/html")) resolve(this.responseURL);
			else
			{
				if(this.status == 503) resolve(isValid(url));
				else resolve(null);
			}
		};
		newURL.onerror = function(e)
		{
			console.log("Problem with",url,"\n",e);
		}
		newURL.send();
	}).catch(function(e) { console.log(e); });
	return promise;
}

function switchWithResize(url, target)
{
	target.src = url;
	target.width = 300;
	target.addEventListener("load", function() {
		if(target.naturalWidth > target.naturalHeight) target.width = 400;
		else
		{
			target.height = 400;
			target.width = 400 * (target.naturalWidth / target.naturalHeight);
		}
	}, true);
}