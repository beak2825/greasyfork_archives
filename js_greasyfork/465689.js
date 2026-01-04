// ==UserScript==
// @name         彈幕裝填機
// @namespace    http://tampermonkey.net/
// @version      0.28.3
// @description  彈幕裝填機-全彈發射-非會員版-無自動跳過功能
// @author       CB_Zhang
// @match        https://ani.gamer.com.tw/animeVideo.php?sn*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465689/%E5%BD%88%E5%B9%95%E8%A3%9D%E5%A1%AB%E6%A9%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/465689/%E5%BD%88%E5%B9%95%E8%A3%9D%E5%A1%AB%E6%A9%9F.meta.js
// ==/UserScript==
 
 
(function() {
    var css = "";
    css += `.input {
    text-align: center;
    width: 90%;
 
    padding: 2%;
    margin-top: 5%;
    margin-left: 2%;
    margin-right: 4%;
    margin-bottom: 2%;
    font-size: 28px;
 
 
 
}
.danSize {
    margin-left: 1%;
    margin-right: 1%;
    width: 27%;
    margin-bottom: 1%;
    display: inline-block;
 
}
.inputColor {
 
    width: 10%;
 
 
}
.colorP {
 
    width: 20%;
 
 
}
.inputTime {
 
    width: 13%;
 
}
.inputTime_B {
 
    width: 7%;
 
 
 
}
.nowTime_B {
 
    width: 8%;
 
 
 
}
.attackTime{
    margin-left: 5%;
}
.addB {
    width: 50%;
 
}
.attack {
    margin-top: 5%;
    margin-left: 5%;
    margin-right: 1%;
    width: 90%;
    height: 80%
 
}
 
 
`
    var array = []    
 
    function addCss(dom_css) {
        let dom_html = document.getElementsByTagName("html");
        let dom_head = document.head;
        if (dom_html.length > 0) {
            dom_html[0].appendChild(dom_css);
        } else if (dom_head != null) {
            dom_head.appendChild(dom_css);
        } else {
            setTimeout(() => {
                addCss(dom_css);
            }, 10);
        }
    }
    let dom_css = document.createElement("style");
    dom_css.innerHTML = css;
    addCss(dom_css);
    document.getElementById("ani-tab-content-3").remove()
 
    var content4 = document.createElement("div");
    content4.setAttribute("id", "ani-tab-content-3");
    content4.className = "ani-tab-content__item";
    content4.setAttribute("style", "display:none");
 
    var content5 = document.createElement("div");
    content5.setAttribute("id", "ani-tab-content-4");
    content5.className = "ani-tab-content__item";
    content5.setAttribute("style", "display:none");
 
 
 
    var tabs__item3 = document.createElement("div");
    tabs__item3.className = "ani-tabs__item ";
    var a = document.createElement("a");
    a.setAttribute("href", "#ani-tab-content-3");
    a.className = "ani-tabs-link is-disabled";
    a.innerText = "建置彈幕"
    tabs__item3.appendChild(a)
 
    var tabs__item4 = document.createElement("div");
    tabs__item4.className = "ani-tabs__item ";
    var a4 = document.createElement("a");
    a4.setAttribute("href", "#ani-tab-content-4");
    a4.className = "ani-tabs-link is-disabled";
    a4.innerText = "發射彈幕"
    tabs__item4.appendChild(a4)
 
    var addB = document.createElement("button")
    addB.innerText = "新增彈幕"
    addB.setAttribute("id", "add");
    addB.setAttribute("class", "addB");
 
    var outB = document.createElement("button")
    outB.innerText = "匯出彈幕"
    outB.setAttribute("id", "out");
    outB.setAttribute("class", "addB");
 
    content4.appendChild(addB)
    content4.appendChild(outB)
 
    function newDan(type) {
 
 
        var last = document.createElement("div");
 
        var divInput = document.createElement("div");
        var divInputValue = document.createElement("input");
        divInput.setAttribute("align", "center");
 
        var count = array.length
        var tmp_name = "dan_" + count
 
        divInputValue.setAttribute("id", tmp_name);
        divInputValue.className = "input";
        divInput.appendChild(divInputValue);
 
        var divSize = document.createElement("div");
        divSize.className = "danSize";
 
        var tmp_radio = "radio_" + count
        var big = document.createElement("input")
        big.setAttribute("type", "radio")
        big.setAttribute("name", tmp_radio)
        big.setAttribute("value", 28);
        big.setAttribute("class", "radio");
        big.setAttribute("id", tmp_radio + "-2");
        big.setAttribute("checked", "1");
        var mid = document.createElement("input")
        mid.setAttribute("type", "radio")
        mid.setAttribute("name", tmp_radio)
        mid.setAttribute("value", 24);
        mid.setAttribute("class", "radio");
        mid.setAttribute("id", tmp_radio + "-1");
        var small = document.createElement("input")
        small.setAttribute("type", "radio")
        small.setAttribute("name", tmp_radio)
        small.setAttribute("value", 16);
        small.setAttribute("class", "radio");
        small.setAttribute("id", tmp_radio + "-0");
 
        var big_L = document.createElement("label")
        big_L.setAttribute("for", tmp_radio);
        var mid_L = document.createElement("label")
        mid_L.setAttribute("for", tmp_radio);
        var small_L = document.createElement("label")
        small_L.setAttribute("for", tmp_radio);
        big_L.innerText = "大"
        mid_L.innerText = "中"
        small_L.innerText = "小"
 
        divSize.appendChild(big);
        divSize.appendChild(big_L);
        divSize.appendChild(mid);
        divSize.appendChild(mid_L);
        divSize.appendChild(small);
        divSize.appendChild(small_L);
 
        var typeI = document.createElement("select")
        typeI.setAttribute("class", "typeP");
        typeI.setAttribute("id", "typePackage_" + count);
 
        var type2 = document.createElement("option")
        type2.setAttribute("value", 2);
        type2.innerText = "下"
        var type1 = document.createElement("option")
        type1.setAttribute("value", 1);
        type1.innerText = "上"
 
        var type0 = document.createElement("option")
        type0.setAttribute("value", 0);
        type0.innerText = "滾"
 
        typeI.appendChild(type2)
        typeI.appendChild(type1)
        typeI.appendChild(type0)
 
        var colorT = document.createElement("p1")
        colorT.innerText = "色碼"
 
        var tmp_color = "color_" + count
        var colorI = document.createElement("select")
        colorI.setAttribute("class", "colorP");
        colorI.setAttribute("id", "colorPackage_" + count);
 
        var color0 = document.createElement("option")
        color0.setAttribute("id", tmp_color + "-0");
        color0.setAttribute("class", "inputColor");
        color0.setAttribute("value", "#FFFFFF");
        color0.innerText = "#FFFFFF"
        color0.style.background = "#FFFFFF"
 
        var color1 = document.createElement("option")
        color1.setAttribute("value", "#FDE53D");
        color1.innerText = "#FDE53D"
        color1.style.background = "#FDE53D"
 
        var color2 = document.createElement("option")
        color2.setAttribute("value", "#FF0026");
        color2.innerText = "#FF0026"
        color2.style.background = "#FF0026"
 
        var color3 = document.createElement("option")
        color3.setAttribute("value", "#00C3FC");
        color3.innerText = "#00C3FC"
        color3.style.background = "#00C3FC"
 
        var color4 = document.createElement("option")
        color4.setAttribute("value", "#A7FE39");
        color4.innerText = "#A7FE39"
        color4.style.background = "#A7FE39"
 
        var color5 = document.createElement("option")
        color5.setAttribute("value", "#B538FA");
        color5.innerText = "#B538FA"
        color5.style.background = "#B538FA"
 
        var color6 = document.createElement("option")
        color6.setAttribute("value", "#BEBEBE");
        color6.innerText = "#BEBEBE"
        color6.style.background = "#BEBEBE"
 
        var color7 = document.createElement("option")
        color7.setAttribute("value", "#FF9625");
        color7.innerText = "#FF9625"
        color7.style.background = "#FF9625"
 
        var color8 = document.createElement("option")
        color8.setAttribute("value", "#FF9496");
        color8.innerText = "#FF9496"
        color8.style.background = "#FF9496"
 
        var color9 = document.createElement("option")
        color9.setAttribute("value", "#0036FA");
        color9.innerText = "#0036FA"
        color9.style.background = "#0036FA"
 
        var color10 = document.createElement("option")
        color10.setAttribute("value", "#00FF91");
        color10.innerText = "#00FF91"
        color10.style.background = "#00FF91"
 
        var color11 = document.createElement("option")
        color11.setAttribute("value", "#FF02D3");
        color11.innerText = "#FF02D3"
        color11.style.background = "#FF02D3"
 
        colorI.appendChild(color0)
        colorI.appendChild(color1)
        colorI.appendChild(color2)
        colorI.appendChild(color3)
        colorI.appendChild(color4)
        colorI.appendChild(color5)
        colorI.appendChild(color6)
        colorI.appendChild(color7)
        colorI.appendChild(color8)
        colorI.appendChild(color9)
        colorI.appendChild(color10)
        colorI.appendChild(color11)
        //#FDE53D
        //#FF0026
        //#00C3FC
        //#A7FE39
        //#B538FA
        //#BEBEBE
        //#FF9625
        //#FF9496
        //#0036FA
        //#00FF91
        //#FF02D3
        var timeT = document.createElement("p1")
        timeT.innerText = "時間"
 
        var timeI = document.createElement("input")
        var tmp_time = "time_" + count
        timeI.setAttribute("id", tmp_time);
        timeI.setAttribute("class", "inputTime");
        timeI.setAttribute("placeholder", "毫秒")
 
        var timeB = document.createElement("button")
        timeB.innerText = "go"
        var tmp_time_B = "timeB_" + count
        timeB.setAttribute("id", tmp_time_B);
        timeB.setAttribute("class", "inputTime_B");
 
        var timeNowB = document.createElement("button")
        timeNowB.innerText = "Now"
        var tmp_timeNow_B = "timeNowB_" + count
        timeNowB.setAttribute("id", tmp_timeNow_B);
        timeNowB.setAttribute("class", "nowTime_B");
 
        content4.appendChild(divInput)
        content4.appendChild(divSize)
        content4.appendChild(typeI)
        //content4.appendChild(colorT)
        content4.appendChild(colorI)
        content4.appendChild(timeT)
        content4.appendChild(timeI)
        content4.appendChild(timeB)
        content4.appendChild(timeNowB)
 
        array.push(1)
    }
    newDan()
    standBy()
 
    document.getElementsByClassName("ani-tab-content")[0].appendChild(content4)
    document.getElementsByClassName("ani-tab-content")[0].appendChild(content5)
    document.getElementsByClassName("sub_top ani-tabs")[0].appendChild(tabs__item3)
    document.getElementsByClassName("sub_top ani-tabs")[0].appendChild(tabs__item4)
 
    function again() {
 
        $(".ani-tabs-link").click(function() {
            $(".ani-tabs-link.is-active").removeClass("is-active");
            $(this).addClass("is-active");
            $(".ani-tab-content__item").css("display", "none");
            $($(this).attr("href")).css("display", "block");
            return false
        });
 
    }
    again()
 
 
    inputListener();
    sizeListener();
    timeListener()
    addtListener()
    attacktListener()
    //adultListener()
  
 
    function addtListener() {
 
        var add = document.getElementById("add");
        add.addEventListener('click', function() {
 
            newDan(0)
            inputListener();
            sizeListener();
            timeListener()
        });
        var out = document.getElementById("out");
        out.addEventListener('click', function() {
            create()
        });
    }
 
    function inputListener() {
 
        var classname = document.querySelectorAll(".colorP")
        for (var i = 0; i < classname.length; i++) {
 
            
            classname[i].addEventListener('change', function() {
 
                var vid = this.id;
                
 
                updateValue(vid);
            });
        }
    }
 
    function adultListener() {
 
        var adu = document.body
        adu.addEventListener('mousemove', function() {
 
                try{
                    var aduB = document.getElementById("adult")
 
                    aduB.click()
                    adu.removeEventListener("mousemove",function(){});
                    
                }
                catch{
 
                }
 
            });
    }
 
 
 
    function sizeListener() {
        var classname = document.querySelectorAll(".radio")
        for (var i = 0; i < classname.length; i++) {
            classname[i].addEventListener('click', function() {
 
                var vid = this.id;
 
                updateSize(vid);
            });
        }
    }
 
    function timeListener() {
 
        var classname = document.querySelectorAll(".inputTime_B")
        for (var i = 0; i < classname.length; i++) {
            classname[i].addEventListener('click', function() {
 
                var vid = this.id;
 
                jumpTime(vid);
            });
        }
         var classname2 = document.querySelectorAll(".nowTime_B")
        for (var j = 0; j < classname2.length; j++) {
            classname2[j].addEventListener('click', function() {
 
                var vid = this.id;
 
                setTime(vid);
            });
        }
 
        var go = document.getElementById("time_B");
         go.addEventListener('click', function() {
             jumpAttackTime();
        });
        var now = document.getElementById("timeNowS_B");
        now.addEventListener('click', function() {
 
        var video = document.getElementById("ani_video_html5_api");
        var input = document.getElementById("attackTime");
 
        input.value=parseInt(video.currentTime*10)
 
        });
 
    }
 
    function updateValue(e) {
 
 
        var ele = document.getElementById(e)
        var tmp = ele.value
        var id = e.split('_');
        var name = "dan_" + id[1]
        var text = document.getElementById(name);
        text.style.color = tmp;
    }
 
 
 
    function updateSize(e) {
 
        var ele = document.getElementById(e)
        
        var id = e.split('-');
        var size = ele.value + "px"
        id = id[0].split('_')
        var name = "dan_" + id[1]
        var text = document.getElementById(name);
        text.style.fontSize = size;
        
    }
 
    function jumpTime(e) {
 
        var ele = document.getElementById(e)
 
        var id = e.split('_');
        var name = "dan_" + id[1]
        var text = document.getElementById(name);
        var video = document.getElementById("ani_video_html5_api");
        var time = document.getElementById("time_" + id[1]);
        video.currentTime = time.value / 10;
        
        video.play();
 
 
    }
    function setTime(e) {
 
        var id = e.split('_');
 
 
        var video = document.getElementById("ani_video_html5_api");
        var input = document.getElementById("time_" + id[1]);
 
        input.value=parseInt(video.currentTime*10)
 
 
 
    }
    function jumpAttackTime() {
 
        var time = document.getElementById("attackTime")
        var video = document.getElementById("ani_video_html5_api");
        video.currentTime = time.value / 10;
        video.play();
    }
 
    function create() {
        var json = []
        for (var i = 0; i < array.length; i++) {
            var ele = document.getElementById("dan_" + i)
            var eleTime = document.getElementById("time_" + i)
            var eleColor = document.getElementById("colorPackage_" + i)
            var style = window.getComputedStyle(ele, null).getPropertyValue('font-size');
            var text = ele.value
            var fontSize = parseFloat(style);
            var eleType = document.getElementById("typePackage_" + i)
            var type = parseInt(eleType.value)
            
 
            var color = eleColor.value
            var time = parseInt(eleTime.value)
            var params = new URLSearchParams(document.location.search);
            var sn = parseInt(params.get("sn"))
            var size
            if (fontSize == 16) {
                size = 0
            } else if (fontSize == 24) {
                size = 1
            } else {
                size = 2
            }
            var tmp = {"size": size, "content": text, "position": type, "time": time, "color": color }
            json.push(tmp)
 
 
        }
        downloadObjectAsJson(json, sn)
 
 
    }
 
    function downloadObjectAsJson(exportObj, exportName) {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
 
    function standBy() {
        var divInput = document.createElement("div");
        var divInputValue = document.createElement("input");
        divInput.setAttribute("align", "center");
        divInputValue.setAttribute("id", "attackText");
        divInputValue.className = "input";
        divInputValue.setAttribute("placeholder", "請貼上匯出內容")
        divInput.appendChild(divInputValue);
 
        var timeT = document.createElement("p1")
        timeT.innerText = "第一句彈幕時間"
        timeT.setAttribute("class", "attackTime")
 
        var timeI = document.createElement("input")
        timeI.setAttribute("id", "attackTime");
        timeI.setAttribute("class", "inputTime");
        timeI.setAttribute("placeholder", "毫秒")
 
        var timeB = document.createElement("button")
        timeB.innerText = "go"
 
        timeB.setAttribute("id", "time_B");
        timeB.setAttribute("class", "inputTime_B_1");
 
        var timeNowB = document.createElement("button")
        timeNowB.innerText = "Now"
 
        timeNowB.setAttribute("id", "timeNowS_B");
        timeNowB.setAttribute("class", "nowTime_B");
 
 
        var attack = document.createElement("button")
        attack.innerText = "全彈發射!!"
 
        attack.setAttribute("id", "attack");
        attack.setAttribute("class", "attack");
        attack.style.fontSize = "60px";
        content5.appendChild(divInput)
        content5.appendChild(timeT)
        content5.appendChild(timeI)
        content5.appendChild(timeB)
        content5.appendChild(timeNowB)
        content5.appendChild(attack)
 
    }
 
    function attacktListener() {
 
        var attack = document.getElementById("attack");
        attack.addEventListener('click', function() {
            var ele = document.getElementById("attackText")
            var eleTime = document.getElementById("attackTime")
            var text = ele.value
            var time = eleTime.value
 
            try {
                text = JSON.parse(text)
 
            } catch (e) {
                text = []
            }
 
            if (text.length > 0) {
 
                if (text[0].time == time) {
                    nuke(text)
                } else if (text[0].time < time) {
 
                    process(time - text[0].time, text) //20-10 慢10秒+10秒
                } else {
                    process(time - text[0].time, text) //10-20 快10秒+(-10)秒
                }
            }
 
        });
    }
 
    async function nuke(text) {
        console.log("attack")
        var ele = document.getElementById("attack")
        ele.innerText = "處理中"
        for (var i = 0; i < text.length; i++) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", "https://ani.gamer.com.tw/ajax/getCSRFToken.php?_=" + Date.now(), false); // false for synchronous request
            xmlHttp.send(null);
            var result = xmlHttp.responseText;
 
            var params = new URLSearchParams(document.location.search);
            var sn = parseInt(params.get("sn"))
 
            jQuery.ajax({ url: "/ajax/danmuSet.php", data: { sn: sn, content: text[i].content, color: text[i].color, position: text[i].position, size: text[i].size, time: text[i].time, token: result }, method: "POST", dataType: "json" })
 
            console.log('Sleeping…');
            await sleep(5000);
            console.log('Awake…')
        }
        ele.innerText = "發射完畢"
        //https://ani.gamer.com.tw/ajax/getCSRFToken.php?_=1683382765219
    }
 
    function process(type, text) {
        console.log("process")
 
        for (var i = 0; i < text.length; i++) {
            text[i].time += type
        }
        nuke(text)
    }
 
    function sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
 
 
 
  
 
 
})();