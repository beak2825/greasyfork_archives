// ==UserScript==
// @name         [MWI] Guild Data Exporter
// @namespace    http://tampermonkey.net/
// @version      1.09
// @description  Export guild data to CSV
// @author       WataFX
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @match        https://www.milkywayidle.com/game?characterId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532977/%5BMWI%5D%20Guild%20Data%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/532977/%5BMWI%5D%20Guild%20Data%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const csvHeader = "type,guild_name,guild_exp,guild_level,export_date,game_mode,player_name,member_exp";
    let guildDataRow = "";
    let guildCharactersRows = [];

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const currentDate = `${day}.${month}.${year}`;

    function hookWS() {
      const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
      const originalGetter = dataProperty.get;

      dataProperty.get = function hookedGet() {
        const socket = this.currentTarget;

        if (!(socket instanceof WebSocket)) {
          return originalGetter.call(this);
        }

        if (socket.url.indexOf("api.milkywayidle.com/ws") === -1 &&
            socket.url.indexOf("api-test.milkywayidle.com/ws") === -1) {
          return originalGetter.call(this);
        }

        const message = originalGetter.call(this);

        Object.defineProperty(this, "data", { value: message });

        return handleMessage(message);
      };

      Object.defineProperty(MessageEvent.prototype, "data", dataProperty);
    }

    function handleMessage(message) {
      try {
        const obj = JSON.parse(message);

        if (obj && obj.type === "guild_updated") {
          const guildExperience = Math.floor(obj.guild.experience);
          guildDataRow = [
            "guild",
            obj.guild.name,
            guildExperience,
            obj.guild.level,
            currentDate,
            "", "", ""
          ].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',');

        } else if (obj && obj.type === "guild_characters_updated") {
          guildCharactersRows = [];

          for (const key in obj.guildSharableCharacterMap) {
            if (Object.prototype.hasOwnProperty.call(obj.guildSharableCharacterMap, key)) {
              const character = obj.guildSharableCharacterMap[key];
              const memberExperience = Math.floor(obj.guildCharacterMap[key].guildExperience);
              const row = [
                "member",
                "", // guild_name
                "", // guild_experience
                "", // level
                "", // export_date
                character.gameMode,
                character.name,
                memberExperience
              ].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',');
              guildCharactersRows.push(row);
            }
          }
          addExportButton();
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
      return message;
    }

    function downloadCSV() {
      const csvContent = [csvHeader].concat(guildDataRow ? [guildDataRow] : [], guildCharactersRows).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      const filename = `guild_data_${currentDate.replace(/\./g, '_')}.csv`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = filename;
      link.click();

      URL.revokeObjectURL(url);
    }

    function addExportButton() {
      if (document.querySelector('.guild_data_export_button')) return;

      const exportButton = document.createElement('button');
      exportButton.textContent = '📥 Export data to CSV';
      exportButton.classList.add('Button_button__1Fe9z', 'guild_data_export_button');
      exportButton.addEventListener('click', downloadCSV);

      const targetElement = document.querySelector('.GuildPanel_overviewTab__v1IdE');
      if (targetElement) {
        targetElement.appendChild(exportButton);
      } else {
        console.error('Target object not found.');
      }
    }

    hookWS();

  })();
