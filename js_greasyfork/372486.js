// ==UserScript==
// @name         City Finds
// @version      0.5
// @author       tos
// @match        *.torn.com/city.php*
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/71540
// @description  description
// @downloadURL https://update.greasyfork.org/scripts/372486/City%20Finds.user.js
// @updateURL https://update.greasyfork.org/scripts/372486/City%20Finds.meta.js
// ==/UserScript==

const persistent_toggles = true

GM_addStyle(`
.x_city_find {
    box-sizing: border-box;
    box-shadow: rgb(0, 0, 0) 0px 0px 20px 10px;
    display: block !important;
    width: 40px !important;
    height: 40px !important;
    left: -20px !important;
    top: -20px !important;
    z-index: 999 !important;
    padding: 10px 0px;
    border-width: initial;
    border-style: none;
    border-color: initial;
    border-image: initial;
    border-radius: 100%;
    background: rgba(18, 71, 7, 0.5);
    transition: width 50ms cubic-bezier(0.65, 0.05, 0.36, 1), height 50ms cubic-bezier(0.65, 0.05, 0.36, 1), left 50ms cubic-bezier(0.65, 0.05, 0.36, 1), top 50ms cubic-bezier(0.65, 0.05, 0.36, 1), padding 50ms cubic-bezier(0.65, 0.05, 0.36, 1), background 50ms 0ms;
    animation: svelte-1dz9z41-fade-in 500ms ease-out backwards;
}

.x_city_find:hover {
    width: 150px !important;
    height: 150px !important;
    left: -75px !important;
    top: -75px !important;
    z-index: 1000 !important;
    padding: 37.5px 0px;
    background: black;
}

#x_type_toggles {
  background-color: #333;
  border-radius: 0px 0px 5px 5px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-top: 3px;
}

#x_type_toggles li{
  cursor: pointer;
  height: 32px;
}

.x_type_present {
  border-bottom: 3px solid #848484;
}

`)

const type_list = ['Melee', 'Secondary', 'Primary', 'Defensive', 'Candy', 'Electronic', 'Clothing', 'Jewelry', 'Other', 'Medical', 'Virus', 'Collectible', 'Car', 'Flower', 'Booster', 'Unused', 'Alcohol', 'Plushie', 'Drug', 'Temporary', 'Special', 'Supply Pack', 'Enhancer', 'Artifact', 'Energy Drink', 'Book']
const type_map = {
  '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 0, '12': 1, '13': 1, '14': 1, '15': 1, '16': 1, '17': 1, '18': 1, '19': 1, '20': 1, '21': 1, '22': 2, '23': 2, '24': 2, '25': 2, '26': 2, '27': 2, '28': 2, '29': 2, '30': 2, '31': 2, '32': 3, '33': 3, '34': 3, '35': 4, '36': 4, '37': 4, '38': 4, '39': 4, '40': 5, '41': 5, '42': 5, '43': 5, '44': 5, '45': 5, '46': 6, '47': 6, '48': 6, '49': 3, '50': 3, '51': 7, '52': 7, '53': 7, '54': 7, '55': 7, '56': 7, '57': 7, '58': 7, '59': 7, '60': 7, '61': 5, '62': 5, '63': 2, '64': 8, '65': 5, '66': 9, '67': 9, '68': 9, '69': 10, '70': 10, '71': 10, '72': 10, '73': 10, '74': 11, '75': 11, '76': 2, '77': 12, '78': 12, '79': 12, '80': 12, '81': 12, '82': 12, '83': 12, '84': 12, '85': 12, '86': 12, '87': 12, '88': 12, '89': 12, '90': 12, '91': 12, '92': 12, '93': 12, '94': 12, '95': 12, '96': 8, '97': 13, '98': 2, '99': 1,
  '100': 2, '101': 6, '102': 11, '103': 10, '104': 5, '105': 5, '106': 14, '107': 6, '108': 2, '109': 1, '110': 0, '111': 0, '112': 11, '113': 11, '114': 11, '115': 11, '116': 11, '117': 11, '118': 11, '119': 11, '120': 11, '121': 11, '122': 11, '123': 11, '124': 11, '125': 11, '126': 11, '127': 11, '128': 11, '129': 13, '130': 11, '131': 11, '132': 11, '133': 11, '134': 11, '135': 11, '136': 11, '137': 11, '138': 11, '139': 11, '140': 11, '141': 11, '142': 11, '143': 11, '144': 11, '145': 5, '146': 0, '147': 0, '148': 11, '149': 11, '150': 11, '151': 4, '152': 11, '153': 11, '154': 5, '155': 11, '156': 11, '157': 11, '158': 11, '159': 8, '160': 8, '161': 11, '162': 11, '163': 11, '164': 11, '165': 11, '166': 11, '167': 8, '168': 15, '169': 11, '170': 0, '171': 11, '172': 8, '173': 0, '174': 2, '175': 0, '176': 3, '177': 1, '178': 3, '179': 11, '180': 16, '181': 16, '182': 8, '183': 13, '184': 13, '185': 11, '186': 17, '187': 17, '188': 11, '189': 1, '190': 8, '191': 8, '192': 11, '193': 11, '194': 11, '195': 11, '196': 18, '197': 18, '198': 18, '199': 18,
  '200': 18, '201': 18, '202': 11, '203': 18, '204': 18, '205': 18, '206': 18, '207': 11, '208': 15, '209': 4, '210': 4, '211': 11, '212': 11, '213': 11, '214': 11, '215': 17, '216': 11, '217': 0, '218': 1, '219': 2, '220': 19, '221': 19, '222': 19, '223': 2, '224': 0, '225': 2, '226': 19, '227': 0, '228': 2, '229': 19, '230': 1, '231': 2, '232': 2, '233': 1, '234': 0, '235': 0, '236': 0, '237': 0, '238': 0, '239': 19, '240': 2, '241': 2, '242': 19, '243': 1, '244': 1, '245': 0, '246': 19, '247': 0, '248': 1, '249': 2, '250': 0, '251': 0, '252': 2, '253': 1, '254': 1, '255': 1, '256': 19, '257': 19, '258': 17, '259': 8, '260': 13, '261': 17, '262': 8, '263': 13, '264': 13, '265': 8, '266': 17, '267': 13, '268': 17, '269': 17, '270': 8, '271': 13, '272': 13, '273': 17, '274': 17, '275': 8, '276': 13, '277': 13, '278': 6, '279': 8, '280': 8, '281': 17, '282': 13, '283': 20, '284': 11, '285': 11, '286': 11, '287': 11, '288': 11, '289': 0, '290': 0, '291': 0, '292': 0, '293': 8, '294': 16, '295': 8, '296': 8, '297': 11, '298': 11, '299': 11,
  '300': 11, '301': 8, '302': 8, '303': 8, '304': 8, '305': 8, '306': 8, '307': 8, '308': 8, '309': 8, '310': 4, '311': 11, '312': 11, '313': 11, '314': 11, '315': 15, '316': 15, '317': 15, '318': 15, '319': 15, '320': 15, '321': 15, '322': 15, '323': 15, '324': 15, '325': 15, '326': 8, '327': 8, '328': 8, '329': 14, '330': 14, '331': 14, '332': 3, '333': 3, '334': 3, '335': 8, '336': 20, '337': 20, '338': 11, '339': 11, '340': 11, '341': 11, '342': 11, '343': 11, '344': 11, '345': 8, '346': 0, '347': 6, '348': 6, '349': 11, '350': 11, '351': 11, '352': 11, '353': 11, '354': 11, '355': 11, '356': 11, '357': 11, '358': 8, '359': 0, '360': 0, '361': 9, '362': 11, '363': 11, '364': 21, '365': 21, '366': 14, '367': 14, '368': 14, '369': 21, '370': 21, '371': 11, '372': 8, '373': 21, '374': 21, '375': 21, '376': 21, '377': 8, '378': 8, '379': 8, '380': 20, '381': 5, '382': 2, '383': 5, '384': 17, '385': 13, '386': 22, '387': 0, '388': 2, '389': 11, '390': 11, '391': 0, '392': 19, '393': 1, '394': 19, '395': 0, '396': 20, '397': 0, '398': 2, '399': 2,
  '400': 0, '401': 0, '402': 0, '403': 8, '404': 6, '405': 8, '406': 8, '407': 8, '408': 8, '409': 8, '410': 8, '411': 8, '412': 6, '413': 6, '414': 6, '415': 8, '416': 8, '417': 5, '418': 8, '419': 22, '420': 22, '421': 22, '422': 8, '423': 11, '424': 11, '425': 11, '426': 16, '427': 8, '428': 20, '429': 8, '430': 6, '431': 8, '432': 8, '433': 8, '434': 8, '435': 13, '436': 8, '437': 8, '438': 0, '439': 0, '440': 0, '441': 11, '442': 11, '443': 11, '444': 11, '445': 11, '446': 11, '447': 11, '448': 11, '449': 11, '450': 23, '451': 23, '452': 23, '453': 23, '454': 23, '455': 23, '456': 23, '457': 23, '458': 23, '459': 23, '460': 23, '461': 23, '462': 23, '463': 19, '464': 19, '465': 19, '466': 8, '467': 8, '468': 11, '469': 11, '470': 11, '471': 8, '472': 4, '473': 4, '474': 4, '475': 4, '476': 4, '477': 4, '478': 4, '479': 11, '480': 11, '481': 11, '482': 11, '483': 2, '484': 2, '485': 2, '486': 2, '487': 2, '488': 2, '489': 1, '490': 1, '491': 8, '492': 8, '493': 8, '494': 12, '495': 12, '496': 12, '497': 12, '498': 12, '499': 12,
  '500': 12, '501': 12, '502': 12, '503': 12, '504': 12, '505': 12, '506': 12, '507': 12, '508': 12, '509': 12, '510': 12, '511': 12, '512': 12, '513': 12, '514': 12, '515': 12, '516': 12, '517': 12, '518': 12, '519': 12, '520': 12, '521': 12, '522': 12, '523': 12, '524': 12, '525': 11, '526': 11, '527': 4, '528': 4, '529': 4, '530': 24, '531': 16, '532': 24, '533': 24, '534': 8, '535': 8, '536': 8, '537': 8, '538': 3, '539': 0, '540': 8, '541': 16, '542': 16, '543': 8, '544': 22, '545': 2, '546': 2, '547': 2, '548': 2, '549': 2, '550': 16, '551': 16, '552': 16, '553': 24, '554': 24, '555': 24, '556': 4, '557': 8, '558': 8, '559': 8, '560': 8, '561': 14, '562': 6, '563': 14, '564': 22, '565': 22, '566': 22, '567': 22, '568': 22, '569': 22, '570': 22, '571': 22, '572': 22, '573': 22, '574': 22, '575': 22, '576': 22, '577': 22, '578': 22, '579': 22, '580': 20, '581': 19, '582': 8, '583': 4, '584': 4, '585': 4, '586': 4, '587': 4, '588': 21, '589': 15, '590': 15, '591': 15, '592': 15, '593': 11, '594': 11, '595': 8, '596': 8, '597': 8, '598': 6, '599': 0,
  '600': 0, '601': 8, '602': 8, '603': 8, '604': 0, '605': 0, '606': 6, '607': 6, '608': 6, '609': 6, '610': 6, '611': 19, '612': 2, '613': 1, '614': 0, '615': 0, '616': 19, '617': 13, '618': 17, '619': 8, '620': 8, '621': 6, '622': 6, '623': 6, '624': 6, '625': 6, '626': 6, '627': 20, '628': 20, '629': 20, '630': 11, '631': 11, '632': 0, '633': 6, '634': 4, '635': 6, '636': 8, '637': 8, '638': 16, '639': 8, '640': 3, '641': 3, '642': 3, '643': 3, '644': 3, '645': 3, '646': 3, '647': 3, '648': 3, '649': 3, '650': 3, '651': 3, '652': 3, '653': 3, '654': 3, '655': 3, '656': 3, '657': 3, '658': 3, '659': 3, '660': 3, '661': 3, '662': 3, '663': 3, '664': 3, '665': 3, '666': 3, '667': 3, '668': 3, '669': 3, '670': 3, '671': 3, '672': 3, '673': 3, '674': 3, '675': 3, '676': 3, '677': 3, '678': 3, '679': 3, '680': 3, '681': 3, '682': 3, '683': 3, '684': 3, '685': 11, '686': 11, '687': 11, '688': 11, '689': 11, '690': 11, '691': 11, '692': 11, '693': 11, '694': 11, '695': 11, '696': 8, '697': 8, '698': 8, '699': 9,
  '700': 8, '701': 8, '702': 8, '703': 6, '704': 6, '705': 8, '706': 8, '707': 8, '708': 11, '709': 11, '710': 11, '711': 11, '712': 11, '713': 11, '714': 11, '715': 11, '716': 11, '717': 11, '718': 11, '719': 11, '720': 11, '721': 11, '722': 11, '723': 11, '724': 11, '725': 11, '726': 6, '727': 6, '728': 6, '729': 6, '730': 6, '731': 9, '732': 9, '733': 9, '734': 9, '735': 9, '736': 9, '737': 9, '738': 9, '739': 9, '740': 11, '741': 11, '742': 19, '743': 6, '744': 25, '745': 25, '746': 25, '747': 25, '748': 25, '749': 25, '750': 25, '751': 25, '752': 25, '753': 25, '754': 25, '755': 25, '756': 25, '757': 25, '758': 25, '759': 25, '760': 25, '761': 25, '762': 25, '763': 25, '764': 25, '765': 25, '766': 25, '767': 25, '768': 25, '769': 25, '770': 25, '771': 25, '772': 25, '773': 25, '774': 25, '775': 25, '776': 25, '777': 25, '778': 25, '779': 25, '780': 25, '781': 25, '782': 25, '783': 25, '784': 25, '785': 25, '786': 25, '787': 25, '788': 8, '789': 8, '790': 0, '791': 6, '792': 0, '793': 8, '794': 8, '795': 8, '796': 9, '797': 9, '798': 8, '799': 8,
  '800': 8, '801': 8, '802': 8, '803': 6, '804': 9, '805': 0, '806': 6, '807': 6, '808': 6, '809': 6, '810': 6, '811': 6, '812': 6, '813': 6, '814': 19, '815': 21, '816': 16, '817': 21, '818': 21, '819': 22, '820': 20, '821': 8, '822': 8, '823': 8, '824': 8, '825': 8, '826': 8, '827': 5, '828': 6, '829': 11, '830': 2, '831': 1, '832': 0, '833': 19, '834': 6, '835': 6, '836': 6, '837': 2, '838': 1, '839': 0, '840': 19, '841': 6, '842': 6, '843': 6, '844': 1, '845': 0, '846': 0, '847': 19, '848': 3, '849': 6, '850': 0, '851': 6, '852': 5, '853': 11, '854': 8, '855': 8, '856': 11, '857': 11, '858': 11, '859': 11, '860': 11, '861': 11, '862': 11, '863': 11, '864': 8, '865': 20, '866': 11, '867': 11, '868': 8, '869': 6, '870': 18, '871': 0, '872': 8, '873': 16, '874': 2, '875': 11, '876': 11, '877': 11, '878': 11, '879': 11, '880': 11, '881': 11, '882': 11, '883': 11, '884': 11, '885': 11, '886': 11, '887': 11, '888': 11, '889': 11, '890': 11, '891': 11, '892': 11, '893': 11, '894': 11, '895': 11, '896': 11, '897': 11, '898': 11, '899': 11,
  '900': 11, '901': 13, '902': 13, '903': 13, '904': 11, '905': 11, '906': 11, '907': 11, '908': 11, '909': 11, '910': 11, '911': 11, '912': 11, '913': 11, '914': 11, '915': 11, '916': 11, '917': 11, '918': 11, '919': 11
}

let x_active_toggles = []
let stored_toggle_states = JSON.parse(localStorage.getItem('x_active_toggles'))
if(persistent_toggles && stored_toggle_states) x_active_toggles = stored_toggle_states

document.querySelector('#map-cont .page-head-delimiter').insertAdjacentHTML('beforebegin', `
<ul id="x_type_toggles">
<li class=${x_active_toggles.indexOf('All') > -1 ? "" : "ui-state-disabled"}><a class="all-category-icon" data-item_type="All"></a></li>
<li class=${x_active_toggles.indexOf('Primary') > -1 ? "" : "ui-state-disabled"}><a class="primary-category-icon" data-item_type="Primary"></a></li>
<li class=${x_active_toggles.indexOf('Secondary') > -1 ? "" : "ui-state-disabled"}><a class="secondary-category-icon" data-item_type="Secondary"></a></li>
<li class=${x_active_toggles.indexOf('Melee') > -1 ? "" : "ui-state-disabled"}><a class="melee-category-icon" data-item_type="Melee"></a></li>
<li class=${x_active_toggles.indexOf('Temporary') > -1 ? "" : "ui-state-disabled"}><a class="temporary-category-icon" data-item_type="Temporary"></a></li>
<li class=${x_active_toggles.indexOf('Defensive') > -1 ? "" : "ui-state-disabled"}><a class="armour-category-icon" data-item_type="Defensive"></a></li>
<li class=${x_active_toggles.indexOf('Clothing') > -1 ? "" : "ui-state-disabled"}><a class="clothes-category-icon" data-item_type="Clothing"></a></li>
<li class=${x_active_toggles.indexOf('Medical') > -1 ? "" : "ui-state-disabled"}><a class="medical-category-icon" data-item_type="Medical"></a></li>
<li class=${x_active_toggles.indexOf('Drug') > -1 ? "" : "ui-state-disabled"}><a class="drugs-category-icon" data-item_type="Drug"></a></li>
<li class=${x_active_toggles.indexOf('Energy Drink') > -1 ? "" : "ui-state-disabled"}><a class="energy-d-category-icon" data-item_type="Energy Drink"></a></li>
<li class=${x_active_toggles.indexOf('Alcohol') > -1 ? "" : "ui-state-disabled"}><a class="alcohol-category-icon" data-item_type="Alcohol"></a></li>
<li class=${x_active_toggles.indexOf('Candy') > -1 ? "" : "ui-state-disabled"}><a class="candy-category-icon" data-item_type="Candy"></a></li>
<li class=${x_active_toggles.indexOf('Booster') > -1 ? "" : "ui-state-disabled"}><a class="boosters-category-icon" data-item_type="Booster"></a></li>
<li class=${x_active_toggles.indexOf('Enhancer') > -1 ? "" : "ui-state-disabled"}><a class="enhancers-category-icon" data-item_type="Enhancer"></a></li>
<li class=${x_active_toggles.indexOf('Supply Pack') > -1 ? "" : "ui-state-disabled"}><a class="supply-pck-category-icon" data-item_type="Supply Pack"></a></li>
<li class=${x_active_toggles.indexOf('Electronic') > -1 ? "" : "ui-state-disabled"}><a class="electrical-category-icon" data-item_type="Electronic"></a></li>
<li class=${x_active_toggles.indexOf('Jewelry') > -1 ? "" : "ui-state-disabled"}><a class="jewelry-category-icon" data-item_type="Jewelry"></a></li>
<li class=${x_active_toggles.indexOf('Flower') > -1 ? "" : "ui-state-disabled"}><a class="flowers-category-icon" data-item_type="Flower"></a></li>
<li class=${x_active_toggles.indexOf('Plushie') > -1 ? "" : "ui-state-disabled"}><a class="plushies-category-icon" data-item_type="Plushie"></a></li>
<li class=${x_active_toggles.indexOf('Car') > -1 ? "" : "ui-state-disabled"}><a class="cars-category-icon" data-item_type="Car"></a></li>
<li class=${x_active_toggles.indexOf('Virus') > -1 ? "" : "ui-state-disabled"}><a class="viruses-category-icon" data-item_type="Virus"></a></li>
<li class=${x_active_toggles.indexOf('Artifact') > -1 ? "" : "ui-state-disabled"}><a class="artifacts-category-icon" data-item_type="Artifact"></a></li>
<li class=${x_active_toggles.indexOf('Book') > -1 ? "" : "ui-state-disabled"}><a class="books-category-icon" data-item_type="Book"></a></li>
<li class=${x_active_toggles.indexOf('Special') > -1 ? "" : "ui-state-disabled"}><a class="special-category-icon" data-item_type="Special"></a></li>
<li class=${x_active_toggles.indexOf('Collectible') > -1 ? "" : "ui-state-disabled"}><a class="collectibles-category-icon" data-item_type="Collectible"></a></li>
<li class=${x_active_toggles.indexOf('Other') > -1 ? "" : "ui-state-disabled"}><a class="miscellaneous-category-icon" data-item_type="Other"></a></li>
</ul>
`)
document.querySelectorAll('#x_type_toggles a').forEach((a) => {
  a.addEventListener('click', function(e) {
    this.parentElement.classList.toggle('ui-state-disabled')
    const item_type = this.getAttribute('data-item_type')
    if (item_type === 'All') {
      if (this.parentElement.classList.contains('ui-state-disabled')) {
        x_active_toggles = []
        document.querySelectorAll('#x_type_toggles li').forEach((li) => li.classList.add('ui-state-disabled'))
        document.querySelectorAll(`img[data-item_type]`).forEach((img) => img.classList.remove('x_city_find'))
      }
      else {
        type_list.forEach((t) => x_active_toggles.push(t))
        x_active_toggles.push('All')
        document.querySelectorAll('#x_type_toggles li').forEach((li) => li.classList.remove('ui-state-disabled'))
        document.querySelectorAll(`img[data-item_type]`).forEach((img) => img.classList.add('x_city_find'))
      }
    }
    else {
      if (this.parentElement.classList.contains('ui-state-disabled')) {
        x_active_toggles.splice(x_active_toggles.indexOf(item_type), 1)
        document.querySelectorAll(`img[data-item_type="${item_type}"]`).forEach((img) => img.classList.remove('x_city_find'))
      }
      else {
        x_active_toggles.push(item_type)
        document.querySelectorAll(`img[data-item_type="${item_type}"]`).forEach((img) => img.classList.add('x_city_find'))
      }
    }
    localStorage.setItem('x_active_toggles', JSON.stringify(x_active_toggles))
  })
})

let item_types_present = []
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.tagName && node.tagName === 'IMG' && node.src.includes('torn.com/images/items/')) {
        node.src = node.src.replace('small.png', 'large.png')
        const itemID = node.src.split('/items/')[1].split('/large')[0]
        const itemType = type_list[type_map[itemID]]
        node.classList.add('x_items')
        node.setAttribute('data-item_type', itemType)
        if (x_active_toggles.indexOf(itemType) > -1) node.classList.add('x_city_find')
        if (item_types_present.indexOf(itemType) < 0) {
          item_types_present.push(itemType)
          document.querySelector(`#x_type_toggles [data-item_type="${itemType}"]`).classList.add('x_type_present')
        }
      }
    }
  }
})

const wrapper = document.querySelector('#map')
observer.observe(wrapper, { subtree: true, childList: true })