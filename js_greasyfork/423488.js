// ==UserScript==
// @name         gh-proxy-buttons
// @name:zh-CN   github加速按钮
// @namespace    https://github.com/du33169/gh-proxy-buttons
// @version      0.7
// @license      MPL-2.0
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.6/clipboard.min.js
// @description  add a button beside github link(releases,files and repository url), click to get alternative url according to previously specified proxy.
// @description:zh-CN  为github中的特定链接（releases、文件、项目地址）添加一个悬浮按钮，提供代理后的加速链接
// @author       du33169
// @match        *://github.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/423488/gh-proxy-buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/423488/gh-proxy-buttons.meta.js
// ==/UserScript==
(function() 
{
    'use strict'; 
	
//--------------------------代理设置-------------------------------      
//用于在线代理的workers地址                                                                                                            
const proxy_url= 'https://gh-proxy.du33169.workers.dev/';
/*      
	备用： 'https://gh.api.99988866.xyz/';   （来自gh-proxy项目作者）
	代理服务器地址可自行修改，末尾斜杠不可省略！
*/
//--------------------------其他设置------------------------------
//是否打开调试输出
const open_log=true;
//鼠标离开链接或按钮后消失前等待的时间
const fade_timeout=100;//ms

//--------------------------功能代码------------------------------
    function isRepoFile(ourTarget){
        return (ourTarget.tagName=='A'
                &&ourTarget.getAttribute('aria-label')!=null//利用&&短路特性防止没有属性的元素导致脚本终止
                &&ourTarget.classList.contains("Link--primary")
                &&ourTarget.getAttribute('aria-label').endsWith('(File)')
                &&ourTarget.closest('#js-repo-pjax-container')!=null
               );
    }
    function isReleaseAsset(ourTarget){
        return (ourTarget.tagName=='A'
                &&ourTarget.getAttribute('rel')!=null
                &&ourTarget.rel=="nofollow"
                //&&/github.com/.test(ourTarget.href)==true
                &&(ourTarget.closest('#repo-content-pjax-container')!=null)||(ourTarget.closest('.js-truncated-assets-fragment')!=null)
               );
    }
    function isDownloadZip(e){
        return (e.tagName=='A'
                &&e.classList.contains("kHKEGN")
                &&e.getAttribute('rel')!=null
                &&e.rel=="nofollow"
                &&e.getAttribute('role')!=null
                &&e.role=="menuitem"
               );
    }
    function isHttpCopyGit(e){
        return (
            e.tagName=='BUTTON'
            &&e.classList.contains('hUTZcL')
            &&e.previousElementSibling!=null
            &&e.previousElementSibling.tagName=='INPUT'
            &&e.previousElementSibling.value.startsWith('https')
        );
    }


    function getBtn(originLink,filename,copy=false)
    {
        var ghBtn=document.getElementById("gh-proxy-button");
        //existed
        if(!ghBtn){
            //not existed, create instance
            ghBtn=document.createElement('a');
            ghBtn.setAttribute('class','btn');
            ghBtn.id="gh-proxy-button";
            ghBtn.title="[gh-proxy-buttons] get proxy link";
            ghBtn.style.position="absolute";
            ghBtn.role="button";
            ghBtn.style.zIndex=9999;
            //ghBtn.style.top=0;//must be set for transition
            //ghBtn.style.left=0;
            //ghBtn.style.transition="transform 0.5s ease-in-out";

            ghBtn.addEventListener('mouseenter',function(){
                if(open_log)console.debug('[gh-proxy-buttons] onbtn');
                if(ghBtn.timerId !=undefined && ghBtn.timerId!=-1){
                    clearTimeout(ghBtn.timerId);
                    ghBtn.timerId=-1;
                }
            });
            ghBtn.addEventListener('mouseleave',function(){
                if(open_log)console.debug('[gh-proxy-buttons] mouseleave-btn');
                if(ghBtn.timerId !=undefined && ghBtn.timerId!=-1)return;
                ghBtn.timerId=setTimeout(function(){
                    ghBtn.style.visibility="hidden";
                     ghBtn.timerId=-1;
                     if(open_log)console.debug('[gh-proxy-buttons] timeout fade mouseleave-btn');
                },fade_timeout);
                 if(open_log)console.debug('[gh-proxy-buttons] btn leave timerid:',ghBtn.timerId);
            });
            document.documentElement.appendChild(ghBtn);
        }
        //now gh-proxy-button exists
        if(copy)//仓库地址input标签特殊处理，使用ClipboardJS实现点击复制
		{
            ghBtn.removeAttribute('target');
            ghBtn.removeAttribute('download');
            ghBtn.href="javascript:void(0)";
			ghBtn.innerText="🚀📄";
			ghBtn.clip=new ClipboardJS(ghBtn);
            ghBtn.clip.on('success',function(){
                ghBtn.innerText="🚀📄✔";
            });
			ghBtn.setAttribute('data-clipboard-text',proxy_url+originLink);

			//console.log('[gh-proxy-buttons] input url processed');
		}
		else{
            ghBtn.innerText="🚀";
            ghBtn.target="_blank";
            if(ghBtn.clip)ghBtn.clip.destroy();
            ghBtn.clip=undefined;
            ghBtn.download=filename;
            ghBtn.removeAttribute('data-clipboard-text');
            ghBtn.href=proxy_url+originLink;
        }

        return ghBtn;
    }

	console.log('[gh-proxy-buttons] processing...');
	function moveHere(e,originLink,copy=false)//用于注册mouseenter事件,e为当前元素
	{
		//创建按钮对象,github中使用.btn的class可以为<a>标签加上按钮外观
		var btn=getBtn(originLink,e.title,copy);
        if(open_log)console.debug("[gh-proxy-buttons]",btn);
        //e.parentElement.insertBefore(btn,e);
        if(btn.timerId !=undefined && btn.timerId!=-1){
            clearTimeout(btn.timerId);
            btn.timerId=-1;
        }
        const rect = e.getBoundingClientRect();
        const btnRect=btn.getBoundingClientRect();
        const x = rect.left + window.scrollX - btnRect.width;
        const y = rect.top + window.scrollY;

        console.log(`Element coordinates (relative to document): x: ${x}, y: ${y}`);

        btn.style.left=`${x}px`;
        btn.style.top =`${y}px`;
        if(btn.style.visibility=="visible"){
            //btn.style.transform = `translate(${event.x}px, ${event.y}px)`;
        }
        else{
            //btn.style.transform="";
            btn.style.visibility="visible";
        }

		if(open_log)console.debug(`[gh-proxy-buttons] mousein, move btn to ${event.x},${event.y}`);
        e.addEventListener('mouseleave',function(){
                if(open_log)console.debug('[gh-proxy-buttons] mouseleave-target');
            if(btn.timerId !=undefined && btn.timerId!=-1)return;
                btn.timerId=setTimeout(function(){
                   btn.style.visibility="hidden";
                   btn.timerId=-1;
                     if(open_log)console.debug('[gh-proxy-buttons] timeout fade mouseleave-target');
                },fade_timeout);
            if(open_log)console.debug('[gh-proxy-buttons] target leave timerid:',btn.timerId);
            });
	}

    function eventDelegation(e)
	{
    // e.target 是事件触发的元素
		if(e.target!=null)
		{
            var ourTarget=e.target;
			while(ourTarget!=e.currentTarget&&ourTarget.tagName!='A'&&ourTarget.tagName!='BUTTON')//releases页面触发元素为<a>内的span，需要上浮寻找
			{
				ourTarget=ourTarget.parentNode;
			}
            if(ourTarget==e.currentTarget)return;
            //if(open_log)console.debug('[gh-proxy-buttons]','found A',ourTarget);
			if(isRepoFile(ourTarget)||isReleaseAsset(ourTarget)||isDownloadZip(ourTarget))
			{
				console.log('[gh-proxy-buttons] ','found target',ourTarget);
				moveHere(ourTarget,ourTarget.href);
			}else if(isHttpCopyGit(ourTarget)){
                console.log('[gh-proxy-buttons] ','found target copy button',ourTarget);
				moveHere(ourTarget,ourTarget.previousElementSibling.value,true);
            }
		}
	}
    document.body.addEventListener("mouseover", eventDelegation);
})();
