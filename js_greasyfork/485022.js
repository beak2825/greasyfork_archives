// ==UserScript==
// @name         PTCG繁中官网构筑器导出PTCG-SIM-CSV格式
// @version      1.2
// @description  导出繁中官网构筑器牌组为PTCG-SIM格式
// @author       akatsukikyoko
// @match        https://asia.pokemon-card.com/tw/deck-build/recipe/*
// @match        https://asia.pokemon-card.com/hk/deck-build/recipe/*
// @match        https://asia.pokemon-card.com/sg/deck-build/recipe/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1249114
// @downloadURL https://update.greasyfork.org/scripts/485022/PTCG%E7%B9%81%E4%B8%AD%E5%AE%98%E7%BD%91%E6%9E%84%E7%AD%91%E5%99%A8%E5%AF%BC%E5%87%BAPTCG-SIM-CSV%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/485022/PTCG%E7%B9%81%E4%B8%AD%E5%AE%98%E7%BD%91%E6%9E%84%E7%AD%91%E5%99%A8%E5%AF%BC%E5%87%BAPTCG-SIM-CSV%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==


// 添加一个按钮到页面上
var button = document.createElement('button');
button.textContent = '導出PTCG-SIM制式';
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
    //弹窗提醒
    alert("如果图片还在加载，导出的卡组可能不全");
    //获取卡名形成列表，计算各种卡片的数量以便确定卡片类型
    var cardNameGroup=[];
    var countPokemon=0;
    var countTrainer=0;
    var countEnergy=0;
    
    var typeTipGroup= document.querySelector('.textList').querySelectorAll('h3');
    typeTipGroup.forEach(function(typeTipElement) {
        let typeOriginalText=typeTipElement.textContent;//获取分类文本
        let matchText=typeOriginalText.match(/\((.*?)\)/);//提取分类中括号里的文字
        if(typeOriginalText.includes("寶可夢卡") || typeOriginalText.includes("Pokémon(")){
        countPokemon=countPokemon+parseInt(matchText[1], 10);
        }else if(typeOriginalText.includes("能量")||typeOriginalText.includes("Energy")){
        countEnergy=countEnergy+parseInt(matchText[1], 10);
        }else{
        countTrainer=countTrainer+parseInt(matchText[1], 10);
        }
        });
    var cardNameList= document.querySelector('.textList').querySelectorAll('.card');
    cardNameList.forEach(function(cardNameElement) {
        var thisCardName=cardNameElement.querySelector('.cardName').textContent;
        cardNameGroup.push(thisCardName);
    });
    //获取卡片图片，并合并刚才获取的卡名，同时确定卡片的type
    let i=0;
    let typeCounter=0;
    var card= document.querySelector('.graphicList').querySelectorAll('.card');
    var data = [];
    data.push({qty: "QTY", name:"NAME",type:"TYPE", cardurl: "URL"});
    card.forEach(function(liElement) {
        var cardSrc = liElement.querySelector('.lazy').getAttribute('src');
        var cardCount=liElement.querySelector('.count').textContent;
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