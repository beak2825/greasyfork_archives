// ==UserScript==
// @name         划词新菜单
// @namespace    https://viayoo.com/
// @version      0.5
// @description  由 酷安@达蒙山 的划词菜单修改而来
// @author       呆毛飘啊飘2171802813
// @run-at       document-start
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459878/%E5%88%92%E8%AF%8D%E6%96%B0%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/459878/%E5%88%92%E8%AF%8D%E6%96%B0%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

! function() {
if(document.getElementById("hckj")){
document.getElementById('hckj').remove();
}
  window.addEventListener('contextmenu', function(e){  
      e.preventDefault();  
  });
    var ssyq = [{
        name: "复制",
        url: "viek://copytext/"
    }, {
        name: "全选",
        url: "viek://share/"
    }, {
        name: "搜索",
        url: "viek://search/"
    }, {
        name: "翻译",
        url: "https://fanyi.baidu.com/?tpltype=sigmah#en/zh/"
    }],
        hcTimer,
        ljurl,
        text;

    function hccd() {
        text = window.getSelection()
            .toString()
            .trim();
        text ? (document.getElementById("hckj")
            .style.top = sy, document.getElementById("hckj")
            .style.display = "block", zdcd()) : document.getElementById("hckj")
            .style.display = "none";
    }

    function tzurl(a, b) {
        b = b || text;
        if (typeof(window.viek) == "undefined" || window.viek == null) {
            if (a == "viek://share/") {
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();var r=document.createRange();r.selectNode(document.documentElement);window.getSelection().addRange(r);
            } else if (a == "viek://copytext/") {
                copyText(b);
            } else if (a == "viek://search/") {
                if (typeof(window.via) == "undefined" || window.via == null) {
                    ljurl = 'https://m.baidu.com/s?word=' + b;
                    window.open(ljurl);
                } else {
                    via.searchText(b);
                }
            } else {
                ljurl = a + b;
                window.open(ljurl);
            }
        } else {
            ljurl = a + b;
            window.open(ljurl);
        }
    }

    function zdcd() {
        document.getElementById("hckj")
            .style.left = (document.documentElement.clientWidth - document.getElementById("hckj")
            .offsetWidth) / 2 + "px";
        var zdurl = text.match(/(https?:\/\/(\w[\w-]*\.)+[A-Za-z]{2,4}(?!\w)(:\d+)?(\/([\x21-\x7e]*[\w\/=])?)?|(\w[\w-]*\.)+(com|cn|org|net|info|tv|cc|gov|edu)(?!\w)(:\d+)?(\/([\x21-\x7e]*[\w\/=])?)?)/i)[0];
        if (zdurl) {
            var tzlj = document.createElement("span");
            tzlj.id = "zdan";
            tzlj.innerHTML = "转到";
            tzlj.addEventListener("click",

            function() {
                zdurl.indexOf("http") < 0 ? tzurl("http://", zdurl) : tzurl("", zdurl);
            });
            document.getElementById("hckj")
                .appendChild(tzlj);
        };
        document.getElementById("hckj")
            .style.left = (document.documentElement.clientWidth - document.getElementById("hckj")
            .offsetWidth) / 2 + "px";
    }

    if (!document.getElementById("cdkj")) {
        var cddiv = document.createElement("div");
        cddiv.id = "cdkj";
        cddiv.style.cssText = "width:100%;display:block!important;position:fixed;top:0px;z-index:99999999;text-align:center;-webkit-tap-highlight-color:rgba(0,0,0,0);";
        document.body.appendChild(cddiv);
        var cdstyle = document.createElement("style");
        cdstyle.type = "text/css";
        cdstyle.innerHTML = "#cdkj span{user-select: none;display:inline-block;border:1px solid #c5c5c5;background:#6a6a6a;color:#fff;font-size:14px;line-height:16px;padding:8px 10px 8px 10px;}";
        document.body.appendChild(cdstyle);
    }
    var hcdiv = document.createElement("div");
    hcdiv.id = "hckj";
    hcdiv.style.cssText = "border:1px solid #c5c5c5;background:#c5c5c5;position: absolute;display:none";
    document.getElementById("cdkj")
        .appendChild(hcdiv);

    for (var i = 0; i < ssyq.length; i++) {
        var jksp = document.createElement("span");
        jksp.innerHTML = ssyq[i].name;
        jksp.setAttribute("jkdz", ssyq[i].url);
        jksp.onclick = function() {
            tzurl(this.getAttribute("jkdz"));
        };
        document.getElementById("hckj")
            .appendChild(jksp);
    }

    document.addEventListener("selectionchange", function() {
        clearTimeout(hcTimer);
        hcTimer = setTimeout(hccd, 75);
        if (document.getElementById("zdan")) {
            document.getElementById("zdan")
                .parentNode.removeChild(document.getElementById("zdan"));
        }
    });

    document.addEventListener('touchstart', function(e) {
        sy = e.touches[0].clientY + 20;
        sm = sy + 25;
        if (document.documentElement.clientHeight < sm) {
            sy = document.documentElement.clientHeight - 100;
        }
        sy = sy + "px"
    });


    function copyText(txt) {
        var x = document.body.scrollTop;
        var y = document.documentElement.scrollTop;
        const ta = document.createElement('textarea');
        ta.value = txt;
        ta.style.position = 'absolute';
        ta.style.opacity = '0';
        ta.style.left = '-999999px';
        ta.style.top = '-999999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        window.scrollTo(x, y);
    };
}();