// ==UserScript==
// @name         当前页网址转为二维码
// @namespace    https://github.com/fanjindui/TemperMonkeyCollection/tree/main/%E5%BD%93%E5%89%8D%E9%A1%B5%E7%BD%91%E5%9D%80%E8%BD%AC%E4%B8%BA%E4%BA%8C%E7%BB%B4%E7%A0%81
// @version      1.0
// @description  在页面右上角创建本页面url的浮动二维码，可供手机扫描访问
// @author       Internal
// @match        */*
// @grant        none
// @require      https://cdn.staticfile.org/qrcodejs/1.0.0/qrcode.min.js
// @downloadURL https://update.greasyfork.org/scripts/413285/%E5%BD%93%E5%89%8D%E9%A1%B5%E7%BD%91%E5%9D%80%E8%BD%AC%E4%B8%BA%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/413285/%E5%BD%93%E5%89%8D%E9%A1%B5%E7%BD%91%E5%9D%80%E8%BD%AC%E4%B8%BA%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    function dragFunc(id) {        //指定id的对象可被拖拽
        var Drag = document.getElementById(id);
        Drag.onmousedown = function(event) {
            var ev = event || window.event;
            event.stopPropagation();
            var disX = ev.clientX - Drag.offsetLeft;
            var disY = ev.clientY - Drag.offsetTop;
            document.onmousemove = function(event) {
                var ev = event || window.event;
                Drag.style.left = ev.clientX - disX + "px";
                Drag.style.top = ev.clientY - disY + "px";
                Drag.style.cursor = "move";
            };
        };
        Drag.onmouseup = function() {
            document.onmousemove = null;
            this.style.cursor = "default";
        };
    };
    //删除二维码对象
    //function delQRcode(obj){var QRcode = document.getElementById(obj);QRcode.remove();};
    var innerscript = document.createElement('script');
    innerscript.type="text/javascript";
    innerscript.innerHTML = "function delQRcode(obj){var QRcode = document.getElementById(obj);QRcode.remove();};";
    document.body.appendChild(innerscript);
    //引入生成二维码的js库qrcode.js
    //var outerscript = document.createElement('script');
    //outerscript.type="text/javascript";
    //outerscript.src="https://cdn.staticfile.org/qrcodejs/1.0.0/qrcode.js";
    //document.body.appendChild(outerscript);
    //建立悬浮div以盛放二维码
    var qrdiv = document.createElement("div");
    qrdiv.setAttribute("id", "qrdiv");
    qrdiv.style.cssText="z-index:99999;right:5%; top:15%; position:fixed; background:rgba(220,220,220,0.7); width:160px; height:200px; text-align:center; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";
    var href = window.location.href //本页url
    var closeDiv = "<p><a onclick=delQRcode('qrdiv')>点击关闭</a></p>";
    qrdiv.innerHTML = "<p><span>本页面二维码</span></p><div id=\"qrcode\" style=\"margin:5px\"></div>"+closeDiv;
    //div.onclick=b
    document.body.appendChild(qrdiv);
    dragFunc("qrdiv")
    var qr = new QRCode("qrcode", {text:href.toString(), width:150,height:150});
})();









