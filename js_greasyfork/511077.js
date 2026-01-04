// ==UserScript==
// @name         carrot-script
// @namespace    https://greasyfork.org/zh-CN/users/1182955
// @version      0.1.1
// @author       meooow25 & RimuruChan
// @description  Predicts Codeforces rating changes, original by meooow25 (https://github.com/meooow25/carrot), ported to Tampermonkey by RimuruChan
// @license      MIT
// @icon         https://aowuucdn.oss-accelerate.aliyuncs.com/codeforces.png
// @homepageURL  https://github.com/RimuruChan/carrot-userscript
// @match        https://codeforces.com/*
// @grant        GM.deleteValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/511077/carrot-script.user.js
// @updateURL https://update.greasyfork.org/scripts/511077/carrot-script.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  class Api {
    constructor(fetchFromContentScript2) {
      __publicField(this, "fetchFromContentScript");
      this.fetchFromContentScript = fetchFromContentScript2;
    }
    async fetch(path, queryParams) {
      let queryParamList = [];
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== void 0) {
          queryParamList.push([key, value]);
        }
      }
      return await this.fetchFromContentScript(path, queryParamList);
    }
    async contestList(gym = void 0) {
      return await this.fetch("contest.list", { gym });
    }
    async contestStandings(contestId, from = void 0, count = void 0, handles = void 0, room = void 0, showUnofficial = void 0) {
      return await this.fetch("contest.standings", {
        contestId,
        from,
        count,
        handles: handles && handles.length ? handles.join(";") : void 0,
        room,
        showUnofficial
      });
    }
    async contestRatingChanges(contestId) {
      return await this.fetch("contest.ratingChanges", { contestId });
    }
    async userRatedList(activeOnly = false) {
      return await this.fetch("user.ratedList", { activeOnly });
    }
  }
  class FFTConv {
    constructor(n) {
      __publicField(this, "n");
      __publicField(this, "wr");
      __publicField(this, "wi");
      __publicField(this, "rev");
      let k = 1;
      while (1 << k < n) {
        k++;
      }
      this.n = 1 << k;
      const n2 = this.n >> 1;
      this.wr = [];
      this.wi = [];
      const ang = 2 * Math.PI / this.n;
      for (let i = 0; i < n2; i++) {
        this.wr[i] = Math.cos(i * ang);
        this.wi[i] = Math.sin(i * ang);
      }
      this.rev = [0];
      for (let i = 1; i < this.n; i++) {
        this.rev[i] = this.rev[i >> 1] >> 1 | (i & 1) << k - 1;
      }
    }
    reverse(a) {
      for (let i = 1; i < this.n; i++) {
        if (i < this.rev[i]) {
          const tmp = a[i];
          a[i] = a[this.rev[i]];
          a[this.rev[i]] = tmp;
        }
      }
    }
    transform(ar, ai) {
      this.reverse(ar);
      this.reverse(ai);
      const wr = this.wr;
      const wi = this.wi;
      for (let len = 2; len <= this.n; len <<= 1) {
        const half = len >> 1;
        const diff = this.n / len;
        for (let i = 0; i < this.n; i += len) {
          let pw = 0;
          for (let j = i; j < i + half; j++) {
            const k = j + half;
            const vr = ar[k] * wr[pw] - ai[k] * wi[pw];
            const vi = ar[k] * wi[pw] + ai[k] * wr[pw];
            ar[k] = ar[j] - vr;
            ai[k] = ai[j] - vi;
            ar[j] += vr;
            ai[j] += vi;
            pw += diff;
          }
        }
      }
    }
    convolve(a, b) {
      if (a.length === 0 || b.length === 0) {
        return [];
      }
      const n = this.n;
      const resLen = a.length + b.length - 1;
      if (resLen > n) {
        throw new Error(
          `a.length + b.length - 1 is ${a.length} + ${b.length} - 1 = ${resLen}, expected <= ${n}`
        );
      }
      const cr = new Array(n).fill(0);
      const ci = new Array(n).fill(0);
      cr.splice(0, a.length, ...a);
      ci.splice(0, b.length, ...b);
      this.transform(cr, ci);
      cr[0] = 4 * cr[0] * ci[0];
      ci[0] = 0;
      for (let i = 1, j = n - 1; i <= j; i++, j--) {
        const ar = cr[i] + cr[j];
        const ai = ci[i] - ci[j];
        const br = ci[j] + ci[i];
        const bi = cr[j] - cr[i];
        cr[i] = ar * br - ai * bi;
        ci[i] = ar * bi + ai * br;
        cr[j] = cr[i];
        ci[j] = -ci[i];
      }
      this.transform(cr, ci);
      const res = [];
      res[0] = cr[0] / (4 * n);
      for (let i = 1, j = n - 1; i <= j; i++, j--) {
        res[i] = cr[j] / (4 * n);
        res[j] = cr[i] / (4 * n);
      }
      res.splice(resLen);
      return res;
    }
  }
  function binarySearch(left, right, predicate) {
    if (left > right) {
      throw new Error(`left ${left} must be <= right ${right}`);
    }
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (predicate(mid)) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    return left;
  }
  const DEFAULT_RATING = 1400;
  class Contestant {
    constructor(handle, points, penalty, rating) {
      __publicField(this, "handle");
      __publicField(this, "points");
      __publicField(this, "penalty");
      __publicField(this, "rating");
      __publicField(this, "effectiveRating");
      __publicField(this, "rank");
      __publicField(this, "delta");
      __publicField(this, "performance");
      this.handle = handle;
      this.points = points;
      this.penalty = penalty;
      this.rating = rating;
      this.effectiveRating = rating == null ? DEFAULT_RATING : rating;
      this.rank = null;
      this.delta = null;
      this.performance = null;
    }
  }
  class PredictResult {
    constructor(handle, rating, delta, performance2) {
      __publicField(this, "handle");
      __publicField(this, "rating");
      __publicField(this, "delta");
      __publicField(this, "performance");
      this.handle = handle;
      this.rating = rating;
      this.delta = delta;
      this.performance = performance2;
    }
    get effectiveRating() {
      return this.rating == null ? DEFAULT_RATING : this.rating;
    }
  }
  const MAX_RATING_LIMIT = 6e3;
  const MIN_RATING_LIMIT = -500;
  const RATING_RANGE_LEN = MAX_RATING_LIMIT - MIN_RATING_LIMIT;
  const ELO_OFFSET = RATING_RANGE_LEN;
  const RATING_OFFSET = -MIN_RATING_LIMIT;
  const ELO_WIN_PROB = new Array(2 * RATING_RANGE_LEN + 1);
  for (let i = -RATING_RANGE_LEN; i <= RATING_RANGE_LEN; i++) {
    ELO_WIN_PROB[i + ELO_OFFSET] = 1 / (1 + Math.pow(10, i / 400));
  }
  const fftConv = new FFTConv(ELO_WIN_PROB.length + RATING_RANGE_LEN - 1);
  class RatingCalculator {
    constructor(contestants) {
      __publicField(this, "contestants");
      __publicField(this, "seed");
      __publicField(this, "adjustment");
      this.contestants = contestants;
      this.seed = null;
      this.adjustment = null;
    }
    calculateDeltas(calcPerfs = false) {
      performance.now();
      this.calcSeed();
      this.reassignRanks();
      this.calcDeltas();
      this.adjustDeltas();
      if (calcPerfs) {
        this.calcPerfs();
      }
      performance.now();
    }
    calcSeed() {
      const counts = new Array(RATING_RANGE_LEN).fill(0);
      for (const c of this.contestants) {
        counts[c.effectiveRating + RATING_OFFSET] += 1;
      }
      this.seed = fftConv.convolve(ELO_WIN_PROB, counts);
      for (let i = 0; i < this.seed.length; i++) {
        this.seed[i] += 1;
      }
    }
    getSeed(r, exclude) {
      return this.seed[r + ELO_OFFSET + RATING_OFFSET] - ELO_WIN_PROB[r - exclude + ELO_OFFSET];
    }
    reassignRanks() {
      this.contestants.sort(
        (a, b) => a.points !== b.points ? b.points - a.points : a.penalty - b.penalty
      );
      let lastPoints, lastPenalty, rank;
      for (let i = this.contestants.length - 1; i >= 0; i--) {
        const c = this.contestants[i];
        if (c.points !== lastPoints || c.penalty !== lastPenalty) {
          lastPoints = c.points;
          lastPenalty = c.penalty;
          rank = i + 1;
        }
        c.rank = rank;
      }
    }
    calcDelta(contestant, assumedRating) {
      const c = contestant;
      const seed = this.getSeed(assumedRating, c.effectiveRating);
      const midRank = Math.sqrt(c.rank * seed);
      const needRating = this.rankToRating(midRank, c.effectiveRating);
      const delta = Math.trunc((needRating - assumedRating) / 2);
      return delta;
    }
    calcDeltas() {
      for (const c of this.contestants) {
        c.delta = this.calcDelta(c, c.effectiveRating);
      }
    }
    rankToRating(rank, selfRating) {
      return binarySearch(
        2,
        MAX_RATING_LIMIT,
        (rating) => this.getSeed(rating, selfRating) < rank
      ) - 1;
    }
    adjustDeltas() {
      this.contestants.sort((a, b) => b.effectiveRating - a.effectiveRating);
      const n = this.contestants.length;
      {
        const deltaSum = this.contestants.reduce((a, b) => a + b.delta, 0);
        const inc = Math.trunc(-deltaSum / n) - 1;
        this.adjustment = inc;
        for (const c of this.contestants) {
          c.delta += inc;
        }
      }
      {
        const zeroSumCount = Math.min(4 * Math.round(Math.sqrt(n)), n);
        const deltaSum = this.contestants.slice(0, zeroSumCount).reduce((a, b) => a + b.delta, 0);
        const inc = Math.min(Math.max(Math.trunc(-deltaSum / zeroSumCount), -10), 0);
        this.adjustment += inc;
        for (const c of this.contestants) {
          c.delta += inc;
        }
      }
    }
    calcPerfs() {
      for (const c of this.contestants) {
        if (c.rank === 1) {
          c.performance = Infinity;
        } else {
          c.performance = binarySearch(
            MIN_RATING_LIMIT,
            MAX_RATING_LIMIT,
            (assumedRating) => this.calcDelta(c, assumedRating) + this.adjustment <= 0
          );
        }
      }
    }
  }
  function predict$1(contestants, calcPerfs = false) {
    new RatingCalculator(contestants).calculateDeltas(calcPerfs);
    return contestants.map((c) => new PredictResult(c.handle, c.rating, c.delta, c.performance));
  }
  const _Rank = class _Rank {
    constructor(name, abbr, low, high, colorClass) {
      __publicField(this, "name");
      __publicField(this, "abbr");
      __publicField(this, "low");
      __publicField(this, "high");
      __publicField(this, "colorClass");
      this.name = name;
      this.abbr = abbr;
      this.low = low;
      this.high = high;
      this.colorClass = colorClass;
    }
    static forRating(rating) {
      if (rating == null) {
        return _Rank.UNRATED;
      }
      for (const rank of _Rank.RATED) {
        if (rating < rank.high) {
          return rank;
        }
      }
      return _Rank.RATED[_Rank.RATED.length - 1];
    }
  };
  __publicField(_Rank, "UNRATED");
  __publicField(_Rank, "RATED");
  let Rank = _Rank;
  Rank.UNRATED = new Rank("Unrated", "U", -Infinity, null, null);
  Rank.RATED = [
    new Rank("Newbie", "N", -Infinity, 1200, "user-gray"),
    new Rank("Pupil", "P", 1200, 1400, "user-green"),
    new Rank("Specialist", "S", 1400, 1600, "user-cyan"),
    new Rank("Expert", "E", 1600, 1900, "user-blue"),
    new Rank("Candidate Master", "CM", 1900, 2100, "user-violet"),
    new Rank("Master", "M", 2100, 2300, "user-orange"),
    new Rank("International Master", "IM", 2300, 2400, "user-orange"),
    new Rank("Grandmaster", "GM", 2400, 2600, "user-red"),
    new Rank("International Grandmaster", "IGM", 2600, 3e3, "user-red"),
    new Rank("Legendary Grandmaster", "LGM", 3e3, 4e3, "user-legendary"),
    new Rank("Tourist", "T", 4e3, Infinity, "user-4000")
  ];
  class PredictResponseRow {
    constructor(delta, rank, performance2, newRank, deltaReqForRankUp, nextRank) {
      __publicField(this, "delta");
      __publicField(this, "rank");
      __publicField(this, "performance");
      // For FINAL
      __publicField(this, "newRank");
      // For PREDICTED
      __publicField(this, "deltaReqForRankUp");
      __publicField(this, "nextRank");
      this.delta = delta;
      this.rank = rank;
      this.performance = performance2;
      this.newRank = newRank;
      this.deltaReqForRankUp = deltaReqForRankUp;
      this.nextRank = nextRank;
    }
  }
  const _PredictResponse = class _PredictResponse {
    constructor(predictResults, type, fetchTime) {
      __publicField(this, "rowMap");
      __publicField(this, "type");
      __publicField(this, "fetchTime");
      _PredictResponse.assertTypeOk(type);
      this.rowMap = {};
      this.type = type;
      this.fetchTime = fetchTime;
      this.populateMap(predictResults);
    }
    populateMap(predictResults) {
      for (const result of predictResults) {
        let rank, newRank, deltaReqForRankUp, nextRank;
        switch (this.type) {
          case _PredictResponse.TYPE_PREDICTED:
            rank = Rank.forRating(result.rating);
            const effectiveRank = Rank.forRating(result.effectiveRating);
            deltaReqForRankUp = effectiveRank.high - result.effectiveRating;
            nextRank = Rank.RATED[Rank.RATED.indexOf(effectiveRank) + 1] || null;
            break;
          case _PredictResponse.TYPE_FINAL:
            rank = Rank.forRating(result.rating);
            newRank = Rank.forRating(result.effectiveRating + result.delta);
            break;
          default:
            throw new Error("Unknown prediction type");
        }
        const performance2 = {
          value: result.performance === Infinity ? "Infinity" : result.performance,
          colorClass: Rank.forRating(result.performance).colorClass
        };
        this.rowMap[result.handle] = new PredictResponseRow(
          result.delta,
          rank,
          performance2,
          newRank,
          deltaReqForRankUp,
          nextRank
        );
      }
    }
    static assertTypeOk(type) {
      if (!_PredictResponse.TYPES.includes(type)) {
        throw new Error("Unknown prediction type: " + type);
      }
    }
  };
  __publicField(_PredictResponse, "TYPE_PREDICTED", "PREDICTED");
  __publicField(_PredictResponse, "TYPE_FINAL", "FINAL");
  __publicField(_PredictResponse, "TYPES", [_PredictResponse.TYPE_PREDICTED, _PredictResponse.TYPE_FINAL]);
  let PredictResponse = _PredictResponse;
  class Lock {
    constructor() {
      __publicField(this, "queue");
      __publicField(this, "locked");
      this.queue = [];
      this.locked = false;
    }
    async acquire() {
      if (this.locked) {
        await new Promise((resolve) => {
          this.queue.push(resolve);
        });
      }
      this.locked = true;
    }
    release() {
      if (!this.locked) {
        throw new Error("The lock must be acquired before release");
      }
      this.locked = false;
      if (this.queue.length) {
        const resolve = this.queue.shift();
        resolve();
      }
    }
    async execute(asyncFunc) {
      await this.acquire();
      try {
        return await asyncFunc();
      } finally {
        this.release();
      }
    }
  }
  const REFRESH_INTERVAL = 6 * 60 * 60 * 1e3;
  const CONTESTS$1 = "cache.contests";
  const CONTESTS_TIMESTAMP = "cache.contests.timestamp";
  class Contests {
    constructor(api, storage) {
      __publicField(this, "api");
      __publicField(this, "storage");
      __publicField(this, "lock");
      this.api = api;
      this.storage = storage;
      this.lock = new Lock();
    }
    async getLastAttemptTime() {
      return await this.storage.get(CONTESTS_TIMESTAMP, 0);
    }
    async setLastAttemptTime(time) {
      await this.storage.set(CONTESTS_TIMESTAMP, time);
    }
    async getContestMap() {
      let res = await this.storage.get(CONTESTS$1, {});
      res = new Map(Object.entries(res).map(([k, v]) => [parseInt(k), v]));
      return res;
    }
    async setContestMap(contestMap) {
      const obj = Object.fromEntries(contestMap);
      await this.storage.set(CONTESTS$1, obj);
    }
    async maybeRefreshCache() {
      const inner = async () => {
        const now = Date.now();
        const refresh = now - await this.getLastAttemptTime() > REFRESH_INTERVAL;
        if (!refresh) {
          return;
        }
        await this.setLastAttemptTime(now);
        try {
          const contests = await this.api.contestList();
          await this.setContestMap(new Map(contests.map((c) => [c.id, c])));
        } catch (er) {
          console.warn("Unable to fetch contest list: " + er);
        }
      };
      await this.lock.execute(inner);
    }
    async list() {
      return Array.from((await this.getContestMap()).values());
    }
    async hasCached(contestId) {
      return (await this.getContestMap()).has(contestId);
    }
    async getCached(contestId) {
      return (await this.getContestMap()).get(contestId);
    }
    async update(contest) {
      const contestMap = await this.getContestMap();
      contestMap.set(contest.id, contest);
      await this.setContestMap(contestMap);
    }
  }
  const PREFETCH_INTERVAL = 60 * 60 * 1e3;
  const RATINGS_TIMESTAMP = "cache.ratings.timestamp";
  const RATINGS$1 = "cache.ratings";
  class Ratings {
    constructor(api, storage) {
      __publicField(this, "api");
      __publicField(this, "storage");
      __publicField(this, "lock");
      this.api = api;
      this.storage = storage;
      this.lock = new Lock();
    }
    async maybeRefreshCache(contestStartMs) {
      const inner = async () => {
        const timeLeft = contestStartMs - Date.now();
        if (timeLeft > PREFETCH_INTERVAL) {
          return;
        }
        const timeLeftAfterLastFetch = contestStartMs - await this.storage.get(RATINGS_TIMESTAMP, 0);
        if (timeLeftAfterLastFetch > PREFETCH_INTERVAL) {
          await this.cacheRatings();
        }
      };
      await this.lock.execute(inner);
    }
    async fetchCurrentRatings(contestStartMs) {
      if (Date.now() < contestStartMs) {
        throw new Error("getCurrentRatings should be called after contest start");
      }
      await this.maybeRefreshCache(contestStartMs);
      const ratings = await this.storage.get(RATINGS$1);
      return new Map(Object.entries(ratings));
    }
    async cacheRatings() {
      const users = await this.api.userRatedList(false);
      const ratings = Object.fromEntries(users.map((u) => [u.handle, u.rating]));
      await this.storage.set(RATINGS$1, ratings);
      await this.storage.set(RATINGS_TIMESTAMP, Date.now());
    }
  }
  const _Contest = class _Contest {
    constructor(contest, problems, rows, ratingChanges, oldRatings, fetchTime, isRated) {
      __publicField(this, "contest");
      __publicField(this, "problems");
      __publicField(this, "rows");
      __publicField(this, "ratingChanges");
      __publicField(this, "oldRatings");
      __publicField(this, "performances");
      __publicField(this, "fetchTime");
      __publicField(this, "isRated");
      __publicField(this, "startTimeSeconds");
      __publicField(this, "durationSeconds");
      this.contest = contest;
      this.problems = problems;
      this.rows = rows;
      this.ratingChanges = ratingChanges;
      this.oldRatings = oldRatings;
      this.fetchTime = fetchTime;
      this.isRated = isRated;
      this.performances = null;
      this.startTimeSeconds = 0;
      this.durationSeconds = 0;
    }
    toPlainObject() {
      return {
        contest: this.contest,
        problems: this.problems,
        rows: this.rows,
        ratingChanges: this.ratingChanges,
        oldRatings: Array.from(this.oldRatings),
        fetchTime: this.fetchTime,
        isRated: this.isRated
      };
    }
    static fromPlainObject(obj) {
      const c = new _Contest(
        obj.contest,
        obj.problems,
        obj.rows,
        obj.ratingChanges,
        new Map(obj.oldRatings),
        obj.fetchTime,
        obj.isRated
      );
      return c;
    }
  };
  __publicField(_Contest, "IsRated", {
    YES: "YES",
    NO: "NO",
    LIKELY: "LIKELY"
  });
  let Contest = _Contest;
  const MAGIC_CACHE_DURATION = 5 * 60 * 1e3;
  const RATING_PENDING_MAX_DAYS = 3;
  function isOldContest(contest) {
    const daysSinceContestEnd = (Date.now() / 1e3 - contest.startTimeSeconds - contest.durationSeconds) / (60 * 60 * 24);
    return daysSinceContestEnd > RATING_PENDING_MAX_DAYS;
  }
  function isMagicOn() {
    let now = /* @__PURE__ */ new Date();
    return now.getMonth() === 11 && now.getDate() >= 24 || now.getMonth() === 0 && now.getDate() <= 11;
  }
  const MAX_FINISHED_CONTESTS_TO_CACHE = 5;
  const CONTESTS_COMPLETE$1 = "cache.contests_complete";
  const CONTESTS_COMPLETE_IDS = "cache.contests_complete.ids";
  const CONTESTS_COMPLETE_TIMESTAMP = "cache.contests_complete.timestamp";
  class ContestsComplete {
    constructor(api, storage) {
      __publicField(this, "api");
      __publicField(this, "storage");
      this.api = api;
      this.storage = storage;
    }
    async getContests() {
      let res = await this.storage.get(CONTESTS_COMPLETE$1, {});
      res = new Map(Object.entries(res).map(([k, v]) => [parseInt(k), Contest.fromPlainObject(v)]));
      return res;
    }
    async setContests(contests) {
      const obj = Object.fromEntries([...contests.entries()].map(([k, v]) => [k, v.toPlainObject()]));
      await this.storage.set(CONTESTS_COMPLETE$1, obj);
    }
    async getContestIds() {
      return await this.storage.get(CONTESTS_COMPLETE_IDS, []);
    }
    async setContestIds(contestIds) {
      await this.storage.set(CONTESTS_COMPLETE_IDS, contestIds);
    }
    async getContestTimestamp() {
      let res = await this.storage.get(CONTESTS_COMPLETE_TIMESTAMP, {});
      res = new Map(Object.entries(res));
      return res;
    }
    async setContestTimestamp(contestTimestamp) {
      const obj = Object.fromEntries(contestTimestamp);
      await this.storage.set(CONTESTS_COMPLETE_TIMESTAMP, obj);
    }
    async fetch(contestId) {
      const cachedContests = await this.getContests();
      if (cachedContests.has(contestId)) {
        console.log("Returning cached contest");
        return cachedContests.get(contestId);
      }
      const { contest, problems, rows } = await this.api.contestStandings(contestId);
      let ratingChanges;
      let oldRatings;
      let isRated = Contest.IsRated.LIKELY;
      if (contest.phase === "FINISHED") {
        try {
          ratingChanges = await this.api.contestRatingChanges(contestId);
          if (ratingChanges) {
            if (ratingChanges.length > 0) {
              isRated = Contest.IsRated.YES;
              oldRatings = adjustOldRatings(contestId, ratingChanges);
            } else {
              ratingChanges = void 0;
            }
          }
        } catch (er) {
          if (er.message.includes("Rating changes are unavailable for this contest")) {
            isRated = Contest.IsRated.NO;
          }
        }
      }
      if (isRated === Contest.IsRated.LIKELY && isOldContest(contest)) {
        isRated = Contest.IsRated.NO;
      }
      const isFinished = isRated === Contest.IsRated.NO || isRated === Contest.IsRated.YES;
      const c = new Contest(contest, problems, rows, ratingChanges, oldRatings, Date.now(), isRated);
      if (isFinished) {
        const contests = await this.getContests();
        contests.set(contestId, c);
        let contestIds = await this.getContestIds();
        contestIds.push(contestId);
        while (contestIds.length > MAX_FINISHED_CONTESTS_TO_CACHE) {
          contests.delete(contestIds.shift());
        }
        if (isMagicOn()) {
          const contestTimestamp = await this.getContestTimestamp();
          for (const [cid, timestamp] of contestTimestamp) {
            if (Date.now() - timestamp > MAGIC_CACHE_DURATION) {
              contestTimestamp.delete(cid);
              contests.delete(cid);
              contestIds = contestIds.filter((c2) => c2 !== cid);
            }
          }
          contestTimestamp.set(contestId, Date.now());
          await this.setContestTimestamp(contestTimestamp);
        }
        await this.setContests(contests);
        await this.setContestIds(contestIds);
      }
      return c;
    }
  }
  const FAKE_RATINGS_SINCE_CONTEST = 1360;
  const NEW_DEFAULT_RATING = 1400;
  function adjustOldRatings(contestId, ratingChanges) {
    const oldRatings = /* @__PURE__ */ new Map();
    if (contestId < FAKE_RATINGS_SINCE_CONTEST) {
      for (const change of ratingChanges) {
        oldRatings.set(change.handle, change.oldRating);
      }
    } else {
      for (const change of ratingChanges) {
        oldRatings.set(change.handle, change.oldRating == 0 ? NEW_DEFAULT_RATING : change.oldRating);
      }
    }
    return oldRatings;
  }
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  class StorageWrapper {
    constructor(storageName) {
      __publicField(this, "storageName");
      this.storageName = storageName;
    }
    async get(key, defaultValue = void 0) {
      return await _GM_getValue(`${this.storageName}.${key}`, defaultValue);
    }
    async set(key, value) {
      return await _GM_setValue(`${this.storageName}.${key}`, value);
    }
  }
  const LOCAL = new StorageWrapper("LOCAL");
  const SYNC = new StorageWrapper("SYNC");
  function boolSetterGetter(key, defaultValue) {
    return async (value) => {
      if (value === void 0) {
        return await SYNC.get(key, defaultValue);
      }
      return await SYNC.set(key, value);
    };
  }
  const enablePredictDeltas = boolSetterGetter("settings.enablePredictDeltas", true);
  const enableFinalDeltas = boolSetterGetter("settings.enableFetchDeltas", true);
  const enablePrefetchRatings = boolSetterGetter("settings.enablePrefetchRatings", true);
  const showColCurrentPerformance = boolSetterGetter("settings.showColCurrentPerformance", true);
  const showColPredictedDelta = boolSetterGetter("settings.showColPredictedDelta", true);
  const showColRankUpDelta = boolSetterGetter("settings.showColRankUpDelta", true);
  const showColFinalPerformance = boolSetterGetter("settings.showColFinalPerformance", true);
  const showColFinalDelta = boolSetterGetter("settings.showColFinalDelta", true);
  const showColRankChange = boolSetterGetter("settings.showColRankChange", true);
  async function getPrefs() {
    return {
      enablePredictDeltas: await enablePredictDeltas(),
      enableFinalDeltas: await enableFinalDeltas(),
      enablePrefetchRatings: await enablePrefetchRatings(),
      showColCurrentPerformance: await showColCurrentPerformance(),
      showColPredictedDelta: await showColPredictedDelta(),
      showColRankUpDelta: await showColRankUpDelta(),
      showColFinalPerformance: await showColFinalPerformance(),
      showColFinalDelta: await showColFinalDelta(),
      showColRankChange: await showColRankChange()
    };
  }
  const UNRATED_HINTS = ["unrated", "fools", "q#", "kotlin", "marathon", "teams"];
  const EDU_ROUND_RATED_THRESHOLD = 2100;
  const API = new Api(fetchFromContentScript);
  const CONTESTS = new Contests(API, LOCAL);
  const RATINGS = new Ratings(API, LOCAL);
  const CONTESTS_COMPLETE = new ContestsComplete(API, LOCAL);
  const API_PATH = "/api/";
  async function fetchFromContentScript(path, queryParamList) {
    const url = new URL(location.origin + API_PATH + path);
    for (const [key, value] of queryParamList) {
      url.searchParams.append(key, value);
    }
    const resp = await fetch(url);
    const text = await resp.text();
    if (resp.status !== 200) {
      throw new Error(`CF API: HTTP error ${resp.status}: ${text}`);
    }
    let json;
    try {
      json = JSON.parse(text);
    } catch (_) {
      throw new Error(`CF API: Invalid JSON: ${text}`);
    }
    if (json.status !== "OK" || json.result === void 0) {
      throw new Error(`CF API: Error: ${text}`);
    }
    return json.result;
  }
  function isUnratedByName(contestName) {
    const lower = contestName.toLowerCase();
    return UNRATED_HINTS.some((hint) => lower.includes(hint));
  }
  function anyRowHasTeam(rows) {
    return rows.some((row) => row.party.teamId != null || row.party.teamName != null);
  }
  async function getDeltas(contestId) {
    const prefs = await getPrefs();
    return await calcDeltas(contestId, prefs);
  }
  async function calcDeltas(contestId, prefs) {
    if (!prefs.enablePredictDeltas && !prefs.enableFinalDeltas) {
      return { result: "DISABLED" };
    }
    if (await CONTESTS.hasCached(contestId)) {
      const contest2 = await CONTESTS.getCached(contestId);
      if (isUnratedByName(contest2.name)) {
        return { result: "UNRATED_CONTEST" };
      }
    }
    const contest = await CONTESTS_COMPLETE.fetch(contestId);
    CONTESTS.update(contest.contest);
    if (contest.isRated === Contest.IsRated.NO) {
      return { result: "UNRATED_CONTEST" };
    }
    if (contest.isRated === Contest.IsRated.YES) {
      if (!prefs.enableFinalDeltas) {
        return { result: "DISABLED" };
      }
      return {
        result: "OK",
        prefs,
        predictResponse: getFinal(contest)
      };
    }
    if (isUnratedByName(contest.contest.name)) {
      return { result: "UNRATED_CONTEST" };
    }
    if (anyRowHasTeam(contest.rows)) {
      return { result: "UNRATED_CONTEST" };
    }
    if (!prefs.enablePredictDeltas) {
      return { result: "DISABLED" };
    }
    return {
      result: "OK",
      prefs,
      predictResponse: await getPredicted(contest)
    };
  }
  function predictForRows(rows, ratingBeforeContest) {
    const contestants = rows.map((row) => {
      const handle = row.party.members[0].handle;
      return new Contestant(handle, row.points, row.penalty, ratingBeforeContest.get(handle) ?? null);
    });
    return predict$1(contestants, true);
  }
  function getFinal(contest) {
    if (contest.performances === null) {
      const ratingBeforeContest = new Map(
        contest.ratingChanges.map((c) => [c.handle, contest.oldRatings.get(c.handle)])
      );
      const rows = contest.rows.filter((row) => {
        const handle = row.party.members[0].handle;
        return ratingBeforeContest.has(handle);
      });
      const predictResultsForPerf = predictForRows(rows, ratingBeforeContest);
      contest.performances = new Map(predictResultsForPerf.map((r) => [r.handle, r.performance]));
    }
    const predictResults = [];
    for (const change of contest.ratingChanges) {
      predictResults.push(
        new PredictResult(
          change.handle,
          change.oldRating,
          change.newRating - change.oldRating,
          contest.performances.get(change.handle)
        )
      );
    }
    return new PredictResponse(predictResults, PredictResponse.TYPE_FINAL, contest.fetchTime);
  }
  async function getPredicted(contest) {
    const ratingMap = await RATINGS.fetchCurrentRatings(contest.contest.startTimeSeconds * 1e3);
    const isEduRound = contest.contest.name.toLowerCase().includes("educational");
    let rows = contest.rows;
    if (isEduRound) {
      rows = contest.rows.filter((row) => {
        const handle = row.party.members[0].handle;
        return !ratingMap.has(handle) || ratingMap.get(handle) < EDU_ROUND_RATED_THRESHOLD;
      });
    }
    const predictResults = predictForRows(rows, ratingMap);
    return new PredictResponse(predictResults, PredictResponse.TYPE_PREDICTED, contest.fetchTime);
  }
  async function predictDeltas(contestId) {
    return await getDeltas(contestId);
  }
  async function maybeUpdateContestList() {
    const prefs = await getPrefs();
    if (!prefs.enablePredictDeltas && !prefs.enableFinalDeltas) {
      return;
    }
    await CONTESTS.maybeRefreshCache();
  }
  async function getNearestUpcomingRatedContestStartTime() {
    let nearest = null;
    const now = Date.now();
    for (const c of await CONTESTS.list()) {
      const start = (c.startTimeSeconds || 0) * 1e3;
      if (start < now || isUnratedByName(c.name)) {
        continue;
      }
      if (nearest === null || start < nearest) {
        nearest = start;
      }
    }
    return nearest;
  }
  async function maybeUpdateRatings() {
    const prefs = await getPrefs();
    if (!prefs.enablePredictDeltas || !prefs.enablePrefetchRatings) {
      return;
    }
    const startTimeMs = await getNearestUpcomingRatedContestStartTime();
    if (startTimeMs !== null) {
      await RATINGS.maybeRefreshCache(startTimeMs);
    }
  }
  const contentCss = ".carrot-display-none {\n  display: none;\n}\n";
  const PING_INTERVAL = 3 * 60 * 1e3;
  const PREDICT_TEXT_ID = "carrot-predict-text";
  const DISPLAY_NONE_CLS = "carrot-display-none";
  const Unicode = {
    BLACK_CURVED_RIGHTWARDS_AND_UPWARDS_ARROW: "⮭",
    GREEK_CAPITAL_DELTA: "Δ",
    GREEK_CAPITAL_PI: "Π",
    INFINITY: "∞",
    SLANTED_NORTH_ARROW_WITH_HORIZONTAL_TAIL: "⭜",
    BACKSLANTED_SOUTH_ARROW_WITH_HORIZONTAL_TAIL: "⭝"
  };
  const PREDICT_COLUMNS = [
    {
      text: "current performance",
      id: "carrot-current-performance",
      setting: "showColCurrentPerformance"
    },
    {
      text: "predicted delta",
      id: "carrot-predicted-delta",
      setting: "showColPredictedDelta"
    },
    {
      text: "delta required to rank up",
      id: "carrot-rank-up-delta",
      setting: "showColRankUpDelta"
    }
  ];
  const FINAL_COLUMNS = [
    {
      text: "final performance",
      id: "carrot-final-performance",
      setting: "showColFinalPerformance"
    },
    {
      text: "final delta",
      id: "carrot-final-delta",
      setting: "showColFinalDelta"
    },
    {
      text: "rank change",
      id: "carrot-rank-change",
      setting: "showColRankChange"
    }
  ];
  const ALL_COLUMNS = PREDICT_COLUMNS.concat(FINAL_COLUMNS);
  function makeGreySpan(text, title) {
    const span = document.createElement("span");
    span.style.fontWeight = "bold";
    span.style.color = "lightgrey";
    span.textContent = text;
    if (title) {
      span.title = title;
    }
    span.classList.add("small");
    return span;
  }
  function makePerformanceSpan(performance2) {
    const span = document.createElement("span");
    if (performance2.value === "Infinity") {
      span.textContent = Unicode.INFINITY;
    } else {
      span.textContent = performance2.value;
      span.classList.add(performance2.colorClass);
    }
    span.style.fontWeight = "bold";
    span.style.display = "inline-block";
    return span;
  }
  function makeRankSpan(rank) {
    const span = document.createElement("span");
    if (rank.colorClass) {
      span.classList.add(rank.colorClass);
    }
    span.style.verticalAlign = "middle";
    span.textContent = rank.abbr;
    span.title = rank.name;
    span.style.display = "inline-block";
    return span;
  }
  function makeArrowSpan(arrow) {
    const span = document.createElement("span");
    span.classList.add("small");
    span.style.verticalAlign = "middle";
    span.style.paddingLeft = "0.5em";
    span.style.paddingRight = "0.5em";
    span.textContent = arrow;
    return span;
  }
  function makeDeltaSpan(delta) {
    const span = document.createElement("span");
    span.style.fontWeight = "bold";
    span.style.verticalAlign = "middle";
    if (delta > 0) {
      span.style.color = "green";
      span.textContent = `+${delta}`;
    } else {
      span.style.color = "gray";
      span.textContent = delta.toString();
    }
    return span;
  }
  function makeFinalRankUpSpan(rank, newRank, arrow) {
    const span = document.createElement("span");
    span.style.fontWeight = "bold";
    span.appendChild(makeRankSpan(rank));
    span.appendChild(makeArrowSpan(arrow));
    span.appendChild(makeRankSpan(newRank));
    return span;
  }
  function makePredictedRankUpSpan(rank, deltaReqForRankUp, nextRank) {
    const span = document.createElement("span");
    span.style.fontWeight = "bold";
    if (nextRank === null) {
      span.appendChild(makeRankSpan(rank));
      return span;
    }
    span.appendChild(makeDeltaSpan(deltaReqForRankUp));
    span.appendChild(makeArrowSpan(Unicode.SLANTED_NORTH_ARROW_WITH_HORIZONTAL_TAIL));
    span.appendChild(makeRankSpan(nextRank));
    return span;
  }
  function makePerfHeaderCell() {
    const cell = document.createElement("th");
    cell.classList.add("top");
    cell.style.width = "4em";
    {
      const span = document.createElement("span");
      span.textContent = Unicode.GREEK_CAPITAL_PI;
      span.title = "Performance";
      cell.appendChild(span);
    }
    return cell;
  }
  function makeDeltaHeaderCell(deltaColTitle) {
    const cell = document.createElement("th");
    cell.classList.add("top");
    cell.style.width = "4.5em";
    {
      const span = document.createElement("span");
      span.textContent = Unicode.GREEK_CAPITAL_DELTA;
      span.title = deltaColTitle;
      cell.appendChild(span);
    }
    cell.appendChild(document.createElement("br"));
    {
      const span = document.createElement("span");
      span.classList.add("small");
      span.id = PREDICT_TEXT_ID;
      cell.appendChild(span);
    }
    return cell;
  }
  function makeRankUpHeaderCell(rankUpColWidth, rankUpColTitle) {
    const cell = document.createElement("th");
    cell.classList.add("top", "right");
    cell.style.width = rankUpColWidth;
    {
      const span = document.createElement("span");
      span.textContent = Unicode.BLACK_CURVED_RIGHTWARDS_AND_UPWARDS_ARROW;
      span.title = rankUpColTitle;
      cell.appendChild(span);
    }
    return cell;
  }
  function makeDataCell(bottom = false, right = false) {
    const cell = document.createElement("td");
    if (bottom) {
      cell.classList.add("bottom");
    }
    if (right) {
      cell.classList.add("right");
    }
    return cell;
  }
  function populateCells(row, type, rankUpTint, perfCell, deltaCell, rankUpCell) {
    if (row === void 0) {
      perfCell.appendChild(makeGreySpan("N/A", "Not applicable"));
      deltaCell.appendChild(makeGreySpan("N/A", "Not applicable"));
      rankUpCell.appendChild(makeGreySpan("N/A", "Not applicable"));
      return;
    }
    perfCell.appendChild(makePerformanceSpan(row.performance));
    deltaCell.appendChild(makeDeltaSpan(row.delta));
    switch (type) {
      case "FINAL":
        if (row.rank.abbr === row.newRank.abbr) {
          rankUpCell.appendChild(makeGreySpan("N/C", "No change"));
        } else {
          const arrow = row.delta > 0 ? Unicode.SLANTED_NORTH_ARROW_WITH_HORIZONTAL_TAIL : Unicode.BACKSLANTED_SOUTH_ARROW_WITH_HORIZONTAL_TAIL;
          rankUpCell.appendChild(makeFinalRankUpSpan(row.rank, row.newRank, arrow));
        }
        break;
      case "PREDICTED":
        rankUpCell.appendChild(
          makePredictedRankUpSpan(row.rank, row.deltaReqForRankUp, row.nextRank)
        );
        if (row.delta >= row.deltaReqForRankUp) {
          const [color, priority] = rankUpTint;
          rankUpCell.style.setProperty("background-color", color ?? null, priority);
        }
        break;
      default:
        throw new Error("Unknown prediction type");
    }
  }
  function updateStandings(resp) {
    let deltaColTitle, rankUpColWidth, rankUpColTitle, columns;
    switch (resp.type) {
      case "FINAL":
        deltaColTitle = "Final rating change";
        rankUpColWidth = "6.5em";
        rankUpColTitle = "Rank change";
        columns = FINAL_COLUMNS;
        break;
      case "PREDICTED":
        deltaColTitle = "Predicted rating change";
        rankUpColWidth = "7.5em";
        rankUpColTitle = "Rating change for rank up";
        columns = PREDICT_COLUMNS;
        break;
      default:
        throw new Error("Unknown prediction type");
    }
    const rows = Array.from(document.querySelectorAll("table.standings tbody tr"));
    for (const [idx, tableRow] of rows.entries()) {
      tableRow.querySelector("th:last-child, td:last-child").classList.remove("right");
      let perfCell, deltaCell, rankUpCell;
      if (idx === 0) {
        perfCell = makePerfHeaderCell();
        deltaCell = makeDeltaHeaderCell(deltaColTitle);
        rankUpCell = makeRankUpHeaderCell(rankUpColWidth, rankUpColTitle);
      } else if (idx === rows.length - 1) {
        perfCell = makeDataCell(true);
        deltaCell = makeDataCell(true);
        rankUpCell = makeDataCell(true, true);
      } else {
        perfCell = makeDataCell();
        deltaCell = makeDataCell();
        rankUpCell = makeDataCell(false, true);
        const handle = tableRow.querySelector("td.contestant-cell").textContent.trim();
        let rankUpTint;
        if (tableRow.classList.contains("highlighted-row")) {
          rankUpTint = ["#d1eef2", "important"];
        } else {
          rankUpTint = [idx % 2 ? "#ebf8eb" : "#f2fff2", void 0];
        }
        populateCells(resp.rowMap[handle], resp.type, rankUpTint, perfCell, deltaCell, rankUpCell);
      }
      const cells = [perfCell, deltaCell, rankUpCell];
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (idx % 2) {
          cell.classList.add("dark");
        }
        cell.classList.add(columns[i].id, DISPLAY_NONE_CLS);
        tableRow.appendChild(cell);
      }
    }
    return columns;
  }
  function updateColumnVisibility(prefs) {
    for (const col of ALL_COLUMNS) {
      const showCol = prefs[col.setting];
      const func = showCol ? (cell) => cell.classList.remove(DISPLAY_NONE_CLS) : (cell) => cell.classList.add(DISPLAY_NONE_CLS);
      document.querySelectorAll(`.${col.id}`).forEach(func);
    }
  }
  function showFinal() {
    const predictTextSpan = document.getElementById(PREDICT_TEXT_ID);
    predictTextSpan.textContent = "Final";
  }
  function showTimer(fetchTime) {
    const predictTextSpan = document.getElementById(PREDICT_TEXT_ID);
    function update() {
      const secSincePredict = Math.floor((Date.now() - fetchTime) / 1e3);
      if (secSincePredict < 30) {
        predictTextSpan.textContent = "Just now";
      } else if (secSincePredict < 60) {
        predictTextSpan.textContent = "<1m old";
      } else {
        predictTextSpan.textContent = Math.floor(secSincePredict / 60) + "m old";
      }
    }
    update();
    setInterval(update, 1e3);
  }
  async function predict(contestId) {
    const response = await predictDeltas(contestId);
    switch (response.result) {
      case "OK":
        break;
      case "UNRATED_CONTEST":
        console.info("[Carrot] Unrated contest, not displaying delta column.");
        return;
      case "DISABLED":
        console.info("[Carrot] Deltas for this contest are disabled according to user settings.");
        return;
      default:
        throw new Error("Unknown result");
    }
    const columns = updateStandings(response.predictResponse);
    switch (response.predictResponse.type) {
      case "FINAL":
        showFinal();
        break;
      case "PREDICTED":
        showTimer(response.predictResponse.fetchTime);
        break;
      default:
        throw new Error("Unknown prediction type");
    }
    updateColumnVisibility(response.prefs);
    return columns;
  }
  function main() {
    _GM_addStyle(contentCss);
    const matches = location.pathname.match(/contest\/(\d+)\/standings/);
    const contestId = matches ? matches[1] : null;
    if (contestId && document.querySelector("table.standings")) {
      predict(Number.parseInt(contestId)).then((columns) => {
      }).catch((er) => {
        console.error("[Carrot] Predict error: %o", er);
        er.toString();
      });
    }
    const ping = async () => {
      await Promise.all([maybeUpdateContestList(), maybeUpdateRatings()]);
    };
    setInterval(ping, PING_INTERVAL);
  }
  const optionsHtml = '<dialog id="options-dialog">\n  <h1>Options</h1>\n  <div id="options-content">\n    <ul>\n      <li>\n        <input type="checkbox" id="enable-predict-deltas">\n        <label for="enable-predict-deltas">\n          Predict and show deltas for running contests and recently finished contests\n        </label>\n        <ul class="inner-ul">\n          <li>\n            <details>\n              <summary>\n                TL;DR: Disable this if you are on a data capped network\n              </summary>\n              If you are on Codeforces and a contest starts in less than an hour, having this\n              option enabled will prefetch user ratings (around 7MB of data) which is required for\n              delta prediction. This is a one-time fetch for the contest. Disabling this will fetch\n              the ratings when you open the ranklist for the first time.\n            </details>\n            <input type="checkbox" id="enable-prefetch-ratings">\n            <label for="enable-prefetch-ratings">Prefetch ratings</label>\n          </li>\n        </ul>\n      </li>\n      <li>\n        <input type="checkbox" id="enable-final-deltas">\n        <label for="enable-final-deltas">\n          Show final deltas for finished rated contests\n        </label>\n      </li>\n      <button id="close-options">Close</button>\n    </ul>\n  </div>\n</dialog>';
  const optionsCss = "#options-dialog {\n  min-width: 500px;\n  min-height: 180px;\n\n  margin: 0 auto;\n  padding: 10px;\n  border: 1px solid #ccc;\n  border-radius: 5px;\n  background-color: #f9f9f9;\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translateX(-50%) translateY(-50%);\n  -moz-transform: translateX(-50%) translateY(-50%);\n  -ms-transform: translateX(-50%) translateY(-50%);\n  transform: translateX(-50%) translateY(-50%);\n}\n\n#options-dialog ul {\n  list-style-type: none;\n}\n\n#options-dialog li {\n  padding-top: 5px;\n}\n\n#options-dialog .inner-ul {\n  padding-left: 25px;\n}\n\n#options-dialog details {\n  margin-left: 10px;\n}\n\n#options-dialog details > summary {\n  margin-left: -10px;\n  cursor: pointer;\n}\n";
  async function setup() {
    const predict2 = document.querySelector("#enable-predict-deltas");
    const final = document.querySelector("#enable-final-deltas");
    const prefetch = document.querySelector("#enable-prefetch-ratings");
    async function update() {
      predict2.checked = await enablePredictDeltas();
      final.checked = await enableFinalDeltas();
      prefetch.checked = await enablePrefetchRatings();
      prefetch.disabled = !predict2.checked;
    }
    predict2.addEventListener("input", async () => {
      await enablePredictDeltas(predict2.checked);
      await update();
    });
    final.addEventListener("input", async () => {
      await enableFinalDeltas(final.checked);
      await update();
    });
    prefetch.addEventListener("input", async () => {
      await enablePrefetchRatings(prefetch.checked);
      await update();
    });
    await update();
  }
  function initOptions() {
    $("body").append(optionsHtml);
    _GM_addStyle(optionsCss);
    _GM_registerMenuCommand("Open options", () => {
      const dialog = document.querySelector("#options-dialog");
      dialog.showModal();
    });
    _GM_registerMenuCommand("Clear cache", () => {
      const list = _GM_listValues();
      for (const key of list) {
        if (key.startsWith("LOCAL.")) {
          _GM_deleteValue(key);
        }
      }
    });
    $("#close-options").on("click", () => {
      const dialog = document.querySelector("#options-dialog");
      dialog.close();
    });
    setup();
  }
  initOptions();
  main();

})();