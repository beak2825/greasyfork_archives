// ==UserScript==
// @name         GeoGuessr country-wise score
// @version      0.5
// @description  Adds an analysis tool to the GeoGuessr website
// @match        https://www.geoguessr.com/*
// @run-at document-start
// @author       eru
// @license      MIT
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151654
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @namespace https://greasyfork.org/users/1348455
// @downloadURL https://update.greasyfork.org/scripts/503101/GeoGuessr%20country-wise%20score.user.js
// @updateURL https://update.greasyfork.org/scripts/503101/GeoGuessr%20country-wise%20score.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

/*
                  THIS SCRIPT WAS SUPPOSED TO WORK FOR BOTH SOLO AND MULTIPLAYER
                  HOWEVER, I FOUND OUT THAT IT IS NOT ALLOWED TO QUERY THE API FROM A MULTIPLAYER GAME
                  SO IGNORE ALL CODE SNIPPETS RELATED TO MULTIPLAYER LIKE getDuelData
*/

const AUTOMATIC = true;
//                ^^^^ Replace with false for a manual counter

const API_Key = '';
//               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Replace INSERT_BIGDATACLOUD_API_KEY_HERE with your API key (keep the quote marks)
//               THIS IS OPTIONAL: if you don't provide an API key, the script will use another method to get the country

const statsServerUrl = 'https://ggstats.eu';

const DefaultCountryDict = {
    "AF":{"referent":"AF", "diag":1142.1295898452154, "alpha":175.3515519520104, "fullname":"Afghanistan"},
    "AX":{"referent":"FI", "diag":56.213877290220786, "alpha":25.63268878594707, "fullname":"Åland Islands"},
    "AL":{"referent":"AL", "diag":239.78323544401513, "alpha":46.309802998440105, "fullname":"Albania"},
    "DZ":{"referent":"DZ", "diag":2182.5402630879457, "alpha":318.79648181423624, "fullname":"Algeria"},
    "AS":{"referent":"US", "diag":19.949937343260004, "alpha":20.632857031043354, "fullname":"American Samoa"},
    "AD":{"referent":"AD", "diag":30.59411708155671, "alpha":22.100406004990372, "fullname":"Andorra"},
    "AO":{"referent":"AO", "diag":1579.0503475190396, "alpha":235.5912909817255, "fullname":"Angola"},
    "AI":{"referent":"GB", "diag":13.490737563232042, "alpha":19.742305364051706, "fullname":"Anguilla"},
    "AQ":{"referent":"AQ", "diag":5291.502622129181, "alpha":747.4396118842076, "fullname":"Antarctica"},
    "AG":{"referent":"AG", "diag":29.732137494637012, "alpha":21.981561971025414, "fullname":"Antigua and Barbuda"},
    "AR":{"referent":"AR", "diag":2358.1348561946156, "alpha":396.0216955729648, "fullname":"Argentina"},
    "AM":{"referent":"AM", "diag":243.89751946258085, "alpha":51.50926577625275, "fullname":"Armenia"},
    "AW":{"referent":"NL", "diag":18.973665961010276, "alpha":20.498255201636095, "fullname":"Aruba"},
    "AU":{"referent":"AU", "diag":3922.2503744661685, "alpha":512.8761793857648, "fullname":"Australia"},
    "AT":{"referent":"AT", "diag":409.56318193900194, "alpha":83.53194032530612, "fullname":"Austria"},
    "AZ":{"referent":"AZ", "diag":416.17304093369626, "alpha":75.26147317852835, "fullname":"Azerbaijan"},
    "BS":{"referent":"BS", "diag":166.99101772251106, "alpha":40.905906899060895, "fullname":"Bahamas"},
    "BH":{"referent":"BH", "diag":39.11521443121589, "alpha":23.275238446742815, "fullname":"Bahrain"},
    "BD":{"referent":"BD", "diag":543.2678897192434, "alpha":74.38755026777277, "fullname":"Bangladesh"},
    "BB":{"referent":"BB", "diag":29.32575659723036, "alpha":21.925532865572123, "fullname":"Barbados"},
    "BY":{"referent":"BY", "diag":644.3601477434805, "alpha":106.72239949695455, "fullname":"Belarus"},
    "BE":{"referent":"BE", "diag":247.09512338368802, "alpha":34.843829038514336, "fullname":"Belgium"},
    "BZ":{"referent":"BZ", "diag":214.31752144890066, "alpha":47.43097164728892, "fullname":"Belize"},
    "BJ":{"referent":"BJ", "diag":474.59877791667355, "alpha":83.31682666461928, "fullname":"Benin"},
    "BM":{"referent":"GB", "diag":10.392304845413264, "alpha":19.315113991144052, "fullname":"Bermuda"},
    "BT":{"referent":"BT", "diag":277.10647773013176, "alpha":54.93711090892961, "fullname":"Bhutan"},
    "BO":{"referent":"BO", "diag":1482.2826990827357, "alpha":163.17070120907988, "fullname":"Bolivia"},
    "BQ":{"referent":"NL", "diag":25.612496949731394, "alpha":37.47968185947722, "fullname":"Caribbean Netherlands"},
    "BA":{"referent":"BA", "diag":320.0281237641467, "alpha":62.005649055722614, "fullname":"Bosnia and Herzegovina"},
    "BW":{"referent":"BW", "diag":1078.8883167408942, "alpha":134.95197865270416, "fullname":"Botswana"},
    "BV":{"referent":"NO", "diag":9.899494936611665, "alpha":19.247168626278533, "fullname":"Bouvet Island"},
    "BR":{"referent":"BR", "diag":4126.927913109217, "alpha":591.9923561732209, "fullname":"Brazil"},
    "BN":{"referent":"BN", "diag":107.37783756436893, "alpha":32.68683661598056, "fullname":"Brunei"},
    "BG":{"referent":"BG", "diag":470.91188135361375, "alpha":60.05314384559996, "fullname":"Bulgaria"},
    "BF":{"referent":"BF", "diag":738.8734668398913, "alpha":119.75326968841003, "fullname":"Burkina Faso"},
    "BI":{"referent":"BI", "diag":235.9406705084988, "alpha":50.41222816457079, "fullname":"Burundi"},
    "KH":{"referent":"KH", "diag":601.7225274160841, "alpha":71.12785351923642, "fullname":"Cambodia"},
    "CM":{"referent":"CM", "diag":975.1328114672381, "alpha":152.3271426704479, "fullname":"Cameroon"},
    "CA":{"referent":"CA", "diag":4468.706748042436, "alpha":546.2232473698027, "fullname":"Canada"},
    "CV":{"referent":"CV", "diag":89.81091247727082, "alpha":30.26482538347385, "fullname":"Cape Verde"},
    "KY":{"referent":"UK", "diag":22.978250586152114, "alpha":21.050380795359988, "fullname":"Cayman Islands"},
    "CF":{"referent":"CF", "diag":1116.2293671105415, "alpha":171.78060085631307, "fullname":"Central African Republic"},
    "TD":{"referent":"TD", "diag":1602.4980499208104, "alpha":238.82410482432982, "fullname":"Chad"},
    "CL":{"referent":"CL", "diag":1229.7170406235737, "alpha":412.0259548379801, "fullname":"Chile"},
    "CN":{"referent":"CN", "diag":4406.123239311401, "alpha":625.3693691079427, "fullname":"China"},
    "CX":{"referent":"AU", "diag":16.431676725154983, "alpha":20.147782569025253, "fullname":"Christmas Island"},
    "CC":{"referent":"AU", "diag":5.291502622129181, "alpha":18.611849178529653, "fullname":"Cocos (Keeling) Islands"},
    "CO":{"referent":"CO", "diag":1511.1240849116264, "alpha":234.99234152503587, "fullname":"Colombia"},
    "KM":{"referent":"KM", "diag":61.02458520956943, "alpha":26.295957318100648, "fullname":"Comoros"},
    "CG":{"referent":"CG", "diag":827.0429251254133, "alpha":131.90949038570238, "fullname":"Republicofthe Congo"},
    "CD":{"referent":"CD", "diag":2165.575212270403, "alpha":316.45745301799496, "fullname":"DR Congo"},
    "CK":{"referent":"NZ", "diag":21.72556098240043, "alpha":20.877668253120067, "fullname":"Cook Islands"},
    "CR":{"referent":"CR", "diag":319.68734726291564, "alpha":61.95866504971907, "fullname":"Costa Rica"},
    "CI":{"referent":"CI", "diag":803.072848501305, "alpha":128.60465504657546, "fullname":"Ivory Coast"},
    "HR":{"referent":"HR", "diag":336.4342432036311, "alpha":65.25113670334214, "fullname":"Croatia"},
    "CU":{"referent":"CU", "diag":468.7941979163138, "alpha":82.51652963533552, "fullname":"Cuba"},
    "CW":{"referent":"NL", "diag":29.79932885150268, "alpha":21.990825870099904, "fullname":"Curaçao"},
    "CY":{"referent":"CY", "diag":136.02205703487945, "alpha":36.63611179988381, "fullname":"Cyprus"},
    "CZ":{"referent":"CZ", "diag":397.1523637094459, "alpha":58.35867535139994, "fullname":"Czechia"},
    "DK":{"referent":"DK", "diag":293.5779283256832, "alpha":55.4021156649218, "fullname":"Denmark"},
    "DJ":{"referent":"DJ", "diag":215.40659228538016, "alpha":47.58112551803583, "fullname":"Djibouti"},
    "DM":{"referent":"DM", "diag":38.7556447501522, "alpha":23.22566336162762, "fullname":"Dominica"},
    "DO":{"referent":"DO", "diag":311.9967948553318, "alpha":56.78039086631456, "fullname":"Dominican Republic"},
    "EC":{"referent":"EC", "diag":744.0981118105327, "alpha":176.45960606370554, "fullname":"Ecuador"},
    "EG":{"referent":"EG", "diag":1415.9449141827517, "alpha":213.1033945704463, "fullname":"Egypt"},
    "SV":{"referent":"SV", "diag":205.1389772812568, "alpha":46.16549479451749, "fullname":"El Salvador"},
    "GQ":{"referent":"GQ", "diag":236.85860761222085, "alpha":50.538787250177776, "fullname":"Equatorial Guinea"},
    "ER":{"referent":"ER", "diag":484.9742261192856, "alpha":84.74732471504213, "fullname":"Eritrea"},
    "EE":{"referent":"EE", "diag":300.7557148251717, "alpha":43.71043395836512, "fullname":"Estonia"},
    "ET":{"referent":"ET", "diag":1486.1359291801002, "alpha":222.7808666323886, "fullname":"Ethiopia"},
    "FK":{"referent":"GB", "diag":156.0320479901485, "alpha":39.39495676653159, "fullname":"Falkland Islands"},
    "FO":{"referent":"DK", "diag":52.78257288158659, "alpha":25.159603269918684, "fullname":"Faroe Islands"},
    "FJ":{"referent":"FJ", "diag":191.16485032557634, "alpha":44.23883476247862, "fullname":"Fiji"},
    "FI":{"referent":"FI", "diag":822.7077245291915, "alpha":123.88775064268542, "fullname":"Finland"},
    "FR":{"referent":"FR", "diag":1050.4237240275945, "alpha":151.68231721060795, "fullname":"France"},
    "GF":{"referent":"FR", "diag":408.7395258596849, "alpha":74.23658937461856, "fullname":"French Guiana"},
    "PF":{"referent":"FR", "diag":91.29074432821763, "alpha":30.46885479371177, "fullname":"French Polynesia"},
    "TF":{"referent":"FR", "diag":124.47489706764172, "alpha":35.04406589512031, "fullname":"French Southern and Antarctic Lands"},
    "GA":{"referent":"GA", "diag":731.6665907365185, "alpha":118.75963336406133, "fullname":"Gabon"},
    "GM":{"referent":"GM", "diag":146.21217459568817, "alpha":38.041057689416235, "fullname":"Gambia"},
    "GE":{"referent":"GE", "diag":373.3630940518894, "alpha":69.35912136131117, "fullname":"Georgia"},
    "DE":{"referent":"DE", "diag":845.1201098068842, "alpha":101.1560583838771, "fullname":"Germany"},
    "GH":{"referent":"GH", "diag":690.6996452872985, "alpha":109.92069520635856, "fullname":"Ghana"},
    "GI":{"referent":"UK", "diag":3.4641016151377544, "alpha":18.359899236050648, "fullname":"Gibraltar"},
    "GR":{"referent":"GR", "diag":513.7898403043797, "alpha":105.77687733352258, "fullname":"Greece"},
    "GL":{"referent":"DK", "diag":2081.3870375305023, "alpha":200.87644835734, "fullname":"Greenland"},
    "GD":{"referent":"GD", "diag":26.229754097208, "alpha":21.498676554991604, "fullname":"Grenada"},
    "GP":{"referent":"FR", "diag":57.06137047074842, "alpha":25.749535530185668, "fullname":"Guadeloupe"},
    "GU":{"referent":"US", "diag":33.13608305156178, "alpha":22.450875429859945, "fullname":"Guam"},
    "GT":{"referent":"GT", "diag":466.666904761844, "alpha":66.61979619942836, "fullname":"Guatemala"},
    "GG":{"referent":"GB", "diag":12.489995996796797, "alpha":19.604329747788466, "fullname":"Guernsey"},
    "GN":{"referent":"GN", "diag":701.2232169573394, "alpha":114.56230270528113, "fullname":"Guinea"},
    "GW":{"referent":"GW", "diag":268.79360111431225, "alpha":54.941772552876024, "fullname":"Guinea-Bissau"},
    "GY":{"referent":"GY", "diag":655.6965761691912, "alpha":108.28539113308017, "fullname":"Guyana"},
    "HT":{"referent":"HT", "diag":235.58437978779492, "alpha":50.363105160783604, "fullname":"Haiti"},
    "HM":{"referent":"AU", "diag":28.705400188814647, "alpha":21.84000223446333, "fullname":"Heard Island and McDonald Islands"},
    "VA":{"referent":"VA", "diag":0.938083151964686, "alpha":18.011628547754842, "fullname":"Vatican City"},
    "HN":{"referent":"HN", "diag":474.3247832445612, "alpha":83.27905009471802, "fullname":"Honduras"},
    "HK":{"referent":"CN", "diag":46.98936049788292, "alpha":24.360873532297592, "fullname":"Hong Kong"},
    "HU":{"referent":"HU", "diag":431.34209161638745, "alpha":59.582088688244326, "fullname":"Hungary"},
    "IS":{"referent":"IS", "diag":453.8722287164087, "alpha":56.83853033920002, "fullname":"Iceland"},
    "IN":{"referent":"IN", "diag":2564.2113797423176, "alpha":371.4187664244891, "fullname":"India"},
    "ID":{"referent":"ID", "diag":1951.7013091146914, "alpha":348.24172495205454, "fullname":"Indonesia"},
    "IR":{"referent":"IR", "diag":1815.5963207717732, "alpha":268.2046824194295, "fullname":"Iran"},
    "IQ":{"referent":"IQ", "diag":936.2873490547654, "alpha":146.9713877031756, "fullname":"Iraq"},
    "IE":{"referent":"IE", "diag":374.8946518690284, "alpha":69.57028240503124, "fullname":"Ireland"},
    "IM":{"referent":"GB", "diag":33.823069050575526, "alpha":22.54559250743251, "fullname":"Isleof Man"},
    "IL":{"referent":"IL", "diag":203.81364036786155, "alpha":42.81847201865375, "fullname":"Israel"},
    "IT":{"referent":"IT", "diag":776.3195218465139, "alpha":161.12895676195018, "fullname":"Italy"},
    "JM":{"referent":"JM", "diag":148.26327933780502, "alpha":38.32385042063267, "fullname":"Jamaica"},
    "JP":{"referent":"JP", "diag":869.4020933952253, "alpha":212.824360424015, "fullname":"Japan"},
    "JE":{"referent":"GB", "diag":15.231546211727817, "alpha":19.982316525902576, "fullname":"Jersey"},
    "JO":{"referent":"JO", "diag":422.71030268967894, "alpha":70.89211961461133, "fullname":"Jordan"},
    "KZ":{"referent":"KZ", "diag":2334.480670299071, "alpha":339.7450184028771, "fullname":"Kazakhstan"},
    "KE":{"referent":"KE", "diag":1077.3736584862284, "alpha":146.3362641686688, "fullname":"Kenya"},
    "KI":{"referent":"KI", "diag":40.27406113120453, "alpha":23.435012551215273, "fullname":"Kiribati"},
    "KR":{"referent":"KR", "diag":447.6829235072519, "alpha":65.55828785694067, "fullname":"South Korea"},
    "KW":{"referent":"KW", "diag":188.7749983445901, "alpha":43.90933780650718, "fullname":"Kuwait"},
    "KG":{"referent":"KG", "diag":632.3780514850274, "alpha":121.69263454224145, "fullname":"Kyrgyzstan"},
    "LA":{"referent":"LA", "diag":688.1860213634102, "alpha":143.57699299871368, "fullname":"Laos"},
    "LV":{"referent":"LV", "diag":359.32993195669076, "alpha":50.97009828511159, "fullname":"Latvia"},
    "LB":{"referent":"LB", "diag":144.58215657542254, "alpha":37.81632160528668, "fullname":"Lebanon"},
    "LS":{"referent":"LS", "diag":246.39399343328157, "alpha":34.56557529652339, "fullname":"Lesotho"},
    "LR":{"referent":"LR", "diag":471.9512686708237, "alpha":82.95180563220632, "fullname":"Liberia"},
    "LY":{"referent":"LY", "diag":1875.9211070831311, "alpha":276.52186424381057, "fullname":"Libya"},
    "LI":{"referent":"LI", "diag":17.88854381999832, "alpha":20.34864575085618, "fullname":"Liechtenstein"},
    "LT":{"referent":"LT", "diag":361.386219991853, "alpha":46.406637166782296, "fullname":"Lithuania"},
    "LU":{"referent":"LU", "diag":71.91661838546081, "alpha":27.797678681745545, "fullname":"Luxembourg"},
    "MO":{"referent":"CN", "diag":7.745966692414834, "alpha":18.950254421253778, "fullname":"Macau"},
    "MK":{"referent":"MK", "diag":226.77301426757109, "alpha":30.07702057954948, "fullname":"North Macedonia"},
    "MG":{"referent":"MG", "diag":1083.5506448708338, "alpha":202.3942422420552, "fullname":"Madagascar"},
    "MW":{"referent":"MW", "diag":486.7935907548496, "alpha":84.99816665587774, "fullname":"Malawi"},
    "MY":{"referent":"MY", "diag":813.3916645749451, "alpha":222.18464770088195, "fullname":"Malaysia"},
    "MV":{"referent":"MV", "diag":24.49489742783178, "alpha":21.25948601258391, "fullname":"Maldives"},
    "ML":{"referent":"ML", "diag":1574.9234902051592, "alpha":235.02230723985758, "fullname":"Mali"},
    "MT":{"referent":"MT", "diag":25.13961017995307, "alpha":21.348374734977615, "fullname":"Malta"},
    "MH":{"referent":"MH", "diag":19.026297590440446, "alpha":20.50551170196458, "fullname":"Marshall Islands"},
    "MQ":{"referent":"FR", "diag":47.49736834815167, "alpha":24.430914288630987, "fullname":"Martinique"},
    "MR":{"referent":"MR", "diag":1435.7576397150042, "alpha":215.8350418876499, "fullname":"Mauritania"},
    "MU":{"referent":"MU", "diag":63.874877690685246, "alpha":26.68893675934971, "fullname":"Mauritius"},
    "YT":{"referent":"FR", "diag":27.349588662354687, "alpha":21.653071924806586, "fullname":"Mayotte"},
    "MX":{"referent":"MX", "diag":1982.1074642914798, "alpha":367.3607466315442, "fullname":"Mexico"},
    "FM":{"referent":"FM", "diag":37.469987990390386, "alpha":23.048405526357506, "fullname":"Micronesia"},
    "MD":{"referent":"MD", "diag":260.1768629221284, "alpha":53.75375378547282, "fullname":"Moldova"},
    "MC":{"referent":"MC", "diag":2.009975124224178, "alpha":18.15941391053031, "fullname":"Monaco"},
    "MN":{"referent":"MN", "diag":1768.67747201122, "alpha":230.1442050070954, "fullname":"Mongolia"},
    "ME":{"referent":"ME", "diag":166.20469307453385, "alpha":28.331453632251147, "fullname":"Montenegro"},
    "MS":{"referent":"GB", "diag":14.2828568570857, "alpha":19.85151752370325, "fullname":"Montserrat"},
    "MA":{"referent":"MA", "diag":945.0396817065408, "alpha":148.17810133621796, "fullname":"Morocco"},
    "MZ":{"referent":"MZ", "diag":1266.1674454826266, "alpha":192.45306961206452, "fullname":"Mozambique"},
    "MM":{"referent":"MM", "diag":1163.2523371994573, "alpha":178.26381639782107, "fullname":"Myanmar"},
    "NA":{"referent":"NA", "diag":1285.0019455238191, "alpha":195.049845680286, "fullname":"Namibia"},
    "NR":{"referent":"NR", "diag":6.48074069840786, "alpha":18.77581344459162, "fullname":"Nauru"},
    "NP":{"referent":"NP", "diag":542.5513800553824, "alpha":92.68568119334317, "fullname":"Nepal"},
    "NL":{"referent":"NL", "diag":289.30952282978865, "alpha":57.77037190044235, "fullname":"Netherlands"},
    "NC":{"referent":"FR", "diag":192.74335267396384, "alpha":44.45646820711263, "fullname":"New Caledonia"},
    "NZ":{"referent":"NZ", "diag":735.4821547801143, "alpha":165.76579835292438, "fullname":"New Zealand"},
    "NI":{"referent":"NI", "diag":510.63294057473416, "alpha":88.2849782494345, "fullname":"Nicaragua"},
    "NE":{"referent":"NE", "diag":1591.8542646863123, "alpha":237.35661024195255, "fullname":"Niger"},
    "NG":{"referent":"NG", "diag":1359.2409646563776, "alpha":184.09473252281128, "fullname":"Nigeria"},
    "NU":{"referent":"NZ", "diag":22.80350850198276, "alpha":21.02628851463633, "fullname":"Niue"},
    "NF":{"referent":"AU", "diag":8.48528137423857, "alpha":19.052186230882164, "fullname":"Norfolk Island"},
    "MP":{"referent":"US", "diag":30.463092423455635, "alpha":22.082341193301204, "fullname":"Northern Mariana Islands"},
    "NO":{"referent":"NO", "diag":804.738466832548, "alpha":189.7558067445318, "fullname":"Norway"},
    "OM":{"referent":"OM", "diag":786.7655305108377, "alpha":126.35631009439152, "fullname":"Oman"},
    "PK":{"referent":"PK", "diag":1328.0903583717488, "alpha":200.99059053979585, "fullname":"Pakistan"},
    "PW":{"referent":"PW", "diag":30.298514815086232, "alpha":22.059650323150997, "fullname":"Palau"},
    "PS":{"referent":"IL", "diag":111.53474794878949, "alpha":33.259963876082836, "fullname":"Palestine"},
    "PA":{"referent":"PA", "diag":388.37353153890393, "alpha":69.64419635716979, "fullname":"Panama"},
    "PG":{"referent":"PG", "diag":962.1226533036212, "alpha":150.53338826819842, "fullname":"Papua New Guinea"},
    "PY":{"referent":"PY", "diag":901.9445659240927, "alpha":142.2364323205104, "fullname":"Paraguay"},
    "PE":{"referent":"PE", "diag":1603.256685624607, "alpha":212.25094932780146, "fullname":"Peru"},
    "PH":{"referent":"PH", "diag":827.4696369051858, "alpha":173.4537925435466, "fullname":"Philippines"},
    "PN":{"referent":"GB", "diag":9.695359714832659, "alpha":19.219023814500282, "fullname":"Pitcairn Islands"},
    "PL":{"referent":"PL", "diag":790.7958017086332, "alpha":93.6377393081947, "fullname":"Poland"},
    "PT":{"referent":"PT", "diag":429.1619740843776, "alpha":104.32658196010533, "fullname":"Portugal"},
    "PR":{"referent":"US", "diag":133.19159132617943, "alpha":34.953005904661474, "fullname":"Puerto Rico"},
    "QA":{"referent":"QA", "diag":152.22351986470423, "alpha":26.61177089955384, "fullname":"Qatar"},
    "RE":{"referent":"FR", "diag":70.8660708661063, "alpha":27.6528361507082, "fullname":"Réunion"},
    "RO":{"referent":"RO", "diag":690.4940260422244, "alpha":87.61241886754098, "fullname":"Romania"},
    "RU":{"referent":"RU", "diag":5847.775987501574, "alpha":714.131946328906, "fullname":"Russia"},
    "RW":{"referent":"RW", "diag":229.5125268912353, "alpha":47.34913940834831, "fullname":"Rwanda"},
    "BL":{"referent":"FR", "diag":6.48074069840786, "alpha":18.77581344459162, "fullname":"Saint Barthélemy"},
    "SH":{"referent":"GB", "diag":28.071337695236398, "alpha":21.752581899148893, "fullname":"Saint Helena, Ascension and Tristanda Cunha"},
    "KN":{"referent":"KN", "diag":22.847319317591726, "alpha":21.03232885960189, "fullname":"Saint Kitts and Nevis"},
    "LC":{"referent":"LC", "diag":35.09985754956849, "alpha":22.721627645668942, "fullname":"Saint Lucia"},
    "MF":{"referent":"FR", "diag":10.295630140987, "alpha":19.30178512346466, "fullname":"Saint Martin"},
    "PM":{"referent":"FR", "diag":22, "alpha":20.915506086432877, "fullname":"Saint Pierre and Miquelon"},
    "VC":{"referent":"VC", "diag":27.892651361962706, "alpha":21.727945811493335, "fullname":"Saint Vincent andthe Grenadines"},
    "WS":{"referent":"WS", "diag":75.39230729988306, "alpha":28.276883639340106, "fullname":"Samoa"},
    "SM":{"referent":"SM", "diag":11.045361017187261, "alpha":19.405153048955945, "fullname":"San Marino"},
    "ST":{"referent":"ST", "diag":43.9089968002003, "alpha":23.936173396160925, "fullname":"São Tomé and Príncipe"},
    "SA":{"referent":"SA", "diag":2073.4946346687275, "alpha":303.76199310448055, "fullname":"Saudi Arabia"},
    "SN":{"referent":"SN", "diag":627.2511458738039, "alpha":73.10745326166858, "fullname":"Senegal"},
    "RS":{"referent":"RS", "diag":420.3831585589508, "alpha":51.7064056273538, "fullname":"Serbia"},
    "SC":{"referent":"SC", "diag":30.066592756745816, "alpha":22.027674446463326, "fullname":"Seychelles"},
    "SL":{"referent":"SL", "diag":378.78753939378737, "alpha":70.10700794265969, "fullname":"Sierra Leone"},
    "SG":{"referent":"SG", "diag":37.68288736283355, "alpha":23.07775868115804, "fullname":"Singapore"},
    "SX":{"referent":"NL", "diag":8.246211251235321, "alpha":19.019224826401885, "fullname":"Sint Maarten"},
    "SK":{"referent":"SK", "diag":313.16768671112925, "alpha":45.22964025118811, "fullname":"Slovakia"},
    "SI":{"referent":"SI", "diag":201.36037346012247, "alpha":27.89763900562601, "fullname":"Slovenia"},
    "SB":{"referent":"SB", "diag":240.39966722106752, "alpha":51.027005085973144, "fullname":"Solomon Islands"},
    "SO":{"referent":"SO", "diag":1129.2980120411087, "alpha":173.58241902645614, "fullname":"Somalia"},
    "ZA":{"referent":"ZA", "diag":1562.7136653910723, "alpha":211.7170385175186, "fullname":"South Africa"},
    "GS":{"referent":"GB", "diag":88.35157044444654, "alpha":30.06362097359306, "fullname":"South Georgia"},
    "ES":{"referent":"ES", "diag":1005.9741547375856, "alpha":179.63389384946177, "fullname":"Spain"},
    "LK":{"referent":"LK", "diag":362.2430123549659, "alpha":70.56614661578718, "fullname":"Sri Lanka"},
    "SD":{"referent":"SD", "diag":1942.1987539899205, "alpha":285.6597870434162, "fullname":"Sudan"},
    "SR":{"referent":"SR", "diag":572.3984626114924, "alpha":96.80079916931417, "fullname":"Suriname"},
    "SJ":{"referent":"NO", "diag":349.413794805, "alpha":66.05715066928423, "fullname":"Svalbard and Jan Mayen"},
    "SZ":{"referent":"SZ", "diag":186.35450088473848, "alpha":30.704782861375946, "fullname":"Eswatini"},
    "SE":{"referent":"SE", "diag":948.9942044080143, "alpha":143.33914546925385, "fullname":"Sweden"},
    "CH":{"referent":"CH", "diag":287.34648075102643, "alpha":39.74273384806, "fullname":"Switzerland"},
    "SY":{"referent":"SY", "diag":608.5720992618706, "alpha":101.78818050403503, "fullname":"Syria"},
    "TW":{"referent":"TW", "diag":269.04646438858845, "alpha":46.64074741475143, "fullname":"Taiwan"},
    "TJ":{"referent":"TJ", "diag":534.9766350038102, "alpha":91.64132553591757, "fullname":"Tajikistan"},
    "TZ":{"referent":"TZ", "diag":1374.8359902184698, "alpha":207.4355685221141, "fullname":"Tanzania"},
    "TH":{"referent":"TH", "diag":1013.0350438163529, "alpha":182.84593457002995, "fullname":"Thailand"},
    "TL":{"referent":"TL", "diag":172.4760852988031, "alpha":41.66215167240456, "fullname":"Timor-Leste"},
    "TG":{"referent":"TG", "diag":337.0014836762592, "alpha":64.34582345486709, "fullname":"Togo"},
    "TK":{"referent":"NZ", "diag":4.898979485566356, "alpha":18.55773068931994, "fullname":"Tokelau"},
    "TO":{"referent":"TO", "diag":38.65229618017538, "alpha":23.211414345587176, "fullname":"Tonga"},
    "TT":{"referent":"TT", "diag":101.2916580968048, "alpha":31.84771451803763, "fullname":"Trinidad and Tobago"},
    "TN":{"referent":"TN", "diag":572.0314676658969, "alpha":128.11079046380638, "fullname":"Tunisia"},
    "TR":{"referent":"TR", "diag":1251.8482336130046, "alpha":172.31151042579748, "fullname":"Turkey"},
    "TM":{"referent":"TM", "diag":988.0283396745257, "alpha":154.10509265385716, "fullname":"Turkmenistan"},
    "TC":{"referent":"GB", "diag":43.54308211415448, "alpha":23.88572350380082, "fullname":"Turks and Caicos Islands"},
    "TV":{"referent":"TV", "diag":7.211102550927978, "alpha":18.8765108974371, "fullname":"Tuvalu"},
    "UG":{"referent":"UG", "diag":695.0539547402058, "alpha":93.43761686271378, "fullname":"Uganda"},
    "UA":{"referent":"UA", "diag":1098.6355173577815, "alpha":131.27558206096515, "fullname":"Ukraine"},
    "AE":{"referent":"AE", "diag":408.90096600521747, "alpha":74.25884767218167, "fullname":"United Arab Emirates"},
    "GB":{"referent":"GB", "diag":696.993543729065, "alpha":52.34154686594558, "fullname":"United Kingdom"},
    "US":{"referent":"US", "diag":4329.57503688295, "alpha":833.0938531816965, "fullname":"United States"},
    "UM":{"referent":"US", "diag":8.270429251254134, "alpha":19.02256384377593, "fullname":"United States Minor Outlying Islands"},
    "UY":{"referent":"UY", "diag":601.7208655182235, "alpha":68.601955692236, "fullname":"Uruguay"},
    "UZ":{"referent":"UZ", "diag":945.9386872308373, "alpha":148.30205026109445, "fullname":"Uzbekistan"},
    "VU":{"referent":"VU", "diag":156.13455735358525, "alpha":39.409090078334884, "fullname":"Vanuatu"},
    "VE":{"referent":"VE", "diag":1353.8426791913453, "alpha":204.54114989944085, "fullname":"Venezuela"},
    "VN":{"referent":"VN", "diag":813.8943420370975, "alpha":130.09665087203942, "fullname":"Vietnam"},
    "VG":{"referent":"GB", "diag":17.378147196982766, "alpha":20.278275646364467, "fullname":"British Virgin Islands"},
    "VI":{"referent":"US", "diag":26.343879744638983, "alpha":21.51441144306248, "fullname":"United States Virgin Islands"},
    "WF":{"referent":"FR", "diag":16.852299546352718, "alpha":20.205775256563825, "fullname":"Wallis and Futuna"},
    "EH":{"referent":"MA", "diag":729.3833011524188, "alpha":118.44482852528982, "fullname":"Western Sahara"},
    "YE":{"referent":"YE", "diag":1027.5874658636121, "alpha":159.55924285391046, "fullname":"Yemen"},
    "ZM":{"referent":"ZM", "diag":1226.8757068260827, "alpha":187.0357850332875, "fullname":"Zambia"},
    "ZW":{"referent":"ZW", "diag":884.0328048211786, "alpha":139.76687738302752, "fullname":"Zimbabwe"}
};

const estimate_score = (d, a) => 5000*Math.exp(-d/a);

const ERROR_RESP = -1000000;
let state = JSON.parse(localStorage.getItem("CountryData")) || DefaultCountryDict;

let userNick = null;
let userHexId = null;
let pinUrl = null;
let level = null;
let apiUrl = null;
let solo = null;
let ranked = null;
let mode = null;
let teams = null;
let countryMap = null;
let updateUI = true;

function checkGameMode() {
    if (location.pathname.includes("/game/")) {
        solo = true;
        ranked = false;
        teams = false;
        const gameTag = location.href.substring(location.href.lastIndexOf('/') + 1);
        apiUrl = "https://www.geoguessr.com/api/v3/games/"+gameTag;
        return true;
    }
    if (location.pathname.includes("/duels/")) {
        return false; // Not possible to query the game server api from a duel game
        solo = false;
        const gameTag = location.href.substring(location.href.lastIndexOf('/') + 1);
        apiUrl = "https://game-server.geoguessr.com/api/duels/"+gameTag;
        return true;
    }
    return false;
}

if (updateUI) {
    var style = document.createElement("style");
    document.head.appendChild(style);
    style.sheet.insertRule("div[class*='round-result_wrapper__'] { transform: translateX(0); justify-content: space-between }")
    style.sheet.insertRule("div[class*='round-result_distanceIndicatorWrapper__'] { animation-delay: 0s, 0s; animation-duration: 0s, 0s; margin-right: 28px  }")
    style.sheet.insertRule("div[class*='round-result_actions__'] { animation-delay: 0s; animation-duration: 0s; margin: 0px; margin-top: 10px; margin-bottom: 10px }")
    style.sheet.insertRule("div[class*='round-result_pointsIndicatorWrapper__'] { animation-delay: 0s, 0s; animation-duration: 0s, 0s; margin-right: 28px }")
}

function parseScore(number) {
    const numberString = Math.round(number).toString();
    if (number >= 1000) {
        const firstDigit = numberString[0];
        const restOfDigits = numberString.slice(1);
        return firstDigit + ',' + restOfDigits;
    } else {
        return numberString;
    }
}

const shadowStyle = `
    text-shadow:
        0 .25rem 0 #006400,
        .125rem .125rem .5rem #32CD32,
        0 -.25rem .5rem #7CFC00,
        -.25rem .5rem .5rem #20B2AA,
        0 .375rem 2rem #32CD32,
        0 0 0 #20B2AA,
        0 0 1.5rem rgba(102, 255, 102, .65),
        .25rem .25rem 1rem #66CDAA;
`;

const newFormat = (score) => `
    <div class="${cn("shadow-text_root__")} ${cn("shadow-text_sizeSmallMedium__")}" style="${shadowStyle}"">
      ${parseScore(score)}&nbsp;
    </div>
    <p class="${cn("round-result_label__")} ${cn("round-result_indicatorLabel__")}"> Country-wise </p>
`

function addCountryResult(score) {
    if (document.getElementById("results-row") == null && !!document.querySelector('div[class*="round-result_distanceIndicatorWrapper__"]')) {
        const resultsContainer = document.querySelector("div[class*='round-result_wrapper__']");
        const topRow = document.createElement("div");
        topRow.id = "results-row";
        topRow.style = "display: flex;flex-direction: row";
        const distanceIndicator = document.querySelector("div[class*='round-result_distanceIndicatorWrapper__']");
        distanceIndicator.parentNode.removeChild(distanceIndicator);
        distanceIndicator.style.marginRight = '3vw';
        const pointsIndicator = document.querySelector("div[class*='round-result_pointsIndicatorWrapper__']");
        pointsIndicator.parentNode.removeChild(pointsIndicator);
        pointsIndicator.style.marginRight = '3vw';
        const newDiv = document.createElement("div");
        newDiv.id = "country-wise";
        newDiv.className = cn("round-result_pointsIndicatorWrapper__");
        newDiv.innerHTML = newFormat(score);
        newDiv.style.marginRight = '3vw';
        topRow.appendChild(distanceIndicator);
        topRow.appendChild(pointsIndicator);
        topRow.appendChild(newDiv);
        resultsContainer.insertBefore(topRow, resultsContainer.firstChild);
        if (document.querySelector("span[class*='button_label__']").textContent == 'Next') {
            document.querySelector("span[class*='button_label__']").textContent += ' >';
        }
        const nextButton = document.querySelector("div[class*='round-result_actions__']");
        nextButton.style.transform = 'translateX(-2vw)';
        const clone = nextButton.cloneNode(true);
        clone.style.opacity = '0';
        resultsContainer.insertBefore(clone, resultsContainer.firstChild);
    }
}

async function updateState(guess, ans, dist) {
    if ((guess === ERROR_RESP) || (ans === ERROR_RESP)) {
        return;
    }
    let good = (guess == ans);
    //state[ans].occ += 1;
    let score = parseFloat(estimate_score(dist, state[ans].alpha).toFixed(1));
    if (updateUI) addCountryResult(score);
    if (!userNick) {
        console.warn("emergency setting of user info, please avoid refreshing during a game.");
        await checkModes();
    }
    const data = {
        username: userNick,
        player_hexid: userHexId,
        actualCountryCode: ans,
        guessedCountryCode: guess,
        mode: mode,
        score: score,
        distance: dist,
        isCountryMap: countryMap,
        pinUrl: pinUrl,
        level: level
    };
    fetch(statsServerUrl+'/guess', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then(data => console.log('Success:', data)).catch((error) => console.error('Error:', error));
    /*if (good) {
        state[ans].avgdist = (state[ans].avgdist*state[ans].right + dist)/(state[ans].right+1);
        console.log(score);
        state[ans].avgscore = (state[ans].avgscore*state[ans].right + score)/(state[ans].right+1);
        state[ans].right += 1;
    } else {
        if (!(guess in state[ans].wrong_guesses)) {
            state[ans].wrong_guesses[guess] = 0;
        }
        state[ans].wrong_guesses[guess] += 1;
    }
    console.log(state[ans]);
    localStorage.setItem("CountryData", JSON.stringify(state));*/
}

async function getCountryCode(coords) {
    if (coords[0] <= -85.05) return 'AQ';
    if (API_Key.toLowerCase().match("^(bdc_)?[a-f0-9]{32}$") != null) {
        const api = "https://api.bigdatacloud.net/data/reverse-geocode?latitude="+coords.lat+"&longitude="+coords.lng+"&localityLanguage=en&key="+API_Key;
        return await fetch(api)
            .then(res => (res.status !== 200) ? ERROR_RESP : res.json())
            .then(out => (out === ERROR_RESP) ? ERROR_RESP : out.countryCode);
    } else {
        const api = `https://nominatim.openstreetmap.org/reverse.php?lat=${coords.lat}&lon=${coords.lng}&zoom=21&format=jsonv2&accept-language=en`;
        return await fetch(api)
            .then(res => (res.status !== 200) ? ERROR_RESP : res.json())
            .then(out => (out === ERROR_RESP) ? ERROR_RESP : state[out?.address?.country_code?.toUpperCase()].referent);
    }
}

function deductMode(m, p, z) {
    if (m && p && z) {
        mode = 'move';
    } else if (!m && p && z) {
        mode = 'nm';
    } else if (!m && !p && !z) {
        mode = 'nmpz';
    } else {
        console.error("game mode not supported");
    }
}

async function getUserInfo() {
    try {
        const res = await fetch('https://www.geoguessr.com/api/v3/profiles');
        const out = await res.json();
        userHexId = out.user.id;
        userNick = out.user.nick;
        pinUrl = out.user.pin.url;
        level = out.user.br.level;
    } catch (err) {
        throw err;
    }
}

function checkModesSolo(out) {
    const m = !out.forbidMoving;
    const p = !out.forbidRotating;
    const z = !out.forbidZooming;
    deductMode(m, p, z);
}

function checkMap(out) {
    const mapName = out.mapName;
    for (const key in DefaultCountryDict) {
        if (mapName.toLowerCase().includes(DefaultCountryDict[key].fullname.toLowerCase())) {
            countryMap = true;
            return;
        }
    }
    countryMap = false;
}

function checkModesDuel(out) {
    const m = !out.movementOptions.forbidMoving;
    const p = !out.movementOptions.forbidRotating;
    const z = !out.movementOptions.forbidZooming;
    deductMode(m, p, z);
    teams = out.options.isTeamDuels;
    ranked = out.options.isRated;
}

async function checkGameParams() {
    try {
        const res = await fetch(apiUrl);
        const out = await res.json();
        if (solo) {
            checkMap(out);
            checkModesSolo(out);
        } else {
            checkModesDuel(out);
        }
    } catch (err) {
        throw err;
    }
}

async function checkModes() {
    await Promise.all([getUserInfo(), checkGameParams()]);
}

function getSoloData(out) {
    const guessCounter = out.player.guesses.length;
    const round = out.rounds[guessCounter-1];
    const guess = out.player.guesses[guessCounter-1];
    let dist = parseFloat(guess.distance.meters.amount);
    const unit = guess.distance.meters.unit;
    if (unit === 'm') {
        dist = dist/1000;
    }
    if (guess.lat == lastGuess.lat && guess.lng == lastGuess.lng) return;
    lastGuess = guess;
    const roundCountryCode = round.streakLocationCode.toUpperCase();
    getCountryCode(guess).then(guessCountryCode => {
        console.log(guessCountryCode);
        console.log(roundCountryCode);
        if (guessCountryCode == ERROR_RESP || roundCountryCode == ERROR_RESP) {
            updateState(ERROR_RESP, ERROR_RESP, false, dist);
        } else {
            updateState(guessCountryCode, roundCountryCode, dist);
        }
    });
}

function getDuelData(out) {
    const roundIdx = out.teams[0].roundResults.length - 1;
    const round = out.rounds[roundIdx].panorama;
    let guess = null;
    out.teams.forEach(team => {
        team.players.forEach(player => {
            if (player.playerId == userHexId) {
                guess = player.guesses[roundIdx];
            }
        });
    });
    let dist = parseFloat(guess.distance)/1000;
    const roundCountryCode = round.countryCode.toUpperCase();
    getCountryCode(guess).then(guessCountryCode => {
        console.log(guessCountryCode);
        console.log(roundCountryCode);
        if (guessCountryCode == ERROR_RESP || roundCountryCode == ERROR_RESP) {
            updateState(ERROR_RESP, ERROR_RESP, false, dist);
        } else {
            updateState(guessCountryCode, roundCountryCode, dist);
        }
    });
}

let lastGuess = { lat: 91, lng: 0 };
function run() {
    fetch(apiUrl)
    .then(res => res.json())
    .then((out) => {
        if (solo) {
            getSoloData(out);
        } else {
            getDuelData(out);
        }
    }).catch(err => { throw err });
}

let lastDoCheckCall = 0;
// Any changes in the DOM triggers the MutationObserver callback
new MutationObserver(async (mutations) => {
    // First make sure we are in a game
    if (!checkGameMode()) {
        sessionStorage.setItem("modesChecked", 0);
        return;
    }
    if (lastDoCheckCall >= (Date.now() - 50)) return;
    lastDoCheckCall = Date.now();
    await scanStyles();
    // Then check the different modes (solo, ranked, teams, nmpz)
    if ((sessionStorage.getItem("modesChecked") || 0) == 0) { // for team duels there should be a delay because it needs time to find opponents
        checkModes();
        sessionStorage.setItem("modesChecked", 1);
    }
    // Then make sure we are in the round results screen
    if (!document.querySelector('div[class*="result-layout_root__"]')) {
        sessionStorage.setItem("roundChecked", 0);
        return;
    } else if ((sessionStorage.getItem("roundChecked") || 0) == 0) {
        run();
        sessionStorage.setItem("roundChecked", 1);
    }
}).observe(document.body, { subtree: true, childList: true });

// document.addEventListener('keypress', (e) => {
//     if (e.key == '1') {
//         updateStreak(streak + 1);
//     } else if (e.key == '2') {
//         updateStreak(streak - 1);
//     } else if (e.key == '8') {
//         const streakBackup = parseInt(sessionStorage.getItem("StreakBackup") || 0, 10);
//         updateStreak(streakBackup + 1);
//     } else if (e.key == '0') {
//         updateStreak(0);
//         sessionStorage.setItem("StreakBackup", 0);
//     };
// });