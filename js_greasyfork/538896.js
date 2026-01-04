// ==UserScript==
// @name                      主流设计平台去除水印（搞定设计、创客贴、图怪兽、图司机、包图网、千图网、比格设计、爱设计、易企秀、标小智、标智客、婚贝等）
// @namespace                 https://www.fom1.com
// @version                   2025.11.15
// @description               在线设计去除水印后可截图保存。目前支持稿定设计、图怪兽、图司机、包图网、千图网、创客贴、比格设计、魔力设、觅知网、易企秀、爱设计、标小志、婚贝。易企秀 爱设计 比格 创客贴
// @author                    来纠错，错别字智能检测平台
// @icon                      https://www.xiawenku.cn/favicon.ico
// @match                     *://*.gaoding.com/*
// @match                     *://*.818ps.com/*
// @match                     *://*.tusij.com/*
// @match                     *://*.ibaotu.com/*
// @match                     *://*.58pic.com/*
// @match                     *://*.chuangkit.com/*
// @match                     *://bigesj.com/*
// @match                     *://*.molishe.com/*
// @match                     *://*.51miz.com/*
// @match                     https://*.eqxiu.com/*
// @match                     https://www.isheji.com/*
// @match                     https://*.logosc.cn/*
// @match                     https://*.699pic.com/*
// @match                     https://*.qingning6.com/*
// @grant                     GM_addStyle
// @license                   AGPL-3.0
// @website                   https://soujiaoben.org/#/pages/list/detail?id=888888888888888888&host=scriptcat
// @description:auto-zh-CN    在线设计去除水印后可一键保存。目前支持稿定设计、图怪兽、图司机、包图网、千图网、创客贴、比格设计、魔力设、觅知网、易企秀、爱设计、标小志、婚贝。
// @downloadURL https://update.greasyfork.org/scripts/538896/%E4%B8%BB%E6%B5%81%E8%AE%BE%E8%AE%A1%E5%B9%B3%E5%8F%B0%E5%8E%BB%E9%99%A4%E6%B0%B4%E5%8D%B0%EF%BC%88%E6%90%9E%E5%AE%9A%E8%AE%BE%E8%AE%A1%E3%80%81%E5%88%9B%E5%AE%A2%E8%B4%B4%E3%80%81%E5%9B%BE%E6%80%AA%E5%85%BD%E3%80%81%E5%9B%BE%E5%8F%B8%E6%9C%BA%E3%80%81%E5%8C%85%E5%9B%BE%E7%BD%91%E3%80%81%E5%8D%83%E5%9B%BE%E7%BD%91%E3%80%81%E6%AF%94%E6%A0%BC%E8%AE%BE%E8%AE%A1%E3%80%81%E7%88%B1%E8%AE%BE%E8%AE%A1%E3%80%81%E6%98%93%E4%BC%81%E7%A7%80%E3%80%81%E6%A0%87%E5%B0%8F%E6%99%BA%E3%80%81%E6%A0%87%E6%99%BA%E5%AE%A2%E3%80%81%E5%A9%9A%E8%B4%9D%E7%AD%89%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/538896/%E4%B8%BB%E6%B5%81%E8%AE%BE%E8%AE%A1%E5%B9%B3%E5%8F%B0%E5%8E%BB%E9%99%A4%E6%B0%B4%E5%8D%B0%EF%BC%88%E6%90%9E%E5%AE%9A%E8%AE%BE%E8%AE%A1%E3%80%81%E5%88%9B%E5%AE%A2%E8%B4%B4%E3%80%81%E5%9B%BE%E6%80%AA%E5%85%BD%E3%80%81%E5%9B%BE%E5%8F%B8%E6%9C%BA%E3%80%81%E5%8C%85%E5%9B%BE%E7%BD%91%E3%80%81%E5%8D%83%E5%9B%BE%E7%BD%91%E3%80%81%E6%AF%94%E6%A0%BC%E8%AE%BE%E8%AE%A1%E3%80%81%E7%88%B1%E8%AE%BE%E8%AE%A1%E3%80%81%E6%98%93%E4%BC%81%E7%A7%80%E3%80%81%E6%A0%87%E5%B0%8F%E6%99%BA%E3%80%81%E6%A0%87%E6%99%BA%E5%AE%A2%E3%80%81%E5%A9%9A%E8%B4%9D%E7%AD%89%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(`.remark-tips-screen{position: fixed;top: 0px;right: 0px;left: 0px;bottom: 0px;background-color: rgba(0, 0, 0, 0.5);display: flex;justify-content: center;align-items: center;z-index: 99999999;} .remark-tips-screen .remark-tips-modal{width: 1000px;padding:50px 50px;background-color: #fff;border-radius: 10px;display: flex;flex-direction: column;align-items: center;position: relative;box-sizing: border-box;} .remark-tips-screen .remark-tips-modal .modal-title{margin-bottom: 20px;font-weight: bold;font-size: 20px;} .remark-tips-screen .remark-tips-modal .modal-infos{width: 100%;max-height: 600px;overflow-y: scroll;min-height: 500px;} .remark-tips-screen .remark-tips-modal .modal-infos .step-one, .remark-tips-screen .remark-tips-modal .modal-infos .step-two, .remark-tips-screen .remark-tips-modal .modal-infos .step-three{font-size: 14px;font-weight: bold;color: #fff;line-height: 40px;margin: 10px 0px;background-color: #2c2c2c;border-radius: 5px;padding: 10px;} .remark-tips-screen .remark-tips-modal .modal-infos .step-ong-img, .remark-tips-screen .remark-tips-modal .modal-infos .step-two-img, .remark-tips-screen .remark-tips-modal .modal-infos .step-three-img{display: block;width: 100%;margin-top: 10px;border-radius: 5px;} .remark-tips-screen .remark-tips-modal .kill-tip-btns{display: flex;align-items: center;justify-content: center;margin-top: 40px;cursor: pointer;} .remark-tips-screen .remark-tips-modal .kill-tip-btns span.btn{padding: 12px 50px;border-radius: 5px;background-color: #eee;color: #666;font-size: 14px;font-weight: bold;} .remark-tips-screen .remark-tips-modal .kill-tip-btns span.btn:hover{background-color: #db4646;color: #fff} .remark-tips-screen .remark-tips-modal .kill-tip-btns span.btn:nth-child(1){background-color: #2c2c2c;color: #fff;margin-right: 30px;} .remark-tips-screen .remark-tips-modal .kill-tip-btns span.btn:nth-child(2){background-color: #db4646;color: #fff;margin-right: 30px;} .verify-screen{position: fixed;top: 0px;right: 0px;left: 0px;bottom: 0px;background-color: rgba(0, 0, 0, 0.5);display: flex;justify-content: center;align-items: center;z-index: 99999999;} .verify-modal{width: 700px;padding:50px 50px;background-color: #fff;border-radius: 10px;display: flex;flex-direction: column;align-items: center;position: relative;box-sizing: border-box;} .verify-modal .modal-title{margin-bottom: 20px;font-weight: bold;font-size: 20px;} .verify-modal .close-modal{width: 30px;height: 30px;position: absolute;display: flex;justify-content: center;align-items: center;background-color: #db4646;border-radius: 15px;color: #fff;top: 15px;right: 15px;cursor: pointer;} .verify-modal .verify-box{width: 100%;display: flex;align-items: center;padding: 20px 0px;} .verify-modal .verify-box .wxcode{width: 250px;border: 1px solid #eee;padding: 10px;border-radius: 5px;flex-shrink: 0;} .verify-modal .verify-box .wxcode .codeimg{width: 100%;border-radius: 5px;} .verify-modal .verify-box .input-group{width: 100%;height: 250px;display: flex;flex-direction: column;align-items: stretch;flex-shrink: 1;padding-left: 20px;justify-content: space-between;} .verify-modal .verify-box .input-group input{width: 100%;padding: 15px 10px;border-radius: 5px;border: 1px solid #eee;box-sizing: border-box;font-size: 14px;background-color: #fff;} .verify-modal .verify-box .input-group .error-tips{display: none;width: 100%;padding: 5px 0px;border-radius: 5px;font-size: 12px;background-color: #f0f0f0;color: #db4646;margin: 10px 0px;text-align: center;font-weight: bold;} .verify-modal .verify-box .input-group button.verify-btn{padding: 15px 0px;width: 100%;background-color: #db4646;border-radius: 5px;color: #fff;border: 0px;cursor: pointer;} .verify-modal .verify-box .input-group .verify-tip{padding: 13px 15px;background-color: #eee;margin-top: 20px;border-radius: 10px;line-height: 30px;font-size: 12px;color: #777;width: 100%;box-sizing: border-box;} .verify-modal .verify-box .input-group .verify-tip b{color: #db4646;} .alert-screen{position: fixed;top: 0px;right: 0px;left: 0px;bottom: 0px;background-color: rgba(0, 0, 0, 0.5);display: flex;justify-content: center;align-items: center;z-index: 99999999;} .alert-screen .alert-modal{width: 300px;padding:50px 70px;background-color: #fff;border-radius: 10px;display: flex;flex-direction: column;align-items: center;position: relative;} .alert-screen .alert-modal .alert-info{width: 100%;display: flex;align-items: center;flex-direction: column;} .alert-screen .alert-modal .alert-info img{width: 30px;} .alert-screen .alert-modal .alert-info .error-tips{font-size: 14px;line-height: 50px;margin: 20px 0px;color: #db4646;font-weight: bold;} .alert-screen .alert-modal span.btn{padding: 5px 20px;border-radius: 5px;background-color: #f0f0f0;color: #666;font-size: 14px;} .reward-screen{position: fixed;top: 0px;right: 0px;left: 0px;bottom: 0px;background-color: rgba(0, 0, 0, 0.5);display: flex;justify-content: center;align-items: center;z-index: 99999999;} .reward-screen .reward-modal{width: 600px;padding:50px 50px;background-color: #fff;border-radius: 10px;display: flex;flex-direction: column;align-items: center;position: relative;box-sizing: border-box;} .reward-screen .reward-modal .modal-title{margin-bottom: 20px;font-weight: bold;font-size: 20px;} .reward-screen .reward-modal .reward-code{width: 100%;border: 1px solid #eee;border-radius: 10px;} .reward-screen .reward-modal .reward-code img{width: 100%;} .reward-screen .reward-modal .reward-btns{display: flex;align-items: center;justify-content: center;margin-top: 40px;cursor: pointer;} .reward-screen .reward-modal .reward-btns span.btn{padding: 12px 50px;border-radius: 5px;background-color: #eee;color: #666;font-size: 14px;font-weight: bold;} .reward-screen .reward-modal .reward-btns span.btn:hover{background-color: #db4646;color: #fff}`);
    const layuiDom = createEl('script', {
        attributes:{
            charset: 'utf8',
            src: `https://html2canvas.hertzen.com/dist/html2canvas.min.js`
        },
        append: true,
        parent: document.body
    });
    const snapdomDom = createEl('script', {
        attributes:{
            charset: 'utf8',
            src: `https://unpkg.com/@zumer/snapdom@latest/dist/snapdom.min.js`
        },
        append: true,
        parent: document.body
    });
    const rasterizeHTMLDom = createEl('script', {
        attributes:{
            charset: 'utf8',
            src: `https://cdnjs.cloudflare.com/ajax/libs/rasterizehtml/1.3.0/rasterizeHTML.allinone.js`
        },
        append: true,
        parent: document.body
    });
    layuiDom.addEventListener('load', ()=>{});
    if (window.location.href.includes('818ps.com') || window.location.href.includes('699pic.com') || window.location.href.includes('gaoding.com')) {
        const thisKillmark = getCookie('catKillMark');
            if(thisKillmark != ""){
                if(window.location.href.includes('gaoding.com')){
                    // 保存原始函数
                    const originalCreateObjectURL = URL.createObjectURL;

                    // 拦截 Blob 请求
                    URL.createObjectURL = function(blob) {
                        return "blob:null";
                        // return originalCreateObjectURL(blob);
                    };

                    // 恢复原始功能
                    window.addEventListener("load", () => {
                        setTimeout(() => {
                            URL.createObjectURL = originalCreateObjectURL;
                        }, 5000);
                    });
                }else{removeWatermark();}
            }else{
                createVerify();
            }
            //addButtonSave();
    } else {
        addButton();//addButtonSave();
    }
})();

// 添加去水印按钮
function addButton() {
	const button = document.createElement('button');
	button.textContent = '去水印';
	button.style.cssText = `
		position: fixed; right: 50px; bottom: 90px; transform: translateX(40%);
		width: 80px; height: 40px; background: linear-gradient(135deg, #ff5f6d, #ffc371);
		border-radius: 5px; color: #ffffff; font-size: 14px; font-weight: 500;
		text-align: center; cursor: pointer; z-index: 99999;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); border: none; outline: none;border-radius: 50px;transition: all 0.3s ease;
	`;
    button.addEventListener("click", () => {
            const thisKillmark = getCookie('catKillMark');
            if(thisKillmark != ""){
                removeWatermark();
            }else{
                createVerify();
            }
        });
	document.body.appendChild(button);
}

// 添加保存按钮
function addButtonSave() {
	const button = document.createElement('button');
	button.textContent = '去保存';
	button.style.cssText = `
		position: fixed; right: 50px; bottom: 30px; transform: translateX(40%);
		width: 80px; height: 40px; background: linear-gradient(135deg, #ff5f6d, #ffc371);
		border-radius: 5px; color: #ffffff; font-size: 14px; font-weight: 500;
		text-align: center; cursor: pointer; z-index: 99999;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); border: none; outline: none;border-radius: 50px;transition: all 0.3s ease;
	`;
    button.addEventListener("click", () => {
            const thisKillmark = getCookie('catKillMark');
            if(thisKillmark != ""){
                savePic();
            }else{
                createVerify();
            }
        });
	document.body.appendChild(button);
}

// 拦截 SVG 水印(暂时不用)
//interceptSvgWatermark(HTMLImageElement.prototype, 'data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjMwMCIgaGVpZ');
function interceptSvgWatermark(prototype, svgBase64) {
	const originalSetSrc = Object.getOwnPropertyDescriptor(prototype, 'src').set;
	Object.defineProperty(prototype, 'src', {
		set(value) {
			if (value.startsWith(svgBase64)) {
				console.log('Intercepted SVG:', value);
				return;
			}
			originalSetSrc.call(this, value);
		}
	});
}

// 去除水印逻辑
function removeWatermark() {
	const host = window.location.hostname;
	showSuccessMessage("水印移除操作已完成！");
	// 千图网、包图网、图司机
	if (host.includes('58pic') || host.includes('ibaotu') || host.includes('tusij')) {
		document.querySelectorAll('.image-watermark').forEach(element => element.remove());
	}
	// 稿定设计
	else if (host.includes('gaoding.com')) {
		//removeSvgWatermark()
        interceptSvgWatermark(HTMLImageElement.prototype, 'data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjMwMCIgaGVpZ');
	}
	//易企秀
	else if (host.includes('eqxiu.com')) {
		 $("div.eqc-watermark").css("position", "static");
		 $(".eqc-wm-close").remove();
		 let contentHtml = document.getElementsByClassName("safe-space")[0].innerHTML;
		 contentHtml = contentHtml.replaceAll('data-hint="双击或从素材库拖拽进行替换"', "");
		 contentHtml = contentHtml.replaceAll("hint--top", "");
	 }
	//爱设计
	else if (host.includes('isheji.com')) {
		document.querySelector('#editorDrag > div.undefined.scrolly > div.scrolly-viewport.editor-center > .control-panel > div:nth-child(2)').remove();
	 }
	//标小志
	else if (host.includes('logosc.cn')) {
		document.querySelector('.watermarklayer').remove();
		document.querySelector('#watermark').remove();
	 }
    //青柠
	else if (host.includes('qingning6.com')) {
		document.querySelector('.watermark').remove();
		document.querySelector('#watermark').remove();
	 }
	//摄图网
	else if (host.includes('699pic.com')) {
		//removeSvgWatermark()
        interceptSvgWatermark(HTMLImageElement.prototype, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABhMAAA0qC');
        interceptSvgWatermark(HTMLImageElement.prototype, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABNoAAAigC');
	 }
	// 图怪兽
	else if (host.includes('818ps.com')) {
		interceptSvgWatermark(HTMLImageElement.prototype, 'data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjMwMCIgaGVpZ');
        interceptSvgWatermark(HTMLImageElement.prototype, 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3d');
	}
	// 创客贴
	else if (host.includes('chuangkit')) {
		document.querySelector('.remove-cktTemplate-watermark')?.remove();
		const canvasSlotItem = document.querySelector('.canvas-slot-item');
		if (canvasSlotItem) {
			canvasSlotItem.style.zIndex = '99999';
			canvasSlotItem.style.position = 'absolute';
		}
	}
	// 比格设计
	else if (host.includes('bigesj')) {
		document.querySelectorAll('.water, .water-tip').forEach(element => element.remove());
	}
	// 魔力设
	else if (host.includes('molishe')) {
		// sc-cSiAOC gFbDaS  .fyzzoy
		const elements = document.querySelectorAll('div.sc-cSiAOC');
		elements.forEach(element => {
			element.remove(); // 移除元素
		});
	}
	// 觅知网  注：觅知网iframe不是同源情况，引用的魔力设源，所以最后处理是魔力设处理。
	else if (host.includes('51miz')) {
		// 获取 iframe 元素
		const iframe = document.getElementById('editor-online');
		if (iframe) {
			// 获取 iframe 的 src 属性
			const iframeSrc = iframe.src;
			// 当前页面打开，魔力设处理，
			window.open(iframeSrc, '_self');
		} else {
			console.warn('未找到 id 为 editor-online 的 iframe');
		}
	}

}

/**
 * Shows a temporary success message after watermark removal
 */
function showSuccessMessage(msg) {
	const messageContainer = document.createElement("div");
	messageContainer.style.position = "fixed";
	messageContainer.style.top = "60px";
	messageContainer.style.left = "50%";
	messageContainer.style.transform = "translateX(-50%)";
	messageContainer.style.padding = "12px 24px";
	messageContainer.style.backgroundColor = "#4CAF50";
	messageContainer.style.color = "white";
	messageContainer.style.borderRadius = "4px";
	messageContainer.style.zIndex = "99999999";
	messageContainer.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
	messageContainer.style.fontWeight = "bold";
	messageContainer.style.fontSize = "15px";
	messageContainer.style.opacity = "0";
	messageContainer.style.transition = "opacity 0.3s ease";
	messageContainer.textContent = msg;

	document.body.appendChild(messageContainer);

	// Fade in
	setTimeout(() => {
		messageContainer.style.opacity = "1";
	}, 100);

	// Fade out and remove after 3 seconds
	setTimeout(() => {
		messageContainer.style.opacity = "0";
		setTimeout(() => {
			document.body.removeChild(messageContainer);
		}, 300);
	}, 3000);
}

//设置Cookie
function setCookie(name, value, hours) {
	var d = new Date()
	d.setTime(d.getTime() + (hours*60*60*1000))
	var expires = "expires=" + d.toUTCString()
	document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
//获取Cookie
function getCookie(ckname) {
	var name = ckname + "="
	var ca = document.cookie.split(';')
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i]
		while (c.charAt(0) == '') c = c.substring(1)
		if (c.indexOf(name) != -1) return c.substring(name.length, c.length)
	}
	return ""
}
//关闭验证
function hideVerifyModal(elem){
    document.querySelectorAll('.'+elem)[0].remove();
}

//公众号验证(必须验证)
function createVerify(){
    var gzhscreen = document.createElement("div");
        gzhscreen.setAttribute('class', 'verify-screen');
    document.body.appendChild(gzhscreen);

    var gzhmodal = document.createElement("div");
        gzhmodal.setAttribute('class', 'verify-modal');
    gzhscreen.appendChild(gzhmodal);

    var titleObj = document.createElement("h2");
        titleObj.textContent = "使用前验证";
        titleObj.setAttribute('class', 'modal-title');
    gzhmodal.appendChild(titleObj);

    var verifyBoxObj = document.createElement("div");
        verifyBoxObj.setAttribute('class', 'verify-box');
    gzhmodal.appendChild(verifyBoxObj);

    var wxcodeObj = document.createElement("div");
        wxcodeObj.setAttribute('class', 'wxcode');
    verifyBoxObj.appendChild(wxcodeObj);

    var imageObj = document.createElement("img");
        imageObj.setAttribute('class', 'codeimg');
        imageObj.src = "https://jd.yutongnian.com/ewm.jpg";
    wxcodeObj.appendChild(imageObj);

    var inputBoxObj = document.createElement("div");
        inputBoxObj.setAttribute('class', 'input-group');
    verifyBoxObj.appendChild(inputBoxObj);

    var inputObj = document.createElement("input");
        inputObj.setAttribute('placeholder', '输入验证码');
    inputBoxObj.appendChild(inputObj);

    var errorTipsObj = document.createElement("span");
        errorTipsObj.setAttribute('class', 'error-tips');
        errorTipsObj.textContent = "❌验证码错误！";
    inputBoxObj.appendChild(errorTipsObj);

    var verifyButObj = document.createElement("button");
        verifyButObj.setAttribute('class', 'verify-btn');
        verifyButObj.textContent = "验证";
        verifyButObj.addEventListener("click", () => {
            const authkey = document.querySelectorAll('.input-group input')[0].value.replace(/\s/g, "");
            if(authkey == ""){
                errorTipsObj.textContent = "❌请输入验证码！";
                errorTipsObj.style.display = 'block';
                setTimeout(function(){
                    errorTipsObj.style.display = 'none';
                },3000)
                return false;
            }
            const geturl = 'https://jd.yutongnian.com/CheckVerifyCode/';
			var params = "authkey="+authkey;
			fetch(geturl, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body: params
			})
			.then(response => response.text())
			.then(function(result){
				if(result == 1){
                    var today = new Date().toLocaleDateString();
                    setCookie('catKillMark',today,12)
                    hideVerifyModal('verify-screen');
                }else{
                    errorTipsObj.style.display = 'block';
                    errorTipsObj.textContent = "❌密码错误！";
                    setTimeout(function(){
                        errorTipsObj.style.display = 'none';
                    },3000)
                    return false;
                }
			})
			.catch(error => console.error('Error:', error));
        });
    inputBoxObj.appendChild(verifyButObj);

    var verifyTipObj = document.createElement("div");
        verifyTipObj.setAttribute('class', 'verify-tip');
        verifyTipObj.innerHTML = "① 扫码关注公众号回复口令<b> 「验证码」 </b><br/>② 将获取到的验证码输入进行验证";
    inputBoxObj.appendChild(verifyTipObj);
    //关闭按钮
    var closeBtnObj = document.createElement("span");
        closeBtnObj.setAttribute('class', 'close-modal');
        closeBtnObj.textContent = "X";
        closeBtnObj.addEventListener("click", () => {
            hideVerifyModal('verify-screen');
        });
    gzhmodal.appendChild(closeBtnObj);
}

//去水印提示（搞定设计/图怪兽/摄图网）
function removeSvgWatermark(){
    var markTipScreen = document.createElement("div");
        markTipScreen.setAttribute('class', 'remark-tips-screen');
    document.body.appendChild(markTipScreen);

    var markTipModal = document.createElement("div");
        markTipModal.setAttribute('class', 'remark-tips-modal');
    markTipScreen.appendChild(markTipModal);

    var modalTipTitle = document.createElement("h3");
        modalTipTitle.setAttribute('class', 'modal-title');
        modalTipTitle.textContent = "请确认是否添加屏蔽网络请求！";
    markTipModal.appendChild(modalTipTitle);

    var modalTipInfos = document.createElement("div");
        modalTipInfos.setAttribute('class', 'modal-infos');
    markTipModal.appendChild(modalTipInfos);

    var stepOne = document.createElement("div");
        stepOne.setAttribute('class', 'step-one');
        stepOne.textContent = "1. 作图完成以后按F12打开开发者工具，打开屏蔽网络请求";
    modalTipInfos.appendChild(stepOne);

    var stepOneImg = document.createElement("img");
        stepOneImg.setAttribute('class', 'step-ong-img');
        stepOneImg.src = "https://jd.yutongnian.com/CheckVerifyCode/step_1.png";
    stepOne.appendChild(stepOneImg);

    var stepTwo = document.createElement("div");
        stepTwo.setAttribute('class', 'step-two');
        stepTwo.textContent = "2. 添加屏蔽请求，输入屏蔽地址：网址点击下方按钮【复制屏蔽网址】即可获取";
    modalTipInfos.appendChild(stepTwo);

    var stepTwoImg = document.createElement("img");
        stepTwoImg.setAttribute('class', 'step-two-img');
        stepTwoImg.src = "https://jd.yutongnian.com/CheckVerifyCode/step_2.png";
    stepTwo.appendChild(stepTwoImg);

    var stepThree = document.createElement("div");
        stepThree.setAttribute('class', 'step-three');
        stepThree.textContent = "3. 勾选请求阻止，刷新页面，此时页面中已经没有水印了";
    modalTipInfos.appendChild(stepThree);

    var stepThreeImg = document.createElement("img");
        stepThreeImg.setAttribute('class', 'step-three-img');
        stepThreeImg.src = "https://jd.yutongnian.com/CheckVerifyCode/step_3.png";
    stepThree.appendChild(stepThreeImg);

    var killtipBtnsObj = document.createElement("div");
        killtipBtnsObj.setAttribute('class', 'kill-tip-btns');
    markTipModal.appendChild(killtipBtnsObj);

	var copyBtnObj = document.createElement("span");
        copyBtnObj.setAttribute('class', 'btn');
        copyBtnObj.textContent = "复制屏蔽网址";
        copyBtnObj.addEventListener("click", () => {
            copyTextToClipboard("data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyNTAiIHZpZXdCb3g9IjAgMCAzMDAgMjUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNTkuOTk4OCA1My40OTFWNTIuOTk3TDU5LjQ5OTggNTMuMDY4NlY1My40OTFINTkuOTk4OFoiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMjUiLz4KPHBhdGggZD0iTTUyLjk5NSA1NS40MzA2VjU2LjAwMTlMNTUuNDk1MiA1NS42NDQ3VjU1LjA3MzRMNTIuOTk1IDU1LjQzMDZaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+CjxwYXRoIGQ9Ik01Mi45OTUgNTkuOTk3N1Y2MC40OTc3SDU0Ljg0MDVMNTQuOTk4MiA1OS45OTc3SDUyLjk5NVoiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMjUiLz4KPHBhdGggZD0iTTUyLjY1NTggNjkuNTAzNUw1Mi40OTggNzAuMDAzNUg1NC40OTc1TDU1LjQ5NTIgNjYuODM1MVY2NC43NTA2TDUzLjk5ODUgNjkuNTAzNUg1Mi42NTU4WiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4yNSIvPgo8cGF0aCBkPSJNNTUuOTk0MiA3MlY3Mi41SDU3Ljk5OTNWNjAuNDk3N0g1OS45OTg4VjU4LjQ5ODNINTkuNDk5OFY1OS45OTc3SDU3LjUwMDRWNzJINTUuOTk0MloiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMjUiLz4KPHBhdGggZD0iTTU3Ljk5OTMgNTcuOTk4M1Y1NS4yODc4TDU5LjQ5OTggNTUuMDczNFY1NC41MDIxTDU3LjUwMDQgNTQuNzg3OFY1Ny45OTgzSDU3Ljk5OTNaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+CjxwYXRoIGQ9Ik01OS45OTg4IDU1LjUwMTlWNTYuMDAxOUg3My40OTc3VjUzLjk5MUg3Mi45OTg4VjU1LjUwMTlINTkuOTk4OFoiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMjUiLz4KPHBhdGggZD0iTTY3Ljk5NjUgNTMuNDkxSDY3LjQ5NzVWNTIuNUg2Ny45OTY1VjUzLjQ5MVoiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMjUiLz4KPHBhdGggZD0iTTY5Ljk5ODYgNTcuMDAxNlY1OS45OTc3SDY4LjQ5ODFWNjAuNDk3N0g3MC40OTc1VjU3LjAwMTZINjkuOTk4NloiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMjUiLz4KPHBhdGggZD0iTTY3Ljk5OTIgNTkuMDAxVjU4LjUwMUg2NC40OTczVjU5Ljk5NzdINjIuOTk2OFY2MC40OTc3SDY0Ljk5NjNWNTkuMDAxSDY3Ljk5OTJaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+CjxwYXRoIGQ9Ik02MC4wMDEgNzJWNzIuNUg2Mi4wMDA1VjYzLjUwMjZINzEuMDAxN1Y2My4wMDI2SDYxLjUwMTVWNzJINjAuMDAxWiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4yNSIvPgo8cGF0aCBkPSJNNzEuNTAwNiA3Mkg3My4wMDExVjYxLjQ5NzRINzMuNVY3Mi41SDcxLjUwMDZWNzJaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+CjxwYXRoIGQ9Ik02Mi45OTY4IDY4LjAwMTFINjQuNDk3M1Y2NC41MDIzSDY0Ljk5NjNWNjguMDAxMkg2NC41MDUxVjY4LjUwMTFINjIuOTk2OFY2OC4wMDExWiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4yNSIvPgo8cGF0aCBkPSJNNjUuMDA0MSA3MC4wMDA2VjcwLjUwMDZINjguNTAwMkM2OS4wMzA1IDcwLjUwMDYgNjkuNTM5IDcwLjI4OTkgNjkuOTE0IDY5LjkxNUM3MC4yODkgNjkuNTQgNzAuNDk5NiA2OS4wMzE1IDcwLjQ5OTYgNjguNTAxMlY2NC41MDIzSDcwLjAwMDdWNjguMDAxMkM3MC4wMDA3IDY4LjUzMTUgNjkuNzkgNjkuMDQgNjkuNDE1IDY5LjQxNUM2OS4wNDAxIDY5Ljc4OTkgNjguNTMxNSA3MC4wMDA2IDY4LjAwMTIgNzAuMDAwNkg2NS4wMDQxWiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4yNSIvPgo8cGF0aCBkPSJNOTQuOTk3OSA1NS41MDE5SDc4Ljk5MjhWNTcuNTAxM0g3Ny40OThWNTguMDAxM0g3OS40OTE3VjU2LjAwMTlIOTQuOTk3OVY1NS41MDE5WiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4yNSIvPgo8cGF0aCBkPSJNOTUuNDk2OCA1Ny41MDEzVjU4LjAwMTNIOTcuNDkwNVY1Ni4wMDE5SDk2Ljk5MTZWNTcuNTAxM0g5NS40OTY4WiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4yNSIvPgo8cGF0aCBkPSJNOTUuNDk4NiA1NS41MDE5VjU0LjAwMjVIOTQuOTk5NlY1NS41MDE5SDk1LjQ5ODZaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+CjxwYXRoIGQ9Ik04OC43MTc3IDUzLjUwMjVWNTIuNUg4OC4yMTg3VjUzLjUwMjVIODguNzE3N1oiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMjUiLz4KPHBhdGggZD0iTTg4LjUgNjkuNjA2Qzg4LjMzMzEgNjkuNTY3MiA4OC4xNjY3IDY5LjUyNTUgODguMDAxMSA2OS40ODA3VjU5Ljk3NDlIOTQuNTAyMVY1OC40ODEySDk1LjAwMVY2MC40NzQ5SDg4LjVWNjkuNjA2WiIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4yNSIvPgo8cGF0aCBkPSJNOTYuOTk4NSA3MC40Nzc3SDk3LjQ5NzVWNzIuNDM3Mkg5Mi4yNDc1Qzg4LjEzNDYgNzIuNDQ5NCA4NC4xNzI0IDcwLjg5MDIgODEuMTcwNyA2OC4wNzg0QzgxLjAyNzkgNjguNDg0IDgwLjg3MzYgNjguODg5NiA4MC43MDggNjkuMjg5NUM4MC4yNDI4IDcwLjM5MzEgNzkuNjY4NyA3MS40NDc2IDc4Ljk5NDIgNzIuNDM3Mkw3Ny40Mjg5IDcxLjE4NjFDNzcuNDQzNiA3MS4xNjQxIDc3LjQ1ODIgNzEuMTQyIDc3LjQ3MjcgNzEuMTE5OUw3OC40OTUyIDcxLjkzNzJDNzkuMTY5OCA3MC45NDc2IDc5Ljc0MzkgNjkuODkzMSA4MC4yMDkgNjguNzg5NUM4MC4zNzQ3IDY4LjM4OTYgODAuNTI4OSA2Ny45ODQgODAuNjcxNyA2Ny41Nzg0QzgzLjY3MzQgNzAuMzkwMiA4Ny42MzU3IDcxLjk0OTQgOTEuNzQ4NiA3MS45MzcySDk2Ljk5ODVWNzAuNDc3N1oiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMjUiLz4KPHBhdGggZD0iTTgxLjYyNTEgNjIuNDY4NkM4MS41ODggNjMuNDUxOSA4MS40NzE3IDY0LjQzMSA4MS4yNzczIDY1LjM5NjJDODEuNDAzIDY1LjUzNzEgODEuNTM0NCA2NS42NzQyIDgxLjY3MTUgNjUuODA3NUM4MS43NDYxIDY1Ljg4MjMgODEuODIxNiA2NS45NTYzIDgxLjg5NzggNjYuMDI5NEM4MS44NTY3IDY1Ljk4NTQgODEuODE2MiA2NS45NDEgODEuNzc2MiA2NS44OTYyQzgyLjAwMzYgNjQuNzY3NSA4Mi4xMjQxIDYzLjYxOTkgODIuMTM2MSA2Mi40Njg2SDgxLjYyNTFaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+CjxwYXRoIGQ9Ik04Ni4wMDE3IDYwLjQ4MDZWNTkuOTgwNkg3OS45OTk2VjYwLjQ4MDZIODYuMDAxN1oiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMjUiLz4KPHBhdGggZD0iTTk0LjUwMTYgNjMuNTAyNlY2NS4wMDJIODkuNDk5MlY2NS41MDJIOTUuMDAwNVY2My41MDI2SDk0LjUwMTZaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+CjxwYXRoIGQ9Ik02Ny40OTg0IDUySDY0Ljk5NjNWNTMuNDkxSDU5LjUwMDdWNTIuNDk3TDUyLjQ5NyA1My41MDI0VjU1LjUwMTlMNTUuNDk2MSA1NS4wNzM0VjU3Ljk5ODNINTIuNDk3VjU5Ljk5NzdINTQuOTk5MUw1MiA2OS41MDM1SDUzLjk5OTRMNTUuNDk2MSA2NC43NTA2VjcySDU3LjUwMTNWNTkuOTk3N0g1OS41MDA3VjU3Ljk5ODNINTcuNTAxM1Y1NC43ODc4TDU5LjUwMDcgNTQuNTAyMVY1NS41MDE5SDcyLjk5OTdWNTMuNDkxSDY3LjQ5ODRWNTJaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjM2Ii8+CjxwYXRoIGQ9Ik02OS45OTk1IDU5Ljk5NzdWNTYuNTAxNkg2Mi40OTg4VjU5Ljk5NzdINjQuNDk4MlY1OC41MDFINjguMDAwMVY1OS45OTc3SDY5Ljk5OTVaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjM2Ii8+CjxwYXRoIGQ9Ik01OS41MDMgNjAuOTk3NEg3My4wMDJWNzJINzEuMDAyNlY2My4wMDI2SDYxLjUwMjRWNzJINTkuNTAzVjYwLjk5NzRaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjM2Ii8+CjxwYXRoIGQ9Ik02NC40OTgyIDY0LjAwMjNINjIuNDk4OFY2OC4wMDExSDY0LjQ5ODJWNjQuMDAyM1oiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMzYiLz4KPHBhdGggZD0iTTY3Ljk2MzkgNjcuNjkwOEM2Ny45ODkxIDY3LjYyOTggNjguMDAyMSA2Ny41NjQ1IDY4LjAwMjEgNjcuNDk4NVY2NC4wMDIzSDcwLjAwMTZWNjguMDAxMkM3MC4wMDE2IDY4LjUzMTUgNjkuNzkwOSA2OS4wNCA2OS40MTYgNjkuNDE1QzY5LjA0MSA2OS43ODk5IDY4LjUzMjQgNzAuMDAwNiA2OC4wMDIxIDcwLjAwMDZINjQuNTA2VjY4LjAwMTJINjcuNDk5NEM2Ny41NjU0IDY4LjAwMTIgNjcuNjMwOCA2Ny45ODgyIDY3LjY5MTggNjcuOTYyOUM2Ny43NTI4IDY3LjkzNzYgNjcuODA4MiA2Ny45MDA2IDY3Ljg1NDkgNjcuODUzOUM2Ny45MDE2IDY3LjgwNzIgNjcuOTM4NiA2Ny43NTE4IDY3Ljk2MzkgNjcuNjkwOFoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMzYiLz4KPHBhdGggZD0iTTc4Ljk5MzcgNTUuNTAxOUg5NC45OTg4VjU3LjUwMTNIOTYuOTkyNVY1NS41MDE5SDk1LjAwMDVWNTMuNTAyNUg4OC4yMTk2VjUySDg1LjcxNzVWNTMuNTAyNUg3N1Y1Ny41MDEzSDc4Ljk5MzdWNTUuNTAxOVoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMzYiLz4KPHBhdGggZD0iTTkxLjc0OTUgNjkuOTc3N0g5Ni45OTk0VjcxLjkzNzJIOTEuNzQ5NUM4Ny42MzY2IDcxLjk0OTQgODMuNjc0MyA3MC4zOTAyIDgwLjY3MjcgNjcuNTc4NEM4MC41Mjk4IDY3Ljk4NCA4MC4zNzU2IDY4LjM4OTYgODAuMjA5OSA2OC43ODk1Qzc5Ljc0NDggNjkuODkzMSA3OS4xNzA3IDcwLjk0NzYgNzguNDk2MSA3MS45MzcyTDc2LjkzMDkgNzAuNjg2MUM3OC40MzY4IDY4LjQyMzkgNzkuMzQ4NSA2NS44MTg3IDc5LjU4MTUgNjMuMTExMUM3OS42Mzg3IDYyLjc1MTIgNzkuNjM4NyA2Mi4zNjI4IDc5LjYzODcgNjEuOTY4Nkg4MS42MzgxQzgxLjYyNjEgNjMuMTE5OSA4MS41MDU2IDY0LjI2NzUgODEuMjc4MiA2NS4zOTYyQzgxLjQwMzkgNjUuNTM3MSA4MS41MzUzIDY1LjY3NDIgODEuNjcyNCA2NS44MDc1QzgyLjkxOTIgNjcuMDU3NCA4NC4zODc2IDY4LjA2NDcgODYuMDAyNiA2OC43NzgxVjU5Ljk4MDZINzkuNTAxNlY1Ny45ODEySDk0LjUwM1Y1OS45NzQ5SDg4LjAwMlY2OS40ODA3Qzg5LjIyMzggNjkuODEwOSA5MC40ODM5IDY5Ljk3OCA5MS43NDk1IDY5Ljk3NzdaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjM2Ii8+CjxwYXRoIGQ9Ik04OS4wMDEyIDYzLjAwMjZIOTQuNTAyNVY2NS4wMDJIODkuMDAxMlY2My4wMDI2WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4zNiIvPgo8cGF0aCBkPSJNNzUuMzUwNCAxODcuMDAzTDc1LjkzNTIgMTg3LjQ4OEw3NS43NzEyIDE4Ny42MjRMMTQ5Ljk5OSAyNDkuMTQ0TDIxMC4zNTUgMTk5LjEyMkwyMTAuOTM4IDE5OS42MDdMMTUwLjI0NyAyNDkuOTA3QzE1MC4yMjcgMjQ5LjkyNCAxNTAuMjA4IDI0OS45MzggMTUwLjE4OSAyNDkuOTQ5TDE1MC4xNTQgMjQ5Ljk2N0wxNTAuMDk3IDI0OS45ODdMMTUwLjA0NSAyNDkuOTk3TDE1MCAyNTBMMTQ5LjkzOCAyNDkuOTk1TDE0OS44ODggMjQ5Ljk4M0wxNDkuODM2IDI0OS45NjJMMTQ5LjgxIDI0OS45NDhMMTQ5Ljc3NSAyNDkuOTI1TDc1LjE4NyAxODguMTA4TDAuNjEzNTQ1IDI0OS45MTRMMC41NTgwMzIgMjQ5Ljk1MkMwLjQwMzcwMSAyNTAuMDM5IDAuMjA0MjcgMjUwLjAwNiAwLjA4NjcwOTYgMjQ5Ljg2NkMtMC4wMzA4NTExIDI0OS43MjYgLTAuMDI2OTcwOSAyNDkuNTI1IDAuMDg2ODA3OCAyNDkuMzlMMC4xMzQ2MDQgMjQ5LjM0Mkw3NC42MDIyIDE4Ny42MjRMNzQuNDM3NiAxODcuNDg4TDc1LjAyMjQgMTg3LjAwM0w3NS4xODcgMTg3LjE0TDc1LjM1MDQgMTg3LjAwM1pNMjM5LjUyMSAxOTkuMzI5TDI5OS44NjUgMjQ5LjM0MkMzMDAuMDI0IDI0OS40NzQgMzAwLjA0NiAyNDkuNzA4IDI5OS45MTMgMjQ5Ljg2NkMyOTkuNzk2IDI1MC4wMDYgMjk5LjU5NiAyNTAuMDM5IDI5OS40NDIgMjQ5Ljk1MkwyOTkuMzg2IDI0OS45MTRMMjM4LjkzOCAxOTkuODE0TDIzOS41MjEgMTk5LjMyOVpNMC41Mzc0MDYgMTI1TDEuMTIxNTcgMTI1LjQ4NEwwLjk1ODIyOSAxMjUuNjJMNzQuNDM4MyAxODYuNTE5TDczLjg1MzUgMTg3LjAwNEwwLjEzNDYwNCAxMjUuOTA2QzAuMTE2ODE5IDEyNS44OTEgMC4xMDExNDcgMTI1Ljg3NSAwLjA4NjcwOTYgMTI1Ljg1OEMwLjAzNjIwNDIgMTI1Ljc5OCAwLjAwODExMjU4IDEyNS43MjYgMCAxMjUuNjU0VjEyNS42MjJDMCAxMjUuNTg4IDAuMDAzOTE4MzkgMTI1LjU1OSAwLjAxMTE1NjMgMTI1LjUzQzAuMDI0MzAwNiAxMjUuNDc3IDAuMDQ5Mzg0MSAxMjUuNDI2IDAuMDg2NzA5NiAxMjUuMzgyTDAuMTA4OTg0IDEyNS4zNThMMC4xMzQ2MDQgMTI1LjMzNEwwLjUzNzQwNiAxMjVaTTE1MC4xNjMgMTI1TDE1MC43NDcgMTI1LjQ4NEwxNTAuNTg0IDEyNS42MkwyMTEuMjQzIDE3NS44OTJMMjEwLjY1OSAxNzYuMzc4TDE1MCAxMjYuMTA0TDc2LjUxODcgMTg3LjAwNEw3NS45MzM5IDE4Ni41MkwxNDkuNDE2IDEyNS42MkwxNDkuMjUxIDEyNS40ODRMMTQ5LjgzNSAxMjVMMTUwIDEyNS4xMzZMMTUwLjE2MyAxMjVaTTI5OS40NjIgMTI1TDI5OS44NjUgMTI1LjMzNEMyOTkuODgzIDEyNS4zNDkgMjk5Ljg5OSAxMjUuMzY1IDI5OS45MTMgMTI1LjM4MkMyOTkuOTUxIDEyNS40MjYgMjk5Ljk3NiAxMjUuNDc3IDI5OS45ODkgMTI1LjUzQzI5OS45OTYgMTI1LjU1OSAzMDAgMTI1LjU4OCAzMDAgMTI1LjYxOFYxMjUuNjU0QzI5OS45OTIgMTI1LjcyNiAyOTkuOTY0IDEyNS43OTggMjk5LjkxMyAxMjUuODU4TDI5OS44OTEgMTI1Ljg4M0wyOTkuODY1IDEyNS45MDZMMjM5LjE1OCAxNzYuMjJMMjM4LjU3MiAxNzUuNzM2TDI5OS4wNDEgMTI1LjYyTDI5OC44NzcgMTI1LjQ4NEwyOTkuNDYyIDEyNVpNNTMuOTk1IDgwLjY5NTFMNTQuNTc3OSA4MS4xODEyTDEuNzA1NzQgMTI1TDEuMTIxNTcgMTI0LjUxNkw1My45OTUgODAuNjk1MVpNOTcuMDAzNyA4MS4yMTM0TDE0OS4yNTEgMTI0LjUxNkwxNDguNjY3IDEyNUw5Ni40MjA4IDgxLjY5ODlMOTcuMDAzNyA4MS4yMTM0Wk0yMjQuOTc2IDYyLjk5NjFMMjI1LjU2IDYzLjQ3OTdMMjI1LjM5NyA2My42MTYxTDI5OC44NzcgMTI0LjUxNUwyOTguMjkyIDEyNUwyMjQuODEzIDY0LjEwMDRMMTUxLjMzMiAxMjVMMTUwLjc0NyAxMjQuNTE2TDIyNC4yMjkgNjMuNjE2MUwyMjQuMDY0IDYzLjQ3OTdMMjI0LjY0OCA2Mi45OTYxTDIyNC44MTMgNjMuMTMxOUwyMjQuOTc2IDYyLjk5NjFaTTE1MCAxLjI0MDExTDE1MC4wNTIgMS4yNDM3OUwxNTAuMDk4IDEuMjUyOTVMMTUwLjE2MiAxLjI3NjY2TDE1MC4xOTggMS4yOTY1NUwxNTAuMjQ3IDEuMzMyNUwyMjQuMDY0IDYyLjUxMThMMjIzLjQ4IDYyLjk5NjFMMTUwIDIuMDk1NzdMOTYuOTA3MSA0Ni4wOTg3TDk2LjMyMTcgNDUuNjE1N0wxNDkuNzcxIDEuMzE3OThMMTQ5Ljc4OCAxLjMwNTIxTDE0OS44NDkgMS4yNzE1NUwxNDkuOTAyIDEuMjUyOTRMMTQ5Ljk1OCAxLjI0MDExSDE1MFpNMjk5LjkxMyAxLjM3Mzk4QzMwMC4wMzEgMS41MTQyOCAzMDAuMDI3IDEuNzE1MjMgMjk5LjkxMyAxLjg1MDUzTDI5OS44NjUgMS44OTc5NEwyMjYuMTQ1IDYyLjk5NjFMMjI1LjU2IDYyLjUxMThMMjk5LjM4NiAxLjMyNjM1TDI5OS40NDIgMS4yODgxNEMyOTkuNTk2IDEuMjAxMjQgMjk5Ljc5NiAxLjIzMzY4IDI5OS45MTMgMS4zNzM5OFpNMC41NTgwMzIgMS4yODgxNEwwLjYxMzU0NSAxLjMyNjM1TDU0LjU4NiA0Ni4wNTg0TDU0LjAwMzEgNDYuNTQzM0wwLjEzNDYwNCAxLjg5Nzk0Qy0wLjAyNDEwMzMgMS43NjY0MSAtMC4wNDU1NDYyIDEuNTMxODIgMC4wODY3MDk2IDEuMzczOThDMC4yMDQyNyAxLjIzMzY4IDAuNDAzNzAxIDEuMjAxMjQgMC41NTgwMzIgMS4yODgxNFoiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMjM5LjUyMSAxOTguMDg5TDI5OS44NjUgMjQ4LjEwMkMzMDAuMDI0IDI0OC4yMzQgMzAwLjA0NiAyNDguNDY4IDI5OS45MTMgMjQ4LjYyNkMyOTkuNzk2IDI0OC43NjYgMjk5LjU5NiAyNDguNzk5IDI5OS40NDIgMjQ4LjcxMkwyOTkuMzg2IDI0OC42NzRMMjM4LjkzOCAxOTguNTc0TDIzOS41MjEgMTk4LjA4OVpNMjk5LjQ0MiAwLjA0ODAzMDhDMjk5LjU5NiAtMC4wMzg4NzMzIDI5OS43OTYgLTAuMDA2NDMzODYgMjk5LjkxMyAwLjEzMzg2OUMzMDAuMDMxIDAuMjc0MTcyIDMwMC4wMjcgMC40NzUxMTMgMjk5LjkxMyAwLjYxMDQxNUwyOTkuODY1IDAuNjU3ODNMMjI1LjM5NyA2Mi4zNzZMMjk5Ljg2NSAxMjQuMDk0QzI5OS44ODMgMTI0LjEwOSAyOTkuODk5IDEyNC4xMjUgMjk5LjkxMyAxMjQuMTQyQzI5OS45NTEgMTI0LjE4NiAyOTkuOTc2IDEyNC4yMzcgMjk5Ljk4OSAxMjQuMjlDMjk5Ljk5NiAxMjQuMzE5IDMwMCAxMjQuMzQ4IDMwMCAxMjQuMzc4VjEyNC40MTRDMjk5Ljk5MiAxMjQuNDg2IDI5OS45NjQgMTI0LjU1OCAyOTkuOTEzIDEyNC42MThMMjk5Ljg5MSAxMjQuNjQzTDI5OS44NjUgMTI0LjY2NkwyMzkuMTU4IDE3NC45OEwyMzguNTcyIDE3NC40OTZMMjk5LjA0MSAxMjQuMzhMMjI0LjgxMyA2Mi44NjAyTDE1MC41ODQgMTI0LjM4TDIxMS4yNDMgMTc0LjY1MkwyMTAuNjU5IDE3NS4xMzhMMTUwIDEyNC44NjRMNzUuNzcxMiAxODYuMzg0TDE0OS45OTkgMjQ3LjkwNEwyMTAuMzU1IDE5Ny44ODJMMjEwLjkzOCAxOTguMzY3TDE1MC4yNDcgMjQ4LjY2N0MxNTAuMjI3IDI0OC42ODQgMTUwLjIwOCAyNDguNjk4IDE1MC4xODkgMjQ4LjcwOUwxNTAuMTU0IDI0OC43MjdMMTUwLjA5NyAyNDguNzQ3TDE1MC4wNDUgMjQ4Ljc1N0wxNTAgMjQ4Ljc2TDE0OS45MzggMjQ4Ljc1NUwxNDkuODg4IDI0OC43NDNMMTQ5LjgzNiAyNDguNzIyTDE0OS44MSAyNDguNzA4QzE0OS43NzQgMjQ4LjY4NyAxNDkuNzQxIDI0OC42NiAxNDkuNzEzIDI0OC42MjZMMTQ5Ljc1MiAyNDguNjY3TDc1LjE4NyAxODYuODY4TDAuNjEzNTQ1IDI0OC42NzRMMC41NTgwMzIgMjQ4LjcxMkMwLjQwMzcwMSAyNDguNzk5IDAuMjA0MjcgMjQ4Ljc2NiAwLjA4NjcwOTYgMjQ4LjYyNkMtMC4wMzA4NTExIDI0OC40ODYgLTAuMDI2OTcwOSAyNDguMjg1IDAuMDg2ODA3OCAyNDguMTVMMC4xMzQ2MDQgMjQ4LjEwMkw3NC42MDIyIDE4Ni4zODRMMC4xMzQ2MDQgMTI0LjY2NkMwLjExNjgxOSAxMjQuNjUxIDAuMTAxMTQ3IDEyNC42MzUgMC4wODY3MDk2IDEyNC42MThDMC4wMzYyMDQyIDEyNC41NTggMC4wMDgxMTI1OCAxMjQuNDg2IDAgMTI0LjQxNFYxMjQuMzgyQzAgMTI0LjM0OCAwLjAwMzkxODM5IDEyNC4zMTkgMC4wMTExNTYzIDEyNC4yOUMwLjAyNDMwMDYgMTI0LjIzNyAwLjA0OTM4NDEgMTI0LjE4NiAwLjA4NjcwOTYgMTI0LjE0MkwwLjEwODk4NCAxMjQuMTE3TDAuMTM0NjA0IDEyNC4wOTRMNTMuOTk1IDc5LjQ1NUw1NC41Nzc5IDc5Ljk0MTFMMC45NTgyMjkgMTI0LjM4TDc1LjE4NyAxODUuOUwxNDkuNDE2IDEyNC4zOEw5Ni40MjA4IDgwLjQ1ODhMOTcuMDAzNyA3OS45NzMzTDE1MCAxMjMuODk2TDIyNC4yMjkgNjIuMzc2TDE1MCAwLjg1NTY1NUw5Ni45MDcxIDQ0Ljg1ODZMOTYuMzIxNyA0NC4zNzU2TDE0OS43NzEgMC4wNzc4NjM2TDE0OS43ODggMC4wNjUwOTcxTDE0OS44NDkgMC4wMzE0MzM1TDE0OS45MDIgMC4wMTI4MzE3TDE0OS45NTggNC41NzU0NGUtMDhIMTUwTDE1MC4wNTIgMC4wMDM2NzY4TDE1MC4wOTggMC4wMTI4MzMyTDE1MC4xNjIgMC4wMzY1NDYzTDE1MC4xOTggMC4wNTY0Mzk2TDE1MC4yNDcgMC4wOTIzODU5TDIyNC44MTMgNjEuODkxN0wyOTkuMzg2IDAuMDg2MjM2NUwyOTkuNDQyIDAuMDQ4MDMwOFpNMC41NTgwMzIgMC4wNDgwMzA4TDAuNjEzNTQ1IDAuMDg2MjM2NUw1NC41ODYgNDQuODE4M0w1NC4wMDMxIDQ1LjMwMzJMMC4xMzQ2MDQgMC42NTc4M0MtMC4wMjQxMDMzIDAuNTI2Mjk1IC0wLjA0NTU0NjIgMC4yOTE3MSAwLjA4NjcwOTYgMC4xMzM4NjlDMC4yMDQyNyAtMC4wMDY0MzM4NiAwLjQwMzcwMSAtMC4wMzg4NzMzIDAuNTU4MDMyIDAuMDQ4MDMwOFoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMzIiLz4KPHBhdGggZD0iTTIzMy43OSAxODYuMDEyQzIzMy43OSAxOTAuODA2IDIyOS44ODIgMTk0LjY5MiAyMjUuMDYxIDE5NC42OTJDMjIyLjQ5MiAxOTQuNjkyIDIyMC4xODMgMTkzLjU4OSAyMTguNTg2IDE5MS44MzJDMjIwLjEzNCAxOTMuMjI1IDIyMi4xODYgMTk0LjA3MiAyMjQuNDM4IDE5NC4wNzJDMjI5LjI1OCAxOTQuMDcyIDIzMy4xNjYgMTkwLjE4NiAyMzMuMTY2IDE4NS4zOTJDMjMzLjE2NiAxODMuMTUzIDIzMi4zMTQgMTgxLjExMSAyMzAuOTE0IDE3OS41NzJDMjMyLjY4IDE4MS4xNiAyMzMuNzkgMTgzLjQ1NyAyMzMuNzkgMTg2LjAxMlpNMjI0LjQzOCAxNzguNDQ3QzIyNi41MjUgMTc4LjQ0NyAyMjguMzk4IDE3OS4zNTggMjI5LjY3NyAxODAuODAxQzIyOC40NDcgMTc5LjcyMiAyMjYuODMxIDE3OS4wNjcgMjI1LjA2MSAxNzkuMDY3QzIyMS4yMDUgMTc5LjA2NyAyMTguMDc5IDE4Mi4xNzcgMjE4LjA3OSAxODYuMDEyQzIxOC4wNzkgMTg3Ljc3MiAyMTguNzM3IDE4OS4zNzkgMjE5LjgyMiAxOTAuNjAzQzIxOC4zNzEgMTg5LjMzIDIxNy40NTUgMTg3LjQ2NyAyMTcuNDU1IDE4NS4zOTJDMjE3LjQ1NSAxODEuNTU3IDIyMC41ODIgMTc4LjQ0NyAyMjQuNDM4IDE3OC40NDdaTTIyOC4zMSAxODcuMzk2TDIyOS4wNzQgMTg3LjcyMkMyMjguNDA2IDE4OS4yNjkgMjI2Ljg2MSAxOTAuMzUyIDIyNS4wNjEgMTkwLjM1MkMyMjMuNjk4IDE5MC4zNTIgMjIyLjQ4IDE4OS43MyAyMjEuNjggMTg4Ljc1NkMyMjIuNDMxIDE4OS4zNjYgMjIzLjM5MSAxODkuNzMyIDIyNC40MzggMTg5LjczMkMyMjYuMTIxIDE4OS43MzIgMjI3LjU4MiAxODguNzg0IDIyOC4zMSAxODcuMzk2Wk0yMjQuNDM4IDE4Mi43ODhDMjI1LjMyIDE4Mi43ODggMjI2LjEwMSAxODMuMjIyIDIyNi41NzUgMTgzLjg4N0MyMjYuMTQ4IDE4My41ODUgMjI1LjYyNSAxODMuNDA4IDIyNS4wNjEgMTgzLjQwOEMyMjMuNjE1IDE4My40MDggMjIyLjQ0MyAxODQuNTc0IDIyMi40NDMgMTg2LjAxMkMyMjIuNDQzIDE4Ni41NzMgMjIyLjYyMSAxODcuMDkyIDIyMi45MjUgMTg3LjUxN0MyMjIuMjU2IDE4Ny4wNDUgMjIxLjgxOSAxODYuMjY5IDIyMS44MTkgMTg1LjM5MkMyMjEuODE5IDE4My45NTQgMjIyLjk5MiAxODIuNzg4IDIyNC40MzggMTgyLjc4OFpNMjI5LjA3MyAxODQuMzAxTDIyNy40NjkgMTg0Ljk4NkMyMjcuMzU4IDE4NC43MyAyMjcuMjA4IDE4NC40OTUgMjI3LjAyNSAxODQuMjg5TDIyOC40NSAxODMuNjgxQzIyOC4yODkgMTgzLjMwNyAyMjguMDc2IDE4Mi45NiAyMjcuODIgMTgyLjY0OUMyMjguMzYxIDE4My4wODkgMjI4Ljc5NCAxODMuNjU0IDIyOS4wNzMgMTg0LjMwMVoiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMjUiLz4KPHBhdGggZD0iTTIyNC40MzkgMTc2LjcxMUMyMjkuMjU5IDE3Ni43MTEgMjMzLjE2NyAxODAuNTk4IDIzMy4xNjcgMTg1LjM5MkMyMzMuMTY3IDE5MC4xODYgMjI5LjI1OSAxOTQuMDczIDIyNC40MzkgMTk0LjA3M0MyMTkuNjE4IDE5NC4wNzMgMjE1LjcxMSAxOTAuMTg2IDIxNS43MTEgMTg1LjM5MkMyMTUuNzExIDE4MC41OTggMjE5LjYxOCAxNzYuNzExIDIyNC40MzkgMTc2LjcxMVpNMjI0LjQzOSAxNzguNDQ4QzIyMC41ODMgMTc4LjQ0OCAyMTcuNDU2IDE4MS41NTcgMjE3LjQ1NiAxODUuMzkyQzIxNy40NTYgMTg5LjIyNyAyMjAuNTgzIDE5Mi4zMzYgMjI0LjQzOSAxOTIuMzM2QzIyOC4yOTUgMTkyLjMzNiAyMzEuNDIxIDE4OS4yMjcgMjMxLjQyMSAxODUuMzkyQzIzMS40MjEgMTgxLjU1NyAyMjguMjk1IDE3OC40NDggMjI0LjQzOSAxNzguNDQ4Wk0yMjQuNDM5IDE4MS4wNTJDMjI2LjIzOCAxODEuMDUyIDIyNy43ODQgMTgyLjEzNSAyMjguNDUxIDE4My42ODJMMjI2Ljg0NiAxODQuMzY1QzIyNi40NDUgMTgzLjQzOCAyMjUuNTE4IDE4Mi43ODggMjI0LjQzOSAxODIuNzg4QzIyMi45OTMgMTgyLjc4OCAyMjEuODIgMTgzLjk1NCAyMjEuODIgMTg1LjM5MkMyMjEuODIgMTg2LjgzIDIyMi45OTMgMTg3Ljk5NiAyMjQuNDM5IDE4Ny45OTZDMjI1LjUxOSAxODcuOTk2IDIyNi40NDYgMTg3LjM0NiAyMjYuODQ2IDE4Ni40MThMMjI4LjQ1MSAxODcuMTAxQzIyNy43ODQgMTg4LjY0OCAyMjYuMjM5IDE4OS43MzIgMjI0LjQzOSAxODkuNzMyQzIyMi4wMjkgMTg5LjczMiAyMjAuMDc1IDE4Ny43ODkgMjIwLjA3NSAxODUuMzkyQzIyMC4wNzUgMTgyLjk5NSAyMjIuMDI5IDE4MS4wNTIgMjI0LjQzOSAxODEuMDUyWiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4zNiIvPgo8L3N2Zz4K")
        });
    killtipBtnsObj.appendChild(copyBtnObj);

    var closeBtnObj = document.createElement("span");
        closeBtnObj.setAttribute('class', 'btn');
        closeBtnObj.textContent = "关闭";
        closeBtnObj.addEventListener("click", () => {
            hideVerifyModal('remark-tips-screen')
        });
    killtipBtnsObj.appendChild(closeBtnObj);

    var rekillBtnObj = document.createElement("span");
        rekillBtnObj.setAttribute('class', 'btn');
        rekillBtnObj.textContent = "已添加，现在去水印";
        rekillBtnObj.addEventListener("click", () => {
            location.reload()
        });
    killtipBtnsObj.appendChild(rekillBtnObj);
}

function savePic(){
    const host = window.location.hostname;
	// 千图网、包图网、图司机
	if (host.includes('58pic') || host.includes('ibaotu') || host.includes('tusij')) {
		saveDivAsImage('.canvasContent', document.title, 1);
	}
	// 稿定设计
	else if (host.includes('gaoding.com')) {
		saveCanvasAsImage('canvas', document.title); // 'myDiv' 是 div 的 ID，'myDivImage' 是保存的图片名称（不包括扩展名）
	}
	//易企秀
	else if (host.includes('eqxiu.com')) {
		saveDivAsImage('.eqc-editor', document.title, 2);
	 }
	//爱设计
	else if (host.includes('isheji.com')) {
		saveDivAsImage('.editor-center', document.title, 2);
	 }
	//标小志
	else if (host.includes('logosc.cn')) {
		saveDivAsImage('.canvas', document.title, 1);
	 }
	//摄图网
	else if (host.includes('699pic.com')) {
		saveCanvasAsImage('canvas', document.title); // 'myDiv' 是 div 的 ID，'myDivImage' 是保存的图片名称（不包括扩展名）
	 }
	// 图怪兽
	else if (host.includes('818ps.com')) {
		saveCanvasAsImage('canvas', document.title); // 'myDiv' 是 div 的 ID，'myDivImage' 是保存的图片名称（不包括扩展名）
	}
	// 创客贴
	else if (host.includes('chuangkit')) {
		saveDivAsImage('.canvas_slot', document.title, 1);
	}
	// 比格设计
	else if (host.includes('bigesj')) {
		saveDivAsImage('.bige-canvas-content', document.title, 2);
	}
	// 魔力设
	else if (host.includes('molishe')) {
		saveDivAsImage('.draw-board-body', document.title, 1);
	}
	// 觅知网  注：觅知网iframe不是同源情况，引用的魔力设源，所以最后处理是魔力设处理。
	else if (host.includes('51miz')) {
		saveDivAsImage('.draw-board-body', document.title, 1);
	}
}

function saveCanvasAsImage(divId, imageName) {
    // 获取目标 Canvas（根据页面结构调整选择器）
    const canvas = document.querySelector(divId);
    if (canvas) {
        // 创建临时链接
        const link = document.createElement('a');
        // 设置图片文件名
        link.download = imageName+'.png';
        // 将 Canvas 转为 DataURL（PNG格式）
        link.href = canvas.toDataURL('image/png');
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        console.error('未找到 Canvas 元素');
    }
}

async function saveDivAsImage(divId, imageName, type) {
    // 获取div元素
    const element = document.querySelector(divId);
    if(type == 1){
        const capture = await snapdom(element, {
            scale: 2, // 2倍清晰度
            backgroundColor: '#fff', // 背景色
            embedFonts: true, // 内嵌字体
            compress: true // 压缩优化
        });
        await capture.download({
            format: 'png',
            filename: imageName
        });
    }else if(type == 2){
        html2canvas(element, { scale: 2, useCORS: true }).then(function(canvas) {
          var link = document.createElement('a');
          link.download = imageName + '.png';
          link.href = canvas.toDataURL('image/png');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    }else if(type == 3){
        var inputcanvas = document.createElement("canvas");
        inputcanvas.setAttribute("id", canvas);

        var canvas = document.getElementById("canvas");

        rasterizeHTML.drawHTML(element.html,
            canvas);
    }
}

function copyTextToClipboard(text) {
    var input = document.createElement("input");
    input.setAttribute("value", text);
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(input);
	showSuccessMessage("复制成功")
}

function createEl(tagName, options = {}) {
        const el = document.createElement(tagName);

        // 设置属性
        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                if (key === 'class') {
                    el.classList.add(...value.split(' '));
                } else if (key === 'dataset') {
                    Object.entries(value).forEach(([dataKey, dataValue]) => {
                        el.dataset[dataKey] = dataValue;
                    });
                } else {
                    el.setAttribute(key, value);
                }
            });
        }

        // 设置内容
        if (options.content !== undefined) {
            if (typeof options.content === 'string') {
                el.textContent = options.content;
            } else if (options.content instanceof Node) {
                el.appendChild(options.content);
            } else if (Array.isArray(options.content)) {
                options.content.forEach(child => el.appendChild(child));
            } else if (typeof options.content === 'function') {
                options.content(el); // 假设这是一个渲染函数，接收新创建的元素作为参数
            }
        }

        // 设置样式
        if (options.styles) {
            Object.assign(el.style, options.styles);
        }

        // 自动追加到父元素
        if (options.append && options.parent) {
            options.parent.appendChild(el);
        }

        return el;
    }
