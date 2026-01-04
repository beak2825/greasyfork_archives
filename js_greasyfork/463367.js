// ==UserScript==
// @name         Book RApidly
// @namespace    https://tedmor.in
// @version      0.2
// @description  Book RA courts more easily
// @author       Ted
// @match        https://theracentre.my.site.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=racentre.com
// @require      https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463367/Book%20RApidly.user.js
// @updateURL https://update.greasyfork.org/scripts/463367/Book%20RApidly.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const siteUrl = "https://theracentre.my.site.com/";
  const log = (...args) => console.log('>>', ...args)

  const combineCourts = (...courts) => {
    return {
      label: `${courts[0].date}: ${courts[0].start24h}h to ${
        courts[courts.length - 1].end24h
      }h, Court ${courts[0].court}`,
      courts,
    };
  };
  const sortSlots = (slotA, slotB) => {
    const a = slotA.courts[0];
    const b = slotB.courts[0];
    // By day
    const compDay = parseInt(a.day) - parseInt(b.day);
    if (compDay) return compDay;

    // By start time
    const compStartTime = a.start24h - b.start24h;
    if (compStartTime) return compStartTime;

    // By court
    return a.court - b.court;
  };

  function waitFor(callback, timeout = 10000) {
    const now = Date.now();
    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        const result = callback();
        if (result) {
          clearInterval(timer);
          resolve(result);
        } else {
          if (timeout !== -1 && Date.now() - now > timeout) {
            clearInterval(timer);
            log("out of time:", callback, callback());
            reject("ran out of time");
          }
        }
      }, 100);
    });
  }

  async function waitForLoad() {
    const cssSpinner = () => document.querySelector(".summary.csspinner");
    await waitFor(cssSpinner);
    await waitFor(() => !cssSpinner());
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** Async wait for a selector to appear. */
  function findSelector(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  async function attachToCalendar() {
    const calendar = '#print-content'
    await findSelector(calendar);

    const target = document.querySelector(calendar)
    const config = { childList: true, subtree: true }

    log("attached");

    const observer = new MutationObserver((mutations) => {
      const pause = () => observer.disconnect()
      const resume = () => observer.observe(target, config)

      pause()

      log("hi");
      const slots = document.querySelectorAll('.fc-time-grid-event')
      slots.forEach(
          el => {
              const text = el.querySelector('.fc-title')
              const courtNumber = parseInt(text.textContent.split('Court ')[1])
              text.innerHTML = ''
              const anchor = document.createElement("a");
              // and give it some content
              anchor.appendChild(document.createTextNode("Register " + courtNumber));
              anchor.addEventListener('click', async e => {
                  pause()
                  e.stopPropagation()
                  e.preventDefault()
                  log('I was clicked!!!')
                  text.innerHTML = text.innerHTML.replace('Register', 'Registering')
                  resume()

                  const loop = async () => {
                      text.click()
                      while (!document.querySelector('.modal-open .modal-body')) {
                          await sleep(100)
                      }
                      const modal = document.querySelector('.modal-body')
                      log('modal', modal)
                      modal.querySelector('td').click()
                      log('clicked')
                      await sleep(500)
                      const registerButton = modal.querySelector('.btn-primary:not(.ng-hide)')
                      if (registerButton) {
                          registerButton.click()
                          // End loop!
                      } else {
                          [...document.querySelectorAll('.btn-primary:not(.ng-hide)')].find(btn => btn.textContent.includes('Close')).click()
                          await sleep(250)
                          loop()
                      }
                  }
                  loop()
              })
              // add the text node to the newly created div
              text.appendChild(anchor);
          }
      )

        resume()
    });
    observer.observe(target, config)


  }
  attachToCalendar();

  /**
   * When the court's modal is open, go through the wizard to close it.
   *
   * Supports multiple modals—you should open them all at once and then only run this function in sequence.
   */
  const registerCourt = async (
    court = { time: "n/a", label: "Program Name: Pickleball Court" },
    index = 0
  ) => {

    // Find the modal with the correct name.
    const getTargetModal = () => {
      const loadedModals = [
        ...document.querySelectorAll(".modal.in .modal-body"),
      ];
      return loadedModals.find(
        (modal) => !court.label || modal.innerText.includes(court.label)
      );
    };
    const targetModal = await waitFor(getTargetModal, -1);
    log("target modal", targetModal);

    // Get the next / add to cart button. It stays the same throughout the wizard steps.
    const nextButton = targetModal.querySelector(
      ".modal-body button.next-stepe"
    );
    log("next button", nextButton);

    nextButton.click();

    // The wizard asks us who this booking is for. Click the only option.
    // While we haven't made a selection, the next button is disabled.
    const userSelector = await waitFor(() =>
      targetModal.querySelector(".row.wizard-user")
    );
    log("userSelector", userSelector);

    userSelector.click();

    // Because we are fast in clicking the user selector, some loading seems to happen which unselects it.
    // We just wait for the unselection to occur and then select again.
    if (!index) {
      // Only first user selection seems to muck up
      try {
        await waitFor(
          () =>
            !targetModal
              .querySelector(".wizard-user-button")
              .innerText.includes("Selected"),
          4000
        );
        userSelector.click();
      } catch (e) {
        // Do nothing.
        console.warn("no need to wait for re-click");
      }
    }

    // After a short bit, the next button will be enabled and we can click it again.
    await waitFor(() => !nextButton.disabled);

    nextButton.click();

    // In the next screen, we are allowed to enter other players' names.
    const otherPlayersButton = await waitFor(() =>
      targetModal.querySelector(".prompt-container button")
    );
    log("otherPlayersButton", otherPlayersButton);

    // We don't need to fill out anything, just hit completed.
    otherPlayersButton.click();

    // Once the next button is enabled again, we can add to cart.
    await waitFor(() => !nextButton.disabled);
    nextButton.click();

    // Once the add to cart is done, a pop-up indicates success that we can close.
    const alertCancelButton = await waitFor(() =>
      document.querySelector(".sweet-alert button.cancel")
    );
    alertCancelButton.click();
    await waitForLoad();
  };

  const dayRollover = 9;
  const getRollover = () =>
    dayjs().hour(dayRollover).minute(0).second(0).millisecond(0);

  registerCourt();
})();
