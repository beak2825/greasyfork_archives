// ==UserScript==
// @name           Close ME by MHK
// @namespace      Close ME by MHK
// @description    Close PopUp Advertising !!
// @author         MHK
// @icon           data:image/png;base64,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
// @include        *nchsoftware.com/software/thanks.html*
// @include        *zwaar.net*
// @include        *alwazer.com*
// @include        *myfreelink.net*
// @include        *gate.net.sa*
// @include        *babylon.com*
// @include        *travian.*
// @include        *66c.com*
// @include        *aksalser.com*
// @include        *rmcsport.fr*
// @include        *creditneto.net*
// @include        *allosponsor.com/scripts/clic_popinto.php*
// @include        *vyomworld.com*
// @include        *games.9ory.com*
// @include        *poparb.com*
// @include        *bodisparking.com*
// @include        *darendeal.com*
// @include        *l.exoplanetwar.com*
// @include        *zedo.com*
// @include        *adsphinx.com*
// @include        *octimex.com*
// @include        http://s1.qshare.com/?new_lang=1
// @include        http://www.desert-operations.us/register.html?rid=*
// @include        *grepolis.com*
// @include        *mgid.com*
// @include        *widgeo.net/ads*
// @include        *adds.mobimezzo.com*
// @include        *mobileraffles.com/welovefilms/download*
// @include        *agoda.com/?CID=*
// @include        *affiliation-france.com/sc/pop.php*
// @include        *pubdirecte.com*
// @include        *sparkstudios.com*
// @include        http://www.damnlol.com/mgid.html

// <--Adu1t Z0Ne
// @include        *filmikz.*/*XXX-fkz*
// Removed...      *xxx*
// @include        *porn*
// @include        *p0rno*
// @include        *joymii.com*
// @include        *ddfbusty.com*
// @include        *adultfriendfinder.com*
// @include        *overthumbs.com*
// @include        *fulltubemovies.com*
// @include        *livejasmin.com*
// @include        *sexulus.com*
// @include        *fantasti.cc*
// @include        *zonatorrent.com*
// @include        *onesexaday.com*
// @include        *perfectgirls.net*
// @include        *xnxx.com*
// @include        *xhamster.com*
// @include        *elephanttube.com*
// @include        *youjizz.com*
// @include        *redtube.com*
// @include        *tubekitty.com*
// @include        *freefuckvidz.com*
// @include        *jacquieetmicheltv.net*
// @include        *jacquieetmicheltv2.net*
// @include        *keezmovies.com*
// @include        *drtuber.com*
// @include        *hardsextubex.biz*
// @include        *tnaflix.com*
// @include        *gigagalleries.com*
// @include        *tube8.com*
// @include        *keandra.com*
// @include        *tubegalore.com*
// @include        *extremetube.com*
// @include        *empflix.com*
// @include        *nuvid.com*
// @include        *adameve.com*
// @include        *sexyavenue.com*
// @include        *xadultbook.com*
// @include        *fleshlight.com*
// @include        *edenfantasys.com*
// @include        *clubgallery.com*
// @include        *lovehoney.co.uk*
// @include        *.xxx/*
// http://en.wikipedia.org/wiki/.xxx
// Removed...      *adultsexgames.xxx*
// @include        *adultshop.com.au*
// @include        *xandria.com*
// @include        *adultspace.com*
// @include        *thepleasurechest.com*
// @include        *cybernooky.com*
// @include        *risqueboutique.com*
// @include        *simplypleasure.com*
// @include        *sextoys247.com.au*
// @include        *babblesex.com*
// @include        *chatroulette.com*
// @include        *shopstarship.com*
// @include        *charlisangels.com*
// @include        *shopintimates.com*
// @include        *somethingsexyplanet.com*
// @include        *aoadultstore.com.au*
// @include        *online4love.com*
// @include        *filetube.com*
// @include        *brazzers.com*
// @include        *koocash.com*
// @include        *liveparadise.com*
// @include        *charmix.com*
// @include        *matures-vs-jeunots.net*
// @include        *direction-x.com*
// @include        *sexe-hard-ensemble.com*
// @include        *teenmushi.org*
// @include        *xvideos.com*
// @include        *tubeadultmovies.com*
// @include        *adulttube.net*
// @include        *adulttube.com*
// @include        *tubeadulte.com*
// @include        *fbooksluts.com*
// @include        *facebookgfs.com*
// @include        *vulvatube.com*
// @include        *vintageadulttube.com*
// @include        *adult-tube.org*
// @include        *teenadulttube.com*
// @include        *immodesttube.com*
// @include        *juliamovies.com*
// @include        *spankbang.com*
// @include        *10movs.com*
// @include        *skeletontube.com*
// @include        *8owl.com*
// @include        *adulttubefree.info*
// @include        *wanktube.com*
// @include        *tugmovies.com*
// @include        *tubestack.com*
// @include        *videos.com*
// @include        *adultpartytube.com*
// @include        *alladulttubes.com*
// @include        *tedadult.com*
// @include        *adultsextubes.com*
// @include        *xchimp.com*
// @include        *adult.rs*
// @include        *passiontube.net*
// @include        *fancy7.com*
// @include        *hotmilfsvids.com*
// @include        *adultanimetube.com*
// @include        *xvideoswet.com*
// @include        *pinkworldtube.com*
// @include        *adultmothertube.com*
// @include        *tubekeys.com*
// @include        *giggidy.com*
// @include        *amandafreetube.com*
// @include        *bulktube.com*
// @include        *elephanttubelist.com*
// @include        *mammothtube.com*
// @include        *glossytube.com*
// @include        *adultxtreme.com*
// @include        *filmsoff.com*
// @include        *nastyvideotube.com*
// @include        *yobt.tv*
// @include        *tube4x.com*
// @include        *allofadult.com*
// @include        *datubehd.com*
// @include        *soniastube.com*
// @include        *gigantclips.com*
// @include        *proteintube.com*
// @include        *bangable.com*
// @include        *adulthubmovies.com*
// @include        *xxxvideocum.com*
// @include        *adulttubefilms.com*
// @include        *allofx.com*
// @include        *fuckingawesome.com*
// @include        *punishtube.com*
// @include        *xxxhost.me*
// @include        *budbi.com*
// Adu1t Z0Ne-->

// @include        *pub.netboosting.com*
// @include        *feedbox.com/?publisher*
// @include        *888casino.com*
// @include        *adv-adserver.com*
// @include        *cacheserve.eurogrand.com*
// @include        *mobileraffles.com*
// @include        *sparkstudios.com*
// @include        *adcash.com*
// @include        *marketgid.info*
// @include        *marketgid.com*marketpopup*
// @include        *icetraffic.com*
// @include        *popcpm.com*
// @include        *trafficbroker.com*
// @include        *angege.com*
// Removed...      *linkbucksmedia.com*
// @include        *clicksor.com*
// @include        *media-servers.net*
// @include        *yieldmanager.com*
// @include        *wyzeshopping.com*
// @include        *multiupload.nl/popunder*
// @include        *tribalfusion.com*
// @include        *adtech.de*
// @include        *xtendmedia.com*
// @include        *tagjunction.com*
// @include        *optmd.com*
// @include        *adnetwork.net*
// @include        *ad6media.fr*
// @include        *adserverplus.com*
// @include        *adtgs.com*
// @include        http*://freakshare.com/pata.php
// @include        http*://www.mirrorcreator.com/xtend_pop.html
// @include        *illyx.com*
// @include        *adreactor.com*
// @include        *z5x.net*
// @include        *cpxcenter.com*
// @include        http*://*facebook.com/widgets/popup_closer.php*
// @include        *lzjl.com*
// @include        *searchpeack.com*
// @include        *hostome.com*
// @include        *hostingink.com*
// @include        *hyperpromote.com*

// <--Virus Sites
// example @ virustotal.com : http://goo.gl/2QCVh
// @include        *cracknet.net*
// @include        *crackinn.com*
// Virus Sites-->

// @include        *popads.net*
// @include        *adtech.de*
// @include        *vidxden.com/pop.htm
// @include        *wigetmedia.com*
// @include        *jxliu.com*
// @include        *4dsply.com*
// @include        *clkads.com*
// @include        *hopdream.com/?cle=*
// @include        *adsupply.com*
// @include        *geoadserving.coffeetree.info*
// @include        *adsmarket.com*
// @include        *go.tvnoop.com/*clickid=*
// @include        *lp.wxdownloadmanager.com*
// @include        *appround.biz/*cid=*clickid=*
// @include        *goalunited.org*
// @include        *disorlike.tv/?c*
// @include        *delivery.thepiratebay.se*
// @include        *mediatoolbox-online.com/lp/popby/*
// @include        *888poker.com/*utm_source=*
// @include        *u.xcy8.com*
// @include        *adserving.cpxadroit.com*
// @include        *ads.depositfiles.com*
// @include        *game321.com/*utm_source=*ce_cid=*
// @include        *3639-site.wyzemerchant.com*
// @include        *r2games.com/*adid=*
// @include        *gotostat.ru*
// @include        *advstat.letitbit.net*
// @include        *download.click2saveapp.com/bb6*
// @include        *mlgame.ae*
// @include        *mlgame.co.uk*
// @include        *mlgame.es*
// @include        *mlgame.org*
// @include        *mlgame.ru*
// @include        *poponclick.com*
// @include        *gestionpub.com*
// @include        *congdongtinhoc.vn/ads/*
// @include        *adbrite.com*
// @include        *ad.adrttt.com*
// @include        *free-filehost.net/pop/*
// @include        *evony.com/*ad4game2*site=*
// @include        *wodph.igg.com/load/v3/*cid=*kid=*
// @include        *zippyshare.com/pop.jsp*
// @include        *fhserve.com/www/delivery/ac.php*
// @include        *newsonlineweekly.com*
// @include        *dimds.com*
// @include        *180upload.com/p.html
// @include        *illyx.co*
// @include        *ziddu.com*onclickpop.php*
// @include        *directrev.com*
// @include        *vncovers.com*
// @include        *chattycatty.com*
// @include        *propellerpops.com*
// @include        *d1110e4.se*
// @include        *onclickads.net*
// @include        *adzo.net*
// @include        *m2pub.com*
// @include        *appround.net/lp/*
// @include        *trklnks.com*
// @include        *annoncesexpress.com*
// @include        *tracking.affiliates.de*
//???
// @include        *bet365.com/*affiliate=*
// @include        *pop.billionuploads.com*
// @include        *clkmon.com*
// @include        *64.237.104.20*
// @include        *adjuggler.net*
// @include        *enferatu.com/?ref=*
// @include        *lizads.com*
// @include        *lp.ilivid.com*
// @include        *noyapps.com*cid=*
// @include        *searchfun.in*
// @include        *trafficunit.in*
// @include        *69.31.136.5*
// @include        *baypops.com*
// @include        *downxsoft.com*
// @include        *down1oads.com*
// @include        *trafficbee.com*
// @include        *reduxmediia.com*
// @include        *adnxs.com*
// @include        *spotscenered.info*
// @include        *32d1d3b9c.se*
// @include        *ee74ff81b44.se*
// @include        *loltrk.com*
// @include        *affbuzzads.com*
// @include        *adrotator.se*
// @include        *thefreecamsecret.com/no-ap*
// @include        *ero-advertising.com*
// @include        *engygames.com*
// @include        *ad2up.com*
// @include        *down2desk.com*
// @include        *popcash.net*
// @include        *popmyads.com*
// @include        *adshostnet.com*
// @include        *m2pub.com*
// @include        *liveadoptimizer.com*


// <--linkbucks.com
// @include        *a5b9e3a8.any.gs*
// linkbucks.com-->


// <--adf.ly
// @include        *adf.ly/2mHZI*
// @include        *adf.ly/21dBl*
// @include        *adf.ly/CdrxN*
// @include        *adf.ly/Tvlix*
// adf.ly-->

// <--F@ke Link
// @include        *bitly.com/SHDQgj*
// @include        *linkz.it/3UT*
// F@ke Link-->

// @include        *0427d7.se/*
// @include        *pokerstars.com/sites/download/en-gb/*
// @include        *rtbpop.com/*
// @include        *affiliates.de/*
// @include        *tracking.affiliates.de/aff_r*
// @include        *clickandownload.com/*
// @include        *1clickmoviedownloader.com/*
// @include        *smarterdownloader.com/*
// @include        *rtbpop.com/*
// @include        *motionhits.com/*
// @include        *pgmediaserve.com/*
// @include        *integral-marketing.com/*
// @include        *rackcdn.com/*
// @include        *am15.net/*
// @include        *ad4game.com/*
// @include        *kovla.com/?referer=*
// @include        *0427d7.se/*
// @include        *e97527f0.se/*
// @include        *ohmgames.com/ohm_pop.html*
// @include        *adtimaserver.vn/*


// @source         http://userscripts.org/scripts/show/133684
// @identifier     http://userscripts.org/scripts/source/133684.user.js
// @date           2012-05-18
// @update         2014-09-07
// @version        1.4.2.324
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/4903/Close%20ME%20by%20MHK.user.js
// @updateURL https://update.greasyfork.org/scripts/4903/Close%20ME%20by%20MHK.meta.js
// ==/UserScript==

window.close();
window.open('javascript:window.close();','_self','');
window.open('javascript:window.close();','_self','');
//self.close();
//window.open('about:blank','_parent','');

//FireFox 4+ : Warning: Scripts may not close windows that were not opened by script.
//Enable window.close in FireFox 4+ : http://forums.asp.net/post/2757125.aspx
function forced_firefox()
{
	var j=document.childNodes.length;
	if(j>0)
	{
		for(i=j-1;-1<i;i--)
		{
			document.childNodes[i].parentNode.removeChild(document.childNodes[i]);
		}
	}
}
var intrvl=self.setInterval(function(){forced_firefox()},1000);