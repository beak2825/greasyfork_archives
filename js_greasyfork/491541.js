function autoClaimDropLayout($,i18n,option) {
    // 获取窗口宽度
    var windowWidth = $(window).width();
    //console.log("初始窗口宽度: " + windowWidth);
    let wrapWidth = windowWidth > 640 ? '380px' : '86%';
    let wrapLeft = windowWidth > 640 ? '60px' : '7%';
    let logRow = windowWidth > 640 ? 24 : 22;
    let tipName = 'FCFC';
    var html = `<div id="drop-status" style="position:fixed;right: 0;top:255px;width:42px;height:30px;text-align:center;line-height:30px;background:#1475E1;color:#fff;font-size:12px;cursor:pointer;z-index:1000001;border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;">日志</div>
                <div id="autoDropwrap" style="position:fixed;top:72px;left:${wrapLeft};z-index:1000000;background:rgba(0,0,0,.5);border-radius:5px;width:${wrapWidth}">
                    <div style="padding:10px;background:#213743;margin:0 auto;border-radius:5px;border:1px solid #43576d;">
                         <div style="display:flex;align-items:center;justify-content: space-between;">
                             <div style="font-size:14px;font-weight:bold;color:#fff">Auto claim drop <span class="version"></span></div>
                             <div class="status" style="width:10px;height:10px;border-radius:10px;background:red;"></div>
                         </div>
                         <textarea class="log scrollY" cols="54" rows="${logRow}" readonly value="" style="padding:5px;margin-top:10px;font-size:0.74rem;background:#0F212E;border-radius:4px;outline: none;font-family:auto;width:100%;border:1px solid #3b4959;"></textarea>
                         <div style="display:flex;align-items:center;justify-content: space-between;margin-top:10px;">
                             <div style="display:flex;align-items:center;color:var(--grey-100);">
                                 <span style="font-size:12px;">${i18n.balance}：</span>
                                 <div class="balance" style="font-size:12px">0</div><span style="font-size:12px;margin-left:2px;">USD</span>
                            </div>
                            <a href="${option.webSiteUrl}/?tab=tip&currency=trx&modal=wallet&name=${option.tipName}" target="_blank" style="font-size:0.75rem;color:var(--grey-100);">→${i18n.sendTip}</a>
                         </div>
                         <div style="display:flex;align-items:center;justify-content: space-between;flex-wrap:wrap;">
                             <div style="display:flex;align-items:center;margin-top:10px;margin-right:5px;">
                                 <div style="display:flex;align-items:center;border:1px solid #2F4553;border-radius:4px;overflow:hidden;">
                                     <input class="coin-qty" value='' type=number min="1" placeholder="${i18n.placeholder}" style="padding:5px;height:30px;background:#0F212E;border-right:1px solid #2F4553;font-size:12px;color:#B1BAD3"/>
                                     <select name="coin" class="coin" style="padding:0 5px;height:30px;background: #0F212E;text-align: center;font-size: 12px;">
                                         <option value="" disabled selected>${i18n.currency}</option>
                                         <option value="usdt">USDT</option>
                                         <option value="trx">TRX</option>
                                         <option value="btc">BTC</option>
                                         <option value="eth">ETH</option>
                                         <option value="ltc">LTC</option>
                                         <option value="xrp">XRP</option>
                                         <option value="doge">DOGE</option>
                                         <option value="bnb">BNB</option>
                                     </select>
                                 </div>
                                 ≈$<span class="usd-amount"></span>
                             </div>
                             <button class="get-balance-btn" disabled style="padding: 0 5px;height: 30px;border-radius: 4px;background: #1475E1;color:#fff;font-size:0.7rem;cursor:no-drop;margin-top:10px;opacity:0.6;">${i18n.getBalance}</button>
                         </div>
                     </div>
               </div>`
    $('body').append(html);
    if (GM_addStyle) {
        GM_addStyle('#autoDropwrap .coin-qty::-webkit-inner-spin-button,.no-spinners::-webkit-outer-spin-button{-webkit-appearance: none;margin: 0;}');
        GM_addStyle('#autoDropwrap .coin-qty::-webkit-input-placeholder {color: #778699}');
    }

    $('#drop-status').click(function(){
        $('#autoDropwrap').toggle();
    })
}