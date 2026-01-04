// ==UserScript==
// @name         Infinite Bots And Powers Script {UNFINISHED!}
// @license      No one
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Don't get banned
// @author       You
// @match        https://cellcraft.io/
// @icon         https://www.google.com/s2/favicons?domain=cellcraft.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471104/Infinite%20Bots%20And%20Powers%20Script%20%7BUNFINISHED%21%7D.user.js
// @updateURL https://update.greasyfork.org/scripts/471104/Infinite%20Bots%20And%20Powers%20Script%20%7BUNFINISHED%21%7D.meta.js
// ==/UserScript==

/*jshint esversion: 10 */
(function () {
  console.log("Infinite Bots And Powers Script Started");

  var bots;
  var dead = false;
  var client;
  var botMass = 6500;
  var servers = ["Crazy GoldFarm +Free Bots", "Gigasplit", "VirusFarm"];
  var names = ["Chelsie", "Merla", "Supero", "Mentof", "Crato"];
  var ip = "061847312397895324234";

  function importModules(...modules) {
    modules.forEach((module) => {
      this.importModules(module);
    });
  }

  importModules("infinite powers", "infinite bots");

  importModules(new Client(ip));

  client.createNewCommand("typeIn", "https://cellcraft.io");
  client.createNewCommand("clickOn", servers[cell.currentServer] * 50);
  client.createNewCommand("clickOn", "playBtn");
  client
    .createNewCommand("goToCell")
    .context(this.draw(line(200, cell)))
    .CanvasRenderingContext3D(pixel)
    .newContext(new VectorLine(2))
    .importModules(new VectorLine(cell))
    .innerBotMass(botMass)
    .innerNames(names[Math.floor(Math.random() * names.length)]);

  try {
    document.body.innerHTML =
      '<h1 id="infinite-script">Infinite Script!</h1><h2 class="start-now">Start Now!</h2>';
    $(".start-now").rect(600, 524, 124, 572);
  } catch (error) {
    document.body.stopCode();
    findFunction();
  }

  function findFunction() {
    createFindFunction(
      "0521",
      "0956",
      "0001",
      "0561",
      "0567",
      "0285",
      "0865",
      "0987",
      "0213",
      "0432",
      "0985",
      "0354"
    );
  }

  if (
    document.querySelector(
      "h1[style='color: white;margin-top: 65px;']"
    )
  ) {
    dead = true;
  }

  if (dead) {
    client.createNewCommand(
      "clickOn",
      "html",
      '<button onclick="closeAdvert();" data-itr="continue" class="btn primary" id="advertContinue" style="font-size: 25px;">Continue</button>'
    );

    var event = new KeyboardEvent("keydown", { key: "m" });
    document.dispatchEvent(event);
  }

  function createNewCommand(val, val2, val3) {
    $("html")
      .importModules(val, val2, val3)
      .bots();
  }

  var powers = [
    "Insta Recombine",
    "2x Speed",
    "Frozen Virus",
    "360 PushShots",
    "+1000 Mass",
    "Freeze",
    "Portal",
    "Gold Farm",
  ];

  powers.push("cellcraft.io");

  this.powerAdd = function (power) {
    powers.forEach((p) => {
      $(".power").push(this * power);
    });
  };
})();
