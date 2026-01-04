// ==UserScript==
// @name         thsrc
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  高鐵車票
// @author       aKan
// @match        https://irs.thsrc.com.tw/IMINT
// @match        https://irs.thsrc.com.tw/IMINT/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404204/thsrc.user.js
// @updateURL https://update.greasyfork.org/scripts/404204/thsrc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {

        let startStation = '台北';
        let destinationStation = '左營';

        let seatRadio = 1;           // 0=無, 1=靠窗優先(預設), 2=走道優先
        let bookingMethod = 1;       // 0=依時間搜尋合適車次, 1=直接輸入車次號碼
        let returnCheckBox = 1;      // 預設: 訂購回程
        let ticketAmount = '1';      // 全票: 0-10 張

        let toDate = '2020/09/30';   // 去程日期
        let toTimeTable = '18:50';   // 去程時間
        let toTrainID = '249'        // 去程車次

        let backDate = '2020/10/03'; // 回程日期
        let backTimeTable = '16:50'; // 回程時間
        let backTrainID = '144';     // 回程車次

        // 起程站 //
        $("select[name='selectStartStation'] option")
            .filter(function() { return this.text == startStation; })
            .attr('selected', true);

        // 到達站 //
        $("select[name='selectDestinationStation'] option")
            .filter(function() { return this.text == destinationStation; })
            .attr('selected', true);

        // 標準車廂 //
        //$("input[id='trainCon:trainRadioGroup_0']").click();
        //$("input[id='trainCon:trainRadioGroup_1']").click();

        // 座位喜好 (先解鎖 disabled) //
        $("input[name='seatCon:seatRadioGroup']").each(function() {
            $(this).attr('disabled', false);
        });
        switch (seatRadio) {
            case 0: $("input#seatRadio0.input1").click();
            case 1: $("input#seatRadio1.input1").click();
            case 2: $("input#seatRadio2.input1").click();
            default:
                $("input#seatRadio1.input1").click();
        }

        // 訂位方式 //
        if (bookingMethod) $("#bookingMethod_1").click();
        if (returnCheckBox) $("#returnCheckBox").click();

        // 去程 //
        $("input#toTimeInputField").val(toDate);
        $("input[name='toTrainIDInputField']").val(toTrainID);
        $("select[name='toTimeTable'] option")
            .filter(function() { return this.text == toTimeTable; })
            .attr('selected', true);

        // 回程 //
        $("input#backTimeInputField").val(backDate);
        $("input[name='backTrainIDInputField']").val(backTrainID);
        $("select[name='backTimeTable'] option")
            .filter(function() { return this.text == backTimeTable; })
            .attr('selected', true);

        // 票數 //
        $("select[name='ticketPanel:rows:0:ticketAmount'] option")
            .filter(function() { return this.text == ticketAmount; })
            .attr('selected', true);

        // 驗證碼駐點 //
        $("input#securityCode.input1").focus();
    });
})();
