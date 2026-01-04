// ==UserScript==
// @name         打刻申請の欠損を自動で埋める
// @namespace    LWisteria
// @version      0.1
// @description  出勤・退勤しか入力されてない日に10時または19時で打刻申請を埋める
// @author       LWisteria
// @match        https://hromssp.obc.jp/*
// @grant        none
// @license      MPL-2.0 or CC-BY-NC-4.0-International
// @downloadURL https://update.greasyfork.org/scripts/481300/%E6%89%93%E5%88%BB%E7%94%B3%E8%AB%8B%E3%81%AE%E6%AC%A0%E6%90%8D%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E5%9F%8B%E3%82%81%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/481300/%E6%89%93%E5%88%BB%E7%94%B3%E8%AB%8B%E3%81%AE%E6%AC%A0%E6%90%8D%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E5%9F%8B%E3%82%81%E3%82%8B.meta.js
// ==/UserScript==

$(async function() {
  "use strict"

  new MutationObserver(function(events) {
    for(const e of events)
    {
      if(e.oldValue === "opacity: 1;")
      {
        const $applyForm = $(e.target);
        if($applyForm.find(".applicationForm__header")[0].innerText === "打刻申請書")
        {
          const $applyTable = $applyForm.find("#applyTable");
          const $applyCaption = $applyTable.children("caption");
          const $addApply = $applyCaption.children("#addApply");
          $applyCaption.append(
            $("<button>").attr(
            {
              id: "autofill",
              type: "button",
            }).text(
              "不足を自動挿入"
            ).on("click", function()
            {
              const $timeTable = $("#inputTable").find("table.js-cm-scrTbl__scrAreaTbl");
              let nApply = 0;
              for(const row of $timeTable.children("tbody").children("tr"))
              {
                const $row = $(row);
                const startLack = $row.find(".js-cm-scrTbl__colIdx4").attr("data-nomarked") === "1";
                const endLack = $row.find(".js-cm-scrTbl__colIdx5").attr("data-nomarked") === "1";
                if(startLack !== endLack)
                {
                  const day = parseInt($row.find(".js-cm-scrTbl__colIdx1")[0].textContent.split('/')[1]);
                  const dayColID = function()
                  {
                    if(nApply > 0)
                    {
                      $addApply.trigger("click");
                      return `#js-application__basicDate_${nApply+1}_Day`;
                    }
                    else
                    {
                      $applyTable.children("#applyData1").addClass("js-lastApply");
                      return "#js-application__basicDate_Day"
                    }
                  }();
                  const $lastApply = $applyTable.children(".js-lastApply");

                  const $dayCol = $lastApply.find(dayColID);
                  $dayCol.attr("value", day);

                  const $startEnd = $lastApply.children(".js-applyPunchMarkRow").find(".js-punchRadios");
                  const $hourCol = $lastApply.find(".cm-p-timeBox__hours");
                  if(endLack)
                  {
                    $($startEnd[0]).removeAttr("checked");
                    $($startEnd[1]).attr("checked", "");
                    $hourCol.attr({
                      "data-tempval": "19",
                      value: "19",
                    });
                  }
                  else
                  {
                    $hourCol.attr({
                      "data-tempval": "10",
                      value: "10",
                    });
                  }
                  $lastApply.find(".cm-p-timeBox__minutes").attr({
                      "data-tempval": "00",
                      value: "00",
                    });

                  nApply++;
                }
              }
            })
          );
        }
      }
    }
  }).observe($("#js-applyForm")[0], {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['style']
  });
});

