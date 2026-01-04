// ==UserScript==
// @name         super-turtle-idle-AutoClick
// @namespace    https://blog.csdn.net/qq_39987236?type=blog
// @version      0.1.20241105.2
// @description  超级乌龟自动操作脚本
// @author       Yoki
// @match        https://gltyx.github.io/super-turtle-idle/
// @icon         https://gltyx.github.io/super-turtle-idle/img/src/tortugasdefault/img1.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512948/super-turtle-idle-AutoClick.user.js
// @updateURL https://update.greasyfork.org/scripts/512948/super-turtle-idle-AutoClick.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //------------------------龟龟币按钮-----------------------------
    var clickNum = 0;
    var clickTimer = setInterval(function() {
        if(clickNum === 1)
            $("#tortugaClick").click();
    }, 100);
    //------------------------龟龟币控制-----------------------------
    //在天气后方放置按钮
    $(".recursosSuperior #weatherButton").after('<div class="topWidget" id="clickBtnsDiv"><img id="clickBtns" src="img/src/tortugasdefault/img1.png"></div>')
    //按钮开关功能
    $('body').on('click','#clickBtnsDiv',function(){
        if(clickNum === 0){
            $("#clickBtnsDiv").css("background-color", "white");
            $("#clickBtns").prop("src", "img/src/tortugasdefault/img5.png");
            //主动修改工具栏内容,更加友好
            $("#tooltipImage").prop("src","img/src/tortugasdefault/img5.png");
            $("#tooltipName").prop("innerHTML","关闭自动点击龟龟币")
            clickNum = 1;
        }
        else if(clickNum === 1){
            $("#clickBtnsDiv").css("background-color", "#1C1C22");
            $("#clickBtns").prop("src", "img/src/tortugasdefault/img1.png");
            $("#tooltipImage").prop("src","img/src/tortugasdefault/img1.png");
            $("#tooltipName").prop("innerHTML","启动自动点击龟龟币")
            clickNum = 0;
        }
    })
    //鼠标移动到按钮上时处理工具栏&展示
    $('#clickBtnsDiv').mouseover(function(){
        did("tooltip").style.display = "flex";
        did("upperTooltip").style.display = "flex";
        did("tooltipDescription").innerHTML ='<span style="color:gray">给予玩家自动化点击龟龟币功能</span>';
        did("tooltipRarity").innerHTML ='按钮';
        did("tooltipFlavor").textContent = "来自Yoki的Auto功能,一个懒狗的自我修养";
        did("tooltipDescription").style.textAlign = "center";
        did("tooltipImage").style.display = "flex";
        did("tooltipArrowUp").style.display = 'flex'
        did("tooltipArrow").style.display = 'none'

        const movingDiv = did("tooltip");
        const referenceDiv = did("clickBtnsDiv");
        const referenceRect = referenceDiv.getBoundingClientRect();
        const referenceRight = referenceRect.right;
        const referenceBottom = referenceRect.bottom - 1;
        const newLeft = referenceRight - movingDiv.offsetWidth;
        const newTop = referenceBottom;
        movingDiv.style.left = newLeft + "px";
        movingDiv.style.top = newTop + "px";
        $("#tooltipPrice").prop("innerHTML","")
        $("#tooltipName").prop("style","color: white;")
        $("#tooltipRarity").prop("style","color: white;")
        if(clickNum === 0){
            $("#tooltipName").prop("innerHTML","启动自动点击龟龟币")
            $("#tooltipImage").prop("src","img/src/tortugasdefault/img1.png")
        }
        else if(clickNum === 1){
            $("#tooltipName").prop("innerHTML","关闭自动点击龟龟币")
            $("#tooltipImage").prop("src","img/src/tortugasdefault/img5.png")
        }
    })
    //鼠标离开时隐藏工具栏
    $('#clickBtnsDiv').mouseout(function(){
        $("#tooltip").prop("style","display: none; width: 22vw;")
        did("tooltipArrowUp").style.display = 'none'
        did("tooltipArrow").style.display = 'flex'
    })
    //---------------------------神秘礼盒按钮-------------------------
    var clickNum2 = 0;
    setInterval(function(){
        if(clickNum2 === 1){
            if($("#E15enemy").length === 1){
                if (rng(1,20)===1){ //mimic
                    logs.P32A.unlocked=true;
                    deleteEnemy("E43");
                    animParticleBurst(10 , "particleSmoke", "enemyPanel", 0);
                    animState(stats.currentEnemy+"enemy", "shakeFlash 0.4s 1");
                    animImageSplash("circle", "enemyPanel", "explosion", 0);
                    playSound("audio/explosion.mp3");
                    cd.presentCanSpawn = playerPresentMinigameTimer;
                } else {
                    cd.presentCanSpawn = playerPresentMinigameTimer;
                    deleteEnemy();
                    playSound("audio/button3.mp3")
                    setTimeout(() => {
                        startMysteryMinigame(); resetTooltip();enemyUpdate();
                    }, 300);
                }
            }
            if($("#mysteryList").children().length != 0){
                var mysteryList = $("#mysteryList").children();
                for (i in mysteryList) {
                    var mystery = mysteryList[i];
                    if(mystery.id != "endGame-6")
                        //console.log(mystery.id)
                        $(mystery).click()
                }
                $("#mysteryList #endGame-6").click()
            }
        }
    },1000)
    //---------------------------神秘礼盒控制-------------------------
    //在天气后方放置按钮
    $(".recursosSuperior #clickBtnsDiv").after('<div class="topWidget" id="clickBtnsDiv2"><img id="clickBtns2" src="img/src/icons/present.png"></div>')
    //按钮开关功能
    $('body').on('click','#clickBtnsDiv2',function(){
        if(clickNum2 === 0){
            $("#clickBtnsDiv2").css("background-color", "white");
            $("#clickBtns2").prop("src", "img/src/icons/presentOpen.png");
            //主动修改工具栏内容,更加友好
            $("#tooltipImage").prop("src","img/src/icons/presentOpen.png");
            $("#tooltipName").prop("innerHTML","关闭自动开启神秘礼盒")
            clickNum2 = 1;
        }
        else if(clickNum2 === 1){
            $("#clickBtnsDiv2").css("background-color", "#1C1C22");
            $("#clickBtns2").prop("src", "img/src/icons/present.png");
            $("#tooltipImage").prop("src","img/src/icons/present.png");
            $("#tooltipName").prop("innerHTML","启动自动开启神秘礼盒")
            clickNum2 = 0;
        }
    })
    //鼠标移动到按钮上时处理工具栏&展示
    $('#clickBtnsDiv2').mouseover(function(){
        did("tooltip").style.display = "flex";
        did("upperTooltip").style.display = "flex";
        did("tooltipDescription").innerHTML ='<span style="color:gray">给予玩家自动化打开礼盒功能</span>';
        did("tooltipRarity").innerHTML ='按钮';
        did("tooltipFlavor").textContent = "来自Yoki的Auto功能,一个懒狗的自我修养";
        did("tooltipDescription").style.textAlign = "center";
        did("tooltipImage").style.display = "flex";
        did("tooltipArrowUp").style.display = 'flex'
        did("tooltipArrow").style.display = 'none'

        const movingDiv = did("tooltip");
        const referenceDiv = did("clickBtnsDiv2");
        const referenceRect = referenceDiv.getBoundingClientRect();
        const referenceRight = referenceRect.right;
        const referenceBottom = referenceRect.bottom - 1;
        const newLeft = referenceRight - movingDiv.offsetWidth;
        const newTop = referenceBottom;
        movingDiv.style.left = newLeft + "px";
        movingDiv.style.top = newTop + "px";
        $("#tooltipPrice").prop("innerHTML","")
        $("#tooltipName").prop("style","color: white;")
        $("#tooltipRarity").prop("style","color: white;")
        if(clickNum2 === 0){
            $("#tooltipName").prop("innerHTML","启动自动开启神秘礼盒")
            $("#tooltipImage").prop("src","img/src/icons/present.png")
        }
        else if(clickNum2 === 1){
            $("#tooltipName").prop("innerHTML","关闭自动开启神秘礼盒")
            $("#tooltipImage").prop("src","img/src/icons/presentOpen.png")
        }
    })
    //鼠标离开时隐藏工具栏
    $('#clickBtnsDiv2').mouseout(function(){
        $("#tooltip").prop("style","display: none; width: 22vw;")
        did("tooltipArrowUp").style.display = 'none'
        did("tooltipArrow").style.display = 'flex'
    })
    //-----------------------死亡自动复活--------------------------
    var clickNum3 = 0;
    var clickTimer3 = setInterval(function(){
        if(clickNum3 === 1)
            $("#rpgPlayerImg").click()
    },100)
    //-------------------------复活按钮----------------------------
    //在天气后方放置按钮
    $(".recursosSuperior #clickBtnsDiv2").after('<div class="topWidget" id="clickBtnsDiv3"><img id="clickBtns4" src="img/src/armor/dead.png" style="transform:rotateX(180deg);"></div>')
    //按钮开关功能
    $('body').on('click','#clickBtnsDiv3',function(){
        if(clickNum3 === 0){
            $("#clickBtnsDiv3").css("background-color", "white");
            //主动修改工具栏内容,更加友好
            $("#tooltipName").prop("innerHTML","关闭自动复活")
            clickNum3 = 1;
        }
        else if(clickNum3 === 1){
            $("#clickBtnsDiv3").css("background-color", "#1C1C22");
            $("#tooltipName").prop("innerHTML","启动自动复活")
            clickNum3 = 0;
        }
    })
    //鼠标移动到按钮上时处理工具栏&展示
    $('#clickBtnsDiv3').mouseover(function(){
        did("tooltip").style.display = "flex";
        did("upperTooltip").style.display = "flex";
        did("tooltipDescription").innerHTML ='<span style="color:gray">给予玩家自动复活功能</span>';
        did("tooltipRarity").innerHTML ='按钮';
        did("tooltipFlavor").textContent = "来自Yoki的Auto功能,一个懒狗的自我修养";
        did("tooltipDescription").style.textAlign = "center";
        did("tooltipImage").style.display = "flex";
        did("tooltipArrowUp").style.display = 'flex';
        did("tooltipArrow").style.display = 'none';

        const movingDiv = did("tooltip");
        const referenceDiv = did("clickBtnsDiv3");
        const referenceRect = referenceDiv.getBoundingClientRect();
        const referenceRight = referenceRect.right;
        const referenceBottom = referenceRect.bottom - 1;
        const newLeft = referenceRight - movingDiv.offsetWidth;
        const newTop = referenceBottom;
        movingDiv.style.left = newLeft + "px";
        movingDiv.style.top = newTop + "px";
        $("#tooltipPrice").prop("innerHTML","")
        $("#tooltipName").prop("style","color: white;")
        $("#tooltipRarity").prop("style","color: white;")
        $("#tooltipImage").prop("src","img/src/armor/dead.png")
        if(clickNum3 === 0){
            $("#tooltipName").prop("innerHTML","启动自动复活")
        }
        else if(clickNum3 === 1){
            $("#tooltipName").prop("innerHTML","关闭自动复活")
        }
    })
    //鼠标离开时隐藏工具栏
    $('#clickBtnsDiv3').mouseout(function(){
        $("#tooltip").prop("style","display: none; width: 22vw;")
        did("tooltipArrowUp").style.display = 'none'
        did("tooltipArrow").style.display = 'flex'
    })
    //------------------------自动点小丑---------------------------
    var clickNum4 = 0;
    var clickTimer4 = setInterval(function() {
        if(clickNum4 === 1){
            if($("#jesterWrapper").children()[0]){
                $("#jesterWrapper").children()[0].click();
            }
        }
    }, 1000);
    //-----------------------自动小丑按钮--------------------------
    //在天气后方放置按钮
    $(".recursosSuperior #clickBtnsDiv3").after('<div class="topWidget" id="clickBtnsDiv4"><img id="clickBtns4" src="img/src/items/I208.jpg"></div>')
    //按钮开关功能
    $('body').on('click','#clickBtnsDiv4',function(){
        if(clickNum4 === 0){
            $("#clickBtnsDiv4").css("background-color", "white");
            //主动修改工具栏内容,更加友好
            $("#tooltipName").prop("innerHTML","关闭自动点击小丑")
            clickNum4 = 1;
        }
        else if(clickNum4 === 1){
            $("#clickBtnsDiv4").css("background-color", "#1C1C22");
            $("#tooltipName").prop("innerHTML","启动自动点击小丑")
            clickNum4 = 0;
        }
    })
    //鼠标移动到按钮上时处理工具栏&展示
    $('#clickBtnsDiv4').mouseover(function(){
        did("tooltip").style.display = "flex";
        did("upperTooltip").style.display = "flex";
        did("tooltipDescription").innerHTML ='<span style="color:gray">给予玩家自动化点击小丑功能</span>';
        did("tooltipRarity").innerHTML ='按钮';
        did("tooltipFlavor").textContent = "来自Yoki的Auto功能,一个懒狗的自我修养";
        did("tooltipDescription").style.textAlign = "center";
        did("tooltipImage").style.display = "flex";
        did("tooltipArrowUp").style.display = 'flex'
        did("tooltipArrow").style.display = 'none'

        const movingDiv = did("tooltip");
        const referenceDiv = did("clickBtnsDiv4");
        const referenceRect = referenceDiv.getBoundingClientRect();
        const referenceRight = referenceRect.right;
        const referenceBottom = referenceRect.bottom - 1;
        const newLeft = referenceRight - movingDiv.offsetWidth;
        const newTop = referenceBottom;
        movingDiv.style.left = newLeft + "px";
        movingDiv.style.top = newTop + "px";
        $("#tooltipPrice").prop("innerHTML","")
        $("#tooltipName").prop("style","color: white;")
        $("#tooltipRarity").prop("style","color: white;")
        $("#tooltipImage").prop("src","img/src/items/I208.jpg")
        if(clickNum4 === 0){
            $("#tooltipName").prop("innerHTML","启动自动点击小丑")
        }
        else if(clickNum4 === 1){
            $("#tooltipName").prop("innerHTML","关闭自动点击小丑")
        }
    })
    //鼠标离开时隐藏工具栏
    $('#clickBtnsDiv4').mouseout(function(){
        $("#tooltip").prop("style","display: none; width: 22vw;")
        did("tooltipArrowUp").style.display = 'none'
        did("tooltipArrow").style.display = 'flex'
    })
    //----------------------自动释放技能--------------------------
    var TG1BSkill = [];
    var clickTimerSkill = setInterval(function() {
        if(TG1BSkill.length != 0){
            for(let i = 0;i < TG1BSkill.length;i++){
                if((TG1BSkill[i].prev().prop("style").height == "0%" || TG1BSkill[i].prev().prop("style").height == "") && (rpgPlayer.mana > 100  || TG1BSkill[i].prop("style").filter == 'brightness(1)' || TG1BSkill[i].prop("style").filter == '')){
                    if(TG1BSkill[i].prop("src") == "https://gltyx.github.io/super-turtle-idle/img/src/talents/TG1B.jpg"){
                        if(rpgPlayer.mana > 27.5)
                            TG1BSkill[i].click();
                    }else{
                        TG1BSkill[i].click();
                    }
                }
            }
        }
    }, 1000);
    //--------------------自动释放技能事件-------------------------
    setTimeout(function() {
    $("#rpgCanvasSkills").before("<style>@keyframes huerotate {0% {filter: hue-rotate(0deg);}100% {filter: hue-rorate(360deg);}}.skill-useing{border: 3px solid;border-image: linear-gradient(45deg, gold, deeppink) 1;clip-path: inset(0px round 2px);animation: huerotate 3s infinite linear;filter: hue-rotate(360deg);display: none;position:absolute;height: 3.1rem;width: 3.1rem;left: 0.22rem;top: 0rem;z-index: 4;}#skillsusdiv0{height: 3.5rem;width: 3.5rem;}.out-div{position:relative;top:0.42rem;background: #ffffff00;z-index: 4;}.out-div:hover{scale: 1.1;transition: 0.2s;}#skilloutdiv0{top:0.02rem;}#skillButton1:hover, #skillButton2:hover, #skillButton3:hover, #skillButton4:hover, #skillButton0:hover{scale: 1;transition: 0s;}#skillButton5 {background: transparent;margin-top: auto;position: relative;height: 3.1rem;width: 3.1rem;border-radius: 0.2rem;transition: 0.1s;z-index: 3;margin-left: 0.2rem;margin-bottom: 0.3rem;}#skillSlot5CD {background: rgba(30, 10, 30, 0.8);height: 0%;width: 100%;position: absolute;transition: 1s all linear;transform-origin: bottom;z-index: 99;}#skillSlot5 {display: none;height: 100%;width: 100%;}</style>");
    //在技能后方放置按钮
    $("#rpgCanvasSkills #skillButton4").after('<div id="skillButton5" style="border: 2px solid rgb(119, 199, 238);"><div class="itemCooldownTimerText" id="I30SkillText"></div><div id="skillSlot5CD" style="height: 0%;"></div><img id="skillSlot5" src="img/src/items/I30.jpg" style="display: flex;"></div>')
    var skillChildList = $("#rpgCanvasSkills").children();
        for(let i = 0;i < skillChildList.length ;i++){
            $(skillChildList[i]).wrap('<div id="skilloutdiv'+i+'" class="out-div"></div>');
            $(skillChildList[i]).after('<div class="skill-useing" id="skillsusdiv'+i+'" style="background: #ffffff00"></div>');
            $("#skillsusdiv"+i).click(function(){
                if($("#skillSlot"+i+"CD").prop("style").height != "0%" || $("#skillSlot"+i+"CD").prop("style").height != ""){
                    did("skillsusdiv"+i).style.animation = "";
                    void did("skillsusdiv"+i).offsetWidth;
                    did("skillsusdiv"+i).style.animation = "shake 0.4s 1 ease";
                    setTimeout(function(){
                        did("skillsusdiv"+i).style.animation = null;
                    },1000)
                }
                $(skillChildList[i]).find("img").click();
            })
            $("#skillSlot"+i).contextmenu(function(){
                did("skillsusdiv"+i).style.display = "flex";
                TG1BSkill.push($(skillChildList[i]).find("img"));
            })
            $("#skillSlot"+i+"CD").contextmenu(function(){
                did("skillsusdiv"+i).style.display = "flex";
                TG1BSkill.push($(skillChildList[i]).find("img"));
            })
            $("#skillsusdiv"+i).contextmenu(function(){
                did("skillsusdiv"+i).style.display = "none";
                TG1BSkill = TG1BSkill.filter(function(item) {
                    return item.prop("id") != $(skillChildList[i]).find("img").prop("id")
                });
            })
        }
    },1000);
    //---------------------------预报------------------------------
    var clickNum5 = null;
    if(window.localStorage.getItem("clickNum5") == null){
        window.localStorage.setItem("clickNum5",0)
        clickNum5 = 0;
    }else{
        clickNum5 = parseInt(window.localStorage.getItem("clickNum5"));
    }
    var clickTimer5 = setInterval(function(){
        if(clickNum5 === 1){
            logPrint("<div>小丑龟龟将在 <span style='color:yellow'>"+parseInt(cd.jesterCooldown/3600)+"时"+parseInt(cd.jesterCooldown/60%60)+"分"+cd.jesterCooldown%60+"秒后</span> 有概率生成</div>");
            logPrint("<div>神秘礼盒将在 <span style='color:yellow'>"+parseInt(cd.presentCanSpawn/3600)+"时"+parseInt(cd.presentCanSpawn/60%60)+"分"+cd.presentCanSpawn%60+"秒后</span> 有概率生成</div>");
        }
    },1000)
    //-------------------------预报按钮----------------------------
    $($(".settingsFlex h2")[1]).before('<h2>YOKI-AUTO功能</h2>');
    if(clickNum5 === 0){
        $($(".settingsFlex h2")[1]).after('<h3>不显示生成倒计时<button id="disableCall" style="background: rgb(107, 178, 62);">开启状态</button></h3>');
    }else{
        $($(".settingsFlex h2")[1]).after('<h3>不显示生成倒计时<button id="disableCall" style="background: rgb(55, 55, 55);">关闭状态</button></h3>');
    }
     $('body').on('click','#disableCall',function(){
        if(clickNum5 === 0){
            clickNum5 = 1;
            window.localStorage.setItem("clickNum5",1)
            did("disableCall").innerHTML = '关闭状态';
            did("disableCall").style.background = '#373737';
        }
        else if(clickNum5 === 1){
            clickNum5 = 0;
            window.localStorage.setItem("clickNum5",0)
            did("disableCall").innerHTML = '开启状态';
            did("disableCall").style.background = '#6BB23E';
        }
    });
    //-------------------------自动炸矿----------------------------
    var areaNum = null;
    var areaList = [$("#A1area"),$("#A3area"),$("#A8area")];
    //按钮开关功能
    $('body').on('click','#skillSlot5',function(){
        if(items.I30.cd === 0 && items.I30.count > 0){
            var nowArea = null;
            var nowEntity = null;
            for(let i = 0 ; i < $("#encounterWrapper").children().length ; i++){
                if($($("#encounterWrapper").children()[i]).css("box-shadow") == "rgb(255, 255, 255) 0px 0px 5px 1px inset")
                    nowEntity = $($("#encounterWrapper").children()[i]);
            }
            for(let i = 0 ; i < $("#areaTab").children().length ; i++){
                if($($("#areaTab").children()[i]).prop("class") == "areaSliderActive")
                    nowArea = $($("#areaTab").children()[i]);
            }
            if(areaNum == null){
                createPopup('<img src="img/src/armor/dead.png"> 尚未设置目标,请在右上角设置', 'save', 'settingBombPopUp');
                return;
            }else{
                areaList[areaNum].click();
                $("#miningNode").click();
            }
            $("#skillSlot5").prop("style").filter = 'brightness(0.8)'
            items.I30.cd = 60;
            items.I30.count --;
            castLightDynamite();
            setTimeout(function (){
                i30Timeout()
                $("#areaButton").click();
                nowArea.click();
                nowEntity.click();
            },701);
        }else if(did("I30SkillText").innerHTML == "" && items.I30.count > 0){
                createPopup('<img src="img/src/armor/dead.png"> 炸药当前处于冷却状态', 'save', 'settingBombPopUp');
        }else if(did("I30SkillText").innerHTML == "" && items.I30.count == 0){
                createPopup('<img src="img/src/armor/dead.png"> 库存没有炸药了!!!!', 'save', 'settingBombPopUp');
        }
    })
    function i30Timeout(){
        if(items.I30.cd !== 0){
            did("I30SkillText").innerHTML = items.I30.cd;
            setTimeout(function (){
                i30Timeout()
            },500);
        }else{
            did("I30SkillText").innerHTML = "";
            $("#skillSlot5").prop("style").filter = 'brightness(1)'
        }
    }
    //-----------------------炸矿启动按钮--------------------------
    //在天气后方放置按钮
    $(".recursosSuperior #clickBtnsDiv4").after('<div class="topWidget" id="clickBtnsDiv6"><img id="clickBtns6" src="img/src/icons/mining.png"></div>')
    //按钮开关功能
    $('body').on('click','#clickBtnsDiv6',function(){
        areaNum = parseInt(prompt("请输入你想炸的区域顺序号"));
        if(isNaN(areaNum) || areaNum - 1 < 0 || areaNum - 1 > 2){
            createPopup('<img src="img/src/armor/dead.png"> 设置目标编号输入有误:(请查看设置按钮注意事项', 'save', 'settingBombPopUp');
            areaNum = null;
            return;
        }
        areaNum = areaNum - 1;
        $("#tooltipName").prop("innerHTML","设置当前炸矿目标,当前目标:"+areaList[areaNum].find("strong")[0].innerHTML)
    })
    //鼠标移动到按钮上时处理工具栏&展示
    $('#clickBtnsDiv6').mouseover(function(){
        did("tooltip").style.display = "flex";
        did("upperTooltip").style.display = "flex";
        if(areaNum != null && areaList[areaNum].length != 0){
            $("#tooltipDescription").prop("innerHTML",'<span style="color:gray">设置当前炸矿目标,当前目标:</span>'+areaList[areaNum].find("strong")[0].innerHTML)
        }else{
            $("#tooltipDescription").prop("innerHTML",'<span style="color:gray">设置当前炸矿目标,当前目标:</span>无目标')
        }
        did("tooltipName").innerHTML ='主动炸矿区域设置';
        did("tooltipRarity").innerHTML ='设置';
        did("tooltipFlavor").textContent = "注意! 1:摇篮山丘(铜矿脉) 2:花岗岩窟(奥金矿脉) 3:圣灵峡谷(化石堆)";
        did("tooltipDescription").style.textAlign = "center";
        did("tooltipImage").style.display = "flex";
        did("tooltipArrowUp").style.display = 'flex'
        did("tooltipArrow").style.display = 'none'

        const movingDiv = did("tooltip");
        const referenceDiv = did("clickBtnsDiv6");
        const referenceRect = referenceDiv.getBoundingClientRect();
        const referenceRight = referenceRect.right;
        const referenceBottom = referenceRect.bottom - 1;
        const newLeft = referenceRight - movingDiv.offsetWidth;
        const newTop = referenceBottom;
        movingDiv.style.left = newLeft + "px";
        movingDiv.style.top = newTop + "px";
        $("#tooltipPrice").prop("innerHTML","")
        $("#tooltipName").prop("style","color: white;")
        $("#tooltipRarity").prop("style","color: white;")
        $("#tooltipImage").prop("src","img/src/icons/mining.png")
    })
    //鼠标离开时隐藏工具栏
    $('#clickBtnsDiv6').mouseout(function(){
        $("#tooltip").prop("style","display: none; width: 22vw;")
        did("tooltipArrowUp").style.display = 'none'
        did("tooltipArrow").style.display = 'flex'
    })
    //-----------------------一键浇水--------------------------
    //https://gltyx.github.io/super-turtle-idle/img/src/items/I480.jpg
    $("#flowerPower").after('<div class="gardenTab" id="waterBtn" style="font-size: 1.7rem;">💧</div>');
    $('body').on('click','#waterBtn',function(){
        for(let i = 1; i < 7 ; i++){
            for(let j = 1; j < 5 ; j++){
                setTimeout(() => $("#r"+j+"plot"+i+"plot").click(),10 * i * j)
            }
        }
    })
    //--------------------死亡主动返回boss---------------------
    var clickNum6 = null;
    var isBoss = false;
    var clickTimer6 = setInterval(function(){
        if(clickNum6 === 1){
            //img/src/armor/dead.png
            if($("#bossButton").css("box-shadow") != "rgb(255, 255, 255) 0px 0px 5px 1px inset" && isBoss && $("#rpgPlayerImg").prop("src") == "https://gltyx.github.io/super-turtle-idle/img/src/armor/dead.png"){
                $("#bossButton").click();
            }
            if($("#bossButton").css("box-shadow") == "rgb(255, 255, 255) 0px 0px 5px 1px inset"){
                isBoss = true;
            }else{
                isBoss = false;
            }
        }
    },100)
    if(window.localStorage.getItem("clickNum6") == null){
        window.localStorage.setItem("clickNum6",0)
        clickNum6 = 0;
    }else{
        clickNum6 = parseInt(window.localStorage.getItem("clickNum6"));
    }
    if(clickNum6 === 0){
        $($(".settingsFlex h2")[1]).after('<h3>死亡后主动回归BOSS<button id="deadReturn" style="background: rgb(55, 55, 55);">关闭状态</button></h3>');
    }else{
        $($(".settingsFlex h2")[1]).after('<h3>死亡后主动回归BOSS<button id="deadReturn" style="background: rgb(107, 178, 62);">开启状态</button></h3>');
    }
     $('body').on('click','#deadReturn',function(){
        if(clickNum6 === 0){
            clickNum6 = 1;
            window.localStorage.setItem("clickNum6",1)
            did("deadReturn").innerHTML = '开启状态';
            did("deadReturn").style.background = '#6BB23E';
        }
        else if(clickNum6 === 1){
            clickNum6 = 0;
            window.localStorage.setItem("clickNum6",0)
            did("deadReturn").innerHTML = '关闭状态';
            did("deadReturn").style.background = '#373737';
        }
    });

})();