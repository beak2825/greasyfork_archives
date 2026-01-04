// ==UserScript==
// @name         AniSkip
// @description  Library for AniSkip API
// @version      1.0
// @author       pizidavi
// ==/UserScript==

/*jshint esversion: 11 */


/** Library for AniSkip API */
class AniSkip {
  /** @typedef {'op'|'ed'|'mixed-op'|'mixed-ed'|'recap'} SkipTypes */
  /** @typedef {'upvote'|'downvote'} VoteType */

  /**
   * @param {Object} [options] Library options
   * @param {string} [options.userId] AniSkip user UUID
   * @param {string} [options.providerName] Website's name | Default to website's domain name
   * @example
   * const aniskip = new AniSkip({
   *   userId: 'uuid'
   * });
   */
  constructor(options = {}) {
    const getDomainName = hostname => hostname.replace(/(?:[^.\n]*\.)?([^.\n]*)(\..*)/, '$1');

    this.baseUrl = 'https://api.aniskip.com/v2';
    this.providerName = options.providerName ?? getDomainName(window.location.hostname);
    this.userId = options.userId ?? null;

    this.CategoryTitle = {
      'op': 'Opening',
      'ed': 'Ending',
      'mixed-op': 'Mixed Opening',
      'mixed-ed': 'Mixed Ending',
      'recap': 'Recap',
    };
  }
  /**
   * Retrieves a skip time for the specified anime episode.
   * @param {number} malId MAL ID
   * @param {number} episodeNumber Episode number of the anime
   * @param {number} episodeLength Length of the episode in seconds with max 3 digit after the decimal point
   * @example
   * aniskip.getSkipTimes(malId, episodeNumber, episodeLength)
   *  .then(data => console.log(data))
   *  .catch(response => console.error(response))
   * @returns {Promise}
   */
  async getSkipTimes(malId, episodeNumber, episodeLength) {
    const data = await this.__request({
      url: '/skip-times/' + malId + '/' + episodeNumber + '?types[]=op&types[]=ed&types[]=mixed-op&types[]=mixed-ed&types[]=recap&episodeLength=' + episodeLength
    });
    if (!(data.found && data.results.length))
      throw new Error(data.message || 'Error in getSkipTimes');
    return data.results;
  }
  /**
   * Creates a skip time for the specified anime episode.
   * @param {number} malId MAL ID
   * @param {number} episodeNumber Episode number of the anime
   * @param {Object} data Skip time data
   * @param {SkipTypes} data.skipType Type of skip time
   * @param {number} data.startTime Start time of the skip in seconds with max 3 digit after the decimal point
   * @param {number} data.endTime End time of the skip in seconds with max 3 digit after the decimal point
   * @param {number} data.episodeLength Length of the episode in seconds with max 3 digit after the decimal point
   * @example
   * aniskip.createSkipTime(malId, episodeNumber, data)
   *  .then(data => console.log(data))
   *  .catch(response => console.error(response))
   * @returns {Promise}
   */
  createSkipTime(malId, episodeNumber, data) {
    if (!this.userId)
      throw new Error('UserID must be set');
    const parsedData = {
      ...{ 'providerName': this.providerName, 'submitterId': this.userId },
      ...data
    };
    return this.__request({
      url: '/skip-times/' + malId + '/' + episodeNumber,
      method: 'POST',
      body: JSON.stringify(parsedData)
    });
  }
  /**
   * Vote on a skip time.
   * @param {VoteType} voteType Type of the vote
   * @param {string} skipId UUID of the Skip Time
   * @example
   * aniskip.vote(voteType, skipId)
   *  .then(data => console.log(data))
   *  .catch(response => console.error(response))
   * @returns {Promise}
   */
  vote(voteType, skipId) {
    return this.__request({
      url: '/skip-times/vote/' + skipId,
      method: 'POST',
      body: JSON.stringify({ 'voteType': voteType })
    });
  }
  /**
   * Up vote on a skip time.
   * @param {string} skipId UUID of the Skip Time
   * @example
   * aniskip.upvote(skipId)
   *  .then(data => console.log(data))
   *  .catch(response => console.error(response))
   * @returns {Promise}
   */
  upvote(skipId) {
    return this.vote('upvote', skipId);
  }
  /**
   * Down vote on a skip time.
   * @param {string} skipId UUID of the Skip Time
   * @example
   * aniskip.downvote(skipId)
   *  .then(data => console.log(data))
   *  .catch(response => console.error(response))
   * @returns {Promise}
   */
  downvote(skipId) {
    return this.vote('downvote', skipId);
  }
  async __request(options = {}) {
    const config = {
      ...{ headers: { 'Content-Type': 'application/json' } },
      ...options
    };
    const response = await fetch(this.baseUrl + options.url, config);
    return await response.json();
  }
}
