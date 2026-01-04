// ==UserScript==
// @id             Coinmarketcap_btc_percent
// @name           Coinmarketcap中历史比特币占比查看
// @version        0.0.8
// @author         Johnathan
// @description    query the btc market percentage from https://coinmarketcap.com/historical
// @match        http*://coinmarketcap.com/historical/*
// @license        MIT
// @namespace https://github.com/dajuguan/Tampermonkey/
// @downloadURL https://update.greasyfork.org/scripts/447934/Coinmarketcap%E4%B8%AD%E5%8E%86%E5%8F%B2%E6%AF%94%E7%89%B9%E5%B8%81%E5%8D%A0%E6%AF%94%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/447934/Coinmarketcap%E4%B8%AD%E5%8E%86%E5%8F%B2%E6%AF%94%E7%89%B9%E5%B8%81%E5%8D%A0%E6%AF%94%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==
function buildBanner(text) {
  const bannerElement = document.createElement('div');
  bannerElement.textContent = 'Scroll to show the BTC percentage...'
  bannerElement.style = `
    color:rgb(255,0,0);
    font-size:30px;
    background-color:  'orange';
    min-height: 40px;
    display: block;
    justify-content: center;
    align-items: center;
    position:fixed;
    top:30px;
    right:80px;
    z-index: 2147483647;
  `;
  
  return bannerElement;
}
banner = buildBanner()
document.body.prepend(banner)

//window.scrollBy({top:10000,lef:0,behavior:'smooth'});
document.addEventListener("scroll", function (e) {
    var tokens = document.querySelectorAll('.cmc-table__cell--sort-by__market-cap>div')
    tokens = Array.from(tokens)
    var marketcaps = tokens.map((x)=>parseFloat(x.textContent.slice(1).split(',').join('')))
    var total = marketcaps.reduce((x,y)=>x+y)
    var percentage = (marketcaps[0]/total*100).toFixed(4)
    banner.textContent = `total ${marketcaps.length}coins, ${percentage }%`
    console.log('total coins:',marketcaps.length)
    console.log('BTC marker cap percentage:',percentage)
})

