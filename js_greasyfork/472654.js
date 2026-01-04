// ==UserScript==
// @name                Export SteamDB Sales
// @name:bg             Експортиране на SteamDB продажби
// @name:cs             Export SteamDB prodeje
// @name:da             Eksporter SteamDB salg
// @name:de             SteamDB-Verkäufe exportieren
// @name:el             Εξαγωγή πωλήσεων SteamDB
// @name:en             Export SteamDB Sales
// @name:eo             Eksporti SteamDB-vendojn
// @name:es             Exportar Ventas de SteamDB
// @name:es-la          Exportar Ventas de SteamDB
// @name:es-419         Exportar Ventas de SteamDB
// @name:fi             Vie SteamDB-myynti
// @name:fr             Exporter les ventes SteamDB
// @name:fr-CA          Exporter les ventes SteamDB
// @name:he             ייצוא מכירות SteamDB
// @name:hr             Izvoz SteamDB prodaje
// @name:hu             SteamDB eladások exportálása
// @name:id             Ekspor Penjualan SteamDB
// @name:it             Esporta vendite SteamDB
// @name:ja             SteamDBセールをエクスポート
// @name:ka             ექსპორტი SteamDB გაყიდვები
// @name:ko             SteamDB 판매 내보내기
// @name:nb             Eksporter SteamDB-salg
// @name:nl             Exporteer SteamDB-verkopen
// @name:pl             Eksportuj sprzedaż SteamDB
// @name:pt-BR          Exportar Vendas do SteamDB
// @name:ro             Exportați vânzările SteamDB
// @name:sv             Exportera SteamDB-försäljning
// @name:th             ส่งออกการขาย SteamDB
// @name:tr             SteamDB Satışlarını Dışa Aktar
// @name:ug             SteamDB سېتىشنى ئېكسپورت قىلىش
// @name:uk             Експортувати продажі SteamDB
// @name:vi             Xuất bán hàng SteamDB
// @name:zh-TW          匯出 SteamDB 銷售
// @namespace           https://jlcareglio.github.io/
// @version             2.0.6
// @description         Adds a button to export current sales in SteamDB as TSV
// @description:bg      Добавя бутон за експортиране на текущите продажби в SteamDB като TSV
// @description:cs      Přidá tlačítko pro export aktuálních prodejů ve SteamDB jako TSV
// @description:da      Tilføjer en knap til at eksportere aktuelle salg i SteamDB som TSV
// @description:de      Fügt eine Schaltfläche hinzu, um aktuelle Verkäufe in SteamDB als TSV zu exportieren
// @description:el      Προσθέτει ένα κουμπί για εξαγωγή των τρεχουσών πωλήσεων στο SteamDB ως TSV
// @description:en      Adds a button to export current sales in SteamDB as TSV
// @description:eo      Aldonas butonon por eksporti nunajn vendojn en SteamDB kiel TSV
// @description:es      Agrega un botón para exportar como TSV el listado de ventas actuales en SteamDB
// @description:es-la   Agrega un botón para exportar como TSV el listado de ventas actuales en SteamDB
// @description:es-419  Agrega un botón para exportar como TSV el listado de ventas actuales en SteamDB
// @description:fi      Lisää painikkeen nykyisten myyntien viemiseen SteamDB:ssä TSV-muodossa
// @description:fr      Ajoute un bouton pour exporter les ventes actuelles de SteamDB en TSV
// @description:fr-CA   Ajoute un bouton pour exporter les ventes actuelles de SteamDB en TSV
// @description:he      מוסיף כפתור לייצוא מכירות נוכחיות ב-SteamDB כ-TSV
// @description:hr      Dodaje gumb za izvoz trenutne prodaje u SteamDB-u kao TSV
// @description:hu      Hozzáad egy gombot a SteamDB aktuális eladásainak TSV formátumban történő exportálásához
// @description:id      Menambahkan tombol untuk mengekspor penjualan saat ini di SteamDB sebagai TSV
// @description:it      Aggiunge un pulsante per esportare le vendite correnti in SteamDB come TSV
// @description:ja      SteamDBの現在のセールをTSVとしてエクスポートするボタンを追加します
// @description:ka      ამატებს ღილაკს SteamDB გაყიდვების TSV ფორმატში ექსპორტისთვის
// @description:ko      SteamDB의 현재 판매를 TSV로 내보내는 버튼을 추가합니다
// @description:nb      Legger til en knapp for å eksportere gjeldende salg i SteamDB som TSV
// @description:nl      Voegt een knop toe om huidige verkopen in SteamDB als TSV te exporteren
// @description:pl      Dodaje przycisk do eksportowania bieżącej sprzedaży w SteamDB jako TSV
// @description:pt-BR   Adiciona um botão para exportar as vendas atuais no SteamDB como TSV
// @description:ro      Adaugă un buton pentru a exporta vânzările curente din SteamDB ca TSV
// @description:sv      Lägger till en knapp för att exportera aktuella försäljningar i SteamDB som TSV
// @description:th      เพิ่มปุ่มเพื่อส่งออกการขายปัจจุบันใน SteamDB เป็น TSV
// @description:tr      SteamDB'deki mevcut satışları TSV olarak dışa aktarmak için bir düğme ekler
// @description:ug      SteamDB نىڭ ھازىرقى سېتىشلىرىنى TSV غا ئېكسپورت قىلىش ئۈچۈن كۇنۇپكا قوشۇش
// @description:uk      Додає кнопку для експорту поточних продажів у SteamDB у форматі TSV
// @description:vi      Thêm nút để xuất bán hàng hiện tại trong SteamDB dưới dạng TSV
// @description:zh-TW   新增一個按鈕以 TSV 格式匯出 SteamDB 當前銷售
// @icon                https://www.google.com/s2/favicons?sz=64&domain=steamdb.info
// @grant               none
// @author              Jesús Lautaro Careglio Albornoz
// @source              https://gist.githubusercontent.com/JLCareglio/8c47034f40e9febfd52476dd2f36e7bf/raw/01_Export-SteamDB-Sales.user.js
// @match               *://steamdb.info/sales*
// @license             MIT
// @compatible          firefox
// @compatible          chrome
// @compatible          opera
// @compatible          safari
// @compatible          edge
// @compatible          brave
// @supportURL          https://gist.github.com/JLCareglio/8c47034f40e9febfd52476dd2f36e7bf/
// @downloadURL https://update.greasyfork.org/scripts/472654/Export%20SteamDB%20Sales.user.js
// @updateURL https://update.greasyfork.org/scripts/472654/Export%20SteamDB%20Sales.meta.js
// ==/UserScript==

(async () => {
  async function HandlerClick() {
    const shown = document.querySelector("#dt-length-0");
    shown.value = -1;
    shown.dispatchEvent(new Event("change"));
    const rows = Array.from(
      document.querySelectorAll("#DataTables_Table_0 tbody tr")
    );
    const tsvRows = [];
    // console.log({ rows });

    for (const row of rows) {
      // console.log({ row });
      const app_id = row.dataset.appid;
      const name = row
        .querySelector("td:nth-child(3) > a")
        .textContent.replaceAll("#", String.raw`\#`);
      const discount =
        row.querySelector("td:nth-child(4)").textContent.trim() || "—";
      const price = parseFloat(
        row
          .querySelector("td:nth-child(5)")
          .textContent.match(/\d+([.,]?\d+)?/)[0]
          .replace(",", ".")
      );
      let rating = row.querySelector("td:nth-child(6)").textContent;
      rating = rating.match(/^\d{1,2}\.\d{2}%$/) ? rating : "—";
      let endsDate, startedDate;
      // console.log({ app_id, name, discount, price, rating });
      do {
        let ends = row.querySelector("td:nth-child(8)");
        let started = row.querySelector("td:nth-child(9)");
        endsDate = new Date(ends.title.replace(/( at)/g, "").split("\n")[0]);
        startedDate = new Date(
          started.title.replace(/( at)/g, "").split("\n")[0]
        );

        if (ends.textContent == "" || started.textContent == "")
          await ScrollTo(row);

        if (isNaN(endsDate) && ends.textContent == "—") endsDate = "";
        if (isNaN(startedDate) && started.textContent == "—") startedDate = "";
      } while (
        (isNaN(endsDate) || isNaN(startedDate)) &&
        endsDate != "" &&
        startedDate != ""
      );

      if (endsDate != "") endsDate = endsDate.toUTCString().replace(" GMT", "");
      if (startedDate != "")
        startedDate = startedDate.toUTCString().replace(" GMT", "");

      const release = row.querySelector("td:nth-child(7)").textContent;

      tsvRows.push([
        app_id,
        name,
        discount,
        price,
        rating,
        release,
        endsDate,
        startedDate,
      ]);
    }

    const headers = [
      "AppID",
      "Name",
      "% Discount",
      "Price",
      "Rating",
      "Release",
      "Ends (UTC)",
      "Started (UTC)",
    ];
    const tsvContent = [headers, ...tsvRows]
      .map((row) => row.join("\t"))
      .join("\n");
    DownloadTsvFile(tsvContent, "SteamDB_Sales.tsv");
  }

  async function ScrollTo(element) {
    await new Promise((resolve) => {
      element.scrollIntoView(true, { behavior: "instant", block: "start" });
      window.setTimeout(() => {
        resolve();
      }, 100);
    });
  }

  function DownloadTsvFile(data, filename) {
    const blob = new Blob([data], { type: "text/tab-separated-values" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const btnExport = document.createElement("a");
  btnExport.classList.value = "btn btn-link";
  btnExport.id = "js-filters-reset";
  btnExport.innerText = "Export TSV";
  btnExport.onclick = HandlerClick;

  document.querySelector("#js-filters").appendChild(btnExport);
})();
