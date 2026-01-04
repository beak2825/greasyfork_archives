// ==UserScript==
// @name        bangumi-copy-title
// @version     0.0.3
// @description Copy bangumi title to clipboard
// @author      Flynn Cao
// @namespace   https://flynncao.uk/
// @match       https://bangumi.tv/*
// @match       https://chii.in/*
// @match       https://bgm.tv/*
// @include     /^https?:\/\/(((fast\.)?bgm\.tv)|chii\.in|bangumi\.tv)*/
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/536616/bangumi-copy-title.user.js
// @updateURL https://update.greasyfork.org/scripts/536616/bangumi-copy-title.meta.js
// ==/UserScript==
'use strict';

function createButton(
  { id, text, icon, className, onClick, disabled = false },
  userSettings = {},
) {
  // Create button with base class
  const button = $('<strong></strong>').html(icon).addClass(className)[0];

  button.id = id;

  if (
    Object.prototype.hasOwnProperty.call(userSettings, 'showText') &&
    userSettings.showText === true
  ) {
    // add a text named "显示标题' following the svg icon with font size  21px 21px
    const textNode = document.createTextNode(text);
    const span = document.createElement('span');
    span.append(textNode);
    button.append(span);
  }

  button.addEventListener('click', onClick);
  button.disabled = disabled;

  return button
}

function createCheckbox(
  { id, label, className, onChange, checked, disabled = false },
  userSettings = {},
) {
  // Create the checkbox container
  const labelEl = document.createElement('label');
  labelEl.className = className;

  // Create the checkbox input
  const inputEl = document.createElement('input');
  inputEl.type = 'checkbox';
  inputEl.id = id;
  inputEl.checked = checked;

  // Create the custom checkmark span
  const checkmarkEl = document.createElement('span');
  checkmarkEl.className = 'bct-checkmark';

  // Create the label text span
  const textSpan = document.createElement('span');
  textSpan.textContent = label;

  // Append elements to the label
  labelEl.append(inputEl);
  labelEl.append(checkmarkEl);
  labelEl.append(textSpan);

  inputEl.addEventListener('change', onChange);
  inputEl.disabled = disabled;

  return labelEl
}

const BGM_SUBJECT_REGEX =
  /^https:\/\/(((fast\.)?bgm\.tv)|(chii\.in)|(bangumi\.tv))\/subject\/\d+/;

const STORAGE_NAMESPACE = 'BangumiCopyTitle';

var butterupStyles = ".toaster{\n\tfont-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial,\n\tNoto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;\n\tbox-sizing: border-box;\n\tpadding: 0;\n\tmargin: 0;\n\tlist-style: none;\n\toutline: none;\n\tz-index: 999999999;\n\tposition: fixed;\n\tpadding: 5px;\n}\n\n@keyframes spin {\nfrom {\n\ttransform: rotate(0deg);\n}\nto {\n\ttransform: rotate(360deg);\n}\n}\n\n.animate-spin {\nanimation: spin 1s linear infinite;\n}\n\n.toaster.bottom-right{\n\tbottom: 20px;\n\tright: 20px;\n}\n\n.toaster.bottom-left{\n\tbottom: 20px;\n\tleft: 20px;\n}\n\n.toaster.top-right{\n\ttop: 20px;\n\tright: 20px;\n}\n\n.toaster.top-left{\n\ttop: 20px;\n\tleft: 20px;\n}\n\n.toaster.bottom-center{\n\tbottom: 20px;\n\tleft: 50%;\n\ttransform: translateX(-50%);\n}\n\n.toaster.top-center{\n\ttop: 20px;\n\tleft: 50%;\n\ttransform: translateX(-50%);\n}\n\n.toaster.top-center ol.rack{\n\tflex-direction: column-reverse;\n}\n\n.toaster.top-left ol.rack{\n\tflex-direction: column-reverse;\n}\n\n.toaster.top-right ol.rack{\n\tflex-direction: column-reverse;\n}\n\n.toaster.bottom-center ol.rack{\n\tflex-direction: column;\n}\n\n.toaster.bottom-left ol.rack{\n\tflex-direction: column;\n}\n\n.toaster.bottom-right ol.rack{\n\tflex-direction: column;\n}\n\nol.rack{\n\tlist-style: none;\n\tpadding: 0;\n\tmargin: 0;\n\t/* reverse the list order so that the newest items are at the top */\n\tdisplay: flex;\n}\n\nol.rack li{\n\tmargin-bottom: 16px;\n}\n\n/* Stacked Toasts Enabled */\nol.rack.upperstack li{\n\tmargin-bottom: -35px;\n\ttransition: all 0.3s ease-in-out;\n}\n\nol.rack.upperstack li:hover{\n\tmargin-bottom: 16px;\n\tscale: 1.03;\n\ttransition: all 0.3s ease-in-out;\n}\n\nol.rack.lowerstack li{\n\tmargin-top: -35px;\n}\n\n\nol.rack.lowerstack{\n margin-bottom: 0px;\n}\n\n.butteruptoast{\n\tborder-radius: 8px;\n\tbox-shadow: 0 4px 12px #0000001a;\n\tfont-size: 13px;\n\tdisplay: flex;\n\tpadding: 16px;\n\tborder: 1px solid hsl(0, 0%, 93%);\n\tbackground-color: white;\n\tgap: 6px;\n\tcolor: #282828;\n\twidth: 325px;\n\ttransition: all 0.3s ease-in-out;\n}\n\n.butteruptoast.dismissable{\n\tcursor: pointer;\n}\n\n.butteruptoast .icon{\n\tdisplay: flex;\n\talign-items: start;\n\tflex-direction: column;\n}\n\n.butteruptoast .icon svg{\n\twidth: 20px;\n\theight: 20px;\n\tfill: #282828;\n\tpadding: 0;\n\tmargin: 0;\n}\n\n.butteruptoast .notif .desc{\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 2px;\n\tpadding: 0;\n\tmargin: 0;\n}\n\n.butteruptoast .notif .desc .title{\n\tfont-weight: 600;\n\tline-height: 1.5;\n\tpadding: 0;\n\tmargin: 0;\n\n}\n\n.butteruptoast .notif .desc .message{\n\tfont-weight: 400;\n\tline-height: 1.4;\n\tpadding: 0;\n\tmargin: 0;\n}\n\n.butteruptoast.success{\n\tbackground-color: #ebfef2;\n\tcolor: hsl(140, 100%, 27%);\n\tborder: solid 1px hsl(145, 92%, 91%);\n}\n\n.butteruptoast.success .icon svg{\n\tfill: hsl(140, 100%, 27%);\n}\n\n.butteruptoast.error .icon svg{\n\tfill: hsl(0, 100%, 27%);\n}\n\n.butteruptoast.warning .icon svg{\n\tfill: hsl(50, 100%, 27%);\n}\n\n.butteruptoast.info .icon svg{\n\tfill: hsl(210, 100%, 27%);\n}\n\n.butteruptoast.error{\n\tbackground-color: #fef0f0;\n\tcolor: hsl(0, 100%, 27%);\n\tborder: solid 1px hsl(0, 92%, 91%);\n}\n\n.butteruptoast.warning{\n\tbackground-color: #fffdf0;\n\tcolor: hsl(50, 100%, 27%);\n\tborder: solid 1px hsl(50, 92%, 91%);\n}\n\n.butteruptoast.info{\n\tbackground-color: #f0f8ff;\n\tcolor: hsl(210, 100%, 27%);\n\tborder: solid 1px hsl(210, 92%, 91%);\n}\n\n/* Buttons */\n.toast-buttons{\n\tdisplay: flex;\n\tgap: 8px;\n\twidth: 100%;\n\talign-items: center;\n\tflex-direction: row;\n\tmargin-top: 16px;\n}\n\n.toast-buttons .toast-button.primary{\n\tbackground-color: #282828;\n\tcolor: white;\n\tpadding: 8px 16px;\n\tborder-radius: 4px;\n\tcursor: pointer;\n\tborder: none;\n\twidth: 100%;\n}\n\n.toast-buttons .toast-button.secondary{\n\tbackground-color: #f0f8ff;\n\tcolor: hsl(210, 100%, 27%);\n\tborder: solid 1px hsl(210, 92%, 91%);\n\tpadding: 8px 16px;\n\tborder-radius: 4px;\n\tcursor: pointer;\n\twidth: 100%;\n}\n\n/* Success toast buttons */\n.butteruptoast.success .toast-button.primary {\n\tbackground-color: hsl(145, 63%, 42%);\n\tcolor: white;\n}\n\n.butteruptoast.success .toast-button.secondary {\n\tbackground-color: hsl(145, 45%, 90%);\n\tcolor: hsl(145, 63%, 32%);\n\tborder: solid 1px hsl(145, 63%, 72%);\n}\n\n/* Error toast buttons */\n.butteruptoast.error .toast-button.primary {\n\tbackground-color: hsl(354, 70%, 54%);\n\tcolor: white;\n}\n\n.butteruptoast.error .toast-button.secondary {\n\tbackground-color: hsl(354, 30%, 90%);\n\tcolor: hsl(354, 70%, 44%);\n\tborder: solid 1px hsl(354, 70%, 74%);\n}\n\n/* Warning toast buttons */\n.butteruptoast.warning .toast-button.primary {\n\tbackground-color: hsl(45, 100%, 51%);\n\tcolor: hsl(45, 100%, 15%);\n}\n\n.butteruptoast.warning .toast-button.secondary {\n\tbackground-color: hsl(45, 100%, 96%);\n\tcolor: hsl(45, 100%, 31%);\n\tborder: solid 1px hsl(45, 100%, 76%);\n}\n\n/* Info toast buttons */\n.butteruptoast.info .toast-button.primary {\n\tbackground-color: hsl(207, 90%, 54%);\n\tcolor: white;\n}\n\n.butteruptoast.info .toast-button.secondary {\n\tbackground-color: hsl(207, 90%, 94%);\n\tcolor: hsl(207, 90%, 34%);\n\tborder: solid 1px hsl(207, 90%, 74%);\n}\n\n\n\n\n/* Entrance animations */\n/*  Note: These animations need to differ depending on the location of the toaster\n\tElements that are in the top should slide and fade down from the top\n\tElemennts that are in the bottom should slide and fade up from the bottom\n*/\n\n.toastUp{\n\tanimation: slideUp 0.5s ease-in-out;\n\tanimation-fill-mode: forwards;\n}\n\n.toastDown{\n\tanimation: slideDown 0.5s ease-in-out;\n\tanimation-fill-mode: forwards;\n}\n\n@keyframes slideDown {\n\t0% {\n\t\t\topacity: 0;\n\t\t\ttransform: translateY(-100%);\n\t}\n\t100% {\n\t\t\topacity: 1;\n\t\t\ttransform: translateY(0);\n\t}\n}\n\n@keyframes slideUp {\n\t0% {\n\t\t\topacity: 0;\n\t\t\ttransform: translateY(100%);\n\t}\n\t100% {\n\t\t\topacity: 1;\n\t\t\ttransform: translateY(0);\n\t}\n}\n\n.fadeOutToast{\n\tanimation: fadeOut 0.3s ease-in-out;\n\tanimation-fill-mode: forwards;\n}\n\n@keyframes fadeOut {\n\t0% {\n\t\t\topacity: 1;\n\t}\n\t100% {\n\t\t\topacity: 0;\n\t}\n}\n\n/*  Additional Styles\n\tThese styles are an alternative to the standard option. A user can choose to use these\n\tstyles by setting the theme: variable per toast\n*/\n\n/* Glass */\n\n.butteruptoast.glass{\n\tbackground-color: rgba(255, 255, 255, 0.42) !important;\n\tbackdrop-filter: blur(10px);\n\t-webkit-backdrop-filter: blur(10px);\n\tborder: none;\n\tbox-shadow: 0 4px 12px #0000001a;\n\tcolor: #282828;\n}\n\n.butteruptoast.glass.success{\n\tbackground-color: rgba(235, 254, 242, 0.42) !important;\n\tbackdrop-filter: blur(10px);\n\t-webkit-backdrop-filter: blur(10px);\n\tborder: none;\n\tbox-shadow: 0 4px 12px #0000001a;\n\tcolor: hsl(140, 100%, 27%);\n}\n\n.butteruptoast.glass.error{\n\tbackground-color: rgba(254, 240, 240, 0.42) !important;\n\tbackdrop-filter: blur(10px);\n\t-webkit-backdrop-filter: blur(10px);\n\tborder: none;\n\tbox-shadow: 0 4px 12px #0000001a;\n\tcolor: hsl(0, 100%, 27%);\n}\n\n.butteruptoast.glass.warning{\n\tbackground-color: rgba(255, 253, 240, 0.42) !important;\n\tbackdrop-filter: blur(10px);\n\t-webkit-backdrop-filter: blur(10px);\n\tborder: none;\n\tbox-shadow: 0 4px 12px #0000001a;\n\tcolor: hsl(50, 100%, 27%);\n}\n\n.butteruptoast.glass.info{\n\tbackground-color: rgba(240, 248, 255, 0.42) !important;\n\tbackdrop-filter: blur(10px);\n\t-webkit-backdrop-filter: blur(10px);\n\tborder: none;\n\tbox-shadow: 0 4px 12px #0000001a;\n\tcolor: hsl(210, 100%, 27%);\n}\n\n/* brutalist */\n.butteruptoast.brutalist{\n\tborder-radius: 0px;\n\tbox-shadow: 0 4px 12px #0000001a;\n\tborder: solid 2px #282828;\n\tfont-size: 13px;\n\talign-items: center;\n\tdisplay: flex;\n\tpadding: 16px;\n\tbackground-color: white;\n\tgap: 6px;\n\tcolor: #282828;\n\twidth: 325px;\n}\n\n.butteruptoast.brutalist.success{\n\tbackground-color: #ebfef2;\n\tcolor: hsl(140, 100%, 27%);\n\tborder: solid 2px hsl(140, 100%, 27%);\n}\n\n.butteruptoast.brutalist.error{\n\tbackground-color: #fef0f0;\n\tcolor: hsl(0, 100%, 27%);\n\tborder: solid 2px hsl(0, 100%, 27%);\n}\n\n.butteruptoast.brutalist.warning{\n\tbackground-color: #fffdf0;\n\tcolor: hsl(50, 100%, 27%);\n\tborder: solid 2px hsl(50, 100%, 27%);\n}\n\n.butteruptoast.brutalist.info{\n\tbackground-color: #f0f8ff;\n\tcolor: hsl(210, 100%, 27%);\n\tborder: solid 2px hsl(210, 100%, 27%);\n}\n";

var styles = "\n\n.bct-button {\n  /* --button-size: 2rem;\n  width: var(--button-size);\n  height: var(--button-size); */\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  color: #000;\n  transform: translateY(4px);\n  padding: 2px 5px;\n  border: 1px solid transparent;\n}\n\n[data-theme=\"dark\"] .bct-button {\n\tcolor: #f5f5f5;\n} \n\n.bct-button:hover {\n\tborder: 1px solid lightgray;\n\tborder-radius: 4px;\n\ttransition: all 0.2s ease-in-out;\n}\n\n.bct-button svg {\n  width: 100%;\n  height: 100%;\n  /* Let the button control the size */\n  flex: 1;\n}\n\n.bct-button svg {\n  max-width: 21px;\n  max-height: 21px;\n}\n\n\n.bct-button span{\n\tfont-size: 12px!important;\n\tfont-weight: normal!important;\n\tpadding-right: 4px!important;\n}\n[data-theme=\"dark\"] .bct-button svg {\n\tfilter:invert(1)\n}\n\n.bct-checkbox {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  height: 20px;\n  cursor: pointer;\n}\n\n.bct-checkbox .bct-checkmark {\n  /* You had no styles for this in the original, but leave this as a placeholder */\n\n}\n\n\n.bct-checkbox span:last-child {\n\tmargin-left: 2px;\n}\n";

// Forked from https://github.com/dgtlss/butterup
const butterup = {
  options: {
    maxToasts: 5, // Max number of toasts that can be on the screen at once
    toastLife: 5000, // How long a toast will stay on the screen before fading away
    currentToasts: 0, // Current number of toasts on the screen
  },
  toast({
    title,
    message,
    type,
    location,
    icon,
    theme,
    customIcon,
    dismissable,
    onClick,
    onRender,
    onTimeout,
    customHTML,
    primaryButton,
    secondaryButton,
    maxToasts,
    duration,
  }) {
    /* Check if the toaster exists. If it doesn't, create it. If it does, check if there are too many toasts on the screen.
			If there are too many, delete the oldest one and create a new one. If there aren't too many, create a new one. */
    if (document.querySelector('#toaster') == null) {
      // toaster doesn't exist, create it
      const toaster = document.createElement('div');
      toaster.id = 'toaster';
      if (location == null) {
        toaster.className = 'toaster top-right';
      } else {
        toaster.className = `toaster ${location}`;
      }

      // Create the toasting rack inside of the toaster
      document.body.append(toaster);

      // Create the toasting rack inside of the toaster
      if (document.querySelector('#butterupRack') == null) {
        const rack = document.createElement('ol');
        rack.id = 'butterupRack';
        rack.className = 'rack';
        toaster.append(rack);
      }
    } else {
      const toaster = document.querySelector('#toaster');
      // check what location the toaster is in
      toaster.classList.forEach(function (item) {
        // remove any location classes from the toaster
        if (
          item.includes('top-right') ||
          item.includes('top-center') ||
          item.includes('top-left') ||
          item.includes('bottom-right') ||
          item.includes('bottom-center') ||
          item.includes('bottom-left')
        ) {
          toaster.classList.remove(item);
        }
      });
      if (location == null) {
        toaster.className = 'toaster top-right';
      } else {
        toaster.className = `toaster ${location}`;
      }
      document.querySelector('#butterupRack');
    }
    // Load Custom Options
    if (maxToasts != null) {
      butterup.options.maxToasts = maxToasts;
    }
    if (duration != null) {
      butterup.options.toastLife = duration;
    }
    // Check if there are too many toasts on the screen
    if (butterup.options.currentToasts >= butterup.options.maxToasts) {
      // there are too many toasts on the screen, delete the oldest one
      var oldestToast = document.querySelector('#butterupRack').firstChild;
      document.querySelector('#butterupRack').removeChild(oldestToast);
      butterup.options.currentToasts--;
    }

    // Create the toast
    const toast = document.createElement('li');
    butterup.options.currentToasts++;
    toast.className = 'butteruptoast';
    // Add entrance animation class
    toast.className += ' toast-enter';
    // if the toast class contains a top or bottom location, add the appropriate class to the toast
    if (
      toaster.className.includes('top-right') ||
      toaster.className.includes('top-center') ||
      toaster.className.includes('top-left')
    ) {
      toast.className += ' toastDown';
    }
    if (
      toaster.className.includes('bottom-right') ||
      toaster.className.includes('bottom-center') ||
      toaster.className.includes('bottom-left')
    ) {
      toast.className += ' toastUp';
    }
    toast.id = `butterupToast-${butterup.options.currentToasts}`;
    if (type != null) {
      toast.className += ` ${type}`;
    }

    if (theme != null) {
      toast.className += ` ${theme}`;
    }

    // Add the toast to the rack
    document.querySelector('#butterupRack').append(toast);

    // check if the user wants an icon
    if (icon != null && icon == true) {
      // add a div inside the toast with a class of icon
      const toastIcon = document.createElement('div');
      toastIcon.className = 'icon';
      toast.append(toastIcon);
      // check if the user has added a custom icon
      if (customIcon) {
        toastIcon.innerHTML = customIcon;
      }
      if (type != null && customIcon == null) {
        // add the type class to the toast
        toast.className += ` ${type}`;
        if (type == 'success') {
          toastIcon.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">' +
            '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />' +
            '</svg>';
        }
        if (type == 'error') {
          toastIcon.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">' +
            '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />' +
            '</svg>';
        }
        if (type == 'warning') {
          toastIcon.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">' +
            '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />' +
            '</svg>';
        }
        if (type == 'info') {
          toastIcon.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">' +
            '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />' +
            '</svg>';
        }
      }
    }

    // add a div inside the toast with a class of notif
    const toastNotif = document.createElement('div');
    toastNotif.className = 'notif';
    toast.append(toastNotif);

    // add a div inside of notif with a class of desc
    const toastDesc = document.createElement('div');
    toastDesc.className = 'desc';
    toastNotif.append(toastDesc);

    // check if the user added a title
    if (title != null) {
      const toastTitle = document.createElement('div');
      toastTitle.className = 'title';
      toastTitle.innerHTML = title;
      toastDesc.append(toastTitle);
    }

    if (customHTML != null) {
      const toastHTML = document.createElement('div');
      toastHTML.className = 'message';
      toastHTML.innerHTML = customHTML;
      toastDesc.append(toastHTML);
    }

    // check if the user added a message
    if (message != null) {
      const toastMessage = document.createElement('div');
      toastMessage.className = 'message';
      toastMessage.innerHTML = message;
      toastDesc.append(toastMessage);
    }

    // Add buttons if specified
    if (primaryButton || secondaryButton) {
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'toast-buttons';
      toastNotif.append(buttonContainer);

      if (primaryButton) {
        const primaryBtn = document.createElement('button');
        primaryBtn.className = 'toast-button primary';
        primaryBtn.textContent = primaryButton.text;
        primaryBtn.addEventListener('click', function (event) {
          event.stopPropagation();
          primaryButton.onClick(event);
        });
        buttonContainer.append(primaryBtn);
      }

      if (secondaryButton) {
        const secondaryBtn = document.createElement('button');
        secondaryBtn.className = 'toast-button secondary';
        secondaryBtn.textContent = secondaryButton.text;
        secondaryBtn.addEventListener('click', function (event) {
          event.stopPropagation();
          secondaryButton.onClick(event);
        });
        buttonContainer.append(secondaryBtn);
      }
    }

    // Check if the user has mapped any custom click functions
    if (onClick && typeof onClick === 'function') {
      toast.addEventListener('click', function (event) {
        // Prevent the click event from triggering dismissal if the toast is dismissable
        event.stopPropagation();
        onClick(event);
      });
    }

    // Call onRender callback if provided
    if (onRender && typeof onRender === 'function') {
      onRender(toast);
    }

    if (dismissable != null && dismissable == true) {
      // Add a class to the toast to make it dismissable
      toast.className += ' dismissable';
      // when the item is clicked on, remove it from the DOM
      toast.addEventListener('click', function () {
        butterup.despawnToast(toast.id);
      });
    }

    // Remove the entrance animation class after the animation has finished
    setTimeout(function () {
      toast.classList.remove('toast-enter');
    }, 300); // Adjust timing as needed

    // despawn the toast after the specified time
    setTimeout(function () {
      if (onTimeout && typeof onTimeout === 'function') {
        onTimeout(toast);
      }
      butterup.despawnToast(toast.id);
    }, butterup.options.toastLife);
  },
  despawnToast(toastId, onClosed) {
    var toast = document.getElementById(toastId);
    if (toast != null) {
      toast.classList.add('toast-exit');
      setTimeout(function () {
        try {
          toast.remove();
          butterup.options.currentToasts--;
          if (onClosed && typeof onClosed === 'function') {
            onClosed(toast);
          }
        } catch {
          // do nothing
        }
        // if this was the last toast on the screen, remove the toaster
        if (butterup.options.currentToasts == 0) {
          var toaster = document.querySelector('#toaster');
          toaster.remove();
        }
      }, 300); // Adjust timing to match your CSS animation duration
    }
  },
  promise({ promise, loadingMessage, successMessage, errorMessage, location, theme }) {
    const toastId = `butterupToast-${butterup.options.currentToasts + 1}`;

    // Create initial loading toast
    this.toast({
      message: loadingMessage || 'Loading...',
      location,
      theme,
      icon: true,
      customIcon:
        '<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>',
      dismissable: false,
    });

    // Update toast based on promise outcome
    return promise.then(
      (result) => {
        this.updatePromiseToast(toastId, {
          type: 'success',
          message: successMessage || 'Operation successful',
          icon: true,
        });
        return result
      },
      (error) => {
        this.updatePromiseToast(toastId, {
          type: 'error',
          message: errorMessage || 'An error occurred',
          icon: true,
        });
        throw error
      },
    )
  },
  updatePromiseToast(toastId, { type, message, icon }) {
    const toast = document.getElementById(toastId);
    if (toast) {
      toast.className = toast.className.replaceAll(/success|error|warning|info/g, '');
      toast.classList.add(type);

      const messageEl = toast.querySelector('.message');
      if (messageEl) {
        messageEl.textContent = message;
      }

      const iconEl = toast.querySelector('.icon');
      if (iconEl && icon) {
        iconEl.innerHTML = this.getIconForType(type);
      }

      // Reset the toast lifetime
      clearTimeout(toast.timeoutId);
      toast.timeoutId = setTimeout(() => {
        this.despawnToast(toastId);
      }, this.options.toastLife);
    }
  },
  getIconForType(type) {
    switch (type) {
      case 'success':
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>'
      case 'error':
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" /></svg>'
      case 'warning':
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>'
      case 'info':
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" /></svg>'
      default:
        return ''
    }
  },
};

// https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.2d233a81lHbKxM&cid=7077
const Icons = {
  copy: '<svg t="1747748621659" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8232" data-darkreader-inline-fill="" width="256" height="256"><path d="M682.666667 341.333333h128v469.333334H341.333333v-128H213.333333V213.333333h469.333334v128z m0 85.333334v256h-256v42.666666h298.666666v-298.666666h-42.666666zM298.666667 298.666667v298.666666h298.666666V298.666667H298.666667z" fill="#444444" p-id="8233" data-darkreader-inline-fill="" style="--darkreader-inline-fill: var(--darkreader-background-444444, #33373a);"></path></svg>',
};

// eslint-disable-next-line unicorn/no-static-only-class
class Storage {
  static set(key, value) {
    localStorage.setItem(`${STORAGE_NAMESPACE}_${key}`, JSON.stringify(value));
  }

  static get(key) {
    const value = localStorage.getItem(`${STORAGE_NAMESPACE}_${key}`);
    return value ? JSON.parse(value) : undefined
  }

  static async init(settings) {
    const keys = Object.keys(settings);
    for (const key of keys) {
      const value = Storage.get(key);
      if (value === undefined) {
        Storage.set(key, settings[key]);
      }
    }
  }
}

(async function () {
  // Validate if the current page is a Bangumi subject page
  if (!BGM_SUBJECT_REGEX.test(location.href)) {
    return
  }

  // Storage
  Storage.init({
    copyJapaneseTitle: false,
    showText: true,
  });

  const userSettings = {
    copyJapaneseTitle: Storage.get('copyJapaneseTitle') || false,
    showText: Storage.get('showText') || true,
  };

  // Layout and Events
  const injectStyles = () => {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.append(styleEl);
    const butterupStyleEl = document.createElement('style');
    butterupStyleEl.textContent = butterupStyles;
    document.head.append(butterupStyleEl);
  };
  injectStyles();
  // Render a toast notification in the top-right corner of the screen

  $('h1.nameSingle').append(
    createButton(
      {
        id: 'bct-copy-title',
        text: '复制',
        icon: Icons.copy,
        className: 'bct-button',
        onClick: () => {
          const title = userSettings.copyJapaneseTitle
            ? $('h1.nameSingle').find('a').text().trim()
            : $('h1.nameSingle').find('a').attr('title');
          navigator.clipboard.writeText(title);

          butterup.toast({
            title: `已复制${userSettings.copyJapaneseTitle ? '日文名' : '中文名'}到剪切板！`,
            location: 'top-right',
            dismissable: false,
            type: 'success',
            duration: 2500,
            icon: true,
          });
        },
      },
      userSettings,
    ),
  );

  $('h1.nameSingle').append(
    createCheckbox(
      {
        id: 'bct-hide-plain-comments',
        label: '日文名',
        className: 'bct-checkbox',
        onChange: (e) => {
          userSettings.copyJapaneseTitle = e.target.checked;
          Storage.set('copyJapaneseTitle', userSettings.copyJapaneseTitle);
        },
        checked: userSettings.copyJapaneseTitle,
        disabled: false,
      },
      userSettings,
    ),
  );
})();
