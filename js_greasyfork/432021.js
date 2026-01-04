// ==UserScript==
// @name        CSDN-筑基
// @namespace     http://tampermonkey.net/
// @version         1.0.0
// @match        *://*.blog.csdn.net/*
// @icon        chrome://favicon/http://blog.csdn.net/
// @description   仅供参考学习
// @author        haiw2
// @grant        GM_setClipboard
// @reference     https://source.unsplash.com/random
// @namespace    https://greasyfork.org/zh-CN/scripts/432021
// @supportURL   https://github.com/haiw2/MonkeyScript
// @homepageURL  https://github.com/haiw2/MonkeyScript
// @downloadURL https://update.greasyfork.org/scripts/432021/CSDN-%E7%AD%91%E5%9F%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/432021/CSDN-%E7%AD%91%E5%9F%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function HAIW2(){};
    HAIW2.prototype = {
        status: -1,
        // 属性变化监听器
        attribute_change_listener: function(node){
            let listen_op = {attributes:true};
            function callback(mutationsList){
                node.style.left = "";
            };
            var observer = new MutationObserver(callback);
            observer.observe(node, listen_op);
        },
        // 复制权限
        modifyCopyPriviledge: function(codeElem,signElem){
            //代码容器修改
            codeElem.removeAttribute('onclick');
            codeElem.style.setProperty('user-select','auto');
            codeElem.parentNode.style.setProperty('user-select','auto');
            codeElem.parentNode.style.setProperty('margin-bottom','30px');
            // 登录容器修改
            try{
                signElem.removeAttribute('onclick');
                signElem.setAttribute('data-title','点击复制');
                signElem.style.margin = '0';
                // signElem.style.setProperty('margin-bottom', '40px');
                signElem.style.setProperty('max-width','80px');
                signElem.style.setProperty('min-height','15px');
                signElem.style.setProperty('font-size','15px');
                // signElem.style.left = '56px';
                return true
            }catch(e){
                return false
            }finally{
                // 复制按钮位置变化 代码块并列、代码块内、代码块外
                    codeElem.parentNode.insertBefore(signElem, codeElem);
            }
        },
        // 复制逻辑
        copy: function(signElem) {
            let codeelem = null;
            try{
                codeelem = signElem.parentNode;
                if(codeelem.id.indexOf('code')===-1){ // 父节点
                    throw new EvalError('值错误');
                }
            }catch(err){// 兄弟节点
                codeelem = signElem.previousElementSibling;
            }
            document.oncopy=function(e){
                e.clipboardData.setData('text',codeelem.innerText);
                e.preventDefault();
                document.oncopy=null;
            }
            document.execCommand("Copy");// 执行浏览器复制命令
            signElem.setAttribute('data-title','复制成功');
            signElem.style.cssText += 'background-color: green';
            setTimeout(()=>{ // 先延时1000ms，再执行回调函数
                signElem.setAttribute('data-title','点击复制');
                signElem.style.removeProperty('background-color','green');
            },1000);
        },
        // 小飞侠
        modifyFocusPriviledge: function(that){
            let toolbar = document.querySelector('.csdn-side-toolbar');
            toolbar.style.right = "20px";
            toolbar.style.position = "fixed";
            let focusSwitch = document.querySelector('.option-box').cloneNode(true);
            focusSwitch.firstElementChild.src = 'https://s1.aigei.com/src/img/png/05/055f0df239ef4451a25be1e5c4617f96.png?imageMogr2/auto-'+
                'orient/thumbnail/!199x199r/gravity/Center/crop/199x199/quality/85/&e=1735488000&'+
                'token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:pxpJ0L3fOUppABVi15gOFs94eqk=';
            focusSwitch.style.background = "rgba(0,0,0,0.1)";
            focusSwitch.firstElementChild.style.width = "200%";
            focusSwitch.firstElementChild.style.display = "block"; // 去除初始鼠标放上有动态加载事件
            focusSwitch.removeChild(focusSwitch.lastElementChild);
            focusSwitch.removeAttribute('mouseup');
            toolbar.replaceChildren(focusSwitch);
            toolbar.style.right = '0';
            let head_toolbar = document.getElementById('csdn-toolbar');
			// 重点：回调函数传入的参数在哪个域下，那么此回调函数内部的this就指向谁
			head_toolbar.style.display = 'none';
			// 进入全屏
			that.fullScreenRead(false);
            focusSwitch.addEventListener('click', function(){
                // 重点：回调函数传入的参数在哪个域下，那么此回调函数内部的this就指向谁
                that.status = ~that.status;
                if(that.status==0) head_toolbar.style.display = 'none';
                else head_toolbar.style.display = 'block';
                // 进入全屏
                that.fullScreenRead(that.status);
            },'true');

        },
        // 删除选中复制多段，粘贴出现版权信息
        delete_copy_right: function(){
            csdn.copyright.textData = '';
        },
        // 删除右下角小辣条广告
        delete_right_aside_ad: function(){
            let toolbar = document.querySelector('.csdn-side-toolbar');
            toolbar.addEventListener("DOMNodeInserted", function(e) {
                if(e.target.className=='csdn-common-logo-advert') toolbar.removeChild(toolbar.firstElementChild);
            });
        },
        // 删除头部“大屏-小屏”动画广告
        delete_head_ad: function(){
            let head_nav_toolbar = document.querySelector('#csdn-toolbar');
            head_nav_toolbar.addEventListener("DOMNodeInserted", function() {
                if(head_nav_toolbar.firstElementChild.className==='toolbar-advert') head_nav_toolbar.removeChild(head_nav_toolbar.firstElementChild);
            });
        },
        // 删除登录弹窗
        delete_login_dialog: function(){
            document.body.addEventListener("DOMNodeInserted", function() {
                let login1 = document.querySelector('#app');
                let login2 = document.querySelector('#passportbox');
                if (login1!=null) login1.style.display = 'none';
                if (login2!=null) {
                    login2.style.display = 'none';
                    login2.previousElementSibling.style.display = 'none';
                }
            });
        },
        // 允许复制
        allow_copy: function(){
            let codes = document.querySelectorAll('#content_views pre code');
            let signs = document.querySelectorAll('#content_views .signin');
            // 解决部分文章允许不登陆复制的脚本定位问题
            if(signs.length===0) signs = document.querySelectorAll('#content_views .hljs-button');
            for(var i=0;i<codes.length;i++){
                let sign = signs[i], code = codes[i];
                this.modifyCopyPriviledge(code, sign);
                sign.addEventListener('click', function(){
                    GM_setClipboard(code.innerText, "text");
                    sign.setAttribute('data-title','复制成功');
                    sign.style.cssText += 'background-color: green';
                    setTimeout(()=>{ // 先延时1000ms，再执行回调函数
                        sign.setAttribute('data-title','点击复制');
                        sign.style.removeProperty('background-color','green');
                    },1000);
                },'true');
            }
        },
        // 专注阅读
        fullScreenRead: function(status){
            let leftSide = document.querySelector('.blog_container_aside');
            let father = document.querySelector('.main_father');
            let main = father.querySelector('main');
            leftSide.childNodes.forEach((item,index)=>{
                if(status==0 && item.firstElementChild && item.id!='asidedirectory'){
                    item.style.setProperty('display', 'none');
                    main.style.setProperty('width','100%');
                }
                if(status==0 && item.id=='asidedirectory'){
                    item.style.position = 'fixed';
                    item.style.left = '0';

					console.log(item.firstChild);

					// item.querySelector('.aside-title').style.background = 'rgba(0,0,0,.7)';
					// item.querySelector('.group_item').style.background = 'rgba(0,0,0,.7)';
					const toc = item.querySelector('.aside-title');
					toc.parentNode.style.width = 'auto';
					toc.parentNode.style.background = '#6c928c';
					toc.style.background = 'transparent';
					const content = item.querySelector('.group_item');
					content.style.display = 'None';
					let showTOC = false;
					toc.addEventListener('click', ()=>{
						showTOC = ~showTOC;
						if (showTOC){
							toc.parentNode.style.width = '300px';
							toc.style.removeProperty('background: #f5f5f5');
							content.style.display = 'block';
						}else{
							toc.parentNode.style.width = 'auto';
							toc.parentNode.style.background = 'background: #6c928c';
							content.style.display = 'None';

						}

					})


                    father.style.margin = '0';
                    father.style.padding = '0';
                    father.firstElementChild.style.width = '100%';
                    main.style.setProperty('width','100%');
                }

                if(status!=0 && item.firstElementChild && item.id!='asidedirectory'){
                    item.style.display = 'block';
                    main.style.removeProperty('width');

                }
                if(status!=0 && item.firstElementChild && item.id=='asidedirectory'){
                    item.style.removeProperty('position');
                    item.style.removeProperty('right');
                    father.style.removeProperty('margin');
                    father.style.removeProperty('padding');
                    father.firstElementChild.style.removeProperty('width');
                    main.style.removeProperty('width');
                }

            })
        },

		delete_or_unvisable_elem: function (selector, method){
			const elem = document.querySelector(selector);
			if (method === 'del') elem.parentNode.removeChild(elem);
			else elem.style.display = 'None';
		},
		delete_author_toolbox: function(selector){
			this.delete_or_unvisable_elem(selector, 'del');
		}
    };

    const w2 = new HAIW2();
    let that = this;
    w2.delete_copy_right();
    w2.delete_head_ad();
    w2.delete_right_aside_ad();
    w2.delete_login_dialog();
    w2.allow_copy();
    w2.modifyFocusPriviledge(w2);
	w2.delete_author_toolbox('.left-toolbox');
})();