// ==UserScript==
// @name         咕咕镇样式优化
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  战斗样式适配新的咕咕镇
// @author       aotmd
// @match        https://www.guguzhen.com/*
// @icon         https://www.guguzhen.com/ys/icon/z4.gif
// @match        https://www.momozhen.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407429/%E5%92%95%E5%92%95%E9%95%87%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/407429/%E5%92%95%E5%92%95%E9%95%87%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
var setting = {
    /*───开启为true,关闭为false────*/
    // 等级换算: false,/*是否开启等级换算*/
    // 保留小数位: 0 ,/*转换后的等级显示的小数位*/
    // 实际属性点计算: true ,/*根据实际属性点计算等级,通过转换计算产生的属性点带有小数,实际属性点会不带小数直接舍去*/
    // 保留原等级: false ,/*保留转换前的等级*/
    /*────────────────────────────*/
    响应式布局: false ,/*是否开启按照浏览器宽度改变布局*/
    相对宽度: 70 ,/*网页内容宽度占浏览器的百分比,单位:%*/
    /*────────────────────────────*/
    样式更改: true ,/*总开关,是否更改css样式*/
    血条护盾高度: 14 ,/*单位:px*/
    字体上下间距: 16 ,/*单位:px*/
    天赋页排版: true ,/*更改天赋页的样式*/
    战斗页血量护盾位置固定在首部:false,
    /*两个样式只能生效一个,即只能设置一个为true,当两个都设置为true时只生效样式1*/
    战斗页样式更改样式1: false ,/*只染色*/
    战斗页样式更改样式2: false ,/*拆分显示护盾但只有一半宽度*/
    战斗页样式更改样式3: true ,/*拆分显示护盾且宽度正常*/
    /*────────────────────────────*/
};

/**
 * 添加样式
 * @param rules css样式
 */
function addStyle(rules) {
    var styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(styleElement);
    styleElement.appendChild(document.createTextNode(rules));
}

if (setting.响应式布局) {
    addStyle(`
        div[style='width:1200px;margin: 0 auto;'] {
            width: ` + setting.相对宽度 + `%!important;transition:0.5s;
        }
    `);
}
if (setting.样式更改) {
    addStyle(`
        /*调整脚本:咕咕镇数据采集*/
        /*调整装备详情的对齐方式*/
        button.btn.btn-light {
            vertical-align: sub;
        }
        /*调整装备神秘属性文字的最大宽度*/
        .bg-danger[style="max-width: 250px; white-space: pre-line; word-break: break-all;"]{
            max-width: 200px!important;
        }
        /*改变战斗页面血条护盾的高度*/
        .fyg_pvedt{
            height: ` + setting.血条护盾高度 + `px!important;
        }
        /*改变战斗页面的间距*/
        p.fyg_mp0.fyg_nw.fyg_lh30,p.fyg_mp0.fyg_nw.fyg_lh30.fyg_tr{
            line-height: ` + setting.字体上下间距 + `px;
        }
        /*3.1.4 将战斗文本信息完全显示*/
        p.fyg_mp0.fyg_nw.fyg_lh30.fyg_tr {
            overflow: unset;
        }
        /*3.1.5 将其他脚本的0-100按钮进行缩短间距*/
        button.btn.btn-secondary {
            padding: 5px 10px;
        }
    `);
    if(setting.天赋页排版){
        $("#eqli5").click(()=>{
            var flag=setInterval(()=>{
                if ($('#tf101').length===0)return;
                var talent=$("#backpacks .row .col-md-3");
                for (var i = 0; i <talent.length ; i++) {
                    console.log(talent[i].class);
                    talent[i].setAttribute('class','col-md-12');
                }
                if (talent.length!==0){
                    clearInterval(flag);
                }
            },1);
        });
        addStyle(`
        #backpacks .row .col-md-12 > div {
             width: 170px;
        }
        `);
    }
    if (setting.战斗页血量护盾位置固定在首部) {
        addStyle(`
            .row .row .col-md-6 .bg-red, .row .row .col-md-6 .bg-blue {
                text-align: unset;
            }
        `);
    }
    if(setting.战斗页样式更改样式1){
        addStyle(`
            /*------------------------------间距统一------------------------------*/
            /*去除间隔*/
            .row .row:nth-of-type(n) {
                margin-bottom: 0px!important;
            }
            /*将文字间距去除*/
            .fyg_pvero {
                letter-spacing: normal;
            }
            /*攻击条高度统一*/
            .row.fyg_pvero .bg-default {
                height: 20px;
            }
            /*------------------------------护盾条------------------------------*/
            .row .row:nth-of-type(n) .col-md-6:nth-of-type(1) .bg-blue {
                background-image: linear-gradient(-90deg, #03A9F4 25%, #c6efff  75%)!important;
            }
            .row .row:nth-of-type(n) .col-md-6:nth-of-type(2) .bg-blue {
                background-image: linear-gradient(90deg, #03A9F4 25%, #c6efff  75%)!important;
            }
            /*血条*/
            .row .row:nth-of-type(n) .col-md-6:nth-of-type(1) .bg-red {
                background-image: linear-gradient(90deg, #f3b3b3 5%, #FF5722 50%)!important;
            }
            .row .row:nth-of-type(n) .col-md-6:nth-of-type(2) .bg-red {
                background-image: linear-gradient(-90deg, #f3b3b3 5%, #FF5722 50%)!important;
            }

            /*护盾条*/
            /*
            .row .row:nth-of-type(3n+4) .col-md-6:nth-of-type(1) .bg-blue {
                background-image: linear-gradient(-90deg, #03A9F4 25%, #d0f8ff 75%)!important;
            }
            .row .row:nth-of-type(3n+4) .col-md-6:nth-of-type(2) .bg-blue {
                background-image: linear-gradient(90deg, #03A9F4 25%, #d0f8ff 75%)!important;
            }*/

            /*------------------------------血条------------------------------*/
            /*
            .row .row:nth-of-type(3n+4) .col-md-6:nth-of-type(3) .bg-red {
                background-image: linear-gradient(90deg, #f3b3b3 5%, #FF5722 50%)!important;
            }
            .row .row:nth-of-type(3n+4) .col-md-6:nth-of-type(4) .bg-red {
                background-image: linear-gradient(-90deg, #f3b3b3 5%, #FF5722 50%)!important;
            }*/

            /*战斗参数*/
            p.fyg_mp0.fyg_nw.fyg_lh30 {
                position: absolute;
                top: 6px;
                z-index: 999;
                WIDTH: 97%;
            }
            p.fyg_mp0.fyg_nw.fyg_lh30.fyg_tr {
                width: 97%;
            }
            /*血量护盾文字排版*/
            .col-md-2.fyg_tc {
                position: relative;
                top: 18px;
                z-index: 999;
            }
            /*护盾字体颜色*/
            .text-blue, .text-info {
                color: #375ef1!important
            }
            /*血量字体颜色*/
            .row .row .col-md-6 .bg-red {
                color: #f6eeee;
            }
            /*进攻方技能颜色*/
            .bg-purple, .bg-special {
                background-color: #8caaffa3!important;
            }
        `);
    }else if(setting.战斗页样式更改样式2){
        addStyle(`
            /*------------------------------间距统一------------------------------*/
            /*去除间隔*/
            .row .row:nth-of-type(n) {
                margin-bottom: 0px!important;
            }
            /*将文字间距去除*/
            .fyg_pvero {
                letter-spacing: normal;
            }
            /*攻击条高度统一*/
            .row.fyg_pvero .bg-default {
                height: 20px;
            }
            /*------------------------------护盾条------------------------------*/
            .row .row:nth-of-type(n) .col-md-6:nth-of-type(1) .bg-blue {
                position: absolute;
                max-width: 99%!important;
                top: 45px;
                right: 2px;
                height: 15px!important;
                background-image: linear-gradient(-90deg, #03A9F4 25%, #c6efff  75%)!important;
            }
            .row .row:nth-of-type(n) .col-md-6:nth-of-type(2) .bg-blue {
                position: absolute;
                top: 45px;
                height: 15px!important;
                max-width: 99%!important;
                background-image: linear-gradient(90deg, #03A9F4 25%, #c6efff  75%)!important;
            }
            /*------------------------------血条------------------------------*/
            .row .row:nth-of-type(n) .col-md-6:nth-of-type(1) .bg-red {
                background-image: linear-gradient(90deg, #f3b3b3 5%, #FF5722 50%)!important;
            }
            .row .row:nth-of-type(n) .col-md-6:nth-of-type(2) .bg-red {
                background-image: linear-gradient(-90deg, #f3b3b3 5%, #FF5722 50%)!important;
            }
            /*战斗参数*/
            p.fyg_mp0.fyg_nw.fyg_lh30 {
                position: relative;
                top: 7px;
                z-index: 999;
                /* WIDTH: 97%; */
            }
            p.fyg_mp0.fyg_nw.fyg_lh30.fyg_tr {
            /* width: 97%; */
            }
            /*血量护盾文字排版*/
            .col-md-2.fyg_tc {
                position: relative;
                top: 5px;
                z-index: 999;
            }
            /*护盾字体颜色*/
            .row .row .col-md-6 .bg-blue {
                color: #375ef1;
            }
            /*血量字体颜色*/
            .row .row .col-md-6 .bg-red {
                color: #f6eeee;
            }
            /*进攻方技能颜色*/
            /*.bg-purple, .bg-special {
                background-color: #8caaffa3!important;
            }*/
        `);
    }else if(setting.战斗页样式更改样式3){
        addStyle(`
            /*------------------------------间距统一------------------------------*/
            /*去除间隔*/
            .row .row:nth-of-type(n) {
                margin-bottom: 0px!important;
            }
            /*将文字间距去除*/
            .fyg_pvero {
                letter-spacing: normal;
            }
            /*攻击条高度统一*/
            .row.fyg_pvero .bg-default {
                height: 20px;
            }
            /*------------------------------护盾条------------------------------*/
            .row .row:nth-of-type(n) .col-md-6:nth-of-type(1) .bg-blue {
                position: absolute;
                max-width: 49.8%!important;
                top: 45px;
                right: 2px;
                height: 15px!important;
                background-image: linear-gradient(-90deg, #03A9F4 25%, #c6efff  75%)!important;
            }
            .row .row:nth-of-type(n) .col-md-6:nth-of-type(2) .bg-blue {
                position: absolute;
                top: 45px;
                height: 15px!important;
                max-width: 49.8%!important;
                background-image: linear-gradient(90deg, #03A9F4 25%, #c6efff  75%)!important;
            }

            /*------------------------------血条------------------------------*/
            .row .row:nth-of-type(n) .col-md-6:nth-of-type(1) .bg-red {
                background-image: linear-gradient(90deg, #f3b3b3 5%, #FF5722 50%)!important;
            }
            .row .row:nth-of-type(n) .col-md-6:nth-of-type(2) .bg-red {
                background-image: linear-gradient(-90deg, #f3b3b3 5%, #FF5722 50%)!important;
            }
            /*战斗参数*/
            p.fyg_mp0.fyg_nw.fyg_lh30 {
                position: relative;
                top: 7px;
                z-index: 999;
                /* WIDTH: 97%; */
            }
            p.fyg_mp0.fyg_nw.fyg_lh30.fyg_tr {
            /* width: 97%; */
            }
            /*血量护盾文字排版*/
            .col-md-2.fyg_tc {
                position: relative;
                top: 5px;
                z-index: 999;
            }
            /*护盾字体颜色*/
            .row .row .col-md-6 .bg-blue {
                color: #375ef1;
            }
            /*血量字体颜色*/
            .row .row .col-md-6 .bg-red {
                color: #f6eeee;
            }
            /*进攻方技能颜色*/
            /*.bg-purple, .bg-special {
                background-color: #8caaffa3!important;
            }*/
            /*------------------------------将血量与护盾宽度放大两倍------------------------------*/
            .row.fyg_pvero {
                position: relative;
                height: 81px;
            }
            .row.fyg_pvero .col-md-6:nth-of-type(2n-1) {
                position: absolute;
                width: 100%;
                right: 50%;
            }
            .row.fyg_pvero .col-md-6:nth-of-type(2n) {
                position: absolute;
                width: 100%;
                left: 50%;
            }
            /*进攻条修正*/
            .row.fyg_pvero.fyg_bodanger.hl-danger p.bg-default {
                width: 50%;
                float: right;
                right: 0px;
            }
            .row.fyg_pvero.fyg_bodanger.hl-danger p.fyg_tr.fyg_nw {
                clear: both;
            }
            .row.fyg_pvero.fyg_boinfo.hl-info p.bg-default {
                width: 50%;
            }
        `);
    }
}

/*等级换算历史数据*/

// /**
//  * 等级转换
//  * @param o 原等级
//  * @param q 品质
//  * @return {string}
//  */
// function ConversionLevel(o, q) {
//     const BIT = setting.保留小数位;
//     const ACTUAL = setting.实际属性点计算;
//     var point = (6 + o * 3) * (1 + q / 100);
//     if (ACTUAL) {
//         point = Math.floor(point);
//     }
//     return ((point - 6) / 3).toFixed(BIT);
// }

// setInterval(() => {
//     const ORIGINAL = setting.保留原等级;
//     var str = /fyg_equip\.php/i;
//     if (str.test(window.location.href) && setting.等级换算) {
//         var cardInformation = document.getElementsByClassName("text-info fyg_f24")[0]
//             .getElementsByClassName("pull-right")[0];
//         if (cardInformation.getAttribute("flag") == null) {
//             var url = document.getElementsByClassName("text-info fyg_tr")[0];
//             var array = url.innerText.match(/\d+/g);
//             var maxRank = ConversionLevel(array[1], array[0]);
//             url.innerText += " 相当于" + maxRank + "级";

//             var nowRank = ConversionLevel(cardInformation.innerText.match(/\d+/g)[0], array[0]);
//             if (ORIGINAL) {
//                 cardInformation.innerText += "(" + nowRank + " 级)";
//             } else {
//                 cardInformation.innerText = nowRank + " 级";
//             }
//             cardInformation.setAttribute("flag","true");
//         }
//         var otherCard = document.getElementsByClassName("btn btn-primary btn-group dropup");
//         if (otherCard.length !== 0 && otherCard[0].getElementsByClassName("row")[0].getAttribute("flag") == null) {
//             for (var j = 0; j < otherCard.length; j++) {
//                 var temp = otherCard[j].innerText;
//                 var array2 = temp.match(/\d+/g);
//                 var nowRank2=ConversionLevel(array2[0],array2[3]);
//                 var maxRank2=ConversionLevel(array2[1],array2[3]);
//                 deleteRedundantEmptyTextNodes(otherCard[j].getElementsByClassName("fyg_tl")[1]);
//                 if (ORIGINAL){
//                     otherCard[j].getElementsByClassName("col-xs-5 fyg_tl")[0].innerHTML+="<span class='fyg_f18'>("+nowRank2+"</span> 级)";
//                     otherCard[j].getElementsByClassName("fyg_tl")[1].childNodes[0].data=array2[1]+" ( "+maxRank2+" ) 最大等级";
//                 }else {
//                     otherCard[j].getElementsByClassName("col-xs-5 fyg_tl")[0].innerHTML="<span class='fyg_f18'>"+nowRank2+"</span> 级";
//                     otherCard[j].getElementsByClassName("fyg_tl")[1].childNodes[0].data=+maxRank2+" 最大等级";
//                     otherCard[j].getElementsByClassName("fyg_tl")[1].childNodes[4].data+=",已换算为等级";
//                 }
//                 otherCard[j].getElementsByClassName("row")[0].setAttribute("flag","true");
//             }
//         }
//     }
// }, 1000);

// /**
//  * 删除多余的空文本节点,为nextSibling,等节点操作一致性做准备
//  * @param elem 要优化的父节点
//  */
// function deleteRedundantEmptyTextNodes(elem) {
//     let elemList = elem.childNodes;
//     for (let i = 0; i < elemList.length; i++) {
//         /*当为文本节点并且为不可见字符时删除节点*/
//         if (elemList[i].nodeName === "#text" && /^\s+$/.test(elemList[i].nodeValue)) {
//             elem.removeChild(elemList[i])
//         }
//     }
// }

/*下为历史数据,不生效*/
/*addStyle(`
#pkcall,#closeresult {
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 10px;
    margin: 4px 10px;
    width: 100px;
    border-radius: 15px;
    -webkit-transition-duration: 0.4s;
    transition-duration: 0.4s;
    cursor: pointer;
    background-color: white;
    color: black;
    border: 2px solid #4CAF50;
}
#pkcall:hover,#closeresult:hover {
    background-color: #4CAF50;
    color: white;
}
div#result {
    line-height: 1;
    padding: 10px;
    padding-bottom: 50px;
    border: 2px solid transparent;
    border-color: #9d15f3;
    width: 100px;
    text-align: center;
    margin: 10px;
    border-radius: 10px;
    transition-duration: 1s;
}
div#result:hover {
    background-color: #2ae23894;
    border-color: #ffffff00;
}
    `);*/
/*var b= document.getElementsByClassName("panel panel-primary")[0];
b.innerHTML = "<button id='pkcall'>导出怪兽数据</button>" + b.innerHTML;
var jsjfunction=function () {
        var pk = document.getElementsByClassName("btn dropdown-toggle fyg_lh40");
        var s = "<div id='result'>";
        for (var i = 0; i < 10; ++i) {
            var temp = pk[i].innerText.trim();
            var name = temp.slice(-1);
            var lv = temp.slice(temp.indexOf("Lv") + 2, temp.lastIndexOf(" "));
            switch (name) {
                case "人": name = "MU"; break;
                case "蛛": name = "ZHU"; break;
                case "灵": name = "DENG"; break;
                case "兽": name = "SHOU"; break;
                default : alert("erreo");
            }
            var parameter=name+" "+lv;
            for (var j = 0; j <= 3; j++) {
                s += "<div>" + parameter +" "+j+ "</div>";
            }
        }
        s += "</div>";
        b.innerHTML = s+"<button id='closeresult'>清除怪兽数据</button>" + b.innerHTML;
        $("#pkcall").remove();
        $("#closeresult").click(function(){
            b.innerHTML = "<button id='pkcall'>导出怪兽数据</button>" + b.innerHTML;
            $("#pkcall").click(jsjfunction);
            $("#result").remove();
            $("#closeresult").remove();
        });
    };
$(document).ready(function() {
    $("#pkcall").click(jsjfunction);
});*/