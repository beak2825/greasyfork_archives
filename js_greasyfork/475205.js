// ==UserScript==
// @name         tg888jp
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Description of your extension
// @author       Your Name
// @match        https://www.tg888.ws/*
// @match        https://tg888.ws/*
// @grant        none
// @license       GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/475205/tg888jp.user.js
// @updateURL https://update.greasyfork.org/scripts/475205/tg888jp.meta.js
// ==/UserScript==



const  exchangeRate = 0.3;
const  homePage = [
    ['.clear_wrap .back', 'PC版に戻る'],
    ['.clear_wrap .clear', '履歴をクリア'],
    ['.input_wrap li:nth-child(1) input', 'アカウント'],
    ['.input_wrap li:nth-child(2) input','パスワード'],
    ['.text1','アカウント' ],
    ['.text2','パスワード' ],
    ['.md-label span', 'パスワードを記憶する'],
]

let translations=[];
//first
fetch('https://raw.githubusercontent.com/yulun0528/tg888jp/master/translations.json')
.then(response => response.json())
.then(data => {
    console.log(data);
    translations=data
})
.catch(error => {
    //second
    fetch('https://json.extendsclass.com/bin/f15bfa1e071d')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            translations=data
    }).catch(error => {
        console.error('Error fetching JSON:', error);
      });
});



function translatePage() {

 
    const allDiv = document.querySelectorAll('p, div, span, h6, h5, button');
    allDiv.forEach((ele) => {

        if(ele.textContent && ele.childElementCount === 0){
        const translation = translations.find(item => ele.textContent.includes(item.original)); 
        if (translation) {
            ele.textContent = ele.textContent.replace(translation.original, translation.translated);
        }
    }
});
            
    const mobileAccount = document.querySelector('input[placeholder="輸入帳號"]');
    if (mobileAccount) {
        mobileAccount.placeholder = 'アカウント';
    }



    
    homePage.forEach((obj)=>{
        const div = document.querySelector(obj[0]);
        if(div && div.textContent){
            div.textContent = obj[1]
        }

    })

    const rmbme = document.querySelector('.password_wrap p');
    if(rmbme){
    for (let node of rmbme.childNodes) {
        if (node.textContent== ' 記住我') {
            node.textContent='私を覚えてる';
        }
    }
}
    
    const pwdwrap = document.querySelector('.btn_wrap button');
    if(pwdwrap){
    for (let node of pwdwrap.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent='右にスワイプ'
        }
    }
}

const queryString = 
'[ng-init="total.AllBetAmount=total.AllBetAmount+list.gold"],'+
'[ng-init="totalLast.AllBetAmountLast=totalLast.AllBetAmountLast+list.gold"],'+
'[ng-init="total.AllEffectiveBet=total.AllEffectiveBet+list.effective_gold"],'+
'[ng-init="totalLast.AllEffectiveBetLast=totalLast.AllEffectiveBetLast+list.effective_gold"],'+
'[ng-init="total.AllResult=total.AllResult+list.win+list.water"],'+
'[ng-init="totalLast.AllResultLast=totalLast.AllResultLast+list.win+list.water"],'+
'[ng-bind="total.AllBetAmount"],'+
'[ng-bind="total.AllEffectiveBet"],'+
'[ng-bind="total.AllResult |number:2"],'+
'[ng-bind="::totalLast.AllBetAmountLast"],'+
'[ng-bind="::totalLast.AllEffectiveBetLast"],'+
'[ng-bind="::totalLast.AllResultLast |number:2"],'+
'.count_box p'



const price= document.querySelectorAll(queryString);
if (price) {
    price.forEach((p)=>{
        const taiwaneseDollarAmount = parseFloat(p.textContent); 


        const japaneseYenAmount = taiwaneseDollarAmount * exchangeRate;
      
        const formattedAmount = `${taiwaneseDollarAmount} (¥${japaneseYenAmount})`;
      
        p.textContent = formattedAmount;
    })
}

const removeNT = document.querySelectorAll('.currency');
if (removeNT) {
    removeNT.forEach((p)=>{ 
        p.textContent = '$';
    
    })
}

const pElements = document.querySelectorAll('.footer_blue_box_2.zh-tw .box p, .list.box_4 div:nth-child(4), .result_wrap .box p, .t_record .line div p');

pElements.forEach((pElement) => {
    const num = pElement.textContent.replace('.','').replace(',','');
  const taiwaneseDollarAmount = parseFloat(num);
  
  if (!isNaN(taiwaneseDollarAmount)) { // 将 isNaN 放在全局作用域上
    const exchangeRate = 0.3; // 假设汇率是 0.3
    const japaneseYenAmount = taiwaneseDollarAmount * exchangeRate;

    pElement.textContent = `${taiwaneseDollarAmount} (¥${japaneseYenAmount})`;
  }
});

const originalParagraphElement = document.querySelector('.u_money');
if(originalParagraphElement){
    const moneyText = originalParagraphElement.childNodes[1].textContent.trim();
    const num = moneyText.replace('.','').replace(',','');
    const taiwaneseDollarAmount = parseFloat(num);
    const japaneseYenAmount = taiwaneseDollarAmount * exchangeRate;
    const existingParagraph = document.querySelector('.u_money .added');
    console.log(moneyText);
    if (!existingParagraph) {
        const newParagraphElement = document.createElement('span');
        newParagraphElement.textContent = "(0)";
        newParagraphElement.classList.add('added');
        originalParagraphElement.appendChild(  newParagraphElement);
    }else{
        existingParagraph.textContent =`(¥ ${japaneseYenAmount})`;
    }
}

const accbox = document.querySelector('.acc_box');
if(accbox){
accbox.childNodes[1].childNodes[0].textContent = 'アカウント:';
accbox.childNodes[4].childNodes[0].textContent = '今日信用枠:';
accbox.childNodes[10].textContent = '';
}
const maxcredit = document.querySelector('.acc_box span[ng-bind="memberData.maxcredit"]');
if(maxcredit){
    const taiwaneseDollarAmount = parseFloat(maxcredit.textContent); 


    const japaneseYenAmount = taiwaneseDollarAmount * exchangeRate;
  
    const formattedAmount = `<br>${taiwaneseDollarAmount} (¥${japaneseYenAmount})`;
  
    maxcredit.innerHTML = formattedAmount;
}

}







setInterval(translatePage, 100);



