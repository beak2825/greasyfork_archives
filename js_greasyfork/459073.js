// ==UserScript==
// @name         百度云重命名剔除特殊符号-输入框版
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  针对百度云新版重命名时提示【文件名不能包含以下字符：<,>,|,*,?,,/】，自动将特殊文件替换成空格
// @author       zyb
// @match        https://pan.baidu.com/disk/*
// @exclude      https://pan.baidu.com/share/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459073/%E7%99%BE%E5%BA%A6%E4%BA%91%E9%87%8D%E5%91%BD%E5%90%8D%E5%89%94%E9%99%A4%E7%89%B9%E6%AE%8A%E7%AC%A6%E5%8F%B7-%E8%BE%93%E5%85%A5%E6%A1%86%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/459073/%E7%99%BE%E5%BA%A6%E4%BA%91%E9%87%8D%E5%91%BD%E5%90%8D%E5%89%94%E9%99%A4%E7%89%B9%E6%AE%8A%E7%AC%A6%E5%8F%B7-%E8%BE%93%E5%85%A5%E6%A1%86%E7%89%88.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    // 顶部通知类实例
    let showMsg = null;
    // 是否已经触发粘贴事件
    let hasPaste = false;

    // 创建输入框CSS样式
    const head = document.head;
    const style = document.createElement("style");
    const styleStr =`
	  #removeSpecialSymbolsInput{
	    width:20%;
	    position:absolute;
	    top:103px;
	    left:11%;
	  }

      #removeSpecialSymbolsInputByMiaochuan{
        width: auto;
        margin: 1em 2em 3px;
      }
	  .u-input__inner{
	    -webkit-appearance: none;
	    background-color: #fff;
	    background-image: none;
	    border-radius: 4px;
	    border: 1px solid #dcdfe6;
	    box-sizing: border-box;
	    color: #03081a;
	    display: inline-block;
	    font-size: inherit;
	    height: 40px;
	    line-height: 40px;
	    outline: 0;
	    padding: 0 12px;
	    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
	    width: 100%;
	  }
	`
    style.appendChild(document.createTextNode(styleStr));
    head.appendChild(style);

    // 创建input输入框
    const inputDom = creatInputDomFuc({
        id:"removeSpecialSymbolsInput",
    });

    // 获取要插入的dom
    const fatherDom = document.querySelectorAll('.nd-main-layout__body .wp-s-core-pan__body-contain--list')[0] || document.querySelectorAll("#layoutMain")[0];
    if(document.querySelectorAll("#layoutMain")[0]){
        inputDom.setAttribute("style","top:79px;z-index:999;");
    }
    if(!fatherDom){
        return;
    }
    fatherDom.appendChild(inputDom);

    const miaochuanBtn = await getDomByIntervalAsync('#bdlink_btn');
    miaochuanBtn && miaochuanBtn.addEventListener('click',async function(){
        const fatherDomByMiaochuan = await getDomByIntervalAsync('#swal2-html-container');
        if(!fatherDomByMiaochuan){
            return;
        }

        const inputDom = creatInputDomFuc({
            id:"removeSpecialSymbolsInputByMiaochuan",
        });

        fatherDomByMiaochuan.appendChild(inputDom);
    })

    // 创建input输入框
    function creatInputDomFuc(obj = {}){
        const inputDom = document.createElement("input");
        obj.id && inputDom.setAttribute("id",obj.id);
        inputDom.setAttribute("class","u-input__inner");
        inputDom.setAttribute("type","text");
        inputDom.setAttribute("autocomplete","off");
        inputDom.setAttribute("placeholder","请输入需要去除特殊符号的文本");

        // 监听粘贴事件
        inputDom.addEventListener('paste', (event) => {
            createClipboardFuc("paste","",inputDom);
        })

        inputDom.onchange = function(e){
            if(hasPaste){
                hasPaste= false;
                return;
            }
            let value = e.target.value;
            createClipboardFuc("onchange",value, inputDom);
        }
        return inputDom
    }

    // 粘贴逻辑操作
    function createClipboardFuc(type="paste",value="",inputDom){
        // 获取解析 粘贴的文本
        const clipboard = navigator.clipboard;
        let clipPromise = clipboard.readText();

        if(type==="onchange"){
            let newname = value.replaceAll(/[\\\/:*?'<>|]/g," ");
            inputDom.value = newname;
            if(!showMsg){
                showMsg = new ShowMsg();
            }

            showMsg.toast({
                template:"文本需要自行复制",
                time:3000,
            })

            return
        }
        clipPromise.then(function(clipText){
            // let newname = (type==="onchange"?value:clipText).replaceAll(/<|>|\||\*|\?|\,|\/|:/g," ");
            let newname = clipText.replaceAll(/[\\\/:*?'<>|]/g," ");
            console.log(type,newname);
            // 将新文件名回写到剪切板中
            clipboard.writeText(newname);
            inputDom.value = newname;
            if(!showMsg){
                showMsg = new ShowMsg();
            }

            showMsg.toast({
                template:"文本已复制到剪贴板",
                time:3000,
            })

            hasPaste = true;
        });

    }

    // 异步获取dom节点
    async function getDomByIntervalAsync (classOrIdName, time=200){
        let dom = document.querySelectorAll(classOrIdName)[0];
        let times = 0;
        if(!dom){
            return await new Promise(function(resolve){
                let timeId = null;
                timeId = setInterval(async function(){
                    dom = document.querySelectorAll(classOrIdName)[0];
                    if(dom || times>50){
                        clearInterval(timeId);
                        resolve(dom);
                    }else{
                        times++;
                    }
                },time)
            })
        }else{
            return dom;
        }
    }

    // 创建顶部通知类
    class ShowMsg{
        constructor(){
            this.createClassFuc();
        }
        createClassFuc(){
            const head = document.head;
            let style = document.createElement("style");
            const styleStr =`
					#toastBox{
					  min-width: auto;
					  height: 40px;
					  background:#fff;
					  box-sizing: border-box;
					  border-radius: 22px;
					  position: fixed;
					  left: 50%;
					  top: -100px;
					  transform: translateX(-50%);
					  transition: opacity .3s,transform .4s,top .4s;
					  overflow: hidden;
					  padding: 10px 20px;
					  display: flex !important;
					  align-items: center;
					  box-shadow: 0 2px 16px 0 rgb(3 11 26 / 10%);
					  z-index: 9999;
					  opacity:0;
					}
					#toastBox.show{
					  top:60px;
				     opacity:1;
				     animation-name: showToast;
				     animation-duration: 0.5s;
					}
				   #toastBox.hide{
					  top: -100px;
					  opacity:0;
				     animation-name: hideToast;
				     animation-duration: 0.4s;
				   }
				   @keyframes showToast {
				     0% {
				       top: -100px;
					    opacity:1;
				     }
				     100% {
				       top:60px;
					    opacity:1;
				     }
				   }
				   @keyframes hideToast {
				     0% {
				       top:60px;
				       opacity:1;
				     }
				     99% {
				       top:60px;
				       opacity:0;
				     }
				     100%{
				       top:-100px;
					    opacity:0;
				     }
				   }
				   #toastBox i{
				     width: 15px;
				     height: 15px;
				     background: #0bd6a7;
				     border-radius: 50%;
				     position: relative;
				     translate: -8px -0.5px;
				   }
				   #toastBox i:before{
				     content: "";
				     width: 8px;
				     height: 3px;
				     display: inline-block;
				     border: 1px solid #fff;
				     border-width: 0 0 2px 2px;
				     transform: rotate(-45deg);
				     -ms-transform: rotate(-45deg);
				     -moz-transform: rotate(-45deg);
				     -webkit-transform: rotate(-45deg);
				     -o-transform: rotate(-45deg);
				     vertical-align: baseline;
				     position: absolute;
				     left: 3px;
				     top: 5px;
				   }
				   #toastBox p{
				     padding: 0;
				     font-size: 14px;
				     line-height: 1;
				   }
				`
            style.appendChild(document.createTextNode(styleStr));
            head.appendChild(style);
        };
        createToastBoxFuc(template){
            const body = document.body;
            let divDom = document.createElement("div");
            divDom.setAttribute("id","toastBox");
            divDom.innerHTML = `<i></i><p class="content">${template}</p>`;
            body.appendChild(divDom);

            this.toastBoxDom = divDom;
        }
        toast(obj){
            let template="", time = 2500;
            if(typeof obj !== "String"){
                template = obj.template;
                time = obj.time;
            }else{
                template = obj;
            }

            if(this.toastBoxDom){
                this.toastBoxDom.innerHTML = `<i></i><p class="content">${template}</p>`;
            }else{
                this.createToastBoxFuc(template);
            }
            this.toastBoxDom.setAttribute("class","show");
            setTimeout(()=>{
                this.toastBoxDom.setAttribute("class","hide");
            },time)
        }
    }

})();