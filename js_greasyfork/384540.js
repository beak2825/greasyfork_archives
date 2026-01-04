// ==UserScript==
// @name           Yarolds Close It
// @namespace      Yarolds
// @description    Closes Non Action links at Yarolds, and does Actions then Closes Action links at Yarolds
// @version        5.1.6
// @copyright      2012+
// @homepage	     http://swle.yarold.eu
// @require        http://code.jquery.com/jquery-1.12.4.min.js
// @include        http://fantasyadopts.mysidiahost.com/levelup/warmegg/*
// @include        http://magistream.com/creature/*
// @include        http://magistream.com/family/*
// @include        https://magistream.com/creature/*
// @include        https://magistream.com/family/*
// @include        https://mirrorwood.com/view/*
// @include        https://www.mirrorwood.com/view/*
// @include        http://www.virtuadopt.com/quick_feed.php?id=*
// @include        http://www.virtuadopt.com/feed.php?id=*
// @include        http://www.vdexproject.net/p/*
// @include        http://www.valenth.com/feed/*
// @include        http://torax.outwar.com/*
// @include        http://valenth.com/feed/*
// @include        http://projectnyoka.com/creature/*
// @include        http://www.squiby.net/level/*
// @include        http://squiby.net/level/*
// @include        http://www.my3d-city.com/*
// @include        http://*.dragonadopters.com/*
// @include        http://www.ponyisland.net/*
// @include        http://dragcave.net/image/*
// @include        http://www.dragcave.net/image/*
// @include        http://dragcave.net/user/*
// @include        http://www.dragcave.net/user/*
// @include        http://dragcave.net/view/*
// @include        http://www.dragcave.net/view/*
// @include        http://www.taleofdragons.net/levelup.php?id=*
// @include        http://www.mywarriorcats.com/adoptables/*
// @include        http://www.popoint.fr/lite?eleveur=*
// @include        http://*.antiville.*/*
// @include        http://*.miniville.*/*
// @include        http://*.myminicity.*/*
// @include        http://www.zwars.org/hit.php?id=*
// @include        http://www.petadoptables.com/levelup.php?id=*
// @include        http://www.petadoptables.com/levelup.php
// @include        http://www.eggcave.com/profile/*
// @include        http://www.thesporkedken.com/adopt/levelup.php?id=*
// @include        http://www.skisim.com/index.php?id=donation&user=*
// @include        http://www.shadowedeclipse.com/levelup.php?id=*
// @include        http://www.nemexia.*/*
// @include        http://www.thecrims.com/profile.php?id=*
// @include        http://www.newwar.org/*
// @include        http://www.dnadopts.com/quicklevel.php?id=*
// @include        http://*.emotewar.*/*
// @include        http://www.pkmns.com/levelup.php?id=*
// @include        http://www.zantarni.com/pets/*
// @include        http://www.albisian.x10.mx/adopts/levelup.php?id=*
// @include        http://www.thepikaclub.co.uk/adopt/interact.php?id=*
// @include        http://www.hanf-spiel.de/*
// @include        http://www.squiby.net/adoptions/level/*
// @include        http://www.silvadopts.com/levelup.php?id=*
// @include        http://www.albisian.x10.mx/adopts/levelup.php?id=*
// @include        http://*.ultrasonline.*/*
// @include        http://www.thewar.ro/link.php?nume=*
// @include        http://en.dinoparc.com/*
// @include        http://*.mondozoo.com/*
// @include        http://*.ultrasonline2.*/*
// @include        http://www.arvyre.com/levelup.php?id=*
// @include        http://gpxplus.net/info/*
// @include        http://www.fatherface.com/*
// @include        http://www.silvadopts.com/profile.php?user=*
// @include        http://www.petadoptables.com/levelup.php
// @include        http://www.shadowedeclipse.co.cc/levelup.php?id=*
// @include        http://www.projectnyoka.com/user/*
// @include        http://www.mythicalmoments.net/critter.php?code=*
// @include        http://*.x10.mx/levelup.php?id=*
// @include        http://www.racegame.pl/index.php
// @include        http://*.minitroopers.com/
// @include        http://www.worldofumbria.net/visitAmbry.php?visit_user=*
// @include        http://www.kofk.de/knuffel.php?i=*&d=*
// @include        http://www.popoint.fr/?eleveur=*
// @include        http://www.mythicalmoments.net/album.php?album=*
// @include        http://www.metin2dinastya.com/*
// @include        http://www.blackmu.eu/index.php?op=vote&id=*
// @include        http://filmuljocurilefoamei.ro/profil/*
// @include        http://www.rosedragongardens.com/*
// @include        http://www.icepets.com/*
// @include        http://www.zooreka.com/*
// @include        http://www.thelostrunes.com/*
// @include        http://www.vdexproject.net/p/*/*
// @include        http://flowergame.net/users/login
// @include        http://flowergame.net/view/*
// @include        http://www.worldofumbria.net/view.php
// @include        http://www.outcraft.com/login.php
// @include        http://www.thedarkageofwythia.com/linkconfigure.php?link=*
// @include        http://www.gangstatime.be/click.php?x=*
// @include        http://berlin.pennergame.de/change_please/*
// @include        http://*.gangsters.pl/index.php?polec=*
// @include        http://www.thesporkedken.com/adopt/profile.php?user=*
// @include        http://www.crimebombs.com/
// @include        http://www.extazy-mu.eu/index.php?id=*
// @include        http://www.straatcrimineel.nl/klik.php?x=*
// @include        http://www.klick-game.de/*
// @include        http://magistatic.com/i/*
// @include        http://www.thedarkageofwythia.com/linkconfigure.php?link=*
// @include        http://www.gangstatime.be/click.php?x=*
// @include        http://rsm.actionarul.ro/g.php?ac=g&id=*
// @include        http://www.thecrims.com/*
// @include        http://www.elitamafiei.ro/login.php
// @include        http://www.tutorialul.net/*
// @include        http://*.myadopts.com/levelup.php?id=*
// @include        http://www.straatcrimineel.nl/klik.php?x=*
// @include        http://www.familiamafia.ro/*
// @include        http://www.virtuadopt.com/viewadopts.php?id=*
// @include        http://www.virtuadopt.com/viewadopts.php?box=*&id=*
// @include        http://www.hatchingdragons.com/ham/levelup.php?id=*
// @include        http://change.dossergame.co.uk/change_please/*
// @include        http://*.ladnok.*/robbers/me/*/*
// @include        http://*.99webs.info/levelup.php?id=*
// @include        http://thepokemonranch.co.cc/levelup.php?id=*
// @include        http://www.thepokemonranch.co.cc/levelup.php?id=*
// @include        http://www.acitius.com/profile.php?pet=*
// @include        http://www.global-zone.ro/concurs/frag.php?player=*
// @include        http://sylverfox.net/badge.php?username=*
// @include        http://www.chickensmoothie.com/viewpet.php?id=*
// @include        http://gamebattles.majorleaguegaming.com/profile/*
// @include        http://www.rattiesftw.com/levelup.php?id=*
// @include        http://fusemon.net/monster.php?id=*
// @include        http://*.gladiatus.*/game/index.php?mod=start&submod=catch&uid=*
// @include        http://www.mythrai.com/*
// @include        http://www.dragonopia.com/page/levelup?id=*
// @include        http://squiby.net/adoptions/level/*
// @include	   http://www.rls.lt*
// @include	   http://terramonsters.com/*
// @include	   http://www.vdexproject.net/*
// @include	   http://www.celestialvale.com/Feeding=*&nid=*
// @include	   http://www.celestialvale.com/admire=*&nid=*
// @include	   http://www.celestialvale.com/play=*&nid=*
// @include        http://www.celestialvale.com/critter=*
// @include        http://celestialvale.com/critter=*
// @include        http://www.worldbattleground.com/recruit.php?id=*
// @include        http://taleofdragons.net/levelup.php?id=*
// @include        http://www.districtwars.net/register.php?REF=*
// @include        http://s*.leagueofhooligans.com/
// @include        http://w*.de.mymagictales.com/?bonusId=*
// @include        http://www.carddex-ptc.de/PokePage.php?id=*
// @include        http://www.boopets.com/scare.php?clingableid=*
// @include        http://www.eggcave.com/egg/*.png
// @include        http://www.keprouty.net/abladopts/levelup.php?id=*
// @include        http://www.dragosien.de/*
// @include        http://www.carddex-ptc.de/*
// @include        http://www.roguerpg.com/index.php
// @include        http://w*.gondal*
// @include        http://dragcave.net/lineage/*
// @include        http://www.virtuadopt.com/403.php
// @include        http://giveadamn.co.uk/give/*
// @include        http://www.celestialvale.com/Trick%20Or%20Treat=*
// @include        http://*.gallendor.com/index.php?robber&id=*&code=*
// @include        http://*.gallendor.de/index.php?robber&id=*&code=*
// @include        http://quiz.ravenblack.net/blood.pl?biter=*
// @include        http://s*.emotewar.net/users.php?user=*
// @include        http://www.keprouty.net/salamanders/levelup.php?id=*
// @include        http://emotewar.org/users.php?user=*
// @include        http://www.generalsofarmageddon.com/click.php?ID=*
// @include        http://www.khanwars.com/?recruit=*
// @include        http://www.unrealwars.com/clickbattle.php?id=*
// @include        http://schoolgame.pl/?gift=*
// @include        http://www.knastvoegel.de/profile/
// @include        http://www.albisian.com/levelup.php?id=*
// @include        http://www.sylverfox.net/*
// @include        http://www.mafiavirtuala.net/v3/index.php?a=click&x=*
// @include        http://www.growasig.com/pet.php?pet=*
// @include        http://www.verpets.com/pets/verbies/click/*/*/feed
// @include        http://www.verpets.com/pets/verbies/click/*/*/play
// @include        http://www.verpets.com/pets/verbies/click/*/*/love
// @include        http://www.virtuadopt.com/feed.php?id=*&check=*
// @include        http://www.esmesprotectors.com/creature.php?id=*
// @include        http://pets.epona-rule.com/viewPet.php?id=*
// @include        http://poke-life.net/pokemon.php?p=*
// @include        http://www.sylestia.com/view/pets/?petid=*
// @include        http://silvadopts.com/levelup.php?id=*
// @include        http://silvadopts.com/levelup?id=*
// @include        http://taleofdragons.net/levelup?id=*
// @include        http://www.fatsogame.net/Fed.php?ID=*
// @include        http://www.intothevale.com/pet=*&fed=*
// @include        http://www.intothevale.com/critter.php?cid=*
// @include        http://projectuniverse.fatsogame.net/link.php?id=*
// @include        http://www.planetbattleground.com/recruit2.php
// @include        http://www.projectuniverse.net/link.php?id=*
// @include        http://www.seriousdragonadoptions.com/adopts/levelup.php?id=*
// @include        http://poliwager.net/error403.shtml
// @include        http://www.wythia.com/linkconfigure.php?link=*
// @include        http://caterpillarcave.x10.mx/levelup/click/*
// @include        http://mytweetbudgie.com/home/levelup/click/*
// @include        http://www.valleyofunicorns.com/pet=*
// @include        http://www.valleyofunicorns.com/critter.php?cid=*
// @include        http://round3.futurerp.net/link.php?id=*&pg_hash=*
// @include        http://www.pokeheroes.com/interact.php?action=warm*
// @include        http://www.ribkite.net/f.php?f=*
// @include        http://www.pokeheroes.com/interact.php?action=train*
// @include        http://www.pokeheroes.com/interact.php?id=*&action=direct
// @include        http://www.felkyocreatures.com/levelup.php?id=*
// @include        http://forestofmirrors.x10.mx/levelup/click/*
// @include        http://www.mirrorwood.com/view/*
// @include        http://www.clickcritters.com/adoptables.php?act=doRareCandy&id*
// @include        http://www.forgottenrealm.us/creature/*
// @include        http://www.pokeheroes.com/interact.php?id=*&action=direct
// @include        http://www.gothicat-world.com/*
// @include        http://www.grophland.com/get_item.php?id=*
// @include        http://www.pokeheroes.com/interact.php?action=feed*
// @include        http://pokeheroes.com/interact.php?id=*&action=direct*
// @include        http://pokeheroes.com/interact.php?action=warm*
// @include        http://pokeheroes.com/interact?action=warm&id=*
// @include        http://pokeheroes.com/interact?action=train&id=*
// @include        https://www.eggcave.com/@*
// @include        http://www.valleyofunicorns.com/Horse/*
// @include        https://www.carddex-ptc.de/TeamPage.php?id=*
// @include        http://taleofostlea.net/login
// @include        http://taleofostlea.net/welcome
// @include        http://www.futurerp.net/pages/link.php?id=*
// @include        http://taleofostlea.net/levelup/click*
// @include        https://www.carddex-ptc.de/PokePage.php?id=*
// @include        http://www.mysgardia.com/levelup/click/*
// @include        http://www.valleyofunicorns.com/Player/*
// @include        https://www.virtuadopt.com/pc.php?do=feed&id=*
// @include        http://magistream.com/user/*
// @include        https://magistream.com/user/*
// @include        https://www.virtuadopt.com/feed.php?id=*
// @include        https://www.eggcave.com/egg/*
// @include        https://eggcave.com/egg/*
// @include        https://twitter.com/Virtuadopt
// @include        https://gothicat-world.com/
// @include        https://www.xanje.com/pet/*
// @include        https://dragcave.net/login
// @include        https://dragcave.net/view/*
// @include        https://gothicat-world.com/creatures/detail/*
// @include        https://dragcave.net/user/*
// @include        http://www.felisfire.com/?ref=*
// @include        https://tamanotchi.world/*
// @include        http://sigil.outwar.com/profile?id=*
// @include        http://forestofmirrors.x10.mx/levelup/quick/*
// @include        http://pokeheroes.com/interact?id=*
// @include        http://www.samuraiwar.org/page.php?x=*
// @include        http://www.samuraiwar.org/*
// @include        http://www.owlforest.kr/forest/levelup/group/*
// @include        http://www.petadoptables.com/levelup.php?id=*
// @include        http://taleofostlea.net/profile/view/*
// @include        http://www.dnadopts.com/epsilons/level/*
// @include        http://www.aywas.com/register/referral/*
// @include        http://www.leayph.com/index.php?referral=*
// @include        https://www.sylestia.com/register/?referral=*
// @include        https://pokefarm.com/summary/*
// @include        https://ohudogs.com/?dog=*
// @include        http://*.grepolis.com/start/*
// @include        http://www.khanwars.*.*
// @include        http://www.petadoptables.com/register.php?referral=*
// @include        http://*.minitroopers.com/*
// @include        http://www.alphabounce.com/?ref=*
// @include        http://www.hfest.net/?ref=*
// @include        http://www.kadokado.com/?ref=*
// @include        http://www.spybattle.com/index.php?referer=*
// @include        http://*.draugas.lt/?recruit=*
// @include        https://signup.leagueoflegends.com/en/signup/index?ref=*
// @include        http://www.nurya.pl/Main/Thief/Teahouse/*/*
// @include        http://www.elitamafiei.ro/inregistrare-*
// @include        http://eu4.battlestar-galactica.bigpoint.com/?invID=*
// @include        http://www.riseoftartaros.com/refer.php?x=*
// @include        http://en.dinorpg.com/?ref=*
// @include        http://www.sawrpg.com/homelogin.php?xreferer=*
// @include        http://www.kingsofchaos.com/recruit.php?uniqid=*
// @include        http://*.gangsters.pl/index.php?ref=*
// @include        http://www.kingdomsofpower.com/register.php?ref=*
// @include        http://ovipets.com/#!/?ref=*
// @include        http://www.povesteanoastra.ro/signup.php?rec=*
// @include        http://www.puppetnightmares.com/index.php?sh=*
// @include        http://www.ra.aderanwars.com/index.php?vars=*
// @include        http://www.marapets.com/refer.php?id=*
// @include        http://www.gangsters.pl/index.php?id=*
// @include 	   http://www.khanwars.*/?recruit=*
// @include 	   http://khanwars.axeso5.com/
// @include	   http://www.l2infernons.eu/invite/index.php?invite=*
// @include        http://dragcave.net/image/*
// @include        http://www.slick-sleeve.*/enlist/*
// @include        http://s*.gladiatus.ro/game/index.php?uid=*
// @include        http://www.combatgrounds.com/page.php?id=*
// @include        http://s2.*.gladiatus.com/game/index.php?uid=*
// @include        http://www.travian.us/?uc*
// @include        http://www.travian.ro/?uc=*
// @include        http://www.shero.goodluckwith.us/frag.php?player=*
// @include        http://www.freeleaguecodes.com/ref/?id=*
// @include        http://www.erepublik.com/*
// @include        http://www.gallendor.com/index.php?register&refid=*
// @include        http://www.2fight.com/en/index.php?par_num=*
// @include        http://www.elementalwar.com/login.php
// @include        http://www.daysofevil.com/opfern.php?un*
// @include        http://http://l.uprisingempires.com/l/2/?r=*
// @include        http://en.forgeofempires.com/?invitor_id=*&world_id=en7&ref=player_invite_email
// @include        http://www.hanovete.com/?recruit=*
// @include        http://www.mafiavirtuala.net/v3/register.php?a=click&x=*
// @include        http://www.aywas.com/register/referral/*
// @include        http://www.wantedthegame.com/?u=*
// @include        http://www.vdtruck.net/?reffer=*
// @include        http://www.prinochiistrazii.3x.ro/click.php?x=*
// @include        http://www.paladore.com/?ref=*
// @include        http://www.torn.com/?r=*
// @include        http://www.clanuri.net/register/*
// @include        http://beastkeeper.com/register/*
// @include        http://www.mfo2.pl/?ref_id=*
// @include        http://www.valleyofunicorns.com/Join=*
// @include        http://www.subeta.net/?refer=*
// @include        http://www.nemexius.com/?recruit=*
// @include        http://www.guerrakhan.com/?recruit=*
// @include        http://www.grophland.com/welcome/signup.php?referrer=*
// @include        http://www.knightscountry.com/register.php?REF=*
// @include        http://www.lioden.com/register.php?r=*
// @include        http://s11.es.gladiatzus.gameforge.com/game/index.php?uid=*
// @include        http://g2.gangsters.pl/indexB.php?ref=*
// @include        http://prisonwars.pl/458272/
// @include        http://www.valleyofunicorns.com/home
// @include        https://www.miniconomy.com/
// @include        http://flowergame.net/greenhouse/*
// @include        http://www.giveadamn.co.uk/give/*
// @include        http://www.owlforest.kr/forest/levelup/click/*
// @include        http://www.monzoo.net/myzoo.php?pseudo=*
// @include        https://gpx.plus/info/*
// @include        https://gpx.plus/user/*
// @include        http://pokeheroes.com/userprofile?name=*
// @include        https://dragcave.net/lineage/*
// @include        http://www.poliwager.net/adopt/levelup.php?id=*
// @include        http://horus.nemexia.com/
// @include        http://www.darkthrone.com/recruiter/outside/*
// @include        http://flowergame.net/flowers/garden/*
// @include        http://www.mamafia.fr/*
// @include        http://silencieux.mafiacontrol.com/follow/*
// @include        https://www.kofk.de/*
// @include        https://pokefarm.com/user/*
// @include        https://www.chickensmoothie.com/Forum/viewtopic.php?*
// @include        https://www.crime-club.nl/register.php?referral=*
// @include        https://www.transformice.com/?id*
// @include        https://www.erepublik.com/en#**
// @include        http://magistream.com/memberlist.php?mode=viewprofile&u*
// @include        https://magistream.com/memberlist.php?mode=viewprofile&u*
// @incldue        https://s23-us.gladiatus.gameforge.com/game/index.php?mod=player&p=*
// @include        https://www.erevollution.com/pt/register/*
// @include        https://www.generalsofarmageddon.com/click.php
// @include        https://pokeheroes.com/interact*
// @include        https://pokeheroes.com/pokemon*
// @include        https://pokeheroes.com/userprofile?name=*
// @include        https://www.xanje.com/register*
// @include        https://www.pokelife.pl/pokemon.php?p=*
// @include        https://fallentitans.com
// @include        https://www.klick-game.de/joke-47.html
// @include        http://s4-lt.ikariam.gameforge.com/reg.php?fh=*
// @include        https://www.futurerp.net/pages/link.php?id=*
// @include        https://www.generalsofarmageddon.com/click.php?ID=*
// @include        https://fallentitans.com/
// @include        https://www.carddex-ptc.de/GildenPage.php?id=*
// @include        https://gothicat-world.com/creatures/*
// @include        https://fallentitans.com/
// @include        https://pixpet.net/u/*
// @include        https://www.virtuadopt.com/feed2.php?id=*
// @include        https://www.virtuadopt.com/faq.php
// @include        https://www.virtuadopt.com/undefined
// @include        http://www.valleyofunicorns.com/login
// @include        https://fallentitans.com/*
// @downloadURL https://update.greasyfork.org/scripts/384540/Yarolds%20Close%20It.user.js
// @updateURL https://update.greasyfork.org/scripts/384540/Yarolds%20Close%20It.meta.js
// ==/UserScript==

function randomNumber( min, max ) {
  return ( Math.random() * ( max - min ) + min );
}

var url = window.location.href;
var min = 250;
var max = 550;

if ( url.includes( 'eggcave.com/egg') && !url.includes( '.png') ) {
	$(document).ready( function() {
		var feedButton = $( '.button.is-large.is-fullwidth.is-info:eq(1)' );
		setTimeout( function() {
			$( feedButton ).click();
			setTimeout( function() {
				window.close();
			}, 500);
		}, randomNumber( min, max ) );
	} );
} else if ( url.includes( 'www.virtuadopt.com/feed.php?id=' ) && !url.includes( 'check') ) {
	window.location.replace ( $( 'a' ).eq( 14 ).attr( 'href' ) );
//} else if ( url.includes( 'www.virtuadopt.com/feed.php?id=' ) && url.includes( 'check') ) {
	window.close();
} else if ( url.includes( 'pokefarm.com/user/' ) || url.includes( 'pokefarm.com/summary/' ) ) {
	setTimeout( function() {
		var feedButton = $( '[data-berry=aspear]' );
		$( feedButton ).click();
		setTimeout( function() {
			window.close();
		}, 500);
	}, randomNumber( min, max ) );
} else if ( url.includes( '/gpx.plus/info' ) ) {
	setTimeout( function() {
		var feedButton = $( '.infoInteractButton' ).eq( 1 );
		$( feedButton ).click();
		setTimeout( function() {
			window.close();
		}, 500);
	}, randomNumber( min, max ) );
} else if ( url.includes( 'silencieux.mafiacontrol.com/follow' ) ) {
	setTimeout( function() {
		var feedButton = $( '.button_follow' ).eq( 1 );
		$( feedButton ).click();
		setTimeout( function() {
			window.close();
		}, 500);
	}, randomNumber( min, max ) );
} else if ( '/www.kofk.de/' ) {
	setTimeout( function() {
		var feedButton = $( '#t_food img' ).eq( 1 );
		var playButton = $( '#t_stuff img' ).eq( 1 );
		$( feedButton ).click();
		$( playButton ).click();
		setTimeout( function() {
			window.close();
		}, 500);
	}, randomNumber( min, max ) );
} else if ( url.includes( 'pokeheroes.com/pokemon' ) ) {
	setTimeout( function() {
		var trainButton = $( '.simpleInteract' ).eq( 0 );
		$( trainButton ).click();
		setTimeout( function() {
			window.close();
		}, 500);
	}, randomNumber( min, max ) );
} else {
	window.close();
}