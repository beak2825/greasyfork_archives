// ==UserScript==
// @name         ptcg-sim-JP Exporter
// @version      1.0
// @description  このスクリプトは、https://www.pokemon-card.com/ の 'デッキ表示' の右下隅に、ptcg-simで使用可能なcsv形式のデッキファイルをエクスポートするためのボタンを追加します
// @author       akatsukikyoko
// @match        https://www.pokemon-card.com/deck/confirm.html/deckID/*
// @match        https://www.pokemon-card.com/deck/result.html/deckID/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1249114
// @downloadURL https://update.greasyfork.org/scripts/486318/ptcg-sim-JP%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/486318/ptcg-sim-JP%20Exporter.meta.js
// ==/UserScript==


// 添加一个按钮到页面上
var button = document.createElement('button');
button.textContent = 'エクスポート';
button.style.position = 'fixed';
button.style.bottom = '150px';
button.style.right = '100px';
button.style.fontSize = '15px'; // 放大字体
button.style.borderRadius = '10px'; // 添加圆角
button.style.opacity = '0.5'; // 添加半透明效果
button.style.transform = 'scale(2)'; // 放大300%
button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.5)'; // 添加阴影效果
button.type = 'button';
button.style.border = 'none'; // 去除边框
document.body.appendChild(button);


//按钮点击效果
button.addEventListener('click', function() {
    //获取卡名形成列表，计算各种卡片的数量以便确定卡片类型
    var cardNameGroup=[];
    var countPokemon=0;
    var countTrainer=0;
    var countEnergy=0;

    var typeTipGroup= document.querySelectorAll('[colspan="2"]');
    //console.log(typeTipGroup);
    typeTipGroup.forEach(function(typeTipElement) {
        let typeOriginalText=typeTipElement.innerText;//获取分类文本
        let matchText=typeOriginalText.match(/\((.*?)\)/);//提取分类中括号里的文字
        if(typeOriginalText.includes("ポケモン ") || typeOriginalText.includes("Pokémon(")){
        countPokemon=countPokemon+parseInt(matchText[1], 10);
        }else if(typeOriginalText.includes("エネルギー ")||typeOriginalText.includes("Energy")){
        countEnergy=countEnergy+parseInt(matchText[1], 10);
        }else{
        countTrainer=countTrainer+parseInt(matchText[1], 10);
        }
        });
    console.log(countPokemon,countTrainer,countEnergy);
    var cardNameList= document.querySelectorAll('[id*="cardName_"]');
    cardNameList.forEach(function(cardNameElement) {
        var thisCardName=cardNameElement.textContent;
        cardNameGroup.push(thisCardName);
    });
    console.log(cardNameGroup);
    //获取卡片图片，并合并刚才获取的卡名，同时确定卡片的type
    let i=0;
    let typeCounter=0;
    var card= document.querySelectorAll('[colspan="1"]');
    var cardCounter=document.querySelectorAll('.cPos.nowrap');
    var data = [];
    data.push({qty: "QTY", name:"NAME",type:"TYPE", cardurl: "URL"});
    card.forEach(function(liElement) {
        var cardSrc = 'https://www.pokemon-card.com/'+liElement.querySelector('.thumbsImage').getAttribute('src');
        console.log(cardSrc);
        var cardCount=cardCounter[i].querySelector('span').textContent.replace('枚','');
        console.log(cardSrc,cardCount);
        var cardName=cardNameGroup[i];
        var cardType="Pokémon";
        if(typeCounter>=countPokemon) cardType="Trainer";
        if(typeCounter>=countPokemon+countTrainer) cardType="Energy";
        data.push({qty: cardCount, name: cardName,type:cardType, cardurl:cardSrc});
        typeCounter=typeCounter+parseInt(cardCount,10);
        i=i+1;

    });
    //data.push({src: src, count: count, cardName: cardName}
    exportToCSV(data, 'decklist'); // 导出数据为CSV文件
});

// 导出数据为CSV文件的函数
function exportToCSV(data, filename) {
    var csv = data.map(function(row) {
        return row.qty + ',' + row.name + ',' + row.type+ ',' + row.cardurl; // 使用逗号作为分隔符
    }).join('\n'); // 每一行数据之间用换行符分隔
    var blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename + '.csv'; // 设置下载的文件名
    link.click(); // 触发下载操作
}