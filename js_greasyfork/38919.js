// ==UserScript==
// @name         捷报转结算上传文档
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  给捷报转结算上传文档增加直接上传文件到文档系统的按钮
// @author       ZMeng
// @match        http://172.16.0.85/JBao2BdxSettle/Dec/DecList.aspx
// @match        http://172.16.0.21/JBao2BdxSettle/Dec/DecList.aspx
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38919/%E6%8D%B7%E6%8A%A5%E8%BD%AC%E7%BB%93%E7%AE%97%E4%B8%8A%E4%BC%A0%E6%96%87%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/38919/%E6%8D%B7%E6%8A%A5%E8%BD%AC%E7%BB%93%E7%AE%97%E4%B8%8A%E4%BC%A0%E6%96%87%E6%A1%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var html='<div class="col-xs-3"><div class="input-group">' +
        '      <input type="text" class="form-control" id="myEmail" placeholder="邮箱帐号" style="height:30px;top:-2px;">' +
        '      <span class="input-group-btn">' +
        '        <button class="btn btn-default btn-sm" type="button" id="uploadDoc">上传文档</button>' +
        '      </span>' +
        '    </div></div>';
    $('#formDecList>div>div').eq(2).append(html);

    $('#uploadDoc').click(function (){
        var $chk=$('#DecJBaoList tbody').find(':checkbox:checked');
        var email=$.trim($('#myEmail').val());
        if(email==''){
            alert('请填写你的邮箱帐号');
            return false;
        }
        if($chk.length!=1){
            alert('未选择信息或选择了多条');
            return false;
        }
        var refencesNo=$chk.val();
        var entryId=$chk.parents('tr').find('td').eq(4).text();
        window.open('http://115.29.37.8:8088/UploadInterface/UploadIframe?UserID='+email+'&FolderID=27&KeyWord=报关单号:'+entryId+';托书编号:'+refencesNo+';IsHidden:1');
    });
})();

