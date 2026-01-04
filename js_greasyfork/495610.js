// ==UserScript==
// @name                Tempo de Uso Diário
// @namespace           http://linkme.bio/jhonpergon?userscript=timeuse
// @version             1.1
// @description         Exibe seu tempo de uso diário em cada site ao lado do título das abas no navegador.
// @author              Jhon Pérgon

// @name:pt             Tempo de Uso Diário
// @name:pt-BR          Tempo de Uso Diário
// @name:pt-PT          Tempo de Uso Diário
// @name:es             Tiempo de Uso Diario
// @name:en             Daily Usage Time
// @name:en-US          Daily Usage Time
// @name:fr             Temps d'Utilisation Quotidien
// @name:ru             Ежедневное Время Использования
// @name:ja             毎日の使用時間
// @name:ko             일일 사용 시간
// @name:zh-TW          每日使用時間
// @name:zh-CN          每日使用时间
// @name:id             Waktu Penggunaan Harian
// @name:ug             ھەر كۈندىلىك ئىشلىتىش ۋاقتى
// @name:ar             وقت الاستخدام اليومي
// @name:he             זמן שימוש יומי
// @name:hi             दैनिक उपयोग समय
// @name:th             เวลาการใช้งานรายวัน
// @name:bg             Ежедневно Време на Използване
// @name:ro             Timp de Utilizare Zilnic
// @name:fi             Päivittäinen Käyttöaika
// @name:it             Tempo di Utilizzo Giornaliero
// @name:el             Ημερήσιος Χρόνος Χρήσης
// @name:eo             Ĉiutaga Uzotempo
// @name:hu             Napi Használati Idő
// @name:nb             Daglig Brukstid
// @name:sk             Denný Čas Používania
// @name:sv             Daglig Användningstid
// @name:sr             Дневно Време Коришћења
// @name:pl             Dzienny Czas Użytkowania
// @name:nl             Dagelijks Gebruiksduur
// @name:de             Tägliche Nutzungszeit
// @name:da             Daglig Brugstid
// @name:cs             Denní Doba Používání
// @name:uk             Щоденний Час Використання
// @name:tr             Günlük Kullanım Süresi
// @name:vi             Thời Gian Sử Dụng Hàng Ngày
// @name:fr-CA          Temps d'Utilisation Quotidien

// @description:pt          Exibe seu tempo de uso diário em cada site ao lado do título das abas no navegador.
// @description:pt-BR       Exibe seu tempo de uso diário em cada site ao lado do título das abas no navegador.
// @description:pt-PT       Exibe o seu tempo de uso diário em cada site ao lado do título das abas no navegador.
// @description:es          Muestra tu tiempo de uso diario en cada sitio junto al título de las pestañas en el navegador.
// @description:en          Displays your daily usage time for each site next to the tab titles in the browser.
// @description:en-US       Displays your daily usage time for each site next to the tab titles in the browser.
// @description:fr          Affiche votre temps d'utilisation quotidien pour chaque site à côté du titre des onglets dans le navigateur.
// @description:ru          Отображает ваше ежедневное время использования для каждого сайта рядом с заголовками вкладок в браузере.
// @description:ja          各サイトの毎日の使用時間をブラウザのタブタイトルの横に表示します。
// @description:ko          브라우저 탭 제목 옆에 각 사이트의 일일 사용 시간을 표시합니다.
// @description:zh-TW       在瀏覽器標籤標題旁邊顯示每個網站的每日使用時間。
// @description:zh-CN       在浏览器标签标题旁边显示每个网站的每日使用时间。
// @description:id          Menampilkan waktu penggunaan harian Anda untuk setiap situs di samping judul tab di browser.
// @description:ug          تور بەت باش خەتلىرىنىڭ يېنىدا ھەر كۈنى قانداق ئىشلىتىش ۋاقتىڭىزنى كۆرۈستىدۇ.
// @description:ar          يعرض وقت الاستخدام اليومي لكل موقع بجوار عناوين علامات التبويب في المتصفح.
// @description:he          מציג את זמן השימוש היומי שלך בכל אתר ליד כותרות הכרטיסיות בדפדפן.
// @description:hi          ब्राउज़र में टैब शीर्षकों के बगल में प्रत्येक साइट के लिए आपका दैनिक उपयोग समय प्रदर्शित करता है।
// @description:th          แสดงเวลาใช้งานรายวันของคุณสำหรับแต่ละไซต์ถัดจากชื่อแท็บในเบราว์เซอร์
// @description:bg          Показва вашето ежедневно време за използване на всеки сайт до заглавията на разделите в браузъра.
// @description:ro          Afișează timpul zilnic de utilizare pentru fiecare site lângă titlurile filelor în browser.
// @description:fi          Näyttää päivittäisen käyttöaikasi jokaisella sivustolla selaimen välilehtien otsikoiden vieressä.
// @description:it          Visualizza il tempo di utilizzo giornaliero per ogni sito accanto ai titoli delle schede nel browser.
// @description:el          Εμφανίζει τον ημερήσιο χρόνο χρήσης σας για κάθε ιστότοπο δίπλα στους τίτλους των καρτελών στον περιηγητή.
// @description:eo          Montras vian ĉiutagan uzotempon por ĉiu retejo apud la etikedaj titoloj en la retumilo.
// @description:hu          Megjeleníti a napi használati időt minden webhelyhez a böngészőben a lapok címei mellett.
// @description:nb          Viser din daglige brukstid for hvert nettsted ved siden av fanetitlene i nettleseren.
// @description:sk          Zobrazuje váš denný čas používania pre každú stránku vedľa názvov kariet v prehliadači.
// @description:sv          Visar din dagliga användningstid för varje webbplats bredvid flikarnas titlar i webbläsaren.
// @description:sr          Приказује ваше дневно време коришћења за сваки сајт поред наслова картица у прегледачу.
// @description:pl          Wyświetla Twój dzienny czas użytkowania dla każdej strony obok tytułów kart w przeglądarce.
// @description:nl          Geeft uw dagelijkse gebruikstijd voor elke site weer naast de tabtitels in de browser.
// @description:de          Zeigt Ihre tägliche Nutzungszeit für jede Website neben den Tab-Titeln im Browser an.
// @description:da          Viser din daglige brugstid for hver side ved siden af ​​fanetitlerne i browseren.
// @description:cs          Zobrazuje váš denní čas používání pro každý web vedle názvů karet v prohlížeči.
// @description:uk          Відображає ваш щоденний час використання для кожного сайту поруч із заголовками вкладок у браузері.
// @description:tr          Tarayıcıdaki sekme başlıklarının yanında her site için günlük kullanım sürenizi görüntüler.
// @description:vi          Hiển thị thời gian sử dụng hàng ngày của bạn cho mỗi trang web bên cạnh tiêu đề tab trong trình duyệt.
// @description:fr-CA       Affiche votre temps d'utilisation quotidien pour chaque site à côté du titre des onglets dans le navigateur.

// @match            *://*/*
// @icon             data:image/png;base64,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
// @grant            none
// @license          MIT

// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      safari
// @downloadURL https://update.greasyfork.org/scripts/495610/Tempo%20de%20Uso%20Di%C3%A1rio.user.js
// @updateURL https://update.greasyfork.org/scripts/495610/Tempo%20de%20Uso%20Di%C3%A1rio.meta.js
// ==/UserScript==

let tempoTotal = 0;
const dataSalva = localStorage.getItem('data');
const dataAtual = new Date().toDateString();

if (dataSalva === dataAtual) {
    tempoTotal = localStorage.getItem('tempoTotal') ? parseInt(localStorage.getItem('tempoTotal')) : 0;
} else {
    localStorage.setItem('data', dataAtual);
    localStorage.setItem('tempoTotal', 0);
}

function formatarTempo(tempo) {
    if (tempo < 60) {
        return `(${tempo}s) `;
    } else if (tempo < 3600) {
        const minutos = Math.floor(tempo / 60);
        const segundos = tempo % 60;
        return `(${minutos}:${segundos < 10 ? '0' : ''}${segundos}s) `;
    } else {
        const horas = Math.floor(tempo / 3600);
        const minutos = Math.floor((tempo % 3600) / 60);
        return `(${horas}:${minutos < 10 ? '0' : ''}${minutos}m) `;
    }
}

function atualizarTitulo() {
    const regex = /^\(\d{1,2}:[0-5]?\d{1,2}?:?\d*?s?\)\s*|^\(\d+s\)\s*|^\(\d{1,2}:[0-5]?\d{1,2}?:?\d*?m?\)\s*/;
    const tituloSemTempo = document.title.replace(regex, '');
    let time = formatarTempo(tempoTotal) + tituloSemTempo;
    document.title = time;
}

function atualizarTempo() {
    tempoTotal++;
    localStorage.setItem('tempoTotal', tempoTotal);
    atualizarTitulo();
}

window.addEventListener('load', () => {
    atualizarTitulo();
    setInterval(atualizarTempo, 1000);
});

