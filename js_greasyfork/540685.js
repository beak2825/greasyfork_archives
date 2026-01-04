// ==UserScript==
// @name           RED: Beatport Enhance
// @description    Enhance RED releases with Beatport metadata
// @author         spinfast319
// @version        1.3.8
// @grant          GM.xmlHttpRequest
// @require        https://code.jquery.com/jquery-3.6.3.min.js
// @connect        www.beatport.com
// @connect        api.beatport.com
// @match          https://redacted.sh/torrents.php?*id=*
// @match          https://redacted.sh/user.php?action=edit&*
// @run-at         document-end
// @namespace      _
// @downloadURL https://update.greasyfork.org/scripts/540685/RED%3A%20Beatport%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/540685/RED%3A%20Beatport%20Enhance.meta.js
// ==/UserScript==

(() => {
  "use strict";


  const myUID = document.querySelector("#nav_userinfo > a.username").href.split("=")[1];
  const config = JSON.parse(localStorage.getItem("red_enhance_config") || '{"red_api_key": "", "express_mode": false}');

  // Configuration interface (for user settings page)
  if (location.href.includes(`action=edit&userid=${myUID}`)) {
    const updateConfig = (e) => {
      const newConfig = {
        red_api_key: document.getElementById("red_api_key").value,
        express_mode: document.getElementById("express_mode").checked
      };
      localStorage.setItem("red_enhance_config", JSON.stringify(newConfig));
    };

    // Add API key configuration to user settings page
    const torGrouping = $("#tor_group_tr");
    const redApiKeyRow = $(`
      <tr>
        <td class="label tooltip">
          <strong>RED API Key for Beatport Enhance:</strong>
        </td>
      </tr>
    `);
    const redApiKeyCol = $(`<td></td>`);
    const redApiKeyInput = $(`
      <input type="text" size="60" name="red_api_key" id="red_api_key"
             value="${config.red_api_key}"
             placeholder="Enter your RED API key from Settings > Access Settings">
    `);
    const redApiKeyHelp = $(`
      <br><small style="color: #666;">
        Get your API key from: Settings → Access Settings → Create API Key<br>
        Required scope: you only need the torrent box clicked
      </small>
    `);

    redApiKeyCol.append(redApiKeyInput);
    redApiKeyCol.append(redApiKeyHelp);
    redApiKeyRow.append(redApiKeyCol);
    torGrouping.after(redApiKeyRow);

    // Add Express Mode configuration row
    const expressModeRow = $(`
      <tr>
        <td class="label tooltip">
          <strong>Beatport Enhance Express:</strong>
        </td>
      </tr>
    `);
    const expressModeCol = $(`<td></td>`);
    const expressModeCheckbox = $(`
      <input type="checkbox" name="express_mode" id="express_mode"
             ${config.express_mode ? 'checked' : ''}
             style="margin-right: 8px;">
    `);
    const expressModeLabel = $(`
      <label for="express_mode">Enable express mode</label>
    `);
    const expressModeHelp = $(`
      <br><small style="color: #666;">
        Checking this box will disable the dialog in Beatport Enhance and apply the changes directly.<br>
		<br>
        <strong>/!\\ Warning /!\\</strong> Please be careful with automation and double check your changes. This mode can overwrite correct metadata and doing so will get you warned.
      </small>
    `);

    expressModeCol.append(expressModeCheckbox);
    expressModeCol.append(expressModeLabel);
    expressModeCol.append(expressModeHelp);
    expressModeRow.append(expressModeCol);
    redApiKeyRow.after(expressModeRow);

    document.getElementById("userform").addEventListener("submit", updateConfig);
    return;
  }

  // Beatport genre mapping
  const BEATPORT_GENRE_MAPPING = {
    "140.deep.dubstep.grime": ["electronic", "dubstep", "deep.dubstep", "grime"],
    "afro.house": ["electronic", "afro.house", "house"],
    "amapiano": ["electronic", "amapiano", "african", "world.music"],
    "ambient.experimental": ["electronic", "ambient", "experimental"],
    "bass.club": ["electronic", "bass", "club"],
    "bass.house": ["electronic", "bass", "house"],
    "brazilian.funk": ["electronic", "brazilian", "brazilian.funk", "bass"],
    "breaks.breakbeat.uk.bass": ["electronic", "breaks", "breakbeat", "uk.bass"],
    "dance.electro.pop": ["electronic", "dance", "electropop"],
    "dance.pop": ["electronic", "dance", "electropop"],
    "deep.house": ["electronic", "deep.house", "house"],
    "dj.tools": ["electronic", "dj.tools"],
    "downtempo": ["electronic", "downtempo"],
    "drum.&.bass": ["electronic", "drum.and.bass"],
    "drum.bass": ["electronic", "drum.and.bass"],
    "dubstep": ["electronic", "dubstep"],
    "electro.classic.detroit.modern": ["electronic", "electro"],
    "electronica": ["electronic"],
    "funky.house": ["electronic", "funky.house", "house"],
    "hard.dance.hardcore.neo.rave": ["electronic", "hardcore.dance", "neo.rave"],
    "hard.techno": ["electronic", "hard.techno", "techno"],
    "house": ["electronic", "house"],
    "indie.dance": ["electronic", "indie.dance"],
    "jackin.house": ["electronic", "jackin.house", "house"],
    "mainstage": ["electronic", "mainstage", "edm", "house"],
    "melodic.house.techno": ["electronic", "melodic.house", "techno", "house"],
    "minimal.deep.tech": ["electronic", "minimal", "deep.tech", "tech.house", "house"],
    "nu.disco.disco": ["electronic", "nu.disco", "disco"],
    "organic.house": ["electronic", "house", "organic.house"],
    "organic.house.downtempo": ["electronic", "house", "organic.house", "downtempo"],
    "progressive.house": ["electronic", "progressive.house", "house"],
    "psy.trance": ["electronic", "psy.trance", "psychedelic", "trance"],
    "tech.house": ["electronic", "tech.house", "house"],
    "techno.peak.time.driving": ["electronic", "techno", "peak.time.techno"],
    "techno.raw.deep.hypnotic": ["electronic", "techno", "deep.techno", "hypnotic.techno"],
    "trance.main.floor": ["electronic", "trance", "main.floor"],
    "trance.raw.deep.hypnotic": ["electronic", "trance", "deep.trance", "hypnotic.trance"],
    "trap.future.bass": ["electronic", "trap", "future.bass", "bass"],
    "trap.wave": ["electronic", "trap", "wave"],
    "uk.garage.bassline": ["electronic", "uk.garage", "bassline"]
  };

  // Label mapping to handle cases where Beatport's label names don't match desired format
  const BEATPORT_LABEL_MAPPING = {
    "K7 Records": "!K7 Records",
    "EMI Recorded Music Australia Pty Ltd": "EMI Music Australia"
  };


  const decodeHTML = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  // Generate smart summary based on what was actually updated
  const generateUpdateSummary = (changes) => {
    const updates = [];

    if (changes.label) updates.push('label');
    if (changes.catalogNumber) updates.push('catalog number');
    if (changes.tags) updates.push('tags');
    if (changes.description) updates.push('description');

    if (updates.length === 0) return 'Beatport-Enhance made updates';

    if (updates.length === 1) {
      return `Beatport-Enhance updated the ${updates[0]}.`;
    } else if (updates.length === 2) {
      return `Beatport-Enhance updated the ${updates[0]} and ${updates[1]}.`;
    } else {
      const lastItem = updates.pop();
      return `Beatport-Enhance updated the ${updates.join(', ')}, and ${lastItem}.`;
    }
  };

  // Show notification in upper right corner
  const showNotification = (message, title, type = 'success', duration = 5000) => {
    const isProcessing = type === 'processing';
    const isCancel = type === 'cancel';
    const backgroundColor = isProcessing ? '#ffffff' : (isCancel ? '#f8f8f8' : '#4CAF50');
    const borderColor = isProcessing ? '#cccccc' : (isCancel ? '#d9d9d9' : '#45a049');
    const textColor = isProcessing ? '#333333' : (isCancel ? '#666666' : 'white');
    const emoji = isProcessing ? '⚡' : (isCancel ? '❌' : '🎉');

    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 10000;
      background: ${backgroundColor}; color: ${textColor}; padding: 15px 20px;
      border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-family: Arial, sans-serif; font-size: 14px; max-width: 400px;
      transform: translateX(100%); transition: transform 0.3s ease-in-out;
      border-left: 5px solid ${borderColor};
    `;

    if (isProcessing) {
      notification.style.animation = 'pulse 1.5s infinite';
    }

    notification.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 10px;">
        <span style="font-size: 18px;">${emoji}</span>
        <div>
          <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
          <div style="font-size: 12px; opacity: 0.9; white-space: pre-line;">${message}</div>
        </div>
      </div>
    `;

    // Add CSS animation if not already present
    if (!document.getElementById('bp-enhance-style')) {
      const style = document.createElement('style');
      style.id = 'bp-enhance-style';
      style.textContent = `
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1) translateX(0); }
          50% { opacity: 0.8; transform: scale(1.02) translateX(0); }
          100% { opacity: 1; transform: scale(1) translateX(0); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Slide in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto-dismiss (unless it's a processing notification with duration 0)
    if (duration > 0) {
      setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (notification.parentNode) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, duration);
    }

    return notification; // Return reference for manual dismissal
  };

  // Show success notification
  const showSuccessNotification = (message) => {
    return showNotification(message, 'Beatport Enhancement Complete!', 'success', 10000);
  };

  // Show processing notification
  const showProcessingNotification = (message) => {
    return showNotification(message, 'Beatport Enhancement in Progress...', 'processing', 0);
  };

  // Show cancel notification
  const showCancelNotification = (message) => {
    return showNotification(message, 'Beatport Enhancement Canceled', 'cancel', 5000);
  };

  // Check for and display success notification on page load
  const checkForSuccessNotification = () => {
    const successMessage = localStorage.getItem('beatport_enhance_success');
    if (successMessage) {
      localStorage.removeItem('beatport_enhance_success');
      setTimeout(() => {
        showSuccessNotification(successMessage);
      }, 500); // Small delay to ensure page is fully loaded
    }
  };

  // Generate detailed success message based on actual operations performed
  const generateDetailedSuccessMessage = (artist, album, results, appliedOperations, editionTorrents, mergedData, originalData) => {
    const messageLines = [];

    // Header with artist - album (using - instead of /)
    messageLines.push(`Applied to: ${artist} - ${album}`);

    // Label & Catalog Number - only show if actually updated
    if (appliedOperations.label || appliedOperations.catalogNumber) {
      if (appliedOperations.label) {
        messageLines.push(`Label: ${appliedOperations.label}`);
      }
      if (appliedOperations.catalogNumber) {
        messageLines.push(`Catalog: ${appliedOperations.catalogNumber}`);
      }
    }

    // Tags - only show if actually added
    if (results.tags && appliedOperations.tags && mergedData.tags && mergedData.tags.length > 0) {
      messageLines.push(`Tags: ${mergedData.tags.join(', ')}`);
    }

    // Description - show if description was enhanced
    if (results.description && mergedData.description && mergedData.description !== (originalData.description || '')) {
      // Check if Beatport link was added
      const currentDescription = originalData.description || '';
      const beatportUrlRegex = /https?:\/\/(www\.)?beatport\.com\/[^\s\]]+/;
      const hadBeatportLink = beatportUrlRegex.test(currentDescription);
      const willHaveBeatportLink = beatportUrlRegex.test(mergedData.description);

      if (!hadBeatportLink && willHaveBeatportLink) {
        messageLines.push('Description: Enhanced with Beatport info and link');
      } else {
        messageLines.push('Description: Enhanced with Beatport info');
      }
    }

    // Updated torrents count
    messageLines.push(`Updated ${editionTorrents.length} torrent${editionTorrents.length !== 1 ? 's' : ''}`);

    return messageLines.join('\n');
  };


  // Find all torrents in the same edition (including same media)
  const findEditionTorrents = (targetTorrent, allTorrents) => {
    return allTorrents.filter(torrent =>
      torrent.remasterRecordLabel === targetTorrent.remasterRecordLabel &&
      torrent.remasterCatalogueNumber === targetTorrent.remasterCatalogueNumber &&
      torrent.remasterYear === targetTorrent.remasterYear &&
      torrent.remasterTitle === targetTorrent.remasterTitle &&
      torrent.media === targetTorrent.media
    );
  };

  // Data processing and merging functions
  const dataProcessor = {
    generateOutputCatalogNumber(beatportCatalog, redCatalog) {
      // Handle the case where beatportCatalog is None/null
      if (!beatportCatalog) {
        return redCatalog || "";
      }

      // If RED catalog is empty, use Beatport catalog
      if (!redCatalog) {
        return beatportCatalog;
      }

      // Normalize both catalog numbers for comparison by removing whitespace and common separators
      const normalizeCatalog = (catalog) => {
        return catalog.replace(/[\s\-\.]/g, '').toLowerCase();
      };

      const normalizedBeatport = normalizeCatalog(beatportCatalog);
      const normalizedRed = normalizeCatalog(redCatalog);

      // If normalized versions match, use Beatport's formatting (preserves case and spacing)
      if (normalizedBeatport === normalizedRed) {
        return beatportCatalog;
      }

      // If RED catalog starts with Beatport catalog (legacy behavior)
      if (redCatalog.startsWith(beatportCatalog)) {
        return redCatalog;
      }

      // Otherwise, return the combined string
      return `${beatportCatalog} / ${redCatalog}`;
    },

    parseAndSortLinks(existingLinks, beatportUrl) {
      try {
        // Parse existing BBCode links and insert Beatport in alphabetical order
        const linkRegex = /\[url=([^\]]+)\]([^\[]+)\[\/url\]/g;
        const links = [];
        let match;

        // Extract all existing links
        while ((match = linkRegex.exec(existingLinks)) !== null) {
          links.push({
            url: match[1],
            name: match[2].trim(),
            original: match[0]
          });
        }

        // Check if Beatport already exists (case-insensitive)
        const beatportExists = links.some(link => link.name.toLowerCase() === 'beatport');
        if (beatportExists) {
          // Return original links if Beatport already exists
          return existingLinks;
        }

        // Add Beatport link
        links.push({
          url: beatportUrl,
          name: 'Beatport',
          original: `[url=${beatportUrl}]Beatport[/url]`
        });

        // Sort alphabetically by name (case-insensitive)
        links.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        // Reconstruct the BBCode string
        const result = links.map(link => link.original).join(' | ');

        // Fallback: if parsing failed or result is empty, use append method
        if (!result || links.length === 0) {
          return `${existingLinks} | [url=${beatportUrl}]Beatport[/url]`;
        }

        return result;
      } catch (error) {
        // Fallback to original append behavior on any error
        console.log('parseAndSortLinks error, falling back to append:', error);
        return `${existingLinks} | [url=${beatportUrl}]Beatport[/url]`;
      }
    },

    processRedBody(redBody, beatportUrl) {
      // Check if there's already a Beatport URL in the body
      const beatportUrlRegex = /https?:\/\/(www\.)?beatport\.com\/[^\s\]]+/;
      if (beatportUrlRegex.test(redBody)) {
        return redBody; // Already has a Beatport URL
      }

      // Look for existing "More info:" or "More information:" sections
      const moreInfoRegex = /\[b\]More info(?:rmation)?:\[\/b\]\s*(.+?)(?=\n\n|\n\[|\n$|$)/si;
      const moreInfoMatch = redBody.match(moreInfoRegex);

      if (moreInfoMatch) {
        // Found existing More info section
        const existingLinks = moreInfoMatch[1].trim();

        // Check if it's the rare format: "More information: www.somelink.com"
        const simpleUrlRegex = /^(?:https?:\/\/)?[\w.-]+\.[a-z]{2,}(?:\/\S*)?$/i;
        if (simpleUrlRegex.test(existingLinks) && !existingLinks.includes('[url=')) {
          // Convert simple URL to proper format and add Beatport alphabetically
          const properUrl = existingLinks.startsWith('http') ? existingLinks : `https://${existingLinks}`;
          const convertedLinks = `[url=${properUrl}]Link[/url]`;
          const sortedLinks = this.parseAndSortLinks(convertedLinks, beatportUrl);
          const newMoreInfo = `[b]More info:[/b] ${sortedLinks}`;
          return redBody.replace(moreInfoRegex, newMoreInfo);
        } else {
          // Insert Beatport in alphabetical order with existing formatted links
          const sortedLinks = this.parseAndSortLinks(existingLinks, beatportUrl);
          const newMoreInfo = `[b]More info:[/b] ${sortedLinks}`;
          return redBody.replace(moreInfoRegex, newMoreInfo);
        }
      } else {
        // No existing More info section, add one at the end
        const beatportLink = `[b]More info:[/b] [url=${beatportUrl}]Beatport[/url]`;
        return redBody + (redBody.endsWith('\n') ? '' : '\n\n') + beatportLink;
      }
    },

    generateOutputDescription(redBody, beatportDescription, beatportUrl) {
      const processedBody = this.processRedBody(redBody, beatportUrl);

      if (!beatportDescription || beatportDescription === "This release has no description") {
        return processedBody;
      }

      // Check if the first 50 characters of Beatport description already exist in group description
      const first50Chars = beatportDescription.substring(0, 50);

      // Decode HTML entities and normalize for comparison
      const decodeAndNormalize = (text) => {
        return text
          .replace(/&#39;/g, "'")           // Decode &#39; to apostrophe
          .replace(/&quot;/g, '"')         // Decode &quot; to quote
          .replace(/&amp;/g, '&')          // Decode &amp; to ampersand
          .replace(/&lt;/g, '<')           // Decode &lt; to less than
          .replace(/&gt;/g, '>')           // Decode &gt; to greater than
          .replace(/[\u2018\u2019]/g, "'") // Smart quotes to regular apostrophe
          .replace(/[\u201C\u201D]/g, '"'); // Smart double quotes to regular quotes
      };

      const normalizedFirst50 = decodeAndNormalize(first50Chars);
      const normalizedBody = decodeAndNormalize(processedBody);

      const foundMatch = normalizedBody.includes(normalizedFirst50);


      if (foundMatch) {
        // Already exists, don't add duplicate
        return processedBody;
      } else {
        // Add the Beatport description
        const beatportFormattedDesc = `\n\n[quote]${beatportDescription}[/quote]`;
        return processedBody + beatportFormattedDesc;
      }
    },

  };

  // Beatport API functions
  const beatportAPI = {
    async getToken() {
      try {

        const response = await new Promise((resolve, reject) => {
          GM.xmlHttpRequest({
            method: "POST",
            url: "https://www.beatport.com/api/auth/refresh-anon-token",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
            timeout: 30000,
            onload: res => resolve(res),
            onerror: res => reject(res),
            ontimeout: () => reject(new Error('Token fetch timeout'))
          });
        });

        if (response.status === 200) {
          const data = JSON.parse(response.responseText);
          const token = data.access_token;

          if (!token) {
            throw new Error('No access token in response');
          }

          const tokenData = {
            token: token,
            timestamp: Date.now(),
            expires_in: data.expires_in || 3600
          };

          localStorage.setItem('beatport_enhance_token', JSON.stringify(tokenData));
          return token;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        throw new Error(`Beatport token fetch failed: ${error.message}`);
      }
    },

    async getCachedToken() {
      try {
        const cached = localStorage.getItem('beatport_enhance_token');
        if (cached) {
          const tokenData = JSON.parse(cached);
          const now = Date.now();
          const tokenAge = (now - tokenData.timestamp) / 1000;

          if (tokenAge < (tokenData.expires_in - 300)) {
            return tokenData.token;
          } else {
          }
        }
      } catch (error) {
      }

      return await this.getToken();
    },

    async request(endpoint, params = {}) {
      const token = await this.getCachedToken();
      const url = `https://api.beatport.com/v4${endpoint}`;
      const searchParams = new URLSearchParams();

      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          searchParams.append(key, params[key]);
        }
      });

      const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

      const response = await new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: "GET",
          url: fullUrl,
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          },
          timeout: 30000,
          onload: res => {

            if (res.status === 401) {
              reject(new Error('TOKEN_EXPIRED'));
              return;
            }

            if (res.status !== 200) {
              reject(new Error(`HTTP ${res.status}: ${res.statusText}`));
              return;
            }

            resolve(res);
          },
          onerror: res => {
            reject(new Error('Network error'));
          },
          ontimeout: () => {
            reject(new Error('Request timeout'));
          }
        });
      });

      try {
        return JSON.parse(response.responseText);
      } catch (parseError) {
        throw new Error('Invalid JSON response');
      }
    },

    async search(artist, album) {
      const query = `${artist} - ${album}`;

      try {
        const data = await this.request('/catalog/search/', { q: query });
        return data;
      } catch (error) {
        if (error.message === 'TOKEN_EXPIRED') {
          localStorage.removeItem('beatport_enhance_token');
          const data = await this.request('/catalog/search/', { q: query });
          return data;
        }
        throw error;
      }
    },

    async getRelease(releaseId) {
      try {
        const release = await this.request(`/catalog/releases/${releaseId}/`);
        return release;
      } catch (error) {
        return null;
      }
    },

    async getReleaseTracks(releaseId) {
      try {
        const data = await this.request(`/catalog/releases/${releaseId}/tracks/`, { per_page: 100 });
        const tracks = data.results || [];
        return tracks;
      } catch (error) {
        return [];
      }
    },

    findBestMatch(searchResults, artist, album) {
      if (!searchResults.releases || searchResults.releases.length === 0) {
        return null;
      }

      const sanitize = text => text.toLowerCase().trim().replace(/\s+/g, ' ');
      const targetArtist = sanitize(artist);
      const targetAlbum = sanitize(album);


      for (const release of searchResults.releases) {
        const artistMatch = release.artists.some(releaseArtist => {
          const releaseArtistName = sanitize(releaseArtist.name);
          const matches = releaseArtistName.includes(targetArtist) || targetArtist.includes(releaseArtistName);
          if (matches) {
          }
          return matches;
        });

        if (artistMatch) {
          const releaseName = sanitize(release.name);
          const albumMatch = releaseName.includes(targetAlbum) || targetAlbum.includes(releaseName);
          if (albumMatch) {
            return release;
          }
        }
      }

      return null;
    },

    async getEnrichedReleaseData(basicRelease) {
      try {

        const detailedRelease = await this.getRelease(basicRelease.id);
        if (!detailedRelease) {
          return basicRelease;
        }

        const tracks = await this.getReleaseTracks(basicRelease.id);

        const enrichedRelease = {
          ...basicRelease,
          ...detailedRelease,
          tracks: tracks
        };

        return enrichedRelease;
      } catch (error) {
        return basicRelease;
      }
    },

    // Apply label mapping to convert Beatport label names to desired format
    applyLabelMapping(label) {
      return BEATPORT_LABEL_MAPPING[label] || label;
    },

    extractMetadata(release) {
      if (!release) return null;


      // First, extract unique genre slugs (matching Python's extract_unique_genre_slugs function)
      const genreSlugs = this.extractUniqueGenreSlugs(release);

      // Convert slugs to proper format and do mapping (matching Python's replace_tags function)
      const tags = this.replaceTagsPythonStyle(genreSlugs);

      const label = release.label ? this.applyLabelMapping(release.label.name) : '';
      const catalogNumber = release.catalog_number || release.catalogue_number || '';
      const slug = release.slug;
      const releaseId = release.id;
      const beatportUrl = `https://www.beatport.com/release/${slug}/${releaseId}`;
      const description = release.description || release.desc || '';

      const metadata = {
        label,
        catalogNumber,
        tags,
        beatportUrl,
        description
      };

      return metadata;
    },

    // Python equivalent: extract_unique_genre_slugs function
    extractUniqueGenreSlugs(release) {
      const slugs = [];

      // Check main genre
      if (release.genre && release.genre.slug) {
        slugs.push(release.genre.slug);
      }

      // Check sub-genres
      if (release.sub_genres && Array.isArray(release.sub_genres)) {
        release.sub_genres.forEach(subGenre => {
          if (subGenre.slug) {
            slugs.push(subGenre.slug);
          }
        });
      }

      // Check tracks for genre info
      if (release.tracks && Array.isArray(release.tracks)) {
        release.tracks.forEach(track => {
          if (track.genre && track.genre.slug) {
            slugs.push(track.genre.slug);
          }
        });
      }

      // Remove duplicates and convert format (replace - with .)
      const uniqueSlugs = [...new Set(slugs)].map(slug => slug.replace(/-/g, '.'));

      return uniqueSlugs;
    },

    // Python equivalent: replace_tags function
    replaceTagsPythonStyle(genreSlugs) {
      const newTags = [];

      // Iterate through the genre slugs and replace them using the mapping
      for (const slug of genreSlugs) {
        // If the slug is in the mapping, extend the newTags list with the replacement
        if (BEATPORT_GENRE_MAPPING[slug]) {
          newTags.push(...BEATPORT_GENRE_MAPPING[slug]);
        } else {
          // If not in the mapping, just append the original slug (already in correct format)
          newTags.push(slug);
        }
      }

      // Use a Set to remove duplicates and then convert back to a list
      const uniqueTags = [...new Set(newTags)];

      return uniqueTags;
    },
  };

  // RED API functions
  const redAPI = {
    async getTorrent(torrentId) {
      try {
        const response = await fetch(`/ajax.php?action=torrent&id=${torrentId}`);
        const data = await response.json();
        if (data.status !== "success") {
          throw new Error(`© redacted.sh\nAPI request failed: ${data.error || 'rate limit exceeded'}\nEnhancement failed.`);
        }
        return data.response;
      } catch (error) {
        throw error;
      }
    },

    async getTorrentGroup(groupId) {
      try {
        const response = await fetch(`/ajax.php?action=torrentgroup&id=${groupId}`);
        const data = await response.json();
        if (data.status !== "success") {
          throw new Error(`© redacted.sh\nAPI request failed: ${data.error || 'rate limit exceeded'}\nEnhancement failed.`);
        }
        return data.response;
      } catch (error) {
        throw error;
      }
    },

    async addTags(groupId, tags) {
      const apiKey = config.red_api_key;
      if (!apiKey) {
        throw new Error("No RED API key configured. Please set it in your user settings.");
      }

      const formData = new FormData();
      formData.append('groupid', groupId);
      formData.append('tagname', tags.join(','));

      try {
        const response = await fetch('/ajax.php?action=addtag', {
          method: 'POST',
          headers: {
            "Authorization": apiKey
          },
          body: formData
        });

        const result = await response.json();
        if (result.status !== "success") {
          throw new Error(`Tag addition failed: ${result.error || 'Unknown error'}`);
        }

        return result.response;
      } catch (error) {
        throw error;
      }
    },

    async updateGroupDescription(groupId, description, summary = 'Added Beatport link and description') {
      const apiKey = config.red_api_key;
      if (!apiKey) {
        throw new Error("No RED API key configured. Please set it in your user settings.");
      }

      const formData = new FormData();
      formData.append('summary', summary);
      formData.append('body', description);

      try {
        const response = await fetch(`/ajax.php?action=groupedit&id=${groupId}`, {
          method: 'POST',
          headers: {
            "Authorization": apiKey
          },
          body: formData
        });

        const result = await response.json();
        if (result.status !== "success") {
          throw new Error(`Group update failed: ${result.error || 'Unknown error'}`);
        }

        return result.response;
      } catch (error) {
        throw error;
      }
    },

    async updateTorrentMetadata(torrentId, label, catalogNumber) {
      const apiKey = config.red_api_key;
      if (!apiKey) {
        throw new Error("No RED API key configured. Please set it in your user settings.");
      }

      const formData = new FormData();
      formData.append('remaster_record_label', label);
      formData.append('remaster_catalogue_number', catalogNumber);

      try {
        const response = await fetch(`/ajax.php?action=torrentedit&id=${torrentId}`, {
          method: 'POST',
          headers: {
            "Authorization": apiKey
          },
          body: formData
        });

        const result = await response.json();
        if (result.status !== "success") {
          throw new Error(`Torrent update failed: ${result.error || 'Unknown error'}`);
        }

        return result.response;
      } catch (error) {
        throw error;
      }
    }
  };

  // WORKAROUND FUNCTION - RED API BUG FIX (v1.2.12)
  // ==============================================
  // RED has a bug where API-based group description edits on newly uploaded releases
  // cause display issues. Manual edits through the web form work correctly.
  // This function performs a minimal form-based edit to trigger the same effect
  // as a manual edit, which fixes the display bug.
  //
  // TODO: Remove this entire function when RED fixes the API bug
  // WORKAROUND TAGS: RED_API_BUG, FORM_EDIT_WORKAROUND, TEMPORARY_FIX
  const performMinimalFormEdit = async (groupId, mergedData, originalData) => {
    try {
      console.log('WORKAROUND: Performing minimal form edit to fix RED API bug');

      // Extract auth key from logout link (same as working simple test)
      const logoutLink = document.querySelector('a[href*="logout.php"]');
      const authMatch = logoutLink?.href.match(/auth=([a-f0-9]{32})/);
      if (!authMatch) {
        console.log('WORKAROUND: Could not find auth key, skipping form edit');
        return false;
      }
      const authKey = authMatch[1];

      // Fetch the edit form to get current data
      const response = await fetch(`https://redacted.sh/torrents.php?action=editgroup&groupid=${groupId}`, {
        credentials: 'same-origin'
      });

      if (!response.ok) {
        console.log('WORKAROUND: Could not fetch edit form, skipping');
        return false;
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Find the takegroupedit form
      const forms = doc.querySelectorAll('form');
      let editForm = null;

      for (let form of forms) {
        if (form.querySelector('input[name="action"][value="takegroupedit"]')) {
          editForm = form;
          break;
        }
      }

      if (!editForm) {
        console.log('WORKAROUND: Could not find edit form, skipping');
        return false;
      }

      // Extract all form fields (preserve everything)
      const formFields = {};
      const inputs = editForm.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (input.name) {
          formFields[input.name] = input.value || '';
        }
      });

      // Get current description and add minimal change (just a space)
      const currentDescription = formFields.body || '';
      const newDescription = currentDescription + ' '; // Add single space

      // Submit the form with minimal change
      const formData = new FormData();

      // Add all original form fields
      Object.entries(formFields).forEach(([name, value]) => {
        if (name !== 'body' && name !== 'summary') {
          formData.append(name, value);
        }
      });

      // Override description and summary
      formData.append('body', newDescription);
      
      // Generate appropriate summary based on what was changed
      const originalDescription = originalData.description || '';
      const beatportUrlRegex = /https?:\/\/(www\.)?beatport\.com\/[^\s\]]+/;
      const hadBeatportLink = beatportUrlRegex.test(originalDescription);
      const willHaveBeatportLink = beatportUrlRegex.test(mergedData.description);
      
      let summaryMessage;
      if (!hadBeatportLink && willHaveBeatportLink) {
        // Added both description and link
        summaryMessage = 'Beatport-Enhance added description and link';
      } else if (mergedData.description !== originalDescription) {
        // Only description was added/changed
        summaryMessage = 'Beatport-Enhance added description';
      } else {
        // Fallback (shouldn't happen in current usage)
        summaryMessage = 'Beatport-Enhance added link';
      }
      
      formData.append('summary', summaryMessage);

      const submitResponse = await fetch('https://redacted.sh/torrents.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
      });

      if (submitResponse.ok) {
        console.log('WORKAROUND: Form edit completed successfully');
        return true;
      } else {
        console.log('WORKAROUND: Form edit failed');
        return false;
      }

    } catch (error) {
      console.log('WORKAROUND: Form edit error:', error);
      return false;
    }
  };

  // Enhanced confirmation dialog with improved visual design
  const showEnhancementConfirmation = (artist, album, mergedData, originalData, editionTorrents, beatportDescription = null, beatportUrl = null) => {
    return new Promise((resolve) => {

      const dialog = document.createElement('div');
      dialog.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: white; border: 2px solid #333; border-radius: 12px;
        padding: 24px; z-index: 10000; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        max-width: 552px; width: 90%; font-size: 14px; line-height: 1.4;
      `;

      // Helper function to truncate text
      const truncateText = (text, maxLength) => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
      };

      // Helper function to format before/after comparison
      const formatBeforeAfter = (beforeLabel, afterLabel, beforeCatalog, afterCatalog) => {
        const maxLabelWidth = Math.max(
          (beforeLabel || '').length,
          (afterLabel || '').length
        );
        const beforeDisplay = `${beforeLabel || ''} / ${beforeCatalog || ''}`;
        const afterDisplay = `${afterLabel || ''} / ${afterCatalog || ''}`;

        return {
          before: beforeDisplay,
          after: afterDisplay,
          hasChanges: beforeDisplay !== afterDisplay
        };
      };

      // Format catalog comparison
      const catalogComparison = formatBeforeAfter(
        originalData.label,
        mergedData.label,
        originalData.catalogNumber,
        mergedData.catalogNumber
      );

      // Get current tags vs new tags
      const currentTags = originalData.tags || [];
      const newTags = mergedData.tags || [];
      const addedTags = newTags.filter(tag => !currentTags.includes(tag));

      // Get description preview (use raw Beatport description, not the merged one)
      const descriptionPreview = beatportDescription ?
        truncateText(beatportDescription.replace(/\[\/?\w+\]/g, ''), 250) : '';

      // Check if a Beatport link will be added (same logic as processRedBody function)
      const currentDescription = originalData.description || '';
      const beatportUrlRegex = /https?:\/\/(www\.)?beatport\.com\/[^\s\]]+/;
      const willAddLink = !beatportUrlRegex.test(currentDescription);

      // Edit mode state
      let isEditMode = false;

      // Function to generate enhancement sections
      const generateEnhancementSection = (type, hasChanges, content) => {
        if (!hasChanges) return '';

        const sectionId = `section-${type}`;
        const checkboxId = `enable-${type}`;

        return `
          <div id="${sectionId}" style="margin-bottom: 12px;">
            <div style="display: flex; align-items: flex-start;">
              <div id="control-${type}" style="margin-right: 10px; margin-top: 2px; flex-shrink: 0; width: 18px; text-align: center;">
                <span class="emoji-indicator" style="font-size: 14px;">⚡</span>
                <input type="checkbox" class="checkbox-control" id="${checkboxId}" checked style="display: none;">
              </div>
              <div style="flex-grow: 1;">
                ${content}
              </div>
            </div>
          </div>
        `;
      };

      // Generate content for each enhancement type
      const catalogContent = `
        <div style="color: #2d5016; font-weight: 500; margin-bottom: 4px;">
          Enhance! Edition Label & Catalog Number for ${editionTorrents.length} torrent${editionTorrents.length !== 1 ? 's' : ''}:
        </div>
        <div style="margin-left: 10px; font-size: 14px;">
          <div style="display: flex; margin-bottom: 2px;">
            <span style="font-weight: bold; width: 65px; flex-shrink: 0; text-align: right; padding-right: 5px;">Before:</span>
            <span style="color: #666;">${catalogComparison.before}</span>
          </div>
          <div style="display: flex;">
            <span style="font-weight: bold; width: 65px; flex-shrink: 0; text-align: right; padding-right: 5px;">After:</span>
            <span style="color: #2d5016;">${catalogComparison.after}</span>
          </div>
        </div>
      `;

      const tagsContent = `
        <div style="color: #2d5016; font-weight: 500; margin-bottom: 4px;">
          Enhance! Group Tags:
        </div>
        <div style="margin-left: 10px; font-size: 14px;">
          ${currentTags.length > 0 ? `
            <div style="margin-bottom: 2px; display: flex;">
              <span style="font-weight: bold; width: 65px; flex-shrink: 0; text-align: right; padding-right: 5px;">Current:</span>
              <span style="color: #666;">${currentTags.join(', ')}</span>
            </div>
          ` : ''}
          <div style="display: flex;">
            <span style="font-weight: bold; width: 65px; flex-shrink: 0; text-align: right; padding-right: 5px;">Add:</span>
            <span style="color: #2d5016;">${addedTags.join(', ')}</span>
          </div>
        </div>
      `;

      const descriptionContent = `
        <div style="color: #2d5016; font-weight: 500; margin-bottom: 4px;">
          Enhance! Group Description${willAddLink ? ' and Link' : ''}:
        </div>
        <div style="margin-left: 10px; font-size: 11px; color: #666; font-style: italic; line-height: 1.3; background: #f8f8f8; padding: 8px; border-radius: 4px;">
          ${descriptionPreview}
        </div>
      `;


      dialog.innerHTML = `
        <div style="margin-bottom: 20px;">
          <div style="font-weight: bold; font-size: 16px; color: #333; margin-bottom: 0px; display: flex; justify-content: space-between; align-items: center;">
            <strong>Proposed Beatport Enhancement</strong>
            <span style="font-size: 32px; color: #f39c12;">⚡</span>
          </div>
          <div style="color: #333; font-size: 14px; margin-bottom: 1px;">
            ${artist} - ${album}
          </div>
          ${beatportUrl ? `<div style="color: #333; font-size: 14px; margin-top: 1px;">
            <a href="${beatportUrl}" target="_blank" style="color: #4a90e2; text-decoration: none;"
               onmouseover="this.style.textDecoration='underline'"
               onmouseout="this.style.textDecoration='none'">${beatportUrl}</a>
            <a href="#" id="edit-url-btn" style="color: #999; text-decoration: none; margin-left: 10px; font-size: 14px;"
               title="Wrong Link? Add the correct Beatport link."
               onmouseover="this.style.textDecoration='underline';"
               onmouseout="this.style.textDecoration='none';">edit</a>
          </div>` : ''}
        </div>

        <div id="enhancements-container" style="margin-bottom: 20px;">
          ${generateEnhancementSection('catalog', catalogComparison.hasChanges, catalogContent)}
          ${generateEnhancementSection('tags', addedTags.length > 0, tagsContent)}
          ${generateEnhancementSection('description', mergedData.description && mergedData.description !== (originalData.description || ''), descriptionContent)}
        </div>

        <div style="display: flex; justify-content: center; gap: 12px; margin-top: 24px;">
          <button id="cancel-btn" style="
            padding: 10px 20px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            color: #666;
            min-width: 100px;
          ">
            Cancel
          </button>
          <button id="edit-btn" style="
            padding: 10px 20px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            color: #333;
            min-width: 100px;
          ">
            Edit
          </button>
          <button id="enhance-btn" style="
            padding: 10px 20px;
            background: #007cba;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            min-width: 100px;
          ">
            <strong>Enhance!</strong>
          </button>
        </div>

        <div style="text-align: center; margin-top: 12px; font-size: 11px; color: #999; font-style: italic;">
          Press <strong>ESC</strong> to cancel or <strong>ENTER</strong> to enhance
        </div>
      `;

      document.body.appendChild(dialog);

      const cleanup = () => {
        document.body.removeChild(dialog);
      };

      // Toggle edit mode function
      const toggleEditMode = () => {
        isEditMode = !isEditMode;

        const editBtn = document.getElementById('edit-btn');
        const emojiIndicators = document.querySelectorAll('.emoji-indicator');
        const checkboxControls = document.querySelectorAll('.checkbox-control');

        if (isEditMode) {
          // Switch to edit mode - show checkboxes, hide emojis
          editBtn.style.background = '#ddd';
          editBtn.style.color = '#666';

          emojiIndicators.forEach(emoji => emoji.style.display = 'none');
          checkboxControls.forEach(checkbox => checkbox.style.display = 'block');
        } else {
          // Switch to default mode - show emojis, hide checkboxes
          editBtn.style.background = '#f0f0f0';
          editBtn.style.color = '#333';

          emojiIndicators.forEach(emoji => emoji.style.display = 'inline');
          checkboxControls.forEach(checkbox => checkbox.style.display = 'none');
        }
      };

      const getSelections = () => {
        if (!isEditMode) {
          // In default mode, all available enhancements are selected
          const selections = {};
          if (catalogComparison.hasChanges) selections.catalog = true;
          if (addedTags.length > 0) selections.tags = true;
          if (mergedData.description && mergedData.description !== (originalData.description || '')) selections.description = true;
          return selections;
        } else {
          // In edit mode, respect checkbox selections
          const selections = {};

          const tagsCheckbox = document.getElementById('enable-tags');
          const catalogCheckbox = document.getElementById('enable-catalog');
          const descriptionCheckbox = document.getElementById('enable-description');

          // Only include properties for checkboxes that exist
          if (tagsCheckbox) selections.tags = tagsCheckbox.checked;
          if (catalogCheckbox) selections.catalog = catalogCheckbox.checked;
          if (descriptionCheckbox) selections.description = descriptionCheckbox.checked;

          return selections;
        }
      };

      document.getElementById('cancel-btn').onclick = () => {
        cleanup();
        resolve(false);
      };

      document.getElementById('edit-btn').onclick = () => {
        toggleEditMode();
      };

      document.getElementById('enhance-btn').onclick = () => {
        const selections = getSelections();
        cleanup();
        resolve(selections);
      };

      // Edit URL button handler (only present when beatportUrl exists)
      const editUrlBtn = document.getElementById('edit-url-btn');
      if (editUrlBtn) {
        editUrlBtn.onclick = async (e) => {
          e.preventDefault();

          // Show URL correction dialog
          const newUrl = await showUrlCorrectionDialog(artist, album);
          if (newUrl) {
            cleanup();
            resolve({ action: 'reload', newUrl: newUrl });
          }
        };
      }

      // Keyboard shortcuts
      const handleKeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const selections = getSelections();
          cleanup();
          resolve(selections);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cleanup();
          resolve(false);
        }
      };

      document.addEventListener('keydown', handleKeydown);

      // Focus the enhance button
      document.getElementById('enhance-btn').focus();
    });
  };

  // Show manual URL entry dialog
  const showManualUrlDialog = (artist, album) => {
    return new Promise((resolve) => {
      const dialog = document.createElement('div');
      dialog.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: white; border: 2px solid #333; border-radius: 12px;
        padding: 24px; z-index: 10000; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        max-width: 552px; width: 90%; font-size: 14px; line-height: 1.4;
      `;

      dialog.innerHTML = `
        <div style="margin-bottom: 20px;">
          <div style="font-weight: bold; font-size: 16px; color: #333; margin-bottom: 0px; display: flex; justify-content: space-between; align-items: center;">
            <strong>No Beatport Match Found</strong>
            <span style="font-size: 32px; color: #f39c12;">🔍</span>
          </div>
          <div style="color: #333; font-size: 14px; margin-bottom: 1px;">
            ${artist} - ${album}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="color: #666; font-size: 14px; margin-bottom: 12px;">
            Could not find a matching release on Beatport.
          </div>
          <div style="color: #666; font-size: 14px; margin-bottom: 16px;">
            You can manually add a Beatport URL:
          </div>
          <input type="text" id="manual-beatport-url" placeholder="https://www.beatport.com/release/..."
                 style="width: 100%; padding: 12px; margin: 0; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
        </div>

        <div style="display: flex; justify-content: center; gap: 12px; margin-top: 24px;">
          <button id="cancel-btn" style="
            padding: 10px 20px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            color: #666;
            min-width: 100px;
          ">
            Cancel
          </button>
          <button id="add-link-btn" style="
            padding: 10px 20px;
            background: #007cba;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            min-width: 100px;
          ">
            <strong>Add Link</strong>
          </button>
        </div>

        <div style="text-align: center; margin-top: 12px; font-size: 11px; color: #999; font-style: italic;">
          Press <strong>ESC</strong> to cancel or <strong>ENTER</strong> to add link
        </div>
      `;

      document.body.appendChild(dialog);

      const urlInput = dialog.querySelector('#manual-beatport-url');
      const cancelBtn = dialog.querySelector('#cancel-btn');
      const addBtn = dialog.querySelector('#add-link-btn');

      urlInput.focus();

      const cleanup = () => {
        document.body.removeChild(dialog);
      };

      // Keyboard event handler
      const handleKeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const url = urlInput.value.trim();
          if (url) {
            cleanup();
            document.removeEventListener('keydown', handleKeydown);
            resolve(url);
          } else {
            alert('Please enter a valid Beatport URL');
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cleanup();
          document.removeEventListener('keydown', handleKeydown);
          resolve(null);
        }
      };

      document.addEventListener('keydown', handleKeydown);

      cancelBtn.onclick = () => {
        cleanup();
        document.removeEventListener('keydown', handleKeydown);
        resolve(null);
      };

      addBtn.onclick = () => {
        const url = urlInput.value.trim();
        if (url) {
          cleanup();
          document.removeEventListener('keydown', handleKeydown);
          resolve(url);
        } else {
          alert('Please enter a valid Beatport URL');
        }
      };
    });
  };

  // Show URL correction dialog (similar to manual URL but for correcting existing matches)
  const showUrlCorrectionDialog = (artist, album) => {
    return new Promise((resolve) => {
      const dialog = document.createElement('div');
      dialog.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: white; border: 2px solid #333; border-radius: 12px;
        padding: 24px; z-index: 10000; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        max-width: 552px; width: 90%; font-size: 14px; line-height: 1.4;
      `;

      dialog.innerHTML = `
        <div style="margin-bottom: 20px;">
          <div style="font-weight: bold; font-size: 16px; color: #333; margin-bottom: 0px; display: flex; justify-content: space-between; align-items: center;">
            <strong>Correct Beatport Link</strong>
            <span style="font-size: 32px; color: #f39c12;">🔗</span>
          </div>
          <div style="color: #333; font-size: 14px; margin-bottom: 1px;">
            ${artist} - ${album}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="color: #666; font-size: 14px; margin-bottom: 12px;">
            Enter the correct Beatport URL to update the enhancement data:
          </div>
          <input type="text" id="correct-beatport-url" placeholder="https://www.beatport.com/release/..."
                 style="width: 100%; padding: 12px; margin: 0; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
        </div>

        <div style="display: flex; justify-content: center; gap: 12px; margin-top: 24px;">
          <button id="cancel-btn" style="
            padding: 10px 20px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            color: #666;
            min-width: 100px;
          ">
            Cancel
          </button>
          <button id="update-link-btn" style="
            padding: 10px 20px;
            background: #007cba;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            min-width: 100px;
          ">
            <strong>Update Link</strong>
          </button>
        </div>

        <div style="text-align: center; margin-top: 12px; font-size: 11px; color: #999; font-style: italic;">
          Press <strong>ESC</strong> to cancel or <strong>ENTER</strong> to update link
        </div>
      `;

      document.body.appendChild(dialog);

      const urlInput = dialog.querySelector('#correct-beatport-url');
      const cancelBtn = dialog.querySelector('#cancel-btn');
      const updateBtn = dialog.querySelector('#update-link-btn');

      urlInput.focus();

      const cleanup = () => {
        document.body.removeChild(dialog);
      };

      // Keyboard event handler
      const handleKeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const url = urlInput.value.trim();
          if (url) {
            cleanup();
            document.removeEventListener('keydown', handleKeydown);
            resolve(url);
          } else {
            alert('Please enter a valid Beatport URL');
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cleanup();
          document.removeEventListener('keydown', handleKeydown);
          resolve(null);
        }
      };

      document.addEventListener('keydown', handleKeydown);

      cancelBtn.onclick = () => {
        cleanup();
        document.removeEventListener('keydown', handleKeydown);
        resolve(null);
      };

      updateBtn.onclick = () => {
        const url = urlInput.value.trim();
        if (url) {
          cleanup();
          document.removeEventListener('keydown', handleKeydown);
          resolve(url);
        } else {
          alert('Please enter a valid Beatport URL');
        }
      };
    });
  };

  // Process manual Beatport URL
  const processManualBeatportUrl = async (url, groupData, torrentData) => {
    // Validate URL format and extract release ID
    const beatportUrlRegex = /^https?:\/\/(www\.)?beatport\.com\/release\/[^\/]+\/(\d+)/;
    const match = url.match(beatportUrlRegex);

    if (!match) {
      throw new Error('Invalid Beatport URL format. Please use a valid Beatport release URL.');
    }

    const releaseId = match[2];

    try {
      // Fetch full metadata using the same API calls as automatic matches
      const detailedRelease = await beatportAPI.getRelease(releaseId);
      if (!detailedRelease) {
        throw new Error('Could not fetch release data from Beatport API');
      }

      const tracks = await beatportAPI.getReleaseTracks(releaseId);

      const enrichedRelease = {
        ...detailedRelease,
        tracks: tracks
      };

      const beatportData = beatportAPI.extractMetadata(enrichedRelease);

      // Create merged data same as automatic matches
      const mergedData = {
        tags: beatportData.tags,
        label: beatportData.label,
        catalogNumber: dataProcessor.generateOutputCatalogNumber(
          beatportData.catalogNumber,
          torrentData.torrent.remasterCatalogueNumber
        ),
        description: dataProcessor.generateOutputDescription(
          groupData.group.bbBody,
          beatportData.description,
          beatportData.beatportUrl
        )
      };

      return { mergedData, beatportDescription: beatportData.description, beatportUrl: beatportData.beatportUrl };

    } catch (error) {
      // Fallback to minimal data if API calls fail
      const mergedData = {
        tags: [], // No tags if API fails
        label: torrentData.torrent.remasterRecordLabel || '', // Keep existing label
        catalogNumber: torrentData.torrent.remasterCatalogueNumber || '', // Keep existing catalog
        description: dataProcessor.generateOutputDescription(
          groupData.group.bbBody,
          '', // No Beatport description available
          url
        )
      };

      return { mergedData, beatportDescription: '', beatportUrl: url }; // No description in fallback, but keep URL
    }
  };

  // Individual API call functions
  const addTagsToGroup = async (groupId, tags) => {
    try {
      const result = await redAPI.addTags(groupId, tags);
      return { status: 'success', result };
    } catch (error) {
      return { status: 'failed', error: error.message };
    }
  };

  const updateTorrentMetadata = async (editionTorrents, label, catalogNumber) => {
    const results = [];
    for (const torrent of editionTorrents) {
      try {
        const result = await redAPI.updateTorrentMetadata(torrent.id, label, catalogNumber);
        results.push({ id: torrent.id, status: 'success', result });
      } catch (error) {
        results.push({ id: torrent.id, status: 'failed', error: error.message });
      }
    }
    return results;
  };

  const updateGroupDescription = async (groupId, description, appliedOperations) => {
    try {
      const summary = generateUpdateSummary(appliedOperations);
      const result = await redAPI.updateGroupDescription(groupId, description, summary);
      return { status: 'success', result };
    } catch (error) {
      return { status: 'failed', error: error.message };
    }
  };


  // Main function to apply selected enhancements
  const applyEnhancements = async (groupId, editionTorrents, mergedData, originalData = {}, userSelections = null) => {
    // Determine which operations to perform
    let operations;
    if (!userSelections || userSelections === true) {
      // Apply all available operations
      operations = {
        tags: mergedData.tags && mergedData.tags.length > 0,
        catalog: (mergedData.label && mergedData.label !== (originalData.label || '')) ||
                 (mergedData.catalogNumber && mergedData.catalogNumber !== (originalData.catalogNumber || '')),
        description: mergedData.description && mergedData.description !== (originalData.description || '')
      };
    } else {
      // Use the provided selection states
      operations = {
        tags: userSelections.tags || false,
        catalog: userSelections.catalog || false,
        description: userSelections.description || false
      };
    }

    const results = {
      tags: null,
      description: null,
      torrents: []
    };

    // Track what operations are actually performed for summary
    const appliedOperations = {};

    try {
      // Operation 1: Add Tags
      if (operations.tags && mergedData.tags && mergedData.tags.length > 0) {
        results.tags = await addTagsToGroup(groupId, mergedData.tags);
        appliedOperations.tags = results.tags.status === 'success';
      }

      // Operation 2: Update Torrents (Label/Catalog)
      if (operations.catalog && editionTorrents.length > 0 &&
          (mergedData.label || mergedData.catalogNumber)) {
        results.torrents = await updateTorrentMetadata(editionTorrents, mergedData.label, mergedData.catalogNumber);
        appliedOperations.label = mergedData.label;
        appliedOperations.catalogNumber = mergedData.catalogNumber;
      }

      // Operation 3: Update Description
      if (operations.description && mergedData.description &&
          mergedData.description !== (originalData.description || '')) {
        results.description = await updateGroupDescription(groupId, mergedData.description, appliedOperations);
      }

      return { results, appliedOperations };

    } catch (error) {
      throw error;
    }
  };

  // Main enhancement function
  const enhanceWithBeatport = async (torrentId) => {
    // Check if API key is configured before starting the enhancement process
    if (!(await checkAPIKeyConfiguration())) {
      return;
    }

    try {
      const torrentData = await redAPI.getTorrent(torrentId);
      const groupData = await redAPI.getTorrentGroup(torrentData.group.id);

      const editionTorrents = findEditionTorrents(torrentData.torrent, groupData.torrents);

      const artist = decodeHTML(groupData.group.musicInfo.artists[0]?.name || '');
      const album = decodeHTML(groupData.group.name || '');

      if (!artist || !album) {
        throw new Error("Could not extract artist or album information");
      }


      const searchResults = await beatportAPI.search(artist, album);

      const bestMatch = beatportAPI.findBestMatch(searchResults, artist, album);

      if (!bestMatch) {
        const manualUrl = await showManualUrlDialog(artist, album);

        if (!manualUrl) {
          // User cancelled
          return;
        }

        // Process manual URL
        const { mergedData, beatportDescription, beatportUrl } = await processManualBeatportUrl(manualUrl, groupData, torrentData);

        const originalData = {
          label: torrentData.torrent.remasterRecordLabel || '',
          catalogNumber: torrentData.torrent.remasterCatalogueNumber || '',
          description: groupData.group.bbBody || ''
        };

        if (config.express_mode) {
          const { results, appliedOperations } = await applyEnhancements(
            groupData.group.id,
            editionTorrents,
            mergedData,
            originalData
          );

          const successMessage = generateDetailedSuccessMessage(
            artist,
            album,
            results,
            appliedOperations,
            editionTorrents,
            mergedData,
            originalData
          );

          localStorage.setItem('beatport_enhance_success', successMessage);

          // WORKAROUND: Apply form-based edit to fix RED API bug (v1.2.12)
          // This performs a minimal form edit that fixes display issues caused by API-only edits
          // TODO: Remove when RED fixes their API bug
          if (results.description && results.description.status === 'success') {
            console.log('WORKAROUND: Description was updated via API, applying form-based fix...');
            await performMinimalFormEdit(groupData.group.id, mergedData, originalData);
          }

          // Reload the page to show the updates
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          // Show confirmation dialog
          const userChoice = await showEnhancementConfirmation(artist, album, mergedData, originalData, editionTorrents, beatportDescription, beatportUrl);

          // Handle URL correction request
          if (userChoice && userChoice.action === 'reload' && userChoice.newUrl) {
            try {
              // Process the new URL and get updated data
              const { mergedData: newMergedData, beatportDescription: newBeatportDescription, beatportUrl: newBeatportUrl } = await processManualBeatportUrl(userChoice.newUrl, groupData, torrentData);

              // Recursively call showEnhancementConfirmation with new data
              const newUserChoice = await showEnhancementConfirmation(artist, album, newMergedData, originalData, editionTorrents, newBeatportDescription, newBeatportUrl);

              if (newUserChoice && newUserChoice.action !== 'reload') {
                // Handle the new choice (same logic as below)
                const isAllFalse = typeof newUserChoice === 'object' &&
                  Object.values(newUserChoice).every(value => value === false);

                if (isAllFalse) {
                  showCancelNotification('Beatport enhancement canceled. No changes applied.');
                  return;
                }

                const { results, appliedOperations } = await applyEnhancements(
                  groupData.group.id,
                  editionTorrents,
                  newMergedData,
                  originalData,
                  newUserChoice
                );

                const successMessage = generateDetailedSuccessMessage(
                  artist,
                  album,
                  results,
                  appliedOperations,
                  editionTorrents,
                  newMergedData,
                  originalData
                );

                localStorage.setItem('beatport_enhance_success', successMessage);

                if (results.description && results.description.status === 'success') {
                  console.log('WORKAROUND: Description was updated via API, applying form-based fix...');
                  await performMinimalFormEdit(groupData.group.id, mergedData, originalData);
                }

                setTimeout(() => {
                  location.reload();
                }, 1000);
              }
              return;
            } catch (error) {
              console.error('Error processing corrected URL:', error);
              alert('Error processing the corrected URL: ' + error.message);
              return;
            }
          }

          if (userChoice) {
            // Check if userChoice is an object with all false values (no operations selected)
            const isAllFalse = typeof userChoice === 'object' &&
              Object.values(userChoice).every(value => value === false);

            if (isAllFalse) {
              // User unchecked all boxes
              showCancelNotification('Beatport enhancement canceled. No changes applied.');
              return;
            }

            // userChoice is either true (enhance all) or an object with checkbox selections
            const { results, appliedOperations } = await applyEnhancements(
              groupData.group.id,
              editionTorrents,
              mergedData,
              originalData,
              userChoice
            );

            const successMessage = generateDetailedSuccessMessage(
              artist,
              album,
              results,
              appliedOperations,
              editionTorrents,
              mergedData,
              originalData
            );

            localStorage.setItem('beatport_enhance_success', successMessage);

            // WORKAROUND: Apply form-based edit to fix RED API bug (v1.2.12)
            // This performs a minimal form edit that fixes display issues caused by API-only edits
            // TODO: Remove when RED fixes their API bug
            if (results.description && results.description.status === 'success') {
              console.log('WORKAROUND: Description was updated via API, applying form-based fix...');
              await performMinimalFormEdit(groupData.group.id, mergedData, originalData);
            }

            // Reload the page to show the updates
            setTimeout(() => {
              location.reload();
            }, 1000);
          } else {
            // User clicked Cancel or pressed Escape
            showCancelNotification('Beatport enhancement canceled. No changes applied.');
          }
        }

        return;
      }

      const enrichedRelease = await beatportAPI.getEnrichedReleaseData(bestMatch);
      const beatportData = beatportAPI.extractMetadata(enrichedRelease);

      const mergedData = {
        tags: beatportData.tags,
        label: beatportData.label,
        catalogNumber: dataProcessor.generateOutputCatalogNumber(
          beatportData.catalogNumber,
          torrentData.torrent.remasterCatalogueNumber
        ),
        description: dataProcessor.generateOutputDescription(
          groupData.group.bbBody,
          beatportData.description,
          beatportData.beatportUrl
        )
      };


      const originalData = {
        label: torrentData.torrent.remasterRecordLabel || '',
        catalogNumber: torrentData.torrent.remasterCatalogueNumber || '',
        description: groupData.group.bbBody || ''
      };

      if (config.express_mode) {
        const { results, appliedOperations } = await applyEnhancements(
          groupData.group.id,
          editionTorrents,
          mergedData,
          originalData
        );

        const successMessage = generateDetailedSuccessMessage(
          artist,
          album,
          results,
          appliedOperations,
          editionTorrents,
          mergedData,
          originalData
        );

        localStorage.setItem('beatport_enhance_success', successMessage);

        // WORKAROUND: Apply form-based edit to fix RED API bug (v1.2.12)
        // This performs a minimal form edit that fixes display issues caused by API-only edits
        // TODO: Remove when RED fixes their API bug
        if (results.description && results.description.status === 'success') {
          console.log('WORKAROUND: Description was updated via API, applying form-based fix...');
          await performMinimalFormEdit(groupData.group.id, mergedData, originalData);
        }

        // Reload the page to show the updates
        setTimeout(() => {
          location.reload();
        }, 1000); // 1 second delay
      } else {
        // Show confirmation dialog
        const userChoice = await showEnhancementConfirmation(artist, album, mergedData, originalData, editionTorrents, beatportData.description, beatportData.beatportUrl);

        // Handle URL correction request
        if (userChoice && userChoice.action === 'reload' && userChoice.newUrl) {
          try {
            // Process the new URL and get updated data
            const { mergedData: newMergedData, beatportDescription: newBeatportDescription, beatportUrl: newBeatportUrl } = await processManualBeatportUrl(userChoice.newUrl, groupData, torrentData);

            // Recursively call showEnhancementConfirmation with new data
            const newUserChoice = await showEnhancementConfirmation(artist, album, newMergedData, originalData, editionTorrents, newBeatportDescription, newBeatportUrl);

            if (newUserChoice && newUserChoice.action !== 'reload') {
              // Handle the new choice (same logic as below)
              const isAllFalse = typeof newUserChoice === 'object' &&
                Object.values(newUserChoice).every(value => value === false);

              if (isAllFalse) {
                showCancelNotification('Beatport enhancement canceled. No changes applied.');
                return;
              }

              const { results, appliedOperations } = await applyEnhancements(
                groupData.group.id,
                editionTorrents,
                newMergedData,
                originalData,
                newUserChoice
              );

              const successMessage = generateDetailedSuccessMessage(
                artist,
                album,
                results,
                appliedOperations,
                editionTorrents,
                newMergedData,
                originalData
              );

              localStorage.setItem('beatport_enhance_success', successMessage);

              if (results.description && results.description.status === 'success') {
                console.log('WORKAROUND: Description was updated via API, applying form-based fix...');
                await performMinimalFormEdit(groupData.group.id, mergedData, originalData);
              }

              setTimeout(() => {
                location.reload();
              }, 1000);
            }
            return;
          } catch (error) {
            console.error('Error processing corrected URL:', error);
            alert('Error processing the corrected URL: ' + error.message);
            return;
          }
        }

        if (userChoice) {
          // Check if userChoice is an object with all false values (no operations selected)
          const isAllFalse = typeof userChoice === 'object' &&
            Object.values(userChoice).every(value => value === false);

          if (isAllFalse) {
            // User unchecked all boxes
            showCancelNotification('Beatport enhancement canceled. No changes applied.');
            return;
          }

          // userChoice is either true (enhance all) or an object with checkbox selections
          const { results, appliedOperations } = await applyEnhancements(
            groupData.group.id,
            editionTorrents,
            mergedData,
            originalData,
            userChoice
          );

          const successMessage = generateDetailedSuccessMessage(
            artist,
            album,
            results,
            appliedOperations,
            editionTorrents,
            mergedData,
            originalData
          );

          localStorage.setItem('beatport_enhance_success', successMessage);

          // WORKAROUND: Apply form-based edit to fix RED API bug (v1.2.12)
          // This performs a minimal form edit that fixes display issues caused by API-only edits
          // TODO: Remove when RED fixes their API bug
          if (results.description && results.description.status === 'success') {
            console.log('WORKAROUND: Description was updated via API, applying form-based fix...');
            await performMinimalFormEdit(groupData.group.id, mergedData, originalData);
          }

          // Reload the page to show the updates
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          // User clicked Cancel or pressed Escape
          showCancelNotification('Beatport enhancement canceled. No changes applied.');
        }
      }

    } catch (error) {
      console.error("Enhancement failed:", error);
      if (error.message.includes("No RED API key configured")) {
        alert(`RED API Key Required!\n\nTo use Beatport enhancement, you need to:\n1. Go to Settings → Access Settings on RED\n2. Create an API key with scopes: torrents (read/write), tags (write)\n3. Add the API key in your user settings (User → Edit Profile)\n4. Save and try again`);
      } else {
        alert(`Enhancement failed: ${error.message}`);
      }
    }
  };

  // Extract torrent ID from torrentdetails element
  const extractTorrentId = (torrentElement) => {
    const idMatch = torrentElement.id.match(/torrent_(\d+)/);
    return idMatch ? idMatch[1] : null;
  };

  // Show API key setup instructions modal
  const showAPIKeyInstructions = () => {
    return new Promise((resolve) => {
      const dialog = document.createElement('div');
      dialog.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: white; border: 2px solid #333; border-radius: 12px;
        padding: 24px; z-index: 10000; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        max-width: 752px; width: 90%; font-size: 14px; line-height: 1.4;
      `;

      dialog.innerHTML = `
        <div style="margin-bottom: 20px;">
          <div style="font-weight: bold; font-size: 16px; color: #333; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <strong>RED API Key Required!</strong>
            <span style="font-size: 32px; color: #f39c12;">🔑</span>
          </div>
          <div style="color: #666; font-size: 14px; margin-bottom: 20px;">
            To use Beatport enhancement, you need to set up your RED API key:
          </div>
        </div>

        <div style="margin-bottom: 20px; background: #f8f8f8; padding: 16px; border-radius: 8px; line-height: 1.6;">
          <div style="margin-bottom: 16px;">
            <div style="font-weight: bold; color: #333; margin-bottom: 8px;">1. Create an API key for Beatport Enhance:</div>
            <div style="margin-left: 16px; color: #555;">
              <div>1.1 Go to your settings page: <strong>Settings → Access Settings → API Keys</strong></div>
              <div>1.2 Name it <strong>"Beatport-Enhance"</strong> and have the <strong>torrents checkbox</strong> clicked</div>
              <div>1.3 Save the API key somewhere as it is <strong>not recoverable</strong></div>
              <div>1.4 Click the <strong>"Confirm API Key"</strong> checkbox</div>
              <div>1.5 Click the <strong>"Save Profile"</strong> button</div>
            </div>
          </div>

          <div style="margin-bottom: 16px;">
            <div style="font-weight: bold; color: #333; margin-bottom: 8px;">2. Configure the API key in Beatport Enhance:</div>
            <div style="margin-left: 16px; color: #555;">
              Once you have your API key re-open your settings page and look for the <strong>"RED API Key for Beatport Enhance"</strong> setting under Torrent Settings towards the top of the page and paste it in.
            </div>
          </div>

          <div>
            <div style="font-weight: bold; color: #333; margin-bottom: 8px;">3. Save and you're ready:</div>
            <div style="margin-left: 16px; color: #555;">
              Click the <strong>"Save Profile"</strong> button. You are good to go.
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 12px; margin-top: 24px;">
          <button id="api-key-ok-btn" style="
            padding: 10px 20px;
            background: #007cba;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            min-width: 100px;
          ">
            <strong>Got it!</strong>
          </button>
        </div>

        <div style="text-align: center; margin-top: 12px; font-size: 11px; color: #999; font-style: italic;">
          Press <strong>ESC</strong> or <strong>ENTER</strong> to close
        </div>
      `;

      document.body.appendChild(dialog);

      const cleanup = () => {
        document.body.removeChild(dialog);
      };

      const okBtn = document.getElementById('api-key-ok-btn');
      okBtn.focus();

      // Keyboard event handler
      const handleKeydown = (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          cleanup();
          document.removeEventListener('keydown', handleKeydown);
          resolve();
        }
      };

      document.addEventListener('keydown', handleKeydown);

      okBtn.onclick = () => {
        cleanup();
        document.removeEventListener('keydown', handleKeydown);
        resolve();
      };
    });
  };

  // Check if RED API key is configured and show setup instructions if not
  const checkAPIKeyConfiguration = async () => {
    if (!config.red_api_key || config.red_api_key.trim() === '') {
      await showAPIKeyInstructions();
      return false;
    }
    return true;
  };

  // BP link click handler
  const handleBPClick = async (event) => {
    event.preventDefault();
    const torrentId = event.target.dataset.torrentid;
    const button = event.target;

    // Disable button during processing
    button.style.pointerEvents = "none";
    button.style.opacity = "0.6";

    // Show processing notification
    const processingNotification = showProcessingNotification('Searching Beatport and applying metadata...');

    try {
      await enhanceWithBeatport(torrentId);
    } catch (error) {
      console.error('Error in enhanceWithBeatport:', error);
    } finally {
      // Restore button state
      button.style.pointerEvents = "";
      button.style.opacity = "";

      // Dismiss processing notification
      if (processingNotification && processingNotification.parentNode) {
        processingNotification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (processingNotification.parentNode) {
            document.body.removeChild(processingNotification);
          }
        }, 300);
      }
    }
  };

  // Group torrents by edition and find representative torrent ID
  const groupTorrentsByEdition = () => {
    const editionInfos = document.querySelectorAll(".edition_info");
    const editionGroups = new Map();


    // Group torrents by their edition class (edition_1, edition_2, etc.)
    const torrentDetails = document.querySelectorAll(".torrentdetails");
    const editionMap = new Map();

    torrentDetails.forEach((torrentElement) => {
      const torrentId = extractTorrentId(torrentElement);
      if (!torrentId) return;

      // Extract edition number from classes like "edition_1", "edition_2"
      const classes = torrentElement.className.split(' ');
      const editionClass = classes.find(cls => cls.startsWith('edition_') && cls !== 'edition');
      const editionKey = editionClass || 'default';

      if (!editionMap.has(editionKey)) {
        editionMap.set(editionKey, []);
      }
      editionMap.get(editionKey).push(torrentId);
    });


    // Match edition_info elements with torrent groups
    editionInfos.forEach((editionInfo, index) => {
      // Try to find the corresponding edition key
      const editionKey = `edition_${index + 1}`;
      const torrents = editionMap.get(editionKey) || editionMap.get('default') || [];

      if (torrents.length > 0) {
        editionGroups.set(editionKey, {
          element: editionInfo,
          torrentId: torrents[0],
          torrents: torrents
        });
        editionMap.delete(editionKey); // Remove so we don't double-process
      }
    });

    // Handle any remaining unmapped editions
    editionMap.forEach((torrents, editionKey) => {
      if (torrents.length > 0 && !editionGroups.has(editionKey)) {
        // Find a suitable container or use first edition_info as fallback
        const element = document.querySelector('.edition_info') || document.body;
        editionGroups.set(editionKey, {
          element: element,
          torrentId: torrents[0],
          torrents: torrents
        });
      }
    });

    return editionGroups;
  };

  // Inject BP links at edition level
  const injectBPLinks = () => {

    const editionGroups = groupTorrentsByEdition();

    // If no edition groups found, try simple fallback approach
    if (editionGroups.size === 0) {
      const torrentDetails = document.querySelectorAll(".torrentdetails");
      if (torrentDetails.length > 0) {
        const firstTorrent = torrentDetails[0];
        const torrentId = extractTorrentId(firstTorrent);
        if (torrentId) {
          // Try to find any suitable container
          const container = document.querySelector(".edition_info") ||
                           document.querySelector(".group_info") ||
                           document.querySelector("#content h2") ||
                           document.querySelector(".thin");

          if (container) {
            const bpLink = document.createElement("span");
            //bpLink.style.cssText = "float: right; margin-left: 10px;";

            // Set the HTML content directly to ensure proper display
            bpLink.innerHTML = '[ <a href="javascript:;" id="bp_fallback_' + torrentId + '" style="color: inherit; text-decoration: none;">BP DEBUG</a> ]';

            // Get the link element and add event listeners
            const debugLink = bpLink.querySelector('a');
            debugLink.dataset.torrentid = torrentId;
            debugLink.title = "Enhance! (debug mode)";
            debugLink.addEventListener("click", handleBPClick);

            container.appendChild(bpLink);
          }
        }
      }
      return;
    }

    editionGroups.forEach((group, editionKey) => {
      const { element, torrentId } = group;

      // Skip if BP button already exists for this edition
      if (element.querySelector(`#bp_edition_${torrentId}`)) {
        return;
      }

      // For edition_info elements (td), add button directly with right alignment
      if (element.classList.contains('edition_info')) {
        // Create container with right alignment
        const container = document.createElement("span");
        container.style.cssText = "float: right; margin-left: 10px;";

        // Set the HTML content directly to ensure proper display
        container.innerHTML = '[ <a href="javascript:;" id="bp_edition_' + torrentId + '" style="color: inherit; text-decoration: none;">BP</a> ]';

        // Get the link element and add event listeners
        const bpLink = container.querySelector('a');
        bpLink.dataset.torrentid = torrentId;
        bpLink.title = "Enhance!";
        bpLink.className = "tooltip";
        bpLink.addEventListener("click", handleBPClick);

        // Add hover effect for underline (like DL links)
        bpLink.addEventListener("mouseenter", () => {
          bpLink.style.textDecoration = "underline";
        });
        bpLink.addEventListener("mouseleave", () => {
          bpLink.style.textDecoration = "none";
        });

        // Append to the td element
        element.appendChild(container);
      } else {
        // Fallback for other elements
        const bpContainer = document.createElement("span");
        bpContainer.style.cssText = "float: right; margin-left: 10px;";

        // Set the HTML content directly to ensure proper display
        bpContainer.innerHTML = '[ <a href="javascript:;" id="bp_edition_' + torrentId + '" style="color: inherit; text-decoration: none;">BP</a> ]';

        // Get the link element and add event listeners
        const bpLink = bpContainer.querySelector('a');
        bpLink.dataset.torrentid = torrentId;
        bpLink.title = "Enhance!";
        bpLink.className = "tooltip";
        bpLink.addEventListener("click", handleBPClick);
        element.appendChild(bpContainer);

      }
    });
  };

  // Initialize the userscript
  const init = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get("id");

    if (!groupId) {
      return;
    }


    // Check for success notification from previous enhancement
    checkForSuccessNotification();

    injectBPLinks();

  };


  // Test function for alphabetical URL insertion (accessible from browser console)
  window.testAlphabeticalUrlInsertion = () => {
    console.log("=== Testing Alphabetical URL Insertion ===");

    const testCases = [
      {
        name: "Basic alphabetical sorting",
        input: "[url=http://deezer.com]Deezer[/url] | [url=http://discogs.com]Discogs[/url] | [url=http://bandcamp.com]Bandcamp[/url]",
        expected: "Bandcamp, Beatport, Deezer, Discogs"
      },
      {
        name: "Beatport already exists",
        input: "[url=http://bandcamp.com]Bandcamp[/url] | [url=http://beatport.com]Beatport[/url] | [url=http://deezer.com]Deezer[/url]",
        expected: "Should return original (no duplication)"
      },
      {
        name: "Single existing link",
        input: "[url=http://spotify.com]Spotify[/url]",
        expected: "Beatport, Spotify"
      },
      {
        name: "Empty input",
        input: "",
        expected: "Should fallback to append"
      }
    ];

    testCases.forEach((testCase, index) => {
      console.log(`\\n--- Test ${index + 1}: ${testCase.name} ---`);
      console.log("Input:", testCase.input);

      try {
        const result = dataProcessor.parseAndSortLinks(testCase.input, "https://www.beatport.com/release/test/123456");
        console.log("Result:", result);

        // Extract site names for verification
        const linkRegex = /\\[url=[^\\]]+\\]([^\\[]+)\\[\\/url\\]/g;
        const sites = [];
        let match;
        while ((match = linkRegex.exec(result)) !== null) {
          sites.push(match[1]);
        }
        console.log("Extracted sites:", sites.join(", "));
        console.log("Expected:", testCase.expected);

        // Basic validation
        if (testCase.name === "Beatport already exists" && result === testCase.input) {
          console.log("✅ PASS - No duplication");
        } else if (testCase.name === "Empty input" && result.includes("Beatport")) {
          console.log("✅ PASS - Fallback behavior");
        } else {
          console.log("📝 Check manually against expected result");
        }
      } catch (error) {
        console.log("❌ ERROR:", error.message);
      }
    });

    console.log("\\n🎉 Test completed! Check results above.");
  };

  // Wait for page to be ready and initialize
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();