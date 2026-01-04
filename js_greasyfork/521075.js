// ==UserScript==
// @name         其他系統掃描發貨
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-10-17
// @description  其他系統掃描發貨-功能
// @author       You
// @match        https://world.keyouyun.com/packages/scan-ship
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keyouyun.com
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/521075/%E5%85%B6%E4%BB%96%E7%B3%BB%E7%B5%B1%E6%8E%83%E6%8F%8F%E7%99%BC%E8%B2%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/521075/%E5%85%B6%E4%BB%96%E7%B3%BB%E7%B5%B1%E6%8E%83%E6%8F%8F%E7%99%BC%E8%B2%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{

        var button = $('div.v-input:contains("訂單號")').last().parent();
        button.after(`
        <div data-v-b058e484="" class="v-input v-text-field v-text-field--enclosed v-text-field--outline v-input--is-focused theme--light primary--text">
          <div class="v-input__control">
            <div class="v-input__slot">
              <div class="v-text-field__slot">
                <label aria-hidden="true" class="v-label v-label--active theme--light primary--text" style="left: 0px; right: auto; position: absolute;">其他系統訂單號</label>
                <input aria-label="其他系統訂單號" autofocus="autofocus" type="text" id="ethanId">
              </div>
              <div class="v-input__append-inner">
                <div class="v-input__icon v-input__icon--">
                  <i aria-hidden="true" class="v-icon v-icon--link material-icons theme--light"></i>
                </div>
              </div>
            </div>
            <div class="v-text-field__details">
              <div class="v-messages theme--light">
                <div class="v-messages__wrapper">
                  <div class="v-messages__message">使用掃碼槍或手動輸入後按回車Enter完成掃描操作</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    `);
        button.hide();
        var input = button.find('input');
        var triggerButton = $('button:contains("確認")');
        $('#ethanId').focus();
        $('#ethanId').keypress(function (e) {
            var key = e.which;
            if(key == 13){// the enter key code
                var targetValue = "XX";
                if(mapping[$(this).val()]){
                    targetValue = mapping[$(this).val()];
                }
                inputChangeValue(input.get(0), targetValue);
                console.log(input);

                triggerButton.trigger('click');
                triggerButton.click();
                $(this).val("");
                console.log(triggerButton);
            }
        });
    },2000);

    var mapping={
        "035300010331506":"2412173KPB5S2E",
        "035300010331694":"2412184E96KB7Q",
        "035300010331792":"24121858VECAN1",


    };
    function inputChangeValue(input, newValue){
        let lastValue = input.value;
        input.value = newValue;
        let event = new Event('input', { bubbles: true });
        // hack React15
        event.simulated = true;
        // hack React16 内部定义了descriptor拦截value，此处重置状态
        let tracker = input._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        input.dispatchEvent(event);
    }

    // Your code here...
})();