// ==UserScript==
// @name                Export Steam TradeHistory
// @name:bg             Експортиране на историята на търговията в Steam
// @name:cs             Exportovat historii obchodů na Steamu
// @name:da             Eksporter Steam-handelshistorik
// @name:de             Steam-Handelsverlauf exportieren
// @name:el             Εξαγωγή ιστορικού συναλλαγών Steam
// @name:en             Export Steam TradeHistory
// @name:eo             Eksporti Steam-komercan historion
// @name:es             Exportar Historial de Intercambios de Steam
// @name:es-la          Exportar Historial de Intercambios de Steam
// @name:es-419         Exportar Historial de Intercambios de Steam
// @name:fi             Vie Steam-kauppahistoria
// @name:fr             Exporter l'historique des échanges Steam
// @name:fr-CA          Exporter l'historique des échanges Steam
// @name:he             ייצוא היסטוריית המסחר של Steam
// @name:hr             Izvoz povijesti trgovanja na Steamu
// @name:hu             Steam kereskedelmi előzmények exportálása
// @name:id             Ekspor Riwayat Perdagangan Steam
// @name:it             Esporta Cronologia Scambi di Steam
// @name:ja             Steam取引履歴のエクスポート
// @name:ka             ექსპორტი Steam-ის სავაჭრო ისტორია
// @name:ko             Steam 거래 내역 내보내기
// @name:nb             Eksporter Steam-handelshistorikk
// @name:nl             Exporteer Steam-handelsgeschiedenis
// @name:pl             Eksportuj historię handlu Steam
// @name:pt-BR          Exportar Histórico de Trocas do Steam
// @name:ro             Exportă istoricul tranzacțiilor Steam
// @name:sv             Exportera Steam-handels historik
// @name:th             ส่งออกประวัติการซื้อขาย Steam
// @name:tr             Steam Ticaret Geçmişini Dışa Aktar
// @name:ug             Steam سودا تارىخىنى ئېكسپورت قىلىش
// @name:uk             Експортувати історію торгів Steam
// @name:vi             Xuất lịch sử giao dịch Steam
// @name:zh-TW          匯出 Steam 交易歷史
// @namespace           https://jlcareglio.github.io/
// @version             1.2.2
// @description         Export Steam trade history to a TSV file
// @description:bg      Експортиране на историята на търговията в Steam в TSV файл
// @description:cs      Exportovat historii obchodů na Steamu do TSV souboru
// @description:da      Eksporter Steam-handelshistorik til en TSV-fil
// @description:de      Exportieren Sie den Steam-Handelsverlauf in eine TSV-Datei
// @description:el      Εξαγωγή ιστορικού συναλλαγών Steam σε αρχείο TSV
// @description:en      Export Steam trade history to a TSV file
// @description:eo      Eksporti Steam-komercan historion al TSV-dosiero
// @description:es      Permite exportar el historial de intercambios de Steam a un archivo TSV
// @description:es-la   Permite exportar el historial de intercambios de Steam a un archivo TSV
// @description:es-419  Permite exportar el historial de intercambios de Steam a un archivo TSV
// @description:fi      Vie Steam-kauppahistoria TSV-tiedostoon
// @description:fr      Exporter l'historique des échanges Steam dans un fichier TSV
// @description:fr-CA   Exporter l'historique des échanges Steam dans un fichier TSV
// @description:he      ייצוא היסטוריית המסחר של Steam לקובץ TSV
// @description:hr      Izvoz povijesti trgovanja na Steamu u TSV datoteku
// @description:hu      Steam kereskedelmi előzmények exportálása TSV fájlba
// @description:id      Ekspor Riwayat Perdagangan Steam ke file TSV
// @description:it      Esporta la cronologia degli scambi di Steam in un file TSV
// @description:ja      Steam取引履歴をTSVファイルにエクスポート
// @description:ka      ექსპორტი Steam-ის სავაჭრო ისტორია TSV ფაილში
// @description:ko      Steam 거래 내역을 TSV 파일로 내보내기
// @description:nb      Eksporter Steam-handelshistorikk til en TSV-fil
// @description:nl      Exporteer Steam-handelsgeschiedenis naar een TSV-bestand
// @description:pl      Eksportuj historię handlu Steam do pliku TSV
// @description:pt-BR   Exportar o histórico de trocas do Steam para um arquivo TSV
// @description:ro      Exportă istoricul tranzacțiilor Steam într-un fișier TSV
// @description:sv      Exportera Steam-handels historik till en TSV-fil
// @description:th      ส่งออกประวัติการซื้อขาย Steam เป็นไฟล์ TSV
// @description:tr      Steam ticaret geçmişini TSV dosyasına aktar
// @description:ug      Steam سودا تارىخىنى TSV ھۆججىتىگە ئېكسپورت قىلىش
// @description:uk      Експортувати історію торгів Steam у файл TSV
// @description:vi      Xuất lịch sử giao dịch Steam sang tệp TSV
// @description:zh-TW   匯出 Steam 交易歷史到 TSV 檔案
// @icon                https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant               none
// @author              Jesús Lautaro Careglio Albornoz
// @source              https://gist.githubusercontent.com/JLCareglio/00bef3fb30b3dedd9f0dd849c9bd461a/raw/01_Export-Steam-TradeHistory.user.js
// @match               *://steamcommunity.com/profiles/*/tradehistory*
// @match               *://steamcommunity.com/id/*/tradehistory*
// @license             MIT
// @compatible          firefox
// @compatible          chrome
// @compatible          opera
// @compatible          safari
// @compatible          edge
// @compatible          brave
// @supportURL          https://gist.github.com/JLCareglio/00bef3fb30b3dedd9f0dd849c9bd461a/
// @downloadURL https://update.greasyfork.org/scripts/524060/Export%20Steam%20TradeHistory.user.js
// @updateURL https://update.greasyfork.org/scripts/524060/Export%20Steam%20TradeHistory.meta.js
// ==/UserScript==

(async () => {
  const pagInGrowBar = document.querySelector(".inventory_history_pagingrow");
  const btnNext = pagInGrowBar.querySelector(".inventory_history_nextbtn");
  const tradeHistoryRows = document.querySelectorAll(".tradehistoryrow");
  const btnExport = document.createElement("div");

  const exportTradeHistory = () => {
    const trades = Array.from(tradeHistoryRows).map((row) => {
      // Convertir fecha y hora al formato deseado
      const dateText = row
        .querySelector(".tradehistory_date")
        .childNodes[0].textContent.trim();
      const timeText = row
        .querySelector(".tradehistory_timestamp")
        .textContent.trim();

      const monthMap = {
        ENE: "01",
        FEB: "02",
        MAR: "03",
        ABR: "04",
        MAY: "05",
        JUN: "06",
        JUL: "07",
        AGO: "08",
        SEP: "09",
        OCT: "10",
        NOV: "11",
        DIC: "12",
      };

      const [day, month, year] = dateText.split(" ");
      const monthNum = monthMap[month];
      const time = timeText.replace(" a. m.", "").replace(" p. m.", "");

      const datetime = `${day.padStart(2, "0")}/${monthNum}/${year} ${time}`;

      const userLink = row.querySelector(".tradehistory_event_description a");
      const userId = userLink.href.split("/").pop();
      const username = userLink.textContent;
      const items = Array.from(row.querySelectorAll(".history_item_name")).map(
        (item) => item.textContent.trim()
      );

      return {
        datetime,
        user: {
          id: userId,
          name: username,
        },
        items,
      };
    });

    const tsvHeader = "Date&Time\tUserID\tUserName\tItems";
    const tsvContent = trades
      .map((trade) => {
        const items = trade.items.join(", ");
        return `${trade.datetime}\t${trade.user.id}\t${trade.user.name}\t${items}`;
      })
      .join("\n");

    const tsvData = `${tsvHeader}\n${tsvContent}`;

    const blob = new Blob([tsvData], { type: "text/tab-separated-values" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "steam_trade_history.tsv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const customStyle = document.createElement("style");
  customStyle.textContent = `
    .btnExport {
      position: relative;
    }
    .btnExport:before {
      pointer-events: none;
      content: "";
      position: absolute;
      left: 6px;
      top: 0;
      bottom: 0;
      width: 20px;
      background: url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg' fill='%2366c0f4' fill-rule='evenodd' clip-rule='evenodd'%3E%3Cpath d='M16 2v7h-2v-5h-12v16h12v-5h2v7h-16v-20h16zm2 9v-4l6 5-6 5v-4h-10v-2h10z'/%3E%3C/svg%3E") center / contain no-repeat;
      transition: background-image 0.2s ease;
    }
    .btnExport:hover:before {
      background: url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg' fill='%23fff' fill-rule='evenodd' clip-rule='evenodd'%3E%3Cpath d='M16 2v7h-2v-5h-12v16h12v-5h2v7h-16v-20h16zm2 9v-4l6 5-6 5v-4h-10v-2h10z'/%3E%3C/svg%3E") center / contain no-repeat;
    }

    .btnExport .pagebtn {
      padding-left: 28px !important;
      padding-right: 6px !important;
      transition: color 0.2s ease, background-color 0.2s ease;
    }
  `;

  document.head.appendChild(customStyle);

  btnExport.classList.add("inventory_history_nextbtn", "btnExport");
  btnExport.innerHTML = `<a class="pagebtn">TSV</a>`;
  btnExport.addEventListener("click", exportTradeHistory);
  pagInGrowBar.insertBefore(btnExport, btnNext.nextSibling);
})();
