// ==UserScript==
// @name         Unraid traefik
// @namespace    https://greasyfork.org/en/users/1388191-masapa
// @version      2024-10-31
// @license      MIT
// @description  Buttons that allows you to easily add traefik.enable and wanted middlewares
// @author       Masapa
// @match        http://unraid.local/Docker/AddContainer*
// @match        http://unraid.local/Docker/UpdateContainer*
// @match        http://unraid.local/Apps/AddContainer*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514694/Unraid%20traefik.user.js
// @updateURL https://update.greasyfork.org/scripts/514694/Unraid%20traefik.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const middlewares = ["auth@file","local@file"];


  const addButton = (i = 0) => {
    const name = document.getElementsByName("contName")[0].value;

    const opts = {
      Description: "",
      Name: "Enable traefik",
      Type: "Label",
      Target: "traefik.enable",
      Value: "true",
      Buttons:
        "<button type='button' onclick='editConfigPopup(" +
        confNum +
        ",false)'>Edit</button><button type='button' onclick='removeConfig(" +
        confNum +
        ")'>Remove</button>",
      Number: confNum,
    };
     $("#configLocation").append(makeConfig(opts));

    const opts2 = {
      Description: "",
      Name: "Traefik auth",
      Type: "Label",
      Target: "traefik.http.routers." + name + ".middlewares",
      Value: i !== 2 ? middlewares[0] : middlewares.join(","),
      Buttons:
        "<button type='button' onclick='editConfigPopup(" +
        confNum +
        ",false)'>Edit</button><button type='button' onclick='removeConfig(" +
        confNum +
        ")'>Remove</button>",
      Number: confNum,
    };

    $("#configLocation").append(makeConfig(opts2));

  };

  const button = document.createElement("button");
  button.addEventListener("click", () => addButton());
  button.innerHTML = "TRAEFIK";
  document.getElementsByClassName("left")[0].append(button);
  const button2 = document.createElement("button");
  button2.addEventListener("click", () => addButton(2));
  button2.innerHTML = "With All middlewares";
  document.getElementsByClassName("left")[0].append(button, button2);

})();
