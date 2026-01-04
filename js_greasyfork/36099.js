// ==UserScript==
// @name         优化ops
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       novo
// @match        *://ops.ms.ttacp8.com/*
// @match        *://ops.ms.rrzcp8.com/*
// @match        *://ops.ms.vvcvv8.com/*
// @grant        none
// @require      http://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// @downloadURL https://update.greasyfork.org/scripts/36099/%E4%BC%98%E5%8C%96ops.user.js
// @updateURL https://update.greasyfork.org/scripts/36099/%E4%BC%98%E5%8C%96ops.meta.js
// ==/UserScript==

function custom() {
    // 记住上次选的项目
    function c(name, value){
        var k = "t_" + name;
        if(value) {
            $.cookie(k, value);
            return;
        }
        return $.cookie(k);
    }

    var pSelect = $("#navbar select");
    pSelect.change(function(){c('top_project', pSelect.val());});
    var project = c('top_project');
    console.log(pSelect.val(), project);
    if (project && pSelect.val() != project) {
        pSelect.val(project);
    }

    // form 记录上次选的东西
    $('form[action="/deploy"] select, form[action="/deploy"] input').change(function(){c($(this).attr("id"), $(this).val());});
    function valAndFireChange(id) {
        console.log(id, c(id), $('#' + id));
        if(c(id)) {
            $('#' + id).val(c(id)).trigger('change');
        }
    }
    valAndFireChange('product');
    valAndFireChange('project');
    valAndFireChange('env');
    valAndFireChange('git_back_branch');
    valAndFireChange('git_front_branch');
    $('#product').focus();
}

setTimeout(custom, 0);