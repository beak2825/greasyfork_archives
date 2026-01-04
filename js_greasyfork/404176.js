// ==UserScript==
// @name         Abroad Items Info (Yata API)
// @namespace    hardy.yata.abroad
// @version      2.2
// @description  Updates Yata Database and shows Items on Travel Agency page
// @author       Hardy[2131687]
// @match        https://www.torn.com/travelagency.php*
// @match        https://www.torn.com/index.php*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      yata.yt
// @downloadURL https://update.greasyfork.org/scripts/404176/Abroad%20Items%20Info%20%28Yata%20API%29.user.js
// @updateURL https://update.greasyfork.org/scripts/404176/Abroad%20Items%20Info%20%28Yata%20API%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var hide_doctorn = true;
    //a function to format currency
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    function titleCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }
    function sortTable(columnId) {
        let id = columnId;
        let index = id.split("_")[3];
        let uid = `hardy_${id.split("_")[2]}_order`;
        let table = $("#hardy_table");
        let tbody = $("#hardy_tbody");

        if (index == "0" || index == "2" || index == "5") {
            tbody.find('tr').sort(function(a, b) {
                if ($("#"+uid).val() == 'asc') {
                    return $('td:eq('+index+')', a).text().localeCompare($('td:eq('+index+')', b).text());
                } else
                {
                    return $('td:eq('+index+')', b).text().localeCompare($('td:eq('+index+')', a).text());
                }
            }).appendTo(tbody);
        } else if (index == "6") {
            tbody.find('tr').sort(function(a, b) {
                if ($("#"+uid).val() == 'asc') {
                    return parseInt($('td:eq('+index+')', a).text().split("bitch!")[1]) - parseInt($('td:eq('+index+')', b).text().split("bitch!")[1]);
                } else
                {
                    return parseInt($('td:eq('+index+')', b).text().split("bitch!")[1]) - parseInt($('td:eq('+index+')', a).text().split("bitch!")[1]);
                }
            }).appendTo(tbody);
        } else {
            tbody.find('tr').sort(function(a, b) {
                if ($("#"+uid).val() == 'asc') {
                    return parseInt($('td:eq('+index+')', a).text().replace(/,/g, "").replace(/\$/, "")) - parseInt($('td:eq('+index+')', b).text().replace(/,/g, "").replace(/\$/, ""));
                } else
                {
                    return parseInt($('td:eq('+index+')', b).text().replace(/,/g, "").replace(/\$/, "")) - parseInt($('td:eq('+index+')', a).text().replace(/,/g, "").replace(/\$/, ""));
                }
            }).appendTo(tbody);
        }
        let sort_order = $('#'+uid).val();
        if (sort_order == "asc") {
            document.getElementById(uid).value = "desc";
            changeHeader(id, "asc");
        }
        if (sort_order == "desc") {
            document.getElementById(uid).value = "asc";
            changeHeader(id, "desc");
        }
    }
    
    function changeHeader(columnId, sortOrder) {
        let header = document.querySelector(".table_heading_row");
        header.innerHTML = '<th class="hardy_travel_sortable_header" id="hardy_header_destination_0">Destination &#x25B2;&#x25BC;</th><th>Item</th><th class="hardy_travel_sortable_header" id="hardy_header_item_2">Name &#x25B2;&#x25BC;</th><th class="hardy_travel_sortable_header" id="hardy_header_quantity_3">Quantity &#x25B2;&#x25BC;</th><th class="hardy_travel_sortable_header" id="hardy_header_price_4">Price &#x25B2;&#x25BC;</th><th class="hardy_travel_sortable_header" id="hardy_header_type_5">Type &#x25B2;&#x25BC;</th><th class="hardy_travel_sortable_header" id="hardy_header_stamp_6">Update &#x25B2;&#x25BC;</th>';
        let elem = document.getElementById(columnId);
        console.log(columnId);
        let text = elem.innerText.split(" ")[0];
        if (sortOrder == "asc") {
            elem.innerHTML = text + ' &#x25BC;';
        } else if (sortOrder == "desc") {
            elem.innerHTML = text + ' &#x25B2;';
        }
    }
    //converting timestamp to make Last update time human readable. Thanks to Pyrit for this function
    function lastUpdate(seconds) {
        let time = Date.now()/1000;
        seconds = Math.floor(time - seconds);
        let result = "";
        if (seconds >= 3600) {
            const hours = Math.floor(seconds / 3600);
            result += `${hours} hour${hours > 1 ? "s": ""}`;
        }
        if (seconds >= 60) {
            const minutes = Math.floor((seconds % 3600) / 60);
            result +=
                `${seconds >= 3600 ? " and ": ""}` +
                `${minutes} minute${minutes > 1 ? "s": ""}`;
        }
        if (seconds >= 3600) {
            return result;
        } else {
            return (
                result +
                `${seconds >= 60 ? " and ": ""}` +
                `${seconds % 60} second${seconds >= 60 ? "s": ""}`
      );
        }
    }
    function getUnique(array) {
        var uniqueArray = [];
        for (var value of array) {
            if (uniqueArray.indexOf(value) === -1) {
                uniqueArray.push(value);
            }
        }
        return uniqueArray;
    }
    // all item types: ['Temporary', 'Plushie', 'Alcohol', 'Primary', 'Melee', 'Other', 'Clothing', 'Secondary', 'Flower', 'Defensive', 'Drug', 'Electronic', 'Enhancer', 'Medical']
    var itemsAllList = {'items': {'Temporary': {'Claymore Mine': '229', 'Trout': '616', 'HEG': '242', 'Grenade': '220', 'Stick Grenade': '221', 'Throwing Knife': '257', 'Tear Gas': '256', 'Flash Grenade': '222', 'Ninja Stars': '239', 'Fireworks': '246', 'Smoke Grenade': '226'}, 'Plushie': {'Jaguar Plushie': '258', 'Stingray Plushie': '618', 'Wolverine Plushie': '261', 'Red Fox Plushie': '268', 'Nessie Plushie': '266', 'Monkey Plushie': '269', 'Chamois Plushie': '273', 'Panda Plushie': '274', 'Camel Plushie': '384', 'Lion Plushie': '281'}, 'Alcohol': {'Bottle of Tequila': '426', 'Bottle of Saké': '294'}, 'Primary': {'ArmaLite M-15A4 Rifle': '399', '9mm Uzi': '108', 'AK-47': '26', 'SIG 550': '232', 'Minigun': '63', 'M249 PARA LMG': '31', 'Heckler & Koch SL8': '231', 'Tavor TAR-21': '612', 'Ithaca 37': '252', 'Anti Tank': '240', 'Bushmaster Carbon 15 Type 21s': '241', 'Enfield SA-80': '219', 'SIG 552': '398', 'Jackhammer': '223', 'SKS Carbine': '249', 'Gold Plated AK-47': '382', 'Pink Mac-10': '388', 'Mag 7': '225', 'Vektor CR-21': '228'}, 'Melee': {'Samurai Sword': '11', 'Taser': '175', 'Ninja Claws': '111', 'Leather Bullwhip': '110', 'Axe': '8', 'Naval Cutlass': '615', 'Diamond Bladed Knife': '614', 'Ice Pick': '402', 'Cricket Bat': '438', 'Flail': '397', 'Frying Pan': '439', 'Claymore Sword': '217', 'Macana': '391', 'Swiss Army Knife': '224', 'Kodachi Swords': '237', 'Sai': '238', 'Kama': '236', 'Wooden Nunchakus': '235', 'Metal Nunchakus': '395', 'Chain Whip': '234', 'Wushu Double Axes': '251', 'Bo Staff': '245', 'Guandao': '400', 'Katana': '247', 'Twin Tiger Hooks': '250', 'Pillow': '440', 'Handbag': '387', 'Spear': '227', 'Knuckle Dusters': '4'}, 'Other': {'Mayan Statue': '259', 'Yucca Plant': '409', 'Blank Tokens': '327', 'Bolt Cutters': '159', 'Crazy Straw': '432', 'Nodding Turtle': '620', 'Steel Drum': '619', 'Hockey Stick': '262', 'Blank Credit Cards': '328', 'Fire Hydrant': '410', 'Pele Charm': '265', 'Dart Board': '431', 'Ship in a Bottle': '415', 'Sextant': '408', 'Tailors Dummy': '418', 'Paper Weight': '416', 'Model Space Ship': '411', 'Compass': '407', 'Soccer Ball': '270', 'Snowboard': '436', 'Sensu': '433', 'Maneki Neko': '279', 'Sumo Doll': '427', 'Chopsticks': '429', 'Yakitori Lantern': '434', 'Printing Paper': '326', 'Stick of Dynamite': '335', 'Jade Buddha': '275', 'Afro Comb': '406', 'Elephant Statue': '280'}, 'Clothing': {'Trench Coat': '107', 'Wetsuit': '625', 'Speedo': '623', 'Diving Gloves': '626', 'Flippers': '622', 'Bikini': '624', 'Snorkel': '621', 'Mountie Hat': '413', 'Coconut Bra': '430', 'Kabuki Mask': '278', 'Sports Shades': '412', 'Proda Sunglasses': '414'}, 'Defensive': {'Outer Tactical Vest': '50', 'Kevlar Gloves': '640', 'Flak Jacket': '178', 'Safety Boots': '645', 'WWII Helmet': '641', 'Liquid Body Armor': '333', 'Flexible Body Armor': '334', 'Construction Helmet': '643', 'Combat Pants': '652', 'Combat Helmet': '651', 'Combat Gloves': '654', 'Combat Vest': '332', 'Combat Boots': '653'}, 'Secondary': {'Springfield 1911-A1': '99', 'Flare Gun': '230', 'Cobra Derringer': '177', 'Desert Eagle': '20', 'Harpoon': '613', 'Lorcin 380': '253', 'S&W M29': '254', 'Taurus': '243', 'Crossbow': '218', 'Flamethrower': '255', 'BT MP9': '233', 'Blowgun': '244', 'Qsz-92': '248'}, 'Flower': {'Dahlia': '260', 'Banana Orchid': '617', 'Crocus': '263', 'Orchid': '264', 'Heather': '267', 'Ceibo Flower': '271', 'Edelweiss': '272', 'Dozen White Roses': '435', 'Cherry Blossom': '277', 'Peony': '276', 'Tribulus Omanense': '385', 'African Violet': '282'}, 'Drug': {'Ecstasy': '197', 'Cannabis': '196', 'Vicodin': '205', 'PCP': '201', 'Xanax': '206', 'Ketamine': '198', 'Shrooms': '203', 'Speed': '204', 'LSD': '199', 'Opium': '200'}, 'Enhancer': {'Medium Suitcase': '420', 'Small Suitcase': '419', 'Large Suitcase': '421', 'Sports Sneakers': '386'}, 'Medical': {'Neumune Tablet': '361'}, 'Electronic': {'Platinum PDA': '383', 'Gold Laptop': '381'}}};
    function getItemType(arg) {
        for (let p in itemsAllList["items"]) {
            for (let k in itemsAllList["items"][p]) {
                if (itemsAllList["items"][p][k] == arg) {
                    return p;
                }
            }
        }
    }
    //Not all item types added to avoid cluttering. But you can add them below in the below array as per requirement
    var type_list = ["Drug", "Flower", "Plushie", "Defensive", "Clothing", "Temporary", "Primary", "Enhancer"];

    var country_list = ["Mexico", "Cayman Islands", "Canada", "Hawaii", "United Kingdom", "Argentina", "Switzerland", "Japan", "China", "UAE", "South Africa"];

    var countrylowerList = ['mex', 'cay', 'can', 'haw', 'uni', 'arg', 'swi', 'jap', 'chi', 'uae', 'sou'];

    //hiding DoctorN Travel hub and box on abroad and Travel Agency page
    function hideDoctorn() {
        var hide_doctorn = true;
        var check_drn = document.querySelectorAll(".doctorn-widgets");
        if (hide_doctorn && check_drn.length > 0) {
            check_drn.forEach(e => {
                e.style.display = "none";
            });
        }
    }

    var selections = localStorage.getItem("hardy_yata_travel_selections");
    if (typeof selections == "undefined" || selections == null) {
        selections = "none";
    }
    //function to send data to Yata
    function sendData(args) {
        let msg_box = $(".hardy_abroad_msg")[0];
        GM_xmlhttpRequest({
            method: "POST",
            data: JSON.stringify(args),
            headers: {
                "content-type": "application/json",
            },
            url: "https://yata.yt/api/v1/travel/import/",
            onload: function(e) {
                let text = JSON.parse(e.responseText);
               // console.log(e);
                if (e.status ==  200) {
                    msg_box.innerHTML = '<p class="hardy_label">Successfully updated Yata!!</p><button class="hardy_travel_max">Max</button>';
                    console.log(text);
                } else {
                    msg_box.innerHTML = `<p class="hardy_label">Unable to update Yata. ${text.message}</p><button class="hardy_travel_max">Max</button>`;
                    //console.log(text);
                }
            },
            onerror: (err) => {
                console.log(err);
                msg_box.innerHTML = `<p class="hardy_label">Unable to update Yata. ${err}</p><button class="hardy_travel_max">Max</button>`;
            }
        });
    }

    //checking if the user is on abroad page. if conditions satisfied then it adds a div to page and sends data to Yata
    if (window.location.href.includes("index.php")) {
        if ($(".captcha").length == 0 && document.getElementsByClassName('msg right-round').length > 1) {
            let node = document.getElementsByClassName('msg right-round')[1].childNodes[1].childNodes[0].data;
            if (country_list.indexOf(node) != -1) {
                hideDoctorn();
                let box = document.createElement("div");
                box.className = "hardy_abroad_msg1";
                box.innerHTML = '<div class="delimiter"><div class="hardy_abroad_msg"><button class="hardy_travel_max">Max</button></div></div><br><br>';
                document.getElementsByClassName("info-msg-cont")[1].insertBefore(box, document.getElementsByClassName("info-msg")[1]);
                let msg_box = $(".hardy_abroad_msg")[0];
                msg_box.innerHTML = '<p class="hardy_label">Sending data to Yata.....</p><button class="hardy_travel_max">Max</button>';
                let obj = {};
                obj.country = document.getElementsByClassName('msg right-round')[1].childNodes[1].childNodes[0].data.substring(0, 3).toLowerCase();
                obj.client = "Father's Abroad Items Tracker";
                obj.version = "v2.2";
                obj.author_name = "Father";
                obj.author_id = 2131687;
                let item = [];
                const target = document.querySelectorAll(".users-list")[0].children;
                for (var pi = 0; pi < target.length; pi++) {
                    let node = target[pi];
                    let span = node.querySelector(".item-info-wrap");
                    let id = parseInt(node.querySelector(".details").getAttribute("itemid"));
                    let cost = parseInt(span.querySelector(".cost .c-price").innerText.replace(/,/g, "").replace(/\s/g, "").replace(/\$/g, ""));
                    let amount = parseInt(span.querySelector(".stock .stck-amount").innerText.replace(/,/g, "").replace(/\s/g, ""));
                    let dict = {};
                    dict.id = id
                    dict.cost = cost;
                    dict.quantity = amount;
                    item.push(dict);
                }
                obj.items = item;
                sendData(obj);
            }
        }
    }

    //creating function to add HTML to add on Travel Agency page
    function addHtmlBox() {
        let html1 = '<br><br><div id="hardy_box_header">YATA Abroad Items</div><div class="hardy_travel_items_box"><div style="display:inline-block!important;"><button id="hardy_refresh" style="float:left;">Refresh</button><button id="hardy_save_selections" style="float:right;">Save Selections</button></div><div id="travel_option_msg"></div><div class="hardy_travel_filters"><div id="show_hide_filter1">Country Filter Options </div><div id="country_checkboxes">';
        let html2 = '</div><br><br><div id="show_hide_filter2">Item Types Filter Options</div><div id="type_checkboxes">';
        let html3 = '</div></div><br><br><div class="hardy_travel_data_table", style="overflow-x:auto"></div><br></div><br><br>';
        let array1 = [];
        let array_ = [];
        if (selections != "none") {
            var selected_countries = JSON.parse(selections)["country"];
            var selected_types = JSON.parse(selections)["types"];
        }
        for (var k = 0; k < 11; k++) {
            let country = country_list[k];
            var checked = "";
            if (selections != "none") {
                if (selected_countries.indexOf(country) != -1) {
                    checked = " checked";
                }
            }
            array1.push(`<input type="checkbox" class="hardy_checkbox" id="hardy_country_check_${country.toLowerCase().substring(0, 3)}"${checked}><label>${country}</label><br>`);
        }
        for (var x = 0; x < type_list.length; x++) {
            let type = type_list[x];
            var isType = "";
            if (selections != "none") {
                if (selected_types.indexOf(type) != -1) {
                    isType = " checked";
                }
            }
            array_.push(`<input type="checkbox" class="hardy_checkbox" id="hardy_type_check_${type.toLowerCase().replace(/\s/, "-9")}"${isType}><label>${type}</label><br>`);
        }
        $(".content-wrapper").append(html1 + array1.join("") + html2 +array_.join("")+ html3);
    }


    function getData() {
        $(".hardy_travel_data_table")[0].innerHTML = '<p class="hardy_label" align="center">Loading data.....</p>';
        GM_xmlhttpRequest({
            method: 'GET',
            timeout: 20000,
            url: 'https://yata.yt/api/v1/travel/export/',
            responseType: 'json',
            onload: function(e) {
                try {
                    sessionStorage.setItem('hardy_travel_data', JSON.stringify(e.responseText));
                    setTimeout(createTable, 2500);

                } catch (error) {
                    $(".hardy_travel_data_table")[0].innerHTML = `<p class="hardy_label">${error}</p>`;
                }
            },
            onerror: (err) => {
                $(".hardy_travel_data_table")[0].innerHTML = `<p class="hardy_label">${err}</p>`;
            },
            ontimeout: (err) => {
                $(".hardy_travel_data_table")[0].innerHTML = `<p class="hardy_label">Request timed out. Try again by pressing the "Refresh" button.</p>`;
            }
        });

    }

    function createTable() {
        let data = sessionStorage.getItem('hardy_travel_data');
        if (typeof data == "undefined" || data == null) {
            getData();
        } else if (data == 'nope') {
            $(".hardy_travel_data_table")[0].innerHTML = '<p class="hardy_label">The requested data is not currently available. Kindly check again after a few minutes. </p>';
        } else {
            let stock = JSON.parse(data)["stocks"];
            let countries = [];
            let country_boxes = $("#country_checkboxes")[0].children;
            for (var j = 0; j < country_boxes.length; j++) {
                let node = country_boxes[j];
                if (node.className == "hardy_checkbox" && node.checked) {
                    let first3Letters = node.id.split("_")[3];
                    countries.push(first3Letters);
                }
            }
            let types = [];
            let type_boxes = $("#type_checkboxes")[0].children;
            for (var hj = 0; hj < type_boxes.length; hj++) {
                let nodes = type_boxes[hj];
                if (nodes.className == "hardy_checkbox" && nodes.checked) {
                    let first = nodes.id.split("_")[3].replace("-9", " ");
                    let itemType = titleCase(first);
                    let itemNames = itemsAllList["items"][itemType];
                    for (let v in itemNames) {
                        types.push(itemNames[v]);
                    }
                }
            }
            let length1 = countries.length;
            let length2 = types.length;
            if (length1 > 0 || length2 > 0) {
                let array2 = [];
                for (let countryId in stock) {
                    let countryInfo = stock[countryId];
                    let lastUpdateTime = lastUpdate(countryInfo["update"]);
                    let itemsInCountryArray = countryInfo["stocks"];
                    for (let pp = 0; pp < itemsInCountryArray.length; pp++) {
                        let item = itemsInCountryArray[pp];
                        if (length1 > 0 && length2 > 0) {
                            if (countries.indexOf(countryId) != -1 && types.indexOf(String(item["id"])) != -1) {
                                let image = `<img src="/images/items/${item["id"]}/medium.png", alt = "${item["name"]}" > `;
                                array2.push(`<tr><td>${country_list[countrylowerList.indexOf(countryId)]}</td><td>${image}</td><td>${item["name"]}</td><td>${item["quantity"]}</td><td>\$${formatNumber(item["cost"])}</td><td>${getItemType(item["id"])}</td><td>${lastUpdateTime} ago <p class="hidden_stamps">bitch!${countryInfo["update"]}</p></td></tr>`);
                            }
                        } else {
                            if (countries.indexOf(countryId) != -1 || types.indexOf(String(item["id"])) != -1) {
                                let image = `<img src="/images/items/${item["id"]}/medium.png", alt = "${item["name"]}" > `;
                                array2.push(`<tr><td>${country_list[countrylowerList.indexOf(countryId)]}</td><td>${image}</td><td>${item["name"]}</td><td>${item["quantity"]}</td><td>\$${formatNumber(item["cost"])}</td><td>${getItemType(item["id"])}</td><td>${lastUpdateTime} ago <p class="hidden_stamps">bitch!${countryInfo["update"]}</p></td></tr>`);
                            }
                        }
                    }
                }
                let table_html1 = '<table id="hardy_table"><tr class="table_heading_row"><th class="hardy_travel_sortable_header" id="hardy_header_destination_0">Destination &#x25B2;&#x25BC;</th><th>Item</th><th class="hardy_travel_sortable_header" id="hardy_header_item_2">Name &#x25B2;&#x25BC;</th><th class="hardy_travel_sortable_header" id="hardy_header_quantity_3">Quantity &#x25B2;&#x25BC;</th><th class="hardy_travel_sortable_header" id="hardy_header_price_4">Price &#x25B2;&#x25BC;</th><th class="hardy_travel_sortable_header" id="hardy_header_type_5">Type &#x25B2;&#x25BC;</th><th class="hardy_travel_sortable_header" id="hardy_header_stamp_6">Update &#x25B2;&#x25BC;</th></tr><tbody id="hardy_tbody">';

                if (array2.length > 0) {
                    let final_array = getUnique(array2);
                    $(".hardy_travel_data_table")[0].innerHTML = `${table_html1}${final_array.join("")}</tbody></table><input type="hidden" id="hardy_destination_order" value="asc"><input type="hidden" id="hardy_item_order" value="asc"><input type="hidden" id="hardy_price_order" value="asc"><input type="hidden" id="hardy_quantity_order" value="desc"><input type="hidden" id="hardy_type_order" value="asc"><input type="hidden" id="hardy_stamp_order" value="asc">`;
                    sortTable("hardy_header_quantity_3");
                } else {
                    $(".hardy_travel_data_table")[0].innerHTML = '<p class="hardy_label"> The requested data is not currently available. Kindly try again later. </p>';
                }
            } else {
                $(".hardy_travel_data_table")[0].innerHTML = "";
            }
        }
    }
    
    if (window.location.href.includes("travelagency.php")) {
        hideDoctorn();
        addHtmlBox();
        getData();
        createTable();
        console.log("Created Table");
    }

    document.addEventListener("click", function(g) {
        if (g.target.className == "hardy_travel_sortable_header") {
            sortTable(g.target.id);
        } else if (g.target.className == "hardy_travel_max") {
            let bold = $(".bold");
            let max_cap = parseInt(bold[5].innerText);
            let used_cap = parseInt(bold[4].innerText);
            let left = max_cap - used_cap;
            let target = document.querySelectorAll(".users-list")[0].children;
            for (var t = 0; t < target.length; t++) {
                let node = target[t];
                let span = node.querySelector(".item-info-wrap");
                let amount = parseInt(span.querySelector(".stock .stck-amount").innerText.replace(/,/g, "").replace(/\s/g, ""));
                let input_box = span.querySelector(".deal .numb");
                let box2 = node.querySelector(".confirm-buy .confirm-deal .amount-confirm .numb");
                if (amount >= left) {
                    input_box.value = left;
                    box2.value = left;
                } else {
                    input_box.value = amount;
                    box2.value = amount;
                }
            }
        } else if (g.target.id == "show_hide_filter1") {
            let node = document.getElementById("country_checkboxes");
            let button = document.getElementById("show_hide_filter1");
            if (node.style.display == "none") {
                node.style.display = "block";
            } else {
                node.style.display = "none";
            }
        } else if (g.target.id == "show_hide_filter2") {
            let node = document.getElementById("type_checkboxes");
            let button = document.getElementById("show_hide_filter2");
            if (node.style.display == "none") {
                node.style.display = "block";
            } else {
                node.style.display = "none";
            }
        } else if (g.target.className == "hardy_checkbox") {
            createTable();
        } else if (g.target.id == "hardy_refresh") {
            getData();
            createTable();
            document.getElementById("travel_option_msg").innerHTML = '<p class="hardy_label">Data refreshed</p>';
            console.log("refresh");
        } else if (g.target.id == "hardy_box_header") {
            let box = $(".hardy_travel_items_box")[0];
            if (box.style.display == "none") {
                box.style.display = "block";
            } else {
                box.style.display = "none";
            }
        } else if (g.target.id == "hardy_save_selections") {
            let country_boxes = $("#country_checkboxes")[0].children;
            let country_array_save = [];
            for (var j = 0; j < country_boxes.length; j++) {
                let node = country_boxes[j];
                if (node.className == "hardy_checkbox" && node.checked) {
                    let first = node.id.split("_")[3];
                    var upperCase = country_list[countrylowerList.indexOf(first)];

                    country_array_save.push(upperCase);
                }
            }
            let types_save = [];
            let type_boxes = $("#type_checkboxes")[0].children;
            for (var hj = 0; hj < type_boxes.length; hj++) {
                let nodes = type_boxes[hj];
                if (nodes.className == "hardy_checkbox" && nodes.checked) {
                    let first = nodes.id.split("_")[3].replace("-9", " ");
                    types_save.push(titleCase(first));
                }
            }
            let settings = {};
            settings.country = country_array_save;
            settings.types = types_save;
            localStorage.setItem("hardy_yata_travel_selections", JSON.stringify(settings));
            document.getElementById("travel_option_msg").innerHTML = '<p class="hardy_label">Settings Saved</p>';
            console.log("Settings Saved");
        }
    });
    //adding CSS to page
    GM_addStyle(`
    .hardy_travel_items_box, .hardy_abroad_msg, #country_checkboxes, #type_checkboxes { border-radius: 8px; background-color: rgb(242, 242, 242); box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -moz-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -webkit-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); padding. 10px;}
    .hardy_label { padding: 10px; padding-top: 10px; padding-right: 30px; padding-bottom: 10px; padding-left: 30px; font-size: 18px }
    .hardy_travel_filters { padding: 10px; margin: auto; width: 85%;}
    .hardy_travel_data_table {padding: 10px; margin: auto; width: 85%; }
    .hardy_travel_data_table table { color: #333; font-family: Helvetica, Arial, sans-serif; width: 640px; border: 2px #808080 solid; }
    .hardy_travel_filters input{ margin-right: 10px; margin-bottom: 4px; margin-left: 10px; margin-top: 3px;}
    .hardy_travel_filters label{ margin: 0px 3px 0px 3px; }
    .hardy_travel_data_table td, th { border: 1px solid rgba(0, 0, 0, .55); height: 30px; transition: all 0.3s; }
    .hardy_travel_data_table th { background: #868282; font-weight: bold; text-align: center; }
    .hardy_travel_data_table td { background: #c6c4c4; text-align: center; }
    .hardy_travel_data_table tr:nth-child(even) td { background: #F1F1F1; }
    .hardy_travel_data_table tr:nth-child(odd) td { background: #c6c4c4; }
    .hardy_travel_data_table tr td:hover { background: #666; color: #FFF; }
    .hardy_abroad_msg1 {background-color: #cfcfcf; }
    .hidden_stamps { display : none; }
    #hardy_refresh { margin: 25px;}
    #hardy_save_selections { margin-top: 25px; }
    .hardy_travel_max { margin-left: 30px; margin-top: 10px; margin-bottom: 10px;}
    #show_hide_filter1, #hardy_box_header, #show_hide_filter2 { background-color: #0d0d0d; border: 2px solid #000; border-radius: 0.5em 0.5em 0 0; text-indent: 0.5em; font-size: 18px; color: #ffff; }
    `);
})();
