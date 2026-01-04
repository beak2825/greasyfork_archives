// ==UserScript==
// @name         更好的车辆信息展示
// @namespace    sucem
// @version      0.3
// @description  方便自己
// @author       You
// @match        http://10.0.0.205/sl/cgveh.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33572/%E6%9B%B4%E5%A5%BD%E7%9A%84%E8%BD%A6%E8%BE%86%E4%BF%A1%E6%81%AF%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/33572/%E6%9B%B4%E5%A5%BD%E7%9A%84%E8%BD%A6%E8%BE%86%E4%BF%A1%E6%81%AF%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // $('body').bind('ajaxcomplete',function() {
    //     console.log('complete');
    // });
    $('body').ajaxComplete(function(){
        // 高亮显示发动机号和车辆识别代号后四位
        var fdjh$ = $('#cg_veh_fdjh');
        var clsbdh$ = $('#cg_veh_clsbdh');

        // highlight the fdjh
        var hlFdjh = splitCode(fdjh$.text());
        fdjh$.parent().html(hlFdjh[0]+'<span style="border: 1px #ccc solid;background: #a2bfff;">'+hlFdjh[1]);

        // highliht the clsbdh
        var hlClsbdh = splitCode(clsbdh$.text());
        clsbdh$.parent().html(hlClsbdh[0]+'<span style="border: 1px #ccc solid;background: #a2bfff;">'+hlClsbdh[1]);
    });

    /**
    将发动机号或者车辆识别代号分割成两部分
    最后四位是一部分
    example: splitCode('131154') -> ['13','1154']

    arguments :
    code: string
    **/
    function splitCode(code) {
        var preCode = code.substring(0, code.length-4);
        var postCode = code.substring(code.length-4);

        return [preCode,postCode];
    }

    /**
    如果车辆的号牌号码是7位的,则自动选择小型新能源号牌种类
    */
    function autoHpzl() {
        // let mainFrame = document.querySelector('frame[name="fraMain"]');
        // let frameContent = mainFrame.contentDocument || mainFrame.contentWindow.document;

        let hphmInput = document.getElementById('hphm');
        hphmInput.addEventListener('change', function(evt) {
            // console.log('event')
            var content = evt.target.value;
            console.log(evt.target.value)
            if (content.length >= 7) {
                document.getElementById('hpzl').value = '52';
            }
        })
    }

    autoHpzl();

    /**
     * debug
     **/
    /**
    function defState() {
        $('#hphm').val('CFD918');
        $('#cxbutton').click();
    }

    defState();
    **/
})();