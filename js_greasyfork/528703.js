// ==UserScript==
// @name         SimpleBalancer
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Balances API key and URL pairs usage
// @author       RoCry
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// ==/UserScript==

class SimpleBalancer {
  constructor(storageKey = 'simpleBalancerUsage') {
    this.storageKey = storageKey;
    this.storage = this.createStorage();
    this.pairUsage = this.loadUsageData();
  }

  createStorage() {
    if (typeof GM_getValue === 'function' && typeof GM_setValue === 'function') {
      return {
        get: (key, fallback) => GM_getValue(key, fallback),
        set: (key, value) => GM_setValue(key, value)
      };
    }

    if (typeof localStorage !== 'undefined') {
      return {
        get: (key, fallback) => {
          const raw = localStorage.getItem(key);
          if (raw === null) return fallback;
          return JSON.parse(raw);
        },
        set: (key, value) => {
          localStorage.setItem(key, JSON.stringify(value));
        }
      };
    }

    throw new Error('No storage available for SimpleBalancer');
  }

  loadUsageData() {
    const data = this.storage.get(this.storageKey, {});
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid balancer data in storage');
    }
    return data;
  }

  saveUsageData() {
    this.storage.set(this.storageKey, this.pairUsage);
  }

  parseItems(items) {
    if (typeof items !== 'string') {
      throw new Error('Expected comma-separated string');
    }

    const parsed = items.split(',').map(item => item.trim()).filter(Boolean);
    if (parsed.length === 0) {
      throw new Error('Keys and URLs cannot be empty');
    }
    return parsed;
  }

  createPairKey(key, url) {
    return `${key}|||${url}`;
  }

  parsePairKey(pairKey) {
    const [key, url] = pairKey.split('|||');
    return [key, url];
  }

  choosePair(keys, urls) {
    const keyList = this.parseItems(keys);
    const urlList = this.parseItems(urls);

    let pairs = [];

    if (urlList.length === 1) {
      pairs = keyList.map(key => [key, urlList[0]]);
    } else if (keyList.length === 1) {
      pairs = urlList.map(url => [keyList[0], url]);
    } else {
      if (keyList.length !== urlList.length) {
        throw new Error('When using multiple keys and URLs, their counts must match');
      }
      pairs = keyList.map((key, index) => [key, urlList[index]]);
    }

    const pairKeys = pairs.map(([key, url]) => {
      const pairKey = this.createPairKey(key, url);
      if (!(pairKey in this.pairUsage)) {
        this.pairUsage[pairKey] = 0;
      }
      return pairKey;
    });

    const minUsage = Math.min(...pairKeys.map(key => this.pairUsage[key]));
    const leastUsedPairKeys = pairKeys.filter(key => this.pairUsage[key] === minUsage);
    const randomIndex = Math.floor(Math.random() * leastUsedPairKeys.length);
    const chosenPairKey = leastUsedPairKeys[randomIndex];

    this.pairUsage[chosenPairKey] += 1;
    this.saveUsageData();

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

if (typeof module !== 'undefined') {
  module.exports = SimpleBalancer;
} else {
  window.SimpleBalancer = SimpleBalancer;
}
