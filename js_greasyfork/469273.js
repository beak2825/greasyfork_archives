// ==UserScript==
// @name			Lemmy Universal Link Switcher
// @namespace		http://azzurite.tv/
// @license			GPLv3
// @version			1.3.4
// @description		Ensures that all URLs to Lemmy instances always point to your main/home instance.
// @homepageURL		https://gitlab.com/azzurite/lemmy-universal-link-switcher
// @supportURL		https://gitlab.com/azzurite/lemmy-universal-link-switcher/-/issues
// @author			Azzurite
// @match			*://*/*
// @icon			https://gitlab.com/azzurite/lemmy-universal-link-switcher/-/raw/main/resources/favicon.png?inline=true
// @grant			GM.setValue
// @grant			GM.getValue
// @grant			GM.xmlHttpRequest
// @grant			GM.registerMenuCommand
// @connect			*
// @require			https://unpkg.com/@popperjs/core@2
// @require			https://unpkg.com/tippy.js@6
// @downloadURL https://update.greasyfork.org/scripts/469273/Lemmy%20Universal%20Link%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/469273/Lemmy%20Universal%20Link%20Switcher.meta.js
// ==/UserScript==

(() => {
  // src/debug.js
  var DEBUG = false;
  function debug() {
    if (DEBUG)
      console.debug(`Rewriter | `, ...arguments);
  }
  function trace() {
    if (DEBUG === `trace`)
      console.debug(`Rewriter Trace | `, ...arguments);
  }

  // src/instances.js
  function isLemmyInstance(url) {
    return isInstance(INSTANCES_LEMMY, url);
  }
  function isKbinInstance(url) {
    return isInstance(INSTANCES_KBIN, url);
  }
  function isInstance(instances, url) {
    if (url.origin) {
      return instances.has(url.origin);
    } else {
      return false;
    }
  }
  trace(`Define instances sets start`);
  var INSTANCES_LEMMY = /* @__PURE__ */ new Set([
    "http://lemmy.brdsnest.net",
    "https://0d.gs",
    "https://0xdd.org.ru",
    "https://1337lemmy.com",
    "https://acqrs.co.uk",
    "https://adultswim.fan",
    "https://aggregatet.org",
    "https://agoraverse.sh",
    "https://alien.top",
    "https://ani.social",
    "https://ascy.mooo.com",
    "https://aussie.zone",
    "https://awful.systems",
    "https://badatbeing.social",
    "https://baraza.africa",
    "https://bbs.9tail.net",
    "https://bdl.owu.one",
    "https://beehaw.org",
    "https://belfry.rip",
    "https://biglemmowski.win",
    "https://bin.pztrn.name",
    "https://bitforged.space",
    "https://blendit.bsd.cafe",
    "https://board.minimally.online",
    "https://bolha.forum",
    "https://bookwormstory.social",
    "https://borg.chat",
    "https://buddyverse.one",
    "https://campfyre.nickwebster.dev",
    "https://casavaga.com",
    "https://catata.fish",
    "https://champserver.net",
    "https://chinese.lol",
    "https://civilloquy.com",
    "https://communick.news",
    "https://corndog.social",
    "https://corrigan.space",
    "https://crazypeople.online",
    "https://dendarii.alaeron.com",
    "https://dev.automationwise.com",
    "https://diagonlemmy.social",
    "https://digipres.cafe",
    "https://discover.deltanauten.de",
    "https://discuss.icewind.me",
    "https://discuss.jacen.moe",
    "https://discuss.online",
    "https://discuss.tchncs.de",
    "https://distress.digital",
    "https://dit.reformed.social",
    "https://doomscroll.n8e.dev",
    "https://dormi.zone",
    "https://downonthestreet.eu",
    "https://drlemmy.net",
    "https://ds9.lemmy.ml",
    "https://dubvee.org",
    "https://dumbdomain.xyz",
    "https://endlesstalk.org",
    "https://enterprise.lemmy.ml",
    "https://eventfrontier.com",
    "https://eviltoast.org",
    "https://expats.zone",
    "https://falconry.party",
    "https://fanaticus.social",
    "https://fasheng.ing",
    "https://fed.dyne.org",
    "https://feddit.cl",
    "https://feddit.dk",
    "https://feddit.eu",
    "https://feddit.it",
    "https://feddit.nl",
    "https://feddit.nu",
    "https://feddit.org",
    "https://feddit.rocks",
    "https://feddit.site",
    "https://feddit.uk",
    "https://federation.red",
    "https://fedii.me",
    "https://fedit.pl",
    "https://feditown.com",
    "https://feed.newt.wtf",
    "https://fenmou.cyou",
    "https://fjdk.uk",
    "https://flamewar.social",
    "https://foros.fediverso.gal",
    "https://forum.ayom.media",
    "https://forum.uncomfortable.business",
    "https://futurology.today",
    "https://g00n.cloud",
    "https://gearhead.town",
    "https://gioia.news",
    "https://gregtech.eu",
    "https://group.lt",
    "https://h4x0r.host",
    "https://hackertalks.com",
    "https://halubilo.social",
    "https://happysl.app",
    "https://hardware.watch",
    "https://hexbear.net",
    "https://hilariouschaos.com",
    "https://hobbit.world",
    "https://hoihoi.superboi.eu.org",
    "https://info.prou.be",
    "https://infosec.pub",
    "https://jlai.lu",
    "https://krabb.org",
    "https://kutsuya.dev",
    "https://kuu.kohana.fi",
    "https://kyu.de",
    "https://l.7rg1nt.moe",
    "https://l.dongxi.ca",
    "https://l.henlo.fi",
    "https://l.hostux.net",
    "https://l.mathers.fr",
    "https://l.mchome.net",
    "https://l.roofo.cc",
    "https://l.shoddy.site",
    "https://l.sw0.com",
    "https://l3mmy.com",
    "https://lazysoci.al",
    "https://le.meto.lol",
    "https://leaf.dance",
    "https://lebowski.social",
    "https://lef.li",
    "https://leftopia.org",
    "https://lem.a3a2.uk",
    "https://lem.afiz.org",
    "https://lem.cochrun.xyz",
    "https://lem.free.as",
    "https://lem.monster",
    "https://lem.ph3j.com",
    "https://lem.serkozh.me",
    "https://lem.trashbrain.org",
    "https://lemdro.id",
    "https://leminal.space",
    "https://lemm.ee",
    "https://lemmings.sopelj.ca",
    "https://lemmings.world",
    "https://lemmit.online",
    "https://lemmus.org",
    "https://lemmy-api.ten4ward.social",
    "https://lemmy-mormonsatan-u23030.vm.elestio.app",
    "https://lemmy.0upti.me",
    "https://lemmy.100010101.xyz",
    "https://lemmy.4d2.org",
    "https://lemmy.86thumbs.net",
    "https://lemmy.8bitar.io",
    "https://lemmy.8th.world",
    "https://lemmy.absolutesix.com",
    "https://lemmy.activitypub.academy",
    "https://lemmy.ahall.se",
    "https://lemmy.aicampground.com",
    "https://lemmy.amethyst.name",
    "https://lemmy.amxl.com",
    "https://lemmy.ananace.dev",
    "https://lemmy.anonion.social",
    "https://lemmy.anymore.nl",
    "https://lemmy.asc6.org",
    "https://lemmy.asudox.dev",
    "https://lemmy.azamserver.com",
    "https://lemmy.baie.me",
    "https://lemmy.balamb.fr",
    "https://lemmy.beagle.quest",
    "https://lemmy.belegost.net",
    "https://lemmy.beru.co",
    "https://lemmy.best",
    "https://lemmy.bestiver.se",
    "https://lemmy.billiam.net",
    "https://lemmy.bismith.net",
    "https://lemmy.bit-refined.eu",
    "https://lemmy.blackeco.com",
    "https://lemmy.blahaj.zone",
    "https://lemmy.blugatch.tube",
    "https://lemmy.bmck.au",
    "https://lemmy.bosio.info",
    "https://lemmy.brad.ee",
    "https://lemmy.brandyapple.com",
    "https://lemmy.brief.guru",
    "https://lemmy.browntown.dev",
    "https://lemmy.byrdcrouse.com",
    "https://lemmy.byteunion.com",
    "https://lemmy.ca",
    "https://lemmy.cafe",
    "https://lemmy.caliban.io",
    "https://lemmy.cat",
    "https://lemmy.catgirl.biz",
    "https://lemmy.ch3n2k.com",
    "https://lemmy.chiisana.net",
    "https://lemmy.ciechom.eu",
    "https://lemmy.cixoelectronic.pl",
    "https://lemmy.cloudhub.social",
    "https://lemmy.co.nz",
    "https://lemmy.cogindo.net",
    "https://lemmy.com.tr",
    "https://lemmy.conorab.com",
    "https://lemmy.coupou.fr",
    "https://lemmy.crimedad.work",
    "https://lemmy.cringecollective.io",
    "https://lemmy.criticalbasics.xyz",
    "https://lemmy.croc.pw",
    "https://lemmy.cronyakatsuki.xyz",
    "https://lemmy.cryonex.net",
    "https://lemmy.csupes.page",
    "https://lemmy.cultimean.group",
    "https://lemmy.darvit.nl",
    "https://lemmy.dbzer0.com",
    "https://lemmy.decronym.xyz",
    "https://lemmy.deedium.nl",
    "https://lemmy.deepspace.gay",
    "https://lemmy.dexlit.xyz",
    "https://lemmy.digitalcharon.in",
    "https://lemmy.digitalfall.net",
    "https://lemmy.doesnotexist.club",
    "https://lemmy.dogboy.xyz",
    "https://lemmy.dormedas.com",
    "https://lemmy.dropdoos.nl",
    "https://lemmy.duck.cafe",
    "https://lemmy.dudeami.win",
    "https://lemmy.eco.br",
    "https://lemmy.emerald.show",
    "https://lemmy.enchanted.social",
    "https://lemmy.esquiretheduke.nohost.me",
    "https://lemmy.eus",
    "https://lemmy.evangineer.net",
    "https://lemmy.fait.ch",
    "https://lemmy.federate.cc",
    "https://lemmy.federate.lol",
    "https://lemmy.fedi.zutto.fi",
    "https://lemmy.fedifriends.social",
    "https://lemmy.fediverse.jp",
    "https://lemmy.fish",
    "https://lemmy.fosshost.com",
    "https://lemmy.foxden.party",
    "https://lemmy.freewilltiger.page",
    "https://lemmy.fromshado.ws",
    "https://lemmy.frozeninferno.xyz",
    "https://lemmy.funami.tech",
    "https://lemmy.fwgx.uk",
    "https://lemmy.gf4.pw",
    "https://lemmy.giftedmc.com",
    "https://lemmy.glasgow.social",
    "https://lemmy.graphics",
    "https://lemmy.greatpyramid.social",
    "https://lemmy.grey.fail",
    "https://lemmy.grys.it",
    "https://lemmy.hacktheplanet.be",
    "https://lemmy.haley.io",
    "https://lemmy.halfbro.xyz",
    "https://lemmy.helios42.de",
    "https://lemmy.helvetet.eu",
    "https://lemmy.hogru.ch",
    "https://lemmy.horwood.cloud",
    "https://lemmy.hosted.frl",
    "https://lemmy.hybridsarcasm.xyz",
    "https://lemmy.imagisphe.re",
    "https://lemmy.imontheweb.net",
    "https://lemmy.inbutts.lol",
    "https://lemmy.installation00.org",
    "https://lemmy.itsallbadsyntax.com",
    "https://lemmy.iys.io",
    "https://lemmy.jacaranda.club",
    "https://lemmy.jamesj999.co.uk",
    "https://lemmy.janiak.cc",
    "https://lemmy.javant.xyz",
    "https://lemmy.jaypg.pw",
    "https://lemmy.jelliefrontier.net",
    "https://lemmy.jhjacobs.nl",
    "https://lemmy.jlh.name",
    "https://lemmy.johnnei.org",
    "https://lemmy.jrvs.cc",
    "https://lemmy.kaytse.fun",
    "https://lemmy.kde.social",
    "https://lemmy.kfed.org",
    "https://lemmy.killtime.online",
    "https://lemmy.klein.ruhr",
    "https://lemmy.kmoneyserver.com",
    "https://lemmy.kokomo.cloud",
    "https://lemmy.kopieczek.com",
    "https://lemmy.kya.moe",
    "https://lemmy.laitinlok.com",
    "https://lemmy.lantian.pub",
    "https://lemmy.libertarianfellowship.org",
    "https://lemmy.librebun.com",
    "https://lemmy.linden.social",
    "https://lemmy.linuxuserspace.show",
    "https://lemmy.lqx.net",
    "https://lemmy.lukeog.com",
    "https://lemmy.lundgrensjostrom.com",
    "https://lemmy.magnor.ovh",
    "https://lemmy.mariusdavid.fr",
    "https://lemmy.marud.fr",
    "https://lemmy.masto.community",
    "https://lemmy.mats.ooo",
    "https://lemmy.max-p.me",
    "https://lemmy.mbl.social",
    "https://lemmy.mebitek.com",
    "https://lemmy.meissners.me",
    "https://lemmy.menf.in",
    "https://lemmy.mengsk.org",
    "https://lemmy.menos.gotdns.org",
    "https://lemmy.michaelsasser.org",
    "https://lemmy.mindoki.com",
    "https://lemmy.minecloud.ro",
    "https://lemmy.minie4.de",
    "https://lemmy.mkwarman.com",
    "https://lemmy.ml",
    "https://lemmy.mlaga97.space",
    "https://lemmy.mods4ever.com",
    "https://lemmy.monster",
    "https://lemmy.moocloud.party",
    "https://lemmy.moonling.nl",
    "https://lemmy.mrm.one",
    "https://lemmy.muffalings.com",
    "https://lemmy.multivers.cc",
    "https://lemmy.my-box.dev",
    "https://lemmy.myserv.one",
    "https://lemmy.nannoda.com",
    "https://lemmy.nauk.io",
    "https://lemmy.ndlug.org",
    "https://lemmy.nekusoul.de",
    "https://lemmy.nerdcore.social",
    "https://lemmy.nexus",
    "https://lemmy.nicknakin.com",
    "https://lemmy.nikore.net",
    "https://lemmy.nine-hells.net",
    "https://lemmy.noellesporn.de",
    "https://lemmy.nope.ly",
    "https://lemmy.norbipeti.eu",
    "https://lemmy.notmy.cloud",
    "https://lemmy.nowsci.com",
    "https://lemmy.nz",
    "https://lemmy.obrell.se",
    "https://lemmy.ohaa.xyz",
    "https://lemmy.okr765.com",
    "https://lemmy.oldtr.uk",
    "https://lemmy.one",
    "https://lemmy.onlylans.io",
    "https://lemmy.org",
    "https://lemmy.packitsolutions.net",
    "https://lemmy.parastor.net",
    "https://lemmy.paulstevens.org",
    "https://lemmy.pe1uca.dev",
    "https://lemmy.peoplever.se",
    "https://lemmy.petecca.com",
    "https://lemmy.physfluids.fr",
    "https://lemmy.pierre-couy.fr",
    "https://lemmy.pit.ninja",
    "https://lemmy.pixelcollider.net",
    "https://lemmy.plaureano.nohost.me",
    "https://lemmy.prograhamming.com",
    "https://lemmy.pt",
    "https://lemmy.pussthecat.org",
    "https://lemmy.radio",
    "https://lemmy.razbot.xyz",
    "https://lemmy.remorse.us",
    "https://lemmy.reysic.com",
    "https://lemmy.rhymelikedi.me",
    "https://lemmy.rimkus.it",
    "https://lemmy.rochegmr.com",
    "https://lemmy.runesmite.com",
    "https://lemmy.saik0.com",
    "https://lemmy.scam-mail.me",
    "https://lemmy.schlunker.com",
    "https://lemmy.schoenwolf-schroeder.com",
    "https://lemmy.sdf.org",
    "https://lemmy.sebbem.se",
    "https://lemmy.secnd.me",
    "https://lemmy.self-hosted.site",
    "https://lemmy.selfhostcat.com",
    "https://lemmy.services.coupou.fr",
    "https://lemmy.setzman.synology.me",
    "https://lemmy.shiny-task.com",
    "https://lemmy.shtuf.eu",
    "https://lemmy.sieprawski.pl",
    "https://lemmy.sietch.online",
    "https://lemmy.simpl.website",
    "https://lemmy.skoops.social",
    "https://lemmy.skyjake.fi",
    "https://lemmy.smgames.club",
    "https://lemmy.snoot.tube",
    "https://lemmy.socdojo.com",
    "https://lemmy.sotu.casa",
    "https://lemmy.spacestation14.com",
    "https://lemmy.spronkus.xyz",
    "https://lemmy.ssba.com",
    "https://lemmy.stad.social",
    "https://lemmy.staphup.nl",
    "https://lemmy.starlightkel.xyz",
    "https://lemmy.stefanoprenna.com",
    "https://lemmy.steken.xyz",
    "https://lemmy.stonansh.org",
    "https://lemmy.stuart.fun",
    "https://lemmy.studio",
    "https://lemmy.sudovanilla.org",
    "https://lemmy.sumuun.net",
    "https://lemmy.svlachos.duckdns.org",
    "https://lemmy.syrasu.com",
    "https://lemmy.t-rg.ws",
    "https://lemmy.team",
    "https://lemmy.technosorcery.net",
    "https://lemmy.technowizardry.net",
    "https://lemmy.telaax.com",
    "https://lemmy.tespia.org",
    "https://lemmy.teuto.icu",
    "https://lemmy.tf",
    "https://lemmy.tgxn.net",
    "https://lemmy.thebias.nl",
    "https://lemmy.thefloatinglab.world",
    "https://lemmy.thewooskeys.com",
    "https://lemmy.tobyvin.dev",
    "https://lemmy.today",
    "https://lemmy.toldi.eu",
    "https://lemmy.tomkoreny.com",
    "https://lemmy.toot.pt",
    "https://lemmy.trevor.coffee",
    "https://lemmy.trippy.pizza",
    "https://lemmy.ubergeek77.chat",
    "https://lemmy.uhhoh.com",
    "https://lemmy.umucat.day",
    "https://lemmy.unboiled.info",
    "https://lemmy.unfiltered.social",
    "https://lemmy.uninsane.org",
    "https://lemmy.unryzer.eu",
    "https://lemmy.urbanhost.top",
    "https://lemmy.vg",
    "https://lemmy.vyizis.tech",
    "https://lemmy.w9r.de",
    "https://lemmy.wentam.net",
    "https://lemmy.whynotdrs.org",
    "https://lemmy.world",
    "https://lemmy.wtf",
    "https://lemmy.xeviousx.eu",
    "https://lemmy.xoynq.com",
    "https://lemmy.yachts",
    "https://lemmy.z0r.co",
    "https://lemmy.zhukov.al",
    "https://lemmy.zimage.com",
    "https://lemmy.zip",
    "https://lemmy.zwanenburg.info",
    "https://lemmygrad.ml",
    "https://lemmyis.fun",
    "https://lemmyland.com",
    "https://lemmynsfw.com",
    "https://lemmyusa.com",
    "https://lemux.minnix.dev",
    "https://lemy.leuker.me",
    "https://lemy.lol",
    "https://lemy.nl",
    "https://level-up.zone",
    "https://libretechni.ca",
    "https://linkage.ds8.zone",
    "https://links.gayfr.online",
    "https://links.rocks",
    "https://linux.community",
    "https://linz.city",
    "https://literature.cafe",
    "https://lm.boing.icu",
    "https://lm.inu.is",
    "https://lm.korako.me",
    "https://lm.madiator.cloud",
    "https://lm.paradisus.day",
    "https://lm.sethp.cc",
    "https://lm.williampuckering.com",
    "https://lmy.sagf.io",
    "https://lonestarlemmy.mooo.com",
    "https://lsmu.schmurian.xyz",
    "https://lu.skbo.net",
    "https://lululemmy.com",
    "https://lx.pontual.social",
    "https://mander.xyz",
    "https://meinreddit.com",
    "https://metapowers.org",
    "https://midwest.social",
    "https://mimiclem.me",
    "https://mlem.eldritch.gift",
    "https://monero.town",
    "https://monyet.cc",
    "https://moose.best",
    "https://moto.teamswollen.org",
    "https://mouse.chitanda.moe",
    "https://mtgzone.com",
    "https://mujico.org",
    "https://news.idlestate.org",
    "https://no.lastname.nz",
    "https://nodesphere.site",
    "https://notdigg.com",
    "https://nsfwaiclub.com",
    "https://odin.lanofthedead.xyz",
    "https://orbi.camp",
    "https://orbiting.observer",
    "https://orcas.enjoying.yachts",
    "https://overctrl.dbzer0.com",
    "https://parenti.sh",
    "https://pawb.social",
    "https://ponder.cat",
    "https://popplesburger.hilciferous.nl",
    "https://poptalk.scrubbles.tech",
    "https://preserve.games",
    "https://pricefield.org",
    "https://programming.dev",
    "https://proit.org",
    "https://providence.root.sx",
    "https://quokk.au",
    "https://r-sauna.fi",
    "https://r.nf",
    "https://radiation.party",
    "https://rblind.com",
    "https://real.lemmy.fan",
    "https://realbitcoin.cash",
    "https://reddeet.com",
    "https://reddthat.com",
    "https://redlemmy.com",
    "https://rekabu.ru",
    "https://rentadrunk.org",
    "https://retarded.dev",
    "https://retrolemmy.com",
    "https://roanoke.social",
    "https://rollenspiel.forum",
    "https://rqd2.net",
    "https://sammich.es",
    "https://scribe.disroot.org",
    "https://selfhosted.forum",
    "https://sh.itjust.works",
    "https://sha1.nl",
    "https://showeq.com",
    "https://slangenettet.pyjam.as",
    "https://slrpnk.net",
    "https://soc.ebmn.io",
    "https://soccer.forum",
    "https://social.belowland.com",
    "https://social.ggbox.fr",
    "https://social.jears.at",
    "https://social.jrruethe.info",
    "https://social.nerdhouse.io",
    "https://social.p80.se",
    "https://social.packetloss.gg",
    "https://social.pwned.page",
    "https://social.rocketsfall.net",
    "https://social.sour.is",
    "https://social2.williamyam.com",
    "https://sopuli.xyz",
    "https://spgrn.com",
    "https://stammtisch.hallertau.social",
    "https://startrek.website",
    "https://sub.wetshaving.social",
    "https://supernova.place",
    "https://suppo.fi",
    "https://swg-empire.de",
    "https://switter.su",
    "https://szmer.info",
    "https://t.bobamilktea.xyz",
    "https://tacobu.de",
    "https://thelemmy.club",
    "https://timesink.p3nguin.org",
    "https://tkohhh.social",
    "https://toast.ooo",
    "https://treadst.one",
    "https://ttrpg.network",
    "https://tucson.social",
    "https://ukfli.uk",
    "https://unreachable.cloud",
    "https://upvote.au",
    "https://usenet.lol",
    "https://va11halla.bar",
    "https://vegantheoryclub.org",
    "https://vger.social",
    "https://voyager.lemmy.ml",
    "https://walledgarden.xyz",
    "https://welppp.com",
    "https://whemic.xyz",
    "https://wired.bluemarch.art",
    "https://x69.org",
    "https://xn--mh-fkaaaaaa.schuetze.link",
    "https://yall.theatl.social",
    "https://yiffit.net",
    "https://ythreektech.com",
    "https://zerobytes.monster"
  ]);
  var INSTANCES_KBIN = /* @__PURE__ */ new Set([
    "https://artemis.camp",
    "https://atakbin.spacehost.dev",
    "https://bin.pol.social",
    "https://community.yshi.org",
    "https://dgngrnder.com",
    "https://feddit.online",
    "https://fedinews.net",
    "https://fusionpatrol.social",
    "https://hotaudiofiction.social",
    "https://jlailu.social",
    "https://k.fe.derate.me",
    "https://karab.in",
    "https://kayb.ee",
    "https://kbin-u3.vm.elestio.app",
    "https://kbin.bitgoblin.tech",
    "https://kbin.cafe",
    "https://kbin.chat",
    "https://kbin.ectolab.net",
    "https://kbin.fedi.cr",
    "https://kbin.life",
    "https://kbin.nz",
    "https://kbin.pieho.me",
    "https://kbin.pithyphrase.net",
    "https://kbin.projectsegfau.lt",
    "https://kbin.social",
    "https://kbin.tenkuu.social",
    "https://kbin.thicknahalf.com",
    "https://kbin.wangwood.house",
    "https://kglitch.social",
    "https://kopnij.in",
    "https://kx.pontual.social",
    "https://link.fossdle.org",
    "https://longley.ws",
    "https://nadajnik.org",
    "https://polesie.pol.social",
    "https://rainy.place",
    "https://social.tath.link",
    "https://supermeter.social",
    "https://teacup.social",
    "https://wiku.hu"
  ]);
  trace(`Define instances sets end`);

  // src/our-changes.js
  var OUR_CHANGES = { addedNodes: {} };
  function getAddedNodesSelectors() {
    return Object.values(OUR_CHANGES.addedNodes);
  }
  function registerAddedNode(id, selector) {
    OUR_CHANGES.addedNodes[id] = selector;
  }

  // src/constants.js
  var constants_default = {
    ICON_CLASS: withNS(`icon`),
    ICON_LOADING_CLASS: withNS(`loading`),
    ICON_STYLES_ID: withNS(`icon-styles`),
    ICON_LINK_CLASS: withNS(`icon-link`),
    ICON_LINK_SYMBOL_ID: withNS(`icon-link-symbol`),
    ICON_SPINNER_CLASS: withNS(`icon-spinner`),
    ICON_SPINNER_SYMBOL_ID: withNS(`icon-spinner-symbol`),
    ORIGINAL_LINK_CLASS: withNS(`original-link`),
    SHOW_AT_HOME_BUTTON_CLASS: withNS(`show-at-home`),
    ICON_SVG_TEMPLATE_ID: withNS(`icon-template`),
    AUTH_WRONG: `AUTH_WRONG`,
    AUTH_MISSING: `AUTH_MISSING`,
    REWRITE_STATUS: withNSCamelCase(`localUrlStatus`),
    REWRITE_STATUS_PENDING: `pending`,
    REWRITE_STATUS_SUCCESS: `success`,
    REWRITE_STATUS_ERROR: `error`,
    REWRITE_STATUS_UNRESOLVED: `unresolved`,
    SETUP_AUTH_MESSAGE: `Lemmy Universal Link Switcher: Visit your home instance once to set up post/comment rewriting`,
    SETTINGS_BUTTON_ID: withNS(`open-settings-button`),
    SETTINGS_MENU_ID: withNS(`settings`),
    SETTINGS_STYLES_ID: withNS(`settings-styles`)
  };
  function withNS(identifier) {
    return `lemmy-rewrite-urls-` + identifier;
  }
  function withNSCamelCase(identifier) {
    return `lemmyRewriteUrls` + identifier.charAt(0).toUpperCase() + identifier.slice(1);
  }

  // src/rewriting/helpers.js
  function isHashLink(link) {
    return link.hash && link.origin + link.pathname + link.search === location.origin + location.pathname + location.search;
  }
  function isSamePage(url1, url2) {
    return url1.host === url2.host && url1.pathname === url2.pathname;
  }
  function isV17() {
    return window.isoData?.site_res?.version.startsWith(`0.17`);
  }
  var stopEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // src/gm.js
  async function setValue(key, value) {
    trace(`GM.setValue key ${key}, value ${value}`);
    await GM.setValue(key, value);
  }
  async function getValue(key) {
    return await GM.getValue(key);
  }
  function parseResponse(response) {
    try {
      return JSON.parse(response.response);
    } catch (e) {
      debug(`Error parsing response JSON`, e);
      return response.response;
    }
  }
  function logRequest(response, data) {
    trace(
      `FinalUrl`,
      response.finalUrl,
      `status`,
      response.status,
      `text`,
      response.statusText,
      `response`,
      data || response.response
    );
    trace(`responseHeaders`, response.responseHeaders);
  }
  function performXmlHttpRequest(url, doneCallback) {
    GM.xmlHttpRequest({
      url,
      onloadend: (response) => {
        const data = parseResponse(response);
        logRequest(response, data);
        doneCallback(response, data);
      }
    });
  }
  function registerMenuCommand(name, onClick) {
    GM.registerMenuCommand(name, onClick);
  }

  // src/rewriting/auth.js
  var AUTH;
  function getAuthFromCookie() {
    return document.cookie.split("; ").find((row) => row.startsWith("jwt="))?.split("=")[1];
  }
  async function setAuth(auth) {
    AUTH = auth;
    await setValue(`auth`, auth);
  }
  async function initAuth() {
    const curAuth = await getAuth();
    if (curAuth) {
      AUTH = curAuth;
      return;
    }
    if (location.origin === HOME) {
      const newAuth = getAuthFromCookie();
      await setAuth(newAuth);
      if (newAuth && await getValue(`authNoticeShown`)) {
        alert(`Lemmy Universal Link Switcher: Post/comment rewriting has been set up successfully`);
        await setValue(`authNoticeShown`, null);
      }
    } else if (HOME && !await getValue(`authNoticeShown`)) {
      await setValue(`authNoticeShown`, `true`);
      alert(constants_default.SETUP_AUTH_MESSAGE);
    }
  }
  function updateAuthPeriodically() {
    setInterval(async () => {
      const prev = AUTH;
      const newAuth = location.origin === HOME ? getAuthFromCookie() : await getAuth();
      if (prev !== newAuth) {
        debug(`Auth changed`);
        await setAuth(newAuth);
        clearMissingUrlsInCache();
        triggerRewrite();
      }
    }, 1234);
  }
  async function getAuth() {
    return await getValue(`auth`);
  }

  // src/rewriting/url-mapping.js
  function splitPaths(url) {
    return url.pathname.split(`/`).slice(1);
  }
  function isRemoteLemmyUrl(url) {
    return !isHomeInstance(url) && isLemmyInstance(url);
  }
  function isRemoteKbinUrl(url) {
    return !isHomeInstance(url) && isKbinInstance(url);
  }
  function isRemoteUrl(url) {
    return isRemoteLemmyUrl(url) || isRemoteKbinUrl(url);
  }
  function findLocalUrlForStandardAtFormat(url, rootPath) {
    const paths = splitPaths(url);
    const name = paths[1].includes(`@`) ? paths[1] : paths[1] + `@` + url.host;
    return `${HOME}/${rootPath || paths[0]}/${name}` + url.search + url.hash;
  }
  function findLocalUrlForLemmyUrl(url) {
    if (isLemmyUserOrCommunityUrl(url)) {
      return findLocalUrlForStandardAtFormat(url);
    } else {
      return null;
    }
  }
  function findLocalUrlForKbinUserUrl(url) {
    const paths = splitPaths(url);
    const user = paths[1].startsWith(`@`) ? paths[1].substring(1) : paths[1];
    const name = user.includes(`@`) ? user : user + `@` + url.host;
    return `${HOME}/u/${name}` + url.search + url.hash;
  }
  function findLocalUrlForKbinUrl(url) {
    if (isKbinMagazineUrl(url)) {
      return findLocalUrlForStandardAtFormat(url, mappedKbinRootPath(url));
    } else if (isKbinUserUrl(url)) {
      return findLocalUrlForKbinUserUrl(url);
    } else {
      return null;
    }
  }
  function findLocalUrl(url) {
    if (isRemoteLemmyUrl(url))
      return findLocalUrlForLemmyUrl(url);
    if (isRemoteKbinUrl(url))
      return findLocalUrlForKbinUrl(url);
    return null;
  }
  async function fetchApIdFromRemote(url) {
    const endpoint = isLemmyPostUrl(url) ? `post` : `comment`;
    const paths = splitPaths(url);
    const id = paths[1];
    return new Promise((resolve, reject) => {
      performXmlHttpRequest(`${url.origin}/api/v3/${endpoint}?id=${id}`, (response, data) => {
        const apId = data[`${endpoint}_view`]?.[endpoint]?.ap_id;
        if (response.status === 200 && apId) {
          resolve(apId);
        } else {
          handleFailedRequest(`fetching AP ID`, response, reject);
        }
      });
    });
  }
  function handleFailedRequest(requestName, response, reject) {
    if (response.status >= 200 && response.status <= 299) {
      reject(`${requestName}: Unhandled successful response, status: ${response.status}`);
    } else if (response.status >= 400 && response.status <= 599) {
      reject(`${requestName}: Error, status: ${response.status}`);
    } else {
      reject(`${requestName}: Something weird happened, status: ${response.status}`);
    }
  }
  async function resolveObjectFromHome(url) {
    return new Promise(async (resolve, reject) => {
      const auth = await getAuth();
      if (!auth) {
        debug(`No auth token found`);
        reject(constants_default.AUTH_MISSING);
      }
      performXmlHttpRequest(
        `${HOME}/api/v3/resolve_object?auth=${auth}&q=${encodeURIComponent(url.href)}`,
        (response, data) => {
          if (response.status === 200 && data.post?.post?.id) {
            resolve(`${HOME}/post/${data.post.post.id}${url.search}${url.hash}`);
          } else if (response.status === 200 && data.comment?.comment?.id) {
            resolve(`${HOME}/comment/${data.comment.comment.id}${url.search}${url.hash}`);
          } else if (response.status === 400 && data?.error === `couldnt_find_object`) {
            resolve(null);
          } else if (response.status === 400 && data?.error === `not_logged_in`) {
            reject(constants_default.AUTH_WRONG);
          } else {
            handleFailedRequest(`resolving object`, response, reject);
          }
        }
      );
    });
  }
  var urlCache = {};
  function clearMissingUrlsInCache() {
    for (const value of Object.values(urlCache)) {
      if (value.error)
        delete value.error;
      if (value.localUrl === null)
        delete value.localUrl;
    }
  }
  function getCacheKey(url) {
    return url.host + url.pathname + url.search;
  }
  function cacheResult(url, localUrl) {
    const key = getCacheKey(url);
    if (!urlCache[key]) {
      urlCache[key] = {};
    }
    if (urlCache[key].error)
      delete urlCache[key].error;
    urlCache[key].localUrl = localUrl;
    return localUrl;
  }
  function cacheErrorResult(url, error) {
    const key = getCacheKey(url);
    if (!urlCache[key]) {
      urlCache[key] = {};
    }
    urlCache[key].error = error;
  }
  function getLocalUrlfromCache(url) {
    const key = getCacheKey(url);
    if (urlCache[key]?.error) {
      throw urlCache[key]?.error;
    } else {
      return urlCache[key]?.localUrl;
    }
  }
  async function fetchLocalUrl(url, loadFromCache = true) {
    if (loadFromCache) {
      const cached = getLocalUrlfromCache(url);
      if (cached !== void 0) {
        trace(`Found URL ${url} in cache: ${cached}`);
        return cached;
      }
    }
    try {
      return cacheResult(url, await fetchLocalUrlNoCache(url));
    } catch (e) {
      debug(`fetchLocalUrl error`, e);
      cacheErrorResult(url, e);
      throw e;
    }
  }
  async function fetchLocalUrlNoCache(url) {
    trace(`Trying to resolve URL ${url} directly`);
    const localUrl = await resolveObjectFromHome(url);
    if (localUrl !== null) {
      return localUrl;
    } else {
      trace(`Did not find URL ${url} directly`);
    }
    const apId = new URL(await fetchApIdFromRemote(url));
    trace(`Found AP ID for URL ${url}: ${apId}`);
    if (!apId.search) {
      apId.search = url.search;
    }
    if (!apId.hash) {
      apId.hash = url.hash;
    }
    if (isSamePage(url, apId)) {
      trace(`Previous URL was AP ID already, URL not federated for some reason`);
      return null;
    } else {
      return await resolveObjectFromHome(apId);
    }
  }
  function isInstantlyRewritable(url) {
    return isRemoteLemmyUrl(url) && isLemmyUserOrCommunityUrl(url) || isRemoteKbinUrl(url) && (isKbinMagazineUrl(url) || isKbinUserUrl(url));
  }
  function isRewritableAfterResolving(url) {
    return isRemoteLemmyUrl(url) && (isLemmyPostUrl(url) || isLemmyCommentUrl(url));
  }
  function isLemmyPostUrl(url) {
    const paths = splitPaths(url);
    return paths[0] === `post`;
  }
  function isLemmyCommentUrl(url) {
    const paths = splitPaths(url);
    return paths[0] === `comment`;
  }
  function isLemmyUserOrCommunityUrl(url) {
    const paths = splitPaths(url);
    return paths[0] === `c` || paths[0] === `u`;
  }
  function isKbinPostUrl(url) {
    const paths = splitPaths(url);
    return paths[0] === `m` && paths.length > 2 && paths[2] === `t`;
  }
  function isKbinMicroblogUrl(url) {
    const paths = splitPaths(url);
    return paths[0] === `m` && paths.length > 2 && paths[2] === `p`;
  }
  function isKbinMicroblogOverviewUrl(url) {
    const paths = splitPaths(url);
    return paths[0] === `m` && paths.length > 2 && paths[2] === `microblog`;
  }
  function isKbinMagazinePeopleUrl(url) {
    const paths = splitPaths(url);
    return paths[0] === `m` && paths.length > 2 && paths[2] === `people`;
  }
  function isKbinMagazineUrl(url) {
    const paths = splitPaths(url);
    return paths[0] === `m` && !isKbinPostUrl(url) && !isKbinMagazinePeopleUrl(url) && !isKbinMicroblogUrl(url) && !isKbinMicroblogOverviewUrl(url);
  }
  function mappedKbinRootPath(url) {
    const paths = splitPaths(url);
    if (paths[0] === `m`) {
      return `c`;
    } else {
      return null;
    }
  }
  function isKbinUserUrl(url) {
    const paths = splitPaths(url);
    return paths.length === 2 && paths[0] === `u`;
  }

  // src/rewriting/links/icon.js
  function getIcon(link) {
    return link.querySelector(`.` + constants_default.ICON_CLASS);
  }
  function createIcon(link) {
    ensureTemplateAvailable();
    ensureIconStylesAdded();
    const wrapper = document.createElement(`span`);
    registerAddedNode(constants_default.ICON_CLASS, `.` + constants_default.ICON_CLASS);
    wrapper.classList.add(constants_default.ICON_CLASS);
    if (link.children.length === 0 || getComputedStyle(link.children[link.children.length - 1]).marginRight === `0px`) {
      wrapper.style.marginLeft = `0.5em`;
    }
    const linkIcon = createSVG();
    linkIcon.classList.add(constants_default.ICON_LINK_CLASS);
    linkIcon.innerHTML = `<use href=#${constants_default.ICON_LINK_SYMBOL_ID} />`;
    wrapper.append(linkIcon);
    const spinnerIcon = createSVG();
    spinnerIcon.classList.add(constants_default.ICON_SPINNER_CLASS);
    spinnerIcon.innerHTML = `<use href=#${constants_default.ICON_SPINNER_SYMBOL_ID} />`;
    wrapper.append(spinnerIcon);
    return wrapper;
  }
  function createSVG() {
    return document.createElementNS(`http://www.w3.org/2000/svg`, `svg`);
  }
  function ensureTemplateAvailable() {
    if (document.querySelector(`#` + constants_default.ICON_SVG_TEMPLATE_ID))
      return;
    const template = createSVG();
    template.id = constants_default.ICON_SVG_TEMPLATE_ID;
    template.innerHTML = `<defs>
<symbol id=${constants_default.ICON_LINK_SYMBOL_ID} viewBox="0 0 100 100"><path d="M52.8 34.6c.8.8 1.8 1.2 2.8 1.2s2-.4 2.8-1.2c1.5-1.5 1.5-4 0-5.6l-5.2-5.2h26v30.6c0 2.2 1.8 3.9 3.9 3.9 2.2 0 3.9-1.8 3.9-3.9V19.8c0-2.2-1.8-3.9-3.9-3.9h-30l5.2-5.2c1.5-1.5 1.5-4 0-5.6s-4-1.5-5.6 0l-11.8 12c-1.5 1.5-1.5 4 0 5.6l11.9 11.9zM31.1 28.7V11c0-3-2.5-5.5-5.5-5.5H8C5 5.5 2.5 8 2.5 11v17.7c0 3 2.5 5.5 5.5 5.5h17.7c3 0 5.4-2.5 5.4-5.5zM47.2 65.4c-1.5-1.5-4-1.5-5.6 0s-1.5 4 0 5.6l5.2 5.2h-26V45.6c0-2.2-1.8-3.9-3.9-3.9S13 43.5 13 45.6v34.5c0 2.2 1.8 3.9 3.9 3.9h30l-5.2 5.2c-1.5 1.5-1.5 4 0 5.6.8.8 1.8 1.2 2.8 1.2s2-.4 2.8-1.2l11.9-11.9c1.5-1.5 1.5-4 0-5.6l-12-11.9zM92 65.8H74.4c-3 0-5.5 2.5-5.5 5.5V89c0 3 2.5 5.5 5.5 5.5H92c3 0 5.5-2.5 5.5-5.5V71.3c0-3-2.5-5.5-5.5-5.5z"/></symbol>
<symbol id=${constants_default.ICON_SPINNER_SYMBOL_ID} viewBox="0 0 32 32"><path d="M16 32c-4.274 0-8.292-1.664-11.314-4.686s-4.686-7.040-4.686-11.314c0-3.026 0.849-5.973 2.456-8.522 1.563-2.478 3.771-4.48 6.386-5.791l1.344 2.682c-2.126 1.065-3.922 2.693-5.192 4.708-1.305 2.069-1.994 4.462-1.994 6.922 0 7.168 5.832 13 13 13s13-5.832 13-13c0-2.459-0.69-4.853-1.994-6.922-1.271-2.015-3.066-3.643-5.192-4.708l1.344-2.682c2.615 1.31 4.824 3.313 6.386 5.791 1.607 2.549 2.456 5.495 2.456 8.522 0 4.274-1.664 8.292-4.686 11.314s-7.040 4.686-11.314 4.686z"/></symbol>
</defs>`;
    registerAddedNode(constants_default.ICON_SVG_TEMPLATE_ID, `#` + constants_default.ICON_SVG_TEMPLATE_ID);
    document.head.append(template);
  }
  function ensureIconStylesAdded() {
    if (document.querySelector(`#` + constants_default.ICON_STYLES_ID))
      return;
    const style = document.createElement(`style`);
    style.id = constants_default.ICON_STYLES_ID;
    style.innerHTML = `
	.${constants_default.ICON_SPINNER_CLASS} {
		display: none;
		animation: spins 2s linear infinite;
	}
	.${constants_default.ICON_LINK_CLASS} {
		display: inline-block;
	}
	.${constants_default.ICON_LOADING_CLASS} > .${constants_default.ICON_LINK_CLASS} {
		display: none;
	}
	.${constants_default.ICON_LOADING_CLASS} > .${constants_default.ICON_SPINNER_CLASS} {
		display: inline-block;
	}
	.${constants_default.ICON_CLASS} > svg {
		vertical-align: sub;
		height: 1em; width: 1em;
		stroke: currentColor;
		fill: currentColor;
	}`;
    registerAddedNode(constants_default.ICON_STYLES_ID, `#` + constants_default.ICON_STYLES_ID);
    document.head.append(style);
  }

  // src/tippy.js
  var tippy_default = window.tippy;

  // src/rewriting/links/tooltip.js
  function getOriginalLinkHtml(originalHref) {
    registerAddedNode(constants_default.ORIGINAL_LINK_CLASS, `.` + constants_default.ORIGINAL_LINK_CLASS);
    return `Original link: <a class="${constants_default.ORIGINAL_LINK_CLASS}" href="${originalHref}">${originalHref}</a>`;
  }
  function defaultOptions(link) {
    return {
      appendTo: () => link.parentNode,
      allowHTML: true,
      interactive: true,
      animation: false,
      placement: "bottom",
      hideOnClick: false
    };
  }
  function createOriginalLinkTooltip(link, originalHref) {
    trace(`Create original link tooltip`, link, originalHref);
    getIcon(link).addEventListener(`click`, stopEventHandler);
    return createLinkTooltip(link, getOriginalLinkHtml(originalHref));
  }
  function createLinkTooltip(link, content) {
    return tippy_default(getIcon(link), {
      ...defaultOptions(link),
      content
    });
  }
  function createLinkLoadTooltip(link) {
    trace(`Create link load tooltip`, link);
    getIcon(link).classList.add(constants_default.ICON_LOADING_CLASS);
    return createLinkTooltip(link, `Loading home URL...<br />Don't want to wait? ${getOriginalLinkHtml(link.href)}`);
  }
  function linkLoadTooltipSuccess(tooltip, originalHref) {
    linkLoadResult(tooltip, `\u2714\uFE0F Changed link to home instance`, getOriginalLinkHtml(originalHref));
  }
  function linkLoadTooltipError(tooltip, error) {
    linkLoadResult(tooltip, `\u274C  ` + error);
  }
  function linkLoadResult(tooltip, result, finalContent = result) {
    const icon = tooltip.reference;
    icon.classList.remove(constants_default.ICON_LOADING_CLASS);
    icon.addEventListener(`click`, stopEventHandler);
    if (tooltip.state.isVisible) {
      tooltip.setContent(result);
      setTimeout(() => {
        tooltip.hide();
        tooltip.setContent(finalContent);
      }, 2e3);
    } else {
      tooltip.setContent(finalContent);
    }
  }

  // src/rewriting/links/links.js
  function changeLinkHref(link, localUrl) {
    const treeWalker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT, (node) => {
      if (node.textContent.toLowerCase().trim() === link.href.toLowerCase().trim()) {
        return NodeFilter.FILTER_ACCEPT;
      } else {
        return NodeFilter.FILTER_SKIP;
      }
    });
    let textNode;
    while ((textNode = treeWalker.nextNode()) !== null) {
      textNode.textContent = localUrl;
    }
    link.href = localUrl;
    link.addEventListener(`click`, (event) => {
      if (event.button === 0 && !event.ctrlKey && !event.metaKey && link.target !== `_blank`) {
        location.href = localUrl;
      }
    });
  }
  function appendIconTo(elem, icon) {
    if (elem.children.length === 0 || getComputedStyle(elem.children[elem.children.length - 1]).display !== `inline-block`) {
      elem.append(icon);
    } else {
      appendIconTo(elem.children[elem.children.length - 1], icon);
    }
  }
  function addFetchLocalUrlHandler(link) {
    let tooltip;
    const handler = async (event) => {
      if (event.type === `click`) {
        stopEventHandler(event);
        if (tooltip)
          tooltip.show();
        return;
      }
      link.removeEventListener(`focus`, handler);
      link.removeEventListener(`mouseenter`, handler);
      if (link.dataset[constants_default.REWRITE_STATUS] === constants_default.REWRITE_STATUS_PENDING)
        return;
      link.dataset[constants_default.REWRITE_STATUS] = constants_default.REWRITE_STATUS_PENDING;
      tooltip = createLinkLoadTooltip(link);
      try {
        const localUrl = await fetchLocalUrl(link);
        if (!localUrl) {
          debug(`Local URL for ${link.href} could not be found`);
          linkLoadTooltipError(tooltip, `Home URL could not be found`);
          return;
        }
        trace(`Local URL for ${link.href} found: ${localUrl}`);
        const oldHref = link.href;
        changeLinkHref(link, localUrl);
        linkLoadTooltipSuccess(tooltip, oldHref);
        link.dataset[constants_default.REWRITE_STATUS] = constants_default.REWRITE_STATUS_SUCCESS;
      } catch (e) {
        debug(`Error while trying to resolve local URL`, e);
        let msg;
        if (e === constants_default.AUTH_WRONG) {
          msg = `Saved login expired. Return to your home instance and log in again.`;
        } else if (e === constants_default.AUTH_MISSING) {
          msg = constants_default.SETUP_AUTH_MESSAGE;
        } else {
          msg = `Error while trying to find home URL`;
        }
        linkLoadTooltipError(tooltip, msg);
        link.dataset[constants_default.REWRITE_STATUS] = constants_default.REWRITE_STATUS_ERROR;
      } finally {
        link.removeEventListener(`click`, handler);
      }
    };
    link.addEventListener(`click`, handler);
    link.addEventListener(`focus`, handler);
    link.addEventListener(`mouseenter`, handler);
  }
  function isFediverseLink(link) {
    const svg = link.querySelector(`svg`);
    if (!svg)
      return false;
    if (svg.children.length === 0)
      return false;
    return svg.children[0].getAttribute(`xlink:href`)?.includes(`#icon-fedilink`);
  }
  function rewriteToLocal(link) {
    if (!link.parentNode)
      return false;
    if (link.classList.contains(constants_default.ORIGINAL_LINK_CLASS))
      return false;
    if (link.dataset[constants_default.REWRITE_STATUS] === constants_default.REWRITE_STATUS_SUCCESS)
      return false;
    if (isHashLink(link))
      return false;
    if (!isRemoteUrl(link))
      return false;
    if (isFediverseLink(link))
      return false;
    if (isInstantlyRewritable(link)) {
      const localUrl = findLocalUrl(link);
      if (!localUrl)
        return false;
      if (isSamePage(new URL(localUrl), location))
        return false;
      const oldHref = link.href;
      changeLinkHref(link, localUrl);
      const icon = createIcon(link);
      appendIconTo(link, icon);
      createOriginalLinkTooltip(link, oldHref);
      link.dataset[constants_default.REWRITE_STATUS] = constants_default.REWRITE_STATUS_SUCCESS;
      trace(`Rewrite link`, link, ` from`, oldHref, `to`, localUrl);
      return true;
    } else if (isRewritableAfterResolving(link)) {
      if (!getIcon(link)) {
        appendIconTo(link, createIcon(link));
      }
      if (!link.dataset[constants_default.REWRITE_STATUS]) {
        link.dataset[constants_default.REWRITE_STATUS] = constants_default.REWRITE_STATUS_UNRESOLVED;
        addFetchLocalUrlHandler(link);
      }
    }
  }
  function findLinksInChange(change) {
    if (change.type === `childList`) {
      const links = Array.from(change.addedNodes).flatMap((addedNode) => {
        if (addedNode.tagName?.toLowerCase() === `a`) {
          return addedNode;
        } else if (addedNode.querySelectorAll) {
          return Array.from(addedNode.querySelectorAll(`a`));
        } else {
          return [];
        }
      });
      if (links.length > 0)
        trace(`Change`, change, `contained the links`, links);
      return links;
    } else if (change.type === `attributes`) {
      return change.target.matches?.(`a`) ? change.target : [];
    } else {
      return [];
    }
  }
  function findLinksToRewrite(changes) {
    if (!changes) {
      return document.querySelectorAll(`a`);
    }
    return changes.flatMap(findLinksInChange);
  }
  async function rewriteLinksToLocal(changes) {
    const links = findLinksToRewrite(changes);
    const chunkSize = 50;
    return await async function processChunk(currentChunk) {
      const startIdx = currentChunk * chunkSize;
      const endChunkIdx = (currentChunk + 1) * chunkSize;
      const endIdx = Math.min(links.length, endChunkIdx);
      debug(
        `Processing ${links.length} links, current chunk `,
        currentChunk,
        `processing links ${startIdx} to ${endIdx}`
      );
      let anyRewritten = false;
      for (let i = startIdx; i < endIdx; ++i) {
        const rewritten = rewriteToLocal(links[i]);
        anyRewritten = anyRewritten || rewritten;
      }
      debug(`Processed links ${startIdx} to ${endIdx}`);
      if (endChunkIdx >= links.length) {
        return anyRewritten;
      }
      const chunkResult = await new Promise((resolve) => setTimeout(async () => {
        resolve(await processChunk(currentChunk + 1));
      }, 0));
      return anyRewritten || chunkResult;
    }(0);
  }

  // src/settings.js
  var refreshMethods = [];
  async function refresh() {
    for (const refreshMethod of refreshMethods) {
      await refreshMethod();
    }
  }
  function closeSettings() {
    document.querySelector(`#` + constants_default.SETTINGS_MENU_ID)?.remove();
    refreshMethods = [];
  }
  function initSettings() {
    registerMenuCommand(`Open Settings`, showSettings);
  }
  function styles(elem, style) {
    for (const [prop, val] of Object.entries(style)) {
      elem.style[prop] = val;
    }
  }
  var defaultBorder = `1px solid #AAA`;
  function createButton(content, options = {}) {
    const button = document.createElement(`div`);
    button.innerHTML = content;
    styles(button, {
      display: options.inline ? `inline-block` : `block`,
      backgroundColor: `#666`,
      textAlign: `center`,
      border: defaultBorder,
      cursor: `pointer`,
      borderRadius: `8px 8px`,
      padding: `5px`
    });
    return button;
  }
  function ensureMenuStylesAdded() {
    if (document.querySelector(`#` + constants_default.SETTINGS_STYLES_ID))
      return;
    const style = document.createElement(`style`);
    style.id = constants_default.SETTINGS_STYLES_ID;
    style.innerHTML = `
	#${constants_default.SETTINGS_MENU_ID} * {
		box-sizing: border-box;
	}
	`;
    document.head.append(style);
  }
  function showSettings() {
    if (document.querySelector(`#` + constants_default.SETTINGS_MENU_ID))
      return;
    if (window !== window.top)
      return;
    ensureMenuStylesAdded();
    const background = document.createElement(`div`);
    background.id = constants_default.SETTINGS_MENU_ID;
    registerAddedNode(constants_default.SETTINGS_MENU_ID, `#` + constants_default.SETTINGS_MENU_ID);
    styles(background, {
      position: `fixed`,
      top: `0`,
      left: `0`,
      zIndex: 9999,
      width: `100vw`,
      height: `100vh`,
      backgroundColor: `#00000099`,
      backdropFilter: `blur(6px)`,
      display: `grid`,
      grid: `grid`,
      alignItems: `center`,
      justifyContent: `space-around`
    });
    background.addEventListener(`click`, (event) => {
      if (event.target === background) {
        closeSettings();
      }
    });
    const menu = document.createElement(`div`);
    styles(menu, {
      position: `relative`,
      color: `#ddd`,
      maxWidth: `90vw`,
      maxHeight: `90vh`,
      backgroundColor: `#555`,
      padding: `20px`,
      border: defaultBorder,
      borderRadius: `8px`,
      overflow: `hidden auto`
    });
    background.append(menu);
    const closeButton = createButton(`\u{1F5D9}`);
    styles(closeButton, {
      position: `absolute`,
      top: `-1px`,
      right: `-1px`,
      width: `30px`,
      height: `30px`,
      lineHeight: `25px`,
      fontSize: `25px`,
      borderRadius: `0 8px`,
      padding: 0
    });
    closeButton.addEventListener(`click`, () => closeSettings());
    menu.append(closeButton);
    const menuHeader = createSettingHeader(`Lemmy Universal Link Switcher Settings`, 1.5);
    styles(menuHeader, {
      textDecoration: `underline`,
      marginTop: 0
    });
    menu.append(menuHeader);
    addMainHomeInstanceSetting(menu);
    addMoreHomeInstancesSettings(menu);
    document.body.append(background);
  }
  function createSettingHeader(text, sizeMultiplicator = 1) {
    const header = document.createElement(`div`);
    header.innerHTML = text;
    styles(header, {
      marginRight: `10px`,
      fontSize: `${sizeMultiplicator * 1.4}em`,
      lineHeight: `${sizeMultiplicator * 1.4}em`,
      fontWeight: `bold`,
      marginTop: `${sizeMultiplicator * 25}px`,
      marginBottom: `${sizeMultiplicator * 10}px`
    });
    return header;
  }
  function addInfo(elem, content) {
    const info = document.createElement(`span`);
    info.innerHTML = ` \u{1F6C8}`;
    tippy_default(info, {
      content,
      placement: "bottom",
      triggerTarget: elem
    });
    elem.append(info);
  }
  function createInput(options) {
    const inputElement = document.createElement(`input`);
    styles(inputElement, {
      width: `100%`,
      margin: 0
    });
    if (options.placeholder) {
      inputElement.placeholder = options.placeholder;
    }
    if (options.getter) {
      Promise.resolve(options.getter()).then((result) => inputElement.value = result);
    }
    if (!inputElement.value) {
      inputElement.setCustomValidity(`empty`);
    }
    styles(inputElement, { border: defaultBorder });
    if (!options.validator && !options.setter) {
      return;
    }
    let validator = options.validator || (() => true);
    let setter = options.setter || (() => {
    });
    inputElement.addEventListener(`input`, async () => {
      const validated = await validator(inputElement.value);
      if (!inputElement.value || validated) {
        inputElement.setCustomValidity(`empty`);
        styles(inputElement, {
          border: defaultBorder
        });
      }
      if (inputElement.value) {
        if (validated) {
          inputElement.setCustomValidity(``);
          await setter(inputElement.value);
        } else if (!validated) {
          inputElement.setCustomValidity(`fail`);
          styles(inputElement, {
            border: `1px solid red`
          });
        }
      }
    });
    return inputElement;
  }
  var urlValidator = (value) => {
    try {
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  };
  var instancePlaceholder = `The full link (including http(s)://) to the instance`;
  function addMainHomeInstanceSetting(addTo) {
    const header = createSettingHeader(`Main Home Instance`);
    addInfo(header, `All links will be rewritten to this instance, except for links to your secondary home instances.`);
    addTo.append(header);
    const mainInstance = createInput({
      getter: () => HOME,
      setter: (value) => {
        const url = new URL(value);
        if (HOME !== url.origin) {
          setHome(url.origin);
          refresh();
        }
      },
      validator: urlValidator,
      placeholder: instancePlaceholder
    });
    addTo.append(mainInstance);
    const homeButtonWrapper = document.createElement(`div`);
    const refreshMakeHomeButton = () => {
      homeButtonWrapper.replaceChildren();
      if (location.origin === HOME)
        return;
      const makeHomeButton = createButton(`Use current page as home instance`);
      styles(makeHomeButton, {
        borderRadius: `0 0 8px 8px`
      });
      makeHomeButton.addEventListener(`click`, () => {
        mainInstance.value = location.origin;
        mainInstance.dispatchEvent(new Event(`input`));
      });
      homeButtonWrapper.append(makeHomeButton);
    };
    refreshMakeHomeButton();
    refreshMethods.push(refreshMakeHomeButton);
    addTo.append(homeButtonWrapper);
  }
  async function addMoreHomeInstancesSettings(addTo) {
    const header = createSettingHeader(`Secondary Home Instances`);
    addInfo(header, `All links pointing to these instances will not be changed.`);
    addTo.append(header);
    addTo.append(createListInput(
      async () => await getSecondaryHomeInstances(),
      async (value) => {
        const homeInstances = await getSecondaryHomeInstances();
        homeInstances.push(new URL(value).origin);
        await setSecondaryHomeInstances(homeInstances);
      },
      async (value) => {
        const homeInstances = await getSecondaryHomeInstances();
        var index = homeInstances.indexOf(new URL(value).origin);
        if (index > -1) {
          homeInstances.splice(index, 1);
        }
        await setSecondaryHomeInstances(homeInstances);
      }
    ));
  }
  function createListItem(item, onClick) {
    const listItem = createButton(item + ` \u{1F5D9}`, { inline: true });
    styles(listItem, {
      margin: `0px 5px 5px 0`
    });
    listItem.addEventListener(`click`, onClick);
    return listItem;
  }
  function createListInput(getter, add, remove) {
    const wrapper = document.createElement(`div`);
    const list = document.createElement(`div`);
    styles(list, {
      marginBottom: `8px`
    });
    const refreshList = async () => {
      const items = (await getter()).sort().map((item) => createListItem(item, async () => {
        await remove(item);
        refresh();
      }));
      if (items.length) {
        list.replaceChildren(...items);
      } else {
        list.replaceChildren(`<None>`);
      }
    };
    refreshList();
    refreshMethods.push(refreshList);
    wrapper.append(list);
    const addInput = createInput({
      validator: async (value) => {
        return urlValidator(value) && !(await getter()).includes(value);
      },
      placeholder: instancePlaceholder
    });
    wrapper.append(addInput);
    const buttonWrapper = document.createElement(`div`);
    const refreshButtons = async () => {
      buttonWrapper.replaceChildren();
      const isCurrentPageHome = HOME === location.origin || (await getter()).includes(location.origin);
      const addButton2 = createButton(`Add`);
      styles(addButton2, {
        borderRadius: isCurrentPageHome ? `0 0 8px 8px` : `0`
      });
      addButton2.addEventListener(`click`, async () => {
        if (addInput.validity.valid) {
          await add(addInput.value);
          addInput.value = ``;
          refresh();
        }
      });
      buttonWrapper.append(addButton2);
      if (!isCurrentPageHome) {
        const addCurrentButton = createButton(`Add current page`);
        styles(addCurrentButton, {
          borderRadius: `0 0 8px 8px`
        });
        addCurrentButton.addEventListener(`click`, async () => {
          await add(location.origin);
          addInput.value = ``;
          refresh();
        });
        buttonWrapper.append(addCurrentButton);
      }
    };
    refreshButtons();
    refreshMethods.push(refreshButtons);
    wrapper.append(buttonWrapper);
    return wrapper;
  }

  // src/rewriting/settings-buttons.js
  function addSettingsButton() {
    if (location.pathname !== `/settings`)
      return false;
    if (!document.querySelector(`[name="Description"][content="Lemmy"]`))
      return false;
    if (document.querySelector(`#` + constants_default.SETTINGS_BUTTON_ID))
      return false;
    const insertAfter = document.querySelector(`#user-password`)?.closest(`.card`);
    if (!insertAfter)
      return;
    const button = document.createElement(`button`);
    button.id = constants_default.SETTINGS_BUTTON_ID;
    button.setAttribute(`class`, `btn btn-block btn-primary mr-4 w-100`);
    button.innerHTML = `Lemmy Universal Link Switcher Settings`;
    button.addEventListener(`click`, showSettings);
    registerAddedNode(constants_default.SETTINGS_BUTTON_ID, `#` + constants_default.SETTINGS_BUTTON_ID);
    insertAfter.insertAdjacentElement("afterend", button);
    return true;
  }

  // src/rewriting/show-at-home.js
  function showAtHomeButtonText() {
    const host = new URL(HOME).hostname;
    return `Show on ${host}`;
  }
  function createShowAtHomeAnchor(localUrl) {
    const showAtHome = document.createElement(`a`);
    showAtHome.dataset.creationHref = location.href;
    showAtHome.classList.add(constants_default.SHOW_AT_HOME_BUTTON_CLASS);
    showAtHome.innerHTML = showAtHomeButtonText();
    showAtHome.href = localUrl;
    registerAddedNode(constants_default.SHOW_AT_HOME_BUTTON_CLASS, `.` + constants_default.SHOW_AT_HOME_BUTTON_CLASS);
    return showAtHome;
  }
  function addLemmyShowAtHomeButton(localUrl) {
    const logo = document.querySelector(`a.navbar-brand`);
    const navbarIcons = isV17() ? document.querySelector(`[title="Search"]`)?.closest(`.navbar-nav`) : document.querySelector(`#navbarIcons`);
    if (!logo || !navbarIcons) {
      debug(`Could not find position to insert ShowAtHomeButton at`);
      return false;
    }
    const mobile = createShowAtHomeAnchor(localUrl);
    mobile.classList.add(`d-md-none`);
    mobile.style[`margin-right`] = `8px`;
    mobile.style[`margin-left`] = `auto`;
    if (isV17()) {
      document.querySelector(`.navbar-nav.ml-auto`)?.classList.remove(`ml-auto`);
    }
    logo.insertAdjacentElement("afterend", mobile);
    const desktop = createShowAtHomeAnchor(localUrl);
    desktop.classList.add(`d-md-inline`);
    desktop.style[`margin-right`] = `8px`;
    navbarIcons.insertAdjacentElement("beforebegin", desktop);
    return true;
  }
  function addKbinShowAtHomeButton(localUrl) {
    const prependTo = document.querySelector(`#header menu:not(.head-nav__menu)`);
    if (!prependTo) {
      debug(`Could not find position to insert ShowAtHomeButton at`);
      return false;
    }
    const item = document.createElement(`li`);
    item.append(createShowAtHomeAnchor(localUrl));
    prependTo.prepend(item);
    return true;
  }
  function addButton(localUrl) {
    const oldButton = document.querySelectorAll(`.` + constants_default.SHOW_AT_HOME_BUTTON_CLASS);
    if (oldButton.length > 0 && oldButton[0].dataset.creationHref !== location.href) {
      debug(`Removing old show at home button`);
      oldButton.forEach((btn) => btn.remove());
    } else if (oldButton.length > 0) {
      debug(`Old show at home button still exists`);
      return false;
    }
    if (!localUrl) {
      debug(`No local URL for show at home button found`);
      return false;
    } else if (isRemoteLemmyUrl(location)) {
      return addLemmyShowAtHomeButton(localUrl);
    } else if (isRemoteKbinUrl(location)) {
      return addKbinShowAtHomeButton(localUrl);
    } else {
      return false;
    }
  }
  async function addShowAtHomeButton() {
    if (isInstantlyRewritable(location)) {
      return addButton(findLocalUrl(location));
    } else if (isRewritableAfterResolving(location)) {
      try {
        return addButton(await fetchLocalUrl(location));
      } catch (e) {
        debug(`Error while trying to add "show at home" button`, e);
      }
    }
  }

  // src/rewriting/rewrite.js
  function triggerRewrite() {
    doAllDomChanges();
  }
  function isOrHasOurAddedNode(node) {
    return getAddedNodesSelectors().some((selector) => node.matches?.(selector) || node.querySelector?.(selector));
  }
  function isIrrelevantChange(change) {
    if (change.type === `childList`) {
      if (Array.from(change.removedNodes).some(isOrHasOurAddedNode)) {
        trace(`Change`, change, `is relevant because a removed node is/has ours`);
        return false;
      }
      if (!Array.from(change.addedNodes).every(isOrHasOurAddedNode)) {
        trace(`Change`, change, `is relevant because not every added node is/has ours`);
        return false;
      }
    } else if (change.type === `attributes` && isRemoteUrl(new URL(change.target.href, location.origin))) {
      trace(`Change`, change, `is relevant because href changed to a remote URL`);
      return false;
    }
    trace(`Change`, change, `is irrelevant`);
    return true;
  }
  async function startRewriting() {
    new MutationObserver((changes, observer) => {
      debug(`MutationObserver triggered`, changes);
      if (changes.every(isIrrelevantChange)) {
        debug(`All observed changes are irrelevant`);
        return;
      }
      doAllDomChanges(changes);
    }).observe(document.body, {
      subtree: true,
      childList: true,
      attributeFilter: [`href`]
    });
    await doAllDomChanges();
  }
  async function doAllDomChanges(changes) {
    debug(`doAllDomChanges start`);
    const addedSettingsButtons = addSettingsButton();
    if (addedSettingsButtons)
      debug(`Added Settings Buttons`);
    const addedShowAtHomeButton = HOME ? addShowAtHomeButton() : false;
    if (addedShowAtHomeButton)
      debug(`Added Show At Home Button`);
    const rewrittenLinks = HOME ? await rewriteLinksToLocal(changes) : false;
    if (rewrittenLinks)
      debug(`Rewritten some links`);
    debug(`doAllDomChanges end`);
  }

  // src/home.js
  var HOME;
  var secondaryHomes = [];
  async function initHome() {
    HOME = await getValue(`home`);
    secondaryHomes = await getSecondaryHomeInstances();
    if (!HOME && isLemmyInstance(location) && confirm(`Lemmy Universal Link Switcher: Set this instance to be your home instance to which all URLs get rewritten to?`)) {
      setHome(location.origin);
    }
  }
  async function setHome(newHome) {
    trace(`Set HOME from ${HOME} to ${newHome}`);
    if (typeof newHome !== `string`) {
      newHome = null;
    }
    HOME = newHome;
    await setValue(`home`, newHome);
  }
  async function getHome() {
    return await getValue(`home`);
  }
  function updateHomePeriodically() {
    trace(`Current HOME`, HOME);
    setInterval(async () => {
      const prevHome = HOME;
      const prevSecondaries = secondaryHomes;
      HOME = await getHome();
      secondaryHomes = await getSecondaryHomeInstances();
      if (prevHome !== HOME) {
        debug(`HOME changed externally from`, prevHome, `to`, HOME);
        triggerRewrite();
      } else if (prevSecondaries.length !== secondaryHomes.length || !prevSecondaries.every((v) => secondaryHomes.includes(v))) {
        debug(`secondaryHomes changed externally from`, prevSecondaries, `to`, secondaryHomes);
        triggerRewrite();
      }
    }, 1337);
  }
  function isHomeInstance(url) {
    return secondaryHomes.concat(HOME).includes(url.origin);
  }
  async function getSecondaryHomeInstances() {
    const homeInstancesStr = await getValue(`secondaryHomes`);
    return homeInstancesStr ? JSON.parse(homeInstancesStr) : [];
  }
  async function setSecondaryHomeInstances(homeInstances) {
    await setValue(`secondaryHomes`, JSON.stringify(homeInstances));
  }

  // src/main.js
  (async () => {
    await initHome();
    updateHomePeriodically();
    await initAuth();
    updateAuthPeriodically();
    initSettings();
    startRewriting();
  })();
})();
