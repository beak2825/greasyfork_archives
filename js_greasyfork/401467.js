// ==UserScript==
// @name         AC-baidu辅助-重建搜索框
// @namespace    https://greasyfork.org/zh-CN/scripts/401467-ac-baidu辅助-重建搜索框/
// @version      0.9
// @description  百度首页极简-只有搜索框|搜索结果页搜索框重建|
// @author       You
// @match        https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401467/AC-baidu%E8%BE%85%E5%8A%A9-%E9%87%8D%E5%BB%BA%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/401467/AC-baidu%E8%BE%85%E5%8A%A9-%E9%87%8D%E5%BB%BA%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==
(function() {
    'use strict';
    /*
        用了ac-baidu但是有点bug..比如首页大logo去不掉，
        然后搜索结果页面背景图片不能覆盖到顶部的搜索框，所以自己写了一个
        然后：截图的背景图片是这个：https://www.coclyun.xyz/1.jpg
        喜欢的可以拿去23333
    */
     if (window.location.href=="https://www.baidu.com/")
{
    //去掉baidu首页的大logo和二维码以及页脚等内容

    var mos1= "id=\"s_lg_img\"";
    var str1=document.getElementById('lg').innerHTML;
    str1=str1.replace(str1.match(mos1)[0],str1.match(mos1)[0]+" style=\"display:none\"");
    document.getElementById('lg').innerHTML=str1;
    //document.getElementById("qrcodeCon").style.display="none";//二维码
    /*document.getElementById("bottom_layer").style.display="none";//底部
    document.getElementById("u1").style.display="none";*/
    /*
    *  新版
    */
    var str=document.getElementById('head_wrapper').innerHTML;
    document.getElementsByTagName('body')[0].innerHTML=str;
    var su=document.getElementById('su');
    su.style.margin='0!important';
    su.style.font='12px arial';
    su.style.cursor='pointer';
    su.style.width='104px';
    su.style.height='40px';
    su.style.lineHeight='38px';
    su.style.padding='0!important';
    su.style.backgroundColor='#38f';
    su.style.fontSize='16px';
    su.style.color='#fff';
    su.style.boxShadow='none';
    su.style.fontWeight='400';
    su.style.border='1px solid #38f';
    document.getElementById('s_fm').style.position='absolute';
    document.getElementById('s_fm').style.left='50%';
    document.getElementById('s_fm').style.top='25%';
    document.getElementById('s_fm').style.width='641px';
    document.getElementById('s_fm').style.transform='translate(-50%,-25%)';
    document.getElementById('kw').style.backgroundColor='rgba(1,1,1,0)';
    document.getElementById('kw').style.border='1px solid #38f';
    document.getElementById('kw').style.height='36px';
    document.getElementById('kw').style.width='500px';
    document.getElementById('kw').style.fontSize="22px";
    document.getElementById('su').style.padding="2px";
    document.getElementById('kw').style.padding="1px";
    document.getElementsByTagName('body')[0].style.overflow='hidden';
    document.getElementsByTagName('html')[0].style.overflow='hidden';
}
//替换原来的搜索框
else {
    var t = 0;
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css";
    link.rel = "stylesheet";
    head.appendChild(link);
    document.getElementById('head').style.display = "none";
    document.getElementById('s_tab').style.display = "none";
    var search_div = document.createElement('div');
    search_div.style.width = '100%';
    search_div.style.height = "40px";
    search_div.style.position = "relative";
    search_div.style.marginTop = '10px';
    search_div.className = "form-group";
    var s = document.createElement('input');
    s.style.height = "35px";
    s.style.width = "50%";
    s.style.position = "absolute";
    s.style.top = '50%';
    s.style.left = "50%";
    s.style.transform = "translate(-50%,-50%)";
    s.className = "form-control";
    s.placeholder = "请输入关键字....";
    s.id = "new_search";
    s.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) { // 按 enter
            var h = "https://www.baidu.com/s?wd=" + this.value + "&rn=";
            window.location.href = h;
            //window.open(h);
        }
    };
    var mos = /wd=.+&rn=/g;
    var mos2 = /wd=.+&rsv_spt/g;
    str = (decodeURI(window.location.href).match(mos) + "");
    if (str == "null") {
        t = 2;
        str = str = (decodeURI(window.location.href).match(mos2) + "");
        if (str == 'null') {
            t = 1;
            str = (decodeURI(window.location.href).match(/wd=.+/g) + "");
        }
    }
    var btn = document.createElement('div');
    btn.style.height = "35px";
    btn.style.width = "35px";
    btn.classList = "glyphicon glyphicon-search";
    btn.style.float = "right !important";
    btn.style.top = "50% !important";
    btn.style.right = "50px !important";
    btn.style.transform = "translate(0,-50%) !important";
    btn.style.color = "#8c8c8c";
    btn.style.textAlign = "center";
    btn.style.paddingTop = '12px';
    btn.style.position = "absolute !important";
    btn.style.cursor = "pointer";
    btn.onclick = function () {
        var h = "https://www.baidu.com/s?wd=" + document.getElementById("new_search").value + "&rn=";
        // window.open(h);
        window.location.href = h;
    };
    search_div.appendChild(btn);
    var w1 = document.documentElement.clientWidth / 2;
    var w2 = w1 / 2;
    btn.style.marginLeft = w1 + w2 + 'px';
    search_div.appendChild(s);
    var ins = document.body.firstChild;
    document.body.insertBefore(search_div, ins);
    if (t == 1) {
        document.getElementById("new_search").value = str.slice(3);
    }
    else if (t == 2) {
        document.getElementById("new_search").value = str.substring(3, str.indexOf("&rsv_spt"));
    }
    else {
        document.getElementById("new_search").value = str.substring(3, str.indexOf("&rn="));
    }
}

})();