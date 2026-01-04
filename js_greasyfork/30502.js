// ==UserScript==
// @name         微信公众号编辑器中英文自动加空格
// @namespace    https://coding.net/u/BackRunner/p/GreaseMonkey-JS/git
// @version      2020.6
// @description  在微信公众号编辑器中加入一个用于自动在中英文间添加空格的按钮
// @author       BackRunner
// @include      *mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit*
// @include      *mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit_v2*
// @license      MIT
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/30502/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BC%96%E8%BE%91%E5%99%A8%E4%B8%AD%E8%8B%B1%E6%96%87%E8%87%AA%E5%8A%A8%E5%8A%A0%E7%A9%BA%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/30502/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BC%96%E8%BE%91%E5%99%A8%E4%B8%AD%E8%8B%B1%E6%96%87%E8%87%AA%E5%8A%A8%E5%8A%A0%E7%A9%BA%E6%A0%BC.meta.js
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
            injectEditor();
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
		div.setAttribute("data-mpa-tooltip","在中英文之间添加空格");
		var btn_name = document.createElement("div");
        btn_name.setAttribute("style","font-size:12px !important;");
		btn_name.innerHTML = "添加空格";
        wrap.appendChild(div);
		div.appendChild(btn_name);
		toolbar.appendChild(wrap);
		div.addEventListener('click', Event);
	}

    function createBtnYiBan(){
        var wrap = document.createElement("div");
        wrap.setAttribute("class","edui-box edui-button edui-default");
		var div = document.createElement("div");
		div.setAttribute("class","edui-box edui-button-body edui-default");
		div.setAttribute("data-mpa-tooltip","在中英文之间添加空格");
		var btn_name = document.createElement("div");
        btn_name.setAttribute("style","font-size:12px !important;line-height: 34px;margin-right:8px;cursor:pointer;");
		btn_name.innerHTML = "添加空格";
        wrap.appendChild(div);
		div.appendChild(btn_name);
        var breakdiv = document.getElementById("br-breakdiv");
        if (typeof breakdiv == 'undefined' || breakdiv == null){
            breakdiv = document.createElement("div");
            breakdiv.setAttribute("id","br-breakdiv");
            yiban.appendChild(breakdiv);
        }
		yiban.appendChild(wrap);
		div.addEventListener('click', Event);
    }

    function injectEditor() {
        let iframe = document.getElementById("ueditor_0");
        let script = document.createElement('script');
        script.setAttribute('src', 'https://static.backrunner.top/pangu-simple/1.0.2/pangu.min.js');
        iframe.contentDocument.head.append(script);
    }

	function Event(){
        let iframe = document.getElementById("ueditor_0");
        iframe.contentDocument.body.setAttribute('contenteditable', false);
        iframe.contentWindow.pangu.spacingElementByTagName('p');
        iframe.contentWindow.pangu.spacingElementByTagName('span');
        iframe.contentDocument.body.setAttribute('contenteditable', true);
	}
})();