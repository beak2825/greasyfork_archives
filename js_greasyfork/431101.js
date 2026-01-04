// ==UserScript==
// @name         Access Browser Time
// @namespace    https://github.com/AlekPet/Access-Browser-Time/
// @version      1.0
// @description  Blocking the browser after the time has expired
// @author       AlekPet
// @copyright    AlekPet
// @license      MIT; https://raw.githubusercontent.com/AlekPet/Access-Browser-Time/master/LICENSE
// @icon         https://raw.githubusercontent.com/AlekPet/Access-Browser-Time/master/Access-Browser-By-Time-userscript.png
// @match        http*://*/*
// @run-at document-idle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_addValueChangeListener
// @require https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/431101/Access%20Browser%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/431101/Access%20Browser%20Time.meta.js
// ==/UserScript==

GM_addStyle(`
.countDown_Panel {
position: fixed;
max-width: 400px;
max-height: 450px;
bottom: 45px;
left: 5px;
text-align: center;
z-index: 99999999999999999999;
}
.info_time{
font: bold 10pt monospace;
text-align: left;
margin: 5px 10%;
}
.cTime {
color: #4d3ea2;
}
.upTime{
color: #910808;
}
.countDown_Panel .cd_form_box{
width: 400px;
display: none;
border: 1px solid silver;
background: #fff;
font-family: cursive;
opacity:0.8;
box-shadow: 0 3px 5px silver;
}

.cd_title {
background: linear-gradient(#250280,#0089ff);
padding: 10px;
color: #fff;
}
.cd_body {
padding: 5px;
}

.cd_title div {
display: inline-block;
float: right;
cursor: pointer;
transition: 1s font-size;
}

.cd_title div:hover {
font-size: 1.2em;
transition: 1s font-size;
}

.cD_Buttons {
width: 100px;
border: 1px solid silver;
padding: 5px;
background: linear-gradient(#b2b8bb,#88898c);
color: white;
user-select: none;
cursor: pointer;
transition: 1s font-size;
}

.cD_Buttons:hover{
font-size: 1.2em;
transform: rotateZ(-360deg);
transition: 1s font-size;
}

.countDown_Setting {
background: linear-gradient(#00a4ff,#0826ff);
margin: 5px auto;
display:none;
}
.controls {
margin: 0 auto;
}
.box_timer_table{
display: table;
margin: 0px auto;
width: 80%;
}
.box_timer_table > div {
display:table-row;
}
.box_timer_table > div div{
display:table-cell;
}
.box_timer_table .head_caption{
font-weight: bold;
}
.box_timer_table input[type='number']{
text-align:center;
width: 60px;
margin-left: 5px;
}
.buttons {
color: white;
border: 1px solid silver;
border-radius: 3px;
box-shadow: 0 3px 6px;
margin: 0 auto;
padding: 5px;
cursor:pointer;
font-famaly: monospace;
}
.button_start{
background: linear-gradient(limegreen, green);
width: 100px;
}
.button_start:hover{
background: linear-gradient(limegreen, #00FF50);
}
.countDown_Time {
margin: 0 20px;
font-size: 8pt;
min-height: 12px;
}
.controls .fieldset_all{
margin: 5px auto;
width: 90%;
}
.controls input#fon_, .controls #text_block  {
width: 100%;
color: grey;
}
.controls #text_block{
height: 70px;
}
.cont_blocks {
display: table;
width: 100%;
border-spacing: 3px;
}
.table_row {
display: table-row;
}
.table_cell {
display: table-cell;
vertical-align: top;
text-align: left;
}
.blockContainer{
margin-top: 10%;
text-align: center;
}
.block_message{
font: bold 3em monospace;
}

.input_pass_box {
position: absolute;
top: 40%;
left: 50%;
width: 235px;
transform: translate(-50%,-50%);
background: silver;
font: normal 12pt monospace;
opacity: 0.9;
box-shadow: 2px 2px 5px 3px #c0c0c082;
text-align: center;
display:none;
}
.input_pass_box > div {
padding: 7px 6px;
}
.input_pass_box > div:first-child {
background: darkcyan;
color: white;
}
.input_pass_box > div span:last-child {
float: right;
cursor:pointer;
}
.input_pass_box > div span:last-child:hover {
color: cyan;
}
.unblock{color: green;font:bold 12pt monospace;}
.unblock:hover{color: cyan;}
.info_pass_unblock{
background: white;
margin: 3px;
font-style: italic;
font-size: 9pt;
}
`);

(function() {
    'use strict';
    const $ = window.jQuery,
          debug = false,
          defaultBlockImage = "data:image/png;base64,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"

    var ObjTimer = null,
        mtint = null,
        curInterTimer = null

    function loadStorage(){
        let ObjTimer_tmp = GM_getValue('ObjTimer');

        ObjTimer = (ObjTimer_tmp) ? JSON.parse(GM_getValue('ObjTimer')) : {
            options: {
                enabled: false,
                date: null,
                block_data: {text:"", img: defaultBlockImage},
                password: null,
                settings_inputs: null
            }
        }

        if(debug) console.log(ObjTimer)
    }

    function saveToStorage(){
        try{
            var save_data = JSON.stringify(ObjTimer);

            if(save_data.length>0 && save_data !== null && save_data !=="" && save_data !== undefined){
                GM_setValue('ObjTimer', save_data);
                if(debug) console.log("Сохраненно: ",ObjTimer);
            }
        }catch(e){
            console.log(e);
        }
    }

    function getCurrentTime(set_time = null){
        let curTime = set_time ? new Date(set_time) : new Date(),
            year = curTime.getFullYear(),
            month = curTime.getMonth()+1,
            date = curTime.getDate(),
            h = curTime.getHours(),
            m = curTime.getMinutes(),
            s = curTime.getSeconds()

        return `${(date<10?"0"+date:date)+"."+(month<10?"0"+month:month)+"."+year+" "+(h<10?"0"+h:h)+":"+(m<10?"0"+m:m)+":"+(s<10?"0"+s:s)}`
    }

    $.fn.makeForm = function(){
        let DivForm = $(`
<div class="countDown_Panel">
<div class="cD_Buttons countDown_Setting">Настройки</div>
<div class="countDown_Time">Timer: --д. --:--:--</div>
</div>
`);
        this.append(DivForm);

        $(".countDown_Setting").click(checkParole); // showHide

        $(".countDown_Time").on("click", function(){
            $(".countDown_Setting").fadeToggle('slow')
        })

    };

    function showHide(){
        let $cd_form_box = $(".cd_form_box")

        clearInterval(curInterTimer)
        curInterTimer = setInterval(function(){
            let cTime = $(".cTime"),
                upTime = $(".upTime").text(getCurrentTime(returnNewDate())),
                curTime = getCurrentTime()

            if(cTime.length) $(".cTime").text(curTime)
        },1000)


        if(!$cd_form_box.length){
            $cd_form_box = $(`<div class="cd_form_box">
<div class="cd_title"><span>Timer Setting...</span><div>X</div></div>
<div class="cd_body">
<div class="controls">
<fieldset class="fieldset_all">
<legend>Установка времени</legend>
<div class="box_timer_table">
<div>
<div class="head_caption">Дней</div>
<div class="head_caption">Часов</div>
<div class="head_caption">Минут</div>
<div class="head_caption">Секунд</div>
</div>
<div>
<div><input type="number" min="0" title="Дней" id="days_" value="0"></div>
<div><input type="number" min="0" title="Часов" id="hours_"  value="0"></div>
<div><input type="number" min="0" title="Минут" id="mins_" value="0"></div>
<div><input type="number" min="0" title="Секунд" id="secs_"  value="0"></div>
</div>
</div>
<div class="info_time">
<div>Текущее время:</div>
<div class="cTime">00.00.0000 00:00:00</div>
<div>Время блокировки:</div>
<div class="upTime">00.00.0000 00:00:00</div>
</div>
</fieldset>
<fieldset class="fieldset_all">
<legend>Фон при блокировке</legend>
<div class="cont_blocks">
<div class="table_row">
<div class="cont_img_block table_cell">
<div class="img_container"><img src="${ObjTimer.options.block_data.img}" id="image_block" width="128" title="Фон" /></div>
</div>
<div class="cont_block_setting table_cell">
<div class="link_div">
<div>Ссылка:</div>
<input type="text" id="fon_" value="${ObjTimer.options.block_data.img}">
</div>
<div class="textarea_div">
<div>Текст при блокировке:</div>
<textarea id="text_block">Заблокировано ФБР!</textarea>
</div>
</div>
</div>
</div>
</fieldset>
<div class="buttons button_start">Start</div>
</div>
</div>
</div>
</div>`);


            $cd_form_box.find(".cd_title div").off().click(showHide);
            $cd_form_box.find("input").each(function(){
                $(this).on("input", function(){
                    if(checkinputs()){
                        let getTimeUp = getCurrentTime(returnNewDate())
                        $(".upTime").text(getTimeUp)
                    }
                })
            })

            $cd_form_box.find(".button_start").click(startTimer)

            $cd_form_box.find("input#fon_").on("input", imageURLCheck.bind("",$cd_form_box.find("img#image_block")))

            $(".countDown_Panel").append($cd_form_box);
        }

        $cd_form_box.animate({
            width: [ "toggle", "swing" ],
            height: [ "toggle", "swing" ],
            opacity: "toggle"
        }, 1500, "linear", function(){
            $(".countDown_Setting").animate({
                opacity: "hide",
                height: [ "hide", "swing" ]
            },'slow', function(){
                if(!$(".cd_form_box").is(":visible")){
                    $(".countDown_Panel").find(".cd_form_box").remove();
                }
            });
        });

    }

    function imageURLCheck(img,event){
        let imgInput = event.target

        img.one("load",function(){
            // loaded
        })
            .one("error", function(){
            this.src = "data:image/png;base64,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"
        })
            .attr("src",imgInput.value)
    }

    function returnNewDate(saveS = false){
        let date = new Date(),
            days_ = parseInt($("#days_").val()),
            hours_ = parseInt($("#hours_").val()),
            mins_ = parseInt($("#mins_").val()),
            secs_ = parseInt($("#secs_").val()),
            totalms = days_*(1000*60*60*24)+hours_*(1000*60*60)+mins_*(1000*60)+secs_*1000,

            newDate = new Date(date.getTime()+totalms)

        if(saveS){
            ObjTimer.options.enabled = true
            ObjTimer.options.date = newDate.getTime()
            ObjTimer.options.settings_inputs = {days:days_, hours: hours_, mins: mins_, sec: secs_}
            ObjTimer.options.block_data.text = $("#text_block").val()
            ObjTimer.options.block_data.image = $("#fon_").val()
        }

        return newDate.getTime()
    }

    function startTimer(){
        if(checkinputs()){

            if(mtint) clearInterval(mtint);
            $(".countDown_Time").empty();
            timer_run(returnNewDate(true))
            showHide()
            saveToStorage()

        } else {
            alert("В полях были ошибки исправьте их!")
        }
    }

    function checkinputs(){
        let input_ok = true
        $(".controls .box_timer_table input").each(function(indx, el){

            let id = el.id,
                val = el.value,
                title = el.title

            if(/^\s?$/.test(val)){
                alert("Поле '"+title+"' не может быть пустым!")
                el.value = 0
                input_ok = false
            }

            if(!/^[0-9]+$/.test(val)){
                let searchspchar = val.match(/[^0-9]/g)
                alert("Поле '"+title+"' содержит не цифры!\n"+(searchspchar && searchspchar.length? "\nСимволы в поле: "+val.match(/[^0-9]/g).join(","):""))
                el.value = val = parseInt(val) || 0
                input_ok = false
            }

            if(val < 0){
                alert("Поле '"+title+"' не может быть меньше 0!")
                el.value = 0
                input_ok = false
            }

            /*if(id == "days_"){
                el.value = val > 365 ? 365 : val
            } else if(id == "hours_"){
                el.value = val > 23 ? 23 : val
            } else if(id == "mins_" || id == "secs_"){
                el.value = val > 59 ? 59 : val
            }*/
        })
        return input_ok
    }

    function makeParol(){
        const p = prompt("Введите пароль, для защиты","")
        if(/^\s?$/.test(p)){
            alert("Пароль не может быть без символов, или состоять из одних пробелов!")
            if(confirm("Попробовать снова?")) makeParol(); else return;
        }
        ObjTimer.options.password = p
        saveToStorage()
        //checkParole()
        return p
    }

    function checkParole(){
        let p_cor = ObjTimer.options.password

        if(p_cor == null || /^\s?$/.test(p_cor)){
            p_cor = makeParol()
        } else {
            p_cor = ObjTimer.options.password.toString()
        }

        if(p_cor.length){
            const p = prompt("Введите пароль:","")
            if(p !== p_cor){
                alert("Пароль неверный!")
                $(".countDown_Setting").hide()
                return;
            } else {
                alert("Пароль верный!")
                showHide()
            }
        }
    }

    function timer_run(date){
        let d_t = document.title,
            yd = date,
            countText = $(".countDown_Time").get(0)

        mtint = setInterval(function(){
            let nowDateMsec = new Date().getTime(),
                msec = yd-nowDateMsec,
                sec = Math.floor(msec/1000),
                min = Math.floor(sec/60),
                hour = Math.floor(min/60),
                day = Math.floor(hour/24)

            sec %= 60
            min %= 60
            hour %= 24

            if (min<10){
                min='0'+min
            }
            if (sec<10){
                sec='0'+sec
            }
            if (hour<10){
                hour='0'+hour
            }
            if(msec>0){
                let timeOut = "Timer: "+day+"д. "+hour+":"+min+":"+sec
                countText.innerHTML = ((sec % 2 === 0 && msec<60000)?"":msec>60000?timeOut:"<span style='color:red'>"+timeOut+"</span>")
                document.title = d_t+" - "+ countText.innerText.replace("Timer: ","")
            } else {
                countText.innerText ="Время истекло!"
                clearInterval(mtint)
                blockBrowser()
            }
        }, 1000);
    }

    function blockBrowser(){
        let canvas = $("<canvas>").get(0),
            ctx = canvas.getContext("2d")
        let img = $("<img>").on("load", function(){
            let html = `<head><title>${ObjTimer.options.block_data.text}</title></head><body></body>`,
                containerCanvas = $("<div class='blockContainer'>"),
                messageBlock = $("<div class='block_message'>").text(ObjTimer.options.block_data.text),
                unBlock = $("<span class='unblock'>").text("Отключить блокировку").css("cursor","pointer").click(function(){
                    $(".input_pass_box").fadeToggle('slow', function(){
                        if(input_password.is(":visible")){
                            input_password.focus()
                        }
                    })
                }),
                popUPEnterPaswword = $("<div class='input_pass_box'><div><span>Enter password</span><span title='Close' onclick='$(\".unblock\").trigger(\"click\")'>X</span></div><div class='input_pass_body'></div></div>"),
                input_password = $("<input>").attr({"type":"password","title":"Field password input...","id":"input_password"}),
                button_check = $("<button></button>").text("Enter").click(function(){
                    const p_cor = ObjTimer.options.password.toString(),
                          user_input = input_password.val()

                    if(p_cor === user_input){
                        input_password.css('border-color','limegreen')
                        info_bar.css('color','green').text("Пароль верный!")

                        let funct = function(time){
                            var timelef = time+1
                            return function(){
                                timelef-= 1
                                info_bar.text("Разблокировка через: " + timelef +' сек.')
                                if(timelef <=0 ){
                                    ObjTimer.options.enabled = false;
                                    saveToStorage()
                                    location.reload()
                                }
                            }
                        }
                        setInterval(funct.call("",3), 1000)

                    } else {
                        input_password.css('border-color','red')
                        info_bar.text("Пароль не верный!")
                    }
                }),
                info_bar = $("<div class='info_pass_unblock'>")

            popUPEnterPaswword.find(".input_pass_body").append(input_password,button_check,info_bar)

            canvas.width = this.naturalWidth
            canvas.height = this.naturalHeight
            ctx.drawImage(this, 0, 0)

            containerCanvas.append(canvas,messageBlock,unBlock)

            const tmStyles = $("style").filter(function(){
                if(/^[0-9a-f-]+$/.test(this.id)) return this
            }),

                  jquery = $("<script>")
            jquery.attr({"src":"https://code.jquery.com/jquery-3.1.0.min.js","type":"text/javascript"})

            $(document).children("html").html(html)
            $("head").append(tmStyles,jquery)
            $("body").append(containerCanvas,popUPEnterPaswword)

        }).on("error", function(){
            $("body").empty()
        }).attr("src", defaultBlockImage)
        }

    function timerIsset(){
        if(ObjTimer.hasOwnProperty("options")){
            if(ObjTimer.options.hasOwnProperty("date") && ObjTimer.options.hasOwnProperty("enabled") && ObjTimer.options.enabled && ObjTimer.options.date){
                if((ObjTimer.options.date - new Date().getTime())>0){
                    timer_run(ObjTimer.options.date)
                }
                else blockBrowser()
            }
        }
    }

    function init(){
        loadStorage()
        $("body").makeForm()
        timerIsset()
    }

    if (window.top === window.self) {
        init();
    }
})();
