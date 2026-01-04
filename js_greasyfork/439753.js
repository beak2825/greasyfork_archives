// ==UserScript==
// @name         添加bugly解析按钮
// @namespace    http://tampermonkey.net/
// @version      0.33
// @description  buyly增加两个按钮，获取寄存器信息和调用栈信息
// @author       justrunnerliu
// @match        https://bugly.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439753/%E6%B7%BB%E5%8A%A0bugly%E8%A7%A3%E6%9E%90%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/439753/%E6%B7%BB%E5%8A%A0bugly%E8%A7%A3%E6%9E%90%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    setTimeout(AddButton,500);
})();

function AddButton(){

    var divs = document.getElementsByClassName("switch")[0];

    var copyBtn = document.createElement("span")
    divs.appendChild(copyBtn)
    copyBtn.setAttribute("data-value","copy1")
    copyBtn.textContent = "调用栈";
    copyBtn.addEventListener("click", clickBotton)
 copyBtn.setAttribute("class","copyBtn");

    var copyBtn2 = document.createElement("span")
    divs.appendChild(copyBtn2)
    copyBtn2.setAttribute("data-value","copy2")
    copyBtn2.textContent = "寄存器";
    copyBtn2.addEventListener("click", clickBotton2)
 copyBtn2.setAttribute("class","copyBtn2");

        var copyBtn3 = document.createElement("span")
    divs.appendChild(copyBtn3)
    copyBtn3.setAttribute("data-value","copy3")
    copyBtn3.textContent = "调用无0x";
    copyBtn3.addEventListener("click", clickBotton3)
 copyBtn3.setAttribute("class","copyBtn3");


    var root = document.getElementById("root");
    var tipdiv = document.createElement("div");
    root.appendChild(tipdiv);

    tipdiv.setAttribute("style","width:150px;height:50px;background-color:#0a85ccad;position: absolute;bottom: 60%;margin: 0 auto;left: 0;right: 0;text-align:center;display:none;");
    tipdiv.setAttribute("id","CopyMessage");
    var copyTipText = document.createElement("span")
    tipdiv.appendChild(copyTipText)
    copyTipText.setAttribute("style","font-size:1rem;color:#ffffff;line-height:50px;");
    copyTipText.innerHTML = "复制成功！";

};

function clickBotton(){
    console.log("clickBotton");
     var divs = document.getElementsByClassName("W1qV937Dt2co7xHJembt5");
     var text = "";
    for (var i = 0; i < divs.length; i++) {
       var ans1 = divs[i].innerText.match(/0x[A-Fa-f0-9]{6,16}/g);
       if(ans1!=null){
           console.log(ans1);
           text = text + ans1+" ";
       }
    }

    var oInput = document.createElement('input');
        oInput.value = text;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display='none';

     CopyTip();
};

function clickBotton3(){
    console.log("clickBotton");
     var divs = document.getElementsByClassName("W1qV937Dt2co7xHJembt5");
     var text = "";
    for (var i = 0; i < divs.length; i++) {
       var ans1 = divs[i].innerText.match(/ [A-Fa-f0-9]{8} /g);
       if(ans1!=null){
           console.log(ans1);
           text = text + ans1+" ";
       }
    }

    var oInput = document.createElement('input');
        oInput.value = text;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display='none';

     CopyTip();
};

function clickBotton2(){
    console.log("clickBotton");
     var divs = document.getElementsByClassName("_238RAGeuUPkMOSl9NfNQt7");
     var text = "";
    for (var i = 0; i < divs.length; i++) {
        var ans1 = divs[i].innerText.match(/[A-Za-z0-9]{2,3} [A-Fa-f0-9]{8} |[A-Za-z0-9]{2,3} [A-Fa-f0-9]{16} /g);

        for(var j = 0; j < ans1.length; j++){
            var ans2 = ans1[j].match(/ [A-Fa-f0-9]{8} | [A-Fa-f0-9]{16} /g);
            if(ans2!=null){
                text = text + ans2+" ";
            }
        }
    }

    var oInput = document.createElement('input');
        oInput.value = text;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display='none';

    CopyTip();
};

 function CopyTip() {
        document.getElementById('CopyMessage').style.display='';   //复制后弹出
setTimeout("document.getElementById('CopyMessage').style.display='none'",500);  //2秒后自动隐藏
}
