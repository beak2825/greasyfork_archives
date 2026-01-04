// ==UserScript==
// @name         button for zhu Jstris short
// @namespace    http://tampermonkey.net/
// @version      1.34
// @description  2021/07/20
// @author       ore100
// @match        https://*.jstris.jezevec10.com/*
// @downloadURL https://update.greasyfork.org/scripts/489017/button%20for%20zhu%20Jstris%20short.user.js
// @updateURL https://update.greasyfork.org/scripts/489017/button%20for%20zhu%20Jstris%20short.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function(){

/*
myCanvas.style.marginTop="1.3in";//場地下移
bgLayer.style.marginTop="1.3in";//場地方塊下移
holdCanvas.style.marginTop="1.3in";//保存下移
rstage.style.marginTop="1.3in";//預覽下移
rstage.style.position="absolute";
rstage.style.left="3.6in";
*/


        //统计数据
/*
gstats.style.marginTop="-5in";//秒數上移
gstats.style.left="40px";//秒數置中
gstats.style.maxWidth="1.8in";//限制大小
gstats.style.maxHeight="1.4in";//限制大小
gstats.style.position="absolute";
*/



        //菜单
 /*
 buttonsBox.style.bottom="4.9in";//設置按鈕上移
buttonsBox.style.left="190px";//設置按鈕偏右
buttonsBox.style.maxWidth="1.8in";//限制大小
buttonsBox.style.maxHeight="1.4in";//限制大小
buttonsBox.style.position="absolute";
*/

buttonsBox.style.bottom="3in";//設置按鈕上移
buttonsBox.style.left="-110px";//設置按鈕偏右
buttonsBox.style.maxWidth="1.4in";//限制大小
buttonsBox.style.maxHeight="1.6in";//限制大小
buttonsBox.style.position="absolute";


//rInfoBox.style.bottom="5in";//剩餘行數上移
//rInfoBox.style.left="-6px";
//rInfoBox.style.transform="translate(-6px,-5in)";



//预览块变大
//bgLayer.style.transform="scale(1.1,1.1) translate(5px,1in)";myCanvas.style.transform="scale(1.1,1.1) translate(5px,1in)";bgLayer.style.maxHeight="5in";myCanvas.style.maxHeight="5in";


//剩餘行數亮色
lrem.style.filter =
"sepia(1) brightness(0.5) hue-rotate(24deg) saturate(5550) brightness(206%)";

//秒數亮色
glstats.style.filter =
"sepia(1) brightness(0.5) hue-rotate(24deg) saturate(5550) brightness(206%)";

//loadSkin("https://t.mwm.moe/mp/png",18);//方块皮肤


/*

myCanvas.style.left="15px";//場地下移
bgLayer.style.left="15px";//場地方塊下移
rstage.style.marginTop="15px";//預覽下移
holdCanvas.style.marginTop="15px";//保存下移
//Ready Go下移
var customStyle2=document.createElement("style");
    customStyle2.innerHTML='.gCapt {margin-Left:15px;margin-Top:-2.5in}';
    document.body.appendChild(customStyle2);
*/


// The following are custom buttons
//buttons | x：position| y：position| width| length

keys = `
⤓"-240"-110"1.3"1.3
←"0"-100"1.3"1.3
→"45"-100"1.3"1.3
↓"-90"-10"1.3"1.3
↷"-10"-100"1.3"1.3
↶"-30"-10"1.0"1.0
田"0"-80"1"1
⇄"40"-110"1.3"1.3
⟳"190"100"1"1
`

lines = keys.split("\n")
ids = ["", "tc-hd", "tc-l", "tc-r","tc-d", "tc-c", "tc-cc", "tc-vs", "tc-h", "tc-dr"]

for (var i = 0; i < lines.length; i++) {
    if(lines[i]){
        pos = lines[i].split("\"")
        style = "scale(" + pos[3] + "," + pos[4] + ") translate(" + pos[1] + "px," + pos[2] + "px)"
        document.getElementById(ids[i]).style.transform=style
    }
}
});
})();



//document.getElementById("app").style["background-color"]="#222";//pure bg


document.getElementById("tc-hd").style.borderRadius = '3em';//圓形按鈕round button//id="tc-hd" style="border-radius:50%;"
document.getElementById("tc-c").style.borderRadius = '3em';//圓形按鈕round button//id="tc-c" style="border-radius:50%;"
document.getElementById("tc-cc").style.borderRadius = '3em';//圓形按鈕round button//id="tc-cc" style="border-radius:50%;"
document.getElementById("tc-r").style.borderRadius = '3em';//圓形按鈕round button//id="tc-r" style="border-radius:50%;"
document.getElementById("tc-l").style.borderRadius = '3em';//圓形按鈕round button//id="tc-l" style="border-radius:50%;"
document.getElementById("tc-d").style.borderRadius = '3em';//圓形按鈕round button//id="tc-d" style="border-radius:50%;"
//document.getElementById("tc-vs").style.borderRadius = '3em';//圓形按鈕round button//id="tc-vs" style="border-radius:50%;"
document.getElementById("tc-h").style.borderRadius = '3em';//圓形按鈕round button//id="tc-h" style="border-radius:50%;"
document.getElementById("tc-dr").style.borderRadius = '3em';//圓形按鈕round button//id="tc-dr" style="border-radius:50%;"