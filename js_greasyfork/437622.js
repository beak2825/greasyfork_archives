// ==UserScript==
// @name         Back2source
// @version      0.1.159
// @description  Redirecting to source sites from sites with machine translation, etc.
// @namespace    vladgba
// @author       vladgba@gmail.com
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @homepageURL  https://github.com/vladgba/Back2source
// @supportURL   https://github.com/vladgba/Back2source/issues
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.browser.yandex.ru
// @connect      api.github.com
// @connect      api.stackexchange.com
// @noframes
// @match        *://*.16892.net/qa/*
// @match        *://*.1r1g.com/sf/ask/*
// @match        *://*.360wiki.ru/wiki/*
// @match        *://*.55276.net/qa/*
// @match        *://*.5axxw.com/*/*/*
// @match        *://*.955yes.com/ask/1*.html
// @match        *://*.9ishenzhen.com/?qa=*
// @match        *://*.abcdef.wiki/*
// @match        *://*.amuddycup.com/*
// @match        *://*.androidalle.com/pregunta/*
// @match        *://*.androiderrors.com/*
// @match        *://*.androidrepo.com/repo/*
// @match        *://*.answacode.com/*
// @match        *://*.answeright.com/*
// @match        *://*.answerlib.com/question/*
// @match        *://*.answerspoint.com/questions/*/*
// @match        *://*.antwortenhier.me/*
// @match        *://*.anycodings.com/*
// @match        *://*.ape-ask.com/read-*.html
// @match        *://*.appsloveworld.com/*/*
// @match        *://*.arip-photo.org/*
// @match        *://*.ask-dev.ru/info/*
// @match        *://*.ask-ubuntu.ru/questions/*
// @match        *://*.ask.roboflow.ai/question/*
// @match        *://*.askcodez.com/*
// @match        *://*.askdev.info/questions/*
// @match        *://*.askdev.ru/q*
// @match        *://*.askdevz.com/question/*
// @match        *://*.askentire.net/q/*-*
// @match        *://*.askfrance.me/*
// @match        *://*.askubuntu.ru/questions/*
// @match        *://*.askvoprosy.com/voprosy/*
// @match        *://*.astrophel.org/*
// @match        *://*.athabasca-foto.com/*
// @match        *://*.awesomeopensource.com/project/*
// @match        *://*.bcqaw.com/*.html
// @match        *://*.bestofcpp.com/repo/*
// @match        *://*.bestofphp.com/repo/*
// @match        *://*.bestofreactjs.com/repo/*
// @match        *://*.bestofvue.com/repo/*
// @match        *://*.bildiredi.com/*
// @match        *://*.bilee.com/*.html
// @match        *://*.binarydevelop.com/article/*
// @match        *://*.bleepcoder.com/*/*
// @match        *://*.bootpanic.com/*
// @match        *://*.buildwiki.ru/wiki/*
// @match        *://*.bytemeta.vip/*
// @match        *://*.cache.one/read/*
// @match        *://*.cainiaojiaocheng.com/questions/*
// @match        *://*.catchconsole.com/code-example/*
// @match        *://*.catwolf.org/qs*
// @match        *://*.cepe-eua.org/*/*
// @match        *://*.cfadnc.org/*
// @match        *://*.chowdera.com/*.html
// @match        *://*.ciupacabra.com/*
// @match        *://*.cloud.tencent.com/developer/ask/*
// @match        *://*.cmsdk.com/*/*.html
// @match        *://*.cndgn.com/question/*
// @match        *://*.code-error.com/*
// @match        *://*.code-examples.net/*/q/*
// @match        *://*.code-hint.com/en/*
// @match        *://*.code.i-harness.com/*/q/*
// @match        *://*.codebug.zone/*
// @match        *://*.codefactor.io/repository/*
// @match        *://*.codefaq.info/*
// @match        *://*.codefaq.ru/*
// @match        *://*.codefordev.com/discuss/*/*
// @match        *://*.codegear.dev/*/questions/*
// @match        *://*.codegrepper.com/code-examples/*
// @match        *://*.codegrepr.com/question/*
// @match        *://*.codeguides.site/questions/*
// @match        *://*.codehunter.cc/*
// @match        *://*.codengineering.net/q/*
// @match        *://*.codengineering.ru/q/*
// @match        *://*.codenong.com/*
// @match        *://*.codepudding.com/*/*.html
// @match        *://*.coder-question-ko.com/cq-ko-blog/*
// @match        *://*.coder-question.com/cq-blog/*
// @match        *://*.coder.social/*
// @match        *://*.coder.work/article/*
// @match        *://*.coderoad.in/questions/*
// @match        *://*.coderoad.ru/*
// @match        *://*.coderquestion.ru/q/*
// @match        *://*.codespots.com/library/item/*
// @match        *://*.codetd.com/article/*
// @match        *://*.codeutility.org/*
// @match        *://*.coredump.biz/questions/*
// @match        *://*.culinarydegree.info/*
// @match        *://*.curatedgo.com/r/*/index.html
// @match        *://*.dailydevsblog.com/troubleshoot/*
// @match        *://*.daplus.net/*
// @match        *://*.datewiki.ru/wiki/*
// @match        *://*.de-vraag.com/*
// @match        *://*.debugcn.com/*article/*
// @match        *://*.debugko.com/article/*
// @match        *://*.dev-answers.com/solutions/*
// @match        *://*.devasking.com/issue/*
// @match        *://*.devdreamz.com/question/*
// @match        *://*.devebee.com/answer/*
// @match        *://*.develop-bugs.com/article/*
// @match        *://*.developreference.com/article/*
// @match        *://*.devfaq.fr/question/*
// @match        *://*.devtip.in/*/*
// @match        *://*.digitrain.ru/questions/*
// @match        *://*.dir.md/*
// @match        *://*.dokry.com/*
// @match        *://*.domainelespailles.net/*
// @match        *://*.donolik.com/*
// @match        *://*.doraprojects.net/questions/*
// @match        *://*.dtuto.com/questions/*/*
// @match        *://*.duhoctrungquoc.vn/wiki/*/*
// @match        *://*.duoduokou.com/*/*.html
// @match        *://*.e-learn.cn/topic/*
// @match        *://*.ec-europe.org/*
// @match        *://*.ecnf2016.org/*
// @match        *://*.editcode.net/article-*
// @match        *://*.edupro.id/questions/*
// @match        *://*.edureka.co/community/*/*
// @match        *://*.elfishgene.com/*
// @match        *://*.encyclopaedia.bid/*
// @match        *://*.encyclopedia.thefreedictionary.com/*
// @match        *://*.errorsandanswers.com/*
// @match        *://*.errorsfixing.com/*
// @match        *://*.exchangetuts.com/*-*
// @match        *://*.explained.today/*
// @match        *://*.extutorial.com/ask/*
// @match        *://*.faithcov.org/*
// @match        *://*.fantashit.com/*
// @match        *://*.findatwiki.com/*
// @match        *://*.findbestopensource.com/product/*
// @match        *://*.firstlightsalon.in/*/questions/*
// @match        *://*.fitforlearning.org/*
// @match        *://*.fixes.pub/*/*.html
// @match        *://*.fluffyfables.com/*
// @match        *://*.flutterhq.com/questions-and-answers/*
// @match        *://*.flutterrepos.com/lib/*
// @match        *://*.frwiki.wiki/wiki/*
// @match        *://*.fullstackuser.com/questions/*
// @match        *://*.gaz.wiki/wiki/*
// @match        *://*.geek-tips.imtqy.com/articles/*/*.html
// @match        *://*.geeksrepos.com/*
// @match        *://*.generacodice.com/*
// @match        *://*.getridbug.com/*/*
// @match        *://*.ghcc.net/*
// @match        *://*.gitanswer.net/*
// @match        *://*.gitcode.net/*
// @match        *://*.gitdetail.com/repositories/*
// @match        *://*.giters.com/*
// @match        *://*.gitfreak.com/*
// @match        *://*.githubhelp.com/*
// @match        *://*.githubhot.com/*
// @match        *://*.githublab.com/*/*
// @match        *://*.githubmemory.com/*
// @match        *://*.githubplus.com/*
// @match        *://*.gitrush.ru/*/*/*
// @match        *://*.globalwikionline.com/detial/*/*
// @match        *://*.golangd.com/g/*
// @match        *://*.golangexample.com/*
// @match        *://*.golangrepo.com/repo/*
// @match        *://*.gupgallery.com/*
// @match        *://*.helpex.vn/question/*
// @match        *://*.higithub.com/*/*
// @match        *://*.hmong.ru/wiki/*
// @match        *://*.hmong.wiki/wiki/*
// @match        *://*.howtobuildsoftware.com/index.php/how-do/*
// @match        *://*.howtosolves.com/q/*
// @match        *://*.html-agility-pack.net/knowledge-base/*
// @match        *://*.husl.ru/questions/*
// @match        *://*.ichi.pro/*
// @match        *://*.icode9.com/*
// @match        *://*.icopy.site/questions/*
// @match        *://*.idqna.com/question/*
// @match        *://*.im-coder.com/*.html
// @match        *://*.intellipaat.com/community/*
// @match        *://*.intrepidgeeks.com/tutorial/*
// @match        *://*.ipgirl.com/*
// @match        *://*.iquestion.pro/q/*
// @match        *://*.isolution.pro/q/*
// @match        *://*.issue.life/questions/*
// @match        *://*.issueantenna.com/*/*
// @match        *://*.issuehint.com/issue/*/*/*
// @match        *://*.it-brain.online/question/*
// @match        *://*.it1352.com/*.html
// @match        *://*.itbaoku.cn/post/*.html
// @match        *://*.itdaan.com/*
// @match        *://*.itecnote.com/tecnote/*
// @match        *://*.itectec.com/*/*
// @match        *://*.itnan.ru/post.php*
// @match        *://*.itranslater.com/qa/details/*
// @match        *://*.jablogs.com/detail/*
// @match        *://*.javacodexamples.com/examples/*
// @match        *://*.javaer101.com/*/*
// @match        *://*.javafixing.com/*/*/*.html
// @match        *://*.javarepos.com/lib/*
// @match        *://*.jejakjabar.com/wiki/*
// @match        *://*.jike.in/*-1.html
// @match        *://*.jike.in/qa/*
// @match        *://*.jonic.cn/qa/*
// @match        *://*.jpdebug.com/p/*
// @match        *://*.jscodetips.com/examples/*
// @match        *://*.jsrepos.com/*/*
// @match        *://*.juejin.cn/post/*
// @match        *://*.knews.vip/q/*
// @match        *://*.kompsekret.ru/q/*
// @match        *://*.kotaeta.com/*
// @match        *://*.kutombawewe.net/*/*
// @match        *://*.learn-codes.net/*/*
// @match        *://*.learnfk.com/*question/*
// @match        *://*.legkovopros.ru/questions/*
// @match        *://*.libraries.io/*/*
// @match        *://*.lifesaver.codes/answer/*
// @match        *://*.lightrun.com/answers/*
// @match        *://*.linuxfixes.com/*/*/*
// @match        *://*.livepcwiki.ru/wiki/*
// @match        *://*.living-sun.com/*/*
// @match        *://*.localcoder.org/*
// @match        *://*.macosrepo.com/software/*
// @match        *://*.manongdao.com/*.html
// @match        *://*.mediatagtw.com/*/*
// @match        *://*.mediawiki.feverous.co.uk/index.php/*
// @match        *://*.messiahlebanon.org/*
// @match        *://*.microeducate.tech/*
// @match        *://*.mlink.in/qa/*
// @match        *://*.mlog.club/article/*
// @match        *://*.narkive.jp/*
// @match        *://*.newbedev.com/*
// @match        *://*.newdevzone.com/posts/*
// @match        *://*.nina.az/wiki/*
// @match        *://*.noblenaz.org/*
// @match        *://*.npm.io/package/*
// @match        *://*.npmmirror.com/package/*
// @match        *://*.ntcdoon.org/*
// @match        *://*.nuomiphp.com/*/*
// @match        *://*.nwikiit.cyou/wiki/*
// @match        *://*.ogeek.cn/*-1.html
// @match        *://*.ogeek.cn/qa/*
// @match        *://*.opensourcelibs.com/lib/*
// @match        *://*.ostack.cn/*-1.html
// @match        *://*.ostack.cn/qa/*
// @match        *://*.ounapuu.ee/*/*
// @match        *://*.ourladylakes.org/*
// @match        *://*.overcoder.net/q/*
// @match        *://*.overcoder.ru/q/*
// @match        *://*.overstack.in/*-1.html
// @match        *://*.overstack.in/qa/*
// @match        *://*.pakostnici.com/*
// @match        *://*.panaindustrial.com/*
// @match        *://*.pcbconline.org/*
// @match        *://*.pengembangan-web-mp-pd.com/id/*
// @match        *://*.phptime.ru/questions/*
// @match        *://*.poweruser.guru/*
// @match        *://*.prog-help.ru/*
// @match        *://*.progi.pro/*
// @match        *://*.programmierfrage.com/items/*
// @match        *://*.programming-articles.com/*
// @match        *://*.projectbackpack.org/*
// @match        *://*.proubuntu.ru/*/*
// @match        *://*.pyquestions.com/*
// @match        *://*.python2.net/questions-*.htm
// @match        *://*.pythonawesome.com/*
// @match        *://*.pythonfixing.com/*.html
// @match        *://*.pythonlang.dev/repo/*
// @match        *://*.pythonrepo.com/repo/*
// @match        *://*.qa-stack.pl/*
// @match        *://*.qandeelacademy.com/questions/*
// @match        *://*.qapicks.com/question/*
// @match        *://*.qarchive.ru/*
// @match        *://*.qaru.tech/questions/*
// @match        *://*.qarus.ru/*
// @match        *://*.qastack.in.th/*
// @match        *://*.qastack.info.tr/*
// @match        *://*.qastack.net.bd/*
// @match        *://*.qi-u.com/*-1.html
// @match        *://*.qi-u.com/qa/*
// @match        *://*.quabr.com/*
// @match        *://*.querythreads.com/*
// @match        *://*.question-it.com/questions/*
// @match        *://*.questu.ru/questions/*
// @match        *://*.reddit.fun/*/*
// @match        *://*.reposhub.com/*/*
// @match        *://*.respuestas.me/*
// @match        *://*.rotadev.com/*
// @match        *://*.routinepanic.com/questions/*
// @match        *://*.ru.encyclopedia.kz/index.php/*
// @match        *://*.rudata.ru/wiki/*
// @match        *://*.runebook.dev/*/docs/*
// @match        *://*.ruphp.com/*.html
// @match        *://*.rustrepo.com/repo/*
// @match        *://*.safehavenpetrescue.org/*
// @match        *://*.savepearlharbor.com/?p=*
// @match        *://*.sbup.com/wiki/*
// @match        *://*.sch22.org/*
// @match        *://*.secret-bases.co.uk/wiki/*
// @match        *://*.semicolonworld.com/question/*
// @match        *://*.serveanswer.com/issue/*
// @match        *://*.server-fault.ru/questions/*
// @match        *://*.shenghuobao.net/qa/*
// @match        *://*.shenzhenjia.cn/qa/*
// @match        *://*.shenzhenjia.net/qa/*
// @match        *://*.sierrasummit2005.org/*
// @match        *://*.siwib.org/*
// @match        *://*.smnggeophysics.com/*
// @match        *://*.snyk.io/advisor/npm-package/*
// @match        *://*.sobrelinux.info/questions/*
// @match        *://*.socket.dev/npm/package/*
// @match        *://*.softbranchdevelopers.com/*
// @match        *://*.softwareuser.asklobster.com/posts/*
// @match        *://*.soinside.com/question/*
// @match        *://*.solusi.cyou/*/*
// @match        *://*.solveforum.com/forums/threads/*
// @match        *://*.sprosi.pro/questions/*
// @match        *://*.sqlite.in/*-1.html
// @match        *://*.sqlite.in/qa/*
// @match        *://*.stackanswers.net/questions/*
// @match        *://*.stackfinder.jp.net/questions/*
// @match        *://*.stackfinder.ru/questions/*
// @match        *://*.stackguides.com/questions/*
// @match        *://*.stackify.dev/*
// @match        *://*.stackoom.com/*question/*
// @match        *://*.stackoverflood.com/*
// @match        *://*.stackoverflowpoint.com/question/*
// @match        *://*.stackovergo.com/*q/*
// @match        *://*.stackru.com/questions/*
// @match        *://*.string.quest/read/*
// @match        *://*.sunflowercreations.org/*
// @match        *://*.super-unix.com/*/*
// @match        *://*.swiftobc.com/repo/*
// @match        *://*.switch-case.com/*
// @match        *://*.syntaxfix.com/question/*
// @match        *://*.sysadminde.com/questions/*
// @match        *://*.techarks.ru/qa/*
// @match        *://*.techfeed.net/*
// @match        *://*.techhelpnotes.com/*
// @match        *://*.techinplanet.com/*
// @match        *://*.territorioscuola.it/*
// @match        *://*.thecodeteacher.com/question/*
// @match        *://*.theshuggahpies.com/*
// @match        *://*.thinbug.com/q/*
// @match        *://*.tipsfordev.com/*
// @match        *://*.tistory.com/*
// @match        *://*.tousu.in/qa/*
// @match        *://*.tracholar.top/*/*/*/*
// @match        *://*.try2explore.com/*
// @match        *://*.tutorialguruji.com/*/*
// @match        *://*.tutorialink.com/*
// @match        *://*.tutorialmeta.com/question/*
// @match        *://*.tutorialmore.com/questions-*
// @match        *://*.twblogs.net/a/*
// @match        *://*.ubuntuaa.com/*q/*
// @match        *://*.ubuntuplace.info/questions/*
// @match        *://*.utyatnishna.ru/info/*
// @match        *://*.uwenku.com/question/*
// @match        *://*.v-resheno.ru/*
// @match        *://*.vigge.cn/qa/*
// @match        *://*.vigge.net/qa/*
// @match        *://*.vigges.net/qa/*
// @match        *://*.voidcc.com/question/*
// @match        *://*.vuejscode.com/*
// @match        *://*.vvikipedla.com/wiki/*
// @match        *://*.w3coded.com/questions/*/*
// @match        *://*.w3toppers.com/*
// @match        *://*.wake-up-neo.net/*/*
// @match        *://*.waymanamechurch.org/*
// @match        *://*.web-answers.ru/*/*
// @match        *://*.web-dev-qa-db-fra.com/fr/*
// @match        *://*.web-dev-qa-db-ja.com/ja/*
// @match        *://*.web-gelistirme-sc.com/tr/*
// @match        *://*.webdevdesigner.com/q*
// @match        *://*.webentwicklung-frage-antwort-db.com.de/de/*
// @match        *://*.wekeepcoding.com/article/*/*
// @match        *://*.wenyanet.com/opensource/*
// @match        *://*.while-do.com/*
// @match        *://*.wiki-org.ru/*
// @match        *://*.wiki-wiki.ru/wp/*
// @match        *://*.wiki.cologne/*
// @match        *://*.wiki2.info/*
// @match        *://*.wiki2.net/*
// @match        *://*.wiki2.org/*
// @match        *://*.wiki2.wiki/wiki/*
// @match        *://*.wiki5.ru/wiki/*
// @match        *://*.wikibrief.org/wiki/*
// @match        *://*.wikichi.ru/wiki/*
// @match        *://*.wikidark.ru/wiki/*
// @match        *://*.wikidea.ru/wiki/*
// @match        *://*.wikies.wiki/wiki/*
// @match        *://*.wikimho.com/*/q/*/*
// @match        *://*.wikipe.wiki/wiki/*
// @match        *://*.wikipedia-on-ipfs.org/wiki/*
// @match        *://*.wikipedia.tel/*
// @match        *://*.wikipedia24.ru/*
// @match        *://*.wikiredia.ru/*
// @match        *://*.wikiroot.ru/question/*
// @match        *://*.wikit.wiki/article/*/*
// @match        *://*.wikivisually.com/wiki/*
// @match        *://*.wikiwand.com/*/*
// @match        *://*.wikizero.com/*/*
// @match        *://*.wp-qa.com/*
// @match        *://*.wujigu.com/qa/*
// @match        *://*.xcv.wiki/*
// @match        *://*.xiu2.net/it/details/*
// @match        *://*.xsprogram.com/content/*
// @match        *://*.xstack.ru/qa/*
// @match        *://*.xstack.us/*-1.html
// @match        *://*.xstack.us/qa/*
// @match        *://*.xszz.org/*/question-*
// @match        *://*.yaoply.com/items/*
// @match        *://*.yingqusp.com/so/*
// @match        *://*.ylhow.com/*
// @match        *://*.younggeeks.in/questions/*
// @match        *://*.yuanmacha.com/*.html
// @match        *://*.zahn-info-portal.de/wiki/*
// @match        *://*.zaizhele.cn/qa/*
// @match        *://*.zaizhele.net/qa/*
// @match        *://*.zapytay.com/*
// @match        *://*.zsharp.org/*
// @match        *://*.zxc.wiki/wiki/*
// @match        *://*.zzun.app/repo/*
// @include      *://qastack.tld/*
// @downloadURL https://update.greasyfork.org/scripts/437622/Back2source.user.js
// @updateURL https://update.greasyfork.org/scripts/437622/Back2source.meta.js
// ==/UserScript==
/* jshint esversion: 10 */
/* eslint quotes: ['warn', 'single'] */
/* eslint userscripts/better-use-match: 'off' */
/* eslint no-fallthrough: 'off' */
(async () => {
    'use strict';

    var sitecolor = '#333';
    var lang = 'ru';
    var badCode = false;
    var badImgs = false;
    var _ = undefined;
    var ll, tt;
    const _p = location.pathname;
    const _ps = _p.split('/');
    const _h = location.href;
    const _se = ['stackoverflow.com','superuser.com','serverfault.com','stackapps.com','mathoverflow.net','askubuntu.com','stackexchange.com'];
    /** Checks if a given object is a string */
    var _$s = (s) => typeof s === 'string' || s instanceof String;
    /** Gets the subdomain (host part) of the site */
    var _hp = (p = 3) => (ll = location.hostname.split('.')) && ll[ll.length-p];
    /** Gets the element by a given selector */
    var _t = (s) => document.querySelector(s);
    /** Tests if the path of the site matches the given regex */
    var _c = (r) => r.test(_p);
    /** Redirects to a link, if it exists; checks for validity of the source site are bypassed */
    var _go = (s) => s && window.location.replace(s);
    /** Checks if a string is part of the hostname */
    var _hst = (s) => location.hostname.includes(s);
    /** Sets the color for the bottom bar, if it's not set */
    var clr = (c, f) => (sitecolor = (f || sitecolor == '#333') ? c : sitecolor);
    /** Sets the language for translating and searching, if it's not set */
    var lng = (c, f) => (lang = (f || lang == 'ru') ? c : lang);
    /** Gets the last part of a path */
    var lastPathPart = () => _ps.filter(Boolean).slice(-1)[0];
    /** Gets the href attribute (or any other attribute) of a selected element, if it exists */
    var bySel = (s, a = 'href') => _t(s)?.getAttribute(a);
    /** Removes the auxiliary words of the textcontent of: the header if no parameter is given; a element matching the given selector; the first element, if the parameter is an array*/
    var getHeader = (h) => removeAuxiliary(h ? (Array.isArray(h) ? h[0] : textContent(h)) : textContent('h1'));
    /** Get an array of the textcontent of: elements with the tag-class if no parameter is given; elements matching the given selector; or the first element, if the parameter is an array*/
    var getTags = (t) => t ? (Array.isArray(t) ? [t[0]] : allTexts(t)) : allTexts('.tag');
    /** Replaces in a string all occurrences of the first element of an arraygroup with the second */
    var mulReplace = (str, a) => a.forEach((v) => (str = str.replace(v[0], v[1]))) || str;
    /** Creates a Wikipedia link with language and article text or the number of the part in the website url, optionally adding the /wiki/ part */
    var wiki = (l = 0, p = 2, w = true) => 'https://' + (_$s(l) ? l : _ps[l]) + '.wikipedia.org' + (w ? '/wiki/' : '') + (_$s(p) ? p : _ps[p]);
    /** Creates a Github link with the project and repository */
    var github = (l) => l ? 'https://github.com' + l : null;
    /** Creates the bottom bar with the text, the code parts and images to search for */
    var prepareSearch = (h, t, s) => promptRedirect(sitecolor, toSearch(h + (t ? ' ' + getTags(t).join(' ').replace(/\s+/g, ' ') : ''), s), !badCode && allTexts('pre code'), !badImgs && [...new Set([...allAttr('img[src*="://i.stack.imgur.com/"]', 'src'), ...allAttr('a[href*="://i.stack.imgur.com/"]', 'href')])], s);
    /** Translates all tags given as an array */
    var transTags = async (t) => (await yaTranslate(allTexts(t).join(' '), lang)).split(' ');
    /** Creates the Google search link with the slightly aligned text to search for, the sites to search on, optionally searching for images */
    var toSearch = (s, site, i) => (s = dropMarks(s) && s && (ll = s.split(' ').filter(i => !i.match(/^(and|an|are|for|how|in|is|it|i|of|or|the|to)$/i)).length) ? 'https://google.com/search?q=' + (ll <= 32 ? encodeURIComponent(s) + '+' : '') + ((site && Array.isArray(site)) ? (site.length < 1 ? '' : 'site%3A' + site.join('+OR+site%3A')) : 'site%3Astackexchange.com+OR+site%3Astackoverflow.com') + (ll <= 32 ? '' : '+' + encodeURIComponent(s)) + (i ? '&tbm=isch' : '') : null);
    /** Gets the textcontent of a selected element, if it exists */
    var textContent = (s) => _t(s)?.textContent.trim();
    /** Creates StackOverflow link by article id, optionally mofifying it before */
    var byNumber = (s, radix) => (s = parseInt(s, radix)) && s > 0 ? 'https://stackoverflow.com/questions/' + s : null;
    /** Adds surrounding spaces and make the string lowercase, if it exists */
    var normalize = (s) => s && ' ' + s.toLowerCase() + ' ';
    /** Pipes multiple functions after each other */
    var pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
    /** Creates an array of the elements matched by given selector */
    var all = (s) => [...document.querySelectorAll(s)];
    /** Creates an array of the textcontent of all elements matched by given selector */
    var allTexts = (s) => all(s).map(a => a.textContent.trim());
    /** Creates an array of the attributes of all elements matched by given selector */
    var allAttr = (s, t) => all(s).map(a => a[t].trim());
    /** Gets the attribute of a given element, if it exists, and get a specific text part by regex or replace it with anoter text */
    var getAttr = (t, a, r, s = '$1') => (t.hasAttribute(a)) && t.getAttribute(a).replace(r, s);
    /** Removes marks of a string, if it exists */
    var dropMarks = (s) => s && s.replace(/\[(на удержании|on hold|duplikować|duplicado|duplicar|duplikat|dublicate|duplicate|дубликат|закрыто|закрытый|closed|geschlossen|zamknięte|cerrado|重复|repeat)\]\s*$/i, '').trim();
    /** Removes the beginning of a text that precedes a given part */
    var removePartBefore = (t, p) => textContent(t).replace(new RegExp('.*?'+ p), '');
    /** Returns text in parentheses **/
    var fromParentheses = (t) => (ll = t.split('(')) && (ll.length == 1 ? ll[0] : (ll.length == 2 ? ll[1] : ll.slice((ll.length - 2) / 2 + 1).join('(')).slice(0, -1));

    /** Gets the first link by a given selector, that links to a stack exchange site */
    function _tc(s) {
        var allw = _se.flatMap(i => [i+'/q', i+'/a/'])
        var nods = all(s);
        for (var nod in nods) for (var pt in allw) if(nods[nod]?.href?.indexOf(allw[pt])>=0) return nods[nod].href;
    }

    /** Gets the image url with the site where the image is from, optionally with by selector and cutting the path */
    function urlByImg(v, s = 'img[src*="/images/content/"]', n = 3) {
        var p = _t(s)?.src;
        if (!p) return;
        var l = (new URL(p)).pathname.split('/')[n];
        return l && (v + l);
    }

    var db = JSON.parse(GM_getValue('b2s') || '{}');
    for (var y in db) if (location.href == db[y][0]) return _go(db[y][1]);

    /** Adds the given JavaScript code as inline code to the opened site */
    function addJS(code) {
        var scriptElm = document.createElement('script');
        var inlineCode = document.createTextNode(code);
        scriptElm.appendChild(inlineCode);
        document.body.appendChild(scriptElm);
    }

    /** Replaces different quote variants, optionally removes them, replaces various control characters */
    function filterText(text, rmquotes) {
        var out = text.replace(/(\u02B9|\u0374|\u2018|\u201A|\u2039|\u203A|\u201B|\u2019)+/g, '\'').replace(/(\u00AB|\u00BB|\u201E|\u201C|\u201F|\u201D|\u2E42)+/g, '"');
        return (rmquotes ? out.replace(/(\'|")+/g, ' ') : out).replace(/ /g, ' ').replace(/(\r|\n)+/g, ' ').replace(/\s\s+/g, ' ').trim().replace(/\.$/, '').trim();
    }

    /** Creates the bottom bar to search for a question */
    async function promptRedirect(bgcolor, link, codef, imgf, site) {
        const dialog = document.createElement('div');
        try {
            document.body.appendChild(dialog);
            const shadowRoot = dialog.attachShadow ?
                  dialog.attachShadow({ mode: 'open' }) :
            //@ts-ignore
            dialog.createShadowRoot && dialog.createShadowRoot();
            if (!shadowRoot) throw 'Shadow dom required!';
            shadowRoot.innerHTML = `
<style>
:host{
    position: fixed;
    bottom: 0;
    z-index: 16777271;
    width: 100%;
    color: white;
    background-color: ${bgcolor}!important;
}
.m{
    padding: 14px;
    font-family: Ubuntu,Segoe UI,Optima,Trebuchet MS,-apple-system,BlinkMacSystemFont,sans-serif;
    font-size: 14px;
}
#close-btn{
    float: right;
    cursor: pointer;
}
a{
    color: white;
}
.search-icon{
    font-size: 24px;
    line-height: 0;
    text-decoration: none;
}
</style>
<div class="m">[ Back2Source ]
<a id="ok-btn" href="#">Try to find the original question? <span class="search-icon">&#8981;<span></a> ` +
                (codef && codef.length > 0 ? '<a href="' + toSearch(codef.join(' '), site) + '">[ByCode]</a>' : '') +
                (imgf && imgf.length > 0 ? '<a href="' + toSearch(imgf.join(' '), site, true) + '">[ByImgs]</a>' : '') +
                `<span id="close-btn">&#10006;</span>
</div>`;
            shadowRoot.querySelector('#ok-btn').href = link;
            await new Promise((_, reject) => {
                shadowRoot.querySelector('#close-btn').addEventListener('click', reject);
            });
        } finally {
            document.body.removeChild(dialog);
        }
    }

    //https://yandex.com/dev/translate/doc/dg/concepts/api-overview.html
    /** Translates a slightly aligned text with Yandex from one language to english or any other given language */
    async function yaTranslate(q, sourceLang, targetLang) {
        q = dropMarks(q);
        if (!q) return null;
        q = 'https://api.browser.yandex.ru/dictionary/translate?statLang=en&targetLang=' + (targetLang ? targetLang : 'en') + '&text=' + encodeURIComponent(q) + (sourceLang ? '&fromLang=' + sourceLang : '')
        try {
            //doesn't work in chrome
            return await fetch(q, {
                mode: 'no-cors',
                credentials: 'omit'
            })
                .then(r => r.json())
                .then(r => r.text);
        } catch (e) {
            //works only in tampermonkey
            return new Promise((resolve, reject) => {
                //@ts-ignore
                GM_xmlhttpRequest({
                    url: q,
                    responseType: 'json',
                    anonymous: true,
                    onload: (xhr) => {
                        xhr.status === 200 ? resolve(xhr.response.text) : reject(xhr);
                    },
                    onerror: reject
                })
            })
        }
    }

    var auxiliaryRe = null;

    /** Removes auxiliary words of a given string */
    function removeAuxiliary(s) {
        return s && s.replace(auxiliaryRe || (auxiliaryRe = new RegExp([
            'a', 'an', 'the',
            //Conjunctions http://englishgu.ru/soyuzyi-v-angliyskom-yazyike-tablitsa-spisok/
            //https://7esl.com/english-conjunctions/
            'according to', 'after', 'against', 'also', 'although', 'and', 'as far as', 'as if', 'as long as', 'as much as', 'as soon as', 'as though', 'as well as', 'as', 'assuming that', 'at last', 'at least', 'because of', 'because', 'before', 'beyond', 'both', 'but', 'by the time', 'either', 'even if', 'even though', 'for', 'from now on', 'from time to time', 'how', 'however', 'if', 'in case', 'in order', 'in spite of', 'in terms of', 'lest', 'like', 'meanwhile', 'moreover', 'neither', 'nevertheless', 'no matter how', 'no matter what', 'no matter when', 'no matter where', 'no matter who', 'no matter why', 'nor', 'not so as', 'not yet', 'now that', 'on behalf of', 'on condition', 'on the contrary', 'on the other hand', 'once', 'only if', 'or', 'otherwise', 'owing to', 'provided that', 'rather than', 'since', 'so that', 'so', 'still', 'than', 'that is why', 'that', 'therefore', 'though', 'thus', 'till', 'unless', 'unlike', 'until', 'what', 'whatever', 'when', 'whenever', 'where', 'whereas', 'wherever', 'whether', 'which', 'whichever', 'while', 'who', 'whoever', 'whom', 'whomever', 'whose', 'with', 'within', 'without', 'yet',
            //some of Preposition https://www.englishclub.com/grammar/prepositions-list.htm
            //https://www.talkenglish.com/vocabulary/top-50-prepositions.aspx
            'aboard', 'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'anti', 'around', 'at', 'behind', 'below', 'beneath', 'beside', 'besides', 'beyond', 'but', 'by', 'concerning', 'considering', 'despite', 'down', 'during', 'excepting', 'excluding', 'following', 'for', 'from', 'in', 'including', 'inside', 'into', 'of', 'off', 'on', 'onto', 'opposite', 'out', 'outside', 'over', 'past', 'per', 'regarding', 'since', 'than', 'through', 'throughout', 'to', 'toward', 'towards', 'under', 'underneath', 'unlike', 'until', 'up', 'upon', 'versus', 'via', 'within', 'without',
            //some of https://7esl.com/interjections-exclamations/
            'aah', 'ah', 'aha', 'ahem', 'alas', 'argh', 'aw', 'aww', 'bah', 'behold', 'bingo', 'boo', 'bravo', 'brr', 'dear', 'duh', 'eek', 'eh', 'er', 'eww', 'gah', 'gee', 'grr', 'hah', 'hello', 'hey', 'hi', 'hmm', 'huh', 'hullo', 'humph', 'hurrah', 'meh', 'mhm', 'muahaha', 'nuh-uh', 'oh', 'ooh', 'ooh-la-la', 'oomph', 'oops', 'ouch', 'oww', 'oy', 'pew', 'pff', 'phew', 'psst', 'sheesh', 'shh', 'shoo', 'tsk-tsk', 'uh-hu', 'uh-oh', 'uh-uh', 'uhh', 'um', 'umm', 'wee', 'well', 'whoa', 'wow', 'yahoo', 'yay', 'yeah', 'yikes', 'yippee', 'yoo-hoo', 'yuck', 'yuh-uh', 'zing',
            //modals
            'can', 'could', 'be able to', 'may', 'might', 'shall', 'should', 'must', 'have to', 'will', 'would',
        ].sort((a, b) => b.length - a.length).map(w => `\\W${w}(?!\\w)`).join('|'), 'g')), ' ');
    }

    /**
     * Searches a text with the Stack Exchange API, optionally with a timeframe and the tags
     * @param {string} q
     * @param {Date} [before]
     * @param {Date} [after]
     * @param {string[]} [tags]
     * @param {string} [site]
     */
    async function findByApi(q, before, after, tags, site='stackoverflow.com') {
        var dfgdr = (q = dropMarks(q)) && q && fetch(
            `https://api.stackexchange.com/2.3/search?page=1&pagesize=1&order=desc&sort=relevance&intitle=${encodeURIComponent(q)}&site=${site.split('.')[0]}` +
            (after ? '&fromdate=' + (after.getTime() / 1000 - 120 | 0) : '') +
            (before ? '&todate=' + (before.getTime() / 1000 + 120 | 0) : '') +
            (Array.isArray(tags) && tags.length > 0 ? '&tagged=' + encodeURIComponent(Array.from(new Set(tags)).join(';')) : ''), {
                credentials: 'omit'
            })
        .then(r => r.json())
        .then(r => r?.items[0]?.link);
        return dfgdr;
    }

    /** Searches an issue text with the Github API, optionally with the user */
    async function findByGitHubApi(q, user) {
        var dfgdr = q && fetch(
            `https://api.github.com/search/issues?q=${encodeURIComponent(q)}` +
            (user && user != 'ghost' ? ' author:' + encodeURIComponent(user) : ''), {
                credentials: 'omit'
            })
        .then(r => r.json())
        .then(r => r?.items[0]?.html_url);
        return dfgdr;
    }

    /**
     * Takes the slightly aligned text of the header or a given selector, optionally translates it, tries to find it per API and otherwise creates the bottom bar to search for
     * @param {string|array} [h] - header selector (def: 'h1')
     * @param {string|array} [t] - tags selector (def: '.tag')
     * @param {string} [l] - lang (def: none)
     * @param {string} [s] - target site(s) (def: ['stackoverflow.com'])
     */
    async function byHeader(h, t, l, s) {
        var sbh = (l == 'en') ? (Array.isArray(h) ? h[0] : textContent(h ? h : 'h1')) : filterText(await yaTranslate(getHeader(h), l), 1);
        return sbh && (await findByApi(sbh, _, _, getTags(t), Array.isArray(s) ? s[0] : _) || prepareSearch(sbh, t, s));
    }

    /** Gets the text to search for from a part of the path, tries to find it per API and otherwise creates the bottom bar to search for */
    async function byPath(pos, s) {
        ll = _ps[pos].replace(/(-closed|-duplicate)?(\.html)?$/, '').replace(/^\d+-/, '').replace(/[-+]/g, ' ');
        ll = ll.replace(/\b(are|ca|could|did|does|do|has|have|is|must|were|wo)n ?t\b/g,'$1n\'t').replace(/\b(they|you) ?(re|ve)\b/g,'$1\'$2').replace(/\bi ?(m|ve)\b/g,'i\'$1').replace(/\b(what|there) ?s\b/g,'$1\'s');
        return (await findByApi(ll)) || prepareSearch(ll, '', s);
    }

    /** Matches elements by a given selector, searches for elements whose inner text starts with a given search text and returns the link of an element matched by a second given selector or the inner text that follows the search text */
    function startsByText(selector, text, href = false) {
        const e = all(selector);
        for (var i = 0; i < e.length; i++) {
            var t = e[i].innerText.trim();
            var f = t.indexOf(text);
            if (f == 0) return (href ? e[i].querySelector(href)?.href : t.substr(text.length).trim());
        }
    }

    /** Matches elements by a given selector, searches for elements whose inner text includes a given search text and returns their link */
    function byInner(selector, text) {
        const e = all(selector);
        for (var i = 0; i < e.length; i++) {
            if (e[i].innerText.trim().indexOf(text) >= 0) return e[i].href;
        }
    }

    var link;
    const host = location.hostname.split('.').slice(-2).join('.');
    console.log('Checking site: ' + location.hostname + (location.hostname != host ? ' as ' + host : ''));

    switch (host) {
        case '16892.net':
        case '55276.net':
        case 'jike.in':
        case 'jonic.cn':
        case 'mlink.in':
        case 'ogeek.cn':
        case 'ostack.cn':
        case 'overstack.in':
        case 'qi-u.com':
        case 'shenghuobao.net':
        case 'shenzhenjia.cn':
        case 'shenzhenjia.net':
        case 'sqlite.in':
        case 'tousu.in':
        case 'vigge.cn':
        case 'vigge.net':
        case 'vigges.net':
        case 'wujigu.com':
        case 'xstack.ru':
        case 'xstack.us':
        case 'zaizhele.cn':
        case 'zaizhele.net':
            if (_c(/^\/thread-.*.html$/) && textContent('#pt a:nth-child(5)') == '知识问答') return byHeader([removePartBefore('h1',' - ')], _, 'en');
            if (_c(/^\/article-.*.html$/) && textContent('#pt a:nth-child(5)') == '开源') return bySel('.deanedit > a');
            if (_ps[1] == 'qa' && _t('h1 a')){
                if (textContent('h1').match(/[\u4e00-\u9fa5]/)) return byHeader('h1', _, 'zh');
                return byHeader([removePartBefore('h1',' - ')], _, 'en');
            }
            return;
        case '1r1g.com':
            return clr('#343a40') && byHeader('h1', 'a.badge', 'en');
        case '5axxw.com':
            return byHeader('h1','.badge-tag','zh') && byHeader('h2',_,'zh');
        case '955yes.com':
            return byNumber(_ps[2].match(/1(\d*)\.html/)[1]);
        case '9ishenzhen.com':
            return !_c(/[\u4e00-\u9fa5]/) && _t('h1 a') && byHeader([removePartBefore('h1',' - ')], _, 'en');
        case 'amuddycup.com':
        case 'arip-photo.org':
        case 'athabasca-foto.com':
        case 'cfadnc.org':
        case 'culinarydegree.info':
        case 'domainelespailles.net':
        case 'ec-europe.org':
        case 'ecnf2016.org':
        case 'elfishgene.com':
        case 'faithcov.org':
        case 'fitforlearning.org':
        case 'fluffyfables.com':
        case 'gupgallery.com':
        case 'messiahlebanon.org':
        case 'noblenaz.org':
        case 'ntcdoon.org':
        case 'ourladylakes.org':
        case 'pakostnici.com':
        case 'panaindustrial.com':
        case 'pcbconline.org':
        case 'projectbackpack.org':
        case 'safehavenpetrescue.org':
        case 'sch22.org':
        case 'sierrasummit2005.org':
        case 'siwib.org':
        case 'smnggeophysics.com':
        case 'sunflowercreations.org':
        case 'theshuggahpies.com':
        case 'waymanamechurch.org':
        case 'zsharp.org':
            return (tt = _t('meta[property="og:image"]').content.split('/').pop().split('.')[0].replace(/-/g,' ')) && byHeader([tt], _, 'en', ['stackoverflow.com','superuser.com','askubuntu.com','stackexchange.com']);
        case 'androiderrors.com':
        case 'w3toppers.com':
            return byHeader('h1', 'span.tags-links > a', 'en');
        case 'answerlib.com':
        case 'answerspoint.com':
        case 'ask-dev.ru':
        case 'coderoad.in':
        case 'younggeeks.in':
            return byPath(3);
        case 'antwortenhier.me':
        case 'askfrance.me':
        case 'respuestas.me':
        case 'askentire.net':
            return clr('#2c3e50') && byHeader('h1', [await transTags('ul.x-tags li a[href*="/t/"]')], document.documentElement.lang);
        case 'anycodings.com':
            return byHeader([removePartBefore('h2',': ')], '.no-gutters > a', 'en');
        case 'appsloveworld.com':{
            let title = textContent('h1#posttitle');
            let crop_start = title.match(/^((?:\w+[\-\s]*)?\[?(?:SOLVED|SOLUTION)\]?\s*-\s*)/i);
            let matches = title.match(/\s?(?:\s*-\s*([\w+#]+(?:[\-\s.]\w+)?))?$/i);
            if (crop_start != null) title = title.replace(crop_start, '');

            let tag = false;
            if (matches != null) {
                title = title.replace(matches[0], '');
                tag = matches[1];
            }
            return byHeader([title], tag ? [tag] : [], 'en');
        }
        case 'askdev.ru':
            return clr('#970f1b') && urlByImg('https://superuser.com/questions/') || byHeader('h1', [await transTags('.block_taxonomies a')], 'ru');
        case 'askdevz.com':
        case 'askvoprosy.com':
        case 'living-sun.com':
        case 'qandeelacademy.com':
        case 'yaoply.com':
            return byPath(2);
        case 'asklobster.com':
        case 'cainiaojiaocheng.com':
        case 'coderquestion.ru':
        case 'coredump.biz':
        case 'digitrain.ru':
        case 'gitrush.ru':
        case 'html-agility-pack.net':
        case 'icopy.site':
        case 'issue.life':
        case 'qaru.tech':
        case 'stackfinder.ru':
        case 'thinbug.com':
            return byNumber(_ps[2]);
        case 'askubuntu.ru':
            return byHeader('h1', 'nav .col-tag', 'ru', ['askubuntu.com']);
        case 'bcqaw.com':
            return byHeader('h1.article-title', _, 'zh');
        case 'bildiredi.com':
        case 'ciupacabra.com':
        case 'de-vraag.com':
        case 'donolik.com':
        case 'kotaeta.com':
        case 'switch-case.com':
        case 'while-do.com':
        case 'zapytay.com':
            return bySel('a.link.block');
        case 'bilee.com':
            clr('#178acc');
        case 'techarks.ru':
            clr('#20a169');
        case 'question-it.com':
            clr('#2c3e50');
        case 'legkovopros.ru':
            lng('ru') && clr('#55b252');
        case 'edupro.id':
            lng('id') && clr('#2c3e50');
            return byHeader('h1', '.tag', lang);
        case 'binarydevelop.com':
            return bySel('div.cc', 'data-href');
        case 'catchconsole.com':
            return byHeader([dropMarks(textContent('h1'))], _, 'en');
        case 'cmsdk.com':
        case 'code-error.com':
        case 'idqna.com':
        case 'learn-codes.net':
        case 'newdevzone.com':
        case 'programming-articles.com':
        case 'thecodeteacher.com':
        case 'w3coded.com':
            return byHeader('h1', _, 'en');
        case 'cndgn.com':
            return 'https://' + _ps[2].replace(/(.+)stack/,'$1.stackexchange').replace(/^(stack)$/,'$1overflow') + '.com/questions/' + _ps[3];
        case 'code-examples.net':
        case 'i-harness.com':
            return byNumber(lastPathPart(), 16);
        case 'codebug.zone':
            return byHeader([removePartBefore('h1', ' – ')], _, 'es');
        case 'codefordev.com':
            return byHeader('h1', '.ui.small.label', 'en');
        case 'codeguides.site':
            return byNumber(_ps[3]);
        case 'codehunter.cc':
            return byHeader('h1', '.badge', 'en');
        case 'codengineering.net':
            return (!allTexts('.tags > div > a').join().match(/[\u0400-\u04ff]/)) && byHeader('h1', '.tags > div > a', 'ru');
        case 'codengineering.ru':
            return toSearch(lastPathPart().replace(/(-closed|-duplicate)?(-\d+)?(\.html)?$/, ''), true);
        case 'codenong.com':
        case 'coderoad.ru':
        case 'quabr.com':
            return byNumber(_ps[1]);
        case 'codepudding.com':
            return byHeader('div.detail_title', '.hot-tags a', 'en');
        case 'coder.work':
            return bySel('div>p>a[rel="noreferrer noopener nofollow"]') || startsByText('p', 'stackoverflow链接', 'a[href*="stackoverflow.com"]') || startsByText('p', 'stackoverflow原址', 'a[href*="stackoverflow.com"]') || byHeader('h1', _, 'zh');
        case 'codeutility.org':
            return byHeader('h1', '.tags-links > a', 'en');
        case 'dailydevsblog.com':
            return byHeader([removePartBefore('h1', 'Resolved: ')], '.tags > a', 'en');
        case 'daplus.net':
            return byHeader([removePartBefore('h1','\\] ')], _, 'ko');
        case 'debugcn.com':
            lng(_ps[1] == 'article' ? 'zh' : _ps[1]);
        case 'debugko.com':
        case 'jablogs.com':
            lng('ja');
        case 'xsprogram.com':
        case 'devasking.com':
            lng('en');
            return byHeader('h1', _, lang);
        case 'devdreamz.com':
            return byHeader('h1','[class^="ButtonTags_tags_container"] a', 'en');
        case 'devebee.com':
            return byHeader('h1', '.content > .tagcloud > a', 'en');
        case 'develop-bugs.com':
            tt = _t('blockquote > h2 > a').innerHTML.split('  -  ');
            return byHeader([tt[0]], tt[1], 'en');
        case 'developreference.com':
            var parts = document.title.split(' - ');
            var devpref = _ps[3].replace(/[-+]/g, ' ').replace(/(%ef|%bc|%9f)+$/i, '');
            return (await findByApi(devpref)) || (await findByApi(parts[0], _, _, [parts.pop()])) || promptRedirect(sitecolor, toSearch(devpref));
        case 'devfaq.fr':
            return byHeader('h1', '.badge-info', 'fr');
        case 'devtip.in':
            return byHeader('h1', '.tag-list div', 'en');
        case 'dokry.com':
            return byHeader('h1', '.badge a', 'es');
        case 'doraprojects.net':
            return byInner('a.text-muted', 'Source');
        case 'dtuto.com':
            return byHeader('h5', '.tag-link', 'en');
        case 'duoduokou.com':
            return byHeader('p.post-title', 'span.category > a', 'zh');
        case 'e-learn.cn':
            return startsByText('div.content p:last-child', '来源：');
        case 'editcode.net':
            return byHeader([removePartBefore('h1', ':')], _,'en');
        case 'edureka.co':
            return byHeader([JSON.parse(textContent('[type="application/ld+json"]')).name], _,'en');
        case 'errorsfixing.com':
            return bySel('div.entry-content.boxed > p:nth-last-of-type(3) > a');
        case 'exchangetuts.com':
            return byHeader('h1', '.item-tag > a', 'en');
        case 'extutorial.com':
            return byHeader('h1', 'a[href*="/tags/"]', 'en');
        case 'firstlightsalon.in':
            return 'https://' + _ps[1].replace('_threads','.stackexchange.com/questions/') + _ps[3];
        case 'fixes.pub':
            return byHeader('h1', 'aside li a[href*="fixes.pub/topics"]', 'ja');
        case 'flutterhq.com':
            return byInner('a', 'Stackoverflow.com');
        case 'fullstackuser.com':
            return byHeader('h1', '.custom-head .post-tag', 'en');
        case 'getridbug.com':
            return byHeader('h1', 'div.post-tags > a', 'en');
        case 'ghcc.net':
            return byHeader('h1', '.field__item > a', 'en');
        case 'helpex.vn':
            return _t('#viewSource>span')?.innerText.replace(/^: /,'');
        case 'howtobuildsoftware.com':
            return byHeader([removePartBefore('title',' - ')], '#list .email-content-subtitle a', 'en');
        case 'imtqy.com':
            return byHeader('.question-header>h1', _, 'en');
        case 'intellipaat.com':
            return byHeader('h1', '.qa-q-view-tag-item', 'en');
        case 'ipgirl.com':
            return byHeader('h1', '.breadcrumb-item > span > a', 'fr');
        case 'it1352.com':
            return byHeader([removePartBefore('h1 > em','\\] ')], 'div.arc-meta > span > a', 'en');
        case 'itbaoku.cn':
            return byHeader([removePartBefore('h1 > em','\\] ')], '.article-tags > a', 'en');
        case 'itecnote.com':
            return byHeader([removePartBefore('h1',' – ').replace(/How to/, '')], _, 'en');
        case 'itectec.com':
            return byHeader([removePartBefore('h1', ' – ')], '.badge','en', _se);
        case 'javacodexamples.com':
            return byHeader('h1', '.titleBox > p > a', 'en');
        case 'javaer101.com':
            return byHeader('h1', 'nav .col-tag', _ps[1] == 'article' ? 'ja' : _ps[1]);
        case 'jscodetips.com':
            return byHeader('h1', '.contentBox > div:nth-child(3) > a', 'en');
        case 'kompsekret.ru':
            return clr('#292d2f') && (urlByImg('https://superuser.com/questions/') || byHeader([lastPathPart().replace(/(-closed|-duplicate)?(\d+)?(\.html)?$/, '').replace(/-/g, ' ')], '.tags a', 'en', ['superuser.com']));
        case 'kutombawewe.net':
        case 'pengembangan-web-mp-pd.com':
        case 'wake-up-neo.net':
        case 'web-dev-qa-db-fra.com':
        case 'web-dev-qa-db-ja.com':
        case 'web-gelistirme-sc.com':
            return bySel('.q-source > a');
        case 'learnfk.com':
            if (_ps[1] == 'en') return byHeader('h1', '.entry-info > .badge-tag', 'en');
            return byHeader([removePartBefore('h2.h11','\\] ')], '.entry-info > .badge-tag', 'en');
        case 'localcoder.org':
            return byHeader('h1', '.categories a', 'en');
        case 'manongdao.com':
            return byHeader('h2', 'a.notebook > span', 'en');
        case 'microeducate.tech':
        case 'programmierfrage.com':
        case 'routinepanic.com':
            return _tc('a');
        case 'mlog.club':
            addJS('var redir = window.__NUXT__.data[0].article.sourceUrl; redir && window.location.replace(redir);');
            return lng('zh') && byHeader('h1', [await transTags('.article-tag')], 'zh');
        case 'newbedev.com':
            return _t('article') && byHeader('h1', 'h4.tags a.item-tag', 'en', _se);
        case 'poweruser.guru':
            return _t('div.post-menu a.suggest-edit-post[href*="superuser.com/questions/"]');
        case 'progi.pro':
            return clr('#4e82c2') && byHeader('h1[itemprop="name"]', '.tag-list a', 'ru');
        case 'proubuntu.ru':
            return byHeader('h1>a>span[itemprop="name"]', [await transTags('a[rel="tag"]')], 'ru', ['askubuntu.com']);
        case 'pyquestions.com':
            return (tt = '(' + getTags('.btn.btn-secondary').join('|') + ')') && byHeader([textContent('h1').replace(new RegExp('(^' + tt + ': | in ' + tt + '$)', 'i'),'')], '.btn.btn-secondary', 'en');
        case 'qapicks.com':
            return byNumber(_ps[2].split('-')[0]);
        case 'querythreads.com':
            return JSON.parse(textContent('script#__NEXT_DATA__')).props.pageProps.data.url;
        case 'questu.ru':
            return byInner('a', 'источник');
        case 'reddit.fun':
            return byHeader('h1', '.qa-q-view-tags .qa-tag-link', 'en');
        case 'roboflow.ai':
            return byNumber(_ps[2]);
        case 'rotadev.com':
            return (tt = textContent('h1').split(/ – (Dev|Super User|Server Fault)$/)) && byHeader(tt, _, 'en', [mulReplace(tt[1], [['Dev', 'stackoverflow.com'], ['Super User', 'superuser.com'], ['Server Fault', 'serverfault.com']])]);
        case 'ruphp.com':
            return byHeader('h1', '.breadcrumb-item .badge a', 'ru');
        case 'semicolonworld.com':
            return byHeader('h1', '.post__category', 'en');
        case 'server-fault.ru':
            return byHeader('h1', 'div.question-text > div.tags > a.tag', 'ru', ['serverfault.com']);
        case 'sobrelinux.info':
            return byHeader('h1', '.tags .tag a', 'pt', _se);
        case 'soinside.com':
            return clr('#333') && byHeader('h1', '.q-tag', 'zh');
        case 'solveforum.com':
            return byHeader([removePartBefore('h1', '\\[Solved\\] ')], _, 'en');
        case 'stackanswers.net':
            clr('#999') && lng('en');
            return location.hostname.startsWith('publish.') && all('.panel-body a')[1].href;
        case 'stackify.dev':
            return byHeader('h1', '.tags-container span.front', 'en');
        case 'stackoom.com':
            return byNumber(_t('[id^=question_content_]').id.split('_')[2]);
        case 'stackoverflood.com':
            return (tt = _h.match(/^https?:\/\/stackoverflood\.com\/([a-zA-Z]{2})\/q\/(.+)/)) && byNumber(tt[2]);
        case 'stackoverflowpoint.com':
            return byHeader([removePartBefore('h1', ' – ')], '.post-cat > a', 'en');
        case 'string.quest':
            return byHeader([removePartBefore('h1', ' - ')], '.tag-links a', 'zh');
        case 'super-unix.com':
            return byHeader([removePartBefore('h1', ' – ')], '.badge', 'en', [mulReplace(_ps[1], [['superuser', 'superuser.com'], ['askdifferent', 'apple'], ['database', 'dba'], ['ubuntu', 'askubuntu.com'], ['unixlinux', 'unix']])]);
        case 'syntaxfix.com':
            return byHeader('h1', '.tag_askd>p>span>code', 'en');
        case 'sysadminde.com':
            return 'https://serverfault.com/questions/' + _ps[2];
        case 'techfeed.net':
            return byHeader('main h1', '.tag', 'ru');
        case 'techhelpnotes.com':
            return byHeader([removePartBefore('h1', ' – ')], _, 'en');
        case 'techinplanet.com':
            return byHeader('h1', '.entry-tags > a', 'en');
        case 'tencent.com':
            return byHeader('.ask-title h2', _, 'zh');
        case 'tipsfordev.com':
            return byHeader('h1', '.blog-pagination > a', 'en');
        case 'tistory.com':
            return all('.article-view p > a').pop().href;
        case 'tracholar.top':
            return byPath(4);
        case 'tutorialguruji.com':
            return byHeader([textContent('h1').replace(/ *Code Answer *$/, '')], _, 'en');
        case 'tutorialink.com':
            return byHeader('h1', 'a.tag-link', 'en');
        case 'tutorialmeta.com':
            if (textContent('.tt-right:nth-last-of-type(3)') != 'source: stackoverflow.com') return;
            return byHeader('h1', _, 'en');
        case 'tutorialmore.com':
            return byHeader([removePartBefore('h1',' - ')], '.tags a', 'ja', ['superuser.com', 'stackoverflow.com', 'stackexchange.com']);
        case 'utyatnishna.ru':
            return byHeader('h1.entry-title', '.tag', 'ru');
        case 'v-resheno.ru':
            return textContent('.linkurl > b');
        case 'vuejscode.com':
            return bySel('article .mt-4 a') || byHeader('h1', _, 'en');
        case 'webdevdesigner.com':
            return (tt = (_ps[1] == 'q' ? _ps[2] : _ps[1].replace(/^q-/, '')).replace(/-\d+$/, '').replace(/-/g, ' ')) && byHeader([tt], '.tags a', 'en', ['stackoverflow.com', 'superuser.com', 'stackexchange.com']);
        case 'wekeepcoding.com':
            return byHeader('h4', _, 'en');
        case 'wenyanet.com':
            return bySel('.question-date a');
        case 'wikiroot.ru':
            tt = _t('section section div.footer-post div.d-inline-block button');
            tt = tt && (getAttr(tt, 'data-url', /https?:\/\/wikiroot\.ru\/comment\/new\/([0-9]+)/) || getAttr(tt, 'data-target', /#buttoncollapse-([0-9]+)/));
            return tt ? 'https://superuser.com/questions/' + tt : byHeader('h1', 'ul.tags-list li a', 'ru');
        case 'wp-qa.com':
            return byHeader('h1', '#content > .tags > a', 'en');
        case 'xiu2.net': // redirects to site with 502 / 2022-07-06
            addJS('var redir = window.__NUXT__.data[0].info.sourceUrl; redir && window.location.replace(redir);');
            return lng('zh') && byHeader('h1', '.contents .tag-time a[href*="/it/tag/"]', 'zh');
        case 'xszz.org':
            return clr('#ff6f06') && byHeader('.post-h1title h1', 0, 'en');
        case 'ylhow.com':
            return (tt = _t('.entry-content > p > a[href*="stackoverflow.com/"]')) && tt.innerText.includes('原文') && tt.href;
        case 'yuanmacha.com':
            return (tt = _t('h1')?.innerHTML.match(/\((.+)\)/)) && byHeader([tt[1]], '.tag a', 'en', ['stackoverflow.com']);
        /* Wikipedia */
        case '360wiki.ru':
        case 'buildwiki.ru':
        case 'datewiki.ru':
        case 'hmong.ru':
        case 'hmong.wiki':
        case 'livepcwiki.ru':
        case 'nwikiit.cyou':
        case 'vvikipedla.com':
        case 'wiki2.wiki':
        case 'wiki5.ru':
        case 'wikibrief.org':
        case 'wikichi.ru':
        case 'wikidea.ru':
        case 'wikivisually.com':
        case 'zahn-info-portal.de':
            return wiki('en');
        case 'abcdef.wiki':
            return wiki('en', _p, false);
        case 'duhoctrungquoc.vn':
        case 'globalwikionline.com':
        case 'wikies.wiki':
        case 'wikipe.wiki':
        case 'wikit.wiki':
            return wiki(2, 3);
        case 'encyclopaedia.bid':
            return wiki('ru', _p.replace(/^\/%D0%B2%D0%B8%D0%BA%D0%B8%D0%BF%D0%B5%D0%B4%D0%B8%D1%8F/, '/wiki'), false);
        case 'encyclopedia.kz':
            return _hst('ru.encyclopedia.kz') && wiki('ru', 2);
        case 'explained.today':
        case 'findatwiki.com':
            return wiki('en', 1);
        case 'frwiki.wiki':
            return wiki('fr', 2);
        case 'gaz.wiki':
            return wiki('en', 3);
        case 'jejakjabar.com': // redirects to zahn-info-portal.de / 2022-07-06
            return (tt = _h.match(/https?:\/\/([a-zA-z]+\.)?jejakjabar\.com\/wiki\/(.+)/)) && wiki('en', tt[2]);
        case 'nina.az':
            return (tt = _h.match(/https?:\/\/wikipedia\.(([a-z]{2})\.)?nina\.az\/wiki\/(.+)/)) && wiki(mulReplace(tt[2], [ ['ua', 'uk'], ['us', 'en'] ]), tt[3]);
        case 'rudata.ru':
            return bySel('a.external[href*="ru.wikipedia.org"]');
        case 'sbup.com':
        case 'wiki-org.ru':
        case 'wikiredia.ru':
            return wiki('ru', _p, false);
        case 'territorioscuola.it':
            return (tt = _h.match(/https?:\/\/enhancedwiki\.territorioscuola\.it\/\?title=(.+)/)) && wiki('it', tt[1]);
        case 'thefreedictionary.com':
            return wiki('en', textContent('h1'));
        case 'wiki-wiki.ru':
            return wiki('ru', 3);
        case 'wiki.cologne':
        case 'wiki2.info':
        case 'wikipedia24.ru':
            return _t('.mw-parser-output') && wiki('ru', 1);
        case 'wiki2.net':
        case 'wikipedia.tel':
            return wiki('ru', _p.substr(1));
        case 'wiki2.org':
            if (/\?search=/.test(location.search)) return;
            return ((tt = _h.match(/https?:\/\/wiki2\.org\/([a-zA-z]{2})\/(.+)/)) || (tt = _h.match(/https?:\/\/([a-z]{2})\.wiki2\.org\/wiki\/(.+)/))) && wiki(tt[1], tt[2]);
        case 'wikidark.ru':
            return wiki('ru', _p, false);
        case 'wikipedia-on-ipfs.org':
            return wiki(_hp(3), 2);
        case 'wikiwand.com':
            return !(/(\?|&)fullSearch=(true|false)/.test(location.search)) && wiki(1, 2);
        case 'wikizero.com':
            return wiki(1, 2);
        case 'xcv.wiki':
            return (tt = _h.match(/https?:\/\/([a-zA-z]{2,4})\.xcv\.wiki\/wiki\/(.+)/)) && wiki('de', tt[2]);
        case 'zxc.wiki':
            return wiki('de', 2);
        /* GitHub */
        case 'androidrepo.com':
        case 'bestofphp.com':
        case 'bestofvue.com':
        case 'bestofreactjs.com':
        case 'javarepos.com':
        case 'jsrepos.com':
        case 'flutterrepos.com':
        case 'rustrepo.com':
        case 'swiftobc.com':
            return bySel('#description > article > a:last-of-type') || bySel('#description ~ a:last-of-type');
        case 'astrophel.org':
        case 'gitcode.net':
        case 'giters.com':
        case 'gitfreak.com':
        case 'githubhelp.com':
        case 'githubplus.com':
            return github(_p);
        case 'awesomeopensource.com':
            return github(_p.replace(/^\/project/,''));
        case 'bestofcpp.com':
        case 'golangrepo.com':
        case 'pythonrepo.com':
            return byInner('#basic a.btn','GitHub Repository');
        case 'bleepcoder.com':
            return bySel('.float-right .text-muted');
        case 'bytemeta.vip':
        case 'githubhot.com':
        case 'githubmemory.com':
            return _c(/^\/(repo\/|@)/) && github(_p.replace(/^\/(repo\/|@)/,'/'));
        case 'coder.social':
            return bySel('h1.h1 > a.btn-git');
        case 'codespots.com':
            return bySel('a.repo');
        case 'curatedgo.com':
            return bySel('.mt-4 .text-xs a');
        case 'fantashit.com':
            return findByGitHubApi(textContent('h1'));
        case 'geeksrepos.com':
            return github(_p + location.search);
        case 'gitanswer.net':
            tt = '(\\b'+allTexts('.post-tags a.button').join('\\b|\\b')+'\\b)';
            return findByGitHubApi(textContent('h1').replace(/ - .*$/, '').replace(new RegExp('(^' + tt + ' ?| ?' + tt + '$)', 'g'), ''), _t('.avatar').parentElement.querySelector('span').innerText);
        case 'gitdetail.com':
            return bySel('#right-sidebar a:last-of-type');
        case 'githublab.com':
            return github(_p.replace(/^\/(repository|profile)/,'').replace(/^(\/issues)(\/.*\/.*)(\/.*)/,'$2$1$3').replace(/^(\/issues)(\/.*\/.*)/,'$2$1'));
        case 'golangd.com':
            return bySel('.box-body > a');
        case 'golangexample.com':
            return bySel('#github ~ p > a');
        case 'higithub.com':
            return github(_p.replace(/\/(repo\/|user$)/,'/').replace(/^(\/.*)(\/issue)(\/.*)(\/.*)/,'$1$3$2s$4').replace(/^(\/.*)\/repo_(issues)(\/.*)/,'$1$3/$2'));
        case 'issueantenna.com':
            return github(_p.replace(/^\/(repo|author)/,''));
        case 'issuehint.com':
            return findByGitHubApi(textContent('h1'));
        case 'lifesaver.codes':
            return byInner('a[role="link"]','Original');
        case 'lightrun.com':
            return bySel('article > small > a');
        case 'opensourcelibs.com':
            return byInner('.repo-stats a','github.com');
        case 'pythonawesome.com':
        case 'softbranchdevelopers.com':
            return bySel('.github-view');
        case 'pythonlang.dev':
            return bySel('.widget-profile > p > a');
        case 'reposhub.com':
            return bySel('#githome');
        case 'zzun.app':
            return _go(byInner('#basic a.btn','GitHub Repository'));
        /* NPM */
        case 'npm.io':
        case 'npmmirror.com':
            return 'https://www.npmjs.com'+_p;
        case 'snyk.io':
            return 'https://www.npmjs.com/package/'+_ps[3];
        case 'socket.dev':
            return 'https://www.npmjs.com'+_p.replace(/^\/npm/,'');
        /* Other */
        case 'ape-ask.com':
            return _go(all('script').filter(i => i.innerText.indexOf('originfo') != -1)[0].innerText.match(/\.text\("(.*)"\)/)[1]);
        case 'cache.one':
            return _go(startsByText('.entry-tags p', '来源：'));
        case 'cepe-eua.org':
            return byHeader('h5', _, _ps[1], ['quora.com']);
        case 'chowdera.com':
            return _go(textContent('.nextinfo > p').split('\n')[2]);
        case 'codefactor.io':
            window.addEventListener('DOMContentLoaded', (e)=>{
                if (_ps[2]=='github' && _ps[5]=='source') _go(bySel('a[title^="View on"]') + '/blob/' + _ps.splice(6).join('/'));
                _go(bySel('a.page-title-link') || bySel('a[analytics-event^="View file on"]') || bySel('a[title^="View on"]'));
            });
            return;
        case 'codegrepper.com':
            window.addEventListener('DOMContentLoaded', (e)=>{
                _go(bySel('.answer_source > a')) || promptRedirect(sitecolor, toSearch(textContent('h1').replace(/“(.*)” Code Answer(’s)?/,'$1'),[]), allTexts('.TaysCodeMirror-code .TaysCodeMirror-line'), _, [])
            });
            return;
        case 'coder-question-ko.com':
        case 'coder-question.com':
            return _go(bySel('article a.bg-success-soft'));
        case 'codetd.com':
            return _go('https://' + _t('.article-refer span:nth-child(2)').innerText);
        case 'dir.md':
            return (tt = _h.match(/^https?:\/\/dir.md\/(.+)(&|\?)host=([a-zA-Z\.-]+)$/)) && _go('https://' + tt[3] + '/' + tt[1]);
        case 'findbestopensource.com':
            return _go(bySel('.row > .more-link:last-of-type'));
        case 'ichi.pro':
            return byHeader('h1', _, 'ja', []);
        case 'icode9.com':
            return _go(textContent('#paragraph > p:last-child').split('来源：', 2)[1].trim());
        case 'intrepidgeeks.com':
            return _go(bySel('.source-div a.h5'));
        case 'it-brain.online':
            return _go('https://tutorialspoint.com/' + _ps[2]);
        case 'itdaan.com':
            return _go(bySel('input[name="url"]', 'value'));
        case 'itnan.ru':
            return _h.match(/https?:\/\/([a-zA-Z]{2})?\.?itnan\.ru\/post\.php\?(.+)?p=([0-9]+)/) && _go(bySel('article.entry .entry-meta a[title="Оригинальная публикация"]'));
        case 'juejin.cn':
            window.addEventListener('DOMContentLoaded', (e)=>{
                return byHeader('h1', _, 'zh', []);
            });
            return;
        case 'libraries.io':
            return (tt = all('p.project-links > span > a')) && _go(tt.filter(t => t.innerText.toLowerCase() == _ps[1])[0]);
        case 'macosrepo.com':
            return _go(bySel('.user-info > .seller-link'));
        case 'mediatagtw.com':
            if (_ps[1] == 'article') _go(bySel('#social_only > h3 > a'));
            if (_ps[1] == 'exit') _go(bySel('.h5 > a'));
            return;
        case 'ounapuu.ee':
            tt = _ps[1].split('_')[0];
            if (tt == 'stackoverflow.com') return byNumber(_ps[3]);
            if (_se.some(i => tt.includes(i))) return 'https://' + tt + '/questions/' + _ps[4].replace('.html','');
            if (tt == 'wikipedia') return wiki(_ps[1].split('_')[1], _h.split('/A/')[1]);
            if (tt == 'developer.mozilla.org' || tt == 'lowtechmagazine.com') return _go('https://' + _h.split('/A/')[1]);
            if (tt == 'explainxkcd') return _go('https://www.explainxkcd.com/wiki/index.php/' + _h.split('/A/')[1]);
            if (tt == 'proofwiki') return _go('https://proofwiki.org/wiki/' + _h.split('/A/')[1]);
            if (tt == 'archlinux') return _go('https://wiki.archlinux.org/title/' + _h.split('/A/')[1]);
            if (tt == 'openstreetmap') return _go('https://wiki.openstreetmap.org/wiki/' + _h.split('/A/')[1]);
            return;
        case 'runebook.dev':
            return _go(bySel('div.row > div:first-Child > div > p > a'));
        case 'savepearlharbor.com':
            return _go(bySel('article.post > div.entry-content > p > a[href*="://habr.com/"]'));
        case 'solusi.cyou':
            if (tt = _t('article > .media-body .text-right a:nth-child(3)')) return tt.href.replace('https://solusi.cyou/read-https-','https://');
            if (_c(/^\/read-https?-/)) return _go(_h.replace(/https:\/\/solusi\.cyou\/read-(https?)-/,'$1://'));
            return;
        case 'twblogs.net':
            return _go(textContent('#OSC_h3_2 ~ a'));
        default:
            if (_hst('mediawiki.feverous.co.uk')){
                return wiki('en', 2);
            } else if (_hst('qastack') || _hst('qa-stack')) {
                return bySel('span.text-muted.fake_url a, span.text-muted.fake_url', 'src') ||
                    bySel('.text-muted a:last-child[href*="stackoverflow.com/"],.text-muted a:last-child[href*="stackexchange.com/"],.text-muted a:last-child[href*="serverfault.com/"],.text-muted a:last-child[href*="superuser.com/"],.text-muted a:last-child[href*="mathoverflow.net/"]') ||
                    ((tt = _h.match(/https?:\/\/qa-?stack\.([a-z\.]+)\/([a-z]+)\/([0-9]+)\/(.+)/)) && 'https://' + tt[2] + '.stackexchange.com/questions/' + tt[3] + '/' + tt[4]);
            } else if (_hst('secret-bases.co.uk')){
                return wiki('en', 2);
            } else if (_hst('stackfinder.jp.net')) {
                return byNumber(_ps[2]);
            } else if (_hst('webentwicklung-frage-antwort-db.com.de')) {
                return bySel('.q-source > a');
            } else {
                console.log('check by selectors');
                const cssSelectors = {
                    'androidalle.com': '.item-content > a.track',
                    'answacode.com': '.post__source',
                    'answeright.com': 'a.link',
                    'ask-ubuntu.ru': '.q-source',
                    'askcodez.com': '.orli a',
                    'askdev.info': '.question-text > .a-link',
                    'bootpanic.com': '.entry-content > p > i > a',
                    'catwolf.org': '.text-left.small > a',
                    'code-hint.com': '.fw-bold .link-light',
                    'codefaq.info': '.aa-link',
                    'codefaq.ru': '.aa-link',
                    'codegear.dev': 'p.text-right > a',
                    'codegrepr.com': 'div.content-text > p > a',
                    'dev-answers.com': 'div.post-info > span > a',
                    'errorsandanswers.com': '#source > a',
                    'generacodice.com': '#fontePrincipale > a.link', // site offline / site not found / 2022-07-06
                    'howtosolves.com': '#question .question .source a',
                    'husl.ru': '.source-link',
                    'im-coder.com': '.origlink > a',
                    'iquestion.pro': '.box-body div:nth-child(3) .pull-right',
                    'isolution.pro': '.box-body div:nth-child(3) .pull-right',
                    'itranslater.com': '.body > div:last-child > a',
                    'javafixing.com': '.entry-content > a:last-of-type',
                    'jpdebug.com': '.text-warning',
                    'knews.vip': '.box-body div:nth-child(3) .pull-right',
                    'linuxfixes.com': '.entry-content > a:nth-last-of-type(2)',
                    'narkive.jp': '#postq > div > div > a',
                    'nuomiphp.com': '.alert-warning a',
                    'overcoder.net': '.info_outlink',
                    'overcoder.ru': '.info_outlink',
                    'phptime.ru': '.float-right>small>a.text-muted',
                    'prog-help.ru': '.eclip > a',
                    'python2.net': 'div.user-box > span.fr > a',
                    'pythonfixing.com': 'article > div.post-body > a:last-of-type',
                    'qarchive.ru': 'cite > a',
                    'qarus.ru': 'em > a',
                    'serveanswer.com': 'a[title="Source"]',
                    'sprosi.pro': '#qsource > a',
                    'stackguides.com': 'a[title="Go to Source post"]',
                    'stackovergo.com': '.qeditacti a:nth-child(2)',
                    'stackru.com': '.q-source',
                    'try2explore.com': 'div.tagsandsource span.source a[target="_blank"]',
                    'ubuntuaa.com': '.post-info a',
                    'ubuntuplace.info': 'div.question-text > a.a-link',
                    'uwenku.com': '.post-info a',
                    'voidcc.com': '.source > a',
                    'web-answers.ru': '.source > a',
                    'wikimho.com': '.page-footer .float-right a',
                    'yingqusp.com': '.container > div > div > div > p > a',
                };
                link = cssSelectors[host] && _tc(cssSelectors[host]);
                console.log(link);
            }
    }
    return link;
})().then(link => {
    /** Saves the clone url and the source url in a local db */
    function cbufw(u, s) {
        var count = 10;
        var pos = GM_getValue('b2s-pos') || 0;
        var db = JSON.parse(GM_getValue('b2s') || '{}');
        pos = pos > count ? 0 : ++pos;
        GM_setValue('b2s-pos', pos);
        db[pos] = [u, s];
        GM_setValue('b2s', JSON.stringify(db));
    }

    /** Saves the redirect online and local, redirects to source */
    function run(u) {
        console.log('Redirect link: ' + u);
        cbufw(location.href, u) || window.location.replace(u);
    }

    /** Fixes incorrect link parts, redirects to source */
    var fix = (a, b) => (link.match(a)) ? (run(link.replace(a, b)) || true) : false;

    link = link?.href ?? link;
    console.log('Result link: ' + link);
    if (!link || typeof link !== 'string') return;

    //valid links
    if (/^https?:\/\/((pt|ja|ru|es)\.)?stackoverflow\.com\/questions\/([0-9]{1,12})/.test(link) ||
        /^https?:\/\/([a-zA-z\-]+\.)?stackexchange\.com\/questions\/([0-9]{1,12})/.test(link) ||
        /^https?:\/\/(superuser\.com|askubuntu\.com|mathoverflow\.net|serverfault\.com|stackapps\.com)\/questions\/([0-9]{1,12})/.test(link) ||
        /^https?:\/\/[a-zA-z\-]+\.wikipedia\.org\/wiki\/(?!wiki\/)(.+)/.test(link) ||
        /^https?:\/\/github\.com\/(.+)/.test(link) ||
        /^https?:\/\/www\.npmjs\.com\/package\/(.+)/.test(link)) {
        return run(link);
    }

    fix(/^https?:\/\/((pt|ja|ru|es)\.)?stackoverflow\.com\/([a-z]+)\/([0-9]{1,12})/, 'https://$1stackoverflow.com/questions/$4') ||
    fix(/^https?:\/\/([a-z]+\.)?stackexchange\.com\/[qa]\/([0-9]{1,12})/, 'https://$1stackexchange.com/questions/$2') ||
    fix(/^https?:\/\/([a-z]+\.)?stackexchange\.com\/([a-z]+)\/([0-9]{1,12})/, 'https://$2.stackexchange.com/questions/$3') ||
    fix(/^https?:\/\/([a-z]+\.)?(superuser\.com|askubuntu\.com|mathoverflow\.net|serverfault\.com|stackapps\.com)\/([a-z]+)\/([0-9]{1,12})/, 'https://$1$2/questions/$4') ||
    fix(/^https?:\/\/([a-zA-z\-]+\.)wikipedia\.org\/w\/index\.php\?title=(.+)&oldid=([0-9]{1,12})/, 'https://$1wikipedia.org/wiki/$2') ||
    fix(/^https?:\/\/([a-zA-z\-]+\.)wikipedia\.org\/wiki\/wiki\/(.+)/, 'https://$1wikipedia.org/wiki/$2') ||
    fix(/^https?:\/\/www\.github\.com\/(.+)/, 'https://github.com/$1');

}).catch(console.error.bind(console));
