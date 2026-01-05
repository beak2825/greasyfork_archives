(function () {
// ==UserScript==
// @name         Pow! Russian folder
// @namespace    http://blog.krakenstein.net
// @author       daYOda (Krakenstein)
// @description  ifolder / Rusfolder quick download
// @version      1.3.1 [modified]
// @match        http://*.2at.ru/*
// @match        http://*.410km.ru/*
// @match        http://*.4ak.ru/*
// @match        http://*.4file.org/*
// @match        http://*.5055.ru/*
// @match        http://*.adad.ru/*
// @match        http://*.alfa-beta.ru/*
// @match        http://*.allinboxes.ru/*
// @match        http://*.amitrix.org/*
// @match        http://*.amplua.biz/*
// @match        http://*.amvnews.ru/*
// @match        http://*.anmedia.info/*
// @match        http://*.antifile.ru/*
// @match        http://*.antistarforce.com/*
// @match        http://*.anub.ru/*
// @match        http://*.ariom.ru/*
// @match        http://*.artprojekt.ru/*
// @match        http://*.asusfans.ru/*
// @match        http://*.avfile.ru/*
// @match        http://*.bestfile.info/*
// @match        http://*.bmmb.net/*
// @match        http://*.bnserver.ru/*
// @match        http://*.cheaton.ru/*
// @match        http://*.clfile.ru/*
// @match        http://*.dh16.com/*
// @match        http://*.dimitrio.ru/*
// @match        http://*.dipi.ru/*
// @match        http://*.downloaded.ru/*
// @match        http://*.dzerghinsk.org/*
// @match        http://*.ecore.ru/*
// @match        http://*.eligos.info/*
// @match        http://*.esmol.ru/*
// @match        http://*.ev-file.ru/*
// @match        http://*.exfolder.ru/*
// @match        http://*.fbox.org/*
// @match        http://*.feps.ru/*
// @match        http://*.file-store.info/*
// @match        http://*.file.iimedia.ru/*
// @match        http://*.filearchiv.ru/*
// @match        http://*.filefarm.ru/*
// @match        http://*.filefile.ru/*
// @match        http://*.fileget.ru/*
// @match        http://*.files-share.ru/*
// @match        http://*.filewell.ru/*
// @match        http://*.flyfolder.ru/*
// @match        http://*.fo.mynewway.ru/*
// @match        http://*.funfile.ru/*
// @match        http://*.gosxran.tk/*
// @match        http://*.homeunix.ru/*
// @match        http://*.ifodler.ru/*
// @match        http://*.ifolder.ru/*
// @match        http://*.ifolder.su/*
// @match        http://*.ifoldermedia.ru/*
// @match        http://*.ifoldervideo.ru/*
// @match        http://*.ifshare.ru/*
// @match        http://*.ilfolder.com/*
// @match        http://*.inmix.ru/*
// @match        http://*.inoy.org/*
// @match        http://*.int.ru/*
// @match        http://*.internetfile.ru/*
// @match        http://*.interser.ru/*
// @match        http://*.ixrust.ru/*
// @match        http://*.k17.ru/*
// @match        http://*.keepfile.ru/*
// @match        http://*.keyfolder.ru/*
// @match        http://*.kingbooking.ru/*
// @match        http://*.koshkomania.ru/*
// @match        http://*.kubandns.com/*
// @match        http://*.laydown.ru/*
// @match        http://*.lisichansk.in.ua/*
// @match        http://*.load-arhiv.ru/*
// @match        http://*.meetfile.ru/*
// @match        http://*.megauploadcom.ru/*
// @match        http://*.mergefile.com/*
// @match        http://*.metalarea.org/*
// @match        http://*.mptron.com/*
// @match        http://*.musicmakers.ru/*
// @match        http://*.myfiles.ru/*
// @match        http://*.myfolder.ru/*
// @match        http://*.n-folder.ru/*
// @match        http://*.navali.ru/*
// @match        http://*.netshara.com/*
// @match        http://*.networkdoc.ru/*
// @match        http://*.newrap.ru/*
// @match        http://*.news-easy.ru/*
// @match        http://*.nmu-s.net/*
// @match        http://*.nnovgorod.net/*
// @match        http://*.nskpc.ru/*
// @match        http://*.obaldenno.net/*
// @match        http://*.ofru.ru/*
// @match        http://*.ogorod.ua/*
// @match        http://*.onlandia.net/*
// @match        http://*.onona.su/*
// @match        http://*.opendrive.ru/*
// @match        http://*.org.ua/*
// @match        http://*.ownload.ru/*
// @match        http://*.pecho.ru/*
// @match        http://*.peredast.ru/*
// @match        http://*.pikhost.ru/*
// @match        http://*.piratefiles.ru/*
// @match        http://*.pojaru.net.ru/*
// @match        http://*.putfiles.ru/*
// @match        http://*.rapshare.ru/*
// @match        http://*.realbusiness1.ru/*
// @match        http://*.relax-rp.ru/*
// @match        http://*.rocan.ru/*
// @match        http://*.rock.cn.ua/*
// @match        http://*.rublikator.ru/*
// @match        http://*.runningfile.ru/*
// @match        http://*.rusfolder.com/*
// @match        http://*.rusfolder.net/*
// @match        http://*.rusfolder.ru/*
// @match        http://*.rusfoldermedia.ru/*
// @match        http://*.s.holm.ru/*
// @match        http://*.s6p.net/*
// @match        http://*.sabasta.com/*
// @match        http://*.sarportal.ru/*
// @match        http://*.school136.org.ua/*
// @match        http://*.shahtersk.com/*
// @match        http://*.skriptavod.ru/*
// @match        http://*.stalker-pcgame.ru/*
// @match        http://*.subfolder.ru/*
// @match        http://*.supershare.ru/*
// @match        http://*.thesims3.ru/*
// @match        http://*.tokmok.info/*
// @match        http://*.traxdata.ru/*
// @match        http://*.tvmanuals.ru/*
// @match        http://*.ucoz.ru/*
// @match        http://*.ufolder.ru/*
// @match        http://*.ugoo.ru/*
// @match        http://*.uka.ru/*
// @match        http://*.up-file.ru/*
// @match        http://*.upfiles.ru/*
// @match        http://*.upload.drfits.com/*
// @match        http://*.uploads.org.ru/*
// @match        http://*.upshare.ru/*
// @match        http://*.urlgo.ru/*
// @match        http://*.vbrjanske.ru/*
// @match        http://*.vipfile.org/*
// @match        http://*.vipfiles.ru/*
// @match        http://*.vsego.ru/*
// @match        http://*.webfaile.ru/*
// @match        http://*.webfiles.ru/*
// @match        http://*.webzona.ru/*
// @match        http://*.yapapka.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/4912/Pow%21%20Russian%20folder.user.js
// @updateURL https://update.greasyfork.org/scripts/4912/Pow%21%20Russian%20folder.meta.js
// ==/UserScript==

function c1(q,root){return document.evaluate(q,root?root:document,null,9,null).singleNodeValue;}

var yodRus = {};
yodRus.doc = document.top || document;
yodRus.url = yodRus.doc.location.href;
yodRus.timer = 0, yodRus.delay = 35;

function stamp(title) {
  if (!title) title = "Redirecting ..";
  yodRus.doc.title = title;
}

function go(s, title) {
  stamp(title);
  yodRus.doc.location.href = s;
}

function d(s) {
  console.log(s);
}

function yod_wait() {
  yodRus.delay--;
  if (el = c1('.//span[@id="yodcounter"]')) {
    if (!yodRus.delay) {
      if (yodRus.timer) clearInterval(yodRus.timer);
      go(yodRus.url);
    }
    el.innerHTML = yodRus.delay;
  }
}

function download(el) {
  var str = el.search.replace(/(^[\?0-9]+)&/g, '');
  yodRus.doc.cookie = 'ruid=' + unescape(str);
  go(el.href);
}

function doStuff() {
  var el;

  if (window.top && yodRus.url.match(/\/ints\/sponsor\//i) && (el = c1('.//frame[@id="f_top"]'))) {
    go(el.src);
  }
  else if (el = c1('.//div[@id="theDescrp"]')) {
    window.stop(); stamp();
    el.parentNode.parentNode.setAttribute('style', 'display:none!important;');
    var div = yodRus.doc.createElement('div');
    var span = yodRus.doc.createElement('span');
    span.id = 'yodcounter';
    span.setAttribute('style', 'color:red!important;');
    div.innerHTML = 'Redirect in ';
    div.appendChild(span);
    div.innerHTML += ' sec.';
    div.setAttribute('style', 'color:black!important;font-size:20px;font-weight:bold;');
    yodRus.doc.body.insertBefore(div, yodRus.doc.body.firstChild);
    yodRus.timer = setInterval(yod_wait, 1000);
  } else if (el = (c1('.//input[contains(@onclick, "ints_code")]'))) {
    attr = el.getAttribute('onclick'); attr = attr.match(/(http[^']+)/ig, attr); go(attr);
  } else if (
    el = c1('.//a[contains(@href, "ints_code")]') || c1('.//a[contains(@href, "ints/sponsor")]')
  ) go(el.href);
  else if (el = c1('.//a[@id="download_file_href"]')) download(el);
}

yodRus.doc.addEventListener("DOMContentLoaded", doStuff, true);
})();