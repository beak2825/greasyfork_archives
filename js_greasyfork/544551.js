// ==UserScript==
// @name         Simple Pornhub Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Prismaris
// @description  Adds native userscript menu commands to download pornhub videos. All resolutions supported.
// @match        https://www.pornhub.com/view_video.php?viewkey=*
// @grant        GM.xmlHttpRequest
// @grant        GM.registerMenuCommand
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544551/Simple%20Pornhub%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/544551/Simple%20Pornhub%20Downloader.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const scripts = Array.from(document.scripts).map(s => s.textContent || '');

  // 1. Try extracting flashvars object via regex
  let jsonUrl = null;
  for (const script of scripts) {
    const fvMatch = script.match(/var\s+(flashvars_\d+)\s*=\s*(\{[\s\S]*?\});/);
    if (fvMatch) {
      try {
        const obj = JSON.parse(fvMatch[2]);
        if (obj.mediaDefinitions) {
          const def = obj.mediaDefinitions.find(d => d.format === 'mp4' && d.videoUrl && d.videoUrl.includes('/get_media'));
          if (def) {
            jsonUrl = def.videoUrl;
            break;
          }
        }
      } catch {}
    }
  }

  // 2. If that fails, scan all scripts for get_media URL
  if (!jsonUrl) {
    for (const script of scripts) {
      const m = script.match(/https:\/\/www\.pornhub\.com\/video\/get_media\?[^"'<> ]+/);
      if (m) {
        jsonUrl = m[0];
        break;
      }
    }
  }

  if (!jsonUrl) {
    console.warn("❌ Couldn't find get_media JSON URL");
    return;
  }

  // 3. Fetch the JSON via GM.xmlHttpRequest
  GM.xmlHttpRequest({
    method: "GET",
    url: jsonUrl,
    onload: function(res) {
      if (res.status !== 200) {
        console.error("❌ Failed to fetch media JSON:", res.status);
        return;
      }
      let list;
      try {
        list = JSON.parse(res.responseText);
      } catch (e) {
        console.error("❌ Invalid JSON:", e);
        return;
      }

      const mp4s = list.filter(d => d.format === "mp4" && d.videoUrl);
      if (mp4s.length === 0) {
        console.warn("❌ No MP4 entries found in JSON.");
        return;
      }

      mp4s.sort((a, b) => (b.height || 0) - (a.height || 0));

      mp4s.forEach(item => {
        const label = `Download ${item.height || item.quality || 'p'}p`;
        GM.registerMenuCommand(label, () => {
          window.open(item.videoUrl, '_blank');
        });
      });

      console.log("✅ Registered download menu commands for:", mp4s.map(d => `${d.height}p`));
    },
    onerror: function(err) {
      console.error("❌ GM.xmlHttpRequest error:", err);
    }
  });

})();
