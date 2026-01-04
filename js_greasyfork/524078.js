// ==UserScript==
// @name                Export Steam Family Games
// @name:bg             Експортиране на Steam семейни игри
// @name:cs             Exportovat Steam rodinné hry
// @name:da             Eksporter Steam familie spil
// @name:de             Steam-Familienbibliothek exportieren
// @name:el             Εξαγωγή παιχνιδιών οικογένειας Steam
// @name:en             Export Steam Family Games
// @name:eo             Eksporti Steam Familio Ludojn
// @name:es             Exportar Biblioteca Familiar de Steam
// @name:es-la          Exportar Biblioteca Familiar de Steam
// @name:es-419         Exportar Biblioteca Familiar de Steam
// @name:fi             Vie Steam-perhepelit
// @name:fr             Exporter les Jeux de la Famille Steam
// @name:fr-CA          Exporter les Jeux de la Famille Steam
// @name:he             ייצוא משחקי משפחה של Steam
// @name:hr             Izvoz Steam obiteljskih igara
// @name:hu             Steam családi játékok exportálása
// @name:id             Ekspor Game Keluarga Steam
// @name:it             Esporta Giochi della Famiglia Steam
// @name:ja             Steamファミリーゲームをエクスポート
// @name:ka             ექსპორტი Steam ოჯახის თამაშები
// @name:ko             Steam 가족 게임 내보내기
// @name:nb             Eksporter Steam familie spill
// @name:nl             Exporteer Steam familie spellen
// @name:pl             Eksportuj gry rodzinne Steam
// @name:pt-BR          Exportar Jogos da Família Steam
// @name:ro             Exportă jocurile de familie Steam
// @name:sv             Exportera Steam familjespel
// @name:th             ส่งออกเกมครอบครัว Steam
// @name:tr             Steam Aile Oyunlarını Dışa Aktar
// @name:ug             Steam ئائىلە ئويۇنلىرىنى ئېكسپورت قىلىش
// @name:uk             Експортувати сімейні ігри Steam
// @name:vi             Xuất trò chơi gia đình Steam
// @name:zh-TW          匯出 Steam 家庭遊戲
// @namespace           https://jlcareglio.github.io/
// @version             1.0.11
// @description         Adds a button to export Steam Family Library as TSV
// @description:bg      Добавя бутон за експортиране на Steam семейната библиотека като TSV
// @description:cs      Přidá tlačítko pro exportování rodinné knihovny Steam jako TSV
// @description:da      Tilføjer en knap til at eksportere Steam-familiebiblioteket som TSV
// @description:de      Fügt eine Schaltfläche hinzu, um die Steam-Familienbibliothek als TSV zu exportieren
// @description:el      Προσθέτει ένα κουμπί για την εξαγωγή της οικογενειακής βιβλιοθήκης Steam ως TSV
// @description:en      Adds a button to export Steam Family Library as TSV
// @description:eo      Aldonas butonon por eksporti Steam Familio Bibliotekon kiel TSV
// @description:es      Agrega un botón para exportar como TSV la biblioteca familiar de Steam
// @description:es-la   Agrega un botón para exportar como TSV la biblioteca familiar de Steam
// @description:es-419  Agrega un botón para exportar como TSV la biblioteca familiar de Steam
// @description:fi      Lisää painikkeen Steam-perhekirjaston viemiseksi TSV-muodossa
// @description:fr      Ajoute un bouton pour exporter la Bibliothèque Familiale Steam en TSV
// @description:fr-CA   Ajoute un bouton pour exporter la Bibliothèque Familiale Steam en TSV
// @description:he      מוסיף כפתור לייצוא ספריית המשפחה של Steam כ-TSV
// @description:hr      Dodaje gumb za izvoz Steam obiteljske biblioteke kao TSV
// @description:hu      Hozzáad egy gombot a Steam családi könyvtár TSV formátumban történő exportálásához
// @description:id      Menambahkan tombol untuk mengekspor Perpustakaan Keluarga Steam sebagai TSV
// @description:it      Aggiunge un pulsante per esportare la Libreria Familiare di Steam come TSV
// @description:ja      SteamファミリーライブラリをTSVとしてエクスポートするボタンを追加
// @description:ka      ამატებს ღილაკს Steam ოჯახის ბიბლიოთეკის TSV ფორმატში ექსპორტისთვის
// @description:ko      Steam 가족 라이브러리를 TSV로 내보내는 버튼을 추가합니다
// @description:nb      Legger til en knapp for å eksportere Steam-familiebiblioteket som TSV
// @description:nl      Voegt een knop toe om de Steam-familiebibliotheek als TSV te exporteren
// @description:pl      Dodaje przycisk do eksportowania biblioteki rodzinnej Steam jako TSV
// @description:pt-BR   Adiciona um botão para exportar a Biblioteca da Família Steam como TSV
// @description:ro      Adaugă un buton pentru a exporta biblioteca de familie Steam ca TSV
// @description:sv      Lägger till en knapp för att exportera Steam-familjebiblioteket som TSV
// @description:th      เพิ่มปุ่มเพื่อส่งออกคลังครอบครัว Steam เป็น TSV
// @description:tr      Steam Aile Kitaplığını TSV olarak dışa aktarmak için bir düğme ekler
// @description:uk      Додає кнопку для експорту сімейної бібліотеки Steam у форматі TSV
// @description:ug      Steam ئائىلە ئويۇنلىرىنى TSV شەكلىدە ئېكسپورت قىلىش ئۈچۈن كۇنۇپكا قوشىدۇ
// @description:vi      Thêm nút để xuất Thư viện Gia đình Steam dưới dạng TSV
// @description:zh-TW   添加按鈕以 TSV 格式匯出 Steam 家庭遊戲庫
// @icon                https://www.google.com/s2/favicons?sz=64&domain=store.steampowered.com
// @grant               none
// @author              Jesús Lautaro Careglio Albornoz
// @source              https://gist.githubusercontent.com/JLCareglio/6366b1367428baae04151dfef6ceae47/raw/01_Export-Steam-Family-Games.user.js
// @match               *://store.steampowered.com/account/familymanagement*
// @license             MIT
// @compatible          firefox
// @compatible          chrome
// @compatible          opera
// @compatible          safari
// @compatible          edge
// @compatible          brave
// @supportURL          https://gist.github.com/JLCareglio/6366b1367428baae04151dfef6ceae47/
// @downloadURL https://update.greasyfork.org/scripts/524078/Export%20Steam%20Family%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/524078/Export%20Steam%20Family%20Games.meta.js
// ==/UserScript==

(async () => {
  const waitForElement = (
    querySelector,
    timeout = null,
    parentElement = document
  ) => {
    return new Promise((resolve, reject) => {
      const observer = new MutationObserver(() => {
        const element = parentElement.querySelector(querySelector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      const element = parentElement.querySelector(querySelector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }

      if (timeout !== null) {
        setTimeout(() => {
          observer.disconnect();
          reject(
            `Elemento con selector "${querySelector}" no encontrado dentro del tiempo límite de ${timeout}ms.`
          );
        }, timeout);
      }
    });
  };
  const panelsContainer = await waitForElement("._3Pnf9j-DVi9cm7cJ383yI1");
  const panels = panelsContainer.querySelectorAll("._1o7lKXffOJjZ_CpH1bHfY-");
  const maxWaitingTime = 50000; // If this maxWaitingTime is reached, an error has occurred

  const exportAllGames = async (e) => {
    const allGames = [];
    const btnExport = e.target;
    const panel = btnExport.parentElement.parentElement.parentElement;
    const numGames = parseInt(
      panel.querySelector("._3x604kYqXRJbqWmeLWAHrj").innerText.match(/\d+/)[0]
    );

    for (const p of panels) if (p != panel) p.remove();

    const btnShowAll = panel.querySelector(
      "div:nth-child(2)._1ve5nrPCrUjlbKp1PXsiJD > button"
    );
    btnShowAll.click();

    let rowIndex = 0;
    let lastColIndex = 7;
    try {
      const firstRow = await waitForElement(
        ".-padb24TteB2RGJuMHdLn",
        maxWaitingTime,
        panel
      );
      lastColIndex = firstRow?.childElementCount || 7;
    } catch (e) {}

    while (allGames.length < numGames) {
      let lastRow;
      try {
        lastRow = await waitForElement(
          `[data-index="${rowIndex}"]`,
          maxWaitingTime,
          panel
        );
      } catch (error) {
        console.error(`Error procesando fila ${rowIndex}:`, error);
        break;
      }
      lastRow.scrollIntoView();
      for (
        let colIndex = 1;
        colIndex <= lastColIndex && allGames.length < numGames;
        colIndex++
      ) {
        try {
          const gameSelector = `[data-index="${rowIndex}"] > div > [data-key]:nth-child(${colIndex})`;
          const game = await waitForElement(
            gameSelector,
            maxWaitingTime,
            lastRow
          );

          const appId = game
            .querySelector("img")
            ?.src.match(/apps\/(\d+)\//)?.[1];

          const verticalImgBanner = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`;
          const horizontalImgBanner = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;
          const capsuleImg = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_231x87.jpg`;
          const title = game.querySelector("img")?.alt;
          const owners =
            game.querySelector(".OchtG0jyJQXcr2o0t34q7")?.innerText || "1";

          allGames.push({
            appId,
            title,
            owners,
            capsuleImg,
            verticalImgBanner,
            horizontalImgBanner,
          });

          console.log(
            `Procesado juego ${allGames.length}/${numGames}: ${title}`
          );
        } catch (error) {
          lastColIndex = colIndex - 1;
          console.log(`Tamaño máximo de columnas cambiado a ${lastColIndex}`);
          break;
        }
      }
      rowIndex++;
    }

    const headers =
      "App ID\tTitle\tOwners\tCapsule Image\tVertical Image Banner\tHorizontal Image Banner";
    let tsvContent = allGames
      .map(
        (game) =>
          `${game.appId}\t${game.title}\t${game.owners}\t${game.capsuleImg}\t${game.verticalImgBanner}\t${game.horizontalImgBanner}`
      )
      .join("\n");

    tsvContent = `${headers}\n${tsvContent}`;

    let blob = new Blob([tsvContent], { type: "text/tab-separated-values" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "steam_family_games.tsv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  for (const panel of panels) {
    const btnShowAll = panel.querySelector(
      "div:nth-child(2)._1ve5nrPCrUjlbKp1PXsiJD"
    );
    let btnExport = btnShowAll.cloneNode(true);
    btnExport.addEventListener("click", exportAllGames);
    btnExport.querySelector("button").innerText = "Export TSV";
    btnShowAll.parentElement.appendChild(btnExport);
  }
})();
