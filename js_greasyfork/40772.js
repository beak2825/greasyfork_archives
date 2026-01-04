// ==UserScript==
// @name         GFStockAutoFoundation
// @namespace    JuicefishTest
// @version      0.0.5
// @description  N/A
// @author       Juciefish
// @match        https://acgn-stock.com/*
// @match        https://test.acgn-stock.com/*
// @downloadURL https://update.greasyfork.org/scripts/40772/GFStockAutoFoundation.user.js
// @updateURL https://update.greasyfork.org/scripts/40772/GFStockAutoFoundation.meta.js
// ==/UserScript==
// ********************************************************************************
// ********************************************************************************

// 預約投資的預留秒數
var foundationPreparetime = 30;

// 預約投資的預設金額
var foundationDefaultAmount = 4096;

// 在新創列表加入預約投資
Template.foundationListCard.onRendered(() => {
    function insertAfterLastRow(border, row) {
        instance.$(".btn-group").last().after(row).after(border);
    }

    const instance = Template.instance();
    const borderSample =  instance.$(".m-0").last();
    const rowBtnSample = instance.$(".btn-group").last();
    const foundationRegisterRow = rowBtnSample.clone();
    const foundationTimeRow = rowBtnSample.clone();
    const foundationAmountRow = rowBtnSample.clone();
    const foundationData = Template.currentData();
    foundationRegisterRow.html(
        `
        <button id="btn_foundation_` + foundationData._id + `" class="btn btn-primary" type="button" onclick="
            var foundationID = '` + foundationData._id + `';
            var foundationName = '` + foundationData.companyName + `';
            var foundationCreateAt = ` + foundationData.createdAt.getTime() + `;
            var targetTime = parseInt(foundationCreateAt) + 12 * 60 * 60 * 1000;
            var remainTime = Math.floor((targetTime - Date.now()) / 1000);
            var prepareTime;

            if(window['foundationAmount_` + foundationData._id + `'] === undefined)
                window['foundationAmount_` + foundationData._id + `'] = ` + foundationDefaultAmount + `;
            if(window['foundationTime_` + foundationData._id + `'] === undefined)
                window['foundationTime_` + foundationData._id + `'] = ` + foundationPreparetime + `;

            prepareTime = window['foundationTime_` + foundationData._id + `'];

            if(window.foundationTimeoutInstance` + foundationData._id + ` === undefined)
            {
                console.log('--------------------------------------------');
                console.log('投資公司 Ｉ　　Ｄ : ' + foundationID);
                console.log('投資公司 名　　稱 : ' + foundationName);
                console.log('投資公司 創立時間 : ' + foundationCreateAt);
                console.log('投資公司 剩餘時間 : ' + remainTime + '秒');
                console.log('對公司[' + foundationName + '] 再過 ' + (remainTime - prepareTime) + ' 秒後進行增資');
                FoundationCountDown(targetTime - prepareTime * 1000);
                //FoundationCountDown(Date.now() + prepareTime * 1000);

                document.getElementById('btn_foundation_time_down` + foundationData._id + `').disabled=true;
                document.getElementById('btn_foundation_time_up` + foundationData._id + `').disabled=true;
                //document.getElementById('btn_foundation_down` + foundationData._id + `').removeAttribute('hidden');
                //document.getElementById('btn_foundation_up` + foundationData._id + `').removeAttribute('hidden');
                //document.getElementById('txt_foundation_amount` + foundationData._id + `').removeAttribute('hidden');
            }
            else
            {
                clearTimeout(window.foundationTimeoutInstance` + foundationData._id + `);
                window.foundationTimeoutInstance` + foundationData._id + ` = undefined;
                document.getElementById('btn_foundation_` + foundationData._id + `').innerHTML = '進行預約';

                document.getElementById('btn_foundation_time_down` + foundationData._id + `').disabled=false;
                document.getElementById('btn_foundation_time_up` + foundationData._id + `').disabled=false;
                //document.getElementById('btn_foundation_down` + foundationData._id + `').setAttribute('hidden', true);
                //document.getElementById('btn_foundation_up` + foundationData._id + `').setAttribute('hidden', true);
                //document.getElementById('txt_foundation_amount` + foundationData._id + `').setAttribute('hidden', true);
            }

            function FoundationCountDown(a_targetTime)
            {
                var remainTime = Math.floor((a_targetTime - Date.now()) / 1000);

                // 預留30~35秒先恢復連線
                if(30 < remainTime  && remainTime < 35)
                    UserStatus.pingMonitor()

                if(remainTime > 0)
                {
                    document.getElementById('btn_foundation_` + foundationData._id + `').innerHTML = (remainTime >= 60 ? '還有 ' + Math.floor(remainTime/60) + ' 分 ' + (remainTime%60) + ' 秒' : '還有 ' + remainTime + ' 秒');
                    window.foundationTimeoutInstance` + foundationData._id + ` = setTimeout(FoundationCountDown, 1000, a_targetTime);
                }
                else
                {
                    document.getElementById('btn_foundation_` + foundationData._id + `').disabled = true;
                    FoundationNow();
                }
            }

            function FoundationNow()
            {
                var isFounded = _.findWhere(Meteor.connection._mongo_livedata_collections.foundations.findOne(foundationID)['invest'], {userId:Meteor.userId()});
                var remainAmount = window['foundationAmount_` + foundationData._id + `'];

                if(isFounded !== undefined)
                    remainAmount = remainAmount - isFounded.amount;

                console.log('對公司[' + foundationName + '] 進行投資 ' + remainAmount + ' 元');
                Meteor.customCall('investFoundCompany', foundationID, remainAmount);
            }
        ">進行預約</button>
        `
    );

    foundationTimeRow.html(
        `
        <p id="txt_foundation_time_title_` + foundationData._id + `" style="line-height:0px; padding-left:18px; padding-top:20px">提前時間：</p>
        <button id="btn_foundation_time_down` + foundationData._id + `" class="btn btn-tab" onclick="
            if(window['foundationTime_` + foundationData._id + `'] === undefined)
                window['foundationTime_` + foundationData._id + `'] = ` + foundationPreparetime + `;
            if(window['foundationTime_` + foundationData._id + `'] > 10)
            {
                if(window['foundationTime_` + foundationData._id + `'] >= 120)
                    window['foundationTime_` + foundationData._id + `'] -= 60;
                else
                    window['foundationTime_` + foundationData._id + `'] -= 10;

                var prepareTime = window['foundationTime_` + foundationData._id + `'];
                document.getElementById('txt_foundation_time` + foundationData._id + `').innerHTML = (prepareTime >= 60 ? (prepareTime / 60) + ' 分鐘' : prepareTime + ' 秒');
            }
        ">▾</button>
        <p id="txt_foundation_time` + foundationData._id + `" style="line-height:0px; padding-top:20px">` + foundationPreparetime + ` 秒</p>
        <button id="btn_foundation_time_up` + foundationData._id + `" class="btn btn-tab" onclick="
            if(window['foundationTime_` + foundationData._id + `'] === undefined)
                window['foundationTime_` + foundationData._id + `'] = ` + foundationPreparetime + `;
            if(window['foundationTime_` + foundationData._id + `'] < 600)
            {
                if(window['foundationTime_` + foundationData._id + `'] < 60)
                    window['foundationTime_` + foundationData._id + `'] += 10;
                else
                    window['foundationTime_` + foundationData._id + `'] += 60;

                var prepareTime = window['foundationTime_` + foundationData._id + `'];
                document.getElementById('txt_foundation_time` + foundationData._id + `').innerHTML = (prepareTime >= 60 ? (prepareTime / 60) + ' 分鐘' : prepareTime + ' 秒');
            }
        ">▴</button>
        `
    );

    foundationAmountRow.html(
        `
        <p id="txt_foundation_amount_title_` + foundationData._id + `" style="line-height:0px; padding-left:18px; padding-top:20px">補足額度：</p>
        <button id="btn_foundation_down` + foundationData._id + `" class="btn btn-tab" onclick="
            if(window['foundationAmount_` + foundationData._id + `'] === undefined)
                window['foundationAmount_` + foundationData._id + `'] = ` + foundationDefaultAmount + `;
            if(window['foundationAmount_` + foundationData._id + `'] > 64)
            {
                window['foundationAmount_` + foundationData._id + `'] = window['foundationAmount_` + foundationData._id + `'] / 2;
                document.getElementById('txt_foundation_amount` + foundationData._id + `').innerHTML = window['foundationAmount_` + foundationData._id + `'] + ' 元';
            }
        ">▾</button>
        <p id="txt_foundation_amount` + foundationData._id + `" style="line-height:0px; padding-top:20px">` + foundationDefaultAmount + ` 元</p>
        <button id="btn_foundation_up` + foundationData._id + `" class="btn btn-tab" onclick="
            if(window['foundationAmount_` + foundationData._id + `'] === undefined)
                window['foundationAmount_` + foundationData._id + `'] = ` + foundationDefaultAmount + `;
            if(window['foundationAmount_` + foundationData._id + `'] < 4096)
            {
                window['foundationAmount_` + foundationData._id + `'] = window['foundationAmount_` + foundationData._id + `'] * 2;
                document.getElementById('txt_foundation_amount` + foundationData._id + `').innerHTML = window['foundationAmount_` + foundationData._id + `'] + ' 元';
            }
        ">▴</button>
        `
    );
    insertAfterLastRow(borderSample.clone(), foundationRegisterRow);
    insertAfterLastRow(borderSample.clone(), foundationTimeRow);
    insertAfterLastRow(borderSample.clone(), foundationAmountRow);
});
