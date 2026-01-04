// ==UserScript==
// @name         fishpi xiaolceGame
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       Tandr
// @match        https://fishpi.cn/cr
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishpi.cn
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_removeValueChangeListener
// @grant        GM_addValueChangeListener
// @require      https://cdn.jsdelivr.net/npm/tandr@1.0.1/tandr-layui.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496297/fishpi%20xiaolceGame.user.js
// @updateURL https://update.greasyfork.org/scripts/496297/fishpi%20xiaolceGame.meta.js
// ==/UserScript==
(function() {
    let myapp = document.createElement("div");
    document.body.appendChild(myapp);
    myapp.id = "my-app";
    myapp.innerHTML = `
    <link rel="stylesheet" href="https://unpkg.com/layui@2.6.8/dist/css/layui.css">`
    'use strict';
    let lltriple=document.createElement("div");
    lltriple.setAttribute("class", "divT");
    lltriple.style.marginTop= "-130px";
    let sharelyit=document.querySelector('.ice-tool-bar');
    sharelyit.parentElement.insertBefore(lltriple,sharelyit);
    // Your code here...
    // 终端按钮控制中心
    terminal()
    // 信息查询
    select();
    // 购买
    buyGoods("",1);
    // 吐纳
    tuna();
    // 历练
    lilian();
    // 炼药
    lianYao();
})();
// 1.历练 加引魔香 加大力丸 使用 (带实现功能，如果没有该丹药，购买材料进行炼药（收益最大）)
// 2.待完成功能:选择按钮是否需要去炼药丹药，如果需要则进行炼药制作(比较耗时)，否则直接购买丹药
// 3.待完成功能:历练时需要查询是否还有历练次数,以防浪费丹药
function lilian() {
     let lltriple=document.createElement("button");
     lltriple.innerText="历练";
     lltriple.style.background="#409EFF";
     lltriple.style.color="#fff";
     lltriple.style.width="50px";
     lltriple.style.height="30px";
     lltriple.onclick=function(){
        var checkbox = document.getElementById("lilianCheckbox");
        setTimeout(function(){
            var divll = document.getElementsByClassName('ice-msg-content')[0].innerText;
            if (divll.includes("您正在")) {
                return;
            }
            document.getElementsByClassName('ice-chat-input')[0].value = '使用 大力丸';
            document.getElementById("iceSendMsg").click();
            setTimeout(async function(){
                var divElement = document.getElementsByClassName('ice-msg-content')[0].innerText;
                if (divElement.includes("没有该物品")) {
                    // 判断是否需要炼药,如果有勾选就进行大力丸的炼制
                    if(checkbox.checked) {
                        lianYao('大力丸')
                        minlilian()
                    }else {
                        // 没有勾选进行购买(引魔香是必买的)

                        minlilian()
                    }
                }else {
                    document.getElementsByClassName('ice-chat-input')[0].value = '购买 大力丸 '+ 1;
                    document.getElementById("iceSendMsg").click();
                    document.getElementsByClassName('ice-chat-input')[0].value = '购买 引魔香 '+ 1;
                    document.getElementById("iceSendMsg").click();
                    minlilian()
                }
            },100)
            document.getElementsByClassName('ice-chat-input')[0].value = '历练';
            document.getElementById("iceSendMsg").click();
        },500)
     };
     let llshare=document.querySelector('.divT');
     llshare.appendChild(lltriple,llshare);
}

// 历练min
function minlilian(){
    document.getElementsByClassName('ice-chat-input')[0].value = '使用 大力丸';
    document.getElementById("iceSendMsg").click();
    document.getElementsByClassName('ice-chat-input')[0].value = '使用 引魔香';
    document.getElementById("iceSendMsg").click();
}

// 1.吐纳 (带实现功能，如果没有该丹药，购买材料进行炼药（收益较小）)
// 2.待完成功能 选择按钮是否需要去炼药神行丸，如果需要则进行炼药制作(比较耗时)，不推荐直接购买很亏，如果不购买就直接普通吐纳
// 3.待完成功能:吐纳时需要查询是否还有吐纳次数,以防浪费丹药
function tuna() {
    let triple=document.createElement("button");
    triple.innerText="吐纳";
    triple.style.background="#409EFF";
    triple.style.color="#fff";
    triple.style.width="50px";
    triple.style.height="30px";
    triple.onclick=function(){
        var checkbox = document.getElementById("tnCheckbox");
        if(!checkbox.checked) {
            document.getElementsByClassName('ice-chat-input')[0].value = '吐纳';
            document.getElementById("iceSendMsg").click();
        }else{
            // 插入查询()
            setTimeout(function(){
                var divll = document.getElementsByClassName('ice-msg-content')[0].innerText;
                if (divll.includes("您正在")) {
                    return;
                }
                console.log(1)
                document.getElementsByClassName('ice-chat-input')[0].value = '使用 神行丸';
                document.getElementById("iceSendMsg").click();
                // 获取包含信息的元素
                setTimeout(async function(){
                    var divElement = document.getElementsByClassName('ice-msg-content')[0].innerText;
                    if (divElement.includes("没有该物品")) {
                        var tnRun =await lianYao('神行丸')
                        if(tnRun) {
                            setTimeout(() => {
                                console.log("怎么不执行")
                                document.getElementsByClassName('ice-chat-input')[0].value = '使用 神行丸';
                                document.getElementById("iceSendMsg").click();
                                document.getElementsByClassName('ice-chat-input')[0].value = '吐纳';
                                document.getElementById("iceSendMsg").click();
                            }, 30000);
                        }else{
                            layer.msg('吐纳失败！', {icon: 2});
                        }
                    }else{
                        console.log(2)
                        document.getElementsByClassName('ice-chat-input')[0].value = '吐纳';
                        document.getElementById("iceSendMsg").click();
                    }
                },100)
            },500)
        }
    };
    let share=document.querySelector('.divT');
    share.appendChild(triple,share);
}

let collection = { qianjinteng: "千金藤",huoqiguo: "活气果",xiangshicao:"香蚀草",shimanhua:"噬蔓花" };

// 炼药 (带实现功能，如果材料不足购买材料进行炼药(已实现待测试))
function lianYao(goods) {
     let triplely=document.createElement("button");
     triplely.innerText="炼药";
     triplely.style.background="#409EFF";
     triplely.style.color="#fff";
     triplely.style.width="50px";
     triplely.style.height="30px";
     if(goods != null && goods != '' && goods != undefined) {
        document.getElementsByClassName('ice-chat-input')[0].value = '炼药 '+goods;
        document.getElementById("iceSendMsg").click();
        return new Promise(function(resolve) {
            setTimeout(function(){
                // 材料不足购买材料
                var divElement = document.getElementsByClassName('ice-msg-content')[0].innerText;
                if (divElement.includes("材料不足")) {
                    // 调用 buy 方法
                    var purchasePromise = buy(goods, 2);
                    purchasePromise.then((purchaseSuccessful) => {
                        if (purchaseSuccessful) {
                            // 处理购买成功的情况
                            document.getElementsByClassName('ice-chat-input')[0].value = '炼药 '+goods;
                            document.getElementById("iceSendMsg").click()
                            layer.msg('正在炼药此操作可能需要40s', {icon: 1});
                            resolve(purchaseSuccessful);
                        } else {
                            // 处理购买失败的情况
                            layer.msg('钱包空空！', {icon: 2});
                            resolve(purchaseSuccessful);
                        }
                    }).catch((error) => {
                        // 处理错误情况
                        layer.msg('购买出错!', {icon: 2});
                        resolve(purchaseSuccessful);// 返回失败
                    });

                }
            },100)
        })
     } else {
        triplely.onclick=function(){
            document.getElementsByClassName('ice-chat-input')[0].value = '炼药 大力丸';
            document.getElementById("iceSendMsg").click();
            setTimeout(function(){
                document.getElementsByClassName('ice-chat-input')[0].value = '炼药 神行丸';
                document.getElementById("iceSendMsg").click();
            },50000)
        };
        let sharely=document.querySelector('.divT');
        sharely.appendChild(triplely,sharely);
    }
}

// 查询
function select(goods){
    let triplely=document.createElement("button");
    triplely.innerText="查询物品信息";
    triplely.style.background="#409EFF";
    triplely.style.color="#fff";
    triplely.style.width="100px";
    triplely.style.height="30px";
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "myInput");
    // 设置输入框样式
    input.style.width = "110px";
    input.style.height = "25px";
    let sharelyit=document.querySelector('.divT');
    sharelyit.appendChild(input,sharelyit);
    triplely.onclick=function(){
        // 获取输入框的值
        var inputValue = document.getElementById("myInput").value;
        document.getElementsByClassName('ice-chat-input')[0].value = '信息';
        document.getElementById("iceSendMsg").click();
        if(inputValue !=null && inputValue != ""){
            setTimeout(function(){
                // 获取包含信息的元素
                var divElement = document.getElementsByClassName('ice-msg-content')[0];
                // 获取所有的 <details> 元素
                var detailsElements = divElement.querySelectorAll('details');
                // 获取第三个 <details> 元素
                var thirdDetailsElement = detailsElements[2].innerHTML;
                // 获取包含物品的文本内容
                // var itemsText = thirdDetailsElement.innerText;
                // 将文本内容分割成物品列表
                var itemsList = thirdDetailsElement.split(/\[.*?\]/).filter(Boolean);
                // 使用list找到对应的物品就行
                var found = false;
                for (var i = 0; i < itemsList.length; i++) {
                    if (itemsList[i].includes(inputValue)) {
                        found = true;
                        goods = itemsList[i];
                        break;
                    }
                }
                if (!found) {
                    layer.msg("未找到"+inputValue+"物品信息", {icon: 1});
                }else{
                    // 将物品数量找到分割 找到 * 号和 <br> 的位置
                    var starIndex = goods.indexOf('*');
                    var brIndex = goods.indexOf('<br>');
                    // 提取数字部分
                    var numberString = goods.substring(starIndex + 1, brIndex).trim();
                    // 将字符串转换为数字
                    var quantity = parseInt(numberString);
                    layer.msg(inputValue + "数量:"+quantity, {icon: 1});
                }
                document.getElementById("myInput").value = ''
            },500)
        }
    };
    let sharely=document.querySelector('.divT');
    sharely.appendChild(triplely,sharely);

    let triplelybr=document.createElement("br");
    let sharelybr=document.querySelector('.divT');
    sharelybr.appendChild(triplelybr,sharelybr);
}

function buyGoods(goods,num) {

    let triplebuy=document.createElement("button");
    triplebuy.innerText="购买";
    triplebuy.style.background="#409EFF";
    triplebuy.style.color="#fff";
    triplebuy.style.width="50px";
    triplebuy.style.height="30px";
    var select = document.createElement("select");
    // 创建选项
    var option1 = document.createElement("option");
    option1.value = "大力丸"; // 实际的值
    option1.text = "大力丸(历练增加额外经验)"; // 要显示的值

    var option2 = document.createElement("option");
    option2.value = "引魔香"; // 实际的值
    option2.text = "引魔香(历练遇怪提高至90%)"; // 显示的值

    var option3 = document.createElement("option");
    option3.value = "千金藤"; // 实际的值
    option3.text = "千金藤(大力丸的材料之一)"; // 显示的值

    var option4 = document.createElement("option");
    option4.value = "活气果"; // 实际的值
    option4.text = "活气果(大力丸的材料之一)"; // 显示的值

    var option5 = document.createElement("option");
    option5.value = "香蚀草"; // 实际的值
    option5.text = "香蚀草(神行丸材料之一)"; // 显示的值

    var option6 = document.createElement("option");
    option6.value = "噬蔓花"; // 实际的值
    option6.text = "噬蔓花(神行丸材料之一)"; // 显示的值

    var option7 = document.createElement("option");
    option7.value = "神行丸"; // 实际的值
    option7.text = "神行丸(吐纳增加额外经验)"; // 要显示的值

    // 添加选项到下拉框
    select.add(option1);
    select.add(option2);
    select.add(option3);
    select.add(option4);
    select.add(option5);
    select.add(option6);
    select.add(option7);
    // 将默认选中设置为空
    select.selectedIndex = -1;
    select.setAttribute("id", "buySelect");
    // 设置输入框样式
    select.style.width = "185px";
    select.style.height = "25px";
    let sharelyit=document.querySelector('.divT');
    sharelyit.appendChild(select,sharelyit);

    // 购买数量
    var input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("id", "goodsNum");
    input.setAttribute("min", "0"); // 设置最小值为0
    input.style.width = "40px";
    input.style.height = "20px";
    let shareInum=document.querySelector('.divT');
    shareInum.appendChild(input,shareInum);
    triplebuy.onclick=function(){
        // 获取购买物品的值
        var selectValue = document.getElementById("buySelect").value;
        // 获取购买数量的值
        var numValue = document.getElementById("goodsNum").value;
        if((selectValue == null || selectValue == '' || selectValue == undefined) || (numValue == null || numValue == '' || numValue == undefined) ){
            return;
        }
        document.getElementsByClassName('ice-chat-input')[0].value = '购买 '+selectValue +" "+ numValue;
        document.getElementById("iceSendMsg").click();
    }
    let sharebuy=document.querySelector('.divT');
    sharebuy.appendChild(triplebuy,sharebuy);

    let triplelybr=document.createElement("br");
    let sharelybr=document.querySelector('.divT');
    sharelybr.appendChild(triplelybr,sharelybr);
}

// 购买
function buy(goods,num) {
    if(num == 2){
        // 设置消息输入框的值为'信息'，然后点击发送按钮
        document.getElementsByClassName('ice-chat-input')[0].value = '信息';
        document.getElementById("iceSendMsg").click();

        // 返回一个Promise，用于异步操作的处理
        return new Promise((resolve, reject) => {
            // 在一段时间后执行以下操作，以确保页面已经加载完成
            setTimeout(() => {
                // 获取包含信息的元素
                var divElement = document.getElementsByClassName('ice-msg-content')[0];
                // 获取所有的 <details> 元素
                var detailsElements = divElement.querySelectorAll('details');
                // 获取第三个 <details> 元素的内容
                var thirdDetailsElement = detailsElements[2].innerHTML;

                // 解析物品信息字符串，生成物品列表
                // 这里可以考虑将物品信息字符串和对应的物品分开存储，以便后续操作
                var itemsList = thirdDetailsElement.split(/\[.*?\]/).filter(Boolean);

                // 定义不同物品对应的物品字符串列表
                var goodsString = '';
                if (goods.includes("神行丸")) {
                    goodsString = ["香蚀草", "噬蔓花"];
                }
                if (goods.includes("大力丸")) {
                    goodsString = ["千金藤", "活气果"];
                }
                var goodsList = goodsString;

                // 遍历物品列表，检查是否需要购买
                for (var i = 0; i < itemsList.length; i++) {
                    for (var j = 0; j < goodsString.length; j++) {
                        var found = false;
                        if (itemsList[i].includes(goodsString[j])) {
                            found = true;
                            goods = itemsList[i];
                            for (var z = goodsList.length - 1; z >= 0; z--) {
                                if (goodsList[z].includes(goodsString[j])) {
                                    goodsList.splice(z, 1);
                                }
                            }
                        }
                        var quantity = 0;
                        if (found) {
                            // 解析物品数量，并判断是否需要购买
                            var starIndex = goods.indexOf('*');
                            var brIndex = goods.indexOf('<br>');
                            var numberString = goods.substring(starIndex + 1, brIndex).trim();
                            var goodsArray = goods.split(" * ");
                            var goodsName = goodsArray[0];
                            quantity = parseInt(numberString, itemsList);
                            if (quantity < 10) {
                                // 向输入框填入购买指令并点击发送按钮
                                document.getElementsByClassName('ice-chat-input')[0].value = '购买 ' + goodsName + " " + (10 - quantity);
                                document.getElementById("iceSendMsg").click();
                            }
                        }
                    }
                }

                // 如果还有未购买的物品，自动购买数量为10
                if (goodsList != null && goodsList) {
                    for (var x = 0; x < goodsList.length; x++) {
                        document.getElementsByClassName('ice-chat-input')[0].value = '购买 ' + goodsList[x] + " " + 10;
                        document.getElementById("iceSendMsg").click();
                    }
                }

                // 再次等待一段时间，检查购买是否成功
                setTimeout(function(){
                    var divElement = document.getElementsByClassName('ice-msg-content')[0].innerText;
                    var purchaseSuccessful = true;
                    if (divElement.includes("你的钱不够")) {
                        purchaseSuccessful = false;
                    }
                    resolve(purchaseSuccessful);
                },100)
            }, 100);
        });
    }
}


function terminal() {
    // 有多个复选框（看是否可以使用其他ui）
        // 1.历练时(这里必选是历练使用丹药，利益最大没有之一)丹药不足时是否需要去炼药，如果需要则进行炼药制作(比较耗时，材料不足时回去购买)，否则直接购买丹药（时间30s-40s）
        // 2.吐纳时(这里可以选择不使用丹药，利益较小)丹药不足时是否需要去炼药，如果需要则进行炼药制作(比较耗时)，不会去购买（时间40s）
        let myapp = document.createElement("span");
        myapp.id = "my-span";
        myapp.style.backgroundColor = "white"
        myapp.innerHTML = `<span>历练(是否炼药)&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp吐纳(是否炼药 只买材料)<br/>历练(必购买):</span>`
        let sharelysp=document.querySelector('.divT');
        sharelysp.appendChild(myapp,sharelysp);
        let toggleSwitch = document.createElement("input");
        toggleSwitch.setAttribute("type", "checkbox");
        toggleSwitch.setAttribute("id", "lilianCheckbox");
        toggleSwitch.addEventListener("change", function() {
            GM_setValue('lil',toggleSwitch.checked)
            // 获取复选框的引用
            var checkbox = document.getElementById("lilianCheckbox");
            // 在其他地方改变复选框的值
            checkbox.checked = toggleSwitch.checked; // 设置为选中状态

        });
        let sliderllshare=document.querySelector('#my-span');
        sliderllshare.appendChild(toggleSwitch,sliderllshare);
        // 获取复选框的引用
        var checkbox = document.getElementById("lilianCheckbox");
        // 在其他地方改变复选框的值
        checkbox.checked = toggleSwitch.checked; // 设置为选中状态
        checkbox.checked = GM_getValue('lil');

        let tnapp = document.createElement("span");
        tnapp.id = "tn-span";
        tnapp.style.backgroundColor = "white"
        tnapp.style.marginLeft ="20px"
        tnapp.innerHTML = `<span>吐纳:</span>`
        let sharelysptn=document.querySelector('.divT');
        sharelysptn.appendChild(tnapp,sharelysptn);

        // 吐纳
        let toggleSwitchtn = document.createElement("input");
        toggleSwitchtn.setAttribute("type", "checkbox");
        toggleSwitchtn.setAttribute("id", "tnCheckbox");
        toggleSwitchtn.addEventListener("change", function() {
            GM_setValue('tn',toggleSwitchtn.checked)
            // 获取复选框的引用
            var checkboxq = document.getElementById("tnCheckbox");
            // 在其他地方改变复选框的值
            checkboxq.checked = toggleSwitchtn.checked; // 设置为选中状态

        });
        let sliderllsharetn=document.querySelector('#tn-span');
        sliderllsharetn.appendChild(toggleSwitchtn,sliderllsharetn);
        // 获取复选框的引用
        var checkbox2 = document.getElementById("tnCheckbox");
        // 在其他地方改变复选框的值
        checkbox2.checked = toggleSwitchtn.checked; // 设置为选中状态
        checkbox2.checked = GM_getValue('tn');

        let triplelybr=document.createElement("br");
        let sharelybr=document.querySelector('.divT');
        sharelybr.appendChild(triplelybr,sharelybr);
}