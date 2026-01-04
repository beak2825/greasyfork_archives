// ==UserScript==
// @name         轉盤
// @namespace    http://tampermonkey.net/
// @version      o.Q
// @description  點獎勵清單 然後等他跑完再開始用
// @author       eddy
// @match        https://tw-event.beanfun.com/DragonNest/event/e20230131/Index.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=beanfun.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459235/%E8%BD%89%E7%9B%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/459235/%E8%BD%89%E7%9B%A4.meta.js
// ==/UserScript==

(async () => {
    let itemlist =  {};
    let characters = [];
    let token = '';

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function onResponse(url, responseText) {
        if (url == 'https://tw-event.beanfun.com/DragonNest/api/E20230131/FindRewardLog') {
            let rewardData = JSON.parse(responseText);
            characters = rewardData.Data.Characters;
            for(var i = 0; i < rewardData.Data.Logs.length; i++) {
                let itemname = rewardData.Data.Logs[i].ItemName;
                let seq = rewardData.Data.Logs[i].Seq;
                if (!itemlist[itemname]){
                    itemlist[itemname] = [];
                }
                if (itemlist[itemname].indexOf(seq) === -1) {
                    itemlist[itemname].push(seq);
                }
            }
            console.log(itemlist);
        } else if (url == 'https://tw-event.beanfun.com/DragonNest/api/E20230131/AddRewardLog') {
            let statistics = JSON.parse(window.localStorage.getItem('statistics') || '{}');
            let logs = JSON.parse(responseText).Data.Logs;
            for(let i = 0;i < logs.length;++i){
                if(statistics[logs[i].ItemName]) {} else { statistics[logs[i].ItemName] = 0;}
                statistics[logs[i].ItemName]++;
            }
            console.log(statistics);
            window.localStorage.setItem('statistics', JSON.stringify(statistics));
        }
    }
    function onRequest(body_j) {
        let body = JSON.parse(body_j);
        if (body.CipherText) {
            token = body.CipherText;
        }
        if (body.Seqs) {
            console.log(body);
            console.log('claimed: ' + body.Seqs);
            for (var i = 0; i < body.Seqs.length; ++i) {
                let seq = body.Seqs[i];
                for (var key in itemlist) {
                    const index = itemlist[key].indexOf(seq);
                    if (index > -1) {
                        itemlist[key].splice(index, 1);
                    }
                }
            }
            return JSON.stringify(body);
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

    function claimReward(CharacterId, Seqs) {
        if (!token){
            console.log('no token');
            return;
        }
        let apiRequest = axios.create({baseURL: "../../api/E20230131/"});
        apiRequest.post("/AddItemToGameLog", {
            CharacterId: CharacterId,
            CipherText: token,
            Seqs: Seqs
        });
    }

    async function submitBatch(){
        let charID = Number($('#e_char').val());
        if (charID === -1) {
            console.log('character not selected');
            return;
        }
        let itemID = [];
        $( ".e_item" ).each(function( index ) {
            let key = $(this).attr('id');
            let count = $(this).val();
            if (count == 0) return;
            itemID = itemID.concat(itemlist[key].slice(0,count));
            console.log(key + ':' + count);
        });
        console.log('ready:'+itemID);
        Array.prototype.eachSlice = async function (size, callback){
            for (var i = 0, l = this.length; i < l; i += size){
                callback.call(this, this.slice(i, i + size))
            }
        };
        itemID.eachSlice(8, async (items) => {
            claimReward(charID, items);
            await sleep(1000);
        });
        refreshUI();
    }

    function refreshUI() {
        $("#e_table").remove();
        $("#e_form").remove();
        if (!itemlist) {
            $('#e_ui').append(`<ul id="e_table"> no item </ul>`);
            return;
        }
        if (!characters) {
            $('#e_ui').append(`<ul id="e_table"> no characters </ul>`);
            return;
        }
        console.log(itemlist);
        console.log(characters);
        $('#e_ui').append(`<ul id="e_table">
                              <div style="display: flex;border-bottom: 1px solid #fd6f61">
                                 <div class="" style="padding: 12px; flex:1; border-right: 1px solid #fd6f61;">品項</div>
                                 <div class="" style="padding: 12px; width: 100px; text-align: center; border-right: 1px solid #fd6f61;">數量</div>
                                 <div class="" style="margin-left:6px;margin-right:30px;padding: 12px;width: 150px;text-align: center;">領取數量</div>
                              </div>
                              <div id="e_itemlist" style="height: 600px;overflow-y: overlay;">
                              </div>
                           </ul>
                           <ul id="e_form">
                              <select id="e_char" style="border: 1px solid #fd6f61;padding: 5px;margin:5px;background-color: transparent;color: #fd6f61; line-height: 57px;height: 57px;vertical-align: middle;">
                                 <option value="-1">請選擇帳號</option>
                              </select>
                              <a id="e_submit" style="border: 1px solid #fd6f61;padding: 5px; margin:5px;vertical-align: middle;">領取</a>
                           </ul>`);
        let itemlist_sort = Object.keys(itemlist).sort().reduce((obj, key) => { obj[key] = itemlist[key]; return obj; }, {}); itemlist = itemlist_sort;
        for(let key in itemlist) {
            $('#e_itemlist').append(`<div style="display: flex;">
                                       <div class="" style="padding: 12px; flex:1; border-right: 1px solid #fd6f61;">` + key + `</div>
                                       <div class="" style="padding: 12px; width: 100px; text-align: center; border-right: 1px solid #fd6f61;"> ` + itemlist[key].length + ` </div>
                                       <input type="number" class="e_item" id="`+ key +`" value="0" style="margin:6px; margin-right:30px;padding: 12px;width: 150px;text-align: center;font-size: 25px !important;background-color: transparent;border: 1px solid #fd6f61;color: #fd6f61;" min="0" max="` + itemlist[key].length + `">
                                     </div>`);
        }
        for(let i = 0; i < characters.length;++i) {
            $('#e_char').append(`<option value=` + characters[i].CharacterId + `>` + characters[i].CharacterName + `</option>`);
        }
        $('#e_submit').click(submitBatch);
    }
    await sleep(1000);
    $('.sec1').append(`
                         <div class="container" style="padding-top:0;padding-bottom:77px">
                            <ol class="sec3-list" id="e_ui">
                               <ul style="text-align: center;"><a id="e_openui" style=" border: 1px solid #fd6f61; padding: 5px;">獎勵清單</a></ul>
                            </ol>
                         </div>
    `);
    $('#e_openui').click(async () => {
        $('a[data-btn="get-award"]')[0].click();
        await sleep(1000);
        if ($('.lb-content__account').legnth == 0) {
            return;
        }
        let page = 1;
        do {
            let nextbtn = $("li>span").filter(function() {return $(this).text() === ">";});
            if (nextbtn.length) {
                nextbtn[0].click();
            }
            page++;
            await sleep(1000);
        } while ($("li#" + page).length > 0);
        $('.g-lightbox__close')[0].click();
        refreshUI();
    });
})();

