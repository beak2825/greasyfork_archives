(function(){
var defaultSettings = {
	prefetchNext: 5, //number of prefetched pages ahead
	prefetchBack: 5, //number of prefetched pages behind
	prefetchNextStart: 2, //number of prefetched pages ahead when the script starts
	prefetchBackStart: 1, //number of prefetched pages behind when the script starts
	prefetchNoNext: true, //specifies if previous page should be prefetched when theres no next page
	fullLayout: true, //true for full layout mode, false for minimalistic mode
	clickImgNavigates: true, //specifies if clicking the image will change pages
	clikLeftHalfGoesBack: true, //specifies if clicking the left half of the image will take you to the previous page
	flipControlsManga: false, //flip the controls (L/R arrows, L/R image click, back/next buttons) for mangas or other right-to-left content
	autozoom: false, //enable fit-to-screen
	shrinkWidth: false, //when fit-to-screen enabled and image too wide, shrink it
	shrinkHeight: false, //when fit-to-screen enabled and image too long, shrink it
	expandWidth: false, //when fit-to-screen enabled and image too narrow, expand it
	expandHeight: false, //when fit-to-screen enabled and image too short, expand it
	showButtons: true, //show or hide the buttons (back/next, bookmarks, settings, etc...)
	borderLR: 0, //pixels to leave as border to the sides of the image when zooming and scrolling
	borderUD: 0, //pixels to leave as border above and below the image when zooming and scrolling
	goToBookmark: true, //if you have 1 bookmark saved for a site, asks you if you want to go there when you visit the site
	moveWhileLoading: false, //lets you change pages even if the image for the next page is still loading
	debugMode: false, //alerts on errors, and shows some of the currently cache'd pages/images with the "," key
	showSettingsOnFail: false, //if no settings are found for this site and default ones didn't work, show settings screen
	keyboardShortcuts: { //keyboard shortcuts...
		back: {name: 'LEFT', keyCode: 37, ctrlKey: false, shiftKey: false, altKey: false},
		next: {name: 'RIGHT', keyCode: 39, ctrlKey: false, shiftKey: false, altKey: false},
		scroll_left: {name: 'CTRL + LEFT', keyCode: 37, ctrlKey: true, shiftKey: false, altKey: false},
		scroll_right: {name: 'CTRL + RIGHT', keyCode: 39, ctrlKey: true, shiftKey: false, altKey: false},
		scroll_up: {name: 'CTRL + UP', keyCode: 38, ctrlKey: true, shiftKey: false, altKey: false},
		scroll_down: {name: 'CTRL + DOWN', keyCode: 40, ctrlKey: true, shiftKey: false, altKey: false},
		reload: {name: '.', keyCode: 190, ctrlKey: false, shiftKey: false, altKey: false},
		set_bm: {name: 'CTRL + ALT + B', keyCode: 66, ctrlKey: true, shiftKey: false, altKey: true},
		add_bm: {name: 'CTRL + ALT + A', keyCode: 65, ctrlKey: true, shiftKey: false, altKey: true},
		layout: {name: '-', keyCode: isWebKit() ? 189 : 173, ctrlKey: false, shiftKey: false, altKey: false},
		botones: {name: 'SHIFT + -', keyCode: isWebKit() ? 189 : 173, ctrlKey: false, shiftKey: true, altKey: false},
		fit: {name: '+', keyCode: isWebKit() ? 187 : 171, ctrlKey: false, shiftKey: false, altKey: false},
		slide: {name: 'CTRL + ALT + S', keyCode: 83, ctrlKey: true, shiftKey: false, altKey: true},
		debug_mode: {name: 'CTRL + ALT + X', keyCode: 88, ctrlKey: true, shiftKey: false, altKey: true},
		debug_info: {name: ',', keyCode: 188, ctrlKey: false, shiftKey: false, altKey: false}
	}
};

// ==UserScript==
// @name		   Webcomic Reader
// @author		 Javier Lopez <ameboide@gmail.com> https://github.com/ameboide , fork by v4Lo https://github.com/v4Lo and by anka-213 http://github.com/anka-213
// @version		2019.09.12
// @license		MIT
// @namespace	  http://userscripts.org/scripts/show/59842
// @description	Can work on almost any webcomic/manga page, preloads 5 or more pages ahead (or behind), navigates via ajax for instant-page-change, lets you use the keyboard, remembers your progress, and it's relatively easy to add new sites
// @homepageURL	https://github.com/anka-213/webcomic_reader#readme
// @supportURL	 https://github.com/anka-213/webcomic_reader/issues
// @updatetype	 24
// @grant		  GM_getValue
// @grant		  GM_setValue
// @grant		  GM_deleteValue
// @grant		  GM_xmlhttpRequest
// @grant		  GM_registerMenuCommand
// @grant		  GM_openInTab
// @include		http://www.sluggy.com/*
// @include		http://sluggy.com/*
// @include		http://www.penny-arcade.com/comic*
// @include		http://penny-arcade.com/comic*
// @include		https://www.penny-arcade.com/comic*
// @include		https://penny-arcade.com/comic*
// @match		  *://*.xkcd.com/*
// @include		http://www.giantitp.com/*
// @include		http://www.dilbert.com/strip/*
// @include		http://dilbert.com/strip/*
// @include		http://hf.dilbert.com/strip/*
// @include		http://www.explosm.net/*
// @include		http://explosm.net/*
// @include		http://www.nuklearpower.com/*
// @include		http://www.reallifecomics.com/*
// @include		http://reallifecomics.com/*
// @include		http://www.pvponline.com/*
// @include		http://pvponline.com/*
// @include		http://www.brawlinthefamily.com/*
// @include		http://drmcninja.com/*
// @include		http://www.vgcats.com/*/*
// @include		http://www.phdcomics.com/*
// @include		http://www.cad-comic.com/*
// @match		  *://*.smbc-comics.com/*
// @include		http://abstrusegoose.com/*
// @include		http://thedoghousediaries.com/*
// @include		http://www.erfworld.com/*
// @include		http://es.juanelo.net/*/*
// @include		http*://readms.net/*
// @include		http*://*.readms.net/*
// @include		http://www.qwantz.com/*
// @include		http://qwantz.com/*
// @include		http://www.2pstart.com/*/*
// @include		http://www.spaceavalanche.com/*
// @include		http://www.gunshowcomic.com/*
// @include		http://gunshowcomic.com/*
// @include		http://www.terrorisland.net/*
// @include		http://nedroid.com/*
// @include		http://www.bobandgeorge.com/*
// @include		http://bobandgeorge.com/*
// @include		http://www.stationv3.com/*
// @include		http://www.lfgcomic.com/page/*
// @include		http://lfgcomic.com/page/*
// @include		http://www.gpf-comics.com/*
// @match		  *://*.questionablecontent.net/*
// @include		http://www.daisyowl.com/*
// @include		http://daisyowl.com/*
// @include		http://www.hyperdeathbabies.com/*
// @include		http://amultiverse.com/*
// @include		http://wondermark.com/*
// @include		http://www.amazingsuperpowers.com/*
// @match		  *://fanfox.net/*
// @match		  *://m.fanfox.net/*
// @include		http://www.leasticoulddo.com/*
// @include		http://leasticoulddo.com/*
// @include		http://www.sinfest.net/*
// @include		http://www.crfh.net/*
// @include		http://crfh.net/*
// @include		http://www.pennyandaggie.com/*
// @include		http://pennyandaggie.com/*
// @include		http://www.darkbolt.com/*
// @include		http://darkbolt.com/*
// @match		*://egscomics.com/*
// @match		*://www.egscomics.com/*
// @include		http://www.the-gutters.com/*
// @include		http://noneedforbushido.com/*
// @include		http://www.teahousecomic.com/*
// @include		http://www.applegeeks.com/*
// @include		http://applegeeks.com/*
// @include		http://www.nettserier.no/*
// @include		http://nettserier.no/*
// @include		http*://www.nerfnow.com/*
// @include		http://www.little-gamers.com/*
// @include		http://www.duelinganalogs.com/*
// @include		http://www.myextralife.com/*
// @include		http://notinventedhe.re/*
// @include     *://mangaseeonline.us/*
// @include		http://www.unshelved.com/*
// @include		https://www.eviscerati.org/comics*
// @include		http://buttersafe.com/*
// @include		http://www.romanticallyapocalyptic.com/*
// @include		http://romanticallyapocalyptic.com/*
// @include		http://www.somethingpositive.net/*
// @include		http://somethingpositive.net/*
// @include		http://www.rhymes-with-witch.com/*
// @include		http://rhymes-with-witch.com/*
// @include		http://www.superstupor.com/*
// @include		http://superstupor.com/*
// @include		http://www.misfile.com/*
// @include		http://www.asofterworld.com/*
// @include		http://asofterworld.com/*
// @include		http://www.achewood.com/*
// @include		http://achewood.com/*
// @include		http://www.biggercheese.com/*
// @include		http://biggercheese.com/*
// @include		http://www.gwscomic.com/*
// @include		http://gwscomic.com/*
// @include		http://www.fonflatter.de/*
// @include		http://www.ruthe.de/*
// @include		http://ruthe.de/*
// @include		http://www.daybydaycartoon.com/*
// @include		http://daybydaycartoon.com/*
// @include		http://www.dieselsweeties.com/*
// @include		http://dieselsweeties.com/*
// @include		http://www.foxtrot.com/*
// @include		http://www.csectioncomics.com/*
// @include		http://garfieldminusgarfield.net/*
// @include		http://www.girlgeniusonline.com/*
// @include		http://www.gocomics.com/*
// @exclude		http://www.gocomics.com/
// @exclude		http://www.gocomics.com/?*
// @include		http*://www.gunnerkrigg.com/*
// @include		http*://gunnerkrigg.com/*
// @include		http://www.ho-lo.co.il/*
// @include		http://www.threepanelsoul.com/*
// @include		http://threepanelsoul.com/*
// @match		  *://*.oglaf.com/*
// @include		http://www.kevinandkell.com/*
// @include		http://kevinandkell.com/*
// @include		http://www.lackadaisycats.com/comic.php*
// @include		http://lackadaisycats.com/comic.php*
// @include		http://www.lukesurl.com/*
// @include		http://mycardboardlife.com/*
// @include		http*://megatokyo.com/*
// @include		http*://www.megatokyo.it/*
// @include		http*://www.megatokyo.de/*
// @include		http://noreasoncomics.com/*
// @include		http://www.pixelcomic.net/*
// @include		http://pixelcomic.net/*
// @include		http://www.redmeat.com/*
// @include		http://redmeat.com/*
// @include		http://sexylosers.com/*
// @include		http://www.doonesbury.com/*
// @include		http://www.pbfcomics.com/*
// @include		http://tjandamal.com/*
// @include		http://sfeertheory.littlefoolery.com/*
// @include		http://wanderingones.com/*
// @include		http://www.big-big-truck.com/ayiw/*
// @include		http://big-big-truck.com/ayiw/*
// @include		http://wapsisquare.com/*
// @include		http://www.wastedtalent.ca/*
// @include		http://www.wulffmorgenthaler.com/*
// @include		http://wulffmorgenthaler.com/*
// @include		http://www.weregeek.com/*
// @include		http://*.katbox.net/*
// @include		http://*.keenspace.com/*
// @include		http://*.comicgenesis.com/*
// @include		http://www.beanleafpress.com/*
// @include		http://www.theoswaldchronicles.com/*
// @include		*://www.awkwardzombie.com/*
// @include		*://awkwardzombie.com/*
// @include		http://*.seraph-inn.com/*
// @include		https://www.fakku.net/manga/*
// @include		https://www.fakku.net/doujinshi/*
// @include		http://www.deadwinter.cc/*
// @include		http://deadwinter.cc/*
// @include		http://www.loveisintheblood.com/*
// @include		http://rhapsodies.wpmorse.com/*
// @include		http://www.piratesofmars.com/*
// @include		http://www.earthsongsaga.com/vol*
// @include		http://www.goblinscomic.org/*
// @include		http://www.venusenvycomic.com/*
// @include		http://venusenvycomic.com/*
// @include		http://www.meekcomic.com/*
// @include		http://www.dominic-deegan.com/*
// @include		http://dominic-deegan.com/*
// @include		http://yafgc.net/*
// @include		http://www.sdamned.com/*
// @include		http://www.twolumps.net/*
// @include		http://twolumps.net/*
// @include		http://www.precociouscomic.com/*
// @include		http://precociouscomic.com/*
// @include		http://betweenplaces.spiderforest.com/*
// @include		http://specialschool.spiderforest.com/*
// @include		http://requiem.spiderforest.com/*
// @include		http://sevensmith.net/chirault/*
// @include		http://www.junglestudio.com/roza/*
// @include		http://www.dream-scar.net/*
// @include		http://dream-scar.net/*
// @include		http://www.tryinghuman.com/*
// @include		http://tryinghuman.com/*
// @include		http://www.thedreamercomic.com/*
// @include		http://thedreamercomic.com/
// @include		http://www.shazzbaa.com/*
// @include		http://shazzbaa.com/*
// @match		  *://*.sandraandwoo.com/*
// @include		http://www.freakangels.com/*
// @include		http://www.sakanacomic.com/*
// @include		http://keychain.patternspider.net/*
// @include		http://www.collectedcurios.com/*
// @include		http://www.sylvanmigdal.com/*
// @include		http://sylvanmigdal.com/*
// @include		http://www.c.urvy.org/*
// @include		http://c.urvy.org/*
// @include		http://www.doublefine.com/*
// @include		http://www.survivingtheworld.net/*
// @include		http://survivingtheworld.net/*
// @include		http://nonadventures.com/*
// @include		http://www.robandelliot.cycomics.com/*
// @include		http://robandelliot.cycomics.com/*
// @include		http://soulsymphonycomic.com/*
// @include		http://www.blastwave-comic.com/*
// @include		http://www.channelate.com/*
// @include		http://www.optipess.com/*
// @include		http://www.drawuntilitsfunny.com/*
// @include		http://beardfluff.com/*
// @include		http://lawlscomic.com/*
// @include		http://www.maakies.com/*
// @include		http://www.lefthandedtoons.com/*
// @include		http://trollscience.com/*
// @include		http://www.diggercomic.com/*
// @include		http://luciphurrsimps.com/*
// @include		http://nikkisprite.com/*
// @include		http://www.gronkcomic.com/*
// @include		http://www.redsplanet.com/*
// @include		http://www.cowshell.com/*
// @include		http://everblue-comic.com/*
// @include		http://tmkcomic.depleti.com/*
// @include		http://www.remindblog.com/*
// @include		http://inkdolls.com/*
// @include		http://www.terra-comic.com/*
// @include		http://www.redmoonrising.org/*
// @include		http://www.khaoskomix.com/*
// @include		http://memoria.valice.net/*
// @include		http://www.twilightlady.com/*
// @include		http*://e-hentai.org/*
// @include		http://www.perveden.com/*
// @include		http://www.bittersweetcandybowl.com/*
// @include		http://www.imagebam.com/*
// @include		http://www.exploitationnow.com/*
// @include		http://basicinstructions.net/*
// @include		http://www.missmab.com/*
// @include		http://www.lookwhatibroughthome.com/*
// @include		http://hijinksensue.com/*
// @include		http://www.darthsanddroids.net/*
// @include		http://darthsanddroids.net/*
// @include		http://www.harkavagrant.com/*
// @include		http://dresdencodak.com/*
// @include		http://www.straysonline.com/comic/*
// @include		http://straysonline.com/comic/*
// @include		http://www.dragonball-multiverse.com/*
// @include		http://insanesoft.org/fanfyria/*
// @include		http://*.snafu-comics.com/*
// @include		http://www.wayfarersmoon.com/*
// @include		http://wayfarersmoon.com/*
// @include		http://*.smackjeeves.com/*
// @include		http://www.10kcommotion.com/*
// @include		http://10kcommotion.com/*
// @include		http://www.multiplexcomic.com/*
// @include		http://multiplexcomic.com/*
// @include		http://www.johnandjohn.nl/index.php?*wltypeid=1*
// @include		http://www.sorcery101.net/*
// @include		http://www.treadingground.com/*
// @include		http://www.kiwiblitz.com/*
// @include		http://thepunchlineismachismo.com/*
// @include		http://kafkaskoffee.com/*
// @include		http://occasionalcomics.com/*
// @include		http://www.zombieboycomics.com/*
// @include		http://www.babyblues.com/*
// @include		http://babyblues.com/*
// @include		http://www.bearandtiger.com/*
// @include		http*://exhentai.org/*
// @include		http://www.wigucomics.com/*
// @include		http://www.mankin-trad.net/*
// @include		http://mankin-trad.net/*
// @include		http://www.scarygoround.com/*
// @include		http://scarygoround.com/*
// @include		http://www.schlockmercenary.com/*
// @include		http://www.warehousecomic.com/*
// @include		http://warehousecomic.com/*
// @include		http://www.tnemrot.com/*
// @include		http://www.holiday-wars.com/*
// @include		http://www.zapcomic.com/*
// @include		http://www.dumbingofage.com/*
// @include		http://www.shortpacked.com/*
// @include		http://www.itswalky.com/*
// @include		http://itswalky.com/*
// @include		http://www.evildivacomics.com/*
// @include		http://axecop.com/*
// @include		http://www.reddit.com/
// @include		http://www.reddit.com/?*
// @include		http://www.reddit.com/r/*
// @exclude		http://www.reddit.com/*/comments/*
// @include		http://blankitcomics.com/*
// @include		http://doctorcatmd.com/*
// @include		http://www.sheldoncomics.com/*
// @include		http://sheldoncomics.com/*
// @include		http://luscious.net/*/pictures/*
// @include		http://www.geekculture.com/joyoftech/*
// @include		http://www.realmofatland.com/*
// @include		http://realmofatland.com/*
// @include		http://thedoujin.com/index.php/pages/*
// @include		http://www.oslevadosdabreca.com/*
// @include		http://www.thedevilbear.com/*
// @include		http://thedevilbear.com/*
// @include		http://www.exiern.com/*
// @include		http://nsfw-comix.com/*
// @include		http://jaynaylor.com/*
// @include		http://www.anelnoath.com/*
// @include		http://www.faans.com/*
// @include		http://www.truefork.org/*
// @include		http://truefork.org/*
// @include		http*://www.thewotch.com/*
// @include		http*://cheer.sailorsun.org/*
// @include		http://montrose.is/sgvy/archives/*
// @include		http://www.montrose.is/sgvy/archives/*
// @include		http://www.drunkduck.com/*
// @include		http://drunkduck.com/*
// @include		http://www.ephralon.de/seekers_detailed.php*
// @include		http://ephralon.de/seekers_detailed.php*
// @include		http://www.terinu.com/*
// @include		http://terinu.com/*
// @include		http://dcisgoingtohell.com/*
// @include		http://las-historietas.blogspot.com/*
// @include		http://www.palcomix.com/*
// @include		http://palcomix.com/*
// @include		http://malandchad.com/*
// @include		http://www.digitalcomicmuseum.com/*
// @include		http://digitalcomicmuseum.com/*
// @include		http://fourcolorshadows.blogspot.com/*
// @include		http://thehorrorsofitall.blogspot.com/*
// @include		*//bato.to/chapter*
// @include		http://www.octopuspie.com/*
// @include		http://www.lovemenicecomic.com/*
// @include		http://blog.saveapathea.com/*
// @include		http://www.dead-philosophers.com/*
// @include		http://www.kingfeatures.com/*
// @include		http://kingfeatures.com/*
// @include		http://www.thezombiehunters.com/*
// @include		http://thezombiehunters.com/*
// @include		http://www.bugcomic.com/*
// @include		http://www.interrobangstudios.com/*
// @include		http://interrobangstudios.com/*
// @include		http://syacartoonist.com/*
// @include		http://satwcomic.com/*
// @include		http://stupidfox.net/*
// @include		http://www.casualvillain.com/*
// @include		http://fanboys-online.com/*
// @include		http://www.girlswithslingshots.com/*
// @include		http://www.mntgaiden.com/*
// @include		http://ravensdojo.com/*
// @include		http://freefall.purrsia.com/*
// @include		http://www.shd-wk.com/*
// @include		http://shd-wk.com/*
// @include		http://www.pepsaga.com/*
// @include		http://slimythief.com/*
// @include		http://www.pebbleversion.com/*
// @include		http://pebbleversion.com/*
// @include		http://www.accurseddragon.com/*
// @include		http://www.stringtheorycomic.com/*
// @include		http://www.supercrash.net/*
// @include		http://loveandcapes.com/*
// @include		http://victorycomic.comicgenesis.com/*
// @include		http://magellanverse.com/*
// @include		http://www.evil-comic.com/*
// @include		http://flakypastry.runningwithpencils.com/*
// @include		http://www.pointguardian.com/*
// @include		http://gogetaroomie.chloe-art.com/*
// @include		http://www.amazingagentjennifer.com/*
// @include		http://mindmistress.comicgenesis.com/*
// @include		http://www.evernightcomic.com/*
// @include		http://*.thewebcomic.com/*
// @include		http://www.comicstriplibrary.org/display/*
// @include		http://comicstriplibrary.org/display/*
// @include		http://www.ourmanga.com/*
// @include		http://read.egscans.com/*
// @include		http://*.tiraecol.net/*
// @include		http://tiraecol.net/*
// @include		http://www.conejofrustrado.com/*
// @include		http://www.e2w-illustration.com/*
// @include		http://comic.naver.com/*
// @include		http://www.peteristhewolf.com/*
// @include		http://peteristhewolf.com/*
// @include		http://www.wlpcomics.com/*
// @include		http://wlpcomics.com/*
// @include		http://trenchescomic.com/*
// @include		http://www.goominet.com/unspeakable-vault/*
// @include		http://www.doesnotplaywellwithothers.com/*
// @include		http://www.aikoniacomic.com/*
// @include		http://aikoniacomic.com/*
// @include		http*://grrlpowercomic.com/*
// @include		http://www.poisonedminds.com/*
// @include		http://poisonedminds.com/*
// @include		http://nodwick.humor.gamespy.com/*
// @include		http://www.the-whiteboard.com/*
// @include		http://the-whiteboard.com/*
// @include		http://www.mezzacotta.net/*
// @include		http://www.hbrowse.com/*
// @include		http://www.bardsworth.com/*
// @include		http://fancyadventures.com/*
// @include		http://www.purplepussy.net/*
// @include		http://purplepussy.net/*
// @include		http://www.darklegacycomics.com/*
// @include		http://darklegacycomics.com/*
// @include		http://candicomics.com/*
// @include		http://www.buckocomic.com/*
// @include		http://bearmageddon.com/*
// @include		http://betweenfailures.net/*
// @include		http://www.sisterclaire.com/*
// @include		http://www.awesomehospital.com/*
// @include		http://ars.userfriendly.org/cartoons/*
// @include		http://www.friendswithboys.com/*
// @include		http://www.jesusandmo.net/*
// @include		http://www.calamitiesofnature.com/*
// @include		http://www.rosalarian.com/*
// @include		http://rosalarian.com/*
// @include		http://www.irregularwebcomic.net/*
// @include		http://adistantsoil.com/*
// @include		http://comic.nodwick.com/*
// @include		http://ffn.nodwick.com/*
// @include		http://ps238.nodwick.com/*
// @include		http://thedevilspanties.com/*
// @include		http://www.animephile.com/*
// @match		  *://kissmanga.com/*
// @include		http://invisiblebread.com/*
// @include		http://www.vickifox.com/*
// @include		http://www.spinnyverse.com/*
// @include		http://zenpencils.com/*
// @include		http://webcomics.yaoi911.com/*
// @include		http://www.whompcomic.com/*
// @include		http://curtailedcomic.com/*
// @include		http://bradcolbow.com/*
// @include		http://www.theherobiz.com/*
// @include		http://guildedage.net/*
// @include		http://betweenfailures.com/*
// @include		http://www.claudeandmonet.com/*
// @include		http://de.ninemanga.com/*
// @include		http://www.bloomingfaeries.com/*
// @include		http://www.findchaos.com/*
// @include		http://chaoslife.findchaos.com/*
// @include		http://www.shadbase.com/*
// @include		http://www.shagbase.com/*
// @include		http://www.mrlovenstein.com/*
// @include		http://www.anticscomic.com/*
// @include		http://octopuns.blogspot.com/*
// @include		http://www.powernapcomic.com/*
// @include		http://blackbird.ashen-ray.com/*
// @include		http://carciphona.com/*
// @include		http://ahs-comic.com/*
// @include		http://www.gogetaroomie.com/*
// @include		http://gogetaroomie.com/*
// @include		http://*.thecomicseries.com/*
// @include		http://www.sleepymaid.com/gallery/displayimage.php*
// @include		http://sleepymaid.com/gallery/displayimage.php*
// @include		http://www.squid-ops.com/*
// @include		http://squid-ops.com/*
// @include		http://www.endcomic.com/*
// @include		http://www.thenoobcomic.com/*
// @include		http://thenoobcomic.com/*
// @include		http://zizki.com/*
// @include		http://*.zizki.com/*
// @include		http://www.schizmatic.com/*
// @include		http://schizmatic.com/*
// @include		http://www.bringbackroomies.com/*
// @match		  *://*.blindsprings.com/*
// @match		  *://*.forgottenordercomic.com/*
// @include		http://www.wtfcomics.com/*archive.html?*
// @include		http://wtfcomics.com/*archive.html?*
// @include		http://www.olympusoverdrive.com/index.php?*
// @include		http://olympusoverdrive.com/index.php?*
// @include		http://*gucomics.com/*
// @include		http://www.punksandnerds.com/*
// @include		http://*.troutcave.net/*
// @include		http://www.berserkersdaughter.com/*
// @include		http://gingerhaze.com/nimona/comic/*
// @include		http://aspect.waywardstudios.net/*
// @include		http://chirault.sevensmith.net/*
// @include		http://cucumber.gigidigi.com/*
// @include		http://www.dorktower.com/*
// @include		http://nhentai.net/*
// @include		http://www.hejibits.com/*
// @include		http://paintraincomic.com/*
// @include		http://extrafabulouscomics.com/*
// @include		http://www.feywinds.com/comic/*
// @include		http://www.omgbeaupeep.com/*
// @include		http://orgymania.net/*
// @include		http://mspaintadventures.com/*
// @include		http://www.mspaintadventures.com/*
// @include		http://mspfanventures.com/
// @include		http://www.mangatown.com/manga/*
// @include		http://www.legostargalactica.net/*
// @include		http://*.keenspot.com/*
// @include		http://dynasty-scans.com/*
// @include		http://*.dynasty-scans.com/*
// @include		https://nhentai.net/g/*
// @include		http://www.marycagle.com/*
// @include		http://www.sleeplessdomain.com/*
// @include		http://www.webtoons.com/*
// @include		http://incase.buttsmithy.com/comic/*
// @include		http://leylinescomic.com/comics/*
// @include		http://project-apollo.net/mos/*
// @include		http://afterstrife.com/?p*
// @include		https://danbooru.donmai.us/*
// @match		  *://www.mngdoom.com/*/*
// @match		  *://kimchicuddles.com/post/*
// @match		  *://marktrail.com/*
// @include		http*://www.atomic-robo.com/*
// @include		http*://www.furaffinity.net/view/*
// @include		http*://www.furaffinity.net/full/*
// @include		http*://www.dhscomix.com/comics*
// @include		http*://www.dhscomix.com/bcomics*
// @include		http*://www.dhscomix.com/dcomics*
// @include		http*://www.dhscomix.com/decomics*
// @include		http*://www.dhscomix.com/dfcomics*
// @include		http*://www.dhscomix.com/dhscomics*
// @include		http*://www.dhscomix.com/fcomics*
// @include		http*://www.dhscomix.com/jcomics*
// @include		http*://www.dhscomix.com/kcomics*
// @include		http*://www.dhscomix.com/lcomics*
// @include		http*://www.dhscomix.com/mercomics*
// @include		http*://www.dhscomix.com/ocomics*
// @include		http*://www.dhscomix.com/pcomics*
// @include		http*://www.dhscomix.com/scomics*
// @include		http*://www.dhscomix.com/tcomics*
// @include		http*://www.dhscomix.com/wcomics*

// @downloadURL https://update.greasyfork.org/scripts/15096/Webcomic%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/15096/Webcomic%20Reader.meta.js
// ==/UserScript==

// End of includes

var dataCache = null; // cache to not read from the disk and parse the configuration on each getData
var firstRun = false;

// in case GM_ * works but it fails to ask without the "this.", or if they throw an exception when asking
try{ GM_getValue = GM_getValue || this.GM_getValue; }catch(e){ GM_getValue = false; }
try{ GM_setValue = GM_setValue || this.GM_setValue; }catch(e){ GM_setValue = false; }
try{ GM_deleteValue = GM_deleteValue || this.GM_deleteValue; }catch(e){ GM_deleteValue = false; }
try{ GM_xmlhttpRequest = GM_xmlhttpRequest || this.GM_xmlhttpRequest; }catch(e){ GM_xmlhttpRequest = false; }
try{ GM_registerMenuCommand = GM_registerMenuCommand || this.GM_registerMenuCommand; }catch(e){ GM_registerMenuCommand = false; }
try{ GM_openInTab = GM_openInTab || this.GM_openInTab; }catch(e){ GM_openInTab = false; }

try{
	// fix to use persistent data without pseudogreasemonkey
	if (!GM_getValue || GM_getValue.toString().indexOf("not supported")>-1) {
		GM_getValue=function (key,def) {
			if(!localStorage || !localStorage.hasOwnProperty(key)) return def;
			var val = localStorage[key];
			return val !== undefined ? val : def;
		};
		GM_setValue=function (key,value) {
			if(!localStorage) return null;
			return localStorage[key]=value;
		};
		GM_deleteValue=function (key) {
			if(localStorage) localStorage.removeItem(key);
		};
	}
	else{
		var gmsets = GM_getValue('wcr.settings', null);
		if(gmsets) dataCache = JSON.parse(gmsets);
		else{
			firstRun = true;
			GM_setValue('wcr.settings', '{}');
			dataCache = {};
		}
	}
	if(!GM_openInTab) GM_openInTab = window.open;
	if(!GM_registerMenuCommand || GM_registerMenuCommand.toString().indexOf("not supported")>-1){
		GM_registerMenuCommand = function(txt, fun){
			var boton = document.createElement('button');
			boton.innerHTML = txt;
			setEvt(boton, 'click', fun);
			document.body.appendChild(boton);
		};
	}
}catch(e){}

var prefetchSize = confPrefetchSize([defaultSettings.prefetchBack, defaultSettings.prefetchNext]); //number of prefetched pages ahead in each direction
var prefetchSizeStart = confPrefetchSizeStart([defaultSettings.prefetchBackStart, defaultSettings.prefetchNextStart]); //number of prefetched pages in each direction the first time
var prefetchNoNext = confBool('prefetchNoNext', true);

var keepLayout = confKeepLayout(defaultSettings.fullLayout); //decide to keep the original layout of the page (true) or use a clean minimalistic layout (false)
var debug = confDebug(defaultSettings.debugMode); //alerts on errors, and shows some of the currently cache'd pages/images with the "," key
var showButtons = confShowButtons(defaultSettings.showButtons); //show or hide the buttons (back/next, bookmarks, settings, etc...)

var leftImageClick = confLeftImageClick(defaultSettings.clikLeftHalfGoesBack); //specifies if clicking the left half of the image will take you to the previous page

var goToBookmark = confBool('goToBookmark', defaultSettings.goToBookmark);
var useHistoryAPI = confBool('useHistoryAPI', true);
var moveWhileLoading = confBool('moveWhileLoading', defaultSettings.moveWhileLoading);

var maximgs = []; // keep only this number of images loaded behind and ahead of the current one so as not to eat memory
maximgs[1] = Math.max(23, prefetchSize[1]);
maximgs[-1] = Math.max(23, prefetchSize[0]);

var usarb64 = confBool('b64_images', false);

/* paginas[i] = {
		url:
			//'substring' or /regexp/ that matches the url
		img:
			//gets the <img> element containing the desired image (not just the src, but the whole <img>)
			//if not present, searches an img with a src containing some common strings like "/comics/" or "/strips/"
			//'string' means "the <img> element whose src starts with 'string'"
		back:
		next:
			//get the href of the back and next links
			//if not present, defaults to links containing "back"|"prev" / "next" in the <a> element's innerHTML
			//'string' means "the href of the <a> element that satisfies 'string' (as an XPath expression)
		extra:
			//optional array of additional content, as a 'literal string' or taken from the HTML with, ['XPath'], [['CSS']], [/regexp/, group number], or other possibilities as documented below
		bgcol:
		txtcol:
			//override the default colors of the page for readability or aesthetics
			//'#RRGGBB', '#RGB', 'rgb(r, g, b)'
		js:
			//executes a custom function after a page change, receiving the direction (1=forward, -1=back, 0 the first time) as a parameter
		scrollx:
		scrolly:
			//tells the top-left coordinates for scrolling after changing page (default = U/L)
			//'U', 'D', 'L', 'R' and 'M' are to show the top, bottom, left, right and middle of the image
			//or it can be a number (in pixels) or a function that returns a number
		layout:
			//forces the default behaviour for the layout (true=keep the original, false=clean it)
		xelem:
			//string with an XPath expression to get the element to be used as placeholder for the extra content
			//used only when keeping the original layout
	}

	img/back/next/extra[i] can be either:
		'string',
		['XPath expression that returns the first element found'],
		['XPath expression that returns an array of elements', 'string to put between each element', ?first_index, ?last_index],
		[['CSS selector that returns the first element found']],
		[/regular expression/, group number to get the desired content]
		function(html_of_requested_page, position_relative_to_the_starting_page){ return content; }
	a 'string' is interpreted as part of a default XPath expression for img/back/next, or a literal string for extra[i]
*/

var paginas = [

	{	url:	'penny-arcade.com',
		img:	[['#comicFrame img']],
		fixurl:	function(url, img, link, pos){return url.replace("http:","");},
		extra:	[[['.title h2']]],
		style:	'#bb,#header{position:relative;}'
	},
	{	url:	'xkcd.',
		img:	['//div[@id="comic"]//img'],
		first:	'.="|<"',
		last:	'.=">|"',
		extra:	['<br/>', ['//div[@id="ctitle"]'], function(html, pos) {
					var href = xpath('//div[@id="comic"]//a/@href', html);
					return '<br/><a href=' + href + '>' +
						(href.indexOf('xkcd') >= 0 ? 'Large version' : 'Bonus Link!') +
						'</a>';
				}, function(html, pos) {
					var comic = xpath('//div[@id="comic"]', html);
					var img = comic.getElementsByTagName('img')[0];
					img.parentNode.removeChild(img);
					return comic;
				}, function(html, pos){
					var nr = link[pos].match(/(\d+)\/$/)[1];
					var url = 'http://www.explainxkcd.com/wiki/index.php/' + nr;
					return '<a target=\"_blank\" href=\"' + url + '\">Explain Xkcd</a>';
				}],
		bgcol:	'#fff'
	},
	{	url:	'*.dilbert.com',
		img:	[['.img-comic']],
		back:	'@alt="Older Strip"',
		next:	'@alt="Newer Strip"'
	},
	{	url:	'explosm.net/comics',
		img:	[['#main-comic']],
		extra:	[['//small[@class="author-credit-name"]/../../..'], [/<img id="main-comic" .+?\/([^"\/]+)\.\w+"/i, 1], function(html, pos){
					var url = selCss('#main-comic', html).parentNode.getAttribute('href');
					if(!url) return '';
					var htmlVideo = syncRequest(url, pos);
					return selCss('.flex-video', htmlVideo);
				}],
		style:	'#wcr_imagen{max-width:none;}'
	},
	{	url:	'pvponline.com',
		img:	[['.comic-art img']],
		extra:	[[['.comic header']]],
		style:	'.nav-locked .main-nav{display: none;}'
	},
	{	url:	'brawlinthefamily.keenspot.com',
		extra:	[['//div[@class="post-comic"]']],
		xelem:	'//div[@class="post-comic"]'
	},
	{	url:	'vgcats.com',
		img:	'images/'
	},
	{	url:	'phdcomics.com/comics',
		img:	'http://www.phdcomics.com/comics/archive/',
		extra:	[['//title/text()'], ' - ', ['//td/font/i/b/text()'], ['//img[contains(@src, "/comics/archive/")]/following-sibling::table']]
	},
	{	url:	'smbc-comics.com',
		img:	[['#cc-comicbody img']],
		back:	'@rel="prev"',
		next:	'@rel="next"',
		first:	'@rel="first"',
		last:	'@rel="last"',
		extra:	[['//div[@id="aftercomic"]/img[contains(@src,"/")]'], [['.cc-newscontent:first-of-type']]],
		style:	'#wcr_extra .date, #wcr_extra .blogtext{text-align: center;}'
	},
	{	url:	'abstrusegoose.com',
		img:	'http://abstrusegoose.com/strips/',
		extra:	['<br/>[', ['//h3/*/text()'], ']<br/><br/>', [/"storycontent"[\s\S]+?<img [\s\S]+?>([\s\S]+?)<\/div>/i, 1]]
	},
	{	url:	'thedoghousediaries.com',
		img:	[['#imgdiv img']],
		back:	[['#previouslink']],
		next:	[['#nextlink']],
		extra:	[[['#title-signoff-share']]]
	},
	{	url:	/erfworld\.com\/(page\/|$)/,
		img:	['//div[@class="entry"]//img'],
		back:	'contains(.,"Older")',
		next:	'contains(.,"Newer")',
		extra:	[['//div[@class="post"]/*', '', 0, 2], ['//div[@class="post"][1]//div[@class="entry"]/p[not(.//img)]', ''], '</div>']
	},
	{	url:	'erfworld.com',
		extra:	[[['.post>h2']], ['//table[@class="PxgGalleryTable"]//p[not(img)]', '']]
	},
	{	url:	'es.juanelo.net/archivo',
		img:	'http://es.juanelo.net/tiras/',
		back:	'.="« Anterior"',
		next:	'.="Siguiente »"',
		style:	'#page{width:1210px;} .narrowcolumn{width:810px;}'
	},
	{	url:	'es.juanelo.net/show',
		img:	['//div[@id="tirashow"]//img[starts-with(@src, "http://es.juanelo.net/tiras/")]'],
		back:	['//div[@id="tirashow"]//a[.="« Anterior"]/@href'],
		next:	['//div[@id="tirashow"]//a[.="Siguiente »"]/@href'],
		style:	'#page{width:1210px;} .narrowcolumn{width:810px;}'
	},
	{	url:	'es.juanelo.net/20',
		img:	'http://es.juanelo.net/tiras/',
		back:	'contains(.,"«")',
		next:	'contains(.,"»")',
		extra:	[[['img[src*="/tiras/"]', '<br/>', 1]], [['.post>h2']], [['.entry>p']]],
		style:	'#page{width:1210px;} .narrowcolumn{width:810px;}',
		bgcol:	'#334255'
	},
	{	url:	'readms.net',
		img:	[['#manga-page']],
		back:	[['.previous a']],
		next:	[['.next a']],
		style:	'.subnav[style*="fixed"]{display: none;}#wcr_imagen{max-width:none;}#reader-sky{z-index:-1;}',
		scrollx:'R',
		layout:	true
	},
	{	url:	'terrorisland.net',
		extra:	[['//div[@class="commentary"]', '']]
	},
	{	url:	'drmcninja.com',
		img:	'http://drmcninja.com/comics/',
		extra:	['<br/>', ['//select[@id="series_select"]'], ['//select[@id="page_select"]'], [['.post-comic .entry']]],
		js:		function(dir){
					var selSer = xpath('//div[@id="wcr_div"]//*[@id="series_select"]');
					setEvt(selSer, 'change', function(){
						exec("document.location.href = '/archives/comic/'+series_arr["+selSer.selectedIndex+"].posts[0];");
					});
					selSer.style.visibility = 'visible';
					selSer.disabled = false;

					var selPag = xpath('//div[@id="wcr_div"]//*[@id="page_select"]');
					setEvt(selPag, 'change', function(){
						document.location.href = '/archives/comic/'+selPag.value;
					});
				}
	},
	{	url:	'gpf-comics.com',
		img:	'/comics/',
		back:	'./img[@alt="Previous Comic"]',
		next:	'./img[@alt="Next Comic"]'
	},
	{	url:	'daisyowl.com',
		img:	['//div[@align="center"]//img[starts-with(@src,"/comic_images/")]']
	},
	{	url:	'hyperdeathbabies.com',
		img:	'anomaly/'
	},
	{	url:	'amultiverse.com',
		img:	[['#comic img']],
		extra:	[['//div[@class="post-content"]']],
		js:		function(){ if(keepLayout) get('comic').style.height = get('wcr_div').offsetHeight + 'px'; },
		xelem:	'//div[@id="content"]//div[@class="post-content"]',
		style:	'#comic button{float:none;}'
	},
	{	url:	'wondermark.com',
		img:	'http://wondermark.com/c/',
		back:	'@rel="prev"',
		next:	'@rel="next"',
		txtcol:	'#fff'
	},
	{	url:	'amazingsuperpowers.com',
		img:	function(html, pos){
					try{ return selCss('#comic-1 img', html); }
					catch(e){
						if(selCss('#comic-1 #comic-short', html)) return selCss('img', html);
					}
				},
		extra:	[[['#comic-1 #comic-short']],
				function(html, pos){
					var href = selCss('#question a', html).href;
					var htmlHidden = syncRequest(href, pos);
					return contenido(htmlHidden, [['#comic > *', '']]);
				}, [['.post']]],
		style:	'#page,#header{width:auto;}',
		layelem:'//div[@id="comic-1"]'
	},
	{
		url:	'm.fanfox.net',
		img:	['//img[@id="image"]'],
		back:	['//select/option[@selected]/preceding-sibling::*[1]'],
		next:	['//div[@id="viewer"]/a'],
		scrollx:'R'

	},
	{	url:	'fanfox.net',
		img:	['//img[@id="image"]'],
		back:	function(html, pos){
					var href = contenido(html, ['//a[contains(@class, "prev_page")]/@href'], pos);
					if(href.indexOf('javascript')<0){
						if(href.indexOf('/')<0) return link[pos].replace(/[^\/]*$/, href);
						return href;
					}
					return contenido(html, ['//span[contains(., "Previous Chapter")]/../a/@href'], pos).replace(/\d+\.html/, '999.html');
				},
		next:	function(html, pos){
					var current_page = parseInt(html.match(/var current_page=(\d+);/)[1]);
					var final_page_of_chapter = parseInt(html.match(/var total_pages=(\d+);/)[1]);
					if(current_page < final_page_of_chapter){
						//just load next page
						var href = contenido(html, ['//a[contains(@class, "next_page")]/@href'], pos);
						if(href.indexOf('/')<0) return link[pos].replace(/[^\/]*$/, href);
						return href;
					}
					return contenido(html, ['//span[contains(., "Next Chapter")]/../a/@href'], pos);
				},
		extra:	[function(html, pos){
					if(extra[0]) return extra[0].replace(/(<\/select>)[\s\S]*/i, '$1');
					return contenido(html, ['//select[@id="bottom_chapter_list"]'], pos);
				}, ' ', [['select.m']], '<select id="top_chapter_list" style="display:none"></select>',
				function(html, pos){
					var alt = xpath('//img[@id="image"]/@onerror', html).replace(/^.+?'|'$/g, '');
					return '<a id="alt_img" style="display:none" href="'+alt+'"/>';
				}],
		js:		function(dir){
					if(!dir){
						exec('(function unbindear(){'+
							'try{ $(function(){$(document).unbind();}); }'+
							'catch(e){ setTimeout(unbindear, 200); }'+
						'})();');
						(function rellenar(){
							if(get('bottom_chapter_list').innerHTML.trim()){
								extra[0] = get('wcr_extra').innerHTML;
								var opts = selCss('#wcr_extra #bottom_chapter_list').options;
								var div = document.createElement('div');
								for(var i=-1; extra[i]; i--);
								for(i++; extra[i]; i++){
									if(!i) continue;
									div.innerHTML = extra[i];
									var sel = selCss('#bottom_chapter_list', div);
									for(var j=0; j<opts.length; j++) sel.options[j] = opts[j].cloneNode(true);
									extra[i] = div.innerHTML;
								}
								try{
									var sel = selCss('#bottom_bar #bottom_chapter_list');
									for(var j=0; j<opts.length; j++) sel.options[j] = opts[j].cloneNode(true);
								}catch(e){}
							}
							else setTimeout(rellenar, 200);
						})();
					}
					var selcaps = selCss('#wcr_extra #bottom_chapter_list');
					var caps = selcaps.options;
					selcaps.style.cssFloat = '';
					for(var i=0; i<caps.length; i++)
						if(link[posActual].indexOf(caps[i].value+'/') >= 0)
							return selcaps.selectedIndex = i;
					return 0;
				},
		onerr:	function(url, img, num, pos){
					if(num) return null;
					return xpath('//a[@id="alt_img"]/@href', extra[pos]);
				},
		scrollx:'R'
	},
	{	url:	'sinfest.net',
		back:	'img[@alt="Previous"]',
		next:	'img[@alt="Next"]',
		fixurl:	function(url, img, link){
					return url.replace('http://sinfest', 'http://www.sinfest');
				}
	},
	{	url:	'crfh.net',
		img:	['//img[contains(@src, "/crfh")]']
	},
	{	url:	'nuklearpower.com',
		img:	['//img[contains(@src, "/comics/")]'],
		back:	'@rel="prev"',
		next:	'@rel="next"'
	},
	{	url:	'questionablecontent.net/',
		extra:	[['//div[@id="news"]']],
		xelem:	'//div[@id="news"]'
	},
	{	url:	/nettserier.no\/./,
		img:	'/_striper/',
		back:	'starts-with(., "F") and contains(., "rre ")',
		next:	'starts-with(., "Neste ")'
	},
	{	url:	'qwantz.com',
		back:	[['[rel="prev"]']],
		next:	[['[rel="next"]']],
		extra:	['<br/>', [/<span class="rss-title">(.*?)<\/span>/, 1], '<br/><br/>',
					function(html, pos){
						return unescape(contenido(html, [/mailto:.+?subject=(.*?)\""?/, 1]));
					}] //original: http://userscripts.org/scripts/show/51520
	},
	{	url:	'notinventedhe.re',
		img:	'h',
		style:	'button{display:inline;color:#000;float:none;} #comic-nav{margin:0;}'
	},
	{	url:	'unshelved.com',
		style:	'button{display:inline;color:#000;float:none;}'
	},
	{	url:	'eviscerati.org',
		img:	[['.field-name-field-comic-image img']],
		back:	[['.previous a']],
		next:	[['.next a']]
	},
	{	url:	'buttersafe.com',
		extra:	[['//div[@class="post-comic"]']]
	},
	{	url:	'romanticallyapocalyptic.com',
		img:	[['.comicmid img']],
		back:	'span[@class="spritePrevious"]',
		next:	'span[@class="spriteNext"]',
		first:	'span[@class="spriteStart"]'
	},
	{	url:	'somethingpositive.net',
		img:	'arch/|/arch/|sp',
		txtcol:	'#888'
	},
	{	url:	'rhymes-with-witch.com',
		img:	'images/rww|images/lwr|images/rippy'
	},
	{	url:	'superstupor.com',
		img:	'sust|http://www.superstupor.com/sust',
		back:	'img[@src="last.gif"]',
		txtcol:	'#888'
	},
	{	url:	'misfile.com',
		img:	'comics/'
	},
	{	url:	'sluggy.com',
		img:	'/images/comics/',
		back:	'.="Prev."',
		next:	'.="Next"',
		extra:	[['//img[starts-with(@src, "/images/comics/")]', '', 1], ['//div[@class="comic_popup"]']]
	},
	{	url:	'asofterworld.com',
		img:	'clean/',
		bgcol:	'#fff'
	},
	{	url:	'achewood.com',
		img:	'/comic.php?date='
	},
	{	url:	'biggercheese.com',
		img:	'comics/'
	},
	{	url:	'gwscomic.com',
		img:	'images/gws/',
		back:	'img[@src="images/gwsmenu/back_off.jpg"]'
	},
	{	url:	'fonflatter.de',
		img:	['//p/a/img[@title]'],
		next:	'..[@id="next"]',
		back:	'..[@id="prev"]'
	},
	{	url:	'ruthe.de',
		img:	['//div[@id="cartoon"]//img'],
		back:	'@id="b_back"',
		next:	'@id="b_next"'
	},
	{	url:	'daybydaycartoon.com',
		img:	['//div/p/img']
	},
	{	url:	'dieselsweeties.com',
		img:	'/hstrips/'
	},
	{	url:	'foxtrot.com',
		bgcol:	'#fff'
	},
	{	url:	'csectioncomics.com',
		img:	['//div[@class="post-body entry-content"]/p//img']
	},
	{	url:	'garfieldminusgarfield.net/post',
		img:	['//div[@class="photo"]//img']
	},
	{	url:	'gocomics.com',
		img:	function(html, pos){
					try{ return selCss('div > .strip', html); }
					catch(e){ return selCss('.strip', html); }
				},
		back:	['//ul[@class="feature-nav"]//a[@class="prev"]/@href'],
		next:	['//ul[@class="feature-nav"]//a[@class="next"]/@href'],
		last:	[['.newest']],
		style:	'.feature_item, .feature, #content {width: auto !important;} .zoom_link{display:none !important;}',
		layelem:'//p[@class="feature_item"]//img',
		fixurl:	function(url, img, link){
					if (img && url.indexOf('width=') > 0) {
						url = url.replace(/width=[^&]*/, '');
					}
					return url;
				}
	},
	{	url:	'threepanelsoul.com',
		extra:	[['//nobr', '<br/>']],
		bgcol:	'#fff'
	},
	{	url:	'oglaf.com',
		img:	[['#strip']],
		back:	'div[@id="pv" or @id="pvs"]',
		next:	'div[@id="nx" or @id="ns"]',
		first:	'div[@id="st"]',
		last:	function(html){
					if (window.location.pathname !== "/") {
						return window.location.protocol + "//" + window.location.hostname;
					} else {
						return "";
					}
				},
		extra:	[function(html, pos){
					var ret = "";
					try {
						var alt = xpath('//img[@id="strip"]/@alt', html);
						if(alt !== "") ret += alt + "<br>";
					} catch (e) {}
					try {
						var imgTitle = xpath('//div[@id="tt"]/img/@title', html);
						if(imgTitle !== "None" && imgTitle !== "") ret += imgTitle + "<br>";
					} catch (e) {}
					try {
						var img = xpath('//div[@id="tt"]/img', html);
						return ret + img.outerHTML;
					} catch (e) {return ret;}
					}],
		style:	'b>div{float:left;}\n.content{height:1%;}\n.content:after{clear:both;}\n.content:before,.content:after{content:" ";display:table;}',
		bgcol:	'#ccc',
	},
	{	url:	'kevinandkell.com',
		back:	'..[@id="prevstrip"]',
		next:	'..[@id="nextstrip"]',
		extra:	[['//div[@id="caption"]/span']]
	},
	{	url:	'mycardboardlife.com',
		img:	'http://mycardboardlife.com/comics/',
		extra:	[['//div[@class="entry"]']]
	},
	{	url:	'megatokyo.',
		back:	[['.prev a']],
		next:	[['.next a']],
		style:	'#wcr_div{margin-bottom:50px;}#wcr_div *{float:none; text-align:center;}'
	},
	{	url:	'noreasoncomics.com',
		img:	['//div[@id="comic"]/img'],
		extra:	[['//div[@id="column"]']],
		xelem:	'//div[@id="column"]'
	},
	{	url:	'pixelcomic.net',
		img:	['//font/img'],
		extra:	[['//font/font', '']]
	},
	{	url:	'redmeat.com',
		img:	['//div[@id="weeklyStrip"]/img'],
		extra:	[['//div[@class="moreRedMeat"]', '', 1]]
	},
	{	url:	'sexylosers.com',
		back:	'.="<<" and font[@color="#ffaaaa"]',
		next:	'.=">>" and font[@color="#ffaaaa"]'
	},
	{	url:	'perveden.com',
		img:	['//img[@id="mainImg"]'],
		scrollx:'R'
	},
	{	url:	'pbfcomics.com',
		img:	'/archive',
		back:	'img[contains(@src,"Older")]',
		next:	'img[contains(@src,"Newer")]',
		extra:	[['//center/span/b[1]']]
	},
	{	url:	'tjandamal.com',
		img:	'http://tjandamal.com/comic/img/comic/',
		back:	'.="<"',
		next:	'.=">"'
	},
	{	url:	'sfeertheory.littlefoolery.com',
		img:	'art/'
	},
	{	url:	'wanderingones.com',
		img:	['//img[@alt="comic strip"]'],
		extra:	[['//img[@alt="comic strip"]', '<br/>', 1]]
	},
	{	url:	'big-big-truck.com/ayiw/*.html',
		img:	['//img'],
		extra:	[['//tr[2]//strong'], ['//td/p', '']]
	},
	{	url:	'wastedtalent.ca',
		img:	'http://www.wastedtalent.ca/sites/default/files/imagecache/comic_full/comics/'
	},
	{	url:	'wulffmorgenthaler.com',
		img:	'striphandler.ashx?stripid='
	},
	{	url:	'weregeek.com',
		img:	['//div[@id="comic"]/img']
	},
	{	url:	'*.katbox.net',
		img:	[['.webcomic-image img']],
		style:	'#wcr_imagen{height:auto !important;width:auto !important;}'
	},
	{	url:	'theoswaldchronicles.com',
		img:	'http://www.theoswaldchronicles.com/wp-content/webcomic/',
		back:	'@rel="previous"',
		next:	'@rel="next"'
	},
	{	url:	'awkwardzombie.com',
		img:	[['#cc-comic']],
		back:	[['.cc-prev']],
		next:	[['.cc-next']],
		first:	[['.cc-first']],
		last:	[['.cc-last']],
		extra:	['<div style="background: white; margin-top: 0.5em; padding-left: 0.3em; padding-right: 0.3em;">',[['.cc-newsarea']],'</div>'],
		// FIXME The name of the comic’s game/category is missing from the news section within `extra`.
		// That game name can always be seen within the normal news section in the bottom left. So the workaround is refreshing the page to load the current comic’s news section.
		// JavaScript that runs when the document is ready adds the game name to that bottom left news section.
		// That JavaScript is written inline within the HTML of the loaded page. The <script> tag is written in the same place in the HTML as the element it inserts: after `.cc-publishtime`.
		// Thus, a method for adding the game name when loading a new comic would be to extract just the element string literal from the JS within the loaded HTML, then use jQuery to insert that element in the right place inside the `.cc-newsarea`.
	},
	{	url:	'*.seraph-inn.com',
		img:	'pages/'
	},
	{	url:	'fakku.net',
		img:	function(html, pos){
					var thumbs = JSON.parse(match(html, /params\.thumbs\s*=\s*(.+);/, 1));
					var x = link[0].match(/page=(\d+)/);
					x = Number(x ? x[1] : 0)+pos;
					if(!x) return '.';
					if(x<0 || x>thumbs.length) throw new Error('fail');
					x = x.toString();
					while(x.length<3) x='0'+x;
					return html.match(/'([^']+\/images\/manga\/[^']+)'/)[1] + x + '.jpg';
				},
		back:	function(html, pos){
					var thumbs = JSON.parse(match(html, /params\.thumbs\s*=\s*(.+);/, 1));
					var x = link[0].match(/page=(\d+)/);
					x = Number(x ? x[1] : 0)+pos-1;
					if(x<0 || x>thumbs.length) throw new Error('fail');
					return link[0].replace(/#.+/, '')+'##page='+x;
				},
		next:	function(html, pos){
					var thumbs = JSON.parse(match(html, /params\.thumbs\s*=\s*(.+);/, 1));
					var x = link[0].match(/page=(\d+)/);
					x = Number(x ? x[1] : 0)+pos+1;
					if(x<0 || x>thumbs.length) throw new Error('fail');
					return link[0].replace(/#.+/, '')+'##page='+x;
				},
		js:		function(dir){
					if(!dir){
						exec(
							"$(function(){"+ //cambio los links de los thumbs
								"$('[href^=\"#page\"]').each(function(){"+
									"$(this).attr('href', document.location.href.replace(/#.+/, '')+'&'+$(this).attr('href'));"+
								"});"+ //arreglo el select
								"$('.drop').change(function(){"+
									"window.location.href = document.location.href.replace(/#.+/, '')+"+
										"($(this).val() != '0' ? '&#page=' + $(this).val() : '');"+
								"});"+ //saco el interval q molesta con el update_page
								"for(var i=setInterval(' ', 23232323); i; i--) clearInterval(i);"+
							"});"
						);
					}
					var x = link[0].match(/page=(\d+)/);
					x = Number(x ? x[1] : 0)+posActual;
					get('thumbs').style.display = x ? 'none' : '';
				},
		style:	'header{position:absolute;}',
		scrollx:'R',
		layelem:'//div[@id="image"]'
	},
	{	url:	'earthsongsaga.com',
		img:	'../images/vol',
		back:	function(html, pos){
					try{ return selCss('#previous a', html); }
					catch(e){ return xpath('//table[2]//td[2]//a/@href', html); }
				},
		next:	function(html, pos){
					try{ return selCss('#next a', html); }
					catch(e){ return xpath('//table[2]//td[3]//a/@href', html); }
				},
		extra:	[function(html, pos){
					return '<img src="'+xpath('//a[starts-with(@href, "../images/vol")]/@href', html)+'"/>';
				}],
		style:	'#wcr_div{background:#d1be8b;}'
	},
	{	url:	'goblinscomic.com',
		style:	'#comic{overflow:visible;}' //ugly but works...
	},
	{	url:	'precociouscomic.com',
		back:	'.="Previous"',
		next:	'.="Next"'
	},
	{	url:	'*.spiderforest.com',
		img:	['//img[contains(@src, "comics/")]']
	},
	{	url:	'sevensmith.net/chirault',
		img:	'images/'
	},
	{	url:	'junglestudio.com/roza',
		img:	'pages/',
		back:	'img[contains(@src, "navtable_09.gif")]',
		next:	'img[contains(@src, "navtable_11.gif")]'
	},
	{	url:	'dream-scar.net',
		img:	'files/'
	},
	{	url:	'tryinghuman.com',
		back:	'img[@alt="Previous comic"]',
		next:	'img[@alt="Next comic"]'
	},
	{	url:	'thedreamercomic.com',
		img:	'issues/'
	},
	{	url:	'sandraandwoo.com/gaia/',
		img:	['//div[@id="comic"]/a/img'],
		extra:	[['//div[@class="post-comic"]/*','',3],[['#comment-main-none']],[['#comment-main-1']]],
		style:	'#wcr_extra{text-align:left;}\n#wcr_title{display:none;}\n#column>.post-comic>br~*{display:none;}\n#column>#comment-main-none{display:none;}'
	},
	{	url:	'sandraandwoo.com',
		img:	['//div[@id="comic"]/a/img'],
		extra:	[[['#column']]],
		xelem:	'//div[@id="column"]'
	},
	{	url:	'freakangels.com',
		img:	'http://www.freakangels.com/comics/',
		back:	function(html, pos){
					var page = link[pos].match(/page=(\d+)/);
					if(page) page = page[1];
					if(!page || page==1) return xpath('//li[@class="left"]/a/@href', html);
					return link[pos].replace(/page=\d+/, 'page='+(page-1));
				},
		next:	function(html, pos){
					var page = link[pos].match(/page=(\d+)/);
					page = page ? Number(page[1]) : 1;
					try{ return xpath('//a[contains(@href, "page='+(page+1)+'")]/@href', html); }
					catch(e){ return xpath('//li[@class="right"]/a/@href', html); }
				}
	},
	{
		url:	'mangaseeonline.us/read-online',
		img: 	[['img.CurImage']],
		layout:	true,
		back:	function(html, pos) {
					var cS = selCss('.ChapterSelect', html);
					var pS = selCss('.PageSelect', html);
					var indexName = selCss('input.IndexName', html).getAttribute('value');
					var chapter = cS.selectedIndex;
					var page = pS.selectedIndex;
					if (page < 1) {
						chapter--;
						var request = new XMLHttpRequest();
						request.open('POST', 'request.chapter.php', false);
						request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
						request.send('IndexName=' + indexName + '&ChapterValue=' + cS[chapter].value + '&MaxPage=yes');
						if (request.responseText) {
                        	var res = JSON.parse(request.responseText);
                        	page = res.CurPage - 1;
                        }
					}
					var newChapter = cS[chapter].innerHTML.split(' ');
					return document.location.href.replace(/(chapter-).+?(-.+?)\d+(.html)/, "$1" + newChapter[1] + "$2" + page + "$3");
				},
		next:	function(html, pos) {
					var cS = selCss('.ChapterSelect', html);
					var pS = selCss('.PageSelect', html);
					var chapter = cS.selectedIndex;
					var page = pS.selectedIndex + 1;
					if (page >= pS.length) { page = 0; chapter++; }
					var newChapter = cS[chapter].innerHTML.split(' ');
					return document.location.href.replace(/(chapter-).+?(-.+?)\d+(.html)/, "$1" + newChapter[1] + "$2" + (page + 1) + "$3");
				},
		js:		function(dir){
					document.querySelector('.navbar').className = "navbar navbar-default";
					var mWrapper = document.getElementsByClassName('mainWrapper');
					if (mWrapper && mWrapper.length > 0) mWrapper[0].style.marginTop = '0px';
				},
	},
	{	url:	'sakanacomic.com',
		img:	'/img/com/',
		style:	'#comic-outer{height:auto;}'
	},
	{	url:	'keychain.patternspider.net',
		next:	'img[@alt="forward"]',
		extra:	[['//div[@class="style3"]']]
	},
	{	url:	'collectedcurios.com/sequentialart.php',
		img:	['//img[@id="strip"]'],
		back:	'img[@title="Back one"]',
		next:	'img[@title="Forward one"]'
	},
	{	url:	'waywardsons.keenspot.com',
		img:	[['img[src*="/comics"]']],
		back:	'img[@id="p_bot_nav"]',
		next:	'img[@id="n_bot_nav"]'
	},
	{	url:	'lastblood.keenspot.com',
		img:	['//div[@id="comic"]/img'],
		back:	'(preceding-sibling::small | preceding-sibling::*/small)[.="Previous Comic:"]',
		next:	'(preceding-sibling::small | preceding-sibling::*/small)[.="Next Comic:"]',
		fixurl:	function(url, img, link){
					if(img) return url.replace(/http:\/\/.+?\//, 'http://'+document.location.host+'/');
					return url;
				}
	},
	{	url:	'marryme.keenspot.com',
		img:	['//div[@id="comicspot"]/img'],
		back:	[['*[rel="prev"]']],
		next:	[['*[rel="next"]']],
		fixurl:	function(url, img, link){
					if(img) return url.replace(/http:\/\/.+?\//, 'http://'+document.location.host+'/');
					return url;
				}
	},
	{	url:	'exposure.keenspot.com',
		img:	[['img[src*="/comics"]']],
		back:	'img[@id="exp46"]',
		next:	'img[@id="exp48"]'
	},
	{	url:	'yirmumah.keenspot.com',
		img:	[['img[src*="/comics"]']],
		back:	'.="Previous"',
		next:	'.="Next"'
	},
	{	url:	'twokinds.keenspot.com',
		img:	[['#cg_img img']],
		back:	'@id="cg_back"',
		next:	'@id="cg_next"'
	},
	{	url:	'roadwaffles.keenspot.com',
		img:	'comics/',
		back:	'.="previous"',
		next:	'.="next"'
	},
	{	url:	'plusev.keenspot.com',
		img:	[['img[src*="/comics"]']],
		back:	'img[@id="Previous_Day"]',
		next:	'img[@id="Next"]'
	},
	{	url:	'countyoursheep.keenspot.com',
		img:	[['img[src*="/comics"]']],
		extra:	[['//center/h2'],['//center/p/font']],
		style:	'center>h2{display:none;}\ncenter>p>font{display: none;}',
	},
	{	url:	'adis.keenspot.com',
		img:	[['img[src*="/comics"]']],
		extra:	[['//center/table/tbody/tr[2]/td/h2']],
		style:	'center>table>tbody>tr>td>h2{display:none;}',
	},
	{	url:	'*.keenspot.com',
		img:	[['img[src*="/comics"]']],
		back:	'(img/@alt | .)="Previous Comic" or @rel = "prev"',
		next:	'(img/@alt | .)="Next Comic" or @rel = "next"'
	},
	{	url:	'sylvanmigdal.com',
		img:	'/c/',
		back:	'img[starts-with(@alt,"Antecedent")]',
		next:	'img[starts-with(@alt,"Subsequent")]'
	},
	{	url:	'*.c.urvy.org',
		img:	'/c/',
		back:	'img[@alt="Previous page"]',
		next:	'img[@alt="Next page"]'
	},
	{	url:	'survivingtheworld.net',
		img:	'Lesson|Recitation|GuestLecture',
		back:	[['.previous a']],
		next:	[['.next a']],
		extra:	[[['.comiccontainer > p[align="justify"]', '']]]
	},
	{	url:	'nonadventures.com',
		extra:	[['//div[@class="post"]']]
	},
	{	url:	'beardfluff.com',
		img:	'http://beardfluff.com/wp-content/webcomic/'
	},
	{	url:	'lawlscomic.com',
		img:	'http://lawlscomic.com/comics/',
		back:	'@class="navi navi-prev"',
		next:	'@class="navi navi-next"'
	},
	{	url:	'maakies.com',
		img:	['//a[@rel="attachment"]/img'],
		back:	'..[@class="nav-previous"]',
		next:	'..[@class="nav-next"]'
	},
	{	url:	'lefthandedtoons.com',
		img:	'http://www.lefthandedtoons.com/toons/'
	},
	{	url:	'trollscience.com',
		img:	'/image/',
		extra:	[['//h2'], ['//div[@id="troll-rate"]'], ['//div[@id="troll-comments"]']]
	},
	{	url:	'giantitp.com',
		back:	'img[@alt="Previous Comic"]',
		next:	'img[@alt="Next Comic"]'
	},
	{	url:	'e-hentai.org|exhentai.org',
		img:	[['#i3 a img, iframe + a img, .sni > a img']],
		back:	function(html, pos){
					var num = Number(link[pos].match(/-(\d+)(\?.+)?$/)[1]);
					var as = xpath('//a[img]', html, true);
					for(var i=0; i<as.length; i++)
						if(as[i].href.match(new RegExp('-'+(num-1)+'(\\?|$)')))
							return as[i].href;
					throw new Error('fail');
				},
		next:	function(html, pos){
					var num = Number(link[pos].match(/-(\d+)(\?.+)?$/)[1]);
					var as = xpath('//a[img]', html, true);
					for(var i=0; i<as.length; i++)
						if(as[i].href.match(new RegExp('-'+(num+1)+'(\\?|$)')))
							return as[i].href;
					throw new Error('fail');
				},
		extra:	[['//div[span]'], '<span style="display:none">', ['//a[@onclick[contains(., "nl")]]'], '</span>'],
		scrollx:'R',
		onerr:	function(url, img, num, pos){
					if(num >= 4) return null;
					var nl = extra[pos].innerHTML.match(/nl\((\d+)\)/)[1];
					var u = url.split('?nl=');
					if(u[1] == nl) return null;
					return {url: u[1] + '?nl=' + nl };
				}
	},
	{	url:	'ekkifu.com',
		img:	'http://img',
		back:	[/value="previous page" onclick="javascript:window.location='(.+)';"/i, 1],
		next:	[/value="next page" onclick="javascript:window.location='(.+)';"/i, 1],
		extra:	[[['.chapter-navigation select', ' Page ']]],
		scrollx:'R'
	},
	{	url:	'bittersweetcandybowl.com',
		img:	[['#page_img']],
		back:	'@rel="prev"',
		next:	'@rel="next"',
		extra:	[[['#authorcommentary']], [['#comicselect']]],
		style:	'.pagenavlink{display:none;} #content #wcr_div *{text-align:center;}'
	},
	{	url:	'imagebam.com',
		img:	['//img[@alt="loading"]']
	},
	{	url:	'basicinstructions.net',
		img:	[['.full-image-block img']],
		back:	'@class="journal-entry-navigation-next"',
		next:	'@class="journal-entry-navigation-prev"'
	},
	{	url:	'missmab.com',
		img:	['//center/img | //p/img'],
		extra:	[['//i']]
	},
	{	url:	'darthsanddroids.net',
		extra:	[[['.center b']], [['.text']]],
		style:	'.text{text-align:left;}'
	},
	{	url:	'harkavagrant.com',
		img:	[['.rss-content img']],
		extra:	[[['.black11']]]
	},
	{
		url:	'dresdencodak.com',
		img:	[['section.entry-content>p>img']],
	},
	{	url:	'straysonline.com',
		img:	[['td[align="center"]>a>img']]
	},
	{	url:	'dragonball-multiverse.com',
		img:	[['#balloonsimg>img']],
		layout:	false
	},
	{	url:	'wayfarersmoon.com',
		img:	'/admin/uploads/wm',
		back:	'img[@alt="back button"]',
		next:	'img[@alt="forward button"]',
		first:	'img[@alt="begin button"]',
		last:	'img[@alt="end button"]'
	},
	{	url:	'*.smackjeeves.com',
		img:	[['#comic_image']]
	},
	{	url:	'10kcommotion.com',
		img:	function(html, pos){
					var num = Number(link[0].match(/\?(\d+)$/)[1])+pos;
					return match(html, new RegExp('image\\['+num+'\\]="(.+?)"'), 1);
				},
		back:	function(html, pos){
					var url = link[0].match(/^(.+\?)(\d+)$/);
					var num = Number(url[2])+pos-1;
					return num ? url[1]+num : null;
				},
		next:	function(html, pos){
					var url = link[0].match(/^(.+\?)(\d+)$/);
					var num = Number(url[2])+pos+1;
					return match(html, new RegExp('image\\['+num+'\\]="(.+?)"'), 1) ? url[1]+num : null;
				}
	},
	{	url:	'multiplexcomic.com',
		back:	'.="Previous"',
		next:	'.="Next"'
	},
	{	url:	'johnandjohn.nl',
		img:	'../write/',
		back:	'@id="pointleft"',
		next:	'@id="pointright"',
		extra:	[function(html, pos){
					var link = xpath('//a[img[@id="comicimg"]]/@href', html);
					return '<a href="'+link+'">'+link+'</a>';
				}],
		txtcol:	'orange',
		layout:	false
	},
	{	url:	'sorcery101.net',
		img:	[['.comic img']]
	},
	{	url:	'treadingground.com',
		extra:	[[['.entry']]]
	},
	{	url:	'kiwiblitz.com',
		img:	[['#cc-comic']],
		extra:	[[['.cc-newsarea']]],
		style:	'#cc-comicbody{position: relative !important;} #pixiestrip {visibility: hidden;}',
	},
	{	url:	'thepunchlineismachismo.com|zombieboycomics.com',
		img:	[['#comic img']],
		extra:	[[['.entry']]],
		style:	'#wcr_div button{float:none;}',
	},
	{	url:	'kafkaskoffee.com',
		img:	[['.webcomic-object img']],
		extra:	[[['.webcomic_post h1']], [['.content']]]
	},
	{	url:	'out-at-home.com',
		extra:	[[['.comic']]],
		txtcol:	'#fff'
	},
	{	url:	'occasionalcomics.com|bearandtiger.com',
		extra:	[[['.entry']]]
	},
	{	url:	'babyblues.com',
		img:	[['.comic img']]
	},
	{	url:	'mankin-trad.net',
		img:	'read/',
		js:		function(dir){
					if(!dir){
						var hn = get('hoverNav');
						hn.parentNode.removeChild(hn);
					}
				},
		extra:	[[['.pagination']]],
		scrollx:'R'
	},
	{	url:	'spaceavalanche.com',
		img:	[['.entry img']]
	},
	{	url:	'schlockmercenary.com',
		img:	[['#comic img']],
		back:	'.="Previous Comic"',
		next:	'.="Next Comic"',
		extra:	[[['#comic img', '', 1]], [['div.footnote']]],
		style:	'#wcr_extra{width:780px; margin:0 auto;}'
	},
	{	url:	'warehousecomic.com',
		extra:	[[['.newsBox p', '']]]
	},
	{	url:	'nerfnow.com',
		img:	[['#comic img']],
		extra:	[[['.comment']]]
	},
	{	url:	'zapcomic.com',
		img:	'http://www.zapcomic.com?comic_object='
	},
	{	url:	'shortpacked.com',
		img:	'http://www.shortpacked.com/comics/'
	},
	{	url:	'axecop.com',
		img:	[['#comic img']],
		back:	'.="Prev"',
		next:	'.="Next"',
		extra:	[[['.entry-content']]],
		txtcol:	'#fff'
	},
	{	url:	'reddit.com',
		img:	function(html, pos){
					var posts = selCss('#siteTable>.thing:not(.promoted)', html, true);
					var post = posts[((pos%25)+25)%25];
					var tit = selCss('a.title', post).href;
					if(tit.match(/\.(jpg|png|gif)(\?.+)?$/i)) return tit;
					else if(tit.match(/http:\/\/imgur\.com\/\w+$/i))
						return 'http://i.imgur.com/'+tit.match(/http:\/\/imgur\.com\/(\w+)$/i)[1]+'.jpg';
					else if(tit.match(/http:\/\/www\.quickmeme\.com\/meme\/\w+\/?$/i))
						return 'http://i.qkme.me/'+tit.match(/http:\/\/www\.quickmeme\.com\/meme\/(\w+)/i)[1]+'.jpg';
					else if(tit.match(/http:\/\/qkme\.me\//i))
						return 'http://c0016417.cdn2.cloudfiles.rackspacecloud.com/'+tit.match(/http:\/\/qkme\.me\/(\w+)/i)[1]+'.jpg';
					try{ return selCss('a.thumbnail img', post); }
					catch(e){}
					try{ return selCss('img#header-img', html); }
					catch(e){ return '/favicon.ico'; }
				},
		back:	function(html, pos){
					if(pos%25) return '##'+(pos-1);
					return selCss('a[rel~="prev"]', html);
				},
		next:	function(html, pos){
					if((pos+1)%25) return '##'+(pos+1);
					return selCss('a[rel~="next"]', html);
				},
		extra:	[function(html, pos){
					var posts = selCss('#siteTable>.thing:not(.promoted)', html, true);
					return posts[((pos%25)+25)%25];
				}],
		js:		function(dir){
					exec("expando_child($('.expando-button'))");
				},
		layelem:'//body/div[contains(@class,"content")]'
	},
	{	url:	'blankitcomics.com',
		img:	'http://blankitcomics.com/bicomics/'
	},
	{	url:	'luscious.net',
		img:	[['#single_picture']],
		fixurl:	function(url, img, link){
					if(img) return url.replace(/(\.\d+x\d+)(\.\w+$)/, '$2');
					return url;
				},
		style:	'#wcr_div button{display:inline;}',
		scrollx:'R'
	},
	{	url:	'geekculture.com',
		img:	[['p > img']]
	},
	{	url:	'thedoujin.com',
		img:	[['#image']],
		back:	[['.previous > a']],
		next:	[['.next > a']],
		first:	[['.first > a']],
		last:	[['.last > a']],
		scrollx:'R'
	},
	{	url:	'oslevadosdabreca.com',
		img:	'http://www.oslevadosdabreca.com/tiras/',
		first:	[['.nav-first a']],
		last:	[['.nav-last a']]
	},
	{	url:	'faans.com',
		back:	'@rel="prev"',
		next:	'@rel="next"'
	},
	{	url:	'cheer.sailorsun.org',
		img:	[['#comic img']],
		back:   [[['.comic-nav-previous']]],
		next:   [[['.comic-nav-next']]]
	},
	{	url:	'drunkduck.com',
		img:	[['#comic img']],
		back:	'img[@class="arrow_prev"]',
		next:	'img[@class="arrow_next"]',
		first:	'img[@class="arrow_first"]',
		last:	'img[@class="arrow_last"]',
		extra:	[[['#author_note_holder']]],
		style:	'#wcr_extra #author_note_holder{float:none;text-align:left;min-height:0;} #wcr_extra .thumbnailleft img{width:60px;} #wcr_extra .postcontent{width:auto;}'
	},
	{	url:	'ephralon.de',
		img:	'/seekers/'
	},
	{	url:	'http://www.montrose.is/sgvy/',
		img:	[['#comic']]
	},
	{	url:	'truefork.org',
		extra:	[[['.plaintext']]]
	},
	{	url:	/anelnoath\.com\/\w+\d+\.htm/,
		img:	[['img']]
	},
	{	url:	'nsfw-comix.com',
		img:	'comix/',
		extra:	[[['img[src^="comix/"]', '<br/>', 1]]]
	},
	{	url:	'thewotch.com',
		back:   [[['.comic-nav-previous']]],
		next:   [[['.comic-nav-next']]],
		extra:	[[['.comments']]],
		style:	'#wcr_imagen{max-height:100% !important;max-width:90vw !important;width:auto !important;height:auto !important;}'
	},
	{	url:	'thedevilbear.com',
		img:	'comixx/'
	},
	{	url:	'terinu.com',
		img:	function(html, pos){
					if(!pos) return selCss('#Image1');

					var cappag = imagen[0].match(/Comic(\d+)Pg(\d+)/);
					var nombre = 'Chapter '+parseInt(cappag[1])+' Page '+parseInt(cappag[2]);
					var op = xpath('//option[.="'+nombre+'"]/'+
						(pos>0?'following':'preceding')+'-sibling::option['+Math.abs(pos)+']');

					var cappagimg = op.textContent.match(/Chapter (\d+) Page (\d+)/);
					var cap = cappagimg[1];
					while(cap.length<2) cap='0'+cap;
					var pag = cappagimg[2];
					while(pag.length<3) pag='0'+pag;

					return '/Comic/Comic'+cap+'Pg'+pag+'.jpg';
				},
		back:	function(html, pos){
					return '##'+(pos-1);
				},
		next:	function(html, pos){
					return '##'+(pos+1);
				}
	},
	{	url:	'las-historietas.blogspot.com',
		img:	['//div[contains(@class, "post-body")]//a[img and (contains(@href, ".png") or contains(@href, ".jpg") or contains(@href, ".gif"))]/@href'],
		back:	'@id="blog-pager-older-link"',
		next:	'@id="blog-pager-newer-link"',
		extra:	[function(html, pos){
					var div = selCss('.post-body', html);
					var aimgs = selCss('[href$=".png"]>img,[href$=".jpg"]>img,[href$=".gif"]>img,[href$=".PNG"]>img,[href$=".JPG"]>img,[href$=".GIF"]>img', div, true);
					aimgs[0].parentNode.removeChild(aimgs[0]);
					for(var i=1; i<aimgs.length; i++){
						var img = aimgs[i];
						var href = img.parentNode.href;
						if(img.src != href){
							img.src = href;
							img.removeAttribute('width');
							img.removeAttribute('height');
						}
					}
					return div;
				}],
		layelem:'//div[contains(@class, "post-body")]',
		style:	'.content-outer{max-width:none !important;}'
	},
	{	url:	'dcisgoingtohell.com',
		back:	'@class="navi navi-prev"',
		next:	'@class="navi navi-next"'
	},
	{	url:	'palcomix.com',
		img:	'../images/',
		extra:	[[['form']]]
	},
	{	url:	'soulsymphonycomic.com',
		img:	[['#comic>img']]
	},
	{	url:	'malandchad.com',
		back:	'@rel="prev"',
		next:	'@rel="next"'
	},
	{	url:	'digitalcomicmuseum.com/preview',
		img:	'cache/'
	},
	{	url:	'fourcolorshadows.blogspot.com|thehorrorsofitall.blogspot.com',
		img:	function(html, pos){
					var aimgs = xpath('//div[contains(@class,"blog-posts")]//div/a[img[not(@class="icon-action")]]', html, true);
					var num = pos ? Number(link[pos].match(/##(\d+);/)[1]) : 0;

					return aimgs[pos-num].href;
				},
		back:	function(html, pos){
					throw new Error('fail');
				},
		next:	function(html, pos){
					if(!pos) return '##0;1';

					var aimgs = xpath('//div[contains(@class,"blog-posts")]//div/a[img[not(@class="icon-action")]]', html, true);
					var num = Number(link[pos].match(/##(\d+);/)[1]);

					if(num+aimgs.length > pos+1) return '##' + num + ';' + (pos+1);

					return selCss('#Blog1_blog-pager-older-link', html).href +
						'##' + (num+aimgs.length) + ';' + (pos+1);
				},
		extra:	[function(html, pos){
					var post = xpath('//div[contains(@class,"post-body") and .//a[@href="'+imagen[pos]+'"]]', html);
					return outerHTML(selCss('h3', post.parentNode)) +
						'<br/>' + post.textContent +
						outerHTML(selCss('.post-footer', post.parentNode));
				}],
		layelem:'//div[@id="header-wrapper"]'
	},
	{	url:	'bato.to/chapter',
		img:	function(html, pos){
					try {
						xpath('//img[@class="page-img" and starts-with(@src, "http")]/@src', html);
					} catch (error) {
						var page = xpath('//optgroup[@label="Page"]//option[@selected="true"]/@value', html);
						var regex = /var images = (.*);/g;
						return JSON.parse(regex.exec(html)[1])[page];
					}

					return xpath('//img[@class="page-img"]', html);
				},
		back:	function(html, pos){
					return xpath("//div[contains(concat(' ',normalize-space(@class),' '),' nav-prev ')]//a/@href", html);
		},
		next:	function(html, pos){
					return xpath("//div[contains(concat(' ',normalize-space(@class),' '),' nav-next ')]//a/@href", html);
		}
	},
	{	url:	'nedroid.com',
		extra:	['<br/>', [['.post-comic h2']]]
	},
	{	url:	'lovemenicecomic.com',
		img:	'http://www.lovemenicecomic.com/wp-content/webcomic/',
		back:	'@rel="previous"',
		next:	'@rel="next"'
	},
	{	url:	'kingfeatures.com',
		img:	[['#comic img']],
		back:	function(html, pos){
					var date = xpath('//select[@name="date"]/option[@selected]/preceding-sibling::option[1]/@value', html);
					return 'aboutMaina.php?date='+date;
				},
		next:	function(html, pos){
					var date = xpath('//select[@name="date"]/option[@selected]/following-sibling::option[1]/@value', html);
					return 'aboutMaina.php?date='+date;
				}
	},
	{	url:	'thezombiehunters.com',
		extra:	[[['#ranttext']]]
	},
	{	url:	'syacartoonist.com|satwcomic.com|stupidfox.net',
		img:	[['[src*="/art/"]:not([class])']],
		extra:	[['//div[@class="stand_high"][1]']]
	},
	{	url:	'casualvillain.com',
		img:	[['#comic img']],
		back:	'.="Back"',
		next:	'.="Forward"'
	},
	{	url:	'fanboys-online.com',
		extra:	[[['.post-content']]],
		bgcol:	'#490606'
	},
	{	url:	'freefall.purrsia.com',
		img:	'/ff',
		back:	'contains(.,"Previous")',
		next:	'contains(.,"Next")'
	},
	{	url:	'shd-wk.com',
		style:	'#wcr_div{text-align:left !important;} #wcr_listabm{padding-top:100px;}'
	},
	{	url:	'pebbleversion.com',
		img:	[['img[src*="ComicStrips"]']],
		extra:	[[['td[rowspan="2"] div']], [['td[colspan="4"] font']]]
	},
	{	url:	'accurseddragon.com',
		extra:	[[['.webcomic_post']]]
	},
	{	url:	'victorycomic.comicgenesis.com',
		img:	[['img[alt="Comic"]']]
	},
	{	url:	'flakypastry.runningwithpencils.com',
		img:	'comics/'
	},
	{	url:	'gogetaroomie.chloe-art.com',
		img:	[['.comicpane img']]
	},
	{	url:	'mindmistress.comicgenesis.com',
		img:	'/comics/',
		extra:	[[['img[src^="/comics/"]', '', 1]]]
	},
	{	url:	'kastlecomics.comicgenesis.com',
		img:	[['img[src*="/comics/"]']]
	},
	{	url:	'evernightcomic.com',
		style:	'#wcr_imagen{height:auto !important;}'
	},
	{	url:	'comicstriplibrary.org',
		img:	'/images/comics/',
		back:	'.="<< Previous"',
		next:	'.="Next >>"'
	},
	{	url:	'*.tiraecol.net',
		img:	[['img[src*="tiraecol.net/modules/comic/cache/images/"]']],
		back:	['//td[@width="200px" and @align="left"]/a[2]'],
		next:	['//td[@width="200px" and @align="right"]/a[1]'],
		extra:	[[['.title']]]
	},
	{	url:	'conejofrustrado.com',
		back:	'@class="navAnterior"',
		next:	'@class="navSiguiente"'
	},
	{	url:	'e2w-illustration.com',
		img:	'http://www.e2w-illustration.com/images/'
	},
	{	url:	'comic.naver.com',
		img:	[['.wt_viewer img']],
		back:	[['.pre a']],
		next:	[['.next a']],
		extra:	[[['.wt_viewer img', '<br/>', 1]]],
		style:	'.wt_viewer>img{display:none;}'
	},
	{
		url:	'webtoons.com',
		img:	['//*[@id="_imageList"]/img/@data-url'],
		back:	[['.pg_prev']],
		next:	[['.pg_next']],
		extra:	[[['#_imageList']]],
		layelem:	'//*[@id="_imageList"]',
		js:	function(dir){
				// Refresh webtoon's image loading script
				exec("oVisible.refresh();oVisible.check()");
				// Click on any img
				var elemImagen = document.querySelectorAll('#wcr_extra img');
				setEvt(elemImagen, 'click', imgClick);
				setEvt(elemImagen, 'mousemove', imgCursor);
				},
		style:	'#wcr_imagen{display:none;}',
	},
	{	url:	'trenchescomic.com',
		img:	[['.comic img']]
	},
	{	url:	'goominet.com',
		img:	[['center>img[src^="uploads/"]']],
		extra:	[[['center>img[src^="t"]']]]
	},
	{	url:	'doesnotplaywellwithothers.com',
		extra:	[[['#sidebar-undercomic p']]]
	},
	{	url:	'aikoniacomic.com',
		style:	'#comic{height:auto;}',
		extra:	[[['#blurb']]]
	},
	{	url:	'grrlpowercomic.com',
		extra:	[[['.post-comic']]]
	},
	{	url:	'the-whiteboard.com',
		img:	[['center>img']]
	},
	{	url:	'mezzacotta.net',
		extra:	[[['h2']], ['//h2/following-sibling::p', '', 2]]
	},
	{	url:	'hbrowse.com',
		img:	[['.pageImage img']],
		back:	['//a[not(@href)]/preceding-sibling::a[1] | //a[@name="prev" and not(starts-with(@href, "javascript"))]'],
		next:	['//a[not(@href)]/following-sibling::a[1] | //a[@name="next" and not(starts-with(@href, "javascript"))]']
	},
	{	url:	'fancyadventures.com',
		extra:	[[['.entry p']]]
	},
	{	url:	'darklegacycomics.com',
		img:	[['td[background="comic_mid.gif"] img']]
	},
	{	url:	'bearmageddon.com',
		extra:	[[['.post']]]
	},
	{	url:	'betweenfailures.net',
		img:	'http://betweenfailures.net/wp-content/webcomic/',
		extra:	[[['.webcomic_post h1']], [['.webcomic_post .content']]]
	},
	{	url:	'sisterclaire.com',
		back:	function(html, pos){
					try{ return xpath('//a[.="Previous"]', html); }
					catch(e){ return xpath('//a[.="Previous Chapter"]', html); }
				},
		next:	'.="Next" or .="Next Chapter"',
		extra:	[[['.entry']]],
	},
	{	url:	'awesomehospital.com',
		extra:	[[['.post-comic']]]
	},
	{	url:	'ars.userfriendly.org',
		img:	'http://www.userfriendly.org/cartoons/archives/',
		back:	[['[alt="Previous Cartoon"]']],
		next:	[['[alt="Next Day\'s Cartoon"]']]
	},
	{	url:	'friendswithboys.com',
		img:	[['.entry img']],
		extra:	[[['.entry>*', '', 1]]]
	},
	{	url:	'calamitiesofnature.com',
		img:	[['#comic img']]
	},
	{	url:	'irregularwebcomic.net',
		extra:	[[['#annotation']]],
		style:	'div.hide {display: block; text-align: left;}',
	},
	{	url:	'adistantsoil.com',
		back:	'@title="Previous"',
		next:	'@title="Next"',
		extra:	[['//div[@class="post-content"]']],
		bgcol:	'#f4eebc'
	},
	{
		url:	'kissmanga.com',
		img:	function(html, pos){
					var imgs = html.match(/lstImages\.push\(wrapKA\(".+?"\)\);/g);

					var num = 0;
					try {num = Number(link[pos].match(/##(-?\d+)/)[1]);}
					catch (e) {num = 0;}
					if (num == -1) num = imgs.length - 1;

					return unsafeWindow.wrapKA(imgs[num].match(/"(.+)"/)[1]);
				},
		back:	function(html, pos){
					var num;
					var imgs = html.match(/lstImages\.push\(wrapKA\(".+?"\)\);/g);

					try {num = Number(link[pos].match(/##(-?\d+)/)[1]);}
					catch (e) {var num = 0;}
					if (num == -1) num = imgs.length - 1;

					if (num > 0) return '##' + (num-1);

					return xpath('//select[(@id|@class)="selectChapter"]/option[@selected]/preceding-sibling::option[1]/@value', html) +
						'##-1';
				},
		next:	function(html, pos){
					var num;
					var imgs = html.match(/lstImages\.push\(wrapKA\(".+?"\)\);/g);

					try {num = Number(link[pos].match(/##(-?\d+)/)[1]);}
					catch (e) {var num = 0;}
					if (num == -1) num = imgs.length - 1;

					if (imgs.length > num+1) return '##' + (num+1);

					return xpath('//select[(@id|@class)="selectChapter"]/option[@selected]/following-sibling::option[1]/@value', html) +
						'##0';
				},
		scrollx:	'R',
		layelem:	'//div[@id="divImage"]',
	},
	{	url:	'vickifox.com',
		img:	[['.comic']]
	},
	{	url:	'spinnyverse.com',
		back:	[['.nav-previous a']],
		next:	[['.nav-next a']]
	},
	{	url:	'zenpencils.com',
		extra:	[[['.comicpress_comic_blog_post_widget']]]
	},
	{	url:	'webcomics.yaoi911.com',
		img:	[['.webcomic-object img']],
		back:	'@rel="previous"',
		next:	'@rel="next"'
	},
	{	url:	'thedevilspanties.com',
		extra:	[['//div[@class="entry"]']],
	},
	{	url:	'bradcolbow.com',
		img:	[['.entry img']],
		extra:	[[['h2']], [['h5']]]
	},
	{	url:	'guildedage.net',
		img:	[['#comic img']],
		back:	[['.navi-prev']],
		next:	[['.navi-next']]
	},
	{	url:	'betweenfailures.com',
		img:	[['.webcomic-image img']]
	},
	{	url:	'claudeandmonet.com',
		img:	[['.webcomic-object img']]
	},
	{	url:	'de.ninemanga.com',
		img:	[['.manga_pic']],
		back:	[['.blue']],
		next:	'.=">>"',
		scrollx:'R'
	},
	{	url:	'bloomingfaeries.com',
		img:	[['#comic img']]
	},
	{	url:	'shadbase.com|shagbase.com',
		img:	[['#comic img']],
		extra:	[['//div[@id="comic-1" and not(img)]'], [['#comic .comicpane', '', 1]]],
		layelem:'//div[@id="comic"]'
	},
	{	url:	'mrlovenstein.com',
		img:	[['.comic_image div img']],
		back:	'img[contains(@src, "nav_left")]',
		next:	'img[contains(@src, "nav_right")]',
		layelem:'//div[@class="comic_image"]'
	},
	{	url:	'anticscomic.com',
		img:	[['#comic img']]
	},
	{	url:	'octopuns.blogspot.com',
		img:	[['.post-body img']],
		back:	'img[contains(@src,"Back.png")]',
		next:	'img[contains(@src,"Next.png")]',
		extra:	[['//div[contains(@class, "post-body")]/*[not(@class="separator") or contains(@style, "text-align: left")] | //div[contains(@class, "post-body")]/text()', '']],
		fixurl:	function(url, img, link){
					if(link) return url.replace('.com.au/', '.com/');
					return url;
				}
	},
	{	url:	'powernapcomic.com',
		img:	[['center > img']],
		extra:	[[['.titulo2']], [['.titulo2 + .news']]]
	},
	{	url:	'blackbird.ashen-ray.com|carciphona.com',
		img:	function(html, pos){
					return selCss('.page', html).style.backgroundImage.match(/"(.+)"/)[1];
				},
		layelem:'//div[@class="page"]',
		scrollx:'R'
	},
	{	url:	'ahs-comic.com',
		img:	[['.webcomic-image img']],
		extra:	[[['#main article']]],
		style:	'.webcomic-image{font-size: 1em; line-height: 1;}'
	},
	{	url:	'gogetaroomie.com',
		extra:	[[['#newsarea > *', '', 0, -3]]]
	},
	{	url:	'sleepymaid.com',
		img:	[['.image']]
	},
	{	url:	'squid-ops.com',
		img:	[['#content img']]
	},
	{	url:	'endcomic.com',
		img:	[['#comic img']],
		extra:	[[['.entry']]]
	},
	{	url:	'thenoobcomic.com',
		back:	[['.comic_nav_previous_button']],
		next:	[['.comic_nav_next_button']]
	},
	{	url:	'*.zizki.com',
		img:	[['.back img']],
		back:	[['.larr']],
		next:	[['.rarr']]
	},
	{	url:	'schizmatic.com',
		img:	[/src=&quot;(.+?)&quot;/, 1],
		extra:	[[['#authorText']]]
	},
	{	url:	'bringbackroomies.com',
		img:	[['#comic img']]
	},
	{	url:	'blindsprings.com',
		img:	[['#cc-comic']],
		back:	[['.cc-prev']],
		next:	[['.cc-next']],
		first:	[['.cc-first']],
		last:	[['.cc-last']],
		extra:	[[['#bottomleft']]],
		xelem:	'//div[@id="bottomleft"]',
		js:	function(dir){
				var disqusJs = selCss('.cc-commentbody>script').innerHTML;
				DISQUS && DISQUS.reset({
			  		reload: true,
			  		config: function () {
			  			this.page.identifier = disqusJs.match(/identifier = '(.*)'/)[1];
			  			this.page.url = disqusJs.match(/url = '(.*)'/)[1];
					}
				});
			},
		style:	'#topleft{background-size:auto 1061px;height:1061px;}\n#cc-comicbody{height:933px;}\n#wcr_imagen{width:700px !important;height:auto !important;}',
	},
	{	url:	'forgottenordercomic.com',
		img:	[['#cc-comic']],
		back:	[['.cc-prev']],
		next:	[['.cc-next']],
		first:	[['.cc-first']],
		last:	[['.cc-last']],
		extra:	[[['#newsleft']]],
		xelem:	'//div[@id="newsleft"]',
		js:	function(dir){
				var disqusJs = selCss('.cc-commentbody>script').innerHTML;
				DISQUS && DISQUS.reset({
					reload: true,
					config: function () {
						this.page.identifier = disqusJs.match(/identifier = '(.*)'/)[1];
						this.page.url = disqusJs.match(/url = '(.*)'/)[1];
					}
				});
			},
	},
	{	url:	'wtfcomics.com',
		img:	function(html, pos){
					var m = link[pos].match(/\?(\d+)_(\d+)?/);
					var id = Math.max(Math.min(Number(m[2] || '1'), Number(m[1])), 1);
					return html.match(/document.writeln\(\"<IMG SRC=\\"([^"]+)/)[1] + id + '.jpg';
				},
		back:	function(html, pos){
					var m = link[pos].match(/([^\/]+\?)(\d+)_(\d+)?/);
					var id = Math.max(Math.min(Number(m[3] || '1'), Number(m[2])), 1);
					if(id == 1) throw new Error('first');
					return m[1] + m[2] + '_' + (id-1);
				},
		next:	function(html, pos){
					var m = link[pos].match(/([^\/]+\?)(\d+)_(\d+)?/);
					var id = Math.max(Math.min(Number(m[3] || '1'), Number(m[2])), 1);
					if(id == m[2]) throw new Error('last');
					return m[1] + m[2] + '_' + (id+1);
				},
		layelem:'//img'
	},
	{	url:	'olympusoverdrive.com',
		style:	'#comic{height:auto !important;}'
	},
	{	url:	'*.troutcave.net',
		style:	'#left-wrap, #comic{width:auto !important;}'
	},
	{	url:	'gingerhaze.com',
		img:	'http://gingerhaze.com/sites/default/files/nimona-pages'
	},
	{	url:	'gunnerkrigg.com',
		back:	'img[contains(@src, "prev_a")]',
		next:	'img[contains(@src, "next_a")]'
	},
	{	url:	'aspect.waywardstudios.net',
		img:	'comics/'
	},
	{	url:	'cucumber.gigidigi.com',
		img:	[['.webcomic-image img']]
	},
	{	url:	'dorktower.com',
		img:	[['.entry-content > p > img']],
		back:	'.="Previous"',
		next:	'.="Next"'
	},
	{	url:	'octopuspie.com',
		img:	'http://www.octopuspie.com/strippy/'
	},
	{	url:	'nhentai.net',
		img:	[['#image-container a img']],
		back:	[['.previous']],
		next:	[['.next']],
		extra:	[[['#page-container > *', '<br/>', 2]]],
		style:	'#page-container img{max-width: none;}',
		layelem:'//div[@id="content"]',
		scrollx:'R'
	},
	{	url:	'hejibits.com',
		extra:	[[['.post-content']]]
	},
	{	url:	'paintraincomic.com',
		img:	[['#comic img']],
		extra:	[[['.post-content']]]
	},
	{	url:	'extrafabulouscomics.com',
		style:	'#page{width:auto;}'
	},
	{	url:	'feywinds.com/comic',
		img:	'../comic/pages'
	},
	{   url:	'omgbeaupeep.com',
		img:	[['#omv .picture']],
		back: function(html, pos) {
			try {
				return xpath('//a[img[@alt="Previous Page"]]/@href', html);
			} catch (e) {
				var currChapter = xpath('//select[@name="chapter"]/*[@selected]', html);
				return link[pos].replace(currChapter.value, currChapter.previousSibling.value);
			}
		},
		next: function(html, pos) {
			try {
				return xpath('//a[img[@alt="Next Page"]]/@href', html);
			} catch (e) {
				var currChapter = xpath('//select[@name="chapter"]/*[@selected]', html);
				return link[pos].replace(currChapter.value, currChapter.nextSibling.value).replace(/\/[^\/]*$/, "/1");
			}
		},
		extra: [[[".pager"]]],
	},
 	{
		url:	'orgymania.net',
		img:	'/slippreview/',
		back:	'text()="< prev"',
		next:	'text()="next >"',
		first:	'text()="|<"',
	},
	// Needed two separate EGS entries to handle the www and non-www URLs
	//--[
	{
		url:	'www.egscomics.com',
		img:	[['#cc-comic']],
		back:   [['.cc-prev']],
		next:   [['.cc-next']],
		first:	[['.cc-first']],
		last:	[['.cc-last']],
		extra:	['<div id="wrapper"><div id="leftarea" style="text-align: left">',[['#news']],'</div></div>'],
		fixurl:	function(url, img, link){
		if(link) return url.replace('://egscomics', '://www.egscomics');
		return url;
		}
	},
	{
		url:	'egscomics.com',
		img:	[['#cc-comic']],
		back:   [['.cc-prev']],
		next:   [['.cc-next']],
		first:	[['.cc-first']],
		last:	[['.cc-last']],
		extra:	['<div id="wrapper"><div id="leftarea" style="text-align: left">',[['#news']],'</div></div>']
	},
	//]--
	{
		url:	'http://mspfanventures.com/',
		img:	[['article img']],
		next:	[['#nextlinks a']],
		extra:	[[['article']],'<script>assignOnClicks()</script>'],
		js:	function(dir){assignOnClicks();},
		style:	'#wcr_imagen { display: none; }',
	},
	{
		url:	'mspaintadventures.com/?s=1',
		img:	'http://cdn.mspaintadventures.com/advimgs',
		next:	[['font[size="5"]>a']],
		extra:	[['//table[@width="600"]']],
		js:	function(dir){/*[].slice.call(document.getElementsByTagName("table")).forEach(function(x){x.width = 800;})*/

			// Click on any img
			var elemImagen=document.querySelectorAll('#wcr_extra img');
			setEvt(elemImagen, 'click', imgClick);
			setEvt(elemImagen, 'mousemove', imgCursor);},
		style:	'#wcr_imagen { display: none; }\np { font-size: large; }',
	},
	{
		url:	'mspaintadventures.com/extras',
		img:	'http://www.mspaintadventures.com/extra',
		back:	function(html, pos){var comicNr = parseInt(link[pos].match(/\d+/)[0]);
			if (comicNr == 1) throw new Error("First comic");
			comicNr--;
			comicNr = ("000000" + comicNr).match(/0*(\d{6})$/)[1];
			return link[pos].replace(/\d+/, comicNr);},
		next:	function(html, pos){var comicNr = parseInt(link[pos].match(/\d+/)[0]);
			comicNr++;
			comicNr = ("000000" + comicNr).match(/0*(\d{6})/)[1];
			return link[pos].replace(/\d+/, comicNr);},
		extra:	[['//table[@width="800"]']],
		js:	function(dir){/*[].slice.call(document.getElementsByTagName("table")).forEach(function(x){x.width = 800;})*/

			// Click on any img
			var elemImagen=document.querySelectorAll('#wcr_extra img');
			setEvt(elemImagen, 'click', imgClick);
			setEvt(elemImagen, 'mousemove', imgCursor);},
		style:	'#wcr_imagen { display: none; }\np { font-size: large; }',
	},
	{
		url:	'mspaintadventures.com/?s=4',
		img:	'http://cdn.mspaintadventures.com/advimgs',
		back:	'text()="Go Back"',
		next:	[['font[size="5"]>a']],
		extra:	[['//table[@width="600"]']],
		js:	function(dir){
			// Click on any img
			var elemImagen=document.querySelectorAll('#wcr_extra img');
			setEvt(elemImagen, 'click', imgClick);
			setEvt(elemImagen, 'mousemove', imgCursor);},
		style:	'#wcr_imagen { display: none; }\np { font-size: large; }',
	},
	{
		url:	'mspaintadventures.com/?s=6',
		img:	'http://cdn.mspaintadventures.com/storyfiles/',
		back:	'text()="Go Back"',
		next:	function(html, pos){var x = selCss('font[size="5"]>a',html,true);
			return x[x.length-1];},
		extra:	[['//table[@width="600"]']],
		xelem:	'//table[@width="600"]',
		layelem:	'//table[@width="600"]',
		js:	function(dir){
			// Click on any img to switch page
			var elemImagen=document.querySelectorAll('#wcr_extra img');
			setEvt(elemImagen, 'click', imgClick);
			setEvt(elemImagen, 'mousemove', imgCursor);

			// Show pesterlogs
			var x = document.getElementsByClassName('spoiler');
			for (var i = 0; i < x.length; i++) {x[i].previousSibling.firstChild.click();}
			},
		style:	'#wcr_imagen { display: none; }\np { font-size: large; }',
	},
	{
		url:	'mspaintadventures.com/scratch.php?',
		img:	'storyfiles/',
		back:	'text()="Go Back"',
		next:	function(html, pos){var x = selCss('font[size="5"]>a',html,true);
			return x[x.length-1];},
		extra:	[['//table[@width="600"]']],
		xelem:	'//table[@width="600"]/tbody',
		layelem:	'//table[@width="600"]',
		js:	function(dir){/*[].slice.call(document.getElementsByTagName("table")).forEach(function(x){x.width = 800;})*/

			// Click on any img to switch page
			var elemImagen=document.querySelectorAll('#wcr_extra img');
			setEvt(elemImagen, 'click', imgClick);
			setEvt(elemImagen, 'mousemove', imgCursor);

			// Show pesterlogs
			var x = document.getElementsByClassName('spoiler');
			for (var i = 0; i < x.length; i++) {x[i].previousSibling.firstChild.click();}

			typeof onChange == 'function' && onChange(dir);},
		style:	'#wcr_imagena { display: none; }\np { font-size: large; }',
	},
	{
		url:	'mangatown.com/manga/',
		img:	[['#image']],
		back:	function(html, pos){try {
				return xpath('//div[@class="page_select"]/select/option[@selected]/preceding-sibling::option[1]/@value',html);
			} catch (e) {
				var chapterUrl = xpath('//h1/a/@href', html);
				var prevChapter = xpath('//select[@class="chapter_select"]/option[@value="' + chapterUrl + '"]/preceding-sibling::option[1]/@value');
				return prevChapter;
			}},
		next:	function(html, pos){try {
				return xpath('//div[@class="page_select"]/select/option[@selected]/following-sibling::option[1]/@value',html);
			} catch (e) {
				var chapterUrl = xpath('//h1/a/@href', html);
				var nextChapter = xpath('//select[@class="chapter_select"]/option[@value="' + chapterUrl + '"]/following-sibling::option[1]/@value');
				return nextChapter;
			}},
		first:	['//div[@class="page_select"]/select/option[1]/@value'],
		last:	['//div[@class="page_select"]/select/option[last()]/@value'],
		js:	function(dir){document.onkeyup = null;},
		scrollx:'R'
	},
	{
		url:	'http://www.legostargalactica.net/',
		extra:	[['//div[@class="post-comic"]'],[['.comment-wrap']]],
		xelem:	'//div[@class="post-comic"]',
		layelem:	'//div[@id="comic"]',
	},
	{
		url:	'dynasty-scans.com',
		img:	function(html, pos){
				var page;
				var img = selCss("#image > img", html);
				var pages = JSON.parse(html.match(/var pages = ([^;]*);/)[1]);
				if (link[pos].match(/#last$/)) {
					page = pages.length - 1;
				} else {
					page = Number(match(link[pos], /#(\d+)$/, 1, 1));
				}
				link[pos] = link[pos].replace(/(#?#.*)?$/,"##"+page);
				var url = pages[page-1].image;
				img.src = url;
				return img;
			},
		back:	function(html, pos){
				var page = Number(match(link[pos], /#(\d+)$/, 1, 1));
				if (--page) {
					return link[pos].replace(/(#?#.*)?$/,"##"+page);
				}

				return selCss("#prev_link", html).href.replace(/$/,"##last");
			},
		next:	function(html, pos){
				var page = Number(match(link[pos], /#(\d+)$/, 1, 1));
				var pages = JSON.parse(html.match(/var pages = ([^;]*);/)[1]);
				if (++page < pages.length) {
				  return link[pos].replace(/(#?#.*)?$/,"##"+page);
				}

				var url = selCss("#next_link", html).href;
				if (url.match(/#$/)) {
				  throw new Error("Last page");
				}
				return url;
			},
		extra:	[[['.pages-list']]],
		layelem:'//*[@id="image"]',
	},
	{
		url:	'girlgeniusonline.com/comic.php',
		img:	'http://www.girlgeniusonline.com/ggmain/strips/',
		back:	[['#bottomprev']],
		next:	[['#bottomnext']],
	},
	{
		url:	'http://incase.buttsmithy.com/comic/',
		img:	[['#comic img']],
	},
	{
		url:	'project-apollo.net/mos/',
		img:	'manga/',
	},
	{
		url:	'https://danbooru.donmai.us/posts?',
		img:	function(html, pos){
					if (!extraData.imgs) extraData.imgs = {};
					var page = parseInt(match(link[pos], /page=(\d+)/, 1, 1));
					if (!extraData.imgs[page]) {
						extraData.imgs[page] = selCss(".post-preview", html, true);
					}
					//var imgs =  xpath('//*[@class="post-preview"]/@data-file-url', html, true);

					link[pos] = link[pos].replace(/##last/,"##"+extraData.imgs[page].length);
					var index = parseInt(match(link[pos],/##(\d+)/,1, 1));
					var url = extraData.imgs[page][index-1].getAttribute('data-file-url');
					return url;
				},
		back:	function(html, pos){
					var base = link[pos].split(/##?/)[0];
					var index = parseInt(link[pos].split(/##?/)[1]) || 1;
					if(index>1) return base + "##" + (index - 1);
					return xpath('//a[@rel="prev"]/@href', html) + "##last";
				},
		next:	function(html, pos){
					var page = parseInt(match(link[pos], /page=(\d+)/, 1, 1));
					var base = link[pos].split(/##?/)[0];
					var index = parseInt(link[pos].split(/##?/)[1]) || 1;
					if(index<extraData.imgs[page].length) return base + "##" + (index + 1);
					return xpath('//a[@rel="next"]/@href', html) + "##1"
				},
		extra:	['<h2><a href="/posts/',
				 function(html, pos){
					var page = parseInt(match(link[pos], /page=(\d+)/, 1, 1));
					var index = parseInt(link[pos].split(/##?/)[1]) || 1;
					return extraData.imgs[page][index-1].getAttribute('data-id');
				 },
				 '">Image details</a></h2>',
				 [['#posts']],
				],
		layelem:'//div[@id="posts"]/div[1]',
		js:	function(dir){
				var selExtras = selCss('#wcr_extra');
				selCss('#wcr_div').insertBefore(selExtras, null);
				// Doesn't currently work.
				// var thumbs = selCss('.post-preview>a',selExtras, true);
				// for (var i = 0; i < thumbs.length; i++){
				// 	thumbs[i].href = "##"+i;
				// }
			},
	},
	{
		url:	'mngdoom.com',
		img:	function(html, pos){
				var pageCh = link[pos].match(/(\d+)\/(\d+)$/);
				var chapter, page;
				if (pageCh) {
				  chapter = pageCh[1];
				  page = pageCh[2];
				}
				var images = JSON.parse(html.match(/var images = ([^;]*)/)[1]).map(x=>x.url);

				return images[page-1];
				},
		back:	function(html, pos){
				var pageCh = link[pos].match(/(\d+)\/(\d+)$/);
				var chapter, page;
				if (pageCh) {
					chapter = +pageCh[1];
					page = +pageCh[2];
				}
				var images = JSON.parse(html.match(/var images = ([^;]*)/)[1]).map(x=>x.url);

				var prev_ch = html.match(/var prev_chapter_url = '([^']*)'/);

				if (page <= 1) {
					return prev_ch[1];
				} else {
					return link[pos].replace(/(\d+)\/(\d+)$/, chapter + "/" + (page - 1));
				}
				},
		next:	function(html, pos){
				var pageCh = link[pos].match(/(\d+)\/(\d+)$/);
				var chapter, page;
				if (pageCh) {
				  chapter = +pageCh[1];
				  page = +pageCh[2];
				}
				var images =JSON.parse(html.match(/var images = ([^;]*)/)[1]).map(x=>x.url);

				var next_ch =html.match(/var next_chapter_url = '([^']*)'/);

				if (page >= images.length-1) {
				  return next_ch[1];
				} else {
				  return link[pos].replace(/(\d+)\/(\d+)$/, chapter + "/" + (page+1));
				}
				},
	},
	{
		url:	'kimchicuddles.com/post/',
		img:	[['figure.photo-hires-item img']],
		back:	[['.previous-button']],
		next:	[['.next-button']],
		first:	[['.first-button']],
		last:	[['.latest-button']],
	},
	{
		url:	'marktrail.com',
		img:	[['#comic img']],
	},
	{	url:	'atomic-robo.com',
		img:	[['#cc-comic']],
		back:   [['.cc-prev']],
		next:   [['.cc-next']],
		first:	[['.cc-first']],
		last:	[['.cc-last']],
		style:	'#wcr_imagen{height:auto !important;width:auto !important;}'
	},
	{	url:	'furaffinity.net',
		img:	[['#submissionImg']],
		back:	['//span[@class="parsed_nav_links"]//a[contains(.,"PREV")]'],
		next:	['//span[@class="parsed_nav_links"]//a[contains(.,"NEXT")]'],
		first:	['//span[@class="parsed_nav_links"]//a[contains(.,"FIRST")]'],
		extra:  [['//table[@class="maintable"]//tbody//tr//table[@class="maintable"]']]
	},
	{	url:	'dhscomix.com/comics', //Random Encounters
		img:	['//div[@id="content"]//img'],
        extra:	[['//div[@id="content"]']],
		back:	'img[contains(@src, "nav_prevpage")]',
		next:	'img[contains(@src, "nav_nextpage")]',
        //Work around for multiple comic images on a page
        style:  '#wcr_imagen{display: none !important;}\ndiv#content p:nth-child(1){display: none !important}', //Hides img and displays only extra
        js:	function(dir){ //Copied from Webtoon's entry. Thanks to who ever did that
				// Makes it so anything within extra will be nav-clickable
				var elemImagen = document.querySelectorAll('#wcr_extra');
				setEvt(elemImagen, 'click', imgClick);
				setEvt(elemImagen, 'mousemove', imgCursor);
				},
	},
	{	url:	'dhscomix.com/bcomics|dhscomix.com/dcomics|dhscomix.com/decomics|dhscomix.com/dfcomics|dhscomix.com/dhscomics|dhscomix.com/fcomics|dhscomix.com/jcomics|dhscomix.com/kcomics|dhscomix.com/lcomics|dhscomix.com/mercomics|dhscomix.com/ocomics|dhscomix.com/pcomics|dhscomix.com/scomics|dhscomix.com/tcomics|dhscomix.com/wcomics', //All the other DHS Comix Comics
		img:	['//div[@id="content"]//img'],
        extra:	[['//div[@id="content"]']],
		back:	'img[contains(@src, "previous")]',
		next:	'img[contains(@src, "next")]',
        //Work around for multiple comic images on a page
        style:  '#wcr_imagen{display: none !important;}\ndiv#content p:nth-child(1){display: none !important}', //Hides img and displays only extra
        js:	function(dir){ //Copied from whoever did Webtoon's entry
				// Makes it so anything within extra will be nav-clickable
				var elemImagen = document.querySelectorAll('#wcr_extra');
				setEvt(elemImagen, 'click', imgClick);
				setEvt(elemImagen, 'mousemove', imgCursor);
				},
	}
	// End of sites
	/*
	,
	{	url:	'',
		img:	'',
		back:	'',
		next:	''
	}
	,
	{	url:	'',
		img:	'',
		back:	'',
		next:	'',
		first:	'',
		last:	'',
		extra:	[[['']]],
		fixurl:	function(url, img, link){
				},
		js:		function(dir){
				},
		scrollx:'R',
		xelem:	'',
		layelem:'',
		txtcol:	'',
		bgcol:	'',
		style:	'',
		layout:	true
	}
	*/

];

/* xpath:
	X = element X
	@A = attribute A
	* = wildcard
	. = self, innerHTML when used in conditions, use /text ()to return the text
	X[Y] = X that complies with Y (Y can reference attributes or children)
	X[num or last()] = the X which is the n-th child of his father
	.. = parentNode
	/ = son
	// = descendant
	contains(x, y) = x.indexOf(y)>=0
	starts-with(x, y) = x.indexOf(y)==0
	name() = tag name IN UPPER CASE
	X | Y = what matches the xpath X or the Y
	http://xpath.alephzarro.com/content/cheatsheet.html
	http://www.zvon.org/xxl/XPathTutorial/General/examples.html
*/

var imagen = new Array(); // src of the image[i]
var imagenOK = [true]; // true if image[i] is loaded
var imagen64 = new Array(); //  content of the image[i] as data:url in base64
var imgTitle = new Array(); // the alt text of the image [i]
var titulo = new Array(); // title of the page [i]
var link = new Array(); // url of the page [i]
var extra = new Array(); // extra content of the page[i]
var cache = {}; // Cache of loaded pages. Used on ajax sites.
var extraData = {}; // Extra data for usage in a site implementation

var posActual = 0; // current position relative to where it started

var prefetcheado = new Array();
prefetcheado[-1] = prefetcheado[1] = 0;

var layoutDefault =
	'<div id="wcr_div" style="text-align:center">'+
		'<style id="wcr_style" type="text/css">#wcr_div button{float:none;}</style>'+
		'<img id="wcr_imagen"/><br/>' +
		'<div id="wcr_title"></div>' +
		'<div id="wcr_extra"></div>' +
		'<div id="wcr_botones">'+
			'<br/><div>'+
				'<a id="wcr_first" href="#">&lt;&lt; First</a> '+
				'<button id="wcr_btn-1">Back</button> '+
				'<button id="wcr_btn1">Next</button> '+
				'<a id="wcr_last" href="#">Last &gt;&gt;</a>'+
			'</div><br/>'+
			'<div>'+
				'<button id="wcr_btnaddbm" style="background-color:#0f0">Remember this page</button>'+
				'<select id="wcr_pages" autocomplete="off"><optgroup label="Preloaded pages"/></select> '+
			'</div>'+
			'<div id="wcr_listabm"></div>'+
			'<div id="wcr_div_listabm_todos" style="display:none">'+
				'<br/><a id="wcr_toggle_bm" href="#toggleBms">See bookmarks for other sites</a>'+
				'<div id="wcr_listabm_todos" style="display:none"></div>'+
			'</div>'+
			'<div id="wcr_ultimavisita"></div><br/>'+
			'<div>'+
				'<button id="wcr_btnfit">Enable Fit-to-screen</button> '+
				'<button id="wcr_btnlayout">Use Original Layout</button> '+
				'<button id="wcr_btnslide">Start Slideshow</button> '+
				'<button id="wcr_btnsettings">Settings</button>'+
			'</div>'+
		'</div>'+
		'<div id="wcr_imagenes" style="display:none"></div>'+
		'<div id="wcr_links_imgs" style="display:none"></div>'+
	'</div>';

// instead of replacing the body.innerHTML, put the `layoutdefault` where the image was and leave the rest of the page intact
function layoutIntacto(){
	// make the links to the previous pages / sgte work like the back / next buttons
	if(confBool('overwrite_links', true)){
		try{
			var next = contenido(document.documentElement.innerHTML, getNext, 0);
			var linksNext = xpath('//*[@href="'+next+'"]', document, true);
			for(var i=0;i<linksNext.length;i++){
				linksNext[i].href = '#next';
				setEvt(linksNext[i], 'click', btnnext);
			}
		}catch(e){}
		try{
			var back = contenido(document.documentElement.innerHTML, getBack, 0);
			var linksBack = xpath('//*[@href="'+back+'"]', document, true);
			for(var i=0;i<linksBack.length;i++){
				linksBack[i].href = '#back';
				setEvt(linksBack[i], 'click', btnback);
			}
		}catch(e){}
	}

	// replace the image with the default layout
	var img;
	if(layoutElement) img = xpath(layoutElement);
	else{
		img = contenido(document.documentElement.innerHTML, getImagen, 0);
		var src = typeof(img)=='string' ? match(img, /src="(.+?)"/i, 1, img) : xpath('@src', img);
		try{ img = xpath('//img[@src="'+src+'"]'); }
		catch(e){ img = xpath('//img[@src="'+decodeURI(src)+'"]'); }
	}

	var padre = img.parentNode;
	var div = document.createElement('div');
	div.innerHTML = layoutDefault;
	padre.insertBefore(div, img);
	padre.removeChild(img);

	// if I am inside a link, I delete it
	while(padre){
		if(padre.href){
			while(padre.childNodes.length) padre.parentNode.insertBefore(padre.childNodes[0], padre);
			padre.parentNode.removeChild(padre);
			break;
		}
		else if(padre == document.body) break;
		padre = padre.parentNode;
	}

	get('wcr_btnlayout').innerHTML = 'Use Minimalistic Layout';
}

function layoutMinimo(){
	var elems = selCss('#AMRBar,#bookmarkData,#bookmarkPop,#navAMRav', document, true);
	if(elems.length){
		var keep = [];
		for(var i=0; i<elems.length; i++){
			var elem = elems[i];
			while(elem != document.body){
				keep.push(elem);
				elem = elem.parentNode;
			}
		}
		for(i=0; i<keep.length; i++){
			var padre = keep[i].parentNode;
			var k=0;
			for(var j=padre.childNodes.length; j; j--){
				var n = padre.childNodes[j-1];
				for(k=keep.length; k; k--) if(n==keep[k-1]) break;
				if(!k) padre.removeChild(n);
			}
		}
		var div = document.createElement('div');
		div.innerHTML = layoutDefault;
		document.body.appendChild(div);
	}
	else document.body.innerHTML = layoutDefault;
}

// [/regexp/, group], ['xpath'], or 'literal' to find the corresponding content
var getImagen = false;
var getBack = [/<a [^>]*href *= *"([^\"]+)"([^<]|<[^\/]|<\/[^a])*(back(?!ground)|prev)/i, 1];
var getNext = [/<a [^>]*href *= *"([^\"]+)"([^<]|<[^\/]|<\/[^a])*next/i, 1];
var getFirst = [/<a [^>]*href *= *"([^\"]+)"([^<]|<[^\/]|<\/[^a])*first/i, 1];
var getLast = [/<a [^>]*href *= *"([^\"]+)"([^<]|<[^\/]|<\/[^a])*(last|latest|newest|today)/i, 1];
var getExtras = false; // (optional) getters array to put them in the extra div
var bgColor = false, txtColor = false; // (optional) force background / text color
var funcionJs = false; //(optional) execute a function after displaying a page
var scrollx = confVal('scrollx', 'L'); // where to auto scroll the page (L / M / R of the image, or pixels)
var scrolly = confVal('scrolly', 'U'); // ditto (U/M/D)
var extraElement = false; // where the extra is put when the full layout is used
var fixUrl = false; // f (url, origin (link / img)) that is applied to the links and src of the image, for rare pages (eg, in sinfest the link in the www points to the non-www and the non-www redirects to the www)
var layoutElement = null; // where everything is put when using the full layout
var style = ''; // content of a <style />
var onerr = function(url, img, num){
	if(num) return null;
	return {img: img};
}; // f(url of the page, url of the img, retry num (0..n)) returns {url: alternative page, img: alternative img} to retry after an error

//keyboard default settings
var teclado = defaultSettings.keyboardShortcuts;

//shrink or enlarge the image to fit on the screen
var fitSize = confBool('fit', defaultSettings.autozoom);
var achw = confBool('achw', defaultSettings.shrinkWidth), achh = confBool('achh', defaultSettings.shrinkHeight);
var agrw = confBool('agrw', defaultSettings.expandWidth), agrh = confBool('agrh', defaultSettings.expandHeight);

var maxScale = confVal('maxScale', 0) * 1;
var minScale = confVal('minScale', 0) * 1;
var maxScaleReset = confBool('maxScaleReset', false);
var minScaleReset = confBool('minScaleReset', false);

var bordex = confVal('bordex', defaultSettings.borderLR); //edge to the sides of the image
var bordey = confVal('bordey', defaultSettings.borderUD); //edge up and down

var scrollRate = parseInt(confVal('scroll_rate', 50)); //edge to the sides of the image
var dimScreen = confVal('dim', '0');

var colOK   = 'rgb(204, 238, 204)'; //green
var colWait = 'rgb(238, 238, 238)'; //gray
var colLoad = 'rgb(238, 238, 204)'; //yellow
var colFail = 'rgb(238, 204, 204)'; //red

var cursores_custom = {
	'1': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAABYdJREFUWIXtll+IXFcdxz+/c86dO3dmJ7ubNsaG1FhZW7fVBpvY1BJ8ia0PrRWpSgNWpT4Ilap5EB+aB0EqvimKYKONVUFBaKiCUCwohtQKeailtQQTa9Jsmmx2Zje7szsze+89v58PM7PJJs0m/kMf8oPDmcM9/L6f8/uePwPX4lr8j8P/M5Mnd0386IbJDZ8aDevfk/fyVp7nM/8tsEvivR+dOPBi+3fWitP2TOtpu/vz2w/9J/KGq5k0cdeWJ7/1w29+fFttJ2rKu5JJet1OAmzMyJJIrIVaVquntRGwhvPWkCAZUMvqWb2yLjQoWG6dWni5OTd9GDg7zC1XEn/HbZv3Pv7sV77xic2fo7QcJ54TnWM8+dz3aMgYlSwQqp5qNSNkniQNVNMqPvGklZQkVAg+kK1PaZ2d5S9/OsJ3d//s9qJYeuWKAJs2b3rkC88+9NRn3/0o3WIJw4EozhzBJ9jKTMOs34OBcv6bGeI9o/VRgg/89uSv+fRNX7w3svz8mhaMj4/f98mf3PPUA+98iNOLU5gAppgKaoZcsXYr+vjgkMwI5ukVPby3JEYcoG8JkIVs+337dv7q/skHeXPxJJhhppgJZoaZoarIVVCYGSEJ1GOGiCcnX/X9LQDSiY98/4N/uP/Oj/nphTN9MeuXdihuMWIYqnLew1U/LjDHjCRJWK9jOBy5La8JcP09T9xxcNeuXbVme4YY44pwjAARi0ZUGBotCIhQxJx23qaIyzjnGUkaVEMGGEmssKgbcebI9fIA1Q99edvBnQ/uuGGhvYBaxNSIGlE1TBU17eua0S16nF08TbMzzUz3DPO9eYzB3jBQjHqos6lxIzdvvI2bdAuiQnm5Cuz4zNbnGruZfOHE70GFIAl1N0Lma5j2Pc+LnNluk7lOk/ZyG439fSA4vPfIRYcq15zXzx3ldDHF224Zo2GjdOLSQDZfBVBZd2t6V5F3KaxEVenEJeZikzKWxKhoqUSNWFQ0Gk48/eUORO2880MMEcHhCBKIUjJfzrGgi6sg3aBPDj3+ysP2WlVd4jAzxPqZBI/D45zgncMFj0sgJA5XEVxiuMSQYIjvN3OGyfBuGPJdjLcaIO/G7qHDe47uqczUkeD6fht4Z7gg+IonqXpCFZLM4+oQRjyh4QgjjsqIJ9Q9PhN8KrjE9aEETM6TXGzT0IICmDvXPXfg8KPHx+98esvXF9N5KAwRj0hEnMMEnAuoi3hzRAwkIAYaFYuCRaAUYqlo0R+H4PH4S1Z/IQBAD5htzp7d/+pj1fVbf/z2Ly2GWRTFe49LDPOgHtQZJY5k4JMZmDqsNKwEzQVfCrpsxFxxiZC6CiqGWyn6pQAAXWD2jRNvfLu6J9nwvn0bdre1hXpFKmDBYd5Q5/q7X9zQYEzBSkXLgBaG9owyNaQHFefIXErpFC9+TQADOkDrry//bW/4anLdtn0b723aNEVYJoY42GggYjgHblABFDQKrhC0AE1BlqFMhATHuFtH1+fMyvyaAEOIJcC9dvDIY9nXbv/pHT/YtOOkHQcP4h1ZSJloT9KcWyBWCtRHokQKKykoiCjRRcqkf3RTaiwkixQ+0tEeAjoUW+s1ccAocOPdj7z/l1u/s+6WY3YU7zyNrMap3aN/P/Kb1/cnWVJ1IWQhUA31UEsynyU1V5PMpz6TzGcuTdcltarPitN/bh1tHTv30szc9H6gyeVew0EosABM/XH/Sw9Xrv/AgZuf2LK55ZtcJ2O8Wdf52U7z53TQCxbiBk0u6of5ikF124Pxlf8R0bdpDMKtH967/Zl6LZUzr84fP/VC8xdTJ6b20T89w1wXXI2rxsMnMgLloK1MuppIgPFBS+lf5HPA7GBV/3JcLQD0K1GlX9I4gPi3xK/F/0X8A9KAi5v8bApEAAAAAElFTkSuQmCC',
	'2': 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAABYRJREFUWIXtlVuMXWUVx39rfXufM9feZnoZ0URISWgVi1KkKg/GJvog4ihG5YHEoCnEBAMPPNUHE0WNL14SH9BYBR/qS4mamHhBIk21IoKpBLBja6RtJu3cZ86cfTn7+77lwz4zHc4gnZgSX7qS7+zvXPb6/771X2sfuBbX4v8ccjWSDA0N7R1729h43/W615eheOX3Z75wNfJuON7/+f0njs3+xGbDJTvZetre+bHdT2703qTn/Y7RrTtvG7lu0z5Smp0l38rbeRvIzFseg7RAWu0yW/ZZnjlclpNXRZ6lN6R7GLTN3DpwB9/84dc/8dD4I4+d+fOr928YIE0Hb/7S0Xv//o4DNzGyYxv5XIkPnsp3KDsloQoUZUFVenweKIocXwQ6uadlC4TK06oWiRZ43+YP8chPHzz06Ph3zp976cLXNgQQK79r/637+fCuu/DBs9hYxEKApsBgt1kU6p0gsrKvX32omM4ugilC5CM7xrn4+ORXHxv/2eTkhckjVwJQ5ywtqoIlP4+3wEwxRfCxK3TlMAMVQdRAlIVynrve/lnmHp/90ROf+uWl+fn5X71hBQA6dGiFFmaB2WIaX3lkAwRmhqoiIt1liChUwp177mb2B3O/OHbPUwdyn//1jQGspB0WiURms2mqquoBEMC6qpcvqoYgiHOrECB1RQrhzvd+3C1/v/3Mz+//4z4oz/x3gFiyHJaIEpkrZqiqDiAUPme5ahFjIHVNhhvDpK4BZhi22iBOQZwADudYBXHecfDgwYH2o/nx3x0++S5g5nUBvJW0QwtT4+zSBBOXXmKydZ62b6MISO21IGzu28z2/l2MDuxkx9AY/WlfLaigoogqqoJThwRBK8cdd98+Vk51jh//7vPvAYoegIQstPlXcZqWLPLMhd+Qt3NUlIZrvNZzjOXOMq3OBGcXTqNOGW4Os3VglG39ozTSRt0TKuQhox2X8VaBGsP3JHtun9/362efOPXBdRVYigsQPJZGEknqk4j02s7l8XOIGCpK4UsutSeZKi7i1KGJ4pySuATnEpxTVBQ6kU17+w8ADaDT8ySU1ROuntYAqX1e7cfX7IVEFVFQdagIqoLiELT+rXUnJVXs5b544vCL9wLpOgBZ899kYrWIM0QVcYY4ut7W3680nwokOETAiQMUQXBiYEIkkiQpjelBTj488XAe8hNAZ50FKxAOR5I4tE8QB5qCSxwkhrgaRp3DpC6RQxBRNDpcVMQUi6DmMAOXOgY7w/zli//+ykK+8CQwD1TrABQllaQuYVNIVHANRZuCJoI2DEkUSQTRFRsMMyFB0ahoUCQosRIIdc4ht4VTD1z83szc1BFgju4ErANw4mhqg0SVRr9SNRXtU5JU0D5BU0GTLoSutgxmRmKKRkGCIl6wjqBBGdYRXjw0ffTcq+e+3RXP12r2AAhDboB+bZAO1m2U9AmuKWijBpAUtLYZEYgYMRpiEQuRGALOO9Jmk1HZyfOHZn47cersl4FZIGPtMK0FEIhZLMj6cirt0GwMYNT+Jao4HA4l9SlpSHDm0OBwnZTRTZs4M/wKuS+xYCRBeKu8hRcemH/25eP/eLAr3u4V53IRUWB0+9ad943s3vLusVtGbixCnpZLVRbyWIbccstDWWUxq/KQ+7bPvKeI3udVXhU3ffSG+647unh9K88IMbBbbuTUQ0un/3Tkb58GzgOLQOwVXwsA0A9sAQapZ1S7n8cu+drrSjID9AOfu+3YzT/WW6ZtjpEwysRhf+EP33ruk8DZrnh4PXEAt2bvqbtzGWh1b1xYsxaBpZ7VAjo2r2n7uebIwMT25tRTPnv6Gy98BuI/ryTeW4H/NVJgG7CV+vFaUs/56qy/2QArEA3qikbqSvqrlPtavLnxH1JHdHLMfy8nAAAAAElFTkSuQmCC',
	'3': confVal('cursor_custom_3', false),
	'4': confVal('cursor_custom_4', false),
	'5': 'iVBORw0KGgoAAAANSUhEUgAAABsAAAApCAYAAADEZlLzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAAC10lEQVRYR+2V7UvTURTHfWYqCP5dvRYsytJCdFagWRkOLU1dayaJNSHRVJYltnQ+Zj7NhyJxYWaZ+ZtmtuWeik2de/52z019kQYzN1/9Dhzuiwv3c7/fc869UVFiiA6IDogOiA6IDogORKWkpODYbIiJiSHYsQHhdDqPBxgdHY3t7W1sbm5GHkiwra0tDqRITU2NnKUEW19f5yCj0Qiz2YzExMTIAAlGIQgCX4PBYORqSDC/388hXq8Xdrudq6PY6dTwTQbB6HBKAhLY4/EgEAhweFjHYtdGUmK1WnlXWiwWuN1uOBwODpZIJOGpIcHoYJPJxFcKUkeKkpOT+RobGxs2hXC5XDzj4+N5zUhNpDoSPp9vrxkSEhL2RuFI9ZqzuNA3a0Dve8NeDQ6wiNeNhvy/unFqxY0bqm6cLFZB1jQKqfIFTlyuw231O5CSv3s7Li6OqyXgodT1f3TgTEkzrjwcQmZVB/LrRyHXCsi9P46MiiGUNOoP6jRsbGzwTEpKCq0TlzzAVdUgLtzpZgdrUNT6GsMWYOIXoOhdQXbNBNKuq6FsGdx34O5IEDCkP29Y8OB0aRukNa9Q0DAJzZIb9Cg9X3LiXHU7zrJLZFd1Iudm/YHqbDZb6L/BA+08sso1yL07gDdMzQoDzbOcDQA6uws69ipN24A5K9tzYh9wR1FoNipaJpEn70HpYz3mXMBXBvrG8gvLNZbfWRq8wA96PYL7YYd6FDWTAi5VMmWVWlQ+0WPa/gfQODaDDFkdCpUDKK4dQVH1Uwzol0NT8K8bCD+Bi+VqSBlQquhCmVqHD+yPJKCyfQanCtXIu9WJIkXL0UB0AcHsx7ORReTf60R6cTPOM2B1vwGPpqyQtc4gq6obORVtePvJdHQYARctQTQNLqCgrh9pslakl3UgQ65FprwL1xp0aHw5Hx7Qrr1GNm8Tyz40j6+htu8zansW0DS2ivHV4KFAvwES0XcvxVHSmgAAAABJRU5ErkJggg==',
	'6': 'iVBORw0KGgoAAAANSUhEUgAAACUAAAApCAYAAACyXOB4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAAC5klEQVRYR+2W2U9TQRSH2cOSkPB3+UyCRlHQEBY1AVExNKAgUGuRSFBIJCCQihKsUFaRrSwaCTWIKCK3VMRWumlaoHSh/TlnpI0S4hPt5eGe5GQe55tvzjkzUVFSSAYkA5IByYBkQDIgGZAMiGogNTUVogIctnlMTAxBHTswOJ3O4wUWHR2N3d1dbG9vHx8wgtrZ2eFgFGlpaeJfJUFtbm5yIKPRCLPZjKSkJHHBCIpCEAS+BgIB8WuMoPb29jiM1+uF3W7ntij2OzPyE4OgCIKSwAjQ4/HA7/dzSFHGRfD6yIzVauVdaLFY4Ha74XA4OGBiYmJka4ygCMBkMvGVgmyRoZSUFL7GxsZG3BhcLhfP+Ph4XlNkR+wOhM/nCxV1QkJCaESIUk/UVodcDa8rGqb/676B93oMLuixaHEdfb2RmYM9HxcXx+0R2EFbt1XvcOJyA/KVLyBrncDJ0kbcaOzDrMF99HAHwLC1tcUzOTk5tFlZiw6ZVaPIuz8FuUZAYdMEsmq6ceXhKM6UtWHooyO8YMFRQWD051K2jyD9ugo5ddNQDBgw/QsYswAlHa8ZqBoX7vThauMIVj0IKxhsNlvo95B7swk5NT04yzY/V9uF56tO0MOkXnWjqHkG+XWvcLq8E2OCJ6xQUfu/UhicwKIVmLMBWvYCae0uLPiBJQZlYPmGWcu7O4zsSjUeaJbCCxWsM2sA+ME213uB72zdYPmF5TeWX1kuuoDyxzoUyPuhaJ+JDNSwbg0ltU9RWj+OYuUwMmUNaJmc54BzdqD6iQ551RpcqlZDPSNEBoqMlSjaUXCrB6eKVVB2/QH6wP6FFSot8hW9yGdAFytVEH6Gt9D/mRJvP5mQW9WJ7Jo+yDrm8WjWitohPc4zoIzSNhTe68Gz8RUIZv5uRi5aXi7hWrMWWfJeZMo1yKjoRrqsA0UNQ2gdWcaKJRBZoODRp9YDaJ1cR33/MuoHP6NtagPTaz4Y/5pPvwHk5XcvVBI4VwAAAABJRU5ErkJggg=='
};
var ultimoevt = null; // in which half of the image the cursor was stopped the last time
var listabm = [];
var listabmTodos = null;
var elemImagen = null;
var slider = 0; // = setInterval(slideshow, secs);
var flipControls = false; // invert arrows / clicks / buttons for sleeves or others that are read backwards
var clickImgNavigates = confBool('clickImgNavigates', true);

function run_script(){
	try{
		if(useHistoryAPI && history.pushState){
			setEvt(window, 'popstate', function(evt){
				if(evt.state && evt.state.wcr_url){
					var dir = (link[posActual+1] == evt.state.wcr_url) || -(link[posActual-1] == evt.state.wcr_url);
					if(dir*dir == 1) cambiaPag(dir, true);
					else redirect(evt.state.wcr_url);
				}
			});
		}

		var p = getConfPagina();
		if(p){ // if it is disabled this page p === null, if it is not always an object
			link[0] = document.location.href;
			listabm = getListaBookmarks();
			if(goToBookmark && listabm.length == 1 && listabm[0].url.split('#')[0] != link[0].split('#')[0] &&
				confirm('Go to last saved page?\n'+
					listabm[0].title+'\n'+
					listabm[0].url+
					'\n\n(This confirmation dialog can be disabled in the script settings)')){
				redirect(listabm[0].url);
				return;
			}
			listabmTodos = getListaBookmarksTodos();

			if(p.img) getImagen = typeof(p.img) == 'string' ?
				['//img[starts-with(@src,"'+p.img.replace(/\|/g, '") or starts-with(@src,"')+'")]'] : p.img;
			if(p.back) getBack = typeof(p.back) == 'string' ? ['//a['+p.back+']/@href'] : p.back;
			if(p.next) getNext = typeof(p.next) == 'string' ? ['//a['+p.next+']/@href'] : p.next;
			if(p.first) getFirst = typeof(p.first) == 'string' ? ['//a['+p.first+']/@href'] : p.first;
			if(p.last) getLast = typeof(p.last) == 'string' ? ['//a['+p.last+']/@href'] : p.last;
			if(p.extra) getExtras = p.extra;
			if(p.bgcol) bgColor = p.bgcol;
			if(p.txtcol) txtColor = p.txtcol;
			if(p.js) funcionJs = p.js;
			if(p.scrollx) scrollx = confVal('scrollx', scrollx, p.scrollx);
			if(p.scrolly) scrolly = confVal('scrolly', scrolly, p.scrolly);
			if(p.xelem) extraElement = p.xelem;
			if(p.layout !== undefined) keepLayout = confKeepLayout(keepLayout, p.layout);
			if(p.fixurl) fixUrl = p.fixurl;
			if(p.layelem) layoutElement = p.layelem;
			if(p.style) style = p.style;
			if(p.onerr) onerr = p.onerr;

			if(!getImagen){
				// if you had no special conf, try to automatically recognize the image ...
				var next, back, html = document.documentElement.innerHTML;
				try{next = contenido(html, getNext, 0);}catch(e){}
				try{back = contenido(html, getBack, 0);}catch(e){}

				if(next || back){
					var subs = ["", "/comics/", "/comic/", "/strips/", "/strip/", "/archives/", "/archive/", "/wp-content/uploads/", "comics", "comic", "strips", "strip", "archives", "archive", "/manga/"];
					for(var s = 0; s < subs.length; s++){
						var query = '//img[contains(@src, "'+subs[s]+'")]';
						try{
							var imgs = xpath(query, html, true);
							if(imgs && imgs.length == 1){
								getImagen = [query];
								break;
							}
						}catch(e){}
					}
				}
			}

			if(getImagen) iniciar();
			else{
				if(defaultSettings.showSettingsOnFail) mostrarSettings();
				else error('no settings found for this site');
			}

			if(GM_registerMenuCommand){
				GM_registerMenuCommand('Webcomic Reader - Disable for this site', function(){
					if(confirm('Are you sure you want to disable Webcomic Reader on this site?\n'+
						'(It can be re-enabled later with this menu)')){
						setData('confpag', 'dis');
						redirect(link[posActual]);
					}
				});
			}
		}
		else if(GM_registerMenuCommand){
			GM_registerMenuCommand('Webcomic Reader - Enable for this site', function(){
				delData('confpag');
				redirect(link[posActual]);
			});
		}
	}catch(e){ error('loadpag: ', e); }
}

// Disables common scripts that breaks WCR
function fixbadjs(){
	try{
		var uw = typeof unsafeWindow !== "undefined"?unsafeWindow:window;
		// breakbadtoys is injected by jumpbar.js from TheHiveWorks
		// killbill and bucheck are injected by ks_headbar.js from Keenspot
		var badFunctions = ["breakbadtoys2", "killbill", "bucheck"];
		for (var i = 0; i < badFunctions.length; i++) {
			var name = badFunctions[i];
			if (typeof uw[name] !== "undefined") {
				console.log("Disabling anti-wcr code");
				uw.removeEventListener("load", uw[name], true);
				uw[name] = function() {};
			} else {
				Object.defineProperty(uw,name,{get:function(){return function(){}}, configurable: false});
			}
		}
	} catch(e) {
		console.error("Failed to disable bad js:", e);
		//console.error(e);
	}
}

// set the new html and fill it with the data of the current page, apart from prefetching the one in front and back
function iniciar(){
	try{
		fixbadjs();
		if(firstRun && confirm(
			'This seems to be your first time using Webcomic Reader. '+
			'Do you want to look at the settings?\n'+
			'(You can change them at any time with the settings button or the option in the Greasemonkey menu)'))
			mostrarSettings();

		setear(document.documentElement.innerHTML, 0, 0); // set the content of the initial page
		if(imagen[0] === null) return;

		var first, last;
		try{ first = getLink(document.documentElement.innerHTML, getFirst, 0); }
		catch(e){ error('first: ', e); }
		try{ last = getLink(document.documentElement.innerHTML, getLast, 0); }
		catch(e){ error('last: ', e); }

		if(keepLayout) layoutIntacto();
		else layoutMinimo();

		var sombrear = dimScreen=='I' ? 'wcr_imagen' : (dimScreen=='S' ? 'wcr_div' : '');
		if(sombrear){
			var sombra = document.createElement('div');
			sombra.setAttribute('style', 'opacity:0.8; position:fixed; z-index:2322; background:#000; top:0; left:0; right:0; bottom:0; pointer-events:none;');
			var sombreado = get(sombrear);
			sombreado.style.position = 'relative';
			sombreado.style.zIndex = '2323';
			sombreado.parentNode.insertBefore(sombra, sombreado);
		}

		if(!showButtons) get('wcr_botones').style.display = 'none';

		// stop using scroll * for the border, use border *
		if(typeof(scrollx)=='number' && scrollx){
			bordex = scrollx<0 ? -scrollx : scrollx;
			scrollx = scrollx<0 ? 'R' : 'L';
		}
		if(typeof(scrolly)=='number' && scrolly){
			bordey = scrolly<0 ? -scrolly : scrolly;
			scrolly = scrolly<0 ? 'D' : 'U';
		}

		if(scrollx == 'R' && confBool('flipControlsManga', false)){
			flipControls = true;
		}

		elemImagen = get('wcr_imagen');

		if(bordex){
			elemImagen.style.paddingLeft =
			elemImagen.style.paddingRight = bordex + 'px';
		}
		if(bordey){
			get('wcr_div').style.paddingBottom =
			get('wcr_div').style.paddingTop = bordey + 'px';
		}

		if(first) get('wcr_first').href = first;
		else get('wcr_first').style.visibility = 'hidden';
		if(last) get('wcr_last').href = last;
		else get('wcr_last').style.visibility = 'hidden';

		if(bgColor){
			get('wcr_div').style.backgroundImage = 'none';
			get('wcr_div').style.backgroundColor = bgColor;
		}
		if(txtColor) get('wcr_div').style.color = txtColor;

		if(style) get('wcr_style').innerHTML += style;

		if(fitSize) get('wcr_btnfit').innerHTML = 'Disable Fit-to-screen';

		for(var i=0;i<listabm.length;i++) addLista(listabm[i]);
		if(listabmTodos){
			var html = '<table align="center">';
			for(var sitio in listabmTodos){
				var lista = listabmTodos[sitio];
				html+='<tr><td rowspan="'+lista.length+'">'+sitio+'</td>';
				for(i=0; i<lista.length; i++){
					if(i) html+='<tr>';
					html+='<td><a href="'+lista[i].url+'" title="'+lista[i].url+'">'+lista[i].title+'</a></td></tr>';
				}
			}
			html+='</table>';
			get('wcr_listabm_todos').innerHTML = html;

			setEvt('wcr_toggle_bm', 'click', function(e){
				var lista = get('wcr_listabm_todos');
				lista.style.display = lista.style.display == 'none' ? '' : 'none';
				e.stopPropagation();
				e.preventDefault();
			});
			get('wcr_div_listabm_todos').style.display = '';
		}

		getUltima();

		teclado = getTeclas();

		document.onkeydown = null;
		document.onkeyup = null;
		setEvt(window, 'keydown', teclaHandler);
		setEvt(window, 'keyup', keyupHandler);
		setEvt(window, 'resize', fitImagen);
		setEvt('wcr_btn1', 'click', btnnext);
		setEvt('wcr_btn-1', 'click', btnback);
		setEvt('wcr_pages', 'change', btnjump);
		if(clickImgNavigates){
			setEvt(elemImagen, 'click', imgClick);
			setEvt(elemImagen, 'mousemove', imgCursor);
		}
		setEvt(elemImagen, 'load', function(){
			fitImagen();
			scrollear();
		});
		setEvt('wcr_btnaddbm', 'click', addBookmark);
		setEvt('wcr_btnfit', 'click', toggleConfFit);
		setEvt('wcr_btnlayout', 'click', toggleConfKeepLayout);
		setEvt('wcr_btnslide', 'click', slideshow);
		setEvt('wcr_btnsettings', 'click', mostrarSettings);
		//setEvt(window, 'touchstart', touchstart);
		//setEvt(window, 'touchend', touchend);

		var imgelem = document.createElement('img');
		imgelem.id = 'wcr_imagen0';
		imgelem.src = imagen[0];
		get('wcr_imagenes').appendChild(imgelem);

		agregarLink(0);

		cambiaPag(0);
		prefetch(1, 1, prefetchSizeStart[1]);
		if(link[1] || prefetchNoNext){
			prefetch(-1, -1, prefetchSizeStart[0]);
		}
		else{
			disableBtn(-1, false);
			setCol(-1, colOK);
			imagen[-1] = null;
		}
	} catch(e){
		error('init: ', e);
		if(defaultSettings.showSettingsOnFail) mostrarSettings();
	}
}

// set the image and link as global vars to update
function setear(html, pos, dir){
	try{
		var pag = document.createElement('div');
		pag.innerHTML = html;

		var img = contenido(pag, getImagen, pos);
		var src;
		if(typeof(img)=='object'){
			src = xpath('@src', img); //img.src absolutiza la url basandose en la pag inicial
			imgTitle[pos] = img.title;
		}
		else{//getImagen es regexp q retorna el elemento <img .../> o directamente su url
			src = match(img, /src *= *"(.+?)"/i, 1, img);
			imgTitle[pos] = match(img, /title *= *"(.+?)"/i, 1, null);
		}
		if(fixUrl) src = fixUrl(src, true, false, pos);
		imagen[pos] = absUrl(src, pos);

		if(pos){
			var poslink = pos+dir;
			try{ link[poslink] = getLink(pag, dir > 0 ? getNext : getBack, pos); }
			catch(e){
				link[poslink] = null;
				error('set['+pos+']/link['+poslink+']: ', e);
			}
		}
		else{
			try{ link[1] = getLink(pag, getNext, pos); }
			catch(e){
				link[1] = null;
				error('set['+pos+']/link[1]: ', e);
			}
			try{ link[-1] = getLink(pag, getBack, pos); }
			catch(e){
				link[-1] = null;
				error('set['+pos+']/link[-1]: ', e);
			}
		}

		try{ titulo[pos] = xpath('//title', pag).innerHTML; }
		catch(ex){
			try{ titulo[pos] = match(html, /<title>(.+?)<\/title>/i, 1); }
			catch(e){
				try{ titulo[pos] = match(html, /document.title = '([^']+?)'/, 1); }
				catch(e){
					error('set['+pos+']/titulo: ', e);
					titulo[pos] = link[pos];
				}
			}
		}

		// Update list of pages
		try {
			var pagelist = "";
			var indices = Object.keys(titulo).sort(function(a,b){return a-b;});
			for (var j = 0; j < indices.length; j++) {
				var i = indices[j];
				if (!isNaN(i)){
					pagelist += '<option value="'+ i +'" title="'+link[i]+'"' +
						(i==posActual?" selected":"") + '>' +
						titulo[i]+"</option>";
				}
			}
			get("wcr_pages").children[0].innerHTML= pagelist;
		} catch(e) {error('set['+pos+']/dropdown',e);}

		extra[pos] = '';
		if(getExtras){
			for(var i=0;i<getExtras.length;i++){
				try{
					var x = contenido(pag, getExtras[i], pos);
					if(typeof(x)=='object') x = outerHTML(x);
					extra[pos] += x;
				}catch(e){error('set['+pos+']/extras['+i+']: ', e);}
			}
		}

		if(dir) get('wcr_btn'+dir).innerHTML = (dir>0?'Next':'Back')+' ('+((pos-posActual)*dir)+(link[pos+dir]?'':'!')+')';
	}
	catch(e){
		error('set['+pos+']: ',e);
		imagen[pos] = null;
		if(dir){
			get('wcr_btn'+dir).innerHTML = (dir>0?'Next':'Back')+' ('+((pos-posActual)*dir-1)+'...)';
			if((pos-posActual)*dir == 1) get('wcr_btn'+dir).title = link[pos] + ' (image not found)';
		}
	}
}

// return the link, and if <a> is matched, return the href
function getLink(pag, getter, pos){
	var linkpag = contenido(pag, getter, pos);
	if(linkpag && typeof(linkpag)=='object' && !linkpag.href) //array[url, postdata] or array[showUrl,usedUrl]
		return linkpag;
	if(linkpag && linkpag.href) //<a href=...>...<a/>
		linkpag = linkpag.href;

	if(fixUrl) linkpag = fixUrl(linkpag, false, true, pos);
	linkpag = absUrl(linkpag, pos);
	if(linkpag == link[pos]) return null;
	return linkpag;
}

// convert a relative url to absolute based on the url of a position
function absUrl(url, pos){
	if(!url.indexOf('javascript:')) return null;

	url = decodeURI(url.replace(/(^|[^#])#([^#].*|$)/, '$1').replace(/^\.\//, '').replace(/&amp;/g,'&')).trim();

	if(!url) return null;
	if(!url.match(/^\w+:/)){ // relative path
		var base = link[pos];
		try{ base = xpath('//base/@href'); }
		catch(e){}

		if(url.indexOf('/') === 0){
			if(url.indexOf('//') === 0) url = base.match(/^\w+:/) + url;
			else url = base.match(/^\w+:\/\/[^\/]+/) + url;
		}
		else if(url.indexOf('##') === 0)
			url = base.split('##')[0] + url;
		else{
			var ipars = base.indexOf('?');
			if(ipars < 0) ipars = base.length;
			if(url[0] == '?') return base.substr(0, ipars) + url;
			base = base.substr(0, base.lastIndexOf('/', ipars));
			while(url.indexOf('../') === 0){
				url = url.substr(3);
				if(!base.match(/:\/\/[^\/]+$/)) base = base.substr(0, base.lastIndexOf('/'));
			}
			url = base + '/' + url;
		}
	}
	return url;
}

// show the image coming in this direction and prefetch the future link
function cambiaPag(dir, poppedState, slidden){
	try{
		if(dir && imagenOK[posActual+dir]===undefined && imagen[posActual+dir]!==null &&
			(!moveWhileLoading || imagen[posActual+dir]===undefined)) return;
		if(imagen[posActual+dir]===null && link[posActual+dir] || imagenOK[posActual+dir]===false){
			redirect(link[posActual+dir]);
			return;
		}
		posActual+=dir;

		// set the current content
		document.title = titulo[posActual];
		if(imagen64[posActual]) get('wcr_imagen').src = imagen64[posActual];
		else get('wcr_imagen').src = imagen[posActual];
		get('wcr_imagen').title = imgTitle[posActual];

		if(get('wcr_title')) get('wcr_title').innerHTML = imgTitle[posActual];
		get('wcr_btnaddbm').title = link[posActual];
		get('wcr_btn1').title = link[posActual + 1] + (imagen[posActual + 1] === null ? ' (image not found)' : '');
		get('wcr_btn-1').title = link[posActual - 1] + (imagen[posActual - 1] === null ? ' (image not found)' : '');

		// Update list of pages
		try{selCss('#wcr_pages option[value="'+posActual+'"]').selected = true;}catch(e){}

		var xel = get('wcr_extra');
		if(keepLayout && extraElement){
			try{ xel = xpath(extraElement); }
			catch(e){ error('extraElement: ' , e); }
		}
		if(xel) xel.innerHTML = extra[posActual];

		var maxok;
		for(maxok=posActual; imagen[maxok+1]; maxok++) continue;
		get('wcr_btn1').innerHTML = 'Next ('+(maxok-posActual)+(link[maxok+1]?(imagen[maxok+1]===null?'...':''):'!')+')';
		for(maxok=posActual; imagen[maxok-1]; maxok--) continue;
		get('wcr_btn-1').innerHTML = 'Back ('+(posActual-maxok)+(link[maxok-1]?(imagen[maxok-1]===null?'...':''):'!')+')';

		if(useHistoryAPI && history.pushState && !poppedState){
			var url = link[posActual];
			if(typeof(url)=='object' && url.doubleLink){
				url = url[0];
			}
			if(dir) history.pushState(
				{wcr_url: url, wcr_pos: posActual},
				titulo[posActual],
				url);
			else history.replaceState(
				{wcr_url: url, wcr_pos: posActual},
				titulo[posActual],
				url);
		}

		try{ if(funcionJs) funcionJs(dir); }
		catch(e){ error('js('+dir+'): ', e); }

		saveUltima();
		setCursores();

		if(slider && !slidden) slideshow();

		if(dir){
			var pd = posActual+dir;

			// enable/disable buttons as appropriate
			setCol(-dir, colOK);
			if(!get('wcr_imagen'+pd) && imagen[pd]!==null) disableBtn(dir, true);
			disableBtn(-dir, false);

			var posAtras = posActual-dir*(maximgs[-dir]+1);
			var atras = get('wcr_imagen'+posAtras);
			if(atras){
				atras.parentNode.removeChild(atras);
				imagen64[posAtras] = null;
			}
			var adelante = posActual+dir*maximgs[dir];
			if(imagen[adelante] && !get('wcr_imagen'+adelante)){
				cargarImagen(adelante);
			}

			// prefetch the page that comes in this direction
			prefetch(dir, pd, prefetchSize[dir>0?1:0]);
		}
	} catch(e){ error('cambia['+dir+']: ', e); }
}

// if the conf asks for it, adjust the image to the size of the window
function fitImagen(reintentando){
	var size = winsize();
	var wihi = imgsize();
	var wi = wihi.wi, hi = wihi.hi;
	var ww = size.w - 2*bordex;
	var hw = size.h - 2*bordey;

	if(fitSize){
		if(!achw && !agrw && !achh && !agrh){
			achw = achh = true;
			scrollear();
			mostrarSettingsZoom();
		}

		if(achw && wi>ww || agrw && wi<ww){
			hi = hi*ww/wi;
			wi = ww;
		}
		if(achh && hi>hw || agrh && hi<hw){
			wi = wi*hw/hi;
			hi = hw;
			if(achw && wi>ww){
				hi = hi*ww/wi;
				wi = ww;
			}
		}

		var scale = wi/wihi.wi * 100;
		if(maxScale && scale > maxScale){
			if(maxScaleReset){
				wi = wihi.wi;
				hi = wihi.hi;
			}
			else{
				wi = wihi.wi*maxScale/100;
				hi = wihi.hi*maxScale/100;
			}
		}
		else if(minScale && scale < minScale){
			if(minScaleReset){
				wi = wihi.wi;
				hi = wihi.hi;
			}
			else{
				wi = wihi.wi*minScale/100;
				hi = wihi.hi*minScale/100;
			}
		}
	}
	if(wi && hi){
		cambiarPorte(wi, hi);
		// check if the scrollbars (dis)appear and have to recalculate
		//"retrying" to avoid possible infinite loops
		if(!reintentando && size.p!=winsize().p) fitImagen(true);
	}
	else get('wcr_imagen').setAttribute('style', '');
}

// get the original size of the image
function imgsize(){
	var img = get('wcr_imagen');
	if(img.naturalWidth) return {wi: img.naturalWidth, hi: img.naturalHeight};

	img = get('wcr_imagen'+posActual);
	return img ? {wi: img.width, hi: img.height} : {wi:0, hi:0};
}

//cambia el porte de la imagen por css
function cambiarPorte(wi, hi){
	get('wcr_imagen').style.width = wi+'px';
	get('wcr_imagen').style.height = hi+'px';
}

// scroll to the starting point of the image
function scrollear(){
	var left = 0;
	var top = 0;
	var img = elemImagen;
	var offset = img;
	while(offset){
		left += offset.offsetLeft;
		top += offset.offsetTop;
		offset = offset.offsetParent;
	}
	var size = winsize();

	var x = scrollx;
	if(x == 'L') x = left;
	else if(x == 'R') x = left + img.offsetWidth - size.w;
	else if(x == 'M') x = left + (img.offsetWidth - size.w)/2;
	else if(typeof(x) == 'function') x = x();

	var y = scrolly;
	if(y == 'U') y = top - bordey;
	else if(y == 'D') y = top + img.offsetHeight - size.h + bordey;
	else if(y == 'M') y = top + (img.offsetHeight - size.h)/2;
	else if(typeof(y) == 'function') y = y();

	scroll(x, y);
}

// calculate the size of the window without counting scrollbars
function winsize(){
	var div = document.createElement('div');
	div.style.width = div.style.height = '100%';
	div.style.left = div.style.top = '0';
	div.style.position = 'fixed';
	document.body.appendChild(div);
	var s = {w: div.clientWidth, h: div.clientHeight};
	s.p = s.w*1000+s.h;
	document.body.removeChild(div);
	return s;
}

// advance only the pages every so often
function slideshow(){
	if(slider){
		clearInterval(slider);
		slider = 0;
		get('wcr_btnslide').innerHTML = 'Start Slideshow';
	}
	else{
		var secs = Number(prompt('Enter the number of seconds for turning a page (enter a negative number to advance backwards)\n\n'+
			'Press the slideshow button, the ESC key or manually turn pages to stop', 10));
		if(secs){
			var dir = secs > 0 ? 1 : -1;
			secs *= dir*1000;
			slider = setInterval(function(){cambiaPag(dir, false, true);}, secs);
			get('wcr_btnslide').innerHTML = 'Stop Slideshow';
		}
	}
}

// prefetch the page that comes in the address dir (± 1)
function prefetch(dir, pos, prof, reintento){
	if(dir*pos<0 || !prof) return; // if I am trying to prefetch the side that I come from, or if I have finished parsing (?)

	var esSgte = pos==posActual+dir;
	if(!link[pos]){ //link null or itself counts as fail
		if(!esSgte) return; //if the next one is not the failed one, do not disable the button
		setCol(dir, colFail);
		disableBtn(dir, true);
		return;
	}

	// already passed by here
	if(pos*dir <= prefetcheado[dir]*dir && !reintento) return prefetch(dir, pos+dir, prof-1);
	prefetcheado[dir] = pos;

	setCol(dir, colWait); //gray button while not loading
	if(esSgte) disableBtn(dir, true); // and if loading the sgte, disable it

	var url = link[pos];
	var meth = 'GET';
	var pars = null;
	if(typeof(url)=='object' && url.doubleLink){ // For pages with AJAX
		url = url[1];
	}

	if(typeof(url)=='object'){
		pars = url[1];
		url = url[0];
		meth = 'POST';
	}

	function onSuccess(text) {
		setear(text, pos, dir);

		// If the urls are the same except for a "##" suffix, we don't need to re-download
		if (typeof link[pos+dir] == "string" && link[pos+dir].replace(/##.*/,"") == link[pos].replace(/##.*/,"")) {
			cache[dir] = text;
		}

		if(!esSgte || !imagen[pos]) disableBtn(dir, false);
		// if the other one was red don't enable it
		disableBtn(-dir, get('wcr_btn'+(-dir)).style.backgroundColor == colFail);

		if(imagen[pos]){
			agregarLink(pos);

			setCol(dir, colLoad); //boton amarillo mientras prefetchea

			cargarImagen(pos, dir, prof, reintento);
		}
		else setCol(dir, colOK);
	}

	if (cache[dir]) {
		var text = cache[dir];
		cache[dir] = null;
		onSuccess(text);
		return;
	}

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState == 4){
			if(xmlhttp.status == 200){
				try{
					onSuccess(xmlhttp.responseText);
				} catch(e){ error('pre['+pos+']: ', e); }
			}
			else{
				prefetcheado[dir] = pos-dir; //hago q pase de nuevo por aca
				if(esSgte){
					disableBtn(dir, true);
					disableBtn(-dir, get('wcr_btn'+(-dir)).style.backgroundColor == colFail);
					setCol(dir, colFail);
				}
				error('pre['+pos+']: status '+xmlhttp.status+' ('+url+(pars?' ; '+pars:'')+')');
			}
			setCursores();
		}
	};
	try{
		xmlhttp.open(meth, url, true);
		try{
			var enc = xpath('//meta/@content');
			xmlhttp.overrideMimeType(enc);
		}catch(e){}
		if(pars){
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xmlhttp.setRequestHeader("Content-length", pars.length);
			xmlhttp.setRequestHeader("Connection", "close");
		}
		xmlhttp.send(pars);
	}
	catch(e){
		if(e.toString().indexOf('Component returned failure code: 0x805e000a') > -1)
			alert('Error when trying to load '+url+'\nIf you\'re using AdBlock Plus, NoScript or some other extension that might be blocking the request, temporarily disable it (or whitelist this page) and try again');
		error('ajax '+url+(pars?' ; '+pars:'')+': ', e);
	}
}

function cargarImagen(pos, dir, prof, reintento){
	var img = document.createElement('img');
	img.id = 'wcr_imagen'+pos;
	get('wcr_imagenes').appendChild(img);

	function loadOK(){
		if(!dir) return;
		imagenOK[pos] = true;
		setCursores();
		setCol(dir, colOK);
		prefetch(dir, pos+dir, prof-1);
	}
	function loadFail(){
		if(onerr){
			reintento = reintento || 0;
			var nueva = onerr(link[pos], imagen[pos], reintento, pos);
			error('loadFail('+pos+','+dir+','+prof+','+reintento+') - load: '+JSON.stringify(nueva));
			if(nueva){
				if(nueva.img){
					imagen[pos] = nueva.img;
					cargarImagen(pos, dir, prof, reintento+1);
				}
				else{
					link[pos] = nueva.url;
					prefetch(dir, pos, prof, reintento+1);
				}
				return;
			}
		}
		if(!dir) return;
		imagenOK[pos] = false;
		setCursores();
		setCol(dir, colFail);
	}

	if(usarb64 && GM_xmlhttpRequest){
		setTimeout(function() {
			GM_xmlhttpRequest({
				method: 'GET',
				url: imagen[pos],
				overrideMimeType: 'text/plain; charset=x-user-defined',
				onload: function(resp) {
					imagen64[pos] = 'data:'+
						resp.responseHeaders.match(/Content-Type: (.*)/i)[1]+
						';base64,'+btoa(resp.responseText.replace(/[\u0100-\uffff]/g, function(c) {
							return String.fromCharCode(c.charCodeAt(0) & 0xff);
						}));
					loadOK();
				},
				onerror: loadFail,
				onabort: loadFail
			});
		}, 0);
		return;
	}

	img.src = imagen[pos];

	//ok, green button
	setEvt(img, 'load' , loadOK);
	//not ok, red button
	setEvt(img, 'error', loadFail);
	setEvt(img, 'abort', loadFail);
}

// add a link to the uploaded image to use with DownThemAll
function agregarLink(pos){
	var linkimg = document.createElement('a');
	linkimg.href = imagen[pos];
	linkimg.textContent = 'wcrimg ' + pos + ' - ' + imagen[pos].match(/\/([^\/]+$)/)[1];
	var cont = get('wcr_links_imgs');
	if(pos<0) cont.insertBefore(linkimg, cont.firstChild);
	else cont.appendChild(linkimg);
}

//getElementById
function get(id){
	return document.getElementById(id);
}

// add the fun function to the evt event of the get (id) element
function setEvt(elem, evt, fun){
	if(typeof(elem) == 'string') elem = get(elem);
	if(!elem) return;
	if(isArray(elem)) for(var i=0; i<elem.length; i++) setEvt(elem[i], evt, fun);
	else if(isArray(evt)) for(i=0; i<evt.length; i++) setEvt(elem, evt[i], fun);
	else elem.addEventListener(evt, fun, true);
}

// tell whether the object is an array (or nodelist, which returns querySelectorAll)
function isArray(o){
	return '[object Array];[object NodeList]'.indexOf(Object.prototype.toString.call(o)) >= 0;
}

// Get the value of a javascript variable from the page
function getVar(s, name, def) {
	return JSON.parse(match(s, new RegExp("var "+name+" *= *([^;]+);"),1,def));
}

//if it can return s.match(re)[g], if not, but def is passed, return def, otherwise throw an exception
function match(s, re, g, def){
	var r = s.match(re);
	if(r && r.length > g) return r[g];
	if(def!==undefined) return def;
	throw new Error('match: '+re+'['+g+']');
}

// evaluate a query xpath on an element (or its html), if it is explicitly requested, the result array is returned, if not the first one it finds
function xpath(query, elem, returnAll){
	if(!elem) elem = document;
	if(!isFirefox() && elem!=document && query.charAt(0)!='.')
		query = (query.charAt(0)=='/' ? '.' : './') + query;

	if(typeof(elem)=='string'){
		var div = document.createElement('div');
		div.innerHTML = elem;
		elem = div;
	}
	var res = document.evaluate(query, elem, null, returnAll ? XPathResult.ORDERED_NODE_SNAPSHOT_TYPE : XPathResult.FIRST_ORDERED_NODE_TYPE, null);
	if(returnAll && !res.snapshotLength || !returnAll && !res.singleNodeValue) throw new Error('xpath: '+query);

	var es_atributo = query.match(/@[\w-]+$/);
	if(!returnAll){
		res = res.singleNodeValue;
		// if it is an attribute return the value, if not return the node
		if(es_atributo) return res.value;
		return res;
	}

	var arr = [];
	for (var i = 0; i < res.snapshotLength; i++) arr.push(res.snapshotItem(i));
	return arr;
}

// evaluate a css query on an element (or its html), if it is explicitly requested, the result array is returned, if not the first one it finds
function selCss(query, elem, arreglo){
	if(!elem) elem = document;
	if(typeof(elem)=='string'){
		var div = document.createElement('div');
		div.innerHTML = elem;
		elem = div;
	}

	if(arreglo) return elem.querySelectorAll(query);
	var resp = elem.querySelector(query);
	if(resp === null) throw new Error('selcss: '+query);
	return resp;
}

// look for the content defined by the getter inside the element elem
// the getter can be 'literal', [/regexp/, groupnumber], ['xpath that returns array', 'glue'], or ['xpath']
function contenido(elem, getter, pos){
	//'plain text'
	if(typeof(getter)=='string') return getter;

	//function((string)elem, pos)
	if(typeof(getter)=='function'){
		if(typeof(elem)!='string') elem = elem.innerHTML;
		return getter(elem, pos);
	}

	//[/regexp/, group]
	if(typeof(getter[0])!='string' && !isArray(getter[0])){
		if(typeof(elem)!='string') elem = elem.innerHTML;
		return match(elem, getter[0], getter[1]);
	}

	var arr;

	//[['query css', etc?]]
	if(typeof(getter[0])!='string'){
		getter = getter[0];
		arr = selCss(getter[0], elem, getter.length > 1);
	}
	//['query xpath', etc?]
	else arr = xpath(getter[0], elem, getter.length > 1);

	//['query']
	if(getter.length == 1) return arr;

	// ['query that returns an array', 'string between the elements of the array', idx start ?, idx end?]
	var inicio = getter.length > 2 ? getter[2] : 0;
	if(inicio < 0) inicio += arr.length;
	if(inicio < 0) inicio = 0;
	var fin = getter.length > 3 ? getter[3] : arr.length;
	if(fin < 0) fin += arr.length;
	var res = [];
	for(var i=inicio; i<arr.length && i<fin; i++) res.push(outerHTML(arr[i]));
	return res.join(getter[1]);
}

// return the outerHTML of an element
function outerHTML(elem){
	var div = document.createElement('div');
	div.appendChild(elem.cloneNode(true));
	return div.innerHTML;
}

// set the color of the button corresponding to an address
function setCol(dir, col){
	get('wcr_btn' + dir).style.backgroundColor = col;
}

// (de) enable the back / next buttons, and un-disable the disabled ones so as not to lose control
function disableBtn(dir, dis){
	get('wcr_btn'+dir).disabled = dis;
	if(dis) get('wcr_btn'+dir).blur();
}

// handle typing
function teclaHandler(evt){
	var wcr_settings = get('wcr_settings');
	if(wcr_settings) {
		if(evt.keyCode == 27) document.body.removeChild(wcr_settings);
		if(tabSettingActual != 'wcr_teclas') evt.stopPropagation();
		return;
	}

	// don't touch anything if typing
	if(evt.target.tagName == 'INPUT' && evt.target.type == 'text' ||
		evt.target.tagName == 'TEXTAREA') return;

	var left = document.documentElement.scrollLeft;
	if(!left) left = document.body.scrollLeft;
	var top = document.documentElement.scrollTop;
	if(!top) top = document.body.scrollTop;

	if(checkTecla('back', evt)) btnback(evt);
	else if(checkTecla('next', evt)) btnnext(evt);
	else if(checkTecla('scroll_left', evt)) scroll(left - scrollRate, top);
	else if(checkTecla('scroll_right', evt)) scroll(left + scrollRate, top);
	else if(checkTecla('scroll_up', evt)) scroll(left, top - scrollRate);
	else if(checkTecla('scroll_down', evt)) scroll(left, top + scrollRate);
	else if(checkTecla('reload', evt)) redirect(link[posActual]);
	else if(checkTecla('set_bm', evt)) setBookmark();
	else if(checkTecla('add_bm', evt)) addBookmark();
	else if(checkTecla('layout', evt)) toggleConfKeepLayout();
	else if(checkTecla('fit', evt)) toggleConfFit();
	else if(checkTecla('debug_mode', evt)) toggleConfDebug();
	else if(checkTecla('debug_info', evt)) debugInfo();
	else if(checkTecla('botones', evt)) toggleConfShowButtons();
	else if(checkTecla('slide', evt)) slideshow();
	else if(evt.keyCode == 116 && !evt.ctrlKey) redirect(link[posActual]); //F5
	else if(evt.keyCode == 27 && !evt.ctrlKey && slider) slideshow(); // ESC for the slideshow
	else return;

	evt.stopPropagation();
	evt.preventDefault(); // stop scrolling with the arrows or the original relocation with f5
}

// Prevent the site from capturing the keys we use
function keyupHandler(evt){
	for (var key in teclado) {
		if(checkTecla(key, evt)) {
			evt.stopPropagation();
			evt.preventDefault();
			return;
		}
	}
}

// For pages wich runs javascript on intervals.
function clearAllIntervals() {
	for (var i = 1; i < 9999; i++)
		window.clearInterval(i);
}

// For pages wich runs javascript on timers.
function clearAllTimers() {
	for (var i = 1; i < 9999; i++)
		window.clearTimer(i);
}

// check if the configured key was pressed
function checkTecla(nombre, evt){
	var t = teclado[nombre];
	if(!t) return false;
	if(!isArray(t)) t = [t];
	var ats = ['keyCode', 'ctrlKey', 'shiftKey', 'altKey'];
	for(var i=0; i<t.length; i++){
		var ok = true;
		for(var a=0; a<ats.length; a++){
			if(t[i][ats[a]] != evt[ats[a]]){
				if(ats[a] == 'keyCode'){
					//- y + en chrome, ff15+ y ff14-
					if(mismaTecla([189, 173, 109], t[i], evt) || mismaTecla([189, 173, 109], t[i], evt)) continue;
				}
				ok = false;
				break;
			}
		}
		if(ok) return true;
	}
	return false;
}

// compare different keycodes for the same key xq browsers do not have xq agree with what they think
function mismaTecla(eqs, t, e){
	return eqs.indexOf(parseInt(t.keyCode)) >= 0 && eqs.indexOf(parseInt(e.keyCode)) >= 0;
}

// alert with url and img.src of the first pages, those around the current one, and the last ones
function debugInfo(){
	if(!debug) return;
	var s = '', min, max;

	for(min=posActual; link[min-1]!==undefined; min--) continue;
	s+= mostrarLinks(min, min+3);
	if(min+4 < posActual-3) s+= '...\n' +  mostrarLinks(posActual-3, posActual+3);
	else s+= mostrarLinks(min+4, posActual+3);

	for(max=posActual; link[max+1]!==undefined; max++) continue;
	if(posActual+4 < max-3) s+= '...\n' +  mostrarLinks(max-3, max);
	else s+= mostrarLinks(posActual+4, max);

	alert(s);
}

// returns a list with the url of each page and the src of its image
function mostrarLinks(inicio, fin){
	var s = '';
	for(var i=inicio; i<=fin && link[i]!==undefined; i++){
		if(i==posActual) s+= '\n<<--actual-->>\n';//'<actual>\n\t';
		s += i + ':\t' +
			(link[i] && typeof(link[i])=='object' ? link[i][0]+' ; '+link[i][1] : link[i]) +
			'\n\t' + imagen[i] + '\n';
		if(i==posActual) s+= '<<--actual-->>\n\n';//'</actual>\n';
	}
	return s;
}

// onclick next, advance
function btnnext(evt){
	cambiaPag(flipControls ? -1 : 1);
	evt.stopPropagation();
	evt.preventDefault();
	return false;
}

// onclick back, go back
function btnback(evt){
	cambiaPag(flipControls ? 1 : -1);
	evt.stopPropagation();
	evt.preventDefault();
	return false;
}

//onchange page selector
function btnjump(evt){
	var step = get("wcr_pages").value - posActual;
	var dir = Math.sign(step);
	// Jump to one step before the target
	posActual += step - dir;
	// And then take a single step
	if(dir) {cambiaPag(dir);}
	evt.stopPropagation();
	evt.preventDefault();
	return false;
}


// to remember where the swipes start
var touchpos = {x:0, y:0, t:0};

// record the starting point of a swipe
function touchstart(evt){
	var touches = evt.originalEvent.touches;
	if (touches && touches.length) {
		touchpos = {
			x: touches[0].pageX,
			y: touches[0].pageY,
			t: new Date().getTime()
		};
	}
}

// if it is fast, horizontal and> 50px, it is considered a swipe and page change
function touchend(evt){
	var touches = evt.originalEvent.touches;
	if (touches && touches.length) {
		var dx = touches[0].pageX - touchpos.x;
		var dy = touches[0].pageY - touchpos.y;
		var dt = new Date().getTime() - touchpos.t;

		if(dt < 500 && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50){
			if(dx > 0) btnback(evt);
			else btnnext(evt);
		}
	}
}

// according to the half of the image where you click, advance or go back
function imgClick(evt){
	return imgDerecha(evt) ? btnnext(evt) : btnback(evt);
}

// returns true if the cursor is on the right half of the image
function imgDerecha(evt){
	if(!leftImageClick) return true;
	var img = evt.currentTarget;
	var left = img.getBoundingClientRect().left;
	left += Number(getComputedStyle(img).paddingLeft.match(/\d+/)[0]);
	//left -= window.scrollX;
	var x = evt.clientX - left;
	var w = img.width || img.offsetWidth;
	return x/w>0.5;
}

// shows the cursor corresponding to the state of the next page according to this in the left or right half of the image
function imgCursor(evt){
	if(!evt || !evt.currentTarget) return;
	var img = evt.currentTarget;
	var dir = imgDerecha(evt) ? 1 : -1;
	img.style.cursor = '';
	img.style.cursor = cursor(dir, 'img');
	ultimoevt = evt;
}

// set the image cursor and buttons
function setCursores(){
	imgCursor(ultimoevt);
	get('wcr_btn-1').style.cursor = cursor(-1, 'btns');
	get('wcr_btn1').style.cursor = cursor(1, 'btns');
}

// return the corresponding cursor according to the state of the next page (and take advantage of (de) enable the button)
function cursor(dir, elem){
	if(!link[posActual+dir]){ // there is no link
		disableBtn(dir, true);
		return confCursor('nolink', elem, 'not-allowed');
	}
	if(imagen[posActual+dir]===null || imagenOK[posActual+dir]===false){ //no img
		disableBtn(dir, false);
		return confCursor('noimg', elem, 'pointer');
	}
	if(imagenOK[posActual+dir]===undefined){ // loading img
		disableBtn(dir, !moveWhileLoading);
		return confCursor('loading', elem, 'progress');
	}
	disableBtn(dir, false);
	return confCursor(dir>0 ? 'next' : 'back', elem, dir>0 ? 2 : 1);
}

// redirect to a url or post if q is necessary
function redirect(url){
	if(!url){
		document.location.reload();
		return;
	}

	if(typeof(url)=='string'){
		var hash = match(url,'##.*',0,"");
		document.location.href = url.split('#')[0] + hash;
		return;
	}

	if(typeof(url)=='object' && url.doubleLink && false){
		window.location.href = url[0];
		document.location.reload();
		return;
	}

	form = document.createElement('form');
	form.method = 'POST';
	form.action = url[0];
	form.name = 'jsform';
	var pars = url[1].split('&');
	for(var i=0; i<pars.length; i++){
		var input = document.createElement('input');
		input.type='hidden';
		var par = pars[i].split('=');
		input.name = par[0];
		input.id = par[0];
		input.value = par[1];
		form.appendChild(input);
	}
	document.body.appendChild(form);
	form.submit();
}

// show error messages in debug mode
function error(msg, e){
	if(e) {e.message = msg + e.message; msg = e};
	//debugger;
	//msg = (link[posActual] || document.location.href) + '\n\n' + msg;
	if(console && console.log) console.log(msg);
	//if(console && console.log && e) console.log(e);
	if(debug) alert(msg);
}

// run a script outside the sandbox
function exec(script){
	document.location.href = 'javascript:(function(){' + script + '})();';
}

// execute a synchronous request and return the html
function syncRequest(url, pos){
	var request = new XMLHttpRequest();
	request.open('GET', absUrl(url, pos), false);
	request.send(null);

	if(request.status === 200) return request.responseText;
	throw new Error(request.statusText);
}

// if specified it is not touched, if the host is not used without the "www."
function dominioData(dominio){
	if(!dominio) return document.location.host.replace(/^www\./, '');
	return dominio;
}

// save the configuration using a pure variable (json)
function setData(key, val, dominio){
	var data = JSON.parse(GM_getValue('wcr.settings', '{}'));
	dominio = dominioData(dominio);

	if(data[dominio] === undefined) data[dominio] = {};
	if(key) data[dominio][key] = val;
	else data[dominio] = val;

	dataCache = data;
	return GM_setValue('wcr.settings', JSON.stringify(data));
}

// retrieve a value from the configuration, and if it is in the old format save it in the new format and delete the old one
function getData(key, defval, dominio, reloadCache){
	if(reloadCache || !dataCache) dataCache = JSON.parse(GM_getValue('wcr.settings', '{}'));
	var data = dataCache;
	dominio = dominioData(dominio);

	var val;
	try{ val = key ? data[dominio][key] : data[dominio]; }
	catch(e){}
	if(val === undefined) val = defval;

	return val;
}

// delete a value from the configuration
function delData(key, dominio){
	var data = JSON.parse(GM_getValue('wcr.settings', '{}'));
	dominio = dominioData(dominio);

	if(data[dominio]){
		if(key) delete data[dominio][key];
		if(!key || JSON.stringify(data[dominio]) == '{}') delete data[dominio];
	}

	var json = JSON.stringify(data);
	if(json == '{}') GM_deleteValue('wcr.settings');
	else GM_setValue('wcr.settings', json);
	dataCache = data;
}

// returns the last page visited for this site
function getUltima(){
	var pag = getData('last', '');
	if(pag == '') return;

	// convert the old format
	if(typeof(pag) == 'string'){
		var pags = pag.split('|wcrbmtit|');
		pag = {url: pags[0], title: pags[1]};
	}
	get('wcr_ultimavisita').innerHTML = '<br/>Last visited: <a href="'+pag['url']+'" title="'+pag['url']+'">'+pag['title']+'</a>';
}

// record the last page visited for this site
function saveUltima(){
	setData('last', {url: link[posActual], title: titulo[posActual]});
}

// returns a list of bookmarked pages for this site in format [{url: '...', title: '...'}]
function getListaBookmarks(reloadCache){
	var lista = getData('bm', '', '', reloadCache);
	if(lista === '') return [];

	// convert the old format
	if(typeof(lista) == 'string'){
		lista = lista.split('|wcrbm|');
		for(var i=0;i<lista.length;i++){
			var pags = lista[i].split('|wcrbmtit|');
			lista[i] = {url: pags[0], title: pags[1]};
		}
	}
	return lista;
}

// returns a list with the bookmarked pages of all sites in format {'site1': [...], ...}
function getListaBookmarksTodos(reloadCache){
	var listaTodos = {}, lista = null, este = dominioData();

	for(var sitio in dataCache){
		if(!dataCache[sitio].bm || sitio == este) continue;

		lista = dataCache[sitio].bm;
		// convert the old format
		if(typeof(lista) == 'string'){
			lista = lista.split('|wcrbm|');
			for(var i=0;i<lista.length;i++){
				var pags = lista[i].split('|wcrbmtit|');
				lista[i] = {url: pags[0], title: pags[1]};
			}
		}
		listaTodos[sitio] = lista;
	}

	return lista ? listaTodos : null;
}

// save the list of bookmarked pags
function saveListaBookmarks(lista){
	if(lista.length) setData('bm', lista);
	else delData('bm');
}

// add an item to the div with the bookmarks
function addLista(item){
	var a = document.createElement('a');
	a.href = a.title = item.url;
	a.innerHTML = item.title+' ';

	var btndel = document.createElement('button');
	btndel.innerHTML = 'Delete';
	btndel.style.backgroundColor = '#f00';
	setEvt(btndel, 'click', delBookmark);

	var div = document.createElement('div');
	div.appendChild(a);
	div.appendChild(btndel);
	get('wcr_listabm').appendChild(div);
}

// add the current page to the list of bookmarks
function addBookmark(evt){
	var lista = getListaBookmarks(true);
	for(var i=0;i<lista.length;i++){
		if(lista[i].url==link[posActual]) return;
	}
	var url = link[posActual];
	if(typeof(url)=='object' && url.doubleLink){
		url = url[0];
	}
	var item = {url: url, title: titulo[posActual]};
	lista.push(item);
	addLista(item);

	saveListaBookmarks(lista);
	if(evt) evt.stopPropagation();
}

// remove a bookmark from the list
function delBookmark(evt){
	var lista = getListaBookmarks(true);
	var div = evt.target.parentNode;
	var divs = div.parentNode.childNodes;
	var num;
	for(num=0; div!=divs[num] && num<divs.length; num++) continue;

	lista.splice(num, 1);
	div.parentNode.removeChild(div);

	saveListaBookmarks(lista);
	evt.stopPropagation();
}

// delete all bookmarks
function clearBookmarks(){
	get('wcr_listabm').innerHTML = '';
	saveListaBookmarks([]);
}

// set the current page as the only bookmark
function setBookmark(){
	clearBookmarks();
	addBookmark();
}

// return the layout configuration for this page (true / false: use the original / clean layout)
// find the specific conf for this page, if there is no use the default, if there is no use defval
function confKeepLayout(defval, defpag){
	return confBool('layout', defval, defpag);
}

//returns the number of pages to prefetch in each dir
function confPrefetchSize(defval){
	return [confVal('prefetch_izq', defval[0]), confVal('prefetch_der', defval[1])];
}

//returns the number of pages to prefetch in each dir when the page starts
function confPrefetchSizeStart(defval){
	return [confVal('prefetch_start_izq', defval[0]), confVal('prefetch_start_der', defval[1])];
}

//if it is true, clicking on the left half of the image advances backwards, if it is not always forward
function confLeftImageClick(defval){
	return confBool('click_img_izq', defval);
}

//remove from the conf the cursor that corresponds to the requested state and element, and if it is a custom it converts it
function confCursor(conf, elem, defval){
	var val = defval;
	if(conf){
		if(!confBool('chcursor_'+elem, true)) return elem == 'img' ? 'pointer' : 'auto';
		val = confVal('cursor_'+conf, defval);
	}

	if(!Number(val)) return val;
	return cursorUrl(cursores_custom[val]);
}

//converts a custom cursor (url or base64) to url format
function cursorUrl(val){
	if(!val) return 'auto';
	if(val.match(/[^a-z0-9+\/=]/i)) return  "url("+val+") 16 16, auto";
	return "url('data:image/cursor;base64,"+val+"') 16 16, auto";
}

//look for a boolean conf (saved as '0' / '1') specified for this page, if there is no use the default, if there is no use defval either
function confBool(conf, defval, defpag, reloadCache){
	var val = confVal(conf, defval, defpag, reloadCache);
	return val == '1' || val === true;
}

//look for a specific conf for this page, if there is no use the default, if there is no use defval
function confVal(conf, defval, defpag, reloadCache){
	var val = getData(conf, '', undefined, reloadCache);
	if(val === ''){
		if(defpag !== undefined) val = defpag;
		else val = getData(conf, '', 'default');
	}
	if(val === '') return defval;
	return val;
}

//Toggle the layout configuration of the domain (if the domain is not passed, the one of this host is used)
function toggleConfKeepLayout(){
	toggleConfBool('layout', keepLayout);
	redirect(link[posActual]);
}

//says whether or not to show all buttons (back / next, bookmarks, fit / layout / settings)
function confShowButtons(defval){
	return confBool('botones', defval);
}

//Toggles between showing or not all buttons (back / next, bookmarks, fit / layout / settings)
function toggleConfShowButtons(){
	showButtons = toggleConfBool('botones', showButtons);
	get('wcr_botones').style.display = showButtons ? '' : 'none';
}

//toggles between fitting and not fitting the image
function toggleConfFit(){
	fitSize = toggleConfBool('fit', fitSize);
	fitImagen();
	scrollear();
	get('wcr_btnfit').innerHTML = (fitSize ? 'Disable' : 'Enable') + ' Fit-to-screen';
}

//toggle a boolean conf for this page
function toggleConfBool(conf, defval){
	var val = confBool(conf, defval, undefined, true);
	setData(conf, val ? '0' : '1');
	return !val;
}

//returns if this page is in debug mode reading the configuration
function confDebug(defval){
	return getData('debug', defval);
}

//toggle debug mode on this page
function toggleConfDebug(){
	debug = !debug;
	setData('debug', debug);
	alert('Debug mode '+ (debug ? 'ON' : 'OFF'));
}

//read the key configuration, or load the default keys if they do not exist
function getTeclas(){
	var teclas = getData('teclas', teclado, 'default');
	for(var t in teclas) teclado[t] = teclas[t];
	return teclado;
}

//returns the name of the key pressed with its modifiers
function nombreTecla(evt){
	var pre = '';
	if(evt.ctrlKey) pre += 'CTRL + ';
	if(evt.shiftKey) pre += 'SHIFT + ';
	if(evt.altKey) pre += 'ALT + ';

	if(evt.charCode) return pre + String.fromCharCode(evt.charCode).toUpperCase();
	if(evt.keyCode >= 112 && evt.keyCode <= 135) return pre + 'F' + (evt.keyCode - 111);
	var kc = {
		3: 'CANCEL',
		6: 'HELP',
		8: 'BACK_SPACE',
		9: 'TAB',
		12: 'CLEAR',
		13: 'RETURN',
		14: 'ENTER',
		16: 'SHIFT',
		17: 'CONTROL',
		18: 'ALT',
		19: 'PAUSE',
		20: 'CAPS_LOCK',
		27: 'ESCAPE',
		32: 'SPACE',
		33: 'PAGE_UP',
		34: 'PAGE_DOWN',
		35: 'END',
		36: 'HOME',
		37: 'LEFT',
		38: 'UP',
		39: 'RIGHT',
		40: 'DOWN',
		44: 'PRINTSCREEN',
		45: 'INSERT',
		46: 'DELETE',
		93: 'CONTEXT_MENU',
		106: 'MULTIPLY',
		107: 'ADD',
		108: 'SEPARATOR',
		109: 'SUBTRACT',
		110: 'DECIMAL',
		111: 'DIVIDE',
		144: 'NUM_LOCK',
		145: 'SCROLL_LOCK',
		188: 'COMMA',
		190: 'PERIOD',
		191: 'SLASH',
		192: 'BACK_QUOTE',
		219: 'OPEN_BRACKET',
		220: 'BACK_SLASH',
		221: 'CLOSE_BRACKET',
		222: 'QUOTE',
		224: 'META'
	};
	return pre + (kc[evt.keyCode] || ('??? ('+evt.keyCode+')'));
}

//a single menu that opens the configuration screen with all the options
if(GM_registerMenuCommand){
	GM_registerMenuCommand('Webcomic Reader - Settings', mostrarSettings);
}


var tabSettingActual = 'wcr_general'; //to remember for as long as the tab q left open in the settings

//show the configuration screen
function mostrarSettings(){
	try{
		if(get('wcr_settings')) return; //if the screen is already open, do nothing

		dataCache = null; //force q to load everything again, in case they changed something in another tab

		//editable properties of site settings
		var propsSitio = {
			url:{ desc: 'URL', title: "Define what sites will use these settings",
				tipos:{
					str:{ desc: 'Beginning of URL',
						val:{ elem: 'input', title: "Beginning of the url without the http://www.", size: 60 }
					},
					re:{ desc: "RegExp",
						val:{ elem: 'input', title: "Regular expression that matches the url", size: 60 }
					}
				}
			},
			img:{ desc:'Image', title:"Method for obtaining the main image",
				tipos:{
					def:{ desc: 'Default',
						val:{ elem: 'span', html: '&lt;img&gt; that is the only one with a "src" containing one of the following strings: "/comics/", "/comic/", "/strips/", "/strip/", "/archives/", "/archive/", "/wp-content/uploads/", "comics", "comic", "strips", "strip", "archives", "archive", "/manga/"' }
					},
					str:{ desc: 'Beginning of src',
						val:{ elem: 'input', title: "Beginning of the &quot;src&quot; attribute of the &lt;img&gt;", size: 60 }
					},
					re:{ desc: 'RegExp',
						val:{ elem: 'input', title: "Regular expression that captures the whole &lt;img&gt; (or at least the &quot;src&quot; and &quot;title&quot; attributes)", size: 50 },
						grp:{ elem: 'input', title: "Number of the group that captured the &lt;img&gt;", size: 1 }
					},
					xp:{ desc: 'XPath',
						val:{ elem: 'input', title: "XPath query that returns the &lt;img&gt;", size: 60 }
					},
					css:{ desc: 'CSS selector',
						val:{ elem: 'input', title: "CSS query that returns the &lt;img&gt;", size: 60 }
					},
					fn:{ desc: 'function(html, pos)',
						val:{ elem: 'textarea', title: "Function that receives the html of the page and its position relative to the starting page (0 being where you started reading), and returns the &lt;img&gt; element (either as string or object)", rows:3, cols:45 }
					}
				}
			},
			back:{ desc: 'Back', title: 'Method for obtaining the link to the previous page',
				tipos:{
					def:{ desc: 'Default',
						val:{ elem: 'span', html: '&lt;a&gt; that has the word "back" or "prev" somewhere in its innerHTML or one of its attributes' }
					},
					str:{ desc: 'XPath condition',
						val:{ elem: 'input', title: 'Condition for the following XPath query: //a[condition]/@href', size: 60 }
					},
					re:{ desc: 'RegExp',
						val:{ elem: 'input', title: "Regular expression that captures the URL of the previous page", size: 50 },
						grp:{ elem: 'input', title: "Number of the group that captured the URL", size: 1 }
					},
					xp:{ desc: 'XPath',
						val:{ elem: 'input', title: "XPath query that returns the URL of the previous page, or the &lt;a&gt; element that links to it", size: 60 }
					},
					css:{ desc: 'CSS selector',
						val:{ elem: 'input', title: "CSS query that returns the &lt;a&gt; element that links to the previous page", size: 60 }
					},
					fn:{ desc: 'function(html, pos)',
						val:{ elem: 'textarea', title: "Function that receives the html of the page and its position relative to the starting page (0 being where you started reading), and returns the URL of the previous page", rows:3, cols:45 }
					}
				}
			},
			next:{ desc: 'Next', title: 'Method for obtaining the link to the next page',
				tipos:{
					def:{ desc: 'Default',
						val:{ elem: 'span', html: '&lt;a&gt; that has the word "next" somewhere in its innerHTML or one of its attributes' }
					},
					str:{ desc: 'XPath condition',
						val:{ elem: 'input', title: 'Condition for the following XPath query: //a[condition]/@href', size: 60 }
					},
					re:{ desc: 'RegExp',
						val:{ elem: 'input', title: "Regular expression that captures the URL of the next page", size: 50 },
						grp:{ elem: 'input', title: "Number of the group that captured the URL", size: 1 }
					},
					xp:{ desc: 'XPath',
						val:{ elem: 'input', title: "XPath query that returns the URL of the next page, or the &lt;a&gt; element that links to it", size: 60 }
					},
					css:{ desc: 'CSS selector',
						val:{ elem: 'input', title: "CSS query that returns the &lt;a&gt; element that links to the next page", size: 60 }
					},
					fn:{ desc: 'function(html, pos)',
						val:{ elem: 'textarea', title: "Function that receives the html of the page and its position relative to the starting page (0 being where you started reading), and returns the URL of the next page", rows:3, cols:45 }
					}
				}
			},
			first:{ desc: 'First', title: 'Method for obtaining the link to the first page',
				tipos:{
					def:{ desc: 'Default',
						val:{ elem: 'span', html: '&lt;a&gt; that has the word "first" somewhere in its innerHTML or one of its attributes' }
					},
					str:{ desc: 'XPath condition',
						val:{ elem: 'input', title: 'Condition for the following XPath query: //a[condition]/@href', size: 60 }
					},
					re:{ desc: 'RegExp',
						val:{ elem: 'input', title: "Regular expression that captures the URL of the first page", size: 50 },
						grp:{ elem: 'input', title: "Number of the group that captured the URL", size: 1 }
					},
					xp:{ desc: 'XPath',
						val:{ elem: 'input', title: "XPath query that returns the URL of the first page, or the &lt;a&gt; element that links to it", size: 60 }
					},
					css:{ desc: 'CSS selector',
						val:{ elem: 'input', title: "CSS query that returns the &lt;a&gt; element that links to the first page", size: 60 }
					},
					fn:{ desc: 'function(html)',
						val:{ elem: 'textarea', title: "Function that receives the html of the page and returns the URL of the first page", rows:3, cols:45 }
					}
				}
			},
			last:{ desc: 'Last', title: 'Method for obtaining the link to the last page',
				tipos:{
					def:{ desc: 'Default',
						val:{ elem: 'span', html: '&lt;a&gt; that has the word "last", "latest", "newest" or "today" somewhere in its innerHTML or one of its attributes' }
					},
					str:{ desc: 'XPath condition',
						val:{ elem: 'input', title: 'Condition for the following XPath query: //a[condition]/@href', size: 60 }
					},
					re:{ desc: 'RegExp',
						val:{ elem: 'input', title: "Regular expression that captures the URL of the last page", size: 50 },
						grp:{ elem: 'input', title: "Number of the group that captured the URL", size: 1 }
					},
					xp:{ desc: 'XPath',
						val:{ elem: 'input', title: "XPath query that returns the URL of the last page, or the &lt;a&gt; element that links to it", size: 60 }
					},
					css:{ desc: 'CSS selector',
						val:{ elem: 'input', title: "CSS query that returns the &lt;a&gt; element that links to the last page", size: 60 }
					},
					fn:{ desc: 'function(html)',
						val:{ elem: 'textarea', title: "Function that receives the html of the page and returns the URL of the last page", rows:3, cols:45 }
					}
				}
			},
			fixurl:{ desc: 'Fix URL', title: 'Fix URLs coming from a link or img.src for sites that may need it (like relative URLs that don\'t behave normally, or links from http://something.com to http://www.something.com that wouldn\'t work because of cross site request limitations)',
				tipos:{
					def:{ desc: 'Default',
						val:{ elem: 'span', html: 'Do nothing' }
					},
					fn:{ desc: 'function(url, img, link, pos)',
						val: { elem: 'textarea', title: 'Function that receives an URL, and flags telling if it came from an img.src or link to another page, and returns the fixed url', rows:3, cols:45 }
					}
				}
			},
			extra:{ desc: 'Extra Content', title: 'Other content besides the main image to get from each page',
				tipos:{
					str:{ desc: 'Literal string',
						val:{ elem: 'input', title: 'HTML string, this will be output literally', size: 60 }
					},
					re:{ desc: 'RegExp',
						val:{ elem: 'input', title: "Regular expression that captures the desired content", size: 50 },
						grp:{ elem: 'input', title: "Number of the group that captured the content", size: 1 }
					},
					xp:{ desc: 'XPath',
						val:{ elem: 'input', title: "XPath query that returns the desired content", size: 60 },
						arr:{ elem: 'select', html: '<option value="">First element</option><option value="1">List of elements</option>'},
						glue:{ elem: 'input', title: 'String to put between each pair of elements returned', size: 20},
						first:{ elem: 'input', title: 'Index of the first element to return (starting from 0, negative means counting from the last)', size: 1},
						last:{ elem: 'input', title: 'Index of the last element to return (starting from 0, negative means counting from the last)', size: 1}
					},
					css:{ desc: 'CSS selector',
						val:{ elem: 'input', title: "CSS query that returns the desired content", size: 60 },
						arr:{ elem: 'select', html: '<option value="">First element</option><option value="1">List of elements</option>'},
						glue:{ elem: 'input', title: 'String to put between each pair of elements returned', size: 20},
						first:{ elem: 'input', title: 'Index of the first element to return (starting from 0, negative means counting from the last)', size: 1},
						last:{ elem: 'input', title: 'Index of the last element to return (starting from 0, negative means counting from the last)', size: 1}
					},
					fn:{ desc: 'function(html, pos)',
						val:{ elem: 'textarea', title: "Function that receives the html of the page and its position relative to the starting page (0 being where you started reading), and returns the desired content", rows:3, cols:45 }
					}
				}
			},
			xelem:{ desc: 'Extras Container', title: 'Element for placing the extra content when using the full layout',
				tipos:{
					def:{ desc: 'Default',
						val:{ elem: 'span', html: 'Inside the WCR container (between the image and the back/next buttons)' }
					},
					str:{ desc: 'XPath',
						val: { elem: 'input', title: 'XPath query that returns the element where the extra content will be placed as its innerHTML', size:60 }
					}
				}
			},
			layelem:{ desc: 'Layout Container', title: 'Element for placing the image and the rest of the script content when using the full layout',
				tipos:{
					def:{ desc: 'Default',
						val:{ elem: 'span', html: 'Where the original image was' }
					},
					str:{ desc: 'XPath',
						val: { elem: 'input', title: 'XPath query that returns the element where the content will be placed as its innerHTML', size:60 }
					}
				}
			},
			js:{ desc: 'Custom Action', title: 'Custom function to execute after each page change',
				tipos:{
					def:{ desc: 'Default',
						val:{ elem: 'span', html: 'Do nothing' }
					},
					fn:{ desc: 'function(dir)',
						val: { elem: 'textarea', title: 'Function that receives the direction in which the page was changed (0 when the starting page is loaded, 1 when going forward and -1 when going backwards)', rows:3, cols:45 }
					}
				}
			},
			style:{ desc: 'Custom CSS', title: 'Custom CSS styles',
				tipos:{
					def:{ desc: 'Default',
						val:{ elem: 'span', html: 'Don\'t change anything' }
					},
					str:{ desc: 'CSS rules',
						val: { elem: 'textarea', title: 'CSS rules', rows:3, cols:45 }
					}
				}
			},
			bgcol:{ desc: 'Background Color',
				tipos:{
					def:{ desc: 'Default',
						val:{ elem: 'span', html: 'Keep original' }
					},
					str:{ desc: 'Custom',
						val: { elem: 'input', title: '#RRGGBB or #RGB', size:6 }
					}
				}
			},
			txtcol:{ desc: 'Text Color',
				tipos:{
					def:{ desc: 'Default',
						val:{ elem: 'span', html: 'Keep original' }
					},
					str:{ desc: 'Custom',
						val: { elem: 'input', title: '#RRGGBB or #RGB', size:6 }
					}
				}
			},
			scrollx:{ desc: 'Default Horizontal Autoscroll', title: 'Scroll to this position of the image each time you change the page',
				tipos:{
					def:{ desc: 'Default',
						val:{ elem: 'span', html: 'Left' }
					},
					str:{ desc: 'Relative to image',
						val: { elem: 'select', html: '<option value="L">Left</option><option value="R">Right</option><option value="M">Middle</option>' }
					},
					num:{ desc: 'Pixels',
						val: { elem: 'input', title: 'X coordinate in pixels', size: 5 }
					},
					fn:{ desc: 'function()',
						val:{ elem: 'textarea', title: "Function that returns the numbers of pixels to scroll", rows:3, cols:45 }
					}
				}
			},
			scrolly:{ desc: 'Default Vertical Autoscroll', title: 'Scroll to this position of the image each time you change the page',
				tipos:{
					def:{ desc: 'Default',
						val:{ elem: 'span', html: 'Top' }
					},
					str:{ desc: 'Relative to image',
						val: { elem: 'select', html: '<option value="U">Top</option><option value="D">Bottom</option><option value="M">Middle</option>' }
					},
					num:{ desc: 'Pixels',
						val: { elem: 'input', title: 'Y coordinate in pixels', size: 5 }
					},
					fn:{ desc: 'function()',
						val:{ elem: 'textarea', title: "Function that returns the numbers of pixels to scroll", rows:3, cols:45 }
					}
				}
			},
			layout:{ desc: 'Default Layout', title: 'Layout to use when no custom layout settings are defined for this site',
				tipos:{
					def:{ desc: 'Default',
						val:{ elem: 'span', html: 'Use default settings' }
					},
					bool:{ desc: 'Custom',
						val: { elem: 'select', html: '<option value="false">Minimalistic</option><option value="true">Keep original</option>' }
					}
				}
			}
		};

		//types of updates
		var listaTipos = [
			'Bug fixes (Firefox)',
			'Bug fixes (Other browsers)',
			'New features',
			'New sites',
			'Fixes for old sites',
			'Graphic changes',
			'New options'];
		var t, tiposUp = {};
		for(t=0; t<listaTipos.length;t++) tiposUp[1<<t] = listaTipos[t];
		tiposUp[(1<<16)-(1<<t)] = 'Other stuff (???)';

		//configurable keys
		var teclas = {
			back: ['Back', 'Go back 1 page'],
			next: ['Next', 'Go forward 1 page'],
			scroll_left: ['Scroll left', ''],
			scroll_right: ['Scroll right', ''],
			scroll_up: ['Scroll up', ''],
			scroll_down: ['Scroll down', ''],
			reload: ['Reload', 'Reload the current page (in old browsers, pressing the reload button will take you back to where you started). F5 will always do this (unless set to another action)'],
			set_bm: ['Set as only bookmark', 'Delete other bookmarks and add this page, so that the next time you visit the site you will be taken back to this page'],
			add_bm: ['Add to bookmarks', ''],
			layout: ['Toggle layout', 'Switch between the &quot;clean layout&quot; (show only image and buttons) and &quot;full layout&quot; (show the whole original page)'],
			botones: ['Toggle buttons', 'Switch between showing or hiding all the script\'s buttons (back/next, bookmarks, settings, etc...)'],
			fit: ['Toggle Fit-to-screen', 'Switch between always showing the image in its original size or fitting it to the screen when needed'],
			slide: ['Toggle Slideshow', 'Start or stop the slideshow mode (pages turn automatically after the selected time). Slideshow will also stop by pressing ESC or manually turning a page'],
			debug_mode: ['Toggle debug mode', 'In debug mode you\'ll get alerts to see what isn\'t working. Useful when adding new sites'],
			debug_info: ['Debug info (on debug mode)', 'Show a list of URLs of the preloaded pages and images']
		};

		var arrcursores = ['default', 'none', 'context-menu', 'help', 'pointer', 'progress', 'wait', 'cell', 'crosshair', 'text', 'vertical-text', 'alias', 'copy', 'move', 'no-drop', 'not-allowed', 'all-scroll', 'col-resize', 'row-resize', 'n-resize', 'e-resize', 's-resize', 'w-resize', 'ne-resize', 'nw-resize', 'se-resize', 'sw-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize'];
		if(isFirefox()) arrcursores.push('-moz-grab', '-moz-grabbing', '-moz-zoom-in', '-moz-zoom-out');
		if(isWebKit())  arrcursores.push('-webkit-grab', '-webkit-grabbing', '-webkit-zoom-in', '-webkit-zoom-out');
		var cursores = {
			'1': 'Left green arrow',
			'2': 'Right green arrow',
			'5': 'Left blue arrow',
			'6': 'Right blue arrow',
			'3': 'Custom cursor #1',
			'4': 'Custom cursor #2'
		};
		for(var c=0; c<arrcursores.length; c++) cursores[arrcursores[c]] = arrcursores[c];

		//general options
		var opsGeneral = {
			clickImgNavigates:{ desc:'Click image to navigate', title:'If enabled, clicking the image will let you go to the next or previous page',
				def: defaultSettings.clickImgNavigates ? '1' : '0',
				vals:{
					'0':'Disabled',
					'1':'Enabled'
				}
			},
			click_img_izq:{ desc:'Click left half of<br/>image to go back', title:'If enabled, clicking the left half of the image will take you to the previous page, and the right half to the next one. Otherwise, clicking anywhere will always take you to the next page',
				def: defaultSettings.clikLeftHalfGoesBack ? '1' : '0',
				vals:{
					'0':'Disabled',
					'1':'Enabled'
				}
			},
			flipControlsManga:{ desc:'Flip controls<br/>for mangas', title:'If enabled, flips the controls (L/R arrows, L/R image click, back/next buttons) for mangas or other right-to-left content',
				def: defaultSettings.flipControlsManga ? '1' : '0',
				vals:{
					'0':'Disabled',
					'1':'Enabled'
				}
			},
			overwrite_links:{ desc:'Overwrite links', title:'If enabled, overwrites the original back/next links (when using the original layout) to work like the script\'s buttons',
				def:'1',
				vals:{
					'0':'Disabled',
					'1':'Enabled'
				}
			},
			goToBookmark:{ desc: 'Go to bookmark', title: 'If you have 1 bookmark saved for a site, asks you if you want to go there when you visit the site',
				def: defaultSettings.goToBookmark ? '1' : '0',
				vals:{
					'0':'Disabled',
					'1':'Enabled'
				}
			},
			scroll_rate:{ desc:'Scroll rate', title:'Number of pixels to scroll when using the keyboard', def:'50'},
			b64_images:{ desc:'Force cache (experimental)', title:'Chache images as base64 strings, so the browser doesn\'t unload them to save memory',
				def:'0',
				vals:{
					'0':'Disabled',
					'1':'Enabled'
				}
			},
			useHistoryAPI:{ desc: 'Use browser history', title: 'Changes the URL and keeps track of the visited pages in the browser history, so you can navigate with the browser\'s back/forward buttons as usual',
				def: '1',
				vals:{
					'0':'Disabled',
					'1':'Enabled'
				}
			},
			moveWhileLoading:{ desc: 'Force loading next page', title: 'Lets you move to the next or previous page before the image for that page has finished loading',
				def: defaultSettings.moveWhileLoading ? '1' : '0',
				vals:{
					'0':'Disabled',
					'1':'Enabled'
				}
			},

			_grp_fit:{ desc:'AutoZoom', title:'Automatically zoom the image, either shrinking or expanding it to make it fit in the screen' },
			fit:{ desc:'Fit image to screen', title:'Apply options below to fit the image to the screen (if none of them are selected and you enable this option, you will be prompted to select the settings the first time you visit each site). This setting can also be toggled for this site with a keyboard shortcut (+ by default)',
				def: defaultSettings.autozoom ? '1' : '0',
				vals:{
					'0':'Disabled',
					'1':'Enabled'
				}
			},
			achw:{ desc:'Shrink to fit width', title:'If the image is wider than the window, it will be shrunk to fit the screen without needing to scroll',
				def: defaultSettings.shrinkWidth ? '1' : '0',
				vals:{
					'0':'Never shrink',
					'1':'Shrink when needed'
				}
			},
			achh:{ desc:'Shrink to fit height', title:'If the image is longer than the window, it will be shrunk to fit the screen without needing to scroll',
				def: defaultSettings.shrinkHeight ? '1' : '0',
				vals:{
					'0':'Never shrink',
					'1':'Shrink when needed'
				}
			},
			agrw:{ desc:'Expand to fit width', title:'If the image is smaller than the window, it will be expanded to fit the screen',
				def: defaultSettings.expandWidth ? '1' : '0',
				vals:{
					'0':'Never expand',
					'1':'Expand when needed'
				}
			},
			agrh:{ desc:'Expand to fit height', title:'If the image is smaller than the window, it will be expanded to fit the screen',
				def: defaultSettings.expandHeight ? '1' : '0',
				vals:{
					'0':'Never expand',
					'1':'Expand when needed'
				}
			},
			maxScale:{ desc:'Max scale', title: 'Maximum scale (as a percentage, > 100) to which the image should be expanded (leave blank for no limit)'},
			minScale:{ desc:'Min scale', title: 'Minimum scale (as a percentage, < 100) to which the image should be shrunk (leave blank for no limit)'},
			maxScaleReset:{ desc:'Over max scale', title: 'Action to be taken when the AutoZoom would expand the image over the max scale',
				def: '0',
				vals: {
					'0': 'Keep the max scale',
					'1': 'Reset to original size'
				}
			},
			minScaleReset:{ desc:'Under min scale', title: 'Action to be taken when the AutoZoom would shrink the image over the min scale',
				def: '0',
				vals: {
					'0': 'Keep the min scale',
					'1': 'Reset to original size'
				}
			},

			_grp_scroll:{ desc: 'AutoScroll', title:'Scroll to this position of the image each time you change the page' },
			scrollx:{ desc:'Horizontal', title:'Scroll to this position of the image each time you change the page',
				vals:{
					'L':'Left',
					'R':'Right',
					'M':'Middle'
				}
			},
			scrolly:{ desc:'Vertical', title:'Scroll to this position of the image each time you change the page',
				vals:{
					'U':'Top',
					'D':'Bottom',
					'M':'Middle'
				}
			},

			_grp_prefetch:{ desc:'Page Preloading', title:'Adjust the number of pages to preload in each direction' },
			prefetch_der:{ desc:'Forward', title:'The number of next pages to preload (>0)',
				def:defaultSettings.prefetchNext},
			prefetch_izq:{ desc:'Backwards', title:'The number of previous pages to preload (>0)',
				def:defaultSettings.prefetchBack},
			prefetch_start_der:{ desc:'Initial forward', title:'The number of next pages to preload (>0) when the page is first loaded (to avoid wasting bandwith if you only wanted to see that page)',
				def:defaultSettings.prefetchNextStart},
			prefetch_start_izq:{ desc:'Initial backwards', title:'The number of previous pages to preload (>0) when the page is first loaded (to avoid wasting bandwith if you only wanted to see that page)',
				def:defaultSettings.prefetchBackStart},
			prefetchNoNext:{ desc:'Prefetch when no next page', title:'Disable this to stop preloading the previous page when visiting the last page (ie, the next page was not found)',
				def:defaultSettings.prefetchNoNext ? '1' : '0',
				vals:{
					'0':'Disabled',
					'1':'Enabled'
				}}
		};

		//visual options
		var opsLayout = {
			layout:{ desc:'Layout', title:'Minimalistic layout will show only the image, the defined extra content, and this script\'s buttons. Keeping the original layout will stuff that same content in the place where the image used to be, leaving the rest of the page untouched. This setting can also be toggled for this site with a keyboard shortcut (- by default)',
				def: defaultSettings.fullLayout ? '1' : '0',
				vals:{
					'0':'Minimalistic',
					'1':'Keep original'
				}
			},
			botones:{ desc:'Buttons', title:'Show or hide all the script\'s buttons (back/next, bookmarks, settings, etc...). This setting can also be toggled for this site with a keyboard shortcut (Shift + - by default)',
				def: defaultSettings.showButtons ? '1' : '0',
				vals:{
					'0':'Hide',
					'1':'Show'
				}
			},
			dim:{ desc:'Screen Dimmer', title:'Add a shadow to the rest of the site so the image (or script content) gets a better focus',
				def: '0',
				vals:{
					'0':'Disabled',
					'S':'Focus script content',
					'I':'Focus image'
				}
			},

			_grp_border:{ desc: 'Border', title:'Space to leave around the image (affects AutoScroll and AutoZoom)' },
			bordex:{ desc:'Horizontal border', title:'Extra pixels to the left/right of the image',
				def: defaultSettings.borderLR },
			bordey:{ desc:'Vertical border', title:'Extra pixels to the top/bottom of the image',
				def: defaultSettings.borderUD },

			_grp_cursor:{ desc:'Cursors', title:'Change the cursor according to the current state' },
			chcursor_img:{ desc:'Change over image', title:'Enable/Disable this to see a different cursor over the image depending on the state, or always the same one',
				def:'1',
				vals:{
					'0':'Disabled',
					'1':'Enabled'
				}
			},
			chcursor_btns:{ desc:'Change over buttons', title:'Enable/Disable this to see a different cursor over the back/next buttons depending on the state, or always the same one',
				def:'1',
				vals:{
					'0':'Disabled',
					'1':'Enabled'
				}
			},
			cursor_back:{ desc:'Previous page', title:'Cursor for the previous page', def:'1', vals: cursores },
			cursor_next:{ desc:'Next page', title:'Cursor for the next page', def:'2', vals: cursores },
			cursor_loading:{ desc:'Loading', title:'Cursor for when the next page is loading', def:'progress', vals: cursores },
			cursor_nolink:{ desc:'No link', title:'Cursor for when there is no next page', def:'not-allowed', vals: cursores },
			cursor_noimg:{ desc:'No image', title:'Cursor for when there is a next page but it has no image', def:'pointer', vals: cursores },
			cursor_custom_3:{ desc:'Custom cursor #1', title:'Custom image to use in the above options, either as an url or base64 (suggested size of 32x32 px, hotspot is at 16,16)'},
			cursor_custom_4:{ desc:'Custom cursor #2', title:'Custom image to use in the above options, either as an url or base64 (suggested size of 32x32 px, hotspot is at 16,16)'}
		};

		var divsets = document.createElement('div');
		divsets.id = 'wcr_settings';
		divsets.style.textAlign = 'center';
		divsets.innerHTML =
			'<div style="position:fixed; z-index:232322; background:#000; top:0; left:0; right:0; bottom:0; opacity:0.8;"></div>'+
			'<div id="wcr_settings_popup" style="position:absolute; left:50%; z-index:232323; background-color:#fff; color:#000; padding: 20px;">'+
				'<div id="wcr_settings_links">'+
					'<span class="wcr_general">General</span> | '+
					'<span class="wcr_layout">Graphic settings</span> | '+
					'<span class="wcr_sitio">Site settings</span> | '+
					'<span class="wcr_teclas">Keyboard shortcuts</span>'+
				'</div><hr/>'+
				'<div id="wcr_settings_content" style="text-align:left">'+
					'<div class="wcr_general">'+htmlLayout(opsGeneral, 'general')+'</div>'+
					'<div class="wcr_layout">'+htmlLayout(opsLayout, 'layout')+'</div>'+
					'<div class="wcr_sitio">'+htmlSitio(propsSitio)+'</div>'+
					'<div class="wcr_teclas">'+htmlTeclas(teclas)+'</div>'+
				'</div><hr/>'+
				'<div>'+
					'Import / Export '+
					'<select id="wcr_set_sel_impexp">'+
						'<option value="">data for '+dominioData()+'</option>'+
						'<option value="default">default settings</option>'+
						'<option value="all">ALL data</option>'+
					'</select> '+
					'<button id="wcr_set_btn_impexp">GO</button> - '+
					'Reset '+
					'<select id="wcr_set_sel_reset">'+
						'<option value="">data for '+dominioData()+'</option>'+
						'<option value="default">default settings</option>'+
						'<option value="all">ALL data</option>'+
					'</select> '+
					'<button id="wcr_set_btn_reset">GO</button>'+
				'</div><br/>'+
				'<div>'+
					'<button id="wcr_set_btn_guardar">Save</button> '+
					'<button id="wcr_set_btn_aplicar">Apply</button> '+
					'<button id="wcr_set_btn_cancelar">Cancel</button>'+
				'</div>'+
			'</div>'+
			'<style>'+
				'#wcr_settings_popup *{color:#000;}'+
				'#wcr_settings_popup input, #wcr_settings_popup select, #wcr_settings_popup textarea{background-color:#fff;}'+
				'#wcr_settings_links span{cursor:pointer; text-decoration:underline;}'+
				'div{position:static; float:none;}'+
				'#wcr_settings [title]{cursor:help;}'+
				'#wcr_settings tr:nth-of-type(odd){background-color:#fff; color:#000;}'+
				'#wcr_settings tr:nth-of-type(even){background-color:#eef; color:#000;}'+
				'#wcr_settings tr.wcr_settings_group{background-color:#ccf; color:#000; text-align:center; font-style:italic;}'+
				'.wcr_settings_group td:nth-of-type(1):not([colspan]){background-color:#fff;}'+
			'</style>';
		document.body.appendChild(divsets);

		initLayout(opsGeneral, 'general');
		initLayout(opsLayout, 'layout');
		initSitio(propsSitio);
		initTeclas(teclas);

		//set events for tabs / save / cancel
		var tabs = xpath('//div[@id="wcr_settings_links"]/span', document, true);
		for(var i=0; i<tabs.length; i++)
			setEvt(tabs[i], 'click', function(evt){
				cambiarTabSettings(evt.target.className);
			});

		for(var o in opsGeneral) opsLayout[o] = opsGeneral[o];
		setEvt('wcr_set_btn_guardar', 'click', function(){
			if(guardarSettings(teclas, propsSitio, tiposUp, opsLayout)){
				redirect(link[posActual]);
			}
		});
		setEvt('wcr_set_btn_aplicar', 'click', function(){
			guardarSettings(teclas, propsSitio, tiposUp, opsLayout);
		});
		setEvt('wcr_set_btn_cancelar', 'click', function(){
			document.body.removeChild(divsets);
		});
		setEvt('wcr_set_btn_impexp', 'click', function(){
			if(confirm('Save the changes?')) guardarSettings(teclas, propsSitio, tiposUp, opsLayout);

			var dominio = get('wcr_set_sel_impexp').value;
			var data = dominio == 'all' ?
				GM_getValue('wcr.settings', '') :
				JSON.stringify(getData('', '', dominio));
			var resp = prompt(
				'Copy this and save it somewhere to export your settings.\n' +
				'Replace this with your saved settings to restore them.', data);
			if(resp && resp != data && confirm('Are you sure you want to replace your current settings?')){
				try{
					var nuevaData = JSON.parse(resp);
					if(dominio == 'all') GM_setValue('wcr.settings', resp);
					else setData('', nuevaData, dominio);
					alert('Settings updated successfully');
					redirect(link[posActual]);
				}
				catch(e){
					alert('Error parsing the settings, nothing has been changed');
				}
			}
		});
		setEvt('wcr_set_btn_reset', 'click', function(){
			var msgConfirm = 'This will reset all data for '+dominioData()+': graphic options, bookmarks, and last visited page.\nYou may want to export and backup your settings first...\n\nAre you sure you want to delete this data?';
			var msgOK = 'All settings for '+dominioData()+' cleared';
			var dominio = get('wcr_set_sel_reset').value;
			if(dominio == 'all'){
				msgConfirm = 'This will reset EVERYTHING to the default settings, and all data will be lost for all sites.\nYou may want to export and backup your settings first...\n\nAre you REALLY sure you want to do delete this data?';
				msgOK = 'Everything is gone... everything...\n\n\n\n...forever';
			}
			else if(dominio == 'default'){
				msgConfirm = 'This will reset all the default graphic options and keyboard shortcuts settings.\nYou may want to export and backup your settings first...\n\nAre you sure you want to do delete this data?';
				msgOK = 'All default settings cleared';
			}

			if(confirm(msgConfirm)){
				if(dominio == 'all') GM_deleteValue('wcr.settings');
				else delData('', dominio);
				alert(msgOK);
				redirect(link[posActual]);
			}
		});

		cambiarTabSettings(tabSettingActual);
	}
	catch(e){
		alert('Error while initializing the settings window: ' + e);
		if(get('wcr_settings')) document.body.removeChild(get('wcr_settings'));
	}
}

//initialize layout values and events
function initLayout(ops, nombre){
	for(var o in ops){
		if(!o.indexOf('_')) continue;
		var id = 'wcr_sel_layout_'+o;
		var val = getData(o, '');
		var valdef = getData(o, ops[o].def || '', 'default');

		if(!o.indexOf('scroll')){
			if(typeof(val)=='number'){
				get('wcr_sel_layout__offset_'+o).value = val<0 ? -val : val;
				if(o=='scrollx') val = val>0 ? 'L' : 'R';
				else val = val>0 ? 'D' : 'U';
			}
			if(typeof(valdef)=='number'){
				get('wcr_sel_layout__offset_'+o+'_def').value = valdef<0 ? -valdef : valdef;
				if(o=='scrollx') valdef = valdef>0 ? 'L' : 'R';
				else valdef = valdef>0 ? 'D' : 'U';
			}
		}

		get(id).value = val;
		get(id+'_def').value = valdef;

		if(!o.indexOf('cursor_custom_')){
			setEvt(id+'_def', 'mouseover', function(evt){
				evt.target.style.cursor = cursorUrl(evt.target.value);
			});
			setEvt(id, 'mouseover', function(evt){
				evt.target.style.cursor = cursorUrl(evt.target.value);
			});
		}
		else if(!o.indexOf('cursor_')){
			setEvt(id+'_def', 'mouseover', function(evt){
				evt.target.style.cursor = confCursor(null, null, evt.target.value);
			});
			setEvt(id, 'mouseover', function(evt){
				evt.target.style.cursor = confCursor(null, null, evt.target.value || get(evt.target.id+'_def').value);
			});
		}
	}
}

//initialize site values and events
function initSitio(props){
	var lista = getConfPagina('lista');
	var selConf = get('wcr_sel_confpag');
	for(var i=0; i<lista.length; i++){
		selConf.innerHTML +=
			'<option value="'+escape(lista[i])+'">'+
				(lista[i][0]=='d'?'(default) ':'(custom) ')+
				lista[i].substr(3)+
			'</option>';
	}
	if(!lista.length){
		selConf.innerHTML +=
			'<option value="">Default settings</option>';
	}

	setEvt('wcr_btn_delconfpag', 'click', function(evt){
		if(!confirm('Are you sure you want to delete these settings?')) return;

		var customs = getData('confpags', {}, 'custompages');
		var nombre = unescape(get('wcr_sel_confpag').value);
		delete customs[nombre];
		setData('confpags', customs, 'custompages');
		if(getData('confpag') == nombre) delData('confpag');

		var selConf = get('wcr_sel_confpag');
		selConf.removeChild(selConf.options[selConf.selectedIndex]);
		if(selConf.options.length == 2){
			selConf.innerHTML += '<option value="">Default settings</option>';
		}
		selConf.selectedIndex = selConf.options.length-1;
		initValoresSitio(props, selConf.value);
	});

	setEvt('wcr_btn_editconfpag', 'click', function(evt){
		selConf.selectedIndex = 0;
		initValoresSitio(props, selConf.value);
	});

	for(var p in props){
		var seltipo = get('wcr_sitio_tipo_'+p);
		setEvt(seltipo, 'change', function(evt){
			cambiaTipo(evt.target);
		});
	}

	var confActual = initValoresSitio(props, getData('confpag', ''));

	selConf.value = escape(confActual);
	setEvt(selConf, 'change', function(evt){
		initValoresSitio(props, unescape(evt.target.value));
	});

	setEvt('wcr_btn_add_extra', 'click', function(evt){
		var p = 'extra_'+Number(new Date());
		trExtraConfSitio(p, props.extra);
		var seltipo = get('wcr_sitio_tipo_'+p);
		cambiaTipo(seltipo);
	});
}

//populates the site conf table with the values of a specific conf
function initValoresSitio(props, conf){
	var pag = null;
	if(conf != 'new'){ //If it is new, current values are preserved
		pag = getConfPagina(conf);

		for(var p in props){
			if(p=='extra'){// is an array, get into each
				try{
					var extrasViejos = xpath('//tr[@class="wcr_extras"]', document, true);
					for(var i=0; i<extrasViejos.length; i++) extrasViejos[i].parentNode.removeChild(extrasViejos[i]);
				}catch(e){}

				if(pag && pag[p]){
					for(i=0; i<pag[p].length; i++){
						var p2 = p+'_'+i;
						trExtraConfSitio(p2, props[p]);
						var seltipo = get('wcr_sitio_tipo_'+p2);
						rellenarValores(pag[p][i], p2, seltipo);
						cambiaTipo(seltipo);
					}
				}
			}
			else{
				seltipo = get('wcr_sitio_tipo_'+p);
				rellenarValores(pag ? pag[p] : undefined, p, seltipo);
				cambiaTipo(seltipo);
			}
		}
	}

	get('wcr_btn_delconfpag').style.display = (pag && pag.nombre && pag.nombre[0]=='c') ? '' : 'none';
	get('wcr_btn_editconfpag').style.display = (pag && pag.nombre && pag.nombre[0]=='d') ? '' : 'none';

	var dis = conf=='dis' || conf=="" || (pag && pag.nombre && pag.nombre[0]=='d');
	var inputs = xpath('//table[@id="wcr_sitio_tabla"]//input | //table[@id="wcr_sitio_tabla"]//textarea | //table[@id="wcr_sitio_tabla"]//select', document, true);
	for(i=0; i<inputs.length; i++){
		var inp = inputs[i];
		inp.disabled = dis;
		inp.style.backgroundColor = dis ? '#eee' : '#fff';
	}
	var botones = xpath('//table[@id="wcr_sitio_tabla"]//button', document, true);
	for(i=0; i<botones.length; i++){
		botones[i].disabled = dis;
	}

	return pag ? pag.nombre : conf;

	function rellenarValores(valor, p, seltipo){
		try{
			var base = 'wcr_sitio_valor_'+p;

			//if the conf does not exist for this page / prop fill with default
			if(valor===undefined){
				seltipo.value = 'def';
				if(seltipo.value != 'def'){
					seltipo.value = 'str';
					get(base+'_str_val').value = '';
				}
			}
			else{
				if(p=='url' && typeof(valor)!='string' && !isArray(valor)) valor = [valor];

				//types: str, re, xp, fn, bool, num?
				switch(typeof(valor)){
					case 'string': //str
						seltipo.value = 'str';
						get(base+'_str_val').value = valor;
						break;
					case 'object': //xp, css or re
						if(typeof(valor[0]) == 'string'){ //xp
							seltipo.value = 'xp';
							get(base+'_xp_val').value = valor[0];
							if(get(base+'_xp_arr'))
								get(base+'_xp_arr').value = valor.length>1 ? '1' : '';
							if(valor.length>1)
								get(base+'_xp_glue').value = valor[1];
							if(valor.length>2)
								get(base+'_xp_first').value = valor[2];
							if(valor.length>3)
								get(base+'_xp_last').value = valor[3];
						}
						else if(isArray(valor[0])){ //css
							valor = valor[0];
							seltipo.value = 'css';
							get(base+'_css_val').value = valor[0];
							if(get(base+'_css_arr'))
								get(base+'_css_arr').value = valor.length>1 ? '1' : '';
							if(valor.length>1)
								get(base+'_css_glue').value = valor[1];
							if(valor.length>2)
								get(base+'_css_first').value = valor[2];
							if(valor.length>3)
								get(base+'_css_last').value = valor[3];
						}
						else{ //re
							seltipo.value = 're';
							get(base+'_re_val').value = valor[0];
							if(valor.length>1)
								get(base+'_re_grp').value = valor[1];
						}
						break;
					case 'function': //fn
						seltipo.value = 'fn';
						//get the "^func..{" and the "}$"
						var fn = valor.toString();
						fn = fn.replace(/^.+?\{(\s*[\r\n]+)*|\s*\}$/g, '');
						fn = fn.replace(new RegExp('^' + fn.match(/^\s*/), 'mg'), '');
						get(base+'_fn_val').innerHTML = fn;
						break;
					case 'boolean':
						seltipo.value = 'bool';
						get(base+'_bool_val').value = valor;
						break;
					case 'number':
						seltipo.value = 'num';
						get(base+'_num_val').value = valor;
						break;
				}
			}
		}
		catch(e){ error('rellenarSitio.'+p+': ', e); }
	}
}

//show the corresponding inputs and hide the q no when changing the selector type for a prop of the conf of a site
function cambiaTipo(sel){
	var clave = sel.id.substr('wcr_sitio_tipo_'.length), tipo = sel.value;
	var elems = xpath('//*[starts-with(@id,"wcr_sitio_valor_'+clave+'")]', document, true);
	for(var i=0; i<elems.length; i++)
		elems[i].style.display = elems[i].id.indexOf('_'+tipo)>0 ? '' : 'none';
}

//initialize key values and events
function initTeclas(teclas){
	var input, inputaux, hiddens = ['keyCode', 'ctrlKey', 'shiftKey', 'altKey'];
	teclado = getTeclas(); //in case they changed the conf from another page
	for(var t in teclas){
		var teclasAlternativas = teclado[t] || [{}];
		if(!isArray(teclasAlternativas)) teclasAlternativas = [teclasAlternativas];
		for(var i=0; i<2; i++){
			input = get('wcr_tecla_'+i+'_'+t);
			var tecla = teclasAlternativas[i] || {};
			input.value = tecla.name || '';

			for(var h=0; h<hiddens.length; h++){
				inputaux = document.createElement('input');
				inputaux.type = 'hidden';
				inputaux.id = input.id + '_' + hiddens[h];
				inputaux.value = tecla[hiddens[h]] || 'false';
				input.parentNode.insertBefore(inputaux, input);
			}

			setEvt(input, 'keydown', function(evt){
				if(evt.keyCode >= 16 && evt.keyCode <= 18 || evt.keyCode == 27) return; //ctrl/shift/alt or ESC (works weird?)

				if(evt.keyCode == 8){ //BACKSPACE, leave the action without a key
					for(var h=0; h<hiddens.length; h++)
						get(evt.target.id+'_'+hiddens[h]).value = '';
					evt.target.value = '';
				}
				else{
					for(h=0; h<hiddens.length; h++)
						get(evt.target.id+'_'+hiddens[h]).value = evt[hiddens[h]];
					evt.target.value = nombreTecla(evt);
				}
				evt.stopPropagation();
				evt.preventDefault();
			});
			setEvt(input, 'keypress', function(evt){
				if(evt.keyCode != 8)
					evt.target.value = nombreTecla(evt);
				evt.stopPropagation();
				evt.preventDefault();
			});
		}
	}
}

//generate the html of the layout conf
function htmlLayout(ops, nombre){
	var html =
		'<table id="wcr_'+nombre+'_tabla">'+
			'<tr class="wcr_settings_group">'+
				'<td></td>'+
				'<td>Default settings</td>'+
				'<td>Settings for '+document.location.host.replace(/^www\./, '')+'</td>'+
			'</tr>';
	for(var o in ops){
		var op = ops[o];
		if(!o.indexOf('_grp_')){
			html +=
				'<tr class="wcr_settings_group">'+
					'<td colspan="3" title="'+(op.title || '')+'">'+op.desc+'</td>'+
				'</tr>';
		}
		else{
			var opts = '';
			if(op.vals) for(var v in op.vals){
				opts += '<option value="'+v+'"'+
					(o.indexOf('cursor_') ? '' : (' style="cursor:'+confCursor(null, null, v)+'"'))+
					'>'+op.vals[v]+'</option>';
			}

			html +=
				'<tr>'+
					'<td title="'+(op.title || '')+'">'+op.desc+'</td>'+
					'<td>'+ (op.vals ?
						('<select id="wcr_sel_layout_'+o+'_def">'+opts+'</select>') :
						('<input id="wcr_sel_layout_'+o+'_def"/>')
					)+'</td>'+
					'<td>'+ (op.vals ?
						('<select id="wcr_sel_layout_'+o+'">'+
							'<option value="">Use default settings</option>'+opts+
						'</select>') :
						('<input id="wcr_sel_layout_'+o+'" title="leave empty to use default settings"/>')
					)+'</td>'+
				'</tr>';
		}
	}
	html += '</table>';
	// be able to hide divs / buttons? (first / last, bookmarks, last visited, toggle layout)
	// if things are hidden, make sure they don't fail when trying to use them

	return html;
}

//generate the html of the site conf
function htmlSitio(props){
	var html =
		'<div>Current site settings: '+
			'<select id="wcr_sel_confpag">'+
				'<option value="new">New custom settings</option>'+
				'<option value="dis">Disable '+document.location.host.replace(/^www\./, '')+'</option>'+
			'</select>'+
			'<button id="wcr_btn_editconfpag">Edit</button>'+
			'<button id="wcr_btn_delconfpag">Delete</button>'+
		'</div><br/><table id="wcr_sitio_tabla">';
	for(var p in props){
		html += '<tr id="wcr_tr_sitio_'+p+'"><td title="'+(props[p].title || '')+'">'+props[p].desc+'</td>';
		if(p=='extra') html += '<td><button id="wcr_btn_add_extra">Add extra content</button></td><td/></tr>';
		else{
			var tds = tdsConfSitio(p, props[p]);
			html += '<td>'+tds[0]+'</td><td style="width:400px">'+tds[1]+'</td></tr>';
		}
	}
	html += '</table><br/>Hover over a textbox for its meaning and an explanation on how to use it<br/><br/>For a detailed guide on adding new sites, check <a href="http://userscripts-mirror.org/topics/86377#posts-380342">this thread</a> in the script site';
	/*todo:
		add tests
			4th `td` with test button and an invisible `tr` below for the result
			request link [posActual] and apply that getter
		to be able to export / import this thing
			to be able to export this site or all customs
			to merge repeated asking if to keep the current or imported
	*/

	return html;
}

//returns the "innerhtml"s of the "tds" to specify the content
function tdsConfSitio(p, prop){
	var tds = ['', ''];
	for(var t in prop.tipos) tds[0] += '<option value="'+t+'">'+prop.tipos[t].desc+'</option>';
	tds[0] = '<select id="wcr_sitio_tipo_'+p+'">'+tds[0]+'</select>';
	for(t in prop.tipos) for(var v in prop.tipos[t]){
		if(v=='desc') continue;
		tds[1] += '<'+prop.tipos[t][v].elem+' id="wcr_sitio_valor_'+p+'_'+t+'_'+v+'"';
		for(var a in prop.tipos[t][v]) if(a!='elem' && a!='html') tds[1] += ' '+a+'="'+prop.tipos[t][v][a]+'"';
		tds[1] += prop.tipos[t][v].html ? '>'+prop.tipos[t][v].html+'</'+prop.tipos[t][v].elem+'>' : (prop.tipos[t][v].elem == 'textarea' ? '></textarea>' : '/>');
	}
	return tds;
}

//insert a `tr` to add more extra content
function trExtraConfSitio(p, prop){
	var tr = document.createElement('tr');
	tr.className = 'wcr_extras';
	tr.id = 'wcr_tr_sitio_'+p;
	var tds = [
		document.createElement('td'),
		document.createElement('td'),
		document.createElement('td')];
	var tdsConf = tdsConfSitio(p, prop);
	tds[0].innerHTML =
		'<div style="float:right">'+
			'<button id="wcr_btn_up_'+p+'">&#8593;</button>'+
			'<button id="wcr_btn_down_'+p+'">&#8595;</button>'+
			'<button id="wcr_btn_del_'+p+'">Delete</button>'+
		'</div>';
	tds[1].innerHTML = tdsConf[0];
	tds[2].innerHTML = tdsConf[1];
	tr.appendChild(tds[0]);
	tr.appendChild(tds[1]);
	tr.appendChild(tds[2]);

	var trAfterExtra = get('wcr_tr_sitio_xelem');
	trAfterExtra.parentNode.insertBefore(tr, trAfterExtra);

	var seltipo = get('wcr_sitio_tipo_'+p);
	setEvt(seltipo, 'change', function(evt){
		cambiaTipo(evt.target);
	});
	setEvt('wcr_btn_del_'+p, 'click', function(evt){
		var tr = evt.target.parentNode.parentNode.parentNode;
		tr.parentNode.removeChild(tr);
	});
	setEvt('wcr_btn_up_'+p, 'click', function(evt){
		var tr = evt.target.parentNode.parentNode.parentNode;
		var otro = tr.previousSibling;
		if(otro.id.indexOf('wcr_tr_sitio_extra_')===0){
			tr.parentNode.insertBefore(tr, otro);
		}
	});
	setEvt('wcr_btn_down_'+p, 'click', function(evt){
		var tr = evt.target.parentNode.parentNode.parentNode;
		var otro = tr.nextSibling;
		if(otro.id.indexOf('wcr_tr_sitio_extra_')===0){
			tr.parentNode.insertBefore(otro, tr);
		}
	});
}

//generate the html of the keyboard conf
function htmlTeclas(teclas){
	var html = '<table id="wcr_teclas_tabla">'+
			'<tr class="wcr_settings_group">'+
				'<td/>'+
				'<td>Key</td>'+
				'<td>Alternate Key</td>'+
			'</tr>';
	for(var t in teclas)
		html +=
			'<tr>'+
				'<td title="'+teclas[t][1]+'">'+teclas[t][0]+'</td>'+
				'<td><input id="wcr_tecla_0_'+t+'"/></td>'+
				'<td><input id="wcr_tecla_1_'+t+'"/></td>'+
			'</tr>';
	html += '</table><br/>Press BackSpace to unset a key';

	return html;
}

//save everything from the configuration screens
function guardarSettings(teclas, props, tiposUp, opsLayout){
	try{
		//save keys
		var hiddens = ['keyCode', 'ctrlKey', 'shiftKey', 'altKey'];
		for(var t in teclas){
			teclado[t] = [];
			for(var i=0; i<2; i++){
				teclado[t][i] = {
					name: get('wcr_tecla_'+i+'_'+t).value,
					keyCode: get('wcr_tecla_'+i+'_'+t+'_keyCode').value
				};
				for(var h=1; h<hiddens.length; h++)
					teclado[t][i][hiddens[h]] = get('wcr_tecla_'+i+'_'+t+'_'+hiddens[h]).value == 'true';
			}
		}
		setData('teclas', teclado, 'default');

		//save layout
		for(var o in opsLayout){
			if(!o.indexOf('_')) continue;

			var valdef = get('wcr_sel_layout_'+o+'_def').value;
			var val = get('wcr_sel_layout_'+o).value;

			if(o.indexOf('prefetch_')<0 || valdef.match(/^\d+$/) && Number(valdef)>0)
				setData(o, valdef, 'default');

			if(o.indexOf('prefetch_')<0 || val === '' || val.match(/^\d+$/) && Number(val)>0){
				if(val != '') setData(o, val);
				else delData(o);
			}
		}

		//save site
		var conf = unescape(get('wcr_sel_confpag').value);
		if(conf == '' || conf[0]=='d') setData('confpag', conf);
		else{ //es new o un custom
			var ok = true;
			var tipourl = get('wcr_sitio_tipo_url').value;
			var nombre = 'c'+tipourl[0]+':'+get('wcr_sitio_valor_url_'+tipourl+'_val').value;
			var customPag = {};
			for(var p in props){
				if(p=='extra'){
					try{
						var xx = [];
						var extras = selCss('tr.wcr_extras', document, true);
						for(var i=0; i<extras.length; i++){
							try{
								var p2 = extras[i].id.match(/extra_\d+$/)[0];
								var x = parsearElementoConfSitio(p2);
								if(x) xx.push(x);
							}catch(e){ ok = false; }
						}
						customPag[p] = xx;
					}catch(e){}
				}
				else{
					try{
						var x = parsearElementoConfSitio(p);
						if(x) customPag[p] = x;
					}catch(e){ ok = false; }
				}
			}

			if(!ok) return false;

			var customs = getData('confpags', {}, 'custompages');
			if(conf[0]=='c' && conf!=nombre) delete customs[conf];
			customs[nombre] = customPag;
			setData('confpags', customs, 'custompages');
			setData('confpag', nombre);
		}
	}catch(e){
		alert('Error saving the settings: ' + e);
		return false;
	}
	return true;
}

//read the configuration entered in the inputs and convert it into {type, value}
function parsearElementoConfSitio(p){
	var ok = true;
	var tipo = get('wcr_sitio_tipo_'+p).value;
	if(tipo == 'def') return false;
	var valor;
	var elems = xpath('//*[starts-with(@id,"wcr_sitio_valor_'+p+'_'+tipo+'")]', document, true);

	//types: str, re, xp, fn, bool, num?
	switch(tipo){
		case 'str':
			valor = elems[0].value;
			break;
		case 're':
			valor = [];
			try{
				var re;
				if(!elems[0].value.match(/^\/.+\/[gmi]*$/)) elems[0].value = '/'+elems[0].value+'/';
				eval('re = '+elems[0].value);
				var tipore = Object.prototype.toString.call(re);
				if(tipore != "[object RegExp]") throw new Error(tipore);
				valor.push(elems[0].value);
			}catch(e){
				alert(p+': "'+elems[0].value+'" is not a valid regular expression ('+e+')');
				ok = false;
			}
			if(elems.length>1){
				if(!elems[1].value.match(/^\d+$/) || Number(elems[1].value)===0){
					alert(p+': "'+elems[1].value+'" is not a valid number');
					ok = false;
				}
				else valor.push(Number(elems[1].value));
			}
			break;
		case 'xp':
		case 'css':
			valor = [elems[0].value];
			if(elems[1] && elems[1].value){ //if it's an array ...
				valor.push(elems[2].value);
				if(elems[4].value && !elems[3].value) elems[3].value = '0';
				if(elems[3].value){
					var num = Number(elems[3].value);
					if(!elems[3].value.match(/^[-\d]+$/) || isNaN(num)){
						alert(p+': "'+elems[3].value+'" is not a valid number');
						ok = false;
					}
					else valor.push(num);
				}
				if(elems[4].value){
					num = Number(elems[4].value);
					if(!elems[4].value.match(/^[-\d]+$/) || isNaN(num)){
						alert(p+': "'+elems[4].value+'" is not a valid number');
						ok = false;
					}
					else valor.push(num);
				}
			}
			if(tipo=='css') valor = [valor];
			break;
		case 'fn':
			valor =
				xpath('//select[@id="wcr_sitio_tipo_'+p+'"]/option[@value="fn"]').innerHTML+'{\n'+
				elems[0].value + '\n}';
			try{ eval('f='+valor); }
			catch(e){
				alert(p+': "'+valor+'" is not a valid function ('+e+')');
				ok = false;
			}
			break;
		case 'bool':
			valor = elems[0].value == 'true';
			break;
		case 'num':
			valor = Number(elems[0].value);
			if(isNaN(valor)){
				alert(p+': "'+elems[0].value+'" is not a valid number');
				ok = false;
			}
			break;
	}

	if(p=='url'){
		if(!valor){
			alert('url: this field is obligatory');
			ok = false;
		}
		else{
			if(tipo=='str') re = strToRegexp(valor);
			else eval('re = '+elems[0].value);
			if(!document.location.href.match(re)){
				alert('url: the expression '+elems[0].value+' doesn\'t match the current URL');
				ok = false;
			}
		}
	}
	if(!ok) throw new Error('error');

	return {tipo: tipo, valor: valor};
}

//hide the other tabs and display a specific one (passed)
function cambiarTabSettings(nombre){
	var tabs = xpath('//div[@id="wcr_settings_content"]/div', document, true);
	for(var i=0; i<tabs.length; i++) tabs[i].style.display = 'none';

	xpath('//div[@class="'+nombre+'"]').style.display = '';
	var spans = xpath('//div[@id="wcr_settings_links"]/span', document, true);
	for(i=0; i<spans.length; i++){
		spans[i].style.fontWeight = 'normal';
		spans[i].style.backgroundColor = '';
	}
	var span = xpath('//span[@class="'+nombre+'"]');
	span.style.fontWeight = 'bold';
	span.style.backgroundColor = '#ff0';

	//setear el porte y posicion
	var popup = get('wcr_settings_popup');
	var top = document.documentElement.scrollTop;
	if(!top) top = document.body.scrollTop;
	popup.style.top = (top+10) + 'px';
	popup.style.marginLeft = -popup.offsetWidth/2 + 'px';

	tabSettingActual = nombre;
}

//look for the configuration corresponding to this page
function getConfPagina(conf){
	try{
		var lista = conf=='lista';
		if(conf===undefined) conf = getData('confpag', '');
		if(conf == 'dis') return null;

		var url = document.location.href;
		var pags = [];
		var customs = getData('confpags', {}, 'custompages');

		if(conf && !lista){ //you want a specific one
			if(customs[conf]){
				var pu = conf.substr(3);
				if(conf[1] == 'r') eval('pu='+pu);
				else pu = strToRegexp(pu);

				if(url.match(pu)){
					var pag = parsearPaginaCustom(customs[conf]);
					pag.nombre = conf;
					return pag;
				}
			}
			else{
				for(var i = 0; i < paginas.length; i++){
					pag = paginas[i];
					pu = pag.url;
					pu = (typeof(pu)=='string' ? 'ds:' : 'dr:') + pu;
					if(pu == conf){
						pag.nombre = conf;
						return pag;
					}
				}
			}
			//can't find the one requested. If it was the one that had been configured, reset the conf
			//if(conf == getData('confpag', '')) delData('confpag');
		}

		//if not configured or the desired configuration was not found, first search customs
		for(var p in customs){
			pu = p.substr(3);
			if(p[1] == 'r') eval('pu='+pu);
			else pu = strToRegexp(pu);

			if(url.match(pu)){
				pag = parsearPaginaCustom(customs[p]);
				pag.nombre = p;
				if(!lista) return pag;
				pags.push(p);
			}
		}

		//if still can't find (or want the list of all the confs that match), keep looking
		for(i = 0; i < paginas.length; i++){
			pag = paginas[i];
			pu = pag.url;
			if(typeof(pu)=='string') pu = strToRegexp(pu);

			if(url.match(pu)){
				p = (typeof(pag.url)=='string' ? 'ds:' : 'dr:') + pag.url;
				pag.nombre = p;
				if(!lista) return pag;
				pags.push(p);
			}
		}
		if(!lista) return {nombre:''};
		return pags;
	}
	catch(e){
		error('getconfpag: ' , e);
		return {};
	}
}

//to match an url, convert a string value to regexp
function strToRegexp(url){
	url = url.replace(/[-[\]{}()+?.,\\^$#\s]/g, "\\$&");
	url = url.replace(/\*\\\./g, '([\\w-]+\\.)?'); //'*.hola.com' matches 'asd.hola.com' an 'hola.com', but not 'chao.com/hola.com'
	url = url.replace(/\*/g, '.*');

	var urls = url.split('|');
	for(var j=0; j<urls.length; j++){
		if(!urls[j].match(/^https?:\/\//)){
			if(urls[j].match(/^[^.\/]+\\\.\w*(\/|$)/)) urls[j] = '(www\\.)?' + urls[j];
			urls[j] = '^https?://' + urls[j];
		}
		urls[j] = '('+urls[j]+')';
	}
	return new RegExp(urls.join('|'));
}

function printarPaginaCustom(custom){
	changeQuote = function(x) { // Changes a double quoted string to a single quoted one
		return x.replace(/\\"/g, '"').replace(/\'/g, "\\'").replace(/^"|"$/g, "'");
	};

	function indent(x, n) {
		var indention = new Array((n||0) + 1).join("\t");
		return x.toString().replace(/\n/g,'\n'+ indention);
	}

	function pretty(y) {
		if (y.tipo == "str") return  changeQuote(JSON.stringify(y.valor));
		if (typeof(y) == "string") return changeQuote(JSON.stringify(y));
		else if (y.tipo == "fn") return indent(y.valor,4);
		else if (y.tipo == "xp" || y.tipo == "css" || y.tipo == "bool") return JSON.stringify(y.valor).replace(/"(?:[^"\\]|\\.)*"/g, changeQuote);
		else { // It is an array
			//console.log(y);
			var z = y.map(pretty);
			return "[" + indent(z,7) + "]";
		}
	}

	var z = "\n";
	var x = custom;
	z += "\t{\n";
	for (var i in x) {
		if (x[i].length === 0) continue;
		var z1 = "\t\t" + i + ":\t" + pretty(x[i]) + ",\n";
		z += z1;
	}
	z += "\t},\n";

	// console.log("\n@import\t" + custom.url.valor + "*");
	console.log("Using custom settings: " + z);
}

//receives the page in the format in which it is stored in the conf, and returns it in the format used in pages[i]
function parsearPaginaCustom(custom){
	try {printarPaginaCustom(custom);} catch(e) {console.error(e);}
	var pag = {};
	for(var p in custom){
		if(p == 'extra'){
			var x = [];
			for(var i=0; i<custom[p].length; i++) x.push(parsearPropCustom(custom[p][i], p));
			pag[p] = x;
		}
		else pag[p] = parsearPropCustom(custom[p]);
	}
	return pag;
}

//read a property in jsoneable format and leave it in standard format
function parsearPropCustom(prop, p){
	var tipo = prop.tipo;
	var valor = prop.valor;
	switch(tipo){
		case 're':
			eval('valor[0] = '+valor[0]);
			if(p=='url') valor=valor[0];
			break;
		case 'fn':
			eval('valor = '+valor);
			break;
	}
	return valor;
}

//see if chrome/safari engine is used
function isWebKit(){
	return navigator.userAgent.indexOf('WebKit/')>0;
}

//see if the firefox engine is used
function isFirefox(){
	return navigator.userAgent.indexOf('Gecko/')>0;
}

//configuration screen that appears when zoom is enabled but is not configured
function mostrarSettingsZoom(){
	try{
		var html = '';
		var cbs = {
			achw:	'Shrink wide images to fit in the width of the screen',
			achh:	'Shrink high images to fit in the height of the screen',
			agrw:	'Expand narrow images to use the width of the screen',
			agrh:	'Expand short images to use the height of the screen'
		};
		for(var p in cbs)
			html += '<input type="checkbox" id="wcr_set_cb_'+p+'"/> '+
				'<label for="wcr_set_cb_'+p+'">'+cbs[p]+'</label><br/>';

		var txts = {
			bordex:	'Pixels to leave as a border to the left and right',
			bordey:	'Pixels to leave as a border above and below the image'
		};
		for(p in txts) html += '<input id="wcr_set_txt_'+p+'" size="2"> '+txts[p]+'<br/>';

		html += '<br/><input type="checkbox" id="wcr_set_cb_def"/> '+
				'<label for="wcr_set_cb_def">Use these settings as the default for every site</label><br/>';

		var divsets = document.createElement('div');
		divsets.id = 'wcr_settings';
		divsets.style.textAlign = 'center';
		divsets.innerHTML =
			'<div style="position:fixed; z-index:232322; background:#000; top:0; left:0; right:0; bottom:0; opacity:0.8;"></div>'+
			'<div id="wcr_settings_popup" style="position:absolute; left:50%; z-index:232323; background-color:#fff; color:#000; padding: 20px;">'+
				'<div>How do you want the images to be fitted?</div><hr/>'+
				'<div id="wcr_settings_content" style="text-align:left">'+html+'</div><br/>'+
				'These (and more) settings can be changed later by clicking the "Settings" button<hr/>'+
				'<div>'+
					'<button id="wcr_set_btn_guardar" style="width:100%">Save settings</button><br/>'+
					'<button id="wcr_set_btn_disable">Disable script for this site</button>'+
				'</div>'+
			'</div>'+
			'<style>'+
				'#wcr_settings_popup *{color:#000;}'+
				'#wcr_settings_popup input, #wcr_settings_popup select, #wcr_settings_popup textarea{background-color:#fff;}'+
				'div{position:static; float:none;}'+
			'</style>';
		document.body.appendChild(divsets);

		// set the size and position
		var popup = get('wcr_settings_popup');
		var top = document.documentElement.scrollTop;
		if(!top) top = document.body.scrollTop;
		popup.style.top = (top+10) + 'px';
		popup.style.marginLeft = -popup.offsetWidth/2 + 'px';

		//initialize values
		for(p in cbs){
			eval('var x = '+p);
			get('wcr_set_cb_'+p).checked = x;
		}

		setEvt('wcr_set_btn_guardar', 'click', function(){
			//save the confs and set the variables
			var dom = get('wcr_set_cb_def').checked ? 'default' : undefined;
			for(var p in cbs){
				eval(p+' = '+get('wcr_set_cb_'+p).checked);
				setData(p, get('wcr_set_cb_'+p).checked ? 1 : 0, dom);
			}
			for(p in txts){
				var val = Number(get('wcr_set_txt_'+p).value);
				if(isNaN(val)) continue;
				eval(p+' = '+val);
				setData(p, val, dom);
			}
			document.body.removeChild(divsets);
			fitImagen();
			scrollear();
		});

		setEvt('wcr_set_btn_disable', 'click', function(){
			if(confirm('Are you sure you want to disable Webcomic Reader on this site?\n'+
				'(It can be re-enabled later with the Greasemonkey menu)')){
				setData('confpag', 'dis');
				redirect(link[posActual]);
			}
		});
	}
	catch(e){
		alert('Error while initializing the zoom settings window: ' + e);
		if(get('wcr_settings')) document.body.removeChild(get('wcr_settings'));
	}
}

run_script();
})();

/*
alert(
	0*1+ //'Bug fixes (Firefox)',
	0*2+ //'Bug fixes (Other browsers)',
	0*4+ //'New features',
	0*8+ //'New sites',
	0*16+ //'Fixes for old sites',
	0*32+ //'Graphic changes',
	0*64+ //'New options',
	0*128+ //???
	0
);
*/

/*todo:

	easy way to extract several pages from a single request (blogs, reddit, old pages, etc)
		the img would have to retrieve a list of results
		an extra_context function is added: function (html, pos, relpos) which returns the context on which the extras are searched for each item
		the urls would be filled with ## post-relative-to-the-page
		back / next search for the link normally
		the `prefetcheador` advances the n by one

	be able to define a container for each extra
		[v2] extras: {selector: [things, masks]}
	to be able to make fixed extras (they are filled once and they are not looked for or touched anymore)
		[v2] add a container of fixed extras, fill it in the js or with extras: {fixed container: [function (html, pos) {if (pos) return ''; return selector;}]}
	to be able to read extras by ajax?
		function () {request synchronous}

	In site settings, button to export to copypasteable format to the script

	option to define how many links are preloaded, separated from how many images
		pure html is preloaded, and in a separate process the images
			load link, if (! loadingimg) loadimgs -> first load not loaded and go to N
		select with the pages loaded, differentiating those with img list
		change loaded image condition to change page
			btnback and btnnext do not advance if the next page has not been loaded
			jump straight to a page if it works, and start loading the imgs around
		change condition to take an img of the loaded ones (currently it maintains the current ±23)

	use the magic doc to parse the stuff ajaxeadas, so it does not load the imgs
		make the parser functions receive the html and the doc
		make an htmlToDoc function
		instead of just keeping the imgs in the loaded imgs thing, add the extras

	next/prev chapter (+ keys)

	support AMR in minimalistic?
		have a "do not delete" selector list
		for each "do not delete" item, add it to a list along with its ancestors
		for each item in the list, delete all siblings that are not in the list
		tb could support the Greased Webcomic Manager

	change the way data is recorded (current object grows a lot, mine weighs 50kb)
		1 setting per site
		1 setting with default
		1 setting with the list of all settings

	use a "settings" variable that has all the conf loaded, same as defaultSettings
		replace the random variables that are used now
		use the names that are used to save
			map coherentNames -> savedNames

	remake the code in OOP style
		class that handles the script per se
		class for the conf of a page
		class for settings
		class for settings screen

	to be able to list all the sites that I review in some way
		when saving the last page visited, save: url, title, date, img.src and next
		list with the page and the last date that was reviewed (à la GreasedWebcomicManager?)
			warn that there is a new page if I change the img.src or next
			button to force q to review a page or all of the list
			show a star for favorites, clickable for (un) favorite
			be able to disable sites
		button to switch between see all / favorites / non-favorites
			checks to show [favorites], [non-favorites], [disabled], [new page]
		button to add / remove from favorites
		button to disable script on this site
		button to force check of new page in one / all pages
			just check the ones that don't have a new page
		key to go to the next
		key to go to a random

	"comics of the day" page
		use a special page to redo it (@include *wcr_latest_comics. in ffox about:blank?wcr _..., if not google.com/wcr_... (404))
		with the images of the day of my comics
		each with back / next boy (on the sides and / or click on img)?
		show only the new ones? (mark as read?)
		have next to (hidden?) the complete list of pages

	"fullchapterloader" mode
		show all images one under another
		move forward only
		advance (posActual++, load more pages ...) while scrolling
		show the images and the extra in a div
		put the buttons (settings / change mode) above
		message at the end when there are no more pages (or link to the page without img)

	????: when going back, check if the next one is the same, and if it is not load it in between
		should shift everything back to fill the hole ... or something like that ... so difficult ...
		instead of filling in, advise?

	????: delete the extras on page 0?

	make adding sites easier
		be able to switch between @include * on / off mode
			on: only start on explicitly included pages (if (! getConfPag) break;)
			off: try to always start (like now)
		site settings
			4th column with test button
				in props site have a test element, it can be a function or true for the default
				test default:
					convert to getter and get content as string
					add tr with the result (td [1] "Test results:" align-right, td [2,3] content, td [4] button hide)
		to be able to export / import this variable
			to merge repeated asking if to keep the current or imported
			to be able to export / import all the pages or only this
		to be able to import from other pages (userscripts forum?)
			@include http://userscripts.org/topics/*
			random person posts their exported pages
			the script finds them and clicks them, onclick they are imported
		to centralize this on one page? lemontecho? :P
			random people upload their settings
			can be viewed and imported
			have an "official" configuration maintained by me
				have an autoupdater to download that version
		wizard to add sites
			accessible from the gm menu
			ask to click the image and the links
			load the previous page and follow, and look for img / links that match the ones marked
				search by attributes, patterns, etc?
			then ask the most basic things
			go to the confs editor

	keep saving the messages of the changes of the not notified versions?

	leave the layout more custom-ready-for-what's-good?
		array of layouts
		custom functions for "events" that modify buttons
		instead of "toggle" button, put a select with the layouts

	add pages
		http://www.viruscomix.com/subnormality.html
		include subreddits instead of all reddit

		http://www.harrington-artwerkes.com/Lana5.htm
		http://eecomics.net/?strip_id=152
		http://www.shadowgirlscomic.com/comics/maxmachine-interface/
		http://www.pantheracomic.com/?p=214
		http://dimensiondust.blogspot.com/search?updated-max=2010-06-16T02%3A38%3A00-05%3A00&max-results=1
		http://www.joelcarroll.com/topaz/page-four/
		http://www.yoshcomic.com/latest.php?i=20101201
		http://agirlandherfed.com/1.833.html
		http://www.casualvillain.com/Unsounded/comic/ch02/ch02_27.html
		http://undertow.dreamshards.org/3/u3_13.html
		http://www.sisterclaire.com/comic/chapter-6-comic/chapter-6-the-trials/
		http://sarahzero.com/sz_0588.html
		http://www.colourofivy.com/annyseed_webcomic8.htm
		http://flakypastry.runningwithpencils.com/comic.php?strip_id=326

*/
