// ==UserScript==
// @name         银豹收银系统扩展
// @namespace    https://www.pospal.cn
// @version      1.0.0
// @author       wowbox
// @description  批量进货、批量调货
// @match        http*://*.pospal.cn/StockFlow/StockFlowIn
// @match        http*://*.pospal.cn/StockFlow/StockFlowOut
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACEUExURUxpcRgWFhsYGBgWFhcWFh8WFhoYGBgWFiUlJRcVFRkWFhgVFRgWFhgVFRsWFhgWFigeHhkWFv////////////r6+h4eHv///xcVFfLx8SMhIUNCQpSTk/r6+jY0NCknJ97e3ru7u+fn51BOTsPCwqGgoISDg6empmpoaK2srNDQ0FhXV3eXcCcAAAAXdFJOUwCBIZXMGP70BuRH2Ze/LpIMUunHkpQR34sfygAAAVpJREFUOMt1U+magjAMDAVb5BDU3W25b9T1/d9vaYpQKDs/rF9nSNJkArDA9ezQZ8wPbc8FE6eAiQUsOO1o19JolFibKCdHGHC0IJezOMD5snx/yE+KOYYr42fPSufSZyazqDoseTPw4lGJNOu6LBXVUPBG3lqYAOv/5ZwnNUfUifzBt8gkgfgINmjxOpgqUA147QWNaocLniqq3QsSVbQHNp45N/BAwoYQz9oUJEiE4GMGfoBSMj5gjeWRIMMqleD/CAzUHFqTLyjOA5zjNnwa4UCEZ2YK3khEcBXHjVBtEFeIZ6+NxYbPqWp1DLKV42t6Ujn2ydyiPi9nX0TTNAkVVZ/gozsl6FbrktkwaVvL2TRK0C8Ca7Hck7f5OBT6FFbLATkL2ugV0tm0RLM9fedDvhWstl8Wp9AFDjFX7yOY/lJrv8AkYuz7fuP8dv9izCYH+x3/LBnj9fYPBTpJDNzX+7cAAAAASUVORK5CYII=
// @grant        none
// @license      GPL-3.0 License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/455060/%E9%93%B6%E8%B1%B9%E6%94%B6%E9%93%B6%E7%B3%BB%E7%BB%9F%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/455060/%E9%93%B6%E8%B1%B9%E6%94%B6%E9%93%B6%E7%B3%BB%E7%BB%9F%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function(){
  'use strict';

  function LOG(msg) {
    console.log("%c "+msg,"color:green;font-size:20px")
  }

  LOG('银豹收银系统扩展加载成功')

  const textareaClass = {
    width: "380px",
    "box-sizing": "border-box",
    margin: "4px 10px",
    position: "relative",
    padding: "5px 11px",
    color: "#606266",
    "line-height": "1.5",
    "box-shadow": "0 0 0 1px #dcdfe6 inset",
    "border-radius": "4px",
    border: "none"
  }

  const popup = `
  <div id="batchQueryProducts" class="popup popupTable" style="width: 400px; height: 320px; margin-top: -120px; margin-left: -120px; display: none">
    <div class="popupTitle bg">
      <h1>批量调货</h1>
      <div id="btnCloseBatch" class="popupClose" title="关闭">关闭</div>
    </div>
    <div class="mainArea">
      <textarea autofocus rows="10" placeholder="条码1&#10;条码2&#10;条码3&#10;..."></textarea>
    </div>
    <div class="popupBottom">
      <div class="popupBtn popupBtnCancel" style="width: 60px">取消</div>
      <div class="popupBtn popupBtnSure" style="width: 60px">确定</div>
    </div>
  </div>
  `
  
  $("#btnImport").after('<div id="btn_batch_import" class="btnBlue14 btnGreen">批量</div>')
  $("#popupBg").after(popup)

  const textArea = $("#batchQueryProducts textarea")
  const popupBg = $("#popupBg")
  const dialog = $("#batchQueryProducts")

  textArea.css(textareaClass)

  $("#btn_batch_import").click(function() {
    popupBg.show()
    dialog.show()
    textArea.focus()
  })

  $("#batchQueryProducts .popupClose").click(function() {
    textArea.val("")
    popupBg.hide()
    dialog.hide()
  })

  $("#batchQueryProducts .popupBtnCancel").click(function() {
    textArea.val("")
    popupBg.hide()
    dialog.hide();
  })

  // 确定
  $("#batchQueryProducts .popupBtnSure").click(function() {
    popupBg.hide()
    dialog.hide()

    let value = textArea.val().trim()
    let barcodes = value.split('\n').filter(v => !!v).map(v => v.trim())
    
    textArea.val("")

    queryProducts(barcodes)
  })

  function queryProducts(barcodes) {
    if (location.pathname === '/StockFlow/StockFlowIn') {
      queryFlowInProducts(barcodes)
    } else {
      queryFlowOutProducts(barcodes)
    }
  }

  async function queryFlowInProducts(barcodes) {
    $("#selectAll").prop("checked", false);

    let categoryUids = productSelector.ddl_category.getSelectedSubOptionValues();
    let categoryUidsJson = JSON.stringify(categoryUids)
    let supplierUid = productSelector.ddl_supplier.getSelectedValue();
    let brandUid = productSelector.ddl_brand.getSelectedValue();

    let productAreaUid = stockFlowOrder.ctrls.productAreaSelector.getSelectedValue()
    let userId = stockFlowOrder.stockFlowInStoreSelector.getSelectedValue();
    let loading = new pospal.ui.loading($("#mainArea"))

    let errorCount = 0
    for (const barcode of barcodes) {
      try {
        const res = await queryProduct({
          productLifeCircleTarget: 2,
          withBatchT2: true,
          userId,
          categoryUidsJson,
          supplierUid,
          brandUid,
          keyword: barcode,
          forStockFlowIn: true,
          needGroupByArtNO: false,
          needSupplierRange: true,
          productAreaUid,
          groupByAttr4: stockFlowOrder.groupArtNo.checked,
          accurateSearchByArtNo: stockFlowOrder.rb_accurateByArtNo.checked,
        })
  
        setTimeout(() => {
          $("#queryProductTable").html(res.view);
          productSelector.selectProduct($("#queryProductTable tbody tr"));
          productSelector.setCheckBox()
        }, 200);
      } catch (error) {
        errorCount++
      }
    }

    loading.destroy()
  }

  async function queryFlowOutProducts(barcodes) {
    $("#selectAll").prop("checked", false);

    let categoryUids = productSelector.ddl_category.getSelectedSubOptionValues();
    let categoryUidsJson = JSON.stringify(categoryUids)
    let supplierUid = productSelector.ddl_supplier.getSelectedValue();
    let productAreaUid = stockFlowOrder.productAreaSelector.getSelectedValue()
    let userId = stockFlowOrder.stockFlowOutStoreSelector.getSelectedValue();
    let loading = new pospal.ui.loading($("#mainArea"))

    let errorCount = 0
    for (const barcode of barcodes) {
      try {
        const res = await queryProduct({
          userId,
          categoryUidsJson,
          supplierUid,
          keyword: barcode,
          stockFlowOut: true,
          needGroupByArtNO: false,
          withEnableBatch: true,
          rationPriceType: stockFlowOrder.rationPriceType,
          toUserId: stockFlowOrder.toUserId,
          withStockFlowItemSNs: true,
          isScan: true,
          productAreaUid,
          accurateSearchByArtNo: stockFlowOrder.rb_accurateByArtNo.checked
        })
  
        setTimeout(() => {
          $("#queryProductTable").html(res.view);
          productSelector.selectProduct($("#queryProductTable tbody tr"));
          if (res.matchSn) {
            let $match = $("#mainTable tbody tr[data-json][data='" + res.matchBarcode + "']");
            if ($match.length > 0) {
              let $divSn = $match.find('.js_btn_sn');
              if ($divSn.length == 0) return;
  
              $divSn.data("ctrl").tryAdd(res.matchSn);
            }
          }
          productSelector.setCheckBox()
        }, 200);
      } catch (error) {
        errorCount++
      }
    }

    loading.destroy()
  }

  function queryProduct(data) {
    return new Promise((resolve, reject) => {
      pospal.ajax({
        url: "/StockFlow/QueryProduct",
        data,
        success: function(result) {
          if (result.successed && result.productNum == 1) {
            resolve(result)
            return
          }

          reject(result)
        },
        error: function(err) {
          reject(err)
        }
      })
    })
  }
})()