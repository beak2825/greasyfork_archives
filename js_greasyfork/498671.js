// ==UserScript==
// @name         广东初中生综合评级系统一键完成(半自动)
// @namespace    http://tampermonkey.net/
// @version      2024-06-23
// @description  一个可以快捷完成广东初中综合素质评价的小玩意儿
// @author       Xiaoyu1687
// @match        czzp.gdedu.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/498671/%E5%B9%BF%E4%B8%9C%E5%88%9D%E4%B8%AD%E7%94%9F%E7%BB%BC%E5%90%88%E8%AF%84%E7%BA%A7%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%28%E5%8D%8A%E8%87%AA%E5%8A%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/498671/%E5%B9%BF%E4%B8%9C%E5%88%9D%E4%B8%AD%E7%94%9F%E7%BB%BC%E5%90%88%E8%AF%84%E7%BA%A7%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%28%E5%8D%8A%E8%87%AA%E5%8A%A8%29.meta.js
// ==/UserScript==
// 等待网页完成加载
// 等待网页完成加载
let Container = document.createElement('div');
Container.id = "sp-ac-container";
Container.style.position="fixed"
Container.style.left="250px"
Container.style.top="20px"
Container.style['z-index']="999999"
Container.innerHTML =`<button id="myCustomize" style="position:absolute; left:850px; top:260px">
  一键完成
</button>
`
document.body.append(Container);
document.body.appendChild(Container);
Container.id = "sp-ac-container";
Container.style.position="fixed"
Container.style.left="250px"
Container.style.top="20px"
Container.style['z-index']="999999"
Container.innerHTML =`<button id="myCustomize" style="position:absolute; left:850px; top:260px">
  一键完成
</button>
`
document.body.append(Container);
document.body.appendChild(Container);
Container.onclick=function(){
  if (document.querySelector("#savebuttonmsl > button") == null) {
       alert("找不到按钮，请确保已进入到学生填报界面");
 }
else{
    var ztnr=document.querySelector('#ztnr');
    var ms=document.querySelector('#ms');
    var zmr=document.querySelector('#zmr');
    var saveForm=document.querySelector('#saveForm');
    var fhbut=document.querySelector('#fhbut');
    var add=document.querySelector('#savebuttonmsl > button');
    var focus = new Event('focus');
    var input = new Event('input');
    var change = new Event('change');
    var blur = new Event('blur');
    var text=document.querySelector('#bodycontent > div > div.row > div > div.zh_hd_info > p')
    var name=document.querySelector('#userT > span:nth-child(1)')
    add.click();
    ztnr.value=text.innerHTML.substring(0,30);
    ms.value=text.innerText;
    zmr.value=name.innerText
    ztnr.dispatchEvent(focus)
    ms.dispatchEvent(focus)
    zmr.dispatchEvent(focus)
    ztnr.dispatchEvent(input)
    ms.dispatchEvent(input)
    zmr.dispatchEvent(input)
    ztnr.dispatchEvent(change)
    ms.dispatchEvent(change)
    zmr.dispatchEvent(change)
    ztnr.dispatchEvent(blur)
    ms.dispatchEvent(blur)
    zmr.dispatchEvent(blur)
    saveForm.click();
    setTimeout(function(){
        document.querySelector('body > div.swal2-container.swal2-fade.swal2-in > div > button.swal2-confirm.swal2-styled').click();
    }, 300);
    setTimeout(function(){
        fhbut.click();
    }, 500);
}
}



function test(){
    setTimeout(function(){
        document.querySelector('body > div.swal2-container.swal2-fade.swal2-in > div > button.swal2-confirm.swal2-styled').click();
        var pfx = document.querySelector('#lsTbtjChGrid_length > label > select');
        var change = new Event('change');
        var pfxed = pfx.options.length -1
        pfx.selectedIndex = pfxed
        pfx.dispatchEvent(change);
    }, 300);
}
setTimeout(function(){
    var change = new Event('change');
    var content=document.querySelector('#content');
    var myxs=document.querySelector('#bzrWdbjXsxxGrid_length > label > select');
    var contented = content.options.length -1
    content.selectedIndex = contented
    var xxBjxxId = $("#content").val();
    var bjlx = $("#content").find("option:selected").attr("bjlx");
    var xxJxbId = $("#content").find("option:selected").attr("xxJxbId");
    myxs.value=100
    myxs.dispatchEvent(change)
    content.size=7
    content.style="width:230%;"
    BjXsCount.clickBjxx(xxBjxxId,bjlx,xxJxbId);
}, 300);

setTimeout(function(){
    var change = new Event('change');
    var pf = document.querySelector('#gcdpfGrid_length > label > select');
    var pfed = pf.options.length -1
    pf.selectedIndex = pfed
    pf.dispatchEvent(change);

    }, 300);


setTimeout(function(){
    var change = new Event('change');
    var pfx=document.querySelector('#lsTbtjChGrid_length > label > select');
    var pfxed = pfx.options.length -1
    pfx.selectedIndex = pfxed
    pfx.dispatchEvent(change);
    var saveForm=document.querySelector('#saveForm');
    saveForm.addEventListener("click", test);

    }, 300);

