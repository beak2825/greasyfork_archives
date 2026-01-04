// ==UserScript==
// @name         Melee Start (Mobile)
// @namespace    http://tampermonkey.net/
// @version      10.1.3
// @description  Move 'Start Fight' button for mobile devices and hide button on click
// @author       me
// @match        https://www.torn.com/loader*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468192/Melee%20Start%20%28Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/468192/Melee%20Start%20%28Mobile%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // logging?
  const logging = false;

  const startFightCallBack = function(mutationsList, observer) {
    var attackerModal;
    var dialogButton;
    var weapon_melee;
    var weapon_temp;

    for (const mutation of mutationsList) {
      $(mutation.addedNodes)
        .find('[id="attacker"] [class^="modal___"][style="display: block;"]')
        .each(function() {
          const modal = $(this);
          if (logging) console.log("sf @target .modal added node - item: ", modal);
          modal.css("z-index", 1);
        });

      $(mutation.addedNodes)
        .find('[class^="dialogButtons___"]')
        .each(function() {
          dialogButton = $(this).find("button");
          if (logging) console.log("sf @target .dialogbuttons added node - item: ", dialogButton);
        });

      $(mutation.addedNodes)
        .find('#weapon_melee')
        .each(function() {
          const descby = $(this).attr("aria-describedby");
          if (descby && descby.startsWith('label_attacker')) {
            weapon_melee = $(this);
            if (logging) console.log("sf @target #weapon_melee found attacker - item: ", descby, ":", weapon_melee);
          }
        });

      $(mutation.addedNodes)
        .find('#weapon_temp')
        .each(function() {
          weapon_temp = $(this);
        });

      $(mutation.addedNodes)
        .find('#defender_strength')
        .each(function() {
          attackerModal = $(this).closest('[class^="modal___"][style="display: block;"]');
        });

      if (dialogButton !== undefined && weapon_melee !== undefined) {
        dialogButton.detach();
        dialogButton.css("height", "100%").css("width", "100%");
        weapon_melee.prepend(dialogButton);
        weapon_melee.find("figure").hide();

        // Add click event to hide the button and restore the DOM
        dialogButton.click(function() {
          $(this).remove();
          weapon_melee.find("figure").show();
          localStorage.setItem("attack_preference", "weapon_melee");
        });
      }

      if (dialogButton !== undefined && weapon_temp !== undefined) {
        dialogButton.detach();
        dialogButton.css("height", "100%").css("width", "100%");
        weapon_temp.prepend(dialogButton);
        weapon_temp.find("figure").hide();

        // Add click event to hide the button and restore the DOM
        dialogButton.click(function() {
          $(this).remove();
          weapon_temp.find("figure").show();
          localStorage.setItem("attack_preference", "weapon_temp");
        });
      }

      if (attackerModal !== undefined) {
        attackerModal.find('[class^="modalFooter___"]').empty();
      }
    }
  };

  const startFightMove = new MutationObserver(startFightCallBack);
  const startFightMoveConfig = { attributes: false, childList: true, subtree: true };

  $(document).ready(function() {
    $(document.body).each(function() {
      if (logging) console.log("startFightMove: ", $(this));
      startFightMove.observe($(this)[0], startFightMoveConfig);

      // Check if the preference is stored in local storage
      const preference = localStorage.getItem("attack_preference");

      // Create the floating table with options
      const table = document.createElement("table");
      table.innerHTML = `
        <tr>
          <td><button id="choose_melee">Melee Weapon</button></td>
          <td><button id="choose_temp">Temporary Weapon</button></td>
        </tr>
      `;
      table.style.margin = "10px";
      table.style.borderSpacing = "10px";
      table.style.background = "white";
      table.style.border = "1px solid black";
      table.style.position = "fixed";
      table.style.top = "10px";
      table.style.left = "50%";
      table.style.transform = "translateX(-50%)";
      table.style.zIndex = "9999";

      // Add click events to the buttons
      const chooseMeleeButton = table.querySelector("#choose_melee");
      const chooseTempButton = table.querySelector("#choose_temp");

      chooseMeleeButton.addEventListener("click", function() {
        localStorage.setItem("attack_preference", "weapon_melee");
      });

      chooseTempButton.addEventListener("click", function() {
        localStorage.setItem("attack_preference", "weapon_temp");
      });

      // Append the table to the specified element
      const targetElement = document.createElement("div");
      targetElement.style.position = "fixed";
      targetElement.style.top = "0";
      targetElement.style.width = "100%";
      targetElement.style.background = "rgba(255, 255, 255, 0.8)";
      targetElement.style.zIndex = "9998";
      targetElement.appendChild(table);

      document.body.insertBefore(targetElement, document.body.firstChild);

      // Set the initial preference
      if (preference === "weapon_melee" && weapon_melee !== undefined) {
        weapon_melee.prepend(dialogButton);
        weapon_melee.find("figure").hide();
      } else if (preference === "weapon_temp" && weapon_temp !== undefined) {
        weapon_temp.prepend(dialogButton);
        weapon_temp.find("figure").hide();
      }
    });
  });
})();
