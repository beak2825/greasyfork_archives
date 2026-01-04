// ==UserScript==
// @name         解除标贝语音转文字字数限制
// @namespace    https://github.com/zhchjiang95
// @version      1.0.0
// @description  解除标贝语音转文字200字数限制
// @author       zhchjiang95 <i@fiume.cn>
// @include	     *data-baker.com/*
// @match        *data-baker.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406038/%E8%A7%A3%E9%99%A4%E6%A0%87%E8%B4%9D%E8%AF%AD%E9%9F%B3%E8%BD%AC%E6%96%87%E5%AD%97%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/406038/%E8%A7%A3%E9%99%A4%E6%A0%87%E8%B4%9D%E8%AF%AD%E9%9F%B3%E8%BD%AC%E6%96%87%E5%AD%97%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==


(function(){
    dataBaker()
    function dataBaker(){
      let txtArea = document.querySelector('#tts_exp_text')
      txtArea.onfocus = function(){this.id = ''}
      txtArea.onblur = function(){this.id = 'tts_exp_text'}
    }
}());


