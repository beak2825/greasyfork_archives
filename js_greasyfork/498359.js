// ==UserScript==
// @name        naver-real-state
// @namespace   Violentmonkey Scripts
// @match       https://new.land.naver.com/complexes*
// @version     0.1.1
// @author      Maru
// @description Please use with violentmonkey
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.10/clipboard.min.js
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/498359/naver-real-state.user.js
// @updateURL https://update.greasyfork.org/scripts/498359/naver-real-state.meta.js
// ==/UserScript==
 
class Item {
    constructor() {
        this.type = "";
        this.price = "";
        this.monthly = "";
        this.dong = "";
        this.floor = "";
        this.direction = "";
        this.area = "";
        this.desc = "";
        this.realEstate = "";
        this.date = "";
    }

    key() {
        return this.desc + this.floor + this.realEstate + this.price;
    }
}

let curentApt = "";
let items = new Map();
let dirty = false;

// 아파트 이름 감시
function observeMainTitle() {
    let title = $('#complexTitle')[0].innerText;
    if (title) {
        if (curentApt !== title) {
            curentApt = title;
            items.clear();
        }
    }
}

// 각각의 매물을 감시한다.
function observeItems() {
    let itemNodes = document.querySelectorAll('.item_list .item');
    console.log(itemNodes.length);
 
    if (!itemNodes) {
        return;
    }

    itemNodes.forEach(itemNode => {
        let item = new Item();
        item.type = itemNode.querySelector('.price_line .type').innerText;
        item.dong = itemNode.querySelector('.item_title .text').innerText.split(' ')[1];
    
        let price = itemNode.querySelector('.price_line .price').innerText;
        let prices = price.split("/");
        item.price = prices[0];
        if (prices.length > 1) {
            item.monthly = prices[1];
        } else {
            item.monthly = "";
        }
    
        let specs = itemNode.querySelector('.info_area .line:nth-child(1) .spec').innerText.split(', ');
        item.area = specs[0];
        item.floor = specs[1];
        item.direction = specs[2];
    
        item.desc = itemNode.querySelector('.info_area .line:nth-child(2) .spec').innerText;
        item.realEstate = itemNode.querySelector('.agent_info:nth-child(2) .agent_name').innerText;
        item.date = itemNode.querySelector('.label_area .label .data').innerText;
    
        let key = item.key();
        if (!items.has(key)) {
            items.set(key, item);
            dirty = true;
        }
    });
}

// tsv 파일 다운로드 만들기
function tsvDownload() {
    const $node = $('.list_complex_info .complex_price_wrap');
    if (!$node) {
        return;
    }

    let tsv = "날자\t타입\t가격\t월세\t동\t층\t면적\t방향\t설명\t부동산\n";
    items.forEach((item) => {
        tsv += `${item.date}\t`
            + `${item.type}\t`
            + `${item.price}\t`
            + `${item.monthly}\t`
            + `${item.dong}\t`
            + `${item.floor}\t`
            + `${item.area}\t`
            + `${item.direction}\t`
            + `${item.desc}\t`
            + `${item.realEstate}`
            + `\n`;
    })

    $('#complexTitle').off("click");
    $('#complexTitle').on("click", function() {
        let filename = `${curentApt}.tsv`;
        downloadTSV(tsv, filename);
    });

    dirty = false;
}

function downloadTSV(text, filename) {
    let csvFile;
    let downloadLink;  

    const BOM = "\uFEFF";
    text = BOM + text;

    csvFile = new Blob([text], { type: "text/tsv" });
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

const disconnect = VM.observe(document.body, () => {
    observeMainTitle();
    observeItems();
    if (dirty) {
        tsvDownload();
    }
  });
  
// You can also disconnect the observer explicitly when it's not used any more
//disconnect();
