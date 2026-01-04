// ==UserScript==
// @name         PDDashboard
// @require      https://cdn.jsdelivr.net/npm/aws-sdk@2.1523.0/dist/aws-sdk.min.js
// @namespace    Violentmonkey Scripts
// @match        https://automat-it.pagerduty.com/incidents
// @match        https://automat-it.pagerduty.com/incidents/*
// @match        https://automat-it.pagerduty.com/incidents*
// @grant        GM_xmlhttpRequest
// @connect      vo8gfttl53.execute-api.eu-central-1.amazonaws.com
// @version      3.7.14
// @author      -
// URL https://greasyfork.org/en/scripts/474429-pddashboard
// @description AIT PD Dashboard tuning
// @downloadURL https://update.greasyfork.org/scripts/474429/PDDashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/474429/PDDashboard.meta.js
// ==/UserScript==

const AWS_REGION = 'eu-central-1';
const API_GATEWAY_BASE_URL = 'https://vo8gfttl53.execute-api.eu-central-1.amazonaws.com/PROD';
const API_ENDPOINTS = {
    priority: `${API_GATEWAY_BASE_URL}/priority`,
    message: `${API_GATEWAY_BASE_URL}/message`,
    description: `${API_GATEWAY_BASE_URL}/description`,
    contacts: `${API_GATEWAY_BASE_URL}/contacts`,
    knownissues: `${API_GATEWAY_BASE_URL}/knownissues`,
    healthcheck: `${API_GATEWAY_BASE_URL}/healthcheck`
};

// Embedded Tampermonkey Parallel Fix for Chrome MV3
// Source: https://github.com/Tampermonkey/tampermonkey/issues/2215
(function() {

    function compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        const length = Math.max(parts1.length, parts2.length);

        for (let i = 0; i < length; i++) {
            const num1 = parts1[i] || 0;
            const num2 = parts2[i] || 0;

            if (num1 > num2) { return 1; }
            if (num1 < num2) { return -1; }
        }
        return 0;
    }

    const HAS_GM = typeof GM !== 'undefined';
    
    // Check if running in Tampermonkey and if version supports redirect control
    if (HAS_GM && typeof GM_info !== 'undefined' && GM_info.scriptHandler === "Tampermonkey" && compareVersions(GM_info.version, "5.3.2") >= 0) {
        // Backup original functions
        const GM_xmlhttpRequestOrig = GM_xmlhttpRequest;

        // Wrapper for GM_xmlhttpRequest
        const GM_xmlhttpRequestWrapper = function(odetails) {
            // If redirect is manually set, simply pass odetails to the original function
            if (odetails.redirect !== undefined) {
                return GM_xmlhttpRequestOrig(odetails);
            }

            const {
                onload,
                onloadend,
                onerror,
                onabort,
                ontimeout,
                ...details
            } = odetails;

            // Set redirect to manual and handle redirects
            const handleRedirects = (initialDetails) => {
                const request = GM_xmlhttpRequestOrig({
                    ...initialDetails,
                    redirect: 'manual',
                    onload: function(response) {
                        if (response.status >= 300 && response.status < 400) {
                            const m = response.responseHeaders.match(/Location:\s*(\S+)/i);
                            // Follow redirect manually
                            const redirectUrl = m && m[1];
                            if (redirectUrl) {
                                const absoluteUrl = new URL(redirectUrl, initialDetails.url).href;
                                handleRedirects({ ...initialDetails, url: absoluteUrl });
                                return;
                            }
                        }

                        if (onload) { onload.call(this, response); }
                        if (onloadend) { onloadend.call(this, response); }
                    },
                    onerror: function(response) {
                        if (onerror) { onerror.call(this, response); }
                        if (onloadend) { onloadend.call(this, response); }
                    },
                    onabort: function(response) {
                        if (onabort) { onabort.call(this, response); }
                        if (onloadend) { onloadend.call(this, response); }
                    },
                    ontimeout: function(response) {
                        if (ontimeout) { ontimeout.call(this, response); }
                        if (onloadend) { onloadend.call(this, response); }
                    }
                });
                return request;
            };

            return handleRedirects(details);
        }

        // Export wrappers
        GM_xmlhttpRequest = GM_xmlhttpRequestWrapper;
        window.GM_xmlhttpRequestOrig = GM_xmlhttpRequestOrig;

        console.log('PDDashboard: Tampermonkey parallel fix applied');
    }
})();

const COGNITO_IDENTITY_POOL_ID = 'eu-central-1:33b5c9b8-c9bc-4f1f-9a00-2ffc68d6aac3';
const highlightPattern = /synthetic|healthch|health-check|pingdom|dotcom-monitor|canary/gi

const playbooks = {
  "Automat-it Security": {
    mainPage: 5021204606,
  },
"Malam Payroll": {
    mainPage: 5207916545,
    alarm: [5211783187],
    contact: 5207916769,
    knownIssues: 5207916853,
    slack: "C09CEFZCTFA",
  },
  "Coches": {
    mainPage: 4924211201,
    alarm: [4924211574],
    contact: 4924211435,
    knownIssues: 4924211521,
    slack: "C08KDDD2LCR",
  },
  "Dorix": {
    mainPage: 4909105158,
    alarm: [4913659914],
    contact: 4909105370,
    knownIssues: 4909105450,
    slack: "C07PBBF74LR",
  },
  "Swaap": {
    mainPage: 4889477121,
    alarm: [4900880404],
    contact: 4889477325,
    knownIssues: 4889477399,
    slack: "C08J2KD8J67",
  },
  "Deep Keep": {
    mainPage: 4484923393,
    alarm: [4484923719],
    contact: 4484923598,
    knownIssues: 4484923672,
    slack: "C07LHMFLUMR",
  },
  "Koa Health": {
    mainPage: 4372398081,
    alarm: [4882694145],
    contact: 4372398285,
    knownIssues: 4372398359,
    slack: "C075QADAWJG",
  },
  "WINT-WI Ltd": {
    mainPage: 4696866817,
    alarm: [4696867142],
    contact: 4696867021,
    knownIssues: 4696867095,
    slack: "C084AJSGVPE",
  },
  "Colkie": {
    mainPage: 4576804887,
    alarm: [4581359621],
    healthcheck: 4576805021,
    contact: 4576805091,
    knownIssues: 4576805165,
    slack: "C06QMRLRDAM",
  },
  "Findable": {
    mainPage: 4603379713,
    alarm: [4609146889],
    healthcheck: 4603379847,
    contact: 4603379917,
    knownIssues: 4603379991,
    slack: "C081J72DA5N",
  },
  "Surecomp": {
    mainPage: 4541448221,
    alarm: [4567826436],
    healthcheck: 4541448355,
    contact: 4541448425,
    knownIssues: 4541448499,
  },
  "Monavate": {
    mainPage: 4550983681,
    alarm: [4558684161],
    healthcheck: 4550983815,
    contact: 4550983885,
    knownIssues: 4550983959,
    slack: "C07UXR1G3S6",
  },
  "Aquarius Spectrum": {
    mainPage: 4334387203,
    alarm: [4343595115],
    healthcheck: 4345299003,
    contact: 4343595082,
    knownIssues: 4345331724,
    slack: "C07KV9Y4QB1",
  },
  "PriceShape": {
    mainPage: 4468047873,
    alarm: [4468867074],
    healthcheck: 4468048007,
    contact: 4468048077,
    knownIssues: 4468048151,
    slack: "C075F811M0W",
  },
  "Smart and Connective": {
    mainPage: 4290936833,
    alarm: [4290871329],
    healthcheck: 4290936967,
    contact: 4290937037,
    knownIssues: 4290937111,
    slack: "C076G8XTX51",
  },
  "GameStory": {
    mainPage: 4381114369,
    alarm: [4379836440],
    healthcheck: 4381114503,
    contact: 4381114573,
    knownIssues: 4381114647,
    slack: "C07GB7A779A",
  },
    "GravitySketch": {
    mainPage: 4547117057,
    alarm: [4611211273],
    healthcheck: 4547117191,
    contact: 4547117261,
    knownIssues: 4547117335,
    slack: "C07NU1FNMTJ",
  },
  "IDUN Technologies": {
    mainPage: 4242014209,
    alarm: [4267409413],
    healthcheck: 4242014344,
    contact: 4242014414,
    knownIssues: 4242014488,
    slack: "C075F7LCVSS",
  },
  "Ochre Bio":{
    mainPage: 4066148353,
    alarm: [4066148670],
    healthcheck: 4066148484,
    contact: 4066148552,
    knownIssues: 4066148624,
    slack: "C05RJN6RUK1",
  },
  Vainu: {
    mainPage: 4202004816,
    alarm: [4203577345],
    healthcheck: 4202004950,
    contact: 4202005020,
    knownIssues: 4202005094,
    slack: "C0757907EBH",
  },
  "AIT Website": {
    mainPage: 4054614028,
    alarm: [4057399301],
    healthcheck: 4054614159,
    contact: 4054614227,
    knownIssues: 4054614299,
    slack: "C075SMT0Z6E",
  },
  ACE: {
    mainPage: 4162224561,
    alarm: [4162224887],
    healthcheck: 4162224696,
    contact: 4162224766,
    knownIssues: 4162224840,
    slack: "C064QTA2GTX",
  },
  "Maelys Cosmetics USA Inc": {
    mainPage: 4162224129,
    alarm: [4162224454],
    healthcheck: 4162224263,
    contact: 4162224333,
    knownIssues: 4162224407,
    slack: "C07BY47M44V",
  },
  Natterbox: {
    mainPage: 3709534246,
    alarm: [4007919635, 5050040343,5160206337],
    healthcheck: 3709534374,
    contact: 3709534442,
    knownIssues: 3723657273,
    slack: "C060RPAC79Q",
  },
  Luzia: {
    mainPage: 3893952513,
    alarm: [4008214543],
    healthcheck: 3893952645,
    contact: 3893952713,
    knownIssues: 3893952785,
    slack: "C06FZN343S5",
  },
  LudiumLab: {
    mainPage: 3892772865,
    alarm: [3892773226],
    healthcheck: 3892772996,
    contact: 3892773064,
    knownIssues: 3892773136,
    slack: "C05LBEX9PFD",
  },
  Aptoide: {
    mainPage: 3973382145,
    alarm: [3972300844],
    healthcheck: 3973382277,
    contact: 3973382345,
    knownIssues: 3973382417,
    slack: "C063EF7D3U3",
  },
  HER: {
    mainPage: 3951394818,
    alarm: [3951395179],
    healthcheck: 3951394949,
    contact: 3951395017,
    knownIssues: 3951395089,
    slack: "C06G602STJ9",
  },
  "Agromentom LTD (Fieldin)": {
    mainPage: 3606151203,
    alarm: [3606151503],
    healthcheck: 3606151327,
    contact: 3606151393,
    knownIssues: 3722838111,
    slack: "C04PHBLRBFG",
  },
  AlgoSec: {
    mainPage: 3465806049,
    alarm: [3465805952],
    healthcheck: 3465805988,
    contact: 3465806012,
    knownIssues: 3722838058,
    slack: "",
  },
  BridgerPay: {
    mainPage: 3468230883,
    alarm: [3468230784],
    healthcheck: 3468230822,
    contact: 3468230846,
    knownIssues: 3723034636,
    slack: "C01NXMR3RFF",
  },
  CallVU: {
    mainPage: 3475439733,
    alarm: [3475439783],
    healthcheck: 3475439811,
    contact: 3475439835,
    knownIssues: 3722805381,
    slack: "C04C8M07Y3D",
  },
  FreeTV: {
    mainPage: 3543859230,
    alarm: [3543859312],
    healthcheck: 3543859333,
    contact: 3543859297,
    knownIssues: 3722805391,
    slack: "C051H97QJKX",
  },
  "Ifrågasätt Media Sverige": {
    mainPage: 3562405905,
    alarm: [3562406063],
    healthcheck: 3562405975,
    contact: 3562406005,
    knownIssues: 3723755587,
    slack: "C04G1Q5454L",
  },
  "Itamar Medical": {
    mainPage: 3468231148,
    alarm: [3468231049],
    healthcheck: 3468231087,
    contact: 3468231111,
    knownIssues: 3723657379,
    slack: "CTG2CEU4A",
  },
  "Il Makiage": {
    mainPage: 3451584532,
    alarm: [3449421825],
    healthcheck: 3449389109,
    contact: 3449389120,
    knownIssues: 3723034625,
    slack: "C01HYFGLDQR",
  },
  OOONA: {
    mainPage: 3468231413,
    alarm: [3468231314],
    healthcheck: 3468231352,
    contact: 3468231376,
    knownIssues: 3723657309,
    slack: "C02E909K24V",
  },
  "Paint Your Life": {
    mainPage: 3473277051,
    alarm: [3473277101],
    healthcheck: 3473277129,
    contact: 3473277153,
    knownIssues: 3722838027,
    slack: "C03UGKAALM6",
  },
  Powtoon: {
    mainPage: 3579248657,
    alarm: [3579248791],
    healthcheck: 3579248718,
    contact: 3579248742,
    knownIssues: 3722838070,
    slack: "C04JP6ZBVQX",
  },
  "Questar Auto": {
    mainPage: 3468231560,
    alarm: [3468231608, 3691118593],
    healthcheck: 3468231646,
    contact: 3468231670,
    knownIssues: 3723001857,
    slack: "CUV86UE5T",
  },
  RATAG: {
    mainPage: 3474456685,
    alarm: [3474456735],
    healthcheck: 3474456763,
    contact: 3474456787,
    knownIssues: 3723657329,
    slack: "C038X3Y1D6J",
  },
  RevealSecurity: {
    mainPage: 3474522221,
    alarm: [3474522271],
    healthcheck: 3474522299,
    contact: 3474522323,
    knownIssues: 3722838101,
    slack: "C03BN5T4H1C",
  },
  Revuze: {
    mainPage: 3480813677,
    alarm: [3480813727],
    healthcheck: 3480813755,
    contact: 3480813779,
    knownIssues: 3722838091,
    slack: "C04C3PVP38C",
  },
  Riverside: {
    mainPage: 3476390000,
    alarm: [3476390050],
    healthcheck: 3476390078,
    contact: 3476390102,
    knownIssues: 3723657217,
    slack: "C02NQK3QCHY",
  },
  Simgo: {
    mainPage: 3479863405,
    alarm: [3479863455],
    healthcheck: 3479863483,
    contact: 3479863507,
    knownIssues: 3723657349,
    slack: "C02AVQU53C4",
  },
  SpoiledChild: {
    mainPage: 4044521475,
    alarm: [4044521550],
    healthcheck: 4044521771,
    contact: 4044521741,
    knownIssues: 4044521717,
    slack: "C02LLHTP8N8",
  },
  Worthy: {
    mainPage: 3590193189,
    alarm: [3590193509],
    healthcheck: 3590193319,
    contact: 3590193389,
    knownIssues: 3723657369,
    slack: "C053WN73CSK",
  },
  Onport: {
    mainPage: 3664216107,
    alarm: [3664216407],
    healthcheck: 3664216230,
    contact: 3664216296,
    knownIssues: 3722805402,
    slack: "C0608RTUZ4P",
  },
"NOC Automation": {
    mainPage: 096294913,
    alarm: [4095508498],
    healthcheck: 4096295044,
    contact: 409629511,
    knownIssues: 4096295184,
    slack: "C079JDFCJKB",
  },
  "Groove Technologies N.V.": {
    mainPage: 3660087332,
    alarm: [3660087632],
    healthcheck: 3660087455,
    contact: 3660087521,
    knownIssues: 3723755577,
    slack: "C05HB83GR8A",
  },
  Uniqodo: {
    mainPage: 3692232742,
    alarm: [3692233054],
    healthcheck: 3692232870,
    contact: 3692232938,
    knownIssues: 3764682766,
    slack: "C04D12NG5LP",
  },
  Ethermail: {
    mainPage: 3842801732,
    alarm: [3842802094],
    healthcheck: 3842801864,
    contact: 3842801932,
    knownIssues: 3842802004,
    slack: "C0630HK8P6X",
  },
  AutoDS: {
    mainPage: 3734929409,
    alarm: [3734929764],
    healthcheck: 3734929540,
    contact: 3734929608,
    knownIssues: 3734929680,
    slack: "C050KPYBZ0B",
  },
  BeeHero: {
    mainPage: 3736797353,
    alarm: [3736830075],
    healthcheck: 3736829983,
    contact: 3736797253,
    knownIssues: 3736797284,
    slack: "C060UQD1W4F",
  },
  KITA: {
    mainPage: 4044522090,
    alarm: [4044522322],
    healthcheck: 4044522202,
    contact: 4044522268,
    knownIssues: 4044522220,
    slack: "C06DLMSR7Q9",
  },
  Phixt: {
    mainPage: 4048420865,
    alarm: [4048420940],
    healthcheck: 4048421161,
    contact: 4048421131,
    knownIssues: 4048421107,
    slack: "C09E484QH2M",
  },
  Albatross: {
    mainPage: 4299522183,
    alarm: [4336222209],
    healthcheck: 4336222209,
    contact: 4299522387,
    knownIssues: 4299522461,
    slack: "C07CU6NT6PM",
  },
  Net4Things: {
    mainPage: 4351787009,
    alarm: [4351164833],
    healthcheck: 4351787143,
    contact: 4351787213,
    knownIssues: 4351787287,
    slack: "C07FJJ65GPJ",
  },
  "oddity.com": {
    mainPage: 4546297857,
    alarm: [45631733771],
    healthcheck: 4563173426,
    contact: 4563107846,
    knownIssues: 4546297857,
    slack: "C06DLMSR7Q9",
  },
  "Cymulate": {
    mainPage: 3545858082,
    alarm: [3545858376],
    healthcheck: 3545858203,
    contact: 3545858267,
    knownIssues: 3723755521,
    slack: "C04F5DSJBA5",
  },
  "PFM-Intelligence": {
    mainPage: 4951375873,
    alarm: [5021827076],
    healthcheck: 4951376007,
    contact: 4951376077,
    knownIssues: 4951376151,
    slack: "C08MG35M98Q",
  },
  "Fero": {
    mainPage: 4985487361,
    alarm: [4985487686],
    healthcheck: 4985487495,
    contact: 4985487565,
    knownIssues: 4985487639,
    slack: "C08KPBXRQ0P",
  },
  "Fullpath": {
    mainPage: 4787044353,
    alarm: [4787044678],
    healthcheck: 4787044487,
    contact: 4787044557,
    knownIssues: 4787044631,
    slack: "C08E548FXNV",
  },
  "Hyperexponential": {
    mainPage: 4668293121,
    alarm: [4668293446],
    healthcheck: 4668293255,
    contact: 4668293325,
    knownIssues: 4668293399,
    slack: "C08CCD95JKA",
  },
  "Elearnio": {
    mainPage: 4930043991,
    alarm: [4930044364],
    healthcheck: 4930044143,
    contact: 4930044225,
    knownIssues: 4930044311,
    slack: "C088UUX7W87",
  },
  "Gamoshi": {
    mainPage: 5061050369,
    alarm: [5061050678],
    healthcheck: 5061050496,
    contact: 5061050563,
    knownIssues: 5061050635,
    slack: "C08TZLL1NCF",
  },
    "Tails": {
    mainPage: 5143429613,
    alarm: [5143429966],
    healthcheck: 5143429757,
    contact: 5143429835,
    knownIssues: 5143429917,
    slack: "C091PCMLQNM",
  },
    "Oddity-Vision": {
    mainPage: 5123342337,
    alarm: [5123604495],
    healthcheck: 5123604495,
    contact: 5123342521,
    knownIssues: 5123342506,
    slack: "C09ALCPKDS4",
  },
    "Z2A Digital": {
    mainPage: 5127929858,
    alarm: [5127930211],
    healthcheck: 5127930002,
    contact: 5127930080,
    knownIssues: 5127930162,
    slack: "C099ZBDT9AQ",
  }, 
    "Methodiq": {
    mainPage: 4048420865,
    alarm: [4048420940],
    healthcheck: 4048421161,
    contact: 4048421131,
    knownIssues: 4048421107,
    slack: "C0768DKPCHL",
  },
    "Aquassay": {
    mainPage: 5203787777,
    alarm: [5203788134],
    healthcheck: 5203787922,
    contact: 5203788001,
    knownIssues: 5203788085,
    slack: "C09CWNKQCF7",
  },
    "InCrowd Sports Ltd": {
    mainPage: 4969136129,
    alarm: [4968448016],
    healthcheck: 4969136263,
    contact: 4969136333,
    knownIssues: 4969136407,
    slack: "C07H35ZCN65",
  },
    "Aurasoft": {
    mainPage: 5261885651,
    alarm: [5263655040],
    healthcheck: 5263654974,
    contact: 5263654997,
    knownIssues: 5263655025,
    slack: "C09NDM0BHR6",
  },
   "Miio": {
    mainPage: 5201362945,
    alarm: [5228036126],
    healthcheck: 5201363090,
    contact: 5201363168,
    knownIssues: 5201363250,
    slack: "C099VHJ4C0J",
  },
   "Facewatch": {
    mainPage: 5281120257,
    alarm: [5281120598],
    healthcheck: 5281120396,
    contact: 5281120471,
    knownIssues: 5281120551,
    slack: "C09DABSV0US",
  },
   "Limina": {
    mainPage: 5306220545,
    alarm: [5306777602],
    healthcheck: 5306220684,
    contact: 5306220759,
    knownIssues: 5306220839,
    slack: "C09CAKW33JN",
  },
    "Franscape.io": {
    mainPage: 5389647873,
    alarm: [5389123612],
    healthcheck: 5389648012,
    contact: 5389648087,
    knownIssues: 5389648167,
    slack: "C09KRFB0JPR",
  }
};

const DEBUG_LOGGING = false;
const TAMPERMONKEY_OPTIMIZATIONS = true;

// Check if Tampermonkey parallel fix is loaded
const PARALLEL_FIX_LOADED = typeof window.GM_xmlhttpRequestOrig !== 'undefined';

// Optimized performance settings with parallel fix support
const MAX_CONCURRENT_REQUESTS = PARALLEL_FIX_LOADED ? 15 : 12;
const REQUEST_DELAY = PARALLEL_FIX_LOADED ? 0 : 5;
const DEBOUNCE_DELAY = 50;

let requestQueue = [];
let activeRequests = 0;

AWS.config.update({ region: AWS_REGION });
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
  Logins: {}
});

console.log(`PDDashboard: AWS signing enabled. Mode: aggressive (${MAX_CONCURRENT_REQUESTS} concurrent). Parallel fix: ${PARALLEL_FIX_LOADED ? 'ACTIVE' : 'FALLBACK'}`);

let credentialsReady = false;
let credentialsPromise = null;

setTimeout(() => {
  ensureCredentials().catch(err => {
    console.warn('Pre-initialization of credentials failed:', err.message);
  });
}, 100);

function ensureCredentials () {
  if (credentialsPromise) {
    return credentialsPromise;
  }

  if (credentialsReady && !AWS.config.credentials.expired) {
    return Promise.resolve();
  }

  credentialsPromise = new Promise((resolve, reject) => {
    AWS.config.credentials.get(err => {
      if (err) {
        console.error('Failed to obtain unauth credentials', err);
        credentialsReady = false;
        credentialsPromise = null;
        return reject(err);
      }
      credentialsReady = true;
      console.log('Obtained Cognito unauth credentials');
      setTimeout(() => {
        credentialsPromise = null;
      }, 30000);
      resolve();
    });
  });

  return credentialsPromise;
}

function processRequestQueue() {
  if (requestQueue.length === 0 || activeRequests >= MAX_CONCURRENT_REQUESTS) {
    return;
  }

  const request = requestQueue.shift();
  activeRequests++;

  request.execute().finally(() => {
    activeRequests--;
    if (REQUEST_DELAY > 0) {
      setTimeout(processRequestQueue, REQUEST_DELAY);
    } else {
      processRequestQueue();
    }
  });
}

function queueRequest(executeFunction) {
  if (!TAMPERMONKEY_OPTIMIZATIONS) {
    return executeFunction();
  }

  return new Promise((resolve, reject) => {
    requestQueue.push({
      execute: () => executeFunction().then(resolve).catch(reject)
    });
    processRequestQueue();
  });
}

function debounce(func, wait) {
  if (!TAMPERMONKEY_OPTIMIZATIONS) {
    return func;
  }

  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function signedRequest (url, opts = {}) {
  const maxRetries = 3;
  let retryCount = 0;

  const attemptRequest = function() {
    return queueRequest(() =>
      ensureCredentials().then(() => new Promise((resolve, reject) => {
      const options = { ...opts };
      const method = (options.method || 'GET').toUpperCase();
      let body = options.body || null;
      if (body && typeof body === 'object') {
        body = JSON.stringify(body);
      }

      // Build AWS HttpRequest
      const req = new AWS.HttpRequest(url, AWS_REGION);
      req.method = method;
      req.body = body;
      req.headers = {
        'Content-Type': 'application/json',
        'Host': new URL(url).host,
        ...(options.headers || {})
      };

      const signer = new AWS.Signers.V4(req, 'execute-api');
      signer.addAuthorization(AWS.config.credentials, new Date());

      if (DEBUG_LOGGING) {
        console.log('Making signed request:', {
          url: url,
          method: req.method,
          headers: {
            'Authorization': req.headers['Authorization'] ? 'present' : 'missing'
          }
        });
      }

      GM_xmlhttpRequest({
        method: req.method,
        url: url,
        headers: req.headers,
        data: req.body,
        anonymous: true,
        onload: resp => {
          if (DEBUG_LOGGING) {
            console.log('Response received:', {
              url: url,
              status: resp.status,
              attempt: retryCount + 1
            });
          }

          if (resp.status >= 200 && resp.status < 300) {
            resolve(resp);
          } else if (resp.status === 403 && retryCount < maxRetries) {
            console.warn('403 Forbidden received, retrying with new credentials (attempt', retryCount + 1, ')');

            credentialsReady = false;
            credentialsPromise = null;
            retryCount++;

            setTimeout(() => {
              attemptRequest().then(resolve).catch(reject);
            }, 1000 * retryCount);
          } else {
            const error = new Error(`Network response was not ok: ${resp.status} ${resp.statusText}`);
            error.response = resp;
            console.error('Request failed:', error.message, 'attempt:', retryCount + 1);
            reject(error);
          }
        },
        onerror: err => {
          console.error('Request error:', err, 'attempt:', retryCount + 1);

          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(() => {
              attemptRequest().then(resolve).catch(reject);
            }, 1000 * retryCount);
          } else {
            reject(err);
          }
        }
      });
    }))
    );
  }

  return attemptRequest();
}
(function () {
  const nativeFetch = window.fetch.bind(window);
  const fakeFetchResponse = function(gmResp) {
    return {
      ok: gmResp.status >= 200 && gmResp.status < 300,
      status: gmResp.status,
      statusText: gmResp.statusText,
      headers: {
        get: name => {
          const regex = new RegExp('^' + name + ': (.*)$', 'mi');
          const match = gmResp.responseHeaders.match(regex);
          return match ? match[1] : null;
        }
      },
      text: () => Promise.resolve(gmResp.responseText),
      json: () => Promise.resolve().then(() => JSON.parse(gmResp.responseText))
    };
  }

  window.fetch = (input, init = {}) => {
    const url = typeof input === 'string' ? input : input.url;
    if (url && url.startsWith(API_GATEWAY_BASE_URL)) {
      return signedRequest(url, init).then(fakeFetchResponse);
    }
    return nativeFetch(input, init);
  };
})();

const pattern =
  /\(Maintenance\)|(General security)|(AWS Technical Support \(PLS Team\))/gi
const patternOnlyResolvedMatch = /acknowledged|triggered|note/gi
const EMOJIES = ["💎", "👑", "⭐", "🌟", "🚀", "🥇"]
const CONFLUENCE_BASE_URL =
  "https://automat-it.atlassian.net/wiki/pages/viewpage.action?pageId="
const SLACK_BASE_URL = "https://automat-it.slack.com/archives/"

knownAlerts = {}
const serviceAlerts = [];
const pdAlerts = [];
const issues = [];


const VIP_CUSTOMER_LIST = [
  "algosec",
  "aptoide",
  "bizibox",
  "cobwebs",
  "cymulate",
  "datagen",
  "drivenets",
  "elementor",
  "freetv",
  "il makiage",
  "inteniq",
  "kenshoo",
  "lumigo",
  "powtoon",
  "questar auto",
  "revuze",
  "riverside",
  "soliduslabs",
  "tabit",
  "youappi",
]

const randomInteger = (min, max) => {
  const rand = min + Math.random() * (max - min)
  return Math.floor(rand)
}
const generateServiceName = (serviceName) => {
  if (serviceName && isVIP(serviceName.toLowerCase())) {
        const index = randomInteger(0, EMOJIES.length)
        return `${serviceName}  ${EMOJIES[index]}`
  }
  return serviceName
}
const isVIP = (serviceName) => {
  return VIP_CUSTOMER_LIST.includes(serviceName)
}

const getColorForTimeRange = (seconds) => {
  if (seconds <= 300) {
    return "green"
  } else if (seconds <= 1200) {
    return "blue"
  } else if (seconds <= 1200) {
    return "Crimson"
  } else {
    return "red"
  }
}


// Function to transform a text string into an HTML color code
function textToColorCode(text) {
    // Hash the input text to create a consistent numeric value
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the hash into a softened hexadecimal color code
    let color = "#";
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        // Adjust the value to make colors softer (closer to 128, the midpoint of 0-255)
        value = Math.floor((value + 128) / 2);
        color += ("00" + value.toString(16)).slice(-2);
    }

    return color;
}

// Function to change the background color of each table cell in a row
function setTableRowColors(row, color) {
    const cells = row.querySelectorAll("td");
    cells.forEach(cell => {
        cell.style.backgroundColor = color;
    });
}

const enhanceOpenIncidentTable = () => {
  let rowsCache = null;

  const hideColumns = () => {
    if (document.querySelector('style[data-pd-columns-hidden]')) { return; }
    const style = document.createElement("style");
    style.setAttribute('data-pd-columns-hidden', 'true');
    style.innerHTML = `
      .pd-incidents-table table th:nth-child(4),
      .pd-incidents-table table td:nth-child(4),
      .pd-incidents-table table th:nth-child(5),
      .pd-incidents-table table td:nth-child(5) {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  };

  hideColumns();

  const hideHeader = document.querySelector(".page-header");
  if (hideHeader) {
  hideHeader.style.display = "none";
  }

  const rows = TAMPERMONKEY_OPTIMIZATIONS && rowsCache ?
    rowsCache :
    document.querySelectorAll(".pd-incidents-table > table > tbody > tr");

  if (TAMPERMONKEY_OPTIMIZATIONS) {
    rowsCache = rows;
  }
  rows?.forEach((row) => {
    const serviceNameCellAnchor = row.querySelector("td:nth-child(8) > a")
    const alarmNameCellAnchor = row.querySelector("td:nth-child(6) > a")
    const serviceName = serviceNameCellAnchor?.textContent.trim()

    if (serviceNameCellAnchor && alarmNameCellAnchor) {
          const alarmName = alarmNameCellAnchor.textContent.trim();

          const alertObject = {
              service: serviceName,
              alert: alarmName
          };
          serviceAlerts.push(alertObject);
    }

    if (serviceNameCellAnchor) {
       row.querySelector("td:nth-child(8)").style.backgroundColor = textToColorCode(serviceName.replace(/(\s{2}.*)/mig,""))
       row.querySelector("td:nth-child(8) > a").style.fontWeight = "bold"
       row.querySelector("td:nth-child(8) > a").style.color = "Azure"
    }




    const alarmName = row
      ?.querySelector(".details-cell a")
      ?.innerHTML.substring(1)
      ?.slice(0, -1)
      ?.trim()
    const incidentLink = row
      ?.querySelector(".details-cell > a")
      ?.getAttribute("href")
    if (playbooks[serviceName] && !sessionStorage.getItem("priority" + alarmName)) {
            const arrStr = JSON.stringify(playbooks[serviceName].alarm)
            fetch(
              `https://vo8gfttl53.execute-api.eu-central-1.amazonaws.com/PROD/pd/priority?playbooks=${arrStr}&title=${encodeURIComponent(alarmName)}`
            )
              .then((response) => response.text())
              .then((status) => {
                const priority = JSON.parse(status)
                if (priority === "URGENT") {
                  alarmNameCellAnchor.textContent = "❗" + alarmName
                }
              })
      }

    if (highlightPattern.test(alarmName)) {
      alarmNameCellAnchor.style.backgroundColor = "lightpink"
    }
    const dateCell = row.querySelector(".pd-date-cell");
    const dateText = dateCell ? dateCell.textContent.trim().substring(3) : "";
    const parsedDate = parseDate(dateText)
    const timeDifference = calculateTimeDifference(parsedDate)
    const formattedDate = formatTime(timeDifference)
    const color = getColorForTimeRange(timeDifference / 1000)

    let durationCell = row.querySelector(".duration-cell")
    if (!durationCell) {
      durationCell = createTd(formattedDate, "duration-cell", color)
      row.append(durationCell)
    } else {
      durationCell.textContent = formattedDate
      durationCell.style.color = color
    }
    const integrationCell = createIntegrationCell(
      serviceName,
      alarmName,
      incidentLink
    )
    if (row.querySelector(".integration-cell") === null) {
      row.append(integrationCell)
    }

    if (pattern.test(serviceName)) {
      row.parentNode.removeChild(row)
      return
    }
  })
}

const removeRowsFromActivityTable = () => {
  const rows = document.querySelectorAll(".pd-fancy-list-table > tbody > tr")
  rows.forEach((row) => {
    const titleCellText = row.querySelector("td:nth-child(1)")?.innerHTML.trim()
    const activityCellText = row.querySelector("td.activity")?.innerHTML.trim()
    if (
      pattern.test(titleCellText) ||
      patternOnlyResolvedMatch.test(activityCellText)
    ) {
      row.parentNode.removeChild(row)
      return
    }
    const serviceNameCellAnchor = row.querySelector("td:nth-child(1) > a")
    const serviceName = serviceNameCellAnchor?.textContent.trim()

    if (serviceNameCellAnchor) {
       row.querySelector("td:nth-child(1)").style.backgroundColor = textToColorCode(serviceName.replace(/(\s{2}.*)/mig,""))
       row.querySelector("td:nth-child(1) > a").style.fontWeight = "bold"
       row.querySelector("td:nth-child(1) > a").style.color = "Azure"
    }

    const alarmName = row
      ?.querySelector("td:nth-child(2) > a")
      ?.innerHTML.trim()
      ?.split(" ")
      ?.slice(1)
      ?.join(" ")
    const incidentLink = row
      ?.querySelector("td:nth-child(2) > a")
      ?.getAttribute("href")
    if (serviceNameCellAnchor && serviceNameCellAnchor.textContent) {
      serviceNameCellAnchor.textContent = generateServiceName(serviceName)
    }
    const integrationCell = createIntegrationCell(
      serviceName,
      alarmName,
      incidentLink
    )
    if (row.querySelector(".integration-cell") === null) {
      row.append(integrationCell)
    }
  })
}

const calculateTimeDifference = (targetDate) => {
  const currentDate = new Date()
  return currentDate - targetDate
}

const formatTime = (difference) => {
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

  let message = ""

  if (days > 0) {
    message += `${days} d`
  }

  if (hours > 0) {
    if (message.length > 0) {
      message += ", "
    }
    message += `${hours} h`
  }

  if (minutes > 0) {
    if (message.length > 0) {
      message += ", "
    }
    message += `${minutes} m`
  }

  return message === "" ? "0 m" : message
}

const createTd = (text, className, color = "inherit") => {
  const tdEl = document.createElement("td")
  tdEl.className = className
  tdEl.textContent = text
  tdEl.style.color = color
  return tdEl
}

const createTh = (theadEl, thText) => {
  const thEl = document.createElement("th")
  thEl.className = thText
  const anchorEl = document.createElement("a")
  anchorEl.textContent = thText
  thEl.append(anchorEl)
  theadEl.append(thEl)
}

function getAnchorIcon(key) {
  const icons = {
    slack: "🔮",
    mainPage: "📜",
  }
  return icons[key] || ""
}

function getAnchorTitle(key) {
  const titles = {
    slack: "Slack channel",
    contact: "Contacts and Escalation",
    knownIssues: "Known issues and temporary policies",
  }
  return titles[key] || ""
}

function createButtonForPopup({
  title,
  link,
  emoji,
  hint,
  html,
  selector = null,
  attribute = null,
}) {
  const button = createAnchor(emoji, ``, hint)
  button.onclick = async (event) => {
    event.preventDefault()
    
    // Dynamic HTML retrieval if selector/attribute provided
    let actualHtml = html;
    if (selector && attribute) {
      try {
        const element = button.querySelector(selector);
        if (element) {
          actualHtml = element.getAttribute(attribute) || html;
        }
      } catch (error) {
        console.warn('Failed to get dynamic HTML, using fallback:', error);
      }
    }
    
    const divPopupEl = document.createElement("div")
    divPopupEl.id = "popup"
    divPopupEl.classList.add("popup-overlay-noc")
    divPopupEl.innerHTML = `
      <div class="popup-content-noc">
  <h3><a href=${link} target="_blank">${title}</a></h3>
          <div>${actualHtml}</div>
      </div>
  `
    document.body.appendChild(divPopupEl)

    const popup = document.getElementById("popup")

    popup.style.display = "flex"
    setTimeout(() => {
      popup.classList.add("active")
    }, 100)

    popup.addEventListener("click", (event) => {
      if (event.target === popup) {
        popup.style.display = "none"
        popup.parentNode.removeChild(popup)
      }
    })
  }
  return button
}

function createAlarmButton({ title, link }) {
  const alarmButton = createAnchor("🚨", ``, "Jump to alert in playbook")
  alarmButton.onclick = async (event) => {
    event.preventDefault()
    const htmlCode = alarmButton
      .querySelector(".alarm-html")
      .getAttribute("data-html-code")
    const divPopupEl = document.createElement("div")
    divPopupEl.id = "popup"
    divPopupEl.classList.add("popup-overlay-noc")
    divPopupEl.innerHTML = `
      <div class="popup-content-noc">
  <h3><a href=${link} target="_blank">${title}</a></h3>
          <div>${htmlCode}</div>
      </div>
  `
    document.body.appendChild(divPopupEl)

    const popup = document.getElementById("popup")

    popup.style.display = "flex"
    setTimeout(() => {
      popup.classList.add("active")
    }, 100)

    popup.addEventListener("click", (event) => {
      if (event.target === popup) {
        popup.style.display = "none"
        popup.parentNode.removeChild(popup)
      }
    })
  }
  return alarmButton
}
function createContactButton(link) {
  const contactButton = createAnchor("👤", ``, "Jump to contacts in playbook")
  contactButton.onclick = async (event) => {
    event.preventDefault()
    const htmlCode = contactButton
      .querySelector(".contact-html")
      .getAttribute("data-html-code-contact")
    const divPopupEl = document.createElement("div")
    divPopupEl.id = "popup"
    divPopupEl.classList.add("popup-overlay-noc")
    divPopupEl.innerHTML = `
      <div class="popup-content-noc">
        <h3><a href=${link} target="_blank">Link to playbook</a></h3>
          <div>${htmlCode}</div>
      </div>
  `
    document.body.appendChild(divPopupEl)

    const popup = document.getElementById("popup")

    popup.style.display = "flex"
    setTimeout(() => {
      popup.classList.add("active")
    }, 100)

    popup.addEventListener("click", (event) => {
      if (event.target === popup) {
        popup.style.display = "none"
        popup.parentNode.removeChild(popup)
      }
    })
  }
  return contactButton
}
function createKnownIssuesButton(link) {
    const knownIssuesButton = createAnchor("⚠️", ``, "Jump to Known Issues in playbook")
    knownIssuesButton.onclick = async (event) => {
      event.preventDefault()
      const htmlCode = knownIssuesButton
        .querySelector(".known-issues-html")
        .getAttribute("data-html-code-known-issues")
      const divPopupEl = document.createElement("div")
      divPopupEl.id = "popup"
      divPopupEl.classList.add("popup-overlay-noc")
      divPopupEl.innerHTML = `
        <div class="popup-content-noc">
          <h3><a href=${link} target="_blank">Link to Known Issues</a></h3>
          <div>${htmlCode}</div>
        </div>
      `
      document.body.appendChild(divPopupEl)

      const popup = document.getElementById("popup")

      popup.style.display = "flex"
      setTimeout(() => {
        popup.classList.add("active")
      }, 100)

      popup.addEventListener("click", (event) => {
        if (event.target === popup) {
          popup.style.display = "none"
          popup.parentNode.removeChild(popup)
        }
      })
    }
    return knownIssuesButton
  }

function checkForMatches() {
  setTimeout(() => {
    const rows = document.querySelectorAll(".pd-incidents-table > table > tbody > tr");

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");

      cells.forEach((cell) => {
        const cellText = cell.textContent.trim();

        const match = serviceAlerts.some(({ service, alert }) => {
          return (
            knownAlerts[service] &&
            knownAlerts[service].includes(alert) &&
            cellText.includes(alert)
          );
        });

        if (match) {
          cell.style.color = "white";
          cell.style.fontWeight = "bold";

          const highlightedText = cellText;
          let highlightedItems = JSON.parse(sessionStorage.getItem("highlightedItems")) || [];
          if (!highlightedItems.includes(highlightedText)) {
            highlightedItems.push(highlightedText);
            sessionStorage.setItem("highlightedItems", JSON.stringify(highlightedItems));
          }
        }
      });
    });
  }, 1500);
}

function restoreHighlightedItems() {
  const highlightedItems = JSON.parse(sessionStorage.getItem("highlightedItems")) || [];
  const rows = document.querySelectorAll(".pd-incidents-table > table > tbody > tr");

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    cells.forEach((cell) => {
      const cellText = cell.textContent.trim();
      if (highlightedItems.includes(cellText)) {
        cell.style.color = "white";
        cell.style.fontWeight = "bold";
      }
    });
  });
}

const createIntegrationCell = (serviceName, alarmName, incidentLink) => {
  const integrationCell = document.createElement("td")
  integrationCell.className = "integration-cell"
  for (const key in playbooks[serviceName]) {
    if (["slack", "mainPage"].includes(key)) {
      const confluenceChannelID = playbooks[serviceName][key]
      if (key === "slack") {
        const slackIcon = createAnchor(
          getAnchorIcon(key),
          `${SLACK_BASE_URL}${confluenceChannelID}`,
          getAnchorTitle(key)
        )
        slackIcon.style.order = "2"
        integrationCell.append(slackIcon)
      } else if (key === "mainPage") {
        const mainPageIcon = createAnchor(
          getAnchorIcon(key),
          `${CONFLUENCE_BASE_URL}${confluenceChannelID}`,
          getAnchorTitle(key)
        )
        mainPageIcon.style.order = "1"
        integrationCell.append(mainPageIcon)
      } else {
        const otherIcon = createAnchor(
          getAnchorIcon(key),
          `${CONFLUENCE_BASE_URL}${confluenceChannelID}`,
          getAnchorTitle(key)
        )
        otherIcon.style.order = "0"
        integrationCell.append(otherIcon)
      }
    }
  }

  if (playbooks[serviceName]) {
    const confluenceAlarmId = playbooks[serviceName].alarm[0]
    const slackChannelId = playbooks[serviceName].slack

    const copyMessageButton = createCopyMessageButton(
      incidentLink,
      slackChannelId
    )

    const PD_MESSAGE_API = `https://vo8gfttl53.execute-api.eu-central-1.amazonaws.com/PROD/pd/message?incident=${incidentLink}`
    const arrStr = JSON.stringify(playbooks[serviceName].alarm)
    const PD_ALERT_TABLE_API =
      `https://vo8gfttl53.execute-api.eu-central-1.amazonaws.com/PROD/pd/description?title=${encodeURIComponent(alarmName)}&playbooks=${arrStr}`
    const PD_CONTACT_TABLE_API = `https://vo8gfttl53.execute-api.eu-central-1.amazonaws.com/PROD/pd/contacts?page=${playbooks[serviceName]["contact"]}`
    const PD_KNOWNISSUES_TABLE_API = `https://vo8gfttl53.execute-api.eu-central-1.amazonaws.com/PROD/pd/knownissues?page=${playbooks[serviceName]["knownIssues"]}`
    const PD_HEALTHCHECK_API = `https://vo8gfttl53.execute-api.eu-central-1.amazonaws.com/PROD/pd/health?page=${playbooks[serviceName]["healthcheck"]}`
    if (playbooks[serviceName]["healthcheck"]) {
      if (!sessionStorage.getItem("health" + serviceName)) {
        fetch(PD_HEALTHCHECK_API)
          .then((response) => response.json())
          .then(({ html, link }) => {
            const healthButton = createButtonForPopup({
              title: "Link to healthcheck page",
              link,
              emoji: "💚️",
              hint: "Jump to healthchecks in playbook",
              html,
            })
            sessionStorage.setItem(
              "health" + serviceName,
              JSON.stringify({ html, link })
            )
            healthButton.style.order = "3"
            integrationCell.append(healthButton)
          })
          .catch((error) => console.log("ERROR", error))
      } else {
        const divElHiddenMessage = document.createElement("div")
        const storedData = sessionStorage.getItem("health" + serviceName)
        const { html, link } = JSON.parse(storedData)
        const healthButton = createButtonForPopup({
          title: "Link to healthcheck page",
          link,
          emoji: "💚️",
          hint: "Jump to healthchecks in playbook",
          html,
        })
        healthButton.append(divElHiddenMessage)
        healthButton.style.order = "3"
        integrationCell.append(healthButton)
      }
    }
    if (!sessionStorage.getItem("contact" + serviceName)) {
      fetch(PD_CONTACT_TABLE_API)
        .then((response) => response.json())
        .then(({ html, link }) => {
          const contactButton = createButtonForPopup({
            title: "Link to playbook",
            link,
            emoji: "👤",
            hint: "Jump to contacts in playbook",
            html,
          })
          sessionStorage.setItem(
            "contact" + serviceName,
            JSON.stringify({ html, link })
          )
          contactButton.style.order = "4"
          integrationCell.append(contactButton)
        })
        .catch((error) => console.log("ERROR", error))
    } else {
      const storedData = sessionStorage.getItem("contact" + serviceName)
      const { html, link } = JSON.parse(storedData)
      const contactButton = createButtonForPopup({
        title: "Link to playbook",
        link,
        emoji: "👤",
        hint: "Jump to contacts in playbook",
        html,
      })
      contactButton.style.order = "4"
      integrationCell.append(contactButton)
    }

    if (!sessionStorage.getItem("knownIssues" + serviceName)) {


      fetch(PD_KNOWNISSUES_TABLE_API)
        .then((response) => response.json())
        .then(({ html, link }) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const table = doc.querySelector('table.confluenceTable');
          if (table) {
            const rows = table.querySelectorAll('tr');

            rows.forEach((row) => {
              const alertNameCell = row.querySelector('td:nth-child(2)');
              if (alertNameCell) {
                const alertName = alertNameCell.textContent.trim();
                if (!knownAlerts[serviceName]) {
                  knownAlerts[serviceName] = [];
                }
                knownAlerts[serviceName].push(alertName);
              }
            });
          }

          const knownIssuesButton = createButtonForPopup({
            title: "Link to Known Issues",
            link,
            emoji: "⚠️",
            hint: "Jump to Known Issues in the Playbook",
            html,
          })

          sessionStorage.setItem(
            "knownIssues" + serviceName,
            JSON.stringify({ html, link })
          )
          knownIssuesButton.style.order = "5"
          integrationCell.append(knownIssuesButton)
        })
        .catch((error) => console.log("ERROR", error))
    } else {
      const storedData = sessionStorage.getItem("knownIssues" + serviceName)
      const { html, link } = JSON.parse(storedData)


      const knownIssuesButton = createButtonForPopup({
        title: "Link to Known Issues",
        link,
        emoji: "⚠️",
        hint: "Jump to Known Issues in the Playbook",
        html,
      })
      knownIssuesButton.style.order = "5"
      integrationCell.append(knownIssuesButton)
    }

    if (!sessionStorage.getItem("alarm" + incidentLink)) {
      fetch(PD_ALERT_TABLE_API)
        .then((response) => response.json())
        .then(({ html, title, link }) => {
          if (html.trim() === "") {
            html = `<p style="font-size: 18px;">The alert was not found automatically. Try checking manually in the <a href=${CONFLUENCE_BASE_URL}${confluenceAlarmId} target="_blank">playbook</a>.</p>`
            sessionStorage.setItem(
              "alarm" + incidentLink,
              JSON.stringify({
                html,
                link,
                title,
              })
            )
          } else {
            sessionStorage.setItem(
              "alarm" + incidentLink,
              JSON.stringify({
                link,
                title,
                html,
              })
            )
          }
          const alarmButton = createButtonForPopup({
            title,
            link: link,
            emoji: "🚨",
            hint: "Jump to alert in playbook",
            html,
          })
          alarmButton.style.order = "6"
          integrationCell.append(alarmButton)
        })
        .catch((error) => console.log("ERROR", error))
    } else {
      const storeData = sessionStorage.getItem("alarm" + incidentLink)

      const { html, title, link } = JSON.parse(storeData)
      const alarmButton = createButtonForPopup({
        title,
        link,
        emoji: "🚨",
        hint: "Jump to alert in playbook",
        html,
      })
      alarmButton.style.order = "6"
      integrationCell.append(alarmButton)
    }
    if (!sessionStorage.getItem("message" + incidentLink)) {
      fetch(PD_MESSAGE_API)
        .then((response) => response.text())
        .then((text) => {
          sessionStorage.setItem("message" + incidentLink, text)
          const divElHiddenMessage = document.createElement("div")
          divElHiddenMessage.style.display = "none"
          divElHiddenMessage.classList.add("slack-text-message")
          divElHiddenMessage.innerHTML = text
          copyMessageButton.append(divElHiddenMessage)
        })
        .then(() => {
          copyMessageButton.style.order = "7"
          integrationCell.append(copyMessageButton)
        })
    } else {
      const divElHiddenMessage = document.createElement("div")
      divElHiddenMessage.style.display = "none"
      divElHiddenMessage.classList.add("slack-text-message")
      divElHiddenMessage.innerHTML = sessionStorage.getItem(
        "message" + incidentLink
      )
      copyMessageButton.append(divElHiddenMessage)
      copyMessageButton.style.order = "7"
      integrationCell.append(copyMessageButton)
    }
  }
  return integrationCell
}
// Function to create and handle the copy message button
function createCopyMessageButton(incidentLink, slackChannelId) {
  const copyMessageButton = createAnchor(
    "✂️",
    ``,
    "Copy to clipboard for Slack"
  )
  copyMessageButton.onclick = async (event) => {
    event.preventDefault()
    const textToClipboard = copyMessageButton.querySelector(
      ".slack-text-message"
    ).textContent

    // Modern clipboard API with fallback
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(textToClipboard)
    } else {
      // Fallback for older browsers (deprecated API but necessary for compatibility)
      const textArea = document.createElement("textarea")
      textArea.value = textToClipboard
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }
    const messageDiv = document.createElement("div")
    messageDiv.textContent = "Copied"
    messageDiv.className = "message-div-noc"
    messageDiv.style.zIndex = 1000
    copyMessageButton.style.position = "relative"

    copyMessageButton.appendChild(messageDiv)

    setTimeout(() => {
      if (copyMessageButton.contains(messageDiv)) {
        copyMessageButton.removeChild(messageDiv)
      }
    }, 300)
    fetch(
      `${API_GATEWAY_BASE_URL}/pd/note?incident=${incidentLink}&slackId=${slackChannelId}`,
      {
        method: "POST",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText)
        }
      })
      .catch((error) => {
        console.error("Error:", error)
      })
    return copyMessageButton
  }
  return copyMessageButton
}

const createAnchor = (anchorText, href, title) => {
  const anchor = document.createElement("a")
  anchor.href = href
  anchor.title = title
  anchor.target = "_blank"
  anchor.innerHTML = anchorText
  anchor.classList.add("button-pd-noc")
  return anchor
}

const parseDate = (dateString) => {
  if (dateString.length <= 8) {
    const dateComponents = dateString.split(" ")
    let [hours, minutes] = dateComponents[0].split(":").map((el) => +el)
    if (dateComponents[1] === "PM" && hours !== 12) {
      hours += 12
    } else if (dateComponents[1] === "AM" && hours === 12) {
      hours = 0
    }

    return new Date().setHours(hours, minutes, 0, 0)
  }
  const dateComponents = dateString.split(/[\s,]+/)

  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  }
  const month = monthMap[dateComponents[0]]
  const day = parseInt(dateComponents[1])
  const year = parseInt(dateComponents[2])
  let [hours, minutes] = dateComponents[4].split(":").map((el) => +el)
  if (dateComponents[5] === "PM" && hours !== 12) {
    hours += 12
  } else if (dateComponents[5] === "AM" && hours === 12) {
    hours = 0
  }

  return new Date(year, month, day, hours, minutes)
}



const debouncedEnhanceTable = debounce(() => {
  enhanceOpenIncidentTable();
  checkForMatches();
  restoreHighlightedItems();
}, DEBOUNCE_DELAY);

const debouncedRemoveRows = debounce(removeRowsFromActivityTable, DEBOUNCE_DELAY);

const observerOpenIncidentsTable = new MutationObserver(debouncedEnhanceTable);
const observerActivityTable = new MutationObserver(debouncedRemoveRows)
const removeBlocks = () => {
  document
    .querySelectorAll(".pd-sidebar.sidebar.pd-col.pd-col-2")
    .forEach(function (element) {
      element.parentNode.removeChild(element)
    })
}

setTimeout(() => {
  const styleTag = document.createElement("style")
  styleTag.textContent = `
  .integration-cell a {
    text-decoration: none !important;
    font-size: 1.2em !important;
    margin: 0 2px !important;
  }

  .button-pd-noc {
    display: inline-block;
    padding: 8px 8px;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    border: 1px solid #ffffff;
    color: #f6f6f6;
    background-color: #e8e8e8 !important;
    border-radius: 5px;
    transition: background-color 0.3s ease; /* Smooth transition effect */
  }

  .button-pd-noc:hover {
    transform: scale(1.2); /* Enlarge slightly on hover */
    background-color: #87cefa; /* Light blue background on hover */
  }

  .popup-overlay-noc {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: none;
    align-items: center;
    justify-content: center;
    opacity: 0;          /* Start with opacity 0 (hidden) */
    transition: opacity 0.5s ease; /* Smooth opacity transition */
    z-index: 3;
  }
  .popup-overlay-noc.active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.5s ease, transform 0.5s ease;
   }

  .popup-content-noc {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    max-width: 90vw;           /* Limit width to 90% of viewport width */
    max-height: 80vh;          /* Limit height to 80% of viewport height */
    overflow-y: auto;          /* Enable vertical scrolling */
    overflow-x: auto;          /* Enable horizontal scrolling if needed */
    text-align: center;
    z-index: 1000;
    box-sizing: border-box;    /* Include padding in width/height calculations */
  }

  .close-btn-noc {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 20px;
    cursor: pointer;
  }
  .message-div-noc {
    position: absolute;
    background-color: #f0f0f0;
    color: #333;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
    font-family: Arial, sans-serif;
    top: 100%;
    left: 0;
    margin-top: 5px;
    z-index: 10
  }
  .popup-table-noc {
        font-size: 20px;
  }
  .popup-header-noc {
    margin-bottom: 15px;
  }
  .popup-content-noc table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1em;
    border: 1px solid;
  }
  .popup-content-noc th {
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    font-weight: bold;
  }
  .popup-content-noc td {
    border: 1px solid #ddd;
    padding: 8px;
    vertical-align: top;
  }
  .popup-content-noc ul {
    list-style-type: none;
  }
   .popup-content-noc a {
    text-decoration: none;
  }
   .popup-content-noc a:hover {
    color: #3D64CE; /* Change color on hover (example: blue) */
    transition: all 0.3s ease;
  }
  .confluenceTable td {
    text-align: left;
  }
  .confluenceTable th {
    text-align: left;
  }
  .confluenceTable th p {
    max-width:100%;
  }
.confluence-information-macro-body {
    padding: 15px;
    border: 1px solid #dfe1e5;
    border-radius: 8px;
    background-color: #f9fafb;
    width: 300px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin: 20px auto;
    font-family: Arial, sans-serif;
    font-size: 16px;
}

.confluence-information-macro-body > p {
    margin: 10px 0;
}

.confluence-information-macro-body > p > a {
    color: #1a73e8;
    text-decoration: none;
    font-weight: bold;
}

.confluence-information-macro-body > p > a:hover {
    text-decoration: underline;
}

.confluence-information-macro-body > p > a:visited {
    color: #4b6ea6;
}
  `
  document.head.appendChild(styleTag)
}, 1000)
const runScriptForIncidentPage = () => {
  setTimeout(() => {
    const incidentHeader = document.querySelector(
      '[data-testid="incidentHeader"]'
    )
    const serviceName = document.querySelector(
      'span[class^="ServicePopover_serviceName"]'
    ).textContent
    const alarmName = document.querySelector(
      'h1[class^="IncidentTitle_incidentTitle"]'
    ).textContent
    const incidentId = pageURL.match(/incidents\/([A-Z0-9]+)/)[1]
    const incidentLink = `/incidents/${incidentId}`
    integrationCell = createIntegrationCell(
      serviceName,
      alarmName,
      incidentLink
    )
    const table = document.createElement("table")
    table.append(integrationCell)
    incidentHeader.insertAdjacentElement("beforeend", table)
  }, 10000)
}
const runScriptForDashboardPage = () => {
  setTimeout(() => {
    const config = { childList: true }
    const openIncidentTable = document.querySelector(
      ".pd-incidents-table > table > tbody"
    )
    const trOpenIncidentTable = document.querySelector(
      ".pd-incidents-table > table > thead > tr"
    )
    const activityTbody = document.querySelector(".pd-fancy-list-table > tbody")
    const trActivityOverLastSevenDays = document.querySelector(
      ".pd-fancy-list-table > thead > tr"
    )
    observerOpenIncidentsTable.observe(openIncidentTable, config)
    observerActivityTable.observe(activityTbody, config)
    setInterval(() => {
      enhanceOpenIncidentTable()
      removeRowsFromActivityTable()
    }, 1000 * 60)
    createTh(trOpenIncidentTable, "Duration")
    createTh(trOpenIncidentTable, "Integration")
    createTh(trActivityOverLastSevenDays, "Integration")

    restoreHighlightedItems();
    enhanceOpenIncidentTable()
    removeRowsFromActivityTable()
    removeBlocks()
  }, 3000)
}

const pageURL = window.location.href

if (pageURL.startsWith("https://automat-it.pagerduty.com/incidents/")) {
  runScriptForIncidentPage()
} else if (pageURL.startsWith("https://automat-it.pagerduty.com/incidents")) {
  runScriptForDashboardPage()
} else {
  console.log("This is some other page.")
}
