// ==UserScript==
// @name         随心--改写标题
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  rewrite the title
// @author       Lin折
// @match        https://*/*
// @match        http://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAIAAAAl7d1hAAAACXBIWXMAABJ0AAASdAHeZh94AAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAAO9SURBVHic7Zw9SytBFEBv9AUDihbiKISIWFjogmBnIUjAQsRSgz9AUNhC0DXgV6EECYuQIkXAHyDRUkSwGAPWCkK0EAQRBBmxMESIBM0rAiKT5JmZnZ0wb/Z0uWHu3LO7mV2vk/hKpRJoRlOjC2gAnrMe/HEyGGN8e3tLCBkfHzcMAyEkqqz65w2Hw6zDfdxr2NbWVjab/X5pGIZpmm5rE0KSyeTPecPhsGmaTEk4r22M8c+JASCbzZ6fn/Nlq5/Dw0NqXoxxOp1mSsLpnMlkKoOsc3OAMa4Mvry8MCXhdCaEMMWFUCs5deZ/Rcd123PWA89ZDzxnPfCc68bv94utQyaczpZldXd3iy1FGpzOvb29tm2PjIyIrUYO/J/ntra2jY2Nubm5pibFFgWn5c7MzGxubra3twupRg4CTtHw8PDe3t7AwIDzVHIQc1l2dnbGYrHJyUkh2dyG0/nk5ISKNDc3z8/PK3GRczofHx/HYrF8Pk/FA4GA45Jch//avry8XFlZub+/F1iNHBx9ngkha2trZ2dnoqqRg9M1rFgsplKpZDJZLBaFFCQBMes2xjgajT4/PwvJ5jbCHqEeHh4sy/r4+BCV0D1EPja+v7+/vb0JTOgSij0qC8Fz1gMdnR39/7mShYWFymAwGFxdXQ2FQlQ8n88nEomrqyuxNfyKjPP89PQUjUYvLi6oeKO6DpImKxQKiURif3//8/OTekt+10HeAS6VSqenp+vr66+vr9RbkrsOstewu7u75eXl6+trKv7ddfD5fG7X0IB1O5fL7ezsHB0dUfFy12FpacntP8Ibc6/6+vo6ODio2nUYGxuLx+PBYNC92Rt5f67VdQiFQrZtj46OujSv4PtzKpUSsl0qEAhYlkUFCSFV7/+s6Pgc5jnrgUrOHR0dra2tzvOo5NzS0mLbdl9fn8M8KjkDQE9PTzwe59jL+xPFnAHA7/ebprm4uMi910E95zITExO7u7t8ex1UdQaA/v5+vr0OKjkXCgUqUu46TE9PM+VRyTmXy1XtOkxNTTHlUckZAGp1HZhQzBlqdx3qRz1nqN11qBMlneGfXYdfUdW5TLnr8Pj4yDRKbWcAIITYts00RHlnAGDd4vA/OLPiOeuB56wHnrMeeM56wOlsGEZlECHk6nf7a+VnnZTTuaury/ncHFQ91kNDQ0xJOJ0jkQjVZEYIbW9v82Wrn9nZWerIGoYRiUSYkvD/bgUAYIwzmQxCaHBw0GGfnYl0On1zc4MQKv9GCOtwR86K4q3beuA568FfAYdKFV4DD2gAAAAASUVORK5CYII=
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/439656/%E9%9A%8F%E5%BF%83--%E6%94%B9%E5%86%99%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/439656/%E9%9A%8F%E5%BF%83--%E6%94%B9%E5%86%99%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...

    var htmlcss = `
<style>

#Changeheader{
    position: fixed !important;
    top: calc(0vh) !important;
    left: -488px !important;
    width: 500px;
    height: 32px;
    padding: 6px !important;
    display: flex;
    opacity: 0.5;
    transition: 0.9s;
    z-index: 999999999 !important;
    /****z-index让元素在第一图层********/
    cursor: pointer;
    user-select: none !important;
    flex-direction: row;
    align-items: center;
    grid-gap: 10px;
    border-radius: 0 50px 50px 0;
    background-color: #eee;
    color: #000 !important;
    font-size: medium;
}

#Changeheader:hover {
    opacity: 1;
    box-shadow: 1px 1px 3px 0px #aaa !important;
    transform: translateX(400px);
}
#Changeheader:hover #subbtn{
    background-color: aqua;
    transition: all 1s;
}
#Changeheader:hover #savebtn{
    background-color:tomato;
    transition: all 3s;
}
#Changeheader:hover #restorebtn{
    background-color:chartreuse;
    transition: all 5s;
}


#myText{
    width: 300px;
    height: 24px;
    border-radius: 50px;
    text-align: center;
    border: 2px solid;
    border-top-color:#36CBFF;
    border-left-color:#36CBFF;
    border-bottom-color:deepskyblue;
    border-right-color:deepskyblue;
}
#subbtn{
    width: 20px;
    height: 20px;
    border-radius: 50px;
    opacity: inherit;
    background-color:gainsboro;
    box-shadow: 1px 1px 3px 0px #aaa ;
}
#savebtn{
    width: 20px;
    height: 20px;
    border-radius: 50px;
    opacity: inherit;
    background-color:gainsboro;
    box-shadow: 1px 1px 3px 0px #aaa;
}
#restorebtn{
    width: 20px;
    height: 20px;
    border-radius: 50px;
    opacity: inherit;
    background-color:gainsboro;
    box-shadow: 1px 1px 3px 0px #aaa;
    margin-left: 105px;
}

</style>
<div id="Changeheader">
    <div id="restorebtn" title="restore"></div>
    <div id="savebtn" title="save"></div>
    <input type="text" id="myText" value="">
    <div id="subbtn" title="submit"></div>
</div>
`;
    //css样式参考"自动无缝翻页"
    document.documentElement.insertAdjacentHTML('beforeend', htmlcss);
    //插入html代码


    var headertochange = document.querySelector("head > title");
    var oldtitle=document.querySelector("head > title").text;
    var mytitle = document.getElementById("myText");
    var sub=document.getElementById("subbtn");
    var save=document.getElementById("savebtn");
    var restore=document.getElementById("restorebtn");
    var url=window.location.href;

    if(!GM_getValue(url)){
        //alert("不存在");
        mytitle.value = oldtitle;
    }else{
        //alert("存在");
        mytitle.value = GM_getValue(url);
        headertochange.textContent=mytitle.value;
    }


    //点击修改标题
    sub.onclick=function(){
        headertochange.textContent=mytitle.value;
    }
    //点击保存标题
    save.onclick=function(){
        GM_setValue(url,mytitle.value);
        headertochange.textContent=mytitle.value;
    }
    //点击还原标题
    restore.onclick=function(){
        headertochange.textContent=oldtitle;
        mytitle.value=oldtitle;
        GM_setValue(url,oldtitle);
    }


    //使回车起到点击的作用
    mytitle.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            sub.click();
        }
    })

})();