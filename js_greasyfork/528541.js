// ==UserScript==
// @name         Auto-select advertisements
// @namespace    https://github.com/f1r3w4rr10r/fa-utils
// @version      0.3.0
// @description  This automatically selects submission notifications, that are advertisements.
// @author       f1r3w4rr10r
// @match        https://www.furaffinity.net/msg/submissions/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528541/Auto-select%20advertisements.user.js
// @updateURL https://update.greasyfork.org/scripts/528541/Auto-select%20advertisements.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  const DEFINITELY_AD_THRESHOLD = 50;
  const AMBIGUOUS_AD_THRESHOLD = 25;

  // The second "c" is a Cyrillic "s";
  const COMMISSION_REGEX_STRING = "[cс]omm?(?:ission)?s?";

  /** @type {AdSelector | SelectorCombiner} */
  const AMBIGUOUS_COMMISSION_SELECTOR = {
    operator: "or",
    operands: [
      { target: "name", pattern: /\bauction\b/i },
      {
        target: "name",
        pattern: new RegExp(`(?:^|\\W)${COMMISSION_REGEX_STRING}\\b`, "i"),
      },
      { target: "name", pattern: /\bwing.its?\b/i },
    ],
  };

  /** @type {AdSelector | SelectorCombiner} */
  const AMBIGUOUS_DISCOUNTS_SELECTOR = {
    operator: "or",
    operands: [
      { target: "name", pattern: /\bdiscount\b/i },
      { target: "name", pattern: /\bsale\b/i },
    ],
  };

  /** @type {AdSelector | SelectorCombiner} */
  const AMBIGUOUS_MEMBERSHIPS_SELECTOR = {
    operator: "or",
    operands: [
      { target: "name", pattern: /\bboosty\b/i },
      { target: "name", pattern: /\bp[@a]treon\b/i },
      { target: "name", pattern: /\bsub(?:scribe)?\s*star\b/i },
      { target: "name", pattern: /\bsupporters?\b/i },
      { target: "tags", pattern: /\bboosty\b/i },
      { target: "tags", pattern: /\bp[@a]treon\b/i },
      { target: "tags", pattern: /\bsub(?:scribe)?\s*star\b/i },
    ],
  };

  /** @type {AdSelector | SelectorCombiner} */
  const AMBIGUOUS_PRICE_LIST_SELECTOR = {
    operator: "or",
    operands: [
      { target: "name", pattern: /\bprice\s+(?:list|sheet)\b/i },
      { target: "name", pattern: /\bcommission\s+info/i },
    ],
  };

  /** @type {AdSelector | SelectorCombiner} */
  const AMBIGUOUS_RAFFLES_SELECTOR = { target: "name", pattern: /\braffle\b/i };

  /** @type {AdSelector | SelectorCombiner} */
  const AMBIGUOUS_SHOPS_SELECTOR = {
    operator: "or",
    operands: [
      { target: "name", pattern: /\bshop\b/i },
      { target: "name", pattern: /\bfurplanet\b/i },
      { target: "description", pattern: /\bfurplanet\b/i },
      { target: "tags", pattern: /\bfurplanet\b/i },
    ],
  };

  /** @type {AdSelector | SelectorCombiner} */
  const AMBIGUOUS_SLOTS_SELECTOR = {
    operator: "or",
    operands: [
      { target: "name", pattern: /\b(?:multi)?slots?\b/i },
      { target: "name", pattern: /\bart\s+marathon\b/i },
      { target: "description", pattern: /\d\s+slots\b/i },
    ],
  };

  /** @type {AdSelector | SelectorCombiner} */
  const AMBIGUOUS_STREAM_SELECTOR = {
    target: "name",
    pattern: /\b(?:live)?stream\b/i,
  };

  /** @type {AdSelector | SelectorCombiner} */
  const AMBIGUOUS_TEASER_SELECTOR = {
    operator: "or",
    operands: [
      { target: "name", pattern: /\bpreview\b/i },
      { target: "name", pattern: /\bspoiler\b/i },
      { target: "name", pattern: /\bteaser\b/i },
    ],
  };

  /** @type {AdSelector | SelectorCombiner} */
  const AMBIGUOUS_YCH_SELECTOR = {
    operator: "or",
    operands: [
      {
        target: "name",
        pattern: /\by\s*c\s*h\s*s?\b/i,
      },
      {
        target: "description",
        pattern: /\by\s*c\s*h\s*s?\b/i,
      },
    ],
  };

  /** @type {AdRules} */
  const adRules = [
    {
      ruleName: "adoptables",
      value: DEFINITELY_AD_THRESHOLD,
      selector: {
        operator: "or",
        operands: [
          { target: "name", pattern: /\badopt(?:(?:able)?s?|ing|ion)\b/i },
          { target: "name", pattern: /\bcustoms\b/i },
          { target: "tags", pattern: /\badopt(?:(?:able)?s?|ing|ion)\b/i },
          {
            target: "description",
            pattern: /\badopt(?:(?:able)?s?|ing|ion)\b/i,
          },
        ],
      },
    },
    {
      ruleName: "commission ads (ambiguous)",
      value: AMBIGUOUS_AD_THRESHOLD,
      selector: AMBIGUOUS_COMMISSION_SELECTOR,
    },
    {
      ruleName: "commission ads (definitive)",
      value: DEFINITELY_AD_THRESHOLD,
      selector: {
        operator: "and",
        operands: [
          AMBIGUOUS_COMMISSION_SELECTOR,
          {
            operator: "or",
            operands: [
              { target: "name", pattern: /\bclosed\b/i },
              { target: "name", pattern: /\bhalfbody\b/i },
              { target: "name", pattern: /\bopen(?:ed)?\b/i },
              { target: "name", pattern: /\bsale\b/i },
              { target: "name", pattern: /\bslots?\b/i },
              { target: "name", pattern: /\bych\b/i },
            ],
          },
        ],
      },
    },
    {
      ruleName: "convention dealers",
      value: DEFINITELY_AD_THRESHOLD,
      selector: {
        operator: "or",
        operands: [
          { target: "tags", pattern: /\bdealers?\s+den\b/i },
          { target: "description", pattern: /\bdealers?\s+den\b/i },
        ],
      },
    },
    {
      ruleName: "discounts (ambiguous)",
      value: AMBIGUOUS_AD_THRESHOLD,
      selector: AMBIGUOUS_DISCOUNTS_SELECTOR,
    },
    {
      ruleName: "discounts (definitive)",
      value: DEFINITELY_AD_THRESHOLD,
      selector: {
        operator: "and",
        operands: [
          AMBIGUOUS_DISCOUNTS_SELECTOR,
          {
            operator: "or",
            operands: [
              { target: "name", pattern: /\$/ },
              { target: "name", pattern: /\bbase\b/i },
              { target: "name", pattern: /\bclaimed\b/i },
              { target: "name", pattern: /\b(?:multi)?slot\b/i },
              { target: "name", pattern: /\boffer\b/i },
              { target: "name", pattern: /\bprice\b/i },
            ],
          },
        ],
      },
    },
    {
      ruleName: "memberships (ambgiuous)",
      value: AMBIGUOUS_AD_THRESHOLD,
      selector: AMBIGUOUS_MEMBERSHIPS_SELECTOR,
    },
    {
      ruleName: "memberships (definitive)",
      value: DEFINITELY_AD_THRESHOLD,
      selector: {
        operator: "and",
        operands: [
          {
            operator: "or",
            operands: [
              ...AMBIGUOUS_MEMBERSHIPS_SELECTOR.operands,
              { target: "description", pattern: /\bboosty\b/i },
              { target: "description", pattern: /\bp[@a]treon\b/i },
              { target: "description", pattern: /\bsub(?:scribe)?\s*star\b/i },
            ],
          },
          {
            operator: "or",
            operands: [
              { target: "name", pattern: /\bdiscount\b/i },
              { target: "name", pattern: /\b(?:available|now)\s+on\b/i },
              { target: "name", pattern: /\bposted\s+to\b/i },
              { target: "name", pattern: /\bpreview\b/i },
              { target: "name", pattern: /\bteaser?\b/i },
              { target: "name", pattern: /\bup\s+on\b/i },
              { target: "name", pattern: /\bis\s+up\b/i },
              { target: "description", pattern: /\bup\s+on\b/i },
              { target: "description", pattern: /\bfull.*\s+on\b/i },
              { target: "description", pattern: /\bexclusive(?:ly)?.+for\b/i },
            ],
          },
        ],
      },
    },
    {
      ruleName: "price lists (ambiguous)",
      value: AMBIGUOUS_AD_THRESHOLD,
      selector: AMBIGUOUS_PRICE_LIST_SELECTOR,
    },
    {
      ruleName: "price lists (definitive)",
      value: DEFINITELY_AD_THRESHOLD,
      selector: {
        operator: "and",
        operands: [
          AMBIGUOUS_PRICE_LIST_SELECTOR,
          {
            operator: "or",
            operands: [],
          },
        ],
      },
    },
    {
      ruleName: "raffles (ambiguous)",
      value: AMBIGUOUS_AD_THRESHOLD,
      selector: AMBIGUOUS_RAFFLES_SELECTOR,
    },
    {
      ruleName: "raffles (definitive)",
      value: DEFINITELY_AD_THRESHOLD,
      selector: {
        operator: "and",
        operands: [
          AMBIGUOUS_RAFFLES_SELECTOR,
          { target: "name", pattern: /\bwinners?\b/i },
        ],
      },
    },
    {
      ruleName: "reminders",
      value: DEFINITELY_AD_THRESHOLD,
      selector: {
        operator: "or",
        operands: [
          { target: "name", pattern: /\breminder+\b/i },
          { target: "name", pattern: /^REM$/ },
        ],
      },
    },
    {
      ruleName: "shops (ambiguous)",
      value: AMBIGUOUS_AD_THRESHOLD,
      selector: AMBIGUOUS_SHOPS_SELECTOR,
    },
    {
      ruleName: "shops (definitive)",
      value: DEFINITELY_AD_THRESHOLD,
      selector: {
        operator: "or",
        operands: [
          {
            operator: "and",
            operands: [
              AMBIGUOUS_SHOPS_SELECTOR,
              {
                operator: "or",
                operands: [
                  { target: "name", pattern: /\bprint\b/i },
                  { target: "description", pattern: /\bup\s+on\b/i },
                ],
              },
            ],
          },
          { target: "tags", pattern: /\bmerch\b/i },
        ],
      },
    },
    {
      ruleName: "slots (ambiguous)",
      value: AMBIGUOUS_AD_THRESHOLD,
      selector: AMBIGUOUS_SLOTS_SELECTOR,
    },
    {
      ruleName: "slots (definitive)",
      value: DEFINITELY_AD_THRESHOLD,
      selector: {
        operator: "and",
        operands: [
          AMBIGUOUS_SLOTS_SELECTOR,
          {
            operator: "or",
            operands: [
              { target: "name", pattern: /\bavailable\b/i },
              { target: "name", pattern: /\bopen\b/i },
              { target: "name", pattern: /\bsketch\b/i },
            ],
          },
        ],
      },
    },
    {
      ruleName: "stream ads (ambiguous)",
      value: AMBIGUOUS_AD_THRESHOLD,
      selector: AMBIGUOUS_STREAM_SELECTOR,
    },
    {
      ruleName: "stream ads (definitive)",
      value: DEFINITELY_AD_THRESHOLD,
      selector: {
        operator: "or",
        operands: [
          { target: "name", pattern: /\bpicarto\.tv\b/i },
          { target: "name", pattern: /\bstreaming\b/i },
          {
            operator: "and",
            operands: [
              AMBIGUOUS_STREAM_SELECTOR,
              {
                operator: "or",
                operands: [
                  { target: "name", pattern: /\blive\b/i },
                  { target: "name", pattern: /\boffline\b/i },
                  { target: "name", pattern: /\bonline\b/i },
                  { target: "name", pattern: /\bpreorders?\b/i },
                  { target: "name", pattern: /\bslots?\b/i },
                  { target: "name", pattern: /\bup\b/i },
                ],
              },
            ],
          },
          {
            operator: "and",
            operands: [
              { target: "name", pattern: /\bstream\b/i },
              { target: "tags", pattern: /\bstream\b/i },
            ],
          },
        ],
      },
    },
    {
      ruleName: "teasers (ambiguous)",
      value: AMBIGUOUS_AD_THRESHOLD,
      selector: AMBIGUOUS_TEASER_SELECTOR,
    },
    {
      ruleName: "teasers (definitive)",
      value: DEFINITELY_AD_THRESHOLD,
      selector: {
        operator: "and",
        operands: [
          AMBIGUOUS_TEASER_SELECTOR,
          {
            target: "description",
            pattern:
              /\b(?:available|n[eo]w|out)\b.*\bon\b.*\b(?:boosty|p[@a]treon|sub(?:scribe)?\s*star)\b/i,
          },
        ],
      },
    },
    {
      ruleName: "WIPs",
      value: DEFINITELY_AD_THRESHOLD,
      selector: {
        operator: "and",
        operands: [
          { target: "name", pattern: /\bwip\b/i },
          { target: "tags", pattern: /\bwip\b/i },
        ],
      },
    },
    {
      ruleName: "YCHs (ambiguous)",
      value: AMBIGUOUS_AD_THRESHOLD,
      selector: AMBIGUOUS_YCH_SELECTOR,
    },
    {
      ruleName: "YCHs (definitive)",
      value: DEFINITELY_AD_THRESHOLD,
      selector: {
        operator: "and",
        operands: [
          {
            operator: "or",
            operands: [
              AMBIGUOUS_YCH_SELECTOR,
              { target: "name", pattern: /^closed$/i },
            ],
          },
          {
            operator: "or",
            operands: [
              { target: "name", pattern: /\bauction\b/i },
              { target: "name", pattern: /\bavailable\b/i },
              { target: "name", pattern: /\bdiscount\b/i },
              { target: "name", pattern: /\bmultislot\b/i },
              { target: "name", pattern: /\bo\s+p\s+e\s+n\b/i },
              { target: "name", pattern: /\bprice\b/i },
              { target: "name", pattern: /\bpreview\b/i },
              { target: "name", pattern: /\braffle\b/i },
              { target: "name", pattern: /\brem(?:ind(?:er)?)?\d*\b/i },
              { target: "name", pattern: /\brmd\b/i },
              { target: "name", pattern: /\bsale\b/i },
              { target: "name", pattern: /\bslots?\b/i },
              { target: "name", pattern: /\bsold\b/i },
              { target: "name", pattern: /\btaken\b/i },
              { target: "name", pattern: /\busd\b/i },
              { target: "name", pattern: /\b\$\d+\b/i },
              { target: "tags", pattern: /^$/ },
              { target: "tags", pattern: /\bauction\b/i },
              { target: "tags", pattern: /\bsale\b/i },
              { target: "tags", pattern: /\bych\b/i },
              { target: "description", pattern: /\bSB|starting\s+bid\b/i },
              {
                target: "description",
                pattern: /https?:\/\/ych\.art\/auction\/\d+/i,
              },
            ],
          },
        ],
      },
    },
    {
      ruleName: "misc ambiguous",
      value: AMBIGUOUS_AD_THRESHOLD,
      selector: {
        operator: "or",
        operands: [
          { target: "name", pattern: /\bart\s+pack\b/i },
          { target: "name", pattern: /\bart.+earlier\b/i },
          { target: "name", pattern: /\bavailable\s+now\b/i },
          { target: "name", pattern: /\bclosed\b/i },
          { target: "name", pattern: /\bopen\b/i },
          { target: "name", pattern: /\bpoll\b/i },
          { target: "name", pattern: /\brem\b/i },
          { target: "name", pattern: /\bsold\b/i },
          { target: "name", pattern: /\bwip\b/i },
          { target: "tags", pattern: /\bteaser\b/i },
          { target: "description", pattern: /\brules:/i },
        ],
      },
    },
    {
      ruleName: "misc definitive",
      value: DEFINITELY_AD_THRESHOLD,
      selector: {
        operator: "or",
        operands: [
          { target: "name", pattern: /\bcharacters?\s+for\s+sale\b/i },
          { target: "description", pattern: /\bpoll\s+is\s+up\b/i },
        ],
      },
    },
    {
      ruleName: "comic pages",
      value: -200,
      selector: {
        operator: "or",
        operands: [
          {
            target: "name",
            pattern: /\bpage\s+\d+/i,
          },
        ],
      },
    },
    {
      ruleName: "commission only names",
      value: -200,
      selector: {
        operator: "or",
        operands: [
          {
            target: "name",
            pattern: new RegExp(`\\[${COMMISSION_REGEX_STRING}\\]`, "i"),
          },
          {
            target: "name",
            pattern: new RegExp(`^${COMMISSION_REGEX_STRING}$`, "i"),
          },
        ],
      },
    },
    {
      ruleName: "completed YCHs",
      value: -200,
      selector: {
        operator: "and",
        operands: [
          AMBIGUOUS_YCH_SELECTOR,
          {
            operator: "or",
            operands: [
              { target: "name", pattern: /\bfinished\b/i },
              { target: "name", pattern: /\bresult\b/i },
              { target: "description", pattern: /\bfinished\b/i },
            ],
          },
        ],
      },
    },
    {
      ruleName: "user reference",
      value: -200,
      selector: {
        operator: "or",
        operands: [
          { target: "name", pattern: /\bfor\s+[\w\-.]+/i },
          {
            target: "description",
            pattern:
              /\b(?:by|for|from):?\s+(?::(?:icon[\w\-.]+|[\w\-.]+icon):|@?@\w+)/i,
          },
          {
            target: "description",
            pattern: /^:(?:icon[\w\-.]+|[\w\-.]+icon):$/i,
          },
          { target: "description", pattern: /^(?:by|for|from)\s+\w+/i },
          { target: "description", pattern: /\bych\s+for\s+\w+/i },
          { target: "description", pattern: /\bcharacter\s+©\s+\w+/i },
          {
            target: "description",
            pattern: /\bcharacter\s+belongs\s+to\s+@?@\w+/i,
          },
          { target: "description", pattern: /\bcommission\s+for\b$/im },
          {
            target: "description",
            pattern:
              /(?:©|\(c\))\s*(?::(?:icon[\w\-.]+|[\w\-.]+icon):|@?@\w+)$/im,
          },
          {
            target: "description",
            pattern: /\bpatreon\s+reward\s+for\s+\w+/i,
          },
        ],
      },
    },
    {
      ruleName: "artist reference",
      value: -200,
      selector: {
        operator: "or",
        operands: [
          {
            target: "description",
            pattern: /🎨\s*:\s*(?::(?:icon[\w\-.]+|[\w\-.]+icon):|@?@\w+)/i,
          },
        ],
      },
    },
    {
      ruleName: "rewards",
      value: -200,
      selector: {
        operator: "or",
        operands: [{ target: "description", pattern: /\breward\s+sketch\b/i }],
      },
    },
  ];

  /**
   * An evaluator for {@link AdRules} on a submission.
   */
  class AdRulesEvaluator {
    /**
     * Create a new {@link AdRulesEvaluator}.
     * @param {AdRules} rules - the rules to use
     */
    constructor(rules) {
      this.adRuleEvaluators = rules.map((r) => new AdRuleEvaluator(r));
    }

    /**
     * Explain the rating of a submission.
     * @param {SubmissionData} submissionData - the data of the submission to explain
     */
    explain(submissionData) {
      const result = this.test(submissionData);

      console.group(
        `Submission: "${submissionData.name}" ${result.rating} -> "${result.level}"`,
      );

      this.adRuleEvaluators.forEach((o) => o.explain(submissionData));

      console.groupEnd();
    }

    /**
     * Test a submission against the rules of the evaluator.
     * @param {SubmissionData} submissionData - the data of the submission to test
     * @returns {AdRulesResult} the rating result
     */
    test(submissionData) {
      const values = this.adRuleEvaluators
        .map((e) => e.test(submissionData))
        .filter((e) => e !== null);

      const rating = values.reduce((t, v) => t + v, 0);

      /** @type {AdvertisementLevel | null} */
      let level = null;
      if (rating >= DEFINITELY_AD_THRESHOLD) level = "advertisement";
      else if (rating >= AMBIGUOUS_AD_THRESHOLD) level = "ambiguous";

      return { level, rating };
    }
  }

  /**
   * Map a selector tree node to an evaluator instance.
   * @param {AdSelector | SelectorCombiner} selector
   * @return {AdSelectorEvaluator | SelectorCombinerEvaluator}
   */
  function mapSelectorToEvaluator(selector) {
    if ("target" in selector) return new AdSelectorEvaluator(selector);
    return new SelectorCombinerEvaluator(selector);
  }

  /**
   * An evaluator for a single {@link AdRule} on a submission
   */
  class AdRuleEvaluator {
    /**
     * Create a new {@link AdRuleEvaluator}.
     * @param {AdRule} rule - the rule to use
     */
    constructor({ ruleName, value, selector }) {
      this.ruleName = ruleName;
      this.value = value;
      this.selectorEvaluator = mapSelectorToEvaluator(selector);
    }

    /**
     * Explain the rating of a submission.
     * @param {SubmissionData} submissionData - the data of the submission to explain
     */
    explain(submissionData) {
      const matches = this.selectorEvaluator.test(submissionData);

      const groupName = `Rule "${this.ruleName}"`;
      if (matches) {
        console.group(groupName + ` matches: ${this.value}`);
      } else {
        console.groupCollapsed(groupName);
      }

      this.selectorEvaluator.explain(submissionData);

      console.groupEnd();
    }

    /**
     * Test a submission against the rules of the evaluator.
     * @param {SubmissionData} submissionData - the data of the submission to test
     * @returns {number | null} the value of the rule, when there's a match; null otherwise
     */
    test(submissionData) {
      if (this.selectorEvaluator.test(submissionData)) return this.value;
      return null;
    }
  }

  /**
   * Map the operands of a selector combiner to evaluators.
   * @param {(AdSelector | SelectorCombiner)[]} operands
   * @return {(AdSelectorEvaluator | SelectorCombinerEvaluator)[]}
   */
  function mapOperandsToEvaluators(operands) {
    return operands.map((o) => mapSelectorToEvaluator(o));
  }

  /**
   * An evaluator for a {@link SelectorCombiner} on a submission
   */
  class SelectorCombinerEvaluator {
    /**
     * @param {SelectorCombiner} combiner
     */
    constructor({ operator, operands }) {
      this.operator = operator;
      this.operandEvaluators = mapOperandsToEvaluators(operands);
    }

    /**
     * Explain the rating of a submission.
     * @param {SubmissionData} submissionData - the data of the submission to explain
     */
    explain(submissionData) {
      const matches = this.test(submissionData);

      const groupName = `Combiner "${this.operator}"`;
      if (matches) {
        console.group(groupName + " matches");
      } else {
        console.groupCollapsed(groupName);
      }

      for (const o of this.operandEvaluators) {
        const matched = o.explain(submissionData);
        if (matched && this.operator === "or") break;
      }

      console.groupEnd();
    }

    /**
     * Test a submission against the rules of the combiner's operands.
     * @param {SubmissionData} submissionData - the data of the submission to test
     * @returns {boolean} whether the combiner in total matches the submission
     */
    test(submissionData) {
      switch (this.operator) {
        case "and":
          return this.operandEvaluators.every((o) => o.test(submissionData));
        case "or":
          return this.operandEvaluators.some((o) => o.test(submissionData));
      }
    }
  }

  /**
   * An evaluator for an {@link AdSelector} on a submission
   */
  class AdSelectorEvaluator {
    /**
     * @param {AdSelector} selector
     */
    constructor({ target, pattern }) {
      this.target = target;
      this.pattern = pattern;
    }

    /**
     * Explain the rating of a submission.
     * @param {SubmissionData} submissionData - the data of the submission to explain
     * @return {boolean} whether the submission matched the selector
     */
    explain(submissionData) {
      const target = this.#getTargetString(submissionData);
      const matched = this.pattern.test(target);
      console.log(this.pattern, matched, target);
      return matched;
    }

    /**
     * Test a submission against the rules of the combiner's operands.
     * @param {SubmissionData} submissionData - the data of the submission to test
     * @returns {boolean} whether the selector matches the submission
     */
    test(submissionData) {
      return this.pattern.test(this.#getTargetString(submissionData));
    }

    /**
     * @param {SubmissionData} submissionData
     * @return {string}
     */
    #getTargetString(submissionData) {
      switch (this.target) {
        case "name":
          return submissionData.name;
        case "tags":
          return submissionData.tags;
        case "description":
          return submissionData.description;
      }
    }
  }

  /**
   * Iterate over all submissions on a page and test the ad rules against them.
   * @returns {[number, number, number]} number of ads, number of ambiguous ads, number of untagged submissions
   */
  function iterateSubmissions() {
    const figures = Array.from(
      document.querySelectorAll("section.gallery figure"),
    );
    let advertisements = 0;
    let ambiguous = 0;
    let untagged = 0;

    const evaluator = new AdRulesEvaluator(adRules);

    for (const figure of figures) {
      const figcaption = figure.querySelector("figcaption");
      const checkbox = figure.querySelector("input");
      const nameAnchor = figcaption?.querySelector("a");
      const submissionName = nameAnchor?.textContent;
      const tags = figure?.querySelector("img")?.dataset["tags"];
      const description = descriptions[checkbox?.value ?? ""]?.description;

      const submissionData = {
        name: submissionName ?? "",
        description: description ?? "",
        tags: tags ?? "",
      };

      const result = evaluator.test(submissionData);

      const button = document.createElement("button");
      button.className = "button";
      button.style.lineHeight = "unset";
      button.style.padding = "0";
      button.type = "button";
      button.textContent = `Ad-rating: ${result.rating}`;
      button.addEventListener("click", () => evaluator.explain(submissionData));
      checkbox?.parentElement?.appendChild(button);

      if (result.level === "advertisement") {
        figure.classList.add("advertisement");
        if (checkbox) checkbox.checked = true;
        advertisements += 1;
      } else if (result.level === "ambiguous") {
        figure.classList.add("maybe-advertisement");
        ambiguous += 1;
      }

      if (tags === "") {
        figcaption?.classList.add("not-tagged");
        untagged += 1;
      }
    }

    return [advertisements, ambiguous, untagged];
  }

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(
    `
figure.advertisement { outline: orange 3px solid; }
figure.maybe-advertisement { outline: yellow 3px solid; }
figcaption.not-tagged input { outline: orange 3px solid; }
figcaption button { line-height: 1; margin-left: 1rem; padding: 0; }
`.trim(),
  );
  document.adoptedStyleSheets.push(sheet);

  const sectionHeader = document.querySelector(".section-header");

  const advertisementsSelectMessage = document.createElement("p");
  sectionHeader?.appendChild(advertisementsSelectMessage);

  const [advertisements, ambiguous, untagged] = iterateSubmissions();

  const message = `Selected ${advertisements} advertisement and ${ambiguous} ambiguous submissions. ${untagged} submissions were not tagged.`;

  advertisementsSelectMessage.textContent = message;
})();
