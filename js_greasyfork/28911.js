// ==UserScript==
// @name         Southpoke
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This tweaks southpoke to show gym names instead of just the co-ordinates. It also shows a progress bar for the prestige of each gym. If a gym scan is out-of-date, this is highlighted to make it easier to spot.
// @author       Tim Jeanes
// @match        https://southpoke.the-wild.tk/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28911/Southpoke.user.js
// @updateURL https://update.greasyfork.org/scripts/28911/Southpoke.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var locationLookup = {
        "50.786995, -1.3411770": "Lepe Wildflower Meadow Information Board",
        "50.814450, -1.3093150": "Supermarine S.6B Mural",
        "50.819814, -1.3077660": "Calshot Castle",
        "50.825872, -1.3985890": "Bridge Tavern",
        "50.833466, -1.3868860": "---",
        "50.839591, -1.3898040": "Church of Dereliction",
        "50.847302, -1.2911790": "St Mary's Church",
        "50.851155, -1.4171470": "Heath Hotel - Dibden Purlieu",
        "50.852271, -1.3065340": "Combined Operations D-Day Memo",
        "50.853143, -1.2942610": "Warsash United Reformed Church",
        "50.853268, -1.2968050": "The Great War Memorial",
        "50.853869, -1.4138020": "Lawnswood Anchor",
        "50.861970, -1.3885220": "Shore Road Playing Field",
        "50.863519, -1.2748040": "Locks Heath Shopping Centre",
        "50.866422, -1.3982750": "The Malt Pub - Hythe",
        "50.866456, -1.3952380": "Hythe Railway Station",
        "50.868221, -1.2902460": "Holly Hill Woodland Park",
        "50.868247, -1.4205120": "Clayfields Sport Centre",
        "50.868361, -1.3418750": "Sun Dial",
        "50.870761, -1.2653560": "Kams Palace",
        "50.871044, -1.4025340": "\"Come On Hythe\" Memorial Bench",
        "50.872546, -1.3537060": "The Stone Lady",
        "50.872936, -1.3999890": "Old Marina Crane",
        "50.873967, -1.3447260": "Netley Abbey Sports And Social Club",
        "50.874636, -1.3976650": "VE VJ Combined Operations Memorial",
        "50.876187, -1.3324390": "Hound Church",
        "50.876581, -1.3572660": "Netley Cricket Field",
        "50.881724, -1.3110280": "Grayladyes Arts Foundation",
        "50.882930, -1.2637010": "Leafy Lane Leafy Bench Art",
        "50.883584, -1.3680670": "Weston Shore Glorious Mud",
        "50.883783, -1.2990930": "The Navigator, Swanwick",
        "50.883961, -1.3049180": "Bursledon Station",
        "50.884736, -1.4504860": "---",
        "50.887471, -1.3780680": "Oystercatcher",
        "50.888607, -1.3120230": "Bursledon Village Hall",
        "50.888681, -1.3156460": "Linden Tree Pub",
        "50.889762, -1.3830060": "Southampton Sailing Club And Public Slipway",
        "50.890126, -1.4528760": "St John the Apostle Church",
        "50.891935, -1.3620690": "Mayfield Park play area",
        "50.892452, -1.4007820": "Calshot Spit Light Boat",
        "50.893077, -1.3783160": "St Mark's Parish Church",
        "50.894495, -1.3485530": "Purvis Gardens Play area Park",
        "50.894777, -1.4059210": "Southampton Red Jet Terminal",
        "50.894952, -1.3150190": "Bursledon Windmill",
        "50.896124, -1.5060980": "Colbury Church",
        "50.896397, -1.2935010": "HMS Cricket Memorial",
        "50.896535, -1.3645990": "Sholing Train Station",
        "50.896836, -1.3905220": "Bowsprit",
        "50.897166, -1.5111670": "Saint Joseph's",
        "50.897676, -1.3741610": "The Bridge",
        "50.898097, -1.3819650": "Woolston Floating Bridge",
        "50.899274, -1.3576920": "St Mary's Church",
        "50.899486, -1.4003970": "Ship Head",
        "50.899502, -1.3971460": "Metal Seagulls",
        "50.901386, -1.4049930": "Southampton Castle Gate",
        "50.901865, -1.4434860": "Marchwood Royal Armament Depot Information Board",
        "50.902152, -1.5022340": "Memorial Hall",
        "50.902366, -1.3769030": "Peartree Green Church",
        "50.902663, -1.4031990": "Town Wall Remnant",
        "50.902712, -1.3452590": "Imber Way Play Area",
        "50.903520, -1.3962160": "City College",
        "50.904034, -1.3732800": "The Peartree",
        "50.904224, -1.2768150": "Manor Farm",
        "50.904251, -1.3202410": "Old Netley Common",
        "50.904588, -1.3318920": "Dumbleton Dandelions",
        "50.905317, -1.3965270": "Lights",
        "50.905528, -1.5064420": "New Forest Boundary",
        "50.905756, -1.3896230": "Ted Bates Memorial Statue",
        "50.906081, -1.3395270": "Green Tripod of Antelope Park",
        "50.907258, -1.3337880": "Hinkler Market Community Gardens",
        "50.907415, -1.4065420": "Civic Centre, Southampton",
        "50.907509, -1.4142770": "Station Graffiti",
        "50.907820, -1.4035670": "Garden of Roses",
        "50.908438, -1.3579980": "Curved Entrance to Itchen College",
        "50.908711, -1.3301630": "Hinkler Green, Thornhill",
        "50.909340, -1.4229280": "The Key and Anchor",
        "50.910075, -1.3814310": "Shamrock Quay Anchor",
        "50.911220, -1.3054060": "Hedge end Village Hall",
        "50.911277, -1.3175700": "Southern Parishes Conservative Club",
        "50.911339, -1.4046180": "Cocks, Hens and Homers",
        "50.911502, -1.4282290": "Christ Church, Freemantle",
        "50.911668, -1.3879120": "Honest Dave",
        "50.911979, -1.4206700": "Copulating AT-ATs",
        "50.911987, -1.4814950": "Anchor Inn",
        "50.912385, -1.3090070": "Bridget Mary Garden",
        "50.912864, -1.3967080": "St. Mary's",
        "50.913021, -1.5079920": "Ball Flume Park",
        "50.913112, -1.4219890": "Emmanuel Church",
        "50.914086, -1.3982940": "Singh Sacha Gurdwara",
        "50.914433, -1.2737520": "All Saint's Church, Botley, b.1836",
        "50.914503, -1.3583590": "Red Lion Pub",
        "50.914531, -1.3566590": "Red Lion Underpass Mosaic",
        "50.915055, -1.3345090": "Thornhill Baptist Church",
        "50.915321, -1.5289660": "The White Horse",
        "50.915812, -1.3968440": "Gudwara Nakasar",
        "50.915868, -1.4537350": "Holy Trinity, Millbrook",
        "50.916125, -1.4249680": "Freemantle Reformed Church",
        "50.916266, -1.4089110": "Archers Bar",
        "50.916368, -1.5146110": "Trinity Church",
        "50.917459, -1.5025730": "Old Farmhouse, Totton",
        "50.917495, -1.4923530": "Anchor House, Totton",
        "50.917701, -1.4034130": "Canute Rebukes his Courtier",
        "50.918572, -1.4828910": "McDonalds Drive Thru",
        "50.918782, -1.4293480": "The Brass Monkey",
        "50.918865, -1.4961480": "Lion On Guard",
        "50.918933, -1.4152170": "Southampton Common",
        "50.919167, -1.2954740": "The Lady in Gray",
        "50.919434, -1.3811160": "Birds",
        "50.919737, -1.4886860": "In Rememberance of Ann",
        "50.919813, -1.4705200": "Redbridge Overpass",
        "50.919960, -1.5207590": "Seed Pod",
        "50.920196, -1.4573180": "Green Park",
        "50.920245, -1.4304510": "St Boniface's Church, Southampton",
        "50.920663, -1.4138100": "Nonconformist Chapel Southampton Old Cemetery",
        "50.920665, -1.3881140": "The Junction Inn",
        "50.921118, -1.3017620": "Westward Road Play Area Park",
        "50.921188, -1.4045550": "Avenue Church",
        "50.921272, -1.5069010": "Tottonians Rugby Club",
        "50.921522, -1.5034930": "Players",
        "50.921987, -1.3877940": "St Denys Platform 4",
        "50.922644, -1.2938070": "Berrywood Playground",
        "50.923372, -1.4957770": "Testwood Club",
        "50.923583, -1.4345810": "Shirley Precinct Memorial",
        "50.924403, -1.3761290": "Bitterne Triangle",
        "50.924493, -1.3242520": "Bowlers Action",
        "50.924573, -1.4474310": "Iron Waves",
        "50.924604, -1.4220040": "Bassett Lawn Tennis Club",
        "50.924755, -1.3833400": "St Denys Church",
        "50.925155, -1.3932940": "Broadway",
        "50.926108, -1.4424200": "Roadside Bugs",
        "50.926789, -1.3909300": "The Mitre",
        "50.927251, -1.4294440": "St. James Park Sculpture",
        "50.927294, -1.3325980": "In Memory of the Men of this Village",
        "50.927426, -1.3787410": "Riverside Miniature Railway",
        "50.928267, -1.4596990": "Mansel Park Pavilion",
        "50.928450, -1.4866210": "Lower Test Wildlife Reserve",
        "50.928456, -1.4119670": "The Ornamental Lake",
        "50.928496, -1.3367780": "West End Parish Centre",
        "50.928950, -1.3060990": "Salvation Army Church",
        "50.929159, -1.3850800": "The Talking Heads",
        "50.929499, -1.4468410": "St. Peters Church",
        "50.929577, -1.3952110": "Highfield Church",
        "50.929898, -1.4059870": "Underpass Mural",
        "50.929997, -1.3022880": "Jumping Fish Sculpture",
        "50.930272, -1.3455890": "The Master Builder",
        "50.930642, -1.4034650": "Common Park Highfield Entrance",
        "50.931027, -1.5038740": "The Testwood",
        "50.931091, -1.3996520": "The Goat Pub",
        "50.931501, -1.4601410": "Colne Avenue Baptist Church",
        "50.931877, -1.3756360": "Welcome To Riverside Park",
        "50.932322, -1.4221750": "Isaac Watts Memorial Church",
        "50.932472, -1.3872630": "Portswood Rec",
        "50.932547, -1.3839510": "Flame Sculpture",
        "50.933028, -1.3722640": "Riverside",
        "50.933668, -1.4339050": "Southampton General Hospital Orbs",
        "50.935112, -1.3959070": "Hartley Library",
        "50.935428, -1.4066460": "Southampton Common Reservoir Entrance Sign",
        "50.936495, -1.3755760": "St Mary's Church",
        "50.936837, -1.3752910": "Stoneham Cemetery",
        "50.937675, -1.3965710": "The Stile Inn",
        "50.937728, -1.3993430": "Southampton Common Park Entrance",
        "50.937897, -1.4586740": "Brownhill Way Subway",
        "50.938410, -1.5097770": "A Bench with a Lake View",
        "50.938479, -1.4193810": "Southampton Sports Center",
        "50.939151, -1.3876800": "St Albans Church",
        "50.940364, -1.4491510": "Lordshill Church",
        "50.940418, -1.5091170": "Wild Animal Sculpted Log",
        "50.940574, -1.4267020": "King Church Centre",
        "50.941019, -1.4069400": "First World War Memorial",
        "50.942522, -1.3453410": "High Wood Barn",
        "50.942780, -1.4516350": "Lordshill Community Centre",
        "50.944679, -1.3906070": "Saint Christopher's Prayer Hall",
        "50.945849, -1.4619860": "Horns Inn",
        "50.946270, -1.4238880": "Lords Wood",
        "50.950761, -1.3631060": "Southampton Parkway",
        "50.953536, -1.3739950": "St. Nicolas Church",
        "50.955337, -1.3644310": "Eastleigh Lakeside Railway",
        "50.960134, -1.3760940": "Stoneham War Shrine",
        "50.962329, -1.3805440": "Avenue Park North",
        "50.962754, -1.4246980": "Chilworth Manor Bell Tower",
        "50.964415, -1.4168040": "The Chilworth Arms",
        "50.966001, -1.3886820": "Time Capsule",
        "50.966552, -1.3902360": "Water Silo",
        "50.971791, -1.3832930": "Metal Birds",
        "50.975610, -1.4406750": "All Saints Church North Baddesley",
        "50.978246, -1.4020110": "The Cleveland Bay",
        "50.986278, -1.3853870": "St Boniface Church",
        "50.986326, -1.5065950": "Sadler's Mill Plaque",
        "50.986905, -1.4999110": "Romsey Christian Church",
        "50.987822, -1.3731020": "Chandler's Ford Library",
        "50.987851, -1.4045090": "Knight Wood (Test Valley)",
        "50.988400, -1.5038140": "Poetry Plaque, Betty Tucker",
        "50.989898, -1.5004690": "The Charter Stone",
        "50.990291, -1.4029250": "Bellflower Way Playground",
        "50.991199, -1.4967580": "Romsey Library",
        "50.991200, -1.4782290": "Tadburn Meadows",
        "50.991335, -1.4857500": "Pub Panda",
        "50.992270, -1.4821680": "Lantern Seat",
        "50.992613, -1.3964750": "Lower Flexford Wildlife Trust",
        "50.995390, -1.3724180": "Hiltingbury Lakes",
        "50.998622, -1.4698440": "Hunters Inn",
        "51.000629, -1.3549660": "Castle Folly",
        "51.002996, -1.3502920": "St. Matthews Church, Otterbourne",
        "51.009618, -1.4221580": "St Mark's Church Ampfield",
        "51.011441, -1.4588850": "Toby",
        "51.019271, -1.5084590": "St. Andrew's Church Timsbury",
        "51.037222, -1.3202280": "Hockley Viaduct Sign",
        "51.046603, -1.3098100": "Winchester Miz Maze",
        "51.047137, -1.3222950": "St Cross Hospital Church",
        "51.047207, -1.3106520": "St Catherines Hill Nature Reserve",
        "51.047951, -1.3470510": "St. Mark's Church",
        "51.054470, -1.3321450": "Sportsman's Club",
        "51.054559, -1.3178670": "The Queen Inn",
        "51.059741, -1.3286110": "Wire Eagle",
        "51.059942, -1.3276910": "Winchester University Chapel",
        "51.060936, -1.3143340": "Cathedral in Winchester",
        "51.061084, -1.3078630": "Winchester City Mill",
        "51.061422, -1.2896650": "Winchester Masonic Centre",
        "51.061840, -1.3209020": "Museum Fountain",
        "51.062637, -1.3150340": "Buttercross",
        "51.063153, -1.3225320": "St James Tavern",
        "51.063856, -1.3194930": "Hampshire Hog",
        "51.064339, -1.3073430": "Winnal Moors",
        "51.068827, -1.3041710": "Historic Water Meadows",
        "51.068862, -1.3144950": "St Bartholomew's",
        "51.069192, -1.3173460": "The Winchester Club",
        "51.071438, -1.3337600": "St Matthew's Church",
        "51.074643, -1.3356520": "Wesley Methodist Church",
    };

    var prestigeMarker = "Prestige: ";
    var prestigeLevels = [2000, 2000, 4000, 4000, 4000, 4000, 10000, 10000, 10000];
    var prestigeScale = 250;
    var prestigeLevelSpace = '1px';
    var prestigeMissingColor = '#ccc';
    var lastScannedPrefix = "Last Scanned: ";
    var locationPrefix = "Location: ";

    var checkGymPopups = function() {
        var today = new Date();
        var todayString = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
        var $gymPopups = $('div.gm-style-iw');
        $gymPopups.each(function () {
            var $gymPopup = $(this);

            var ownerColor;
            if ($gymPopup.is(':contains("Team Mystic")'))
                ownerColor = 'rgb(74, 138, 202)';
            else if ($gymPopup.is(':contains("Team Valor")'))
                ownerColor = 'rgb(240, 68, 58)';
            else if ($gymPopup.is(':contains("Team Instinct")'))
                ownerColor = 'rgb(254, 178, 0)';
            else
                ownerColor = 'rgb(0, 0, 0)';

            var $lastScannedDiv = $gymPopup.find('div:contains("' + lastScannedPrefix + '")').filter(function() { return $(this).children().length === 0;});
            var lastScannedDate =  $.trim($lastScannedDiv.text()).substr(lastScannedPrefix.length, 10);
            if (lastScannedDate < todayString)
                $lastScannedDiv.css({
                    background: '#9c0006',
                    color: '#fff'
                });

            var $locationDiv = $gymPopup.find('div:contains("' + locationPrefix + '")').filter(function() { return $(this).children().length === 0;});
            var latLong = $.trim($locationDiv.text()).substr(locationPrefix.length);
            var locationName = locationLookup[latLong];
            if (locationName) {
                $locationDiv
                    .text(locationPrefix + locationName)
                    .attr('title', latLong);
            }

            var $prestigeDiv = $gymPopup.find('div:contains("' + prestigeMarker + '")').filter(function() { return $(this).children().length === 0;});
            if ($prestigeDiv.length > 0 && $prestigeDiv.find('.prestigeBar').length === 0) {
                var prestigeText = $prestigeDiv.text();
                var prestigePos = prestigeText.indexOf(prestigeMarker);
                if (prestigePos >= 0) {

                    var prestige = parseInt(prestigeText.substr(prestigePos + prestigeMarker.length));
                    var $prestigeBar = $('<div class="prestigeBar" style="position: relative; top: -9px; height: 2px; padding: 0; white-space: nowrap;"></div>');
                    var level = 0;
                    var remainingPrestigeInLevel = 0;

                    while (level < prestigeLevels.length && prestige > 0) {
                        var segmentLength = Math.min(prestige, prestigeLevels[level]);
                        var segmentPixels = segmentLength / prestigeScale;
                        var margin = '0';
                        if (segmentLength === prestigeLevels[level])
                            margin = prestigeLevelSpace;
                        $prestigeBar.append($('<div style="display: inline-block; height: 2px; margin: 0 ' + margin + ' 0 0; background-color: ' + ownerColor + '; width: ' + segmentPixels + 'px;"></div>'));
                        remainingPrestigeInLevel = prestigeLevels[level] - prestige;
                        prestige -= segmentLength;
                        level++;
                    }

                    if (remainingPrestigeInLevel > 0)
                        $prestigeBar.append($('<div style="display: inline-block; height: 2px; margin: 0 ' + prestigeLevelSpace + ' 0 0; background-color: ' + prestigeMissingColor + '; width: ' + (remainingPrestigeInLevel / prestigeScale) + 'px;"></div>'));

                    for (; level < prestigeLevels.length; level++)
                        $prestigeBar.append($('<div style="display: inline-block; height: 2px; margin: 0 ' + prestigeLevelSpace + ' 0 0; background-color: ' + prestigeMissingColor + '; width: ' + (prestigeLevels[level] / prestigeScale) + 'px;"></div>'));

                    $prestigeDiv.append($prestigeBar);
                }
            }
        });

        setTimeout(checkGymPopups, 100);
    };

    checkGymPopups();
})();