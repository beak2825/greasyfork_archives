// ==UserScript==
// @name         Smartschool Customizer - Final Version
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Pas Smartschool-blokken aan (Instagram, Tampermonkey, De Lijn, TikTok)
// @author       Lowie Theuwis
// @match        https://*.smartschool.be/
// @icon         mit data:image/webp;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530192/Smartschool%20Customizer%20-%20Final%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/530192/Smartschool%20Customizer%20-%20Final%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';


    alert('welcome to prison')

    const customAlert = document.createElement('div');
    customAlert.innerHTML = `
        <div style="
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #444;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 9999;
            text-align: center;
        ">
            <p style="font-size:18px;">🎉 Hallo daar!</p>
            <img src="https://www.google.com/imgres?q=adolf%20hitler&imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Ff%2Ff1%2FBundesarchiv_Bild_146-1990-048-29A%252C_Adolf_Hitler_retouched_%2528cropped%2529.jpg&imgrefurl=https%3A%2F%2Fnl.wikipedia.org%2Fwiki%2FAdolf_Hitler&docid=Mq_FALCdBUhDeM&tbnid=23LTNgtAzG3OaM&vet=12ahUKEwif-eCzmJiMAxWu9LsIHbPaDdgQM3oECBAQAA..i&w=258&h=357&hcb=2&ved=2ahUKEwif-eCzmJiMAxWu9LsIHbPaDdgQM3oECBAQAA:10px">
            <br>
            <br>
            <button id="closeBtn" style="padding: 8px 16px; border:none; background-color:#007bff; color:white; border-radius:5px; cursor:pointer;">Sluiten</button>
        </div>
    `;

    document.body.appendChild(customAlert);

    document.getElementById('closeBtn').addEventListener('click', function() {
        customAlert.remove();
    });


    document.body.appendChild(customAlert);

    document.getElementById('closeBtn').addEventListener('click', function() {
        customAlert.remove();
    });

    // ✅ Vervang de inhoud van het news block
    document.getElementById("homepage__block--news").innerHTML = "<a href='https://dayz.ginfo.gg'><h2>izurvive</h2><a/>";

    // Functie om een knop toe te voegen waarmee je de achtergrondkleur kunt aanpassen
function addBackgroundColorChanger() {
  const colorButton = document.createElement('button');
  colorButton.innerText = '🎨 Verander achtergrondkleur';
  colorButton.style.position = 'fixed';
  colorButton.style.top = '60px';
  colorButton.style.right = '10px';
  colorButton.style.zIndex = '9999';
  colorButton.style.backgroundColor = '#3399ff';
  colorButton.style.color = 'white';
  colorButton.style.padding = '10px 15px';
  colorButton.style.border = 'none';
  colorButton.style.borderRadius = '8px';
  colorButton.style.fontSize = '14px';
  colorButton.style.cursor = 'pointer';
  colorButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  colorButton.title = 'Klik om de achtergrondkleur te wijzigen';

  // Kleurkiezer input element
  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.style.display = 'none';

  // Event: open kleurkiezer bij klik op knop
  colorButton.onclick = () => {
    colorInput.click();
  };

  // Event: verander achtergrondkleur zodra gebruiker een kleur kiest
  colorInput.oninput = (e) => {
    document.body.style.backgroundColor = e.target.value;
  };

  // Voeg knop en input toe aan document
  document.body.appendChild(colorButton);
  document.body.appendChild(colorInput);
}


      function replaceStudentSupportList() {
    const supportDiv = document.getElementById("student_support");
    if (!supportDiv) return;

    // Nieuwe HTML voor game-links
    const newContent = `
      <a target="_blank" href="https://poki.com" class="icon-label icon-label--info student-support-block__item">
        <span class="icon-label__text">Poki</span>
        <span class="icon-label__info">Speel honderden gratis online games in je browser – van actie tot puzzelspellen!</span>
      </a>
      <a target="_blank" href="https://www.crazygames.com" class="icon-label icon-label--info student-support-block__item">
        <span class="icon-label__text">CrazyGames</span>
        <span class="icon-label__info">Een grote selectie van gratis browsergames, geen installatie nodig.</span>
      </a>
      <a target="_blank" href="https://www.miniclip.com" class="icon-label icon-label--info student-support-block__item">
        <span class="icon-label__text">Miniclip</span>
        <span class="icon-label__info">Een klassieker met veel arcade- en sportgames voor alle leeftijden.</span>
      </a>
      <a target="_blank" href="https://www.kizi.com" class="icon-label icon-label--info student-support-block__item">
        <span class="icon-label__text">Kizi</span>
        <span class="icon-label__info">Veilige en leuke online games – perfect voor alle leeftijden.</span>
      </a>
      <a target="_blank" href="https://www.friv.com" class="icon-label icon-label--info student-support-block__item">
        <span class="icon-label__text">Friv</span>
        <span class="icon-label__info">Populaire browsergames met kleurrijke visuals en verslavende gameplay.</span>
      </a>
      <a target="_blank" href="https://www.coolmathgames.com" class="icon-label icon-label--info student-support-block__item">
        <span class="icon-label__text">Cool Math Games</span>
        <span class="icon-label__info">Educatieve én leuke games: puzzels, logisch denken en strategie!</span>
      </a>
      <a target="_blank" href="https://www.y8.com" class="icon-label icon-label--info student-support-block__item">
        <span class="icon-label__text">Y8 Games</span>
        <span class="icon-label__info">Duizenden spelletjes, waaronder multiplayer en retro classics.</span>
      </a>
    `;

    supportDiv.innerHTML = newContent;
  }

  // Wacht tot de pagina geladen is
  window.addEventListener('load', () => {
    // Voeg een kleine vertraging toe voor zekerheid
    setTimeout(replaceStudentSupportList, 500);
  });


    // Algemene functie om blok aan te passen via ID
    function changeBlockById({ blockId, newHeaderText, newHeaderId, newImageSrc, newImageLink, imageWidth = 100, imageHeight = 100 }) {
        const block = document.getElementById(blockId);
        if (!block) return console.warn(`❌ Blok met ID ${blockId} niet gevonden.`);

        const header = block.querySelector('.homepage__block__top__title h2');
        if (header) {
            header.textContent = newHeaderText;
            if (newHeaderId) header.id = newHeaderId;
        }

        const img = block.querySelector('.homepage__block__content img');
        if (img) {
            img.src = newImageSrc;
            img.width = imageWidth;
            img.height = imageHeight;
        }

        const link = block.querySelector('.homepage__block__content a');
        if (link) {
            link.href = newImageLink;
        }

        console.log(`✅ Blok met ID ${blockId} succesvol aangepast.`);
    }

    // Alternatieve functie via newsid attribuut
    function changeBlockByNewsId({ newsId, newHeaderText, newHeaderId, newImageSrc, newImageLink, imageWidth = 100, imageHeight = 100 }) {
        const block = document.querySelector(`div.homepage__block[newsid="${newsId}"]`);
        if (!block) return console.warn(`❌ Blok met newsid ${newsId} niet gevonden.`);

        const header = block.querySelector('.homepage__block__top__title h2');
        if (header) {
            header.textContent = newHeaderText;
            if (newHeaderId) header.id = newHeaderId;
        }

        const img = block.querySelector('.homepage__block__content img');
        if (img) {
            img.src = newImageSrc;
            img.width = imageWidth;
            img.height = imageHeight;
        }

        const link = block.querySelector('.homepage__block__content a');
        if (link) {
            link.href = newImageLink;
        }

        console.log(`✅ Blok met newsid ${newsId} succesvol aangepast.`);
    }

    // 🎯 Instagram blok
    changeBlockById({
        blockId: 'homepage__block--6181',
        newHeaderText: 'Ga naar Instagram',
        newHeaderId: 'custom-instagram-header',
        newImageSrc: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
        newImageLink: 'https://www.instagram.com/',
        imageWidth: 100,
        imageHeight: 100
    });

    // 🎯 Tampermonkey blok
    changeBlockById({
        blockId: 'homepage__block--6775',
        newHeaderText: 'Ga naar Tampermonkey',
        newHeaderId: 'custom-tampermonkey-header',
        newImageSrc: 'https://www.tampermonkey.net/favicon.ico',
        newImageLink: 'https://www.tampermonkey.net/',
        imageWidth: 100,
        imageHeight: 100
    });

    // 🎯 De Lijn blok via newsid
    changeBlockById({
        blockId: 'homepage__block--2305',
        newHeaderText: 'Ga naar De Lijn',
        newHeaderId: 'custom-delijn-header',
        newImageSrc: 'https://play-lh.googleusercontent.com/frza45Ue18Y9Yu7hy0Uo_QTQgYMZI-VgsI_e0oAerO1CAR7Ue-zJpGqjs08PQksWGw',
        newImageLink: 'https://www.delijn.be/nl/',
        imageWidth: 100,
        imageHeight: 100
    });

    // 🎯 TikTok blok (vervangt oude Trooper)
    changeBlockByNewsId({
        newsId: '17767',
        newHeaderText: 'Ga naar TikTok',
        newHeaderId: 'custom-tiktok-header',
        newImageSrc: 'data:image/png;base64,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',
        newImageLink: 'https://www.tiktok.com/',
        imageWidth: 100,
        imageHeight: 100
    });

    changeBlockById({
    blockId: 'homepage__block--3585',
    newHeaderText: 'Ga naar YouTube',
    newHeaderId: 'custom-youtube-header',
    newImageSrc: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg',
    newImageLink: 'https://www.youtube.com/',
    imageWidth: 100,
    imageHeight: 100
});

    changeBlockById({
    blockId: 'homepage__block--2747',
    newHeaderText: 'gratis vpn nodig?',
    newHeaderId: 'custom-vpn-header',
    newImageSrc: 'data:image/jpeg;base64,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',
    newImageLink: 'https://protonvpn.com/?srsltid=AfmBOorz4lgi2h9un9h0Ma5Sc1BlqjV76qYw_nXYpNkqm92hHCaUgkiM',
    imageWidth: 200,
    imageHeight: 100
});

    changeBlockById({
    blockId: 'homepage__block--student-support',
    newHeaderText: 'unblocked games',
    newHeaderId: 'custom-games-header',

});

    changeBlockById({
    blockId: 'homepage__block--14953',
    newHeaderText: 'ga naar poki',
    newHeaderId: 'custom-poki-header',
    newImageLink: 'https://poki.com',
    newImageSrc: 'data:image/png;base64,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',
    imageWidth: 100,
    imageHeight: 100
});
    changeBlockByNewsId({
        newsId: '18001',
        newHeaderText: 'Alexander sigma boy',
        newHeaderId: 'custom-sigma-header',
        newImageLink:'https://www.aservicestransfer.be',
        newImageSrc: 'data:image/jpeg;base64,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',
        imageWidth: 500,
        imageHeight: 500
    });

    changeBlockById({
    blockId: 'homepage__block--17801',
    newHeaderText: 'Ga naar spotify',
    newHeaderId: 'custom-spotify-header',
    newImageSrc: 'data:image/png;base64,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',
    newImageLink: 'https://www.spotify.com',
    imageWidth: 100,
    imageHeight: 100
});

    // Functie om profielfoto aan te passen
function veranderProfielfoto() {
    const nieuweFoto = prompt("Geef de link van je nieuwe profielfoto:");
    if (nieuweFoto) {
        localStorage.setItem('customProfielfoto', nieuweFoto);
        let profielFoto = document.querySelector('.js-btn-profile img');
        if (profielFoto) {
            profielFoto.src = nieuweFoto;
        }
    }
}

// Voeg knop toe op de pagina
let knop = document.createElement('button');
knop.innerText = "🖼 Profielfoto instellen";
knop.style.position = "fixed";
knop.style.top = "20px";
knop.style.right = "20px";
knop.style.zIndex = "9999";
knop.style.padding = "10px";
knop.style.backgroundColor = "#ff5757";
knop.style.color = "#fff";
knop.style.border = "none";
knop.style.borderRadius = "10px";
knop.style.cursor = "pointer";
document.body.appendChild(knop);

// Koppel klik aan functie
knop.addEventListener('click', veranderProfielfoto);

// Check of er al een profielfoto is opgeslagen in localStorage
const opgeslagenFoto = localStorage.getItem('customProfielfoto');
if (opgeslagenFoto) {
    let profielFoto = document.querySelector('.js-btn-profile img');
    if (profielFoto) {
        profielFoto.src = opgeslagenFoto;
    }
}

        // Voeg een knop toe om je naam aan te passen
    function addChangeNameButton() {
        const button = document.createElement('button');
        button.innerText = '✏️ Verander naam';
        button.style.position = 'fixed';
        button.style.top = '60px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.padding = '10px 15px';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        button.title = 'Klik om je profielnaam te wijzigen';

        button.addEventListener('click', () => {
            const newName = prompt('Wat wil je als profielnaam tonen?');
            if (newName) {
                localStorage.setItem('customProfileName', newName);
                updateProfileName(newName);
            }
        });

        document.body.appendChild(button);
    }

    // Update de naam in de profielfoto-knop
    function updateProfileName(name) {
        const nameSpan = document.querySelector('.js-btn-profile .hlp-vert-box span:nth-of-type(1)');
        if (nameSpan) {
            nameSpan.textContent = name;
        }
    }

    // Startscript zodra pagina klaar is
    window.addEventListener('load', () => {
        const storedName = localStorage.getItem('customProfileName');
        if (storedName) {
            updateProfileName(storedName);
        }
        addChangeNameButton();
    });





})();