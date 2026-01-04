// ==UserScript==
// @name         Danbooru Theme Toggle (SunCalc + IP Geolocation)
// @namespace    Danbooru
// @version      1.7
// @description  Automatically toggles native dark mode based on local sunset/sunrise times
// @author       Dramorian
// @match        https://danbooru.donmai.us/*
// @match        https://aibooru.online/*
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/suncalc@1.8.0/suncalc.min.js
// @require      https://cdn.jsdelivr.net/npm/temporal-polyfill@0.3.0/global.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462489/Danbooru%20Theme%20Toggle%20%28SunCalc%20%2B%20IP%20Geolocation%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462489/Danbooru%20Theme%20Toggle%20%28SunCalc%20%2B%20IP%20Geolocation%29.meta.js
// ==/UserScript==

/**
 * Manages automatic theme toggling for Danbooru based on sunrise/sunset times.
 * @class
 */
class DanbooruThemeToggle {
  #config = {
    debug: true,
    cacheKey: 'danbooru_theme_location',
    cacheDuration: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
  };

  /**
   * Logs messages if debug mode is enabled.
   * @param {...any} args - Values to log.
   */
  #log(...args) {
    if (this.#config.debug) console.log('[DanbooruThemeToggle]', ...args);
  }

  /**
   * Logs errors if debug mode is enabled.
   * @param {...any} args - Error details to log.
   */
  #logError(...args) {
    if (this.#config.debug) console.error('[DanbooruThemeToggle]', ...args);
  }

  /**
   * Retrieves or fetches location data, with caching.
   * @returns {Promise<{latitude: number, longitude: number, timezone: string}>}
   */
  async #getLocationData() {
    this.#log('Checking for cached location data...');
    const cachedData = localStorage.getItem(this.#config.cacheKey);

    if (cachedData) {
      const { timestamp, location } = JSON.parse(cachedData);
      const cacheAge = Temporal.Now.instant().since(
        Temporal.Instant.fromEpochMilliseconds(timestamp)
      ).total({ unit: 'millisecond' });

      if (cacheAge < this.#config.cacheDuration) {
        this.#log('Using cached location:', location);
        return location;
      }
      this.#log('Cache expired, fetching new location data');
    } else {
      this.#log('No cached data found, fetching new location data');
    }

    try {
      this.#log('Fetching location from ipapi.co...');
      const response = await fetch('https://ipapi.co/json/', {
        signal: AbortSignal.timeout(5000), // ES15 AbortSignal timeout
      });
      const location = await response.json();

      this.#log('Received location data:', {
        lat: location.latitude,
        lng: location.longitude,
        timezone: location.timezone,
      });

      localStorage.setItem(
        this.#config.cacheKey,
        JSON.stringify({
          timestamp: Temporal.Now.instant().epochMilliseconds,
          location,
        })
      );

      return location;
    } catch (error) {
      this.#logError('Location fetch failed:', error);
      throw new Error('Failed to fetch location data', { cause: error });
    }
  }

  /**
   * Updates the theme based on sunrise/sunset times.
   * @returns {Promise<void>}
   */
  async #updateThemeBasedOnSun() {
    this.#log('Starting theme update...');

    if (typeof Danbooru === 'undefined' || !Danbooru?.CurrentUser) {
      this.#logError('Danbooru API unavailable');
      return;
    }

    try {
      const { latitude, longitude, timezone } = await this.#getLocationData();
      const lat = Number.parseFloat(latitude);
      const lng = Number.parseFloat(longitude);

      // Calculate sun times using Temporal API
      const now = Temporal.Now.zonedDateTimeISO(timezone);
      const { sunrise, sunset } = SunCalc.getTimes(
        new Date(now.toInstant().epochMilliseconds),
        lat,
        lng
      );

      this.#log('Sun times:', {
        sunrise: sunrise.toUTCString(),
        sunset: sunset.toUTCString(),
      });

      // Format times using Temporal
      const formatter = (date) =>
        Temporal.Instant.fromEpochMilliseconds(date.getTime())
          .toZonedDateTimeISO(timezone)
          .toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h24',
          });

      const currentTime = now.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h24',
      });
      const sunriseTime = formatter(sunrise);
      const sunsetTime = formatter(sunset);

      this.#log('Formatted times:', { currentTime, sunriseTime, sunsetTime });

      // Determine theme
      const isNightTime =
        currentTime >= sunsetTime || currentTime < sunriseTime;
      const currentThemeIsDark = Danbooru.CurrentUser.darkMode();

      if (isNightTime !== currentThemeIsDark) {
        const newTheme = isNightTime ? 'dark' : 'light';
        this.#log(`Updating to ${newTheme} mode...`);
        await Danbooru.CurrentUser.update({ theme: newTheme });
        Danbooru.Utility.notice(`Theme updated to ${newTheme} mode.`);
        this.#log('Theme updated, reloading page');
        window.location.reload();
      } else {
        this.#log('Theme matches time of day, no update needed');
      }
    } catch (error) {
      this.#logError('Theme update failed:', error);
    }
  }

  /**
   * Initializes the theme toggle script.
   * @returns {Promise<void>}
   */
  async init() {
    this.#log('Script initialized');
    await this.#updateThemeBasedOnSun();
  }
}

// Start the script
new DanbooruThemeToggle().init().catch((error) =>
  console.error('[DanbooruThemeToggle] Initialization failed:', error)
);