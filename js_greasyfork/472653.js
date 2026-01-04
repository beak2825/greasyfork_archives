// ==UserScript==
// @name                Export SteamDB Search
// @name:bg             Експортиране на SteamDB търсене
// @name:cs             Exportovat vyhledávání SteamDB
// @name:da             Eksporter SteamDB-søgning
// @name:de             SteamDB-Suchen exportieren
// @name:el             Εξαγωγή αναζήτησης SteamDB
// @name:en             Export SteamDB Search
// @name:eo             Eksporti SteamDB serĉon
// @name:es             Exportar Búsquedas de SteamDB
// @name:es-la          Exportar Búsquedas de SteamDB
// @name:es-419         Exportar Búsquedas de SteamDB
// @name:fi             Vie SteamDB-haku
// @name:fr             Exporter les recherches SteamDB
// @name:fr-CA          Exporter les recherches SteamDB
// @name:he             ייצוא חיפוש SteamDB
// @name:hr             Izvoz SteamDB pretrage
// @name:hu             SteamDB keresés exportálása
// @name:id             Ekspor Pencarian SteamDB
// @name:it             Esporta Ricerca SteamDB
// @name:ja             SteamDB検索をエクスポート
// @name:ka             SteamDB ძიების ექსპორტი
// @name:ko             SteamDB 검색 내보내기
// @name:nb             Eksporter SteamDB-søk
// @name:nl             Exporteer SteamDB-zoekopdracht
// @name:pl             Eksportuj wyszukiwanie SteamDB
// @name:pt-BR          Exportar Pesquisa SteamDB
// @name:ro             Exportă căutarea SteamDB
// @name:sv             Exportera SteamDB-sökning
// @name:th             ส่งออกการค้นหา SteamDB
// @name:tr             SteamDB Aramasını Dışa Aktar
// @name:ug             SteamDB ئىزدەشنى چىقىرىۋېتىش
// @name:uk             Експортувати пошук SteamDB
// @name:vi             Xuất tìm kiếm SteamDB
// @name:zh-TW          匯出 SteamDB 搜尋
// @namespace           https://jlcareglio.github.io/
// @version             2.3.9
// @description         Adds a button to export current search in SteamDB as TSV
// @description:bg      Добавя бутон за експортиране на текущото търсене в SteamDB като TSV
// @description:cs      Přidává tlačítko pro export aktuálního vyhledávání ve SteamDB jako TSV
// @description:da      Tilføjer en knap til at eksportere den aktuelle søgning i SteamDB som TSV
// @description:de      Fügt eine Schaltfläche hinzu, um die aktuelle Suche in SteamDB als TSV zu exportieren
// @description:el      Προσθέτει ένα κουμπί για την εξαγωγή της τρέχουσας αναζήτησης στο SteamDB ως TSV
// @description:en      Adds a button to export current search in SteamDB as TSV
// @description:eo      Aldonas butonon por eksporti la nunan serĉon en SteamDB kiel TSV
// @description:es      Agrega un botón para exportar como TSV el listado de búsqueda en SteamDB
// @description:es-la   Agrega un botón para exportar como TSV el listado de búsqueda en SteamDB
// @description:es-419  Agrega un botón para exportar como TSV el listado de búsqueda en SteamDB
// @description:fi      Lisää painikkeen nykyisen haun viemiseksi SteamDB:stä TSV-muodossa
// @description:fr      Ajoute un bouton pour exporter la recherche actuelle dans SteamDB en TSV
// @description:fr-CA   Ajoute un bouton pour exporter la recherche actuelle dans SteamDB en TSV
// @description:he      מוסיף כפתור לייצוא החיפוש הנוכחי ב-SteamDB כ-TSV
// @description:hr      Dodaje gumb za izvoz trenutne pretrage u SteamDB kao TSV
// @description:hu      Hozzáad egy gombot a SteamDB jelenlegi keresésének TSV formátumban történő exportálásához
// @description:id      Menambahkan tombol untuk mengekspor pencarian saat ini di SteamDB sebagai TSV
// @description:it      Aggiunge un pulsante per esportare la ricerca corrente in SteamDB come TSV
// @description:ja      SteamDBの現在の検索をTSVとしてエクスポートするボタンを追加します
// @description:ka      SteamDB ძიების ექსპორტი TSV ფორმატში
// @description:ko      SteamDB 현재 검색을 TSV로 내보내는 버튼을 추가합니다
// @description:nb      Legger til en knapp for å eksportere gjeldende søk i SteamDB som TSV
// @description:nl      Voegt een knop toe om de huidige zoekopdracht in SteamDB als TSV te exporteren
// @description:pl      Dodaje przycisk do eksportowania bieżącego wyszukiwania w SteamDB jako TSV
// @description:pt-BR   Adiciona um botão para exportar a pesquisa atual no SteamDB como TSV
// @description:ro      Adaugă un buton pentru a exporta căutarea curentă în SteamDB ca TSV
// @description:sv      Lägger till en knapp för att exportera aktuell sökning i SteamDB som TSV
// @description:th      เพิ่มปุ่มเพื่อส่งออกการค้นหาปัจจุบันใน SteamDB เป็น TSV
// @description:tr      SteamDB'deki mevcut aramayı TSV olarak dışa aktarmak için bir düğme ekler
// @description:ug      SteamDB ئىزدەشنى TSV دەپ چىقىرىۋېتىش كۇنۇپكىسى قوشۇش
// @description:uk      Додає кнопку для експорту поточного пошуку в SteamDB у форматі TSV
// @description:vi      Thêm nút để xuất tìm kiếm hiện tại trong SteamDB dưới dạng TSV
// @description:zh-TW   添加一個按鈕以TSV格式匯出SteamDB的當前搜索
// @icon                https://www.google.com/s2/favicons?sz=64&domain=steamdb.info
// @grant               none
// @author              Jesús Lautaro Careglio Albornoz
// @source              https://gist.githubusercontent.com/JLCareglio/3d9c4694430b181d2de2780aa2479572/raw/01_Export-SteamDB-Search.user.js
// @match               *://steamdb.info/search*
// @license             MIT
// @compatible          firefox
// @compatible          chrome
// @compatible          opera
// @compatible          safari
// @compatible          edge
// @compatible          brave
// @supportURL          https://gist.github.com/JLCareglio/3d9c4694430b181d2de2780aa2479572/
// @downloadURL https://update.greasyfork.org/scripts/472653/Export%20SteamDB%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/472653/Export%20SteamDB%20Search.meta.js
// ==/UserScript==

(async () => {
  async function HandlerClick() {
    btnExport.innerText = "Exporting, please wait...";
    await new Promise((resolve) => setTimeout(resolve, 50));
    try {
      const shown = document.querySelector("#dt-length-0");
      shown.value = -1;
      shown.dispatchEvent(new Event("change"));
    } catch (error) {
      console.error(error);
      btnExport.style.color = "red";
      btnExport.innerText = "Error, please click the search button first";
      return;
    }

    const rows = Array.from(
      document.querySelectorAll("#table-sortable tbody tr")
    );
    const tsvRows = [];
    // console.log({ rows });

    for (const row of rows) {
      // console.log({ row });
      const app_id = row.dataset.appid;
      const name = row
        .querySelector("td:nth-child(3) > a")
        .textContent.replaceAll("#", String.raw`\#`);
      let lastUpdate = row.querySelector("td.timeago").dataset.time;
      let lastUpdateUTC = new Date(lastUpdate).toUTCString();

      tsvRows.push([app_id, name, lastUpdateUTC]);
    }

    const headers = ["AppID", "Name", "Last Update (UTC)"];
    const tsvContent = [headers, ...tsvRows]
      .map((row) => row.join("\t"))
      .join("\n");
    DownloadTsvFile(tsvContent, "SteamDB_Search.tsv");
    btnExport.innerText = "Export TSV";
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
  btnExport.style.padding = "11px";
  btnExport.innerText = "Export TSV";
  btnExport.onclick = HandlerClick;

  document
    .querySelector("#apps > form > dl:nth-child(6) > dd")
    .appendChild(btnExport);
})();
