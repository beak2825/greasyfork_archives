// ==UserScript==
// @name          二つのコンコレを繋ぐスクリプト
// @namespace     noname_fox
// @description   勝手版とにじよめ版に相互リンク付けるよ
// @include       *://c4.concon-collector.com/*
// @include       *://njym2.concon-collector.com/*
// @version 0.0.1.20160715111752
// @downloadURL https://update.greasyfork.org/scripts/21386/%E4%BA%8C%E3%81%A4%E3%81%AE%E3%82%B3%E3%83%B3%E3%82%B3%E3%83%AC%E3%82%92%E7%B9%8B%E3%81%90%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/21386/%E4%BA%8C%E3%81%A4%E3%81%AE%E3%82%B3%E3%83%B3%E3%82%B3%E3%83%AC%E3%82%92%E7%B9%8B%E3%81%90%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==
{
//すごい ざつな つくり
//勝手版上記メニューの位置を特定
if ( location.host.match( /c4\.concon-collector\.com$/ ) ) {
var headMenu = document.querySelector('#all > div.common_menu > div:nth-child(1)');
var text = document.createTextNode(' / ');
    headMenu.appendChild(text);
//ここから--
//ハート作る
var heart_icon=document.createElement('img');
    heart_icon.src = "data:image/jpeg,%FF%D8%FF%E0%00%10JFIF%00%01%01%01%00%00%00%00%00%00%FF%DB%00C%00%05%03%04%04%04%03%05%04%04%04%05%05%05%06%07%0C%08%07%07%07%07%0F%0B%0B%09%0C%11%0F%12%12%11%0F%11%11%13%16%1C%17%13%14%1A%15%11%11%18%21%18%1A%1D%1D%1F%1F%1F%13%17%22%24%22%1E%24%1C%1E%1F%1E%FF%DB%00C%01%05%05%05%07%06%07%0E%08%08%0E%1E%14%11%14%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%1E%FF%C2%00%11%08%00%10%00%10%03%01%22%00%02%11%01%03%11%01%FF%C4%00%16%00%01%01%01%00%00%00%00%00%00%00%00%00%00%00%00%00%05%01%06%FF%C4%00%15%01%01%01%00%00%00%00%00%00%00%00%00%00%00%00%00%00%05%06%FF%DA%00%0C%03%01%00%02%10%03%10%00%00%01%D3%9DK%3E%BF%FF%C4%00%18%10%00%03%01%01%00%00%00%00%00%00%00%00%00%00%00%00%03%04%05%02%01%FF%DA%00%08%01%01%00%01%05%02E%0D4%2B%E9%E9%40M%A8%25%0Fj%86%5C%EF%FF%C4%00%19%11%00%01%05%00%00%00%00%00%00%00%00%00%00%00%00%00%03%00%04%14%212%FF%DA%00%08%01%03%01%01%3F%01%08%9DK%BC%2F%FF%C4%00%18%11%00%02%03%00%00%00%00%00%00%00%00%00%00%00%00%00%00%02%01%12a%FF%DA%00%08%01%02%01%01%3F%01iJi%FF%C4%00%1C%10%00%02%03%00%03%01%00%00%00%00%00%00%00%00%00%00%01%02%00%03%11%12%13%21%22%FF%DA%00%08%01%01%00%06%3F%02%B2%CE%E6%1FD%28%D9%ABs%10%C0%8C%D9b%BB%AF%02%D0%E3.g%93%FF%C4%00%1D%10%01%00%02%01%05%01%00%00%00%00%00%00%00%00%00%00%01%00%111%21Qq%81%A1%F1%FF%DA%00%08%01%01%00%01%3F%21q%E6%F1%A5%40Lyf%DC%C5%06e%D2b%FE%C5%DA%D6%01%3A%3D%9F%FF%DA%00%0C%03%01%00%02%00%03%00%00%00%10%93%FF%C4%00%18%11%00%03%01%01%00%00%00%00%00%00%00%00%00%00%00%00%111q%00%21%FF%DA%00%08%01%03%01%01%3F%10%05E%C0%15%DF%FF%C4%00%15%11%01%01%00%00%00%00%00%00%00%00%00%00%00%00%00%00%001%FF%DA%00%08%01%02%01%01%3F%10%8E%7F%FF%C4%00%1C%10%01%01%01%00%03%00%03%00%00%00%00%00%00%00%00%00%01%21%11%00AQ1aq%FF%DA%00%08%01%01%00%01%3F%10%7F%F6%00D%9F%1C%0A%5C%7F%25d%3E%CA%A2%5D%151%3B%BE%19jx2k%F1%97EV%3A%92%3C%FA%8C%D0%A7%0E%DC%D5%EDY%81%CF%FF%D9";
headMenu.appendChild(heart_icon);
//--ここまで削るとハート消える
    
    
//勝手版用にじよめへのリンク作る
var nijiyome_link=document.createElement('a');
    nijiyome_link.href = "http://www.nijiyome.jp/app/start/357";
    nijiyome_link.target = "_top";
var niji_text = document.createTextNode('コンコレ1.8');
    nijiyome_link.appendChild(niji_text);
headMenu.appendChild(nijiyome_link);
}
if ( location.host.match( /njym2\.concon-collector\.com$/ ) ) {
//にじよめ版の上記メニュー位置を特定
var headMenu2 = document.querySelector('#all > div.common_menu > ul');
//a要素追加
var home_link=document.createElement('a');
    home_link.href = "http://c4.concon-collector.com/status";
    home_link.target = "_top";
var home_text = document.createTextNode('勝手版');
    home_link.appendChild(home_text);
//Li要素追加
var newLi = document.createElement('li');
newLi.appendChild ( home_link );

//出力
    headMenu2.appendChild( newLi );
}
}