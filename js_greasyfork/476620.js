// ==UserScript==
// @name Телемост.Помощник
// @description Предоставляет настройки камеры/микрофона в сервисе Яндекс.Телемост. См. cameraNum и micStateDefault ниже.
// @version 1.0.0
// @author Ivan Klochko
// @grant none
// @license MIT
// @include https://telemost.yandex.ru/*
// @namespace https://greasyfork.org/users/1186964
// @downloadURL https://update.greasyfork.org/scripts/476620/%D0%A2%D0%B5%D0%BB%D0%B5%D0%BC%D0%BE%D1%81%D1%82%D0%9F%D0%BE%D0%BC%D0%BE%D1%89%D0%BD%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/476620/%D0%A2%D0%B5%D0%BB%D0%B5%D0%BC%D0%BE%D1%81%D1%82%D0%9F%D0%BE%D0%BC%D0%BE%D1%89%D0%BD%D0%B8%D0%BA.meta.js
// ==/UserScript==

/**
 * Предоставляет настройки для сервиса Яндекс.Телемост.
 */
let telemostHelper = {
  
  /**
   * Номер активной камеры.
   * 
   * Если на вашем компьютере 2 или более вебкамер, здесь вы можете задать
   * номер нужной вам камеры. Для этого можно посмотреть выпадающий список
   * с камерами во всплывающем окне настроек.
   * Чтобы выключить камеру при входе во встречу - укажите 0.
   * 
   * @var int
   */
  cameraNum: 0,
  
  /**
   * Состояние микрофона по умолчанию (при входе во встречу).
   *
   * 0 - выключен,
   * 1 - включен.
   * 
   * @var int
   */
  micStateDefault: 0,

  /**
   * Id интервала.
   *
   * Интервал используется для проверки, готова ли страница для запуска скрипта.
   *
   * @var int
   */
  intervalId: 0,

  /**
   * Контейнер содержимого всплывающего окна.
   *
   * @var object
   */
  modalContent: null,

  /**
   * Инициализирует настройки.
   */
  attach: function() {
    const _self = this;

    this.intervalId = setInterval(function() {
      _self.changeSettings();
    }, 500);
  },

  /**
   * Приостанавливает выполнение скрипта.
   *
   * @param int duration.
   *   Продолжительность паузы (мсек).
   *
   * @return Promise
   *   Promise объект.
   */
  delay: function(duration) {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  },

  /**
   * Открывает окно настроек и меняет их.
   */
  changeSettings: function() {
    const _self = this;
    let btnMore = document.querySelector('div[class*="toolbar"] button[title="Ещё"]');
    let btnSettings;
    
    if (btnMore) {
      btnMore.click();
      btnMore.blur();
      btnSettings = document.querySelector('.Popup2 div[title="Открыть настройки"]')
    }

    if (!btnSettings) {
      return;
    }

    clearInterval(this.intervalId);
    this.changeMicState();
    
    if (0 === this.cameraNum) {
      this.changeCameraState();
      btnMore.click();
      btnMore.blur();
      return;
    }
    
    btnSettings.click();
    this.modalContent = document.querySelector('.Modal-Content');
    this.modalContent.style.opacity = 0;

    Promise.resolve()
      .then(() => _self.delay(50))
      .then(() => _self.openCameraSettings())
      .then(() => _self.delay(50))
      .then(() => _self.switchCamera())
      .then(() => _self.delay(900))
      .then(() => _self.closeSettings());
  },
  
  /**
   * Включает/выключает вебкамеру.
   */
  changeCameraState: function() {
    let btnCamera = document.querySelector('div[class*="toolbar"] button[title="Выключить камеру"]');
    
    if (0 === this.cameraNum && btnCamera) {
      setTimeout(function() {
      	btnCamera.click();
      	btnCamera.blur();
      }, 50);
    }
  },

  /**
   * Включает/выключает микрофон.
   */
  changeMicState: function() {
    let btnMic = document.querySelector('div[class*="toolbar"] button[title="Выключить микрофон"]');
    
    if (0 === this.micStateDefault && btnMic) {
      btnMic.click();
      btnMic.blur();
    }
  },

  /**
   * Открывает вкладку настроек камеры и раскрывает список камер.
   */
  openCameraSettings: function() {
    this.modalContent.querySelector('button:nth-child(3)').click();
    this.modalContent.querySelector('.Select2 button').click();
  },

  /**
   * Переключает камеру.
   */
  switchCamera: function() {
    const _self = this;
    const cameraItems = this.modalContent.querySelectorAll('.Popup2 .Menu-Item');

    // Сначала выбираем это.
    cameraItems && cameraItems[0] && cameraItems[0].click();

    // А затем переключаемся на нужную камеру.
    setTimeout(function() {
      cameraItems && cameraItems[_self.cameraNum - 1] && cameraItems[_self.cameraNum - 1].click();
    }, 800);
  },

  /**
   * Закрывает окно настроек.
   */
  closeSettings: function() {
    this.modalContent.querySelector('div[class*="HeaderButtonContainer"] button').click();
  }

}

telemostHelper.attach();