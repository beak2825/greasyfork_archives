// ==UserScript==
// @name         凯哥专门给特哥打造的神器-爱的魔力棒棒
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  europa一键选择神器
// @author       K
// @match        https://euipo.europa.eu/ohimportal/en/gsbuilder
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/428851/%E5%87%AF%E5%93%A5%E4%B8%93%E9%97%A8%E7%BB%99%E7%89%B9%E5%93%A5%E6%89%93%E9%80%A0%E7%9A%84%E7%A5%9E%E5%99%A8-%E7%88%B1%E7%9A%84%E9%AD%94%E5%8A%9B%E6%A3%92%E6%A3%92.user.js
// @updateURL https://update.greasyfork.org/scripts/428851/%E5%87%AF%E5%93%A5%E4%B8%93%E9%97%A8%E7%BB%99%E7%89%B9%E5%93%A5%E6%89%93%E9%80%A0%E7%9A%84%E7%A5%9E%E5%99%A8-%E7%88%B1%E7%9A%84%E9%AD%94%E5%8A%9B%E6%A3%92%E6%A3%92.meta.js
// ==/UserScript==


//核心程序
(function () {
    'use strict';
    //UI界面元素
    // $("#modal-gs").append('    <div style="width:100px; height:30px; position: fixed; background: red; right:0;">\
    //     <button id="all">一键全选</button>\
    // </div>');

    $("#gs-search div.span8").append('<button id="all">一键全选</button>');

    $("#all").click(function()
    {
        // console.log($("#gs-terms tbody tr")[0]);
        $("#gs-terms tbody tr label").trigger("click");
        // $("input[type='checkbox']").prop("checked", true);
    });

})();

