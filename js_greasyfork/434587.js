// ==UserScript==
// @name         便捷背诵
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  古诗文网背诵辅助
// @author       Pikaqian
// @license      =)
// @match        https://so.gushiwen.cn/*
// @match        https://www.gushiwen.cn/*
// @icon         data:image/jpeg;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434587/%E4%BE%BF%E6%8D%B7%E8%83%8C%E8%AF%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/434587/%E4%BE%BF%E6%8D%B7%E8%83%8C%E8%AF%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let style = document.createElement('style')
    var id_box=["tag_","text_","block_"]

    document.body.appendChild(style);
    style.textContent=`
    #black{
    position:fixed;
    height:100%;
    width:100%;
    background-color:#000;
    opacity:0;
    top:0px;
    left:0px;
    display:none;
    cursor:pointer;
    transition: 0.5s;
    }

    #text{
    position: fixed;
    height: 100%;
    width: 210px;
    background-color: #f0efe2;
    left: -220px;
    top: 0px;
    transition: 0.2s;
    overflow:auto;
    z-index:2;
    }::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:rgba(117,117,117,0.7);}

    #content{
    font-size:14px;
    background-color:none;
    position:fixed;
    cursor:pointer;
    top:0px;
    left:30px;
    display:none;
    }

    #button{
    height:15px;
    width:40px;
    border-bottom-right-radius:21px;
    border-top-right-radius:21px;
    color:#fff;
    padding:6px;
    opacity:.20;
    left:-35px;
    cursor:pointer;
    transform-origin:0px 17px;
    transition: 0.2s;
    position:fixed;
    z-index:2;
    font-size:14px;
    top:38%;
    background:#000
    }
    .Button{
    height:15px;
    width:40px;
    border-bottom-right-radius:21px;
    border-top-right-radius:21px;
    color:#fff;
    padding:6px;
    opacity:.20;
    left:-35px;
    cursor:pointer;
    transform-origin:0px 17px;
    transition: 0.2s;
    position:fixed;
    z-index:2;
    font-size:14px;
    background:#000
    }

    .tag{
    top: 30px;
    left: -220px;
    z-index: 1;
    width: 60px;
    height: 60px;
    position: fixed;
    border-radius: 10px;
    transition: 0.2s;
    cursor:pointer;
    }

    .block_text{
    top: 30px;
    left: -220px;
    z-index: 1;
    width: 60px;
    height: 60px;
    position: fixed;
    border-radius: 10px;
    transition: 0.2s;
    cursor:pointer;
    }

    .inText{
    top: 35px;
    position: fixed;
    left: -178px;
    color: white;
    line-height: 23px;
    transition: 0.2s;
    z-index:1;
    cursor:pointer;
    text-align: right;
    }
    `

    function setCookie(cname,cvalue,exdays){//设置cookie
        var cookie_all=cname
        /*
        for(var i=0;i<20;i++){
            cookie_all=cookie_all+"1"
        }
        */
        //exdays=-1
        if(exdays!=-1){
            var d = new Date();
            d.setTime(d.getTime()+(exdays*24*60*60*1000));
            var expires = "expires="+d.toGMTString();
            cookie_all=cname+"="+cvalue+"; "+expires+";path=/"
        }
        else{
            cookie_all=cname+"="+cvalue+"; "+exdays+";path=/"
        }
        document.cookie = cookie_all;
    }
    //————————————————————————————————调取cookie
    function getCookie(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0){
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }


    function addText(fontColor,k,text,href){//内容添加函数
        var num=document.getElementsByClassName("content").length
        var content=document.createElement("content"+num)
        content.innerText=text
        content.id="content"
        content.className="content"
        content.href=href
        content.style.top=num*30+"px"
        if(fontColor[k]=="1"){
            content.style.color="#f00"
        }
        if(fontColor[k]=='2'){
            content.style.color="rgb(0 173 255)"
        }
        document.getElementById("text").appendChild(content)
    }

    var check=0//0为尚未展开，将要展开；1为已经展开，将要合上
    document.body.appendChild(style)

    var text=document.createElement("text")
    text.id="text"
    document.body.appendChild(text)

    // var button=document.createElement("a")
    // button.id="button"
    // document.body.appendChild(button)
    if(document.getElementById("button")==null){
        var button = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path13 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        button.setAttribute("aria-hidden","true");
        button.setAttribute('viewbox', '0 0 24 24');
        button.setAttribute('width', '24px');
        button.setAttribute('height', '24px');
        path13.setAttribute('d','M423.1984 640a83.84 83.84 0 0 1-64-28.8 259.84 259.84 0 0 1-26.88-308.48L441.1184 128a261.12 261.12 0 1 1 448 272l-35.2 57.6a83.84 83.84 0 1 1-145.92-90.24l35.2-57.6a92.8 92.8 0 0 0-158.72-96.64L476.9584 389.76a92.8 92.8 0 0 0 9.6 109.44 83.84 83.84 0 0 1-64 139.52zM357.9184 1024A261.12 261.12 0 0 1 135.1984 626.56L166.5584 576a83.84 83.84 0 1 1 144 87.68l-31.36 51.2a92.8 92.8 0 0 0 30.72 128 91.52 91.52 0 0 0 70.4 10.88 92.16 92.16 0 0 0 57.6-41.6L545.4384 634.24a93.44 93.44 0 0 0-6.4-105.6A83.84 83.84 0 1 1 673.4384 424.96a262.4 262.4 0 0 1 17.28 296.96L581.2784 896A259.84 259.84 0 0 1 417.4384 1016.32a263.68 263.68 0 0 1-59.52 7.68z')
        path13.style.transform="scale(0.0124) translate(2250px, -43px) rotate(17deg)"
        path13.setAttribute('fill','#fff');
        button.appendChild(path13);
        button.id = 'button';
        document.body.appendChild(button);
    }

    var div=document.createElement("div")
    div.id="div_all"
    document.body.appendChild(div)



    var tag=document.createElement("a")//全部
    tag.className="tag"
    tag.id="tag_all"
    tag.style.backgroundColor="rgb(210,210,210)"

    var text_all=document.createElement("b")
    text_all.className="inText"
    text_all.id="text_all"
    text_all.innerText="全\n部"

    var block_all=document.createElement("c")
    block_all.id="block_all"
    block_all.className="block_text"
    block_all.opacity=0

    document.getElementById("div_all").appendChild(tag)
    document.getElementById("div_all").appendChild(text_all)
    document.getElementById("div_all").appendChild(block_all)


    var tag_12=document.createElement("a")//12月
    tag_12.className="tag"
    tag_12.id="tag_12"
    tag_12.style.top="58px"
    tag_12.style.backgroundColor="rgb(195,195,195)"

    var text_12=document.createElement("b")
    text_12.className="inText"
    text_12.id="text_12"
    text_12.style.top="63px"
    text_12.innerText="12\n月"

    var block_12=document.createElement("c")
    block_12.id="block_12"
    block_12.className="block_text"
    block_12.style.top="58px"
    block_12.opacity=0

    document.getElementById("div_all").appendChild(tag_12)
    document.getElementById("div_all").appendChild(text_12)
    document.getElementById("div_all").appendChild(block_12)



    var tag_11=document.createElement("a")//11月
    tag_11.className="tag"
    tag_11.id="tag_11"
    tag_11.style.top="86px"
    tag_11.style.backgroundColor="rgb(180,180,180)"

    var text_11=document.createElement("b")
    text_11.className="inText"
    text_11.id="text_11"
    text_11.style.top="91px"
    text_11.innerText="11\n月"

    var block_11=document.createElement("c")
    block_11.id="block_11"
    block_11.className="block_text"
    block_11.style.top="86px"
    block_11.opacity=0

    document.getElementById("div_all").appendChild(tag_11)
    document.getElementById("div_all").appendChild(text_11)
    document.getElementById("div_all").appendChild(block_11)


    var tag_10=document.createElement("a")//10月
    tag_10.className="tag"
    tag_10.id="tag_10"
    tag_10.style.top="114px"
    tag_10.style.backgroundColor="rgb(165,165,165)"

    var text_10=document.createElement("b")
    text_10.className="inText"
    text_10.id="text_10"
    text_10.style.top="119px"
    text_10.innerText="10\n月"

    var block_10=document.createElement("c")
    block_10.id="block_10"
    block_10.className="block_text"
    block_10.style.top="114px"
    block_10.opacity=0

    document.getElementById("div_all").appendChild(tag_10)
    document.getElementById("div_all").appendChild(text_10)
    document.getElementById("div_all").appendChild(block_10)


    var tag_9=document.createElement("a")//9月
    tag_9.className="tag"
    tag_9.id="tag_9"
    tag_9.style.top="142px"
    tag_9.style.backgroundColor="rgb(150,150,150)"

    var text_9=document.createElement("b")
    text_9.className="inText"
    text_9.id="text_9"
    text_9.style.top="147px"
    text_9.innerText="9\n月"

    var block_9=document.createElement("c")
    block_9.id="block_9"
    block_9.className="block_text"
    block_9.style.top="142px"
    block_9.opacity=0

    document.getElementById("div_all").appendChild(tag_9)
    document.getElementById("div_all").appendChild(text_9)
    document.getElementById("div_all").appendChild(block_9)

    /*     var tag_mis=document.createElement("a")//9月
    tag_mis.className="tag"
    tag_mis.id="tag_mis"
    tag_mis.style.top="170px"
    tag_mis.style.backgroundColor="rgb(130, 130, 130)"

    var text_mis=document.createElement("b")
    text_mis.className="inText"
    text_mis.id="text_mis"
    text_mis.style.top="175px"
    text_mis.innerText="9\n月"

    var block_mis=document.createElement("c")
    block_mis.id="block_mis"
    block_mis.className="block_text"
    block_mis.style.top="170px"
    block_mis.opacity=0

    document.getElementById("div_all").appendChild(tag_mis)
    document.getElementById("div_all").appendChild(text_mis)
    document.getElementById("div_all").appendChild(block_mis) */


    var text_inner=[
        "","",
        "————古文————","",
        "赤壁赋","https://so.gushiwen.cn/shiwenv_4cac23b07849.aspx",
        "答司马谏议书","https://so.gushiwen.cn/shiwenv_b09aa5c9b747.aspx",
        "登泰山记","https://so.gushiwen.cn/shiwenv_8bf5847fffd5.aspx",
        "阿房宫赋","https://so.gushiwen.cn/shiwenv_0456af8aceec.aspx",
        "六国论","https://so.gushiwen.cn/shiwenv_077582755824.aspx",
        "谏太宗十思疏","https://so.gushiwen.cn/shiwenv_3827a21544f0.aspx",
        "劝学","https://so.gushiwen.cn/shiwenv_9b5ed8061abe.aspx",
        "师说","https://so.gushiwen.cn/shiwenv_178197fd7202.aspx",
        "侍坐","https://so.gushiwen.cn/shiwenv_736e296de7fd.aspx",
        "石钟山记","https://so.gushiwen.cn/shiwenv_c72161f552bb.aspx",
        "陈情表","https://so.gushiwen.cn/shiwenv_f84986dafb2d.aspx",
        "项脊轩志","https://so.gushiwen.cn/shiwenv_a8fb4f01b418.aspx",
        "屈原列传","https://so.gushiwen.cn/shiwenv_573d6514abc4.aspx",
        "论语十二章","https://so.gushiwen.cn/shiwenv_48479bc1dedf.aspx",
        "归去来兮辞","https://so.gushiwen.cn/shiwenv_987458864738.aspx",
        "过秦论","https://so.gushiwen.cn/shiwenv_166993e31db3.aspx",
        "五代史伶官传序","https://so.gushiwen.cn/shiwenv_6cd4e529af11.aspx",
        "种树郭橐驼传","https://so.gushiwen.cn/shiwenv_0595b5ed9fb4.aspx",
        "————诗词————","",
        "登高","https://so.gushiwen.cn/shiwenv_eeb217f8cb2d.aspx",
        "登岳阳楼","https://so.gushiwen.cn/shiwenv_c05fb9a17f71.aspx",
        "短歌行","https://so.gushiwen.cn/shiwenv_35000de73cdb.aspx",
        "归园田居","https://so.gushiwen.cn/shiwenv_a537ff195683.aspx",
        "桂枝香·金陵怀古","https://so.gushiwen.cn/shiwenv_17a86f6c536a.aspx",
        "念奴娇·赤壁怀古","https://so.gushiwen.cn/shiwenv_5fb51378286c.aspx",
        "念奴娇·过洞庭","https://so.gushiwen.cn/shiwenv_8d26eae2cfdf.aspx",
        "梦游天姥吟留别","https://so.gushiwen.cn/shiwenv_05e2f6fc757c.aspx",
        "琵琶行","https://so.gushiwen.cn/shiwenv_0581b0ba8bb4.aspx",
        "鹊桥仙·纤云弄巧","https://so.gushiwen.cn/shiwenv_e83cadaaf394.aspx",
        "涉江采芙蓉","https://so.gushiwen.cn/shiwenv_c72d94b49cc6.aspx",
        "声声慢","https://so.gushiwen.cn/shiwenv_f82821b9d569.aspx",
        "诗经·静女","https://so.gushiwen.cn/shiwenv_87e447468c9e.aspx",
        "蜀相","https://so.gushiwen.cn/shiwenv_625762a4b089.aspx",
        "永遇乐·京口北固亭怀古","https://so.gushiwen.cn/shiwenv_12e69f000057.aspx",
        "虞美人·春花秋月何时了","https://so.gushiwen.cn/shiwenv_3574610d74e0.aspx",
        "拟行路难·其四","https://so.gushiwen.cn/shiwenv_5261df279f62.aspx",
        "无衣","https://so.gushiwen.cn/shiwenv_4830155d39b2.aspx",
        "春江花月夜","https://so.gushiwen.cn/shiwenv_3aed26d1fa99.aspx",
        "离骚","https://so.gushiwen.cn/shiwenv_f5714bcd33e3.aspx",
        "蜀道难","https://so.gushiwen.cn/shiwenv_d59ec5d6c91c.aspx",
        "将进酒","https://so.gushiwen.cn/shiwenv_ee16df5673bc.aspx",
        "燕歌行","https://so.gushiwen.cn/shiwenv_4c7868ec4409.aspx",
        "客至","https://so.gushiwen.cn/shiwenv_2dfd92e6cd5b.aspx",
        "锦瑟","https://so.gushiwen.cn/shiwenv_1921957e6e83.aspx",
        "书愤","https://so.gushiwen.cn/shiwenv_7c14409ca751.aspx",
        "扬州慢","https://so.gushiwen.cn/shiwenv_a8062138a414.aspx",
        "望海潮","https://so.gushiwen.cn/shiwenv_a52ca0ee5a22.aspx",
        "江城子","https://so.gushiwen.cn/shiwenv_567fcf6ffefb.aspx",
        "登快阁","https://so.gushiwen.cn/shiwenv_8545428012cd.aspx",
        "李凭箜篌引","https://so.gushiwen.cn/shiwenv_77b08ab3153f.aspx",
        "临安春雨初霁","https://so.gushiwen.cn/shiwenv_0ccd54b5b58a.aspx"
    ]
    // console.log(text_inner.length/2)

    function color_cookie(text){
        for(var w=0;w<text_inner.length;w++){
            if(text_inner[w]==text){
                return (w/2)
            }
        }
    }
    function asideOpen(){
        var fontColor=getCookie("remember").split(",")
        document.getElementById("text").innerHTML=""
        if(getCookie("change")=="all"){//全部
            var p=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52]
            }
        /*         else if(getCookie("change")=="12"){//12月
            p=[0,1,12,13,14,15,17,31,34,35,36,37,38,39,40,41,42,43]
        } */
        else if(getCookie("change")=="12"){
            p=[0, 1, 12, 13, 14, 15, 20, 34, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]
            // p=[0,1,12,13,14,15,18,32,35,36,37,38,39,40,41,42,43,44]
            //['论语十二章','屈原列传','项脊轩志','陈情表','蜀相','客至','离骚','无衣','拟行路难','春江花月夜','锦瑟','书愤','蜀道难','将进酒','燕歌行']
        }
        else if(getCookie("change")=="11"){//11月
            p=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36]
            // p=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34]
            //['师说','赤壁赋','登泰山记','侍坐','谏太宗十思疏','阿房宫赋','六国论','劝学','短歌行','归园田居','梦游天姥吟留别','登高','琵琶行','念奴娇·赤壁怀古','永遇乐','声声慢','静女','涉江采芙蓉','虞美人','鹊桥仙','登岳阳楼','桂枝香','念奴娇·过洞庭','答司马谏议书']
        }
        else if(getCookie("change")=="10"){//10月
            p=[0, 1, 2, 3, 4, 7, 8, 9, 10, 20, 21, 23, 24, 26, 28, 29]
            // p=[0,1,2, 3, 4, 7, 8, 9, 10, 18, 19, 21, 22, 24, 26, 27, 33]
            //['师说','赤壁赋','登泰山记','侍坐','谏太宗十思疏','答司马谏议书','劝学','短歌行','归园田居','梦游天姥吟留别','登高','琵琶行','念奴娇·赤壁怀古']
        }
        else if(getCookie("change")=="9"){//9月
            p=[0, 1, 2, 8, 9, 12, 16, 20, 24, 34, 35, 36, 41]
            // p=[0, 1, 2, 8, 9, 12, 16, 18, 22, 32, 33, 34, 39]
            //['劝学','陈情表','师说','赤壁赋','归去来兮辞','归园田居','蜀道难','蜀相','虞美人','永遇乐']
        }
        var counting=0
        for(var k=0;k<text_inner.length/2;k++){
            if(k==p[counting]){
                addText(fontColor,k,text_inner[k*2],text_inner[k*2+1])
                counting++
            }
        }
        var content=document.getElementsByClassName("content")
        if(check==0){
            text.style.transform="translate(220px,0px)"
            for(var i=0;i<content.length;i++){
                content[i].style.display="block"
            }
            document.getElementById("black").style.display="block"
            setTimeout(function () {
                document.getElementById("black").style.opacity="0.3"
            }, 0.1);
            for(var o=0;o<document.getElementsByClassName("tag").length;o++){
                document.getElementsByClassName("tag")[o].style.left="170px"
                document.getElementsByClassName("block_text")[o].style.left="170px"
                document.getElementsByClassName("inText")[o].style.left="212px"
            }
            var change_first=document.getElementById(id_box[0]+getCookie("change"))
            for(var y=0;y<3;y++){
                if(y==1){
                    var leftPx="232px"
                    }
                else{
                    leftPx="190px"
                }
                document.getElementById(id_box[y]+getCookie("change")).style.left=leftPx
            }
            check=1
        }
        else if(check==1){
            text.style.transform="translate(0px,0px)"
            document.getElementById("black").style.opacity="0"
            setTimeout(function () {
                document.getElementById("black").style.display="none"
            }, 300);
            for(o=0;o<document.getElementsByClassName("tag").length;o++){
                document.getElementsByClassName("tag")[o].style.left="-220px"
                document.getElementsByClassName("block_text")[o].style.left="-220px"
                document.getElementsByClassName("inText")[o].style.left="-220px"
            }
            check=0
        }
    }

    if(getCookie("remember")==""){//设置初始cookie
        var cookie_text=""
        for(var t=0;t<text_inner.length/2;t++){
            cookie_text=cookie_text+"0,"
        }
        setCookie("remember",cookie_text,365)
    }
    if(getCookie("change")==""){
        setCookie("change","all",365)
    }


    var black=document.createElement("black")
    black.id="black"
    document.body.appendChild(black)


    button.addEventListener('mouseenter',function(e){
        button.style.transform="translate(15px,0px)"
    })
    button.addEventListener('mouseleave',function(e){
        button.style.transform="translate(0px,0px)"
    })
    button.addEventListener('click',function(e){
        asideOpen()
    })
    document.getElementById("black").addEventListener('click',function(e){
        text.style.transform="translate(0px,0px)"
        document.getElementById("black").style.opacity="0"
        setTimeout(function () {
            document.getElementById("black").style.display="none"
        }, 300);
        for(var o=0;o<document.getElementsByClassName("tag").length;o++){
            document.getElementsByClassName("tag")[o].style.left="-220px"
            document.getElementsByClassName("block_text")[o].style.left="-220px"
            document.getElementsByClassName("inText")[o].style.left="-220px"
        }
        check=0
    })
    window.addEventListener('click',function(e){
        if(e.target.id=="content"&&e.target.href!=""){
            if(e.ctrlKey==true){
                var open="_blank"
                }
            else{
                open="_self"
            }
            //alert(e.target.href)
            window.open(e.target.href,open)
        }
    })
    window.addEventListener('contextmenu',function(e){
        if(e.ctrlKey!=true){
            if(e.target.id=="content"&&e.target.href!=""){
                if(e.target.style.color=="rgb(0, 0, 0)"||e.target.style.color==""){
                    e.target.style.color="#f00"
                    var fontColor=getCookie("remember").split(",")
                    var text_num=color_cookie(e.target.innerText)
                    fontColor[text_num]="1"
                    var cookie=""
                    for(var i=0;i<fontColor.length;i++){
                        if(fontColor[i]!=""){
                            cookie=cookie+fontColor[i]+","
                        }
                    }
                    setCookie("remember",cookie,365)
                }
                else if(e.target.style.color=="rgb(255, 0, 0)"){
                    e.target.style.color="rgb(0,173,255)"
                    fontColor=getCookie("remember").split(",")
                    text_num=color_cookie(e.target.innerText)
                    fontColor[text_num]="2"
                    cookie=""
                    for(i=0;i<fontColor.length;i++){
                        if(fontColor[i]!=""){
                            cookie=cookie+fontColor[i]+","
                        }
                    }
                    setCookie("remember",cookie,365)
                }
                else if(e.target.style.color=="rgb(0, 173, 255)"){
                    e.target.style.color="rgb(0,0,0)"
                    fontColor=getCookie("remember").split(",")
                    text_num=color_cookie(e.target.innerText)
                    fontColor[text_num]="0"
                    cookie=""
                    for(i=0;i<fontColor.length;i++){
                        if(fontColor[i]!=""){
                            cookie=cookie+fontColor[i]+","
                        }
                    }
                    setCookie("remember",cookie,365)
                }
                event.preventDefault()
            }
        }
        else{
            window.open("https://cn.bing.com/search?q="+e.target.innerText+"理解性默写","_blank")
            event.preventDefault()
        }
    })

    window.addEventListener('keydown',function(e){
        var all=document.getElementsByClassName("yizhu")[0].childNodes//四个按钮的第一个父元素
        if(e.keyCode==189){
            all[7].click()//原网页翻译按钮的id
        }
        else if(e.keyCode==187){
            all[5].click()//原网页注释按钮的id
        }
        else if(e.keyCode==48){
            all[3].click()//原网页赏析按钮的id
        }
    })
    document.getElementById("div_all").addEventListener('mouseover',function(e){
        if(e.target.className=="block_text"){
            var break_element=e.target
            for(var p=0;;p++){
                break_element=break_element.nextSibling
                if(break_element==null){break}
                break_element.style.top=parseInt(break_element.style.top.match(/\d+/)[0])+30+"px"
            }
            // alert("a")
        }
        /*         if(e.target.id=="block_all"){console.log("all")}
        else if(e.target.id=="block_12"){console.log("12")}
        else if(e.target.id=="block_11"){console.log("11")} */
    })
    document.getElementById("div_all").addEventListener('mouseout',function(e){
        if(e.target.className=="block_text"){
            var break_element=e.target
            for(var p=0;;p++){
                break_element=break_element.nextSibling
                if(break_element==null){break}
                break_element.style.top=parseInt(break_element.style.top.match(/\d+/)[0])-30+"px"
            }
            // alert("a")
        }
    })
    document.getElementById("div_all").addEventListener('click',function(e){
        var change_first=document.getElementById(id_box[0]+getCookie("change"))
        for(var u=0;u<3;u++){
            if(u==1){
                var leftPx="212px"
                }
            else{
                leftPx="170px"
            }
            document.getElementById(id_box[u]+getCookie("change")).style.left=leftPx
        }
        if(e.target.id.split("_")[1]!='mis'){
            setCookie("change",e.target.id.split("_")[1],100)
        }
        for(u=0;u<3;u++){
            if(u==1){
                leftPx="232px"
            }
            else{
                leftPx="190px"
            }
            document.getElementById(id_box[u]+getCookie("change")).style.left=leftPx
        }
        if(e.target.id.split("_")[1]=='mis'){
            console.log('a')
        }
    })
    window.addEventListener('keydown',function(e){
        if(e.keyCode==192&&e.ctrlKey==true){
            asideOpen()
        }
    })
})();