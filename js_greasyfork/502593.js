// ==UserScript==
// @name        FixMissingAliasesOneLogin_1
// @namespace   Custom Scripts
// @match       https://signin.aws.amazon.com/saml
// @grant       none
// @version     1.0.15
// @license MIT
// @description Script to add missing aliases to AWS accounts on OneLogin page
// @downloadURL https://update.greasyfork.org/scripts/502593/FixMissingAliasesOneLogin_1.user.js
// @updateURL https://update.greasyfork.org/scripts/502593/FixMissingAliasesOneLogin_1.meta.js
// ==/UserScript==

const accounts = {
  "342815817183": "FreeTV Billrun-Prod",
  "458431564519": "Powtoon Network",
  "655015268681": "Cymulate CyBi",
  "748325639358": "MultiverseProductProduction",
  "077334429266": "MultiverseProduction-Operations",
  "198395722583": "MultiverseProductDevelopment",
  "155219062406": "MultiverseOperationsNetworking",
  "562568360015": "Multiverse Audit",
  "558296378699": "Surgimate",
  "209715836971": "Myrror Security LTD - prod 2",
  "861902067445": "Myrror Security LTD - bsprod",
  "906831570446": "Reveal Security - PosteIT",
  "654654290194": "Colkie - production",
  "270743961673": "Sentra - production",
  "615142189529": "IDUN Prod",
  "780898227163": "ODDITY - Phixt",
  "767661770034": "traffilog - Prod",
  "637423575668": "OchreBio - obelix-prod",
  "557143635936": "WeAreMove - Elyotech",
  "695124702163": "HER - Dattch",
  "838148646721": "agromentom - Fieldin",
  "831245652210": "stratusX - Simgo-Prod"
};

const keys = Object.keys(accounts);
const samlAccountElements = document.querySelectorAll(".saml-account-name");

keys.forEach((key) => {
  const contains = key;
  samlAccountElements.forEach((el) => {
    if (el.textContent.includes(contains)) {
      el.textContent = `${accounts[key]} (${key})`
    }
  });
});