// ==UserScript==
// @name               Country Flag Fixer
// @namespace          https://github.com/matthijs110/chromium-country-flags/
// @version            1.2.5
// @license            MIT
// @description        Replaces mysterious country codes automatically with the corresponding flag. The solution for Chromium users on Windows!
// @description:ar     يستبدل رموز البلد الغامضة تلقائيًا بالعلم المقابل. الحل لمستخدمي Chromium على Windows!
// @description:bg     Заменя автоматично мистериозните кодове на страните със съответния флаг. Решението за потребителите на Chromium в Windows!
// @description:cs     Automaticky nahradí záhadné kódy zemí odpovídající vlajkou. Řešení pro uživatele Chromu v systému Windows!
// @description:da     Erstatter automatisk mystiske landekoder med det tilsvarende flag. Løsningen for Chromium-brugere på Windows!
// @description:de     Ersetzt mysteriöse Ländercodes automatisch durch die entsprechende Flagge. Die Lösung für Chromium-Nutzer unter Windows!
// @description:el     Αντικαθιστά αυτόματα τους μυστηριώδεις κωδικούς χωρών με την αντίστοιχη σημαία. Η λύση για τους χρήστες του Chromium στα Windows!
// @description:en-GB  Replaces mysterious country codes automatically with the corresponding flag. The solution for Chromium users on Windows!
// @description:es     Sustituye automáticamente los códigos de país misteriosos por la bandera correspondiente. ¡La solución para los usuarios de Chromium en Windows!
// @description:et     Asendab salapärased riigikoodid automaatselt vastava lipuga. Lahendus Chromiumi kasutajatele Windowsis!
// @description:fi     Korvaa salaperäiset maakoodit automaattisesti vastaavalla lipulla. Ratkaisu Chromiumin käyttäjille Windowsissa!
// @description:fr     Remplace automatiquement les codes pays mystérieux par le drapeau correspondant. La solution pour les utilisateurs de Chromium sur Windows!
// @description:he     מחליף אוטומטית את קודי המדינה המסתוריים בדגל המתאים. הפתרון למשתמשי Chromium ב-Windows!
// @description:hi     रहस्यमय देश कोड को स्वचालित रूप से संबंधित ध्वज के साथ बदल देता है। विंडोज़ पर क्रोमियम उपयोगकर्ताओं के लिए समाधान!
// @description:hu     A rejtélyes országkódokat automatikusan helyettesíti a megfelelő zászlóval. A megoldás a Chromium felhasználók számára Windowson!
// @description:id     Mengganti kode negara misterius secara otomatis dengan bendera yang sesuai. Solusi untuk pengguna Chromium di Windows!
// @description:it     Sostituisce automaticamente i codici paese misteriosi con la bandiera corrispondente. La soluzione per gli utenti di Chromium su Windows!
// @description:ja     謎の国番号を対応する国旗に自動的に置き換える。WindowsのChromiumユーザーのためのソリューション!
// @description:ko     신비한 국가 코드를 해당 플래그로 자동 교체합니다. Windows의 Chromium 사용자를 위한 솔루션!
// @description:lv     Paslaptingus šalių kodus automatiškai pakeičia atitinkama vėliava. Sprendimas \"Chromium\" naudotojams \"Windows\" sistemoje!
// @description:nl     Vervangt mysterieuze landcodes automatisch door de overeenkomstige vlag. De oplossing voor Chromium gebruikers op Windows!
// @description:no     Erstatter mystiske landskoder automatisk med det tilsvarende flagget. Løsningen for Chromium-brukere på Windows!
// @description:pl     Automatycznie zastępuje tajemnicze kody krajów odpowiednią flagą. Rozwiązanie dla użytkowników Chromium w systemie Windows!
// @description:pt-BR  Substitui automaticamente os códigos misteriosos dos países pela bandeira correspondente. A solução para usuários do Chromium no Windows!
// @description:pt-PT  Substitui automaticamente os misteriosos códigos de países pela bandeira correspondente. A solução para os utilizadores de Crómio no Windows!
// @description:ro     Înlocuiește automat codurile de țară misterioase cu steagul corespunzător. Soluția pentru utilizatorii Chromium pe Windows!
// @description:ru     Автоматически заменяет загадочные коды стран на соответствующий флаг. Решение для пользователей Chromium под Windows!
// @description:sk     Záhadné kódy krajín automaticky nahradí príslušnou vlajkou. Riešenie pre používateľov Chromium v systéme Windows!
// @description:sl     Skrivnostne kode držav samodejno zamenja z ustrezno zastavo. Rešitev za uporabnike programa Chromium v operacijskem sistemu Windows!
// @description:sv     Ersätter mystiska landkoder automatiskt med motsvarande flagga. Lösningen för Chromium-användare i Windows!
// @description:tr     Gizemli ülke kodlarını otomatik olarak ilgili bayrakla değiştirir. Windows'ta Chromium kullanıcıları için çözüm!
// @description:uk     Автоматично замінює загадкові коди країн на відповідний прапор. Рішення для користувачів Chromium у Windows!
// @description:vi     Tự động thay thế mã quốc gia bí ẩn bằng cờ tương ứng. Giải pháp cho người dùng Chromium trên Windows!
// @description:zh-CN  将神秘的国家代码自动替换为相应的国旗。为Windows上的Chromium用户提供解决方案！
// @description:zh-TW  將神秘的國家代碼自動替換為相應的國旗。為Windows上的Chromium使用者提供解決方案！
// @author             matthijs110
// @match              *://*/*
// @icon               https://cdn.jsdelivr.net/gh/matthijs110/chromium-country-flags/src/assets/icons/icon48.png
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/490713/Country%20Flag%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/490713/Country%20Flag%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Source: https://github.com/talkjs/country-flag-emoji-polyfill
    const replacementFontName = "Twemoji Country Flags";

    // Some elements can be ignored.
    const ignoredElements = ["style", "script", "svg"];

    /**
     * Update all children of the given node.
     */
    const updateChildNodes = (startingPointNode) =>
    {
        startingPointNode.querySelectorAll('*').forEach((childNode) =>
        {
            const tagName = childNode.tagName.toLowerCase();
            if (ignoredElements.includes(tagName))
                return;

            // Match any emoji within the Unicode range
            const regex = /[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]|[\uD83C]\uDDEC[\uD83C][\uDDA7\uDDAC\uDDA9\uDDAF\uDDA8\uDDB3\uDDB4]|\u200D?\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDCA7?\uFE0F?/g;
            const matches = childNode.innerHTML.match(regex);
            if (matches)
            {
                // Get the original fonts to append later as fallback
                const originalFont = window.getComputedStyle(childNode, null).fontFamily;

                // Prevent any duplicated
                if (originalFont.toLowerCase().includes(replacementFontName.toLowerCase()))
                    return;

                // Override the font
                childNode.style.fontFamily = `${replacementFontName}, ${originalFont}`;
            }
        });
    }

    /**
     *  Observe the document for updated elements (e.g. scroll loading).
     */
    let observer = new MutationObserver(mutations =>
    {
        for (let mutation of mutations)
        {
            for (let addedNode of mutation.addedNodes)
            {
                if (addedNode != null && addedNode.tagName != null)
                {
                    // Prevent searching within the ignored elements like SVG
                    const tagName = addedNode.tagName.toLowerCase();
                    if (ignoredElements.includes(tagName))
                        continue;

                    updateChildNodes(addedNode);
                }
            }
        }
    });

    // Observe the children of the document DOM-element and every newly added element (descendants)
    observer.observe(document, { childList: true, subtree: true });


    //document-idle
    // Source: https://github.com/talkjs/country-flag-emoji-polyfill
    const fontName = "Twemoji Country Flags";
    const fontUrl = "https://cdn.jsdelivr.net/gh/matthijs110/chromium-country-flags/src/assets/TwemojiCountryFlags.woff2";

    /**
     * Register the custom font-face to load the emoji-font for certain unicodes
     */
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("id", "country-flag-fixer-ext");

    // Unicode range generated by: https://wakamaifondue.com/beta/
    style.textContent = `
        @font-face {
            font-family: "${fontName}";
            font-style: normal;
            src: url('${fontUrl}') format('woff2');
            unicode-range: U+1F1E6-1F1FF, U+1F3F4, U+E0062-E0063, U+E0065, U+E0067, U+E006C, U+E006E, U+E0073-E0074, U+E0077, U+E007F;
        }

        @font-face {
            font-family: "${fontName}";
            font-style: italic; /* Defined to prevent italic styled flags */
            src: url('${fontUrl}') format('woff2');
            unicode-range: U+1F1E6-1F1FF, U+1F3F4, U+E0062-E0063, U+E0065, U+E0067, U+E006C, U+E006E, U+E0073-E0074, U+E0077, U+E007F;
        }
    `;

    // Check for cases like SVG files that don't have a head element
    if (document.head != undefined)
    {
        document.head.appendChild(style);
    }
})();