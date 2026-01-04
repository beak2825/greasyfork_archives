// ==UserScript==
// @name         多选框选择
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  测试
// @author       Meko
// @match        *://208.77.1.239/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/533217/%E5%A4%9A%E9%80%89%E6%A1%86%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/533217/%E5%A4%9A%E9%80%89%E6%A1%86%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const db=document.getElementsByName('db');
    db[2].checked=true;

    var oBtn=document.createElement("input");
    oBtn.type="button";
    oBtn.value="常用";
    oBtn.onclick=selectMostLikely;

    var checkTable=document.getElementsByTagName('table')[4];
    var btnRowCell02=checkTable.rows[0].cells[2];
    btnRowCell02.appendChild(oBtn);

    //debugger;
    function selectMostLikely(){
        //debugger;
        db[2].checked=true;

        const trebuchet=document.querySelectorAll('input[type=checkbox]');
        for(var i=0;i<trebuchet.length;i++){
            trebuchet[i].checked=false;
        }

        document.getElementsByName('col_START_TIME')[0].checked=true;
        document.getElementsByName('col_CALLED_PARTY_FROM_SRC')[0].checked=true;
        document.getElementsByName('col_ANI')[0].checked=true;
        document.getElementsByName('col_CALL_SOURCE_REGID')[0].checked=true;
        document.getElementsByName('col_CALL_DEST_REGID')[0].checked=true;
        document.getElementsByName('col_NEW_ANI')[0].checked=true;
        document.getElementsByName('col_CALL_DEST')[0].checked=true;
        document.getElementsByName('col_CALL_SOURCE')[0].checked=true;
        document.getElementsByName('col_CALLED_PARTY_ON_DEST')[0].checked=true;
        document.getElementsByName('col_SYSTEM_ID')[0].checked=true;
        document.getElementsByName('col_CALL_HOLD_TIME')[0].checked=true;
        document.getElementsByName('col_CALL_DURATION_STR')[0].checked=true;
        document.getElementsByName('col_ACCTID')[0].checked=true;
        document.getElementsByName('col_RATE_EGR')[0].checked=true;
        document.getElementsByName('col_CALL_DIRECTION')[0].checked=true;
        document.getElementsByName('col_CDRID')[0].checked=true;
        document.getElementsByName('col_CALL_SOURCE_REALM_NAME')[0].checked=true;
        document.getElementsByName('col_CALL_DURATION')[0].checked=true;
        document.getElementsByName('col_CALL_PDD')[0].checked=true;
        document.getElementsByName('col_CALLID')[0].checked=true;
        //document.getElementsByName('col_')[0].checked=true;
        //document.getElementsByName('col_')[0].checked=true;
        //debugger;
    }

    console.log('HelloWorld');
})();