// ==UserScript==
// @name           Mental's Host Checker for fritchy.com
// @version        36.18
// @namespace      mental
// @description    Marks allowed & banned image & file hosts on fritchy.com
// @author			mental
// @license			GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @match          http://fritchy.com/*
// @match          http://*.fritchy.com/*
// @grant          none
// @connect *
// @icon           data:image/jpeg;base64,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
// @homepage       http://usa.x10host.com/mybb
// @downloadURL https://update.greasyfork.org/scripts/2026/Mental%27s%20Host%20Checker%20for%20fritchycom.user.js
// @updateURL https://update.greasyfork.org/scripts/2026/Mental%27s%20Host%20Checker%20for%20fritchycom.meta.js
// ==/UserScript==

(function() { 
'use strict';

if (window.self !== window.top) { return; } // end execution if in a frame

// List of allowed image hosts
var imgHosts = [
  'depic.me',
  'dpic.me',
  'imagetwist.com',
  'imageupper.com',
  'imagevenue.com',
  'imgbox.com',
  'imgcredit.xyz',
  'imagebam.com',
  'motherless.com',
  'motherlessmedia.com',
  'picstate.com',
  'picstate.top',
  'pimpandhost.com',
  'pixhost.to',
  'pixroute.com',
  'postimg.cc',
  'postimages.org',
  'turboimagehost.com',
  'turboimg.net',
  'uploadhouse.com',
  'fritchy.com',
  'data:image',
 
];

// List of banned & obsolete File Hosts
var fileHosts = [
	"zippyshare.com",
    '4shared.com',
    'bigfile.to',
    'imgcredit.xyz',
    'crazyshare.cc',
    'uploaded.net',
    'uploaded.to',
    'ul.to',
    'depfile.com',
    'depfile.us',
    'dipfile.com',
    'adlink.wf',
    'click.tf',
    'kyc.pm',
    'lan.wf',
    'led.wf',
    'sfiles.org',
    'ssh.tf',
    'ssh.yt',
    'yep.pm',
    'admy.link',
    'affimg.org',
    'anysend.com',
    'asfile.com',
    'http://bc.vc',
    'bit.cur.lv',
    'bitshare.com',
    'cashmoneyuploads',
    'downloadsafe.org',
    'http://dy.cx',
    'egofiles.com',
    'eufile.eu',
    'fileace',
    'filebounty',
    'filehost.ws',
    'filemad',
    'fileme',
    'filemates.com',
    'fileml.com',
    'fileom.com',
    'filerack.net',
    'fileserve',
    'filesmy.com',
    'filesonic',
    'flexydrive.com',
    'getmyfile.org',
    'gigabase.com',
    'gonewildhub.com',
    'gotlinks.co',
    'hotlink.cc',
    'imageupdation.xyz',
    'letitbit',
    'linkbabes.com',
    'luckyshare.net',
    'megaupload.com',
    'mirrored.to',
    'mirrorcreator.com',
    'oload.stream',
    'openload.co',
    'oron.com',
    'ouo.io',
    'ourl.io',
    'packupload.com',
    'http://q.gs',
    'quamiller.com',
    'qube cash',
    'queenshare.com',
    'r1x.pw',
    'rapidu.net',
    'http://sh.st',
    'sbspeed.com',
    'share-links.biz',
    'sharefiles.com',
    'shareflare.net',
    'sharenxs.com',
    'sharingmatrix.com',
    'shareloading.net',
    'speedyfiles.net',
    'storage.to',
    'storebit.net',
    'Suprafiles.me',
    'Suprafiles.org',
    'surefile.org',
    'surfergirls.hostin.org/',
    'terafile.co',
    'terafile.com',
    'ultramegabit.com',
    'unibytes.com',
    'upfolder.net',
    'upload4earn.org',
    'uploadto.us',
    'uptobox.com',
    'vidoza.net',
    'vip-file',
    'wikibabes.net',
    'wupload.com',
    'youwatch.org',
    '*****'

];

// List of redirect image hosts
var redirect_hosts = [
   
    '0dayporno.com',
    'masaladesi.com',
    'sarumann.net',
    'kvador.com',
    'imgfrost.net',
    'extraimage.net',
    'imagexport.com',
    'corepix.org',
    'imx.to',
    'imgview.net',
    'pixxxels.cc',
    'subyshare.gallery',
    'ibb.co',
    '101img8.info',
    'fastpic.ru',
    'imagepearl.com',
    '37v.net',
    'gallerysense.se',
    'hulkimge.com',
    'adultsimage.com',
    'imgtaxi.com',
    'abload.de',
    'avseesee.com',
    'bc.vc',
    'bestofcelebs.com',
    'http://blogspot.com',
    'buspic.com',
    'camncum.com',
    'casimages.com',
    'chaosimg.site',
    'cloudimg.net',
    'coreimg.net',
    'crd.ht',
    'damimage.com',
    'deltashare.net',
    'demonoid.mobi',
    'dimtus.com',
    'directupload.net',
    'dryu.gu.ma',
    'dumparump.com',
    'dumppix.com',
    'ericsony.com',
    'famouscelebritiespictures.com',
    'fapoff.com',
    'fapomatic.com',
    'filefap.com',
    'fileshared.net',
    'fireimg.net',
    'fotoupload.ru',
    'free-image-hosting.com',
    'gallerynova.se',
    'gasica77pornpp.com',
    'gfycat.com',
    'gokoimage.com',
    'greenpiccs.com',
    'hostimage.ru',
    'hostingfailov.com',
    'hostmypixxx.org',
    'hosturimage.com',
    'hotimagehost.com',
    'hotimg.com',
    'hqpictures.org',
    'iceimg.net',
    'iclickporn.com',
    'image2share.net',
    'image2you.ru',
    'image18.org',
    'image-hoster.de',
    'imageban.ru',
    'imagebing',
    'imagebax.com',
    'imageblinks.com',
    'image-boom.com',
    'imagebunk.com',
    'imagecarry.com',
    'imagecherry.com',
    'imagecorn.com',
    'imagedax.net',
    'imagedecode.com',
    'imagedunk.com',
    'imageeer.com',
    'imagefast.org',
    'imagefile.org',
    'imagefolks.com',
    'imageflash.net',
    'imagehaven.net',
    'imageleon.com',
    'imagelink.cz',
    'imagelook.org',
    'imagen69.com',
    'imagenimage.com',
    'image.nofansclub.ru',
    'imagenpic.com',
    'imageophilia.com',
    'imagepicsa.com',
    'imagepix.org',
    'imageporter.com',
    'images-host.biz',
    'imagescream.com',
    'imageshost.us',
    'imagesadda.com',
    'imageshost.ru',
    'imageshot.eu',
    'imageshack.com',
    'imageshimage.com',
    'imagesion.com',
    'imagesious.com',
    'imagesist.com',
    'imagesplace.net',
    'imagespot.org',
    'imageswitch.com',
    'imageteam.org',
    'imageupload.cf',
    'imgwallet.com',
    'imagewaste.com',
    'imgadult.com',
    'imgah.com',
    'imgbabes.com',
    'imgbar.net',
    'imgbd.net',
    'imgblow.com',
    'imgbom.com',
    'imgcandy.net',
    'imgcash.co',
    'imgchili.com',
    'imgchili.net',
    'imgclick.net',
    'imgclick.biz',
    'imgcloud.co',
    'imgdew.com',
    'imgdino.com',
    'imgdollar.com',
    'imgdrive.co',
    'imgdrive.net',
    'imgearn.net',
    'imgelite.com',
    'imgempire.com',
    'imgfap.net',
    'imgfest.com',
    'imgfile.co',
    'imggle.in',
    'imgrill.com',
    'imghaven.com',
    'imgheat.com',
    'imghostz.com',
    'imgim.com',
    'imgimg.de',
    'imgjizz.com',
    'imgmad.com',
    'imgmaid.net',
    'imgmaster.net',
    'imgmega.com',
    'imgnext.com',
    'imgoutlet.com',
    'imgoutlet.co',
    'imgpaying.com',
    'imgphun.com',
    'imgpony.com',
    'imgpost.me',
    'imgmoney.com',
    'imgpo.st',
    'imgrat.com',
    'imgrex.com',
    'imgrock.net',
    'imgrock.co',
    'imgserve.net',
    'imgshow.com',
    'imgsky.net',
    'imgspice.com',
    'imgspice.net',
    'imgsu.net',
    'imgsure.com',
    'imgtab.net',
    'imgtiger.com',
    'imgtiger.org',
    'imgtrex.com',
    'imgtube.net',
    'imgult.com',
    'imgur.com',
    'imgve.com',
    'img.yt',
    'imgzen.com',
    'ironimg.net',
    'keezmovies',
    'king3x.com',
    'kiwi.com',
    'lazygirls.info',
    'linkbucks.com',
    'lookscool.org',
    'lostpic.net',
    'miragepics.com',
    'mojeslike.me',
    'ninjaimages.com',
    'nudeshare.com',
    'ouo.io',
    'paidimg.com',
    'passpix.com',
    'passxxl.com',
    'photobucket.com',
    'photoearn.com',
    'phototo.org',
    'pic2profit.com',
    'pic4you.ru',
    'pic5you.ru',
    'picage.ru',
    'picbucks.com',
    'piccash.net',
    'picgru.com',
    'piclambo.net',
    'picload.org',
    'piclead.com',
    'picleet.com',
    'pic-maniac.com',
    'picp2.com',
    'picsbees.com',
    'picshick.com',
    'picturedip.com',
    'pictureturn.com',
    'pics-money.ru',
    'pics-sharing.net',
    'picsee.net',
    'picturescream.com',
    'pic-upload.de',
    'pix-pron',
    'pix-x.net',
    'pixhost.biz',
    'pixhub.eu',
    'picsious.com',
    'pixtreat.com',
    'pixup.us',
    "pixxx.me",
    "pl.vc",
    'pornhome.com',
    'pornimagex.com',
    'premiumpics.net',
    'pzy.be',
    'radikal.ru',
    'sexyimg.com',
    'shotimg.net',
    'shotimg.org',
    'shotpix.com',
    'sleekpix.com',
    'someimage.com',
    'spetson.com',
    'storeimgs.net',
    'subirporno.com',
    'swagirl.com',
    'sxpics.nl',
    'teenvideomegathread.com',
    'theimghost.com',
    'threepicture.com',
    'tldr.ly',
    'tnabucks.com',
    'tuspic.net',
    'up4.upppic.com',
    'uploadbox.com',
    'uploadedimg.com',
    'uploads.im',
    'uploadyourimages.org',
    'upix.me',
    'uppix.net',
    'vavvi.com',
    'vfl.ru',
    'videowood.tv',
    'viewcube.org',
    'wewpic.com',
    'winimg.com',
    'xlocker.net',
    'xxxupload.org',
    'yankoimages.net',
    'yapeee.com',
    'zooomimg.com',
  
//list of spammer redirects
  
'x8.lv',
'turl.no',  
'urly.fi',
'anon.to',
'anon.click',
'greenpiccs.com',
'1f1.de',
'dum.ps',
'i.skyrock.net', 
'm17.ca',
'gg.gg',
'9ui.co',
'dodatki.net',
'my.rs',
'imgoutlet.com',
'pornzonee.com',
'utn.pl',
'bziu.pl',
'slink.ga',
'firsturl.net',
'fiurl.de',
'wow.hr',
'bisi.pl',
'megaurl.pl',
'pvv.pl',
'u.to',
'cutt.us',
'ujeb.se',
'riz.cz',
'linkon.cz',
'jdem.cz',
'zip.er.cz',
'ilnk.us',
'lc-s.co',
'doshort.com',
'snip.li', 
'9m.no', 
'lstu.fr',
'picturelol.com',
'urly.fi',
'anon.to',
'anon.click',
'nubr.co',
'theurl.co',
'svit.pl',
'pic4you.ru',
'waa.ai',
'polr.me',
'hnng.moe',
'2009.lt',
'mcaf.ee',
'derpy.me',
'888.xirkle.com',
'ity.im', 
'iturl.nl',
'ouo.press',
'clk.im',
'shortiurl.com',
'http://li.ro',
't5m.co',
'7.ly',
'ph.dog',
'uss.cm',
'q.gs',
'lc.cx',
'hec.su',
'dodatki.net',
'my.rs',
'img.yt',
'imgoutlet.com',
'bitsy.in',
'firsturl.net',
'url.wow.hr',
'slink.ga',
'bziu.pl',
'utn.pl', 
'bisi.pl',
'pvv.pl',
'gg.gg',
'u.to',
'cutt.us',
'megaurl.pl',
'www.linkon.cz', 
'www.riz.cz',
'urly.fi',
'snip.li',
'nubr.co',
'svit.pl',
'jdem.cz',
'2009.lt',
'polr.me',
'mcaf.ee',
'888.xirkle.com',
'tinyurl.hu',
'clk.im',
'shortiurl.com',
'derpy.me',
'url-s.xyz',
'uang.in',
'jin.ni',
'utm.io',
'cut.cc', 
'wowz.org',
'xy2z.net',
'ieej.lv',
'ipt.pw',
'l2nk.com',
'c00.co',
'min.qa',
'korta.nu',
'flyt.it',
'gu.nu',
'trzyw.pl',
'uppurl.com',
'tyn.ee',
'apog.co',
'cr.ma',
'url.ie', 
'nfgn.com',
'zii.im',
'ucinacz.pl',
'koinko.in',
'miniuri.com',
'pys.me',
'twixar.me',
'hts.io',
'yep.it',
'brtsn.de',
'smal.sh',
'ipt.pw',
'min.qa',
'c00.co', 
'www.uppurl.com',
'flyt.it',
'xy2z.net',
'ucinacz.pl',
'0fs.me',
'mee.onl',
'su0.in',
'brwsr.io',
'izip.us',
'link.limo',
'bit.lc',
'dl-protect.com',
'qps.ru',
'fave.co',
'urlshortener4u.com',
'lynk.my',
'shrinkee.com',
'addq.in',
'rmo.li',
'su0.ru',
'imnot.lgbt',
'shurl.link', 
'link.luke.sx',
'm-tg.co',
'cutyour.link',
'whatthelink.com',
'surl.im',
'zip.net',
'viaurl.com',
'tnurl.net',
'9jamkt.com',
'2020.xyz',
'4you.xyz',
'4fun.xyz',
'kom.xyz',
'al.ly',
'livenews.top',
'onlineshopping.xyz',
'6h2.xyz',
'otong.in',
'sura.pw',
'minurl.link',
'1url.top',
'1url.link',
'lihat.us',
'1url.bid',
'imgrock.net',
'1url.pro',
'pixsense.net',
'loadus.net',
'dailyfiles.net',
'rapidu.net', 
'www.reddit.com',
'milfmoney',
's007.co',
'7rl.in',
'url-ink.com', 
'slender.link',
'2.ly',
'kxk.me',
'xoplax.link',
'twixar.com', 
'ndga.me',
'tinylink.link',
'tomq.al',
'nutshellurl.com',
'b2web.co',
'bty.link',
'urlshortener.top',
'ajm.ooo',
'jiz.as',
'my2url.com',
'http://v.ht/', 
'nurl.in',
'rurl.us',
'linksave.in',
'frtyd.com',
'tiwi.io',
'migre.me', 
'urlcut.org',
'yotafiles.com',
'marinad.es',
'short.urls',
's.coop',
'vzturl.com',
'midfi.us',
'gomo.bi',
'301.fm',
'krat.im',
'1su.nl',
'cort.as',
'x8.lv',
'yurlink.com',
'gotol.ink',
'ilink.li',
'visualscope.com',
'qr.net',
'go.al',
'chod.sk',
'tiny.ph',
'a7laqalb.info',
'tnij.org',
'tnij.us',
'tiny.ph',
'sprawny.pl',
'shorturl',
's-go.com',
'trimit.io',
'cut.yt',
'yd6.pl',
'http://w.tl',
't2po.com',
'martino.pl',
'ioi.lv',
'ocn.pt',
'kurza.link',
'wowcheckthis.com',
'cwaniak.info',
'http://t.in.com',
'slink.co',
'http://2.gp',
'http://ogw.ru',
'huit.re', 
];

// List of file hosts that require mirror links
var mirHosts = [
'rapidgator.net',
'rg.to',
];

var Allowed = new RegExp (imgHosts.join('|').replace(/[*.]/g,'\\$&'), 'i');
var BannedFile = new RegExp (fileHosts.join('|').replace(/[*.]/g,'\\$&'), 'i');
var hostredirect = new RegExp (redirect_hosts.join('|').replace(/[*.]/g,'\\$&'), 'i');
var hostmirror = new RegExp (mirHosts.join('|').replace(/[*.]/g,'\\$&'), 'i');

// set image border size, type, & color here
var allowedImgStyle = 'border: 5px solid #008000;';
var bannedImgStyle = 'border: 4px solid #FF0000;';

// set file border border, background, size, type & color here
var allowedUrlStyle = 'border: 3px solid #008000;';
var bannedUrlStyle = 'border: 3px solid #FF0000;';
var redirectStyle = 'background-color: #FF0000; border: 3px solid #FF0000;';
var mirrorStyle = 'background-color: #DEB887; border: 3px solid #008000;';

var imgArray =[];
var hostArray = [];
var pat = /([^./]+\.[^./]+)|(\*+)(?=\/)/;
var local = location.hostname;

// check all the images in the Post (not including the signature)
var img = document.querySelectorAll('[class^="message-body"] img');

for (var i = 0, len = img.length; i < len; i++) {

// set a style for allowed/unallowed Image hosts
  if (Allowed.test(img[i].src)<=0) {
    img[i].setAttribute('style', bannedImgStyle); //images not on the allowed list will get a red border
  }
  else if (Allowed.test(img[i].src)) {
    img[i].setAttribute('style', allowedImgStyle); //images on the allowed list will get a green border
  } 
}

//Mark url links
var urls = document.querySelectorAll('[class^="message-body"] a');

for (var i = 0, len = urls.length; i < len; i++) {
  
  if (BannedFile.test(urls[i].href)<=0) {
    urls[i].setAttribute('style', allowedUrlStyle); // puts a green box around links on allowed hosts
    }
  if (BannedFile.test(urls[i].href)) {
    urls[i].setAttribute('style', bannedUrlStyle);  // puts a red box around links on banned hosts
    }
  if (Allowed.test(urls[i].href)) {
    urls[i].setAttribute('style', allowedUrlStyle);  // puts a green underline on pics on allowed hosts
    }
  if (hostmirror.test(urls[i].href)) {
    urls[i].setAttribute('style', mirrorStyle);  // puts a shaded background on hosts that require mirror links
    
  } 
}

//check for redirected images
var urls = document.querySelectorAll('[class^="message-body"] a');

for (var i = 0, len = urls.length; i < len; i++) {
  
  if (hostredirect.test(urls[i].href)) {
    urls[i].setAttribute('style', redirectStyle); // puts red underline under images redirecting to a banned image host

  } 
}

// mark URLs inside CODE tags
var pre = document.getElementsByTagName('pre');

if (pre[0]) {

  for (var i = 0, len = pre.length; i < len; i++) {
  
  hostArray[dom] = 1; // cache for notice display

// replace HTML links with text links in pre tags
    var a = pre[i].getElementsByTagName('a');
    if (a[0]) { 
      
      for (var n = 0, len = a.length; n < len; n++) {
    
        console.log(a[0].href);
        a[n].parentNode.replaceChild(document.createTextNode(a[n].href), a[n]);
      }
    }
    
    
// mark text links in pre tags
    pre[i].innerHTML = pre[i].innerHTML.replace(/https?:\/\/\S+/gi, function(m) { 
      if (BannedFile.test(m)<=0) {
        return '<span style="' + allowedUrlStyle + '">' + m + '</span>'; //puts a green box around links on allowed hosts that are posted inside code tags
      }
      if (hostmirror.test(m)) {
          return '<span style="' + mirrorStyle + '">' + m + '</span>';  // puts a shaded background on hosts that require mirror links that are posted inside code tags
        }
      else if (BannedFile.test(m)) {
        return '<span style="' + bannedUrlStyle + '">' + m + '</span>';  //puts a red box around links on banned hosts that are posted inside code tags
      }
      return m;
    });
  }
}

var td = document.querySelector('td.alt1:only-child[width="100%"]');
if (!td) { return; }

// adds a list of all image and file hosts used on the page at the top of the page
var span = document.createElement('span');
span.setAttribute('style', 'color: #008;');
span.innerHTML = '<br />' +
  '<b>Image & File Host Links Used On This Page:</b> ' + (Object.keys(hostArray).join(' | ') || 'n/a');
td.appendChild(span);

})();

var allowed_hosts = new  Array("fritchy.com");
var images = document.getElementsByTagName('img');
var images_count = images.length;
var thumbnail;
allowed_hosts_count = allowed_hosts.length;
for(i = 0; i < images_count; i++){
	image = images[i];

	thumbnail = false; 

		var image_container = image.parentNode;
		
		if (image_container.localName == 'a')
		{ 
			thumbnail = true;
		for(j = 0; j < allowed_hosts_count; j++)
				if(image_container.href.indexOf(allowed_hosts[j]) >= 0) { 

				}
		} 

	if (thumbnail == false)
	{
		var toplevelnode = image.parentNode;
		var cur_id="";
		while (true)
		{
			cur_id=toplevelnode.id;
			if (cur_id.length>0)
			if (cur_id.indexOf('message-body')>=0)
			{
				if(image.src.indexOf(allowed_hosts[0]) == -1)
				image.style.border = "thick solid purple"; 
				break; 
			} 
			if (toplevelnode.localName == 'body' || cur_id.indexOf('posts')>=0) break;
			toplevelnode = toplevelnode.parentNode; 
		}
	}
}

/*
Mental's Host Checker for fritchy.com
version 36.18
September 06, 2024
updated allowed image host list

Mental's Host Checker for fritchy.com
version 36.17
August 23, 2024
updated allowed image host list

Mental's Host Checker for fritchy.com
version 36.15
April 08, 2023, 2023
added picstate.top to allowed image hosts

Mental's Host Checker for fritchy.com
version 36.14
April 01, 2023, 2023
added zippyshare.com to banned hosts

Mental's Host Checker for fritchy.com
version 36.11
January 12, 2023
fixed problem with buttons & avatars being marked with box
updated host lists
cleaned up code a bit

Mental's Host Checker for fritchy.com
version 36.10
January 08, 2023
new version for xenforo

Mental's Host Checker for fritchy.com
version 36.08
September 30, 2022
removed t.im to prevent error

Mental's Host Checker for fritchy.com
version 36.07
September 08, 2022
added sbspeed.com to banned hosts

Mental's Host Checker for fritchy.com
version 36.06
June 22, 2022
added sharefiles.com to allowed hosts list

Mental's Host Checker for fritchy.com
version 36.05
June 19, 2022
added solidfiles.com to allowed hosts list

Mental's Host Checker for fritchy.com
version 36.03
June 14, 2022
added sharefiles.com to banned hosts list

Mental's Host Checker for fritchy.com
version 36.02
October 30, 2021
added pixxxels.cc to redirect hosts

Mental's Host Checker for fritchy.com
version 36.01
October 21, 2021
added mirrored.to to banned hosts

Mental's Host Checker for fritchy.com
version 36.00
September 17, 2021
removed turbobit.net from banned file hosts list

Mental's Host Checker for fritchy.com
version 35.99
January 17, 2021
removed image-bugs.com from allowed image hosts

Mental's Host Checker for fritchy.com
version 35.96
May 15, 2020
added sarumann.net to redirect hosts

Mental's Host Checker for fritchy.com
version 35.94
March 02, 2020
fixed motherless.com

Mental's Host Checker for fritchy.com
version 35.91
December 17, 2019
added photosex.biz to allowed image hosts

Mental's Host Checker for fritchy.com
version 35.90
November 03, 2019
added to banned hosts
oload.stream & openload.co

Mental's Host Checker for fritchy.com
version 35.88
September 25, 2019
added motherless.com to allowed image hosts

Mental's Host Checker for fritchy.com
July 31, 2019
version 35.87
added imgfrost.net to redirect hosts


Mental's Host Checker for fritchy.com
December 27, 2018
version 35.83
added to redirect host list imx.to
35.76 added subyshare.com & subyshare.gallery to redirect hosts
35.79 added imagexport.com to redirect hosts
35.80 removed subyshare.com from redirect hosts/version 35.81

35.81 added to banned hosts list
    Bigfiles .to
    Sfiles
    Suprafiles .me
    Suprafiles .org
    
    Mental's Host Checker for fritchy.com
version 35.89
removed filesmonster.com from banned file hosts
 */