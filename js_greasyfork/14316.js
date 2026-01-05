// ==UserScript==
// @name        WME Tab Manager
// @namespace   http://www.tomputtemans.com/
// @description Adjust the tabs in the Waze Map Editor to your liking by adjusting their size, hiding tabs or even renaming tabs completely.
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAYAAACo29JGAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwCEzYBoD6dGgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACfUlEQVRo3u3aTUgUYRjA8b/bjKyziyyTH2VpKYoHDxLkaTFvRSJCeBHxpFBHCULoWgcpqL3VqZaQIIKULlKSBoqIGJjQQTE2T8YqbpCzrwuz63Zwxy5+pLTtzvY8txle5n1+PO/XDFP0c8tKU6DhoYBDcIITnOAE99/jtKMa2LaNUnGSts3Ozk5+VMTjQdN1jBIDvbj4wHZFh51QtpXCsrbyujo+nx/D5zte5Wzb3oOZponf70fTtLwAJZNJLMsiFosRj1vour5vBQ+cc0rF92CBQCBvYACaphEIBDBNczfXbXW8BSWVSgFgGEbeDkknNyfXP8clkwAUHzJhcx1Obk6uss8JTnCCy93x6+/FJgvvp1hVBhevXOPS6UKo3NoUI++WSDDHyMMQodBTJpbAmn/D6EIiq10feLbcWI8CUFdXd/KnJxZ4cusOr76BYZxCqQzGa2CkFIpaeh+/4GbzybuIRCIAlFdU/uPKeSs5X1UC2L9hAAmFsoGzLbQ0unJYWnz5MMemx7t7WRrk9vA4U2PPGQiWZpDf+Twxw1fLdbhJXt4LEZ5eB6CmvZsbF7zgr6eru50agPVpwg/u8mzSdbgKquvLMA19d63ciOIMzLXIKpsAuoFZdo7yUjcuKMBKuJ/+8AqgYzZeptmMsfhpmZgNtAww9qgLP25cUJhh9O2K8/pLbHmWj7MZGMD8ME9mXLvPBenta+NM7XUGh3poyNxt6Bli8Go15W199AZdfEKp6rzP606ARaJN4/yIVtHaGqSjKUhHlvvO+pzLduRwzslbgeAEJzjBCS6331CczdrtsZ+joCtXlE6n5Q8iwQlOcIITnOAEJzjBCe6I+AVAjNynsKm5WAAAAABJRU5ErkJggg==
// @version     1.4.5
// @require     https://bowercdn.net/c/html.sortable-0.4.4/dist/html.sortable.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14316/WME%20Tab%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/14316/WME%20Tab%20Manager.meta.js
// ==/UserScript==

/* global I18n, _, W, OL, $ */

(function() {
  var tabReopened = false, // have we reopened the tab from last time?
      timesRan = 0, // variable for sanity check
      tabsSecured = -1, // Up until which index have we fully rearranged the tabs?
      versions = ['0.1', '0.2', '1.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.0.5', '1.1', '1.1.1', '1.1.2', '1.2', '1.2.1', '1.2.2', '1.2.3', '1.2.4', '1.3', '1.3.1', '1.4.0', '1.4.1', '1.4.2', '1.4.3', '1.4.4', '1.4.5'],
      styleElement, // Style element to reuse whenever it gets removed by the WME (user login, for example)
      Storage = (function() {
        var hashes = (localStorage.tabprefs_hidden ? localStorage.tabprefs_hidden.split(',') : []),
            tabConfigs = (localStorage.tabprefs_configs ? JSON.parse(localStorage.tabprefs_configs) : {});
        return {
          setTabVisibility: function(hash, visible) {
            var hashIndex = hashes.indexOf(hash);
            if (hashIndex !== -1 && visible) {
              hashes.splice(hashIndex, 1);
              localStorage.tabprefs_hidden = hashes.join();
            } else if (hashIndex === -1 && !visible) {
              hashes.push(hash);
              localStorage.tabprefs_hidden = hashes.join();
            }
          },
          isTabVisible: function(hash) {
            return hashes.indexOf(hash) === -1;
          },
          setTabConfig: function(hash, config) {
            tabConfigs[hash] = config;
            localStorage.tabprefs_configs = JSON.stringify(tabConfigs);
          },
          removeTabConfig: function(hash) {
            delete tabConfigs[hash];
            localStorage.tabprefs_configs = JSON.stringify(tabConfigs);
          },
          getTabConfig: function(hash) {
            return tabConfigs[hash] || {};
          },
          exportConfig: function() {
            return JSON.stringify({
              reopenTab: localStorage.tabprefs_reopenTab,
              tabwidth: localStorage.tabprefs_tabwidth,
              tabheight: localStorage.tabprefs_tabheight,
              preserveOrder: localStorage.tabprefs_preserveOrder,
              hidden: localStorage.tabprefs_hidden,
              configs: localStorage.tabprefs_configs
            });
          },
          importConfig: function(toImport) {
            var result = JSON.parse(toImport);
            ['configs', 'hidden', 'preserveOrder', 'reopenTab', 'tabheight', 'tabwidth'].forEach(function(key) {
              if (result[key]) {
                localStorage.setItem('tabprefs_' + key, result[key]);
              }
            });
          }
        };
      })(),
      iconKeywords = {
        fontAwesome: {"500px":[62062],address:[62137,62138,62139,62140],book:[62137,62138,61485],card:[62139,62140,61597,62083,62146,62147],adjust:[61506],adn:[61808],align:[61495,61497,61494,61496],center:[61495],justify:[61497],left:[61494,61696,61700,61608,61840,61536,61657,61841,61751,61523,61605,61815,61709,61666,61841],right:[61496,61697,61701,61838,61609,61537,61658,61778,61752,61524,61604,61816,61710,61470,61778],amazon:[62064],ambulance:[61689],american:[62115],sign:[62115,61584,62119,61579],language:[62115,61867,62119],interpreting:[62115,62115],anchor:[61757],android:[61819],angellist:[61961],angle:[61699,61696,61697,61698,61703,61700,61701,61702],double:[61699,61696,61697,61698,61991,61990],down:[61699,61703,61611,61466,61539,61655,61776,61976,61754,61560,61607,61769,61813,61661,61797,61576,61776,61479],up:[61698,61702,61467,61610,61538,61777,61656,61753,61559,61606,61768,61814,61662,61575,61796,61777,61480],apple:[61817],archive:[61831,61894],area:[61950],chart:[61950,61568,61568,61953,61952],arrow:[61611,61608,61466,61840,61838,61467,61609,61610,61539,61536,61537,61538,61976,61732,61813,61815,61816,61814],circle:[61611,61608,61466,61840,61838,61467,61609,61610,61528,61533,61754,61751,61752,61753,61713,61708,61902,61915,61842,61546,62049,62131,61530,61526,62091,62092,61764,61469,61525,61529,62108,62093,62094,61859,61527,61532,62141,62142],arrows:[61511,61618,61566,61565],alt:[61618,62083,61715,61474,61864,61920,61921,61989,61758,62107],asl:[62115],assistive:[62114],listening:[62114],systems:[62114],asterisk:[61545],at:[61946],audio:[62110,61895],description:[62110],automobile:[61881],backward:[61514,61513,61512],balance:[62030],scale:[62030],ban:[61534],bandcamp:[62165],bank:[61852],bar:[61568,61568],barcode:[61482],bars:[61641],bath:[62157],bathtub:[62157],battery:[62016,62020,62019,62018,62017,62016,62020,62016,62018,62019,62017],empty:[62020,61731,62155],full:[62016,61731,62151],half:[62018,62034,61577,61731,61731,61731,62153],quarter:[62019,62154],three:[62017,62152],quarters:[62017,62152],bed:[62006],beer:[61692],behance:[61876,61877],square:[61877,61810,61776,61841,61778,61777,61770,61510,61849,61772,61570,61906,61586,61652,61693,61955,61580,61766,61767,62052,61771,61508,61592,61651,61694,61846,61858,61763,61921,61773,61509,62125,61640,61590,61879,61812,61569,62122,61844,61801,61908,61908,61798],bell:[61683,61602,61942,61943],slash:[61942,61943,61552,61745],bicycle:[61958],binoculars:[61925],birthday:[61949],cake:[61949],bitbucket:[61809,61810],bitcoin:[61786],black:[62078],tie:[62078],blind:[62109],bluetooth:[62099,62100],bold:[61490],bolt:[61671],bomb:[61922],bookmark:[61486,61591],braille:[62113],briefcase:[61617],btc:[61786],bug:[61832],building:[61869,61687],bullhorn:[61601],bullseye:[61760],bus:[61959],buysellads:[61965],cab:[61882],calculator:[61932],calendar:[61555,62068,62066,61747,62065,62067],check:[62068,61452,61528,61533,61770,61510],minus:[62066,61544,61526,61766,61767,61456],plus:[62065,61975,61653,62131,62131,61652,61543,61525,61694,61846,61454,62004],times:[62067,61453,61527,61532,62163,62164,62005],camera:[61488,61571,61501],retro:[61571],car:[61881],caret:[61655,61657,61658,61776,61841,61778,61777,61656],cart:[61976,61975,61562],cc:[61962,61939,62028,61938,62027,61937,61940,61941,61936],amex:[61939],diners:[62028],club:[62028],discover:[61938],jcb:[62027],mastercard:[61937],paypal:[61940,61933],stripe:[61941],visa:[61936],certificate:[61603],chain:[61633,61735],broken:[61735],chevron:[61754,61751,61752,61753,61560,61523,61524,61559],child:[61870],chrome:[62056],notch:[61902],thin:[61915],clipboard:[61674],clock:[61463],clone:[62029],close:[61453,62163,62164],cloud:[61634,61677,61678],download:[61677,61465],upload:[61678,61587],cny:[61783],code:[61729,61734,61897,62149],fork:[61734],codepen:[61899],codiepie:[62084],coffee:[61684],cog:[61459],cogs:[61573],columns:[61659],comment:[61557,61669],commenting:[62074,62075],comments:[61574,61670],compass:[61774],compress:[61542],connectdevelop:[61966],contao:[62061],copy:[61637],copyright:[61945],creative:[62046],commons:[62046],credit:[61597,62083],crop:[61733],crosshairs:[61531],"css3":[61756],cube:[61874],cubes:[61875],cut:[61636],cutlery:[61685],dashboard:[61668],dashcube:[61968],database:[61888],deaf:[62116],deafness:[62116],dedent:[61499],delicious:[61861],desktop:[61704],deviantart:[61885],diamond:[61977],digg:[61862],dollar:[61781],dot:[61842],dribbble:[61821],drivers:[62146,62147],license:[62146,62147],dropbox:[61803],drupal:[61865],edge:[62082],edit:[61508],eercast:[62170],eject:[61522],ellipsis:[61761,61762],empire:[61905],envelope:[61664,61443,62134,62135,61849],open:[62134,62135,61564,61717],envira:[62105],eraser:[61741],etsy:[62167],eur:[61779],euro:[61779],exchange:[61676,61837],exclamation:[61738,61546,61553],triangle:[61553],expand:[61541],expeditedssl:[62014],external:[61582,61772],link:[61582,61772,61633],eye:[61550,61552],eyedropper:[61947],fa:[62132],facebook:[61594,61594,62000,61570],official:[62000,62131],fast:[61513,61520],forward:[61520,61518,61540,61521],fax:[61868],feed:[61598],female:[61826],fighter:[61691],jet:[61691],file:[61787,61894,61895,61897,61891,61893,61896,61462,61889,61893,61893,61892,61895,61788,61686,61896,61890,61894],excel:[61891],image:[61893,61502],movie:[61896],pdf:[61889],photo:[61893,61502],picture:[61893,61502],powerpoint:[61892],sound:[61895],text:[61788,61686,61492,61493],video:[61896,61501],word:[61890],zip:[61894],files:[61637],film:[61448],filter:[61616],fire:[61549,61748],extinguisher:[61748],firefox:[62057],first:[62128],order:[62128],flag:[61476,61726,61725],checkered:[61726],flash:[61671],flask:[61635],flickr:[61806],floppy:[61639],folder:[61563,61716,61564,61717],font:[61489,62132],awesome:[62132,62086],fonticons:[62080],fort:[62086],forumbee:[61969],foursquare:[61824],free:[62149],camp:[62149],frown:[61721],futbol:[61923],gamepad:[61723],gavel:[61667],gbp:[61780],ge:[61905],gear:[61459],gears:[61573],genderless:[61997],get:[62053],pocket:[62053],gg:[62048,62049],gift:[61547],git:[61907,61906],github:[61595,61715,61586],gitlab:[62102],gittip:[61828],glass:[61440],glide:[62117,62118],globe:[61612],google:[61856,61653,62131,62131,61652,61934],wallet:[61934],graduation:[61853],cap:[61853],gratipay:[61828],grav:[62166],group:[61632,62023],hacker:[61908],news:[61908],hand:[62037,62040,61607,61605,61604,61606,62038,62043,62042,62037,62039,62041,62038],grab:[62037],lizard:[62040],paper:[62038,61912,61913],peace:[62043],pointer:[62042,62021],rock:[62037],scissors:[62039,61636],spock:[62041],stop:[62038,61517,62093,62094],handshake:[62133],hard:[62116],of:[62116],hearing:[62116],hashtag:[62098],hdd:[61600],header:[61916],headphones:[61477],heart:[61444,61578],heartbeat:[61982],history:[61914],home:[61461],hospital:[61688],hotel:[62006],hourglass:[62036,62033,62034,62035,62035,62034,62032,62033],end:[62035],start:[62033],houzz:[62076],"html5":[61755],cursor:[62022],id:[62145,62146,62147],badge:[62145],ils:[61963],imdb:[62168],inbox:[61468],indent:[61500],industry:[62069],info:[61737,61530],inr:[61782],instagram:[61805],institution:[61852],internet:[62059],explorer:[62059],intersex:[61988],ioxhost:[61960],italic:[61491],joomla:[61866],jpy:[61783],jsfiddle:[61900],key:[61572],keyboard:[61724],krw:[61785],laptop:[61705],lastfm:[61954,61955],leaf:[61548],leanpub:[61970],legal:[61667],lemon:[61588],level:[61769,61768],life:[61901,61901,61901,61901],bouy:[61901],buoy:[61901],ring:[61901],saver:[61901],lightbulb:[61675],line:[61953],linkedin:[61665,61580],linode:[62136],linux:[61820],list:[61498,61474,61643,61642,61451],ol:[61643],ul:[61642],location:[61732],lock:[61475],long:[61813,61815,61816,61814],low:[62120],vision:[62120],magic:[61648],magnet:[61558],mail:[61540,61714,61730],reply:[61714,61730,61714,61730],all:[61730,61730],male:[61827],map:[62073,61505,62072,62070,62071],marker:[61505],pin:[62070],signs:[62071],mars:[61986,61991,61993,61995,61994,61992],stroke:[61993,61995,61994],maxcdn:[61750],meanpath:[61964],medium:[62010],medkit:[61690],meetup:[62176],meh:[61722],mercury:[61987],microchip:[62171],microphone:[61744,61745],mixcloud:[62089],mobile:[61707,61707],phone:[61707,61589,61592,62112],modx:[62085],money:[61654],moon:[61830],mortar:[61853],board:[61853],motorcycle:[61980],mouse:[62021],music:[61441],navicon:[61641],neuter:[61996],newspaper:[61930],object:[62023,62024],ungroup:[62024],odnoklassniki:[62051,62052],opencart:[62013],openid:[61851],opera:[62058],optin:[62012],monster:[62012],outdent:[61499],pagelines:[61836],paint:[61948],brush:[61948],plane:[61912,61913,61554],paperclip:[61638],paragraph:[61917],paste:[61674],pause:[61516,62091,62092],paw:[61872],pencil:[61504,61771,61508],percent:[62101],pie:[61952],pied:[62126,61864,61863],piper:[62126,61864,61863],pp:[61863],pinterest:[61650,62001,61651],play:[61515,61764,61469,61802],plug:[61926],podcast:[62158],power:[61457],off:[61457,61956,61478],print:[61487],product:[62088],hunt:[62088],puzzle:[61742],piece:[61742],qq:[61910],qrcode:[61481],question:[61736,61529,62108],quora:[62148],quote:[61709,61710],ra:[61904],random:[61556],ravelry:[62169],rebel:[61904],recycle:[61880],reddit:[61857,62081,61858],alien:[62081],refresh:[61473],registered:[62045],remove:[61453],renren:[61835],reorder:[61641],repeat:[61470],resistance:[61904],retweet:[61561],rmb:[61783],road:[61464],rocket:[61749],rotate:[61666,61470],rouble:[61784],rss:[61598,61763],rub:[61784],ruble:[61784],rupee:[61782],"s15":[62157],safari:[62055],save:[61639],scribd:[62090],search:[61442,61456,61454],sellsy:[61971],send:[61912,61913],server:[62003],share:[61540,61920,61921,61773,61509],shekel:[61963],sheqel:[61963],shield:[61746],ship:[61978],shirtsinbulk:[61972],shopping:[62096,62097,61562],bag:[62096],basket:[62097],shower:[62156],in:[61584],out:[61579],signal:[61458],signing:[62119],simplybuilt:[61973],sitemap:[61672],skyatlas:[61974],skype:[61822],slack:[61848],sliders:[61918],slideshare:[61927],smile:[61720],snapchat:[62123,62124,62125],ghost:[62124],snowflake:[62172],soccer:[61923],ball:[61923],sort:[61660,61789,61790,61792,61793,61662,61661,61661,61794,61795,61662],alpha:[61789,61790],asc:[61789,61792,61662,61794],desc:[61790,61793,61661,61795],amount:[61792,61793],numeric:[61794,61795],soundcloud:[61886],space:[61847],shuttle:[61847],spinner:[61712],spoon:[61873],spotify:[61884],stack:[61837,61804],overflow:[61804],star:[61445,61577,61731,61731,61731,61446],steam:[61878,61879],step:[61512,61521],stethoscope:[61681],sticky:[62025,62026],note:[62025,62026],street:[61981],view:[61981],strikethrough:[61644],stumbleupon:[61860,61859],subscript:[61740],subway:[62009],suitcase:[61682],sun:[61829],superpowers:[62173],superscript:[61739],support:[61901],table:[61646],tablet:[61706],tachometer:[61668],tag:[61483],tags:[61484],tasks:[61614],taxi:[61882],telegram:[62150],television:[62060],tencent:[61909],weibo:[61909,61834],terminal:[61728],height:[61492],width:[61493],th:[61450,61449,61451],large:[61449],themeisle:[62130],thermometer:[62151,62155,62154,62153,62152,62151,62155,62151,62153,62154,62152],thumb:[61581],tack:[61581],thumbs:[61797,61576,61575,61796],ticket:[61765],rectangle:[62163,62164],tint:[61507],toggle:[61776,61841,61956,61957,61778,61777],on:[61957],trademark:[62044],train:[62008],transgender:[61988,61989],trash:[61944,61460],tree:[61883],trello:[61825],tripadvisor:[62050],trophy:[61585],truck:[61649],try:[61845],tty:[61924],tumblr:[61811,61812],turkish:[61845],lira:[61845],tv:[62060],twitch:[61928],twitter:[61593,61569],umbrella:[61673],underline:[61645],undo:[61666],universal:[62106],access:[62106],university:[61852],unlink:[61735],unlock:[61596,61758],unsorted:[61660],usb:[62087],usd:[61781],user:[61447,62141,62142,61680,62144,62004,61979,62005],md:[61680],secret:[61979],users:[61632],vcard:[62139,62140],venus:[61985,61990,61992],viacoin:[62007],viadeo:[62121,62122],vimeo:[62077,61844],vine:[61898],vk:[61833],volume:[62112,61479,61478,61480],control:[62112],warning:[61553],wechat:[61911],weixin:[61911],whatsapp:[62002],wheelchair:[61843,62107],wifi:[61931],wikipedia:[62054],window:[62163,62164,62160,62161,62162],maximize:[62160],minimize:[62161],restore:[62162],windows:[61818],won:[61785],wordpress:[61850],wpbeginner:[62103],wpexplorer:[62174],wpforms:[62104],wrench:[61613],xing:[61800,61801],combinator:[62011,61908],yahoo:[61854],yc:[62011,61908],yelp:[61929],yen:[61783],yoast:[62129],youtube:[61799,61802,61798]}
      },
      iconFilterList = document.createElement('datalist');

  function init(e) {
    if (e && e.user == null) {
      return;
    }
    if (typeof I18n === 'undefined') {
      log('No internationalisation object found yet, snoozing');
      setTimeout(init, 300);
      return;
    }
    if (typeof W === 'undefined' ||
        typeof W.loginManager === 'undefined') {
      setTimeout(init, 100);
      return;
    }
    if (!W.loginManager.user) {
      W.loginManager.events.register("login", null, init);
    }

    setTranslations({
      en: {
        prefs: {
          title: 'Tab Manager',
          tab_width: 'Tab width',
          tab_height: 'Tab height',
          tab_order: 'Tab order',
          reset: 'reset',
          preserve_tab: 'Preserve opened tab over sessions',
          remove_tab: 'Tab no longer available. Remove entry?',
          hide_tab: 'Change tab visibility',
          move_up_tab: 'Move up',
          move_down_tab: 'Move down',
          edit_tab: 'Edit tab',
          change: 'change',
          set: 'set',
          reset_tab: 'Reset tab',
          icon: 'Icon',
          background_color: 'Background color',
          text_color: 'Text color',
          none_set: 'None set',
          close: 'Close',
          reload: 'The page needs to reload for the changes to take effect. Do you want to refresh now?'
        },
        update: {
          first_run: 'Thanks for using Tab Manager!\nThe settings tab on the left contains additional options now.\nThis message will only appear one time.',
          message: 'New version installed! Changelog:',
          v0_1: '- Initial version with tab memory and order preservation',
          v0_2: '- Improvements to order preservation algorithm\n- Addition of version change messages',
          v1_0: '- Ability to hide a tab added\n- Ability to replace tab with symbol added\n- Ability to resize tabs added\n- Metadata icon added to userscript',
          v1_0_1: '- Fixed the script for Google Chrome',
          v1_0_2: '- Fixed tab size reset buttons in Google Chrome',
          v1_0_3: '- Tab styling is applied with higher specificity, but plays nicer with other scripts as well',
          v1_0_4: '- Tab alignment issues with renamed tabs in Google Chrome fixed',
          v1_0_5: '- Removed strict mode that was necessary for Google Chrome\n- Improved initalisation of script',
          v1_1: '- The list with tab names can now be dragged around\n- Quick tooltips for tabs with replaced names\n- Bug fix concerning the order of the last tabs with some missing tabs',
          v1_1_1: '- Problems with UTF8 in text editor resulted in missing icons',
          v1_1_2: '- Removed fixed scrollbar\n- Fixed a very rare potential bootstrap issue',
          v1_2: '- Renamed to Tab Manager\n- Translation fixes',
          v1_2_1: '- Added library to allow for sorting on WME beta',
          v1_2_2: '- Fixed minor issue concerning support for other languages',
          v1_2_3: '- Fix script activation on missing trailing slash in URL',
          v1_2_4: '- Internal fix for beta (hasUser function was removed)',
          v1_3: '- Added export/import functionality\n- Make it possible to recolour tabs\n- Recover from imperial/metric unit switches',
          v1_3_1: '- Technical release to deal with an upcoming change',
          v1_4_0: '- Filter icons by text\n- Fix script startup stability\n- Possibility to replace feed while retaining ability to refresh\n- Put all styling in CSS classes',
          v1_4_1: '- Fix for future WME version',
          v1_4_2: '- Fix for new WME sidepanel',
          v1_4_3: '- Restyling with new WME elements',
          v1_4_4: '- Further fixes in icon editing panel',
          v1_4_5: '- Disabled automatic tab reopening due to new layout conflicts'
        }
      },
      nl: {
        prefs: {
          title: 'Tab manager',
          tab_width: 'Tabbreedte',
          tab_height: 'Tabhoogte',
          tab_order: 'Tabvolgorde',
          reset: 'reset',
          preserve_tab: 'Geopende tab bijhouden tussen sessies',
          remove_tab: 'Tab niet langer beschikbaar. Verwijderen?',
          hide_tab: 'Tabzichtbaarheid veranderen',
          move_up_tab: 'Eerder zetten',
          move_down_tab: 'Verder zetten',
          edit_tab: 'Tab aanpassen',
          change: 'veranderen',
          set: 'instellen',
          reset_tab: 'Tab resetten',
          icon: 'Icoon',
          background_color: 'Achtergrondkleur',
          text_color: 'Tekstkleur',
          none_set: 'Niet ingesteld',
          close: 'Sluiten',
          reload: 'De pagina moet opnieuw geladen worden om de wijzigingen door te voeren. Wil je nu de pagina vernieuwen?'
        }
      }
    });

    checkVersion();
    initTabListener();
    initSettings();
    applyStyles();

    setUnitChangeListener();
  }

  function setTranslations(translations) {
    I18n.translations[I18n.currentLocale()].tabpreferences = translations.en;
    for (var i = 0; i < Object.keys(translations).length; i++) {
      var locale = Object.keys(translations)[i];
      if (I18n.currentLocale() == locale) {
        I18n.translations[locale].tabpreferences.prefs = translations[locale].prefs;
        return;
      }
    }
  }

  function setUnitChangeListener() {
    if (W.prefs) {
      W.prefs.on('change:isImperial', function() {setTimeout(reinitialize, 200); });
    } else {
      setTimeout(setUnitChangeListener, 400);
    }
  }

  function reinitialize() {
    tabReopened = false;
    tabsSecured = -1;
    initTabListener();
    initSettings();
    applyStyles();
  }

  function initTabListener() {
    var tabs = document.querySelector('#user-tabs .nav-tabs');
    if (!tabs) {
      setTimeout(initTabListener, 400);
      return;
    }
    log('Tabs found, enabling observers');
    var selectionObserver = new MutationObserver(function(mutationRecords) {
      mutationRecords.forEach(function(mutationRecord) {
        // Store last opened tab when one of the tabs receives focus
        if (localStorage.tabprefs_reopenTab && mutationRecord.target.className === 'active') {
          localStorage.tabprefs_reopenTab = mutationRecord.target.querySelector('a').hash;
        }
        adjustTabColors();
      });
    });
    for (var i = 0; i < tabs.children.length; i++) {
      selectionObserver.observe(tabs.children[i], { attributes: true, attributeFilter: ['class'] });
      if (tabs.children[i].title) {
        $(tabs.children[i]).tooltip({
          trigger: 'hover'
        });
      }
      if (!Storage.isTabVisible(tabs.children[i].querySelector('a').hash)) {
        tabs.children[i].style.display = 'none';
      }
    }

    var tabObserver = new MutationObserver(function(mutationRecords) {
      if (!tabReopened) {
        reopenTab();
      }
      mutationRecords.forEach(function(mutationRecord) {
        // Reorder tabs when new ones get added
        if (mutationRecord.addedNodes.length > 0) {
          for (var i = 0; i < mutationRecord.addedNodes.length; i++) {
            var node = mutationRecord.addedNodes[i],
                anchor = node.querySelector('a'),
                hash = anchor.hash;
            // Also start observing here for changes to tab selection
            selectionObserver.observe(node, { attributes: true, attributeFilter: ['class'] });
            if (anchor.title) {
              $(anchor).tooltip({
                trigger: 'hover'
              });
            }
            // Tab visibility
            if (!Storage.isTabVisible(hash)) {
              node.style.display = 'none';
            }
          }
          updateTabs();
          reorderTabs();
          if (localStorage.tabprefs_tabwidth || localStorage.tabprefs_tabheight) {
            resizeTabs();
          }
        }
      });
    });
    tabObserver.observe(tabs, { childList: true });

    var editPanelObserver = new MutationObserver(function(mutationRecords) {
      resizeTabs();
    });
    editPanelObserver.observe(document.querySelector('#edit-panel .contents'), { childList: true });

    reopenTab();
    updateTabs();
    reorderTabs();
    if (localStorage.tabprefs_tabwidth || localStorage.tabprefs_tabheight) {
      resizeTabs();
    }
  }

  function initSettings() {
    var prefsTab = document.querySelector('#sidepanel-prefs');
    if (!prefsTab) {
      setTimeout(initSettings, 400);
      return;
    }

    // First run
    if (localStorage.tabprefs_preserveOrder == null) {
      var tabs = document.querySelectorAll('#user-tabs .nav-tabs li a'),
          hashes = [];
      for (var i = 0; i < tabs.length; i++) {
        hashes.push(tabs[i].hash);
      }
      localStorage.tabprefs_preserveOrder = hashes.join();
    }

    var section = prefsTab.querySelector('.settings'),
        version = document.createElement('a'),
        headingContainer = document.createElement('div'),
        heading = document.createElement('wz-overline'),
        tabOrderPanel = document.createElement('div'),
        configExportImport = document.createElement('div'),
        configExport = document.createElement('a'),
        configImport = document.createElement('input'),
        configImportLabel = document.createElement('label'),
        formGroup = document.createElement('div');
    version.href = 'https://www.waze.com/forum/viewtopic.php?f=819&t=168863';
    version.target = '_blank';
    version.appendChild(document.createTextNode('v' + GM_info.script.version));
    heading.appendChild(document.createTextNode(I18n.t('tabpreferences.prefs.title')));
    headingContainer.style.borderTop = '1px solid #e0e0e0';
    headingContainer.style.marginTop = '1em';
    headingContainer.className = 'panel-header-component';
    headingContainer.appendChild(heading);
    headingContainer.appendChild(version);
    formGroup.className = 'form-group';
    formGroup.style.marginBottom = '15px';
    formGroup.appendChild(createSlider('tabWidth', I18n.t('tabpreferences.prefs.tab_width'), 'tabprefs_tabwidth', 15, resizeTabs));
    formGroup.appendChild(createSlider('tabHeight', I18n.t('tabpreferences.prefs.tab_height'), 'tabprefs_tabheight', 5, resizeTabs));
    formGroup.appendChild(createOption('reopenTab', I18n.t('tabpreferences.prefs.preserve_tab'), (localStorage.tabprefs_reopenTab ? true : false), function() {
      if (this.checked) {
        localStorage.tabprefs_reopenTab = document.querySelector('#user-tabs .nav-tabs li.active a').hash;
      } else {
        localStorage.removeItem('tabprefs_reopenTab');
      }
    }));

    var tabOrderLabel = document.createElement('label');
    tabOrderLabel.textContent = I18n.t('tabpreferences.prefs.tab_order');
    tabOrderLabel.style = 'padding-top: 8px';
    formGroup.appendChild(tabOrderLabel);
    tabOrderPanel.className = 'result-list';
    tabOrderPanel.id = 'tabPreferencesOrder';
    formGroup.appendChild(tabOrderPanel);
    sortable(tabOrderPanel, {
      forcePlaceholderSize: true,
      placeholderClass: 'result'
    })[0].addEventListener('sortupdate', function(e) {
      var order = localStorage.tabprefs_preserveOrder.split(',');
      order.splice(e.detail.elementIndex, 0, order.splice(e.detail.oldElementIndex, 1)[0]);
      localStorage.tabprefs_preserveOrder = order.join();
      reorderTabs(true);
      refreshTabPanel();
    });

    configExportImport.style.textAlign = 'center';
    configExportImport.style.marginBottom = '1em';
    configExport.download = 'tab-manager.conf';
    configExport.style.textDecoration = 'none';
    configExport.href = '#';
    configExport.addEventListener('click', function() {
      configExport.href = 'data:application/octet-stream,' + encodeURIComponent(Storage.exportConfig());
    });
    configExport.innerHTML = '<i class="fa fa-upload"></i> Export</a>';
    configImport.id = 'tab-manager-import';
    configImport.type = 'file';
    configImport.accept = '.conf';
    configImport.style.display = 'none';
    configImportLabel.style.fontWeight = 'normal';
    configImportLabel.style.cursor = 'pointer';
    configImportLabel.style.marginLeft = '20px';
    configImportLabel.innerHTML = '<i class="fa fa-download"></i> Import';
    configImportLabel.htmlFor = configImport.id;
    configImport.addEventListener('change', function() {
      var reader = new FileReader();
      reader.addEventListener('load', function(e) {
        Storage.importConfig(reader.result);
        if (confirm(I18n.t('tabpreferences.prefs.reload'))) {
          window.location.reload();
        }
      });
      reader.readAsText(configImport.files[0]);
    });
    configExportImport.appendChild(configExport);
    configExportImport.appendChild(configImportLabel);
    configExportImport.appendChild(configImport);

    // Obsolete option, remove from localStorage
    if (localStorage.tabprefs_hidePermissions) {
      localStorage.removeItem('tabprefs_hidePermissions');
    }

    section.appendChild(headingContainer);
    section.appendChild(formGroup);
    section.appendChild(configExportImport);

    iconFilterList.id = 'tab-manager-icon-filter';
    section.appendChild(iconFilterList);

    refreshTabPanel();
  }

  // Add options to the preferences tab
  function createOption(name, description, checked, eventHandler) {
    var checkbox = document.createElement('wz-checkbox');
    checkbox.addEventListener('click', eventHandler);
    checkbox.checked = checked;
    checkbox.textContent = description;
    return checkbox;
  }

  // Add sliders to the preferences tab
  function createSlider(name, description, storageKey, defaultValue, eventHandler) {
    var input = document.createElement('input');
    input.type = 'range';
    input.name = name;
    input.id = name + '-on';
    input.min = 0;
    input.max = 30;
    input.value = (localStorage[storageKey] ? localStorage[storageKey] : defaultValue);
    input.addEventListener('input', function() {
      localStorage[storageKey] = this.value;
      eventHandler();
    });
    input.style.verticalAlign = 'middle';
    var label = document.createElement('label');
    label.htmlFor = name + '-on';
    label.appendChild(document.createTextNode(description));
    label.style.marginRight = '4px';
    var reset = document.createElement('button');
    reset.className = 'btn-link pull-right';
    reset.addEventListener('click', function() {
      input.value = defaultValue;
      localStorage.removeItem(storageKey);
      eventHandler();
    });
    reset.appendChild(document.createTextNode(I18n.t('tabpreferences.prefs.reset')));
    var container = document.createElement('div');
    container.className = 'controls-container';
    container.appendChild(reset);
    container.appendChild(label);
    container.appendChild(input);
    return container;
  }

  // Attempt to reopen the tab opened during the previous session
  function reopenTab() {
    // Temporarily disable tab reopening due to new version issues
    /*if (!localStorage.tabprefs_reopenTab) {
      return;
    }
    var tab = document.querySelector('#user-tabs .nav-tabs li a[href$="'+localStorage.tabprefs_reopenTab+'"]');
    if (!tabReopened && tab) {
      var clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      tab.dispatchEvent(clickEvent);
      tabReopened = true;
    }*/
  }

  // If necessary, start reordering the tags as they were saved
  function reorderTabs(force) {
    if (force) {
      tabsSecured = -1;
    }
    // Protection against possible infinite loop if certain scripts don't follow the standards
    if (timesRan > 1000) {
      return;
    }
    if (timesRan === 1000) {
      log('Sanity limit reached! Tab Manager is most likely conflicting with another script. Backing off from now on.');
      // run one last time to increase counter
    }
    timesRan++;
    var hashes = localStorage.tabprefs_preserveOrder.split(','),
        navTabs = document.querySelector('#user-tabs ul.nav-tabs'),
        navAnchors = navTabs.querySelectorAll('li a');
    // First we check whether we know all tabs we currently have
    for (var i = 0; i < navAnchors.length; i++) {
      if (hashes.indexOf(navAnchors[i].hash) === -1) {
        // Add unknown tags to the end of the list
        hashes.push(navAnchors[i].hash);
      }
    }
    localStorage.tabprefs_preserveOrder = hashes.join();
    refreshTabPanel();
    // Then we put them in the order we have stored
    var tabsMissing = 0;
    for (var i = tabsSecured+1; i < hashes.length; i++) {
      var tabAnchor = navTabs.querySelector('a[href$="'+hashes[i]+'"]');

      if (!tabAnchor) {
        tabsMissing++;
        continue;
      }
      var tabIndex = Array.prototype.indexOf.call(navTabs.children, tabAnchor.parentNode);
      if (tabIndex === i && tabsSecured === tabIndex-1) {
        tabsSecured++;
      }
      if (tabAnchor && tabIndex !== i - tabsMissing && i - tabsMissing < navTabs.children.length) {
        navTabs.insertBefore(tabAnchor.parentNode, navTabs.children[i - tabsMissing]);
        if (tabsSecured === i-1) {
          tabsSecured++;
        }
      }
    }
  }

  function resizeTabs() {
    var width = (localStorage.tabprefs_tabwidth ? localStorage.tabprefs_tabwidth : 15),
        height = (localStorage.tabprefs_tabheight ? localStorage.tabprefs_tabheight : 5),
        tabAnchors = document.querySelectorAll('#user-tabs .nav-tabs li a');
    for (var i = 0; i < tabAnchors.length; i++) {
      tabAnchors[i].style.cssText += ';padding:' + height + 'px ' + width + 'px !important';
      tabAnchors[i].style.height = 'auto';
    }
    if (!localStorage.tabprefs_adjustSidepanel) { // Work in progress for resizing of other sidepanel tabs
      return;
    }
    var editPanelAnchors = document.querySelectorAll('#edit-panel .nav.nav-tabs > li > a');
    _.each(editPanelAnchors, (editPanelAnchor) => { editPanelAnchor.style.cssText += ';padding:' + height + 'px ' + width + 'px !important' });
  }

  function saveTab(anchor) {
    if (!anchor.originalChildren) { // only do so if it hasn't been done yet
      var children = [];
      _.each(anchor.childNodes, (anchorChild) => children.push(anchorChild));
      anchor.originalTitle = anchor.title || anchor.dataset.originalTitle || anchor.parentNode.title || anchor.parentNode.dataset.originalTitle;
      if (!anchor.title) {
        anchor.title = anchor.textContent.trim();
      }
      $(anchor).tooltip({
        trigger: 'hover'
      });
      anchor.originalChildren = children;
    }
  }

  function restoreTab(anchor) {
    while (anchor.firstChild) {
      anchor.removeChild(anchor.firstChild);
    }
    anchor.originalChildren.forEach(function(node) {
      anchor.appendChild(node);
      if (node.classList) {
        node.classList.remove('hidden');
      }
    });
    delete anchor.originalChildren;
    if (anchor.originalTitle) {
      anchor.title = anchor.originalTitle;
      $(anchor).tooltip({
        trigger: 'hover'
      });
    } else {
      anchor.removeAttribute('title');
      $(anchor).tooltip('destroy');
      delete anchor.dataset.originalTitle;
    }
    delete anchor.originalTitle;
  }

  function renameTabs(hash) {
    _.each(document.querySelectorAll('#user-tabs .nav-tabs li a'), (anchor) => {
      var config = Storage.getTabConfig(anchor.hash);
      if (config && config.icon && (!anchor.originalChildren || hash == anchor.hash)) {
        saveTab(anchor);
        if (config.icon) {
          var span = document.createElement('span');
          switch (config.icon.fontFamily) {
            case 'FontAwesome':
              span.className = 'fa';
              break;
            default:
              log('Unsupported fontFamily found: ' + config.icon.fontFamily);
          }
          span.classList.add('replacement');
          span.appendChild(document.createTextNode(String.fromCharCode(config.icon.charCode)));
          if (anchor.querySelector('span')) {
            span.addEventListener('click', function(e) { e.target.previousElementSibling.dispatchEvent(new Event('click')); });
          }
          cleanTabAnchor(anchor);
          anchor.appendChild(span);
          /*if (anchor.hash === '#sidepanel-feed') {
            var feedObserver = new MutationObserver(function(mutations, observer) {
              renameTabs(anchor.hash);
              observer.disconnect(); // we only need to clean once, otherwise we'll hide our own icon
            });
            feedObserver.observe(anchor, {
              childList: true
            });
          }*/
        }
      }
      // Replacements have been removed, revert
      if (!config.icon && !config.name && anchor.originalChildren) {
        restoreTab(anchor);
      }
    });
  }

  function cleanTabAnchor(anchor) {
    _.each(anchor.childNodes, function(node) {
      if (!node) {
        return;
      }
      if (node.classList && !node.classList.contains('replacement')) {
        node.classList.add('hidden');
      } else {
        anchor.removeChild(node);
      }
    });
  }

  function adjustTabColors() {
    _.each(document.querySelectorAll('#user-tabs .nav-tabs li a'), (anchor) => {
      var config = Storage.getTabConfig(anchor.hash);
      anchor.style.borderBottomWidth = '0';
      if (config && (config.backgroundColor || config.color)) {
        saveTab(anchor);
      }
      anchor.style.backgroundColor = config && config.backgroundColor && !anchor.parentNode.classList.contains('active') ? config.backgroundColor : '';
      anchor.style.color = config && config.color && !anchor.parentNode.classList.contains('active') ? config.color : '';
    });
  }

  function updateTabs() {
    renameTabs();
    adjustTabColors();
  }

  function refreshTabPanel() {
    var tabPanel = document.getElementById('tabPreferencesOrder');
    if (!tabPanel) {
      return;
    }
    var order = localStorage.tabprefs_preserveOrder.split(',');
    while (tabPanel.firstChild) { // clear out tabPanel's children
      tabPanel.removeChild(tabPanel.firstChild);
    }
    order.forEach(function(hash, index, obj) {
      var card = document.createElement('wz-card'),
          item = document.createElement('div'),
          name = document.createElement('div'),
          buttons = document.createElement('div'),
          moveUp = createIconButton('fa-chevron-up', I18n.t('tabpreferences.prefs.move_up_tab')),
          moveDown = createIconButton('fa-chevron-down', I18n.t('tabpreferences.prefs.move_down_tab')),
          remove = createIconButton('fa-remove', I18n.t('tabpreferences.prefs.remove_tab')),
          hide = createIconButton((Storage.isTabVisible(hash) ? 'fa-eye' : 'fa-eye-slash'), I18n.t('tabpreferences.prefs.hide_tab')),
          edit = createIconButton('fa-pencil', I18n.t('tabpreferences.prefs.edit_tab')),
          anchor = document.querySelector('#user-tabs .nav-tabs li a[href$="'+hash+'"]'),
          tabConfig = {};
      if (anchor) {
        tabConfig = Storage.getTabConfig(hash);
      }
      card.className = 'result list-item-card';
      card.style.cursor = 'default';
      item.className = 'tab-manager-list-card';
      card.appendChild(item);
      // Add item handle
      var handle = document.createElement('div');
      handle.className = 'tab-manager-list-handle';
      handle.innerHTML = '<i class="fa fa-reorder"></i>';
      item.appendChild(handle);
      name.className = 'tab-manager-tab-handle-name';
      // Add name and replacement
      if (anchor) {
        var title;
        if (tabConfig.icon || tabConfig.backgroundColor || tabConfig.color) {
          title = anchor.originalTitle;
          var arrow = document.createElement('span');
          arrow.className = 'fa fa-arrow-right';
          arrow.style.color = '#888';
          arrow.style.margin = '0 6px';
          anchor.originalChildren.forEach(function(node) {
            name.appendChild(node.cloneNode(true));
          });
          if (title) {
            name.appendChild(document.createTextNode(' (' + title + ')'));
          }
          name.appendChild(arrow);
          var replacement = document.createElement('span');
          replacement.style.padding = '2px 4px';
          replacement.style.borderRadius = '5px';
          replacement.style.backgroundColor = tabConfig.backgroundColor || '';
          replacement.style.color = tabConfig.color || '';
          for (var i = 0; i < anchor.childNodes.length; i++) {
            if (anchor.childNodes[i].textContent == '\n') {
              continue;
            }
            replacement.appendChild(anchor.childNodes[i].cloneNode(true));
          }
          name.appendChild(replacement);
        } else {
          name.innerHTML = anchor.innerHTML;
          title = anchor.title || anchor.dataset.originalTitle || anchor.parentNode.title || anchor.parentNode.dataset.originalTitle;
          if (title) {
            name.appendChild(document.createTextNode(' (' + title + ')'));
          }
        }
        if (!Storage.isTabVisible(hash)) {
          name.style.color = '#888';
        }
      } else {
        name.style.color = '#888';
        name.style.fontStyle = 'italic';
        name.appendChild(document.createTextNode(hash));
      }
      item.appendChild(name);
      // Add action buttons
      if (!anchor) {
        remove.addEventListener('click', function() {
          obj.splice(index, 1);
          localStorage.tabprefs_preserveOrder = obj.join();
          refreshTabPanel();
        });
        buttons.appendChild(remove);
      } else {
        if (hash !== '#sidepanel-prefs') { // Prevent the preferences tab from being hidden and getting locked out
          hide.addEventListener('click', function() {
            if (Storage.isTabVisible(hash)) {
              this.classList.remove('fa-eye');
              this.classList.add('fa-eye-slash');
              anchor.parentNode.style.display = 'none';
              Storage.setTabVisibility(hash, false);
            } else {
              this.classList.remove('fa-eye-slash');
              this.classList.add('fa-eye');
              anchor.parentNode.style.display = 'block';
              Storage.setTabVisibility(hash, true);
            }
            refreshTabPanel();
          });
          hide.addEventListener('mouseenter', function() {
            this.classList.toggle('fa-eye-slash', Storage.isTabVisible(hash));
            this.classList.toggle('fa-eye', !Storage.isTabVisible(hash));
          });
          hide.addEventListener('mouseleave', function() {
            this.classList.toggle('fa-eye', Storage.isTabVisible(hash));
            this.classList.toggle('fa-eye-slash', !Storage.isTabVisible(hash));
          });
          buttons.appendChild(hide);
        }
        edit.addEventListener('click', function() {
          if (!item.details) {
            createTabConfigPane(item, hash);
          } else {
            item.parentNode.removeChild(item.details);
            item.details = false;
          }
        });
        buttons.appendChild(edit);
      }
      if (index === order.length - 1) {
        moveDown.style.cursor = 'default';
        moveDown.style.color = '#aaa';
      } else {
        moveDown.addEventListener('click', function() {
          obj.splice(index+1, 0, obj.splice(index, 1)[0]);
          localStorage.tabprefs_preserveOrder = obj.join();
          reorderTabs(true);
          refreshTabPanel();
        });
      }
      buttons.appendChild(moveDown);
      if (index === 0) {
        moveUp.style.color = '#aaa';
        moveUp.style.cursor = 'default';
      } else {
        moveUp.addEventListener('click', function() {
          obj.splice(index-1, 0, obj.splice(index, 1)[0]);
          localStorage.tabprefs_preserveOrder = obj.join();
          reorderTabs(true);
          refreshTabPanel();
        });
      }
      buttons.appendChild(moveUp);
      buttons.className = 'tab-manager-card-buttons';
      item.appendChild(buttons);
      tabPanel.appendChild(card);
    });
    sortable(tabPanel);
  }

  function createIconButton(icon, title) {
    var button = document.createElement('button');
    button.className = 'fa ' + icon + ' tab-manager-icon-button';
    if (title) {
      button.title = title;
      $(button).tooltip({
        trigger: 'hover'
      });
    }
    return button;
  }

  function createDetailsLabel(text) {
    var block = document.createElement('div');
    block.textContent = text;
    return block;
  }

  function createColorChooser(propertyName, hash) {
    var div = document.createElement('div'),
        btn = document.createElement('a'),
        input = document.createElement('input'),
        noneSet = document.createElement('span'),
        tabConfig = Storage.getTabConfig(hash);
    input.type = 'color';
    input.classList.toggle('hidden', !tabConfig[propertyName]);
    var eventListener = function() {
      tabConfig[propertyName] = input.value;
      Storage.setTabConfig(hash, tabConfig);
      adjustTabColors();
    };
    input.addEventListener('input', eventListener);
    input.addEventListener('change', eventListener);
    div.appendChild(input);
    noneSet.style.fontStyle = 'italic';
    noneSet.appendChild(document.createTextNode(I18n.t('tabpreferences.prefs.none_set')));
    noneSet.classList.toggle('hidden', tabConfig[propertyName] != undefined);
    div.appendChild(noneSet);
    btn.style.marginLeft = '10px';
    btn.style.cursor = 'pointer';
    btn.textContent = tabConfig[propertyName] ? I18n.t('tabpreferences.prefs.reset') : I18n.t('tabpreferences.prefs.set');
    btn.addEventListener('click', function(e) {
      noneSet.classList.toggle('hidden');
      input.classList.toggle('hidden');
      btn.textContent = input.classList.contains('hidden') ? I18n.t('tabpreferences.prefs.set') : I18n.t('tabpreferences.prefs.reset');
      if (!input.classList.contains('hidden')) {
        input.dispatchEvent(new MouseEvent(e.type, e));
      } else {
        delete tabConfig[propertyName];
        Storage.setTabConfig(hash, tabConfig);
        adjustTabColors();
      }
    });
    div.appendChild(btn);
    if (tabConfig[propertyName]) {
      input.value = tabConfig[propertyName];
    }
    return div;
  }

  function createFilterInput(handler) {
    var form = document.createElement('div'),
        input = document.createElement('input');
    form.className = 'form-search tab-manager-icons-filter';
    input.className = 'search-query';
    input.autocomplete = 'off';
    input.placeholder = 'Filter icons';
    form.appendChild(input);
    input.addEventListener('change', handler);
    input.addEventListener('input', handler);
    input.setAttribute('list', 'tab-manager-icon-filter');
    return form;
  }

  function checkVersion() {
    var version = localStorage.tabprefs_version,
        scriptVersion = GM_info.script.version;
    if (!version) {
      showMessage(I18n.t('tabpreferences.update.first_run'));
      localStorage.tabprefs_version = scriptVersion;
    } else if (version !== scriptVersion) {
      if (versions.indexOf(version) === -1) {
        // There's tampering happening if we arrive here, just set to current version and ignore issue
        localStorage.tabprefs_version = scriptVersion;
        return;
      }
      var message = I18n.t('tabpreferences.update.message');
      for (var i = versions.indexOf(version)+1; i < versions.length; i++) {
        message += '\nv' + versions[i] + ':\n' + I18n.t('tabpreferences.update.v' + versions[i].replace(/\./g, '_'));
      }
      showMessage(message);
      localStorage.tabprefs_version = scriptVersion;
    }
  }

  function createTabConfigPane(container, hash) {
    var tabConfig = Storage.getTabConfig(hash),
        details = document.createElement('div'),
        iconDiv = document.createElement('div'),
        iconBtn = document.createElement('a'),
        icon = document.createElement('span'),
        reset = document.createElement('button'),
        close = document.createElement('button');
    details.appendChild(createDetailsLabel(I18n.t('tabpreferences.prefs.icon')));
    iconBtn.appendChild(document.createTextNode((tabConfig.icon ? I18n.t('tabpreferences.prefs.change') : I18n.t('tabpreferences.prefs.set'))));
    iconBtn.className = 'tab-manager-add-icon-button';
    iconBtn.addEventListener('click', function() {
      if (!iconBtn.filterContainer) {
        var iconsFilterContainer = document.createElement('div'),
            icons = document.createElement('div');
        iconsFilterContainer.className = 'tab-manager-icons-filter';
        icons.className = 'tab-manager-icons-container';
        // FontAwesome: symbols start at 'F000' (= 61440) and end at 'F2E0' in version 4.7 of FontAwesome (Waze uses 4.7)
        for (var i = 61440; i <= 62177; i++) {
          var icon = document.createElement('div');
          icon.appendChild(document.createTextNode(String.fromCharCode(i)));
          icon.className = 'tab-manager-select-icon';
          if (tabConfig && tabConfig.icon && tabConfig.icon.charCode == i) {
            icon.classList.add('selected');
          }
          // TODO: add suggested here as well after creating some suggestions
          icon.dataset.charCode = i;
          icon.addEventListener('click', function() {
            tabConfig.icon = {
              fontFamily: 'FontAwesome',
              charCode: this.dataset.charCode
            };
            Storage.setTabConfig(hash, tabConfig);
            container.parentNode.removeChild(details);
            renameTabs(hash);
            refreshTabPanel();
          });
          icons.appendChild(icon);
        }
        iconsFilterContainer.appendChild(icons);
        var iconsFilter = createFilterInput((event) => {
          var filterText = event.target.value;
          while (iconFilterList.firstChild) {
            iconFilterList.removeChild(iconFilterList.firstChild);
          }
          _.each(document.querySelectorAll('.tab-manager-select-icon'), (icon) => icon.classList.add('hidden'));
          Object.keys(iconKeywords).forEach((font) => {
            Object.keys(iconKeywords[font])
              .filter((keyword) => keyword.indexOf(filterText) != -1)
              .forEach((keyword) => {
              iconKeywords[font][keyword].forEach((code) => {
                document.querySelector('.tab-manager-select-icon[data-char-code="' + code + '"]').classList.remove('hidden');
              });
              iconFilterList.appendChild(new Option(keyword));
            });
          });
        });
        iconsFilterContainer.appendChild(iconsFilter);
        details.insertBefore(iconsFilterContainer, reset);
        iconBtn.filterContainer = iconsFilterContainer;
      } else {
        details.removeChild(iconBtn.filterContainer);
        iconBtn.filterContainer = false;
      }
    });
    if (tabConfig.icon) {
      icon.style.fontFamily = tabConfig.icon.fontFamily;
      icon.appendChild(document.createTextNode(String.fromCharCode(tabConfig.icon.charCode)));
    } else {
      icon.style.fontStyle = 'italic';
      icon.appendChild(document.createTextNode(I18n.t('tabpreferences.prefs.none_set')));
    }
    iconDiv.appendChild(icon);
    iconDiv.appendChild(iconBtn);
    details.appendChild(iconDiv);
    details.appendChild(createDetailsLabel(I18n.t('tabpreferences.prefs.background_color')));
    details.appendChild(createColorChooser('backgroundColor', hash));
    details.appendChild(createDetailsLabel(I18n.t('tabpreferences.prefs.text_color')));
    details.appendChild(createColorChooser('color', hash));
    reset.appendChild(document.createTextNode(I18n.t('tabpreferences.prefs.reset_tab')));
    reset.style.margin = '0 5px';
    reset.className = 'btn btn-danger';
    reset.addEventListener('click', function() {
      Storage.removeTabConfig(hash);
      container.parentNode.removeChild(details);
      container.details = false;
      updateTabs();
      refreshTabPanel();
    });
    details.appendChild(reset);
    close.appendChild(document.createTextNode(I18n.t('tabpreferences.prefs.close')));
    close.style.margin = '0 5px';
    close.className = 'btn btn-default';
    close.addEventListener('click', function() {
      container.parentNode.removeChild(details);
      container.details = false;
      refreshTabPanel();
    });
    details.appendChild(close);
    details.className = 'tab-manager-tab-details';
    container.details = details;
    container.after(details);
  }

  function showMessage(message) {
    alert('Tab Manager\n=============\n' + message);
  }

  function log(message) {
    if (console.log) {
      console.log('%cWME Tab Manager: %c' + message, 'color:black', 'color:#d97e00');
    }
  }

  function applyStyles() {
    if (!styleElement) {
      var styleElement = document.createElement('style');
      styleElement.textContent = `
#sidepanel-prefs .controls-container {
  padding: 10px 0;
}
#tabPreferencesOrder {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.tab-manager-list-card {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}
.tab-manager-list-handle {
  color: #c2c2c2;
  cursor: move;
  font-size: 20px;
}
.tab-manager-tab-handle-name {
  border-right: 1px solid rgb(213, 215, 219);
  padding-right: 3px;
  flex-grow: 1;
}
.tab-manager-card-buttons {
  flex-shrink: 0;
}
.tab-manager-tab-details {
  border-top: 1px solid rgb(213, 215, 219);
  margin-top: 10px;
  padding-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  font-size: 14px;
}
.tab-manager-tab-details > div:nth-child(odd) {
  text-align: right;
}
.tab-manager-add-icon-button {
  margin-left: 10px;
  cursor: pointer;
}
.tab-manager-icon-button {
  border: none;
  background: none;
  padding: 0 2px;
  cursor: pointer;
  height: auto;
  outline: none;
}
.tab-manager-tab-details > div.tab-manager-icons-filter {
  grid-column: 1 / span 2;
  text-align: left;
  padding: 3px;
  border-top: 1px solid rgb(213, 215, 219);
  margin-top: 10px;
  padding-top: 10px;
}
.tab-manager-icons-filter > .form-search {
  margin-bottom: 5px;
}
.tab-manager-icons-filter > .form-search > .search-query {
  padding-left: 16px;
}
div.tab-manager-icons-filter > .tab-manager-icons-container {
  height: 10em;
  padding: 3px;
  overflow: auto;
  font-size: 12px;
  word-wrap: break-word;
  font-family: FontAwesome;
}
.tab-manager-select-icon {
  cursor: pointer;
  width: 1.28571em;
  float: left;
  margin-right: 1px;
  text-align: center;
}
.tab-manager-icons-container .selected {
  text-shadow: 0 0 10px #00edff, 1px 1px #00edff;
}
.tab-manager-icons-container .suggested {
  text-shadow: 0 0 10px orange, 1px 1px orange;
}
`;
    }
    if (!styleElement.parentNode) {
      document.head.appendChild(styleElement);
    }
  }

  init();
})();
