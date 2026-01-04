// ==UserScript==
// @name        QuickiWiki
// @namespace   http://www.ruinsofmorning.net/greasemonkey/
// @description Quickly look up selected text in Wikiqedia, Wiktionary or Wikiquote.
// @version	1.0 - 2006-10-05
// @include	https://na*.salesforce.com/*
// @include	https://cs*.salesforce.com/*
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/35200/QuickiWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/35200/QuickiWiki.meta.js
// ==/UserScript==



d = document;

// Build QWBox //
qwbox = document.createElement('div');
qwbox.setAttribute('id', 'QuickiWikiBox');
qwbox.setAttribute('style', "display: none; z-index: 1000; font-size: 8pt; font-family: Verdana,sans-serif; text-decoration: none; line-height: 1.1em; position: fixed; top: 0px; right: 0px; width: 130px; background: white; border-left: solid 1px #555; border-bottom: solid 1px #555; color: #222; text-align: center; padding: 3px;");
//qwbox.setAttribute('style', "display: none; z-index: 1000; font-size: 8pt; font-family: Verdana,sans-serif; text-decoration: none; line-height: 1.1em; position: fixed; top: 0px; right: 0px; width: 160px; background: white; border-left: solid 1px #555; border-bottom: solid 1px #555; color: #222; text-align: center; padding: 3px;");
d.body.appendChild(qwbox);

// QWBox Content //
// Selected text quote area//
nlnk = d.createElement('a');
nlnk.setAttribute('title', "From Greasemonkey User Script 'qwikiwiki.user.js'");
nlnk.setAttribute('style', 'display: block; padding: 2px; text-decoration: none; color: #337;');
ntxt = d.createTextNode('QuickiWiki Look Up ');
nlnk.appendChild(ntxt);
qwbox.appendChild(nlnk);
qdiv = d.createElement('div');
qdiv.setAttribute('style', 'border: solid 1px #555; margin: 1px; padding: 2px; background: #dde;');
qdiv.setAttribute('id', 'QWBoxQuote');
qwbox.appendChild(qdiv);


// Define URI encoded GIF icons //
// Wikipedia icon //35x35

/*pediagif = 'data:image/gif;base64,R0lGODlhIwAjAKIAAOTk5PHx8cbGxtXV1bS0tJycnHp6ev///yH5B'+
'AAAAAAALAAAAAAjACMAAAP/eLoswFCFECsExAgGxgsdURCPFWEGwQRCKxCtaBSbuUwZBA4iPbSF0cB2mAw0nELq'+
'NWi6CCKHZXJQLjyBoKv5i0GDFB3g8SMEBkHamCsow76j02CinNU1Owe3/FIWhjdUdwaEQQRcYx1PL4UFYUVUjTM'+
'OIA6KI1BPaQaAE56UhXMTlhmEXlA9KRIAYR9Qcx1NiZlOL3AznjATJTsdib9dT3BKolCeRYcisbKKfKipeAGHYx'+
'RZAmCsAJY8tbbQZiCerCxt2WNtXd3DhSBjRePie+hsGbabuOa++paKyylKqO6BEzfOg75mLgiJCBjEVDtYv5Ylo'+
'hfl2b0hPAqY8/CFjtMaF8LWEar2Y1eshiNiHWqSqce9AhJknfEVo4WTQ17sNSQE6ECsg8C6wPAm4+WjM2z2aLPJ'+
'BwihQk97Krimx8OPdEJP3ZsRgcUrPc9avhlWR2MFr/Ncagm7lZMJcjavhf2iNiqRMy9Aak1zxyyRIjzGsuWr8NH'+
'fIkTJ1iFx+GwZvoakNLZhctzky5gPJAAAOw==';*/

pediagif = 'data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%23%00%00%00%23%08%06%00%00%00%1E%D9%B3Y%00%00%00%04sBIT%08%08%08%08%7C%08d%88%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%04gAMA%00%00%B1%8F%0B%FCa%05%00%00%00%09pHYs%00%00%0E%C4%00%00%0E%C4%01%95%2B%0E%1B%00%00%08%D7IDATXG%9DWmlV%E5%19%BE%CEy%3F%FA%F6%7D%E9%07%85%F2a%82P%A0%99%0AJ6%B7%1F%13%87%8BC%1D%8B3%CELMf%AB%E86%23%DB2%E7%8F%0D%23%B0%3F%FB%B5L%09%C92V%90-%60%C0d3A%137%20%02%C6%8Dnt%06%9CB%D6%04%C1%95%84%96%8F%D2%D2%F6%A5%ED%FB%7D%CE%AE%EB~%CE%5B%3Aa%1F%ED%FD%F6%E9y%CE%F3q%DF%D7%FD%F9%3C%C7%0BI%E3%E3%E3%28%14%8B%F0%F8%0B%F5%0B%02%88%820%04_%C1%25n%3C%EAk%F0Z%DF%3D%3D%0F%A8T%02%D4%D6%D6b%F6%AC%26%1B%9F%2Ay%A3%A3ca%BEP%80O%20%81G%10%01%01%85%15a%20%28%09%09%11p%AC%A6%26%89%80%A3%F9%5C%5E%D2%11R%B8%E6%27%00%D9%BF%90%80%2A%C8%A4%D3%983%A7%D9%C6%A7B~%B1T%84O%B5B%0A%F5%28%21%14%20%BE%D3d%B6%40%8F%9AT%12%FB%0F%EC%C7%A1%83%07%91J%A5%28XH%04%94O%92%3D%B5%90O%DF%F71%9E%CB%D9%F8T%C9%1B%1A%1A%A6W%9C%5B%3C_%16%A8q%DA%0AK%18%D0U%1E%EA%EA2X%B3f%8D%B9%60%EF%DE%BD%18%1A%1Eqk%B8%C8%1E%A4%1C%01%C8%2A%22%CD-Zx%B3%F5%A7B%DE%95%2BWhmjI%8DF%B3Y%BC%F9%D6%5B%A8%15%20NR%94%81J%F2%FD%E0%3B%EF%98%D6%F7%DE%FB%15%14%0At%15%C9b%8A%94%CF%E7%F1%F0%C3%DF0E%0C%10-%B4%E8%E6%0567%15%F2%06%07%05%26%40%3C%16C%DF%F9%3E%AC%7Bn%1D%EA%EB%EBm%B2%1A%0F%22%B9G%16%2C2%BEb%F1%B8%BD%17%19%F4%C5b%01%D9%91%2C%B6%BD%BA%03%0D%0D%0D%28%97%CB%B6%AFe%D1%C2h%E7%FFO%DE%C0%C0%20%F7%CA%FF0%E6%A7O%9FF%9C%C24%26%2CU%EBT%9F%3EA%F7%F7_%C2%AE%9D%3B%F1%B9%3B%EF%C4%7D%AB%EF%C3%D8%F8%18%96.m%B59s9%D7%B5%2C%9A%86%9B.%0F%0C%84J%E5%90%B1A%2F%20%16%8Bs%98%DC%18%A43%EA%EA%100%5D%AF%8Ef%0D%98%FE%25kRx%F7%DDC%E8%D8%BA%15%2Fm%DC%84%E5%CB%97%9B%12%A5%92%2C%C2%18%B3%F8%93e%16%F195%F2M%7B%09%22%83%A0%12%3A%D3%93q%8Eq%F0T%7B%1B%5E%7C%F1%27H%A73%14Vd-%2A%D1j1%1C%F9%F3%11%8B%A3%15%2BV%405J%7B%E4j%C5P%84yZD%5B%C8%1DbB0%D6%E7%08%B5%AB%A3U%3Es%EB%AD%E8%EE%EE%C6%F1%E3%C7%90H%24%D9%E28%7B%F6%2CN%9E%F8%C8%02Y%C1jA%1C%A5%B8Q%C4k%3A%E4%2C%C3%8E%03d%D0%28%00%A6%F1%D3O%3Fc%19%B4%AD%A3%83%D6I%1B%C0%CD%AF%BCl%B1%F1%CDG%1F%B5t6%18%E6f%29%E2%DA4%B1%08%8C%18%B0gM%B6%11%85%CC%8A%0A%1A%98U%8F%3D%FE8%06%07%07%B1%7D%FB6l%DD%FA%2B%F4%F6%9E%C3%13mm%06.%88%2Cc%7B%0C%84%EB%1B%A0i%90w%F1%D2%25W%F4T%DF%C9%CA%B1%D3%91%E0%18%CE%9D%3B%17%1B6%BC%843%CC2%8D%29%607n%FA%29%B2%83%E7%91%88%99h%1B%AF6%E3EV%B3%E7%B7%DA%FE%A9%90w%E1b%04%86%E4%E4%3B%01%3E%B3J%96%E9%EA%EA%C2ov%BC%CA%C2%A6%12%EF%21%93I%E3%07%CF%B6%A13%BB%0A%7F%3A%15c%B8%C8%AD%02%A2%FDUPZ%C9%F3m%D2%B8%5BSU%F2%DA8%1D%80%CF%2FIas%7B%1A%DE%F9%0B%17%0DL%F5xQjK%60%7F%7F%BF%C5%CA%09%06k%8C1%B2%96%F1%A3%8Cz%7Dg%07%C6%97%7C%1F%B9%05%8F%A1%06e%85%8B%9Dk%26%98%8C%ED%29%5E%D1%21%2A%9E%022%190%FFO%F4%95%2C%D9%5C%88%07%3F%9B%84%D7w%FE%02%C7%5C%9DQ%DA%F6%F6%F6b%DF%1F%FF%80%A3G%8F%12%A0%C7z%D1%82%1F%AF_o%C1%2B%CA%5E%EE%C1w%DEX%8C%20%5EO%ED%99%CE%FCI%BA%98%DA%01%2A%10%96%97%D1%18%A7%2B%16%01N%86%40%EAv%A0%3EXJL6%A7%954%06%A6%EA%A6d2%89%17~%F4%3C%06%06%06%ECHhko%C7jV%D8%E1%E1aTT%E6%B9f%D6%0C%E0%5B%AF%CD%C7%C887%FBR%8F%83%D4%D0%2C%24%60%11%08%'+
'F7%94E%04Wh%04%C00%D9%CD%40V%14%00%81%D1Zy%C6%EB%ED%3B%1F%81%F1%E8%0E%DF%CE%96%BFu%1D%C5%23%0F%3D%80%A1%ABE%5E%07%F2%26O%9Cd%D6%C6%DA%0A%9E%D8%7D%13M%EB%83%CB%27%C6%0D%93%B1%11%00%1E%9E%05V%EE%3Cm%C7%B9T%22D%26%C9y%03D%90%B6%C7%F5%5D%C0%B3%FA%F3%5D%EC%CC%1DZ%AA%22%26%40%8F%7Cm%15%BE%B7%9BgU%21%87%B8i%3FI%E0D%9F%3F22%ED%C4Dc%8A%1D%0E%14%8A%21%EEf2%BD%BF%89%8Am%AC%E0%BB%F7%84%04fKl%9Fm%10%F0%C9D%08%BE%90%19%3A%AE%14%A4Y%E9%12%9E%DC%95%C1%7B%1F%27%F0%D0%B6Fj%1F%22f%3E%26%9Bj%D3r51%89%C6%8C%B7%90%91K%96.%FC%F6%2A%D6%A9%DA%10M%99%10%EB%BE%1C%60%B4%A0uU%ABT%F7%FE%3B%22_%17%26%81%E1%124%A5%CBxfO%13N%F4%C5%D0%98%AA%A0P%0A%F1%C0%2F%EBy%13d%AA%9B%D6%025%09%98%01%8A8%EB%9D%40J%E5%00%F3%1AC%DC%D1%12%A2w%088%D8%ED%21Y%0B%AC%BE%8D%96.s%85%AE%B5R%8E%DE%10v%F3%8A%29A0%BA%3C%A7%D3%B5%A8M%04X%BB%BB%11%1F%F6%26%90%8AWP%A6%E0%B8%1F%20G%93%AF%DE%92%E1%E1i%12%9DVU0%F6%EE%ACb%E3%DC%93%2Byh%BF%CBi%FC%C61%1F%AFw%C9%DE%B4%D4%97BKa%25%916T%AF%B5%22%F1%91E-f%E647%A3y%DEB%FC%FE%87%0Dh_%F6%09%CD%5C2%E6%C5R%80%25%B3Ct%BF%DC%8C%D6%A5-X%B2x1f%DF%D4%CAL%28%D8v%07%8A%1Dj%A6X%11%5D%A5%C0%27%230%BF%7B%DF%C3%E1n%AE%2B%02%2Bo%0BQ%9Fb%29%E4%95%C4Y%85%EBe%95%08%94x%19%98%C94%96%AF%20%FB%CFN%04%2C%8D%BAR%14%8A%E5h%E6%1A%B9%10%23%136sU%C40W%A2%3B%96%85%A8%A1%5B%3E%FC%C4C%7F6D%9AY%B4%A7K%B3%1E%9E%BA%9B%070%81U%01%98%91%D4%8F%40%5D%07F%CB%04d%A4%A7%13eV%DCO%C5%98%91%18%E8%AA%2B%3E%CEM.%9D%AF%E6C%AC%5D%E96t%BC%C7RA%EE%8C%10%FC%FA%B0%0D1%A8Y4y%AAh%CF%E4%2F%0A%D3%8E%CF%EB%C0%8C%12%FA%F0h%01%23%CC%C5%8B%1Fw%B2%5E%14%A2%99k%B4vU%921%15%A2D%CB%09%88x%2A%C6%EAR%CE%1D%01%B5%2Fs%EE%C1%3BB%7C%F5%F6%10%8B%E7x%B84%0046p%9E%29_%A4%22%22%29%25%EB%E8%BF%DCl_%94n%CA%D1%07gF%B0%E7%2F%254%A4%5D%1A%D6%24%7C%7C%E1%96%26%C6%8F%9B%97%B6%97%B3%01%85%FB%D8%B2%7F%94i%CF%2C%E0%27%CE%18SWA%FA%C2%FD%0AGj%99%AC%B2%958%12%01%94%C8%E3%D0%3FB%3C%B7%2B%C4%CCZ%17%3B%B2%8AV%AA%7B%1D%18%D1%B9%C1%0A%F6%9D%8C%99%A6%9A-D%40%8C%B8I%00%E2%04%25Wm9p%95i%0F%5C%1C%F1p%F2g%01f%CE%F0%B0%95n9r%8A%C7K%5C%C0%B8%8E%5E%98%5B%1Fbs%1B7%F1o%C9%F3ed%18%CC%3Eg%CD%A9%E6%26%9B%BA%9E%16%CC%8A%E1%FEe%25%0C%8D%C9%DC%14%1C%8B%1AW%C7M%03%07%84%1F%9AX%7BO%1A%23%CC%A0%BBZ%A9m%237%F3%3E%FF%F3%7D%21%3E%3A%17%E2X%0Fp%BC%27%C4%DF%CF%06%D8%D5%19%A2%7F%88%1B%29%B7m%A5%8F%1C-%29%20%5E%D52%D4%FA%86%60D-%CD%09%AC%B9%BDde%9C%F7s%D7dj6m%E6u%D8%EA%C6%F6%C3c%A6%D8%FA5%DA%E5%E1%C0%07%B4%1CW%A4%12%CE2%BA%80%25%13%1E%9Ah%B1%DF%1E%E1NJ%DC%F0u~%02%B3~%09%80Y%C6%9E7%88%99OSO%7F%19g%FAcv%2C%88%E2%F4I%DF%95%00cE%1F%AF%EC%CB%A2%86%3E%93%9BT%AD%F3t%A7b%2AS%C3%85dk%1AGY%231%2C_%A6%94x%A5%09%D6%A9%25%2F%B9%FB%D4%FF%04s%23%DAqh%14%BF%D8_a%D5%A6%A2%8E%8B%C5%96%E3%14%B1%E38g%0C%84%9A%40%E9%A9%12%20%8B%E8%A7y%AB3j%7C%FF%8Fn%FAo%D4qx%9C%E67y%E4C%03SBU%27%09%9D%B0F5%1E%D8%AA%7D%FB%1C%89%80%D8%1E%ADcS%29%98%16%98%2F%DE2%03%A3y27Id%1B%01P%813%ED%23%C1F%12%16u%D5%D7%CC%C4%1A%CD%B1%8D%91W%EB%3C%DE%A7%F92%B1v%2A%F4%EC%8E1%FC%F5%14%BF0i%21%231%8E%BA%A6%B5%3A%93%C6%26%FAzF%22%F5%2C%F1%24o%9D%1F%C7%DB%EBg%E2_%7Bf%FD%3CP%E0%E5%2B%00%00%00%00IEND%AEB%60%82';

// Wiktionary icon //
tionarygif = 'data:image/jpeg,%FF%D8%FF%E0%00%10JFIF%00%01%01%01%00%60%00%60%00%00%FF%DB%00C%00%01'+
'%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%'+
'01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01'+
'%01%01%01%01%01%01%FF%DB%00C%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%'+
'01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01'+
'%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%01%FF%C0%00%11%08%00%23%00%23%03%01%2'+
'2%00%02%11%01%03%11%01%FF%C4%00%1F%00%00%01%05%01%01%01%01%01%01%00%00%00%00%00%00%00%'+
'00%01%02%03%04%05%06%07%08%09%0A%0B%FF%C4%00%B5%10%00%02%01%03%03%02%04%03%05%05%04%04'+
'%00%00%01%7D%01%02%03%00%04%11%05%12!1A%06%13Qa%07%22q%142%81%91%A1%08%23B%B1%C1%15R%D1'+
'%F0%243br%82%09%0A%16%17%18%19%1A%25%26\'()*456789%3ACDEFGHIJSTUVWXYZcdefghijstuvwxyz%83'+
'%84%85%86%87%88%89%8A%92%93%94%95%96%97%98%99%9A%A2%A3%A4%A5%A6%A7%A8%A9%AA%B2%B3%B4%B5'+
'%B6%B7%B8%B9%BA%C2%C3%C4%C5%C6%C7%C8%C9%CA%D2%D3%D4%D5%D6%D7%D8%D9%DA%E1%E2%E3%E4%E5%E6'+
'%E7%E8%E9%EA%F1%F2%F3%F4%F5%F6%F7%F8%F9%FA%FF%C4%00%1F%01%00%03%01%01%01%01%01%01%01%01'+
'%01%00%00%00%00%00%00%01%02%03%04%05%06%07%08%09%0A%0B%FF%C4%00%B5%11%00%02%01%02%04%04'+
'%03%04%07%05%04%04%00%01%02w%00%01%02%03%11%04%05!1%06%12AQ%07aq%13%222%81%08%14B%91%A1'+
'%B1%C1%09%233R%F0%15br%D1%0A%16%244%E1%25%F1%17%18%19%1A%26\'()*56789%3ACDEFGHIJSTUVWXYZ'+
'cdefghijstuvwxyz%82%83%84%85%86%87%88%89%8A%92%93%94%95%96%97%98%99%9A%A2%A3%A4%A5%A6%A'+
'7%A8%A9%AA%B2%B3%B4%B5%B6%B7%B8%B9%BA%C2%C3%C4%C5%C6%C7%C8%C9%CA%D2%D3%D4%D5%D6%D7%D8%D'+
'9%DA%E2%E3%E4%E5%E6%E7%E8%E9%EA%F2%F3%F4%F5%F6%F7%F8%F9%FA%FF%DA%00%0C%03%01%00%02%11%03'+
'%11%00%3F%00%FE%DA~*x%9B%C4%DA%A7%8Al%BE%1C%F8GP%9FHaa%0E%A9%E2%1DZ%C5%BC%BDC%CB%BCy%23%'+
'B0%D3%2C%E7%DA%CFfeH%25%BA%BB%9E%20%B3%B4oo%14rF%AD1l-%2FJ%F8%BB%E0T%B8%B5%D259%BCEc%7Dj'+
'%D0%C1%0F%89%AE.5%23%A3%DF6%D3%1E%A3k%3C%8Co%25%8DAq6%9D-%C1%B5%99%99%1C%18Ll%25%EB%7C.l'+
'5%DF%8B%FE5%D6t%F7%17%96%B6p%E9zT%B7%3B%3Fru%3D*%D5%AD%EF%60%B6rH%9A%2By6D%D2(%0An%16%E1'+
'%14%B8M%C7%DF%80%E9%9C%1C%0FO%F3%FC%85%7D%5E%230%A7%96a%B0Ydr%EC%25jR%C0%E118%C5%89%A2%9'+
'Dj%B8%8CE(%D7n%A4%DCcZ2%A6%A7%CBN1%9Cc%18r%C5%A6%B4%3E%23%07%95%CF7%C4%E3%B3Z%99%96%3A%95'+
'U%8F%C5%E1%B0U0%98%99%C2%95%2C%26%1A%B3%C3%C2%14%A0%A6%E8N%15%15%3Ej%B2t%E4%EAM%CA%5C%F7z'+
'%FC%AD%A6%F8%9F%E2%A7%81%F5K%7B%EF%19%5D%CD%E2%9F%0E%5D%C8%CB%A9%24Z%5D%ACz%8E%93%BDN%CB%'+
'BD7%FB%3A%DE%DF%CE%8A%07%08%B2%D8H%B3%19!%2C%60%91fE%DD%E8%DE%18%F8%D9%E0%FF%00%12k6%FA%1'+
'3E%AC%E8Z%85%EB%F9Zl~%20%D3%FE%C1%16%A50%1B%846%B7)qs%09%B9a%9F.%DA%E1%E0%9A_%BB%0AH%F8C%'+
'EBw%16v%D7hc%B8%869P%E4a%D0%1E%BF_%C7%F3%AF%9F%BE4%F8%23Jo%0D%DCj%16%91%A5%A5%DD%A876%D3%'+
'C4%02Koso%89%AD%E7%89%C6%0A%C9%0C%C8%B2%A3%0Cme%CEx%00%98j%99%3Ew%8A%A3%86%C5%60%7F%B3%F1x'+
'%9E%5C%3D%2CN%01%C2%96%1E%15ex%D2%A9%3C%22%82%A76%E4%E3%1A%8A.%9B%9C%15%F9%94%EF\'x%9C6w%90'+
'%E1j%E2%B0Y%8C%B1%F8%3C2x%8A%D8L%C5O%13%88%9C%22%A1%ED%A9%D1%C6Jn%AD%25(%C6R%82%93%A9%08M%'+
'B7%CA%E3\'%15%F4%40u%3C%83%FA%1F%F0%A2%B9o%05%EA%93%EB%FE%10%F0%C6%B7q%81q%AA%E8%3AM%FD%C7%1'+
'8%CD%C5%CD%942%CE%C0c%80%D2%B3%B2%FB%11E%7C%95_kF%ADJR%A2%E5*U%25NRS%8AM%C2%5C%AD%A5gd%DAmk'+
'%A6%9D%99%F6T*R%C4P%A3%5E%0D%F2W%A5N%B4.%EC%F9*%C23%8D%D5%B7%B4%B5%F4%F5%B7%CF%DF%00%B5kM*%'+
'1DOD%D4%DCZ%EB%16%BA%AE%A7g%A8%A4%E4%24%C3P%8A%FAsp%24W%C3o%92L%BE%E2%5Bxu%60J%B85%F5P%20%A'+
'8!%86%D2%06%18%10F%3D%8FC%5EE%E3%1F%84%1A%07%88%AF%EF%3CC%A7%B5%EE%8B%E2%A9%EDdT%D4%F4%EB%C'+
'9m%AD%EEob%B7)cq%ABY%05xo%7C%A9%164%96LEr%F6%EB%B1%A6%7D%91%85%F1Q%F1%2F%E2%06%9C%9F%F0%86%'+
'DE%F8W_%7F%16%C6%0D%A2ZAas%3CWN%BF%BB%176%BA%82%A1%B1%96%C6BC%AD%EF%DA%04%0B%13%06%99%E3%60'+
'%CA%3E%C2%BE%12%8F%13W%9E%3F%01Z8%7CC%84*c%F0%98%B9S%A2%A8%B7%F1%D5%A1S%9F%F7%B8xIJ%F2%7C%A'+
'E%11%94y%D4y%95%FE%1F%09%8F%AB%C2%98zyniFu0%B4%FD%A5%3C%B7%19%86%85lG%D6%23%19G%D9P%AFN4%EF'+
'K%178%CE)S%D5Tp%94%A0%E4%96%9FUj%9E%26%D1%B4x%25%9E%F2%F6%14X%81%2C%0B%A8%3F(%24%F3%C0%1C%0'+
'3%93%CF%23%81_%2F%F8%DF%C7W%DF%14n%97%C1%5E%09%B7%96%FA%5B%E6%10%5C%5E%C5%1B%B6%9F%A5%D9%CA%'+
'DB\'%D4o%EE%B6%88c%8A%DE%17y%15%0C%82%5B%87T%86%05wp%2B%AF%B0%F8%17%3E%AC4%CB%EF%19%F8%A7Y%BF'+
'y%22%B7%B8%D6%FC%3Fj%F6%D1is%5E%93%E6%CFf%B7%A8%82%F5%B4%D5b!%91%11%D5%EE%15%1F%13%2CR%95%1F'+
'C%DBZ%5B%DAF%B1%5BA%0D%BCj%AA%AB%1C1G%12*%A2%AA%A2%85%8DTa%15B%AF%A2%80%07J%E7%A3%89%CA2Y%D3'+
'%AD%84s%CDq%F0%E7%94%2BTR%A1%84%C3U%8C%92%A5%25%07%07%3CSN%F3%D2T%A1h%C3%DF%9F4%94%7B%2Ba%B3'+
'%CC%FA%95Z%18%B5%1C%97-%AA%A9%C6t%A2%E9%E2q%F8%AA3Jub%E6%A7%C9%82%BA~%CE%EE%15j)9%7B%90QNY%D'+
'A6%99o%A2%E9%1A%5E%8Fi%9F%B2%E9Z%7D%9E%9Dn%5B%86hl%AD%E3%B6%89%98vgH%C30%ECI%E0t%A2%B6%A8%AF'+
'%9C%94%9C%E5)%CD%CAS%9C%9C%A5%26%D5%E5)%3B%C9%BD7m%B6%7D%7D5%0AT%E9%D2%A7%05%18S%84i%C2%2BE%1'+
'8B*1%8A%D3D%94R%5EI%05%40%E7%82%7D%DC~%83%B7O%AF%AFz(%AC%A7%F0%CB%FC%2F%F22%A8%DAZ6%B6%DB%FCQ'+
'%FF%006L%A3%0A1%E8)h%A2%A8%A8%EB%18%DF%F9W%E4%14QE%05%1F%FF%D9';


// Wikiquote icon //
quotegif = 'data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%23%00%00%00%23%08%06%00%00%00%1'+
'E%D9%B3Y%00%00%00%04gAMA%00%00%B1%8F%0B%FCa%05%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%20c'+
'HRM%00%00z%26%00%00%80%84%00%00%FA%00%00%00%80%E8%00%00u0%00%00%EA%60%00%00%3A%98%00%00%17'+
'p%9C%BAQ%3C%00%00%00%06bKGD%00%FF%00%FF%00%FF%A0%BD%A7%93%00%00%00%09pHYs%00%00%0E%C3%00%0'+
'0%0E%C3%01%C7o%A8d%00%00%00%09vpAg%00%00%00%23%00%00%00%23%00*C%BD%F0%00%00%06%98IDATX%C3%'+
'AD%96%7Fl%5EU%19%C7%3F%E7%9C%7B%DF%B7%BFh7Z%CA%D2u%C8%D0%2C%81%C1%EAH%16p%0E%81%04%AD%B5%90'+
'tM%20Y%20%5B%10u0T%A2%FF%E0%1F%C4%90%182%25%231%131%8Baq%FE%C0%02i*%CC%F1%C7H6%16%C9%C0%9A%'+
'B1%01%22.%DB%D4%AD%AD%5D%BB%B6%EB~%D8%F6%7D%EF9%E7%F1%8Fs%2Fo%5B%E7h%DF%EE%24O%CE%3D%CF%3D%'+
'3F%BE%CF%EF%87%C7%1F%7F%14k%5D%DE%7B%FFCk%E5%98%88L%ED%DB\'%C9%FD%F7K%F1%B6%DB%A4x%D7%5DR%DC'+
'%B6M%8A%93%93R%14%91%A2s%BE(%DE%17E%24%91%CD%9B%BD%80%97%CAJ%2Fq%1C(%8AJd%8C%881%22Z%07R*%1'+
'0%84%D9%98%01%0F%CFy%A5j%05%20I%AC%F1%5E%BA%9D%13%11%11%B7uki%EF%F4y%EDZ%91%C1A%11%11%11%EF'+
'%7C%F8pN%A4%AD-l0%26%CC%F3%23%97%CE%07%3C%5C%85%F7%F2%03kED%24%D9%BBW%1C%04!%A6%0B%14E%E1%E'+
'C%ED%B7%8BLM%A5%80l%40%2F%FD%FD%22%8D%8D3%91%CF%9D%BC%40Q%40%3C%FC%1C%EF%E5H%0A%C6m%D8%10%F'+
'6d%8FO%A7%5C.%CC%CF%3C%130X%2B%22I%12%16%CF%3E%BB%10%ED%F8t%1E%C4%7B9\'%E9%BD%2BV%84%FFZ%FF%E'+
'F%99L%E8%E6f%91%F1%F1Y%E6%EA%EB%13%A9%AD-W%3B%19Y-B%0E%E0%FCy%18%19%01%08%7Ff%0F%110%06%FA%F'+
'B%E1%AD%B7%02%CF%8B%02%EF%A1%B9%19%D6%AC%09L%AD)s%18%ADT%F8%CA%E5%A0%A2%E2%F2%BB%B3%BD%FB%F7'+
'O%03%ED%7DX%DCx%E3%CCMe%0C%9D%5DZS%03%CB%96%5D%5E%B8Lc%C7%8F_%E2%DD%FA%FA%D2%3E%40%14%F8i%24'+
'*%F0%2F%0BF)p.%2Cn%BDun%C2%8D%8D%CD%04-%80%9B%9C%C0%12%1EV%80%12%D0%D3HI%E0%3B%05V%A7%00%2F%'+
'A5%99%EC%F1%F6%F6%FF%EF3%D3G%3E_R%81%E8p%D8%F4%BEG%04h%0F%C5X3T%17%F1%8F%06%C3%D1k%14\'%EB%23'+
'%C6j%0C%DEh%8C(%22%1F%00B%00%26%E9%FB%91HI%C2%D6VX%B5%0A%3E%F8%20%F02w%98%ED3%D7_%9F%5Ed-q.b'+
'%A2%F7%20%7F%3E%B9%9F7%DAc%0E-%11N.%D2%9C%A9%14%0AFp%0A%22%F1T\'%8A%A6%8B%9A%1B%C6%E0%8B%03%9A'+
'%7B%8E%7Bn%19%F4%C4%D6%07%CDjP%CE%C9%24P%91EKW%17l%D8%00Q%04%D6%CE%04%93%F1v%ED%82%8D%1B%1D%D'+
'E%19.%BA%0B%7C%F9%17_%A2%F7%EC%11t%8D%C6\'%1E%1C%E0)%D9A%A5%A4%01%93%CE%89b%E5%B0a%E3%87%9A%87%'+
'0F9%AE9%EFP%A7OK%F1%DAk%89%B3%87%A3%08%1Ey%04v%EE%848.%25%01c%A0X%84%E5%CB%E1%BD%C3%8EEu%86%89'+
'd%92%F5%2Fu%B0%F7%E8%5E%A2%0A%03%CE%7D%E2%A8r%09%BFS%B3%7C%87%18%24%07%0D%E3%86%C7%FE%A2E%AD%5'+
'E-%D2%D5%05%2BV%94%CC%92%24%F0%E0%83%D0%DD%1D%CC%95%01%CA%E7%A1%A7%C7%D3%D6%A6%19%BAp%86%CE%97'+
'%3B8x%E2%20QU%84%F5v%FE%A1%9C%3A%B7%8D%80%1C(%10%A9%AB%83\'%9F%0C%1Ail%0C%A0%B4%86%7D%FB%60%C7%'+
'0E%E8%EB%83%95%2B%E1%3B%DF%15V%DD%A285%DE%CFW%7F%FD%15%3E%1E%FC%B8l%20%B35f%04TH%FD%01%40m-%AC'+
'%5B%17%F2%D7%F2%E5%B0xqp%E8%9Bo%06%EF%05%AD%15Ek%B9%F3%C5%3Bx%F7%9F%EF%12%D7%C4%24.%E1J%0D%15%'+
'CAI%D0D%96o%20%F8%88s%C1T%9D%9D01%E9%A8%AA4%BC%F1%F7%3D%B4%FF%EA%DE%2B%0E%04%20%CA%F2%8As!t%B5.'+
'%85uE%05%B4%B4d%E5%22x%E4%D2E%CD%98%D8%E0%9CC)%85%7CZR%9Ao9%98%9E%EE%9D%0B%E1%9Bi%C9%98%2CUk%BC'+
'xZ%96%B4%F0%F4%3DO%E3%FF%E31%18%D4%02j%D1e%C1(%15%1E7%26%14%CE%A9)8q%A2%044%03%F4%D4%9DO%B1%ADc'+
'%1B%B6%60Q%5E%A1%95%BE%22%60T%E8%89%C2b%A6%CFx%9C%13%DA%BF%26%FCqO%00%A3%D0%A04%D6%5B%22%1D%D1%F'+
'D%B7n%1Ez%F5!%A6%DC%14%3A%0A%40%17%04Fk%91%2C%BFTV%0A--%8E%96%16%C3%0D%9FU%5C%5D%0F%13%93%B0%BE%'+
'03%96-M%01)%07h%ACwD%3A%E2%EDSos%DFo%EEc%BC0%8E%8A%16%E6C%0ADV%AF%86-%8F9%DA%DA5K%9BT%9A%CB%FB%8'+
'0%A3%C0%10%9C%9B%84D%A0%E6%0E%A8%B8%09%C4%822%24%DE%12%EB%98%03%FF%3A%40%EB%AEV%0AR%08NMy%80%D4%'+
'2B%AFH%D2%D9%E9%22c%0C%F81dd\'n%F4%F7P%F8%2B%B8%22%08%18%A3PJ%C0TB%D3O%A1%FE%5B%20%0E%94%26q%96%D8'+
'%C4l%7Fg%3BO%BC%FE%04%A6%CA%E0%BC%2B3%F9%89%9D%10L%A5%1B%7B%0D%3D%B8%19%5D%1C%02%AD%D2%1A%1F%7C%A'+
'4%14n%1E%AC%87%C6o%C3%D2%9F%A5%1ATiW%EDY%B3c%0D%87%07%0E%A3s%E5%F9%8Fvb%94%3A%FB%5B%A2S%1Dh7%0Cq%'+
'94%F6%14%A9%B9%C4%96%08%09%D5s%F8y%E8%FFF%1A%8C%82%13%87%D1%86M%9F%DF%04%96%B2%A3K%9B%E2q%F8%F7%F'+
'7%C2%BDZ%A7%8F%3A.%DD%24%0AH%12%00%9Dy%11%86%7F%0Cht%BAw%EDuk!O%D9f%D2%8C%FE%12%EC%08h%13%FC%60.C'+
'l%C8%DDC%3F%82%C21%D01%00%0DU%0D%E4%E3%3C%22%82B%95%01f%EAP)%AB%CDy%08%A8%08%DC%04%9C%7Di%1Awa%A5A'+
'%A3%F2e%1EM%BB%A4%A9%23%9FpF\'F)%24%E5%87%B7%A6%FAn%8B03j%E6%9C%A2%80h%09%99q%DF%3C%F1%26%14%C0hS%8'+
'Et%5E%D3%B0%E5%145%EB%20%B1%82%8A%D3(%FA4%1C%26%84%B9%D2%B8%C5%1B%89%81%E1%8B%A7y%A1%F7%05%C81%DF%'+
'B0%CET8%A2EW%F5%F0%99.%A8%BA%C9%92%24%82%A8TKz%16%B0%B4%A3V%26%F4%17%CE%E3%9B%9ECW%7F%01%10%1E%DD%B'+
'D%85%81%B1%01Ll%E6%03F%80%ACM%DC%AD%DC%C5%23%95%AA%BAe%8F%F2%13w3%BC%D53%FA%BC%26%19%0F%25%3C%EB%9E'+
'%B3c%A2%D2f%B8%19i%DA%8E%AA%5B%CF%85%C296%F5%3CL%CF%FB%3D%E5d_%9FJ%7D%08%A1U%D9s%7FB%E5%9Aju%FE%BA%'+
'9F%A0%A2%07H%06%171%FE%3B%CD%F9%DDP%3C%06n%3C%9C%D1WA%EEsP%F7%00%B2x%13*%BA%9A%DE%FEw%F8%FA%1F%BE%C9'+
'G%03%1F%11W%C78%E7%E6de%04%94R%02%5C%F0%E2_S%A2%BE%0F%8C%FC%17%84%87%3B%E9%CA%EA%C3%FD%00%00%00%25tE'+
'Xtdate%3Acreate%002011-01-11T19%3A40%3A37-05%3A00%93%91S%DB%00%00%00%25tEXtdate%3Amodify%002011-01-1'+
'1T19%3A40%3A37-05%3A00%E2%CC%EBg%00%00%00%00IEND%AEB%60%82';


// New Tab icon //10x10
//nwgif = 'data:image/gif;base64,R0lGODlhCgAKAIAAAF1zuP///yH5BAAAAAAALAAAAAAKAAoAAAIUTICJpso'+
//'GT4ps0gWolG3d93GNUQAAOw==';


nwgif = 'data:image/gif,GIF89a%0A%00%0A%00%F7%00%00%5Ds%B8%FF%FF%FF%00%00%00%00%00%00%00%00%00%00%00%00%'+
'00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%'+
'00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%'+
'00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%0'+
'0%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00'+
'%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%'+
'00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%0'+
'0%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%'+
'00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%'+
'00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%'+
'00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%'+
'00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%'+
'00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%'+
'00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%'+
'00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%0'+
'0%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00'+
'%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%'+
'00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%0'+
'0%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00'+
'%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%'+
'00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%0'+
'0%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00'+
'%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%0'+
'0%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%2C%00%00%00%00%0A%00%0A'+
'%00%00%08%12%00%03%08%1CH%B0%A0%C1%83%08%13*%5C%C8%B0a%C2%80%00%3B';

mpjpeg = 'data:image/png;base64,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';


sgif = 'data:image/jpeg;base64,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';

docWiki  = 'data:image/png;base64,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';
 
var thisURL = document.URL;
var thisURLID = thisURL.substring(thisURL.lastIndexOf('/')+1);
var thisURLEdit = thisURL + '/e?retURL=%2F' + thisURLID;

var HIDDEN_DIV_ID = 'embtdiv';

productArray = new Array();
var productURL;

if(thisURLID.indexOf('.html') == -1 && thisURL.indexOf('/email/') == -1 && thisURL.indexOf('=Solution') == -1){

	GM.xmlHttpRequest({
	    method: 'GET',
	    url: 'http://docwiki.embarcadero.com/' ,
	    headers: {
   	     'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
     	   'Accept': 'application/atom+xml,application/xml,text/xml',
   	 },
   	 onload:function(details) {
      	     var s2 = new String(details.responseText);
		   var document = appendToDocument2(s2);

		   s2 = s2.replace(/\r\n/g,'');

		   var pattern = /a href="/g;
		   var result;

		   while((result = pattern.exec(s2)) != null){

			   var theLink = s2.substring(result.index + 8, s2.indexOf('_blank',result.index + 1)-10);

			   if(s2.indexOf('_blank',result.index + 1) != -1){

				   productArray.push(theLink);
				

			   }

		   }

		   //
//Get Product Names
var product = document.evaluate("//div[@id='00N33000002QIOa_ileinner']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

if(product.snapshotItem(0) != null){

	product = product.snapshotItem(0).textContent;

}



var productURL;
var isYear;


switch(product){

	case 'ER/Studio Data Architect':

		productURL = 'ERStudioDA';
		isYear = true;
		
		break;

	case 'ER/Studio Team Server':

		productURL = 'TeamServer/ERStudio';
		isYear = true;

		break;

	case 'DBArtisan':

		productURL = 'DBArtisan';
		isYear = true;

		break;		

	case 'Rapid SQL':

		productURL = 'RapidSQL';
		isYear = true;

		break;		

	case 'DB Optimizer':

		productURL = 'DBOptimizer';
		productVersion = '';
		isYear = false;

		break;		

	case 'RAD Studio':

		productURL = 'RADStudio/Seattle';
		productVersion = '';
		isYear = false;
		

		break;	

	case 'Delphi':

		productURL = 'RADStudio/Seattle';
		productVersion = '';
		isYear = false;
		

		break;		

	case 'C++Builder':

		productURL = 'RADStudio/Seattle';
		productVersion = '';
		isYear = false;

		break;	

	case 'InterBase':

		productURL = 'InterBase/XE7';
		productVersion = '';
		isYear = false;

		break;		

	case 'HTML5 Builder':

		productURL = 'HTML5_Builder';
		productVersion = '';
		isYear = false;

		break;		

	case 'RadPHP':

		productURL = 'RadPHP/XE2';
		productVersion = '';
		isYear = false;

		break;		
		

}	

		for (var i=0;i < productArray.length;i++){

			if(productArray[i].indexOf(productURL) != -1){

				productURL = productArray[i];

				if(productURL.substring(productURL.length - 1) == '/'){


					productURL = productURL.substring(0,productURL.length - 1);

				}

			}

		}


// Build blank wiki links //
qwbox.appendChild(makeLink('QWBwikipediaLSW', pediagif, 'Google Translate (New Window)', true));
//qwbox.appendChild(makeLink('QWBwikipediaLNW', nwgif, 'Wikipedia (New Window)', true));
qwbox.appendChild(makeLink('QWBwiktionaryLSW', tionarygif, 'SalesForce (New Window)', true));
//qwbox.appendChild(makeLink('QWBwiktionaryLNW', nwgif, 'SalesForce (New Window)', true));
qwbox.appendChild(makeLink('QWBwikiquoteLSW', quotegif, 'Google (New Window)', true));
//qwbox.appendChild(makeLink('QWBwikiquoteLNW', nwgif, 'Google (New Window)', true));

qwbox.appendChild(makeLink('QWBMaintViewLSW', mpjpeg, 'Maintenance Viewer (New Window)', true));
qwbox.appendChild(makeLink('QWBSanctLSW', sgif, 'Sanctuary (New Window)', true));

qwbox.appendChild(makeLink('QWBdocwikiLSW', docWiki, 'DocWiki (New Window)', true));


// Prevent miss-clicks from hiding QWBox //
window.QWBpointer = false;
qwbox.addEventListener('mouseover', function(e){
	window.QWBpointer = true;
	d.getElementById('QuickiWikiBox').style.borderLeft = 'solid 1px #77f';
	d.getElementById('QuickiWikiBox').style.borderBottom = 'solid 1px #77f';
}, false);
qwbox.addEventListener('mouseout', function(e){
	window.QWBpointer = false;
	d.getElementById('QuickiWikiBox').style.borderLeft = 'solid 1px #555';
	d.getElementById('QuickiWikiBox').style.borderBottom = 'solid 1px #555';
}, false);	

// Selected Text Event Function // 
window.QWSelectEvent  = function () {
	// Was this a miss-click? //
	if (window.QWBpointer) {return;} 

	// Ensure QWBox is available //
	if (box = document.getElementById('QuickiWikiBox')) {

		// Good, lets go //
		// Check for selected text //
		if(window.getSelection() != null){

			if (window.getSelection().toString() > '') {
				// Get Text //
				seltxt = window.getSelection();
				seltxt = String(seltxt);

				seltxt = seltxt.replace(/(^\s+|\s+$)/g, '');
				// Kill HTML //
				seltxt = seltxt.replace(/"/g, "'");
				
				seltxt = seltxt.replace(/>/g, '&gt');
				seltxt = seltxt.replace(/</g, '&lt');
				

				var googleTranslate = encodeURI(seltxt);


				//https://na27.salesforce.com/5003300000yT1ns  jsys case
				// Hide on Big Selections //
				if (seltxt.length > 1500) {box.style.display = 'none'; return;}

				// Truncate on Long Selections //
				if (seltxt.length > 70) {seltxt = seltxt.substring(0,70);}

				// QWBox Content //
				// Selected text quote //
				qbox = d.getElementById('QWBoxQuote');
				kids = qbox.childNodes;
				for (i in kids) {if (kids[i].nodeType) {qbox.removeChild(kids[i]);}}
				qtxt = d.createTextNode(seltxt);
				qbox.appendChild(qtxt);

				// Wikipedia links //
				//wphref = 'http://en.wikipedia.org/wiki/Special:Search?search=' + seltxt + '&go=Go';

				// Google translate links //
				wphref = 'https://translate.google.com/?biw=1400&bih=798&bav=on.2,or.&bvm=bv.126130881,d.eWE&um=1&ie=UTF-8&hl=en&client=tw-ob#auto/en/' + googleTranslate;				
		
				d.getElementById('QWBwikipediaLSW').setAttribute('href', wphref);
				//d.getElementById('QWBwikipediaLNW').setAttribute('href', wphref);

				// Wiktionary links //
				//wthref = 'http://en.wiktionary.org/wiki/Special:Search?search=' + seltxt + '&go=Go';
				wthref = 'https://na27.salesforce.com/search/SearchResults?searchType=2&str=' + seltxt + '&search=Search&sen=0';
				d.getElementById('QWBwiktionaryLSW').setAttribute('href', wthref);
				//d.getElementById('QWBwiktionaryLNW').setAttribute('href', wthref);

				// Wikiquote links //
				//wqhref = 'http://en.wikiquote.org/wiki/Special:Search?search=' + seltxt + '&go=Go';
				wqhref = 'http://www.google.com/search?q=' + seltxt + '&ie=utf-8&oe=utf-8&aq=t&rls=org.mozilla:en-US:official&client=firefox-a';
				d.getElementById('QWBwikiquoteLSW').setAttribute('href', wqhref);
				//d.getElementById('QWBwikiquoteLNW').setAttribute('href', wqhref);
			
				// Maintenance Portal Link //
				//wqhref = 'http://caseviewer.codegear.net/MaintenanceReport/Default.aspx?'+seltxt;  old
				wqhref = 'http://caseviewer.codegear.net/MaintenanceReport/Default.aspx?'+seltxt+'&__EVENTARGUMENT=&__EVENTTARGET=&__EVENTVALIDATION=jroM8Lu%2Fs879Qc3SLvesqFFrdh1MEMElaESB7hfbT59uCRDl08VyNLTtvwfdIvAhdnAvEC9DhdWctmo%2FCm5pVrjHGUyJPH81NmYwvrnRcefAMz5iFhNJJK8PWVM07lH%2F&__LASTFOCUS=&__VIEWSTATE=2F%2F%2BmEwfQas1MfXPpg3uDawY8BLOQTdY9tk4ZhW16SBhsOVg5Mree0zTkqK61xRnwVyESikCrBvcFKbP6OkiG00zaAoatja%2FBEPhaSEg2MronE2Mo%2F0%2BvVcTNbBpHksWopiFj6uyaDojhnsnI39w1Pyu1XEMFr7UnSQJ6ef3jO%2FM3VJaTAin6pLHFNnfcbxIJLBjnNBqex11kPjn%2BFUgrgKlzz5%2FBePrMzEQleWoT2YCVmDwOfuvaRC8hAroTl65kQZ634N4nWFecoOaNmwxR%2FC9QjcUdher0QepXwgG7%2FuRxfu88J2NV2pQU8CRmAzRanpVgbvdtyexvhp%2FJjudE68VtPGpKs6NT2Q07Gv4lksVi5NKGvHO4dC39w%2F9chXNftAaWb2bj1pj4oZeWUr6fZU7KgmZVtnPLn6I4diriN15qzzSRLbK33I4xnG5waTjM6s1u3ETokafabGN8lRmqajYOxi0D%2BIb7dOE%2FWQVED9CffuXEvylcMQKahA4cUUb7fTU8mDRSt%2BvvQB5fLyuyaGaJkJ%2FMQnXaFe1OXS6sFQknghEyOfxgCUbYW8PJYzk%2FRTAKCmwCzaSgr2kFJWKHmvtsGADG%2F6i0Bo%2B%2BeScgeaCLlQGN9npgEvJfFQxnlAfJIxHaqPxsH%2BFw999dSSem0Se61hfj27yI4FxsZ0OxoIyiGyYn0lkRt8TQB7erS8dSwaXsSpjQDLsAO3MA30ASizFr9qnhunv8qnuT3GoZajt5yY5Cc8ivrBBqR87j9EwGSrTwUp0ObnT3PVQvJgdKc4gM59bezyvPSSBZxv4Ys5JNYtVOoQkstiiVG%2BnhbCw1e3ShTzl8U125AgGYVQ5ir0to5mUkS7krbXTVqkXTZT9oMCp%2ByElk4c7cZeTwyinxUuEUEbcdiCUTAw39Oz1fA%3D%3D&__VIEWSTATEENCRYPTED=&ctl00%24ContentPlaceHolder1%24Button1=Search&ctl00%24ContentPlaceHolder1%24ContractEmail=EmailAddressButton&ctl00%24ContentPlaceHolder1%24ContractIDBox=&ctl00%24ContentPlaceHolder1%24CountryTextBox=&ctl00%24ContentPlaceHolder1%24EmailAddressBox='+seltxt+'&ctl00%24ContentPlaceHolder1%24PIDBox=&ctl00%24ContentPlaceHolder1%24ProjectIDTextBox=';

				d.getElementById('QWBMaintViewLSW').setAttribute('href', wqhref);
				//d.getElementById('QWBwikiquoteLNW').setAttribute('href', wqhref);
			
				// Sanctuary Link //
				wqhref = 'https://license-admin.codegear.com/srs6/admin/el/order_search.jsp?'+seltxt;
				d.getElementById('QWBSanctLSW').setAttribute('href', wqhref);
				//d.getElementById('QWBwikiquoteLNW').setAttribute('href', wqhref);
				
				// docWiki Link //

				if(productURL == undefined){

					wqhref = 'http://docwiki.embarcadero.com/';

				}
				else
				{

				
					wqhref = 'http://docwiki.embarcadero.com' + productURL + '/e/index.php?title=Special%3ASearch&search=' + seltxt + '&go=Go';

				}

				d.getElementById('QWBdocwikiLSW').setAttribute('href', wqhref);

				box.style.display = 'block';
			} else {
				// Hide QWBox if there is no selection //
				box.style.display = 'none';
			}

		}//if(window.getSelection() != null){
	} else {
		// Call the whole thing off //
		clearInterval(window.QuickieWikiIID);
		document.removeEventListener('mouseup', window.QWSelectEvent,false);
		return;
	}
}

// Set Up Selection Event Watch //
document.addEventListener('mouseup', window.QWSelectEvent, false);
window.QuickieWikiIID = setInterval(window.QWSelectEvent, 2000);


		   //


    }
});

}


//............


///...........





// Make Image Links //
function makeLink(id,imgdata,title,newtab) {
	// Make Anchor //
	link = document.createElement('a');
	link.setAttribute('id', id);
	link.setAttribute('title', title);

	// Make Image //
	img = document.createElement('img');
	img.setAttribute('src', imgdata);
	img.setAttribute('style', 'margin: 2px; border: none; vertical-align: top;');

	// New Tab Link //
	if (newtab) {
		link.setAttribute('target', '_blank');
	}

	// Add Image //
	link.appendChild(img);

	return link;
}


function appendToDocument2(html) {
        var div = document.getElementById(HIDDEN_DIV_ID);
        if (!div) {
            div = document.createElement("div");
            document.body.appendChild(div);
            div.id = HIDDEN_DIV_ID;
            div.style.display = 'none';
        }
        div.innerHTML = html;

        return document;
}

