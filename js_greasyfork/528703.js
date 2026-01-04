// ==UserScript==
// @name         SimpleBalancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Balances API key and URL pairs usage
// @author       RoCry
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// ==/UserScript==

class SimpleBalancer {
  /**
   * Balances API key and URL pairs usage
   */
  constructor() {
    this.loadUsageData();
  }

  loadUsageData() {
    try {
      // Use GM_getValue for Tampermonkey/Greasemonkey persistence
      this.pairUsage = GM_getValue('simpleBalancerUsage', {});
    } catch (error) {
      console.error('Error loading balancer data:', error);
      this.pairUsage = {};
    }
  }

  saveUsageData() {
    try {
      // Use GM_setValue for Tampermonkey/Greasemonkey persistence
      GM_setValue('simpleBalancerUsage', this.pairUsage);
    } catch (error) {
      console.error('Error saving balancer data:', error);
    }
  }

  parseItems(items) {
    return items.split(',').map(item => item.trim()).filter(item => item);
  }

  createPairKey(key, url) {
    return `${key}|||${url}`;
  }

  parsePairKey(pairKey) {
    const [key, url] = pairKey.split('|||');
    return [key, url];
  }

  /**
   * Choose a key-URL pair based on usage balancing.
   * Cases:
   * 1. 1 key, 1 url -> single pair
   * 2. 1 key, n urls -> key paired with each url
   * 3. n keys, n urls -> matching pairs
   * 4. n keys, 1 url -> each key paired with url
   * 
   * @param {string} keys - Comma-separated list of API keys
   * @param {string} urls - Comma-separated list of URLs
   * @returns {Array} - [key, url] pair that was selected
   */
  choosePair(keys, urls) {
    const keyList = this.parseItems(keys);
    const urlList = this.parseItems(urls);

    if (keyList.length === 0 || urlList.length === 0) {
      throw new Error("Keys and URLs cannot be empty");
    }

    // Generate valid pairs based on the cases
    let pairs = [];

    if (urlList.length === 1) {
      pairs = keyList.map(key => [key, urlList[0]]);
    } else if (keyList.length === 1) {
      pairs = urlList.map(url => [keyList[0], url]);
    } else {
      if (keyList.length !== urlList.length) {
        throw new Error("When using multiple keys and URLs, their counts must match");
      }
      pairs = keyList.map((key, index) => [key, urlList[index]]);
    }

    // Convert pairs to pairKeys and initialize usage count if needed
    const pairKeys = pairs.map(([key, url]) => {
      const pairKey = this.createPairKey(key, url);
      if (!(pairKey in this.pairUsage)) {
        this.pairUsage[pairKey] = 0;
      }
      return pairKey;
    });

    // Find the minimum usage count
    const minUsage = Math.min(...pairKeys.map(key => this.pairUsage[key]));

    // Find all pairs with minimum usage
    const leastUsedPairKeys = pairKeys.filter(key => this.pairUsage[key] === minUsage);

    // Randomly select one of the least used pairs
    const randomIndex = Math.floor(Math.random() * leastUsedPairKeys.length);
    const chosenPairKey = leastUsedPairKeys[randomIndex];

    // Increment usage for the chosen pair
    this.pairUsage[chosenPairKey]++;

    // Save updated usage data
    this.saveUsageData();

    // Return the chosen pair
    return this.parsePairKey(chosenPairKey);
  }

  resetUsage() {
    this.pairUsage = {};
    this.saveUsageData();
  }

  getUsageStats() {
    const stats = {};
    for (const pairKey in this.pairUsage) {
      const [key, url] = this.parsePairKey(pairKey);
      stats[`${key}, ${url}`] = this.pairUsage[pairKey];
    }
    return stats;
  }
}

// Make it available globally for other scripts to use
if (typeof module !== 'undefined') {
  module.exports = SimpleBalancer;
} else {
  window.SimpleBalancer = SimpleBalancer;
}
