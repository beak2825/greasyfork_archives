// ==UserScript==
// @name         colorblind helper for battles
// @namespace    http://tampermonkey.net/
// @version      2024-03-26.4
// @description  Меняет обводку клеток (которая подсвечивается при наведении курсора на карту. Например во время хода существа)
// @author       Something begins
// @license      none
// @match       https://www.heroeswm.ru/war*
// @match       https://my.lordswm.com/war*
// @match       https://www.lordswm.com/war*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/490936/colorblind%20helper%20for%20battles.user.js
// @updateURL https://update.greasyfork.org/scripts/490936/colorblind%20helper%20for%20battles.meta.js
// ==/UserScript==
const strokeColor = "white";
const timerColor = "black";
function strokeWholeField(color){
    for (let x = 1; x <= defxn -2; x++){
        for (let y = 1; y <= defyn ; y++){
            let tile = shado[x + y * defxn];
            tile.stroke(color);
        }
    }
}
function changeTimerFun(){
    stage[war_scr].check_timer = () => {
        var anyway = false;
        //    anyway = true; total_time = 396;
        if ((anyway)||((total_time>0)&&(total_time<950)&&((!demomode)||(total_time<100))&&(!battle_ended))){
            var timer = Math.max(0, total_time-Math.floor((Date.now()-count_time)/1000));
            ctime = timer;
            if ((anyway)||(timer!=lasttimer)){
                lasttimer = timer;
                if (document.getElementById('timer')){
                    if ((stage[war_scr])&&(stage[war_scr].ground)&&(stage[war_scr].ground.inited_ground))
                    {
                        show_button('timer');
                    }
                    if (timer <= 5) {
                        document.getElementById('timer').innerHTML = `<span style="color:${timerColor}">${timer}</span>`;
                    } else {
                        document.getElementById('timer').innerHTML = timer
                    }
                };
                stage[war_scr].scale_timer();

            };
        }else{
            var was_visible = 0;
            if ((stage[war_scr].infos.timer_text)&&(btype!=86)&&(btype!=87)){
                if (get_visible(stage[war_scr].infos.timer_text)==1) was_visible = 1;
                set_visible(stage[war_scr].infos.timer_text, 0);
                if (was_visible){stage[war_scr].scale_timer();};
            };
        };
    };
}
let settings_interval = setInterval(() => {
    if (Object.keys(unsafeWindow.stage.pole.obj).length !== 0) {
        strokeWholeField(strokeColor);
        clearInterval(settings_interval);
        setTimeout(()=>{changeTimerFun()}, 3000);
    }
}, 300)