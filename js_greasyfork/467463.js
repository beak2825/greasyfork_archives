// ==UserScript==
// @name     GreasyFork Language Filter Remover
// @name:en     GreasyFork Language Filter Remover
// @name:zh-CN   GreasyFork 语言筛选器移除器
// @name:zh-TW   GreasyFork 語言過濾器移除工具
// @name:ja   GreasyFork 言語フィルタリムーバー
// @name:es   Removedor de filtro de idioma de GreasyFork
// @name:fr   Suppression du filtre de langue GreasyFork
// @name:de   GreasyFork Sprachfilter Entferner
// @name:ru   Удаление фильтра языка GreasyFork
// @name:ko   GreasyFork 언어 필터 제거기
// @name:it   Rimozione del filtro lingua di GreasyFork
// @name:pt   Removedor de filtro de idioma do GreasyFork
// @name:ar   مزيل فلتر اللغة لـGreasyFork

// @description This script modifies the URL on GreasyFork to always show scripts from all languages unless the user manually selects a different language.
// @description:en This script modifies the URL on GreasyFork to always show scripts from all languages unless the user manually selects a different language.
// @description:zh-CN 此脚本修改 GreasyFork 上的 URL，以始终显示所有语言的脚本，除非用户手动选择其他语言。
// @description:zh-TW 這個腳本修改 GreasyFork 上的 URL，除非使用者手動選擇其他語言，否則預設會始終顯示所有語言的腳本。
// @description:ja このスクリプトは、ユーザーが手動で異なる言語を選択しない限り、GreasyForkのURLを修正してすべての言語のスクリプトを常に表示します。
// @description:es Este script modifica la URL en GreasyFork para mostrar siempre los scripts de todos los idiomas a menos que el usuario seleccione manualmente un idioma diferente.
// @description:fr Ce script modifie l'URL sur GreasyFork pour toujours afficher les scripts de toutes les langues, sauf si l'utilisateur sélectionne manuellement une autre langue.
// @description:de Dieses Skript ändert die URL auf GreasyFork, um immer Skripte in allen Sprachen anzuzeigen, es sei denn, der Benutzer wählt manuell eine andere Sprache.
// @description:ru Этот скрипт изменяет URL на GreasyFork, чтобы всегда отображать скрипты на всех языках, если только пользователь не выбирает другой язык вручную.
// @description:ko 이 스크립트는 사용자가 수동으로 다른 언어를 선택하지 않는 한 GreasyFork의 URL을 수정하여 모든 언어의 스크립트를 항상 표시합니다.
// @description:it Questo script modifica l'URL su GreasyFork per mostrare sempre gli script in tutte le lingue, a meno che l'utente non selezioni manualmente un linguaggio diverso.
// @description:pt Este script modifica a URL no GreasyFork para sempre mostrar scripts de todas as línguas, a menos que o usuário selecione manualmente uma língua diferente.
// @description:ar يقوم هذا البرنامج النصي بتعديل URL على GreasyFork لعرض البرامج النصية من جميع اللغات دائمًا، ما لم يختر المستخدم لغة مختلفة يدويًا.

// @namespace https://mkpo.li/
// @version  0.2.0
// @grant    none
// @match    https://greasyfork.org/*/scripts?*
// @run-at   document-end
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/467463/GreasyFork%20Language%20Filter%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/467463/GreasyFork%20Language%20Filter%20Remover.meta.js
// ==/UserScript==

(() => {
  const currentURL = new URL(window.location.href);
  const searchParams = new URLSearchParams(currentURL.search);

  // Check if the user manually clicked the filter locale link.
  const manuallyClicked = sessionStorage.getItem('filterLocaleClicked');

  // If user did not manually select language, and filter_locale is not set, redirect to show scripts from all languages.
  if (manuallyClicked !== 'true' && !searchParams.has('filter_locale')) {
    searchParams.append('filter_locale', '0');
    currentURL.search = searchParams.toString();
    window.location.replace(currentURL.toString());
  }

  // On a page where the locale can be filtered, add click listener to the filter locale link.
  const filterLocaleLink = document.querySelector('.sidebarred-main-content p a'); // Selector for the "Show English results only" or equivalent link
  if (filterLocaleLink) {
    filterLocaleLink.addEventListener('click', () => {
      sessionStorage.setItem('filterLocaleClicked', 'true');
    });
  }
})();