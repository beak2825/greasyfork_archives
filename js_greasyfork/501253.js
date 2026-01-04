// ==UserScript==
// @name         2025轉盤
// @namespace    http://tampermonkey.net/
// @version      0.5
// @author       eddy
// @match        https://dragonnest-event.beanfun.com/Event/E20250121/Index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=beanfun.com
// @grant        none
// @description  E20250121
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501253/2025%E8%BD%89%E7%9B%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/501253/2025%E8%BD%89%E7%9B%A4.meta.js
// ==/UserScript==


(async () => {
    const sleep = ms => new Promise(res => setTimeout(res, ms));

    let token = '';
    let characters = [];
    let items = [];

    let selectedCharacterID = -1;

    function onResponse(url, responseText) {
        if (url == 'https://dragonnest-event.beanfun.com/api/E20250121/GetLotteryItemsLog') {
            let responseObject = JSON.parse(responseText);

            if (responseObject.data.characters) characters = responseObject.data.characters.sort((a,b)=>b.characterName.localeCompare(a.characterName));
            items = responseObject.data.lotteryItemITGLogs;
            console.table(characters);
            console.table(items);
        }
    }
    function onRequest(body) {
        let bodyObject = JSON.parse(body);
        if (bodyObject.token) {
            token = bodyObject.token;
        }
        return body;
    }
    (function() {
        var origOpen = XMLHttpRequest.prototype.open;
        var origSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            if (arguments[0]) {
                arguments[0] =onRequest(arguments[0]);
            }
            origSend.apply(this, arguments);
        }
        XMLHttpRequest.prototype.open = function() {
            //console.log(this);
            this.addEventListener('load', function() {
                onResponse(this.responseURL, this.responseText);
            });
            origOpen.apply(this, arguments);
        };
    })();

    async function claimReward(CharacterId, itemCode, amount, cnt) {
        if (!token){
            console.log('no token');
            return;
        }

        let obj = {
            "characterId": CharacterId,
            "itemCode": itemCode, 
            "amount": amount,
            "cnt": cnt,
            "token": token
        };
        let resCode = -1;
        await axios({
			method: "post",
			url: "../../api/E20250121/InsertItemToGameLog",
			data: obj
		}).then(function ($res) {
            let res = $res.data;
            resCode = res.code;
            if (resCode != 1) {
                console.log(res.message);
            }
        }).catch(function (error) {
            console.log(error);
        });
        return resCode;
    }

    // create ui
    await sleep(1000);
    $('.header').after(`
                         <div class="container" style="background-color:transparent;padding-top:0;padding-bottom:77px;margin:0;max-width:none;">
                            <div id="e_ui" style="color:#ff4242;font-size:20px;padding:14px 0;">
                               <ul style="text-align: center;"><a id="e_openui" style="border:2px solid #ff4242;padding:10px;">批次領獎</a></ul>
                            </div>
                         </div>
    `);

    function showLog(text) {
        $('#e_status').text(text);
    }

    async function submitBatch(){
         selectedCharacterID = Number($('#e_char').val());

         if (selectedCharacterID === -1) { showLog('未選擇角色'); return; }

         let itemList = [];
         $( ".e_item" ).each(function( index ) {
             let itemCode = $(this).attr('id');
             let itemCnt = Number($(this).val());
             if (itemCnt == 0) return;
             itemList.push({itemCode: itemCode, itemName: items.find((a)=> a.itemCode == itemCode).itemName, itemCnt: itemCnt});
         });
         console.log('領取列表:')
         console.table(itemList);

         if (confirm('領取道具到 (' + selectedCharacterID + ') ' + characters.find((a)=> a.characterId == selectedCharacterID).characterName + ' ? 開始領取後如要中斷請關閉網頁')) {
             $("#e_char").prop('disabled', true);
             $("#e_submit").prop('disabled', true);

             let fails = [];
             for(let i=0;i<itemList.length;++i) {
                 let itemCode = itemList[i].itemCode;
                 let total = itemList[i].itemCnt;
                 let remain = itemList[i].itemCnt;

                 showLog('[' + (i+1) + '/' + (itemList.length) + '] ' + itemList[i].itemName);

                 let resCode = 1;
                 while(remain > 0) {
                     showLog('[' + (i+1) + '/' + (itemList.length) + '] ' + itemList[i].itemName + ' (' + (total-remain) + '/' + total + ')');

                     if (remain >= 100 && resCode == 1) {
                         let count = Math.min(9,Math.floor(remain/100));
                         resCode = await claimReward(selectedCharacterID, itemCode, 100, count);
                         if (resCode == 1) {
                             remain = remain - count * 100;
                         }
                     } else if (remain >= 10 && resCode == 1) {
                         let count = Math.floor(remain/10);
                         resCode = await claimReward(selectedCharacterID, itemCode, 10, count);
                         if (resCode == 1) {
                             remain = remain - count * 10;
                         }
                     } else {
                         let count = (resCode==1) ? (remain>9?9:remain) : 1;
                         resCode = await claimReward(selectedCharacterID, itemCode, 1, count);
                         if (resCode == 1) {
                             remain = remain - count;
                         }
                         if (resCode != 1 && count == 1) {
                             fails.push(itemList[i].itemName);
                             break;
                         }
                     }
                     await sleep(1000);
                 }

             }
             await clickGetAward();
             refreshUI();
             if (fails.length == 0) {
                 showLog('全部成功');
             } else {
                 showLog('領取以下道具時出錯, 請檢查數量: ' + fails.join(','));
             }
         }
    }

    function refreshUI() {
        $("#e_form").remove();
        $("#e_table").remove();
        $('#e_ui').append(`
                           <div id="e_form" style="width:1200px;margin:auto;text-align:center">
                              <select id="e_char" style="border:1px solid #ff4242;padding:5px;margin:5px;background-color:transparent;color:#ff4242;vertical-align:middle;margin:auto">
                                 <option value="-1">請選擇帳號</option>
                              </select>
                              <a id="e_submit" style="border:1px solid #ff4242;padding:5px;margin:5px;vertical-align:middle;">領取</a>
                              <div id="e_status"></div>
                           </div>
                           <div id="e_table" style="width:1200px;margin:auto;height:800px;overflow-y:overlay;">
                              <div style="display: flex;border-bottom:1px solid #ff4242">
                                 <div style="padding:12px;flex:1;border-right:1px solid #ff4242;">品項</div>
                                 <div style="padding:12px;width:100px;text-align:center;border-right:1px solid #ff4242;">數量</div>
                                 <div style="padding:12px;width:250px;text-align:center;">領取數量</div>
                              </div>
                              <div id="e_itemlist">
                              </div>
                           </div>
                           `);
        for(let i = 0; i < items.length; ++i) {
            $('#e_itemlist').append(`<div style="display: flex;">
                                       <div style="padding:5px 12px 5px 12px;flex:1; border-right: 1px solid #ff4242;">` + items[i].itemName + `</div>
                                       <div style="padding:5px 12px 5px 12px;width:100px; text-align: center; border-right: 1px solid #ff4242;"> ` + items[i].cnt + ` </div>
                                       <input type="number" class="e_item" id="`+ + items[i].itemCode +`" value="0" onclick="this.select();" style="width:250px;padding:5px 12px 5px 12px;text-align:center;background-color:transparent;border:none;color:#ff4242;" min="0" max="` + items[i].cnt + `">
                                     </div>`);
        }
        $(document).on('change', ".e_item", function enforceMinMax(e) {
            console.log(this);
            if (this.value != "") {
                if (parseInt(this.value) < parseInt(this.min)) {
                    this.value = this.min;
                }
                if (parseInt(this.value) > parseInt(this.max)) {
                    this.value = this.max;
                }
            }
        })
        for(let i = 0; i < characters.length; ++i) {
            $('#e_char').append(`<option value=` + characters[i].characterId + `>` + characters[i].characterName + `</option>`);
        }
        $('#e_char').val(selectedCharacterID);
        $('#e_submit').click(submitBatch);
    }


    async function clickGetAward() {
        $('.getAward')[0].click();
        while(1) {
            await sleep(1000);
            if ($('.gbox-close')[0]) {
                $('.gbox-close')[0].click();
                break;
            }
        }
    }

    $('#e_openui').click(async () => {
        await clickGetAward();
        refreshUI();
    });
})();