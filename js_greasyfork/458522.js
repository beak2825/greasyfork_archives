// ==UserScript==
// @name         Render Google Auth Button
// @namespace    cc QA
// @version      0.9
// @description  rendergoogle auth button
// @author       You
// @match        *https://service.studycorgi.com/form/step-1?google=1*
// @match        *.com/signin?google=1*
// @match        *.com/signup?google=1*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=service.ivypanda.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458522/Render%20Google%20Auth%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/458522/Render%20Google%20Auth%20Button.meta.js
// ==/UserScript==

function debounce(fn, duration) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, duration);
  };
}

class GoogleAuthButtonRenderer {

  static getTimezoneOffset() {
    return -new Date().getTimezoneOffset() * 60;
  }

  init() {
    this.notificationParentSelector = 'auth__notification-wrapper';
    this.removePrevButtons();
    this.renderElemnts();
    this.subscribeWindowResizeEvent();
  }

  removePrevButtons() {
    const gIdOnloadElement = document.querySelector('#g_id_onload');

    if (gIdOnloadElement) {
      gIdOnloadElement.remove();
    }
    const gIdSignin = document.querySelector('.g_id_signin');

    if (gIdSignin) {
      gIdSignin.remove();
    }
  }

  renderElemnts() {
    this.injectStyles();
    this.injectWrappers();
    this.injectNotificationContainer();
    this.initGoogleAuthApiLib();
  }


  injectNotificationContainer() {
    const parent = document.querySelector('.auth-login-form');
    const formElement = document.querySelector('.loginForm');
    const notificationContainer = document.createElement('div');

    parent.style.position = 'relative';
    notificationContainer.classList.add(this.notificationParentSelector);
    formElement.before(notificationContainer);
  }

  injectStyles() {
    const styles = '.g-button__wrapper{margin:0 0 2.1875rem}.g-button__btn-container{margin-top:1.25rem;margin-bottom:2.25rem}.g-button__btn-icon{margin-right:1rem}.g-button__btn-text{font-weight:700;font-size:.9375rem;line-height:1.5rem;display:flex;align-items:center;letter-spacing:-.01em;color:#292a4a}.g-button__divider{height:1px;background:#d6edea;position:relative}.g-button__divider::before{content:"OR";position:absolute;top:-.5rem;left:0;right:0;margin:0 auto;font-size:.8125rem;line-height:1rem;padding:0 .5rem;background:#fff;text-align:center;width:max-content;height:max-content}.g-button__modal.mock-modal{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:100%;max-width:400px;background:#fff;border-radius:6px;padding:1.5rem;box-shadow:0 3px 9px rgba(201,206,223,.45);z-index:1000}@media (min-width:768px){.g-button__modal.mock-modal{padding:2.5rem}}.auth__notification-wrapper{position:absolute;z-index:1;top:0;left:0;width:100%}.auth__notification-wrapper .notification{padding:.25rem 1.5rem;width:max-content;border-radius:.5625rem;margin:.125rem auto 0;font-weight:400;font-size:.875rem;line-height:1.5rem;text-align:center;color:#163141;max-width:99%}@media (max-width:767.98px){.auth__notification-wrapper .notification{padding:.25rem .3rem}}.auth__notification-wrapper .notification--success{background:#c0e0d6}.auth__notification-wrapper .notification--error{background:#ffd0d7}';
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }

  injectWrappers() {
    const elementAfterToAppend = document.querySelector('.auth-login__title.auth-login__title_ssc');
    const markDown = '<div class="g-button__btn-container" id="googleAuthButtonContainer"></div><div class="g-button__divider"></div>';
    const wrapperElement = document.createElement('div');
    wrapperElement.classList.add('g-button__wrapper');
    wrapperElement.innerHTML = markDown;
    elementAfterToAppend.after(wrapperElement);
  }

  initGoogleAuthApiLib() {
    this.initializeGoogleAuth();
    this.renderGoogleAuthButton();
  }

  renderGoogleAuthButton() {
      const width = this.getGoogleAuthButtonWidth();
    const buttonContainer = document.querySelector(
      '.g-button__btn-container',
    );

    window.google.accounts.id.renderButton(
      buttonContainer,
      {
        ...{
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'continue_with',
          width

        }
      },
    );
  }

  initializeGoogleAuth() {
    const cid = '192039999353-35ug1a3ol7ss2elkoqtmkjsgj4vq7m6h.apps.googleusercontent.com';
    window.google.accounts.id.initialize({
      client_id: cid,
      callback: (res, error) => {
        this.handleGoogleAuthResponse(res, error);
      },
    });
  }

  handleGoogleAuthResponse(res, error) {
    console.log(res);
    if (error) {
      this.showErrorMessage();
      return;
    }

    if (!res) {
      this.showErrorMessage();
      return;
    }
    fetch('/api/v1/authenticate/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...res,
        timezonw: GoogleAuthButtonRenderer.getTimezoneOffset(),
      }),
    }).then((response) => {
      this.showSuccessMessage();
      window.location.reload();
    }).catch((error) => {
      console.log(error);
      this.showErrorMessage();
    });
  }

  isButtonExists() {
    return !!document.getElementById('g_id_onload');
  }

  showErrorMessage() {
    this.removeNotification();
    const container = document.querySelector(`.${this.notificationParentSelector}`);
    const notification = document.createElement('div');
    notification.classList.add('notification', 'notification--error');
    notification.innerHTML = 'Unable to access Google profile information';
    container.appendChild(notification);
  }

  showSuccessMessage() {
    this.removeNotification();
    const container = document.querySelector(`.${this.notificationParentSelector}`);
    const notification = document.createElement('div');
    notification.classList.add('notification', 'notification--success');
    notification.innerHTML = 'Login successful! You will be redirected in a few seconds';
    container.appendChild(notification);
  }

  subscribeWindowResizeEvent() {
    window.addEventListener('resize', () => {
      this.handleWindowResizeEvent();
    });
  }

  handleWindowResizeEvent() {
    this.renderGoogleAuthButton();
  }


  removeNotification() {
    const notification = document.querySelector('.notification');
    if (!notification) {
      return;
    }

    notification.remove();
  }

     getGoogleAuthButtonWidth() {
         const $buttonContainer = document.querySelector(
             '.g-button__btn-container'
         );
         return $buttonContainer.offsetWidth;
     }
}

(function() {
  'use strict';
  const scriptElement = document.createElement('script');
  scriptElement.setAttribute('src', 'https://accounts.google.com/gsi/client');
  document.head.appendChild(scriptElement);

  setTimeout(() => {
    new GoogleAuthButtonRenderer().init();
  }, 3000);
})();