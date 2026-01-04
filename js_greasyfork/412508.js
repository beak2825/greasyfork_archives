// ==UserScript==
// @name         Flight Rising: Auction House - Dragon - Image Increase, Card Style
// @author       https://greasyfork.org/en/users/547396
// @description  Increases the size of dragon images on the auction house. Set card style display for easier browsing (optional).
// @namespace    https://greasyfork.org/users/547396
// @match        https://*.flightrising.com/auction-house/buy/*/dragons*
// @grant        none
// @version      3.0
// @downloadURL https://update.greasyfork.org/scripts/412508/Flight%20Rising%3A%20Auction%20House%20-%20Dragon%20-%20Image%20Increase%2C%20Card%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/412508/Flight%20Rising%3A%20Auction%20House%20-%20Dragon%20-%20Image%20Increase%2C%20Card%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Settings
    const cardStyle = true, // true: display as cards | false: default
          minimalData = false, // if cardStyle is true - true: remove excess data for quicker browsing | false: default
          showColors = true; // show dragon colors (only renders in card style)

    let globalSettings = [ cardStyle, minimalData, showColors ];

    // let's goooo
    init();

    function init() {
        const dragonRow = document.getElementsByClassName('ah-listing-row'),
              listingContainer = document.getElementById('ah-content');

        restyleContainer( listingContainer, globalSettings[0], globalSettings[1] );
        defineElements( dragonRow );
    }

    function defineElements( dragonRow ) {
        let dragon;

        for ( dragon of dragonRow ) {
            let icon = dragon.querySelector('.ah-listing-dragon-icon'),
                image = icon.getElementsByTagName('img'),
                imageSrc = image[0].src,
                content = dragon.querySelector('.ah-listing-left'),
                elements = dragon.querySelector('.ah-listing-center'),
                price = dragon.querySelector('.ah-listing-right'),
                dtip = 'dragontip-' + dragon.getAttribute('data-listing-dragonid'),
                tertiaryColor = document.createElement('small');


            if ( showColors && cardStyle ) {
                setTimeout( function() {
                    getDragonTipInfo(dtip, tertiaryColor);
                    content.appendChild(tertiaryColor);
                }, 500 );
            }

            image[0].src = updateImageSizes( imageSrc );

            applyStyles( globalSettings, icon, dragon, content, elements, price );
        }
    }

    function getDragonTipInfo( dragonid, elem ) {
        let dinfo = document.getElementById(dragonid.toString());
        let findColors = [dinfo.querySelector('div:nth-child(2) > div:nth-child(4)').innerText, dinfo.querySelector('div:nth-child(2) > div:nth-child(5)').innerText, dinfo.querySelector('div:nth-child(2) > div:nth-child(6)').innerText];
        let tertColor = findColors[2].split('Tertiary Gene:')[1].split(' ')[1];
        let secondaryColor = findColors[1].split('Secondary Gene:')[1].split(' ')[1];
        let primaryColor = findColors[0].split('Primary Gene:')[1].split(' ')[1];
        
        renderColorblock(tertColor, elem, '-140px');
        renderColorblock(secondaryColor, elem, '-150px');
        renderColorblock(primaryColor, elem, '-160px');
    }

    function renderColorblock( colour, elem, topPX ) {
        let colorBlock = document.createElement('span');
        let getHex = frColors.find(x => x.name === colour).hex;
        let getID = frColors.find(x => x.name === colour).id;
        let defineColor = ( (getID > 13 && getID < 90) || (getID > 132 && getID < 174)) ? '#FFF' : '#000';

        colorBlock.style.backgroundColor = getHex;
        colorBlock.style.color = defineColor;
        colorBlock.style.padding = '1px 3px';
        colorBlock.style.position = 'absolute';
        colorBlock.style.top = topPX;
        colorBlock.style.right = '-12px';
        colorBlock.style.fontSize = '7px';
        colorBlock.style.maxHeight = '8px';

        colorBlock.innerText = colour;

        elem.appendChild(colorBlock);
        //return colorBlock;
    }

    function updateImageSizes( imageSrc ) {
        imageSrc = imageSrc.replace('avatars', '350');
        imageSrc = imageSrc.replace('.png', '_350.png');

        return imageSrc;
    }

    function applyStyles( settingStyle, icon, dragon, content, elements, price ) {
        let energyBar = dragon.getElementsByClassName('ah-energy-bar')[0],
            coliLevel = dragon.getElementsByClassName('ah-coli-level')[0],
            sellPrice = dragon.getElementsByClassName('ah-listing-sellprice')[0],
            sellPriceLabel = sellPrice.getElementsByTagName('div')[0],
            buyButton = dragon.getElementsByClassName('ah-listing-buy-button')[0],
            currency = dragon.getElementsByClassName('ah-listing-currency')[0],
            cost = dragon.getElementsByClassName('ah-listing-cost')[0],
            dragonID = dragon.getElementsByClassName('ah-dragon-id')[0],
            expiry = dragon.getElementsByClassName('ah-listing-expiry')[0],
            barFg = dragon.getElementsByClassName('ah-energy-bar-fg')[0],
            currencyIcon = dragon.getElementsByClassName('ah-listing-currency-icon')[0];

        icon.style.width = '135px';
        icon.style.height = '135px';
        icon.style.margin = '-10px 0 0 0';

        if ( settingStyle[0] == true ) {
            dragon.style.flex = '0 0 25%';
            dragon.style.boxSizing = 'border-box';
            dragon.style.height = '330px';
            dragon.style.overflow = 'hidden';
            dragon.style.borderRight = '1px solid silver';
            dragon.style.padding = '10px';
            content.style.position = 'relative';
            elements.style.position = 'relative';
            price.style.position = 'relative';
            content.style.left = '0';
            elements.style.left = '0';
            price.style.left = '0';
            content.style.top = '20px';
            elements.style.top = '25px';
            price.style.top = '20px';
            price.style.textAlign = 'left';
            sellPriceLabel.style.display = 'none';
            sellPrice.style.height = 'auto';
            currency.style.marginBottom = '10px';
            buyButton.style.width = '100%';
            buyButton.style.height = '40px';
            buyButton.style.padding = '0';
            buyButton.style.textAlign = 'center';
            buyButton.style.margin = '0';
            buyButton.style.fontSize = '20px';
            buyButton.style.lineHeight = '2';
            buyButton.style.backgroundImage = 'none';
            buyButton.innerText = 'BUY';
            buyButton.classList.add('redbutton');
            buyButton.classList.add('anybutton');
            dragonID.style.fontSize = '8px';
            coliLevel.style.fontSize = '8px';
            coliLevel.style.textAlign = 'right';
            coliLevel.style.float = 'right';
            coliLevel.style.marginTop = '-17px';
            expiry.style.fontSize = '8px';
            expiry.style.height = '20px';
            expiry.style.marginTop = '-5px';
            energyBar.style.width = '50px';
            energyBar.style.float = 'right';
            energyBar.style.margin = '-25px 0 0';
            cost.style.fontSize = '15px';
            currencyIcon.style.width = '17px';
            currencyIcon.style.height = '17px';
            currencyIcon.style.bottom = '0';
            barFg.style.backgroundSize = '100% 100%';

            // bigger!!!!
            icon.style.width = '155px';
            icon.style.height = '155px';
            icon.style.margin = '-25px 0 0 0';
        } else {
            dragon.style.height = '150px';
            content.style.left = '150px';
            content.style.top = '52px';
            elements.style.top = '52px';
            elements.style.left = '410px';
            price.style.top = '52px';
        }

        if ( settingStyle[1] == true && settingStyle[0] == true ) {
            expiry.style.display = 'none';
            energyBar.style.display = 'none';
            coliLevel.style.display = 'none';
            elements.style.top = '15px';
            price.style.top = '5px';
            dragon.style.height = '300px';
        }
    }

    function restyleContainer( parent, style ) {
        const rows = document.querySelectorAll('div#ah-content > div');

        if ( style == true ) {
            parent.style.display = 'flex';
            parent.style.flexWrap = 'wrap';

            for ( let div of rows ) {
                 div.style.flex = '0 0 100%';
            }
        }
    }

    const frColors = [
        {
            "id": 1,
            "name": "Maize",
            "hex": "#FFFDEA"
        },
        {
            "id": 2,
            "name": "Cream",
            "hex": "#FFEFDC"
        },
        {
            "id": 3,
            "name": "Antique",
            "hex": "#D8D6CD"
        },
        {
            "id": 4,
            "name": "White",
            "hex": "#FFFFFF"
        },
        {
            "id": 5,
            "name": "Moon",
            "hex": "#D8D7D8"
        },
        {
            "id": 6,
            "name": "Ice",
            "hex": "#F1F3FF"
        },
        {
            "id": 7,
            "name": "Orca",
            "hex": "#E1DFFF"
        },
        {
            "id": 8,
            "name": "Platinum",
            "hex": "#C8BECE"
        },
        {
            "id": 9,
            "name": "Silver",
            "hex": "#BBBABF"
        },
        {
            "id": 10,
            "name": "Dust",
            "hex": "#9D9D9F"
        },
        {
            "id": 11,
            "name": "Grey",
            "hex": "#808080"
        },
        {
            "id": 12,
            "name": "Smoke",
            "hex": "#9494A9"
        },
        {
            "id": 13,
            "name": "Gloom",
            "hex": "#545365"
        },
        {
            "id": 14,
            "name": "Lead",
            "hex": "#413C40"
        },
        {
            "id": 15,
            "name": "Shale",
            "hex": "#4D484F"
        },
        {
            "id": 16,
            "name": "Flint",
            "hex": "#636268"
        },
        {
            "id": 17,
            "name": "Charcoal",
            "hex": "#555555"
        },
        {
            "id": 18,
            "name": "Coal",
            "hex": "#4B4946"
        },
        {
            "id": 19,
            "name": "Oilslick",
            "hex": "#352C27"
        },
        {
            "id": 20,
            "name": "Black",
            "hex": "#333333"
        },
        {
            "id": 21,
            "name": "Obsidian",
            "hex": "#1D2224"
        },
        {
            "id": 22,
            "name": "Eldritch",
            "hex": "#252A24"
        },
        {
            "id": 23,
            "name": "Midnight",
            "hex": "#392D43"
        },
        {
            "id": 24,
            "name": "Shadow",
            "hex": "#292B38"
        },
        {
            "id": 25,
            "name": "Blackberry",
            "hex": "#4C2A4F"
        },
        {
            "id": 26,
            "name": "Mulberry",
            "hex": "#6E235D"
        },
        {
            "id": 27,
            "name": "Plum",
            "hex": "#863290"
        },
        {
            "id": 28,
            "name": "Wisteria",
            "hex": "#724D79"
        },
        {
            "id": 29,
            "name": "Thistle",
            "hex": "#8F7C8B"
        },
        {
            "id": 30,
            "name": "Fog",
            "hex": "#A794B2"
        },
        {
            "id": 31,
            "name": "Mist",
            "hex": "#E1CDFE"
        },
        {
            "id": 32,
            "name": "Lavender",
            "hex": "#CCA4E0"
        },
        {
            "id": 33,
            "name": "Heather",
            "hex": "#9778BE"
        },
        {
            "id": 34,
            "name": "Purple",
            "hex": "#A261CF"
        },
        {
            "id": 35,
            "name": "Orchid",
            "hex": "#DA4FFF"
        },
        {
            "id": 36,
            "name": "Amethyst",
            "hex": "#993BD1"
        },
        {
            "id": 37,
            "name": "Nightshade",
            "hex": "#7930B5"
        },
        {
            "id": 38,
            "name": "Violet",
            "hex": "#643F9C"
        },
        {
            "id": 39,
            "name": "Grape",
            "hex": "#580FC0"
        },
        {
            "id": 40,
            "name": "Royal",
            "hex": "#4D2C89"
        },
        {
            "id": 41,
            "name": "Eggplant",
            "hex": "#3F2B66"
        },
        {
            "id": 42,
            "name": "Iris",
            "hex": "#525195"
        },
        {
            "id": 43,
            "name": "Storm",
            "hex": "#757ADB"
        },
        {
            "id": 44,
            "name": "Twilight",
            "hex": "#484AA1"
        },
        {
            "id": 45,
            "name": "Indigo",
            "hex": "#2D237A"
        },
        {
            "id": 46,
            "name": "Sapphire",
            "hex": "#0D0A5B"
        },
        {
            "id": 47,
            "name": "Navy",
            "hex": "#212B5F"
        },
        {
            "id": 48,
            "name": "Cobalt",
            "hex": "#013485"
        },
        {
            "id": 49,
            "name": "Ultramarine",
            "hex": "#1C51E7"
        },
        {
            "id": 50,
            "name": "Blue",
            "hex": "#324BA9"
        },
        {
            "id": 51,
            "name": "Periwinkle",
            "hex": "#4866D5"
        },
        {
            "id": 52,
            "name": "Lapis",
            "hex": "#2F83FF"
        },
        {
            "id": 53,
            "name": "Splash",
            "hex": "#6394DD"
        },
        {
            "id": 54,
            "name": "Cornflower",
            "hex": "#76A8FF"
        },
        {
            "id": 55,
            "name": "Sky",
            "hex": "#AEC8FF"
        },
        {
            "id": 56,
            "name": "Stonewash",
            "hex": "#7895C1"
        },
        {
            "id": 57,
            "name": "Overcast",
            "hex": "#444F69"
        },
        {
            "id": 58,
            "name": "Steel",
            "hex": "#556979"
        },
        {
            "id": 59,
            "name": "Denim",
            "hex": "#2F4557"
        },
        {
            "id": 60,
            "name": "Abyss",
            "hex": "#0D1E25"
        },
        {
            "id": 61,
            "name": "Phthalo",
            "hex": "#0B2D46"
        },
        {
            "id": 62,
            "name": "Azure",
            "hex": "#0A3D67"
        },
        {
            "id": 63,
            "name": "Caribbean",
            "hex": "#0086CE"
        },
        {
            "id": 64,
            "name": "Teal",
            "hex": "#2B768F"
        },
        {
            "id": 65,
            "name": "Cerulean",
            "hex": "#00B4D5"
        },
        {
            "id": 66,
            "name": "Cyan",
            "hex": "#00FFF1"
        },
        {
            "id": 67,
            "name": "Robin",
            "hex": "#9AEAEF"
        },
        {
            "id": 68,
            "name": "Aqua",
            "hex": "#72C4C4"
        },
        {
            "id": 69,
            "name": "Turquoise",
            "hex": "#3CA2A4"
        },
        {
            "id": 70,
            "name": "Spruce",
            "hex": "#8DBCB4"
        },
        {
            "id": 71,
            "name": "Pistachio",
            "hex": "#E2FFE6"
        },
        {
            "id": 72,
            "name": "Seafoam",
            "hex": "#B2E2BD"
        },
        {
            "id": 73,
            "name": "Mint",
            "hex": "#9AFFC7"
        },
        {
            "id": 74,
            "name": "Jade",
            "hex": "#61AB89"
        },
        {
            "id": 75,
            "name": "Spearmint",
            "hex": "#148E67"
        },
        {
            "id": 76,
            "name": "Thicket",
            "hex": "#005D48"
        },
        {
            "id": 77,
            "name": "Peacock",
            "hex": "#1F483A"
        },
        {
            "id": 78,
            "name": "Emerald",
            "hex": "#20603F"
        },
        {
            "id": 79,
            "name": "Shamrock",
            "hex": "#236825"
        },
        {
            "id": 80,
            "name": "Jungle",
            "hex": "#1E361A"
        },
        {
            "id": 81,
            "name": "Hunter",
            "hex": "#1E2716"
        },
        {
            "id": 82,
            "name": "Forest",
            "hex": "#425035"
        },
        {
            "id": 83,
            "name": "Camo",
            "hex": "#51684C"
        },
        {
            "id": 84,
            "name": "Algae",
            "hex": "#97AF8B"
        },
        {
            "id": 85,
            "name": "Swamp",
            "hex": "#687F67"
        },
        {
            "id": 86,
            "name": "Avocado",
            "hex": "#567C34"
        },
        {
            "id": 87,
            "name": "Green",
            "hex": "#629C3F"
        },
        {
            "id": 88,
            "name": "Fern",
            "hex": "#7ECE73"
        },
        {
            "id": 89,
            "name": "Mantis",
            "hex": "#9BFF9D"
        },
        {
            "id": 90,
            "name": "Pear",
            "hex": "#8ECE56"
        },
        {
            "id": 91,
            "name": "Leaf",
            "hex": "#A5E32D"
        },
        {
            "id": 92,
            "name": "Radioactive",
            "hex": "#C6FF00"
        },
        {
            "id": 93,
            "name": "Honeydew",
            "hex": "#D1E572"
        },
        {
            "id": 94,
            "name": "Peridot",
            "hex": "#E8FCB4"
        },
        {
            "id": 95,
            "name": "Chartreuse",
            "hex": "#B4CD3D"
        },
        {
            "id": 96,
            "name": "Spring",
            "hex": "#A9A032"
        },
        {
            "id": 97,
            "name": "Crocodile",
            "hex": "#828335"
        },
        {
            "id": 98,
            "name": "Olive",
            "hex": "#697135"
        },
        {
            "id": 99,
            "name": "Murk",
            "hex": "#4B4420"
        },
        {
            "id": 100,
            "name": "Moss",
            "hex": "#7E7645"
        },
        {
            "id": 101,
            "name": "Goldenrod",
            "hex": "#BEA55D"
        },
        {
            "id": 102,
            "name": "Amber",
            "hex": "#C18E1B"
        },
        {
            "id": 103,
            "name": "Honey",
            "hex": "#D1B300"
        },
        {
            "id": 104,
            "name": "Lemon",
            "hex": "#FFE63B"
        },
        {
            "id": 105,
            "name": "Yellow",
            "hex": "#F9E255"
        },
        {
            "id": 106,
            "name": "Grapefruit",
            "hex": "#F7FF6F"
        },
        {
            "id": 107,
            "name": "Banana",
            "hex": "#FFEC80"
        },
        {
            "id": 108,
            "name": "Sanddollar",
            "hex": "#EDE8B0"
        },
        {
            "id": 109,
            "name": "Flaxen",
            "hex": "#FDE9AC"
        },
        {
            "id": 110,
            "name": "Ivory",
            "hex": "#FFD297"
        },
        {
            "id": 111,
            "name": "Buttercup",
            "hex": "#F6BF6C"
        },
        {
            "id": 112,
            "name": "Gold",
            "hex": "#E8AF49"
        },
        {
            "id": 113,
            "name": "Metals",
            "hex": "#D1B045"
        },
        {
            "id": 114,
            "name": "Marigold",
            "hex": "#FFB53C"
        },
        {
            "id": 115,
            "name": "Sunshine",
            "hex": "#FA912B"
        },
        {
            "id": 116,
            "name": "Saffron",
            "hex": "#FF8500"
        },
        {
            "id": 117,
            "name": "Sunset",
            "hex": "#FFA147"
        },
        {
            "id": 118,
            "name": "Peach",
            "hex": "#FFB576"
        },
        {
            "id": 119,
            "name": "Cantaloupe",
            "hex": "#FF984F"
        },
        {
            "id": 120,
            "name": "Orange",
            "hex": "#D5602B"
        },
        {
            "id": 121,
            "name": "Bronze",
            "hex": "#B2560D"
        },
        {
            "id": 122,
            "name": "Terracotta",
            "hex": "#B24407"
        },
        {
            "id": 123,
            "name": "Carrot",
            "hex": "#FF5500"
        },
        {
            "id": 124,
            "name": "Fire",
            "hex": "#EF5C23"
        },
        {
            "id": 125,
            "name": "Pumpkin",
            "hex": "#FF6841"
        },
        {
            "id": 126,
            "name": "Tangerine",
            "hex": "#FF7360"
        },
        {
            "id": 127,
            "name": "Cinnamon",
            "hex": "#C15A39"
        },
        {
            "id": 128,
            "name": "Caramel",
            "hex": "#C47149"
        },
        {
            "id": 129,
            "name": "Sand",
            "hex": "#B27749"
        },
        {
            "id": 130,
            "name": "Tan",
            "hex": "#C3996F"
        },
        {
            "id": 131,
            "name": "Beige",
            "hex": "#CABBA2"
        },
        {
            "id": 132,
            "name": "Stone",
            "hex": "#827A64"
        },
        {
            "id": 133,
            "name": "Taupe",
            "hex": "#6D675B"
        },
        {
            "id": 134,
            "name": "Slate",
            "hex": "#564D48"
        },
        {
            "id": 135,
            "name": "Driftwood",
            "hex": "#766259"
        },
        {
            "id": 136,
            "name": "Latte",
            "hex": "#977B6C"
        },
        {
            "id": 137,
            "name": "Dirt",
            "hex": "#774840"
        },
        {
            "id": 138,
            "name": "Clay",
            "hex": "#603E3D"
        },
        {
            "id": 139,
            "name": "Sable",
            "hex": "#57372C"
        },
        {
            "id": 140,
            "name": "Umber",
            "hex": "#301E1A"
        },
        {
            "id": 141,
            "name": "Soil",
            "hex": "#5A4534"
        },
        {
            "id": 142,
            "name": "Hickory",
            "hex": "#72573A"
        },
        {
            "id": 143,
            "name": "Tarnish",
            "hex": "#855B33"
        },
        {
            "id": 144,
            "name": "Ginger",
            "hex": "#91532A"
        },
        {
            "id": 145,
            "name": "Brown",
            "hex": "#8E5B3F"
        },
        {
            "id": 146,
            "name": "Chocolate",
            "hex": "#563012"
        },
        {
            "id": 147,
            "name": "Auburn",
            "hex": "#7B3C1D"
        },
        {
            "id": 148,
            "name": "Copper",
            "hex": "#A44B28"
        },
        {
            "id": 149,
            "name": "Rust",
            "hex": "#8B3220"
        },
        {
            "id": 150,
            "name": "Tomato",
            "hex": "#BA311C"
        },
        {
            "id": 151,
            "name": "Vermilion",
            "hex": "#E22D18"
        },
        {
            "id": 152,
            "name": "Ruby",
            "hex": "#CE000D"
        },
        {
            "id": 153,
            "name": "Cherry",
            "hex": "#AA0024"
        },
        {
            "id": 154,
            "name": "Crimson",
            "hex": "#850012"
        },
        {
            "id": 155,
            "name": "Garnet",
            "hex": "#581014"
        },
        {
            "id": 156,
            "name": "Sanguine",
            "hex": "#2D0102"
        },
        {
            "id": 157,
            "name": "Blood",
            "hex": "#451717"
        },
        {
            "id": 158,
            "name": "Maroon",
            "hex": "#652127"
        },
        {
            "id": 159,
            "name": "Berry",
            "hex": "#8C272D"
        },
        {
            "id": 160,
            "name": "Red",
            "hex": "#C1272D"
        },
        {
            "id": 161,
            "name": "Strawberry",
            "hex": "#DF3236"
        },
        {
            "id": 162,
            "name": "Cerise",
            "hex": "#A12928"
        },
        {
            "id": 163,
            "name": "Carmine",
            "hex": "#B13A3A"
        },
        {
            "id": 164,
            "name": "Brick",
            "hex": "#9A534D"
        },
        {
            "id": 165,
            "name": "Coral",
            "hex": "#CC6F6F"
        },
        {
            "id": 166,
            "name": "Blush",
            "hex": "#FEA0A0"
        },
        {
            "id": 167,
            "name": "Cottoncandy",
            "hex": "#EB799A"
        },
        {
            "id": 168,
            "name": "Watermelon",
            "hex": "#DB518D"
        },
        {
            "id": 169,
            "name": "Magenta",
            "hex": "#E934AA"
        },
        {
            "id": 170,
            "name": "Fuchsia",
            "hex": "#E7008B"
        },
        {
            "id": 171,
            "name": "Raspberry",
            "hex": "#8A024A"
        },
        {
            "id": 172,
            "name": "Wine",
            "hex": "#4D0F28"
        },
        {
            "id": 173,
            "name": "Mauve",
            "hex": "#9C4975"
        },
        {
            "id": 174,
            "name": "Pink",
            "hex": "#E77FBF"
        },
        {
            "id": 175,
            "name": "Bubblegum",
            "hex": "#E5A9FF"
        },
        {
            "id": 176,
            "name": "Rose",
            "hex": "#FFD6F6"
        },
        {
            "id": 177,
            "name": "Pearl",
            "hex": "#FBEDFA"
        }
    ];


})();