// ==UserScript==
// @name         SCNU_JWC
// @namespace    scnu_jwc_fixer
// @version      0.7
// @description  修复华南师范大学教务处恶心的页面
// @author       scnu_geek
// @match        https://jwc.scnu.edu.cn/
// @match        https://jwc.scnu.edu.cn/default2.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36794/SCNU_JWC.user.js
// @updateURL https://update.greasyfork.org/scripts/36794/SCNU_JWC.meta.js
// ==/UserScript==

function sava(){}
function update(){}

(function() {
    'use strict';
    var input_code = document.getElementById('txtSecretCode');
    input_code.style.width = '85px';
    input_code.style.float = 'left';
    input_code.style['margin-right'] = '5px';
    input_code.focus();

    var code_img = document.getElementById('icode');
    code_img.style.left = '';

    document.getElementById('icodems').remove();
    
    document.getElementById('Textbox1').remove();
    var password = document.getElementById('TextBox2');
    password.style.display = '';
    password.onblur = function(){};
    password.onfocus = function(){};
})();