// ==UserScript==
// @name         Extend & Configure Nusuk
// @namespace    http://tampermonkey.net/
// @version      2024-02-08
// @description  extend and configure n
// @author       me
// @match        https://hajj.nusuk.sa/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nusuk.sa
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527259/Extend%20%20Configure%20Nusuk.user.js
// @updateURL https://update.greasyfork.org/scripts/527259/Extend%20%20Configure%20Nusuk.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const refreshPage = () => {
    console.log('Refreshing...');
    location.reload();
  };

  const extendSessionButton = () => {
    document.querySelector("button[onclick='extendSession()']").click();
  };

  const expirationScript = () => {
    var scriptToCheck;

    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i > 0; i--) {
      if ('innerHTML' in scripts[i]) {
        if (scripts[i].innerHTML.indexOf('expiresUtc') != -1) {
          scriptToCheck = scripts[i];
          break;
        }
      } else {
        console.log('No script found');
      }
    }

    return scriptToCheck;
  };

  const extendSession = () => {
    let scriptToCheck = expirationScript();

    if (scriptToCheck === undefined) {
      return;
    }

    var regex = new RegExp("const\\s+csDateString\\s+=\\s+'(.*?)';");
    var match = regex.exec(scriptToCheck.innerHTML);
    var sessionExpiry = match[1];
    const expiresUtc = new Date(sessionExpiry);
    const dateNow = new Date(Date.now());
    var expiresIn = (expiresUtc - dateNow) / 1000 / 60;
    console.log('Expires In : ', expiresIn);

    if (5 > expiresIn && expiresIn > 4) {
      console.log('Extending session...');
      setTimeout(extendSessionButton, 1500);
    } else {
      setTimeout(extendSession, 10000);
    }
  };

  if (window.location.href.indexOf('hajj.nusuk.sa/profile/dashboard') !== -1) {
    console.log('Will refresh... in 45 seconds');

    setTimeout(refreshPage, 45000);
  } else if (window.location.href.indexOf('account/authorize') !== -1) {
    console.log('will not refresh');
    return;
  } else if (window.location.href.indexOf('hajj.nusuk.sa/packages') !== -1) {
    const removeOverlayDisabledClass = () => {
      document
        .querySelectorAll('.overlay-disabled')
        .forEach((el) => el.classList.remove('overlay-disabled'));
    };

    removeOverlayDisabledClass();

    const observer = new MutationObserver(removeOverlayDisabledClass);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  } else if (window.location.href.indexOf('booking/rooms/configure') !== -1) {
    let link = document.createElement('button');
    link.classList = 'btn btn-outline-main btn-next';
    link.innerHTML = 'Next &raquo;';
    document.querySelector('div.stepper-container > div > div').append(link);

    $('.btn-next').click(async ({ currentTarget }) => {
      // get form
      const $frm = $('#frmConfigureRoom');
      const formModel = complexFormToJson({
        form: $frm.get(0),
        ofTypeArray: ['Rooms'],
      });

      const transformedObject = {
        BookingRooms: [],
      };

      convertModelToArray(
        Object.entries(formModel)[0][1],
        transformedObject.BookingRooms
      );

      transformedObject.BookingRooms = removeDuplicated(
        transformedObject.BookingRooms
      ).filter((f) => f.NumberOfApplicants > 0);
      const formData = new FormData();

      complexModelToFormData(transformedObject, formData);

      const response = await fetch('?handler=SaveBooking', {
        method: 'POST',
        headers: {
          RequestVerificationToken: formModel.__RequestVerificationToken,
          'X-XSRF-TOKEN': formModel.__RequestVerificationToken,
        },
        body: formData,
      });

      // check the response
      if (!response.ok) {
        var json = await response.json();
        if (!json.success) {
          if (json.errors) {
            var result = await swal({
              icon: 'info',
              text: jsonValidationErrorsToString(json.errors),
              dangerMode: false,
              buttons: 'Ok',
            });

            if (
              result &&
              json.errors.find(
                (x) => x.key == 'ApplicationAlreadyHasBooking'
              ) != undefined
            ) {
              $('.cart-dropdown').each(function () {
                $(this).dropdown('show');
              });
              return;
            }
          } else {
            swal({
              icon: 'error',
              text: json.message,
              dangerMode: true,
              buttons: 'Ok',
            });
          }
        }
        return;
      }

      var json = await response.json();
      window.location = json.redirctUrl;
    });
  } else if (window.location.href.includes('sp/package/summary')) {
    const uuid = window.location.href.split('/').slice(-1).pop();
    const bottom = document.querySelector(
      'div.package-details > div.bg-maincolor'
    );

    let link = document.createElement('a');
    link.classList = 'btn btn-light';
    link.innerHTML = 'Configure';
    link.href = `https://hajj.nusuk.sa/package/${uuid}/booking/rooms/configure`;

    bottom.append(link);
  } else if (expirationScript() === undefined) {
    console.log('no session found');
    console.log('Will refresh in 90 seconds');

    setTimeout(refreshPage, 90000);
    return;
  } else {
    console.log('will not refresh');
  }

  setTimeout(extendSession, 1000);
})();
