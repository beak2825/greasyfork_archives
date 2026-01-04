// ==UserScript==
// @name         CacErp助手
// @namespace    http://erp.caccpallp.com/
// @version      0.3
// @description  CAC助手!
// @author       AMU
// @match        http://erp.caccpallp.com/
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=caccpallp.com
// @run-at       document-end
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/466310/CacErp%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/466310/CacErp%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals       jQuery, $, waitForKeyElements  */
    var css = [
        ".myButton {",
        "background:linear-gradient(to bottom, #7892c2 5%, #476e9e 100%);",
        "background-color:#7892c2;",
        "display:inline-block;",
        "cursor:pointer;",
        "color:#ffffff;",
        "font-family:Arial;",
        "font-size:8px;",
        "margin:2px 8px;",
        "padding:2px 16px;",
        "text-decoration:none;",
        "}",
        "div.msg_bottom{",
        "background:#4f4f4f;",
        "opacity: 0.75;",
        "color:#fff;",
        "overflow: hidden;",
        "z-index: 9999999;",
        "position: fixed;",
        "padding:10px;",
        "min-width: 100px;",
        "text-align:center;",
        "margin:0 auto;",
        "left: 50%;",
        "bottom:50%;",
        "display:none;",
        "}",
         "div.msg_copy{",
        "background:#3399ff;",
        "opacity: 1;",
        "color:#fff;",
        "overflow: hidden;",
        "z-index: 999999999;",
        "position: fixed;",
        "padding:10px;",
        "min-width:30px;",
        "text-align:center;",
        "margin:0 auto;",
        "display:none;",
        "}"
    ].join("\n");
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		document.documentElement.appendChild(node);
	}
    var i
    var ta
    setTimeout(() => {
        var div = document.createElement('div');
        div.className = "msg_bottom";
        div.id='amumsg'
        var div2 = document.createElement('div');
        div2.className = "msg_copy";
        div2.id='copymsg'
        if(document.getElementById('footer')){
            document.getElementById('footer').appendChild(div);
            document.getElementById('footer').appendChild(div2);
        }
    }, 1000);

    $(document).mouseup(function (e) {
        var v = e.target;
        var setInter1 = setInterval(ff,700);
        var idtxt = v.id;
        var DIVtxt = v.getAttribute("name");
        var TNtxt = v.tagName;
        var datatxt = v.getAttribute("data");

        //document.title = TNtxt + "_" + idtxt + "_" + v.innerText;
        var selectedText = window.getSelection().toString();
        if(v.name && v.name != "Comments" && idtxt.indexOf("inputEl") != -1 && TNtxt != "TEXTAREA"){
            copyText(v.value);
        }else if(DIVtxt == "g_ReportCodeId"){
            copyText(v.innerText);
        }else if(idtxt.indexOf("inputEl") != -1 && TNtxt != "TEXTAREA"){
            copyText(v.innerText);
        }else if((TNtxt == "DIV" || TNtxt == "TEXTAREA") && selectedText.length>3){
            //console.log(TNtxt + "_" + DIVtxt + "_" + selectedText);alert(\'' + selectedText + '\');
            var div_msg = document.getElementById('copymsg');
            div_msg.innerHTML = '<a id = "amu_copy" data="' + selectedText + '" onclick = "document.getElementById(\'copymsg\').style.display=\'none\';">复制</a>';
            div_msg.style.left = (e.clientX + 8) + 'px';
            div_msg.style.top = (e.clientY - 8) + 'px';
            document.getElementById('copymsg').style.display='block';
        }else if(idtxt=="amu_copy"){
            copyText(datatxt);
        }

        if(v.id){
            ta = $('TEXTAREA[name="Comments"]');
            if(v.id=='amu_1'){ta.html('ok.');}
            if(v.id=='amu_2'){ta.html('ok.（代批）');}
            if(v.id=='amu_3'){ta.html('项目组申请退回.');}
            if(v.id=='amu_4'){ta.html('项目未送审，予以退回.');}
            if(v.id=='amu_5'){ta.html('1.将【负责人】改为：【执行事务合伙人】姚运海\n2.尽量避免使用单独一页作为签章页\n3.声明内容应注明发行人全称，相关说明书也应注明全称，对于引用审计报告的应注明报告文号\n4.在OA发文中上传声明时一并上传相关说明书，核对底稿及合伙人签字的声明');}
            if(v.id=='amu_6'){ta.html('ok.（子司）');}
        }
        //if(v.innerHTML && (v.innerHTML == '处理' || v.innerHTML == '回退' || v.innerHTML == '附言:<span style="color:red;font-weight:bold" data-qtip="必输">*</span>')){var setInter1 = setInterval(ff,700);}
        function ff() {
            var ta = $('TEXTAREA[name="Comments"]');
            var forms = $('div[class="x-form-display-field"]');
            //console.log(forms.length);
            if(forms.length){
                let xyb = forms[0];
                if (ta && xyb.innerHTML) {
                let c = $('label[class="x-form-item-label x-form-item-label-left"]');
                let d = c[c.length - 1];
                if(d.innerHTML.search("请退")>-1){
                    clearInterval(setInter1);
                }
                if(d.innerHTML.search("请退")<1 && d.innerHTML.search("附言")>-1){
                    d.innerHTML += "<span id='amu_1' class='myButton'>同意</span><br>";
                    d.innerHTML += "<span id='amu_2' class='myButton'>代批</span><br>";
                    d.innerHTML += "<span id='amu_5' class='myButton'>发文</span><br>";
                    d.innerHTML += "<span id='amu_6' class='myButton'>子司</span><br>";
                    d.innerHTML += "<span id='amu_3' class='myButton'>请退</span><br>";
                    d.innerHTML += "<span id='amu_4' class='myButton'>未审</span><br>";
                }
                }
            }
        }

        function sleep(n) {
            //n表示的毫秒数
            var start = new Date().getTime();
            while (true) if (new Date().getTime() - start > n) break;
        }
        //复制文本
        function copyText(text) {
            if(text==""){return;}
            var element = createElement(text);
            element.select();
            element.setSelectionRange(0, element.value.length);
            document.execCommand('copy');
            element.remove();
            document.getElementById('amumsg').innerText = "复制成功";
            document.getElementById('amumsg').style.display='block';
            setTimeout(function(){document.title = "CAC_erp";document.getElementById('amumsg').style.display='none';},3000);
            return;
        }

        //创建临时的输入框元素
        function createElement(text) {
            var isRTL = document.documentElement.getAttribute('dir') === 'rtl';
            var element = document.createElement('textarea');
            // 防止在ios中产生缩放效果
            element.style.fontSize = '12pt';
            // 重置盒模型
            element.style.border = '0';
            element.style.padding = '0';
            element.style.margin = '0';
            // 将元素移到屏幕外
            element.style.position = 'absolute';
            element.style[isRTL ? 'right' : 'left'] = '-9999px';
            // 移动元素到页面底部
            let yPosition = window.pageYOffset || document.documentElement.scrollTop;
            element.style.top = `${yPosition}px`;
            //设置元素只读
            element.setAttribute('readonly', '');
            element.value = text;
            document.body.appendChild(element);
            return element;
        }
    });

})();