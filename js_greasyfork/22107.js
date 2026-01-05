// ==UserScript==
// @name			Proxy for ESB
// @namespace		https://lab.mertskaplan.com/pfesb
// @description		Erişim Sağlayıcılar Birliği (ESB) tarafından erişime engellenerek başka bir sayfaya yönlendirilen siteler için otomatik olarak proxy (vekil sunucu) üzerinden erişim sağlar.
// @version			1.3.1
// @license			GPLv3, GNU General Public License, https://www.gnu.org/licenses/gpl-3.0.html
// @author			Mert S. Kaplan, @mertskaplan
// @homepage		https://mertskaplan.com
// @forkedFrom		https://greasyfork.org/tr/scripts/1513-randomproxy/
// @supportURL		https://mertskaplan.com/iletisim
// @contributionURL	https://www.paypal.me/mertskaplan/5
// @icon			https://lab.mertskaplan.com/pfesb/pfesb-icon.png
// @include			*//aidiyet.esb.org.tr/landpage?ms=*
// @include			*//213.14.227.50/landpage?ms=*
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/22107/Proxy%20for%20ESB.user.js
// @updateURL https://update.greasyfork.org/scripts/22107/Proxy%20for%20ESB.meta.js
// ==/UserScript==

var matriz = ['http://proxy.mertskaplan.com/browse.php?u='];
var proxy = matriz[Math.floor(Math.random() * matriz.length)];
var getUrl = window.location.href;
var splitResult = getUrl.split("/landpage?ms=");
var url = encodeURIComponent(splitResult[1]);

document.body.innerHTML = "<style>body {margin: 0; background: rgba(0, 0, 0, 0) url('http://subtlepatterns2015.subtlepatterns.netdna-cdn.com/patterns/footer_lodyas.png') repeat scroll 0 0;}</style><div style='text-align: center; margin-top: 42vh;'><span class='inset-text-effect' style='font-size: 32px; color: #fff; font-family: Helvetica,Tahoma,sans-serif;'>Vekil sunucu üzerinden siteye yönlendiriliyorsunuz.</span><p style='margin: 20px auto; max-width: 450px; color: #eee;'>Bir kitabın yakılması, bir düşünce uğruna hapse atılmak, her zaman cahil bir kuşağın çağın dahilerine ödediği vergi oldu. - Voltaire</p><br><a href='http://mertskaplan.com' target='_blank' rel='author external'><img src='http://mertskaplan.com/logo-mertskaplan.svg' width='auto' height='28'></a></div>";
window.location.replace(proxy + url + "&f=pfesb");