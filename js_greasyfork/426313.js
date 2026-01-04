// ==UserScript==
// @name        CoinMarketCap Only Show Real Coins
// @namespace   http://coinmarketcrap.com
// @description Only show real coins on coinmarketcap.  Hide fake coins.  Also improves view-ability of website when javascript is disabled.  
// @include     https://coinmarketcap.com/
// @include     https://*.coinmarketcap.com/
// @version     1.4.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/426313/CoinMarketCap%20Only%20Show%20Real%20Coins.user.js
// @updateURL https://update.greasyfork.org/scripts/426313/CoinMarketCap%20Only%20Show%20Real%20Coins.meta.js
// ==/UserScript==

var fakeCoins = new Array('BSV', 'USDT', 'BNB', 'UNI', 'LINK', 'USDC', 'THETA', 'KLAY', 'BTCB', 'YFI', 'MKR', 'ICP');
var fakes = fakeCoins.join(' ');

var coinIndex = {"BTT":["3718","bittorrent"], "XRP":["52","xrp"], "ZEC":["1437", "zcash"], "DASH":["131", "dash"], "XMR":["328", "monero"], "DOGE":["74", "dogecoin"], "TRX":["1958", "tron"], "BCH":["1831", "bitcoin-cash"], "FIL":["2280", "filecoin"], "LTC":["2", "litecoin"], "ETC":["1321", "ethereum-classic"], "BTG":["2083","bitcoin-gold"], "XVG":["693","verge"], "NANO":["1567","nano"], "DFI":["5804","DeFiChain"], "DGB":["109","digibyte"], "RVN":["2577","ravencoin"], "ZEN":["1698","horizon"], "HOT":["2682","holo"], "DCR":["1168","decred"],};

var td2 = '<td style="text-align:right"><span style="color:var(--up-color);padding:0;border-radius:8px"><span></span></span></td><td style="text-align:right"><p font-size="1" color="text" style="white-space:nowrap"></p></td><td style="text-align:right"><div><a class="cmc-link" href="/currencies/CCCOINNAMEEE/markets/"><p color="text" font-size="1"></p></a><p style="white-space:nowrap" font-size="0" color="text2"></p></div></td><td style="text-align:right"><div><div><div><span class="icon-Info"></span></div><p color="text" font-weight="medium" font-size="1"></p></div><div width="160"><div width="128"></div></div></div></td><td style="text-align:right"><a class="cmc-link" href="/currencies/CCCOINNAMEEE/"><img src="https://s3.coinmarketcap.com/generated/sparklines/web/7d/usd/MMMAGICNUMBERRR.png" /></a></td><td><div><button class="sc-Axmtr bJMCAy sc-fzqNJr fvNIAx"><span class="icon-More-Vertical"></span></button></div>';

var T = document.getElementsByTagName('tr');
for (var x = 0; x < T.length; x++) {
  if (T[x].getElementsByTagName('td')) {
    var D = T[x].getElementsByTagName('td');
    for (var xx = 0; xx < D.length; xx++) {
      var code = null;
      if (D[xx].getElementsByTagName('p')) {
        var P = D[xx].getElementsByTagName('p');
        for (var xxx = 0; xxx < P.length; xxx++) {
          var code = P[xxx].textContent.toString();
          code = code.match(/[A-Z]{3,5}/);
          if (code != null) {
            code1 = new RegExp(' ' + code + ' ', 'i');
            code2 = new RegExp('^' + code + ' ', 'i');
            code3 = new RegExp(' ' + code + '$', 'i');
            if (fakes.match(code1) || fakes.match(code2) || fakes.match(code3)) {
              T[x].setAttribute('style', 'display:none!important; visibility:hidden!important;')
            }
            break;
          }
        }
      }
      if (D[xx].getElementsByTagName('span')) {
        var SP = D[xx].getElementsByTagName('span');
        for (var a = 0; a < SP.length; a++) {
          if (SP[a].className.match(/crypto-symbol/i)) {
            var code = SP[a].textContent.toString();
            code = code.match(/[A-Z]{3,5}/);
            if (code != null) {
              code1 = new RegExp(' ' + code + ' ', 'i');
              code2 = new RegExp('^' + code + ' ', 'i');
              code3 = new RegExp(' ' + code + '$', 'i');
              if (fakes.match(code1) || fakes.match(code2) || fakes.match(code3)) {
                T[x].setAttribute('style', 'display:none!important; visibility:hidden!important;')
              }
              for (var aa = 0; aa < SP.length; aa++) {
                if (SP[aa].className.match(/circle/i) && code != null && coinIndex[code] != null) {
                  var url = 'https://s2.coinmarketcap.com/static/img/coins/64x64/' + coinIndex[code][0] + '.png';
                  SP[aa].setAttribute('style', 'background-image:url(\'' + url + '\')!important;width: 24px!important; height: 24px!important; background-repeat: no-repeat!important; background-size:24px!important;');
                }
              }
            }
          }
        }
      }
    }
  }
  if (T[x].getElementsByTagName('td') [1] && T[x].getElementsByTagName('td') [1].getElementsByTagName('p') [0]) {
    var place = parseInt(T[x].getElementsByTagName('td') [1].getElementsByTagName('p') [0].textContent.toString());
  } 
  else if (T[x].getElementsByTagName('td') [1] && T[x].getElementsByTagName('td') [1].getElementsByTagName('span') [0]) {
    var span0 = T[x].getElementsByTagName('td') [1].getElementsByTagName('span') [0].innerHTML;
    if (span0 == null || span0 == '') {
      if (T[x].getElementsByTagName('td') [2] && T[x].getElementsByTagName('td') [2].getElementsByTagName('a') [0] && T[x].getElementsByTagName('td') [2].getElementsByTagName('a') [0].getElementsByTagName('span') [2]) {
        var code = T[x].getElementsByTagName('td') [2].getElementsByTagName('a') [0].getElementsByTagName('span') [2].textContent.match(/[A-Z]{3,5}/);
        if (coinIndex[code]) {
          var newtd2 = td2.replace(/MMMAGICNUMBERRR/gm, coinIndex[code][0]).replace(/CCCOINNAMEEE/gm, coinIndex[code][1]);
          var newc = T[x].innerHTML + newtd2;
          T[x].innerHTML = newc;
        }
      }
    }
  }
}
