// ==UserScript==
// @name         2023/7-8轉盤
// @namespace    http://tampermonkey.net/
// @version      0.5
// @author       eddy
// @match        https://tw-event.beanfun.com/DragonNest/EVENT/E20230718/Index.aspx
// @match        https://tw-event.beanfun.com/DragonNest/event/e20230718/Index.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=beanfun.com
// @grant        none
// @description  e20230718
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473033/20237-8%E8%BD%89%E7%9B%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/473033/20237-8%E8%BD%89%E7%9B%A4.meta.js
// ==/UserScript==


(async () => {
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    let token = '';
    let characters = [];
    let itemNames = [];
    let itemSeqLists = [];
    let itemCount = 0;

    let charactersID = -1;
    function onResponse(url, responseText) {
        if (url == 'https://tw-event.beanfun.com/DragonNest/api/E20230718/FindRewardLog') {
            let rewardData = JSON.parse(responseText);

            if (rewardData.Data.Characters) characters = rewardData.Data.Characters;
            itemNames = rewardData.Data.ItemNames;
            itemCount = rewardData.Data.TotalCount;
            let ItemLogs = rewardData.Data.Logs;

            itemSeqLists = [];
            for(var i = 0; i < rewardData.Data.Logs.length; i++) {
                let seq = rewardData.Data.Logs[i].Seq;
                itemSeqLists.push(seq);
            }
        }
    }
    function onRequest(body_j) {
        let body = JSON.parse(body_j);
        if (body.CipherText) {
            token = body.CipherText;
        }
        return body_j;
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
            console.log(this);
            this.addEventListener('load', function() {
                onResponse(this.responseURL, this.responseText);
            });
            origOpen.apply(this, arguments);
        };
    })();

    async function claimReward(CharacterId, Seqs) {
        if (!token){
            console.log('no token');
            return;
        }
        let apiRequest = axios.create({baseURL: "../../api/E20230718/"});
        await apiRequest.post("/AddItemToGameLog", {
            CharacterId: CharacterId,
            CipherText: token,
            Seqs: Seqs
        });
    }

    async function findReward(itemname="", page=1) {
        if (!token){
            console.log('no token');
            return;
        }
        let apiRequest = axios.create({baseURL: "../../api/E20230718/"});
        await apiRequest.post("/FindRewardLog", {
            CipherText: token,
            ItemName: itemname,
            Page: page
        });
    }

    // create ui
    await sleep(1000);
    $('.sec1').after(`
                         <div class="container" style="background-color:transparent;padding-top:0;padding-bottom:77px;margin:0;max-width:none;">
                            <ol id="e_ui" style="color: #e6ffe8;font-size: 35px;font-size: 30px;padding: 14px 0;">
                               <ul style="text-align: center;"><a id="e_openui" style=" border: 1px solid #ffffff; padding: 10px;">批次領獎</a></ul>
                            </ol>
                         </div>
    `);

    async function submitBatch(){
         charactersID = Number($('#e_char').val());
         if (charactersID === -1) { console.log('character not selected'); return; }

         let itemNameID = Number($('#e_item').val());
         if (itemNameID === -1) { console.log('item not selected'); return; }

         let itemName = itemNames[itemNameID];
         let itemClaimCount = Number($('#e_itemcount').val());

         if (confirm('領取 ' + itemName + ' x ' + itemClaimCount + ' ?')) {
             $("#e_char").prop('disabled', true);
             $("#e_itemcount").prop('disabled', true);
             $("#e_item").prop('disabled', true);
             $("#e_submit").prop('disabled', true);

             while (itemClaimCount > 0) {
                 await findReward(itemName);
                 itemSeqLists = itemSeqLists.slice(0,itemClaimCount);
                 await claimReward(charactersID, itemSeqLists);
                 await sleep(500);
                 itemClaimCount -= itemSeqLists.length;
                 $('#e_itemcount').val(itemClaimCount);
             }

             $('a[data-btn="get-award"]')[0].click();
             await sleep(1000);
             $('.g-lightbox__close')[0].click();
             refreshUI();
         }
    }

    function refreshUI() {
        $("#e_form").remove();
        $('#e_ui').append(`<ul id="e_form" style="text-align: center;">
                              <select id="e_char" style="border: 1px solid #e6ffe8;padding: 5px;margin:5px;background-color: transparent;color: #e6ffe8; line-height: 57px;height: 57px;vertical-align: middle;">
                                 <option value="-1">角色</option>
                              </select>
                              <select id="e_item" style="border: 1px solid #e6ffe8;padding: 5px;margin:5px;background-color: transparent;color: #e6ffe8; line-height: 57px;height: 57px;vertical-align: middle;">
                                 <option value="-1">物品</option>
                              </select>
                              <input type="number" id="e_itemcount" value="0" style="margin:6px; margin-right:30px;padding: 12px;width: 150px;text-align: center;font-size: 25px !important;background-color: transparent;border: 1px solid #e6ffe8;color: #e6ffe8;" min="0" max="0">
                              <a id="e_submit" style="font-size:30px; border: 1px solid #e6ffe8;padding: 10px; margin:5px;vertical-align: middle;">領取</a>
                           </ul>`);
        for(let i = 0; i < characters.length;++i) {
            $('#e_char').append(`<option value=` + characters[i].CharacterId + ` style="color:black">` + characters[i].CharacterName + `</option>`);
        }
        for(let i = 0; i < itemNames.length;++i) {
            $('#e_item').append(`<option value=` + i + ` style="color:black">` + itemNames[i] + `</option>`);
        }
        $('#e_char').val(charactersID);
        $('#e_item').change(async function(){
            await findReward(itemNames[$('#e_item').val()]);
            console.log(itemCount);
            $('#e_itemcount').attr('max', itemCount);
            $('#e_itemcount').attr('value', itemCount);
        });
        $('#e_submit').click(submitBatch);
    }

    $('#e_openui').click(async () => {
        $('a[data-btn="get-award"]')[0].click();
        await sleep(1000);
        $('.g-lightbox__close')[0].click();
         refreshUI();
    });
})();