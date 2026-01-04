// ==UserScript==
// @name         dangdangyixai
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       dangdang
// @match        https://218.6.244.186:16000/warning/Page/MainFrame/default.aspx?ver=3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423316/dangdangyixai.user.js
// @updateURL https://update.greasyfork.org/scripts/423316/dangdangyixai.meta.js
// ==/UserScript==

(function() {
    'use strict'; 
   let flag = false
console.log('我的脚本加载了');
	var button = document.createElement("button"); //创建一个input对象（提示框按钮）
	button.id = "id001";
	button.textContent = "党党一下";
	button.style.width = "80px";
	button.style.height = "20px";
	button.style.align = "center";
    button.style.position = "absolute"
     button.style.backgroundColor = "#38ADFF"
    button.style.right = "5%"
    button.style.top = "5%"
    button.style.zIndex = "999999"

	//绑定按键点击功能
	button.onclick = function (){
		console.log('点击了按键');
        if(!flag){
            //为所欲为 功能实现处
       var inputs = document.createElement("input"); //创建一个input对象（提示框按钮）
            inputs.id = "keys";
            inputs.value = "";
            inputs.style.width = "180px";
            inputs.style.height = "50px";
            inputs.style.align = "center";
            inputs.style.position = "absolute"
            inputs.style.right = "5%"
            inputs.style.top = "8%"
            inputs.style.zIndex = "999999"
        document.body.appendChild(inputs);
         let element = document.getElementById("keys");
                listenInput(element);
            flag =true
        }else{
             let element = document.getElementById("keys");
            flag = false
            element.removeEventListener("mousemove", listenInput);
            element.remove()
        }
	};

    /**
     * 监听输入
     * @param {element} element 元素
     */
    function listenInput(element) {
        if (element == null) return;
        element.addEventListener("input", function (e) {
            work(e.target.value)
        });
    }
    function work(val){
      
        if(val){ 
            let forms ;
            var childIframeArr =document.getElementsByTagName('iframe')  
            let childIframeArr2 = childIframeArr[2].contentWindow.document.getElementsByTagName('iframe') 
            let childIframeArr3 = childIframeArr2[0].contentWindow.document.getElementsByTagName('iframe') 
             for(let i =0 ; i <childIframeArr3.length;i++){ 
                  forms = childIframeArr3[i].contentWindow.document.forms

           }
            // let snsArr=val.split(/[(\r\n)\r\n]+/);
            let snsArr =val.replace(/\s+/g,",").split(',')

            console.log(forms,snsArr,'forms')
            let inputText = []
             let filterArr = []
               let indexArr = [ 2,3,4,5]
            for(let i =0 ; i <forms[0].elements.length;i++){
                if(forms[0].elements[i].type === 'text' ){
                    inputText.push(forms[0].elements[i])
                }

            } 
            for(let i =0 ; i < inputText.length;i++){
                if( i>= 2 && i<=5){
                    filterArr.push(inputText[i])
                }
            }

            for(let i =0 ; i < filterArr.length ;i++){ 
                 filterArr[i].value = snsArr[i] 

            }

        }
    }
    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试

	document.body.appendChild(button);

    //var y = document.getElementById('s_btn_wr');
    //y.appendChild(button);

    // Your code here...
})();