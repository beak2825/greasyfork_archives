// ==UserScript==
// @name        PCPartPicker UserBenchmark Integration
// @namespace   Violentmonkey Scripts
// @match       https://au.pcpartpicker.com/products/*
// @grant       none
// @version     1.0
// @author      Paz / xpaz <paz@paz.yt>
// @description 21/08/2020, 11:31:03
// @downloadURL https://update.greasyfork.org/scripts/409666/PCPartPicker%20UserBenchmark%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/409666/PCPartPicker%20UserBenchmark%20Integration.meta.js
// ==/UserScript==

function loadBenchmarks(){
      let part;
      switch(location.pathname){
        case "/products/cpu/":
          part = "cpu";
          break;
        case "/products/memory/":
          part = "ram";
          break;
        case "/products/video-card/":
          return
          part = "gpu";
          break;
        default:
          return;
      }
      let dataUrl = {
        "cpu": 'https://paz.pw/af1f80a82eb9252cc55d0cfc7c667b41.json',
        "gpu": 'https://paz.pw/c7861e4b769907dc27ebdf6ac509dac7.json',
        "ram": 'https://paz.pw/0e0d9fd7e391a738d012d8a54d680126.json'
      }
      fetch(dataUrl[part]).then(data => data.json()).then(data => {
        let products = document.querySelector("#category_content").children;
        for(let i=0;i<products.length;i++){
          let product = products[i];

            let title =   product.querySelector('.td__nameWrapper').innerText.toLowerCase();
            if(part == "gpu"){
              title = title.split(' ');
              title = title[0]+(product.querySelector('.td__spec--1').innerText.toLowerCase().replace('geforce', '').replace('radeon', ''))+" "+title[1];
            }
            if(part == "ram"){
              title = title.split(' ');
              title.pop();title.pop();
              title = title.join(' ')+" "+product.querySelector('.td__spec--1').innerText.toLowerCase().replace('-',' ').replace("speed\n","")
                                +" c"+product.querySelector('.td__spec--6').innerText.replace("CAS Latency\n", "")+" "
                                +product.querySelector('.td__spec--2').innerText.toLowerCase().split(' ').join('').replace("modules\n","");
            }
            data.forEach(e => {
              let model = (e.Brand + " " + e.Model).toLowerCase();
              model = model.replace((e.Brand + " " + e.Brand).toLowerCase(), e.Brand.toLowerCase());
              if(model == title){
                if(product.querySelectorAll('.td__score').length == 0){
                  product.innerHTML += '<td class="td__score">'+e.Benchmark+'%</td>'+
                                     '<td class="td__value">$'+Math.floor(((product.querySelector('.td__price').innerText.replace('$','').replace('Add', '')/(e.Benchmark)))*100)/100+'/p</td>';
                }
              }
            })
        }
    })
}

window.addEventListener('load', (event) => {
  setTimeout(loadBenchmarks,1500)
});