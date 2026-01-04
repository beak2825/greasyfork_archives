// ==UserScript==
// @name         super-turtle-idle enhance
// @namespace    https://greasyfork.org/zh-CN/scripts/507096/
// @version      1.0.5
// @description  super-turtle-idle enhance.
// @author       dzl
// @match        https://gltyx.github.io/super-turtle-idle/
// @icon         https://gltyx.github.io/super-turtle-idle/img/src/icons/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507096/super-turtle-idle%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/507096/super-turtle-idle%20enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function delayed(time){
        return new Promise((resolve,reject)=>{
            setTimeout( () => {
                resolve(time)
            }, time);
        })
    }

    let intervals = {}

    // 拍打乌龟
    $(document).on('mousedown', '[id="tortugaClick"]', function(){
        switch (event.which) {
            case 1:
                //alert('Left mouse button is pressed');
                break;
            case 2:
                //alert('Middle mouse button is pressed');
                let self = $(this)
                let id = self.attr('id')
                if (self.attr('data-using') != 'on') {
                    intervals[id] = setInterval(()=>{
                        self.click()
                    },10)
                    self.attr('data-using', 'on')
                } else {
                    clearInterval(intervals[id])
                    self.attr('data-using', 'off')
                }
                break;
            case 3:
                //alert('Right mouse button is pressed');
                break;
            default:
                //alert('Nothing');
        }
        /*
        */
    })

    // 技能
    $(document).on('mousedown', '[id*="skillButton"]', function(){
        let self = $(this)
        let child = self.find('[id*="skillSlot"]:nth-child(2)')
        let id = self.attr('id')
        switch (event.which) {
            case 1:
                //alert('Left mouse button is pressed');
                break;
            case 2:
                //alert('Middle mouse button is pressed');
                if (self.attr('data-using') != 'on') {
                    intervals[id] = setInterval(()=>{
                        let magic = $('#magicBar').width() / $('#magicBar').parent().width() * 100;
                        if (magic > 50){
                            child.click()
                        }
                    },2000)
                    self.attr('data-using', 'on')
                } else {
                    clearInterval(intervals[id])
                    self.attr('data-using', 'off')
                }
                break;
            case 3:
                //alert('Right mouse button is pressed');
                if (self.attr('data-using') != 'on') {
                    intervals[id] = setInterval(()=>{
                        child.click()
                    },2000)
                    self.attr('data-using', 'on')
                } else {
                    clearInterval(intervals[id])
                    self.attr('data-using', 'off')
                }
                break;
            default:
                //alert('Nothing');
        }
        /*
        */
    })

    // 花园浇水
    $(document).on('mousedown', '[id="gardenSquare"]', function(){
        switch (event.which) {
            case 1:
                //alert('Left mouse button is pressed');
                break;
            case 2:
                //alert('Middle mouse button is pressed');
                let self = $(this)
                let id = self.attr('id')
                if (self.attr('data-using') != 'on') {
                    intervals[id] = setInterval(()=>{
                        $('[id*="plotPlant"]').click()
                    },10000)
                    self.attr('data-using', 'on')
                } else {
                    clearInterval(intervals[id])
                    self.attr('data-using', 'off')
                }
                break;
            case 3:
                //alert('Right mouse button is pressed');
                break;
            default:
                //alert('Nothing');
        }
        /*
        */
    })
})();