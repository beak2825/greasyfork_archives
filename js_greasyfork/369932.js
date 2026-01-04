// ==UserScript==
// @name         微信公众号编辑器自动改引号
// @namespace    https://coding.net/u/BackRunner/p/GreaseMonkey-JS/git
// @version      2020.6
// @description  在微信公众号编辑器中加入一个用于自动改引号的按钮
// @author       BackRunner
// @include      *mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit*
// @include      *mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit_v2*
// @license      MIT
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/369932/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BC%96%E8%BE%91%E5%99%A8%E8%87%AA%E5%8A%A8%E6%94%B9%E5%BC%95%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/369932/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BC%96%E8%BE%91%E5%99%A8%E8%87%AA%E5%8A%A8%E6%94%B9%E5%BC%95%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
	//Set
	var toolbar;
    var yiban;

	var count = 0;
    var retry = 0;
	//Run
    $(document).ready(function(){
        setTimeout(function(){
            getToolbar();
        }, 5000);
    });

	//Functions
	function getToolbar(){
        // 检查壹伴的工具栏
        yiban = document.getElementById('mpa-extra-tools-container');
        if (yiban){
            console.log(yiban);
            createBtnYiBan();
            return;
        }
		toolbar = document.getElementById('js_toolbar_0');
        while (typeof toolbar == 'undefined' && count < 10){
            count++;
            toolbar = document.getElementById('js_toolbar_0');
        }
        if (count < 5){
            createBtn();
        } else {
            if (retry < 5){
                setTimeout(function(){
                    getToolbar();
                    retry++;
                },3000);
            }
        }
	}

	function createBtn(){
        var wrap = document.createElement("div");
        wrap.setAttribute("class","edui-box edui-button edui-default");
		var div = document.createElement("div");
		div.setAttribute("class","edui-box edui-button-body edui-default");
		div.setAttribute("data-mpa-tooltip","将中文引号替换为「」");
		var btn_name = document.createElement("div");
        btn_name.setAttribute("style","font-size:12px !important");
		btn_name.innerHTML = "替换引号";
        wrap.appendChild(div);
		div.appendChild(btn_name);
        var breakdiv = document.getElementById("br-breakdiv");
        if (typeof breakdiv == 'undefined' || breakdiv == null){
            breakdiv = document.createElement("div");
            breakdiv.setAttribute("id","br-breakdiv");
            toolbar.appendChild(breakdiv);
        }
		toolbar.appendChild(wrap);
		div.addEventListener('click',Event);
	}

    function createBtnYiBan(){
        var wrap = document.createElement("div");
        wrap.setAttribute("class","edui-box edui-button edui-default");
		var div = document.createElement("div");
		div.setAttribute("class","edui-box edui-button-body edui-default");
		div.setAttribute("data-mpa-tooltip","将中文引号替换为「」");
		var btn_name = document.createElement("div");
        btn_name.setAttribute("style","font-size:12px !important;line-height: 34px;margin-right:8px;cursor:pointer;");
		btn_name.innerHTML = "替换引号";
        wrap.appendChild(div);
		div.appendChild(btn_name);
		yiban.appendChild(wrap);
		div.addEventListener('click',Event);
	}

	function Event(){
		var iframe = document.getElementById("ueditor_0");
		var plist = iframe.contentDocument.getElementsByTagName("p");
        var spanlist = iframe.contentDocument.getElementsByTagName("span");
		for (let i=0;i<plist.length;i++){
			let s = plist[i].innerHTML;
			console.log(s);
            let p1=/(“)/gi;
			let p2=/(”)/gi;
			s = s.replace(p1, '「').replace(p2, "」");
			plist[i].innerHTML = s;
			//console.log(s);
		}
        for (let i=0;i<spanlist.length;i++){
			let s = spanlist[i].innerHTML;
			console.log(s);
            let p1=/(“)/gi;
			let p2=/(”)/gi;
			s = s.replace(p1, '「').replace(p2, "」");
			spanlist[i].innerHTML = s;
			//console.log(s);
		}
	}
})();