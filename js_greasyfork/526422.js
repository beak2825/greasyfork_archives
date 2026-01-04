// ==UserScript==
// @name         czB2Bauto-lmsg
// @namespace    http://tampermonkey.net/
// @version      2025-02-08
// @description  自动录入信息
// @author       You
// @match        https://uppc.csair.com/upp_cashier/upp-web/dist/pages/pc/showpay.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526422/czB2Bauto-lmsg.user.js
// @updateURL https://update.greasyfork.org/scripts/526422/czB2Bauto-lmsg.meta.js
// ==/UserScript==

(function() {

window.onload = function() {
   document.querySelector("#upp_pay_tab > ul > li:nth-child(5) > div").click()
    // 创建文本输入框
const inputBox = document.createElement('input');

// 设置输入框的类型、id 和占位符
inputBox.type = 'text';
inputBox.id = 'inputBox';
inputBox.placeholder = '请输入信息';

// 设置输入框样式，使其位于页面右上角
inputBox.style.position = 'fixed';
inputBox.style.top = '120px';
inputBox.style.right = '20px';
inputBox.style.padding = '5px';
inputBox.style.fontSize = '16px';
inputBox.style.width = '200px';

// 将输入框添加到 body 中
document.body.appendChild(inputBox);
// 创建确定按钮
const button = document.createElement('button');
button.textContent = '确定';
button.style.position = 'fixed';
button.style.top = '160px';
button.style.right = '20px';
button.style.padding = '5px';
button.style.fontSize = '16px';
document.body.appendChild(button);

    button.addEventListener('click', function() {
  const inputValue = inputBox.value;
    // 尝试解析输入的 JSON 字符串
  const jsonObject  = JSON.parse(inputValue);
console.log(jsonObject)
        console.log(document.querySelector("#CountryCode").value);
    console.log(document.getElementById('PayerFirstName').value);
        if(jsonObject.platform == "寻汇"){
            document.getElementById('cardType').value = 'ECMC-SSL';
        }
    document.getElementById('ExpiryDateM').value = jsonObject.validity_m;
    document.getElementById('ExpiryDateY').value =jsonObject.validity_y;
     document.getElementById('CardNum').value = jsonObject.card_no;
    document.getElementById('cvv').value = jsonObject.cvv;
    //document.querySelector("#CountryCode").value = "SG";
    document.getElementById('email').value = jsonObject.email;
     document.getElementById('mobilePhone').value = jsonObject.phone;
        document.getElementById('PayerFirstName').value = jsonObject.f_name
        document.getElementById('PayerLastName').value = jsonObject.l_name
    const options = document.querySelectorAll("#CountryCode option");
options.forEach(option => {
  if (option.value === "SG") {
    option.selected = true;
  }
})
        document.querySelector("#upp_pay_icon > div.upp_pay_sub.payButtonWrapper > div > button").click();
});
}
    // Your code here...
})();