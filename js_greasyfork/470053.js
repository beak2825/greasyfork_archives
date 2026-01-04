// ==UserScript==
// @name         Variation
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Evolve插件
// @author       GodShelvis
// @match        https://pmotschmann.github.io/Evolve/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470053/Variation.user.js
// @updateURL https://update.greasyfork.org/scripts/470053/Variation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var vContent = document.createElement('div')
    vContent.className = 'setting'
    vContent.style="padding-top: 20px"
    vContent.innerHTML = `<div class="vb" style="margin-bottom: 10px; font-size: 1.5rem">--- Varation Setting -----------------------------------</div>
        <label class="switch setting is-rounded"><input type="checkbox" true-value="true" id="vInfinite"><span class="check"></span><span class="control-label"><span class="settings99">无限资源</span></span></label>
        <label class="switch setting is-rounded"><input type="checkbox" true-value="true" id="vAutoBuy"><span class="check"></span><span class="control-label"><span class="settings99">自动购买</span></span></label>
        <div class="keyMap"><span>资源获取速度</span> <div class="control is-clearfix"><input type="number" autocomplete="on" class="input" min="1" max="100" value="1" id="vSpeed"></div>
    </div>`
    $('#settings')[0].appendChild(vContent)

    window.varation = {
        btn: {
            speed: $('#vSpeed')[0]
        },
        tab: {
            res: document.getElementById('5-label'),
            tech : document.getElementById('9-label'),
        },
        res: Object.values(document.querySelectorAll("#resources>div")),
        evolve: unsafeWindow.evolve,
        global: {
            doNothing: 0
        }
    }

    // 单击充满资源
    window.varation.res.filter(e=>e.__vue__.display && e.__vue__.max>0).forEach(resource=>{
        window.varation.res.forEach(resource=>resource.querySelector('.count').onclick = ()=>{resource.__vue__.$data.amount = resource.__vue__.$data.max})
    })
    window.varation.res.filter(e=>e.__vue__.display && e.__vue__.max<=0).forEach(resource=>{
        if(resource.__vue__.amount < 500) {
            resource.__vue__.amount = 500
        }
        window.varation.res.forEach(resource=>resource.querySelector('.count').onclick = ()=>{resource.__vue__.$data.amount += resource.__vue__.$data.amount})
    })
    setInterval(()=>{
        window.varation.setting = {
            infinite:$('#vInfinite')[0].checked,
            autoBuy:$('#vAutoBuy')[0].checked,
            speed:$('#vInfinite')[0].checked?0:$('#vSpeed')[0].value-1
        }
        $('#vAutoBuy')[0].onchange= ()=>window.varation.global.doNothing=0
        window.varation.btn.speed.disabled=window.varation.setting.infinite
        window.varation.tab.curr = $('#mainTabs > nav > ul > li.is-active').attr('aria-controls')
        window.varation.city = Object.values(document.querySelectorAll('#city .vb'))
        if(Object.values(document.querySelectorAll(".barracks")).length>0) {
            window.varation.garrison = document.getElementById("c_garrison")
            window.varation.soldier = Object.values(document.querySelectorAll(".barracks"))
            window.varation.soldier[0].onclick = function(){window.varation.garrison.__vue__.g.workers = window.varation.garrison.__vue__.g.max}
            window.varation.soldier[2].onclick = function(){window.varation.garrison.__vue__.g.wounded = 0};
        }
        // console.log(window.varation)

        if(window.varation.setting.infinite) {
            // 无限资源
            window.varation.res.filter(e=>e.__vue__.display && e.__vue__.max>0).forEach(e=>e.__vue__.amount = e.__vue__.max)
            window.varation.res.filter(e=>e.__vue__.display && e.__vue__.max<=0).forEach(e=>e.__vue__.amount = 9999999999)
            window.varation.city.filter(e=>e.__vue__.act&&e.__vue__.title!='风车'&&e.__vue__.act.on!=null).forEach(e=>e.__vue__.power_on())
        } else {
            // 倍率资源
            window.varation.res.filter(e=>e.__vue__.display && e.__vue__.max>0).forEach(e=>e.__vue__.$data.amount += e.__vue__.diff*(window.varation.setting.speed))
        }

        if(window.varation.setting.autoBuy) {
            if(window.varation.global.doNothing <4) {
                switch(window.varation.tab.curr){
                    case '5-content':
                        var cityCanClick = Object.values(document.querySelectorAll('#city > .vb:not(.cna)')).filter(e=>e.__vue__.act&&e.__vue__.act.time=="0s")
                        if(cityCanClick.length!=0){
                            window.varation.global.doNothing = 0
                            cityCanClick.forEach(e=>e.__vue__.action())
                        } else {
                            window.varation.global.doNothing++
                            console.log(window.varation.btn.techTab)
                            window.varation.tab.tech.click()
                        }
                        break;
                    case '9-content':
                        var techCanClick = Object.values(document.querySelectorAll('#tech div.vb:not(.cna)'))
                        if(techCanClick.length!=0){
                            window.varation.global.doNothing = 0
                            techCanClick.forEach(e=>e.__vue__.action())
                        } else {
                            window.varation.global.doNothing++
                            window.varation.tab.res.click()
                        }
                        break;
                    default:
                        break;
                }
            } else {
                $('#vAutoBuy')[0].checked = false
            }
        }
    },1000)
})();