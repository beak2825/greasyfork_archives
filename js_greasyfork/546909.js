// ==UserScript==
// @name         BlockPup
// @namespace    Violentmonkey Scripts
// @version      0.8
// @description  Blocks unwanted popups with whitelist/blocklist control and interactive dialogs.
// @author       0xArCHDeViL
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @exclude      https://www.linkedin.com/*
// @exclude      https://*.facebook.com/*
// @exclude      *://*.bing.com/*
// @exclude      *://*.duckduckgo.com/*
// @exclude      *://*.baidu.com/*
// @exclude      *://*.ecosia.org/*
// @exclude      *://*.brave.com/*
// @exclude      *://*.startpage.com/*
// @exclude      https://accounts.google.com/*
// @exclude      https://*.google.com/*
// @exclude      https://*.google.ad/*
// @exclude      https://*.google.ae/*
// @exclude      https://*.google.com.af/*
// @exclude      https://*.google.com.ag/*
// @exclude      https://*.google.com.ai/*
// @exclude      https://*.google.al/*
// @exclude      https://*.google.am/*
// @exclude      https://*.google.co.ao/*
// @exclude      https://*.google.com.ar/*
// @exclude      https://*.google.as/*
// @exclude      https://*.google.at/*
// @exclude      https://*.google.com.au/*
// @exclude      https://*.google.az/*
// @exclude      https://*.google.ba/*
// @exclude      https://*.google.com.bd/*
// @exclude      https://*.google.be/*
// @exclude      https://*.google.bf/*
// @exclude      https://*.google.bg/*
// @exclude      https://*.google.com.bh/*
// @exclude      https://*.google.bi/*
// @exclude      https://*.google.bj/*
// @exclude      https://*.google.com.bn/*
// @exclude      https://*.google.com.bo/*
// @exclude      https://*.google.com.br/*
// @exclude      https://*.google.bs/*
// @exclude      https://*.google.bt/*
// @exclude      https://*.google.co.bw/*
// @exclude      https://*.google.by/*
// @exclude      https://*.google.com.bz/*
// @exclude      https://*.google.ca/*
// @exclude      https://*.google.cd/*
// @exclude      https://*.google.cf/*
// @exclude      https://*.google.cg/*
// @exclude      https://*.google.ch/*
// @exclude      https://*.google.ci/*
// @exclude      https://*.google.co.ck/*
// @exclude      https://*.google.cl/*
// @exclude      https://*.google.cm/*
// @exclude      https://*.google.cn/*
// @exclude      https://*.google.com.co/*
// @exclude      https://*.google.co.cr/*
// @exclude      https://*.google.com.cu/*
// @exclude      https://*.google.cv/*
// @exclude      https://*.google.com.cy/*
// @exclude      https://*.google.cz/*
// @exclude      https://*.google.de/*
// @exclude      https://*.google.dj/*
// @exclude      https://*.google.dk/*
// @exclude      https://*.google.dm/*
// @exclude      https://*.google.com.do/*
// @exclude      https://*.google.dz/*
// @exclude      https://*.google.com.ec/*
// @exclude      https://*.google.ee/*
// @exclude      https://*.google.com.eg/*
// @exclude      https://*.google.es/*
// @exclude      https://*.google.com.et/*
// @exclude      https://*.google.fi/*
// @exclude      https://*.google.com.fj/*
// @exclude      https://*.google.fm/*
// @exclude      https://*.google.fr/*
// @exclude      https://*.google.ga/*
// @exclude      https://*.google.ge/*
// @exclude      https://*.google.gg/*
// @exclude      https://*.google.com.gh/*
// @exclude      https://*.google.com.gi/*
// @exclude      https://*.google.gl/*
// @exclude      https://*.google.gm/*
// @exclude      https://*.google.gp/*
// @exclude      https://*.google.gr/*
// @exclude      https://*.google.com.gt/*
// @exclude      https://*.google.gy/*
// @exclude      https://*.google.com.hk/*
// @exclude      https://*.google.hn/*
// @exclude      https://*.google.hr/*
// @exclude      https://*.google.ht/*
// @exclude      https://*.google.hu/*
// @exclude      https://*.google.co.id/*
// @exclude      https://*.google.ie/*
// @exclude      https://*.google.co.il/*
// @exclude      https://*.google.im/*
// @exclude      https://*.google.co.in/*
// @exclude      https://*.google.iq/*
// @exclude      https://*.google.is/*
// @exclude      https://*.google.it/*
// @exclude      https://*.google.je/*
// @exclude      https://*.google.com.jm/*
// @exclude      https://*.google.jo/*
// @exclude      https://*.google.co.jp/*
// @exclude      https://*.google.co.ke/*
// @exclude      https://*.google.com.kh/*
// @exclude      https://*.google.ki/*
// @exclude      https://*.google.kg/*
// @exclude      https://*.google.co.kr/*
// @exclude      https://*.google.com.kw/*
// @exclude      https://*.google.kz/*
// @exclude      https://*.google.la/*
// @exclude      https://*.google.com.lb/*
// @exclude      https://*.google.li/*
// @exclude      https://*.google.lk/*
// @exclude      https://*.google.co.ls/*
// @exclude      https://*.google.lt/*
// @exclude      https://*.google.lu/*
// @exclude      https://*.google.lv/*
// @exclude      https://*.google.com.ly/*
// @exclude      https://*.google.co.ma/*
// @exclude      https://*.google.md/*
// @exclude      https://*.google.me/*
// @exclude      https://*.google.mg/*
// @exclude      https://*.google.mk/*
// @exclude      https://*.google.ml/*
// @exclude      https://*.google.com.mm/*
// @exclude      https://*.google.mn/*
// @exclude      https://*.google.ms/*
// @exclude      https://*.google.com.mt/*
// @exclude      https://*.google.mu/*
// @exclude      https://*.google.mv/*
// @exclude      https://*.google.mw/*
// @exclude      https://*.google.com.mx/*
// @exclude      https://*.google.com.my/*
// @exclude      https://*.google.co.mz/*
// @exclude      https://*.google.com.na/*
// @exclude      https://*.google.com.nf/*
// @exclude      https://*.google.com.ng/*
// @exclude      https://*.google.com.ni/*
// @exclude      https://*.google.ne/*
// @exclude      https://*.google.nl/*
// @exclude      https://*.google.no/*
// @exclude      https://*.google.com.np/*
// @exclude      https://*.google.nr/*
// @exclude      https://*.google.nu/*
// @exclude      https://*.google.co.nz/*
// @exclude      https://*.google.com.om/*
// @exclude      https://*.google.com.pa/*
// @exclude      https://*.google.com.pe/*
// @exclude      https://*.google.com.pg/*
// @exclude      https://*.google.com.ph/*
// @exclude      https://*.google.com.pk/*
// @exclude      https://*.google.pl/*
// @exclude      https://*.google.pn/*
// @exclude      https://*.google.com.pr/*
// @exclude      https://*.google.ps/*
// @exclude      https://*.google.pt/*
// @exclude      https://*.google.com.py/*
// @exclude      https://*.google.com.qa/*
// @exclude      https://*.google.ro/*
// @exclude      https://*.google.ru/*
// @exclude      https://*.google.rw/*
// @exclude      https://*.google.com.sa/*
// @exclude      https://*.google.com.sb/*
// @exclude      https://*.google.sc/*
// @exclude      https://*.google.se/*
// @exclude      https://*.google.com.sg/*
// @exclude      https://*.google.sh/*
// @exclude      https://*.google.si/*
// @exclude      https://*.google.sk/*
// @exclude      https://*.google.com.sl/*
// @exclude      https://*.google.sn/*
// @exclude      https://*.google.so/*
// @exclude      https://*.google.sm/*
// @exclude      https://*.google.sr/*
// @exclude      https://*.google.st/*
// @exclude      https://*.google.com.sv/*
// @exclude      https://*.google.td/*
// @exclude      https://*.google.tg/*
// @exclude      https://*.google.co.th/*
// @exclude      https://*.google.com.tj/*
// @exclude      https://*.google.tk/*
// @exclude      https://*.google.tl/*
// @exclude      https://*.google.tm/*
// @exclude      https://*.google.tn/*
// @exclude      https://*.google.to/*
// @exclude      https://*.google.com.tr/*
// @exclude      https://*.google.tt/*
// @exclude      https://*.google.com.tw/*
// @exclude      https://*.google.co.tz/*
// @exclude      https://*.google.com.ua/*
// @exclude      https://*.google.co.ug/*
// @exclude      https://*.google.co.uk/*
// @exclude      https://*.google.com.uy/*
// @exclude      https://*.google.co.uz/*
// @exclude      https://*.google.com.vc/*
// @exclude      https://*.google.co.ve/*
// @exclude      https://*.google.vg/*
// @exclude      https://*.google.co.vi/*
// @exclude      https://*.google.com.vn/*
// @exclude      https://*.google.vu/*
// @exclude      https://*.google.ws/*
// @exclude      https://*.google.rs/*
// @exclude      https://*.google.co.za/*
// @exclude      https://*.google.co.zm/*
// @exclude      https://*.google.co.zw/*
// @exclude      https://*.google.cat/*
// @exclude      https://*.youtube.com/*
// @exclude      *://disqus.com/embed/*
// @exclude      https://vk.com/*
// @exclude      https://*.vk.com/*
// @exclude      https://vimeo.com/*
// @exclude      https://*.vimeo.com/*
// @exclude      *://*.coub.com/*
// @exclude      *://coub.com/*
// @exclude      *://*.googlesyndication.com/*
// @exclude      *://*.naver.com/*
// @exclude      https://gstatic.com/*
// @exclude      https://*.gstatic.com/*
// @exclude      https://yandex.ru/*
// @exclude      https://*.yandex.ru/*
// @exclude      https://yandex.ua/*
// @exclude      https://*.yandex.ua/*
// @exclude      https://yandex.by/*
// @exclude      https://*.yandex.by/*
// @exclude      https://yandex.com/*
// @exclude      https://*.yandex.com/*
// @exclude      https://yandex.com.tr/*
// @exclude      https://*.yandex.com.tr/*
// @exclude      https://yandex.kz/*
// @exclude      https://*.yandex.kz/*
// @exclude      https://yandex.fr/*
// @exclude      https://*.yandex.fr/*
// @exclude      https://*.twitch.tv/*
// @exclude      https://tinder.com/*
// @exclude      *://*.yahoo.com/*
// @exclude      *://chatovod.ru/*
// @exclude      *://*.chatovod.ru/*
// @exclude      *://vc.ru/*
// @exclude      *://tjournal.ru/*
// @exclude      *://amanice.ru/*
// @exclude      *://ka-union.ru/*
// @exclude      *://gameforge.com/*
// @exclude      *://*.gameforge.com/*
// @exclude      *://*.ssgdfm.com/*
// @exclude      *://*.brainpop.com/*
// @exclude      *://*.taobao.com/*
// @exclude      *://*.ksl.com/*
// @exclude      *://*.t-online.de/*
// @exclude      *://boards.4channel.org/*
// @exclude      *://*.washingtonpost.com/*
// @exclude      *://*.kakao.com/*
// @exclude      *://*.discounttire.com/*
// @exclude      *://mail.ukr.net/*
// @exclude      *://*.mail.ukr.net/*
// @exclude      *://*.sahadan.com/*
// @exclude      *://*.groupon.*/*
// @exclude      *://*.amoma.com/*
// @exclude      *://*.jccsmart.com/*
// @exclude      *://wp.pl/*
// @exclude      *://*.wp.pl/*
// @exclude      *://money.pl/*
// @exclude      *://*.money.pl/*
// @exclude      *://o2.pl/*
// @exclude      *://*.o2.pl/*
// @exclude      *://pudelek.pl/*
// @exclude      *://*.pudelek.pl/*
// @exclude      *://komorkomania.pl/*
// @exclude      *://*.komorkomania.pl/*
// @exclude      *://gadzetomania.pl/*
// @exclude      *://*.gadzetomania.pl/*
// @exclude      *://fotoblogia.pl/*
// @exclude      *://*.fotoblogia.pl/*
// @exclude      *://autokult.pl/*
// @exclude      *://*.autokult.pl/*
// @exclude      *://abczdrowie.pl/*
// @exclude      *://*.abczdrowie.pl/*
// @exclude      *://parenting.pl/*
// @exclude      *://*.parenting.pl/*
// @exclude      *://dobreprogramy.pl/*
// @exclude      *://*.dobreprogramy.pl/*
// @exclude      *://polygamia.pl/*
// @exclude      *://*.polygamia.pl/*
// @exclude      *://*.mosreg.ru/*
// @exclude      *://vietjetair.com/*
// @exclude      *://*.vietjetair.com/*
// @exclude      https://web.skype.com/*
// @exclude      *://karelia.press/*
// @exclude      *://*.karelia.press/*
// @exclude      *://microsoft.com/*
// @exclude      *://*.microsoft.com/*
// @exclude      *://bancoctt.pt/*
// @exclude      *://*.bancoctt.pt/*
// @exclude      *://print24.com/*
// @exclude      *://*.print24.com/*
// @exclude      *://shellfcu.org/*
// @exclude      *://*.shellfcu.org/*
// @exclude      *://yesfile.com/*
// @exclude      *://*.yesfile.com/*
// @exclude      *://sunrise.ch/*
// @exclude      *://*.sunrise.ch/*
// @exclude      *://cetesdirecto.com/*
// @exclude      *://*.cetesdirecto.com/*
// @exclude      *://ubi.com/*
// @exclude      *://*.ubi.com/*
// @exclude      *://*.sistic.com.sg/*
// @exclude      *://*.ilfattoquotidiano.it/*
// @exclude      *://*.vanis.io/*
// @exclude      *://*.senpa.io/*
// @exclude      *://wielkopolskiebilety.pl/*
// @exclude      *://*.wielkopolskiebilety.pl/*
// @exclude      *://*.astrogo.astro.com.my/*
// @exclude      *://*.chaturbate.com/*
// @exclude      *://play.pl/*
// @exclude      *://*.play.pl/*
// @exclude      *://web.de/*
// @exclude      *://*.web.de/*
// @exclude      *://gmx.net/*
// @exclude      *://*.gmx.net/*
// @exclude      *://clashofclans.com/*
// @exclude      *://*.clashofclans.com/*
// @exclude      *://online.bfgruppe.de/*
// @exclude      *://*.online.bfgruppe.de/*
// @exclude      *://portalpasazera.pl/*
// @exclude      *://*.portalpasazera.pl/*
// @exclude      *://jeanne-laffitte.com/*
// @exclude      *://*.jeanne-laffitte.com/*
// @exclude      *://epicgames.com/*
// @exclude      *://*.epicgames.com/*
// @exclude      *://freizeithugl.de/*
// @exclude      *://*.freizeithugl.de/*
// @exclude      *://koleje-wielkopolskie.com.pl/*
// @exclude      *://*.koleje-wielkopolskie.com.pl/*
// @exclude      *://ygosu.com/*
// @exclude      *://*.ygosu.com/*
// @exclude      *://ppss.kr/*
// @exclude      *://*.ppss.kr/*
// @exclude      *://nordea.com/*
// @exclude      *://*.nordea.com/*
// @exclude      *://*.gov/*
// @exclude      *://austintestingandtherapy.com/*
// @exclude      *://*.austintestingandtherapy.com/*
// @exclude      *://learn-anything.xyz/*
// @exclude      *://*.learn-anything.xyz/*
// @exclude      *://egybest.*/*
// @exclude      *://*.egybest.*/*
// @exclude      *://ancestry.com/*
// @exclude      *://*.ancestry.com/*
// @exclude      *://login.mts.ru/*
// @exclude      *://*.login.mts.ru/*
// @exclude      *://ebay.com/*
// @exclude      *://*.ebay.com/*
// @exclude      *://outlook.live.*/*
// @exclude      *://*.outlook.live.*/*
// @exclude      *://joom.com.*/*
// @exclude      *://*.joom.com.*/*
// @exclude      *://unrealengine.com/*
// @exclude      *://*.unrealengine.com/*
// @exclude      freelancer.com
// @exclude      ov-chipkaart.nl
// @exclude      tezgoal.com
// @exclude      joom.com
// @exclude      *://id.gov.ua/*
// @exclude      *://github.com/*
// @exclude      *://tiktok.com/*
// @exclude      *://*.tiktok.com/*
// @exclude      *://namu.wiki/*
// @exclude      *://*.namu.wiki/*
// @exclude      *://beinconnect.com.tr/*
// @exclude      *://*.beinconnect.com.tr/*
// @exclude      *://deadshot.io/*
// @exclude      *://*.deadshot.io/*
// @exclude      *://gofile.io/*
// @exclude      *://*.gofile.io/*
// @exclude      *://xcancel.com/*
// @exclude      *://*.xcancel.com/*
// @exclude      *://reddit.com/*
// @exclude      *://*.reddit.com/*
// @exclude      *://challenges.cloudflare.com/*
// @exclude      https://ygosu.com/*
// @exclude      https://m.ygosu.com/*
// @exclude      https://ad-shield.io/*
// @exclude      https://feedclick.net/*
// @exclude      https://sportalkorea.com/*
// @exclude      https://*.sportalkorea.com/*
// @exclude      https://enetnews.co.kr/*
// @exclude      https://*.enetnews.co.kr/*
// @exclude      https://edaily.co.kr/*
// @exclude      https://*.edaily.co.kr/*
// @exclude      https://economist.co.kr/*
// @exclude      https://*.economist.co.kr/*
// @exclude      https://etoday.co.kr/*
// @exclude      https://*.etoday.co.kr/*
// @exclude      https://hankyung.com/*
// @exclude      https://*.hankyung.com/*
// @exclude      https://isplus.com/*
// @exclude      https://*.isplus.com/*
// @exclude      https://hometownstation.com/*
// @exclude      https://*.hometownstation.com/*
// @exclude      https://inven.co.kr/*
// @exclude      https://*.inven.co.kr/*
// @exclude      https://loawa.com/*
// @exclude      https://*.loawa.com/*
// @exclude      https://viva100.com/*
// @exclude      https://*.viva100.com/*
// @exclude      https://joongdo.co.kr/*
// @exclude      https://*.joongdo.co.kr/*
// @exclude      https://kagit.kr/*
// @exclude      https://*.kagit.kr/*
// @exclude      https://jjang0u.com/*
// @exclude      https://*.jjang0u.com/*
// @exclude      https://cboard.net/*
// @exclude      https://*.cboard.net/*
// @exclude      https://interfootball.co.kr/*
// @exclude      https://*.interfootball.co.kr/*
// @exclude      https://fourfourtwo.co.kr/*
// @exclude      https://*.fourfourtwo.co.kr/*
// @exclude      https://newdaily.co.kr/*
// @exclude      https://*.newdaily.co.kr/*
// @exclude      https://genshinlab.com/*
// @exclude      https://*.genshinlab.com/*
// @exclude      https://thephoblographer.com/*
// @exclude      https://*.thephoblographer.com/*
// @exclude      https://dogdrip.net/*
// @exclude      https://*.dogdrip.net/*
// @exclude      https://honkailab.com/*
// @exclude      https://*.honkailab.com/*
// @exclude      https://warcraftrumbledeck.com/*
// @exclude      https://*.warcraftrumbledeck.com/*
// @exclude      https://mlbpark.donga.com/*
// @exclude      https://*.mlbpark.donga.com/*
// @exclude      https://gamingdeputy.com/*
// @exclude      https://*.gamingdeputy.com/*
// @exclude      https://thestockmarketwatch.com/*
// @exclude      https://*.thestockmarketwatch.com/*
// @exclude      https://thesaurus.net/*
// @exclude      https://*.thesaurus.net/*
// @exclude      https://forexlive.com/*
// @exclude      https://*.forexlive.com/*
// @exclude      https://tweaksforgeeks.com/*
// @exclude      https://*.tweaksforgeeks.com/*
// @exclude      https://alle-tests.nl/*
// @exclude      https://*.alle-tests.nl/*
// @exclude      https://allthetests.com/*
// @exclude      https://*.allthetests.com/*
// @exclude      https://issuya.com/*
// @exclude      https://*.issuya.com/*
// @exclude      https://maketecheasier.com/*
// @exclude      https://*.maketecheasier.com/*
// @exclude      https://motorbikecatalog.com/*
// @exclude      https://*.motorbikecatalog.com/*
// @exclude      https://automobile-catalog.com/*
// @exclude      https://*.automobile-catalog.com/*
// @exclude      https://topstarnews.net/*
// @exclude      https://*.topstarnews.net/*
// @exclude      https://worldhistory.org/*
// @exclude      https://*.worldhistory.org/*
// @exclude      https://etnews.com/*
// @exclude      https://*.etnews.com/*
// @exclude      https://iusm.co.kr/*
// @exclude      https://*.iusm.co.kr/*
// @exclude      https://etoland.co.kr/*
// @exclude      https://*.etoland.co.kr/*
// @exclude      https://apkmirror.com/*
// @exclude      https://*.apkmirror.com/*
// @exclude      https://uttranews.com/*
// @exclude      https://*.uttranews.com/*
// @exclude      https://fntimes.com/*
// @exclude      https://*.fntimes.com/*
// @exclude      https://javatpoint.com/*
// @exclude      https://*.javatpoint.com/*
// @exclude      https://text-compare.com/*
// @exclude      https://*.text-compare.com/*
// @exclude      https://vipotv.com/*
// @exclude      https://*.vipotv.com/*
// @exclude      https://lamire.jp/*
// @exclude      https://*.lamire.jp/*
// @exclude      https://dt.co.kr/*
// @exclude      https://*.dt.co.kr/*
// @exclude      https://g-enews.*/*
// @exclude      https://*.g-enews.*/*
// @exclude      https://allthekingz.com/*
// @exclude      https://*.allthekingz.com/*
// @exclude      https://gadgets360.com/*
// @exclude      https://*.gadgets360.com/*
// @exclude      https://sports.hankooki.com/*
// @exclude      https://*.sports.hankooki.com/*
// @exclude      https://ajunews.com/*
// @exclude      https://*.ajunews.com/*
// @exclude      https://munhwa.com/*
// @exclude      https://*.munhwa.com/*
// @exclude      https://zal.kr/*
// @exclude      https://*.zal.kr/*
// @exclude      https://wfmz.com/*
// @exclude      https://*.wfmz.com/*
// @exclude      https://thestar.co.uk/*
// @exclude      https://*.thestar.co.uk/*
// @exclude      https://yorkshirepost.co.uk/*
// @exclude      https://*.yorkshirepost.co.uk/*
// @exclude      https://mydaily.co.kr/*
// @exclude      https://*.mydaily.co.kr/*
// @exclude      https://raenonx.cc/*
// @exclude      https://*.raenonx.cc/*
// @exclude      https://ndtvprofit.com/*
// @exclude      https://*.ndtvprofit.com/*
// @exclude      https://badmouth1.com/*
// @exclude      https://*.badmouth1.com/*
// @exclude      https://logicieleducatif.fr/*
// @exclude      https://*.logicieleducatif.fr/*
// @exclude      https://taxguru.in/*
// @exclude      https://*.taxguru.in/*
// @exclude      https://islamicfinder.org/*
// @exclude      https://*.islamicfinder.org/*
// @exclude      https://aikatu.jp/*
// @exclude      https://*.aikatu.jp/*
// @exclude      https://secure-signup.net/*
// @exclude      https://*.secure-signup.net/*
// @exclude      https://globalrph.com/*
// @exclude      https://*.globalrph.com/*
// @exclude      https://sportsrec.com/*
// @exclude      https://*.sportsrec.com/*
// @exclude      https://reportera.co.kr/*
// @exclude      https://*.reportera.co.kr/*
// @exclude      https://slobodnadalmacija.hr/*
// @exclude      https://*.slobodnadalmacija.hr/*
// @exclude      https://carscoops.com/*
// @exclude      https://*.carscoops.com/*
// @exclude      https://indiatimes.com/*
// @exclude      https://*.indiatimes.com/*
// @exclude      https://flatpanelshd.com/*
// @exclude      https://*.flatpanelshd.com/*
// @exclude      https://sportsseoul.com/*
// @exclude      https://*.sportsseoul.com/*
// @exclude      https://gloria.hr/*
// @exclude      https://*.gloria.hr/*
// @exclude      https://videogamemods.com/*
// @exclude      https://*.videogamemods.com/*
// @exclude      https://adintrend.tv/*
// @exclude      https://ark-unity.com/*
// @exclude      https://*.ark-unity.com/*
// @exclude      https://cool-style.com.tw/*
// @exclude      https://*.cool-style.com.tw/*
// @exclude      https://dziennik.pl/*
// @exclude      https://*.dziennik.pl/*
// @exclude      https://eurointegration.com.ua/*
// @exclude      https://*.eurointegration.com.ua/*
// @exclude      https://jin115.com/*
// @exclude      https://*.jin115.com/*
// @exclude      https://onlinegdb.com/*
// @exclude      https://*.onlinegdb.com/*
// @exclude      https://winfuture.de/*
// @exclude      https://*.winfuture.de/*
// @exclude      https://hoyme.jp/*
// @exclude      https://*.hoyme.jp/*
// @exclude      https://pravda.com.ua/*
// @exclude      https://*.pravda.com.ua/*
// @exclude      https://freemcserver.net/*
// @exclude      https://*.freemcserver.net/*
// @exclude      https://esuteru.com/*
// @exclude      https://*.esuteru.com/*
// @exclude      https://pressian.com/*
// @exclude      https://*.pressian.com/*
// @exclude      https://blog.livedoor.jp/kinisoku/*
// @exclude      https://blog.livedoor.jp/nanjstu/*
// @exclude      https://itainews.com/*
// @exclude      https://*.itainews.com/*
// @exclude      https://infinityfree.com/*
// @exclude      https://*.infinityfree.com/*
// @exclude      https://wort-suchen.de/*
// @exclude      https://*.wort-suchen.de/*
// @exclude      https://dramabeans.com/*
// @exclude      https://*.dramabeans.com/*
// @exclude      https://word-grabber.com/*
// @exclude      https://*.word-grabber.com/*
// @exclude      https://palabr.as/*
// @exclude      https://*.palabr.as/*
// @exclude      https://motscroises.fr/*
// @exclude      https://*.motscroises.fr/*
// @exclude      https://cruciverba.it/*
// @exclude      https://*.cruciverba.it/*
// @exclude      https://missyusa.com/*
// @exclude      https://*.missyusa.com/*
// @exclude      https://smsonline.cloud/*
// @exclude      https://*.smsonline.cloud/*
// @exclude      https://crosswordsolver.com/*
// @exclude      https://*.crosswordsolver.com/*
// @exclude      https://heureka.cz/*
// @exclude      https://*.heureka.cz/*
// @exclude      https://oradesibiu.ro/*
// @exclude      https://*.oradesibiu.ro/*
// @exclude      https://oeffnungszeitenbuch.de/*
// @exclude      https://*.oeffnungszeitenbuch.de/*
// @exclude      https://the-crossword-solver.com/*
// @exclude      https://*.the-crossword-solver.com/*
// @exclude      https://woxikon.*/*
// @exclude      https://*.woxikon.*/*
// @exclude      https://oraridiapertura24.it/*
// @exclude      https://*.oraridiapertura24.it/*
// @exclude      https://laleggepertutti.it/*
// @exclude      https://*.laleggepertutti.it/*
// @exclude      https://news4vip.livedoor.biz/*
// @exclude      *://onecall2ch.com/*
// @exclude      *://*.onecall2ch.com/*
// @exclude      https://ff14net.2chblog.jp/*
// @exclude      https://ondemandkorea.com/*
// @exclude      https://*.ondemandkorea.com/*
// @exclude      https://economictimes.com/*
// @exclude      https://*.economictimes.com/*
// @exclude      https://mynet.com/*
// @exclude      https://*.mynet.com/*
// @exclude      https://rabitsokuhou.2chblog.jp/*
// @exclude      https://talkwithstranger.com/*
// @exclude      https://*.talkwithstranger.com/*
// @exclude      https://petitfute.com/*
// @exclude      https://*.petitfute.com/*
// @exclude      https://netzwelt.de/*
// @exclude      https://*.netzwelt.de/*
// @exclude      https://convertcase.net/*
// @exclude      https://*.convertcase.net/*
// @exclude      https://picrew.me/*
// @exclude      https://*.picrew.me/*
// @exclude      https://rostercon.com/*
// @exclude      https://*.rostercon.com/*
// @exclude      https://woxikon.de/*
// @exclude      https://*.woxikon.de/*
// @exclude      https://suzusoku.blog.jp/*
// @exclude      https://kreuzwortraetsel.de/*
// @exclude      https://*.kreuzwortraetsel.de/*
// @exclude      https://slashdot.org/*
// @exclude      https://*.slashdot.org/*
// @exclude      https://yutura.net/*
// @exclude      https://*.yutura.net/*
// @exclude      https://jutarnji.hr/*
// @exclude      https://*.jutarnji.hr/*
// @exclude      https://sourceforge.net/*
// @exclude      https://*.sourceforge.net/*
// @exclude      https://manta.com/*
// @exclude      https://*.manta.com/*
// @exclude      https://tportal.hr/*
// @exclude      https://*.tportal.hr/*
// @exclude      https://horairesdouverture24.fr/*
// @exclude      https://*.horairesdouverture24.fr/*
// @exclude      https://nyitvatartas24.hu/*
// @exclude      https://*.nyitvatartas24.hu/*
// @exclude      https://verkaufsoffener-sonntag.com/*
// @exclude      https://*.verkaufsoffener-sonntag.com/*
// @exclude      https://raetsel-hilfe.de/*
// @exclude      https://*.raetsel-hilfe.de/*
// @exclude      https://zeta-ai.io/*
// @exclude      https://*.zeta-ai.io/*
// @exclude      https://zagreb.info/*
// @exclude      https://*.zagreb.info/*
// @exclude      https://powerpyx.com/*
// @exclude      https://*.powerpyx.com/*
// @exclude      https://webdesignledger.com/*
// @exclude      https://*.webdesignledger.com/*
// @exclude      https://dolldivine.com/*
// @exclude      https://*.dolldivine.com/*
// @exclude      https://cinema.com.my/*
// @exclude      https://*.cinema.com.my/*
// @exclude      https://lacuarta.com/*
// @exclude      https://*.lacuarta.com/*
// @exclude      https://wetteronline.de/*
// @exclude      https://*.wetteronline.de/*
// @exclude      https://yugioh-starlight.com/*
// @exclude      https://*.yugioh-starlight.com/*
// @downloadURL https://update.greasyfork.org/scripts/546909/BlockPup.user.js
// @updateURL https://update.greasyfork.org/scripts/546909/BlockPup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const createPatternManager = (storageKey, defaultPatterns = []) => ({
        STORAGE_KEY: storageKey,
        CACHE_DURATION: 5 * 60 * 1000,
        _cache: null,

        _patternToRegex(pattern) {
            const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
            return new RegExp(`^https?:\/\/${escaped}`, 'i');
        },

        _clearCache() {
            this._cache = null;
        },

        async _load() {
            if (this._cache && this._cache.expires > Date.now()) {
                return this._cache.patterns;
            }
            const patterns = await GM_getValue(this.STORAGE_KEY, defaultPatterns);
            this._cache = {
                patterns: new Set(patterns),
                expires: Date.now() + this.CACHE_DURATION,
            };
            return this._cache.patterns;
        },

        async isMatch(url) {
            if (!url || url.startsWith('about:')) return false;
            const patterns = await this._load();
            for (const pattern of patterns) {
                if (this._patternToRegex(pattern).test(url)) return true;
            }
            return false;
        },

        async add(pattern) {
            const patterns = await this._load();
            patterns.add(pattern);
            this._cache.patterns = patterns;
            await GM_setValue(this.STORAGE_KEY, Array.from(patterns));
        },

        async remove(pattern) {
            const patterns = await this._load();
            patterns.delete(pattern);
            this._cache.patterns = patterns;
            await GM_setValue(this.STORAGE_KEY, Array.from(patterns));
        },

        async getAll() {
            return Array.from(await this._load());
        },

        async replaceAll(newPatterns) {
            if (Array.isArray(newPatterns)) {
                await GM_setValue(this.STORAGE_KEY, newPatterns);
                this._clearCache();
            }
        }
    });

    const getSharedStyles = (isDarkMode) => `
        :host {
            --background: ${isDarkMode ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)'};
            --foreground: ${isDarkMode ? 'hsl(0 0% 98%)' : 'hsl(240 10% 3.9%)'};
            --muted-foreground: ${isDarkMode ? 'hsl(240 3.7% 62.9%)' : 'hsl(240 3.7% 45.9%)'};
            --card: ${isDarkMode ? 'hsl(240 4.8% 12%)' : 'hsl(0 0% 100%)'};
            --border: ${isDarkMode ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 5.9% 90%)'};
            --input: ${isDarkMode ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 5.9% 90%)'};
            --primary: ${isDarkMode ? 'hsl(0 0% 98%)' : 'hsl(240 5.9% 10%)'};
            --primary-foreground: ${isDarkMode ? 'hsl(240 5.9% 10%)' : 'hsl(0 0% 98%)'};
            --secondary: ${isDarkMode ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 4.9% 95.9%)'};
            --secondary-foreground: ${isDarkMode ? 'hsl(0 0% 98%)' : 'hsl(240 5.9% 10%)'};
            --destructive: ${isDarkMode ? 'hsl(0 72% 51%)' : 'hsl(0 84.2% 60.2%)'};
            --destructive-foreground: ${isDarkMode ? 'hsl(0 0% 98%)' : 'hsl(0 0% 98%)'};
            --constructive: ${isDarkMode ? 'hsl(142.1 70.6% 45.1%)' : 'hsl(142.1 76.2% 41.2%)'};
            --constructive-foreground: ${isDarkMode ? 'hsl(144.9 80.4% 10%)' : 'hsl(0 0% 98%)'};
            --overlay-bg: ${isDarkMode ? 'hsl(240 10% 3.9% / 0.5)' : 'hsl(0 0% 100% / 0.5)'};
        }
        .overlay {
            position: fixed; inset: 0; z-index: 2147483647;
            background-color: var(--overlay-bg);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: flex; justify-content: center; align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .dialog {
            background-color: var(--card); color: var(--foreground); border: 1px solid var(--border);
            border-radius: 0.75rem; max-width: 90vw;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            animation: fadeIn 0.2s ease-out;
            display: flex; flex-direction: column;
        }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .header { padding: 1.5rem; font-size: 1.125rem; font-weight: 600; border-bottom: 1px solid var(--border); }
        .content { padding: 1.5rem; }
        .footer { padding: 1.5rem; border-top: 1px solid var(--border); display: flex; gap: 0.75rem; }
        .input {
            flex-grow: 1; padding: 0.5rem 0.75rem; border: 1px solid var(--input);
            border-radius: 0.375rem; background-color: var(--background);
            color: var(--foreground); box-sizing: border-box;
        }
        .btn {
            padding: 0.5rem 1rem; border-radius: 0.375rem; border: none;
            cursor: pointer; font-weight: 500;
        }
        .btn-primary { background-color: var(--primary); color: var(--primary-foreground); }
        .btn-constructive { background-color: var(--constructive); color: var(--constructive-foreground); }
    `;

    const createManagementDialog = async (manager, title) => {
        document.querySelector('.popup-manager-container')?.remove();

        const container = document.createElement('div');
        container.className = 'popup-manager-container';
        const shadow = container.attachShadow({ mode: 'open' });
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const patterns = await manager.getAll();

        const style = document.createElement('style');
        style.textContent = `
            ${getSharedStyles(isDarkMode)}
            .dialog { width: 600px; max-height: 80vh; }
            .content { flex-grow: 1; overflow-y: auto; max-height: 50vh; }
            .pattern-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-radius: 0.5rem; gap: 1rem; }
            .pattern-item:nth-child(odd) { background-color: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}; }
            .pattern-text { font-family: monospace; font-size: 0.875rem; flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .btn-icon { background: none; border: none; cursor: pointer; padding: 0.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s; }
            .btn-icon:hover { background-color: ${isDarkMode ? 'rgba(255, 82, 82, 0.2)' : 'rgba(220, 53, 69, 0.1)'}; }
            .btn-icon svg { stroke: var(--muted-foreground); transition: stroke 0.2s; }
            .btn-icon:hover svg { stroke: var(--destructive); }
        `;

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = `
            <div class="dialog">
                <div class="header">${title}</div>
                <div class="content"></div>
                <div class="footer">
                    <input type="text" class="input" placeholder="e.g., *.google.com/*">
                    <button class="btn btn-primary">Add</button>
                </div>
            </div>
        `;

        const dialog = overlay.querySelector('.dialog');
        const content = dialog.querySelector('.content');
        const addInput = dialog.querySelector('.input');

        const renderList = () => {
            content.innerHTML = '';
            patterns.sort();
            patterns.forEach(pattern => {
                const item = document.createElement('div');
                item.className = 'pattern-item';
                item.innerHTML = `
                    <span class="pattern-text" title="${pattern}">${pattern}</span>
                    <button class="btn-icon" title="Remove">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                `;
                item.querySelector('.btn-icon').onclick = async () => {
                    const index = patterns.indexOf(pattern);
                    if (index > -1) patterns.splice(index, 1);
                    await manager.remove(pattern);
                    renderList();
                };
                content.appendChild(item);
            });
        };

        dialog.querySelector('.btn-primary').onclick = async () => {
            const newPattern = addInput.value.trim();
            if (newPattern && !patterns.includes(newPattern)) {
                patterns.push(newPattern);
                await manager.add(newPattern);
                addInput.value = '';
                renderList();
            }
        };

        overlay.onclick = (e) => { if (e.target === overlay) container.remove(); };
        dialog.onclick = (e) => e.stopPropagation();

        renderList();
        shadow.append(style, overlay);
        document.body.appendChild(container);
    };

    const createPopupDialog = ({ url, onAllow }) => {
        document.querySelector('.popup-blocker-container')?.remove();
        const container = document.createElement('div');
        container.className = 'popup-blocker-container';
        const shadow = container.attachShadow({ mode: 'open' });
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const targetUrl = new URL(url);
        const targetDomain = targetUrl.hostname;
        const targetPath = targetUrl.pathname;

        const style = document.createElement('style');
        style.textContent = `
            ${getSharedStyles(isDarkMode)}
            .dialog { width: 400px; }
            .header { text-align: center; }
            .title { font-size: 1.125rem; font-weight: 600; }
            .description { font-size: 0.875rem; color: var(--muted-foreground); margin-top: 0.25rem; }
            .content { padding: 0 1.5rem 1.5rem; }
            .url-display { font-size: 0.8rem; background-color: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}; padding: 0.5rem 0.75rem; border-radius: 0.375rem; word-break: break-all; max-height: 90px; overflow-y: auto; text-align: left; border: 1px solid var(--border); }
            .footer { flex-direction: column; }
            .btn { width: 100%; padding: 0.6rem; border: 1px solid transparent; }
            .btn-secondary { background-color: var(--secondary); color: var(--secondary-foreground); border-color: var(--border); }
            .btn-destructive { background-color: var(--destructive); color: var(--destructive-foreground); }
            .initial-buttons, .input-container { display: flex; flex-direction: column; gap: 0.75rem; }
            .input-container { display: none; margin-top: 0.5rem; animation: slideDown 0.3s ease-out; }
            @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            .input-header { display: flex; justify-content: flex-end; margin-bottom: 0.5rem; }
            .btn-back { background: none; border: none; color: var(--muted-foreground); cursor: pointer; font-size: 0.875rem; padding: 0.25rem; }
            .input { width: 100%; margin-bottom: 0.5rem; }
        `;

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = `
            <div class="dialog">
                <div class="header">
                    <div class="title">Popup Request</div>
                    <div class="description">A script is trying to open a new tab.</div>
                </div>
                <div class="content">
                    <div class="url-display">${url}</div>
                </div>
                <div class="footer">
                    <button class="btn btn-primary btn-allow-once">Allow Once</button>
                    <div class="initial-buttons">
                        <button class="btn btn-secondary btn-show-whitelist">Always Allow...</button>
                        <button class="btn btn-secondary btn-show-blocklist">Always Block...</button>
                    </div>
                    <div class="input-container whitelist-input-container">
                        <div class="input-header"><button class="btn-back">← Back</button></div>
                        <input type="text" class="input" value="${targetDomain}${targetPath === '/' ? '/*' : ''}">
                        <button class="btn btn-constructive btn-confirm-whitelist">Allow & Add to Whitelist</button>
                    </div>
                    <div class="input-container blocklist-input-container">
                        <div class="input-header"><button class="btn-back">← Back</button></div>
                        <input type="text" class="input" value="${targetDomain}">
                        <button class="btn btn-destructive btn-confirm-blocklist">Block & Add to Blocklist</button>
                    </div>
                </div>
            </div>
        `;

        const dialog = overlay.querySelector('.dialog');
        const removeDialog = () => container.remove();

        const initialButtons = dialog.querySelector('.initial-buttons');
        const whitelistContainer = dialog.querySelector('.whitelist-input-container');
        const blocklistContainer = dialog.querySelector('.blocklist-input-container');
        const whitelistInput = whitelistContainer.querySelector('.input');
        const blocklistInput = blocklistContainer.querySelector('.input');

        const showInitialButtons = () => {
            initialButtons.style.display = 'flex';
            whitelistContainer.style.display = 'none';
            blocklistContainer.style.display = 'none';
        };

        const showInputContainer = (containerToShow, inputToFocus) => {
            initialButtons.style.display = 'none';
            containerToShow.style.display = 'block';
            inputToFocus.focus();
            inputToFocus.select();
        };

        dialog.querySelector('.btn-allow-once').onclick = () => { onAllow(); removeDialog(); };
        initialButtons.querySelector('.btn-show-whitelist').onclick = () => showInputContainer(whitelistContainer, whitelistInput);
        initialButtons.querySelector('.btn-show-blocklist').onclick = () => showInputContainer(blocklistContainer, blocklistInput);
        whitelistContainer.querySelector('.btn-back').onclick = showInitialButtons;
        blocklistContainer.querySelector('.btn-back').onclick = showInitialButtons;

        dialog.querySelector('.btn-confirm-whitelist').onclick = async () => {
            const pattern = whitelistInput.value.trim();
            if (pattern) {
                await whitelistManager.add(pattern);
                onAllow();
                removeDialog();
            }
        };

        dialog.querySelector('.btn-confirm-blocklist').onclick = async () => {
            const pattern = blocklistInput.value.trim();
            if (pattern) {
                await blocklistManager.add(pattern);
                removeDialog();
            }
        };

        overlay.onclick = (e) => { if (e.target === overlay) removeDialog(); };
        dialog.onclick = (e) => e.stopPropagation();

        shadow.append(style, overlay);
        document.body.appendChild(container);
    };

    const createImportExportDialog = async () => {
        document.querySelector('.popup-manager-container')?.remove();

        const container = document.createElement('div');
        container.className = 'popup-manager-container';
        const shadow = container.attachShadow({ mode: 'open' });
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const style = document.createElement('style');
        style.textContent = `
            ${getSharedStyles(isDarkMode)}
            .dialog { width: 600px; }
            .content { display: flex; flex-direction: column; gap: 1.5rem; }
            .section-title { font-weight: 500; margin-bottom: 0.5rem; }
            .textarea {
                width: 100%; min-height: 120px; box-sizing: border-box;
                padding: 0.5rem 0.75rem; border: 1px solid var(--input);
                border-radius: 0.375rem; background-color: var(--background);
                color: var(--foreground); font-family: monospace; resize: vertical;
            }
            .footer { justify-content: flex-end; }
            .status-message { font-size: 0.875rem; margin-top: 0.5rem; }
            .success { color: var(--constructive); }
            .error { color: var(--destructive); }
        `;

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = `
            <div class="dialog">
                <div class="header">Import / Export Lists</div>
                <div class="content">
                    <div>
                        <div class="section-title">Export</div>
                        <textarea class="textarea export-area" readonly></textarea>
                        <div class="footer">
                            <button class="btn btn-primary btn-copy">Copy to Clipboard</button>
                        </div>
                    </div>
                    <div>
                        <div class="section-title">Import (Merges with existing)</div>
                        <textarea class="textarea import-area" placeholder="Paste your JSON data here..."></textarea>
                        <div class="import-status"></div>
                        <div class="footer">
                            <button class="btn btn-constructive btn-import">Import</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        shadow.append(style, overlay);

        const dialog = overlay.querySelector('.dialog');
        const exportArea = dialog.querySelector('.export-area');
        const importArea = dialog.querySelector('.import-area');
        const copyBtn = dialog.querySelector('.btn-copy');
        const importBtn = dialog.querySelector('.btn-import');
        const importStatus = dialog.querySelector('.import-status');

        const populateExport = async () => {
            const data = {
                whitelist: await whitelistManager.getAll(),
                blocklist: await blocklistManager.getAll()
            };
            exportArea.value = JSON.stringify(data, null, 2);
        };
        populateExport();

        copyBtn.onclick = async () => {
            try {
                await navigator.clipboard.writeText(exportArea.value);
                copyBtn.textContent = 'Copied!';
            } catch (err) {
                copyBtn.textContent = 'Failed!';
                console.error('BlockPup: Failed to copy text: ', err);
            } finally {
                setTimeout(() => { copyBtn.textContent = 'Copy to Clipboard'; }, 2000);
            }
        };

        importBtn.onclick = async () => {
            const jsonString = importArea.value.trim();
            if (!jsonString) {
                importStatus.innerHTML = `<p class="status-message error">Text area is empty.</p>`;
                return;
            }

            try {
                const data = JSON.parse(jsonString);
                if (!Array.isArray(data.whitelist) || !Array.isArray(data.blocklist)) {
                     throw new Error("Invalid data structure. 'whitelist' and 'blocklist' must be arrays.");
                }
                const currentWhitelist = await whitelistManager.getAll();
                const currentBlocklist = await blocklistManager.getAll();

                const mergedWhitelist = [...new Set([...currentWhitelist, ...data.whitelist])];
                const mergedBlocklist = [...new Set([...currentBlocklist, ...data.blocklist])];

                await whitelistManager.replaceAll(mergedWhitelist);
                await blocklistManager.replaceAll(mergedBlocklist);

                const addedWhitelistCount = mergedWhitelist.length - currentWhitelist.length;
                const addedBlocklistCount = mergedBlocklist.length - currentBlocklist.length;

                importStatus.innerHTML = `<p class="status-message success">Merge successful! Added ${addedWhitelistCount} whitelist and ${addedBlocklistCount} blocklist patterns.</p>`;
                setTimeout(() => container.remove(), 2500);
            } catch (e) {
                importStatus.innerHTML = `<p class="status-message error">Error: ${e.message}</p>`;
            }
        };

        overlay.onclick = (e) => { if (e.target === overlay) container.remove(); };
        dialog.onclick = (e) => e.stopPropagation();

        document.body.appendChild(container);
    };

    const whitelistManager = createPatternManager('popup_whitelist_patterns', ['localhost', '127.0.0.1']);
    const blocklistManager = createPatternManager('popup_blocklist_patterns');
    const originalOpenFunctions = new WeakMap();

    const decideOnPopup = async (url, name, features, openCallback) => {
        let fullUrl;
        try {
            fullUrl = (!url || String(url).trim().toLowerCase().startsWith('about:'))
                ? 'about:blank'
                : new URL(url, window.location.origin).href;
        } catch (e) {
            console.warn('BlockPup: Invalid URL passed to open():', url, e);
            return null;
        }

        if (await blocklistManager.isMatch(fullUrl)) {
            console.log(`BlockPup: Blocked popup to "${fullUrl}" by blocklist.`);
            return null;
        }

        if (await whitelistManager.isMatch(fullUrl)) {
            return openCallback(url, name, features);
        }

        createPopupDialog({
            url: fullUrl,
            onAllow: () => openCallback(url, name, features)
        });

        return null;
    };

    const patchWindow = (win) => {
        if (!win || originalOpenFunctions.has(win)) return;

        try {
            const originalOpen = win.open;
            if (typeof originalOpen !== 'function') return;

            originalOpenFunctions.set(win, originalOpen);

            const hijacker = function(...args) {
                return decideOnPopup(...args, originalOpen.bind(this));
            };

            Object.defineProperty(win, 'open', {
                value: hijacker,
                writable: true,
                configurable: true
            });
        } catch (e) {
            // Fails for cross-origin iframes, which is expected.
        }
    };

    const initializePopupInterceptor = () => {
        patchWindow(unsafeWindow);

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.tagName === 'IFRAME') {
                        node.addEventListener('load', () => patchWindow(node.contentWindow), { once: true, passive: true });
                        patchWindow(node.contentWindow);
                    }
                }
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });

        const interceptEvent = (e) => {
            const target = e.target;
            let url = null;

            let baseTargetIsBlank = null;
            const getBaseTargetIsBlank = () => {
                if (baseTargetIsBlank === null) {
                    baseTargetIsBlank = !!document.querySelector('base[target="_blank"]');
                }
                return baseTargetIsBlank;
            };

            const link = target.closest('a');
            if (link && link.href) {
                if (link.target === '_blank' || (getBaseTargetIsBlank() && !link.hasAttribute('target'))) {
                    url = link.href;
                }
            }

            const form = target.closest('form');
            if (!url && form && form.action) {
                if (form.target === '_blank' || (getBaseTargetIsBlank() && !form.hasAttribute('target'))) {
                    url = form.action;
                }
            }

            if (url) {
                e.preventDefault();
                e.stopImmediatePropagation();
                const originalMainWindowOpen = originalOpenFunctions.get(unsafeWindow);
                if (originalMainWindowOpen) {
                    decideOnPopup(url, '_blank', null, originalMainWindowOpen.bind(unsafeWindow));
                }
            }
        };

        document.addEventListener('click', interceptEvent, true);
        document.addEventListener('submit', interceptEvent, true);
    };

    initializePopupInterceptor();
    GM_registerMenuCommand('Manage Whitelist', () => createManagementDialog(whitelistManager, 'Manage Whitelist Patterns'));
    GM_registerMenuCommand('Manage Blocklist', () => createManagementDialog(blocklistManager, 'Manage Blocklist Patterns'));
    GM_registerMenuCommand('Import/Export Lists', createImportExportDialog);

})();