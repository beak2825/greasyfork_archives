// ==UserScript==
// @name         CacErp助手
// @namespace    http://erp.caccpallp.com/
// @version      0.2
// @description  CAC助手!
// @author       AMU
// @match        http://erp.caccpallp.com/
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=caccpallp.com
// @grant        none
// @run-at        document-end
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/460381/CacErp%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/460381/CacErp%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        ".myButton {",
        "background:linear-gradient(to bottom, #7892c2 5%, #476e9e 100%);",
        "background-color:#7892c2;",
        "display:inline-block;",
        "cursor:pointer;",
        "color:#ffffff;",
        "font-family:Arial;",
        "font-size:8px;",
        "padding:2px 16px;",
        "text-decoration:none;",
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
    $(document).click(function (e) {
        var v = e.target;
        if(v.id){
            ta = $('TEXTAREA[name="Comments"]');
            if(v.id=='amu_1'){ta.val('ok.');}
            if(v.id=='amu_2'){ta.val('领导同意,代为审批.');}
            if(v.id=='amu_3'){ta.val('项目组申请退回.');}
            if(v.id=='amu_4'){ta.val('项目未送审，予以退回.');}
        }
        var setInter1 = setInterval(ff,1000); //1000毫秒为1秒
        function ff() {
            var ta = $('TEXTAREA[name="Comments"]');
            var forms = $('div[class="x-form-display-field"]');
            if(forms.length==3){
                let xyb = forms[1];
                if (ta && xyb.innerHTML) {
                let c = $('div[class="x-panel-body x-panel-body-default x-panel-body-default x-docked-noborder-top x-docked-noborder-right x-docked-noborder-bottom x-docked-noborder-left"]');
                let d = c[c.length-1];
                    if(d.innerHTML.search("请退")<1){
                        d.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;<span id='amu_1' class='myButton'>同意</span>&nbsp;&nbsp;&nbsp;&nbsp;";
                        d.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;<span id='amu_2' class='myButton'>代批</span>&nbsp;&nbsp;&nbsp;&nbsp;";
                        d.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;<span id='amu_3' class='myButton'>请退</span>&nbsp;&nbsp;&nbsp;&nbsp;";
                        d.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;<span id='amu_4' class='myButton'>未审</span>&nbsp;&nbsp;&nbsp;&nbsp;";
                    }
                    clearInterval(setInter1);
                }
            }
        }
        if(v.innerHTML == '编辑填报内容'){var setInter2 = setInterval(gg,1000);}
        function gg() {
            var ta = $('div[name="g_YesOrNo"]');
            if(ta.length>7){
                var msg = "您真的确定要自动填写吗？\n\n功能还在测试中！\n\n请确认！";
                if (confirm(msg)==true){
                    ta.each(function(){
                        $(this).click()
                        $(this).html('是');
                    });
                }
            }
            clearInterval(setInter2);
        }
    });

})();