// ==UserScript==
// @name                Floating PIP Button = Enable Picture in Picture for mobile
// @name:bg             Плаващ PIP бутон = Активиране на картина в картина за мобилни устройства
// @name:cs             Plovoucí tlačítko PIP = Povolit obraz v obraze pro mobilní zařízení
// @name:da             Flydende PIP-knap = Aktiver billede i billede til mobile enheder
// @name:de             Schwebender PIP-Button = Bild-in-Bild für mobile Geräte aktivieren
// @name:el             Επιπλέων κουμπί PIP = Ενεργοποίηση εικόνας σε εικόνα για κινητές συσκευές
// @name:en             Floating PIP Button = Enable Picture in Picture for mobile
// @name:eo             Flosanta PIP-Butono = Ebligi Bildon en Bildo por poŝtelefonoj
// @name:es             Botón Flotante PIP = Habilita Imagen en Imagen para móvil
// @name:es-la          Botón Flotante PIP = Habilita Imagen en Imagen para móvil
// @name:es-419         Botón Flotante PIP = Habilita Imagen en Imagen para móvil
// @name:fi             Kelluva PIP-painike = Ota käyttöön kuva kuvassa mobiililaitteille
// @name:fr             Bouton PIP flottant = Activer l'image dans l'image pour mobile
// @name:fr-CA          Bouton PIP flottant = Activer l'image dans l'image pour mobile
// @name:he             כפתור PIP צף = הפעלת תמונה בתוך תמונה לנייד
// @name:hr             Plutajući PIP gumb = Omogući sliku u slici za mobilne uređaje
// @name:hu             Lebegő PIP gomb = Kép a képben engedélyezése mobil eszközökre
// @name:id             Tombol PIP Mengambang = Aktifkan Gambar dalam Gambar untuk seluler
// @name:it             Pulsante PIP flottante = Abilita immagine nell'immagine per dispositivi mobili
// @name:ja             浮動PIPボタン = モバイル用のピクチャーインピクチャーを有効にする
// @name:ka             მცურავი PIP ღილაკი = ჩართეთ სურათი სურათში მობილური მოწყობილობებისთვის
// @name:ko             플로팅 PIP 버튼 = 모바일용 화면 속 화면 활성화
// @name:nb             Flytende PIP-knapp = Aktiver bilde i bilde for mobil
// @name:nl             Zwevende PIP-knop = Schakel beeld in beeld in voor mobiel
// @name:pl             Pływający przycisk PIP = Włącz obraz w obrazie dla urządzeń mobilnych
// @name:pt-BR          Botão PIP Flutuante = Ativar imagem em imagem para celular
// @name:ro             Buton PIP plutitor = Activează imagine în imagine pentru mobil
// @name:sv             Flytande PIP-knapp = Aktivera bild i bild för mobil
// @name:th             ปุ่ม PIP ลอย = เปิดใช้งานภาพในภาพสำหรับมือถือ
// @name:tr             Yüzen PIP Düğmesi = Mobil için Resim içinde Resim'i etkinleştir
// @name:ug             ھۆلۈپ تۇرغان PIP كۇنۇپكىسى = يانفونلار ئۈچۈن رەسىم ئىچىدە رەسىمنى قوزغىتىش
// @name:uk             Плаваюча кнопка PIP = Увімкнути картинку в картинці для мобільних пристроїв
// @name:vi             Nút PIP nổi = Bật chế độ Hình trong Hình cho di động
// @name:zh-TW          浮動PIP按鈕 = 啟用行動裝置的畫中畫模式
// @namespace           https://jlcareglio.github.io/
// @version             1.1.0
// @description         Adds a floating button to toggle Picture-in-Picture mode for videos on mobile devices.
// @description:bg      Добавя плаващ бутон за превключване на режим картина в картина за видеоклипове на мобилни устройства.
// @description:cs      Přidává plovoucí tlačítko pro přepínání režimu obraz v obraze pro videa na mobilních zařízeních.
// @description:da      Tilføjer en flydende knap til at skifte billede-i-billede-tilstand for videoer på mobile enheder.
// @description:de      Fügt eine schwebende Schaltfläche hinzu, um den Bild-in-Bild-Modus für Videos auf mobilen Geräten umzuschalten.
// @description:el      Προσθέτει ένα επιπλέον κουμπί για εναλλαγή της λειτουργίας εικόνας σε εικόνα για βίντεο σε κινητές συσκευές.
// @description:en      Adds a floating button to toggle Picture-in-Picture mode for videos on mobile devices.
// @description:eo      Aldonas flosantan butonon por ŝalti Bildon en Bildo-reĝimon por videoj en poŝtelefonoj.
// @description:es      Agrega un botón flotante para alternar el modo Imagen en Imagen para videos en dispositivos móviles.
// @description:es-la   Agrega un botón flotante para alternar el modo Imagen en Imagen para videos en dispositivos móviles.
// @description:es-419  Agrega un botón flotante para alternar el modo Imagen en Imagen para videos en dispositivos móviles.
// @description:fi      Lisää kelluvan painikkeen, jolla voi vaihtaa kuva kuvassa -tilan videoille mobiililaitteissa.
// @description:fr      Ajoute un bouton flottant pour basculer en mode image dans l'image pour les vidéos sur les appareils mobiles.
// @description:fr-CA   Ajoute un bouton flottant pour basculer en mode image dans l'image pour les vidéos sur les appareils mobiles.
// @description:he      מוסיף כפתור צף למעבר למצב תמונה בתוך תמונה עבור סרטונים במכשירים ניידים.
// @description:hr      Dodaje plutajući gumb za prebacivanje načina slike u slici za videozapise na mobilnim uređajima.
// @description:hu      Hozzáad egy lebegő gombot a kép a képben mód váltásához videókhoz mobil eszközökön.
// @description:id      Menambahkan tombol mengambang untuk beralih ke mode Gambar dalam Gambar untuk video di perangkat seluler.
// @description:it      Aggiunge un pulsante flottante per attivare la modalità immagine nell'immagine per i video sui dispositivi mobili.
// @description:ja      モバイルデバイスでビデオのピクチャーインピクチャーモードを切り替えるための浮動ボタンを追加します。
// @description:ka      ამატებს მცურავ ღილაკს მობილური მოწყობილობებისთვის ვიდეოების სურათში სურათის რეჟიმის ჩასართავად.
// @description:ko      모바일 장치에서 비디오의 화면 속 화면 모드를 전환하는 플로팅 버튼을 추가합니다.
// @description:nb      Legger til en flytende knapp for å bytte bilde-i-bilde-modus for videoer på mobile enheter.
// @description:nl      Voegt een zwevende knop toe om de modus Beeld-in-Beeld voor video's op mobiele apparaten in te schakelen.
// @description:pl      Dodaje pływający przycisk do przełączania trybu obraz w obrazie dla filmów na urządzeniach mobilnych.
// @description:pt-BR   Adiciona um botão flutuante para alternar o modo Imagem em Imagem para vídeos em dispositivos móveis.
// @description:ro      Adaugă un buton plutitor pentru a comuta modul imagine în imagine pentru videoclipuri pe dispozitive mobile.
// @description:sv      Lägger till en flytande knapp för att växla bild-i-bild-läge för videor på mobila enheter.
// @description:th      เพิ่มปุ่มลอยเพื่อสลับโหมดภาพในภาพสำหรับวิดีโอบนอุปกรณ์เคลื่อนที่
// @description:tr      Mobil cihazlarda videolar için Resim içinde Resim modunu değiştirmek için yüzen bir düğme ekler.
// @description:ug      يانفونلاردا ۋىدىئولار ئۈچۈن رەسىم ئىچىدە رەسىم ھالىتىنى ئالماشتۇرۇش ئۈچۈن ھۆلۈپ تۇرغان كۇنۇپكا قوشىدۇ.
// @description:uk      Додає плаваючу кнопку для перемикання режиму картинка в картинці для відео на мобільних пристроях.
// @description:vi      Thêm nút nổi để chuyển đổi chế độ Hình trong Hình cho video trên thiết bị di động.
// @description:zh-TW   添加一個浮動按鈕，以切換行動裝置上的影片畫中畫模式。
// @icon                https://lh3.googleusercontent.com/cvfpnTKw3B67DtM1ZpJG2PNAIjP6hVMOyYy403X4FMkOuStgG1y4cjCn21vmTnnsip1dTZSVsWBA9IxutGuA3dVDWhg
// @grant               none
// @author              Jesús Lautaro Careglio Albornoz
// @source              https://gist.githubusercontent.com/JLCareglio/22d3f9c9752352a29006f0c90c72d193/raw/01_Floating-PIP-Button.user.js
// @match               *://*/*
// @license             MIT
// @compatible          firefox
// @compatible          edge
// @compatible          kiwi
// @supportURL          https://gist.github.com/JLCareglio/22d3f9c9752352a29006f0c90c72d193/
// @downloadURL https://update.greasyfork.org/scripts/525479/Floating%20PIP%20Button%20%3D%20Enable%20Picture%20in%20Picture%20for%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/525479/Floating%20PIP%20Button%20%3D%20Enable%20Picture%20in%20Picture%20for%20mobile.meta.js
// ==/UserScript==

(async () => {
  const CONSTANTS = {
    BUTTON: {
      STYLE: `.pipButton { position: fixed; background-color: rgba(0, 0, 0, 0.5); border-radius: 50%; width: 60px; height: 60px; cursor: pointer; z-index: 9999; display: none; --delete-progress: 0; isolation: isolate; transform: scale(1); transition: transform 0.1s ease-out; } .pipButton:before { pointer-events: none; content: ""; position: absolute; top: 0; bottom: 0; width: 100%; z-index: 2; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36' width='100%25' height='100%25'%3E%3Cpath d='M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z' fill='%23fff'/%3E%3C/svg%3E") no-repeat center; } .pipButton:after { content: ""; position: absolute; inset: 0; background-color: rgba(255, 0, 0, 0.8); border-radius: 50%; transform: scale(var(--delete-progress)); transition: transform 0.5s ease; z-index: 1; }`,
      DEFAULT_POSITION: {
        right: 20,
        bottom: 20,
      },
    },
    TOUCH: {
      MOVE_THRESHOLD: 10,
      CLICK_TIMEOUT: 200,
      LONG_PRESS_TIMEOUT: 1000,
      LONG_PRESS_MOVE_THRESHOLD: 15,
      ANIMATION_DELAY: 300,
    },
    STORAGE: {
      POSITION_KEY: "pip_button_position",
    },
  };

  class PIPButton {
    button;
    watchedVideos;
    observer;
    isDragging = false;
    touchStartTime = 0;
    dragOffset = { x: 0, y: 0 };
    initialPosition = { x: 0, y: 0 };
    longPressTimer = null;
    longPressStartPosition = { x: 0, y: 0 };
    animationTimer = null;
    isManuallyHidden = false;

    constructor() {
      this.initializeButton();
      this.initializeVideoObserver();
      this.initializeDragHandlers();
      this.detectInitialVideos();
      this.initializeLongPressHandlers();
    }

    initializeButton() {
      this.button = document.createElement("div");
      this.button.classList.add("pipButton");
      this.injectStyles();
      document.body.appendChild(this.button);
      this.watchedVideos = new Set();
      this.loadButtonPosition();
      this.checkButtonPosition();
      window.addEventListener("resize", () => this.checkButtonPosition());
    }

    injectStyles() {
      const style = document.createElement("style");
      style.textContent = CONSTANTS.BUTTON.STYLE;
      document.head.appendChild(style);
    }

    initializeVideoObserver() {
      this.observer = new MutationObserver(this.handleMutations.bind(this));
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    handleMutations(mutations) {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLVideoElement) {
            this.addVideo(node);
          }
        });
      });
      this.updateButtonVisibility();
    }

    addVideo(video) {
      if (!this.watchedVideos.has(video)) {
        this.watchedVideos.add(video);
      }
    }

    detectInitialVideos() {
      document
        .querySelectorAll("video")
        .forEach((video) => this.addVideo(video));
      this.updateButtonVisibility();
    }

    togglePIP() {
      try {
        if (this.watchedVideos.size === 0) return;
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture();
          return;
        }
        const playingVideo = Array.from(this.watchedVideos).find(
          (video) => !video.paused && !video.ended && video.currentTime > 0
        );
        const videoToShow = playingVideo || Array.from(this.watchedVideos)[0];
        videoToShow
          ?.requestPictureInPicture()
          .then(() => {
            Object.defineProperty(document, "visibilityState", {
              get: () => "visible",
            });
          })
          .catch(console.error);
      } catch (error) {
        console.error("Error toggling PIP:", error);
      }
    }

    initializeDragHandlers() {
      this.button.addEventListener(
        "mousedown",
        this.handleDragStart.bind(this)
      );
      this.button.addEventListener(
        "touchstart",
        this.handleDragStart.bind(this)
      );
      document.addEventListener("mousemove", this.handleDragMove.bind(this));
      document.addEventListener("touchmove", this.handleDragMove.bind(this), {
        passive: false,
      });
      document.addEventListener("mouseup", this.handleDragEnd.bind(this));
      document.addEventListener("touchend", this.handleDragEnd.bind(this));
      document.addEventListener("touchcancel", this.handleDragEnd.bind(this));
    }

    handleDragStart(event) {
      this.isDragging = true;
      this.button.style.transform = "scale(2)";
      const rect = this.button.getBoundingClientRect();
      this.initialPosition = { x: rect.left, y: rect.top };
      const clientX = event.clientX || event.touches[0].clientX;
      const clientY = event.clientY || event.touches[0].clientY;
      this.dragOffset = {
        x: clientX - this.initialPosition.x,
        y: clientY - this.initialPosition.y,
      };
      this.touchStartTime = Date.now();
      event.preventDefault();
      event.stopPropagation();
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
      }
    }

    handleDragMove(event) {
      if (!this.isDragging) return;
      const clientX = event.clientX || event.touches[0].clientX;
      const clientY = event.clientY || event.touches[0].clientY;
      const newPosition = this.calculateNewPosition(
        clientX - this.dragOffset.x,
        clientY - this.dragOffset.y
      );
      this.updateButtonPosition(newPosition);
      event.preventDefault();
      event.stopPropagation();
    }

    calculateNewPosition(x, y) {
      const maxX = window.innerWidth - this.button.offsetWidth;
      const maxY = window.innerHeight - this.button.offsetHeight;
      return {
        x: Math.max(0, Math.min(x, maxX)),
        y: Math.max(0, Math.min(y, maxY)),
      };
    }

    updateButtonPosition(position) {
      this.button.style.left = `${position.x}px`;
      this.button.style.top = `${position.y}px`;
      this.button.style.right = "auto";
      this.button.style.bottom = "auto";
    }

    handleDragEnd(event) {
      if (!this.isDragging) return;
      this.button.style.transform = "scale(1)";
      const distance = this.calculateDragDistance();
      const elapsedTime = Date.now() - this.touchStartTime;
      if (
        elapsedTime < CONSTANTS.TOUCH.CLICK_TIMEOUT &&
        distance <= CONSTANTS.TOUCH.MOVE_THRESHOLD &&
        event.button !== 2
      )
        this.togglePIP();
      const position = {
        x: this.button.offsetLeft,
        y: this.button.offsetTop,
      };
      if (!this.isManuallyHidden)
        localStorage.setItem(
          CONSTANTS.STORAGE.POSITION_KEY,
          JSON.stringify(position)
        );
      this.isDragging = false;
      event.preventDefault();
      event.stopPropagation();
    }

    calculateDragDistance() {
      const dx = this.button.offsetLeft - this.initialPosition.x;
      const dy = this.button.offsetTop - this.initialPosition.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    updateButtonVisibility() {
      this.button.style.display =
        this.watchedVideos.size > 0 && !this.isManuallyHidden
          ? "block"
          : "none";
    }

    initializeLongPressHandlers() {
      this.button.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.hideButton();
      });
      const startLongPress = (e) => {
        const pos = e.touches ? e.touches[0] : e;
        this.longPressStartPosition = { x: pos.clientX, y: pos.clientY };
        this.button.style.setProperty("--delete-progress", "0");
        this.animationTimer = setTimeout(() => {
          requestAnimationFrame(() => {
            this.button.style.setProperty("--delete-progress", "1");
          });
        }, CONSTANTS.TOUCH.ANIMATION_DELAY);
        this.longPressTimer = setTimeout(() => {
          this.hideButton();
        }, CONSTANTS.TOUCH.LONG_PRESS_TIMEOUT);
      };
      const moveDuringPress = (e) => {
        if (this.longPressTimer) {
          const pos = e.touches ? e.touches[0] : e;
          const moveDistance = Math.sqrt(
            Math.pow(pos.clientX - this.longPressStartPosition.x, 2) +
              Math.pow(pos.clientY - this.longPressStartPosition.y, 2)
          );
          if (moveDistance > CONSTANTS.TOUCH.LONG_PRESS_MOVE_THRESHOLD) {
            clearTimeout(this.longPressTimer);
            clearTimeout(this.animationTimer);
            this.longPressTimer = null;
            this.animationTimer = null;
            this.button.style.setProperty("--delete-progress", "0");
          }
        }
      };
      const endLongPress = () => {
        if (this.longPressTimer) {
          clearTimeout(this.longPressTimer);
          clearTimeout(this.animationTimer);
          this.button.style.setProperty("--delete-progress", "0");
        }
      };
      // Touch events
      this.button.addEventListener("touchstart", startLongPress);
      this.button.addEventListener("touchmove", moveDuringPress);
      this.button.addEventListener("touchend", endLongPress);
      // Mouse events
      this.button.addEventListener("mousedown", (e) => {
        if (e.button === 0) startLongPress(e);
      });
      this.button.addEventListener("mousemove", moveDuringPress);
      this.button.addEventListener("mouseup", endLongPress);
      this.button.addEventListener("mouseleave", endLongPress);
    }

    hideButton() {
      this.isManuallyHidden = true;
      this.button.style.display = "none";
    }

    loadButtonPosition() {
      const savedPosition = localStorage.getItem(
        CONSTANTS.STORAGE.POSITION_KEY
      );
      if (savedPosition) {
        const position = JSON.parse(savedPosition);
        this.updateButtonPosition(position);
      } else {
        this.button.style.right = `${CONSTANTS.BUTTON.DEFAULT_POSITION.right}px`;
        this.button.style.bottom = `${CONSTANTS.BUTTON.DEFAULT_POSITION.bottom}px`;
      }
    }

    checkButtonPosition() {
      const rect = this.button.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const newLeft = Math.max(
        0,
        Math.min(rect.left, windowWidth - rect.width)
      );
      const newTop = Math.max(
        0,
        Math.min(rect.top, windowHeight - rect.height)
      );

      if (newLeft !== rect.left || newTop !== rect.top)
        this.updateButtonPosition({ x: newLeft, y: newTop });
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", () => new PIPButton());
  else new PIPButton();
})();
