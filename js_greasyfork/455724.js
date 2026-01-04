// ==UserScript==
// @name         websocket-test.com
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  websocket-test.com 本地测试
// @author       You
// @match        *://*.websocket-test.com/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455724/websocket-testcom.user.js
// @updateURL https://update.greasyfork.org/scripts/455724/websocket-testcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var data={"id":11,"method":"capture_showForm","params":[{url:"http://www.baidu.com"}]}

    $('#inp_url').val('ws://127.0.0.1:17777');

    var btn = $('<textarea id="txt_data" class="form-control" style="height:100px;"></textarea><br>').val(JSON.stringify(data));
    $('#inp_send').before(btn);

    function setDataaaa(){
        console.info(11111);
        $('#inp_send').val($('#txt_data').val());
    }
    setDataaaa();
    $('#div_msg').html('');

    $('#btn_send').removeAttr('onclick');

    $('#btn_send').on('click',function(){
        fun_sendto();
        window.setTimeout(setDataaaa,300);
    });

    window.setTimeout(fun_initWebSocket,1000);

    var txt2 = $('<a href="javascript:;" style="margin-left:20px;"></a>').text("Clean");
    $('.panel-heading').append(txt2);
    $(txt2).on('click',function(){
        $('#div_msg').html('');
    });

})();