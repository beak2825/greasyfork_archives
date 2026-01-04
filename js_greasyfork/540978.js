// ==UserScript==
// @name            Construction JavaScript Injection
// @description     Inject some javaScript into these websites
// @version         1.0.16
// @author          Oliver P
// @namespace       https://github.com/OlisDevSpot
// @license         MIT
// @match           *://*/*
// @run-at          document-end
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/540978/Construction%20JavaScript%20Injection.user.js
// @updateURL https://update.greasyfork.org/scripts/540978/Construction%20JavaScript%20Injection.meta.js
// ==/UserScript==

// jshint esversion: 8

function createRegexFromPattern(pattern) {
  const escaped = pattern.replace(/([.+?^${}()|[\]\\])/g, "\\$1");
  const wildcarded = escaped.replace(/\*/g, ".*");
  const withOptionalSlash = wildcarded.replace(/\/?$/, "/?");
  return new RegExp(`^${withOptionalSlash}$`);
}

const approvedMatchers = [
  //   ARTICLES
  "https://abc7.com/how-do-i-get-help-with-my-utility-bill-much-power-costs-increase-during-heat-waves-many-people-are-struggling-to-pay-their-electric-bills/12272588/",
  "https://abc7.com/post/la-council-approves-54-million-proposal-modernize-expand/15024448",
  "https://ktla.com/news/local-news/local-businesses-come-together-to-help-fire-victims/",
  "https://www.multihousingnews.com/new-affordable-housing-comes-on-line-in-irvine-calif-3/",
  "https://ktla.com/news/local-news/behind-on-your-ladwp-bills-here-are-the-utility-debt-relief-funding-options-available/",
  "https://www.certisaec.com/largest-construction-companies-in-the-golden-state/",
  "https://www.nbclosangeles.com/news/local/costco-with-apartments-south-la-baldwin-hills/3514264/",
  "https://www.yahoo.com/news/local-organizations-collect-donations-fire-144336071.html*",

  //   UTILITY
  "https://www.zillow.com/learn/best-home-improvements-to-increase-value/",
  "https://www.zillow.com/research/solar-panels-house-sell-more-23798/",
  "https://www.google.com/search?q=*",
  "https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-costs/care-fera-program",
  "https://www.sce.com/mysce/billsnpayments*",
  "https://www.sce.com/save-money/income-qualified-programs/*",
  "https://www.sce.com/save-money/rates-financing/*",

  //   REVIEW PLATFORMS
  "https://www.bbb.org/us/*",
  "https://www.yelp.com/biz/*",

  //   GOVERNMENT
  "https://www.energy.ca.gov/rules-and-regulations/energy-suppliers-reporting/clean-energy-and-pollution-reduction-act-sb-350",
  "https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum=*",
];

function isApprovedMatcher(url) {
  return approvedMatchers.some((matcher) =>
    createRegexFromPattern(matcher).test(url)
  );
}

(async function () {
  if (window.self !== window.top) return;
  GM.registerMenuCommand("Set Sales Credentials", configure);
  if (!isApprovedMatcher(window.location.href)) return;

  let company = await GM.getValue("company");
  let firstName = await GM.getValue("firstName");
  let lastName = await GM.getValue("lastName");

  console.log("changed. Will this update?");

  if (!company || !firstName || !lastName) {
    await configure();
  }

  async function configure() {
    company = prompt("Enter your company name (e.g. david-star):") || "";
    firstName = prompt("First name:") || "";
    lastName = prompt("Last name:") || "";

    if (company && firstName && lastName) {
      await GM.setValue("company", company);
      await GM.setValue("firstName", firstName);
      await GM.setValue("lastName", lastName);
      location.reload();
    } else {
      alert("Values cannot be empty!");
    }
  }

  // SYSTEM VARS
  const CDN_URL = "https://construction-js-injections.pages.dev";

  // PERSONAL VARS
  const salesperson = {
    firstName,
    lastName,
    get fullName() {
      return this.firstName + " " + this.lastName;
    },
    get key() {
      return this.firstName.toLowerCase() + "-" + this.lastName.toLowerCase();
    },
  };

  // QUERY STRING
  const currentSiteUrl = encodeURIComponent(window.location.href);
  const params = {
    data: JSON.stringify({ currentSiteUrl, salesperson }),
  };
  const urlSearchParams = new URLSearchParams(params).toString();

  // Inject dynamic code
  const response = await fetch(`${CDN_URL}/${company}?${urlSearchParams}`);
  const code = await response.text();
  console.log(code);
  const script = document.createElement("script");
  script.textContent = code;
  document.head.appendChild(script);
})();
