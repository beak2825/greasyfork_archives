// ==UserScript==
// @name        WebPlay for ytdl
// @namespace   Hill98
// @description Show WebPlay play button on some ytdl protocol supported pages
// @version     1.2.1
// @author      Hill-98
// @license     MIT
// @icon        https://www.google.com/s2/favicons?domain=mpv.io
// @homepageURL https://github.com/Hill-98/userscripts
// @supportURL  https://github.com/Hill-98/userscripts/issues
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @require     https://unpkg.com/pyodide@0.22.0/pyodide.js
// @noframes
// @inject-into content
// @run-at      document-start
// @match *://0000.studio/*
// @match *://17.live/*
// @match *://www.1news.co.nz/*
// @match *://www.onenews.co.nz/*
// @match *://www.1tv.ru/*
// @match *://www.20min.ch/*
// @match *://video.twentythree.net/*
// @match *://bonnier-publications-danmark.23video.com/*
// @match *://247sports.com/*
// @match *://24tv.ua/*
// @match *://www.24video.net/*
// @match *://www.24video.me/*
// @match *://www.24video.tube/*
// @match *://www.24video.site/*
// @match *://porno.24video.net/*
// @match *://www.24video.vip/*
// @match *://porn.24video.net/*
// @match *://playout.3qsdn.com/*
// @match *://www.3sat.de/*
// @match *://www.4tube.com/*
// @match *://m.4tube.com/*
// @match *://www.56.com/*
// @match *://www.6play.fr/*
// @match *://www.rtlplay.be/*
// @match *://play.rtl.hr/*
// @match *://www.rtlmost.hu/*
// @match *://7plus.com.au/*
// @match *://8tracks.com/*
// @match *://91porn.com/*
// @match *://9gag.com/*
// @match *://www.9now.com.au/*
// @match *://www.abc.net.au/*
// @match *://iview.abc.net.au/*
// @match *://abcnews.go.com/*
// @match *://abc7news.com/*
// @match *://6abc.com/*
// @match *://clips.abcotvs.com/*
// @match *://abema.tv/*
// @match *://academicearth.org/*
// @match *://www.acast.com/*
// @match *://embed.acast.com/*
// @match *://play.acast.com/*
// @match *://www.acfun.cn/*
// @match *://animationdigitalnetwork.fr/*
// @match *://animedigitalnetwork.fr/*
// @match *://tv.adobe.com/*
// @match *://video.tv.adobe.com/*
// @match *://adultswim.com/*
// @match *://www.adultswim.com/*
// @match *://www.history.com/*
// @match *://www.aetv.com/*
// @match *://www.fyi.tv/*
// @match *://www.mylifetime.com/*
// @match *://watch.lifetimemovieclub.com/*
// @match *://play.aetv.com/*
// @match *://watch.historyvault.com/*
// @match *://www.historyvault.com/*
// @match *://aeon.co/*
// @match *://live.afreecatv.com:8079/*
// @match *://afbbs.afreecatv.com:8080/*
// @match *://vod.afreecatv.com/*
// @match *://www.afreecatv.com/*
// @match *://play.afreecatv.com/*
// @match *://play.afreeca.com/*
// @match *://bj.afreecatv.com/*
// @match *://air.mozilla.org/*
// @match *://www.air.tv/*
// @match *://aitube.kz/*
// @match *://live.aliexpress.com/*
// @match *://balkans.aljazeera.net/*
// @match *://www.allocine.fr/*
// @match *://www.alphaporno.com/*
// @match *://www.alsace20.tv/*
// @match *://cursos.alura.com.br/*
// @match *://amara.org/*
// @match *://www.amazon.in/*
// @match *://www.amazon.com/*
// @match *://www.amazon.co.uk/*
// @match *://www.amazon.es/*
// @match *://www.bbcamerica.com/*
// @match *://www.amc.com/*
// @match *://www.wetv.com/*
// @match *://www.ifc.com/*
// @match *://www.sundancetv.com/*
// @match *://www.americastestkitchen.com/*
// @match *://www.ahctv.com/*
// @match *://anderetijden.nl/*
// @match *://www.angel.com/*
// @match *://www.animalplanet.com/*
// @match *://www.ant1news.gr/*
// @match *://ant1news.gr/*
// @match *://www.antenna.gr/*
// @match *://www.aol.com/*
// @match *://www.aol.ca/*
// @match *://www.aol.co.uk/*
// @match *://www.aol.de/*
// @match *://www.aol.jp/*
// @match *://uvp.apa.at/*
// @match *://uvp-apapublisher.sf.apa.at/*
// @match *://uvp-rma.sf.apa.at/*
// @match *://uvp-kleinezeitung.sf.apa.at/*
// @match *://www.aparat.com/*
// @match *://itunes.apple.com/*
// @match *://ent.appledaily.com.tw/*
// @match *://www.appledaily.com.tw/*
// @match *://podcasts.apple.com/*
// @match *://trailers.apple.com/*
// @match *://movietrailers.apple.com/*
// @match *://archive.org/*
// @match *://www.daserste.de/*
// @match *://www.ardmediathek.de/*
// @match *://one.ard.de/*
// @match *://mediathek.daserste.de/*
// @match *://mediathek.rbb-online.de/*
// @match *://classic.ardmediathek.de/*
// @match *://beta.ardmediathek.de/*
// @match *://ardmediathek.de/*
// @match *://video.qbrick.com/*
// @match *://play.arkena.com/*
// @match *://video.arkena.com/*
// @match *://arte.sky.it/*
// @match *://www.arte.tv/*
// @match *://api.arte.tv/*
// @match *://www.asiancrush.com/*
// @match *://www.yuyutv.com/*
// @match *://www.midnightpulp.com/*
// @match *://www.cocoro.tv/*
// @match *://www.retrocrush.tv/*
// @match *://www.atresplayer.com/*
// @match *://atscaleconference.com/*
// @match *://techchannel.att.com/*
// @match *://www.atv.at/*
// @match *://www.audi-mediacenter.com/*
// @match *://audioboom.com/*
// @match *://nokiatune.audiodraft.com/*
// @match *://vikinggrace.audiodraft.com/*
// @match *://timferriss.audiodraft.com/*
// @match *://www.audiodraft.com/*
// @match *://www.audiomack.com/*
// @match *://audius.co/*
// @match *://awaan.ae/*
// @match *://dcndigital.ae/*
// @match *://www.dcndigital.ae/*
// @match *://tv.telezueri.ch/*
// @match *://www.telebaern.tv/*
// @match *://v.baidu.com/*
// @match *://banbye.com/*
// @match *://www.b-ch.com/*
// @match *://youtube-dl.bandcamp.com/*
// @match *://benprunty.bandcamp.com/*
// @match *://relapsealumni.bandcamp.com/*
// @match *://diskotopia.bandcamp.com/*
// @match *://blazo.bandcamp.com/*
// @match *://nightbringer.bandcamp.com/*
// @match *://jstrecords.bandcamp.com/*
// @match *://insulters.bandcamp.com/*
// @match *://adrianvonziegler.bandcamp.com/*
// @match *://dotscale.bandcamp.com/*
// @match *://nightcallofficial.bandcamp.com/*
// @match *://steviasphere.bandcamp.com/*
// @match *://coldworldofficial.bandcamp.com/*
// @match *://nuclearwarnowproductions.bandcamp.com/*
// @match *://bandcamp.com/*
// @match *://banned.video/*
// @match *://www.bbc.com/*
// @match *://www.bbc.co.uk/*
// @match *://www.bbcnewsd73hkzno2ini43t4gblxvycyac5aw4gnv7t2rccijh7745uqd.onion/*
// @match *://www.bbcweb3hytmzhn5d532owbu6oqadra5z3ar726vq5kgwwn6aucdccrad.onion/*
// @match *://bbv-tv.net/*
// @match *://beatbump.ml/*
// @match *://beatport.com/*
// @match *://beeg.com/*
// @match *://www.behindkink.com/*
// @match *://www.bellator.com/*
// @match *://www.bnnbloomberg.ca/*
// @match *://www.thecomedynetwork.ca/*
// @match *://www.tsn.ca/*
// @match *://www.bnn.ca/*
// @match *://www.ctv.ca/*
// @match *://www.much.com/*
// @match *://www.etalk.ca/*
// @match *://www.cp24.com/*
// @match *://web.arbeitsagentur.de/*
// @match *://www.bet.com/*
// @match *://player.bfi.org.uk/*
// @match *://www.bfmtv.com/*
// @match *://www.bibeltv.de/*
// @match *://www.bigflix.com/*
// @match *://www.bigo.tv/*
// @match *://bigo.tv/*
// @match *://www.bild.de/*
// @match *://www.bilibili.com/*
// @match *://player.bilibili.com/*
// @match *://space.bilibili.com/*
// @match *://www.bilibili.tv/*
// @match *://www.biliintl.com/*
// @match *://bilibili.tv/*
// @match *://live.bilibili.com/*
// @match *://tv.biobiochile.cl/*
// @match *://www.biobiochile.cl/*
// @match *://www.biography.com/*
// @match *://biqle.ru/*
// @match *://biqle.org/*
// @match *://www.bitchute.com/*
// @match *://bitwave.tv/*
// @match *://us-lti.bbcollab.com/*
// @match *://us.bbcollab.com/*
// @match *://ca.bbcollab.com/*
// @match *://eu.bbcollab.com/*
// @match *://au.bbcollab.com/*
// @match *://bleacherreport.com/*
// @match *://www.blogger.com/*
// @match *://www.bloomberg.com/*
// @match *://union.bokecc.com/*
// @match *://de.bongacams.com/*
// @match *://cn.bongacams.com/*
// @match *://de.bongacams.net/*
// @match *://booyah.live/*
// @match *://www.bostonglobe.com/*
// @match *://mlssoccer.app.box.com/*
// @match *://www.bpb.de/*
// @match *://www.br.de/*
// @match *://www.br-klassik.de/*
// @match *://www.bravotv.com/*
// @match *://www.oxygen.com/*
// @match *://www.break.com/*
// @match *://www.breitbart.com/*
// @match *://c.brightcove.com/*
// @match *://link.brightcove.com/*
// @match *://players.brightcove.net/*
// @match *://www.bt.no/*
// @match *://www.bundesliga.com/*
// @match *://uk.businessinsider.com/*
// @match *://www.businessinsider.nl/*
// @match *://www.businessinsider.com/*
// @match *://www.buzzfeed.com/*
// @match *://www.byutv.org/*
// @match *://cableav.tv/*
// @match *://www.callin.com/*
// @match *://cwwp2.dot.ca.gov/*
// @match *://www.cam4.com/*
// @match *://www.camdemy.com/*
// @match *://www.cammodels.com/*
// @match *://www.camsoda.com/*
// @match *://camwithher.tv/*
// @match *://www.canalalpha.ch/*
// @match *://www.canalc2.tv/*
// @match *://archives-canalc2.u-strasbg.fr/*
// @match *://www.mycanal.fr/*
// @match *://www.piwiplus.fr/*
// @match *://mediazone.vrt.be/*
// @match *://www.canvas.be/*
// @match *://www.een.be/*
// @match *://video1.carambatv.ru/*
// @match *://carambatv.ru/*
// @match *://www.cartoonnetwork.com/*
// @match *://www.cbc.ca/*
// @match *://www.cbs.com/*
// @match *://colbertlateshow.com/*
// @match *://www.colbertlateshow.com/*
// @match *://www.cnet.com/*
// @match *://www.zdnet.com/*
// @match *://newyork.cbslocal.com/*
// @match *://losangeles.cbslocal.com/*
// @match *://cleveland.cbslocal.com/*
// @match *://www.cbsnews.com/*
// @match *://www.cbssports.com/*
// @match *://embed.247sports.com/*
// @match *://www.ccma.cat/*
// @match *://sports.cntv.cn/*
// @match *://tv.cctv.com/*
// @match *://english.cntv.cn/*
// @match *://cctv.cntv.cn/*
// @match *://www.ncpa-classic.com/*
// @match *://ent.cntv.cn/*
// @match *://tv.cntv.cn/*
// @match *://www.cda.pl/*
// @match *://ebd.cda.pl/*
// @match *://cellebrite.com/*
// @match *://www.ceskatelevize.cz/*
// @match *://news.cgtn.com/*
// @match *://channel9.msdn.com/*
// @match *://charlierose.com/*
// @match *://www.chaturbate.com/*
// @match *://chaturbate.com/*
// @match *://en.chaturbate.com/*
// @match *://www.chilloutzone.net/*
// @match *://chingari.io/*
// @match *://chirb.it/*
// @match *://chirbit.com/*
// @match *://www.cielotv.it/*
// @match *://player.cinchcast.com/*
// @match *://www.cinemax.com/*
// @match *://www.cinetecamilano.it/*
// @match *://ciscolive.cisco.com/*
// @match *://www.ciscolive.com/*
// @match *://demosubdomain.webex.com/*
// @match *://cjsw.com/*
// @match *://www.cliphunter.com/*
// @match *://www.clippituser.tv/*
// @match *://www.clip.rs/*
// @match *://www.clipsyndicate.com/*
// @match *://chic.clipsyndicate.com/*
// @match *://closertotruth.com/*
// @match *://embed.cloudflarestream.com/*
// @match *://watch.cloudflarestream.com/*
// @match *://cloudflarestream.com/*
// @match *://embed.videodelivery.net/*
// @match *://www.cloudy.ec/*
// @match *://www.clubic.com/*
// @match *://clyp.it/*
// @match *://www.cmt.com/*
// @match *://video.cnbc.com/*
// @match *://www.cnbc.com/*
// @match *://edition.cnn.com/*
// @match *://www.cnn.com/*
// @match *://money.cnn.com/*
// @match *://cnn.com/*
// @match *://reliablesources.blogs.cnn.com/*
// @match *://www.cnnindonesia.com/*
// @match *://www.cc.com/*
// @match *://www.comedycentral.tv/*
// @match *://video.wired.com/*
// @match *://video.gq.com/*
// @match *://player.cnevids.com/*
// @match *://player-backend.cnevids.com/*
// @match *://www.contv.com/*
// @match *://watch.cookingchanneltv.com/*
// @match *://www.hgtv.ca/*
// @match *://www.foodnetwork.ca/*
// @match *://etcanada.com/*
// @match *://www.history.ca/*
// @match *://www.showcase.ca/*
// @match *://www.bigbrothercanada.ca/*
// @match *://www.seriesplus.com/*
// @match *://www.disneychannel.ca/*
// @match *://coub.com/*
// @match *://c-cdn.coub.com/*
// @match *://cozy.tv/*
// @match *://www.cpac.ca/*
// @match *://www.cracked.com/*
// @match *://www.crackle.com/*
// @match *://www.sonycrackle.com/*
// @match *://www.craftsy.com/*
// @match *://embed.crooksandliars.com/*
// @match *://crowdbunker.com/*
// @match *://www.crunchyroll.com/*
// @match *://beta.crunchyroll.com/*
// @match *://www.c-span.org/*
// @match *://news.cts.com.tw/*
// @match *://www.ctvnews.ca/*
// @match *://vancouverisland.ctvnews.ca/*
// @match *://cu.ntv.co.jp/*
// @match *://www.cultureunplugged.com/*
// @match *://app.curiositystream.com/*
// @match *://curiositystream.com/*
// @match *://cwtv.com/*
// @match *://www.cwseed.com/*
// @match *://cwtvpr.com/*
// @match *://app.cybrary.it/*
// @match *://daftsex.com/*
// @match *://dagelijksekost.een.be/*
// @match *://www.dailymail.co.uk/*
// @match *://www.dailymotion.com/*
// @match *://geo.dailymotion.com/*
// @match *://www.lequipe.fr/*
// @match *://www.dailywire.com/*
// @match *://www.clubdam.com/*
// @match *://tvpot.daum.net/*
// @match *://m.tvpot.daum.net/*
// @match *://videofarm.daum.net/*
// @match *://player.daystar.tv/*
// @match *://www.dagbladet.no/*
// @match *://www.dctp.tv/*
// @match *://www.deezer.com/*
// @match *://www.defense.gouv.fr/*
// @match *://www.democracynow.org/*
// @match *://www.destinationamerica.com/*
// @match *://2m.ma/*
// @match *://www.dhm.de/*
// @match *://digg.com/*
// @match *://www.digitalconcerthall.com/*
// @match *://evt.dispeak.com/*
// @match *://events.digitallyspeaking.com/*
// @match *://sevt.dispeak.com/*
// @match *://www.ultimedia.com/*
// @match *://www.digiteka.net/*
// @match *://go.discovery.com/*
// @match *://www.investigationdiscovery.com/*
// @match *://www.sciencechannel.com/*
// @match *://www.discoverylife.com/*
// @match *://www.tlc.de/*
// @match *://www.dmax.de/*
// @match *://www.dplay.co.uk/*
// @match *://tlc.de/*
// @match *://www.discoveryplus.com/*
// @match *://discoveryplus.com/*
// @match *://www.discoveryplus.in/*
// @match *://www.discoveryplus.it/*
// @match *://video.disney.com/*
// @match *://www.starwars.com/*
// @match *://videos.disneylatino.com/*
// @match *://video.en.disneyme.com/*
// @match *://video.disneyturkiye.com.tr/*
// @match *://disneyjunior.disney.com/*
// @match *://spiderman.marvelkids.com/*
// @match *://disneyjunior.en.disneyme.com/*
// @match *://disneychannel.de/*
// @match *://watch.diynetwork.com/*
// @match *://dlive.tv/*
// @match *://dotsub.com/*
// @match *://www.douyin.com/*
// @match *://v.douyu.com/*
// @match *://vmobile.douyu.com/*
// @match *://www.douyutv.com/*
// @match *://www.douyu.com/*
// @match *://www.dplay.se/*
// @match *://www.dplay.dk/*
// @match *://www.dplay.no/*
// @match *://it.dplay.com/*
// @match *://es.dplay.com/*
// @match *://www.dplay.fi/*
// @match *://www.dplay.jp/*
// @match *://www.discoveryplus.se/*
// @match *://www.discoveryplus.dk/*
// @match *://www.discoveryplus.no/*
// @match *://www.discoveryplus.es/*
// @match *://www.discoveryplus.fi/*
// @match *://www.dr.dk/*
// @match *://peacocktv.com/*
// @match *://www.channel4.com/*
// @match *://www.channel5.com/*
// @match *://hsesn.apps.disneyplus.com/*
// @match *://www.disneyplus.com/*
// @match *://open.spotify.com/*
// @match *://www.tvnz.co.nz/*
// @match *://www.oneplus.ch/*
// @match *://www.artstation.com/*
// @match *://www.philo.com/*
// @match *://www.mech-plus.com/*
// @match *://watch.mech-plus.com/*
// @match *://www.aha.video/*
// @match *://mubi.com/*
// @match *://www.vootkids.com/*
// @match *://www.nowtv.it/*
// @match *://tv.apple.com/*
// @match *://drooble.com/*
// @match *://www.dropbox.com/*
// @match *://www.dropout.tv/*
// @match *://www.drtuber.com/*
// @match *://m.drtuber.com/*
// @match *://dr-massive.com/*
// @match *://d.tube/*
// @match *://w.duboku.io/*
// @match *://www.dumpert.nl/*
// @match *://legacy.dumpert.nl/*
// @match *://video.aktualne.cz/*
// @match *://www.dw.com/*
// @match *://lentaru.media.eagleplatform.com/*
// @match *://www.ebaumsworld.com/*
// @match *://www.echo.msk.ru/*
// @match *://egghead.io/*
// @match *://app.egghead.io/*
// @match *://www.ehftv.com/*
// @match *://www.ehow.com/*
// @match *://1und1.tv/*
// @match *://einthusan.tv/*
// @match *://einthusan.com/*
// @match *://einthusan.ca/*
// @match *://www.eitb.tv/*
// @match *://api-prod.ellentube.com/*
// @match *://www.ellentube.com/*
// @match *://elonet.finna.fi/*
// @match *://blogs.elpais.com/*
// @match *://elcomidista.elpais.com/*
// @match *://elpais.com/*
// @match *://epv.elpais.com/*
// @match *://cdn.embedly.com/*
// @match *://www.empflix.com/*
// @match *://www.engadget.com/*
// @match *://www.epicon.in/*
// @match *://www.theepochtimes.com/*
// @match *://www.eporner.com/*
// @match *://www.eroprofile.com/*
// @match *://www.ertflix.gr/*
// @match *://www.ert.gr/*
// @match *://www.escapistmagazine.com/*
// @match *://escapistmagazine.com/*
// @match *://v1.escapistmagazine.com/*
// @match *://espn.go.com/*
// @match *://broadband.espn.go.com/*
// @match *://nonredline.sports.espn.go.com/*
// @match *://cdn.espn.go.com/*
// @match *://www.espn.com/*
// @match *://www.espnfc.us/*
// @match *://www.espnfc.com/*
// @match *://www.espncricinfo.com/*
// @match *://video.esri.com/*
// @match *://ec.europa.eu/*
// @match *://multimedia.europarl.europa.eu/*
// @match *://webstreaming.europarl.europa.eu/*
// @match *://www.europeantour.com/*
// @match *://www.eurosport.com/*
// @match *://euscreen.eu/*
// @match *://tvonline.ewe.de/*
// @match *://www.expotv.com/*
// @match *://www.expressen.se/*
// @match *://www.di.se/*
// @match *://www.extremetube.com/*
// @match *://www.eyedo.tv/*
// @match *://www.facebook.com/*
// @match *://m.facebook.com/*
// @match *://zh-hk.facebook.com/*
// @match *://www.facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion/*
// @match *://fancode.com/*
// @match *://www.faz.net/*
// @match *://video.fc2.com/*
// @match *://live.fc2.com/*
// @match *://fc-zenit.ru/*
// @match *://www.fifa.com/*
// @match *://www.filmmodu.org/*
// @match *://www.filmon.com/*
// @match *://www.filmweb.no/*
// @match *://fivethirtyeight.com/*
// @match *://5-tv.ru/*
// @match *://www.5-tv.ru/*
// @match *://www.flickr.com/*
// @match *://www.ft.dk/*
// @match *://watch.foodnetwork.com/*
// @match *://footyroom.com/*
// @match *://www.formula1.com/*
// @match *://www.fox.com/*
// @match *://www.fox9.com/*
// @match *://foxgay.com/*
// @match *://video.foxnews.com/*
// @match *://video.foxbusiness.com/*
// @match *://video.insider.foxnews.com/*
// @match *://www.foxnews.com/*
// @match *://insider.foxnews.com/*
// @match *://www.foxsports.com/*
// @match *://fptplay.vn/*
// @match *://www.radiofrance.fr/*
// @match *://www.franceinter.fr/*
// @match *://sivideo.webservices.francetelevisions.fr/*
// @match *://videos.francetv.fr/*
// @match *://www.francetvinfo.fr/*
// @match *://france3-regions.francetvinfo.fr/*
// @match *://www.france.tv/*
// @match *://mobile.france.tv/*
// @match *://www.freesound.org/*
// @match *://www.freespeech.org/*
// @match *://www.freetv.com/*
// @match *://api.frontendmasters.com/*
// @match *://frontendmasters.com/*
// @match *://fod.fujitv.co.jp/*
// @match *://www.funimation.com/*
// @match *://www.funimationnow.uk/*
// @match *://www.funk.net/*
// @match *://fusion.tv/*
// @match *://www.fux.com/*
// @match *://www.fuyin.tv/*
// @match *://gab.com/*
// @match *://tv.gab.com/*
// @match *://www.gaia.com/*
// @match *://www.gameinformer.com/*
// @match *://gamejolt.com/*
// @match *://www.gamespot.com/*
// @match *://www.gamestar.de/*
// @match *://www.gamepro.de/*
// @match *://www.gaskrank.tv/*
// @match *://www.gazeta.ru/*
// @match *://www.gdcvault.com/*
// @match *://gdcvault.com/*
// @match *://video.lastampa.it/*
// @match *://video.huffingtonpost.it/*
// @match *://video.espresso.repubblica.it/*
// @match *://video.repubblica.it/*
// @match *://video.ilsecoloxix.it/*
// @match *://video.iltirreno.gelocal.it/*
// @match *://video.messaggeroveneto.gelocal.it/*
// @match *://video.ilpiccolo.gelocal.it/*
// @match *://video.gazzettadimantova.gelocal.it/*
// @match *://video.mattinopadova.gelocal.it/*
// @match *://video.laprovinciapavese.gelocal.it/*
// @match *://video.tribunatreviso.gelocal.it/*
// @match *://video.nuovavenezia.gelocal.it/*
// @match *://video.gazzettadimodena.gelocal.it/*
// @match *://video.lanuovaferrara.gelocal.it/*
// @match *://video.corrierealpi.gelocal.it/*
// @match *://video.lasentinella.gelocal.it/*
// @match *://gem.cbc.ca/*
// @match *://genius.com/*
// @match *://www.gettr.com/*
// @match *://gettr.com/*
// @match *://gfycat.com/*
// @match *://thumbs.gfycat.com/*
// @match *://giant.gfycat.com/*
// @match *://www.giantbomb.com/*
// @match *://www.giga.de/*
// @match *://iptv.glattvision.ch/*
// @match *://share.glide.me/*
// @match *://g1.globo.com/*
// @match *://globoplay.globo.com/*
// @match *://canalbrasil.globo.com/*
// @match *://globosatplay.globo.com/*
// @match *://globotv.globo.com/*
// @match *://canaloff.globo.com/*
// @match *://gq.globo.com/*
// @match *://gshow.globo.com/*
// @match *://oglobo.globo.com/*
// @match *://ge.globo.com/*
// @match *://redeglobo.globo.com/*
// @match *://video.glomex.com/*
// @match *://player.glomex.com/*
// @match *://abc.go.com/*
// @match *://disneynow.com/*
// @match *://freeform.go.com/*
// @match *://abc.com/*
// @match *://fxnow.fxnetworks.com/*
// @match *://disneynow.go.com/*
// @match *://www.freeform.com/*
// @match *://discovery.com/*
// @match *://www.godtube.com/*
// @match *://gofile.io/*
// @match *://video.golem.de/*
// @match *://goodgame.ru/*
// @match *://podcasts.google.com/*
// @match *://drive.google.com/*
// @match *://www.goplay.be/*
// @match *://gopro.com/*
// @match *://www.goshgay.com/*
// @match *://www.gotostage.com/*
// @match *://on-demand.gputechconf.com/*
// @match *://gronkh.tv/*
// @match *://www.groupon.com/*
// @match *://www.harpodeon.com/*
// @match *://www.hbo.com/*
// @match *://hearthis.at/*
// @match *://www.heise.de/*
// @match *://hellporno.com/*
// @match *://hellporno.net/*
// @match *://video.helsinki.fi/*
// @match *://hentai.animestigma.com/*
// @match *://hetklokhuis.nl/*
// @match *://www.hgtv.com/*
// @match *://de.hgtv.com/*
// @match *://watch.hgtv.com/*
// @match *://www.hidive.com/*
// @match *://www.historicfilms.com/*
// @match *://link.theplatform.com/*
// @match *://player.theplatform.com/*
// @match *://www.hitbox.tv/*
// @match *://www.smashcast.tv/*
// @match *://hitrecord.org/*
// @match *://www.hkedcity.net/*
// @match *://holodex.net/*
// @match *://staging.holodex.net/*
// @match *://www.hotnewhiphop.com/*
// @match *://www.hotstar.com/*
// @match *://www.howcast.com/*
// @match *://www.stufftoblowyourmind.com/*
// @match *://shows.howstuffworks.com/*
// @match *://www.hessenschau.de/*
// @match *://www.hr-fernsehen.de/*
// @match *://hrti.hrt.hr/*
// @match *://www.hse.de/*
// @match *://www.huajiao.com/*
// @match *://live.huffingtonpost.com/*
// @match *://www.hungama.com/*
// @match *://hypem.com/*
// @match *://hytale.com/*
// @match *://www.hytale.com/*
// @match *://www.helsinkikanava.fi/*
// @match *://suite.icareus.com/*
// @match *://asahitv.fi/*
// @match *://hyvinvointitv.fi/*
// @match *://inez.fi/*
// @match *://www.permanto.fi/*
// @match *://videos.minifiddlers.org/*
// @match *://www.iflix.com/*
// @match *://www.ign.com/*
// @match *://www.pcmag.com/*
// @match *://me.ign.com/*
// @match *://adria.ign.com/*
// @match *://kr.ign.com/*
// @match *://www.iheart.com/*
// @match *://www.iheartpodcastnetwork.com/*
// @match *://www.iltalehti.fi/*
// @match *://www.imdb.com/*
// @match *://i.imgur.com/*
// @match *://imgur.com/*
// @match *://www.ina.fr/*
// @match *://m.ina.fr/*
// @match *://www.inc.com/*
// @match *://indavideo.hu/*
// @match *://embed.indavideo.hu/*
// @match *://assets.indavideo.hu/*
// @match *://www.infoq.com/*
// @match *://instagram.com/*
// @match *://www.instagram.com/*
// @match *://www.internazionale.it/*
// @match *://video.internetvideoarchive.net/*
// @match *://prima.iprima.cz/*
// @match *://play.iprima.cz/*
// @match *://www.iprima.cz/*
// @match *://zoom.iprima.cz/*
// @match *://krimi.iprima.cz/*
// @match *://cool.iprima.cz/*
// @match *://love.iprima.cz/*
// @match *://cnn.iprima.cz/*
// @match *://www.iq.com/*
// @match *://www.iqiyi.com/*
// @match *://yule.iqiyi.com/*
// @match *://www.pps.tv/*
// @match *://watch.islamchannel.tv/*
// @match *://www.israelnationalnews.com/*
// @match *://app.itpro.tv/*
// @match *://tv.ittf.com/*
// @match *://www.itv.com/*
// @match *://www.ivi.ru/*
// @match *://www.ivi.tv/*
// @match *://www.ivideon.com/*
// @match *://iwara.tv/*
// @match *://ecchi.iwara.tv/*
// @match *://www.iwara.tv/*
// @match *://www.ixigua.com/*
// @match *://www.izlesene.com/*
// @match *://jable.tv/*
// @match *://www.jamendo.com/*
// @match *://licensing.jamendo.com/*
// @match *://www.jeuxvideo.com/*
// @match *://media.joj.sk/*
// @match *://www.jove.com/*
// @match *://content.jwplatform.com/*
// @match *://cdn.jwplayer.com/*
// @match *://tv.kakao.com/*
// @match *://www.kaltura.com/*
// @match *://cdnapisec.kaltura.com/*
// @match *://www.kaltura.com:443/*
// @match *://kanal2.postimees.ee/*
// @match *://www.kankanews.com/*
// @match *://www.karaoketv.co.il/*
// @match *://www.karrierevideos.at/*
// @match *://www.mtv.fi/*
// @match *://www.katsomo.fi/*
// @match *://www.mtvuutiset.fi/*
// @match *://www.keezmovies.com/*
// @match *://members.kelbyone.com/*
// @match *://www.ketnet.be/*
// @match *://www.khanacademy.org/*
// @match *://kick.com/*
// @match *://www.kicker.de/*
// @match *://www.kickstarter.com/*
// @match *://kinja.com/*
// @match *://www.kinopoisk.ru/*
// @match *://video.kompas.com/*
// @match *://www.konserthusetplay.se/*
// @match *://rspoplay.se/*
// @match *://www.kooapp.com/*
// @match *://krasview.ru/*
// @match *://play.kth.se/*
// @match *://v.ku6.com/*
// @match *://www.kusi.com/*
// @match *://kusi.com/*
// @match *://www.kuwo.cn/*
// @match *://yinyue.kuwo.cn/*
// @match *://www.la7.it/*
// @match *://www.laola1.tv/*
// @match *://www.last.fm/*
// @match *://lbry.tv/*
// @match *://odysee.com/*
// @match *://www.tf1info.fr/*
// @match *://www.lci.fr/*
// @match *://www.lcp.fr/*
// @match *://play.lcp.fr/*
// @match *://www.le.com/*
// @match *://sports.le.com/*
// @match *://www.lesports.com/*
// @match *://lecture2go.uni-hamburg.de/*
// @match *://app.lecturio.com/*
// @match *://www.lecturio.de/*
// @match *://www.lego.com/*
// @match *://www.lemonde.fr/*
// @match *://redaction.actu.lemonde.fr/*
// @match *://lenta.ru/*
// @match *://tv.le.com/*
// @match *://list.le.com/*
// @match *://yuntv.letv.com/*
// @match *://html5-player.libsyn.com/*
// @match *://life.ru/*
// @match *://embed.life.ru/*
// @match *://likee.video/*
// @match *://www.likee.video/*
// @match *://link.videoplatform.limelight.com/*
// @match *://assets.delvenetworks.com/*
// @match *://live.line.me/*
// @match *://www.linkedin.com/*
// @match *://linuxacademy.com/*
// @match *://www.liputan6.com/*
// @match *://www.listennotes.com/*
// @match *://www.litv.tv/*
// @match *://andrei-bt.livejournal.com/*
// @match *://new.livestream.com/*
// @match *://livestream.com/*
// @match *://original.livestream.com/*
// @match *://livestreamfails.com/*
// @match *://lnk.lt/*
// @match *://www.lnkgo.lt/*
// @match *://lnkgo.alfa.lt/*
// @match *://loc.gov/*
// @match *://www.loc.gov/*
// @match *://www.localnews8.com/*
// @match *://lovehomeporn.com/*
// @match *://www.lrt.lt/*
// @match *://www.lynda.com/*
// @match *://educourse.ga/*
// @match *://www.m6.fr/*
// @match *://www.magenta-musik-360.de/*
// @match *://my.mail.ru/*
// @match *://m.my.mail.ru/*
// @match *://videoapi.my.mail.ru/*
// @match *://webtools-e18da6642b684f8aa9ae449862783a56.msvdn.net/*
// @match *://webtools-859c1818ed614cc5b0047439470927b0.msvdn.net/*
// @match *://webtools-f5842579ff984c1c98d63b8d789673eb.msvdn.net/*
// @match *://f5842579ff984c1c98d63b8d789673eb.msvdn.net/*
// @match *://webtools.msvdn.net/*
// @match *://859c1818ed614cc5b0047439470927b0.msvdn.net/*
// @match *://www.mall.tv/*
// @match *://sk.mall.tv/*
// @match *://www.mgtv.com/*
// @match *://w.mgtv.com/*
// @match *://www.manototv.com/*
// @match *://www.manyvids.com/*
// @match *://www.maoritelevision.com/*
// @match *://videoarchiv.markiza.sk/*
// @match *://www.markiza.sk/*
// @match *://dajto.markiza.sk/*
// @match *://superstar.markiza.sk/*
// @match *://hybsa.markiza.sk/*
// @match *://doma.markiza.sk/*
// @match *://www.tvnoviny.sk/*
// @match *://massengeschmack.tv/*
// @match *://www.masters.com/*
// @match *://matchtv.ru/*
// @match *://www.mdr.de/*
// @match *://www.kika.de/*
// @match *://medal.tv/*
// @match *://media.ccc.de/*
// @match *://www.mediaite.com/*
// @match *://mediaklikk.hu/*
// @match *://m4sport.hu/*
// @match *://hirado.hu/*
// @match *://petofilive.hu/*
// @match *://www.bndestem.nl/*
// @match *://www.gelderlander.nl/*
// @match *://embed.mychannels.video/*
// @match *://mychannels.video/*
// @match *://mediasetinfinity.mediaset.it/*
// @match *://www.mediasetplay.mediaset.it/*
// @match *://static3.mediasetplay.mediaset.it/*
// @match *://hitsmediaweb.h-its.org/*
// @match *://mediasite.uib.no/*
// @match *://collegerama.tudelft.nl/*
// @match *://digitalops.sandia.gov/*
// @match *://mediasite.ntnu.no/*
// @match *://events7.mediasite.com/*
// @match *://medaudio.medicine.iu.edu/*
// @match *://uipsyc.mediasite.com/*
// @match *://live.libraries.psu.edu/*
// @match *://msite.misis.ru/*
// @match *://mdstrm.com/*
// @match *://vodupload-api.mediaworks.nz/*
// @match *://www.medici.tv/*
// @match *://player.megaphone.fm/*
// @match *://www.megatv.com/*
// @match *://www.meipai.com/*
// @match *://vod.melon.com/*
// @match *://video.meta.ua/*
// @match *://metacafe.com/*
// @match *://www.metacafe.com/*
// @match *://www.metacritic.com/*
// @match *://www.mewatch.sg/*
// @match *://live.mewatch.sg/*
// @match *://m.mgoon.com/*
// @match *://www.mgoon.com/*
// @match *://video.mgoon.com/*
// @match *://www.miaopai.com/*
// @match *://www.microsoft.com/*
// @match *://web.microsoftstream.com/*
// @match *://msit.microsoftstream.com/*
// @match *://www.mildom.com/*
// @match *://www.minds.com/*
// @match *://www.ministrygrid.com/*
// @match *://www.miomio.tv/*
// @match *://www.mirrativ.com/*
// @match *://www.mirror.co.uk/*
// @match *://www.mitele.es/*
// @match *://mixch.tv/*
// @match *://www.mixcloud.com/*
// @match *://beta.mixcloud.com/*
// @match *://www.mlb.com/*
// @match *://m.mlb.com/*
// @match *://mlb.mlb.com/*
// @match *://www.mlssoccer.com/*
// @match *://www.whitecapsfc.com/*
// @match *://www.torontofc.ca/*
// @match *://www.sportingkc.com/*
// @match *://www.soundersfc.com/*
// @match *://www.sjearthquakes.com/*
// @match *://www.rsl.com/*
// @match *://www.timbers.com/*
// @match *://www.philadelphiaunion.com/*
// @match *://www.orlandocitysc.com/*
// @match *://www.newyorkredbulls.com/*
// @match *://www.nycfc.com/*
// @match *://www.revolutionsoccer.net/*
// @match *://www.nashvillesc.com/*
// @match *://www.cfmontreal.com/*
// @match *://www.intermiamicf.com/*
// @match *://www.lagalaxy.com/*
// @match *://www.lafc.com/*
// @match *://www.houstondynamofc.com/*
// @match *://www.dcunited.com/*
// @match *://www.fcdallas.com/*
// @match *://www.columbuscrew.com/*
// @match *://www.coloradorapids.com/*
// @match *://www.fccincinnati.com/*
// @match *://www.chicagofirefc.com/*
// @match *://www.austinfc.com/*
// @match *://www.atlutd.com/*
// @match *://www.mnet.com/*
// @match *://mnet.interest.me/*
// @match *://tvplus.m-net.de/*
// @match *://video.mocha.com.vn/*
// @match *://moevideo.net/*
// @match *://playreplay.net/*
// @match *://www.mofosex.com/*
// @match *://www.mojvideo.com/*
// @match *://www.morningstar.com/*
// @match *://news.morningstar.com/*
// @match *://motherless.com/*
// @match *://www.motorsport.com/*
// @match *://watch.motortrend.com/*
// @match *://www.motortrendondemand.com/*
// @match *://www.movieclips.com/*
// @match *://www.moviefap.com/*
// @match *://www.moviepilot.de/*
// @match *://www.moview.id/*
// @match *://www.moviezine.se/*
// @match *://movingimage.nls.uk/*
// @match *://www.msn.com/*
// @match *://www.tvplay.lv/*
// @match *://play.tv3.lt/*
// @match *://www.tv3play.ee/*
// @match *://www.tv3play.se/*
// @match *://www.tv6play.se/*
// @match *://www.tv8play.se/*
// @match *://www.tv3play.no/*
// @match *://www.viasat4play.no/*
// @match *://www.tv6play.no/*
// @match *://play.novatv.bg/*
// @match *://play.nova.bg/*
// @match *://tvplay.skaties.lv/*
// @match *://tv3play.tv3.ee/*
// @match *://www.mtv.com/*
// @match *://www.mtv.de/*
// @match *://www.mtv.it/*
// @match *://www.mtvjapan.com/*
// @match *://media.mtvnservices.com/*
// @match *://www.muenchen.tv/*
// @match *://murrtube.net/*
// @match *://musescore.com/*
// @match *://www.musicdex.org/*
// @match *://mva.microsoft.com/*
// @match *://www.microsoftvirtualacademy.com/*
// @match *://mwave.interest.me/*
// @match *://www.mxplayer.in/*
// @match *://mychannels.com/*
// @match *://myspace.com/*
// @match *://www.myspass.de/*
// @match *://myvi.ru/*
// @match *://myvi.tv/*
// @match *://www.myvi.ru/*
// @match *://www.myvideo.ge/*
// @match *://www.myvidster.com/*
// @match *://www.myvi.tv/*
// @match *://www.n-tv.de/*
// @match *://rs.n1info.com/*
// @match *://n1info.si/*
// @match *://ba.n1info.com/*
// @match *://nova.rs/*
// @match *://hr.n1info.com/*
// @match *://best-vod.umn.cdn.united.cloud/*
// @match *://tv.nate.com/*
// @match *://video.nationalgeographic.com/*
// @match *://www.nationalgeographic.com/*
// @match *://tv.naver.com/*
// @match *://tvcast.naver.com/*
// @match *://now.naver.com/*
// @match *://www.nba.com/*
// @match *://watch.nba.com/*
// @match *://secure.nba.com/*
// @match *://www.nbc.com/*
// @match *://www.nbcnews.com/*
// @match *://www.today.com/*
// @match *://www.msnbc.com/*
// @match *://www.nbcolympics.com/*
// @match *://stream.nbcolympics.com/*
// @match *://www.nbcsports.com/*
// @match *://stream.nbcsports.com/*
// @match *://vplayer.nbcsports.com/*
// @match *://www.nbclosangeles.com/*
// @match *://www.telemundoarizona.com/*
// @match *://www.ndr.de/*
// @match *://khabar.ndtv.com/*
// @match *://movies.ndtv.com/*
// @match *://www.ndtv.com/*
// @match *://auto.ndtv.com/*
// @match *://sports.ndtv.com/*
// @match *://gadgets.ndtv.com/*
// @match *://profit.ndtv.com/*
// @match *://food.ndtv.com/*
// @match *://doctor.ndtv.com/*
// @match *://swirlster.ndtv.com/*
// @match *://nebula.app/*
// @match *://watchnebula.com/*
// @match *://www.nerdcubed.co.uk/*
// @match *://music.163.com/*
// @match *://y.music.163.com/*
// @match *://netplus.tv/*
// @match *://www.netverse.id/*
// @match *://netverse.id/*
// @match *://www.netzkino.de/*
// @match *://www.newgrounds.com/*
// @match *://burn7.newgrounds.com/*
// @match *://brian-beaton.newgrounds.com/*
// @match *://newspicks.com/*
// @match *://www.newstube.ru/*
// @match *://www.newsy.com/*
// @match *://hk.apple.nextmedia.com/*
// @match *://hk.dv.nextmedia.com/*
// @match *://www.nexttv.com.tw/*
// @match *://api.nexx.cloud/*
// @match *://api.nexxcdn.com/*
// @match *://arc.nexx.cloud/*
// @match *://embed.nexx.cloud/*
// @match *://www.nfb.ca/*
// @match *://www.nfhsnetwork.com/*
// @match *://www.nfl.com/*
// @match *://www.chiefs.com/*
// @match *://www.buffalobills.com/*
// @match *://www.raiders.com/*
// @match *://www2.nhk.or.jp/*
// @match *://www.nhk.or.jp/*
// @match *://www3.nhk.or.jp/*
// @match *://www.nhl.com/*
// @match *://www.wch2016.com/*
// @match *://www.nick.com/*
// @match *://www.nickjr.com/*
// @match *://www.nick.de/*
// @match *://www.nickelodeon.nl/*
// @match *://www.nickelodeon.at/*
// @match *://www.nick.com.pl/*
// @match *://www.nickelodeon.no/*
// @match *://www.nickelodeon.dk/*
// @match *://www.nickelodeon.se/*
// @match *://www.nick.ch/*
// @match *://www.nickelodeon.be/*
// @match *://www.nickjr.com.br/*
// @match *://mundonick.uol.com.br/*
// @match *://www.nickjr.nl/*
// @match *://www.nickjr.de/*
// @match *://www.nickelodeonjunior.fr/*
// @match *://www.nickelodeon.ru/*
// @match *://www.nickelodeon.fr/*
// @match *://www.nickelodeon.es/*
// @match *://www.nickelodeon.pt/*
// @match *://www.nickelodeon.ro/*
// @match *://www.nickelodeon.hu/*
// @match *://www.nickelodeon.com.tr/*
// @match *://www.nicknight.at/*
// @match *://www.nicovideo.jp/*
// @match *://sp.nicovideo.jp/*
// @match *://nico.ms/*
// @match *://www.nintendo.com/*
// @match *://de.nttr.stream/*
// @match *://www.n-joy.de/*
// @match *://njpwworld.com/*
// @match *://front.njpwworld.com/*
// @match *://www.nobelprize.org/*
// @match *://open.noice.id/*
// @match *://www.nonktube.com/*
// @match *://adult.noodlemagazine.com/*
// @match *://noovo.ca/*
// @match *://normalboots.com/*
// @match *://nos.nl/*
// @match *://nosvideo.com/*
// @match *://tn.nova.cz/*
// @match *://fanda.nova.cz/*
// @match *://novaplus.nova.cz/*
// @match *://sport.tn.nova.cz/*
// @match *://doma.nova.cz/*
// @match *://prask.nova.cz/*
// @match *://tv.nova.cz/*
// @match *://media.cms.nova.cz/*
// @match *://www.nowness.com/*
// @match *://cn.nowness.com/*
// @match *://www.noz.de/*
// @match *://www.npo.nl/*
// @match *://www.ntr.nl/*
// @match *://www.omroepwnl.nl/*
// @match *://www.zapp.nl/*
// @match *://www.npo3.nl/*
// @match *://www.npostart.nl/*
// @match *://npo.nl/*
// @match *://www.npr.org/*
// @match *://www.nrk.no/*
// @match *://v8-psapi.nrk.no/*
// @match *://radio.nrk.no/*
// @match *://tv.nrk.no/*
// @match *://tv.nrksuper.no/*
// @match *://nrksuper.no/*
// @match *://www.nrl.com/*
// @match *://www.ntv.ru/*
// @match *://www.nuvid.com/*
// @match *://m.nuvid.com/*
// @match *://www.nytimes.com/*
// @match *://cooking.nytimes.com/*
// @match *://www.nzherald.co.nz/*
// @match *://nzherald.co.nz/*
// @match *://www.nzz.ch/*
// @match *://ocw.mit.edu/*
// @match *://odatv.com/*
// @match *://ok.ru/*
// @match *://m.ok.ru/*
// @match *://www.ok.ru/*
// @match *://mobile.ok.ru/*
// @match *://of.tv/*
// @match *://www.oktoberfest-tv.de/*
// @match *://olympics.com/*
// @match *://event.on24.com/*
// @match *://www.ondemandkorea.com/*
// @match *://onefootball.com/*
// @match *://www.oneplace.com/*
// @match *://eurosport.onet.pl/*
// @match *://film.onet.pl/*
// @match *://moto.onet.pl/*
// @match *://businessinsider.com.pl/*
// @match *://plejada.pl/*
// @match *://onet.tv/*
// @match *://onet100.vod.pl/*
// @match *://www.onionstudios.com/*
// @match *://player.ooyala.com/*
// @match *://oc-video1.ruhr-uni-bochum.de/*
// @match *://oc-video.ruhr-uni-bochum.de/*
// @match *://www.openrec.tv/*
// @match *://www.ora.tv/*
// @match *://www.unsafespeech.com/*
// @match *://fm4.orf.at/*
// @match *://iptv.orf.at/*
// @match *://radiothek.orf.at/*
// @match *://ooe.orf.at/*
// @match *://noe.orf.at/*
// @match *://wien.orf.at/*
// @match *://burgenland.orf.at/*
// @match *://steiermark.orf.at/*
// @match *://kaernten.orf.at/*
// @match *://salzburg.orf.at/*
// @match *://tirol.orf.at/*
// @match *://vorarlberg.orf.at/*
// @match *://oe3.orf.at/*
// @match *://oe1.orf.at/*
// @match *://tvthek.orf.at/*
// @match *://tvonline.osnatel.de/*
// @match *://www.outsidetv.com/*
// @match *://www.packtpub.com/*
// @match *://subscription.packtpub.com/*
// @match *://www.palcomp3.com.br/*
// @match *://www.palcomp3.com/*
// @match *://jp.channel.pandora.tv/*
// @match *://channel.pandora.tv/*
// @match *://www.pandora.tv/*
// @match *://m.pandora.tv/*
// @match *://demo.hosted.panopto.com/*
// @match *://howtovideos.hosted.panopto.com/*
// @match *://unisa.au.panopto.com/*
// @match *://na-training-1.hosted.panopto.com/*
// @match *://ucc.cloud.panopto.eu/*
// @match *://brown.hosted.panopto.com/*
// @match *://utsa.hosted.panopto.com/*
// @match *://www.paramountnetwork.com/*
// @match *://www.paramountplus.com/*
// @match *://parler.com/*
// @match *://parliamentlive.tv/*
// @match *://parlview.aph.gov.au/*
// @match *://www.patreon.com/*
// @match *://www.pbs.org/*
// @match *://player.pbs.org/*
// @match *://watch.knpb.org/*
// @match *://www.pearvideo.com/*
// @match *://peekvids.com/*
// @match *://www.peer.tv/*
// @match *://framatube.org/*
// @match *://peertube2.cpy.re/*
// @match *://peertube.debian.social/*
// @match *://vod.ksite.de/*
// @match *://peertube.tv/*
// @match *://peertube.tux.ovh/*
// @match *://members.onepeloton.com/*
// @match *://www.people.com/*
// @match *://player.performgroup.com/*
// @match *://www.periscope.tv/*
// @match *://philharmoniedeparis.fr/*
// @match *://live.philharmoniedeparis.fr/*
// @match *://otoplayer.philharmoniedeparis.fr/*
// @match *://www.phoenix.de/*
// @match *://media.photobucket.com/*
// @match *://piapro.jp/*
// @match *://picarto.tv/*
// @match *://player.piksel.com/*
// @match *://www.pinkbike.com/*
// @match *://es.pinkbike.org/*
// @match *://www.pinterest.com/*
// @match *://www.pinterest.ca/*
// @match *://co.pinterest.com/*
// @match *://dood.to/*
// @match *://sketch.pixiv.net/*
// @match *://out.pladform.ru/*
// @match *://static.pladform.ru/*
// @match *://video.pladform.ru/*
// @match *://www.planetmarathi.com/*
// @match *://platzi.com/*
// @match *://courses.platzi.com/*
// @match *://www.play.fm/*
// @match *://www.playplus.tv/*
// @match *://play.stuff.co.nz/*
// @match *://plays.tv/*
// @match *://www.playsuisse.ch/*
// @match *://www.playtvak.cz/*
// @match *://slowtv.playtvak.cz/*
// @match *://zpravy.idnes.cz/*
// @match *://www.lidovky.cz/*
// @match *://www.metro.cz/*
// @match *://www.playvid.com/*
// @match *://www.playvids.com/*
// @match *://config.playwire.com/*
// @match *://cdn.playwire.com/*
// @match *://www.pluralsight.com/*
// @match *://app.pluralsight.com/*
// @match *://pluto.tv/*
// @match *://podbay.fm/*
// @match *://www.podchaser.com/*
// @match *://scienceteachingtips.podomatic.com/*
// @match *://ostbahnhof.podomatic.com/*
// @match *://www.podomatic.com/*
// @match *://www.pokemon.com/*
// @match *://watch.pokemon.com/*
// @match *://www.pokergo.com/*
// @match *://polsatgo.pl/*
// @match *://jedynka.polskieradio.pl/*
// @match *://trojka.polskieradio.pl/*
// @match *://www.polskieradio.pl/*
// @match *://radiokierowcow.pl/*
// @match *://polskieradio24.pl/*
// @match *://player.polskieradio.pl/*
// @match *://podcasty.polskieradio.pl/*
// @match *://popcorntimes.tv/*
// @match *://animemanga.popcorntv.it/*
// @match *://cinema.popcorntv.it/*
// @match *://www.porn.com/*
// @match *://se.porn.com/*
// @match *://www.pornerbros.com/*
// @match *://m.pornerbros.com/*
// @match *://pornez.net/*
// @match *://www.pornflip.com/*
// @match *://www.pornhd.com/*
// @match *://www.pornhub.com/*
// @match *://fr.pornhub.com/*
// @match *://www.thumbzilla.com/*
// @match *://www.pornhub.net/*
// @match *://www.pornhub.org/*
// @match *://www.pornhubpremium.com/*
// @match *://pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd.onion/*
// @match *://de.pornhub.com/*
// @match *://www.pornotube.com/*
// @match *://www.pornovoisines.com/*
// @match *://www.pornoxo.com/*
// @match *://www.porntube.com/*
// @match *://m.porntube.com/*
// @match *://prankcast.com/*
// @match *://www.premiershiprugby.com/*
// @match *://www.presstv.ir/*
// @match *://www.projectveritas.com/*
// @match *://www.prosieben.de/*
// @match *://www.prosiebenmaxx.de/*
// @match *://www.sixx.de/*
// @match *://www.sat1.de/*
// @match *://www.kabeleins.de/*
// @match *://www.ran.de/*
// @match *://www.the-voice-of-germany.de/*
// @match *://www.fem.com/*
// @match *://www.kabeleinsdoku.de/*
// @match *://www.sat1gold.de/*
// @match *://www.galileo.tv/*
// @match *://www.advopedia.de/*
// @match *://beta.prx.org/*
// @match *://listen.prx.org/*
// @match *://puhutv.com/*
// @match *://www.puls4.com/*
// @match *://pyvideo.org/*
// @match *://www.qingting.fm/*
// @match *://m.qtfm.cn/*
// @match *://y.qq.com/*
// @match *://quantum-tv.com/*
// @match *://www.qub.ca/*
// @match *://videos.r7.com/*
// @match *://esportes.r7.com/*
// @match *://noticias.r7.com/*
// @match *://player.r7.com/*
// @match *://tv.r7.com/*
// @match *://radiko.jp/*
// @match *://ndr2.radio.de/*
// @match *://www.radiobremen.de/*
// @match *://ici.radio-canada.ca/*
// @match *://maison.radiofrance.fr/*
// @match *://www.radiojavan.com/*
// @match *://radiokapital.pl/*
// @match *://player.radiozet.pl/*
// @match *://rad.live/*
// @match *://www.raisport.rai.it/*
// @match *://www.rai.it/*
// @match *://www.rainews.it/*
// @match *://www.raiplay.it/*
// @match *://www.raiplaysound.it/*
// @match *://raisudtirol.rai.it/*
// @match *://www.raywenderlich.com/*
// @match *://videos.raywenderlich.com/*
// @match *://www.rbmaradio.com/*
// @match *://video.corriere.it/*
// @match *://viaggi.corriere.it/*
// @match *://video.gazzetta.it/*
// @match *://video.rcs.it/*
// @match *://video.gazzanet.gazzetta.it/*
// @match *://www.leitv.it/*
// @match *://www.youreporter.it/*
// @match *://www.rctiplus.com/*
// @match *://www.rds.ca/*
// @match *://www.redbull.com/*
// @match *://www.redbull.tv/*
// @match *://www.reddit.com/*
// @match *://old.reddit.com/*
// @match *://nm.reddit.com/*
// @match *://www.redditmedia.com/*
// @match *://www.redgifs.com/*
// @match *://thumbs2.redgifs.com/*
// @match *://www.redtube.com/*
// @match *://embed.redtube.com/*
// @match *://it.redtube.com/*
// @match *://www.regio-tv.de/*
// @match *://ren.tv/*
// @match *://www.restudy.dk/*
// @match *://portal.restudy.dk/*
// @match *://www.reuters.com/*
// @match *://www.reverbnation.com/*
// @match *://mediahub.rice.edu/*
// @match *://rmcdecouverte.bfmtv.com/*
// @match *://www.rockstargames.com/*
// @match *://www.rokfin.com/*
// @match *://rokfin.com/*
// @match *://roosterteeth.com/*
// @match *://achievementhunter.roosterteeth.com/*
// @match *://funhaus.roosterteeth.com/*
// @match *://screwattack.roosterteeth.com/*
// @match *://theknow.roosterteeth.com/*
// @match *://www.rottentomatoes.com/*
// @match *://prehravac.rozhlas.cz/*
// @match *://www.rtbf.be/*
// @match *://rtd.rt.com/*
// @match *://www.rte.ie/*
// @match *://rte.ie/*
// @match *://www.rtl.lu/*
// @match *://5minutes.rtl.lu/*
// @match *://today.rtl.lu/*
// @match *://www.rtlxl.nl/*
// @match *://www.rtl.nl/*
// @match *://rtlxl.nl/*
// @match *://static.rtl.nl/*
// @match *://embed.rtl.nl/*
// @match *://www.rtl2.de/*
// @match *://you.rtl2.de/*
// @match *://www.rt.com/*
// @match *://www.rtp.pt/*
// @match *://rtrfm.com.au/*
// @match *://www.rts.ch/*
// @match *://pages.rts.ch/*
// @match *://www.rtve.es/*
// @match *://www.rtvnh.nl/*
// @match *://www.rtvs.sk/*
// @match *://www.rtvslo.si/*
// @match *://365.rtvslo.si/*
// @match *://4d.rtvslo.si/*
// @match *://www.ruhd.ru/*
// @match *://rule34video.com/*
// @match *://rumble.com/*
// @match *://www.rumble.com/*
// @match *://www.ruptly.tv/*
// @match *://rutube.ru/*
// @match *://player.rutv.ru/*
// @match *://player.vgtrk.com/*
// @match *://testplayer.vgtrk.com/*
// @match *://www.ruutu.fi/*
// @match *://www.supla.fi/*
// @match *://static.nelonenmedia.fi/*
// @match *://ruv.is/*
// @match *://www.ruv.is/*
// @match *://www.safaribooksonline.com/*
// @match *://learning.oreilly.com/*
// @match *://www.oreilly.com/*
// @match *://techbus.safaribooksonline.com/*
// @match *://www.saitosan.net/*
// @match *://saktv.ch/*
// @match *://tv.salt.ch/*
// @match *://samplefocus.com/*
// @match *://www.webtv.sangiin.go.jp/*
// @match *://videos.sapo.pt/*
// @match *://v2.videos.sapo.pt/*
// @match *://en.savefrom.net/*
// @match *://www.sbs.com.au/*
// @match *://www.schooltv.nl/*
// @match *://api.screen9.com/*
// @match *://folkhogskolekanalen.screen9.tv/*
// @match *://play.su.se/*
// @match *://www.screencast.com/*
// @match *://screencast.com/*
// @match *://watch.screencastify.com/*
// @match *://screencast-o-matic.com/*
// @match *://www.cookingchanneltv.com/*
// @match *://www.diynetwork.com/*
// @match *://www.foodnetwork.com/*
// @match *://www.travelchannel.com/*
// @match *://www.discovery.com/*
// @match *://watch.geniuskitchen.com/*
// @match *://scrolller.com/*
// @match *://learning.scte.org/*
// @match *://www.seeker.com/*
// @match *://www.help.senate.gov/*
// @match *://www.appropriations.senate.gov/*
// @match *://www.banking.senate.gov/*
// @match *://www.senate.gov/*
// @match *://embed.sendtonews.com/*
// @match *://www.servustv.com/*
// @match *://www.servus.com/*
// @match *://www.pm-wissen.com/*
// @match *://sexu.com/*
// @match *://www.seznamzpravy.cz/*
// @match *://www.seznam.cz/*
// @match *://shahid.mbc.net/*
// @match *://shared.sx/*
// @match *://www.shemaroome.com/*
// @match *://www.showroom-live.com/*
// @match *://www.shugiintv.go.jp/*
// @match *://api.simplecast.com/*
// @match *://player.simplecast.com/*
// @match *://the-re-bind-io-podcast.simplecast.com/*
// @match *://video.sina.com.cn/*
// @match *://skeb.jp/*
// @match *://sport.sky.it/*
// @match *://tg24.sky.it/*
// @match *://news.sky.com/*
// @match *://www.skysports.com/*
// @match *://www.skylinewebcams.com/*
// @match *://www.skynewsarabia.com/*
// @match *://www.skynews.com.au/*
// @match *://www.slideshare.net/*
// @match *://slideslive.com/*
// @match *://www.slutload.com/*
// @match *://mobile.slutload.com/*
// @match *://smotrim.ru/*
// @match *://www.snotr.com/*
// @match *://tv.sohu.com/*
// @match *://my.tv.sohu.com/*
// @match *://www.sonyliv.com/*
// @match *://soundcloud.com/*
// @match *://api.soundcloud.com/*
// @match *://w.soundcloud.com/*
// @match *://soundgasm.net/*
// @match *://southpark.cc.com/*
// @match *://www.southparkstudios.com/*
// @match *://www.southpark.de/*
// @match *://www.southpark.lat/*
// @match *://www.southpark.nl/*
// @match *://www.southparkstudios.dk/*
// @match *://www.southparkstudios.nu/*
// @match *://sovietscloset.com/*
// @match *://spankbang.com/*
// @match *://m.spankbang.com/*
// @match *://www.spankwire.com/*
// @match *://www.spiegel.de/*
// @match *://vod.sport5.co.il/*
// @match *://www.sport5.co.il/*
// @match *://news.sportbox.ru/*
// @match *://sportdeutschland.tv/*
// @match *://api.spreaker.com/*
// @match *://www.spreaker.com/*
// @match *://cms.springboardplatform.com/*
// @match *://www.universalkids.com/*
// @match *://www.sproutonline.com/*
// @match *://sr-mediathek.sr-online.de/*
// @match *://sr-mediathek.de/*
// @match *://www.srf.ch/*
// @match *://www.rtr.ch/*
// @match *://play.swissinfo.ch/*
// @match *://openclassroom.stanford.edu/*
// @match *://intl.startrek.com/*
// @match *://www.startrek.com/*
// @match *://www.startv.com.tr/*
// @match *://store.steampowered.com/*
// @match *://steamcommunity.com/*
// @match *://www.stitcher.com/*
// @match *://storyfire.com/*
// @match *://streamable.com/*
// @match *://streamanity.com/*
// @match *://streamcloud.eu/*
// @match *://www.televizeseznam.cz/*
// @match *://www.stream.cz/*
// @match *://streamff.com/*
// @match *://streetvoice.com/*
// @match *://tw.streetvoice.com/*
// @match *://portal.stretchinternet.com/*
// @match *://stripchat.com/*
// @match *://player.stv.tv/*
// @match *://haleynahman.substack.com/*
// @match *://andrewzimmern.substack.com/*
// @match *://www.sunporno.com/*
// @match *://embeds.sunporno.com/*
// @match *://sverigesradio.se/*
// @match *://www.svt.se/*
// @match *://www.svtplay.se/*
// @match *://www.oppetarkiv.se/*
// @match *://www.swearnet.com/*
// @match *://swrmediathek.de/*
// @match *://www.syfy.com/*
// @match *://24syv.dk/*
// @match *://sztv.hu/*
// @match *://www.t-online.de/*
// @match *://www.tagesschau.de/*
// @match *://tass.ru/*
// @match *://itar-tass.com/*
// @match *://www.tntdrama.com/*
// @match *://www.tbs.com/*
// @match *://tds.lifeway.com/*
// @match *://gns3.teachable.com/*
// @match *://v1.upskillcourses.com/*
// @match *://www.teachertube.com/*
// @match *://www.teachingchannel.org/*
// @match *://teamcoco.com/*
// @match *://conan25.teamcoco.com/*
// @match *://teamtreehouse.com/*
// @match *://techtalks.tv/*
// @match *://techtv.mit.edu/*
// @match *://embed.ted.com/*
// @match *://www.ted.com/*
// @match *://www.t13.cl/*
// @match *://www.tele5.de/*
// @match *://tele5.de/*
// @match *://bx1.be/*
// @match *://www.telecinco.es/*
// @match *://www.cuatro.com/*
// @match *://www.mediaset.es/*
// @match *://www.telegraaf.nl/*
// @match *://t.me/*
// @match *://www.telemb.be/*
// @match *://telemb.be/*
// @match *://www.telemundo.com/*
// @match *://zonevideo.telequebec.tv/*
// @match *://coucou.telequebec.tv/*
// @match *://lindicemcsween.telequebec.tv/*
// @match *://bancpublic.telequebec.tv/*
// @match *://www.telequebec.tv/*
// @match *://squat.telequebec.tv/*
// @match *://video.telequebec.tv/*
// @match *://www.tele-task.de/*
// @match *://www.telewebion.com/*
// @match *://video.tempo.co/*
// @match *://www.tennistv.com/*
// @match *://10play.com.au/*
// @match *://www.tf1.fr/*
// @match *://www.tfo.org/*
// @match *://the-hole.tv/*
// @match *://theintercept.com/*
// @match *://feed.theplatform.com/*
// @match *://www.thestar.com/*
// @match *://www.thesun.co.uk/*
// @match *://www.theta.tv/*
// @match *://weather.com/*
// @match *://www.thisamericanlife.org/*
// @match *://www.thisav.com/*
// @match *://www.thisoldhouse.com/*
// @match *://thisvid.com/*
// @match *://3speak.tv/*
// @match *://www.tiktok.com/*
// @match *://tiktok.com/*
// @match *://tinypic.com/*
// @match *://de.tinypic.com/*
// @match *://go.tlc.com/*
// @match *://www.tmz.com/*
// @match *://www.tnaflix.com/*
// @match *://player.tnaflix.com/*
// @match *://player.empflix.com/*
// @match *://video.toggle.sg/*
// @match *://www.toggo.de/*
// @match *://tokentube.net/*
// @match *://audycje.tokfm.pl/*
// @match *://www.toongoggles.com/*
// @match *://ici.tou.tv/*
// @match *://videos.toypics.net/*
// @match *://www.traileraddict.com/*
// @match *://watch.travelchannel.com/*
// @match *://triller.co/*
// @match *://www.trilulilu.ro/*
// @match *://trovo.live/*
// @match *://www.trtcocuk.net.tr/*
// @match *://trueid.id/*
// @match *://vn.trueid.net/*
// @match *://trueid.ph/*
// @match *://www.trunews.com/*
// @match *://truthsocial.com/*
// @match *://www.trutv.com/*
// @match *://www.tube8.com/*
// @match *://tube.tugraz.at/*
// @match *://tubitv.com/*
// @match *://tatianamaslanydaily.tumblr.com/*
// @match *://maskofthedragon.tumblr.com/*
// @match *://shieldfoss.tumblr.com/*
// @match *://jujanon.tumblr.com/*
// @match *://bartlebyshop.tumblr.com/*
// @match *://afloweroutofstone.tumblr.com/*
// @match *://naked-yogi.tumblr.com/*
// @match *://prozdvoices.tumblr.com/*
// @match *://dominustempori.tumblr.com/*
// @match *://sutiblr.tumblr.com/*
// @match *://silami.tumblr.com/*
// @match *://tunein.com/*
// @match *://tun.in/*
// @match *://tune.pk/*
// @match *://embed.tune.pk/*
// @match *://www.turbo.fr/*
// @match *://tv.dfb.de/*
// @match *://www.tv2.no/*
// @match *://www.tvsyd.dk/*
// @match *://www.tv2lorry.dk/*
// @match *://www.tv2ostjylland.dk/*
// @match *://www.tvmidtvest.dk/*
// @match *://www.tv2fyn.dk/*
// @match *://www.tv2east.dk/*
// @match *://www.tv2nord.dk/*
// @match *://play.tv2bornholm.dk/*
// @match *://tv2play.hu/*
// @match *://www.tv4.se/*
// @match *://www.tv4play.se/*
// @match *://revoir.tv5monde.com/*
// @match *://www.tv5unis.ca/*
// @match *://www.tv8.it/*
// @match *://videos.tva.ca/*
// @match *://video.tva.ca/*
// @match *://www.tvanouvelles.ca/*
// @match *://www.tvc.ru/*
// @match *://tver.jp/*
// @match *://www.tvigle.ru/*
// @match *://cloud.tvigle.ru/*
// @match *://tviplayer.iol.pt/*
// @match *://www.tvland.com/*
// @match *://www.tvn24.pl/*
// @match *://tvnmeteo.tvn24.pl/*
// @match *://fakty.tvn24.pl/*
// @match *://sport.tvn24.pl/*
// @match *://tvn24bis.pl/*
// @match *://de.tvnet.gov.vn/*
// @match *://vn.tvnet.gov.vn/*
// @match *://us.tvnet.gov.vn/*
// @match *://www.tvnoe.cz/*
// @match *://www.tvnow.de/*
// @match *://cdn.ethnos.gr/*
// @match *://www.ethnos.gr/*
// @match *://www.tvopen.gr/*
// @match *://swipeto.pl/*
// @match *://www.tvp.pl/*
// @match *://wiadomosci.tvp.pl/*
// @match *://warszawa.tvp.pl/*
// @match *://www.tvp.info/*
// @match *://opole.tvp.pl/*
// @match *://abc.tvp.pl/*
// @match *://jp2.tvp.pl/*
// @match *://vod.tvp.pl/*
// @match *://krakow.tvp.pl/*
// @match *://teleexpress.tvp.pl/*
// @match *://sport.tvp.pl/*
// @match *://tvp.info/*
// @match *://www.tvpparlament.pl/*
// @match *://tvpworld.com/*
// @match *://tvpstream.vod.tvp.pl/*
// @match *://tvplayer.com/*
// @match *://tv3play.skaties.lv/*
// @match *://play.tv3.ee/*
// @match *://tweakers.net/*
// @match *://twitcasting.tv/*
// @match *://clips.twitch.tv/*
// @match *://www.twitch.tv/*
// @match *://m.twitch.tv/*
// @match *://go.twitch.tv/*
// @match *://player.twitch.tv/*
// @match *://twitter.com/*
// @match *://twitter3e4tixl4xyajtrzo62zg5vztmjuricljdp2c5kshju4avyoid.onion/*
// @match *://amp.twimg.com/*
// @match *://www.udemy.com/*
// @match *://wipro.udemy.com/*
// @match *://video.udn.com/*
// @match *://www.ukcolumn.org/*
// @match *://uktvplay.uktv.co.uk/*
// @match *://uktvplay.co.uk/*
// @match *://www.universal-music.de/*
// @match *://utv.unistra.fr/*
// @match *://unity3d.com/*
// @match *://www.unscripted.news/*
// @match *://player.mais.uol.com.br/*
// @match *://tvuol.uol.com.br/*
// @match *://mais.uol.com.br/*
// @match *://noticias.band.uol.com.br/*
// @match *://videos.band.uol.com.br/*
// @match *://noticias.uol.com.br/*
// @match *://content.uplynk.com/*
// @match *://urort.p3.no/*
// @match *://urplay.se/*
// @match *://urskola.se/*
// @match *://www.usanetwork.com/*
// @match *://www.usatoday.com/*
// @match *://www.ustream.tv/*
// @match *://video.ibm.com/*
// @match *://ustudio.com/*
// @match *://app.ustudio.com/*
// @match *://utreon.com/*
// @match *://video.varzesh3.com/*
// @match *://vbox7.com/*
// @match *://i49.vbox7.com/*
// @match *://veehd.com/*
// @match *://app.veo.co/*
// @match *://www.veoh.com/*
// @match *://www.vesti.ru/*
// @match *://hitech.vesti.ru/*
// @match *://sochi2014.vesti.ru/*
// @match *://www.vevo.com/*
// @match *://embed.vevo.com/*
// @match *://tv.vevo.com/*
// @match *://www.vgtv.no/*
// @match *://www.aftenposten.no/*
// @match *://tv.vg.no/*
// @match *://ap.vgtv.no/*
// @match *://tv.aftonbladet.se/*
// @match *://www.aftonbladet.se/*
// @match *://www.vh1.com/*
// @match *://www.viafree.no/*
// @match *://www.viafree.dk/*
// @match *://www.viafree.se/*
// @match *://www.viafree.fi/*
// @match *://video.vice.com/*
// @match *://vms.vice.com/*
// @match *://www.viceland.com/*
// @match *://www.vice.com/*
// @match *://www.vicetv.com/*
// @match *://www.vidbit.co/*
// @match *://www.viddler.com/*
// @match *://videa.hu/*
// @match *://videakid.hu/*
// @match *://video.arnes.si/*
// @match *://video.sky.it/*
// @match *://xfactor.sky.it/*
// @match *://masterchef.sky.it/*
// @match *://www.videodetective.com/*
// @match *://www.videofy.me/*
// @match *://videos.neurips.cc/*
// @match *://videos.icts.res.in/*
// @match *://videos.cncf.io/*
// @match *://player.videoken.com/*
// @match *://videomore.ru/*
// @match *://player.videomore.ru/*
// @match *://odysseus.more.tv/*
// @match *://siren.more.tv/*
// @match *://more.tv/*
// @match *://videopress.com/*
// @match *://video.wordpress.com/*
// @match *://www.vidio.com/*
// @match *://www.vidlii.com/*
// @match *://www.snagfilms.com/*
// @match *://main.snagfilms.com/*
// @match *://www.winnersview.com/*
// @match *://www.monumentalsportsnetwork.com/*
// @match *://www.marquee.tv/*
// @match *://www.hoichoi.tv/*
// @match *://embed.snagfilms.com/*
// @match *://videolectures.net/*
// @match *://www.viki.com/*
// @match *://vimeo.com/*
// @match *://player.vimeo.com/*
// @match *://vimeopro.com/*
// @match *://www.vimm.tv/*
// @match *://videocampus.sachsen.de/*
// @match *://www2.univ-sba.dz/*
// @match *://vimp.weka-fachmedien.de/*
// @match *://vimp.oth-regensburg.de/*
// @match *://www.fh-bielefeld.de/*
// @match *://vimple.ru/*
// @match *://player.vimple.ru/*
// @match *://vimple.co/*
// @match *://vine.co/*
// @match *://cdn.viqeo.tv/*
// @match *://api.viqeo.tv/*
// @match *://www.viu.com/*
// @match *://india.viu.com/*
// @match *://vivo.sx/*
// @match *://vivo.st/*
// @match *://vk.com/*
// @match *://m.vk.com/*
// @match *://new.vk.com/*
// @match *://www.vlive.tv/*
// @match *://channels.vlive.tv/*
// @match *://vm.tiktok.com/*
// @match *://vt.tiktok.com/*
// @match *://vodlocker.com/*
// @match *://vod.pl/*
// @match *://vod-platform.net/*
// @match *://embed.kwikmotion.com/*
// @match *://voicerepublic.com/*
// @match *://voicy.jp/*
// @match *://volej.tv/*
// @match *://www.voot.com/*
// @match *://www.theverge.com/*
// @match *://www.vox.com/*
// @match *://www.sbnation.com/*
// @match *://www.recode.net/*
// @match *://tegenlicht.vpro.nl/*
// @match *://www.vpro.nl/*
// @match *://www.2doc.nl/*
// @match *://v.qq.com/*
// @match *://www.vrak.tv/*
// @match *://www.vrt.be/*
// @match *://sporza.be/*
// @match *://vrv.co/*
// @match *://vshare.io/*
// @match *://vtm.be/*
// @match *://vtxtv.ch/*
// @match *://m.vuclip.com/*
// @match *://vupload.com/*
// @match *://www.vvvvid.it/*
// @match *://vybory.mos.ru/*
// @match *://vzaar.com/*
// @match *://view.vzaar.com/*
// @match *://www.wakanim.tv/*
// @match *://vod.walla.co.il/*
// @match *://player.waly.tv/*
// @match *://wasd.tv/*
// @match *://www.washingtonpost.com/*
// @match *://www.wat.tv/*
// @match *://www.watchbox.de/*
// @match *://www.watchindianporn.net/*
// @match *://deviceids-medp.wdr.de/*
// @match *://mobile-ondemand.wdr.de/*
// @match *://www.wdrmaus.de/*
// @match *://www1.wdr.de/*
// @match *://www.sportschau.de/*
// @match *://kinder.wdr.de/*
// @match *://web.archive.org/*
// @match *://warszawa-plac-zamkowy.webcamera.pl/*
// @match *://gdansk-stare-miasto.webcamera.pl/*
// @match *://bl.webcaster.pro/*
// @match *://www.webofstories.com/*
// @match *://weibo.com/*
// @match *://m.weibo.cn/*
// @match *://www.weiqitv.com/*
// @match *://wetv.vip/*
// @match *://whowatch.tv/*
// @match *://commons.wikimedia.org/*
// @match *://willow.tv/*
// @match *://platform.wim.tv/*
// @match *://www.winsports.co/*
// @match *://fast.wistia.net/*
// @match *://fast.wistia.com/*
// @match *://www.worldstarhiphop.com/*
// @match *://m.worldstarhiphop.com/*
// @match *://pilot.wp.pl/*
// @match *://video-api.wsj.com/*
// @match *://www.wsj.com/*
// @match *://www.barrons.com/*
// @match *://www.wwe.com/*
// @match *://de.wwe.com/*
// @match *://wyborcza.pl/*
// @match *://www.wysokieobcasy.pl/*
// @match *://xbef.com/*
// @match *://xboxclips.com/*
// @match *://gameclips.io/*
// @match *://uqload.com/*
// @match *://xvideosharing.com/*
// @match *://aparat.cam/*
// @match *://wolfstream.tv/*
// @match *://xhamster.com/*
// @match *://m.xhamster.com/*
// @match *://it.xhamster.com/*
// @match *://pt.xhamster.com/*
// @match *://xhamster.one/*
// @match *://xhamster.desi/*
// @match *://xhamster2.com/*
// @match *://xhamster11.com/*
// @match *://xhamster26.com/*
// @match *://de.xhamster.com/*
// @match *://xhday.com/*
// @match *://www.ximalaya.com/*
// @match *://m.ximalaya.com/*
// @match *://www.xinpianchang.com/*
// @match *://x-minus.org/*
// @match *://www.xnxx.com/*
// @match *://video.xnxx.com/*
// @match *://www.xnxx3.com/*
// @match *://frontend.xstream.dk/*
// @match *://www.xtube.com/*
// @match *://vlog.xuite.net/*
// @match *://www.xvideos.com/*
// @match *://flashservice.xvideos.com/*
// @match *://static-hw.xvideos.com/*
// @match *://xvideos.com/*
// @match *://xvideos.es/*
// @match *://www.xvideos.es/*
// @match *://fr.xvideos.com/*
// @match *://it.xvideos.com/*
// @match *://de.xvideos.com/*
// @match *://xxxymovies.com/*
// @match *://screen.yahoo.com/*
// @match *://uk.screen.yahoo.com/*
// @match *://news.yahoo.com/*
// @match *://www.yahoo.com/*
// @match *://gma.yahoo.com/*
// @match *://sports.yahoo.com/*
// @match *://tw.news.yahoo.com/*
// @match *://tw.video.yahoo.com/*
// @match *://malaysia.news.yahoo.com/*
// @match *://es-us.noticias.yahoo.com/*
// @match *://gyao.yahoo.co.jp/*
// @match *://streaming.yahoo.co.jp/*
// @match *://news.yahoo.co.jp/*
// @match *://yadi.sk/*
// @match *://music.yandex.ru/*
// @match *://music.yandex.com/*
// @match *://yandex.ru/*
// @match *://frontend.vh.yandex.ru/*
// @match *://yandex.com/*
// @match *://www.yapfiles.ru/*
// @match *://api.yapfiles.ru/*
// @match *://www.yesjapan.com/*
// @match *://v.yinyuetai.com/*
// @match *://areena.yle.fi/*
// @match *://hot.ynet.co.il/*
// @match *://www.youjizz.com/*
// @match *://v.youku.com/*
// @match *://player.youku.com/*
// @match *://list.youku.com/*
// @match *://www.younow.com/*
// @match *://www.youporn.com/*
// @match *://sxyprn.com/*
// @match *://yourupload.com/*
// @match *://www.yourupload.com/*
// @match *://embed.yourupload.com/*
// @match *://www.youtube.com/*
// @match *://youtube.com/*
// @match *://vid.plus/*
// @match *://zwearz.com/*
// @match *://invidio.us/*
// @match *://redirect.invidious.io/*
// @match *://music.youtube.com/*
// @match *://www.youtubekids.com/*
// @match *://youtu.be/*
// @match *://www.zapiks.fr/*
// @match *://www.zapiks.com/*
// @match *://zattoo.com/*
// @match *://www.zdf.de/*
// @match *://www.zee5.com/*
// @match *://zeenews.india.com/*
// @match *://zen.yandex.ru/*
// @match *://dzen.ru/*
// @match *://www.zhihu.com/*
// @match *://mp3.zing.vn/*
// @match *://zingmp3.vn/*
// @match *://economist.zoom.us/*
// @match *://player.zype.com/*
// @match *://media.w3.org/*
// @match *://calimero.tk/*
// @match *://ai-radio.org:8000/*
// @match *://ftp.nluug.nl/*
// @match *://phihag.de/*
// @match *://podcastfeeds.nbcnews.com/*
// @match *://anchor.fm/*
// @match *://www.hellointernet.fm/*
// @match *://www.omnycontent.com/*
// @match *://metafilegenerator.de/*
// @match *://services.media.howstuffworks.com/*
// @match *://api.new.livestream.com/*
// @match *://yt-dash-mse-test.commondatastorage.googleapis.com/*
// @match *://once.unicornmedia.com/*
// @match *://www.nacentapps.com/*
// @match *://www.google.com/*
// @match *://www.hodiho.fr/*
// @match *://bronyrock.com/*
// @match *://www.rollingstone.com/*
// @match *://www.macrumors.com/*
// @match *://wnep.com/*
// @match *://www.tested.com/*
// @match *://www.theguardian.com/*
// @match *://www.rg.ru/*
// @match *://sch1298sz.mskobr.ru/*
// @match *://www.vestifinance.ru/*
// @match *://www.kinomyvi.tv/*
// @match *://www.numisc.com/*
// @match *://en.support.wordpress.com/*
// @match *://www.waoanime.tv/*
// @match *://www.tv-replay.fr/*
// @match *://www.tsprod.com/*
// @match *://www.wired.com/*
// @match *://www.spi0n.com/*
// @match *://www.bumm.sk/*
// @match *://www.badzine.de/*
// @match *://www.vulture.com/*
// @match *://play.google.com/*
// @match *://www.handjobhub.com/*
// @match *://umpire-empire.com/*
// @match *://www.getdrip.com/*
// @match *://nakedsecurity.sophos.com/*
// @match *://www.guitarplayer.com/*
// @match *://radiocnrv.com/*
// @match *://www.esa.int/*
// @match *://skiplagged.com/*
// @match *://undergroundwellness.com/*
// @match *://deadspin.com/*
// @match *://thedailyshow.cc.com/*
// @match *://media.nationalarchives.gov.uk/*
// @match *://www.suffolk.edu/*
// @match *://www.hollywoodreporter.com/*
// @match *://www.indiedb.com/*
// @match *://www.txxx.com/*
// @match *://ortcam.com/*
// @match *://www.vooplayer.com/*
// @match *://www.rtlnieuws.nl/*
// @match *://www.skipass.com/*
// @match *://www.premierchristianradio.com/*
// @match *://fod.infobase.com/*
// @match *://www.cornell.edu/*
// @match *://www.gsd.harvard.edu/*
// @match *://www.cns.nyu.edu/*
// @match *://thechive.com/*
// @match *://tvrain.ru/*
// @match *://muz-tv.ru/*
// @match *://www.cinemablend.com/*
// @match *://crooksandliars.com/*
// @match *://theothermccain.com/*
// @match *://www.riderfans.com/*
// @match *://www.clickhole.com/*
// @match *://whilewewatch.blogspot.ru/*
// @match *://helpx.adobe.com/*
// @match *://www.hudl.com/*
// @match *://www.rtl.be/*
// @match *://www.theatlantic.com/*
// @match *://www.hostblogger.de/*
// @match *://5pillarsuk.com/*
// @match *://www.lothype.com/*
// @match *://www.expansion.com/*
// @match *://www.quartier-rouge.be/*
// @match *://openclassrooms.com/*
// @match *://racing4everyone.eu/*
// @match *://support.arkena.com/*
// @match *://nova.bg/*
// @match *://forum.dvdtalk.com/*
// @match *://magazzino.friday.ru/*
// @match *://www.skai.gr/*
// @match *://www.in.gr/*
// @match *://www.ertnews.gr/*
// @match *://www.golfchannel.com/*
// @match *://www.hsgac.senate.gov/*
// @match *://www.sedona.com/*
// @match *://tv5.ca/*
// @match *://kron4.com/*
// @match *://www.vanityfair.com/*
// @match *://www.noviny.sk/*
// @match *://help.vzaar.com/*
// @match *://www.paragon-software.com/*
// @match *://youtube-dl-demo.neocities.org/*
// @match *://www.heidelberg-laureate-forum.org/*
// @match *://www.kidzworld.com/*
// @match *://www.cloudflare.com/*
// @match *://joinpeertube.org/*
// @match *://streetkitchen.hu/*
// @match *://www.vol.at/*
// @match *://share-videos.se/*
// @match *://viqeo.tv/*
// @match *://video.sibnet.ru/*
// @match *://www.beinsports.com/*
// @match *://blog.tomeuvizoso.net/*
// @match *://demo.vhx.tv/*
// @match *://www.adn.com/*
// @match *://www.demorgen.be/*
// @match *://www.bio.org/*
// @match *://www.msmotor.tv/*
// @match *://www.kvs-demo.com/*
// @match *://youix.com/*
// @match *://bogmedia.org/*
// @match *://www.camhub.world/*
// @match *://v.redd.it/*
// @match *://www.lactv.it/*
// @match *://www.gezip.net/*
// @match *://kkzz.kr/*
// @match *://www.monash.edu/*
// @match *://www.nelonen.fi/*
// @match *://www.hs.fi/*
// @match *://www.filmarkivet.se/*
// @match *://www.mollymovieclub.com/*
// @match *://www.blockedandreported.org/*
// @match *://www.skimag.com/*
// @match *://www.nu.nl/*
// @match *://www.autoweek.nl/*
// @match *://www.extra.cz/*
// @match *://shooshtime.com/*
// @downloadURL https://update.greasyfork.org/scripts/451443/WebPlay%20for%20ytdl.user.js
// @updateURL https://update.greasyfork.org/scripts/451443/WebPlay%20for%20ytdl.meta.js
// ==/UserScript==

const languages = {
  'en-US': {
    OFF: 'Off',
    ON: 'On',
    PLAY_BUTTON_TITLE: 'Double click to hide',
    VALID_URL_MATCH: 'Valid URL match',
    VALID_URL_MATCH_TIP: `
This function uses a method similar to yt-dlp to check that the address of the current web page is supported, and does not display the WebPlay button if it is not.
Since using and yt-dlp requires a Python environment, the script will load Pyodide from unpkg.com to execute Python code.`.trim(),
  },
  'zh-CN': {
    OFF: '关',
    ON: '开',
    PLAY_BUTTON_TITLE: '双击隐藏',
    VALID_URL_MATCH: '有效网址匹配',
    VALID_URL_MATCH_TIP: `
这个功能会使用和 yt-dlp 类似的方法检查当前网页的地址被支持，如果不支持则不显示 WebPlay 按钮。
由于使用和 yt-dlp 需要 Python 环境，脚本会从 unpkg.com 加载 Pyodide 执行 Python 代码，确保你的网络可以访问它。`.trim(),
  },
};

const localization = languages[navigator.language] || languages['en-US'];

const style = document.createElement('style');
style.innerHTML = /*css*/`
.play-button {
  background: linear-gradient(to right, #7f7fd5, #86a8e7, #91eae4);
  border-color: rgba(0, 0, 0, 0.2);
  color: #f1f2f3;
  cursor: pointer;
  font-family: Arial;
  font-size: 18px;
  opacity: 0.7;
  position: fixed;
  top: 8vh;
  transition: opacity 0s ease-in 0.8s, right 0.5s ease-in 0.3s;
  right: -80px;
  z-index: 99999;
}

.play-button_init, .play-button:hover {
  opacity: 1;
  transition-delay: 0s;
  right: 0;
}
`;

const playButton = document.createElement('button');
playButton.classList.add('play-button');
playButton.textContent = '▶ WebPlay';
playButton.title = localization.PLAY_BUTTON_TITLE;
playButton.addEventListener('click', () => {
  clearTimeout(Number(playButton.dataset.timer));
  playButton.dataset.timer = setTimeout(() => {
    delete playButton.dataset.timer;
    const params = new URLSearchParams();
    const video = document.querySelector('video');
    params.append('url', location.href);
    params.append('parse', '1');
    if (video) {
      params.append('start', video.currentTime);
    }
    location.assign('webplay://open/?' + params.toString());
    video.pause();
  }, 300);
});
playButton.addEventListener('dblclick', () => {
  clearTimeout(Number(playButton.dataset.timer));
  playButton.remove();
});

const container = document.createElement('div');
container.id = 'webplay-ytdl-' + Number.parseInt(Math.random() * 100);
const shadow = container.attachShadow({ mode: 'closed' });
shadow.append(style);
shadow.append(playButton);

const toggleElement = function toggleElement(v) {
  if (!document.body) {
    unsafeWindow.addEventListener('DOMContentLoaded', setTimeout.bind(this, toggleElement.bind(this, v), 1000));
    return;
  }
  document.body.appendChild(container);
  if (v) {
    playButton.classList.add('play-button_init');
  } else {
    document.body.removeChild(container);
  }
  setTimeout(playButton.classList.remove.bind(playButton.classList, 'play-button_init'), 1000);
};

document.addEventListener('fullscreenchange', () => {
  container.style.display = document.fullscreenElement ? 'none' : '';
});

const validURLMatch = GM_getValue('validURLMatch', false);

GM_registerMenuCommand(`${localization.VALID_URL_MATCH}: ${validURLMatch ? localization.ON : localization.OFF}`, () => {
  const v = !validURLMatch;
  GM_setValue('validURLMatch', v);
  if (v) {
    alert(localization.VALID_URL_MATCH_TIP);
  }
  location.reload();
});

if (!validURLMatch) {
  toggleElement(true);
  return;
}

/** @type Map<string, string[]> */
const URL_REGEXS = new Map();

let changeHandler = Promise.resolve;
let oldUrl = location.href;

setInterval(() => {
  if (oldUrl !== location.href) {
    oldUrl = location.href;
    changeHandler();
  }
}, 1000);

loadPyodide({ indexURL: 'https://unpkg.com/pyodide@0.22.0/' })
  .then((pyodide) => {
    const re = pyodide.pyimport('re');
    changeHandler = function changeHandler() {
      const regexs = URL_REGEXS.get(location.host);
      if (regexs) {
        const result = regexs.some((regex) => {
          try {
            return !!re.match(regex, location.href);
          } catch (ex) {
            console.error(ex);
          }
          return false;
        });
        toggleElement(result);
      }
    };
    changeHandler();
  })
  .catch((err) => {
    console.error(err);
    toggleElement(true);
  });

URL_REGEXS.set('0000.studio', [String.raw`https?://0000\.studio/(?P<uploader_id>[^/]+)/broadcasts/(?P<id>[^/]+)/archive`, String.raw`https?://0000\.studio/(?P<uploader_id>[^/]+)/archive-clip/(?P<id>[^/]+)`]);
URL_REGEXS.set('17.live', [String.raw`https?://(?:www\.)?17\.live/(?:[^/]+/)*(?:live|profile/r)/(?P<id>\d+)`, String.raw`https?://(?:www\.)?17\.live/(?:[^/]+/)*profile/r/(?P<uploader_id>\d+)/clip/(?P<id>[^/]+)`]);
URL_REGEXS.set('www.1news.co.nz', [String.raw`https?://(?:www\.)?(?:1|one)news\.co\.nz/\d+/\d+/\d+/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.onenews.co.nz', [String.raw`https?://(?:www\.)?(?:1|one)news\.co\.nz/\d+/\d+/\d+/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.1tv.ru', [String.raw`https?://(?:www\.)?1tv\.ru/(?:[^/]+/)+(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.20min.ch', [String.raw`(?x)https?://(?:www\.)?20min\.ch/(?:videotv/*\?.*?\bvid=|videoplayer/videoplayer\.html\?.*?\bvideoId@)(?P<id>\d+)`, String.raw`.*`]);
URL_REGEXS.set('video.twentythree.net', [String.raw`https?://(?P<domain>[^.]+\.(?:twentythree\.net|23video\.com|filmweb\.no))/v\.ihtml/player\.html\?(?P<query>.*?\bphoto(?:_|%5f)id=(?P<id>\d+).*)`]);
URL_REGEXS.set('bonnier-publications-danmark.23video.com', [String.raw`https?://(?P<domain>[^.]+\.(?:twentythree\.net|23video\.com|filmweb\.no))/v\.ihtml/player\.html\?(?P<query>.*?\bphoto(?:_|%5f)id=(?P<id>\d+).*)`]);
URL_REGEXS.set('247sports.com', [String.raw`https?://(?:www\.)?247sports\.com/Video/(?:[^/?#&]+-)?(?P<id>\d+)`]);
URL_REGEXS.set('24tv.ua', [String.raw`https?://24tv\.ua/news/showPlayer\.do.*?(?:\?|&)objectId=(?P<id>\d+)`]);
URL_REGEXS.set('www.24video.net', [String.raw`(?x)https?://(?P<host>(?:(?:www|porno?)\.)?24video\.(?:net|me|xxx|sexy?|tube|adult|site|vip))/(?:video/(?:(?:view|xml)/)?|player/new24_play\.swf\?id=)(?P<id>\d+)`]);
URL_REGEXS.set('www.24video.me', [String.raw`(?x)https?://(?P<host>(?:(?:www|porno?)\.)?24video\.(?:net|me|xxx|sexy?|tube|adult|site|vip))/(?:video/(?:(?:view|xml)/)?|player/new24_play\.swf\?id=)(?P<id>\d+)`]);
URL_REGEXS.set('www.24video.tube', [String.raw`(?x)https?://(?P<host>(?:(?:www|porno?)\.)?24video\.(?:net|me|xxx|sexy?|tube|adult|site|vip))/(?:video/(?:(?:view|xml)/)?|player/new24_play\.swf\?id=)(?P<id>\d+)`]);
URL_REGEXS.set('www.24video.site', [String.raw`(?x)https?://(?P<host>(?:(?:www|porno?)\.)?24video\.(?:net|me|xxx|sexy?|tube|adult|site|vip))/(?:video/(?:(?:view|xml)/)?|player/new24_play\.swf\?id=)(?P<id>\d+)`]);
URL_REGEXS.set('porno.24video.net', [String.raw`(?x)https?://(?P<host>(?:(?:www|porno?)\.)?24video\.(?:net|me|xxx|sexy?|tube|adult|site|vip))/(?:video/(?:(?:view|xml)/)?|player/new24_play\.swf\?id=)(?P<id>\d+)`]);
URL_REGEXS.set('www.24video.vip', [String.raw`(?x)https?://(?P<host>(?:(?:www|porno?)\.)?24video\.(?:net|me|xxx|sexy?|tube|adult|site|vip))/(?:video/(?:(?:view|xml)/)?|player/new24_play\.swf\?id=)(?P<id>\d+)`]);
URL_REGEXS.set('porn.24video.net', [String.raw`(?x)https?://(?P<host>(?:(?:www|porno?)\.)?24video\.(?:net|me|xxx|sexy?|tube|adult|site|vip))/(?:video/(?:(?:view|xml)/)?|player/new24_play\.swf\?id=)(?P<id>\d+)`]);
URL_REGEXS.set('playout.3qsdn.com', [String.raw`https?://playout\.3qsdn\.com/(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`]);
URL_REGEXS.set('www.3sat.de', [String.raw`https?://(?:www\.)?3sat\.de/(?:[^/]+/)*(?P<id>[^/?#&]+)\.html`]);
URL_REGEXS.set('www.4tube.com', [String.raw`https?://(?:(?P<kind>www|m)\.)?4tube\.com/(?:videos|embed)/(?P<id>\d+)(?:/(?P<display_id>[^/?#&]+))?`]);
URL_REGEXS.set('m.4tube.com', [String.raw`https?://(?:(?P<kind>www|m)\.)?4tube\.com/(?:videos|embed)/(?P<id>\d+)(?:/(?P<display_id>[^/?#&]+))?`]);
URL_REGEXS.set('www.56.com', [String.raw`https?://(?:(?:www|player)\.)?56\.com/(?:.+?/)?(?:v_|(?:play_album.+-))(?P<textid>.+?)\.(?:html|swf)`]);
URL_REGEXS.set('www.6play.fr', [String.raw`(?:6play:|https?://(?:www\.)?(?P<domain>6play\.fr|rtlplay\.be|play\.rtl\.hr|rtlmost\.hu)/.+?-c_)(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.rtlplay.be', [String.raw`(?:6play:|https?://(?:www\.)?(?P<domain>6play\.fr|rtlplay\.be|play\.rtl\.hr|rtlmost\.hu)/.+?-c_)(?P<id>[0-9]+)`]);
URL_REGEXS.set('play.rtl.hr', [String.raw`(?:6play:|https?://(?:www\.)?(?P<domain>6play\.fr|rtlplay\.be|play\.rtl\.hr|rtlmost\.hu)/.+?-c_)(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.rtlmost.hu', [String.raw`(?:6play:|https?://(?:www\.)?(?P<domain>6play\.fr|rtlplay\.be|play\.rtl\.hr|rtlmost\.hu)/.+?-c_)(?P<id>[0-9]+)`]);
URL_REGEXS.set('7plus.com.au', [String.raw`https?://(?:www\.)?7plus\.com\.au/(?P<path>[^?]+\?.*?\bepisode-id=(?P<id>[^&#]+))`]);
URL_REGEXS.set('8tracks.com', [String.raw`https?://8tracks\.com/(?P<user>[^/]+)/(?P<id>[^/#]+)(?:#.*)?$`]);
URL_REGEXS.set('91porn.com', [String.raw`(?:https?://)(?:www\.|)91porn\.com/.+?\?viewkey=(?P<id>[\w\d]+)`]);
URL_REGEXS.set('9gag.com', [String.raw`https?://(?:www\.)?9gag\.com/gag/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('www.9now.com.au', [String.raw`https?://(?:www\.)?9now\.com\.au/(?:[^/]+/){2}(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.abc.net.au', [String.raw`https?://(?:www\.)?abc\.net\.au/(?:news|btn)/(?:[^/]+/){1,4}(?P<id>\d{5,})`, String.raw`.*`]);
URL_REGEXS.set('iview.abc.net.au', [String.raw`https?://iview\.abc\.net\.au/(?:[^/]+/)*video/(?P<id>[^/?#]+)`, String.raw`https?://iview\.abc\.net\.au/show/(?P<id>[^/]+)(?:/series/\d+)?$`]);
URL_REGEXS.set('abcnews.go.com', [String.raw`https?://abcnews\.go\.com/(?:[^/]+/)+(?P<display_id>[0-9a-z-]+)/story\?id=(?P<id>\d+)`, String.raw`(?x)https?://(?:abcnews\.go\.com/(?:(?:[^/]+/)*video/(?P<display_id>[0-9a-z-]+)-|video/(?:embed|itemfeed)\?.*?\bid=)|fivethirtyeight\.abcnews\.go\.com/video/embed/\d+/)(?P<id>\d+)`]);
URL_REGEXS.set('abc7news.com', [String.raw`https?://(?P<site>abc(?:7(?:news|ny|chicago)?|11|13|30)|6abc)\.com(?:(?:/[^/]+)*/(?P<display_id>[^/]+))?/(?P<id>\d+)`]);
URL_REGEXS.set('6abc.com', [String.raw`https?://(?P<site>abc(?:7(?:news|ny|chicago)?|11|13|30)|6abc)\.com(?:(?:/[^/]+)*/(?P<display_id>[^/]+))?/(?P<id>\d+)`]);
URL_REGEXS.set('clips.abcotvs.com', [String.raw`https?://clips\.abcotvs\.com/(?:[^/]+/)*video/(?P<id>\d+)`]);
URL_REGEXS.set('abema.tv', [String.raw`https?://abema\.tv/(?P<type>now-on-air|video/episode|channels/.+?/slots)/(?P<id>[^?/]+)`, String.raw`https?://abema\.tv/video/title/(?P<id>[^?/]+)`]);
URL_REGEXS.set('academicearth.org', [String.raw`^https?://(?:www\.)?academicearth\.org/playlists/(?P<id>[^?#/]+)`]);
URL_REGEXS.set('www.acast.com', [String.raw`(?x)https?://(?:(?:(?:embed|www)\.)?acast\.com/|play\.acast\.com/s/)(?P<channel>[^/]+)/(?P<id>[^/#?]+)`, String.raw`(?x)https?://(?:(?:www\.)?acast\.com/|play\.acast\.com/s/)(?P<id>[^/#?]+)`]);
URL_REGEXS.set('embed.acast.com', [String.raw`(?x)https?://(?:(?:(?:embed|www)\.)?acast\.com/|play\.acast\.com/s/)(?P<channel>[^/]+)/(?P<id>[^/#?]+)`]);
URL_REGEXS.set('play.acast.com', [String.raw`(?x)https?://(?:(?:(?:embed|www)\.)?acast\.com/|play\.acast\.com/s/)(?P<channel>[^/]+)/(?P<id>[^/#?]+)`, String.raw`(?x)https?://(?:(?:www\.)?acast\.com/|play\.acast\.com/s/)(?P<id>[^/#?]+)`]);
URL_REGEXS.set('www.acfun.cn', [String.raw`https?://www\.acfun\.cn/bangumi/(?P<id>aa[_\d]+)`, String.raw`https?://www\.acfun\.cn/v/ac(?P<id>[_\d]+)`]);
URL_REGEXS.set('animationdigitalnetwork.fr', [String.raw`https?://(?:www\.)?(?:animation|anime)digitalnetwork\.fr/video/[^/]+/(?P<id>\d+)`]);
URL_REGEXS.set('animedigitalnetwork.fr', [String.raw`https?://(?:www\.)?(?:animation|anime)digitalnetwork\.fr/video/[^/]+/(?P<id>\d+)`]);
URL_REGEXS.set('tv.adobe.com', [String.raw`https?://tv\.adobe\.com/(?:(?P<language>fr|de|es|jp)/)?watch/(?P<show_urlname>[^/]+)/(?P<id>[^/]+)`, String.raw`https?://tv\.adobe\.com/(?:(?P<language>fr|de|es|jp)/)?channel/(?P<id>[^/]+)(?:/(?P<category_urlname>[^/]+))?`, String.raw`https?://tv\.adobe\.com/embed/\d+/(?P<id>\d+)`, String.raw`https?://tv\.adobe\.com/(?:(?P<language>fr|de|es|jp)/)?show/(?P<id>[^/]+)`]);
URL_REGEXS.set('video.tv.adobe.com', [String.raw`https?://video\.tv\.adobe\.com/v/(?P<id>\d+)`]);
URL_REGEXS.set('adultswim.com', [String.raw`https?://(?:www\.)?adultswim\.com/videos/(?P<show_path>[^/?#]+)(?:/(?P<episode_path>[^/?#]+))?`]);
URL_REGEXS.set('www.adultswim.com', [String.raw`https?://(?:www\.)?adultswim\.com/videos/(?P<show_path>[^/?#]+)(?:/(?P<episode_path>[^/?#]+))?`]);
URL_REGEXS.set('www.history.com', [String.raw`(?x)https?://(?:(?:www|play|watch)\.)?(?P<domain>(?:history(?:vault)?|aetv|mylifetime|lifetimemovieclub)\.com|fyi\.tv)/(?P<id>shows/[^/]+/season-\d+/episode-\d+|(?:(?:movie|special)s/[^/]+|(?:shows/[^/]+/)?videos)/[^/?#&]+)`, String.raw`(?x)https?://(?:(?:www|play|watch)\.)?(?P<domain>(?:history(?:vault)?|aetv|mylifetime|lifetimemovieclub)\.com|fyi\.tv)/shows/(?P<id>[^/?#&]+)/?(?:[?#&]|$)`, String.raw`https?://(?:www\.)?history\.com/topics/[^/]+/(?P<id>[\w+-]+?)-video`]);
URL_REGEXS.set('www.aetv.com', [String.raw`(?x)https?://(?:(?:www|play|watch)\.)?(?P<domain>(?:history(?:vault)?|aetv|mylifetime|lifetimemovieclub)\.com|fyi\.tv)/(?P<id>shows/[^/]+/season-\d+/episode-\d+|(?:(?:movie|special)s/[^/]+|(?:shows/[^/]+/)?videos)/[^/?#&]+)`]);
URL_REGEXS.set('www.fyi.tv', [String.raw`(?x)https?://(?:(?:www|play|watch)\.)?(?P<domain>(?:history(?:vault)?|aetv|mylifetime|lifetimemovieclub)\.com|fyi\.tv)/(?P<id>shows/[^/]+/season-\d+/episode-\d+|(?:(?:movie|special)s/[^/]+|(?:shows/[^/]+/)?videos)/[^/?#&]+)`]);
URL_REGEXS.set('www.mylifetime.com', [String.raw`(?x)https?://(?:(?:www|play|watch)\.)?(?P<domain>(?:history(?:vault)?|aetv|mylifetime|lifetimemovieclub)\.com|fyi\.tv)/(?P<id>shows/[^/]+/season-\d+/episode-\d+|(?:(?:movie|special)s/[^/]+|(?:shows/[^/]+/)?videos)/[^/?#&]+)`]);
URL_REGEXS.set('watch.lifetimemovieclub.com', [String.raw`(?x)https?://(?:(?:www|play|watch)\.)?(?P<domain>(?:history(?:vault)?|aetv|mylifetime|lifetimemovieclub)\.com|fyi\.tv)/(?P<id>shows/[^/]+/season-\d+/episode-\d+|(?:(?:movie|special)s/[^/]+|(?:shows/[^/]+/)?videos)/[^/?#&]+)`]);
URL_REGEXS.set('play.aetv.com', [String.raw`(?x)https?://(?:(?:www|play|watch)\.)?(?P<domain>(?:history(?:vault)?|aetv|mylifetime|lifetimemovieclub)\.com|fyi\.tv)/(?P<id>shows/[^/]+/season-\d+/episode-\d+|(?:(?:movie|special)s/[^/]+|(?:shows/[^/]+/)?videos)/[^/?#&]+)`]);
URL_REGEXS.set('watch.historyvault.com', [String.raw`(?x)https?://(?:(?:www|play|watch)\.)?(?P<domain>(?:history(?:vault)?|aetv|mylifetime|lifetimemovieclub)\.com|fyi\.tv)/(?:[^/]+/)*(?:list|collections)/(?P<id>[^/?#&]+)/?(?:[?#&]|$)`]);
URL_REGEXS.set('www.historyvault.com', [String.raw`(?x)https?://(?:(?:www|play|watch)\.)?(?P<domain>(?:history(?:vault)?|aetv|mylifetime|lifetimemovieclub)\.com|fyi\.tv)/(?:[^/]+/)*(?:list|collections)/(?P<id>[^/?#&]+)/?(?:[?#&]|$)`]);
URL_REGEXS.set('aeon.co', [String.raw`https?://(?:www\.)?aeon\.co/videos/(?P<id>[^/?]+)`]);
URL_REGEXS.set('live.afreecatv.com:8079', [String.raw`(?x)https?://(?:(?:(?:live|afbbs|www)\.)?afreeca(?:tv)?\.com(?::\d+)?(?:/app/(?:index|read_ucc_bbs)\.cgi|/player/[Pp]layer\.(?:swf|html))\?.*?\bnTitleNo=|vod\.afreecatv\.com/(PLAYER/STATION|player)/)(?P<id>\d+)`]);
URL_REGEXS.set('afbbs.afreecatv.com:8080', [String.raw`(?x)https?://(?:(?:(?:live|afbbs|www)\.)?afreeca(?:tv)?\.com(?::\d+)?(?:/app/(?:index|read_ucc_bbs)\.cgi|/player/[Pp]layer\.(?:swf|html))\?.*?\bnTitleNo=|vod\.afreecatv\.com/(PLAYER/STATION|player)/)(?P<id>\d+)`]);
URL_REGEXS.set('vod.afreecatv.com', [String.raw`(?x)https?://(?:(?:(?:live|afbbs|www)\.)?afreeca(?:tv)?\.com(?::\d+)?(?:/app/(?:index|read_ucc_bbs)\.cgi|/player/[Pp]layer\.(?:swf|html))\?.*?\bnTitleNo=|vod\.afreecatv\.com/(PLAYER/STATION|player)/)(?P<id>\d+)`]);
URL_REGEXS.set('www.afreecatv.com', [String.raw`(?x)https?://(?:(?:(?:live|afbbs|www)\.)?afreeca(?:tv)?\.com(?::\d+)?(?:/app/(?:index|read_ucc_bbs)\.cgi|/player/[Pp]layer\.(?:swf|html))\?.*?\bnTitleNo=|vod\.afreecatv\.com/(PLAYER/STATION|player)/)(?P<id>\d+)`]);
URL_REGEXS.set('play.afreecatv.com', [String.raw`https?://play\.afreeca(?:tv)?\.com/(?P<id>[^/]+)(?:/(?P<bno>\d+))?`]);
URL_REGEXS.set('play.afreeca.com', [String.raw`https?://play\.afreeca(?:tv)?\.com/(?P<id>[^/]+)(?:/(?P<bno>\d+))?`]);
URL_REGEXS.set('bj.afreecatv.com', [String.raw`https?://bj\.afreeca(?:tv)?\.com/(?P<id>[^/]+)/vods/?(?P<slug_type>[^/]+)?`]);
URL_REGEXS.set('air.mozilla.org', [String.raw`https?://air\.mozilla\.org/(?P<id>[0-9a-z-]+)/?`]);
URL_REGEXS.set('www.air.tv', [String.raw`https?://www\.air\.tv/watch\?v=(?P<id>\w+)`]);
URL_REGEXS.set('aitube.kz', [String.raw`https?://aitube\.kz/(?:video|embed/)\?(?:[^\?]+)?id=(?P<id>[\w-]+)`]);
URL_REGEXS.set('live.aliexpress.com', [String.raw`https?://live\.aliexpress\.com/live/(?P<id>\d+)`]);
URL_REGEXS.set('balkans.aljazeera.net', [String.raw`https?://(?P<base>\w+\.aljazeera\.\w+)/(?P<type>programs?/[^/]+|(?:feature|video|new)s)?/\d{4}/\d{1,2}/\d{1,2}/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('www.allocine.fr', [String.raw`https?://(?:www\.)?allocine\.fr/(?:article|video|film)/(?:fichearticle_gen_carticle=|player_gen_cmedia=|fichefilm_gen_cfilm=|video-)(?P<id>[0-9]+)(?:\.html)?`]);
URL_REGEXS.set('www.alphaporno.com', [String.raw`https?://(?:www\.)?alphaporno\.com/videos/(?P<id>[^/]+)`]);
URL_REGEXS.set('www.alsace20.tv', [String.raw`https?://(?:www\.)?alsace20\.tv/(?:[\w-]+/)+[\w-]+-(?P<id>[\w]+)`, String.raw`https?://(?:www\.)?alsace20\.tv/emb/(?P<id>[\w]+)`]);
URL_REGEXS.set('cursos.alura.com.br', [String.raw`https?://(?:cursos\.)?alura\.com\.br/course/(?P<course_name>[^/]+)/task/(?P<id>\d+)`, String.raw`https?://(?:cursos\.)?alura\.com\.br/course/(?P<id>[^/]+)`]);
URL_REGEXS.set('amara.org', [String.raw`https?://(?:www\.)?amara\.org/(?:\w+/)?videos/(?P<id>\w+)`]);
URL_REGEXS.set('www.amazon.in', [String.raw`(?:https?://(?:www\.)?amazon\.in/minitv/tp/|amazonminitv:(?:amzn1\.dv\.gti\.)?)(?P<id>[a-f0-9-]+)`, String.raw`https?://(?:www\.)?amazon\.(?:[a-z]{2,3})(?:\.[a-z]{2})?/gp/customer-reviews/(?P<id>[^/&#$?]+)`, String.raw`https?://(?:www\.)?amazon\.(?:[a-z]{2,3})(?:\.[a-z]{2})?/(?:[^/]+/)?(?:dp|gp/product)/(?P<id>[^/&#$?]+)`]);
URL_REGEXS.set('www.amazon.com', [String.raw`https?://(?:www\.)?amazon\.(?:[a-z]{2,3})(?:\.[a-z]{2})?/gp/customer-reviews/(?P<id>[^/&#$?]+)`, String.raw`https?://(?:www\.)?amazon\.(?:[a-z]{2,3})(?:\.[a-z]{2})?/(?:[^/]+/)?(?:dp|gp/product)/(?P<id>[^/&#$?]+)`]);
URL_REGEXS.set('www.amazon.co.uk', [String.raw`https?://(?:www\.)?amazon\.(?:[a-z]{2,3})(?:\.[a-z]{2})?/(?:[^/]+/)?(?:dp|gp/product)/(?P<id>[^/&#$?]+)`]);
URL_REGEXS.set('www.amazon.es', [String.raw`https?://(?:www\.)?amazon\.(?:[a-z]{2,3})(?:\.[a-z]{2})?/(?:[^/]+/)?(?:dp|gp/product)/(?P<id>[^/&#$?]+)`]);
URL_REGEXS.set('www.bbcamerica.com', [String.raw`https?://(?:www\.)?(?P<site>amc|bbcamerica|ifc|(?:we|sundance)tv)\.com/(?P<id>(?:movies|shows(?:/[^/]+)+)/[^/?#&]+)`]);
URL_REGEXS.set('www.amc.com', [String.raw`https?://(?:www\.)?(?P<site>amc|bbcamerica|ifc|(?:we|sundance)tv)\.com/(?P<id>(?:movies|shows(?:/[^/]+)+)/[^/?#&]+)`]);
URL_REGEXS.set('www.wetv.com', [String.raw`https?://(?:www\.)?(?P<site>amc|bbcamerica|ifc|(?:we|sundance)tv)\.com/(?P<id>(?:movies|shows(?:/[^/]+)+)/[^/?#&]+)`]);
URL_REGEXS.set('www.ifc.com', [String.raw`https?://(?:www\.)?(?P<site>amc|bbcamerica|ifc|(?:we|sundance)tv)\.com/(?P<id>(?:movies|shows(?:/[^/]+)+)/[^/?#&]+)`]);
URL_REGEXS.set('www.sundancetv.com', [String.raw`https?://(?:www\.)?(?P<site>amc|bbcamerica|ifc|(?:we|sundance)tv)\.com/(?P<id>(?:movies|shows(?:/[^/]+)+)/[^/?#&]+)`]);
URL_REGEXS.set('www.americastestkitchen.com', [String.raw`https?://(?:www\.)?americastestkitchen\.com/(?:cooks(?:country|illustrated)/)?(?P<resource_type>episode|videos)/(?P<id>\d+)`, String.raw`https?://(?:www\.)?americastestkitchen\.com(?P<show>/cookscountry)?/episodes/browse/season_(?P<id>\d+)`]);
URL_REGEXS.set('www.ahctv.com', [String.raw`https?://(?:www\.)?ahctv\.com/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('anderetijden.nl', [String.raw`https?://(?:www\.)?anderetijden\.nl/programma/(?:[^/]+/)+(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.angel.com', [String.raw`https?://(?:www\.)?angel\.com/watch/(?P<series>[^/?#]+)/episode/(?P<id>[\w-]+)/season-(?P<season_number>\d+)/episode-(?P<episode_number>\d+)/(?P<title>[^/?#]+)`]);
URL_REGEXS.set('www.animalplanet.com', [String.raw`https?://(?:www\.)?animalplanet\.com/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.ant1news.gr', [String.raw`https?://(?:www\.)?ant1news\.gr/[^/]+/article/(?P<id>\d+)/`, String.raw`https?://(?P<netloc>(?:www\.)?ant1news\.gr)/watch/(?P<id>\d+)/`]);
URL_REGEXS.set('ant1news.gr', [String.raw`https?://(?:www\.)?ant1news\.gr/[^/]+/article/(?P<id>\d+)/`]);
URL_REGEXS.set('www.antenna.gr', [String.raw`(?:https?:)?//(?:[a-zA-Z0-9\-]+\.)?(?:antenna|ant1news)\.gr/templates/pages/player\?([^#]+&)?cid=(?P<id>[^#&]+)`]);
URL_REGEXS.set('www.aol.com', [String.raw`(?:aol-video:|https?://(?:www\.)?aol\.(?:com|ca|co\.uk|de|jp)/video/(?:[^/]+/)*)(?P<id>\d{9}|[0-9a-f]{24}|[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12})`]);
URL_REGEXS.set('www.aol.ca', [String.raw`(?:aol-video:|https?://(?:www\.)?aol\.(?:com|ca|co\.uk|de|jp)/video/(?:[^/]+/)*)(?P<id>\d{9}|[0-9a-f]{24}|[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12})`]);
URL_REGEXS.set('www.aol.co.uk', [String.raw`(?:aol-video:|https?://(?:www\.)?aol\.(?:com|ca|co\.uk|de|jp)/video/(?:[^/]+/)*)(?P<id>\d{9}|[0-9a-f]{24}|[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12})`]);
URL_REGEXS.set('www.aol.de', [String.raw`(?:aol-video:|https?://(?:www\.)?aol\.(?:com|ca|co\.uk|de|jp)/video/(?:[^/]+/)*)(?P<id>\d{9}|[0-9a-f]{24}|[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12})`]);
URL_REGEXS.set('www.aol.jp', [String.raw`(?:aol-video:|https?://(?:www\.)?aol\.(?:com|ca|co\.uk|de|jp)/video/(?:[^/]+/)*)(?P<id>\d{9}|[0-9a-f]{24}|[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12})`]);
URL_REGEXS.set('uvp.apa.at', [String.raw`(?P<base_url>https?://[^/]+\.apa\.at)/embed/(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`]);
URL_REGEXS.set('uvp-apapublisher.sf.apa.at', [String.raw`(?P<base_url>https?://[^/]+\.apa\.at)/embed/(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`]);
URL_REGEXS.set('uvp-rma.sf.apa.at', [String.raw`(?P<base_url>https?://[^/]+\.apa\.at)/embed/(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`]);
URL_REGEXS.set('uvp-kleinezeitung.sf.apa.at', [String.raw`(?P<base_url>https?://[^/]+\.apa\.at)/embed/(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`]);
URL_REGEXS.set('www.aparat.com', [String.raw`https?://(?:www\.)?aparat\.com/(?:v/|video/video/embed/videohash/)(?P<id>[a-zA-Z0-9]+)`]);
URL_REGEXS.set('itunes.apple.com', [String.raw`https?://itunes\.apple\.com/\w{0,2}/?post/(?:id)?sa\.(?P<id>[\w-]+)`]);
URL_REGEXS.set('ent.appledaily.com.tw', [String.raw`https?://(www|ent)\.appledaily\.com\.tw/[^/]+/[^/]+/[^/]+/(?P<date>\d+)/(?P<id>\d+)(/.*)?`]);
URL_REGEXS.set('www.appledaily.com.tw', [String.raw`https?://(www|ent)\.appledaily\.com\.tw/[^/]+/[^/]+/[^/]+/(?P<date>\d+)/(?P<id>\d+)(/.*)?`]);
URL_REGEXS.set('podcasts.apple.com', [String.raw`https?://podcasts\.apple\.com/(?:[^/]+/)?podcast(?:/[^/]+){1,2}.*?\bi=(?P<id>\d+)`]);
URL_REGEXS.set('trailers.apple.com', [String.raw`https?://(?:www\.|movie)?trailers\.apple\.com/(?:trailers|ca)/(?P<company>[^/]+)/(?P<movie>[^/]+)`, String.raw`https?://(?:www\.)?trailers\.apple\.com/#section=(?P<id>justadded|exclusive|justhd|mostpopular|moviestudios)`]);
URL_REGEXS.set('movietrailers.apple.com', [String.raw`https?://(?:www\.|movie)?trailers\.apple\.com/(?:trailers|ca)/(?P<company>[^/]+)/(?P<movie>[^/]+)`]);
URL_REGEXS.set('archive.org', [String.raw`https?://(?:www\.)?archive\.org/(?:details|embed)/(?P<id>[^?#]+)(?:[?].*)?$`]);
URL_REGEXS.set('www.daserste.de', [String.raw`(?P<mainurl>https?://(?:www\.)?daserste\.de/(?:[^/?#&]+/)+(?P<id>[^/?#&]+))\.html`]);
URL_REGEXS.set('www.ardmediathek.de', [String.raw`^https?://(?:(?:(?:www|classic)\.)?ardmediathek\.de|mediathek\.(?:daserste|rbb-online)\.de|one\.ard\.de)/(?:.*/)(?P<video_id>[0-9]+|[^0-9][^/\?]+)[^/\?]*(?:\?.*)?`, String.raw`(?x)https://(?:(?:beta|www)\.)?ardmediathek\.de/(?:(?P<client>[^/]+)/)?(?:player|live|video|(?P<playlist>sendung|sammlung))/(?:(?P<display_id>(?(playlist)[^?#]+?|[^?#]+))/)?(?P<id>(?(playlist)|Y3JpZDovL)[a-zA-Z0-9]+)(?(playlist)/(?P<season>\d+)?/?(?:[?#]|$))`]);
URL_REGEXS.set('one.ard.de', [String.raw`^https?://(?:(?:(?:www|classic)\.)?ardmediathek\.de|mediathek\.(?:daserste|rbb-online)\.de|one\.ard\.de)/(?:.*/)(?P<video_id>[0-9]+|[^0-9][^/\?]+)[^/\?]*(?:\?.*)?`]);
URL_REGEXS.set('mediathek.daserste.de', [String.raw`^https?://(?:(?:(?:www|classic)\.)?ardmediathek\.de|mediathek\.(?:daserste|rbb-online)\.de|one\.ard\.de)/(?:.*/)(?P<video_id>[0-9]+|[^0-9][^/\?]+)[^/\?]*(?:\?.*)?`]);
URL_REGEXS.set('mediathek.rbb-online.de', [String.raw`^https?://(?:(?:(?:www|classic)\.)?ardmediathek\.de|mediathek\.(?:daserste|rbb-online)\.de|one\.ard\.de)/(?:.*/)(?P<video_id>[0-9]+|[^0-9][^/\?]+)[^/\?]*(?:\?.*)?`]);
URL_REGEXS.set('classic.ardmediathek.de', [String.raw`^https?://(?:(?:(?:www|classic)\.)?ardmediathek\.de|mediathek\.(?:daserste|rbb-online)\.de|one\.ard\.de)/(?:.*/)(?P<video_id>[0-9]+|[^0-9][^/\?]+)[^/\?]*(?:\?.*)?`]);
URL_REGEXS.set('beta.ardmediathek.de', [String.raw`(?x)https://(?:(?:beta|www)\.)?ardmediathek\.de/(?:(?P<client>[^/]+)/)?(?:player|live|video|(?P<playlist>sendung|sammlung))/(?:(?P<display_id>(?(playlist)[^?#]+?|[^?#]+))/)?(?P<id>(?(playlist)|Y3JpZDovL)[a-zA-Z0-9]+)(?(playlist)/(?P<season>\d+)?/?(?:[?#]|$))`]);
URL_REGEXS.set('ardmediathek.de', [String.raw`(?x)https://(?:(?:beta|www)\.)?ardmediathek\.de/(?:(?P<client>[^/]+)/)?(?:player|live|video|(?P<playlist>sendung|sammlung))/(?:(?P<display_id>(?(playlist)[^?#]+?|[^?#]+))/)?(?P<id>(?(playlist)|Y3JpZDovL)[a-zA-Z0-9]+)(?(playlist)/(?P<season>\d+)?/?(?:[?#]|$))`]);
URL_REGEXS.set('video.qbrick.com', [String.raw`(?x)https?://(?:video\.(?:arkena|qbrick)\.com/play2/embed/player\?|play\.arkena\.com/(?:config|embed)/avp/v\d/player/media/(?P<id>[^/]+)/[^/]+/(?P<account_id>\d+))`]);
URL_REGEXS.set('play.arkena.com', [String.raw`(?x)https?://(?:video\.(?:arkena|qbrick)\.com/play2/embed/player\?|play\.arkena\.com/(?:config|embed)/avp/v\d/player/media/(?P<id>[^/]+)/[^/]+/(?P<account_id>\d+))`]);
URL_REGEXS.set('video.arkena.com', [String.raw`(?x)https?://(?:video\.(?:arkena|qbrick)\.com/play2/embed/player\?|play\.arkena\.com/(?:config|embed)/avp/v\d/player/media/(?P<id>[^/]+)/[^/]+/(?P<account_id>\d+))`]);
URL_REGEXS.set('arte.sky.it', [String.raw`https?://arte\.sky\.it/video/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('www.arte.tv', [String.raw`(?x)(?:https?://(?:(?:www\.)?arte\.tv/(?P<lang>fr|de|en|es|it|pl)/videos|api\.arte\.tv/api/player/v\d+/config/(?P<lang_2>fr|de|en|es|it|pl))|arte://program)/(?P<id>\d{6}-\d{3}-[AF]|LIVE)`, String.raw`https?://(?:www\.)?arte\.tv/(?P<lang>fr|de|en|es|it|pl)/videos/(?P<id>[\w-]+(?:/[\w-]+)*)/?\s*$`, String.raw`https?://(?:www\.)?arte\.tv/player/v\d+/index\.php\?.*?\bjson_url=.+`, String.raw`https?://(?:www\.)?arte\.tv/(?P<lang>fr|de|en|es|it|pl)/videos/(?P<id>RC-\d{6})`]);
URL_REGEXS.set('api.arte.tv', [String.raw`(?x)(?:https?://(?:(?:www\.)?arte\.tv/(?P<lang>fr|de|en|es|it|pl)/videos|api\.arte\.tv/api/player/v\d+/config/(?P<lang_2>fr|de|en|es|it|pl))|arte://program)/(?P<id>\d{6}-\d{3}-[AF]|LIVE)`]);
URL_REGEXS.set('www.asiancrush.com', [String.raw`https?://(?:www\.)?(?P<host>(?:(?:asiancrush|yuyutv|midnightpulp)\.com|(?:cocoro|retrocrush)\.tv))/video/(?:[^/]+/)?0+(?P<id>\d+)v\b`, String.raw`https?://(?:www\.)?(?P<host>(?:(?:asiancrush|yuyutv|midnightpulp)\.com|(?:cocoro|retrocrush)\.tv))/series/0+(?P<id>\d+)s\b`]);
URL_REGEXS.set('www.yuyutv.com', [String.raw`https?://(?:www\.)?(?P<host>(?:(?:asiancrush|yuyutv|midnightpulp)\.com|(?:cocoro|retrocrush)\.tv))/video/(?:[^/]+/)?0+(?P<id>\d+)v\b`, String.raw`https?://(?:www\.)?(?P<host>(?:(?:asiancrush|yuyutv|midnightpulp)\.com|(?:cocoro|retrocrush)\.tv))/series/0+(?P<id>\d+)s\b`]);
URL_REGEXS.set('www.midnightpulp.com', [String.raw`https?://(?:www\.)?(?P<host>(?:(?:asiancrush|yuyutv|midnightpulp)\.com|(?:cocoro|retrocrush)\.tv))/video/(?:[^/]+/)?0+(?P<id>\d+)v\b`, String.raw`https?://(?:www\.)?(?P<host>(?:(?:asiancrush|yuyutv|midnightpulp)\.com|(?:cocoro|retrocrush)\.tv))/series/0+(?P<id>\d+)s\b`]);
URL_REGEXS.set('www.cocoro.tv', [String.raw`https?://(?:www\.)?(?P<host>(?:(?:asiancrush|yuyutv|midnightpulp)\.com|(?:cocoro|retrocrush)\.tv))/video/(?:[^/]+/)?0+(?P<id>\d+)v\b`, String.raw`https?://(?:www\.)?(?P<host>(?:(?:asiancrush|yuyutv|midnightpulp)\.com|(?:cocoro|retrocrush)\.tv))/series/0+(?P<id>\d+)s\b`]);
URL_REGEXS.set('www.retrocrush.tv', [String.raw`https?://(?:www\.)?(?P<host>(?:(?:asiancrush|yuyutv|midnightpulp)\.com|(?:cocoro|retrocrush)\.tv))/video/(?:[^/]+/)?0+(?P<id>\d+)v\b`, String.raw`https?://(?:www\.)?(?P<host>(?:(?:asiancrush|yuyutv|midnightpulp)\.com|(?:cocoro|retrocrush)\.tv))/series/0+(?P<id>\d+)s\b`]);
URL_REGEXS.set('www.atresplayer.com', [String.raw`https?://(?:www\.)?atresplayer\.com/[^/]+/[^/]+/[^/]+/[^/]+/(?P<display_id>.+?)_(?P<id>[0-9a-f]{24})`]);
URL_REGEXS.set('atscaleconference.com', [String.raw`https?://(?:www\.)?atscaleconference\.com/events/(?P<id>[^/&$?]+)`]);
URL_REGEXS.set('techchannel.att.com', [String.raw`https?://techchannel\.att\.com/play-video\.cfm/([^/]+/)*(?P<id>.+)`]);
URL_REGEXS.set('www.atv.at', [String.raw`https?://(?:www\.)?atv\.at/tv/(?:[^/]+/){2,3}(?P<id>.*)`]);
URL_REGEXS.set('www.audi-mediacenter.com', [String.raw`https?://(?:www\.)?audi-mediacenter\.com/(?:en|de)/audimediatv/(?:video/)?(?P<id>[^/?#]+)`]);
URL_REGEXS.set('audioboom.com', [String.raw`https?://(?:www\.)?audioboom\.com/(?:boos|posts)/(?P<id>[0-9]+)`]);
URL_REGEXS.set('nokiatune.audiodraft.com', [String.raw`https?://(?:[-\w]+)\.audiodraft\.com/entry/(?P<id>\d+)`]);
URL_REGEXS.set('vikinggrace.audiodraft.com', [String.raw`https?://(?:[-\w]+)\.audiodraft\.com/entry/(?P<id>\d+)`]);
URL_REGEXS.set('timferriss.audiodraft.com', [String.raw`https?://(?:[-\w]+)\.audiodraft\.com/entry/(?P<id>\d+)`]);
URL_REGEXS.set('www.audiodraft.com', [String.raw`https?://www\.audiodraft\.com/contests/[^/#]+#entries&eid=(?P<id>\d+)`]);
URL_REGEXS.set('www.audiomack.com', [String.raw`https?://(?:www\.)?audiomack\.com/(?:song/|(?=.+/song/))(?P<id>[\w/-]+)`, String.raw`https?://(?:www\.)?audiomack\.com/(?:album/|(?=.+/album/))(?P<id>[\w/-]+)`]);
URL_REGEXS.set('audius.co', [String.raw`(?x)https?://(?:www\.)?(?:audius\.co/(?P<uploader>[\w\d-]+)(?!/album|/playlist)/(?P<title>\S+))`, String.raw`https?://(?:www)?audius\.co/(?P<id>[^\/]+)/?(?:[?#]|$)`, String.raw`https?://(?:www\.)?audius\.co/(?P<uploader>[\w\d-]+)/(?:album|playlist)/(?P<title>\S+)`]);
URL_REGEXS.set('awaan.ae', [String.raw`https?://(?:www\.)?(?:awaan|dcndigital)\.ae/(?:#/)?live/(?P<id>\d+)`, String.raw`https?://(?:www\.)?(?:awaan|dcndigital)\.ae/(?:#/)?(?:video(?:/[^/]+)?|media|catchup/[^/]+/[^/]+)/(?P<id>\d+)`]);
URL_REGEXS.set('dcndigital.ae', [String.raw`https?://(?:www\.)?(?:awaan|dcndigital)\.ae/(?:#/)?program/(?:(?P<show_id>\d+)|season/(?P<season_id>\d+))`]);
URL_REGEXS.set('www.dcndigital.ae', [String.raw`https?://(?:www\.)?(?:awaan|dcndigital)\.ae/(?:#/)?(?:video(?:/[^/]+)?|media|catchup/[^/]+/[^/]+)/(?P<id>\d+)`]);
URL_REGEXS.set('tv.telezueri.ch', [String.raw`(?x)https?://(?:www\.|tv\.)?(?P<host>telezueri\.ch|telebaern\.tv|telem1\.ch|tvo-online\.ch)/[^/]+/(?P<id>[^/]+-(?P<article_id>\d+))(?:\#video=(?P<kaltura_id>[_0-9a-z]+))?`]);
URL_REGEXS.set('www.telebaern.tv', [String.raw`(?x)https?://(?:www\.|tv\.)?(?P<host>telezueri\.ch|telebaern\.tv|telem1\.ch|tvo-online\.ch)/[^/]+/(?P<id>[^/]+-(?P<article_id>\d+))(?:\#video=(?P<kaltura_id>[_0-9a-z]+))?`]);
URL_REGEXS.set('v.baidu.com', [String.raw`https?://v\.baidu\.com/(?P<type>[a-z]+)/(?P<id>\d+)\.htm`]);
URL_REGEXS.set('banbye.com', [String.raw`https?://(?:www\.)?banbye.com/(?:en/)?watch/(?P<id>\w+)`, String.raw`https?://(?:www\.)?banbye.com/(?:en/)?channel/(?P<id>\w+)`]);
URL_REGEXS.set('www.b-ch.com', [String.raw`https?://(?:www\.)?b-ch\.com/titles/(?P<id>\d+/\d+)`]);
URL_REGEXS.set('youtube-dl.bandcamp.com', [String.raw`https?://(?P<uploader>[^/]+)\.bandcamp\.com/track/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('benprunty.bandcamp.com', [String.raw`https?://(?P<uploader>[^/]+)\.bandcamp\.com/track/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('relapsealumni.bandcamp.com', [String.raw`https?://(?P<uploader>[^/]+)\.bandcamp\.com/track/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('diskotopia.bandcamp.com', [String.raw`https?://(?P<uploader>[^/]+)\.bandcamp\.com/track/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('blazo.bandcamp.com', [String.raw`https?://(?:(?P<subdomain>[^.]+)\.)?bandcamp\.com/album/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('nightbringer.bandcamp.com', [String.raw`https?://(?:(?P<subdomain>[^.]+)\.)?bandcamp\.com/album/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('jstrecords.bandcamp.com', [String.raw`https?://(?:(?P<subdomain>[^.]+)\.)?bandcamp\.com/album/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('insulters.bandcamp.com', [String.raw`https?://(?:(?P<subdomain>[^.]+)\.)?bandcamp\.com/album/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('adrianvonziegler.bandcamp.com', [String.raw`https?://(?!www\.)(?P<id>[^.]+)\.bandcamp\.com(?:/music)?/?(?:[#?]|$)`]);
URL_REGEXS.set('dotscale.bandcamp.com', [String.raw`https?://(?!www\.)(?P<id>[^.]+)\.bandcamp\.com(?:/music)?/?(?:[#?]|$)`]);
URL_REGEXS.set('nightcallofficial.bandcamp.com', [String.raw`https?://(?!www\.)(?P<id>[^.]+)\.bandcamp\.com(?:/music)?/?(?:[#?]|$)`]);
URL_REGEXS.set('steviasphere.bandcamp.com', [String.raw`https?://(?!www\.)(?P<id>[^.]+)\.bandcamp\.com(?:/music)?/?(?:[#?]|$)`]);
URL_REGEXS.set('coldworldofficial.bandcamp.com', [String.raw`https?://(?!www\.)(?P<id>[^.]+)\.bandcamp\.com(?:/music)?/?(?:[#?]|$)`]);
URL_REGEXS.set('nuclearwarnowproductions.bandcamp.com', [String.raw`https?://(?!www\.)(?P<id>[^.]+)\.bandcamp\.com(?:/music)?/?(?:[#?]|$)`]);
URL_REGEXS.set('bandcamp.com', [String.raw`https?://(?:www\.)?bandcamp\.com/?\?(?:.*?&)?show=(?P<id>\d+)`]);
URL_REGEXS.set('banned.video', [String.raw`https?://(?:www\.)?banned\.video/watch\?id=(?P<id>[0-f]{24})`]);
URL_REGEXS.set('www.bbc.com', [String.raw`(?x)https?://(?:www\.)?(?:bbc\.(?:com|co\.uk)|bbcnewsd73hkzno2ini43t4gblxvycyac5aw4gnv7t2rccijh7745uqd\.onion|bbcweb3hytmzhn5d532owbu6oqadra5z3ar726vq5kgwwn6aucdccrad\.onion)/(?:[^/]+/)+(?P<id>[^/#?]+)`]);
URL_REGEXS.set('www.bbc.co.uk', [String.raw`(?x)https?://(?:www\.)?(?:bbc\.(?:com|co\.uk)|bbcnewsd73hkzno2ini43t4gblxvycyac5aw4gnv7t2rccijh7745uqd\.onion|bbcweb3hytmzhn5d532owbu6oqadra5z3ar726vq5kgwwn6aucdccrad\.onion)/(?:[^/]+/)+(?P<id>[^/#?]+)`, String.raw`(?x)https?://(?:www\.)?bbc\.co\.uk/(?:programmes/(?!articles/)|iplayer(?:/[^/]+)?/(?:episode/|playlist/)|music/(?:clips|audiovideo/popular)[/#]|radio/player/|sounds/play/|events/[^/]+/play/[^/]+/)(?P<id>(?:[pbml][\da-z]{7}|w[\da-z]{7,14}))(?!/(?:episodes|broadcasts|clips))`, String.raw`https?://(?:www\.)?bbc\.co\.uk/programmes/articles/(?P<id>[a-zA-Z0-9]+)`, String.raw`https?://(?:www\.)?bbc\.co\.uk/iplayer/episodes/(?P<id>(?:[pbml][\da-z]{7}|w[\da-z]{7,14}))`, String.raw`https?://(?:www\.)?bbc\.co\.uk/iplayer/group/(?P<id>(?:[pbml][\da-z]{7}|w[\da-z]{7,14}))`, String.raw`https?://(?:www\.)?bbc\.co\.uk/programmes/(?P<id>(?:[pbml][\da-z]{7}|w[\da-z]{7,14}))/(?:episodes|broadcasts|clips)`]);
URL_REGEXS.set('www.bbcnewsd73hkzno2ini43t4gblxvycyac5aw4gnv7t2rccijh7745uqd.onion', [String.raw`(?x)https?://(?:www\.)?(?:bbc\.(?:com|co\.uk)|bbcnewsd73hkzno2ini43t4gblxvycyac5aw4gnv7t2rccijh7745uqd\.onion|bbcweb3hytmzhn5d532owbu6oqadra5z3ar726vq5kgwwn6aucdccrad\.onion)/(?:[^/]+/)+(?P<id>[^/#?]+)`]);
URL_REGEXS.set('www.bbcweb3hytmzhn5d532owbu6oqadra5z3ar726vq5kgwwn6aucdccrad.onion', [String.raw`(?x)https?://(?:www\.)?(?:bbc\.(?:com|co\.uk)|bbcnewsd73hkzno2ini43t4gblxvycyac5aw4gnv7t2rccijh7745uqd\.onion|bbcweb3hytmzhn5d532owbu6oqadra5z3ar726vq5kgwwn6aucdccrad\.onion)/(?:[^/]+/)+(?P<id>[^/#?]+)`]);
URL_REGEXS.set('bbv-tv.net', [String.raw`(?x)https?://(?:www\.)?bbv\-tv\.net/(?:[^?#]+\?(?:[^#]+&)?program=(?P<vid2>\d+)|(?:program|watch)/[^/]+/(?P<vid1>\d+))`, String.raw`(?x)https?://(?:www\.)?bbv\-tv\.net/(?:[^?#]+\?(?:[^#]+&)?channel=(?P<vid2>[^/?&#]+)|live/(?P<vid1>[^/?&#]+))`, String.raw`(?x)https?://(?:www\.)?bbv\-tv\.net/(?:[^?#]+\?(?:[^#]+&)?recording=(?P<vid2>\d+)(?P<vid1>))`]);
URL_REGEXS.set('beatbump.ml', [String.raw`https://beatbump\.ml/(?:release\?id=|artist/|playlist/)(?P<id>[\w-]+)`, String.raw`https://beatbump\.ml/listen\?id=(?P<id>[\w-]+)`]);
URL_REGEXS.set('beatport.com', [String.raw`https?://(?:www\.|pro\.)?beatport\.com/track/(?P<display_id>[^/]+)/(?P<id>[0-9]+)`]);
URL_REGEXS.set('beeg.com', [String.raw`https?://(?:www\.)?beeg\.(?:com(?:/video)?)/-?(?P<id>\d+)`]);
URL_REGEXS.set('www.behindkink.com', [String.raw`https?://(?:www\.)?behindkink\.com/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})/(?P<id>[^/#?_]+)`]);
URL_REGEXS.set('www.bellator.com', [String.raw`https?://(?:www\.)?bellator\.com/[^/]+/[\da-z]{6}(?:[/?#&]|$)`]);
URL_REGEXS.set('www.bnnbloomberg.ca', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:ctv|tsn|bnn(?:bloomberg)?|thecomedynetwork|discovery|discoveryvelocity|sciencechannel|investigationdiscovery|animalplanet|bravo|mtv|space|etalk|marilyn)\.ca|(?:much|cp24)\.com)/.*?(?:\b(?:vid(?:eoid)?|clipId)=|-vid|~|%7E|/(?:episode)?)(?P<id>[0-9]{6,})`]);
URL_REGEXS.set('www.thecomedynetwork.ca', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:ctv|tsn|bnn(?:bloomberg)?|thecomedynetwork|discovery|discoveryvelocity|sciencechannel|investigationdiscovery|animalplanet|bravo|mtv|space|etalk|marilyn)\.ca|(?:much|cp24)\.com)/.*?(?:\b(?:vid(?:eoid)?|clipId)=|-vid|~|%7E|/(?:episode)?)(?P<id>[0-9]{6,})`]);
URL_REGEXS.set('www.tsn.ca', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:ctv|tsn|bnn(?:bloomberg)?|thecomedynetwork|discovery|discoveryvelocity|sciencechannel|investigationdiscovery|animalplanet|bravo|mtv|space|etalk|marilyn)\.ca|(?:much|cp24)\.com)/.*?(?:\b(?:vid(?:eoid)?|clipId)=|-vid|~|%7E|/(?:episode)?)(?P<id>[0-9]{6,})`]);
URL_REGEXS.set('www.bnn.ca', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:ctv|tsn|bnn(?:bloomberg)?|thecomedynetwork|discovery|discoveryvelocity|sciencechannel|investigationdiscovery|animalplanet|bravo|mtv|space|etalk|marilyn)\.ca|(?:much|cp24)\.com)/.*?(?:\b(?:vid(?:eoid)?|clipId)=|-vid|~|%7E|/(?:episode)?)(?P<id>[0-9]{6,})`]);
URL_REGEXS.set('www.ctv.ca', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:ctv|tsn|bnn(?:bloomberg)?|thecomedynetwork|discovery|discoveryvelocity|sciencechannel|investigationdiscovery|animalplanet|bravo|mtv|space|etalk|marilyn)\.ca|(?:much|cp24)\.com)/.*?(?:\b(?:vid(?:eoid)?|clipId)=|-vid|~|%7E|/(?:episode)?)(?P<id>[0-9]{6,})`, String.raw`https?://(?:www\.)?ctv\.ca/(?P<id>(?:show|movie)s/[^/]+/[^/?#&]+)`]);
URL_REGEXS.set('www.much.com', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:ctv|tsn|bnn(?:bloomberg)?|thecomedynetwork|discovery|discoveryvelocity|sciencechannel|investigationdiscovery|animalplanet|bravo|mtv|space|etalk|marilyn)\.ca|(?:much|cp24)\.com)/.*?(?:\b(?:vid(?:eoid)?|clipId)=|-vid|~|%7E|/(?:episode)?)(?P<id>[0-9]{6,})`]);
URL_REGEXS.set('www.etalk.ca', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:ctv|tsn|bnn(?:bloomberg)?|thecomedynetwork|discovery|discoveryvelocity|sciencechannel|investigationdiscovery|animalplanet|bravo|mtv|space|etalk|marilyn)\.ca|(?:much|cp24)\.com)/.*?(?:\b(?:vid(?:eoid)?|clipId)=|-vid|~|%7E|/(?:episode)?)(?P<id>[0-9]{6,})`]);
URL_REGEXS.set('www.cp24.com', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:ctv|tsn|bnn(?:bloomberg)?|thecomedynetwork|discovery|discoveryvelocity|sciencechannel|investigationdiscovery|animalplanet|bravo|mtv|space|etalk|marilyn)\.ca|(?:much|cp24)\.com)/.*?(?:\b(?:vid(?:eoid)?|clipId)=|-vid|~|%7E|/(?:episode)?)(?P<id>[0-9]{6,})`, String.raw`https?://(?:www\.)?cp24\.com/news/(?P<id>[^?#]+)`]);
URL_REGEXS.set('web.arbeitsagentur.de', [String.raw`https?://(?:www\.)?web\.arbeitsagentur\.de/berufetv/[^?#]+/film;filmId=(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.bet.com', [String.raw`https?://(?:www\.)?bet\.com/(?:[^/]+/)+(?P<id>.+?)\.html`]);
URL_REGEXS.set('player.bfi.org.uk', [String.raw`https?://player\.bfi\.org\.uk/[^/]+/film/watch-(?P<id>[\w-]+)-online`]);
URL_REGEXS.set('www.bfmtv.com', [String.raw`https?://(?:www\.)?bfmtv\.com/(?:[^/]+/)*[^/?&#]+_V[A-Z]-(?P<id>\d{12})\.html`, String.raw`https?://(?:www\.)?bfmtv\.com/(?:[^/]+/)*[^/?&#]+_A[A-Z]-(?P<id>\d{12})\.html`, String.raw`https?://(?:www\.)?bfmtv\.com/(?P<id>(?:[^/]+/)?en-direct)`]);
URL_REGEXS.set('www.bibeltv.de', [String.raw`https?://(?:www\.)?bibeltv\.de/mediathek/videos/(?:crn/)?(?P<id>\d+)`]);
URL_REGEXS.set('www.bigflix.com', [String.raw`https?://(?:www\.)?bigflix\.com/.+/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.bigo.tv', [String.raw`https?://(?:www\.)?bigo\.tv/(?:[a-z]{2,}/)?(?P<id>[^/]+)`]);
URL_REGEXS.set('bigo.tv', [String.raw`https?://(?:www\.)?bigo\.tv/(?:[a-z]{2,}/)?(?P<id>[^/]+)`]);
URL_REGEXS.set('www.bild.de', [String.raw`https?://(?:www\.)?bild\.de/(?:[^/]+/)+(?P<display_id>[^/]+)-(?P<id>\d+)(?:,auto=true)?\.bild\.html`]);
URL_REGEXS.set('www.bilibili.com', [String.raw`https?://www\.bilibili\.com/video/[aAbB][vV](?P<id>[^/?#&]+)`, String.raw`https?://www\.bilibili\.com/v/[a-zA-Z]+\/[a-zA-Z]+`, String.raw`https?://(?:www\.)?bilibili\.com/audio/au(?P<id>\d+)`, String.raw`https?://(?:www\.)?bilibili\.com/audio/am(?P<id>\d+)`, String.raw`(?x)https?://www\.bilibili\.com/bangumi/play/(?P<id>(?:ss|ep)\d+)`, String.raw`https?://www\.bilibili\.com/bangumi/media/md(?P<id>\d+)`]);
URL_REGEXS.set('player.bilibili.com', [String.raw`https?://player\.bilibili\.com/player\.html\?.*?\baid=(?P<id>\d+)`]);
URL_REGEXS.set('space.bilibili.com', [String.raw`https?://space\.bilibili\.com/(?P<id>\d+)/audio`, String.raw`https?://space.bilibili\.com/(?P<mid>\d+)/channel/collectiondetail\?sid=(?P<sid>\d+)`, String.raw`https?://space\.bilibili\.com/(?P<id>\d+)(?P<video>/video)?/?(?:[?#]|$)`]);
URL_REGEXS.set('www.bilibili.tv', [String.raw`https?://(?:www\.)?bili(?:bili\.tv|intl\.com)/(?:[a-zA-Z]{2}/)?(play/(?P<season_id>\d+)/(?P<ep_id>\d+)|video/(?P<aid>\d+))`, String.raw`https?://(?:www\.)?bili(?:bili\.tv|intl\.com)/(?:[a-zA-Z]{2}/)?(?:play|media)/(?P<id>\d+)/?(?:[?#]|$)`]);
URL_REGEXS.set('www.biliintl.com', [String.raw`https?://(?:www\.)?bili(?:bili\.tv|intl\.com)/(?:[a-zA-Z]{2}/)?(play/(?P<season_id>\d+)/(?P<ep_id>\d+)|video/(?P<aid>\d+))`, String.raw`https?://(?:www\.)?bili(?:bili\.tv|intl\.com)/(?:[a-zA-Z]{2}/)?(?:play|media)/(?P<id>\d+)/?(?:[?#]|$)`]);
URL_REGEXS.set('bilibili.tv', [String.raw`https?://(?:www\.)?bili(?:bili\.tv|intl\.com)/(?:[a-zA-Z]{2}/)?(play/(?P<season_id>\d+)/(?P<ep_id>\d+)|video/(?P<aid>\d+))`]);
URL_REGEXS.set('live.bilibili.com', [String.raw`https?://live.bilibili.com/(?:blanc/)?(?P<id>\d+)`]);
URL_REGEXS.set('tv.biobiochile.cl', [String.raw`https?://(?:tv|www)\.biobiochile\.cl/(?:notas|noticias)/(?:[^/]+/)+(?P<id>[^/]+)\.shtml`]);
URL_REGEXS.set('www.biobiochile.cl', [String.raw`https?://(?:tv|www)\.biobiochile\.cl/(?:notas|noticias)/(?:[^/]+/)+(?P<id>[^/]+)\.shtml`]);
URL_REGEXS.set('www.biography.com', [String.raw`https?://(?:www\.)?biography\.com/video/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('biqle.ru', [String.raw`https?://(?:www\.)?biqle\.(?:com|org|ru)/watch/(?P<id>-?\d+_\d+)`]);
URL_REGEXS.set('biqle.org', [String.raw`https?://(?:www\.)?biqle\.(?:com|org|ru)/watch/(?P<id>-?\d+_\d+)`]);
URL_REGEXS.set('www.bitchute.com', [String.raw`https?://(?:www\.)?bitchute\.com/(?:video|embed|torrent/[^/]+)/(?P<id>[^/?#&]+)`, String.raw`https?://(?:www\.)?bitchute\.com/(?P<type>channel|playlist)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('bitwave.tv', [String.raw`https?://(?:www\.)?bitwave\.tv/(?P<user>\w+)/replay/(?P<id>\w+)/?$`, String.raw`https?://(?:www\.)?bitwave\.tv/(?P<id>\w+)/?$`]);
URL_REGEXS.set('us-lti.bbcollab.com', [String.raw`(?x)https?://(?P<region>[a-z-]+)\.bbcollab\.com/(?:collab/ui/session/playback/load|recording)/(?P<id>[^/]+)`]);
URL_REGEXS.set('us.bbcollab.com', [String.raw`(?x)https?://(?P<region>[a-z-]+)\.bbcollab\.com/(?:collab/ui/session/playback/load|recording)/(?P<id>[^/]+)`]);
URL_REGEXS.set('ca.bbcollab.com', [String.raw`(?x)https?://(?P<region>[a-z-]+)\.bbcollab\.com/(?:collab/ui/session/playback/load|recording)/(?P<id>[^/]+)`]);
URL_REGEXS.set('eu.bbcollab.com', [String.raw`(?x)https?://(?P<region>[a-z-]+)\.bbcollab\.com/(?:collab/ui/session/playback/load|recording)/(?P<id>[^/]+)`]);
URL_REGEXS.set('au.bbcollab.com', [String.raw`(?x)https?://(?P<region>[a-z-]+)\.bbcollab\.com/(?:collab/ui/session/playback/load|recording)/(?P<id>[^/]+)`]);
URL_REGEXS.set('bleacherreport.com', [String.raw`https?://(?:www\.)?bleacherreport\.com/articles/(?P<id>\d+)`, String.raw`https?://(?:www\.)?bleacherreport\.com/video_embed\?id=(?P<id>[0-9a-f-]{36}|\d{5})`]);
URL_REGEXS.set('www.blogger.com', [String.raw`https?://(?:www\.)?blogger\.com/video\.g\?token=(?P<id>.+)`]);
URL_REGEXS.set('www.bloomberg.com', [String.raw`https?://(?:www\.)?bloomberg\.com/(?:[^/]+/)*(?P<id>[^/?#]+)`]);
URL_REGEXS.set('union.bokecc.com', [String.raw`https?://union\.bokecc\.com/playvideo\.bo\?(?P<query>.*)`]);
URL_REGEXS.set('de.bongacams.com', [String.raw`https?://(?P<host>(?:[^/]+\.)?bongacams\d*\.(?:com|net))/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('cn.bongacams.com', [String.raw`https?://(?P<host>(?:[^/]+\.)?bongacams\d*\.(?:com|net))/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('de.bongacams.net', [String.raw`https?://(?P<host>(?:[^/]+\.)?bongacams\d*\.(?:com|net))/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('booyah.live', [String.raw`https?://booyah.live/clips/(?P<id>\d+)`]);
URL_REGEXS.set('www.bostonglobe.com', [String.raw`(?i)https?://(?:www\.)?bostonglobe\.com/.*/(?P<id>[^/]+)/\w+(?:\.html)?`]);
URL_REGEXS.set('mlssoccer.app.box.com', [String.raw`https?://(?:[^.]+\.)?app\.box\.com/s/(?P<shared_name>[^/]+)/file/(?P<id>\d+)`]);
URL_REGEXS.set('www.bpb.de', [String.raw`https?://(?:www\.)?bpb\.de/mediathek/(?P<id>[0-9]+)/`]);
URL_REGEXS.set('www.br.de', [String.raw`(?P<base_url>https?://(?:www\.)?br(?:-klassik)?\.de)/(?:[a-z0-9\-_]+/)+(?P<id>[a-z0-9\-_]+)\.html`, String.raw`https?://(?:www\.)?br\.de/mediathek//?video/(?:[^/?&#]+?-)?(?P<id>av:[0-9a-f]{24})`]);
URL_REGEXS.set('www.br-klassik.de', [String.raw`(?P<base_url>https?://(?:www\.)?br(?:-klassik)?\.de)/(?:[a-z0-9\-_]+/)+(?P<id>[a-z0-9\-_]+)\.html`]);
URL_REGEXS.set('www.bravotv.com', [String.raw`https?://(?:www\.)?(?P<req_id>bravotv|oxygen)\.com/(?:[^/]+/)+(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.oxygen.com', [String.raw`https?://(?:www\.)?(?P<req_id>bravotv|oxygen)\.com/(?:[^/]+/)+(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.break.com', [String.raw`https?://(?:www\.)?break\.com/video/(?P<display_id>[^/]+?)(?:-(?P<id>\d+))?(?:[/?#&]|$)`]);
URL_REGEXS.set('www.breitbart.com', [String.raw`https?:\/\/(?:www\.)breitbart.com/videos/v/(?P<id>[^/]+)`]);
URL_REGEXS.set('c.brightcove.com', [String.raw`(?:https?://.*brightcove\.com/(services|viewer).*?\?|brightcove:)(?P<query>.*)`]);
URL_REGEXS.set('link.brightcove.com', [String.raw`(?:https?://.*brightcove\.com/(services|viewer).*?\?|brightcove:)(?P<query>.*)`]);
URL_REGEXS.set('players.brightcove.net', [String.raw`https?://players\.brightcove\.net/(?P<account_id>\d+)/(?P<player_id>[^/]+)_(?P<embed>[^/]+)/index\.html\?.*(?P<content_type>video|playlist)Id=(?P<video_id>\d+|ref:[^&]+)`]);
URL_REGEXS.set('www.bt.no', [String.raw`https?://(?:www\.)?bt\.no/(?:[^/]+/)+(?P<id>[^/]+)-\d+\.html`, String.raw`https?://(?:www\.)?bt\.no/spesial/vestlendingen/#!/(?P<id>\d+)`, String.raw`(?x)(?:https?://(?:www\.)?(?P<host>tv.vg.no|vgtv.no|bt.no/tv|aftenbladet.no/tv|fvn.no/fvntv|aftenposten.no/webtv|ap.vgtv.no/webtv|tv.aftonbladet.se|tv.aftonbladet.se/abtv|www.aftonbladet.se/tv)/?(?:(?:\#!/)?(?:video|live)/|embed?.*id=|a(?:rticles)?/)|(?P<appname>vgtv|bttv|satv|fvntv|aptv|abtv):)(?P<id>\d+)`]);
URL_REGEXS.set('www.bundesliga.com', [String.raw`https?://(?:www\.)?bundesliga\.com/[a-z]{2}/bundesliga/videos(?:/[^?]+)?\?vid=(?P<id>[a-zA-Z0-9]{8})`]);
URL_REGEXS.set('uk.businessinsider.com', [String.raw`https?://(?:[^/]+\.)?businessinsider\.(?:com|nl)/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.businessinsider.nl', [String.raw`https?://(?:[^/]+\.)?businessinsider\.(?:com|nl)/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.businessinsider.com', [String.raw`https?://(?:[^/]+\.)?businessinsider\.(?:com|nl)/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.buzzfeed.com', [String.raw`https?://(?:www\.)?buzzfeed\.com/[^?#]*?/(?P<id>[^?#]+)`]);
URL_REGEXS.set('www.byutv.org', [String.raw`https?://(?:www\.)?byutv\.org/(?:watch|player)/(?!event/)(?P<id>[0-9a-f-]+)(?:/(?P<display_id>[^/?#&]+))?`]);
URL_REGEXS.set('cableav.tv', [String.raw`https://cableav\.tv/(?P<id>[a-zA-Z0-9]+)`]);
URL_REGEXS.set('www.callin.com', [String.raw`https?://(?:www\.)?callin\.com/(episode)/(?P<id>[-a-zA-Z]+)`]);
URL_REGEXS.set('cwwp2.dot.ca.gov', [String.raw`https?://(?:[^/]+\.)?ca\.gov/vm/loc/[^/]+/(?P<id>[a-z0-9_]+)\.htm`]);
URL_REGEXS.set('www.cam4.com', [String.raw`https?://(?:[^/]+\.)?cam4\.com/(?P<id>[a-z0-9_]+)`]);
URL_REGEXS.set('www.camdemy.com', [String.raw`https?://(?:www\.)?camdemy\.com/media/(?P<id>\d+)`, String.raw`https?://(?:www\.)?camdemy\.com/folder/(?P<id>\d+)`]);
URL_REGEXS.set('www.cammodels.com', [String.raw`https?://(?:www\.)?cammodels\.com/cam/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.camsoda.com', [String.raw`https?://www\.camsoda\.com/(?P<id>[\w-]+)`]);
URL_REGEXS.set('camwithher.tv', [String.raw`https?://(?:www\.)?camwithher\.tv/view_video\.php\?.*\bviewkey=(?P<id>\w+)`]);
URL_REGEXS.set('www.canalalpha.ch', [String.raw`https?://(?:www\.)?canalalpha\.ch/play/[^/]+/[^/]+/(?P<id>\d+)/?.*`]);
URL_REGEXS.set('www.canalc2.tv', [String.raw`https?://(?:(?:www\.)?canalc2\.tv/video/|archives-canalc2\.u-strasbg\.fr/video\.asp\?.*\bidVideo=)(?P<id>\d+)`]);
URL_REGEXS.set('archives-canalc2.u-strasbg.fr', [String.raw`https?://(?:(?:www\.)?canalc2\.tv/video/|archives-canalc2\.u-strasbg\.fr/video\.asp\?.*\bidVideo=)(?P<id>\d+)`]);
URL_REGEXS.set('www.mycanal.fr', [String.raw`https?://(?:www\.)?(?P<site>mycanal|piwiplus)\.fr/(?:[^/]+/)*(?P<display_id>[^?/]+)(?:\.html\?.*\bvid=|/p/)(?P<id>\d+)`]);
URL_REGEXS.set('www.piwiplus.fr', [String.raw`https?://(?:www\.)?(?P<site>mycanal|piwiplus)\.fr/(?:[^/]+/)*(?P<display_id>[^?/]+)(?:\.html\?.*\bvid=|/p/)(?P<id>\d+)`]);
URL_REGEXS.set('mediazone.vrt.be', [String.raw`https?://mediazone\.vrt\.be/api/v1/(?P<site_id>canvas|een|ketnet|vrt(?:video|nieuws)|sporza|dako)/assets/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.canvas.be', [String.raw`https?://(?:www\.)?(?P<site_id>canvas|een)\.be/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.een.be', [String.raw`https?://(?:www\.)?(?P<site_id>canvas|een)\.be/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('video1.carambatv.ru', [String.raw`(?:carambatv:|https?://video1\.carambatv\.ru/v/)(?P<id>\d+)`]);
URL_REGEXS.set('carambatv.ru', [String.raw`https?://carambatv\.ru/(?:[^/]+/)+(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.cartoonnetwork.com', [String.raw`https?://(?:www\.)?cartoonnetwork\.com/video/(?:[^/]+/)+(?P<id>[^/?#]+)-(?:clip|episode)\.html`]);
URL_REGEXS.set('www.cbc.ca', [String.raw`https?://(?:www\.)?cbc\.ca/(?!player/)(?:[^/]+/)+(?P<id>[^/?#]+)`, String.raw`(?:cbcplayer:|https?://(?:www\.)?cbc\.ca/(?:player/play/|i/caffeine/syndicate/\?mediaId=))(?P<id>\d+)`]);
URL_REGEXS.set('www.cbs.com', [String.raw`(?x)(?:cbs:|https?://(?:www\.)?(?:cbs\.com/(?:shows|movies)/(?:video|[^/]+/video|[^/]+)/|colbertlateshow\.com/(?:video|podcasts)/))(?P<id>[\w-]+)`]);
URL_REGEXS.set('colbertlateshow.com', [String.raw`(?x)(?:cbs:|https?://(?:www\.)?(?:cbs\.com/(?:shows|movies)/(?:video|[^/]+/video|[^/]+)/|colbertlateshow\.com/(?:video|podcasts)/))(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.colbertlateshow.com', [String.raw`(?x)(?:cbs:|https?://(?:www\.)?(?:cbs\.com/(?:shows|movies)/(?:video|[^/]+/video|[^/]+)/|colbertlateshow\.com/(?:video|podcasts)/))(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.cnet.com', [String.raw`https?://(?:www\.)?(?P<site>cnet|zdnet)\.com/(?:videos|video(?:/share)?)/(?P<id>[^/?]+)`]);
URL_REGEXS.set('www.zdnet.com', [String.raw`https?://(?:www\.)?(?P<site>cnet|zdnet)\.com/(?:videos|video(?:/share)?)/(?P<id>[^/?]+)`]);
URL_REGEXS.set('newyork.cbslocal.com', [String.raw`https?://[a-z]+\.cbslocal\.com/video/(?P<id>\d+)`]);
URL_REGEXS.set('losangeles.cbslocal.com', [String.raw`https?://[a-z]+\.cbslocal\.com/\d+/\d+/\d+/(?P<id>[0-9a-z-]+)`]);
URL_REGEXS.set('cleveland.cbslocal.com', [String.raw`https?://[a-z]+\.cbslocal\.com/\d+/\d+/\d+/(?P<id>[0-9a-z-]+)`]);
URL_REGEXS.set('www.cbsnews.com', [String.raw`https?://(?:www\.)?cbsnews\.com/(?:news|video)/(?P<id>[\da-z_-]+)`, String.raw`https?://(?:www\.)?cbsnews\.com/embed/video[^#]*#(?P<id>.+)`, String.raw`https?://(?:www\.)?cbsnews\.com/live/video/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.cbssports.com', [String.raw`https?://(?:www\.)?cbssports\.com/[^/]+/video/(?P<id>[^/?#&]+)`, String.raw`(?ix)https?://(?:(?:www\.)?cbs|embed\.247)sports\.com/player/embed.+?(?:ids%3D(?P<id>[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12})|pcid%3D(?P<pcid>\d+))`]);
URL_REGEXS.set('embed.247sports.com', [String.raw`(?ix)https?://(?:(?:www\.)?cbs|embed\.247)sports\.com/player/embed.+?(?:ids%3D(?P<id>[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12})|pcid%3D(?P<pcid>\d+))`]);
URL_REGEXS.set('www.ccma.cat', [String.raw`https?://(?:www\.)?ccma\.cat/(?:[^/]+/)*?(?P<type>video|audio)/(?P<id>\d+)`]);
URL_REGEXS.set('sports.cntv.cn', [String.raw`https?://(?:(?:[^/]+)\.(?:cntv|cctv)\.(?:com|cn)|(?:www\.)?ncpa-classic\.com)/(?:[^/]+/)*?(?P<id>[^/?#&]+?)(?:/index)?(?:\.s?html|[?#&]|$)`]);
URL_REGEXS.set('tv.cctv.com', [String.raw`https?://(?:(?:[^/]+)\.(?:cntv|cctv)\.(?:com|cn)|(?:www\.)?ncpa-classic\.com)/(?:[^/]+/)*?(?P<id>[^/?#&]+?)(?:/index)?(?:\.s?html|[?#&]|$)`]);
URL_REGEXS.set('english.cntv.cn', [String.raw`https?://(?:(?:[^/]+)\.(?:cntv|cctv)\.(?:com|cn)|(?:www\.)?ncpa-classic\.com)/(?:[^/]+/)*?(?P<id>[^/?#&]+?)(?:/index)?(?:\.s?html|[?#&]|$)`]);
URL_REGEXS.set('cctv.cntv.cn', [String.raw`https?://(?:(?:[^/]+)\.(?:cntv|cctv)\.(?:com|cn)|(?:www\.)?ncpa-classic\.com)/(?:[^/]+/)*?(?P<id>[^/?#&]+?)(?:/index)?(?:\.s?html|[?#&]|$)`]);
URL_REGEXS.set('www.ncpa-classic.com', [String.raw`https?://(?:(?:[^/]+)\.(?:cntv|cctv)\.(?:com|cn)|(?:www\.)?ncpa-classic\.com)/(?:[^/]+/)*?(?P<id>[^/?#&]+?)(?:/index)?(?:\.s?html|[?#&]|$)`]);
URL_REGEXS.set('ent.cntv.cn', [String.raw`https?://(?:(?:[^/]+)\.(?:cntv|cctv)\.(?:com|cn)|(?:www\.)?ncpa-classic\.com)/(?:[^/]+/)*?(?P<id>[^/?#&]+?)(?:/index)?(?:\.s?html|[?#&]|$)`]);
URL_REGEXS.set('tv.cntv.cn', [String.raw`https?://(?:(?:[^/]+)\.(?:cntv|cctv)\.(?:com|cn)|(?:www\.)?ncpa-classic\.com)/(?:[^/]+/)*?(?P<id>[^/?#&]+?)(?:/index)?(?:\.s?html|[?#&]|$)`]);
URL_REGEXS.set('www.cda.pl', [String.raw`https?://(?:(?:www\.)?cda\.pl/video|ebd\.cda\.pl/[0-9]+x[0-9]+)/(?P<id>[0-9a-z]+)`]);
URL_REGEXS.set('ebd.cda.pl', [String.raw`https?://(?:(?:www\.)?cda\.pl/video|ebd\.cda\.pl/[0-9]+x[0-9]+)/(?P<id>[0-9a-z]+)`]);
URL_REGEXS.set('cellebrite.com', [String.raw`https?://cellebrite\.com/(?:\w+)?/(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.ceskatelevize.cz', [String.raw`https?://(?:www\.)?ceskatelevize\.cz/(?:ivysilani|porady|zive)/(?:[^/?#&]+/)*(?P<id>[^/#?]+)`]);
URL_REGEXS.set('news.cgtn.com', [String.raw`https?://news\.cgtn\.com/news/[0-9]{4}-[0-9]{2}-[0-9]{2}/[a-zA-Z0-9-]+-(?P<id>[a-zA-Z0-9-]+)/index\.html`]);
URL_REGEXS.set('channel9.msdn.com', [String.raw`https?://(?:www\.)?(?:channel9\.msdn\.com|s\.ch9\.ms)/(?P<contentpath>.+?)(?P<rss>/RSS)?/?(?:[?#&]|$)`]);
URL_REGEXS.set('charlierose.com', [String.raw`https?://(?:www\.)?charlierose\.com/(?:video|episode)(?:s|/player)/(?P<id>\d+)`]);
URL_REGEXS.set('www.chaturbate.com', [String.raw`https?://(?:[^/]+\.)?chaturbate\.com/(?:fullvideo/?\?.*?\bb=)?(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('chaturbate.com', [String.raw`https?://(?:[^/]+\.)?chaturbate\.com/(?:fullvideo/?\?.*?\bb=)?(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('en.chaturbate.com', [String.raw`https?://(?:[^/]+\.)?chaturbate\.com/(?:fullvideo/?\?.*?\bb=)?(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('www.chilloutzone.net', [String.raw`https?://(?:www\.)?chilloutzone\.net/video/(?P<id>[\w|-]+)\.html`]);
URL_REGEXS.set('chingari.io', [String.raw`https?://(?:www\.)?chingari\.io/share/post\?id=(?P<id>[^&/#?]+)`, String.raw`https?://(?:www\.)?chingari\.io/(?!share/post)(?P<id>[^/?]+)`]);
URL_REGEXS.set('chirb.it', [String.raw`https?://(?:www\.)?chirb\.it/(?:(?:wp|pl)/|fb_chirbit_player\.swf\?key=)?(?P<id>[\da-zA-Z]+)`]);
URL_REGEXS.set('chirbit.com', [String.raw`https?://(?:www\.)?chirbit\.com/(?:rss/)?(?P<id>[^/]+)`]);
URL_REGEXS.set('www.cielotv.it', [String.raw`https?://(?:www\.)?cielotv\.it/video/(?P<id>[^.]+)\.html`]);
URL_REGEXS.set('player.cinchcast.com', [String.raw`https?://player\.cinchcast\.com/.*?(?:assetId|show_id)=(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.cinemax.com', [String.raw`https?://(?:www\.)?cinemax\.com/(?P<path>[^/]+/video/[0-9a-z-]+-(?P<id>\d+))`]);
URL_REGEXS.set('www.cinetecamilano.it', [String.raw`https?://(?:www\.)?cinetecamilano\.it/film/(?P<id>\d+)`]);
URL_REGEXS.set('ciscolive.cisco.com', [String.raw`https?://(?:www\.)?ciscolive(?:\.cisco)?\.com/(?:global/)?on-demand-library(?:\.html|/)`, String.raw`https?://(?:www\.)?ciscolive(?:\.cisco)?\.com/[^#]*#/session/(?P<id>[^/?&]+)`]);
URL_REGEXS.set('www.ciscolive.com', [String.raw`https?://(?:www\.)?ciscolive(?:\.cisco)?\.com/(?:global/)?on-demand-library(?:\.html|/)`, String.raw`https?://(?:www\.)?ciscolive(?:\.cisco)?\.com/[^#]*#/session/(?P<id>[^/?&]+)`]);
URL_REGEXS.set('demosubdomain.webex.com', [String.raw`(?x)(?P<url>https?://(?P<subdomain>[^/#?]*)\.webex\.com/(?:(?P<siteurl_1>[^/#?]*)/(?:ldr|lsr).php\?(?:[^#]*&)*RCID=(?P<rcid>[0-9a-f]{32})|(?:recordingservice|webappng)/sites/(?P<siteurl_2>[^/#?]*)/recording/(?:playback/|play/)?(?P<id>[0-9a-f]{32})))`]);
URL_REGEXS.set('cjsw.com', [String.raw`https?://(?:www\.)?cjsw\.com/program/(?P<program>[^/]+)/episode/(?P<id>\d+)`]);
URL_REGEXS.set('www.cliphunter.com', [String.raw`(?x)https?://(?:www\.)?cliphunter\.com/w/(?P<id>[0-9]+)/(?P<seo>.+?)(?:$|[#\?])`]);
URL_REGEXS.set('www.clippituser.tv', [String.raw`https?://(?:www\.)?clippituser\.tv/c/(?P<id>[a-z]+)`]);
URL_REGEXS.set('www.clip.rs', [String.raw`https?://(?:www\.)?clip\.rs/(?P<id>[^/]+)/\d+`]);
URL_REGEXS.set('www.clipsyndicate.com', [String.raw`https?://(?:chic|www)\.clipsyndicate\.com/video/play(list/\d+)?/(?P<id>\d+)`]);
URL_REGEXS.set('chic.clipsyndicate.com', [String.raw`https?://(?:chic|www)\.clipsyndicate\.com/video/play(list/\d+)?/(?P<id>\d+)`]);
URL_REGEXS.set('closertotruth.com', [String.raw`https?://(?:www\.)?closertotruth\.com/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('embed.cloudflarestream.com', [String.raw`(?x)https?://(?:(?:watch\.)?(?:cloudflarestream\.com|(?:videodelivery|bytehighway)\.net)/|embed\.(?:cloudflarestream\.com|(?:videodelivery|bytehighway)\.net)/embed/[^/]+\.js\?.*?\bvideo=)(?P<id>[\da-f]{32}|[\w-]+\.[\w-]+\.[\w-]+)`]);
URL_REGEXS.set('watch.cloudflarestream.com', [String.raw`(?x)https?://(?:(?:watch\.)?(?:cloudflarestream\.com|(?:videodelivery|bytehighway)\.net)/|embed\.(?:cloudflarestream\.com|(?:videodelivery|bytehighway)\.net)/embed/[^/]+\.js\?.*?\bvideo=)(?P<id>[\da-f]{32}|[\w-]+\.[\w-]+\.[\w-]+)`]);
URL_REGEXS.set('cloudflarestream.com', [String.raw`(?x)https?://(?:(?:watch\.)?(?:cloudflarestream\.com|(?:videodelivery|bytehighway)\.net)/|embed\.(?:cloudflarestream\.com|(?:videodelivery|bytehighway)\.net)/embed/[^/]+\.js\?.*?\bvideo=)(?P<id>[\da-f]{32}|[\w-]+\.[\w-]+\.[\w-]+)`]);
URL_REGEXS.set('embed.videodelivery.net', [String.raw`(?x)https?://(?:(?:watch\.)?(?:cloudflarestream\.com|(?:videodelivery|bytehighway)\.net)/|embed\.(?:cloudflarestream\.com|(?:videodelivery|bytehighway)\.net)/embed/[^/]+\.js\?.*?\bvideo=)(?P<id>[\da-f]{32}|[\w-]+\.[\w-]+\.[\w-]+)`]);
URL_REGEXS.set('www.cloudy.ec', [String.raw`https?://(?:www\.)?cloudy\.ec/(?:v/|embed\.php\?.*?\bid=)(?P<id>[A-Za-z0-9]+)`]);
URL_REGEXS.set('www.clubic.com', [String.raw`https?://(?:www\.)?clubic\.com/video/(?:[^/]+/)*video.*-(?P<id>[0-9]+)\.html`]);
URL_REGEXS.set('clyp.it', [String.raw`https?://(?:www\.)?clyp\.it/(?P<id>[a-z0-9]+)`]);
URL_REGEXS.set('www.cmt.com', [String.raw`https?://(?:www\.)?cmt\.com/(?:videos|shows|(?:full-)?episodes|video-clips)/(?P<id>[^/]+)`]);
URL_REGEXS.set('video.cnbc.com', [String.raw`https?://video\.cnbc\.com/gallery/\?video=(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.cnbc.com', [String.raw`https?://(?:www\.)?cnbc\.com(?P<path>/video/(?:[^/]+/)+(?P<id>[^./?#&]+)\.html)`]);
URL_REGEXS.set('edition.cnn.com', [String.raw`(?x)https?://(?:(?P<sub_domain>edition|www|money)\.)?cnn\.com/(?:video/(?:data/.+?|\?)/)?videos?/(?P<path>.+?/(?P<title>[^/]+?)(?:\.(?:[a-z\-]+)|(?=&)))`]);
URL_REGEXS.set('www.cnn.com', [String.raw`(?x)https?://(?:(?P<sub_domain>edition|www|money)\.)?cnn\.com/(?:video/(?:data/.+?|\?)/)?videos?/(?P<path>.+?/(?P<title>[^/]+?)(?:\.(?:[a-z\-]+)|(?=&)))`, String.raw`https?://(?:(?:edition|www)\.)?cnn\.com/(?!videos?/)`]);
URL_REGEXS.set('money.cnn.com', [String.raw`(?x)https?://(?:(?P<sub_domain>edition|www|money)\.)?cnn\.com/(?:video/(?:data/.+?|\?)/)?videos?/(?P<path>.+?/(?P<title>[^/]+?)(?:\.(?:[a-z\-]+)|(?=&)))`]);
URL_REGEXS.set('cnn.com', [String.raw`(?x)https?://(?:(?P<sub_domain>edition|www|money)\.)?cnn\.com/(?:video/(?:data/.+?|\?)/)?videos?/(?P<path>.+?/(?P<title>[^/]+?)(?:\.(?:[a-z\-]+)|(?=&)))`]);
URL_REGEXS.set('reliablesources.blogs.cnn.com', [String.raw`https?://[^\.]+\.blogs\.cnn\.com/.+`]);
URL_REGEXS.set('www.cnnindonesia.com', [String.raw`https?://www\.cnnindonesia\.com/[\w-]+/(?P<upload_date>\d{8})\d+-\d+-(?P<id>\d+)/(?P<display_id>[\w-]+)`]);
URL_REGEXS.set('www.cc.com', [String.raw`https?://(?:www\.)?cc\.com/(?:episodes|video(?:-clips)?|collection-playlist)/(?P<id>[0-9a-z]{6})`]);
URL_REGEXS.set('www.comedycentral.tv', [String.raw`https?://(?:www\.)?comedycentral\.tv/folgen/(?P<id>[0-9a-z]{6})`]);
URL_REGEXS.set('video.wired.com', [String.raw`(?x)https?://(?:video|www|player(?:-backend)?)\.(?:allure|architecturaldigest|arstechnica|bonappetit|brides|cnevids|cntraveler|details|epicurious|glamour|golfdigest|gq|newyorker|self|teenvogue|vanityfair|vogue|wired|wmagazine)\.com/(?:(?:embed(?:js)?|(?:script|inline)/video)/(?P<id>[0-9a-f]{24})(?:/(?P<player_id>[0-9a-f]{24}))?(?:.+?\btarget=(?P<target>[^&]+))?|(?P<type>watch|series|video)/(?P<display_id>[^/?#]+))`]);
URL_REGEXS.set('video.gq.com', [String.raw`(?x)https?://(?:video|www|player(?:-backend)?)\.(?:allure|architecturaldigest|arstechnica|bonappetit|brides|cnevids|cntraveler|details|epicurious|glamour|golfdigest|gq|newyorker|self|teenvogue|vanityfair|vogue|wired|wmagazine)\.com/(?:(?:embed(?:js)?|(?:script|inline)/video)/(?P<id>[0-9a-f]{24})(?:/(?P<player_id>[0-9a-f]{24}))?(?:.+?\btarget=(?P<target>[^&]+))?|(?P<type>watch|series|video)/(?P<display_id>[^/?#]+))`]);
URL_REGEXS.set('player.cnevids.com', [String.raw`(?x)https?://(?:video|www|player(?:-backend)?)\.(?:allure|architecturaldigest|arstechnica|bonappetit|brides|cnevids|cntraveler|details|epicurious|glamour|golfdigest|gq|newyorker|self|teenvogue|vanityfair|vogue|wired|wmagazine)\.com/(?:(?:embed(?:js)?|(?:script|inline)/video)/(?P<id>[0-9a-f]{24})(?:/(?P<player_id>[0-9a-f]{24}))?(?:.+?\btarget=(?P<target>[^&]+))?|(?P<type>watch|series|video)/(?P<display_id>[^/?#]+))`]);
URL_REGEXS.set('player-backend.cnevids.com', [String.raw`(?x)https?://(?:video|www|player(?:-backend)?)\.(?:allure|architecturaldigest|arstechnica|bonappetit|brides|cnevids|cntraveler|details|epicurious|glamour|golfdigest|gq|newyorker|self|teenvogue|vanityfair|vogue|wired|wmagazine)\.com/(?:(?:embed(?:js)?|(?:script|inline)/video)/(?P<id>[0-9a-f]{24})(?:/(?P<player_id>[0-9a-f]{24}))?(?:.+?\btarget=(?P<target>[^&]+))?|(?P<type>watch|series|video)/(?P<display_id>[^/?#]+))`]);
URL_REGEXS.set('www.contv.com', [String.raw`https?://(?:www\.)?contv\.com/details-movie/(?P<id>[^/]+)`]);
URL_REGEXS.set('watch.cookingchanneltv.com', [String.raw`https?://(?:watch\.)?cookingchanneltv\.com/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.hgtv.ca', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:globaltv|etcanada|seriesplus|wnetwork|ytv)\.com|(?:hgtv|foodnetwork|slice|history|showcase|bigbrothercanada|abcspark|disney(?:channel|lachaine))\.ca)/(?:[^/]+/)*(?:video\.html\?.*?\bv=|videos?/(?:[^/]+/)*(?:[a-z0-9-]+-)?)(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|(?:[A-Z]{4})?\d{12,20})`]);
URL_REGEXS.set('www.foodnetwork.ca', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:globaltv|etcanada|seriesplus|wnetwork|ytv)\.com|(?:hgtv|foodnetwork|slice|history|showcase|bigbrothercanada|abcspark|disney(?:channel|lachaine))\.ca)/(?:[^/]+/)*(?:video\.html\?.*?\bv=|videos?/(?:[^/]+/)*(?:[a-z0-9-]+-)?)(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|(?:[A-Z]{4})?\d{12,20})`]);
URL_REGEXS.set('etcanada.com', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:globaltv|etcanada|seriesplus|wnetwork|ytv)\.com|(?:hgtv|foodnetwork|slice|history|showcase|bigbrothercanada|abcspark|disney(?:channel|lachaine))\.ca)/(?:[^/]+/)*(?:video\.html\?.*?\bv=|videos?/(?:[^/]+/)*(?:[a-z0-9-]+-)?)(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|(?:[A-Z]{4})?\d{12,20})`]);
URL_REGEXS.set('www.history.ca', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:globaltv|etcanada|seriesplus|wnetwork|ytv)\.com|(?:hgtv|foodnetwork|slice|history|showcase|bigbrothercanada|abcspark|disney(?:channel|lachaine))\.ca)/(?:[^/]+/)*(?:video\.html\?.*?\bv=|videos?/(?:[^/]+/)*(?:[a-z0-9-]+-)?)(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|(?:[A-Z]{4})?\d{12,20})`]);
URL_REGEXS.set('www.showcase.ca', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:globaltv|etcanada|seriesplus|wnetwork|ytv)\.com|(?:hgtv|foodnetwork|slice|history|showcase|bigbrothercanada|abcspark|disney(?:channel|lachaine))\.ca)/(?:[^/]+/)*(?:video\.html\?.*?\bv=|videos?/(?:[^/]+/)*(?:[a-z0-9-]+-)?)(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|(?:[A-Z]{4})?\d{12,20})`]);
URL_REGEXS.set('www.bigbrothercanada.ca', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:globaltv|etcanada|seriesplus|wnetwork|ytv)\.com|(?:hgtv|foodnetwork|slice|history|showcase|bigbrothercanada|abcspark|disney(?:channel|lachaine))\.ca)/(?:[^/]+/)*(?:video\.html\?.*?\bv=|videos?/(?:[^/]+/)*(?:[a-z0-9-]+-)?)(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|(?:[A-Z]{4})?\d{12,20})`]);
URL_REGEXS.set('www.seriesplus.com', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:globaltv|etcanada|seriesplus|wnetwork|ytv)\.com|(?:hgtv|foodnetwork|slice|history|showcase|bigbrothercanada|abcspark|disney(?:channel|lachaine))\.ca)/(?:[^/]+/)*(?:video\.html\?.*?\bv=|videos?/(?:[^/]+/)*(?:[a-z0-9-]+-)?)(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|(?:[A-Z]{4})?\d{12,20})`]);
URL_REGEXS.set('www.disneychannel.ca', [String.raw`(?x)https?://(?:www\.)?(?P<domain>(?:globaltv|etcanada|seriesplus|wnetwork|ytv)\.com|(?:hgtv|foodnetwork|slice|history|showcase|bigbrothercanada|abcspark|disney(?:channel|lachaine))\.ca)/(?:[^/]+/)*(?:video\.html\?.*?\bv=|videos?/(?:[^/]+/)*(?:[a-z0-9-]+-)?)(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|(?:[A-Z]{4})?\d{12,20})`]);
URL_REGEXS.set('coub.com', [String.raw`(?:coub:|https?://(?:coub\.com/(?:view|embed|coubs)/|c-cdn\.coub\.com/fb-player\.swf\?.*\bcoub(?:ID|id)=))(?P<id>[\da-z]+)`]);
URL_REGEXS.set('c-cdn.coub.com', [String.raw`(?:coub:|https?://(?:coub\.com/(?:view|embed|coubs)/|c-cdn\.coub\.com/fb-player\.swf\?.*\bcoub(?:ID|id)=))(?P<id>[\da-z]+)`]);
URL_REGEXS.set('cozy.tv', [String.raw`https?://(?:www\.)?cozy\.tv/(?P<uploader>[^/]+)/replays/(?P<id>[^/$#&?]+)`]);
URL_REGEXS.set('www.cpac.ca', [String.raw`https?://(?:www\.)?cpac\.ca/(?P<fr>l-)?episode\?id=(?P<id>[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12})`, String.raw`(?i)https?://(?:www\.)?cpac\.ca/(?:program|search|(?P<fr>emission|rechercher))\?(?:[^&]+&)*?(?P<id>(?:id=\d+|programId=\d+|key=[^&]+))`]);
URL_REGEXS.set('www.cracked.com', [String.raw`https?://(?:www\.)?cracked\.com/video_(?P<id>\d+)_[\da-z-]+\.html`]);
URL_REGEXS.set('www.crackle.com', [String.raw`(?:crackle:|https?://(?:(?:www|m)\.)?(?:sony)?crackle\.com/(?:playlist/\d+/|(?:[^/]+/)+))(?P<id>\d+)`]);
URL_REGEXS.set('www.sonycrackle.com', [String.raw`(?:crackle:|https?://(?:(?:www|m)\.)?(?:sony)?crackle\.com/(?:playlist/\d+/|(?:[^/]+/)+))(?P<id>\d+)`]);
URL_REGEXS.set('www.craftsy.com', [String.raw`https?://www.craftsy.com/class/(?P<id>[a-z0-9_-]+)/`]);
URL_REGEXS.set('embed.crooksandliars.com', [String.raw`https?://embed\.crooksandliars\.com/(?:embed|v)/(?P<id>[A-Za-z0-9]+)`]);
URL_REGEXS.set('crowdbunker.com', [String.raw`https?://(?:www\.)?crowdbunker\.com/v/(?P<id>[^/?#$&]+)`, String.raw`https?://(?:www\.)?crowdbunker\.com/@(?P<id>[^/?#$&]+)`]);
URL_REGEXS.set('www.crunchyroll.com', [String.raw`(?x)https?://(?:beta|www)\.crunchyroll\.com/(?P<lang>(?:\w{2}(?:-\w{2})?/)?)watch/(?P<id>\w+)(?:/(?P<display_id>[\w-]+))?/?(?:[?#]|$)`, String.raw`(?x)https?://(?:beta|www)\.crunchyroll\.com/(?P<lang>(?:\w{2}(?:-\w{2})?/)?)series/(?P<id>\w+)(?:/(?P<display_id>[\w-]+))?/?(?:[?#]|$)`]);
URL_REGEXS.set('beta.crunchyroll.com', [String.raw`(?x)https?://(?:beta|www)\.crunchyroll\.com/(?P<lang>(?:\w{2}(?:-\w{2})?/)?)watch/(?P<id>\w+)(?:/(?P<display_id>[\w-]+))?/?(?:[?#]|$)`, String.raw`(?x)https?://(?:beta|www)\.crunchyroll\.com/(?P<lang>(?:\w{2}(?:-\w{2})?/)?)series/(?P<id>\w+)(?:/(?P<display_id>[\w-]+))?/?(?:[?#]|$)`]);
URL_REGEXS.set('www.c-span.org', [String.raw`https?://(?:www\.)?c-span\.org/video/\?(?P<id>[0-9a-f]+)`, String.raw`https?://(?:www\.)?c-span\.org/congress/`]);
URL_REGEXS.set('news.cts.com.tw', [String.raw`https?://news\.cts\.com\.tw/[a-z]+/[a-z]+/\d+/(?P<id>\d+)\.html`]);
URL_REGEXS.set('www.ctvnews.ca', [String.raw`https?://(?:.+?\.)?ctvnews\.ca/(?:video\?(?:clip|playlist|bin)Id=|.*?)(?P<id>[0-9.]+)`]);
URL_REGEXS.set('vancouverisland.ctvnews.ca', [String.raw`https?://(?:.+?\.)?ctvnews\.ca/(?:video\?(?:clip|playlist|bin)Id=|.*?)(?P<id>[0-9.]+)`]);
URL_REGEXS.set('cu.ntv.co.jp', [String.raw`https?://cu\.ntv\.co\.jp/(?!program)(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('www.cultureunplugged.com', [String.raw`https?://(?:www\.)?cultureunplugged\.com/documentary/watch-online/play/(?P<id>\d+)(?:/(?P<display_id>[^/]+))?`]);
URL_REGEXS.set('app.curiositystream.com', [String.raw`https?://(?:app\.)?curiositystream\.com/video/(?P<id>\d+)`]);
URL_REGEXS.set('curiositystream.com', [String.raw`https?://(?:app\.)?curiositystream\.com/collections/(?P<id>\d+)`, String.raw`https?://(?:app\.)?curiositystream\.com/(?:series|collection)/(?P<id>\d+)`]);
URL_REGEXS.set('cwtv.com', [String.raw`https?://(?:www\.)?cw(?:tv(?:pr)?|seed)\.com/(?:shows/)?(?:[^/]+/)+[^?]*\?.*\b(?:play|watch)=(?P<id>[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})`]);
URL_REGEXS.set('www.cwseed.com', [String.raw`https?://(?:www\.)?cw(?:tv(?:pr)?|seed)\.com/(?:shows/)?(?:[^/]+/)+[^?]*\?.*\b(?:play|watch)=(?P<id>[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})`]);
URL_REGEXS.set('cwtvpr.com', [String.raw`https?://(?:www\.)?cw(?:tv(?:pr)?|seed)\.com/(?:shows/)?(?:[^/]+/)+[^?]*\?.*\b(?:play|watch)=(?P<id>[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})`]);
URL_REGEXS.set('app.cybrary.it', [String.raw`https?://app.cybrary.it/immersive/(?P<enrollment>[0-9]+)/activity/(?P<id>[0-9]+)`, String.raw`https://app.cybrary.it/browse/course/(?P<id>[\w-]+)/?(?:$|[#?])`]);
URL_REGEXS.set('daftsex.com', [String.raw`https?://(?:www\.)?daftsex\.com/watch/(?P<id>-?\d+_\d+)`]);
URL_REGEXS.set('dagelijksekost.een.be', [String.raw`https?://dagelijksekost\.een\.be/gerechten/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.dailymail.co.uk', [String.raw`https?://(?:www\.)?dailymail\.co\.uk/(?:video/[^/]+/video-|embed/video/)(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.dailymotion.com', [String.raw`(?ix)https?://(?:(?:(?:www|touch|geo)\.)?dailymotion\.[a-z]{2,3}/(?:(?:(?:(?:embed|swf|\#)/)|player\.html\?)?video|swf)|(?:www\.)?lequipe\.fr/video)[/=](?P<id>[^/?_&]+)(?:.+?\bplaylist=(?P<playlist_id>x[0-9a-z]+))?`, String.raw`(?:https?://)?(?:www\.)?dailymotion\.[a-z]{2,3}/playlist/(?P<id>x[0-9a-z]+)`, String.raw`https?://(?:www\.)?dailymotion\.[a-z]{2,3}/(?!(?:embed|swf|#|video|playlist)/)(?:(?:old/)?user/)?(?P<id>[^/]+)`]);
URL_REGEXS.set('geo.dailymotion.com', [String.raw`(?ix)https?://(?:(?:(?:www|touch|geo)\.)?dailymotion\.[a-z]{2,3}/(?:(?:(?:(?:embed|swf|\#)/)|player\.html\?)?video|swf)|(?:www\.)?lequipe\.fr/video)[/=](?P<id>[^/?_&]+)(?:.+?\bplaylist=(?P<playlist_id>x[0-9a-z]+))?`]);
URL_REGEXS.set('www.lequipe.fr', [String.raw`(?ix)https?://(?:(?:(?:www|touch|geo)\.)?dailymotion\.[a-z]{2,3}/(?:(?:(?:(?:embed|swf|\#)/)|player\.html\?)?video|swf)|(?:www\.)?lequipe\.fr/video)[/=](?P<id>[^/?_&]+)(?:.+?\bplaylist=(?P<playlist_id>x[0-9a-z]+))?`]);
URL_REGEXS.set('www.dailywire.com', [String.raw`https?://(?:www\.)dailywire(?:\.com)/(?P<sites_type>episode|videos)/(?P<id>[\w-]+)`, String.raw`https?://(?:www\.)dailywire(?:\.com)/(?P<sites_type>podcasts)/(?P<podcaster>[\w-]+/(?P<id>[\w-]+))`]);
URL_REGEXS.set('www.clubdam.com', [String.raw`https?://(?:www\.)?clubdam\.com/app/damtomo/(?:SP/)?karaokePost/StreamingKrk\.do\?karaokeContributeId=(?P<id>\d+)`, String.raw`https?://(?:www\.)?clubdam\.com/app/damtomo/(?:SP/)?karaokeMovie/StreamingDkm\.do\?karaokeMovieId=(?P<id>\d+)`]);
URL_REGEXS.set('tvpot.daum.net', [String.raw`https?://(?:(?:m\.)?tvpot\.daum\.net/v/|videofarm\.daum\.net/controller/player/VodPlayer\.swf\?vid=)(?P<id>[^?#&]+)`, String.raw`https?://(?:m\.)?tvpot\.daum\.net/(?:clip/ClipView.(?:do|tv)|mypot/View.do)\?.*?clipid=(?P<id>\d+)`, String.raw`https?://(?:m\.)?tvpot\.daum\.net/mypot/(?:View\.do|Top\.tv)\?.*?playlistid=(?P<id>[0-9]+)`, String.raw`https?://(?:m\.)?tvpot\.daum\.net/mypot/(?:View|Top)\.(?:do|tv)\?.*?ownerid=(?P<id>[0-9a-zA-Z]+)`]);
URL_REGEXS.set('m.tvpot.daum.net', [String.raw`https?://(?:(?:m\.)?tvpot\.daum\.net/v/|videofarm\.daum\.net/controller/player/VodPlayer\.swf\?vid=)(?P<id>[^?#&]+)`, String.raw`https?://(?:m\.)?tvpot\.daum\.net/(?:clip/ClipView.(?:do|tv)|mypot/View.do)\?.*?clipid=(?P<id>\d+)`, String.raw`https?://(?:m\.)?tvpot\.daum\.net/mypot/(?:View|Top)\.(?:do|tv)\?.*?ownerid=(?P<id>[0-9a-zA-Z]+)`]);
URL_REGEXS.set('videofarm.daum.net', [String.raw`https?://(?:(?:m\.)?tvpot\.daum\.net/v/|videofarm\.daum\.net/controller/player/VodPlayer\.swf\?vid=)(?P<id>[^?#&]+)`]);
URL_REGEXS.set('player.daystar.tv', [String.raw`https?://player\.daystar\.tv/(?P<id>\w+)`]);
URL_REGEXS.set('www.dagbladet.no', [String.raw`https?://(?:www\.)?dagbladet\.no/video/(?:(?:embed|(?P<display_id>[^/]+))/)?(?P<id>[0-9A-Za-z_-]{11}|[a-zA-Z0-9]{8})`, String.raw`.*`]);
URL_REGEXS.set('www.dctp.tv', [String.raw`https?://(?:www\.)?dctp\.tv/(?:#/)?filme/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.deezer.com', [String.raw`https?://(?:www\.)?deezer\.com/(../)?album/(?P<id>[0-9]+)`, String.raw`https?://(?:www\.)?deezer\.com/(../)?playlist/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.defense.gouv.fr', [String.raw`https?://.*?\.defense\.gouv\.fr/layout/set/ligthboxvideo/base-de-medias/webtv/(?P<id>[^/?#]*)`]);
URL_REGEXS.set('www.democracynow.org', [String.raw`https?://(?:www\.)?democracynow\.org/(?P<id>[^\?]*)`]);
URL_REGEXS.set('www.destinationamerica.com', [String.raw`https?://(?:www\.)?destinationamerica\.com/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('2m.ma', [String.raw`https?://(?:www\.)?2m\.ma/[^/]+/replay/single/(?P<id>([\w.]{1,24})+)`, String.raw`https?://(?:www\.)?2m\.ma/(?P<lang>\w+)/news/(?P<id>[^/#?]+)`]);
URL_REGEXS.set('www.dhm.de', [String.raw`https?://(?:www\.)?dhm\.de/filmarchiv/(?:[^/]+/)+(?P<id>[^/]+)`]);
URL_REGEXS.set('digg.com', [String.raw`https?://(?:www\.)?digg\.com/video/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.digitalconcerthall.com', [String.raw`https?://(?:www\.)?digitalconcerthall\.com/(?P<language>[a-z]+)/concert/(?P<id>[0-9]+)`]);
URL_REGEXS.set('evt.dispeak.com', [String.raw`https?://(?:s?evt\.dispeak|events\.digitallyspeaking)\.com/(?:[^/]+/)+xml/(?P<id>[^.]+)\.xml`]);
URL_REGEXS.set('events.digitallyspeaking.com', [String.raw`https?://(?:s?evt\.dispeak|events\.digitallyspeaking)\.com/(?:[^/]+/)+xml/(?P<id>[^.]+)\.xml`]);
URL_REGEXS.set('sevt.dispeak.com', [String.raw`https?://(?:s?evt\.dispeak|events\.digitallyspeaking)\.com/(?:[^/]+/)+xml/(?P<id>[^.]+)\.xml`]);
URL_REGEXS.set('www.ultimedia.com', [String.raw`(?x)https?://(?:www\.)?(?:digiteka\.net|ultimedia\.com)/(?:deliver/(?P<embed_type>generic|musique)(?:/[^/]+)*/(?:src|article)|default/index/video(?P<site_type>generic|music)/id)/(?P<id>[\d+a-z]+)`]);
URL_REGEXS.set('www.digiteka.net', [String.raw`(?x)https?://(?:www\.)?(?:digiteka\.net|ultimedia\.com)/(?:deliver/(?P<embed_type>generic|musique)(?:/[^/]+)*/(?:src|article)|default/index/video(?P<site_type>generic|music)/id)/(?P<id>[\d+a-z]+)`]);
URL_REGEXS.set('go.discovery.com', [String.raw`(?x)https?://(?P<site>go\.discovery|www\.(?:investigationdiscovery|discoverylife|animalplanet|ahctv|destinationamerica|sciencechannel|tlc)|watch\.(?:hgtv|foodnetwork|travelchannel|diynetwork|cookingchanneltv|motortrend))\.com/tv-shows/(?P<show_slug>[^/]+)/(?:video|full-episode)s/(?P<id>[^./?#]+)`, String.raw`https?://(?:go\.)?discovery\.com/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.investigationdiscovery.com', [String.raw`(?x)https?://(?P<site>go\.discovery|www\.(?:investigationdiscovery|discoverylife|animalplanet|ahctv|destinationamerica|sciencechannel|tlc)|watch\.(?:hgtv|foodnetwork|travelchannel|diynetwork|cookingchanneltv|motortrend))\.com/tv-shows/(?P<show_slug>[^/]+)/(?:video|full-episode)s/(?P<id>[^./?#]+)`, String.raw`https?://(?:www\.)?investigationdiscovery\.com/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.sciencechannel.com', [String.raw`(?x)https?://(?P<site>go\.discovery|www\.(?:investigationdiscovery|discoverylife|animalplanet|ahctv|destinationamerica|sciencechannel|tlc)|watch\.(?:hgtv|foodnetwork|travelchannel|diynetwork|cookingchanneltv|motortrend))\.com/tv-shows/(?P<show_slug>[^/]+)/(?:video|full-episode)s/(?P<id>[^./?#]+)`, String.raw`https?://(?:www\.)?sciencechannel\.com/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.discoverylife.com', [String.raw`https?://(?:www\.)?discoverylife\.com/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.tlc.de', [String.raw`https?://(?:www\.)?(?P<domain>(?:tlc|dmax)\.de|dplay\.co\.uk)/(?:programme|show|sendungen)/(?P<programme>[^/]+)/(?:video/)?(?P<alternate_id>[^/]+)`]);
URL_REGEXS.set('www.dmax.de', [String.raw`https?://(?:www\.)?(?P<domain>(?:tlc|dmax)\.de|dplay\.co\.uk)/(?:programme|show|sendungen)/(?P<programme>[^/]+)/(?:video/)?(?P<alternate_id>[^/]+)`]);
URL_REGEXS.set('www.dplay.co.uk', [String.raw`https?://(?:www\.)?(?P<domain>(?:tlc|dmax)\.de|dplay\.co\.uk)/(?:programme|show|sendungen)/(?P<programme>[^/]+)/(?:video/)?(?P<alternate_id>[^/]+)`]);
URL_REGEXS.set('tlc.de', [String.raw`https?://(?:www\.)?(?P<domain>(?:tlc|dmax)\.de|dplay\.co\.uk)/(?:programme|show|sendungen)/(?P<programme>[^/]+)/(?:video/)?(?P<alternate_id>[^/]+)`]);
URL_REGEXS.set('www.discoveryplus.com', [String.raw`https?://(?:www\.)?discoveryplus\.com/(?!it/)(?:\w{2}/)?video/(?P<id>[^/]+/[^/?#]+)`, String.raw`https?://(?:www\.)?discoveryplus\.com/it/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('discoveryplus.com', [String.raw`https?://(?:www\.)?discoveryplus\.com/(?!it/)(?:\w{2}/)?video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.discoveryplus.in', [String.raw`https?://(?:www\.)?discoveryplus\.in/videos?/(?P<id>[^/]+/[^/?#]+)`, String.raw`https?://(?:www\.)?discoveryplus\.in/show/(?P<show_name>[^/]+)/?(?:[?#]|$)`]);
URL_REGEXS.set('www.discoveryplus.it', [String.raw`https?://(?:www\.)?discoveryplus\.it/programmi/(?P<show_name>[^/]+)/?(?:[?#]|$)`, String.raw`(?x)https?://(?P<domain>(?:www\.)?(?P<host>d(?:play\.(?P<country>dk|fi|jp|se|no)|iscoveryplus\.(?P<plus_country>dk|es|fi|it|se|no)))|(?P<subdomain_country>es|it)\.dplay\.com)/[^/]+/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('video.disney.com', [String.raw`(?x)https?://(?P<domain>(?:[^/]+\.)?(?:disney\.[a-z]{2,3}(?:\.[a-z]{2})?|disney(?:(?:me|latino)\.com|turkiye\.com\.tr|channel\.de)|(?:starwars|marvelkids)\.com))/(?:(?:embed/|(?:[^/]+/)+[\w-]+-)(?P<id>[a-z0-9]{24})|(?:[^/]+/)?(?P<display_id>[^/?#]+))`]);
URL_REGEXS.set('www.starwars.com', [String.raw`(?x)https?://(?P<domain>(?:[^/]+\.)?(?:disney\.[a-z]{2,3}(?:\.[a-z]{2})?|disney(?:(?:me|latino)\.com|turkiye\.com\.tr|channel\.de)|(?:starwars|marvelkids)\.com))/(?:(?:embed/|(?:[^/]+/)+[\w-]+-)(?P<id>[a-z0-9]{24})|(?:[^/]+/)?(?P<display_id>[^/?#]+))`]);
URL_REGEXS.set('videos.disneylatino.com', [String.raw`(?x)https?://(?P<domain>(?:[^/]+\.)?(?:disney\.[a-z]{2,3}(?:\.[a-z]{2})?|disney(?:(?:me|latino)\.com|turkiye\.com\.tr|channel\.de)|(?:starwars|marvelkids)\.com))/(?:(?:embed/|(?:[^/]+/)+[\w-]+-)(?P<id>[a-z0-9]{24})|(?:[^/]+/)?(?P<display_id>[^/?#]+))`]);
URL_REGEXS.set('video.en.disneyme.com', [String.raw`(?x)https?://(?P<domain>(?:[^/]+\.)?(?:disney\.[a-z]{2,3}(?:\.[a-z]{2})?|disney(?:(?:me|latino)\.com|turkiye\.com\.tr|channel\.de)|(?:starwars|marvelkids)\.com))/(?:(?:embed/|(?:[^/]+/)+[\w-]+-)(?P<id>[a-z0-9]{24})|(?:[^/]+/)?(?P<display_id>[^/?#]+))`]);
URL_REGEXS.set('video.disneyturkiye.com.tr', [String.raw`(?x)https?://(?P<domain>(?:[^/]+\.)?(?:disney\.[a-z]{2,3}(?:\.[a-z]{2})?|disney(?:(?:me|latino)\.com|turkiye\.com\.tr|channel\.de)|(?:starwars|marvelkids)\.com))/(?:(?:embed/|(?:[^/]+/)+[\w-]+-)(?P<id>[a-z0-9]{24})|(?:[^/]+/)?(?P<display_id>[^/?#]+))`]);
URL_REGEXS.set('disneyjunior.disney.com', [String.raw`(?x)https?://(?P<domain>(?:[^/]+\.)?(?:disney\.[a-z]{2,3}(?:\.[a-z]{2})?|disney(?:(?:me|latino)\.com|turkiye\.com\.tr|channel\.de)|(?:starwars|marvelkids)\.com))/(?:(?:embed/|(?:[^/]+/)+[\w-]+-)(?P<id>[a-z0-9]{24})|(?:[^/]+/)?(?P<display_id>[^/?#]+))`]);
URL_REGEXS.set('spiderman.marvelkids.com', [String.raw`(?x)https?://(?P<domain>(?:[^/]+\.)?(?:disney\.[a-z]{2,3}(?:\.[a-z]{2})?|disney(?:(?:me|latino)\.com|turkiye\.com\.tr|channel\.de)|(?:starwars|marvelkids)\.com))/(?:(?:embed/|(?:[^/]+/)+[\w-]+-)(?P<id>[a-z0-9]{24})|(?:[^/]+/)?(?P<display_id>[^/?#]+))`]);
URL_REGEXS.set('disneyjunior.en.disneyme.com', [String.raw`(?x)https?://(?P<domain>(?:[^/]+\.)?(?:disney\.[a-z]{2,3}(?:\.[a-z]{2})?|disney(?:(?:me|latino)\.com|turkiye\.com\.tr|channel\.de)|(?:starwars|marvelkids)\.com))/(?:(?:embed/|(?:[^/]+/)+[\w-]+-)(?P<id>[a-z0-9]{24})|(?:[^/]+/)?(?P<display_id>[^/?#]+))`]);
URL_REGEXS.set('disneychannel.de', [String.raw`(?x)https?://(?P<domain>(?:[^/]+\.)?(?:disney\.[a-z]{2,3}(?:\.[a-z]{2})?|disney(?:(?:me|latino)\.com|turkiye\.com\.tr|channel\.de)|(?:starwars|marvelkids)\.com))/(?:(?:embed/|(?:[^/]+/)+[\w-]+-)(?P<id>[a-z0-9]{24})|(?:[^/]+/)?(?P<display_id>[^/?#]+))`]);
URL_REGEXS.set('watch.diynetwork.com', [String.raw`https?://(?:watch\.)?diynetwork\.com/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('dlive.tv', [String.raw`https?://(?:www\.)?dlive\.tv/p/(?P<uploader_id>.+?)\+(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('dotsub.com', [String.raw`https?://(?:www\.)?dotsub\.com/view/(?P<id>[^/]+)`]);
URL_REGEXS.set('www.douyin.com', [String.raw`https?://(?:www\.)?douyin\.com/video/(?P<id>[0-9]+)`]);
URL_REGEXS.set('v.douyu.com', [String.raw`https?://v(?:mobile)?\.douyu\.com/show/(?P<id>[0-9a-zA-Z]+)`]);
URL_REGEXS.set('vmobile.douyu.com', [String.raw`https?://v(?:mobile)?\.douyu\.com/show/(?P<id>[0-9a-zA-Z]+)`]);
URL_REGEXS.set('www.douyutv.com', [String.raw`https?://(?:www\.)?douyu(?:tv)?\.com/(?:[^/]+/)*(?P<id>[A-Za-z0-9]+)`]);
URL_REGEXS.set('www.douyu.com', [String.raw`https?://(?:www\.)?douyu(?:tv)?\.com/(?:[^/]+/)*(?P<id>[A-Za-z0-9]+)`]);
URL_REGEXS.set('www.dplay.se', [String.raw`(?x)https?://(?P<domain>(?:www\.)?(?P<host>d(?:play\.(?P<country>dk|fi|jp|se|no)|iscoveryplus\.(?P<plus_country>dk|es|fi|it|se|no)))|(?P<subdomain_country>es|it)\.dplay\.com)/[^/]+/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.dplay.dk', [String.raw`(?x)https?://(?P<domain>(?:www\.)?(?P<host>d(?:play\.(?P<country>dk|fi|jp|se|no)|iscoveryplus\.(?P<plus_country>dk|es|fi|it|se|no)))|(?P<subdomain_country>es|it)\.dplay\.com)/[^/]+/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.dplay.no', [String.raw`(?x)https?://(?P<domain>(?:www\.)?(?P<host>d(?:play\.(?P<country>dk|fi|jp|se|no)|iscoveryplus\.(?P<plus_country>dk|es|fi|it|se|no)))|(?P<subdomain_country>es|it)\.dplay\.com)/[^/]+/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('it.dplay.com', [String.raw`(?x)https?://(?P<domain>(?:www\.)?(?P<host>d(?:play\.(?P<country>dk|fi|jp|se|no)|iscoveryplus\.(?P<plus_country>dk|es|fi|it|se|no)))|(?P<subdomain_country>es|it)\.dplay\.com)/[^/]+/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('es.dplay.com', [String.raw`(?x)https?://(?P<domain>(?:www\.)?(?P<host>d(?:play\.(?P<country>dk|fi|jp|se|no)|iscoveryplus\.(?P<plus_country>dk|es|fi|it|se|no)))|(?P<subdomain_country>es|it)\.dplay\.com)/[^/]+/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.dplay.fi', [String.raw`(?x)https?://(?P<domain>(?:www\.)?(?P<host>d(?:play\.(?P<country>dk|fi|jp|se|no)|iscoveryplus\.(?P<plus_country>dk|es|fi|it|se|no)))|(?P<subdomain_country>es|it)\.dplay\.com)/[^/]+/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.dplay.jp', [String.raw`(?x)https?://(?P<domain>(?:www\.)?(?P<host>d(?:play\.(?P<country>dk|fi|jp|se|no)|iscoveryplus\.(?P<plus_country>dk|es|fi|it|se|no)))|(?P<subdomain_country>es|it)\.dplay\.com)/[^/]+/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.discoveryplus.se', [String.raw`(?x)https?://(?P<domain>(?:www\.)?(?P<host>d(?:play\.(?P<country>dk|fi|jp|se|no)|iscoveryplus\.(?P<plus_country>dk|es|fi|it|se|no)))|(?P<subdomain_country>es|it)\.dplay\.com)/[^/]+/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.discoveryplus.dk', [String.raw`(?x)https?://(?P<domain>(?:www\.)?(?P<host>d(?:play\.(?P<country>dk|fi|jp|se|no)|iscoveryplus\.(?P<plus_country>dk|es|fi|it|se|no)))|(?P<subdomain_country>es|it)\.dplay\.com)/[^/]+/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.discoveryplus.no', [String.raw`(?x)https?://(?P<domain>(?:www\.)?(?P<host>d(?:play\.(?P<country>dk|fi|jp|se|no)|iscoveryplus\.(?P<plus_country>dk|es|fi|it|se|no)))|(?P<subdomain_country>es|it)\.dplay\.com)/[^/]+/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.discoveryplus.es', [String.raw`(?x)https?://(?P<domain>(?:www\.)?(?P<host>d(?:play\.(?P<country>dk|fi|jp|se|no)|iscoveryplus\.(?P<plus_country>dk|es|fi|it|se|no)))|(?P<subdomain_country>es|it)\.dplay\.com)/[^/]+/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.discoveryplus.fi', [String.raw`(?x)https?://(?P<domain>(?:www\.)?(?P<host>d(?:play\.(?P<country>dk|fi|jp|se|no)|iscoveryplus\.(?P<plus_country>dk|es|fi|it|se|no)))|(?P<subdomain_country>es|it)\.dplay\.com)/[^/]+/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.dr.dk', [String.raw`https?://(?:www\.)?dr\.dk/bonanza/[^/]+/\d+/[^/]+/(?P<id>\d+)/(?P<display_id>[^/?#&]+)`, String.raw`(?x)https?://(?:(?:www\.)?dr\.dk/(?:tv/se|nyheder|(?:radio|lyd)(?:/ondemand)?)/(?:[^/]+/)*|(?:www\.)?(?:dr\.dk|dr-massive\.com)/drtv/(?:se|episode|program)/)(?P<id>[\da-z_-]+)`, String.raw`https?://(?:www\.)?dr\.dk/(?:tv|TV)/live/(?P<id>[\da-z-]+)`]);
URL_REGEXS.set('peacocktv.com', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('www.channel4.com', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('www.channel5.com', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('hsesn.apps.disneyplus.com', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('www.disneyplus.com', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('open.spotify.com', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`, String.raw`https?://open\.spotify\.com/(?:embed-podcast/|embed/|)episode/(?P<id>[^/?&#]+)`, String.raw`https?://open\.spotify\.com/(?:embed-podcast/|embed/|)show/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('www.tvnz.co.nz', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('www.oneplus.ch', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('www.artstation.com', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('www.philo.com', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('www.mech-plus.com', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('watch.mech-plus.com', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('www.aha.video', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('mubi.com', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('www.vootkids.com', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('www.nowtv.it', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('tv.apple.com', [String.raw`https?://(?:www\.)?(?:play\.hbomax\.com|channel(?:4|5)\.com|peacocktv\.com|(?:[\w\.]+\.)?disneyplus\.com|open\.spotify\.com/(?:track|playlist|album|artist)|tvnz\.co\.nz|oneplus\.ch|artstation\.com/learning/courses|philo\.com|(?:[\w\.]+\.)?mech-plus\.com|aha\.video|mubi\.com|vootkids\.com|nowtv\.it/watch|tv\.apple\.com)`]);
URL_REGEXS.set('drooble.com', [String.raw`(?x)https?://drooble\.com/(?:(?:(?P<user>[^/]+)/)?(?P<kind>song|videos|music/albums)/(?P<id>\d+)|(?P<user_2>[^/]+)/(?P<kind_2>videos|music))`]);
URL_REGEXS.set('www.dropbox.com', [String.raw`https?://(?:www\.)?dropbox[.]com/sh?/(?P<id>[a-zA-Z0-9]{15})/.*`]);
URL_REGEXS.set('www.dropout.tv', [String.raw`https?://(?:www\.)?dropout\.tv/(?:[^/]+/)*videos/(?P<id>[^/]+)/?$`, String.raw`https?://(?:www\.)?dropout\.tv/(?P<id>[^\/$&?#]+)(?:/?$|/season:[0-9]+/?$)`]);
URL_REGEXS.set('www.drtuber.com', [String.raw`https?://(?:(?:www|m)\.)?drtuber\.com/(?:video|embed)/(?P<id>\d+)(?:/(?P<display_id>[\w-]+))?`]);
URL_REGEXS.set('m.drtuber.com', [String.raw`https?://(?:(?:www|m)\.)?drtuber\.com/(?:video|embed)/(?P<id>\d+)(?:/(?P<display_id>[\w-]+))?`]);
URL_REGEXS.set('dr-massive.com', [String.raw`(?x)https?://(?:(?:www\.)?dr\.dk/(?:tv/se|nyheder|(?:radio|lyd)(?:/ondemand)?)/(?:[^/]+/)*|(?:www\.)?(?:dr\.dk|dr-massive\.com)/drtv/(?:se|episode|program)/)(?P<id>[\da-z_-]+)`]);
URL_REGEXS.set('d.tube', [String.raw`https?://(?:www\.)?d\.tube/(?:#!/)?v/(?P<uploader_id>[0-9a-z.-]+)/(?P<id>[0-9a-z]{8})`]);
URL_REGEXS.set('w.duboku.io', [String.raw`(?:https?://[^/]+\.duboku\.io/vodplay/)(?P<id>[0-9]+-[0-9-]+)\.html.*`, String.raw`(?:https?://[^/]+\.duboku\.io/voddetail/)(?P<id>[0-9]+)\.html.*`]);
URL_REGEXS.set('www.dumpert.nl', [String.raw`(?P<protocol>https?)://(?:(?:www|legacy)\.)?dumpert\.nl/(?:mediabase|embed|item)/(?P<id>[0-9]+[/_][0-9a-zA-Z]+)`]);
URL_REGEXS.set('legacy.dumpert.nl', [String.raw`(?P<protocol>https?)://(?:(?:www|legacy)\.)?dumpert\.nl/(?:mediabase|embed|item)/(?P<id>[0-9]+[/_][0-9a-zA-Z]+)`]);
URL_REGEXS.set('video.aktualne.cz', [String.raw`https?://video\.aktualne\.cz/(?:[^/]+/)+r~(?P<id>[0-9a-f]{32})`]);
URL_REGEXS.set('www.dw.com', [String.raw`https?://(?:www\.)?dw\.com/(?:[^/]+/)+(?:av|e)-(?P<id>\d+)`, String.raw`https?://(?:www\.)?dw\.com/(?:[^/]+/)+a-(?P<id>\d+)`]);
URL_REGEXS.set('lentaru.media.eagleplatform.com', [String.raw`(?x)(?:eagleplatform:(?P<custom_host>[^/]+):|https?://(?P<host>.+?\.media\.eagleplatform\.com)/index/player\?.*\brecord_id=)(?P<id>\d+)`]);
URL_REGEXS.set('www.ebaumsworld.com', [String.raw`https?://(?:www\.)?ebaumsworld\.com/videos/[^/]+/(?P<id>\d+)`]);
URL_REGEXS.set('www.echo.msk.ru', [String.raw`https?://(?:www\.)?echo\.msk\.ru/sounds/(?P<id>\d+)`]);
URL_REGEXS.set('egghead.io', [String.raw`https://(?:app\.)?egghead\.io/(?:course|playlist)s/(?P<id>[^/?#&]+)`, String.raw`https://(?:app\.)?egghead\.io/(?:api/v1/)?lessons/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('app.egghead.io', [String.raw`https://(?:app\.)?egghead\.io/(?:course|playlist)s/(?P<id>[^/?#&]+)`, String.raw`https://(?:app\.)?egghead\.io/(?:api/v1/)?lessons/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.ehftv.com', [String.raw`https?://(?:www\.)?ehftv\.com/[a-z]+(?:-[a-z]+)?/[^/]+/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.ehow.com', [String.raw`https?://(?:www\.)?ehow\.com/[^/_?]*_(?P<id>[0-9]+)`]);
URL_REGEXS.set('1und1.tv', [String.raw`(?x)https?://(?:www\.)?1und1\.tv/(?:[^?#]+\?(?:[^#]+&)?program=(?P<vid2>\d+)|(?:program|watch)/[^/]+/(?P<vid1>\d+))`, String.raw`(?x)https?://(?:www\.)?1und1\.tv/(?:[^?#]+\?(?:[^#]+&)?channel=(?P<vid2>[^/?&#]+)|live/(?P<vid1>[^/?&#]+))`, String.raw`(?x)https?://(?:www\.)?1und1\.tv/(?:[^?#]+\?(?:[^#]+&)?recording=(?P<vid2>\d+)(?P<vid1>))`]);
URL_REGEXS.set('einthusan.tv', [String.raw`https?://(?P<host>einthusan\.(?:tv|com|ca))/movie/watch/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('einthusan.com', [String.raw`https?://(?P<host>einthusan\.(?:tv|com|ca))/movie/watch/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('einthusan.ca', [String.raw`https?://(?P<host>einthusan\.(?:tv|com|ca))/movie/watch/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.eitb.tv', [String.raw`https?://(?:www\.)?eitb\.tv/(?:eu/bideoa|es/video)/[^/]+/\d+/(?P<id>\d+)`]);
URL_REGEXS.set('api-prod.ellentube.com', [String.raw`(?x)(?:ellentube:|https://api-prod\.ellentube\.com/ellenapi/api/item/)(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`]);
URL_REGEXS.set('www.ellentube.com', [String.raw`https?://(?:www\.)?ellentube\.com/(?:episode|studios)/(?P<id>.+?)\.html`, String.raw`https?://(?:www\.)?ellentube\.com/video/(?P<id>.+?)\.html`]);
URL_REGEXS.set('elonet.finna.fi', [String.raw`https?://elonet\.finna\.fi/Record/kavi\.elonet_elokuva_(?P<id>[0-9]+)`]);
URL_REGEXS.set('blogs.elpais.com', [String.raw`https?://(?:[^.]+\.)?elpais\.com/.*/(?P<id>[^/#?]+)\.html(?:$|[?#])`]);
URL_REGEXS.set('elcomidista.elpais.com', [String.raw`https?://(?:[^.]+\.)?elpais\.com/.*/(?P<id>[^/#?]+)\.html(?:$|[?#])`]);
URL_REGEXS.set('elpais.com', [String.raw`https?://(?:[^.]+\.)?elpais\.com/.*/(?P<id>[^/#?]+)\.html(?:$|[?#])`]);
URL_REGEXS.set('epv.elpais.com', [String.raw`https?://(?:[^.]+\.)?elpais\.com/.*/(?P<id>[^/#?]+)\.html(?:$|[?#])`]);
URL_REGEXS.set('cdn.embedly.com', [String.raw`https?://(?:www|cdn\.)?embedly\.com/widgets/media\.html\?(?:[^#]*?&)?(?:src|url)=(?:[^#&]+)`]);
URL_REGEXS.set('www.empflix.com', [String.raw`https?://(?:www\.)?(?P<host>empflix)\.com/(?:videos/(?P<display_id>.+?)-|[^/]+/(?P<display_id_2>[^/]+)/video)(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.engadget.com', [String.raw`https?://(?:www\.)?engadget\.com/video/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.epicon.in', [String.raw`https?://(?:www\.)?epicon\.in/(?:documentaries|movies|tv-shows/[^/?#]+/[^/?#]+)/(?P<id>[^/?#]+)`, String.raw`(?!.*season)https?://(?:www\.)?epicon\.in/tv-shows/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.theepochtimes.com', [String.raw`https?://www.theepochtimes\.com/[\w-]+_(?P<id>\d+).html`]);
URL_REGEXS.set('www.eporner.com', [String.raw`https?://(?:www\.)?eporner\.com/(?:(?:hd-porn|embed)/|video-)(?P<id>\w+)(?:/(?P<display_id>[\w-]+))?`]);
URL_REGEXS.set('www.eroprofile.com', [String.raw`https?://(?:www\.)?eroprofile\.com/m/videos/view/(?P<id>[^/]+)`, String.raw`https?://(?:www\.)?eroprofile\.com/m/videos/album/(?P<id>[^/]+)`]);
URL_REGEXS.set('www.ertflix.gr', [String.raw`https?://www\.ertflix\.gr/(?:[^/]+/)?(?:series|vod)/(?P<id>[a-z]{3}\.\d+)`]);
URL_REGEXS.set('www.ert.gr', [String.raw`https?://www\.ert\.gr/webtv/live\-uni/vod/dt\-uni\-vod\.php\?([^#]+&)?f=(?P<id>[^#&]+)`]);
URL_REGEXS.set('www.escapistmagazine.com', [String.raw`https?://?(?:(?:www|v1)\.)?escapistmagazine\.com/videos/view/[^/]+/(?P<id>[0-9]+)`]);
URL_REGEXS.set('escapistmagazine.com', [String.raw`https?://?(?:(?:www|v1)\.)?escapistmagazine\.com/videos/view/[^/]+/(?P<id>[0-9]+)`]);
URL_REGEXS.set('v1.escapistmagazine.com', [String.raw`https?://?(?:(?:www|v1)\.)?escapistmagazine\.com/videos/view/[^/]+/(?P<id>[0-9]+)`]);
URL_REGEXS.set('espn.go.com', [String.raw`(?x)https?://(?:(?:(?:(?:(?:\w+\.)+)?espn\.go|(?:www\.)?espn)\.com/(?:(?:video/(?:clip|iframe/twitter)|)(?:.*?\?.*?\bid=|/_/id/)|[^/]+/video/))|(?:www\.)espnfc\.(?:com|us)/(?:video/)?[^/]+/\d+/video/)(?P<id>\d+)`, String.raw`https?://(?:espn\.go|(?:www\.)?espn)\.com/(?:[^/]+/)*(?P<id>[^/]+)`]);
URL_REGEXS.set('broadband.espn.go.com', [String.raw`(?x)https?://(?:(?:(?:(?:(?:\w+\.)+)?espn\.go|(?:www\.)?espn)\.com/(?:(?:video/(?:clip|iframe/twitter)|)(?:.*?\?.*?\bid=|/_/id/)|[^/]+/video/))|(?:www\.)espnfc\.(?:com|us)/(?:video/)?[^/]+/\d+/video/)(?P<id>\d+)`]);
URL_REGEXS.set('nonredline.sports.espn.go.com', [String.raw`(?x)https?://(?:(?:(?:(?:(?:\w+\.)+)?espn\.go|(?:www\.)?espn)\.com/(?:(?:video/(?:clip|iframe/twitter)|)(?:.*?\?.*?\bid=|/_/id/)|[^/]+/video/))|(?:www\.)espnfc\.(?:com|us)/(?:video/)?[^/]+/\d+/video/)(?P<id>\d+)`]);
URL_REGEXS.set('cdn.espn.go.com', [String.raw`(?x)https?://(?:(?:(?:(?:(?:\w+\.)+)?espn\.go|(?:www\.)?espn)\.com/(?:(?:video/(?:clip|iframe/twitter)|)(?:.*?\?.*?\bid=|/_/id/)|[^/]+/video/))|(?:www\.)espnfc\.(?:com|us)/(?:video/)?[^/]+/\d+/video/)(?P<id>\d+)`]);
URL_REGEXS.set('www.espn.com', [String.raw`(?x)https?://(?:(?:(?:(?:(?:\w+\.)+)?espn\.go|(?:www\.)?espn)\.com/(?:(?:video/(?:clip|iframe/twitter)|)(?:.*?\?.*?\bid=|/_/id/)|[^/]+/video/))|(?:www\.)espnfc\.(?:com|us)/(?:video/)?[^/]+/\d+/video/)(?P<id>\d+)`, String.raw`https?://(?:www\.)?espn\.com/(?:watch|espnplus)/player/_/id/(?P<id>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`]);
URL_REGEXS.set('www.espnfc.us', [String.raw`(?x)https?://(?:(?:(?:(?:(?:\w+\.)+)?espn\.go|(?:www\.)?espn)\.com/(?:(?:video/(?:clip|iframe/twitter)|)(?:.*?\?.*?\bid=|/_/id/)|[^/]+/video/))|(?:www\.)espnfc\.(?:com|us)/(?:video/)?[^/]+/\d+/video/)(?P<id>\d+)`]);
URL_REGEXS.set('www.espnfc.com', [String.raw`(?x)https?://(?:(?:(?:(?:(?:\w+\.)+)?espn\.go|(?:www\.)?espn)\.com/(?:(?:video/(?:clip|iframe/twitter)|)(?:.*?\?.*?\bid=|/_/id/)|[^/]+/video/))|(?:www\.)espnfc\.(?:com|us)/(?:video/)?[^/]+/\d+/video/)(?P<id>\d+)`]);
URL_REGEXS.set('www.espncricinfo.com', [String.raw`https?://(?:www\.)?espncricinfo\.com/video/[^#$&?/]+-(?P<id>\d+)`]);
URL_REGEXS.set('video.esri.com', [String.raw`https?://video\.esri\.com/watch/(?P<id>[0-9]+)`]);
URL_REGEXS.set('ec.europa.eu', [String.raw`https?://ec\.europa\.eu/avservices/(?:video/player|audio/audioDetails)\.cfm\?.*?\bref=(?P<id>[A-Za-z0-9-]+)`]);
URL_REGEXS.set('multimedia.europarl.europa.eu', [String.raw`(?x)https?://(?:multimedia|webstreaming)\.europarl\.europa\.eu/[^/#?]+/(?:embed/embed\.html\?event=|(?!video)[^/#?]+/[\w-]+_)(?P<id>[\w-]+)`]);
URL_REGEXS.set('webstreaming.europarl.europa.eu', [String.raw`(?x)https?://(?:multimedia|webstreaming)\.europarl\.europa\.eu/[^/#?]+/(?:embed/embed\.html\?event=|(?!video)[^/#?]+/[\w-]+_)(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.europeantour.com', [String.raw`https?://(?:www\.)?europeantour\.com/dpworld-tour/news/video/(?P<id>[^/&?#$]+)`]);
URL_REGEXS.set('www.eurosport.com', [String.raw`https?://www\.eurosport\.com/\w+/[\w-]+/\d+/[\w-]+_(?P<id>vid\d+)`]);
URL_REGEXS.set('euscreen.eu', [String.raw`https?://(?:www\.)?euscreen\.eu/item.html\?id=(?P<id>[^&?$/]+)`]);
URL_REGEXS.set('tvonline.ewe.de', [String.raw`(?x)https?://(?:www\.)?tvonline\.ewe\.de/(?:[^?#]+\?(?:[^#]+&)?program=(?P<vid2>\d+)|(?:program|watch)/[^/]+/(?P<vid1>\d+))`, String.raw`(?x)https?://(?:www\.)?tvonline\.ewe\.de/(?:[^?#]+\?(?:[^#]+&)?channel=(?P<vid2>[^/?&#]+)|live/(?P<vid1>[^/?&#]+))`, String.raw`(?x)https?://(?:www\.)?tvonline\.ewe\.de/(?:[^?#]+\?(?:[^#]+&)?recording=(?P<vid2>\d+)(?P<vid1>))`]);
URL_REGEXS.set('www.expotv.com', [String.raw`https?://(?:www\.)?expotv\.com/videos/[^?#]*/(?P<id>[0-9]+)($|[?#])`]);
URL_REGEXS.set('www.expressen.se', [String.raw`(?x)https?://(?:www\.)?(?:expressen|di)\.se/(?:(?:tvspelare/video|videoplayer/embed)/)?tv/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.di.se', [String.raw`(?x)https?://(?:www\.)?(?:expressen|di)\.se/(?:(?:tvspelare/video|videoplayer/embed)/)?tv/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.extremetube.com', [String.raw`https?://(?:www\.)?extremetube\.com/(?:[^/]+/)?video/(?P<id>[^/#?&]+)`]);
URL_REGEXS.set('www.eyedo.tv', [String.raw`https?://(?:www\.)?eyedo\.tv/[^/]+/(?:#!/)?Live/Detail/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.facebook.com', [String.raw`(?x)(?:https?://(?:[\w-]+\.)?(?:facebook\.com|facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd\.onion)/(?:[^#]*?\#!/)?(?:(?:video/video\.php|photo\.php|video\.php|video/embed|story\.php|watch(?:/live)?/?)\?(?:.*?)(?:v|video_id|story_fbid)=|[^/]+/videos/(?:[^/]+/)?|[^/]+/posts/|groups/[^/]+/permalink/|watchparty/)|facebook:)(?P<id>[0-9]+)`, String.raw`https?://(?:[\w-]+\.)?facebook\.com/reel/(?P<id>\d+)`, String.raw`https?://(?:[\w-]+\.)?facebook\.com/plugins/video\.php\?.*?\bhref=(?P<id>https.+)`, String.raw`https?://(?:[\w-]+\.)?facebook\.com/flx/warn[/?]`, String.raw`.*`]);
URL_REGEXS.set('m.facebook.com', [String.raw`(?x)(?:https?://(?:[\w-]+\.)?(?:facebook\.com|facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd\.onion)/(?:[^#]*?\#!/)?(?:(?:video/video\.php|photo\.php|video\.php|video/embed|story\.php|watch(?:/live)?/?)\?(?:.*?)(?:v|video_id|story_fbid)=|[^/]+/videos/(?:[^/]+/)?|[^/]+/posts/|groups/[^/]+/permalink/|watchparty/)|facebook:)(?P<id>[0-9]+)`]);
URL_REGEXS.set('zh-hk.facebook.com', [String.raw`(?x)(?:https?://(?:[\w-]+\.)?(?:facebook\.com|facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd\.onion)/(?:[^#]*?\#!/)?(?:(?:video/video\.php|photo\.php|video\.php|video/embed|story\.php|watch(?:/live)?/?)\?(?:.*?)(?:v|video_id|story_fbid)=|[^/]+/videos/(?:[^/]+/)?|[^/]+/posts/|groups/[^/]+/permalink/|watchparty/)|facebook:)(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion', [String.raw`(?x)(?:https?://(?:[\w-]+\.)?(?:facebook\.com|facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd\.onion)/(?:[^#]*?\#!/)?(?:(?:video/video\.php|photo\.php|video\.php|video/embed|story\.php|watch(?:/live)?/?)\?(?:.*?)(?:v|video_id|story_fbid)=|[^/]+/videos/(?:[^/]+/)?|[^/]+/posts/|groups/[^/]+/permalink/|watchparty/)|facebook:)(?P<id>[0-9]+)`]);
URL_REGEXS.set('fancode.com', [String.raw`https?://(www\.)?fancode\.com/match/(?P<id>[0-9]+).+`, String.raw`https?://(?:www\.)?fancode\.com/video/(?P<id>[0-9]+)\b`]);
URL_REGEXS.set('www.faz.net', [String.raw`https?://(?:www\.)?faz\.net/(?:[^/]+/)*.*?-(?P<id>\d+)\.html`]);
URL_REGEXS.set('video.fc2.com', [String.raw`^(?:https?://video\.fc2\.com/(?:[^/]+/)*content/|fc2:)(?P<id>[^/]+)`, String.raw`https?://video\.fc2\.com/flv2\.swf\?(?P<query>.+)`]);
URL_REGEXS.set('live.fc2.com', [String.raw`https?://live\.fc2\.com/(?P<id>\d+)`]);
URL_REGEXS.set('fc-zenit.ru', [String.raw`https?://(?:www\.)?fc-zenit\.ru/video/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.fifa.com', [String.raw`https?://www.fifa.com/fifaplus/(?P<locale>\w{2})/watch/([^#?]+/)?(?P<id>\w+)`]);
URL_REGEXS.set('www.filmmodu.org', [String.raw`https?://(?:www.)?filmmodu.org/(?P<id>[^/]+-(?:turkce-dublaj-izle|altyazili-izle))`]);
URL_REGEXS.set('www.filmon.com', [String.raw`(?:https?://(?:www\.)?filmon\.com/vod/view/|filmon:)(?P<id>\d+)`, String.raw`https?://(?:www\.)?filmon\.com/(?:tv|channel)/(?P<id>[a-z0-9-]+)`]);
URL_REGEXS.set('www.filmweb.no', [String.raw`https?://(?:www\.)?filmweb\.no/(?P<type>trailere|filmnytt)/article(?P<id>\d+)\.ece`]);
URL_REGEXS.set('fivethirtyeight.com', [String.raw`https?://(?:www\.)?fivethirtyeight\.com/features/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('5-tv.ru', [String.raw`(?x)https?://(?:www\.)?5-tv\.ru/(?:(?:[^/]+/)+(?P<id>\d+)|(?P<path>[^/?#]+)(?:[/?#])?)`]);
URL_REGEXS.set('www.5-tv.ru', [String.raw`(?x)https?://(?:www\.)?5-tv\.ru/(?:(?:[^/]+/)+(?P<id>\d+)|(?P<path>[^/?#]+)(?:[/?#])?)`]);
URL_REGEXS.set('www.flickr.com', [String.raw`https?://(?:www\.|secure\.)?flickr\.com/photos/[\w\-_@]+/(?P<id>\d+)`]);
URL_REGEXS.set('www.ft.dk', [String.raw`https?://(?:www\.)?ft\.dk/webtv/video/[^?#]*?\.(?P<id>[0-9]+)\.aspx`]);
URL_REGEXS.set('watch.foodnetwork.com', [String.raw`https?://(?:watch\.)?foodnetwork\.com/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('footyroom.com', [String.raw`https?://footyroom\.com/matches/(?P<id>\d+)`]);
URL_REGEXS.set('www.formula1.com', [String.raw`https?://(?:www\.)?formula1\.com/en/latest/video\.[^.]+\.(?P<id>\d+)\.html`]);
URL_REGEXS.set('www.fox.com', [String.raw`https?://(?:www\.)?fox\.com/watch/(?P<id>[\da-fA-F]+)`]);
URL_REGEXS.set('www.fox9.com', [String.raw`https?://(?:www\.)?fox9\.com/news/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('foxgay.com', [String.raw`https?://(?:www\.)?foxgay\.com/videos/(?:\S+-)?(?P<id>\d+)\.shtml`]);
URL_REGEXS.set('video.foxnews.com', [String.raw`https?://(?P<host>video\.(?:insider\.)?fox(?:news|business)\.com)/v/(?:video-embed\.html\?video_id=)?(?P<id>\d+)`]);
URL_REGEXS.set('video.foxbusiness.com', [String.raw`https?://(?P<host>video\.(?:insider\.)?fox(?:news|business)\.com)/v/(?:video-embed\.html\?video_id=)?(?P<id>\d+)`]);
URL_REGEXS.set('video.insider.foxnews.com', [String.raw`https?://(?P<host>video\.(?:insider\.)?fox(?:news|business)\.com)/v/(?:video-embed\.html\?video_id=)?(?P<id>\d+)`]);
URL_REGEXS.set('www.foxnews.com', [String.raw`https?://(?:www\.)?(?:insider\.)?foxnews\.com/(?!v)([^/]+/)+(?P<id>[a-z-]+)`, String.raw`https?://(?:www\.)?foxnews\.com/video/(?P<id>\d+)`]);
URL_REGEXS.set('insider.foxnews.com', [String.raw`https?://(?:www\.)?(?:insider\.)?foxnews\.com/(?!v)([^/]+/)+(?P<id>[a-z-]+)`]);
URL_REGEXS.set('www.foxsports.com', [String.raw`https?://(?:www\.)?foxsports\.com/watch/(?P<id>[\w-]+)`]);
URL_REGEXS.set('fptplay.vn', [String.raw`https?://fptplay\.vn/xem-video/[^/]+\-(?P<id>\w+)(?:/tap-(?P<episode>\d+)?/?(?:[?#]|$)|)`]);
URL_REGEXS.set('www.radiofrance.fr', [String.raw`https?://(?:www\.)?radiofrance\.fr/(?:franceculture|fip|francemusique|mouv|franceinter)/podcasts/(?:[^?#]+/)?(?P<display_id>[^?#]+)-(?P<id>\d+)($|[?#])`]);
URL_REGEXS.set('www.franceinter.fr', [String.raw`https?://(?:www\.)?franceinter\.fr/emissions/(?P<id>[^?#]+)`]);
URL_REGEXS.set('sivideo.webservices.francetelevisions.fr', [String.raw`(?x)(?:https?://sivideo\.webservices\.francetelevisions\.fr/tools/getInfosOeuvre/v2/\?.*?\bidDiffusion=[^&]+|(?:https?://videos\.francetv\.fr/video/|francetv:)(?P<id>[^@]+)(?:@(?P<catalog>.+))?)`]);
URL_REGEXS.set('videos.francetv.fr', [String.raw`(?x)(?:https?://sivideo\.webservices\.francetelevisions\.fr/tools/getInfosOeuvre/v2/\?.*?\bidDiffusion=[^&]+|(?:https?://videos\.francetv\.fr/video/|francetv:)(?P<id>[^@]+)(?:@(?P<catalog>.+))?)`]);
URL_REGEXS.set('www.francetvinfo.fr', [String.raw`https?://(?:www|mobile|france3-regions)\.francetvinfo\.fr/(?:[^/]+/)*(?P<id>[^/?#&.]+)`]);
URL_REGEXS.set('france3-regions.francetvinfo.fr', [String.raw`https?://(?:www|mobile|france3-regions)\.francetvinfo\.fr/(?:[^/]+/)*(?P<id>[^/?#&.]+)`]);
URL_REGEXS.set('www.france.tv', [String.raw`https?://(?:(?:www\.)?france\.tv|mobile\.france\.tv)/(?:[^/]+/)*(?P<id>[^/]+)\.html`]);
URL_REGEXS.set('mobile.france.tv', [String.raw`https?://(?:(?:www\.)?france\.tv|mobile\.france\.tv)/(?:[^/]+/)*(?P<id>[^/]+)\.html`]);
URL_REGEXS.set('www.freesound.org', [String.raw`https?://(?:www\.)?freesound\.org/people/[^/]+/sounds/(?P<id>[^/]+)`]);
URL_REGEXS.set('www.freespeech.org', [String.raw`https?://(?:www\.)?freespeech\.org/stories/(?P<id>.+)`, String.raw`.*`]);
URL_REGEXS.set('www.freetv.com', [String.raw`https?://(?:www\.)?freetv\.com/series/(?P<id>[^/]+)`, String.raw`https?://(?:www\.)?freetv\.com/peliculas/(?P<id>[^/]+)`]);
URL_REGEXS.set('api.frontendmasters.com', [String.raw`(?:frontendmasters:|https?://api\.frontendmasters\.com/v\d+/kabuki/video/)(?P<id>[^/]+)`]);
URL_REGEXS.set('frontendmasters.com', [String.raw`https?://(?:www\.)?frontendmasters\.com/courses/(?P<id>[^/]+)`, String.raw`https?://(?:www\.)?frontendmasters\.com/courses/(?P<course_name>[^/]+)/(?P<lesson_name>[^/]+)`]);
URL_REGEXS.set('fod.fujitv.co.jp', [String.raw`https?://fod\.fujitv\.co\.jp/title/(?P<sid>[0-9a-z]{4})/(?P<id>[0-9a-z]+)`]);
URL_REGEXS.set('www.funimation.com', [String.raw`https?://(?:www\.)?funimation\.com/player/(?P<id>\d+)`, String.raw`https?://(?:www\.)?funimation(?:\.com|now\.uk)/(?:(?P<lang>[^/]+)/)?(?:shows|v)/(?P<show>[^/]+)/(?P<episode>[^/?#&]+)`, String.raw`(?P<url>https?://(?:www\.)?funimation(?:\.com|now\.uk)/(?P<locale>[^/]+)?/?shows/(?P<id>[^/?#&]+))/?(?:[?#]|$)`]);
URL_REGEXS.set('www.funimationnow.uk', [String.raw`https?://(?:www\.)?funimation(?:\.com|now\.uk)/(?:(?P<lang>[^/]+)/)?(?:shows|v)/(?P<show>[^/]+)/(?P<episode>[^/?#&]+)`]);
URL_REGEXS.set('www.funk.net', [String.raw`https?://(?:www\.|origin\.)?funk\.net/(?:channel|playlist)/[^/]+/(?P<display_id>[0-9a-z-]+)-(?P<id>\d+)`]);
URL_REGEXS.set('fusion.tv', [String.raw`https?://(?:www\.)?fusion\.(?:net|tv)/(?:video/|show/.+?\bvideo=)(?P<id>\d+)`]);
URL_REGEXS.set('www.fux.com', [String.raw`https?://(?:(?P<kind>www|m)\.)?fux\.com/(?:video|embed)/(?P<id>\d+)(?:/(?P<display_id>[^/?#&]+))?`]);
URL_REGEXS.set('www.fuyin.tv', [String.raw`https?://(?:www\.)?fuyin\.tv/html/(?:\d+)/(?P<id>\d+)\.html`]);
URL_REGEXS.set('gab.com', [String.raw`https?://(?:www\.)?gab\.com/[^/]+/posts/(?P<id>\d+)`]);
URL_REGEXS.set('tv.gab.com', [String.raw`https?://tv\.gab\.com/channel/[^/]+/view/(?P<id>[a-z0-9-]+)`]);
URL_REGEXS.set('www.gaia.com', [String.raw`https?://(?:www\.)?gaia\.com/video/(?P<id>[^/?]+).*?\bfullplayer=(?P<type>feature|preview)`]);
URL_REGEXS.set('www.gameinformer.com', [String.raw`https?://(?:www\.)?gameinformer\.com/(?:[^/]+/)*(?P<id>[^.?&#]+)`]);
URL_REGEXS.set('gamejolt.com', [String.raw`https?://(?:www\.)?gamejolt\.com/p/(?:[\w-]*-)?(?P<id>\w{8})`, String.raw`https?://(?:www\.)?gamejolt\.com/c/(?P<id>(?P<community>[\w-]+)(?:/(?P<channel>[\w-]+))?)(?:(?:\?|\#!?)(?:.*?[&;])??sort=(?P<sort>\w+))?`, String.raw`https?://(?:www\.)?gamejolt\.com/games/[\w-]+/(?P<id>\d+)`, String.raw`https?://(?:www\.)?gamejolt\.com/get/soundtrack(?:\?|\#!?)(?:.*?[&;])??game=(?P<id>(?:\d+)+)`, String.raw`https?://(?:www\.)?gamejolt\.com/search(?:/(?P<filter>communities|users|games))?(?:\?|\#!?)(?:.*?[&;])??q=(?P<id>(?:[^&#]+)+)`, String.raw`https?://(?:www\.)?gamejolt\.com/@(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.gamespot.com', [String.raw`https?://(?:www\.)?gamespot\.com/(?:video|article|review)s/(?:[^/]+/\d+-|embed/)(?P<id>\d+)`]);
URL_REGEXS.set('www.gamestar.de', [String.raw`https?://(?:www\.)?game(?P<site>pro|star)\.de/videos/.*,(?P<id>[0-9]+)\.html`]);
URL_REGEXS.set('www.gamepro.de', [String.raw`https?://(?:www\.)?game(?P<site>pro|star)\.de/videos/.*,(?P<id>[0-9]+)\.html`]);
URL_REGEXS.set('www.gaskrank.tv', [String.raw`https?://(?:www\.)?gaskrank\.tv/tv/(?P<categories>[^/]+)/(?P<id>[^/]+)\.htm`]);
URL_REGEXS.set('www.gazeta.ru', [String.raw`(?P<url>https?://(?:www\.)?gazeta\.ru/(?:[^/]+/)?video/(?:main/)*(?:\d{4}/\d{2}/\d{2}/)?(?P<id>[A-Za-z0-9-_.]+)\.s?html)`]);
URL_REGEXS.set('www.gdcvault.com', [String.raw`https?://(?:www\.)?gdcvault\.com/play/(?P<id>\d+)(?:/(?P<name>[\w-]+))?`]);
URL_REGEXS.set('gdcvault.com', [String.raw`https?://(?:www\.)?gdcvault\.com/play/(?P<id>\d+)(?:/(?P<name>[\w-]+))?`]);
URL_REGEXS.set('video.lastampa.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.huffingtonpost.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.espresso.repubblica.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.repubblica.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.ilsecoloxix.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.iltirreno.gelocal.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.messaggeroveneto.gelocal.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.ilpiccolo.gelocal.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.gazzettadimantova.gelocal.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.mattinopadova.gelocal.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.laprovinciapavese.gelocal.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.tribunatreviso.gelocal.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.nuovavenezia.gelocal.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.gazzettadimodena.gelocal.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.lanuovaferrara.gelocal.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.corrierealpi.gelocal.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('video.lasentinella.gelocal.it', [String.raw`(?x:(?P<base_url>(?:https?:)//video\.(?:(?:(?:espresso\.)?repubblica|lastampa|ilsecoloxix|huffingtonpost)|(?:iltirreno|messaggeroveneto|ilpiccolo|gazzettadimantova|mattinopadova|laprovinciapavese|tribunatreviso|nuovavenezia|gazzettadimodena|lanuovaferrara|corrierealpi|lasentinella)\.gelocal)\.it(?:/[^/]+){2,4}/(?P<id>\d+))(?:$|[?&].*))`]);
URL_REGEXS.set('gem.cbc.ca', [String.raw`https?://gem\.cbc\.ca/media/(?P<id>[0-9a-z-]+/s[0-9]+[a-z][0-9]+)`, String.raw`https?://gem\.cbc\.ca/live/(?P<id>\d+)`, String.raw`https?://gem\.cbc\.ca/media/(?P<id>(?P<show>[0-9a-z-]+)/s(?P<season>[0-9]+))/?(?:[?#]|$)`]);
URL_REGEXS.set('genius.com', [String.raw`https?://(?:www\.)?genius\.com/videos/(?P<id>[^?/#]+)`, String.raw`https?://(?:www\.)?genius\.com/(?P<id>[^?/#]+)-lyrics[?/#]?`]);
URL_REGEXS.set('www.gettr.com', [String.raw`https?://(www\.)?gettr\.com/post/(?P<id>[a-z0-9]+)`]);
URL_REGEXS.set('gettr.com', [String.raw`https?://(www\.)?gettr\.com/post/(?P<id>[a-z0-9]+)`, String.raw`https?://(www\.)?gettr\.com/streaming/(?P<id>[a-z0-9]+)`]);
URL_REGEXS.set('gfycat.com', [String.raw`https?://(?:(?:www|giant|thumbs)\.)?gfycat\.com/(?i:ru/|ifr/|gifs/detail/)?(?P<id>[^-/?#\."\']+)`]);
URL_REGEXS.set('thumbs.gfycat.com', [String.raw`https?://(?:(?:www|giant|thumbs)\.)?gfycat\.com/(?i:ru/|ifr/|gifs/detail/)?(?P<id>[^-/?#\."\']+)`]);
URL_REGEXS.set('giant.gfycat.com', [String.raw`https?://(?:(?:www|giant|thumbs)\.)?gfycat\.com/(?i:ru/|ifr/|gifs/detail/)?(?P<id>[^-/?#\."\']+)`]);
URL_REGEXS.set('www.giantbomb.com', [String.raw`https?://(?:www\.)?giantbomb\.com/(?:videos|shows)/(?P<display_id>[^/]+)/(?P<id>\d+-\d+)`]);
URL_REGEXS.set('www.giga.de', [String.raw`https?://(?:www\.)?giga\.de/(?:[^/]+/)*(?P<id>[^/]+)`]);
URL_REGEXS.set('iptv.glattvision.ch', [String.raw`(?x)https?://(?:www\.)?iptv\.glattvision\.ch/(?:[^?#]+\?(?:[^#]+&)?program=(?P<vid2>\d+)|(?:program|watch)/[^/]+/(?P<vid1>\d+))`, String.raw`(?x)https?://(?:www\.)?iptv\.glattvision\.ch/(?:[^?#]+\?(?:[^#]+&)?channel=(?P<vid2>[^/?&#]+)|live/(?P<vid1>[^/?&#]+))`, String.raw`(?x)https?://(?:www\.)?iptv\.glattvision\.ch/(?:[^?#]+\?(?:[^#]+&)?recording=(?P<vid2>\d+)(?P<vid1>))`]);
URL_REGEXS.set('share.glide.me', [String.raw`https?://share\.glide\.me/(?P<id>[A-Za-z0-9\-=_+]+)`]);
URL_REGEXS.set('g1.globo.com', [String.raw`(?:globo:|https?://.+?\.globo\.com/(?:[^/]+/)*(?:v/(?:[^/]+/)?|videos/))(?P<id>\d{7,})`, String.raw`https?://.+?\.globo\.com/(?:[^/]+/)*(?P<id>[^/.]+)(?:\.html)?`]);
URL_REGEXS.set('globoplay.globo.com', [String.raw`(?:globo:|https?://.+?\.globo\.com/(?:[^/]+/)*(?:v/(?:[^/]+/)?|videos/))(?P<id>\d{7,})`]);
URL_REGEXS.set('canalbrasil.globo.com', [String.raw`(?:globo:|https?://.+?\.globo\.com/(?:[^/]+/)*(?:v/(?:[^/]+/)?|videos/))(?P<id>\d{7,})`]);
URL_REGEXS.set('globosatplay.globo.com', [String.raw`(?:globo:|https?://.+?\.globo\.com/(?:[^/]+/)*(?:v/(?:[^/]+/)?|videos/))(?P<id>\d{7,})`]);
URL_REGEXS.set('globotv.globo.com', [String.raw`(?:globo:|https?://.+?\.globo\.com/(?:[^/]+/)*(?:v/(?:[^/]+/)?|videos/))(?P<id>\d{7,})`]);
URL_REGEXS.set('canaloff.globo.com', [String.raw`(?:globo:|https?://.+?\.globo\.com/(?:[^/]+/)*(?:v/(?:[^/]+/)?|videos/))(?P<id>\d{7,})`]);
URL_REGEXS.set('gq.globo.com', [String.raw`https?://.+?\.globo\.com/(?:[^/]+/)*(?P<id>[^/.]+)(?:\.html)?`]);
URL_REGEXS.set('gshow.globo.com', [String.raw`https?://.+?\.globo\.com/(?:[^/]+/)*(?P<id>[^/.]+)(?:\.html)?`]);
URL_REGEXS.set('oglobo.globo.com', [String.raw`https?://.+?\.globo\.com/(?:[^/]+/)*(?P<id>[^/.]+)(?:\.html)?`]);
URL_REGEXS.set('ge.globo.com', [String.raw`https?://.+?\.globo\.com/(?:[^/]+/)*(?P<id>[^/.]+)(?:\.html)?`]);
URL_REGEXS.set('redeglobo.globo.com', [String.raw`https?://.+?\.globo\.com/(?:[^/]+/)*(?P<id>[^/.]+)(?:\.html)?`]);
URL_REGEXS.set('video.glomex.com', [String.raw`https?://video\.glomex\.com/[^/]+/(?P<id>v-[^-]+)`]);
URL_REGEXS.set('player.glomex.com', [String.raw`https?://player\.glomex\.com/integration/[^/]/iframe\-player\.html\?([^#]+&)?playlistId=(?P<id>[^#&]+)`]);
URL_REGEXS.set('abc.go.com', [String.raw`(?x)https?://(?P<sub_domain>(?:abc\.|freeform\.|watchdisneychannel\.|watchdisneyjunior\.|watchdisneyxd\.|disneynow\.|fxnow.fxnetworks\.)?go|fxnow\.fxnetworks|(?:www\.)?(?:abc|freeform|disneynow))\.com/(?:(?:[^/]+/)*(?P<id>[Vv][Dd][Kk][Aa]\w+)|(?:[^/]+/)*(?P<display_id>[^/?\#]+))`]);
URL_REGEXS.set('disneynow.com', [String.raw`(?x)https?://(?P<sub_domain>(?:abc\.|freeform\.|watchdisneychannel\.|watchdisneyjunior\.|watchdisneyxd\.|disneynow\.|fxnow.fxnetworks\.)?go|fxnow\.fxnetworks|(?:www\.)?(?:abc|freeform|disneynow))\.com/(?:(?:[^/]+/)*(?P<id>[Vv][Dd][Kk][Aa]\w+)|(?:[^/]+/)*(?P<display_id>[^/?\#]+))`]);
URL_REGEXS.set('freeform.go.com', [String.raw`(?x)https?://(?P<sub_domain>(?:abc\.|freeform\.|watchdisneychannel\.|watchdisneyjunior\.|watchdisneyxd\.|disneynow\.|fxnow.fxnetworks\.)?go|fxnow\.fxnetworks|(?:www\.)?(?:abc|freeform|disneynow))\.com/(?:(?:[^/]+/)*(?P<id>[Vv][Dd][Kk][Aa]\w+)|(?:[^/]+/)*(?P<display_id>[^/?\#]+))`]);
URL_REGEXS.set('abc.com', [String.raw`(?x)https?://(?P<sub_domain>(?:abc\.|freeform\.|watchdisneychannel\.|watchdisneyjunior\.|watchdisneyxd\.|disneynow\.|fxnow.fxnetworks\.)?go|fxnow\.fxnetworks|(?:www\.)?(?:abc|freeform|disneynow))\.com/(?:(?:[^/]+/)*(?P<id>[Vv][Dd][Kk][Aa]\w+)|(?:[^/]+/)*(?P<display_id>[^/?\#]+))`]);
URL_REGEXS.set('fxnow.fxnetworks.com', [String.raw`(?x)https?://(?P<sub_domain>(?:abc\.|freeform\.|watchdisneychannel\.|watchdisneyjunior\.|watchdisneyxd\.|disneynow\.|fxnow.fxnetworks\.)?go|fxnow\.fxnetworks|(?:www\.)?(?:abc|freeform|disneynow))\.com/(?:(?:[^/]+/)*(?P<id>[Vv][Dd][Kk][Aa]\w+)|(?:[^/]+/)*(?P<display_id>[^/?\#]+))`]);
URL_REGEXS.set('disneynow.go.com', [String.raw`(?x)https?://(?P<sub_domain>(?:abc\.|freeform\.|watchdisneychannel\.|watchdisneyjunior\.|watchdisneyxd\.|disneynow\.|fxnow.fxnetworks\.)?go|fxnow\.fxnetworks|(?:www\.)?(?:abc|freeform|disneynow))\.com/(?:(?:[^/]+/)*(?P<id>[Vv][Dd][Kk][Aa]\w+)|(?:[^/]+/)*(?P<display_id>[^/?\#]+))`]);
URL_REGEXS.set('www.freeform.com', [String.raw`(?x)https?://(?P<sub_domain>(?:abc\.|freeform\.|watchdisneychannel\.|watchdisneyjunior\.|watchdisneyxd\.|disneynow\.|fxnow.fxnetworks\.)?go|fxnow\.fxnetworks|(?:www\.)?(?:abc|freeform|disneynow))\.com/(?:(?:[^/]+/)*(?P<id>[Vv][Dd][Kk][Aa]\w+)|(?:[^/]+/)*(?P<display_id>[^/?\#]+))`]);
URL_REGEXS.set('discovery.com', [String.raw`https?://(?:go\.)?discovery\.com/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.godtube.com', [String.raw`https?://(?:www\.)?godtube\.com/watch/\?v=(?P<id>[\da-zA-Z]+)`]);
URL_REGEXS.set('gofile.io', [String.raw`https?://(?:www\.)?gofile\.io/d/(?P<id>[^/]+)`]);
URL_REGEXS.set('video.golem.de', [String.raw`^https?://video\.golem\.de/.+?/(?P<id>.+?)/`]);
URL_REGEXS.set('goodgame.ru', [String.raw`https?://goodgame\.ru/channel/(?P<id>\w+)`]);
URL_REGEXS.set('podcasts.google.com', [String.raw`https?://podcasts\.google\.com/feed/(?P<feed_url>[^/]+)/episode/(?P<id>[^/?&#]+)`, String.raw`https?://podcasts\.google\.com/feed/(?P<id>[^/?&#]+)/?(?:[?#&]|$)`]);
URL_REGEXS.set('drive.google.com', [String.raw`(?x)https?://(?:(?:docs|drive)\.google\.com/(?:(?:uc|open)\?.*?id=|file/d/)|video\.google\.com/get_player\?.*?docid=)(?P<id>[a-zA-Z0-9_-]{28,})`, String.raw`https?://(?:docs|drive)\.google\.com/drive/folders/(?P<id>[\w-]{28,})`]);
URL_REGEXS.set('www.goplay.be', [String.raw`https?://(www\.)?goplay\.be/video/([^/]+/[^/]+/|)(?P<display_id>[^/#]+)`]);
URL_REGEXS.set('gopro.com', [String.raw`https?://(www\.)?gopro\.com/v/(?P<id>[A-Za-z0-9]+)`]);
URL_REGEXS.set('www.goshgay.com', [String.raw`https?://(?:www\.)?goshgay\.com/video(?P<id>\d+?)($|/)`]);
URL_REGEXS.set('www.gotostage.com', [String.raw`https?://(?:www\.)?gotostage\.com/channel/[a-z0-9]+/recording/(?P<id>[a-z0-9]+)/watch`]);
URL_REGEXS.set('on-demand.gputechconf.com', [String.raw`https?://on-demand\.gputechconf\.com/gtc/2015/video/S(?P<id>\d+)\.html`]);
URL_REGEXS.set('gronkh.tv', [String.raw`https?://(?:www\.)?gronkh\.tv/(?:watch/)?streams?/(?P<id>\d+)`, String.raw`https?://(?:www\.)?gronkh\.tv(?:/feed)?/?(?:#|$)`, String.raw`https?://(?:www\.)?gronkh\.tv/vods/streams/?(?:#|$)`]);
URL_REGEXS.set('www.groupon.com', [String.raw`https?://(?:www\.)?groupon\.com/deals/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.harpodeon.com', [String.raw`https?://(?:www\.)?harpodeon\.com/(?:video|preview)/\w+/(?P<id>\d+)`]);
URL_REGEXS.set('www.hbo.com', [String.raw`https?://(?:www\.)?hbo\.com/(?:video|embed)(?:/[^/]+)*/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('hearthis.at', [String.raw`https?://(?:www\.)?hearthis\.at/(?P<artist>[^/]+)/(?P<title>[A-Za-z0-9\-]+)/?$`]);
URL_REGEXS.set('www.heise.de', [String.raw`https?://(?:www\.)?heise\.de/(?:[^/]+/)+[^/]+-(?P<id>[0-9]+)\.html`]);
URL_REGEXS.set('hellporno.com', [String.raw`https?://(?:www\.)?hellporno\.(?:com/videos|net/v)/(?P<id>[^/]+)`]);
URL_REGEXS.set('hellporno.net', [String.raw`https?://(?:www\.)?hellporno\.(?:com/videos|net/v)/(?P<id>[^/]+)`]);
URL_REGEXS.set('video.helsinki.fi', [String.raw`https?://video\.helsinki\.fi/Arkisto/flash\.php\?id=(?P<id>\d+)`]);
URL_REGEXS.set('hentai.animestigma.com', [String.raw`^https?://hentai\.animestigma\.com/(?P<id>[^/]+)`]);
URL_REGEXS.set('hetklokhuis.nl', [String.raw`https?://(?:www\.)?hetklokhuis\.nl/[^/]+/\d+/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.hgtv.com', [String.raw`https?://(?:www\.)?hgtv\.com/shows/[^/]+/(?P<id>[^/?#&]+)`, String.raw`https?://(?:www\.)?(?P<site>cookingchanneltv|discovery|(?:diy|food)network|hgtv|travelchannel)\.com/videos/[0-9a-z-]+-(?P<id>\d+)`]);
URL_REGEXS.set('de.hgtv.com', [String.raw`https?://de\.hgtv\.com/sendungen/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('watch.hgtv.com', [String.raw`https?://(?:watch\.)?hgtv\.com/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.hidive.com', [String.raw`https?://(?:www\.)?hidive\.com/stream/(?P<id>(?P<title>[^/]+)/(?P<key>[^/?#&]+))`]);
URL_REGEXS.set('www.historicfilms.com', [String.raw`https?://(?:www\.)?historicfilms\.com/(?:tapes/|play)(?P<id>\d+)`]);
URL_REGEXS.set('link.theplatform.com', [String.raw`https?://(?:www\.)?(?P<domain>(?:history|biography)\.com)/player/(?P<id>\d+)`, String.raw`(?x)(?:https?://(?:link|player)\.theplatform\.com/[sp]/(?P<provider_id>[^/]+)/(?:(?:(?:[^/]+/)+select/)?(?P<media>media/(?:guid/\d+/)?)?|(?P<config>(?:[^/\?]+/(?:swf|config)|onsite)/select/))?|theplatform:)(?P<id>[^/\?&]+)`]);
URL_REGEXS.set('player.theplatform.com', [String.raw`https?://(?:www\.)?(?P<domain>(?:history|biography)\.com)/player/(?P<id>\d+)`, String.raw`(?x)(?:https?://(?:link|player)\.theplatform\.com/[sp]/(?P<provider_id>[^/]+)/(?:(?:(?:[^/]+/)+select/)?(?P<media>media/(?:guid/\d+/)?)?|(?P<config>(?:[^/\?]+/(?:swf|config)|onsite)/select/))?|theplatform:)(?P<id>[^/\?&]+)`]);
URL_REGEXS.set('www.hitbox.tv', [String.raw`https?://(?:www\.)?(?:hitbox|smashcast)\.tv/(?:[^/]+/)*videos?/(?P<id>[0-9]+)`, String.raw`https?://(?:www\.)?(?:hitbox|smashcast)\.tv/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.smashcast.tv', [String.raw`https?://(?:www\.)?(?:hitbox|smashcast)\.tv/(?:[^/]+/)*videos?/(?P<id>[0-9]+)`, String.raw`https?://(?:www\.)?(?:hitbox|smashcast)\.tv/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('hitrecord.org', [String.raw`https?://(?:www\.)?hitrecord\.org/records/(?P<id>\d+)`]);
URL_REGEXS.set('www.hkedcity.net', [String.raw`https?://(?:www\.)?hkedcity\.net/etv/resource/(?P<id>[0-9]+)`]);
URL_REGEXS.set('holodex.net', [String.raw`(?x)https?://(?:www\.|staging\.)?holodex\.net/(?:api/v2/playlist/(?P<playlist>\d+)|watch/(?P<id>[\w-]{11})(?:\?(?:[^#]+&)?playlist=(?P<playlist2>\d+))?)`]);
URL_REGEXS.set('staging.holodex.net', [String.raw`(?x)https?://(?:www\.|staging\.)?holodex\.net/(?:api/v2/playlist/(?P<playlist>\d+)|watch/(?P<id>[\w-]{11})(?:\?(?:[^#]+&)?playlist=(?P<playlist2>\d+))?)`]);
URL_REGEXS.set('www.hotnewhiphop.com', [String.raw`https?://(?:www\.)?hotnewhiphop\.com/.*\.(?P<id>.*)\.html`]);
URL_REGEXS.set('www.hotstar.com', [String.raw`(?x)https?://(?:www\.)?hotstar\.com(?:/in)?/(?!in/)(?:(?P<type>movies|sports|episode|(?P<tv>tv))/(?(tv)(?:[^/?#]+/){2}|[^?#]*))?[^/?#]+/(?P<id>\d{10})`, String.raw`https?://(?:www\.)?hotstar\.com(?:/in)?/tv(?:/[^/]+){2}/list/[^/]+/t-(?P<id>\w+)`, String.raw`(?P<url>https?://(?:www\.)?hotstar\.com(?:/in)?/tv/[^/]+/\w+)/seasons/[^/]+/ss-(?P<id>\w+)`, String.raw`(?P<url>https?://(?:www\.)?hotstar\.com(?:/in)?/tv/[^/]+/(?P<id>\d+))/?(?:[#?]|$)`]);
URL_REGEXS.set('www.howcast.com', [String.raw`https?://(?:www\.)?howcast\.com/videos/(?P<id>\d+)`]);
URL_REGEXS.set('www.stufftoblowyourmind.com', [String.raw`https?://[\da-z-]+\.(?:howstuffworks|stuff(?:(?:youshould|theydontwantyouto)know|toblowyourmind|momnevertoldyou)|(?:brain|car)stuffshow|fwthinking|geniusstuff)\.com/(?:[^/]+/)*(?:\d+-)?(?P<id>.+?)-video\.htm`]);
URL_REGEXS.set('shows.howstuffworks.com', [String.raw`https?://[\da-z-]+\.(?:howstuffworks|stuff(?:(?:youshould|theydontwantyouto)know|toblowyourmind|momnevertoldyou)|(?:brain|car)stuffshow|fwthinking|geniusstuff)\.com/(?:[^/]+/)*(?:\d+-)?(?P<id>.+?)-video\.htm`]);
URL_REGEXS.set('www.hessenschau.de', [String.raw`^https?://www\.(?:hr-fernsehen|hessenschau)\.de/.*,video-(?P<id>[0-9]{6})\.html`]);
URL_REGEXS.set('www.hr-fernsehen.de', [String.raw`^https?://www\.(?:hr-fernsehen|hessenschau)\.de/.*,video-(?P<id>[0-9]{6})\.html`]);
URL_REGEXS.set('hrti.hrt.hr', [String.raw`(?x)(?:hrti:(?P<short_id>[0-9]+)|https?://hrti\.hrt\.hr/(?:\#/)?video/show/(?P<id>[0-9]+)/(?P<display_id>[^/]+)?)`, String.raw`https?://hrti\.hrt\.hr/(?:#/)?video/list/category/(?P<id>[0-9]+)/(?P<display_id>[^/]+)?`]);
URL_REGEXS.set('www.hse.de', [String.raw`https?://(?:www\.)?hse\.de/dpl/p/product/(?P<id>[0-9]+)`, String.raw`https?://(?:www\.)?hse\.de/dpl/c/tv-shows/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.huajiao.com', [String.raw`https?://(?:www\.)?huajiao\.com/l/(?P<id>[0-9]+)`]);
URL_REGEXS.set('live.huffingtonpost.com', [String.raw`(?x)https?://(embed\.)?live\.huffingtonpost\.com/(?:r/segment/[^/]+/|HPLEmbedPlayer/\?segmentId=)(?P<id>[0-9a-f]+)`]);
URL_REGEXS.set('www.hungama.com', [String.raw`(?x)https?://(?:www\.)?hungama\.com/(?:(?:video|movie)/[^/]+/|tv-show/(?:[^/]+/){2}\d+/episode/[^/]+/)(?P<id>\d+)`, String.raw`https?://(?:www\.)?hungama\.com/(?:playlists|album)/[^/]+/(?P<id>\d+)`, String.raw`https?://(?:www\.)?hungama\.com/song/[^/]+/(?P<id>\d+)`]);
URL_REGEXS.set('hypem.com', [String.raw`https?://(?:www\.)?hypem\.com/track/(?P<id>[0-9a-z]{5})`]);
URL_REGEXS.set('hytale.com', [String.raw`https?://(?:www\.)?hytale\.com/news/\d+/\d+/(?P<id>[a-z0-9-]+)`]);
URL_REGEXS.set('www.hytale.com', [String.raw`https?://(?:www\.)?hytale\.com/news/\d+/\d+/(?P<id>[a-z0-9-]+)`]);
URL_REGEXS.set('www.helsinkikanava.fi', [String.raw`(?P<base_url>https?://(?:www\.)?(?:asahitv\.fi|helsinkikanava\.fi|hyvinvointitv\.fi|inez\.fi|permanto\.fi|suite\.icareus\.com|videos\.minifiddlers\.org))/[^?#]+/player/[^?#]+\?(?:[^#]+&)?(?:assetId|eventId)=(?P<id>\d+)`]);
URL_REGEXS.set('suite.icareus.com', [String.raw`(?P<base_url>https?://(?:www\.)?(?:asahitv\.fi|helsinkikanava\.fi|hyvinvointitv\.fi|inez\.fi|permanto\.fi|suite\.icareus\.com|videos\.minifiddlers\.org))/[^?#]+/player/[^?#]+\?(?:[^#]+&)?(?:assetId|eventId)=(?P<id>\d+)`]);
URL_REGEXS.set('asahitv.fi', [String.raw`(?P<base_url>https?://(?:www\.)?(?:asahitv\.fi|helsinkikanava\.fi|hyvinvointitv\.fi|inez\.fi|permanto\.fi|suite\.icareus\.com|videos\.minifiddlers\.org))/[^?#]+/player/[^?#]+\?(?:[^#]+&)?(?:assetId|eventId)=(?P<id>\d+)`]);
URL_REGEXS.set('hyvinvointitv.fi', [String.raw`(?P<base_url>https?://(?:www\.)?(?:asahitv\.fi|helsinkikanava\.fi|hyvinvointitv\.fi|inez\.fi|permanto\.fi|suite\.icareus\.com|videos\.minifiddlers\.org))/[^?#]+/player/[^?#]+\?(?:[^#]+&)?(?:assetId|eventId)=(?P<id>\d+)`]);
URL_REGEXS.set('inez.fi', [String.raw`(?P<base_url>https?://(?:www\.)?(?:asahitv\.fi|helsinkikanava\.fi|hyvinvointitv\.fi|inez\.fi|permanto\.fi|suite\.icareus\.com|videos\.minifiddlers\.org))/[^?#]+/player/[^?#]+\?(?:[^#]+&)?(?:assetId|eventId)=(?P<id>\d+)`]);
URL_REGEXS.set('www.permanto.fi', [String.raw`(?P<base_url>https?://(?:www\.)?(?:asahitv\.fi|helsinkikanava\.fi|hyvinvointitv\.fi|inez\.fi|permanto\.fi|suite\.icareus\.com|videos\.minifiddlers\.org))/[^?#]+/player/[^?#]+\?(?:[^#]+&)?(?:assetId|eventId)=(?P<id>\d+)`]);
URL_REGEXS.set('videos.minifiddlers.org', [String.raw`(?P<base_url>https?://(?:www\.)?(?:asahitv\.fi|helsinkikanava\.fi|hyvinvointitv\.fi|inez\.fi|permanto\.fi|suite\.icareus\.com|videos\.minifiddlers\.org))/[^?#]+/player/[^?#]+\?(?:[^#]+&)?(?:assetId|eventId)=(?P<id>\d+)`]);
URL_REGEXS.set('www.iflix.com', [String.raw`https?://(?:www\.)?iflix\.com/(?:[^?#]+/)?play/(?P<series_id>\w+)(?:-[^?#]+)?/(?P<id>\w+)(?:-[^?#]+)?`, String.raw`https?://(?:www\.)?iflix\.com/(?:[^?#]+/)?play/(?P<id>\w+)(?:-[^/?#]+)?/?(?:[?#]|$)`]);
URL_REGEXS.set('www.ign.com', [String.raw`https?://(?:.+?\.ign|www\.pcmag)\.com/videos/(?:\d{4}/\d{2}/\d{2}/)?(?P<id>[^/?&#]+)`, String.raw`https?://.+?\.ign\.com/(?:articles(?:/\d{4}/\d{2}/\d{2})?|(?:[a-z]{2}/)?feature/\d+)/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('www.pcmag.com', [String.raw`https?://(?:.+?\.ign|www\.pcmag)\.com/videos/(?:\d{4}/\d{2}/\d{2}/)?(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('me.ign.com', [String.raw`https?://.+?\.ign\.com/(?:articles(?:/\d{4}/\d{2}/\d{2})?|(?:[a-z]{2}/)?feature/\d+)/(?P<id>[^/?&#]+)`, String.raw`https?://.+?\.ign\.com/(?:[a-z]{2}/)?[^/]+/(?P<id>\d+)/(?:video|trailer)/`]);
URL_REGEXS.set('adria.ign.com', [String.raw`https?://.+?\.ign\.com/(?:[a-z]{2}/)?[^/]+/(?P<id>\d+)/(?:video|trailer)/`]);
URL_REGEXS.set('kr.ign.com', [String.raw`https?://.+?\.ign\.com/(?:[a-z]{2}/)?[^/]+/(?P<id>\d+)/(?:video|trailer)/`]);
URL_REGEXS.set('www.iheart.com', [String.raw`(?:https?://(?:www\.)?iheart\.com/podcast/[^/]+/episode/(?P<display_id>[^/?&#]+)-|iheartradio:)(?P<id>\d+)`, String.raw`https?://(?:www\.)?iheart(?:podcastnetwork)?\.com/podcast/[^/?&#]+-(?P<id>\d+)/?(?:[?#&]|$)`]);
URL_REGEXS.set('www.iheartpodcastnetwork.com', [String.raw`https?://(?:www\.)?iheart(?:podcastnetwork)?\.com/podcast/[^/?&#]+-(?P<id>\d+)/?(?:[?#&]|$)`]);
URL_REGEXS.set('www.iltalehti.fi', [String.raw`https?://(?:www\.)?iltalehti\.fi/[^/?#]+/a/(?P<id>[^/?#])`]);
URL_REGEXS.set('www.imdb.com', [String.raw`https?://(?:www|m)\.imdb\.com/(?:video|title|list).*?[/-]vi(?P<id>\d+)`, String.raw`https?://(?:www\.)?imdb\.com/list/ls(?P<id>\d{9})(?!/videoplayer/vi\d+)`]);
URL_REGEXS.set('i.imgur.com', [String.raw`https?://(?:i\.)?imgur\.com/(?!(?:a|gallery|(?:t(?:opic)?|r)/[^/]+)/)(?P<id>[a-zA-Z0-9]+)`]);
URL_REGEXS.set('imgur.com', [String.raw`https?://(?:i\.)?imgur\.com/(?!(?:a|gallery|(?:t(?:opic)?|r)/[^/]+)/)(?P<id>[a-zA-Z0-9]+)`, String.raw`https?://(?:i\.)?imgur\.com/a/(?P<id>[a-zA-Z0-9]+)`, String.raw`https?://(?:i\.)?imgur\.com/(?:gallery|(?:t(?:opic)?|r)/[^/]+)/(?P<id>[a-zA-Z0-9]+)`]);
URL_REGEXS.set('www.ina.fr', [String.raw`https?://(?:(?:www|m)\.)?ina\.fr/(?:[^?#]+/)(?P<id>[\w-]+)`]);
URL_REGEXS.set('m.ina.fr', [String.raw`https?://(?:(?:www|m)\.)?ina\.fr/(?:[^?#]+/)(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.inc.com', [String.raw`https?://(?:www\.)?inc\.com/(?:[^/]+/)+(?P<id>[^.]+).html`]);
URL_REGEXS.set('indavideo.hu', [String.raw`https?://(?:(?:embed\.)?indavideo\.hu/player/video/|assets\.indavideo\.hu/swf/player\.swf\?.*\b(?:v(?:ID|id))=)(?P<id>[\da-f]+)`]);
URL_REGEXS.set('embed.indavideo.hu', [String.raw`https?://(?:(?:embed\.)?indavideo\.hu/player/video/|assets\.indavideo\.hu/swf/player\.swf\?.*\b(?:v(?:ID|id))=)(?P<id>[\da-f]+)`]);
URL_REGEXS.set('assets.indavideo.hu', [String.raw`https?://(?:(?:embed\.)?indavideo\.hu/player/video/|assets\.indavideo\.hu/swf/player\.swf\?.*\b(?:v(?:ID|id))=)(?P<id>[\da-f]+)`]);
URL_REGEXS.set('www.infoq.com', [String.raw`https?://(?:www\.)?infoq\.com/(?:[^/]+/)+(?P<id>[^/]+)`]);
URL_REGEXS.set('instagram.com', [String.raw`(?P<url>https?://(?:www\.)?instagram\.com(?:/[^/]+)?/(?:p|tv|reel)/(?P<id>[^/?#&]+))`, String.raw`https?://(?:www\.)?instagram\.com/explore/tags/(?P<id>[^/]+)`, String.raw`https?://(?:www\.)?instagram\.com/(?P<id>[^/]{2,})/?(?:$|[?#])`]);
URL_REGEXS.set('www.instagram.com', [String.raw`(?P<url>https?://(?:www\.)?instagram\.com(?:/[^/]+)?/(?:p|tv|reel)/(?P<id>[^/?#&]+))`, String.raw`https?://(?:www\.)?instagram\.com/stories/(?P<user>[^/]+)/(?P<id>\d+)`]);
URL_REGEXS.set('www.internazionale.it', [String.raw`https?://(?:www\.)?internazionale\.it/video/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('video.internetvideoarchive.net', [String.raw`https?://video\.internetvideoarchive\.net/(?:player|flash/players)/.*?\?.*?publishedid.*?`]);
URL_REGEXS.set('prima.iprima.cz', [String.raw`https?://(?!cnn)(?:[^/]+)\.iprima\.cz/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('play.iprima.cz', [String.raw`https?://(?!cnn)(?:[^/]+)\.iprima\.cz/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.iprima.cz', [String.raw`https?://(?!cnn)(?:[^/]+)\.iprima\.cz/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('zoom.iprima.cz', [String.raw`https?://(?!cnn)(?:[^/]+)\.iprima\.cz/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('krimi.iprima.cz', [String.raw`https?://(?!cnn)(?:[^/]+)\.iprima\.cz/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('cool.iprima.cz', [String.raw`https?://(?!cnn)(?:[^/]+)\.iprima\.cz/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('love.iprima.cz', [String.raw`https?://(?!cnn)(?:[^/]+)\.iprima\.cz/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('cnn.iprima.cz', [String.raw`https?://cnn\.iprima\.cz/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.iq.com', [String.raw`https?://(?:www\.)?iq\.com/play/(?:[\w%-]*-)?(?P<id>\w+)`, String.raw`https?://(?:www\.)?iq\.com/album/(?:[\w%-]*-)?(?P<id>\w+)`]);
URL_REGEXS.set('www.iqiyi.com', [String.raw`https?://(?:(?:[^.]+\.)?iqiyi\.com|www\.pps\.tv)/.+\.html`]);
URL_REGEXS.set('yule.iqiyi.com', [String.raw`https?://(?:(?:[^.]+\.)?iqiyi\.com|www\.pps\.tv)/.+\.html`]);
URL_REGEXS.set('www.pps.tv', [String.raw`https?://(?:(?:[^.]+\.)?iqiyi\.com|www\.pps\.tv)/.+\.html`]);
URL_REGEXS.set('watch.islamchannel.tv', [String.raw`https?://watch\.islamchannel\.tv/watch/(?P<id>\d+)`, String.raw`https?://watch\.islamchannel\.tv/series/(?P<id>[a-f\d-]+)`]);
URL_REGEXS.set('www.israelnationalnews.com', [String.raw`https?://(?:www\.)?israelnationalnews\.com/news/(?P<id>\d+)`]);
URL_REGEXS.set('app.itpro.tv', [String.raw`https://app.itpro.tv/course/(?P<course>[\w-]+)/(?P<id>[\w-]+)`, String.raw`https?://app.itpro.tv/course/(?P<id>[\w-]+)/?(?:$|[#?])`]);
URL_REGEXS.set('tv.ittf.com', [String.raw`https?://tv\.ittf\.com/video/[^/]+/(?P<id>\d+)`]);
URL_REGEXS.set('www.itv.com', [String.raw`https?://(?:www\.)?itv\.com/hub/[^/]+/(?P<id>[0-9a-zA-Z]+)`, String.raw`https?://(?:www\.)?itv\.com/(?:news|btcc)/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.ivi.ru', [String.raw`https?://(?:www\.)?ivi\.(?:ru|tv)/(?:watch/(?:[^/]+/)?|video/player\?.*?videoId=)(?P<id>\d+)`, String.raw`https?://(?:www\.)?ivi\.ru/watch/(?!\d+)(?P<compilationid>[a-z\d_-]+)(?:/season(?P<seasonid>\d+))?$`]);
URL_REGEXS.set('www.ivi.tv', [String.raw`https?://(?:www\.)?ivi\.(?:ru|tv)/(?:watch/(?:[^/]+/)?|video/player\?.*?videoId=)(?P<id>\d+)`]);
URL_REGEXS.set('www.ivideon.com', [String.raw`https?://(?:www\.)?ivideon\.com/tv/(?:[^/]+/)*camera/(?P<id>\d+-[\da-f]+)/(?P<camera_id>\d+)`]);
URL_REGEXS.set('iwara.tv', [String.raw`(?P<base_url>https?://(?:www\.|ecchi\.)?iwara\.tv)/videos/(?P<id>[a-zA-Z0-9]+)`]);
URL_REGEXS.set('ecchi.iwara.tv', [String.raw`(?P<base_url>https?://(?:www\.|ecchi\.)?iwara\.tv)/videos/(?P<id>[a-zA-Z0-9]+)`, String.raw`(?P<base_url>https?://(?:www\.|ecchi\.)?iwara\.tv)/playlist/(?P<id>[^/?#&]+)`, String.raw`(?P<base_url>https?://(?:www\.|ecchi\.)?iwara\.tv)/users/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.iwara.tv', [String.raw`(?P<base_url>https?://(?:www\.|ecchi\.)?iwara\.tv)/videos/(?P<id>[a-zA-Z0-9]+)`]);
URL_REGEXS.set('www.ixigua.com', [String.raw`https?://(?:\w+\.)?ixigua\.com/(?:video/)?(?P<id>\d+).+`]);
URL_REGEXS.set('www.izlesene.com', [String.raw`(?x)https?://(?:(?:www|m)\.)?izlesene\.com/(?:video|embedplayer)/(?:[^/]+/)?(?P<id>[0-9]+)`]);
URL_REGEXS.set('jable.tv', [String.raw`https?://(?:www\.)?jable.tv/videos/(?P<id>[\w-]+)`, String.raw`https?://(?:www\.)?jable.tv/(?:categories|models|tags)/(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.jamendo.com', [String.raw`(?x)https?://(?:licensing\.jamendo\.com/[^/]+|(?:www\.)?jamendo\.com)/track/(?P<id>[0-9]+)(?:/(?P<display_id>[^/?#&]+))?`, String.raw`https?://(?:www\.)?jamendo\.com/album/(?P<id>[0-9]+)`]);
URL_REGEXS.set('licensing.jamendo.com', [String.raw`(?x)https?://(?:licensing\.jamendo\.com/[^/]+|(?:www\.)?jamendo\.com)/track/(?P<id>[0-9]+)(?:/(?P<display_id>[^/?#&]+))?`]);
URL_REGEXS.set('www.jeuxvideo.com', [String.raw`https?://.*?\.jeuxvideo\.com/.*/(.*?)\.htm`]);
URL_REGEXS.set('media.joj.sk', [String.raw`(?x)(?:joj:|https?://media\.joj\.sk/embed/)(?P<id>[^/?#^]+)`]);
URL_REGEXS.set('www.jove.com', [String.raw`https?://(?:www\.)?jove\.com/video/(?P<id>[0-9]+)`]);
URL_REGEXS.set('content.jwplatform.com', [String.raw`(?:https?://(?:content\.jwplatform|cdn\.jwplayer)\.com/(?:(?:feed|player|thumb|preview|manifest)s|jw6|v2/media)/|jwplatform:)(?P<id>[a-zA-Z0-9]{8})`]);
URL_REGEXS.set('cdn.jwplayer.com', [String.raw`(?:https?://(?:content\.jwplatform|cdn\.jwplayer)\.com/(?:(?:feed|player|thumb|preview|manifest)s|jw6|v2/media)/|jwplatform:)(?P<id>[a-zA-Z0-9]{8})`]);
URL_REGEXS.set('tv.kakao.com', [String.raw`https?://(?:play-)?tv\.kakao\.com/(?:channel/\d+|embed/player)/cliplink/(?P<id>\d+|[^?#&]+@my)`]);
URL_REGEXS.set('www.kaltura.com', [String.raw`(?x)(?:kaltura:(?P<partner_id>\w+):(?P<id>\w+)(?::(?P<player_type>\w+))?|https?://(:?(?:www|cdnapi(?:sec)?)\.)?kaltura\.com(?::\d+)?/(?:(?:# flash playerindex\.php/(?:kwidget|extwidget/preview)|# html5 playerhtml5/html5lib/[^/]+/mwEmbedFrame\.php))(?:/(?P<path>[^?]+))?(?:\?(?P<query>.*))?)`]);
URL_REGEXS.set('cdnapisec.kaltura.com', [String.raw`(?x)(?:kaltura:(?P<partner_id>\w+):(?P<id>\w+)(?::(?P<player_type>\w+))?|https?://(:?(?:www|cdnapi(?:sec)?)\.)?kaltura\.com(?::\d+)?/(?:(?:# flash playerindex\.php/(?:kwidget|extwidget/preview)|# html5 playerhtml5/html5lib/[^/]+/mwEmbedFrame\.php))(?:/(?P<path>[^?]+))?(?:\?(?P<query>.*))?)`]);
URL_REGEXS.set('www.kaltura.com:443', [String.raw`(?x)(?:kaltura:(?P<partner_id>\w+):(?P<id>\w+)(?::(?P<player_type>\w+))?|https?://(:?(?:www|cdnapi(?:sec)?)\.)?kaltura\.com(?::\d+)?/(?:(?:# flash playerindex\.php/(?:kwidget|extwidget/preview)|# html5 playerhtml5/html5lib/[^/]+/mwEmbedFrame\.php))(?:/(?P<path>[^?]+))?(?:\?(?P<query>.*))?)`]);
URL_REGEXS.set('kanal2.postimees.ee', [String.raw`https?://kanal2\.postimees\.ee/[^?#]+\?([^#]+&)?id=(?P<id>\d+)`]);
URL_REGEXS.set('www.kankanews.com', [String.raw`https?://(?:www\.)?kankanews\.com/a/\d+\-\d+\-\d+/(?P<id>\d+)\.shtml`]);
URL_REGEXS.set('www.karaoketv.co.il', [String.raw`https?://(?:www\.)?karaoketv\.co\.il/[^/]+/(?P<id>\d+)`]);
URL_REGEXS.set('www.karrierevideos.at', [String.raw`https?://(?:www\.)?karrierevideos\.at(?:/[^/]+)+/(?P<id>[^/]+)`]);
URL_REGEXS.set('www.mtv.fi', [String.raw`https?://(?:www\.)?(?:katsomo|mtv(uutiset)?)\.fi/(?:sarja/[0-9a-z-]+-\d+/[0-9a-z-]+-|(?:#!/)?jakso/(?:\d+/[^/]+/)?|video/prog)(?P<id>\d+)`]);
URL_REGEXS.set('www.katsomo.fi', [String.raw`https?://(?:www\.)?(?:katsomo|mtv(uutiset)?)\.fi/(?:sarja/[0-9a-z-]+-\d+/[0-9a-z-]+-|(?:#!/)?jakso/(?:\d+/[^/]+/)?|video/prog)(?P<id>\d+)`]);
URL_REGEXS.set('www.mtvuutiset.fi', [String.raw`https?://(?:www\.)?(?:katsomo|mtv(uutiset)?)\.fi/(?:sarja/[0-9a-z-]+-\d+/[0-9a-z-]+-|(?:#!/)?jakso/(?:\d+/[^/]+/)?|video/prog)(?P<id>\d+)`, String.raw`https?://(?:www\.)mtvuutiset\.fi/artikkeli/[^/]+/(?P<id>\d+)`]);
URL_REGEXS.set('www.keezmovies.com', [String.raw`https?://(?:www\.)?keezmovies\.com/video/(?:(?P<display_id>[^/]+)-)?(?P<id>\d+)`]);
URL_REGEXS.set('members.kelbyone.com', [String.raw`https?://members\.kelbyone\.com/course/(?P<id>[^$&?#/]+)`]);
URL_REGEXS.set('www.ketnet.be', [String.raw`https?://(?:www\.)?ketnet\.be/(?P<id>(?:[^/]+/)*[^/?#&]+)`]);
URL_REGEXS.set('www.khanacademy.org', [String.raw`https?://(?:www\.)?khanacademy\.org/(?P<id>(?:[^/]+/){4}v/[^?#/&]+)`, String.raw`https?://(?:www\.)?khanacademy\.org/(?P<id>(?:[^/]+/){2}[^?#/&]+)/?(?:[?#&]|$)`]);
URL_REGEXS.set('kick.com', [String.raw`https?://(?:www\.)?kick\.com/(?!(?:video|categories|search|auth)(?:[/?#]|$))(?P<id>[\w_]+)`, String.raw`https?://(?:www\.)?kick\.com/video/(?P<id>[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12})`]);
URL_REGEXS.set('www.kicker.de', [String.raw`https?://(?:www\.)kicker\.(?:de)/(?P<id>[\w-]+)/video`]);
URL_REGEXS.set('www.kickstarter.com', [String.raw`https?://(?:www\.)?kickstarter\.com/projects/(?P<id>[^/]*)/.*`]);
URL_REGEXS.set('kinja.com', [String.raw`(?x)https?://(?:[^.]+\.)?(?:avclub|clickhole|deadspin|gizmodo|jalopnik|jezebel|kinja|kotaku|lifehacker|splinternews|the(?:inventory|onion|root|takeout))\.com/(?:ajax/inset|embed/video)/iframe\?.*?\bid=(?P<type>fb|imgur|instagram|jwp(?:layer)?-video|kinjavideo|mcp|megaphone|ooyala|soundcloud(?:-playlist)?|tumblr-post|twitch-stream|twitter|ustream-channel|vimeo|vine|youtube-(?:list|video))-(?P<id>[^&]+)`]);
URL_REGEXS.set('www.kinopoisk.ru', [String.raw`https?://(?:www\.)?kinopoisk\.ru/film/(?P<id>\d+)`]);
URL_REGEXS.set('video.kompas.com', [String.raw`https?://video\.kompas\.com/\w+/(?P<id>\d+)/(?P<slug>[\w-]+)`]);
URL_REGEXS.set('www.konserthusetplay.se', [String.raw`https?://(?:www\.)?(?:konserthusetplay|rspoplay)\.se/\?.*\bm=(?P<id>[^&]+)`]);
URL_REGEXS.set('rspoplay.se', [String.raw`https?://(?:www\.)?(?:konserthusetplay|rspoplay)\.se/\?.*\bm=(?P<id>[^&]+)`]);
URL_REGEXS.set('www.kooapp.com', [String.raw`https?://(?:www\.)?kooapp\.com/koo/[^/]+/(?P<id>[^/&#$?]+)`]);
URL_REGEXS.set('krasview.ru', [String.raw`https?://krasview\.ru/(?:video|embed)/(?P<id>\d+)`]);
URL_REGEXS.set('play.kth.se', [String.raw`https?://play\.kth\.se/(?:[^/]+/)+(?P<id>[a-z0-9_]+)`]);
URL_REGEXS.set('v.ku6.com', [String.raw`https?://v\.ku6\.com/show/(?P<id>[a-zA-Z0-9\-\_]+)(?:\.)*html`]);
URL_REGEXS.set('www.kusi.com', [String.raw`https?://(?:www\.)?kusi\.com/(?P<path>story/.+|video\?clipId=(?P<clipId>\d+))`]);
URL_REGEXS.set('kusi.com', [String.raw`https?://(?:www\.)?kusi\.com/(?P<path>story/.+|video\?clipId=(?P<clipId>\d+))`]);
URL_REGEXS.set('www.kuwo.cn', [String.raw`https?://(?:www\.)?kuwo\.cn/album/(?P<id>\d+?)/`, String.raw`https?://(?:www\.)?kuwo\.cn/mv/(?P<id>\d+?)/`, String.raw`https?://(?:www\.)?kuwo\.cn/mingxing/(?P<id>[^/]+)`, String.raw`https?://(?:www\.)?kuwo\.cn/yinyue/(?P<id>\d+)`]);
URL_REGEXS.set('yinyue.kuwo.cn', [String.raw`https?://yinyue\.kuwo\.cn/yy/cinfo_(?P<id>\d+?).htm`, String.raw`https?://yinyue\.kuwo\.cn/billboard_(?P<id>[^.]+).htm`]);
URL_REGEXS.set('www.la7.it', [String.raw`(?x)https?://(?:(?:www\.)?la7\.it/([^/]+)/(?:rivedila7|video|news)/|tg\.la7\.it/repliche-tgla7\?id=)(?P<id>.+)`, String.raw`https?://(?:www\.)?la7\.it/[^/]+/podcast/([^/]+-)?(?P<id>\d+)`, String.raw`https?://(?:www\.)?la7\.it/(?P<id>[^/]+)/podcast/?(?:$|[#?])`]);
URL_REGEXS.set('www.laola1.tv', [String.raw`https?://(?:www\.)?laola1\.tv/[a-z]+-[a-z]+/[^/]+/(?P<id>[^/?#&]+)`, String.raw`https?://(?:www\.)?laola1\.tv/titanplayer\.php\?.*?\bvideoid=(?P<id>\d+)`]);
URL_REGEXS.set('www.last.fm', [String.raw`https?://(?:www\.)?last\.fm/music(?:/[^/]+){2}/(?P<id>[^/#?]+)`, String.raw`https?://(?:www\.)?last\.fm/(music|tag)/(?P<id>[^/]+)(?:/[^/]+)?/?(?:[?#]|$)`, String.raw`https?://(?:www\.)?last\.fm/user/[^/]+/playlists/(?P<id>[^/#?]+)`]);
URL_REGEXS.set('lbry.tv', [String.raw`(?:https?://(?:www\.)?(?:lbry\.tv|odysee\.com)/|lbry://)(?P<id>\$/[^/]+/[^/]+/[0-9a-f]{1,40}|@[^:/?#&]+(?:[:#][0-9a-f]{1,40})?/[^:/?#&]+(?:[:#][0-9a-f]{1,40})?|(?!@)[^:/?#&]+(?:[:#][0-9a-f]{1,40})?)`, String.raw`(?:https?://(?:www\.)?(?:lbry\.tv|odysee\.com)/|lbry://)(?P<id>@[^:/?#&]+(?:[:#][0-9a-f]{1,40})?)/?(?:[?&]|$)`]);
URL_REGEXS.set('odysee.com', [String.raw`(?:https?://(?:www\.)?(?:lbry\.tv|odysee\.com)/|lbry://)(?P<id>\$/[^/]+/[^/]+/[0-9a-f]{1,40}|@[^:/?#&]+(?:[:#][0-9a-f]{1,40})?/[^:/?#&]+(?:[:#][0-9a-f]{1,40})?|(?!@)[^:/?#&]+(?:[:#][0-9a-f]{1,40})?)`]);
URL_REGEXS.set('www.tf1info.fr', [String.raw`https?://(?:www\.)?(?:lci|tf1info)\.fr/[^/]+/[\w-]+-(?P<id>\d+)\.html`]);
URL_REGEXS.set('www.lci.fr', [String.raw`https?://(?:www\.)?(?:lci|tf1info)\.fr/[^/]+/[\w-]+-(?P<id>\d+)\.html`]);
URL_REGEXS.set('www.lcp.fr', [String.raw`https?://(?:www\.)?lcp\.fr/(?:[^/]+/)*(?P<id>[^/]+)`]);
URL_REGEXS.set('play.lcp.fr', [String.raw`https?://play\.lcp\.fr/embed/(?P<id>[^/]+)/(?P<account_id>[^/]+)/[^/]+/[^/]+`]);
URL_REGEXS.set('www.le.com', [String.raw`https?://(?:www\.le\.com/ptv/vplay|(?:sports\.le|(?:www\.)?lesports)\.com/(?:match|video))/(?P<id>\d+)\.html`, String.raw`https?://[a-z]+\.le\.com/(?!video)[a-z]+/(?P<id>[a-z0-9_]+)`]);
URL_REGEXS.set('sports.le.com', [String.raw`https?://(?:www\.le\.com/ptv/vplay|(?:sports\.le|(?:www\.)?lesports)\.com/(?:match|video))/(?P<id>\d+)\.html`]);
URL_REGEXS.set('www.lesports.com', [String.raw`https?://(?:www\.le\.com/ptv/vplay|(?:sports\.le|(?:www\.)?lesports)\.com/(?:match|video))/(?P<id>\d+)\.html`]);
URL_REGEXS.set('lecture2go.uni-hamburg.de', [String.raw`https?://lecture2go\.uni-hamburg\.de/veranstaltungen/-/v/(?P<id>\d+)`]);
URL_REGEXS.set('app.lecturio.com', [String.raw`(?x)https://(?:app\.lecturio\.com/([^/]+/(?P<nt>[^/?#&]+)\.lecture|(?:\#/)?lecture/c/\d+/(?P<id>\d+))|(?:www\.)?lecturio\.de/[^/]+/(?P<nt_de>[^/?#&]+)\.vortrag)`, String.raw`https://app\.lecturio\.com/(?:[^/]+/(?P<nt>[^/?#&]+)\.course|(?:#/)?course/c/(?P<id>\d+))`]);
URL_REGEXS.set('www.lecturio.de', [String.raw`(?x)https://(?:app\.lecturio\.com/([^/]+/(?P<nt>[^/?#&]+)\.lecture|(?:\#/)?lecture/c/\d+/(?P<id>\d+))|(?:www\.)?lecturio\.de/[^/]+/(?P<nt_de>[^/?#&]+)\.vortrag)`, String.raw`https://(?:www\.)?lecturio\.de/[^/]+/(?P<id>[^/?#&]+)\.kurs`]);
URL_REGEXS.set('www.lego.com', [String.raw`https?://(?:www\.)?lego\.com/(?P<locale>[a-z]{2}-[a-z]{2})/(?:[^/]+/)*videos/(?:[^/]+/)*[^/?#]+-(?P<id>[0-9a-f]{32})`]);
URL_REGEXS.set('www.lemonde.fr', [String.raw`https?://(?:.+?\.)?lemonde\.fr/(?:[^/]+/)*(?P<id>[^/]+)\.html`]);
URL_REGEXS.set('redaction.actu.lemonde.fr', [String.raw`https?://(?:.+?\.)?lemonde\.fr/(?:[^/]+/)*(?P<id>[^/]+)\.html`]);
URL_REGEXS.set('lenta.ru', [String.raw`https?://(?:www\.)?lenta\.ru/[^/]+/\d+/\d+/\d+/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('tv.le.com', [String.raw`https?://[a-z]+\.le\.com/(?!video)[a-z]+/(?P<id>[a-z0-9_]+)`]);
URL_REGEXS.set('list.le.com', [String.raw`https?://[a-z]+\.le\.com/(?!video)[a-z]+/(?P<id>[a-z0-9_]+)`]);
URL_REGEXS.set('yuntv.letv.com', [String.raw`https?://yuntv\.letv\.com/bcloud.html\?.+`]);
URL_REGEXS.set('html5-player.libsyn.com', [String.raw`(?P<mainurl>https?://html5-player\.libsyn\.com/embed/episode/id/(?P<id>[0-9]+))`]);
URL_REGEXS.set('life.ru', [String.raw`https?://life\.ru/t/[^/]+/(?P<id>\d+)`]);
URL_REGEXS.set('embed.life.ru', [String.raw`https?://embed\.life\.ru/(?:embed|video)/(?P<id>[\da-f]{32})`]);
URL_REGEXS.set('likee.video', [String.raw`(?x)https?://(www\.)?likee\.video/(?:(?P<channel_name>[^/]+)/video/|v/)(?P<id>\w+)`, String.raw`https?://(www\.)?likee\.video/(?P<id>[^/]+)/?$`]);
URL_REGEXS.set('www.likee.video', [String.raw`(?x)https?://(www\.)?likee\.video/(?:(?P<channel_name>[^/]+)/video/|v/)(?P<id>\w+)`]);
URL_REGEXS.set('link.videoplatform.limelight.com', [String.raw`(?x)(?:limelight:media:|https?://(?:link\.videoplatform\.limelight\.com/media/|assets\.delvenetworks\.com/player/loader\.swf)\?.*?\bmediaId=)(?P<id>[a-z0-9]{32})`, String.raw`(?x)(?:limelight:channel:|https?://(?:link\.videoplatform\.limelight\.com/media/|assets\.delvenetworks\.com/player/loader\.swf)\?.*?\bchannelId=)(?P<id>[a-z0-9]{32})`, String.raw`(?x)(?:limelight:channel_list:|https?://(?:link\.videoplatform\.limelight\.com/media/|assets\.delvenetworks\.com/player/loader\.swf)\?.*?\bchannelListId=)(?P<id>[a-z0-9]{32})`]);
URL_REGEXS.set('assets.delvenetworks.com', [String.raw`(?x)(?:limelight:media:|https?://(?:link\.videoplatform\.limelight\.com/media/|assets\.delvenetworks\.com/player/loader\.swf)\?.*?\bmediaId=)(?P<id>[a-z0-9]{32})`, String.raw`(?x)(?:limelight:channel:|https?://(?:link\.videoplatform\.limelight\.com/media/|assets\.delvenetworks\.com/player/loader\.swf)\?.*?\bchannelId=)(?P<id>[a-z0-9]{32})`, String.raw`(?x)(?:limelight:channel_list:|https?://(?:link\.videoplatform\.limelight\.com/media/|assets\.delvenetworks\.com/player/loader\.swf)\?.*?\bchannelListId=)(?P<id>[a-z0-9]{32})`]);
URL_REGEXS.set('live.line.me', [String.raw`https?://live\.line\.me/channels/(?P<channel_id>\d+)/broadcast/(?P<id>\d+)`, String.raw`https?://live\.line\.me/channels/(?P<id>\d+)(?!/broadcast/\d+)(?:[/?&#]|$)`]);
URL_REGEXS.set('www.linkedin.com', [String.raw`https?://(?:www\.)?linkedin\.com/posts/.+?(?P<id>\d+)`, String.raw`https?://(?:www\.)?linkedin\.com/learning/(?P<course_slug>[^/]+)/(?P<id>[^/?#]+)`, String.raw`https?://(?:www\.)?linkedin\.com/learning/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('linuxacademy.com', [String.raw`(?x)https?://(?:www\.)?linuxacademy\.com/cp/(?:courses/lesson/course/(?P<chapter_id>\d+)/lesson/(?P<lesson_id>\d+)|modules/view/id/(?P<course_id>\d+))`]);
URL_REGEXS.set('www.liputan6.com', [String.raw`https?://www\.liputan6\.com/\w+/read/\d+/(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.listennotes.com', [String.raw`https?://(?:www\.)?listennotes\.com/podcasts/[^/]+/[^/]+-(?P<id>.+)/`]);
URL_REGEXS.set('www.litv.tv', [String.raw`https?://(?:www\.)?litv\.tv/(?:vod|promo)/[^/]+/(?:content\.do)?\?.*?\b(?:content_)?id=(?P<id>[^&]+)`]);
URL_REGEXS.set('andrei-bt.livejournal.com', [String.raw`https?://(?:[^.]+\.)?livejournal\.com/video/album/\d+.+?\bid=(?P<id>\d+)`]);
URL_REGEXS.set('new.livestream.com', [String.raw`https?://(?:new\.)?livestream\.com/(?:accounts/(?P<account_id>\d+)|(?P<account_name>[^/]+))/(?:events/(?P<event_id>\d+)|(?P<event_name>[^/]+))(?:/videos/(?P<id>\d+))?`]);
URL_REGEXS.set('livestream.com', [String.raw`https?://(?:new\.)?livestream\.com/(?:accounts/(?P<account_id>\d+)|(?P<account_name>[^/]+))/(?:events/(?P<event_id>\d+)|(?P<event_name>[^/]+))(?:/videos/(?P<id>\d+))?`]);
URL_REGEXS.set('original.livestream.com', [String.raw`(?x)https?://original\.livestream\.com/(?P<user>[^/\?#]+)(?:/(?P<type>video|folder)(?:(?:\?.*?Id=|/)(?P<id>.*?)(&|$))?)?`]);
URL_REGEXS.set('livestreamfails.com', [String.raw`https?://(?:www\.)?livestreamfails\.com/(?:clip|post)/(?P<id>[0-9]+)`]);
URL_REGEXS.set('lnk.lt', [String.raw`https?://(?:www\.)?lnk\.lt/[^/]+/(?P<id>\d+)`, String.raw`https?://(?:www\.)?lnk(?:go)?\.(?:alfa\.)?lt/(?:visi-video/[^/]+|video)/(?P<id>[A-Za-z0-9-]+)(?:/(?P<episode_id>\d+))?`]);
URL_REGEXS.set('www.lnkgo.lt', [String.raw`https?://(?:www\.)?lnk(?:go)?\.(?:alfa\.)?lt/(?:visi-video/[^/]+|video)/(?P<id>[A-Za-z0-9-]+)(?:/(?P<episode_id>\d+))?`]);
URL_REGEXS.set('lnkgo.alfa.lt', [String.raw`https?://(?:www\.)?lnk(?:go)?\.(?:alfa\.)?lt/(?:visi-video/[^/]+|video)/(?P<id>[A-Za-z0-9-]+)(?:/(?P<episode_id>\d+))?`]);
URL_REGEXS.set('loc.gov', [String.raw`https?://(?:www\.)?loc\.gov/(?:item/|today/cyberlc/feature_wdesc\.php\?.*\brec=)(?P<id>[0-9a-z_.]+)`]);
URL_REGEXS.set('www.loc.gov', [String.raw`https?://(?:www\.)?loc\.gov/(?:item/|today/cyberlc/feature_wdesc\.php\?.*\brec=)(?P<id>[0-9a-z_.]+)`]);
URL_REGEXS.set('www.localnews8.com', [String.raw`https?://(?:www\.)?localnews8\.com/(?:[^/]+/)*(?P<display_id>[^/]+)/(?P<id>[0-9]+)`]);
URL_REGEXS.set('lovehomeporn.com', [String.raw`https?://(?:www\.)?lovehomeporn\.com/video/(?P<id>\d+)(?:/(?P<display_id>[^/?#&]+))?`]);
URL_REGEXS.set('www.lrt.lt', [String.raw`https?://(?:www\.)?lrt\.lt/mediateka/tiesiogiai/(?P<id>[\w-]+)`, String.raw`https?://(?:www\.)?lrt\.lt(?P<path>/mediateka/irasas/(?P<id>[0-9]+))`]);
URL_REGEXS.set('www.lynda.com', [String.raw`(?x)https?://(?:www\.)?(?:lynda\.com|educourse\.ga)/(?:(?:[^/]+/){2,3}(?P<course_id>\d+)|player/embed)/(?P<id>\d+)`, String.raw`https?://(?:www|m)\.(?:lynda\.com|educourse\.ga)/(?P<coursepath>(?:[^/]+/){2,3}(?P<courseid>\d+))-2\.html`]);
URL_REGEXS.set('educourse.ga', [String.raw`(?x)https?://(?:www\.)?(?:lynda\.com|educourse\.ga)/(?:(?:[^/]+/){2,3}(?P<course_id>\d+)|player/embed)/(?P<id>\d+)`]);
URL_REGEXS.set('www.m6.fr', [String.raw`https?://(?:www\.)?m6\.fr/[^/]+/videos/(?P<id>\d+)-[^\.]+\.html`]);
URL_REGEXS.set('www.magenta-musik-360.de', [String.raw`https?://(?:www\.)?magenta-musik-360\.de/([a-z0-9-]+-(?P<id>[0-9]+)|festivals/.+)`]);
URL_REGEXS.set('my.mail.ru', [String.raw`(?x)https?://(?:(?:www|m|videoapi)\.)?my\.mail\.ru/+(?:video/.*\#video=/?(?P<idv1>(?:[^/]+/){3}\d+)|(?:videos/embed/)?(?:(?P<idv2prefix>(?:[^/]+/+){2})(?:video/(?:embed/)?)?(?P<idv2suffix>[^/]+/\d+))(?:\.html)?|(?:video/embed|\+/video/meta)/(?P<metaid>\d+))`, String.raw`https?://my\.mail\.ru/+music/+songs/+[^/?#&]+-(?P<id>[\da-f]+)`, String.raw`https?://my\.mail\.ru/+music/+search/+(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('m.my.mail.ru', [String.raw`(?x)https?://(?:(?:www|m|videoapi)\.)?my\.mail\.ru/+(?:video/.*\#video=/?(?P<idv1>(?:[^/]+/){3}\d+)|(?:videos/embed/)?(?:(?P<idv2prefix>(?:[^/]+/+){2})(?:video/(?:embed/)?)?(?P<idv2suffix>[^/]+/\d+))(?:\.html)?|(?:video/embed|\+/video/meta)/(?P<metaid>\d+))`]);
URL_REGEXS.set('videoapi.my.mail.ru', [String.raw`(?x)https?://(?:(?:www|m|videoapi)\.)?my\.mail\.ru/+(?:video/.*\#video=/?(?P<idv1>(?:[^/]+/){3}\d+)|(?:videos/embed/)?(?:(?P<idv2prefix>(?:[^/]+/+){2})(?:video/(?:embed/)?)?(?P<idv2suffix>[^/]+/\d+))(?:\.html)?|(?:video/embed|\+/video/meta)/(?P<metaid>\d+))`]);
URL_REGEXS.set('webtools-e18da6642b684f8aa9ae449862783a56.msvdn.net', [String.raw`https?://(?:webtools-?)?(?P<host>[A-Za-z0-9-]*\.msvdn.net)/(?:embed|amp_embed|content)/(?P<id>\w+)`]);
URL_REGEXS.set('webtools-859c1818ed614cc5b0047439470927b0.msvdn.net', [String.raw`https?://(?:webtools-?)?(?P<host>[A-Za-z0-9-]*\.msvdn.net)/(?:embed|amp_embed|content)/(?P<id>\w+)`]);
URL_REGEXS.set('webtools-f5842579ff984c1c98d63b8d789673eb.msvdn.net', [String.raw`https?://(?:webtools-?)?(?P<host>[A-Za-z0-9-]*\.msvdn.net)/(?:embed|amp_embed|content)/(?P<id>\w+)`]);
URL_REGEXS.set('f5842579ff984c1c98d63b8d789673eb.msvdn.net', [String.raw`https?://(?:webtools-?)?(?P<host>[A-Za-z0-9-]*\.msvdn.net)/(?:embed|amp_embed|content)/(?P<id>\w+)`]);
URL_REGEXS.set('webtools.msvdn.net', [String.raw`https?://(?:webtools-?)?(?P<host>[A-Za-z0-9-]*\.msvdn.net)/(?:embed|amp_embed|content)/(?P<id>\w+)`]);
URL_REGEXS.set('859c1818ed614cc5b0047439470927b0.msvdn.net', [String.raw`https?://(?:webtools-?)?(?P<host>[A-Za-z0-9-]*\.msvdn.net)/(?:embed|amp_embed|content)/(?P<id>\w+)`]);
URL_REGEXS.set('www.mall.tv', [String.raw`https?://(?:(?:www|sk)\.)?mall\.tv/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('sk.mall.tv', [String.raw`https?://(?:(?:www|sk)\.)?mall\.tv/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.mgtv.com', [String.raw`https?://(?:w(?:ww)?\.)?mgtv\.com/(v|b)/(?:[^/]+/)*(?P<id>\d+)\.html`]);
URL_REGEXS.set('w.mgtv.com', [String.raw`https?://(?:w(?:ww)?\.)?mgtv\.com/(v|b)/(?:[^/]+/)*(?P<id>\d+)\.html`]);
URL_REGEXS.set('www.manototv.com', [String.raw`https?://(?:www\.)?manototv\.com/episode/(?P<id>[0-9]+)`, String.raw`https?://(?:www\.)?manototv\.com/live/`, String.raw`https?://(?:www\.)?manototv\.com/show/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.manyvids.com', [String.raw`(?i)https?://(?:www\.)?manyvids\.com/video/(?P<id>\d+)`]);
URL_REGEXS.set('www.maoritelevision.com', [String.raw`https?://(?:www\.)?maoritelevision\.com/shows/(?:[^/]+/)+(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('videoarchiv.markiza.sk', [String.raw`https?://(?:www\.)?videoarchiv\.markiza\.sk/(?:video/(?:[^/]+/)*|embed/)(?P<id>\d+)(?:[_/]|$)`]);
URL_REGEXS.set('www.markiza.sk', [String.raw`https?://(?:www\.)?(?:(?:[^/]+\.)?markiza|tvnoviny)\.sk/(?:[^/]+/)*(?P<id>\d+)_`]);
URL_REGEXS.set('dajto.markiza.sk', [String.raw`https?://(?:www\.)?(?:(?:[^/]+\.)?markiza|tvnoviny)\.sk/(?:[^/]+/)*(?P<id>\d+)_`]);
URL_REGEXS.set('superstar.markiza.sk', [String.raw`https?://(?:www\.)?(?:(?:[^/]+\.)?markiza|tvnoviny)\.sk/(?:[^/]+/)*(?P<id>\d+)_`]);
URL_REGEXS.set('hybsa.markiza.sk', [String.raw`https?://(?:www\.)?(?:(?:[^/]+\.)?markiza|tvnoviny)\.sk/(?:[^/]+/)*(?P<id>\d+)_`]);
URL_REGEXS.set('doma.markiza.sk', [String.raw`https?://(?:www\.)?(?:(?:[^/]+\.)?markiza|tvnoviny)\.sk/(?:[^/]+/)*(?P<id>\d+)_`]);
URL_REGEXS.set('www.tvnoviny.sk', [String.raw`https?://(?:www\.)?(?:(?:[^/]+\.)?markiza|tvnoviny)\.sk/(?:[^/]+/)*(?P<id>\d+)_`]);
URL_REGEXS.set('massengeschmack.tv', [String.raw`https?://(?:www\.)?massengeschmack\.tv/play/(?P<id>[^?&#]+)`]);
URL_REGEXS.set('www.masters.com', [String.raw`https?://(?:www\.)?masters\.com/en_US/watch/(?P<date>\d{4}-\d{2}-\d{2})/(?P<id>\d+)`]);
URL_REGEXS.set('matchtv.ru', [String.raw`https?://matchtv\.ru(?:/on-air|/?#live-player)`, String.raw`https?://(?:news\.sportbox|matchtv)\.ru/vdl/player(?:/[^/]+/|\?.*?\bn?id=)(?P<id>\d+)`]);
URL_REGEXS.set('www.mdr.de', [String.raw`https?://(?:www\.)?(?:mdr|kika)\.de/(?:.*)/[a-z-]+-?(?P<id>\d+)(?:_.+?)?\.html`]);
URL_REGEXS.set('www.kika.de', [String.raw`https?://(?:www\.)?(?:mdr|kika)\.de/(?:.*)/[a-z-]+-?(?P<id>\d+)(?:_.+?)?\.html`]);
URL_REGEXS.set('medal.tv', [String.raw`https?://(?:www\.)?medal\.tv/(?P<path>games/[^/?#&]+/clips)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('media.ccc.de', [String.raw`https?://(?:www\.)?media\.ccc\.de/v/(?P<id>[^/?#&]+)`, String.raw`https?://(?:www\.)?media\.ccc\.de/c/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.mediaite.com', [String.raw`https?://(?:www\.)?mediaite.com(?!/category)(?:/[\w-]+){2}`]);
URL_REGEXS.set('mediaklikk.hu', [String.raw`(?x)https?://(?:www\.)?(?:mediaklikk|m4sport|hirado|petofilive)\.hu/.*?(?:videok?|cikk)/(?:(?P<year>[0-9]{4})/(?P<month>[0-9]{1,2})/(?P<day>[0-9]{1,2})/)?(?P<id>[^/#?_]+)`]);
URL_REGEXS.set('m4sport.hu', [String.raw`(?x)https?://(?:www\.)?(?:mediaklikk|m4sport|hirado|petofilive)\.hu/.*?(?:videok?|cikk)/(?:(?P<year>[0-9]{4})/(?P<month>[0-9]{1,2})/(?P<day>[0-9]{1,2})/)?(?P<id>[^/#?_]+)`]);
URL_REGEXS.set('hirado.hu', [String.raw`(?x)https?://(?:www\.)?(?:mediaklikk|m4sport|hirado|petofilive)\.hu/.*?(?:videok?|cikk)/(?:(?P<year>[0-9]{4})/(?P<month>[0-9]{1,2})/(?P<day>[0-9]{1,2})/)?(?P<id>[^/#?_]+)`]);
URL_REGEXS.set('petofilive.hu', [String.raw`(?x)https?://(?:www\.)?(?:mediaklikk|m4sport|hirado|petofilive)\.hu/.*?(?:videok?|cikk)/(?:(?P<year>[0-9]{4})/(?P<month>[0-9]{1,2})/(?P<day>[0-9]{1,2})/)?(?P<id>[^/#?_]+)`]);
URL_REGEXS.set('www.bndestem.nl', [String.raw`(?x)https?://(?:(?:embed\.)?mychannels.video/embed/|embed\.mychannels\.video/(?:s(?:dk|cript)/)?production/|(?:www\.)?(?:(?:7sur7|demorgen|hln|joe|qmusic)\.be|(?:[abe]d|bndestem|destentor|gelderlander|pzc|tubantia|volkskrant)\.nl)/video/(?:[^/]+/)*[^/?&#]+~p)(?P<id>\d+)`]);
URL_REGEXS.set('www.gelderlander.nl', [String.raw`(?x)https?://(?:(?:embed\.)?mychannels.video/embed/|embed\.mychannels\.video/(?:s(?:dk|cript)/)?production/|(?:www\.)?(?:(?:7sur7|demorgen|hln|joe|qmusic)\.be|(?:[abe]d|bndestem|destentor|gelderlander|pzc|tubantia|volkskrant)\.nl)/video/(?:[^/]+/)*[^/?&#]+~p)(?P<id>\d+)`]);
URL_REGEXS.set('embed.mychannels.video', [String.raw`(?x)https?://(?:(?:embed\.)?mychannels.video/embed/|embed\.mychannels\.video/(?:s(?:dk|cript)/)?production/|(?:www\.)?(?:(?:7sur7|demorgen|hln|joe|qmusic)\.be|(?:[abe]d|bndestem|destentor|gelderlander|pzc|tubantia|volkskrant)\.nl)/video/(?:[^/]+/)*[^/?&#]+~p)(?P<id>\d+)`]);
URL_REGEXS.set('mychannels.video', [String.raw`(?x)https?://(?:(?:embed\.)?mychannels.video/embed/|embed\.mychannels\.video/(?:s(?:dk|cript)/)?production/|(?:www\.)?(?:(?:7sur7|demorgen|hln|joe|qmusic)\.be|(?:[abe]d|bndestem|destentor|gelderlander|pzc|tubantia|volkskrant)\.nl)/video/(?:[^/]+/)*[^/?&#]+~p)(?P<id>\d+)`]);
URL_REGEXS.set('mediasetinfinity.mediaset.it', [String.raw`(?x)(?:mediaset:|https?://(?:\w+\.)+mediaset\.it/(?:(?:video|on-demand|movie)/(?:[^/]+/)+[^/]+_|player/(?:v\d+/)?index\.html\?\S*?\bprogramGuid=))(?P<id>F[0-9A-Z]{15})`, String.raw`(?x)(?:https?://(\w+\.)+mediaset\.it/(?:(?:fiction|programmi-tv|serie-tv|kids)/(?:.+?/)?(?:[a-z-]+)_SE(?P<id>\d{12})(?:,ST(?P<st>\d{12}))?(?:,sb(?P<sb>\d{9}))?$))`]);
URL_REGEXS.set('www.mediasetplay.mediaset.it', [String.raw`(?x)(?:mediaset:|https?://(?:\w+\.)+mediaset\.it/(?:(?:video|on-demand|movie)/(?:[^/]+/)+[^/]+_|player/(?:v\d+/)?index\.html\?\S*?\bprogramGuid=))(?P<id>F[0-9A-Z]{15})`]);
URL_REGEXS.set('static3.mediasetplay.mediaset.it', [String.raw`(?x)(?:mediaset:|https?://(?:\w+\.)+mediaset\.it/(?:(?:video|on-demand|movie)/(?:[^/]+/)+[^/]+_|player/(?:v\d+/)?index\.html\?\S*?\bprogramGuid=))(?P<id>F[0-9A-Z]{15})`]);
URL_REGEXS.set('hitsmediaweb.h-its.org', [String.raw`(?xi)https?://[^/]+/Mediasite/(?:Play|Showcase/[^/#?]+/Presentation)/(?P<id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14}))(?P<query>\?[^#]+|)`]);
URL_REGEXS.set('mediasite.uib.no', [String.raw`(?xi)https?://[^/]+/Mediasite/(?:Play|Showcase/[^/#?]+/Presentation)/(?P<id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14}))(?P<query>\?[^#]+|)`]);
URL_REGEXS.set('collegerama.tudelft.nl', [String.raw`(?xi)https?://[^/]+/Mediasite/(?:Play|Showcase/[^/#?]+/Presentation)/(?P<id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14}))(?P<query>\?[^#]+|)`]);
URL_REGEXS.set('digitalops.sandia.gov', [String.raw`(?xi)https?://[^/]+/Mediasite/(?:Play|Showcase/[^/#?]+/Presentation)/(?P<id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14}))(?P<query>\?[^#]+|)`]);
URL_REGEXS.set('mediasite.ntnu.no', [String.raw`(?xi)https?://[^/]+/Mediasite/(?:Play|Showcase/[^/#?]+/Presentation)/(?P<id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14}))(?P<query>\?[^#]+|)`]);
URL_REGEXS.set('events7.mediasite.com', [String.raw`(?xi)(?P<url>https?://[^/]+/Mediasite)/Catalog/Full/(?P<catalog_id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14}))(?:/(?P<current_folder_id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14}))/(?P<root_dynamic_folder_id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14})))?`]);
URL_REGEXS.set('medaudio.medicine.iu.edu', [String.raw`(?xi)(?P<url>https?://[^/]+/Mediasite)/Catalog/Full/(?P<catalog_id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14}))(?:/(?P<current_folder_id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14}))/(?P<root_dynamic_folder_id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14})))?`]);
URL_REGEXS.set('uipsyc.mediasite.com', [String.raw`(?xi)(?P<url>https?://[^/]+/Mediasite)/Catalog/Full/(?P<catalog_id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14}))(?:/(?P<current_folder_id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14}))/(?P<root_dynamic_folder_id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14})))?`]);
URL_REGEXS.set('live.libraries.psu.edu', [String.raw`(?xi)(?P<url>https?://[^/]+/Mediasite)/Catalog/Full/(?P<catalog_id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14}))(?:/(?P<current_folder_id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14}))/(?P<root_dynamic_folder_id>(?:[0-9a-f]{32,34}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12,14})))?`]);
URL_REGEXS.set('msite.misis.ru', [String.raw`(?xi)(?P<url>https?://[^/]+/Mediasite)/Catalog/catalogs/(?P<catalog_name>[^/?#&]+)`]);
URL_REGEXS.set('mdstrm.com', [String.raw`https?://mdstrm.com/(?:embed|live-stream)/(?P<id>\w+)`]);
URL_REGEXS.set('vodupload-api.mediaworks.nz', [String.raw`https?://vodupload-api\.mediaworks\.nz/library/asset/published/(?P<id>[A-Za-z0-9-]+)`]);
URL_REGEXS.set('www.medici.tv', [String.raw`https?://(?:www\.)?medici\.tv/#!/(?P<id>[^?#&]+)`, String.raw`.*`]);
URL_REGEXS.set('player.megaphone.fm', [String.raw`https://player\.megaphone\.fm/(?P<id>[A-Z0-9]+)`]);
URL_REGEXS.set('www.megatv.com', [String.raw`https?://(?:www\.)?megatv\.com/(?:\d{4}/\d{2}/\d{2}|[^/]+/(?P<id>\d+))/(?P<slug>[^/]+)`, String.raw`(?:https?:)?//(?:www\.)?megatv\.com/embed/?\?p=(?P<id>\d+)`]);
URL_REGEXS.set('www.meipai.com', [String.raw`https?://(?:www\.)?meipai\.com/media/(?P<id>[0-9]+)`]);
URL_REGEXS.set('vod.melon.com', [String.raw`https?://vod\.melon\.com/video/detail2\.html?\?.*?mvId=(?P<id>[0-9]+)`]);
URL_REGEXS.set('video.meta.ua', [String.raw`https?://video\.meta\.ua/(?:iframe/)?(?P<id>[0-9]+)`]);
URL_REGEXS.set('metacafe.com', [String.raw`https?://(?:www\.)?metacafe\.com/watch/(?P<id>[^/]+)/(?P<display_id>[^/?#]+)`]);
URL_REGEXS.set('www.metacafe.com', [String.raw`https?://(?:www\.)?metacafe\.com/watch/(?P<id>[^/]+)/(?P<display_id>[^/?#]+)`]);
URL_REGEXS.set('www.metacritic.com', [String.raw`https?://(?:www\.)?metacritic\.com/.+?/trailers/(?P<id>\d+)`]);
URL_REGEXS.set('www.mewatch.sg', [String.raw`https?://(?:(?:www|live)\.)?mewatch\.sg/watch/[^/?#&]+-(?P<id>[0-9]+)`, String.raw`(?:https?://(?:(?:www\.)?mewatch|video\.toggle)\.sg/(?:en|zh)/(?:[^/]+/){2,}|toggle:)(?P<id>[0-9]+)`]);
URL_REGEXS.set('live.mewatch.sg', [String.raw`https?://(?:(?:www|live)\.)?mewatch\.sg/watch/[^/?#&]+-(?P<id>[0-9]+)`]);
URL_REGEXS.set('m.mgoon.com', [String.raw`(?x)https?://(?:www\.)?(?:(:?m\.)?mgoon\.com/(?:ch/(?:.+)/v|play/view)|video\.mgoon\.com)/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.mgoon.com', [String.raw`(?x)https?://(?:www\.)?(?:(:?m\.)?mgoon\.com/(?:ch/(?:.+)/v|play/view)|video\.mgoon\.com)/(?P<id>[0-9]+)`]);
URL_REGEXS.set('video.mgoon.com', [String.raw`(?x)https?://(?:www\.)?(?:(:?m\.)?mgoon\.com/(?:ch/(?:.+)/v|play/view)|video\.mgoon\.com)/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.miaopai.com', [String.raw`https?://(?:www\.)?miaopai\.com/show/(?P<id>[-A-Za-z0-9~_]+)`]);
URL_REGEXS.set('www.microsoft.com', [String.raw`https?://(?:www\.)?microsoft\.com/(?:[^/]+/)?videoplayer/embed/(?P<id>[a-z0-9A-Z]+)`]);
URL_REGEXS.set('web.microsoftstream.com', [String.raw`https?://(?:web|www|msit)\.microsoftstream\.com/video/(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`]);
URL_REGEXS.set('msit.microsoftstream.com', [String.raw`https?://(?:web|www|msit)\.microsoftstream\.com/video/(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`]);
URL_REGEXS.set('www.mildom.com', [String.raw`https?://(?:(?:www|m)\.)mildom\.com/clip/(?P<id>(?P<user_id>\d+)-[a-zA-Z0-9]+)`, String.raw`https?://(?:(?:www|m)\.)mildom\.com/profile/(?P<id>\d+)`, String.raw`https?://(?:(?:www|m)\.)mildom\.com/playback/(?P<user_id>\d+)/(?P<id>(?P=user_id)-[a-zA-Z0-9]+-?[0-9]*)`]);
URL_REGEXS.set('www.minds.com', [String.raw`https?://(?:www\.)?minds\.com/(?:media|newsfeed|archive/view)/(?P<id>[0-9]+)`, String.raw`https?://(?:www\.)?minds\.com/(?!(?:newsfeed|media|api|archive|groups)/)(?P<id>[^/?&#]+)`, String.raw`https?://(?:www\.)?minds\.com/groups/profile/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.ministrygrid.com', [String.raw`https?://(?:www\.)?ministrygrid\.com/([^/?#]*/)*(?P<id>[^/#?]+)/?(?:$|[?#])`]);
URL_REGEXS.set('www.miomio.tv', [String.raw`https?://(?:www\.)?miomio\.tv/watch/cc(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.mirrativ.com', [String.raw`https?://(?:www\.)?mirrativ\.com/user/(?P<id>\d+)`]);
URL_REGEXS.set('www.mirror.co.uk', [String.raw`https?://(?:www\.)?mirror\.co\.uk/[/+[\w-]+-(?P<id>\d+)`]);
URL_REGEXS.set('www.mitele.es', [String.raw`https?://(?:www\.)?mitele\.es/(?:[^/]+/)+(?P<id>[^/]+)/player`]);
URL_REGEXS.set('mixch.tv', [String.raw`https?://(?:www\.)?mixch\.tv/u/(?P<id>\d+)`, String.raw`https?://(?:www\.)?mixch\.tv/archive/(?P<id>\d+)`]);
URL_REGEXS.set('www.mixcloud.com', [String.raw`https?://(?:(?:www|beta|m)\.)?mixcloud\.com/([^/]+)/(?!stream|uploads|favorites|listens|playlists)([^/]+)`, String.raw`https?://(?:www\.)?mixcloud\.com/(?P<user>[^/]+)/playlists/(?P<playlist>[^/]+)/?$`, String.raw`https?://(?:www\.)?mixcloud\.com/(?P<id>[^/]+)/(?P<type>uploads|favorites|listens|stream)?/?$`]);
URL_REGEXS.set('beta.mixcloud.com', [String.raw`https?://(?:(?:www|beta|m)\.)?mixcloud\.com/([^/]+)/(?!stream|uploads|favorites|listens|playlists)([^/]+)`]);
URL_REGEXS.set('www.mlb.com', [String.raw`(?x)https?://(?:[\da-z_-]+\.)*mlb\.com/(?:(?:(?:[^/]+/)*video/[^/]+/c-|(?:shared/video/embed/(?:embed|m-internal-embed)\.html|(?:[^/]+/)+(?:play|index)\.jsp|)\?.*?\bcontent_id=)(?P<id>\d+))`, String.raw`https?://www\.mlb\.com/news/(?P<id>[\w-]+)`, String.raw`https?://(?:www\.)?mlb\.com/tv/g(?P<id>\d{6})`, String.raw`https?://(?:www\.)?mlb\.com/(?:[^/]+/)*video/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('m.mlb.com', [String.raw`(?x)https?://(?:[\da-z_-]+\.)*mlb\.com/(?:(?:(?:[^/]+/)*video/[^/]+/c-|(?:shared/video/embed/(?:embed|m-internal-embed)\.html|(?:[^/]+/)+(?:play|index)\.jsp|)\?.*?\bcontent_id=)(?P<id>\d+))`]);
URL_REGEXS.set('mlb.mlb.com', [String.raw`(?x)https?://(?:[\da-z_-]+\.)*mlb\.com/(?:(?:(?:[^/]+/)*video/[^/]+/c-|(?:shared/video/embed/(?:embed|m-internal-embed)\.html|(?:[^/]+/)+(?:play|index)\.jsp|)\?.*?\bcontent_id=)(?P<id>\d+))`]);
URL_REGEXS.set('www.mlssoccer.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.whitecapsfc.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.torontofc.ca', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.sportingkc.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.soundersfc.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.sjearthquakes.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.rsl.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.timbers.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.philadelphiaunion.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.orlandocitysc.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.newyorkredbulls.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.nycfc.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.revolutionsoccer.net', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.nashvillesc.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.cfmontreal.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.intermiamicf.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.lagalaxy.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.lafc.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.houstondynamofc.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.dcunited.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.fcdallas.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.columbuscrew.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.coloradorapids.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.fccincinnati.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.chicagofirefc.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.austinfc.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.atlutd.com', [String.raw`https?://(?:www\.)?(?:(?:cfmontreal|intermiamicf|lagalaxy|lafc|houstondynamofc|dcunited|atlutd|mlssoccer|fcdallas|columbuscrew|coloradorapids|fccincinnati|chicagofirefc|austinfc|nashvillesc|whitecapsfc|sportingkc|soundersfc|sjearthquakes|rsl|timbers|philadelphiaunion|orlandocitysc|newyorkredbulls|nycfc)\.com|(?:torontofc)\.ca|(?:revolutionsoccer)\.net)/video/#?(?P<id>[^/&$#?]+)`]);
URL_REGEXS.set('www.mnet.com', [String.raw`https?://(?:www\.)?mnet\.(?:com|interest\.me)/tv/vod/(?:.*?\bclip_id=)?(?P<id>[0-9]+)`]);
URL_REGEXS.set('mnet.interest.me', [String.raw`https?://(?:www\.)?mnet\.(?:com|interest\.me)/tv/vod/(?:.*?\bclip_id=)?(?P<id>[0-9]+)`]);
URL_REGEXS.set('tvplus.m-net.de', [String.raw`(?x)https?://(?:www\.)?tvplus\.m\-net\.de/(?:[^?#]+\?(?:[^#]+&)?program=(?P<vid2>\d+)|(?:program|watch)/[^/]+/(?P<vid1>\d+))`, String.raw`(?x)https?://(?:www\.)?tvplus\.m\-net\.de/(?:[^?#]+\?(?:[^#]+&)?channel=(?P<vid2>[^/?&#]+)|live/(?P<vid1>[^/?&#]+))`, String.raw`(?x)https?://(?:www\.)?tvplus\.m\-net\.de/(?:[^?#]+\?(?:[^#]+&)?recording=(?P<vid2>\d+)(?P<vid1>))`]);
URL_REGEXS.set('video.mocha.com.vn', [String.raw`https?://video.mocha.com.vn/(?P<video_slug>[\w-]+)`]);
URL_REGEXS.set('moevideo.net', [String.raw`(?x)https?://(?P<host>(?:www\.)?(?:(?:moevideo|playreplay|videochart)\.net|thesame\.tv))/(?:video|framevideo|embed)/(?P<id>[0-9a-z]+\.[0-9A-Za-z]+)`]);
URL_REGEXS.set('playreplay.net', [String.raw`(?x)https?://(?P<host>(?:www\.)?(?:(?:moevideo|playreplay|videochart)\.net|thesame\.tv))/(?:video|framevideo|embed)/(?P<id>[0-9a-z]+\.[0-9A-Za-z]+)`]);
URL_REGEXS.set('www.mofosex.com', [String.raw`https?://(?:www\.)?mofosex\.com/videos/(?P<id>\d+)/(?P<display_id>[^/?#&.]+)\.html`, String.raw`https?://(?:www\.)?mofosex\.com/embed/?\?.*?\bvideoid=(?P<id>\d+)`]);
URL_REGEXS.set('www.mojvideo.com', [String.raw`https?://(?:www\.)?mojvideo\.com/video-(?P<display_id>[^/]+)/(?P<id>[a-f0-9]+)`]);
URL_REGEXS.set('www.morningstar.com', [String.raw`https?://(?:(?:www|news)\.)morningstar\.com/[cC]over/video[cC]enter\.aspx\?id=(?P<id>[0-9]+)`]);
URL_REGEXS.set('news.morningstar.com', [String.raw`https?://(?:(?:www|news)\.)morningstar\.com/[cC]over/video[cC]enter\.aspx\?id=(?P<id>[0-9]+)`]);
URL_REGEXS.set('motherless.com', [String.raw`https?://(?:www\.)?motherless\.com/(?:g/[a-z0-9_]+/)?(?P<id>[A-Z0-9]+)`, String.raw`https?://(?:www\.)?motherless\.com/gv?/(?P<id>[a-z0-9_]+)`]);
URL_REGEXS.set('www.motorsport.com', [String.raw`https?://(?:www\.)?motorsport\.com/[^/?#]+/video/(?:[^/?#]+/)(?P<id>[^/]+)/?(?:$|[?#])`]);
URL_REGEXS.set('watch.motortrend.com', [String.raw`https?://(?:watch\.)?motortrend\.com/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.motortrendondemand.com', [String.raw`https?://(?:www\.)?motortrendondemand\.com/detail/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.movieclips.com', [String.raw`https?://(?:www\.)?movieclips\.com/videos/.+-(?P<id>\d+)(?:\?|$)`]);
URL_REGEXS.set('www.moviefap.com', [String.raw`https?://(?:www\.)?(?P<host>moviefap)\.com/videos/(?P<id>[0-9a-f]+)/(?P<display_id>[^/]+)\.html`]);
URL_REGEXS.set('www.moviepilot.de', [String.raw`https?://(?:www\.)?moviepilot\.de/movies/(?P<id>[^/]+)`]);
URL_REGEXS.set('www.moview.id', [String.raw`https?://www\.moview\.id/play/\d+/(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.moviezine.se', [String.raw`https?://(?:www\.)?moviezine\.se/video/(?P<id>[^?#]+)`]);
URL_REGEXS.set('movingimage.nls.uk', [String.raw`https?://movingimage\.nls\.uk/film/(?P<id>\d+)`]);
URL_REGEXS.set('www.msn.com', [String.raw`https?://(?:(?:www|preview)\.)?msn\.com/(?:[^/]+/)+(?P<display_id>[^/]+)/[a-z]{2}-(?P<id>[\da-zA-Z]+)`]);
URL_REGEXS.set('www.tvplay.lv', [String.raw`(?x)(?:mtg:|https?://(?:www\.)?(?:tvplay(?:\.skaties)?\.lv(?:/parraides)?|(?:tv3play|play\.tv3)\.lt(?:/programos)?|tv3play(?:\.tv3)?\.ee/sisu|(?:tv(?:3|6|8|10)play)\.se/program|(?:(?:tv3play|viasat4play|tv6play)\.no|(?:tv3play)\.dk)/programmer|play\.nova(?:tv)?\.bg/programi)/(?:[^/]+/)+)(?P<id>\d+)`]);
URL_REGEXS.set('play.tv3.lt', [String.raw`(?x)(?:mtg:|https?://(?:www\.)?(?:tvplay(?:\.skaties)?\.lv(?:/parraides)?|(?:tv3play|play\.tv3)\.lt(?:/programos)?|tv3play(?:\.tv3)?\.ee/sisu|(?:tv(?:3|6|8|10)play)\.se/program|(?:(?:tv3play|viasat4play|tv6play)\.no|(?:tv3play)\.dk)/programmer|play\.nova(?:tv)?\.bg/programi)/(?:[^/]+/)+)(?P<id>\d+)`, String.raw`(?x)https?://(?:tv3?)?play\.(?:tv3|skaties)\.(?P<country>lv|lt|ee)/(?P<live>lives/)?[^?#&]+(?:episode|programme|clip)-(?P<id>\d+)`]);
URL_REGEXS.set('www.tv3play.ee', [String.raw`(?x)(?:mtg:|https?://(?:www\.)?(?:tvplay(?:\.skaties)?\.lv(?:/parraides)?|(?:tv3play|play\.tv3)\.lt(?:/programos)?|tv3play(?:\.tv3)?\.ee/sisu|(?:tv(?:3|6|8|10)play)\.se/program|(?:(?:tv3play|viasat4play|tv6play)\.no|(?:tv3play)\.dk)/programmer|play\.nova(?:tv)?\.bg/programi)/(?:[^/]+/)+)(?P<id>\d+)`]);
URL_REGEXS.set('www.tv3play.se', [String.raw`(?x)(?:mtg:|https?://(?:www\.)?(?:tvplay(?:\.skaties)?\.lv(?:/parraides)?|(?:tv3play|play\.tv3)\.lt(?:/programos)?|tv3play(?:\.tv3)?\.ee/sisu|(?:tv(?:3|6|8|10)play)\.se/program|(?:(?:tv3play|viasat4play|tv6play)\.no|(?:tv3play)\.dk)/programmer|play\.nova(?:tv)?\.bg/programi)/(?:[^/]+/)+)(?P<id>\d+)`]);
URL_REGEXS.set('www.tv6play.se', [String.raw`(?x)(?:mtg:|https?://(?:www\.)?(?:tvplay(?:\.skaties)?\.lv(?:/parraides)?|(?:tv3play|play\.tv3)\.lt(?:/programos)?|tv3play(?:\.tv3)?\.ee/sisu|(?:tv(?:3|6|8|10)play)\.se/program|(?:(?:tv3play|viasat4play|tv6play)\.no|(?:tv3play)\.dk)/programmer|play\.nova(?:tv)?\.bg/programi)/(?:[^/]+/)+)(?P<id>\d+)`]);
URL_REGEXS.set('www.tv8play.se', [String.raw`(?x)(?:mtg:|https?://(?:www\.)?(?:tvplay(?:\.skaties)?\.lv(?:/parraides)?|(?:tv3play|play\.tv3)\.lt(?:/programos)?|tv3play(?:\.tv3)?\.ee/sisu|(?:tv(?:3|6|8|10)play)\.se/program|(?:(?:tv3play|viasat4play|tv6play)\.no|(?:tv3play)\.dk)/programmer|play\.nova(?:tv)?\.bg/programi)/(?:[^/]+/)+)(?P<id>\d+)`]);
URL_REGEXS.set('www.tv3play.no', [String.raw`(?x)(?:mtg:|https?://(?:www\.)?(?:tvplay(?:\.skaties)?\.lv(?:/parraides)?|(?:tv3play|play\.tv3)\.lt(?:/programos)?|tv3play(?:\.tv3)?\.ee/sisu|(?:tv(?:3|6|8|10)play)\.se/program|(?:(?:tv3play|viasat4play|tv6play)\.no|(?:tv3play)\.dk)/programmer|play\.nova(?:tv)?\.bg/programi)/(?:[^/]+/)+)(?P<id>\d+)`]);
URL_REGEXS.set('www.viasat4play.no', [String.raw`(?x)(?:mtg:|https?://(?:www\.)?(?:tvplay(?:\.skaties)?\.lv(?:/parraides)?|(?:tv3play|play\.tv3)\.lt(?:/programos)?|tv3play(?:\.tv3)?\.ee/sisu|(?:tv(?:3|6|8|10)play)\.se/program|(?:(?:tv3play|viasat4play|tv6play)\.no|(?:tv3play)\.dk)/programmer|play\.nova(?:tv)?\.bg/programi)/(?:[^/]+/)+)(?P<id>\d+)`]);
URL_REGEXS.set('www.tv6play.no', [String.raw`(?x)(?:mtg:|https?://(?:www\.)?(?:tvplay(?:\.skaties)?\.lv(?:/parraides)?|(?:tv3play|play\.tv3)\.lt(?:/programos)?|tv3play(?:\.tv3)?\.ee/sisu|(?:tv(?:3|6|8|10)play)\.se/program|(?:(?:tv3play|viasat4play|tv6play)\.no|(?:tv3play)\.dk)/programmer|play\.nova(?:tv)?\.bg/programi)/(?:[^/]+/)+)(?P<id>\d+)`]);
URL_REGEXS.set('play.novatv.bg', [String.raw`(?x)(?:mtg:|https?://(?:www\.)?(?:tvplay(?:\.skaties)?\.lv(?:/parraides)?|(?:tv3play|play\.tv3)\.lt(?:/programos)?|tv3play(?:\.tv3)?\.ee/sisu|(?:tv(?:3|6|8|10)play)\.se/program|(?:(?:tv3play|viasat4play|tv6play)\.no|(?:tv3play)\.dk)/programmer|play\.nova(?:tv)?\.bg/programi)/(?:[^/]+/)+)(?P<id>\d+)`]);
URL_REGEXS.set('play.nova.bg', [String.raw`(?x)(?:mtg:|https?://(?:www\.)?(?:tvplay(?:\.skaties)?\.lv(?:/parraides)?|(?:tv3play|play\.tv3)\.lt(?:/programos)?|tv3play(?:\.tv3)?\.ee/sisu|(?:tv(?:3|6|8|10)play)\.se/program|(?:(?:tv3play|viasat4play|tv6play)\.no|(?:tv3play)\.dk)/programmer|play\.nova(?:tv)?\.bg/programi)/(?:[^/]+/)+)(?P<id>\d+)`, String.raw`https://play.nova\.bg/video/.*/(?P<id>\d+)`]);
URL_REGEXS.set('tvplay.skaties.lv', [String.raw`(?x)(?:mtg:|https?://(?:www\.)?(?:tvplay(?:\.skaties)?\.lv(?:/parraides)?|(?:tv3play|play\.tv3)\.lt(?:/programos)?|tv3play(?:\.tv3)?\.ee/sisu|(?:tv(?:3|6|8|10)play)\.se/program|(?:(?:tv3play|viasat4play|tv6play)\.no|(?:tv3play)\.dk)/programmer|play\.nova(?:tv)?\.bg/programi)/(?:[^/]+/)+)(?P<id>\d+)`]);
URL_REGEXS.set('tv3play.tv3.ee', [String.raw`(?x)(?:mtg:|https?://(?:www\.)?(?:tvplay(?:\.skaties)?\.lv(?:/parraides)?|(?:tv3play|play\.tv3)\.lt(?:/programos)?|tv3play(?:\.tv3)?\.ee/sisu|(?:tv(?:3|6|8|10)play)\.se/program|(?:(?:tv3play|viasat4play|tv6play)\.no|(?:tv3play)\.dk)/programmer|play\.nova(?:tv)?\.bg/programi)/(?:[^/]+/)+)(?P<id>\d+)`]);
URL_REGEXS.set('www.mtv.com', [String.raw`https?://(?:www\.)?mtv\.com/(?:video-clips|(?:full-)?episodes)/(?P<id>[^/?#.]+)`, String.raw`(?x)^https?://(?:(?:www\.)?mtv\.com/videos/.+?/(?P<videoid>[0-9]+)/[^/]+$|m\.mtv\.com/videos/video\.rbml\?.*?id=(?P<mgid>[^&]+))`]);
URL_REGEXS.set('www.mtv.de', [String.raw`https?://(?:www\.)?mtv\.de/(?:musik/videoclips|folgen|news)/(?P<id>[0-9a-z]+)`]);
URL_REGEXS.set('www.mtv.it', [String.raw`https?://(?:www\.)?mtv\.it/(?:episodi|video|musica)/(?P<id>[0-9a-z]+)`, String.raw`https?://(?:www\.)?mtv\.it/(?:programmi|playlist)/(?P<id>[0-9a-z]+)`]);
URL_REGEXS.set('www.mtvjapan.com', [String.raw`https?://(?:www\.)?mtvjapan\.com/videos/(?P<id>[0-9a-z]+)`]);
URL_REGEXS.set('media.mtvnservices.com', [String.raw`https?://media\.mtvnservices\.com/embed/(?P<mgid>.+?)(\?|/|$)`]);
URL_REGEXS.set('www.muenchen.tv', [String.raw`https?://(?:www\.)?muenchen\.tv/livestream`]);
URL_REGEXS.set('murrtube.net', [String.raw`(?x)(?:murrtube:|https?://murrtube\.net/videos/(?P<slug>[a-z0-9\-]+)\-)(?P<id>[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12})`, String.raw`https?://murrtube\.net/(?P<id>[^/]+)$`]);
URL_REGEXS.set('musescore.com', [String.raw`https?://(?:www\.)?musescore\.com/(?:user/\d+|[^/]+)(?:/scores)?/(?P<id>[^#&?]+)`]);
URL_REGEXS.set('www.musicdex.org', [String.raw`https?://(?:www\.)?musicdex\.org/album/(?P<id>\d+)`, String.raw`https?://(?:www\.)?musicdex\.org/artist/(?P<id>\d+)`, String.raw`https?://(?:www\.)?musicdex\.org/playlist/(?P<id>\d+)`, String.raw`https?://(?:www\.)?musicdex\.org/track/(?P<id>\d+)`]);
URL_REGEXS.set('mva.microsoft.com', [String.raw`(?:mva:|https?://(?:mva\.microsoft|(?:www\.)?microsoftvirtualacademy)\.com/[^/]+/training-courses/[^/?#&]+-)(?P<course_id>\d+)(?::|\?l=)(?P<id>[\da-zA-Z]+_\d+)`, String.raw`(?:mva:course:|https?://(?:mva\.microsoft|(?:www\.)?microsoftvirtualacademy)\.com/[^/]+/training-courses/(?P<display_id>[^/?#&]+)-)(?P<id>\d+)`]);
URL_REGEXS.set('www.microsoftvirtualacademy.com', [String.raw`(?:mva:course:|https?://(?:mva\.microsoft|(?:www\.)?microsoftvirtualacademy)\.com/[^/]+/training-courses/(?P<display_id>[^/?#&]+)-)(?P<id>\d+)`]);
URL_REGEXS.set('mwave.interest.me', [String.raw`https?://mwave\.interest\.me/(?:[^/]+/)?mnettv/videodetail\.m\?searchVideoDetailVO\.clip_id=(?P<id>[0-9]+)`, String.raw`https?://mwave\.interest\.me/(?:[^/]+/)?meetgreet/view/(?P<id>\d+)`]);
URL_REGEXS.set('www.mxplayer.in', [String.raw`https?://(?:www\.)?mxplayer\.in/(?P<type>movie|show/[-\w]+/[-\w]+)/(?P<display_id>[-\w]+)-(?P<id>\w+)`, String.raw`https?://(?:www\.)?mxplayer\.in/show/(?P<display_id>[-\w]+)-(?P<id>\w+)/?(?:$|[#?])`]);
URL_REGEXS.set('mychannels.com', [String.raw`https?://(?:www\.)?mychannels\.com/.*(?P<id_type>video|production)_id=(?P<id>[0-9]+)`]);
URL_REGEXS.set('myspace.com', [String.raw`(?x)https?://myspace\.com/[^/]+/(?P<mediatype>video/[^/]+/(?P<video_id>\d+)|music/song/[^/?#&]+-(?P<song_id>\d+)-\d+(?:[/?#&]|$))`, String.raw`https?://myspace\.com/([^/]+)/music/album/(?P<title>.*-)(?P<id>\d+)`]);
URL_REGEXS.set('www.myspass.de', [String.raw`https?://(?:www\.)?myspass\.de/(?:[^/]+/)*(?P<id>\d+)/?[^/]*$`]);
URL_REGEXS.set('myvi.ru', [String.raw`(?x)(?:https?://(?:www\.)?myvi\.(?:(?:ru/player|tv)/(?:(?:embed/html|flash|api/Video/Get)/|content/preloader\.swf\?.*\bid=)|ru/watch/)|myvi:)(?P<id>[\da-zA-Z_-]+)`]);
URL_REGEXS.set('myvi.tv', [String.raw`(?x)(?:https?://(?:www\.)?myvi\.(?:(?:ru/player|tv)/(?:(?:embed/html|flash|api/Video/Get)/|content/preloader\.swf\?.*\bid=)|ru/watch/)|myvi:)(?P<id>[\da-zA-Z_-]+)`]);
URL_REGEXS.set('www.myvi.ru', [String.raw`(?x)(?:https?://(?:www\.)?myvi\.(?:(?:ru/player|tv)/(?:(?:embed/html|flash|api/Video/Get)/|content/preloader\.swf\?.*\bid=)|ru/watch/)|myvi:)(?P<id>[\da-zA-Z_-]+)`]);
URL_REGEXS.set('www.myvideo.ge', [String.raw`https?://(?:www\.)?myvideo\.ge/v/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.myvidster.com', [String.raw`https?://(?:www\.)?myvidster\.com/video/(?P<id>\d+)/`]);
URL_REGEXS.set('www.myvi.tv', [String.raw`https?://(?:www\.)?myvi\.tv/(?:[^?]+\?.*?\bv=|embed/)(?P<id>[\da-z]+)`]);
URL_REGEXS.set('www.n-tv.de', [String.raw`https?://(?:www\.)?n-tv\.de/mediathek/videos/[^/?#]+/[^/?#]+-article(?P<id>.+)\.html`]);
URL_REGEXS.set('rs.n1info.com', [String.raw`https?://(?:(?:(?:ba|rs|hr)\.)?n1info\.(?:com|si)|nova\.rs)/(?:[^/]+/){1,2}(?P<id>[^/]+)`]);
URL_REGEXS.set('n1info.si', [String.raw`https?://(?:(?:(?:ba|rs|hr)\.)?n1info\.(?:com|si)|nova\.rs)/(?:[^/]+/){1,2}(?P<id>[^/]+)`]);
URL_REGEXS.set('ba.n1info.com', [String.raw`https?://(?:(?:(?:ba|rs|hr)\.)?n1info\.(?:com|si)|nova\.rs)/(?:[^/]+/){1,2}(?P<id>[^/]+)`]);
URL_REGEXS.set('nova.rs', [String.raw`https?://(?:(?:(?:ba|rs|hr)\.)?n1info\.(?:com|si)|nova\.rs)/(?:[^/]+/){1,2}(?P<id>[^/]+)`]);
URL_REGEXS.set('hr.n1info.com', [String.raw`https?://(?:(?:(?:ba|rs|hr)\.)?n1info\.(?:com|si)|nova\.rs)/(?:[^/]+/){1,2}(?P<id>[^/]+)`]);
URL_REGEXS.set('best-vod.umn.cdn.united.cloud', [String.raw`https?://best-vod\.umn\.cdn\.united\.cloud/stream\?asset=(?P<id>[^&]+)`]);
URL_REGEXS.set('tv.nate.com', [String.raw`https?://tv\.nate\.com/clip/(?P<id>[0-9]+)`, String.raw`https?://tv\.nate\.com/program/clips/(?P<id>[0-9]+)`]);
URL_REGEXS.set('video.nationalgeographic.com', [String.raw`https?://video\.nationalgeographic\.com/.*?`]);
URL_REGEXS.set('www.nationalgeographic.com', [String.raw`https?://(?:www\.)?nationalgeographic\.com/tv/watch/(?P<id>[\da-fA-F]+)`]);
URL_REGEXS.set('tv.naver.com', [String.raw`https?://(?:m\.)?tv(?:cast)?\.naver\.com/(?:v|embed)/(?P<id>\d+)`, String.raw`https?://(?:m\.)?tv(?:cast)?\.naver\.com/l/(?P<id>\d+)`]);
URL_REGEXS.set('tvcast.naver.com', [String.raw`https?://(?:m\.)?tv(?:cast)?\.naver\.com/(?:v|embed)/(?P<id>\d+)`]);
URL_REGEXS.set('now.naver.com', [String.raw`https?://now\.naver\.com/s/now\.(?P<id>\w+)`]);
URL_REGEXS.set('www.nba.com', [String.raw`(?x)https?://(?:www\.)?nba\.com/(?P<team>blazers|bucks|bulls|cavaliers|celtics|clippers|grizzlies|hawks|heat|hornets|jazz|kings|knicks|lakers|magic|mavericks|nets|nuggets|pacers|pelicans|pistons|raptors|rockets|sixers|spurs|suns|thunder|timberwolves|warriors|wizards)(?:/play\#)?/(?!video/channel|series)video/(?P<id>(?:[^/]+/)*[^/?#&]+)`, String.raw`https?://(?:(?:www\.)?nba\.com(?:/watch)?|watch\.nba\.com)/(?:nba/)?video/(?P<id>.+?(?=/index\.html)|(?:[^/]+/)*[^/?#&]+)`, String.raw`(?x)https?://(?:www\.)?nba\.com/(?P<team>blazers|bucks|bulls|cavaliers|celtics|clippers|grizzlies|hawks|heat|hornets|jazz|kings|knicks|lakers|magic|mavericks|nets|nuggets|pacers|pelicans|pistons|raptors|rockets|sixers|spurs|suns|thunder|timberwolves|warriors|wizards)(?:/play\#)?/(?:video/channel|series)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('watch.nba.com', [String.raw`https?://(?:(?:www\.)?nba\.com(?:/watch)?|watch\.nba\.com)/(?:nba/)?video/(?P<id>.+?(?=/index\.html)|(?:[^/]+/)*[^/?#&]+)`, String.raw`https?://(?:(?:www\.)?nba\.com(?:/watch)?|watch\.nba\.com)/list/collection/(?P<id>[^/?#&]+)`, String.raw`https?://(?:(?:www\.)?nba\.com(?:/watch)?|watch\.nba\.com)/embed\?.*?\bid=(?P<id>\d+)`]);
URL_REGEXS.set('secure.nba.com', [String.raw`https?://secure\.nba\.com/assets/amp/include/video/(?:topI|i)frame\.html\?.*?\bcontentId=(?P<id>[^?#&]+)`]);
URL_REGEXS.set('www.nbc.com', [String.raw`https?(?P<permalink>://(?:www\.)?nbc\.com/(?:classic-tv/)?[^/]+/video/[^/]+/(?P<id>n?\d+))`]);
URL_REGEXS.set('www.nbcnews.com', [String.raw`(?x)https?://(?:www\.)?(?:nbcnews|today|msnbc)\.com/([^/]+/)*(?:.*-)?(?P<id>[^/?]+)`]);
URL_REGEXS.set('www.today.com', [String.raw`(?x)https?://(?:www\.)?(?:nbcnews|today|msnbc)\.com/([^/]+/)*(?:.*-)?(?P<id>[^/?]+)`]);
URL_REGEXS.set('www.msnbc.com', [String.raw`(?x)https?://(?:www\.)?(?:nbcnews|today|msnbc)\.com/([^/]+/)*(?:.*-)?(?P<id>[^/?]+)`]);
URL_REGEXS.set('www.nbcolympics.com', [String.raw`https?://www\.nbcolympics\.com/videos?/(?P<id>[0-9a-z-]+)`]);
URL_REGEXS.set('stream.nbcolympics.com', [String.raw`https?://stream\.nbcolympics\.com/(?P<id>[0-9a-z-]+)`]);
URL_REGEXS.set('www.nbcsports.com', [String.raw`https?://(?:www\.)?nbcsports\.com//?(?!vplayer/)(?:[^/]+/)+(?P<id>[0-9a-z-]+)`, String.raw`https?://(?:vplayer\.nbcsports\.com|(?:www\.)?nbcsports\.com/vplayer)/(?:[^/]+/)+(?P<id>[0-9a-zA-Z_]+)`]);
URL_REGEXS.set('stream.nbcsports.com', [String.raw`https?://stream\.nbcsports\.com/.+?\bpid=(?P<id>\d+)`]);
URL_REGEXS.set('vplayer.nbcsports.com', [String.raw`https?://(?:vplayer\.nbcsports\.com|(?:www\.)?nbcsports\.com/vplayer)/(?:[^/]+/)+(?P<id>[0-9a-zA-Z_]+)`]);
URL_REGEXS.set('www.nbclosangeles.com', [String.raw`https?://(?:www\.)?(?P<site>nbcbayarea|nbcboston|nbcchicago|nbcconnecticut|nbcdfw|nbclosangeles|nbcmiami|nbcnewyork|nbcphiladelphia|nbcsandiego|nbcwashington|necn|telemundo52|telemundoarizona|telemundochicago|telemundonuevainglaterra)\.com/(?:[^/?#]+/)*(?P<id>[^/?#]+)/?(?:$|[#?])`]);
URL_REGEXS.set('www.telemundoarizona.com', [String.raw`https?://(?:www\.)?(?P<site>nbcbayarea|nbcboston|nbcchicago|nbcconnecticut|nbcdfw|nbclosangeles|nbcmiami|nbcnewyork|nbcphiladelphia|nbcsandiego|nbcwashington|necn|telemundo52|telemundoarizona|telemundochicago|telemundonuevainglaterra)\.com/(?:[^/?#]+/)*(?P<id>[^/?#]+)/?(?:$|[#?])`]);
URL_REGEXS.set('www.ndr.de', [String.raw`https?://(?:\w+\.)*ndr\.de/(?:[^/]+/)*(?P<id>[^/?#]+),[\da-z]+\.html`, String.raw`https?://(?:\w+\.)*ndr\.de/(?:[^/]+/)*(?P<id>[\da-z]+)-(?:(?:ard)?player|externalPlayer)\.html`, String.raw`(?:ndr:(?P<id_s>[\da-z]+)|https?://www\.ndr\.de/(?P<id>[\da-z]+)-ppjson\.json)`]);
URL_REGEXS.set('khabar.ndtv.com', [String.raw`https?://(?:[^/]+\.)?ndtv\.com/(?:[^/]+/)*videos?/?(?:[^/]+/)*[^/?^&]+-(?P<id>\d+)`]);
URL_REGEXS.set('movies.ndtv.com', [String.raw`https?://(?:[^/]+\.)?ndtv\.com/(?:[^/]+/)*videos?/?(?:[^/]+/)*[^/?^&]+-(?P<id>\d+)`]);
URL_REGEXS.set('www.ndtv.com', [String.raw`https?://(?:[^/]+\.)?ndtv\.com/(?:[^/]+/)*videos?/?(?:[^/]+/)*[^/?^&]+-(?P<id>\d+)`]);
URL_REGEXS.set('auto.ndtv.com', [String.raw`https?://(?:[^/]+\.)?ndtv\.com/(?:[^/]+/)*videos?/?(?:[^/]+/)*[^/?^&]+-(?P<id>\d+)`]);
URL_REGEXS.set('sports.ndtv.com', [String.raw`https?://(?:[^/]+\.)?ndtv\.com/(?:[^/]+/)*videos?/?(?:[^/]+/)*[^/?^&]+-(?P<id>\d+)`]);
URL_REGEXS.set('gadgets.ndtv.com', [String.raw`https?://(?:[^/]+\.)?ndtv\.com/(?:[^/]+/)*videos?/?(?:[^/]+/)*[^/?^&]+-(?P<id>\d+)`]);
URL_REGEXS.set('profit.ndtv.com', [String.raw`https?://(?:[^/]+\.)?ndtv\.com/(?:[^/]+/)*videos?/?(?:[^/]+/)*[^/?^&]+-(?P<id>\d+)`]);
URL_REGEXS.set('food.ndtv.com', [String.raw`https?://(?:[^/]+\.)?ndtv\.com/(?:[^/]+/)*videos?/?(?:[^/]+/)*[^/?^&]+-(?P<id>\d+)`]);
URL_REGEXS.set('doctor.ndtv.com', [String.raw`https?://(?:[^/]+\.)?ndtv\.com/(?:[^/]+/)*videos?/?(?:[^/]+/)*[^/?^&]+-(?P<id>\d+)`]);
URL_REGEXS.set('swirlster.ndtv.com', [String.raw`https?://(?:[^/]+\.)?ndtv\.com/(?:[^/]+/)*videos?/?(?:[^/]+/)*[^/?^&]+-(?P<id>\d+)`]);
URL_REGEXS.set('nebula.app', [String.raw`https?://(?:www\.)?(?:watchnebula\.com|nebula\.app|nebula\.tv)/videos/(?P<id>[-\w]+)`, String.raw`https?://(?:www\.)?(?:watchnebula\.com|nebula\.app|nebula\.tv)/(?!myshows|videos/)(?P<id>[-\w]+)`, String.raw`https?://(?:www\.)?(?:watchnebula\.com|nebula\.app|nebula\.tv)/myshows`]);
URL_REGEXS.set('watchnebula.com', [String.raw`https?://(?:www\.)?(?:watchnebula\.com|nebula\.app|nebula\.tv)/videos/(?P<id>[-\w]+)`]);
URL_REGEXS.set('www.nerdcubed.co.uk', [String.raw`https?://(?:www\.)?nerdcubed\.co\.uk/feed\.json`]);
URL_REGEXS.set('music.163.com', [String.raw`https?://music\.163\.com/(#/)?album\?id=(?P<id>[0-9]+)`, String.raw`https?://music\.163\.com/(#/)?djradio\?id=(?P<id>[0-9]+)`, String.raw`https?://music\.163\.com/(#/)?mv\?id=(?P<id>[0-9]+)`, String.raw`https?://music\.163\.com/(#/)?(playlist|discover/toplist)\?id=(?P<id>[0-9]+)`, String.raw`https?://music\.163\.com/(#/?)program\?id=(?P<id>[0-9]+)`, String.raw`https?://music\.163\.com/(#/)?artist\?id=(?P<id>[0-9]+)`, String.raw`https?://(y\.)?music\.163\.com/(?:[#m]/)?song\?.*?\bid=(?P<id>[0-9]+)`]);
URL_REGEXS.set('y.music.163.com', [String.raw`https?://(y\.)?music\.163\.com/(?:[#m]/)?song\?.*?\bid=(?P<id>[0-9]+)`]);
URL_REGEXS.set('netplus.tv', [String.raw`(?x)https?://(?:www\.)?netplus\.tv/(?:[^?#]+\?(?:[^#]+&)?program=(?P<vid2>\d+)|(?:program|watch)/[^/]+/(?P<vid1>\d+))`, String.raw`(?x)https?://(?:www\.)?netplus\.tv/(?:[^?#]+\?(?:[^#]+&)?channel=(?P<vid2>[^/?&#]+)|live/(?P<vid1>[^/?&#]+))`, String.raw`(?x)https?://(?:www\.)?netplus\.tv/(?:[^?#]+\?(?:[^#]+&)?recording=(?P<vid2>\d+)(?P<vid1>))`]);
URL_REGEXS.set('www.netverse.id', [String.raw`https?://(?:\w+\.)?netverse\.id/(?P<type>watch|video)/(?P<display_id>[^/?#&]+)`]);
URL_REGEXS.set('netverse.id', [String.raw`https?://(?:\w+\.)?netverse\.id/(?P<type>watch|video)/(?P<display_id>[^/?#&]+)`, String.raw`https?://(?:\w+\.)?netverse\.id/(?P<type>webseries)/(?P<display_id>[^/?#&]+)`]);
URL_REGEXS.set('www.netzkino.de', [String.raw`https?://(?:www\.)?netzkino\.de/\#!/[^/]+/(?P<id>[^/]+)`]);
URL_REGEXS.set('www.newgrounds.com', [String.raw`https?://(?:www\.)?newgrounds\.com/(?:audio/listen|portal/view)/(?P<id>\d+)(?:/format/flash)?`, String.raw`https?://(?:www\.)?newgrounds\.com/(?:collection|[^/]+/search/[^/]+)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('burn7.newgrounds.com', [String.raw`https?://(?P<id>[^\.]+)\.newgrounds\.com/(?:movies|audio)/?(?:[#?]|$)`]);
URL_REGEXS.set('brian-beaton.newgrounds.com', [String.raw`https?://(?P<id>[^\.]+)\.newgrounds\.com/(?:movies|audio)/?(?:[#?]|$)`]);
URL_REGEXS.set('newspicks.com', [String.raw`https://newspicks\.com/movie-series/(?P<channel_id>\d+)\?movieId=(?P<id>\d+)`]);
URL_REGEXS.set('www.newstube.ru', [String.raw`https?://(?:www\.)?newstube\.ru/media/(?P<id>.+)`]);
URL_REGEXS.set('www.newsy.com', [String.raw`https?://(?:www\.)?newsy\.com/stories/(?P<id>[^/?#$&]+)`]);
URL_REGEXS.set('hk.apple.nextmedia.com', [String.raw`https?://hk\.apple\.nextmedia\.com/[^/]+/[^/]+/(?P<date>\d+)/(?P<id>\d+)`]);
URL_REGEXS.set('hk.dv.nextmedia.com', [String.raw`https?://hk\.dv\.nextmedia\.com/actionnews/[^/]+/(?P<date>\d+)/(?P<id>\d+)/\d+`]);
URL_REGEXS.set('www.nexttv.com.tw', [String.raw`https?://(?:www\.)?nexttv\.com\.tw/(?:[^/]+/)+(?P<id>\d+)`]);
URL_REGEXS.set('api.nexx.cloud', [String.raw`(?x)(?:https?://api\.nexx(?:\.cloud|cdn\.com)/v3(?:\.\d)?/(?P<domain_id>\d+)/videos/byid/|nexx:(?:(?P<domain_id_s>\d+):)?|https?://arc\.nexx\.cloud/api/video/)(?P<id>\d+)`]);
URL_REGEXS.set('api.nexxcdn.com', [String.raw`(?x)(?:https?://api\.nexx(?:\.cloud|cdn\.com)/v3(?:\.\d)?/(?P<domain_id>\d+)/videos/byid/|nexx:(?:(?P<domain_id_s>\d+):)?|https?://arc\.nexx\.cloud/api/video/)(?P<id>\d+)`]);
URL_REGEXS.set('arc.nexx.cloud', [String.raw`(?x)(?:https?://api\.nexx(?:\.cloud|cdn\.com)/v3(?:\.\d)?/(?P<domain_id>\d+)/videos/byid/|nexx:(?:(?P<domain_id_s>\d+):)?|https?://arc\.nexx\.cloud/api/video/)(?P<id>\d+)`]);
URL_REGEXS.set('embed.nexx.cloud', [String.raw`https?://embed\.nexx(?:\.cloud|cdn\.com)/\d+/(?:video/)?(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nfb.ca', [String.raw`https?://(?:www\.)?nfb\.ca/film/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nfhsnetwork.com', [String.raw`https?://(?:www\.)?nfhsnetwork\.com/events/[\w-]+/(?P<id>(?:gam|evt|dd|)?[\w\d]{0,10})`]);
URL_REGEXS.set('www.nfl.com', [String.raw`(?x)https?://(?P<host>(?:www\.)?(?:(?:nfl|buffalobills|miamidolphins|patriots|newyorkjets|baltimoreravens|bengals|clevelandbrowns|steelers|houstontexans|colts|jaguars|(?:titansonline|tennesseetitans)|denverbroncos|(?:kc)?chiefs|raiders|chargers|dallascowboys|giants|philadelphiaeagles|(?:redskins|washingtonfootball)|chicagobears|detroitlions|packers|vikings|atlantafalcons|panthers|neworleanssaints|buccaneers|azcardinals|(?:stlouis|the)rams|49ers|seahawks)\.com|.+?\.clubs\.nfl\.com))/(?:videos?|listen|audio)/(?P<id>[^/#?&]+)`]);
URL_REGEXS.set('www.chiefs.com', [String.raw`(?x)https?://(?P<host>(?:www\.)?(?:(?:nfl|buffalobills|miamidolphins|patriots|newyorkjets|baltimoreravens|bengals|clevelandbrowns|steelers|houstontexans|colts|jaguars|(?:titansonline|tennesseetitans)|denverbroncos|(?:kc)?chiefs|raiders|chargers|dallascowboys|giants|philadelphiaeagles|(?:redskins|washingtonfootball)|chicagobears|detroitlions|packers|vikings|atlantafalcons|panthers|neworleanssaints|buccaneers|azcardinals|(?:stlouis|the)rams|49ers|seahawks)\.com|.+?\.clubs\.nfl\.com))/(?:videos?|listen|audio)/(?P<id>[^/#?&]+)`]);
URL_REGEXS.set('www.buffalobills.com', [String.raw`(?x)https?://(?P<host>(?:www\.)?(?:(?:nfl|buffalobills|miamidolphins|patriots|newyorkjets|baltimoreravens|bengals|clevelandbrowns|steelers|houstontexans|colts|jaguars|(?:titansonline|tennesseetitans)|denverbroncos|(?:kc)?chiefs|raiders|chargers|dallascowboys|giants|philadelphiaeagles|(?:redskins|washingtonfootball)|chicagobears|detroitlions|packers|vikings|atlantafalcons|panthers|neworleanssaints|buccaneers|azcardinals|(?:stlouis|the)rams|49ers|seahawks)\.com|.+?\.clubs\.nfl\.com))/(?:videos?|listen|audio)/(?P<id>[^/#?&]+)`, String.raw`(?x)https?://(?P<host>(?:www\.)?(?:(?:nfl|buffalobills|miamidolphins|patriots|newyorkjets|baltimoreravens|bengals|clevelandbrowns|steelers|houstontexans|colts|jaguars|(?:titansonline|tennesseetitans)|denverbroncos|(?:kc)?chiefs|raiders|chargers|dallascowboys|giants|philadelphiaeagles|(?:redskins|washingtonfootball)|chicagobears|detroitlions|packers|vikings|atlantafalcons|panthers|neworleanssaints|buccaneers|azcardinals|(?:stlouis|the)rams|49ers|seahawks)\.com|.+?\.clubs\.nfl\.com))/news/(?P<id>[^/#?&]+)`]);
URL_REGEXS.set('www.raiders.com', [String.raw`(?x)https?://(?P<host>(?:www\.)?(?:(?:nfl|buffalobills|miamidolphins|patriots|newyorkjets|baltimoreravens|bengals|clevelandbrowns|steelers|houstontexans|colts|jaguars|(?:titansonline|tennesseetitans)|denverbroncos|(?:kc)?chiefs|raiders|chargers|dallascowboys|giants|philadelphiaeagles|(?:redskins|washingtonfootball)|chicagobears|detroitlions|packers|vikings|atlantafalcons|panthers|neworleanssaints|buccaneers|azcardinals|(?:stlouis|the)rams|49ers|seahawks)\.com|.+?\.clubs\.nfl\.com))/(?:videos?|listen|audio)/(?P<id>[^/#?&]+)`]);
URL_REGEXS.set('www2.nhk.or.jp', [String.raw`https?://www2\.nhk\.or\.jp/school/movie/(?P<type>bangumi|clip)\.cgi\?das_id=(?P<id>[a-zA-Z0-9_-]+)`]);
URL_REGEXS.set('www.nhk.or.jp', [String.raw`https?://www\.nhk\.or\.jp/school/(?P<id>(?:rika|syakai|kokugo|sansuu|seikatsu|doutoku|ongaku|taiiku|zukou|gijutsu|katei|sougou|eigo|tokkatsu|tokushi|sonota)/[a-zA-Z0-9_-]+)`, String.raw`https?://www\.nhk\.or\.jp/school/(?P<id>rika|syakai|kokugo|sansuu|seikatsu|doutoku|ongaku|taiiku|zukou|gijutsu|katei|sougou|eigo|tokkatsu|tokushi|sonota)/?(?:[\?#].*)?$`]);
URL_REGEXS.set('www3.nhk.or.jp', [String.raw`https?://www3\.nhk\.or\.jp/nhkworld/(?P<lang>[a-z]{2})/ondemand/(?P<type>video|audio)/(?P<id>[0-9a-z]{7}|[^/]+?-\d{8}-[0-9a-z]+)`, String.raw`https?://www3\.nhk\.or\.jp/nhkworld/(?P<lang>[a-z]{2})/ondemand/program/(?P<type>video|audio)/(?P<id>[0-9a-z]+)(?:.+?\btype=(?P<episode_type>clip|(?:radio|tv)Episode))?`]);
URL_REGEXS.set('www.nhl.com', [String.raw`https?://(?:www\.)?(?P<site>nhl|wch2016)\.com/(?:[^/]+/)*c-(?P<id>\d+)`]);
URL_REGEXS.set('www.wch2016.com', [String.raw`https?://(?:www\.)?(?P<site>nhl|wch2016)\.com/(?:[^/]+/)*c-(?P<id>\d+)`]);
URL_REGEXS.set('www.nick.com', [String.raw`https?://(?P<domain>(?:www\.)?nick(?:jr)?\.com)/(?:[^/]+/)?(?P<type>videos/clip|[^/]+/videos|episodes/[^/]+)/(?P<id>[^/?#.]+)`]);
URL_REGEXS.set('www.nickjr.com', [String.raw`https?://(?P<domain>(?:www\.)?nick(?:jr)?\.com)/(?:[^/]+/)?(?P<type>videos/clip|[^/]+/videos|episodes/[^/]+)/(?P<id>[^/?#.]+)`]);
URL_REGEXS.set('www.nick.de', [String.raw`https?://(?:www\.)?(?P<host>nick\.(?:de|com\.pl|ch)|nickelodeon\.(?:nl|be|at|dk|no|se))/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nickelodeon.nl', [String.raw`https?://(?:www\.)?(?P<host>nick\.(?:de|com\.pl|ch)|nickelodeon\.(?:nl|be|at|dk|no|se))/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nickelodeon.at', [String.raw`https?://(?:www\.)?(?P<host>nick\.(?:de|com\.pl|ch)|nickelodeon\.(?:nl|be|at|dk|no|se))/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nick.com.pl', [String.raw`https?://(?:www\.)?(?P<host>nick\.(?:de|com\.pl|ch)|nickelodeon\.(?:nl|be|at|dk|no|se))/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nickelodeon.no', [String.raw`https?://(?:www\.)?(?P<host>nick\.(?:de|com\.pl|ch)|nickelodeon\.(?:nl|be|at|dk|no|se))/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nickelodeon.dk', [String.raw`https?://(?:www\.)?(?P<host>nick\.(?:de|com\.pl|ch)|nickelodeon\.(?:nl|be|at|dk|no|se))/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nickelodeon.se', [String.raw`https?://(?:www\.)?(?P<host>nick\.(?:de|com\.pl|ch)|nickelodeon\.(?:nl|be|at|dk|no|se))/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nick.ch', [String.raw`https?://(?:www\.)?(?P<host>nick\.(?:de|com\.pl|ch)|nickelodeon\.(?:nl|be|at|dk|no|se))/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nickelodeon.be', [String.raw`https?://(?:www\.)?(?P<host>nick\.(?:de|com\.pl|ch)|nickelodeon\.(?:nl|be|at|dk|no|se))/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nickjr.com.br', [String.raw`(?x)https?://(?:(?P<domain>(?:www\.)?nickjr|mundonick\.uol)\.com\.br|(?:www\.)?nickjr\.[a-z]{2}|(?:www\.)?nickelodeonjunior\.fr)/(?:programas/)?[^/]+/videos/(?:episodios/)?(?P<id>[^/?\#.]+)`]);
URL_REGEXS.set('mundonick.uol.com.br', [String.raw`(?x)https?://(?:(?P<domain>(?:www\.)?nickjr|mundonick\.uol)\.com\.br|(?:www\.)?nickjr\.[a-z]{2}|(?:www\.)?nickelodeonjunior\.fr)/(?:programas/)?[^/]+/videos/(?:episodios/)?(?P<id>[^/?\#.]+)`]);
URL_REGEXS.set('www.nickjr.nl', [String.raw`(?x)https?://(?:(?P<domain>(?:www\.)?nickjr|mundonick\.uol)\.com\.br|(?:www\.)?nickjr\.[a-z]{2}|(?:www\.)?nickelodeonjunior\.fr)/(?:programas/)?[^/]+/videos/(?:episodios/)?(?P<id>[^/?\#.]+)`]);
URL_REGEXS.set('www.nickjr.de', [String.raw`(?x)https?://(?:(?P<domain>(?:www\.)?nickjr|mundonick\.uol)\.com\.br|(?:www\.)?nickjr\.[a-z]{2}|(?:www\.)?nickelodeonjunior\.fr)/(?:programas/)?[^/]+/videos/(?:episodios/)?(?P<id>[^/?\#.]+)`]);
URL_REGEXS.set('www.nickelodeonjunior.fr', [String.raw`(?x)https?://(?:(?P<domain>(?:www\.)?nickjr|mundonick\.uol)\.com\.br|(?:www\.)?nickjr\.[a-z]{2}|(?:www\.)?nickelodeonjunior\.fr)/(?:programas/)?[^/]+/videos/(?:episodios/)?(?P<id>[^/?\#.]+)`]);
URL_REGEXS.set('www.nickelodeon.ru', [String.raw`https?://(?:www\.)nickelodeon\.(?:ru|fr|es|pt|ro|hu|com\.tr)/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nickelodeon.fr', [String.raw`https?://(?:www\.)nickelodeon\.(?:ru|fr|es|pt|ro|hu|com\.tr)/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nickelodeon.es', [String.raw`https?://(?:www\.)nickelodeon\.(?:ru|fr|es|pt|ro|hu|com\.tr)/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nickelodeon.pt', [String.raw`https?://(?:www\.)nickelodeon\.(?:ru|fr|es|pt|ro|hu|com\.tr)/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nickelodeon.ro', [String.raw`https?://(?:www\.)nickelodeon\.(?:ru|fr|es|pt|ro|hu|com\.tr)/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nickelodeon.hu', [String.raw`https?://(?:www\.)nickelodeon\.(?:ru|fr|es|pt|ro|hu|com\.tr)/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nickelodeon.com.tr', [String.raw`https?://(?:www\.)nickelodeon\.(?:ru|fr|es|pt|ro|hu|com\.tr)/[^/]+/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nicknight.at', [String.raw`https?://(?:www\.)(?P<host>nicknight\.(?:de|at|tv))/(?:playlist|shows)/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nicovideo.jp', [String.raw`https?://(?:(?:www\.|secure\.|sp\.)?nicovideo\.jp/watch|nico\.ms)/(?P<id>(?:[a-z]{2})?[0-9]+)`, String.raw`https?://(?:www\.|sp\.)?nicovideo\.jp/my/history`, String.raw`https?://(?:(?:www\.|sp\.)?nicovideo\.jp|nico\.ms)/(?:user/\d+/)?(?:my/)?mylist/(?:#/)?(?P<id>\d+)`, String.raw`https?://(?:(?:www\.|sp\.)?nicovideo\.jp|nico\.ms)/series/(?P<id>\d+)`, String.raw`https?://(?:www\.)?nicovideo\.jp/tag/(?P<id>[^?#&]+)?`, String.raw`https?://(?:www\.)?nicovideo\.jp/user/(?P<id>\d+)/?(?:$|[#?])`, String.raw`https?://(?:www\.)?nicovideo\.jp/search/(?P<id>[^?#&]+)?`]);
URL_REGEXS.set('sp.nicovideo.jp', [String.raw`https?://(?:(?:www\.|secure\.|sp\.)?nicovideo\.jp/watch|nico\.ms)/(?P<id>(?:[a-z]{2})?[0-9]+)`, String.raw`https?://(?:www\.|sp\.)?nicovideo\.jp/my/history`]);
URL_REGEXS.set('nico.ms', [String.raw`https?://(?:(?:www\.|sp\.)?nicovideo\.jp|nico\.ms)/series/(?P<id>\d+)`]);
URL_REGEXS.set('www.nintendo.com', [String.raw`https?://(?:www\.)?nintendo\.com/(?:games/detail|nintendo-direct)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('twitr.gq', [String.raw`https?://(?:3nzoldnxplag42gqjs23xvghtzf6t6yzssrtytnntc6ppc7xxuoneoad\.onion|nitter\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|nitter7bryz3jv7e3uekphigvmoyoem4al3fynerxkj22dmoxoq553qd\.onion|npf37k3mtzwxreiw52ccs5ay4e6qt2fkcs2ndieurdyn2cuzzsfyfvid\.onion|nitter\.v6vgyqpa7yefkorazmg5d5fimstmvm2vtbirt6676mt7qmllrcnwycqd\.onion|i23nv6w3juvzlw32xzoxcqzktegd4i4fu3nmnc2ewv4ggiu4ledwklad\.onion|26oq3gioiwcmfojub37nz5gzbkdiqp7fue5kvye7d4txv4ny6fb4wwid\.onion|vfaomgh4jxphpbdfizkm5gbtjahmei234giqj4facbwhrfjtcldauqad\.onion|iwgu3cv7ywf3gssed5iqtavmrlszgsxazkmwwnt4h2kdait75thdyrqd\.onion|erpnncl5nhyji3c32dcfmztujtl3xaddqb457jsbkulq24zqq7ifdgad\.onion|ckzuw5misyahmg7j5t5xwwuj3bwy62jfolxyux4brfflramzsvvd3syd\.onion|jebqj47jgxleaiosfcxfibx2xdahjettuydlxbg64azd4khsxv6kawid\.onion|nttr2iupbb6fazdpr2rgbooon2tzbbsvvkagkgkwohhodjzj43stxhad\.onion|nitraeju2mipeziu2wtcrqsxg7h62v5y4eqgwi75uprynkj74gevvuqd\.onion|nitter\.lqs5fjmajyp7rvp4qvyubwofzi6d4imua7vs237rkc4m5qogitqwrgyd\.onion|ibsboeui2im5o7dxnik3s5yghufumgy5abevtij5nbizequfpu4qi4ad\.onion|ec5nvbycpfa5k6ro77blxgkyrzbkv7uy6r5cngcbkadtjj2733nm3uyd\.onion|nitter\.i2p|u6ikd6zndl3c4dsdq4mmujpntgeevdk5qzkfb57r4tnfeccrn2qa\.b32\.i2p|nitterlgj3n5fgwesu3vxc5h67ruku33nqaoeoocae2mvlzhsu6k7fqd\.onion|nitter\.42l\.fr|nitter\.pussthecat\.org|nitter\.nixnet\.services|nitter\.fdn\.fr|nitter\.1d4\.us|nitter\.kavin\.rocks|nitter\.unixfox\.eu|nitter\.domain\.glass|nitter\.eu|nitter\.namazso\.eu|nitter\.actionsack\.com|birdsite\.xanny\.family|nitter\.hu|twitr\.gq|nitter\.moomoo\.me|nittereu\.moomoo\.me|bird\.from\.tf|nitter\.it|twitter\.censors\.us|twitter\.grimneko\.de|nitter\.alefvanoon\.xyz|n\.hyperborea\.cloud|nitter\.ca|twitter\.076\.ne\.jp|twitter\.mstdn\.social|nitter\.fly\.dev|notabird\.site|nitter\.weiler\.rocks|nitter\.silkky\.cloud|nitter\.sethforprivacy\.com|nttr\.stream|nitter\.cutelab\.space|nitter\.nl|nitter\.mint\.lgbt|nitter\.bus\-hit\.me|fuckthesacklers\.network|nitter\.govt\.land|nitter\.datatunnel\.xyz|nitter\.esmailelbob\.xyz|tw\.artemislena\.eu|de\.nttr\.stream|nitter\.winscloud\.net|nitter\.tiekoetter\.com|nitter\.spaceint\.fr|twtr\.bch\.bar|nitter\.exonip\.de|nitter\.mastodon\.pro|nitter\.notraxx\.ch|nitter\.skrep\.in|nitter\.snopyta\.org|nitter\.ethibox\.fr|nitter\.net|is\-nitter\.resolv\.ee|lu\-nitter\.resolv\.ee|nitter\.13ad\.de|nitter\.40two\.app|nitter\.cattube\.org|nitter\.cc|nitter\.dark\.fail|nitter\.himiko\.cloud|nitter\.koyu\.space|nitter\.mailstation\.de|nitter\.mastodont\.cat|nitter\.tedomum\.net|nitter\.tokhmi\.xyz|nitter\.weaponizedhumiliation\.com|nitter\.vxempire\.xyz|tweet\.lambda\.dance)/(?P<uploader_id>.+)/status/(?P<id>[0-9]+)(#.)?`]);
URL_REGEXS.set('www.n-joy.de', [String.raw`https?://(?:www\.)?n-joy\.de/(?:[^/]+/)*(?:(?P<display_id>[^/?#]+),)?(?P<id>[\da-z]+)\.html`, String.raw`https?://(?:www\.)?n-joy\.de/(?:[^/]+/)*(?P<id>[\da-z]+)-(?:player|externalPlayer)_[^/]+\.html`]);
URL_REGEXS.set('njpwworld.com', [String.raw`https?://(front\.)?njpwworld\.com/p/(?P<id>[a-z0-9_]+)`]);
URL_REGEXS.set('front.njpwworld.com', [String.raw`https?://(front\.)?njpwworld\.com/p/(?P<id>[a-z0-9_]+)`]);
URL_REGEXS.set('www.nobelprize.org', [String.raw`https?://(?:www\.)?nobelprize\.org/mediaplayer.*?\bid=(?P<id>\d+)`]);
URL_REGEXS.set('open.noice.id', [String.raw`https?://open\.noice\.id/content/(?P<id>[a-fA-F0-9-]+)`]);
URL_REGEXS.set('www.nonktube.com', [String.raw`https?://(?:www\.)?nonktube\.com/(?:(?:video|embed)/|media/nuevo/embed\.php\?.*?\bid=)(?P<id>\d+)`]);
URL_REGEXS.set('adult.noodlemagazine.com', [String.raw`https?://(?:www|adult\.)?noodlemagazine\.com/watch/(?P<id>[0-9-_]+)`]);
URL_REGEXS.set('noovo.ca', [String.raw`https?://(?:[^/]+\.)?noovo\.ca/videos/(?P<id>[^/]+/[^/?#&]+)`]);
URL_REGEXS.set('normalboots.com', [String.raw`https?://(?:www\.)?normalboots\.com/video/(?P<id>[0-9a-z-]*)/?$`]);
URL_REGEXS.set('nos.nl', [String.raw`https?://nos\.nl/(?P<type>video|(\w+/)?\w+)/?\d+-(?P<display_id>[\w-]+)`]);
URL_REGEXS.set('nosvideo.com', [String.raw`https?://(?:www\.)?nosvideo\.com/(?:embed/|\?v=)(?P<id>[A-Za-z0-9]{12})/?`]);
URL_REGEXS.set('tn.nova.cz', [String.raw`https?://(?:[^.]+\.)?(?P<site>tv(?:noviny)?|tn|novaplus|vymena|fanda|krasna|doma|prask)\.nova\.cz/(?:[^/]+/)+(?P<id>[^/]+?)(?:\.html|/|$)`]);
URL_REGEXS.set('fanda.nova.cz', [String.raw`https?://(?:[^.]+\.)?(?P<site>tv(?:noviny)?|tn|novaplus|vymena|fanda|krasna|doma|prask)\.nova\.cz/(?:[^/]+/)+(?P<id>[^/]+?)(?:\.html|/|$)`]);
URL_REGEXS.set('novaplus.nova.cz', [String.raw`https?://(?:[^.]+\.)?(?P<site>tv(?:noviny)?|tn|novaplus|vymena|fanda|krasna|doma|prask)\.nova\.cz/(?:[^/]+/)+(?P<id>[^/]+?)(?:\.html|/|$)`]);
URL_REGEXS.set('sport.tn.nova.cz', [String.raw`https?://(?:[^.]+\.)?(?P<site>tv(?:noviny)?|tn|novaplus|vymena|fanda|krasna|doma|prask)\.nova\.cz/(?:[^/]+/)+(?P<id>[^/]+?)(?:\.html|/|$)`]);
URL_REGEXS.set('doma.nova.cz', [String.raw`https?://(?:[^.]+\.)?(?P<site>tv(?:noviny)?|tn|novaplus|vymena|fanda|krasna|doma|prask)\.nova\.cz/(?:[^/]+/)+(?P<id>[^/]+?)(?:\.html|/|$)`]);
URL_REGEXS.set('prask.nova.cz', [String.raw`https?://(?:[^.]+\.)?(?P<site>tv(?:noviny)?|tn|novaplus|vymena|fanda|krasna|doma|prask)\.nova\.cz/(?:[^/]+/)+(?P<id>[^/]+?)(?:\.html|/|$)`]);
URL_REGEXS.set('tv.nova.cz', [String.raw`https?://(?:[^.]+\.)?(?P<site>tv(?:noviny)?|tn|novaplus|vymena|fanda|krasna|doma|prask)\.nova\.cz/(?:[^/]+/)+(?P<id>[^/]+?)(?:\.html|/|$)`]);
URL_REGEXS.set('media.cms.nova.cz', [String.raw`https?://media\.cms\.nova\.cz/embed/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nowness.com', [String.raw`https?://(?:(?:www|cn)\.)?nowness\.com/(?:story|(?:series|category)/[^/]+)/(?P<id>[^/]+?)(?:$|[?#])`, String.raw`https?://(?:(?:www|cn)\.)?nowness\.com/playlist/(?P<id>\d+)`, String.raw`https?://(?:(?:www|cn)\.)?nowness\.com/series/(?P<id>[^/]+?)(?:$|[?#])`]);
URL_REGEXS.set('cn.nowness.com', [String.raw`https?://(?:(?:www|cn)\.)?nowness\.com/(?:story|(?:series|category)/[^/]+)/(?P<id>[^/]+?)(?:$|[?#])`]);
URL_REGEXS.set('www.noz.de', [String.raw`https?://(?:www\.)?noz\.de/video/(?P<id>[0-9]+)/`]);
URL_REGEXS.set('www.npo.nl', [String.raw`(?x)(?:npo:|https?://(?:www\.)?(?:npo\.nl/(?:[^/]+/)*|(?:ntr|npostart)\.nl/(?:[^/]+/){2,}|omroepwnl\.nl/video/fragment/[^/]+__|(?:zapp|npo3)\.nl/(?:[^/]+/){2,}))(?P<id>[^/?#]+)`, String.raw`https?://(?:www\.)?npo(?:start)?\.nl/live(?:/(?P<id>[^/?#&]+))?`, String.raw`https?://(?:www\.)?npo\.nl/radio/(?P<id>[^/]+)`, String.raw`https?://(?:www\.)?npo\.nl/radio/[^/]+/fragment/(?P<id>\d+)`]);
URL_REGEXS.set('www.ntr.nl', [String.raw`(?x)(?:npo:|https?://(?:www\.)?(?:npo\.nl/(?:[^/]+/)*|(?:ntr|npostart)\.nl/(?:[^/]+/){2,}|omroepwnl\.nl/video/fragment/[^/]+__|(?:zapp|npo3)\.nl/(?:[^/]+/){2,}))(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.omroepwnl.nl', [String.raw`(?x)(?:npo:|https?://(?:www\.)?(?:npo\.nl/(?:[^/]+/)*|(?:ntr|npostart)\.nl/(?:[^/]+/){2,}|omroepwnl\.nl/video/fragment/[^/]+__|(?:zapp|npo3)\.nl/(?:[^/]+/){2,}))(?P<id>[^/?#]+)`, String.raw`https?://(?:www\.)?omroepwnl\.nl/video/detail/(?P<id>[^/]+)__\d+`]);
URL_REGEXS.set('www.zapp.nl', [String.raw`(?x)(?:npo:|https?://(?:www\.)?(?:npo\.nl/(?:[^/]+/)*|(?:ntr|npostart)\.nl/(?:[^/]+/){2,}|omroepwnl\.nl/video/fragment/[^/]+__|(?:zapp|npo3)\.nl/(?:[^/]+/){2,}))(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.npo3.nl', [String.raw`(?x)(?:npo:|https?://(?:www\.)?(?:npo\.nl/(?:[^/]+/)*|(?:ntr|npostart)\.nl/(?:[^/]+/){2,}|omroepwnl\.nl/video/fragment/[^/]+__|(?:zapp|npo3)\.nl/(?:[^/]+/){2,}))(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.npostart.nl', [String.raw`(?x)(?:npo:|https?://(?:www\.)?(?:npo\.nl/(?:[^/]+/)*|(?:ntr|npostart)\.nl/(?:[^/]+/){2,}|omroepwnl\.nl/video/fragment/[^/]+__|(?:zapp|npo3)\.nl/(?:[^/]+/){2,}))(?P<id>[^/?#]+)`, String.raw`https?://(?:www\.)?npo(?:start)?\.nl/live(?:/(?P<id>[^/?#&]+))?`]);
URL_REGEXS.set('npo.nl', [String.raw`(?x)(?:npo:|https?://(?:www\.)?(?:npo\.nl/(?:[^/]+/)*|(?:ntr|npostart)\.nl/(?:[^/]+/){2,}|omroepwnl\.nl/video/fragment/[^/]+__|(?:zapp|npo3)\.nl/(?:[^/]+/){2,}))(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.npr.org', [String.raw`https?://(?:www\.)?npr\.org/(?:sections/[^/]+/)?\d{4}/\d{2}/\d{2}/(?P<id>\d+)`]);
URL_REGEXS.set('www.nrk.no', [String.raw`(?x)(?:nrk:|https?://(?:(?:www\.)?nrk\.no/video/(?:PS\*|[^_]+_)|v8[-.]psapi\.nrk\.no/mediaelement/))(?P<id>[^?\#&]+)`, String.raw`https?://(?:www\.)?nrk\.no/(?!video|skole)(?:[^/]+/)+(?P<id>[^/]+)`, String.raw`https?://(?:www\.)?nrk\.no/skole/?\?.*\bmediaId=(?P<id>\d+)`]);
URL_REGEXS.set('v8-psapi.nrk.no', [String.raw`(?x)(?:nrk:|https?://(?:(?:www\.)?nrk\.no/video/(?:PS\*|[^_]+_)|v8[-.]psapi\.nrk\.no/mediaelement/))(?P<id>[^?\#&]+)`]);
URL_REGEXS.set('radio.nrk.no', [String.raw`https?://radio\.nrk\.no/pod[ck]ast/(?:[^/]+/)+(?P<id>l_[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`, String.raw`https?://(?:tv|radio)\.nrk(?:super)?\.no/(?:[^/]+/)*(?P<id>[a-zA-Z]{4}\d{8})`, String.raw`https?://(?:tv|radio)\.nrk\.no/direkte/(?P<id>[^/?#&]+)`, String.raw`(?x)https?://(?P<domain>tv|radio)\.nrk\.no/(?P<serie_kind>serie|pod[ck]ast)/(?P<serie>[^/]+)/(?:(?:sesong/)?(?P<id>\d+)|sesong/(?P<id_2>[^/?#&]+))`, String.raw`https?://(?P<domain>(?:tv|radio)\.nrk|(?:tv\.)?nrksuper)\.no/(?P<serie_kind>serie|pod[ck]ast)/(?P<id>[^/]+)`]);
URL_REGEXS.set('tv.nrk.no', [String.raw`https?://(?:tv|radio)\.nrk(?:super)?\.no/(?:[^/]+/)*(?P<id>[a-zA-Z]{4}\d{8})`, String.raw`https?://(?:tv|radio)\.nrk\.no/direkte/(?P<id>[^/?#&]+)`, String.raw`https?://tv\.nrk\.no/serie/(?P<id>[^/]+/sesong/(?P<season_number>\d+)/episode/(?P<episode_number>\d+))`, String.raw`https?://tv\.nrk\.no/program/[Ee]pisodes/[^/]+/(?P<id>\d+)`, String.raw`(?x)https?://(?P<domain>tv|radio)\.nrk\.no/(?P<serie_kind>serie|pod[ck]ast)/(?P<serie>[^/]+)/(?:(?:sesong/)?(?P<id>\d+)|sesong/(?P<id_2>[^/?#&]+))`, String.raw`https?://(?P<domain>(?:tv|radio)\.nrk|(?:tv\.)?nrksuper)\.no/(?P<serie_kind>serie|pod[ck]ast)/(?P<id>[^/]+)`]);
URL_REGEXS.set('tv.nrksuper.no', [String.raw`https?://(?P<domain>(?:tv|radio)\.nrk|(?:tv\.)?nrksuper)\.no/(?P<serie_kind>serie|pod[ck]ast)/(?P<id>[^/]+)`]);
URL_REGEXS.set('nrksuper.no', [String.raw`https?://(?P<domain>(?:tv|radio)\.nrk|(?:tv\.)?nrksuper)\.no/(?P<serie_kind>serie|pod[ck]ast)/(?P<id>[^/]+)`]);
URL_REGEXS.set('www.nrl.com', [String.raw`https?://(?:www\.)?nrl\.com/tv(/[^/]+)*/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('www.ntv.ru', [String.raw`https?://(?:www\.)?ntv\.ru/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.nuvid.com', [String.raw`https?://(?:www|m)\.nuvid\.com/video/(?P<id>[0-9]+)`]);
URL_REGEXS.set('m.nuvid.com', [String.raw`https?://(?:www|m)\.nuvid\.com/video/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.nytimes.com', [String.raw`https?://(?:(?:www\.)?nytimes\.com/video/(?:[^/]+/)+?|graphics8\.nytimes\.com/bcvideo/\d+(?:\.\d+)?/iframe/embed\.html\?videoId=)(?P<id>\d+)`, String.raw`https?://(?:www\.)?nytimes\.com/(.(?<!video))*?/(?:[^/]+/)*(?P<id>[^.]+)(?:\.html)?`]);
URL_REGEXS.set('cooking.nytimes.com', [String.raw`https?://cooking\.nytimes\.com/(?:guid|recip)es/(?P<id>\d+)`]);
URL_REGEXS.set('www.nzherald.co.nz', [String.raw`https?://(?:www\.)?nzherald\.co\.nz/[\w\/-]+\/(?P<id>[A-Z0-9]+)`]);
URL_REGEXS.set('nzherald.co.nz', [String.raw`https?://(?:www\.)?nzherald\.co\.nz/[\w\/-]+\/(?P<id>[A-Z0-9]+)`]);
URL_REGEXS.set('www.nzz.ch', [String.raw`https?://(?:www\.)?nzz\.ch/(?:[^/]+/)*[^/?#]+-ld\.(?P<id>\d+)`]);
URL_REGEXS.set('ocw.mit.edu', [String.raw`^https?://ocw\.mit\.edu/courses/(?P<topic>[a-z0-9\-]+)`]);
URL_REGEXS.set('odatv.com', [String.raw`https?://(?:www\.)?odatv\.com/(?:mob|vid)_video\.php\?.*\bid=(?P<id>[^&]+)`]);
URL_REGEXS.set('ok.ru', [String.raw`(?x)https?://(?:(?:www|m|mobile)\.)?(?:odnoklassniki|ok)\.ru/(?:video(?P<embed>embed)?/|web-api/video/moviePlayer/|live/|dk\?.*?st\.mvId=)(?P<id>[\d-]+)`]);
URL_REGEXS.set('m.ok.ru', [String.raw`(?x)https?://(?:(?:www|m|mobile)\.)?(?:odnoklassniki|ok)\.ru/(?:video(?P<embed>embed)?/|web-api/video/moviePlayer/|live/|dk\?.*?st\.mvId=)(?P<id>[\d-]+)`]);
URL_REGEXS.set('www.ok.ru', [String.raw`(?x)https?://(?:(?:www|m|mobile)\.)?(?:odnoklassniki|ok)\.ru/(?:video(?P<embed>embed)?/|web-api/video/moviePlayer/|live/|dk\?.*?st\.mvId=)(?P<id>[\d-]+)`]);
URL_REGEXS.set('mobile.ok.ru', [String.raw`(?x)https?://(?:(?:www|m|mobile)\.)?(?:odnoklassniki|ok)\.ru/(?:video(?P<embed>embed)?/|web-api/video/moviePlayer/|live/|dk\?.*?st\.mvId=)(?P<id>[\d-]+)`]);
URL_REGEXS.set('of.tv', [String.raw`https?://(?:www\.)?of.tv/video/(?P<id>\w+)`, String.raw`https?://(?:www\.)?of.tv/creators/(?P<id>[a-zA-Z0-9-]+)/.?`]);
URL_REGEXS.set('www.oktoberfest-tv.de', [String.raw`https?://(?:www\.)?oktoberfest-tv\.de/[^/]+/[^/]+/video/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('olympics.com', [String.raw`https?://(?:www\.)?olympics\.com(?:/tokyo-2020)?/[a-z]{2}/(?:replay|video)/(?P<id>[^/#&?]+)`]);
URL_REGEXS.set('event.on24.com', [String.raw`(?x)https?://event\.on24\.com/(?:wcc/r/(?P<id_1>\d{7})/(?P<key_1>[0-9A-F]{32})|eventRegistration/(?:console/EventConsoleApollo|EventLobbyServlet\?target=lobby30)\.jsp\?(?:[^/#?]*&)?eventid=(?P<id_2>\d{7})[^/#?]*&key=(?P<key_2>[0-9A-F]{32}))`]);
URL_REGEXS.set('www.ondemandkorea.com', [String.raw`https?://(?:www\.)?ondemandkorea\.com/(?P<id>[^/]+)\.html`]);
URL_REGEXS.set('onefootball.com', [String.raw`https?://(?:www\.)?onefootball\.com/[a-z]{2}/video/[^/&?#]+-(?P<id>\d+)`]);
URL_REGEXS.set('www.oneplace.com', [String.raw`https?://www\.oneplace\.com/[\w]+/[^/]+/listen/[\w-]+-(?P<id>\d+)`]);
URL_REGEXS.set('eurosport.onet.pl', [String.raw`https?://(?:[^/]+\.)?(?:onet|businessinsider\.com|plejada)\.pl/(?:[^/]+/)+(?P<id>[0-9a-z]+)`]);
URL_REGEXS.set('film.onet.pl', [String.raw`https?://(?:[^/]+\.)?(?:onet|businessinsider\.com|plejada)\.pl/(?:[^/]+/)+(?P<id>[0-9a-z]+)`]);
URL_REGEXS.set('moto.onet.pl', [String.raw`https?://(?:[^/]+\.)?(?:onet|businessinsider\.com|plejada)\.pl/(?:[^/]+/)+(?P<id>[0-9a-z]+)`]);
URL_REGEXS.set('businessinsider.com.pl', [String.raw`https?://(?:[^/]+\.)?(?:onet|businessinsider\.com|plejada)\.pl/(?:[^/]+/)+(?P<id>[0-9a-z]+)`]);
URL_REGEXS.set('plejada.pl', [String.raw`https?://(?:[^/]+\.)?(?:onet|businessinsider\.com|plejada)\.pl/(?:[^/]+/)+(?P<id>[0-9a-z]+)`]);
URL_REGEXS.set('onet.tv', [String.raw`https?://(?:(?:www\.)?onet\.tv|onet100\.vod\.pl)/[a-z]/[a-z]+/(?P<display_id>[0-9a-z-]+)/(?P<id>[0-9a-z]+)`, String.raw`https?://(?:(?:www\.)?onet\.tv|onet100\.vod\.pl)/[a-z]/(?P<id>[a-z]+)(?:[?#]|$)`]);
URL_REGEXS.set('onet100.vod.pl', [String.raw`https?://(?:(?:www\.)?onet\.tv|onet100\.vod\.pl)/[a-z]/[a-z]+/(?P<display_id>[0-9a-z-]+)/(?P<id>[0-9a-z]+)`, String.raw`https?://(?:(?:www\.)?onet\.tv|onet100\.vod\.pl)/[a-z]/(?P<id>[a-z]+)(?:[?#]|$)`]);
URL_REGEXS.set('www.onionstudios.com', [String.raw`https?://(?:www\.)?onionstudios\.com/(?:video(?:s/[^/]+-|/)|embed\?.*\bid=)(?P<id>\d+)(?!-)`]);
URL_REGEXS.set('player.ooyala.com', [String.raw`(?:ooyala:|https?://.+?\.ooyala\.com/.*?(?:embedCode|ec)=)(?P<id>.+?)(&|$)`, String.raw`(?x)(?:ooyalaexternal:|https?://.+?\.ooyala\.com/.*?\bexternalId=)(?P<partner_id>[^:]+):(?P<id>.+)(?::|.*?&pcode=)(?P<pcode>.+?)(?:&|$)`]);
URL_REGEXS.set('oc-video1.ruhr-uni-bochum.de', [String.raw`(?x)https?://(?P<host>(?:opencast\.informatik\.kit\.edu|electures\.uni-muenster\.de|oc-presentation\.ltcc\.tuwien\.ac\.at|medien\.ph-noe\.ac\.at|oc-video\.ruhr-uni-bochum\.de|oc-video1\.ruhr-uni-bochum\.de|opencast\.informatik\.uni-goettingen\.de|heicast\.uni-heidelberg\.de|opencast\.hawk\.de:8080|opencast\.hs-osnabrueck\.de|video[0-9]+\.virtuos\.uni-osnabrueck\.de|opencast\.uni-koeln\.de|media\.opencast\.hochschule-rhein-waal\.de|matterhorn\.dce\.harvard\.edu|hs-harz\.opencast\.uni-halle\.de|videocampus\.urz\.uni-leipzig\.de|media\.uct\.ac\.za|vid\.igb\.illinois\.edu|cursosabertos\.c3sl\.ufpr\.br|mcmedia\.missioncollege\.org|clases\.odon\.edu\.uy))/paella/ui/watch.html\?.*?id=(?P<id>[\da-fA-F]{8}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{12})`, String.raw`(?x)https?://(?P<host>(?:opencast\.informatik\.kit\.edu|electures\.uni-muenster\.de|oc-presentation\.ltcc\.tuwien\.ac\.at|medien\.ph-noe\.ac\.at|oc-video\.ruhr-uni-bochum\.de|oc-video1\.ruhr-uni-bochum\.de|opencast\.informatik\.uni-goettingen\.de|heicast\.uni-heidelberg\.de|opencast\.hawk\.de:8080|opencast\.hs-osnabrueck\.de|video[0-9]+\.virtuos\.uni-osnabrueck\.de|opencast\.uni-koeln\.de|media\.opencast\.hochschule-rhein-waal\.de|matterhorn\.dce\.harvard\.edu|hs-harz\.opencast\.uni-halle\.de|videocampus\.urz\.uni-leipzig\.de|media\.uct\.ac\.za|vid\.igb\.illinois\.edu|cursosabertos\.c3sl\.ufpr\.br|mcmedia\.missioncollege\.org|clases\.odon\.edu\.uy))/engage/ui/index.html\?.*?epFrom=(?P<id>[\da-fA-F]{8}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{12})`]);
URL_REGEXS.set('oc-video.ruhr-uni-bochum.de', [String.raw`(?x)https?://(?P<host>(?:opencast\.informatik\.kit\.edu|electures\.uni-muenster\.de|oc-presentation\.ltcc\.tuwien\.ac\.at|medien\.ph-noe\.ac\.at|oc-video\.ruhr-uni-bochum\.de|oc-video1\.ruhr-uni-bochum\.de|opencast\.informatik\.uni-goettingen\.de|heicast\.uni-heidelberg\.de|opencast\.hawk\.de:8080|opencast\.hs-osnabrueck\.de|video[0-9]+\.virtuos\.uni-osnabrueck\.de|opencast\.uni-koeln\.de|media\.opencast\.hochschule-rhein-waal\.de|matterhorn\.dce\.harvard\.edu|hs-harz\.opencast\.uni-halle\.de|videocampus\.urz\.uni-leipzig\.de|media\.uct\.ac\.za|vid\.igb\.illinois\.edu|cursosabertos\.c3sl\.ufpr\.br|mcmedia\.missioncollege\.org|clases\.odon\.edu\.uy))/engage/ui/index.html\?.*?epFrom=(?P<id>[\da-fA-F]{8}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{12})`]);
URL_REGEXS.set('www.openrec.tv', [String.raw`https?://(?:www\.)?openrec\.tv/live/(?P<id>[^/]+)`, String.raw`https?://(?:www\.)?openrec\.tv/capture/(?P<id>[^/]+)`, String.raw`https?://(?:www\.)?openrec\.tv/movie/(?P<id>[^/]+)`]);
URL_REGEXS.set('www.ora.tv', [String.raw`https?://(?:www\.)?(?:ora\.tv|unsafespeech\.com)/([^/]+/)*(?P<id>[^/\?#]+)`]);
URL_REGEXS.set('www.unsafespeech.com', [String.raw`https?://(?:www\.)?(?:ora\.tv|unsafespeech\.com)/([^/]+/)*(?P<id>[^/\?#]+)`]);
URL_REGEXS.set('fm4.orf.at', [String.raw`https?://fm4\.orf\.at/stories/(?P<id>\d+)`, String.raw`(?x)https?://(?:(?P<station>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1)\.orf\.at/player|radiothek\.orf\.at/(?P<station2>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1))/(?P<date>[0-9]+)/(?P<show>\w+)`]);
URL_REGEXS.set('iptv.orf.at', [String.raw`https?://iptv\.orf\.at/(?:#/)?stories/(?P<id>\d+)`]);
URL_REGEXS.set('radiothek.orf.at', [String.raw`(?x)https?://(?:(?P<station>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1)\.orf\.at/player|radiothek\.orf\.at/(?P<station2>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1))/(?P<date>[0-9]+)/(?P<show>\w+)`]);
URL_REGEXS.set('ooe.orf.at', [String.raw`(?x)https?://(?:(?P<station>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1)\.orf\.at/player|radiothek\.orf\.at/(?P<station2>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1))/(?P<date>[0-9]+)/(?P<show>\w+)`]);
URL_REGEXS.set('noe.orf.at', [String.raw`(?x)https?://(?:(?P<station>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1)\.orf\.at/player|radiothek\.orf\.at/(?P<station2>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1))/(?P<date>[0-9]+)/(?P<show>\w+)`]);
URL_REGEXS.set('wien.orf.at', [String.raw`(?x)https?://(?:(?P<station>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1)\.orf\.at/player|radiothek\.orf\.at/(?P<station2>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1))/(?P<date>[0-9]+)/(?P<show>\w+)`]);
URL_REGEXS.set('burgenland.orf.at', [String.raw`(?x)https?://(?:(?P<station>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1)\.orf\.at/player|radiothek\.orf\.at/(?P<station2>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1))/(?P<date>[0-9]+)/(?P<show>\w+)`]);
URL_REGEXS.set('steiermark.orf.at', [String.raw`(?x)https?://(?:(?P<station>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1)\.orf\.at/player|radiothek\.orf\.at/(?P<station2>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1))/(?P<date>[0-9]+)/(?P<show>\w+)`]);
URL_REGEXS.set('kaernten.orf.at', [String.raw`(?x)https?://(?:(?P<station>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1)\.orf\.at/player|radiothek\.orf\.at/(?P<station2>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1))/(?P<date>[0-9]+)/(?P<show>\w+)`]);
URL_REGEXS.set('salzburg.orf.at', [String.raw`(?x)https?://(?:(?P<station>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1)\.orf\.at/player|radiothek\.orf\.at/(?P<station2>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1))/(?P<date>[0-9]+)/(?P<show>\w+)`]);
URL_REGEXS.set('tirol.orf.at', [String.raw`(?x)https?://(?:(?P<station>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1)\.orf\.at/player|radiothek\.orf\.at/(?P<station2>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1))/(?P<date>[0-9]+)/(?P<show>\w+)`]);
URL_REGEXS.set('vorarlberg.orf.at', [String.raw`(?x)https?://(?:(?P<station>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1)\.orf\.at/player|radiothek\.orf\.at/(?P<station2>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1))/(?P<date>[0-9]+)/(?P<show>\w+)`]);
URL_REGEXS.set('oe3.orf.at', [String.raw`(?x)https?://(?:(?P<station>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1)\.orf\.at/player|radiothek\.orf\.at/(?P<station2>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1))/(?P<date>[0-9]+)/(?P<show>\w+)`]);
URL_REGEXS.set('oe1.orf.at', [String.raw`(?x)https?://(?:(?P<station>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1)\.orf\.at/player|radiothek\.orf\.at/(?P<station2>fm4|noe|wien|burgenland|ooe|steiermark|kaernten|salzburg|tirol|vorarlberg|oe3|oe1))/(?P<date>[0-9]+)/(?P<show>\w+)`]);
URL_REGEXS.set('tvthek.orf.at', [String.raw`(?P<url>https?://tvthek\.orf\.at/(?:(?:[^/]+/){2}){1,2}(?P<id>\d+))(/[^/]+/(?P<vid>\d+))?(?:$|[?#])`]);
URL_REGEXS.set('tvonline.osnatel.de', [String.raw`(?x)https?://(?:www\.)?tvonline\.osnatel\.de/(?:[^?#]+\?(?:[^#]+&)?program=(?P<vid2>\d+)|(?:program|watch)/[^/]+/(?P<vid1>\d+))`, String.raw`(?x)https?://(?:www\.)?tvonline\.osnatel\.de/(?:[^?#]+\?(?:[^#]+&)?channel=(?P<vid2>[^/?&#]+)|live/(?P<vid1>[^/?&#]+))`, String.raw`(?x)https?://(?:www\.)?tvonline\.osnatel\.de/(?:[^?#]+\?(?:[^#]+&)?recording=(?P<vid2>\d+)(?P<vid1>))`]);
URL_REGEXS.set('www.outsidetv.com', [String.raw`https?://(?:www\.)?outsidetv\.com/(?:[^/]+/)*?play/[a-zA-Z0-9]{8}/\d+/\d+/(?P<id>[a-zA-Z0-9]{8})`]);
URL_REGEXS.set('www.packtpub.com', [String.raw`https?://(?:(?:www\.)?packtpub\.com/mapt|subscription\.packtpub\.com)/video/[^/]+/(?P<course_id>\d+)/(?P<chapter_id>[^/]+)/(?P<id>[^/]+)(?:/(?P<display_id>[^/?&#]+))?`, String.raw`(?P<url>https?://(?:(?:www\.)?packtpub\.com/mapt|subscription\.packtpub\.com)/video/[^/]+/(?P<id>\d+))`]);
URL_REGEXS.set('subscription.packtpub.com', [String.raw`https?://(?:(?:www\.)?packtpub\.com/mapt|subscription\.packtpub\.com)/video/[^/]+/(?P<course_id>\d+)/(?P<chapter_id>[^/]+)/(?P<id>[^/]+)(?:/(?P<display_id>[^/?&#]+))?`, String.raw`(?P<url>https?://(?:(?:www\.)?packtpub\.com/mapt|subscription\.packtpub\.com)/video/[^/]+/(?P<id>\d+))`]);
URL_REGEXS.set('www.palcomp3.com.br', [String.raw`https?://(?:www\.)?palcomp3\.com(?:\.br)?/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('www.palcomp3.com', [String.raw`https?://(?:www\.)?palcomp3\.com(?:\.br)?/(?P<artist>[^/]+)/(?P<id>[^/?&#]+)`, String.raw`https?://(?:www\.)?palcomp3\.com(?:\.br)?/(?P<artist>[^/]+)/(?P<id>[^/?&#]+)/?#clipe`]);
URL_REGEXS.set('jp.channel.pandora.tv', [String.raw`(?x)https?://(?:(?:www\.)?pandora\.tv/view/(?P<user_id>[^/]+)/(?P<id>\d+)|(?:.+?\.)?channel\.pandora\.tv/channel/video\.ptv\?|m\.pandora\.tv/?\?)`]);
URL_REGEXS.set('channel.pandora.tv', [String.raw`(?x)https?://(?:(?:www\.)?pandora\.tv/view/(?P<user_id>[^/]+)/(?P<id>\d+)|(?:.+?\.)?channel\.pandora\.tv/channel/video\.ptv\?|m\.pandora\.tv/?\?)`]);
URL_REGEXS.set('www.pandora.tv', [String.raw`(?x)https?://(?:(?:www\.)?pandora\.tv/view/(?P<user_id>[^/]+)/(?P<id>\d+)|(?:.+?\.)?channel\.pandora\.tv/channel/video\.ptv\?|m\.pandora\.tv/?\?)`]);
URL_REGEXS.set('m.pandora.tv', [String.raw`(?x)https?://(?:(?:www\.)?pandora\.tv/view/(?P<user_id>[^/]+)/(?P<id>\d+)|(?:.+?\.)?channel\.pandora\.tv/channel/video\.ptv\?|m\.pandora\.tv/?\?)`]);
URL_REGEXS.set('demo.hosted.panopto.com', [String.raw`(?P<base_url>https?://[\w.-]+\.panopto.(?:com|eu)/Panopto)/Pages/(Viewer|Embed)\.aspx.*(?:\?|&)id=(?P<id>[a-f0-9-]+)`, String.raw`(?P<base_url>https?://[\w.-]+\.panopto.(?:com|eu)/Panopto)/Pages/Sessions/List\.aspx`]);
URL_REGEXS.set('howtovideos.hosted.panopto.com', [String.raw`(?P<base_url>https?://[\w.-]+\.panopto.(?:com|eu)/Panopto)/Pages/(Viewer|Embed)\.aspx.*(?:\?|&)id=(?P<id>[a-f0-9-]+)`, String.raw`(?P<base_url>https?://[\w.-]+\.panopto.(?:com|eu)/Panopto)/Pages/Sessions/List\.aspx`, String.raw`(?P<base_url>https?://[\w.-]+\.panopto.(?:com|eu)/Panopto)/Pages/(Viewer|Embed)\.aspx.*(?:\?|&)pid=(?P<id>[a-f0-9-]+)`]);
URL_REGEXS.set('unisa.au.panopto.com', [String.raw`(?P<base_url>https?://[\w.-]+\.panopto.(?:com|eu)/Panopto)/Pages/(Viewer|Embed)\.aspx.*(?:\?|&)id=(?P<id>[a-f0-9-]+)`]);
URL_REGEXS.set('na-training-1.hosted.panopto.com', [String.raw`(?P<base_url>https?://[\w.-]+\.panopto.(?:com|eu)/Panopto)/Pages/(Viewer|Embed)\.aspx.*(?:\?|&)id=(?P<id>[a-f0-9-]+)`]);
URL_REGEXS.set('ucc.cloud.panopto.eu', [String.raw`(?P<base_url>https?://[\w.-]+\.panopto.(?:com|eu)/Panopto)/Pages/(Viewer|Embed)\.aspx.*(?:\?|&)id=(?P<id>[a-f0-9-]+)`]);
URL_REGEXS.set('brown.hosted.panopto.com', [String.raw`(?P<base_url>https?://[\w.-]+\.panopto.(?:com|eu)/Panopto)/Pages/(Viewer|Embed)\.aspx.*(?:\?|&)id=(?P<id>[a-f0-9-]+)`]);
URL_REGEXS.set('utsa.hosted.panopto.com', [String.raw`(?P<base_url>https?://[\w.-]+\.panopto.(?:com|eu)/Panopto)/Pages/(Viewer|Embed)\.aspx.*(?:\?|&)pid=(?P<id>[a-f0-9-]+)`]);
URL_REGEXS.set('www.paramountnetwork.com', [String.raw`https?://(?:www\.)?paramountnetwork\.com/[^/]+/[\da-z]{6}(?:[/?#&]|$)`]);
URL_REGEXS.set('www.paramountplus.com', [String.raw`(?x)(?:paramountplus:|https?://(?:www\.)?(?:paramountplus\.com/(?:shows|movies)/(?:video|[^/]+/video|[^/]+)/)(?P<id>[\w-]+))`, String.raw`https?://(?:www\.)?paramountplus\.com/shows/(?P<id>[a-zA-Z0-9-_]+)/?(?:[#?]|$)`]);
URL_REGEXS.set('parler.com', [String.raw`https://parler\.com/feed/(?P<id>[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12})`]);
URL_REGEXS.set('parliamentlive.tv', [String.raw`(?i)https?://(?:www\.)?parliamentlive\.tv/Event/Index/(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`]);
URL_REGEXS.set('parlview.aph.gov.au', [String.raw`https?://(?:www\.)?parlview\.aph\.gov\.au/(?:[^/]+)?\bvideoID=(?P<id>\d{6})`]);
URL_REGEXS.set('www.patreon.com', [String.raw`https?://(?:www\.)?patreon\.com/(?:creation\?hid=|posts/(?:[\w-]+-)?)(?P<id>\d+)`, String.raw`https?://(?:www\.)?patreon\.com/(?!rss)(?:(?:m/(?P<campaign_id>\d+))|(?P<vanity>[-\w]+))`]);
URL_REGEXS.set('www.pbs.org', [String.raw`(?x)https?://(?:# Direct video URL(?:(?:video|www|player)\.pbs\.org|video\.aptv\.org|video\.gpb\.org|video\.mpbonline\.org|video\.wnpt\.org|video\.wfsu\.org|video\.wsre\.org|video\.wtcitv\.org|video\.pba\.org|video\.alaskapublic\.org|video\.azpbs\.org|portal\.knme\.org|video\.vegaspbs\.org|watch\.aetn\.org|video\.ket\.org|video\.wkno\.org|video\.lpb\.org|videos\.oeta\.tv|video\.optv\.org|watch\.wsiu\.org|video\.keet\.org|pbs\.kixe\.org|video\.kpbs\.org|video\.kqed\.org|vids\.kvie\.org|video\.pbssocal\.org|video\.valleypbs\.org|video\.cptv\.org|watch\.knpb\.org|video\.soptv\.org|video\.rmpbs\.org|video\.kenw\.org|video\.kued\.org|video\.wyomingpbs\.org|video\.cpt12\.org|video\.kbyueleven\.org|video\.thirteen\.org|video\.wgbh\.org|video\.wgby\.org|watch\.njtvonline\.org|watch\.wliw\.org|video\.mpt\.tv|watch\.weta\.org|video\.whyy\.org|video\.wlvt\.org|video\.wvpt\.net|video\.whut\.org|video\.wedu\.org|video\.wgcu\.org|video\.wpbt2\.org|video\.wucftv\.org|video\.wuft\.org|watch\.wxel\.org|video\.wlrn\.org|video\.wusf\.usf\.edu|video\.scetv\.org|video\.unctv\.org|video\.pbshawaii\.org|video\.idahoptv\.org|video\.ksps\.org|watch\.opb\.org|watch\.nwptv\.org|video\.will\.illinois\.edu|video\.networkknowledge\.tv|video\.wttw\.com|video\.iptv\.org|video\.ninenet\.org|video\.wfwa\.org|video\.wfyi\.org|video\.mptv\.org|video\.wnin\.org|video\.wnit\.org|video\.wpt\.org|video\.wvut\.org|video\.weiu\.net|video\.wqpt\.org|video\.wycc\.org|video\.wipb\.org|video\.indianapublicmedia\.org|watch\.cetconnect\.org|video\.thinktv\.org|video\.wbgu\.org|video\.wgvu\.org|video\.netnebraska\.org|video\.pioneer\.org|watch\.sdpb\.org|video\.tpt\.org|watch\.ksmq\.org|watch\.kpts\.org|watch\.ktwu\.org|watch\.easttennesseepbs\.org|video\.wcte\.tv|video\.wljt\.org|video\.wosu\.org|video\.woub\.org|video\.wvpublic\.org|video\.wkyupbs\.org|video\.kera\.org|video\.mpbn\.net|video\.mountainlake\.org|video\.nhptv\.org|video\.vpt\.org|video\.witf\.org|watch\.wqed\.org|video\.wmht\.org|video\.deltabroadcasting\.org|video\.dptv\.org|video\.wcmu\.org|video\.wkar\.org|wnmuvideo\.nmu\.edu|video\.wdse\.org|video\.wgte\.org|video\.lptv\.org|video\.kmos\.org|watch\.montanapbs\.org|video\.krwg\.org|video\.kacvtv\.org|video\.kcostv\.org|video\.wcny\.org|video\.wned\.org|watch\.wpbstv\.org|video\.wskg\.org|video\.wxxi\.org|video\.wpsu\.org|on-demand\.wvia\.org|video\.wtvi\.org|video\.westernreservepublicmedia\.org|video\.ideastream\.org|video\.kcts9\.org|video\.basinpbs\.org|video\.houstonpbs\.org|video\.klrn\.org|video\.klru\.tv|video\.wtjx\.org|video\.ideastations\.org|video\.kbtc\.org)/(?:(?:vir|port)alplayer|video)/(?P<id>[0-9]+)(?:[?/]|$) |# Article with embedded player (or direct video)(?:www\.)?pbs\.org/(?:[^/]+/){1,5}(?P<presumptive_id>[^/]+?)(?:\.html)?/?(?:$|[?\#]) |# Player(?:video|player)\.pbs\.org/(?:widget/)?partnerplayer/(?P<player_id>[^/]+))`]);
URL_REGEXS.set('player.pbs.org', [String.raw`(?x)https?://(?:# Direct video URL(?:(?:video|www|player)\.pbs\.org|video\.aptv\.org|video\.gpb\.org|video\.mpbonline\.org|video\.wnpt\.org|video\.wfsu\.org|video\.wsre\.org|video\.wtcitv\.org|video\.pba\.org|video\.alaskapublic\.org|video\.azpbs\.org|portal\.knme\.org|video\.vegaspbs\.org|watch\.aetn\.org|video\.ket\.org|video\.wkno\.org|video\.lpb\.org|videos\.oeta\.tv|video\.optv\.org|watch\.wsiu\.org|video\.keet\.org|pbs\.kixe\.org|video\.kpbs\.org|video\.kqed\.org|vids\.kvie\.org|video\.pbssocal\.org|video\.valleypbs\.org|video\.cptv\.org|watch\.knpb\.org|video\.soptv\.org|video\.rmpbs\.org|video\.kenw\.org|video\.kued\.org|video\.wyomingpbs\.org|video\.cpt12\.org|video\.kbyueleven\.org|video\.thirteen\.org|video\.wgbh\.org|video\.wgby\.org|watch\.njtvonline\.org|watch\.wliw\.org|video\.mpt\.tv|watch\.weta\.org|video\.whyy\.org|video\.wlvt\.org|video\.wvpt\.net|video\.whut\.org|video\.wedu\.org|video\.wgcu\.org|video\.wpbt2\.org|video\.wucftv\.org|video\.wuft\.org|watch\.wxel\.org|video\.wlrn\.org|video\.wusf\.usf\.edu|video\.scetv\.org|video\.unctv\.org|video\.pbshawaii\.org|video\.idahoptv\.org|video\.ksps\.org|watch\.opb\.org|watch\.nwptv\.org|video\.will\.illinois\.edu|video\.networkknowledge\.tv|video\.wttw\.com|video\.iptv\.org|video\.ninenet\.org|video\.wfwa\.org|video\.wfyi\.org|video\.mptv\.org|video\.wnin\.org|video\.wnit\.org|video\.wpt\.org|video\.wvut\.org|video\.weiu\.net|video\.wqpt\.org|video\.wycc\.org|video\.wipb\.org|video\.indianapublicmedia\.org|watch\.cetconnect\.org|video\.thinktv\.org|video\.wbgu\.org|video\.wgvu\.org|video\.netnebraska\.org|video\.pioneer\.org|watch\.sdpb\.org|video\.tpt\.org|watch\.ksmq\.org|watch\.kpts\.org|watch\.ktwu\.org|watch\.easttennesseepbs\.org|video\.wcte\.tv|video\.wljt\.org|video\.wosu\.org|video\.woub\.org|video\.wvpublic\.org|video\.wkyupbs\.org|video\.kera\.org|video\.mpbn\.net|video\.mountainlake\.org|video\.nhptv\.org|video\.vpt\.org|video\.witf\.org|watch\.wqed\.org|video\.wmht\.org|video\.deltabroadcasting\.org|video\.dptv\.org|video\.wcmu\.org|video\.wkar\.org|wnmuvideo\.nmu\.edu|video\.wdse\.org|video\.wgte\.org|video\.lptv\.org|video\.kmos\.org|watch\.montanapbs\.org|video\.krwg\.org|video\.kacvtv\.org|video\.kcostv\.org|video\.wcny\.org|video\.wned\.org|watch\.wpbstv\.org|video\.wskg\.org|video\.wxxi\.org|video\.wpsu\.org|on-demand\.wvia\.org|video\.wtvi\.org|video\.westernreservepublicmedia\.org|video\.ideastream\.org|video\.kcts9\.org|video\.basinpbs\.org|video\.houstonpbs\.org|video\.klrn\.org|video\.klru\.tv|video\.wtjx\.org|video\.ideastations\.org|video\.kbtc\.org)/(?:(?:vir|port)alplayer|video)/(?P<id>[0-9]+)(?:[?/]|$) |# Article with embedded player (or direct video)(?:www\.)?pbs\.org/(?:[^/]+/){1,5}(?P<presumptive_id>[^/]+?)(?:\.html)?/?(?:$|[?\#]) |# Player(?:video|player)\.pbs\.org/(?:widget/)?partnerplayer/(?P<player_id>[^/]+))`]);
URL_REGEXS.set('watch.knpb.org', [String.raw`(?x)https?://(?:# Direct video URL(?:(?:video|www|player)\.pbs\.org|video\.aptv\.org|video\.gpb\.org|video\.mpbonline\.org|video\.wnpt\.org|video\.wfsu\.org|video\.wsre\.org|video\.wtcitv\.org|video\.pba\.org|video\.alaskapublic\.org|video\.azpbs\.org|portal\.knme\.org|video\.vegaspbs\.org|watch\.aetn\.org|video\.ket\.org|video\.wkno\.org|video\.lpb\.org|videos\.oeta\.tv|video\.optv\.org|watch\.wsiu\.org|video\.keet\.org|pbs\.kixe\.org|video\.kpbs\.org|video\.kqed\.org|vids\.kvie\.org|video\.pbssocal\.org|video\.valleypbs\.org|video\.cptv\.org|watch\.knpb\.org|video\.soptv\.org|video\.rmpbs\.org|video\.kenw\.org|video\.kued\.org|video\.wyomingpbs\.org|video\.cpt12\.org|video\.kbyueleven\.org|video\.thirteen\.org|video\.wgbh\.org|video\.wgby\.org|watch\.njtvonline\.org|watch\.wliw\.org|video\.mpt\.tv|watch\.weta\.org|video\.whyy\.org|video\.wlvt\.org|video\.wvpt\.net|video\.whut\.org|video\.wedu\.org|video\.wgcu\.org|video\.wpbt2\.org|video\.wucftv\.org|video\.wuft\.org|watch\.wxel\.org|video\.wlrn\.org|video\.wusf\.usf\.edu|video\.scetv\.org|video\.unctv\.org|video\.pbshawaii\.org|video\.idahoptv\.org|video\.ksps\.org|watch\.opb\.org|watch\.nwptv\.org|video\.will\.illinois\.edu|video\.networkknowledge\.tv|video\.wttw\.com|video\.iptv\.org|video\.ninenet\.org|video\.wfwa\.org|video\.wfyi\.org|video\.mptv\.org|video\.wnin\.org|video\.wnit\.org|video\.wpt\.org|video\.wvut\.org|video\.weiu\.net|video\.wqpt\.org|video\.wycc\.org|video\.wipb\.org|video\.indianapublicmedia\.org|watch\.cetconnect\.org|video\.thinktv\.org|video\.wbgu\.org|video\.wgvu\.org|video\.netnebraska\.org|video\.pioneer\.org|watch\.sdpb\.org|video\.tpt\.org|watch\.ksmq\.org|watch\.kpts\.org|watch\.ktwu\.org|watch\.easttennesseepbs\.org|video\.wcte\.tv|video\.wljt\.org|video\.wosu\.org|video\.woub\.org|video\.wvpublic\.org|video\.wkyupbs\.org|video\.kera\.org|video\.mpbn\.net|video\.mountainlake\.org|video\.nhptv\.org|video\.vpt\.org|video\.witf\.org|watch\.wqed\.org|video\.wmht\.org|video\.deltabroadcasting\.org|video\.dptv\.org|video\.wcmu\.org|video\.wkar\.org|wnmuvideo\.nmu\.edu|video\.wdse\.org|video\.wgte\.org|video\.lptv\.org|video\.kmos\.org|watch\.montanapbs\.org|video\.krwg\.org|video\.kacvtv\.org|video\.kcostv\.org|video\.wcny\.org|video\.wned\.org|watch\.wpbstv\.org|video\.wskg\.org|video\.wxxi\.org|video\.wpsu\.org|on-demand\.wvia\.org|video\.wtvi\.org|video\.westernreservepublicmedia\.org|video\.ideastream\.org|video\.kcts9\.org|video\.basinpbs\.org|video\.houstonpbs\.org|video\.klrn\.org|video\.klru\.tv|video\.wtjx\.org|video\.ideastations\.org|video\.kbtc\.org)/(?:(?:vir|port)alplayer|video)/(?P<id>[0-9]+)(?:[?/]|$) |# Article with embedded player (or direct video)(?:www\.)?pbs\.org/(?:[^/]+/){1,5}(?P<presumptive_id>[^/]+?)(?:\.html)?/?(?:$|[?\#]) |# Player(?:video|player)\.pbs\.org/(?:widget/)?partnerplayer/(?P<player_id>[^/]+))`]);
URL_REGEXS.set('www.pearvideo.com', [String.raw`https?://(?:www\.)?pearvideo\.com/video_(?P<id>\d+)`]);
URL_REGEXS.set('peekvids.com', [String.raw`(?x)https?://(?:www\.)?(?P<domain>peekvids\.com)/(?:(?:[^/?#]+/){2}|embed/?\?(?:[^#]*&)?v=)(?P<id>[^/?&#]*)`]);
URL_REGEXS.set('www.peer.tv', [String.raw`https?://(?:www\.)?peer\.tv/(?:de|it|en)/(?P<id>\d+)`]);
URL_REGEXS.set('framatube.org', [String.raw`(?x)(?:peertube:(?P<host>[^:]+):|https?://(?P<host_2>(?:# Taken from https://instances.joinpeertube.org/instances40two\.tube|a\.metube\.ch|advtv\.ml|algorithmic\.tv|alimulama\.com|arcana\.fun|archive\.vidicon\.org|artefac-paris\.tv|auf1\.eu|battlepenguin\.video|beertube\.epgn\.ch|befree\.nohost\.me|bideoak\.argia\.eus|birkeundnymphe\.de|bitcointv\.com|cattube\.org|clap\.nerv-project\.eu|climatejustice\.video|comf\.tube|conspiracydistillery\.com|darkvapor\.nohost\.me|daschauher\.aksel\.rocks|digitalcourage\.video|dreiecksnebel\.alex-detsch\.de|eduvid\.org|evangelisch\.video|exo\.tube|fair\.tube|fediverse\.tv|film\.k-prod\.fr|flim\.txmn\.tk|fotogramas\.politicaconciencia\.org|ftsi\.ru|gary\.vger\.cloud|graeber\.video|greatview\.video|grypstube\.uni-greifswald\.de|highvoltage\.tv|hpstube\.fr|htp\.live|hyperreal\.tube|juggling\.digital|kino\.kompot\.si|kino\.schuerz\.at|kinowolnosc\.pl|kirche\.peertube-host\.de|kodcast\.com|kolektiva\.media|kraut\.zone|kumi\.tube|lastbreach\.tv|lepetitmayennais\.fr\.nf|lexx\.impa\.me|libertynode\.tv|libra\.syntazia\.org|libremedia\.video|live\.libratoi\.org|live\.nanao\.moe|live\.toobnix\.org|livegram\.net|lolitube\.freedomchan\.moe|lucarne\.balsamine\.be|maindreieck-tv\.de|mani\.tube|manicphase\.me|media\.fsfe\.org|media\.gzevd\.de|media\.inno3\.cricket|media\.kaitaia\.life|media\.krashboyz\.org|media\.over-world\.org|media\.skewed\.de|media\.undeadnetwork\.de|medias\.pingbase\.net|melsungen\.peertube-host\.de|mirametube\.fr|mojotube\.net|monplaisirtube\.ddns\.net|mountaintown\.video|my\.bunny\.cafe|myfreetube\.de|mytube\.kn-cloud\.de|mytube\.madzel\.de|myworkoutarenapeertube\.cf|nanawel-peertube\.dyndns\.org|nastub\.cz|offenes\.tv|orgdup\.media|ovaltube\.codinglab\.ch|p2ptv\.ru|p\.eertu\.be|p\.lu|peer\.azurs\.fr|peertube1\.zeteo\.me|peertube\.020\.pl|peertube\.0x5e\.eu|peertube\.alpharius\.io|peertube\.am-networks\.fr|peertube\.anduin\.net|peertube\.anzui\.dev|peertube\.arbleizez\.bzh|peertube\.art3mis\.de|peertube\.atilla\.org|peertube\.atsuchan\.page|peertube\.aukfood\.net|peertube\.aventer\.biz|peertube\.b38\.rural-it\.org|peertube\.beeldengeluid\.nl|peertube\.be|peertube\.bgzashtita\.es|peertube\.bitsandlinux\.com|peertube\.biz|peertube\.boba\.best|peertube\.br0\.fr|peertube\.bridaahost\.ynh\.fr|peertube\.bubbletea\.dev|peertube\.bubuit\.net|peertube\.cabaal\.net|peertube\.cats-home\.net|peertube\.chemnitz\.freifunk\.net|peertube\.chevro\.fr|peertube\.chrisspiegl\.com|peertube\.chtisurel\.net|peertube\.cipherbliss\.com|peertube\.cloud\.sans\.pub|peertube\.cpge-brizeux\.fr|peertube\.ctseuro\.com|peertube\.cuatrolibertades\.org|peertube\.cybercirujas\.club|peertube\.cythin\.com|peertube\.davigge\.com|peertube\.dc\.pini\.fr|peertube\.debian\.social|peertube\.demonix\.fr|peertube\.designersethiques\.org|peertube\.desmu\.fr|peertube\.devloprog\.org|peertube\.devol\.it|peertube\.dtmf\.ca|peertube\.ecologie\.bzh|peertube\.eu\.org|peertube\.european-pirates\.eu|peertube\.euskarabildua\.eus|peertube\.fenarinarsa\.com|peertube\.fomin\.site|peertube\.forsud\.be|peertube\.francoispelletier\.org|peertube\.freenet\.ru|peertube\.freetalklive\.com|peertube\.functional\.cafe|peertube\.gardeludwig\.fr|peertube\.gargantia\.fr|peertube\.gcfamily\.fr|peertube\.genma\.fr|peertube\.get-racing\.de|peertube\.gidikroon\.eu|peertube\.gruezishop\.ch|peertube\.habets\.house|peertube\.hackerfraternity\.org|peertube\.ichigo\.everydayimshuflin\.com|peertube\.ignifi\.me|peertube\.inapurna\.org|peertube\.informaction\.info|peertube\.interhop\.org|peertube\.iselfhost\.com|peertube\.it|peertube\.jensdiemer\.de|peertube\.joffreyverd\.fr|peertube\.kalua\.im|peertube\.kathryl\.fr|peertube\.keazilla\.net|peertube\.klaewyss\.fr|peertube\.kodcast\.com|peertube\.kx\.studio|peertube\.lagvoid\.com|peertube\.lavallee\.tech|peertube\.le5emeaxe\.fr|peertube\.lestutosdeprocessus\.fr|peertube\.librenet\.co\.za|peertube\.logilab\.fr|peertube\.louisematic\.site|peertube\.luckow\.org|peertube\.luga\.at|peertube\.lyceeconnecte\.fr|peertube\.manalejandro\.com|peertube\.marud\.fr|peertube\.mattone\.net|peertube\.maxweiss\.io|peertube\.monlycee\.net|peertube\.mxinfo\.fr|peertube\.myrasp\.eu|peertube\.nebelcloud\.de|peertube\.netzbegruenung\.de|peertube\.newsocial\.tech|peertube\.nicolastissot\.fr|peertube\.nz|peertube\.offerman\.com|peertube\.opencloud\.lu|peertube\.orthus\.link|peertube\.patapouf\.xyz|peertube\.pi2\.dev|peertube\.plataformess\.org|peertube\.pl|peertube\.portaesgnos\.org|peertube\.r2\.enst\.fr|peertube\.r5c3\.fr|peertube\.radres\.xyz|peertube\.red|peertube\.robonomics\.network|peertube\.rtnkv\.cloud|peertube\.runfox\.tk|peertube\.satoshishop\.de|peertube\.scic-tetris\.org|peertube\.securitymadein\.lu|peertube\.semweb\.pro|peertube\.social\.my-wan\.de|peertube\.soykaf\.org|peertube\.stefofficiel\.me|peertube\.stream|peertube\.su|peertube\.swrs\.net|peertube\.takeko\.cyou|peertube\.tangentfox\.com|peertube\.taxinachtegel\.de|peertube\.thenewoil\.xyz|peertube\.ti-fr\.com|peertube\.tiennot\.net|peertube\.troback\.com|peertube\.tspu\.edu\.ru|peertube\.tux\.ovh|peertube\.tv|peertube\.tweb\.tv|peertube\.ucy\.de|peertube\.underworld\.fr|peertube\.us\.to|peertube\.ventresmous\.fr|peertube\.vlaki\.cz|peertube\.w\.utnw\.de|peertube\.westring\.digital|peertube\.xwiki\.com|peertube\.zoz-serv\.org|peervideo\.ru|periscope\.numenaute\.org|perron-tube\.de|petitlutinartube\.fr|phijkchu\.com|pierre\.tube|piraten\.space|play\.rosano\.ca|player\.ojamajo\.moe|plextube\.nl|pocketnetpeertube1\.nohost\.me|pocketnetpeertube3\.nohost\.me|pocketnetpeertube4\.nohost\.me|pocketnetpeertube5\.nohost\.me|pocketnetpeertube6\.nohost\.me|pt\.24-7\.ro|pt\.apathy\.top|pt\.diaspodon\.fr|pt\.fedi\.tech|pt\.maciej\.website|ptb\.lunarviews\.net|ptmir1\.inter21\.net|ptmir2\.inter21\.net|ptmir3\.inter21\.net|ptmir4\.inter21\.net|ptmir5\.inter21\.net|ptube\.horsentiers\.fr|ptube\.xmanifesto\.club|queermotion\.org|re-wizja\.re-medium\.com|regarder\.sans\.pub|ruraletv\.ovh|s1\.gegenstimme\.tv|s2\.veezee\.tube|sdmtube\.fr|sender-fm\.veezee\.tube|serv1\.wiki-tube\.de|serv3\.wiki-tube\.de|sickstream\.net|sleepy\.tube|sovran\.video|spectra\.video|stream\.elven\.pw|stream\.k-prod\.fr|stream\.shahab\.nohost\.me|streamsource\.video|studios\.racer159\.com|testtube\.florimond\.eu|tgi\.hosted\.spacebear\.ee|thaitube\.in\.th|the\.jokertv\.eu|theater\.ethernia\.net|thecool\.tube|tilvids\.com|toob\.bub\.org|tpaw\.video|truetube\.media|tuba\.lhub\.pl|tube-aix-marseille\.beta\.education\.fr|tube-amiens\.beta\.education\.fr|tube-besancon\.beta\.education\.fr|tube-bordeaux\.beta\.education\.fr|tube-clermont-ferrand\.beta\.education\.fr|tube-corse\.beta\.education\.fr|tube-creteil\.beta\.education\.fr|tube-dijon\.beta\.education\.fr|tube-education\.beta\.education\.fr|tube-grenoble\.beta\.education\.fr|tube-lille\.beta\.education\.fr|tube-limoges\.beta\.education\.fr|tube-montpellier\.beta\.education\.fr|tube-nancy\.beta\.education\.fr|tube-nantes\.beta\.education\.fr|tube-nice\.beta\.education\.fr|tube-normandie\.beta\.education\.fr|tube-orleans-tours\.beta\.education\.fr|tube-outremer\.beta\.education\.fr|tube-paris\.beta\.education\.fr|tube-poitiers\.beta\.education\.fr|tube-reims\.beta\.education\.fr|tube-rennes\.beta\.education\.fr|tube-strasbourg\.beta\.education\.fr|tube-toulouse\.beta\.education\.fr|tube-versailles\.beta\.education\.fr|tube1\.it\.tuwien\.ac\.at|tube\.abolivier\.bzh|tube\.ac-amiens\.fr|tube\.aerztefueraufklaerung\.de|tube\.alexx\.ml|tube\.amic37\.fr|tube\.anufrij\.de|tube\.apolut\.net|tube\.arkhalabs\.io|tube\.arthack\.nz|tube\.as211696\.net|tube\.avensio\.de|tube\.azbyka\.ru|tube\.azkware\.net|tube\.bachaner\.fr|tube\.bmesh\.org|tube\.borked\.host|tube\.bstly\.de|tube\.chaoszone\.tv|tube\.chatelet\.ovh|tube\.cloud-libre\.eu|tube\.cms\.garden|tube\.cowfee\.moe|tube\.cryptography\.dog|tube\.darknight-coffee\.org|tube\.dev\.lhub\.pl|tube\.distrilab\.fr|tube\.dsocialize\.net|tube\.ebin\.club|tube\.fdn\.fr|tube\.florimond\.eu|tube\.foxarmy\.ml|tube\.foxden\.party|tube\.frischesicht\.de|tube\.futuretic\.fr|tube\.gnous\.eu|tube\.grap\.coop|tube\.graz\.social|tube\.grin\.hu|tube\.hackerscop\.org|tube\.hordearii\.fr|tube\.jeena\.net|tube\.kai-stuht\.com|tube\.kockatoo\.org|tube\.kotur\.org|tube\.lacaveatonton\.ovh|tube\.linkse\.media|tube\.lokad\.com|tube\.lucie-philou\.com|tube\.melonbread\.xyz|tube\.mfraters\.net|tube\.motuhake\.xyz|tube\.mrbesen\.de|tube\.nah\.re|tube\.nchoco\.net|tube\.novg\.net|tube\.nox-rhea\.org|tube\.nuagelibre\.fr|tube\.nx12\.net|tube\.octaplex\.net|tube\.odat\.xyz|tube\.oisux\.org|tube\.opportunis\.me|tube\.org\.il|tube\.ortion\.xyz|tube\.others\.social|tube\.picasoft\.net|tube\.plomlompom\.com|tube\.pmj\.rocks|tube\.portes-imaginaire\.org|tube\.pyngu\.com|tube\.rebellion\.global|tube\.rhythms-of-resistance\.org|tube\.rita\.moe|tube\.rsi\.cnr\.it|tube\.s1gm4\.eu|tube\.saumon\.io|tube\.schleuss\.online|tube\.schule\.social|tube\.seditio\.fr|tube\.shanti\.cafe|tube\.shela\.nu|tube\.skrep\.in|tube\.sp-codes\.de|tube\.sp4ke\.com|tube\.superseriousbusiness\.org|tube\.systest\.eu|tube\.tappret\.fr|tube\.tardis\.world|tube\.toontoet\.nl|tube\.tpshd\.de|tube\.troopers\.agency|tube\.tylerdavis\.xyz|tube\.undernet\.uy|tube\.vigilian-consulting\.nl|tube\.vraphim\.com|tube\.wehost\.lgbt|tube\.wien\.rocks|tube\.wolfe\.casa|tube\.xd0\.de|tube\.xy-space\.de|tube\.yapbreak\.fr|tubedu\.org|tubes\.jodh\.us|tuktube\.com|turkum\.me|tututu\.tube|tuvideo\.encanarias\.info|tv1\.cocu\.cc|tv1\.gomntu\.space|tv2\.cocu\.cc|tv\.adn\.life|tv\.atmx\.ca|tv\.bitma\.st|tv\.generallyrubbish\.net\.au|tv\.lumbung\.space|tv\.mattchristiansenmedia\.com|tv\.netwhood\.online|tv\.neue\.city|tv\.piejacker\.net|tv\.pirateradio\.social|tv\.undersco\.re|tvox\.ru|twctube\.twc-zone\.eu|unfilter\.tube|v\.basspistol\.org|v\.kisombrella\.top|v\.lastorder\.xyz|v\.lor\.sh|v\.phreedom\.club|v\.sil\.sh|v\.szy\.io|v\.xxxapex\.com|veezee\.tube|vid\.dascoyote\.xyz|vid\.garwood\.io|vid\.ncrypt\.at|vid\.pravdastalina\.info|vid\.qorg11\.net|vid\.rajeshtaylor\.com|vid\.samtripoli\.com|vid\.werefox\.dev|vid\.wildeboer\.net|video-cave-v2\.de|video\.076\.ne\.jp|video\.1146\.nohost\.me|video\.altertek\.org|video\.anartist\.org|video\.apps\.thedoodleproject\.net|video\.artist\.cx|video\.asgardius\.company|video\.balsillie\.net|video\.bards\.online|video\.binarydad\.com|video\.blast-info\.fr|video\.catgirl\.biz|video\.cigliola\.com|video\.cm-en-transition\.fr|video\.cnt\.social|video\.coales\.co|video\.codingfield\.com|video\.comptoir\.net|video\.comune\.trento\.it|video\.cpn\.so|video\.csc49\.fr|video\.cybre\.town|video\.demokratischer-sommer\.de|video\.discord-insoumis\.fr|video\.dolphincastle\.com|video\.dresden\.network|video\.ecole-89\.com|video\.elgrillolibertario\.org|video\.emergeheart\.info|video\.eradicatinglove\.xyz|video\.ethantheenigma\.me|video\.exodus-privacy\.eu\.org|video\.fbxl\.net|video\.fhtagn\.org|video\.greenmycity\.eu|video\.guerredeclasse\.fr|video\.gyt\.is|video\.hackers\.town|video\.hardlimit\.com|video\.hooli\.co|video\.igem\.org|video\.internet-czas-dzialac\.pl|video\.islameye\.com|video\.kicik\.fr|video\.kuba-orlik\.name|video\.kyushojitsu\.ca|video\.lavolte\.net|video\.lespoesiesdheloise\.fr|video\.liberta\.vip|video\.liege\.bike|video\.linc\.systems|video\.linux\.it|video\.linuxtrent\.it|video\.lokal\.social|video\.lono\.space|video\.lunasqu\.ee|video\.lundi\.am|video\.marcorennmaus\.de|video\.mass-trespass\.uk|video\.mugoreve\.fr|video\.mundodesconocido\.com|video\.mycrowd\.ca|video\.nogafam\.es|video\.odayacres\.farm|video\.ozgurkon\.org|video\.p1ng0ut\.social|video\.p3x\.de|video\.pcf\.fr|video\.pony\.gallery|video\.potate\.space|video\.pourpenser\.pro|video\.progressiv\.dev|video\.resolutions\.it|video\.rw501\.de|video\.screamer\.wiki|video\.sdm-tools\.net|video\.sftblw\.moe|video\.shitposter\.club|video\.skyn3t\.in|video\.soi\.ch|video\.stuartbrand\.co\.uk|video\.thinkof\.name|video\.toot\.pt|video\.triplea\.fr|video\.turbo\.chat|video\.vaku\.org\.ua|video\.veloma\.org|video\.violoncello\.ch|video\.wilkie\.how|video\.wsf2021\.info|videorelay\.co|videos-passages\.huma-num\.fr|videos\.3d-wolf\.com|videos\.ahp-numerique\.fr|videos\.alexandrebadalo\.pt|videos\.archigny\.net|videos\.benjaminbrady\.ie|videos\.buceoluegoexisto\.com|videos\.capas\.se|videos\.casually\.cat|videos\.cloudron\.io|videos\.coletivos\.org|videos\.danksquad\.org|videos\.denshi\.live|videos\.fromouter\.space|videos\.fsci\.in|videos\.globenet\.org|videos\.hauspie\.fr|videos\.hush\.is|videos\.john-livingston\.fr|videos\.jordanwarne\.xyz|videos\.lavoixdessansvoix\.org|videos\.leslionsfloorball\.fr|videos\.lucero\.top|videos\.martyn\.berlin|videos\.mastodont\.cat|videos\.monstro1\.com|videos\.npo\.city|videos\.optoutpod\.com|videos\.petch\.rocks|videos\.pzelawski\.xyz|videos\.rampin\.org|videos\.scanlines\.xyz|videos\.shmalls\.pw|videos\.sibear\.fr|videos\.stadtfabrikanten\.org|videos\.tankernn\.eu|videos\.testimonia\.org|videos\.thisishowidontdisappear\.com|videos\.traumaheilung\.net|videos\.trom\.tf|videos\.wakkerewereld\.nu|videos\.weblib\.re|videos\.yesil\.club|vids\.roshless\.me|vids\.tekdmn\.me|vidz\.dou\.bet|vod\.lumikko\.dev|vs\.uniter\.network|vulgarisation-informatique\.fr|watch\.breadtube\.tv|watch\.deranalyst\.ch|watch\.ignorance\.eu|watch\.krazy\.party|watch\.libertaria\.space|watch\.rt4mn\.org|watch\.softinio\.com|watch\.tubelab\.video|web-fellow\.de|webtv\.vandoeuvre\.net|wechill\.space|wikileaks\.video|wiwi\.video|worldofvids\.com|wwtube\.net|www4\.mir\.inter21\.net|www\.birkeundnymphe\.de|www\.captain-german\.com|www\.wiki-tube\.de|xxivproduction\.video|xxx\.noho\.st|# from youtube-dlpeertube\.rainbowswingers\.net|tube\.stanisic\.nl|peer\.suiri\.us|medias\.libox\.fr|videomensoif\.ynh\.fr|peertube\.travelpandas\.eu|peertube\.rachetjay\.fr|peertube\.montecsys\.fr|tube\.eskuero\.me|peer\.tube|peertube\.umeahackerspace\.se|tube\.nx-pod\.de|video\.monsieurbidouille\.fr|tube\.openalgeria\.org|vid\.lelux\.fi|video\.anormallostpod\.ovh|tube\.crapaud-fou\.org|peertube\.stemy\.me|lostpod\.space|exode\.me|peertube\.snargol\.com|vis\.ion\.ovh|videosdulib\.re|v\.mbius\.io|videos\.judrey\.eu|peertube\.osureplayviewer\.xyz|peertube\.mathieufamily\.ovh|www\.videos-libr\.es|fightforinfo\.com|peertube\.fediverse\.ru|peertube\.oiseauroch\.fr|video\.nesven\.eu|v\.bearvideo\.win|video\.qoto\.org|justporn\.cc|video\.vny\.fr|peervideo\.club|tube\.taker\.fr|peertube\.chantierlibre\.org|tube\.ipfixe\.info|tube\.kicou\.info|tube\.dodsorf\.as|videobit\.cc|video\.yukari\.moe|videos\.elbinario\.net|hkvideo\.live|pt\.tux\.tf|www\.hkvideo\.live|FIGHTFORINFO\.com|pt\.765racing\.com|peertube\.gnumeria\.eu\.org|nordenmedia\.com|peertube\.co\.uk|tube\.darfweb\.eu|tube\.kalah-france\.org|0ch\.in|vod\.mochi\.academy|film\.node9\.org|peertube\.hatthieves\.es|video\.fitchfamily\.org|peertube\.ddns\.net|video\.ifuncle\.kr|video\.fdlibre\.eu|tube\.22decembre\.eu|peertube\.harmoniescreatives\.com|tube\.fabrigli\.fr|video\.thedwyers\.co|video\.bruitbruit\.com|peertube\.foxfam\.club|peer\.philoxweb\.be|videos\.bugs\.social|peertube\.malbert\.xyz|peertube\.bilange\.ca|libretube\.net|diytelevision\.com|peertube\.fedilab\.app|libre\.video|video\.mstddntfdn\.online|us\.tv|peertube\.sl-network\.fr|peertube\.dynlinux\.io|peertube\.david\.durieux\.family|peertube\.linuxrocks\.online|peerwatch\.xyz|v\.kretschmann\.social|tube\.otter\.sh|yt\.is\.nota\.live|tube\.dragonpsi\.xyz|peertube\.boneheadmedia\.com|videos\.funkwhale\.audio|watch\.44con\.com|peertube\.gcaillaut\.fr|peertube\.icu|pony\.tube|spacepub\.space|tube\.stbr\.io|v\.mom-gay\.faith|tube\.port0\.xyz|peertube\.simounet\.net|play\.jergefelt\.se|peertube\.zeteo\.me|tube\.danq\.me|peertube\.kerenon\.com|tube\.fab-l3\.org|tube\.calculate\.social|peertube\.mckillop\.org|tube\.netzspielplatz\.de|vod\.ksite\.de|peertube\.laas\.fr|tube\.govital\.net|peertube\.stephenson\.cc|bistule\.nohost\.me|peertube\.kajalinifi\.de|video\.ploud\.jp|video\.omniatv\.com|peertube\.ffs2play\.fr|peertube\.leboulaire\.ovh|peertube\.tronic-studio\.com|peertube\.public\.cat|peertube\.metalbanana\.net|video\.1000i100\.fr|peertube\.alter-nativ-voll\.de|tube\.pasa\.tf|tube\.worldofhauru\.xyz|pt\.kamp\.site|peertube\.teleassist\.fr|videos\.mleduc\.xyz|conf\.tube|media\.privacyinternational\.org|pt\.forty-two\.nl|video\.halle-leaks\.de|video\.grosskopfgames\.de|peertube\.schaeferit\.de|peertube\.jackbot\.fr|tube\.extinctionrebellion\.fr|peertube\.f-si\.org|video\.subak\.ovh|videos\.koweb\.fr|peertube\.zergy\.net|peertube\.roflcopter\.fr|peertube\.floss-marketing-school\.com|vloggers\.social|peertube\.iriseden\.eu|videos\.ubuntu-paris\.org|peertube\.mastodon\.host|armstube\.com|peertube\.s2s\.video|peertube\.lol|tube\.open-plug\.eu|open\.tube|peertube\.ch|peertube\.normandie-libre\.fr|peertube\.slat\.org|video\.lacaveatonton\.ovh|peertube\.uno|peertube\.servebeer\.com|peertube\.fedi\.quebec|tube\.h3z\.jp|tube\.plus200\.com|peertube\.eric\.ovh|tube\.metadocs\.cc|tube\.unmondemeilleur\.eu|gouttedeau\.space|video\.antirep\.net|nrop\.cant\.at|tube\.ksl-bmx\.de|tube\.plaf\.fr|tube\.tchncs\.de|video\.devinberg\.com|hitchtube\.fr|peertube\.kosebamse\.com|yunopeertube\.myddns\.me|peertube\.varney\.fr|peertube\.anon-kenkai\.com|tube\.maiti\.info|tubee\.fr|videos\.dinofly\.com|toobnix\.org|videotape\.me|voca\.tube|video\.heromuster\.com|video\.lemediatv\.fr|video\.up\.edu\.ph|balafon\.video|video\.ivel\.fr|thickrips\.cloud|pt\.laurentkruger\.fr|video\.monarch-pass\.net|peertube\.artica\.center|video\.alternanet\.fr|indymotion\.fr|fanvid\.stopthatimp\.net|video\.farci\.org|v\.lesterpig\.com|video\.okaris\.de|tube\.pawelko\.net|peertube\.mablr\.org|tube\.fede\.re|pytu\.be|evertron\.tv|devtube\.dev-wiki\.de|raptube\.antipub\.org|video\.selea\.se|peertube\.mygaia\.org|video\.oh14\.de|peertube\.livingutopia\.org|peertube\.the-penguin\.de|tube\.thechangebook\.org|tube\.anjara\.eu|pt\.pube\.tk|video\.samedi\.pm|mplayer\.demouliere\.eu|widemus\.de|peertube\.me|peertube\.zapashcanon\.fr|video\.latavernedejohnjohn\.fr|peertube\.pcservice46\.fr|peertube\.mazzonetto\.eu|video\.irem\.univ-paris-diderot\.fr|video\.livecchi\.cloud|alttube\.fr|video\.coop\.tools|video\.cabane-libre\.org|peertube\.openstreetmap\.fr|videos\.alolise\.org|irrsinn\.video|video\.antopie\.org|scitech\.video|tube2\.nemsia\.org|video\.amic37\.fr|peertube\.freeforge\.eu|video\.arbitrarion\.com|video\.datsemultimedia\.com|stoptrackingus\.tv|peertube\.ricostrongxxx\.com|docker\.videos\.lecygnenoir\.info|peertube\.togart\.de|tube\.postblue\.info|videos\.domainepublic\.net|peertube\.cyber-tribal\.com|video\.gresille\.org|peertube\.dsmouse\.net|cinema\.yunohost\.support|tube\.theocevaer\.fr|repro\.video|tube\.4aem\.com|quaziinc\.com|peertube\.metawurst\.space|videos\.wakapo\.com|video\.ploud\.fr|video\.freeradical\.zone|tube\.valinor\.fr|refuznik\.video|pt\.kircheneuenburg\.de|peertube\.asrun\.eu|peertube\.lagob\.fr|videos\.side-ways\.net|91video\.online|video\.valme\.io|video\.taboulisme\.com|videos-libr\.es|tv\.mooh\.fr|nuage\.acostey\.fr|video\.monsieur-a\.fr|peertube\.librelois\.fr|videos\.pair2jeux\.tube|videos\.pueseso\.club|peer\.mathdacloud\.ovh|media\.assassinate-you\.net|vidcommons\.org|ptube\.rousset\.nom\.fr|tube\.cyano\.at|videos\.squat\.net|video\.iphodase\.fr|peertube\.makotoworkshop\.org|peertube\.serveur\.slv-valbonne\.fr|vault\.mle\.party|hostyour\.tv|videos\.hack2g2\.fr|libre\.tube|pire\.artisanlogiciel\.net|videos\.numerique-en-commun\.fr|video\.netsyms\.com|video\.die-partei\.social|video\.writeas\.org|peertube\.swarm\.solvingmaz\.es|tube\.pericoloso\.ovh|watching\.cypherpunk\.observer|videos\.adhocmusic\.com|tube\.rfc1149\.net|peertube\.librelabucm\.org|videos\.numericoop\.fr|peertube\.koehn\.com|peertube\.anarchmusicall\.net|tube\.kampftoast\.de|vid\.y-y\.li|peertube\.xtenz\.xyz|diode\.zone|tube\.egf\.mn|peertube\.nomagic\.uk|visionon\.tv|videos\.koumoul\.com|video\.rastapuls\.com|video\.mantlepro\.com|video\.deadsuperhero\.com|peertube\.musicstudio\.pro|peertube\.we-keys\.fr|artitube\.artifaille\.fr|peertube\.ethernia\.net|tube\.midov\.pl|peertube\.fr|watch\.snoot\.tube|peertube\.donnadieu\.fr|argos\.aquilenet\.fr|tube\.nemsia\.org|tube\.bruniau\.net|videos\.darckoune\.moe|tube\.traydent\.info|dev\.videos\.lecygnenoir\.info|peertube\.nayya\.org|peertube\.live|peertube\.mofgao\.space|video\.lequerrec\.eu|peertube\.amicale\.net|aperi\.tube|tube\.ac-lyon\.fr|video\.lw1\.at|www\.yiny\.org|videos\.pofilo\.fr|tube\.lou\.lt|choob\.h\.etbus\.ch|tube\.hoga\.fr|peertube\.heberge\.fr|video\.obermui\.de|videos\.cloudfrancois\.fr|betamax\.video|video\.typica\.us|tube\.piweb\.be|video\.blender\.org|peertube\.cat|tube\.kdy\.ch|pe\.ertu\.be|peertube\.social|videos\.lescommuns\.org|tv\.datamol\.org|videonaute\.fr|dialup\.express|peertube\.nogafa\.org|megatube\.lilomoino\.fr|peertube\.tamanoir\.foucry\.net|peertube\.devosi\.org|peertube\.1312\.media|tube\.bootlicker\.party|skeptikon\.fr|video\.blueline\.mg|tube\.homecomputing\.fr|tube\.ouahpiti\.info|video\.tedomum\.net|video\.g3l\.org|fontube\.fr|peertube\.gaialabs\.ch|tube\.kher\.nl|peertube\.qtg\.fr|video\.migennes\.net|tube\.p2p\.legal|troll\.tv|videos\.iut-orsay\.fr|peertube\.solidev\.net|videos\.cemea\.org|video\.passageenseine\.fr|videos\.festivalparminous\.org|peertube\.touhoppai\.moe|sikke\.fi|peer\.hostux\.social|share\.tube|peertube\.walkingmountains\.fr|videos\.benpro\.fr|peertube\.parleur\.net|peertube\.heraut\.eu|tube\.aquilenet\.fr|peertube\.gegeweb\.eu|framatube\.org|thinkerview\.video|tube\.conferences-gesticulees\.net|peertube\.datagueule\.tv|video\.lqdn\.fr|tube\.mochi\.academy|media\.zat\.im|video\.colibris-outilslibres\.org|tube\.svnet\.fr|peertube\.video|peertube2\.cpy\.re|peertube3\.cpy\.re|videos\.tcit\.fr|peertube\.cpy\.re|canard\.tube))/(?:videos/(?:watch|embed)|api/v\d/videos|w)/)(?P<id>[\da-zA-Z]{22}|[\da-fA-F]{8}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{12})`, String.raw`(?x)https?://(?P<host>(?:# Taken from https://instances.joinpeertube.org/instances40two\.tube|a\.metube\.ch|advtv\.ml|algorithmic\.tv|alimulama\.com|arcana\.fun|archive\.vidicon\.org|artefac-paris\.tv|auf1\.eu|battlepenguin\.video|beertube\.epgn\.ch|befree\.nohost\.me|bideoak\.argia\.eus|birkeundnymphe\.de|bitcointv\.com|cattube\.org|clap\.nerv-project\.eu|climatejustice\.video|comf\.tube|conspiracydistillery\.com|darkvapor\.nohost\.me|daschauher\.aksel\.rocks|digitalcourage\.video|dreiecksnebel\.alex-detsch\.de|eduvid\.org|evangelisch\.video|exo\.tube|fair\.tube|fediverse\.tv|film\.k-prod\.fr|flim\.txmn\.tk|fotogramas\.politicaconciencia\.org|ftsi\.ru|gary\.vger\.cloud|graeber\.video|greatview\.video|grypstube\.uni-greifswald\.de|highvoltage\.tv|hpstube\.fr|htp\.live|hyperreal\.tube|juggling\.digital|kino\.kompot\.si|kino\.schuerz\.at|kinowolnosc\.pl|kirche\.peertube-host\.de|kodcast\.com|kolektiva\.media|kraut\.zone|kumi\.tube|lastbreach\.tv|lepetitmayennais\.fr\.nf|lexx\.impa\.me|libertynode\.tv|libra\.syntazia\.org|libremedia\.video|live\.libratoi\.org|live\.nanao\.moe|live\.toobnix\.org|livegram\.net|lolitube\.freedomchan\.moe|lucarne\.balsamine\.be|maindreieck-tv\.de|mani\.tube|manicphase\.me|media\.fsfe\.org|media\.gzevd\.de|media\.inno3\.cricket|media\.kaitaia\.life|media\.krashboyz\.org|media\.over-world\.org|media\.skewed\.de|media\.undeadnetwork\.de|medias\.pingbase\.net|melsungen\.peertube-host\.de|mirametube\.fr|mojotube\.net|monplaisirtube\.ddns\.net|mountaintown\.video|my\.bunny\.cafe|myfreetube\.de|mytube\.kn-cloud\.de|mytube\.madzel\.de|myworkoutarenapeertube\.cf|nanawel-peertube\.dyndns\.org|nastub\.cz|offenes\.tv|orgdup\.media|ovaltube\.codinglab\.ch|p2ptv\.ru|p\.eertu\.be|p\.lu|peer\.azurs\.fr|peertube1\.zeteo\.me|peertube\.020\.pl|peertube\.0x5e\.eu|peertube\.alpharius\.io|peertube\.am-networks\.fr|peertube\.anduin\.net|peertube\.anzui\.dev|peertube\.arbleizez\.bzh|peertube\.art3mis\.de|peertube\.atilla\.org|peertube\.atsuchan\.page|peertube\.aukfood\.net|peertube\.aventer\.biz|peertube\.b38\.rural-it\.org|peertube\.beeldengeluid\.nl|peertube\.be|peertube\.bgzashtita\.es|peertube\.bitsandlinux\.com|peertube\.biz|peertube\.boba\.best|peertube\.br0\.fr|peertube\.bridaahost\.ynh\.fr|peertube\.bubbletea\.dev|peertube\.bubuit\.net|peertube\.cabaal\.net|peertube\.cats-home\.net|peertube\.chemnitz\.freifunk\.net|peertube\.chevro\.fr|peertube\.chrisspiegl\.com|peertube\.chtisurel\.net|peertube\.cipherbliss\.com|peertube\.cloud\.sans\.pub|peertube\.cpge-brizeux\.fr|peertube\.ctseuro\.com|peertube\.cuatrolibertades\.org|peertube\.cybercirujas\.club|peertube\.cythin\.com|peertube\.davigge\.com|peertube\.dc\.pini\.fr|peertube\.debian\.social|peertube\.demonix\.fr|peertube\.designersethiques\.org|peertube\.desmu\.fr|peertube\.devloprog\.org|peertube\.devol\.it|peertube\.dtmf\.ca|peertube\.ecologie\.bzh|peertube\.eu\.org|peertube\.european-pirates\.eu|peertube\.euskarabildua\.eus|peertube\.fenarinarsa\.com|peertube\.fomin\.site|peertube\.forsud\.be|peertube\.francoispelletier\.org|peertube\.freenet\.ru|peertube\.freetalklive\.com|peertube\.functional\.cafe|peertube\.gardeludwig\.fr|peertube\.gargantia\.fr|peertube\.gcfamily\.fr|peertube\.genma\.fr|peertube\.get-racing\.de|peertube\.gidikroon\.eu|peertube\.gruezishop\.ch|peertube\.habets\.house|peertube\.hackerfraternity\.org|peertube\.ichigo\.everydayimshuflin\.com|peertube\.ignifi\.me|peertube\.inapurna\.org|peertube\.informaction\.info|peertube\.interhop\.org|peertube\.iselfhost\.com|peertube\.it|peertube\.jensdiemer\.de|peertube\.joffreyverd\.fr|peertube\.kalua\.im|peertube\.kathryl\.fr|peertube\.keazilla\.net|peertube\.klaewyss\.fr|peertube\.kodcast\.com|peertube\.kx\.studio|peertube\.lagvoid\.com|peertube\.lavallee\.tech|peertube\.le5emeaxe\.fr|peertube\.lestutosdeprocessus\.fr|peertube\.librenet\.co\.za|peertube\.logilab\.fr|peertube\.louisematic\.site|peertube\.luckow\.org|peertube\.luga\.at|peertube\.lyceeconnecte\.fr|peertube\.manalejandro\.com|peertube\.marud\.fr|peertube\.mattone\.net|peertube\.maxweiss\.io|peertube\.monlycee\.net|peertube\.mxinfo\.fr|peertube\.myrasp\.eu|peertube\.nebelcloud\.de|peertube\.netzbegruenung\.de|peertube\.newsocial\.tech|peertube\.nicolastissot\.fr|peertube\.nz|peertube\.offerman\.com|peertube\.opencloud\.lu|peertube\.orthus\.link|peertube\.patapouf\.xyz|peertube\.pi2\.dev|peertube\.plataformess\.org|peertube\.pl|peertube\.portaesgnos\.org|peertube\.r2\.enst\.fr|peertube\.r5c3\.fr|peertube\.radres\.xyz|peertube\.red|peertube\.robonomics\.network|peertube\.rtnkv\.cloud|peertube\.runfox\.tk|peertube\.satoshishop\.de|peertube\.scic-tetris\.org|peertube\.securitymadein\.lu|peertube\.semweb\.pro|peertube\.social\.my-wan\.de|peertube\.soykaf\.org|peertube\.stefofficiel\.me|peertube\.stream|peertube\.su|peertube\.swrs\.net|peertube\.takeko\.cyou|peertube\.tangentfox\.com|peertube\.taxinachtegel\.de|peertube\.thenewoil\.xyz|peertube\.ti-fr\.com|peertube\.tiennot\.net|peertube\.troback\.com|peertube\.tspu\.edu\.ru|peertube\.tux\.ovh|peertube\.tv|peertube\.tweb\.tv|peertube\.ucy\.de|peertube\.underworld\.fr|peertube\.us\.to|peertube\.ventresmous\.fr|peertube\.vlaki\.cz|peertube\.w\.utnw\.de|peertube\.westring\.digital|peertube\.xwiki\.com|peertube\.zoz-serv\.org|peervideo\.ru|periscope\.numenaute\.org|perron-tube\.de|petitlutinartube\.fr|phijkchu\.com|pierre\.tube|piraten\.space|play\.rosano\.ca|player\.ojamajo\.moe|plextube\.nl|pocketnetpeertube1\.nohost\.me|pocketnetpeertube3\.nohost\.me|pocketnetpeertube4\.nohost\.me|pocketnetpeertube5\.nohost\.me|pocketnetpeertube6\.nohost\.me|pt\.24-7\.ro|pt\.apathy\.top|pt\.diaspodon\.fr|pt\.fedi\.tech|pt\.maciej\.website|ptb\.lunarviews\.net|ptmir1\.inter21\.net|ptmir2\.inter21\.net|ptmir3\.inter21\.net|ptmir4\.inter21\.net|ptmir5\.inter21\.net|ptube\.horsentiers\.fr|ptube\.xmanifesto\.club|queermotion\.org|re-wizja\.re-medium\.com|regarder\.sans\.pub|ruraletv\.ovh|s1\.gegenstimme\.tv|s2\.veezee\.tube|sdmtube\.fr|sender-fm\.veezee\.tube|serv1\.wiki-tube\.de|serv3\.wiki-tube\.de|sickstream\.net|sleepy\.tube|sovran\.video|spectra\.video|stream\.elven\.pw|stream\.k-prod\.fr|stream\.shahab\.nohost\.me|streamsource\.video|studios\.racer159\.com|testtube\.florimond\.eu|tgi\.hosted\.spacebear\.ee|thaitube\.in\.th|the\.jokertv\.eu|theater\.ethernia\.net|thecool\.tube|tilvids\.com|toob\.bub\.org|tpaw\.video|truetube\.media|tuba\.lhub\.pl|tube-aix-marseille\.beta\.education\.fr|tube-amiens\.beta\.education\.fr|tube-besancon\.beta\.education\.fr|tube-bordeaux\.beta\.education\.fr|tube-clermont-ferrand\.beta\.education\.fr|tube-corse\.beta\.education\.fr|tube-creteil\.beta\.education\.fr|tube-dijon\.beta\.education\.fr|tube-education\.beta\.education\.fr|tube-grenoble\.beta\.education\.fr|tube-lille\.beta\.education\.fr|tube-limoges\.beta\.education\.fr|tube-montpellier\.beta\.education\.fr|tube-nancy\.beta\.education\.fr|tube-nantes\.beta\.education\.fr|tube-nice\.beta\.education\.fr|tube-normandie\.beta\.education\.fr|tube-orleans-tours\.beta\.education\.fr|tube-outremer\.beta\.education\.fr|tube-paris\.beta\.education\.fr|tube-poitiers\.beta\.education\.fr|tube-reims\.beta\.education\.fr|tube-rennes\.beta\.education\.fr|tube-strasbourg\.beta\.education\.fr|tube-toulouse\.beta\.education\.fr|tube-versailles\.beta\.education\.fr|tube1\.it\.tuwien\.ac\.at|tube\.abolivier\.bzh|tube\.ac-amiens\.fr|tube\.aerztefueraufklaerung\.de|tube\.alexx\.ml|tube\.amic37\.fr|tube\.anufrij\.de|tube\.apolut\.net|tube\.arkhalabs\.io|tube\.arthack\.nz|tube\.as211696\.net|tube\.avensio\.de|tube\.azbyka\.ru|tube\.azkware\.net|tube\.bachaner\.fr|tube\.bmesh\.org|tube\.borked\.host|tube\.bstly\.de|tube\.chaoszone\.tv|tube\.chatelet\.ovh|tube\.cloud-libre\.eu|tube\.cms\.garden|tube\.cowfee\.moe|tube\.cryptography\.dog|tube\.darknight-coffee\.org|tube\.dev\.lhub\.pl|tube\.distrilab\.fr|tube\.dsocialize\.net|tube\.ebin\.club|tube\.fdn\.fr|tube\.florimond\.eu|tube\.foxarmy\.ml|tube\.foxden\.party|tube\.frischesicht\.de|tube\.futuretic\.fr|tube\.gnous\.eu|tube\.grap\.coop|tube\.graz\.social|tube\.grin\.hu|tube\.hackerscop\.org|tube\.hordearii\.fr|tube\.jeena\.net|tube\.kai-stuht\.com|tube\.kockatoo\.org|tube\.kotur\.org|tube\.lacaveatonton\.ovh|tube\.linkse\.media|tube\.lokad\.com|tube\.lucie-philou\.com|tube\.melonbread\.xyz|tube\.mfraters\.net|tube\.motuhake\.xyz|tube\.mrbesen\.de|tube\.nah\.re|tube\.nchoco\.net|tube\.novg\.net|tube\.nox-rhea\.org|tube\.nuagelibre\.fr|tube\.nx12\.net|tube\.octaplex\.net|tube\.odat\.xyz|tube\.oisux\.org|tube\.opportunis\.me|tube\.org\.il|tube\.ortion\.xyz|tube\.others\.social|tube\.picasoft\.net|tube\.plomlompom\.com|tube\.pmj\.rocks|tube\.portes-imaginaire\.org|tube\.pyngu\.com|tube\.rebellion\.global|tube\.rhythms-of-resistance\.org|tube\.rita\.moe|tube\.rsi\.cnr\.it|tube\.s1gm4\.eu|tube\.saumon\.io|tube\.schleuss\.online|tube\.schule\.social|tube\.seditio\.fr|tube\.shanti\.cafe|tube\.shela\.nu|tube\.skrep\.in|tube\.sp-codes\.de|tube\.sp4ke\.com|tube\.superseriousbusiness\.org|tube\.systest\.eu|tube\.tappret\.fr|tube\.tardis\.world|tube\.toontoet\.nl|tube\.tpshd\.de|tube\.troopers\.agency|tube\.tylerdavis\.xyz|tube\.undernet\.uy|tube\.vigilian-consulting\.nl|tube\.vraphim\.com|tube\.wehost\.lgbt|tube\.wien\.rocks|tube\.wolfe\.casa|tube\.xd0\.de|tube\.xy-space\.de|tube\.yapbreak\.fr|tubedu\.org|tubes\.jodh\.us|tuktube\.com|turkum\.me|tututu\.tube|tuvideo\.encanarias\.info|tv1\.cocu\.cc|tv1\.gomntu\.space|tv2\.cocu\.cc|tv\.adn\.life|tv\.atmx\.ca|tv\.bitma\.st|tv\.generallyrubbish\.net\.au|tv\.lumbung\.space|tv\.mattchristiansenmedia\.com|tv\.netwhood\.online|tv\.neue\.city|tv\.piejacker\.net|tv\.pirateradio\.social|tv\.undersco\.re|tvox\.ru|twctube\.twc-zone\.eu|unfilter\.tube|v\.basspistol\.org|v\.kisombrella\.top|v\.lastorder\.xyz|v\.lor\.sh|v\.phreedom\.club|v\.sil\.sh|v\.szy\.io|v\.xxxapex\.com|veezee\.tube|vid\.dascoyote\.xyz|vid\.garwood\.io|vid\.ncrypt\.at|vid\.pravdastalina\.info|vid\.qorg11\.net|vid\.rajeshtaylor\.com|vid\.samtripoli\.com|vid\.werefox\.dev|vid\.wildeboer\.net|video-cave-v2\.de|video\.076\.ne\.jp|video\.1146\.nohost\.me|video\.altertek\.org|video\.anartist\.org|video\.apps\.thedoodleproject\.net|video\.artist\.cx|video\.asgardius\.company|video\.balsillie\.net|video\.bards\.online|video\.binarydad\.com|video\.blast-info\.fr|video\.catgirl\.biz|video\.cigliola\.com|video\.cm-en-transition\.fr|video\.cnt\.social|video\.coales\.co|video\.codingfield\.com|video\.comptoir\.net|video\.comune\.trento\.it|video\.cpn\.so|video\.csc49\.fr|video\.cybre\.town|video\.demokratischer-sommer\.de|video\.discord-insoumis\.fr|video\.dolphincastle\.com|video\.dresden\.network|video\.ecole-89\.com|video\.elgrillolibertario\.org|video\.emergeheart\.info|video\.eradicatinglove\.xyz|video\.ethantheenigma\.me|video\.exodus-privacy\.eu\.org|video\.fbxl\.net|video\.fhtagn\.org|video\.greenmycity\.eu|video\.guerredeclasse\.fr|video\.gyt\.is|video\.hackers\.town|video\.hardlimit\.com|video\.hooli\.co|video\.igem\.org|video\.internet-czas-dzialac\.pl|video\.islameye\.com|video\.kicik\.fr|video\.kuba-orlik\.name|video\.kyushojitsu\.ca|video\.lavolte\.net|video\.lespoesiesdheloise\.fr|video\.liberta\.vip|video\.liege\.bike|video\.linc\.systems|video\.linux\.it|video\.linuxtrent\.it|video\.lokal\.social|video\.lono\.space|video\.lunasqu\.ee|video\.lundi\.am|video\.marcorennmaus\.de|video\.mass-trespass\.uk|video\.mugoreve\.fr|video\.mundodesconocido\.com|video\.mycrowd\.ca|video\.nogafam\.es|video\.odayacres\.farm|video\.ozgurkon\.org|video\.p1ng0ut\.social|video\.p3x\.de|video\.pcf\.fr|video\.pony\.gallery|video\.potate\.space|video\.pourpenser\.pro|video\.progressiv\.dev|video\.resolutions\.it|video\.rw501\.de|video\.screamer\.wiki|video\.sdm-tools\.net|video\.sftblw\.moe|video\.shitposter\.club|video\.skyn3t\.in|video\.soi\.ch|video\.stuartbrand\.co\.uk|video\.thinkof\.name|video\.toot\.pt|video\.triplea\.fr|video\.turbo\.chat|video\.vaku\.org\.ua|video\.veloma\.org|video\.violoncello\.ch|video\.wilkie\.how|video\.wsf2021\.info|videorelay\.co|videos-passages\.huma-num\.fr|videos\.3d-wolf\.com|videos\.ahp-numerique\.fr|videos\.alexandrebadalo\.pt|videos\.archigny\.net|videos\.benjaminbrady\.ie|videos\.buceoluegoexisto\.com|videos\.capas\.se|videos\.casually\.cat|videos\.cloudron\.io|videos\.coletivos\.org|videos\.danksquad\.org|videos\.denshi\.live|videos\.fromouter\.space|videos\.fsci\.in|videos\.globenet\.org|videos\.hauspie\.fr|videos\.hush\.is|videos\.john-livingston\.fr|videos\.jordanwarne\.xyz|videos\.lavoixdessansvoix\.org|videos\.leslionsfloorball\.fr|videos\.lucero\.top|videos\.martyn\.berlin|videos\.mastodont\.cat|videos\.monstro1\.com|videos\.npo\.city|videos\.optoutpod\.com|videos\.petch\.rocks|videos\.pzelawski\.xyz|videos\.rampin\.org|videos\.scanlines\.xyz|videos\.shmalls\.pw|videos\.sibear\.fr|videos\.stadtfabrikanten\.org|videos\.tankernn\.eu|videos\.testimonia\.org|videos\.thisishowidontdisappear\.com|videos\.traumaheilung\.net|videos\.trom\.tf|videos\.wakkerewereld\.nu|videos\.weblib\.re|videos\.yesil\.club|vids\.roshless\.me|vids\.tekdmn\.me|vidz\.dou\.bet|vod\.lumikko\.dev|vs\.uniter\.network|vulgarisation-informatique\.fr|watch\.breadtube\.tv|watch\.deranalyst\.ch|watch\.ignorance\.eu|watch\.krazy\.party|watch\.libertaria\.space|watch\.rt4mn\.org|watch\.softinio\.com|watch\.tubelab\.video|web-fellow\.de|webtv\.vandoeuvre\.net|wechill\.space|wikileaks\.video|wiwi\.video|worldofvids\.com|wwtube\.net|www4\.mir\.inter21\.net|www\.birkeundnymphe\.de|www\.captain-german\.com|www\.wiki-tube\.de|xxivproduction\.video|xxx\.noho\.st|# from youtube-dlpeertube\.rainbowswingers\.net|tube\.stanisic\.nl|peer\.suiri\.us|medias\.libox\.fr|videomensoif\.ynh\.fr|peertube\.travelpandas\.eu|peertube\.rachetjay\.fr|peertube\.montecsys\.fr|tube\.eskuero\.me|peer\.tube|peertube\.umeahackerspace\.se|tube\.nx-pod\.de|video\.monsieurbidouille\.fr|tube\.openalgeria\.org|vid\.lelux\.fi|video\.anormallostpod\.ovh|tube\.crapaud-fou\.org|peertube\.stemy\.me|lostpod\.space|exode\.me|peertube\.snargol\.com|vis\.ion\.ovh|videosdulib\.re|v\.mbius\.io|videos\.judrey\.eu|peertube\.osureplayviewer\.xyz|peertube\.mathieufamily\.ovh|www\.videos-libr\.es|fightforinfo\.com|peertube\.fediverse\.ru|peertube\.oiseauroch\.fr|video\.nesven\.eu|v\.bearvideo\.win|video\.qoto\.org|justporn\.cc|video\.vny\.fr|peervideo\.club|tube\.taker\.fr|peertube\.chantierlibre\.org|tube\.ipfixe\.info|tube\.kicou\.info|tube\.dodsorf\.as|videobit\.cc|video\.yukari\.moe|videos\.elbinario\.net|hkvideo\.live|pt\.tux\.tf|www\.hkvideo\.live|FIGHTFORINFO\.com|pt\.765racing\.com|peertube\.gnumeria\.eu\.org|nordenmedia\.com|peertube\.co\.uk|tube\.darfweb\.eu|tube\.kalah-france\.org|0ch\.in|vod\.mochi\.academy|film\.node9\.org|peertube\.hatthieves\.es|video\.fitchfamily\.org|peertube\.ddns\.net|video\.ifuncle\.kr|video\.fdlibre\.eu|tube\.22decembre\.eu|peertube\.harmoniescreatives\.com|tube\.fabrigli\.fr|video\.thedwyers\.co|video\.bruitbruit\.com|peertube\.foxfam\.club|peer\.philoxweb\.be|videos\.bugs\.social|peertube\.malbert\.xyz|peertube\.bilange\.ca|libretube\.net|diytelevision\.com|peertube\.fedilab\.app|libre\.video|video\.mstddntfdn\.online|us\.tv|peertube\.sl-network\.fr|peertube\.dynlinux\.io|peertube\.david\.durieux\.family|peertube\.linuxrocks\.online|peerwatch\.xyz|v\.kretschmann\.social|tube\.otter\.sh|yt\.is\.nota\.live|tube\.dragonpsi\.xyz|peertube\.boneheadmedia\.com|videos\.funkwhale\.audio|watch\.44con\.com|peertube\.gcaillaut\.fr|peertube\.icu|pony\.tube|spacepub\.space|tube\.stbr\.io|v\.mom-gay\.faith|tube\.port0\.xyz|peertube\.simounet\.net|play\.jergefelt\.se|peertube\.zeteo\.me|tube\.danq\.me|peertube\.kerenon\.com|tube\.fab-l3\.org|tube\.calculate\.social|peertube\.mckillop\.org|tube\.netzspielplatz\.de|vod\.ksite\.de|peertube\.laas\.fr|tube\.govital\.net|peertube\.stephenson\.cc|bistule\.nohost\.me|peertube\.kajalinifi\.de|video\.ploud\.jp|video\.omniatv\.com|peertube\.ffs2play\.fr|peertube\.leboulaire\.ovh|peertube\.tronic-studio\.com|peertube\.public\.cat|peertube\.metalbanana\.net|video\.1000i100\.fr|peertube\.alter-nativ-voll\.de|tube\.pasa\.tf|tube\.worldofhauru\.xyz|pt\.kamp\.site|peertube\.teleassist\.fr|videos\.mleduc\.xyz|conf\.tube|media\.privacyinternational\.org|pt\.forty-two\.nl|video\.halle-leaks\.de|video\.grosskopfgames\.de|peertube\.schaeferit\.de|peertube\.jackbot\.fr|tube\.extinctionrebellion\.fr|peertube\.f-si\.org|video\.subak\.ovh|videos\.koweb\.fr|peertube\.zergy\.net|peertube\.roflcopter\.fr|peertube\.floss-marketing-school\.com|vloggers\.social|peertube\.iriseden\.eu|videos\.ubuntu-paris\.org|peertube\.mastodon\.host|armstube\.com|peertube\.s2s\.video|peertube\.lol|tube\.open-plug\.eu|open\.tube|peertube\.ch|peertube\.normandie-libre\.fr|peertube\.slat\.org|video\.lacaveatonton\.ovh|peertube\.uno|peertube\.servebeer\.com|peertube\.fedi\.quebec|tube\.h3z\.jp|tube\.plus200\.com|peertube\.eric\.ovh|tube\.metadocs\.cc|tube\.unmondemeilleur\.eu|gouttedeau\.space|video\.antirep\.net|nrop\.cant\.at|tube\.ksl-bmx\.de|tube\.plaf\.fr|tube\.tchncs\.de|video\.devinberg\.com|hitchtube\.fr|peertube\.kosebamse\.com|yunopeertube\.myddns\.me|peertube\.varney\.fr|peertube\.anon-kenkai\.com|tube\.maiti\.info|tubee\.fr|videos\.dinofly\.com|toobnix\.org|videotape\.me|voca\.tube|video\.heromuster\.com|video\.lemediatv\.fr|video\.up\.edu\.ph|balafon\.video|video\.ivel\.fr|thickrips\.cloud|pt\.laurentkruger\.fr|video\.monarch-pass\.net|peertube\.artica\.center|video\.alternanet\.fr|indymotion\.fr|fanvid\.stopthatimp\.net|video\.farci\.org|v\.lesterpig\.com|video\.okaris\.de|tube\.pawelko\.net|peertube\.mablr\.org|tube\.fede\.re|pytu\.be|evertron\.tv|devtube\.dev-wiki\.de|raptube\.antipub\.org|video\.selea\.se|peertube\.mygaia\.org|video\.oh14\.de|peertube\.livingutopia\.org|peertube\.the-penguin\.de|tube\.thechangebook\.org|tube\.anjara\.eu|pt\.pube\.tk|video\.samedi\.pm|mplayer\.demouliere\.eu|widemus\.de|peertube\.me|peertube\.zapashcanon\.fr|video\.latavernedejohnjohn\.fr|peertube\.pcservice46\.fr|peertube\.mazzonetto\.eu|video\.irem\.univ-paris-diderot\.fr|video\.livecchi\.cloud|alttube\.fr|video\.coop\.tools|video\.cabane-libre\.org|peertube\.openstreetmap\.fr|videos\.alolise\.org|irrsinn\.video|video\.antopie\.org|scitech\.video|tube2\.nemsia\.org|video\.amic37\.fr|peertube\.freeforge\.eu|video\.arbitrarion\.com|video\.datsemultimedia\.com|stoptrackingus\.tv|peertube\.ricostrongxxx\.com|docker\.videos\.lecygnenoir\.info|peertube\.togart\.de|tube\.postblue\.info|videos\.domainepublic\.net|peertube\.cyber-tribal\.com|video\.gresille\.org|peertube\.dsmouse\.net|cinema\.yunohost\.support|tube\.theocevaer\.fr|repro\.video|tube\.4aem\.com|quaziinc\.com|peertube\.metawurst\.space|videos\.wakapo\.com|video\.ploud\.fr|video\.freeradical\.zone|tube\.valinor\.fr|refuznik\.video|pt\.kircheneuenburg\.de|peertube\.asrun\.eu|peertube\.lagob\.fr|videos\.side-ways\.net|91video\.online|video\.valme\.io|video\.taboulisme\.com|videos-libr\.es|tv\.mooh\.fr|nuage\.acostey\.fr|video\.monsieur-a\.fr|peertube\.librelois\.fr|videos\.pair2jeux\.tube|videos\.pueseso\.club|peer\.mathdacloud\.ovh|media\.assassinate-you\.net|vidcommons\.org|ptube\.rousset\.nom\.fr|tube\.cyano\.at|videos\.squat\.net|video\.iphodase\.fr|peertube\.makotoworkshop\.org|peertube\.serveur\.slv-valbonne\.fr|vault\.mle\.party|hostyour\.tv|videos\.hack2g2\.fr|libre\.tube|pire\.artisanlogiciel\.net|videos\.numerique-en-commun\.fr|video\.netsyms\.com|video\.die-partei\.social|video\.writeas\.org|peertube\.swarm\.solvingmaz\.es|tube\.pericoloso\.ovh|watching\.cypherpunk\.observer|videos\.adhocmusic\.com|tube\.rfc1149\.net|peertube\.librelabucm\.org|videos\.numericoop\.fr|peertube\.koehn\.com|peertube\.anarchmusicall\.net|tube\.kampftoast\.de|vid\.y-y\.li|peertube\.xtenz\.xyz|diode\.zone|tube\.egf\.mn|peertube\.nomagic\.uk|visionon\.tv|videos\.koumoul\.com|video\.rastapuls\.com|video\.mantlepro\.com|video\.deadsuperhero\.com|peertube\.musicstudio\.pro|peertube\.we-keys\.fr|artitube\.artifaille\.fr|peertube\.ethernia\.net|tube\.midov\.pl|peertube\.fr|watch\.snoot\.tube|peertube\.donnadieu\.fr|argos\.aquilenet\.fr|tube\.nemsia\.org|tube\.bruniau\.net|videos\.darckoune\.moe|tube\.traydent\.info|dev\.videos\.lecygnenoir\.info|peertube\.nayya\.org|peertube\.live|peertube\.mofgao\.space|video\.lequerrec\.eu|peertube\.amicale\.net|aperi\.tube|tube\.ac-lyon\.fr|video\.lw1\.at|www\.yiny\.org|videos\.pofilo\.fr|tube\.lou\.lt|choob\.h\.etbus\.ch|tube\.hoga\.fr|peertube\.heberge\.fr|video\.obermui\.de|videos\.cloudfrancois\.fr|betamax\.video|video\.typica\.us|tube\.piweb\.be|video\.blender\.org|peertube\.cat|tube\.kdy\.ch|pe\.ertu\.be|peertube\.social|videos\.lescommuns\.org|tv\.datamol\.org|videonaute\.fr|dialup\.express|peertube\.nogafa\.org|megatube\.lilomoino\.fr|peertube\.tamanoir\.foucry\.net|peertube\.devosi\.org|peertube\.1312\.media|tube\.bootlicker\.party|skeptikon\.fr|video\.blueline\.mg|tube\.homecomputing\.fr|tube\.ouahpiti\.info|video\.tedomum\.net|video\.g3l\.org|fontube\.fr|peertube\.gaialabs\.ch|tube\.kher\.nl|peertube\.qtg\.fr|video\.migennes\.net|tube\.p2p\.legal|troll\.tv|videos\.iut-orsay\.fr|peertube\.solidev\.net|videos\.cemea\.org|video\.passageenseine\.fr|videos\.festivalparminous\.org|peertube\.touhoppai\.moe|sikke\.fi|peer\.hostux\.social|share\.tube|peertube\.walkingmountains\.fr|videos\.benpro\.fr|peertube\.parleur\.net|peertube\.heraut\.eu|tube\.aquilenet\.fr|peertube\.gegeweb\.eu|framatube\.org|thinkerview\.video|tube\.conferences-gesticulees\.net|peertube\.datagueule\.tv|video\.lqdn\.fr|tube\.mochi\.academy|media\.zat\.im|video\.colibris-outilslibres\.org|tube\.svnet\.fr|peertube\.video|peertube2\.cpy\.re|peertube3\.cpy\.re|videos\.tcit\.fr|peertube\.cpy\.re|canard\.tube))/(?P<type>(?:a|c|w/p))/(?P<id>[^/]+)`]);
URL_REGEXS.set('peertube2.cpy.re', [String.raw`(?x)(?:peertube:(?P<host>[^:]+):|https?://(?P<host_2>(?:# Taken from https://instances.joinpeertube.org/instances40two\.tube|a\.metube\.ch|advtv\.ml|algorithmic\.tv|alimulama\.com|arcana\.fun|archive\.vidicon\.org|artefac-paris\.tv|auf1\.eu|battlepenguin\.video|beertube\.epgn\.ch|befree\.nohost\.me|bideoak\.argia\.eus|birkeundnymphe\.de|bitcointv\.com|cattube\.org|clap\.nerv-project\.eu|climatejustice\.video|comf\.tube|conspiracydistillery\.com|darkvapor\.nohost\.me|daschauher\.aksel\.rocks|digitalcourage\.video|dreiecksnebel\.alex-detsch\.de|eduvid\.org|evangelisch\.video|exo\.tube|fair\.tube|fediverse\.tv|film\.k-prod\.fr|flim\.txmn\.tk|fotogramas\.politicaconciencia\.org|ftsi\.ru|gary\.vger\.cloud|graeber\.video|greatview\.video|grypstube\.uni-greifswald\.de|highvoltage\.tv|hpstube\.fr|htp\.live|hyperreal\.tube|juggling\.digital|kino\.kompot\.si|kino\.schuerz\.at|kinowolnosc\.pl|kirche\.peertube-host\.de|kodcast\.com|kolektiva\.media|kraut\.zone|kumi\.tube|lastbreach\.tv|lepetitmayennais\.fr\.nf|lexx\.impa\.me|libertynode\.tv|libra\.syntazia\.org|libremedia\.video|live\.libratoi\.org|live\.nanao\.moe|live\.toobnix\.org|livegram\.net|lolitube\.freedomchan\.moe|lucarne\.balsamine\.be|maindreieck-tv\.de|mani\.tube|manicphase\.me|media\.fsfe\.org|media\.gzevd\.de|media\.inno3\.cricket|media\.kaitaia\.life|media\.krashboyz\.org|media\.over-world\.org|media\.skewed\.de|media\.undeadnetwork\.de|medias\.pingbase\.net|melsungen\.peertube-host\.de|mirametube\.fr|mojotube\.net|monplaisirtube\.ddns\.net|mountaintown\.video|my\.bunny\.cafe|myfreetube\.de|mytube\.kn-cloud\.de|mytube\.madzel\.de|myworkoutarenapeertube\.cf|nanawel-peertube\.dyndns\.org|nastub\.cz|offenes\.tv|orgdup\.media|ovaltube\.codinglab\.ch|p2ptv\.ru|p\.eertu\.be|p\.lu|peer\.azurs\.fr|peertube1\.zeteo\.me|peertube\.020\.pl|peertube\.0x5e\.eu|peertube\.alpharius\.io|peertube\.am-networks\.fr|peertube\.anduin\.net|peertube\.anzui\.dev|peertube\.arbleizez\.bzh|peertube\.art3mis\.de|peertube\.atilla\.org|peertube\.atsuchan\.page|peertube\.aukfood\.net|peertube\.aventer\.biz|peertube\.b38\.rural-it\.org|peertube\.beeldengeluid\.nl|peertube\.be|peertube\.bgzashtita\.es|peertube\.bitsandlinux\.com|peertube\.biz|peertube\.boba\.best|peertube\.br0\.fr|peertube\.bridaahost\.ynh\.fr|peertube\.bubbletea\.dev|peertube\.bubuit\.net|peertube\.cabaal\.net|peertube\.cats-home\.net|peertube\.chemnitz\.freifunk\.net|peertube\.chevro\.fr|peertube\.chrisspiegl\.com|peertube\.chtisurel\.net|peertube\.cipherbliss\.com|peertube\.cloud\.sans\.pub|peertube\.cpge-brizeux\.fr|peertube\.ctseuro\.com|peertube\.cuatrolibertades\.org|peertube\.cybercirujas\.club|peertube\.cythin\.com|peertube\.davigge\.com|peertube\.dc\.pini\.fr|peertube\.debian\.social|peertube\.demonix\.fr|peertube\.designersethiques\.org|peertube\.desmu\.fr|peertube\.devloprog\.org|peertube\.devol\.it|peertube\.dtmf\.ca|peertube\.ecologie\.bzh|peertube\.eu\.org|peertube\.european-pirates\.eu|peertube\.euskarabildua\.eus|peertube\.fenarinarsa\.com|peertube\.fomin\.site|peertube\.forsud\.be|peertube\.francoispelletier\.org|peertube\.freenet\.ru|peertube\.freetalklive\.com|peertube\.functional\.cafe|peertube\.gardeludwig\.fr|peertube\.gargantia\.fr|peertube\.gcfamily\.fr|peertube\.genma\.fr|peertube\.get-racing\.de|peertube\.gidikroon\.eu|peertube\.gruezishop\.ch|peertube\.habets\.house|peertube\.hackerfraternity\.org|peertube\.ichigo\.everydayimshuflin\.com|peertube\.ignifi\.me|peertube\.inapurna\.org|peertube\.informaction\.info|peertube\.interhop\.org|peertube\.iselfhost\.com|peertube\.it|peertube\.jensdiemer\.de|peertube\.joffreyverd\.fr|peertube\.kalua\.im|peertube\.kathryl\.fr|peertube\.keazilla\.net|peertube\.klaewyss\.fr|peertube\.kodcast\.com|peertube\.kx\.studio|peertube\.lagvoid\.com|peertube\.lavallee\.tech|peertube\.le5emeaxe\.fr|peertube\.lestutosdeprocessus\.fr|peertube\.librenet\.co\.za|peertube\.logilab\.fr|peertube\.louisematic\.site|peertube\.luckow\.org|peertube\.luga\.at|peertube\.lyceeconnecte\.fr|peertube\.manalejandro\.com|peertube\.marud\.fr|peertube\.mattone\.net|peertube\.maxweiss\.io|peertube\.monlycee\.net|peertube\.mxinfo\.fr|peertube\.myrasp\.eu|peertube\.nebelcloud\.de|peertube\.netzbegruenung\.de|peertube\.newsocial\.tech|peertube\.nicolastissot\.fr|peertube\.nz|peertube\.offerman\.com|peertube\.opencloud\.lu|peertube\.orthus\.link|peertube\.patapouf\.xyz|peertube\.pi2\.dev|peertube\.plataformess\.org|peertube\.pl|peertube\.portaesgnos\.org|peertube\.r2\.enst\.fr|peertube\.r5c3\.fr|peertube\.radres\.xyz|peertube\.red|peertube\.robonomics\.network|peertube\.rtnkv\.cloud|peertube\.runfox\.tk|peertube\.satoshishop\.de|peertube\.scic-tetris\.org|peertube\.securitymadein\.lu|peertube\.semweb\.pro|peertube\.social\.my-wan\.de|peertube\.soykaf\.org|peertube\.stefofficiel\.me|peertube\.stream|peertube\.su|peertube\.swrs\.net|peertube\.takeko\.cyou|peertube\.tangentfox\.com|peertube\.taxinachtegel\.de|peertube\.thenewoil\.xyz|peertube\.ti-fr\.com|peertube\.tiennot\.net|peertube\.troback\.com|peertube\.tspu\.edu\.ru|peertube\.tux\.ovh|peertube\.tv|peertube\.tweb\.tv|peertube\.ucy\.de|peertube\.underworld\.fr|peertube\.us\.to|peertube\.ventresmous\.fr|peertube\.vlaki\.cz|peertube\.w\.utnw\.de|peertube\.westring\.digital|peertube\.xwiki\.com|peertube\.zoz-serv\.org|peervideo\.ru|periscope\.numenaute\.org|perron-tube\.de|petitlutinartube\.fr|phijkchu\.com|pierre\.tube|piraten\.space|play\.rosano\.ca|player\.ojamajo\.moe|plextube\.nl|pocketnetpeertube1\.nohost\.me|pocketnetpeertube3\.nohost\.me|pocketnetpeertube4\.nohost\.me|pocketnetpeertube5\.nohost\.me|pocketnetpeertube6\.nohost\.me|pt\.24-7\.ro|pt\.apathy\.top|pt\.diaspodon\.fr|pt\.fedi\.tech|pt\.maciej\.website|ptb\.lunarviews\.net|ptmir1\.inter21\.net|ptmir2\.inter21\.net|ptmir3\.inter21\.net|ptmir4\.inter21\.net|ptmir5\.inter21\.net|ptube\.horsentiers\.fr|ptube\.xmanifesto\.club|queermotion\.org|re-wizja\.re-medium\.com|regarder\.sans\.pub|ruraletv\.ovh|s1\.gegenstimme\.tv|s2\.veezee\.tube|sdmtube\.fr|sender-fm\.veezee\.tube|serv1\.wiki-tube\.de|serv3\.wiki-tube\.de|sickstream\.net|sleepy\.tube|sovran\.video|spectra\.video|stream\.elven\.pw|stream\.k-prod\.fr|stream\.shahab\.nohost\.me|streamsource\.video|studios\.racer159\.com|testtube\.florimond\.eu|tgi\.hosted\.spacebear\.ee|thaitube\.in\.th|the\.jokertv\.eu|theater\.ethernia\.net|thecool\.tube|tilvids\.com|toob\.bub\.org|tpaw\.video|truetube\.media|tuba\.lhub\.pl|tube-aix-marseille\.beta\.education\.fr|tube-amiens\.beta\.education\.fr|tube-besancon\.beta\.education\.fr|tube-bordeaux\.beta\.education\.fr|tube-clermont-ferrand\.beta\.education\.fr|tube-corse\.beta\.education\.fr|tube-creteil\.beta\.education\.fr|tube-dijon\.beta\.education\.fr|tube-education\.beta\.education\.fr|tube-grenoble\.beta\.education\.fr|tube-lille\.beta\.education\.fr|tube-limoges\.beta\.education\.fr|tube-montpellier\.beta\.education\.fr|tube-nancy\.beta\.education\.fr|tube-nantes\.beta\.education\.fr|tube-nice\.beta\.education\.fr|tube-normandie\.beta\.education\.fr|tube-orleans-tours\.beta\.education\.fr|tube-outremer\.beta\.education\.fr|tube-paris\.beta\.education\.fr|tube-poitiers\.beta\.education\.fr|tube-reims\.beta\.education\.fr|tube-rennes\.beta\.education\.fr|tube-strasbourg\.beta\.education\.fr|tube-toulouse\.beta\.education\.fr|tube-versailles\.beta\.education\.fr|tube1\.it\.tuwien\.ac\.at|tube\.abolivier\.bzh|tube\.ac-amiens\.fr|tube\.aerztefueraufklaerung\.de|tube\.alexx\.ml|tube\.amic37\.fr|tube\.anufrij\.de|tube\.apolut\.net|tube\.arkhalabs\.io|tube\.arthack\.nz|tube\.as211696\.net|tube\.avensio\.de|tube\.azbyka\.ru|tube\.azkware\.net|tube\.bachaner\.fr|tube\.bmesh\.org|tube\.borked\.host|tube\.bstly\.de|tube\.chaoszone\.tv|tube\.chatelet\.ovh|tube\.cloud-libre\.eu|tube\.cms\.garden|tube\.cowfee\.moe|tube\.cryptography\.dog|tube\.darknight-coffee\.org|tube\.dev\.lhub\.pl|tube\.distrilab\.fr|tube\.dsocialize\.net|tube\.ebin\.club|tube\.fdn\.fr|tube\.florimond\.eu|tube\.foxarmy\.ml|tube\.foxden\.party|tube\.frischesicht\.de|tube\.futuretic\.fr|tube\.gnous\.eu|tube\.grap\.coop|tube\.graz\.social|tube\.grin\.hu|tube\.hackerscop\.org|tube\.hordearii\.fr|tube\.jeena\.net|tube\.kai-stuht\.com|tube\.kockatoo\.org|tube\.kotur\.org|tube\.lacaveatonton\.ovh|tube\.linkse\.media|tube\.lokad\.com|tube\.lucie-philou\.com|tube\.melonbread\.xyz|tube\.mfraters\.net|tube\.motuhake\.xyz|tube\.mrbesen\.de|tube\.nah\.re|tube\.nchoco\.net|tube\.novg\.net|tube\.nox-rhea\.org|tube\.nuagelibre\.fr|tube\.nx12\.net|tube\.octaplex\.net|tube\.odat\.xyz|tube\.oisux\.org|tube\.opportunis\.me|tube\.org\.il|tube\.ortion\.xyz|tube\.others\.social|tube\.picasoft\.net|tube\.plomlompom\.com|tube\.pmj\.rocks|tube\.portes-imaginaire\.org|tube\.pyngu\.com|tube\.rebellion\.global|tube\.rhythms-of-resistance\.org|tube\.rita\.moe|tube\.rsi\.cnr\.it|tube\.s1gm4\.eu|tube\.saumon\.io|tube\.schleuss\.online|tube\.schule\.social|tube\.seditio\.fr|tube\.shanti\.cafe|tube\.shela\.nu|tube\.skrep\.in|tube\.sp-codes\.de|tube\.sp4ke\.com|tube\.superseriousbusiness\.org|tube\.systest\.eu|tube\.tappret\.fr|tube\.tardis\.world|tube\.toontoet\.nl|tube\.tpshd\.de|tube\.troopers\.agency|tube\.tylerdavis\.xyz|tube\.undernet\.uy|tube\.vigilian-consulting\.nl|tube\.vraphim\.com|tube\.wehost\.lgbt|tube\.wien\.rocks|tube\.wolfe\.casa|tube\.xd0\.de|tube\.xy-space\.de|tube\.yapbreak\.fr|tubedu\.org|tubes\.jodh\.us|tuktube\.com|turkum\.me|tututu\.tube|tuvideo\.encanarias\.info|tv1\.cocu\.cc|tv1\.gomntu\.space|tv2\.cocu\.cc|tv\.adn\.life|tv\.atmx\.ca|tv\.bitma\.st|tv\.generallyrubbish\.net\.au|tv\.lumbung\.space|tv\.mattchristiansenmedia\.com|tv\.netwhood\.online|tv\.neue\.city|tv\.piejacker\.net|tv\.pirateradio\.social|tv\.undersco\.re|tvox\.ru|twctube\.twc-zone\.eu|unfilter\.tube|v\.basspistol\.org|v\.kisombrella\.top|v\.lastorder\.xyz|v\.lor\.sh|v\.phreedom\.club|v\.sil\.sh|v\.szy\.io|v\.xxxapex\.com|veezee\.tube|vid\.dascoyote\.xyz|vid\.garwood\.io|vid\.ncrypt\.at|vid\.pravdastalina\.info|vid\.qorg11\.net|vid\.rajeshtaylor\.com|vid\.samtripoli\.com|vid\.werefox\.dev|vid\.wildeboer\.net|video-cave-v2\.de|video\.076\.ne\.jp|video\.1146\.nohost\.me|video\.altertek\.org|video\.anartist\.org|video\.apps\.thedoodleproject\.net|video\.artist\.cx|video\.asgardius\.company|video\.balsillie\.net|video\.bards\.online|video\.binarydad\.com|video\.blast-info\.fr|video\.catgirl\.biz|video\.cigliola\.com|video\.cm-en-transition\.fr|video\.cnt\.social|video\.coales\.co|video\.codingfield\.com|video\.comptoir\.net|video\.comune\.trento\.it|video\.cpn\.so|video\.csc49\.fr|video\.cybre\.town|video\.demokratischer-sommer\.de|video\.discord-insoumis\.fr|video\.dolphincastle\.com|video\.dresden\.network|video\.ecole-89\.com|video\.elgrillolibertario\.org|video\.emergeheart\.info|video\.eradicatinglove\.xyz|video\.ethantheenigma\.me|video\.exodus-privacy\.eu\.org|video\.fbxl\.net|video\.fhtagn\.org|video\.greenmycity\.eu|video\.guerredeclasse\.fr|video\.gyt\.is|video\.hackers\.town|video\.hardlimit\.com|video\.hooli\.co|video\.igem\.org|video\.internet-czas-dzialac\.pl|video\.islameye\.com|video\.kicik\.fr|video\.kuba-orlik\.name|video\.kyushojitsu\.ca|video\.lavolte\.net|video\.lespoesiesdheloise\.fr|video\.liberta\.vip|video\.liege\.bike|video\.linc\.systems|video\.linux\.it|video\.linuxtrent\.it|video\.lokal\.social|video\.lono\.space|video\.lunasqu\.ee|video\.lundi\.am|video\.marcorennmaus\.de|video\.mass-trespass\.uk|video\.mugoreve\.fr|video\.mundodesconocido\.com|video\.mycrowd\.ca|video\.nogafam\.es|video\.odayacres\.farm|video\.ozgurkon\.org|video\.p1ng0ut\.social|video\.p3x\.de|video\.pcf\.fr|video\.pony\.gallery|video\.potate\.space|video\.pourpenser\.pro|video\.progressiv\.dev|video\.resolutions\.it|video\.rw501\.de|video\.screamer\.wiki|video\.sdm-tools\.net|video\.sftblw\.moe|video\.shitposter\.club|video\.skyn3t\.in|video\.soi\.ch|video\.stuartbrand\.co\.uk|video\.thinkof\.name|video\.toot\.pt|video\.triplea\.fr|video\.turbo\.chat|video\.vaku\.org\.ua|video\.veloma\.org|video\.violoncello\.ch|video\.wilkie\.how|video\.wsf2021\.info|videorelay\.co|videos-passages\.huma-num\.fr|videos\.3d-wolf\.com|videos\.ahp-numerique\.fr|videos\.alexandrebadalo\.pt|videos\.archigny\.net|videos\.benjaminbrady\.ie|videos\.buceoluegoexisto\.com|videos\.capas\.se|videos\.casually\.cat|videos\.cloudron\.io|videos\.coletivos\.org|videos\.danksquad\.org|videos\.denshi\.live|videos\.fromouter\.space|videos\.fsci\.in|videos\.globenet\.org|videos\.hauspie\.fr|videos\.hush\.is|videos\.john-livingston\.fr|videos\.jordanwarne\.xyz|videos\.lavoixdessansvoix\.org|videos\.leslionsfloorball\.fr|videos\.lucero\.top|videos\.martyn\.berlin|videos\.mastodont\.cat|videos\.monstro1\.com|videos\.npo\.city|videos\.optoutpod\.com|videos\.petch\.rocks|videos\.pzelawski\.xyz|videos\.rampin\.org|videos\.scanlines\.xyz|videos\.shmalls\.pw|videos\.sibear\.fr|videos\.stadtfabrikanten\.org|videos\.tankernn\.eu|videos\.testimonia\.org|videos\.thisishowidontdisappear\.com|videos\.traumaheilung\.net|videos\.trom\.tf|videos\.wakkerewereld\.nu|videos\.weblib\.re|videos\.yesil\.club|vids\.roshless\.me|vids\.tekdmn\.me|vidz\.dou\.bet|vod\.lumikko\.dev|vs\.uniter\.network|vulgarisation-informatique\.fr|watch\.breadtube\.tv|watch\.deranalyst\.ch|watch\.ignorance\.eu|watch\.krazy\.party|watch\.libertaria\.space|watch\.rt4mn\.org|watch\.softinio\.com|watch\.tubelab\.video|web-fellow\.de|webtv\.vandoeuvre\.net|wechill\.space|wikileaks\.video|wiwi\.video|worldofvids\.com|wwtube\.net|www4\.mir\.inter21\.net|www\.birkeundnymphe\.de|www\.captain-german\.com|www\.wiki-tube\.de|xxivproduction\.video|xxx\.noho\.st|# from youtube-dlpeertube\.rainbowswingers\.net|tube\.stanisic\.nl|peer\.suiri\.us|medias\.libox\.fr|videomensoif\.ynh\.fr|peertube\.travelpandas\.eu|peertube\.rachetjay\.fr|peertube\.montecsys\.fr|tube\.eskuero\.me|peer\.tube|peertube\.umeahackerspace\.se|tube\.nx-pod\.de|video\.monsieurbidouille\.fr|tube\.openalgeria\.org|vid\.lelux\.fi|video\.anormallostpod\.ovh|tube\.crapaud-fou\.org|peertube\.stemy\.me|lostpod\.space|exode\.me|peertube\.snargol\.com|vis\.ion\.ovh|videosdulib\.re|v\.mbius\.io|videos\.judrey\.eu|peertube\.osureplayviewer\.xyz|peertube\.mathieufamily\.ovh|www\.videos-libr\.es|fightforinfo\.com|peertube\.fediverse\.ru|peertube\.oiseauroch\.fr|video\.nesven\.eu|v\.bearvideo\.win|video\.qoto\.org|justporn\.cc|video\.vny\.fr|peervideo\.club|tube\.taker\.fr|peertube\.chantierlibre\.org|tube\.ipfixe\.info|tube\.kicou\.info|tube\.dodsorf\.as|videobit\.cc|video\.yukari\.moe|videos\.elbinario\.net|hkvideo\.live|pt\.tux\.tf|www\.hkvideo\.live|FIGHTFORINFO\.com|pt\.765racing\.com|peertube\.gnumeria\.eu\.org|nordenmedia\.com|peertube\.co\.uk|tube\.darfweb\.eu|tube\.kalah-france\.org|0ch\.in|vod\.mochi\.academy|film\.node9\.org|peertube\.hatthieves\.es|video\.fitchfamily\.org|peertube\.ddns\.net|video\.ifuncle\.kr|video\.fdlibre\.eu|tube\.22decembre\.eu|peertube\.harmoniescreatives\.com|tube\.fabrigli\.fr|video\.thedwyers\.co|video\.bruitbruit\.com|peertube\.foxfam\.club|peer\.philoxweb\.be|videos\.bugs\.social|peertube\.malbert\.xyz|peertube\.bilange\.ca|libretube\.net|diytelevision\.com|peertube\.fedilab\.app|libre\.video|video\.mstddntfdn\.online|us\.tv|peertube\.sl-network\.fr|peertube\.dynlinux\.io|peertube\.david\.durieux\.family|peertube\.linuxrocks\.online|peerwatch\.xyz|v\.kretschmann\.social|tube\.otter\.sh|yt\.is\.nota\.live|tube\.dragonpsi\.xyz|peertube\.boneheadmedia\.com|videos\.funkwhale\.audio|watch\.44con\.com|peertube\.gcaillaut\.fr|peertube\.icu|pony\.tube|spacepub\.space|tube\.stbr\.io|v\.mom-gay\.faith|tube\.port0\.xyz|peertube\.simounet\.net|play\.jergefelt\.se|peertube\.zeteo\.me|tube\.danq\.me|peertube\.kerenon\.com|tube\.fab-l3\.org|tube\.calculate\.social|peertube\.mckillop\.org|tube\.netzspielplatz\.de|vod\.ksite\.de|peertube\.laas\.fr|tube\.govital\.net|peertube\.stephenson\.cc|bistule\.nohost\.me|peertube\.kajalinifi\.de|video\.ploud\.jp|video\.omniatv\.com|peertube\.ffs2play\.fr|peertube\.leboulaire\.ovh|peertube\.tronic-studio\.com|peertube\.public\.cat|peertube\.metalbanana\.net|video\.1000i100\.fr|peertube\.alter-nativ-voll\.de|tube\.pasa\.tf|tube\.worldofhauru\.xyz|pt\.kamp\.site|peertube\.teleassist\.fr|videos\.mleduc\.xyz|conf\.tube|media\.privacyinternational\.org|pt\.forty-two\.nl|video\.halle-leaks\.de|video\.grosskopfgames\.de|peertube\.schaeferit\.de|peertube\.jackbot\.fr|tube\.extinctionrebellion\.fr|peertube\.f-si\.org|video\.subak\.ovh|videos\.koweb\.fr|peertube\.zergy\.net|peertube\.roflcopter\.fr|peertube\.floss-marketing-school\.com|vloggers\.social|peertube\.iriseden\.eu|videos\.ubuntu-paris\.org|peertube\.mastodon\.host|armstube\.com|peertube\.s2s\.video|peertube\.lol|tube\.open-plug\.eu|open\.tube|peertube\.ch|peertube\.normandie-libre\.fr|peertube\.slat\.org|video\.lacaveatonton\.ovh|peertube\.uno|peertube\.servebeer\.com|peertube\.fedi\.quebec|tube\.h3z\.jp|tube\.plus200\.com|peertube\.eric\.ovh|tube\.metadocs\.cc|tube\.unmondemeilleur\.eu|gouttedeau\.space|video\.antirep\.net|nrop\.cant\.at|tube\.ksl-bmx\.de|tube\.plaf\.fr|tube\.tchncs\.de|video\.devinberg\.com|hitchtube\.fr|peertube\.kosebamse\.com|yunopeertube\.myddns\.me|peertube\.varney\.fr|peertube\.anon-kenkai\.com|tube\.maiti\.info|tubee\.fr|videos\.dinofly\.com|toobnix\.org|videotape\.me|voca\.tube|video\.heromuster\.com|video\.lemediatv\.fr|video\.up\.edu\.ph|balafon\.video|video\.ivel\.fr|thickrips\.cloud|pt\.laurentkruger\.fr|video\.monarch-pass\.net|peertube\.artica\.center|video\.alternanet\.fr|indymotion\.fr|fanvid\.stopthatimp\.net|video\.farci\.org|v\.lesterpig\.com|video\.okaris\.de|tube\.pawelko\.net|peertube\.mablr\.org|tube\.fede\.re|pytu\.be|evertron\.tv|devtube\.dev-wiki\.de|raptube\.antipub\.org|video\.selea\.se|peertube\.mygaia\.org|video\.oh14\.de|peertube\.livingutopia\.org|peertube\.the-penguin\.de|tube\.thechangebook\.org|tube\.anjara\.eu|pt\.pube\.tk|video\.samedi\.pm|mplayer\.demouliere\.eu|widemus\.de|peertube\.me|peertube\.zapashcanon\.fr|video\.latavernedejohnjohn\.fr|peertube\.pcservice46\.fr|peertube\.mazzonetto\.eu|video\.irem\.univ-paris-diderot\.fr|video\.livecchi\.cloud|alttube\.fr|video\.coop\.tools|video\.cabane-libre\.org|peertube\.openstreetmap\.fr|videos\.alolise\.org|irrsinn\.video|video\.antopie\.org|scitech\.video|tube2\.nemsia\.org|video\.amic37\.fr|peertube\.freeforge\.eu|video\.arbitrarion\.com|video\.datsemultimedia\.com|stoptrackingus\.tv|peertube\.ricostrongxxx\.com|docker\.videos\.lecygnenoir\.info|peertube\.togart\.de|tube\.postblue\.info|videos\.domainepublic\.net|peertube\.cyber-tribal\.com|video\.gresille\.org|peertube\.dsmouse\.net|cinema\.yunohost\.support|tube\.theocevaer\.fr|repro\.video|tube\.4aem\.com|quaziinc\.com|peertube\.metawurst\.space|videos\.wakapo\.com|video\.ploud\.fr|video\.freeradical\.zone|tube\.valinor\.fr|refuznik\.video|pt\.kircheneuenburg\.de|peertube\.asrun\.eu|peertube\.lagob\.fr|videos\.side-ways\.net|91video\.online|video\.valme\.io|video\.taboulisme\.com|videos-libr\.es|tv\.mooh\.fr|nuage\.acostey\.fr|video\.monsieur-a\.fr|peertube\.librelois\.fr|videos\.pair2jeux\.tube|videos\.pueseso\.club|peer\.mathdacloud\.ovh|media\.assassinate-you\.net|vidcommons\.org|ptube\.rousset\.nom\.fr|tube\.cyano\.at|videos\.squat\.net|video\.iphodase\.fr|peertube\.makotoworkshop\.org|peertube\.serveur\.slv-valbonne\.fr|vault\.mle\.party|hostyour\.tv|videos\.hack2g2\.fr|libre\.tube|pire\.artisanlogiciel\.net|videos\.numerique-en-commun\.fr|video\.netsyms\.com|video\.die-partei\.social|video\.writeas\.org|peertube\.swarm\.solvingmaz\.es|tube\.pericoloso\.ovh|watching\.cypherpunk\.observer|videos\.adhocmusic\.com|tube\.rfc1149\.net|peertube\.librelabucm\.org|videos\.numericoop\.fr|peertube\.koehn\.com|peertube\.anarchmusicall\.net|tube\.kampftoast\.de|vid\.y-y\.li|peertube\.xtenz\.xyz|diode\.zone|tube\.egf\.mn|peertube\.nomagic\.uk|visionon\.tv|videos\.koumoul\.com|video\.rastapuls\.com|video\.mantlepro\.com|video\.deadsuperhero\.com|peertube\.musicstudio\.pro|peertube\.we-keys\.fr|artitube\.artifaille\.fr|peertube\.ethernia\.net|tube\.midov\.pl|peertube\.fr|watch\.snoot\.tube|peertube\.donnadieu\.fr|argos\.aquilenet\.fr|tube\.nemsia\.org|tube\.bruniau\.net|videos\.darckoune\.moe|tube\.traydent\.info|dev\.videos\.lecygnenoir\.info|peertube\.nayya\.org|peertube\.live|peertube\.mofgao\.space|video\.lequerrec\.eu|peertube\.amicale\.net|aperi\.tube|tube\.ac-lyon\.fr|video\.lw1\.at|www\.yiny\.org|videos\.pofilo\.fr|tube\.lou\.lt|choob\.h\.etbus\.ch|tube\.hoga\.fr|peertube\.heberge\.fr|video\.obermui\.de|videos\.cloudfrancois\.fr|betamax\.video|video\.typica\.us|tube\.piweb\.be|video\.blender\.org|peertube\.cat|tube\.kdy\.ch|pe\.ertu\.be|peertube\.social|videos\.lescommuns\.org|tv\.datamol\.org|videonaute\.fr|dialup\.express|peertube\.nogafa\.org|megatube\.lilomoino\.fr|peertube\.tamanoir\.foucry\.net|peertube\.devosi\.org|peertube\.1312\.media|tube\.bootlicker\.party|skeptikon\.fr|video\.blueline\.mg|tube\.homecomputing\.fr|tube\.ouahpiti\.info|video\.tedomum\.net|video\.g3l\.org|fontube\.fr|peertube\.gaialabs\.ch|tube\.kher\.nl|peertube\.qtg\.fr|video\.migennes\.net|tube\.p2p\.legal|troll\.tv|videos\.iut-orsay\.fr|peertube\.solidev\.net|videos\.cemea\.org|video\.passageenseine\.fr|videos\.festivalparminous\.org|peertube\.touhoppai\.moe|sikke\.fi|peer\.hostux\.social|share\.tube|peertube\.walkingmountains\.fr|videos\.benpro\.fr|peertube\.parleur\.net|peertube\.heraut\.eu|tube\.aquilenet\.fr|peertube\.gegeweb\.eu|framatube\.org|thinkerview\.video|tube\.conferences-gesticulees\.net|peertube\.datagueule\.tv|video\.lqdn\.fr|tube\.mochi\.academy|media\.zat\.im|video\.colibris-outilslibres\.org|tube\.svnet\.fr|peertube\.video|peertube2\.cpy\.re|peertube3\.cpy\.re|videos\.tcit\.fr|peertube\.cpy\.re|canard\.tube))/(?:videos/(?:watch|embed)|api/v\d/videos|w)/)(?P<id>[\da-zA-Z]{22}|[\da-fA-F]{8}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{12})`, String.raw`(?x)https?://(?P<host>(?:# Taken from https://instances.joinpeertube.org/instances40two\.tube|a\.metube\.ch|advtv\.ml|algorithmic\.tv|alimulama\.com|arcana\.fun|archive\.vidicon\.org|artefac-paris\.tv|auf1\.eu|battlepenguin\.video|beertube\.epgn\.ch|befree\.nohost\.me|bideoak\.argia\.eus|birkeundnymphe\.de|bitcointv\.com|cattube\.org|clap\.nerv-project\.eu|climatejustice\.video|comf\.tube|conspiracydistillery\.com|darkvapor\.nohost\.me|daschauher\.aksel\.rocks|digitalcourage\.video|dreiecksnebel\.alex-detsch\.de|eduvid\.org|evangelisch\.video|exo\.tube|fair\.tube|fediverse\.tv|film\.k-prod\.fr|flim\.txmn\.tk|fotogramas\.politicaconciencia\.org|ftsi\.ru|gary\.vger\.cloud|graeber\.video|greatview\.video|grypstube\.uni-greifswald\.de|highvoltage\.tv|hpstube\.fr|htp\.live|hyperreal\.tube|juggling\.digital|kino\.kompot\.si|kino\.schuerz\.at|kinowolnosc\.pl|kirche\.peertube-host\.de|kodcast\.com|kolektiva\.media|kraut\.zone|kumi\.tube|lastbreach\.tv|lepetitmayennais\.fr\.nf|lexx\.impa\.me|libertynode\.tv|libra\.syntazia\.org|libremedia\.video|live\.libratoi\.org|live\.nanao\.moe|live\.toobnix\.org|livegram\.net|lolitube\.freedomchan\.moe|lucarne\.balsamine\.be|maindreieck-tv\.de|mani\.tube|manicphase\.me|media\.fsfe\.org|media\.gzevd\.de|media\.inno3\.cricket|media\.kaitaia\.life|media\.krashboyz\.org|media\.over-world\.org|media\.skewed\.de|media\.undeadnetwork\.de|medias\.pingbase\.net|melsungen\.peertube-host\.de|mirametube\.fr|mojotube\.net|monplaisirtube\.ddns\.net|mountaintown\.video|my\.bunny\.cafe|myfreetube\.de|mytube\.kn-cloud\.de|mytube\.madzel\.de|myworkoutarenapeertube\.cf|nanawel-peertube\.dyndns\.org|nastub\.cz|offenes\.tv|orgdup\.media|ovaltube\.codinglab\.ch|p2ptv\.ru|p\.eertu\.be|p\.lu|peer\.azurs\.fr|peertube1\.zeteo\.me|peertube\.020\.pl|peertube\.0x5e\.eu|peertube\.alpharius\.io|peertube\.am-networks\.fr|peertube\.anduin\.net|peertube\.anzui\.dev|peertube\.arbleizez\.bzh|peertube\.art3mis\.de|peertube\.atilla\.org|peertube\.atsuchan\.page|peertube\.aukfood\.net|peertube\.aventer\.biz|peertube\.b38\.rural-it\.org|peertube\.beeldengeluid\.nl|peertube\.be|peertube\.bgzashtita\.es|peertube\.bitsandlinux\.com|peertube\.biz|peertube\.boba\.best|peertube\.br0\.fr|peertube\.bridaahost\.ynh\.fr|peertube\.bubbletea\.dev|peertube\.bubuit\.net|peertube\.cabaal\.net|peertube\.cats-home\.net|peertube\.chemnitz\.freifunk\.net|peertube\.chevro\.fr|peertube\.chrisspiegl\.com|peertube\.chtisurel\.net|peertube\.cipherbliss\.com|peertube\.cloud\.sans\.pub|peertube\.cpge-brizeux\.fr|peertube\.ctseuro\.com|peertube\.cuatrolibertades\.org|peertube\.cybercirujas\.club|peertube\.cythin\.com|peertube\.davigge\.com|peertube\.dc\.pini\.fr|peertube\.debian\.social|peertube\.demonix\.fr|peertube\.designersethiques\.org|peertube\.desmu\.fr|peertube\.devloprog\.org|peertube\.devol\.it|peertube\.dtmf\.ca|peertube\.ecologie\.bzh|peertube\.eu\.org|peertube\.european-pirates\.eu|peertube\.euskarabildua\.eus|peertube\.fenarinarsa\.com|peertube\.fomin\.site|peertube\.forsud\.be|peertube\.francoispelletier\.org|peertube\.freenet\.ru|peertube\.freetalklive\.com|peertube\.functional\.cafe|peertube\.gardeludwig\.fr|peertube\.gargantia\.fr|peertube\.gcfamily\.fr|peertube\.genma\.fr|peertube\.get-racing\.de|peertube\.gidikroon\.eu|peertube\.gruezishop\.ch|peertube\.habets\.house|peertube\.hackerfraternity\.org|peertube\.ichigo\.everydayimshuflin\.com|peertube\.ignifi\.me|peertube\.inapurna\.org|peertube\.informaction\.info|peertube\.interhop\.org|peertube\.iselfhost\.com|peertube\.it|peertube\.jensdiemer\.de|peertube\.joffreyverd\.fr|peertube\.kalua\.im|peertube\.kathryl\.fr|peertube\.keazilla\.net|peertube\.klaewyss\.fr|peertube\.kodcast\.com|peertube\.kx\.studio|peertube\.lagvoid\.com|peertube\.lavallee\.tech|peertube\.le5emeaxe\.fr|peertube\.lestutosdeprocessus\.fr|peertube\.librenet\.co\.za|peertube\.logilab\.fr|peertube\.louisematic\.site|peertube\.luckow\.org|peertube\.luga\.at|peertube\.lyceeconnecte\.fr|peertube\.manalejandro\.com|peertube\.marud\.fr|peertube\.mattone\.net|peertube\.maxweiss\.io|peertube\.monlycee\.net|peertube\.mxinfo\.fr|peertube\.myrasp\.eu|peertube\.nebelcloud\.de|peertube\.netzbegruenung\.de|peertube\.newsocial\.tech|peertube\.nicolastissot\.fr|peertube\.nz|peertube\.offerman\.com|peertube\.opencloud\.lu|peertube\.orthus\.link|peertube\.patapouf\.xyz|peertube\.pi2\.dev|peertube\.plataformess\.org|peertube\.pl|peertube\.portaesgnos\.org|peertube\.r2\.enst\.fr|peertube\.r5c3\.fr|peertube\.radres\.xyz|peertube\.red|peertube\.robonomics\.network|peertube\.rtnkv\.cloud|peertube\.runfox\.tk|peertube\.satoshishop\.de|peertube\.scic-tetris\.org|peertube\.securitymadein\.lu|peertube\.semweb\.pro|peertube\.social\.my-wan\.de|peertube\.soykaf\.org|peertube\.stefofficiel\.me|peertube\.stream|peertube\.su|peertube\.swrs\.net|peertube\.takeko\.cyou|peertube\.tangentfox\.com|peertube\.taxinachtegel\.de|peertube\.thenewoil\.xyz|peertube\.ti-fr\.com|peertube\.tiennot\.net|peertube\.troback\.com|peertube\.tspu\.edu\.ru|peertube\.tux\.ovh|peertube\.tv|peertube\.tweb\.tv|peertube\.ucy\.de|peertube\.underworld\.fr|peertube\.us\.to|peertube\.ventresmous\.fr|peertube\.vlaki\.cz|peertube\.w\.utnw\.de|peertube\.westring\.digital|peertube\.xwiki\.com|peertube\.zoz-serv\.org|peervideo\.ru|periscope\.numenaute\.org|perron-tube\.de|petitlutinartube\.fr|phijkchu\.com|pierre\.tube|piraten\.space|play\.rosano\.ca|player\.ojamajo\.moe|plextube\.nl|pocketnetpeertube1\.nohost\.me|pocketnetpeertube3\.nohost\.me|pocketnetpeertube4\.nohost\.me|pocketnetpeertube5\.nohost\.me|pocketnetpeertube6\.nohost\.me|pt\.24-7\.ro|pt\.apathy\.top|pt\.diaspodon\.fr|pt\.fedi\.tech|pt\.maciej\.website|ptb\.lunarviews\.net|ptmir1\.inter21\.net|ptmir2\.inter21\.net|ptmir3\.inter21\.net|ptmir4\.inter21\.net|ptmir5\.inter21\.net|ptube\.horsentiers\.fr|ptube\.xmanifesto\.club|queermotion\.org|re-wizja\.re-medium\.com|regarder\.sans\.pub|ruraletv\.ovh|s1\.gegenstimme\.tv|s2\.veezee\.tube|sdmtube\.fr|sender-fm\.veezee\.tube|serv1\.wiki-tube\.de|serv3\.wiki-tube\.de|sickstream\.net|sleepy\.tube|sovran\.video|spectra\.video|stream\.elven\.pw|stream\.k-prod\.fr|stream\.shahab\.nohost\.me|streamsource\.video|studios\.racer159\.com|testtube\.florimond\.eu|tgi\.hosted\.spacebear\.ee|thaitube\.in\.th|the\.jokertv\.eu|theater\.ethernia\.net|thecool\.tube|tilvids\.com|toob\.bub\.org|tpaw\.video|truetube\.media|tuba\.lhub\.pl|tube-aix-marseille\.beta\.education\.fr|tube-amiens\.beta\.education\.fr|tube-besancon\.beta\.education\.fr|tube-bordeaux\.beta\.education\.fr|tube-clermont-ferrand\.beta\.education\.fr|tube-corse\.beta\.education\.fr|tube-creteil\.beta\.education\.fr|tube-dijon\.beta\.education\.fr|tube-education\.beta\.education\.fr|tube-grenoble\.beta\.education\.fr|tube-lille\.beta\.education\.fr|tube-limoges\.beta\.education\.fr|tube-montpellier\.beta\.education\.fr|tube-nancy\.beta\.education\.fr|tube-nantes\.beta\.education\.fr|tube-nice\.beta\.education\.fr|tube-normandie\.beta\.education\.fr|tube-orleans-tours\.beta\.education\.fr|tube-outremer\.beta\.education\.fr|tube-paris\.beta\.education\.fr|tube-poitiers\.beta\.education\.fr|tube-reims\.beta\.education\.fr|tube-rennes\.beta\.education\.fr|tube-strasbourg\.beta\.education\.fr|tube-toulouse\.beta\.education\.fr|tube-versailles\.beta\.education\.fr|tube1\.it\.tuwien\.ac\.at|tube\.abolivier\.bzh|tube\.ac-amiens\.fr|tube\.aerztefueraufklaerung\.de|tube\.alexx\.ml|tube\.amic37\.fr|tube\.anufrij\.de|tube\.apolut\.net|tube\.arkhalabs\.io|tube\.arthack\.nz|tube\.as211696\.net|tube\.avensio\.de|tube\.azbyka\.ru|tube\.azkware\.net|tube\.bachaner\.fr|tube\.bmesh\.org|tube\.borked\.host|tube\.bstly\.de|tube\.chaoszone\.tv|tube\.chatelet\.ovh|tube\.cloud-libre\.eu|tube\.cms\.garden|tube\.cowfee\.moe|tube\.cryptography\.dog|tube\.darknight-coffee\.org|tube\.dev\.lhub\.pl|tube\.distrilab\.fr|tube\.dsocialize\.net|tube\.ebin\.club|tube\.fdn\.fr|tube\.florimond\.eu|tube\.foxarmy\.ml|tube\.foxden\.party|tube\.frischesicht\.de|tube\.futuretic\.fr|tube\.gnous\.eu|tube\.grap\.coop|tube\.graz\.social|tube\.grin\.hu|tube\.hackerscop\.org|tube\.hordearii\.fr|tube\.jeena\.net|tube\.kai-stuht\.com|tube\.kockatoo\.org|tube\.kotur\.org|tube\.lacaveatonton\.ovh|tube\.linkse\.media|tube\.lokad\.com|tube\.lucie-philou\.com|tube\.melonbread\.xyz|tube\.mfraters\.net|tube\.motuhake\.xyz|tube\.mrbesen\.de|tube\.nah\.re|tube\.nchoco\.net|tube\.novg\.net|tube\.nox-rhea\.org|tube\.nuagelibre\.fr|tube\.nx12\.net|tube\.octaplex\.net|tube\.odat\.xyz|tube\.oisux\.org|tube\.opportunis\.me|tube\.org\.il|tube\.ortion\.xyz|tube\.others\.social|tube\.picasoft\.net|tube\.plomlompom\.com|tube\.pmj\.rocks|tube\.portes-imaginaire\.org|tube\.pyngu\.com|tube\.rebellion\.global|tube\.rhythms-of-resistance\.org|tube\.rita\.moe|tube\.rsi\.cnr\.it|tube\.s1gm4\.eu|tube\.saumon\.io|tube\.schleuss\.online|tube\.schule\.social|tube\.seditio\.fr|tube\.shanti\.cafe|tube\.shela\.nu|tube\.skrep\.in|tube\.sp-codes\.de|tube\.sp4ke\.com|tube\.superseriousbusiness\.org|tube\.systest\.eu|tube\.tappret\.fr|tube\.tardis\.world|tube\.toontoet\.nl|tube\.tpshd\.de|tube\.troopers\.agency|tube\.tylerdavis\.xyz|tube\.undernet\.uy|tube\.vigilian-consulting\.nl|tube\.vraphim\.com|tube\.wehost\.lgbt|tube\.wien\.rocks|tube\.wolfe\.casa|tube\.xd0\.de|tube\.xy-space\.de|tube\.yapbreak\.fr|tubedu\.org|tubes\.jodh\.us|tuktube\.com|turkum\.me|tututu\.tube|tuvideo\.encanarias\.info|tv1\.cocu\.cc|tv1\.gomntu\.space|tv2\.cocu\.cc|tv\.adn\.life|tv\.atmx\.ca|tv\.bitma\.st|tv\.generallyrubbish\.net\.au|tv\.lumbung\.space|tv\.mattchristiansenmedia\.com|tv\.netwhood\.online|tv\.neue\.city|tv\.piejacker\.net|tv\.pirateradio\.social|tv\.undersco\.re|tvox\.ru|twctube\.twc-zone\.eu|unfilter\.tube|v\.basspistol\.org|v\.kisombrella\.top|v\.lastorder\.xyz|v\.lor\.sh|v\.phreedom\.club|v\.sil\.sh|v\.szy\.io|v\.xxxapex\.com|veezee\.tube|vid\.dascoyote\.xyz|vid\.garwood\.io|vid\.ncrypt\.at|vid\.pravdastalina\.info|vid\.qorg11\.net|vid\.rajeshtaylor\.com|vid\.samtripoli\.com|vid\.werefox\.dev|vid\.wildeboer\.net|video-cave-v2\.de|video\.076\.ne\.jp|video\.1146\.nohost\.me|video\.altertek\.org|video\.anartist\.org|video\.apps\.thedoodleproject\.net|video\.artist\.cx|video\.asgardius\.company|video\.balsillie\.net|video\.bards\.online|video\.binarydad\.com|video\.blast-info\.fr|video\.catgirl\.biz|video\.cigliola\.com|video\.cm-en-transition\.fr|video\.cnt\.social|video\.coales\.co|video\.codingfield\.com|video\.comptoir\.net|video\.comune\.trento\.it|video\.cpn\.so|video\.csc49\.fr|video\.cybre\.town|video\.demokratischer-sommer\.de|video\.discord-insoumis\.fr|video\.dolphincastle\.com|video\.dresden\.network|video\.ecole-89\.com|video\.elgrillolibertario\.org|video\.emergeheart\.info|video\.eradicatinglove\.xyz|video\.ethantheenigma\.me|video\.exodus-privacy\.eu\.org|video\.fbxl\.net|video\.fhtagn\.org|video\.greenmycity\.eu|video\.guerredeclasse\.fr|video\.gyt\.is|video\.hackers\.town|video\.hardlimit\.com|video\.hooli\.co|video\.igem\.org|video\.internet-czas-dzialac\.pl|video\.islameye\.com|video\.kicik\.fr|video\.kuba-orlik\.name|video\.kyushojitsu\.ca|video\.lavolte\.net|video\.lespoesiesdheloise\.fr|video\.liberta\.vip|video\.liege\.bike|video\.linc\.systems|video\.linux\.it|video\.linuxtrent\.it|video\.lokal\.social|video\.lono\.space|video\.lunasqu\.ee|video\.lundi\.am|video\.marcorennmaus\.de|video\.mass-trespass\.uk|video\.mugoreve\.fr|video\.mundodesconocido\.com|video\.mycrowd\.ca|video\.nogafam\.es|video\.odayacres\.farm|video\.ozgurkon\.org|video\.p1ng0ut\.social|video\.p3x\.de|video\.pcf\.fr|video\.pony\.gallery|video\.potate\.space|video\.pourpenser\.pro|video\.progressiv\.dev|video\.resolutions\.it|video\.rw501\.de|video\.screamer\.wiki|video\.sdm-tools\.net|video\.sftblw\.moe|video\.shitposter\.club|video\.skyn3t\.in|video\.soi\.ch|video\.stuartbrand\.co\.uk|video\.thinkof\.name|video\.toot\.pt|video\.triplea\.fr|video\.turbo\.chat|video\.vaku\.org\.ua|video\.veloma\.org|video\.violoncello\.ch|video\.wilkie\.how|video\.wsf2021\.info|videorelay\.co|videos-passages\.huma-num\.fr|videos\.3d-wolf\.com|videos\.ahp-numerique\.fr|videos\.alexandrebadalo\.pt|videos\.archigny\.net|videos\.benjaminbrady\.ie|videos\.buceoluegoexisto\.com|videos\.capas\.se|videos\.casually\.cat|videos\.cloudron\.io|videos\.coletivos\.org|videos\.danksquad\.org|videos\.denshi\.live|videos\.fromouter\.space|videos\.fsci\.in|videos\.globenet\.org|videos\.hauspie\.fr|videos\.hush\.is|videos\.john-livingston\.fr|videos\.jordanwarne\.xyz|videos\.lavoixdessansvoix\.org|videos\.leslionsfloorball\.fr|videos\.lucero\.top|videos\.martyn\.berlin|videos\.mastodont\.cat|videos\.monstro1\.com|videos\.npo\.city|videos\.optoutpod\.com|videos\.petch\.rocks|videos\.pzelawski\.xyz|videos\.rampin\.org|videos\.scanlines\.xyz|videos\.shmalls\.pw|videos\.sibear\.fr|videos\.stadtfabrikanten\.org|videos\.tankernn\.eu|videos\.testimonia\.org|videos\.thisishowidontdisappear\.com|videos\.traumaheilung\.net|videos\.trom\.tf|videos\.wakkerewereld\.nu|videos\.weblib\.re|videos\.yesil\.club|vids\.roshless\.me|vids\.tekdmn\.me|vidz\.dou\.bet|vod\.lumikko\.dev|vs\.uniter\.network|vulgarisation-informatique\.fr|watch\.breadtube\.tv|watch\.deranalyst\.ch|watch\.ignorance\.eu|watch\.krazy\.party|watch\.libertaria\.space|watch\.rt4mn\.org|watch\.softinio\.com|watch\.tubelab\.video|web-fellow\.de|webtv\.vandoeuvre\.net|wechill\.space|wikileaks\.video|wiwi\.video|worldofvids\.com|wwtube\.net|www4\.mir\.inter21\.net|www\.birkeundnymphe\.de|www\.captain-german\.com|www\.wiki-tube\.de|xxivproduction\.video|xxx\.noho\.st|# from youtube-dlpeertube\.rainbowswingers\.net|tube\.stanisic\.nl|peer\.suiri\.us|medias\.libox\.fr|videomensoif\.ynh\.fr|peertube\.travelpandas\.eu|peertube\.rachetjay\.fr|peertube\.montecsys\.fr|tube\.eskuero\.me|peer\.tube|peertube\.umeahackerspace\.se|tube\.nx-pod\.de|video\.monsieurbidouille\.fr|tube\.openalgeria\.org|vid\.lelux\.fi|video\.anormallostpod\.ovh|tube\.crapaud-fou\.org|peertube\.stemy\.me|lostpod\.space|exode\.me|peertube\.snargol\.com|vis\.ion\.ovh|videosdulib\.re|v\.mbius\.io|videos\.judrey\.eu|peertube\.osureplayviewer\.xyz|peertube\.mathieufamily\.ovh|www\.videos-libr\.es|fightforinfo\.com|peertube\.fediverse\.ru|peertube\.oiseauroch\.fr|video\.nesven\.eu|v\.bearvideo\.win|video\.qoto\.org|justporn\.cc|video\.vny\.fr|peervideo\.club|tube\.taker\.fr|peertube\.chantierlibre\.org|tube\.ipfixe\.info|tube\.kicou\.info|tube\.dodsorf\.as|videobit\.cc|video\.yukari\.moe|videos\.elbinario\.net|hkvideo\.live|pt\.tux\.tf|www\.hkvideo\.live|FIGHTFORINFO\.com|pt\.765racing\.com|peertube\.gnumeria\.eu\.org|nordenmedia\.com|peertube\.co\.uk|tube\.darfweb\.eu|tube\.kalah-france\.org|0ch\.in|vod\.mochi\.academy|film\.node9\.org|peertube\.hatthieves\.es|video\.fitchfamily\.org|peertube\.ddns\.net|video\.ifuncle\.kr|video\.fdlibre\.eu|tube\.22decembre\.eu|peertube\.harmoniescreatives\.com|tube\.fabrigli\.fr|video\.thedwyers\.co|video\.bruitbruit\.com|peertube\.foxfam\.club|peer\.philoxweb\.be|videos\.bugs\.social|peertube\.malbert\.xyz|peertube\.bilange\.ca|libretube\.net|diytelevision\.com|peertube\.fedilab\.app|libre\.video|video\.mstddntfdn\.online|us\.tv|peertube\.sl-network\.fr|peertube\.dynlinux\.io|peertube\.david\.durieux\.family|peertube\.linuxrocks\.online|peerwatch\.xyz|v\.kretschmann\.social|tube\.otter\.sh|yt\.is\.nota\.live|tube\.dragonpsi\.xyz|peertube\.boneheadmedia\.com|videos\.funkwhale\.audio|watch\.44con\.com|peertube\.gcaillaut\.fr|peertube\.icu|pony\.tube|spacepub\.space|tube\.stbr\.io|v\.mom-gay\.faith|tube\.port0\.xyz|peertube\.simounet\.net|play\.jergefelt\.se|peertube\.zeteo\.me|tube\.danq\.me|peertube\.kerenon\.com|tube\.fab-l3\.org|tube\.calculate\.social|peertube\.mckillop\.org|tube\.netzspielplatz\.de|vod\.ksite\.de|peertube\.laas\.fr|tube\.govital\.net|peertube\.stephenson\.cc|bistule\.nohost\.me|peertube\.kajalinifi\.de|video\.ploud\.jp|video\.omniatv\.com|peertube\.ffs2play\.fr|peertube\.leboulaire\.ovh|peertube\.tronic-studio\.com|peertube\.public\.cat|peertube\.metalbanana\.net|video\.1000i100\.fr|peertube\.alter-nativ-voll\.de|tube\.pasa\.tf|tube\.worldofhauru\.xyz|pt\.kamp\.site|peertube\.teleassist\.fr|videos\.mleduc\.xyz|conf\.tube|media\.privacyinternational\.org|pt\.forty-two\.nl|video\.halle-leaks\.de|video\.grosskopfgames\.de|peertube\.schaeferit\.de|peertube\.jackbot\.fr|tube\.extinctionrebellion\.fr|peertube\.f-si\.org|video\.subak\.ovh|videos\.koweb\.fr|peertube\.zergy\.net|peertube\.roflcopter\.fr|peertube\.floss-marketing-school\.com|vloggers\.social|peertube\.iriseden\.eu|videos\.ubuntu-paris\.org|peertube\.mastodon\.host|armstube\.com|peertube\.s2s\.video|peertube\.lol|tube\.open-plug\.eu|open\.tube|peertube\.ch|peertube\.normandie-libre\.fr|peertube\.slat\.org|video\.lacaveatonton\.ovh|peertube\.uno|peertube\.servebeer\.com|peertube\.fedi\.quebec|tube\.h3z\.jp|tube\.plus200\.com|peertube\.eric\.ovh|tube\.metadocs\.cc|tube\.unmondemeilleur\.eu|gouttedeau\.space|video\.antirep\.net|nrop\.cant\.at|tube\.ksl-bmx\.de|tube\.plaf\.fr|tube\.tchncs\.de|video\.devinberg\.com|hitchtube\.fr|peertube\.kosebamse\.com|yunopeertube\.myddns\.me|peertube\.varney\.fr|peertube\.anon-kenkai\.com|tube\.maiti\.info|tubee\.fr|videos\.dinofly\.com|toobnix\.org|videotape\.me|voca\.tube|video\.heromuster\.com|video\.lemediatv\.fr|video\.up\.edu\.ph|balafon\.video|video\.ivel\.fr|thickrips\.cloud|pt\.laurentkruger\.fr|video\.monarch-pass\.net|peertube\.artica\.center|video\.alternanet\.fr|indymotion\.fr|fanvid\.stopthatimp\.net|video\.farci\.org|v\.lesterpig\.com|video\.okaris\.de|tube\.pawelko\.net|peertube\.mablr\.org|tube\.fede\.re|pytu\.be|evertron\.tv|devtube\.dev-wiki\.de|raptube\.antipub\.org|video\.selea\.se|peertube\.mygaia\.org|video\.oh14\.de|peertube\.livingutopia\.org|peertube\.the-penguin\.de|tube\.thechangebook\.org|tube\.anjara\.eu|pt\.pube\.tk|video\.samedi\.pm|mplayer\.demouliere\.eu|widemus\.de|peertube\.me|peertube\.zapashcanon\.fr|video\.latavernedejohnjohn\.fr|peertube\.pcservice46\.fr|peertube\.mazzonetto\.eu|video\.irem\.univ-paris-diderot\.fr|video\.livecchi\.cloud|alttube\.fr|video\.coop\.tools|video\.cabane-libre\.org|peertube\.openstreetmap\.fr|videos\.alolise\.org|irrsinn\.video|video\.antopie\.org|scitech\.video|tube2\.nemsia\.org|video\.amic37\.fr|peertube\.freeforge\.eu|video\.arbitrarion\.com|video\.datsemultimedia\.com|stoptrackingus\.tv|peertube\.ricostrongxxx\.com|docker\.videos\.lecygnenoir\.info|peertube\.togart\.de|tube\.postblue\.info|videos\.domainepublic\.net|peertube\.cyber-tribal\.com|video\.gresille\.org|peertube\.dsmouse\.net|cinema\.yunohost\.support|tube\.theocevaer\.fr|repro\.video|tube\.4aem\.com|quaziinc\.com|peertube\.metawurst\.space|videos\.wakapo\.com|video\.ploud\.fr|video\.freeradical\.zone|tube\.valinor\.fr|refuznik\.video|pt\.kircheneuenburg\.de|peertube\.asrun\.eu|peertube\.lagob\.fr|videos\.side-ways\.net|91video\.online|video\.valme\.io|video\.taboulisme\.com|videos-libr\.es|tv\.mooh\.fr|nuage\.acostey\.fr|video\.monsieur-a\.fr|peertube\.librelois\.fr|videos\.pair2jeux\.tube|videos\.pueseso\.club|peer\.mathdacloud\.ovh|media\.assassinate-you\.net|vidcommons\.org|ptube\.rousset\.nom\.fr|tube\.cyano\.at|videos\.squat\.net|video\.iphodase\.fr|peertube\.makotoworkshop\.org|peertube\.serveur\.slv-valbonne\.fr|vault\.mle\.party|hostyour\.tv|videos\.hack2g2\.fr|libre\.tube|pire\.artisanlogiciel\.net|videos\.numerique-en-commun\.fr|video\.netsyms\.com|video\.die-partei\.social|video\.writeas\.org|peertube\.swarm\.solvingmaz\.es|tube\.pericoloso\.ovh|watching\.cypherpunk\.observer|videos\.adhocmusic\.com|tube\.rfc1149\.net|peertube\.librelabucm\.org|videos\.numericoop\.fr|peertube\.koehn\.com|peertube\.anarchmusicall\.net|tube\.kampftoast\.de|vid\.y-y\.li|peertube\.xtenz\.xyz|diode\.zone|tube\.egf\.mn|peertube\.nomagic\.uk|visionon\.tv|videos\.koumoul\.com|video\.rastapuls\.com|video\.mantlepro\.com|video\.deadsuperhero\.com|peertube\.musicstudio\.pro|peertube\.we-keys\.fr|artitube\.artifaille\.fr|peertube\.ethernia\.net|tube\.midov\.pl|peertube\.fr|watch\.snoot\.tube|peertube\.donnadieu\.fr|argos\.aquilenet\.fr|tube\.nemsia\.org|tube\.bruniau\.net|videos\.darckoune\.moe|tube\.traydent\.info|dev\.videos\.lecygnenoir\.info|peertube\.nayya\.org|peertube\.live|peertube\.mofgao\.space|video\.lequerrec\.eu|peertube\.amicale\.net|aperi\.tube|tube\.ac-lyon\.fr|video\.lw1\.at|www\.yiny\.org|videos\.pofilo\.fr|tube\.lou\.lt|choob\.h\.etbus\.ch|tube\.hoga\.fr|peertube\.heberge\.fr|video\.obermui\.de|videos\.cloudfrancois\.fr|betamax\.video|video\.typica\.us|tube\.piweb\.be|video\.blender\.org|peertube\.cat|tube\.kdy\.ch|pe\.ertu\.be|peertube\.social|videos\.lescommuns\.org|tv\.datamol\.org|videonaute\.fr|dialup\.express|peertube\.nogafa\.org|megatube\.lilomoino\.fr|peertube\.tamanoir\.foucry\.net|peertube\.devosi\.org|peertube\.1312\.media|tube\.bootlicker\.party|skeptikon\.fr|video\.blueline\.mg|tube\.homecomputing\.fr|tube\.ouahpiti\.info|video\.tedomum\.net|video\.g3l\.org|fontube\.fr|peertube\.gaialabs\.ch|tube\.kher\.nl|peertube\.qtg\.fr|video\.migennes\.net|tube\.p2p\.legal|troll\.tv|videos\.iut-orsay\.fr|peertube\.solidev\.net|videos\.cemea\.org|video\.passageenseine\.fr|videos\.festivalparminous\.org|peertube\.touhoppai\.moe|sikke\.fi|peer\.hostux\.social|share\.tube|peertube\.walkingmountains\.fr|videos\.benpro\.fr|peertube\.parleur\.net|peertube\.heraut\.eu|tube\.aquilenet\.fr|peertube\.gegeweb\.eu|framatube\.org|thinkerview\.video|tube\.conferences-gesticulees\.net|peertube\.datagueule\.tv|video\.lqdn\.fr|tube\.mochi\.academy|media\.zat\.im|video\.colibris-outilslibres\.org|tube\.svnet\.fr|peertube\.video|peertube2\.cpy\.re|peertube3\.cpy\.re|videos\.tcit\.fr|peertube\.cpy\.re|canard\.tube))/(?P<type>(?:a|c|w/p))/(?P<id>[^/]+)`]);
URL_REGEXS.set('peertube.debian.social', [String.raw`(?x)(?:peertube:(?P<host>[^:]+):|https?://(?P<host_2>(?:# Taken from https://instances.joinpeertube.org/instances40two\.tube|a\.metube\.ch|advtv\.ml|algorithmic\.tv|alimulama\.com|arcana\.fun|archive\.vidicon\.org|artefac-paris\.tv|auf1\.eu|battlepenguin\.video|beertube\.epgn\.ch|befree\.nohost\.me|bideoak\.argia\.eus|birkeundnymphe\.de|bitcointv\.com|cattube\.org|clap\.nerv-project\.eu|climatejustice\.video|comf\.tube|conspiracydistillery\.com|darkvapor\.nohost\.me|daschauher\.aksel\.rocks|digitalcourage\.video|dreiecksnebel\.alex-detsch\.de|eduvid\.org|evangelisch\.video|exo\.tube|fair\.tube|fediverse\.tv|film\.k-prod\.fr|flim\.txmn\.tk|fotogramas\.politicaconciencia\.org|ftsi\.ru|gary\.vger\.cloud|graeber\.video|greatview\.video|grypstube\.uni-greifswald\.de|highvoltage\.tv|hpstube\.fr|htp\.live|hyperreal\.tube|juggling\.digital|kino\.kompot\.si|kino\.schuerz\.at|kinowolnosc\.pl|kirche\.peertube-host\.de|kodcast\.com|kolektiva\.media|kraut\.zone|kumi\.tube|lastbreach\.tv|lepetitmayennais\.fr\.nf|lexx\.impa\.me|libertynode\.tv|libra\.syntazia\.org|libremedia\.video|live\.libratoi\.org|live\.nanao\.moe|live\.toobnix\.org|livegram\.net|lolitube\.freedomchan\.moe|lucarne\.balsamine\.be|maindreieck-tv\.de|mani\.tube|manicphase\.me|media\.fsfe\.org|media\.gzevd\.de|media\.inno3\.cricket|media\.kaitaia\.life|media\.krashboyz\.org|media\.over-world\.org|media\.skewed\.de|media\.undeadnetwork\.de|medias\.pingbase\.net|melsungen\.peertube-host\.de|mirametube\.fr|mojotube\.net|monplaisirtube\.ddns\.net|mountaintown\.video|my\.bunny\.cafe|myfreetube\.de|mytube\.kn-cloud\.de|mytube\.madzel\.de|myworkoutarenapeertube\.cf|nanawel-peertube\.dyndns\.org|nastub\.cz|offenes\.tv|orgdup\.media|ovaltube\.codinglab\.ch|p2ptv\.ru|p\.eertu\.be|p\.lu|peer\.azurs\.fr|peertube1\.zeteo\.me|peertube\.020\.pl|peertube\.0x5e\.eu|peertube\.alpharius\.io|peertube\.am-networks\.fr|peertube\.anduin\.net|peertube\.anzui\.dev|peertube\.arbleizez\.bzh|peertube\.art3mis\.de|peertube\.atilla\.org|peertube\.atsuchan\.page|peertube\.aukfood\.net|peertube\.aventer\.biz|peertube\.b38\.rural-it\.org|peertube\.beeldengeluid\.nl|peertube\.be|peertube\.bgzashtita\.es|peertube\.bitsandlinux\.com|peertube\.biz|peertube\.boba\.best|peertube\.br0\.fr|peertube\.bridaahost\.ynh\.fr|peertube\.bubbletea\.dev|peertube\.bubuit\.net|peertube\.cabaal\.net|peertube\.cats-home\.net|peertube\.chemnitz\.freifunk\.net|peertube\.chevro\.fr|peertube\.chrisspiegl\.com|peertube\.chtisurel\.net|peertube\.cipherbliss\.com|peertube\.cloud\.sans\.pub|peertube\.cpge-brizeux\.fr|peertube\.ctseuro\.com|peertube\.cuatrolibertades\.org|peertube\.cybercirujas\.club|peertube\.cythin\.com|peertube\.davigge\.com|peertube\.dc\.pini\.fr|peertube\.debian\.social|peertube\.demonix\.fr|peertube\.designersethiques\.org|peertube\.desmu\.fr|peertube\.devloprog\.org|peertube\.devol\.it|peertube\.dtmf\.ca|peertube\.ecologie\.bzh|peertube\.eu\.org|peertube\.european-pirates\.eu|peertube\.euskarabildua\.eus|peertube\.fenarinarsa\.com|peertube\.fomin\.site|peertube\.forsud\.be|peertube\.francoispelletier\.org|peertube\.freenet\.ru|peertube\.freetalklive\.com|peertube\.functional\.cafe|peertube\.gardeludwig\.fr|peertube\.gargantia\.fr|peertube\.gcfamily\.fr|peertube\.genma\.fr|peertube\.get-racing\.de|peertube\.gidikroon\.eu|peertube\.gruezishop\.ch|peertube\.habets\.house|peertube\.hackerfraternity\.org|peertube\.ichigo\.everydayimshuflin\.com|peertube\.ignifi\.me|peertube\.inapurna\.org|peertube\.informaction\.info|peertube\.interhop\.org|peertube\.iselfhost\.com|peertube\.it|peertube\.jensdiemer\.de|peertube\.joffreyverd\.fr|peertube\.kalua\.im|peertube\.kathryl\.fr|peertube\.keazilla\.net|peertube\.klaewyss\.fr|peertube\.kodcast\.com|peertube\.kx\.studio|peertube\.lagvoid\.com|peertube\.lavallee\.tech|peertube\.le5emeaxe\.fr|peertube\.lestutosdeprocessus\.fr|peertube\.librenet\.co\.za|peertube\.logilab\.fr|peertube\.louisematic\.site|peertube\.luckow\.org|peertube\.luga\.at|peertube\.lyceeconnecte\.fr|peertube\.manalejandro\.com|peertube\.marud\.fr|peertube\.mattone\.net|peertube\.maxweiss\.io|peertube\.monlycee\.net|peertube\.mxinfo\.fr|peertube\.myrasp\.eu|peertube\.nebelcloud\.de|peertube\.netzbegruenung\.de|peertube\.newsocial\.tech|peertube\.nicolastissot\.fr|peertube\.nz|peertube\.offerman\.com|peertube\.opencloud\.lu|peertube\.orthus\.link|peertube\.patapouf\.xyz|peertube\.pi2\.dev|peertube\.plataformess\.org|peertube\.pl|peertube\.portaesgnos\.org|peertube\.r2\.enst\.fr|peertube\.r5c3\.fr|peertube\.radres\.xyz|peertube\.red|peertube\.robonomics\.network|peertube\.rtnkv\.cloud|peertube\.runfox\.tk|peertube\.satoshishop\.de|peertube\.scic-tetris\.org|peertube\.securitymadein\.lu|peertube\.semweb\.pro|peertube\.social\.my-wan\.de|peertube\.soykaf\.org|peertube\.stefofficiel\.me|peertube\.stream|peertube\.su|peertube\.swrs\.net|peertube\.takeko\.cyou|peertube\.tangentfox\.com|peertube\.taxinachtegel\.de|peertube\.thenewoil\.xyz|peertube\.ti-fr\.com|peertube\.tiennot\.net|peertube\.troback\.com|peertube\.tspu\.edu\.ru|peertube\.tux\.ovh|peertube\.tv|peertube\.tweb\.tv|peertube\.ucy\.de|peertube\.underworld\.fr|peertube\.us\.to|peertube\.ventresmous\.fr|peertube\.vlaki\.cz|peertube\.w\.utnw\.de|peertube\.westring\.digital|peertube\.xwiki\.com|peertube\.zoz-serv\.org|peervideo\.ru|periscope\.numenaute\.org|perron-tube\.de|petitlutinartube\.fr|phijkchu\.com|pierre\.tube|piraten\.space|play\.rosano\.ca|player\.ojamajo\.moe|plextube\.nl|pocketnetpeertube1\.nohost\.me|pocketnetpeertube3\.nohost\.me|pocketnetpeertube4\.nohost\.me|pocketnetpeertube5\.nohost\.me|pocketnetpeertube6\.nohost\.me|pt\.24-7\.ro|pt\.apathy\.top|pt\.diaspodon\.fr|pt\.fedi\.tech|pt\.maciej\.website|ptb\.lunarviews\.net|ptmir1\.inter21\.net|ptmir2\.inter21\.net|ptmir3\.inter21\.net|ptmir4\.inter21\.net|ptmir5\.inter21\.net|ptube\.horsentiers\.fr|ptube\.xmanifesto\.club|queermotion\.org|re-wizja\.re-medium\.com|regarder\.sans\.pub|ruraletv\.ovh|s1\.gegenstimme\.tv|s2\.veezee\.tube|sdmtube\.fr|sender-fm\.veezee\.tube|serv1\.wiki-tube\.de|serv3\.wiki-tube\.de|sickstream\.net|sleepy\.tube|sovran\.video|spectra\.video|stream\.elven\.pw|stream\.k-prod\.fr|stream\.shahab\.nohost\.me|streamsource\.video|studios\.racer159\.com|testtube\.florimond\.eu|tgi\.hosted\.spacebear\.ee|thaitube\.in\.th|the\.jokertv\.eu|theater\.ethernia\.net|thecool\.tube|tilvids\.com|toob\.bub\.org|tpaw\.video|truetube\.media|tuba\.lhub\.pl|tube-aix-marseille\.beta\.education\.fr|tube-amiens\.beta\.education\.fr|tube-besancon\.beta\.education\.fr|tube-bordeaux\.beta\.education\.fr|tube-clermont-ferrand\.beta\.education\.fr|tube-corse\.beta\.education\.fr|tube-creteil\.beta\.education\.fr|tube-dijon\.beta\.education\.fr|tube-education\.beta\.education\.fr|tube-grenoble\.beta\.education\.fr|tube-lille\.beta\.education\.fr|tube-limoges\.beta\.education\.fr|tube-montpellier\.beta\.education\.fr|tube-nancy\.beta\.education\.fr|tube-nantes\.beta\.education\.fr|tube-nice\.beta\.education\.fr|tube-normandie\.beta\.education\.fr|tube-orleans-tours\.beta\.education\.fr|tube-outremer\.beta\.education\.fr|tube-paris\.beta\.education\.fr|tube-poitiers\.beta\.education\.fr|tube-reims\.beta\.education\.fr|tube-rennes\.beta\.education\.fr|tube-strasbourg\.beta\.education\.fr|tube-toulouse\.beta\.education\.fr|tube-versailles\.beta\.education\.fr|tube1\.it\.tuwien\.ac\.at|tube\.abolivier\.bzh|tube\.ac-amiens\.fr|tube\.aerztefueraufklaerung\.de|tube\.alexx\.ml|tube\.amic37\.fr|tube\.anufrij\.de|tube\.apolut\.net|tube\.arkhalabs\.io|tube\.arthack\.nz|tube\.as211696\.net|tube\.avensio\.de|tube\.azbyka\.ru|tube\.azkware\.net|tube\.bachaner\.fr|tube\.bmesh\.org|tube\.borked\.host|tube\.bstly\.de|tube\.chaoszone\.tv|tube\.chatelet\.ovh|tube\.cloud-libre\.eu|tube\.cms\.garden|tube\.cowfee\.moe|tube\.cryptography\.dog|tube\.darknight-coffee\.org|tube\.dev\.lhub\.pl|tube\.distrilab\.fr|tube\.dsocialize\.net|tube\.ebin\.club|tube\.fdn\.fr|tube\.florimond\.eu|tube\.foxarmy\.ml|tube\.foxden\.party|tube\.frischesicht\.de|tube\.futuretic\.fr|tube\.gnous\.eu|tube\.grap\.coop|tube\.graz\.social|tube\.grin\.hu|tube\.hackerscop\.org|tube\.hordearii\.fr|tube\.jeena\.net|tube\.kai-stuht\.com|tube\.kockatoo\.org|tube\.kotur\.org|tube\.lacaveatonton\.ovh|tube\.linkse\.media|tube\.lokad\.com|tube\.lucie-philou\.com|tube\.melonbread\.xyz|tube\.mfraters\.net|tube\.motuhake\.xyz|tube\.mrbesen\.de|tube\.nah\.re|tube\.nchoco\.net|tube\.novg\.net|tube\.nox-rhea\.org|tube\.nuagelibre\.fr|tube\.nx12\.net|tube\.octaplex\.net|tube\.odat\.xyz|tube\.oisux\.org|tube\.opportunis\.me|tube\.org\.il|tube\.ortion\.xyz|tube\.others\.social|tube\.picasoft\.net|tube\.plomlompom\.com|tube\.pmj\.rocks|tube\.portes-imaginaire\.org|tube\.pyngu\.com|tube\.rebellion\.global|tube\.rhythms-of-resistance\.org|tube\.rita\.moe|tube\.rsi\.cnr\.it|tube\.s1gm4\.eu|tube\.saumon\.io|tube\.schleuss\.online|tube\.schule\.social|tube\.seditio\.fr|tube\.shanti\.cafe|tube\.shela\.nu|tube\.skrep\.in|tube\.sp-codes\.de|tube\.sp4ke\.com|tube\.superseriousbusiness\.org|tube\.systest\.eu|tube\.tappret\.fr|tube\.tardis\.world|tube\.toontoet\.nl|tube\.tpshd\.de|tube\.troopers\.agency|tube\.tylerdavis\.xyz|tube\.undernet\.uy|tube\.vigilian-consulting\.nl|tube\.vraphim\.com|tube\.wehost\.lgbt|tube\.wien\.rocks|tube\.wolfe\.casa|tube\.xd0\.de|tube\.xy-space\.de|tube\.yapbreak\.fr|tubedu\.org|tubes\.jodh\.us|tuktube\.com|turkum\.me|tututu\.tube|tuvideo\.encanarias\.info|tv1\.cocu\.cc|tv1\.gomntu\.space|tv2\.cocu\.cc|tv\.adn\.life|tv\.atmx\.ca|tv\.bitma\.st|tv\.generallyrubbish\.net\.au|tv\.lumbung\.space|tv\.mattchristiansenmedia\.com|tv\.netwhood\.online|tv\.neue\.city|tv\.piejacker\.net|tv\.pirateradio\.social|tv\.undersco\.re|tvox\.ru|twctube\.twc-zone\.eu|unfilter\.tube|v\.basspistol\.org|v\.kisombrella\.top|v\.lastorder\.xyz|v\.lor\.sh|v\.phreedom\.club|v\.sil\.sh|v\.szy\.io|v\.xxxapex\.com|veezee\.tube|vid\.dascoyote\.xyz|vid\.garwood\.io|vid\.ncrypt\.at|vid\.pravdastalina\.info|vid\.qorg11\.net|vid\.rajeshtaylor\.com|vid\.samtripoli\.com|vid\.werefox\.dev|vid\.wildeboer\.net|video-cave-v2\.de|video\.076\.ne\.jp|video\.1146\.nohost\.me|video\.altertek\.org|video\.anartist\.org|video\.apps\.thedoodleproject\.net|video\.artist\.cx|video\.asgardius\.company|video\.balsillie\.net|video\.bards\.online|video\.binarydad\.com|video\.blast-info\.fr|video\.catgirl\.biz|video\.cigliola\.com|video\.cm-en-transition\.fr|video\.cnt\.social|video\.coales\.co|video\.codingfield\.com|video\.comptoir\.net|video\.comune\.trento\.it|video\.cpn\.so|video\.csc49\.fr|video\.cybre\.town|video\.demokratischer-sommer\.de|video\.discord-insoumis\.fr|video\.dolphincastle\.com|video\.dresden\.network|video\.ecole-89\.com|video\.elgrillolibertario\.org|video\.emergeheart\.info|video\.eradicatinglove\.xyz|video\.ethantheenigma\.me|video\.exodus-privacy\.eu\.org|video\.fbxl\.net|video\.fhtagn\.org|video\.greenmycity\.eu|video\.guerredeclasse\.fr|video\.gyt\.is|video\.hackers\.town|video\.hardlimit\.com|video\.hooli\.co|video\.igem\.org|video\.internet-czas-dzialac\.pl|video\.islameye\.com|video\.kicik\.fr|video\.kuba-orlik\.name|video\.kyushojitsu\.ca|video\.lavolte\.net|video\.lespoesiesdheloise\.fr|video\.liberta\.vip|video\.liege\.bike|video\.linc\.systems|video\.linux\.it|video\.linuxtrent\.it|video\.lokal\.social|video\.lono\.space|video\.lunasqu\.ee|video\.lundi\.am|video\.marcorennmaus\.de|video\.mass-trespass\.uk|video\.mugoreve\.fr|video\.mundodesconocido\.com|video\.mycrowd\.ca|video\.nogafam\.es|video\.odayacres\.farm|video\.ozgurkon\.org|video\.p1ng0ut\.social|video\.p3x\.de|video\.pcf\.fr|video\.pony\.gallery|video\.potate\.space|video\.pourpenser\.pro|video\.progressiv\.dev|video\.resolutions\.it|video\.rw501\.de|video\.screamer\.wiki|video\.sdm-tools\.net|video\.sftblw\.moe|video\.shitposter\.club|video\.skyn3t\.in|video\.soi\.ch|video\.stuartbrand\.co\.uk|video\.thinkof\.name|video\.toot\.pt|video\.triplea\.fr|video\.turbo\.chat|video\.vaku\.org\.ua|video\.veloma\.org|video\.violoncello\.ch|video\.wilkie\.how|video\.wsf2021\.info|videorelay\.co|videos-passages\.huma-num\.fr|videos\.3d-wolf\.com|videos\.ahp-numerique\.fr|videos\.alexandrebadalo\.pt|videos\.archigny\.net|videos\.benjaminbrady\.ie|videos\.buceoluegoexisto\.com|videos\.capas\.se|videos\.casually\.cat|videos\.cloudron\.io|videos\.coletivos\.org|videos\.danksquad\.org|videos\.denshi\.live|videos\.fromouter\.space|videos\.fsci\.in|videos\.globenet\.org|videos\.hauspie\.fr|videos\.hush\.is|videos\.john-livingston\.fr|videos\.jordanwarne\.xyz|videos\.lavoixdessansvoix\.org|videos\.leslionsfloorball\.fr|videos\.lucero\.top|videos\.martyn\.berlin|videos\.mastodont\.cat|videos\.monstro1\.com|videos\.npo\.city|videos\.optoutpod\.com|videos\.petch\.rocks|videos\.pzelawski\.xyz|videos\.rampin\.org|videos\.scanlines\.xyz|videos\.shmalls\.pw|videos\.sibear\.fr|videos\.stadtfabrikanten\.org|videos\.tankernn\.eu|videos\.testimonia\.org|videos\.thisishowidontdisappear\.com|videos\.traumaheilung\.net|videos\.trom\.tf|videos\.wakkerewereld\.nu|videos\.weblib\.re|videos\.yesil\.club|vids\.roshless\.me|vids\.tekdmn\.me|vidz\.dou\.bet|vod\.lumikko\.dev|vs\.uniter\.network|vulgarisation-informatique\.fr|watch\.breadtube\.tv|watch\.deranalyst\.ch|watch\.ignorance\.eu|watch\.krazy\.party|watch\.libertaria\.space|watch\.rt4mn\.org|watch\.softinio\.com|watch\.tubelab\.video|web-fellow\.de|webtv\.vandoeuvre\.net|wechill\.space|wikileaks\.video|wiwi\.video|worldofvids\.com|wwtube\.net|www4\.mir\.inter21\.net|www\.birkeundnymphe\.de|www\.captain-german\.com|www\.wiki-tube\.de|xxivproduction\.video|xxx\.noho\.st|# from youtube-dlpeertube\.rainbowswingers\.net|tube\.stanisic\.nl|peer\.suiri\.us|medias\.libox\.fr|videomensoif\.ynh\.fr|peertube\.travelpandas\.eu|peertube\.rachetjay\.fr|peertube\.montecsys\.fr|tube\.eskuero\.me|peer\.tube|peertube\.umeahackerspace\.se|tube\.nx-pod\.de|video\.monsieurbidouille\.fr|tube\.openalgeria\.org|vid\.lelux\.fi|video\.anormallostpod\.ovh|tube\.crapaud-fou\.org|peertube\.stemy\.me|lostpod\.space|exode\.me|peertube\.snargol\.com|vis\.ion\.ovh|videosdulib\.re|v\.mbius\.io|videos\.judrey\.eu|peertube\.osureplayviewer\.xyz|peertube\.mathieufamily\.ovh|www\.videos-libr\.es|fightforinfo\.com|peertube\.fediverse\.ru|peertube\.oiseauroch\.fr|video\.nesven\.eu|v\.bearvideo\.win|video\.qoto\.org|justporn\.cc|video\.vny\.fr|peervideo\.club|tube\.taker\.fr|peertube\.chantierlibre\.org|tube\.ipfixe\.info|tube\.kicou\.info|tube\.dodsorf\.as|videobit\.cc|video\.yukari\.moe|videos\.elbinario\.net|hkvideo\.live|pt\.tux\.tf|www\.hkvideo\.live|FIGHTFORINFO\.com|pt\.765racing\.com|peertube\.gnumeria\.eu\.org|nordenmedia\.com|peertube\.co\.uk|tube\.darfweb\.eu|tube\.kalah-france\.org|0ch\.in|vod\.mochi\.academy|film\.node9\.org|peertube\.hatthieves\.es|video\.fitchfamily\.org|peertube\.ddns\.net|video\.ifuncle\.kr|video\.fdlibre\.eu|tube\.22decembre\.eu|peertube\.harmoniescreatives\.com|tube\.fabrigli\.fr|video\.thedwyers\.co|video\.bruitbruit\.com|peertube\.foxfam\.club|peer\.philoxweb\.be|videos\.bugs\.social|peertube\.malbert\.xyz|peertube\.bilange\.ca|libretube\.net|diytelevision\.com|peertube\.fedilab\.app|libre\.video|video\.mstddntfdn\.online|us\.tv|peertube\.sl-network\.fr|peertube\.dynlinux\.io|peertube\.david\.durieux\.family|peertube\.linuxrocks\.online|peerwatch\.xyz|v\.kretschmann\.social|tube\.otter\.sh|yt\.is\.nota\.live|tube\.dragonpsi\.xyz|peertube\.boneheadmedia\.com|videos\.funkwhale\.audio|watch\.44con\.com|peertube\.gcaillaut\.fr|peertube\.icu|pony\.tube|spacepub\.space|tube\.stbr\.io|v\.mom-gay\.faith|tube\.port0\.xyz|peertube\.simounet\.net|play\.jergefelt\.se|peertube\.zeteo\.me|tube\.danq\.me|peertube\.kerenon\.com|tube\.fab-l3\.org|tube\.calculate\.social|peertube\.mckillop\.org|tube\.netzspielplatz\.de|vod\.ksite\.de|peertube\.laas\.fr|tube\.govital\.net|peertube\.stephenson\.cc|bistule\.nohost\.me|peertube\.kajalinifi\.de|video\.ploud\.jp|video\.omniatv\.com|peertube\.ffs2play\.fr|peertube\.leboulaire\.ovh|peertube\.tronic-studio\.com|peertube\.public\.cat|peertube\.metalbanana\.net|video\.1000i100\.fr|peertube\.alter-nativ-voll\.de|tube\.pasa\.tf|tube\.worldofhauru\.xyz|pt\.kamp\.site|peertube\.teleassist\.fr|videos\.mleduc\.xyz|conf\.tube|media\.privacyinternational\.org|pt\.forty-two\.nl|video\.halle-leaks\.de|video\.grosskopfgames\.de|peertube\.schaeferit\.de|peertube\.jackbot\.fr|tube\.extinctionrebellion\.fr|peertube\.f-si\.org|video\.subak\.ovh|videos\.koweb\.fr|peertube\.zergy\.net|peertube\.roflcopter\.fr|peertube\.floss-marketing-school\.com|vloggers\.social|peertube\.iriseden\.eu|videos\.ubuntu-paris\.org|peertube\.mastodon\.host|armstube\.com|peertube\.s2s\.video|peertube\.lol|tube\.open-plug\.eu|open\.tube|peertube\.ch|peertube\.normandie-libre\.fr|peertube\.slat\.org|video\.lacaveatonton\.ovh|peertube\.uno|peertube\.servebeer\.com|peertube\.fedi\.quebec|tube\.h3z\.jp|tube\.plus200\.com|peertube\.eric\.ovh|tube\.metadocs\.cc|tube\.unmondemeilleur\.eu|gouttedeau\.space|video\.antirep\.net|nrop\.cant\.at|tube\.ksl-bmx\.de|tube\.plaf\.fr|tube\.tchncs\.de|video\.devinberg\.com|hitchtube\.fr|peertube\.kosebamse\.com|yunopeertube\.myddns\.me|peertube\.varney\.fr|peertube\.anon-kenkai\.com|tube\.maiti\.info|tubee\.fr|videos\.dinofly\.com|toobnix\.org|videotape\.me|voca\.tube|video\.heromuster\.com|video\.lemediatv\.fr|video\.up\.edu\.ph|balafon\.video|video\.ivel\.fr|thickrips\.cloud|pt\.laurentkruger\.fr|video\.monarch-pass\.net|peertube\.artica\.center|video\.alternanet\.fr|indymotion\.fr|fanvid\.stopthatimp\.net|video\.farci\.org|v\.lesterpig\.com|video\.okaris\.de|tube\.pawelko\.net|peertube\.mablr\.org|tube\.fede\.re|pytu\.be|evertron\.tv|devtube\.dev-wiki\.de|raptube\.antipub\.org|video\.selea\.se|peertube\.mygaia\.org|video\.oh14\.de|peertube\.livingutopia\.org|peertube\.the-penguin\.de|tube\.thechangebook\.org|tube\.anjara\.eu|pt\.pube\.tk|video\.samedi\.pm|mplayer\.demouliere\.eu|widemus\.de|peertube\.me|peertube\.zapashcanon\.fr|video\.latavernedejohnjohn\.fr|peertube\.pcservice46\.fr|peertube\.mazzonetto\.eu|video\.irem\.univ-paris-diderot\.fr|video\.livecchi\.cloud|alttube\.fr|video\.coop\.tools|video\.cabane-libre\.org|peertube\.openstreetmap\.fr|videos\.alolise\.org|irrsinn\.video|video\.antopie\.org|scitech\.video|tube2\.nemsia\.org|video\.amic37\.fr|peertube\.freeforge\.eu|video\.arbitrarion\.com|video\.datsemultimedia\.com|stoptrackingus\.tv|peertube\.ricostrongxxx\.com|docker\.videos\.lecygnenoir\.info|peertube\.togart\.de|tube\.postblue\.info|videos\.domainepublic\.net|peertube\.cyber-tribal\.com|video\.gresille\.org|peertube\.dsmouse\.net|cinema\.yunohost\.support|tube\.theocevaer\.fr|repro\.video|tube\.4aem\.com|quaziinc\.com|peertube\.metawurst\.space|videos\.wakapo\.com|video\.ploud\.fr|video\.freeradical\.zone|tube\.valinor\.fr|refuznik\.video|pt\.kircheneuenburg\.de|peertube\.asrun\.eu|peertube\.lagob\.fr|videos\.side-ways\.net|91video\.online|video\.valme\.io|video\.taboulisme\.com|videos-libr\.es|tv\.mooh\.fr|nuage\.acostey\.fr|video\.monsieur-a\.fr|peertube\.librelois\.fr|videos\.pair2jeux\.tube|videos\.pueseso\.club|peer\.mathdacloud\.ovh|media\.assassinate-you\.net|vidcommons\.org|ptube\.rousset\.nom\.fr|tube\.cyano\.at|videos\.squat\.net|video\.iphodase\.fr|peertube\.makotoworkshop\.org|peertube\.serveur\.slv-valbonne\.fr|vault\.mle\.party|hostyour\.tv|videos\.hack2g2\.fr|libre\.tube|pire\.artisanlogiciel\.net|videos\.numerique-en-commun\.fr|video\.netsyms\.com|video\.die-partei\.social|video\.writeas\.org|peertube\.swarm\.solvingmaz\.es|tube\.pericoloso\.ovh|watching\.cypherpunk\.observer|videos\.adhocmusic\.com|tube\.rfc1149\.net|peertube\.librelabucm\.org|videos\.numericoop\.fr|peertube\.koehn\.com|peertube\.anarchmusicall\.net|tube\.kampftoast\.de|vid\.y-y\.li|peertube\.xtenz\.xyz|diode\.zone|tube\.egf\.mn|peertube\.nomagic\.uk|visionon\.tv|videos\.koumoul\.com|video\.rastapuls\.com|video\.mantlepro\.com|video\.deadsuperhero\.com|peertube\.musicstudio\.pro|peertube\.we-keys\.fr|artitube\.artifaille\.fr|peertube\.ethernia\.net|tube\.midov\.pl|peertube\.fr|watch\.snoot\.tube|peertube\.donnadieu\.fr|argos\.aquilenet\.fr|tube\.nemsia\.org|tube\.bruniau\.net|videos\.darckoune\.moe|tube\.traydent\.info|dev\.videos\.lecygnenoir\.info|peertube\.nayya\.org|peertube\.live|peertube\.mofgao\.space|video\.lequerrec\.eu|peertube\.amicale\.net|aperi\.tube|tube\.ac-lyon\.fr|video\.lw1\.at|www\.yiny\.org|videos\.pofilo\.fr|tube\.lou\.lt|choob\.h\.etbus\.ch|tube\.hoga\.fr|peertube\.heberge\.fr|video\.obermui\.de|videos\.cloudfrancois\.fr|betamax\.video|video\.typica\.us|tube\.piweb\.be|video\.blender\.org|peertube\.cat|tube\.kdy\.ch|pe\.ertu\.be|peertube\.social|videos\.lescommuns\.org|tv\.datamol\.org|videonaute\.fr|dialup\.express|peertube\.nogafa\.org|megatube\.lilomoino\.fr|peertube\.tamanoir\.foucry\.net|peertube\.devosi\.org|peertube\.1312\.media|tube\.bootlicker\.party|skeptikon\.fr|video\.blueline\.mg|tube\.homecomputing\.fr|tube\.ouahpiti\.info|video\.tedomum\.net|video\.g3l\.org|fontube\.fr|peertube\.gaialabs\.ch|tube\.kher\.nl|peertube\.qtg\.fr|video\.migennes\.net|tube\.p2p\.legal|troll\.tv|videos\.iut-orsay\.fr|peertube\.solidev\.net|videos\.cemea\.org|video\.passageenseine\.fr|videos\.festivalparminous\.org|peertube\.touhoppai\.moe|sikke\.fi|peer\.hostux\.social|share\.tube|peertube\.walkingmountains\.fr|videos\.benpro\.fr|peertube\.parleur\.net|peertube\.heraut\.eu|tube\.aquilenet\.fr|peertube\.gegeweb\.eu|framatube\.org|thinkerview\.video|tube\.conferences-gesticulees\.net|peertube\.datagueule\.tv|video\.lqdn\.fr|tube\.mochi\.academy|media\.zat\.im|video\.colibris-outilslibres\.org|tube\.svnet\.fr|peertube\.video|peertube2\.cpy\.re|peertube3\.cpy\.re|videos\.tcit\.fr|peertube\.cpy\.re|canard\.tube))/(?:videos/(?:watch|embed)|api/v\d/videos|w)/)(?P<id>[\da-zA-Z]{22}|[\da-fA-F]{8}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{12})`, String.raw`(?x)https?://(?P<host>(?:# Taken from https://instances.joinpeertube.org/instances40two\.tube|a\.metube\.ch|advtv\.ml|algorithmic\.tv|alimulama\.com|arcana\.fun|archive\.vidicon\.org|artefac-paris\.tv|auf1\.eu|battlepenguin\.video|beertube\.epgn\.ch|befree\.nohost\.me|bideoak\.argia\.eus|birkeundnymphe\.de|bitcointv\.com|cattube\.org|clap\.nerv-project\.eu|climatejustice\.video|comf\.tube|conspiracydistillery\.com|darkvapor\.nohost\.me|daschauher\.aksel\.rocks|digitalcourage\.video|dreiecksnebel\.alex-detsch\.de|eduvid\.org|evangelisch\.video|exo\.tube|fair\.tube|fediverse\.tv|film\.k-prod\.fr|flim\.txmn\.tk|fotogramas\.politicaconciencia\.org|ftsi\.ru|gary\.vger\.cloud|graeber\.video|greatview\.video|grypstube\.uni-greifswald\.de|highvoltage\.tv|hpstube\.fr|htp\.live|hyperreal\.tube|juggling\.digital|kino\.kompot\.si|kino\.schuerz\.at|kinowolnosc\.pl|kirche\.peertube-host\.de|kodcast\.com|kolektiva\.media|kraut\.zone|kumi\.tube|lastbreach\.tv|lepetitmayennais\.fr\.nf|lexx\.impa\.me|libertynode\.tv|libra\.syntazia\.org|libremedia\.video|live\.libratoi\.org|live\.nanao\.moe|live\.toobnix\.org|livegram\.net|lolitube\.freedomchan\.moe|lucarne\.balsamine\.be|maindreieck-tv\.de|mani\.tube|manicphase\.me|media\.fsfe\.org|media\.gzevd\.de|media\.inno3\.cricket|media\.kaitaia\.life|media\.krashboyz\.org|media\.over-world\.org|media\.skewed\.de|media\.undeadnetwork\.de|medias\.pingbase\.net|melsungen\.peertube-host\.de|mirametube\.fr|mojotube\.net|monplaisirtube\.ddns\.net|mountaintown\.video|my\.bunny\.cafe|myfreetube\.de|mytube\.kn-cloud\.de|mytube\.madzel\.de|myworkoutarenapeertube\.cf|nanawel-peertube\.dyndns\.org|nastub\.cz|offenes\.tv|orgdup\.media|ovaltube\.codinglab\.ch|p2ptv\.ru|p\.eertu\.be|p\.lu|peer\.azurs\.fr|peertube1\.zeteo\.me|peertube\.020\.pl|peertube\.0x5e\.eu|peertube\.alpharius\.io|peertube\.am-networks\.fr|peertube\.anduin\.net|peertube\.anzui\.dev|peertube\.arbleizez\.bzh|peertube\.art3mis\.de|peertube\.atilla\.org|peertube\.atsuchan\.page|peertube\.aukfood\.net|peertube\.aventer\.biz|peertube\.b38\.rural-it\.org|peertube\.beeldengeluid\.nl|peertube\.be|peertube\.bgzashtita\.es|peertube\.bitsandlinux\.com|peertube\.biz|peertube\.boba\.best|peertube\.br0\.fr|peertube\.bridaahost\.ynh\.fr|peertube\.bubbletea\.dev|peertube\.bubuit\.net|peertube\.cabaal\.net|peertube\.cats-home\.net|peertube\.chemnitz\.freifunk\.net|peertube\.chevro\.fr|peertube\.chrisspiegl\.com|peertube\.chtisurel\.net|peertube\.cipherbliss\.com|peertube\.cloud\.sans\.pub|peertube\.cpge-brizeux\.fr|peertube\.ctseuro\.com|peertube\.cuatrolibertades\.org|peertube\.cybercirujas\.club|peertube\.cythin\.com|peertube\.davigge\.com|peertube\.dc\.pini\.fr|peertube\.debian\.social|peertube\.demonix\.fr|peertube\.designersethiques\.org|peertube\.desmu\.fr|peertube\.devloprog\.org|peertube\.devol\.it|peertube\.dtmf\.ca|peertube\.ecologie\.bzh|peertube\.eu\.org|peertube\.european-pirates\.eu|peertube\.euskarabildua\.eus|peertube\.fenarinarsa\.com|peertube\.fomin\.site|peertube\.forsud\.be|peertube\.francoispelletier\.org|peertube\.freenet\.ru|peertube\.freetalklive\.com|peertube\.functional\.cafe|peertube\.gardeludwig\.fr|peertube\.gargantia\.fr|peertube\.gcfamily\.fr|peertube\.genma\.fr|peertube\.get-racing\.de|peertube\.gidikroon\.eu|peertube\.gruezishop\.ch|peertube\.habets\.house|peertube\.hackerfraternity\.org|peertube\.ichigo\.everydayimshuflin\.com|peertube\.ignifi\.me|peertube\.inapurna\.org|peertube\.informaction\.info|peertube\.interhop\.org|peertube\.iselfhost\.com|peertube\.it|peertube\.jensdiemer\.de|peertube\.joffreyverd\.fr|peertube\.kalua\.im|peertube\.kathryl\.fr|peertube\.keazilla\.net|peertube\.klaewyss\.fr|peertube\.kodcast\.com|peertube\.kx\.studio|peertube\.lagvoid\.com|peertube\.lavallee\.tech|peertube\.le5emeaxe\.fr|peertube\.lestutosdeprocessus\.fr|peertube\.librenet\.co\.za|peertube\.logilab\.fr|peertube\.louisematic\.site|peertube\.luckow\.org|peertube\.luga\.at|peertube\.lyceeconnecte\.fr|peertube\.manalejandro\.com|peertube\.marud\.fr|peertube\.mattone\.net|peertube\.maxweiss\.io|peertube\.monlycee\.net|peertube\.mxinfo\.fr|peertube\.myrasp\.eu|peertube\.nebelcloud\.de|peertube\.netzbegruenung\.de|peertube\.newsocial\.tech|peertube\.nicolastissot\.fr|peertube\.nz|peertube\.offerman\.com|peertube\.opencloud\.lu|peertube\.orthus\.link|peertube\.patapouf\.xyz|peertube\.pi2\.dev|peertube\.plataformess\.org|peertube\.pl|peertube\.portaesgnos\.org|peertube\.r2\.enst\.fr|peertube\.r5c3\.fr|peertube\.radres\.xyz|peertube\.red|peertube\.robonomics\.network|peertube\.rtnkv\.cloud|peertube\.runfox\.tk|peertube\.satoshishop\.de|peertube\.scic-tetris\.org|peertube\.securitymadein\.lu|peertube\.semweb\.pro|peertube\.social\.my-wan\.de|peertube\.soykaf\.org|peertube\.stefofficiel\.me|peertube\.stream|peertube\.su|peertube\.swrs\.net|peertube\.takeko\.cyou|peertube\.tangentfox\.com|peertube\.taxinachtegel\.de|peertube\.thenewoil\.xyz|peertube\.ti-fr\.com|peertube\.tiennot\.net|peertube\.troback\.com|peertube\.tspu\.edu\.ru|peertube\.tux\.ovh|peertube\.tv|peertube\.tweb\.tv|peertube\.ucy\.de|peertube\.underworld\.fr|peertube\.us\.to|peertube\.ventresmous\.fr|peertube\.vlaki\.cz|peertube\.w\.utnw\.de|peertube\.westring\.digital|peertube\.xwiki\.com|peertube\.zoz-serv\.org|peervideo\.ru|periscope\.numenaute\.org|perron-tube\.de|petitlutinartube\.fr|phijkchu\.com|pierre\.tube|piraten\.space|play\.rosano\.ca|player\.ojamajo\.moe|plextube\.nl|pocketnetpeertube1\.nohost\.me|pocketnetpeertube3\.nohost\.me|pocketnetpeertube4\.nohost\.me|pocketnetpeertube5\.nohost\.me|pocketnetpeertube6\.nohost\.me|pt\.24-7\.ro|pt\.apathy\.top|pt\.diaspodon\.fr|pt\.fedi\.tech|pt\.maciej\.website|ptb\.lunarviews\.net|ptmir1\.inter21\.net|ptmir2\.inter21\.net|ptmir3\.inter21\.net|ptmir4\.inter21\.net|ptmir5\.inter21\.net|ptube\.horsentiers\.fr|ptube\.xmanifesto\.club|queermotion\.org|re-wizja\.re-medium\.com|regarder\.sans\.pub|ruraletv\.ovh|s1\.gegenstimme\.tv|s2\.veezee\.tube|sdmtube\.fr|sender-fm\.veezee\.tube|serv1\.wiki-tube\.de|serv3\.wiki-tube\.de|sickstream\.net|sleepy\.tube|sovran\.video|spectra\.video|stream\.elven\.pw|stream\.k-prod\.fr|stream\.shahab\.nohost\.me|streamsource\.video|studios\.racer159\.com|testtube\.florimond\.eu|tgi\.hosted\.spacebear\.ee|thaitube\.in\.th|the\.jokertv\.eu|theater\.ethernia\.net|thecool\.tube|tilvids\.com|toob\.bub\.org|tpaw\.video|truetube\.media|tuba\.lhub\.pl|tube-aix-marseille\.beta\.education\.fr|tube-amiens\.beta\.education\.fr|tube-besancon\.beta\.education\.fr|tube-bordeaux\.beta\.education\.fr|tube-clermont-ferrand\.beta\.education\.fr|tube-corse\.beta\.education\.fr|tube-creteil\.beta\.education\.fr|tube-dijon\.beta\.education\.fr|tube-education\.beta\.education\.fr|tube-grenoble\.beta\.education\.fr|tube-lille\.beta\.education\.fr|tube-limoges\.beta\.education\.fr|tube-montpellier\.beta\.education\.fr|tube-nancy\.beta\.education\.fr|tube-nantes\.beta\.education\.fr|tube-nice\.beta\.education\.fr|tube-normandie\.beta\.education\.fr|tube-orleans-tours\.beta\.education\.fr|tube-outremer\.beta\.education\.fr|tube-paris\.beta\.education\.fr|tube-poitiers\.beta\.education\.fr|tube-reims\.beta\.education\.fr|tube-rennes\.beta\.education\.fr|tube-strasbourg\.beta\.education\.fr|tube-toulouse\.beta\.education\.fr|tube-versailles\.beta\.education\.fr|tube1\.it\.tuwien\.ac\.at|tube\.abolivier\.bzh|tube\.ac-amiens\.fr|tube\.aerztefueraufklaerung\.de|tube\.alexx\.ml|tube\.amic37\.fr|tube\.anufrij\.de|tube\.apolut\.net|tube\.arkhalabs\.io|tube\.arthack\.nz|tube\.as211696\.net|tube\.avensio\.de|tube\.azbyka\.ru|tube\.azkware\.net|tube\.bachaner\.fr|tube\.bmesh\.org|tube\.borked\.host|tube\.bstly\.de|tube\.chaoszone\.tv|tube\.chatelet\.ovh|tube\.cloud-libre\.eu|tube\.cms\.garden|tube\.cowfee\.moe|tube\.cryptography\.dog|tube\.darknight-coffee\.org|tube\.dev\.lhub\.pl|tube\.distrilab\.fr|tube\.dsocialize\.net|tube\.ebin\.club|tube\.fdn\.fr|tube\.florimond\.eu|tube\.foxarmy\.ml|tube\.foxden\.party|tube\.frischesicht\.de|tube\.futuretic\.fr|tube\.gnous\.eu|tube\.grap\.coop|tube\.graz\.social|tube\.grin\.hu|tube\.hackerscop\.org|tube\.hordearii\.fr|tube\.jeena\.net|tube\.kai-stuht\.com|tube\.kockatoo\.org|tube\.kotur\.org|tube\.lacaveatonton\.ovh|tube\.linkse\.media|tube\.lokad\.com|tube\.lucie-philou\.com|tube\.melonbread\.xyz|tube\.mfraters\.net|tube\.motuhake\.xyz|tube\.mrbesen\.de|tube\.nah\.re|tube\.nchoco\.net|tube\.novg\.net|tube\.nox-rhea\.org|tube\.nuagelibre\.fr|tube\.nx12\.net|tube\.octaplex\.net|tube\.odat\.xyz|tube\.oisux\.org|tube\.opportunis\.me|tube\.org\.il|tube\.ortion\.xyz|tube\.others\.social|tube\.picasoft\.net|tube\.plomlompom\.com|tube\.pmj\.rocks|tube\.portes-imaginaire\.org|tube\.pyngu\.com|tube\.rebellion\.global|tube\.rhythms-of-resistance\.org|tube\.rita\.moe|tube\.rsi\.cnr\.it|tube\.s1gm4\.eu|tube\.saumon\.io|tube\.schleuss\.online|tube\.schule\.social|tube\.seditio\.fr|tube\.shanti\.cafe|tube\.shela\.nu|tube\.skrep\.in|tube\.sp-codes\.de|tube\.sp4ke\.com|tube\.superseriousbusiness\.org|tube\.systest\.eu|tube\.tappret\.fr|tube\.tardis\.world|tube\.toontoet\.nl|tube\.tpshd\.de|tube\.troopers\.agency|tube\.tylerdavis\.xyz|tube\.undernet\.uy|tube\.vigilian-consulting\.nl|tube\.vraphim\.com|tube\.wehost\.lgbt|tube\.wien\.rocks|tube\.wolfe\.casa|tube\.xd0\.de|tube\.xy-space\.de|tube\.yapbreak\.fr|tubedu\.org|tubes\.jodh\.us|tuktube\.com|turkum\.me|tututu\.tube|tuvideo\.encanarias\.info|tv1\.cocu\.cc|tv1\.gomntu\.space|tv2\.cocu\.cc|tv\.adn\.life|tv\.atmx\.ca|tv\.bitma\.st|tv\.generallyrubbish\.net\.au|tv\.lumbung\.space|tv\.mattchristiansenmedia\.com|tv\.netwhood\.online|tv\.neue\.city|tv\.piejacker\.net|tv\.pirateradio\.social|tv\.undersco\.re|tvox\.ru|twctube\.twc-zone\.eu|unfilter\.tube|v\.basspistol\.org|v\.kisombrella\.top|v\.lastorder\.xyz|v\.lor\.sh|v\.phreedom\.club|v\.sil\.sh|v\.szy\.io|v\.xxxapex\.com|veezee\.tube|vid\.dascoyote\.xyz|vid\.garwood\.io|vid\.ncrypt\.at|vid\.pravdastalina\.info|vid\.qorg11\.net|vid\.rajeshtaylor\.com|vid\.samtripoli\.com|vid\.werefox\.dev|vid\.wildeboer\.net|video-cave-v2\.de|video\.076\.ne\.jp|video\.1146\.nohost\.me|video\.altertek\.org|video\.anartist\.org|video\.apps\.thedoodleproject\.net|video\.artist\.cx|video\.asgardius\.company|video\.balsillie\.net|video\.bards\.online|video\.binarydad\.com|video\.blast-info\.fr|video\.catgirl\.biz|video\.cigliola\.com|video\.cm-en-transition\.fr|video\.cnt\.social|video\.coales\.co|video\.codingfield\.com|video\.comptoir\.net|video\.comune\.trento\.it|video\.cpn\.so|video\.csc49\.fr|video\.cybre\.town|video\.demokratischer-sommer\.de|video\.discord-insoumis\.fr|video\.dolphincastle\.com|video\.dresden\.network|video\.ecole-89\.com|video\.elgrillolibertario\.org|video\.emergeheart\.info|video\.eradicatinglove\.xyz|video\.ethantheenigma\.me|video\.exodus-privacy\.eu\.org|video\.fbxl\.net|video\.fhtagn\.org|video\.greenmycity\.eu|video\.guerredeclasse\.fr|video\.gyt\.is|video\.hackers\.town|video\.hardlimit\.com|video\.hooli\.co|video\.igem\.org|video\.internet-czas-dzialac\.pl|video\.islameye\.com|video\.kicik\.fr|video\.kuba-orlik\.name|video\.kyushojitsu\.ca|video\.lavolte\.net|video\.lespoesiesdheloise\.fr|video\.liberta\.vip|video\.liege\.bike|video\.linc\.systems|video\.linux\.it|video\.linuxtrent\.it|video\.lokal\.social|video\.lono\.space|video\.lunasqu\.ee|video\.lundi\.am|video\.marcorennmaus\.de|video\.mass-trespass\.uk|video\.mugoreve\.fr|video\.mundodesconocido\.com|video\.mycrowd\.ca|video\.nogafam\.es|video\.odayacres\.farm|video\.ozgurkon\.org|video\.p1ng0ut\.social|video\.p3x\.de|video\.pcf\.fr|video\.pony\.gallery|video\.potate\.space|video\.pourpenser\.pro|video\.progressiv\.dev|video\.resolutions\.it|video\.rw501\.de|video\.screamer\.wiki|video\.sdm-tools\.net|video\.sftblw\.moe|video\.shitposter\.club|video\.skyn3t\.in|video\.soi\.ch|video\.stuartbrand\.co\.uk|video\.thinkof\.name|video\.toot\.pt|video\.triplea\.fr|video\.turbo\.chat|video\.vaku\.org\.ua|video\.veloma\.org|video\.violoncello\.ch|video\.wilkie\.how|video\.wsf2021\.info|videorelay\.co|videos-passages\.huma-num\.fr|videos\.3d-wolf\.com|videos\.ahp-numerique\.fr|videos\.alexandrebadalo\.pt|videos\.archigny\.net|videos\.benjaminbrady\.ie|videos\.buceoluegoexisto\.com|videos\.capas\.se|videos\.casually\.cat|videos\.cloudron\.io|videos\.coletivos\.org|videos\.danksquad\.org|videos\.denshi\.live|videos\.fromouter\.space|videos\.fsci\.in|videos\.globenet\.org|videos\.hauspie\.fr|videos\.hush\.is|videos\.john-livingston\.fr|videos\.jordanwarne\.xyz|videos\.lavoixdessansvoix\.org|videos\.leslionsfloorball\.fr|videos\.lucero\.top|videos\.martyn\.berlin|videos\.mastodont\.cat|videos\.monstro1\.com|videos\.npo\.city|videos\.optoutpod\.com|videos\.petch\.rocks|videos\.pzelawski\.xyz|videos\.rampin\.org|videos\.scanlines\.xyz|videos\.shmalls\.pw|videos\.sibear\.fr|videos\.stadtfabrikanten\.org|videos\.tankernn\.eu|videos\.testimonia\.org|videos\.thisishowidontdisappear\.com|videos\.traumaheilung\.net|videos\.trom\.tf|videos\.wakkerewereld\.nu|videos\.weblib\.re|videos\.yesil\.club|vids\.roshless\.me|vids\.tekdmn\.me|vidz\.dou\.bet|vod\.lumikko\.dev|vs\.uniter\.network|vulgarisation-informatique\.fr|watch\.breadtube\.tv|watch\.deranalyst\.ch|watch\.ignorance\.eu|watch\.krazy\.party|watch\.libertaria\.space|watch\.rt4mn\.org|watch\.softinio\.com|watch\.tubelab\.video|web-fellow\.de|webtv\.vandoeuvre\.net|wechill\.space|wikileaks\.video|wiwi\.video|worldofvids\.com|wwtube\.net|www4\.mir\.inter21\.net|www\.birkeundnymphe\.de|www\.captain-german\.com|www\.wiki-tube\.de|xxivproduction\.video|xxx\.noho\.st|# from youtube-dlpeertube\.rainbowswingers\.net|tube\.stanisic\.nl|peer\.suiri\.us|medias\.libox\.fr|videomensoif\.ynh\.fr|peertube\.travelpandas\.eu|peertube\.rachetjay\.fr|peertube\.montecsys\.fr|tube\.eskuero\.me|peer\.tube|peertube\.umeahackerspace\.se|tube\.nx-pod\.de|video\.monsieurbidouille\.fr|tube\.openalgeria\.org|vid\.lelux\.fi|video\.anormallostpod\.ovh|tube\.crapaud-fou\.org|peertube\.stemy\.me|lostpod\.space|exode\.me|peertube\.snargol\.com|vis\.ion\.ovh|videosdulib\.re|v\.mbius\.io|videos\.judrey\.eu|peertube\.osureplayviewer\.xyz|peertube\.mathieufamily\.ovh|www\.videos-libr\.es|fightforinfo\.com|peertube\.fediverse\.ru|peertube\.oiseauroch\.fr|video\.nesven\.eu|v\.bearvideo\.win|video\.qoto\.org|justporn\.cc|video\.vny\.fr|peervideo\.club|tube\.taker\.fr|peertube\.chantierlibre\.org|tube\.ipfixe\.info|tube\.kicou\.info|tube\.dodsorf\.as|videobit\.cc|video\.yukari\.moe|videos\.elbinario\.net|hkvideo\.live|pt\.tux\.tf|www\.hkvideo\.live|FIGHTFORINFO\.com|pt\.765racing\.com|peertube\.gnumeria\.eu\.org|nordenmedia\.com|peertube\.co\.uk|tube\.darfweb\.eu|tube\.kalah-france\.org|0ch\.in|vod\.mochi\.academy|film\.node9\.org|peertube\.hatthieves\.es|video\.fitchfamily\.org|peertube\.ddns\.net|video\.ifuncle\.kr|video\.fdlibre\.eu|tube\.22decembre\.eu|peertube\.harmoniescreatives\.com|tube\.fabrigli\.fr|video\.thedwyers\.co|video\.bruitbruit\.com|peertube\.foxfam\.club|peer\.philoxweb\.be|videos\.bugs\.social|peertube\.malbert\.xyz|peertube\.bilange\.ca|libretube\.net|diytelevision\.com|peertube\.fedilab\.app|libre\.video|video\.mstddntfdn\.online|us\.tv|peertube\.sl-network\.fr|peertube\.dynlinux\.io|peertube\.david\.durieux\.family|peertube\.linuxrocks\.online|peerwatch\.xyz|v\.kretschmann\.social|tube\.otter\.sh|yt\.is\.nota\.live|tube\.dragonpsi\.xyz|peertube\.boneheadmedia\.com|videos\.funkwhale\.audio|watch\.44con\.com|peertube\.gcaillaut\.fr|peertube\.icu|pony\.tube|spacepub\.space|tube\.stbr\.io|v\.mom-gay\.faith|tube\.port0\.xyz|peertube\.simounet\.net|play\.jergefelt\.se|peertube\.zeteo\.me|tube\.danq\.me|peertube\.kerenon\.com|tube\.fab-l3\.org|tube\.calculate\.social|peertube\.mckillop\.org|tube\.netzspielplatz\.de|vod\.ksite\.de|peertube\.laas\.fr|tube\.govital\.net|peertube\.stephenson\.cc|bistule\.nohost\.me|peertube\.kajalinifi\.de|video\.ploud\.jp|video\.omniatv\.com|peertube\.ffs2play\.fr|peertube\.leboulaire\.ovh|peertube\.tronic-studio\.com|peertube\.public\.cat|peertube\.metalbanana\.net|video\.1000i100\.fr|peertube\.alter-nativ-voll\.de|tube\.pasa\.tf|tube\.worldofhauru\.xyz|pt\.kamp\.site|peertube\.teleassist\.fr|videos\.mleduc\.xyz|conf\.tube|media\.privacyinternational\.org|pt\.forty-two\.nl|video\.halle-leaks\.de|video\.grosskopfgames\.de|peertube\.schaeferit\.de|peertube\.jackbot\.fr|tube\.extinctionrebellion\.fr|peertube\.f-si\.org|video\.subak\.ovh|videos\.koweb\.fr|peertube\.zergy\.net|peertube\.roflcopter\.fr|peertube\.floss-marketing-school\.com|vloggers\.social|peertube\.iriseden\.eu|videos\.ubuntu-paris\.org|peertube\.mastodon\.host|armstube\.com|peertube\.s2s\.video|peertube\.lol|tube\.open-plug\.eu|open\.tube|peertube\.ch|peertube\.normandie-libre\.fr|peertube\.slat\.org|video\.lacaveatonton\.ovh|peertube\.uno|peertube\.servebeer\.com|peertube\.fedi\.quebec|tube\.h3z\.jp|tube\.plus200\.com|peertube\.eric\.ovh|tube\.metadocs\.cc|tube\.unmondemeilleur\.eu|gouttedeau\.space|video\.antirep\.net|nrop\.cant\.at|tube\.ksl-bmx\.de|tube\.plaf\.fr|tube\.tchncs\.de|video\.devinberg\.com|hitchtube\.fr|peertube\.kosebamse\.com|yunopeertube\.myddns\.me|peertube\.varney\.fr|peertube\.anon-kenkai\.com|tube\.maiti\.info|tubee\.fr|videos\.dinofly\.com|toobnix\.org|videotape\.me|voca\.tube|video\.heromuster\.com|video\.lemediatv\.fr|video\.up\.edu\.ph|balafon\.video|video\.ivel\.fr|thickrips\.cloud|pt\.laurentkruger\.fr|video\.monarch-pass\.net|peertube\.artica\.center|video\.alternanet\.fr|indymotion\.fr|fanvid\.stopthatimp\.net|video\.farci\.org|v\.lesterpig\.com|video\.okaris\.de|tube\.pawelko\.net|peertube\.mablr\.org|tube\.fede\.re|pytu\.be|evertron\.tv|devtube\.dev-wiki\.de|raptube\.antipub\.org|video\.selea\.se|peertube\.mygaia\.org|video\.oh14\.de|peertube\.livingutopia\.org|peertube\.the-penguin\.de|tube\.thechangebook\.org|tube\.anjara\.eu|pt\.pube\.tk|video\.samedi\.pm|mplayer\.demouliere\.eu|widemus\.de|peertube\.me|peertube\.zapashcanon\.fr|video\.latavernedejohnjohn\.fr|peertube\.pcservice46\.fr|peertube\.mazzonetto\.eu|video\.irem\.univ-paris-diderot\.fr|video\.livecchi\.cloud|alttube\.fr|video\.coop\.tools|video\.cabane-libre\.org|peertube\.openstreetmap\.fr|videos\.alolise\.org|irrsinn\.video|video\.antopie\.org|scitech\.video|tube2\.nemsia\.org|video\.amic37\.fr|peertube\.freeforge\.eu|video\.arbitrarion\.com|video\.datsemultimedia\.com|stoptrackingus\.tv|peertube\.ricostrongxxx\.com|docker\.videos\.lecygnenoir\.info|peertube\.togart\.de|tube\.postblue\.info|videos\.domainepublic\.net|peertube\.cyber-tribal\.com|video\.gresille\.org|peertube\.dsmouse\.net|cinema\.yunohost\.support|tube\.theocevaer\.fr|repro\.video|tube\.4aem\.com|quaziinc\.com|peertube\.metawurst\.space|videos\.wakapo\.com|video\.ploud\.fr|video\.freeradical\.zone|tube\.valinor\.fr|refuznik\.video|pt\.kircheneuenburg\.de|peertube\.asrun\.eu|peertube\.lagob\.fr|videos\.side-ways\.net|91video\.online|video\.valme\.io|video\.taboulisme\.com|videos-libr\.es|tv\.mooh\.fr|nuage\.acostey\.fr|video\.monsieur-a\.fr|peertube\.librelois\.fr|videos\.pair2jeux\.tube|videos\.pueseso\.club|peer\.mathdacloud\.ovh|media\.assassinate-you\.net|vidcommons\.org|ptube\.rousset\.nom\.fr|tube\.cyano\.at|videos\.squat\.net|video\.iphodase\.fr|peertube\.makotoworkshop\.org|peertube\.serveur\.slv-valbonne\.fr|vault\.mle\.party|hostyour\.tv|videos\.hack2g2\.fr|libre\.tube|pire\.artisanlogiciel\.net|videos\.numerique-en-commun\.fr|video\.netsyms\.com|video\.die-partei\.social|video\.writeas\.org|peertube\.swarm\.solvingmaz\.es|tube\.pericoloso\.ovh|watching\.cypherpunk\.observer|videos\.adhocmusic\.com|tube\.rfc1149\.net|peertube\.librelabucm\.org|videos\.numericoop\.fr|peertube\.koehn\.com|peertube\.anarchmusicall\.net|tube\.kampftoast\.de|vid\.y-y\.li|peertube\.xtenz\.xyz|diode\.zone|tube\.egf\.mn|peertube\.nomagic\.uk|visionon\.tv|videos\.koumoul\.com|video\.rastapuls\.com|video\.mantlepro\.com|video\.deadsuperhero\.com|peertube\.musicstudio\.pro|peertube\.we-keys\.fr|artitube\.artifaille\.fr|peertube\.ethernia\.net|tube\.midov\.pl|peertube\.fr|watch\.snoot\.tube|peertube\.donnadieu\.fr|argos\.aquilenet\.fr|tube\.nemsia\.org|tube\.bruniau\.net|videos\.darckoune\.moe|tube\.traydent\.info|dev\.videos\.lecygnenoir\.info|peertube\.nayya\.org|peertube\.live|peertube\.mofgao\.space|video\.lequerrec\.eu|peertube\.amicale\.net|aperi\.tube|tube\.ac-lyon\.fr|video\.lw1\.at|www\.yiny\.org|videos\.pofilo\.fr|tube\.lou\.lt|choob\.h\.etbus\.ch|tube\.hoga\.fr|peertube\.heberge\.fr|video\.obermui\.de|videos\.cloudfrancois\.fr|betamax\.video|video\.typica\.us|tube\.piweb\.be|video\.blender\.org|peertube\.cat|tube\.kdy\.ch|pe\.ertu\.be|peertube\.social|videos\.lescommuns\.org|tv\.datamol\.org|videonaute\.fr|dialup\.express|peertube\.nogafa\.org|megatube\.lilomoino\.fr|peertube\.tamanoir\.foucry\.net|peertube\.devosi\.org|peertube\.1312\.media|tube\.bootlicker\.party|skeptikon\.fr|video\.blueline\.mg|tube\.homecomputing\.fr|tube\.ouahpiti\.info|video\.tedomum\.net|video\.g3l\.org|fontube\.fr|peertube\.gaialabs\.ch|tube\.kher\.nl|peertube\.qtg\.fr|video\.migennes\.net|tube\.p2p\.legal|troll\.tv|videos\.iut-orsay\.fr|peertube\.solidev\.net|videos\.cemea\.org|video\.passageenseine\.fr|videos\.festivalparminous\.org|peertube\.touhoppai\.moe|sikke\.fi|peer\.hostux\.social|share\.tube|peertube\.walkingmountains\.fr|videos\.benpro\.fr|peertube\.parleur\.net|peertube\.heraut\.eu|tube\.aquilenet\.fr|peertube\.gegeweb\.eu|framatube\.org|thinkerview\.video|tube\.conferences-gesticulees\.net|peertube\.datagueule\.tv|video\.lqdn\.fr|tube\.mochi\.academy|media\.zat\.im|video\.colibris-outilslibres\.org|tube\.svnet\.fr|peertube\.video|peertube2\.cpy\.re|peertube3\.cpy\.re|videos\.tcit\.fr|peertube\.cpy\.re|canard\.tube))/(?P<type>(?:a|c|w/p))/(?P<id>[^/]+)`]);
URL_REGEXS.set('vod.ksite.de', [String.raw`(?x)(?:peertube:(?P<host>[^:]+):|https?://(?P<host_2>(?:# Taken from https://instances.joinpeertube.org/instances40two\.tube|a\.metube\.ch|advtv\.ml|algorithmic\.tv|alimulama\.com|arcana\.fun|archive\.vidicon\.org|artefac-paris\.tv|auf1\.eu|battlepenguin\.video|beertube\.epgn\.ch|befree\.nohost\.me|bideoak\.argia\.eus|birkeundnymphe\.de|bitcointv\.com|cattube\.org|clap\.nerv-project\.eu|climatejustice\.video|comf\.tube|conspiracydistillery\.com|darkvapor\.nohost\.me|daschauher\.aksel\.rocks|digitalcourage\.video|dreiecksnebel\.alex-detsch\.de|eduvid\.org|evangelisch\.video|exo\.tube|fair\.tube|fediverse\.tv|film\.k-prod\.fr|flim\.txmn\.tk|fotogramas\.politicaconciencia\.org|ftsi\.ru|gary\.vger\.cloud|graeber\.video|greatview\.video|grypstube\.uni-greifswald\.de|highvoltage\.tv|hpstube\.fr|htp\.live|hyperreal\.tube|juggling\.digital|kino\.kompot\.si|kino\.schuerz\.at|kinowolnosc\.pl|kirche\.peertube-host\.de|kodcast\.com|kolektiva\.media|kraut\.zone|kumi\.tube|lastbreach\.tv|lepetitmayennais\.fr\.nf|lexx\.impa\.me|libertynode\.tv|libra\.syntazia\.org|libremedia\.video|live\.libratoi\.org|live\.nanao\.moe|live\.toobnix\.org|livegram\.net|lolitube\.freedomchan\.moe|lucarne\.balsamine\.be|maindreieck-tv\.de|mani\.tube|manicphase\.me|media\.fsfe\.org|media\.gzevd\.de|media\.inno3\.cricket|media\.kaitaia\.life|media\.krashboyz\.org|media\.over-world\.org|media\.skewed\.de|media\.undeadnetwork\.de|medias\.pingbase\.net|melsungen\.peertube-host\.de|mirametube\.fr|mojotube\.net|monplaisirtube\.ddns\.net|mountaintown\.video|my\.bunny\.cafe|myfreetube\.de|mytube\.kn-cloud\.de|mytube\.madzel\.de|myworkoutarenapeertube\.cf|nanawel-peertube\.dyndns\.org|nastub\.cz|offenes\.tv|orgdup\.media|ovaltube\.codinglab\.ch|p2ptv\.ru|p\.eertu\.be|p\.lu|peer\.azurs\.fr|peertube1\.zeteo\.me|peertube\.020\.pl|peertube\.0x5e\.eu|peertube\.alpharius\.io|peertube\.am-networks\.fr|peertube\.anduin\.net|peertube\.anzui\.dev|peertube\.arbleizez\.bzh|peertube\.art3mis\.de|peertube\.atilla\.org|peertube\.atsuchan\.page|peertube\.aukfood\.net|peertube\.aventer\.biz|peertube\.b38\.rural-it\.org|peertube\.beeldengeluid\.nl|peertube\.be|peertube\.bgzashtita\.es|peertube\.bitsandlinux\.com|peertube\.biz|peertube\.boba\.best|peertube\.br0\.fr|peertube\.bridaahost\.ynh\.fr|peertube\.bubbletea\.dev|peertube\.bubuit\.net|peertube\.cabaal\.net|peertube\.cats-home\.net|peertube\.chemnitz\.freifunk\.net|peertube\.chevro\.fr|peertube\.chrisspiegl\.com|peertube\.chtisurel\.net|peertube\.cipherbliss\.com|peertube\.cloud\.sans\.pub|peertube\.cpge-brizeux\.fr|peertube\.ctseuro\.com|peertube\.cuatrolibertades\.org|peertube\.cybercirujas\.club|peertube\.cythin\.com|peertube\.davigge\.com|peertube\.dc\.pini\.fr|peertube\.debian\.social|peertube\.demonix\.fr|peertube\.designersethiques\.org|peertube\.desmu\.fr|peertube\.devloprog\.org|peertube\.devol\.it|peertube\.dtmf\.ca|peertube\.ecologie\.bzh|peertube\.eu\.org|peertube\.european-pirates\.eu|peertube\.euskarabildua\.eus|peertube\.fenarinarsa\.com|peertube\.fomin\.site|peertube\.forsud\.be|peertube\.francoispelletier\.org|peertube\.freenet\.ru|peertube\.freetalklive\.com|peertube\.functional\.cafe|peertube\.gardeludwig\.fr|peertube\.gargantia\.fr|peertube\.gcfamily\.fr|peertube\.genma\.fr|peertube\.get-racing\.de|peertube\.gidikroon\.eu|peertube\.gruezishop\.ch|peertube\.habets\.house|peertube\.hackerfraternity\.org|peertube\.ichigo\.everydayimshuflin\.com|peertube\.ignifi\.me|peertube\.inapurna\.org|peertube\.informaction\.info|peertube\.interhop\.org|peertube\.iselfhost\.com|peertube\.it|peertube\.jensdiemer\.de|peertube\.joffreyverd\.fr|peertube\.kalua\.im|peertube\.kathryl\.fr|peertube\.keazilla\.net|peertube\.klaewyss\.fr|peertube\.kodcast\.com|peertube\.kx\.studio|peertube\.lagvoid\.com|peertube\.lavallee\.tech|peertube\.le5emeaxe\.fr|peertube\.lestutosdeprocessus\.fr|peertube\.librenet\.co\.za|peertube\.logilab\.fr|peertube\.louisematic\.site|peertube\.luckow\.org|peertube\.luga\.at|peertube\.lyceeconnecte\.fr|peertube\.manalejandro\.com|peertube\.marud\.fr|peertube\.mattone\.net|peertube\.maxweiss\.io|peertube\.monlycee\.net|peertube\.mxinfo\.fr|peertube\.myrasp\.eu|peertube\.nebelcloud\.de|peertube\.netzbegruenung\.de|peertube\.newsocial\.tech|peertube\.nicolastissot\.fr|peertube\.nz|peertube\.offerman\.com|peertube\.opencloud\.lu|peertube\.orthus\.link|peertube\.patapouf\.xyz|peertube\.pi2\.dev|peertube\.plataformess\.org|peertube\.pl|peertube\.portaesgnos\.org|peertube\.r2\.enst\.fr|peertube\.r5c3\.fr|peertube\.radres\.xyz|peertube\.red|peertube\.robonomics\.network|peertube\.rtnkv\.cloud|peertube\.runfox\.tk|peertube\.satoshishop\.de|peertube\.scic-tetris\.org|peertube\.securitymadein\.lu|peertube\.semweb\.pro|peertube\.social\.my-wan\.de|peertube\.soykaf\.org|peertube\.stefofficiel\.me|peertube\.stream|peertube\.su|peertube\.swrs\.net|peertube\.takeko\.cyou|peertube\.tangentfox\.com|peertube\.taxinachtegel\.de|peertube\.thenewoil\.xyz|peertube\.ti-fr\.com|peertube\.tiennot\.net|peertube\.troback\.com|peertube\.tspu\.edu\.ru|peertube\.tux\.ovh|peertube\.tv|peertube\.tweb\.tv|peertube\.ucy\.de|peertube\.underworld\.fr|peertube\.us\.to|peertube\.ventresmous\.fr|peertube\.vlaki\.cz|peertube\.w\.utnw\.de|peertube\.westring\.digital|peertube\.xwiki\.com|peertube\.zoz-serv\.org|peervideo\.ru|periscope\.numenaute\.org|perron-tube\.de|petitlutinartube\.fr|phijkchu\.com|pierre\.tube|piraten\.space|play\.rosano\.ca|player\.ojamajo\.moe|plextube\.nl|pocketnetpeertube1\.nohost\.me|pocketnetpeertube3\.nohost\.me|pocketnetpeertube4\.nohost\.me|pocketnetpeertube5\.nohost\.me|pocketnetpeertube6\.nohost\.me|pt\.24-7\.ro|pt\.apathy\.top|pt\.diaspodon\.fr|pt\.fedi\.tech|pt\.maciej\.website|ptb\.lunarviews\.net|ptmir1\.inter21\.net|ptmir2\.inter21\.net|ptmir3\.inter21\.net|ptmir4\.inter21\.net|ptmir5\.inter21\.net|ptube\.horsentiers\.fr|ptube\.xmanifesto\.club|queermotion\.org|re-wizja\.re-medium\.com|regarder\.sans\.pub|ruraletv\.ovh|s1\.gegenstimme\.tv|s2\.veezee\.tube|sdmtube\.fr|sender-fm\.veezee\.tube|serv1\.wiki-tube\.de|serv3\.wiki-tube\.de|sickstream\.net|sleepy\.tube|sovran\.video|spectra\.video|stream\.elven\.pw|stream\.k-prod\.fr|stream\.shahab\.nohost\.me|streamsource\.video|studios\.racer159\.com|testtube\.florimond\.eu|tgi\.hosted\.spacebear\.ee|thaitube\.in\.th|the\.jokertv\.eu|theater\.ethernia\.net|thecool\.tube|tilvids\.com|toob\.bub\.org|tpaw\.video|truetube\.media|tuba\.lhub\.pl|tube-aix-marseille\.beta\.education\.fr|tube-amiens\.beta\.education\.fr|tube-besancon\.beta\.education\.fr|tube-bordeaux\.beta\.education\.fr|tube-clermont-ferrand\.beta\.education\.fr|tube-corse\.beta\.education\.fr|tube-creteil\.beta\.education\.fr|tube-dijon\.beta\.education\.fr|tube-education\.beta\.education\.fr|tube-grenoble\.beta\.education\.fr|tube-lille\.beta\.education\.fr|tube-limoges\.beta\.education\.fr|tube-montpellier\.beta\.education\.fr|tube-nancy\.beta\.education\.fr|tube-nantes\.beta\.education\.fr|tube-nice\.beta\.education\.fr|tube-normandie\.beta\.education\.fr|tube-orleans-tours\.beta\.education\.fr|tube-outremer\.beta\.education\.fr|tube-paris\.beta\.education\.fr|tube-poitiers\.beta\.education\.fr|tube-reims\.beta\.education\.fr|tube-rennes\.beta\.education\.fr|tube-strasbourg\.beta\.education\.fr|tube-toulouse\.beta\.education\.fr|tube-versailles\.beta\.education\.fr|tube1\.it\.tuwien\.ac\.at|tube\.abolivier\.bzh|tube\.ac-amiens\.fr|tube\.aerztefueraufklaerung\.de|tube\.alexx\.ml|tube\.amic37\.fr|tube\.anufrij\.de|tube\.apolut\.net|tube\.arkhalabs\.io|tube\.arthack\.nz|tube\.as211696\.net|tube\.avensio\.de|tube\.azbyka\.ru|tube\.azkware\.net|tube\.bachaner\.fr|tube\.bmesh\.org|tube\.borked\.host|tube\.bstly\.de|tube\.chaoszone\.tv|tube\.chatelet\.ovh|tube\.cloud-libre\.eu|tube\.cms\.garden|tube\.cowfee\.moe|tube\.cryptography\.dog|tube\.darknight-coffee\.org|tube\.dev\.lhub\.pl|tube\.distrilab\.fr|tube\.dsocialize\.net|tube\.ebin\.club|tube\.fdn\.fr|tube\.florimond\.eu|tube\.foxarmy\.ml|tube\.foxden\.party|tube\.frischesicht\.de|tube\.futuretic\.fr|tube\.gnous\.eu|tube\.grap\.coop|tube\.graz\.social|tube\.grin\.hu|tube\.hackerscop\.org|tube\.hordearii\.fr|tube\.jeena\.net|tube\.kai-stuht\.com|tube\.kockatoo\.org|tube\.kotur\.org|tube\.lacaveatonton\.ovh|tube\.linkse\.media|tube\.lokad\.com|tube\.lucie-philou\.com|tube\.melonbread\.xyz|tube\.mfraters\.net|tube\.motuhake\.xyz|tube\.mrbesen\.de|tube\.nah\.re|tube\.nchoco\.net|tube\.novg\.net|tube\.nox-rhea\.org|tube\.nuagelibre\.fr|tube\.nx12\.net|tube\.octaplex\.net|tube\.odat\.xyz|tube\.oisux\.org|tube\.opportunis\.me|tube\.org\.il|tube\.ortion\.xyz|tube\.others\.social|tube\.picasoft\.net|tube\.plomlompom\.com|tube\.pmj\.rocks|tube\.portes-imaginaire\.org|tube\.pyngu\.com|tube\.rebellion\.global|tube\.rhythms-of-resistance\.org|tube\.rita\.moe|tube\.rsi\.cnr\.it|tube\.s1gm4\.eu|tube\.saumon\.io|tube\.schleuss\.online|tube\.schule\.social|tube\.seditio\.fr|tube\.shanti\.cafe|tube\.shela\.nu|tube\.skrep\.in|tube\.sp-codes\.de|tube\.sp4ke\.com|tube\.superseriousbusiness\.org|tube\.systest\.eu|tube\.tappret\.fr|tube\.tardis\.world|tube\.toontoet\.nl|tube\.tpshd\.de|tube\.troopers\.agency|tube\.tylerdavis\.xyz|tube\.undernet\.uy|tube\.vigilian-consulting\.nl|tube\.vraphim\.com|tube\.wehost\.lgbt|tube\.wien\.rocks|tube\.wolfe\.casa|tube\.xd0\.de|tube\.xy-space\.de|tube\.yapbreak\.fr|tubedu\.org|tubes\.jodh\.us|tuktube\.com|turkum\.me|tututu\.tube|tuvideo\.encanarias\.info|tv1\.cocu\.cc|tv1\.gomntu\.space|tv2\.cocu\.cc|tv\.adn\.life|tv\.atmx\.ca|tv\.bitma\.st|tv\.generallyrubbish\.net\.au|tv\.lumbung\.space|tv\.mattchristiansenmedia\.com|tv\.netwhood\.online|tv\.neue\.city|tv\.piejacker\.net|tv\.pirateradio\.social|tv\.undersco\.re|tvox\.ru|twctube\.twc-zone\.eu|unfilter\.tube|v\.basspistol\.org|v\.kisombrella\.top|v\.lastorder\.xyz|v\.lor\.sh|v\.phreedom\.club|v\.sil\.sh|v\.szy\.io|v\.xxxapex\.com|veezee\.tube|vid\.dascoyote\.xyz|vid\.garwood\.io|vid\.ncrypt\.at|vid\.pravdastalina\.info|vid\.qorg11\.net|vid\.rajeshtaylor\.com|vid\.samtripoli\.com|vid\.werefox\.dev|vid\.wildeboer\.net|video-cave-v2\.de|video\.076\.ne\.jp|video\.1146\.nohost\.me|video\.altertek\.org|video\.anartist\.org|video\.apps\.thedoodleproject\.net|video\.artist\.cx|video\.asgardius\.company|video\.balsillie\.net|video\.bards\.online|video\.binarydad\.com|video\.blast-info\.fr|video\.catgirl\.biz|video\.cigliola\.com|video\.cm-en-transition\.fr|video\.cnt\.social|video\.coales\.co|video\.codingfield\.com|video\.comptoir\.net|video\.comune\.trento\.it|video\.cpn\.so|video\.csc49\.fr|video\.cybre\.town|video\.demokratischer-sommer\.de|video\.discord-insoumis\.fr|video\.dolphincastle\.com|video\.dresden\.network|video\.ecole-89\.com|video\.elgrillolibertario\.org|video\.emergeheart\.info|video\.eradicatinglove\.xyz|video\.ethantheenigma\.me|video\.exodus-privacy\.eu\.org|video\.fbxl\.net|video\.fhtagn\.org|video\.greenmycity\.eu|video\.guerredeclasse\.fr|video\.gyt\.is|video\.hackers\.town|video\.hardlimit\.com|video\.hooli\.co|video\.igem\.org|video\.internet-czas-dzialac\.pl|video\.islameye\.com|video\.kicik\.fr|video\.kuba-orlik\.name|video\.kyushojitsu\.ca|video\.lavolte\.net|video\.lespoesiesdheloise\.fr|video\.liberta\.vip|video\.liege\.bike|video\.linc\.systems|video\.linux\.it|video\.linuxtrent\.it|video\.lokal\.social|video\.lono\.space|video\.lunasqu\.ee|video\.lundi\.am|video\.marcorennmaus\.de|video\.mass-trespass\.uk|video\.mugoreve\.fr|video\.mundodesconocido\.com|video\.mycrowd\.ca|video\.nogafam\.es|video\.odayacres\.farm|video\.ozgurkon\.org|video\.p1ng0ut\.social|video\.p3x\.de|video\.pcf\.fr|video\.pony\.gallery|video\.potate\.space|video\.pourpenser\.pro|video\.progressiv\.dev|video\.resolutions\.it|video\.rw501\.de|video\.screamer\.wiki|video\.sdm-tools\.net|video\.sftblw\.moe|video\.shitposter\.club|video\.skyn3t\.in|video\.soi\.ch|video\.stuartbrand\.co\.uk|video\.thinkof\.name|video\.toot\.pt|video\.triplea\.fr|video\.turbo\.chat|video\.vaku\.org\.ua|video\.veloma\.org|video\.violoncello\.ch|video\.wilkie\.how|video\.wsf2021\.info|videorelay\.co|videos-passages\.huma-num\.fr|videos\.3d-wolf\.com|videos\.ahp-numerique\.fr|videos\.alexandrebadalo\.pt|videos\.archigny\.net|videos\.benjaminbrady\.ie|videos\.buceoluegoexisto\.com|videos\.capas\.se|videos\.casually\.cat|videos\.cloudron\.io|videos\.coletivos\.org|videos\.danksquad\.org|videos\.denshi\.live|videos\.fromouter\.space|videos\.fsci\.in|videos\.globenet\.org|videos\.hauspie\.fr|videos\.hush\.is|videos\.john-livingston\.fr|videos\.jordanwarne\.xyz|videos\.lavoixdessansvoix\.org|videos\.leslionsfloorball\.fr|videos\.lucero\.top|videos\.martyn\.berlin|videos\.mastodont\.cat|videos\.monstro1\.com|videos\.npo\.city|videos\.optoutpod\.com|videos\.petch\.rocks|videos\.pzelawski\.xyz|videos\.rampin\.org|videos\.scanlines\.xyz|videos\.shmalls\.pw|videos\.sibear\.fr|videos\.stadtfabrikanten\.org|videos\.tankernn\.eu|videos\.testimonia\.org|videos\.thisishowidontdisappear\.com|videos\.traumaheilung\.net|videos\.trom\.tf|videos\.wakkerewereld\.nu|videos\.weblib\.re|videos\.yesil\.club|vids\.roshless\.me|vids\.tekdmn\.me|vidz\.dou\.bet|vod\.lumikko\.dev|vs\.uniter\.network|vulgarisation-informatique\.fr|watch\.breadtube\.tv|watch\.deranalyst\.ch|watch\.ignorance\.eu|watch\.krazy\.party|watch\.libertaria\.space|watch\.rt4mn\.org|watch\.softinio\.com|watch\.tubelab\.video|web-fellow\.de|webtv\.vandoeuvre\.net|wechill\.space|wikileaks\.video|wiwi\.video|worldofvids\.com|wwtube\.net|www4\.mir\.inter21\.net|www\.birkeundnymphe\.de|www\.captain-german\.com|www\.wiki-tube\.de|xxivproduction\.video|xxx\.noho\.st|# from youtube-dlpeertube\.rainbowswingers\.net|tube\.stanisic\.nl|peer\.suiri\.us|medias\.libox\.fr|videomensoif\.ynh\.fr|peertube\.travelpandas\.eu|peertube\.rachetjay\.fr|peertube\.montecsys\.fr|tube\.eskuero\.me|peer\.tube|peertube\.umeahackerspace\.se|tube\.nx-pod\.de|video\.monsieurbidouille\.fr|tube\.openalgeria\.org|vid\.lelux\.fi|video\.anormallostpod\.ovh|tube\.crapaud-fou\.org|peertube\.stemy\.me|lostpod\.space|exode\.me|peertube\.snargol\.com|vis\.ion\.ovh|videosdulib\.re|v\.mbius\.io|videos\.judrey\.eu|peertube\.osureplayviewer\.xyz|peertube\.mathieufamily\.ovh|www\.videos-libr\.es|fightforinfo\.com|peertube\.fediverse\.ru|peertube\.oiseauroch\.fr|video\.nesven\.eu|v\.bearvideo\.win|video\.qoto\.org|justporn\.cc|video\.vny\.fr|peervideo\.club|tube\.taker\.fr|peertube\.chantierlibre\.org|tube\.ipfixe\.info|tube\.kicou\.info|tube\.dodsorf\.as|videobit\.cc|video\.yukari\.moe|videos\.elbinario\.net|hkvideo\.live|pt\.tux\.tf|www\.hkvideo\.live|FIGHTFORINFO\.com|pt\.765racing\.com|peertube\.gnumeria\.eu\.org|nordenmedia\.com|peertube\.co\.uk|tube\.darfweb\.eu|tube\.kalah-france\.org|0ch\.in|vod\.mochi\.academy|film\.node9\.org|peertube\.hatthieves\.es|video\.fitchfamily\.org|peertube\.ddns\.net|video\.ifuncle\.kr|video\.fdlibre\.eu|tube\.22decembre\.eu|peertube\.harmoniescreatives\.com|tube\.fabrigli\.fr|video\.thedwyers\.co|video\.bruitbruit\.com|peertube\.foxfam\.club|peer\.philoxweb\.be|videos\.bugs\.social|peertube\.malbert\.xyz|peertube\.bilange\.ca|libretube\.net|diytelevision\.com|peertube\.fedilab\.app|libre\.video|video\.mstddntfdn\.online|us\.tv|peertube\.sl-network\.fr|peertube\.dynlinux\.io|peertube\.david\.durieux\.family|peertube\.linuxrocks\.online|peerwatch\.xyz|v\.kretschmann\.social|tube\.otter\.sh|yt\.is\.nota\.live|tube\.dragonpsi\.xyz|peertube\.boneheadmedia\.com|videos\.funkwhale\.audio|watch\.44con\.com|peertube\.gcaillaut\.fr|peertube\.icu|pony\.tube|spacepub\.space|tube\.stbr\.io|v\.mom-gay\.faith|tube\.port0\.xyz|peertube\.simounet\.net|play\.jergefelt\.se|peertube\.zeteo\.me|tube\.danq\.me|peertube\.kerenon\.com|tube\.fab-l3\.org|tube\.calculate\.social|peertube\.mckillop\.org|tube\.netzspielplatz\.de|vod\.ksite\.de|peertube\.laas\.fr|tube\.govital\.net|peertube\.stephenson\.cc|bistule\.nohost\.me|peertube\.kajalinifi\.de|video\.ploud\.jp|video\.omniatv\.com|peertube\.ffs2play\.fr|peertube\.leboulaire\.ovh|peertube\.tronic-studio\.com|peertube\.public\.cat|peertube\.metalbanana\.net|video\.1000i100\.fr|peertube\.alter-nativ-voll\.de|tube\.pasa\.tf|tube\.worldofhauru\.xyz|pt\.kamp\.site|peertube\.teleassist\.fr|videos\.mleduc\.xyz|conf\.tube|media\.privacyinternational\.org|pt\.forty-two\.nl|video\.halle-leaks\.de|video\.grosskopfgames\.de|peertube\.schaeferit\.de|peertube\.jackbot\.fr|tube\.extinctionrebellion\.fr|peertube\.f-si\.org|video\.subak\.ovh|videos\.koweb\.fr|peertube\.zergy\.net|peertube\.roflcopter\.fr|peertube\.floss-marketing-school\.com|vloggers\.social|peertube\.iriseden\.eu|videos\.ubuntu-paris\.org|peertube\.mastodon\.host|armstube\.com|peertube\.s2s\.video|peertube\.lol|tube\.open-plug\.eu|open\.tube|peertube\.ch|peertube\.normandie-libre\.fr|peertube\.slat\.org|video\.lacaveatonton\.ovh|peertube\.uno|peertube\.servebeer\.com|peertube\.fedi\.quebec|tube\.h3z\.jp|tube\.plus200\.com|peertube\.eric\.ovh|tube\.metadocs\.cc|tube\.unmondemeilleur\.eu|gouttedeau\.space|video\.antirep\.net|nrop\.cant\.at|tube\.ksl-bmx\.de|tube\.plaf\.fr|tube\.tchncs\.de|video\.devinberg\.com|hitchtube\.fr|peertube\.kosebamse\.com|yunopeertube\.myddns\.me|peertube\.varney\.fr|peertube\.anon-kenkai\.com|tube\.maiti\.info|tubee\.fr|videos\.dinofly\.com|toobnix\.org|videotape\.me|voca\.tube|video\.heromuster\.com|video\.lemediatv\.fr|video\.up\.edu\.ph|balafon\.video|video\.ivel\.fr|thickrips\.cloud|pt\.laurentkruger\.fr|video\.monarch-pass\.net|peertube\.artica\.center|video\.alternanet\.fr|indymotion\.fr|fanvid\.stopthatimp\.net|video\.farci\.org|v\.lesterpig\.com|video\.okaris\.de|tube\.pawelko\.net|peertube\.mablr\.org|tube\.fede\.re|pytu\.be|evertron\.tv|devtube\.dev-wiki\.de|raptube\.antipub\.org|video\.selea\.se|peertube\.mygaia\.org|video\.oh14\.de|peertube\.livingutopia\.org|peertube\.the-penguin\.de|tube\.thechangebook\.org|tube\.anjara\.eu|pt\.pube\.tk|video\.samedi\.pm|mplayer\.demouliere\.eu|widemus\.de|peertube\.me|peertube\.zapashcanon\.fr|video\.latavernedejohnjohn\.fr|peertube\.pcservice46\.fr|peertube\.mazzonetto\.eu|video\.irem\.univ-paris-diderot\.fr|video\.livecchi\.cloud|alttube\.fr|video\.coop\.tools|video\.cabane-libre\.org|peertube\.openstreetmap\.fr|videos\.alolise\.org|irrsinn\.video|video\.antopie\.org|scitech\.video|tube2\.nemsia\.org|video\.amic37\.fr|peertube\.freeforge\.eu|video\.arbitrarion\.com|video\.datsemultimedia\.com|stoptrackingus\.tv|peertube\.ricostrongxxx\.com|docker\.videos\.lecygnenoir\.info|peertube\.togart\.de|tube\.postblue\.info|videos\.domainepublic\.net|peertube\.cyber-tribal\.com|video\.gresille\.org|peertube\.dsmouse\.net|cinema\.yunohost\.support|tube\.theocevaer\.fr|repro\.video|tube\.4aem\.com|quaziinc\.com|peertube\.metawurst\.space|videos\.wakapo\.com|video\.ploud\.fr|video\.freeradical\.zone|tube\.valinor\.fr|refuznik\.video|pt\.kircheneuenburg\.de|peertube\.asrun\.eu|peertube\.lagob\.fr|videos\.side-ways\.net|91video\.online|video\.valme\.io|video\.taboulisme\.com|videos-libr\.es|tv\.mooh\.fr|nuage\.acostey\.fr|video\.monsieur-a\.fr|peertube\.librelois\.fr|videos\.pair2jeux\.tube|videos\.pueseso\.club|peer\.mathdacloud\.ovh|media\.assassinate-you\.net|vidcommons\.org|ptube\.rousset\.nom\.fr|tube\.cyano\.at|videos\.squat\.net|video\.iphodase\.fr|peertube\.makotoworkshop\.org|peertube\.serveur\.slv-valbonne\.fr|vault\.mle\.party|hostyour\.tv|videos\.hack2g2\.fr|libre\.tube|pire\.artisanlogiciel\.net|videos\.numerique-en-commun\.fr|video\.netsyms\.com|video\.die-partei\.social|video\.writeas\.org|peertube\.swarm\.solvingmaz\.es|tube\.pericoloso\.ovh|watching\.cypherpunk\.observer|videos\.adhocmusic\.com|tube\.rfc1149\.net|peertube\.librelabucm\.org|videos\.numericoop\.fr|peertube\.koehn\.com|peertube\.anarchmusicall\.net|tube\.kampftoast\.de|vid\.y-y\.li|peertube\.xtenz\.xyz|diode\.zone|tube\.egf\.mn|peertube\.nomagic\.uk|visionon\.tv|videos\.koumoul\.com|video\.rastapuls\.com|video\.mantlepro\.com|video\.deadsuperhero\.com|peertube\.musicstudio\.pro|peertube\.we-keys\.fr|artitube\.artifaille\.fr|peertube\.ethernia\.net|tube\.midov\.pl|peertube\.fr|watch\.snoot\.tube|peertube\.donnadieu\.fr|argos\.aquilenet\.fr|tube\.nemsia\.org|tube\.bruniau\.net|videos\.darckoune\.moe|tube\.traydent\.info|dev\.videos\.lecygnenoir\.info|peertube\.nayya\.org|peertube\.live|peertube\.mofgao\.space|video\.lequerrec\.eu|peertube\.amicale\.net|aperi\.tube|tube\.ac-lyon\.fr|video\.lw1\.at|www\.yiny\.org|videos\.pofilo\.fr|tube\.lou\.lt|choob\.h\.etbus\.ch|tube\.hoga\.fr|peertube\.heberge\.fr|video\.obermui\.de|videos\.cloudfrancois\.fr|betamax\.video|video\.typica\.us|tube\.piweb\.be|video\.blender\.org|peertube\.cat|tube\.kdy\.ch|pe\.ertu\.be|peertube\.social|videos\.lescommuns\.org|tv\.datamol\.org|videonaute\.fr|dialup\.express|peertube\.nogafa\.org|megatube\.lilomoino\.fr|peertube\.tamanoir\.foucry\.net|peertube\.devosi\.org|peertube\.1312\.media|tube\.bootlicker\.party|skeptikon\.fr|video\.blueline\.mg|tube\.homecomputing\.fr|tube\.ouahpiti\.info|video\.tedomum\.net|video\.g3l\.org|fontube\.fr|peertube\.gaialabs\.ch|tube\.kher\.nl|peertube\.qtg\.fr|video\.migennes\.net|tube\.p2p\.legal|troll\.tv|videos\.iut-orsay\.fr|peertube\.solidev\.net|videos\.cemea\.org|video\.passageenseine\.fr|videos\.festivalparminous\.org|peertube\.touhoppai\.moe|sikke\.fi|peer\.hostux\.social|share\.tube|peertube\.walkingmountains\.fr|videos\.benpro\.fr|peertube\.parleur\.net|peertube\.heraut\.eu|tube\.aquilenet\.fr|peertube\.gegeweb\.eu|framatube\.org|thinkerview\.video|tube\.conferences-gesticulees\.net|peertube\.datagueule\.tv|video\.lqdn\.fr|tube\.mochi\.academy|media\.zat\.im|video\.colibris-outilslibres\.org|tube\.svnet\.fr|peertube\.video|peertube2\.cpy\.re|peertube3\.cpy\.re|videos\.tcit\.fr|peertube\.cpy\.re|canard\.tube))/(?:videos/(?:watch|embed)|api/v\d/videos|w)/)(?P<id>[\da-zA-Z]{22}|[\da-fA-F]{8}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{12})`]);
URL_REGEXS.set('peertube.tv', [String.raw`(?x)(?:peertube:(?P<host>[^:]+):|https?://(?P<host_2>(?:# Taken from https://instances.joinpeertube.org/instances40two\.tube|a\.metube\.ch|advtv\.ml|algorithmic\.tv|alimulama\.com|arcana\.fun|archive\.vidicon\.org|artefac-paris\.tv|auf1\.eu|battlepenguin\.video|beertube\.epgn\.ch|befree\.nohost\.me|bideoak\.argia\.eus|birkeundnymphe\.de|bitcointv\.com|cattube\.org|clap\.nerv-project\.eu|climatejustice\.video|comf\.tube|conspiracydistillery\.com|darkvapor\.nohost\.me|daschauher\.aksel\.rocks|digitalcourage\.video|dreiecksnebel\.alex-detsch\.de|eduvid\.org|evangelisch\.video|exo\.tube|fair\.tube|fediverse\.tv|film\.k-prod\.fr|flim\.txmn\.tk|fotogramas\.politicaconciencia\.org|ftsi\.ru|gary\.vger\.cloud|graeber\.video|greatview\.video|grypstube\.uni-greifswald\.de|highvoltage\.tv|hpstube\.fr|htp\.live|hyperreal\.tube|juggling\.digital|kino\.kompot\.si|kino\.schuerz\.at|kinowolnosc\.pl|kirche\.peertube-host\.de|kodcast\.com|kolektiva\.media|kraut\.zone|kumi\.tube|lastbreach\.tv|lepetitmayennais\.fr\.nf|lexx\.impa\.me|libertynode\.tv|libra\.syntazia\.org|libremedia\.video|live\.libratoi\.org|live\.nanao\.moe|live\.toobnix\.org|livegram\.net|lolitube\.freedomchan\.moe|lucarne\.balsamine\.be|maindreieck-tv\.de|mani\.tube|manicphase\.me|media\.fsfe\.org|media\.gzevd\.de|media\.inno3\.cricket|media\.kaitaia\.life|media\.krashboyz\.org|media\.over-world\.org|media\.skewed\.de|media\.undeadnetwork\.de|medias\.pingbase\.net|melsungen\.peertube-host\.de|mirametube\.fr|mojotube\.net|monplaisirtube\.ddns\.net|mountaintown\.video|my\.bunny\.cafe|myfreetube\.de|mytube\.kn-cloud\.de|mytube\.madzel\.de|myworkoutarenapeertube\.cf|nanawel-peertube\.dyndns\.org|nastub\.cz|offenes\.tv|orgdup\.media|ovaltube\.codinglab\.ch|p2ptv\.ru|p\.eertu\.be|p\.lu|peer\.azurs\.fr|peertube1\.zeteo\.me|peertube\.020\.pl|peertube\.0x5e\.eu|peertube\.alpharius\.io|peertube\.am-networks\.fr|peertube\.anduin\.net|peertube\.anzui\.dev|peertube\.arbleizez\.bzh|peertube\.art3mis\.de|peertube\.atilla\.org|peertube\.atsuchan\.page|peertube\.aukfood\.net|peertube\.aventer\.biz|peertube\.b38\.rural-it\.org|peertube\.beeldengeluid\.nl|peertube\.be|peertube\.bgzashtita\.es|peertube\.bitsandlinux\.com|peertube\.biz|peertube\.boba\.best|peertube\.br0\.fr|peertube\.bridaahost\.ynh\.fr|peertube\.bubbletea\.dev|peertube\.bubuit\.net|peertube\.cabaal\.net|peertube\.cats-home\.net|peertube\.chemnitz\.freifunk\.net|peertube\.chevro\.fr|peertube\.chrisspiegl\.com|peertube\.chtisurel\.net|peertube\.cipherbliss\.com|peertube\.cloud\.sans\.pub|peertube\.cpge-brizeux\.fr|peertube\.ctseuro\.com|peertube\.cuatrolibertades\.org|peertube\.cybercirujas\.club|peertube\.cythin\.com|peertube\.davigge\.com|peertube\.dc\.pini\.fr|peertube\.debian\.social|peertube\.demonix\.fr|peertube\.designersethiques\.org|peertube\.desmu\.fr|peertube\.devloprog\.org|peertube\.devol\.it|peertube\.dtmf\.ca|peertube\.ecologie\.bzh|peertube\.eu\.org|peertube\.european-pirates\.eu|peertube\.euskarabildua\.eus|peertube\.fenarinarsa\.com|peertube\.fomin\.site|peertube\.forsud\.be|peertube\.francoispelletier\.org|peertube\.freenet\.ru|peertube\.freetalklive\.com|peertube\.functional\.cafe|peertube\.gardeludwig\.fr|peertube\.gargantia\.fr|peertube\.gcfamily\.fr|peertube\.genma\.fr|peertube\.get-racing\.de|peertube\.gidikroon\.eu|peertube\.gruezishop\.ch|peertube\.habets\.house|peertube\.hackerfraternity\.org|peertube\.ichigo\.everydayimshuflin\.com|peertube\.ignifi\.me|peertube\.inapurna\.org|peertube\.informaction\.info|peertube\.interhop\.org|peertube\.iselfhost\.com|peertube\.it|peertube\.jensdiemer\.de|peertube\.joffreyverd\.fr|peertube\.kalua\.im|peertube\.kathryl\.fr|peertube\.keazilla\.net|peertube\.klaewyss\.fr|peertube\.kodcast\.com|peertube\.kx\.studio|peertube\.lagvoid\.com|peertube\.lavallee\.tech|peertube\.le5emeaxe\.fr|peertube\.lestutosdeprocessus\.fr|peertube\.librenet\.co\.za|peertube\.logilab\.fr|peertube\.louisematic\.site|peertube\.luckow\.org|peertube\.luga\.at|peertube\.lyceeconnecte\.fr|peertube\.manalejandro\.com|peertube\.marud\.fr|peertube\.mattone\.net|peertube\.maxweiss\.io|peertube\.monlycee\.net|peertube\.mxinfo\.fr|peertube\.myrasp\.eu|peertube\.nebelcloud\.de|peertube\.netzbegruenung\.de|peertube\.newsocial\.tech|peertube\.nicolastissot\.fr|peertube\.nz|peertube\.offerman\.com|peertube\.opencloud\.lu|peertube\.orthus\.link|peertube\.patapouf\.xyz|peertube\.pi2\.dev|peertube\.plataformess\.org|peertube\.pl|peertube\.portaesgnos\.org|peertube\.r2\.enst\.fr|peertube\.r5c3\.fr|peertube\.radres\.xyz|peertube\.red|peertube\.robonomics\.network|peertube\.rtnkv\.cloud|peertube\.runfox\.tk|peertube\.satoshishop\.de|peertube\.scic-tetris\.org|peertube\.securitymadein\.lu|peertube\.semweb\.pro|peertube\.social\.my-wan\.de|peertube\.soykaf\.org|peertube\.stefofficiel\.me|peertube\.stream|peertube\.su|peertube\.swrs\.net|peertube\.takeko\.cyou|peertube\.tangentfox\.com|peertube\.taxinachtegel\.de|peertube\.thenewoil\.xyz|peertube\.ti-fr\.com|peertube\.tiennot\.net|peertube\.troback\.com|peertube\.tspu\.edu\.ru|peertube\.tux\.ovh|peertube\.tv|peertube\.tweb\.tv|peertube\.ucy\.de|peertube\.underworld\.fr|peertube\.us\.to|peertube\.ventresmous\.fr|peertube\.vlaki\.cz|peertube\.w\.utnw\.de|peertube\.westring\.digital|peertube\.xwiki\.com|peertube\.zoz-serv\.org|peervideo\.ru|periscope\.numenaute\.org|perron-tube\.de|petitlutinartube\.fr|phijkchu\.com|pierre\.tube|piraten\.space|play\.rosano\.ca|player\.ojamajo\.moe|plextube\.nl|pocketnetpeertube1\.nohost\.me|pocketnetpeertube3\.nohost\.me|pocketnetpeertube4\.nohost\.me|pocketnetpeertube5\.nohost\.me|pocketnetpeertube6\.nohost\.me|pt\.24-7\.ro|pt\.apathy\.top|pt\.diaspodon\.fr|pt\.fedi\.tech|pt\.maciej\.website|ptb\.lunarviews\.net|ptmir1\.inter21\.net|ptmir2\.inter21\.net|ptmir3\.inter21\.net|ptmir4\.inter21\.net|ptmir5\.inter21\.net|ptube\.horsentiers\.fr|ptube\.xmanifesto\.club|queermotion\.org|re-wizja\.re-medium\.com|regarder\.sans\.pub|ruraletv\.ovh|s1\.gegenstimme\.tv|s2\.veezee\.tube|sdmtube\.fr|sender-fm\.veezee\.tube|serv1\.wiki-tube\.de|serv3\.wiki-tube\.de|sickstream\.net|sleepy\.tube|sovran\.video|spectra\.video|stream\.elven\.pw|stream\.k-prod\.fr|stream\.shahab\.nohost\.me|streamsource\.video|studios\.racer159\.com|testtube\.florimond\.eu|tgi\.hosted\.spacebear\.ee|thaitube\.in\.th|the\.jokertv\.eu|theater\.ethernia\.net|thecool\.tube|tilvids\.com|toob\.bub\.org|tpaw\.video|truetube\.media|tuba\.lhub\.pl|tube-aix-marseille\.beta\.education\.fr|tube-amiens\.beta\.education\.fr|tube-besancon\.beta\.education\.fr|tube-bordeaux\.beta\.education\.fr|tube-clermont-ferrand\.beta\.education\.fr|tube-corse\.beta\.education\.fr|tube-creteil\.beta\.education\.fr|tube-dijon\.beta\.education\.fr|tube-education\.beta\.education\.fr|tube-grenoble\.beta\.education\.fr|tube-lille\.beta\.education\.fr|tube-limoges\.beta\.education\.fr|tube-montpellier\.beta\.education\.fr|tube-nancy\.beta\.education\.fr|tube-nantes\.beta\.education\.fr|tube-nice\.beta\.education\.fr|tube-normandie\.beta\.education\.fr|tube-orleans-tours\.beta\.education\.fr|tube-outremer\.beta\.education\.fr|tube-paris\.beta\.education\.fr|tube-poitiers\.beta\.education\.fr|tube-reims\.beta\.education\.fr|tube-rennes\.beta\.education\.fr|tube-strasbourg\.beta\.education\.fr|tube-toulouse\.beta\.education\.fr|tube-versailles\.beta\.education\.fr|tube1\.it\.tuwien\.ac\.at|tube\.abolivier\.bzh|tube\.ac-amiens\.fr|tube\.aerztefueraufklaerung\.de|tube\.alexx\.ml|tube\.amic37\.fr|tube\.anufrij\.de|tube\.apolut\.net|tube\.arkhalabs\.io|tube\.arthack\.nz|tube\.as211696\.net|tube\.avensio\.de|tube\.azbyka\.ru|tube\.azkware\.net|tube\.bachaner\.fr|tube\.bmesh\.org|tube\.borked\.host|tube\.bstly\.de|tube\.chaoszone\.tv|tube\.chatelet\.ovh|tube\.cloud-libre\.eu|tube\.cms\.garden|tube\.cowfee\.moe|tube\.cryptography\.dog|tube\.darknight-coffee\.org|tube\.dev\.lhub\.pl|tube\.distrilab\.fr|tube\.dsocialize\.net|tube\.ebin\.club|tube\.fdn\.fr|tube\.florimond\.eu|tube\.foxarmy\.ml|tube\.foxden\.party|tube\.frischesicht\.de|tube\.futuretic\.fr|tube\.gnous\.eu|tube\.grap\.coop|tube\.graz\.social|tube\.grin\.hu|tube\.hackerscop\.org|tube\.hordearii\.fr|tube\.jeena\.net|tube\.kai-stuht\.com|tube\.kockatoo\.org|tube\.kotur\.org|tube\.lacaveatonton\.ovh|tube\.linkse\.media|tube\.lokad\.com|tube\.lucie-philou\.com|tube\.melonbread\.xyz|tube\.mfraters\.net|tube\.motuhake\.xyz|tube\.mrbesen\.de|tube\.nah\.re|tube\.nchoco\.net|tube\.novg\.net|tube\.nox-rhea\.org|tube\.nuagelibre\.fr|tube\.nx12\.net|tube\.octaplex\.net|tube\.odat\.xyz|tube\.oisux\.org|tube\.opportunis\.me|tube\.org\.il|tube\.ortion\.xyz|tube\.others\.social|tube\.picasoft\.net|tube\.plomlompom\.com|tube\.pmj\.rocks|tube\.portes-imaginaire\.org|tube\.pyngu\.com|tube\.rebellion\.global|tube\.rhythms-of-resistance\.org|tube\.rita\.moe|tube\.rsi\.cnr\.it|tube\.s1gm4\.eu|tube\.saumon\.io|tube\.schleuss\.online|tube\.schule\.social|tube\.seditio\.fr|tube\.shanti\.cafe|tube\.shela\.nu|tube\.skrep\.in|tube\.sp-codes\.de|tube\.sp4ke\.com|tube\.superseriousbusiness\.org|tube\.systest\.eu|tube\.tappret\.fr|tube\.tardis\.world|tube\.toontoet\.nl|tube\.tpshd\.de|tube\.troopers\.agency|tube\.tylerdavis\.xyz|tube\.undernet\.uy|tube\.vigilian-consulting\.nl|tube\.vraphim\.com|tube\.wehost\.lgbt|tube\.wien\.rocks|tube\.wolfe\.casa|tube\.xd0\.de|tube\.xy-space\.de|tube\.yapbreak\.fr|tubedu\.org|tubes\.jodh\.us|tuktube\.com|turkum\.me|tututu\.tube|tuvideo\.encanarias\.info|tv1\.cocu\.cc|tv1\.gomntu\.space|tv2\.cocu\.cc|tv\.adn\.life|tv\.atmx\.ca|tv\.bitma\.st|tv\.generallyrubbish\.net\.au|tv\.lumbung\.space|tv\.mattchristiansenmedia\.com|tv\.netwhood\.online|tv\.neue\.city|tv\.piejacker\.net|tv\.pirateradio\.social|tv\.undersco\.re|tvox\.ru|twctube\.twc-zone\.eu|unfilter\.tube|v\.basspistol\.org|v\.kisombrella\.top|v\.lastorder\.xyz|v\.lor\.sh|v\.phreedom\.club|v\.sil\.sh|v\.szy\.io|v\.xxxapex\.com|veezee\.tube|vid\.dascoyote\.xyz|vid\.garwood\.io|vid\.ncrypt\.at|vid\.pravdastalina\.info|vid\.qorg11\.net|vid\.rajeshtaylor\.com|vid\.samtripoli\.com|vid\.werefox\.dev|vid\.wildeboer\.net|video-cave-v2\.de|video\.076\.ne\.jp|video\.1146\.nohost\.me|video\.altertek\.org|video\.anartist\.org|video\.apps\.thedoodleproject\.net|video\.artist\.cx|video\.asgardius\.company|video\.balsillie\.net|video\.bards\.online|video\.binarydad\.com|video\.blast-info\.fr|video\.catgirl\.biz|video\.cigliola\.com|video\.cm-en-transition\.fr|video\.cnt\.social|video\.coales\.co|video\.codingfield\.com|video\.comptoir\.net|video\.comune\.trento\.it|video\.cpn\.so|video\.csc49\.fr|video\.cybre\.town|video\.demokratischer-sommer\.de|video\.discord-insoumis\.fr|video\.dolphincastle\.com|video\.dresden\.network|video\.ecole-89\.com|video\.elgrillolibertario\.org|video\.emergeheart\.info|video\.eradicatinglove\.xyz|video\.ethantheenigma\.me|video\.exodus-privacy\.eu\.org|video\.fbxl\.net|video\.fhtagn\.org|video\.greenmycity\.eu|video\.guerredeclasse\.fr|video\.gyt\.is|video\.hackers\.town|video\.hardlimit\.com|video\.hooli\.co|video\.igem\.org|video\.internet-czas-dzialac\.pl|video\.islameye\.com|video\.kicik\.fr|video\.kuba-orlik\.name|video\.kyushojitsu\.ca|video\.lavolte\.net|video\.lespoesiesdheloise\.fr|video\.liberta\.vip|video\.liege\.bike|video\.linc\.systems|video\.linux\.it|video\.linuxtrent\.it|video\.lokal\.social|video\.lono\.space|video\.lunasqu\.ee|video\.lundi\.am|video\.marcorennmaus\.de|video\.mass-trespass\.uk|video\.mugoreve\.fr|video\.mundodesconocido\.com|video\.mycrowd\.ca|video\.nogafam\.es|video\.odayacres\.farm|video\.ozgurkon\.org|video\.p1ng0ut\.social|video\.p3x\.de|video\.pcf\.fr|video\.pony\.gallery|video\.potate\.space|video\.pourpenser\.pro|video\.progressiv\.dev|video\.resolutions\.it|video\.rw501\.de|video\.screamer\.wiki|video\.sdm-tools\.net|video\.sftblw\.moe|video\.shitposter\.club|video\.skyn3t\.in|video\.soi\.ch|video\.stuartbrand\.co\.uk|video\.thinkof\.name|video\.toot\.pt|video\.triplea\.fr|video\.turbo\.chat|video\.vaku\.org\.ua|video\.veloma\.org|video\.violoncello\.ch|video\.wilkie\.how|video\.wsf2021\.info|videorelay\.co|videos-passages\.huma-num\.fr|videos\.3d-wolf\.com|videos\.ahp-numerique\.fr|videos\.alexandrebadalo\.pt|videos\.archigny\.net|videos\.benjaminbrady\.ie|videos\.buceoluegoexisto\.com|videos\.capas\.se|videos\.casually\.cat|videos\.cloudron\.io|videos\.coletivos\.org|videos\.danksquad\.org|videos\.denshi\.live|videos\.fromouter\.space|videos\.fsci\.in|videos\.globenet\.org|videos\.hauspie\.fr|videos\.hush\.is|videos\.john-livingston\.fr|videos\.jordanwarne\.xyz|videos\.lavoixdessansvoix\.org|videos\.leslionsfloorball\.fr|videos\.lucero\.top|videos\.martyn\.berlin|videos\.mastodont\.cat|videos\.monstro1\.com|videos\.npo\.city|videos\.optoutpod\.com|videos\.petch\.rocks|videos\.pzelawski\.xyz|videos\.rampin\.org|videos\.scanlines\.xyz|videos\.shmalls\.pw|videos\.sibear\.fr|videos\.stadtfabrikanten\.org|videos\.tankernn\.eu|videos\.testimonia\.org|videos\.thisishowidontdisappear\.com|videos\.traumaheilung\.net|videos\.trom\.tf|videos\.wakkerewereld\.nu|videos\.weblib\.re|videos\.yesil\.club|vids\.roshless\.me|vids\.tekdmn\.me|vidz\.dou\.bet|vod\.lumikko\.dev|vs\.uniter\.network|vulgarisation-informatique\.fr|watch\.breadtube\.tv|watch\.deranalyst\.ch|watch\.ignorance\.eu|watch\.krazy\.party|watch\.libertaria\.space|watch\.rt4mn\.org|watch\.softinio\.com|watch\.tubelab\.video|web-fellow\.de|webtv\.vandoeuvre\.net|wechill\.space|wikileaks\.video|wiwi\.video|worldofvids\.com|wwtube\.net|www4\.mir\.inter21\.net|www\.birkeundnymphe\.de|www\.captain-german\.com|www\.wiki-tube\.de|xxivproduction\.video|xxx\.noho\.st|# from youtube-dlpeertube\.rainbowswingers\.net|tube\.stanisic\.nl|peer\.suiri\.us|medias\.libox\.fr|videomensoif\.ynh\.fr|peertube\.travelpandas\.eu|peertube\.rachetjay\.fr|peertube\.montecsys\.fr|tube\.eskuero\.me|peer\.tube|peertube\.umeahackerspace\.se|tube\.nx-pod\.de|video\.monsieurbidouille\.fr|tube\.openalgeria\.org|vid\.lelux\.fi|video\.anormallostpod\.ovh|tube\.crapaud-fou\.org|peertube\.stemy\.me|lostpod\.space|exode\.me|peertube\.snargol\.com|vis\.ion\.ovh|videosdulib\.re|v\.mbius\.io|videos\.judrey\.eu|peertube\.osureplayviewer\.xyz|peertube\.mathieufamily\.ovh|www\.videos-libr\.es|fightforinfo\.com|peertube\.fediverse\.ru|peertube\.oiseauroch\.fr|video\.nesven\.eu|v\.bearvideo\.win|video\.qoto\.org|justporn\.cc|video\.vny\.fr|peervideo\.club|tube\.taker\.fr|peertube\.chantierlibre\.org|tube\.ipfixe\.info|tube\.kicou\.info|tube\.dodsorf\.as|videobit\.cc|video\.yukari\.moe|videos\.elbinario\.net|hkvideo\.live|pt\.tux\.tf|www\.hkvideo\.live|FIGHTFORINFO\.com|pt\.765racing\.com|peertube\.gnumeria\.eu\.org|nordenmedia\.com|peertube\.co\.uk|tube\.darfweb\.eu|tube\.kalah-france\.org|0ch\.in|vod\.mochi\.academy|film\.node9\.org|peertube\.hatthieves\.es|video\.fitchfamily\.org|peertube\.ddns\.net|video\.ifuncle\.kr|video\.fdlibre\.eu|tube\.22decembre\.eu|peertube\.harmoniescreatives\.com|tube\.fabrigli\.fr|video\.thedwyers\.co|video\.bruitbruit\.com|peertube\.foxfam\.club|peer\.philoxweb\.be|videos\.bugs\.social|peertube\.malbert\.xyz|peertube\.bilange\.ca|libretube\.net|diytelevision\.com|peertube\.fedilab\.app|libre\.video|video\.mstddntfdn\.online|us\.tv|peertube\.sl-network\.fr|peertube\.dynlinux\.io|peertube\.david\.durieux\.family|peertube\.linuxrocks\.online|peerwatch\.xyz|v\.kretschmann\.social|tube\.otter\.sh|yt\.is\.nota\.live|tube\.dragonpsi\.xyz|peertube\.boneheadmedia\.com|videos\.funkwhale\.audio|watch\.44con\.com|peertube\.gcaillaut\.fr|peertube\.icu|pony\.tube|spacepub\.space|tube\.stbr\.io|v\.mom-gay\.faith|tube\.port0\.xyz|peertube\.simounet\.net|play\.jergefelt\.se|peertube\.zeteo\.me|tube\.danq\.me|peertube\.kerenon\.com|tube\.fab-l3\.org|tube\.calculate\.social|peertube\.mckillop\.org|tube\.netzspielplatz\.de|vod\.ksite\.de|peertube\.laas\.fr|tube\.govital\.net|peertube\.stephenson\.cc|bistule\.nohost\.me|peertube\.kajalinifi\.de|video\.ploud\.jp|video\.omniatv\.com|peertube\.ffs2play\.fr|peertube\.leboulaire\.ovh|peertube\.tronic-studio\.com|peertube\.public\.cat|peertube\.metalbanana\.net|video\.1000i100\.fr|peertube\.alter-nativ-voll\.de|tube\.pasa\.tf|tube\.worldofhauru\.xyz|pt\.kamp\.site|peertube\.teleassist\.fr|videos\.mleduc\.xyz|conf\.tube|media\.privacyinternational\.org|pt\.forty-two\.nl|video\.halle-leaks\.de|video\.grosskopfgames\.de|peertube\.schaeferit\.de|peertube\.jackbot\.fr|tube\.extinctionrebellion\.fr|peertube\.f-si\.org|video\.subak\.ovh|videos\.koweb\.fr|peertube\.zergy\.net|peertube\.roflcopter\.fr|peertube\.floss-marketing-school\.com|vloggers\.social|peertube\.iriseden\.eu|videos\.ubuntu-paris\.org|peertube\.mastodon\.host|armstube\.com|peertube\.s2s\.video|peertube\.lol|tube\.open-plug\.eu|open\.tube|peertube\.ch|peertube\.normandie-libre\.fr|peertube\.slat\.org|video\.lacaveatonton\.ovh|peertube\.uno|peertube\.servebeer\.com|peertube\.fedi\.quebec|tube\.h3z\.jp|tube\.plus200\.com|peertube\.eric\.ovh|tube\.metadocs\.cc|tube\.unmondemeilleur\.eu|gouttedeau\.space|video\.antirep\.net|nrop\.cant\.at|tube\.ksl-bmx\.de|tube\.plaf\.fr|tube\.tchncs\.de|video\.devinberg\.com|hitchtube\.fr|peertube\.kosebamse\.com|yunopeertube\.myddns\.me|peertube\.varney\.fr|peertube\.anon-kenkai\.com|tube\.maiti\.info|tubee\.fr|videos\.dinofly\.com|toobnix\.org|videotape\.me|voca\.tube|video\.heromuster\.com|video\.lemediatv\.fr|video\.up\.edu\.ph|balafon\.video|video\.ivel\.fr|thickrips\.cloud|pt\.laurentkruger\.fr|video\.monarch-pass\.net|peertube\.artica\.center|video\.alternanet\.fr|indymotion\.fr|fanvid\.stopthatimp\.net|video\.farci\.org|v\.lesterpig\.com|video\.okaris\.de|tube\.pawelko\.net|peertube\.mablr\.org|tube\.fede\.re|pytu\.be|evertron\.tv|devtube\.dev-wiki\.de|raptube\.antipub\.org|video\.selea\.se|peertube\.mygaia\.org|video\.oh14\.de|peertube\.livingutopia\.org|peertube\.the-penguin\.de|tube\.thechangebook\.org|tube\.anjara\.eu|pt\.pube\.tk|video\.samedi\.pm|mplayer\.demouliere\.eu|widemus\.de|peertube\.me|peertube\.zapashcanon\.fr|video\.latavernedejohnjohn\.fr|peertube\.pcservice46\.fr|peertube\.mazzonetto\.eu|video\.irem\.univ-paris-diderot\.fr|video\.livecchi\.cloud|alttube\.fr|video\.coop\.tools|video\.cabane-libre\.org|peertube\.openstreetmap\.fr|videos\.alolise\.org|irrsinn\.video|video\.antopie\.org|scitech\.video|tube2\.nemsia\.org|video\.amic37\.fr|peertube\.freeforge\.eu|video\.arbitrarion\.com|video\.datsemultimedia\.com|stoptrackingus\.tv|peertube\.ricostrongxxx\.com|docker\.videos\.lecygnenoir\.info|peertube\.togart\.de|tube\.postblue\.info|videos\.domainepublic\.net|peertube\.cyber-tribal\.com|video\.gresille\.org|peertube\.dsmouse\.net|cinema\.yunohost\.support|tube\.theocevaer\.fr|repro\.video|tube\.4aem\.com|quaziinc\.com|peertube\.metawurst\.space|videos\.wakapo\.com|video\.ploud\.fr|video\.freeradical\.zone|tube\.valinor\.fr|refuznik\.video|pt\.kircheneuenburg\.de|peertube\.asrun\.eu|peertube\.lagob\.fr|videos\.side-ways\.net|91video\.online|video\.valme\.io|video\.taboulisme\.com|videos-libr\.es|tv\.mooh\.fr|nuage\.acostey\.fr|video\.monsieur-a\.fr|peertube\.librelois\.fr|videos\.pair2jeux\.tube|videos\.pueseso\.club|peer\.mathdacloud\.ovh|media\.assassinate-you\.net|vidcommons\.org|ptube\.rousset\.nom\.fr|tube\.cyano\.at|videos\.squat\.net|video\.iphodase\.fr|peertube\.makotoworkshop\.org|peertube\.serveur\.slv-valbonne\.fr|vault\.mle\.party|hostyour\.tv|videos\.hack2g2\.fr|libre\.tube|pire\.artisanlogiciel\.net|videos\.numerique-en-commun\.fr|video\.netsyms\.com|video\.die-partei\.social|video\.writeas\.org|peertube\.swarm\.solvingmaz\.es|tube\.pericoloso\.ovh|watching\.cypherpunk\.observer|videos\.adhocmusic\.com|tube\.rfc1149\.net|peertube\.librelabucm\.org|videos\.numericoop\.fr|peertube\.koehn\.com|peertube\.anarchmusicall\.net|tube\.kampftoast\.de|vid\.y-y\.li|peertube\.xtenz\.xyz|diode\.zone|tube\.egf\.mn|peertube\.nomagic\.uk|visionon\.tv|videos\.koumoul\.com|video\.rastapuls\.com|video\.mantlepro\.com|video\.deadsuperhero\.com|peertube\.musicstudio\.pro|peertube\.we-keys\.fr|artitube\.artifaille\.fr|peertube\.ethernia\.net|tube\.midov\.pl|peertube\.fr|watch\.snoot\.tube|peertube\.donnadieu\.fr|argos\.aquilenet\.fr|tube\.nemsia\.org|tube\.bruniau\.net|videos\.darckoune\.moe|tube\.traydent\.info|dev\.videos\.lecygnenoir\.info|peertube\.nayya\.org|peertube\.live|peertube\.mofgao\.space|video\.lequerrec\.eu|peertube\.amicale\.net|aperi\.tube|tube\.ac-lyon\.fr|video\.lw1\.at|www\.yiny\.org|videos\.pofilo\.fr|tube\.lou\.lt|choob\.h\.etbus\.ch|tube\.hoga\.fr|peertube\.heberge\.fr|video\.obermui\.de|videos\.cloudfrancois\.fr|betamax\.video|video\.typica\.us|tube\.piweb\.be|video\.blender\.org|peertube\.cat|tube\.kdy\.ch|pe\.ertu\.be|peertube\.social|videos\.lescommuns\.org|tv\.datamol\.org|videonaute\.fr|dialup\.express|peertube\.nogafa\.org|megatube\.lilomoino\.fr|peertube\.tamanoir\.foucry\.net|peertube\.devosi\.org|peertube\.1312\.media|tube\.bootlicker\.party|skeptikon\.fr|video\.blueline\.mg|tube\.homecomputing\.fr|tube\.ouahpiti\.info|video\.tedomum\.net|video\.g3l\.org|fontube\.fr|peertube\.gaialabs\.ch|tube\.kher\.nl|peertube\.qtg\.fr|video\.migennes\.net|tube\.p2p\.legal|troll\.tv|videos\.iut-orsay\.fr|peertube\.solidev\.net|videos\.cemea\.org|video\.passageenseine\.fr|videos\.festivalparminous\.org|peertube\.touhoppai\.moe|sikke\.fi|peer\.hostux\.social|share\.tube|peertube\.walkingmountains\.fr|videos\.benpro\.fr|peertube\.parleur\.net|peertube\.heraut\.eu|tube\.aquilenet\.fr|peertube\.gegeweb\.eu|framatube\.org|thinkerview\.video|tube\.conferences-gesticulees\.net|peertube\.datagueule\.tv|video\.lqdn\.fr|tube\.mochi\.academy|media\.zat\.im|video\.colibris-outilslibres\.org|tube\.svnet\.fr|peertube\.video|peertube2\.cpy\.re|peertube3\.cpy\.re|videos\.tcit\.fr|peertube\.cpy\.re|canard\.tube))/(?:videos/(?:watch|embed)|api/v\d/videos|w)/)(?P<id>[\da-zA-Z]{22}|[\da-fA-F]{8}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{12})`]);
URL_REGEXS.set('peertube.tux.ovh', [String.raw`(?x)https?://(?P<host>(?:# Taken from https://instances.joinpeertube.org/instances40two\.tube|a\.metube\.ch|advtv\.ml|algorithmic\.tv|alimulama\.com|arcana\.fun|archive\.vidicon\.org|artefac-paris\.tv|auf1\.eu|battlepenguin\.video|beertube\.epgn\.ch|befree\.nohost\.me|bideoak\.argia\.eus|birkeundnymphe\.de|bitcointv\.com|cattube\.org|clap\.nerv-project\.eu|climatejustice\.video|comf\.tube|conspiracydistillery\.com|darkvapor\.nohost\.me|daschauher\.aksel\.rocks|digitalcourage\.video|dreiecksnebel\.alex-detsch\.de|eduvid\.org|evangelisch\.video|exo\.tube|fair\.tube|fediverse\.tv|film\.k-prod\.fr|flim\.txmn\.tk|fotogramas\.politicaconciencia\.org|ftsi\.ru|gary\.vger\.cloud|graeber\.video|greatview\.video|grypstube\.uni-greifswald\.de|highvoltage\.tv|hpstube\.fr|htp\.live|hyperreal\.tube|juggling\.digital|kino\.kompot\.si|kino\.schuerz\.at|kinowolnosc\.pl|kirche\.peertube-host\.de|kodcast\.com|kolektiva\.media|kraut\.zone|kumi\.tube|lastbreach\.tv|lepetitmayennais\.fr\.nf|lexx\.impa\.me|libertynode\.tv|libra\.syntazia\.org|libremedia\.video|live\.libratoi\.org|live\.nanao\.moe|live\.toobnix\.org|livegram\.net|lolitube\.freedomchan\.moe|lucarne\.balsamine\.be|maindreieck-tv\.de|mani\.tube|manicphase\.me|media\.fsfe\.org|media\.gzevd\.de|media\.inno3\.cricket|media\.kaitaia\.life|media\.krashboyz\.org|media\.over-world\.org|media\.skewed\.de|media\.undeadnetwork\.de|medias\.pingbase\.net|melsungen\.peertube-host\.de|mirametube\.fr|mojotube\.net|monplaisirtube\.ddns\.net|mountaintown\.video|my\.bunny\.cafe|myfreetube\.de|mytube\.kn-cloud\.de|mytube\.madzel\.de|myworkoutarenapeertube\.cf|nanawel-peertube\.dyndns\.org|nastub\.cz|offenes\.tv|orgdup\.media|ovaltube\.codinglab\.ch|p2ptv\.ru|p\.eertu\.be|p\.lu|peer\.azurs\.fr|peertube1\.zeteo\.me|peertube\.020\.pl|peertube\.0x5e\.eu|peertube\.alpharius\.io|peertube\.am-networks\.fr|peertube\.anduin\.net|peertube\.anzui\.dev|peertube\.arbleizez\.bzh|peertube\.art3mis\.de|peertube\.atilla\.org|peertube\.atsuchan\.page|peertube\.aukfood\.net|peertube\.aventer\.biz|peertube\.b38\.rural-it\.org|peertube\.beeldengeluid\.nl|peertube\.be|peertube\.bgzashtita\.es|peertube\.bitsandlinux\.com|peertube\.biz|peertube\.boba\.best|peertube\.br0\.fr|peertube\.bridaahost\.ynh\.fr|peertube\.bubbletea\.dev|peertube\.bubuit\.net|peertube\.cabaal\.net|peertube\.cats-home\.net|peertube\.chemnitz\.freifunk\.net|peertube\.chevro\.fr|peertube\.chrisspiegl\.com|peertube\.chtisurel\.net|peertube\.cipherbliss\.com|peertube\.cloud\.sans\.pub|peertube\.cpge-brizeux\.fr|peertube\.ctseuro\.com|peertube\.cuatrolibertades\.org|peertube\.cybercirujas\.club|peertube\.cythin\.com|peertube\.davigge\.com|peertube\.dc\.pini\.fr|peertube\.debian\.social|peertube\.demonix\.fr|peertube\.designersethiques\.org|peertube\.desmu\.fr|peertube\.devloprog\.org|peertube\.devol\.it|peertube\.dtmf\.ca|peertube\.ecologie\.bzh|peertube\.eu\.org|peertube\.european-pirates\.eu|peertube\.euskarabildua\.eus|peertube\.fenarinarsa\.com|peertube\.fomin\.site|peertube\.forsud\.be|peertube\.francoispelletier\.org|peertube\.freenet\.ru|peertube\.freetalklive\.com|peertube\.functional\.cafe|peertube\.gardeludwig\.fr|peertube\.gargantia\.fr|peertube\.gcfamily\.fr|peertube\.genma\.fr|peertube\.get-racing\.de|peertube\.gidikroon\.eu|peertube\.gruezishop\.ch|peertube\.habets\.house|peertube\.hackerfraternity\.org|peertube\.ichigo\.everydayimshuflin\.com|peertube\.ignifi\.me|peertube\.inapurna\.org|peertube\.informaction\.info|peertube\.interhop\.org|peertube\.iselfhost\.com|peertube\.it|peertube\.jensdiemer\.de|peertube\.joffreyverd\.fr|peertube\.kalua\.im|peertube\.kathryl\.fr|peertube\.keazilla\.net|peertube\.klaewyss\.fr|peertube\.kodcast\.com|peertube\.kx\.studio|peertube\.lagvoid\.com|peertube\.lavallee\.tech|peertube\.le5emeaxe\.fr|peertube\.lestutosdeprocessus\.fr|peertube\.librenet\.co\.za|peertube\.logilab\.fr|peertube\.louisematic\.site|peertube\.luckow\.org|peertube\.luga\.at|peertube\.lyceeconnecte\.fr|peertube\.manalejandro\.com|peertube\.marud\.fr|peertube\.mattone\.net|peertube\.maxweiss\.io|peertube\.monlycee\.net|peertube\.mxinfo\.fr|peertube\.myrasp\.eu|peertube\.nebelcloud\.de|peertube\.netzbegruenung\.de|peertube\.newsocial\.tech|peertube\.nicolastissot\.fr|peertube\.nz|peertube\.offerman\.com|peertube\.opencloud\.lu|peertube\.orthus\.link|peertube\.patapouf\.xyz|peertube\.pi2\.dev|peertube\.plataformess\.org|peertube\.pl|peertube\.portaesgnos\.org|peertube\.r2\.enst\.fr|peertube\.r5c3\.fr|peertube\.radres\.xyz|peertube\.red|peertube\.robonomics\.network|peertube\.rtnkv\.cloud|peertube\.runfox\.tk|peertube\.satoshishop\.de|peertube\.scic-tetris\.org|peertube\.securitymadein\.lu|peertube\.semweb\.pro|peertube\.social\.my-wan\.de|peertube\.soykaf\.org|peertube\.stefofficiel\.me|peertube\.stream|peertube\.su|peertube\.swrs\.net|peertube\.takeko\.cyou|peertube\.tangentfox\.com|peertube\.taxinachtegel\.de|peertube\.thenewoil\.xyz|peertube\.ti-fr\.com|peertube\.tiennot\.net|peertube\.troback\.com|peertube\.tspu\.edu\.ru|peertube\.tux\.ovh|peertube\.tv|peertube\.tweb\.tv|peertube\.ucy\.de|peertube\.underworld\.fr|peertube\.us\.to|peertube\.ventresmous\.fr|peertube\.vlaki\.cz|peertube\.w\.utnw\.de|peertube\.westring\.digital|peertube\.xwiki\.com|peertube\.zoz-serv\.org|peervideo\.ru|periscope\.numenaute\.org|perron-tube\.de|petitlutinartube\.fr|phijkchu\.com|pierre\.tube|piraten\.space|play\.rosano\.ca|player\.ojamajo\.moe|plextube\.nl|pocketnetpeertube1\.nohost\.me|pocketnetpeertube3\.nohost\.me|pocketnetpeertube4\.nohost\.me|pocketnetpeertube5\.nohost\.me|pocketnetpeertube6\.nohost\.me|pt\.24-7\.ro|pt\.apathy\.top|pt\.diaspodon\.fr|pt\.fedi\.tech|pt\.maciej\.website|ptb\.lunarviews\.net|ptmir1\.inter21\.net|ptmir2\.inter21\.net|ptmir3\.inter21\.net|ptmir4\.inter21\.net|ptmir5\.inter21\.net|ptube\.horsentiers\.fr|ptube\.xmanifesto\.club|queermotion\.org|re-wizja\.re-medium\.com|regarder\.sans\.pub|ruraletv\.ovh|s1\.gegenstimme\.tv|s2\.veezee\.tube|sdmtube\.fr|sender-fm\.veezee\.tube|serv1\.wiki-tube\.de|serv3\.wiki-tube\.de|sickstream\.net|sleepy\.tube|sovran\.video|spectra\.video|stream\.elven\.pw|stream\.k-prod\.fr|stream\.shahab\.nohost\.me|streamsource\.video|studios\.racer159\.com|testtube\.florimond\.eu|tgi\.hosted\.spacebear\.ee|thaitube\.in\.th|the\.jokertv\.eu|theater\.ethernia\.net|thecool\.tube|tilvids\.com|toob\.bub\.org|tpaw\.video|truetube\.media|tuba\.lhub\.pl|tube-aix-marseille\.beta\.education\.fr|tube-amiens\.beta\.education\.fr|tube-besancon\.beta\.education\.fr|tube-bordeaux\.beta\.education\.fr|tube-clermont-ferrand\.beta\.education\.fr|tube-corse\.beta\.education\.fr|tube-creteil\.beta\.education\.fr|tube-dijon\.beta\.education\.fr|tube-education\.beta\.education\.fr|tube-grenoble\.beta\.education\.fr|tube-lille\.beta\.education\.fr|tube-limoges\.beta\.education\.fr|tube-montpellier\.beta\.education\.fr|tube-nancy\.beta\.education\.fr|tube-nantes\.beta\.education\.fr|tube-nice\.beta\.education\.fr|tube-normandie\.beta\.education\.fr|tube-orleans-tours\.beta\.education\.fr|tube-outremer\.beta\.education\.fr|tube-paris\.beta\.education\.fr|tube-poitiers\.beta\.education\.fr|tube-reims\.beta\.education\.fr|tube-rennes\.beta\.education\.fr|tube-strasbourg\.beta\.education\.fr|tube-toulouse\.beta\.education\.fr|tube-versailles\.beta\.education\.fr|tube1\.it\.tuwien\.ac\.at|tube\.abolivier\.bzh|tube\.ac-amiens\.fr|tube\.aerztefueraufklaerung\.de|tube\.alexx\.ml|tube\.amic37\.fr|tube\.anufrij\.de|tube\.apolut\.net|tube\.arkhalabs\.io|tube\.arthack\.nz|tube\.as211696\.net|tube\.avensio\.de|tube\.azbyka\.ru|tube\.azkware\.net|tube\.bachaner\.fr|tube\.bmesh\.org|tube\.borked\.host|tube\.bstly\.de|tube\.chaoszone\.tv|tube\.chatelet\.ovh|tube\.cloud-libre\.eu|tube\.cms\.garden|tube\.cowfee\.moe|tube\.cryptography\.dog|tube\.darknight-coffee\.org|tube\.dev\.lhub\.pl|tube\.distrilab\.fr|tube\.dsocialize\.net|tube\.ebin\.club|tube\.fdn\.fr|tube\.florimond\.eu|tube\.foxarmy\.ml|tube\.foxden\.party|tube\.frischesicht\.de|tube\.futuretic\.fr|tube\.gnous\.eu|tube\.grap\.coop|tube\.graz\.social|tube\.grin\.hu|tube\.hackerscop\.org|tube\.hordearii\.fr|tube\.jeena\.net|tube\.kai-stuht\.com|tube\.kockatoo\.org|tube\.kotur\.org|tube\.lacaveatonton\.ovh|tube\.linkse\.media|tube\.lokad\.com|tube\.lucie-philou\.com|tube\.melonbread\.xyz|tube\.mfraters\.net|tube\.motuhake\.xyz|tube\.mrbesen\.de|tube\.nah\.re|tube\.nchoco\.net|tube\.novg\.net|tube\.nox-rhea\.org|tube\.nuagelibre\.fr|tube\.nx12\.net|tube\.octaplex\.net|tube\.odat\.xyz|tube\.oisux\.org|tube\.opportunis\.me|tube\.org\.il|tube\.ortion\.xyz|tube\.others\.social|tube\.picasoft\.net|tube\.plomlompom\.com|tube\.pmj\.rocks|tube\.portes-imaginaire\.org|tube\.pyngu\.com|tube\.rebellion\.global|tube\.rhythms-of-resistance\.org|tube\.rita\.moe|tube\.rsi\.cnr\.it|tube\.s1gm4\.eu|tube\.saumon\.io|tube\.schleuss\.online|tube\.schule\.social|tube\.seditio\.fr|tube\.shanti\.cafe|tube\.shela\.nu|tube\.skrep\.in|tube\.sp-codes\.de|tube\.sp4ke\.com|tube\.superseriousbusiness\.org|tube\.systest\.eu|tube\.tappret\.fr|tube\.tardis\.world|tube\.toontoet\.nl|tube\.tpshd\.de|tube\.troopers\.agency|tube\.tylerdavis\.xyz|tube\.undernet\.uy|tube\.vigilian-consulting\.nl|tube\.vraphim\.com|tube\.wehost\.lgbt|tube\.wien\.rocks|tube\.wolfe\.casa|tube\.xd0\.de|tube\.xy-space\.de|tube\.yapbreak\.fr|tubedu\.org|tubes\.jodh\.us|tuktube\.com|turkum\.me|tututu\.tube|tuvideo\.encanarias\.info|tv1\.cocu\.cc|tv1\.gomntu\.space|tv2\.cocu\.cc|tv\.adn\.life|tv\.atmx\.ca|tv\.bitma\.st|tv\.generallyrubbish\.net\.au|tv\.lumbung\.space|tv\.mattchristiansenmedia\.com|tv\.netwhood\.online|tv\.neue\.city|tv\.piejacker\.net|tv\.pirateradio\.social|tv\.undersco\.re|tvox\.ru|twctube\.twc-zone\.eu|unfilter\.tube|v\.basspistol\.org|v\.kisombrella\.top|v\.lastorder\.xyz|v\.lor\.sh|v\.phreedom\.club|v\.sil\.sh|v\.szy\.io|v\.xxxapex\.com|veezee\.tube|vid\.dascoyote\.xyz|vid\.garwood\.io|vid\.ncrypt\.at|vid\.pravdastalina\.info|vid\.qorg11\.net|vid\.rajeshtaylor\.com|vid\.samtripoli\.com|vid\.werefox\.dev|vid\.wildeboer\.net|video-cave-v2\.de|video\.076\.ne\.jp|video\.1146\.nohost\.me|video\.altertek\.org|video\.anartist\.org|video\.apps\.thedoodleproject\.net|video\.artist\.cx|video\.asgardius\.company|video\.balsillie\.net|video\.bards\.online|video\.binarydad\.com|video\.blast-info\.fr|video\.catgirl\.biz|video\.cigliola\.com|video\.cm-en-transition\.fr|video\.cnt\.social|video\.coales\.co|video\.codingfield\.com|video\.comptoir\.net|video\.comune\.trento\.it|video\.cpn\.so|video\.csc49\.fr|video\.cybre\.town|video\.demokratischer-sommer\.de|video\.discord-insoumis\.fr|video\.dolphincastle\.com|video\.dresden\.network|video\.ecole-89\.com|video\.elgrillolibertario\.org|video\.emergeheart\.info|video\.eradicatinglove\.xyz|video\.ethantheenigma\.me|video\.exodus-privacy\.eu\.org|video\.fbxl\.net|video\.fhtagn\.org|video\.greenmycity\.eu|video\.guerredeclasse\.fr|video\.gyt\.is|video\.hackers\.town|video\.hardlimit\.com|video\.hooli\.co|video\.igem\.org|video\.internet-czas-dzialac\.pl|video\.islameye\.com|video\.kicik\.fr|video\.kuba-orlik\.name|video\.kyushojitsu\.ca|video\.lavolte\.net|video\.lespoesiesdheloise\.fr|video\.liberta\.vip|video\.liege\.bike|video\.linc\.systems|video\.linux\.it|video\.linuxtrent\.it|video\.lokal\.social|video\.lono\.space|video\.lunasqu\.ee|video\.lundi\.am|video\.marcorennmaus\.de|video\.mass-trespass\.uk|video\.mugoreve\.fr|video\.mundodesconocido\.com|video\.mycrowd\.ca|video\.nogafam\.es|video\.odayacres\.farm|video\.ozgurkon\.org|video\.p1ng0ut\.social|video\.p3x\.de|video\.pcf\.fr|video\.pony\.gallery|video\.potate\.space|video\.pourpenser\.pro|video\.progressiv\.dev|video\.resolutions\.it|video\.rw501\.de|video\.screamer\.wiki|video\.sdm-tools\.net|video\.sftblw\.moe|video\.shitposter\.club|video\.skyn3t\.in|video\.soi\.ch|video\.stuartbrand\.co\.uk|video\.thinkof\.name|video\.toot\.pt|video\.triplea\.fr|video\.turbo\.chat|video\.vaku\.org\.ua|video\.veloma\.org|video\.violoncello\.ch|video\.wilkie\.how|video\.wsf2021\.info|videorelay\.co|videos-passages\.huma-num\.fr|videos\.3d-wolf\.com|videos\.ahp-numerique\.fr|videos\.alexandrebadalo\.pt|videos\.archigny\.net|videos\.benjaminbrady\.ie|videos\.buceoluegoexisto\.com|videos\.capas\.se|videos\.casually\.cat|videos\.cloudron\.io|videos\.coletivos\.org|videos\.danksquad\.org|videos\.denshi\.live|videos\.fromouter\.space|videos\.fsci\.in|videos\.globenet\.org|videos\.hauspie\.fr|videos\.hush\.is|videos\.john-livingston\.fr|videos\.jordanwarne\.xyz|videos\.lavoixdessansvoix\.org|videos\.leslionsfloorball\.fr|videos\.lucero\.top|videos\.martyn\.berlin|videos\.mastodont\.cat|videos\.monstro1\.com|videos\.npo\.city|videos\.optoutpod\.com|videos\.petch\.rocks|videos\.pzelawski\.xyz|videos\.rampin\.org|videos\.scanlines\.xyz|videos\.shmalls\.pw|videos\.sibear\.fr|videos\.stadtfabrikanten\.org|videos\.tankernn\.eu|videos\.testimonia\.org|videos\.thisishowidontdisappear\.com|videos\.traumaheilung\.net|videos\.trom\.tf|videos\.wakkerewereld\.nu|videos\.weblib\.re|videos\.yesil\.club|vids\.roshless\.me|vids\.tekdmn\.me|vidz\.dou\.bet|vod\.lumikko\.dev|vs\.uniter\.network|vulgarisation-informatique\.fr|watch\.breadtube\.tv|watch\.deranalyst\.ch|watch\.ignorance\.eu|watch\.krazy\.party|watch\.libertaria\.space|watch\.rt4mn\.org|watch\.softinio\.com|watch\.tubelab\.video|web-fellow\.de|webtv\.vandoeuvre\.net|wechill\.space|wikileaks\.video|wiwi\.video|worldofvids\.com|wwtube\.net|www4\.mir\.inter21\.net|www\.birkeundnymphe\.de|www\.captain-german\.com|www\.wiki-tube\.de|xxivproduction\.video|xxx\.noho\.st|# from youtube-dlpeertube\.rainbowswingers\.net|tube\.stanisic\.nl|peer\.suiri\.us|medias\.libox\.fr|videomensoif\.ynh\.fr|peertube\.travelpandas\.eu|peertube\.rachetjay\.fr|peertube\.montecsys\.fr|tube\.eskuero\.me|peer\.tube|peertube\.umeahackerspace\.se|tube\.nx-pod\.de|video\.monsieurbidouille\.fr|tube\.openalgeria\.org|vid\.lelux\.fi|video\.anormallostpod\.ovh|tube\.crapaud-fou\.org|peertube\.stemy\.me|lostpod\.space|exode\.me|peertube\.snargol\.com|vis\.ion\.ovh|videosdulib\.re|v\.mbius\.io|videos\.judrey\.eu|peertube\.osureplayviewer\.xyz|peertube\.mathieufamily\.ovh|www\.videos-libr\.es|fightforinfo\.com|peertube\.fediverse\.ru|peertube\.oiseauroch\.fr|video\.nesven\.eu|v\.bearvideo\.win|video\.qoto\.org|justporn\.cc|video\.vny\.fr|peervideo\.club|tube\.taker\.fr|peertube\.chantierlibre\.org|tube\.ipfixe\.info|tube\.kicou\.info|tube\.dodsorf\.as|videobit\.cc|video\.yukari\.moe|videos\.elbinario\.net|hkvideo\.live|pt\.tux\.tf|www\.hkvideo\.live|FIGHTFORINFO\.com|pt\.765racing\.com|peertube\.gnumeria\.eu\.org|nordenmedia\.com|peertube\.co\.uk|tube\.darfweb\.eu|tube\.kalah-france\.org|0ch\.in|vod\.mochi\.academy|film\.node9\.org|peertube\.hatthieves\.es|video\.fitchfamily\.org|peertube\.ddns\.net|video\.ifuncle\.kr|video\.fdlibre\.eu|tube\.22decembre\.eu|peertube\.harmoniescreatives\.com|tube\.fabrigli\.fr|video\.thedwyers\.co|video\.bruitbruit\.com|peertube\.foxfam\.club|peer\.philoxweb\.be|videos\.bugs\.social|peertube\.malbert\.xyz|peertube\.bilange\.ca|libretube\.net|diytelevision\.com|peertube\.fedilab\.app|libre\.video|video\.mstddntfdn\.online|us\.tv|peertube\.sl-network\.fr|peertube\.dynlinux\.io|peertube\.david\.durieux\.family|peertube\.linuxrocks\.online|peerwatch\.xyz|v\.kretschmann\.social|tube\.otter\.sh|yt\.is\.nota\.live|tube\.dragonpsi\.xyz|peertube\.boneheadmedia\.com|videos\.funkwhale\.audio|watch\.44con\.com|peertube\.gcaillaut\.fr|peertube\.icu|pony\.tube|spacepub\.space|tube\.stbr\.io|v\.mom-gay\.faith|tube\.port0\.xyz|peertube\.simounet\.net|play\.jergefelt\.se|peertube\.zeteo\.me|tube\.danq\.me|peertube\.kerenon\.com|tube\.fab-l3\.org|tube\.calculate\.social|peertube\.mckillop\.org|tube\.netzspielplatz\.de|vod\.ksite\.de|peertube\.laas\.fr|tube\.govital\.net|peertube\.stephenson\.cc|bistule\.nohost\.me|peertube\.kajalinifi\.de|video\.ploud\.jp|video\.omniatv\.com|peertube\.ffs2play\.fr|peertube\.leboulaire\.ovh|peertube\.tronic-studio\.com|peertube\.public\.cat|peertube\.metalbanana\.net|video\.1000i100\.fr|peertube\.alter-nativ-voll\.de|tube\.pasa\.tf|tube\.worldofhauru\.xyz|pt\.kamp\.site|peertube\.teleassist\.fr|videos\.mleduc\.xyz|conf\.tube|media\.privacyinternational\.org|pt\.forty-two\.nl|video\.halle-leaks\.de|video\.grosskopfgames\.de|peertube\.schaeferit\.de|peertube\.jackbot\.fr|tube\.extinctionrebellion\.fr|peertube\.f-si\.org|video\.subak\.ovh|videos\.koweb\.fr|peertube\.zergy\.net|peertube\.roflcopter\.fr|peertube\.floss-marketing-school\.com|vloggers\.social|peertube\.iriseden\.eu|videos\.ubuntu-paris\.org|peertube\.mastodon\.host|armstube\.com|peertube\.s2s\.video|peertube\.lol|tube\.open-plug\.eu|open\.tube|peertube\.ch|peertube\.normandie-libre\.fr|peertube\.slat\.org|video\.lacaveatonton\.ovh|peertube\.uno|peertube\.servebeer\.com|peertube\.fedi\.quebec|tube\.h3z\.jp|tube\.plus200\.com|peertube\.eric\.ovh|tube\.metadocs\.cc|tube\.unmondemeilleur\.eu|gouttedeau\.space|video\.antirep\.net|nrop\.cant\.at|tube\.ksl-bmx\.de|tube\.plaf\.fr|tube\.tchncs\.de|video\.devinberg\.com|hitchtube\.fr|peertube\.kosebamse\.com|yunopeertube\.myddns\.me|peertube\.varney\.fr|peertube\.anon-kenkai\.com|tube\.maiti\.info|tubee\.fr|videos\.dinofly\.com|toobnix\.org|videotape\.me|voca\.tube|video\.heromuster\.com|video\.lemediatv\.fr|video\.up\.edu\.ph|balafon\.video|video\.ivel\.fr|thickrips\.cloud|pt\.laurentkruger\.fr|video\.monarch-pass\.net|peertube\.artica\.center|video\.alternanet\.fr|indymotion\.fr|fanvid\.stopthatimp\.net|video\.farci\.org|v\.lesterpig\.com|video\.okaris\.de|tube\.pawelko\.net|peertube\.mablr\.org|tube\.fede\.re|pytu\.be|evertron\.tv|devtube\.dev-wiki\.de|raptube\.antipub\.org|video\.selea\.se|peertube\.mygaia\.org|video\.oh14\.de|peertube\.livingutopia\.org|peertube\.the-penguin\.de|tube\.thechangebook\.org|tube\.anjara\.eu|pt\.pube\.tk|video\.samedi\.pm|mplayer\.demouliere\.eu|widemus\.de|peertube\.me|peertube\.zapashcanon\.fr|video\.latavernedejohnjohn\.fr|peertube\.pcservice46\.fr|peertube\.mazzonetto\.eu|video\.irem\.univ-paris-diderot\.fr|video\.livecchi\.cloud|alttube\.fr|video\.coop\.tools|video\.cabane-libre\.org|peertube\.openstreetmap\.fr|videos\.alolise\.org|irrsinn\.video|video\.antopie\.org|scitech\.video|tube2\.nemsia\.org|video\.amic37\.fr|peertube\.freeforge\.eu|video\.arbitrarion\.com|video\.datsemultimedia\.com|stoptrackingus\.tv|peertube\.ricostrongxxx\.com|docker\.videos\.lecygnenoir\.info|peertube\.togart\.de|tube\.postblue\.info|videos\.domainepublic\.net|peertube\.cyber-tribal\.com|video\.gresille\.org|peertube\.dsmouse\.net|cinema\.yunohost\.support|tube\.theocevaer\.fr|repro\.video|tube\.4aem\.com|quaziinc\.com|peertube\.metawurst\.space|videos\.wakapo\.com|video\.ploud\.fr|video\.freeradical\.zone|tube\.valinor\.fr|refuznik\.video|pt\.kircheneuenburg\.de|peertube\.asrun\.eu|peertube\.lagob\.fr|videos\.side-ways\.net|91video\.online|video\.valme\.io|video\.taboulisme\.com|videos-libr\.es|tv\.mooh\.fr|nuage\.acostey\.fr|video\.monsieur-a\.fr|peertube\.librelois\.fr|videos\.pair2jeux\.tube|videos\.pueseso\.club|peer\.mathdacloud\.ovh|media\.assassinate-you\.net|vidcommons\.org|ptube\.rousset\.nom\.fr|tube\.cyano\.at|videos\.squat\.net|video\.iphodase\.fr|peertube\.makotoworkshop\.org|peertube\.serveur\.slv-valbonne\.fr|vault\.mle\.party|hostyour\.tv|videos\.hack2g2\.fr|libre\.tube|pire\.artisanlogiciel\.net|videos\.numerique-en-commun\.fr|video\.netsyms\.com|video\.die-partei\.social|video\.writeas\.org|peertube\.swarm\.solvingmaz\.es|tube\.pericoloso\.ovh|watching\.cypherpunk\.observer|videos\.adhocmusic\.com|tube\.rfc1149\.net|peertube\.librelabucm\.org|videos\.numericoop\.fr|peertube\.koehn\.com|peertube\.anarchmusicall\.net|tube\.kampftoast\.de|vid\.y-y\.li|peertube\.xtenz\.xyz|diode\.zone|tube\.egf\.mn|peertube\.nomagic\.uk|visionon\.tv|videos\.koumoul\.com|video\.rastapuls\.com|video\.mantlepro\.com|video\.deadsuperhero\.com|peertube\.musicstudio\.pro|peertube\.we-keys\.fr|artitube\.artifaille\.fr|peertube\.ethernia\.net|tube\.midov\.pl|peertube\.fr|watch\.snoot\.tube|peertube\.donnadieu\.fr|argos\.aquilenet\.fr|tube\.nemsia\.org|tube\.bruniau\.net|videos\.darckoune\.moe|tube\.traydent\.info|dev\.videos\.lecygnenoir\.info|peertube\.nayya\.org|peertube\.live|peertube\.mofgao\.space|video\.lequerrec\.eu|peertube\.amicale\.net|aperi\.tube|tube\.ac-lyon\.fr|video\.lw1\.at|www\.yiny\.org|videos\.pofilo\.fr|tube\.lou\.lt|choob\.h\.etbus\.ch|tube\.hoga\.fr|peertube\.heberge\.fr|video\.obermui\.de|videos\.cloudfrancois\.fr|betamax\.video|video\.typica\.us|tube\.piweb\.be|video\.blender\.org|peertube\.cat|tube\.kdy\.ch|pe\.ertu\.be|peertube\.social|videos\.lescommuns\.org|tv\.datamol\.org|videonaute\.fr|dialup\.express|peertube\.nogafa\.org|megatube\.lilomoino\.fr|peertube\.tamanoir\.foucry\.net|peertube\.devosi\.org|peertube\.1312\.media|tube\.bootlicker\.party|skeptikon\.fr|video\.blueline\.mg|tube\.homecomputing\.fr|tube\.ouahpiti\.info|video\.tedomum\.net|video\.g3l\.org|fontube\.fr|peertube\.gaialabs\.ch|tube\.kher\.nl|peertube\.qtg\.fr|video\.migennes\.net|tube\.p2p\.legal|troll\.tv|videos\.iut-orsay\.fr|peertube\.solidev\.net|videos\.cemea\.org|video\.passageenseine\.fr|videos\.festivalparminous\.org|peertube\.touhoppai\.moe|sikke\.fi|peer\.hostux\.social|share\.tube|peertube\.walkingmountains\.fr|videos\.benpro\.fr|peertube\.parleur\.net|peertube\.heraut\.eu|tube\.aquilenet\.fr|peertube\.gegeweb\.eu|framatube\.org|thinkerview\.video|tube\.conferences-gesticulees\.net|peertube\.datagueule\.tv|video\.lqdn\.fr|tube\.mochi\.academy|media\.zat\.im|video\.colibris-outilslibres\.org|tube\.svnet\.fr|peertube\.video|peertube2\.cpy\.re|peertube3\.cpy\.re|videos\.tcit\.fr|peertube\.cpy\.re|canard\.tube))/(?P<type>(?:a|c|w/p))/(?P<id>[^/]+)`]);
URL_REGEXS.set('members.onepeloton.com', [String.raw`https?://members\.onepeloton\.com/classes/player/(?P<id>[a-f0-9]+)`, String.raw`https?://members\.onepeloton\.com/player/live/(?P<id>[a-f0-9]+)`]);
URL_REGEXS.set('www.people.com', [String.raw`https?://(?:www\.)?people\.com/people/videos/0,,(?P<id>\d+),00\.html`]);
URL_REGEXS.set('player.performgroup.com', [String.raw`https?://player\.performgroup\.com/eplayer(?:/eplayer\.html|\.js)#/?(?P<id>[0-9a-f]{26})\.(?P<auth_token>[0-9a-z]{26})`]);
URL_REGEXS.set('www.periscope.tv', [String.raw`https?://(?:www\.)?(?:periscope|pscp)\.tv/[^/]+/(?P<id>[^/?#]+)`, String.raw`https?://(?:www\.)?(?:periscope|pscp)\.tv/(?P<id>[^/]+)/?$`]);
URL_REGEXS.set('philharmoniedeparis.fr', [String.raw`(?x)https?://(?:live\.philharmoniedeparis\.fr/(?:[Cc]oncert/|embed(?:app)?/|misc/Playlist\.ashx\?id=)|pad\.philharmoniedeparis\.fr/(?:doc/CIMU/|player\.aspx\?id=)|philharmoniedeparis\.fr/fr/live/concert/|otoplayer\.philharmoniedeparis\.fr/fr/embed/)(?P<id>\d+)`]);
URL_REGEXS.set('live.philharmoniedeparis.fr', [String.raw`(?x)https?://(?:live\.philharmoniedeparis\.fr/(?:[Cc]oncert/|embed(?:app)?/|misc/Playlist\.ashx\?id=)|pad\.philharmoniedeparis\.fr/(?:doc/CIMU/|player\.aspx\?id=)|philharmoniedeparis\.fr/fr/live/concert/|otoplayer\.philharmoniedeparis\.fr/fr/embed/)(?P<id>\d+)`]);
URL_REGEXS.set('otoplayer.philharmoniedeparis.fr', [String.raw`(?x)https?://(?:live\.philharmoniedeparis\.fr/(?:[Cc]oncert/|embed(?:app)?/|misc/Playlist\.ashx\?id=)|pad\.philharmoniedeparis\.fr/(?:doc/CIMU/|player\.aspx\?id=)|philharmoniedeparis\.fr/fr/live/concert/|otoplayer\.philharmoniedeparis\.fr/fr/embed/)(?P<id>\d+)`]);
URL_REGEXS.set('www.phoenix.de', [String.raw`https?://(?:www\.)?phoenix\.de/(?:[^/]+/)*[^/?#&]*-a-(?P<id>\d+)\.html`]);
URL_REGEXS.set('media.photobucket.com', [String.raw`https?://(?:[a-z0-9]+\.)?photobucket\.com/.*(([\?\&]current=)|_)(?P<id>.*)\.(?P<ext>(flv)|(mp4))`]);
URL_REGEXS.set('piapro.jp', [String.raw`https?://piapro\.jp/t/(?P<id>\w+)/?`]);
URL_REGEXS.set('picarto.tv', [String.raw`https?://(?:www.)?picarto\.tv/(?P<id>[a-zA-Z0-9]+)`, String.raw`https?://(?:www.)?picarto\.tv/videopopout/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('player.piksel.com', [String.raw`(?x)https?://(?:(?:player\.(?:olympusattelecom|vibebyvista)|(?:api|player)\.multicastmedia|(?:api-ovp|player)\.piksel)\.com|(?:mz-edge\.stream\.co|movie-s\.nhk\.or)\.jp|vidego\.baltimorecity\.gov)/v/(?:refid/(?P<refid>[^/]+)/prefid/)?(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.pinkbike.com', [String.raw`https?://(?:(?:www\.)?pinkbike\.com/video/|es\.pinkbike\.org/i/kvid/kvid-y5\.swf\?id=)(?P<id>[0-9]+)`]);
URL_REGEXS.set('es.pinkbike.org', [String.raw`https?://(?:(?:www\.)?pinkbike\.com/video/|es\.pinkbike\.org/i/kvid/kvid-y5\.swf\?id=)(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.pinterest.com', [String.raw`(?x)https?://(?:[^/]+\.)?pinterest\.(?:com|fr|de|ch|jp|cl|ca|it|co\.uk|nz|ru|com\.au|at|pt|co\.kr|es|com\.mx|dk|ph|th|com\.uy|co|nl|info|kr|ie|vn|com\.vn|ec|mx|in|pe|co\.at|hu|co\.in|co\.nz|id|com\.ec|com\.py|tw|be|uk|com\.bo|com\.pe)/pin/(?P<id>\d+)`]);
URL_REGEXS.set('www.pinterest.ca', [String.raw`(?x)https?://(?:[^/]+\.)?pinterest\.(?:com|fr|de|ch|jp|cl|ca|it|co\.uk|nz|ru|com\.au|at|pt|co\.kr|es|com\.mx|dk|ph|th|com\.uy|co|nl|info|kr|ie|vn|com\.vn|ec|mx|in|pe|co\.at|hu|co\.in|co\.nz|id|com\.ec|com\.py|tw|be|uk|com\.bo|com\.pe)/pin/(?P<id>\d+)`, String.raw`(?x)https?://(?:[^/]+\.)?pinterest\.(?:com|fr|de|ch|jp|cl|ca|it|co\.uk|nz|ru|com\.au|at|pt|co\.kr|es|com\.mx|dk|ph|th|com\.uy|co|nl|info|kr|ie|vn|com\.vn|ec|mx|in|pe|co\.at|hu|co\.in|co\.nz|id|com\.ec|com\.py|tw|be|uk|com\.bo|com\.pe)/(?P<username>[^/]+)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('co.pinterest.com', [String.raw`(?x)https?://(?:[^/]+\.)?pinterest\.(?:com|fr|de|ch|jp|cl|ca|it|co\.uk|nz|ru|com\.au|at|pt|co\.kr|es|com\.mx|dk|ph|th|com\.uy|co|nl|info|kr|ie|vn|com\.vn|ec|mx|in|pe|co\.at|hu|co\.in|co\.nz|id|com\.ec|com\.py|tw|be|uk|com\.bo|com\.pe)/pin/(?P<id>\d+)`]);
URL_REGEXS.set('dood.to', [String.raw`https?://(?:www\.)?(?:dood\.(?:to|watch|so|pm|wf|re))`]);
URL_REGEXS.set('sketch.pixiv.net', [String.raw`https?://sketch\.pixiv\.net/@(?P<uploader_id>[a-zA-Z0-9_-]+)/lives/(?P<id>\d+)/?`, String.raw`https?://sketch\.pixiv\.net/@(?P<id>[a-zA-Z0-9_-]+)/?`]);
URL_REGEXS.set('out.pladform.ru', [String.raw`(?x)https?://(?:(?:out\.pladform\.ru/player|static\.pladform\.ru/player\.swf)\?.*\bvideoid=|video\.pladform\.ru/catalog/video/videoid/)(?P<id>\d+)`]);
URL_REGEXS.set('static.pladform.ru', [String.raw`(?x)https?://(?:(?:out\.pladform\.ru/player|static\.pladform\.ru/player\.swf)\?.*\bvideoid=|video\.pladform\.ru/catalog/video/videoid/)(?P<id>\d+)`]);
URL_REGEXS.set('video.pladform.ru', [String.raw`(?x)https?://(?:(?:out\.pladform\.ru/player|static\.pladform\.ru/player\.swf)\?.*\bvideoid=|video\.pladform\.ru/catalog/video/videoid/)(?P<id>\d+)`]);
URL_REGEXS.set('www.planetmarathi.com', [String.raw`https?://(?:www\.)?planetmarathi\.com/titles/(?P<id>[^/#&?$]+)`]);
URL_REGEXS.set('platzi.com', [String.raw`(?x)https?://(?:platzi\.com/clases|courses\.platzi\.com/classes)/[^/]+/(?P<id>\d+)-[^/?\#&]+`, String.raw`(?x)https?://(?:platzi\.com/clases|courses\.platzi\.com/classes)/(?P<id>[^/?\#&]+)`]);
URL_REGEXS.set('courses.platzi.com', [String.raw`(?x)https?://(?:platzi\.com/clases|courses\.platzi\.com/classes)/[^/]+/(?P<id>\d+)-[^/?\#&]+`, String.raw`(?x)https?://(?:platzi\.com/clases|courses\.platzi\.com/classes)/(?P<id>[^/?\#&]+)`]);
URL_REGEXS.set('www.play.fm', [String.raw`https?://(?:www\.)?play\.fm/(?P<slug>(?:[^/]+/)+(?P<id>[^/]+))/?(?:$|[?#])`]);
URL_REGEXS.set('www.playplus.tv', [String.raw`https?://(?:www\.)?playplus\.(?:com|tv)/VOD/(?P<project_id>[0-9]+)/(?P<id>[0-9a-f]{32})`]);
URL_REGEXS.set('play.stuff.co.nz', [String.raw`https?://(?:www\.)?play\.stuff\.co\.nz/details/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('plays.tv', [String.raw`https?://(?:www\.)?plays\.tv/(?:video|embeds)/(?P<id>[0-9a-f]{18})`]);
URL_REGEXS.set('www.playsuisse.ch', [String.raw`https?://(?:www\.)?playsuisse\.ch/watch/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.playtvak.cz', [String.raw`https?://(?:.+?\.)?(?:playtvak|idnes|lidovky|metro)\.cz/.*\?(?:c|idvideo)=(?P<id>[^&]+)`]);
URL_REGEXS.set('slowtv.playtvak.cz', [String.raw`https?://(?:.+?\.)?(?:playtvak|idnes|lidovky|metro)\.cz/.*\?(?:c|idvideo)=(?P<id>[^&]+)`]);
URL_REGEXS.set('zpravy.idnes.cz', [String.raw`https?://(?:.+?\.)?(?:playtvak|idnes|lidovky|metro)\.cz/.*\?(?:c|idvideo)=(?P<id>[^&]+)`]);
URL_REGEXS.set('www.lidovky.cz', [String.raw`https?://(?:.+?\.)?(?:playtvak|idnes|lidovky|metro)\.cz/.*\?(?:c|idvideo)=(?P<id>[^&]+)`]);
URL_REGEXS.set('www.metro.cz', [String.raw`https?://(?:.+?\.)?(?:playtvak|idnes|lidovky|metro)\.cz/.*\?(?:c|idvideo)=(?P<id>[^&]+)`]);
URL_REGEXS.set('www.playvid.com', [String.raw`https?://(?:www\.)?playvid\.com/watch(\?v=|/)(?P<id>.+?)(?:#|$)`]);
URL_REGEXS.set('www.playvids.com', [String.raw`https?://(?:www\.)?(?P<domain>playvids\.com)/(?:embed/|\w\w?/)?(?P<id>[^/?#]*)`]);
URL_REGEXS.set('config.playwire.com', [String.raw`https?://(?:config|cdn)\.playwire\.com(?:/v2)?/(?P<publisher_id>\d+)/(?:videos/v2|embed|config)/(?P<id>\d+)`]);
URL_REGEXS.set('cdn.playwire.com', [String.raw`https?://(?:config|cdn)\.playwire\.com(?:/v2)?/(?P<publisher_id>\d+)/(?:videos/v2|embed|config)/(?P<id>\d+)`]);
URL_REGEXS.set('www.pluralsight.com', [String.raw`https?://(?:(?:www|app)\.)?pluralsight\.com/(?:training/)?player\?`, String.raw`https?://(?:(?:www|app)\.)?pluralsight\.com/(?:library/)?courses/(?P<id>[^/]+)`]);
URL_REGEXS.set('app.pluralsight.com', [String.raw`https?://(?:(?:www|app)\.)?pluralsight\.com/(?:training/)?player\?`, String.raw`https?://(?:(?:www|app)\.)?pluralsight\.com/(?:library/)?courses/(?P<id>[^/]+)`]);
URL_REGEXS.set('pluto.tv', [String.raw`(?x)https?://(?:www\.)?pluto\.tv(?:/[^/]+)?/on-demand/(?P<video_type>movies|series)/(?P<series_or_movie_slug>[^/]+)(?:(?:/seasons?/(?P<season_no>\d+))?(?:/episode/(?P<episode_slug>[^/]+))?)?/?(?:$|[#?])`]);
URL_REGEXS.set('podbay.fm', [String.raw`https?://podbay\.fm/p/[^/]*/e/(?P<id>[^/]*)/?(?:[\?#].*)?$`, String.raw`https?://podbay\.fm/p/(?P<id>[^/]*)/?(?:[\?#].*)?$`]);
URL_REGEXS.set('www.podchaser.com', [String.raw`https?://(?:www\.)?podchaser\.com/podcasts/[\w-]+-(?P<podcast_id>\d+)(?:/episodes/[\w-]+-(?P<id>\d+))?`]);
URL_REGEXS.set('scienceteachingtips.podomatic.com', [String.raw`(?x)(?P<proto>https?)://(?:(?P<channel>[^.]+)\.podomatic\.com/entry|(?:www\.)?podomatic\.com/podcasts/(?P<channel_2>[^/]+)/episodes)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('ostbahnhof.podomatic.com', [String.raw`(?x)(?P<proto>https?)://(?:(?P<channel>[^.]+)\.podomatic\.com/entry|(?:www\.)?podomatic\.com/podcasts/(?P<channel_2>[^/]+)/episodes)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.podomatic.com', [String.raw`(?x)(?P<proto>https?)://(?:(?P<channel>[^.]+)\.podomatic\.com/entry|(?:www\.)?podomatic\.com/podcasts/(?P<channel_2>[^/]+)/episodes)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.pokemon.com', [String.raw`https?://(?:www\.)?pokemon\.com/[a-z]{2}(?:.*?play=(?P<id>[a-z0-9]{32})|/(?:[^/]+/)+(?P<display_id>[^/?#&]+))`]);
URL_REGEXS.set('watch.pokemon.com', [String.raw`https?://watch\.pokemon\.com/[a-z]{2}-[a-z]{2}/(?:#/)?player(?:\.html)?\?id=(?P<id>[a-z0-9]{32})`]);
URL_REGEXS.set('www.pokergo.com', [String.raw`https?://(?:www\.)?pokergo\.com/videos/(?P<id>[^&$#/?]+)`, String.raw`https?://(?:www\.)?pokergo\.com/collections/(?P<id>[^&$#/?]+)`]);
URL_REGEXS.set('polsatgo.pl', [String.raw`https?://(?:www\.)?polsat(?:box)?go\.pl/.+/(?P<id>[0-9a-fA-F]+)(?:[/#?]|$)`]);
URL_REGEXS.set('jedynka.polskieradio.pl', [String.raw`https?://(?:[^/]+\.)?polskieradio(?:24)?\.pl/artykul/(?P<id>\d+)`, String.raw`https?://(?:[^/]+\.)?polskieradio\.pl/audycj[ae]/(?P<id>\d+)`]);
URL_REGEXS.set('trojka.polskieradio.pl', [String.raw`https?://(?:[^/]+\.)?polskieradio(?:24)?\.pl/artykul/(?P<id>\d+)`, String.raw`https?://(?:[^/]+\.)?polskieradio\.pl/audycj[ae]/(?P<id>\d+)`]);
URL_REGEXS.set('www.polskieradio.pl', [String.raw`https?://(?:www\.)?polskieradio\.pl/\d+(?:,[^/]+)?/(?P<id>\d+)`, String.raw`https?://(?:www\.)?polskieradio(?:24)?\.pl/\d+/\d+/[Aa]rtykul/(?P<id>\d+)`]);
URL_REGEXS.set('radiokierowcow.pl', [String.raw`https?://(?:www\.)?radiokierowcow\.pl/artykul/(?P<id>[0-9]+)`]);
URL_REGEXS.set('polskieradio24.pl', [String.raw`https?://(?:www\.)?polskieradio(?:24)?\.pl/\d+/\d+/[Aa]rtykul/(?P<id>\d+)`]);
URL_REGEXS.set('player.polskieradio.pl', [String.raw`https?://player\.polskieradio\.pl/anteny/(?P<id>[^/]+)`]);
URL_REGEXS.set('podcasty.polskieradio.pl', [String.raw`https?://podcasty\.polskieradio\.pl/track/(?P<id>[a-f\d]{8}(?:-[a-f\d]{4}){4}[a-f\d]{8})`, String.raw`https?://podcasty\.polskieradio\.pl/podcast/(?P<id>\d+)`]);
URL_REGEXS.set('popcorntimes.tv', [String.raw`https?://popcorntimes\.tv/[^/]+/m/(?P<id>[^/]+)/(?P<display_id>[^/?#&]+)`]);
URL_REGEXS.set('animemanga.popcorntv.it', [String.raw`https?://[^/]+\.popcorntv\.it/guarda/(?P<display_id>[^/]+)/(?P<id>\d+)`]);
URL_REGEXS.set('cinema.popcorntv.it', [String.raw`https?://[^/]+\.popcorntv\.it/guarda/(?P<display_id>[^/]+)/(?P<id>\d+)`]);
URL_REGEXS.set('www.porn.com', [String.raw`https?://(?:[a-zA-Z]+\.)?porn\.com/videos/(?:(?P<display_id>[^/]+)-)?(?P<id>\d+)`]);
URL_REGEXS.set('se.porn.com', [String.raw`https?://(?:[a-zA-Z]+\.)?porn\.com/videos/(?:(?P<display_id>[^/]+)-)?(?P<id>\d+)`]);
URL_REGEXS.set('www.pornerbros.com', [String.raw`https?://(?:(?P<kind>www|m)\.)?pornerbros\.com/(?:videos/(?P<display_id>[^/]+)_|embed/)(?P<id>\d+)`]);
URL_REGEXS.set('m.pornerbros.com', [String.raw`https?://(?:(?P<kind>www|m)\.)?pornerbros\.com/(?:videos/(?P<display_id>[^/]+)_|embed/)(?P<id>\d+)`]);
URL_REGEXS.set('pornez.net', [String.raw`https?://(?:www\.)?pornez\.net/video(?P<id>[0-9]+)/`]);
URL_REGEXS.set('www.pornflip.com', [String.raw`https?://(?:www\.)?pornflip\.com/(?:(embed|sv|v)/)?(?P<id>[^/]+)`]);
URL_REGEXS.set('www.pornhd.com', [String.raw`https?://(?:www\.)?pornhd\.com/(?:[a-z]{2,4}/)?videos/(?P<id>\d+)(?:/(?P<display_id>.+))?`]);
URL_REGEXS.set('www.pornhub.com', [String.raw`(?x)https?://(?:(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/(?:(?:view_video\.php|video/show)\?viewkey=|embed/)|(?:www\.)?thumbzilla\.com/video/)(?P<id>[\da-z]+)`, String.raw`https?://(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/(?!playlist/)(?P<id>(?:[^/]+/)*[^/?#&]+)`, String.raw`(?P<url>https?://(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/playlist/(?P<id>[^/?#&]+))`, String.raw`(?P<url>https?://(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/(?:(?:user|channel)s|model|pornstar)/(?P<id>[^/?#&]+))(?:[?#&]|/(?!videos)|$)`, String.raw`(?P<url>https?://(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/(?:(?:user|channel)s|model|pornstar)/(?P<id>[^/]+)/videos/upload)`]);
URL_REGEXS.set('fr.pornhub.com', [String.raw`(?x)https?://(?:(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/(?:(?:view_video\.php|video/show)\?viewkey=|embed/)|(?:www\.)?thumbzilla\.com/video/)(?P<id>[\da-z]+)`]);
URL_REGEXS.set('www.thumbzilla.com', [String.raw`(?x)https?://(?:(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/(?:(?:view_video\.php|video/show)\?viewkey=|embed/)|(?:www\.)?thumbzilla\.com/video/)(?P<id>[\da-z]+)`]);
URL_REGEXS.set('www.pornhub.net', [String.raw`(?x)https?://(?:(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/(?:(?:view_video\.php|video/show)\?viewkey=|embed/)|(?:www\.)?thumbzilla\.com/video/)(?P<id>[\da-z]+)`]);
URL_REGEXS.set('www.pornhub.org', [String.raw`(?x)https?://(?:(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/(?:(?:view_video\.php|video/show)\?viewkey=|embed/)|(?:www\.)?thumbzilla\.com/video/)(?P<id>[\da-z]+)`]);
URL_REGEXS.set('www.pornhubpremium.com', [String.raw`(?x)https?://(?:(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/(?:(?:view_video\.php|video/show)\?viewkey=|embed/)|(?:www\.)?thumbzilla\.com/video/)(?P<id>[\da-z]+)`, String.raw`(?P<url>https?://(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/(?:(?:user|channel)s|model|pornstar)/(?P<id>[^/?#&]+))(?:[?#&]|/(?!videos)|$)`]);
URL_REGEXS.set('pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd.onion', [String.raw`(?x)https?://(?:(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/(?:(?:view_video\.php|video/show)\?viewkey=|embed/)|(?:www\.)?thumbzilla\.com/video/)(?P<id>[\da-z]+)`, String.raw`https?://(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/(?!playlist/)(?P<id>(?:[^/]+/)*[^/?#&]+)`, String.raw`(?P<url>https?://(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/(?:(?:user|channel)s|model|pornstar)/(?P<id>[^/?#&]+))(?:[?#&]|/(?!videos)|$)`, String.raw`(?P<url>https?://(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/(?:(?:user|channel)s|model|pornstar)/(?P<id>[^/]+)/videos/upload)`]);
URL_REGEXS.set('de.pornhub.com', [String.raw`(?P<url>https?://(?:[^/]+\.)?(?:(?P<host>pornhub(?:premium)?\.(?:com|net|org))|pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd\.onion)/playlist/(?P<id>[^/?#&]+))`]);
URL_REGEXS.set('www.pornotube.com', [String.raw`https?://(?:\w+\.)?pornotube\.com/(?:[^?#]*?)/video/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.pornovoisines.com', [String.raw`https?://(?:www\.)?pornovoisines\.com/videos/show/(?P<id>\d+)/(?P<display_id>[^/.]+)`]);
URL_REGEXS.set('www.pornoxo.com', [String.raw`https?://(?:www\.)?pornoxo\.com/videos/(?P<id>\d+)/(?P<display_id>[^/]+)\.html`]);
URL_REGEXS.set('www.porntube.com', [String.raw`https?://(?:(?P<kind>www|m)\.)?porntube\.com/(?:videos/(?P<display_id>[^/]+)_|embed/)(?P<id>\d+)`]);
URL_REGEXS.set('m.porntube.com', [String.raw`https?://(?:(?P<kind>www|m)\.)?porntube\.com/(?:videos/(?P<display_id>[^/]+)_|embed/)(?P<id>\d+)`]);
URL_REGEXS.set('prankcast.com', [String.raw`https?://(?:www\.)?prankcast\.com/[^/?#]+/showreel/(?P<id>\d+)-(?P<display_id>[^/?#]+)`]);
URL_REGEXS.set('www.premiershiprugby.com', [String.raw`https?://(?:\w+\.)premiershiprugby\.(?:com)/watch/(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.presstv.ir', [String.raw`https?://(?:www\.)?presstv\.ir/[^/]+/(?P<y>\d+)/(?P<m>\d+)/(?P<d>\d+)/(?P<id>\d+)/(?P<display_id>[^/]+)?`]);
URL_REGEXS.set('www.projectveritas.com', [String.raw`https?://(?:www\.)?projectveritas\.com/(?P<type>news|video)/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.prosieben.de', [String.raw`(?x)https?://(?:www\.)?(?:(?:beta\.)?(?:prosieben(?:maxx)?|sixx|sat1(?:gold)?|kabeleins(?:doku)?|the-voice-of-germany|advopedia)\.(?:de|at|ch)|ran\.de|fem\.com|advopedia\.de|galileo\.tv/video)/(?P<id>.+)`]);
URL_REGEXS.set('www.prosiebenmaxx.de', [String.raw`(?x)https?://(?:www\.)?(?:(?:beta\.)?(?:prosieben(?:maxx)?|sixx|sat1(?:gold)?|kabeleins(?:doku)?|the-voice-of-germany|advopedia)\.(?:de|at|ch)|ran\.de|fem\.com|advopedia\.de|galileo\.tv/video)/(?P<id>.+)`]);
URL_REGEXS.set('www.sixx.de', [String.raw`(?x)https?://(?:www\.)?(?:(?:beta\.)?(?:prosieben(?:maxx)?|sixx|sat1(?:gold)?|kabeleins(?:doku)?|the-voice-of-germany|advopedia)\.(?:de|at|ch)|ran\.de|fem\.com|advopedia\.de|galileo\.tv/video)/(?P<id>.+)`]);
URL_REGEXS.set('www.sat1.de', [String.raw`(?x)https?://(?:www\.)?(?:(?:beta\.)?(?:prosieben(?:maxx)?|sixx|sat1(?:gold)?|kabeleins(?:doku)?|the-voice-of-germany|advopedia)\.(?:de|at|ch)|ran\.de|fem\.com|advopedia\.de|galileo\.tv/video)/(?P<id>.+)`]);
URL_REGEXS.set('www.kabeleins.de', [String.raw`(?x)https?://(?:www\.)?(?:(?:beta\.)?(?:prosieben(?:maxx)?|sixx|sat1(?:gold)?|kabeleins(?:doku)?|the-voice-of-germany|advopedia)\.(?:de|at|ch)|ran\.de|fem\.com|advopedia\.de|galileo\.tv/video)/(?P<id>.+)`]);
URL_REGEXS.set('www.ran.de', [String.raw`(?x)https?://(?:www\.)?(?:(?:beta\.)?(?:prosieben(?:maxx)?|sixx|sat1(?:gold)?|kabeleins(?:doku)?|the-voice-of-germany|advopedia)\.(?:de|at|ch)|ran\.de|fem\.com|advopedia\.de|galileo\.tv/video)/(?P<id>.+)`]);
URL_REGEXS.set('www.the-voice-of-germany.de', [String.raw`(?x)https?://(?:www\.)?(?:(?:beta\.)?(?:prosieben(?:maxx)?|sixx|sat1(?:gold)?|kabeleins(?:doku)?|the-voice-of-germany|advopedia)\.(?:de|at|ch)|ran\.de|fem\.com|advopedia\.de|galileo\.tv/video)/(?P<id>.+)`]);
URL_REGEXS.set('www.fem.com', [String.raw`(?x)https?://(?:www\.)?(?:(?:beta\.)?(?:prosieben(?:maxx)?|sixx|sat1(?:gold)?|kabeleins(?:doku)?|the-voice-of-germany|advopedia)\.(?:de|at|ch)|ran\.de|fem\.com|advopedia\.de|galileo\.tv/video)/(?P<id>.+)`]);
URL_REGEXS.set('www.kabeleinsdoku.de', [String.raw`(?x)https?://(?:www\.)?(?:(?:beta\.)?(?:prosieben(?:maxx)?|sixx|sat1(?:gold)?|kabeleins(?:doku)?|the-voice-of-germany|advopedia)\.(?:de|at|ch)|ran\.de|fem\.com|advopedia\.de|galileo\.tv/video)/(?P<id>.+)`]);
URL_REGEXS.set('www.sat1gold.de', [String.raw`(?x)https?://(?:www\.)?(?:(?:beta\.)?(?:prosieben(?:maxx)?|sixx|sat1(?:gold)?|kabeleins(?:doku)?|the-voice-of-germany|advopedia)\.(?:de|at|ch)|ran\.de|fem\.com|advopedia\.de|galileo\.tv/video)/(?P<id>.+)`]);
URL_REGEXS.set('www.galileo.tv', [String.raw`(?x)https?://(?:www\.)?(?:(?:beta\.)?(?:prosieben(?:maxx)?|sixx|sat1(?:gold)?|kabeleins(?:doku)?|the-voice-of-germany|advopedia)\.(?:de|at|ch)|ran\.de|fem\.com|advopedia\.de|galileo\.tv/video)/(?P<id>.+)`]);
URL_REGEXS.set('www.advopedia.de', [String.raw`(?x)https?://(?:www\.)?(?:(?:beta\.)?(?:prosieben(?:maxx)?|sixx|sat1(?:gold)?|kabeleins(?:doku)?|the-voice-of-germany|advopedia)\.(?:de|at|ch)|ran\.de|fem\.com|advopedia\.de|galileo\.tv/video)/(?P<id>.+)`]);
URL_REGEXS.set('beta.prx.org', [String.raw`https?://(?:(?:beta|listen)\.)?prx.org/accounts/(?P<id>\d+)`, String.raw`https?://(?:(?:beta|listen)\.)?prx.org/series/(?P<id>\d+)`, String.raw`https?://(?:(?:beta|listen)\.)?prx.org/stories/(?P<id>\d+)`]);
URL_REGEXS.set('listen.prx.org', [String.raw`https?://(?:(?:beta|listen)\.)?prx.org/stories/(?P<id>\d+)`]);
URL_REGEXS.set('puhutv.com', [String.raw`https?://(?:www\.)?puhutv\.com/(?P<id>[^/?#&]+)-izle`, String.raw`https?://(?:www\.)?puhutv\.com/(?P<id>[^/?#&]+)-detay`]);
URL_REGEXS.set('www.puls4.com', [String.raw`https?://(?:www\.)?puls4\.com/(?P<id>[^?#&]+)`]);
URL_REGEXS.set('pyvideo.org', [String.raw`https?://(?:www\.)?pyvideo\.org/(?P<category>[^/]+)/(?P<id>[^/?#&.]+)`]);
URL_REGEXS.set('www.qingting.fm', [String.raw`https?://(?:www\.|m\.)?(?:qingting\.fm|qtfm\.cn)/v?channels/(?P<channel>\d+)/programs/(?P<id>\d+)`]);
URL_REGEXS.set('m.qtfm.cn', [String.raw`https?://(?:www\.|m\.)?(?:qingting\.fm|qtfm\.cn)/v?channels/(?P<channel>\d+)/programs/(?P<id>\d+)`]);
URL_REGEXS.set('y.qq.com', [String.raw`https?://y\.qq\.com/n/yqq/song/(?P<id>[0-9A-Za-z]+)\.html`, String.raw`https?://y\.qq\.com/n/yqq/album/(?P<id>[0-9A-Za-z]+)\.html`, String.raw`https?://y\.qq\.com/n/yqq/playlist/(?P<id>[0-9]+)\.html`, String.raw`https?://y\.qq\.com/n/yqq/singer/(?P<id>[0-9A-Za-z]+)\.html`, String.raw`https?://y\.qq\.com/n/yqq/toplist/(?P<id>[0-9]+)\.html`]);
URL_REGEXS.set('quantum-tv.com', [String.raw`(?x)https?://(?:www\.)?quantum\-tv\.com/(?:[^?#]+\?(?:[^#]+&)?program=(?P<vid2>\d+)|(?:program|watch)/[^/]+/(?P<vid1>\d+))`, String.raw`(?x)https?://(?:www\.)?quantum\-tv\.com/(?:[^?#]+\?(?:[^#]+&)?channel=(?P<vid2>[^/?&#]+)|live/(?P<vid1>[^/?&#]+))`, String.raw`(?x)https?://(?:www\.)?quantum\-tv\.com/(?:[^?#]+\?(?:[^#]+&)?recording=(?P<vid2>\d+)(?P<vid1>))`]);
URL_REGEXS.set('www.qub.ca', [String.raw`https?://(?:www\.)?qub\.ca/(?:[^/]+/)*[0-9a-z-]+-(?P<id>\d+)`]);
URL_REGEXS.set('videos.r7.com', [String.raw`(?x)https?://(?:(?:[a-zA-Z]+)\.r7\.com(?:/[^/]+)+/idmedia/|noticias\.r7\.com(?:/[^/]+)+/[^/]+-|player\.r7\.com/video/i/)(?P<id>[\da-f]{24})`]);
URL_REGEXS.set('esportes.r7.com', [String.raw`(?x)https?://(?:(?:[a-zA-Z]+)\.r7\.com(?:/[^/]+)+/idmedia/|noticias\.r7\.com(?:/[^/]+)+/[^/]+-|player\.r7\.com/video/i/)(?P<id>[\da-f]{24})`]);
URL_REGEXS.set('noticias.r7.com', [String.raw`(?x)https?://(?:(?:[a-zA-Z]+)\.r7\.com(?:/[^/]+)+/idmedia/|noticias\.r7\.com(?:/[^/]+)+/[^/]+-|player\.r7\.com/video/i/)(?P<id>[\da-f]{24})`]);
URL_REGEXS.set('player.r7.com', [String.raw`(?x)https?://(?:(?:[a-zA-Z]+)\.r7\.com(?:/[^/]+)+/idmedia/|noticias\.r7\.com(?:/[^/]+)+/[^/]+-|player\.r7\.com/video/i/)(?P<id>[\da-f]{24})`]);
URL_REGEXS.set('tv.r7.com', [String.raw`https?://(?:[a-zA-Z]+)\.r7\.com/(?:[^/]+/)+[^/?#&]+-(?P<id>\d+)`]);
URL_REGEXS.set('radiko.jp', [String.raw`https?://(?:www\.)?radiko\.jp/#!/ts/(?P<station>[A-Z0-9-]+)/(?P<id>\d+)`, String.raw`https?://(?:www\.)?radiko\.jp/#!/live/(?P<id>[A-Z0-9-]+)`]);
URL_REGEXS.set('ndr2.radio.de', [String.raw`https?://(?P<id>.+?)\.(?:radio\.(?:de|at|fr|pt|es|pl|it)|rad\.io)`]);
URL_REGEXS.set('www.radiobremen.de', [String.raw`http?://(?:www\.)?radiobremen\.de/mediathek/(?:index\.html)?\?id=(?P<id>[0-9]+)`]);
URL_REGEXS.set('ici.radio-canada.ca', [String.raw`(?:radiocanada:|https?://ici\.radio-canada\.ca/widgets/mediaconsole/)(?P<app_code>[^:/]+)[:/](?P<id>[0-9]+)`, String.raw`https?://ici\.radio-canada\.ca/([^/]+/)*media-(?P<id>[0-9]+)`]);
URL_REGEXS.set('maison.radiofrance.fr', [String.raw`^https?://maison\.radiofrance\.fr/radiovisions/(?P<id>[^?#]+)`]);
URL_REGEXS.set('www.radiojavan.com', [String.raw`https?://(?:www\.)?radiojavan\.com/videos/video/(?P<id>[^/]+)/?`]);
URL_REGEXS.set('radiokapital.pl', [String.raw`https?://(?:www\.)?radiokapital\.pl/shows/[a-z\d-]+/(?P<id>[a-z\d-]+)`, String.raw`https?://(?:www\.)?radiokapital\.pl/shows/(?P<id>[a-z\d-]+)/?(?:$|[?#])`]);
URL_REGEXS.set('player.radiozet.pl', [String.raw`https?://player\.radiozet\.pl\/Podcasty/.*?/(?P<id>.+)`]);
URL_REGEXS.set('rad.live', [String.raw`https?://(?:www\.)?rad\.live/content/(?P<content_type>feature|episode)/(?P<id>[a-f0-9-]+)`, String.raw`https?://(?:www\.)?rad\.live/content/channel/(?P<id>[a-f0-9-]+)`, String.raw`https?://(?:www\.)?rad\.live/content/season/(?P<id>[a-f0-9-]+)`]);
URL_REGEXS.set('www.raisport.rai.it', [String.raw`https?://[^/]+\.(?:rai\.(?:it|tv))/.+?-(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})(?:-.+?)?\.html`]);
URL_REGEXS.set('www.rai.it', [String.raw`https?://[^/]+\.(?:rai\.(?:it|tv))/.+?-(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})(?:-.+?)?\.html`]);
URL_REGEXS.set('www.rainews.it', [String.raw`https?://(www\.)?rainews\.it/(?!articoli)[^?#]+-(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})(?:-[^/?#]+)?\.html`]);
URL_REGEXS.set('www.raiplay.it', [String.raw`(?P<base>https?://(?:www\.)?raiplay\.it/.+?-(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}))\.(?:html|json)`, String.raw`(?P<base>https?://(?:www\.)?raiplay\.it/dirette/(?P<id>[^/?#&]+))`, String.raw`(?P<base>https?://(?:www\.)?raiplay\.it/programmi/(?P<id>[^/?#&]+))(?:/(?P<extra_id>[^?#&]+))?`]);
URL_REGEXS.set('www.raiplaysound.it', [String.raw`(?P<base>https?://(?:www\.)?raiplaysound\.it/.+?-(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}))\.(?:html|json)`, String.raw`(?P<base>https?://(?:www\.)?raiplaysound\.it/(?P<id>[^/?#&]+)$)`, String.raw`(?P<base>https?://(?:www\.)?raiplaysound\.it/(?:programmi|playlist|audiolibri)/(?P<id>[^/?#&]+))(?:/(?P<extra_id>[^?#&]+))?`]);
URL_REGEXS.set('raisudtirol.rai.it', [String.raw`https?://raisudtirol\.rai\.it/.+?media=(?P<id>[TP]tv\d+)`]);
URL_REGEXS.set('www.raywenderlich.com', [String.raw`(?x)https?://(?:videos\.raywenderlich\.com/courses|(?:www\.)?raywenderlich\.com)/(?P<course_id>[^/]+)/lessons/(?P<id>\d+)`, String.raw`(?x)https?://(?:videos\.raywenderlich\.com/courses|(?:www\.)?raywenderlich\.com)/(?P<id>[^/]+)`]);
URL_REGEXS.set('videos.raywenderlich.com', [String.raw`(?x)https?://(?:videos\.raywenderlich\.com/courses|(?:www\.)?raywenderlich\.com)/(?P<course_id>[^/]+)/lessons/(?P<id>\d+)`]);
URL_REGEXS.set('www.rbmaradio.com', [String.raw`https?://(?:www\.)?(?:rbmaradio|redbullradio)\.com/shows/(?P<show_id>[^/]+)/episodes/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('video.corriere.it', [String.raw`(?x)https?://(?P<vid>video|viaggi)\.(?P<cdn>(?:corrieredelmezzogiorno\.|corrieredelveneto\.|corrieredibologna\.|corrierefiorentino\.)?corriere\.it|(?:gazzanet\.)?gazzetta\.it)/(?!video-embed/).+?/(?P<id>[^/\?]+)(?=\?|/$|$)`, String.raw`(?x)https?://(?P<vid>video)\.(?P<cdn>(?:rcs|(?:corriere\w+\.)?corriere|(?:gazzanet\.)?gazzetta)\.it)/video-embed/(?P<id>[^/=&\?]+?)(?:$|\?)`]);
URL_REGEXS.set('viaggi.corriere.it', [String.raw`(?x)https?://(?P<vid>video|viaggi)\.(?P<cdn>(?:corrieredelmezzogiorno\.|corrieredelveneto\.|corrieredibologna\.|corrierefiorentino\.)?corriere\.it|(?:gazzanet\.)?gazzetta\.it)/(?!video-embed/).+?/(?P<id>[^/\?]+)(?=\?|/$|$)`]);
URL_REGEXS.set('video.gazzetta.it', [String.raw`(?x)https?://(?P<vid>video|viaggi)\.(?P<cdn>(?:corrieredelmezzogiorno\.|corrieredelveneto\.|corrieredibologna\.|corrierefiorentino\.)?corriere\.it|(?:gazzanet\.)?gazzetta\.it)/(?!video-embed/).+?/(?P<id>[^/\?]+)(?=\?|/$|$)`, String.raw`(?x)https?://(?P<vid>video)\.(?P<cdn>(?:rcs|(?:corriere\w+\.)?corriere|(?:gazzanet\.)?gazzetta)\.it)/video-embed/(?P<id>[^/=&\?]+?)(?:$|\?)`]);
URL_REGEXS.set('video.rcs.it', [String.raw`(?x)https?://(?P<vid>video)\.(?P<cdn>(?:rcs|(?:corriere\w+\.)?corriere|(?:gazzanet\.)?gazzetta)\.it)/video-embed/(?P<id>[^/=&\?]+?)(?:$|\?)`]);
URL_REGEXS.set('video.gazzanet.gazzetta.it', [String.raw`(?x)https?://(?P<vid>video)\.(?P<cdn>(?:rcs|(?:corriere\w+\.)?corriere|(?:gazzanet\.)?gazzetta)\.it)/video-embed/(?P<id>[^/=&\?]+?)(?:$|\?)`]);
URL_REGEXS.set('www.leitv.it', [String.raw`(?x)https?://www\.(?P<cdn>leitv\.it|youreporter\.it)/(?:[^/]+/)?(?P<id>[^/]+?)(?:$|\?|/)`]);
URL_REGEXS.set('www.youreporter.it', [String.raw`(?x)https?://www\.(?P<cdn>leitv\.it|youreporter\.it)/(?:[^/]+/)?(?P<id>[^/]+?)(?:$|\?|/)`]);
URL_REGEXS.set('www.rctiplus.com', [String.raw`https://www\.rctiplus\.com/(?:programs/\d+?/.*?/)?(?P<type>episode|clip|extra|live-event|missed-event)/(?P<id>\d+)/(?P<display_id>[^/?#&]+)`, String.raw`https://www\.rctiplus\.com/programs/(?P<id>\d+)/(?P<display_id>[^/?#&]+)(?:/(?P<type>episodes|extras|clips))?`, String.raw`https://www\.rctiplus\.com/((tv/(?P<tvname>\w+))|(?P<eventname>live-event|missed-event))`]);
URL_REGEXS.set('www.rds.ca', [String.raw`https?://(?:www\.)?rds\.ca/vid(?:[eé]|%C3%A9)os/(?:[^/]+/)*(?P<id>[^/]+)-\d+\.\d+`]);
URL_REGEXS.set('www.redbull.com', [String.raw`https?://(?:www\.)?redbull\.com/(?P<region>[a-z]{2,3})-(?P<lang>[a-z]{2})/(?P<type>(?:episode|film|(?:(?:recap|trailer)-)?video)s|live)/(?!AP-|rrn:content:)(?P<id>[^/?#&]+)`, String.raw`https?://(?:www\.)?redbull\.com/embed/(?P<id>rrn:content:[^:]+:[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}:[a-z]{2}-[A-Z]{2,3})`, String.raw`https?://(?:www\.)?redbull(?:\.tv|\.com(?:/[^/]+)?(?:/tv)?)(?:/events/[^/]+)?/(?:videos?|live|(?:film|episode)s)/(?P<id>AP-\w+)`, String.raw`https?://(?:www\.)?redbull\.com/(?P<region>[a-z]{2,3})-(?P<lang>[a-z]{2})/tv/(?:video|live|film)/(?P<id>rrn:content:[^:]+:[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`]);
URL_REGEXS.set('www.redbull.tv', [String.raw`https?://(?:www\.)?redbull(?:\.tv|\.com(?:/[^/]+)?(?:/tv)?)(?:/events/[^/]+)?/(?:videos?|live|(?:film|episode)s)/(?P<id>AP-\w+)`]);
URL_REGEXS.set('www.reddit.com', [String.raw`https?://(?P<subdomain>[^/]+\.)?reddit(?:media)?\.com/r/(?P<slug>[^/]+/comments/(?P<id>[^/?#&]+))`]);
URL_REGEXS.set('old.reddit.com', [String.raw`https?://(?P<subdomain>[^/]+\.)?reddit(?:media)?\.com/r/(?P<slug>[^/]+/comments/(?P<id>[^/?#&]+))`]);
URL_REGEXS.set('nm.reddit.com', [String.raw`https?://(?P<subdomain>[^/]+\.)?reddit(?:media)?\.com/r/(?P<slug>[^/]+/comments/(?P<id>[^/?#&]+))`]);
URL_REGEXS.set('www.redditmedia.com', [String.raw`https?://(?P<subdomain>[^/]+\.)?reddit(?:media)?\.com/r/(?P<slug>[^/]+/comments/(?P<id>[^/?#&]+))`]);
URL_REGEXS.set('www.redgifs.com', [String.raw`https?://(?:(?:www\.)?redgifs\.com/watch/|thumbs2\.redgifs\.com/)(?P<id>[^-/?#\.]+)`, String.raw`https?://(?:www\.)?redgifs\.com/browse\?(?P<query>[^#]+)`, String.raw`https?://(?:www\.)?redgifs\.com/users/(?P<username>[^/?#]+)(?:\?(?P<query>[^#]+))?`]);
URL_REGEXS.set('thumbs2.redgifs.com', [String.raw`https?://(?:(?:www\.)?redgifs\.com/watch/|thumbs2\.redgifs\.com/)(?P<id>[^-/?#\.]+)`]);
URL_REGEXS.set('www.redtube.com', [String.raw`https?://(?:(?:\w+\.)?redtube\.com/|embed\.redtube\.com/\?.*?\bid=)(?P<id>[0-9]+)`]);
URL_REGEXS.set('embed.redtube.com', [String.raw`https?://(?:(?:\w+\.)?redtube\.com/|embed\.redtube\.com/\?.*?\bid=)(?P<id>[0-9]+)`]);
URL_REGEXS.set('it.redtube.com', [String.raw`https?://(?:(?:\w+\.)?redtube\.com/|embed\.redtube\.com/\?.*?\bid=)(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.regio-tv.de', [String.raw`https?://(?:www\.)?regio-tv\.de/video/(?P<id>[0-9]+)`]);
URL_REGEXS.set('ren.tv', [String.raw`(?:rentv:|https?://(?:www\.)?ren\.tv/(?:player|video/epizod)/)(?P<id>\d+)`, String.raw`https?://(?:www\.)?ren\.tv/novosti/\d{4}-\d{2}-\d{2}/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.restudy.dk', [String.raw`https?://(?:(?:www|portal)\.)?restudy\.dk/video/[^/]+/id/(?P<id>[0-9]+)`, String.raw`.*`]);
URL_REGEXS.set('portal.restudy.dk', [String.raw`https?://(?:(?:www|portal)\.)?restudy\.dk/video/[^/]+/id/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.reuters.com', [String.raw`https?://(?:www\.)?reuters\.com/.*?\?.*?videoId=(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.reverbnation.com', [String.raw`^https?://(?:www\.)?reverbnation\.com/.*?/song/(?P<id>\d+).*?$`]);
URL_REGEXS.set('mediahub.rice.edu', [String.raw`https?://mediahub\.rice\.edu/app/[Pp]ortal/video\.aspx\?(?P<query>.+)`]);
URL_REGEXS.set('rmcdecouverte.bfmtv.com', [String.raw`https?://rmcdecouverte\.bfmtv\.com/(?:[^?#]*_(?P<id>\d+)|mediaplayer-direct)/?(?:[#?]|$)`]);
URL_REGEXS.set('www.rockstargames.com', [String.raw`https?://(?:www\.)?rockstargames\.com/videos(?:/video/|#?/?\?.*\bvideo=)(?P<id>\d+)`]);
URL_REGEXS.set('www.rokfin.com', [String.raw`https?://(?:www\.)?rokfin\.com/(?P<id>(?P<type>post|stream)/\d+)`, String.raw`https?://(?:www\.)?rokfin\.com/stack/(?P<id>[^/]+)`]);
URL_REGEXS.set('rokfin.com', [String.raw`https?://(?:www\.)?rokfin\.com/(?P<id>(?P<type>post|stream)/\d+)`, String.raw`https?://(?:www\.)?rokfin\.com/(?!((feed/?)|(discover/?)|(channels/?))$)(?P<id>[^/]+)/?$`]);
URL_REGEXS.set('roosterteeth.com', [String.raw`https?://(?:.+?\.)?roosterteeth\.com/(?:episode|watch)/(?P<id>[^/?#&]+)`, String.raw`https?://(?:.+?\.)?roosterteeth\.com/series/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('achievementhunter.roosterteeth.com', [String.raw`https?://(?:.+?\.)?roosterteeth\.com/(?:episode|watch)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('funhaus.roosterteeth.com', [String.raw`https?://(?:.+?\.)?roosterteeth\.com/(?:episode|watch)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('screwattack.roosterteeth.com', [String.raw`https?://(?:.+?\.)?roosterteeth\.com/(?:episode|watch)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('theknow.roosterteeth.com', [String.raw`https?://(?:.+?\.)?roosterteeth\.com/(?:episode|watch)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.rottentomatoes.com', [String.raw`https?://(?:www\.)?rottentomatoes\.com/m/[^/]+/trailers/(?P<id>\d+)`]);
URL_REGEXS.set('prehravac.rozhlas.cz', [String.raw`https?://(?:www\.)?prehravac\.rozhlas\.cz/audio/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.rtbf.be', [String.raw`(?x)https?://(?:www\.)?rtbf\.be/(?:video/[^?]+\?.*\bid=|ouftivi/(?:[^/]+/)*[^?]+\?.*\bvideoId=|auvio/[^/]+\?.*\b(?P<live>l)?id=)(?P<id>\d+)`]);
URL_REGEXS.set('rtd.rt.com', [String.raw`https?://rtd\.rt\.com/(?:(?:series|shows)/[^/]+|films)/(?P<id>[^/?$&#]+)`, String.raw`https?://rtd\.rt\.com/(?:series|shows)/(?P<id>[^/]+)/$`]);
URL_REGEXS.set('www.rte.ie', [String.raw`https?://(?:www\.)?rte\.ie/player/[^/]{2,3}/show/[^/]+/(?P<id>[0-9]+)`, String.raw`https?://(?:www\.)?rte\.ie/radio/utils/radioplayer/rteradioweb\.html#!rii=(?:b?[0-9]*)(?:%3A|:|%5F|_)(?P<id>[0-9]+)`]);
URL_REGEXS.set('rte.ie', [String.raw`https?://(?:www\.)?rte\.ie/radio/utils/radioplayer/rteradioweb\.html#!rii=(?:b?[0-9]*)(?:%3A|:|%5F|_)(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.rtl.lu', [String.raw`https?://(?:(www|5minutes|today)\.)rtl\.lu/(?:[\w-]+)/(?:[\w-]+)/a/(?P<id>\d+)\.html`, String.raw`https?://(?:www\.)?rtl\.lu/(tele/(?P<slug>[\w-]+)/v/|video/)(?P<id>\d+)(\.html)?`, String.raw`https?://www\.rtl\.lu/(?:tele|radio)/(?P<id>live(?:-\d+)?|lauschteren)`, String.raw`https?://www\.rtl\.lu/radio/(?:[\w-]+)/s/(?P<id>\d+)(\.html)?`]);
URL_REGEXS.set('5minutes.rtl.lu', [String.raw`https?://(?:(www|5minutes|today)\.)rtl\.lu/(?:[\w-]+)/(?:[\w-]+)/a/(?P<id>\d+)\.html`]);
URL_REGEXS.set('today.rtl.lu', [String.raw`https?://(?:(www|5minutes|today)\.)rtl\.lu/(?:[\w-]+)/(?:[\w-]+)/a/(?P<id>\d+)\.html`]);
URL_REGEXS.set('www.rtlxl.nl', [String.raw`(?x)https?://(?:(?:www|static)\.)?(?:rtlxl\.nl/(?:[^\#]*\#!|programma)/[^/]+/|rtl\.nl/(?:(?:system/videoplayer/(?:[^/]+/)+(?:video_)?embed\.html|embed)\b.+?\buuid=|video/)|embed\.rtl\.nl/\#uuid=)(?P<id>[0-9a-f-]+)`]);
URL_REGEXS.set('www.rtl.nl', [String.raw`(?x)https?://(?:(?:www|static)\.)?(?:rtlxl\.nl/(?:[^\#]*\#!|programma)/[^/]+/|rtl\.nl/(?:(?:system/videoplayer/(?:[^/]+/)+(?:video_)?embed\.html|embed)\b.+?\buuid=|video/)|embed\.rtl\.nl/\#uuid=)(?P<id>[0-9a-f-]+)`]);
URL_REGEXS.set('rtlxl.nl', [String.raw`(?x)https?://(?:(?:www|static)\.)?(?:rtlxl\.nl/(?:[^\#]*\#!|programma)/[^/]+/|rtl\.nl/(?:(?:system/videoplayer/(?:[^/]+/)+(?:video_)?embed\.html|embed)\b.+?\buuid=|video/)|embed\.rtl\.nl/\#uuid=)(?P<id>[0-9a-f-]+)`]);
URL_REGEXS.set('static.rtl.nl', [String.raw`(?x)https?://(?:(?:www|static)\.)?(?:rtlxl\.nl/(?:[^\#]*\#!|programma)/[^/]+/|rtl\.nl/(?:(?:system/videoplayer/(?:[^/]+/)+(?:video_)?embed\.html|embed)\b.+?\buuid=|video/)|embed\.rtl\.nl/\#uuid=)(?P<id>[0-9a-f-]+)`]);
URL_REGEXS.set('embed.rtl.nl', [String.raw`(?x)https?://(?:(?:www|static)\.)?(?:rtlxl\.nl/(?:[^\#]*\#!|programma)/[^/]+/|rtl\.nl/(?:(?:system/videoplayer/(?:[^/]+/)+(?:video_)?embed\.html|embed)\b.+?\buuid=|video/)|embed\.rtl\.nl/\#uuid=)(?P<id>[0-9a-f-]+)`]);
URL_REGEXS.set('www.rtl2.de', [String.raw`https?://(?:www\.)?rtl2\.de/sendung/[^/]+/(?:video/(?P<vico_id>\d+)[^/]+/(?P<vivi_id>\d+)-|folge/)(?P<id>[^/?#]+)`]);
URL_REGEXS.set('you.rtl2.de', [String.raw`http?://you\.rtl2\.de/(?:video/\d+/|youplayer/index\.html\?.*?\bvid=)(?P<id>\d+)`, String.raw`http?://you\.rtl2\.de/videos/(?P<id>\d+)`]);
URL_REGEXS.set('www.rt.com', [String.raw`https?://(?:www\.)?rt\.com/[^/]+/(?:[^/]+/)?(?P<id>\d+)`]);
URL_REGEXS.set('www.rtp.pt', [String.raw`https?://(?:www\.)?rtp\.pt/play/p(?P<program_id>[0-9]+)/(?P<id>[^/?#]+)/?`]);
URL_REGEXS.set('rtrfm.com.au', [String.raw`https?://(?:www\.)?rtrfm\.com\.au/(?:shows|show-episode)/(?P<id>[^/?\#&]+)`]);
URL_REGEXS.set('www.rts.ch', [String.raw`rts:(?P<rts_id>\d+)|https?://(?:.+?\.)?rts\.ch/(?:[^/]+/){2,}(?P<id>[0-9]+)-(?P<display_id>.+?)\.html`, String.raw`(?x)https?://(?:(?:www|play)\.)?(?P<bu>srf|rts|rsi|rtr|swissinfo)\.ch/play/(?:tv|radio)/(?:[^/]+/(?P<type>video|audio)/[^?]+|popup(?P<type_2>video|audio)player)\?.*?\b(?:id=|urn=urn:[^:]+:video:)(?P<id>[0-9a-f\-]{36}|\d+)`]);
URL_REGEXS.set('pages.rts.ch', [String.raw`rts:(?P<rts_id>\d+)|https?://(?:.+?\.)?rts\.ch/(?:[^/]+/){2,}(?P<id>[0-9]+)-(?P<display_id>.+?)\.html`]);
URL_REGEXS.set('www.rtve.es', [String.raw`https?://(?:www\.)?rtve\.es/(m/)?(alacarta/videos|filmoteca)/[^/]+/[^/]+/(?P<id>\d+)`, String.raw`https?://(?:www\.)?rtve\.es/(alacarta|play)/audios/[^/]+/[^/]+/(?P<id>[0-9]+)`, String.raw`https?://(?:www\.)?rtve\.es/infantil/serie/[^/]+/video/[^/]+/(?P<id>[0-9]+)/`, String.raw`https?://(?:www\.)?rtve\.es/directo/(?P<id>[a-zA-Z0-9-]+)`, String.raw`https?://(?:www\.)?rtve\.es/television/[^/]+/[^/]+/(?P<id>\d+).shtml`]);
URL_REGEXS.set('www.rtvnh.nl', [String.raw`https?://(?:www\.)?rtvnh\.nl/video/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.rtvs.sk', [String.raw`https?://(?:www\.)?rtvs\.sk/(?:radio|televizia)/archiv(?:/\d+)?/(?P<id>\d+)/?(?:[#?]|$)`]);
URL_REGEXS.set('www.rtvslo.si', [String.raw`(?x)https?://(?:(?:365|4d)\.rtvslo.si/arhiv/[^/?#&;]+|(?:www\.)?rtvslo\.si/rtv365/arhiv)/(?P<id>\d+)`]);
URL_REGEXS.set('365.rtvslo.si', [String.raw`(?x)https?://(?:(?:365|4d)\.rtvslo.si/arhiv/[^/?#&;]+|(?:www\.)?rtvslo\.si/rtv365/arhiv)/(?P<id>\d+)`]);
URL_REGEXS.set('4d.rtvslo.si', [String.raw`(?x)https?://(?:(?:365|4d)\.rtvslo.si/arhiv/[^/?#&;]+|(?:www\.)?rtvslo\.si/rtv365/arhiv)/(?P<id>\d+)`]);
URL_REGEXS.set('www.ruhd.ru', [String.raw`https?://(?:www\.)?ruhd\.ru/play\.php\?vid=(?P<id>\d+)`]);
URL_REGEXS.set('rule34video.com', [String.raw`https?://(?:www\.)?rule34video\.com/videos/(?P<id>\d+)`]);
URL_REGEXS.set('rumble.com', [String.raw`https?://(?:www\.)?rumble\.com/(?P<id>v(?!ideos)[\w.-]+)[^/]*$`, String.raw`(?P<url>https?://(?:www\.)?rumble\.com/(?:c|user)/(?P<id>[^&?#$/]+))`, String.raw`https?://(?:www\.)?rumble\.com/embed/(?:[0-9a-z]+\.)?(?P<id>[0-9a-z]+)`]);
URL_REGEXS.set('www.rumble.com', [String.raw`https?://(?:www\.)?rumble\.com/(?P<id>v(?!ideos)[\w.-]+)[^/]*$`]);
URL_REGEXS.set('www.ruptly.tv', [String.raw`https?://(?:www\.)?ruptly\.tv/[a-z]{2}/videos/(?P<id>\d+-\d+)`]);
URL_REGEXS.set('rutube.ru', [String.raw`https?://rutube\.ru/(?:video(?:/private)?|(?:play/)?embed)/(?P<id>[\da-z]{32})`, String.raw`https?://rutube\.ru/channel/(?P<id>\d+)/videos`, String.raw`https?://rutube\.ru/(?:video|play)/embed/(?P<id>[0-9]+)`, String.raw`https?://rutube\.ru/video/person/(?P<id>\d+)`, String.raw`https?://rutube\.ru/(?:video|(?:play/)?embed)/[\da-z]{32}/\?.*?\bpl_id=(?P<id>\d+)`, String.raw`https?://rutube\.ru/tags/video/(?P<id>\d+)`]);
URL_REGEXS.set('player.rutv.ru', [String.raw`(?x)https?://(?:test)?player\.(?:rutv\.ru|vgtrk\.com)/(?P<path>flash\d+v/container\.swf\?id=|iframe/(?P<type>swf|video|live)/id/|index/iframe/cast_id/)(?P<id>\d+)`]);
URL_REGEXS.set('player.vgtrk.com', [String.raw`(?x)https?://(?:test)?player\.(?:rutv\.ru|vgtrk\.com)/(?P<path>flash\d+v/container\.swf\?id=|iframe/(?P<type>swf|video|live)/id/|index/iframe/cast_id/)(?P<id>\d+)`]);
URL_REGEXS.set('testplayer.vgtrk.com', [String.raw`(?x)https?://(?:test)?player\.(?:rutv\.ru|vgtrk\.com)/(?P<path>flash\d+v/container\.swf\?id=|iframe/(?P<type>swf|video|live)/id/|index/iframe/cast_id/)(?P<id>\d+)`]);
URL_REGEXS.set('www.ruutu.fi', [String.raw`(?x)https?://(?:(?:www\.)?(?:ruutu|supla)\.fi/(?:video|supla|audio)/|static\.nelonenmedia\.fi/player/misc/embed_player\.html\?.*?\bnid=)(?P<id>\d+)`]);
URL_REGEXS.set('www.supla.fi', [String.raw`(?x)https?://(?:(?:www\.)?(?:ruutu|supla)\.fi/(?:video|supla|audio)/|static\.nelonenmedia\.fi/player/misc/embed_player\.html\?.*?\bnid=)(?P<id>\d+)`]);
URL_REGEXS.set('static.nelonenmedia.fi', [String.raw`(?x)https?://(?:(?:www\.)?(?:ruutu|supla)\.fi/(?:video|supla|audio)/|static\.nelonenmedia\.fi/player/misc/embed_player\.html\?.*?\bnid=)(?P<id>\d+)`]);
URL_REGEXS.set('ruv.is', [String.raw`https?://(?:www\.)?ruv\.is/(?:sarpurinn/[^/]+|node)/(?P<id>[^/]+(?:/\d+)?)`]);
URL_REGEXS.set('www.ruv.is', [String.raw`https?://(?:www\.)?ruv\.is/(?:sarpurinn/[^/]+|node)/(?P<id>[^/]+(?:/\d+)?)`, String.raw`https?://(?:www\.)?ruv\.is/(?:(?:sjon|ut)varp|(?:krakka|ung)ruv)/spila/.+/(?P<series_id>[0-9]+)/(?P<id>[a-z0-9]+)`]);
URL_REGEXS.set('www.safaribooksonline.com', [String.raw`(?x)https?://(?:www\.)?(?:safaribooksonline|(?:learning\.)?oreilly)\.com/(?:library/view/[^/]+/(?P<course_id>[^/]+)/(?P<part>[^/?\#&]+)\.html|videos/[^/]+/[^/]+/(?P<reference_id>[^-]+-[^/?\#&]+))`, String.raw`https?://(?:www\.)?(?:safaribooksonline|(?:learning\.)?oreilly)\.com/api/v1/book/(?P<course_id>[^/]+)/chapter(?:-content)?/(?P<part>[^/?#&]+)\.html`, String.raw`(?x)https?://(?:(?:www\.)?(?:safaribooksonline|(?:learning\.)?oreilly)\.com/(?:library/view/[^/]+|api/v1/book|videos/[^/]+)|techbus\.safaribooksonline\.com)/(?P<id>[^/]+)`]);
URL_REGEXS.set('learning.oreilly.com', [String.raw`(?x)https?://(?:www\.)?(?:safaribooksonline|(?:learning\.)?oreilly)\.com/(?:library/view/[^/]+/(?P<course_id>[^/]+)/(?P<part>[^/?\#&]+)\.html|videos/[^/]+/[^/]+/(?P<reference_id>[^-]+-[^/?\#&]+))`, String.raw`(?x)https?://(?:(?:www\.)?(?:safaribooksonline|(?:learning\.)?oreilly)\.com/(?:library/view/[^/]+|api/v1/book|videos/[^/]+)|techbus\.safaribooksonline\.com)/(?P<id>[^/]+)`]);
URL_REGEXS.set('www.oreilly.com', [String.raw`(?x)https?://(?:www\.)?(?:safaribooksonline|(?:learning\.)?oreilly)\.com/(?:library/view/[^/]+/(?P<course_id>[^/]+)/(?P<part>[^/?\#&]+)\.html|videos/[^/]+/[^/]+/(?P<reference_id>[^-]+-[^/?\#&]+))`, String.raw`(?x)https?://(?:(?:www\.)?(?:safaribooksonline|(?:learning\.)?oreilly)\.com/(?:library/view/[^/]+|api/v1/book|videos/[^/]+)|techbus\.safaribooksonline\.com)/(?P<id>[^/]+)`, String.raw`.*`]);
URL_REGEXS.set('techbus.safaribooksonline.com', [String.raw`(?x)https?://(?:(?:www\.)?(?:safaribooksonline|(?:learning\.)?oreilly)\.com/(?:library/view/[^/]+|api/v1/book|videos/[^/]+)|techbus\.safaribooksonline\.com)/(?P<id>[^/]+)`]);
URL_REGEXS.set('www.saitosan.net', [String.raw`https?://(?:www\.)?saitosan\.net/bview.html\?id=(?P<id>[0-9]+)`]);
URL_REGEXS.set('saktv.ch', [String.raw`(?x)https?://(?:www\.)?saktv\.ch/(?:[^?#]+\?(?:[^#]+&)?program=(?P<vid2>\d+)|(?:program|watch)/[^/]+/(?P<vid1>\d+))`, String.raw`(?x)https?://(?:www\.)?saktv\.ch/(?:[^?#]+\?(?:[^#]+&)?channel=(?P<vid2>[^/?&#]+)|live/(?P<vid1>[^/?&#]+))`, String.raw`(?x)https?://(?:www\.)?saktv\.ch/(?:[^?#]+\?(?:[^#]+&)?recording=(?P<vid2>\d+)(?P<vid1>))`]);
URL_REGEXS.set('tv.salt.ch', [String.raw`(?x)https?://(?:www\.)?tv\.salt\.ch/(?:[^?#]+\?(?:[^#]+&)?program=(?P<vid2>\d+)|(?:program|watch)/[^/]+/(?P<vid1>\d+))`, String.raw`(?x)https?://(?:www\.)?tv\.salt\.ch/(?:[^?#]+\?(?:[^#]+&)?channel=(?P<vid2>[^/?&#]+)|live/(?P<vid1>[^/?&#]+))`, String.raw`(?x)https?://(?:www\.)?tv\.salt\.ch/(?:[^?#]+\?(?:[^#]+&)?recording=(?P<vid2>\d+)(?P<vid1>))`]);
URL_REGEXS.set('samplefocus.com', [String.raw`https?://(?:www\.)?samplefocus\.com/samples/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('www.webtv.sangiin.go.jp', [String.raw`https?://www\.webtv\.sangiin\.go\.jp/webtv/detail\.php\?sid=(?P<id>\d+)`]);
URL_REGEXS.set('videos.sapo.pt', [String.raw`https?://(?:(?:v2|www)\.)?videos\.sapo\.(?:pt|cv|ao|mz|tl)/(?P<id>[\da-zA-Z]{20})`]);
URL_REGEXS.set('v2.videos.sapo.pt', [String.raw`https?://(?:(?:v2|www)\.)?videos\.sapo\.(?:pt|cv|ao|mz|tl)/(?P<id>[\da-zA-Z]{20})`]);
URL_REGEXS.set('en.savefrom.net', [String.raw`https?://[^.]+\.savefrom\.net/\#url=(?P<url>.*)$`]);
URL_REGEXS.set('www.sbs.com.au', [String.raw`(?x)https?://(?:www\.)?sbs\.com\.au/(?:ondemand(?:/video/(?:single/)?|/movie/[^/]+/|/(?:tv|news)-series/(?:[^/]+/){3}|.*?\bplay=|/watch/)|news/(?:embeds/)?video/)(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.schooltv.nl', [String.raw`https?://(?:www\.)?schooltv\.nl/video/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('api.screen9.com', [String.raw`https?://(?:\w+\.screen9\.(?:tv|com)|play\.su\.se)/(?:embed|media)/(?P<id>[^?#/]+)`]);
URL_REGEXS.set('folkhogskolekanalen.screen9.tv', [String.raw`https?://(?:\w+\.screen9\.(?:tv|com)|play\.su\.se)/(?:embed|media)/(?P<id>[^?#/]+)`]);
URL_REGEXS.set('play.su.se', [String.raw`https?://(?:\w+\.screen9\.(?:tv|com)|play\.su\.se)/(?:embed|media)/(?P<id>[^?#/]+)`]);
URL_REGEXS.set('www.screencast.com', [String.raw`https?://(?:www\.)?screencast\.com/t/(?P<id>[a-zA-Z0-9]+)`]);
URL_REGEXS.set('screencast.com', [String.raw`https?://(?:www\.)?screencast\.com/t/(?P<id>[a-zA-Z0-9]+)`]);
URL_REGEXS.set('watch.screencastify.com', [String.raw`https?://watch\.screencastify\.com/v/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('screencast-o-matic.com', [String.raw`https?://screencast-o-matic\.com/(?:(?:watch|player)/|embed\?.*?\bsc=)(?P<id>[0-9a-zA-Z]+)`]);
URL_REGEXS.set('www.cookingchanneltv.com', [String.raw`https?://(?:www\.)?(?P<site>cookingchanneltv|discovery|(?:diy|food)network|hgtv|travelchannel)\.com/videos/[0-9a-z-]+-(?P<id>\d+)`]);
URL_REGEXS.set('www.diynetwork.com', [String.raw`https?://(?:www\.)?(?P<site>cookingchanneltv|discovery|(?:diy|food)network|hgtv|travelchannel)\.com/videos/[0-9a-z-]+-(?P<id>\d+)`]);
URL_REGEXS.set('www.foodnetwork.com', [String.raw`https?://(?:www\.)?(?P<site>cookingchanneltv|discovery|(?:diy|food)network|hgtv|travelchannel)\.com/videos/[0-9a-z-]+-(?P<id>\d+)`]);
URL_REGEXS.set('www.travelchannel.com', [String.raw`https?://(?:www\.)?(?P<site>cookingchanneltv|discovery|(?:diy|food)network|hgtv|travelchannel)\.com/videos/[0-9a-z-]+-(?P<id>\d+)`]);
URL_REGEXS.set('www.discovery.com', [String.raw`https?://(?:www\.)?(?P<site>cookingchanneltv|discovery|(?:diy|food)network|hgtv|travelchannel)\.com/videos/[0-9a-z-]+-(?P<id>\d+)`]);
URL_REGEXS.set('watch.geniuskitchen.com', [String.raw`(?x)https?://watch\.(?P<site>geniuskitchen)\.com/(?:player\.[A-Z0-9]+\.html\#|show/(?:[^/]+/){2}|player/)(?P<id>\d+)`]);
URL_REGEXS.set('scrolller.com', [String.raw`https?://(?:www\.)?scrolller\.com/(?P<id>[\w-]+)`]);
URL_REGEXS.set('learning.scte.org', [String.raw`https?://learning\.scte\.org/mod/scorm/view\.php?.*?\bid=(?P<id>\d+)`, String.raw`https?://learning\.scte\.org/(?:mod/sub)?course/view\.php?.*?\bid=(?P<id>\d+)`]);
URL_REGEXS.set('www.seeker.com', [String.raw`https?://(?:www\.)?seeker\.com/(?P<display_id>.*)-(?P<article_id>\d+)\.html`]);
URL_REGEXS.set('www.help.senate.gov', [String.raw`https?:\/\/(?:www\.)?(help|appropriations|judiciary|banking|armed-services|finance)\.senate\.gov`]);
URL_REGEXS.set('www.appropriations.senate.gov', [String.raw`https?:\/\/(?:www\.)?(help|appropriations|judiciary|banking|armed-services|finance)\.senate\.gov`]);
URL_REGEXS.set('www.banking.senate.gov', [String.raw`https?:\/\/(?:www\.)?(help|appropriations|judiciary|banking|armed-services|finance)\.senate\.gov`]);
URL_REGEXS.set('www.senate.gov', [String.raw`https?://(?:www\.)?senate\.gov/isvp/?\?(?P<qs>.+)`]);
URL_REGEXS.set('embed.sendtonews.com', [String.raw`https?://embed\.sendtonews\.com/player2/embedplayer\.php\?.*\bSC=(?P<id>[0-9A-Za-z-]+)`]);
URL_REGEXS.set('www.servustv.com', [String.raw`(?x)https?://(?:www\.)?(?:servus\.com/(?:(?:at|de)/p/[^/]+|tv/videos)|(?:servustv|pm-wissen)\.com/videos)/(?P<id>[aA]{2}-\w+|\d+-\d+)`]);
URL_REGEXS.set('www.servus.com', [String.raw`(?x)https?://(?:www\.)?(?:servus\.com/(?:(?:at|de)/p/[^/]+|tv/videos)|(?:servustv|pm-wissen)\.com/videos)/(?P<id>[aA]{2}-\w+|\d+-\d+)`]);
URL_REGEXS.set('www.pm-wissen.com', [String.raw`(?x)https?://(?:www\.)?(?:servus\.com/(?:(?:at|de)/p/[^/]+|tv/videos)|(?:servustv|pm-wissen)\.com/videos)/(?P<id>[aA]{2}-\w+|\d+-\d+)`]);
URL_REGEXS.set('sexu.com', [String.raw`https?://(?:www\.)?sexu\.com/(?P<id>\d+)`]);
URL_REGEXS.set('www.seznamzpravy.cz', [String.raw`https?://(?:www\.)?seznamzpravy\.cz/iframe/player\?.*\bsrc=`, String.raw`https?://(?:www\.)?(?:seznam\.cz/zpravy|seznamzpravy\.cz)/clanek/(?:[^/?#&]+)-(?P<id>\d+)`]);
URL_REGEXS.set('www.seznam.cz', [String.raw`https?://(?:www\.)?(?:seznam\.cz/zpravy|seznamzpravy\.cz)/clanek/(?:[^/?#&]+)-(?P<id>\d+)`]);
URL_REGEXS.set('shahid.mbc.net', [String.raw`https?://shahid\.mbc\.net/[a-z]{2}/(?:serie|show|movie)s/[^/]+/(?P<type>episode|clip|movie)-(?P<id>\d+)`, String.raw`https?://shahid\.mbc\.net/[a-z]{2}/(?:show|serie)s/[^/]+/(?:show|series)-(?P<id>\d+)`]);
URL_REGEXS.set('shared.sx', [String.raw`https?://shared\.sx/(?P<id>[\da-z]{10})`]);
URL_REGEXS.set('www.shemaroome.com', [String.raw`https?://(?:www\.)?shemaroome\.com/(?:movies|shows)/(?P<id>[^?#]+)`]);
URL_REGEXS.set('www.showroom-live.com', [String.raw`https?://(?:www\.)?showroom-live\.com/(?!onlive|timetable|event|campaign|news|ranking|room)(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.shugiintv.go.jp', [String.raw`https?://(?:www\.)?shugiintv\.go\.jp/(?:jp|en)(?:/index\.php)?$`, String.raw`https?://(?:www\.)?shugiintv\.go\.jp/(?:jp|en)/index\.php\?room_id=(?P<id>room\d+)`, String.raw`https?://(?:www\.)?shugiintv\.go\.jp/(?:jp|en)/index\.php\?ex=VL(?:\&[^=]+=[^&]*)*\&deli_id=(?P<id>\d+)`]);
URL_REGEXS.set('api.simplecast.com', [String.raw`https?://(?:api\.simplecast\.com/episodes|player\.simplecast\.com)/(?P<id>[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12})`]);
URL_REGEXS.set('player.simplecast.com', [String.raw`https?://(?:api\.simplecast\.com/episodes|player\.simplecast\.com)/(?P<id>[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12})`]);
URL_REGEXS.set('the-re-bind-io-podcast.simplecast.com', [String.raw`https?://(?!api\.)[^/]+\.simplecast\.com/episodes/(?P<id>[^/?&#]+)`, String.raw`https?://(?!(?:api|cdn|embed|feeds|player)\.)(?P<id>[^/]+)\.simplecast\.com(?!/episodes/[^/?&#]+)`]);
URL_REGEXS.set('video.sina.com.cn', [String.raw`(?x)https?://(?:.*?\.)?video\.sina\.com\.cn/(?:(?:view/|.*\#)(?P<id>\d+)|.+?/(?P<pseudo_id>[^/?#]+)(?:\.s?html)|# This is used by external sites like Weiboapi/sinawebApi/outplay.php/(?P<token>.+?)\.swf)`]);
URL_REGEXS.set('skeb.jp', [String.raw`https?://skeb\.jp/@[^/]+/works/(?P<id>\d+)`]);
URL_REGEXS.set('sport.sky.it', [String.raw`https?://(?:sport|tg24)\.sky\.it(?:/[^/]+)*/\d{4}/\d{2}/\d{2}/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('tg24.sky.it', [String.raw`https?://(?:sport|tg24)\.sky\.it(?:/[^/]+)*/\d{4}/\d{2}/\d{2}/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('news.sky.com', [String.raw`https?://news\.sky\.com/video/[0-9a-z-]+-(?P<id>[0-9]+)`, String.raw`https?://news\.sky\.com/story/[0-9a-z-]+-(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.skysports.com', [String.raw`https?://(?:www\.)?skysports\.com/watch/video/([^/]+/)*(?P<id>[0-9]+)`, String.raw`https?://(?:www\.)?skysports\.com/([^/]+/)*news/\d+/(?P<id>\d+)`]);
URL_REGEXS.set('www.skylinewebcams.com', [String.raw`https?://(?:www\.)?skylinewebcams\.com/[^/]+/webcam/(?:[^/]+/)+(?P<id>[^/]+)\.html`]);
URL_REGEXS.set('www.skynewsarabia.com', [String.raw`https?://(?:www\.)?skynewsarabia\.com/web/article/(?P<id>[0-9]+)`, String.raw`https?://(?:www\.)?skynewsarabia\.com/web/video/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.skynews.com.au', [String.raw`https?://(?:www\.)?skynews\.com\.au/[^/]+/[^/]+/[^/]+/video/(?P<id>[a-z0-9]+)`]);
URL_REGEXS.set('www.slideshare.net', [String.raw`https?://(?:www\.)?slideshare\.net/[^/]+?/(?P<title>.+?)($|\?)`]);
URL_REGEXS.set('slideslive.com', [String.raw`https?://slideslive\.com/(?:embed/(?:presentation/)?)?(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.slutload.com', [String.raw`https?://(?:\w+\.)?slutload\.com/(?:video/[^/]+|embed_player|watch)/(?P<id>[^/]+)`]);
URL_REGEXS.set('mobile.slutload.com', [String.raw`https?://(?:\w+\.)?slutload\.com/(?:video/[^/]+|embed_player|watch)/(?P<id>[^/]+)`]);
URL_REGEXS.set('smotrim.ru', [String.raw`https?://smotrim\.ru/(?P<type>brand|video|article|live)/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.snotr.com', [String.raw`http?://(?:www\.)?snotr\.com/video/(?P<id>\d+)/([\w]+)`]);
URL_REGEXS.set('tv.sohu.com', [String.raw`https?://(?P<mytv>my\.)?tv\.sohu\.com/.+?/(?(mytv)|n)(?P<id>\d+)\.shtml.*?`]);
URL_REGEXS.set('my.tv.sohu.com', [String.raw`https?://(?P<mytv>my\.)?tv\.sohu\.com/.+?/(?(mytv)|n)(?P<id>\d+)\.shtml.*?`]);
URL_REGEXS.set('www.sonyliv.com', [String.raw`(?x)(?:sonyliv:|https?://(?:www\.)?sonyliv\.com/(?:s(?:how|port)s/[^/]+|movies|clip|trailer|music-videos)/[^/?#&]+-)(?P<id>\d+)`, String.raw`https?://(?:www\.)?sonyliv\.com/shows/[^/?#&]+-(?P<id>\d{10})$`]);
URL_REGEXS.set('soundcloud.com', [String.raw`(?x)^(?:https?://)?(?:(?:(?:www\.|m\.)?soundcloud\.com/(?!stations/track)(?P<uploader>[\w\d-]+)/(?!(?:tracks|albums|sets(?:/.+?)?|reposts|likes|spotlight)/?(?:$|[?#]))(?P<title>[\w\d-]+)(?:/(?P<token>(?!(?:albums|sets|recommended))[^?]+?))?(?:[?].*)?$)|(?:api(?:-v2)?\.soundcloud\.com/tracks/(?P<track_id>\d+)(?:/?\?secret_token=(?P<secret_token>[^&]+))?))`, String.raw`https?://(?:(?:www|m)\.)?soundcloud\.com/(?P<slug>[\w\d-]+/[\w\d-]+)/(?P<relation>albums|sets|recommended)`, String.raw`https?://(?:(?:www|m)\.)?soundcloud\.com/(?P<uploader>[\w\d-]+)/sets/(?P<slug_title>[:\w\d-]+)(?:/(?P<token>[^?/]+))?`, String.raw`https?://(?:(?:www|m)\.)?soundcloud\.com/stations/track/[^/]+/(?P<id>[^/?#&]+)`, String.raw`(?x)https?://(?:(?:www|m)\.)?soundcloud\.com/(?P<user>[^/]+)(?:/(?P<rsrc>tracks|albums|sets|reposts|likes|spotlight))?/?(?:[?#].*)?$`]);
URL_REGEXS.set('api.soundcloud.com', [String.raw`(?x)^(?:https?://)?(?:(?:(?:www\.|m\.)?soundcloud\.com/(?!stations/track)(?P<uploader>[\w\d-]+)/(?!(?:tracks|albums|sets(?:/.+?)?|reposts|likes|spotlight)/?(?:$|[?#]))(?P<title>[\w\d-]+)(?:/(?P<token>(?!(?:albums|sets|recommended))[^?]+?))?(?:[?].*)?$)|(?:api(?:-v2)?\.soundcloud\.com/tracks/(?P<track_id>\d+)(?:/?\?secret_token=(?P<secret_token>[^&]+))?))`, String.raw`https?://api(?:-v2)?\.soundcloud\.com/playlists/(?P<id>[0-9]+)(?:/?\?secret_token=(?P<token>[^&]+?))?$`, String.raw`https?://api\.soundcloud\.com/users/(?P<id>\d+)`]);
URL_REGEXS.set('w.soundcloud.com', [String.raw`https?://(?:w|player|p)\.soundcloud\.com/player/?.*?\burl=(?P<id>.+)`]);
URL_REGEXS.set('soundgasm.net', [String.raw`https?://(?:www\.)?soundgasm\.net/u/(?P<user>[0-9a-zA-Z_-]+)/(?P<display_id>[0-9a-zA-Z_-]+)`, String.raw`https?://(?:www\.)?soundgasm\.net/u/(?P<id>[^/]+)/?(?:\#.*)?$`]);
URL_REGEXS.set('southpark.cc.com', [String.raw`https?://(?:www\.)?(?P<url>southpark(?:\.cc|studios)\.com/((?:video-)?clips|(?:full-)?episodes|collections)/(?P<id>.+?)(\?|#|$))`, String.raw`https?://(?:www\.)?(?P<url>southpark\.cc\.com/es/episodios/(?P<id>.+?)(\?|#|$))`]);
URL_REGEXS.set('www.southparkstudios.com', [String.raw`https?://(?:www\.)?(?P<url>southpark(?:\.cc|studios)\.com/((?:video-)?clips|(?:full-)?episodes|collections)/(?P<id>.+?)(\?|#|$))`]);
URL_REGEXS.set('www.southpark.de', [String.raw`https?://(?:www\.)?(?P<url>southpark\.de/(?:(en/(videoclip|collections|episodes|video-clips))|(videoclip|collections|folgen))/(?P<id>(?P<unique_id>.+?)/.+?)(?:\?|#|$))`]);
URL_REGEXS.set('www.southpark.lat', [String.raw`https?://(?:www\.)?southpark\.lat/(?:en/)?(?:video-?clips?|collections|episod(?:e|io)s)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.southpark.nl', [String.raw`https?://(?:www\.)?(?P<url>southpark\.nl/(?:clips|(?:full-)?episodes|collections)/(?P<id>.+?)(\?|#|$))`]);
URL_REGEXS.set('www.southparkstudios.dk', [String.raw`https?://(?:www\.)?(?P<url>southparkstudios\.(?:dk|nu)/(?:clips|full-episodes|collections)/(?P<id>.+?)(\?|#|$))`]);
URL_REGEXS.set('www.southparkstudios.nu', [String.raw`https?://(?:www\.)?(?P<url>southparkstudios\.(?:dk|nu)/(?:clips|full-episodes|collections)/(?P<id>.+?)(\?|#|$))`]);
URL_REGEXS.set('sovietscloset.com', [String.raw`https?://(?:www\.)?sovietscloset\.com/video/(?P<id>[0-9]+)/?`, String.raw`https?://(?:www\.)?sovietscloset\.com/(?!video)(?P<id>[^#?]+)`]);
URL_REGEXS.set('spankbang.com', [String.raw`(?x)https?://(?:[^/]+\.)?spankbang\.com/(?:(?P<id>[\da-z]+)/(?:video|play|embed)\b|[\da-z]+-(?P<id_2>[\da-z]+)/playlist/[^/?#&]+)`, String.raw`https?://(?:[^/]+\.)?spankbang\.com/(?P<id>[\da-z]+)/playlist/(?P<display_id>[^/]+)`]);
URL_REGEXS.set('m.spankbang.com', [String.raw`(?x)https?://(?:[^/]+\.)?spankbang\.com/(?:(?P<id>[\da-z]+)/(?:video|play|embed)\b|[\da-z]+-(?P<id_2>[\da-z]+)/playlist/[^/?#&]+)`]);
URL_REGEXS.set('www.spankwire.com', [String.raw`(?x)https?://(?:www\.)?spankwire\.com/(?:[^/]+/video|EmbedPlayer\.aspx/?\?.*?\bArticleId=)(?P<id>\d+)`]);
URL_REGEXS.set('www.spiegel.de', [String.raw`https?://(?:www\.)?(?:spiegel|manager-magazin)\.de(?:/[^/]+)+/[^/]*-(?P<id>[0-9]+|[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})(?:-embed|-iframe)?(?:\.html)?(?:$|[#?])`]);
URL_REGEXS.set('vod.sport5.co.il', [String.raw`https?://(?:www|vod)?\.sport5\.co\.il/.*\b(?:Vi|docID)=(?P<id>\d+)`]);
URL_REGEXS.set('www.sport5.co.il', [String.raw`https?://(?:www|vod)?\.sport5\.co\.il/.*\b(?:Vi|docID)=(?P<id>\d+)`]);
URL_REGEXS.set('news.sportbox.ru', [String.raw`https?://(?:news\.sportbox|matchtv)\.ru/vdl/player(?:/[^/]+/|\?.*?\bn?id=)(?P<id>\d+)`]);
URL_REGEXS.set('sportdeutschland.tv', [String.raw`https?://sportdeutschland\.tv/(?P<id>(?:[^/]+/)?[^?#/&]+)`]);
URL_REGEXS.set('api.spreaker.com', [String.raw`(?x)https?://api\.spreaker\.com/(?:(?:download/)?episode|v2/episodes)/(?P<id>\d+)`, String.raw`https?://api\.spreaker\.com/show/(?P<id>\d+)`]);
URL_REGEXS.set('www.spreaker.com', [String.raw`https?://(?:www\.)?spreaker\.com/user/[^/]+/(?P<id>[^/?#&]+)`, String.raw`https?://(?:www\.)?spreaker\.com/show/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('cms.springboardplatform.com', [String.raw`(?x)https?://cms\.springboardplatform\.com/(?:(?:previews|embed_iframe)/(?P<index>\d+)/video/(?P<id>\d+)|xml_feeds_advanced/index/(?P<index_2>\d+)/rss3/(?P<id_2>\d+))`]);
URL_REGEXS.set('www.universalkids.com', [String.raw`https?://(?:www\.)?(?:sproutonline|universalkids)\.com/(?:watch|(?:[^/]+/)*videos)/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.sproutonline.com', [String.raw`https?://(?:www\.)?(?:sproutonline|universalkids)\.com/(?:watch|(?:[^/]+/)*videos)/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('sr-mediathek.sr-online.de', [String.raw`https?://sr-mediathek(?:\.sr-online)?\.de/index\.php\?.*?&id=(?P<id>[0-9]+)`]);
URL_REGEXS.set('sr-mediathek.de', [String.raw`https?://sr-mediathek(?:\.sr-online)?\.de/index\.php\?.*?&id=(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.srf.ch', [String.raw`(?x)https?://(?:(?:www|play)\.)?(?P<bu>srf|rts|rsi|rtr|swissinfo)\.ch/play/(?:tv|radio)/(?:[^/]+/(?P<type>video|audio)/[^?]+|popup(?P<type_2>video|audio)player)\?.*?\b(?:id=|urn=urn:[^:]+:video:)(?P<id>[0-9a-f\-]{36}|\d+)`]);
URL_REGEXS.set('www.rtr.ch', [String.raw`(?x)https?://(?:(?:www|play)\.)?(?P<bu>srf|rts|rsi|rtr|swissinfo)\.ch/play/(?:tv|radio)/(?:[^/]+/(?P<type>video|audio)/[^?]+|popup(?P<type_2>video|audio)player)\?.*?\b(?:id=|urn=urn:[^:]+:video:)(?P<id>[0-9a-f\-]{36}|\d+)`]);
URL_REGEXS.set('play.swissinfo.ch', [String.raw`(?x)https?://(?:(?:www|play)\.)?(?P<bu>srf|rts|rsi|rtr|swissinfo)\.ch/play/(?:tv|radio)/(?:[^/]+/(?P<type>video|audio)/[^?]+|popup(?P<type_2>video|audio)player)\?.*?\b(?:id=|urn=urn:[^:]+:video:)(?P<id>[0-9a-f\-]{36}|\d+)`]);
URL_REGEXS.set('openclassroom.stanford.edu', [String.raw`https?://openclassroom\.stanford\.edu(?P<path>/?|(/MainFolder/(?:HomePage|CoursePage|VideoPage)\.php([?]course=(?P<course>[^&]+)(&video=(?P<video>[^&]+))?(&.*)?)?))$`]);
URL_REGEXS.set('intl.startrek.com', [String.raw`(?P<base>https?://(?:intl|www)\.startrek\.com)/videos/(?P<id>[^/]+)`]);
URL_REGEXS.set('www.startrek.com', [String.raw`(?P<base>https?://(?:intl|www)\.startrek\.com)/videos/(?P<id>[^/]+)`]);
URL_REGEXS.set('www.startv.com.tr', [String.raw`(?x)https?://(?:www\.)?startv\.com\.tr/(?:(?:dizi|program)/(?:[^/?#&]+)/(?:bolumler|fragmanlar|ekstralar)|video/arsiv/(?:dizi|program)/(?:[^/?#&]+))/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('store.steampowered.com', [String.raw`(?x)https?://(?:store\.steampowered|steamcommunity)\.com/(?:agecheck/)?(?P<urltype>video|app)/ #If the page is only for videos or for a game(?P<gameID>\d+)/?(?P<videoID>\d*)(?P<extra>\??)|https?://(?:www\.)?steamcommunity\.com/sharedfiles/filedetails/\?id=(?P<fileID>[0-9]+)`]);
URL_REGEXS.set('steamcommunity.com', [String.raw`https?://steamcommunity\.(?:com)/broadcast/watch/(?P<id>\d+)`]);
URL_REGEXS.set('www.stitcher.com', [String.raw`https?://(?:www\.)?stitcher\.com/(?:podcast|show)/(?:[^/]+/)+e(?:pisode)?/(?:[^/#?&]+-)?(?P<id>\d+)`, String.raw`https?://(?:www\.)?stitcher\.com/(?:podcast|show)/(?P<id>[^/#?&]+)/?(?:[?#&]|$)`]);
URL_REGEXS.set('storyfire.com', [String.raw`https?://(?:www\.)?storyfire\.com/video-details/(?P<id>[0-9a-f]{24})`, String.raw`https?://(?:www\.)?storyfire\.com/write/series/stories/(?P<id>[^/?&#]+)`, String.raw`https?://(?:www\.)?storyfire\.com/user/(?P<id>[^/]+)/video`]);
URL_REGEXS.set('streamable.com', [String.raw`https?://streamable\.com/(?:[es]/)?(?P<id>\w+)`]);
URL_REGEXS.set('streamanity.com', [String.raw`https?://(?:www\.)?streamanity\.com/video/(?P<id>[A-Za-z0-9]+)`]);
URL_REGEXS.set('streamcloud.eu', [String.raw`https?://streamcloud\.eu/(?P<id>[a-zA-Z0-9_-]+)(?:/(?P<fname>[^#?]*)\.html)?`]);
URL_REGEXS.set('www.televizeseznam.cz', [String.raw`https?://(?:www\.)?(?:stream|televizeseznam)\.cz/[^?#]+/(?P<display_id>[^?#]+)-(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.stream.cz', [String.raw`https?://(?:www\.)?(?:stream|televizeseznam)\.cz/[^?#]+/(?P<display_id>[^?#]+)-(?P<id>[0-9]+)`]);
URL_REGEXS.set('streamff.com', [String.raw`https?://(?:www\.)?streamff\.com/v/(?P<id>[a-zA-Z0-9]+)`]);
URL_REGEXS.set('streetvoice.com', [String.raw`https?://(?:.+?\.)?streetvoice\.com/[^/]+/songs/(?P<id>[0-9]+)`]);
URL_REGEXS.set('tw.streetvoice.com', [String.raw`https?://(?:.+?\.)?streetvoice\.com/[^/]+/songs/(?P<id>[0-9]+)`]);
URL_REGEXS.set('portal.stretchinternet.com', [String.raw`https?://portal\.stretchinternet\.com/[^/]+/(?:portal|full)\.htm\?.*?\beventId=(?P<id>\d+)`]);
URL_REGEXS.set('stripchat.com', [String.raw`https?://stripchat\.com/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('player.stv.tv', [String.raw`https?://player\.stv\.tv/(?P<type>episode|video)/(?P<id>[a-z0-9]{4})`]);
URL_REGEXS.set('haleynahman.substack.com', [String.raw`https?://(?P<username>[\w-]+)\.substack\.com/p/(?P<id>[\w-]+)`]);
URL_REGEXS.set('andrewzimmern.substack.com', [String.raw`https?://(?P<username>[\w-]+)\.substack\.com/p/(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.sunporno.com', [String.raw`https?://(?:(?:www\.)?sunporno\.com/videos|embeds\.sunporno\.com/embed)/(?P<id>\d+)`]);
URL_REGEXS.set('embeds.sunporno.com', [String.raw`https?://(?:(?:www\.)?sunporno\.com/videos|embeds\.sunporno\.com/embed)/(?P<id>\d+)`]);
URL_REGEXS.set('sverigesradio.se', [String.raw`https?://(?:www\.)?sverigesradio\.se/(?:sida/)?avsnitt/(?P<id>[0-9]+)`, String.raw`https?://(?:www\.)?sverigesradio\.se/sida/(?:artikel|gruppsida)\.aspx\?.*?\bartikel=(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.svt.se', [String.raw`https?://(?:www\.)?svt\.se/wd\?(?:.*?&)?widgetId=(?P<widget_id>\d+)&.*?\barticleId=(?P<id>\d+)`, String.raw`https?://(?:www\.)?svt\.se/(?P<path>(?:[^/]+/)*(?P<id>[^/?&#]+))`, String.raw`(?x)(?:(?:svt:|https?://(?:www\.)?svt\.se/barnkanalen/barnplay/[^/]+/)(?P<svt_id>[^/?#&]+)|https?://(?:www\.)?(?:svtplay|oppetarkiv)\.se/(?:video|klipp|kanaler)/(?P<id>[^/?#&]+)(?:.*?(?:modalId|id)=(?P<modal_id>[\da-zA-Z-]+))?)`]);
URL_REGEXS.set('www.svtplay.se', [String.raw`(?x)(?:(?:svt:|https?://(?:www\.)?svt\.se/barnkanalen/barnplay/[^/]+/)(?P<svt_id>[^/?#&]+)|https?://(?:www\.)?(?:svtplay|oppetarkiv)\.se/(?:video|klipp|kanaler)/(?P<id>[^/?#&]+)(?:.*?(?:modalId|id)=(?P<modal_id>[\da-zA-Z-]+))?)`, String.raw`https?://(?:www\.)?svtplay\.se/(?P<id>[^/?&#]+)(?:.+?\btab=(?P<season_slug>[^&#]+))?`]);
URL_REGEXS.set('www.oppetarkiv.se', [String.raw`(?x)(?:(?:svt:|https?://(?:www\.)?svt\.se/barnkanalen/barnplay/[^/]+/)(?P<svt_id>[^/?#&]+)|https?://(?:www\.)?(?:svtplay|oppetarkiv)\.se/(?:video|klipp|kanaler)/(?P<id>[^/?#&]+)(?:.*?(?:modalId|id)=(?P<modal_id>[\da-zA-Z-]+))?)`]);
URL_REGEXS.set('www.swearnet.com', [String.raw`https?://www\.swearnet\.com/shows/(?P<id>[\w-]+)/seasons/(?P<season_num>\d+)/episodes/(?P<episode_num>\d+)`]);
URL_REGEXS.set('swrmediathek.de', [String.raw`https?://(?:www\.)?swrmediathek\.de/(?:content/)?player\.htm\?show=(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`]);
URL_REGEXS.set('www.syfy.com', [String.raw`https?://(?:www\.)?syfy\.com/(?:[^/]+/)?videos/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('24syv.dk', [String.raw`https?://(?:www\.)?24syv\.dk/episode/(?P<id>[\w-]+)`]);
URL_REGEXS.set('sztv.hu', [String.raw`https?://(?:(?:www\.)?sztv\.hu|www\.tvszombathely\.hu)/(?:[^/]+)/.+-(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.t-online.de', [String.raw`https?://(?:www\.)?t-online\.de/tv/(?:[^/]+/)*id_(?P<id>\d+)`]);
URL_REGEXS.set('www.tagesschau.de', [String.raw`https?://(?:www\.)?tagesschau\.de/(?P<path>[^/]+/(?:[^/]+/)*?(?P<id>[^/#?]+?(?:-?[0-9]+)?))(?:~_?[^/#?]+?)?\.html`]);
URL_REGEXS.set('tass.ru', [String.raw`https?://(?:tass\.ru|itar-tass\.com)/[^/]+/(?P<id>\d+)`]);
URL_REGEXS.set('itar-tass.com', [String.raw`https?://(?:tass\.ru|itar-tass\.com)/[^/]+/(?P<id>\d+)`]);
URL_REGEXS.set('www.tntdrama.com', [String.raw`https?://(?:www\.)?(?P<site>tbs|tntdrama)\.com(?P<path>/(?:movies|watchtnt|watchtbs|shows/[^/]+/(?:clips|season-\d+/episode-\d+))/(?P<id>[^/?#]+))`]);
URL_REGEXS.set('www.tbs.com', [String.raw`https?://(?:www\.)?(?P<site>tbs|tntdrama)\.com(?P<path>/(?:movies|watchtnt|watchtbs|shows/[^/]+/(?:clips|season-\d+/episode-\d+))/(?P<id>[^/?#]+))`]);
URL_REGEXS.set('tds.lifeway.com', [String.raw`https?://tds\.lifeway\.com/v1/trainingdeliverysystem/courses/(?P<id>\d+)/index\.html`]);
URL_REGEXS.set('gns3.teachable.com', [String.raw`(?x)(?:teachable:https?://(?P<site_t>[^/]+)|https?://(?:www\.)?(?P<site>v1\.upskillcourses\.com|gns3\.teachable\.com|academyhacker\.com|stackskills\.com|market\.saleshacker\.com|learnability\.org|edurila\.com|courses\.workitdaily\.com))/courses/[^/]+/lectures/(?P<id>\d+)`, String.raw`(?x)(?:teachable:https?://(?P<site_t>[^/]+)|https?://(?:www\.)?(?P<site>v1\.upskillcourses\.com|gns3\.teachable\.com|academyhacker\.com|stackskills\.com|market\.saleshacker\.com|learnability\.org|edurila\.com|courses\.workitdaily\.com))/(?:courses|p)/(?:enrolled/)?(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('v1.upskillcourses.com', [String.raw`(?x)(?:teachable:https?://(?P<site_t>[^/]+)|https?://(?:www\.)?(?P<site>v1\.upskillcourses\.com|gns3\.teachable\.com|academyhacker\.com|stackskills\.com|market\.saleshacker\.com|learnability\.org|edurila\.com|courses\.workitdaily\.com))/courses/[^/]+/lectures/(?P<id>\d+)`, String.raw`(?x)(?:teachable:https?://(?P<site_t>[^/]+)|https?://(?:www\.)?(?P<site>v1\.upskillcourses\.com|gns3\.teachable\.com|academyhacker\.com|stackskills\.com|market\.saleshacker\.com|learnability\.org|edurila\.com|courses\.workitdaily\.com))/(?:courses|p)/(?:enrolled/)?(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.teachertube.com', [String.raw`https?://(?:www\.)?teachertube\.com/(viewVideo\.php\?video_id=|music\.php\?music_id=|video/(?:[\da-z-]+-)?|audio/)(?P<id>\d+)`, String.raw`https?://(?:www\.)?teachertube\.com/(user/profile|collection)/(?P<user>[0-9a-zA-Z]+)/?`]);
URL_REGEXS.set('www.teachingchannel.org', [String.raw`https?://(?:www\.)?teachingchannel\.org/videos?/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('teamcoco.com', [String.raw`https?://(?:\w+\.)?teamcoco\.com/(?P<id>([^/]+/)*[^/?#]+)`]);
URL_REGEXS.set('conan25.teamcoco.com', [String.raw`https?://(?:\w+\.)?teamcoco\.com/(?P<id>([^/]+/)*[^/?#]+)`]);
URL_REGEXS.set('teamtreehouse.com', [String.raw`https?://(?:www\.)?teamtreehouse\.com/library/(?P<id>[^/]+)`]);
URL_REGEXS.set('techtalks.tv', [String.raw`https?://techtalks\.tv/talks/(?:[^/]+/)?(?P<id>\d+)`]);
URL_REGEXS.set('techtv.mit.edu', [String.raw`https?://techtv\.mit\.edu/(?:videos|embeds)/(?P<id>\d+)`]);
URL_REGEXS.set('embed.ted.com', [String.raw`https?://embed(?:-ssl)?\.ted\.com/`]);
URL_REGEXS.set('www.ted.com', [String.raw`https?://www\.ted\.com/(?:playlists(?:/\d+)?)(?:/lang/[^/#?]+)?/(?P<id>[\w-]+)`, String.raw`https?://www\.ted\.com/(?:series)(?:/lang/[^/#?]+)?/(?P<id>[\w-]+)(?:#season_(?P<season>\d+))?`, String.raw`https?://www\.ted\.com/(?:talks)(?:/lang/[^/#?]+)?/(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.t13.cl', [String.raw`^https?://(?:www\.)?t13\.cl/videos(?:/[^/]+)+/(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.tele5.de', [String.raw`https?://(?:www\.)?tele5\.de/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('tele5.de', [String.raw`https?://(?:www\.)?tele5\.de/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('bx1.be', [String.raw`https?://(?:www\.)?(?:telebruxelles|bx1)\.be/(?:[^/]+/)*(?P<id>[^/#?]+)`]);
URL_REGEXS.set('www.telecinco.es', [String.raw`https?://(?:www\.)?(?:telecinco\.es|cuatro\.com|mediaset\.es)/(?:[^/]+/)+(?P<id>.+?)\.html`]);
URL_REGEXS.set('www.cuatro.com', [String.raw`https?://(?:www\.)?(?:telecinco\.es|cuatro\.com|mediaset\.es)/(?:[^/]+/)+(?P<id>.+?)\.html`]);
URL_REGEXS.set('www.mediaset.es', [String.raw`https?://(?:www\.)?(?:telecinco\.es|cuatro\.com|mediaset\.es)/(?:[^/]+/)+(?P<id>.+?)\.html`]);
URL_REGEXS.set('www.telegraaf.nl', [String.raw`https?://(?:www\.)?telegraaf\.nl/video/(?P<id>\d+)`, String.raw`.*`]);
URL_REGEXS.set('t.me', [String.raw`https?://t\.me/(?P<channel_id>[^/]+)/(?P<id>\d+)`]);
URL_REGEXS.set('www.telemb.be', [String.raw`https?://(?:www\.)?telemb\.be/(?P<display_id>.+?)_d_(?P<id>\d+)\.html`]);
URL_REGEXS.set('telemb.be', [String.raw`https?://(?:www\.)?telemb\.be/(?P<display_id>.+?)_d_(?P<id>\d+)\.html`]);
URL_REGEXS.set('www.telemundo.com', [String.raw`https?:\/\/(?:www\.)?telemundo\.com\/.+?video\/[^\/]+(?P<id>tmvo\d{7})`]);
URL_REGEXS.set('zonevideo.telequebec.tv', [String.raw`(?x)https?://(?:zonevideo\.telequebec\.tv/media|coucou\.telequebec\.tv/videos)/(?P<id>\d+)`, String.raw`https?://zonevideo\.telequebec\.tv/(?P<id>endirect)`]);
URL_REGEXS.set('coucou.telequebec.tv', [String.raw`(?x)https?://(?:zonevideo\.telequebec\.tv/media|coucou\.telequebec\.tv/videos)/(?P<id>\d+)`]);
URL_REGEXS.set('lindicemcsween.telequebec.tv', [String.raw`(?x)https?://(?:[^/]+\.telequebec\.tv/emissions/|(?:www\.)?telequebec\.tv/)(?P<id>[^?#&]+)`]);
URL_REGEXS.set('bancpublic.telequebec.tv', [String.raw`(?x)https?://(?:[^/]+\.telequebec\.tv/emissions/|(?:www\.)?telequebec\.tv/)(?P<id>[^?#&]+)`]);
URL_REGEXS.set('www.telequebec.tv', [String.raw`(?x)https?://(?:[^/]+\.telequebec\.tv/emissions/|(?:www\.)?telequebec\.tv/)(?P<id>[^?#&]+)`]);
URL_REGEXS.set('squat.telequebec.tv', [String.raw`https://squat\.telequebec\.tv/videos/(?P<id>\d+)`]);
URL_REGEXS.set('video.telequebec.tv', [String.raw`https?://video\.telequebec\.tv/player(?:-live)?/(?P<id>\d+)`]);
URL_REGEXS.set('www.tele-task.de', [String.raw`https?://(?:www\.)?tele-task\.de/archive/video/html5/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.telewebion.com', [String.raw`https?://(?:www\.)?telewebion\.com/#!/episode/(?P<id>\d+)`]);
URL_REGEXS.set('video.tempo.co', [String.raw`https?://video\.tempo\.co/\w+/\d+/(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.tennistv.com', [String.raw`https?://(?:www\.)?tennistv\.com/videos/(?P<id>[-a-z0-9]+)`]);
URL_REGEXS.set('10play.com.au', [String.raw`https?://(?:www\.)?10play\.com\.au/(?:[^/]+/)+(?P<id>tpv\d{6}[a-z]{5})`]);
URL_REGEXS.set('www.tf1.fr', [String.raw`https?://(?:www\.)?tf1\.fr/[^/]+/(?P<program_slug>[^/]+)/videos/(?P<id>[^/?&#]+)\.html`]);
URL_REGEXS.set('www.tfo.org', [String.raw`https?://(?:www\.)?tfo\.org/(?:en|fr)/(?:[^/]+/){2}(?P<id>\d+)`]);
URL_REGEXS.set('the-hole.tv', [String.raw`https?://(?:www\.)?the-hole\.tv/episodes/(?P<id>[\w-]+)`]);
URL_REGEXS.set('theintercept.com', [String.raw`https?://theintercept\.com/fieldofvision/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('feed.theplatform.com', [String.raw`https?://feed\.theplatform\.com/f/(?P<provider_id>[^/]+)/(?P<feed_id>[^?/]+)\?(?:[^&]+&)*(?P<filter>by(?:Gui|I)d=(?P<id>[^&]+))`]);
URL_REGEXS.set('www.thestar.com', [String.raw`https?://(?:www\.)?thestar\.com/(?:[^/]+/)*(?P<id>.+)\.html`]);
URL_REGEXS.set('www.thesun.co.uk', [String.raw`https://(?:www\.)?thesun\.co\.uk/[^/]+/(?P<id>\d+)`]);
URL_REGEXS.set('www.theta.tv', [String.raw`https?://(?:www\.)?theta\.tv/(?!video/)(?P<id>[a-z0-9-]+)`, String.raw`https?://(?:www\.)?theta\.tv/video/(?P<id>vid[a-z0-9]+)`]);
URL_REGEXS.set('weather.com', [String.raw`https?://(?:www\.)?weather\.com(?P<asset_name>(?:/(?P<locale>[a-z]{2}-[A-Z]{2}))?/(?:[^/]+/)*video/(?P<id>[^/?#]+))`]);
URL_REGEXS.set('www.thisamericanlife.org', [String.raw`https?://(?:www\.)?thisamericanlife\.org/(?:radio-archives/episode/|play_full\.php\?play=)(?P<id>\d+)`]);
URL_REGEXS.set('www.thisav.com', [String.raw`https?://(?:www\.)?thisav\.com/video/(?P<id>[0-9]+)/.*`]);
URL_REGEXS.set('www.thisoldhouse.com', [String.raw`https?://(?:www\.)?thisoldhouse\.com/(?:watch|how-to|tv-episode|(?:[^/]+/)?\d+)/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('thisvid.com', [String.raw`https?://(?:www\.)?thisvid\.com/(?P<type>videos|embed)/(?P<id>[A-Za-z0-9-]+)`, String.raw`https?://thisvid\.com/members/(?P<id>\d+)`, String.raw`https?://thisvid\.com/playlist/(?P<id>\d+)/video/(?P<video_id>[A-Za-z0-9-]+)`]);
URL_REGEXS.set('3speak.tv', [String.raw`https?://(?:www\.)?3speak\.tv/watch\?v\=[^/]+/(?P<id>[^/$&#?]+)`, String.raw`https?://(?:www\.)?3speak\.tv/user/(?P<id>[^/$&?#]+)`]);
URL_REGEXS.set('www.tiktok.com', [String.raw`https?://www\.tiktok\.com/(?:embed|@(?P<user_id>[\w\.-]+)?/video)/(?P<id>\d+)`, String.raw`https?://(?:www\.)?tiktok\.com/sticker/[\w\.-]+-(?P<id>[\d]+)[/?#&]?`, String.raw`https?://(?:www\.)?tiktok\.com/music/[\w\.-]+-(?P<id>[\d]+)[/?#&]?`, String.raw`https?://(?:www\.)?tiktok\.com/@(?P<id>[\w\.-]+)/?(?:$|[#?])`, String.raw`https?://(?:(?:vm|vt)\.tiktok\.com|(?:www\.)tiktok\.com/t)/(?P<id>\w+)`]);
URL_REGEXS.set('tiktok.com', [String.raw`https?://(?:www\.)?tiktok\.com/tag/(?P<id>[^/?#&]+)`, String.raw`https?://(?:www\.)?tiktok\.com/@(?P<id>[\w\.-]+)/?(?:$|[#?])`]);
URL_REGEXS.set('tinypic.com', [String.raw`https?://(?:.+?\.)?tinypic\.com/player\.php\?v=(?P<id>[^&]+)&s=\d+`]);
URL_REGEXS.set('de.tinypic.com', [String.raw`https?://(?:.+?\.)?tinypic\.com/player\.php\?v=(?P<id>[^&]+)&s=\d+`]);
URL_REGEXS.set('go.tlc.com', [String.raw`https?://(?:go\.)?tlc\.com/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('www.tmz.com', [String.raw`https?://(?:www\.)?tmz\.com/.*`]);
URL_REGEXS.set('www.tnaflix.com', [String.raw`https?://(?:www\.)?(?P<host>tnaflix)\.com/[^/]+/(?P<display_id>[^/]+)/video(?P<id>\d+)`]);
URL_REGEXS.set('player.tnaflix.com', [String.raw`https?://player\.(?P<host>tnaflix|empflix)\.com/video/(?P<id>\d+)`]);
URL_REGEXS.set('player.empflix.com', [String.raw`https?://player\.(?P<host>tnaflix|empflix)\.com/video/(?P<id>\d+)`]);
URL_REGEXS.set('video.toggle.sg', [String.raw`(?:https?://(?:(?:www\.)?mewatch|video\.toggle)\.sg/(?:en|zh)/(?:[^/]+/){2,}|toggle:)(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.toggo.de', [String.raw`https?://(?:www\.)?toggo\.de/(?:toggolino/)?[^/?#]+/(?:folge|video)/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('tokentube.net', [String.raw`https?://(?:www\.)?tokentube\.net/(?:view\?[vl]=|[vl]/)(?P<id>\d+)`, String.raw`https?://(?:www\.)?tokentube\.net/channel/(?P<id>\d+)/[^/]+(?:/videos)?`]);
URL_REGEXS.set('audycje.tokfm.pl', [String.raw`(?:https?://audycje\.tokfm\.pl/audycja/|tokfm:audition:)(?P<id>\d+),?`, String.raw`(?:https?://audycje\.tokfm\.pl/podcast/|tokfm:podcast:)(?P<id>\d+),?`]);
URL_REGEXS.set('www.toongoggles.com', [String.raw`https?://(?:www\.)?toongoggles\.com/shows/(?P<show_id>\d+)(?:/[^/]+/episodes/(?P<episode_id>\d+))?`]);
URL_REGEXS.set('ici.tou.tv', [String.raw`https?://ici\.tou\.tv/(?P<id>[a-zA-Z0-9_-]+(?:/S[0-9]+[EC][0-9]+)?)`]);
URL_REGEXS.set('videos.toypics.net', [String.raw`https?://videos\.toypics\.net/view/(?P<id>[0-9]+)`, String.raw`https?://videos\.toypics\.net/(?!view)(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.traileraddict.com', [String.raw`(?:https?://)?(?:www\.)?traileraddict\.com/(?:trailer|clip)/(?P<movie>.+?)/(?P<trailer_name>.+)`]);
URL_REGEXS.set('watch.travelchannel.com', [String.raw`https?://(?:watch\.)?travelchannel\.com/video/(?P<id>[^/]+/[^/?#]+)`]);
URL_REGEXS.set('triller.co', [String.raw`(?x)https?://(?:www\.)?triller\.co/@(?P<username>[\w\._]+)/video/(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`, String.raw`https?://(?:www\.)?triller\.co/@(?P<id>[\w\._]+)/?(?:$|[#?])`]);
URL_REGEXS.set('www.trilulilu.ro', [String.raw`https?://(?:(?:www|m)\.)?trilulilu\.ro/(?:[^/]+/)?(?P<id>[^/#\?]+)`]);
URL_REGEXS.set('trovo.live', [String.raw`https?://(?:www\.)?trovo\.live/(?:s/)?(?!(?:clip|video)/)(?P<id>(?!s/)[^/?&#]+(?![^#]+[?&]vid=))`, String.raw`https?://(?:www\.)?trovo\.live/(?:clip|video|s)/(?:[^/]+/\d+[^#]*[?&]vid=)?(?P<id>(?<!/s/)[^/?&#]+)`]);
URL_REGEXS.set('www.trtcocuk.net.tr', [String.raw`https?://www\.trtcocuk\.net\.tr/video/(?P<id>[\w-]+)`]);
URL_REGEXS.set('trueid.id', [String.raw`https?://(?P<domain>vn\.trueid\.net|trueid\.(?:id|ph))/(?:movie|series/[^/]+)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('vn.trueid.net', [String.raw`https?://(?P<domain>vn\.trueid\.net|trueid\.(?:id|ph))/(?:movie|series/[^/]+)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('trueid.ph', [String.raw`https?://(?P<domain>vn\.trueid\.net|trueid\.(?:id|ph))/(?:movie|series/[^/]+)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.trunews.com', [String.raw`https?://(?:www\.)?trunews\.com/stream/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('truthsocial.com', [String.raw`https?://truthsocial\.com/@[^/]+/posts/(?P<id>\d+)`]);
URL_REGEXS.set('www.trutv.com', [String.raw`https?://(?:www\.)?trutv\.com/(?:shows|full-episodes)/(?P<series_slug>[0-9A-Za-z-]+)/(?:videos/(?P<clip_slug>[0-9A-Za-z-]+)|(?P<id>\d+))`]);
URL_REGEXS.set('www.tube8.com', [String.raw`https?://(?:www\.)?tube8\.com/(?:[^/]+/)+(?P<display_id>[^/]+)/(?P<id>\d+)`]);
URL_REGEXS.set('tube.tugraz.at', [String.raw`(?x)https?://tube\.tugraz\.at/paella/ui/watch.html\?id=(?P<id>[0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12})`, String.raw`(?x)https?://tube\.tugraz\.at/paella/ui/browse\.html\?series=(?P<id>[0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12})`]);
URL_REGEXS.set('tubitv.com', [String.raw`(?x)(?:tubitv:|https?://(?:www\.)?tubitv\.com/(?:video|movies|tv-shows)/)(?P<id>[0-9]+)`, String.raw`https?://(?:www\.)?tubitv\.com/series/[0-9]+/(?P<show_name>[^/?#]+)`]);
URL_REGEXS.set('tatianamaslanydaily.tumblr.com', [String.raw`https?://(?P<blog_name>[^/?#&]+)\.tumblr\.com/(?:post|video)/(?P<id>[0-9]+)(?:$|[/?#])`]);
URL_REGEXS.set('maskofthedragon.tumblr.com', [String.raw`https?://(?P<blog_name>[^/?#&]+)\.tumblr\.com/(?:post|video)/(?P<id>[0-9]+)(?:$|[/?#])`]);
URL_REGEXS.set('shieldfoss.tumblr.com', [String.raw`https?://(?P<blog_name>[^/?#&]+)\.tumblr\.com/(?:post|video)/(?P<id>[0-9]+)(?:$|[/?#])`]);
URL_REGEXS.set('jujanon.tumblr.com', [String.raw`https?://(?P<blog_name>[^/?#&]+)\.tumblr\.com/(?:post|video)/(?P<id>[0-9]+)(?:$|[/?#])`]);
URL_REGEXS.set('bartlebyshop.tumblr.com', [String.raw`https?://(?P<blog_name>[^/?#&]+)\.tumblr\.com/(?:post|video)/(?P<id>[0-9]+)(?:$|[/?#])`]);
URL_REGEXS.set('afloweroutofstone.tumblr.com', [String.raw`https?://(?P<blog_name>[^/?#&]+)\.tumblr\.com/(?:post|video)/(?P<id>[0-9]+)(?:$|[/?#])`]);
URL_REGEXS.set('naked-yogi.tumblr.com', [String.raw`https?://(?P<blog_name>[^/?#&]+)\.tumblr\.com/(?:post|video)/(?P<id>[0-9]+)(?:$|[/?#])`]);
URL_REGEXS.set('prozdvoices.tumblr.com', [String.raw`https?://(?P<blog_name>[^/?#&]+)\.tumblr\.com/(?:post|video)/(?P<id>[0-9]+)(?:$|[/?#])`]);
URL_REGEXS.set('dominustempori.tumblr.com', [String.raw`https?://(?P<blog_name>[^/?#&]+)\.tumblr\.com/(?:post|video)/(?P<id>[0-9]+)(?:$|[/?#])`]);
URL_REGEXS.set('sutiblr.tumblr.com', [String.raw`https?://(?P<blog_name>[^/?#&]+)\.tumblr\.com/(?:post|video)/(?P<id>[0-9]+)(?:$|[/?#])`]);
URL_REGEXS.set('silami.tumblr.com', [String.raw`https?://(?P<blog_name>[^/?#&]+)\.tumblr\.com/(?:post|video)/(?P<id>[0-9]+)(?:$|[/?#])`]);
URL_REGEXS.set('tunein.com', [String.raw`https?://(?:www\.)?tunein\.com/station/.*?audioClipId\=(?P<id>\d+)`, String.raw`https?://(?:www\.)?tunein\.com/(?:radio/.*?-p|program/.*?ProgramId=|embed/player/p)(?P<id>\d+)`, String.raw`https?://(?:www\.)?tunein\.com/(?:radio/.*?-s|station/.*?StationId=|embed/player/s)(?P<id>\d+)`, String.raw`https?://(?:www\.)?tunein\.com/(?:topic/.*?TopicId=|embed/player/t)(?P<id>\d+)`]);
URL_REGEXS.set('tun.in', [String.raw`https?://tun\.in/(?P<id>[A-Za-z0-9]+)`]);
URL_REGEXS.set('tune.pk', [String.raw`(?x)https?://(?:(?:www\.)?tune\.pk/(?:video/|player/embed_player.php?.*?\bvid=)|embed\.tune\.pk/play/)(?P<id>\d+)`]);
URL_REGEXS.set('embed.tune.pk', [String.raw`(?x)https?://(?:(?:www\.)?tune\.pk/(?:video/|player/embed_player.php?.*?\bvid=)|embed\.tune\.pk/play/)(?P<id>\d+)`]);
URL_REGEXS.set('www.turbo.fr', [String.raw`https?://(?:www\.)?turbo\.fr/videos-voiture/(?P<id>[0-9]+)-`]);
URL_REGEXS.set('tv.dfb.de', [String.raw`https?://tv\.dfb\.de/video/(?P<display_id>[^/]+)/(?P<id>\d+)`]);
URL_REGEXS.set('www.tv2.no', [String.raw`https?://(?:www\.)?tv2\.no/v(?:ideo)?\d*/(?:[^?#]+/)*(?P<id>\d+)`, String.raw`https?://(?:www\.)?tv2\.no/(?!v(?:ideo)?\d*/)[^?#]+/(?P<id>\d+)`]);
URL_REGEXS.set('www.tvsyd.dk', [String.raw`(?x)https?://(?:www\.)?(?:tvsyd|tv2ostjylland|tvmidtvest|tv2fyn|tv2east|tv2lorry|tv2nord)\.dk/(:[^/]+/)*(?P<id>[^/?\#&]+)`]);
URL_REGEXS.set('www.tv2lorry.dk', [String.raw`(?x)https?://(?:www\.)?(?:tvsyd|tv2ostjylland|tvmidtvest|tv2fyn|tv2east|tv2lorry|tv2nord)\.dk/(:[^/]+/)*(?P<id>[^/?\#&]+)`]);
URL_REGEXS.set('www.tv2ostjylland.dk', [String.raw`(?x)https?://(?:www\.)?(?:tvsyd|tv2ostjylland|tvmidtvest|tv2fyn|tv2east|tv2lorry|tv2nord)\.dk/(:[^/]+/)*(?P<id>[^/?\#&]+)`]);
URL_REGEXS.set('www.tvmidtvest.dk', [String.raw`(?x)https?://(?:www\.)?(?:tvsyd|tv2ostjylland|tvmidtvest|tv2fyn|tv2east|tv2lorry|tv2nord)\.dk/(:[^/]+/)*(?P<id>[^/?\#&]+)`]);
URL_REGEXS.set('www.tv2fyn.dk', [String.raw`(?x)https?://(?:www\.)?(?:tvsyd|tv2ostjylland|tvmidtvest|tv2fyn|tv2east|tv2lorry|tv2nord)\.dk/(:[^/]+/)*(?P<id>[^/?\#&]+)`]);
URL_REGEXS.set('www.tv2east.dk', [String.raw`(?x)https?://(?:www\.)?(?:tvsyd|tv2ostjylland|tvmidtvest|tv2fyn|tv2east|tv2lorry|tv2nord)\.dk/(:[^/]+/)*(?P<id>[^/?\#&]+)`]);
URL_REGEXS.set('www.tv2nord.dk', [String.raw`(?x)https?://(?:www\.)?(?:tvsyd|tv2ostjylland|tvmidtvest|tv2fyn|tv2east|tv2lorry|tv2nord)\.dk/(:[^/]+/)*(?P<id>[^/?\#&]+)`]);
URL_REGEXS.set('play.tv2bornholm.dk', [String.raw`https?://play\.tv2bornholm\.dk/\?.*?\bid=(?P<id>\d+)`]);
URL_REGEXS.set('tv2play.hu', [String.raw`https?://(?:www\.)?tv2play\.hu/(?!szalag/)(?P<id>[^#&?]+)`, String.raw`https?://(?:www\.)?tv2play\.hu/szalag/(?P<id>[^#&?]+)`]);
URL_REGEXS.set('www.tv4.se', [String.raw`(?x)https?://(?:www\.)?(?:tv4\.se/(?:[^/]+)/klipp/(?:.*)-|tv4play\.se/(?:(?:program|barn)/(?:(?:[^/]+/){1,2}|(?:[^\?]+)\?video_id=)|iframe/video/|film/|sport/|))(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.tv4play.se', [String.raw`(?x)https?://(?:www\.)?(?:tv4\.se/(?:[^/]+)/klipp/(?:.*)-|tv4play\.se/(?:(?:program|barn)/(?:(?:[^/]+/){1,2}|(?:[^\?]+)\?video_id=)|iframe/video/|film/|sport/|))(?P<id>[0-9]+)`]);
URL_REGEXS.set('revoir.tv5monde.com', [String.raw`https?://(?:www\.)?(?:tv5mondeplus|revoir\.tv5monde)\.com/toutes-les-videos/[^/]+/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.tv5unis.ca', [String.raw`https?://(?:www\.)?tv5unis\.ca/videos/(?P<id>[^/]+)(?:/saisons/(?P<season_number>\d+)/episodes/(?P<episode_number>\d+))?/?(?:[?#&]|$)`, String.raw`https?://(?:www\.)?tv5unis\.ca/videos/[^/]+/(?P<id>\d+)`]);
URL_REGEXS.set('www.tv8.it', [String.raw`https?://(?:www\.)?tv8\.it/(?:show)?video/[0-9a-z-]+-(?P<id>\d+)`]);
URL_REGEXS.set('videos.tva.ca', [String.raw`https?://videos?\.tva\.ca/details/_(?P<id>\d+)`]);
URL_REGEXS.set('video.tva.ca', [String.raw`https?://videos?\.tva\.ca/details/_(?P<id>\d+)`]);
URL_REGEXS.set('www.tvanouvelles.ca', [String.raw`https?://(?:www\.)?tvanouvelles\.ca/videos/(?P<id>\d+)`, String.raw`https?://(?:www\.)?tvanouvelles\.ca/(?:[^/]+/)+(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.tvc.ru', [String.raw`https?://(?:www\.)?tvc\.ru/video/iframe/id/(?P<id>\d+)`, String.raw`https?://(?:www\.)?tvc\.ru/(?!video/iframe/id/)(?P<id>[^?#]+)`]);
URL_REGEXS.set('tver.jp', [String.raw`https?://(?:www\.)?tver\.jp/(?:(?P<type>lp|corner|series|episodes?|feature|tokyo2020/video)/)+(?P<id>[a-zA-Z0-9]+)`]);
URL_REGEXS.set('www.tvigle.ru', [String.raw`https?://(?:www\.)?(?:tvigle\.ru/(?:[^/]+/)+(?P<display_id>[^/]+)/$|cloud\.tvigle\.ru/video/(?P<id>\d+))`]);
URL_REGEXS.set('cloud.tvigle.ru', [String.raw`https?://(?:www\.)?(?:tvigle\.ru/(?:[^/]+/)+(?P<display_id>[^/]+)/$|cloud\.tvigle\.ru/video/(?P<id>\d+))`]);
URL_REGEXS.set('tviplayer.iol.pt', [String.raw`https?://tviplayer\.iol\.pt(/programa/[\w-]+/[a-f0-9]+)?/\w+/(?P<id>\w+)`]);
URL_REGEXS.set('www.tvland.com', [String.raw`https?://(?:www\.)?tvland\.com/(?:video-clips|(?:full-)?episodes)/(?P<id>[^/?#.]+)`]);
URL_REGEXS.set('www.tvn24.pl', [String.raw`https?://(?:(?:[^/]+)\.)?tvn24(?:bis)?\.pl/(?:[^/]+/)*(?P<id>[^/]+)`]);
URL_REGEXS.set('tvnmeteo.tvn24.pl', [String.raw`https?://(?:(?:[^/]+)\.)?tvn24(?:bis)?\.pl/(?:[^/]+/)*(?P<id>[^/]+)`]);
URL_REGEXS.set('fakty.tvn24.pl', [String.raw`https?://(?:(?:[^/]+)\.)?tvn24(?:bis)?\.pl/(?:[^/]+/)*(?P<id>[^/]+)`]);
URL_REGEXS.set('sport.tvn24.pl', [String.raw`https?://(?:(?:[^/]+)\.)?tvn24(?:bis)?\.pl/(?:[^/]+/)*(?P<id>[^/]+)`]);
URL_REGEXS.set('tvn24bis.pl', [String.raw`https?://(?:(?:[^/]+)\.)?tvn24(?:bis)?\.pl/(?:[^/]+/)*(?P<id>[^/]+)`]);
URL_REGEXS.set('de.tvnet.gov.vn', [String.raw`https?://(?:[^/]+)\.tvnet\.gov\.vn/[^/]+/(?:\d+/)?(?P<id>\d+)(?:/|$)`]);
URL_REGEXS.set('vn.tvnet.gov.vn', [String.raw`https?://(?:[^/]+)\.tvnet\.gov\.vn/[^/]+/(?:\d+/)?(?P<id>\d+)(?:/|$)`]);
URL_REGEXS.set('us.tvnet.gov.vn', [String.raw`https?://(?:[^/]+)\.tvnet\.gov\.vn/[^/]+/(?:\d+/)?(?P<id>\d+)(?:/|$)`]);
URL_REGEXS.set('www.tvnoe.cz', [String.raw`https?://(?:www\.)?tvnoe\.cz/video/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.tvnow.de', [String.raw`(?x)https?://(?:www\.)?tvnow\.(?:de|at|ch)/(?P<station>[^/]+)/(?P<show_id>[^/]+)/(?!(?:list|jahr)(?:/|$))(?P<id>[^/?\#&]+)`, String.raw`(?x)(?P<base_url>https?://(?:www\.)?tvnow\.(?:de|at|ch)/(?:shows|serien)/[^/?#&]+-(?P<show_id>\d+))/(?P<year>\d{4})-(?P<month>\d{2})`, String.raw`(?x)(?P<base_url>https?://(?:www\.)?tvnow\.(?:de|at|ch)/(?:filme))/(?P<title>[^/?$&]+)-(?P<id>\d+)`, String.raw`(?x)(?P<base_url>https?://(?:www\.)?tvnow\.(?:de|at|ch)/(?:shows|serien))/(?P<show>[^/]+)-\d+/[^/]+/episode-\d+-(?P<episode>[^/?$&]+)-(?P<id>\d+)`, String.raw`(?x)(?P<base_url>https?://(?:www\.)?tvnow\.(?:de|at|ch)/(?:shows|serien)/[^/?#&]+-(?P<show_id>\d+))/staffel-(?P<id>\d+)`, String.raw`(?x)(?P<base_url>https?://(?:www\.)?tvnow\.(?:de|at|ch)/(?:shows|serien)/[^/?#&]+-(?P<show_id>\d+))`]);
URL_REGEXS.set('cdn.ethnos.gr', [String.raw`(?:https?:)?//(?:www\.|cdn\.|)(?:tvopen|ethnos).gr/embed/(?P<id>\d+)`]);
URL_REGEXS.set('www.ethnos.gr', [String.raw`https?://(?P<netloc>(?:www\.)?(?:tvopen|ethnos)\.gr)/watch/(?P<id>\d+)/(?P<slug>[^/]+)`, String.raw`.*`]);
URL_REGEXS.set('www.tvopen.gr', [String.raw`https?://(?P<netloc>(?:www\.)?(?:tvopen|ethnos)\.gr)/watch/(?P<id>\d+)/(?P<slug>[^/]+)`]);
URL_REGEXS.set('swipeto.pl', [String.raw`https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.(?:pl|info)|tvpworld\.com|swipeto\.pl)/(?:(?!\d+/)[^/]+/)*(?P<id>\d+)`]);
URL_REGEXS.set('www.tvp.pl', [String.raw`https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.(?:pl|info)|tvpworld\.com|swipeto\.pl)/(?:(?!\d+/)[^/]+/)*(?P<id>\d+)`, String.raw`(?x)(?:tvp:|https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.pl|tvp\.info|tvpworld\.com|swipeto\.pl)/(?:sess/(?:tvplayer\.php\?.*?object_id|TVPlayer2/(?:embed|api)\.php\?.*[Ii][Dd])|shared/details\.php\?.*?object_id)=)(?P<id>\d+)`]);
URL_REGEXS.set('wiadomosci.tvp.pl', [String.raw`https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.(?:pl|info)|tvpworld\.com|swipeto\.pl)/(?:(?!\d+/)[^/]+/)*(?P<id>\d+)`, String.raw`(?x)(?:tvp:|https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.pl|tvp\.info|tvpworld\.com|swipeto\.pl)/(?:sess/(?:tvplayer\.php\?.*?object_id|TVPlayer2/(?:embed|api)\.php\?.*[Ii][Dd])|shared/details\.php\?.*?object_id)=)(?P<id>\d+)`]);
URL_REGEXS.set('warszawa.tvp.pl', [String.raw`https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.(?:pl|info)|tvpworld\.com|swipeto\.pl)/(?:(?!\d+/)[^/]+/)*(?P<id>\d+)`]);
URL_REGEXS.set('www.tvp.info', [String.raw`https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.(?:pl|info)|tvpworld\.com|swipeto\.pl)/(?:(?!\d+/)[^/]+/)*(?P<id>\d+)`]);
URL_REGEXS.set('opole.tvp.pl', [String.raw`https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.(?:pl|info)|tvpworld\.com|swipeto\.pl)/(?:(?!\d+/)[^/]+/)*(?P<id>\d+)`]);
URL_REGEXS.set('abc.tvp.pl', [String.raw`https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.(?:pl|info)|tvpworld\.com|swipeto\.pl)/(?:(?!\d+/)[^/]+/)*(?P<id>\d+)`]);
URL_REGEXS.set('jp2.tvp.pl', [String.raw`https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.(?:pl|info)|tvpworld\.com|swipeto\.pl)/(?:(?!\d+/)[^/]+/)*(?P<id>\d+)`]);
URL_REGEXS.set('vod.tvp.pl', [String.raw`https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.(?:pl|info)|tvpworld\.com|swipeto\.pl)/(?:(?!\d+/)[^/]+/)*(?P<id>\d+)`, String.raw`https?://vod\.tvp\.pl/[a-z\d-]+,\d+/[a-z\d-]+(?<!-odcinki)(?:-odcinki,\d+/odcinek-\d+,S\d+E\d+)?,(?P<id>\d+)(?:\?[^#]+)?(?:#.+)?$`, String.raw`https?://vod\.tvp\.pl/[a-z\d-]+,\d+/[a-z\d-]+-odcinki,(?P<id>\d+)(?:\?[^#]+)?(?:#.+)?$`]);
URL_REGEXS.set('krakow.tvp.pl', [String.raw`https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.(?:pl|info)|tvpworld\.com|swipeto\.pl)/(?:(?!\d+/)[^/]+/)*(?P<id>\d+)`]);
URL_REGEXS.set('teleexpress.tvp.pl', [String.raw`https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.(?:pl|info)|tvpworld\.com|swipeto\.pl)/(?:(?!\d+/)[^/]+/)*(?P<id>\d+)`]);
URL_REGEXS.set('sport.tvp.pl', [String.raw`https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.(?:pl|info)|tvpworld\.com|swipeto\.pl)/(?:(?!\d+/)[^/]+/)*(?P<id>\d+)`]);
URL_REGEXS.set('tvp.info', [String.raw`https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.(?:pl|info)|tvpworld\.com|swipeto\.pl)/(?:(?!\d+/)[^/]+/)*(?P<id>\d+)`, String.raw`(?x)(?:tvp:|https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.pl|tvp\.info|tvpworld\.com|swipeto\.pl)/(?:sess/(?:tvplayer\.php\?.*?object_id|TVPlayer2/(?:embed|api)\.php\?.*[Ii][Dd])|shared/details\.php\?.*?object_id)=)(?P<id>\d+)`]);
URL_REGEXS.set('www.tvpparlament.pl', [String.raw`https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.(?:pl|info)|tvpworld\.com|swipeto\.pl)/(?:(?!\d+/)[^/]+/)*(?P<id>\d+)`]);
URL_REGEXS.set('tvpworld.com', [String.raw`https?://(?:[^/]+\.)?(?:tvp(?:parlament)?\.(?:pl|info)|tvpworld\.com|swipeto\.pl)/(?:(?!\d+/)[^/]+/)*(?P<id>\d+)`]);
URL_REGEXS.set('tvpstream.vod.tvp.pl', [String.raw`(?:tvpstream:|https?://tvpstream\.vod\.tvp\.pl/(?:\?(?:[^&]+[&;])*channel_id=)?)(?P<id>\d*)`]);
URL_REGEXS.set('tvplayer.com', [String.raw`https?://(?:www\.)?tvplayer\.com/watch/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('tv3play.skaties.lv', [String.raw`(?x)https?://(?:tv3?)?play\.(?:tv3|skaties)\.(?P<country>lv|lt|ee)/(?P<live>lives/)?[^?#&]+(?:episode|programme|clip)-(?P<id>\d+)`]);
URL_REGEXS.set('play.tv3.ee', [String.raw`(?x)https?://(?:tv3?)?play\.(?:tv3|skaties)\.(?P<country>lv|lt|ee)/(?P<live>lives/)?[^?#&]+(?:episode|programme|clip)-(?P<id>\d+)`]);
URL_REGEXS.set('tweakers.net', [String.raw`https?://tweakers\.net/video/(?P<id>\d+)`]);
URL_REGEXS.set('twitcasting.tv', [String.raw`https?://(?:[^/]+\.)?twitcasting\.tv/(?P<uploader_id>[^/]+)/(?:movie|twplayer)/(?P<id>\d+)`, String.raw`https?://(?:[^/]+\.)?twitcasting\.tv/(?P<id>[^/]+)/?(?:[#?]|$)`, String.raw`https?://(?:[^/]+\.)?twitcasting\.tv/(?P<id>[^/]+)/show/?(?:[#?]|$)`]);
URL_REGEXS.set('clips.twitch.tv', [String.raw`(?x)https?://(?:clips\.twitch\.tv/(?:embed\?.*?\bclip=|(?:[^/]+/)*)|(?:(?:www|go|m)\.)?twitch\.tv/[^/]+/clip/)(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.twitch.tv', [String.raw`(?x)https?://(?:clips\.twitch\.tv/(?:embed\?.*?\bclip=|(?:[^/]+/)*)|(?:(?:www|go|m)\.)?twitch\.tv/[^/]+/clip/)(?P<id>[^/?#&]+)`, String.raw`(?x)https?://(?:(?:(?:www|go|m)\.)?twitch\.tv/|player\.twitch\.tv/\?.*?\bchannel=)(?P<id>[^/#?]+)`, String.raw`(?x)https?://(?:(?:(?:www|go|m)\.)?twitch\.tv/(?:[^/]+/v(?:ideo)?|videos)/|player\.twitch\.tv/\?.*?\bvideo=v?)(?P<id>\d+)`, String.raw`https?://(?:(?:www|go|m)\.)?twitch\.tv/collections/(?P<id>[^/]+)`, String.raw`https?://(?:(?:www|go|m)\.)?twitch\.tv/(?P<id>[^/]+)/(?:videos|profile)`, String.raw`https?://(?:(?:www|go|m)\.)?twitch\.tv/(?P<id>[^/]+)/(?:clips|videos/*?\?.*?\bfilter=clips)`, String.raw`https?://(?:(?:www|go|m)\.)?twitch\.tv/(?P<id>[^/]+)/videos/*?\?.*?\bfilter=collections`]);
URL_REGEXS.set('m.twitch.tv', [String.raw`(?x)https?://(?:clips\.twitch\.tv/(?:embed\?.*?\bclip=|(?:[^/]+/)*)|(?:(?:www|go|m)\.)?twitch\.tv/[^/]+/clip/)(?P<id>[^/?#&]+)`, String.raw`(?x)https?://(?:(?:(?:www|go|m)\.)?twitch\.tv/|player\.twitch\.tv/\?.*?\bchannel=)(?P<id>[^/#?]+)`, String.raw`(?x)https?://(?:(?:(?:www|go|m)\.)?twitch\.tv/(?:[^/]+/v(?:ideo)?|videos)/|player\.twitch\.tv/\?.*?\bvideo=v?)(?P<id>\d+)`, String.raw`https?://(?:(?:www|go|m)\.)?twitch\.tv/(?P<id>[^/]+)/(?:videos|profile)`]);
URL_REGEXS.set('go.twitch.tv', [String.raw`(?x)https?://(?:clips\.twitch\.tv/(?:embed\?.*?\bclip=|(?:[^/]+/)*)|(?:(?:www|go|m)\.)?twitch\.tv/[^/]+/clip/)(?P<id>[^/?#&]+)`, String.raw`(?x)https?://(?:(?:(?:www|go|m)\.)?twitch\.tv/|player\.twitch\.tv/\?.*?\bchannel=)(?P<id>[^/#?]+)`]);
URL_REGEXS.set('player.twitch.tv', [String.raw`(?x)https?://(?:(?:(?:www|go|m)\.)?twitch\.tv/|player\.twitch\.tv/\?.*?\bchannel=)(?P<id>[^/#?]+)`, String.raw`(?x)https?://(?:(?:(?:www|go|m)\.)?twitch\.tv/(?:[^/]+/v(?:ideo)?|videos)/|player\.twitch\.tv/\?.*?\bvideo=v?)(?P<id>\d+)`]);
URL_REGEXS.set('twitter.com', [String.raw`https?://(?:(?:www|m(?:obile)?)\.)?(?:twitter\.com|twitter3e4tixl4xyajtrzo62zg5vztmjuricljdp2c5kshju4avyoid\.onion)/(?:(?:i/web|[^/]+)/status|statuses)/(?P<id>\d+)(?:/video/(?P<index>\d+))?`, String.raw`https?://(?:(?:www|m(?:obile)?)\.)?(?:twitter\.com|twitter3e4tixl4xyajtrzo62zg5vztmjuricljdp2c5kshju4avyoid\.onion)/i/broadcasts/(?P<id>[0-9a-zA-Z]{13})`, String.raw`https?://(?:(?:www|m(?:obile)?)\.)?(?:twitter\.com|twitter3e4tixl4xyajtrzo62zg5vztmjuricljdp2c5kshju4avyoid\.onion)/i/(?:cards/tfw/v1|videos(?:/tweet)?)/(?P<id>\d+)`, String.raw`https?://(?:(?:www|m(?:obile)?)\.)?(?:twitter\.com|twitter3e4tixl4xyajtrzo62zg5vztmjuricljdp2c5kshju4avyoid\.onion)/i/spaces/(?P<id>[0-9a-zA-Z]{13})`]);
URL_REGEXS.set('twitter3e4tixl4xyajtrzo62zg5vztmjuricljdp2c5kshju4avyoid.onion', [String.raw`https?://(?:(?:www|m(?:obile)?)\.)?(?:twitter\.com|twitter3e4tixl4xyajtrzo62zg5vztmjuricljdp2c5kshju4avyoid\.onion)/(?:(?:i/web|[^/]+)/status|statuses)/(?P<id>\d+)(?:/video/(?P<index>\d+))?`]);
URL_REGEXS.set('amp.twimg.com', [String.raw`https?://amp\.twimg\.com/v/(?P<id>[0-9a-f\-]{36})`]);
URL_REGEXS.set('www.udemy.com', [String.raw`(?x)https?://(?:[^/]+\.)?udemy\.com/(?:[^#]+\#/lecture/|lecture/view/?\?lectureId=|[^/]+/learn/v4/t/lecture/)(?P<id>\d+)`, String.raw`https?://(?:[^/]+\.)?udemy\.com/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('wipro.udemy.com', [String.raw`(?x)https?://(?:[^/]+\.)?udemy\.com/(?:[^#]+\#/lecture/|lecture/view/?\?lectureId=|[^/]+/learn/v4/t/lecture/)(?P<id>\d+)`, String.raw`https?://(?:[^/]+\.)?udemy\.com/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('video.udn.com', [String.raw`https?://video\.udn\.com/(?:embed|play)/news/(?P<id>\d+)`, String.raw`.*`]);
URL_REGEXS.set('www.ukcolumn.org', [String.raw`(?i)https?://(?:www\.)?ukcolumn\.org(/index\.php)?/(?:video|ukcolumn-news)/(?P<id>[-a-z0-9]+)`]);
URL_REGEXS.set('uktvplay.uktv.co.uk', [String.raw`https?://uktvplay\.(?:uktv\.)?co\.uk/(?:.+?\?.*?\bvideo=|([^/]+/)*)(?P<id>\d+)`]);
URL_REGEXS.set('uktvplay.co.uk', [String.raw`https?://uktvplay\.(?:uktv\.)?co\.uk/(?:.+?\?.*?\bvideo=|([^/]+/)*)(?P<id>\d+)`]);
URL_REGEXS.set('www.universal-music.de', [String.raw`https?://(?:www\.)?universal-music\.de/[^/]+/videos/[^/?#]+-(?P<id>\d+)`]);
URL_REGEXS.set('utv.unistra.fr', [String.raw`https?://utv\.unistra\.fr/(?:index|video)\.php\?id_video\=(?P<id>\d+)`]);
URL_REGEXS.set('unity3d.com', [String.raw`https?://(?:www\.)?unity3d\.com/learn/tutorials/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.unscripted.news', [String.raw`https?://www\.unscripted\.news/videos/(?P<id>[\w-]+)`]);
URL_REGEXS.set('player.mais.uol.com.br', [String.raw`https?://(?:.+?\.)?uol\.com\.br/.*?(?:(?:mediaId|v)=|view/(?:[a-z0-9]+/)?|video(?:=|/(?:\d{4}/\d{2}/\d{2}/)?))(?P<id>\d+|[\w-]+-[A-Z0-9]+)`]);
URL_REGEXS.set('tvuol.uol.com.br', [String.raw`https?://(?:.+?\.)?uol\.com\.br/.*?(?:(?:mediaId|v)=|view/(?:[a-z0-9]+/)?|video(?:=|/(?:\d{4}/\d{2}/\d{2}/)?))(?P<id>\d+|[\w-]+-[A-Z0-9]+)`]);
URL_REGEXS.set('mais.uol.com.br', [String.raw`https?://(?:.+?\.)?uol\.com\.br/.*?(?:(?:mediaId|v)=|view/(?:[a-z0-9]+/)?|video(?:=|/(?:\d{4}/\d{2}/\d{2}/)?))(?P<id>\d+|[\w-]+-[A-Z0-9]+)`]);
URL_REGEXS.set('noticias.band.uol.com.br', [String.raw`https?://(?:.+?\.)?uol\.com\.br/.*?(?:(?:mediaId|v)=|view/(?:[a-z0-9]+/)?|video(?:=|/(?:\d{4}/\d{2}/\d{2}/)?))(?P<id>\d+|[\w-]+-[A-Z0-9]+)`]);
URL_REGEXS.set('videos.band.uol.com.br', [String.raw`https?://(?:.+?\.)?uol\.com\.br/.*?(?:(?:mediaId|v)=|view/(?:[a-z0-9]+/)?|video(?:=|/(?:\d{4}/\d{2}/\d{2}/)?))(?P<id>\d+|[\w-]+-[A-Z0-9]+)`]);
URL_REGEXS.set('noticias.uol.com.br', [String.raw`https?://(?:.+?\.)?uol\.com\.br/.*?(?:(?:mediaId|v)=|view/(?:[a-z0-9]+/)?|video(?:=|/(?:\d{4}/\d{2}/\d{2}/)?))(?P<id>\d+|[\w-]+-[A-Z0-9]+)`]);
URL_REGEXS.set('content.uplynk.com', [String.raw`(?x)https?://[\w-]+\.uplynk\.com/(?P<path>ext/[0-9a-f]{32}/(?P<external_id>[^/?&]+)|(?P<id>[0-9a-f]{32}))\.(?:m3u8|json)(?:.*?\bpbs=(?P<session_id>[^&]+))?`]);
URL_REGEXS.set('urort.p3.no', [String.raw`https?://(?:www\.)?urort\.p3\.no/#!/Band/(?P<id>[^/]+)$`]);
URL_REGEXS.set('urplay.se', [String.raw`https?://(?:www\.)?ur(?:play|skola)\.se/(?:program|Produkter)/(?P<id>[0-9]+)`]);
URL_REGEXS.set('urskola.se', [String.raw`https?://(?:www\.)?ur(?:play|skola)\.se/(?:program|Produkter)/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.usanetwork.com', [String.raw`https?(?P<permalink>://(?:www\.)?usanetwork\.com/(?:[^/]+/videos?|movies?)/(?:[^/]+/)?(?P<id>\d+))`]);
URL_REGEXS.set('www.usatoday.com', [String.raw`https?://(?:www\.)?usatoday\.com/(?:[^/]+/)*(?P<id>[^?/#]+)`]);
URL_REGEXS.set('www.ustream.tv', [String.raw`https?://(?:www\.)?(?:ustream\.tv|video\.ibm\.com)/(?P<type>recorded|embed|embed/recorded)/(?P<id>\d+)`, String.raw`https?://(?:www\.)?ustream\.tv/channel/(?P<slug>.+)`]);
URL_REGEXS.set('video.ibm.com', [String.raw`https?://(?:www\.)?(?:ustream\.tv|video\.ibm\.com)/(?P<type>recorded|embed|embed/recorded)/(?P<id>\d+)`]);
URL_REGEXS.set('ustudio.com', [String.raw`https?://(?:(?:www|v1)\.)?ustudio\.com/video/(?P<id>[^/]+)/(?P<display_id>[^/?#&]+)`]);
URL_REGEXS.set('app.ustudio.com', [String.raw`https?://(?:(?:app|embed)\.)?ustudio\.com/embed/(?P<uid>[^/]+)/(?P<id>[^/]+)`]);
URL_REGEXS.set('utreon.com', [String.raw`https?://(?:www\.)?utreon.com/v/(?P<id>[a-zA-Z0-9_-]+)`]);
URL_REGEXS.set('video.varzesh3.com', [String.raw`https?://(?:www\.)?video\.varzesh3\.com/(?:[^/]+/)+(?P<id>[^/]+)/?`]);
URL_REGEXS.set('vbox7.com', [String.raw`(?x)https?://(?:[^/]+\.)?vbox7\.com/(?:play:|(?:emb/external\.php|player/ext\.swf)\?.*?\bvid=)(?P<id>[\da-fA-F]+)`]);
URL_REGEXS.set('i49.vbox7.com', [String.raw`(?x)https?://(?:[^/]+\.)?vbox7\.com/(?:play:|(?:emb/external\.php|player/ext\.swf)\?.*?\bvid=)(?P<id>[\da-fA-F]+)`]);
URL_REGEXS.set('veehd.com', [String.raw`https?://veehd\.com/video/(?P<id>\d+)`]);
URL_REGEXS.set('app.veo.co', [String.raw`https?://app\.veo\.co/matches/(?P<id>[0-9A-Za-z-_]+)`]);
URL_REGEXS.set('www.veoh.com', [String.raw`https?://(?:www\.)?veoh\.com/(?:watch|videos|embed|iphone/#_Watch)/(?P<id>(?:v|e|yapi-)[\da-zA-Z]+)`, String.raw`https?://(?:www\.)?veoh\.com/users/(?P<id>[\w-]+)`]);
URL_REGEXS.set('www.vesti.ru', [String.raw`https?://(?:.+?\.)?vesti\.ru/(?P<id>.+)`]);
URL_REGEXS.set('hitech.vesti.ru', [String.raw`https?://(?:.+?\.)?vesti\.ru/(?P<id>.+)`]);
URL_REGEXS.set('sochi2014.vesti.ru', [String.raw`https?://(?:.+?\.)?vesti\.ru/(?P<id>.+)`]);
URL_REGEXS.set('www.vevo.com', [String.raw`(?x)(?:https?://(?:www\.)?vevo\.com/watch/(?!playlist|genre)(?:[^/]+/(?:[^/]+/)?)?|https?://cache\.vevo\.com/m/html/embed\.html\?video=|https?://videoplayer\.vevo\.com/embed/embedded\?videoId=|https?://embed\.vevo\.com/.*?[?&]isrc=|https?://tv\.vevo\.com/watch/artist/(?:[^/]+)/|vevo:)(?P<id>[^&?#]+)`, String.raw`https?://(?:www\.)?vevo\.com/watch/(?P<kind>playlist|genre)/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('embed.vevo.com', [String.raw`(?x)(?:https?://(?:www\.)?vevo\.com/watch/(?!playlist|genre)(?:[^/]+/(?:[^/]+/)?)?|https?://cache\.vevo\.com/m/html/embed\.html\?video=|https?://videoplayer\.vevo\.com/embed/embedded\?videoId=|https?://embed\.vevo\.com/.*?[?&]isrc=|https?://tv\.vevo\.com/watch/artist/(?:[^/]+)/|vevo:)(?P<id>[^&?#]+)`]);
URL_REGEXS.set('tv.vevo.com', [String.raw`(?x)(?:https?://(?:www\.)?vevo\.com/watch/(?!playlist|genre)(?:[^/]+/(?:[^/]+/)?)?|https?://cache\.vevo\.com/m/html/embed\.html\?video=|https?://videoplayer\.vevo\.com/embed/embedded\?videoId=|https?://embed\.vevo\.com/.*?[?&]isrc=|https?://tv\.vevo\.com/watch/artist/(?:[^/]+)/|vevo:)(?P<id>[^&?#]+)`]);
URL_REGEXS.set('www.vgtv.no', [String.raw`(?x)(?:https?://(?:www\.)?(?P<host>tv.vg.no|vgtv.no|bt.no/tv|aftenbladet.no/tv|fvn.no/fvntv|aftenposten.no/webtv|ap.vgtv.no/webtv|tv.aftonbladet.se|tv.aftonbladet.se/abtv|www.aftonbladet.se/tv)/?(?:(?:\#!/)?(?:video|live)/|embed?.*id=|a(?:rticles)?/)|(?P<appname>vgtv|bttv|satv|fvntv|aptv|abtv):)(?P<id>\d+)`]);
URL_REGEXS.set('www.aftenposten.no', [String.raw`(?x)(?:https?://(?:www\.)?(?P<host>tv.vg.no|vgtv.no|bt.no/tv|aftenbladet.no/tv|fvn.no/fvntv|aftenposten.no/webtv|ap.vgtv.no/webtv|tv.aftonbladet.se|tv.aftonbladet.se/abtv|www.aftonbladet.se/tv)/?(?:(?:\#!/)?(?:video|live)/|embed?.*id=|a(?:rticles)?/)|(?P<appname>vgtv|bttv|satv|fvntv|aptv|abtv):)(?P<id>\d+)`]);
URL_REGEXS.set('tv.vg.no', [String.raw`(?x)(?:https?://(?:www\.)?(?P<host>tv.vg.no|vgtv.no|bt.no/tv|aftenbladet.no/tv|fvn.no/fvntv|aftenposten.no/webtv|ap.vgtv.no/webtv|tv.aftonbladet.se|tv.aftonbladet.se/abtv|www.aftonbladet.se/tv)/?(?:(?:\#!/)?(?:video|live)/|embed?.*id=|a(?:rticles)?/)|(?P<appname>vgtv|bttv|satv|fvntv|aptv|abtv):)(?P<id>\d+)`]);
URL_REGEXS.set('ap.vgtv.no', [String.raw`(?x)(?:https?://(?:www\.)?(?P<host>tv.vg.no|vgtv.no|bt.no/tv|aftenbladet.no/tv|fvn.no/fvntv|aftenposten.no/webtv|ap.vgtv.no/webtv|tv.aftonbladet.se|tv.aftonbladet.se/abtv|www.aftonbladet.se/tv)/?(?:(?:\#!/)?(?:video|live)/|embed?.*id=|a(?:rticles)?/)|(?P<appname>vgtv|bttv|satv|fvntv|aptv|abtv):)(?P<id>\d+)`]);
URL_REGEXS.set('tv.aftonbladet.se', [String.raw`(?x)(?:https?://(?:www\.)?(?P<host>tv.vg.no|vgtv.no|bt.no/tv|aftenbladet.no/tv|fvn.no/fvntv|aftenposten.no/webtv|ap.vgtv.no/webtv|tv.aftonbladet.se|tv.aftonbladet.se/abtv|www.aftonbladet.se/tv)/?(?:(?:\#!/)?(?:video|live)/|embed?.*id=|a(?:rticles)?/)|(?P<appname>vgtv|bttv|satv|fvntv|aptv|abtv):)(?P<id>\d+)`]);
URL_REGEXS.set('www.aftonbladet.se', [String.raw`(?x)(?:https?://(?:www\.)?(?P<host>tv.vg.no|vgtv.no|bt.no/tv|aftenbladet.no/tv|fvn.no/fvntv|aftenposten.no/webtv|ap.vgtv.no/webtv|tv.aftonbladet.se|tv.aftonbladet.se/abtv|www.aftonbladet.se/tv)/?(?:(?:\#!/)?(?:video|live)/|embed?.*id=|a(?:rticles)?/)|(?P<appname>vgtv|bttv|satv|fvntv|aptv|abtv):)(?P<id>\d+)`]);
URL_REGEXS.set('www.vh1.com', [String.raw`https?://(?:www\.)?vh1\.com/(?:video-clips|episodes)/(?P<id>[^/?#.]+)`]);
URL_REGEXS.set('www.viafree.no', [String.raw`(?x)https?://(?:www\.)?viafree\.(?P<country>dk|no|se|fi)/(?P<id>(?:program(?:mer)?|ohjelmat)?/(?:[^/]+/)+[^/?#&]+)`]);
URL_REGEXS.set('www.viafree.dk', [String.raw`(?x)https?://(?:www\.)?viafree\.(?P<country>dk|no|se|fi)/(?P<id>(?:program(?:mer)?|ohjelmat)?/(?:[^/]+/)+[^/?#&]+)`]);
URL_REGEXS.set('www.viafree.se', [String.raw`(?x)https?://(?:www\.)?viafree\.(?P<country>dk|no|se|fi)/(?P<id>(?:program(?:mer)?|ohjelmat)?/(?:[^/]+/)+[^/?#&]+)`]);
URL_REGEXS.set('www.viafree.fi', [String.raw`(?x)https?://(?:www\.)?viafree\.(?P<country>dk|no|se|fi)/(?P<id>(?:program(?:mer)?|ohjelmat)?/(?:[^/]+/)+[^/?#&]+)`]);
URL_REGEXS.set('video.vice.com', [String.raw`https?://(?:(?:video|vms)\.vice|(?:www\.)?vice(?:land|tv))\.com/(?P<locale>[^/]+)/(?:video/[^/]+|embed)/(?P<id>[\da-f]{24})`, String.raw`https?://(?:video\.vice|(?:www\.)?vice(?:land|tv))\.com/(?P<locale>[^/]+)/show/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('vms.vice.com', [String.raw`https?://(?:(?:video|vms)\.vice|(?:www\.)?vice(?:land|tv))\.com/(?P<locale>[^/]+)/(?:video/[^/]+|embed)/(?P<id>[\da-f]{24})`]);
URL_REGEXS.set('www.viceland.com', [String.raw`https?://(?:(?:video|vms)\.vice|(?:www\.)?vice(?:land|tv))\.com/(?P<locale>[^/]+)/(?:video/[^/]+|embed)/(?P<id>[\da-f]{24})`]);
URL_REGEXS.set('www.vice.com', [String.raw`https://(?:www\.)?vice\.com/(?P<locale>[^/]+)/article/(?:[0-9a-z]{6}/)?(?P<id>[^?#]+)`]);
URL_REGEXS.set('www.vicetv.com', [String.raw`https?://(?:video\.vice|(?:www\.)?vice(?:land|tv))\.com/(?P<locale>[^/]+)/show/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.vidbit.co', [String.raw`https?://(?:www\.)?vidbit\.co/(?:watch|embed)\?.*?\bv=(?P<id>[\da-zA-Z]+)`]);
URL_REGEXS.set('www.viddler.com', [String.raw`https?://(?:www\.)?viddler\.com/(?:v|embed|player)/(?P<id>[a-z0-9]+)(?:.+?\bsecret=(\d+))?`]);
URL_REGEXS.set('videa.hu', [String.raw`(?x)https?://videa(?:kid)?\.hu/(?:videok/(?:[^/]+/)*[^?#&]+-|(?:videojs_)?player\?.*?\bv=|player/v/)(?P<id>[^?#&]+)`]);
URL_REGEXS.set('videakid.hu', [String.raw`(?x)https?://videa(?:kid)?\.hu/(?:videok/(?:[^/]+/)*[^?#&]+-|(?:videojs_)?player\?.*?\bv=|player/v/)(?P<id>[^?#&]+)`]);
URL_REGEXS.set('video.arnes.si', [String.raw`https?://video\.arnes\.si/(?:[a-z]{2}/)?(?:watch|embed|api/(?:asset|public/video))/(?P<id>[0-9a-zA-Z]{12})`]);
URL_REGEXS.set('video.sky.it', [String.raw`https?://(?:masterchef|video|xfactor)\.sky\.it(?:/[^/]+)*/video/[0-9a-z-]+-(?P<id>\d+)`, String.raw`https?://video\.sky\.it/diretta/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('xfactor.sky.it', [String.raw`https?://(?:masterchef|video|xfactor)\.sky\.it(?:/[^/]+)*/video/[0-9a-z-]+-(?P<id>\d+)`]);
URL_REGEXS.set('masterchef.sky.it', [String.raw`https?://(?:masterchef|video|xfactor)\.sky\.it(?:/[^/]+)*/video/[0-9a-z-]+-(?P<id>\d+)`]);
URL_REGEXS.set('www.videodetective.com', [String.raw`https?://(?:www\.)?videodetective\.com/[^/]+/[^/]+/(?P<id>\d+)`]);
URL_REGEXS.set('www.videofy.me', [String.raw`https?://(?:www\.videofy\.me/.+?|p\.videofy\.me/v)/(?P<id>\d+)(&|#|$)`]);
URL_REGEXS.set('videos.neurips.cc', [String.raw`https?://(?P<host>videos\.icts\.res\.in|videos\.cncf\.io|videos\.neurips\.cc)/(?:(?:topic|category)/[^/#?]+/)?video/(?P<id>[\w-]+)`, String.raw`https?://(?P<host>videos\.icts\.res\.in|videos\.cncf\.io|videos\.neurips\.cc)/category/(?P<id>\d+)/?(?:$|[?#])`, String.raw`https?://(?P<host>videos\.icts\.res\.in|videos\.cncf\.io|videos\.neurips\.cc)/topic/(?P<id>[^/#?]+)/?(?:$|[?#])`]);
URL_REGEXS.set('videos.icts.res.in', [String.raw`https?://(?P<host>videos\.icts\.res\.in|videos\.cncf\.io|videos\.neurips\.cc)/(?:(?:topic|category)/[^/#?]+/)?video/(?P<id>[\w-]+)`, String.raw`https?://(?P<host>videos\.icts\.res\.in|videos\.cncf\.io|videos\.neurips\.cc)/category/(?P<id>\d+)/?(?:$|[?#])`, String.raw`https?://(?P<host>videos\.icts\.res\.in|videos\.cncf\.io|videos\.neurips\.cc)/(?:category/\d+/)?playlist/(?P<id>\d+)`, String.raw`https?://(?P<host>videos\.icts\.res\.in|videos\.cncf\.io|videos\.neurips\.cc)/topic/(?P<id>[^/#?]+)/?(?:$|[?#])`]);
URL_REGEXS.set('videos.cncf.io', [String.raw`https?://(?P<host>videos\.icts\.res\.in|videos\.cncf\.io|videos\.neurips\.cc)/(?:(?:topic|category)/[^/#?]+/)?video/(?P<id>[\w-]+)`, String.raw`https?://(?P<host>videos\.icts\.res\.in|videos\.cncf\.io|videos\.neurips\.cc)/category/(?P<id>\d+)/?(?:$|[?#])`, String.raw`https?://(?P<host>videos\.icts\.res\.in|videos\.cncf\.io|videos\.neurips\.cc)/topic/(?P<id>[^/#?]+)/?(?:$|[?#])`]);
URL_REGEXS.set('player.videoken.com', [String.raw`https?://player\.videoken\.com/embed/slideslive-(?P<id>\d+)`]);
URL_REGEXS.set('videomore.ru', [String.raw`(?x)videomore:(?P<sid>\d+)$|https?://(?:videomore\.ru/(?:embed|[^/]+/[^/]+)/|(?:(?:player\.)?videomore\.ru|siren\.more\.tv/player)/[^/]*\?.*?\btrack_id=|odysseus\.more.tv/player/(?P<partner_id>\d+)/)(?P<id>\d+)(?:[/?#&]|\.(?:xml|json)|$)`, String.raw`https?://(?:videomore\.ru|more\.tv)/(?!embed)(?P<id>[^/]+/[^/?#&]+)(?:/*|[?#&].*?)$`, String.raw`https?://(?:videomore\.ru|more\.tv)/(?P<id>(?:(?:[^/]+/){2})?[^/?#&]+)(?:/*|[?#&].*?)$`]);
URL_REGEXS.set('player.videomore.ru', [String.raw`(?x)videomore:(?P<sid>\d+)$|https?://(?:videomore\.ru/(?:embed|[^/]+/[^/]+)/|(?:(?:player\.)?videomore\.ru|siren\.more\.tv/player)/[^/]*\?.*?\btrack_id=|odysseus\.more.tv/player/(?P<partner_id>\d+)/)(?P<id>\d+)(?:[/?#&]|\.(?:xml|json)|$)`]);
URL_REGEXS.set('odysseus.more.tv', [String.raw`(?x)videomore:(?P<sid>\d+)$|https?://(?:videomore\.ru/(?:embed|[^/]+/[^/]+)/|(?:(?:player\.)?videomore\.ru|siren\.more\.tv/player)/[^/]*\?.*?\btrack_id=|odysseus\.more.tv/player/(?P<partner_id>\d+)/)(?P<id>\d+)(?:[/?#&]|\.(?:xml|json)|$)`]);
URL_REGEXS.set('siren.more.tv', [String.raw`(?x)videomore:(?P<sid>\d+)$|https?://(?:videomore\.ru/(?:embed|[^/]+/[^/]+)/|(?:(?:player\.)?videomore\.ru|siren\.more\.tv/player)/[^/]*\?.*?\btrack_id=|odysseus\.more.tv/player/(?P<partner_id>\d+)/)(?P<id>\d+)(?:[/?#&]|\.(?:xml|json)|$)`]);
URL_REGEXS.set('more.tv', [String.raw`https?://(?:videomore\.ru|more\.tv)/(?!embed)(?P<id>[^/]+/[^/?#&]+)(?:/*|[?#&].*?)$`, String.raw`https?://(?:videomore\.ru|more\.tv)/(?P<id>(?:(?:[^/]+/){2})?[^/?#&]+)(?:/*|[?#&].*?)$`]);
URL_REGEXS.set('videopress.com', [String.raw`https?://video(?:\.word)?press\.com/embed/(?P<id>[\da-zA-Z]{8})`]);
URL_REGEXS.set('video.wordpress.com', [String.raw`https?://video(?:\.word)?press\.com/embed/(?P<id>[\da-zA-Z]{8})`]);
URL_REGEXS.set('www.vidio.com', [String.raw`https?://(?:www\.)?vidio\.com/(watch|embed)/(?P<id>\d+)-(?P<display_id>[^/?#&]+)`, String.raw`https?://(?:www\.)?vidio\.com/live/(?P<id>\d+)-(?P<display_id>[^/?#&]+)`, String.raw`https?://(?:www\.)?vidio\.com/premier/(?P<id>\d+)/(?P<display_id>[^/?#&]+)`]);
URL_REGEXS.set('www.vidlii.com', [String.raw`https?://(?:www\.)?vidlii\.com/(?:watch|embed)\?.*?\bv=(?P<id>[0-9A-Za-z_-]{11})`]);
URL_REGEXS.set('www.snagfilms.com', [String.raw`https?://(?:www\.)?(?P<domain>(?:(?:main\.)?snagfilms|snagxtreme|funnyforfree|kiddovid|winnersview|(?:monumental|lax)sportsnetwork|vayafilm|failarmy|ftfnext|lnppass\.legapallacanestro|moviespree|app\.myoutdoortv|neoufitness|pflmma|theidentitytb)\.com|(?:hoichoi|app\.horseandcountry|kronon|marquee|supercrosslive)\.tv)(?P<path>(?:/(?:films/title|show|(?:news/)?videos?|watch))?/(?P<id>[^?#]+))`, String.raw`https?://(?:(?:www|embed)\.)?(?P<domain>(?:(?:main\.)?snagfilms|snagxtreme|funnyforfree|kiddovid|winnersview|(?:monumental|lax)sportsnetwork|vayafilm|failarmy|ftfnext|lnppass\.legapallacanestro|moviespree|app\.myoutdoortv|neoufitness|pflmma|theidentitytb)\.com|(?:hoichoi|app\.horseandcountry|kronon|marquee|supercrosslive)\.tv)/embed/player\?.*\bfilmId=(?P<id>[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12})`]);
URL_REGEXS.set('main.snagfilms.com', [String.raw`https?://(?:www\.)?(?P<domain>(?:(?:main\.)?snagfilms|snagxtreme|funnyforfree|kiddovid|winnersview|(?:monumental|lax)sportsnetwork|vayafilm|failarmy|ftfnext|lnppass\.legapallacanestro|moviespree|app\.myoutdoortv|neoufitness|pflmma|theidentitytb)\.com|(?:hoichoi|app\.horseandcountry|kronon|marquee|supercrosslive)\.tv)(?P<path>(?:/(?:films/title|show|(?:news/)?videos?|watch))?/(?P<id>[^?#]+))`]);
URL_REGEXS.set('www.winnersview.com', [String.raw`https?://(?:www\.)?(?P<domain>(?:(?:main\.)?snagfilms|snagxtreme|funnyforfree|kiddovid|winnersview|(?:monumental|lax)sportsnetwork|vayafilm|failarmy|ftfnext|lnppass\.legapallacanestro|moviespree|app\.myoutdoortv|neoufitness|pflmma|theidentitytb)\.com|(?:hoichoi|app\.horseandcountry|kronon|marquee|supercrosslive)\.tv)(?P<path>(?:/(?:films/title|show|(?:news/)?videos?|watch))?/(?P<id>[^?#]+))`]);
URL_REGEXS.set('www.monumentalsportsnetwork.com', [String.raw`https?://(?:www\.)?(?P<domain>(?:(?:main\.)?snagfilms|snagxtreme|funnyforfree|kiddovid|winnersview|(?:monumental|lax)sportsnetwork|vayafilm|failarmy|ftfnext|lnppass\.legapallacanestro|moviespree|app\.myoutdoortv|neoufitness|pflmma|theidentitytb)\.com|(?:hoichoi|app\.horseandcountry|kronon|marquee|supercrosslive)\.tv)(?P<path>(?:/(?:films/title|show|(?:news/)?videos?|watch))?/(?P<id>[^?#]+))`]);
URL_REGEXS.set('www.marquee.tv', [String.raw`https?://(?:www\.)?(?P<domain>(?:(?:main\.)?snagfilms|snagxtreme|funnyforfree|kiddovid|winnersview|(?:monumental|lax)sportsnetwork|vayafilm|failarmy|ftfnext|lnppass\.legapallacanestro|moviespree|app\.myoutdoortv|neoufitness|pflmma|theidentitytb)\.com|(?:hoichoi|app\.horseandcountry|kronon|marquee|supercrosslive)\.tv)(?P<path>(?:/(?:films/title|show|(?:news/)?videos?|watch))?/(?P<id>[^?#]+))`]);
URL_REGEXS.set('www.hoichoi.tv', [String.raw`https?://(?:www\.)?(?P<domain>(?:(?:main\.)?snagfilms|snagxtreme|funnyforfree|kiddovid|winnersview|(?:monumental|lax)sportsnetwork|vayafilm|failarmy|ftfnext|lnppass\.legapallacanestro|moviespree|app\.myoutdoortv|neoufitness|pflmma|theidentitytb)\.com|(?:hoichoi|app\.horseandcountry|kronon|marquee|supercrosslive)\.tv)(?P<path>(?:/(?:films/title|show|(?:news/)?videos?|watch))?/(?P<id>[^?#]+))`]);
URL_REGEXS.set('embed.snagfilms.com', [String.raw`https?://(?:(?:www|embed)\.)?(?P<domain>(?:(?:main\.)?snagfilms|snagxtreme|funnyforfree|kiddovid|winnersview|(?:monumental|lax)sportsnetwork|vayafilm|failarmy|ftfnext|lnppass\.legapallacanestro|moviespree|app\.myoutdoortv|neoufitness|pflmma|theidentitytb)\.com|(?:hoichoi|app\.horseandcountry|kronon|marquee|supercrosslive)\.tv)/embed/player\?.*\bfilmId=(?P<id>[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12})`]);
URL_REGEXS.set('videolectures.net', [String.raw`(?x)https?://(?:www\.)?(?:videolectures\.net|flexilearn\.viidea\.net|presentations\.ocwconsortium\.org|video\.travel-zoom\.si|video\.pomp-forum\.si|tv\.nil\.si|video\.hekovnik.com|video\.szko\.si|kpk\.viidea\.com|inside\.viidea\.net|video\.kiberpipa\.org|bvvideo\.si|kongres\.viidea\.net|edemokracija\.viidea\.com)(?:/lecture)?/(?P<id>[^/]+)(?:/video/(?P<part>\d+))?/*(?:[#?].*)?$`, String.raw`.*`]);
URL_REGEXS.set('www.viki.com', [String.raw`https?://(?:www\.)?viki\.(?:com|net|mx|jp|fr)/(?:videos|player)/(?P<id>[0-9]+v)`, String.raw`https?://(?:www\.)?viki\.(?:com|net|mx|jp|fr)/(?:tv|news|movies|artists)/(?P<id>[0-9]+c)`]);
URL_REGEXS.set('vimeo.com', [String.raw`(?x)https?://(?:(?:www|player)\.)?vimeo\.com/(?!(?:channels|album|showcase)/[^/?#]+/?(?:$|[?#])|[^/]+/review/|ondemand/)(?:[^/]+/)*?(?:(?:play_redirect_hls|moogaloop\.swf)\?clip_id=)?(?:videos?/)?(?P<id>[0-9]+)(?:/(?P<unlisted_hash>[\da-f]{10}))?/?(?:[?&].*)?(?:[#].*)?$`, String.raw`https://vimeo\.com/(?:album|showcase)/(?P<id>\d+)(?:$|[?#]|/(?!video))`, String.raw`https://vimeo\.com/channels/(?P<id>[^/?#]+)/?(?:$|[?#])`, String.raw`https://vimeo\.com/groups/(?P<id>[^/]+)(?:/(?!videos?/\d+)|$)`, String.raw`https://(?:www\.)?vimeo\.com/(?P<id>[^/]+)/likes/?(?:$|[?#]|sort:)`, String.raw`https?://(?:www\.)?vimeo\.com/ondemand/(?:[^/]+/)?(?P<id>[^/?#&]+)`, String.raw`(?P<url>https://vimeo\.com/[^/]+/review/(?P<id>[^/]+)/[0-9a-f]{10})`, String.raw`https://vimeo\.com/(?!(?:[0-9]+|watchlater)(?:$|[?#/]))(?P<id>[^/]+)(?:/videos)?/?(?:$|[?#])`, String.raw`https://vimeo\.com/(?:home/)?watchlater|:vimeowatchlater`]);
URL_REGEXS.set('player.vimeo.com', [String.raw`(?x)https?://(?:(?:www|player)\.)?vimeo\.com/(?!(?:channels|album|showcase)/[^/?#]+/?(?:$|[?#])|[^/]+/review/|ondemand/)(?:[^/]+/)*?(?:(?:play_redirect_hls|moogaloop\.swf)\?clip_id=)?(?:videos?/)?(?P<id>[0-9]+)(?:/(?P<unlisted_hash>[\da-f]{10}))?/?(?:[?&].*)?(?:[#].*)?$`]);
URL_REGEXS.set('vimeopro.com', [String.raw`https?://(?:www\.)?vimeopro\.com/[^/?#]+/(?P<slug>[^/?#]+)(?:(?:/videos?/(?P<id>[0-9]+)))?`]);
URL_REGEXS.set('www.vimm.tv', [String.raw`https?://(?:www\.)?vimm\.tv/c/(?P<channel_id>[0-9a-z-]+)\?v=(?P<video_id>[0-9A-Za-z]+)`, String.raw`https?://(?:www\.)?vimm\.tv/(?:c/)?(?P<id>[0-9a-z-]+)$`]);
URL_REGEXS.set('videocampus.sachsen.de', [String.raw`(?x)https?://(?P<host>bergauf\.tv|campus\.demo\.vimp\.com|corporate\.demo\.vimp\.com|dancehalldatabase\.com|drehzahl\.tv|educhannel\.hs\-gesundheit\.de|emedia\.ls\.haw\-hamburg\.de|globale\-evolution\.net|hohu\.tv|htvideos\.hightechhigh\.org|k210039\.vimp\.mivitec\.net|media\.cmslegal\.com|media\.hs\-furtwangen\.de|media\.hwr\-berlin\.de|mediathek\.dkfz\.de|mediathek\.htw\-berlin\.de|mediathek\.polizei\-bw\.de|medien\.hs\-merseburg\.de|mportal\.europa\-uni\.de|pacific\.demo\.vimp\.com|slctv\.com|streaming\.prairiesouth\.ca|tube\.isbonline\.cn|univideo\.uni\-kassel\.de|ursula2\.genetics\.emory\.edu|ursulablicklevideoarchiv\.com|v\.agrarumweltpaedagogik\.at|video\.eplay\-tv\.de|video\.fh\-dortmund\.de|video\.hs\-offenburg\.de|video\.hs\-pforzheim\.de|video\.hspv\.nrw\.de|video\.irtshdf\.fr|video\.pareygo\.de|video\.tu\-freiberg\.de|videocampus\.sachsen\.de|videoportal\.uni\-freiburg\.de|videoportal\.vm\.uni\-freiburg\.de|videos\.duoc\.cl|videos\.uni\-paderborn\.de|vimp\-bemus\.udk\-berlin\.de|vimp\.aekwl\.de|vimp\.hs\-mittweida\.de|vimp\.oth\-regensburg\.de|vimp\.ph\-heidelberg\.de|vimp\.sma\-events\.com|vimp\.weka\-fachmedien\.de|webtv\.univ\-montp3\.fr|www\.b\-tu\.de/media|www\.bergauf\.tv|www\.bigcitytv\.de|www\.cad\-videos\.de|www\.drehzahl\.tv|www\.fh\-bielefeld\.de/medienportal|www\.hohu\.tv|www\.orvovideo\.com|www\.rwe\.tv|www\.salzi\.tv|www\.wenglor\-media\.com|www2\.univ\-sba\.dz)/(?:m/(?P<tmp_id>[0-9a-f]+)|(?:category/)?video/(?P<display_id>[\w-]+)/(?P<id>[0-9a-f]{32})|media/embed.*(?:\?|&)key=(?P<embed_id>[0-9a-f]{32}&?))`, String.raw`(?x)(?P<host>https?://(?:bergauf\.tv|campus\.demo\.vimp\.com|corporate\.demo\.vimp\.com|dancehalldatabase\.com|drehzahl\.tv|educhannel\.hs\-gesundheit\.de|emedia\.ls\.haw\-hamburg\.de|globale\-evolution\.net|hohu\.tv|htvideos\.hightechhigh\.org|k210039\.vimp\.mivitec\.net|media\.cmslegal\.com|media\.hs\-furtwangen\.de|media\.hwr\-berlin\.de|mediathek\.dkfz\.de|mediathek\.htw\-berlin\.de|mediathek\.polizei\-bw\.de|medien\.hs\-merseburg\.de|mportal\.europa\-uni\.de|pacific\.demo\.vimp\.com|slctv\.com|streaming\.prairiesouth\.ca|tube\.isbonline\.cn|univideo\.uni\-kassel\.de|ursula2\.genetics\.emory\.edu|ursulablicklevideoarchiv\.com|v\.agrarumweltpaedagogik\.at|video\.eplay\-tv\.de|video\.fh\-dortmund\.de|video\.hs\-offenburg\.de|video\.hs\-pforzheim\.de|video\.hspv\.nrw\.de|video\.irtshdf\.fr|video\.pareygo\.de|video\.tu\-freiberg\.de|videocampus\.sachsen\.de|videoportal\.uni\-freiburg\.de|videoportal\.vm\.uni\-freiburg\.de|videos\.duoc\.cl|videos\.uni\-paderborn\.de|vimp\-bemus\.udk\-berlin\.de|vimp\.aekwl\.de|vimp\.hs\-mittweida\.de|vimp\.oth\-regensburg\.de|vimp\.ph\-heidelberg\.de|vimp\.sma\-events\.com|vimp\.weka\-fachmedien\.de|webtv\.univ\-montp3\.fr|www\.b\-tu\.de/media|www\.bergauf\.tv|www\.bigcitytv\.de|www\.cad\-videos\.de|www\.drehzahl\.tv|www\.fh\-bielefeld\.de/medienportal|www\.hohu\.tv|www\.orvovideo\.com|www\.rwe\.tv|www\.salzi\.tv|www\.wenglor\-media\.com|www2\.univ\-sba\.dz))/(?:album/view/aid/(?P<album_id>[0-9]+)|(?P<mode>category|channel)/(?P<name>[\w-]+)/(?P<id>[0-9]+))`]);
URL_REGEXS.set('www2.univ-sba.dz', [String.raw`(?x)https?://(?P<host>bergauf\.tv|campus\.demo\.vimp\.com|corporate\.demo\.vimp\.com|dancehalldatabase\.com|drehzahl\.tv|educhannel\.hs\-gesundheit\.de|emedia\.ls\.haw\-hamburg\.de|globale\-evolution\.net|hohu\.tv|htvideos\.hightechhigh\.org|k210039\.vimp\.mivitec\.net|media\.cmslegal\.com|media\.hs\-furtwangen\.de|media\.hwr\-berlin\.de|mediathek\.dkfz\.de|mediathek\.htw\-berlin\.de|mediathek\.polizei\-bw\.de|medien\.hs\-merseburg\.de|mportal\.europa\-uni\.de|pacific\.demo\.vimp\.com|slctv\.com|streaming\.prairiesouth\.ca|tube\.isbonline\.cn|univideo\.uni\-kassel\.de|ursula2\.genetics\.emory\.edu|ursulablicklevideoarchiv\.com|v\.agrarumweltpaedagogik\.at|video\.eplay\-tv\.de|video\.fh\-dortmund\.de|video\.hs\-offenburg\.de|video\.hs\-pforzheim\.de|video\.hspv\.nrw\.de|video\.irtshdf\.fr|video\.pareygo\.de|video\.tu\-freiberg\.de|videocampus\.sachsen\.de|videoportal\.uni\-freiburg\.de|videoportal\.vm\.uni\-freiburg\.de|videos\.duoc\.cl|videos\.uni\-paderborn\.de|vimp\-bemus\.udk\-berlin\.de|vimp\.aekwl\.de|vimp\.hs\-mittweida\.de|vimp\.oth\-regensburg\.de|vimp\.ph\-heidelberg\.de|vimp\.sma\-events\.com|vimp\.weka\-fachmedien\.de|webtv\.univ\-montp3\.fr|www\.b\-tu\.de/media|www\.bergauf\.tv|www\.bigcitytv\.de|www\.cad\-videos\.de|www\.drehzahl\.tv|www\.fh\-bielefeld\.de/medienportal|www\.hohu\.tv|www\.orvovideo\.com|www\.rwe\.tv|www\.salzi\.tv|www\.wenglor\-media\.com|www2\.univ\-sba\.dz)/(?:m/(?P<tmp_id>[0-9a-f]+)|(?:category/)?video/(?P<display_id>[\w-]+)/(?P<id>[0-9a-f]{32})|media/embed.*(?:\?|&)key=(?P<embed_id>[0-9a-f]{32}&?))`]);
URL_REGEXS.set('vimp.weka-fachmedien.de', [String.raw`(?x)https?://(?P<host>bergauf\.tv|campus\.demo\.vimp\.com|corporate\.demo\.vimp\.com|dancehalldatabase\.com|drehzahl\.tv|educhannel\.hs\-gesundheit\.de|emedia\.ls\.haw\-hamburg\.de|globale\-evolution\.net|hohu\.tv|htvideos\.hightechhigh\.org|k210039\.vimp\.mivitec\.net|media\.cmslegal\.com|media\.hs\-furtwangen\.de|media\.hwr\-berlin\.de|mediathek\.dkfz\.de|mediathek\.htw\-berlin\.de|mediathek\.polizei\-bw\.de|medien\.hs\-merseburg\.de|mportal\.europa\-uni\.de|pacific\.demo\.vimp\.com|slctv\.com|streaming\.prairiesouth\.ca|tube\.isbonline\.cn|univideo\.uni\-kassel\.de|ursula2\.genetics\.emory\.edu|ursulablicklevideoarchiv\.com|v\.agrarumweltpaedagogik\.at|video\.eplay\-tv\.de|video\.fh\-dortmund\.de|video\.hs\-offenburg\.de|video\.hs\-pforzheim\.de|video\.hspv\.nrw\.de|video\.irtshdf\.fr|video\.pareygo\.de|video\.tu\-freiberg\.de|videocampus\.sachsen\.de|videoportal\.uni\-freiburg\.de|videoportal\.vm\.uni\-freiburg\.de|videos\.duoc\.cl|videos\.uni\-paderborn\.de|vimp\-bemus\.udk\-berlin\.de|vimp\.aekwl\.de|vimp\.hs\-mittweida\.de|vimp\.oth\-regensburg\.de|vimp\.ph\-heidelberg\.de|vimp\.sma\-events\.com|vimp\.weka\-fachmedien\.de|webtv\.univ\-montp3\.fr|www\.b\-tu\.de/media|www\.bergauf\.tv|www\.bigcitytv\.de|www\.cad\-videos\.de|www\.drehzahl\.tv|www\.fh\-bielefeld\.de/medienportal|www\.hohu\.tv|www\.orvovideo\.com|www\.rwe\.tv|www\.salzi\.tv|www\.wenglor\-media\.com|www2\.univ\-sba\.dz)/(?:m/(?P<tmp_id>[0-9a-f]+)|(?:category/)?video/(?P<display_id>[\w-]+)/(?P<id>[0-9a-f]{32})|media/embed.*(?:\?|&)key=(?P<embed_id>[0-9a-f]{32}&?))`]);
URL_REGEXS.set('vimp.oth-regensburg.de', [String.raw`(?x)(?P<host>https?://(?:bergauf\.tv|campus\.demo\.vimp\.com|corporate\.demo\.vimp\.com|dancehalldatabase\.com|drehzahl\.tv|educhannel\.hs\-gesundheit\.de|emedia\.ls\.haw\-hamburg\.de|globale\-evolution\.net|hohu\.tv|htvideos\.hightechhigh\.org|k210039\.vimp\.mivitec\.net|media\.cmslegal\.com|media\.hs\-furtwangen\.de|media\.hwr\-berlin\.de|mediathek\.dkfz\.de|mediathek\.htw\-berlin\.de|mediathek\.polizei\-bw\.de|medien\.hs\-merseburg\.de|mportal\.europa\-uni\.de|pacific\.demo\.vimp\.com|slctv\.com|streaming\.prairiesouth\.ca|tube\.isbonline\.cn|univideo\.uni\-kassel\.de|ursula2\.genetics\.emory\.edu|ursulablicklevideoarchiv\.com|v\.agrarumweltpaedagogik\.at|video\.eplay\-tv\.de|video\.fh\-dortmund\.de|video\.hs\-offenburg\.de|video\.hs\-pforzheim\.de|video\.hspv\.nrw\.de|video\.irtshdf\.fr|video\.pareygo\.de|video\.tu\-freiberg\.de|videocampus\.sachsen\.de|videoportal\.uni\-freiburg\.de|videoportal\.vm\.uni\-freiburg\.de|videos\.duoc\.cl|videos\.uni\-paderborn\.de|vimp\-bemus\.udk\-berlin\.de|vimp\.aekwl\.de|vimp\.hs\-mittweida\.de|vimp\.oth\-regensburg\.de|vimp\.ph\-heidelberg\.de|vimp\.sma\-events\.com|vimp\.weka\-fachmedien\.de|webtv\.univ\-montp3\.fr|www\.b\-tu\.de/media|www\.bergauf\.tv|www\.bigcitytv\.de|www\.cad\-videos\.de|www\.drehzahl\.tv|www\.fh\-bielefeld\.de/medienportal|www\.hohu\.tv|www\.orvovideo\.com|www\.rwe\.tv|www\.salzi\.tv|www\.wenglor\-media\.com|www2\.univ\-sba\.dz))/(?:album/view/aid/(?P<album_id>[0-9]+)|(?P<mode>category|channel)/(?P<name>[\w-]+)/(?P<id>[0-9]+))`]);
URL_REGEXS.set('www.fh-bielefeld.de', [String.raw`(?x)(?P<host>https?://(?:bergauf\.tv|campus\.demo\.vimp\.com|corporate\.demo\.vimp\.com|dancehalldatabase\.com|drehzahl\.tv|educhannel\.hs\-gesundheit\.de|emedia\.ls\.haw\-hamburg\.de|globale\-evolution\.net|hohu\.tv|htvideos\.hightechhigh\.org|k210039\.vimp\.mivitec\.net|media\.cmslegal\.com|media\.hs\-furtwangen\.de|media\.hwr\-berlin\.de|mediathek\.dkfz\.de|mediathek\.htw\-berlin\.de|mediathek\.polizei\-bw\.de|medien\.hs\-merseburg\.de|mportal\.europa\-uni\.de|pacific\.demo\.vimp\.com|slctv\.com|streaming\.prairiesouth\.ca|tube\.isbonline\.cn|univideo\.uni\-kassel\.de|ursula2\.genetics\.emory\.edu|ursulablicklevideoarchiv\.com|v\.agrarumweltpaedagogik\.at|video\.eplay\-tv\.de|video\.fh\-dortmund\.de|video\.hs\-offenburg\.de|video\.hs\-pforzheim\.de|video\.hspv\.nrw\.de|video\.irtshdf\.fr|video\.pareygo\.de|video\.tu\-freiberg\.de|videocampus\.sachsen\.de|videoportal\.uni\-freiburg\.de|videoportal\.vm\.uni\-freiburg\.de|videos\.duoc\.cl|videos\.uni\-paderborn\.de|vimp\-bemus\.udk\-berlin\.de|vimp\.aekwl\.de|vimp\.hs\-mittweida\.de|vimp\.oth\-regensburg\.de|vimp\.ph\-heidelberg\.de|vimp\.sma\-events\.com|vimp\.weka\-fachmedien\.de|webtv\.univ\-montp3\.fr|www\.b\-tu\.de/media|www\.bergauf\.tv|www\.bigcitytv\.de|www\.cad\-videos\.de|www\.drehzahl\.tv|www\.fh\-bielefeld\.de/medienportal|www\.hohu\.tv|www\.orvovideo\.com|www\.rwe\.tv|www\.salzi\.tv|www\.wenglor\-media\.com|www2\.univ\-sba\.dz))/(?:album/view/aid/(?P<album_id>[0-9]+)|(?P<mode>category|channel)/(?P<name>[\w-]+)/(?P<id>[0-9]+))`]);
URL_REGEXS.set('vimple.ru', [String.raw`https?://(?:player\.vimple\.(?:ru|co)/iframe|vimple\.(?:ru|co))/(?P<id>[\da-f-]{32,36})`]);
URL_REGEXS.set('player.vimple.ru', [String.raw`https?://(?:player\.vimple\.(?:ru|co)/iframe|vimple\.(?:ru|co))/(?P<id>[\da-f-]{32,36})`]);
URL_REGEXS.set('vimple.co', [String.raw`https?://(?:player\.vimple\.(?:ru|co)/iframe|vimple\.(?:ru|co))/(?P<id>[\da-f-]{32,36})`]);
URL_REGEXS.set('vine.co', [String.raw`https?://(?:www\.)?vine\.co/(?:v|oembed)/(?P<id>\w+)`, String.raw`https?://vine\.co/(?P<u>u/)?(?P<user>[^/]+)`]);
URL_REGEXS.set('cdn.viqeo.tv', [String.raw`(?x)(?:viqeo:|https?://cdn\.viqeo\.tv/embed/*\?.*?\bvid=|https?://api\.viqeo\.tv/v\d+/data/startup?.*?\bvideo(?:%5B%5D|\[\])=)(?P<id>[\da-f]+)`]);
URL_REGEXS.set('api.viqeo.tv', [String.raw`(?x)(?:viqeo:|https?://cdn\.viqeo\.tv/embed/*\?.*?\bvid=|https?://api\.viqeo\.tv/v\d+/data/startup?.*?\bvideo(?:%5B%5D|\[\])=)(?P<id>[\da-f]+)`]);
URL_REGEXS.set('www.viu.com', [String.raw`(?:viu:|https?://[^/]+\.viu\.com/[a-z]{2}/media/)(?P<id>\d+)`, String.raw`https?://(?:www\.)?viu\.com/ott/(?P<country_code>[a-z]{2})/(?P<lang_code>[a-z]{2}-[a-z]{2})/vod/(?P<id>\d+)`, String.raw`https?://www\.viu\.com/[^/]+/listing/playlist-(?P<id>\d+)`]);
URL_REGEXS.set('india.viu.com', [String.raw`(?:viu:|https?://[^/]+\.viu\.com/[a-z]{2}/media/)(?P<id>\d+)`]);
URL_REGEXS.set('vivo.sx', [String.raw`https?://vivo\.s[xt]/(?P<id>[\da-z]{10})`]);
URL_REGEXS.set('vivo.st', [String.raw`https?://vivo\.s[xt]/(?P<id>[\da-z]{10})`]);
URL_REGEXS.set('vk.com', [String.raw`(?x)https?://(?:(?:(?:(?:m|new)\.)?vk\.com/video_|(?:www\.)?daxab.com/)ext\.php\?(?P<embed_query>.*?\boid=(?P<oid>-?\d+).*?\bid=(?P<id>\d+).*)|(?:(?:(?:m|new)\.)?vk\.com/(?:.+?\?.*?z=)?(?:video|clip)|(?:www\.)?daxab.com/embed/)(?P<videoid>-?\d+_\d+)(?:.*\blist=(?P<list_id>([\da-f]+)|(ln-[\da-zA-Z]+)))?)`, String.raw`https?://(?:(?:m|new)\.)?vk\.com/video/(?:playlist/)?(?P<id>[^?$#/&]+)(?!\?.*\bz=video)(?:[/?#&](?:.*?\bsection=(?P<section>\w+))?|$)`, String.raw`https?://(?:(?:(?:(?:m|new)\.)?vk\.com/(?:[^?]+\?.*\bw=)?wall(?P<id>-?\d+_\d+)))`]);
URL_REGEXS.set('m.vk.com', [String.raw`(?x)https?://(?:(?:(?:(?:m|new)\.)?vk\.com/video_|(?:www\.)?daxab.com/)ext\.php\?(?P<embed_query>.*?\boid=(?P<oid>-?\d+).*?\bid=(?P<id>\d+).*)|(?:(?:(?:m|new)\.)?vk\.com/(?:.+?\?.*?z=)?(?:video|clip)|(?:www\.)?daxab.com/embed/)(?P<videoid>-?\d+_\d+)(?:.*\blist=(?P<list_id>([\da-f]+)|(ln-[\da-zA-Z]+)))?)`, String.raw`https?://(?:(?:(?:(?:m|new)\.)?vk\.com/(?:[^?]+\?.*\bw=)?wall(?P<id>-?\d+_\d+)))`]);
URL_REGEXS.set('new.vk.com', [String.raw`(?x)https?://(?:(?:(?:(?:m|new)\.)?vk\.com/video_|(?:www\.)?daxab.com/)ext\.php\?(?P<embed_query>.*?\boid=(?P<oid>-?\d+).*?\bid=(?P<id>\d+).*)|(?:(?:(?:m|new)\.)?vk\.com/(?:.+?\?.*?z=)?(?:video|clip)|(?:www\.)?daxab.com/embed/)(?P<videoid>-?\d+_\d+)(?:.*\blist=(?P<list_id>([\da-f]+)|(ln-[\da-zA-Z]+)))?)`]);
URL_REGEXS.set('www.vlive.tv', [String.raw`https?://(?:(?:www|m)\.)?vlive\.tv/(?:video|embed)/(?P<id>[0-9]+)`, String.raw`https?://(?:channels\.vlive\.tv|(?:(?:www|m)\.)?vlive\.tv/channel)/(?P<channel_id>[0-9A-Z]+)(?:/board/(?P<posts_id>\d+))?`, String.raw`https?://(?:(?:www|m)\.)?vlive\.tv/post/(?P<id>\d-\d+)`]);
URL_REGEXS.set('channels.vlive.tv', [String.raw`https?://(?:channels\.vlive\.tv|(?:(?:www|m)\.)?vlive\.tv/channel)/(?P<channel_id>[0-9A-Z]+)(?:/board/(?P<posts_id>\d+))?`]);
URL_REGEXS.set('vm.tiktok.com', [String.raw`https?://(?:(?:vm|vt)\.tiktok\.com|(?:www\.)tiktok\.com/t)/(?P<id>\w+)`]);
URL_REGEXS.set('vt.tiktok.com', [String.raw`https?://(?:(?:vm|vt)\.tiktok\.com|(?:www\.)tiktok\.com/t)/(?P<id>\w+)`]);
URL_REGEXS.set('vodlocker.com', [String.raw`https?://(?:www\.)?vodlocker\.(?:com|city)/(?:embed-)?(?P<id>[0-9a-zA-Z]+)(?:\..*?)?`]);
URL_REGEXS.set('vod.pl', [String.raw`https?://vod\.pl/(?:[^/]+/)+(?P<id>[0-9a-zA-Z]+)`]);
URL_REGEXS.set('vod-platform.net', [String.raw`https?://(?:(?:www\.)?vod-platform\.net|embed\.kwikmotion\.com)/[eE]mbed/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('embed.kwikmotion.com', [String.raw`https?://(?:(?:www\.)?vod-platform\.net|embed\.kwikmotion\.com)/[eE]mbed/(?P<id>[^/?#]+)`]);
URL_REGEXS.set('voicerepublic.com', [String.raw`https?://voicerepublic\.com/(?:talks|embed)/(?P<id>[0-9a-z-]+)`]);
URL_REGEXS.set('voicy.jp', [String.raw`https?://voicy\.jp/channel/(?P<channel_id>\d+)/(?P<id>\d+)`, String.raw`https?://voicy\.jp/channel/(?P<id>\d+)`]);
URL_REGEXS.set('volej.tv', [String.raw`https?://volej\.tv/video/(?P<id>\d+)`]);
URL_REGEXS.set('www.voot.com', [String.raw`(?x)(?:voot:|https?://(?:www\.)?voot\.com/?(?:movies?/[^/]+/|(?:shows|kids)/(?:[^/]+/){4}))(?P<id>\d{3,})`, String.raw`https?://(?:www\.)?voot\.com/shows/[^/]+/(?P<id>\d{3,})`]);
URL_REGEXS.set('www.theverge.com', [String.raw`https?://(?:www\.)?(?:(?:theverge|vox|sbnation|eater|polygon|curbed|racked|funnyordie)\.com|recode\.net)/(?:[^/]+/)*(?P<id>[^/?]+)`]);
URL_REGEXS.set('www.vox.com', [String.raw`https?://(?:www\.)?(?:(?:theverge|vox|sbnation|eater|polygon|curbed|racked|funnyordie)\.com|recode\.net)/(?:[^/]+/)*(?P<id>[^/?]+)`]);
URL_REGEXS.set('www.sbnation.com', [String.raw`https?://(?:www\.)?(?:(?:theverge|vox|sbnation|eater|polygon|curbed|racked|funnyordie)\.com|recode\.net)/(?:[^/]+/)*(?P<id>[^/?]+)`]);
URL_REGEXS.set('www.recode.net', [String.raw`https?://(?:www\.)?(?:(?:theverge|vox|sbnation|eater|polygon|curbed|racked|funnyordie)\.com|recode\.net)/(?:[^/]+/)*(?P<id>[^/?]+)`]);
URL_REGEXS.set('tegenlicht.vpro.nl', [String.raw`https?://(?:www\.)?(?:(?:tegenlicht\.)?vpro|2doc)\.nl/(?:[^/]+/)*(?P<id>[^/]+)\.html`]);
URL_REGEXS.set('www.vpro.nl', [String.raw`https?://(?:www\.)?(?:(?:tegenlicht\.)?vpro|2doc)\.nl/(?:[^/]+/)*(?P<id>[^/]+)\.html`]);
URL_REGEXS.set('www.2doc.nl', [String.raw`https?://(?:www\.)?(?:(?:tegenlicht\.)?vpro|2doc)\.nl/(?:[^/]+/)*(?P<id>[^/]+)\.html`]);
URL_REGEXS.set('v.qq.com', [String.raw`https?://v\.qq\.com/x/cover/(?P<id>\w+)\.html/?(?:[?#]|$)`, String.raw`https?://v\.qq\.com/x/(?:page|cover/(?P<series_id>\w+))/(?P<id>\w+)`]);
URL_REGEXS.set('www.vrak.tv', [String.raw`https?://(?:www\.)?vrak\.tv/videos\?.*?\btarget=(?P<id>[\d.]+)`]);
URL_REGEXS.set('www.vrt.be', [String.raw`https?://(?:www\.)?(?P<site>vrt\.be/vrtnws|sporza\.be)/[a-z]{2}/\d{4}/\d{2}/\d{2}/(?P<id>[^/?&#]+)`, String.raw`https?://(?:www\.)?vrt\.be/vrtnu/a-z/(?:[^/]+/){2}(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('sporza.be', [String.raw`https?://(?:www\.)?(?P<site>vrt\.be/vrtnws|sporza\.be)/[a-z]{2}/\d{4}/\d{2}/\d{2}/(?P<id>[^/?&#]+)`]);
URL_REGEXS.set('vrv.co', [String.raw`https?://(?:www\.)?vrv\.co/watch/(?P<id>[A-Z0-9]+)`, String.raw`https?://(?:www\.)?vrv\.co/series/(?P<id>[A-Z0-9]+)`]);
URL_REGEXS.set('vshare.io', [String.raw`https?://(?:www\.)?vshare\.io/[dv]/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('vtm.be', [String.raw`https?://(?:www\.)?vtm\.be/([^/?&#]+)~v(?P<id>[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})`]);
URL_REGEXS.set('vtxtv.ch', [String.raw`(?x)https?://(?:www\.)?vtxtv\.ch/(?:[^?#]+\?(?:[^#]+&)?program=(?P<vid2>\d+)|(?:program|watch)/[^/]+/(?P<vid1>\d+))`, String.raw`(?x)https?://(?:www\.)?vtxtv\.ch/(?:[^?#]+\?(?:[^#]+&)?channel=(?P<vid2>[^/?&#]+)|live/(?P<vid1>[^/?&#]+))`, String.raw`(?x)https?://(?:www\.)?vtxtv\.ch/(?:[^?#]+\?(?:[^#]+&)?recording=(?P<vid2>\d+)(?P<vid1>))`]);
URL_REGEXS.set('m.vuclip.com', [String.raw`https?://(?:m\.)?vuclip\.com/w\?.*?cid=(?P<id>[0-9]+)`]);
URL_REGEXS.set('vupload.com', [String.raw`https://vupload\.com/v/(?P<id>[a-z0-9]+)`]);
URL_REGEXS.set('www.vvvvid.it', [String.raw`https?://(?:www\.)?vvvvid\.it/(?:#!)?(?:show|anime|film|series)/(?P<show_id>\d+)/[^/]+/(?P<season_id>\d+)/(?P<id>[0-9]+)`, String.raw`(?P<base_url>https?://(?:www\.)?vvvvid\.it/(?:#!)?(?:show|anime|film|series)/(?P<id>\d+)(?:/(?P<show_title>[^/?&#]+))?)/?(?:[?#&]|$)`]);
URL_REGEXS.set('vybory.mos.ru', [String.raw`https?://vybory\.mos\.ru/(?:#precinct/|account/channels\?.*?\bstation_id=)(?P<id>\d+)`]);
URL_REGEXS.set('vzaar.com', [String.raw`https?://(?:(?:www|view)\.)?vzaar\.com/(?:videos/)?(?P<id>\d+)`]);
URL_REGEXS.set('view.vzaar.com', [String.raw`https?://(?:(?:www|view)\.)?vzaar\.com/(?:videos/)?(?P<id>\d+)`]);
URL_REGEXS.set('www.wakanim.tv', [String.raw`https://(?:www\.)?wakanim\.tv/[^/]+/v2/catalogue/episode/(?P<id>\d+)`]);
URL_REGEXS.set('vod.walla.co.il', [String.raw`https?://vod\.walla\.co\.il/[^/]+/(?P<id>\d+)/(?P<display_id>.+)`]);
URL_REGEXS.set('player.waly.tv', [String.raw`(?x)https?://(?:www\.)?player\.waly\.tv/(?:[^?#]+\?(?:[^#]+&)?program=(?P<vid2>\d+)|(?:program|watch)/[^/]+/(?P<vid1>\d+))`, String.raw`(?x)https?://(?:www\.)?player\.waly\.tv/(?:[^?#]+\?(?:[^#]+&)?channel=(?P<vid2>[^/?&#]+)|live/(?P<vid1>[^/?&#]+))`, String.raw`(?x)https?://(?:www\.)?player\.waly\.tv/(?:[^?#]+\?(?:[^#]+&)?recording=(?P<vid2>\d+)(?P<vid1>))`]);
URL_REGEXS.set('wasd.tv', [String.raw`https?://wasd\.tv/[^/#?]+/clips\?clip=(?P<id>\d+)$`, String.raw`https?://wasd\.tv/[^/#?]+(?:/videos)?\?record=(?P<id>\d+)$`, String.raw`https?://wasd\.tv/(?P<id>[^/#?]+)$`]);
URL_REGEXS.set('www.washingtonpost.com', [String.raw`(?:washingtonpost:|https?://(?:www\.)?washingtonpost\.com/(?:video|posttv)/(?:[^/]+/)*)(?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`, String.raw`https?://(?:www\.)?washingtonpost\.com/(?:[^/]+/)*(?P<id>[^/?#]+)`]);
URL_REGEXS.set('www.wat.tv', [String.raw`(?:wat:|https?://(?:www\.)?wat\.tv/video/.*-)(?P<id>[0-9a-z]+)`]);
URL_REGEXS.set('www.watchbox.de', [String.raw`https?://(?:www\.)?watchbox\.de/(?P<kind>serien|filme)/(?:[^/]+/)*[^/]+-(?P<id>\d+)`]);
URL_REGEXS.set('www.watchindianporn.net', [String.raw`https?://(?:www\.)?watchindianporn\.net/(?:[^/]+/)*video/(?P<display_id>[^/]+)-(?P<id>[a-zA-Z0-9]+)\.html`]);
URL_REGEXS.set('deviceids-medp.wdr.de', [String.raw`(?x)https?://(?:deviceids-medp\.wdr\.de/ondemand/\d+/|kinder\.wdr\.de/(?!mediathek/)[^#?]+-)(?P<id>\d+)\.(?:js|assetjsonp)`]);
URL_REGEXS.set('mobile-ondemand.wdr.de', [String.raw`(?x)https?://mobile-ondemand\.wdr\.de/.*?/fsk(?P<age_limit>[0-9]+)/[0-9]+/[0-9]+/(?P<id>[0-9]+)_(?P<title>[0-9]+)`]);
URL_REGEXS.set('www.wdrmaus.de', [String.raw`https?://(?:www\.)wdrmaus\.de/elefantenseite/#(?P<id>.+)`, String.raw`https?://(?:www\d?\.)?(?:(?:kinder\.)?wdr\d?|sportschau)\.de/(?:mediathek/)?(?:[^/]+/)*(?P<display_id>[^/]+)\.html|https?://(?:www\.)wdrmaus.de/(?:[^/]+/)*?(?P<maus_id>[^/?#.]+)(?:/?|/index\.php5|\.php5)$`]);
URL_REGEXS.set('www1.wdr.de', [String.raw`https?://(?:www\d?\.)?(?:(?:kinder\.)?wdr\d?|sportschau)\.de/(?:mediathek/)?(?:[^/]+/)*(?P<display_id>[^/]+)\.html|https?://(?:www\.)wdrmaus.de/(?:[^/]+/)*?(?P<maus_id>[^/?#.]+)(?:/?|/index\.php5|\.php5)$`]);
URL_REGEXS.set('www.sportschau.de', [String.raw`https?://(?:www\d?\.)?(?:(?:kinder\.)?wdr\d?|sportschau)\.de/(?:mediathek/)?(?:[^/]+/)*(?P<display_id>[^/]+)\.html|https?://(?:www\.)wdrmaus.de/(?:[^/]+/)*?(?P<maus_id>[^/?#.]+)(?:/?|/index\.php5|\.php5)$`]);
URL_REGEXS.set('kinder.wdr.de', [String.raw`https?://(?:www\d?\.)?(?:(?:kinder\.)?wdr\d?|sportschau)\.de/(?:mediathek/)?(?:[^/]+/)*(?P<display_id>[^/]+)\.html|https?://(?:www\.)wdrmaus.de/(?:[^/]+/)*?(?P<maus_id>[^/?#.]+)(?:/?|/index\.php5|\.php5)$`]);
URL_REGEXS.set('web.archive.org', [String.raw`(?x)(?:(?P<prefix>ytarchive:)|(?:https?://)?web\.archive\.org/(?:web/)?(?:(?P<date>[0-9]{14})?[0-9A-Za-z_*]*/)?(?:https?(?::|%3[Aa])//)?(?:(?:\w+\.)?youtube\.com(?::(?:80|443))?/watch(?:\.php)?(?:\?|%3[fF])(?:[^\#]+(?:&|%26))?v(?:=|%3[dD])|(?:wayback-fakeurl\.archive\.org/yt/)))(?P<id>[0-9A-Za-z_-]{11})(?(prefix)(?::(?P<date2>[0-9]{14}))?$|(?:%26|[#&]|$))`]);
URL_REGEXS.set('warszawa-plac-zamkowy.webcamera.pl', [String.raw`https?://(?P<id>[\w-]+)\.webcamera\.pl`]);
URL_REGEXS.set('gdansk-stare-miasto.webcamera.pl', [String.raw`https?://(?P<id>[\w-]+)\.webcamera\.pl`]);
URL_REGEXS.set('bl.webcaster.pro', [String.raw`https?://bl\.webcaster\.pro/(?:quote|media)/start/free_(?P<id>[^/]+)`, String.raw`https?://bl\.webcaster\.pro/feed/start/free_(?P<id>[^/]+)`]);
URL_REGEXS.set('www.webofstories.com', [String.raw`https?://(?:www\.)?webofstories\.com/play/(?:[^/]+/)?(?P<id>[0-9]+)`, String.raw`https?://(?:www\.)?webofstories\.com/playAll/(?P<id>[^/]+)`]);
URL_REGEXS.set('weibo.com', [String.raw`https?://(?:www\.)?weibo\.com/[0-9]+/(?P<id>[a-zA-Z0-9]+)`]);
URL_REGEXS.set('m.weibo.cn', [String.raw`https?://m\.weibo\.cn/status/(?P<id>[0-9]+)(\?.+)?`]);
URL_REGEXS.set('www.weiqitv.com', [String.raw`https?://(?:www\.)?weiqitv\.com/index/video_play\?videoId=(?P<id>[A-Za-z0-9]+)`]);
URL_REGEXS.set('wetv.vip', [String.raw`https?://(?:www\.)?wetv\.vip/(?:[^?#]+/)?play/(?P<series_id>\w+)(?:-[^?#]+)?/(?P<id>\w+)(?:-[^?#]+)?`, String.raw`https?://(?:www\.)?wetv\.vip/(?:[^?#]+/)?play/(?P<id>\w+)(?:-[^/?#]+)?/?(?:[?#]|$)`]);
URL_REGEXS.set('whowatch.tv', [String.raw`https?://whowatch\.tv/viewer/(?P<id>\d+)`]);
URL_REGEXS.set('commons.wikimedia.org', [String.raw`https?://commons\.wikimedia\.org/wiki/File:(?P<id>[^/#?]+)\.\w+`]);
URL_REGEXS.set('willow.tv', [String.raw`https?://(www\.)?willow\.tv/videos/(?P<id>[0-9a-z-_]+)`]);
URL_REGEXS.set('platform.wim.tv', [String.raw`(?x:https?://platform.wim.tv/(?:(?:embed/)?\?|\#/webtv/.+?/)(?P<type>vod|live|cast)[=/](?P<id>[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}).*?)`]);
URL_REGEXS.set('www.winsports.co', [String.raw`https?://www\.winsports\.co/videos/(?P<display_id>[\w-]+)-(?P<id>\d+)`]);
URL_REGEXS.set('fast.wistia.net', [String.raw`(?:wistia:|https?://(?:\w+\.)?wistia\.(?:net|com)/(?:embed/)?(?:iframe|medias)/)(?P<id>[a-z0-9]{10})`, String.raw`(?:wistiachannel:|https?://(?:\w+\.)?wistia\.(?:net|com)/(?:embed/)?channel/)(?P<id>[a-z0-9]{10})`, String.raw`https?://(?:\w+\.)?wistia\.(?:net|com)/(?:embed/)?playlists/(?P<id>[a-z0-9]{10})`]);
URL_REGEXS.set('fast.wistia.com', [String.raw`(?:wistia:|https?://(?:\w+\.)?wistia\.(?:net|com)/(?:embed/)?(?:iframe|medias)/)(?P<id>[a-z0-9]{10})`]);
URL_REGEXS.set('www.worldstarhiphop.com', [String.raw`https?://(?:www|m)\.worldstar(?:candy|hiphop)\.com/(?:videos|android)/video\.php\?.*?\bv=(?P<id>[^&]+)`]);
URL_REGEXS.set('m.worldstarhiphop.com', [String.raw`https?://(?:www|m)\.worldstar(?:candy|hiphop)\.com/(?:videos|android)/video\.php\?.*?\bv=(?P<id>[^&]+)`]);
URL_REGEXS.set('pilot.wp.pl', [String.raw`(?:https?://pilot\.wp\.pl/tv/?#|wppilot:)(?P<id>[a-z\d-]+)`, String.raw`(?:https?://pilot\.wp\.pl/(?:tv/?)?(?:\?[^#]*)?#?|wppilot:)$`]);
URL_REGEXS.set('video-api.wsj.com', [String.raw`(?x)(?:https?://video-api\.wsj\.com/api-video/player/iframe\.html\?.*?\bguid=|https?://(?:www\.)?(?:wsj|barrons)\.com/video/(?:[^/]+/)+|wsj:)(?P<id>[a-fA-F0-9-]{36})`]);
URL_REGEXS.set('www.wsj.com', [String.raw`(?x)(?:https?://video-api\.wsj\.com/api-video/player/iframe\.html\?.*?\bguid=|https?://(?:www\.)?(?:wsj|barrons)\.com/video/(?:[^/]+/)+|wsj:)(?P<id>[a-fA-F0-9-]{36})`, String.raw`(?i)https?://(?:www\.)?wsj\.com/articles/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.barrons.com', [String.raw`(?x)(?:https?://video-api\.wsj\.com/api-video/player/iframe\.html\?.*?\bguid=|https?://(?:www\.)?(?:wsj|barrons)\.com/video/(?:[^/]+/)+|wsj:)(?P<id>[a-fA-F0-9-]{36})`]);
URL_REGEXS.set('www.wwe.com', [String.raw`https?://(?:[^/]+\.)?wwe\.com/(?:[^/]+/)*videos/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('de.wwe.com', [String.raw`https?://(?:[^/]+\.)?wwe\.com/(?:[^/]+/)*videos/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('wyborcza.pl', [String.raw`(?:wyborcza:video:|https?://wyborcza\.pl/(?:api-)?video/)(?P<id>\d+)`, String.raw`(?x)https?://(?:www\.)?(?:wyborcza\.pl/podcast(?:/0,172673\.html)?|wysokieobcasy\.pl/wysokie-obcasy/0,176631\.html)(?:\?(?:[^&#]+?&)*podcast=(?P<id>\d+))?`]);
URL_REGEXS.set('www.wysokieobcasy.pl', [String.raw`(?x)https?://(?:www\.)?(?:wyborcza\.pl/podcast(?:/0,172673\.html)?|wysokieobcasy\.pl/wysokie-obcasy/0,176631\.html)(?:\?(?:[^&#]+?&)*podcast=(?P<id>\d+))?`]);
URL_REGEXS.set('xbef.com', [String.raw`https?://(?:www\.)?xbef\.com/video/(?P<id>[0-9]+)`]);
URL_REGEXS.set('xboxclips.com', [String.raw`https?://(?:www\.)?(?:xboxclips\.com|gameclips\.io)/(?:video\.php\?.*vid=|[^/]+/)(?P<id>[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12})`]);
URL_REGEXS.set('gameclips.io', [String.raw`https?://(?:www\.)?(?:xboxclips\.com|gameclips\.io)/(?:video\.php\?.*vid=|[^/]+/)(?P<id>[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12})`]);
URL_REGEXS.set('uqload.com', [String.raw`https?://(?:www\.)?(?P<host>aparat\.cam|clipwatching\.com|gounlimited\.to|govid\.me|holavid\.com|streamty\.com|thevideobee\.to|uqload\.com|vidbom\.com|vidlo\.us|vidlocker\.xyz|vidshare\.tv|vup\.to|wolfstream\.tv|xvideosharing\.com)/(?:embed-)?(?P<id>[0-9a-zA-Z]+)`]);
URL_REGEXS.set('xvideosharing.com', [String.raw`https?://(?:www\.)?(?P<host>aparat\.cam|clipwatching\.com|gounlimited\.to|govid\.me|holavid\.com|streamty\.com|thevideobee\.to|uqload\.com|vidbom\.com|vidlo\.us|vidlocker\.xyz|vidshare\.tv|vup\.to|wolfstream\.tv|xvideosharing\.com)/(?:embed-)?(?P<id>[0-9a-zA-Z]+)`]);
URL_REGEXS.set('aparat.cam', [String.raw`https?://(?:www\.)?(?P<host>aparat\.cam|clipwatching\.com|gounlimited\.to|govid\.me|holavid\.com|streamty\.com|thevideobee\.to|uqload\.com|vidbom\.com|vidlo\.us|vidlocker\.xyz|vidshare\.tv|vup\.to|wolfstream\.tv|xvideosharing\.com)/(?:embed-)?(?P<id>[0-9a-zA-Z]+)`]);
URL_REGEXS.set('wolfstream.tv', [String.raw`https?://(?:www\.)?(?P<host>aparat\.cam|clipwatching\.com|gounlimited\.to|govid\.me|holavid\.com|streamty\.com|thevideobee\.to|uqload\.com|vidbom\.com|vidlo\.us|vidlocker\.xyz|vidshare\.tv|vup\.to|wolfstream\.tv|xvideosharing\.com)/(?:embed-)?(?P<id>[0-9a-zA-Z]+)`]);
URL_REGEXS.set('xhamster.com', [String.raw`(?x)https?://(?:.+?\.)?(?:xhamster\.(?:com|one|desi)|xhms\.pro|xhamster\d+\.com|xhday\.com)/(?:movies/(?P<id>[\dA-Za-z]+)/(?P<display_id>[^/]*)\.html|videos/(?P<display_id_2>[^/]*)-(?P<id_2>[\dA-Za-z]+))`, String.raw`https?://(?:.+?\.)?(?:xhamster\.(?:com|one|desi)|xhms\.pro|xhamster\d+\.com|xhday\.com)/xembed\.php\?video=(?P<id>\d+)`, String.raw`https?://(?:.+?\.)?(?:xhamster\.(?:com|one|desi)|xhms\.pro|xhamster\d+\.com|xhday\.com)/users/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('m.xhamster.com', [String.raw`(?x)https?://(?:.+?\.)?(?:xhamster\.(?:com|one|desi)|xhms\.pro|xhamster\d+\.com|xhday\.com)/(?:movies/(?P<id>[\dA-Za-z]+)/(?P<display_id>[^/]*)\.html|videos/(?P<display_id_2>[^/]*)-(?P<id_2>[\dA-Za-z]+))`]);
URL_REGEXS.set('it.xhamster.com', [String.raw`(?x)https?://(?:.+?\.)?(?:xhamster\.(?:com|one|desi)|xhms\.pro|xhamster\d+\.com|xhday\.com)/(?:movies/(?P<id>[\dA-Za-z]+)/(?P<display_id>[^/]*)\.html|videos/(?P<display_id_2>[^/]*)-(?P<id_2>[\dA-Za-z]+))`]);
URL_REGEXS.set('pt.xhamster.com', [String.raw`(?x)https?://(?:.+?\.)?(?:xhamster\.(?:com|one|desi)|xhms\.pro|xhamster\d+\.com|xhday\.com)/(?:movies/(?P<id>[\dA-Za-z]+)/(?P<display_id>[^/]*)\.html|videos/(?P<display_id_2>[^/]*)-(?P<id_2>[\dA-Za-z]+))`]);
URL_REGEXS.set('xhamster.one', [String.raw`(?x)https?://(?:.+?\.)?(?:xhamster\.(?:com|one|desi)|xhms\.pro|xhamster\d+\.com|xhday\.com)/(?:movies/(?P<id>[\dA-Za-z]+)/(?P<display_id>[^/]*)\.html|videos/(?P<display_id_2>[^/]*)-(?P<id_2>[\dA-Za-z]+))`]);
URL_REGEXS.set('xhamster.desi', [String.raw`(?x)https?://(?:.+?\.)?(?:xhamster\.(?:com|one|desi)|xhms\.pro|xhamster\d+\.com|xhday\.com)/(?:movies/(?P<id>[\dA-Za-z]+)/(?P<display_id>[^/]*)\.html|videos/(?P<display_id_2>[^/]*)-(?P<id_2>[\dA-Za-z]+))`]);
URL_REGEXS.set('xhamster2.com', [String.raw`(?x)https?://(?:.+?\.)?(?:xhamster\.(?:com|one|desi)|xhms\.pro|xhamster\d+\.com|xhday\.com)/(?:movies/(?P<id>[\dA-Za-z]+)/(?P<display_id>[^/]*)\.html|videos/(?P<display_id_2>[^/]*)-(?P<id_2>[\dA-Za-z]+))`]);
URL_REGEXS.set('xhamster11.com', [String.raw`(?x)https?://(?:.+?\.)?(?:xhamster\.(?:com|one|desi)|xhms\.pro|xhamster\d+\.com|xhday\.com)/(?:movies/(?P<id>[\dA-Za-z]+)/(?P<display_id>[^/]*)\.html|videos/(?P<display_id_2>[^/]*)-(?P<id_2>[\dA-Za-z]+))`]);
URL_REGEXS.set('xhamster26.com', [String.raw`(?x)https?://(?:.+?\.)?(?:xhamster\.(?:com|one|desi)|xhms\.pro|xhamster\d+\.com|xhday\.com)/(?:movies/(?P<id>[\dA-Za-z]+)/(?P<display_id>[^/]*)\.html|videos/(?P<display_id_2>[^/]*)-(?P<id_2>[\dA-Za-z]+))`]);
URL_REGEXS.set('de.xhamster.com', [String.raw`(?x)https?://(?:.+?\.)?(?:xhamster\.(?:com|one|desi)|xhms\.pro|xhamster\d+\.com|xhday\.com)/(?:movies/(?P<id>[\dA-Za-z]+)/(?P<display_id>[^/]*)\.html|videos/(?P<display_id_2>[^/]*)-(?P<id_2>[\dA-Za-z]+))`]);
URL_REGEXS.set('xhday.com', [String.raw`(?x)https?://(?:.+?\.)?(?:xhamster\.(?:com|one|desi)|xhms\.pro|xhamster\d+\.com|xhday\.com)/(?:movies/(?P<id>[\dA-Za-z]+)/(?P<display_id>[^/]*)\.html|videos/(?P<display_id_2>[^/]*)-(?P<id_2>[\dA-Za-z]+))`, String.raw`https?://(?:.+?\.)?(?:xhamster\.(?:com|one|desi)|xhms\.pro|xhamster\d+\.com|xhday\.com)/users/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.ximalaya.com', [String.raw`https?://(?:www\.|m\.)?ximalaya\.com/(:?(?P<uid>\d+)/)?sound/(?P<id>[0-9]+)`, String.raw`https?://(?:www\.|m\.)?ximalaya\.com/\d+/album/(?P<id>[0-9]+)`]);
URL_REGEXS.set('m.ximalaya.com', [String.raw`https?://(?:www\.|m\.)?ximalaya\.com/(:?(?P<uid>\d+)/)?sound/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.xinpianchang.com', [String.raw`https?://www\.xinpianchang\.com/(?P<id>[^/]+?)(?:\D|$)`]);
URL_REGEXS.set('x-minus.org', [String.raw`https?://(?:www\.)?x-minus\.org/track/(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.xnxx.com', [String.raw`https?://(?:video|www)\.xnxx3?\.com/video-?(?P<id>[0-9a-z]+)/`]);
URL_REGEXS.set('video.xnxx.com', [String.raw`https?://(?:video|www)\.xnxx3?\.com/video-?(?P<id>[0-9a-z]+)/`]);
URL_REGEXS.set('www.xnxx3.com', [String.raw`https?://(?:video|www)\.xnxx3?\.com/video-?(?P<id>[0-9a-z]+)/`]);
URL_REGEXS.set('frontend.xstream.dk', [String.raw`(?x)(?:xstream:|https?://frontend\.xstream\.(?:dk|net)/)(?P<partner_id>[^/]+)(?::|/feed/video/\?.*?\bid=)(?P<id>\d+)`]);
URL_REGEXS.set('www.xtube.com', [String.raw`(?x)(?:xtube:|https?://(?:www\.)?xtube\.com/(?:watch\.php\?.*\bv=|video-watch/(?:embedded/)?(?P<display_id>[^/]+)-))(?P<id>[^/?&#]+)`, String.raw`https?://(?:www\.)?xtube\.com/profile/(?P<id>[^/]+-\d+)`]);
URL_REGEXS.set('vlog.xuite.net', [String.raw`https?://vlog\.xuite\.net/(?:play|embed)/(?P<id>(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)`]);
URL_REGEXS.set('www.xvideos.com', [String.raw`(?x)https?://(?:(?:[^/]+\.)?xvideos2?\.com/video|(?:www\.)?xvideos\.es/video|(?:www|flashservice)\.xvideos\.com/embedframe/|static-hw\.xvideos\.com/swf/xv-player\.swf\?.*?\bid_video=)(?P<id>[0-9]+)`]);
URL_REGEXS.set('flashservice.xvideos.com', [String.raw`(?x)https?://(?:(?:[^/]+\.)?xvideos2?\.com/video|(?:www\.)?xvideos\.es/video|(?:www|flashservice)\.xvideos\.com/embedframe/|static-hw\.xvideos\.com/swf/xv-player\.swf\?.*?\bid_video=)(?P<id>[0-9]+)`]);
URL_REGEXS.set('static-hw.xvideos.com', [String.raw`(?x)https?://(?:(?:[^/]+\.)?xvideos2?\.com/video|(?:www\.)?xvideos\.es/video|(?:www|flashservice)\.xvideos\.com/embedframe/|static-hw\.xvideos\.com/swf/xv-player\.swf\?.*?\bid_video=)(?P<id>[0-9]+)`]);
URL_REGEXS.set('xvideos.com', [String.raw`(?x)https?://(?:(?:[^/]+\.)?xvideos2?\.com/video|(?:www\.)?xvideos\.es/video|(?:www|flashservice)\.xvideos\.com/embedframe/|static-hw\.xvideos\.com/swf/xv-player\.swf\?.*?\bid_video=)(?P<id>[0-9]+)`]);
URL_REGEXS.set('xvideos.es', [String.raw`(?x)https?://(?:(?:[^/]+\.)?xvideos2?\.com/video|(?:www\.)?xvideos\.es/video|(?:www|flashservice)\.xvideos\.com/embedframe/|static-hw\.xvideos\.com/swf/xv-player\.swf\?.*?\bid_video=)(?P<id>[0-9]+)`]);
URL_REGEXS.set('www.xvideos.es', [String.raw`(?x)https?://(?:(?:[^/]+\.)?xvideos2?\.com/video|(?:www\.)?xvideos\.es/video|(?:www|flashservice)\.xvideos\.com/embedframe/|static-hw\.xvideos\.com/swf/xv-player\.swf\?.*?\bid_video=)(?P<id>[0-9]+)`]);
URL_REGEXS.set('fr.xvideos.com', [String.raw`(?x)https?://(?:(?:[^/]+\.)?xvideos2?\.com/video|(?:www\.)?xvideos\.es/video|(?:www|flashservice)\.xvideos\.com/embedframe/|static-hw\.xvideos\.com/swf/xv-player\.swf\?.*?\bid_video=)(?P<id>[0-9]+)`]);
URL_REGEXS.set('it.xvideos.com', [String.raw`(?x)https?://(?:(?:[^/]+\.)?xvideos2?\.com/video|(?:www\.)?xvideos\.es/video|(?:www|flashservice)\.xvideos\.com/embedframe/|static-hw\.xvideos\.com/swf/xv-player\.swf\?.*?\bid_video=)(?P<id>[0-9]+)`]);
URL_REGEXS.set('de.xvideos.com', [String.raw`(?x)https?://(?:(?:[^/]+\.)?xvideos2?\.com/video|(?:www\.)?xvideos\.es/video|(?:www|flashservice)\.xvideos\.com/embedframe/|static-hw\.xvideos\.com/swf/xv-player\.swf\?.*?\bid_video=)(?P<id>[0-9]+)`]);
URL_REGEXS.set('xxxymovies.com', [String.raw`https?://(?:www\.)?xxxymovies\.com/videos/(?P<id>\d+)/(?P<display_id>[^/]+)`]);
URL_REGEXS.set('screen.yahoo.com', [String.raw`(?P<url>https?://(?:(?P<country>[a-zA-Z]{2}(?:-[a-zA-Z]{2})?|malaysia)\.)?(?:[\da-zA-Z_-]+\.)?yahoo\.com/(?:[^/]+/)*(?P<id>[^?&#]*-[0-9]+(?:-[a-z]+)?)\.html)`]);
URL_REGEXS.set('uk.screen.yahoo.com', [String.raw`(?P<url>https?://(?:(?P<country>[a-zA-Z]{2}(?:-[a-zA-Z]{2})?|malaysia)\.)?(?:[\da-zA-Z_-]+\.)?yahoo\.com/(?:[^/]+/)*(?P<id>[^?&#]*-[0-9]+(?:-[a-z]+)?)\.html)`]);
URL_REGEXS.set('news.yahoo.com', [String.raw`(?P<url>https?://(?:(?P<country>[a-zA-Z]{2}(?:-[a-zA-Z]{2})?|malaysia)\.)?(?:[\da-zA-Z_-]+\.)?yahoo\.com/(?:[^/]+/)*(?P<id>[^?&#]*-[0-9]+(?:-[a-z]+)?)\.html)`]);
URL_REGEXS.set('www.yahoo.com', [String.raw`(?P<url>https?://(?:(?P<country>[a-zA-Z]{2}(?:-[a-zA-Z]{2})?|malaysia)\.)?(?:[\da-zA-Z_-]+\.)?yahoo\.com/(?:[^/]+/)*(?P<id>[^?&#]*-[0-9]+(?:-[a-z]+)?)\.html)`]);
URL_REGEXS.set('gma.yahoo.com', [String.raw`(?P<url>https?://(?:(?P<country>[a-zA-Z]{2}(?:-[a-zA-Z]{2})?|malaysia)\.)?(?:[\da-zA-Z_-]+\.)?yahoo\.com/(?:[^/]+/)*(?P<id>[^?&#]*-[0-9]+(?:-[a-z]+)?)\.html)`]);
URL_REGEXS.set('sports.yahoo.com', [String.raw`(?P<url>https?://(?:(?P<country>[a-zA-Z]{2}(?:-[a-zA-Z]{2})?|malaysia)\.)?(?:[\da-zA-Z_-]+\.)?yahoo\.com/(?:[^/]+/)*(?P<id>[^?&#]*-[0-9]+(?:-[a-z]+)?)\.html)`]);
URL_REGEXS.set('tw.news.yahoo.com', [String.raw`(?P<url>https?://(?:(?P<country>[a-zA-Z]{2}(?:-[a-zA-Z]{2})?|malaysia)\.)?(?:[\da-zA-Z_-]+\.)?yahoo\.com/(?:[^/]+/)*(?P<id>[^?&#]*-[0-9]+(?:-[a-z]+)?)\.html)`]);
URL_REGEXS.set('tw.video.yahoo.com', [String.raw`(?P<url>https?://(?:(?P<country>[a-zA-Z]{2}(?:-[a-zA-Z]{2})?|malaysia)\.)?(?:[\da-zA-Z_-]+\.)?yahoo\.com/(?:[^/]+/)*(?P<id>[^?&#]*-[0-9]+(?:-[a-z]+)?)\.html)`]);
URL_REGEXS.set('malaysia.news.yahoo.com', [String.raw`(?P<url>https?://(?:(?P<country>[a-zA-Z]{2}(?:-[a-zA-Z]{2})?|malaysia)\.)?(?:[\da-zA-Z_-]+\.)?yahoo\.com/(?:[^/]+/)*(?P<id>[^?&#]*-[0-9]+(?:-[a-z]+)?)\.html)`]);
URL_REGEXS.set('es-us.noticias.yahoo.com', [String.raw`(?P<url>https?://(?:(?P<country>[a-zA-Z]{2}(?:-[a-zA-Z]{2})?|malaysia)\.)?(?:[\da-zA-Z_-]+\.)?yahoo\.com/(?:[^/]+/)*(?P<id>[^?&#]*-[0-9]+(?:-[a-z]+)?)\.html)`]);
URL_REGEXS.set('gyao.yahoo.co.jp', [String.raw`https?://(?:gyao\.yahoo\.co\.jp/(?:p|title(?:/[^/]+)?)|streaming\.yahoo\.co\.jp/p/y)/(?P<id>\d+/v\d+|[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`, String.raw`https?://(?:gyao\.yahoo\.co\.jp/(?:player|episode(?:/[^/]+)?)|streaming\.yahoo\.co\.jp/c/y)/(?P<id>\d+/v\d+/v\d+|[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`]);
URL_REGEXS.set('streaming.yahoo.co.jp', [String.raw`https?://(?:gyao\.yahoo\.co\.jp/(?:p|title(?:/[^/]+)?)|streaming\.yahoo\.co\.jp/p/y)/(?P<id>\d+/v\d+|[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`, String.raw`https?://(?:gyao\.yahoo\.co\.jp/(?:player|episode(?:/[^/]+)?)|streaming\.yahoo\.co\.jp/c/y)/(?P<id>\d+/v\d+/v\d+|[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})`]);
URL_REGEXS.set('news.yahoo.co.jp', [String.raw`https?://news\.yahoo\.co\.jp/(?:articles|feature)/(?P<id>[a-zA-Z0-9]+)`]);
URL_REGEXS.set('yadi.sk', [String.raw`(?x)https?://(?P<domain>yadi\.sk|disk\.yandex\.(?:az|by|co(?:m(?:\.(?:am|ge|tr))?|\.il)|ee|fr|k[gz]|l[tv]|md|t[jm]|u[az]|ru))/(?:[di]/|public.*?\bhash=)(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('music.yandex.ru', [String.raw`https?://music\.yandex\.(?P<tld>ru|kz|ua|by|com)/album/(?P<id>\d+)`, String.raw`https?://music\.yandex\.(?P<tld>ru|kz|ua|by|com)/artist/(?P<id>\d+)/albums`, String.raw`https?://music\.yandex\.(?P<tld>ru|kz|ua|by|com)/artist/(?P<id>\d+)/tracks`, String.raw`https?://music\.yandex\.(?P<tld>ru|kz|ua|by|com)/users/(?P<user>[^/]+)/playlists/(?P<id>\d+)`, String.raw`https?://music\.yandex\.(?P<tld>ru|kz|ua|by|com)/album/(?P<album_id>\d+)/track/(?P<id>\d+)`]);
URL_REGEXS.set('music.yandex.com', [String.raw`https?://music\.yandex\.(?P<tld>ru|kz|ua|by|com)/album/(?P<album_id>\d+)/track/(?P<id>\d+)`]);
URL_REGEXS.set('yandex.ru', [String.raw`(?x)https?://(?:yandex\.ru(?:/(?:portal/(?:video|efir)|efir))?/?\?.*?stream_id=|frontend\.vh\.yandex\.ru/player/)(?P<id>(?:[\da-f]{32}|[\w-]{12}))`, String.raw`https?://(?:www\.)?yandex\.\w{2,3}(?:\.(?:am|ge|il|tr))?/video/preview(?:/?\?.*?filmId=|/)(?P<id>\d+)`]);
URL_REGEXS.set('frontend.vh.yandex.ru', [String.raw`(?x)https?://(?:yandex\.ru(?:/(?:portal/(?:video|efir)|efir))?/?\?.*?stream_id=|frontend\.vh\.yandex\.ru/player/)(?P<id>(?:[\da-f]{32}|[\w-]{12}))`]);
URL_REGEXS.set('yandex.com', [String.raw`https?://(?:www\.)?yandex\.\w{2,3}(?:\.(?:am|ge|il|tr))?/video/preview(?:/?\?.*?filmId=|/)(?P<id>\d+)`]);
URL_REGEXS.set('www.yapfiles.ru', [String.raw`https?://(?:(?:www|api)\.)?yapfiles\.ru/get_player/*\?.*?\bv=(?P<id>\w+)`, String.raw`.*`]);
URL_REGEXS.set('api.yapfiles.ru', [String.raw`https?://(?:(?:www|api)\.)?yapfiles\.ru/get_player/*\?.*?\bv=(?P<id>\w+)`]);
URL_REGEXS.set('www.yesjapan.com', [String.raw`https?://(?:www\.)?yesjapan\.com/video/(?P<slug>[A-Za-z0-9\-]*)_(?P<id>[A-Za-z0-9]+)\.html`]);
URL_REGEXS.set('v.yinyuetai.com', [String.raw`https?://v\.yinyuetai\.com/video(?:/h5)?/(?P<id>[0-9]+)`]);
URL_REGEXS.set('areena.yle.fi', [String.raw`https?://areena\.yle\.fi/(?P<id>[\d-]+)`]);
URL_REGEXS.set('hot.ynet.co.il', [String.raw`https?://(?:.+?\.)?ynet\.co\.il/(?:.+?/)?0,7340,(?P<id>L(?:-[0-9]+)+),00\.html`]);
URL_REGEXS.set('www.youjizz.com', [String.raw`https?://(?:\w+\.)?youjizz\.com/videos/(?:[^/#?]*-(?P<id>\d+)\.html|embed/(?P<embed_id>\d+))`]);
URL_REGEXS.set('v.youku.com', [String.raw`(?x)(?:https?://((?:v|player)\.youku\.com/(?:v_show/id_|player\.php/sid/)|video\.tudou\.com/v/)|youku:)(?P<id>[A-Za-z0-9]+)(?:\.html|/v\.swf|)`]);
URL_REGEXS.set('player.youku.com', [String.raw`(?x)(?:https?://((?:v|player)\.youku\.com/(?:v_show/id_|player\.php/sid/)|video\.tudou\.com/v/)|youku:)(?P<id>[A-Za-z0-9]+)(?:\.html|/v\.swf|)`]);
URL_REGEXS.set('list.youku.com', [String.raw`https?://list\.youku\.com/show/id_(?P<id>[0-9a-z]+)\.html`]);
URL_REGEXS.set('www.younow.com', [String.raw`https?://(?:www\.)?younow\.com/(?P<id>[^/]+)/channel`, String.raw`https?://(?:www\.)?younow\.com/(?P<id>[^/?#&]+)`, String.raw`https?://(?:www\.)?younow\.com/[^/]+/(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.youporn.com', [String.raw`https?://(?:www\.)?youporn\.com/(?:watch|embed)/(?P<id>\d+)(?:/(?P<display_id>[^/?#&]+))?`]);
URL_REGEXS.set('sxyprn.com', [String.raw`https?://(?:www\.)?sxyprn\.com/post/(?P<id>[^/?#&.]+)`]);
URL_REGEXS.set('yourupload.com', [String.raw`https?://(?:www\.)?(?:yourupload\.com/(?:watch|embed)|embed\.yourupload\.com)/(?P<id>[A-Za-z0-9]+)`]);
URL_REGEXS.set('www.yourupload.com', [String.raw`https?://(?:www\.)?(?:yourupload\.com/(?:watch|embed)|embed\.yourupload\.com)/(?P<id>[A-Za-z0-9]+)`]);
URL_REGEXS.set('embed.yourupload.com', [String.raw`https?://(?:www\.)?(?:yourupload\.com/(?:watch|embed)|embed\.yourupload\.com)/(?P<id>[A-Za-z0-9]+)`]);
URL_REGEXS.set('www.youtube.com', [String.raw`(?x)^((?:https?://|//)(?:(?:(?:(?:\w+\.)?[yY][oO][uU][tT][uU][bB][eE](?:-nocookie|kids)?\.com|(?:www\.)?deturl\.com/www\.youtube\.com|(?:www\.)?pwnyoutube\.com|(?:www\.)?hooktube\.com|(?:www\.)?yourepeat\.com|tube\.majestyc\.net|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one|youtube\.googleapis\.com)/(?:.*?\#/)?(?:(?:(?:v|embed|e|shorts)/(?!videoseries|live_stream))|(?:(?:(?:watch|movie)(?:_popup)?(?:\.php)?/?)?(?:\?|\#!?)(?:.*?[&;])??v=)))|(?:youtu\.be|vid\.plus|zwearz\.com/watch|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one)/|(?:www\.)?cleanvideosearch\.com/media/action/yt/watch\?videoId=))?(?P<id>[0-9A-Za-z_-]{11})(?(1).+)?(?:\#|$)`, String.raw`https?://(?:www\.)?youtube\.com/clip/(?P<id>[^/?#]+)`, String.raw`(?x)(?:(?:https?://)?(?:\w+\.)?(?:(?:youtube(?:kids)?\.com|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one)/.*?\?.*?\blist=)?(?P<id>(?:(?:PL|LL|EC|UU|FL|RD|UL|TL|PU|OLAK5uy_)[0-9A-Za-z-_]{10,}|RDMM|WL|LL|LM)))`, String.raw`https?://(?:www\.)?youtube\.com/(?:results|search)\?([^#]+&)?(?:search_query|q)=(?:[^&]+)(?:[&#]|$)`, String.raw`https?://(?:www\.)?youtube\.com/source/(?P<id>[\w-]{11})/shorts`, String.raw`(?x:https?://(?:\w+\.)?(?:youtube(?:kids)?\.com|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one)/(?:(?P<channel_type>channel|c|user|browse)/|(?P<not_channel>feed/|hashtag/|(?:playlist|watch)\?.*?\blist=)|(?!(?:channel|c|user|playlist|watch|w|v|embed|e|live|watch_popup|clip|shorts|movies|results|search|shared|hashtag|trending|explore|feed|feeds|browse|oembed|get_video_info|iframe_api|s/player|source|storefront|oops|index|account|t/terms|about|upload|signin|logout)\b))(?P<id>[^/?\#&]+))`, String.raw`https?://(?:www\.)?youtube\.com/watch\?v=(?P<id>[0-9A-Za-z_-]{1,10})$`, String.raw`(?x)(?:https?://)?(?:\w+\.)?[yY][oO][uU][tT][uU][bB][eE](?:-nocookie)?\.com/(?:watch\?(?:feature=[a-z_]+|annotation_id=annotation_[^&]+|x-yt-cl=[0-9]+|hl=[^&]*|t=[0-9]+)?|attribution_link\?a=[^&]+)$`, String.raw`https?://(?:\w+\.)?youtube\.com/embed/live_stream/?\?(?:[^#]+&)?channel=(?P<id>[^&#]+)`]);
URL_REGEXS.set('youtube.com', [String.raw`(?x)^((?:https?://|//)(?:(?:(?:(?:\w+\.)?[yY][oO][uU][tT][uU][bB][eE](?:-nocookie|kids)?\.com|(?:www\.)?deturl\.com/www\.youtube\.com|(?:www\.)?pwnyoutube\.com|(?:www\.)?hooktube\.com|(?:www\.)?yourepeat\.com|tube\.majestyc\.net|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one|youtube\.googleapis\.com)/(?:.*?\#/)?(?:(?:(?:v|embed|e|shorts)/(?!videoseries|live_stream))|(?:(?:(?:watch|movie)(?:_popup)?(?:\.php)?/?)?(?:\?|\#!?)(?:.*?[&;])??v=)))|(?:youtu\.be|vid\.plus|zwearz\.com/watch|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one)/|(?:www\.)?cleanvideosearch\.com/media/action/yt/watch\?videoId=))?(?P<id>[0-9A-Za-z_-]{11})(?(1).+)?(?:\#|$)`, String.raw`https?://(?:www\.)?youtube\.com/?(?:[?#]|$)|:ytrec(?:ommended)?`]);
URL_REGEXS.set('vid.plus', [String.raw`(?x)^((?:https?://|//)(?:(?:(?:(?:\w+\.)?[yY][oO][uU][tT][uU][bB][eE](?:-nocookie|kids)?\.com|(?:www\.)?deturl\.com/www\.youtube\.com|(?:www\.)?pwnyoutube\.com|(?:www\.)?hooktube\.com|(?:www\.)?yourepeat\.com|tube\.majestyc\.net|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one|youtube\.googleapis\.com)/(?:.*?\#/)?(?:(?:(?:v|embed|e|shorts)/(?!videoseries|live_stream))|(?:(?:(?:watch|movie)(?:_popup)?(?:\.php)?/?)?(?:\?|\#!?)(?:.*?[&;])??v=)))|(?:youtu\.be|vid\.plus|zwearz\.com/watch|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one)/|(?:www\.)?cleanvideosearch\.com/media/action/yt/watch\?videoId=))?(?P<id>[0-9A-Za-z_-]{11})(?(1).+)?(?:\#|$)`]);
URL_REGEXS.set('zwearz.com', [String.raw`(?x)^((?:https?://|//)(?:(?:(?:(?:\w+\.)?[yY][oO][uU][tT][uU][bB][eE](?:-nocookie|kids)?\.com|(?:www\.)?deturl\.com/www\.youtube\.com|(?:www\.)?pwnyoutube\.com|(?:www\.)?hooktube\.com|(?:www\.)?yourepeat\.com|tube\.majestyc\.net|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one|youtube\.googleapis\.com)/(?:.*?\#/)?(?:(?:(?:v|embed|e|shorts)/(?!videoseries|live_stream))|(?:(?:(?:watch|movie)(?:_popup)?(?:\.php)?/?)?(?:\?|\#!?)(?:.*?[&;])??v=)))|(?:youtu\.be|vid\.plus|zwearz\.com/watch|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one)/|(?:www\.)?cleanvideosearch\.com/media/action/yt/watch\?videoId=))?(?P<id>[0-9A-Za-z_-]{11})(?(1).+)?(?:\#|$)`]);
URL_REGEXS.set('invidio.us', [String.raw`(?x)^((?:https?://|//)(?:(?:(?:(?:\w+\.)?[yY][oO][uU][tT][uU][bB][eE](?:-nocookie|kids)?\.com|(?:www\.)?deturl\.com/www\.youtube\.com|(?:www\.)?pwnyoutube\.com|(?:www\.)?hooktube\.com|(?:www\.)?yourepeat\.com|tube\.majestyc\.net|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one|youtube\.googleapis\.com)/(?:.*?\#/)?(?:(?:(?:v|embed|e|shorts)/(?!videoseries|live_stream))|(?:(?:(?:watch|movie)(?:_popup)?(?:\.php)?/?)?(?:\?|\#!?)(?:.*?[&;])??v=)))|(?:youtu\.be|vid\.plus|zwearz\.com/watch|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one)/|(?:www\.)?cleanvideosearch\.com/media/action/yt/watch\?videoId=))?(?P<id>[0-9A-Za-z_-]{11})(?(1).+)?(?:\#|$)`, String.raw`(?x:https?://(?:\w+\.)?(?:youtube(?:kids)?\.com|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one)/(?:(?P<channel_type>channel|c|user|browse)/|(?P<not_channel>feed/|hashtag/|(?:playlist|watch)\?.*?\blist=)|(?!(?:channel|c|user|playlist|watch|w|v|embed|e|live|watch_popup|clip|shorts|movies|results|search|shared|hashtag|trending|explore|feed|feeds|browse|oembed|get_video_info|iframe_api|s/player|source|storefront|oops|index|account|t/terms|about|upload|signin|logout)\b))(?P<id>[^/?\#&]+))`]);
URL_REGEXS.set('redirect.invidious.io', [String.raw`(?x)^((?:https?://|//)(?:(?:(?:(?:\w+\.)?[yY][oO][uU][tT][uU][bB][eE](?:-nocookie|kids)?\.com|(?:www\.)?deturl\.com/www\.youtube\.com|(?:www\.)?pwnyoutube\.com|(?:www\.)?hooktube\.com|(?:www\.)?yourepeat\.com|tube\.majestyc\.net|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one|youtube\.googleapis\.com)/(?:.*?\#/)?(?:(?:(?:v|embed|e|shorts)/(?!videoseries|live_stream))|(?:(?:(?:watch|movie)(?:_popup)?(?:\.php)?/?)?(?:\?|\#!?)(?:.*?[&;])??v=)))|(?:youtu\.be|vid\.plus|zwearz\.com/watch|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one)/|(?:www\.)?cleanvideosearch\.com/media/action/yt/watch\?videoId=))?(?P<id>[0-9A-Za-z_-]{11})(?(1).+)?(?:\#|$)`]);
URL_REGEXS.set('music.youtube.com', [String.raw`(?x)^((?:https?://|//)(?:(?:(?:(?:\w+\.)?[yY][oO][uU][tT][uU][bB][eE](?:-nocookie|kids)?\.com|(?:www\.)?deturl\.com/www\.youtube\.com|(?:www\.)?pwnyoutube\.com|(?:www\.)?hooktube\.com|(?:www\.)?yourepeat\.com|tube\.majestyc\.net|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one|youtube\.googleapis\.com)/(?:.*?\#/)?(?:(?:(?:v|embed|e|shorts)/(?!videoseries|live_stream))|(?:(?:(?:watch|movie)(?:_popup)?(?:\.php)?/?)?(?:\?|\#!?)(?:.*?[&;])??v=)))|(?:youtu\.be|vid\.plus|zwearz\.com/watch|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one)/|(?:www\.)?cleanvideosearch\.com/media/action/yt/watch\?videoId=))?(?P<id>[0-9A-Za-z_-]{11})(?(1).+)?(?:\#|$)`, String.raw`https?://music\.youtube\.com/search\?([^#]+&)?(?:search_query|q)=(?:[^&]+)(?:[&#]|$)`, String.raw`(?x:https?://(?:\w+\.)?(?:youtube(?:kids)?\.com|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one)/(?:(?P<channel_type>channel|c|user|browse)/|(?P<not_channel>feed/|hashtag/|(?:playlist|watch)\?.*?\blist=)|(?!(?:channel|c|user|playlist|watch|w|v|embed|e|live|watch_popup|clip|shorts|movies|results|search|shared|hashtag|trending|explore|feed|feeds|browse|oembed|get_video_info|iframe_api|s/player|source|storefront|oops|index|account|t/terms|about|upload|signin|logout)\b))(?P<id>[^/?\#&]+))`]);
URL_REGEXS.set('www.youtubekids.com', [String.raw`(?x)^((?:https?://|//)(?:(?:(?:(?:\w+\.)?[yY][oO][uU][tT][uU][bB][eE](?:-nocookie|kids)?\.com|(?:www\.)?deturl\.com/www\.youtube\.com|(?:www\.)?pwnyoutube\.com|(?:www\.)?hooktube\.com|(?:www\.)?yourepeat\.com|tube\.majestyc\.net|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one|youtube\.googleapis\.com)/(?:.*?\#/)?(?:(?:(?:v|embed|e|shorts)/(?!videoseries|live_stream))|(?:(?:(?:watch|movie)(?:_popup)?(?:\.php)?/?)?(?:\?|\#!?)(?:.*?[&;])??v=)))|(?:youtu\.be|vid\.plus|zwearz\.com/watch|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one)/|(?:www\.)?cleanvideosearch\.com/media/action/yt/watch\?videoId=))?(?P<id>[0-9A-Za-z_-]{11})(?(1).+)?(?:\#|$)`, String.raw`(?x:https?://(?:\w+\.)?(?:youtube(?:kids)?\.com|(?:www\.)?redirect\.invidious\.io|(?:(?:www|dev)\.)?invidio\.us|(?:www\.)?invidious\.pussthecat\.org|(?:www\.)?invidious\.zee\.li|(?:www\.)?invidious\.ethibox\.fr|(?:www\.)?invidious\.3o7z6yfxhbw7n3za4rss6l434kmv55cgw2vuziwuigpwegswvwzqipyd\.onion|(?:www\.)?osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd\.onion|(?:www\.)?u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad\.onion|(?:(?:www|no)\.)?invidiou\.sh|(?:(?:www|fi)\.)?invidious\.snopyta\.org|(?:www\.)?invidious\.kabi\.tk|(?:www\.)?invidious\.mastodon\.host|(?:www\.)?invidious\.zapashcanon\.fr|(?:www\.)?(?:invidious(?:-us)?|piped)\.kavin\.rocks|(?:www\.)?invidious\.tinfoil-hat\.net|(?:www\.)?invidious\.himiko\.cloud|(?:www\.)?invidious\.reallyancient\.tech|(?:www\.)?invidious\.tube|(?:www\.)?invidiou\.site|(?:www\.)?invidious\.site|(?:www\.)?invidious\.xyz|(?:www\.)?invidious\.nixnet\.xyz|(?:www\.)?invidious\.048596\.xyz|(?:www\.)?invidious\.drycat\.fr|(?:www\.)?inv\.skyn3t\.in|(?:www\.)?tube\.poal\.co|(?:www\.)?tube\.connect\.cafe|(?:www\.)?vid\.wxzm\.sx|(?:www\.)?vid\.mint\.lgbt|(?:www\.)?vid\.puffyan\.us|(?:www\.)?yewtu\.be|(?:www\.)?yt\.elukerio\.org|(?:www\.)?yt\.lelux\.fi|(?:www\.)?invidious\.ggc-project\.de|(?:www\.)?yt\.maisputain\.ovh|(?:www\.)?ytprivate\.com|(?:www\.)?invidious\.13ad\.de|(?:www\.)?invidious\.toot\.koeln|(?:www\.)?invidious\.fdn\.fr|(?:www\.)?watch\.nettohikari\.com|(?:www\.)?invidious\.namazso\.eu|(?:www\.)?invidious\.silkky\.cloud|(?:www\.)?invidious\.exonip\.de|(?:www\.)?invidious\.riverside\.rocks|(?:www\.)?invidious\.blamefran\.net|(?:www\.)?invidious\.moomoo\.de|(?:www\.)?ytb\.trom\.tf|(?:www\.)?yt\.cyberhost\.uk|(?:www\.)?kgg2m7yk5aybusll\.onion|(?:www\.)?qklhadlycap4cnod\.onion|(?:www\.)?axqzx4s6s54s32yentfqojs3x5i7faxza6xo3ehd4bzzsg2ii4fv2iid\.onion|(?:www\.)?c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid\.onion|(?:www\.)?fz253lmuao3strwbfbmx46yu7acac2jz27iwtorgmbqlkurlclmancad\.onion|(?:www\.)?invidious\.l4qlywnpwqsluw65ts7md3khrivpirse744un3x7mlskqauz5pyuzgqd\.onion|(?:www\.)?owxfohz4kjyv25fvlqilyxast7inivgiktls3th44jhk3ej3i7ya\.b32\.i2p|(?:www\.)?4l2dgddgsrkf2ous66i6seeyi6etzfgrue332grh2n7madpwopotugyd\.onion|(?:www\.)?w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd\.onion|(?:www\.)?kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad\.onion|(?:www\.)?grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad\.onion|(?:www\.)?hpniueoejy4opn7bc4ftgazyqjoeqwlvh2uiku2xqku6zpoa4bf5ruid\.onion|(?:www\.)?piped\.kavin\.rocks|(?:www\.)?piped\.tokhmi\.xyz|(?:www\.)?piped\.syncpundit\.io|(?:www\.)?piped\.mha\.fi|(?:www\.)?watch\.whatever\.social|(?:www\.)?piped\.garudalinux\.org|(?:www\.)?piped\.rivo\.lol|(?:www\.)?piped-libre\.kavin\.rocks|(?:www\.)?yt\.jae\.fi|(?:www\.)?piped\.mint\.lgbt|(?:www\.)?il\.ax|(?:www\.)?piped\.esmailelbob\.xyz|(?:www\.)?piped\.projectsegfau\.lt|(?:www\.)?piped\.privacydev\.net|(?:www\.)?piped\.palveluntarjoaja\.eu|(?:www\.)?piped\.smnz\.de|(?:www\.)?piped\.adminforge\.de|(?:www\.)?watch\.whatevertinfoil\.de|(?:www\.)?piped\.qdi\.fi|(?:www\.)?piped\.video|(?:www\.)?piped\.aeong\.one)/(?:(?P<channel_type>channel|c|user|browse)/|(?P<not_channel>feed/|hashtag/|(?:playlist|watch)\?.*?\blist=)|(?!(?:channel|c|user|playlist|watch|w|v|embed|e|live|watch_popup|clip|shorts|movies|results|search|shared|hashtag|trending|explore|feed|feeds|browse|oembed|get_video_info|iframe_api|s/player|source|storefront|oops|index|account|t/terms|about|upload|signin|logout)\b))(?P<id>[^/?\#&]+))`]);
URL_REGEXS.set('youtu.be', [String.raw`https?://youtu\.be/(?P<id>[0-9A-Za-z_-]{11})/*?.*?\blist=(?P<playlist_id>(?:(?:PL|LL|EC|UU|FL|RD|UL|TL|PU|OLAK5uy_)[0-9A-Za-z-_]{10,}|RDMM|WL|LL|LM))`]);
URL_REGEXS.set('www.zapiks.fr', [String.raw`https?://(?:www\.)?zapiks\.(?:fr|com)/(?:(?:[a-z]{2}/)?(?P<display_id>.+?)\.html|index\.php\?.*\bmedia_id=(?P<id>\d+))`]);
URL_REGEXS.set('www.zapiks.com', [String.raw`https?://(?:www\.)?zapiks\.(?:fr|com)/(?:(?:[a-z]{2}/)?(?P<display_id>.+?)\.html|index\.php\?.*\bmedia_id=(?P<id>\d+))`]);
URL_REGEXS.set('zattoo.com', [String.raw`(?x)https?://(?:www\.)?zattoo\.com/(?:[^?#]+\?(?:[^#]+&)?program=(?P<vid2>\d+)|(?:program|watch)/[^/]+/(?P<vid1>\d+))`, String.raw`(?x)https?://(?:www\.)?zattoo\.com/(?:[^?#]+\?(?:[^#]+&)?channel=(?P<vid2>[^/?&#]+)|live/(?P<vid1>[^/?&#]+))`, String.raw`(?x)https?://(?:www\.)?zattoo\.com/(?:[^?#]+\?(?:[^#]+&)?movie_id=(?P<vid2>\w+)|vod/movies/(?P<vid1>\w+))`, String.raw`(?x)https?://(?:www\.)?zattoo\.com/(?:[^?#]+\?(?:[^#]+&)?recording=(?P<vid2>\d+)(?P<vid1>))`]);
URL_REGEXS.set('www.zdf.de', [String.raw`https?://www\.zdf\.de/(?:[^/]+/)*(?P<id>[^/?#&]+)\.html`, String.raw`https?://www\.zdf\.de/(?:[^/]+/)*(?P<id>[^/?#&]+)`]);
URL_REGEXS.set('www.zee5.com', [String.raw`(?x)(?:zee5:|https?://(?:www\.)?zee5\.com/(?:[^#?]+/)?(?:(?:tv-shows|kids|web-series|zee5originals)(?:/[^#/?]+){3}|(?:movies|kids|videos|news|music-videos)/(?!kids-shows)[^#/?]+)/(?P<display_id>[^#/?]+)/)(?P<id>[^#/?]+)/?(?:$|[?#])`, String.raw`(?x)(?:zee5:series:|https?://(?:www\.)?zee5\.com/(?:[^#?]+/)?(?:tv-shows|web-series|kids|zee5originals)/(?!kids-movies)(?:[^#/?]+/){2})(?P<id>[^#/?]+)(?:/episodes)?/?(?:$|[?#])`]);
URL_REGEXS.set('zeenews.india.com', [String.raw`https?://zeenews\.india\.com/[^#?]+/video/(?P<display_id>[^#/?]+)/(?P<id>\d+)`]);
URL_REGEXS.set('zen.yandex.ru', [String.raw`https?://(zen\.yandex|dzen)\.ru(?:/video)?/(media|watch)/(?:(?:id/[^/]+/|[^/]+/)(?:[a-z0-9-]+)-)?(?P<id>[a-z0-9-]+)`, String.raw`https?://(zen\.yandex|dzen)\.ru/(?!media|video)(?:id/)?(?P<id>[a-z0-9-_]+)`]);
URL_REGEXS.set('dzen.ru', [String.raw`https?://(zen\.yandex|dzen)\.ru(?:/video)?/(media|watch)/(?:(?:id/[^/]+/|[^/]+/)(?:[a-z0-9-]+)-)?(?P<id>[a-z0-9-]+)`, String.raw`https?://(zen\.yandex|dzen)\.ru/(?!media|video)(?:id/)?(?P<id>[a-z0-9-_]+)`]);
URL_REGEXS.set('www.zhihu.com', [String.raw`https?://(?:www\.)?zhihu\.com/zvideo/(?P<id>[0-9]+)`]);
URL_REGEXS.set('mp3.zing.vn', [String.raw`https?://(?:mp3\.zing|zingmp3)\.vn/(?P<type>(?:bai-hat|video-clip|embed))/[^/?#]+/(?P<id>\w+)(?:\.html|\?)`, String.raw`https?://(?:mp3\.zing|zingmp3)\.vn/(?P<type>(?:album|playlist))/[^/?#]+/(?P<id>\w+)(?:\.html|\?)`]);
URL_REGEXS.set('zingmp3.vn', [String.raw`https?://(?:mp3\.zing|zingmp3)\.vn/(?P<type>(?:bai-hat|video-clip|embed))/[^/?#]+/(?P<id>\w+)(?:\.html|\?)`, String.raw`https?://(?:mp3\.zing|zingmp3)\.vn/(?P<type>(?:album|playlist))/[^/?#]+/(?P<id>\w+)(?:\.html|\?)`, String.raw`https?://(?:mp3\.zing|zingmp3)\.vn/(?P<id>(?:zing-chart|moi-phat-hanh))/?(?:[#?]|$)`, String.raw`https?://(?:mp3\.zing|zingmp3)\.vn/(?P<type>the-loai-video)/(?P<regions>[^/]+)/(?P<id>[^\.]+)`, String.raw`https?://(?:mp3\.zing|zingmp3)\.vn/(?P<user>[^/]+)/(?P<type>bai-hat|single|album|video)/?(?:[?#]|$)`, String.raw`https?://(?:mp3\.zing|zingmp3)\.vn/(?P<type>(?:zing-chart-tuan))/[^/?#]+/(?P<id>\w+)(?:\.html|\?)`]);
URL_REGEXS.set('economist.zoom.us', [String.raw`(?P<base_url>https?://(?:[^.]+\.)?zoom.us/)rec(?:ording)?/(?:play|share)/(?P<id>[A-Za-z0-9_.-]+)`]);
URL_REGEXS.set('player.zype.com', [String.raw`https?://player\.zype\.com/embed/(?P<id>[\da-fA-F]+)\.(?:js|json|html)\?.*?(?:access_token|(?:ap[ip]|player)_key)=[^&]+`]);
URL_REGEXS.set('media.w3.org', [String.raw`.*`]);
URL_REGEXS.set('calimero.tk', [String.raw`.*`]);
URL_REGEXS.set('ai-radio.org:8000', [String.raw`.*`]);
URL_REGEXS.set('ftp.nluug.nl', [String.raw`.*`]);
URL_REGEXS.set('phihag.de', [String.raw`.*`]);
URL_REGEXS.set('podcastfeeds.nbcnews.com', [String.raw`.*`]);
URL_REGEXS.set('anchor.fm', [String.raw`.*`]);
URL_REGEXS.set('www.hellointernet.fm', [String.raw`.*`]);
URL_REGEXS.set('www.omnycontent.com', [String.raw`.*`]);
URL_REGEXS.set('metafilegenerator.de', [String.raw`.*`]);
URL_REGEXS.set('services.media.howstuffworks.com', [String.raw`.*`]);
URL_REGEXS.set('api.new.livestream.com', [String.raw`.*`]);
URL_REGEXS.set('yt-dash-mse-test.commondatastorage.googleapis.com', [String.raw`.*`]);
URL_REGEXS.set('once.unicornmedia.com', [String.raw`.*`]);
URL_REGEXS.set('www.nacentapps.com', [String.raw`.*`]);
URL_REGEXS.set('www.google.com', [String.raw`.*`]);
URL_REGEXS.set('www.hodiho.fr', [String.raw`.*`]);
URL_REGEXS.set('bronyrock.com', [String.raw`.*`]);
URL_REGEXS.set('www.rollingstone.com', [String.raw`.*`]);
URL_REGEXS.set('www.macrumors.com', [String.raw`.*`]);
URL_REGEXS.set('wnep.com', [String.raw`.*`]);
URL_REGEXS.set('www.tested.com', [String.raw`.*`]);
URL_REGEXS.set('www.theguardian.com', [String.raw`.*`]);
URL_REGEXS.set('www.rg.ru', [String.raw`.*`]);
URL_REGEXS.set('sch1298sz.mskobr.ru', [String.raw`.*`]);
URL_REGEXS.set('www.vestifinance.ru', [String.raw`.*`]);
URL_REGEXS.set('www.kinomyvi.tv', [String.raw`.*`]);
URL_REGEXS.set('www.numisc.com', [String.raw`.*`]);
URL_REGEXS.set('en.support.wordpress.com', [String.raw`.*`]);
URL_REGEXS.set('www.waoanime.tv', [String.raw`.*`]);
URL_REGEXS.set('www.tv-replay.fr', [String.raw`.*`]);
URL_REGEXS.set('www.tsprod.com', [String.raw`.*`]);
URL_REGEXS.set('www.wired.com', [String.raw`.*`]);
URL_REGEXS.set('www.spi0n.com', [String.raw`.*`]);
URL_REGEXS.set('www.bumm.sk', [String.raw`.*`]);
URL_REGEXS.set('www.badzine.de', [String.raw`.*`]);
URL_REGEXS.set('www.vulture.com', [String.raw`.*`]);
URL_REGEXS.set('play.google.com', [String.raw`.*`]);
URL_REGEXS.set('www.handjobhub.com', [String.raw`.*`]);
URL_REGEXS.set('umpire-empire.com', [String.raw`.*`]);
URL_REGEXS.set('www.getdrip.com', [String.raw`.*`]);
URL_REGEXS.set('nakedsecurity.sophos.com', [String.raw`.*`]);
URL_REGEXS.set('www.guitarplayer.com', [String.raw`.*`]);
URL_REGEXS.set('radiocnrv.com', [String.raw`.*`]);
URL_REGEXS.set('www.esa.int', [String.raw`.*`]);
URL_REGEXS.set('skiplagged.com', [String.raw`.*`]);
URL_REGEXS.set('undergroundwellness.com', [String.raw`.*`]);
URL_REGEXS.set('deadspin.com', [String.raw`.*`]);
URL_REGEXS.set('thedailyshow.cc.com', [String.raw`.*`]);
URL_REGEXS.set('media.nationalarchives.gov.uk', [String.raw`.*`]);
URL_REGEXS.set('www.suffolk.edu', [String.raw`.*`]);
URL_REGEXS.set('www.hollywoodreporter.com', [String.raw`.*`]);
URL_REGEXS.set('www.indiedb.com', [String.raw`.*`]);
URL_REGEXS.set('www.txxx.com', [String.raw`.*`]);
URL_REGEXS.set('ortcam.com', [String.raw`.*`]);
URL_REGEXS.set('www.vooplayer.com', [String.raw`.*`]);
URL_REGEXS.set('www.rtlnieuws.nl', [String.raw`.*`]);
URL_REGEXS.set('www.skipass.com', [String.raw`.*`]);
URL_REGEXS.set('www.premierchristianradio.com', [String.raw`.*`]);
URL_REGEXS.set('fod.infobase.com', [String.raw`.*`]);
URL_REGEXS.set('www.cornell.edu', [String.raw`.*`]);
URL_REGEXS.set('www.gsd.harvard.edu', [String.raw`.*`]);
URL_REGEXS.set('www.cns.nyu.edu', [String.raw`.*`]);
URL_REGEXS.set('thechive.com', [String.raw`.*`]);
URL_REGEXS.set('tvrain.ru', [String.raw`.*`]);
URL_REGEXS.set('muz-tv.ru', [String.raw`.*`]);
URL_REGEXS.set('www.cinemablend.com', [String.raw`.*`]);
URL_REGEXS.set('crooksandliars.com', [String.raw`.*`]);
URL_REGEXS.set('theothermccain.com', [String.raw`.*`]);
URL_REGEXS.set('www.riderfans.com', [String.raw`.*`]);
URL_REGEXS.set('www.clickhole.com', [String.raw`.*`]);
URL_REGEXS.set('whilewewatch.blogspot.ru', [String.raw`.*`]);
URL_REGEXS.set('helpx.adobe.com', [String.raw`.*`]);
URL_REGEXS.set('www.hudl.com', [String.raw`.*`]);
URL_REGEXS.set('www.rtl.be', [String.raw`.*`]);
URL_REGEXS.set('www.theatlantic.com', [String.raw`.*`]);
URL_REGEXS.set('www.hostblogger.de', [String.raw`.*`]);
URL_REGEXS.set('5pillarsuk.com', [String.raw`.*`]);
URL_REGEXS.set('www.lothype.com', [String.raw`.*`]);
URL_REGEXS.set('www.expansion.com', [String.raw`.*`]);
URL_REGEXS.set('www.quartier-rouge.be', [String.raw`.*`]);
URL_REGEXS.set('openclassrooms.com', [String.raw`.*`]);
URL_REGEXS.set('racing4everyone.eu', [String.raw`.*`]);
URL_REGEXS.set('support.arkena.com', [String.raw`.*`]);
URL_REGEXS.set('nova.bg', [String.raw`.*`]);
URL_REGEXS.set('forum.dvdtalk.com', [String.raw`.*`]);
URL_REGEXS.set('magazzino.friday.ru', [String.raw`.*`]);
URL_REGEXS.set('www.skai.gr', [String.raw`.*`]);
URL_REGEXS.set('www.in.gr', [String.raw`.*`]);
URL_REGEXS.set('www.ertnews.gr', [String.raw`.*`]);
URL_REGEXS.set('www.golfchannel.com', [String.raw`.*`]);
URL_REGEXS.set('www.hsgac.senate.gov', [String.raw`.*`]);
URL_REGEXS.set('www.sedona.com', [String.raw`.*`]);
URL_REGEXS.set('tv5.ca', [String.raw`.*`]);
URL_REGEXS.set('kron4.com', [String.raw`.*`]);
URL_REGEXS.set('www.vanityfair.com', [String.raw`.*`]);
URL_REGEXS.set('www.noviny.sk', [String.raw`.*`]);
URL_REGEXS.set('help.vzaar.com', [String.raw`.*`]);
URL_REGEXS.set('www.paragon-software.com', [String.raw`.*`]);
URL_REGEXS.set('youtube-dl-demo.neocities.org', [String.raw`.*`]);
URL_REGEXS.set('www.heidelberg-laureate-forum.org', [String.raw`.*`]);
URL_REGEXS.set('www.kidzworld.com', [String.raw`.*`]);
URL_REGEXS.set('www.cloudflare.com', [String.raw`.*`]);
URL_REGEXS.set('joinpeertube.org', [String.raw`.*`]);
URL_REGEXS.set('streetkitchen.hu', [String.raw`.*`]);
URL_REGEXS.set('www.vol.at', [String.raw`.*`]);
URL_REGEXS.set('share-videos.se', [String.raw`.*`]);
URL_REGEXS.set('viqeo.tv', [String.raw`.*`]);
URL_REGEXS.set('video.sibnet.ru', [String.raw`.*`]);
URL_REGEXS.set('www.beinsports.com', [String.raw`.*`]);
URL_REGEXS.set('blog.tomeuvizoso.net', [String.raw`.*`]);
URL_REGEXS.set('demo.vhx.tv', [String.raw`.*`]);
URL_REGEXS.set('www.adn.com', [String.raw`.*`]);
URL_REGEXS.set('www.demorgen.be', [String.raw`.*`]);
URL_REGEXS.set('www.bio.org', [String.raw`.*`]);
URL_REGEXS.set('www.msmotor.tv', [String.raw`.*`]);
URL_REGEXS.set('www.kvs-demo.com', [String.raw`.*`]);
URL_REGEXS.set('youix.com', [String.raw`.*`]);
URL_REGEXS.set('bogmedia.org', [String.raw`.*`]);
URL_REGEXS.set('www.camhub.world', [String.raw`.*`]);
URL_REGEXS.set('v.redd.it', [String.raw`.*`]);
URL_REGEXS.set('www.lactv.it', [String.raw`.*`]);
URL_REGEXS.set('www.gezip.net', [String.raw`.*`]);
URL_REGEXS.set('kkzz.kr', [String.raw`.*`]);
URL_REGEXS.set('www.monash.edu', [String.raw`.*`]);
URL_REGEXS.set('www.nelonen.fi', [String.raw`.*`]);
URL_REGEXS.set('www.hs.fi', [String.raw`.*`]);
URL_REGEXS.set('www.filmarkivet.se', [String.raw`.*`]);
URL_REGEXS.set('www.mollymovieclub.com', [String.raw`.*`]);
URL_REGEXS.set('www.blockedandreported.org', [String.raw`.*`]);
URL_REGEXS.set('www.skimag.com', [String.raw`.*`]);
URL_REGEXS.set('www.nu.nl', [String.raw`.*`]);
URL_REGEXS.set('www.autoweek.nl', [String.raw`.*`]);
URL_REGEXS.set('www.extra.cz', [String.raw`.*`]);
URL_REGEXS.set('shooshtime.com', [String.raw`.*`]);
