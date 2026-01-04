// ==UserScript==
// @name         SpiderRouter
// @namespace    https://test.com/
// @version      9.0
// @description  Routers for Manga Spiders | V9.0 更新对6个网站匹配
// @homepage     https://greasyfork.org/scripts/433304-spiderrouter
// @author       DD1969
// @license      GPL-3.0
// @match        https://www.alphapolis.co.jp/manga/official/*/*
// @match        https://booklive.jp/bviewer/*
// @match        https://viewer.bookwalker.jp/*/*/viewer.html*
// @match        https://viewer-subscription.bookwalker.jp/*/*/viewer.html*
// @match        https://ciao.shogakukan.co.jp/*
// @match        https://www.cmoa.jp/bib/speedreader/*
// @match        https://comic-boost.com/viewer/viewer.html*
// @match        https://comic-days.com/*/*
// @match        https://shonenjumpplus.com/*/*
// @match        https://kuragebunch.com/*/*
// @match        https://www.sunday-webry.com/*/*
// @match        https://comicbushi-web.com/*/*
// @match        https://tonarinoyj.jp/*/*
// @match        https://comic-gardo.com/*/*
// @match        https://comic-zenon.com/*/*
// @match        https://comic-trail.com/*/*
// @match        https://comic-action.com/*/*
// @match        https://magcomi.com/*/*
// @match        https://viewer.heros-web.com/*/*
// @match        https://feelweb.jp/*/*
// @match        https://comicborder.com/*/*
// @match        https://comic-ogyaaa.com/*/*
// @match        https://comic-earthstar.com/*/*
// @match        https://comic-seasons.com/*/*
// @match        https://ichicomi.com/*/*
// @match        https://comic-fuz.com/*
// @match        https://comici.jp/*/episodes/*
// @match        https://cdn.comici.jp/*/episodes/*
// @match        https://youngchampion.jp/episodes/*
// @match        https://younganimal.com/episodes/*
// @match        https://bigcomics.jp/episodes/*
// @match        https://comicride.jp/episodes/*
// @match        https://kansai.mag-garden.co.jp/episodes/*
// @match        https://championcross.jp/episodes/*
// @match        https://comic.j-nbooks.jp/episodes/*
// @match        https://comic-growl.com/episodes/*
// @match        https://comicpash.jp/episodes/*
// @match        https://rimacomiplus.jp/*/episodes/*
// @match        https://kimicomi.com/episodes/*
// @match        https://comic-medu.com/episodes/*
// @match        https://www.comico.jp/*
// @match        https://www.comico.kr/*
// @match        https://www.pocketcomics.com/*
// @match        https://*.comic-ryu.jp/*
// @match        https://comic-walker.com/*
// @match        https://play.comipo.app/*
// @match        https://www.corocoro.jp/*
// @match        https://cycomi.com/*
// @match        https://play.dlsite.com/*
// @match        https://book.dmm.com/*
// @match        https://drecom-media.jp/viewer/e/*
// @match        https://*.ebookrenta.com/sc/view_*
// @match        https://firecross.jp/reader/*
// @match        https://gaugau.futabanet.jp/list/work/*/episodes/*
// @match        https://www.ganganonline.com/*
// @match        https://ganma.jp/*
// @match        https://jumptoon.com/*
// @match        https://read.amazon.co.jp/manga/*
// @match        https://manga.line.me/*/viewer*
// @match        https://pocket.shonenmagazine.com/*
// @match        https://www.mangabox.me/reader/*/episodes/*
// @match        *://r-cbs.mangafactory.jp/*/*/*
// @match        https://mangagun.net/nugm-*
// @match        https://comic.k-manga.jp/viewer/pc/*
// @match        https://manga-mee.jp/*
// @match        https://*.manga-meets.jp/comics/*
// @match        https://manga-one.com/*
// @match        https://manga-park.com/title/*
// @match        https://manga.nicovideo.jp/watch/*
// @match        https://sp.manga.nicovideo.jp/watch/*
// @match        https://novema.jp/comic/serial/*/*/*
// @match        https://piccoma.com/web/viewer/*/*
// @match        https://comic.pixiv.net/*
// @match        https://www.comicnettai.com/*/viewer.html*
// @match        https://pash-up.jp/*/viewer.html*
// @match        https://rawdevart.art/*
// @match        https://rawkuma.net/*
// @match        https://nicomanga.com/read-*.html
// @match        https://*.papy.co.jp/sc/view_*
// @match        https://www.123hon.com/vw/*
// @match        https://www.comic-valkyrie.com/samplebook/*
// @match        https://televikun-super-hero-comics.com/*/*/*
// @match        https://kirapo.jp/pt/*
// @match        https://takecomic.jp/*
// @match        https://to-corona-ex.com/episodes/*
// @match        https://ebook.tongli.com.tw/reader/*
// @match        https://voltage-comics.com/viewer/speed.html*
// @match        https://web-ace.jp/*/contents/*/episode/*
// @match        https://comic.webnewtype.com/contents/*/*
// @match        https://weloma.art/*/*/
// @match        https://welovemanga.one/wlmr-*
// @match        https://yanmaga.jp/viewer/comics/*
// @match        https://yawaspi.com/*/comic/*
// @match        https://ynjn.jp/*
// @match        https://www.yomonga.com/*
// @match        https://zerosumonline.com/*
// @require      https://lib.baomitu.com/axios/0.27.2/axios.min.js
// @require      https://lib.baomitu.com/jszip/3.7.1/jszip.min.js
// @require      https://lib.baomitu.com/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://lib.baomitu.com/crypto-js/4.1.1/crypto-js.min.js
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @require      https://update.greasyfork.org/scripts/451811/1096709/PublusConfigDecoder.js
// @require      https://update.greasyfork.org/scripts/451812/1096723/PublusCoordsGenerator.js
// @require      https://update.greasyfork.org/scripts/451813/1128858/PublusNovelPage.js
// @require      https://update.greasyfork.org/scripts/451814/1159347/PublusPage.js
// @require      https://update.greasyfork.org/scripts/456423/1128886/SpeedReaderTools.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/433304/SpiderRouter.user.js
// @updateURL https://update.greasyfork.org/scripts/433304/SpiderRouter.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, CryptoJS, $, ImageDownloader, PublusConfigDecoder, PublusCoordsGenerator, PublusNovelPage, PublusPage, SpeedReaderTools) {
  'use strict';

  // map from host to script
  const scriptDict = {
    'www.alphapolis.co.jp': 'https://update.greasyfork.org/scripts/451858/alphapolisdownloader.js',
    'booklive.jp': 'https://update.greasyfork.org/scripts/452562/booklivedownloader.js',
    'viewer.bookwalker.jp': 'https://update.greasyfork.org/scripts/451859/bookwalkerdownloader.js',
    'viewer-subscription.bookwalker.jp': 'https://update.greasyfork.org/scripts/451859/bookwalkerdownloader.js',
    'pcreader.bookwalker.com.tw': 'https://update.greasyfork.org/scripts/451859/bookwalkerdownloader.js',
    'ciao.shogakukan.co.jp': 'https://update.greasyfork.org/scripts/518708/ciaoplusdownloader.js',
    'www.cmoa.jp': 'https://update.greasyfork.org/scripts/456424/cmoadownloader.js',
    'comic-boost.com': 'https://update.greasyfork.org/scripts/451860/comicboostdownloader.js',
    'comic-days.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'shonenjumpplus.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'kuragebunch.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'www.sunday-webry.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'comicbushi-web.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'tonarinoyj.jp': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'comic-gardo.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'comic-zenon.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'comic-trail.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'comic-action.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'magcomi.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'viewer.heros-web.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'feelweb.jp': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'comicborder.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'comic-ogyaaa.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'comic-earthstar.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'comic-seasons.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'ichicomi.com': 'https://update.greasyfork.org/scripts/451861/comicdaysdownloader.js',
    'comic-fuz.com': 'https://update.greasyfork.org/scripts/451863/comicfuzdownloader.js',
    'comici.jp': 'https://update.greasyfork.org/scripts/478339/comicidownloader.js',
    'cdn.comici.jp': 'https://update.greasyfork.org/scripts/478339/comicidownloader.js',
    'youngchampion.jp': 'https://update.greasyfork.org/scripts/463181/comiciviewerdownloader.js',
    'younganimal.com': 'https://update.greasyfork.org/scripts/463181/comiciviewerdownloader.js',
    'bigcomics.jp': 'https://update.greasyfork.org/scripts/463181/comiciviewerdownloader.js',
    'comicride.jp': 'https://update.greasyfork.org/scripts/463181/comiciviewerdownloader.js',
    'kansai.mag-garden.co.jp': 'https://update.greasyfork.org/scripts/463181/comiciviewerdownloader.js',
    'championcross.jp': 'https://update.greasyfork.org/scripts/463181/comiciviewerdownloader.js',
    'comic.j-nbooks.jp': 'https://update.greasyfork.org/scripts/463181/comiciviewerdownloader.js',
    'comic-growl.com': 'https://update.greasyfork.org/scripts/463181/comiciviewerdownloader.js',
    'comicpash.jp': 'https://update.greasyfork.org/scripts/463181/comiciviewerdownloader.js',
    'rimacomiplus.jp': 'https://update.greasyfork.org/scripts/463181/comiciviewerdownloader.js',
    'kimicomi.com': 'https://update.greasyfork.org/scripts/463181/comiciviewerdownloader.js',
    'comic-medu.com': 'https://update.greasyfork.org/scripts/463181/comiciviewerdownloader.js',
    'www.comico.jp': 'https://update.greasyfork.org/scripts/451865/comicodownloader.js',
    'www.comico.kr': 'https://update.greasyfork.org/scripts/451865/comicodownloader.js',
    'www.pocketcomics.com': 'https://update.greasyfork.org/scripts/451865/comicodownloader.js',
    'comic-walker.com': 'https://update.greasyfork.org/scripts/451866/comicwalkerdownloader.js',
    'play.comipo.app': 'https://update.greasyfork.org/scripts/547218/comipodownloader.js',
    'www.corocoro.jp': 'https://update.greasyfork.org/scripts/513508/corocorodownloader.js',
    'cycomi.com': 'https://update.greasyfork.org/scripts/467898/cycomidownloader.js',
    'play.dlsite.com': 'https://update.greasyfork.org/scripts/485728/dlsitedownloader.js',
    'book.dmm.com': 'https://update.greasyfork.org/scripts/451867/dmmdownloader.js',
    'drecom-media.jp': 'https://update.greasyfork.org/scripts/513082/drecommangadownloader.js',
    'firecross.jp': 'https://update.greasyfork.org/scripts/451868/firecrossdownloader.js',
    'gaugau.futabanet.jp': 'https://update.greasyfork.org/scripts/478408/futabanetdownloader.js',
    'www.ganganonline.com': 'https://update.greasyfork.org/scripts/455948/ganganonlinedownloader.js',
    'ganma.jp': 'https://update.greasyfork.org/scripts/451869/ganmadownloader.js',
    'jumptoon.com': 'https://update.greasyfork.org/scripts/497457/jumptoondownloader.js',
    'read.amazon.co.jp': 'https://update.greasyfork.org/scripts/451870/kindlemangadownloader.js',
    'manga.line.me': 'https://update.greasyfork.org/scripts/452814/linemangadownloader.js',
    'pocket.shonenmagazine.com': 'https://update.greasyfork.org/scripts/536294/magapokedownloader.js',
    'www.mangabox.me': 'https://update.greasyfork.org/scripts/455860/mangaboxdownloader.js',
    'r-cbs.mangafactory.jp': 'https://update.greasyfork.org/scripts/451873/mangafactorydownloader.js',
    'mangagun.net': 'https://update.greasyfork.org/scripts/453154/mangagundownloader.js',
    'comic.k-manga.jp': 'https://update.greasyfork.org/scripts/536844/mangakingdomdownloader.js',
    'manga-mee.jp': 'https://update.greasyfork.org/scripts/545289/mangameedownloader.js',
    'manga-one.com': 'https://update.greasyfork.org/scripts/545288/mangaonedownloader.js',
    'manga-park.com': 'https://update.greasyfork.org/scripts/455861/mangaparkdownloader.js',
    'manga.nicovideo.jp': 'https://update.greasyfork.org/scripts/451874/nicomangadownloader.js',
    'sp.manga.nicovideo.jp': 'https://update.greasyfork.org/scripts/468131/nicomangaspdownloader.js',
    'novema.jp': 'https://update.greasyfork.org/scripts/451875/novemadownloader.js',
    'piccoma.com': 'https://update.greasyfork.org/scripts/451876/piccomadownloader.js',
    'comic.pixiv.net': 'https://update.greasyfork.org/scripts/451877/pixivcomicdownloader.js',
    'www.comicnettai.com': 'https://update.greasyfork.org/scripts/451878/publusdownloader.js',
    'pash-up.jp': 'https://update.greasyfork.org/scripts/451878/publusdownloader.js',
    'rawdevart.art': 'https://update.greasyfork.org/scripts/508861/rawdevartdownloader.js',
    'rawkuma.net': 'https://update.greasyfork.org/scripts/468157/rawkumadownloader.js',
    'nicomanga.com': 'https://update.greasyfork.org/scripts/545285/rawnicodownloader.js',
    'www.123hon.com': 'https://update.greasyfork.org/scripts/451879/speedbinbdownloader.js',
    'www.comic-valkyrie.com': 'https://update.greasyfork.org/scripts/451879/speedbinbdownloader.js',
    'televikun-super-hero-comics.com': 'https://update.greasyfork.org/scripts/451879/speedbinbdownloader.js',
    'kirapo.jp': 'https://update.greasyfork.org/scripts/451879/speedbinbdownloader.js',
    'takecomic.jp': 'https://update.greasyfork.org/scripts/555270/takecomicdownloader.js',
    'to-corona-ex.com': 'https://update.greasyfork.org/scripts/451880/tocoronaexdownloader.js',
    'ebook.tongli.com.tw': 'https://update.greasyfork.org/scripts/490917/tonglidownloader.js',
    'voltage-comics.com': 'https://update.greasyfork.org/scripts/555268/voltagecomicsdownloader.js',
    'web-ace.jp': 'https://update.greasyfork.org/scripts/451887/webacedownloader.js',
    'comic.webnewtype.com': 'https://update.greasyfork.org/scripts/451882/webnewtypedownloader.js',
    'weloma.art': 'https://update.greasyfork.org/scripts/451883/welomadownloader.js',
    'welovemanga.one': 'https://update.greasyfork.org/scripts/547217/welovemangadownloader.js',
    'yanmaga.jp': 'https://update.greasyfork.org/scripts/451884/yanmagadownloader.js',
    'yawaspi.com': 'https://update.greasyfork.org/scripts/451885/yawaspidownloader.js',
    'ynjn.jp': 'https://update.greasyfork.org/scripts/455206/ynjndownloader.js',
    'www.yomonga.com': 'https://update.greasyfork.org/scripts/451886/yomongadownloader.js',
    'zerosumonline.com': 'https://update.greasyfork.org/scripts/478375/zerosumonlinedownloader.js',
  }

  // get and run the script
  GM_xmlhttpRequest({
    method: 'GET',
    url: scriptDict[window.location.host] || getOtherScript(),
    onload: (res) => {
      try {
        eval(res.response);
      } catch (error) {
        if (error.message.includes('unsafe-eval')) {
          const scriptID = res.finalUrl.match(/scripts\/(?<id>\d+)/).groups.id;
          window.prompt('Failed to run external script, please deactivate SpiderRouter and try this instead:', `https://greasyfork.org/scripts/${scriptID}`);
        }
      }
    }
  });

  function getOtherScript() {
    if (window.location.host.endsWith('papy.co.jp')) return 'https://update.greasyfork.org/scripts/456364/rentadownloader.js';
    if (window.location.host.endsWith('ebookrenta.com')) return 'https://update.greasyfork.org/scripts/456365/ebookrentadownloader.js';
    if (window.location.host.endsWith('manga-meets.jp')) return 'https://update.greasyfork.org/scripts/491110/mangameetsdownloader.js';
    if (window.location.host.endsWith('comic-ryu.jp')) return 'https://update.greasyfork.org/scripts/455399/comicryudownloader.js';
  }

})(axios, JSZip, saveAs, CryptoJS, $, ImageDownloader, PublusConfigDecoder, PublusCoordsGenerator, PublusNovelPage, PublusPage, SpeedReaderTools);