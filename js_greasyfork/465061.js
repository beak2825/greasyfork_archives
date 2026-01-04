// ==UserScript==
// @name        FixMissingAliasesOneLogin
// @namespace   Custom Scripts
// @match       https://signin.aws.amazon.com/saml
// @grant       none
// @version     2.9.2
// @author      -
// @inject-into content
// @description Script to add missing aliases to AWS accounts on OneLogin page
// @downloadURL https://update.greasyfork.org/scripts/465061/FixMissingAliasesOneLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/465061/FixMissingAliasesOneLogin.meta.js
// ==/UserScript==

const fixsigninbutton = document.getElementById('input_signin_button');

if (fixsigninbutton) {
    fixsigninbutton.style.position = 'absolute'; // Allow free positioning of the button
    fixsigninbutton.style.display = 'block';     // Ensure the button is visible

    function moveButtonNearElement(element) {
        if (element) {
            const elementRect = element.getBoundingClientRect();

            const newLeft = elementRect.left + window.scrollX - fixsigninbutton.offsetWidth;
            const newTop = elementRect.top + window.scrollY - 12;

            fixsigninbutton.style.left = `${newLeft}px`;
            fixsigninbutton.style.top = `${newTop}px`;
        }
    }

    const radioButtons = document.querySelectorAll('.saml-radio');

    radioButtons.forEach((radio) => {
        radio.addEventListener('click', (event) => {
            const parentContainer = radio.closest('.saml-role');
            moveButtonNearElement(parentContainer);
        });
    });
}

const accounts = {
  "653039649727": "Coches - Prod",
  "342815817183": "FreeTV - Billrun - Prod",
  "854408393416": "FreeTV - Network",
  "458431564519": "Powtoon - Network",
  "655015268681": "Cymulate - CyBi",
  "748325639358": "Multiverse - ProductProduction",
  "077334429266": "Multiverse - Production-Operations",
  "198395722583": "Multiverse - ProductDevelopment",
  "155219062406": "Multiverse - OperationsNetworking",
  "562568360015": "Multiverse - Audit",
  "209715836971": "Myrror Security LTD - prod 2",
  "861902067445": "Myrror Security LTD - bsprod",
  "906831570446": "Reveal Security - PosteIT",
  "654654290194": "Colkie - production",
  "270743961673": "Sentra - production",
  "615142189529": "IDUN - Prod",
  "780898227163": "ODDITY - Phixt",
  "767661770034": "QuestarAuto - tflprod | MainPROD IL",
  "637423575668": "OchreBio - obelix-prod",
  "557143635936": "WeAreMove - Elyotech",
  "695124702163": "HER - Dattch",
  "838148646721": "Agromentom (FieldIn) - Prod",
  "303660066660": "Agromentom (FieldIn) - ORG MGMT",
  "754064448871": "ACE - production",
  "655177821565": "Koa Health - Production",
  "657459922475": "InCrowd - Clients",
  "533267422458": "Koa Health- OxCADAT.Prod",
  "402305273359": "Koa Health - Data.Prod",
  "529772217453": "Reveal Security - trackerProd",
  "445511888825": "QuestarAuto - traffilog",
  "269596082406": "QuestarAuto - Traffilog-London | BL",
  "572494933850": "QuestarAuto - traffilogclients",
  "332068451987": "QuestarAuto - traffilognordic | DK",
  "686641979155": "QuestarAuto - Northamerica | NA & DK",
  "579466656149": "Blue White Robotics - production",
  "732181148128": "Aptoide - Catappult",
  "476823313410": "Deepkeep - demo",
  "371360243830": "Natterbox - redmatter-prod",
  "058264182451": "AIT-Website WordPress",
  "070730214747": "QuestarAuto - traffilog payer",
  "101899025651": "QuestarAuto - traffilogprod | UK",
  "544555679792": "Findable - Production main",
  "605139832206": "Findable - Production API",
  "490004611697": "Fero - Prod",
  "075012627374": "Gamoshi - Prod",
  "554047523271": "Limina - Prod",
  "512581178607": "Franscape - Prod",
  "723435648346": "Promateur - Prod",
  "645634481801": "Miio - Prod",
}

const terraformManagedAccounts = {
    "555204499888": "Terraform NOC",
    "654654290194": "Terraform NOC",
    "564173995411": "Terraform NOC",
    "490004611697": "Terraform NOC",
    "426105708615": "Terraform NOC",
    "868281071166": "Terraform NOC",
    "444365405366": "Terraform NOC",
    "069579555273": "Terraform NOC",
    "166782379088": "Terraform NOC",
    "075012627374": "Terraform NOC",
    "691691572118": "Terraform NOC",
    "512581178607": "Terraform NOC",
    "723435648346": "Terraform NOC",
    "645634481801": "Terraform NOC",
    "412181355370": "Terraform internal",
    "342815817183": "Terraform internal",
    "305551662246": "Terraform internal",
    "972199851382": "Terraform internal",
    "371360243830": "Terraform customer"
};

const keys = Object.keys(accounts);
const terraformKeys = Object.keys(terraformManagedAccounts);
const samlAccountElements = document.querySelectorAll(".saml-account-name");

samlAccountElements.forEach((el) => {
  // Initialize text with account name first
  let accountText = el.textContent;

  // Handle regular accounts
  keys.forEach((key) => {
    if (accountText.includes(key)) {
        el.textContent = `Account: ${accounts[key]} (${key})`;
    }
  });

  // Handle Terraform-managed accounts
  terraformKeys.forEach((key) => {
    if (accountText.includes(key)) {
      const terraformIcon = document.createElement("img");
      terraformIcon.src = "https://noc-fix-missing-aliases.s3.eu-central-1.amazonaws.com/terraform.png";
      terraformIcon.style.height = "20px";
      terraformIcon.style.width = "17px";
      terraformIcon.style.verticalAlign = "middle";

      // Add Terraform icon and repo location
      el.append(` - `, terraformIcon, ` ${terraformManagedAccounts[key]}`);
    }
  });

  if (el.textContent.includes("783917947860")) {
        console.log("found");
        console.log(el);
        el.parentElement.parentElement.parentElement.prepend(el.parentElement.parentElement);
  }
});
