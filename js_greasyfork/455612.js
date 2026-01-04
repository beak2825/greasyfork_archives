// ==UserScript==
// @name         FDU CourseEvaluator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  非常无脑的评教脚本
// @author       char不多得了
// @match        http://ce.fudan.edu.cn/q.aspx*
// @match        https://ce.fudan.edu.cn/q.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fudan.edu.cn
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @require      https://code.jquery.com/jquery-3.6.1.slim.min.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/455612/FDU%20CourseEvaluator.user.js
// @updateURL https://update.greasyfork.org/scripts/455612/FDU%20CourseEvaluator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 适配不同版本的GM函数
    var _GM_registerMenuCommand;
    if(typeof GM_registerMenuCommand!='undefined'){
        _GM_registerMenuCommand=GM_registerMenuCommand;
    }else if(typeof GM!='undefined' && typeof GM.registerMenuCommand!='undefined'){
        _GM_registerMenuCommand=GM.registerMenuCommand;
    }
    if(typeof _GM_registerMenuCommand=='undefined')_GM_registerMenuCommand=(s,f)=>{};

    function fill(){
        let q_list = $("#subject_box").children()
        // let subject_box = $("dl")
        console.log(q_list)
        console.log($(".open_input"))
        for(let q in q_list){
            // console.log(q_list[q])
            try{
            let opt0 = q_list[q].children[1].children[0].children[0]
            // console.log(opt0)
            opt0.click()
            // console.log(q)
            }
            catch(err){}
        }
        $("#next_button").click()
        setTimeout(()=>{
            $("button.ui-dialog-autofocus").click()
        },50)
    }
    _GM_registerMenuCommand("填",fill);
})();